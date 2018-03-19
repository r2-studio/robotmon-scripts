// == Global variables start
// -- screen info
const _wh = getScreenSize();
const gDevWidth = 1920;
const gDevHeight = 1080;
const gTargetWidth = 960;
const gTargetHeight = 540;
const gDeviceWidth = Math.max(_wh.width, _wh.height);
const gDeviceHeight = Math.min(_wh.width, _wh.height);
const gRatioTarget = gTargetWidth / gDevWidth;
const gRatioDevice = gDeviceWidth / gDevWidth;
// -- others
const gZeroColor = {r: 0, g: 0, b: 0};
// == Global variables en

class Utils {
  static nearColor(c, c1, c2) {
    const d1 = Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
    const d2 = Math.abs(c2.r - c.r) + Math.abs(c2.g - c.g) + Math.abs(c2.b - c.b);
    return d1 - d2;
  }
  static mergeColor(c1, c2) {
    return {
      r: Math.round((c1.r + c2.r) / 2),
      g: Math.round((c1.g + c2.g) / 2),
      b: Math.round((c1.b + c2.b) / 2),
    };
  }
  static diffColor(c, c1) {
    return Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
  }
  static minMaxDiff(c) {
    const max = Math.max(Math.max(c.r, c.g), c.b);
    const min = Math.min(Math.min(c.r, c.g), c.b);
    return max - min;
  }
  static isSameColor(c1, c2, d = 25) {
    if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
      return true;
    }
    return false;
  }
}

class Rect {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.w = x2 - x1;
    this.h = y2 - y1;
    this.tx = this.x1 * gRatioTarget;
    this.ty = this.y1 * gRatioTarget;
    this.tw = (this.x2 - this.x1) * gRatioTarget;
    this.th = (this.y2 - this.y1) * gRatioTarget; 
  }
  crop(img) {
    return cropImage(img, this.tx, this.ty, this.tw, this.th);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tx = this.x * gRatioTarget;
    this.ty = this.y * gRatioTarget;
    this.dx = this.x * gRatioDevice;
    this.dy = this.y * gRatioDevice;
  }
  tap() {
    tap(this.dx, this.dy, 20); 
  }
}

class FeaturePoint extends Point {
  // need: true => should exist, false => should not exist
  constructor(x, y, r, g, b, need, diff = 25) {
    super(x, y);
    this.r = r;
    this.g = g;
    this.b = b;
    this.d = diff;
    this.need = need;
  }
  check(img) {
    const c = getImageColor(img, this.tx, this.ty);
    if (this.need && !Utils.isSameColor(c, this, this.d)) {
      return false;
    } else if (!this.need && Utils.isSameColor(c, this)) {
      return false;
    }
    return true;
  }
  print(img) {
    const c = getImageColor(img, this.tx, this.ty);
    console.log('target', this.tx, this.ty, 'param', `${this._r}, ${this.x}, ${this.y}, ${c.r}, ${c.g}, ${c.b}, true`);
  }
}

class PageFeature {
  constructor(name, featurPoints) {
    this.name = name || 'Unknown';
    this.featurPoints = featurPoints || [];
  }
  check(img) {
    for (let i = 0; i < this.featurPoints.length; i++) {
      const p = this.featurPoints[i];
      if (!p.check(img)) {
        return false;
      }
      return true;
    }
  }
  print(img) {
    for (let i = 0; i < this.featurPoints.length; i++) {
      const p = this.featurPoints[i];
      p.print(img);
    }
  }
  tap(idx = 0) {
    this.featurPoints[idx].tap(); 
  }
}

class GameInfo {
  constructor() {
    this.hpBarRect = new Rect(122, 30, 412, 51);
    this.mpBarRect = new Rect(122, 58, 412, 72);
    this.expBarRect = new Rect(15, 1069, 1905, 1074);
    this.mapRect = new Rect(384, 217, 1920, 937); // 1536, 720
    this.regionTypeRect = new Rect(1710, 470, 1816, 498);

    this.itemBtns = [
      new Point(810, 960),
      new Point(930, 960),
      new Point(1050, 960),
      new Point(1180, 960),
      new Point(1440, 960),
      new Point(1560, 960),
      new Point(1690, 960),
      new Point(1810, 960),
    ];

    this.mapBtn = new Point(1740, 300);
    this.mapDetailBtn = new Point(700, 160);

    this.menuOnBtn = new PageFeature('menuOn', [
      new FeaturePoint(1844, 56, 245, 245, 241, true),
      new FeaturePoint(1844, 66, 128, 70, 56, true),
      new FeaturePoint(1844, 76, 245, 220, 215, true),
    ]);
    this.menuOffBtn = new PageFeature('menuOff', [
      new FeaturePoint(1850, 56, 146, 136, 109, true),
      new FeaturePoint(1850, 66, 145, 137, 116, true),
      new FeaturePoint(1860, 76, 167, 162, 140, true),
    ]);
    this.autoPlayBtn = new PageFeature('autoPlayOff', [
      new FeaturePoint(1429, 767, 140, 154, 127, true, 60),
      new FeaturePoint(1476, 772, 140, 157, 130, true, 60),
    ]);
    this.selfSkillBtn = new PageFeature('selfSkillOff', [
      new FeaturePoint(1594, 601, 141, 147, 137, true, 60),
      new FeaturePoint(1591, 624, 117, 128, 114, true, 60),
    ]);
    this.attackBtn = new PageFeature('attackOff', [
      new FeaturePoint(1634, 769, 165, 180, 170, true, 60),
    ]);
    this.disconnectBtn = new PageFeature('disconnect', [
      new FeaturePoint(840, 880, 34, 51, 79, true, 20),
      new FeaturePoint(1080, 880, 34, 51, 79, true, 20),
      new FeaturePoint(1170, 880, 31, 20, 14, true, 20),
    ]);
    this.enterBtn = new PageFeature('enter', [
      new FeaturePoint(1480, 990, 31, 47, 70, true, 20),
      new FeaturePoint(1750, 990, 31, 47, 70, true, 20),
      new FeaturePoint(1690, 990, 31, 47, 70, true, 20),
    ]);
  }
}

class RoleState {
  constructor(gi) {
    this.gi = gi;
    this.hp = 0;
    this.mp = 0;
    this.exp = 0;
    this.isDisconnect = false;
    this.isEnter = false;
    this.isMenuOn = false;
    this.isMenuOff = false;
    this.isSafeRegion = false;
    this.isAutoPlay = false;
    this.isAttecking = false;
    this.isSelfSkill = false;
  }

  print() {
    console.log(`hp: ${this.hp}, mp: ${this.mp}, exp: ${this.exp}, isSafe: ${this.isSafeRegion}, auto: ${this.isAutoPlay}, attack: ${this.isAttecking}`);
  }
}

class LineageM {
  constructor(config) {
    this.config = config || {conditions: []};
    this.gi = new GameInfo();
    this.rState = new RoleState(this.gi);

    this._loop = false;
    this._img = 0;

    this.refreshScreen();
    execute(`mkdir ${getStoragePath}/lineageM`);

    saveImage(this._img, getStoragePath() + '/lineageM/currentScreen.png');

    // load images
    this.images = {
      safeRegion: openImage(getStoragePath() + '/lineageM/safeRegionType.png'),
      normalRegion: openImage(getStoragePath() + '/lineageM/normalRegionType.png'),
    };
    this.gi.disconnectBtn.print(this._img);
    this.tmpExp = 0;
    this.isRecordLocation = false;
  }

  safeSleep(t) {
    while(this._loop && t > 0) {
      t-=100;
      sleep(100);
    }
  }

  checkIsSystemPage() {
    if (this.rState.isEnter) {
      console.log('Enter the game, Wait 10 sec');        
      this.gi.enterBtn.tap();
      this.safeSleep(10 * 1000);
      return true;
    }
    if (this.rState.isDisconnect) {
      console.log('Disconnect. Reconnect. Wait 10 sec');
      this.gi.disconnectBtn.tap();
      this.safeSleep(10 * 1000);
      return true;
    }
    if (!this.rState.isMenuOn && !this.rState.isMenuOff) {
      console.log('Unknow State, Wait 5 sec');
      keycode('BACK', 100);
      this.safeSleep(5 * 1000);
      return true;
    }
    return false;
  }

  checkCondiction() {
    for(let i = 0; i < this.config.conditions.length && this._loop; i++) {
      const cd = this.config.conditions[i];
      let value = 0;
      if (cd.type === 'hp') {
        value = this.rState.hp;
      } else if (cd.type === 'mp') {
        value = this.rState.mp;
      } else if (cd.type === 'exp') {
        value = this.rState.exp;
      }
      if (value < 0.1) {
        continue;
      }
      if (cd.type === 'exp') {
        if (this.rState.exp !== this.tmpExp) {
          this.gi.itemBtns[cd.btn].tap();
          console.log(`Use ${cd.btn+1} btn, ${cd.type}, ${cd.op} ${cd.value} (${value})`);
          sleep(200);
        }
      } else if (value * cd.op > cd.value * cd.op) {
        if (cd.btn >= 0 && cd.btn < 8) {
          this.gi.itemBtns[cd.btn].tap();
          console.log(`Use ${cd.btn+1} btn, ${cd.type}, ${cd.op} ${cd.value} (${value})`);
          sleep(200);
        }
      }
    }
  }

  start() { 
    this._loop = true;
    let goBackTime = Date.now();
    while(this._loop) {
      this.safeSleep(2000);
      this.refreshScreen();
      this.updateGlobalState();
      if (this.checkIsSystemPage()) {
        continue;
      }
      if (this.rState.isMenuOn) {
        console.log('Hide Menu');
        this.gi.menuOnBtn.tap();
        continue;
      }
      if (!this.rState.isAutoPlay) {
        console.log('Click AutoPlay');
        this.gi.autoPlayBtn.tap();
        continue;
      }
      if (this.rState.isSafeRegion) {
        console.log('In safe region');
        if (this.config.inHomeUseBtn >= 0 && this.config.inHomeUseBtn < 8) {
          this.gi.itemBtns[this.config.inHomeUseBtn].tap();
        }
        continue;
      }
      if (this.config.goBack && !this.isRecordLocation) {
        console.log('Record current location');
        this.goToMapPage();
        this.recordCurrentLocation();
        this.gi.menuOnBtn.tap();
        this.isRecordLocation = true;
        continue;
      }
      console.log('Check conditions');
      this.checkCondiction();
      if (this.config.goBack && Date.now() - goBackTime > 60 * 1000) {
        console.log('Go back location');
        this.goToMapPage();
        const diffXY = this.findDiffRecordLocation();
        // TODO go back to origin location
        console.log(JSON.stringify(diffXY));
        goBackTime = Date.now();
      }
    }
  }

  waitForChangeScreen(score = 0.8) {
    const oriImg = clone(this._img);
    for(let i = 0; i < 20 && this._loop; i++) {
      sleep(500);
      this.refreshScreen();
      const s = getIdentityScore(this._img, oriImg);
      if (s < score) {
        break;
      }
    }
    releaseImage(oriImg);
  }

  goToMapPage() {
    this.gi.mapBtn.tap();
    this.waitForChangeScreen();
    // this.gi.mapDetailBtn.tap();
    // this.waitForChangeScreen();
    console.log('In Map Page');
  }

  stop() {
    this._loop = false;
    sleep(2000);
    releaseImage(this._img);
    for (let k in this.images) {
      releaseImage(this.images[k]);
    }
  }

  // utils
  cropAndSave(filename, rect) {
    const img = rect.crop(this._img);
    saveImage(img, `${getStoragePath()}/lineageM/${filename}`);
    releaseImage(img);
  }

  // globalState
  isSafeRegionState() {
    const img = this.gi.regionTypeRect.crop(this._img);
    const safeScore = getIdentityScore(img, this.images.safeRegion);
    const normalScore = getIdentityScore(img, this.images.normalRegion);
    releaseImage(img);
    if (safeScore > normalScore) {
      return true;
    }
    return false;
  }

  updateGlobalState() {
    this.rState.isDisconnect = this.gi.disconnectBtn.check(this._img);
    this.rState.isEnter = this.gi.enterBtn.check(this._img);
    if (this.rState.isDisconnect || this.rState.isEnter) {
      return;
    }
    this.rState.isMenuOn = this.gi.menuOnBtn.check(this._img);
    this.rState.isMenuOff = this.gi.menuOffBtn.check(this._img);
    console.log(this.rState.isMenuOn, this.rState.isMenuOff);
    if (!this.rState.isMenuOn && !this.rState.isMenuOff) {
      return;
    }
    if (this.rState.isMenuOn) {
      return;
    }
    this.rState.hp = this.getHpPercent();
    this.rState.mp = this.getMpPercent();
    this.rState.exp = this.getExpPercent();
    this.rState.isSafeRegion = this.isSafeRegionState();
    this.rState.isAttecking = !this.gi.attackBtn.check(this._img);
    this.rState.isSelfSkill = !this.gi.selfSkillBtn.check(this._img);
    if (this.rState.isAttecking) {
      this.rState.isAutoPlay = true;
    } else {
      this.rState.isAutoPlay = !this.gi.autoPlayBtn.check(this._img);
      if (!this.rState.isAutoPlay) {
        sleep(200);
        this.refreshScreen();
        this.rState.isAutoPlay = !this.gi.autoPlayBtn.check(this._img);
      }
    }
    this.rState.print();
  }

  refreshScreen() {
    if (this._img !== 0) {
      releaseImage(this._img);
      this._img = 0;
    }
    this._img = getScreenshotModify(0, 0, this.gi.screenWidth, this.gi.screenHeight, this.gi.targetWidth, this.gi.tragetHeight, 95);
    return this._img;
  }

  // HP MP EXP
  getHpPercent() {
    return this.getBarPercent(this.gi.hpBarRect);
  }

  getMpPercent() {
    return this.getBarPercent(this.gi.mpBarRect);
  }

  getExpPercent() {
    return this.getBarPercent(this.gi.expBarRect);
  }

  getBarPercent(barRect) {
    const bar = cropImage(this._img, barRect.tx, barRect.ty, barRect.tw, barRect.th);
    const y1 = barRect.th / 3;
    const y2 = barRect.th / 3 * 2;
    let noCount = 0;
    let noX = barRect.tw;
    for(let x = 0; x < barRect.tw; x += 1) {
      const c = Utils.mergeColor(getImageColor(bar, x, y1), getImageColor(bar, x, y2));getImageColor(bar, x, y1);
      const d = Utils.minMaxDiff(c);
      if (d < 60) {
        noCount++
        if (noCount === 2) {
          noX = x - 1;
          break;
        }
      } else {
        noCount = 0;
      }
    }
    releaseImage(bar);
    const percent = (noX / barRect.tw * 100).toFixed(1);
    return percent;
  }

  // MAP
  recordCurrentLocation() {
    const p = new Point(768, 360);
    const rect1 = new Rect(p.x - 120, p.y - 90, p.x - 30, p.y - 30); // left top
    const rect2 = new Rect(p.x + 30, p.y - 90, p.x + 120, p.y - 30); // right top
    const rect3 = new Rect(p.x - 120, p.y + 30, p.x - 30, p.y + 90); // left bottom
    const rect4 = new Rect(p.x + 30, p.y + 30, p.x + 120, p.y + 90); // right bottom
    const img1 = cropImage(this._img, rect1.tx, rect1.ty, rect1.tw, rect1.th);
    const img2 = cropImage(this._img, rect2.tx, rect2.ty, rect2.tw, rect2.th);
    const img3 = cropImage(this._img, rect3.tx, rect3.ty, rect3.tw, rect3.th);
    const img4 = cropImage(this._img, rect4.tx, rect4.ty, rect4.tw, rect4.th);
    saveImage(img1, getStoragePath() + '/lineageM/mapRecord1.png');
    saveImage(img2, getStoragePath() + '/lineageM/mapRecord2.png');
    saveImage(img3, getStoragePath() + '/lineageM/mapRecord3.png');
    saveImage(img4, getStoragePath() + '/lineageM/mapRecord4.png');
    releaseImage(img1); releaseImage(img2); releaseImage(img3); releaseImage(img4);
  }

  getDiffRecordLocation() {
    let result = undefined;
    for (let i = 0; i < 3; i++) {
      result = this.findDiffRecordLocation();
      if (result !== undefined) {
        break;
      }
      sleep(1000);
      this.refreshScreen();
    }
    if (result === undefined) {
      console.log('Error can not find record location');
      return;
    }
    
  }

  findDiffRecordLocation() {
    const p = new Point(768, 360);
    const images = [
      openImage(getStoragePath() + '/lineageM/mapRecord1.png'),
      openImage(getStoragePath() + '/lineageM/mapRecord2.png'),
      openImage(getStoragePath() + '/lineageM/mapRecord3.png'),
      openImage(getStoragePath() + '/lineageM/mapRecord4.png'),
    ];
    const findXYs = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i] === 0) {
        console.log('Error not record map location');
        return;
      }
      const xy = findImage(this._img, images[i]);
      switch(i) {
        case 0:
          xy.x = p.x - (xy.x / gRatioTarget) - 120;
          xy.y = p.y - (xy.y / gRatioTarget) - 90;
        break;
        case 1:
          xy.x = p.x - (xy.x / gRatioTarget) + 30;
          xy.y = p.y - (xy.y / gRatioTarget) - 90;
        break;
        case 2:
          xy.x = p.x - (xy.x / gRatioTarget) - 120;
          xy.y = p.y - (xy.y / gRatioTarget) + 30;
        break;
        case 3:
          xy.x = p.x - (xy.x / gRatioTarget) + 30;
          xy.y = p.y - (xy.y / gRatioTarget) + 30;
        break;
      }
      findXYs.push(xy);
      releaseImage(images[i]);
    }
    let finalXY = undefined;
    for (let i = 0; i < findXYs.length; i++) {
      let count = 0;
      for (let j = 0; j < findXYs.length; j++) {
        if (Math.abs(findXYs[i].x - findXYs[j].x) < 30 && Math.abs(findXYs[i].y - findXYs[j].y) < 30) {
          count++;
        }
      }
      if (count > 1) {
        finalXY = findXYs[i];
      }
    }
    if (finalXY !== undefined) {
      // console.log(JSON.stringify(findXYs));
      console.log('find location diff', finalXY.x, finalXY.y);
    }
    return finalXY;
  }
}

const DefaultConfig = {
  conditions: [
    {type: 'hp', op: -1, value: 30, btn: 3, delay: 0}, // if hp < 25% use 4th button, like 回卷
    {type: 'hp', op: -1, value: 40, btn: 2, delay: 0}, // if hp < 40% use 3th button, like 瞬移
    {type: 'hp', op: -1, value: 75, btn: 1, delay: 0}, // if hp < 75% use 2th button, like 高治
    {type: 'mp', op: -1, value: 70, btn: 0, delay: 0}, // if mp < 70% use 1th button, like 魂體
    {type: 'mp', op:  1, value: 80, btn: 4, delay: 0}, // if mp > 80% use 5th button, like 三重矢, 光箭, 火球等
  ],
  inHomeUseBtn: -1, // if in safe region use 3th button, like 瞬移. -1 = disable
  goBack: true, // whether to go back to origin location, check location every 5 min 
};

let lm = undefined;

function start(config) {
  if (lm !== undefined) {
    return;
  }
  lm = new LineageM(config);
  console.log('START');
  lm.start();
  lm.stop();
  console.log('STOP');
}

function stop() {
  if (lm == undefined) {
    return;
  }
  lm._loop = false;
}

start(DefaultConfig);
// lm = new LineageM();
// lm._loop=true;
// lm.goToMapPage();
// const hp = lm.getHpPercent();
// const mp = lm.getMpPercent();
// const exp = lm.getExpPercent();
// console.log(hp, mp, exp);
// lm.recordCurrentLocation();
// lm.getDiffRecordLocation();
// lm.cropAndSave('safeRegionType.png', lm.gi.regionTypeRect);
// lm.updateGlobalState();
// lm.stop();