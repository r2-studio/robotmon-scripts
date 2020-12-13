var FishManager = require('./fish.js');
var TaskManager = require('./task.js');

function main() {
  var fishManager = new FishManager();
  var taskManager = new TaskManager();
  //fishManager.autoFish();
  taskManager.acceptTask();
}
main()
console.log("Done!");