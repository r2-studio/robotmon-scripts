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
} else if (gUserScreenWidth / gUserScreenHeight < 1.777776) {
  // less width, align width
  gUserScreenWHType = -1;
  gDevToUserRatio = gUserScreenWidth / gDevScreenWidth;
  var h = Math.round(gUserScreenWidth / 1.777776);
  gGameOffsetY = (gUserScreenHeight - h) / 2;
  gResizeHeight = Math.floor(gUserScreenHeight * gResizeWidth / gUserScreenWidth);
} else {
  gDevToUserRatio = gUserScreenWidth / gDevScreenWidth;
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
var LocUnknown = 'unknown';

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
  return {x: x, y: y};
}

function devToResizeXY(xy, loc) {
  var userXY = devToUserXY(xy, loc);
  return {x: Math.floor(userXY.x*gUserToResizeRatio), y: Math.floor(userXY.y*gUserToResizeRatio)};
}

// ===== Buttons Infos =====

var gBtnsAutoPlay = [
  {loc: LocCB, x: 500, y: 940}, 
  {loc: LocCB, x: 500, y: 1054},
  {loc: LocCB, x: 450, y: 1000},
  {loc: LocCB, x: 560, y: 1000},

  {loc: LocCB, x: 500, y: 936}, 
  {loc: LocCB, x: 500, y: 1060},
  {loc: LocCB, x: 444, y: 1000},
  {loc: LocCB, x: 566, y: 1000}
];

var gBtnTaskMenu = {loc: LocLT, x: 18, y: 295, r: 224, g: 106, b: 66};
var gBtnTaskFirst = {loc: LocFull, x: 780, y: 226};
var gBtnTaskGo = {loc: LocFull, x: 1734, y: 996};
var gBtnTask1 = {loc: LocLT, x: 140, y: 417, r: 144, g: 150, b: 140};
var gBtnTask2 = {loc: LocLT, x: 140, y: 565, r: 141, g: 142, b: 134};
var gBtnSkipTask = {loc: LocRB, x: 1830, y: 920};
var gBtnSkipTask2 = {loc: LocLB, x: 595, y: 816};
var gBtnsSkill = [
  {loc: LocRB, x: 1638, y: 938, r: 179, g: 207, b: 228},
  {loc: LocRB, x: 1708, y: 732, r: 147, g: 139, b: 128},
  {loc: LocRB, x: 1542, y: 739, r: 236, g: 140, b: 92},
  {loc: LocRB, x: 1427, y: 855, r: 207, g: 206, b: 204},
  {loc: LocRB, x: 1427, y: 1002, r: 255, g: 247, b: 180},
];
var gBtnJump = {loc: LocRB, x: 1836, y: 932};
var gBtnChange = {loc: LocRB, x: 1849, y: 739};
var gBtnUp = {loc: LocLB, x: 236, y: 739, r: 50, g: 64, b: 3};
var gBtnDown = {loc: LocLB, x: 236, y: 1002, r: 65, g: 82, b: 151};
var gBtnLeft = {loc: LocLB, x: 108, y: 867, r: 254, g: 252, b: 239};
var gBtnRight = {loc: LocLB, x: 371, y: 861, r: 209, g: 215, b: 239};

var gBagBtn = {loc: LocRT, x: 1750, y: 54};
var gMoney1 = {loc: LocFull, x: 1480, y: 25};
var gMoney2 = {loc: LocFull, x: 1830, y: 105};
var gExp1 = {loc: LocLB, x: 0, y: 1032};
var gExp2 = {loc: LocLB, x: 180, y: 1080};
var gHp1 = {loc: LocLT, x: 28, y: 80};
var gHp2 = {loc: LocLT, x: 270, y: 80};
var gMp1 = {loc: LocLT, x: 28, y: 112};
var gMp2 = {loc: LocLT, x: 270, y: 112};
var gItemHP = {loc: LocRB, x: 1730, y: 580};
var gItemMP = {loc: LocRB, x: 1850, y: 580};
var gMenu1 = {loc: LocRB, x: 1180, y: 0};
var gMenu2 = {loc: LocRB, x: 1920, y: 80};

var gPages = {
  moving: {name: "moving", points: [
    {loc: LocFull, x: 928, y: 334, r: 120, g: 136, b: 152},
    {loc: LocFull, x: 1100, y: 340, r: 255, g: 124, b: 80},
  ]},
  confirmPage: {name: "confirmPage", points: [
    {loc: LocRB, x: 1548, y: 977, r: 247, g: 122, b: 76},
    {loc: LocRB, x: 1017, y: 1041, r: 6, g: 5, b: 1},
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
  // pageOthers: {name: "pageOthers", points: [
  //   {loc: LocFull, x: 704, y: 51, r: 78, g: 94, b: 107},
  //   {loc: LocFull, x: 979, y: 64, r: 78, g: 94, b: 107},
  // ]},
  exitGame: {name: "exitGame", points: [
    {loc: LocFull, x: 569, y: 797, r: 117, g: 133, b: 148},
    {loc: LocFull, x: 588, y: 263, r: 78, g: 94, b: 107},
    {loc: LocFull, x: 1062, y: 803, r: 84, g: 174, b: 162},
    {loc: LocFull, x: 1350, y: 810, r: 247, g: 122, b: 76},
  ]},
  taskDone: {name: "taskDone", points: [
    {loc: LocFull, x: 1088, y: 970, r: 247, g: 122, b: 76},
    {loc: LocFull, x: 684, y: 96, r: 78, g: 94, b: 107},
    {loc: LocFull, x: 633, y: 970, r: 234, g: 239, b: 233},
  ]},
};

// ===== MapleM script =====

function MapleM(config) {
  this.config = config;
  this.running = false;
  this.img = 0;
  this.autoCheckColors = [{r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}, {r:0,g:0,b:0}];
  this.stopCount = 0;
  this.unknownCount = 0;
  saveImage(this.updateScreenshot(true), '/sdcard/Robotmon/test.png');

  // auto play
  this.direct = '';
  this.moveCount = 0;
  this.tmpImg1 = 0;
  this.tmpImg2 = 0;
  this.sendMessageTime = 0;
  this.secondSkillUsedTime = 0;
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
  tap(xy.x, xy.y, 50);
}

MapleM.prototype.tapDown = function(point, id) {
  var xy = devToUserXY(point, point.loc);
  tapDown(xy.x, xy.y, 10, id);
}

MapleM.prototype.moveTo = function(point, id) {
  var xy = devToUserXY(point, point.loc);
  moveTo(xy.x, xy.y, 10, id);
}

MapleM.prototype.tapUp = function(point, id) {
  var xy = devToUserXY(point, point.loc);
  tapUp(xy.x, xy.y, 10, id);
}

MapleM.prototype.selectTask = function() {
  console.log('selectTask');
  for (var i = 0; i < 5; i++) {
    this.updateScreenshot(true);
    var c = this.getPointColor(gBtnTaskMenu);
    var s = Colors.identityScore(c, gBtnTaskMenu);
    if (s > 0.9) {
      break;
    }
    if (i == 2) {
      this.clickPoint(gBtnTaskMenu);
    }
    keycode('BACK');
    sleep(1000);
  }
  this.clickPoint(gBtnTaskMenu);
  sleep(100);
  this.clickPoint(gBtnTaskMenu);
  sleep(2500);
  this.clickPoint(gBtnTaskFirst);
  sleep(1000);
  this.clickPoint(gBtnTaskGo);
}

MapleM.prototype.doTasks = function() {
  this.updateScreenshot(true);
  var cPage = "autoPlaying";
  var autoPlaying = this.isAutoPlaying();
  if (!autoPlaying) {
    cPage = this.getCurrentPage();
  }
  console.log('currentPage', cPage);
  switch(cPage) {
    case "diePage":
      this.clickPoint(gPages['diePage'].points[0]);
      break;
    case "black":
      for (var i = 0; i < 3; i++) {
        this.clickPoint(gBtnSkipTask);
        sleep(200);
        this.clickPoint(gBtnSkipTask2);
        sleep(200);
        this.clickPoint(gPages['confirmPage'].points[0]);
        sleep(200);
      }
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
    case "taskDone":
      this.clickPoint(gPages['taskDone'].points[0]);
      break;
    case "unknown":
      this.unknownCount++;
      break;
  }
  if (autoPlaying) {
    this.unknownCount = 0;
  } else if (!autoPlaying) {
    if (cPage !== 'black' && cPage !== 'confirmPage') {
      if (this.stopCount % 5 == 4) {
        this.selectTask();
      }
    } else {
      if (this.stopCount % 8 == 7) {
        this.selectTask();
      }
    }
  }
  if (this.unknownCount > 10) {
    this.unknownCount = 0;
    this.selectTask();
  }
  if (this.stopCount > 16) {
    this.selectTask();
  }
  console.log(autoPlaying, 'unknown', this.unknownCount, 'stop', this.stopCount);
}

MapleM.prototype.startDoTasks = function() {
  this.running = true;
  while(this.running) {
    var startRunTime = Date.now();
    this.doTasks();
    var sTime = 1200 - (Date.now() - startRunTime);
    if (sTime > 0) {
      sleep(sTime);
    }
  }
}

MapleM.prototype.useSecondSkills = function() {
  console.log('Use second skills');
  sleep(1600);
  this.clickPoint(gBtnChange);
  for (var i = 0; i < 5; i++) {
    sleep(1600);
    this.clickPoint(gBtnsSkill[i]);
    sleep(500);
    this.clickPoint(gBtnsSkill[i]);
  }
  sleep(1600);
  this.clickPoint(gBtnChange);
}

MapleM.prototype.autoPlayContinue = function() {
  if (this.direct === 'changeToRight') {
    this.tapUp(gBtnLeft, 1);
    this.sendMessage();
    if (this.config.useSecondSkills && Date.now() - this.secondSkillUsedTime > 1200000) {
      this.useSecondSkills();
      this.secondSkillUsedTime = Date.now();
    }
    sleep(800);
    this.tapDown(gBtnRight, 1);
    this.moveCount = 0;
    this.direct = 'right';
    sleep(800);
  } else if (this.direct === 'changeToLeft') {
    this.tapUp(gBtnRight, 1);
    this.sendMessage();
    sleep(800);
    this.tapDown(gBtnLeft, 1);
    this.direct = 'left';
    this.moveCount = 0;
    sleep(800);
  }
  if (this.config.apJump && this.moveCount % 4 === 3) {
    this.tapDown(gBtnJump, 2);
    sleep(100);
    this.tapUp(gBtnJump, 2);
    sleep(400);
  }
  var now = Date.now();
  var useSkill = undefined;
  var useSkillBtn = 0;
  var maxInterval = 0; // for selecting non use skill
  for (var i in this.config.apUseSkillsTime) {
    var skill = this.config.apUseSkillsTime[i];
    var lastUseTime = skill.lastUseTime || 0;
    if (skill.delay === 0) {
      continue;
    }
    var interval = now - lastUseTime;
    if (interval > skill.delay && interval >= maxInterval) {
      if (useSkill === undefined) {
        useSkill = skill;
        useSkillBtn = i;
      } else if (skill.delay > useSkill.delay) {
        useSkill = skill;
        useSkillBtn = i;
      }
      maxInterval = interval;
    }
  }
  if (useSkill === undefined) {
    return;
  }
  console.log('Use Skill', useSkillBtn);
  sleep(100);
  this.tapDown(gBtnsSkill[useSkillBtn], 2);
  sleep(useSkill.during);
  this.tapUp(gBtnsSkill[useSkillBtn], 2);
  useSkill.lastUseTime = now;

  this.moveCount++;
  if (this.moveCount > 5) {
    sleep(100);
    var img1 = getScreenshotModify(gUserScreenWidth - 40, gUserScreenHeight - 30, 40, 30, 40, 30, 100);
    sleep(this.config.apStepDelay);
    var img2 = getScreenshotModify(gUserScreenWidth - 40, gUserScreenHeight - 30, 40, 30, 40, 30, 100);
    var score = getIdentityScore(img1, img2);
    console.log(score);
    releaseImage(img1);
    releaseImage(img2);
    if (score > 0.99) {
      this.direct = (this.direct === 'right') ? 'changeToLeft' : 'changeToRight';
      console.log(this.direct, this.moveCount);
      this.moveCount = 0;
    }
  } else {
    sleep(this.config.apStepDelay);
  }
  console.log('run count', this.moveCount);
}

MapleM.prototype.autoPlayStep = function() {
  if (this.config.useSecondSkills && Date.now() - this.secondSkillUsedTime > 1200000) {
    this.useSecondSkills();
    this.secondSkillUsedTime = Date.now();
  }
  var now = Date.now();
  var useSkill = undefined;
  var useSkillBtn = 0;
  var maxInterval = 0; // for selecting non use skill
  for (var i in this.config.apUseSkillsTime) {
    var skill = this.config.apUseSkillsTime[i];
    var lastUseTime = skill.lastUseTime || 0;
    if (skill.delay === 0) {
      continue;
    }
    var interval = now - lastUseTime;
    if (interval > skill.delay && interval >= maxInterval) {
      if (useSkill === undefined) {
        useSkill = skill;
        useSkillBtn = i;
      } else if (skill.delay > useSkill.delay) {
        useSkill = skill;
        useSkillBtn = i;
      }
      maxInterval = interval;
    }
  }
  if (useSkill === undefined) {
    return;
  }
  console.log('Use Skill', useSkillBtn);
  sleep(100);
  this.tapDown(gBtnsSkill[useSkillBtn], 0);
  sleep(useSkill.during);
  this.tapUp(gBtnsSkill[useSkillBtn], 0);
  useSkill.lastUseTime = now;

  this.moveCount++;

  if (this.config.apStepDelay == 0) {
    return;
  }

  sleep(200);
  if (this.direct === 'right') {
    this.tapDown(gBtnRight, 0);
  } else {
    this.tapDown(gBtnLeft, 0);
  }

  var score = 0;
  if (this.moveCount > 5) {
    var img1 = getScreenshotModify(gUserScreenWidth - 40, gUserScreenHeight - 30, 40, 30, 40, 30, 100);
    sleep(this.config.apStepDelay + 400);
    var img2 = getScreenshotModify(gUserScreenWidth - 40, gUserScreenHeight - 30, 40, 30, 40, 30, 100);
    score = getIdentityScore(img1, img2);
    console.log(score);
    releaseImage(img1);
    releaseImage(img2);
  } else {
    sleep(this.config.apStepDelay + 800);
  }

  if (this.direct === 'right') {
    this.tapUp(gBtnRight, 0);
  } else {
    this.tapUp(gBtnLeft, 0);
  }

  if (score > 0.99) {
    this.direct = (this.direct === 'right') ? 'left' : 'right';
    console.log('change direct', this.direct, this.moveCount);
    this.moveCount = 0;
  }
  console.log('run count', this.moveCount, 'score', score);
}

MapleM.prototype.cropRectImg = function(p1, p2) {
  var xy1 = devToResizeXY(p1, p1.loc);
  var xy2 = devToResizeXY(p2, p2.loc);
  var w = xy2.x - xy1.x;
  var h = xy2.y - xy1.y;
  return cropImage(this.img, xy1.x, xy1.y, w, h);
}

MapleM.prototype.waitForChange = function() {
  var imgOrigin = this.cropRectImg(gMenu1, gMenu2);
  for (var i = 0; i < 10; i++) {
    this.updateScreenshot(true);
    var imgNow = this.cropRectImg(gMenu1, gMenu2);
    var s = getIdentityScore(imgOrigin, imgNow);
    releaseImage(imgNow);
    if (s < 0.9) {
      break;
    }
    sleep(1000);
  }
  releaseImage(imgOrigin);
}

MapleM.prototype.sendMessage = function() {
  if (Date.now() - this.sendMessageTime < 60 * 60 * 1000) {
    return;
  }
  this.sendMessageTime = Date.now();
  var userPlan = getUserPlan();
  if (userPlan === -1) {
    console.log('Need login');
    return;
  }
  if (userPlan > 0) {
    console.log('Sending Messages... Exp');
    this.updateScreenshot(true);
    var expImg = this.cropRectImg(gExp1, gExp2);
    var expBase64 = getBase64FromImage(expImg);
    releaseImage(expImg);
    console.log(sendNormalMessage('Maple M Info', expBase64));
  }
  console.log('Sending Messages... Money');
  this.clickPoint(gBagBtn);
  this.waitForChange();
  var moneyImg = this.cropRectImg(gMoney1, gMoney2);
  var moneyBase64 = getBase64FromImage(moneyImg);
  releaseImage(moneyImg);
  console.log(sendNormalMessage('Maple M Info', moneyBase64));
  sleep(1500);
  keycode('BACK', 20);
  sleep(300);
}

MapleM.prototype.startAutoAttackContinue = function() {
  this.running = true;
  this.direct = 'right';
  this.moveCount = 0;
  this.tapDown(gBtnRight, 1);;
  sleep(800);
  while(this.running) {
    var startRunTime = Date.now();
    this.autoPlayContinue();
  }
  this.tapUp(gBtnRight, 1);;
}

MapleM.prototype.startAutoAttackStep = function() {
  this.running = true;
  this.direct = 'right';
  this.moveCount = 0;
  while(this.running) {
    var startRunTime = Date.now();
    this.autoPlayStep();
    this.sendMessage();
  }
}

MapleM.prototype.startAutoUseItems = function() {
  this.running = true;
  while(this.running) {
    this.updateScreenshot(true);
    var hp = this.getHp();
    var mp = this.getMp();
    if (hp < this.config.useItemHP) {
      this.clickPoint(gItemHP);
      console.log('use hp', hp.toFixed(1), '<', this.config.useItemHP);
      sleep(300);
    }
    if (mp < this.config.useItemMp) {
      this.clickPoint(gItemMP);
      console.log('use mp', mp.toFixed(1), '<', this.config.useItemMp);
      sleep(300);
    }
    sleep(300);
  }
}

MapleM.prototype.startAutoAttackMini = function() {
  this.running = true;
  var i = 0;
  while(this.running) {
    this.clickPoint(gBtnsSkill[2]);
    sleep(1200);
    this.tapDown(gBtnLeft, 1);
    sleep(800);
    this.tapUp(gBtnLeft, 1);
    sleep(500);
    this.clickPoint(gBtnsSkill[2]);
    sleep(1000);

    if (i % 7 == 0) {
      this.clickPoint(gBtnsSkill[2]);
      sleep(1000);
    }

    this.tapDown(gBtnUp, 1);
    sleep(1000);
    this.clickPoint(gBtnsSkill[0]);
    sleep(500);
    this.tapUp(gBtnUp, 1);
    
    sleep(600);
    this.clickPoint(gBtnsSkill[1]);
    sleep(600);
    this.clickPoint(gBtnsSkill[3]);
    sleep(1000);

    this.clickPoint(gBtnsSkill[2]);
    sleep(1200);
    this.tapDown(gBtnRight, 1);
    sleep(800);
    this.tapUp(gBtnRight, 1);
    sleep(500);
    this.clickPoint(gBtnsSkill[2]);
    sleep(1000);

    if (i % 23 == 0) {
      this.clickPoint(gBtnJump);
      sleep(800);
      this.clickPoint(gBtnsSkill[2]);
      sleep(1000);
    }

    this.tapDown(gBtnDown, 1);
    sleep(1000);
    this.clickPoint(gBtnsSkill[0]);
    sleep(500);
    this.tapUp(gBtnDown, 1);

    sleep(600);

    i++;
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

MapleM.prototype.getHp = function() {
  var xy1 = devToResizeXY(gHp1, gHp1.loc);
  var xy2 = devToResizeXY(gHp2, gHp2.loc);
  var vx = 0;
  for (var x = xy1.x; x < xy2.x; x+=2) {
    var c = getImageColor(this.img, x, xy1.y);
    if (c.r > (c.g + c.b)) {
      vx = x;
    }
  }
  var r = ((vx - xy1.x) / (xy2.x - xy1.x) * 100);
  // console.log('HP', r.toFixed(1));
  return r;
}

MapleM.prototype.getMp = function() {
  var xy1 = devToResizeXY(gMp1, gMp1.loc);
  var xy2 = devToResizeXY(gMp2, gMp2.loc);
  var vx = 0;
  for (var x = xy1.x; x < xy2.x; x+=2) {
    var c = getImageColor(this.img, x, xy1.y);
    if (c.b > (c.r + c.g)) {
      vx = x;
    }
  }
  var r = ((vx - xy1.x) / (xy2.x - xy1.x) * 100);
  // console.log('MP', r.toFixed(1));
  return r;
}

MapleM.prototype.isAutoPlaying = function() {
  this.updateScreenshot(true);
  var autoCheckColors = [];
  var samePointsCount = 0;
  for (var i = 0; i < 7; i++) {
    autoCheckColors.push(this.getPointColor(gBtnsAutoPlay[i]));
    var s = Colors.identityScore(this.autoCheckColors[i], autoCheckColors[i]);
    if (s > 0.96) {
      samePointsCount++;
    }
  }
  if (samePointsCount >= 5) {
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
    if (config.task === 'autoAttackContinue') {
      mapleM.startAutoAttackContinue();
    } else if (config.task === 'autoAttackStep') {
      mapleM.startAutoAttackStep();
    } else if (config.task === 'doTasks'){
      mapleM.startDoTasks();
    } else if (config.task === 'autoUseItem'){
      mapleM.startAutoUseItems();
    }
  }
}

var DEFAULT_CONFIG = {
  task: 'autoUseItem', // doTasks, autoAttackContinue, autoAttackStep, autoUseItem
  apJump: false,
  // apSupportSkillTime: 10 * 60 * 1000,
  apStepDelay: 800,
  apUseSkillsTime: [
    {delay: 2000, during: 20},
    {delay: 12*1000, during: 20},
    {delay: 1000, during: 1300},
    {delay: 62*1000, during: 20},
    {delay: 30*1000, during: 20},
  ],
  useItemHP: 70,
  useItemMp: 70,
  useSecondSkills: true,
};

// mapleM = new MapleM(DEFAULT_CONFIG);
// mapleM.selectTask();
// mapleM.startDoTasks();
// console.log(mapleM.getCurrentPage());
// for (var i = 0; i < 10; i++) {
//   console.log(mapleM.isAutoPlaying());
// }
// console.log('currentPage', mapleM.getCurrentPage());
// for (var i = 0; i < 8; i++) {
//   mapleM.doTasks();
// }
// mapleM.startAutoAttackMini();
// mapleM.sendMessage();
// mapleM.startAutoUseItems();
// mapleM.startDoTasks();
// mapleM.getHp();
// mapleM.getMp();
// start("{}");
// mapleM.startAutoAttackContinue();
// mapleM.autoPlay();
// sleep(1000);
// mapleM.autoPlay();