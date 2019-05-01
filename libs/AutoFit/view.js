function View() {
  /*
    view ID. Used for layout
  */
  this.viewId = 'viewId';

  /*
    parent view, empty equal to root
  */
  this.parent = undefined;

  /*
    Static Layout if this.layoutRatio > 0, and ratio = width / height
    Dynamic Layout if this.layoutRatio == 0
  */
  this.layoutRatio = 1080 / 1920;

  /*
    if view is Static Layout, widthRatioOfParent will be "maximum" width ratio of parent width 
    if view is Dynamic Layout, widthRatioOfParent will be exactly width ratio of parent width
    if widthRatioOfParent == 0, the view width will be maximun of parent
  */
  this.widthRatioOfParent = 540 / 1080;

  /*
    if view is Static Layout, heightRatioOfParent will be "maximum" height ratio of parent height 
    if view is Dynamic Layout, heightRatioOfParent will be "exactly" height ratio of parent height
    if heightRatioOfParent == 0, the view height will be maximun of parent
  */
  this.heightRatioOfParent = 960 / 1920;
  
  /*
    is align parent center? true or false
    if all align settings is false, default is align parent center
  */
  this.alignParentCenter = true;

  /*
    is align parent top? true or false
    this.alignTop and this.alignBottom can only chose one
  */
  this.alignParentTop = false;

  /*
    is align parent bottom? true or false
    this.alignTop and this.alignBottom can only chose one
  */
  this.alignParentBottom = false;

  /*
    is align parent left? true or false
    this.alignLeft and this.alignRight can only chose one
  */
  this.alignParentLeft = false;

  /*
    is align parent right? true or false
    this.alignLeft and this.alignRight can only chose one
  */
  this.alignParentRight = false;

  /*
    this view is below of view
  */
  this.belowOf;

  /*
    this view is above of view
  */
  this.aboveOf;

  /*
    this view is at left of view
  */
  this.leftOf;

  /*
    this view is at right of view
  */
  this.rightOf;

  /* 
    private variables
  */
  this._x;
  this._y;
  this._w;
  this._h;
  this._static = true;

}

View.prototype._calculateLayout = function() {
  if (this.layoutRatio === 0) {
    this._static = false;
  } else {
    this._static = true;
  }

  // get parent position
  var px = 0, py = 0, pw = 0, ph = 0;
  if (this.parent == undefined) {
    var wh = getScreenSize();
    pw = wh.width;
    ph = wh.height;
  } else {
    px = this.parent._x;
    py = this.parent._y;
    pw = this.parent._w;
    ph = this.parent._h;
  }
  
  // for calculating width and height
  if (this._static) {
    var shouldWidth = pw * this.widthRatioOfParent;
    var shouldHeight = ph * this.heightRatioOfParent;
    var ratioWidth = shouldHeight * this.layoutRatio;
    var ratioHeight = shouldWidth / this.layoutRatio;
    if (shouldWidth > ratioWidth) {
      // more width, fix
      shouldWidth = ratioWidth;
    } else if (shouldHeight > ratioHeight) {
      // more height, fix
      shouldHeight = ratioHeight;
    }
    this._w = shouldWidth;
    this._h = shouldHeight;
  } else {
    this._w = pw * this.widthRatioOfParent;
    this._h = ph * this.heightRatioOfParent;
  }

  // for calculating x and y
  if (this.alignParentCenter) {
    this._x = px + (pw - this._w) / 2;
    this._y = py + (ph - this._h) / 2;
  }
  if (this.alignParentTop) {
    this._y = py;
  }
  if (this.alignParentBottom) {
    this._y = (py + ph) - this._h;
  }
  if (this.alignParentLeft) {
    this._x = px;
  }
  if (this.alignParentRight) {
    this._x = (px + pw) - this._w;
  }

  if (this.belowOf !== undefined) {
    this._y = (this.belowOf._y + this.belowOf._h);
  }
  if (this.aboveOf !== undefined) {
    this._y = (this.belowOf._y - this._h);
  }
  if (this.leftOf !== undefined) {
    this._x = (this.belowOf._x + this.belowOf._w);
  }
  if (this.rightOf !== undefined) {
    this._x = (this.belowOf._x - this._w);
  }

  // check and warning
  var screenSize = getScreenSize();
  if (this._x < 0) {
    console.log('Warning x < 0');
  }
  if (this._y < 0) {
    console.log('Warning y < 0');
  }
  if (this._x + this._w > screenSize.width) {
    console.log('Warning x + w > screen width', screenSize.width);
  }
  if (this._y + this._h > screenSize.height) {
    console.log('Warning y + h > screen height', screenSize.height);
  }
}