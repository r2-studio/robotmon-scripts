// Cinderella — the skill is aimed by drawing over the board, not by tapping.
//
// Ten serpentine passes (five repeats x two horizontal offsets) sweep the whole
// play area, then the bubbles left behind are cleared. The coordinates are in
// the playResize space linkTsums draws in, not screen pixels.

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

registerSkill({
  types: ['block_cinderella_s'],
  afterActivate: function(ts, board) {
    ts.sleep(1500);
    ts.useCinderellaSkill(board);
  }
});
