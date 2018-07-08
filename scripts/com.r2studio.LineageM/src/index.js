// developer global config start
var wh = getScreenSize();
var gUserScreenWidth = wh.width;
var gUserScreenHeight = wh.height;
var gDevScreenWidth = 1920;
var gDevScreenHeight = 1080;
var gTargetWidth = 800;
var gTargetHeight = 450;
var gDevToResizeRatio = 1/2.4;
var gGameWidth = gUserScreenWidth;
var gGameHeight = gUserScreenHeight;
var gGameOffsetX = 0;
var gGameOffsetY = 0;
if (gUserScreenWidth / gUserScreenHeight > 1.777778) {
  gGameWidth = Math.round(gGameHeight * 1.777778);
  gGameOffsetX = (gUserScreenWidth - gGameWidth) / 2;
} else if (gUserScreenWidth / gUserScreenHeight < 1.777778) {
  gGameHeight = Math.round(gGameWidth / 1.777778);
  gGameOffsetY = (gUserScreenHeight - gGameHeight) / 2;
}
var gDevToUserRatio = gGameWidth / gDevScreenWidth;
// developer global config end

var robotmon = new Robotmon();

function stop() {
  robotmon.stop();
}

var pGameTask = new Point(1747, 57, 233, 228, 196, true, 0.9);
var pGameBag = new Point(1523, 64, 237, 231, 197, true, 0.9);
var pGameStore = new Point(1414, 70, 234, 228, 196, true, 0.9);
var pGameCoin = new Point(960, 57, 205, 179, 60, true, 0.9);

var pIsAutoOn1 = new Point(1450, 738, 0, 0, 0, true, 0.9);
var pIsAutoOn2 = new Point(1484, 775, 0, 0, 0, true, 0.9);
var pIsAutoOn3 = new Point(1450, 808, 0, 0, 0, true, 0.9);
var pIsAutoOn4 = new Point(1414, 775, 0, 0, 0, true, 0.9);
var pIsAutoOn5 = new Point(1473, 748, 0, 0, 0, true, 0.9);
var pIsAutoOn6 = new Point(1473, 799, 0, 0, 0, true, 0.9);
var pIsAutoOn7 = new Point(1425, 799, 0, 0, 0, true, 0.9);
var pIsAutoOn8 = new Point(1425, 748, 0, 0, 0, true, 0.9);
var fIsAutoOn = new Feature("IsAutoOn", [
  pIsAutoOn1, pIsAutoOn2, pIsAutoOn3, pIsAutoOn4,
  pIsAutoOn5, pIsAutoOn6, pIsAutoOn7, pIsAutoOn8
]);

// 

var rHPBar = new Rect(122, 30, 412, 50);
var rMPBar = new Rect(110, 58, 412, 72);
var rEXPValue = new Rect(74, 1044, 150, 1052);
var fInGamePage = new Feature("InGamePage", [pGameTask, pGameBag, pGameStore, pGameCoin]);

var gamePage = new Page("gamePage");
gamePage.gameWidth = 0;
gamePage.gameHeight = 0;

gamePage.onPage = function(img) {
  // var img = this.onScreenshot();
  var isFeature = fInGamePage.checkColor();
  // releaseImage(img);
  // console.log(isFeature);
  return fInGamePage;
};
gamePage.onInit = function() {
};
gamePage.onEnter = function() {
  this.context.debug('Enter', this.name);
};
gamePage.onExit = function() {
  this.context.debug('Exit', this.name);
};
gamePage.onScreenshot = function() {
  return getScreenshotModify(gGameOffsetX, gGameOffsetY, gGameWidth, gGameHeight, gTargetWidth, gTargetHeight, 90);
};
gamePage.onDevToUserXY = function(devX, devY) {
  var x = gGameOffsetX + devX * gDevToUserRatio;
  var y = gGameOffsetY + devY * gDevToUserRatio;
  return {x: x, y: y};
}
gamePage.onDevToResizeXY = function(devX, devY) {
  var x = devX * gDevToResizeRatio;
  var y = devY * gDevToResizeRatio;
  return {x: x, y: y};
}

var updateStatusTask = new Task("gamePage", "updateStatus");
updateStatusTask.onTask = function(img) {
  return true;
};
updateStatusTask.onInit = function() {};
updateStatusTask.onEnter = function() {
  this.context.debug('Enter', this.name);
};
updateStatusTask.onExit = function() {
  this.context.debug('Exit', this.name);
};
updateStatusTask.onRun = function() {
  var hp = this.getHP();
  var mp = this.getMP();
  // this.expChanged();
  // this.isAutoOn();
  console.log('time', hp, mp);
};

updateStatusTask.getHP = function() {
  var hpImg = rHPBar.crop();
  var size = getImageSize(hpImg); // 120, 8
  var totalCount = 0;
  var normalHPCount = 0;
  var poiHPCount = 0;
  var firstPoint = getImageColor(hpImg, 2, 2);
  for (var x = 0; x < size.width; x++) {
    var c1 = getImageColor(hpImg, x, 2);
    var c2 = getImageColor(hpImg, x, 5);
    var c = Colors.mergeColor(c1, c2);
    if (c.r + c.b + c.g < 420) {
      totalCount++;
    }
    if (c.r > 1.1 * (c.b + c.g)) {
      normalHPCount++
    }
    if (c.g > (c.b + c.r)) {
      poiHPCount++;
    }
  }
  releaseImage(hpImg);
  var value = Math.min(Math.round((normalHPCount / totalCount)*100), 100);
  if (firstPoint.g > firstPoint.r) {
    value = Math.min(Math.round((poiHPCount / totalCount)*100), 100);
  }
  return value;
}

updateStatusTask.getMP = function() {
  var mpImg = rMPBar.crop();
  var size = getImageSize(mpImg); // 120, 8
  var totalCount = 0;
  var count = 0;
  for (var x = 0; x < size.width; x++) {
    var c1 = getImageColor(mpImg, x, 2);
    var c2 = getImageColor(mpImg, x, 4);
    var c = Colors.mergeColor(c1, c2);
    if (c.r + c.b + c.g < 500) {
      totalCount++;
    }
    if (c.b > 1.1 * (c.r + c.g)) {
      count++;
    }
  }
  releaseImage(mpImg);
  var value = Math.min(Math.round((count / totalCount)*1110), 100);
  return value;
}

updateStatusTask.expChanged = function() {
  var bundle = this.context.getTaskBundle();
  var expImg = rEXPValue.crop();
  if (bundle.expImg === undefined) {
    bundle.expImg = expImg;
    return;
  }
  if (bundle.expImg !== 0) {
    var score = getIdentityScore(bundle.expImg, expImg);
    releaseImage(bundle.expImg);
    bundle.expImg = expImg;
    if (score < 0.98) {
      bundle.expChanged = true;
    }
  }
}

updateStatusTask.isAutoOn = function() {
  for (var i in fIsAutoOn.points) {
    var point = fIsAutoOn.points[i];
    var c = point.getColor();
    if (c.r > 200) {
      return true;
    }
  }
  return false;
}

function stop() {
  robotmon.stop();
}

robotmon.registAll();
robotmon.start();

