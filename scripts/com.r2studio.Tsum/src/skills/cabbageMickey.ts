// Cabbage Mickey — the skill buries Mickey among cabbages and the player has to
// find and tap him. This is the only skill that has to actually look at the
// board to aim.
//
// The search is a coarse grid over the play area looking for Mickey's face
// color on a blurred screenshot, retried up to five times while the cabbages
// keep shuffling. If he is never found the activation is written off and the
// bubbles are swept instead.

var CabbageMickeyFaceColor = {r: 245, g: 225, b: 210};

registerSkill({
  types: ['block_cabbage_mickey_s'],
  afterActivate: function(ts) {
    // wait for all cabbages being placed
    ts.sleep(3300);
    const startTime = Date.now();
    let foundMickey = false;
    let maybeMickey = null;
    let color = null;
    const maxTries = 5;
    for (let tries = 1; tries <= maxTries && !foundMickey; tries++) {
      ts.sleep(100);
      const img = ts.screenshot();
      try {
        smooth(img, 2, 5);
        for (let y = 720; y < 1380 && !foundMickey; y += 25) {
          for (let x = 120; x < 1000 && !foundMickey; x += 60) {
            maybeMickey = {x: x, y: y};
            color = ts.getColor(img, maybeMickey);
            foundMickey = foundMickey || isSameColor(CabbageMickeyFaceColor, color, 20);
            if (foundMickey) {
              // NOTE: up/down/left/right all alias maybeMickey, and the four
              // offsets below cancel out, so all four reads land back on the
              // center pixel that already matched -- this confirmation step has
              // never actually rejected anything. Kept as-is: the detection has
              // been tuned around it, and separating the four points would
              // change which frames pass.
              let up, down, left, right;
              up = down = left = right = maybeMickey;
              up.y -= 10;
              down.y += 10;
              left.x -= 10;
              right.x += 10;
              foundMickey = (
                      isSameColor(CabbageMickeyFaceColor, ts.getColor(img, up), 20)
                      || isSameColor(CabbageMickeyFaceColor, ts.getColor(img, down), 20))
                  && (
                      isSameColor(CabbageMickeyFaceColor, ts.getColor(img, left), 20)
                      || isSameColor(CabbageMickeyFaceColor, ts.getColor(img, right), 20));
            }
            if (ts.debug) {
              // logical width is 1080, screenshot usually 360, so reduce xy by factor 3
              drawCircle(img, x / 3, y / 3, 4, foundMickey ? 0 : 255, foundMickey ? 255 : 0, 0, 0);
            }
          }
        }
        if (!foundMickey) {
          debug("*** Didn't find Mickey! ***", function () {
            if (ts.debug) {
              saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey_not_found-" + ts.runTimes + "-" + tries + ".jpg");
              return "Saved screenshot";
            } else {
              return "";
            }
          });
        } else {
          if (ts.debug) {
            saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey-" + ts.runTimes + "-" + tries + ".jpg");
          }
        }
      } finally {
        releaseImage(img);
      }
    }
    if (foundMickey && maybeMickey != null) {
      debug("Found mickey at position", maybeMickey, "with color", color, "in", Date.now() - startTime, "ms.");
      const tapXY = {x: maybeMickey.x + 15, y: maybeMickey.y + 15};
      for (let i = 0; i < 10; i++)
        ts.tap(tapXY);
      ts.sleep(1000);
    } else {
      ts.clearAllBubbles();
    }
  }
});
