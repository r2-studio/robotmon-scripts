function Point(devX, devY, r, g, b, need, diff) {
  this.context = undefined;
  this.x = devX;
  this.y = devY;
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
  this.need = need || false;
  this.diff = diff || 25;
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

Point.prototype.checkColor = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToResizeXY(this.x, this.y);
  var img = this.context.getScreenshot(false);
  if (this.context.config.debug) {
    var imgSize = getImageSize();
    if (xy.x < 0 || xy.x > imgSize.width || xy.y < 0 || xy.y > imgSize.height) {
      this.context.debug("Error: Point checkColor exceed image size");
      sleep(1000);
      return false;
    }
  }
  const c = getImageColor(img, xy.x, xy.y);
  if (this.need && !Colors.isSameColor(c, this, this.d)) {
    return false;
  } else if (!this.need && Colors.isSameColor(c, this)) {
    return false;
  }
  return true;
}