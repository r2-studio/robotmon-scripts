// Robotmon Framework


function Colors() {}

Colors.isSameColor = function (c1, c2, d) {
  d = d || 25;
  if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
    return true;
  }
  return false;
}

Colors.mergeColor = function (c1, c2) {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2),
  };
}

Colors.diffColor = function (c, c1) {
  return Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
}

Colors.distanceColor = function (c, c1) {
  return Math.sqrt((c1.r - c.r)*(c1.r - c.r) + (c1.g - c.g)*(c1.g - c.g) + (c1.b - c.b)*(c1.b - c.b));
}

Colors.identityScore = function(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512+mean)*r*r)>>8) + 4*g*g + (((767-mean)*b*b)>>8)) / 768;
}

Colors.minMaxDiff = function (c) {
  var max = Math.max(Math.max(c.r, c.g), c.b);
  var min = Math.min(Math.min(c.r, c.g), c.b);
  return max - min;
}


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

function Context() {
  this.isStart = false;
  this.isPause = false;
  this.params = new Params();
  this.config = new Config();
  this.pages = {};
  this.currentPage = undefined;
  this.currentTask = undefined;
  this.screenshot = 0;
}

Context.prototype.getPageBundle = function() {
  if (this.currentPage !== undefined && this.currentPage.bundle === undefined) {
    this.currentPage.bundle = {};
  }
  return this.currentPage.bundle;
}

Context.prototype.getTaskBundle = function() {
  if (this.currentTask !== undefined && this.currentTask.bundle === undefined) {
    console.log('dsflsdjflksjdf')
    this.currentTask.bundle = {};
  }
  return this.currentTask.bundle;
}

Context.prototype.getParams = function(key) {
  if (this.params[key] !== undefined) {
    return this.params[key];
  } else {
    this.debug("Params not exist, key: " + key);
  }
}

Context.prototype.getConfig = function() {
  return this.config;
}

Context.prototype.delayTask = function(pageName, taskName, time) {
  if (this.pages[pageName] !== undefined && this.pages[pageName]._tasks[taskName] !== undefined) {
    this.pages[pageName]._tasks[taskName]._delayUntil = Date.now() + time;
  } else {
    this.debug("Task not exist", pageName, taskName);
  }
}

Context.prototype.delay = function(time) {
  if (this.currentTask !== undefined) {
    this.currentTask._delayUntil = Date.now() + time;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.doNextTask = function() {
  if (this.currentTask !== undefined) {
    this.currentTask._doNextTask = true;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.doAgainTask = function() {
  if (this.currentTask !== undefined) {
    this.currentTask._doAgainTask = true;
  } else {
    this.debug("Task not exist");
  }
}

Context.prototype.exitPage = function() {
  if (this.currentPage !== undefined) {
    this.currentPage._wantExit = true;
  } else {
    this.debug("Page not exist");
  }
}

Context.prototype.waitForChange = function(score, max) {
  if (this.currentPage === undefined) {
    return;
  }
  var t = Date.now();
  var originImg = this.currentPage.onScreenshot();
  while(true) {
    this.sleep(300);
    var img = this.currentPage.onScreenshot();
    var s = getIdentityScore(originImg, img);
    releaseImage(img);
    if (s < score) {
      break;
    }
    if (Date.now() - t > max) {
      break;
    }
  }
  releaseImage(originImg);
}

Context.prototype.getScreenshot = function(update) {
  if (this.screenshot !== 0 && update) {
    releaseImage(this.screenshot);
    this.screenshot = 0;
  }
  if (this.currentPage !== undefined && this.screenshot === 0) {
    this.screenshot = this.currentPage.onScreenshot();
  }
  return this.screenshot;
}

Context.prototype.sleep = function(time) {
  while(time > 0) {
    if (time <= 100) {
      sleep(time);
      break;
    }
    sleep(100);
    time -= 100;
  }
}

Context.prototype.debug = function() {
  if (this.config.debug) {
    this.log.apply(this, arguments);
  }
}

Context.prototype.log = function() {
  var newArgs = [];
  for (var i in arguments) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      newArgs.push(JSON.stringify(arg));
    } else {
      newArgs.push(arg);
    }
  }
  console.log.apply(null, newArgs);
}

// many points
function Feature(name, points) {
  this.name = name;
  this.points = points;
  if (this.points.length === 0) {
    this.context.debug("Warning: Feature has no points");
  }
}

Feature.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Rect is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Feature.prototype.checkColor = function() {
  if (!this._check()) {
    return false;
  }
  for (var i in this.points) {
    var point = this.points[i];
    var isColor = point.checkColor();
    if (!isColor) {
      return false;
    }
  }
  return true;
}

Feature.prototype.tap = function(idx) {
  if (!this._check()) {
    return;
  }
  if (this.points.length > idx) {
    this.points[idx].tap();
  }
}

function Enum() {};
Enum.TypePage = 0;
Enum.TypeTask = 1;

function Line() {
  this.points = [];
  for(var i in arguments) {
    this.points.push(arguments[i]);
  }
  if (this.points.length === 0) {
    this.context.debug("Warning: Line has no points");
  }
}

Line.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Rect is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Line.prototype.swipe = function(during, tapUpDelay) {
  if (!this._check() || this.points.length === 0) {
    return;
  }
  during = during || 500;
  tapUpDelay = tapUpDelay || 500;
  var interval = Math.ceil((during - 20 - 20 * this.points.length - 20) / this.points.length);
  if (interval < 0) {
    interval = 0;
  }
  this.points[0].tapDown();
  for (var i in this.points) {
    var point = this.points[i];
    point.moveTo();
    this.context.sleep(interval);  
  }
  this.context.sleep(tapUpDelay);
  this.points[this.points.length - 1].tapUp();
}

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


function Params() {

}

Params.prototype.update = function(jsonString) {
  var obj = {};
  try{
    obj = JSON.parse(jsonString);
  } catch(err) {
    console.log("Error", err);
  }
  for (var key in obj) {
    this[key] = obj[key];
  }
}

function Point(devX, devY, r, g, b, need, diff) {
  this.context = undefined;
  this.x = devX;
  this.y = devY;
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
  this.need = need || false;
  this.d = diff || 0.9;
}

Point.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Point is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Point.prototype.tap = function(times, delay) {
  if (!this._check()) {
    return;
  }
  times = times || 1;
  delay = delay || 0;
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  while(times > 0) {
    if (delay > 0) {
      sleep(delay);
    }
    tap(xy.x, xy.y, 20);
    times--;
  }
}

Point.prototype.tapDown = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  tapDown(xy.x, xy.y, 20);
}

Point.prototype.tapUp = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  tapUp(xy.x, xy.y, 20);
}

Point.prototype.moveTo = function() {
  if (!this._check()) {
    return;
  }
  var xy = this.context.currentPage.onDevToUserXY(this.x, this.y);
  moveTo(xy.x, xy.y, 20);
}

Point.prototype.getColor = function() {
  if (!this._check()) {
    return false;
  }
  var xy = this.context.currentPage.onDevToResizeXY(this.x, this.y);
  var img = this.context.getScreenshot(false);
  if (this.context.config.debug) {
    var imgSize = getImageSize(img);
    if (xy.x < 0 || xy.x > imgSize.width || xy.y < 0 || xy.y > imgSize.height) {
      this.context.debug("Error: Point checkColor exceed image size");
      sleep(1000);
      return false;
    }
  }
  return getImageColor(img, xy.x, xy.y);
}

Point.prototype.checkColor = function() {
  var c = this.getColor();
  var score = Colors.identityScore(c, this);
  this.context.debug(c, score, this.r);
  if (this.need && score <= this.d) {
    this.context.debug("Is Not Same Color, but need");
    return false;
  } else if (!this.need && score >= this.d) {
    this.context.debug("Is Same Color, but not need");
    return false;
  }
  return true;
}

function Rect(devX1, devY1, devX2, devY2) {
  this.x1 = devX1;
  this.y1 = devY1;
  this.x2 = devX2;
  this.y2 = devY2;
}

Rect.prototype._check = function() {
  if (this.context === undefined) {
    console.log("Error, Rect is not regist");
    return false;
  }
  if (this.context.currentPage === undefined) {
    this.context.debug("Error, current Page Unknown");
    return false;
  }
  return true;
}

Rect.prototype.crop = function() {
  if (!this._check()) {
    return 0;
  }
  var xy1 = this.context.currentPage.onDevToResizeXY(this.x1, this.y1);
  var xy2 = this.context.currentPage.onDevToResizeXY(this.x2, this.y2);
  var img = this.context.getScreenshot(false);
  if (this.context.config.debug) {
    var imgSize = getImageSize(img);
    if (xy2.x < 0 || xy2.x > imgSize.width || xy2.y < 0 || xy2.y > imgSize.height) {
      this.context.debug("Error: Point checkColor exceed image size");
      sleep(1000);
      return 0;
    }
  }
  return cropImage(img, xy1.x, xy1.y, xy2.x - xy1.x, xy2.y - xy1.y);
}

var global = this;

function Robotmon() {
  this.onInit = function() {};
  this.context = new Context();
  this._screenshot = 0;
}

Robotmon.prototype.registObject = function(obj) {
  obj.context = this.context;
  return obj;
}

Robotmon.prototype.registAll = function(obj) {
  for (var name in global) {
    var obj = global[name];
    if (typeof obj !== 'object' ) {
      continue;
    }
    if (obj instanceof Page) {
      this.addPage(obj);
    } else if (obj instanceof Feature || obj instanceof Line || obj instanceof Point || obj instanceof Rect) {
      this.registObject(obj);
    }
  }
  for (var name in global) {
    var obj = global[name];
    if (typeof obj === 'object' && obj instanceof Task) {
      this.addTask(obj.page, obj);
    }
  }
  this.context.debug('register All done');
}

Robotmon.prototype.addPage = function(page) {
  if (page.name === undefined || page.name === "") {
    this.context.debug('Page.name is not set');
    return;
  }
  page.context = this.context;
  this.context.pages[page.name] = page;
}

Robotmon.prototype.addTask = function(page, task) {
  if (task.name === undefined || task.name === "") {
    this.context.debug('Task.name is not set');
    return;
  }
  var pageName = "";
  if (typeof page === 'string') {
    pageName = page;
  } else if (typeof page === 'object'){
    pageName = page.name;
  }
  if (this.context.pages[pageName] === undefined) {
    this.context.debug('Task do not have Page parent, should regist Page first');
    return;
  }
  task.context = this.context;
  this.context.pages[pageName]._tasks[task.name] = task;
}

Robotmon.prototype.init = function() {
  var pageCount = 0;
  var taskCount = 0;
  for(var pageName in this.context.pages) {
    var page = this.context.pages[pageName];
    if (!page._isInit) {
      this.context.debug('Init page: ' + page.name);
      page.onInit();
    }
    pageCount++;
    for (var taskName in page._tasks) {
      var task = page._tasks[taskName];
      if (!task._isInit) {
        this.context.debug('Init task: ' + task.name);
        task.onInit();
      }
      taskCount++;
    }
  }
  if (pageCount === 0 || taskCount === 0) {
    this.context.debug('Error page count: ' + pageCount + ' task count: ' + taskCount);
    return false;
  }
  this.onInit();
  return true;
}

Robotmon.prototype._changePage = function(page) {
  var name = "";
  if (page !== undefined) {
    name = page.name;
  }
  if (this.context.currentPage === undefined) {
    this.context.currentPage = page;
    if (this.context.currentPage !== undefined) {
      this.context.currentPage.onEnter();
    }
  } else if (this.context.currentPage !== undefined && this.context.currentPage.name !== name) {
    this.context.currentPage.onExit();
    this.context.currentPage = page;
    this.context.currentPage.onEnter();
  }
}

Robotmon.prototype._changeTask = function(task) {
  var name = "";
  if (task !== undefined) {
    name = task.name;
  }
  if (this.context.currentTask === undefined) {
    this.context.currentTask = task;
    if (this.context.currentTask !== undefined) {
      this.context.currentTask.onEnter();
    }
  } else if (this.context.currentTask !== undefined && this.context.currentTask.name !== name) {
    this.context.currentTask.onExit();
    this.context.currentTask = task;
    this.context.currentTask.onEnter();
  }
}

Robotmon.prototype._runPage = function() {
  while (this.context.isStart) {
    while (this.context.isPause) {
      this.context.sleep(this.context.config.pauseSleepTime);
      continue;
    }
    for(var pageName in this.context.pages) {
      var page = this.context.pages[pageName];
      var tmpPage = this.context.currentPage;
      this.context.currentPage = page;
      var tmpImg = page.onScreenshot();
      var isPage = page.onPage();
      releaseImage(tmpImg);
      this.context.currentPage = tmpPage;
      if (isPage) {
        this._changePage(page);
        page._wantExit = false;
        this._runTask();
        break;
      }
    }
  }
  this._changePage(undefined);
}

Robotmon.prototype._runTask = function() {
  var page = this.context.currentPage;
  // implement Context.exitPage
  while (this.context.isStart && !page._wantExit) {
    while (this.context.isPause) {
      this.context.sleep(this.context.config.pauseSleepTime);
      continue;
    }
    var screenshot = this.context.getScreenshot(true);
    var isInPage = page.onPage(screenshot);
    if (!isInPage) {
      break;
    }
    var hasTask = false;
    // implement Context.doAgainTask 2
    if (this.context.currentTask !== undefined && this.context.currentTask._doAgainTask) {
      this.context.currentTask._doAgainTask = false;
      this.context.currentTask.onRun();
      continue;
    }
    if (screenshot === 0) {
      this.context.log("Error: cant not get page screenshot");
      break;
    }
    for (var taskName in page._tasks) {
      var task = page._tasks[taskName];
      // implement Context.delay Context.delayTask
      if (task._delayUntil > Date.now()) {
        continue;
      }
      var isTask = task.onTask(this.context.getScreenshot(false));
      if (isTask) {
        hasTask = true;
        this._changeTask(task);
        task.onRun();
        // implement Context.doAgainTask 1
        if (task._doAgainTask) {
          break;
        } 
        // implement Context.doNextTask
        if (task._doNextTask) {
          task._doNextTask = false;
          continue;
        }
        break;
      }
    }
    if (!hasTask) {
      break;
    }
  }
  this._changeTask(undefined);
}

Robotmon.prototype.start = function (jsonParams) {
  this.context.config.update();
  this.context.params.update(jsonParams);
  this.context.isStart = true;
  this.context.isPause = false;
  if (this.init()) {
    this._runPage();
  }
  this.context.log('All task stopped');
  this.context.isStart = false;
}
Robotmon.prototype.pause = function () {
  if (this.context.isPause === true) {
    this.context.isPause = false;
  } else {
    this.context.isPause = true;
  }
}
Robotmon.prototype.stop = function () {
  this.context.log('Waiting for stopping...');
  this.context.isStart = false;
}

function Task(page, name) {
  this._isInit = false;
  this._doNextTask = false;
  this._doAgainTask = false;
  this._delayUntil = 0;

  this.context = undefined;
  this.bundle = {};
  this.page = page;
  this.name = name;
  this.type = Enum.TypeTask;
  this.onTask = function() {};
  this.onInit = function() {};
  this.onEnter = function() {};
  this.onExit = function() {};
  this.onRun = function() {};
}

function Utils() {}

Utils.exist = function(v) {
  if (typeof v !== 'undefined') {
    return true;
  }
  return false;
}

Utils.userPlan = -1;
Utils.lastSendTime = 0;

Utils.canSendMessage = function() {
  Utils.userPlan = -1;
  if (Utils.exist(getUserPlan) && Utils.exist(sendNormalMessage)) {
    Utils.userPlan = getUserPlan();
  }
  if (Utils.userPlan === -1) {
    console.log('Can not send message, should login');
    return false;
  }
  return true;
}

Utils.sendNormalMessage = function() {
  if (Utils.canSendMessage()) {
    console.log(sendNormalMessage(topMsg, msg));
  }
}

Utils.sendUrgentMessage = function() {
  if (Utils.canSendMessage()) {
    console.log(sendUrgentMessage(topMsg, msg));
  }
}

// ===== developer global config start =====
var wh = getScreenSize();
var gUserScreenWidth = wh.width;
var gUserScreenHeight = wh.height;
var gDevScreenWidth = 1920;
var gDevScreenHeight = 1080;
var gTargetWidth = 800;
var gTargetHeight = 450;
var gDevToResizeRatio = 1/2.4;
var gGameWidth = gUserScreenWidth;
var gGameHeight = gUserScreenHeight;
var gGameOffsetX = 0;
var gGameOffsetY = 0;
if (gUserScreenWidth / gUserScreenHeight > 1.777778) {
  gGameWidth = Math.round(gGameHeight * 1.777778);
  gGameOffsetX = (gUserScreenWidth - gGameWidth) / 2;
} else if (gUserScreenWidth / gUserScreenHeight < 1.777778) {
  gGameHeight = Math.round(gGameWidth / 1.777778);
  gGameOffsetY = (gUserScreenHeight - gGameHeight) / 2;
}
var gDevToUserRatio = gGameWidth / gDevScreenWidth;
// ===== developer global config end =====

// ===== init robotmon and basic functions =====
var robotmon = new Robotmon();

function stop() {
  robotmon.stop();
}

function start() {

}

// ===== game features =====

// ===== game pages =====
var gamePage = new Page("gamePage");
gamePage.onPage = function(img) {
  // var img = this.onScreenshot();
  // var isFeature = fInGamePage.checkColor();
  // releaseImage(img);
  // console.log(isFeature);
  return true;
};
gamePage.onInit = function() {
};
gamePage.onEnter = function() {
  this.context.debug('Enter', this.name);
};
gamePage.onExit = function() {
  this.context.debug('Exit', this.name);
};
gamePage.onScreenshot = function() {
  return getScreenshotModify(gGameOffsetX, gGameOffsetY, gGameWidth, gGameHeight, gTargetWidth, gTargetHeight, 90);
};
gamePage.onDevToUserXY = function(devX, devY) {
  var x = gGameOffsetX + devX * gDevToUserRatio;
  var y = gGameOffsetY + devY * gDevToUserRatio;
  return {x: x, y: y};
}
gamePage.onDevToResizeXY = function(devX, devY) {
  var x = devX * gDevToResizeRatio;
  var y = devY * gDevToResizeRatio;
  return {x: x, y: y};
}

// ===== game tasks =====
var goInToGameTask = new Task("gamePage", "goInToGameTask");
goInToGameTask.onTask = function(img) {
  return true;
};
goInToGameTask.onInit = function() {};
goInToGameTask.onEnter = function() {
  this.context.debug('Enter', this.name);
};
goInToGameTask.onExit = function() {
  this.context.debug('Exit', this.name);
};
goInToGameTask.onRun = function() {
  
};

// var updateStatusTask = new Task("gamePage", "updateStatus");
// updateStatusTask.onTask = function(img) {
//   return false;
// };
// updateStatusTask.onInit = function() {};
// updateStatusTask.onEnter = function() {
//   this.context.debug('Enter', this.name);
// };
// updateStatusTask.onExit = function() {
//   this.context.debug('Exit', this.name);
// };
// updateStatusTask.onRun = function() {
//   // var hp = this.getHP();
//   // var mp = this.getMP();
//   // this.expChanged();
//   // this.isAutoOn();
//   // console.log('time', hp, mp);
//   // var region = this.inRegion();
//   // this.context.debug(region);
//   this.isMenuOn();
// };

// ===== developer test utils =====
function getScreenColorByPoint(p) {
  var img = gamePage.onScreenshot();
  var xy = gamePage.onDevToResizeXY(p.x, p.y);
  var c = getImageColor(img, xy.x, xy.y);
  var s = Colors.identityScore(p, c).toFixed(3);
  console.log("new Point("+p.x.toFixed(0)+", "+p.y.toFixed(0)+", "+c.r+", "+c.g+", "+c.b+", true, "+s+");");
  releaseImage(img);
}

function getScreenColorByFeature(f) {
  var img = gamePage.onScreenshot();
  for (var i = 0; i < f.points.length; i++) {
    var p = f.points[i];
    var xy = gamePage.onDevToResizeXY(p.x, p.y);
    var c = getImageColor(img, xy.x, xy.y);
    var s = Colors.identityScore(p, c).toFixed(3);
    console.log("new Point("+p.x.toFixed(0)+", "+p.y.toFixed(0)+", "+c.r+", "+c.g+", "+c.b+", true, "+s+");");
  }
  releaseImage(img);
}

var mapleNews1 = new Point(1740, 96, 254, 255, 248, true, 0.960);
var mapleNews2 = new Point(1718, 74, 245, 247, 242, true, 0.960);
var mapleNews3 = new Point(1738, 72, 24, 27, 20, true, 0.960);
var fMapleNews = new Feature("fMapleNews", [
  mapleNews1, mapleNews2, mapleNews3
]);


// ===== robotmon register =====
robotmon.registAll();
// robotmon.start();

// getScreenColorByFeature(fMapleNews);
robotmon.addTask(gamePage, goInToGameTask);

robotmon.start();