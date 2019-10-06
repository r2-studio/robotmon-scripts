//-----------------------------------------------------select stage
function selectStage(useApple){
    if(!isScriptRunning){
        return;
    }    
    if(isBattleMainPage()){
        console.log("已進入戰鬥，選擇關卡省略");
        sleep(500);
        return;
    }
    console.log("-選擇關卡-");

    if(isStageRestart()){
        tapScale(800,560);
        sleep(500);
    } else if(!isMainPage()){
        console.log("不在主畫面-選擇關卡失敗");
        isScriptRunning = false;
        return;
    }else{
        tapScale(800,160);
        sleep(500);
    }
    var status = -1;
    while(isScriptRunning){
        if(isItemOrServantFullDialog()){
            status = 0;
        }else if(isUseAppleDialog()){
            status = 1;
        }else if(isSelectFriendPage()){
            status = 2;
        }
        if(status>=0){
            break;
        }
    }
    if(status == 0){
        console.log("倉庫已滿-選擇關卡失敗");
        isScriptRunning = false;
        return;
    }else if(status == 1){
        switch(useApple){
            case -1:
            console.log("AP不足-選擇關卡失敗");
            isScriptRunning = false;
            return;
            case 2://gold
            tapScale(600,300);
            console.log("使用金蘋果");
            sendNormalMessage(runningScriptName,"使用金蘋果");
            break;
            case 1://silver
            tapScale(600,450);
            console.log("使用銀蘋果");
            sendNormalMessage(runningScriptName,"使用銀蘋果");
            break;
            case 0://bronze
            tapScale(600,560);
            console.log("使用銅蘋果");
            sendNormalMessage(runningScriptName,"使用銅蘋果");
            break;
            case 3:
            tapScale(600,150);
            console.log("使用聖晶石");
            sendNormalMessage(runningScriptName,"使用聖晶石");
            break;
            case 4:
            var counter = 0;
            while(isScriptRunning){
                sleep(1000);
                tapScale(640,620);
                console.log("等待一分鐘回復體力");
                if(counter == 0){
                    sendNormalMessage(runningScriptName,"等待回復體力");
                }
                counter = (counter + 1) % 5;
                if(selectStageAutoRestore()){
                    break;
                }
            }
            break;
        }        
        if(useApple >= 0 && useApple < 4){
            sleep(1500);
            tapScale(850,567);
        }
    }
    while(isScriptRunning){
        waitLoading();
        if(isSelectFriendPage()){
            waitLoading();
            sleep(2000);
            break;
        }
    }
}

function selectStageAutoRestore(){
    for(var i = 0;i<55;i++){
        sleep(1000);
        if(!isScriptRunning){
            return;
        }
    }
    //select stage again
    tapScale(800,160);
    while(isScriptRunning){
        sleep(3000);
        if(isUseAppleDialog()){
            return false;
        }else if(isSelectFriendPage()){
            return true;
        }
    }
}

//-----------------------------------------------------friend list
var selectFriendPosition = [90,158,225,292,362,430,497,565,632,699];
function selectFriend(filter,servant,item,star,checkIsFriend,scrollTimes){
    if(!isScriptRunning){
        return;
    }    
    if(isBattleMainPage()){
        console.log("已進入戰鬥，選擇好友省略");
        sleep(500);
        return;
    }
    if(checkIsFriend == undefined){
        checkIsFriend = true;
    }
    if(scrollTimes == undefined){
        scrollTimes = 3;
    }else if(scrollTimes < 0){
        scrollTimes = 15;
    }
    console.log("-選擇好友-");
    if(!isSelectFriendPage()){
        console.log("不在選擇好友頁面-選擇好友失敗");
        isScriptRunning = false;
        return;
    }
    var servantImage;
    if(servant.length > 0){
        var servantImagePath = itemPath+"friend_servant/"+servant+".png";
        servantImage = openImage(servantImagePath);
        if(isDebug){
            console.log("check servant image "+servantImagePath);
        }
    }
    var itemImage;
    if(item.length > 0){
        var servantItemPath = itemPath+"friend_item/"+item+".png";
        itemImage = openImage(servantItemPath);
        if(isDebug){
            console.log("check item image "+servantItemPath);
        }
    }
    while(isScriptRunning){
        var t = 1;
        for(var i = 0;i < selectFriendPosition.length;i++){//loop for filter
            if(!isScriptRunning){
                return;
            }
            if(filter == 0){
                i = 9;
            }else if((filter & t) == 0){
                t*=2;
                continue;
            }else{
                t *= 2;
                tapScale(selectFriendPosition[i],125);
                sleep(1000);
            }
            if(isSelectFriendEmpty()){
                continue;
            }
            var scrollCnt = 0;
            while(isScriptRunning){
                var found = false;
                var screenshot = getScreenshotResize();
                var friendLinePosition = getFriendLine(screenshot);
                var haveNotFriend = false;
                if(friendLinePosition.length == 0){
                    console.log("辨識好友座標失敗，使用固定座標");
                    friendLinePosition = [197,397];
                }
                if(isDebug){
                    console.log("好友座標 "+friendLinePosition);
                }
                for(var j = 0; j < friendLinePosition.length;j++){
                    var lineY = friendLinePosition[j];
                    // console.log("check line "+lineY);
                    var isSameServant = true;
                    var isSameItem = true;
                    var isFriend = true;
                    if(servantImage!=undefined){
                        isSameServant = checkFriendServant(screenshot,servantImage,lineY);
                    }
                    if(itemImage!=undefined){
                        isSameItem = checkFriendItem(screenshot,itemImage,lineY,star);
                    }
                    if(checkIsFriend){
                        isFriend = checkFriendIsFriend(screenshot,lineY);
                        if(!isFriend){
                            haveNotFriend = true;
                        }
                    }
                    if(isSameServant && isSameItem && isFriend){
                        console.log("好友"+(j+1)+"符合條件");
                        tapScale(450,lineY + 70);
                        found = true;
                        break;
                    }else if(isDebug){
                        console.log("好友"+(j+1)+"忽略，"+isSameServant+","+isSameItem+","+isFriend);
                    }
                }
                releaseImage(screenshot);
                if(found){                    
                    if(servantImage!=undefined){
                        releaseImage(servantImage);
                    }
                    if(itemImage!=undefined){
                        releaseImage(itemImage);
                    }
                    waitLoading();
                    while(isScriptRunning){
                        if(isSelectTeamPage()){
                            sleep(500);
                            return;
                        }else if(isBattleMainPage()){
                            sleep(500);
                            return;
                        }
                    }
                }
                if(isSelectFriendEnd()){
                    break;
                }
                if(scrollCnt == scrollTimes){
                    break;
                }
                if(checkIsFriend && haveNotFriend){
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


var positionX = [400,800];
var pixelColor = [[206,192,128],[243,212,164],[189,189,172],[220,220,220]];
if(server =="TW"){
    pixelColor = [[206,192,128],[243,212,164]];
}
function getFriendLine(screenshot){
    // console.log("getFriendLine");
    var lineY = [];
    var lineCnt = 0;
    for(var y = 170;y<530;y++){
      //console.log("check "+y);
      var isLine = false;
      for(var i=0;i<pixelColor.length;i+=2){
        //console.log("check i "+i);
        var x = i % positionX.length;
        var screenshotColor1 = getImageColor(screenshot,positionX[x],y);
        var screenshotColor2 = getImageColor(screenshot,positionX[x+1],y);
        var c1 = isSameColor(screenshotColor1.r,screenshotColor1.g,screenshotColor1.b,pixelColor[i][0],pixelColor[i][1],pixelColor[i][2],30);
        var c2 = isSameColor(screenshotColor2.r,screenshotColor2.g,screenshotColor2.b,pixelColor[i+1][0],pixelColor[i+1][1],pixelColor[i+1][2],30);
        if(c1||c2){
          // console.log(c1+","+c2+":"+y);
        }
        if(c1&&c2){
            isLine = true;
            if(isDebug){
                console.log("isLine "+y);
            }
            break;
        }
      }
      if(isLine){
        if(lineCnt > 0){
            if(y - lineY[lineCnt-1] < 150){
                lineCnt--;
            }
        }
        lineY[lineCnt] = y;
        lineCnt++;
      }
    }
    //console.log("line y "+lineY);

    if(isDebug){
        console.log("Line at "+lineY);
    }
    return lineY;
}

var friendX = 51;
var friendServantYOffset = 33;
var friendServantSize = [155,96];
function checkFriendServant(screenshot,servantImage,lineY){
    if(isDebug){
        console.log("checkFriendServant " +lineY);
    }
    return checkImage(screenshot,servantImage,friendX,lineY+friendServantYOffset,friendServantSize[0],friendServantSize[1],0.9);
}

var friendItemYOffset = 131;
var friendItemSize = [155,30];
function checkFriendItem(screenshot,itemImage,lineY,star){
    if(isDebug){
        console.log("checkFriendItem " +lineY);
    }
    if(!checkImage(screenshot,itemImage,friendX,lineY+friendItemYOffset,friendItemSize[0],friendItemSize[1],0.9)){
        return false;
    }
    if(star){
        if(!checkStar(screenshot,lineY)){
            return false;
        }
    }
    return true;
}

var friendStarX = 190;
var friendStarYOffset = 163;
var friendStarSize = 5;
function checkStar(screenshot,lineY){
    if(isDebug){
        console.log("checkStar " +lineY);
    }
    var friendStarY = lineY + friendStarYOffset;
    var isG = 0;
    var notG = 0;
    for(var i=0;i<friendStarSize;i++){
        for(var j=0;j<friendStarSize;j++){
            var color = getImageColor(screenshot,friendStarX+i,friendStarY+j);
            if(color.g>color.r && color.g > color.b){
                isG++;
            }else{
                notG++;
            }
        }
    }
    if(isG > notG * 3){
        return true;
    }
    return false;
}

var friendIsFriendX;
var friendIsFriendYOffset;
var friendIsFriendSize;
function checkFriendIsFriend(screenshot,lineY){
    if(isDebug){
        console.log("checkFriendIsFriend " +lineY);
    }
    if(server == "TW"){
        return checkPixel(1148,lineY+122,223,254,174,screenshot);
    }else{
        return checkPixel(1148,lineY+132,227,255,177,screenshot);
    }
}

function reloadFriend(){
    while(isScriptRunning){
        tapScale(825,117);
        sleep(1000);
        if(isSelectFriendRefreshDialog()){
            tapScale(850,567);
            sleep(1000);
            waitLoading();
            if(isSelectFriendRefreshDialog()){
                tapScale(625,567);
                sleep(2000);
            }else{
                return;
            }
        }
    }
}

function scrollFriendList(){
    swipeScale(400,500,400,100,300);
}

//-----------------------------------------------------team menu
var itemPositionY = [200,350,500];

function selectTeam(team){
    if(!isScriptRunning){
        return;
    }
    if(team < 0 || team >= 10){
        return;
    }
    if(isBattleMainPage()){
        console.log("已進入戰鬥，選擇隊伍省略");
        sleep(500);
        return;
    }
    console.log("-選擇隊伍-");
    if(!isSelectTeamPage()){
        console.log("不在選擇隊伍畫面");
        return;
    }
    var x = 525 + 25*team;
    var x2 = 525 + 25*((team+1)%10);
    tapScale(x2,50);
    sleep(1000);
    tapScale(x,50);
    sleep(2000);
}

function startQuest(useItem){
    if(!isScriptRunning){
        return;
    }
    if(isBattleMainPage()){
        console.log("已進入戰鬥，進入關卡省略");
        sleep(500);
        return;
    }
    console.log("-進入關卡-");
    if(!isSelectTeamPage()){
        console.log("不在選擇隊伍畫面");
        return;
    }
    tapScale(1150,667);
    sleep(1500);
    if(isUseItemDialog()){
        if(useItem == undefined || useItem == -1){
            console.log("不使用道具");
            tapScale(820,650);
            return;
        }
        var y = itemPositionY[useItem];
        if(useItem > 2){
            y = 500;
            for(var i = 0; i < useItem - 2; i++){
                swipeScale(400,500,400,300,20);
                sleep(1000);
            }
        }
        console.log("使用道具");
        tapScale(650,y);
        sleep(1000);
        tapScale(827,555);
        sleep(3000);
        if(isUseItemDialog()){
            isScriptRunning = false;
            console.log("道具不足");
            sendUrgentMessage(runningScriptName,"道具不足");
            return;
        }
    }
}

loadApiCnt++;
console.log("Load start stage api finish");