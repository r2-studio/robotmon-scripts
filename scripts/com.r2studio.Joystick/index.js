console.log('STOP');
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
      tapDown(this.cx, this.cy, 1, this.tid);
      // moveTo(this.cx, this.cy, 1, this.tid);
    } else {
      this.state = 0; // up
      // moveTo(this.cx, this.cy, 1, this.tid);
      tapUp(this.cx, this.cy, 1, this.tid);
    }
  } else if (code === this.xKey && this.state === 1) {
    this.x = this.cx + Math.round(this.convertValue(value));
    moveTo(this.x, this.y, 0, this.tid);
    return true;
  } else if (code === this.yKey && this.state === 1) {
    this.y = this.cy + Math.round(this.convertValue(value));
    moveTo(this.x, this.y, 0, this.tid);
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
    return true;
  }
  return false;
}

function DoubleButtonController(config) {
  this.tid = genTouchId();
  this.selectKey = config.selectKey;
  this.key = config.key;
  this.x = config.x;
  this.y = config.y;
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
    return true;
  }
  return false;
}

/*
movePanel x: 230, y: 900
attack x: 1750, y: 930
skill1 x: 1420, y: 980 add x: 1324, y: 860
skill2 x: 1555, y: 755 add x: 1450, y: 633
skill3 x: 1750, y: 640 add x: 1651, y: 530
buyItem1 x: 198, y: 413
buyItem2 x: 211, y: 536

rp1 288
rp2 289
rp3 290
rp4 291
lpx 0
lpy 1
rpx 3
rpy 5
fr1 293
fr2 295
fl1 292
fl2 294
*/

var moveMappingConfig = {
  xKey: 0, yKey: 1,
  keyMiddle: 128, keyMax: 255, keyMin: 0,
  center: {x: 230, y: 900}, radius: 100,
};
var attack = { key: 289, x: 1750, y: 930 }; // attack
var addSkill1 = { selectKey: 294, key: 288, x: 1324, y: 860 }; 
var addSkill2 = { selectKey: 294, key: 291, x: 1450, y: 633 };
var addSkill3 = { selectKey: 294, key: 290, x: 1651, y: 530 };
var skill1 = {
  key: 288, xKey: 3, yKey: 5,
  keyMiddle: 128, keyMax: 255, keyMin: 0,
  center: {x: 1420, y: 980}, radius: 100,
};
var skill2 = {
  key: 291, xKey: 3, yKey: 5,
  keyMiddle: 128, keyMax: 255, keyMin: 0,
  center: {x: 1555, y: 755}, radius: 100,
};
var skill3 = {
  key: 290, xKey: 3, yKey: 5,
  keyMiddle: 128, keyMax: 255, keyMin: 0,
  center: {x: 1750, y: 640}, radius: 100,
};
var buyItem1 = {key: 293, x: 198, y: 413};
var buyItem2 = {key: 295, x: 211, y: 536};
var recover = {key: 292, x: 1260, y: 980};

var keyMappings = {
  cMove: new AnalogController(moveMappingConfig),
  cAttack: new ButtonController(attack),
  cAddSkill1: new DoubleButtonController(addSkill1),
  cAddSkill2: new DoubleButtonController(addSkill2),
  cAddSkill3: new DoubleButtonController(addSkill3),
  cSkill1: new BtnAnalogController(skill1),
  cSkill2: new BtnAnalogController(skill2),
  cSkill3: new BtnAnalogController(skill3),
  cBuyItem1: new ButtonController(buyItem1),
  cBuyItem2: new ButtonController(buyItem2),
};


function eventCB(type, name, value) {
  console.log('result', type, name, value, Date.now());
  for (var k in keyMappings) {
    var used = keyMappings[k].handleEvent(type, name, value);
    if (used) {
      return;
    }
  }
}
console.log('START');
// loop until call stopListenEvent
startListenEvent('/dev/input/event5', 'eventCB');