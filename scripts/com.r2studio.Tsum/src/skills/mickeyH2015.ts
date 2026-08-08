// Horn Hat Mickey — bubbles, with the shortest intro of the bubble skills.

registerSkill({
  types: ['block_mickeyh2015_s'],
  afterActivate: function(ts) {
    ts.clearAllBubbles(1500, 50);
  }
});
