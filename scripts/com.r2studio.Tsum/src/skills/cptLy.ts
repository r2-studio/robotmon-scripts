// Cpt. Lightyear — randomize, then timed aiming taps, then a bubble sweep.
//
// How many aiming taps land depends on the skill level, and the gaps between
// them are the animation's, so they can't be collapsed into one loop.

// Assumes the skill has already been activated (gauge consumed) -- callers tap
// gameSkill1 first.
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

registerSkill({
  types: ['block_cpt_ly_s'],
  afterActivate: function(ts) {
    ts.useCptLySkill();
  }
});
