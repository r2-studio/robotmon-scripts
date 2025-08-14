function addUseUlt(commandId, content) {
  insertNewCommand(getUseUltItem(commandId));

  $("#useUlt" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#useUlt" + commandId)
    .val(content)
    .trigger("change");
}

function getUseUltItem(id) {
  return getCommandItem(
    id,
    "使用寶具",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>寶具</div>" +
      '<select id = "useUlt' +
      id +
      '">' +
      '<option value = "0">從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>'
  );
}

function getUseUltScript(itemId) {
  return "useUlt(" + $("#useUlt" + itemId).val() + ");";
}
