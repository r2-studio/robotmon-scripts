// Burst — the plain clearing skills.
//
// No aiming and no follow-up: the tap is the whole activation, which is what
// lets the play loop fire these blind between chains (see Tsum.link).

registerSkill({
  types: ['burst'],
  bareTapActivates: true,
  afterActivate: function(ts) {
    skillRandomizeAndWait(ts);
  }
});

// Same skill, on a board that leaves bubbles behind: sweep them after the clear.
registerSkill({
  types: ['burst_bubbles'],
  bareTapActivates: true,
  afterActivate: function(ts) {
    skillRandomizeAndWait(ts);
    ts.clearAllBubbles(0, 0, 1000, 300);
  }
});
