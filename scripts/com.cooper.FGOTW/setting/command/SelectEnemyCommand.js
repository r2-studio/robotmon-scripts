function addSelectEnemy(commandId, content) {
  insertNewCommand(getSelectEnemy(commandId));

  $("#selectEnemy" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#selectEnemy" + commandId)
    .val(content)
    .trigger("change");
}

function getSelectEnemy(id) {
  return getCommandItem(
    id,
    "選擇敵人",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>敵人(右上為1)</div>" +
      '<select id = "selectEnemy' +
      id +
      '">' +
      '<option value = "0">敵人1</option>' +
      '<option value = "1">敵人2</option>' +
      '<option value = "2">敵人3</option>' +
      '<option value = "3">敵人4</option>' +
      '<option value = "4">敵人5</option>' +
      '<option value = "5">敵人6</option></select></div>'
  );
}

function getSelectEnemyScript(itemId) {
  return "selectEnemy(" + $("#selectEnemy" + itemId).val() + ");";
}
