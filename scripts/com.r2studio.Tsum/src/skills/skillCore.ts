// ---------------------------------------------------------------------------
// Skill dispatch
//
// Every playable skill lives in its own file under src/skills/ and registers a
// handler here. useSkill owns the parts that are the same for all of them --
// checking the gauge, the fever hold-off, the activation tap(s) -- and hands the
// skill-specific choreography to the registered handler.
//
// Files are concatenated in tsconfig order, so this file must come before the
// individual skill files: their registerSkill calls run at load time.
// ---------------------------------------------------------------------------

interface SkillHandler {
  // skillType keys (from the Skill Type dropdown in settings) this handler drives.
  types: string[];
  // A bare tap on the skill button is a complete activation: no aiming, no
  // follow-up, and a tap while the gauge is still filling is a no-op the game
  // ignores. Lets the play loop fire these blind instead of paying for a gauge
  // check (see Tsum.link and maybeAutoTapSkill).
  bareTapActivates?: boolean;
  // The skill has two halves on two buttons (Pair Tsum): gameSkill2 counts
  // towards readiness and gets its own activation tap.
  usesSecondButton?: boolean;
  // Runs after the gauge check but before the activation tap -- settle waits and
  // pre-taps that have to land while the skill is not yet running.
  beforeActivate?: (ts: any) => void;
  // The choreography, run straight after the activation tap. Returning false
  // reports "did not fire" to the caller even though the skill went off.
  afterActivate?: (ts: any, board: any) => boolean | void;
}

var SkillHandlers: { [type: string]: SkillHandler } = {};

function registerSkill(handler: SkillHandler) {
  for (let i = 0; i < handler.types.length; i++) {
    SkillHandlers[handler.types[i]] = handler;
  }
}

// Skills with no choreography of their own: tap randomize (tsums that support it
// reshuffle) and wait out skillInterval. Also what an unregistered skillType
// falls back to, so a stale setting still plays.
function skillRandomizeAndWait(ts: any) {
  ts.tap(Button.gameRand, 100);
  ts.sleep(ts.skillInterval - 100);
}

function skillBareTapActivates(skillType: string): boolean {
  const handler = SkillHandlers[skillType];
  return !!(handler && handler.bareTapActivates);
}

// The skill button reads one of these colors while the gauge is not yet full.
// Don't know the reason why these are checked instead of the "active skill"
// colors, but hopefully for a good reason.
var SkillNotActiveColors = [
  {"a": 0, "b": 157, "g": 112, "r": 85},
  {"a": 0, "b": 181, "g": 139, "r": 72},
  {"a": 0, "b": 128, "g": 73, "r": 16},
  {"a": 0, "b": 178, "g": 153, "r": 3},
  {"a": 0, "b": 255, "g": 215, "r": 33}
];

// Tiered gauge read against SkillNotActiveColors, at two thresholds: tight (25)
// means firmly empty; loose (60) is the plain not-active match. Returns
// 'active', 'almost', or 'far'.
Tsum.prototype.checkSkillReadiness = function(img, skillButton) {
  const c = this.getColor(img, skillButton);
  let matchesTight = false, matchesLoose = false;
  for (let i = 0; i < SkillNotActiveColors.length; i++) {
    const nc = SkillNotActiveColors[i];
    if (isSameColor(nc, c, 25)) { matchesTight = true; }
    if (isSameColor(nc, c, 60)) { matchesLoose = true; }
  }
  if (!matchesLoose) { return 'active'; }
  if (!matchesTight) { return 'almost'; }
  return 'far';
};

// Whether firing the fan now would be a waste: the tsums it shuffles are about
// to be cleared by a skill that is ready or nearly so. It also leaves the board
// churning right as the skill activates, which matters for skills that read the
// board on activation (Tiara Minnie+ blows up whatever is under her pick).
// Costs one screenshot, so only call it where a fan tap is actually pending.
Tsum.prototype.fanWouldBeWasted = function() {
  const img = this.screenshot();
  try {
    return this.checkSkillReadiness(img, Button.gameSkill1) !== 'far';
  } finally {
    releaseImage(img);
  }
};

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
  if (skillBareTapActivates(this.skillType)) {
    // A bare tap is a complete activation for burst skills, and it's a no-op
    // while the gauge isn't full -- skip the screenshots entirely.
    this.tap(Button.gameSkill1, 10);
    return;
  }
  // One readiness read before the full useSkill probe (findPage plus a double
  // gauge check, several screenshots) so the recurring cost while the gauge is
  // still filling stays at a single screenshot.
  const img = this.screenshot();
  let status: string;
  try {
    status = this.checkSkillReadiness(img, Button.gameSkill1);
  } finally {
    releaseImage(img);
  }
  if (status === 'active') {
    this.useSkill(board);
  }
};

// Hold off activating while a fever is about to end, so the skill's clear lands
// in the next fever rather than being spent on its last moments.
function skillWaitOutEndingFever(ts: any) {
  let feverAlmostOver = null;
  do {
    if (feverAlmostOver) {
      ts.sleep(100);
    }
    const img = ts.screenshot();
    try {
      const fever1 = isSameColor(ts.getColor(img, {x: 340, y: 310}), {r: 0, g: 40, b: 49}, 80);
      const feverRingLeft = rgb2hsv(ts.getColor(img, {x: 332, y: 1666}));
      const feverRingRight = rgb2hsv(ts.getColor(img, {x: 746, y: 1666}));
      const hueDifference = Math.min(
          Math.abs(feverRingLeft.h - feverRingRight.h),
          360 - Math.abs(feverRingLeft.h - feverRingRight.h));
      const fever2 = hueDifference > 20;
      const feverStartColorHsv = rgb2hsv(ts.getColor(img, {x: 345, y: 1670}));
      const offsetX = Math.floor((733 - 345) * ts.noSkillLastFeverSec / 10);
      const feverEndColorHsv = rgb2hsv(ts.getColor(img, {x: 345 + offsetX, y: 1670}));
      const nearlyDone = feverEndColorHsv.v < 90 || Math.abs(feverStartColorHsv.v - feverEndColorHsv.v) > 10;
      const remainingTimeColor = ts.getColor(img, {x: 155, y: 190});
      const fewSecondsLeftColor = ts.getColor(img, {x: 144, y: 195});
      const enoughSecondsRemaining = isSameColor(remainingTimeColor, fewSecondsLeftColor, 60);
      // debug({fever1: fever1, fever2: fever2, almostOver: nearlyDone, enoughTime: enoughSecondsRemaining});
      feverAlmostOver = fever1 && fever2 && nearlyDone && enoughSecondsRemaining;
    } finally {
      releaseImage(img);
    }
  } while (feverAlmostOver);
}

Tsum.prototype.useSkill = function(board) {
  if (this.skillType === 'no_skill') {
    return false;
  }

  const page = this.findPage(1, 500);
  if (page !== 'GamePlaying' && page !== 'GamePause') {
    return false;
  }

  const handler = SkillHandlers[this.skillType];
  const usesSecondButton = !!(handler && handler.usesSecondButton);

  // Checked twice, a moment apart: a single read can catch the button mid-flash.
  let skillActive2 = false;
  for (let i = 0; i < 2; i++) {
    const img = this.screenshot();
    let skillActive1;
    try {
      skillActive1 = this.checkSkillReadiness(img, Button.gameSkill1) === 'active';
      skillActive2 = usesSecondButton
        && this.checkSkillReadiness(img, Button.gameSkill2) === 'active';
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
    skillWaitOutEndingFever(this);
  }

  log(this.logs.useSkill);
  if (handler && handler.beforeActivate) {
    handler.beforeActivate(this);
  }

  this.tap(Button.gameSkill1);
  this.sleep(30);
  if (skillActive2) {
    this.tap(Button.gameSkill2);
    this.sleep(30);
  }

  if (handler && handler.afterActivate) {
    return handler.afterActivate(this, board) !== false;
  }
  skillRandomizeAndWait(this);
  return true;
}
