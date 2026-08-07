// Pair Tsum — two halves on two skill buttons.
//
// Either gauge filling counts as ready, and whichever ones are ready get their
// own activation tap (handled by useSkill via usesSecondButton). No choreography
// beyond that.

registerSkill({
  types: ['block_pair_tsum'],
  usesSecondButton: true,
  afterActivate: function(ts) {
    skillRandomizeAndWait(ts);
  }
});
