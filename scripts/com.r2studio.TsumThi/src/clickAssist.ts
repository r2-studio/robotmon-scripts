// Click Assist: the user picks the tsum, the script draws the chain.
//
// Instead of scanning and linking on its own cadence, the script sits on the
// touch event stream and reacts to where the user taps. Auto-play and Click
// Assist are mutually exclusive (see start()).

// Locate the touchscreen input device by parsing `getevent -lp`. Cached for the
// life of the Tsum instance -- the device does not change mid-session.
Tsum.prototype.findTouchDevice = function() {
  if (this._touchDevice !== undefined) { return this._touchDevice; }

  const raw = execute('getevent -lp 2>&1') || '';
  const sections = raw.split(/add device \d+:\s*/);
  let best = null;
  for (let s = 1; s < sections.length; s++) {
    const section = sections[s];
    const firstLineEnd = section.indexOf('\n');
    if (firstLineEnd === -1) { continue; }
    const path = section.substring(0, firstLineEnd).trim();
    if (path.indexOf('/dev/input/event') !== 0) { continue; }
    if (section.indexOf('ABS_MT_POSITION_X') === -1) { continue; }

    let xMax = 0, yMax = 0;
    const xm = section.match(/ABS_MT_POSITION_X[^\n]*max\s+(\d+)/);
    const ym = section.match(/ABS_MT_POSITION_Y[^\n]*max\s+(\d+)/);
    if (xm) { xMax = parseInt(xm[1], 10); }
    if (ym) { yMax = parseInt(ym[1], 10); }
    best = { path: path, xMax: xMax, yMax: yMax };
    break;
  }

  this._touchDevice = best;
  if (best) {
    log('Click Assist: input device ' + best.path + ' (max ' + best.xMax + 'x' + best.yMax + ')');
  } else {
    log('Click Assist: could not locate touch input device');
  }
  return best;
};

// Block for up to `timeoutSec` seconds waiting for a BTN_TOUCH DOWN with X/Y
// coordinates. Returns the touch position in screen pixels, or null on timeout.
// Uses `timeout` from toybox/busybox; falls back to no-timeout (script must rely
// on the user actually touching the screen) if the timeout command is missing.
Tsum.prototype.pollTouchDown = function(timeoutSec) {
  const device = this.findTouchDevice();
  if (!device) { return null; }

  // `-c N` exits after N events. We want the X/Y/BTN_TOUCH triplet plus a
  // little headroom for tracking-id/sync events.
  const cmd = 'timeout ' + timeoutSec + ' getevent -lc 12 ' + device.path + ' 2>/dev/null';
  const raw = execute(cmd) || '';
  if (raw.length === 0) { return null; }

  const lines = raw.split('\n');
  let lastX = null, lastY = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    if ((m = line.match(/ABS_MT_POSITION_X\s+([0-9a-fA-F]+)/))) {
      lastX = parseInt(m[1], 16);
    } else if ((m = line.match(/ABS_MT_POSITION_Y\s+([0-9a-fA-F]+)/))) {
      lastY = parseInt(m[1], 16);
    }
  }
  // Any X/Y in the event burst means the user touched (or moved/released) on
  // the screen. We don't gate on BTN_TOUCH because protocol B devices and many
  // emulators omit it. Reacting on the release position is still the position
  // the user intended.
  if (lastX === null || lastY === null) { return null; }

  // Scale device coords to screen pixels. If the device reports max==0 or
  // matches the screen pixel size already, the touch is treated as direct
  // pixel coordinates.
  let screenX = lastX;
  let screenY = lastY;
  if (device.xMax > 0 && device.xMax !== this.originScreenWidth) {
    screenX = lastX * this.originScreenWidth / device.xMax;
  }
  if (device.yMax > 0 && device.yMax !== this.originScreenHeight) {
    screenY = lastY * this.originScreenHeight / device.yMax;
  }
  return { x: screenX, y: screenY };
};

// Stops auto-linking and waits for the user to tap a tsum. On each tap, finds
// the connected component containing the touched tsum's color and chains them.
// The user supplies the "where", the script supplies the draw.
Tsum.prototype.taskClickAssist = function() {
  this.requestTsumMonitor();
  log('Click Assist: ' + this.logs.gameStart);
  this.goGamePlayingPage();
  log('Click Assist: tap a tsum to connect its chain');
  this.runTimes = 0;
  this.myTsumColor = null;
  this.myTsumIdx = -1;

  const pageCheckEvery = 5;
  let sinceLastPageCheck = 0;
  let lastActTime = 0;

  while (this.isRunning) {
    const touch = this.pollTouchDown(1);
    if (touch === null) {
      sinceLastPageCheck++;
      if (sinceLastPageCheck >= pageCheckEvery) {
        sinceLastPageCheck = 0;
        let page = this.findPage(1, 1500);
        if (page !== 'GamePlaying' && page !== 'GamePause') {
          this.sleep(500);
          page = this.findPage(1, 1500);
          if (page !== 'GamePlaying' && page !== 'GamePause') {
            log(this.logs.gameOver);
            break;
          }
        }
      }
      continue;
    }
    sinceLastPageCheck = 0;

    // Debounce: ignore taps that arrive too soon after we just drew a chain --
    // those are most likely the trailing events of our own synthetic input.
    const now = Date.now();
    if (now - lastActTime < 600) { continue; }

    // Only react to taps inside the play area; taps on UI chrome (skill button,
    // pause, etc.) should be ignored.
    const inPlay = touch.x >= this.playOffsetX
              && touch.x < this.playOffsetX + this.playWidth
              && touch.y >= this.playOffsetY
              && touch.y < this.playOffsetY + this.playHeight;
    if (!inPlay) {
      debug('Click Assist: tap outside play area at (' + touch.x + ',' + touch.y + ')');
      continue;
    }

    // Map screen-pixel tap to the playResize coordinate space the board uses.
    const boardX = (touch.x - this.playOffsetX) * this.playResizeWidth / this.playWidth - Config.tsumWidth / 2;
    const boardY = (touch.y - this.playOffsetY) * this.playResizeHeight / this.playHeight - Config.tsumWidth / 2;

    // Brief pause so the user's finger lifts before we start our own input.
    this.sleep(120);

    const board = this.scanBoardQuick();
    if (board == null) { break; }

    const chain = findChainAtTouch(board, boardX, boardY);
    if (chain && chain.length >= 3) {
      log('Click Assist: linking ' + chain.length + ' tsums');
      this.linkTsums(chain);
      lastActTime = Date.now();
      this.sleep(400);
    } else {
      debug('Click Assist: no chain at tap (' + boardX + ',' + boardY + ')');
    }
    this.runTimes++;
  }
};
