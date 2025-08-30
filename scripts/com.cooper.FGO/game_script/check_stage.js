var icon = [];
var iconMargin = [];

function setMarginIcon() {
  if(isDebug){
    console.log("setMarginIcon "+server);
  }
  if (server == "TW") {
    icon["boxNoPoint"] = [360, 630, 195, 82];
    icon["settingDialog"] = [840, 220, 240, 60];
    icon["stageFailed"] = [900, 154, 140, 60];
    icon["stageRestart"] = [1140, 810, 240, 75];
    icon["friendPointFree"] = [787, 740, 337, 75];
  } else {
    icon["boxNoPoint"] = [470, 530, 200, 100];
    icon["settingDialog"] = [750, 220, 350, 60];
    icon["stageFailed"] = [750, 160, 300, 60];
    icon["stageRestart"] = [1140, 836, 240, 75];
    icon["friendPointFree"] = [810, 740, 300, 75];
  }

  //1920 default
  if (resolution < 17 / 9) {
    icon["main"][0] = 1710;
    iconMargin["main"] = undefined;

    icon["teamPage"][0] = 1702;
    icon["teamPage"][1] = 975;
    iconMargin["teamPage"] = undefined;

    icon["teamAutoBuild"][0] = 400;
    icon["teamAutoBuild"][1] = 975;
    iconMargin["teamAutoBuild"] = undefined;

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

  //1921~2160
  icon["main"][0] = realScreenSize[0] / screenScale[0] - 337;
  iconMargin["main"] = true;

  icon["teamPage"][0] = 1702;
  icon["teamPage"][1] = 975;
  iconMargin["teamPage"] = undefined;

  icon["teamAutoBuild"][0] = 400;
  icon["teamAutoBuild"][1] = 975;
  iconMargin["teamAutoBuild"] = undefined;

  icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 220;
  iconMargin["battleMain1"] = true;

  icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 220;
  iconMargin["battleMain2"] = true;

  if (resolution <= 18 / 9) {
    return;
  }
  //2161~
  icon["teamPage"][0] = realScreenSize[0] / screenScale[0] - 305;
  icon["teamPage"][1] = realScreenSize[1] / screenScale[1] - 150;
  iconMargin["teamPage"] = true;

  icon["teamAutoBuild"][0] = 536;
  icon["teamAutoBuild"][1] = realScreenSize[1] / screenScale[1] - 150;
  iconMargin["teamAutoBuild"] = true;

  icon["friendPage"][0] = 1237;
  iconMargin["friendPage"] = true;

  icon["friendEnd"][0] = realScreenSize[0] / screenScale[0] - 195;
  iconMargin["friendEnd"] = true;

  icon["friendEnd3"][0] = realScreenSize[0] / screenScale[0] - 195;
  iconMargin["friendEnd3"] = true;

  icon["battleMain3"][0] = realScreenSize[0] / screenScale[0] - 375;
  iconMargin["battleMain3"] = true;

  icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 265;
  iconMargin["battleMain1"] = true;

  icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 265;
  iconMargin["battleMain2"] = true;

  icon["friendPointContinue"][1] = 975 - 22;

  icon["itemPage"][0] = 160;
  iconMargin["itemPage"] = true;
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
icon["whiteConfirm"] = [450, 700, 500, 200];
icon["whiteFinish"] = [550, 550, 800, 350];
icon["whiteStartFailed"] = [550, 400, 800, 500];

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

function isWhiteConfirmDialog() {
  return checkIconInScreen("whiteConfirm");
}

function iswhiteStartFailedDialog() {
  return checkIconInScreen("whiteStartFailed");
}

function isWhiteFinishDialog() {
  return checkIconInScreen("whiteFinish");
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
  return checkIconListInScreen(["friendEnd", "friendEnd3"], false, 0.9);
}

function isSelectFriendEmpty() {
  return checkIconInScreen("friendEmpty");
}

//select team-----------------------------------------------
icon["teamPage"] = [1702, 975, 172, 75];
icon["useItemDialog"] = [1140, 960, 200, 60];
icon["teamAutoBuild"] = [400, 975, 100, 75];
icon["teamAutoBuildDialog"] = [1230, 800, 320, 60];
icon["startStageMemberFailed"] = [450, 100, 1000, 80];
icon["teamMemberCheckDialog"] = [850, 860, 190, 70];

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

function isTeamMemberCheckDialog(){  
  if (server == "TW") {
    //TODO
    return false
  }
  return checkIconInScreen("teamMemberCheckDialog");
}

function isTeamAutoBuild() {
  return checkIconInScreen("teamPage");
}

function isTeamAutoBuildDialog() {
  return checkIconInScreen("teamAutoBuildDialog");
}

function isStartStageMemberFailed() {
  return checkIconInScreen("startStageMemberFailed");
}

//battle-----------------------------------------------
icon["battleMain1"] = [1752, 262, 90, 90];
icon["battleMain2"] = [1752, 423, 90, 90];
icon["battleMain3"] = [1672, 960, 105, 75];
icon["battleServant1"] = [375, 90, 600, 45];
icon["battleServant2"] = [375, 90, 600, 45];
icon["battleSkill"] = [855, 255, 210, 45];
icon["kkl"] = [800, 600, 300, 80];
icon["kkl2"] = [1640, 240, 60, 60];
icon["battleTarget"] = [1620, 195, 60, 60];
icon["spaceColor"] = [690, 288, 540, 45];
icon["emiyaColor"] = [690, 240, 540, 90];
icon["dubaiSkill"] = [760, 220, 395, 90];
icon["dubaiSkill2"] = [760, 220, 395, 90];
icon["dubaiSkill3"] = [760, 220, 395, 90];
icon["rabbitSkill"] = [765,600,370,60];
icon["rabbitSkill2"] = [1245,600,370,60];
icon["kishinamiSkill"] = [660,600,260,60];
icon["kishinamiSkill2"] = [1000,600,260,60];
icon["kishinamiSkill3"] = [1360,600,260,60];
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

function isBattleKklDialog() {
  return checkIconListInScreen(["kkl", "kkl2"], true);
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
  return checkIconInScreen("emiyaColor", 0.75);
}

function isBattleSkillDubaiDialog() {  
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["dubaiSkill", "dubaiSkill2", "dubaiSkill3"], false);
}

function isBattleSkillRabbitDialog() {
  //Warning: will conflic with kkl, shoude run before isBattleKklDialog
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["rabbitSkill", "rabbitSkill2"], true);
}

function isBattleSkillKishinamiDialog() {  
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["kishinamiSkill", "kishinamiSkill2", "kishinamiSkill3"], true);
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
icon["friendPointMain"] = [1130, 20, 100, 90];
icon["friendPointFree"] = [810, 740, 300, 75];
icon["friendPointFreeEvent"] = [787, 740, 337, 75];
icon["friendPointTen"] = [1125, 740, 240, 75];
icon["friendPointTenEvent"] = [1125, 740, 240, 75];
icon["friendPointHundred"] = [1200, 740, 240, 75];
icon["friendPointContinue"] = [1050, 975, 187, 63];
icon["friendPointServantFull"] = [487, 225, 900, 187];
icon["friendPointItemFull"] = [487, 225, 900, 187];

function isFriendPointMainPage() {
  return checkIconInScreen("friendPointMain");
}

function isFriendPointFree() {
  return checkIconListInScreen(
    ["friendPointFree", "friendPointFreeEvent"],
    false
  );
}

function isFriendPointTen() {
    return checkIconListInScreen(
      ["friendPointTen", "friendPointTenEvent", "friendPointHundred"],
      false
    );
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
