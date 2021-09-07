var loadApiCnt = 0;

var isDebug = false;

var skillUsedInLoop = undefined;

var lastTimeUseItem = -1;

function startScript(script) {
  console.log("開始執行指令，版本" + version + " " + server);
  if (server == "JP") {
    imagePath = packagePath + "image_jp/";
  } else {
    imagePath = packagePath + "image_tw/";
  }
  initScreenSize();
  isScriptRunning = true;
  console.log("開始執行腳本");
  runScript(script);
  isScriptRunning = false;
  console.log("腳本結束");
}

function stopScript() {
  isScriptRunning = false;
  console.log("User press stop");
}

//-----------------------------------------------------generial

var orientationLog = false;
function getScreenshotResize() {
  var size = getScreenSize();
  if (size.width < size.height) {
    if (!orientationLog) {
      orientationLog = true;
      console.log("螢幕方向錯誤");
    }
    return null;
  }
  if (orientationLog) {
    console.log("螢幕方向回復");
    orientationLog = false;
  }
  var screenshot = getScreenshot();
  var cutScreenshot = cropImage(
    screenshot,
    blackEdge[0] + blueEdge[0],
    blackEdge[1] + blueEdge[1],
    realScreenSize[0],
    realScreenSize[1]
  );
  var resizeScreenshot = resizeImage(
    cutScreenshot,
    realScreenSize[0] / screenScale[0],
    realScreenSize[1] / screenScale[1]
  );
  releaseImage(screenshot);
  releaseImage(cutScreenshot);
  return resizeScreenshot;
}

function checkImage(screenshot, icon, x, y, width, height, threshold) {
  if (isDebug) {
    console.log("checkImage", x, y, width, height);
  }
  if (threshold == undefined) {
    threshold = 0.85;
  }
  var crop = cropImage(screenshot, x, y, width, height);
  var find = findImage(crop, icon);
  releaseImage(crop);
  if (isDebug) {
    console.log("checkImage reslut " + find.score + " threshold " + threshold);
  }
  if (find == undefined) {
    return false;
  }
  if (find.score > threshold) {
    return true;
  } else {
    return false;
  }
}

function checkPixel(x,y,r,g,b,screenshot){
    var needRelease = false;
    if(screenshot == undefined){
        needRelease = true;
        screenshot = getScreenshotResize();
    }
    if(screenshot==null){
        return false;
    }
    var color = getImageColor(screenshot,x,y);
    if(needRelease){
        releaseImage(screenshot);
    }
    if(isDebug){
        console.log("get color "+x+","+y+":"+color.r+","+color.g+","+color.b);
    }
    if(isSameColor(color.r,color.g,color.b,r,g,b)){
        return true;
    }
    return false;
}

function tapScale(x, y, wait, margin) {
  if (!isScriptRunning) {
    return;
  }
  if (wait == undefined) {
    wait = 100;
  }
  if (margin == undefined) {
    margin = defaultMarginX;
  }
  var size = getScreenSize();
  if (size.width < size.height) {
    return;
  }
  x = (x + margin) * screenScale[0] + blueEdge[0] + blackEdge[0];
  y = y * screenScale[1] + blueEdge[1] + blackEdge[1];
  tap(x, y, wait);
}

function waitLoading() {
  while (isScriptRunning) {
    sleep(1500);
    if (!checkPixel(1800 + defaultMarginX, 1006, 255, 255, 255)) {
      return;
    }
  }
}

loadApiCnt++;
console.log("Load basic api finish");
