// Snow White — a full sweep once the animation is done, then a second one from
// halfway down the board to catch bubbles that drifted after the first pass.

registerSkill({
  types: ['block_snowwhite_s'],
  afterActivate: function(ts) {
    ts.clearAllBubbles(1300);
    ts.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
  }
});
