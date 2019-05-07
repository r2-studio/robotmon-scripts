function TaskController() {
  this.tasks = {};
  this.isRunning = false;
  this.interval = 200;
};

TaskController.prototype.getFirstPriorityTaskName = function() {
  var pTask = null;
  // var priority = 100;
  var now = Date.now();
  for (var name in this.tasks) {
    var task = this.tasks[name];
    if (now - task.lastRunTime < task.interval) {
      continue;
    }
    if (pTask === null) {
      pTask = task;
      continue;
    }
    if (task.priority < pTask.priority) {
      pTask = task;
      continue;
    }
    if (task.interval > pTask.interval) {
      pTask = task;
      continue;
    }
    if (task.lastRunTime < pTask.lastRunTime) {
      pTask = task;
      continue;
    }
  }
  if (pTask === null) {
    return '';
  }
  return pTask.name;
};

TaskController.prototype.loop = function() {
  console.log('loop start');
  while (this.isRunning) {
    var taskName = this.getFirstPriorityTaskName();
    var task = this.tasks[taskName];
    if (task !== undefined) {
      task.run();
      task.lastRunTime = Date.now();
      task.runTimes--;
      if (task.runTimes === 0) {
        delete this.tasks[taskName];
      }
    }
    sleep(this.interval);
  }
  this.isRunning = false;
  console.log('loop stop');
};

TaskController.prototype.updateRunInterval = function(interval) {
  if (interval < this.interval && interval >= 50) {
    // min interval = 50
    this.interval = interval;
  }
};

TaskController.prototype.newTaskObject = function(name, func, interval, runTimes, priority) {
  var task = {
    name: name,
    run: func,
    interval: interval || 1000, // 1 second
    runTimes: runTimes || 0, // <= 0 unlimit
    priority: priority, // same as linux, user can not controll this
    lastRunTime: 0, // last run time in millis
    status: 0, // 0 wait, 1 running
  };
  return task;
};

TaskController.prototype.newTask = function(name, func, interval, runTimes, nextRun) {
  if (nextRun === undefined) {
    nextRun = false;
  }
  if (typeof func !== 'function') {
    console.log('Error not a function', name, func);
    return;
  }
  var newTask = this.newTaskObject(name, func, interval, runTimes, 0);
  if (nextRun) {
    newTask.lastRunTime = Date.now();
  }
  this.updateRunInterval(newTask.interval);

  var taskName = 'system_newTask_' + name;
  var sysTask = this.newTaskObject(taskName, function() {
    this.tasks[name] = newTask;
  }.bind(this), 0, 1, -20);
  this.tasks[taskName] = sysTask;
  return newTask;
};

TaskController.prototype.removeTask = function(name) {
  var taskName = 'system_removeTask_' + Date.now().toString();
  var sysTask = this.newTaskObject(taskName, function() {
    delete this.tasks[name];
  }.bind(this), 0, 1, -20);
  this.tasks[taskName] = sysTask;
};

TaskController.prototype.removeAllTasks = function() {
  var taskName = 'system_removeAllTask_' + Date.now().toString();
  var sysTask = this.newTaskObject(taskName, function() {
    for (var k in this.tasks) {
      delete this.tasks[k];
    }
  }.bind(this), 0, 1, -20);
  this.tasks[taskName] = sysTask;
};

TaskController.prototype.start = function() {
  if (!this.isRunning) {
    this.isRunning = true;
    this.loop();
  }
};

TaskController.prototype.stop = function() {
  if (this.isRunning) {
    this.isRunning = false;
    console.log('wait loop stop...');
  }
};
