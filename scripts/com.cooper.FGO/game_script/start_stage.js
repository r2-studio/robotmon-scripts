//-----------------------------------------------------select stage
var isReplay = false;

function selectStage(useApple) {
  if (!isScriptRunning) {
    return;
  }
  sleep(1000);
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，選擇關卡省略");
    sleep(500);
    return;
  }
  console.log("-選擇關卡-");

  if (isStageRestart()) {
    isReplay = true;
    tapScale(1200, 840);
    sleep(500);
  } else if (isStageRestartEvent()) {
    isReplay = true;
    if (lastTimeUseItem < 0) {
      tapScale(1350, 840);
    } else {
      tapScale(900, 840);
      sleep(1500);
      selectItem(lastTimeUseItem);
    }
    sleep(500);
  } else if (!isMainPage()) {
    console.log("1.請先移至選擇關卡或戰鬥畫面");
    console.log("2.瀏海手機可能有黑邊影響偵測:");
    console.log("請使用黑邊設定功能");
    console.log("3.模擬器不支援火箭模式:");
    console.log("請使用Simple Manager啟動");
    console.log("選擇關卡失敗 可能原因如上");
    isScriptRunning = false;
    return;
  } else {
    tapScale(1200, 240);
    sleep(500);
  }
  var status = -1;
  while (isScriptRunning) {
    if (isItemOrServantFullDialog()) {
      status = 0;
    } else if (isUseAppleDialog()) {
      status = 1;
    } else if (isSelectFriendPage()) {
      status = 2;
    }
    if (status >= 0) {
      break;
    }
  }
  if (status == 0) {
    console.log("倉庫已滿-選擇關卡失敗");
    sendUrgentMessage(runningScriptName, "倉庫已滿-選擇關卡失敗");
    isScriptRunning = false;
    return;
  } else if (status == 1) {
    //handle apple dialog
    switch (useApple) {
      case -1:
        console.log("AP不足-選擇關卡失敗");
        isScriptRunning = false;
        return;
      case 2: //gold
        tapScale(900, 450);
        console.log("使用金蘋果");
        sendNormalMessage(runningScriptName, "使用金蘋果");
        break;
      case 1: //silver
        tapScale(900, 675);
        console.log("使用銀蘋果");
        sendNormalMessage(runningScriptName, "使用銀蘋果");
        break;
      case 5:
        if (server == "JP") {
          tapScale(900, 840);
          console.log("使用青銅蘋果");
          sendNormalMessage(runningScriptName, "使用青銅蘋果");
        }
        break;
      case 0: //bronze
        if (server == "JP") {
          swipeScale(600, 750, 600, 150, 300);
        }
        tapScale(900, 840);
        console.log("使用赤銅蘋果");
        sendNormalMessage(runningScriptName, "使用赤銅蘋果");
        break;
      case 3:
        tapScale(900, 225);
        console.log("使用聖晶石");
        sendNormalMessage(runningScriptName, "使用聖晶石");
        break;
      case 4:
        isReplay = false;
        while (isScriptRunning) {
          sleep(1000);
          //close apple dialog
          tapScale(960, 930);
          if (selectStageAutoRestore()) {
            break;
          }
        }
        break;
    }
    if (useApple >= 0 && useApple != 4) {
      sleep(1500);
      tapScale(1275, 850);
    }
  }
  while (isScriptRunning) {
    waitLoading();
    if (isSelectFriendPage()) {
      waitLoading();
      sleep(2000);
      break;
    }
  }
}

function selectStageAutoRestore() {
  console.log("等待五分鐘回復體力");
  //sleep 5min
  for (var i = 0; i < 55; i++) {
    sleep(5000);
    if (!isScriptRunning) {
      return;
    }
  }
  //select stage again
  tapScale(1200, 240);
  while (isScriptRunning) {
    sleep(3000);
    if (isUseAppleDialog()) {
      return false;
    } else if (isSelectFriendPage()) {
      return true;
    }
    //wait loading
  }
}

//-----------------------------------------------------team menu
var itemPositionY = [300, 525, 750];

function selectTeam(team) {
  if (!isScriptRunning) {
    return;
  }
  if (team < 0 || team >= 10) {
    return;
  }
  if (isReplay) {
    console.log("連續戰鬥，選擇隊伍省略");
    return;
  }
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，選擇隊伍省略");
    sleep(500);
    return;
  }
  console.log("-選擇隊伍-");
  if (!isSelectTeamPage()) {
    console.log("不在選擇隊伍畫面");
    return;
  }
  var x = 787 + 37 * team;
  var x2 = 787 + 37 * ((team + 1) % 10);
  tapScale(x2, 75);
  sleep(1000);
  tapScale(x, 75);
  sleep(2000);
}

function startQuest(useItem, checkStageLoadFinish) {
  if (!isScriptRunning) {
    return;
  }
  if (isReplay) {
    if (checkStageLoadFinish == 1) {
      tryOpenSettingDialog();
    } else {
      console.log("連續戰鬥，進入關卡省略");
    }
    return;
  }
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，進入關卡省略");
    sleep(500);
    return;
  }
  console.log("-進入關卡-");
  if (!isSelectTeamPage()) {
    console.log("不在選擇隊伍畫面");
    return;
  }
  while (isSelectTeamPage()) {
    console.log("點擊進入關卡按鈕");
    clickIcon("teamPage");
    sleep(1500);

    if (isUseItemDialog()) {
      lastTimeUseItem = useItem;
      if (useItem == undefined || useItem == -1) {
        console.log("不使用道具");
        tapScale(1230, 975);
        return;
      }
      selectItem(useItem);
      break;
    }
  }
  if (checkStageLoadFinish == 1) {
    tryOpenSettingDialog();
  }
}

function tryOpenSettingDialog() {
  console.log("檢查遊戲是否能夠操作");
  while (isScriptRunning) {
    if (!isBattleMainPage()) {
      tapScale(1650, 450);
      sleep(3000);
      continue;
    }
    clickIcon("battleMain1");
    sleep(1000);
    if (isSettingDialog()) {
      clickIcon("battleMain1");
      sleep(1000);
      break;
    }
  }
}

function selectItem(item) {
  var y = itemPositionY[item % 3];
  if (item > 2) {
    swipeScale(600, 900, 600, 75, 500);
    sleep(1000);
  }
  console.log("使用道具");
  tapScale(975, y);
  sleep(1000);
  if (isUseItemDialog()) {
    isScriptRunning = false;
    console.log("道具不足");
    sendUrgentMessage(runningScriptName, "道具不足");
    return;
  }
  if(isReplay){
    sleep(3000);
    if(!isUseAppleDialog() && !isSelectFriendPage()){
      tapScale(1240, 832);
    }
  }else{
    tapScale(1240, 832);
  }
  sleep(3000);
}

loadApiCnt++;
console.log("Load start stage api finish");
