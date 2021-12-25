var version = "";
var commandId = 0;
var scriptCnt = 0;
var friendServantList = [];
var friendItemList = [];
var storagePath;
var servantImgPath;
var itemImgPath;
var insertDirection = 0;
var listenScriptMode = true;
var isPlayingScript = false;

$(function () {
  try {
    if (JavaScriptInterface != undefined) {
      console.log("檢查連接Robotmon服務成功");
    }
  } catch (e) {
    console.log("無法連接Robotmon服務，請檢查Robotmon是否啟動成功");
    $("#serverMessage").text(
      "無法連接Robotmon服務，請檢查Robotmon是否啟動成功"
    );
    return;
  }
  setTimeout(function () {
    JavaScriptInterface.showMenu();
    JavaScriptInterface.runScriptCallback(
      'initHTML("' + server + '");',
      "initHTML"
    );
  }, 1500);
});

function initButton() {
  if (isDebug) {
    $("#titleBar").click(function () {
      logAll(getCurrentScript());
    });
  }
  //set loop btn
  $("#loopTime1").click(function () {
    var n = 1;
    $("#loopTime").val(n);
  });
  $("#loopTimePlus").click(function () {
    var t = $("#loopTime").val();
    var n = 0;
    if (t == "無限") {
      n = 1;
    } else {
      n = parseInt(t) + 1;
    }
    $("#loopTime").val(n);
  });
  $("#loopTimePlus5").click(function () {
    var t = $("#loopTime").val();
    var n = 0;
    if (t == "無限") {
      n = 5;
    } else {
      n = parseInt(t) + 5;
    }
    $("#loopTime").val(n);
  });
  $("#loopTimeMinus").click(function () {
    var t = $("#loopTime").val();
    var n = 0;
    if (t == "無限") {
      n = 1;
    } else {
      n = parseInt(t) - 1;
    }
    if (n <= 0) {
      n = 1;
    }
    $("#loopTime").val(n);
  });
  $("#loopTimeInfinite").click(function () {
    $("#loopTime").val("無限");
  });

  //set crop btn
  $("#getServantImage1").click(function () {
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendServantImage(1);",
      "saveServantConfirm"
    );
  });
  $("#getServantImage2").click(function () {
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendServantImage(2);",
      "saveServantConfirm"
    );
  });
  $("#getItemImage1").click(function () {
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendItemImage(1);",
      "saveItemConfirm"
    );
  });
  $("#getItemImage2").click(function () {
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendItemImage(2);",
      "saveItemConfirm"
    );
  });

  //set add default script btn
  $("#addAllFlow").click(function () {
    var currentDirection = insertDirection;
    insertDirection = 1;
    clearScript();
    commandId++;
    addSelectStage(commandId);
    commandId++;
    addSelectFriend(commandId);
    commandId++;
    addSelectTeam(commandId);
    commandId++;
    addStartQuest(commandId);
    commandId++;
    addAuto(commandId);
    commandId++;
    addFinish(commandId);
    insertDirection = currentDirection;
  });

  $("#addAllFlowSwitch").click(function () {
    var currentDirection = insertDirection;
    insertDirection = 1;
    clearScript();
    commandId++;
    addSelectStage(commandId);
    commandId++;
    addSelectFriend(commandId);
    commandId++;
    addSelectTeam(commandId);
    commandId++;
    addStartQuest(commandId);
    commandId++;
    addAuto(
      commandId,
      "1,0,1,1,0,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,-1,0,0,0,0,0,0,false,-1,-1,-1,-1,-1,-1"
    );
    commandId++;
    addSwitchServant(commandId, "2,3");
    commandId++;
    addAuto(commandId);
    commandId++;
    addFinish(commandId);
    insertDirection = currentDirection;
  });
  $("#addAllFlowSwitchT1").click(function () {
    var currentDirection = insertDirection;
    insertDirection = 1;
    clearScript();
    commandId++;
    addSelectStage(commandId);
    commandId++;
    addSelectFriend(commandId);
    commandId++;
    addSelectTeam(commandId);
    commandId++;
    addStartQuest(commandId);
    commandId++;
    addSkill(commandId, "2,0,0");
    commandId++;
    addSkill(commandId, "2,1,0");
    commandId++;
    addSkill(commandId, "2,2,0");
    commandId++;
    addSwitchServant(commandId, "2,3");
    commandId++;
    addAuto(
      commandId,
      "3,0,1,1,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,-1,0,0,0,0,0,0,false,2,-1,-1,-1,-1,-1"
    );
    commandId++;
    addFinish(commandId);
    insertDirection = currentDirection;
  });

  $("#clearScript").click(function () {
    clearScript();
  });

  //set load script btn
  $("#saveScript").click(function () {
    var currentScript = getCurrentScript();
    var scriptName = $("#scriptMode").select2("data")[0].text;
    if (scriptName != "") {
      //overwrite script
      JavaScriptInterface.runScriptCallback(
        'saveScript("' + scriptName + "\",'" + currentScript + "');",
        "saveScriptConfirm"
      );
    } else {
      //create new script
      bootbox.prompt({
        title: "腳本名稱",
        value: "新腳本" + (scriptCnt + 1),
        callback: function (newScriptName) {
          var scriptNameOK = true;
          if (newScriptName == null) {
            return;
          } else if (
            newScriptName.length <= 0 ||
            newScriptName.indexOf(",") >= 0 ||
            newScriptName.indexOf(".") >= 0 ||
            newScriptName.indexOf(";") >= 0 ||
            newScriptName.indexOf(" ") >= 0
          ) {
            scriptNameOK = false;
          } else {
            $("#scriptMode option").each(function () {
              if ($(this).text() == newScriptName) {
                scriptNameOK = false;
              }
            });
          }
          if (scriptNameOK) {
            JavaScriptInterface.runScriptCallback(
              'saveScript("' + newScriptName + "\",'" + currentScript + "');",
              "createScriptConfirm"
            );
          } else {
            console.log("Save script file name failed " + newScriptName);
            bootbox.alert("檔名不合法");
          }
        },
      });
    }
  });
  $("#deleteScript").click(function () {
    var scriptName = $("#scriptMode").select2("data")[0].text;
    bootbox.confirm("是否刪除 " + scriptName + " ?", function (result) {
      if (result) {
        if (scriptName == "") {
          clearScript();
        } else {
          JavaScriptInterface.runScriptCallback(
            'deleteScript("' + scriptName + '");',
            "deleteScriptConfirm"
          );
        }
      }
    });
  });
  $("#createScript").click(function () {
    bootbox.prompt({
      title: "建立新的空白腳本",
      value: "新腳本" + (scriptCnt + 1),
      callback: function (newScriptName) {
        var scriptNameOK = true;
        if (newScriptName == null) {
          return;
        } else if (
          newScriptName.length <= 0 ||
          newScriptName.indexOf(",") >= 0 ||
          newScriptName.indexOf(".") >= 0 ||
          newScriptName.indexOf(";") >= 0 ||
          newScriptName.indexOf(" ") >= 0
        ) {
          scriptNameOK = false;
        } else {
          $("#scriptMode option").each(function () {
            if ($(this).text() == newScriptName) {
              scriptNameOK = false;
            }
          });
        }
        if (scriptNameOK) {
          JavaScriptInterface.runScriptCallback(
            'saveScript("' + newScriptName + "\",'" + "');",
            "createEmptyScriptConfirm"
          );
        } else {
          console.log("Create script file name failed " + newScriptName);
          bootbox.alert("檔名不合法");
        }
      },
    });
  });
  $("#copyScript").click(function () {
    var oldScriptName = $("#scriptMode").select2("data")[0].text;
    if (oldScriptName == "") {
      return;
    }
    bootbox.prompt({
      title: "腳本名稱",
      value: oldScriptName + "_copy",
      callback: function (newScriptName) {
        var scriptNameOK = true;
        if (newScriptName == null) {
          return;
        } else if (
          newScriptName.length <= 0 ||
          newScriptName.indexOf(",") >= 0 ||
          newScriptName.indexOf(".") >= 0 ||
          newScriptName.indexOf(";") >= 0 ||
          newScriptName.indexOf(" ") >= 0
        ) {
          scriptNameOK = false;
        } else {
          $("#scriptMode option").each(function () {
            if ($(this).text() == newScriptName) {
              scriptNameOK = false;
            }
          });
        }
        if (scriptNameOK) {
          var currentScript = getCurrentScript();
          JavaScriptInterface.runScriptCallback(
            'saveScript("' + newScriptName + "\",'" + currentScript + "');",
            "copyScriptConfirm"
          );
        } else {
          console.log("Copy script file name failed " + newScriptName);
          bootbox.alert("檔名不合法");
        }
      },
    });
  });
  $("#scriptMode").change(function () {
    if (!listenScriptMode) {
      return;
    }
    var scriptName = $("#scriptMode").select2("data")[0].text;
    JavaScriptInterface.runScriptCallback(
      'readScript("' + scriptName + '");',
      "resetScript"
    );
  });

  //set control script display btn
  $("#insertDirection").click(function () {
    insertDirection = (parseInt($("#insertDirection").val()) + 1) % 2;
    $("#insertDirection").val(insertDirection).trigger("change");
    if (insertDirection == 1) {
      $("#insertDirection").text("後");
    } else {
      $("#insertDirection").text("前");
    }
  });
  $("#showAll").click(function () {
    for (var i = 0; i <= commandId; i++) {
      $("#commandvalue" + i).show();
      $("#hideItem" + i).text("隱藏");
    }
  });
  $("#hideAll").click(function () {
    for (var i = 0; i <= commandId; i++) {
      $("#commandvalue" + i).hide();
      $("#hideItem" + i).text("顯示");
    }
  });

  //command button
  $("#addGetFriendPoint").click(function () {
    clearScript();
    commandId++;
    addGetFriendPoint(commandId);
  });
  $("#addGetBox").click(function () {
    clearScript();
    commandId++;
    addGetBox(commandId);
  });
  $("#addSelectStage").click(function () {
    commandId++;
    addSelectStage(commandId);
  });
  $("#addSelectFriend").click(function () {
    commandId++;
    addSelectFriend(commandId);
  });
  $("#addSelectTeam").click(function () {
    commandId++;
    addSelectTeam(commandId);
  });
  $("#addStartQuest").click(function () {
    commandId++;
    addStartQuest(commandId);
  });
  $("#addAuto").click(function () {
    commandId++;
    addAuto(commandId);
  });
  $("#addSkill").click(function () {
    commandId++;
    addSkill(commandId);
  });
  $("#addCloth").click(function () {
    commandId++;
    addCloth(commandId);
  });
  $("#addSwitchServant").click(function () {
    commandId++;
    addSwitchServant(commandId);
  });
  $("#addSelectEnemy").click(function () {
    commandId++;
    addSelectEnemy(commandId);
  });
  $("#addStartAttack").click(function () {
    commandId++;
    addStartAttack(commandId);
  });
  $("#addUseUlt").click(function () {
    commandId++;
    addUseUlt(commandId);
  });
  $("#addSelectCard").click(function () {
    commandId++;
    addSelectCard(commandId);
  });
  $("#addFinish").click(function () {
    commandId++;
    addFinish(commandId);
  });
  $("#addSpaceUlt").click(function () {
    commandId++;
    addSpaceUlt(commandId);
  });
  $("#additionalFriendServant").click(function () {
    commandId++;
    addAdditionalFriendServant(commandId);
  });
}

function startListenScriptSelect() {
  listenScriptMode = true;
}

function stopListenScriptSelect() {
  listenScriptMode = false;
}

function clearScript() {
  $("#skill-list").empty();
  commandId = 0;
}

function getCheckSwitchStatus(id) {
  return $(id).is(":checked");
}

//Callback------------------------------------------------------------------------------------------------------------------------
function initHTML(result) {
  if (result == undefined || result.includes("UNAVAILABLE")) {
    $("#serverMessage").text(
      "無法連接Robotmon服務，請檢查Robotmon是否啟動成功"
    );
    return;
  }
  if (result == "noimg") {
    logAll(
      "無法取得螢幕截圖，可能是此裝置不支援火箭模式啟動造成，請參考啟動教學文件，推薦使用Simple Manager啟動"
    );
    $("#serverMessage").text(
      "無法取得螢幕截圖，可能是此裝置不支援火箭模式啟動造成，請參考啟動教學文件，推薦使用Simple Manager啟動"
    );
    return;
  }
  result = result.split(";");
  if (result[4] == undefined) {
    $("#serverMessage").text("請重新開啟腳本以完成更新");
    return;
  }

  initButton();
  version = result[4];
  if (result[1].length > 0) {
    friendServantList = result[1].split(",");
  }
  if (result[2].length > 0) {
    friendItemList = result[2].split(",");
  }
  if (result[0] == undefined) {
    $("#scriptMode").select2({
      height: "100px",
      width: "100%",
    });
  } else {
    var scriptList = result[0].split(",");
    scriptCnt = scriptList.length;

    for (var i = 0; i < scriptList.length; i++) {
      $("#scriptMode").append(
        '<option value = "' + i + '">' + scriptList[i] + "</option>"
      );
    }
    $("#scriptMode").select2({
      height: "100px",
      minimumResultsForSearch: -1,
      placeholder: "請選擇腳本",
      width: "100%",
    });
  }
  storagePath = result[3];
  servantImgPath = storagePath + "friend_servant/";
  itemImgPath = storagePath + "friend_item/";
  if (server == "JP") {
    $("#titleBarText").text("FGO自動周回小幫手 日服 " + version + " 啟動成功");
    $("#serverMessage").text("");
  } else if (server == "TW") {
    $("#titleBarText").text("FGO自動周回小幫手 台服 " + version + " 啟動成功");
    $("#serverMessage").text("");
  }

  var gaEvent = "app" + server;
  ga("set", "page", gaEvent);
  ga("send", "pageview");
}

function scriptFinish(showLog) {
  var l = server + "_" + version;
  ga("send", {
    hitType: "event",
    eventCategory: "Script",
    eventAction: "Finish",
    eventLabel: l,
  });
  JavaScriptInterface.showMenu();
  JavaScriptInterface.showPlayButton();
  if (showLog) {
    JavaScriptInterface.clickLogButton();
  }
  isPlayingScript = false;
}

function saveServantConfirm(time) {
  JavaScriptInterface.showMenu();
  JavaScriptInterface.clickSettingButton();
  bootbox.prompt({
    title:
      '<img src = "' +
      storagePath +
      "tmp_servant_" +
      time +
      '.png" width = "60" height = "40"><br>檔案名稱',
    value: "從者" + (friendServantList.length + 1),
    callback: function (imageName) {
      if (imageName == null) {
        return;
      }
      var imageNameOK = true;
      if (
        imageName.length <= 0 ||
        imageName.indexOf(",") >= 0 ||
        imageName.indexOf(".") >= 0 ||
        imageName.indexOf(";") >= 0 ||
        imageName.indexOf(" ") >= 0
      ) {
        imageNameOK = false;
      }
      if (imageNameOK) {
        friendServantList[friendServantList.length] = imageName;
        JavaScriptInterface.runScriptCallback(
          'confirmSaveFriendServantImage("' + imageName + '","' + time + '");',
          "saveFriendServantConfirm"
        );
      } else {
        bootbox.alert("檔名不合法");
        // remove tmp file
        JavaScriptInterface.runScript("confirmSaveFriendServantImage()");
      }
    },
  });
}

function saveItemConfirm(time) {
  JavaScriptInterface.showMenu();
  JavaScriptInterface.clickSettingButton();
  bootbox.prompt({
    title:
      '<img src = "' +
      storagePath +
      "tmp_item_" +
      time +
      '.png" width = "60" height = "20"><br>檔案名稱',
    value: "禮裝" + (friendItemList.length + 1),
    callback: function (imageName) {
      if (imageName == null) {
        return;
      }
      var imageNameOK = true;
      if (
        imageName.length <= 0 ||
        imageName.indexOf(",") >= 0 ||
        imageName.indexOf(".") >= 0 ||
        imageName.indexOf(";") >= 0 ||
        imageName.indexOf(" ") >= 0
      ) {
        imageNameOK = false;
      }
      if (imageNameOK) {
        friendItemList[friendItemList.length] = imageName;
        JavaScriptInterface.runScriptCallback(
          'confirmSaveFriendItemImage("' + imageName + '","' + time + '");',
          "saveFriendItemConfirm"
        );
      } else {
        bootbox.alert("檔名不合法");
        // remove tmp file
        JavaScriptInterface.runScript("confirmSaveFriendItemImage()");
      }
    },
  });
}

function createEmptyScriptConfirm(result) {
  if (result == null) {
    return;
  }
  bootbox.alert("建立成功");
  scriptCnt++;
  stopListenScriptSelect();
  $("#scriptMode").append(
    '<option value = "' + scriptCnt + '" selected>' + result
  );
  clearScript();
  startListenScriptSelect();
}

function createScriptConfirm(result) {
  if (result == null) {
    return;
  }
  bootbox.alert("建立成功");
  scriptCnt++;
  stopListenScriptSelect();
  $("#scriptMode").append(
    '<option value = "' + scriptCnt + '" selected>' + result
  );
  startListenScriptSelect();
}

function saveScriptConfirm(result) {
  if (result == null) {
    return;
  }
  bootbox.alert("儲存成功");
  startListenScriptSelect();
}

function deleteScriptConfirm(result) {
  clearScript();
  $("#scriptMode option")
    .filter(function () {
      return $.trim($(this).text()) == result;
    })
    .remove();
  bootbox.alert("刪除 " + result + " 成功");
}

function copyScriptConfirm(result) {
  if (result == null) {
    return;
  }
  bootbox.alert("複製成功");
  scriptCnt++;
  stopListenScriptSelect();
  $("#scriptMode").append(
    '<option value = "' + scriptCnt + '" selected>' + result
  );
  startListenScriptSelect();
}

function saveFriendServantConfirm(result) {
  if (result == null) {
    return;
  }
  //update all exist frient select
  var id = friendServantList.length - 1;
  for (var i = 0; i < commandId + 1; i++) {
    if ($("#selectFriendServant" + i).length) {
      $("#selectFriendServant" + i).append(
        '<option value = "' + id + '">' + result + "</option>"
      );
      $("#selectFriendServant" + i).select2({
        minimumResultsForSearch: -1,
        width: "160px",
      });
    } else if ($("#additionalFriendServant" + i).length) {
      $("#additionalFriendServant" + i).append(
        '<option value = "' + id + '">' + result + "</option>"
      );
      $("#additionalFriendServant" + i).select2({
        minimumResultsForSearch: -1,
        width: "160px",
      });
    }
  }
  bootbox.alert("從者儲存成功");
}

function saveFriendItemConfirm(result) {
  if (result == null) {
    return;
  }
  bootbox.alert("禮裝儲存成功");
  for (var i = 0; i < commandId + 1; i++) {
    if ($("#selectFriendItem" + i).length) {
      $("#selectFriendItem" + i).append(
        '<option value = "' + commandId + '">' + result + "</option>"
      );
      $("#selectFriendItem" + i).select2({
        minimumResultsForSearch: -1,
        width: "160px",
      });
    }
  }
}

function checkstring(longStr, shortStr) {
  if (longStr.substring(0, shortStr.length) == shortStr) {
    return true;
  }
  return false;
}
//Call by Android app-----------------------------------------------------------------------------------------------------
function onEvent(eventType) {
  if (eventType == "OnPlayClick") {
    var t = $("#loopTime").val();
    var loopTime = -1;
    if (t != "無限") {
      loopTime = parseInt(t);
    }
    var currentScript = getCurrentScript();
    var l = server + "_" + version;
    var scriptName = $("#scriptMode").select2("data")[0].text;

    JavaScriptInterface.runScriptCallback(
      "start(" + loopTime + ",'" + currentScript + "','" + scriptName + "');",
      "scriptFinish"
    );
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    ga("send", {
      hitType: "event",
      eventCategory: "Script",
      eventAction: "Play",
      eventLabel: l,
    });
    isPlayingScript = true;
  } else if (eventType == "OnPauseClick") {
    var l = server + "_" + version;
    ga("send", {
      hitType: "event",
      eventCategory: "Script",
      eventAction: "Stop",
      eventLabel: l,
    });
    JavaScriptInterface.runScript("stop();");
    isPlayingScript = false;
  } else if (eventType == "OnLogClick" && isPlayingScript) {
    // JavaScriptInterface.runScript("showLogAlertMessage();");    
    $("#serverMessage").text(
      "腳本執行中開啟除錯訊息，可能會擋到畫面導致腳本判斷錯誤!!"
    );
    console.log("腳本執行中開啟除錯訊息，可能會擋到畫面導致腳本判斷錯誤!!");
  }
}

function onLog(message) {
  console.log(message);
}

function logAll(message) {
  console.log(message);
  JavaScriptInterface.runScript("console.log('" + message + "')");
}
