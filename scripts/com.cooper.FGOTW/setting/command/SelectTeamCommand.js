function addSelectTeam(commandId, content) {
  insertNewCommand(getSelectTeam(commandId));

  $("#selectTeam" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (server != "JP") {
    $("#selectTeamAutoBuild" + commandId).css("display", "none");
    $("#selectTeamAutoBuildTitle" + commandId).css("display", "none");
  } else {
    $("#selectTeamAutoBuild" + commandId).select2({
      minimumResultsForSearch: -1,
      width: "120px",
    });
  }

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  var teamIndex = scriptValue[0];
  var autoBuild = 0;
  if (scriptValue.length >= 2) {
    autoBuild = scriptValue[1];
  }
  $("#selectTeam" + commandId)
    .val(teamIndex)
    .trigger("change");

  if (server == "JP") {
    $("#selectTeamAutoBuild" + commandId)
      .val(autoBuild)
      .trigger("change");
  }
}

function getSelectTeam(id) {
  return getCommandItem(
    id,
    "選擇隊伍",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>隊伍</div>" +
      '<select id = "selectTeam' +
      id +
      '">' +
      '<option value = "0" selected>隊伍1</option>' +
      '<option value = "1">隊伍2</option>' +
      '<option value = "2">隊伍3</option>' +
      '<option value = "3">隊伍4</option>' +
      '<option value = "4">隊伍5</option>' +
      '<option value = "5">隊伍6</option>' +
      '<option value = "6">隊伍7</option>' +
      '<option value = "7">隊伍8</option>' +
      '<option value = "8">隊伍9</option>' +
      '<option value = "9">隊伍10</option>' +
      '<option value = "10">隊伍11</option>' +
      '<option value = "11">隊伍12</option>' +
      '<option value = "12">隊伍13</option>' +
      '<option value = "13">隊伍14</option>' +
      '<option value = "14">隊伍15</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      '<div class="commandItem"  id = "selectTeamAutoBuildTitle' +
      id +
      '">自動編成</div>' +
      '<select id = "selectTeamAutoBuild' +
      id +
      '">' +
      '<option value = "0" selected>不啟用</option>' +
      '<option value = "1">啟用</option></select></div>'
  );
}

function getSelectTeamScript(itemId) {
  return (
    "selectTeam(" +
    $("#selectTeam" + itemId).val() +
    "," +
    $("#selectTeamAutoBuild" + itemId).val() +
    ");"
  );
}
