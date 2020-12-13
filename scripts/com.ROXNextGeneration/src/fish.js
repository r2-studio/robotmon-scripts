const unit = require('./unit.js');

function FishManager()
{
  this.init();
}

FishManager.prototype.init = function() {
  console.log("finsManager init");
}

FishManager.prototype.fish =  function() {
  var img = getScreenshot();
  var c = getImageColor(img, 548, 240);
  releaseImage(img);
  var start = false;
  if (
    c.r > 125 &&
    c.r < 200 &&
    c.g > 140 &&
    c.g < 210 &&
    c.b > 140 &&
    c.b < 210
  ) {
    tap(548, 240, 50);
    tap(548, 240, 50);
    start = true;
  }
  if (!start) {
    console.log('can not finish', c.r, c.g, c.b);
    return false;
  }
  sleep(2000);
  for (var i = 0; i < 60; i++) {
    var img = getScreenshot();
    var c = getImageColor(img, 548, 240);
    releaseImage(img);
    var done = false;
    if (
      c.r > 140 &&
      c.r < 180 &&
      c.g > 180 &&
      c.g < 220 &&
      c.b > 110 &&
      c.b < 140
    ) {
      tap(548, 240, 100);
      done = true;
      console.log('done');
    }
    sleep(200);
    if (done) {
      break;
    }
  }
  return true;
}

FishManager.prototype.checkArrive = function() {
  var img = getScreenshot();
  var c1 = getImageColor(img, 399, 146);
  var c2 = getImageColor(img, 400, 131);
  releaseImage(img);
  var isArrive = false;
  if (unit.sameColor(c1, [237, 227, 193]) && unit.sameColor(c2, [171, 157, 95])) {
    return true;
  }
  return false;
}
FishManager.prototype.moveToFish = function() {
  tap(600, 63, 50);
  sleep(3000);
  tap(295, 142, 50);
  sleep(3000);
  tap(321, 165, 50);
  sleep(3000);
  tap(625, 46, 50);
  sleep(3000);
}

FishManager.prototype.autoFish = function() {
  for (var i = 0; i < 500; i++) {
    console.log('start finishing...');
    var moveing = false;
    var isFish = fish();
    if (!isFish && moveing == false) {
      moveing = true;
      moveToFish();
    }
    if (checkArrive() && moveing == true)
      tap(399, 146, 50);
  
    console.log('isFish : ', isFish);
    sleep(3000);
    console.log('finish done', i + 1);
  }
}
module.exports.fish = FishManager;