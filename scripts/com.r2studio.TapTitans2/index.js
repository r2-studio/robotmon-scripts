'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// == Global variables start
// -- screen info
var _wh = getScreenSize();
var gDevWidth = 1440;
var gDevHeight = 2560;
var gTargetWidth = 540;
var gTargetHeight = 960;
// var gTargetWidth = 1440;
// var gTargetHeight = 2560;
var gDeviceWidth = Math.min(_wh.width, _wh.height);
var gDeviceHeight = Math.max(_wh.width, _wh.height);
var gGameWidth = gDeviceWidth;
var gGameHeight = gDeviceHeight;
var gGameOffsetX = 0;
var gGameOffsetY = 0;
// if (gDeviceWidth / gDeviceHeight > 1.78) {
//   gGameWidth = Math.round(gGameHeight * 1.777778);
//   gGameOffsetX = (gDeviceWidth - gGameWidth) / 2;
// } else if (gDeviceWidth / gDeviceHeight < 1.77) {
//   gGameHeight = Math.round(gGameWidth / 1.777778);
//   gGameOffsetY = (gDeviceHeight - gGameHeight) / 2;
// }
var gRatioTarget = gTargetWidth / gDevWidth;
var gRatioDevice = gGameWidth / gDevWidth;
var gDebug = false;

// =============== utilities ===============
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
  }, {
    key: 'targetToDevice',
    value: function targetToDevice(xy) {
      var r = gRatioDevice / gRatioTarget;
      return { x: gGameOffsetX + xy.x * r, y: gGameOffsetY + xy.y * r };
    }
  }, {
    key: 'fitImageSize',
    value: function fitImageSize(img) {
      var size = getImageSize(img);
      return resizeImage(img, gRatioTarget * size.width, gRatioTarget * size.height);
    }
  }, {
    key: 'mTap',
    value: function mTap(x, y, duration) {
      tap(gGameOffsetX + x * gRatioDevice, gGameOffsetY + y * gRatioDevice, duration);
    }
  }, {
    key: 'mSwipe',
    value: function mSwipe(x, y, endX, endY, step) {
      tapDown(x, y, 40);

      xStep = (endX - x) / step;
      yStep = (endY - y) / step;
      for (i = 0; i < step; i ++) {
        moveTo(x + i * xStep, y + i * yStep, 40);
      }
      
      tapUp(endX, endY);
    }
  }, {
    key: 'getRandomInt',
    value: function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
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
      // console.log('crop: ', this.tx, this.ty, this.tw, this.th)
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
    this.dx = gGameOffsetX + this.x * gRatioDevice;
    this.dy = gGameOffsetY + this.y * gRatioDevice;
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

var Image = function () {
  function Image(filePath, minScore, isRequired) {
    _classCallCheck(this, Image);

    this.x = x;
    this.y = y;
    this.tx = this.x * gRatioTarget;
    this.ty = this.y * gRatioTarget;
    this.dx = gGameOffsetX + this.x * gRatioDevice;
    this.dy = gGameOffsetY + this.y * gRatioDevice;

    this.targetImg = openImage(filePath);
    this.minScore = minScore;
    this.isRequired = isRequired;
  }

  _createClass(Image, [
    {
      key: 'check',
      value: function check(img) {
      
        var result = findImage(img, targetImg);
        // console.log(JSON.stringify(result));


        var c = getImageColor(img, this.tx, this.ty);
        if (this.isRequired && result.score < this.minScore) {
          return false;
        } else if (!this.isRequired && result.score >= this.minScore) {
          return false;
        }
        return true;
      }
    }
  ]);

  return Image;
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
        if (gDebug) {
          console.log('!c: ', c.r, c.g, c.b)
        }
        return false;
      } else if (!this.need && Utils.isSameColor(c, this)) {
        if (gDebug) {
          console.log('!c: ', c.r, c.g, c.b)
        }
        return false;
      }
      return true;
    }
  }, {
    key: 'getColor',
    value: function getColor(img) {
      return getImageColor(img, this.tx, this.ty);
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
      }
      return true;
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

var GameInfo = function GameInfo(prestigeTime, upgradeAllHeroCD) {
  _classCallCheck(this, GameInfo);
  this.prestigeTime = prestigeTime; // in minutes
  this.upgradeAllHeroCD = upgradeAllHeroCD; //in minutes

  this.clanBoss = new FeaturePoint(259, 62, 120, 60, 65, true, 20)
  this.clanBoss2 = new Point(282, 2286);
  this.clanBoss3 = new Point(950, 2350);
  this.clanBossBack = new Point(1290, 150);
  this.fightClanBossRect = new Rect(1130, 2100, 1390, 2400);

  this.fightStageBoss = new FeaturePoint(1290, 110, 240, 100, 20, true, 40);
  this.fairyNoThanks = new PageFeature('fairyNoThanks', [
    new FeaturePoint(500, 2050, 240, 140, 10, true, 35),
    new FeaturePoint(300, 1950, 240, 140, 10, true, 35),
    new FeaturePoint(150, 1950, 240, 140, 10, true, 35)]);
  this.fairyWatchAds = new PageFeature('fairyWatchAds', [
    new FeaturePoint(820, 1950, 40, 170, 210, true, 35),
    new FeaturePoint(1240, 1950, 40, 170, 210, true, 35),
  ])
    // This Rect shows fairy reward type
  this.fairyRewardRect = new Rect(70, 1600, 400, 1900);
  this.QuitGameNo = new PageFeature('QuitGameNo', [
    new FeaturePoint(190, 1650, 240, 130, 10, true, 35),
    new FeaturePoint(190, 1700, 240, 130, 10, true, 35),
    new FeaturePoint(500, 1650, 240, 130, 10, true, 35),
    new FeaturePoint(500, 1700, 240, 130, 10, true, 35)]);
  this.fairyCollectReward = new PageFeature('fairyCollectReward', [
    new FeaturePoint(380, 1550, 40, 160, 200, true, 35),
    new FeaturePoint(700, 1550, 40, 160, 200, true, 35)]);

  this.ship = new Point(140, 580);
  this.inactiveGold = new Point(100, 725);
  this.petEggs = new Point(100, 925);
  this.petGold = new Point(850, 1250);

  // this.heroStoryRect = new Rect(560, 1500, 750, 1680)
  this.heroTab = new PageFeature('heroTab', [
    new FeaturePoint(355, 2478, 100, 140, 160, true),
    new FeaturePoint(360, 2530, 98, 155, 170, true),
  ]);
  this.hero1 = new Point(1200, 1800);
  this.hero2 = new Point(1200, 2000);
  this.hero3 = new Point(1200, 2200);

  this.masterTab = new PageFeature('masterTab', [new FeaturePoint(134, 2497, 147, 60, 33, false), new FeaturePoint(129, 2500, 147, 60, 33, false)]);
  this.upgradeMaster = new Point(1180, 1800);
  this.upgradeMasterExpend = new Point(1200, 400);
  this.prestige = new Point(1200, 2340);
  this.prestige2 = new Point(700, 1980);
  this.prestige3 = new Point(1000, 1700);

  this.splashKillRect = new Rect(530, 530, 720, 940);
  this.accountRect = new Rect(0, 1500, 330, 1760);
  this.accountExpendRect = new Rect(0, 0, 250, 350);
  this.warCryRect = new Rect(0, 1500, 500, 2400);
  this.warCrySkill = new Point(1080, 2290);
  this.warCryExpend = new FeaturePoint(1050, 1660, 250, 150, 20, true, 35);

  this.skillExpend = [
    new FeaturePoint(1050, 730, 250, 150, 20, true, 35),
    new FeaturePoint(1050, 950, 250, 150, 20, true, 35),
    new FeaturePoint(1050, 1170, 250, 150, 20, true, 35),
    new FeaturePoint(1050, 1410, 250, 150, 20, true, 35),
    new FeaturePoint(1050, 1660, 250, 150, 20, true, 35),
    new FeaturePoint(1050, 1850, 250, 150, 20, true, 35),
  ];
  // this.heavenlyStrikeExpend = new FeaturePoint(1050, 730, 250, 150, 20, true, 35);
  // this.deadlyStrikeExpend = new FeaturePoint(1050, 950, 250, 150, 20, true, 35);
  // this.handOfMidasExpend = new FeaturePoint(1050, 1170, 250, 150, 20, true, 35);
  // this.fireSwordExpend = new FeaturePoint(1050, 1410, 250, 150, 20, true, 35);
  // this.shadowCloneExpend = new FeaturePoint(1050, 1850, 250, 150, 20, true, 35);

  this.gearRect = new Rect(0, 0, 200, 200);

  this.expendTab = new Point(1150, 1420);
  this.shrinkTab = new Point(1150, 40);
  this.expendTabPage = new PageFeature('expendTab', [
    new FeaturePoint(750, 110, 80, 80, 80, true, 20),
    new FeaturePoint(850, 110, 80, 80, 80, true, 20),
    new FeaturePoint(950, 110, 80, 80, 80, true, 20),
    new FeaturePoint(1000, 110, 80, 80, 80, true, 20),
    new FeaturePoint(1100, 110, 80, 80, 80, true, 20),
  ])

  // Check return true when skill can be cast
  this.skillStatusRef = [
    new FeaturePoint(110, 2204, 250, 250, 250, true, 20),
    new FeaturePoint(350, 2204, 250, 250, 250, true, 20),
    new FeaturePoint(590, 2204, 250, 250, 250, true, 20),
    new FeaturePoint(830, 2204, 250, 250, 250, true, 20),
    new FeaturePoint(1070, 2204, 250, 250, 250, true, 20),
    new FeaturePoint(1310, 2204, 250, 250, 250, true, 20),
  ]

  // Used to determine if the game still active
  this.inGamePage = new PageFeature('inGamePage', [
    new FeaturePoint(200, 2540, 240, 100, 60, true, 30),
    new FeaturePoint(440, 2540, 60, 140, 170, true, 30),
    new FeaturePoint(675, 2540, 240, 170, 10, true, 30),
    new FeaturePoint(900, 2540, 90, 160, 70, true, 30),
    new FeaturePoint(1170, 2540, 120, 100, 190, true, 30),
    new FeaturePoint(1400, 2540, 60, 130, 130, true, 30)
  ])
};

var SkillEnum = Object.freeze({ 'none': 1, 'ok': 2, 'active': 3, 'oom': 4 })
var SkillColor = Object.freeze({
  'none': {r: 0, g: 0, b: 0},
  'ok': {r: 250, g: 250, b: 250},
  'active': {r: 250, g: 170, b: 50},
  'oom': {r: 120, g: 120, b: 130},
})

var RoleState = function () {
  function RoleState(gInfo) {
    _classCallCheck(this, RoleState);

    this.gInfo = gInfo;
    this.startTime = Date.now();
    this.lastUpgradeAllHeros = Date.now();

    this.isInGame; // Check upper left gear icon
    this.isClanBossActive; // Check upper left clan boss icon
    this.isFightBoss; // Check upper right fightBoss icon

    this.skillsState = {
      'HS': SkillEnum.none,
      'DS': SkillEnum.none,
      'HOM': SkillEnum.none,
      'FS': SkillEnum.none,
      'WC': SkillEnum.none,
      'SC': SkillEnum.none,
    }
  }

  _createClass(RoleState, [{
    key: 'print',
    value: function print() {
      console.log('time: ', Math.floor((Date.now() - startTime)/1000/60), 'm', Math.floor(((Date.now() - startTime)/1000)%60), 's, of', settings.prestigeTime / 60, 'mins');
    }
  }]);

  return RoleState;
}();

var GameAssistant = function () {
  function GameAssistant(debug, checkInGame, tapFairyRoute, randomSleep, prestigeTime, upgradeAllHeroCD) {
    _classCallCheck(this, GameAssistant);

    // this.config = config || { conditions: [] };
    this.gInfo = new GameInfo(prestigeTime, upgradeAllHeroCD);
    this.rState = new RoleState(this.gInfo);
    this.shouldCheckInGame = checkInGame;
    this.shouldRandomSleep = randomSleep;
    this.shouldTapFairyRoute = tapFairyRoute === false ? false : true;
    gDebug = debug == true ? true : false;
    this.localPath = getStoragePath() + '/scripts/com.r2studio.TapTitans2/images/';
    this._loop = false;
    this._img = 0;

    // load images
    this.images = {
      clanBoss: openImage(this.localPath + 'clanBoss.png'),
      fightClanBoss: openImage(this.localPath + 'fightClanBoss.png'),
      splashKill: openImage(this.localPath + 'splashKill.png'),
      heroStory: openImage(this.localPath + 'heroStory.png'),
      account: openImage(this.localPath + 'account.png'),
      gear: openImage(this.localPath + 'gear.png')
    };

    Object.keys(this.images).forEach(function(key) {
      if (this.images[key] != 0) {
        this.images[key] = Utils.fitImageSize(this.images[key]);
      } else {
        console.log('No image: ', key)
      }
    }.bind(this))
  }

  _createClass(GameAssistant, [{
    key: 'safeSleep',
    value: function safeSleep(t) {
      while (this._loop && t > 0) {
        t -= 100;
        sleep(100);
      }
    }
  }, {
    key: 'refreshScreen',
    value: function refreshScreen() {
      if (this._img !== 0) {
        releaseImage(this._img);
        this._img = 0;
      }
      var startTime = Date.now();
      this._img = getScreenshotModify(gGameOffsetX, gGameOffsetY, gGameWidth, gGameHeight, gTargetWidth, gTargetHeight, 80);
      if (Date.now() - startTime < 100) {
        sleep(100);
      }
      return this._img;
    }
  }, {
    key: 'start',
    value: function start() {
      this._loop = true;
      this.roundStart = Date.now();

      while (this._loop) {
        this.refreshScreen();

        if (this.shouldCheckInGame){
          this.checkInGame();
        }

        // this.tapFairy();
        // break;

        console.log('check fightClanBoss');
        this.fightClanBoss();

        this.checkRandomSleep(3);

        console.log('check fightStageBoss');
        this.fightStageBoss();

        this.checkRandomSleep(3);

        if (this.shouldTapFairyRoute) {
          console.log('check tapFairy');
          this.tapFairy();  

          this.checkRandomSleep(3);
        }

        console.log('check checkWarCry');
        if (Math.floor((Date.now() - this.roundStart)/1000/60) > 3) {
          this.checkWarCry();
        }

        this.checkRandomSleep(3);

        console.log('check tapGround');
        this.tapGround();

        this.checkRandomSleep(3);

        console.log('check upgradeHeros');
        if (!this.upgradeAllHeros()) {
          this.upgradeHeros();
        }

        this.checkRandomSleep(3);

        console.log('check testPrestige');
        this.testPrestige();

        //console.log('time: ', Math.floor((Date.now() - startTime)/1000/60), 'm', Math.floor(((Date.now() - startTime)/1000)%60), 's, of', this.gInfo.prestigeTime / 60, 'mins');
        sleep(1500);
      }
    }
  }, {
    key: 'upgradeAllHeros',
    value: function upgradeAllHeros() {
      if (Date.now() - this.rState.lastUpgradeAllHeros < this.gInfo.upgradeAllHeroCD * 60 * 1000) {
        console.log('upgradeAllHeros cd: ', (Date.now() - this.rState.lastUpgradeAllHeros)/ 1000);
        return false;
      }

      console.log('time to upgrade all heros');

      // Open Hero Tab
      for (var i = 0; i < 3; i ++) {
        this.refreshScreen();
        if (this.gInfo.heroTab.check(this._img)) {
          break;
        }

        this.gInfo.heroTab.tap();
        sleep(300);
      }

      this.gInfo.expendTab.tap(1, 300);

      for (var i = 0; i < 4; i ++) {
        for (var y = 420; y < 2440; y += 200) {
          Utils.mTap(1250, y, 100);
        }

        this.ttListSwipeUp()
        sleep(200);
        this.ttListSwipeUp()
        sleep(350);
      }
      for (var y = 420; y < 2440; y += 200) {
        Utils.mTap(1250, y, 100);
      }

      // Swipe to top
      for(var i = 0; i < 5; i ++) {
        this.ttListSwipeDown();
        sleep(350);
      }

      // Check the tab is shrinked
      for (var i = 0; i < 5; i ++) {
        this.refreshScreen();
        var img = this.gInfo.gearRect.crop(this._img);
        var r = findImage(img, this.images.gear);
        r.score = r.score.toFixed(2);
        console.log('r: ', JSON.stringify(r))
        releaseImage(img);

        if (r.score > 0.72) {
          break;
        }

        this.gInfo.shrinkTab.tap();
        sleep(500);
      }

      this.gInfo.heroTab.tap(1, 300);
      this.rState.lastUpgradeAllHeros = Date.now();
      sleep(200);

      return true;
    }
  }, {
    key: 'checkSkills',
    value: function checkSkills() {
      this.refreshScreen();
      // Close all tabs
      this.gInfo.masterTab.tap(1, 400);
      for (var i = 0; i < 3; i ++) {
        this.refreshScreen();
        if (!this.gInfo.masterTab.check(this._img)) {
          break;
        }

        this.gInfo.masterTab.tap();
        sleep(300);
      }

      // this.refreshScreen();
      Object.keys(this.rState.skillsState).forEach(function(name, index) {
        var c = this.gInfo.skillStatusRef[index].getColor(this._img);

        if (Utils.isSameColor(c, SkillColor.none)) {
          this.rState.skillsState[name] = SkillEnum.none;
        } else if (Utils.isSameColor(c, SkillColor.ok)) {
          this.rState.skillsState[name] = SkillEnum.ok;
        } else if (Utils.isSameColor(c, SkillColor.active)) {
          this.rState.skillsState[name] = SkillEnum.active;
        } else if (Utils.isSameColor(c, SkillColor.oom)) {
          this.rState.skillsState[name] = SkillEnum.oom;
        }
        console.log(name, this.rState.skillsState[name]);
      }.bind(this));
    }
  }, {
    key: 'warCry2',
    value: function warCry2() {
      // 1. Check all skill availibity
      this.checkSkills();

      // 2.0 return if warCry is active
      if (this.rState.skillsState['WC'] == SkillEnum.active) {
        console.log('warcry alredy active, skip')
        return;
      }

      // 2. add skill if status = SkillEnum.none (not yet learn)
      // TODO: keep upgrade warcry?
      if (this.rState.skillsState['WC'] == SkillEnum.none) {
        console.log('learn warcry')
        this.learnSkill(this.gInfo.warCryExpend);
      }

      // 3. add other skill if OOM
      else if (this.rState.skillsState['WC'] == SkillEnum.oom) {
        console.log('try to solve OOM');
        this.toLearn = null;
        Object.keys(this.rState.skillsState).forEach(function(name, index) {
          if (this.toLearn !== null) {
            return;
          }
          if (this.rState.skillsState[name] == SkillEnum.none) {
            this.toLearn = this.gInfo.skillExpend[index];
          }
        }.bind(this));

        if (this.toLearn !== null) {
          this.learnSkill(this.toLearn);
        }
        sleep(600);
      }

      // 4. close master tab
      this.gInfo.masterTab.tap(1, 1200);
      this.refreshScreen();
      if (!this.gInfo.masterTab.check(this._img)) {
        this.gInfo.masterTab.tap(1, 900);
      }

      console.log('cast warcry')
      this.gInfo.warCrySkill.tap(1, 600);
    }
  }, {
    key: 'learnSkill',
    value: function learnSkill(skill) {
      console.log('learn: ', JSON.stringify(skill))
      // Open master tab
      for (var i = 0; i < 3; i ++) {
        this.refreshScreen();
        if (this.gInfo.masterTab.check(this._img)) {
          break;
        }

        this.gInfo.masterTab.tap();
        sleep(600);
      }

      // expend full tab
      this.refreshScreen();
      if (!this.gInfo.expendTabPage.check(this._img)) {
        this.gInfo.expendTab.tap();
        sleep(500);
      }

      // swipe to top
      for(var i = 0; i < 5; i ++) {
        this.refreshScreen();
        var img = this.gInfo.accountExpendRect.crop(this._img);
        var r = findImage(img, this.images.account);
        r.score = r.score.toFixed(2);
        console.log('r: ', JSON.stringify(r))
        releaseImage(img);
  
        if (r.score > 0.78) {
          console.log('master tab expanded')
          break;
        }

        this.ttListSwipeDown();
        sleep(350);
      }

      // TODO: only upgrade master when can't learn warcry
      // upgradeMaster
      this.gInfo.upgradeMasterExpend.tap(5, 500);

      if (skill.check(this._img)) {
        console.log('learn skill')

        for (var i = 0; i < 9; i ++) {
          skill.tap(1, 300);
        }
      }

      this.gInfo.shrinkTab.tap(1, 300);
    }
  }, {
    key: 'warCry',
    value: function warCry() {
      this.learnSkill(this.gInfo.warCryExpend);

      this.gInfo.shrinkTab.tap(1, 300);
      this.gInfo.masterTab.tap(1, 300);
      this.gInfo.warCrySkill.tap(1, 300);
    },
  }, {
    key: 'checkWarCry',
    value: function checkWarCry() {
      var img = this.gInfo.splashKillRect.crop(this._img);
      var r = findImage(img, this.images.splashKill);
      r.score = r.score.toFixed(2);
      console.log('warCry: ', JSON.stringify(r))
      sleep(1500)
      releaseImage(img);

      if (r.score < 0.6) {
        console.log('warcry')
        this.warCry2();
      }
    },
  }, {
    key: 'testPrestige',
    value: function testPrestige() {
      if (Date.now() - this.roundStart > this.gInfo.prestigeTime * 60 * 1000) {
        console.log('Prestige');

        if (!this.gInfo.masterTab.check(this._img)) {
          this.gInfo.masterTab.tap();
        }
  
        // swipe to top
        for(var i = 0; i < 3; i ++) {
          this.ttListSwipeDown();
          sleep(200);
        }
  
        // upgradeMaster
        this.gInfo.upgradeMaster.tap(5, 100);
  
        for (var i = 0; i < 7; i ++) {
          this.ttListSwipeUp();
          sleep(250);
        }
  
        this.gInfo.prestige.tap(1, 50);
        this.gInfo.prestige2.tap(1, 200);
        this.gInfo.prestige3.tap(1, 300);

        this.roundStart = Date.now();
      } else {
        console.log('time: ', Math.floor((Date.now() - this.roundStart)/1000/60), 'm', Math.floor(((Date.now() - this.roundStart)/1000)%60), 's, of', this.gInfo.prestigeTime, 'mins');
      }
    }
  }, {
    key: 'upgradeHeros',
    value: function upgradeHeros() {
      for (var i = 0; i < 3; i ++) {
        this.refreshScreen();
        if (this.gInfo.heroTab.check(this._img)) {
          break;
        }

        this.gInfo.heroTab.tap();
        sleep(300);
      }

      sleep(300);
      this.ttListSwipeDown();
      sleep(300);
      this.gInfo.hero1.tap(1, 50);
      this.gInfo.hero2.tap(1, 50);
      this.gInfo.hero3.tap(1, 50);
      sleep(200);

      this.gInfo.heroTab.tap();
      sleep(300);
    }
  }, {
    key: 'tapGround',
    value: function tapGround() {
      this.gInfo.petEggs.tap(1, 300);
      this.gInfo.inactiveGold.tap(1, 300);
      for (var i =  -5; i < 5; i ++) {
        Utils.mTap(this.gInfo.petGold.x + 0.1 * i * gDeviceWidth, this.gInfo.petGold.y, 80);
      }

      // keep hitting in case get equipment
      for (var i = 0; i < 70 && this._loop; i ++) {
        this.tapRandom(700, 1250, 50, 50, 80);
      }
    }
  }, {
    key: 'tapFairy',
    value: function tapFairy() {
      // Tap the fairy route 3 times
      for (var j = 0; j < 3; j ++) {
        for (var i = 0; i < 10; i ++) {
          Utils.mTap(this.gInfo.ship.x + 0.1 * i * gDevWidth, this.gInfo.ship.y);
        }
      }

      sleep(1500);

      console.log('looking for fairyNoThanks, may take 6 secs')
      for (var i = 0; i < 16; i ++) {
        this.refreshScreen();
        if (this.gInfo.fairyNoThanks.check(this._img) &&
          this.gInfo.fairyWatchAds.check(this._img)) {
          sleep(500);
          console.log('found noThanks, tapping')
          this.gInfo.fairyNoThanks.tap();
          // return;
        }
        sleep(350);
      }
    }
  }, {
    key: 'fightStageBoss',
    value: function fightStageBoss() {
      for (var i = 0; i < 5; i ++) {
        this.refreshScreen();
        if (this.gInfo.fightStageBoss.check(this._img)) {
          this.gInfo.fightStageBoss.tap();
          console.log('tap fightStageBoss');
        } else {
          console.log('fightStageBoss OK');
          return;
        }
        sleep(300);
      };
    },
  }, {
    key: 'fightClanBoss',
    value: function fightClanBoss() {
      if (this.gInfo.clanBoss.check(this._img)) {
        this.gInfo.clanBoss.tap();

        this.safeSleep(300);
        this.gInfo.clanBoss2.tap();

        var foundBoss = false;
        for (var i = 0; i < 40; i ++) {
          this.refreshScreen();
          var img = this.gInfo.fightClanBossRect.crop(this._img);
          var r = findImage(img, this.images.fightClanBoss);
          r.score = r.score.toFixed(2);
          // console.log('r: ', JSON.stringify(r))
          releaseImage(img);

          if (r.score >= 0.84) {
            console.log('found & tap: ', r.score);
            this.gInfo.clanBoss3.tap();
            foundBoss = true;
            break;
          } else {
            console.log('clanBossScore:', r.score, ', retry');
          }

          this.safeSleep(150);
        }

        if (!foundBoss) {
          console.log('cant find boss, maybe later');
          this.safeSleep(3500);
          this.gInfo.clanBossBack.tap();
        } else {
          this.safeSleep(4000);
          console.log('start taping');
          for (i = 0; i < 30 && this._loop; i ++){
            for (j = 0; j < 10 && this._loop; j ++) {
              this.tapRandom(700, 900, 50, 50, 80);
            }
          }
  
          console.log('tap complete');
          this.safeSleep(8000);
          console.log('tap back 1/3')
          this.gInfo.clanBossBack.tap();
          sleep(4000);
          this.gInfo.clanBossBack.tap();
          console.log('tap back 2/3')
          sleep(4000);
          this.gInfo.clanBossBack.tap();
          console.log('tap back 3/3')
          sleep(4000);
          this.gInfo.clanBossBack.tap();
          console.log('tap back 4')
        }  
      }
    }
  }, {
    key: 'checkRandomSleep',
    value: function checkRandomSleep(maxSeconds) {
      if (!this.shouldRandomSleep) {
        return;
      }

      var duration = Utils.getRandomInt(maxSeconds * 1000);
      console.log('sleep ' + duration + ' ms (max ' + maxSeconds + ' secs)')
      this.safeSleep(duration);
    }
  }, {
    key: 'ttListSwipeDown',
    value: function ttListSwipeDown() {
      Utils.mSwipe(600 * gRatioDevice, 1680 * gRatioDevice, 600 * gRatioDevice, 3600 * gRatioDevice, 5);
    }
  }, {
    key: 'ttListSwipeUp',
    value: function ttListSwipeUp() {
      Utils.mSwipe(600 * gRatioDevice, 2400 * gRatioDevice, 600 * gRatioDevice, 1400 * gRatioDevice, 4);
    }
  }, {
    key: 'tapRandom',
    value: function tapRandom(x, y, rangeX, rangeY, duration) {
      rangeX = Math.random() > 0.5 ? Utils.getRandomInt(rangeX) : -1 * Utils.getRandomInt(rangeX);
      rangeY = Math.random() > 0.5 ? Utils.getRandomInt(rangeY) : -1 * Utils.getRandomInt(rangeY);
      Utils.mTap(x + rangeX, y + rangeY, duration);
    }
  }, {
    key: 'checkInGame',
    value: function checkInGame(tab) {
      for (var i = 0; i < 5; i ++) {
        var wh = getScreenSize();
        if (wh.width > wh.height) {
          console.log('screen is landscape, hit back and wait 3.5secs');
          keycode('BACK', 3500);
          continue;
        }

        this.refreshScreen();
        if (this.gInfo.inGamePage.check(this._img)){
          return;
        }
        sleep(2500);
      }

      console.log('cant find gear icon, try shrink tab')
      this.gInfo.shrinkTab.tap(1, 300);

      this.refreshScreen();
      if (this.gInfo.inGamePage.check(this._img)){
        return;
      }

      console.log('we are not in game, try back 30 secs later');
      sleep(30000);
      console.log('hit back and check screen for 1.5 min for fairy reward');
      keycode('BACK', 100);

      sleep(3000);
      for (var i = 0; i < 15; i ++) {
        this.refreshScreen();

        if (this.gInfo.fairyCollectReward.check(this._img)) {
          console.log('fairy reward collected');
          this.gInfo.fairyCollectReward.tap();
          return;
        }
        sleep(1000);
      }

      if (this.gInfo.inGamePage.check(this._img)){
        console.log('back worked');
        return;
      }
      else if (this.gInfo.QuitGameNo.check(this._img)){
        this.gInfo.QuitGameNo.tap();
        console.log('tap quit no');
        return;
      }

      console.log('still cant find gear icon, stopping, exec time: ' + Date.now() - this.roundStart);
      this.stop();
      return;
    }
  }, {
    key: 'stop',
    value: function stop() {
      sleep(200);
      this._loop = false;
      releaseImage(this._img);
      for (var k in this.images) {
        releaseImage(this.images[k]);
      }
    }
  }, {
    key: 'cropAndSave',
    value: function cropAndSave(filename, rect) {
      var img = rect.crop(this._img);
      saveImage(img, this.localPath + '/lineageM/' + filename);
      releaseImage(img);
    }

    // globalState
  }
  ]);

  return GameAssistant;
}();

var DefaultConfig = {
  conditions: [
    { type: 'hp', op: -1, value: 80, btn: 0, interval: 1000 }, // if hp < 60% use 3th button, like 瞬移
    { type: 'mp', op: 1, value: 50, btn: 1, interval: 1000 }, // if hp < 30% use 8th button, like 回卷
    { type: 'mp', op: -1, value: 80, btn: 2, interval: 2000 }
  ],
  inHomeUseBtn: false, // if in safe region use 3th button, like 瞬移.
  beAttackedRandTeleport: true,
  dangerousGoHome: true, // if hp < 25%, go home, use button 8th
  autoAttack: true,
  autoReceiveReward: true,
  autoUseAntidote: false, // take an antidote for the poison, use six button
  goBackInterval: 0, // whether to go back to origin location, check location every n min
  autoBuyHp: 0, // 1 * 100, -1 => max
  autoBuyArrow: 0, // 1 * 1000, -1 => max
  mapSelect: 5 // move to nth map in safe region
};

var assistant = undefined;

function start(debug, checkInGame, tapFairyRoute, randomSleep, prestigeTime, upgradeAllHeroCD) {
  console.log('📢 啟動腳本 📢');
  if (typeof config === 'string') {
    config = JSON.parse(config);
  }
  if (assistant !== undefined) {
    console.log('📢 腳本已啟動 📢');
    return;
  }
  console.log('start(): ', prestigeTime)
  assistant = new GameAssistant(debug, checkInGame, tapFairyRoute, randomSleep, prestigeTime, upgradeAllHeroCD);
  assistant.start();
  // TODO: don't know why won't work
  // assistant.stop();
  // assistant = undefined;
  console.log('📢 腳本已停止 📢');
}

function stop() {
  if (assistant == undefined) {
    return;
  }
  assistant._loop = false;
  console.log('📢 停止腳本中 📢');

  assistant.stop();
  assistant = undefined;
}

console.log('updated')
// start();
