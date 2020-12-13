
var unit = require('./unit.js');

function TaskManager() {
  this.init();
}
TaskManager.prototype.init = function () {
  console.log("TaskManager Init");
}

TaskManager.prototype.autoTask = function () {
  console.log("autoTask");
}

TaskManager.prototype.moveToTask = function () {
  console.log("moveToTask");
  tap(518, 24, 50);
  sleep(3000);
  tap(444, 25, 50);
  sleep(3000);
  tap(322, 228, 50);
  sleep(3000);
  tap(322, 293, 50);
  sleep(3000);
}

TaskManager.prototype.acceptTask = function () {
  console.log("acceptTask");
  var diff = 120;
  for (var i = 0; i < 5; ++i) {
    tap(116 + (diff * i), 116, 50);
    sleep(3000);
    if ()
    tap(328, 283, 50);
    sleep(3000);
    tap(96  + (diff * i), 231, 50);
    sleep(3000);
    tap(328, 283, 50);
    sleep(3000);
  }
}

TaskManager.prototype.doTask = function () {
  console.log("doTask");
}

//var t = new TaskManager();
//t.moveToTask();
module.exports = TaskManager;