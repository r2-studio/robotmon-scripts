function Page(name) {
  this._isInit = false;
  this._tasks = {};
  this._wantExit = false;

  this.context = undefined;
  this.bundle = {};
  this.name = name;
  this.type = Enum.TypePage;
  this.onPage = function() {};
  this.onInit = function() {};
  this.onEnter = function() {};
  this.onExit = function() {};
  this.onScreenshot = function() {};
  this.onDevToUserXY = function(devX, devY) {}
  this.onDevToResizeXY = function(devX, devY) {}
}