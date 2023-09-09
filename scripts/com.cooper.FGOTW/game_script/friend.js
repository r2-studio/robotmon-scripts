var friendX = 76;
var friendServantPosition = [
  [friendX, 345, 232, 144],
  [friendX, 645, 232, 144],
];
var friendItemPosition = [
  [friendX, 492, 232, 45],
  [friendX, 792, 232, 45],
];
var selectFriendPosition = [135, 237, 337, 438, 543, 645, 745, 847, 948, 1048];
var positionX = [600, 1200];
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

var friendStarXOffset = 209;
var friendStarYOffset = 244;
var friendStarSize = 7;

var reloadPosition = 1400;
var barMargin = 0;

var selectFriendList = [];

var friendThreshole = 0.9

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
    positionX[0] = 600;
    positionX[1] = 1200;
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
  positionX[0] = 600 + offset;
  positionX[1] = 1200 + offset;
}
//selectFriend(0,"csaber",null,0,0,0);
function selectFriend(filter, servant, item, star, checkIsFriend, scrollTimes) {
  if (!isScriptRunning) {
    return;
  }
  if(selectFriendLoose){
    friendThreshole = 0.9;
  }else{
    friendThreshole = 0.97;
  }
  if (isBattleMainPage()) {
    console.log("已進入戰鬥，選擇好友省略");
    sleep(500);
    return;
  }
  if(isSelectTeamPage()){
    console.log("已進入隊伍選單，選擇好友省略");
    sleep(500);
    return;
  }
  if (checkIsFriend == undefined) {
    checkIsFriend = true;
  }
  if (scrollTimes == undefined) {
    scrollTimes = 3;
  } else if (scrollTimes < 0) {
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
  while (isScriptRunning) {
    var t = 1;
    //loop for class filter
    for (var i = 0; i < selectFriendPosition.length; i++) {
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
        tapScale(selectFriendPosition[i] + barMargin, 187, undefined, 0);
        sleep(1000);
      }
      if (isSelectFriendEmpty()) {
        continue;
      }
      var scrollCnt = 0;
      while (isScriptRunning) {
        var found = false;
        var screenshot = getScreenshotResize();
        var friendLinePosition = getFriendLine(screenshot);
        var haveNotFriend = false;
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
          if (itemImage != undefined) {
            isSameItem = checkFriendItem(screenshot, itemImage, lineY, star);
          }
          if (checkIsFriend) {
            isFriend = checkFriendIsFriend(screenshot, lineY);
            if (!isFriend) {
              haveNotFriend = true;
            }
          }
          if (isSameServant && isSameItem && isFriend) {
            console.log("好友" + (j + 1) + "符合條件");
            tapScale(675, lineY + 105);
            found = true;
            break;
          } else if (isDebug) {
            console.log(
              "好友" +
                (j + 1) +
                "忽略，" +
                isSameServant +
                "," +
                isSameItem +
                "," +
                isFriend
            );
          }
        }
        releaseImage(screenshot);
        if (found) {
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
        if (checkIsFriend && haveNotFriend) {
          console.log("發現非好友，刷新好友清單");
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

function getFriendLine(screenshot) {
  // console.log("getFriendLine");
  var lineY = [];
  var lineCnt = 0;
  for (var y = 255; y < 795; y++) {
    //console.log("check "+y);
    var isLine = false;
    for (var i = 0; i < pixelColor.length; i += 2) {
      //console.log("check i "+i);
      var x = i % positionX.length;
      var screenshotColor1 = getImageColor(screenshot, positionX[x], y);
      var screenshotColor2 = getImageColor(screenshot, positionX[x + 1], y);
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
          //same line
          lineCnt--;
        }
      }
      lineY[lineCnt] = y;
      lineCnt++;
    }
  }
  console.log("line y " + lineY);

  if (isDebug) {
    console.log("Line at " + lineY);
  }
  return lineY;
}

function checkFriendServant(screenshot, servantImage, lineY) {
  if (isDebug) {
    console.log("checkFriendServant " + lineY);
  }
  return checkImage(
    screenshot,
    servantImage,
    friendX,
    lineY + friendServantYOffset,
    friendServantSize[0],
    friendServantSize[1],
    friendThreshole
  );
}

function checkFriendItem(screenshot, itemImage, lineY, star) {
  if (isDebug) {
    console.log("checkFriendItem " + lineY);
  }
  if (
    !checkImage(
      screenshot,
      itemImage,
      friendX,
      lineY + friendItemYOffset,
      friendItemSize[0],
      friendItemSize[1],
      friendThreshole
    )
  ) {
    return false;
  }
  if (star) {
    if (!checkStar(screenshot, lineY)) {
      return false;
    }
  }
  return true;
}

function checkStar(screenshot, lineY) {
  if (isDebug) {
    console.log("checkStar " + lineY);
  }
  var friendStarY = lineY + friendStarYOffset;
  var isG = 0;
  var notG = 0;
  for (var i = 0; i < friendStarSize; i++) {
    for (var j = 0; j < friendStarSize; j++) {
      var color = getImageColor(
        screenshot,
        friendX + friendStarXOffset + i,
        friendStarY + j
      );
      if (color.g > color.r && color.g > color.b) {
        isG++;
      } else {
        notG++;
      }
    }
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
  return checkPixel(friendX + 1646, lineY + 198, 227, 255, 177, screenshot);
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

function saveFriendServantImage(cnt, be) {
  sleep(1000);
  setBlackEdgeByHtmlValue(be);
  initScreenSize();
  var screenShot = getScreenshotResize();
  if (screenShot == null) {
    return null;
  }
  var crop;
  if (cnt == 1) {
    crop = cropImage(
      screenShot,
      friendServantPosition[0][0],
      friendServantPosition[0][1],
      friendServantPosition[0][2],
      friendServantPosition[0][3]
    );
  } else {
    crop = cropImage(
      screenShot,
      friendServantPosition[1][0],
      friendServantPosition[1][1],
      friendServantPosition[1][2],
      friendServantPosition[1][3]
    );
  }
  var currentdate = new Date();
  var time = currentdate.getTime();
  var filePath = itemPath + "tmp_servant_" + time + ".png";
  console.log(filePath);
  saveImage(crop, filePath);
  releaseImage(crop);
  releaseImage(screenShot);
  return time;
}

function saveFriendItemImage(cnt, be) {
  sleep(1000);
  setBlackEdgeByHtmlValue(be);
  initScreenSize();
  var screenShot = getScreenshotResize();
  if (screenShot == null) {
    return null;
  }
  var crop;
  if (cnt == 1) {
    crop = cropImage(
      screenShot,
      friendItemPosition[0][0],
      friendItemPosition[0][1],
      friendItemPosition[0][2],
      friendItemPosition[0][3]
    );
  } else {
    crop = cropImage(
      screenShot,
      friendItemPosition[1][0],
      friendItemPosition[1][1],
      friendItemPosition[1][2],
      friendItemPosition[1][3]
    );
  }
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

function deleteFriendServantImage(imageName){
  var path = itemPath + "friend_servant/" + imageName + ".png";
  execute("rm " + path);
  return imageName;
}

function deleteFriendItemImage(imageName){
  var path = itemPath + "friend_item/" + imageName + ".png";
  execute("rm " + path);
  return imageName;
}

function additionalFriendServant(friend) {
  selectFriendList[selectFriendList.length] = friend;
}

loadApiCnt++;
console.log("Load friend api finish");
