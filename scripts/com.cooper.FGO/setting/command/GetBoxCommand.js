function addGetBox(commandId, content) {
  insertNewCommand(getGetBox(commandId));

  $("#getBoxReset" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "80px",
  });
  $("#getBoxFast" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "80px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#getBoxReset" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#getBoxFast" + commandId)
    .val(scriptValue[1])
    .trigger("change");
}

function getGetBox(id) {
  return getCommandItem(
    id,
    "抽箱",
    "<div class='commandSelectDiv'>日服已內建自動換箱，台服連續抽箱請開啟自動重置</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>快速模式</div>" +
      '<select id = "getBoxFast' +
      id +
      '">' +
      '<option value = "0">關閉</option>' +
      '<option value = "1" selected>開啟</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>自動重置</div>" +
      '<select id = "getBoxReset' +
      id +
      '">' +
      '<option value = "0" selected>否</option>' +
      '<option value = "1">是</option></select></div>' +
      "<div class='commandSelectDiv'>台服注意:自動重置開啟時，中獎後會點擊重置按鈕，想抽乾前十箱請小心</div>"
  );
}

function getBoxScript(itemId) {
  return (
    "getBox(" +
    $("#getBoxReset" + itemId).val() +
    "," +
    $("#getBoxFast" + itemId).val() +
    ");"
  );
}
