function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var o=this.tasks[s];n-o.lastRunTime<o.interval||(null!==t?o.priority<t.priority?t=o:o.interval>t.interval?t=o:o.lastRunTime<t.lastRunTime&&(t=o):t=o)}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),0===--n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,o,i){return{name:t,run:n,interval:s||1e3,runTimes:o||0,priority:i,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,o,i){void 0===i&&(i=!1);{if("function"==typeof n){var e=this.newTaskObject(t,n,s,o,0);i&&(e.lastRunTime=Date.now()),this.updateRunInterval(e.interval);var r="system_newTask_"+t,a=this.newTaskObject(r,function(){this.tasks[t]=e}.bind(this),0,1,-20);return this.tasks[r]=a,e}console.log("Error not a function",t,n)}},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,function(){delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,function(){for(var t in this.tasks)delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};
function RBM(t){void 0==t&&(t=DEFAULT_CONFIG),this.appName=t.appName||DEFAULT_CONFIG.appName,this.oriScreenWidth=t.oriScreenWidth||DEFAULT_CONFIG.oriScreenWidth,this.oriScreenHeight=t.oriScreenHeight||DEFAULT_CONFIG.oriScreenHeight,this.oriVirtualButtonHeight=t.oriVirtualButtonHeight||DEFAULT_CONFIG.oriVirtualButtonHeight,this.oriAppWidth=this.oriScreenWidth,this.oriAppHeight=this.oriScreenHeight-this.oriVirtualButtonHeight,this.oriResizeFactor=t.oriResizeFactor||DEFAULT_CONFIG.oriResizeFactor,this.resizeFactor=t.resizeFactor||DEFAULT_CONFIG.resizeFactor,this.imageThreshold=t.imageThreshold||DEFAULT_CONFIG.imageThreshold,this.imageQuality=t.imageQuality||DEFAULT_CONFIG.imageQuality,this.screenWidth=0,this.screenHeight=0,this.resizeScreenWidth=0,this.resizeScreenHeight=0,this.appWidth=0,this.appHeight=0,this.appMinRatio=1,this.appMaxRatio=1,this.researchTimes=5,this.virtualButtonHeight=0,this.ip="",this.during=t.eventDelay||DEFAULT_CONFIG.eventDelay,this.running=!0,this._screenshotImg=0,this.init()}var DEFAULT_CONFIG={appName:"testApp",oriScreenWidth:1080,oriScreenHeight:1920,oriVirtualButtonHeight:0,oriResizeFactor:.5,eventDelay:200,imageThreshold:.85,imageQuality:80,resizeFactor:.5};RBM.prototype.init=function(){var t=getScreenSize();this.screenWidth=t.width,this.screenHeight=t.height,this.virtualButtonHeight=getVirtualButtonHeight(),this.appWidth=this.screenWidth,0!==this.oriVirtualButtonHeight?this.appHeight=this.screenHeight-this.virtualButtonHeight:this.appHeight=this.screenHeight,this.resizeAppWidth=this.appWidth*this.resizeFactor,this.resizeAppHeight=this.appHeight*this.resizeFactor;var i=this.appWidth/this.oriAppWidth,e=this.appHeight/this.oriAppHeight;this.appMinRatio=Math.min(i,e),this.appMaxRatio=Math.max(i,e)},RBM.prototype.log=function(){sleep(10);for(var t=0;t<arguments.length;t++)"object"==typeof arguments[t]&&(arguments[t]=JSON.stringify(arguments[t]));console.log.apply(console,arguments)},RBM.prototype.mappingImageWHs=function(t){var i=[];if(this.appMinRatio===this.appMaxRatio)i.push({width:t.width*this.appMinRatio,height:t.height*this.appMinRatio});else for(var e=(this.appMaxRatio-this.appMinRatio)/this.researchTimes,h=this.appMinRatio;h<=this.appMaxRatio;h+=e)i.push({width:t.width*h,height:t.height*h});return i},RBM.prototype.mappingXY=function(t){var i=Math.round(t.x*this.appWidth/this.oriAppWidth),e=Math.round(t.y*this.appHeight/this.oriAppHeight);return{x:i,y:e}},RBM.prototype.getImagePath=function(){return getStoragePath()+"/scripts/"+this.appName+"/images"},RBM.prototype.startApp=function(t,i){void 0===i?execute("monkey -p "+t+" -c android.intent.category.LAUNCHER 1"):execute("am start -n "+t+"/"+i)},RBM.prototype.stopApp=function(t){execute("am force-stop "+t)},RBM.prototype.currentApp=function(){var t=execute("dumpsys activity activities").split("mFocusedActivity")[1].split(" ")[3].split("/"),i=t[0],e=t[1];return{packageName:i,activityName:e}},RBM.prototype.click=function(t){t=this.mappingXY(t),tap(t.x,t.y,this.during)},RBM.prototype.tapDown=function(t){t=this.mappingXY(t),tapDown(t.x,t.y,this.during)},RBM.prototype.moveTo=function(t){t=this.mappingXY(t),moveTo(t.x,t.y,this.during)},RBM.prototype.tapUp=function(t){t=this.mappingXY(t),tapUp(t.x,t.y,this.during)},RBM.prototype.swipe=function(t,i,e){void 0===e&&(e=5),t=this.mappingXY(t),i=this.mappingXY(i);var h=this.during/(e+2),s=(t.x-i.x)/e,a=(t.y-i.y)/e;tapDown(t.x,t.y,h);for(var r=0;e>=r;r++)moveTo(t.x+r*s,t.y+r*a,h);tapUp(i.x,i.y,h)},RBM.prototype.screenshot=function(t){var i=this.getImagePath()+"/"+t,e=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);saveImage(e,i),releaseImage(e)},RBM.prototype.screencrop=function(t,i,e,h,s){var a=this.getImagePath()+"/"+t,r=Math.abs(h-i),o=Math.abs(s-e),p=getScreenshotModify(Math.min(i,h),Math.min(e,s),r,o,r*this.resizeFactor,o*this.resizeFactor,this.imageQuality);saveImage(p,a),releaseImage(p)},RBM.prototype.findImage=function(t,i){void 0===i&&(i=this.imageThreshold);var e=0;e=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var h=this.getImagePath()+"/"+t,s=openImage(h);if(0===s)return this.log("Image is not found: ",h),void releaseImage(e);for(var a=getImageSize(s),r=this.mappingImageWHs(a),o=void 0,p=0;p<r.length;p++){var n=r[p];n.width*=this.resizeFactor/this.oriResizeFactor,n.height*=this.resizeFactor/this.oriResizeFactor;var g=resizeImage(s,n.width,n.height);if(o=findImage(e,g),o.width=n.width,o.height=n.height,releaseImage(g),o.score>=i)break}return releaseImage(s),releaseImage(e),o},RBM.prototype.imageExists=function(t,i){var e=this.findImage(t,i);return void 0===e?!1:!0},RBM.prototype.imageClick=function(t,i){var e=this.findImage(t,i);if(void 0!==e){var h=(e.x+e.width/2)*this.appWidth/this.resizeAppWidth,s=(e.y+e.height/2)*this.appHeight/this.resizeAppHeight;tap(h,s,this.during)}},RBM.prototype.imageWaitClick=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0!==e){var h=Math.round(e.x*this.appWidth/this.resizeAppWidth),s=Math.round(e.y*this.appHeight/this.resizeAppHeight);tap(h,s,this.during);break}if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.imageWaitShow=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0!==e)break;if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.imageWaitGone=function(t){void 0===t&&(t=1e4);for(var i=Date.now();this.running;){var e=this.findImage(filename,threshold);if(void 0===e)break;if(sleep(3*this.during),Date.now()-i>t)break}},RBM.prototype.keepScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this._screenshotImg=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality)},RBM.prototype.releaseScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0)},RBM.prototype.typing=function(t){typing(label,this.during)},RBM.prototype.keycode=function(t){keycode(t,this.during)},RBM.prototype.sleep=function(){sleep(this.during)};

var Config = {
  isRunning: false,
  autoNextWar: false,
  autoSameWar: false,
};

function MarvelFutureFight() {
}

MarvelFutureFight.prototype.tastAutoStart = function() {
  rmb.imageClick("StartButton.png");
  if (Config.autoSameWar) {
    rmb.log('打同一關');
    rmb.imageClick("FightAgainButton.png");
  } else if (Config.autoNextWar) {
    rmb.log('打下一關');
    rmb.imageClick("FightNextButton.png");
  }

  if (rmb.imageExists("RedCloseButton.png")) {
    rmb.imageClick("RedCloseButton.png");
  }
}

MarvelFutureFight.prototype.taskAttack = function() {
  rmb.log('普通攻擊');
  rmb.imageClick("FightButton0.png");
}

MarvelFutureFight.prototype.taskPowerAttack = function() {
  rmb.log('技能攻擊');
  rmb.imageClick("FightButton1.png");
  rmb.imageClick("FightButton2.png");
  rmb.imageClick("FightButton3.png");
  rmb.imageClick("FightButton4.png");
  rmb.imageClick("FightButton5.png");
}

// ===================================================================================
var rmb;
var mff;

function stop() {
  console.log('[MARVEL 未來之戰] 停止');
  Config.isRunning = false;
  Config.autoNextWar = false;
  Config.autoSameWar = false;
  sleep(1000);
  gTaskController.removeAllTasks();
}

function start(taskAttack, taskPowerAttack, autoNextWar, autoSameWar) {
  console.log('[MARVEL 未來之戰] 啟動');
  Config.isRunning = true;
  Config.autoNextWar = autoNextWar;
  Config.autoSameWar = autoSameWar;

  var config = {
    appName: 'com.r2studio.MarvelFutureFight',
    oriScreenWidth: 1080,
    oriScreenHeight: 1920,
    eventDelay: 1000,
  };

  rmb = new RBM(config);
  mff = new MarvelFutureFight();
  gTaskController = new TaskController();
  if(autoNextWar || autoSameWar){gTaskController.newTask('tastAutoStart', mff.tastAutoStart.bind(mff), 1000, 0);}
  if(taskAttack){gTaskController.newTask('taskAttack', mff.taskAttack.bind(mff), 500, 0);}
  if(taskPowerAttack){gTaskController.newTask('taskPowerAttack', mff.taskPowerAttack.bind(mff), 10 * 1000, 0, true);}

  sleep(1000);
  gTaskController.start();
};
// start(true, true, false, false);
// stop();

// rmb.screencrop("FightButton0.png", 1700, 845, 1810, 955);
// rmb.screencrop("FightButton1.png", 1600, 630, 1700, 730);
// rmb.screencrop("FightButton2.png", 1480, 760, 1580, 860);
// rmb.screencrop("FightButton3.png", 1780, 630, 1880, 730);
// rmb.screencrop("FightButton4.png", 1500, 930, 1600, 1030);
// rmb.screencrop("FightButton5.png", 1320, 930, 1420, 1030);
// rmb.screencrop("FightEntryButton.png", 1400, 960, 1900, 1060);
// rmb.screencrop("FightNextButton.png", 1640, 970, 1870, 1040);
// rmb.screencrop("FightAgainButton.png", 1370, 970, 1600, 1040);
// rmb.screencrop("StartButton.png", 1450, 985, 1730, 1050);
// rmb.screencrop("ResumeButton.png", 760, 330, 1160, 410);
// rmb.screencrop("RedCloseButton.png", 1630, 120, 1690, 180);