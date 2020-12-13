const fishManager = require('./fish.js');
const taskManager = require('./task.js');

main()
{
  fishManager.autoFish();
  taskManager.autoTask();
}
main()