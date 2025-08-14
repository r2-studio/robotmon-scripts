var friendX = 76;
var friendServantPosition = [
  [friendX, 345, 232, 144],
  [friendX, 645, 232, 144],
];
var friendItemPosition = [
  [friendX, 492, 232, 45],
  [friendX, 792, 232, 45],
  [friendX + 255, 346, 232, 45],
  [friendX + 255, 485, 232, 45],
  [friendX + 255, 646, 232, 45],
  [friendX + 255, 785, 232, 45],
];

var classPositionX = [135, 237, 337, 438, 543, 645, 745, 847, 948, 1048];
var lineOffsetX = [600, 1200];
var pixelColor = [
  [206, 192, 128],
  [243, 212, 164],
  [189, 189, 172],
  [220, 220, 220],
];

/*
if(server =="TW"){
    pixelColor = [[206,192,128],[243,212,164]];
}
*/

var friendServantYOffset = 49;
var friendServantSize = [232, 144];

var friendItemYOffset = 197;
var friendItemSize = [232, 45];

var friendIsFriendOffsetX = 1646; // TODO check resolution

//default grand icon at 126,536 140x20
var friendGrandIcon = [50, 241, 140, 20]; // offsetx, offsety, width, height
var friendGrandItemXOffset = 255;
var friendGrandItemYOffset = [51, 190];
var friendGrandKitsunaItemOffset = [275, 136];

var imageStarOffset = [211, 50];
var friendStarSize = 8;

var reloadPosition = 1400;
var barMargin = 0;

var selectFriendList = [];

var friendThreshole = 0.9;

function setFriendMargin() {
  // if (server == "TW") {
  //   reloadPosition = 1237;
  // }
  if (resolution <= 16 / 9) {
    friendX = 76;
    friendServantPosition[0][0] = friendX;
    friendServantPosition[1][0] = friendX;
    friendItemPosition[0][0] = friendX;
    friendItemPosition[1][0] = friendX;
    friendItemPosition[2][0] = friendX + 255;
    friendItemPosition[3][0] = friendX + 255;
    friendItemPosition[4][0] = friendX + 255;
    friendItemPosition[5][0] = friendX + 255;
    lineOffsetX[0] = 600;
    lineOffsetX[1] = 1200;
    return;
  }
  var offset = defaultMarginX;
  barMargin = offset;
  if (resolution > 18 / 9) {
    offset = defaultMarginX + 32;
    barMargin = 127;
  }
  friendX = 76 + offset;
  friendServantPosition[0][0] = friendX;
  friendServantPosition[1][0] = friendX;
  friendItemPosition[0][0] = friendX;
  friendItemPosition[1][0] = friendX;
  friendItemPosition[2][0] = friendX + 255;
  friendItemPosition[3][0] = friendX + 255;
  friendItemPosition[4][0] = friendX + 255;
  friendItemPosition[5][0] = friendX + 255;
  lineOffsetX[0] = 600 + offset;
  lineOffsetX[1] = 1200 + offset;
}

//filter: 職階篩選 (位元遮罩，0=全部，1=劍，2=弓，4=槍，8=騎，16=術，32=殺，64=狂，128=特，256=混)
//servant: 指定從者名稱 (字串，空字串表示無指定)
//item: 指定禮裝名稱 (字串，空字串表示無指定)
//star: 禮裝滿突 (0=不限制，1=滿突)
//checkIsFriend: 限定好友 (0=不限制，1=僅限好友)
//scrollTimes: 下拉次數 (-1=到最後，0=不下拉，1-3=指定次數，-2=直到出現非好友，-3=直到出現非冠位從者)
//grandServantOnly: 僅限冠位從者 (0=不限定，1=限定)
//grandKitsunaItem: 冠位從者絆禮裝 (-1=不限定禮裝，0=絆禮裝不限效果，1=絆禮裝通常效果，2=絆禮裝限定效果(50np))
//grandRewardItem: 冠位從者報酬禮裝名稱 (字串，空字串表示無指定)

//範例：selectFriend(0,"csaber","",0,0,0,0,-1,"");
function selectFriend(filter, servant, item, star, checkIsFriend, scrollTimes, grandServantOnly, grandKitsunaItem, grandRewardItem) {
  var scrollUntilNoFriend = false;
  var scrollUntilNoGrand = false;
  var grandServantImage = [];
  grandServantImage[0] = openImage(imagePath + "grandServant.png");
  grandServantImage[1] = openImage(imagePath + "grandServant2.png");

  if (!isScriptRunning) {
    return;
  }
  if (selectFriendLoose) {
    friendThreshole = 0.9;
  } else {
    friendThreshole = 0.97;
  }
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，選擇好友省略");
    sleep(500);
    return;
  }
  if (isSelectTeamPage()) {
    console.log("已進入隊伍選單，選擇好友省略");
    sleep(500);
    return;
  }
  if (checkIsFriend == undefined) {
    checkIsFriend = true;
  }
  if (grandServantOnly == undefined) {
    grandServantOnly = false;
  }
  if (scrollTimes == undefined) {
    scrollTimes = 3;
  } else if (scrollTimes < 0) {
    if (scrollTimes == -2) {
      scrollUntilNoFriend = true;
    } else if (scrollTimes == -3) {
      scrollUntilNoGrand = true;
    }
    scrollTimes = 15;
  }
  console.log("-選擇好友-");
  if (!isSelectFriendPage()) {
    console.log("不在選擇好友頁面-選擇好友失敗");
    isScriptRunning = false;
    return;
  }
  var servantImage = [];
  if (servant.length > 0) {
    additionalFriendServant(servant);
  }
  for (var i = 0; i < selectFriendList.length; i++) {
    var servantImagePath =
      itemPath + "friend_servant/" + selectFriendList[i] + ".png";
    servantImage[i] = openImage(servantImagePath);
    if (isDebug) {
      console.log("check servant image " + servantImagePath);
    }
  }

  var itemImage;
  if (item.length > 0) {
    var servantItemPath = itemPath + "friend_item/" + item + ".png";
    itemImage = openImage(servantItemPath);
    if (isDebug) {
      console.log("check item image " + servantItemPath);
    }
  }

  var grandRewardItemImage;
  if (grandRewardItem.length > 0) {
    var grandRewardItemPath =
      itemPath + "friend_item/" + grandRewardItem + ".png";
    grandRewardItemImage = openImage(grandRewardItemPath);
    if (isDebug) {
      console.log("check grand reward item image " + grandRewardItemPath);
    }
  }

  while (isScriptRunning) {
    var t = 1;
    //loop for class filter
    for (var i = 0; i < classPositionX.length; i++) {
      if (!isScriptRunning) {
        return;
      }
      if (filter == 0) {
        i = 9;
      } else if ((filter & t) == 0) {
        t *= 2;
        continue;
      } else {
        t *= 2;
        tapScale(classPositionX[i] + barMargin, 187, undefined, 0);
        sleep(1000);
      }
      if (isSelectFriendEmpty()) {
        continue;
      }
      var scrollCnt = 0;
      while (isScriptRunning) {
        var found = false;
        var screenshot = getScreenshotResize();
        var friendLinePosition;
        if (friendAlgorithm == 1) {
          friendLinePosition = getFriendLineByIcon(screenshot);
        } else {
          friendLinePosition = getFriendLineByPixel(screenshot);
        }
        var haveNotFriend = false;
        var haveNotGrand = false;

        if (friendLinePosition.length == 0) {
          console.log("辨識好友座標失敗，使用固定座標");
          friendLinePosition = [295, 595];
        }
        if (isDebug) {
          console.log("好友座標 " + friendLinePosition);
        }

        //loop for line
        for (var j = 0; j < friendLinePosition.length; j++) {
          var lineY = friendLinePosition[j];
          // console.log("check line "+lineY);
          var isSameServant = false;
          var isSameItem = true;
          var isFriend = true;
          var isSameGrandKitsunaItem = true;
          var isSameGrandRewardItem = true;

          var isGrandServant = checkIsGrandServant(screenshot, grandServantImage, lineY);
          if (isGrandServant) {
            if (grandKitsunaItem >= 0 && !checkGrandKitsunaItem(screenshot, grandKitsunaItem, lineY)) {
              isSameGrandKitsunaItem = false;
            }
            if (grandRewardItemImage != undefined) {
              isSameGrandRewardItem = checkFriendItem(screenshot, grandRewardItemImage, lineY, false, 1);
            }
          } else {
            haveNotGrand = true;
            if (grandServantOnly) {
              if (isDebug) {
                console.log("Not grand servant, ignore");
              }
              continue;
            }
          }
          if (!isSameGrandKitsunaItem) {
            if (isDebug) {
              console.log("Not same grand kitsuna item, ignore");
            }
            continue;
          }

          if (!isSameGrandRewardItem) {
            if (isDebug) {
              console.log("Not same grand reward item, ignore");
            }
            continue;
          }

          if (servantImage.length <= 0) {
            isSameServant = true;
          } else {
            for (var k = 0; k < servantImage.length; k++) {
              if (servantImage[k] != undefined) {
                if (checkFriendServant(screenshot, servantImage[k], lineY)) {
                  isSameServant = true;
                  break;
                }
              }
            }
          }
          if (!isSameServant) {
            if (isDebug) {
              console.log("Not same servant, ignore");
            }
            continue;
          }

          if (itemImage != undefined) {
            if (isGrandServant) {
              isSameItem = checkFriendItem(screenshot, itemImage, lineY, star, 0);
            } else {
              isSameItem = checkFriendItem(screenshot, itemImage, lineY, star, -1);
            }

            if (!isSameItem) {
              if (isDebug) {
                console.log("Not same item, ignore");
              }
              continue;
            }
          }

          if (checkIsFriend) {
            isFriend = checkFriendIsFriend(screenshot, lineY);
            if (!isFriend) {
              haveNotFriend = true;
              if (isDebug) {
                console.log("Not friend, break");
              }
              break;
            }
          }
          console.log("好友" + (j + 1) + "符合條件");
          tapScale(675, lineY + 105);
          found = true;
          break;
        }
        releaseImage(screenshot);
        // end loop line

        if (found) {
          releaseImage(grandServantImage[0]);
          releaseImage(grandServantImage[1]);
          for (var k = 0; k < servantImage.length; k++) {
            if (servantImage[k] != undefined) {
              releaseImage(servantImage[k]);
            }
          }
          servantImage = [];

          if (itemImage != undefined) {
            releaseImage(itemImage);
          }
          waitLoading();
          while (isScriptRunning) {
            if (isSelectTeamPage()) {
              sleep(500);
              return;
            } else if (isBattleMainPage()) {
              sleep(500);
              return;
            } else {
              tapScale(460, 5);
              sleep(1000);
            }
          }
        }
        if (isSelectFriendEnd()) {
          console.log("已到最底，刷新好友清單");
          break;
        }
        if (scrollCnt == scrollTimes) {
          console.log("已達到下拉次數，刷新好友清單");
          break;
        }
        if (scrollUntilNoFriend && haveNotFriend) {
          console.log("發現非好友，刷新好友清單");
          break;
        }
        if (scrollUntilNoGrand && haveNotGrand) {
          console.log("發現非冠位從者，刷新好友清單");
          break;
        }
        scrollCnt++;
        scrollFriendList();
        sleep(500);
      }
    }
    reloadFriend();
  }
}

function getFriendLineByPixel(screenshot) {
  // console.log("getFriendLine");
  var lineY = [];
  var lineCnt = 0;
  for (var y = 255; y < 795; y++) {
    //console.log("check "+y);
    var isLine = false;
    for (var i = 0; i < pixelColor.length; i += 2) {
      //console.log("check i "+i);
      var x = i % lineOffsetX.length;
      var screenshotColor1 = getImageColor(screenshot, lineOffsetX[x], y);
      var screenshotColor2 = getImageColor(screenshot, lineOffsetX[x + 1], y);
      var c1 = isSameColor(
        screenshotColor1.r,
        screenshotColor1.g,
        screenshotColor1.b,
        pixelColor[i][0],
        pixelColor[i][1],
        pixelColor[i][2],
        30
      );
      var c2 = isSameColor(
        screenshotColor2.r,
        screenshotColor2.g,
        screenshotColor2.b,
        pixelColor[i + 1][0],
        pixelColor[i + 1][1],
        pixelColor[i + 1][2],
        30
      );
      if (c1 || c2) {
        // console.log(c1+","+c2+":"+y);
      }
      if (c1 && c2) {
        isLine = true;
        if (isDebug) {
          console.log("isLine " + y);
        }
        break;
      }
    }
    if (isLine) {
      if (lineCnt > 0) {
        if (y - lineY[lineCnt - 1] < 10) {
          //same line, use lowest
          lineCnt--;
        }
      }
      lineY[lineCnt] = y;
      lineCnt++;
    }
  }
  // console.log("line y " + lineY);

  // 彈性變數，預設2px
  var tolerance = 1;

  // 條件1：忽略所有大於800的線
  var validLines = [];
  for (var i = 0; i < lineY.length; i++) {
    if (lineY[i] <= 800) {
      validLines[validLines.length] = lineY[i];
    }
  }

  if (validLines.length == 0) {
    return [];
  }

  // 排序線條
  validLines.sort(function (a, b) { return a - b; });

  var correctLines = [];
  var uncertainLines = [];

  // 處理每一條線
  for (var i = 0; i < validLines.length; i++) {
    var currentLine = validLines[i];
    var isCorrect = false;
    var isWrong = false;
    // 檢查與其他線的關係
    for (var j = 0; j < validLines.length; j++) {
      if (i == j) continue;
      var otherLine = validLines[j];
      var diff = Math.abs(currentLine - otherLine);
      // 條件2：當兩條線相差36px時，下面的線為正確的線，上面的線為錯誤的線
      if (diff >= (36 - tolerance) && diff <= (36 + tolerance)) {
        if (currentLine > otherLine) {
          isCorrect = true;
        } else {
          isWrong = true;
        }
      }
    }

    // 分類線條
    if (isCorrect && !isWrong) {
      correctLines[correctLines.length] = currentLine;
    } else if (!isWrong) {
      uncertainLines[uncertainLines.length] = currentLine;
    }
  }

  // 條件3：當兩條線相差300px時且其中一條是正確的線，另一條也為正確的線
  var additionalCorrectLines = [];
  for (var i = 0; i < correctLines.length; i++) {
    var correctLine = correctLines[i];
    for (var j = 0; j < validLines.length; j++) {
      var otherLine = validLines[j];
      var diff = Math.abs(correctLine - otherLine);

      if (diff >= (300 - tolerance) && diff <= (300 + tolerance)) {
        // 檢查otherLine是否已經在correctLines中
        var alreadyCorrect = false;
        for (var k = 0; k < correctLines.length; k++) {
          if (correctLines[k] == otherLine) {
            alreadyCorrect = true;
            break;
          }
        }
        if (!alreadyCorrect) {
          additionalCorrectLines[additionalCorrectLines.length] = otherLine;
        }
      }
    }
  }

  // 將額外的正確線條加入正確線條陣列
  for (var i = 0; i < additionalCorrectLines.length; i++) {
    correctLines[correctLines.length] = additionalCorrectLines[i];
  }

  // 從不確定線條中移除已升級為正確的線條
  var newUncertainLines = [];
  for (var i = 0; i < uncertainLines.length; i++) {
    var isUpgraded = false;
    for (var j = 0; j < additionalCorrectLines.length; j++) {
      if (uncertainLines[i] == additionalCorrectLines[j]) {
        isUpgraded = true;
        break;
      }
    }
    if (!isUpgraded) {
      newUncertainLines[newUncertainLines.length] = uncertainLines[i];
    }
  }
  uncertainLines = newUncertainLines;

  var filteredLineY = [];

  // 條件4：當有正確的線時，僅回傳所有正確的線
  if (correctLines.length > 0) {
    filteredLineY = correctLines;
  } else {
    // 條件5：當沒有正確的線時，則保留所有不確定的線
    filteredLineY = uncertainLines;
  }

  // 從小到大排序
  filteredLineY.sort(function (a, b) { return a - b; });

  if (isDebug) {
    console.log("原始Line: " + lineY);
    console.log("正確Line: " + correctLines);
    console.log("不確定Line: " + uncertainLines);
    console.log("過濾後Line: " + filteredLineY);
  }
  return filteredLineY;
}

function checkFriendServant(screenshot, servantImage, lineY) {
  if (isDebug) {
    console.log("checkFriendServant " + lineY);
  }
  return checkImage(screenshot, servantImage,
    friendX, lineY + friendServantYOffset, friendServantSize[0], friendServantSize[1], friendThreshole
  );
}

function checkFriendItem(screenshot, itemImage, lineY, needStar, grandServantItemIndex) {
  if (isDebug) {
    console.log("checkFriendItem " + lineY + " " + needStar + " " + grandServantItemIndex);
  }
  if (grandServantItemIndex == undefined) {
    grandServantItemIndex = -1;
  }
  var x = friendX
  var y = lineY + friendItemYOffset
  if (grandServantItemIndex != -1) {
    x = friendX + friendGrandItemXOffset;
    y = lineY + friendGrandItemYOffset[grandServantItemIndex];
  }
  var croppedItemImage = cropImage(itemImage, 0, 0, friendItemSize[0] - 40, friendItemSize[1]);
  var result = checkImage(screenshot, croppedItemImage, x, y, friendItemSize[0] - 40, friendItemSize[1], friendThreshole);
  releaseImage(croppedItemImage);
  if (!result) {
    return false;
  }
  if (needStar) {
    if (!checkItemStar(screenshot, x, y)) {
      if (isDebug) {
        console.log("No star");
      }
      return false;
    }
  }
  return true;
}

function checkItemStar(screenshot, imagePositionX, imagePositionY) {
  var isG = 0;
  var notG = 0;
  var starLeft = imagePositionX + imageStarOffset[0] - friendStarSize / 2;
  var starTop = imagePositionY + imageStarOffset[1] - friendStarSize / 2;
  for (var i = 0; i < friendStarSize; i++) {
    for (var j = 0; j < friendStarSize; j++) {
      var color = getImageColor(screenshot, starLeft + i, starTop + i);
      if (color.g > color.r && color.g > color.b) {
        isG++;
      } else {
        notG++;
      }
    }
  }
  if (isDebug) {
    console.log("checkItemStar " + starLeft + "," + starTop + "," + friendStarSize + "," + friendStarSize);
  }
  if (isG > notG * 3) {
    return true;
  }
  return false;
}

function checkFriendIsFriend(screenshot, lineY) {
  if (isDebug) {
    console.log("checkFriendIsFriend " + lineY);
  }
  return checkPixel(friendX + friendIsFriendOffsetX, lineY + 198, 227, 255, 177, screenshot);
}

function reloadFriend() {
  while (isScriptRunning) {
    if (isSelectTeamPage()) {
      console.log("誤觸進入選擇隊伍，回到上一頁");
      tapScale(200, 70);
      sleep(2000);
    }
    tapScale(reloadPosition + barMargin, 175, undefined, 0);
    // console.log("cooper debug reloadFriend "+ (reloadPosition + barMargin)+" "+reloadPosition +" "+ barMargin);
    sleep(1000);
    if (isSelectFriendRefreshDialog()) {
      tapScale(1275, 850);
      sleep(3000);
      waitLoading();
      if (isSelectFriendRefreshDialog()) {
        tapScale(937, 850);
        sleep(1000);
      } else {
        return;
      }
    }
  }
}

function scrollFriendList() {
  swipeScale(600, 750, 600, 150, 300);
}

function saveFriendServantImage(positionIndex, be, captureMethod) {
  sleep(1000);
  setBlackEdgeByHtmlValue(be);
  initScreenSize();
  var screenShot = getScreenshotResize();
  if (screenShot == null) {
    return null;
  }
  
  var cropX = friendServantPosition[positionIndex][0];
  var cropY = friendServantPosition[positionIndex][1];
  var cropW = friendServantPosition[positionIndex][2];
  var cropH = friendServantPosition[positionIndex][3];
  
  // 根據 captureMethod 決定是否使用 getFriendLine
  if (captureMethod == 1) {
    var friendLinePosition = getFriendLineByPixel(screenShot);
    if (friendLinePosition.length > positionIndex) {
      cropY = friendLinePosition[positionIndex] + friendServantYOffset;
    } else {
      console.log("positionIndex " + positionIndex + " 超出好友行數量 " + friendLinePosition.length);
      releaseImage(screenShot);
      return null;
    }
  } else if (captureMethod == 2) {
    var friendLinePosition = getFriendLineByIcon(screenShot);
    if (friendLinePosition.length > positionIndex) {
      cropY = friendLinePosition[positionIndex] + friendServantYOffset;
    } else {
      console.log("positionIndex " + positionIndex + " 超出好友行數量 " + friendLinePosition.length);
      releaseImage(screenShot);
      return null;
    }
  }
  
  var crop = cropImage(screenShot, cropX, cropY, cropW, cropH);
  var currentdate = new Date();
  var time = currentdate.getTime();
  var filePath = itemPath + "tmp_servant_" + time + ".png";
  console.log(filePath);
  saveImage(crop, filePath);
  releaseImage(crop);
  releaseImage(screenShot);
  return time;
}

function saveFriendItemImage(positionIndex, be, captureMethod) {
  sleep(1000);
  setBlackEdgeByHtmlValue(be);
  initScreenSize();
  var screenShot = getScreenshotResize();
  if (screenShot == null) {
    return null;
  }
  
  var cropX = friendItemPosition[positionIndex][0];
  var cropY = friendItemPosition[positionIndex][1];
  var cropW = friendItemPosition[positionIndex][2];
  var cropH = friendItemPosition[positionIndex][3];
  
  // 根據 captureMethod 決定是否使用 getFriendLine
  if (captureMethod == 1) {
    var friendLinePosition = getFriendLineByPixel(screenShot);
    var friendIndex, itemOffset;
    
    if (positionIndex <= 1) {
      // positionIndex 0,1: friend 0,1 的預設禮裝
      friendIndex = positionIndex;
      itemOffset = friendItemYOffset;
    } else {
      // positionIndex 2-5: 冠位禮裝
      friendIndex = Math.floor((positionIndex - 2) / 2);  // positionIndex 2,3->0; 4,5->1
      var grandItemIndex = (positionIndex - 2) % 2;  // positionIndex 2,4->0(普通); 3,5->1(報酬)
      itemOffset = friendGrandItemYOffset[grandItemIndex];
    }
    
    if (friendLinePosition.length > friendIndex) {
      cropY = friendLinePosition[friendIndex] + itemOffset;
    } else {
      console.log("positionIndex " + positionIndex + " 對應好友行 " + friendIndex + " 超出好友行數量 " + friendLinePosition.length);
      releaseImage(screenShot);
      return null;
    }
  } else if (captureMethod == 2) {
    var friendLinePosition = getFriendLineByIcon(screenShot);
    var friendIndex, itemOffset;
    
    if (positionIndex <= 1) {
      // positionIndex 0,1: friend 0,1 的預設禮裝
      friendIndex = positionIndex;
      itemOffset = friendItemYOffset;
    } else {
      // positionIndex 2-5: 冠位禮裝
      friendIndex = Math.floor((positionIndex - 2) / 2);  // positionIndex 2,3->0; 4,5->1
      var grandItemIndex = (positionIndex - 2) % 2;  // positionIndex 2,4->0(普通); 3,5->1(報酬)
      itemOffset = friendGrandItemYOffset[grandItemIndex];
    }
    
    if (friendLinePosition.length > friendIndex) {
      cropY = friendLinePosition[friendIndex] + itemOffset;
    } else {
      console.log("positionIndex " + positionIndex + " 對應好友行 " + friendIndex + " 超出好友行數量 " + friendLinePosition.length);
      releaseImage(screenShot);
      return null;
    }
  }
  
  var crop = cropImage(screenShot, cropX, cropY, cropW, cropH);
  var currentdate = new Date();
  var time = currentdate.getTime();
  var filePath = itemPath + "tmp_item_" + time + ".png";
  console.log(filePath);
  saveImage(crop, filePath);
  releaseImage(crop);
  releaseImage(screenShot);
  return time;
}

function confirmSaveFriendServantImage(imageName, time) {
  if (imageName == undefined) {
    execute("rm " + itemPath + "tmp_servant_" + time + ".png ");
  } else {
    execute(
      "mv " +
      itemPath +
      "tmp_servant_" +
      time +
      ".png " +
      itemPath +
      "friend_servant/" +
      imageName +
      ".png"
    );
  }
  return imageName;
}

function confirmSaveFriendItemImage(imageName, time) {
  if (imageName == undefined) {
    execute("rm " + itemPath + "tmp_item_" + time + ".png ");
  } else {
    execute(
      "mv " +
      itemPath +
      "tmp_item_" +
      time +
      ".png " +
      itemPath +
      "friend_item/" +
      imageName +
      ".png"
    );
  }
  return imageName;
}

function deleteFriendServantImage(imageName) {
  var path = itemPath + "friend_servant/" + imageName + ".png";
  execute("rm " + path);
  return imageName;
}

function deleteFriendItemImage(imageName) {
  var path = itemPath + "friend_item/" + imageName + ".png";
  execute("rm " + path);
  return imageName;
}

function additionalFriendServant(friend) {
  selectFriendList[selectFriendList.length] = friend;
}

function checkIsGrandServant(screenshot, grandServantImage, lineY) {
  var result1 = checkImage(
    screenshot,
    grandServantImage[0],
    friendX + friendGrandIcon[0],
    lineY + friendGrandIcon[1],
    friendGrandIcon[2],
    friendGrandIcon[3],
    0.9
  );
  var result2 = checkImage(
    screenshot,
    grandServantImage[1],
    friendX + friendGrandIcon[0],
    lineY + friendGrandIcon[1],
    friendGrandIcon[2],
    friendGrandIcon[3],
    0.9
  );
  if (isDebug) {
    console.log("checkIsGrandServant " + result1 + " " + result2);
  }
  return result1 || result2;
}

function checkGrandKitsunaItem(screenshot, kitsuna, lineY) {
  var result = -1;
  var centerX = friendX + friendGrandKitsunaItemOffset[0];
  var centerY = lineY + friendGrandKitsunaItemOffset[1];
  var scanSize = 4;
  for (var x = centerX - scanSize; x < centerX + scanSize; x++) {
    for (var y = centerY - scanSize; y < centerY + scanSize; y++) {

      if (checkPixel(x, y, 101, 101, 101, screenshot)) {
        //none
        result = 0;
        break;
      } else if (checkPixel(x, y, 209, 249, 122, screenshot)) {
        //normal effect
        result = 1;
        break;
      } else if (checkPixel(x, y, 241, 115, 8, screenshot)) {
        //np effect
        result = 2;
        break;
      }
    }
  }
  if (isDebug) {
    var color = getImageColor(screenshot, x, y);
    console.log("checkGrandKitsunaItem check color at " + x + "," + y);
    console.log("checkGrandKitsunaItem get color " + color.r + "," + color.g + "," + color.b);
    console.log("checkGrandKitsunaItem result " + result);
  }

  if (isDebug) {
    console.log("checkGrandKitsunaItem" + (kitsuna == result));
  }
  return kitsuna == result;
}

function getFriendLineByIcon(screenshot) {
  if (isDebug) {
    console.log("getFriendLineByIcon 開始執行");
  }
  var lineY = [];
  var lineCnt = 0;
  var searchX = friendX + 1164;
  var friendLoginIcon = openImage(imagePath + "friendLogin.png");

  if (friendLoginIcon == null) {
    console.log("無法載入 friendLogin.png 圖片");
    return lineY;
  }

  if (isDebug) {
    console.log("成功載入 friendLogin.png，開始搜尋座標，searchX=" + searchX);
  }

  var searchArea = cropImage(screenshot, searchX, 250, 160, 600);
  var results = findImages(searchArea, friendLoginIcon, 0.95, 3, true);

  if (isDebug) {
    console.log("findImages 找到 " + results.length + " 個匹配項目");
  }

  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (result.score >= 0.85) {
      var iconY = 250 + result.y;
      var adjustedLineY = iconY - 15;

      if (isDebug) {
        console.log("找到圖標於 y=" + iconY + " (score=" + result.score + ")，調整後座標 y=" + adjustedLineY);
      }

      if (lineCnt > 0) {
        if (Math.abs(adjustedLineY - lineY[lineCnt - 1]) < 10) {
          if (isDebug) {
            console.log("座標過於接近，跳過 y=" + adjustedLineY);
          }
          continue;
        }
      }

      lineY[lineCnt] = adjustedLineY;
      lineCnt++;

      if (isDebug) {
        console.log("新增好友行座標 [" + (lineCnt - 1) + "] = " + adjustedLineY);
      }
    }
  }

  releaseImage(searchArea);

  // 對座標陣列進行由小到大排序
  lineY.sort(function (a, b) { return a - b; });

  if (isDebug) {
    console.log("getFriendLineByIcon 完成，共找到 " + lineCnt + " 行好友");
    console.log("排序後好友座標陣列: " + lineY);
  }

  releaseImage(friendLoginIcon);
  return lineY;
}

loadApiCnt++;
console.log("Load friend api finish");
