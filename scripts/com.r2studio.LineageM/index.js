// Import RBM library
importJS('RBM-0.0.2');
importJS("TaskController-0.0.1");

// Initial RBM config
var config = {
  appName: 'com.r2studio.LoopYT',
  oriScreenWidth: 1440,
  oriScreenHeight: 2560,
  oriVirtualButtonHeight: 0,
  oriResizeFactor: 0.8,
  eventDelay: 200,
  imageThreshold: 0.85,
  imageQuality: 80,
  resizeFactor: 0.8,
};

var settings = {
  youtubeURL: "m.youtube.com",
  searchWords: "twice",
  waitVideoTime: 10 * 1000,
  waitVideoLoad: 4 * 1000,
  isAutoDetectVideo: true,
  isAutoToggleAirplane: true,
  airplaneOnX: 100,
  airplaneOnY: 100, 
  airplaneOffX: 100,
  airplaneOffY: 100,
  watchTimes: 0,
  videoPosition: 0,
};

var gTaskController;
var rbm = new RBM(config);

function safeSleep(t) {
  var waitTime = 0;
  while(rbm.running) {
    sleep(100);
    waitTime += 100;
    if (waitTime >= t) {
      break;
    }
  }
}

var clickCnt = 0;
function taskRunTrial() {
  var setting = {
    x: 1280,
    y: 970,
  }
  tap(setting.x, setting.y, 10);
  clickCnt ++;
  console.log('Clicked: ', clickCnt);
}

function taskPlayGame() {
  var settings = [
    {
      'target': 'hp',
      'type': 'lower',
      'threshold': 88,
      'x': 928,
      'y': 970,
    },
    {
      'target': 'mp',
      'type': 'higher',
      'threshold': 90,
      'x': 812,
      'y': 983,
    },
  ]
  
  var startX = 121;
  var endX = 403;
  var hpY = 38;
  var mpY = 64;
  
  var img = getScreenshot();
  var hp, mp;
  
  for (var i = 1; i > 0; i -= 0.01) {
    var pxl = getImageColor(img, startX + (endX - startX) * i , hpY)
  
    if (pxl.r > 200) {
      hp = i * 100;
      break;
    }
  }
  
  // var pxl = getImageColor(img, 128 , mpY)
  // console.log(pxl.r, pxl.g, pxl.b, pxl.a)
  // var pxl2 = getImageColor(img, 403 , mpY)
  // console.log(pxl2.r, pxl2.g, pxl2.b, pxl2.a)
  for (var i = 1; i > 0.0; i -= 0.01) {
    var pxl = getImageColor(img, startX + (endX - startX) * i , mpY)
  
    if (pxl.r < 40) {
      mp = i * 100;
      break;
    }
  }
  
  for (var i = 0, len = settings.length; i < len; i++) {
    var s = settings[i];
    
    if (s.target == 'hp' && s.type == 'lower' && hp <= s.threshold) {
      tap(s.x, s.y, 70);
      // rbm.click({x: s.x, y: s.y});
      console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp), 'do:', i, '(', s.x, ',', s.y, ')')
    }
    else if (s.target == 'hp' && s.type == 'higher' && hp > s.threshold) {
      tap(s.x, s.y, 70);
      // rbm.click({x: s.x, y: s.y});
      console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp), 'do:', i, '(', s.x, ',', s.y, ')')
    }
    else if (s.target == 'mp' && s.type == 'lower' && mp <= s.threshold) {
      tap(s.x, s.y, 70);
      // rbm.click({x: s.x, y: s.y});
      console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp), 'do:', i, '(', s.x, ',', s.y, ')')
    }
    else if (s.target == 'mp' && s.type == 'higher' && mp > s.threshold) {
      tap(s.x, s.y, 70);
      // rbm.click({x: s.x, y: s.y});
      console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp), 'do:', i, '(', s.x, ',', s.y, ')')
    } else {
      console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp), 'do nothing')
    }
  }
  releaseImage(img);
}

function start(runType) {
  stop();
  // settings.searchWords = words;
  runType = runType === undefined ? 'autoPlay' : runType;

  rbm.init();
  rbm.running = true;
  gTaskController = new TaskController();

  if (runType === 'autoPlay') {
    gTaskController.newTask('taskPlayGame', taskPlayGame, 1500, 3 * 86400);
  } else if (runType === 'trial') {
    console.log('sent trial')
    gTaskController.newTask('taskRunTrial', taskRunTrial, 300, 3 * 86400);
  }

  sleep(1000);
  gTaskController.start();
}

function stop() {
  rbm.running = false;
  if (gTaskController !== undefined) {
    gTaskController.removeAllTasks();
    gTaskController.stop();
  }
}
