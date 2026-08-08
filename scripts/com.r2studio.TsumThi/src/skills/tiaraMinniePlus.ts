// ---------------------------------------------------------------------------
// Tiara Minnie+
//
// The skill shows Minnie with a thought bubble holding one present, then a
// screen of presents to pick the match from; a fresh bubble comes with every
// pick. Both halves are read by cropping fixed boxes and comparing the pictures
// directly: the bubble is always drawn in the same place, and the presents
// always land on the centres in TiaraLayouts.
//
// Nothing here works out how many presents are on screen. Every centre from
// every layout is scored against the bubble and the best-matching one is
// tapped, so a miscounted screen cannot send the tap to the wrong place -- and
// two centres from different layouts that sit on the same present are both
// right answers. Offline this picked the correct present on all 20 frame/design
// pairs, and kept doing so with every centre shifted by up to 25px.
// ---------------------------------------------------------------------------

// Hue names for the debug line, over OpenCV's 0..179 hue range.
var TiaraHueNames = [
  {to: 8, name: 'red'},     {to: 20, name: 'orange'},  {to: 32, name: 'yellow'},
  {to: 44, name: 'lime'},   {to: 75, name: 'green'},   {to: 95, name: 'teal'},
  {to: 125, name: 'blue'},  {to: 145, name: 'purple'}, {to: 165, name: 'pink'},
  {to: 180, name: 'red'}
];

function tiaraHueName(h: number): string {
  for (let i = 0; i < TiaraHueNames.length; i++) {
    if (h < TiaraHueNames[i].to) { return TiaraHueNames[i].name; }
  }
  return '?';
}

// A readable "bow/body" summary of a sampled present, so the log says what the
// script thinks it is looking at rather than just a score.
function tiaraDescribe(t: number[], grid: number): string {
  const split = Math.max(1, Math.floor(grid * 0.35));
  const part = function(r0: number, r1: number): string {
    let sx = 0, sy = 0, w = 0;
    for (let r = r0; r < r1; r++) {
      for (let c = 0; c < grid; c++) {
        const k = (r * grid + c) * 5;
        if (t[k + 4] <= 0) { continue; }
        sx += t[k]; sy += t[k + 1]; w += t[k + 2];
      }
    }
    if (w <= 0) { return 'white'; }
    let h = Math.atan2(sy, sx) * 90 / Math.PI;
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
var TiaraHueCos: number[] = [];
var TiaraHueSin: number[] = [];
(function() {
  for (let h = 0; h < 256; h++) {
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
function tiaraCompileTemplate(t: number[], grid: number) {
  const idx = [], hx = [], hy = [], sat = [], val = [];
  const cells = grid * grid;
  for (let i = 0; i < cells; i++) {
    const k = i * 5;
    if (t[k + 4] <= 0) { continue; }
    idx.push(i);
    hx.push(t[k]); hy.push(t[k + 1]); sat.push(t[k + 2]); val.push(t[k + 3]);
  }
  return {idx: idx, hx: hx, hy: hy, sat: sat, val: val, n: idx.length};
}

// A coarse brightness fingerprint of the play area, cheap enough to take over
// and over. Used only to tell whether anything on the board is still moving.
Tsum.prototype.tiaraBoardSignature = function() {
  const cfg = TiaraMinnieConfig;
  const n = cfg.settleCapture;
  const img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
  const out = [];
  try {
    const step = n / cfg.settleGrid;
    for (let gy = 0; gy < cfg.settleGrid; gy++) {
      for (let gx = 0; gx < cfg.settleGrid; gx++) {
        const c = getImageColor(img, Math.floor((gx + 0.5) * step), Math.floor((gy + 0.5) * step));
        out.push((c.r + c.g + c.b) / 3);
      }
    }
  } finally {
    releaseImage(img);
  }
  return out;
};

function tiaraSignatureDiff(a: number[], b: number[]): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) { d += Math.abs(a[i] - b[i]); }
  return d / a.length / 255;
}

// Hold off activating until the board stops moving.
//
// Tapping a present blows up an area of the board, so it pays to fire when the
// board is full and settled. The play loop clears a chain (and sometimes works
// the fan) immediately before the skill goes off, and a blast that lands while
// the tsums are still falling hits far fewer of them.
Tsum.prototype.tiaraWaitForSettledBoard = function() {
  const cfg = TiaraMinnieConfig;
  const start = Date.now();
  const deadline = start + cfg.settleWaitMs;
  let prev = this.tiaraBoardSignature();
  let quiet = 0;
  let diff = 1;
  while (Date.now() < deadline) {
    this.sleep(cfg.settlePollMs);
    const now = this.tiaraBoardSignature();
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
  const cfg = TiaraMinnieConfig;
  const img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight,
    cfg.captureSize, cfg.captureSize, 100);
  smooth(img, 1, cfg.captureBlur);
  convertColor(img, 40);
  return img;
};

// The capture pixel each of the grid x grid cells of the logical square
// (lcx, lcy, side) reads from, flat and in row order. Cells falling outside the
// capture are marked -1 and read as black, as they always were.
//
// These depend only on the layout tables and the capture size, so every table
// is worked out once and kept -- the match loop would otherwise redo a few
// thousand of these multiplies per scan for coordinates that never change.
function tiaraCellPixels(lcx: number, lcy: number, side: number) {
  const cfg = TiaraMinnieConfig;
  const g = cfg.grid;
  const scale = cfg.captureSize / 1080;
  const step = side / g;
  const left = lcx - side / 2;
  const top = lcy - side / 2;
  const px = [], py = [];
  for (let cy = 0; cy < g; cy++) {
    for (let cx = 0; cx < g; cx++) {
      const x = Math.round((left + (cx + 0.5) * step) * scale);
      const y = Math.round((top + (cy + 0.5) * step - PlayAreaTopY) * scale);
      const inside = x >= 0 && y >= 0 && x < cfg.captureSize && y < cfg.captureSize;
      px.push(inside ? x : -1);
      py.push(inside ? y : -1);
    }
  }
  return {px: px, py: py};
}

var TiaraBubbleCells = null;

function tiaraBubbleCells() {
  if (TiaraBubbleCells == null) {
    const cfg = TiaraMinnieConfig;
    TiaraBubbleCells = tiaraCellPixels(cfg.bubbleX, cfg.bubbleY, cfg.bubbleSide);
  }
  return TiaraBubbleCells;
}

// Read a cell table into grid x grid cells. Each cell carries a
// saturation-weighted hue vector, saturation, value, and whether it looks like
// part of a present. Hue goes in as a vector so the 179->0 wrap cannot average
// a red into a cyan.
//
// Only the bubble goes through here now; candidates are read and compared in
// one pass by tiaraScoreCandidate, which never materialises this array.
Tsum.prototype.tiaraSample = function(img, cells) {
  const cfg = TiaraMinnieConfig;
  const n = cfg.grid * cfg.grid;
  const out = [];
  for (let i = 0; i < n; i++) {
    const px = cells.px[i];
    let h = 0, s = 0, v = 0;
    if (px >= 0) {
      const col = getImageColor(img, px, cells.py[i]);
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
//
// Grabs the whole play square even though only cloudBox is read from it.
// Cropping to the box was tried: it is 88% less capture area, but it resamples
// the region on a slightly different grid, and this test decides when matching
// starts. Not worth an unproven change to that.
Tsum.prototype.tiaraCloudCapture = function() {
  const n = TiaraMinnieConfig.cloudCaptureSize;
  return getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
};

var TiaraCloudPoints = null;

// The capture pixels the cloud test reads -- the same points it always read,
// worked out once instead of on every poll, with the present dropped here
// rather than tested each time round.
function tiaraCloudPoints() {
  if (TiaraCloudPoints != null) { return TiaraCloudPoints; }
  const cfg = TiaraMinnieConfig;
  const box = cfg.cloudBox;
  const size = cfg.cloudCaptureSize;
  const scale = size / 1080;
  const half = cfg.bubbleSide / 2;
  const ex0 = cfg.bubbleX - half, ex1 = cfg.bubbleX + half;
  const ey0 = cfg.bubbleY - half, ey1 = cfg.bubbleY + half;
  const xs = [], ys = [];
  for (let ly = box.y0; ly <= box.y1; ly += cfg.cloudStep) {
    for (let lx = box.x0; lx <= box.x1; lx += cfg.cloudStep) {
      // Skip the present itself: only the cloud around it should count.
      if (lx >= ex0 && lx <= ex1 && ly >= ey0 && ly <= ey1) { continue; }
      const px = Math.round(lx * scale);
      const py = Math.round((ly - PlayAreaTopY) * scale);
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
// and the whole-image colour conversion this poll used to run dropped. The
// saturation is rounded the way OpenCV rounds it, so pixels sitting exactly on
// the threshold fall the same side of it as before.
Tsum.prototype.tiaraCloudFrac = function(img) {
  const cfg = TiaraMinnieConfig;
  const pts = tiaraCloudPoints();
  if (pts.n === 0) { return 0; }
  let hit = 0;
  for (let i = 0; i < pts.n; i++) {
    const col = getImageColor(img, pts.xs[i], pts.ys[i]);
    const mx = col.r > col.g
      ? (col.r > col.b ? col.r : col.b)
      : (col.g > col.b ? col.g : col.b);
    if (mx < cfg.cloudValMin) { continue; }
    const mn = col.r < col.g
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
  const out = [];
  for (let n = 2; n <= 6; n++) {
    const slots = TiaraLayouts[n];
    const side = TiaraSlotSide[n];
    for (let i = 0; i < slots.length; i++) {
      const cells = tiaraCellPixels(slots[i].x, slots[i].y, side);
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
  const spread = TiaraMinnieConfig.cellSpread;
  if (tpl.n <= 0) { return 0; }
  let d = 0;
  for (let j = 0; j < tpl.n; j++) {
    const i = tpl.idx[j];
    const px = cand.px[i];
    let chx = 0, chy = 0, cs = 0, cv = 0;
    if (px >= 0) {
      const col = getImageColor(img, px, cand.py[i]);
      cs = col.g / 255;
      cv = col.r / 255;
      chx = cs * TiaraHueCos[col.b];
      chy = cs * TiaraHueSin[col.b];
    }
    let cell = (Math.abs(tpl.hx[j] - chx) + Math.abs(tpl.hy[j] - chy)
              + Math.abs(tpl.sat[j] - cs) + Math.abs(tpl.val[j] - cv)) / 4 / spread;
    if (cell > 1) { cell = 1; }
    d += cell;
  }
  return 1 - d / tpl.n;
};

Tsum.prototype.tiaraBestMatch = function(img, tpl) {
  const cands = tiaraCandidates();
  const n = cands.length;
  const scores = [];
  let bi = 0;
  for (let i = 0; i < n; i++) {
    scores.push(this.tiaraScoreCandidate(img, cands[i], tpl));
    if (scores[i] > scores[bi]) { bi = i; }
  }
  const best = cands[bi];
  // Centres from different layouts can land on the same present, and tapping
  // either is correct, so the margin is measured against the best candidate
  // that is somewhere else entirely.
  let rival = -1;
  for (let i = 0; i < n; i++) {
    const dx = cands[i].x - best.x, dy = cands[i].y - best.y;
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
  const cfg = TiaraMinnieConfig;
  const deadline = Date.now() + timeoutMs;
  let seen = false;
  while (Date.now() < deadline) {
    const img = this.tiaraCloudCapture();
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
  const img2 = this.tiaraCapture();
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
  const cfg = TiaraMinnieConfig;
  const deadline = Date.now() + cfg.choiceWaitMs;
  // A template with no cells scores every candidate 0, so no tap can ever clear
  // the floor. Leave now rather than spend choiceWaitMs of full-resolution
  // captures proving it.
  if (tpl.n <= 0) { return null; }

  // The presents only exist once the bubble has gone.
  while (Date.now() < deadline) {
    const img = this.tiaraCloudCapture();
    let gone;
    try {
      gone = this.tiaraCloudFrac(img) < cfg.cloudMinFrac;
    } finally {
      releaseImage(img);
    }
    if (gone) { break; }
    this.sleep(cfg.pollMs);
  }
  this.sleep(cfg.choiceLeadMs);

  let agree = 0;
  let last = null;
  while (Date.now() < deadline) {
    const img = this.tiaraCapture();
    let m;
    try {
      m = this.tiaraBestMatch(img, tpl);
    } finally {
      releaseImage(img);
    }
    if (m.score >= cfg.confidenceFloor && m.margin >= cfg.marginFloor) {
      agree = (last != null && last.x === m.x && last.y === m.y) ? agree + 1 : 1;
      last = m;
      if (agree >= cfg.agreeScans) {
        for (let i = 0; i < cfg.pickTaps; i++) {
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
  const cfg = TiaraMinnieConfig;
  const started = Date.now();
  this.sleep(cfg.dreamLeadMs);
  const armed = Date.now();
  const template = this.tiaraWaitForDream(cfg.dreamWaitMs);
  if (template == null) {
    log(this.logs.tiaraNoDream);
    return 0;
  }
  log(this.logs.tiaraDream, tiaraDescribe(template, cfg.grid),
      'after ' + (Date.now() - armed) + 'ms');
  // Compiled once and reused by every candidate of every scan.
  const pick = this.tiaraPick(tiaraCompileTemplate(template, cfg.grid));
  if (pick == null) {
    log(this.logs.tiaraUnsure);
    return 0;
  }
  log(this.logs.tiaraPicked, pick.x + ',' + pick.y,
      'score ' + pick.score.toFixed(2), 'margin ' + pick.margin.toFixed(2),
      'layout ' + pick.count, 'total ' + (Date.now() - started) + 'ms');
  return 1;
};

registerSkill({
  types: ['block_tiara_minnie_plus_s'],
  beforeActivate: function(ts) {
    // Her picks detonate the board, so wait for it to stop moving first.
    ts.tiaraWaitForSettledBoard();
  },
  afterActivate: function(ts) {
    ts.useTiaraMinniePlusSkill();
    // Always report "did not fire", whatever happened. The caller runs
    // `while (useSkill())`, and for a skill that takes seconds of choreography
    // an immediate second go is never right: the gauge still reads active
    // through the outro, so a `true` here buys another settle wait, lead-in and
    // bubble wait -- about six seconds of standing still -- before the missing
    // bubble finally ends it. If the gauge really is full again, the next
    // board-scan cycle picks it up one cycle later, which costs nothing like
    // as much.
    return false;
  }
});
