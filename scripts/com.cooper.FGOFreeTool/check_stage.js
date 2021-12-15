var icon = [];
var iconMargin = [];

function setMarginIcon() {
  if (server == "TW") {
    icon["friendPointMain"] = [625, 538, 675, 108];
    icon["friendPointFree"] = [787, 790, 337, 75];
    icon["friendPointTen"] = [1125, 790, 240, 75];
    icon["boxNoPoint"] = [360, 630, 195, 82];
  } else {
    icon["friendPointMain"] = [675, 538, 675, 108];
    icon["friendPointFree"] = [787, 740, 337, 75];
    icon["friendPointTen"] = [1125, 740, 240, 75];
  }
  if (resolution < 17 / 9) {
    icon["friendPointContinue"][1] = 975;
    return;
  }
  if (resolution > 18 / 9) {
    icon["friendPointContinue"][1] = 975 - 22;
  }
}

function checkIconInScreen(iconName, threshold) {
  if (!isScriptRunning) {
    return false;
  }
  if (icon[iconName] == undefined) {
    console.log("checkIconInScreen no icon");
    return false;
  }
  var screenshot = getScreenshotResize();
  if (screenshot == null) {
    return false;
  }
  if (threshold == undefined) {
    threshold = 0.85;
  }

  var margin = 0;
  if (iconMargin[iconName] != true) {
    margin = defaultMarginX;
  }
  var iconPath = imagePath + iconName + ".png";
  if (isDebug) {
    console.log("checkIconInScreen open icon " + iconPath);
  }
  var iconImage = openImage(iconPath);
  var result = checkImage(
    screenshot,
    iconImage,
    icon[iconName][0] + margin,
    icon[iconName][1],
    icon[iconName][2],
    icon[iconName][3],
    threshold
  );
  releaseImage(screenshot);
  releaseImage(iconImage);
  if (isDebug) {
    console.log("checkIconInScreen result " + result);
  }
  return result;
}

function checkIconListInScreen(iconList, allPass, threshold) {
  if (threshold == undefined) {
    threshold = 0.85;
  }
  var screenshot = getScreenshotResize();
  if (screenshot == null) {
    return false;
  }
  for (var i = 0; i < iconList.length; i++) {
    var iconName = iconList[i];
    if (icon[iconName] == undefined) {
      console.log("checkIconInScreen no icon");
      return false;
    }
    var margin = 0;
    if (iconMargin[iconName] != true) {
      margin = defaultMarginX;
    }
    var iconPath = imagePath + iconName + ".png";
    if (isDebug) {
      console.log("checkIconInScreen open icon " + iconPath);
    }
    var iconImage = openImage(iconPath);
    var result = checkImage(
      screenshot,
      iconImage,
      icon[iconName][0] + margin,
      icon[iconName][1],
      icon[iconName][2],
      icon[iconName][3],
      threshold
    );
    releaseImage(iconImage);
    if (isDebug) {
      console.log("checkIconInScreen result " + result);
    }
    if (result && !allPass) {
      releaseImage(screenshot);
      return true;
    }
    if (!result && allPass) {
      releaseImage(screenshot);
      return false;
    }
  }
  releaseImage(screenshot);
  return allPass;
}

function clickIcon(iconName) {
  var margin = 0;
  if (iconMargin[iconName] != true) {
    margin = defaultMarginX;
  }
  tapScale(
    icon[iconName][0] + icon[iconName][2] / 2 + margin,
    icon[iconName][1] + icon[iconName][3] / 2,
    100,
    0
  );
}

function isItemPage(){
	return checkIconInScreen("itemPage");;
}

//friendPoint-----------------------------------------------
icon["friendPointMain"] = [675, 538, 675, 108];
icon["friendPointFree"] = [787, 740, 337, 75];
icon["friendPointContinue"] = [1050, 975, 187, 63];
icon["friendPointTen"] = [1125, 740, 240, 75];
icon["friendPointServantFull"] = [487, 225, 900, 187];
icon["friendPointItemFull"] = [487, 225, 900, 187];

function isFriendPointMainPage() {
  return checkIconInScreen("friendPointMain");
}

function isFriendPointFree() {
  return checkIconInScreen("friendPointFree");
}

function isFriendPointTen() {
  return checkIconInScreen("friendPointTen");
}

function isFriendPointNew() {
  //TODO: need check
  //return checkIconInScreen(22);
  return false;
}

function isFriendPointFull() {
  //TODO: need check
  return checkIconListInScreen(
    ["friendPointItemFull", "friendPointServantFull"],
    false
  );
}

function isFriendPointContinue() {
  return checkIconInScreen("friendPointContinue");
}

function isPresentBoxFull() {
  //TODO: need check
  return checkIconInScreen(26);
}

//getbox-----------------------------------------------
icon["boxNoPoint"] = [470,530,200,100];
icon["boxFull"] = [712, 600, 487, 300];
icon["boxReset"] = [1657, 330, 142, 30];

function isGetBoxNoPoint() {
  return checkIconInScreen("boxNoPoint", 0.7);
}

function isGetBoxFull() {
  return checkIconInScreen("boxFull");
}

loadApiCnt++;
console.log("Load check stage api finish");
