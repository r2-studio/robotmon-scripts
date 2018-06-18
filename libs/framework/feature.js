// many points
function Feature() {
  this.points = [];
  for(var i in arguments) {
    this.points.push(arguments[i]);
  }
  if (this.points.length === 0) {
    this.context.debug("Warning: Feature has no points");
  }
}

Feature.prototype._check = function() {
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

Feature.prototype.checkColor = function() {
  if (!this._check()) {
    return false;
  }
  for (var i in this.points) {
    var point = this.points[i];
    var isColor = point.checkColor();
    if (!isColor) {
      return false;
    }
  }
  return true;
}

Feature.prototype.tap = function(idx) {
  if (!this._check()) {
    return;
  }
  if (this.points.length > idx) {
    this.points[idx].tap();
  }
}