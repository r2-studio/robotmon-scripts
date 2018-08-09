// ===== developer global config start =====
var wh = getScreenSize();
var gUserScreenWidth = Math.max(wh.width, wh.height);
var gUserScreenHeight = Math.min(wh.width, wh.height);
var gDevScreenWidth = 1920;
var gDevScreenHeight = 1080;
var gResizeWidth = 960; // 960
var gResizeHeight = 540; // 540
var gDevToResizeRatio = 1/2;
var gDevToUserRatio = 1;
var gGameOffsetX = 0; // for full screen
var gGameOffsetY = 0;
var gUserScreenWHType = 0;
if (gUserScreenWidth / gUserScreenHeight > 1.777778) {
  // more width, align height
  gUserScreenWHType = 1;
  gDevToUserRatio = gUserScreenHeight / gDevScreenHeight;
  var w = Math.round(gUserScreenHeight * 1.777778);
  gGameOffsetX = (gUserScreenWidth - w) / 2;
  gResizeWidth = Math.floor(gUserScreenWidth * gResizeHeight / gUserScreenHeight);
} else if (gUserScreenWidth / gUserScreenHeight < 1.777778) {
  // less width, align width
  gUserScreenWHType = -1;
  gDevToUserRatio = gUserScreenWidth / gDevScreenWidth;
  var h = Math.round(gUserScreenWidth / 1.777778);
  gGameOffsetY = (gUserScreenHeight - h) / 2;
  gResizeHeight = Math.floor(gUserScreenHeight * gResizeWidth / gUserScreenHeight);
}
var gUserToResizeRatio = gResizeHeight / gUserScreenHeight;
console.log('Resize WH', gResizeWidth, gResizeHeight);
// ===== developer global config end =====

// ===== Utils =====

var LocLT = 'lt';
var LocRT = 'rt';
var LocLB = 'lb';
var LocRB = 'rb';
var LocFull = 'full';
var LocCB = 'cb';

function devToUserXY(xy, loc) {
  var x = xy.x * gDevToUserRatio;
  var y = xy.y * gDevToUserRatio;
  if (loc === LocRT && gUserScreenWHType === 1) {
    x = gUserScreenWidth - ((gDevScreenWidth - xy.x) * gDevToUserRatio);
  } else if (loc === LocLB && gUserScreenWHType === -1) {
    y = gUserScreenHeight - ((gDevScreenHeight - xy.y) * gDevToUserRatio);
  } else if (loc === LocRB) {
    if (gUserScreenWHType === 1) {
      x = gUserScreenWidth - ((gDevScreenWidth - xy.x) * gDevToUserRatio);
    } else if (gUserScreenWHType === -1) {
      y = gUserScreenHeight - ((gDevScreenHeight - xy.y) * gDevToUserRatio);
    }
  } else if (loc === locFull) {
    x = gGameOffsetX + xy.x * gDevToUserRatio;
    y = gGameOffsetY + xy.y * gDevToUserRatio;
  } else if (loc === locCB) {
    if (gUserScreenWHType === 1) {
      var w = gDevScreenWidth * gDevToUserRatio;
      var offsetX = Math.floor((gUserScreenWidth - w) / 2);
      x = offsetX + (xy.x * gDevToUserRatio);
    } else if (gUserScreenWHType === -1) {
      y = gUserScreenHeight - ((gDevScreenHeight - xy.y) * gDevToUserRatio);
    }
  }
  return xy;
}

function devToResizeXY(xy, loc) {
  var userXY = devToUserXY(xy, loc);
  return {x: userXY.x*gUserToResizeRatio, y: userXY.y*gUserToResizeRatio};
}


// ===== MapleM script =====

function MapleM(config) {
  this.config = config;
  this.running = false;
}

MapleM.prototype.getScreenshot = function() {
  return getScreenshotModify(0, 0, gResizeWidth, gResizeHeight, gResizeWidth, gResizeHeight, 90);
}

var mapleM = undefined;

function stop() {
  if (mapleM !== undefined) {
    mapleM.stop();
    mapleM = undefined;
  }
}

function start(configString) {
  var config = JSON.parse(configString)
  if (mapleM === undefined) {
    mapleM = new MapleM(config);
    mapleM.start();
  }
}