// Sheriff Woody — the lasso is swung by holding and dragging left/right across
// the middle of the board. Three full sweeps per activation.

registerSkill({
  types: ['block_woody2_s'],
  afterActivate: function(ts) {
    ts.sleep(1800);
    ts.tapDown({x: 540, y: 960}, 20);
    ts.moveTo({x: 980, y: 960}, 20);
    ts.sleep(50);
    for (let i = 0; i < 3; i++) {
      ts.moveTo({x: 100, y: 960}, 20);
      ts.sleep(420);
      ts.moveTo({x: 980, y: 960}, 20);
      ts.sleep(480);
    }
    ts.tapUp({x: 980, y: 960}, 20);
  }
});
