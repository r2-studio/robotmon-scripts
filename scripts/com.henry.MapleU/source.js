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
var gMenuBtn = {loc: LocRT, x: 1850, y: 60};
var gQuickStoreBtn = {loc: LocFull, x: 280, y: 980};
var gMoneyStoreBtn = {loc: LocFull, x: 480, y: 800};
var gMoneyStoreBtn = {loc: LocFull, x: 480, y: 800};
var gTreasureBtn = {loc: LocLT, x: 128, y: 600};

var gPages = {
  moving: {name: 'moving', points: [
    {loc: LocFull, x: 928, y: 334, r: 120, g: 136, b: 152},
    {loc: LocFull, x: 1100, y: 340, r: 255, g: 124, b: 80},
  ]},
  confirmPage: {name: 'confirmPage', points: [
    {loc: LocRB, x: 1548, y: 977, r: 247, g: 122, b: 76},
    {loc: LocRB, x: 1017, y: 1041, r: 6, g: 5, b: 1},
  ]},
  diePage: {name: 'diePage', points: [
    {loc: LocFull, x: 716, y: 790, r: 120, g: 136, b: 152},
    {loc: LocFull, x: 1088, y: 765, r: 89, g: 176, b: 168},
    {loc: LocFull, x: 1452, y: 765, r: 255, g: 124, b: 80},
  ]},
  black: {name: 'black', points: [
    {loc: LocLT, x: 64, y: 1028, r: 2, g: 2, b: 0, s: 0.9},
    {loc: LocLT, x: 1875, y: 1035, r: 3, g: 3, b: 1, s: 0.9},
    {loc: LocLT, x: 960, y: 1035, r: 3, g: 3, b: 1, s: 0.9},
  ]},
  // pageOthers: {name: 'pageOthers', points: [
  //   {loc: LocFull, x: 704, y: 51, r: 78, g: 94, b: 107},
  //   {loc: LocFull, x: 979, y: 64, r: 78, g: 94, b: 107},
  // ]},
  exitGame: {name: 'exitGame', points: [
    {loc: LocFull, x: 569, y: 797, r: 117, g: 133, b: 148},
    {loc: LocFull, x: 588, y: 263, r: 78, g: 94, b: 107},
    {loc: LocFull, x: 1062, y: 803, r: 84, g: 174, b: 162},
    {loc: LocFull, x: 1350, y: 810, r: 247, g: 122, b: 76},
  ]},
  taskDone: {name: 'taskDone', points: [
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
  this.points = 0;
}

MapleM.prototype.autoBuy = function() {
  this.clickPoint(gMenuBtn);
  sleep(1000);

  console.log('進入市集');
  this.clickPoint(gQuickStoreBtn);
  sleep(1000);

  if (!this.running) {
    return;
  }

  this.clickPoint(gMoneyStoreBtn);
  sleep(4000);

  if (!this.running) {
    return;
  }

  this.clickPoint(gTreasureBtn);
  sleep(5000);

  if (!this.running) {
    return;
  }

  console.log('購買寶箱');
  this.clickPoint({loc: LocFull, x: 660, y: 960});
  sleep(3000);

  for (var i = 0; i < 15 && this.running; i++) {
    console.log('確認購買');
    this.clickPoint({loc: LocFull, x: 1241, y: 803});
    sleep(4000);

    if (!this.running) {
      break;
    }

    this.updateScreenshot(true);
    var isPointColor = this.isPointColor({loc: LocFull,x: 1094, y: 790, r: 247, g: 122, b: 76});
    if (isPointColor) {
      console.log('背包已滿');
      keycode('BACK'); sleep(1000);
      break;
    }
    console.log('使用1點數...請稍候');
    var success = this.usePoints();
    if (!success) {
      console.log('點數不足，跳出');
      return;
    }
    this.config.buyTimes--;

    if (!this.running) {
      break;
    }

    this.waitForChangePointColor({loc: LocFull, x: 1060, y: 970, r: 247, g: 122, b: 76}, 15000);
    console.log('全部開啟');
    this.clickPoint({loc: LocFull, x: 1060, y: 970, r: 247, g: 122, b: 76});
    sleep(500);
    this.clickPoint({loc: LocFull, x: 1060, y: 970, r: 247, g: 122, b: 76});
    sleep(4000);

    if (!this.running) {
      break;
    }

    console.log('再試一次');
    this.clickPoint({loc: LocFull, x: 876, y: 945, r: 84, g: 174, b: 162});
    sleep(2000);

    if (this.config.buyTimes <= 0) {
      console.log('使用次數達成');
      break;
    }
  }

  if (!this.running) {
    return;
  }

  console.log('離開');
  keycode('BACK'); sleep(1000);
  keycode('BACK'); sleep(1000);

  if (!this.running) {
    return;
  }

  this.clickPoint({loc: LocFull, x: 1090, y: 90});
  this.waitForChangePointColor({loc: LocFull, x: 665, y: 990, r: 247, g: 252, b: 246}, 15000);

  console.log('尋找武器');
  var isFound = false;
  if (this.config.armorSelection === '0') {
    // first equip
    isFound = true;
    this.clickPoint({loc: LocFull, x: 1184, y: 321}); // first equip
    sleep(2000);
  } else if (this.config.armSelection === '1') {
    // green equip
    isFound = this.findEquip(4);
  } else if (this.config.armorSelection === '2') {
    // orange equip
    isFound = this.findEquip(3);
  }

  if (!isFound) {
    console.log('找不到武器 跳出');
    keycode('BACK'); sleep(1000);
    keycode('BACK'); sleep(1000);
    return;
  }

  console.log('找到裝備，自動選擇');
  this.clickPoint({loc: LocFull, x: 1785, y: 996}); // auto select
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('選擇史詩');
  this.clickPoint({loc: LocFull, x: 1235, y: 681}); // 史詩
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('選擇');
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('等待選擇');
  this.waitForChangePointColor({loc: LocFull, x: 1024, y: 996, r: 247, g: 122, b: 76}, 15000);
  console.log('確認');
  this.clickPoint({loc: LocFull, x: 1024, y: 996});
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('等待動畫');
  this.waitForChangePointColor({loc: LocFull, x: 1036, y: 970, r: 247, g: 122, b: 76}, 15000);
  console.log('完成');
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(2500);

  if (!this.running) {
    return;
  }

  console.log('移除武器');
  this.clickPoint({loc: LocFull, x: 420, y: 240}); // current equip
  sleep(2500);

  if (!this.running) {
    return;
  }

  // armor
  console.log('防具');
  this.clickPoint({loc: LocFull, x: 1340, y: 200}); // armor
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('尋找防具');
  var isFound = false;
  if (this.config.armorSelection === '0') {
    // first equip
    isFound = true;
    this.clickPoint({loc: LocFull, x: 1184, y: 321}); // first equip
    sleep(2000);
  } else if (this.config.armSelection === '1') {
    // green equip
    isFound = this.findEquip(4);
  } else if (this.config.armorSelection === '2') {
    // orange equip
    isFound = this.findEquip(3);
  }

  if (!isFound) {
    console.log('找不到裝備 跳出');
    keycode('BACK'); sleep(1000);
    keycode('BACK'); sleep(1000);
    return;
  }

  console.log('找到裝備，自動選擇');
  this.clickPoint({loc: LocFull, x: 1785, y: 996}); // auto select
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('選擇史詩');
  this.clickPoint({loc: LocFull, x: 1235, y: 681}); // 史詩
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('選擇');
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(3000);

  if (!this.running) {
    return;
  }

  console.log('等待選擇');
  this.waitForChangePointColor({loc: LocFull, x: 1024, y: 996, r: 247, g: 122, b: 76}, 15000);
  console.log('確認');
  this.clickPoint({loc: LocFull, x: 1024, y: 996});
  sleep(3000);

  if (!this.running) {
    return;
  }

  console.log('等待動畫');
  this.waitForChangePointColor({loc: LocFull, x: 1036, y: 970, r: 247, g: 122, b: 76}, 15000);
  console.log('完成');
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(3000);

  if (!this.running) {
    return;
  }

  console.log('自動選擇');
  this.clickPoint({loc: LocFull, x: 1785, y: 996}); // auto select
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('選擇');
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(3000);

  if (!this.running) {
    return;
  }

  console.log('等待選擇');
  this.waitForChangePointColor({loc: LocFull, x: 1024, y: 996, r: 247, g: 122, b: 76}, 15000);
  console.log('確認');
  this.clickPoint({loc: LocFull, x: 1024, y: 996});
  sleep(2000);

  if (!this.running) {
    return;
  }

  console.log('等待動畫');
  this.waitForChangePointColor({loc: LocFull, x: 1036, y: 970, r: 247, g: 122, b: 76}, 15000);
  this.clickPoint({loc: LocFull, x: 1036, y: 970});
  sleep(3000);

  if (!this.running) {
    return;
  }

  this.clickPoint({loc: LocFull, x: 420, y: 240}); // current equip
  sleep(3000);

  if (!this.running) {
    return;
  }

  console.log('離開');
  keycode('BACK'); sleep(1000);
  keycode('BACK'); sleep(1000);
}

// findColor = 3 (orange), findColor = 4 (green)
MapleM.prototype.findEquip = function(findColor) {
  this.running = true;
  var xs = [1180, 1340, 1500, 1650, 1810];
  var ys = [260, 426, 590, 756];
  var cs = [{r: 149, g: 156, b: 149}, {r: 62, g: 146, b: 210}, {r: 144, g: 100, b: 192}, {r: 226, g: 151, b: 70}, {r: 59, g: 170, b: 119}];
  // y 138
  var isFound = false;
  var ex = 0;
  var ey = 0;
  for (var page = 0; page < 9 && this.running; page++) {
    console.log('page', page);
    sleep(500);
    this.updateScreenshot(true);
    sleep(500);
    var equipCount = 0;
    var dy = -1;
    for (var i = 0; i < 160 && this.running; i++) {
      for (var c = 0; c < 5 && this.running; c++) {
        var color = cs[c];
        var pt1 = {loc: LocFull, x: xs[0], y: ys[0] + i, r: color.r, g: color.g, b: color.b};
        var pt2 = {loc: LocFull, x: xs[0]+24, y: ys[0] + i, r: color.r, g: color.g, b: color.b};
        var pb1 = {loc: LocFull, x: xs[0], y: ys[0]+138 + i, r: color.r, g: color.g, b: color.b};
        if (this.isPointColor(pt1) && this.isPointColor(pt2) && this.isPointColor(pb1)) {
          console.log('delta y', i);
          dy = i;
          break;
        }
      }
      if (dy !== -1) {break;}
    }
    
    for (var xi = 0; xi < 5 && this.running; xi++) {
      for (var yi = 0; yi < 4 && this.running; yi++) {
        var x = xs[xi];
        var y = ys[yi]+dy;
        for (var c = 0; c < 5 && this.running; c++) {
          var color = cs[c];
          var pt1 = {loc: LocFull, x: x, y: y, r: color.r, g: color.g, b: color.b};
          var pt2 = {loc: LocFull, x: x+24, y: y, r: color.r, g: color.g, b: color.b};
          var pb1 = {loc: LocFull, x: x, y: y+138, r: color.r, g: color.g, b: color.b};
          var pb2 = {loc: LocFull, x: x, y: y+140, r: color.r, g: color.g, b: color.b};
          var ispt1 = this.isPointColor(pt1);
          var ispt2 = this.isPointColor(pt2);
          var ispb1 = this.isPointColor(pb1);
          var ispb2 = this.isPointColor(pb2);
          // console.log(ispt1, ispt2, ispb1, ispb2);
          if (c === findColor && ispt1 && ispt2 && (ispb1 || ispb2)) {
            console.log('Found', xi, yi);
            ex = x;
            ey = y+69;
            isFound = true;
            equipCount++;
            break;
          } else if (ispt1 && ispt2) {
            // console.log('jump', c, xi, yi);
            equipCount++;
            break;
          }
        }
        if (isFound) {break;}
      }
      if (isFound) {break;}
    }
    if (equipCount === 0) {
      console.log('not found');
      break;
    }
    
    if (!isFound) {
      console.log('換頁');
      this.tapDown({loc: LocFull, x: 1500, y: 870}, 0);
      sleep(100);
      this.moveTo({loc: LocFull, x: 1500, y: 870}, 0);
      sleep(200);
      this.moveTo({loc: LocFull, x: 1500, y: 700}, 0);
      sleep(200);
      this.moveTo({loc: LocFull, x: 1500, y: 500}, 0);
      sleep(200);
      this.moveTo({loc: LocFull, x: 1500, y: 300}, 0);
      sleep(500);
      this.moveTo({loc: LocFull, x: 1500, y: 205}, 0);
      sleep(1000);
      this.tapUp({loc: LocFull, x: 1500, y: 205}, 0);
    }
    if (isFound) {break;}
  }
  if (!isFound) {
    return false;
  }
  this.clickPoint({loc: LocFull, x: ex, y: ey});
  sleep(1500);
  console.log('確認是否誤選');
  for (var c = 0; c < 5; c++) {
    var color = cs[c];
    var ispt = this.isPointColor({loc: LocFull, x: 440, y: 160, r: color.r, g: color.g, b: color.b});
    var ispb = this.isPointColor({loc: LocFull, x: 440, y: 300, r: color.r, g: color.g, b: color.b});
    if (c !== findColor && (ispt || ispb)) {
      console.log('選錯了...取消');
      this.clickPoint({loc: LocFull, x: 420, y: 240});
      sleep(500);
      return false;
    }
  }
  this.clickPoint({loc: LocFull, x: 880, y: 240});
  sleep(1000);
  return true;
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

MapleM.prototype.isPointColor = function(point, img) {
  var c = this.getPointColor(point, img);
  var s = Colors.identityScore(c, point);
  // console.log(s, c.r, c.g, c.b);
  if (s > 0.92) {
    return true;
  }
  return false;
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

MapleM.prototype.waitForChangePointColor = function(point, maxWaitTime) {
  var start = Date.now();
  for (var i = 0; i < 10; i++) {
    this.updateScreenshot(true);
    var isPointColor = this.isPointColor(point);
    if (isPointColor) {
      return true;
    }
    if (Date.now() - start > maxWaitTime) {
      return false;
    }
    sleep(500);
  }
  return false;
}

MapleM.prototype.sendMessage = function() {
  if (Date.now() - this.sendMessageTime < 60 * 60 * 1000) {
    return;
  }
  this.sendMessageTime = Date.now();
}

MapleM.prototype.updatePoints = function() {
  if (this.config.accountId == '') {
    console.log('帳號ID尚未設定');
    return;
  }
  var result = httpClient('POST', 'https://us-central1-robotmon-98370.cloudfunctions.net/getMaplePoints', 'accountId=' + this.config.accountId, {'Content-Type': 'application/x-www-form-urlencoded'});
  var pointData = JSON.parse(result);
  this.points = pointData.points;
  console.log('點數剩餘 ' + this.points);
}

MapleM.prototype.usePoints = function() {
  var result = httpClient('POST', 'https://us-central1-robotmon-98370.cloudfunctions.net/useMaplePoints', 'accountId=' + this.config.accountId, {'Content-Type': 'application/x-www-form-urlencoded'});
  var pointData = JSON.parse(result) || {points: 0, success: false};
  this.points = pointData.points;
  if (pointData.success) {
    console.log('使用點數成功，剩餘 ' + this.points);
  } else {
    console.log('點數不足，剩餘 ' + this.points);
  }
  return pointData.success;
}

MapleM.prototype.startAutoBuy = function() {
  this.updatePoints();
  this.running = true;
  while(this.points > 0 && this.config.buyTimes > 0) {
    mapleM.autoBuy();
    sleep(2000);
  }
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
    mapleM.startAutoBuy();
  }
}

var DEFAULT_CONFIG = {
  accountId: '',
  buyTimes: 10,
  armSelection: '2', // 武器
  armorSelection: '2', // 防具
};

// mapleM = new MapleM(DEFAULT_CONFIG);
// mapleM.startAutoBuy();