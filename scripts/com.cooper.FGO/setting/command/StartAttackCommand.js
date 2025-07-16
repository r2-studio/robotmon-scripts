function addStartAttack(commandId) {
  insertNewCommand(getStartAttackItem(commandId));
}

function getStartAttackItem(id) {
  return getCommandItem(id, "開始選卡");
}

function getStartAttackScript(itemId) {
  return "startAttack();";
}
