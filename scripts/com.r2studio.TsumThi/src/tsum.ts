function Tsum(isJP, detect, logs) {
  this.debug = false;
  this.autoLaunch = false;
  this.isRunning = true;
  this.isStartupPhase = true;
  this.runTimes = 0;
  this.myTsum = '';
  this.myTsumColor = null;
  this.myTsumIdx = -1;
  this.storagePath = getStoragePath();
  // screen size config
  /** @type {{width: number, height: number}}  */
  const size = getScreenSize();
  this.originScreenWidth = size.width;
  this.originScreenHeight = size.height;
  this.screenHeight = size.height;
  this.screenWidth = size.width;
  this.gameOffsetX = 0;
  this.gameOffsetY = 0;
  this.gameHeight = 0;
  this.gameWidth = 0;
  this.resizeRatio = Math.max(1, this.screenWidth / 360); // normalize page screenshots to 360px width
  this.captureGameRatio = 0;
  // playing game screen size config
  this.playOffsetX = 0;
  this.playOffsetY = 0;
  this.playHeight = 0;
  this.playWidth = 0;
  this.playResizeWidth = Config.screenResize;
  this.playResizeHeight = Config.screenResize;

  this.tsumCount = 5;
  this.maxChainsPerScan = 6;
  this.isJP = isJP;
  this.logs = logs;
  this.scoreItem = false;
  this.coinItem = false;
  this.expItem = false;
  this.timeItem = false;
  this.bubbleItem = false;
  this.comboItem = false;
  this.isPause = false;
  this.receiveOneItem = false;
  this.sentToZero = false;
  this.recordReceive = true;
  this.skillInterval = 3000;
  this.skillLevel = 3;
  this.skillType = '';
  // Optional safety poll: fire the skill the instant it's ready, even mid-link,
  // rather than only at the end of each board-scan cycle (see maybeAutoTapSkill).
  this.skillAutoTap = false;
  this.skillAutoTapInterval = 500;
  this._lastSkillAutoTap = 0;
  this.unlockLevelHoursWait = 0;
  this.sendHearts = false;
  this.keepRuby = false;
  this.showHeartLog = true;
  this.sendHeartMaxDuring = 0;
  this.useFan = true;
  // record
  this.record = {
    hearts_count: {
      receivedCount: 0,
      sentCount: 0
    }
  };
  this.recordImages = {};
  this.receiveCheckLimit = 5;
  this.clearBubbles = true;
  this.autobuyBoxes = 0;
  this.noSkillLastFeverSec = 0;
  this.claimAllWithoutCoins = false;
  this.nextMonitorExecution = 0;
  this.lastVisitedPages = {init1: true, init2: true, init3: true};  // trigger initial monitor call on script startup
  // Layer 2 watchdog: track when the game last made progress. _lastProgress is
  // bumped whenever new lastVisitedPages keys appear; if it stalls past the
  // threshold the watchdog restarts the app.
  this._lastProgress = Date.now();
  this._lastSeenCount = 3;  // matches the 3 init keys above
  this.stuckTimeoutMs = 180 * 1000;
  this.sendHeartsDownwards = true;
  this.init(detect);
}

Tsum.prototype.init = function(detect) {
  log(this.logs.calculateScreenSize);
  let isFat = false;
  if (this.screenHeight / this.screenWidth < 1.5) {
    isFat = true;
    this.gameHeight = this.screenHeight;
    this.gameWidth = this.screenHeight / 1.5;
    this.gameOffsetY = Math.floor((this.gameWidth * 16 / 9 - this.gameHeight) / 2);
    this.gameOffsetX = Math.floor((this.gameWidth - this.screenWidth) / 2);
  } else {
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.screenWidth / 9 * 16;
    this.gameOffsetX = 0;
    this.gameOffsetY = Math.floor((this.gameHeight - this.screenHeight) / 2);
    console.log('??', this.gameHeight, this.screenHeight, this.gameWidth);
  }

  if (detect && this.screenHeight / this.screenWidth > 16 / 9) {
    log('detect screen size (special screen ratio)');
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.gameWidth * 1.5;
    this.gameOffsetX = 0;
    this.gameOffsetY = detectOffsetYInGame();
  }

  this.captureGameRatio = this.gameWidth / 1080;
  if (isFat) {
    this.playWidth = this.gameWidth;
    this.playOffsetX = Math.max(-this.gameOffsetX, 0);
  } else {
    this.playWidth = this.screenWidth;
    this.playOffsetX = 0;
  }
  // noinspection JSSuspiciousNameCombination
  this.playHeight = this.playWidth; // game has square dimension
  this.playOffsetY = 465 * this.captureGameRatio - this.gameOffsetY;

  this.sleep(200);
  log(this.logs.offset, this.gameOffsetX, this.gameOffsetY, this.screenHeight, this.screenWidth);
  this.sleep(1000);
  execute("mkdir -p " + this.storagePath + '/tmp');
  this.sleep(200);
  execute("mkdir -p " + this.storagePath + '/' + Config.recordDir);
}

Tsum.prototype.sendMoneyInfo = function() {
  if (!canSendMessage()) {
    return;
  }
  const x = Math.floor(Button.moneyInfoBox.x * this.captureGameRatio - this.gameOffsetX);
  const y = Math.floor(Button.moneyInfoBox.y * this.captureGameRatio - this.gameOffsetY);
  const w = Math.floor(Button.moneyInfoBox.w * this.captureGameRatio);
  const h = Math.floor(Button.moneyInfoBox.h * this.captureGameRatio);
  const img = getScreenshotModify(x, y, w, h, Button.moneyInfoBox.w / 2, Button.moneyInfoBox.h / 2, 80);
  let base64;
  try {
    base64 = getBase64FromImage(img);
  } finally {
    releaseImage(img);
  }
  log(this.logs.sendMessage);
  sendMessage("Tsum Tsum", base64);
}

Tsum.prototype.isAppOn = function() {
  if (!this.autoLaunch) {
    return true;
  }
  let result = execute('dumpsys window').split('mCurrentFocus');
  if (result.length < 2) {
    return false;
  }
  result = result[1].split(" ");
  if (result.length < 3) {
    return false;
  }
  result = result[2].split("/");
  if (result.length < 2) {
    return false;
  }
  const packageName = result[0];
  return packageName.indexOf('LGTMTM') !== -1;
};

function getPackageName(isJP) {
    let packageName = 'com.linecorp.LGTMTM';
    if (!isJP) {
        packageName += 'G';
    }
    return packageName;
}

function startTsumTsumApp(isJP) {
  const packageName = getPackageName(isJP);
  execute('BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar' +
      ' am start --activity-single-top -n ' + packageName + '/com.linecorp.LGTMTM.TsumTsum');
}

Tsum.prototype.startApp = function() {
  if (!this.autoLaunch) {
    return;
  }
  log(this.logs.startTsumTsumApp);
  startTsumTsumApp(this.isJP);
  this.sleep(10000);
  log("TsumTsum app starting.");
}

Tsum.prototype.screenshot = function() {
  return getScreenshotModify(
    0,
    0,
    this.originScreenWidth,
    this.originScreenHeight,
    this.originScreenWidth / this.resizeRatio,
    this.originScreenHeight / this.resizeRatio,
    80
  );
}

Tsum.prototype.playScreenshotSquare = function() {
  return getScreenshotModify(
    this.playOffsetX,
    this.playOffsetY,
    this.playWidth,
    this.playHeight,
    this.playResizeWidth,
    this.playResizeHeight,
    100
  );
}

Tsum.prototype.toResizeXY = function(x, y) {
  const rx = Math.floor((x * this.captureGameRatio - this.gameOffsetX) / this.resizeRatio);
  const ry = Math.floor((y * this.captureGameRatio - this.gameOffsetY) / this.resizeRatio);
  return {x: rx, y: ry};
}

Tsum.prototype.toResizeXYs = function(xy) {
  return this.toResizeXY(xy.x, xy.y);
}

Tsum.prototype.getColor = function(img, xy) {
  const rxy = this.toResizeXYs(xy);
  return getImageColor(img, Math.max(rxy.x, 0), Math.max(rxy.y, 0));
}

Tsum.prototype.toRealXY = function(x, y) {
  const rx = Math.floor(x * this.captureGameRatio - this.gameOffsetX);
  const ry = Math.floor(y * this.captureGameRatio - this.gameOffsetY);
  return {x: rx, y: ry};
}

Tsum.prototype.toRealXYs = function(xy) {
  return this.toRealXY(xy.x, xy.y);
}

Tsum.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  const rxy = this.toRealXYs(xy);
  tap(rxy.x, rxy.y, during);
}

Tsum.prototype.tapDown = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  const rxy = this.toRealXYs(xy);
  tapDown(rxy.x, rxy.y, during);
}

Tsum.prototype.moveTo = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  const rxy = this.toRealXYs(xy);
  moveTo(rxy.x, rxy.y, during);
}

Tsum.prototype.tapUp = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  const rxy = this.toRealXYs(xy);
  tapUp(rxy.x, rxy.y, during);
}

Tsum.prototype.linkTsums = function(path) {
  // Drag timings (ms). At 10ms the game often fails to register the initial
  // press or skips intermediate tsums, so a found 3+ chain never clears. Hold
  // a bit longer on press-down and give each move enough time to emit touch
  // samples the game can hit-test. Tune down if it feels sluggish.
  const grabDuring = 30;
  const moveDuring = 20;
  const releaseDuring = 20;
  for (let j = 0; j < path.length; j++) {
    const point = path[j];
    const x = Math.floor(this.playOffsetX + (point.x + Config.tsumWidth / 2) * this.playWidth / this.playResizeWidth);
    const y = Math.floor(this.playOffsetY + (point.y + Config.tsumWidth / 2) * this.playHeight / this.playResizeHeight);
    if (j === 0) {
      tapDown(x, y, grabDuring);
    }
    moveTo(x, y, moveDuring);
    if (j === path.length - 1) {
      tapUp(x, y, releaseDuring);
    }
  }
}

// When skillAutoTap is on, fire the skill the moment it's ready instead of
// waiting for the next useSkill at the end of the board-scan cycle. The gauge
// can fill and sit ready for seconds while we scan, calculate and link; this is
// called often (e.g. between chains) but only does a real screenshot/check once
// per skillAutoTapInterval ms, so the timestamp guard keeps frequent calls cheap.
// Routes through useSkill so every skill type's activation (and choreography) is
// handled exactly as the normal end-of-cycle path.
Tsum.prototype.maybeAutoTapSkill = function(board) {
  if (!this.skillAutoTap) { return; }
  const now = Date.now();
  if (now - this._lastSkillAutoTap < this.skillAutoTapInterval) { return; }
  this._lastSkillAutoTap = now;
  this.useSkill(board);
};

Tsum.prototype.link = function(paths, board) {
  let isBubble = false;
  let skillFires = 0;
  let myTsumLinked = 0;
  // Erase-type ("burst") skills charge off MyTsum chains and benefit from
  // overload priming the moment the gauge tops off (see pollSkillActivation).
  const eraseSkill = this.skillType === 'burst' || this.skillType === 'burst_bubbles' || this.skillType === 'block_cpt_ly_s';
  for (const i in paths) {
    const path = paths[i];
    // >= 7 should be correct, but practically the real chain is always shorter
    // so using a bigger value than theoretically correct
    if (path.length >= 12) {
      isBubble = true;
    }
    this.linkTsums(path);
    if (eraseSkill && this.myTsumIdx >= 0 && path.tsumIdx === this.myTsumIdx) {
      myTsumLinked += path.length;
    }
    // Linking a full batch of chains can take several seconds; check between
    // chains so a gauge that fills mid-batch fires right away.
    this.maybeAutoTapSkill(board);
  }
  // Prime once for the whole batch, sized by the total MyTsums erased. Several
  // short MyTsum chains then add up to a window long enough to catch the
  // overload -- priming each short chain alone missed it, because no single
  // chain topped the gauge off and the count-in lags behind each drag.
  if (myTsumLinked > 0) {
    skillFires = this.pollSkillActivation(myTsumLinked);
  }
  return { isBubble: isBubble, skillFires: skillFires };
}

Tsum.prototype.findPageObject = function(times, timeout) {
  if (times === undefined) {times = 2;}
  if (timeout === undefined) {timeout = 700;}
  const start = Date.now();
  let page = null;
  while(this.isRunning) {
    let currentPage = null;
    for (let t = 0; t < times; t++) {
      const img = this.screenshot();
      try {
        for (const key in Page) {
          page = Page[key];
          currentPage = null;
          const pageColors = page.colors || [];
          for (let i = 0; i < pageColors.length; i++) {
            const diff = absColor(pageColors[i], this.getColor(img, pageColors[i]));
            if ((diff < pageColors[i].threshold) === pageColors[i].match) {
              currentPage = page;
            } else {
              currentPage = null;
              break;
            }
          }
          if (currentPage !== null) {
            debug(this.logs.currentPage, currentPage.name + ' (' + key + ')', 'findPageObject');
            break;
          }
        }
      } finally {
        releaseImage(img);
      }
      this.sleep(100);
    } // for times
    if (currentPage !== null) {
      // trigger callback if defined
      if (typeof currentPage.onDetect === "function") {
        const callback = currentPage.onDetect;
        log("Applying fn " + callback.name + "...");
        callback.apply(this);
        log("Applied fn " + callback.name + ".");
      }
      return currentPage;
    }
    if (Date.now() - start > timeout) {
      return null;
    }
  }
}

Tsum.prototype.findPage = function(times, timeout) {
  const page = this.findPageObject(times, timeout);
  if (page !== null) {
    const name = page.name;
    switch (name) {
        case "GamePause":
        case "GamePlaying":
        case "StartPage":
        case "TsumsPage":
        case "TsumTsumStorePage":
          this.isStartupPhase = false;
    }
  }
  return page != null ? page.name : 'unknown';
}

Tsum.prototype.matchesPage = function (pageName) {
  let found = false;
  let img = null;
  try {
    for (const pageId in Page) {
      const page = Page[pageId];
      if (pageName === page.name) {
        if (img == null) {
          // lazy init only if page exists
          img = this.screenshot();
        }
        const colors = page.colors || [];
        found = false;
        for (let i = 0; i < colors.length; i++) {
          const color = colors[i];
          found = isSameColor(this.getColor(img, color), color, 20);
          if (!found) {
            break;  // try next page
          }
        }
        if (found)
          break;  // exit search
      }
    }
  } finally {
    if (img != null) {
      releaseImage(img);
    }
  }
  debug("*** Found", pageName, "=", found);
  return found;
}

Tsum.prototype.exitUnknownPage = function() {
  keycode('KEYCODE_DPAD_DOWN', 50);
  this.sleep(500);
  keycode('KEYCODE_ENTER', 50);
  this.tap(Button.gameQuestionCancel);
  this.tap(Button.gameQuestionCancel2);
  this.tap(Button.outClose);
  this.tap(Button.gameStop);
  this.sleep(500);
}

Tsum.prototype.goFriendPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    if (this.isStartupPhase) {
      // sleep longer to safely detect new event windows which might initially take longer to load
      this.sleep(5000);
    }
    const pageObj = this.findPageObject(2, 1000);
    let page = pageObj != null ? pageObj.name : "unknown";
    log(this.logs.currentPage, page, "goFriend");
    if (page === 'FriendPage') {
      // check again with 3 seoconds delay (Event notification/page might fly in)
      this.sleep(3000);
      page = this.findPage(1, 500);
      if (page === 'FriendPage') {
        this.sendMoneyInfo();
        this.isStartupPhase = false;
        return;
      }
    } else if (page === "ClosePage") {
      this.tap(pageObj.back);
      this.tap({x: 310, y: 1588 - 140});
    } else if (page === 'unknown') {
      this.exitUnknownPage();
    } else {
      this.tap(pageObj.back);
    }
    this.sleep(1000);
  }
}

Tsum.prototype.checkGameItem = function() {
  const isItemsOn = [false, false, false, false, false, false, false];
  if (this.scoreItem) {
    isItemsOn[0] = true;
  }
  if (this.coinItem) {
    isItemsOn[1] = true;
  }
  if (this.expItem) {
    isItemsOn[2] = true;
  }
  if (this.timeItem) {
    isItemsOn[3] = true;
  }
  if (this.bubbleItem) {
    isItemsOn[4] = true;
  }
  if (this.tsumCount === 4) {
    isItemsOn[5] = true;
  }
  if (this.comboItem) {
    isItemsOn[6] = true;
  }
  for(let t = 0; t < 3; t++) {
    const img = this.screenshot();
    let isChange = false;
    try {
      for (let i = 0; i < Button.outGameItems.length; i++) {
        const c = this.getColor(img, Button.outGameItems[i]);
        if (c.b > 128) { // off
          if (isItemsOn[i]) {
            this.tap(Button.outGameItems[i]);
            isChange = true;
            this.sleep(500);
          }
        } else { // on
          if (!isItemsOn[i]) {
            this.tap(Button.outGameItems[i]);
            isChange = true;
            this.sleep(500);
          }
        }
      }
    } finally {
      releaseImage(img);
    }
    console.log("Bonus items changed = " + isChange);
    if (!isChange) {
      break;
    }
    this.sleep(500);
  }
  debug(this.logs.checkBonusItems, isItemsOn);
}

Tsum.prototype.goGamePlayingPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    const pageObj = this.findPageObject(2, 2000);
    let page = pageObj != null ? pageObj.name : "unknown";
    log(this.logs.currentPage, page, "play");
    if (page === 'FriendPage') {
      this.tap(pageObj.next);
      this.sleep(3000);
      this.lastVisitedPages.gameFriend = true;
    } else if (page === 'StartPage') {
      this.sleep(500);
      this.checkGameItem();
      this.sendMoneyInfo();
      this.tap(Button.outStart);
      this.sleep(5000); // avoid checking items again!
      this.lastVisitedPages.gameStart = true;
    } else if (page === 'GamePlaying') {
      // check again
      page = this.findPage(1, 500);
      if (page === 'GamePlaying') {
        this.isStartupPhase = false;
        return;
      }
    } else if (page === 'GamePause') {
      this.isStartupPhase = false;
      this.tap(pageObj.next);
      this.sleep(500);
    } else if (page === 'unknown') {
      this.exitUnknownPage();
    } else if (page === "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
      this.sleep(1000);
    } else {
      this.tap(pageObj.back);
      this.sleep(1000);
    }
  }
}

Tsum.prototype.goTsumsPage = function() {
  if (!this.isAppOn()) {
    this.startApp();
  }
  this.goFriendPage();
  while(this.isRunning) {
    let page = this.findPageObject(2, 2000);
    if (page != null)
      log(this.logs.currentPage, page.name, "goTsumPage");
    if (page === null) {
      this.exitUnknownPage();
    } else if (page.name === 'TsumsPage') {
      // check again
      page = this.findPageObject(1, 500);
      if (page != null && page.name === 'TsumsPage') {
        return;
      }
    } else if (page.hasOwnProperty('tsums')) {
      this.tap(page.tsums);
      this.sleep(3000);
    } else {
      this.tap(page.back);
      this.sleep(1000);
    }
  }
}

Tsum.prototype.goTsumTsumStorePage = function() {
  if (this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    this.goTsumsPage();
    let pageName = "undefined";
    let page;
    for (let i = 0; i < 3; i++) {
      this.tap(this.findPageObject().store);
      this.sleep(3000);
      page = this.findPageObject(5, 2000);
      pageName = page != null ? page.name : 'unknown';
      log("Pg: ", pageName);
      if (page !== null && page.name === 'TsumTsumStorePage') {
        const img = this.screenshot();
        let nextColor;
        try {
          nextColor = this.getColor(img, page.next);
        } finally {
          releaseImage(img);
        }
        return isSameColor(page.next, nextColor, 50);
      }
    }
    log('Unexpected page found:', page, 'goTsumTsumStorePage');
    return false;
  }
}

Tsum.prototype.clearAllBubbles = function(startDelay, endDelay, fromY, delayBetweenLines) {
  delayBetweenLines = delayBetweenLines || 0;
  if (typeof startDelay === 'number' && startDelay > 0) {
    this.sleep(startDelay);
  }

  let fy = Button.gameBubblesFrom.y;
  if (typeof fromY == 'number') {
    fy = fromY;
  }

  for (let by = fy; by <= Button.gameBubblesTo.y; by += 140) {
    for (let bx = Button.gameBubblesFrom.x; bx <= Button.gameBubblesTo.x; bx += 140) {
      this.tap({x: bx, y: by}, 10);
    }
    this.sleep(delayBetweenLines);
  }

  if (typeof endDelay === 'number' && endDelay > 0) {
    this.sleep(endDelay);
  }
}

Tsum.prototype.useCinderellaSkill = function() {
  let path, offset, y;
  for (let i = 0; i < 5; i += 1) {
    for (offset = 0; offset <= 200; offset += 200) {
      path = [];
      for (y = 170; y >= 70; y -= 20)
        path.push({x: Math.abs(offset - 10), y: y});

      for (y = 60; y <= 180; y += 20)
        path.push({x: Math.abs(offset - 40), y: y});

      for (y = 180; y >= 60; y -= 20)
        path.push({x: Math.abs(offset - 70), y: y});

      for (y = 60; y <= 180; y += 20)
        path.push({x: Math.abs(offset - 100), y: y});

      debug("Cinderella i =", i, ", offset =", offset);
      this.linkTsums(path);
    }
  }
  this.sleep(3000);
  this.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2, 200);
}

Tsum.prototype.checkSkillReadiness = function(img, skillButton) {
  // Tiered version of isSkillActive's color check. Same reference colors, two
  // thresholds: tight (25) means firmly empty; loose (60) is the original
  // not-active match. Returns 'active', 'almost', or 'far'.
  const skillNotActiveColors = [
    {"a": 0, "b": 157, "g": 112, "r": 85},
    {"a": 0, "b": 181, "g": 139, "r": 72},
    {"a": 0, "b": 128, "g": 73, "r": 16},
    {"a": 0, "b": 178, "g": 153, "r": 3},
    {"a": 0, "b": 255, "g": 215, "r": 33}
  ];
  const c = this.getColor(img, skillButton);
  let matchesTight = false, matchesLoose = false;
  for (let i = 0; i < skillNotActiveColors.length; i++) {
    const nc = skillNotActiveColors[i];
    if (isSameColor(nc, c, 25)) { matchesTight = true; }
    if (isSameColor(nc, c, 60)) { matchesLoose = true; }
  }
  if (!matchesLoose) { return 'active'; }
  if (!matchesTight) { return 'almost'; }
  return 'far';
};

Tsum.prototype.isFeverActive = function(img: any) {
  // Same probes useSkill's fever hold uses: the fever banner colour plus the two
  // spinning ring lights at the bottom corners, which differ in hue only while
  // fever is running.
  const fever1 = isSameColor(this.getColor(img, {x: 340, y: 310}), {r: 0, g: 40, b: 49}, 80);
  const ringLeft = rgb2hsv(this.getColor(img, {x: 332, y: 1666}));
  const ringRight = rgb2hsv(this.getColor(img, {x: 746, y: 1666}));
  const hueDiff = Math.min(
      Math.abs(ringLeft.h - ringRight.h),
      360 - Math.abs(ringLeft.h - ringRight.h));
  return fever1 && hueDiff > 20;
};

Tsum.prototype.hammerSkillButton = function(deadline: number) {
  // Fever Time path. During fever the count-in is so fast that the gauge tops
  // off and finishes counting between our screenshots, so screenshot-paced
  // priming taps a button whose overflow is already gone. Instead tap
  // continuously with no idle gap -- the game fires the skill the instant the
  // gauge crosses full, and a fast refill fires again a few taps later, so the
  // overflow carries. Screenshot only occasionally, purely to stop once the
  // gauge has stopped refilling (the batch is done counting in).
  let active = 0;   // checks where the gauge was busy -- rough fire count for bubbles
  let farRuns = 0;
  let nextCheck = Date.now() + 250;
  while (Date.now() < deadline) {
    this.tap(Button.gameSkill1, 8);
    this.sleep(10);
    if (Date.now() >= nextCheck) {
      nextCheck = Date.now() + 250;
      const img = this.screenshot();
      let far: boolean;
      try {
        far = this.checkSkillReadiness(img, Button.gameSkill1) === 'far';
      } finally {
        releaseImage(img);
      }
      if (far) {
        if (++farRuns >= 2) { break; }  // gauge idle two checks running -- done
      } else {
        farRuns = 0;
        active++;
      }
    }
  }
  return active;
};

Tsum.prototype.pollSkillActivation = function(chainLength: number) {
  // Overloading: erased MyTsums count into the skill gauge over a short window
  // rather than all at once. Firing the skill the instant the gauge tops off —
  // while tsums are still counting in — lets the remaining count overflow into
  // the next gauge instead of being wasted against the 100% cap. A long chain
  // can top the gauge off more than once.
  //
  // We don't try to detect the exact fill instant (screenshot latency loses the
  // overflow). Instead we keep the skill button primed across the whole
  // count-in window: tapping a not-yet-full button is harmless, and the game
  // fires the skill itself the moment the gauge crosses full. After each fire
  // we keep priming so a second overload from the same batch is also caught.
  //
  // chainLength is the *total* MyTsums erased this batch, so several short
  // chains widen the window together. The count-in lags the drag, so a 'far'
  // reading right after linking can just mean the tsums haven't registered yet
  // -- we tolerate 'far' for a short grace before giving up. That's what lets
  // multiple short chains get fired: the old instant far-bail read the gauge
  // before the count caught up and quit, so only a self-sufficient long chain
  // ever topped it off in time.
  const deadline = Date.now() + Math.min(1600, 300 + (chainLength || 0) * 45);
  let fires = 0;
  let farSince = Date.now();
  while (Date.now() < deadline) {
    let img = this.screenshot();
    let status: string;
    let fever: boolean;
    try {
      status = this.checkSkillReadiness(img, Button.gameSkill1);
      // Burst skills switch to blind hammering during Fever Time, where the
      // count-in is too fast for screenshot-paced priming to catch the overflow.
      // cpt_ly is excluded: it fires once and needs its aiming choreography.
      fever = this.skillType !== 'block_cpt_ly_s' && this.isFeverActive(img);
    } finally {
      releaseImage(img);
    }
    if (fever) {
      return fires + this.hammerSkillButton(deadline);
    }
    if (status === 'active') {
      this.tap(Button.gameSkill1, 10);  // fire it
      fires++;
      if (this.skillType === 'block_cpt_ly_s') {
        // cpt_ly is a block skill: the button tap only activates it -- it still
        // needs its aiming choreography to actually score. Run it, then stop
        // (unlike burst, it doesn't repeat-overload within a batch).
        this.useCptLySkill();
        return fires;
      }
      this.sleep(150);  // let the gauge consume before re-priming, avoid double-fire
      farSince = Date.now();
      continue;
    }
    this.tap(Button.gameSkill1, 10);  // prime (no-op while the gauge isn't full)
    if (status === 'far') {
      // Give the count-in time to land; if the gauge stays far past the grace
      // the batch simply isn't topping it off, so stop to avoid stalling.
      if (Date.now() - farSince > 350) { break; }
    } else {
      farSince = Date.now();  // 'almost' -- fill is imminent, keep priming
    }
    this.sleep(35);
  }
  return fires;
};

// cpt_ly post-activation choreography: randomize, then the timed aiming taps
// (count scales with skill level), then a bubble sweep. Assumes the skill has
// already been activated (gauge consumed) -- callers tap gameSkill1 first.
Tsum.prototype.useCptLySkill = function() {
  this.tap(Button.gameRand, 100);
  this.sleep(2100);
  this.tap(Button.skillCptLy1, 10);
  this.sleep(50);
  this.tap(Button.skillCptLy2, 10);
  if (this.skillLevel >= 2) {
    // 3rd tap
    this.sleep(500);
    this.tap(Button.skillCptLy3, 10);
  }
  if (this.skillLevel >= 4) {
    // 4th tap
    this.sleep(500);
    this.tap(Button.skillCptLy3, 10);
  }
  if (this.skillLevel === 6) {
    // 5th tap
    this.sleep(550);
    this.tap(Button.skillCptLy3, 10);
  }
  this.clearAllBubbles(600, 0, 1000, 300);
};

Tsum.prototype.useSkill = function(board) {
  function isSkillActive(that, img, skillButton) {
    // Don't know the reason why these are checked instead the "active skill" colors, but hopefully for a good reason
    const skillNotActiveColors = [
      {"a": 0, "b": 157, "g": 112, "r": 85},
      {"a": 0, "b": 181, "g": 139, "r": 72},
      {"a": 0, "b": 128, "g": 73, "r": 16},
      {"a": 0, "b": 178, "g": 153, "r": 3},
      {"a": 0, "b": 255, "g": 215, "r": 33}
    ];
    const currentButtonColor = that.getColor(img, skillButton);
    let skillActive = true;
    for (const colorIdx in skillNotActiveColors) {
      const color = skillNotActiveColors[colorIdx];
      const matchesSkillNotActiveColor = isSameColor(color, currentButtonColor, 60);
      // console.log(JSON.stringify(skillButton) + " - " + JSON.stringify(color) + " matches actual color " + JSON.stringify(currentButtonColor) + " = " + matchesSkillNotActiveColor);
      skillActive = skillActive && !matchesSkillNotActiveColor;
    }
    return skillActive;
  }

  if (this.skillType === 'no_skill') {
    return false;
  }

  const page = this.findPage(1, 500);
  if (page !== 'GamePlaying' && page !== 'GamePause') {
    return false;
  }

  // Hoisted to function scope: these are reused with cross-block assignment by
  // the skill-specific branches further down (formerly relied on var hoisting).
  let img: any, color: any, i: number;
  let skillActive2;
  for (i = 0; i < 2; i++) {
    img = this.screenshot();
    let skillActive1;
    try {
      skillActive1 = isSkillActive(this, img, Button.gameSkill1);
      skillActive2 = this.skillType === 'block_pair_tsum' && isSkillActive(this, img, Button.gameSkill2);
    } finally {
      releaseImage(img);
    }
    if (skillActive1 || skillActive2) {
      if (i === 0) {
        this.sleep(200);
      }
    } else {
      this.lastVisitedPages.gameSkillInactive = true;
      return false;
    }
  }
  this.lastVisitedPages.gameSkillActive = true;
  if (this.noSkillLastFeverSec > 0) {
    let feverAlmostOver = null;
    do {
      if (feverAlmostOver) {
        this.sleep(100);
      }
      feverAlmostOver = (function (tsum) {
        // skip skill activation if fever and fever almost over and enough seconds remaining
        const img = tsum.screenshot();
        try {
          const fever1 = isSameColor(tsum.getColor(img, {x: 340, y: 310}), {r: 0, g: 40, b: 49}, 80);
          const feverRingLeft = rgb2hsv(tsum.getColor(img, {x: 332, y: 1666}));
          const feverRingRight = rgb2hsv(tsum.getColor(img, {x: 746, y: 1666}));
          const hueDifference = Math.min(
              Math.abs(feverRingLeft.h - feverRingRight.h),
              360 - Math.abs(feverRingLeft.h - feverRingRight.h));
          const fever2 = hueDifference > 20;
          const feverStartColorHsv = rgb2hsv(tsum.getColor(img, {x: 345, y: 1670}));
          const offsetX = Math.floor((733 - 345) * tsum.noSkillLastFeverSec / 10);
          const feverEndColorHsv = rgb2hsv(tsum.getColor(img, {x: 345 + offsetX, y: 1670}));
          const feverAlmostOver = feverEndColorHsv.v < 90 || Math.abs(feverStartColorHsv.v - feverEndColorHsv.v) > 10;
          const remainingTimeColor = tsum.getColor(img, {x: 155, y: 190});
          const fewSecondsLeftColor = tsum.getColor(img, {x: 144, y: 195});
          const enoughSecondsRemaining = isSameColor(remainingTimeColor, fewSecondsLeftColor, 60);
          // debug({fever1: fever1, fever2: fever2, almostOver: feverAlmostOver, enoughTime: enoughSecondsRemaining});
          return fever1 && fever2 && feverAlmostOver && enoughSecondsRemaining;
        } finally {
          releaseImage(img);
        }
      })(this);
    } while (feverAlmostOver);
  }
  log(this.logs.useSkill);
  if (this.skillType === 'block_lukej_s') {
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
  } else if (this.skillType === 'block_lightning_mcqueen_plus_s') {
    this.sleep(200);  // let tsums settle
  }
  this.tap(Button.gameSkill1);
  this.sleep(30);
  if (skillActive2) {
    this.tap(Button.gameSkill2);
    this.sleep(30);
  }
  if (this.skillType === 'block_lukej_s') {
    for (let i = 0; i < 5; i++) {
      this.tapDown({x: 820, y: 1200}, 20);
      this.moveTo({x: 820, y: 1150}, 20);
      if (i === 0) {
        this.sleep(1160);
      }
      this.sleep(350);
      this.moveTo({x: 825, y: 1000}, 20);
      this.sleep(100);
      this.moveTo({x: 835, y: 800}, 20);
      this.sleep(100);
      this.moveTo({x: 845, y: 600}, 20);
      this.sleep(100);
      this.moveTo({x: 850, y: 450}, 20);
      this.tapUp({x: 850, y: 420}, 20);
      this.sleep(20);
    }
    this.sleep(400);
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
    this.sleep(400);
  } else if (this.skillType === 'block_donald_s' || this.skillType === 'block_donaldx_s') {
    for (let i1 = 0; i1 < 3; i1++) {
      for (let bx = Button.gameBubblesFrom.x - 40; bx <= Button.gameBubblesTo.x + 40; bx += 150) {
        for (let by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y + 100; by += 150) {
          this.tap({x: bx, y: by}, 10);
        }
      }
    }
  } else if (this.skillType === 'block_marie_s' || this.skillType === 'block_missbunny_s' || this.skillType === 'block_rabbit_s') {
    this.clearAllBubbles(2000, 50);
  } else if(this.skillType === 'block_moana_s') {
    this.clearAllBubbles(2500, 50);
  } else if(this.skillType === 'block_mickeyh2015_s') {
    this.clearAllBubbles(1500, 50);
  } else if(this.skillType === 'block_snowwhite_s') {
    this.clearAllBubbles(1300);
    this.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
  } else if(this.skillType === 'block_cinderella_s') {
    this.sleep(1500);
    this.useCinderellaSkill(board);
  } else if(this.skillType === 'block_woody2_s'){
    this.sleep(1800);
    this.tapDown({x: 540, y: 960}, 20);
    this.moveTo({x: 980, y: 960}, 20);
    this.sleep(50);
    for (let i = 0; i < 3; i++) {
      this.moveTo({x: 100, y: 960}, 20);
      this.sleep(420);
      this.moveTo({x: 980, y: 960}, 20);
      this.sleep(480);
    }
    this.tapUp({x: 980, y: 960}, 20);
  } else if (this.skillType === 'block_cabbage_mickey_s') {
    // wait for all cabbages being placed
    this.sleep(3300);
    // find mickey in cabbage
    const colorMickeyFace = {r: 245, g: 225, b: 210};
    const startTime = Date.now();
    let foundMickey = false;
    let maybeMickey = null;
    color = null;
    const maxTries = 5;
    for (let tries = 1; tries <= maxTries && !foundMickey; tries++) {
      this.sleep(100);
      img = this.screenshot();
      try {
        smooth(img, 2, 5);
        for (let y = 720; y < 1380 && !foundMickey; y += 25) {
          for (let x = 120; x < 1000 && !foundMickey; x +=60) {
            maybeMickey = {x: x, y: y};
            color = this.getColor(img, maybeMickey);
            // if (color.r >= 140)
            //   color.r = 255;
            foundMickey = foundMickey || isSameColor(colorMickeyFace, color, 20);
            if (foundMickey) {
              let up, down, left, right;
              up = down = left = right = maybeMickey;
              up.y -= 10;
              down.y += 10;
              left.x -= 10;
              right.x += 10;
              foundMickey = (
                      isSameColor(colorMickeyFace, this.getColor(img, up), 20)
                      || isSameColor(colorMickeyFace, this.getColor(img, down), 20))
                  && (
                      isSameColor(colorMickeyFace, this.getColor(img, left), 20)
                      || isSameColor(colorMickeyFace, this.getColor(img, right), 20));
            }
            if (this.debug) {
              // logical width is 1080, screenshot usually 360, so reduce xy by factor 3
              drawCircle(img, x / 3, y / 3, 4, foundMickey ? 0 : 255, foundMickey ? 255 : 0, 0, 0);
            }
          }
        }
        if (!foundMickey) {
          debug("*** Didn't find Mickey! ***", function () {
            if (ts.debug) {
              saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey_not_found-" + ts.runTimes + "-" + tries + ".jpg");
              return "Saved screenshot";
            } else {
              return "";
            }
          });
        } else {
          if (this.debug) {
            saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey-" + ts.runTimes + "-" + tries + ".jpg");
          }
        }
      } finally {
        releaseImage(img);
      }
    }
    if (foundMickey && maybeMickey != null) {
      debug("Found mickey at position", maybeMickey, "with color", color, "in", Date.now() - startTime, "ms.");
      const tapXY = {x: maybeMickey.x + 15, y: maybeMickey.y + 15};
      for (i = 0; i < 10; i++)
        this.tap(tapXY);
      this.sleep(1000);
    } else {
      this.clearAllBubbles();
    }
  } else if (this.skillType === 'block_cpt_ly_s'){
    this.useCptLySkill();
  } else if (this.skillType === 'block_lightning_mcqueen_plus_s'){
    this.sleep(2000);
    for (i = 1; i <= 20; i+=1) {
      this.sleep(50);
      img = this.playScreenshotSquare();
      try {
        color = getImageColor(img, 120, 184);
        if (isSameColor({r: 245, g: 0, b: 0}, color, 10)) {
          // max speed detected
          this.tap({x: 670, y: 1050}, 10);  // tap somewhere into the game
          i = 20;
        }
      } finally {
        releaseImage(img);
      }
    }
    this.sleep(2500);
    // this.clearAllBubbles(600, 0, 1000, 300);
  } else {
    this.tap(Button.gameRand, 100); // randomize tsums if tsum supports it
    this.sleep(this.skillInterval - 100);
    if (this.skillType === 'burst_bubbles') {
      this.clearAllBubbles(0, 0, 1000, 300);
    }
  }
  return true;
}

Tsum.prototype.sampleMyTsumColor = function() {
  // The MyTsum portrait is the circular icon inside the skill button at the
  // bottom-left of the play area. Sample a small region around its center,
  // run the same smooth + HSV pipeline as findTsums, and average central
  // pixels so the result is directly comparable to tsum cluster colors.
  const center = this.toRealXY(Button.gameSkill1.x, Button.gameSkill1.y);
  const sampleR = Math.max(4, Math.floor(40 * this.captureGameRatio));
  const x = Math.max(0, center.x - sampleR);
  const y = Math.max(0, center.y - sampleR);
  const img = getScreenshotModify(x, y, sampleR * 2, sampleR * 2, 40, 40, 100);
  try {
    smooth(img, 1, 7);
    convertColor(img, 40);
    if (!Config.experimentalConnections) {
      smooth(img, 1, 22);
      let sumB = 0, sumG = 0, sumR = 0, count = 0;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const c = getImageColor(img, 20 + dx, 20 + dy);
          sumB += c.b; sumG += c.g; sumR += c.r;
          count++;
        }
      }
      return { b: sumB / count, g: sumG / count, r: sumR / count };
    }
    smooth(img, 1, Config.colorSampleSmooth);
    const pts = [];
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        pts.push({x: 20 + dx, y: 20 + dy});
      }
    }
    const cs = getPixelColors(img, pts);
    const hs = [], ss = [], vs = [];
    for (let i = 0; i < cs.length; i++) {
      hs.push(cs[i].b); ss.push(cs[i].g); vs.push(cs[i].r);
    }
    return { b: median(hs), g: median(ss), r: median(vs) };
  } finally {
    releaseImage(img);
  }
};

Tsum.prototype.scanBoardQuick = function() {
  // load game tsums
  const startTime = Date.now();
  const srcImg = this.playScreenshotSquare();
  const board = [];
  try {
    if (this.isPause) {
      this.tap(Button.gamePause);
      this.sleep(20);
      this.tap(Button.gamePause);
    }

    const points = findTsums(srcImg);
    debug(this.logs.recognitionStart);
    const tcs = classifyTsums(points, this.tsumCount);
    tcs.sort(function(a, b) { return a.points.length > b.points.length ? -1: 1; });
    if (this.debug) {
      // HSV cluster centers — compare these (and the inter-cluster distance3D)
      // against the boardImg circles when tuning the color-clustering settings.
      let classified = 0;
      for (let ci = 0; ci < tcs.length; ci++) {
        classified += tcs[ci].points.length;
        let line = 'cluster ' + ci + ': n=' + tcs[ci].points.length
          + ' hsv=(' + Math.round(tcs[ci].b) + ',' + Math.round(tcs[ci].g) + ',' + Math.round(tcs[ci].r) + ')';
        for (let cj = 0; cj < ci; cj++) {
          line += ' d' + cj + '=' + Math.round(distance3D(tcs[ci], tcs[cj]));
        }
        console.log(line);
      }
      // If "dropped" is regularly high, the noise cutoff (colorMergeDist) is
      // eating real tsums — raise it.
      console.log('detected ' + points.length + ' tsums, dropped ' + (points.length - classified) + ' as color noise');
    }

    // Identify which color cluster (if any) is the player's MyTsum by matching
    // the skill-button portrait color against cluster centers.
    if (!this.myTsumColor) {
      this.myTsumColor = this.sampleMyTsumColor();
      if (this.debug) { console.log('MyTsum color', JSON.stringify(this.myTsumColor)); }
    }
    this.myTsumIdx = -1;
    let bestMyDist = 30;
    for (let ci = 0; ci < tcs.length && ci < this.tsumCount - 1; ci++) {
      const dMy = distance3D(tcs[ci], this.myTsumColor);
      if (dMy < bestMyDist) {
        bestMyDist = dMy;
        this.myTsumIdx = ci;
      }
    }

    for(const i in tcs) {
      if (+i >= this.tsumCount - 1) {
        break;
      }
      const tc = tcs[i];
      for (const j in tc.points) {
        const p = tc.points[j];
        board.push({tsumIdx: i, x: p.x - (Config.tsumWidth / 2), y: p.y - (Config.tsumWidth / 2)});
        if (this.debug) {
          drawCircle(srcImg, p.x, p.y, 4, Config.colors[i][0], Config.colors[i][1], Config.colors[i][2], 0);
        }
      }
    }
    if (this.debug) {
      saveImage(srcImg, this.storagePath + "/tmp/" + ts.runTimes + "-boardImg.jpg");
    }
  } finally {
    releaseImage(srcImg);
  }
  debug(this.logs.recognizedTsums, board.length);
  sleep(30);
  debug(this.logs.recognitionTime, usingTimeString(startTime));

  if (this.isPause) {
    this.sleep(Config.gameContinueDelay);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
  }

  return board;
}

Tsum.prototype.taskPlayGameQuick = function() {
  this.requestTsumMonitor();
  log(this.logs.gameStart);
  this.goGamePlayingPage();
  log(this.logs.fastGaming);
  if (this.isPause) {
    this.sleep(350);
  }
  this.runTimes = 0;
  this.myTsumColor = null;  // re-sample MyTsum portrait at the start of each game
  this.myTsumIdx = -1;
  let clearBubbles = 0;
  let zeroPath = 0;
  while(this.isRunning) {
    gPause.gate();  // honor keypress pause mid-game, between link cycles
    const board = this.scanBoardQuick();
    if (board == null) {
      break;
    }
    debug(this.logs.calculationPathStart);
    let paths = calculatePaths(board, this.logs, this.myTsumIdx, this.bonus5to4);
    // Each linked chain is a clear that refreshes the combo timer; the combo
    // is only at risk during the scan gap between batches. More chains per
    // scan means fewer gaps, but chains linked late in a batch can miss
    // because earlier clears already reshuffled the board.
    paths = paths.splice(0, this.maxChainsPerScan);
    // Catch a gauge that filled during the scan/calculation above before linking.
    this.maybeAutoTapSkill(board);
    const linkResult = this.link(paths, board);
    if (linkResult.isBubble) {
      debug(this.logs.bubbleGenerated);
      clearBubbles++;
    }
    // Overload priming may have fired the skill mid-link (outside the useSkill
    // loop below). For burst_bubbles each fire spawns bubbles, so count them
    // toward the clear cadence just like the useSkill loop does.
    if (this.skillType === 'burst_bubbles' || this.skillType === 'block_cpt_ly_s') {
      clearBubbles += linkResult.skillFires;
    }
    if (paths.length < 3) {
      zeroPath++;
      if (zeroPath === 6) {
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
        zeroPath = 0;
      }
    }
    // click bubbles
    if (this.clearBubbles && clearBubbles >= 2) {
      debug(this.logs.clearBubbles);
      clearBubbles = 0;
      // only clearing lower area in order to speed up the cleaning process
      this.clearAllBubbles(0, 0, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
    }
    if (this.useFan && this.runTimes % 4 === 3) {
      // Skip the fan when the skill is ready or about to be — useSkill() will
      // fire it next (or the next clear will fill the gauge), so the fan would
      // just be wasted on tsums about to be cleared.
      const fanImg = this.screenshot();
      let skillStatus;
      try {
        skillStatus = this.checkSkillReadiness(fanImg, Button.gameSkill1);
      } finally {
        releaseImage(fanImg);
      }
      if (skillStatus === 'far') {
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
      }
    }
    if (this.isPause) {
      this.sleep(300);
    }
    while (this.useSkill(board)) {
      if (this.skillType !== "block_cpt_ly_s") {
        clearBubbles++;
      }
    }

    // double check
    let page = this.findPage(1, 2500);
    if (page !== 'GamePlaying' && page !== 'GamePause') {
      this.sleep(500);
      page = this.findPage(1, 2500);
      if (page !== 'GamePlaying' && page !== 'GamePause') {
        log(this.logs.gameOver);
        break;
      }
    }
    this.runTimes++;
  }
}

Tsum.prototype.taskReceiveAllItems = function() {
  if (this.findPage() === 'GamePause')
    return;
  this.requestTsumMonitor();
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000);
  log(this.logs.receiveAllGifts);
  this.tap(Button.outReceive);
  this.sleep(3500);
  this.tap(Button.outReceiveAll);
  this.sleep(2500);
  this.fetchAllMails();
  this.sleep(2000);
  this.tap(Button.outReceiveClose);
  this.sleep(1500);
  this.tap(Button.outClose);
  this.goFriendPage();
  log(this.logs.allGiftsReceived);
}

Tsum.prototype.fetchAllMails = function() {
  const intlOkButton = Button.outReceiveOk;
  const jpOkButton = Button.outReceiveAllOkJP;

  const img = this.screenshot();

  try {
    if (this.isOnScreenshot(img, intlOkButton, 35)) {
      this.tap(intlOkButton);
    } else if (this.isOnScreenshot(img, jpOkButton, 35)) {
      // check important previous buttons before pressing OK
      if (this.keepRuby && this.isOnScreenshot(img, Button.outReceiveAllRubiesEnabledJP)) {
        this.tap(Button.outReceiveAllRubiesEnabledJP);
        this.sleep(500);
      }
      if (this.isOnScreenshot(img, Button.outReceiveAllHeartsDisabledJP)) {
        this.tap(Button.outReceiveAllHeartsDisabledJP);
        this.sleep(500);
      }
      this.tap(jpOkButton);
    } else {
      log("ERROR! No OK button found!");
      this.exitUnknownPage();
    }
  } finally {
    releaseImage(img);
  }
}

Tsum.prototype.readRecord = function() {
  log(this.logs.readRecords);
  const recordDir = this.storagePath + '/' + Config.recordDir;
  const recordFile = recordDir + '/record.txt';
  const txt = readFile(recordFile);
  if (txt !== undefined && txt !== "") {
    this.record = JSON.parse(txt);
  }
  for (const filename in this.record) {
    if (filename !== "hearts_count") {
      this.recordImages[filename] = openImage(recordDir + '/' + filename);
    }
  }
}

Tsum.prototype.recognizeSender = function(img) {
  log(this.logs.recognizingHeartSender);
  const recordDir = this.storagePath + '/' + Config.recordDir;
  const from = this.toResizeXYs(Button.outReceiveNameFrom);
  const to = this.toResizeXYs(Button.outReceiveNameTo);
  const nameImg = cropImage(img, Math.floor(from.x), Math.floor(from.y), Math.floor(to.x - from.x), Math.floor(to.y - from.y));
  let score = 0;
  let existFilename = '';
  for(const key in this.recordImages) {
    if (this.recordImages[key] !== 0) {
      score = getIdentityScore(nameImg, this.recordImages[key]);
      if (score >= 0.98) {
        existFilename = key;
        log(this.logs.recognitionScore + " > 0.98", key, score);
        break;
      }
    }
  }
  // console.log("Score: " + score);
  if (existFilename === '') {
    const now = nowTime();
    const dayTime = Math.floor(now / (24 * 60 * 60 * 1000));
    // not found, new friend
    const filename = 'f_' + now + '.png';
    this.record[filename] = {
      receiveCounts: {},
      lastReceiveTime: now
    };
    this.record[filename].receiveCounts[dayTime] = 1;
    this.recordImages[filename] = nameImg;
    const path = recordDir + '/' + filename;
    log(this.logs.saveNewFriend, path);
    saveImage(nameImg, path);
    this.sleep(80);
    const check = execute("ls " + path);
    if (check.indexOf(filename) === -1) {
      log(this.logs.saveNewFriendAgain);
      saveImage(nameImg, path);
    }
  } else {
    releaseImage(nameImg);
  }
  return existFilename;
}

Tsum.prototype.countReceiveHeart = function(existFilename) {
  if (!existFilename) {
    return;
  }
  log(this.logs.calculatingHeartSender);
  const now = nowTime();
  const dayTime = Math.floor(now / (24 * 60 * 60 * 1000));
  // found
  if (this.record[existFilename].receiveCounts[dayTime] === undefined) {
    this.record[existFilename].receiveCounts[dayTime] = 0;
  }
  this.record[existFilename].receiveCounts[dayTime]++;
  this.record[existFilename].lastReceiveTime = now;
  log(this.logs.receiveHeartFromHeartSender, this.record[existFilename].receiveCounts[dayTime], this.logs.hearts);
}

Tsum.prototype.saveRecord = function() {
  log(this.logs.saveRecords);
  const recordFile = this.storagePath + '/' + Config.recordDir + '/record.txt';
  writeFile(recordFile, JSON.stringify(this.record));
}

Tsum.prototype.releaseRecord = function() {
  for(const filename in this.recordImages) {
    releaseImage(this.recordImages[filename]);
  }
  this.record = {};
  this.recordImages = {};
}

Tsum.prototype.clear = function() {
  const recordDir = getStoragePath() + '/' + Config.recordDir;
  execute('rm -r ' + recordDir);
}

Tsum.prototype.skipAd = function () {
  this.tap(Button.outReceiveOne);
  this.sleep(1000);
  // also gets called for skill and premium tickets, so check we really have an ad!!!
  if (this.matchesPage('ReceiveSkillTicket') || this.matchesPage('ReceivePremiumTicket')) {
    // mcs: I improved ad detection here because I don't get ad mails. So I cannot improve detection in list view
    log("Receive ticket");
    this.tap(Button.outReceiveOk);
  } else {
    log("Ignore Ad");
    if (Config.debugLogs) {
      const img = this.screenshot();
      try {
        saveImage(img, this.storagePath + "/tmp/" + this.runTimes + "-detectedAd.jpg");
      } finally {
        releaseImage(img);
      }
    }
    this.sleep(4000);
    // delete ad
    this.tap({ x: 462, y: 1095});
    this.sleep(4000);
    this.tap({ x: 172, y: 1220});
    this.sleep(2000);
    this.tap({ x: 556, y: 1417});
  }
}

Tsum.prototype.taskReceiveOneItem = function() {
  if (this.findPage() === 'GamePause')
    return;
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000)
  this.tap(Button.outReceive);
  log(this.logs.receiveGiftsOneByOne);
  this.sleep(1000);

  let receivedCount = 0;
  let receiveCheckLimit = 1;

  let sender = undefined;
  let receiveTime = Date.now();
  let timeoutCounter = 0;
  const maxTimeoutCount = 100;
  let receivedHeartWithoutCoins = 0;
  while (this.isRunning && timeoutCounter < maxTimeoutCount) {
    this.requestTsumMonitor();
    let img = this.screenshot();
    // Declared outside the try so the if-chain below (and the later
    // `isNonItem = true`) can read them after the screenshot is released.
    let isItem: boolean, isRuby: boolean, isNonItem: boolean, isAd: boolean,
        isOk: boolean, isOk2: boolean, isTimeout: boolean, isHeartWithoutCoins: boolean;
    try {
      isItem = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 35);
      isRuby = isSameColor(Button.outReceiveOneRuby.color, this.getColor(img, Button.outReceiveOneRuby), 35);
      isNonItem = isSameColor(Button.outReceiveOne.color2, this.getColor(img, Button.outReceiveOne), 35);
      isAd = isSameColor(Button.outReceiveOneAd.color, this.getColor(img, Button.outReceiveOneAd), 35);
      isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 35);
      isOk2 = isSameColor(Button.outReceiveItemSetOk.color, this.getColor(img, Button.outReceiveItemSetOk), 35);
      isTimeout = isSameColor(Button.outReceiveTimeout.color, this.getColor(img, Button.outReceiveTimeout), 35);
      isHeartWithoutCoins = this.matchesPage('ReceiveHeartWithoutCoins');
      debug({
        isItem: isItem, isRuby: isRuby, isNonItem: isNonItem, isAd: isAd, isOk: isOk,
        isTimeout: isTimeout, timeoutCounter: timeoutCounter
      });
    } finally {
      releaseImage(img);
    }
    if (isItem) {
      if (isAd) {
        debug("handle ad");
        this.skipAd();
        this.sleep(2000);
        this.lastVisitedPages.receiveOneItemIsAd = true;
        continue;
      }
      if (receivedHeartWithoutCoins > 2) {
        if (receivedCount <= 5 + receivedHeartWithoutCoins) {
          this.sleep(2000);
          debug("Should receive all now");
          this.taskReceiveAllItems();
          this.tap(Button.outReceive);
          this.sleep(1500);
        }
        debug("Closing");
        this.tap(Button.outClose);
        receivedHeartWithoutCoins = 0;
        this.tap(Button.outClose);
        this.goFriendPage();
        this.sleep(500);
        receivedCount = 0;
        sender = "";
        timeoutCounter = 0;
        log(this.logs.checkUnreceivedGift);
        this.sleep(500);
        this.tap(Button.outReceive);
        this.sleep(1500);
      } else if (!this.keepRuby || !isRuby) {
        this.lastVisitedPages.receiveOneItemReceiving = true;
        if (this.recordReceive) {
          img = this.screenshot();
          try {
            const isItem2 = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 30);
            if (isItem2) {
              this.tap(Button.outReceiveOne);
              sender = this.recognizeSender(img);
            }
          } finally {
            releaseImage(img);
          }
        } else {
          sender = "";
        }
        this.tap(Button.outReceiveOne);
        this.sleep(200);
        timeoutCounter = 0;
      } else {
        isNonItem = true;
        receiveTime = 0;
      }
    } else if (isTimeout) {
      debug("isTimeout", "taskReceiveOneItem");
      log(this.logs.receiveGiftAgain);
      this.tap(Button.outReceiveOk);
      this.sleep(1000);
      timeoutCounter = 0;
    } else if (isOk || isOk2) {
      if (this.recordReceive && sender !== undefined && sender !== "") {
        this.countReceiveHeart(sender);
        this.saveRecord();
      }
      this.sleep(100);
      if (isOk) {
        debug("isOK", "taskReceiveOneItem")
        this.lastVisitedPages.receiveOneItemIsOK = true;
        this.tap(Button.outReceiveOk);
      } else {
        debug("isOK2", "taskReceiveOneItem")
        this.lastVisitedPages.receiveOneItemIsOK2 = true;
        this.tap(Button.outReceiveItemSetOk);
      }
      if (sender !== undefined) {
        this.record['hearts_count'].receivedCount++;
        receivedCount++;
      }
      sender = undefined;
      timeoutCounter = 0;
      if (this.claimAllWithoutCoins &&  isHeartWithoutCoins)
        receivedHeartWithoutCoins++;
    } else {
      debug("fetched all so far", "taskReceiveOneItem");
      this.tap(Button.outReceiveClose); // usual close button
    }
    this.sleep(200);

    if (!isNonItem) {
      receiveTime = Date.now();
    }

    if (Date.now() - receiveTime > 3000) {
      debug("took more than 3 seconds", "taskReceiveOneItem");
      this.tap(Button.outClose);
      this.goFriendPage();
      this.sleep(500);
      if (receivedCount === 0 || receiveCheckLimit >= this.receiveCheckLimit) {
        log(this.logs.receivingGiftsCompleted);
        break;
      } else {
        receiveCheckLimit++;
        receivedCount = 0;
        sender = "";
        timeoutCounter = 0;
        this.lastVisitedPages.receiveOneItemNextCheckCycle = true;
        log(this.logs.checkUnreceivedGift);
        this.sleep(500);
        this.tap(Button.outReceive);
        this.sleep(1500);
      }
    }
    timeoutCounter++;
    if (timeoutCounter % 10 === 0) {
      log("Timeout counter = " + timeoutCounter + " / 100");
    }
  }
  if (maxTimeoutCount <= timeoutCounter) {
    // we seem to be trapped, try to exit the trap
    log("I'm stuck! Trying exit...");
    this.exitUnknownPage();
    this.sleep(1000);
    if (this.findPage() === 'unknown') {
      // last attempt
      log("Still stuck! Last try...");
      this.exitUnknownPage();
      this.sleep(1000);
    }
  }
}

Tsum.prototype.friendPageGoToSelf = function() {
  debug("'Scrolling' to own player ranking");
  this.tap(Button.outHomePage, 100);
  this.sleep(2000);
  this.tap(Button.outFriendPage, 100);
  debug("'Scrolled' to own player ranking");
  this.sleep(2000);
}

Tsum.prototype.doHeartSending = function(startTime) {
  let retry = 0;
  let times = 0;
  const hfx = Button.outSendHeartFrom.x;
  const hfy = Button.outSendHeartFrom.y - 40; // hearts from y
  const hty = Button.outSendHeartTo.y + 30;   // hearts to y
  let finished;

  function scrollToNextHearts() {
    if (this.sendHeartsDownwards) {
      this.tapDown({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 500);
      this.tapUp({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 100);
    } else {
      this.tapDown({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartBottom.y}, 500);
      this.tapUp({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartBottom.y}, 100);
    }
  }

  while (this.isRunning && typeof finished === 'undefined') {
    this.requestTsumMonitor();
    times++;
    if (times % 15 === 0) {
      debug("Ensuring friends page");
      this.goFriendPage();
      this.lastVisitedPages.friends = true;
      debug("Ensured friends page");
    }
    const heartsPos = [];

    const img = this.screenshot();
    // Declared outside the try so the end/zero/top checks below can read them
    // after the screenshot is released.
    let isOk: boolean, isZero: boolean, isNotEnd: boolean, isEnd1: boolean,
        isEnd2: boolean, isEnd3: boolean, isTop: boolean;
    try {
      isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 40);
      for (let y = hfy; y <= hty; y += 8) {
        const isHs = isSameColor(Button.outSendHeart0.color, this.getColor(img, {x: hfx, y: y}), 40);
        if (isHs) {
          heartsPos.push({x: hfx, y: y, color: Button.outSendHeart0.color, color2: Button.outSendHeart0.color2});
          y += 140;
        }
      }
      debug("Found " + heartsPos.length + " hearts on current page");
      isZero = true;
      const fx = Button.outFriendScoreFrom.x;
      const tx = Button.outFriendScoreTo.x;
      const sy = heartsPos.length === 0 ? Button.outFriendScoreFrom.y : (heartsPos[0].y + 35);
      for (let px = fx; px <= tx; px += 20) {
        isZero = isSameColor(Button.outFriendScoreFrom.color, this.getColor(img, {x: px, y: sy}), 40);
        if (!isZero) {
          break;
        }
      }
      isNotEnd = isSameColor(Button.outSendHeartEnd2.color, this.getColor(img, {x: 225, y: 1056}), 40);
      isEnd1 = isSameColor({r: 162, g: 84, b: 53}, this.getColor(img, {x: 225, y: 1056}), 40);
      isEnd2 = isSameColor(Button.outSendHeartEnd.color, this.getColor(img, Button.outSendHeartEnd), 40);
      isEnd3 = isSameColor(Button.outSendHeartEnd3.color, this.getColor(img, {x: 315, y: 1020}), 40);
      isTop = isSameColor({r: 255, g: 227, b: 115}, this.getColor(img, {x: 200, y: 670}));
    } finally {
      releaseImage(img);
    }

    const isEnd = !isNotEnd && isEnd1 && isEnd2 && isEnd3;
    debug('isNotEnd', isNotEnd, 'isEnd1', isEnd1, 'isEnd2', isEnd2, 'isEnd3', isEnd3, 'isEnd', isEnd, 'retry', retry, 'heartsLength', heartsPos.length, 'isZero', isZero);

    if (isOk && heartsPos.length === 0) {
      this.tap(Button.outReceiveOk);
    }

    if ((heartsPos.length === 0 && (isEnd || isTop)) || (!this.sentToZero && isZero && heartsPos.length !== 0)) {
      log("'isEnd'=" + isEnd + ", 'isZero'=" + isZero + ", 'isTop'=" + isTop);
      if (retry < 3) {
        scrollToNextHearts.call(this);
        retry++;
        log(this.logs.checkSendingHearts, retry);
        this.sleep(1000);
      } else {
        if (this.sendHeartMaxDuring !== 0) {
          this.sleep(1000);
          this.friendPageGoToSelf();
        }
        debug("Ending taskSendHearts");
        this.sendHeartsDownwards = !this.sendHeartsDownwards;
        // we're finished if we reached the top of the ranking and will send downwards again on the next run
        finished = this.sendHeartsDownwards;
      }
    } else {
      let rTimes = 0;
      for (const h in heartsPos) {
        debug("Try sending heart to", h);
        let success = this.sendHeart(heartsPos[h]);
        debug("Tried sending heart to", h, "with success=" + success);
        if (!success) {
          debug("Try again sending heart to", h);
          success = this.sendHeart(heartsPos[h]);
          debug("Tried again sending heart to", h, "with success=" + success);
        }
        if (success) {
          rTimes++;
          this.record['hearts_count'].sentCount++;
          this.lastVisitedPages.sendHeartSuccess = true;
        } else {
          debug("Try return to FriendPage");
          this.goFriendPage();
          this.sleep(1000);
          debug("Tried return to FriendPage");
        }
        if (!this.isRunning) {
          return true;  // don't let the surrounding job retry this immediately, so we pretend to be finished
        }
      }
      if (heartsPos.length !== 0 && rTimes === 0) {
        continue;
      }
      if (this.recordReceive && heartsPos.length !== 0) {
        this.saveRecord();
      }
      this.sleep(250);
      scrollToNextHearts.call(this);

      this.sleep(400);
      if (this.sendHeartMaxDuring !== 0) {
        if (Date.now() - startTime > this.sendHeartMaxDuring) {
          // we exceeded the maximum allowed sending time. leaving unfinished.
          log(this.logs.timeIsUp);
          finished = true;
        }
      }
      if (heartsPos.length === 0 && isEnd2) {
        this.sleep(700); // end bug
      }
    }
  }
  return finished;
}

Tsum.prototype.taskSendHearts = function() {
  debug("Started taskSendHearts");
  if (this.findPage() === 'GamePause')
    return;
  log(this.logs.friendsPage);
  this.goFriendPage();
  log(this.logs.startSendingHearts);
  this.sleep(1000);
  if (this.sendHeartMaxDuring === 0) {
    this.friendPageGoToSelf();
    tap(0, 0, 20); // Avoid overlap between zero score and pointer location
  }

  const startTime = Date.now();
  let finished;
  do {
    finished = this.doHeartSending(startTime);
    debug("Finished doHeartSending with result " + finished);
    this.sleep(2000);
    if (!finished) {
      this.friendPageGoToSelf();
      tap(0, 0, 20); // Avoid overlap between zero score and pointer location
    }
    this.sleep(2000);
  } while (!finished)
  debug("Finished taskSendHearts");
}

Tsum.prototype.taskAutoUnlockLevel = function() {
  if (this.findPage() === 'GamePause')
    return;
  let btn;
  let i;
  let img;
  let formerOrderButton = null;
  let orderButtons;
  let buttonCloseTsumCollectionOrder;
  let buttonOrderByLevelLock;
  log(this.logs.tsumsPage);
  this.goTsumsPage();
  this.lastVisitedPages.autoUnlockLevelTsum = true;
  log(this.logs.startUnlockLevel);

  // Switch order to "By Level Lock" and remember former selection
  this.tap(Button.outOpenTsumCollectionOrder);
  this.sleep(1000);
  img = this.screenshot();
  try {
    // detect old or new ordering view
    if (isSameColor(Button.outCloseTsumCollectionOrderNew, this.getColor(img, Button.outCloseTsumCollectionOrderNew))) {
      orderButtons = [
        Button.outTsumCollectionOrderByReleaseDateNew,
        Button.outTsumCollectionOrderByLevelLockNew,
        Button.outTsumCollectionOrderBySkillNew,
        Button.outTsumCollectionOrderFavoritesNew,
        Button.outTsumCollectionOrderByEntryDateNew
      ];
      buttonCloseTsumCollectionOrder = Button.outCloseTsumCollectionOrderNew;
      buttonOrderByLevelLock = Button.outTsumCollectionOrderByLevelLockNew;
    } else {
      orderButtons = [
        Button.outTsumCollectionOrderByReleaseDateOld,
        Button.outTsumCollectionOrderByLevelLockOld,
        Button.outTsumCollectionOrderBySkillOld,
        Button.outTsumCollectionOrderFavoritesOld
      ];
      buttonCloseTsumCollectionOrder = Button.outCloseTsumCollectionOrderOld;
      buttonOrderByLevelLock = Button.outTsumCollectionOrderByLevelLockOld;
    }
    for (i = 0; i < orderButtons.length; i++) {
      btn = orderButtons[i];
      if (isSameColor(btn, this.getColor(img, btn))) {
        formerOrderButton = btn;
        debug("Found active button: " + btn.name);
        break;
      }
    }
  } finally {
    releaseImage(img);
  }

  this.tap(buttonOrderByLevelLock);
  this.sleep();
  this.tap(buttonCloseTsumCollectionOrder);
  this.sleep(1000);

  // Start looking for locks from first entries
  this.tap({x: 1, y: 1892});  // jump to first Tsum entries
  this.sleep(3000);

  // check all
  // Declared outside the do/while so the loop condition can read it.
  let allLocked = true;
  do {
    this.requestTsumMonitor();
    allLocked = true;
    const lockIcons = Page.TsumsPage.lockIcons;
    img = this.screenshot();
    try {
      for (i = 0; i < lockIcons.length; i++) {
        const lockIcon = lockIcons[i];
        debug("Checking for lock on i=" + i);
        const realColor = this.getColor(img, lockIcon);
        debug("For i=" + i + " I found color " + JSON.stringify(realColor));
        if (isSameColor(lockIcon, realColor)) {
          debug("Unlocking i=" + i);
          this.lastVisitedPages.autoUnlockLevelUnlock = true;
          const tsumButton = {x: lockIcon.x, y: lockIcon.y - 100};
          this.tap(tsumButton);
          this.sleep(1000);
          this.tap(Button.outTsumCollectionDoUnlock);
          this.sleep(1000);
          this.tap({x: 814, y: 1071, r: 247, g: 174, b: 8}); // OK button
          this.sleep(5000);
          this.tap({x: 600, y: 600}); // just tap anywhere to close the confirmation dialog
          this.sleep(1000);
          debug("Unlocked i=" + i);
        } else {
          debug("No lock found for i=" + i);
          allLocked = false;
          break;
        }
      }
    } finally {
      releaseImage(img);
    }

    // scroll to next page if all Tsums were locked
    if (allLocked) {
      debug("Clicking scroll button to move to next page")
      this.tap({x: 1030, y: 1193, r: 212, g: 239, b: 246}); // arrow, scroll right to next page
      this.sleep(3000);
    }

    // Progress until no more locks exist
  } while (this.isRunning && allLocked)



  // Reset order to former selection
  if (formerOrderButton != null && formerOrderButton !== buttonOrderByLevelLock) {
    this.tap(Button.outOpenTsumCollectionOrder);
    this.sleep(1000);
    this.tap(formerOrderButton);
    this.sleep();
    this.tap(buttonCloseTsumCollectionOrder);
    this.sleep(1000);
  }

  log(this.logs.endUnlockLevel);
}

Tsum.prototype.taskAutoBuyBoxes = function() {
  if (this.findPage() === 'GamePause')
    return;
  log("Starting taskAutoBuyBoxes");
  if (this.autobuyBoxes === 0) {
    log("Nothing to do", "taskAutoBuyBoxes");
    return;
  }
  const storeHasOpened = this.goTsumTsumStorePage();
  let lastPage = this.findPageObject(1, 200);
  if (!storeHasOpened) {
    log("Leaving AutoBuy Boxes.");
    this.autobuyBoxes = 0;
    return;
  }
  this.lastVisitedPages.autoBuyBoxesStore = true;
  log("Start buying ", this.autobuyBoxes, "boxes - taskAutoBuyBoxes");
  let countUnknownPages = 0, countSamePage = 0;
  while (this.isRunning && storeHasOpened && this.autobuyBoxes > 0 && countSamePage < 60) {
    this.requestTsumMonitor();
    let page = this.findPageObject(1, 200);
    if (page != null) {
      countUnknownPages = 0;
      this.lastVisitedPages['autoBuyBoxes' + page.name] = true;
      if (page.name === "OutOfMedals") {
        log("Out Of Medals");
        this.autobuyBoxes = 0;
        break;
      }
      if (page.name === "TsumTsumStorePage") {
        if (page !== lastPage) {
          this.autobuyBoxes--;
          log("Bought box.", this.autobuyBoxes, "left");
        }

        const img = this.screenshot();
        let nextColor;
        try {
          nextColor = this.getColor(img, page.next);
        } finally {
          releaseImage(img);
        }
        if (this.autobuyBoxes === 0) {
          log("Buying finished");
          break;
        }
        if (!isSameColor(page.next, nextColor, 50)) {
          // wait and test again
          this.sleep(500);
          page = this.findPageObject(1, 200);
          if (page.name === "TsumTsumStorePage" && !isSameColor(page.next, nextColor, 50)) {
            log("Finish with", this.autobuyBoxes, "boxes zu buy due to empty box");
            break;
          }
        }
      }
      this.tap(page.next);
      if (page === lastPage) {
        countSamePage++;
        debug("countSamePage =", countSamePage);
        if (countSamePage % 10 === 0) {
          debug("I'm stuck?!");
          this.exitUnknownPage();
        }
      } else {
        countSamePage = 0;
      }
      if (countSamePage === 30) {
        // we didn't change the page for at least 15 seconds (30 * 0.500) so try escaping from wherever we are
        log("I'm stuck on buying!");
        this.exitUnknownPage();
        countSamePage = 0;
        this.autobuyBoxes = 0;
      } else if (page.name === Page.Received.name
          || page.name === Page.FriendPage.name
          || page.name === Page.TsumsPage.name) {
        log("Collected all Tsums.");
        this.autobuyBoxes = 0;
      } else if (page.name === Page.MailBox.name) {   // matches when "Buy coins for rubies" appears
        // test again, sometimes falsely matched while page transition
        this.sleep(500);
        page = this.findPageObject(1, 200);
        if (page.name === Page.MailBox.name) {
          log("Not enough coins.");
          this.autobuyBoxes = 0;
        }
      }
      lastPage = page;
    } else {
      countUnknownPages++;
      if (countUnknownPages === 20) {
        // sometimes the final confirmation after having bought doesn't get clicked, so let's use this method
        log("Stuck?");
        this.exitUnknownPage();
      } else if (countUnknownPages > 30) {
        // this probably didn't work on 10, but let's try it again as we don't have something better here
        log("Stuck! Exit...");
        this.exitUnknownPage();
        countUnknownPages = 0;
        this.autobuyBoxes = 0;
      }
    }
    this.sleep(500);
  }
  log("Finished taskAutoBuyBoxes");
}

Tsum.prototype.taskRequestTsumMonitor = function() {
  this.requestTsumMonitor(true);
}

Tsum.prototype.requestTsumMonitor = function(force) {
  const url = this.tsumMonitorUrl;
  if (url.length === 0)
    return;
  if (this.nextMonitorExecution <= Date.now() && Object.keys(this.lastVisitedPages).length >= 2) {
    log("TsumMonitor - GET", url);
    const response = httpClient('GET', url, '', {});
    log("TsumMonitor - Response:", response.trim());
    this.nextMonitorExecution = Date.now() + 60 * 1000;
    this.lastVisitedPages = {};
  } else {
    debug("Skipping TsumMonitor call");
  }
}

// Layer 2 watchdog: detects when the game stops making progress and restarts
// the app. "Progress" = the number of lastVisitedPages keys changing (it grows
// as pages are visited and is reset to {} by requestTsumMonitor after a ping;
// either way a change means something happened). Runs between tasks, so it
// recovers from a stuck game screen, not from a task wedged in its own loop.
Tsum.prototype.taskWatchdog = function () {
  // const count = Object.keys(this.lastVisitedPages).length;
  // if (count !== this._lastSeenCount) {
  //   this._lastSeenCount = count;
  //   this._lastProgress = Date.now();
  //   return;
  // }
  // const stalledMs = Date.now() - this._lastProgress;
  // if (stalledMs >= this.stuckTimeoutMs) {
  //   log("[Watchdog] no progress for " + Math.round(stalledMs / 1000) + "s, restarting Tsum app");
  //   try { this.taskTsumAppRestart(); } catch (e) { log("[Watchdog] restart failed: " + e); }
  //   this._lastProgress = Date.now();
  //   this._lastSeenCount = Object.keys(this.lastVisitedPages).length;
  // }
}

Tsum.prototype.taskTsumAppRestart = function () {
    log("Preparing restarting TsumApp");
    if (!this.isAppOn()) {
        this.startApp();
    }
    this.goFriendPage();

    log("Restarting TsumApp");
    const packageName = getPackageName(ts.isJP);
    execute("am force-stop " + packageName);

    ts.sleep(10000);
    if (!this.isAppOn()) {
        this.startApp();
    }
    this.goFriendPage();
    log("TsumTsumApp restarted");
}

Tsum.prototype.sendHeart = function(btn) {
  let unknownCount = 0;
  let isGift = false;
  let isSent = false;
  // log("sendHeart");
  while (this.isRunning) {
    const page = this.findPage(1, 300);
    if (page === "FriendPage") {
      // log("sendHeart A", Date.now() / 1000);
      const img = this.screenshot();
      let isSendBtn, isSentBtn;
      try {
        isSendBtn = isSameColor(btn.color, this.getColor(img, btn), 40);
        isSentBtn = isSameColor(btn.color2, this.getColor(img, btn), 40);
      } finally {
        releaseImage(img);
      }
      if ((isSendBtn || !isSentBtn) && !isGift && !isSent) {
        debug("sendHeart A-A", Date.now() / 1000);
        this.tap(btn);
      } else {
        debug("sendHeart A-B", Date.now() / 1000);
        unknownCount += 1;
      }
    } else if (page === "GiftHeart") {
      this.lastVisitedPages.sendHeartGiftHeart = true;
      this.tap(Button.outReceiveOk);
      isGift = true;
      debug("sendHeart B", Date.now() / 1000);
    } else if (page === "Received") {
      this.lastVisitedPages.sendHeartReceived = true;
      this.sleep(100);
      this.tap(Button.outSendHeartClose);
      debug("sendHeart C", Date.now() / 1000);
      if (isGift) {
        isSent = true;
        debug("sendHeart C-C", Date.now() / 1000);
        this.sleep(100);
        return true;
      }
    } else if (page === "FriendInfo") {
      this.tap(Page.FriendInfo.back);
    } else if (page === "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
    } else {
      unknownCount++;
    }
    if (unknownCount >= 15) {
      debug(this.logs.UnknownState);
      return false;
    }
    // this.sleep(150);
  }
}

Tsum.prototype.sleep = function(t) {
  if (typeof t !== 'number') {
    t = 1000;
  }
  let waitTime = t;
  while (this.isRunning && waitTime > 0) {
    if (waitTime <= 500) {
      sleep(waitTime);
      break;
    } else {
      sleep(500);
      waitTime -= 500;
    }
  }
}

Tsum.prototype.isOnScreenshot = function(img, pageObject, colorDiff) {
  return pageObject && pageObject.color && isSameColor(pageObject.color, this.getColor(img, pageObject), colorDiff)
}


