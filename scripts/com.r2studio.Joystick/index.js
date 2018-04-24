stopListenEvent();
var TYPE_BTN = 1;
var TYPE_ANALOG = 2;

var touchId = 0;
function genTouchId() {
  return touchId++;
}

function BtnAnalogController(config) {
  this.tid = genTouchId();
  this.cx = config.center.x;
  this.cy = config.center.y;
  this.r = config.radius;
  this.keyMiddle = config.keyMiddle;
  this.keyMax = config.keyMax;
  this.keyMin = config.keyMin;
  this.key = config.key; // button key
  this.xKey = config.xKey;
  this.yKey = config.yKey;
  this.state = 0; // 0 = up, 1 = down
  this.x = this.cx;
  this.y = this.cy;
}

BtnAnalogController.prototype.convertValue = function(v) {
  var p = (v - this.keyMiddle) / (this.keyMax - this.keyMin + 1) * 2;
  return p * (this.r);
}

BtnAnalogController.prototype.handleEvent = function(mode, code, value) {
  if (code === this.key) {
    if (value === 1) {
      this.state = 1; // down
      tapDown(this.cx, this.cy, 5, this.tid);
      moveTo(this.cx, this.cy, 1, this.tid);
    } else {
      this.state = 0; // up
      moveTo(this.cx, this.cy, 1, this.tid);
      tapUp(this.cx, this.cy, 5, this.tid);
    }
    return true;
  } else if (code === this.xKey && this.state === 1) {
    this.x = this.cx + Math.round(this.convertValue(value));
    moveTo(this.x, this.y, 1, this.tid);
    return true;
  } else if (code === this.yKey && this.state === 1) {
    this.y = this.cy + Math.round(this.convertValue(value));
    moveTo(this.x, this.y, 1, this.tid);
    return true;
  }
  return false;
}

function AnalogController(config) {
  this.tid = genTouchId();
  this.cx = config.center.x;
  this.cy = config.center.y;
  this.r = config.radius;
  this.keyMiddle = config.keyMiddle;
  this.keyMax = config.keyMax;
  this.keyMin = config.keyMin;
  this.xKey = config.xKey;
  this.yKey = config.yKey;
  this.state = 0; // 0 = up, 1 = down
  this.x = this.cx;
  this.y = this.cy;
}

AnalogController.prototype.convertValue = function(v) {
  var p = (v - this.keyMiddle) / (this.keyMax - this.keyMin + 1) * 2;
  return p * (this.r);
}

AnalogController.prototype.handleEvent = function(mode, code, value) {
  if (code !== this.xKey && code !== this.yKey) {
    return false;
  }

  if (code === this.xKey) {
    this.x = this.cx + Math.round(this.convertValue(value));
  } else if (code === this.yKey) {
    this.y = this.cy + Math.round(this.convertValue(value));
  }
  if (this.state === 0) {
    tapDown(this.cx, this.cy, 5, this.tid);
    moveTo(this.cx, this.cy, 1, this.tid);
    moveTo(this.x, this.y, 1, this.tid);
    this.state = 1;
  } else if (Math.abs(this.x - this.cx) < 3 && Math.abs(this.y - this.cy) < 3) {
    moveTo(this.cx, this.cy, 1, this.tid);
    tapUp(this.cx, this.cy, 5, this.tid);
    this.state = 0;
  } else {
    moveTo(this.x, this.y, 1, this.tid);
  }
  return true;
}

function ButtonController(config) {
  this.tid = genTouchId();
  this.key = config.key;
  this.x = config.x;
  this.y = config.y;
}

ButtonController.prototype.handleEvent = function(mode, code, value) {
  if (this.key === code) {
    if (value === 1) { // down
      tapDown(this.x, this.y, 1, this.tid);
    } else {
      tapUp(this.x, this.y, 1, this.tid);
    }
  }
}

function DoubleButtonController() {
  this.tid = genTouchId();
  this.selectKey = config.selectKey;
  this.key = config.key;
  this.x = config.x;
  this.y = config.x;
  this.isSelected = false;
};

DoubleButtonController.prototype.handleEvent = function(mode, code, value) {
  if (this.selectKey === code) {
    if (value === 1) { // down
      this.isSelected = true;
    } else {
      this.isSelected = false;
    }
  } else if (this.key === code && this.isSelected) {
    if (value === 1) {
      tapDown(this.x, this.y, 1, this.tid);
    } else {
      tapUp(this.x, this.y, 1, this.tid);
    }
  }
}

var moveMappingConfig = {
  xKey: 0,
  yKey: 1,
  keyMiddle: 128,
  keyMax: 255,
  keyMin: 0,
  center: {x: 230, y: 900},
  radius: 100,
};

// right panel 3
var attackBtnConfig = { key: 290, x: 300, y: 300 };
// right panel 4
var skill13Config = { key: 291, x: 300, y: 300 };
// right panel 1
var skill2BtnConfig = { key: 288, x: 300, y: 300 };
// right panel 2
var skill1BtnConfig = { key: 289, x: 300, y: 300 };

var moveController = new AnalogController(moveMappingConfig);
var attackEvent = new ButtonController(attackBtnConfig);

// var keyMappings = {
//   'ABS_X': moveController,
//   'ABS_Y': moveController,
// };

stopListenEvent();
function eventCB(type, name, value) {
  console.log('result', type, name, value, Date.now());
  // console.log('result', type, name, value, intValue);
  moveController.handleEvent(type, name, value);
  attackEvent.handleEvent(type, name, value);
}

// loop until call stopListenEvent
startListenEvent('/dev/input/event6', 'eventCB');