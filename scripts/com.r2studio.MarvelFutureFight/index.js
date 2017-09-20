function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var o=this.tasks[s];n-o.lastRunTime<o.interval||(null!==t?o.priority<t.priority?t=o:o.interval>t.interval?t=o:o.lastRunTime<t.lastRunTime&&(t=o):t=o)}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),0===--n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,o,i){return{name:t,run:n,interval:s||1e3,runTimes:o||0,priority:i,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,o,i){void 0===i&&(i=!1);{if("function"==typeof n){var e=this.newTaskObject(t,n,s,o,0);i&&(e.lastRunTime=Date.now()),this.updateRunInterval(e.interval);var r="system_newTask_"+t,a=this.newTaskObject(r,function(){this.tasks[t]=e}.bind(this),0,1,-20);return this.tasks[r]=a,e}console.log("Error not a function",t,n)}},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,function(){delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,function(){for(var t in this.tasks)delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};

var Config = {
  screenWidth: 0, // auto detect
  screenHeight: 0, // auto detect
  resizeWidth: 0,
  resizeHeight: 0,
  isRunning: false,
  autoNextWar: false,
};

function log() {
  sleep(100);
  if (typeof arguments[0] == 'object') {
    console.log(JSON.stringify(arguments[0]));
  } else {
    console.log.apply(console, arguments);
  }
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

function getColor(img, xy) {
  var xy = toResizeXYs(xy);
  return getImageColor(img, xy.x, xy.y);
}

function toResizeXYs(xy) {
  return toResizeXY(xy.x, xy.y);
}

function toResizeXY(x, y) {
  var rx = Math.floor(x * Config.resizeWidth / Config.screenWidth);
  var ry = Math.floor(y * Config.resizeHeight / Config.screenHeight);
  return {x: rx, y: ry};
}

function initScreenSize() {
  var size = getScreenSize();
  Config.screenHeight = size.height;
  Config.screenWidth = size.width;
  Config.resizeWidth = Math.floor(Config.screenWidth / 3);
  Config.resizeHeight = Math.floor(Config.screenHeight / 3);
}

function MarvelFutureFight() {
  this.Const = {
    // screen layout
    captureWidth: 1920,
    captureHeight: 1080,
    
    // buttons
    ButtonLevelUp: {x: 1050, y: 890},
    ButtonNextWar: {x: 1822, y: 1015},
    ButtonNextWarGreen: {x: 1630, y: 1015},
    ButtonSkip: {x: 1856, y: 88},
    ButtonHeroLevelUp: {x: 1373, y: 963},
    ButtonHeroLevelUpConfirm: {x: 1200, y: 817},
    ButtonRate: {x: 756, y: 853},

    ButtonAttack: {x: 1760, y: 900},
    ButtonAttack1: {x: 1660, y: 670},
    ButtonAttack2: {x: 1530, y: 800},
    ButtonAttack3: {x: 1830, y: 670},
    ButtonAttack4: {x: 1555, y: 980},
    ButtonAttack5: {x: 1380, y: 980},
    ButtonAttack6: {x: 1200, y: 980},
    // config
    during: 300,

    ButtonEnableColor: {a: 0, b: 145, g: 89, r: 64},
    ButtonEnableGreenColor: {a: 0, b: 108, g: 150, r: 79},
    ButtonRateColor: {a: 0, b: 0, g: 209, r: 248},
  };
  this.running = false;
}

MarvelFutureFight.prototype.goBack = function() {
  log("goBack")
  keycode('BACK', this.Const.during);
}

MarvelFutureFight.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = this.Const.during;
  }
  tap(Math.round(xy.x), Math.round(xy.y), during);
}

MarvelFutureFight.prototype.screenshot = function() {
  return getScreenshotModify(0, 0, 0, 0, Config.resizeWidth, Config.resizeHeight, 80);
}

MarvelFutureFight.prototype.pressSkipButton = function(img) {
  if (isSameColor(this.Const.ButtonEnableColor, getColor(img, this.Const.ButtonSkip))) {
    log("跳過");
    this.tap(this.Const.ButtonSkip);
  }
}

MarvelFutureFight.prototype.checkButton = function() {
  var img = this.screenshot();
  if (Config.autoNextWar && isSameColor(this.Const.ButtonEnableColor, getColor(img, this.Const.ButtonNextWar))) {
    log("下一關(藍色按鈕)");
    this.tap(this.Const.ButtonNextWar);
    this.pressSkipButton(img);
  }
  if (Config.autoNextWar && isSameColor(this.Const.ButtonEnableGreenColor, getColor(img, this.Const.ButtonNextWarGreen))) {
    log("下一關(綠色按鈕)");
    this.tap(this.Const.ButtonNextWarGreen);
    this.pressSkipButton(img);
  }

  this.pressSkipButton(img);

  if (isSameColor(this.Const.ButtonEnableColor, getColor(img, this.Const.ButtonLevelUp))) {
    log("神盾局升級");
    this.goBack();
  }
  if (isSameColor(this.Const.ButtonEnableGreenColor, getColor(img, this.Const.ButtonHeroLevelUp))) {
    log("英雄進階");
    this.tap(this.Const.ButtonHeroLevelUp);
  }
  if (isSameColor(this.Const.ButtonEnableGreenColor, getColor(img, this.Const.ButtonHeroLevelUpConfirm))) {
    log("英雄進階確認");
    this.tap(this.Const.ButtonHeroLevelUpConfirm);
  }
  if (isSameColor(this.Const.ButtonRateColor, getColor(img, this.Const.ButtonRate))) {
    log("評分");
    this.goBack();
  }
  releaseImage(img);
}

MarvelFutureFight.prototype.taskAttack = function() {
  this.checkButton();
  log('普通攻擊');
  this.tap(this.Const.ButtonAttack);
}

MarvelFutureFight.prototype.taskPowerAttack = function() {
  this.checkButton();
  log('技能攻擊');
  this.tap(this.Const.ButtonAttack1);
  this.tap(this.Const.ButtonAttack2);
  this.tap(this.Const.ButtonAttack3);
  this.tap(this.Const.ButtonAttack4);
  this.tap(this.Const.ButtonAttack5);
  this.tap(this.Const.ButtonAttack6);
}

// ===================================================================================
var mff;

function stop() {
  log('[MARVEL 未來之戰] 停止');
  Config.isRunning = false;
  Config.autoNextWar = false;
  sleep(1000);
  gTaskController.removeAllTasks();
}

function start(taskAttack, taskPowerAttack, autoNextWar) {
  log('[MARVEL 未來之戰] 啟動');
  initScreenSize();
  Config.isRunning = true;
  Config.autoNextWar = autoNextWar;
  mff = new MarvelFutureFight();
  log(Config);
  gTaskController = new TaskController();
  if(taskAttack){gTaskController.newTask('taskAttack', mff.taskAttack.bind(mff), 300, 0);}
  if(taskPowerAttack){gTaskController.newTask('taskPowerAttack', mff.taskPowerAttack.bind(mff), 10 * 1000, 0, true);}
  sleep(1000);
  gTaskController.start();
};
// start(true, true, true);
// stop();