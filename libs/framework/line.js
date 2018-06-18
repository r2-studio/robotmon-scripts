function Line() {
  this.points = [];
  for(var i in arguments) {
    this.points.push(arguments[i]);
  }
  if (this.points.length === 0) {
    this.context.debug("Warning: Line has no points");
  }
}

Line.prototype._check = function() {
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

Line.prototype.swipe = function(during, tapUpDelay) {
  if (!this._check() || this.points.length === 0) {
    return;
  }
  during = during || 500;
  tapUpDelay = tapUpDelay || 500;
  var interval = Math.ceil((during - 20 - 20 * this.points.length - 20) / this.points.length);
  if (interval < 0) {
    interval = 0;
  }
  this.points[0].tapDown();
  for (var i in this.points) {
    var point = this.points[i];
    point.moveTo();
    this.context.sleep(interval);  
  }
  this.context.sleep(tapUpDelay);
  this.points[this.points.length - 1].tapUp();
}