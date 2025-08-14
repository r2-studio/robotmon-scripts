function addFinish(commandId) {
  insertNewCommand(getFinishItem(commandId));
}

function getFinishItem(id) {
  return getCommandItem(id, "結束關卡");
}

function getFinishScript(itemId){
  return "finishQuest();"
}