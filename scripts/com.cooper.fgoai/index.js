// fgoai-script core (ES5, Robotmon): init, settings and the basic screen helpers. Ported from
// fgoautoscript index.js (initServer), preference.js, basic.js and screen.js. Only a 1920x1080 screen is
// supported (the user, 2026-10-26): no black edges, scaling or margins, every position is a 1920x1080
// pixel. Settings come from fgoai (FgoaiScriptSettings), not from fgoautoscript's preference files.

var server;
var imagePath; // the template pictures: scripts/com.cooper.fgoai/image_tw/ or image_jp/
var itemPath; // the kit's script folder (bridge/robotmon.py KIT_SCRIPT_ID)
var fgoaiSettings = null;

var runningScriptName = "fgoai-script";
var isDebug = false;
var skillUsedInLoop = undefined;
var lastTimeUseItem = -1;
var isScriptRunning = false;
var isReplay = false;
var selectFriendList = [];

// preferences (fgoautoscript preference.js), filled from the settings by fgoaiInit
var selectFriendLoose = 0; // 0 strict 1 loose
var servantDirection = 0; // 0 l->r 1 r->l
var skillDirection = 0; // 0 l->r 1 r->l
var spaceUltColor = 1;
var kukulkanUseStar = 7;
var dubaiSkill = 0;
var friendAlgorithm = 0; // 0 pixel detection 1 image matching
var rabbitSkill = 0;
var kishinamiSkill = 0;
var soujyuroSkill = 0;
var lilithSkill = 0;

var SCREEN_WIDTH = 1920;
var SCREEN_HEIGHT = 1080;

// false when the screen is not 1920x1080 (either way round)
function fgoaiInit(settings) {
  fgoaiSettings = settings;
  server = settings.server;
  itemPath = getStoragePath() + "/scripts/com.cooper.fgoai/";
  imagePath = itemPath + (server == "JP" ? "image_jp/" : "image_tw/");
  selectFriendLoose = settings.selectFriendLoose;
  servantDirection = settings.servantDirection;
  skillDirection = settings.skillDirection;
  spaceUltColor = settings.spaceUltColor;
  kukulkanUseStar = settings.kukulkanUseStar;
  dubaiSkill = settings.dubaiSkill;
  friendAlgorithm = settings.friendAlgorithm;
  rabbitSkill = settings.rabbitSkill;
  kishinamiSkill = settings.kishinamiSkill;
  soujyuroSkill = settings.soujyuroSkill;
  lilithSkill = settings.lilithSkill;
  var size = getScreenSize();
  if (Math.max(size.width, size.height) != SCREEN_WIDTH || Math.min(size.width, size.height) != SCREEN_HEIGHT) {
    console.log("fgoai-script: 只支援 1920x1080，這台是 " + size.width + "x" + size.height);
    return false;
  }
  // per-server positions, set again on every init
  if (typeof buildIconTable === "function") {
    buildIconTable();
    setServerIcons();
  }
  if (typeof setInStagePositions === "function") {
    setInStagePositions();
  }
  if (typeof setAutoAttackPositions === "function") {
    setAutoAttackPositions();
  }
  return true;
}

function startScript(loopTime, script) {
  console.log("fgoai-script: 開始執行指令");
  if (script == undefined || script.length <= 0) {
    console.log("請先設定腳本指令再開始執行");
    return true;
  }
  isScriptRunning = true;
  var next = 1;
  if (loopTime < 0) {
    next = 0;
    loopTime = 1;
  }
  for (var loop = 0; loop < loopTime; loop += next) {
    if (!isScriptRunning) {
      break;
    }
    if (next == 0) {
      console.log("開始執行腳本 無限次數");
    } else {
      console.log("開始執行腳本 " + (loop + 1) + "/" + loopTime);
    }
    skillUsedInLoop = [false, false, false, false, false, false, false, false, false];
    selectFriendList = [];
    spaceUltColor = fgoaiSettings.spaceUltColor; // resetSpaceUltColor
    isReplay = false;
    runScript(script);
  }
  isScriptRunning = false;
  console.log("腳本指令結束");
  return false;
}

function stopScript() {
  isScriptRunning = false;
  console.log("手動停止腳本");
}

function getKKLArray() {
  var t = 1;
  var arr = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    if ((kukulkanUseStar & t) == 0) {
      arr[i] = 0;
    } else {
      arr[i] = 1;
    }
    t *= 2;
  }
  return arr;
}

//-----------------------------------------------------screen

//-----------------------------------------------------basic

var orientationLog = false;
function getScreenshotResize() {
  if (typeof fgoaiTick === "function") {
    fgoaiTick(); // the tool kit's time limit (kit.js)
  }
  var size = getScreenSize();
  if (size.width < size.height) {
    if (!orientationLog) {
      orientationLog = true;
      console.log("螢幕方向錯誤");
    }
    return null;
  }
  if (orientationLog) {
    console.log("螢幕方向回復，等待10秒繼續執行");
    sleep(10000);
    orientationLog = false;
  }
  return getScreenshot();
}

function checkImage(screenshot, icon, x, y, width, height, threshold) {
  if (threshold == undefined) {
    threshold = 0.85;
  }
  var crop = cropImage(screenshot, x, y, width, height);
  var find = findImage(crop, icon);
  releaseImage(crop);
  if (find == undefined) {
    return false;
  }
  return find.score > threshold;
}

function checkPixel(x, y, r, g, b, screenshot, threshold) {
  if (threshold == undefined) {
    threshold = 20;
  }
  var needRelease = false;
  if (screenshot == undefined) {
    needRelease = true;
    screenshot = getScreenshotResize();
  }
  if (screenshot == null) {
    return false;
  }
  var color = getImageColor(screenshot, x, y);
  if (needRelease) {
    releaseImage(screenshot);
  }
  return isSameColor(color.r, color.g, color.b, r, g, b, threshold);
}

// steps for the app's trace (fgoai/trace_device.py): every tap, swipe and log, handed back with the script's
// own result (run.js, kit.js) and cleared; never read by a RunScript of its own
var FGOAI_STEPS_MAX = 2000;
var fgoaiSteps = fgoaiSteps || [];
var fgoaiStepsDropped = fgoaiStepsDropped || 0;

function fgoaiStep(kind, x, y, x2, y2, text) {
  if (fgoaiSteps.length >= FGOAI_STEPS_MAX) {
    fgoaiSteps.shift();
    fgoaiStepsDropped++;
  }
  fgoaiSteps.push({ ms: Date.now(), kind: kind, x: x, y: y, x2: x2, y2: y2, text: text || "" });
}

function fgoaiTakeSteps() {
  var taken = { steps: fgoaiSteps, dropped: fgoaiStepsDropped };
  fgoaiSteps = [];
  fgoaiStepsDropped = 0;
  return taken;
}

(function () {
  try {
    if (console.fgoaiWrapped) {
      return; // the modules are sent again with every script: wrap once
    }
    var original = console.log;
    console.log = function (message) {
      fgoaiStep("log", null, null, null, null, String(message));
      return original.apply(console, arguments);
    };
    console.fgoaiWrapped = true;
  } catch (e) {
    // a console that cannot be wrapped: the logs are just not traced
  }
})();

// a tap at a 1920x1080 position (skipped while the screen is the wrong way round)
function tapScale(x, y, wait) {
  if (!isScriptRunning) {
    return;
  }
  if (wait == undefined) {
    wait = 100;
  }
  var size = getScreenSize();
  if (size.width < size.height) {
    return;
  }
  fgoaiStep("tap", x, y, null, null, "");
  tap(x, y, wait);
}

function swipeScale(x, y, endX, endY, step) {
  var size = getScreenSize();
  if (!isScriptRunning || size.width < size.height) {
    return;
  }
  fgoaiStep("swipe", x, y, endX, endY, "");
  var xStep = (endX - x) / step;
  var yStep = (endY - y) / step;

  tapDown(x, y, 40);
  for (var s = 0; s < step; s++) {
    if (!isScriptRunning) {
      break;
    }
    moveTo(x + s * xStep, y + s * yStep, 4);
  }
  moveTo(endX, endY, 4);
  sleep(500);
  tapUp(endX, endY, 40);
}

function waitLoading() {
  sleep(1500);
}

function isSameColor(r1, g1, b1, r2, g2, b2, threshold) {
  if (r2 == undefined) {
    threshold = b1;
    var c1 = r1;
    var c2 = g1;
    r1 = c1.r;
    g1 = c1.g;
    b1 = c1.b;
    r2 = c2.r;
    g2 = c2.g;
    b2 = c2.b;
  }
  if (threshold == undefined) {
    threshold = 20;
  }
  var diff = 0;
  diff += Math.abs(r1 - r2);
  diff += Math.abs(g1 - g2);
  diff += Math.abs(b1 - b2);
  return diff <= threshold;
}

// fgoai-script screens (ES5): the icon table and the is* screen checks, from fgoautoscript check_stage.js.
// The table is rebuilt on every fgoaiInit (setServerIcons moves a few per server; 1920x1080 only). Not
// ported: the box, friend point and team auto build icons and checks (fgoai never uses them).

var icon = {};

function buildIconTable() {
  icon = {};
  // select stage
  icon["main"] = [1710, 924, 150, 75];
  icon["apple"] = [795, 67, 300, 75];
  icon["selectStageItemFull"] = [487, 225, 900, 187];
  icon["selectStageServantFull"] = [487, 225, 900, 187];
  icon["whiteConfirm"] = [450, 700, 500, 200];
  icon["whiteConfirm2"] = [450, 700, 500, 200];
  icon["whiteFinish"] = [550, 550, 800, 350];
  icon["whiteStartFailed"] = [550, 400, 800, 500];
  // select friend
  icon["friendPage"] = [1110, 150, 225, 75];
  icon["friendRefresh"] = [840, 150, 240, 90];
  icon["friendRefresh2"] = [840, 150, 240, 90];
  icon["friendEnd"] = [1852, 1027, 60, 45];
  icon["friendEnd3"] = [1852, 1027, 60, 45];
  icon["friendEmpty"] = [675, 630, 525, 60];
  // select team
  icon["teamPage"] = [1702, 975, 172, 75];
  icon["useItemDialog"] = [1140, 960, 200, 60];
  icon["startStageMemberFailed"] = [450, 100, 1000, 80];
  icon["teamMemberCheckDialog"] = [850, 860, 190, 70];
  // battle
  icon["battleMain1"] = [1752, 262, 90, 90];
  icon["battleMain2"] = [1752, 423, 90, 90];
  icon["battleMain3"] = [1672, 960, 105, 75];
  icon["battleServant1"] = [375, 90, 600, 45];
  icon["battleServant2"] = [375, 90, 600, 45];
  icon["battleSkill"] = [855, 255, 210, 45];
  icon["kkl"] = [800, 600, 300, 80];
  icon["kkl2"] = [1640, 240, 60, 60];
  icon["kklSkill1"] = [261, 354, 183, 183];
  icon["kklSkill2"] = [261, 354, 183, 183];
  icon["kklSkill3"] = [261, 354, 183, 183];
  icon["battleTarget"] = [1620, 195, 60, 60];
  icon["spaceColor"] = [690, 288, 540, 45];
  icon["emiyaColor"] = [690, 240, 540, 90];
  icon["dubaiSkill"] = [760, 220, 395, 90];
  icon["dubaiSkill2"] = [760, 220, 395, 90];
  icon["dubaiSkill3"] = [760, 220, 395, 90];
  icon["rabbitSkill"] = [765, 600, 370, 60];
  icon["rabbitSkill2"] = [1245, 600, 370, 60];
  icon["rabbitSkill3"] = [261, 354, 183, 183];
  icon["kishinamiSkill"] = [660, 600, 260, 60];
  icon["kishinamiSkill2"] = [1000, 600, 260, 60];
  icon["kishinamiSkill3"] = [1360, 600, 260, 60];
  icon["soujyuroSkill"] = [660, 600, 260, 60];
  icon["soujyuroSkill2"] = [1000, 600, 260, 60];
  icon["soujyuroSkill3"] = [1360, 600, 260, 60];
  icon["lilithSkill"] = [261, 354, 183, 183];
  icon["lilithSkill2"] = [306, 597, 348, 74];
  icon["lilithSkill3"] = [786, 597, 348, 74];
  icon["lilithSkill4"] = [1266, 597, 348, 74];
  icon["ultFailed"] = [900, 637, 123, 60];
  icon["skillFailed"] = [870, 802, 180, 60];
  icon["settingDialog"] = [750, 140, 350, 60];
  // finish
  icon["finishNext"] = [1575, 933, 180, 60];
  icon["stageRestart"] = [1140, 836, 240, 75];
  icon["stageRestartEvent"] = [1260, 810, 240, 75];
  icon["stageFailed"] = [750, 160, 300, 60];
  icon["stageFailed2"] = [860, 570, 200, 60];
  icon["addFriend"] = [1710, 135, 120, 37];
  icon["itemPage"] = [32, 35, 66, 45];
  icon["finishEvent1"] = [763, 798, 394, 93];
  icon["finishEvent2"] = [700, 138, 520, 100];
}

function setServerIcons() {
  if (server == "TW") {
    icon["settingDialog"] = [840, 220, 240, 60];
    icon["stageFailed"] = [900, 180, 140, 60]; //接關 (dialog has the 靈脈石 button row)
    icon["stageFailed2"] = [860, 690, 200, 60]; //戰利品
  } else {
    icon["settingDialog"] = [750, 140, 350, 70];
    icon["stageFailed"] = [750, 160, 300, 60];
    icon["stageFailed2"] = [860, 570, 200, 60];
  }
}

function checkIconListInScreen(iconList, allPass, threshold, sharedScreenshot) {
  if (threshold == undefined) {
    threshold = 0.85;
  }
  var screenshot = sharedScreenshot;
  if (screenshot == undefined || screenshot == null) {
    screenshot = getScreenshotResize();
  }
  if (screenshot == null) {
    return false;
  }
  for (var i = 0; i < iconList.length; i++) {
    var iconName = iconList[i];
    if (icon[iconName] == undefined) {
      console.log("checkIconInScreen no icon " + iconName);
      return false;
    }
    var iconImage = openImage(imagePath + iconName + ".png");
    var result = checkImage(
      screenshot,
      iconImage,
      icon[iconName][0],
      icon[iconName][1],
      icon[iconName][2],
      icon[iconName][3],
      threshold
    );
    releaseImage(iconImage);
    if (result && !allPass) {
      if (sharedScreenshot == undefined || sharedScreenshot == null) {
        releaseImage(screenshot);
      }
      return true;
    }
    if (!result && allPass) {
      if (sharedScreenshot == undefined || sharedScreenshot == null) {
        releaseImage(screenshot);
      }
      return false;
    }
  }

  if (sharedScreenshot == undefined || sharedScreenshot == null) {
    releaseImage(screenshot);
  }
  return allPass;
}

function checkIconInScreen(iconName, threshold, sharedScreenshot) {
  if (!isScriptRunning) {
    return false;
  }
  if (icon[iconName] == undefined) {
    console.log("checkIconInScreen no icon " + iconName);
    return false;
  }
  var screenshot = sharedScreenshot;
  if (screenshot == undefined || screenshot == null) {
    screenshot = getScreenshotResize();
  }
  if (screenshot == null) {
    return false;
  }
  if (threshold == undefined) {
    threshold = 0.85;
  }

  var iconImage = openImage(imagePath + iconName + ".png");
  var result = checkImage(
    screenshot,
    iconImage,
    icon[iconName][0],
    icon[iconName][1],
    icon[iconName][2],
    icon[iconName][3],
    threshold
  );
  if (sharedScreenshot == undefined || sharedScreenshot == null) {
    releaseImage(screenshot);
  }
  releaseImage(iconImage);
  return result;
}

function clickIcon(iconName, xOffset, yOffset) {
  if (xOffset == undefined) {
    xOffset = 0;
  }
  if (yOffset == undefined) {
    yOffset = 0;
  }
  tapScale(icon[iconName][0] + icon[iconName][2] / 2 + xOffset, icon[iconName][1] + icon[iconName][3] / 2 + yOffset, 100);
}

//select stage-----------------------------------------------

function isMainPage() {
  return checkIconInScreen("main");
}

function isStageRestart() {
  if (checkIconInScreen("stageRestart")) {
    return true;
  }
  if (server != "TW") {
    return false;
  }
  // TW 2026-10-26: the repeat dialog's 連續出擊 sits at y=810 (AP lines above it), not y=836
  var saved = icon["stageRestart"];
  icon["stageRestart"] = [saved[0], 810, saved[2], saved[3]];
  var seen = checkIconInScreen("stageRestart");
  icon["stageRestart"] = saved;
  return seen;
}

function isStageRestartEvent() {
  return checkIconInScreen("stageRestartEvent");
}

function isItemOrServantFullDialog() {
  return checkIconListInScreen(["selectStageServantFull", "selectStageItemFull"], false);
}

function isUseAppleDialog() {
  return checkIconInScreen("apple", 0.75);
}

function isWhiteConfirmDialog() {
  return checkIconListInScreen(["whiteConfirm", "whiteConfirm2"], false);
}

function iswhiteStartFailedDialog() {
  return checkIconInScreen("whiteStartFailed");
}

function isWhiteFinishDialog() {
  return checkIconInScreen("whiteFinish");
}

//select friend-----------------------------------------------

function isSelectFriendPage() {
  return checkIconInScreen("friendPage");
}

function isSelectFriendRefreshDialog() {
  return checkIconListInScreen(["friendRefresh", "friendRefresh2"], false);
}

function isSelectFriendEnd() {
  return checkIconListInScreen(["friendEnd", "friendEnd3"], false, 0.9);
}

function isSelectFriendEmpty() {
  return checkIconInScreen("friendEmpty");
}

//select team-----------------------------------------------

function isSelectTeamPage() {
  return checkIconInScreen("teamPage");
}

function isUseItemDialog() {
  if (server == "TW") {
    return checkIconInScreen("useItemDialog");
  }
  return false;
}

function isTeamMemberCheckDialog() {
  if (server == "TW") {
    return false;
  }
  return checkIconInScreen("teamMemberCheckDialog");
}

function isStartStageMemberFailed() {
  return checkIconInScreen("startStageMemberFailed");
}

//battle-----------------------------------------------

// バトルメニュー and Attack: not マスタースキル (battleMain2), greyed out in a story battle with one servant
// (JP 2026-10-29 盈月)
function isBattleMainPage() {
  return checkIconListInScreen(["battleMain1", "battleMain3"], true, 0.8);
}

function isSettingDialog() {
  return checkIconInScreen("settingDialog");
}

function isBattleServantDialog(screenshot) {
  return checkIconListInScreen(["battleServant1", "battleServant2"], false, 0.9, screenshot);
}

function isBattleSkillFailedDialog(screenshot) {
  return checkIconInScreen("skillFailed", 0.85, screenshot);
}

function isBattleUltFailedDialog() {
  return checkIconInScreen("ultFailed");
}

function isBattleSkillDetailDialog(screenshot) {
  return checkIconInScreen("battleSkill", 0.85, screenshot);
}

function isBattleKklDialog(screenshot) {
  var s = screenshot;
  if (s == undefined || s == null) {
    s = getScreenshotResize();
  }
  var result = checkIconListInScreen(["kkl", "kkl2"], true, 0.85, s);
  if (result && isBattleSkillRabbitDialog(s)) {
    //the rabbit dialog has the same layout, make sure it is not that one
    result = false;
  }
  if (result) {
    //kklSkill1~3: skill icon of each skill, only one of them shows in the dialog
    result = checkIconListInScreen(["kklSkill1", "kklSkill2", "kklSkill3"], false, 0.85, s);
  }
  if (screenshot == undefined || screenshot == null) {
    releaseImage(s);
  }
  return result;
}

function isBattleSkillSpaceDialog(screenshot) {
  return checkIconInScreen("spaceColor", 0.75, screenshot);
}

function isBattleSkillEmiyaDialog(screenshot) {
  //Warning: will conflic with Space, shoude run before isBattleSkillSpaceDialog
  return checkIconInScreen("emiyaColor", 0.75, screenshot);
}

function isBattleSkillDubaiDialog(screenshot) {
  return checkIconListInScreen(["dubaiSkill", "dubaiSkill2", "dubaiSkill3"], false, 0.85, screenshot);
}

function isBattleSkillRabbitDialog(screenshot) {
  //Warning: will conflic with kkl, shoude run before isBattleKklDialog
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["rabbitSkill", "rabbitSkill2", "rabbitSkill3"], true, 0.85, screenshot);
}

function isBattleSkillKishinamiDialog(screenshot) {
  return checkIconListInScreen(["kishinamiSkill", "kishinamiSkill2", "kishinamiSkill3"], true, 0.85, screenshot);
}

function isBattleSkillSoujyuroDialog(screenshot) {
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["soujyuroSkill", "soujyuroSkill2", "soujyuroSkill3"], true, 0.85, screenshot);
}

function isBattleSkillLilithDialog(screenshot) {
  //lilithSkill: heart icon, lilithSkill2: cancel, lilithSkill3: not grant, lilithSkill4: grant
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(
    ["lilithSkill", "lilithSkill2", "lilithSkill3", "lilithSkill4"],
    true,
    0.85,
    screenshot
  );
}

function isBattleSkillTargetDialog() {
  return checkIconInScreen("battleTarget");
}

//finish-----------------------------------------------

function isBattleStageFailedDialog() {
  return checkIconListInScreen(["stageFailed", "stageFailed2"], true);
}

function isFinishEventDialog() {
  if (server == "TW") {
    return false;
  }
  return checkIconListInScreen(["finishEvent1", "finishEvent2"], true);
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
  return false;
}

function isAddFriendPage() {
  return checkIconInScreen("addFriend");
}

// a Craft Essence's detail: a servant's bond CE, an event's drop (JP only: its picture; not fgoautoscript's table)
function isCeDetailPage() {
  if (server != "JP" || !isScriptRunning) {
    return false;
  }
  var screenshot = getScreenshotResize();
  if (screenshot == null) {
    return false;
  }
  var image = openImage(imagePath + "ceDetail.png");
  var found = checkImage(screenshot, image, 1725, 73, 165, 80);
  releaseImage(screenshot);
  releaseImage(image);
  return found;
}

function isItemPage() {
  return checkIconInScreen("itemPage");
}

// fgoai-script friend select (ES5), from fgoautoscript friend.js. Not ported: saving / deleting friend
// pictures. fgoai changes:
// - pictures are looked for in the kit's folder, friend_servant (friend_item), first, then in the player's
//   FGOV3/friend_servant (friend_item);
// - "fgoai_<collectionNo>_<i>" pictures (Atlas face bands, tools/friend_icons.py) are searched in a window
//   around the row (settings.friendSearch.window): they may sit a few px off;
// - after settings.friendSearch.maxReloads list refreshes without a match: fgoaiOut = {friend: "not_found"}
//   and the script stops (fgoautoscript refreshes forever).

var friendX = 76;
var classPositionX = [135, 237, 337, 438, 543, 645, 745, 847, 948, 1048];
var lineOffsetX = [600, 1200];
var pixelColor = [
  [206, 192, 128],
  [243, 212, 164],
  [189, 189, 172],
  [220, 220, 220],
];

var friendServantYOffset = 49;
var friendServantSize = [232, 144];

var friendItemYOffset = 197;
var friendItemSize = [232, 45];

var friendIsFriendOffsetX = 1646;

//default grand icon at 126,536 140x20
var friendGrandIcon = [50, 241, 140, 20]; // offsetx, offsety, width, height
var friendGrandItemXOffset = 255;
var friendGrandItemYOffset = [51, 190];
var friendGrandKitsunaItemOffset = [275, 136];

var imageStarOffset = [211, 50];
var friendStarSize = 8;

var reloadPosition = 1400;

var friendThreshole = 0.9;
var fgoaiFriendReloads = 0;
var FGOAI_FRIEND_PREFIX = "fgoai_";

// fgoai-script's folder first, then the player's (fgoautoscript's) folder; null when neither has it
function openFriendPicture(folder, name) {
  var paths = [itemPath + folder + "/" + name + ".png", getStoragePath() + "/FGOV3/" + folder + "/" + name + ".png"];
  for (var i = 0; i < paths.length; i++) {
    var img = openImage(paths[i]);
    if (img && typeof img !== "string") {
      return img;
    }
  }
  console.log("fgoai-script: 沒有好友圖片 " + folder + "/" + name);
  return null;
}

//filter: 職階篩選 (位元遮罩，0=全部，1=劍，2=弓，4=槍，8=騎，16=術，32=殺，64=狂，128=特，256=混)
//servant: 指定從者名稱 (字串，空字串表示無指定)
//item: 指定禮裝名稱 (字串，空字串表示無指定)
//star: 禮裝滿突 (0=不限制，1=滿突)
//checkIsFriend: 限定好友 (0=不限制，1=僅限好友)
//scrollTimes: 下拉次數 (-1=到最後，0=不下拉，1-3=指定次數，-2=直到出現非好友，-3=直到出現非冠位從者)
//grandServantOnly: 僅限冠位從者 (0=不限定，1=限定)
//grandKitsunaItem: 冠位從者絆禮裝 (-1=不限定禮裝，0=絆禮裝不限效果，1=絆禮裝通常效果，2=絆禮裝限定效果(50np))
//grandRewardItem: 冠位從者報酬禮裝名稱 (字串，空字串表示無指定)
function selectFriend(filter, servant, item, star, checkIsFriend, scrollTimes, grandServantOnly, grandKitsunaItem, grandRewardItem) {
  var scrollUntilNoFriend = false;
  var scrollUntilNoGrand = false;
  var grandServantImage = [];
  grandServantImage[0] = openImage(imagePath + "grandServant.png");
  grandServantImage[1] = openImage(imagePath + "grandServant2.png");
  fgoaiFriendReloads = 0;

  if (!isScriptRunning) {
    return;
  }

  if (selectFriendLoose) {
    friendThreshole = 0.9;
  } else {
    friendThreshole = 0.97;
  }
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，選擇好友省略");
    sleep(500);
    return;
  }
  if (isSelectTeamPage()) {
    console.log("已進入隊伍選單，選擇好友省略");
    sleep(500);
    return;
  }
  if (checkIsFriend == undefined) {
    checkIsFriend = true;
  }
  if (grandServantOnly == undefined) {
    grandServantOnly = false;
  }
  if (scrollTimes == undefined) {
    scrollTimes = 3;
  } else if (scrollTimes < 0) {
    if (scrollTimes == -2) {
      scrollUntilNoFriend = true;
    } else if (scrollTimes == -3) {
      scrollUntilNoGrand = true;
    }
    scrollTimes = 15;
  }

  while (isScriptRunning) {
    if (isSelectFriendEmpty()) {
      break;
    }
    var checkLoadingScreenshot = getScreenshotResize();
    var loadingLines = getFriendLineByIcon(checkLoadingScreenshot);
    releaseImage(checkLoadingScreenshot);
    if (loadingLines.length > 0) {
      break;
    }
    console.log("等待進入選擇好友頁面");
    sleep(1000);
  }

  console.log("-選擇好友-");
  if (!isSelectFriendPage()) {
    console.log("不在選擇好友頁面-選擇好友失敗");
    isScriptRunning = false;
    return;
  }
  var servantImage = [];
  var servantWindow = []; // fgoai pictures: searched in a window around the row
  if (servant.length > 0) {
    additionalFriendServant(servant);
  }
  for (var i = 0; i < selectFriendList.length; i++) {
    var picture = openFriendPicture("friend_servant", selectFriendList[i]);
    servantImage[i] = picture == null ? undefined : picture;
    servantWindow[i] = selectFriendList[i].indexOf(FGOAI_FRIEND_PREFIX) === 0;
  }

  var itemImage;
  if (item.length > 0) {
    var itemPicture = openFriendPicture("friend_item", item);
    itemImage = itemPicture == null ? undefined : itemPicture;
  }

  var grandRewardItemImage;
  if (grandRewardItem.length > 0) {
    var rewardPicture = openFriendPicture("friend_item", grandRewardItem);
    grandRewardItemImage = rewardPicture == null ? undefined : rewardPicture;
  }

  while (isScriptRunning) {
    var t = 1;
    //loop for class filter
    for (var i = 0; i < classPositionX.length; i++) {
      if (!isScriptRunning) {
        return;
      }
      if (filter == 0) {
        i = 9;
      } else if ((filter & t) == 0) {
        t *= 2;
        continue;
      } else {
        t *= 2;
        tapScale(classPositionX[i], 187);
        sleep(1000);
      }
      if (isSelectFriendEmpty()) {
        continue;
      }
      var scrollCnt = 0;
      while (isScriptRunning) {
        var found = false;
        var screenshot = getScreenshotResize();
        var friendLinePosition;
        if (friendAlgorithm == 1) {
          friendLinePosition = getFriendLineByIcon(screenshot);
        } else {
          friendLinePosition = getFriendLineByPixel(screenshot);
        }
        var haveNotFriend = false;
        var haveNotGrand = false;

        if (friendLinePosition.length == 0) {
          console.log("辨識好友座標失敗，使用固定座標");
          friendLinePosition = [295, 595];
        }

        //loop for line
        for (var j = 0; j < friendLinePosition.length; j++) {
          var lineY = friendLinePosition[j];
          var isSameServant = false;
          var isSameItem = true;
          var isFriend = true;
          var isSameGrandKitsunaItem = true;
          var isSameGrandRewardItem = true;

          var isGrandServant = checkIsGrandServant(screenshot, grandServantImage, lineY);
          if (isGrandServant) {
            //grandKitsunaItem == -1時不檢查絆禮裝
            if (grandKitsunaItem >= 0 && !checkGrandKitsunaItem(screenshot, grandKitsunaItem, lineY)) {
              isSameGrandKitsunaItem = false;
            }
            if (grandRewardItemImage != undefined) {
              isSameGrandRewardItem = checkFriendItem(screenshot, grandRewardItemImage, lineY, false, 1);
            }
          } else {
            haveNotGrand = true;
            if (grandServantOnly) {
              continue;
            }
          }
          if (!isSameGrandKitsunaItem) {
            continue;
          }
          if (!isSameGrandRewardItem) {
            continue;
          }

          if (servantImage.length <= 0) {
            isSameServant = true;
          } else {
            for (var k = 0; k < servantImage.length; k++) {
              if (servantImage[k] != undefined) {
                if (checkFriendServant(screenshot, servantImage[k], lineY, servantWindow[k])) {
                  isSameServant = true;
                  break;
                }
              }
            }
          }
          if (!isSameServant) {
            continue;
          }

          if (itemImage != undefined) {
            if (isGrandServant) {
              isSameItem = checkFriendItem(screenshot, itemImage, lineY, star, 0);
            } else {
              isSameItem = checkFriendItem(screenshot, itemImage, lineY, star, -1);
            }
            if (!isSameItem) {
              continue;
            }
          }

          if (checkIsFriend) {
            isFriend = checkFriendIsFriend(screenshot, lineY);
            if (!isFriend) {
              haveNotFriend = true;
              break;
            }
          }
          console.log("好友" + (j + 1) + "符合條件");
          tapScale(675, lineY + 105);
          found = true;
          break;
        }
        releaseImage(screenshot);
        // end loop line

        if (found) {
          releaseImage(grandServantImage[0]);
          releaseImage(grandServantImage[1]);
          for (var k = 0; k < servantImage.length; k++) {
            if (servantImage[k] != undefined) {
              releaseImage(servantImage[k]);
            }
          }
          servantImage = [];

          if (itemImage != undefined) {
            releaseImage(itemImage);
          }
          waitLoading();
          while (isScriptRunning) {
            if (isSelectTeamPage()) {
              sleep(500);
              return;
            } else if (isBattleMainPage()) {
              sleep(500);
              return;
            } else {
              tapScale(460, 5);
              sleep(1000);
            }
          }
        }
        if (isSelectFriendEnd()) {
          console.log("已到最底，刷新好友清單");
          break;
        }
        if (scrollCnt == scrollTimes) {
          console.log("已達到下拉次數，刷新好友清單");
          break;
        }
        if (scrollUntilNoFriend && haveNotFriend) {
          console.log("發現非好友，刷新好友清單");
          break;
        }
        if (scrollUntilNoGrand && haveNotGrand) {
          console.log("發現非冠位從者，刷新好友清單");
          break;
        }
        scrollCnt++;
        scrollFriendList();
        sleep(500);
      }
    }
    if (fgoaiFriendReloads >= fgoaiSettings.friendSearch.maxReloads) {
      console.log("fgoai-script: 重整 " + fgoaiFriendReloads + " 次都沒找到指定的好友");
      fgoaiOut = { friend: "not_found" };
      isScriptRunning = false;
      return;
    }
    fgoaiFriendReloads++;
    reloadFriend();
  }
}

function getFriendLineByPixel(screenshot) {
  var lineY = [];
  var lineCnt = 0;
  for (var y = 255; y < 795; y++) {
    var isLine = false;
    for (var i = 0; i < pixelColor.length; i += 2) {
      var x = i % lineOffsetX.length;
      var screenshotColor1 = getImageColor(screenshot, lineOffsetX[x], y);
      var screenshotColor2 = getImageColor(screenshot, lineOffsetX[x + 1], y);
      var c1 = isSameColor(
        screenshotColor1.r,
        screenshotColor1.g,
        screenshotColor1.b,
        pixelColor[i][0],
        pixelColor[i][1],
        pixelColor[i][2],
        30
      );
      var c2 = isSameColor(
        screenshotColor2.r,
        screenshotColor2.g,
        screenshotColor2.b,
        pixelColor[i + 1][0],
        pixelColor[i + 1][1],
        pixelColor[i + 1][2],
        30
      );
      if (c1 && c2) {
        isLine = true;
        break;
      }
    }
    if (isLine) {
      if (lineCnt > 0) {
        if (y - lineY[lineCnt - 1] < 10) {
          //same line, use lowest
          lineCnt--;
        }
      }
      lineY[lineCnt] = y;
      lineCnt++;
    }
  }
  var tolerance = 1;
  // 條件1：忽略所有大於800的線
  var validLines = [];
  for (var i = 0; i < lineY.length; i++) {
    if (lineY[i] <= 800) {
      validLines[validLines.length] = lineY[i];
    }
  }
  if (validLines.length == 0) {
    return [];
  }
  validLines.sort(function (a, b) {
    return a - b;
  });
  var correctLines = [];
  var uncertainLines = [];
  for (var i = 0; i < validLines.length; i++) {
    var currentLine = validLines[i];
    var isCorrect = false;
    var isWrong = false;
    for (var j = 0; j < validLines.length; j++) {
      if (i == j) continue;
      var otherLine = validLines[j];
      var diff = Math.abs(currentLine - otherLine);
      // 條件2：當兩條線相差36px時，下面的線為正確的線，上面的線為錯誤的線
      if (diff >= 36 - tolerance && diff <= 36 + tolerance) {
        if (currentLine > otherLine) {
          isCorrect = true;
        } else {
          isWrong = true;
        }
      }
    }
    if (isCorrect && !isWrong) {
      correctLines[correctLines.length] = currentLine;
    } else if (!isWrong) {
      uncertainLines[uncertainLines.length] = currentLine;
    }
  }
  // 條件3：當兩條線相差300px時且其中一條是正確的線，另一條也為正確的線
  var additionalCorrectLines = [];
  for (var i = 0; i < correctLines.length; i++) {
    var correctLine = correctLines[i];
    for (var j = 0; j < validLines.length; j++) {
      var otherLine = validLines[j];
      var diff = Math.abs(correctLine - otherLine);
      if (diff >= 300 - tolerance && diff <= 300 + tolerance) {
        var alreadyCorrect = false;
        for (var k = 0; k < correctLines.length; k++) {
          if (correctLines[k] == otherLine) {
            alreadyCorrect = true;
            break;
          }
        }
        if (!alreadyCorrect) {
          additionalCorrectLines[additionalCorrectLines.length] = otherLine;
        }
      }
    }
  }
  for (var i = 0; i < additionalCorrectLines.length; i++) {
    correctLines[correctLines.length] = additionalCorrectLines[i];
  }
  var newUncertainLines = [];
  for (var i = 0; i < uncertainLines.length; i++) {
    var isUpgraded = false;
    for (var j = 0; j < additionalCorrectLines.length; j++) {
      if (uncertainLines[i] == additionalCorrectLines[j]) {
        isUpgraded = true;
        break;
      }
    }
    if (!isUpgraded) {
      newUncertainLines[newUncertainLines.length] = uncertainLines[i];
    }
  }
  uncertainLines = newUncertainLines;
  var filteredLineY = [];
  // 條件4：當有正確的線時，僅回傳所有正確的線；條件5：沒有時保留所有不確定的線
  if (correctLines.length > 0) {
    filteredLineY = correctLines;
  } else {
    filteredLineY = uncertainLines;
  }
  filteredLineY.sort(function (a, b) {
    return a - b;
  });
  return filteredLineY;
}

function checkFriendServant(screenshot, servantImage, lineY, windowSearch) {
  if (windowSearch) {
    var w = fgoaiSettings.friendSearch.window; // x, y, w, h from (friendX, lineY + friendServantYOffset)
    var area = cropImage(screenshot, friendX + w[0], lineY + friendServantYOffset + w[1], w[2], w[3]);
    var hit = findImage(area, servantImage);
    releaseImage(area);
    return !!hit && hit.score >= fgoaiSettings.friendSearch.score;
  }
  var ignoreIcon = [52, 0, 140, 100];
  var croppedServantImage = cropImage(servantImage, ignoreIcon[0], ignoreIcon[1], ignoreIcon[2], ignoreIcon[3]);
  var result = checkImage(
    screenshot,
    croppedServantImage,
    friendX + ignoreIcon[0],
    lineY + friendServantYOffset,
    ignoreIcon[2],
    ignoreIcon[3],
    friendThreshole
  );
  releaseImage(croppedServantImage);
  return result;
}

function checkFriendItem(screenshot, itemImage, lineY, needStar, grandServantItemIndex) {
  if (grandServantItemIndex == undefined) {
    grandServantItemIndex = -1;
  }
  var x = friendX;
  var y = lineY + friendItemYOffset;
  if (grandServantItemIndex != -1) {
    x = friendX + friendGrandItemXOffset;
    y = lineY + friendGrandItemYOffset[grandServantItemIndex];
  }
  var croppedItemImage = cropImage(itemImage, 0, 0, friendItemSize[0] - 40, friendItemSize[1]);
  var result = checkImage(screenshot, croppedItemImage, x, y, friendItemSize[0] - 40, friendItemSize[1], friendThreshole);
  releaseImage(croppedItemImage);
  if (!result) {
    return false;
  }
  if (needStar) {
    if (!checkItemStar(screenshot, x, y)) {
      return false;
    }
  }
  return true;
}

function checkItemStar(screenshot, imagePositionX, imagePositionY) {
  var isG = 0;
  var notG = 0;
  var starLeft = imagePositionX + imageStarOffset[0] - friendStarSize / 2;
  var starTop = imagePositionY + imageStarOffset[1] - friendStarSize / 2;
  for (var i = 0; i < friendStarSize; i++) {
    for (var j = 0; j < friendStarSize; j++) {
      var color = getImageColor(screenshot, starLeft + i, starTop + i);
      if (color.g > color.r && color.g > color.b) {
        isG++;
      } else {
        notG++;
      }
    }
  }
  return isG > notG * 3;
}

function checkFriendIsFriend(screenshot, lineY) {
  return checkPixel(friendX + friendIsFriendOffsetX, lineY + 198, 227, 255, 177, screenshot);
}

function reloadFriend() {
  while (isScriptRunning) {
    if (isSelectTeamPage()) {
      console.log("誤觸進入選擇隊伍，回到上一頁");
      tapScale(200, 70);
      sleep(2000);
    }
    tapScale(reloadPosition, 175);
    sleep(1000);
    if (isSelectFriendRefreshDialog()) {
      tapScale(1275, 850);
      sleep(5000);
      if (isSelectFriendRefreshDialog()) {
        //click cancel
        tapScale(937, 850);
        sleep(1000);
      } else {
        return;
      }
    }
  }
}

function scrollFriendList() {
  swipeScale(600, 750, 600, 150, 200);
}

function additionalFriendServant(friend) {
  selectFriendList[selectFriendList.length] = friend;
}

function checkIsGrandServant(screenshot, grandServantImage, lineY) {
  var result1 = checkImage(
    screenshot,
    grandServantImage[0],
    friendX + friendGrandIcon[0],
    lineY + friendGrandIcon[1],
    friendGrandIcon[2],
    friendGrandIcon[3],
    0.9
  );
  var result2 = checkImage(
    screenshot,
    grandServantImage[1],
    friendX + friendGrandIcon[0],
    lineY + friendGrandIcon[1],
    friendGrandIcon[2],
    friendGrandIcon[3],
    0.9
  );
  return result1 || result2;
}

function checkGrandKitsunaItem(screenshot, kitsuna, lineY) {
  var result = -1;
  var centerX = friendX + friendGrandKitsunaItemOffset[0];
  var centerY = lineY + friendGrandKitsunaItemOffset[1];
  var scanSize = 4;
  for (var x = centerX - scanSize; x < centerX + scanSize; x++) {
    for (var y = centerY - scanSize; y < centerY + scanSize; y++) {
      if (checkPixel(x, y, 101, 101, 101, screenshot)) {
        result = 0; //none
        break;
      } else if (checkPixel(x, y, 209, 249, 122, screenshot)) {
        result = 1; //normal effect
        break;
      } else if (checkPixel(x, y, 241, 115, 8, screenshot)) {
        result = 2; //np effect
        break;
      }
    }
  }
  // kitsuna == 0 (絆禮裝不限效果)：result 為 1 或 2 都算
  if (kitsuna == 0 && (result == 1 || result == 2)) {
    return true;
  }
  return kitsuna == result;
}

function getFriendLineByIcon(screenshot) {
  var lineY = [];
  var lineCnt = 0;
  var searchX = friendX + 1164;
  var friendLoginIcon = openImage(imagePath + "friendLogin.png");
  if (friendLoginIcon == null) {
    console.log("無法載入 friendLogin.png 圖片");
    return lineY;
  }
  var searchArea = cropImage(screenshot, searchX, 250, 160, 600);
  var results = findImages(searchArea, friendLoginIcon, 0.95, 3, true);
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (result.score >= 0.85) {
      var adjustedLineY = 250 + result.y - 15;
      if (lineCnt > 0) {
        if (Math.abs(adjustedLineY - lineY[lineCnt - 1]) < 10) {
          continue;
        }
      }
      lineY[lineCnt] = adjustedLineY;
      lineCnt++;
    }
  }
  releaseImage(searchArea);
  lineY.sort(function (a, b) {
    return a - b;
  });
  releaseImage(friendLoginIcon);
  return lineY;
}

// fgoai-script stage (ES5): select the quest, the party, start and finish, from fgoautoscript
// start_stage.js and in_stage.js finishQuest. fgoai additions: the run records (fgoaiRuns: one per
// startQuest, attackAIV2 adds the wave of every turn, finished only when the script still runs at
// finishQuest: fgoautoscript stops itself on the defeat dialog). Not ported: team auto build.

var fgoaiRuns = [];
var fgoaiCurrent = null;
var itemPositionY = [300, 525, 750];

//-----------------------------------------------------select stage

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
    console.log("選擇關卡失敗：請先移至選擇關卡或戰鬥畫面");
    isScriptRunning = false;
    return;
  } else {
    tapScale(1200, 240);
    sleep(500);
  }
  var status = -1;
  while (isScriptRunning) {
    if (iswhiteStartFailedDialog()) {
      status = 3;
    } else if (isItemOrServantFullDialog()) {
      status = 0;
    } else if (isUseAppleDialog()) {
      status = 1;
    } else if (isSelectFriendPage() || isSelectTeamPage()) {
      status = 2;
    } else if (isWhiteConfirmDialog()) {
      tapScale(1250, 850);
      sleep(1000);
    }
    if (status >= 0) {
      break;
    }
  }
  if (status == 3) {
    console.log("膠囊不足-選擇關卡失敗");
    isScriptRunning = false;
    return;
  } else if (status == 0) {
    console.log("倉庫已滿-選擇關卡失敗");
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
        break;
      case 1: //silver
        tapScale(900, 675);
        console.log("使用銀蘋果");
        break;
      case 5:
        tapScale(900, 840);
        console.log("使用青銅蘋果");
        break;
      case 0: //bronze
        swipeScale(600, 750, 600, 150, 300);
        sleep(2000);
        tapScale(900, 840);
        console.log("使用赤銅蘋果");
        break;
      case 3:
        tapScale(900, 225);
        console.log("使用聖晶石");
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
    if (isWhiteConfirmDialog()) {
      tapScale(1250, 850);
      sleep(1000);
    } else if (isSelectFriendPage()) {
      break;
    } else if (isSelectTeamPage()) {
      console.log("關卡跳過選擇好友介面");
      waitLoading();
      break;
    }
  }
}

// fgoai: the AP回復 dialog is open (the engine tapped the quest): one apple as selectStage taps it (user
// 2026-10-29: the apples are at fixed spots, only 赤銅 needs the scroll; a tap that changes nothing = none
// left). 聖晶石 (3) is never eaten. "eaten" / "none_left" / "no_dialog" / "refused".
var APPLE_SPOTS = { 2: [900, 450], 1: [900, 675], 5: [900, 840], 0: [900, 840] };
var APPLE_LIST = [445, 170, 1030, 690]; // the list the confirm covers

function eatApple(useApple) {
  var spot = APPLE_SPOTS[useApple];
  if (spot === undefined) {
    return "refused";
  }
  if (!isUseAppleDialog()) {
    return "no_dialog";
  }
  if (useApple === 0) {
    swipeScale(600, 750, 600, 150, 300);
    sleep(2000);
  }
  var before = appleListImage();
  tapScale(spot[0], spot[1]);
  sleep(1500);
  var after = appleListImage();
  var same = getIdentityScore(before, after) > 0.95;
  releaseImage(before);
  releaseImage(after);
  if (same) {
    return "none_left"; // (1275, 850) on the list is its 4th row: not tapped
  }
  tapScale(1275, 850);
  for (var i = 0; i < 20 && isScriptRunning; i++) {
    sleep(500);
    if (isSelectFriendPage() || isSelectTeamPage()) {
      break;
    }
    if (isWhiteConfirmDialog()) {
      tapScale(1250, 850);
      sleep(1000);
    }
  }
  return "eaten";
}

function appleListImage() {
  var screenshot = getScreenshotResize();
  var crop = cropImage(screenshot, APPLE_LIST[0], APPLE_LIST[1], APPLE_LIST[2], APPLE_LIST[3]);
  releaseImage(screenshot);
  return crop;
}

function selectStageAutoRestore() {
  console.log("等待五分鐘回復體力");
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
  }
}

//-----------------------------------------------------team menu

function selectTeam(team, useTeamAutoBuild) {
  if (!isScriptRunning) {
    return;
  }
  sleep(2000);
  if (isTeamMemberCheckDialog()) {
    clickIcon("teamMemberCheckDialog");
  }
  if (useTeamAutoBuild) {
    console.log("fgoai-script: 不支援自動編成，照目前的隊伍");
  }
  var teamMaxCnt = 15;
  var teamOffset = 2;
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
  var x = 787 + 37 * (team - teamOffset);
  var x2 = 787 + 37 * (((team + 1) % teamMaxCnt) - teamOffset);
  tapScale(x2, 75);
  sleep(1000);
  tapScale(x, 75);
  sleep(2000);
}

function startQuest(useItem, checkStageLoadFinish) {
  fgoaiCurrent = { turns: [], finished: false };
  fgoaiRuns.push(fgoaiCurrent);
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
    if (isTeamMemberCheckDialog()) {
      clickIcon("teamMemberCheckDialog");
      sleep(500);
    } else {
      console.log("不在選擇隊伍畫面");
      return;
    }
  }
  while (isSelectTeamPage()) {
    if (isTeamMemberCheckDialog()) {
      clickIcon("teamMemberCheckDialog");
      sleep(500);
    }
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

    if (isStartStageMemberFailed()) {
      console.log("隊伍成員無法出擊，結束腳本");
      isScriptRunning = false;
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
      clickIcon("battleMain1", 30);
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
    return;
  }
  if (isReplay) {
    sleep(3000);
    if (!isUseAppleDialog() && !isSelectFriendPage()) {
      tapScale(1240, 832);
    }
  } else {
    tapScale(1240, 832);
  }
  sleep(3000);
}

//-----------------------------------------------------finish

function finishQuest() {
  if (fgoaiCurrent && isScriptRunning) {
    fgoaiCurrent.finished = true; // a lost battle: the script stopped itself on the defeat dialog
  }
  while (isScriptRunning) {
    if (isMainPage()) {
      if (isFinishEventDialog()) {
        clickIcon("finishEvent1");
      }
      sleep(3000);
      return;
    } else if (isStageRestart() || isStageRestartEvent()) {
      sleep(1000);
      return;
    } else if (isCeDetailPage()) {
      tapScale(57, 62); // 閉じる (user 2026-11-05: 從者滿絆會送禮裝，活動關卡有時候會掉活動禮裝，要點掉)
      sleep(1500);
      continue;
    }
    tapScale(460, 5);
    sleep(1500);
    if (isFinishDropDialoge() || isFinishNext()) {
      tapScale(1650, 990);
      sleep(1500);
    } else if (isFinishEventDialog()) {
      clickIcon("finishEvent1");
      sleep(1500);
    } else if (isAddFriendPage()) {
      tapScale(487, 900);
      sleep(1500);
    } else if (isItemPage()) {
      sleep(1000);
      if (isMainPage()) {
        return;
      }
      sleep(2000);
      if (isItemPage()) {
        sleep(1000);
        if (isMainPage()) {
          sleep(3000);
          return;
        }
        console.log("掉落禮裝");
        clickIcon("itemPage");
        sleep(1500);
      }
    } else if (isWhiteFinishDialog()) {
      isScriptRunning = false;
      console.log("膠囊不足，結束周回");
      return;
    }
  }
}

// fgoai-script battle (ES5): skills, mystic code, targets, cards and waves, from fgoautoscript in_stage.js
// (finishQuest is in stage.js). fgoai change: selectEnemy taps the spot's HP bar; on an empty spot TW
// opens 狀態變化詳細 and the next Attack tap would only close it, so the dialog's close button
// (settings.enemyDetail: registry enemy_detail_close) is looked for right after and tapped;
// fgoaiTargetEmpty tells the commander.

var skillPositionDefaultX = 66;
var skillPositionDefaultY = 824;
var skillPositionX = [66, 198, 330, 542, 674, 806, 1018, 1150, 1282];
var skillPositionY = 824;
var skillSmallOffset = 132;
var skillLargeOffset = 476;

var skillTargetX = [487, 937, 1387];
var skillTargetY = 637;
var clothSkillOffsetX = 130;
var clothSkillY = 475;
var enemyPositionXDefault = [820, 520, 220, 670, 370, 70];
var enemyPositionX = [820, 520, 220, 670, 370, 70];
var enemyPositionY = [64, 200];
var currentStagePositionDefaultX = 1317;
var currentStagePosition = [1317, 18, 37, 37];

var cardPositionX = [187, 600, 937, 1350, 1762];
var cardPositionY = 775;
var ultPositionX = [600, 937, 1350];
var ultPositionY = 187;

var emiyaUltPositionX = [1125, 675];
var spaceUltPositionX = [1350, 900, 450];
var spaceUltPositionY = 675;
var colorName = ["紅", "藍", "綠"];
var dubaiSkillName = ["攻擊模式", "防禦模式"];
var dubaiSkillPositionX = [720, 1200];
var dubaiSkillPositionY = 675;
var rabbitSkillName = ["全體", "單體"];
var kishinamiSkillName = ["天", "地", "人"];
var soujyuroSkillName = ["綠", "藍", "紅"];
var lilithSkillName = ["付與", "不付與"];

var fgoaiTargetEmpty = false;

//----------------------------------------------Battle main page
function setInStagePositions() {
  if (server == "TW") {
    skillPositionDefaultX = 50;
    skillPositionDefaultY = 817;
    currentStagePositionDefaultX = 1326;
    currentStagePosition = [currentStagePositionDefaultX, 23, 19, 29];
    skillPositionX = [50, 182, 315, 526, 658, 791, 1002, 1135, 1267];
  } else {
    skillPositionDefaultX = 66;
    skillPositionDefaultY = 824;
    currentStagePositionDefaultX = 1317;
    currentStagePosition = [currentStagePositionDefaultX, 18, 37, 37];
    skillPositionX = [66, 198, 330, 542, 674, 806, 1018, 1150, 1282];
  }
  skillPositionY = skillPositionDefaultY;
  enemyPositionX = enemyPositionXDefault; // (fgoautoscript: the same array from here on)
}

function useSkill(player, skill, target) {
  if (!isScriptRunning) {
    return;
  }
  if (!waitUntilPlayerCanMove()) {
    return;
  }
  console.log("使用技能 從者 " + (player + 1) + ", 技能 " + (skill + 1) + ", 目標 " + (target + 1));
  skillUsedInLoop[player * 3 + skill] = true;
  tapScale(skillPositionX[player * 3 + skill], skillPositionY);
  sleep(500);
  tapScale(1650, 450);
  sleep(500);
  if (!isScriptRunning) {
    return;
  }

  var screenshot = getScreenshotResize();
  if (isBattleServantDialog(screenshot)) {
    console.log("使用技能-無此技能");
    tapScale(1575, 127);
  } else if (isBattleSkillFailedDialog(screenshot)) {
    console.log("使用技能-條件未達成，無法使用");
    tapScale(960, 832);
  } else if (isBattleSkillDetailDialog(screenshot)) {
    //need confirm or in cd
    console.log("使用技能-確認畫面");
    tapScale(1275, 637);
    sleep(1000);
    if (isBattleSkillDetailDialog()) {
      console.log("使用技能-技能無法使用");
      tapScale(600, 637);
      return;
    }
  }
  releaseImage(screenshot);
  if (!isScriptRunning) {
    return;
  }
  screenshot = getScreenshotResize();
  if (isBattleSkillLilithDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillLilithDialog()) {
      if (lilithSkill == undefined || lilithSkill < 0 || lilithSkill > 1) {
        console.log("未指定模式，設為付與");
        lilithSkill = 0;
      }
      console.log("使用技能-泳裝莉莉絲即死付與 " + lilithSkillName[lilithSkill]);
      switch (lilithSkill) {
        case 0:
        default:
          clickIcon("lilithSkill4");
          break;
        case 1:
          clickIcon("lilithSkill3");
          break;
      }
    }
  } else if (isBattleSkillRabbitDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillRabbitDialog()) {
      if (rabbitSkill == undefined || rabbitSkill < 0 || rabbitSkill > 1) {
        console.log("未指定模式，設為全體");
        rabbitSkill = 0;
      }
      console.log("使用技能-玉兔技能模式 " + rabbitSkillName[rabbitSkill]);
      switch (rabbitSkill) {
        case 0:
        default:
          clickIcon("rabbitSkill");
          break;
        case 1:
          clickIcon("rabbitSkill2");
          break;
      }
    }
  } else if (isBattleSkillKishinamiDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillKishinamiDialog()) {
      if (kishinamiSkill == undefined || kishinamiSkill < 0 || kishinamiSkill > 2) {
        console.log("未指定模式，設為天");
        kishinamiSkill = 0;
      }
      console.log("使用技能-岸波白野特攻模式 " + kishinamiSkillName[kishinamiSkill]);
      switch (kishinamiSkill) {
        case 0:
        default:
          clickIcon("kishinamiSkill");
          break;
        case 1:
          clickIcon("kishinamiSkill2");
          break;
        case 2:
          clickIcon("kishinamiSkill3");
          break;
      }
    }
  } else if (isBattleSkillSoujyuroDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillSoujyuroDialog()) {
      if (soujyuroSkill == undefined || soujyuroSkill < 0 || soujyuroSkill > 2) {
        console.log("未指定模式，設為綠");
        soujyuroSkill = 0;
      }
      console.log("使用技能-草十郎卡片顏色 " + soujyuroSkillName[soujyuroSkill]);
      switch (soujyuroSkill) {
        case 0:
        default:
          clickIcon("soujyuroSkill");
          break;
        case 1:
          clickIcon("soujyuroSkill2");
          break;
        case 2:
          clickIcon("soujyuroSkill3");
          break;
      }
    }
  } else if (isBattleKklDialog(screenshot)) {
    sleep(2000);
    if (isBattleKklDialog()) {
      var kkl = getKKLArray()[skill];
      if (kkl != 0) {
        console.log("庫庫魯坎技能使用星星");
        tapScale(1420, 640);
        sleep(1000);
        if (isBattleKklDialog()) {
          console.log("星星數量不足");
          clickIcon("kkl");
        }
      } else {
        console.log("庫庫魯坎技能不使用星星");
        clickIcon("kkl");
      }
      sleep(2000);
    }
  } else if (isBattleSkillEmiyaDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillEmiyaDialog()) {
      if (spaceUltColor == undefined || spaceUltColor < 0 || spaceUltColor >= 2) {
        console.log("未指定顏色，設為藍色");
        spaceUltColor = 1;
      }
      console.log("使用技能-紅A寶具顏色 " + colorName[spaceUltColor]);
      tapScale(emiyaUltPositionX[spaceUltColor], spaceUltPositionY);
    }
  } else if (isBattleSkillSpaceDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillSpaceDialog()) {
      if (spaceUltColor == undefined || spaceUltColor < 0 || spaceUltColor > 2) {
        console.log("未指定顏色，設為綠色");
        spaceUltColor = 2;
      }
      console.log("使用技能-宇宙伊斯塔寶具顏色 " + colorName[spaceUltColor]);
      tapScale(spaceUltPositionX[spaceUltColor], spaceUltPositionY);
    }
  } else if (isBattleSkillDubaiDialog(screenshot)) {
    sleep(2000);
    if (isBattleSkillDubaiDialog()) {
      if (dubaiSkill == undefined || dubaiSkill < 0 || dubaiSkill > 2) {
        console.log("未指定模式，設為攻擊模式");
        dubaiSkill = 0;
      }
      console.log("使用技能-杜拜BB技能模式 " + dubaiSkillName[dubaiSkill]);
      tapScale(dubaiSkillPositionX[dubaiSkill], dubaiSkillPositionY);
    }
  }
  releaseImage(screenshot);

  if (isBattleSkillTargetDialog()) {
    console.log("使用技能-選擇目標");
    if (target == undefined || target < 0) {
      console.log("未設定目標，強迫選擇從者1");
      target = 0;
    }
    selectSkillTarget(target);
  }
}

function selectSkillTarget(player) {
  if (!isScriptRunning) {
    return;
  }
  for (var checkTarget = 0; checkTarget < 3; checkTarget++) {
    sleep(1000);
    if (!isBattleSkillTargetDialog()) {
      return;
    }
    switch (checkTarget) {
      case 0:
        console.log("選擇技能目標 " + (player + 1));
        tapScale(skillTargetX[player], skillTargetY);
        sleep(500);
        tapScale(1650, 450);
        break;
      case 1:
        console.log("從者不足三人，再次選擇");
        var offset = 150;
        if (player == 2) {
          offset = -150;
        }
        tapScale(skillTargetX[player] + offset, skillTargetY);
        break;
      case 2:
        console.log("從者僅剩一人，再次選擇");
        tapScale(skillTargetX[1], skillTargetY);
        break;
    }
  }
}

function useClothesSkill(skill, target1, target2) {
  if (!isScriptRunning) {
    return;
  }
  if (!waitUntilPlayerCanMove()) {
    return;
  }
  console.log("使用衣服技能 " + (skill + 1));
  clickIcon("battleMain2");
  sleep(1000);
  tapScale(icon["battleMain2"][0] - clothSkillOffsetX * (3 - skill), clothSkillY);
  sleep(500);
  if (!(target2 == 5 && skill == 2)) {
    //ignore change last servant
    tapScale(1650, 450);
  }
  sleep(500);
  if (isBattleSkillDetailDialog()) {
    console.log("使用衣服技能-確認畫面");
    tapScale(1275, 637);
    sleep(500);
    if (isBattleSkillDetailDialog()) {
      console.log("使用衣服技能-技能無法使用");
      tapScale(600, 637);
      sleep(1000);
      tapScale(1800, 475);
      return;
    }
  }
  if (isBattleSkillTargetDialog()) {
    if (target1 == undefined || target1 < 0) {
      target1 = 0;
    }
    console.log("使用衣服技能-選擇目標");
    selectSkillTarget(target1);
  } else if (target1 != undefined && target2 != undefined && target2 >= 0 && skill == 2) {
    console.log("使用衣服技能-選擇換人目標");
    changePlayer(target1, target2);
  }
  sleep(1000);
  if (isBattleServantDialog()) {
    //skill null
    tapScale(1575, 127);
    return;
  }
}

function switchServant(f, b) {
  useClothesSkill(2, f, b);
}

function selectEnemy(enemy) {
  if (!isScriptRunning) {
    return;
  }
  if (!waitUntilPlayerCanMove()) {
    return;
  }
  console.log("選擇敵人 " + (enemy + 1));
  tapScale(enemyPositionX[enemy], enemyPositionY[Math.floor(enemy / 3)]);
  closeEnemyDetail();
}

// fgoai: tap the target's HP bar found on the PC side (tools/enemy_targets.py); only for a panel that none
// of selectEnemy's fixed spots falls inside (the PC side uses selectEnemy(i) whenever one does)
function selectEnemyAt(x, y) {
  if (!isScriptRunning) {
    return;
  }
  if (!waitUntilPlayerCanMove()) {
    return;
  }
  console.log("選擇敵人 " + x + "," + y);
  tapScale(x, y);
  closeEnemyDetail();
}

// Tapping the enemy that is already the target (or an empty spot) opens its detail: find its close button and
// tap it. The PC side selects only enemies it found, so this is no empty spot (fgoaiTargetEmpty stays).
function closeEnemyDetail() {
  var detail = fgoaiSettings.enemyDetail;
  if (!detail || !isScriptRunning) {
    return;
  }
  sleep(800);
  var close = openImage(detail.path);
  if (!close || typeof close === "string") {
    console.log("fgoai-script: 沒有 enemy_detail_close 圖片");
    return;
  }
  var t = getImageSize(close);
  var r = detail.region; // x0, y0, x1, y1 (the registry is on 1920x1080 too)
  var shot = getScreenshot();
  var area = cropImage(shot, r[0], r[1], r[2] - r[0], r[3] - r[1]);
  var hit = findImage(area, close);
  releaseImage(area);
  releaseImage(shot);
  releaseImage(close);
  if (hit && hit.score >= detail.score) {
    console.log("fgoai-script: 跳出敵人詳細，關掉");
    var closeX = Math.floor(r[0] + hit.x + t.width / 2);
    var closeY = Math.floor(r[1] + hit.y + t.height / 2);
    fgoaiStep("tap", closeX, closeY, null, null, "");
    tap(closeX, closeY, 100);
    sleep(800);
  }
}

function changePlayer(target1, target2) {
  if (!isScriptRunning) {
    return;
  }
  console.log("交換從者 " + (target1 + 1) + "," + (target2 + 1));
  skillUsedInLoop[target1 * 3] = false;
  skillUsedInLoop[target1 * 3 + 1] = false;
  skillUsedInLoop[target1 * 3 + 2] = false;
  tapScale(207 + 300 * target1, 552);
  sleep(300);
  tapScale(207 + 300 * target2, 552);
  sleep(300);
  tapScale(975, 945);
}

//-------------------------------------------------------Battle card page
function startAttack() {
  if (!isScriptRunning) {
    return;
  }
  if (!waitUntilPlayerCanMove()) {
    return;
  }
  clickIcon("battleMain3");
  sleep(5000);
}

function selectCard(card) {
  if (!isScriptRunning) {
    return;
  }
  tapScale(cardPositionX[card], cardPositionY);
  fgoaiCardsTapped = true;
  sleep(500);
}

function useUlt(player) {
  if (!isScriptRunning) {
    return;
  }
  console.log("選擇寶具 從者" + (player + 1));
  tapScale(ultPositionX[player], ultPositionY);
  sleep(1000);
  if (isBattleUltFailedDialog()) {
    tapScale(960, 660);
    sleep(500);
  }
}

//---------------------------------------------Battle next
// fgoai: after the cards the screen is tapped until the next turn or the quest's end, to hurry the attack
// animations along (user 2026-10-29); the spot is finishQuest's, out of the way of every battle button
var fgoaiCardsTapped = false;
var fgoaiSpeedSpot = [460, 5];

function fgoaiSpeedTap() {
  if (fgoaiCardsTapped && isScriptRunning) {
    tapScale(fgoaiSpeedSpot[0], fgoaiSpeedSpot[1]);
    sleep(250);
    tapScale(fgoaiSpeedSpot[0], fgoaiSpeedSpot[1]);
  }
}

function waitUntilPlayerCanMove() {
  //double check
  while (isScriptRunning) {
    if (isBattleMainPage()) {
      sleep(500);
      if (isBattleMainPage()) {
        fgoaiCardsTapped = false;
        return true;
      }
    }
    fgoaiSpeedTap();
    sleep(500);
  }
  return false;
}

function waitUntilPlayerCanMoveOrFinish() {
  //double check
  while (isScriptRunning) {
    if (isBattleMainPage()) {
      sleep(1000);
      if (isBattleMainPage()) {
        fgoaiCardsTapped = false;
        return true;
      }
    }
    if (isMainPage() || isCeDetailPage() || isFinishBondPage()) {  // out of the battle: the MENU button (no bond page), a bond CE's detail
      fgoaiCardsTapped = false;
      return false;
    }
    fgoaiSpeedTap();
    if (isBattleStageFailedDialog()) {
      sleep(3000);
      if (isBattleStageFailedDialog()) {
        console.log("戰鬥失敗，停止腳本");
        isScriptRunning = false;
        return false;
      }
    }
    sleep(1000);
  }
  return false;
}

function getCurrentStage() {
  var screenshot = getScreenshotResize();
  var crop = cropImage(
    screenshot,
    currentStagePosition[0],
    currentStagePosition[1],
    currentStagePosition[2],
    currentStagePosition[3]
  );
  var score = [];
  for (var i = 0; i < 3; i++) {
    var stageImage = openImage(imagePath + "stage" + i + ".png");
    score[i] = getIdentityScore(crop, stageImage);
    releaseImage(stageImage);
  }
  releaseImage(crop);
  releaseImage(screenshot);
  var result;
  if (score[0] >= score[1] && score[0] >= score[2]) {
    result = 0;
  } else if (score[1] >= score[0] && score[1] > score[2]) {
    result = 1;
  } else {
    result = 2;
  }
  return result;
}

function setSpaceUltColor(color) {
  spaceUltColor = color;
  console.log("設定改變寶具顏色 - " + colorName[spaceUltColor]);
}

// fgoai-script auto attack (ES5): autoAttackV2 / attackAIV2 with servant, skill and card detection, from
// fgoautoscript auto_attack_ai.js. Not ported: autoAttack / attackAI / selectCards (fgoai never uses
// them). fgoai addition: every attackAIV2 turn records its wave in the current run (stage.js fgoaiRuns).

//servant
var servantExistImage;
var initServant = [];
var servantInited;
var servantAliveX = [150, 622, 1102];
var servantAliveY = 600;
var servantAliveW = 300;
var servantAliveH = 150;

var servantExistX = [166, 642, 1122];
var servantExistY = 1010;
var servantExistWidth = 37;
var servantExistHeight = 18;

//skill
var skillUsedImage;
var skillUsedPositionOffset = [-9, 77];
var skillUsedSize = 24;

//card
var cardImage = [];

var servantAliveMessage;
var cardList = [];
var cardStatus = []; // -1:disable 0:null 1:resist 2:weak
var cardWidth = 225;
var cardHeight = 75;

var cardListX = [94, 478, 861, 1248, 1638];
var cardListY = 608;
var cardMoveRange = 102;
var cardColorOffset = [0, 124];

var cardListOffsetWeakX = 172;
var cardListOffsetWeakY = -120;
var weakW = 75;
var weakH = 22;

var offsetDisableX = [82, 195];
var offsetDisableY = -67;
var disableW = 45;
var disableH = 45;

var clothSkillUsed = [];

function setAutoAttackPositions() {
  if (server == "TW") {
    skillUsedPositionOffset = [6, 85];
    offsetDisableX = [89, 196];
    return;
  }
}

// until: the wave (0-based) that ends it (0: one turn); cardOrder e.g. "NNNBAQ"; die: 0 stop, 1 the
// backup keeps using skills, 2 skip, 3 everyone is on the field; then per servant the NP's first wave and
// 3 x (skill's first wave, target); then 3 x (mystic code skill's first wave, target). -1: never.
function autoAttackV2(
  until,
  cardOrder,
  die,
  p0ult,
  p0s0,
  p0t0,
  p0s1,
  p0t1,
  p0s2,
  p0t2,
  p1ult,
  p1s0,
  p1t0,
  p1s1,
  p1t1,
  p1s2,
  p1t2,
  p2ult,
  p2s0,
  p2t0,
  p2s1,
  p2t1,
  p2s2,
  p2t2,
  ctime0,
  ctarget0,
  ctime1,
  ctarget1,
  ctime2,
  ctarget2
) {
  var ult = [p0ult, p1ult, p2ult];
  var skill = [
    [
      [p0s0, p0s1, p0s2],
      [p0t0, p0t1, p0t2],
    ],
    [
      [p1s0, p1s1, p1s2],
      [p1t0, p1t1, p1t2],
    ],
    [
      [p2s0, p2s1, p2s2],
      [p2t0, p2t1, p2t2],
    ],
  ];
  clothSkillUsed = [false, false, false];
  var clothSkill = [
    [ctime0 == undefined ? -1 : ctime0, ctarget0 == undefined ? -1 : ctarget0],
    [ctime1 == undefined ? -1 : ctime1, ctarget1 == undefined ? -1 : ctarget1],
    [ctime2 == undefined ? -1 : ctime2, ctarget2 == undefined ? -1 : ctarget2],
  ];

  servantInited = false;
  servantAliveMessage = [true, true, true];
  skillUsedInLoop = [false, false, false, false, false, false, false, false, false];
  loadAllImage();

  var lastStage = -1;
  while (true) {
    if (!isScriptRunning) {
      break;
    }
    if (!waitUntilPlayerCanMoveOrFinish()) {
      if (isScriptRunning) {
        console.log("關卡完成，自動戰鬥結束");
      } else {
        console.log("手動停止腳本");
      }
      break;
    }
    sleep(1000);
    var currentStage = getCurrentStage();
    if (until != 0 && until <= currentStage) {
      console.log("進入第" + (currentStage + 1) + "波，自動戰鬥結束");
      break;
    }
    if (lastStage < currentStage) {
      lastStage = currentStage;
      console.log("進入第" + (currentStage + 1) + "波");
    }
    attackAIV2(cardOrder, die, clothSkill, ult, skill, currentStage);
    if (until == 0) {
      console.log("一回合完成，自動戰鬥結束");
      break;
    }
    sleep(5000);
  }
  releaseAllImage();
}

function attackAIV2(cardOrder, die, clothSkill, ult, skill, currentStage) {
  if (fgoaiCurrent) {
    fgoaiCurrent.turns.push(currentStage);
  }
  console.log("自動戰鬥 新回合開始");
  var screenshot = getScreenshotResize();
  var servantAlive = die == 3 ? [true, true, true] : updateServantAlive(screenshot);
  var skillUsed = updateSkillUsed(screenshot);
  var servantExist = updateServantExist(screenshot);
  releaseImage(screenshot);
  for (var s = 0; s < 3; s++) {
    var i = s;
    if (skillDirection) {
      i = 2 - s;
    }
    if (!isScriptRunning) {
      return;
    }
    if (!clothSkillUsed[i] && clothSkill[i][0] >= 0 && currentStage >= clothSkill[i][0]) {
      useClothesSkill(i, clothSkill[i][1]);
      clothSkillUsed[i] = true;
    }
  }
  for (var s1 = 0; s1 < 3; s1++) {
    for (var s2 = 0; s2 < 3; s2++) {
      if (!isScriptRunning) {
        return;
      }
      var i = s1;
      if (servantDirection) {
        i = 2 - s1;
      }
      var j = s2;
      if (skillDirection) {
        j = 2 - s2;
      }
      if (!servantAlive[i]) {
        switch (die) {
          case 0:
            isScriptRunning = false;
            console.log("從者退場，停止腳本");
            return;
          case 1:
            if (!skillUsed[i * 3 + j] && servantExist[i]) {
              useSkill(i, j, skill[i][1][j], false);
            }
            break;
          case 2:
            break;
        }
      } else if (skill[i][0][j] >= 0 && currentStage >= skill[i][0][j] && !skillUsed[i * 3 + j]) {
        useSkill(i, j, skill[i][1][j], false);
      }
    }
  }
  startAttack();
  updateCardList();
  selectCardsV2(cardOrder, ult, currentStage);
}

//image---------------------------------------------
function loadAllImage() {
  cardImage[0] = openImage(imagePath + "cardListB.png");
  cardImage[1] = openImage(imagePath + "cardListN.png");
  cardImage[2] = openImage(imagePath + "cardListQ.png");
  cardImage[3] = openImage(imagePath + "cardResist.png");
  cardImage[4] = openImage(imagePath + "cardWeak.png");
  cardImage[5] = openImage(imagePath + "cardDisable1.png");
  cardImage[6] = openImage(imagePath + "cardDisable2.png");
  skillUsedImage = openImage(imagePath + "skillUsed.png");
  servantExistImage = openImage(imagePath + "servantExist.png");
}

function releaseAllImage() {
  if (servantInited) {
    for (var i = 0; i < 3; i++) {
      releaseImage(initServant[i]);
    }
  }
  for (var i = 0; i < 7; i++) {
    releaseImage(cardImage[i]);
  }
  releaseImage(skillUsedImage);
  releaseImage(servantExistImage);
}

//servant-------------------------------------------
function updateServantAlive(screenshot) {
  var result = [];
  if (!servantInited) {
    servantInited = true;
    initServant = getCurrentServant(screenshot);
    for (var i = 0; i < 3; i++) {
      result[i] = true;
    }
  } else {
    var currentServant = getCurrentServant(screenshot);
    for (var i = 0; i < 3; i++) {
      if (getIdentityScore(initServant[i], currentServant[i]) > 0.8) {
        result[i] = true;
      } else {
        console.log("從者 " + (i + 1) + " 退場");
        result[i] = false;
      }
    }
    for (var i = 0; i < 3; i++) {
      releaseImage(currentServant[i]);
    }
  }
  return result;
}

function updateServantExist(screenshot) {
  var result = [true, true, true];
  for (var i = 0; i < 3; i++) {
    if (!checkImage(screenshot, servantExistImage, servantExistX[i], servantExistY, servantExistWidth, servantExistHeight)) {
      result[i] = false;
    }
  }
  return result;
}

function getCurrentServant(screenshot) {
  var servant = [];
  for (var i = 0; i < 3; i++) {
    servant[i] = cropImage(screenshot, servantAliveX[i], servantAliveY, servantAliveW, servantAliveH);
  }
  return servant;
}

//skill------------------------------------------------
function updateSkillUsed(screenshot) {
  var needRelease = false;
  if (screenshot == null) {
    needRelease = true;
    screenshot = getScreenshotResize();
  }
  var result = [];
  for (var i = 0; i < 9; i++) {
    result[i] = false;
    if (!skillUsedInLoop[i]) {
      //force use skill if not used in this game
      continue;
    }
    for (var offset = -5; offset <= 5; offset++) {
      if (
        checkImage(
          screenshot,
          skillUsedImage,
          skillPositionX[i] + skillUsedPositionOffset[0] + offset,
          skillPositionY + skillUsedPositionOffset[1],
          skillUsedSize,
          skillUsedSize,
          0.65
        )
      ) {
        result[i] = true;
        break;
      }
    }
  }
  if (needRelease) {
    releaseImage(screenshot);
  }
  return result;
}

//card--------------------------------------------------
function updateCardList() {
  var cardImageScore = [];
  var screenshot = getScreenshotResize();
  for (var i = 0; i < 5; i++) {
    //get card color
    var cropCard = cropImage(
      screenshot,
      cardListX[i] + cardColorOffset[0],
      cardListY + cardColorOffset[1],
      cardWidth,
      cardHeight + cardMoveRange
    );
    for (var k = 0; k < 3; k++) {
      var find = findImage(cropCard, cardImage[k]);
      if (cardImageScore[i] == undefined || find.score > cardImageScore[i]) {
        cardImageScore[i] = find.score;
        cardList[i] = k;
      }
    }
    releaseImage(cropCard);

    //get card status
    cardStatus[i] = 0;
    var cropDisable = [];
    for (var j = 0; j < 2; j++) {
      cropDisable[j] = cropImage(
        screenshot,
        cardListX[i] + offsetDisableX[j] - 1,
        cardListY + offsetDisableY,
        disableW + 2,
        disableH + 15
      );
    }
    var cropWeak = cropImage(
      screenshot,
      cardListX[i] + cardListOffsetWeakX,
      cardListY + cardListOffsetWeakY,
      weakW + 1,
      weakH + cardMoveRange
    );
    if (findImage(cropDisable[0], cardImage[5]).score >= 0.85 && findImage(cropDisable[1], cardImage[6]).score >= 0.85) {
      cardStatus[i] = -1;
    } else if (findImage(cropWeak, cardImage[3]).score >= 0.85) {
      cardStatus[i] = 1;
    } else if (findImage(cropWeak, cardImage[4]).score >= 0.85) {
      cardStatus[i] = 2;
    }

    for (var j = 0; j < 2; j++) {
      releaseImage(cropDisable[j]);
    }
    releaseImage(cropWeak);
  }
  releaseImage(screenshot);
}

function selectCardsV2(cardOrder, ult, currentStage) {
  var ultIndex = 0;
  var cardColor;
  var cardSelected = [false, false, false, false, false];
  for (var i = 0; i < cardOrder.length; i++) {
    var selectCardIndex = -1;
    var selectUlt = false;
    switch (cardOrder.charAt(i)) {
      case "B":
        cardColor = 0;
        break;
      case "A":
        cardColor = 1;
        break;
      case "Q":
        cardColor = 2;
        break;
      case "N":
        selectUlt = true;
        while (ultIndex < 3) {
          if (ult[ultIndex] >= 0 && currentStage >= ult[ultIndex]) {
            useUlt(ultIndex);
            ultIndex++;
            break;
          }
          ultIndex++;
        }
        break;
    }
    if (selectUlt) {
      continue;
    }

    //選卡
    for (var j = 0; j < 5; j++) {
      if (!cardSelected[j] && cardList[j] == cardColor) {
        if (selectCardIndex == -1) {
          selectCardIndex = j;
        } else {
          if (cardStatus[selectCardIndex] < cardStatus[j]) {
            selectCardIndex = j;
          }
        }
      }
    }
    if (selectCardIndex != -1) {
      selectCard(selectCardIndex);
      cardSelected[selectCardIndex] = true;
    } else if (!selectUlt) {
      for (var j = 0; j < 5; j++) {
        if (!cardSelected[j]) {
          selectCard(j);
          cardSelected[j] = true;
          break;
        }
      }
    }
  }

  //補足沒選到的卡 (fgoautoscript checks ult[ultIndex], not ult[i]: kept as is)
  for (var i = ultIndex; i < 3; i++) {
    if (ult[ultIndex] >= 0 && currentStage >= ult[ultIndex]) {
      useUlt(i);
      break;
    }
  }
  for (var i = 0; i < 5; i++) {
    if (!cardSelected[i]) {
      selectCard(i);
    }
  }
}

// fgoai tool kit entry (Robotmon, ES5): goes after core, screens, friend, stage, battle and attack instead of
// run.js. The new architecture (vault 〈Robotmon 工具包〉): the device only does single steps; the loops
// (autoAttackV2, attackAIV2, card choice) are in Python. Everything is under the global `fgoai`; each call
// is time-limited and returns JSON {ok, value, timeout, stopped, error}.
//
// The limit: fgoaiCall sets fgoaiDeadline; sleep and getScreenshotResize call fgoaiTick, which ends the
// call's `while (isScriptRunning)` loops once the time is up. After the call the deadline is cleared, so
// the old run.js path (which redefines the same modules) is not affected.

var FGOAI_KIT_VERSION = "c5ded2452ec16587";
var fgoaiDeadline = 0;
var fgoaiTimedOut = false;
var fgoaiImagesLoaded = false;
if (typeof fgoaiRawSleep === "undefined" || fgoaiRawSleep === undefined) {
  var fgoaiRawSleep = sleep; // Robotmon's own sleep, kept once (the kit may be loaded again)
}

function fgoaiTick() {
  if (fgoaiDeadline > 0 && Date.now() >= fgoaiDeadline) {
    fgoaiTimedOut = true;
    isScriptRunning = false;
  }
}

sleep = function (ms) {
  if (fgoaiDeadline > 0) {
    ms = Math.max(0, Math.min(ms, fgoaiDeadline - Date.now()));
  }
  fgoaiRawSleep(ms);
  fgoaiTick();
};

function fgoaiCall(limitMs, fn) {
  if (fgoaiSettings == null) {
    return JSON.stringify({ ok: false, error: "fgoai.setup has not been called" });
  }
  if (!fgoaiIntact()) {
    return JSON.stringify({ ok: false, overwritten: true, error: "another script was loaded over the fgoai kit" });
  }
  isScriptRunning = true;
  fgoaiTimedOut = false;
  fgoaiDeadline = Date.now() + limitMs;
  var value = null;
  var error = null;
  try {
    value = fn();
  } catch (e) {
    error = String(e);
  }
  var timeout = fgoaiTimedOut;
  var stopped = !isScriptRunning && !timeout;
  fgoaiDeadline = 0;
  fgoaiTimedOut = false;
  return JSON.stringify({
    ok: error == null && !timeout && !stopped,
    value: value === undefined ? null : value,
    timeout: timeout,
    stopped: stopped,
    error: error,
    steps: fgoaiTakeSteps(),
  });
}

// Robotmon's VM keeps everything, so a script opened in Mobotmon (fgoautoscript has the same function names) replaces
// the kit's functions while fgoai and its version stay. These names stand for the rest: such a script defines them all.
function fgoaiIntact() {
  return (
    fgoaiOwn.getScreenshotResize === getScreenshotResize &&
    fgoaiOwn.selectFriend === selectFriend &&
    fgoaiOwn.selectStage === selectStage
  );
}

function fgoaiLoadBattleImages() {
  if (!fgoaiImagesLoaded) {
    loadAllImage();
    fgoaiImagesLoaded = true;
  }
}

// The game's app, as mlb's Utils.startApp (user 2026-11-07): Robotmon's VM has no such API, only execute. The service's
// environment has no ANDROID_DATA, without which monkey aborts (JP 2026-11-07: `signal: aborted`). am is for a device
// without monkey. mlb's long BOOTCLASSPATH lines (Android 11, 12) are not here: am does not need them since Android 8.
function fgoaiForeground() {
  var parts = execute("dumpsys window | grep mCurrentFocus || true").split(" u0 ");
  return parts.length < 2 ? "" : parts[1].split("/")[0].trim();
}

function fgoaiStartApp(packageName) {
  var launcher = "android.intent.category.LAUNCHER";
  var out = execute("ANDROID_DATA=/data monkey --pct-syskeys 0 -p " + packageName + " -c " + launcher + " 1 2>&1 || true");
  if (out.indexOf("Events injected: 1") >= 0) {
    return true;
  }
  var lines = execute("cmd package resolve-activity --brief -c " + launcher + " " + packageName + " 2>&1 || true").trim().split("\n");
  var activity = lines[lines.length - 1].trim();
  if (activity.indexOf(packageName + "/") !== 0) {
    throw new Error("cannot find " + packageName + " on the device: " + activity);
  }
  out = execute("ANDROID_DATA=/data am start -a android.intent.action.MAIN -c " + launcher + " -n " + activity + " 2>&1 || true");
  if (out.indexOf("Error") >= 0) {
    throw new Error("cannot start " + packageName + ": " + out);
  }
  return true;
}

var fgoai = {
  version: function () {
    return JSON.stringify({ name: "fgoai-kit", version: FGOAI_KIT_VERSION, ready: fgoaiSettings != null, intact: fgoaiIntact() });
  },
  setup: function (settings) {
    var ok = fgoaiInit(settings);
    fgoaiImagesLoaded = false;
    var size = getScreenSize();
    return JSON.stringify({ ok: ok, value: { width: size.width, height: size.height } });
  },
  foreground: function () {
    return fgoaiCall(15000, fgoaiForeground);
  },
  startGame: function (packageName) {
    return fgoaiCall(30000, function () {
      return fgoaiStartApp(packageName);
    });
  },
  stopGame: function (packageName) {
    return fgoaiCall(30000, function () {
      execute("ANDROID_DATA=/data am force-stop " + packageName);
      return true;
    });
  },
  // a run (startScript's per-loop reset)
  newRun: function () {
    return fgoaiCall(5000, function () {
      skillUsedInLoop = [false, false, false, false, false, false, false, false, false];
      selectFriendList = [];
      spaceUltColor = fgoaiSettings.spaceUltColor;
      isReplay = false;
      fgoaiTargetEmpty = false;
      return true;
    });
  },
  selectStage: function (useApple) {
    return fgoaiCall(60000, function () {
      selectStage(useApple);
      return { replay: isReplay };
    });
  },
  // AP回復 open: one apple at its fixed spot (stage.js eatApple); never 聖晶石
  eatApple: function (useApple) {
    return fgoaiCall(30000, function () {
      return eatApple(useApple);
    });
  },
  selectFriend: function (a, b, c, d, e, f, g, h, i) {
    return fgoaiCall(120000, function () {
      return selectFriend(a, b, c, d, e, f, g, h, i);
    });
  },
  // the support list's rows (fgoautoscript's pixel lines; the icon search when none): the PC side cuts the
  // faces at (friendX + 1, line + 49) from its own screenshot and matches them (tools/support_rows.py)
  friendRows: function () {
    return fgoaiCall(15000, function () {
      var screenshot = getScreenshotResize();
      var lines = getFriendLineByPixel(screenshot);
      if (lines.length == 0) {
        lines = getFriendLineByIcon(screenshot);
      }
      releaseImage(screenshot);
      return { x: friendX, lines: lines };
    });
  },
  // 更新 the support list once (friend.js reloadFriend: waits out the 「しばらく時間をおいて」 dialog)
  reloadFriends: function () {
    return fgoaiCall(60000, function () {
      reloadFriend();
      return true;
    });
  },
  selectTeam: function (team) {
    return fgoaiCall(30000, function () {
      selectTeam(team);
      return true;
    });
  },
  startQuest: function (useItem) {
    return fgoaiCall(30000, function () {
      startQuest(useItem);
      return true;
    });
  },
  // a battle command (one autoAttackV2 call in Python): attackAIV2's state starts over
  battleStart: function () {
    return fgoaiCall(10000, function () {
      servantInited = false;
      servantAliveMessage = [true, true, true];
      clothSkillUsed = [false, false, false];
      skillUsedInLoop = [false, false, false, false, false, false, false, false, false];
      fgoaiLoadBattleImages();
      return true;
    });
  },
  battleEnd: function () {
    return fgoaiCall(10000, function () {
      if (fgoaiImagesLoaded) {
        releaseAllImage();
        fgoaiImagesLoaded = false;
      }
      servantInited = false;
      return true;
    });
  },
  // attackAIV2's first look at the turn: who is alive, which skills were used, who is on the field
  turnInfo: function (die) {
    return fgoaiCall(15000, function () {
      fgoaiLoadBattleImages();
      var screenshot = getScreenshotResize();
      var alive = die == 3 ? [true, true, true] : updateServantAlive(screenshot);
      var used = updateSkillUsed(screenshot);
      var exist = updateServantExist(screenshot);
      releaseImage(screenshot);
      return { alive: alive, skillUsed: used, exist: exist };
    });
  },
  useSkill: function (player, skill, target) {
    return fgoaiCall(30000, function () {
      useSkill(player, skill, target);
      return true;
    });
  },
  useClothesSkill: function (skill, target1, target2) {
    return fgoaiCall(30000, function () {
      useClothesSkill(skill, target1, target2);
      return true;
    });
  },
  switchServant: function (f, b) {
    return fgoaiCall(30000, function () {
      switchServant(f, b);
      return true;
    });
  },
  selectEnemy: function (enemy) {
    return fgoaiCall(20000, function () {
      fgoaiTargetEmpty = false;
      selectEnemy(enemy);
      return { targetEmpty: fgoaiTargetEmpty };
    });
  },
  selectEnemyAt: function (x, y) {
    return fgoaiCall(20000, function () {
      fgoaiTargetEmpty = false;
      selectEnemyAt(x, y);
      return { targetEmpty: fgoaiTargetEmpty };
    });
  },
  setSpaceUltColor: function (color) {
    return fgoaiCall(5000, function () {
      setSpaceUltColor(color);
      return true;
    });
  },
  startAttack: function () {
    return fgoaiCall(20000, function () {
      startAttack();
      return true;
    });
  },
  // the five command cards: colour 0 Buster 1 Arts 2 Quick; status -1 cannot 0 - 1 resist 2 weak
  readCards: function () {
    return fgoaiCall(15000, function () {
      fgoaiLoadBattleImages();
      updateCardList();
      return { cards: cardList.slice(0, 5), status: cardStatus.slice(0, 5) };
    });
  },
  selectCard: function (card) {
    return fgoaiCall(5000, function () {
      selectCard(card);
      return true;
    });
  },
  // the turn's NPs and cards in one call: [["ult", servant] | ["card", 0-4], ...] in the order tapped
  selectCards: function (taps) {
    return fgoaiCall(5000 + taps.length * 3000, function () {
      for (var i = 0; i < taps.length && isScriptRunning; i++) {
        if (taps[i][0] === "ult") {
          useUlt(taps[i][1]);
        } else {
          selectCard(taps[i][1]);
        }
      }
      return true;
    });
  },
  useUlt: function (player) {
    return fgoaiCall(10000, function () {
      useUlt(player);
      return true;
    });
  },
  stage: function () {
    return fgoaiCall(10000, function () {
      return getCurrentStage();
    });
  },
  // one bounded wait: "move" (the command screen, checked twice), "finish" (the bond page), "failed"
  // (the defeat dialog, checked twice) or "wait" (none of them within ms: call again)
  waitUntilPlayerCanMove: function (ms) {
    return fgoaiCall(ms + 8000, function () {
      var end = Date.now() + ms;
      while (isScriptRunning && Date.now() < end) {
        if (isBattleMainPage()) {
          sleep(1000);
          if (isBattleMainPage()) {
            fgoaiCardsTapped = false;
            return "move";
          }
        }
        // out of the battle (the MENU button): the result had no bond page and its taps went through to the
        // quest list (JP 2026-11-01 それでも、少女狼は 進度 3, the next quest's start dialog opened)
        // a CE's detail after the win, a bond CE's (JP 2026-11-05 対決！ マシュ・キリエライト: 5 minutes of taps it
        // does not take); finishQuest closes it
        if (isMainPage() || isCeDetailPage() || isFinishBondPage()) {
          fgoaiCardsTapped = false;
          return "finish";
        }
        fgoaiSpeedTap();
        if (isBattleStageFailedDialog()) {
          sleep(3000);
          if (isBattleStageFailedDialog()) {
            return "failed";
          }
        }
        sleep(1000);
      }
      return "wait";
    });
  },
  // finishQuest until the quest screen (or the restart dialog); done false: call again
  finishQuest: function () {
    return fgoaiCall(30000, function () {
      // still the battle's command screen (the script's turns played, enemies left: JP 2026-11-01 医の記憶 進度 4
      // waited 15 min): said at once, the PC side hands the battle on
      if (isBattleMainPage()) {
        sleep(3000);
        if (isBattleMainPage()) {
          return { done: false, battle: true };
        }
      }
      finishQuest();
      return { done: isScriptRunning };
    });
  },
  // tap (x, y) about every second until one of `icons` (the icon table's names) is on the screen
  clickUntilSkip: function (x, y, icons, ms) {
    return fgoaiCall(ms + 5000, function () {
      var end = Date.now() + ms;
      while (isScriptRunning && Date.now() < end) {
        if (checkIconListInScreen(icons, false)) {
          return true;
        }
        tapScale(x, y);
        sleep(1000);
      }
      return false;
    });
  },
};

var fgoaiOwn = {
  getScreenshotResize: getScreenshotResize,
  selectFriend: selectFriend,
  selectStage: selectStage,
};

fgoai.version();
