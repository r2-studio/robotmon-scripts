var defaultScreenSize = [1920, 1080];
//over 21:9 or less then 16:9 will have blue edge
var screenScale = [];
var blueEdge = [];
var realScreenSize = [];
var resolution = 16 / 9;

var defaultMarginX = 0;

function initScreenSize() {
  blueEdge[0] = 0;
  blueEdge[1] = 0;
  //var w = size.width;
  //var h = size.height;
  if(blackEdge == undefined){
    clearBlackEdge();
  }
  var w = blackEdge[2] - blackEdge[0] + 1;
  var h = blackEdge[3] - blackEdge[1] + 1;
  //setMargin();
  if (w < h) {
    //swap
    var tmp = h;
    h = w;
    w = tmp;
  }
  resolution = w / h;
  var wo = w;
  var ho = h;
  if (resolution < 16 / 9) {
    h = (wo * 9) / 16;
    blueEdge[1] = (ho - h) / 2;
    resolution = 16 / 9;
  } else if (resolution > 21 / 9) {
    w = (ho * 21) / 9;
    blueEdge[0] = (wo - w) / 2;
    resolution = 21 / 9;
  }
  //screenScale[0] = w / defaultScreenSize[0];
  screenScale[1] = h / defaultScreenSize[1];
  screenScale[0] = screenScale[1];
  realScreenSize[0] = w;
  realScreenSize[1] = h;

  if (resolution > 16 / 9) {
    defaultMarginX =
      (realScreenSize[0] / screenScale[0] - defaultScreenSize[0]) / 2;
  }
  setMarginIcon();
  setFriendMargin();
  setInStageMargin();
  setAutoAttackMargin();
}

function setBlackEdgeByHtmlValue(be) {
  if (be != undefined && be.length >= 4) {
    for (var i = 0; i < 4; i++) {
      if (be[i] != 0) {
        blackEdge = be;
        return;
      }
    }
  }
  clearBlackEdge();
}

function clearBlackEdge() {
  var size = getScreenSize();
  if (size.width > size.height) {
    blackEdge = [0, 0, size.width - 1, size.height - 1];
  } else {
    blackEdge = [0, 0, size.height - 1, size.width - 1];
  }
}


function detectBlackEdge() {
  sleep(2000);
  var screenshot = getScreenshot();
  var imageSize = getImageSize(screenshot);
  var width = imageSize.width;
  var height = imageSize.height;
  var result = [0, 0, width - 1, height - 1];
  //actual is first color pixel

  var ltColor = getImageColor(screenshot, 0, 0);
  var rbColor = getImageColor(screenshot, width - 1, height - 1);
  if (ltColor.r < 35 && ltColor.g < 35 && ltColor.b < 35) {
    var leftBlackEdge = 0;
    var haveLeftBlackEdge = true;
    for (var y = 1; y < height; y++) {
      var color = getImageColor(screenshot, 0, y);
      if (!isSameColor(color, ltColor, 0)) {
        haveLeftBlackEdge = false;
        break;
      }
    }
    if (haveLeftBlackEdge) {
      var mid = height / 2;
      for (var x = 1; x < width / 2; x++) {
        var color = getImageColor(screenshot, x, mid);
        if (!isSameColor(color, ltColor, 0)) {
          leftBlackEdge = x - 1;
          break;
        }
      }
      for (var y = 0; y < height; y++) {
        var color = getImageColor(screenshot, leftBlackEdge, y);
        if (!isSameColor(color, ltColor, 0)) {
          if (leftBlackEdge < 0) {
            break;
          }
          leftBlackEdge--;
          y = -1;
          continue;
        }
      }
      leftBlackEdge++;
    }
    result[0] = leftBlackEdge;

    var topBlackEdge = 0;
    var haveTopBlackEdge = true;
    for (var x = 1; x < width; x++) {
      var color = getImageColor(screenshot, x, 0);
      if (!isSameColor(color, ltColor, 0)) {
        haveTopBlackEdge = false;
        break;
      }
    }
    if (haveTopBlackEdge) {
      var mid = width / 2;
      for (var y = 1; y < height / 2; y++) {
        var color = getImageColor(screenshot, mid, y);
        if (!isSameColor(color, ltColor, 0)) {
          topBlackEdge = y - 1;
          break;
        }
      }
      for (var x = 0; x < width; x++) {
        var color = getImageColor(screenshot, x, topBlackEdge);
        if (!isSameColor(color, ltColor, 0)) {
          if (topBlackEdge < 0) {
            break;
          }
          topBlackEdge--;
          x = -1;
          continue;
        }
      }
      topBlackEdge++;
    }
    result[1] = topBlackEdge;
  }

  if (rbColor.r < 35 && rbColor.g < 35 && rbColor.b < 35) {
    var rightBlackEdge = width - 1;
    var haveRightBlackEdge = true;
    for (var y = 0; y < height - 1; y++) {
      var color = getImageColor(screenshot, width - 1, y);
      if (!isSameColor(color, rbColor, 0)) {
        haveRightBlackEdge = false;
        break;
      }
    }
    if (haveRightBlackEdge) {
      var mid = height / 2;
      for (var x = width - 1; x > width / 2; x--) {
        var color = getImageColor(screenshot, x, mid);
        if (!isSameColor(color, rbColor, 0)) {
          rightBlackEdge = x + 1;
          break;
        }
      }
      for (var y = 0; y < height; y++) {
        var color = getImageColor(screenshot, rightBlackEdge, y);
        if (!isSameColor(color, rbColor, 0)) {
          if (rightBlackEdge > width - 1) {
            break;
          }
          rightBlackEdge++;
          y = -1;
          continue;
        }
      }
      rightBlackEdge--;
    }
    result[2] = rightBlackEdge;

    var bottomBlackEdge = height - 1;
    var haveBottomBlackEdge = true;
    for (var x = 0; x < width - 1; x++) {
      var color = getImageColor(screenshot, x, height - 1);
      if (!isSameColor(color, rbColor, 0)) {
        haveBottomBlackEdge = false;
        break;
      }
    }
    if (haveBottomBlackEdge) {
      var mid = width / 2;
      for (var y = height - 1; y > height / 2; y--) {
        var color = getImageColor(screenshot, mid, y);
        if (!isSameColor(color, rbColor, 0)) {
          bottomBlackEdge = y + 1;
          break;
        }
      }
      for (var x = 0; x < width; x++) {
        var color = getImageColor(screenshot, x, bottomBlackEdge);
        if (!isSameColor(color, rbColor, 0)) {
          if (bottomBlackEdge > height - 1) {
            break;
          }
          bottomBlackEdge++;
          x = -1;
          continue;
        }
      }
      bottomBlackEdge--;
    }
    result[3] = bottomBlackEdge;
  }
  console.log("取得黑邊 " + result);
  releaseImage(screenshot);
  return result.toString();
}

loadApiCnt++;
console.log("Load screen api finish");
