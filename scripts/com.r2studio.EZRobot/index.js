importJS("TaskController-0.0.1");
importJS('RBM-0.0.3');

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