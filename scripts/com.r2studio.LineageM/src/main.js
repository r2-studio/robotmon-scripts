const ZeroColor = {r: 0, g: 0, b: 0};
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
}
class Rect {
  constructor(ratio, x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.w = x2 - x1;
    this.h = y2 - y1;
    this._r = ratio;
  }
  get tx() { return this.x1 * this._r; }
  get ty() { return this.y1 * this._r; }
  get tw() { return (this.x2 - this.x1) * this._r; }
  get th() { return (this.y2 - this.y1) * this._r; }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class GameInfo {
  constructor() {
    const wh = getScreenSize();
    this.screenWidth = wh.width;
    this.screenHeight = wh.height;
    this.devWidth = 1920;
    this.devHeight = 1080;
    this.targetWidth = 960;
    this.tragetHeight = 540;
    this.ratio = this.targetWidth / this.devWidth;
    this.hpBarRect = new Rect(this.ratio, 122, 30, 412, 51);
    this.mpBarRect = new Rect(this.ratio, 122, 58, 412, 72);
    this.expBarRect = new Rect(this.ratio, 15, 1069, 1905, 1074);
    this.mapRect = new Rect(this.ratio, 384, 217, 1920, 937); // 1536, 720
  }
}

class LineageM {
  constructor() {
    this.gi = new GameInfo();

    this._img = 0;

    this.refreshScreen();
    execute(`mkdir ${getStoragePath}/lineageM`);
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
    const rect1 = new Rect(this.gi.ratio, p.x - 120, p.y - 90, p.x - 30, p.y - 30); // left top
    const rect2 = new Rect(this.gi.ratio, p.x + 30, p.y - 90, p.x + 120, p.y - 30); // right top
    const rect3 = new Rect(this.gi.ratio, p.x - 120, p.y + 30, p.x - 30, p.y + 90); // left bottom
    const rect4 = new Rect(this.gi.ratio, p.x + 30, p.y + 30, p.x + 120, p.y + 90); // right bottom
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
          xy.x = p.x - (xy.x / this.gi.ratio) - 120;
          xy.y = p.y - (xy.y / this.gi.ratio) - 90;
        break;
        case 1:
          xy.x = p.x - (xy.x / this.gi.ratio) + 30;
          xy.y = p.y - (xy.y / this.gi.ratio) - 90;
        break;
        case 2:
          xy.x = p.x - (xy.x / this.gi.ratio) - 120;
          xy.y = p.y - (xy.y / this.gi.ratio) + 30;
        break;
        case 3:
          xy.x = p.x - (xy.x / this.gi.ratio) + 30;
          xy.y = p.y - (xy.y / this.gi.ratio) + 30;
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

const lm = new LineageM();
// const hp = lm.getHpPercent();
// const mp = lm.getMpPercent();
// const exp = lm.getExpPercent();
// console.log(hp, mp, exp);
// lm.recordCurrentLocation();
lm.getDiffRecordLocation();