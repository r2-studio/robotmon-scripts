// Import RBM library
importJS('RBM-0.0.2');
importJS("TaskController-0.0.1");

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

var Buttons = {
  chromeMenu: {x: 1350, y: 215},
  chromeWindow: {x: 1170, y: 215},
  chromeURL: {x: 720, y: 215},
  chromeNewIncognito: {x: 850, y: 415},
  chromeCloseIncognito: {x: 850, y: 597},
  chromeURL: {x: 720, y: 215},
  youtubeSearchIcon: {x: 1230, y: 405},
  youtubeSearchGo: {x: 1350, y: 405},
  youtubeSearch: {x: 800, y: 405},
  youtubeVideoPositions: [
    {x: 370, y: 1060},
    {x: 370, y: 1555},
    {x: 370, y: 2015},
    {x: 370, y: 2380},
  ],
  youtubeInVideo: [
    {x: 280, y: 420},
    {x: 1120, y: 420},
    {x: 280, y: 900},
    {x: 1120, y: 900},
    {x: 700, y: 660},
    {x: 900, y: 800},
  ],
};

var settings = {
  youtubeURL: "m.youtube.com",
  searchWords: "twice",
  waitVideoTime: 10 * 1000,
  waitVideoLoad: 4 * 1000,
  isAutoDetectVideo: true,
  airplaneOnX: 100,
  airplaneOnY: 100, 
  airplaneOffX: 100,
  airplaneOffY: 100,
  watchTimes: 0,
  videoPosition: 0,
  toggleAirplainTimes: 0,
  count: 0,
};

var gTaskController;
var rbm = new RBM(config);

function startChrome() {
  rbm.startApp("com.android.chrome", "com.google.android.apps.chrome.Main");
}

function stopChrome() {
  rbm.stopApp("com.android.chrome");
}

function stopApp() {
  keycode('KEYCODE_APP_SWITCH');
  sleep(1000);
  keycode('KEYCODE_DEL');
  safeSleep(1000);
  keycode('HOME');
  safeSleep(1000);
}

function airplaneOn() {
  rbm.log("開關 3g/4g 網路 等候 15秒");
  rbm.startApp("com.android.settings", ".RadioInfo");
  safeSleep(14000);
  rbm.stopApp("com.android.settings");
  stopApp();
}

function airplaneOff() {
  rbm.log("開關 3g/4g 網路 等候 15秒");
  rbm.startApp("com.android.settings", ".RadioInfo");
  safeSleep(14000);
  rbm.stopApp("com.android.settings");
  stopApp();
}

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

function isVideoRunning() {
  var colors = [];
  var cImg = getScreenshot();
  for (var i = 0; i < Buttons.youtubeInVideo.length; i++) {
    var btn = Buttons.youtubeInVideo[i];
    colors.push(getImageColor(cImg, btn.x, btn.y));
  }
  releaseImage(cImg);
  sleep(1000);
  cImg = getScreenshot();
  for (var i = 0; i < Buttons.youtubeInVideo.length; i++) {
    var btn = Buttons.youtubeInVideo[i];
    if (!isSameColor(colors[i], getImageColor(cImg, btn.x, btn.y), 10)) {
      releaseImage(cImg);
      return true;
    }
  }
  releaseImage(cImg);
  return false;
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
  keycode('HOME');
  safeSleep(settings.waitVideoLoad);
  settings.count++;
  stopApp();

  if (settings.toggleAirplainTimes > 0 && (settings.count % settings.toggleAirplainTimes) == 0) {
    rbm.log("重啟 3g/4g網路");
    airplaneOff();
    sleep(7000);
    airplaneOn();
    sleep(3000);
  }
}

function taskChangeIp() {
  rbm.log("Turn off 3G. 7 sec. 關閉行動網路 等7秒");
  airplaneOff();
  safeSleep(7000);
  rbm.log("Turn on 3G. 7 sec. 開啟行動網路 等7秒");
  airplaneOn();
  safeSleep(7000);
}

function start(words, videoTime, watchTimes, videoPosition, isAutoDetect, airplaneTimes) {
  stop();

  settings.searchWords = words;
  settings.waitVideoTime = videoTime;
  settings.videoPosition = (+videoPosition) - 1;
  settings.isAutoDetectVideo = isAutoDetect;
  settings.toggleAirplainTimes = airplaneTimes;

  rbm.init();
  rbm.running = true;
  gTaskController = new TaskController();
  gTaskController.newTask('taskWatchVideo', taskWatchVideo, 2000, watchTimes);

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
// start("twice_likey_jypentertainment", 6 * 60000, 3, 2, 1);
// startChrome();