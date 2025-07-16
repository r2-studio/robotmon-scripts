function addSelectStage(commandId, content) {
  insertNewCommand(getSelectStage(commandId));

  $("#autoApple" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#autoApple" + commandId)
    .val(content)
    .trigger("change");
}

function getSelectStage(id) {
  return getCommandItem(
    id,
    "選擇關卡",
    "<div class='commandSelectDiv'>開啟畫面上方的任務</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>自動吃果</div>" +
      '<select id = "autoApple' +
      id +
      '">' +
      '<option value = "-1" selected>無</option>' +
      '<option value = "0">赤銅蘋果</option>' +
      '<option value = "5">青銅蘋果</option>' +
      '<option value = "1">銀蘋果</option>' +
      '<option value = "2">金蘋果</option>' +
      '<option value = "4">自然回體</option>' +
      '<option value = "3">聖晶石</option></select></div>'
  );
}

function getSelectStageScript(itemId) {
  return "selectStage(" + $("#autoApple" + itemId).val() + ");";
}
