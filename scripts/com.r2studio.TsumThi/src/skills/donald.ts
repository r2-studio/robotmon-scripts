// Donald / Holiday Donald — the skill scatters tappable targets over the board.
//
// Nothing is detected: the whole play area is covered on a coarse grid, three
// times over. A tap that lands on nothing costs nothing.

registerSkill({
  types: ['block_donald_s', 'block_donaldx_s'],
  afterActivate: function(ts) {
    for (let pass = 0; pass < 3; pass++) {
      for (let bx = Button.gameBubblesFrom.x - 40; bx <= Button.gameBubblesTo.x + 40; bx += 150) {
        for (let by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y + 100; by += 150) {
          ts.tap({x: bx, y: by}, 10);
        }
      }
    }
  }
});
