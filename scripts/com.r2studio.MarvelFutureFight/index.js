importJS("TaskController-0.0.1");
importJS("RBM-0.0.1");

var Config = {
  autoSameWar: false,
  autoNextWar: false,
  appName: 'com.r2studio.MarvelFutureFight',
  oriScreenWidth: 1920,
  oriScreenHeight: 1080,
  oriResizeFactor: 0.5,
  eventDelay: 1000,
  resizeFactor: 0.5,
  imageThreshold: 0.95,
};

function MarvelFutureFight() {}

MarvelFutureFight.prototype.click = function(image) {
  if (rbm.imageExists(image)) {
    rbm.imageClick(image);
    return true;
  }
  return false;
}

MarvelFutureFight.prototype.taskAutoStart = function() {
  if (this.click("StartButton.png")) {
    rbm.log('開始(綠色)');
    return;
  }

  if (Config.autoSameWar && this.click("FightAgainButton.png")) {
    rbm.log('打同一關');
    return;
  } else if (Config.autoNextWar && this.click("FightNextButton.png")) {
    rbm.log('打下一關');
    return;
  }

  if (this.click("SkipButton.png")) {
    rbm.log('跳過');
    return;
  }

  if (rbm.imageExists("RedCloseButton.png")) {
    rbm.keycode('BACK');
    rbm.log('關閉(紅色)');
    return;
  }

  if (this.click("ConfirmButton.png")) {
    rbm.log('確認(藍色)');
    return;
  }

  if (this.click("FightExitButtonSmall.png")) {
    rbm.log('離開(小)');
    return;
  }

  if (this.click("CancelButton.png")) {
    rbm.log('取消');
    return;
  }
}

MarvelFutureFight.prototype.taskAttack = function() {
  if (this.click("FightButton.png")) {
    rbm.log('自動攻擊');
    // 隨機技能攻擊
    var screenWidth = Config.oriScreenWidth;
    var screenHeight = Config.oriScreenHeight;
    var diff = 140;
    for (var y = screenHeight; y > screenHeight - diff * 3; y -= diff) {
      for (var x = screenWidth; x > screenWidth - diff * 4; x -= diff) {
        if (!rbm.running) {
          return;
        }
        rbm.click({x: x - diff / 2, y: y - diff / 2}, 1000);
      }
    }
    return;
  }
}

// ===================================================================================
var rbm;
var mff;

function stop() {
  console.log('[MARVEL 未來之戰] 停止');
  Config.autoNextWar = false;
  Config.autoSameWar = false;
  rbm.running = false;
  sleep(1000);
  gTaskController.removeAllTasks();
}

function start(taskAttack, autoSameWar, autoNextWar) {
  console.log('[MARVEL 未來之戰] 啟動');
  Config.autoSameWar = autoSameWar;
  Config.autoNextWar = autoNextWar;

  rbm = new RBM(Config);
  rbm.init();
  mff = new MarvelFutureFight();
  gTaskController = new TaskController();
  if(autoSameWar || autoNextWar){gTaskController.newTask('taskAutoStart', mff.taskAutoStart.bind(mff), 1000, 0);}
  if(taskAttack){gTaskController.newTask('taskAttack', mff.taskAttack.bind(mff), 500, 0);}

  sleep(1000);
  gTaskController.start();
};
// start(true, false, false);
// stop();

// rbm.screencrop("FightButton.png", 1700, 845, 1810, 955);
// rbm.screencrop("FightExitButtonSmall.png", 1800, 970, 1890, 1040); // 發現英雄或進階完成
// rbm.screencrop("FightNextButton.png", 1640, 960, 1870, 1040);
// rbm.screencrop("FightAgainButton.png", 1370, 960, 1600, 1040);
// rbm.screencrop("StartButton.png", 1450, 985, 1730, 1050);
// rbm.screencrop("SkipButton.png", 1680, 30, 1890, 100);
// rbm.screencrop("RedCloseButton.png", 1630, 120, 1690, 180); // 商品
// rbm.screencrop("ConfirmButton.png", 820, 960, 1090, 1030); // 神盾局升級或英雄等級提升
// rbm.screencrop("CancelButton.png", 520, 920, 800, 990); // 英雄進階