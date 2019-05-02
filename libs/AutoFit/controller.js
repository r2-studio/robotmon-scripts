function Controller() {
  /*
    width of developer screen resolution
  */
  this.developerScreenWidth = 1080;

  /*
    height of developer screen resolution
  */
 this.developerScreenHeight = 1920;

  /*
    minimal screenshot interval, avoid update screen too quickly (default 10 FPS)
  */
  this.screenshotInterval = 100;

  /*
    game orientation, will check screen orientation (w, h)
  */
  this.orientation = Controller.Vertical;

  /*
    shared screenshot image
  */
  this._updateTime = 0;
  this._screenshot = undefined;

  /*
    views
  */
 this._views = {};
}

Controller.Horizontal = 'horizontal';
Controller.Vertical = 'vertical';
Controller.NotCheck = 'notCheck';

Controller.prototype.getScreenshot = function() {
  var now = Date.now();
  if (now - this._updateTime <= this.screenshotInterval) {
    return;
  }
  // check orientation
  var size = getScreenSize();
  while (true) {
    if (this.orientation === Controller.NotCheck ||
      (this.orientation === Controller.Horizontal && size.width > size.height) ||
      (this.orientation === Controller.Vertical && size.height > size.width)) {
      break;
    }
    this.orientationWarnning();
    sleep(1000);
  }
  if (this._screenshot !== undefined) {
    releaseImage(this._screenshot);
  }
  this._updateTime = now;
  this._screenshot = getScreenshot();
  return this._screenshot;
}

Controller.prototype.addView = function(view) {
  if (this._views[view.viewId] !== undefined) {
    console.log('Warning view duplicated', view.viewId);
  }
  view._controller = this;
  view._calculateLayout();
  this._views[view.viewId] = view;
}

Controller.prototype.getView = function(viewId) {
  if (this._views[viewId] === undefined) {
    console.log('Warning view not added', viewId);
    return undefined;
  }
  return this._views[viewId];
}

// developer can overwrite this function
Controller.prototype.orientationWarnning = function() {
  console.log('Warning: phone orientation not corrent');
}