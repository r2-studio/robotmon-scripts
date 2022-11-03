function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var i=this.tasks[s];if(!(n-i.lastRunTime<i.interval)&&(null===t||i.priority<t.priority||i.interval>t.interval||i.lastRunTime<t.lastRunTime)){t=i;continue}}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),n.runTimes--,0===n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,i,o){return{name:t,run:n,interval:s||1e3,runTimes:i||0,priority:o,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,i,o){if(void 0===o&&(o=!1),"function"!=typeof n){console.log("Error not a function",t,n);return}var r=this.newTaskObject(t,n,s,i,0);o&&(r.lastRunTime=Date.now()),this.updateRunInterval(r.interval);var e="system_newTask_"+t,a=this.newTaskObject(e,(function(){this.tasks[t]=r}).bind(this),0,1,-20);return this.tasks[e]=a,r},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,(function(){delete this.tasks[t]}).bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,(function(){for(var t in this.tasks)delete this.tasks[t]}).bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};
var DEFAULT_CONFIG={appName:"testApp",oriScreenWidth:1080,oriScreenHeight:1920,oriVirtualButtonHeight:0,oriResizeFactor:.4,eventDelay:200,imageThreshold:.85,imageQuality:80,resizeFactor:.4};function RBM(i){void 0==i&&(i=DEFAULT_CONFIG),this.appName=i.appName||DEFAULT_CONFIG.appName,this.oriScreenWidth=i.oriScreenWidth||DEFAULT_CONFIG.oriScreenWidth,this.oriScreenHeight=i.oriScreenHeight||DEFAULT_CONFIG.oriScreenHeight,this.oriVirtualButtonHeight=i.oriVirtualButtonHeight||DEFAULT_CONFIG.oriVirtualButtonHeight,this.oriAppWidth=this.oriScreenWidth,this.oriAppHeight=this.oriScreenHeight-this.oriVirtualButtonHeight,this.oriResizeFactor=i.oriResizeFactor||DEFAULT_CONFIG.oriResizeFactor,this.resizeFactor=i.resizeFactor||DEFAULT_CONFIG.resizeFactor,this.imageThreshold=i.imageThreshold||DEFAULT_CONFIG.imageThreshold,this.imageQuality=i.imageQuality||DEFAULT_CONFIG.imageQuality,this.screenWidth=0,this.screenHeight=0,this.resizeScreenWidth=0,this.resizeScreenHeight=0,this.appWidth=0,this.appHeight=0,this.appMinRatio=1,this.appMaxRatio=1,this.researchTimes=5,this.virtualButtonHeight=0,this.ip="",this.during=i.eventDelay||DEFAULT_CONFIG.eventDelay,this.running=!0,this.isPartial=!1,this.partialOffsetXY={x:0,y:0},this._screenshotImg=0}RBM.prototype.init=function(){var i=getScreenSize();this.screenWidth=i.width,this.screenHeight=i.height,this.virtualButtonHeight=getVirtualButtonHeight(),this.appWidth=this.screenWidth,0!==this.oriVirtualButtonHeight?this.appHeight=this.screenHeight-this.virtualButtonHeight:this.appHeight=this.screenHeight,this.resizeAppWidth=this.appWidth*this.resizeFactor,this.resizeAppHeight=this.appHeight*this.resizeFactor;var t=this.appWidth/this.oriAppWidth,e=this.appHeight/this.oriAppHeight;this.appMinRatio=Math.min(t,e),this.appMaxRatio=Math.max(t,e)},RBM.prototype.log=function(){sleep(10);for(var i=0;i<arguments.length;i++)"object"==typeof arguments[i]&&(arguments[i]=JSON.stringify(arguments[i]));console.log.apply(console,arguments)},RBM.prototype.mappingImageWHs=function(i){var t=[];if(this.appMinRatio===this.appMaxRatio)t.push({width:i.width*this.appMinRatio,height:i.height*this.appMinRatio});else for(var e=(this.appMaxRatio-this.appMinRatio)/this.researchTimes,h=this.appMinRatio;h<=this.appMaxRatio;h+=e)t.push({width:i.width*h,height:i.height*h});return t},RBM.prototype.mappingXY=function(i){var t;return{x:Math.round(i.x*this.appWidth/this.oriAppWidth),y:Math.round(i.y*this.appHeight/this.oriAppHeight)}},RBM.prototype.getImagePath=function(){return getStoragePath()+"/scripts/"+this.appName+"/images"},RBM.prototype.startApp=function(i,t){void 0===t?execute("monkey -p "+i+" -c android.intent.category.LAUNCHER 1"):execute("am start -n "+i+"/"+t)},RBM.prototype.stopApp=function(i){execute("am force-stop "+i)},RBM.prototype.currentApp=function(){var i,t=execute("dumpsys activity activities").split("mFocusedActivity")[1].split(" ")[3].split("/");return{packageName:t[0],activityName:t[1]}},RBM.prototype.click=function(i){tap((i=this.mappingXY(i)).x,i.y,this.during)},RBM.prototype.tapDown=function(i){tapDown((i=this.mappingXY(i)).x,i.y,this.during)},RBM.prototype.moveTo=function(i){moveTo((i=this.mappingXY(i)).x,i.y,this.during)},RBM.prototype.tapUp=function(i){tapUp((i=this.mappingXY(i)).x,i.y,this.during)},RBM.prototype.swipe=function(i,t,e){void 0===e&&(e=5),i=this.mappingXY(i),t=this.mappingXY(t);var h=this.during/(e+2),s=(t.x-i.x)/e,r=(t.y-i.y)/e;tapDown(i.x,i.y,h);for(var p=0;p<=e;p++)moveTo(i.x+p*s,i.y+p*r,h);tapUp(t.x,t.y,h)},RBM.prototype.screenshot=function(i){var t=this.getImagePath()+"/"+i,e=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);saveImage(e,t),releaseImage(e)},RBM.prototype.oriScreencrop=function(i,t,e,h,s){var r=this.getImagePath()+"/"+i,p=Math.abs(h-t),a=Math.abs(s-e),o=getScreenshotModify(Math.min(t,h),Math.min(e,s),p,a,p*this.oriResizeFactor,a*this.oriResizeFactor,this.imageQuality);saveImage(o,r),releaseImage(o)},RBM.prototype.screencrop=function(i,t,e,h,s){var r=this.getImagePath()+"/"+i,p=this.mappingXY({x:t,y:e}),a=this.mappingXY({x:h,y:s}),o=Math.abs(a.x-p.x),n=Math.abs(a.y-p.y),g=getScreenshotModify(Math.min(p.x,a.x),Math.min(p.y,a.y),o,n,o*this.resizeFactor,n*this.resizeFactor,this.imageQuality);saveImage(g,r),releaseImage(g)},RBM.prototype.findImage=function(i,t){void 0===t&&(t=this.imageThreshold);var e=0;e=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var h=this.getImagePath()+"/"+i,s=openImage(h);if(0===s){this.log("Image is not found: ",h),e!=this._screenshotImg&&releaseImage(e);return}var r=getImageSize(s);r.width*=this.resizeFactor/this.oriResizeFactor,r.height*=this.resizeFactor/this.oriResizeFactor;for(var p=this.mappingImageWHs(r),a=void 0,o=0;o<p.length;o++){var n=p[o],g=resizeImage(s,n.width,n.height);if((a=findImage(e,g)).width=n.width,a.height=n.height,releaseImage(g),a.score>=t)break;a=void 0}return releaseImage(s),e!=this._screenshotImg&&releaseImage(e),void 0!==a&&(a.x=this.partialOffsetXY.x+a.x*(this.appWidth/this.resizeAppWidth),a.y=this.partialOffsetXY.y+a.y*(this.appHeight/this.resizeAppHeight),a.width*=this.appWidth/this.resizeAppWidth,a.height*=this.appWidth/this.resizeAppWidth),a},RBM.prototype.findImages=function(i,t,e,h,s){void 0===t&&(t=this.imageThreshold);var r=0;r=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var p=this.getImagePath()+"/"+i,a=openImage(p);if(0===a)return this.log("Image is not found: ",p),r!=this._screenshotImg&&releaseImage(r),[];var o=getImageSize(a);o.width*=this.resizeFactor/this.oriResizeFactor,o.height*=this.resizeFactor/this.oriResizeFactor;for(var n=this.mappingImageWHs(o),g=[],c=0;c<n.length;c++){var d=n[c],m=resizeImage(a,d.width,d.height),u=findImages(r,m,t,e,!h);for(var y in releaseImage(m),u)g.push({x:u[y].x,y:u[y].y,width:d.width,height:d.height,score:u[y].score});if(g.length>=e||!s&&g.length>0)break}for(var c in releaseImage(a),r!=this._screenshotImg&&releaseImage(r),g)g[c].x=this.partialOffsetXY.x+g[c].x*(this.appWidth/this.resizeAppWidth),g[c].y=this.partialOffsetXY.y+g[c].y*(this.appHeight/this.resizeAppHeight),g[c].width*=this.appWidth/this.resizeAppWidth,g[c].height*=this.appWidth/this.resizeAppWidth;return g},RBM.prototype.imageExists=function(i,t){return void 0!==this.findImage(i,t)},RBM.prototype.imageClick=function(i,t){var e,h=this.findImage(i,t);if(void 0===h)return!1;return tap(h.x+h.width/2,h.y+h.height/2,this.during),!0},RBM.prototype.imageWaitClick=function(i,t,e){void 0===t&&(t=1e4);for(var h=Date.now();this.running;){var s,r=this.findImage(i,e);if(void 0!==r){return tap(r.x+r.width/2,r.y+r.height/2,this.during),!0}if(sleep(3*this.during),Date.now()-h>t)return!1}},RBM.prototype.imageWaitShow=function(i,t,e){void 0===t&&(t=1e4);for(var h=Date.now();this.running&&!(void 0!==this.findImage(i,e)||(sleep(3*this.during),Date.now()-h>t)););},RBM.prototype.imageWaitGone=function(i,t,e){void 0===t&&(t=1e4);for(var h=Date.now();this.running&&!(void 0===this.findImage(i,e)||(sleep(3*this.during),Date.now()-h>t)););},RBM.prototype.keepScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this._screenshotImg=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality)},RBM.prototype.keepScreenshotPartial=function(i,t,e,h){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0);var s=this.mappingXY({x:i,y:t}),r=this.mappingXY({x:e,y:h}),p=Math.abs(r.x-s.x),a=Math.abs(r.y-s.y);this._screenshotImg=getScreenshotModify(Math.min(s.x,r.x),Math.min(s.y,r.y),p,a,p*this.resizeFactor,a*this.resizeFactor,this.imageQuality),this.isPartial=!0,this.partialOffsetXY={x:Math.min(s.x,r.x),y:Math.min(s.y,r.y)}},RBM.prototype.releaseScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this.isPartial=!1,this.partialOffsetXY={x:0,y:0}},RBM.prototype.typing=function(i){typing(i,this.during)},RBM.prototype.keycode=function(i){keycode(i,this.during)},RBM.prototype.sleep=function(){sleep(this.during)};

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
  return true;
}

var rbm = undefined;

var testConfig = [{
  action: 'loop',
  times: 1,
  commands: [
    {
      action: 'rbm.log',
      args: ['Hello'],
    },
    {
      action: 'safeSleep',
      args: [2000],
    },
    {
      action: 'loop',
      times: 1,
      commands: [
        {
          action: 'rbm.log',
          args: ['Hello2'],
        },
        {
          action: 'safeSleep',
          args: [1000],
        },
      ],
    },
    {
      action: 'ifColor',
      is: true,
      x: 0,
      y: 0,
      r: 0,
      g: 0,
      b: 0,
      diff: 20,
      commands: [
        {
          action: 'rbm.log',
          args: ['Hello2'],
        },
        {
          action: 'safeSleep',
          args: [1000],
        },
      ],
    }
  ],
}];

var Click = function(x, y) {
  rbm.click({x: x, y: y});
};
var TapDown = function(x, y) {
  rbm.tapDown({x: x, y: y});
};
var MoveTo = function(x, y) {
  rbm.moveTo({x: x, y: y});
};
var TapUp = function(x, y) {
  rbm.tapUp({x: x, y: y});
};
var Swipe = function(x1, y1, x2, y2) {
  rbm.swipe({x: x1, y: y1}, {x: x2, y: y2}, 4);
};
var Home = function() {
  keycode('HOME', 100);
}
var Back = function() {
  keycode('BACK', 100);
}
var Screenshot = function() {
  var img = getScreenshot();
  saveImage(img, getStoragePath() + "/screenshot/" + Date.now() + ".png");
  safeSleep(100);
  releaseImage(img);
}
var PrintColor = function(x, y) {
  var wh = getScreenSize();
  if (x < 0 || x >= wh.width || y < 0 || y > wh.height) {
    rbm.log("X < 0 or X >= width or Y < 0 or Y >= height");
  }
  var img = getScreenshot();
  var c = getImageColor(img, x, y);
  releaseImage(img);
  rbm.log("Color R: " + c.r + " G: " + c.g + " B: " + c.b);
}

function safeSleep(t) {
  if (t == undefined) {
    t = 200;
  }
  
  var start = Date.now();
  while(rbm.running) {
    sleep(200);
    if (Date.now() - start >= t) {
      break;
    }
  }
}
var callFunction = function(thisObj, functionName, args) {
  console.log(functionName, JSON.stringify(args));
  eval(functionName).apply(thisObj, args);
}

var runCommands = function(commands) {
  for (var idx in commands) {
    if (!rbm || !rbm.running) {
      return;
    }
    var command = commands[idx];
    if (command.action == 'loop') {
      for (var t = 0; t < command.times && rbm && rbm.running; t++) {
        console.log('loop' + t + '/' + command.times);
        runCommands(command.commands);
      }
    } else if (command.action == 'ifColor') {
      var x = +command.x;
      var y = +command.y;
      var d = +command.diff;
      var wh = getScreenSize();
      if (x < 0 || x >= wh.width || y < 0 || y > wh.height) {
        rbm.log("ifColor X < 0 or X >= width or Y < 0 or Y >= height");
        break;
      }
      var img = getScreenshot();
      var c = getImageColor(img, x, y);
      releaseImage(img);
      if (command.is && isSameColor(command, c, d)) {
        console.log('is color and do...');
        runCommands(command.commands);
      } else if (!command.is && !isSameColor(command, c, d)) {
        console.log('is not color and do...');
        runCommands(command.commands);
      } else {
        console.log('ifColor do nothing');
      }
    } else {
      if (command.action.search('rbm') != -1) {
        callFunction(rbm, command.action, command.args);
      } else {
        callFunction(null, command.action, command.args);
      }
    }
  }
}

function start(JSONcommands) {
  stop();
  var screenSize = getScreenSize();
  var config = {
    appName: 'com.r2studio.EZRobot',
    oriScreenWidth: screenSize.width,
    oriScreenHeight: screenSize.height,
    oriVirtualButtonHeight: 0,
    oriResizeFactor: 0.8,
    eventDelay: 200,
    imageThreshold: 0.9,
    imageQuality: 90,
    resizeFactor: 0.8,
  };

  rbm = new RBM(config);
  rbm.running = true;
  rbm.init();
  rbm.log('[EZRobot] Start');
  rbm.log(JSONcommands);
  var commands = JSON.parse(JSONcommands);
  runCommands(commands);
}

function stop() {
  if (rbm != undefined) {
    rbm.running = false;
    rbm.log('[EZRobot] Stop');
  }
}

// start(JSON.stringify(testConfig));