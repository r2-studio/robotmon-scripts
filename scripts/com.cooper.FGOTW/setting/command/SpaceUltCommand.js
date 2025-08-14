function addSpaceUlt(commandId, content) {
  insertNewCommand(getSpaceUltItem(commandId));

  $("#spaceUltColor" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#spaceUltColor" + commandId)
    .val(content)
    .trigger("change");
}

function getSpaceUltItem(id) {
  return getCommandItem(
    id,
    "技能改變寶具顏色",
    "<div class='commandSelectDiv'>請將此指令放在最上面</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>寶具顏色</div>" +
      '<select id = "spaceUltColor' +
      id +
      '">' +
      '<option value = "2" selected>綠</option>' +
      '<option value = "1">藍</option>' +
      '<option value = "0">紅</option></select></div>'
  );
}

function getSpaceUltScript(itemId) {
  return "setSpaceUltColor(" + $("#spaceUltColor" + itemId).val() + ");";
}
