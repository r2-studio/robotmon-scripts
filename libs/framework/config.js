function Config() {
  this.debug = true;
  // // resolution
  this.devScreenWidth = 1080;
  this.devScreenHeight = 1920;
  this.screenResizeRatio = 0.5;
  this.userScreenWidth = 0;
  this.userScreenHeight = 0;

  this.pauseSleepTime = 500;
}
Config.prototype.update = function() {
  var wh = getScreenSize();
  this.userScreenWidth = wh.width;
  this.userScreenHeight = wh.height;
}

Config.prototype.get = function(key) {}
Config.prototype.set = function(key, value) {}