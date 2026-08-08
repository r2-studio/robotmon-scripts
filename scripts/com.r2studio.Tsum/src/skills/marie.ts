// Marie / Miss Bunny / Rabbit — the skill turns tsums into bubbles that have to
// be popped by hand. Same animation length for all three, so one sweep serves.

registerSkill({
  types: ['block_marie_s', 'block_missbunny_s', 'block_rabbit_s'],
  afterActivate: function(ts) {
    ts.clearAllBubbles(2000, 50);
  }
});
