// Moana — bubbles again, behind a slightly longer intro than Marie's.

registerSkill({
  types: ['block_moana_s'],
  afterActivate: function(ts) {
    ts.clearAllBubbles(2500, 50);
  }
});
