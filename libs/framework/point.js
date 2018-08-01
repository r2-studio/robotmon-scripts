function Point(devX, devY, r, g, b, need, diff) {
  this.context = undefined;
  this.x = devX;
  this.y = devY;
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
  this.need = need || false;
  this.d = diff || 0.9;
}

Point.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Point is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Point.prototype.tap = function(times, delay) {
  if (!this._check()) {
    return;
  }
  times = times || 1;
  delay = delay || 0;
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  while(times > 0) {
    if (delay > 0) {
      sleep(delay);
    }
    tap(xy.x, xy.y, 20);
    times--;
  }
}

Point.prototype.tapDown = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  tapDown(xy.x, xy.y, 20);
}

Point.prototype.tapUp = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  tapUp(xy.x, xy.y, 20);
}

Point.prototype.moveTo = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  moveTo(xy.x, xy.y, 20);
}

Point.prototype.getColor = function() {
  if (!this._check()) {
    return false;
  }
  var xy = this.context.currentPage.onDevToResizeXY(this.x, this.y);
  var img = this.context.getScreenshot(false);
  if (this.context.config.debug) {
    var imgSize = getImageSize(img);
    if (xy.x < 0 || xy.x > imgSize.width || xy.y < 0 || xy.y > imgSize.height) {
      this.context.debug("Error: Point checkColor exceed image size");
      sleep(1000);
      return false;
    }
  }
  return getImageColor(img, xy.x, xy.y);
}

Point.prototype.checkColor = function() {
  var c = this.getColor();
  var score = Colors.identityScore(c, this);
  this.context.debug(c, score, this.r);
  if (this.need && score <= this.d) {
    this.context.debug("Is Not Same Color, but need");
    return false;
  } else if (!this.need && score >= this.d) {
    this.context.debug("Is Same Color, but not need");
    return false;
  }
  return true;
}