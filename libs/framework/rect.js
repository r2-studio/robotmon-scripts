function Rect(devX1, devY1, devX2, devY2) {
  this.x1 = devX1;
  this.y1 = devY1;
  this.x2 = devX2;
  this.y2 = devY2;
}

Rect.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Rect is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Rect.prototype.crop = function() {
  if (!this._check()) {
    return 0;
  }
  var xy1 = this.context.currentPage.onDevToResizeXY(this.x1, this.y1);
  var xy2 = this.context.currentPage.onDevToResizeXY(this.x2, this.y2);
  var img = this.context.getScreenshot(false);
  if (this.context.config.debug) {
    var imgSize = getImageSize(img);
    if (xy2.x < 0 || xy2.x > imgSize.width || xy2.y < 0 || xy2.y > imgSize.height) {
      this.context.debug("Error: Point checkColor exceed image size");
      sleep(1000);
      return 0;
    }
  }
  return cropImage(img, xy1.x, xy1.y, xy2.x - xy1.x, xy2.y - xy1.y);
}