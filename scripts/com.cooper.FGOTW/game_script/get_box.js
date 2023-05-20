function getBox(newBox, fast) {
  boxFullImage = openImage(imagePath + "boxFull.png");
  boxNoPointImage = openImage(imagePath + "boxNoPoint.png");

  var waitTime = 200;
  var checkTime = 50;
  if (fast != 1) {
    waitTime = 1000;
    checkTime = 5;
  }
  if(server == "TW"){
    if (checkIsBoxFinish()) {
      if (!isScriptRunning) {
        return;
      }
      if (newBox) {
        resetBox();
      } else {
        console.log("此箱已抽完");
        releaseImage(boxFullImage);
        releaseImage(boxNoPointImage);
        isScriptRunning = false;
        return;
      }
    }
  }
  console.log("開始抽箱");
  while (isScriptRunning) {
    sleep(1500);
    if (checkIsBoxFinish()) {
      if(server == "JP"){
        isScriptRunning = false;
        console.log("點數用完");
        sendUrgentMessage(runningScriptName, "點數用完");
        break;
      }else{
        if (newBox) {
          resetBox();
        } else {
          break;
        }
      }
    }
    for (var t = 0; t < checkTime; t++) {
      if (!isScriptRunning) {
        break;
      }
      tapScale(600, 650);
      sleep(waitTime);
    }
  }
  releaseImage(boxFullImage);
  releaseImage(boxNoPointImage);
  isScriptRunning = false;
  console.log("結束抽箱");
}

function checkIsBoxFinish() {
  var screenshot = getScreenshotResize();
  var r = false;
  if (isGetBoxFull()) {
    console.log("禮物箱已滿");
    sendUrgentMessage(runningScriptName, "禮物箱已滿");
    releaseImage(screenshot);
    isScriptRunning = false;
    return true;
  }
  if (isGetBoxNoPoint()) {
    if(server == "TW"){
      r = true;
    }else{
      tapScale(600, 650);
      sleep(2000);      
      tapScale(600, 650);
      sleep(2000);
      if(isGetBoxNoPoint()){
        r = true;
      }
    }
  }
  releaseImage(screenshot);
  return r;
}

function resetBox() {
  console.log("重置箱子");
  clickIcon("boxReset");
  sleep(1000);
  tapScale(1275, 850);
  waitLoading();
  sleep(1000);
  tapScale(937, 850);
  sleep(1000);
}

function getFriendPoint() {
  console.log("執行友抽");
  sleep(1000);
  while (isScriptRunning) {
    if (!isFriendPointMainPage()) {
      console.log("請移到友抽畫面再執行");
      isScriptRunning = false;
      return;
    }
    if (isFriendPointTen()) {
      tapScale(1200, 825);
    } else if (isFriendPointFree()) {
      tapScale(938, 825);
    } else if (isFriendPointContinue()) {
      tapScale(1125, 875);
    } else {
      console.log("結束友抽");
      isScriptRunning = false;
      return;
    }
    sleep(1000);
    if (isFriendPointFull()) {
      console.log("結束友抽-倉庫已滿");
      isScriptRunning = false;
      return;
    }
    tapScale(1275, 850);
    sleep(1000);
    while (isScriptRunning) {
      sleep(2000);
      /*
            if(isFriendPointReload()){
                tapScale(1125,975);
                break;
            }else 
            */
      if (isFriendPointNew()) {
        tapScale(1635, 1012);
      } else if (isItemPage()) {
        tapScale(67, 60);
      } else if (isFriendPointContinue()) {
        tapScale(1125, 975);
        sleep(1000);
        if (isFriendPointFull()) {
          console.log("結束友抽-倉庫已滿");
          isScriptRunning = false;
          return;
        }
        tapScale(1275, 850);
        sleep(1000);
      } else {
        tapScale(1125, 10);
      }
    }
    sleep(2000);
  }
}

function eatFire() {
  isScriptRunning = true;
  var eat = 3;
  //eat = 4;
  if (eat == 3) {
    tapScale(644, 225);
  }
  sleep(1000);
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < eat; j++) {
      tapScale(120 + i * 130, 230 + j * 130);
      sleep(100);
    }
  }
  if (eat == 3) {
    tapScale(1140, 670);
    sleep(500);
    tapScale(1140, 670);
    sleep(500);
    tapScale(830, 590);
    sleep(1500);
    tapScale(640, 220);
    sleep(5000);
    tapScale(640, 220);
  }
}

loadApiCnt++;
console.log("Load get box api finish");
