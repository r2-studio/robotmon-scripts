// ---------------------------------------------------------------------------
// Native (system) dialogs: root detection, permission prompts, ...
//
// The game's root warning is an Android AlertDialog, not a game screen, and that
// difference broke the old handling in two ways:
//
//  * Coordinate space. Android lays a dialog out in *device* pixels over the
//    whole display, while every Page/Button coordinate here lives in the game's
//    logical 1080x1920 letterbox space and is converted by toRealXY(). The two
//    only agree on an exactly 9:16 screen, so the per-emulator RootDetection*
//    fingerprints (LDPlayer/Nox/SamsungA20/...) silently miss elsewhere -- and
//    when one of them does match, it may be the variant for a *different* dpi,
//    which puts the "PERMIT" tap next to the button instead of on it.
//  * Fallback. An unrecognized screen went to exitUnknownPage(), whose blind
//    DPAD_DOWN + ENTER can activate the dialog's negative button. "REFUSE" on
//    the root warning quits the game, autoLaunch starts it again, the dialog
//    comes back -- the endless startup loop.
//
// So dialogs are handled structurally in device pixels instead: find the light
// panel floating over the dimmed background, find its button row, and tap the
// rightmost label (Android puts the positive button last). Nothing below depends
// on resolution, dpi, emulator or game language.
// ---------------------------------------------------------------------------

/** Panel geometry, in both scan-image and device pixels. */
interface DialogBox {
  x0: number; y0: number; x1: number; y1: number;  // scan-image space
  dx0: number; dy0: number; dx1: number; dy1: number;  // device space
  scale: number;
  sw: number; sh: number;
}

/** Downscale target for dialog scans: coarse enough to be cheap, fine enough to keep button labels legible. */
const DialogScanWidth = 540;

/** Labels that dismiss the dialog the way we want (EN/JP/TW/KR wording). */
const DialogPositiveText = /^(permit|allow|ok|yes|agree|accept|continue|許可|許可する|同意|同意する|はい|確定|確認|允許|允许|확인)$/i;
/** Labels never to tap: "REFUSE" on the root warning closes the game. */
const DialogNegativeText = /(refuse|deny|cancel|exit|quit|later|拒否|拒绝|拒絕|取消|いいえ|終了|취소)/i;

/** The dialog's own background: light and near-neutral (white/off-white panel). */
function isDialogPanelColor(c: ColorLike): boolean {
  if (c === undefined || c === null) {
    return false;
  }
  const max = Math.max(c.r, c.g, c.b);
  const min = Math.min(c.r, c.g, c.b);
  return min >= 200 && (max - min) <= 28;
}

/** Accent-coloured ink. In an AlertDialog only the buttons are coloured; title and message are grey. */
function isDialogAccentColor(c: ColorLike): boolean {
  if (c === undefined || c === null) {
    return false;
  }
  return (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b)) >= 30;
}

/** Full-screen capture in device space, downscaled to ~DialogScanWidth. Quality 100: JPEG ringing around dialog edges and thin button text is exactly what we are measuring. */
Tsum.prototype.dialogScreenshot = function(sw, sh) {
  return getScreenshotModify(0, 0, this.originScreenWidth, this.originScreenHeight, sw, sh, 100);
};

/**
 * Structural search for a native dialog: a light, near-neutral panel that spans
 * most of the width, is bounded above and below by darker (dimmed) rows, and
 * never reaches the screen edges. That last part is what separates a dialog
 * from the game's own bright screens (loading, white popups), which run edge to
 * edge. Returns null when no such panel is on screen.
 */
Tsum.prototype.findSystemDialog = function(): DialogBox {
  const scale = Math.max(1, this.originScreenWidth / DialogScanWidth);
  const sw = Math.floor(this.originScreenWidth / scale);
  const sh = Math.floor(this.originScreenHeight / scale);
  const img = this.dialogScreenshot(sw, sh);
  try {
    const probes = [Math.floor(sw * 0.35), Math.floor(sw * 0.5), Math.floor(sw * 0.65)];
    const yStep = 2;
    // A line of message text can darken all three probes at once, so the panel
    // is allowed to drop out for up to one text line without ending the run.
    // Still far below the height of the dimmed band above and below a dialog.
    const gapTol = Math.max(6, Math.round(sh * 0.04));
    let top = -1, bottom = -1, rows = 0;
    let curTop = -1, curRows = 0, lastHit = -1;
    for (let y = 0; y < sh; y += yStep) {
      let lit = 0;
      for (let i = 0; i < probes.length; i++) {
        if (isDialogPanelColor(getImageColor(img, probes[i], y))) {
          lit++;
        }
      }
      if (lit >= 2) {
        if (curTop < 0) {
          curTop = y;
          curRows = 0;
        }
        lastHit = y;
        curRows++;
      } else if (curTop >= 0 && (y - lastHit) > gapTol) {
        if (curRows > rows) {
          rows = curRows;
          top = curTop;
          bottom = lastHit;
        }
        curTop = -1;
      }
    }
    if (curTop >= 0 && curRows > rows) {
      rows = curRows;
      top = curTop;
      bottom = lastHit;
    }
    if (top < 0) {
      return null;
    }
    const height = bottom - top;
    if (top <= yStep || bottom >= sh - 1 - yStep) {
      return null;  // touches an edge: a game screen, not a floating dialog
    }
    if (height < sh * 0.06 || height > sh * 0.8) {
      return null;
    }
    if (rows * yStep < height * 0.55) {
      return null;  // mostly gaps: the run was merged across unrelated bands
    }
    // Horizontal extent, read from the padding rows a dialog keeps blank. Three
    // of them, widest wins: a title, an icon or a long message line can cross
    // any single row and cut the measured panel in half.
    const xGap = Math.max(4, Math.round(sw * 0.02));
    const edges = [
      top + Math.max(2, Math.round(height * 0.06)),
      top + Math.max(3, Math.round(height * 0.15)),
      bottom - Math.max(2, Math.round(height * 0.03))
    ];
    let left = -1, right = -1;
    for (let e = 0; e < edges.length; e++) {
      let curLeft = -1, lastX = -1;
      for (let x = 0; x < sw; x += 2) {
        if (isDialogPanelColor(getImageColor(img, x, edges[e]))) {
          if (curLeft < 0) {
            curLeft = x;
          }
          lastX = x;
        } else if (curLeft >= 0 && (x - lastX) > xGap) {
          if (lastX - curLeft > right - left) {
            left = curLeft;
            right = lastX;
          }
          curLeft = -1;
        }
      }
      if (curLeft >= 0 && lastX - curLeft > right - left) {
        left = curLeft;
        right = lastX;
      }
    }
    if (left < 0 || right - left < sw * 0.45 || left <= 2 || right >= sw - 3) {
      return null;
    }
    return {
      x0: left, y0: top, x1: right, y1: bottom,
      dx0: Math.round(left * scale), dy0: Math.round(top * scale),
      dx1: Math.round(right * scale), dy1: Math.round(bottom * scale),
      scale: scale, sw: sw, sh: sh
    };
  } finally {
    releaseImage(img);
  }
};

/**
 * Locate the positive button inside a known dialog panel and return its device
 * coordinates. The button bar is the bottom-most row of ink in the panel; within
 * it the rightmost label is the positive button ("PERMIT"), because Android
 * orders the bar [negative][neutral][positive] left to right.
 *
 * Caveat: a dialog with labels too long for one row stacks its buttons and puts
 * the positive one on *top*, so the bottom-most row would be the negative one.
 * That layout is why tapDialogButtonViaUi() is tried as well -- it reads the
 * button identity from Android instead of inferring it from geometry.
 */
Tsum.prototype.findDialogButton = function(box) {
  const img = this.dialogScreenshot(box.sw, box.sh);
  try {
    const panelW = box.x1 - box.x0;
    const panelH = box.y1 - box.y0;
    // Stay clear of the panel border (and of a scrollbar, if the message scrolls).
    const inset = Math.max(3, Math.round(panelW * 0.03));
    const bx0 = box.x0 + inset;
    const bx1 = box.x1 - inset;
    const by1 = box.y1 - Math.max(2, Math.round(panelH * 0.02));
    const by0 = box.y1 - Math.max(10, Math.round(panelH * 0.32));
    const xStep = Math.max(2, Math.round(panelW / 120));
    const samples = Math.floor((bx1 - bx0) / xStep) + 1;
    const rowInk = function(y) {
      let ink = 0;
      for (let x = bx0; x <= bx1; x += xStep) {
        if (!isDialogPanelColor(getImageColor(img, x, y))) {
          ink++;
        }
      }
      return ink;
    };
    // A row inked nearly all the way across is a divider (or the panel's own
    // border), not a label -- text leaves gaps. Treating it as a label would
    // stretch the "rightmost word" to the panel edge and aim the tap past the
    // button, so dividers bound the band instead of joining it.
    const isTextRow = function(ink) { return ink >= 2 && ink < samples * 0.7; };
    let bandBottom = -1;
    for (let y = by1; y >= by0; y -= 2) {
      if (isTextRow(rowInk(y))) {
        bandBottom = y;
        break;
      }
    }
    if (bandBottom < 0) {
      return null;  // empty panel bottom: a progress dialog, or no buttons at all
    }
    const lineH = Math.max(6, Math.round(panelH * 0.08));
    let bandTop = bandBottom;
    let blanks = 0;
    for (let y = bandBottom - 2; y >= by0 && bandBottom - y <= lineH * 2; y -= 2) {
      const ink = rowInk(y);
      if (ink >= samples * 0.7) {
        break;
      }
      if (ink >= 2) {
        bandTop = y;
        blanks = 0;
      } else if (++blanks >= 2) {
        break;
      }
    }
    // Fine pass over the band only: at this step the sampling actually lands on
    // the thin glyph strokes, so the label's right end is measured, not guessed.
    const accent = [];
    const ink = [];
    for (let y = bandTop; y <= bandBottom; y++) {
      for (let x = bx0; x <= bx1; x += 2) {
        const c = getImageColor(img, x, y);
        if (isDialogPanelColor(c)) {
          continue;
        }
        ink.push(x);
        if (isDialogAccentColor(c)) {
          accent.push(x);
        }
      }
    }
    const hits = accent.length >= 6 ? accent : ink;
    if (hits.length === 0) {
      return null;
    }
    hits.sort(function(a, b) { return a - b; });
    // Cluster into words and keep the rightmost one. The gap threshold sits
    // between a letter gap and the padding between two button labels.
    const gap = Math.max(10, Math.round(panelW * 0.035));
    let clusterMin = hits[0];
    let prev = hits[0];
    for (let i = 1; i < hits.length; i++) {
      if (hits[i] - prev > gap) {
        clusterMin = hits[i];
      }
      prev = hits[i];
    }
    // Aim just inside the label's right end. A button always pads past its text,
    // so this is inside the positive button and as far from "REFUSE" as the
    // label allows -- which keeps the tap safe even if both words, for want of a
    // wide enough gap, ended up in one cluster.
    const targetX = Math.max(clusterMin, prev - Math.max(2, Math.round(panelW * 0.015)));
    const targetY = (bandTop + bandBottom) / 2;
    return {
      x: Math.round((targetX + 0.5) * box.scale),
      y: Math.round((targetY + 0.5) * box.scale)
    };
  } finally {
    releaseImage(img);
  }
};

/**
 * Dump the Android view hierarchy. Robotmon's shell starts without a
 * BOOTCLASSPATH, so uiautomator (an app_process shim) cannot boot its VM
 * without the same prefix startTsumTsumApp() uses for `am`. Returns "" when the
 * command is unavailable, and stops trying after two duds so the dialog path
 * does not pay for it on every attempt.
 */
Tsum.prototype.dumpUiXml = function() {
  if (this._uiDumpFailures >= 2) {
    return '';
  }
  const path = this.storagePath + '/tmp/ui_dump.xml';
  execute('rm -f ' + path);
  execute(ShellBootClassPath + ' uiautomator dump ' + path);
  const xml = readFile(path);
  if (typeof xml !== 'string' || xml.indexOf('<hierarchy') === -1) {
    this._uiDumpFailures = (this._uiDumpFailures || 0) + 1;
    log('[Dialog] uiautomator dump unavailable (' + this._uiDumpFailures + '/2), using pixels only');
    return '';
  }
  this._uiDumpFailures = 0;
  return xml;
};

/**
 * Ask Android where the dialog's buttons are and tap the positive one. This is
 * the only path that knows a button's *identity* (`android:id/button1` is the
 * positive button whatever the locale or layout), so it also covers stacked
 * button bars, which the pixel scan can misread. Candidates are restricted to
 * the panel we already found, so a stray clickable view elsewhere on screen
 * cannot be picked. Returns whether a tap was issued.
 */
Tsum.prototype.tapDialogButtonViaUi = function(box) {
  const xml = this.dumpUiXml();
  if (xml === '') {
    return false;
  }
  const nodes = xml.match(/<node[^>]*>/g);
  if (nodes === null) {
    return false;
  }
  const margin = Math.max(8, Math.round(this.originScreenHeight * 0.01));
  let labelled = null, positive = null, button = null, clickable = null;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const bounds = /bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/.exec(node);
    if (bounds === null) {
      continue;
    }
    const l = +bounds[1], t = +bounds[2], r = +bounds[3], b = +bounds[4];
    if (r <= l || b <= t) {
      continue;
    }
    if (l < box.dx0 - margin || r > box.dx1 + margin || t < box.dy0 - margin || b > box.dy1 + margin) {
      continue;  // outside the panel
    }
    const textMatch = /text="([^"]*)"/.exec(node);
    const text = textMatch === null ? '' : textMatch[1];
    if (DialogNegativeText.test(text)) {
      continue;
    }
    const idMatch = /resource-id="([^"]*)"/.exec(node);
    const resId = idMatch === null ? '' : idMatch[1];
    const target = {x: Math.floor((l + r) / 2), y: Math.floor((t + b) / 2), text: text, left: l};
    if (labelled === null && DialogPositiveText.test(text.replace(/\s+/g, ''))) {
      labelled = target;
    }
    if (positive === null && resId === 'android:id/button1') {
      positive = target;
    }
    if (node.indexOf('.Button"') !== -1 && (button === null || l > button.left)) {
      button = target;
    }
    if (text !== '' && node.indexOf('clickable="true"') !== -1 && (clickable === null || l > clickable.left)) {
      clickable = target;
    }
  }
  const target = labelled || positive || button || clickable;
  if (target === null) {
    return false;
  }
  log('[Dialog] uiautomator: tapping "' + target.text + '" at ' + target.x + ',' + target.y);
  tap(target.x, target.y, 60);
  return true;
};

/** Wait out the dismiss animation, then report whether that dialog is gone (or was replaced by a different one). */
Tsum.prototype.dialogChanged = function(box) {
  this.sleep(1200);
  const now = this.findSystemDialog();
  if (now === null) {
    return true;
  }
  const tol = Math.max(8, Math.round(this.originScreenHeight * 0.02));
  return Math.abs(now.dy0 - box.dy0) > tol
      || Math.abs((now.dy1 - now.dy0) - (box.dy1 - box.dy0)) > tol;
};

/**
 * Work through the ways of pressing a dialog's positive button, cheapest and
 * safest first, verifying after each one. `hint` is the coordinate recorded for
 * whichever RootDetection* variant matched -- right for that one emulator and
 * dpi, so it is worth a try, but only after the two self-calibrating paths.
 */
Tsum.prototype.tryDismissDialog = function(box, hint) {
  const btn = this.findDialogButton(box);
  if (btn !== null) {
    log('[Dialog] tapping the rightmost label at ' + btn.x + ',' + btn.y);
    tap(btn.x, btn.y, 60);
    if (this.dialogChanged(box)) {
      return true;
    }
  } else {
    log('[Dialog] no button row found in the panel');
  }
  if (this.tapDialogButtonViaUi(box) && this.dialogChanged(box)) {
    return true;
  }
  if (hint !== undefined && hint !== null) {
    log('[Dialog] trying the coordinates recorded for the matched page variant');
    this.tap(hint);
    if (this.dialogChanged(box)) {
      return true;
    }
  }
  if (this.autoLaunch) {
    // Last resort. Android moves dpad focus geometrically, so repeated RIGHT
    // parks it on the rightmost button of the bar -- the positive one in any
    // LTR layout. Gated on autoLaunch because a wrong ENTER here can hit
    // "REFUSE" and close the game, and only then can the script bring it back.
    log('[Dialog] falling back to dpad focus + enter');
    for (let i = 0; i < 5; i++) {
      keycode('KEYCODE_DPAD_RIGHT', 50);
      this.sleep(100);
    }
    keycode('KEYCODE_ENTER', 50);
    if (this.dialogChanged(box)) {
      return true;
    }
  }
  log('[Dialog] could not dismiss the dialog. Send the saved screenshot if this keeps happening.');
  this.saveDebugScreenshot('dialog');
  return false;
};

/**
 * Dismiss any native dialog on screen (root warning, permission prompt) by
 * pressing its positive button. Returns true when a dialog was found and is
 * gone; false when there was none, or when nothing worked. Dismissing one
 * dialog can reveal the next, so it repeats a few times.
 */
Tsum.prototype.dismissSystemDialog = function(hint) {
  let dismissed = false;
  for (let round = 0; round < 3 && this.isRunning; round++) {
    const box = this.findSystemDialog();
    if (box === null) {
      return dismissed;
    }
    log('[Dialog] native dialog at ' + box.dx0 + ',' + box.dy0 + ' '
        + (box.dx1 - box.dx0) + 'x' + (box.dy1 - box.dy0) + ' (device px)');
    if (!this.tryDismissDialog(box, hint)) {
      return dismissed;
    }
    dismissed = true;
    this.isStartupPhase = true;  // whatever it interrupted, the game is still coming up
  }
  return dismissed;
};

/** Full-resolution screen dump for calibrating what the script could not read. Rate-limited so a stuck screen cannot fill up storage. */
Tsum.prototype.saveDebugScreenshot = function(tag) {
  if (Date.now() - (this._lastDebugShot || 0) < 5 * 60 * 1000) {
    return;
  }
  this._lastDebugShot = Date.now();
  const path = this.storagePath + '/tmp/' + tag + '_' + Date.now() + '.png';
  const img = this.dialogScreenshot(this.originScreenWidth, this.originScreenHeight);
  try {
    saveImage(img, path);
    log('[Dialog] saved screen to ' + path);
  } catch (e) {
    log('[Dialog] could not save screen: ' + e);
  } finally {
    releaseImage(img);
  }
};

// ---------------------------------------------------------------------------
// Stall guard
//
// The navigation loops (goFriendPage, goGamePlayingPage, goTsumsPage) only exit
// by reaching their target page, so one screen they cannot leave wedged the
// whole script: taskPlayGameQuick never returns, which means the task
// controller never gets to run anything else either -- including the app
// restart task. Each loop now reports the page it just handled; when the screen
// stops moving, escalate: look for a modal dialog first, then restart the app.
// ---------------------------------------------------------------------------

const StallDialogAfter = 12;   // ~15s stuck: look for a modal dialog
const StallRestartAfter = 30;  // ~40s stuck: bounce the game app
const StallMaxRestarts = 3;

Tsum.prototype.newStallGuard = function(where) {
  return {where: where, page: '', repeats: 0, rounds: 0, dialogTried: false, restarts: 0};
};

Tsum.prototype.checkStall = function(guard, page) {
  guard.rounds++;
  if (page !== guard.page) {
    guard.page = page;
    guard.repeats = 0;
  } else {
    guard.repeats++;
  }
  // Two signals: the same screen coming back (the common case) and the loop
  // simply never reaching its target, which also covers a screen that flickers
  // between two detections -- that keeps the repeat counter at zero forever.
  const stuck = Math.max(guard.repeats, Math.floor(guard.rounds / 2));
  if (!guard.dialogTried && stuck >= StallDialogAfter) {
    // A fingerprint can match the wrong screen, and a native dialog on top of
    // the game matches nothing at all -- either way it is worth a look before
    // reaching for the restart.
    guard.dialogTried = true;
    log('[Stall] ' + guard.where + ': stuck on ' + page + ', checking for a native dialog');
    this.dismissSystemDialog();
    return;
  }
  if (stuck < StallRestartAfter) {
    return;
  }
  guard.repeats = 0;
  guard.rounds = 0;
  guard.dialogTried = false;
  if (guard.restarts >= StallMaxRestarts || !this.autoLaunch) {
    log('[Stall] ' + guard.where + ': still stuck on ' + page + '. '
        + (this.autoLaunch
            ? 'Restarted the game ' + guard.restarts + ' time(s) already.'
            : 'Enable "Auto launch app" to let the script restart the game.')
        + ' Waiting 30s.');
    this.saveDebugScreenshot('stall');
    this.sleep(30000);
    return;
  }
  guard.restarts++;
  log('[Stall] ' + guard.where + ': restarting the game app (' + guard.restarts + '/' + StallMaxRestarts + ')');
  this.forceRestartApp();
};
