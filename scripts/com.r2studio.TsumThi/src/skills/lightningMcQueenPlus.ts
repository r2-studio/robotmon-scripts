// Lightning McQueen+ — the car accelerates after activation and clears more the
// faster it is going, so the follow-up tap has to wait for top speed.
//
// Top speed is read off a single pixel of the play square going full red; the
// poll gives up after 20 tries and lets the animation finish on its own.

registerSkill({
  types: ['block_lightning_mcqueen_plus_s'],
  beforeActivate: function(ts) {
    ts.sleep(200);  // let tsums settle
  },
  afterActivate: function(ts) {
    ts.sleep(2000);
    for (let i = 1; i <= 20; i += 1) {
      ts.sleep(50);
      const img = ts.playScreenshotSquare();
      try {
        const color = getImageColor(img, 120, 184);
        if (isSameColor({r: 245, g: 0, b: 0}, color, 10)) {
          // max speed detected
          ts.tap({x: 670, y: 1050}, 10);  // tap somewhere into the game
          i = 20;
        }
      } finally {
        releaseImage(img);
      }
    }
    ts.sleep(2500);
    // ts.clearAllBubbles(600, 0, 1000, 300);
  }
});
