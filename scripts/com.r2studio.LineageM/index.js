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

function taskWatchVideo() {
  var sleepTime = 1500;
  rbm.click(Buttons.chromeWindow); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Open Chrome. 打開 Chrome");
  startChrome(); safeSleep(settings.waitVideoLoad);
  rbm.log("Click Window. 點擊視窗");
  rbm.click(Buttons.chromeWindow); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Click Menu. 點擊選單");
  rbm.click(Buttons.chromeMenu); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("New Incognito. 新增無痕視窗");
  rbm.click(Buttons.chromeNewIncognito); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Input Youtube URL. 輸入Youtube網址");
  rbm.click(Buttons.chromeURL); safeSleep(sleepTime); if (!rbm.running) {return;}
  typing(settings.youtubeURL, 2000); safeSleep(sleepTime); if (!rbm.running) {return;}
  keycode('ENTER');
  safeSleep(settings.waitVideoLoad);
  rbm.log("Search: " + settings.searchWords +  ". 搜尋:" + settings.searchWords);
  rbm.click(Buttons.youtubeSearchIcon);safeSleep(sleepTime); if (!rbm.running) {return;}
  typing(settings.searchWords, 2000); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.click(Buttons.youtubeSearchGo);safeSleep(sleepTime); if (!rbm.running) {return;}
  safeSleep(settings.waitVideoLoad);
  rbm.log("Click first video. 點擊第一個影片");
  rbm.click(Buttons.youtubeVideoPositions[settings.videoPosition]);safeSleep(sleepTime); if (!rbm.running) {return;}
  safeSleep(settings.waitVideoLoad); if (!rbm.running) {return;}
  var videoStart = Date.now();
  rbm.log("Wait for video end. 等待影片結束...");
  while(rbm.running) {
    if (settings.isAutoDetectVideo && !isVideoRunning()) {
      sleep(2000);
      if (!isVideoRunning()) {
        rbm.log("影片結束，跳出");
        break;
      }
    }
    safeSleep(1000);
    if (Date.now() - videoStart > settings.waitVideoTime) {
      rbm.log("時間到結束影片");
      break;
    }
  }
  safeSleep(1500); if (!rbm.running) {return;}
  rbm.log("Click Window. 點擊視窗");
  rbm.click(Buttons.chromeWindow); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Click Menu. 點擊選單");
  rbm.click(Buttons.chromeMenu); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Close Incognito. 關閉無痕");
  rbm.click(Buttons.chromeCloseIncognito); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.click(Buttons.chromeWindow); safeSleep(sleepTime); if (!rbm.running) {return;}
  rbm.log("Close Chrome. 關閉Chrome");
  // stopChrome();
  keycode('HOME');
  safeSleep(settings.waitVideoLoad);
}

function taskPlayGame() {
  var settings = [
    {
      'target': 'hp',
      'type': 'lower',
      'threshold': 85,
      'x': 928,
      'y': 970,
    },
    {
      'target': 'mp',
      'type': 'higher',
      'threshold': 95,
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
  
  console.log('HP/MP: ', parseInt(hp), '/', parseInt(mp))
  
  for (var i = 0, len = settings.length; i < len; i++) {
    var s = settings[i];
    
    // console.log(hp, mp, JSON.stringify(s));
    if (s.target == 'hp' && s.type == 'lower' && hp <= s.threshold) {
      tap(s.x, s.y, 10);
    }
    else if (s.target == 'hp' && s.type == 'higher' && hp > s.threshold) {
      tap(s.x, s.y, 10);
    }
    else if (s.target == 'mp' && s.type == 'lower' && mp <= s.threshold) {
      tap(s.x, s.y, 10);
    }
    else if (s.target == 'mp' && s.type == 'higher' && mp > s.threshold) {
      tap(s.x, s.y, 10);
    }
  }
  
}

function start(words, videoTime, watchTimes, videoPosition) {
  stop();

  // settings.searchWords = words;

  console.log('L start')
  rbm.init();
  rbm.running = true;
  gTaskController = new TaskController();
  gTaskController.newTask('taskPlayGame', taskPlayGame, 2000, 3 * 86400);

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

// start("twice_likey_jypentertainment", 6 * 60000, 3, 2);
// startChrome();

