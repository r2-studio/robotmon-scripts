// Jedi Luke — the only skill with taps on both sides of the activation.
//
// The four skillLuke positions are tapped before activating (clearing whatever
// is already on them), then the skill is flown with five upward drags, then the
// same four positions again.

function lukeJTapTargets(ts: any) {
  ts.tap(Button.skillLuke1, 30);
  ts.tap(Button.skillLuke2, 30);
  ts.tap(Button.skillLuke3, 30);
  ts.tap(Button.skillLuke4, 30);
}

registerSkill({
  types: ['block_lukej_s'],
  beforeActivate: lukeJTapTargets,
  afterActivate: function(ts) {
    for (let i = 0; i < 5; i++) {
      ts.tapDown({x: 820, y: 1200}, 20);
      ts.moveTo({x: 820, y: 1150}, 20);
      if (i === 0) {
        // The first run has to wait out the skill's intro animation.
        ts.sleep(1160);
      }
      ts.sleep(350);
      ts.moveTo({x: 825, y: 1000}, 20);
      ts.sleep(100);
      ts.moveTo({x: 835, y: 800}, 20);
      ts.sleep(100);
      ts.moveTo({x: 845, y: 600}, 20);
      ts.sleep(100);
      ts.moveTo({x: 850, y: 450}, 20);
      ts.tapUp({x: 850, y: 420}, 20);
      ts.sleep(20);
    }
    ts.sleep(400);
    lukeJTapTargets(ts);
    ts.sleep(400);
  }
});
