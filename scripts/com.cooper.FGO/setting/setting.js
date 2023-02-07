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
    var blackEdge = getBlackEdgeValue();
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendServantImage(1,[" + blackEdge + "]);",
      "saveServantConfirm"
    );
  });
  $("#getServantImage2").click(function () {
    var blackEdge = getBlackEdgeValue();
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendServantImage(2,[" + blackEdge + "]);",
      "saveServantConfirm"
    );
  });
  $("#getItemImage1").click(function () {
    var blackEdge = getBlackEdgeValue();
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendItemImage(1,[" + blackEdge + "]);",
      "saveItemConfirm"
    );
  });
  $("#getItemImage2").click(function () {
    var blackEdge = getBlackEdgeValue();
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(3000, 0);
    JavaScriptInterface.runScriptCallback(
      "saveFriendItemImage(2,[" + blackEdge + "]);",
      "saveItemConfirm"
    );
  });

  //set black edge btn
  $("#getBlackEdge").click(function () {
    JavaScriptInterface.hideMenu();
    JavaScriptInterface.setXY(500, 500);
    JavaScriptInterface.runScriptCallback(
      "detectBlackEdge()",
      "detectBlackEdgeCallback"
    );
  });
  $("#clearBlackEdge").click(function () {
    setBlackEdgeValue([0, 0, 0, 0]);
  });
  $("#savePreferenceButton").click(function () {
    var preference = getPreferenceValue();
    JavaScriptInterface.runScriptCallback(
      "savePreference([" + preference +"])",
      "savePreferenceConfirm"
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
    if (scriptName == null || scriptName.length <= 0) {
      return;
    }
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

  //switch block button
  $("#switchGetServantBlock").click(function () {
    var display = $("#getServantBlock").css("display");
    if (display == "none") {
      $("#getServantBlock").css("display", "");
      $("#preferenceBlock").css("display", "none");
    } else {
      $("#getServantBlock").css("display", "none");
    }
  });
  $("#switchPreferenceBlock").click(function () {
    var display = $("#preferenceBlock").css("display");
    if (display == "none") {
      $("#preferenceBlock").css("display", "");
      $("#getServantBlock").css("display", "none");
    } else {
      $("#preferenceBlock").css("display", "none");
    }
  });
  $("#switchCommandBlock").click(function () {
    var display = $("#commandBlock").css("display");
    if (display == "none") {
      $("#commandBlock").css("display", "");
    } else {
      $("#commandBlock").css("display", "none");
    }
  });

  $("#friendStrictSelect").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#servantDirectionSelect").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#skillDirectionSelect").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#ultColorSelect").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#kukulkanUseStar0Select").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#kukulkanUseStar1Select").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#kukulkanUseStar2Select").select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  $("#deleteCropImageSelect").select2({
    minimumResultsForSearch: -1,
    width: "160px",
    minimumResultsForSearch: -1,
    placeholder: "請選擇截圖",
  });
  $("#deleteCropImageSelect").change(function () {
    var index = $(this).val();
    var path;
    if (index != null && index != -1) {
      if(index >= friendServantList.length){
        index -= friendServantList.length;
        path = itemImgPath + "/"+friendItemList[index] + ".png";
        $("#deleteCropImg").css("height", 20);
      }else{
        path = servantImgPath +"/"+ friendServantList[index] + ".png";
        $("#deleteCropImg").css("height", 40);
      }
      $("#deleteCropImg").attr("src", path);
    }else{
      $("#deleteCropImg")
      .removeAttr("src")
      .replaceWith($("#deleteCropImg").clone());
    }
  });
  $("#deleteCropImgButton").click(function () {
    var index = $("#deleteCropImageSelect").val();
    var isServant = true;
    var imageName;
    if (index == null || index == -1) {
      return;
    }
    if (index >= friendServantList.length) {
      index -= friendServantList.length;
      imageName = friendItemList[index];
      isServant = false;
    } else {
      imageName = friendServantList[index];
    }
    bootbox.confirm("是否刪除 " + imageName + ".png?", function (result) {
      if (result && imageName.length > 0) {
        if(isServant){
          JavaScriptInterface.runScriptCallback('deleteFriendServantImage("' + imageName + '");', "deleteFriendServantConfirm");
        }else{
          JavaScriptInterface.runScriptCallback('deleteFriendItemImage("' + imageName + '");', "deleteFriendItemConfirm");
        }
      }
    });
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
  if (isDebug) {
    console.log("initHTML:" + result);
  }
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
  //init cropt image
  if (result[1].length > 0) {
    friendServantList = result[1].split(",");
  }
  if (result[2].length > 0) {
    friendItemList = result[2].split(",");
  }
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }


  //init select script
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

  //init black edge and preference
  var blackEdge = [0, 0, 0, 0];
  if (result[5] != undefined) {
    result[5] = result[5].split(",");
    for (var i = 0; i < 4; i++) {
      blackEdge[i] = parseInt(result[5][i]);
    }
    var friendStrict= parseInt(result[5][4]);
    if(friendStrict == undefined || friendStrict == null || isNaN(friendStrict)){
      friendStrict = 0;
    }
    $("#friendStrictSelect").val(friendStrict).trigger("change");

    var servantDirection= parseInt(result[5][5]);
    if(servantDirection == undefined || servantDirection == null || isNaN(servantDirection)){
      servantDirection = 0;
    }
    $("#servantDirectionSelect").val(servantDirection).trigger("change");

    var skillDirection= parseInt(result[5][6]);
    if(skillDirection == undefined || skillDirection == null || isNaN(skillDirection)){
      skillDirection = 0;
    }
    $("#skillDirectionSelect").val(skillDirection).trigger("change");
    var ultColor= parseInt(result[5][7]);
    if(ultColor == undefined || ultColor == null || isNaN(ultColor)){
      ultColor = 1;
    }
    $("#ultColorSelect").val(ultColor).trigger("change");
    var kukulkanUseStar= parseInt(result[5][8]);
    if(kukulkanUseStar == undefined || kukulkanUseStar == null || isNaN(kukulkanUseStar)){
      kukulkanUseStar = 7;
    }
    var kkl = [0,0,0];
    var t = 1;
    for(var i = 0;i<3;i++){
      if ((kukulkanUseStar & t) != 0) {
        kkl[i] = 1;
      }
      t *= 2;
    }
    $("#kukulkanUseStar0Select").val(kkl[0]).trigger("change");
    $("#kukulkanUseStar1Select").val(kkl[1]).trigger("change");
    $("#kukulkanUseStar2Select").val(kkl[2]).trigger("change");
  }
  setBlackEdgeValue(blackEdge);

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

  $("#deleteCropImageSelect").children().remove().end();
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#deleteCropImageSelect").val(-1).trigger("change");
  $("#deleteCropImg").css("height", 40);
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
  $("#deleteCropImageSelect").children().remove().end();
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#deleteCropImageSelect").val(-1).trigger("change");
  $("#deleteCropImg").css("height", 40);
  bootbox.alert("從者儲存成功");
}

function saveFriendItemConfirm(result) {
  if (result == null) {
    return;
  }
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
  $("#deleteCropImageSelect").children().remove().end();
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#deleteCropImageSelect").val(-1).trigger("change");
  $("#deleteCropImg").css("height", 40);
  bootbox.alert("禮裝儲存成功");
}

function savePreferenceConfirm() {
  bootbox.alert("設定儲存完成");
}

function deleteFriendServantConfirm(image){
  var index = friendServantList.indexOf(image);
  friendServantList.splice(index, 1);

  $("#deleteCropImageSelect").children().remove().end();
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#deleteCropImageSelect").val(-1).trigger("change");
  $("#deleteCropImg").css("height", 40);

  for (var i = 0; i < commandId + 1; i++) {
    if ($("#selectFriendServant" + i).length) {
      if($("#selectFriendServant" + i).val() == index){
        $("#selectFriendServant" + i)
        .val(-1)
        .trigger("change");
      }
      $("#selectFriendServant"+i+" option[value='"+index+"']").remove();
    } else if ($("#additionalFriendServant" + i).length) {
      if($("#additionalFriendServant" + i).val() == index){
        $("#additionalFriendServant" + i)
        .val(-1)
        .trigger("change");
      }
      $("#additionalFriendServant"+i+" option[value='"+index+"']").remove();
    }
  }
  bootbox.alert("截圖刪除成功");
}

function deleteFriendItemConfirm(image){
  var index = friendItemList.indexOf(image);
  friendItemList.splice(index, 1);

  $("#deleteCropImageSelect").children().remove().end();
  for (var i = 0; i < friendServantList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + i + '">' + friendServantList[i] + "</option>"
    );
  }
  for (var i = 0; i < friendItemList.length; i++) {
    $("#deleteCropImageSelect").append(
      '<option value = "' + (friendServantList.length+i) + '">' + friendItemList[i] + "</option>"
    );
  }
  $("#deleteCropImageSelect").val(-1).trigger("change");
  $("#deleteCropImg").css("height", 40);

  for (var i = 0; i < commandId + 1; i++) {
    if ($("#selectFriendItem" + i).length) {
      if($("#selectFriendItem" + i).val() == index){
        $("#selectFriendItem" + i)
        .val(-1)
        .trigger("change");
      }
      $("#selectFriendItem"+i+" option[value='"+index+"']").remove();
    }
  }
  bootbox.alert("截圖刪除成功");
}

function detectBlackEdgeCallback(blackEdge) {
  blackEdge = blackEdge.split(",");
  var blackEdgeInt = [];
  for (var i = 0; i < 4; i++) {
    blackEdgeInt[i] = blackEdge[i];
  }
  setBlackEdgeValue(blackEdgeInt);
  JavaScriptInterface.showMenu();
  JavaScriptInterface.clickSettingButton();
}

//util----------------------------------------------------------------
function checkstring(longStr, shortStr) {
  if (longStr.substring(0, shortStr.length) == shortStr) {
    return true;
  }
  return false;
}

function setBlackEdgeValue(blackEdge) {
  $("#blackEdgeLeft").val(blackEdge[0]);
  $("#blackEdgeTop").val(blackEdge[1]);
  $("#blackEdgeRight").val(blackEdge[2]);
  $("#blackEdgeBottom").val(blackEdge[3]);
}

function getBlackEdgeValue() {
  var blackEdge = [];
  blackEdge[0] = parseInt($("#blackEdgeLeft").val());
  blackEdge[1] = parseInt($("#blackEdgeTop").val());
  blackEdge[2] = parseInt($("#blackEdgeRight").val());
  blackEdge[3] = parseInt($("#blackEdgeBottom").val());
  return blackEdge;
}

function getOtherPreferenceValue() {
  var preference = [];
  preference[0] = parseInt($("#friendStrictSelect").val());
  preference[1] = parseInt($("#servantDirectionSelect").val());
  preference[2] = parseInt($("#skillDirectionSelect").val());
  preference[3] = parseInt($("#ultColorSelect").val());
  var kkl =
    parseInt($("#kukulkanUseStar0Select").val()) +
    parseInt($("#kukulkanUseStar1Select").val()) * 2 +
    parseInt($("#kukulkanUseStar2Select").val()) * 4;
  preference[4] = kkl;
  return preference;
}

function getPreferenceValue(){
  var preference = getBlackEdgeValue();
  preference[4] = parseInt($("#friendStrictSelect").val());
  preference[5] = parseInt($("#servantDirectionSelect").val());
  preference[6] = parseInt($("#skillDirectionSelect").val());
  preference[7] = parseInt($("#ultColorSelect").val());
  var kkl =
    parseInt($("#kukulkanUseStar0Select").val()) +
    parseInt($("#kukulkanUseStar1Select").val()) * 2 +
    parseInt($("#kukulkanUseStar2Select").val()) * 4;
  preference[8] = kkl;
  return preference;

}

//Call by Android app---------------------------------------------------
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
    var blackEdge = getBlackEdgeValue();
    var preference = getOtherPreferenceValue();
    JavaScriptInterface.runScriptCallback(
      "start(" +
        loopTime +
        ",'" +
        currentScript +
        "','" +
        scriptName +
        "',[" +
        blackEdge +
        "],[" +
        preference +
        "]);",
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
