function addGetFriendPoint(commandId) {
  insertNewCommand(getGetFriendPoint(commandId));
}

function getGetFriendPoint(id) {
  return getCommandItem(
    id,
    "友抽",
    "<div class='commandSelectDiv'>請移動到友抽頁面後再執行腳本</div>"
  );
}

function getFriendPointScript(itemId) {
  return "getFriendPoint();";
}
