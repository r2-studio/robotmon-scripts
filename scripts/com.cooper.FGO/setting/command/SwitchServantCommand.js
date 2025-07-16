function addSwitchServant(commandId, content) {
  insertNewCommand(getSwitchServantItem(commandId));

  $("#switchServantFront" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#switchServantBack" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#switchServantFront" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#switchServantBack" + commandId)
    .val(scriptValue[1])
    .trigger("change");
}

function getSwitchServantItem(id) {
  return getCommandItem(
    id,
    "戰鬥服換人",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>前場從者</div>" +
      '<select id = "switchServantFront' +
      id +
      '">' +
      '<option value = "0"selected>從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>後場從者</div>" +
      '<select id = "switchServantBack' +
      id +
      '">' +
      '<option value = "3"selected>從者4</option>' +
      '<option value = "4">從者5</option>' +
      '<option value = "5">從者6</option></select></div>'
  );
}

function getSwitchServantScript(itemId) {
  return (
    "switchServant(" +
    $("#switchServantFront" + itemId).val() +
    "," +
    $("#switchServantBack" + itemId).val() +
    ");"
  );
}
