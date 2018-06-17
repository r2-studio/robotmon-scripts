function Context() {
  this.isStart = false;
  this.isPause = false;
  this.params = new Params();
  this.config = new Config();
  this.pages = {};
  this.currentPage = undefined;
  this.currentTask = undefined;
  this.screenshot = 0;
}

Context.prototype.getParams = function(key) {
  if (this.params[key] !== undefined) {
    return this.params[key];
  } else {
    this.debug("Params not exist, key: " + key);
  }
}

Context.prototype.getConfig = function(key) {
  if (this.config[key] !== undefined) {
    return this.config[key];
  } else {
    this.debug("Config not exist, key: " + key);
  }
}

Context.prototype.delayTask = function(pageName, taskName, time) {
  if (this.pages[pageName] !== undefined && this.pages[pageName]._tasks[taskName] !== undefined) {
    this.pages[pageName]._tasks[taskName]._delayUntil = Date.now() + time;
  } else {
    this.debug("Task not exist", pageName, taskName);
  }
}

Context.prototype.delay = function(time) {
  if (this.currentTask !== undefined) {
    this.currentTask._delayUntil = Date.now() + time;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.doNextTask = function() {
  if (this.currentTask !== undefined) {
    this.currentTask._doNextTask = true;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.doAgainTask = function() {
  if (this.currentTask !== undefined) {
    this.currentTask._doAgainTask = true;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.exitPage = function() {
  if (this.currentPage !== undefined) {
    this.currentPage._wantExit = true;
  } else {
    this.debug("Page not exist");
  }
}

Context.prototype.waitForChange = function() {}

Context.prototype.getScreenshot = function(update) {
  if (this.screenshot !== 0 && update) {
    releaseImage(this.screenshot);
    this.screenshot = 0;
    if (this.currentPage !== undefined) {
      this.screenshot = this.currentPage.onScreenshot();
    }
  }
  return this.screenshot;
}

Context.prototype.sleep = function(time) {
  while(time > 0) {
    if (time <= 100) {
      sleep(time);
      break;
    }
    sleep(100);
    time -= 100;
  }
}

Context.prototype.debug = function() {
  if (this.config.debug) {
    this.log.apply(this, arguments);
  }
}

Context.prototype.log = function() {
  var newArgs = [];
  for (var i in arguments) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      newArgs.push(JSON.stringify(arg));
    } else {
      newArgs.push(arg);
    }
  }
  console.log.apply(null, newArgs);
}