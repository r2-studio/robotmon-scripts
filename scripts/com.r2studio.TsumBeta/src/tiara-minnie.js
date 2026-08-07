// Top of the square play area in logical coordinates. The board occupies the
// 1080x1080 square below this line; everything above is score/timer chrome.
// Mirrors the 465 that Tsum.prototype.detectScreenSize uses for playOffsetY.
var PlayAreaTopY = 465;

var TiaraLayouts = {
  2: [{x: 292, y: 973},  {x: 781, y: 1059}],
  3: [{x: 781, y: 829},  {x: 666, y: 1275}, {x: 306, y: 987}],
  4: [{x: 292, y: 1232}, {x: 263, y: 829},  {x: 796, y: 757},  {x: 796, y: 1117}],
  5: [{x: 234, y: 1117}, {x: 882, y: 1102}, {x: 292, y: 771},  {x: 839, y: 742},
      {x: 551, y: 1304}],
  6: [{x: 752, y: 757},  {x: 378, y: 728},  {x: 176, y: 973},  {x: 896, y: 1001},
      {x: 349, y: 1232}, {x: 680, y: 1261}]
};

// Presents shrink as more of them appear; these are the crop sides that put the
// present in the same fraction of the frame at every count (measured widths ran
// 270/275/252/237/237 for counts 2..6).
var TiaraSlotSide = {
  2: 300, 3: 295, 4: 280, 5: 265, 6: 260
};

var TiaraMinnieConfig = {
  // Resolution the play square is captured at for matching.
  //
  // Was briefly dropped to 300 for speed on the strength of the offline sweep
  // finding 270-720 all scoring 20/20 -- and wrong taps appeared on the device.
  // Do not lower it again without re-running the harness: the sweep varied this
  // alone against static frames, which is not the same claim as "300 is safe",
  // and a cell is only ~5.6 capture pixels wide there, so cell centres snap to
  // the grid with a tenth of a cell of error and the blur has less to work with.
  captureSize: 420,
  // Blur radius, in capture pixels, that makes one pixel read stand in for the
  // average of its cell -- so it has to stay in proportion to captureSize.
  captureBlur: 7,

  // The thought bubble is drawn at a fixed spot, so the template is a fixed
  // crop -- no searching. Verified at (250..255, 870..875) on every dream frame
  // where the present could be isolated, and +/-16px of error still ranked the
  // right present first.
  bubbleX: 252,
  bubbleY: 872,
  bubbleSide: 240,

  // Cloud test, used to tell "bubble is up" from "presents are up" and from
  // "the skill is over". Measured 0.484-0.503 on bubble frames vs 0.019-0.060
  // on present frames, so the threshold sits in a very wide gap.
  cloudBox: {x0: 60, y0: 690, x1: 450, y1: 1050},
  cloudSatMax: 70,
  cloudValMin: 180,
  // Sample spacing inside the box, leaving 162 samples. Was briefly 40 (64
  // samples): the gap between a bubble frame and a present frame is wide enough
  // for that, but the fraction is also read *during* the bubble's fade, where
  // the true value passes through the threshold and 64 samples leave a standard
  // error of 0.06 -- enough to call the cloud gone early.
  cloudStep: 24,
  cloudMinFrac: 0.25,
  // This test is polled in a loop, and it is only asking whether a big pale
  // blob is present, so it gets its own small capture with no blur. At the
  // matching resolution each check cost a 420x420 grab plus a 7px blur, which
  // made the poll slower than the interval it was polling on.
  cloudCaptureSize: 120,

  // Comparison grid. Each crop is reduced to grid x grid cells; cells are
  // compared only where the template says the present is, which drops the board
  // background (dark tsums) and the bubble background (white cloud) alike.
  // 10 through 20 all scored the same offline, so this is the cheap end of the
  // range that still held up.
  grid: 12,
  satMin: 70,
  valMin: 170,

  // Per-cell differences are divided by this and clipped at 1, so the score
  // counts clearly-disagreeing cells instead of averaging away small ones.
  // Raised the worst-case margin from 0.095 to 0.264 against the same frames.
  cellSpread: 0.30,

  // A tap needs both of these. The score alone cannot say whether the presents
  // are up yet: a green template scores 0.461 against ordinary green tsums, so
  // a board with no presents on it would clear any floor low enough to keep the
  // real matches (which fall to ~0.44 if the presents are 10px off the table).
  //
  // The margin does separate the two, because bare board has no standout winner
  // -- it reached 0.096 at best, where a real choice screen never scored under
  // 0.278. So the floor rejects noise and the margin proves a present is there.
  confidenceFloor: 0.42,
  marginFloor: 0.12,

  // Tapping a present detonates an area of the board, so the blast wants a full,
  // still board under it. The play loop clears a chain immediately before the
  // skill fires (and may have just used the fan), so at activation the tsums are
  // almost always mid-fall and a blast then catches very few of them.
  //
  // How long that takes varies with how much was cleared, so it is measured
  // rather than guessed: take a coarse brightness fingerprint of the board twice
  // and watch how much it changes. Falling tsums move it a lot, a settled board
  // barely at all (only sparkles and the fever glow).
  //
  // For scale, that measure is 0 between identical frames, ~0.06 between two
  // frames of a similar scene, and 0.20-0.30 between wholly different screens.
  // settleMaxDiff is the one number here not pinned down by measurement, so it
  // is set loose rather than tight: too strict just means every activation waits
  // out settleWaitMs, which is the delay this was added to avoid. The timeout
  // logs the diff it actually saw, which is what to tune from.
  settleWaitMs: 320,
  settleMinMs: 60,
  settlePollMs: 30,
  settleCapture: 64,
  settleGrid: 16,
  settleMaxDiff: 0.03,
  settleQuietScans: 2,

  // Timings. The bubble is shown once, ~2s after the skill fires, and the
  // presents ~1s after that. The game timer is stopped while the presents are
  // up, so the checks made there are free; everything before them costs real
  // game time, which is what these are sized against.
  //
  // Nothing can happen until the skill animation has played, so sit that out
  // rather than spending ~15 screenshots polling for something that cannot have
  // happened yet.
  dreamLeadMs: 1500,
  // Covers the lead plus a bubble arriving late. Only ever spent in full when
  // the skill did not actually fire.
  dreamWaitMs: 3000,
  dreamSettleMs: 250,
  // After the bubble clears, the presents take about a second to arrive. Waiting
  // most of that out first means the matcher never sees the hand-over frames.
  //
  // This lead and pollMs have to be read together: matching starts at (however
  // late the poll noticed the cloud go) + this. Trading one against the other by
  // their averages caused wrong taps -- doubling pollMs raises the mean lag by
  // 50ms but the *minimum* stays 0, so shortening this lead to compensate moves
  // the earliest possible start earlier, and the earliest start is what decides
  // whether the matcher can catch a present still sliding into place.
  choiceLeadMs: 500,
  choiceWaitMs: 6000,
  pollMs: 100,
  // The matching loop's own interval: it is not waiting on a known animation but
  // on the presents becoming readable, and it leaves the moment two scans agree.
  matchPollMs: 100,
  agreeScans: 2,
  pickTaps: 2,
  pickTapDuring: 60,
  pickTapGapMs: 50
};

// Hue names for the debug line, over OpenCV's 0..179 hue range.
var TiaraHueNames = [
  {to: 8, name: 'red'},     {to: 20, name: 'orange'},  {to: 32, name: 'yellow'},
  {to: 44, name: 'lime'},   {to: 75, name: 'green'},   {to: 95, name: 'teal'},
  {to: 125, name: 'blue'},  {to: 145, name: 'purple'}, {to: 165, name: 'pink'},
  {to: 180, name: 'red'}
];

function tiaraHueName(h) {
  for (var i = 0; i < TiaraHueNames.length; i++) {
    if (h < TiaraHueNames[i].to) { return TiaraHueNames[i].name; }
  }
  return '?';
}

// A readable "bow/body" summary of a sampled present, so the log says what the
// script thinks it is looking at rather than just a score.
function tiaraDescribe(t, grid) {
  var split = Math.max(1, Math.floor(grid * 0.35));
  var part = function(r0, r1) {
    var sx = 0, sy = 0, w = 0;
    for (var r = r0; r < r1; r++) {
      for (var c = 0; c < grid; c++) {
        var k = (r * grid + c) * 5;
        if (t[k + 4] <= 0) { continue; }
        sx += t[k]; sy += t[k + 1]; w += t[k + 2];
      }
    }
    if (w <= 0) { return 'white'; }
    var h = Math.atan2(sy, sx) * 90 / Math.PI;
    if (h < 0) { h += 180; }
    return tiaraHueName(h);
  };
  return part(0, split) + ' bow / ' + part(split, grid) + ' body';
}

// Hue vector lookup. Every sampled cell turns its hue into a unit vector; there
// are a few thousand of those per match, and the hue is a byte.
//
// Filled for all 256 values, not just OpenCV's 0..179 hue range, so the table
// is a total function of the byte and cannot hand back undefined -- an
// out-of-range hue would otherwise turn the whole score into NaN, which fails
// every gate silently. The extra entries are the same wrap Math.cos would give.
var TiaraHueCos = [];
var TiaraHueSin = [];
(function() {
  for (var h = 0; h < 256; h++) {
    TiaraHueCos.push(Math.cos(h * Math.PI / 90));
    TiaraHueSin.push(Math.sin(h * Math.PI / 90));
  }
})();

// Reduce a template sampled by tiaraSample to just the cells it marks as
// present, laid out flat.
//
// Scoring only ever looks at those cells -- so neither the dark tsums behind a
// board present nor the white cloud behind the bubble one can influence the
// result -- which means the other cells of a candidate crop never need to be
// read at all. On the reference bubbles the mask keeps between 8% and 58% of
// the 144 cells, around 38% on average, and that is the factor it takes off
// every candidate.
function tiaraCompileTemplate(t, grid) {
  var idx = [], hx = [], hy = [], sat = [], val = [];
  var cells = grid * grid;
  for (var i = 0; i < cells; i++) {
    var k = i * 5;
    if (t[k + 4] <= 0) { continue; }
    idx.push(i);
    hx.push(t[k]); hy.push(t[k + 1]); sat.push(t[k + 2]); val.push(t[k + 3]);
  }
  return {idx: idx, hx: hx, hy: hy, sat: sat, val: val, n: idx.length};
}

// A coarse brightness fingerprint of the play area, cheap enough to take over
// and over. Used only to tell whether anything on the board is still moving.
Tsum.prototype.tiaraBoardSignature = function() {
  var cfg = TiaraMinnieConfig;
  var n = cfg.settleCapture;
  var img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
  var out = [];
  try {
    var step = n / cfg.settleGrid;
    for (var gy = 0; gy < cfg.settleGrid; gy++) {
      for (var gx = 0; gx < cfg.settleGrid; gx++) {
        var c = getImageColor(img, Math.floor((gx + 0.5) * step), Math.floor((gy + 0.5) * step));
        out.push((c.r + c.g + c.b) / 3);
      }
    }
  } finally {
    releaseImage(img);
  }
  return out;
};

function tiaraSignatureDiff(a, b) {
  var d = 0;
  for (var i = 0; i < a.length; i++) { d += Math.abs(a[i] - b[i]); }
  return d / a.length / 255;
}

// Hold off activating until the board stops moving.
//
// Tapping a present blows up an area of the board, so it pays to fire when the
// board is full and settled. The play loop clears a chain (and sometimes works
// the fan) immediately before the skill goes off, and a blast that lands while
// the tsums are still falling hits far fewer of them.
Tsum.prototype.tiaraWaitForSettledBoard = function() {
  var cfg = TiaraMinnieConfig;
  var start = Date.now();
  var deadline = start + cfg.settleWaitMs;
  var prev = this.tiaraBoardSignature();
  var quiet = 0;
  var diff = 1;
  while (Date.now() < deadline) {
    this.sleep(cfg.settlePollMs);
    var now = this.tiaraBoardSignature();
    diff = tiaraSignatureDiff(prev, now);
    prev = now;
    // Two quiet readings, not one, so a momentary lull mid-cascade doesn't pass.
    quiet = diff <= cfg.settleMaxDiff ? quiet + 1 : 0;
    if (quiet >= cfg.settleQuietScans && Date.now() - start >= cfg.settleMinMs) {
      if (this.debug) {
        console.log('[Tiara] board settled in ' + (Date.now() - start) + 'ms, diff ' + diff.toFixed(3));
      }
      return true;
    }
  }
  // Fire anyway: a late skill is worth more than a skipped one.
  log(this.logs.tiaraBusy, diff.toFixed(3));
  return false;
};

// Play square at matching resolution, blurred so one pixel read stands in for
// the average of its cell, then HSV -- where getImageColor gives b=hue 0..179,
// g=saturation, r=value.
Tsum.prototype.tiaraCapture = function() {
  var cfg = TiaraMinnieConfig;
  var img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight,
    cfg.captureSize, cfg.captureSize, 100);
  smooth(img, 1, cfg.captureBlur);
  convertColor(img, 40);
  return img;
};

// The capture pixel each of the grid x grid cells of the logical square
// (lcx, lcy, side) reads from, flat and in row order. Cells falling outside the
// capture are marked -1 and read as black.
//
// These depend only on the layout tables and the capture size, so every table
// is worked out once and kept -- the match loop would otherwise redo a few
// thousand of these multiplies per scan for coordinates that never change.
function tiaraCellPixels(lcx, lcy, side) {
  var cfg = TiaraMinnieConfig;
  var g = cfg.grid;
  var scale = cfg.captureSize / 1080;
  var step = side / g;
  var left = lcx - side / 2;
  var top = lcy - side / 2;
  var px = [], py = [];
  for (var cy = 0; cy < g; cy++) {
    for (var cx = 0; cx < g; cx++) {
      var x = Math.round((left + (cx + 0.5) * step) * scale);
      var y = Math.round((top + (cy + 0.5) * step - PlayAreaTopY) * scale);
      var inside = x >= 0 && y >= 0 && x < cfg.captureSize && y < cfg.captureSize;
      px.push(inside ? x : -1);
      py.push(inside ? y : -1);
    }
  }
  return {px: px, py: py};
}

var TiaraBubbleCells = null;

function tiaraBubbleCells() {
  if (TiaraBubbleCells == null) {
    var cfg = TiaraMinnieConfig;
    TiaraBubbleCells = tiaraCellPixels(cfg.bubbleX, cfg.bubbleY, cfg.bubbleSide);
  }
  return TiaraBubbleCells;
}

// Read a cell table into grid x grid cells. Each cell carries a
// saturation-weighted hue vector, saturation, value, and whether it looks like
// part of a present. Hue goes in as a vector so the 179->0 wrap cannot average
// a red into a cyan.
//
// Only the bubble goes through here; candidates are read and compared in one
// pass by tiaraScoreCandidate, which never materialises this array.
Tsum.prototype.tiaraSample = function(img, cells) {
  var cfg = TiaraMinnieConfig;
  var n = cfg.grid * cfg.grid;
  var out = [];
  for (var i = 0; i < n; i++) {
    var px = cells.px[i];
    var h = 0, s = 0, v = 0;
    if (px >= 0) {
      var col = getImageColor(img, px, cells.py[i]);
      h = col.b; s = col.g; v = col.r;
    }
    out.push(s * TiaraHueCos[h] / 255);
    out.push(s * TiaraHueSin[h] / 255);
    out.push(s / 255);
    out.push(v / 255);
    out.push((s >= cfg.satMin && v >= cfg.valMin) ? 1 : 0);
  }
  return out;
};

// Small, unblurred capture for the cloud test only. That test is polled in a
// loop and only asks whether a big pale blob is on screen, which survives heavy
// downsampling -- the margin it works with is 0.49 against 0.09.
Tsum.prototype.tiaraCloudCapture = function() {
  var n = TiaraMinnieConfig.cloudCaptureSize;
  return getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
};

var TiaraCloudPoints = null;

// The capture pixels the cloud test reads, worked out once instead of on every
// poll, with the present dropped here rather than tested each time round.
function tiaraCloudPoints() {
  if (TiaraCloudPoints != null) { return TiaraCloudPoints; }
  var cfg = TiaraMinnieConfig;
  var box = cfg.cloudBox;
  var size = cfg.cloudCaptureSize;
  var scale = size / 1080;
  var half = cfg.bubbleSide / 2;
  var ex0 = cfg.bubbleX - half, ex1 = cfg.bubbleX + half;
  var ey0 = cfg.bubbleY - half, ey1 = cfg.bubbleY + half;
  var xs = [], ys = [];
  for (var ly = box.y0; ly <= box.y1; ly += cfg.cloudStep) {
    for (var lx = box.x0; lx <= box.x1; lx += cfg.cloudStep) {
      // Skip the present itself: only the cloud around it should count.
      if (lx >= ex0 && lx <= ex1 && ly >= ey0 && ly <= ey1) { continue; }
      var px = Math.round(lx * scale);
      var py = Math.round((ly - PlayAreaTopY) * scale);
      if (px < 0 || py < 0 || px >= size || py >= size) { continue; }
      xs.push(px); ys.push(py);
    }
  }
  TiaraCloudPoints = {xs: xs, ys: ys, n: xs.length};
  return TiaraCloudPoints;
}

// How much of the area around the bubble is pale cloud. Separates "bubble is
// up" from "presents are up" and from ordinary play by a wide margin: the
// sample frames read 0.48-0.50 with a bubble and 0.02-0.06 without one.
// Takes a capture from tiaraCloudCapture, not the matching one.
//
// Reads the raw BGR pixel: OpenCV's HSV value is max(b,g,r) and its saturation
// is 255*(max-min)/max, so the pale test can be made straight from the pixel
// and the whole-image colour conversion this poll would otherwise run dropped.
// The saturation is rounded the way OpenCV rounds it, so pixels sitting exactly
// on the threshold fall the same side of it.
Tsum.prototype.tiaraCloudFrac = function(img) {
  var cfg = TiaraMinnieConfig;
  var pts = tiaraCloudPoints();
  if (pts.n === 0) { return 0; }
  var hit = 0;
  for (var i = 0; i < pts.n; i++) {
    var col = getImageColor(img, pts.xs[i], pts.ys[i]);
    var mx = col.r > col.g
      ? (col.r > col.b ? col.r : col.b)
      : (col.g > col.b ? col.g : col.b);
    if (mx < cfg.cloudValMin) { continue; }
    var mn = col.r < col.g
      ? (col.r < col.b ? col.r : col.b)
      : (col.g < col.b ? col.g : col.b);
    if (Math.round(255 * (mx - mn) / mx) <= cfg.cloudSatMax) { hit++; }
  }
  return hit / pts.n;
};

var TiaraCandidates = null;

// Every present centre from every layout, each with the cell table for the crop
// size that suits its count. Scored together; the count is never decided.
function tiaraCandidates() {
  if (TiaraCandidates != null) { return TiaraCandidates; }
  var out = [];
  for (var n = 2; n <= 6; n++) {
    var slots = TiaraLayouts[n];
    var side = TiaraSlotSide[n];
    for (var i = 0; i < slots.length; i++) {
      var cells = tiaraCellPixels(slots[i].x, slots[i].y, side);
      out.push({x: slots[i].x, y: slots[i].y, count: n, px: cells.px, py: cells.py});
    }
  }
  TiaraCandidates = out;
  return out;
}

// Similarity of one candidate crop to the compiled bubble template, 0..1.
//
// Reading the pixel and comparing it happen in the same pass, over the
// template's cells only, so a candidate costs as many pixel reads as the mask
// has cells rather than a full grid. Each cell's difference is divided by
// cellSpread and clipped, which makes the score count clearly-wrong cells
// instead of averaging away small ones -- worth roughly triple the margin of a
// plain mean.
Tsum.prototype.tiaraScoreCandidate = function(img, cand, tpl) {
  var spread = TiaraMinnieConfig.cellSpread;
  if (tpl.n <= 0) { return 0; }
  var d = 0;
  for (var j = 0; j < tpl.n; j++) {
    var i = tpl.idx[j];
    var px = cand.px[i];
    var chx = 0, chy = 0, cs = 0, cv = 0;
    if (px >= 0) {
      var col = getImageColor(img, px, cand.py[i]);
      cs = col.g / 255;
      cv = col.r / 255;
      chx = cs * TiaraHueCos[col.b];
      chy = cs * TiaraHueSin[col.b];
    }
    var cell = (Math.abs(tpl.hx[j] - chx) + Math.abs(tpl.hy[j] - chy)
              + Math.abs(tpl.sat[j] - cs) + Math.abs(tpl.val[j] - cv)) / 4 / spread;
    if (cell > 1) { cell = 1; }
    d += cell;
  }
  return 1 - d / tpl.n;
};

Tsum.prototype.tiaraBestMatch = function(img, tpl) {
  var cands = tiaraCandidates();
  var n = cands.length;
  var scores = [];
  var bi = 0;
  var i;
  for (i = 0; i < n; i++) {
    scores.push(this.tiaraScoreCandidate(img, cands[i], tpl));
    if (scores[i] > scores[bi]) { bi = i; }
  }
  var best = cands[bi];
  // Centres from different layouts can land on the same present, and tapping
  // either is correct, so the margin is measured against the best candidate
  // that is somewhere else entirely.
  var rival = -1;
  for (i = 0; i < n; i++) {
    var dx = cands[i].x - best.x, dy = cands[i].y - best.y;
    if (dx * dx + dy * dy < 100 * 100) { continue; }
    if (rival < 0 || scores[i] > scores[rival]) { rival = i; }
  }
  return {
    x: best.x, y: best.y, count: best.count, score: scores[bi],
    margin: rival < 0 ? scores[bi] : scores[bi] - scores[rival]
  };
};

// Wait for the thought bubble, then read the present inside it.
Tsum.prototype.tiaraWaitForDream = function(timeoutMs) {
  var cfg = TiaraMinnieConfig;
  var deadline = Date.now() + timeoutMs;
  var seen = false;
  while (Date.now() < deadline) {
    var img = this.tiaraCloudCapture();
    try {
      seen = this.tiaraCloudFrac(img) >= cfg.cloudMinFrac;
    } finally {
      releaseImage(img);
    }
    if (seen) { break; }
    this.sleep(cfg.pollMs);
  }
  if (!seen) { return null; }
  // The bubble scales in; reading it mid-animation gives a shrunken present.
  this.sleep(cfg.dreamSettleMs);
  var img2 = this.tiaraCapture();
  try {
    return this.tiaraSample(img2, tiaraBubbleCells());
  } finally {
    releaseImage(img2);
  }
};

// Wait for the presents to land, then tap the one matching the template. The
// game timer is stopped for this whole stretch, so every check here is free.
//
// Three things must agree before a tap goes out: the score clears the floor,
// the winner beats everything elsewhere by the margin (which is what actually
// proves a present is there rather than a lucky patch of board), and the same
// centre wins twice running.
Tsum.prototype.tiaraPick = function(tpl) {
  var cfg = TiaraMinnieConfig;
  var deadline = Date.now() + cfg.choiceWaitMs;
  var img;
  // A template with no cells scores every candidate 0, so no tap can ever clear
  // the floor. Leave now rather than spend choiceWaitMs of full-resolution
  // captures proving it.
  if (tpl.n <= 0) { return null; }

  // The presents only exist once the bubble has gone.
  while (Date.now() < deadline) {
    img = this.tiaraCloudCapture();
    var gone;
    try {
      gone = this.tiaraCloudFrac(img) < cfg.cloudMinFrac;
    } finally {
      releaseImage(img);
    }
    if (gone) { break; }
    this.sleep(cfg.pollMs);
  }
  this.sleep(cfg.choiceLeadMs);

  var agree = 0;
  var last = null;
  while (Date.now() < deadline) {
    img = this.tiaraCapture();
    var m;
    try {
      m = this.tiaraBestMatch(img, tpl);
    } finally {
      releaseImage(img);
    }
    if (m.score >= cfg.confidenceFloor && m.margin >= cfg.marginFloor) {
      agree = (last != null && last.x === m.x && last.y === m.y) ? agree + 1 : 1;
      last = m;
      if (agree >= cfg.agreeScans) {
        for (var i = 0; i < cfg.pickTaps; i++) {
          this.tap({x: m.x, y: m.y}, cfg.pickTapDuring);
          if (i + 1 < cfg.pickTaps) { this.sleep(cfg.pickTapGapMs); }
        }
        return m;
      }
    } else {
      agree = 0;
      last = null;
      if (this.debug) {
        console.log('[Tiara] waiting: best ' + m.score.toFixed(2)
          + ' margin ' + m.margin.toFixed(2) + ' at ' + m.x + ',' + m.y);
      }
    }
    this.sleep(cfg.matchPollMs);
  }
  return null;
};

// One bubble, one pick, per activation.
//
// The thought bubble is only shown once, straight after the skill fires -- it
// does not come back between picks -- so once the present is tapped there is
// nothing left to wait for and this returns straight away. (The 2-to-6
// progression happens across activations, not inside one.)
Tsum.prototype.useTiaraMinniePlusSkill = function() {
  var cfg = TiaraMinnieConfig;
  var started = Date.now();
  this.sleep(cfg.dreamLeadMs);
  var armed = Date.now();
  var template = this.tiaraWaitForDream(cfg.dreamWaitMs);
  if (template == null) {
    log(this.logs.tiaraNoDream);
    return 0;
  }
  log(this.logs.tiaraDream, tiaraDescribe(template, cfg.grid),
      'after ' + (Date.now() - armed) + 'ms');
  // Compiled once and reused by every candidate of every scan.
  var pick = this.tiaraPick(tiaraCompileTemplate(template, cfg.grid));
  if (pick == null) {
    log(this.logs.tiaraUnsure);
    return 0;
  }
  log(this.logs.tiaraPicked, pick.x + ',' + pick.y,
      'score ' + pick.score.toFixed(2), 'margin ' + pick.margin.toFixed(2),
      'layout ' + pick.count, 'total ' + (Date.now() - started) + 'ms');
  return 1;
};
