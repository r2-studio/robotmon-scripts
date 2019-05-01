function View() {
  /*
    view ID. Used for layout
  */
  this.viewId = 'viewId';

  /*
    parent view ID, empty equal to root
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
 this.alignCenter = true;

  /*
    is align parent top? true or false
    this.alignTop and this.alignBottom can only chose one
  */
  this.alignTop = false;

  /*
    is align parent bottom? true or false
    this.alignTop and this.alignBottom can only chose one
  */
  this.alignBottom = false;

  /*
    is align parent left? true or false
    this.alignLeft and this.alignRight can only chose one
  */
  this.alignLeft = false;

  /*
    is align parent right? true or false
    this.alignLeft and this.alignRight can only chose one
  */
  this.alignRight = false;

  /*
    this view is below of viewId
  */
  this.belowOf = '';

  /*
    this view is above of viewId
  */
  this.aboveOf = '';

  /*
    this view is at left of viewId
  */
  this.leftOf = '';

  /*
    this view is at right of viewId
  */
  this.rightOf = '';

  /* 
    private variables
  */
  this._x;
  this._y;
  this._w;
  this._h;

}

View.prototype._calculateLayout = function() {
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
}