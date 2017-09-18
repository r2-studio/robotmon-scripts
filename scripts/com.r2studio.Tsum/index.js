var IS_TSUM_LOAD;
var IS_PREPARED_TSUMS;

var Config = {
  tsumCount: 5,
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
  var tsumFiles=["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010","P011","P012","P013","P014","P015","P016","P017","P018","P019","P020","P021","P022","P023","P024","P025","P026","P027","P028","P029","P030","P031","P032","P033","P034","P035","P036","P037","P038","P039","P052","P041","P042","P043","P044","P045","P046","P047","P048","P049","P050","P051","P052","P053","P054","P055","P056","P057","P058","P059","P060","P061","P062","P063","P064","P065","P066","P067","P068","P069","P072","P073","P074","P075","P076","P077","P078","P079","P080","P081","P082","P083","P084","P085","P086","P087","P088","P089","P090","P091","P092","P093","P094","P095","P096","P097","P098","P099","P100","P101","P102","P103","P104","P105","P106","P107","P108","P109","P110","P111","P112","P113","P114","P115","P116","P117","P118","P119","P120","P121","P122","h01","h02","h03","h04","h05","h06","h07","h08","h09","h10","h11","h12","h13","h14","h15"];
  var rotations = ['0', '45', '90', '135', '180', '225', '270', '315'];
  
  var colors = [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]];

  var cropX = 0;
  var cropY = 400;
  var cropW = 1080;
  var cropH = 1080;
  var resizeW = 135;
  var resizeH = 135;
  var tsumBoundW = 9;
  var tsumBoundH = 9;

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
        if (score > 0.6) {
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
    var tsumPath = getStoragePath() + '/tsum_15';
    for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
      console.log(i, tsumMaxScores[i].score);
      saveImage(tsumMaxScores[i].img, getStoragePath() + "/tmp/tsum" + i + ".jpg");
      sleep(50);
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
    var tsumPath = getStoragePath() + '/tsum_15';
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

    var boardImg = getScreenshotModify(cropX, cropY, cropW, cropH, resizeW, resizeH, 90);
    var boardTsums = [];

    for (var i = 0; i < Config.tsumCount && i < tsumMaxScores.length; i++) {
      for (var j = 0; j < rotations.length; j++) {
        var rotatedImage = tsumMaxScores[i].rotations[j];
        var scoreLimit = tsumMaxScores[i].score * 0.8;
        var results = findImages(boardImg, rotatedImage, scoreLimit, 12, true);
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
      drawCircle(boardImg, boardTsum.x + 7, boardTsum.y + 7, 1, colors[boardTsum.tsumIdx][0], colors[boardTsum.tsumIdx][1], colors[boardTsum.tsumIdx][2], 0);
    }
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg2.jpg");
    releaseImage(boardImg);
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
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg.jpg");

    tsumMaxScores = getEachTsumMaxScore(tsumImages, boardImg);
    tsumMaxScores = tsumMaxScores.splice(0, 30);
    console.log('total tsums', 'using tsums', tsumMaxScores.length);
    printMaxScores(tsumMaxScores);
    
    removeSameTsumImages(tsumMaxScores);
    console.log('after remove same tsums', tsumMaxScores.length);
    printMaxScores(tsumMaxScores);
    loadTsumRotationImages(tsumMaxScores); 
    releaseImage(boardImg);
    IS_PREPARED_TSUMS = true;
  }
}

tap(552, 1330, 100);
sleep(500);

for (var k = 0; k < 5; k++) {
  // prepareTsum();
  var board = run();
  var paths = calculatePaths(board);
  link(paths);
  tap(160, 1550, 100);
  tap(920, 1550, 100);
  // sleep(200);
}

tap(920, 1550, 100);
sleep(600);

function link(paths) {
  for (var i in paths) {
    var path = paths[i];
    for (var j in path) {
      var point = path[j];
      var x = Math.floor(cropX + (point.x + 7) * cropW / resizeW);
      var y = Math.floor(cropY + (point.y + 7) * cropH / resizeH);
      // console.log(x, y);
      if (j == 0) {
        tapDown(x, y, 100);
      }
      moveTo(x, y, 100);
      if (j == path.length - 1) {
        tapUp(x, y, 100);
      }
    }
    sleep(100);
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
    if (minIdx == -1 || minDis > 26) {
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
          console.log(tsumIdx, path.length, c.x, c.y, JSON.stringify(path));
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
