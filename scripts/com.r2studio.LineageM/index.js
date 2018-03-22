'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// == Global variables start
// -- screen info
var _wh = getScreenSize();
var gDevWidth = 1920;
var gDevHeight = 1080;
var gTargetWidth = 960;
var gTargetHeight = 540;
var gDeviceWidth = Math.max(_wh.width, _wh.height);
var gDeviceHeight = Math.min(_wh.width, _wh.height);
var gRatioTarget = gTargetWidth / gDevWidth;
var gRatioDevice = gDeviceWidth / gDevWidth;
// -- others
var gZeroColor = { r: 0, g: 0, b: 0 };
// == Global variables en

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'nearColor',
    value: function nearColor(c, c1, c2) {
      var d1 = Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
      var d2 = Math.abs(c2.r - c.r) + Math.abs(c2.g - c.g) + Math.abs(c2.b - c.b);
      return d1 - d2;
    }
  }, {
    key: 'mergeColor',
    value: function mergeColor(c1, c2) {
      return {
        r: Math.round((c1.r + c2.r) / 2),
        g: Math.round((c1.g + c2.g) / 2),
        b: Math.round((c1.b + c2.b) / 2)
      };
    }
  }, {
    key: 'diffColor',
    value: function diffColor(c, c1) {
      return Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
    }
  }, {
    key: 'minMaxDiff',
    value: function minMaxDiff(c) {
      var max = Math.max(Math.max(c.r, c.g), c.b);
      var min = Math.min(Math.min(c.r, c.g), c.b);
      return max - min;
    }
  }, {
    key: 'isSameColor',
    value: function isSameColor(c1, c2) {
      var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;

      if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
        return true;
      }
      return false;
    }
  }]);

  return Utils;
}();

var Rect = function () {
  function Rect(x1, y1, x2, y2) {
    _classCallCheck(this, Rect);

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

  _createClass(Rect, [{
    key: 'crop',
    value: function crop(img) {
      return cropImage(img, this.tx, this.ty, this.tw, this.th);
    }
  }]);

  return Rect;
}();

var Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
    this.tx = this.x * gRatioTarget;
    this.ty = this.y * gRatioTarget;
    this.dx = this.x * gRatioDevice;
    this.dy = this.y * gRatioDevice;
  }

  _createClass(Point, [{
    key: 'tap',
    value: function (_tap) {
      function tap() {
        return _tap.apply(this, arguments);
      }

      tap.toString = function () {
        return _tap.toString();
      };

      return tap;
    }(function () {
      var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      while (times > 0) {
        if (delay > 0) {
          sleep(delay);
        }
        tap(this.dx, this.dy, 20);
        times--;
      }
    })
  }, {
    key: 'tapDown',
    value: function (_tapDown) {
      function tapDown() {
        return _tapDown.apply(this, arguments);
      }

      tapDown.toString = function () {
        return _tapDown.toString();
      };

      return tapDown;
    }(function () {
      tapDown(this.dx, this.dy, 20);
    })
  }, {
    key: 'tapUp',
    value: function (_tapUp) {
      function tapUp() {
        return _tapUp.apply(this, arguments);
      }

      tapUp.toString = function () {
        return _tapUp.toString();
      };

      return tapUp;
    }(function () {
      tapUp(this.dx, this.dy, 20);
    })
  }, {
    key: 'moveTo',
    value: function (_moveTo) {
      function moveTo() {
        return _moveTo.apply(this, arguments);
      }

      moveTo.toString = function () {
        return _moveTo.toString();
      };

      return moveTo;
    }(function () {
      moveTo(this.dx, this.dy, 20);
    })
  }]);

  return Point;
}();

var FeaturePoint = function (_Point) {
  _inherits(FeaturePoint, _Point);

  // need: true => should exist, false => should not exist
  function FeaturePoint(x, y, r, g, b, need) {
    var diff = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 25;

    _classCallCheck(this, FeaturePoint);

    var _this = _possibleConstructorReturn(this, (FeaturePoint.__proto__ || Object.getPrototypeOf(FeaturePoint)).call(this, x, y));

    _this.r = r;
    _this.g = g;
    _this.b = b;
    _this.d = diff;
    _this.need = need;
    return _this;
  }

  _createClass(FeaturePoint, [{
    key: 'check',
    value: function check(img) {
      var c = getImageColor(img, this.tx, this.ty);
      if (this.need && !Utils.isSameColor(c, this, this.d)) {
        return false;
      } else if (!this.need && Utils.isSameColor(c, this)) {
        return false;
      }
      return true;
    }
  }, {
    key: 'print',
    value: function print(img) {
      var c = getImageColor(img, this.tx, this.ty);
      console.log('target', this.tx, this.ty, 'param', this.x + ', ' + this.y + ', ' + c.r + ', ' + c.g + ', ' + c.b + ', true');
    }
  }]);

  return FeaturePoint;
}(Point);

var PageFeature = function () {
  function PageFeature(name, featurPoints) {
    _classCallCheck(this, PageFeature);

    this.name = name || 'Unknown';
    this.featurPoints = featurPoints || [];
  }

  _createClass(PageFeature, [{
    key: 'check',
    value: function check(img) {
      for (var i = 0; i < this.featurPoints.length; i++) {
        var _p = this.featurPoints[i];
        if (!_p.check(img)) {
          return false;
        }
        return true;
      }
    }
  }, {
    key: 'print',
    value: function print(img) {
      for (var i = 0; i < this.featurPoints.length; i++) {
        var _p2 = this.featurPoints[i];
        _p2.print(img);
      }
    }
  }, {
    key: 'tap',
    value: function tap() {
      var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.featurPoints[idx].tap();
    }
  }]);

  return PageFeature;
}();

var GameInfo = function GameInfo() {
  _classCallCheck(this, GameInfo);

  this.hpBarRect = new Rect(122, 30, 412, 51);
  this.mpBarRect = new Rect(122, 58, 412, 72);
  this.expBarRect = new Rect(16, 1070, 1904, 1072);
  this.mapRect = new Rect(384, 217, 1920, 937); // 1536, 720
  this.regionTypeRect = new Rect(1710, 470, 1816, 498);

  this.itemBtns = [new Point(810, 960), new Point(930, 960), new Point(1050, 960), new Point(1180, 960), new Point(1440, 960), new Point(1560, 960), new Point(1690, 960), new Point(1810, 960), new Point(1310, 960)];

  this.unknownBtn = new Point(1100, 800);

  this.mapBtn = new Point(1740, 300);
  this.mapDetailBtn = new Point(700, 160);
  this.mapController = new Point(290, 860);
  this.mapControllerL = new Point(190, 860);
  this.mapControllerR = new Point(390, 860);
  this.mapControllerT = new Point(290, 760);
  this.mapControllerB = new Point(290, 960);

  this.menuOnBtn = new PageFeature('menuOn', [new FeaturePoint(1844, 56, 245, 245, 241, true), new FeaturePoint(1844, 66, 128, 70, 56, true), new FeaturePoint(1844, 76, 245, 220, 215, true)]);
  this.menuOffBtn = new PageFeature('menuOff', [new FeaturePoint(1850, 56, 173, 166, 147, true, 40), new FeaturePoint(1850, 66, 173, 166, 147, true, 40), new FeaturePoint(1860, 76, 173, 166, 147, true, 40)]);
  this.autoPlayBtn = new PageFeature('autoPlayOff', [new FeaturePoint(1429, 767, 140, 154, 127, true, 60), new FeaturePoint(1476, 772, 140, 157, 130, true, 60)]);
  this.selfSkillBtn = new PageFeature('selfSkillOff', [new FeaturePoint(1594, 601, 141, 147, 137, true, 60), new FeaturePoint(1591, 624, 117, 128, 114, true, 60)]);
  this.attackBtn = new PageFeature('attackOff', [new FeaturePoint(1634, 769, 165, 180, 170, true, 60)]);
  this.disconnectBtn = new PageFeature('disconnect', [new FeaturePoint(840, 880, 34, 51, 79, true, 20), new FeaturePoint(1080, 880, 34, 51, 79, true, 20), new FeaturePoint(1170, 880, 31, 20, 14, true, 20)]);
  this.enterBtn = new PageFeature('enter', [new FeaturePoint(1480, 990, 31, 47, 70, true, 20), new FeaturePoint(1750, 990, 31, 47, 70, true, 20), new FeaturePoint(1690, 990, 31, 47, 70, true, 20)]);
};

var RoleState = function () {
  function RoleState(gi) {
    _classCallCheck(this, RoleState);

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

  _createClass(RoleState, [{
    key: 'print',
    value: function print() {
      console.log('hp: ' + this.hp + ', mp: ' + this.mp + ', exp: ' + this.exp);
    }
  }]);

  return RoleState;
}();

var LineageM = function () {
  function LineageM(config) {
    _classCallCheck(this, LineageM);

    this.config = config || { conditions: [] };
    this.gi = new GameInfo();
    this.rState = new RoleState(this.gi);
    this.localPath = getStoragePath() + '/scripts/com.r2studio.LineageM/images';
    this._loop = false;
    this._img = 0;

    this.refreshScreen();

    // load images
    this.images = {
      safeRegion: openImage(this.localPath + '/safeRegionType.png'),
      normalRegion: openImage(this.localPath + '/normalRegionType.png')
    };
    // this.gi.disconnectBtn.print(this._img);
    this.tmpExp = 0;
    this.isRecordLocation = false;
  }

  _createClass(LineageM, [{
    key: 'safeSleep',
    value: function safeSleep(t) {
      while (this._loop && t > 0) {
        t -= 100;
        sleep(100);
      }
    }
  }, {
    key: 'loadNumberImages',
    value: function loadNumberImages() {}
  }, {
    key: 'getImageNumber',
    value: function getImageNumber(img, numbers) {
      var maxLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8;

      if (numbers.length != 10) {
        console.log('Error number length should be 10');
        return 0;
      }
      var results = [];
      for (var i = 0; i < 10; i++) {
        var nImg = numbers[i];
        if (nImg == 0) {
          console.log('Error number image is empty');
          return 0;
        }
        var rs = findImages(img, nImg, 0.95, maxLength, true);
        for (var k in rs) {
          rs[k].number = i;
          results.push(rs[k]);
        }
      }
      results.sort(function (a, b) {
        return b.score - a.score;
      });
      results = results.slice(0, Math.min(maxLength, results.length));
      results.sort(function (a, b) {
        return a.x - b.x;
      });
      var numberSize = getImageSize(numbers[0]);
      var nw = numberSize.width;
      var imgSize = getImageSize(img);
      var iw = imgSize.width;
      var px = 0;
      var numberStr = '';
      for (var _i in results) {
        var r = results[_i];
        if (r.x > p) {
          numberStr += r.number.toString();
          p = r.x - 2;
        }
      }
      console.log('number', numberStr);
      return numberStr;
    }
  }, {
    key: 'checkIsSystemPage',
    value: function checkIsSystemPage() {
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
  }, {
    key: 'checkCondiction',
    value: function checkCondiction() {
      for (var i = 0; i < this.config.conditions.length && this._loop; i++) {
        var cd = this.config.conditions[i];
        if (cd.useTime === undefined) {
          cd.useTime = 0;
        }
        if (Date.now() - cd.useTime < cd.interval) {
          continue;
        }
        var value = this.rState[cd.type];
        if (value < 0.1) {
          continue;
        }
        if (cd.type === 'exp') {
          if (this.rState.exp !== this.tmpExp) {
            this.gi.itemBtns[cd.btn].tap(1, 100);
            console.log('Use ' + (cd.btn + 1) + ' btn, ' + cd.type + ', ' + cd.op + ' ' + cd.value + ' (' + value + ')');
            cd.useTime = Date.now();
            this.safeSleep(700);
          }
        } else if (value * cd.op > cd.value * cd.op) {
          if (cd.btn >= 0 && cd.btn < 8) {
            this.gi.itemBtns[cd.btn].tap(1, 100);
            console.log('Use ' + (cd.btn + 1) + ' btn, ' + cd.type + ', ' + cd.op + ' ' + cd.value + ' (' + value + ')');
            cd.useTime = Date.now();
            this.safeSleep(700);
          }
        }
      }
    }
  }, {
    key: 'start',
    value: function start() {
      this._loop = true;
      var goBackTime = Date.now();
      var useHomeTime = Date.now();
      while (this._loop) {
        this.safeSleep(500);
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

        // go home (8th btn), rand teleport (7th btn)
        if (this.rState.isSafeRegion) {
          if (this.config.inHomeUseBtn && Date.now() - useHomeTime > 6000) {
            this.gi.itemBtns[6].tap();
            useHomeTime = Date.now();
          }
        } else {
          if (this.config.dangerousGoHome && this.rState.hp < 25) {
            this.gi.itemBtns[7].tap(2, 100);
            console.log('Dangerous, go home, use btn 8th');
            continue;
          }
        }

        // console.log('Check conditions');
        this.checkCondiction();

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
          var diffXY = this.getDiffRecordLocation();
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
  }, {
    key: 'waitForChangeScreen',
    value: function waitForChangeScreen() {
      var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.8;
      var maxSleep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;

      var oriImg = clone(this._img);
      for (var i = 0; i < maxSleep / 500 && this._loop; i++) {
        sleep(500);
        this.refreshScreen();
        var s = getIdentityScore(this._img, oriImg);
        if (s < score) {
          break;
        }
      }
      releaseImage(oriImg);
    }
  }, {
    key: 'goToMapPage',
    value: function goToMapPage() {
      this.gi.mapBtn.tap();
      this.waitForChangeScreen();
      this.gi.mapDetailBtn.tap();
      this.waitForChangeScreen(0.8, 2000);
      console.log('In Map Page');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._loop = false;
      sleep(2000);
      releaseImage(this._img);
      for (var k in this.images) {
        releaseImage(this.images[k]);
      }
    }

    // utils

  }, {
    key: 'cropAndSave',
    value: function cropAndSave(filename, rect) {
      var img = rect.crop(this._img);
      saveImage(img, this.localPath + '/lineageM/' + filename);
      releaseImage(img);
    }

    // globalState

  }, {
    key: 'isSafeRegionState',
    value: function isSafeRegionState() {
      var img = this.gi.regionTypeRect.crop(this._img);
      var safeScore = getIdentityScore(img, this.images.safeRegion);
      var normalScore = getIdentityScore(img, this.images.normalRegion);
      releaseImage(img);
      if (safeScore > normalScore) {
        return true;
      }
      return false;
    }
  }, {
    key: 'updateGlobalState',
    value: function updateGlobalState() {
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
  }, {
    key: 'refreshScreen',
    value: function refreshScreen() {
      if (this._img !== 0) {
        releaseImage(this._img);
        this._img = 0;
      }
      this._img = getScreenshotModify(0, 0, gDeviceWidth, gDeviceHeight, gTargetWidth, gTargetHeight, 95);
      return this._img;
    }

    // HP MP EXP

  }, {
    key: 'getHpPercent',
    value: function getHpPercent() {
      return this.getBarPercent(this.gi.hpBarRect);
    }
  }, {
    key: 'getMpPercent',
    value: function getMpPercent() {
      return this.getBarPercent(this.gi.mpBarRect);
    }
  }, {
    key: 'getExpPercent',
    value: function getExpPercent() {
      return this.getBarPercent(this.gi.expBarRect);
    }
  }, {
    key: 'getBarPercent',
    value: function getBarPercent(barRect) {
      var bar = cropImage(this._img, barRect.tx, barRect.ty, barRect.tw, barRect.th);
      var y1 = barRect.th / 3;
      var y2 = barRect.th / 3 * 2;
      var noCount = 0;
      var noX = barRect.tw;
      for (var x = 0; x < barRect.tw; x += 1) {
        var c = Utils.mergeColor(getImageColor(bar, x, y1), getImageColor(bar, x, y2));getImageColor(bar, x, y1);
        var d = Utils.minMaxDiff(c);
        if (d < 60) {
          noCount++;
          if (noCount === 2) {
            noX = x - 1;
            break;
          }
        } else {
          noCount = 0;
        }
      }
      releaseImage(bar);
      var percent = (noX / barRect.tw * 100).toFixed(1);
      return percent;
    }

    // MAP

  }, {
    key: 'goMap',
    value: function goMap(disX, disY) {
      var max = 20000;
      if (Math.abs(disX) < 30 && Math.abs(disY) < 30) {
        return;
      }
      var timeL = 3000;var timeR = 3000;var timeT = 3000;var timeB = 3000;
      if (disX >= 0 && disX > 30) {
        timeR += Math.min(1600 * Math.abs(disX) / 10, max);
      } else if (disX < 0 && disX < -30) {
        timeL += Math.min(1600 * Math.abs(disX) / 10, max);
      }
      if (disY >= 0 && disY > 30) {
        timeB += Math.min(1600 * Math.abs(disY) / 10, max);
      } else if (disY < 0 && disY < -30) {
        timeT += Math.min(1600 * Math.abs(disY) / 10, max);
      }
      var times = Math.ceil((timeL + timeR + timeT + timeB) / 24000);
      console.log('Left', timeL, 'Right', timeR, 'Up', timeT, 'Down', timeB, times);
      var tl = Math.ceil(timeL / times);
      var tr = Math.ceil(timeR / times);
      var tt = Math.ceil(timeT / times);
      var tb = Math.ceil(timeB / times);
      this.gi.mapController.tapDown();
      for (var t = 0; t < times && this._loop; t++) {
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
  }, {
    key: 'recordCurrentLocation',
    value: function recordCurrentLocation() {
      var p = new Point(768, 360);
      var rect1 = new Rect(p.x - 120, p.y - 90, p.x - 30, p.y - 30); // left top
      var rect2 = new Rect(p.x + 30, p.y - 90, p.x + 120, p.y - 30); // right top
      var rect3 = new Rect(p.x - 120, p.y + 30, p.x - 30, p.y + 90); // left bottom
      var rect4 = new Rect(p.x + 30, p.y + 30, p.x + 120, p.y + 90); // right bottom
      var img1 = cropImage(this._img, rect1.tx, rect1.ty, rect1.tw, rect1.th);
      var img2 = cropImage(this._img, rect2.tx, rect2.ty, rect2.tw, rect2.th);
      var img3 = cropImage(this._img, rect3.tx, rect3.ty, rect3.tw, rect3.th);
      var img4 = cropImage(this._img, rect4.tx, rect4.ty, rect4.tw, rect4.th);
      saveImage(img1, this.localPath + '/mapRecord1.png');
      saveImage(img2, this.localPath + '/mapRecord2.png');
      saveImage(img3, this.localPath + '/mapRecord3.png');
      saveImage(img4, this.localPath + '/mapRecord4.png');
      releaseImage(img1);releaseImage(img2);releaseImage(img3);releaseImage(img4);
    }
  }, {
    key: 'getDiffRecordLocation',
    value: function getDiffRecordLocation() {
      var result = undefined;
      for (var i = 0; i < 3; i++) {
        result = this.findDiffRecordLocation();
        if (result !== undefined) {
          break;
        }
        sleep(1000);
        this.refreshScreen();
      }
      if (result === undefined) {
        console.log('Error can not find record location');
        return { x: 0, y: 0 };
      }
      return result;
    }
  }, {
    key: 'findDiffRecordLocation',
    value: function findDiffRecordLocation() {
      var p = new Point(768, 360);
      var images = [openImage(this.localPath + '/mapRecord1.png'), openImage(this.localPath + '/mapRecord2.png'), openImage(this.localPath + '/mapRecord3.png'), openImage(this.localPath + '/mapRecord4.png')];
      var findXYs = [];
      for (var i = 0; i < images.length; i++) {
        if (images[i] === 0) {
          console.log('Error not record map location');
          return;
        }
        var xy = findImage(this._img, images[i]);
        switch (i) {
          case 0:
            xy.x = p.x - xy.x / gRatioTarget - 120;
            xy.y = p.y - xy.y / gRatioTarget - 90;
            break;
          case 1:
            xy.x = p.x - xy.x / gRatioTarget + 30;
            xy.y = p.y - xy.y / gRatioTarget - 90;
            break;
          case 2:
            xy.x = p.x - xy.x / gRatioTarget - 120;
            xy.y = p.y - xy.y / gRatioTarget + 30;
            break;
          case 3:
            xy.x = p.x - xy.x / gRatioTarget + 30;
            xy.y = p.y - xy.y / gRatioTarget + 30;
            break;
        }
        findXYs.push(xy);
        releaseImage(images[i]);
      }
      var finalXY = undefined;
      for (var _i2 = 0; _i2 < findXYs.length; _i2++) {
        var count = 0;
        for (var j = 0; j < findXYs.length; j++) {
          if (Math.abs(findXYs[_i2].x - findXYs[j].x) < 30 && Math.abs(findXYs[_i2].y - findXYs[j].y) < 30) {
            count++;
          }
        }
        if (count > 1) {
          finalXY = findXYs[_i2];
        }
      }
      if (finalXY !== undefined) {
        // console.log(JSON.stringify(findXYs));
        console.log('find location diff', finalXY.x, finalXY.y);
      }
      return finalXY;
    }
  }]);

  return LineageM;
}();

var DefaultConfig = {
  conditions: [
    // {type: 'hp', op: -1, value: 60, btn: 6, interval: 5000}, // if hp < 60% use 3th button, like 瞬移
    // {type: 'hp', op: -1, value: 30, btn: 7, interval: 10000}, // if hp < 30% use 8th button, like 回卷
    // {type: 'hp', op: -1, value: 75, btn: 3, interval: 2000}, // if hp < 75% use 4th button, like 高治
    // {type: 'mp', op: -1, value: 70, btn: 4, interval: 2000}, // if mp < 70% use 5th button, like 魂體
    // {type: 'mp', op:  1, value: 50, btn: 1, interval: 8000}, // if mp > 80% use th button, like 三重矢, 光箭, 火球等
  ],
  inHomeUseBtn: false, // if in safe region use 3th button, like 瞬移.
  dangerousGoHome: true, // if hp < 25%, go home, use button 8th
  goBackInterval: 0 // whether to go back to origin location, check location every n min
};

var lm = undefined;

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
  console.log('STOP');
}

function stop() {
  if (lm == undefined) {
    return;
  }
  lm._loop = false;
  lm = undefined;
  console.log('Stopping');
}

// start(DefaultConfig);
// lm = new LineageM();
// lm._loop=true;
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
