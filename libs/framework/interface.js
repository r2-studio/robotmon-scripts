function Utils() {}
function Color() {}

function Params() {}
Params.prototype.update = function() {}

function Point() {}
Point.prototype.tap = function() {}
Point.prototype.tapDown = function() {}
Point.prototype.tapUp = function() {}
Point.prototype.moveTo = function() {}
Point.prototype.check = function() {}

function Line() {}
Line.prototype.swipe = function() {}

function Rect() {}
Rect.prototype.crop = function() {}

function Feature() {}
Feature.prototype.check = function() {}
Feature.prototype.tap = function() {}

function Enum() {};
Enum.TypePage = 0;
Enum.TypeTask = 1;

function Page(name) {
  this._isInit = false;
  this._tasks = {};
  this._wantExit = false;

  this.context = undefined;
  this.name = name;
  this.type = Enum.TypePage;
  this.onPage = function() {};
  this.onInit = function() {};
  this.onEnter = function() {};
  this.onExit = function() {};
  this.onScreenshot = function() {};
}

function Task(name) {
  this._isInit = false;
  this._doNextTask = false;
  this._doAgainTask = false;
  this._delayUntil = 0;

  this.context = undefined;
  this.name = name;
  this.type = Enum.TypeTask;
  this.onTask = function() {};
  this.onInit = function() {};
  this.onEnter = function() {};
  this.onExit = function() {};
  this.onRun = function() {};
}