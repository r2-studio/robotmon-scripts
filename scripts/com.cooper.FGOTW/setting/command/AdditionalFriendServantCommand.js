function addAdditionalFriendServant(commandId, content) {
  insertNewCommand(getAdditionalFriendServent(commandId));

  $("#additionalFriendServant" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  for (var i = 0; i < friendServantList.length; i++) {
    $("#additionalFriendServant" + commandId).append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  $("#additionalFriendServant" + commandId).change(function () {
    if ($(this).val() != -1) {
      var path = servantImgPath + $(this).select2("data")[0].text + ".png";
      $("#additionalFriendServantImg" + commandId).attr("src", path);
    } else {
      $("#additionalFriendServantImg" + commandId)
        .removeAttr("src")
        .replaceWith($("#additionalFriendServantImg" + commandId).clone());
    }
  });
  $("#additionalFriendServant" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });

  if (content == undefined) {
    return;
  }
  for (var i = 0; i < friendServantList.length; i++) {
    if (
      new String(friendServantList[i]).valueOf() ==
      new String(content).valueOf()
    ) {
      $("#additionalFriendServant" + commandId)
        .val(i)
        .trigger("change");
      break;
    }
  }
}

function getAdditionalFriendServent(id) {
  return getCommandItem(
    id,
    "好友從者多選",
    "<div class='commandSelectDiv'>請將此指令放在選擇好友指令之前，會從全部的指定從者中做選擇</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "additionalFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "additionalFriendServantImg' +
      id +
      '"></div>'
  );
}

function getAdditionalFriendServantScript(itemId) {
  var servant = "";
  if ($("#additionalFriendServant" + itemId).val() != -1) {
    servant = $("#additionalFriendServant" + itemId).select2("data")[0].text;
  }
  return 'additionalFriendServant("' + servant + '");';
}

/*
function getAdditionalFriendItem(id) {
  return getCommandItem(
    id,
    "好友禮裝多選",
    "<div class='commandSelectDiv'>敘述</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "additionalFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "additionalFriendServantImg' +
      id +
      '"></div>'
  );
}
*/
