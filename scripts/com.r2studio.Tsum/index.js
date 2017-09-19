var IS_TSUM_LOAD;
var IS_PREPARED_TSUMS;

var Config = {
  tsumCount: 5,
  tsumDir: 'tsums_12',
}; 

function refreshCode() {
  if (IS_TSUM_LOAD) {
    IS_TSUM_LOAD = false;
    if (IS_PREPARED_TSUMS) {
      releaseTsum();
    }
  }
}

refreshCode();

if (IS_TSUM_LOAD === true) {
  console.log('plugin script alread load');
  // do nothing
} else {
  IS_TSUM_LOAD = true;

  // const parameters
  var tsumFiles=["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_anna_s", "block_annac_s", "block_annaf_s", "block_ariel_s", "block_arielr_s", "block_arlo_s", "block_aurora_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_bb8_s", "block_beast_s", "block_beastl_s", "block_belle_s", "block_bellel_s", "block_brerrabbit_s", "block_buzz_s", "block_c3po_s", "block_charming_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chip_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_clarice_s", "block_cruella_s", "block_crush_s", "block_daisy_s", "block_daisyn_s", "block_daisyv_s", "block_daisyx_s", "block_dale_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_davyjones_s", "block_deathtrooper_s", "block_donald_s", "block_donaldn_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx_s", "block_dory_s", "block_dumbo_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsa_s", "block_elsac_s", "block_elsaf_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_finnick_s", "block_flounder_s", "block_gaston_s", "block_genie_s", "block_goofy_s", "block_goofyh2016_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_jack_s", "block_jacksparrow_s", "block_jackx_s", "block_jafar_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen_s", "block_lotso_s", "block_luke_s", "block_lukej_s", "block_lumiere_s", "block_madhatter_s", "block_madhatterj_s", "block_maleficent_s", "block_maleficentd_s", "block_marchhare_s", "block_marie_s", "block_marshmallow_s", "block_mater_s", "block_maui_s", "block_max_s", "block_mcqueen_s", "block_megara_s", "block_mickey_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeyp_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_mike_s", "block_minnie_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_oswald_s", "block_oswaldsp_s", "block_pascal_s", "block_perry_s", "block_pete_s", "block_peteb_s", "block_phillip2_s", "block_phillip_s", "block_piglet_s", "block_pinocchio_s", "block_pluto_s", "block_plutoh2015_s", "block_plutox_s", "block_pooh_s", "block_poohr_s", "block_potts_s", "block_pudding_s", "block_puffy_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_randall_s", "block_rapunzel_s", "block_rapunzelb_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite_s", "block_sora_s", "block_souffle_s", "block_stitch_s", "block_stitchf_s", "block_stitchh_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tigger_s", "block_tiggerr_s", "block_tinkerbell_s", "block_tinkerbellp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_wolf_s", "block_woody_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s"];
  var rotations = ['0', '45', '90', '135', '180', '225', '270', '315'];
  
  var colors = [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]];

  var cropX = 0;
  var cropY = 400;
  var cropW = 1080;
  var cropH = 1080;
  var resizeW = 150; // 200 => 16(20), 150 => 12(15)
  var resizeH = 150;
  var tsumWidth = 12;
  var tsumBoundW = 10; // tsumWidth / 2 + 2
  var tsumBoundH = 10;

  var tsumImages;
  var tsumMaxScores;

  function printMaxScores(tsumMaxScores) {
    var str = "";
    for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
      str += i + ", " + tsumMaxScores[i].key + ", " + tsumMaxScores[i].score + "    ";
    }
    console.log(str);
  }

  function getEachTsumMaxScore(tsumImages, boardImg) {
    var tsumMaxScores = [];
    for (var k in tsumImages) {
      var tsumImage = tsumImages[k];
      var xyScore = findImage(boardImg, tsumImage);
      xyScore.img = tsumImage; 
      xyScore.key = k;
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
        if (score > 0.85) {
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
      console.log(i, tsumMaxScores[i].score);
      saveImage(tsumMaxScores[i].img, getStoragePath() + "/tmp/tsum" + i + ".jpg");
    }
    for (var i = 0; i < 5 && i < tsumMaxScores.length; i++) {
      tsumMaxScores[i].rotations = [];
      var maxScore = tsumMaxScores[i];
      for (var r in rotations) {
        var filename = tsumPath + '/' + maxScore.key + '_' + rotations[r] + '.png';
        var img = openImage(filename);
        tsumMaxScores[i].rotations.push(img);
      }
    }
  }

  function loadTsumImages() {
    var tsumImages = {};
    var tsumPath = getStoragePath() + '/' + Config.tsumDir;
    for (var i in tsumFiles) {
      var key = tsumFiles[i];
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

  function run() {
    var startTime = Date.now();
    if (!IS_PREPARED_TSUMS) {
      console.log('prepare tsums...');
      prepareTsum();
      console.log('prepare tsums', usingTimeString(startTime));
    }
    printMaxScores(tsumMaxScores);

    var boardImg = getScreenshotModify(cropX, cropY, cropW, cropH, resizeW, resizeH, 100);
    var boardTsums = [];

    tap(920, 210, 50);

    for (var i = 0; i < Config.tsumCount && i < tsumMaxScores.length; i++) {
      for (var j = 0; j < rotations.length; j++) {
        var rotatedImage = tsumMaxScores[i].rotations[j];
        var scoreLimit = tsumMaxScores[i].score * 0.65;
        var results = findImages(boardImg, rotatedImage, scoreLimit, 13, true);
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
    console.log('finding all rotated tsum in board', boardTsums.length, usingTimeString(startTime));
    
    var board = [];
    for (var i in boardTsums) {
      var boardTsum = boardTsums[i];
      var isExist = false;
      for (var j in board) {
        var bt = board[j];
        if (boardTsum.x >= (bt.x - tsumBoundW) && boardTsum.x < (bt.x + tsumBoundW) && boardTsum.y >= (bt.y - tsumBoundH) && boardTsum.y < (bt.y + tsumBoundH)) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        board.push(boardTsum);
      }
    }
    console.log('find tsums in board', board.length, usingTimeString(startTime));
    
    for (var i = 0; i < board.length; i++) {
      var boardTsum = board[i];
      drawCircle(boardImg, boardTsum.x + tsumWidth/2, boardTsum.y + tsumWidth/2, 1, colors[boardTsum.tsumIdx][0], colors[boardTsum.tsumIdx][1], colors[boardTsum.tsumIdx][2], 0);
    }
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg2.jpg");
    releaseImage(boardImg);

    tap(552, 1330, 100);
    sleep(500);

    return board;
  }

  function releaseTsum() {
    IS_PREPARED_TSUMS = false;
    releaseTsumRotationImages(tsumMaxScores);
    releaseTsumImages(tsumImages);
    tsumImages = {};
    tsumMaxScores = [];
  }

  function prepareTsum() {
    tsumImages = loadTsumImages();

    var boardImg = getScreenshotModify(cropX, cropY, cropW, cropH, resizeW, resizeH, 100);
    
    tap(920, 210, 50);

    saveImage(boardImg, getStoragePath() + "/tmp/boardImg.jpg");

    tsumMaxScores = getEachTsumMaxScore(tsumImages, boardImg);
    tsumMaxScores = tsumMaxScores.splice(0, 50);
    console.log('total tsums', 'using tsums', tsumMaxScores.length);
    printMaxScores(tsumMaxScores);
    
    removeSameTsumImages(tsumMaxScores);
    console.log('after remove same tsums', tsumMaxScores.length);
    printMaxScores(tsumMaxScores);
    loadTsumRotationImages(tsumMaxScores); 
    releaseImage(boardImg);
    IS_PREPARED_TSUMS = true;
    
    tap(552, 1330, 100);
    sleep(300);
  }
}

tap(552, 1330, 100);
sleep(600);

for (var k = 0; k < 15; k++) {
  // prepareTsum();
  var board = run();
  var paths = calculatePaths(board);
  link(paths);
  tap(160, 1550, 30);
  tap(920, 1550, 60);
  tap(920, 1550, 60);
  sleep(900);
}

tap(920, 1550, 100);
sleep(300);

function link(paths) {
  for (var i in paths) {
    var path = paths[i];
    for (var j in path) {
      var point = path[j];
      var x = Math.floor(cropX + (point.x + tsumWidth/2) * cropW / resizeW);
      var y = Math.floor(cropY + (point.y + tsumWidth/2) * cropH / resizeH);
      if (j == 0) {
        tapDown(x, y, 60);
      }
      moveTo(x, y, 40);
      moveTo(x, y, 40);
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
    if (minIdx == -1 || minDis > resizeW/5) {
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
          // console.log(tsumIdx, path.length, c.x, c.y, JSON.stringify(path));
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
  return paths;
}

// console.log(tsumMaxScores);

sleep(500);
tap(920, 210, 50);
