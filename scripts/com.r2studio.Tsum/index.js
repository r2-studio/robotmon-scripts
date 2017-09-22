function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var o=this.tasks[s];n-o.lastRunTime<o.interval||(null!==t?o.priority<t.priority?t=o:o.interval>t.interval?t=o:o.lastRunTime<t.lastRunTime&&(t=o):t=o)}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),0===--n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,o,i){return{name:t,run:n,interval:s||1e3,runTimes:o||0,priority:i,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,o,i){void 0===i&&(i=!1);{if("function"==typeof n){var e=this.newTaskObject(t,n,s,o,0);i&&(e.lastRunTime=Date.now()),this.updateRunInterval(e.interval);var r="system_newTask_"+t,a=this.newTaskObject(r,function(){this.tasks[t]=e}.bind(this),0,1,-20);return this.tasks[r]=a,e}console.log("Error not a function",t,n)}},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,function(){delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,function(){for(var t in this.tasks)delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};

var IS_PREPARED_TSUMS;
var runTimes = 0;

var Config = {
  debug: true,
  tsumCount: 5,
  tsumDir: 'scripts/com.r2studio.Tsum/tsums_12',
  myTsum: 'block_jacksparrow_s',
  tsumFiles: ["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_anna_s", "block_annac_s", "block_annaf_s", "block_ariel_s", "block_arielr_s", "block_arlo_s", "block_aurora_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_bb8_s", "block_beast_s", "block_beastl_s", "block_belle_s", "block_bellel_s", "block_brerrabbit_s", "block_buzz_s", "block_c3po_s", "block_charming_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chip_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_clarice_s", "block_cruella_s", "block_crush_s", "block_daisy_s", "block_daisyn_s", "block_daisyv_s", "block_daisyx_s", "block_dale_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_davyjones_s", "block_deathtrooper_s", "block_donald_s", "block_donaldn_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx_s", "block_dory_s", "block_dumbo_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsa_s", "block_elsac_s", "block_elsaf_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_finnick_s", "block_flounder_s", "block_gaston_s", "block_genie_s", "block_goofy_s", "block_goofyh2016_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_jack_s", "block_jacksparrow_s", "block_jackx_s", "block_jafar_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen_s", "block_lotso_s", "block_luke_s", "block_lukej_s", "block_lumiere_s", "block_madhatter_s", "block_madhatterj_s", "block_maleficent_s", "block_maleficentd_s", "block_marchhare_s", "block_marie_s", "block_marshmallow_s", "block_mater_s", "block_maui_s", "block_max_s", "block_mcqueen_s", "block_megara_s", "block_mickey_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeyp_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_mike_s", "block_minnie_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_oswald_s", "block_oswaldsp_s", "block_pascal_s", "block_perry_s", "block_pete_s", "block_peteb_s", "block_phillip2_s", "block_phillip_s", "block_piglet_s", "block_pinocchio_s", "block_pluto_s", "block_plutoh2015_s", "block_plutox_s", "block_pooh_s", "block_poohr_s", "block_potts_s", "block_pudding_s", "block_puffy_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_randall_s", "block_rapunzel_s", "block_rapunzelb_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite_s", "block_sora_s", "block_souffle_s", "block_stitch_s", "block_stitchf_s", "block_stitchh_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tigger_s", "block_tiggerr_s", "block_tinkerbell_s", "block_tinkerbellp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_wolf_s", "block_woody_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s"],
  rotations: ['0', '45', '90', '135', '180', '225', '270', '315'],

  colors: [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]],
  cropX: 0,
  cropY: 400,
  cropW: 1080,
  cropH: 1080,
  resizeW: 150, // 200 => 16(20), 150 => 12(15)
  resizeH: 150,
  tsumWidth: 12,
  tsumBoundW: 10, // tsumWidth / 2 + 2
  tsumBoundH: 10,
  gameContinueDelay: 450,

  tsumImages: {},
  tsumMaxScores: [],
};

// test screen 1080 * 1776

var Button = {
  gameSkillOn: {x: 160, y: 1490, color: {"a":0,"b":0,"g":220,"r":238}},
  gameRand: {x: 985, y: 1580, color: {"a":0,"b":6,"g":180,"r":232}},
  gamePause: {x: 980, y: 200, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue: {x: 670, y: 1330, color: {"a":0,"b":7,"g":176,"r":234}},
  outStart1: {x: 500, y: 1520, color: {"a":0,"b":19,"g":145,"r":247}}, // 開始遊戲
  outStart2: {x: 500, y: 1520, color: {"a":0,"b":129,"g":111,"r":236}}, // 開始
  outClose: {x: 500, y: 1520, color: {"a":0,"b":7,"g":180,"r":236}}, // 關閉
};

// init
(function(){
  var size = getScreenSize();
  Config.screenHeight = size.height;
  Config.screenWidth = size.width;
  Config.resizeWidth = Math.floor(Config.screenWidth / 3);
  Config.resizeHeight = Math.floor(Config.screenHeight / 3);
  Config.virtualButtonHeight = getVirtualButtonHeight();
  Config.hasVirtualButtonBar = true;
})();

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

function log() {
  sleep(30);
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      arguments[i] = JSON.stringify(arguments[i]);
    }
  }
  console.log.apply(console, arguments);
}

function toResizeXYs(xy) {
  return toResizeXY(xy.x, xy.y);
}

function toResizeXY(x, y) {
  var rx = Math.floor(x * Config.resizeWidth / Config.screenWidth);
  var ry = Math.floor(y * Config.resizeHeight / Config.screenHeight);
  return {x: rx, y: ry};
}

function getColor(img, xy) {
  var xy = toResizeXYs(xy);
  return getImageColor(img, xy.x, xy.y);
}

// ============== manage tsum images ===============
function prepareTsum(boardImg) {
  Config.tsumImages = loadTsumImages();
  if (Config.debug) {
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg.jpg");
  }
  Config.tsumMaxScores = getEachTsumMaxScore(Config.tsumImages, boardImg);
  Config.tsumMaxScores = Config.tsumMaxScores.splice(0, 50);
  console.log('total tsums', 'using tsums', Config.tsumMaxScores.length);
  printMaxScores(Config.tsumMaxScores);
  
  removeSameTsumImages(Config.tsumMaxScores);
  console.log('after remove same tsums', Config.tsumMaxScores.length);
  printMaxScores(Config.tsumMaxScores);
  loadTsumRotationImages(Config.tsumMaxScores);
  // recheck
  for (var i = 0; i < Config.tsumMaxScores.length && i < 8; i++) {
    for (var j = 0; j < Config.tsumMaxScores[i].rotations.length; j++) {
      var tsumImage = Config.tsumMaxScores[i].rotations[j];
      var xyScore = findImage(boardImg, tsumImage);
      if (xyScore.score > Config.tsumMaxScores[i].score) {
        Config.tsumMaxScores[i].score = xyScore.score;
      }
    }
  }
  Config.tsumMaxScores.sort(function(a, b){
    return a.score > b.score ? -1 : 1;
  });
  printMaxScores(Config.tsumMaxScores);
  IS_PREPARED_TSUMS = true;
}

function releaseTsum() {
  IS_PREPARED_TSUMS = false;
  releaseTsumRotationImages(Config.tsumMaxScores);
  releaseTsumImages(Config.tsumImages);
  Config.tsumImages = {};
  Config.tsumMaxScores = [];
}

function printMaxScores(tsumMaxScores) {
  if (Config.debug) {
    var str = "";
    for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
      str += i + ", " + tsumMaxScores[i].key + ", " + tsumMaxScores[i].score + "    ";
    }
    console.log(str);
  }
}

function getEachTsumMaxScore(tsumImages, boardImg) {
  var tsumMaxScores = [];
  for (var k in tsumImages) {
    var tsumImage = tsumImages[k];
    var xyScore = findImage(boardImg, tsumImage);
    xyScore.img = tsumImage; 
    xyScore.key = k;
    if (k == Config.myTsum) {
      xyScore.score = 1;
    }
    if (k == 'block_sulley_s') {
      xyScore.score -= 0.03;
    }
    if (k == 'block_arlo_s') {
      xyScore.score += 0.02;
    }
    tsumMaxScores.push(xyScore);
  }
  tsumMaxScores.sort(function(a, b){
    return a.score > b.score ? -1 : 1;
  });
  return tsumMaxScores;
}

function removeSameTsumImages(tsumMaxScores) {
  for (var i = 0; i < tsumMaxScores.length; i++) {
    var erase = [];
    for (var j = 0; j < tsumMaxScores.length; j++) {
      if (i == j) {
        continue;
      }
      var imgI = tsumMaxScores[i].img;
      var imgJ = tsumMaxScores[j].img;
      var score = getIdentityScore(imgI, imgJ);
      if (score > 0.87) {
        erase.push(j);
      }
    }
    for (var k = erase.length - 1; k >= 0; k--) {
      tsumMaxScores.splice(erase[k], 1);
    }
  }
  return tsumMaxScores;
}

function loadTsumRotationImages(tsumMaxScores) {
  var tsumPath = getStoragePath() + '/' + Config.tsumDir;
  for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
    // console.log(i, tsumMaxScores[i].score);
    if (Config.debug) {
      saveImage(tsumMaxScores[i].img, getStoragePath() + "/tmp/tsum" + i + ".jpg");
    }
  }
  for (var i = 0; i < 8 && i < tsumMaxScores.length; i++) {
    tsumMaxScores[i].rotations = [];
    var maxScore = tsumMaxScores[i];
    for (var r in Config.rotations) {
      var filename = tsumPath + '/' + maxScore.key + '_' + Config.rotations[r] + '.png';
      var img = openImage(filename);
      tsumMaxScores[i].rotations.push(img);
    }
  }
}

function loadTsumImages() {
  var tsumImages = {};
  var tsumPath = getStoragePath() + '/' + Config.tsumDir;
  for (var i in Config.tsumFiles) {
    var key = Config.tsumFiles[i];
    var filename = tsumPath + '/' + key + '_0.png';
    var img = openImage(filename);
    tsumImages[key] = img;
    // console.log('load', tsumImages[key], filename);
  }
  return tsumImages;
}

function releaseTsumRotationImages(tsumMaxScores) {
  for (var i = 0; i < 5 && i < tsumMaxScores.length; i++) {
    for (var r in tsumMaxScores[i].rotations) {
      releaseImage(tsumMaxScores[i][r]);
    }
  }
}

function releaseTsumImages(tsumImages) {
  for (var k in tsumImages) {
    releaseImage(tsumImages[k]);
  }
}

function usingTimeString(startTime) {
  return 'usingTime: ' + (Date.now() - startTime);
}

// ============== control auto play logic ===============

function link(paths) {
  for (var i in paths) {
    var path = paths[i];
    for (var j in path) {
      var point = path[j];
      var x = Math.floor(Config.cropX + (point.x + Config.tsumWidth/2) * Config.cropW / Config.resizeW);
      var y = Math.floor(Config.cropY + (point.y + Config.tsumWidth/2) * Config.cropH / Config.resizeH);
      if (j == 0) {
        tapDown(x, y, 50);
      }
      moveTo(x, y, 30);
      moveTo(x, y, 30);
      if (j == path.length - 1) {
        tapUp(x, y, 60);
      }
    }
  }
}

function getDistance(t1, t2) {
  return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));
}

function findNearTsum(tsum, tsums) {
  var minDis = 99999;
  var minTsum = null;
  var idx = -1;
  for(var i in tsums) {
    var dis = getDistance(tsum, tsums[i]);
    if (dis < minDis) {
      minDis = dis;
      minTsum = tsums[i];
      idx = i;
    }
  }
  return {dis: minDis, tsum: minTsum, idx: idx};
}

function calculateNearTsumPaths(tsum, ts) {
  var path = [];
  var tsums = ts.slice(); // copy array
  while(true) {
    var result = findNearTsum(tsum, tsums);
    var minDis = result.dis;
    var minTsum = result.tsum;
    var minIdx = result.idx;
    if (minIdx == -1 || minDis > Config.resizeW/5) {
      break;
    }
    tsum = minTsum;
    tsums.splice(minIdx, 1);
    path.push(tsum);
  }
  return path;
}

function calculatePathCenter(path) {
  var cx = 0;
  var cy = 0;
  for (var i in path) {
    cx += path[i].x;
    cy += path[i].y;
  }
  return {x: Math.floor(cx / path.length), y: Math.floor(cy / path.length)};
}

function calculatePaths(board) {
  var tsums = {};
  for (var i in board) {
    var tsum = board[i];
    if (tsums[tsum.tsumIdx] == undefined) {
      tsums[tsum.tsumIdx] = [];
    }
    tsums[tsum.tsumIdx].push(tsum);
  }

  var centers = {};
  var paths = [];
  
  for (var tsumIdx in tsums) {
    for (var i = 0; i < tsums[tsumIdx].length; i++) {
      var path = calculateNearTsumPaths(tsums[tsumIdx][i], tsums[tsumIdx]);
      if (path.length > 2) {
        var c = calculatePathCenter(path);
        if (centers[c.x] == c.y) {
          // path already exists
        } else {
          centers[c.x] = c.y;
          paths.push(path);
          // console.log(runTimes, tsumIdx, path.length, c.x, c.y, JSON.stringify(path));
        }
      } else {
        tsums[tsumIdx].splice(i, 1);
        i--;
      }
    }
  }

  paths.sort(function(a, b) {
    if (a.length < b.length) { return 1; }
    return -1;
  });
  log('計算出路徑', paths.length, '條');
  return paths;
}

// ============== control tasks ===============

function Tsum() {
  this.isRunning = true;
}

Tsum.prototype.screenshot = function() {
  return getScreenshotModify(0, 0, 0, 0, Config.resizeWidth, Config.resizeHeight, 80);
}

Tsum.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  tap(Math.round(xy.x), Math.round(xy.y), during);
}

Tsum.prototype.goToHome = function(during) {
  if (during === undefined) {
    during = 60 * 1000;
  }
  tapUp(0, 0);
  var start = Date.now();
  while(this.isRunning) {
    // log('檢查室是否在遊戲中');
    var img = this.screenshot();
    var isCloseBtn = isSameColor(Button.outClose.color, getColor(img, Button.outClose));
    var isStart1Btn = isSameColor(Button.outStart1.color, getColor(img, Button.outStart1));
    var isStart2Btn = isSameColor(Button.outStart2.color, getColor(img, Button.outStart2));
    var isGameRandBtn = isSameColor(Button.gameRand.color, getColor(img, Button.gameRand));
    var isGamePauseBtn = isSameColor(Button.gamePause.color, getColor(img, Button.gamePause));
    var isGameContinue = isSameColor(Button.gameContinue.color, getColor(img, Button.gameContinue));
    releaseImage(img);
    // console.log(isCloseBtn, isStart1Btn, isStart2Btn, isGameRandBtn, isGamePauseBtn, isGameContinue);
    if (isStart1Btn) {
      return;
    } else if (isCloseBtn) {
      this.tap(Button.outClose);
    } else if (isStart2Btn) {
      this.tap(Button.gameSkillOn); // same as 返回
    } else if (isGameRandBtn && isGamePauseBtn) {
      log('in game');
      return;
    } else if (isGameContinue) {
      log('in game');
      return;
    } else {
      this.tap(Button.gameSkillOn); // same as 返回
    }
    if (Date.now() - start > during) {
      return;
    }
    sleep(1000);
  }
}

Tsum.prototype.isInGame = function() {
  for (var i = 0; i < 10; i++) {
    var img = this.screenshot();
    var isCloseBtn = isSameColor(Button.outClose.color, getColor(img, Button.outClose));
    var isStart1Btn = isSameColor(Button.outStart1.color, getColor(img, Button.outStart1));
    var isStart2Btn = isSameColor(Button.outStart2.color, getColor(img, Button.outStart2));
    var isGameRandBtn = isSameColor(Button.gameRand.color, getColor(img, Button.gameRand));
    var isGamePauseBtn = isSameColor(Button.gamePause.color, getColor(img, Button.gamePause));
    var isGameContinue = isSameColor(Button.gameContinue.color, getColor(img, Button.gameContinue));
    releaseImage(img);
    if (isGameContinue) {
      return true;
    } else if (isGameRandBtn && isGamePauseBtn) {
      return true;
    } else if (isCloseBtn || isStart1Btn || isStart2Btn) {
      return false;
    }
    sleep(100);
  }
  return false;
}

Tsum.prototype.run = function() {
  var startTime = Date.now();
  if (!IS_PREPARED_TSUMS) {
    this.tap(Button.gameContinue);
    sleep(Config.gameContinueDelay);
    log('辨識Tsum種類');
    var boardImg = getScreenshotModify(Config.cropX, Config.cropY, Config.cropW, Config.cropH, Config.resizeW, Config.resizeH, 100);
    this.tap(Button.gamePause);
    prepareTsum(boardImg);
    releaseImage(boardImg);
    this.tap(Button.gameContinue);
    sleep(Config.gameContinueDelay);
    log('辨識Tsum種類時間', usingTimeString(startTime));
  }
  if (Config.debug) {
    printMaxScores(Config.tsumMaxScores);
  }
  var boardImg = getScreenshotModify(Config.cropX, Config.cropY, Config.cropW, Config.cropH, Config.resizeW, Config.resizeH, 100);
  var boardTsums = [];

  this.tap(Button.gamePause);
  log('辨識盤面Tsum...');
  for (var i = 0; i < Config.tsumCount && i < Config.tsumMaxScores.length; i++) {
    for (var j = 0; j < Config.rotations.length; j++) {
      var rotatedImage = Config.tsumMaxScores[i].rotations[j];
      var scoreLimit = (Config.tsumMaxScores[i].score - 0.5) * 0.7;
      var results = findImages(boardImg, rotatedImage, scoreLimit, 15, true);
      // console.log(JSON.stringify(results));
      for (var k in results) {
        var result = results[k];
        boardTsums.push({
          tsumIdx: i,
          // tsum: tsumMaxScores[i],
          x: result.x,
          y: result.y,
          score: result.score,
        });
      }
    }
  }
  boardTsums.sort(function(a, b){return a.score > b.score ? -1 : 1;});
  // console.log('finding all rotated tsum in board', boardTsums.length, usingTimeString(startTime));
  
  var board = [];
  for (var i in boardTsums) {
    var boardTsum = boardTsums[i];
    var isExist = false;
    for (var j in board) {
      var bt = board[j];
      if (boardTsum.x >= (bt.x - Config.tsumBoundW) && boardTsum.x < (bt.x + Config.tsumBoundW) && boardTsum.y >= (bt.y - Config.tsumBoundH) && boardTsum.y < (bt.y + Config.tsumBoundH)) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      board.push(boardTsum);
    }
  }
  log('辨識盤面Tsum成功數量', board.length, '費時', usingTimeString(startTime));
  // console.log('find tsums in board', board.length, usingTimeString(startTime));
  if (Config.debug) {
    for (var i = 0; i < board.length; i++) {
      var boardTsum = board[i];
      drawCircle(boardImg, boardTsum.x + Config.tsumWidth/2, boardTsum.y + Config.tsumWidth/2, 1, Config.colors[boardTsum.tsumIdx][0], Config.colors[boardTsum.tsumIdx][1], Config.colors[boardTsum.tsumIdx][2], 0);
    }
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg-" + runTimes + ".jpg");
  }
  releaseImage(boardImg);
  runTimes++;
  return board;
}

Tsum.prototype.taskPlayGame = function() {
  log('開始遊戲...');
  if (!this.isInGame()) {
    this.goToHome();
    for (var i = 0; i < 5; i++) {
      sleep(1000);
      this.tap(Button.outStart1, 100);
    }
    sleep(1000);
  }
  // wait for starting game
  for (var i = 0; i < 20; i++) {
    if (this.isInGame()) {
      break;
    }
    sleep(500);
  }
  log('遊戲中');
  sleep(1000);
  var pathZero = 0;
  // start to run
  while(this.isRunning) {
    var board = this.run(); // will pause game
    log('計算連線路徑');
    var paths = calculatePaths(board);
    if (paths.length < 2) {
      pathZero++;
      if (pathZero > 2) {
        pathZero = 0;
        log('路徑數量為 0, 重新辨識...');
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
        sleep(1000);
        releaseTsum();
        continue;
      }
      pathZero = 0;
    }
    this.tap(Button.gameContinue);
    sleep(Config.gameContinueDelay);
    log('開始連線');
    link(paths);
    
    if (!this.isInGame()) {
      log('遊戲結束');
      break;
    }
    this.tap(Button.gameRand, 100);
    this.tap(Button.gameRand, 100);
    sleep(1000);

    var img = this.screenshot();
    var isSkillOn = isSameColor(Button.gameSkillOn.color, getColor(img, Button.gameSkillOn));
    releaseImage(img);
    if (isSkillOn) {
      log('技能已經存滿，放技能');
      this.tap(Button.gameSkillOn);
      sleep(2500);
    }
    this.tap(Button.gameSkillOn);
  }
  releaseTsum();
}

var tsumObj;
var ef;

function start() {
  stop();
  sleep(1000);
  tsumObj = new Tsum();
  while(tsumObj.isRunning) {
    tsumObj.taskPlayGame();
    sleep(5000);
  }
}

function stop() {
  if (tsumObj !== undefined) {
    tsumObj.isRunning = false;
  }
  if (IS_PREPARED_TSUMS) {
    releaseTsum();
  }
}