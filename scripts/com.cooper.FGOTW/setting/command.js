function getCommandItem(id, name, selection) {
  if (selection == undefined) {
    selection = "";
  }
  var result =
    '<div class="list-group-item">' +
    '<div class="commandTitle"><label class="cmdLabel" name="' +
    id +
    '">' +
    name +
    '</label><div class="commandControl">';
  if (selection != "") {
    result += '<button id="hideItem' + id + '" class="cmdButton">隱藏</button>';
  }
  result +=
    '<button id="moveItemUp' +
    id +
    '" class="cmdButton">上移</button>' +
    '<button id="moveItemDown' +
    id +
    '" class="cmdButton">下移</button>' +
    '<button id="removeItem' +
    id +
    '" class="cmdButton">刪除</button>' +
    "</div></div>" +
    '<div id="commandvalue' +
    id +
    '"><div class="command">' +
    selection +
    "</div></div>" +
    "</div>";
  return result;
}

function insertNewCommand(newCmd) {
  if (insertDirection == 1) {
    $("#skill-list").append(newCmd);
  } else {
    $("#skill-list").prepend(newCmd);
  }
  initCommandButton(commandId);
}

function initCommandButton(currentId) {
  $("#removeItem" + currentId).click(function () {
    $(this).parent().parent().parent().remove();
  });
  $("#hideItem" + currentId).click(function () {
    if ($("#commandvalue" + currentId).is(":visible")) {
      $(this).text("顯示");
      $("#commandvalue" + currentId).hide();
    } else {
      $(this).text("隱藏");
      $("#commandvalue" + currentId).show();
    }
  });
  $("#moveItemUp" + currentId).click(function () {
    var item = $(this).parent().parent().parent();
    var item2 = item.prev();
    if (item2.is("div")) {
      item2.before(item);
    }
  });
  $("#moveItemDown" + currentId).click(function () {
    var item = $(this).parent().parent().parent();
    var item2 = item.next();
    if (item2.is("div")) {
      item.before(item2);
    }
  });
}

//command to script
function getCurrentScript() {
  var newScript = "";
  $("#skill-list")
    .children()
    .each(function () {
      var itemTitle = $(this).find("label:first").text();
      var itemId = $(this).find("label:first").attr("name");
      switch (itemTitle) {
        case "好友從者多選":
          newScript += getAdditionalFriendServantScript(itemId);
          break;
        case "自動戰鬥":
          // 檢查是否為V2版本（有cardOrderDisplay元素）
          if ($("#cardOrderDisplay" + itemId).length > 0) {
            console.log("使用AutoCommandV2腳本生成: " + itemId);
            newScript += getAutoV2Script(itemId);
          } else {
            console.log("使用舊版AutoCommand腳本生成: " + itemId);
            newScript += getAutoScript(itemId);
          }
          break;
        case "使用御主技能":
          newScript += getClothScript(itemId);
          break;
        case "結束關卡":
          newScript += getFinishScript(itemId);
          break;
        case "友抽":
          newScript += getFriendPointScript(itemId);
          break;
        case "抽箱":
          newScript += getBoxScript(itemId);
          break;
        case "選擇卡片":
          newScript += getSelectCardScript(itemId);
          break;
        case "選擇敵人":
          newScript += getSelectEnemyScript(itemId);
          break;
        case "選擇好友":
          newScript += getSelectFriendScript(itemId);
          break;

        case "選擇關卡":
          newScript += getSelectStageScript(itemId);
          break;
        case "選擇隊伍":
          newScript += getSelectTeamScript(itemId);
          break;
        case "使用技能":
          newScript += getSkillScript(itemId);
          break;
        case "技能改變寶具顏色":
          newScript += getSpaceUltScript(itemId);
          break;
        case "開始選卡":
          newScript += getStartAttackScript(itemId);
          break;
        case "進入關卡":
          newScript += getStartQuestScript(itemId);
          break;
        case "戰鬥服換人":
          newScript += getSwitchServantScript(itemId);
          break;
        case "使用寶具":
          newScript += getUseUltScript(itemId);
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
    } else if (checkstring(content, "autoAttackV2")) {
      content = content.replace("autoAttackV2(", "");
      content = content.replace(")", "");
      addAutoV2(commandId, content);
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
  if (!initLoadScript) {
    bootbox.alert("讀取成功");
  }
  initLoadScript = false;
}
