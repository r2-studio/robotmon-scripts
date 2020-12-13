/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 660:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var unit = __webpack_require__(778);

function FishManager() {
  this.init();
}
FishManager.prototype.init = function () {
  console.log("FishManager Init");
}

FishManager.prototype.fish = function () {
  var img = getScreenshot();
  var c = getImageColor(img, 548, 240);
  releaseImage(img);
  var start = false;
  if (
    c.r > 125 &&
    c.r < 200 &&
    c.g > 140 &&
    c.g < 210 &&
    c.b > 140 &&
    c.b < 210
  ) {
    tap(548, 240, 50);
    tap(548, 240, 50);
    start = true;
  }
  if (!start) {
    console.log('can not finish', c.r, c.g, c.b);
    return false;
  }
  sleep(2000);
  for (var i = 0; i < 60; i++) {
    var img = getScreenshot();
    var c = getImageColor(img, 548, 240);
    releaseImage(img);
    var done = false;
    if (
      c.r > 140 &&
      c.r < 180 &&
      c.g > 180 &&
      c.g < 220 &&
      c.b > 110 &&
      c.b < 140
    ) {
      tap(548, 240, 100);
      done = true;
      console.log('done');
    }
    sleep(200);
    if (done) {
      break;
    }
  }
  return true;
}

FishManager.prototype.checkArrive = function () {
  var img = getScreenshot();
  var c1 = getImageColor(img, 399, 146);
  var c2 = getImageColor(img, 400, 131);
  releaseImage(img);
  var isArrive = false;
  if (unit.sameColor(c1, [237, 227, 193]) && unit.sameColor(c2, [171, 157, 95])) {
    return true;
  }
  return false;
}
FishManager.prototype.moveToFish = function () {
  tap(600, 63, 50);
  sleep(3000);
  tap(295, 142, 50);
  sleep(3000);
  tap(321, 165, 50);
  sleep(3000);
  tap(625, 46, 50);
  sleep(3000);
}

FishManager.prototype.autoFish = function () {
  for (var i = 0; i < 500; i++) {
    console.log('start finishing...');
    var moveing = false;
    var isFish = this.fish();
    if (!isFish && moveing == false) {
      moveing = true;
      this.moveToFish();
    }
    if (this.checkArrive() && moveing == true)
      tap(399, 146, 50);

    console.log('isFish : ', isFish);
    sleep(3000);
    console.log('finish done', i + 1);
  }
}

//var f = new FishManager();
//f.moveToFish();
module.exports = FishManager;

/***/ }),

/***/ 507:
/***/ (function(module) {


function TaskManager() {
  this.init();
}
TaskManager.prototype.init = function () {
  console.log("TaskManager Init");
}

TaskManager.prototype.autoTask = function () {
  console.log("autoTask");
}

TaskManager.prototype.moveToTask = function () {
  console.log("moveToTask");
  tap(518, 24, 50);
  sleep(3000);
  tap(444, 25, 50);
  sleep(3000);
  tap(322, 228, 50);
  sleep(3000);
  tap(322, 293, 50);
  sleep(3000);
}

TaskManager.prototype.acceptTask = function () {
  console.log("acceptTask");
  var diff = 120;
  for (var i = 0; i < 5; ++i) {
    tap(116 + (diff * i), 116, 50);
    sleep(3000);
    tap(328, 283, 50);
    sleep(3000);
    tap(96  + (diff * i), 231, 50);
    sleep(3000);
    tap(328, 283, 50);
    sleep(3000);
  }
}

TaskManager.prototype.doTask = function () {
  console.log("doTask");
}

//var t = new TaskManager();
//t.moveToTask();
module.exports = TaskManager;

/***/ }),

/***/ 778:
/***/ (function(module) {


function sameColor(color, target, range) {
  if (range == undefined) {
    range = 20;
  }
  if (
    color.r > target[0] - range &&
    color.r < target[0] + range &&
    color.g > target[1] - range &&
    color.g < target[1] + range &&
    color.b > target[2] - range &&
    color.b < target[2] + range
  ) {
    return true;
  }
  return false;
}

function isSameColor(c1, c2, diff) {
  if (diff == undefined) {
    diff = 20;
  }
  if (Math.abs(c1.r - c2.r) > diff) {
    return false;
  }
  if (Math.abs(c1.g - c2.g) > diff) {
    return false;
  }
  if (Math.abs(c1.b - c2.b) > diff) {
    return false;
  }
  if (Math.abs(c1.a - c2.a) > diff) {
    return false;
  }
  return true;
}

module.exports.sameColor = sameColor;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
!function() {
var FishManager = __webpack_require__(660);
var TaskManager = __webpack_require__(507);

function main() {
  var fishManager = new FishManager();
  var taskManager = new TaskManager();
  //fishManager.autoFish();
  taskManager.acceptTask();
}
main()
console.log("Done!");
}();
/******/ })()
;