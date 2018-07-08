function Config() {
  this.debug = true;
  // // resolution

  this.pauseSleepTime = 500;
}

Config.prototype.update = function() {
  var wh = getScreenSize();
  this.userScreenWidth = wh.width;
  this.userScreenHeight = wh.height;
}

Config.prototype.get = function(key) {
  if (this[key] !== undefined) {
    return this[key];
  }
  return undefined;
}

Config.prototype.set = function(key, value) {
  this[key] = value;
}