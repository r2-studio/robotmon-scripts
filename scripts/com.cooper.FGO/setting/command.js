//command to script
function getCurrentScript() {
  var newScript = "";
  $("#skill-list")
    .children()
    .each(function () {
      var itemTitle = $(this).find("label:first").text();
      var itemId = $(this).find("label:first").attr("name");
      switch (itemTitle) {
        case "友抽":
          newScript += "getFriendPoint();";
          break;
        case "抽箱":
          newScript +=
            "getBox(" +
            $("#getBoxReset" + itemId).val() +
            "," +
            $("#getBoxFast" + itemId).val() +
            ");";
          break;
        case "選擇關卡":
          newScript += "selectStage(" + $("#autoApple" + itemId).val() + ");";
          break;
        case "選擇好友":
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
            servant = $("#selectFriendServant" + itemId).select2("data")[0]
              .text;
          }
          var item = "";
          if ($("#selectFriendItem" + itemId).val() != -1) {
            item = $("#selectFriendItem" + itemId).select2("data")[0].text;
          }
          newScript +=
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
            ");";
          break;
        case "選擇隊伍":
          newScript += "selectTeam(" +
          $("#selectTeam" + itemId).val() + 
          ',' +
          $("#selectTeamAutoBuild" + itemId).val() + 
          ");";
          break;
        case "進入關卡":
          newScript +=
            "startQuest(" +
            $("#useItem" + itemId).val() +
            "," +
            $("#checkStageLoadFinish" + itemId).val() +
            ");";
          break;
        case "結束關卡":
          newScript += "finishQuest();";
          break;
        case "使用技能":
          newScript +=
            "useSkill(" +
            $("#useSkillServant" + itemId).val() +
            "," +
            $("#useSkill" + itemId).val() +
            "," +
            $("#useSkillTarget" + itemId).val() +
            ");";
          break;
        case "使用御主技能":
          newScript +=
            "useClothesSkill(" +
            $("#clothSkill" + itemId).val() +
            "," +
            $("#clothSkillTarget" + itemId).val() +
            ");";
          break;
        case "戰鬥服換人":
          newScript +=
            "switchServant(" +
            $("#switchServantFront" + itemId).val() +
            "," +
            $("#switchServantBack" + itemId).val() +
            ");";
          break;
        case "選擇敵人":
          newScript += "selectEnemy(" + $("#selectEnemy" + itemId).val() + ");";
          break;
        case "開始選卡":
          newScript += "startAttack();";
          break;
        case "使用寶具":
          newScript += "useUlt(" + $("#useUlt" + itemId).val() + ");";
          break;
        case "選擇卡片":
          newScript += "selectCard(" + $("#selectCard" + itemId).val() + ");";
          break;
        case "自動戰鬥":
          newScript +=
            "autoAttack(" +
            $("#autoFightUntil" + itemId).val() +
            "," +
            $("#autoFightColor" + itemId).val() +
            "," +
            $("#autoFightSameColor" + itemId).val() +
            "," +
            $("#autoFightWeak" + itemId).val() +
            "," +
            $("#autoFightDie" + itemId).val();
          for (var i = 0; i < 3; i++) {
            newScript += "," + $("#servant" + i + "ult" + itemId).val();
            for (var j = 0; j < 3; j++) {
              newScript += "," + $("#servant" + i + "skill" + j + itemId).val();
              newScript +=
                "," + $("#servant" + i + "skill" + j + "target" + itemId).val();
            }
          }

          // newScript+=","+$("#ultColor"+itemId).val();
          newScript += ",false";
          for (var i = 0; i < 3; i++) {
            newScript += "," + $("#autoClothskill" + i + itemId).val();
            newScript +=
              "," + $("#autoClothskill" + i + "target" + itemId).val();
          }

          newScript += ");";
          break;
        case "技能改變寶具顏色":
          newScript +=
            "setSpaceUltColor(" + $("#spaceUltColor" + itemId).val() + ");";
          break;
        case "好友從者多選":
          var servant = "";
          if ($("#additionalFriendServant" + itemId).val() != -1) {
            servant = $("#additionalFriendServant" + itemId).select2("data")[0]
              .text;
          }
          newScript += 'additionalFriendServant("' + servant + '");';
          break;
        default:
          newScript += "/*no this function*/";
          break;
      }
    });
  return newScript;
}

//load script
function resetScript(result) {
  if (isDebug) {
    console.log("reset script", result);
  }
  clearScript();
  var currentDirection = insertDirection;
  insertDirection = 1;
  var scriptContentList = result.split(";");
  scriptContentList.forEach(function (content) {
    commandId++;
    if (checkstring(content, "getFriendPoint")) {
      addGetFriendPoint(commandId);
    } else if (checkstring(content, "getBox")) {
      content = content.replace("getBox(", "");
      content = content.replace(")", "");
      addGetBox(commandId, content);
      $("#skill-list").append(getGetBox(commandId));
      initCommandButton(commandId);
    } else if (checkstring(content, "selectStage")) {
      content = content.replace("selectStage(", "");
      content = content.replace(")", "");
      addSelectStage(commandId, content);
    } else if (checkstring(content, "selectFriend")) {
      content = content.replace("selectFriend(", "");
      content = content.replace(")", "");
      content = content.replace(/"/g, "");
      addSelectFriend(commandId, content);
    } else if (checkstring(content, "selectTeam")) {
      content = content.replace("selectTeam(", "");
      content = content.replace(")", "");
      addSelectTeam(commandId, content);
    } else if (checkstring(content, "startQuest")) {
      content = content.replace("startQuest(", "");
      content = content.replace(")", "");
      addStartQuest(commandId, content);
    } else if (checkstring(content, "autoAttack")) {
      content = content.replace("autoAttack(", "");
      content = content.replace(")", "");
      addAuto(commandId, content);
    } else if (checkstring(content, "useSkill")) {
      content = content.replace("useSkill(", "");
      content = content.replace(")", "");
      addSkill(commandId, content);
    } else if (checkstring(content, "useClothesSkill")) {
      content = content.replace("useClothesSkill(", "");
      content = content.replace(")", "");
      addCloth(commandId, content);
    } else if (checkstring(content, "switchServant")) {
      content = content.replace("switchServant(", "");
      content = content.replace(")", "");
      addSwitchServant(commandId, content);
    } else if (checkstring(content, "selectEnemy")) {
      content = content.replace("selectEnemy(", "");
      content = content.replace(")", "");
      addSelectEnemy(commandId, content);
    } else if (checkstring(content, "startAttack")) {
      addStartAttack(commandId);
    } else if (checkstring(content, "useUlt")) {
      content = content.replace("useUlt(", "");
      content = content.replace(")", "");
      addUseUlt(commandId, content);
    } else if (checkstring(content, "selectCard")) {
      content = content.replace("selectCard(", "");
      content = content.replace(")", "");
      addSelectCard(commandId, content);
    } else if (checkstring(content, "finishQuest")) {
      addFinish(commandId);
    } else if (checkstring(content, "setSpaceUltColor")) {
      content = content.replace("setSpaceUltColor(", "");
      content = content.replace(")", "");
      addSpaceUlt(commandId, content);
    } else if (checkstring(content, "additionalFriendServant")) {
      content = content.replace("additionalFriendServant(", "");
      content = content.replace(")", "");
      content = content.replace(/"/g, "");
      addAdditionalFriendServant(commandId, content);
    }
  });
  insertDirection = currentDirection;
  bootbox.alert("讀取成功");
}

//Add command=====================================================
function addGetFriendPoint(commandId) {
  insertNewCommand(getGetFriendPoint(commandId));
}

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
}

function addSelectTeam(commandId, content) {
  insertNewCommand(getSelectTeam(commandId));

  $("#selectTeam" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if(server != "JP"){
    $("#selectTeamAutoBuild" + commandId).css("display", "none");
    $("#selectTeamAutoBuildTitle" + commandId).css("display", "none");
  }else{
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
  if(scriptValue.length >= 2){
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

function addAuto(commandId, content) {
  insertNewCommand(getAutoItem(commandId));

  $("#autoFightUntil" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "resolve",
    width: "160px",
  });
  $("#autoFightColor" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightSameColor" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightWeak" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightDie" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  for (var i = 0; i < 3; i++) {
    $("#autoClothskill" + i + commandId).select2({
      minimumResultsForSearch: -1,
      width: "120px",
    });
    $("#autoClothskill" + i + "target" + commandId).select2({
      minimumResultsForSearch: -1,
      width: "64px",
    });

    $("#servant" + i + "ult" + commandId).select2({
      minimumResultsForSearch: -1,
      width: "160px",
    });

    for (var j = 0; j < 3; j++) {
      $("#servant" + i + "skill" + j + commandId).select2({
        minimumResultsForSearch: -1,
        width: "120px",
      });
      $("#servant" + i + "skill" + j + "target" + commandId).select2({
        minimumResultsForSearch: -1,
        width: "64px",
      });
    }
  }

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#autoFightUntil" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#autoFightColor" + commandId)
    .val(scriptValue[1])
    .trigger("change");
  $("#autoFightSameColor" + commandId)
    .val(scriptValue[2])
    .trigger("change");
  $("#autoFightWeak" + commandId)
    .val(scriptValue[3])
    .trigger("change");
  $("#autoFightDie" + commandId)
    .val(scriptValue[4])
    .trigger("change");

  for (var i = 0; i < 3; i++) {
    if (scriptValue.length > 27) {
      $("#autoClothskill" + i + commandId)
        .val(scriptValue[27 + 2 * i])
        .trigger("change");
      $("#autoClothskill" + i + "target" + commandId)
        .val(scriptValue[27 + 2 * i + 1])
        .trigger("change");
    }

    $("#servant" + i + "ult" + commandId)
      .val(scriptValue[5 + 7 * i])
      .trigger("change");
    for (var j = 0; j < 3; j++) {
      $("#servant" + i + "skill" + j + commandId)
        .val(scriptValue[5 + 7 * i + 1 + j * 2])
        .trigger("change");
      $("#servant" + i + "skill" + j + "target" + commandId)
        .val(scriptValue[5 + 7 * i + 1 + j * 2 + 1])
        .trigger("change");
    }
  }
}

function addSkill(commandId, content) {
  insertNewCommand(getUseSkillItem(commandId));

  $("#useSkillServant" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#useSkill" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#useSkillTarget" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#useSkillServant" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#useSkill" + commandId)
    .val(scriptValue[1])
    .trigger("change");
  $("#useSkillTarget" + commandId)
    .val(scriptValue[2])
    .trigger("change");
}

function addCloth(commandId, content) {
  //handle old version
  if (content != undefined) {
    var test = content.split(",");
    if (test.length >= 3 && test[0] == 2 && test[2] != -1) {
      var newContext = test[1] + "," + test[2];
      addSwitchServant(commandId, newContext);
      return;
    }
  }

  insertNewCommand(getClothItem(commandId));

  $("#clothSkill" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#clothSkillTarget" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#clothSkill" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#clothSkillTarget" + commandId)
    .val(scriptValue[1])
    .trigger("change");
}

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

function addSelectEnemy(commandId, content) {
  insertNewCommand(getSelectEnemy(commandId));

  $("#selectEnemy" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  $("#selectEnemy" + commandId)
    .val(content)
    .trigger("change");
}

function addStartAttack(commandId) {
  insertNewCommand(getStartAttackItem(commandId));
}

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

function addFinish(commandId) {
  insertNewCommand(getFinishItem(commandId));
}

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
