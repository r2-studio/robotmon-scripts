var icon = [];
var iconMargin = [];

function setMarginIcon() {
  if (server == "TW") {
    icon["friendPointMain"] = [625, 538, 675, 108];
    icon["friendPointFree"] = [787, 790, 337, 75];
    icon["friendPointTen"] = [1125, 790, 240, 75];
    icon["boxNoPoint"] = [360, 630, 195, 82];
    icon["settingDialog"] = [840, 220, 240, 60];
    icon["stageFailed"] = [900, 154, 140, 60];
  }else{
    icon["friendPointMain"] = [675, 538, 675, 108];
    icon["friendPointFree"] = [787, 740, 337, 75];
    icon["friendPointTen"] = [1125, 740, 240, 75];
    icon["boxNoPoint"] = [470, 530, 200, 100];
    icon["settingDialog"] = [750, 220, 350, 60];
    icon["stageFailed"] = [750, 160, 300, 60];
  }
  
  if (resolution < 17 / 9) {
    //default
    icon["main"][0] = 1710;
    iconMargin["main"] = undefined;

    icon["teamPage"][0] = 1702;
    icon["teamPage"][1] = 975;
    iconMargin["teamPage"] = undefined;

    icon["friendPage"][0] = 1110;
    iconMargin["friendPage"] = undefined;

    icon["friendEnd"][0] = 1852;
    iconMargin["friendEnd"] = undefined;

    icon["friendEnd3"][0] = 1852;
    iconMargin["friendEnd3"] = undefined;

    icon["battleMain1"][0] = 1752;
    iconMargin["battleMain1"] = undefined;

    icon["battleMain2"][0] = 1752;
    iconMargin["battleMain2"] = undefined;

    icon["battleMain3"][0] = 1672;
    iconMargin["battleMain3"] = undefined;

    icon["friendPointContinue"][1] = 975;

    icon["itemPage"][0] = 32;
    iconMargin["itemPage"] = undefined;
    return;
  }
  icon["main"][0] = realScreenSize[0] / screenScale[0] - 337;
  iconMargin["main"] = true;

  icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 220;
  iconMargin["battleMain1"] = true;

  icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 220;
  iconMargin["battleMain2"] = true;

  if (resolution <= 18 / 9) {
    return;
  }
  icon["teamPage"][0] = realScreenSize[0] / screenScale[0] - 305;
  icon["teamPage"][1] = realScreenSize[1] / screenScale[1] - 150;
  iconMargin["teamPage"] = true;

  icon["friendPage"][0] = 1237;
  iconMargin["friendPage"] = true;

  icon["friendEnd"][0] = realScreenSize[0] / screenScale[0] - 195;
  iconMargin["friendEnd"] = true;

  icon["friendEnd3"][0] = realScreenSize[0] / screenScale[0] - 195;
  iconMargin["friendEnd3"] = true;

  icon["battleMain3"][0] = realScreenSize[0] / screenScale[0] - 375;
  iconMargin["battleMain3"] = true;

  if (resolution > 18 / 9) {
    icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 265;
    iconMargin["battleMain1"] = true;

    icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 265;
    iconMargin["battleMain2"] = true;

    icon["friendPointContinue"][1] = 975 - 22;

    icon["itemPage"][0] = 160;
    iconMargin["itemPage"] = true;
  }
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
      console.log("checkIconInScreen no icon " + iconName);
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

function checkIconInScreen(iconName, threshold, screenshot) {
  if (!isScriptRunning) {
    return false;
  }
  if (icon[iconName] == undefined) {
    console.log("checkIconInScreen no icon " + iconName);
    return false;
  }
  if (screenshot == undefined) {
    screenshot = getScreenshotResize();
  }
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
//select stage-----------------------------------------------
icon["main"] = [1710, 924, 150, 75];
icon["apple"] = [795, 67, 300, 75];
icon["selectStageItemFull"] = [487, 225, 900, 187];
icon["selectStageServantFull"] = [487, 225, 900, 187];

function isMainPage() {
  return checkIconInScreen("main");
}

function isStageRestart() {
  return checkIconInScreen("stageRestart");
}

function isStageRestartEvent() {
  return checkIconInScreen("stageRestartEvent");
}

function isItemOrServantFullDialog() {
  return checkIconListInScreen(
    ["selectStageServantFull", "selectStageItemFull"],
    false
  );
}

function isUseAppleDialog() {
  return checkIconInScreen("apple", 0.75);
}

//select friend-----------------------------------------------
icon["friendPage"] = [1110, 150, 225, 75];
icon["friendRefresh"] = [840, 150, 240, 90];
icon["friendRefresh2"] = [840, 150, 240, 90];
icon["friendEnd"] = [1852, 1027, 60, 45];
icon["friendEnd3"] = [1852, 1027, 60, 45];
icon["friendEmpty"] = [675, 630, 525, 60];

function isSelectFriendPage() {
  //Align left
  return checkIconInScreen("friendPage");
}

function isSelectFriendRefreshDialog() {
  //TODO
  return checkIconListInScreen(["friendRefresh", "friendRefresh2"], false);
}

function isSelectFriendEnd() {
  //TODO: need check
  return checkIconListInScreen(["friendEnd", "friendEnd3"], false);
}

function isSelectFriendEmpty() {
  return checkIconInScreen("friendEmpty");
}

//select team-----------------------------------------------
icon["teamPage"] = [1702, 975, 172, 75];
icon["useItemDialog"] = [1140, 960, 200, 60];

function isSelectTeamPage() {
  return checkIconInScreen("teamPage");
}

function isUseItemDialog() {
  if (server == "TW") {
    return checkIconInScreen("useItemDialog");
  }
  //TODO
  return false;
}

//battle-----------------------------------------------
icon["battleMain1"] = [1752, 262, 90, 90];
icon["battleMain2"] = [1752, 423, 90, 90];
icon["battleMain3"] = [1672, 960, 105, 75];
icon["battleServant1"] = [375, 90, 600, 45];
icon["battleServant2"] = [375, 90, 600, 45];
icon["battleSkill"] = [855, 255, 210, 45];
icon["battleTarget"] = [1620, 195, 60, 60];
icon["spaceColor"] = [690, 288, 540, 45];
icon["emiyaColor"] = [690, 240, 540, 90];
icon["ultFailed"] = [900, 637, 123, 60];
icon["skillFailed"] = [870, 802, 180, 60];
icon["settingDialog"] = [750, 220, 350, 60];

function isBattleMainPage() {
  if (
    checkIconListInScreen(
      ["battleMain1", "battleMain2", "battleMain3"],
      true,
      0.8
    )
  ) {
    //if(server == "TW"){
    return true;
    //}
    /*
		// double check ring color
		var screenshot = getScreenshotResize();
		if(checkPixel(1075,665,163,146,121,screenshot)
			&& checkPixel(1135,690,191,175,150,screenshot)
			&& checkPixel(1200,665,163,146,121,screenshot)){
			releaseImage(screenshot);
			return true;
		}
		releaseImage(screenshot);
		*/
  }
  return false;
}

function isSettingDialog() {
  return checkIconInScreen("settingDialog");
}

function isBattleCardPage() {
  // no idea to check
  return false;
}

function isBattleServantDialog() {
  return checkIconListInScreen(
    ["battleServant1", "battleServant2"],
    false,
    0.9
  );
}

function isBattleSkillFailedDialog() {
  return checkIconInScreen("skillFailed");
}

function isBattleUltFailedDialog() {
  return checkIconInScreen("ultFailed");
}

function isBattleSkillDetailDialog() {
  return checkIconInScreen("battleSkill");
}

function isBattleSkillTargetDialog() {
  return checkIconInScreen("battleTarget");
}

function isBattleSkillSpaceDialog() {
  if (isBattleSkillEmiyaDialog()) {
    return false;
  }
  return checkIconInScreen("spaceColor", 0.75);
}

function isBattleSkillEmiyaDialog() {
  if (server == "TW") {
    return false;
  }
  return checkIconInScreen("emiyaColor", 0.75);
}

//finish-----------------------------------------------
icon["finishNext"] = [1575, 933, 180, 60];
icon["stageRestart"] = [1140, 810, 240, 75];
icon["stageRestartEvent"] = [1260, 810, 240, 75];
icon["stageFailed"] = [750, 160, 300, 60];
icon["stageFailed2"] = [860, 570, 200, 60];
icon["addFriend"] = [1710, 135, 120, 37];
icon["itemPage"] = [32, 35, 66, 45];

function isBattleStageFailedDialog() {
  return checkIconListInScreen(["stageFailed", "stageFailed2"], true);
}

function isFinishBondPage() {
  if (isFinishNext()) {
    sleep(3000);
    if (isFinishNext()) {
      return true;
    }
  }
  tapScale(1650, 450);
  return false;
}

function isFinishNext() {
  return checkIconInScreen("finishNext");
}

function isFinishDropDialoge() {
  //TODO: need check
  //TODO:TW
  //return checkIconInScreen(28);
  //return checkIconInScreen();
  return false;
}

function isAddFriendPage() {
  return checkIconInScreen("addFriend");
}

function isItemPage() {
  return checkIconInScreen("itemPage");
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
icon["boxFull"] = [712, 600, 487, 300];
icon["boxNoPoint"] = [470, 530, 200, 100];
icon["boxReset"] = [1657, 330, 142, 30];

function isGetBoxNoPoint() {
  return checkIconInScreen("boxNoPoint", 0.7);
}

function isGetBoxFull() {
  return checkIconInScreen("boxFull");
}

loadApiCnt++;
console.log("Load check stage api finish");
