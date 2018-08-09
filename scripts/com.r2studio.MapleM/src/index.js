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
  var h = Math.round(gUserScreenWidth / 1.777776);
  gGameOffsetY = (gUserScreenHeight - h) / 2;
  gResizeHeight = Math.floor(gUserScreenHeight * gResizeWidth / gUserScreenWidth);
}
var gUserToResizeRatio = gResizeHeight / gUserScreenHeight;
console.log('Resize WH', gResizeWidth, gResizeHeight, gGameOffsetX, gGameOffsetY);
// ===== developer global config end =====

// ===== Utils =====
function Colors() {}
Colors.identityScore = function(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512+mean)*r*r)>>8) + 4*g*g + (((767-mean)*b*b)>>8)) / 768;
}

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
  } else if (loc === LocFull) {
    x = gGameOffsetX + xy.x * gDevToUserRatio;
    y = gGameOffsetY + xy.y * gDevToUserRatio;
  } else if (loc === LocCB) {
    if (gUserScreenWHType === 1) {
      var w = gDevScreenWidth * gDevToUserRatio;
      var offsetX = Math.floor((gUserScreenWidth - w) / 2);
      x = offsetX + (xy.x * gDevToUserRatio);
    } else if (gUserScreenWHType === -1) {
      y = gUserScreenHeight - ((gDevScreenHeight - xy.y) * gDevToUserRatio);
    }
  }
  x = Math.floor(x);
  y = Math.floor(y);
  return xy;
}

function devToResizeXY(xy, loc) {
  var userXY = devToUserXY(xy, loc);
  return {x: Math.floor(userXY.x*gUserToResizeRatio), y: Math.floor(userXY.y*gUserToResizeRatio)};
}

// ===== Buttons Infos =====

var gBtnsAutoPlay = [
  {loc: LocLB, x: 500, y: 940}, 
  {loc: LocLB, x: 500, y: 1054},
  {loc: LocLB, x: 450, y: 1000},
  {loc: LocLB, x: 560, y: 1000}
];

var gBtnTask1 = {loc: LocLT, x: 140, y: 417, r: 144, g: 150, b: 140};
var gBtnTask2 = {loc: LocLT, x: 140, y: 565, r: 141, g: 142, b: 134};
var gBtnSkipTask = {loc: LocRB, x: 1830, y: 920};

var gPages = {
  moving: {name: "moving", points: [
    {loc: LocLT, x: 928, y: 334, r: 120, g: 136, b: 152},
    {loc: LocLT, x: 1100, y: 340, r: 255, g: 124, b: 80},
  ]},
  confirmPage: {name: "confirmPage", points: [
    {loc: LocFull, x: 1548, y: 977, r: 247, g: 122, b: 76},
    {loc: LocFull, x: 1017, y: 1041, r: 6, g: 5, b: 1},
  ]},
  diePage: {name: "diePage", points: [
    {loc: LocFull, x: 716, y: 790, r: 120, g: 136, b: 152},
    {loc: LocFull, x: 1088, y: 765, r: 89, g: 176, b: 168},
    {loc: LocFull, x: 1452, y: 765, r: 255, g: 124, b: 80},
  ]},
  black: {name: "black", points: [
    {loc: LocLT, x: 64, y: 1028, r: 2, g: 2, b: 0, s: 0.9},
    {loc: LocLT, x: 1875, y: 1035, r: 3, g: 3, b: 1, s: 0.9},
    {loc: LocLT, x: 960, y: 1035, r: 3, g: 3, b: 1, s: 0.9},
  ]},
  pageOthers: {name: "pageOthers", points: [
    {loc: LocFull, x: 704, y: 51, r: 78, g: 94, b: 107},
    {loc: LocFull, x: 979, y: 64, r: 78, g: 94, b: 107},
  ]},
  exitGame: {name: "exitGame", points: [
    {loc: LocFull, x: 569, y: 797, r: 117, g: 133, b: 148},
    {loc: LocFull, x: 588, y: 263, r: 78, g: 94, b: 107},
    {loc: LocFull, x: 1062, y: 803, r: 84, g: 174, b: 162},
    {loc: LocFull, x: 1350, y: 810, r: 247, g: 122, b: 76},
  ]},
};

// ===== MapleM script =====

function MapleM(config) {
  this.config = config;
  this.running = false;
  this.img = 0;
  this.autoCheckColors = [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}];
  this.stopCount = 0;
  this.unknownCount = 0;
  saveImage(this.updateScreenshot(true), '/sdcard/Robotmon/test.png');
}

MapleM.prototype.updateScreenshot = function(update) {
  if (update || this.img === 0) {
    if (this.img !== 0) {
      releaseImage(this.img);
    }
    this.img = getScreenshotModify(0, 0, gUserScreenWidth, gUserScreenHeight, gResizeWidth, gResizeHeight, 80);
  }
  return this.img;
}

MapleM.prototype.getPointColor = function(point, img) {
  if (img === undefined) {
    img = this.img;
  }
  var xy = devToResizeXY(point, point.loc);
 
  var c = getImageColor(img, xy.x, xy.y);
  // console.log(xy.x, xy.y, c.r, c.g, c.b);
  return c;
}

MapleM.prototype.clickPoint = function(point) {
  var xy = devToUserXY(point, point.loc);
  tap(xy.x, xy.y, 20);
}

MapleM.prototype.doTasks = function() {
  this.updateScreenshot(true);
  var cPage = this.getCurrentPage();
  var autoPlaying = this.isAutoPlaying();
  if (autoPlaying) {
    cPage = "autoPlaying";
  }
  console.log('currentPage', cPage);
  switch(cPage) {
    case "diePage":
    this.clickPoint(gPages['diePage'].points[0]);
      break;
    case "black":
      this.clickPoint(gBtnSkipTask);
      break;
    case "pageOthers":
      keycode('BACK', 20);
      break;
    case "confirmPage":
      this.clickPoint(gPages['confirmPage'].points[0]);
      break;
    case "exitGame":
      this.clickPoint(gPages['exitGame'].points[0]);
      break;
    case "unknown":
      this.unknownCount++;
      break;
  }
  if (autoPlaying) {
    this.unknownCount = 0;
  } else if (!autoPlaying) {
    if (this.stopCount > 4) {
      this.clickPoint(gBtnTask1);
    } else if (this.stopCount > 2){
      this.clickPoint(gBtnTask2);
    }
  }
  if (this.unknownCount > 5) {
    this.unknownCount = 0;
    keycode('BACK', 20);
  }
  if (this.stopCount > 10) {
    keycode('BACK', 20);
  }
  console.log(autoPlaying, this.unknownCount, this.stopCount);
}

MapleM.prototype.startDoTasks = function() {
  this.running = true;
  while(this.running) {
    var startRunTime = Date.now();
    this.doTasks();
    var sTime = 800 - (Date.now() - startRunTime);
    if (sTime > 0) {
      sleep(sTime);
    }
  }
}

MapleM.prototype.getCurrentPage = function() {
  var cPage = "unknown";
  for (var k in gPages) {
    var page = gPages[k];
    var name = page.name;
    var isPage = true;
    for (var i in page.points) {
      var point = page.points[i];
      var c = this.getPointColor(point);
      var s = Colors.identityScore(c, point);
      // console.log(name, s);
      if (point.s !== undefined && s < point.s) {
        isPage = false;
        break;
      } else if (s < 0.9) {
        isPage = false;
        break;
      }
    }
    if (isPage) {
      cPage = name;
      break;
    }
  }
  return cPage;
}

MapleM.prototype.isAutoPlaying = function() {
  this.updateScreenshot(true);
  var autoCheckColors = [];
  var samePointsCount = 0;
  for (var i = 0; i < 4; i++) {
    autoCheckColors.push(this.getPointColor(gBtnsAutoPlay[i]));
    var s = Colors.identityScore(this.autoCheckColors[i], autoCheckColors[i]);
    if (s > 0.96) {
      samePointsCount++;
    }
  }
  if (samePointsCount >= 2) {
    this.stopCount++;
  } else {
    this.stopCount = 0;
  }
  this.autoCheckColors = autoCheckColors;
  if (this.stopCount > 1) {
    return false;
  }
  return true;
}

MapleM.prototype.stop = function() {
  this.running = false;
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
    mapleM.startDoTasks();
  }
}

var DEFAULT_TASK = {
  task: 'doTasks', // doTasks, autoAttack

};

mapleM = new MapleM(undefined);
// for (var i = 0; i < 10; i++) {
//   console.log(mapleM.isAutoPlaying());
// }
// console.log('currentPage', mapleM.getCurrentPage());
// start("{}");
mapleM.doTasks();