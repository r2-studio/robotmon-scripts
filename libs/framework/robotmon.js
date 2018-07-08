var global = this;

function Robotmon() {
  this.onInit = function() {};
  this.context = new Context();
  this._screenshot = 0;
}

Robotmon.prototype.registObject = function(obj) {
  obj.context = this.context;
  return obj;
}

Robotmon.prototype.registAll = function(obj) {
  for (var name in global) {
    var obj = global[name];
    if (typeof obj !== 'object' ) {
      continue;
    }
    if (obj instanceof Page) {
      this.addPage(obj);
    } else if (obj instanceof Feature || obj instanceof Line || obj instanceof Point || obj instanceof Rect) {
      this.registObject(obj);
    }
  }
  for (var name in global) {
    var obj = global[name];
    if (typeof obj === 'object' && obj instanceof Task) {
      this.addTask(obj.page, obj);
    }
  }
  this.context.debug('register All done');
}

Robotmon.prototype.addPage = function(page) {
  if (page.name === undefined || page.name === "") {
    this.context.debug('Page.name is not set');
    return;
  }
  page.context = this.context;
  this.context.pages[page.name] = page;
}

Robotmon.prototype.addTask = function(page, task) {
  if (task.name === undefined || task.name === "") {
    this.context.debug('Task.name is not set');
    return;
  }
  var pageName = "";
  if (typeof page === 'string') {
    pageName = page;
  } else if (typeof page === 'object'){
    pageName = page.name;
  }
  if (this.context.pages[pageName] === undefined) {
    this.context.debug('Task do not have Page parent, should regist Page first');
    return;
  }
  task.context = this.context;
  this.context.pages[pageName]._tasks[task.name] = task;
}

Robotmon.prototype.init = function() {
  var pageCount = 0;
  var taskCount = 0;
  for(var pageName in this.context.pages) {
    var page = this.context.pages[pageName];
    if (!page._isInit) {
      this.context.debug('Init page: ' + page.name);
      page.onInit();
    }
    pageCount++;
    for (var taskName in page._tasks) {
      var task = page._tasks[taskName];
      if (!task._isInit) {
        this.context.debug('Init task: ' + task.name);
        task.onInit();
      }
      taskCount++;
    }
  }
  if (pageCount === 0 || taskCount === 0) {
    this.context.debug('Error page count: ' + pageCount + ' task count: ' + taskCount);
    return false;
  }
  this.onInit();
  return true;
}

Robotmon.prototype._changePage = function(page) {
  var name = "";
  if (page !== undefined) {
    name = page.name;
  }
  if (this.context.currentPage === undefined) {
    this.context.currentPage = page;
    if (this.context.currentPage !== undefined) {
      this.context.currentPage.onEnter();
    }
  } else if (this.context.currentPage !== undefined && this.context.currentPage.name !== name) {
    this.context.currentPage.onExit();
    this.context.currentPage = page;
    this.context.currentPage.onEnter();
  }
}

Robotmon.prototype._changeTask = function(task) {
  var name = "";
  if (task !== undefined) {
    name = task.name;
  }
  if (this.context.currentTask === undefined) {
    this.context.currentTask = task;
    if (this.context.currentTask !== undefined) {
      this.context.currentTask.onEnter();
    }
  } else if (this.context.currentTask !== undefined && this.context.currentTask.name !== name) {
    this.context.currentTask.onExit();
    this.context.currentTask = task;
    this.context.currentTask.onEnter();
  }
}

Robotmon.prototype._runPage = function() {
  while (this.context.isStart) {
    while (this.context.isPause) {
      this.context.sleep(this.context.config.pauseSleepTime);
      continue;
    }
    for(var pageName in this.context.pages) {
      var page = this.context.pages[pageName];
      var tmpPage = this.context.currentPage;
      this.context.currentPage = page;
      var tmpImg = page.onScreenshot();
      var isPage = page.onPage();
      releaseImage(tmpImg);
      this.context.currentPage = tmpPage;
      if (isPage) {
        this._changePage(page);
        page._wantExit = false;
        this._runTask();
        break;
      }
    }
  }
  this._changePage(undefined);
}

Robotmon.prototype._runTask = function() {
  var page = this.context.currentPage;
  // implement Context.exitPage
  while (this.context.isStart && !page._wantExit) {
    while (this.context.isPause) {
      this.context.sleep(this.context.config.pauseSleepTime);
      continue;
    }
    var screenshot = this.context.getScreenshot(true);
    var isInPage = page.onPage(screenshot);
    if (!isInPage) {
      break;
    }
    var hasTask = false;
    // implement Context.doAgainTask 2
    if (this.context.currentTask !== undefined && this.context.currentTask._doAgainTask) {
      this.context.currentTask._doAgainTask = false;
      this.context.currentTask.onRun();
      continue;
    }
    if (screenshot === 0) {
      this.context.log("Error: cant not get page screenshot");
      break;
    }
    for (var taskName in page._tasks) {
      var task = page._tasks[taskName];
      // implement Context.delay Context.delayTask
      if (task._delayUntil > Date.now()) {
        continue;
      }
      var isTask = task.onTask(this.context.getScreenshot(false));
      if (isTask) {
        hasTask = true;
        this._changeTask(task);
        task.onRun();
        // implement Context.doAgainTask 1
        if (task._doAgainTask) {
          break;
        } 
        // implement Context.doNextTask
        if (task._doNextTask) {
          task._doNextTask = false;
          continue;
        }
        break;
      }
    }
    if (!hasTask) {
      break;
    }
  }
  this._changeTask(undefined);
}

Robotmon.prototype.start = function (jsonParams) {
  this.context.config.update();
  this.context.params.update(jsonParams);
  this.context.isStart = true;
  this.context.isPause = false;
  if (this.init()) {
    this._runPage();
  }
  this.context.log('All task stopped');
  this.context.isStart = false;
}
Robotmon.prototype.pause = function () {
  if (this.context.isPause === true) {
    this.context.isPause = false;
  } else {
    this.context.isPause = true;
  }
}
Robotmon.prototype.stop = function () {
  this.context.log('Waiting for stopping...');
  this.context.isStart = false;
}