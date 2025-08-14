function addStartQuest(commandId, content) {
  insertNewCommand(getStartQuest(commandId));

  $("#useItem" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  $("#checkStageLoadFinish" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  if (scriptValue.length > 1) {
    $("#useItem" + commandId)
      .val(scriptValue[0])
      .trigger("change");
    $("#checkStageLoadFinish" + commandId)
      .val(scriptValue[1])
      .trigger("change");
  } else {
    $("#useItem" + commandId)
      .val(content)
      .trigger("change");
    $("#checkStageLoadFinish" + commandId)
      .val(0)
      .trigger("change");
  }
}

function getStartQuest(id) {
  return getCommandItem(
    id,
    "進入關卡",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>使用活動道具</div>" +
      '<select id = "useItem' +
      id +
      '">' +
      '<option value = "-1" selected>不使用</option>' +
      '<option value = "0">一</option>' +
      '<option value = "1">二</option>' +
      '<option value = "2">三</option>' +
      '<option value = "3">四</option>' +
      '<option value = "4">五</option>' +
      '<option value = "5">六</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>檢查開場演出</div>" +
      '<select id = "checkStageLoadFinish' +
      id +
      '">' +
      '<option value = "0" selected>不檢查</option>' +
      '<option value = "1">檢查</option></select></div>' +
      "<div class='commandSelectDiv'>如果討伐戰有開場演出，請打開檢查開場演出</div>"
  );
}

function getStartQuestScript(itemId) {
  return (
    "startQuest(" +
    $("#useItem" + itemId).val() +
    "," +
    $("#checkStageLoadFinish" + itemId).val() +
    ");"
  );
}
