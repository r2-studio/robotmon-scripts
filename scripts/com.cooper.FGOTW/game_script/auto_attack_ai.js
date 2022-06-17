//servant
var servantExistImage;
var initServant = [];
var servantInited;
var servantAliveX = [150, 622, 1102];
var servantAliveY = 600;
var servantAliveW = 300;
var servantAliveH = 150;

var servantExistX = [166, 642, 1122];
var servantExistY = 1010;
var servantExistWidth = 37;
var servantExistHeight = 18;

//skill
var skillUsedImage;
var skillUsedPositionOffset = [-9, 77];
var skillUsedSize = 24;
var skillUsedInLoop = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

//card
var cardImage = [];

var servantAliveMessage;
var cardList = [];
var cardStatus = []; // -1:null 0:disable 1:weak 2:resist
var cardWidth = 225;
var cardHeight = 75;

var cardListX = [94, 478, 861, 1248, 1638];
var cardListY = 608;
var cardMoveRange = 102;
var cardColorOffset = [0, 124];

var cardListOffsetWeakX = 172;
var cardListOffsetWeakY = -120;
var weakW = 75;
var weakH = 22;

var offsetDisableX = [82, 195];
var offsetDisableY = -67;
var disableW = 45;
var disableH = 45;

var clothSkillUsed = [];

/*
//ult
var ultList = [];
var ultCheckX = [682,1146,1612];
var ultCheckY = 285;
var ultWidth = 280;
var ultHeight = 300;
var ultLightnessOffset = 140;

var allServentDieFlag = false;
*/
function setAutoAttackMargin() {
  if (server == "TW") {
    skillUsedPositionOffset = [6, 85];
    offsetDisableX = [89, 196];
    return;
  }
}

function autoAttack(
  until,
  mainColor,
  sameColor,
  weak,
  die,
  p0ult,
  p0s0,
  p0t0,
  p0s1,
  p0t1,
  p0s2,
  p0t2,
  p1ult,
  p1s0,
  p1t0,
  p1s1,
  p1t1,
  p1s2,
  p1t2,
  p2ult,
  p2s0,
  p2t0,
  p2s1,
  p2t1,
  p2s2,
  p2t2,
  ultColor,
  ctime0,
  ctarget0,
  ctime1,
  ctarget1,
  ctime2,
  ctarget2
) {
  var ult = [];
  ult[0] = p0ult;
  ult[1] = p1ult;
  ult[2] = p2ult;
  var ps0 = [];
  ps0[0] = p0s0;
  ps0[1] = p0s1;
  ps0[2] = p0s2;
  var ps1 = [];
  ps1[0] = p1s0;
  ps1[1] = p1s1;
  ps1[2] = p1s2;
  var ps2 = [];
  ps2[0] = p2s0;
  ps2[1] = p2s1;
  ps2[2] = p2s2;

  var pt0 = [];
  pt0[0] = p0t0;
  pt0[1] = p0t1;
  pt0[2] = p0t2;
  var pt1 = [];
  pt1[0] = p1t0;
  pt1[1] = p1t1;
  pt1[2] = p1t2;
  var pt2 = [];
  pt2[0] = p2t0;
  pt2[1] = p2t1;
  pt2[2] = p2t2;

  var p0 = [];
  p0[0] = ps0;
  p0[1] = pt0;
  var p1 = [];
  p1[0] = ps1;
  p1[1] = pt1;
  var p2 = [];
  p2[0] = ps2;
  p2[1] = pt2;

  var skill = [];
  skill[0] = p0;
  skill[1] = p1;
  skill[2] = p2;

  clothSkillUsed = [false, false, false];
  var c0 = [];
  c0[0] = ctime0 == undefined ? -1 : ctime0;
  c0[1] = ctarget0 == undefined ? -1 : ctarget0;
  var c1 = [];
  c1[0] = ctime1 == undefined ? -1 : ctime1;
  c1[1] = ctarget1 == undefined ? -1 : ctarget1;
  var c2 = [];
  c2[0] = ctime2 == undefined ? -1 : ctime2;
  c2[1] = ctarget2 == undefined ? -1 : ctarget2;

  var clothSkill = [];
  clothSkill[0] = c0;
  clothSkill[1] = c1;
  clothSkill[2] = c2;

  servantInited = false;
  servantAliveMessage = [true, true, true];
  skillUsedInLoop = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  loadAllImage();

  var lastStage = -1;
  while (true) {
    if (!isScriptRunning) {
      break;
    }
    if (!waitUntilPlayerCanMoveOrFinish()) {
      if (isScriptRunning) {
        console.log("關卡完成，自動戰鬥結束");
      } else {
        console.log("手動停止腳本");
      }
      break;
    }
    sleep(1000);
    var currentStage = getCurrentStage();
    if (until != 0 && until <= currentStage) {
      console.log("進入第" + (currentStage + 1) + "波，自動戰鬥結束");
      break;
    }
    if (lastStage < currentStage) {
      lastStage = currentStage;
      console.log("進入第" + (currentStage + 1) + "波");
      if (getUserPlan() == 2) {
        sendNormalMessage(runningScriptName, "Wave " + (lastStage + 1));
      }
    }
    attackAI(
      mainColor,
      sameColor,
      weak,
      die,
      clothSkill,
      ult,
      skill,
      currentStage
    );
    if (until == 0) {
      console.log("一回合完成，自動戰鬥結束");
      break;
    }
    sleep(5000);
  }
  releaseAllImage();
}

function attackAI(
  mainColor,
  sameColor,
  weak,
  die,
  clothSkill,
  ult,
  skill,
  currentStage
) {
  console.log("自動戰鬥 新回合開始");
  var screenshot = getScreenshotResize();
  var servantAlive =
    die == 3 ? [true, true, true] : updateServantAlive(screenshot);
  var skillUsed = updateSkillUsed(screenshot);
  var servantExist = updateServantExist(screenshot);
  releaseImage(screenshot);
  for (var i = 0; i < 3; i++) {
    if (!isScriptRunning) {
      return;
    }
    if (
      !clothSkillUsed[i] &&
      clothSkill[i][0] >= 0 &&
      currentStage >= clothSkill[i][0]
    ) {
      useClothesSkill(i, clothSkill[i][1]);
      clothSkillUsed[i] = true;
    }
  }
  for (var i = 0; i < 3; i++) {
    for (var j = 2; j >= 0; j--) {
      if (!isScriptRunning) {
        return;
      }
      if (!servantAlive[i]) {
        switch (die) {
          case 0:
            isScriptRunning = false;
            console.log("從者退場，停止腳本");
            sendUrgentMessage(runningScriptName, "從者退場，停止腳本");
            return;
          case 1:
            if (!skillUsed[i * 3 + j] && servantExist[i]) {
              useSkill(i, j, skill[i][1][j], false);
            }
            break;
          case 2:
            break;
        }
      } else if (
        skill[i][0][j] >= 0 &&
        currentStage >= skill[i][0][j] &&
        !skillUsed[i * 3 + j]
      ) {
        useSkill(i, j, skill[i][1][j], false);
      }
    }
  }
  startAttack();
  updateCardList();
  // updateUltList();
  selectCards(sameColor, weak, mainColor, ult, currentStage);
}

//image---------------------------------------------
function loadAllImage() {
  cardImage[0] = openImage(imagePath + "cardListB.png");
  cardImage[1] = openImage(imagePath + "cardListN.png");
  cardImage[2] = openImage(imagePath + "cardListQ.png");
  cardImage[3] = openImage(imagePath + "cardWeak.png");
  cardImage[4] = openImage(imagePath + "cardResist.png");
  cardImage[5] = openImage(imagePath + "cardDisable1.png");
  cardImage[6] = openImage(imagePath + "cardDisable2.png");
  skillUsedImage = openImage(imagePath + "skillUsed.png");
  servantExistImage = openImage(imagePath + "servantExist.png");
}

function releaseAllImage() {
  if (servantInited) {
    for (var i = 0; i < 3; i++) {
      releaseImage(initServant[i]);
    }
  }
  for (var i = 0; i < 7; i++) {
    releaseImage(cardImage[i]);
  }
  releaseImage(skillUsedImage);
  releaseImage(servantExistImage);
}

//servant-------------------------------------------
function updateServantAlive(screenshot) {
  var result = [];
  if (!servantInited) {
    //get alive servant
    servantInited = true;
    initServant = getCurrentServant(screenshot);
    for (var i = 0; i < 3; i++) {
      result[i] = true;
    }
    if (isDebug) {
      var path = getStoragePath();
      saveImage(screenshot, path + "/debug_init_screen.png");
      for (var i = 0; i < 3; i++) {
        saveImage(initServant[i], path + "/debug_init" + i + ".png");
      }
    }
  } else {
    //get current servant
    var currentServant = getCurrentServant(screenshot);
    var path = getStoragePath();
    for (var i = 0; i < 3; i++) {
      if (getIdentityScore(initServant[i], currentServant[i]) > 0.8) {
        result[i] = true;
      } else {
        console.log("從者 " + (i + 1) + " 退場");
        result[i] = false;
        if (isDebug) {
          var filepath = path + "/debug_servant_now.png";
          saveImage(screenshot, filepath);
          console.log("adb pull " + filepath);

          filepath = path + "/debug_servant_alive_" + i + ".png";
          saveImage(initServant[i], filepath);
          console.log("adb pull " + filepath);

          filepath = path + "/debug_servant_now_" + i + ".png";
          saveImage(currentServant[i], filepath);
          console.log("adb pull " + filepath);
        }
      }
    }
    for (var i = 0; i < 3; i++) {
      releaseImage(currentServant[i]);
    }
  }
  return result;
}

function updateServantExist(screenshot) {
  var result = [true, true, true];
  for (var i = 0; i < 3; i++) {
    if (
      !checkImage(
        screenshot,
        servantExistImage,
        servantExistX[i],
        servantExistY,
        servantExistWidth,
        servantExistHeight
      )
    ) {
      result[i] = false;
    }
  }
  return result;
}

function getCurrentServant(screenshot) {
  var servant = [];
  for (var i = 0; i < 3; i++) {
    servant[i] = cropImage(
      screenshot,
      servantAliveX[i],
      servantAliveY,
      servantAliveW,
      servantAliveH
    );
  }
  return servant;
}

//skill------------------------------------------------
function updateSkillUsed(screenshot) {
  var needRelease = false;
  if (screenshot == null) {
    needRelease = true;
    screenshot = getScreenshotResize();
  }
  var result = [];
  for (var i = 0; i < 9; i++) {
    result[i] = false;
    if (!skillUsedInLoop[i]) {
      //force use skill if not used in this game
      //console.log("force use skill");
      continue;
    }
    for (var offset = -5; offset <= 5; offset++) {
      if (
        checkImage(
          screenshot,
          skillUsedImage,
          skillPositionX[i] + skillUsedPositionOffset[0] + offset,
          skillPositionY + skillUsedPositionOffset[1],
          skillUsedSize,
          skillUsedSize,
          0.65
        )
      ) {
        result[i] = true;
        break;
      }
    }
  }
  if (needRelease) {
    releaseImage(screenshot);
  }
  return result;
}

//card--------------------------------------------------
function updateUltList() {
  ultList = [-1, -1, -1];
  return;
}

function updateCardList() {
  var cardImageScore = [];
  var screenshot = getScreenshotResize();
  for (var i = 0; i < 5; i++) {
    //get card color
    var cropCard = cropImage(
      screenshot,
      cardListX[i] + defaultMarginX + cardColorOffset[0],
      cardListY + cardColorOffset[1],
      cardWidth,
      cardHeight + cardMoveRange
    );
    for (var k = 0; k < 3; k++) {
      var find = findImage(cropCard, cardImage[k]);
      if (cardImageScore[i] == undefined || find.score > cardImageScore[i]) {
        cardImageScore[i] = find.score;
        cardList[i] = k;
      }
    }
    releaseImage(cropCard);

    //get card status
    cardStatus[i] = -1;
    var cropDisable = [];
    for (var j = 0; j < 2; j++) {
      cropDisable[j] = cropImage(
        screenshot,
        cardListX[i] + defaultMarginX + offsetDisableX[j] - 1,
        cardListY + offsetDisableY,
        disableW + 2,
        disableH + 15
      );
    }
    var cropWeak = cropImage(
      screenshot,
      cardListX[i] + defaultMarginX + cardListOffsetWeakX,
      cardListY + cardListOffsetWeakY,
      weakW + 1,
      weakH + cardMoveRange
    );
    if (
      findImage(cropDisable[0], cardImage[5]).score >= 0.85 &&
      findImage(cropDisable[1], cardImage[6]).score >= 0.85
    ) {
      cardStatus[i] = 0;
    } else if (findImage(cropWeak, cardImage[3]).score >= 0.85) {
      cardStatus[i] = 1;
    } else if (findImage(cropWeak, cardImage[4]).score >= 0.85) {
      cardStatus[i] = 2;
    }

    for (var j = 0; j < 2; j++) {
      releaseImage(cropDisable[j]);
    }
    releaseImage(cropWeak);
  }

  releaseImage(screenshot);
  if (isDebug) {
    console.log("Color 0:B 1:N 2:Q");
    console.log(cardList);
    console.log("Status -1:x 0:disable 1:weak 2:resist");
    console.log(cardStatus);
  }
}

function selectCards(sameColor, weak, mainColor, ult, currentStage) {
  var cardScore = [0, 0, 0, 0, 0];
  var sameColorCnt = [0, 0, 0];
  var sameColorScore = 1.5;
  var mainColorScore = 0.3;
  if (sameColor == 0) {
    sameColorScore = 0;
  } else if (sameColor == 2) {
    sameColorScore = 5.5;
  }
  var weakScore = 1;
  if (weak == 0) {
    weakScore = 0;
  } else if (weak == 2) {
    weakScore = 5;
  }
  var usedColor = [0, 0, 0];
  for (var i = 0; i < 5; i++) {
    sameColorCnt[cardList[i]]++;
  }
  if (
    (usedColor[0] > 0 && usedColor[1] > 0) ||
    (usedColor[0] > 0 && usedColor[2] > 0) ||
    (usedColor[1] > 0 && usedColor[2] > 0)
  ) {
    sameColorCnt = [0, 0, 0];
  } else if (usedColor[0] > 0) {
    sameColorCnt[1] = 0;
    sameColorCnt[2] = 0;
  } else if (usedColor[1] > 0) {
    sameColorCnt[0] = 0;
    sameColorCnt[2] = 0;
  } else if (usedColor[2] > 0) {
    sameColorCnt[0] = 0;
    sameColorCnt[1] = 0;
  }
  for (var i = 0; i < 5; i++) {
    if (sameColorCnt[cardList[i]] >= 3) {
      cardScore[i] += sameColorScore;
    }
    switch (cardStatus[i]) {
      case 0:
        cardScore[i] -= 100;
        break;
      case 1:
        cardScore[i] += weakScore;
        break;
      case 2:
        cardScore[i] -= weakScore;
        break;
    }
    if (cardList[i] == mainColor) {
      cardScore[i] += mainColorScore;
    }
  }
  // console.log("Card:"+cardList);
  // console.log("Status:"+cardStatus);
  for (var i = 0; i < 3; i++) {
    if (ult[i] >= 0 && currentStage >= ult[i]) {
      useUlt(i);
    }
  }
  while (isScriptRunning) {
    var max = -10000;
    var id = -1;
    for (var i = 0; i < 5; i++) {
      if (cardScore[i] > max) {
        id = i;
        max = cardScore[i];
      }
    }
    if (id >= 0) {
      selectCard(id);
      cardScore[id] = -15000;
    } else {
      return;
    }
  }
}
loadApiCnt++;
console.log("Load auto attack api finish");
