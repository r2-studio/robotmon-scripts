function addSelectCard(commandId, content) {
  insertNewCommand(getSelectCardItem(commandId));

  $("#selectCard" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#selectCard" + commandId)
    .val(content)
    .trigger("change");
}

function getSelectCardItem(id) {
  return getCommandItem(
    id,
    "選擇卡片",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>卡片</div>" +
      '<select id = "selectCard' +
      id +
      '">' +
      '<option value = "0">卡片1</option>' +
      '<option value = "1">卡片2</option>' +
      '<option value = "2">卡片3</option>' +
      '<option value = "3">卡片4</option>' +
      '<option value = "4">卡片5</option></select></div>'
  );
}

function getSelectCardScript(itemId) {
  return "selectCard(" + $("#selectCard" + itemId).val() + ");";
}
