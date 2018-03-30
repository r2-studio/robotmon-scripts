// == Global variables start
// -- screen info
const _wh = getScreenSize();
const gDevWidth = 1920;
const gDevHeight = 1080;
const gTargetWidth = 960;
const gTargetHeight = 540;
const gDeviceWidth = Math.max(_wh.width, _wh.height);
const gDeviceHeight = Math.min(_wh.width, _wh.height);
let gGameWidth = gDeviceWidth;
let gGameHeight = gDeviceHeight;
let gGameOffsetX = 0;
let gGameOffsetY = 0;
if (gDeviceWidth / gDeviceHeight > 1.78) {
  gGameWidth = Math.round(gGameHeight * 1.777778);
  gGameOffsetX = (gDeviceWidth - gGameWidth) / 2;
} else if (gDeviceWidth / gDeviceHeight < 1.77) {
  gGameHeight = Math.round(gGameWidth / 1.777778);
  gGameOffsetY = (gDeviceHeight - gGameHeight) / 2;
}
const gRatioTarget = gTargetWidth / gDevWidth;
const gRatioDevice = gGameWidth / gDevWidth;
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
  static targetToDevice(xy) {
    const r = gRatioDevice / gRatioTarget;
    return {x: gGameOffsetX + xy.x * r, y: gGameOffsetY + xy.y * r};
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
    this.dx = gGameOffsetX + this.x * gRatioDevice;
    this.dy = gGameOffsetY + this.y * gRatioDevice;
  }
  tap(times = 1, delay = 0) {
    while(times > 0) {
      if (delay > 0) {
        sleep(delay);
      }
      tap(this.dx, this.dy, 20);
      times--;
    }
  }
  tapDown() {
    tapDown(this.dx, this.dy, 20);
  }
  tapUp() {
    tapUp(this.dx, this.dy, 20);
  }
  moveTo() {
    moveTo(this.dx, this.dy, 20);
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
    console.log('target', this.tx, this.ty, 'param', `${this.x}, ${this.y}, ${c.r}, ${c.g}, ${c.b}, true`);
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
    this.expBarRect = new Rect(16, 1070, 1904, 1072);
    this.zeroRect = new Rect(0, 0, 1, 1);
    this.mapRect = new Rect(384, 217, 1920, 937); // 1536, 720
    this.regionTypeRect = new Rect(1710, 470, 1816, 498);
    this.storeHpRect = new Rect(94, 276, 194, 376);

    this.storeMode = new Point(250, 970);
    this.store10 = new Point(670, 970);
    this.store100 = new Point(900, 970);
    this.store1000 = new Point(1100, 970);
    this.storeMax = new Point(1300, 970);
    this.storeHp = new Point(150, 330);
    this.storeArrow = new Point(400, 820);
    this.storeBuy = new Point(1600, 970);
    this.storeBuy2 = new Point(1130, 882);

    this.itemBtns = [
      new Point(810, 960),
      new Point(930, 960),
      new Point(1050, 960),
      new Point(1180, 960),
      new Point(1440, 960),
      new Point(1560, 960),
      new Point(1690, 960),
      new Point(1810, 960),
      new Point(1310, 960), // special skills
    ];

    this.unknownBtn = new Point(1100, 800);

    this.mapBtn = new Point(1740, 300);
    this.mapDetailBtn = new Point(700, 160);
    this.mapController = new Point(290, 860);
    this.mapControllerL = new Point(190, 860);
    this.mapControllerR = new Point(390, 860);
    this.mapControllerT = new Point(290, 760);
    this.mapControllerB = new Point(290, 960);

    this.menuOnBtn = new PageFeature('menuOn', [
      new FeaturePoint(1844, 56, 245, 245, 241, true, 30),
      new FeaturePoint(1844, 66, 128, 70, 56, true, 30),
      new FeaturePoint(1844, 76, 245, 220, 215, true, 30),
    ]);
    this.menuOffBtn = new PageFeature('menuOff', [
      new FeaturePoint(1850, 56, 173, 166, 147, true, 80),
      new FeaturePoint(1850, 66, 173, 166, 147, true, 80),
      new FeaturePoint(1860, 76, 173, 166, 147, true, 80),
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
    this.beAttacked = new PageFeature('beAttacked', [
      new FeaturePoint(1616, 744, 210, 90, 50, true, 60),
      new FeaturePoint(1676, 744, 210, 90, 50, true, 60),
      new FeaturePoint(1666, 756, 210, 90, 50, true, 60),
      new FeaturePoint(1624, 750, 210, 90, 50, true, 60),
      new FeaturePoint(1800, 818, 240, 160, 140, true, 30),
      new FeaturePoint(1634, 769, 165, 180, 170, false, 50),
    ]);
    this.storeExceed = new PageFeature('storeExceed', [
      new FeaturePoint(1102, 812, 33, 23, 0, true, 40),
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
    this.isAttecked = false;
  }

  print() {
    console.log(`hp: ${this.hp}, mp: ${this.mp}, exp: ${this.exp}`);
  }
}

class LineageM {
  constructor(config) {
    this.config = config || {conditions: []};
    this.gi = new GameInfo();
    this.rState = new RoleState(this.gi);
    this.localPath = getStoragePath() + `/scripts/com.r2studio.LineageM/images`
    this._loop = false;
    this._img = 0;

    this.refreshScreen();

    // load images
    this.images = {
      safeRegion: openImage(`${this.localPath}/safeRegionType.png`),
      normalRegion: openImage(`${this.localPath}/normalRegionType.png`),
      hpWater: openImage(`${this.localPath}/hp.png`),
      store: openImage(`${this.localPath}/store.png`),
    };
    // this.gi.disconnectBtn.print(this._img);
    this.tmpExp = 0;
    this.isRecordLocation = false;
  }

  safeSleep(t) {
    while(this._loop && t > 0) {
      t-=100;
      sleep(100);
    }
  }

  loadNumberImages() {}

  getImageNumber(img, numbers, maxLength = 8) {
    if (numbers.length != 10) {
      console.log('Error number length should be 10');
      return 0;
    }
    let results = [];
    for (let i = 0; i < 10; i++) {
      const nImg = numbers[i];
      if (nImg == 0) {
        console.log('Error number image is empty');
        return 0;
      }
      const rs = findImages(img, nImg, 0.95, maxLength, true);
      for (let k in rs) {
        rs[k].number = i;
        results.push(rs[k]);
      }
    }
    results.sort((a, b) => {return b.score - a.score;});
    results = results.slice(0, Math.min(maxLength, results.length));
    results.sort((a, b) => {return a.x - b.x;});
    const numberSize = getImageSize(numbers[0]);
    const nw = numberSize.width;
    const imgSize = getImageSize(img);
    const iw = imgSize.width;
    let px = 0;
    let numberStr = '';
    for(let i in results) {
      const r = results[i];
      if (r.x > p) {
        numberStr += r.number.toString();
        p = r.x - 2;
      }
    }
    console.log('number', numberStr);
    return numberStr;
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
      if (cd.useTime === undefined) {
        cd.useTime = 0;
      }
      if (Date.now() - cd.useTime < cd.interval) {
        continue;
      }
      let value = this.rState[cd.type];
      if (value < 0.1) {
        continue;
      }
      if (cd.type === 'exp') {
        if (this.rState.exp !== this.tmpExp) {
          this.gi.itemBtns[cd.btn].tap(1, 100);
          console.log(`Use ${cd.btn+1} btn, ${cd.type}, ${cd.op} ${cd.value} (${value})`);
          cd.useTime = Date.now();
          this.safeSleep(700);
        }
      } else if (value * cd.op > cd.value * cd.op) {
        if (cd.btn >= 0 && cd.btn < this.gi.itemBtns.length) {
          this.gi.itemBtns[cd.btn].tap(1, 100);
          console.log(`Use ${cd.btn+1} btn, ${cd.type}, ${cd.op} ${cd.value} (${value})`);
          cd.useTime = Date.now();
          this.safeSleep(700);
        }
      }
    }
  }

  start() { 
    this._loop = true;
    let goBackTime = Date.now();
    let useHomeTime = Date.now();
    let isBuy = false;
    while(this._loop) {
      this.safeSleep(200);
      this.refreshScreen();

      if (this.config.beAttackedRandTeleport && this.gi.beAttacked.check(this._img)) {
        const c = getImageColor(this._img, this.gi.zeroRect.tx, this.gi.zeroRect.ty);
        if (c.r > c.g + c.b) {
          // rand teleport (7th btn)
          console.log('Warning!! You Are Attacked!!');
          this.gi.itemBtns[6].tap();
          this.safeSleep(2500);
          continue;
        }
      }
      
      this.updateGlobalState();
      if (this.checkIsSystemPage()) {
        continue;
      }
      if (this.rState.isMenuOn) {
        console.log('Hide Menu');
        this.gi.menuOnBtn.tap();
        continue;
      }
      // console.log('Check conditions');
      this.checkCondiction();

      // go home (8th btn), rand teleport (7th btn)
      if (this.rState.isSafeRegion) {
        if (!isBuy && (this.config.autoBuyHp !== 0 || this.config.autoBuyArrow !== 0)) {
          this.checkAndBuyItems();
          isBuy = true;
        } else if (this.config.inHomeUseBtn && Date.now() - useHomeTime > 6000) {
          this.gi.itemBtns[6].tap();
          useHomeTime = Date.now();
        }
      } else {
        isBuy = false;
        if (this.config.dangerousGoHome && this.rState.hp < 25 && this.rState.hp > 0.1) {
          this.gi.itemBtns[7].tap(1, 100);
          console.log('Dangerous, go home, use btn 8th');
          continue;
        }
        if (!this.rState.isAutoPlay) {
          console.log('Click AutoPlay');
          this.gi.autoPlayBtn.tap();
          continue;
        }
      }

      if (this.rState.isSafeRegion) {
        console.log('In safe region');
        continue;
      }

      if (this.config.goBackInterval != 0 && !this.isRecordLocation) {
        console.log('Record current location');
        this.goToMapPage();
        this.recordCurrentLocation();
        this.gi.menuOnBtn.tap();
        this.isRecordLocation = true;
        continue;
      }
      
      // go back to record location
      if (this.config.goBackInterval != 0 && Date.now() - goBackTime > this.config.goBackInterval) {
        console.log('Go back location');
        this.goToMapPage();
        const diffXY = this.getDiffRecordLocation();
        this.gi.menuOnBtn.tap();
        sleep(1000);
        console.log(JSON.stringify(diffXY));
        if (diffXY !== undefined) {
          this.goMap(-diffXY.x, -diffXY.y);
        }
        goBackTime = Date.now();
      }
    }
  }

  waitForChangeScreen(score = 0.8, maxSleep = 10000) {
    const oriImg = clone(this._img);
    for(let i = 0; i < (maxSleep/500) && this._loop; i++) {
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
    this.gi.mapDetailBtn.tap();
    this.waitForChangeScreen(0.8, 2000);
    console.log('In Map Page');
  }

  stop() {
    this._loop = false;
    releaseImage(this._img);
    for (let k in this.images) {
      releaseImage(this.images[k]);
    }
  }

  checkAndBuyItems(tryTimes = 3) {
    console.log('Try to buy items');
    for (let i = 0; i < tryTimes && this._loop; i++) {
      if (this.findStore()) {  
        this.buyItems();
        break;
      } else if (i < tryTimes - 1) {
        console.log('Can not found store, try again');
        this.gi.itemBtns[7].tap();
        this.safeSleep(4000);
        this.refreshScreen();
      }
    }
  }

  findStore() {
    const stores = findImages(this._img, this.images.store, 0.95, 4, true);
    for (let k in stores) {
      if (!this._loop) {return false;}
      this.refreshScreen();
      const dXY = Utils.targetToDevice(stores[k]);
      tap(dXY.x + 5, dXY.y + 5, 50);
      this.waitForChangeScreen();if (!this._loop) {return false;}
      this.gi.storeMode.tap();
      this.safeSleep(500);if (!this._loop) {return false;}
      this.refreshScreen();
      const testHpImg = this.gi.storeHpRect.crop(this._img);
      const s = getIdentityScore(this.images.hpWater, testHpImg);
      console.log(s);
      releaseImage(testHpImg);
      if (s > 0.9) {
        console.log('Store Found');
        return true;
      }
      this.gi.menuOnBtn.tap();
      this.safeSleep(1000);
      continue;
    }
    return false;
  }

  buyItems() {
    if (this.config.autoBuyHp > 0) {
      this.gi.storeHp.tap();
      this.gi.store100.tap(Math.min(this.config.autoBuyHp, 10), 200);
    }
    sleep(500);if (!this._loop) {return false;}
    if (this.config.autoBuyArrow > 0) {
      this.gi.storeArrow.tap();
      this.gi.store1000.tap(Math.min(this.config.autoBuyArrow, 10), 200);
    }
    sleep(500);if (!this._loop) {return false;}
    if (this.config.autoBuyHp === -1) {
      this.gi.storeHp.tap();
      this.gi.storeMax.tap();
    }
    sleep(500);if (!this._loop) {return false;}
    if (this.config.autoBuyArrow === -1) {
      this.gi.storeArrow.tap();
      this.gi.storeMax.tap();
    }
    this.safeSleep(500);if (!this._loop) {return false;}
    this.refreshScreen();if (!this._loop) {return false;}
    if (this.gi.storeExceed.check(this._img)) {
      console.log('Buy Items');
      this.safeSleep(500);if (!this._loop) {return false;}
      this.gi.storeBuy.tap();
      this.safeSleep(500);if (!this._loop) {return false;}
      this.gi.storeBuy2.tap();
      this.safeSleep(1000);if (!this._loop) {return false;}
      this.gi.menuOnBtn.tap();
      return true;
    }
    console.log('Exceed weight, not to buy');
    this.gi.menuOnBtn.tap();
    return true;
  }

  // utils
  cropAndSave(filename, rect) {
    const img = rect.crop(this._img);
    saveImage(img, `${this.localPath}/lineageM/${filename}`);
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
    // console.log(this.rState.isMenuOn, this.rState.isMenuOff);
    if (!this.rState.isMenuOn && !this.rState.isMenuOff) {
      return;
    }
    if (this.rState.isMenuOn) {
      return;
    }
    this.rState.hp = this.getHpPercent();
    if (this.rState.hp < 25 && this.rState.hp > 0.1) {
      sleep(300);
      this.refreshScreen();
      this.rState.hp = this.getHpPercent();
    }
    this.rState.mp = this.getMpPercent();
    this.rState.exp = this.getExpPercent();
    this.rState.isSafeRegion = this.isSafeRegionState();
    this.rState.isAttecking = !this.gi.attackBtn.check(this._img);
    this.rState.isSelfSkill = !this.gi.selfSkillBtn.check(this._img);
    if (this.rState.isAttecking) {
      this.rState.isAutoPlay = true;
    } else {
      this.rState.isAutoPlay = !this.gi.autoPlayBtn.check(this._img);
    }
    this.rState.print();
  }

  refreshScreen() {
    if (this._img !== 0) {
      releaseImage(this._img);
      this._img = 0;
    }
    this._img = getScreenshotModify(gGameOffsetX, gGameOffsetY, gGameWidth, gGameHeight, gTargetWidth, gTargetHeight, 80);
    return this._img;
  }

  // HP MP EXP
  getHpPercent() {
    return this.getBarPercent(this.gi.hpBarRect, 70, 15);
  }

  getMpPercent() {
    return this.getBarPercent(this.gi.mpBarRect, 70, 70);
  }

  getExpPercent() {
    return this.getBarPercent(this.gi.expBarRect, 70, 70);
  }

  getBarPercent(barRect, b1, b2) {
    const bar = cropImage(this._img, barRect.tx, barRect.ty, barRect.tw, barRect.th);
    const fc = Utils.mergeColor(getImageColor(bar, 0, y1), getImageColor(bar, 0, y2));
    const y1 = barRect.th / 3;
    const y2 = barRect.th / 3 * 2;
    let bright1 = 0;
    let bright2 = 0;
    for(let x = 0; x < barRect.tw; x += 1) {
      const c = Utils.mergeColor(getImageColor(bar, x, y1), getImageColor(bar, x, y2));
      const d = Utils.minMaxDiff(c);
      if (d > b1) {
        bright1++;
      }
      if (d > b2) {
        bright2++;
      }
    }
    releaseImage(bar);
    if (fc.g - fc.r > 10) {
      // console.log('Use second limit', b2, JSON.stringify(fc));
      return (bright2 / barRect.tw * 100).toFixed(1);
    } else {
      return (bright1 / barRect.tw * 100).toFixed(1);
    }
  }

  // MAP
  goMap(disX, disY) {
    const max = 20000;
    if (Math.abs(disX) < 30 && Math.abs(disY) < 30) {
      return;
    }
    let timeL = 3000; let timeR = 3000; let timeT = 3000; let timeB = 3000;
    if (disX >= 0 && disX > 30) {
      timeR += Math.min((1600 * Math.abs(disX) / 10), max);
    } else if (disX < 0 && disX < -30) {
      timeL += Math.min((1600 * Math.abs(disX) / 10), max);
    }
    if (disY >= 0 && disY > 30) {
      timeB += Math.min((1600 * Math.abs(disY) / 10), max);
    } else if (disY < 0 && disY < -30) {
      timeT += Math.min((1600 * Math.abs(disY) / 10), max);
    }
    const times = Math.ceil((timeL + timeR + timeT + timeB) / 24000);
    console.log('Left', timeL, 'Right', timeR, 'Up', timeT, 'Down', timeB, times);
    const tl = Math.ceil(timeL / times);
    const tr = Math.ceil(timeR / times);
    const tt = Math.ceil(timeT / times);
    const tb = Math.ceil(timeB / times);
    this.gi.mapController.tapDown();
    for(let t = 0; t < times && this._loop; t++) {
      if (timeL > 100) {
        console.log('Move Left', tl);
        this.gi.mapControllerL.moveTo();
        this.gi.mapControllerL.moveTo();
        this.safeSleep(tl);
        timeL -= tl;
      }
      if (timeT > 100) {
        console.log('Move Up', tt);
        this.gi.mapControllerT.moveTo();
        this.gi.mapControllerT.moveTo();
        this.safeSleep(tt);
        timeT -= tt;
      }
      if (timeR > 100) {
        console.log('Move Right', tr);
        this.gi.mapControllerR.moveTo();
        this.gi.mapControllerR.moveTo();
        this.safeSleep(tr);
        timeR -= tr;
      }
      if (timeB > 100) {
        console.log('Move Down', tb);
        this.gi.mapControllerB.moveTo();
        this.gi.mapControllerB.moveTo();
        this.safeSleep(tb);
        timeB -= tb;
      }
    }
    this.gi.mapController.tapUp();
  }

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
    saveImage(img1, this.localPath + '/mapRecord1.png');
    saveImage(img2, this.localPath + '/mapRecord2.png');
    saveImage(img3, this.localPath + '/mapRecord3.png');
    saveImage(img4, this.localPath + '/mapRecord4.png');
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
      return {x: 0, y: 0};
    }
    return result;
  }

  findDiffRecordLocation() {
    const p = new Point(768, 360);
    const images = [
      openImage(this.localPath + '/mapRecord1.png'),
      openImage(this.localPath + '/mapRecord2.png'),
      openImage(this.localPath + '/mapRecord3.png'),
      openImage(this.localPath + '/mapRecord4.png'),
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
    // {type: 'hp', op: -1, value: 60, btn: 6, interval: 5000}, // if hp < 60% use 3th button, like 瞬移
    // {type: 'hp', op: -1, value: 30, btn: 7, interval: 10000}, // if hp < 30% use 8th button, like 回卷
    // {type: 'hp', op: -1, value: 75, btn: 3, interval: 2000}, // if hp < 75% use 4th button, like 高治
    // {type: 'mp', op: -1, value: 70, btn: 4, interval: 2000}, // if mp < 70% use 5th button, like 魂體
    // {type: 'mp', op:  1, value: 50, btn: 1, interval: 8000}, // if mp > 80% use th button, like 三重矢, 光箭, 火球等
  ],
  inHomeUseBtn: false, // if in safe region use 3th button, like 瞬移.
  dangerousGoHome: true, // if hp < 25%, go home, use button 8th
  goBackInterval: 0, // whether to go back to origin location, check location every n min
  beAttackedRandTeleport: true,
  autoBuyHp: 1, // 1 * 100, -1 => max
  autoBuyArrow: 0, // 1 * 1000, -1 => max
};

let lm = undefined;

function start(config) {
  console.log('START');
  if (typeof config === 'string') {
    config = JSON.parse(config);
  }
  if (lm !== undefined) {
    console.log('Already Started');
    return;
  }
  lm = new LineageM(config);
  lm.start();
  lm.stop();
  lm = undefined;
  console.log('STOP');
}

function stop() {
  if (lm == undefined) {
    return;
  }
  lm._loop = false;
  console.log('Stopping...');
}

// start(DefaultConfig);
// lm = new LineageM(DefaultConfig);
// lm._loop=true;
// for (let i = 0; i < 5; i++) {
//   const hp = lm.getHpPercent();
//   // const mp = lm.getMpPercent();
//   // const exp = lm.getExpPercent();
//   lm.refreshScreen();
//   console.log(hp);
// } 

// lm.checkAndBuyItems(1);
// lm.goToMapPage();
// const hp = lm.getHpPercent();
// const mp = lm.getMpPercent();
// const exp = lm.getExpPercent();
// console.log(hp, mp, exp);
// lm.goToMapPage();
// lm._loop = true;
// lm.recordCurrentLocation();
// var xy = lm.getDiffRecordLocation();
// lm.gi.menuOnBtn.tap();
// sleep(1000);
// lm.goMap(-xy.x, -xy.y);
// lm.cropAndSave('safeRegionType.png', lm.gi.regionTypeRect);
// lm.updateGlobalState();
// lm.stop();