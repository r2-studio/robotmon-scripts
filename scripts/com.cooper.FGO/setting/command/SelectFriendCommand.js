function getSelectFriend(id) {
  return getCommandItem(
    id,
    "選擇好友",
    "<div class='commandSelectDiv'>如需篩選同一從者不同靈基，請使用\"好友從者多選\"指令</div>" +
      "<div class='commandSelectClassDiv'>" +
      "<div class='commandItem'>搜尋職階</div>" +
      '<div class="servantClassDiv2L">' +
      "<div class='servantClassDiv'>" +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend0' +
      id +
      '">全</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend1' +
      id +
      '">劍</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend2' +
      id +
      '">弓</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend3' +
      id +
      '">槍</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend4' +
      id +
      '">騎</div>' +
      "</div><div class='servantClassDiv'>" +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend5' +
      id +
      '">術</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend6' +
      id +
      '">殺</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend7' +
      id +
      '">狂</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend8' +
      id +
      '">特</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend9' +
      id +
      '"checked>混</div></div></div></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "selectFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "selectFriendServantImg' +
      id +
      '"></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定禮裝</div>" +
      '<select id = "selectFriendItem' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendItemImg" id = "selectFriendItemImg' +
      id +
      '"></div>' +
      "<div class='commandSelectDiv'>建議優先使用遊戲內建的禮裝篩選</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>禮裝滿突</div>" +
      '<select id = "selectFriendItemFull' +
      id +
      '">' +
      '<option value = "0">不限制</option>' +
      '<option value = "1" selected>滿突</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>限定好友</div>" +
      '<select id = "selectFriendOnlyFriend' +
      id +
      '">' +
      '<option value = "0" selected>不限制</option>' +
      '<option value = "1">僅限好友</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>下拉次數</div>" +
      '<select id = "selectFriendScrollCnt' +
      id +
      '">' +
      '<option value = "-1" selected>到最後</option>' +
      '<option value = "0">不下拉</option>' +
      '<option value = "1">一次</option>' +
      '<option value = "2">兩次</option>' +
      '<option value = "3">三次</option>' +      
      '<option value = "-2">直到出現非好友</option>' +
      '<option value = "-3">直到出現非冠位從者</option>' +
      '</select></div>' +
      //冠位從者選項
      // TODO      
      // 僅限冠位從者
      "<div class='commandSelectDiv'></div>" +
      "<div class='commandSelectDiv'>以下選項僅在冠位戴冠戰中生效</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>僅限冠位從者</div>" +
      '<select id = "selectFriendGrandOnly' +
      id +
      '">' +
      '<option value = "0" selected>不限定</option>' +
      '<option value = "1">限定</option></select></div>' +

      // 絆禮裝
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>冠位從者絆禮裝</div>" +
      '<select id = "selectFriendGrandKitsunaItem' +
      id +
      '">' +
      '<option value = "-1" selected>不限定禮裝</option>' +
      '<option value = "0" selected>絆禮裝不限效果</option>'+
      '<option value = "1">絆禮裝通常效果</option>' +
      '<option value = "2">絆禮裝限定效果(50np)</option></select></div>' +
      // 報酬禮裝
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>冠位從者報酬禮裝</div>" +
      '<select id = "selectFriendGrandRewardItem' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendItemImg" id = "selectFriendGrandRewardItemImg' +
      id +
      '"></div>'
  );
}

function addSelectFriend(commandId, content) {
  insertNewCommand(getSelectFriend(commandId));

  for (var i = 0; i < friendServantList.length; i++) {
    $("#selectFriendServant" + commandId).append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  $("#selectFriendServant" + commandId).change(function () {
    if ($(this).val() != -1) {
      var path = servantImgPath + $(this).select2("data")[0].text + ".png";
      $("#selectFriendServantImg" + commandId).attr("src", path);
    } else {
      $("#selectFriendServantImg" + commandId)
        .removeAttr("src")
        .replaceWith($("#selectFriendServantImg" + commandId).clone());
    }
  });
  $("#selectFriendServant" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  for (var i = 0; i < friendItemList.length; i++) {
    $("#selectFriendItem" + commandId).append(
      '<option value = "' + i + '">' + friendItemList[i] + "</option>"
    );
    $("#selectFriendGrandRewardItem" + commandId).append(
      '<option value = "' + i + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#selectFriendItem" + commandId).change(function () {
    if ($(this).val() != -1) {
      var path = itemImgPath + $(this).select2("data")[0].text + ".png";
      $("#selectFriendItemImg" + commandId).attr("src", path);
    } else {
      $("#selectFriendItemImg" + commandId)
        .removeAttr("src")
        .replaceWith($("#selectFriendItemImg" + commandId).clone());
    }
  });
  $("#selectFriendItem" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendGrandRewardItem" + commandId).change(function () {
    if ($(this).val() != -1) {
      var path = itemImgPath + $(this).select2("data")[0].text + ".png";
      $("#selectFriendGrandRewardItemImg" + commandId).attr("src", path);
    } else {
      $("#selectFriendGrandRewardItemImg" + commandId)
        .removeAttr("src")
        .replaceWith($("#selectFriendGrandRewardItemImg" + commandId).clone());
    }
  });
  $("#selectFriendItemFull" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendOnlyFriend" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendScrollCnt" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendGrandOnly" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendGrandKitsunaItem" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#selectFriendGrandRewardItem" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  var t = 1;
  for (var i = 0; i < 10; i++) {
    if (scriptValue[0] & t) {
      $("#selectFriend" + i + "" + commandId).prop("checked", true);
    } else {
      $("#selectFriend" + i + "" + commandId).prop("checked", false);
    }
    t *= 2;
  }
  for (var i = 0; i < friendServantList.length; i++) {
    if (
      new String(friendServantList[i]).valueOf() ==
      new String(scriptValue[1]).valueOf()
    ) {
      $("#selectFriendServant" + commandId)
        .val(i)
        .trigger("change");
      break;
    }
  }
  for (var i = 0; i < friendItemList.length; i++) {
    if (friendItemList[i] == scriptValue[2]) {
      $("#selectFriendItem" + commandId)
        .val(i)
        .trigger("change");
      break;
    }
  }
  $("#selectFriendItemFull" + commandId)
    .val(scriptValue[3])
    .trigger("change");

  if (scriptValue.length > 4) {
    $("#selectFriendOnlyFriend" + commandId)
      .val(scriptValue[4])
      .trigger("change");
  }
  if (scriptValue.length > 5) {
    $("#selectFriendScrollCnt" + commandId)
      .val(scriptValue[5])
      .trigger("change");
  }
  if (scriptValue.length > 8) {
    $("#selectFriendGrandOnly" + commandId)
      .val(scriptValue[6])
      .trigger("change");
    $("#selectFriendGrandKitsunaItem" + commandId)
      .val(scriptValue[7])
      .trigger("change");
    for (var i = 0; i < friendItemList.length; i++) {
      if (friendItemList[i] == scriptValue[8]) {
        $("#selectFriendGrandRewardItem" + commandId)
          .val(i)
          .trigger("change");
        break;
      }
    }
  }
}

function getSelectFriendScript(itemId) {
  var filter = 0;
  var t = 1;
  for (var i = 0; i < 10; i++) {
    if ($("#selectFriend" + i + "" + itemId).is(":checked")) {
      filter += t;
    }
    t *= 2;
  }
  var servant = "";
  if ($("#selectFriendServant" + itemId).val() != -1) {
    servant = $("#selectFriendServant" + itemId).select2("data")[0].text;
  }
  var item = "";
  if ($("#selectFriendItem" + itemId).val() != -1) {
    item = $("#selectFriendItem" + itemId).select2("data")[0].text;
  }
  var grandRewardItem = "";
  if ($("#selectFriendGrandRewardItem" + itemId).val() != -1) {
    grandRewardItem = $("#selectFriendGrandRewardItem" + itemId).select2("data")[0].text;
  }
  return (
    "selectFriend(" +
    filter +
    ',"' +
    servant +
    '","' +
    item +
    '",' +
    $("#selectFriendItemFull" + itemId).val() +
    "," +
    $("#selectFriendOnlyFriend" + itemId).val() +
    "," +
    $("#selectFriendScrollCnt" + itemId).val() +
    "," +
    $("#selectFriendGrandOnly" + itemId).val() +
    "," +
    $("#selectFriendGrandKitsunaItem" + itemId).val() +
    ',"' +
    grandRewardItem +
    '");'
  );
}
