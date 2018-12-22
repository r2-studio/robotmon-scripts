//selectFriend(0,"","贗作",1);
//-----------------------------------------------------select stage
function selectStage(useApple){
    if(!isScriptRunning){
        return;
    }
    console.log("selectStage");
    /*
    var swimFlag = true;
    var waitSwimAnimation = false;
    var markResize = resizeImage(swimMark,83 * screenScale[0],60 * screenScale[1]);
    while(swimFlag){
        if(!isScriptRunning){
            return;
        }
        console.log("find swim team icon");
        var screenShotSwim = getScreenshot();
        if(checkImage(screenShotSwim,swimLogo,400,40,200,40)){
            if(checkImage(screenShotSwim,swimMap,120,40,180,80)){
                if(!waitSwimAnimation){
                    waitSwimAnimation = true;
                    sleep(3000);
                }
                var find = findImage(screenShotSwim,markResize);
                if(find.y < 1200 * screenScale[1] && find.y > 200 * screenScale[1]){
                    if(find.score > 0.85){
                        var x = find.x + 45 * screenScale[0];
                        var y = find.y + 75 * screenScale[1];
                        tap(x,y,100);
                        sleep(1000);
                    }   
                }
            }else if(checkImage(screenShotSwim,swimStage,120,40,180,80)){
                    swimFlag = false;
            }
        }else{
          swimFlag = false;
        }
        releaseImage(screenShotSwim);
    }
    releaseImage(markResize);
    */
    tapScale(1600,475,100);
    sleep(5000);
    var screenShot = getScreenshot();
    if(checkImage(screenShot,stageFullImage,650,300,1200,250)){
        console.log("item box full");
        releaseImage(screenShot);
        isScriptRunning = false;
        return;
    }
    else if(checkImage(screenShot,stageFullImage2,650,300,1200,250)){
        console.log("item box full");
        releaseImage(screenShot);
        isScriptRunning = false;
        return;
    }
    else if(!checkImage(screenShot,selectFriendImage,checkFriendPosition[0],checkFriendPosition[1],checkFriendPosition[2],checkFriendPosition[3])){
        switch(useApple){
            case -1:
            console.log("Ap not enough, stop script");
            isScriptRunning = false;
            releaseImage(screenShot);
            return;
            case 2://gold
            tapScale(750,600,100);
            console.log("Ap not enough, use gold apple");
            sendNormalMessage(runningScriptName,"Ap not enough, use gold apple");
            break;
            case 1://silver
            tapScale(750,900,100);
            console.log("Ap not enough, use silver apple");
            sendNormalMessage(runningScriptName,"Ap not enough, use silver apple");
            break;
            case 0://bronze
            tapScale(750,1120,100);
            console.log("Ap not enough, use bronze apple");
            sendNormalMessage(runningScriptName,"Ap not enough, use bronze apple");
            break;
            case 3:
            tapScale(750,350,100);
            console.log("Ap not enough, use stone apple");
            sendNormalMessage(runningScriptName,"Ap not enough, use stone apple");
            break;
            case 4:
            tapScale(1290,1240,100);
            var counter = 0;
            while(isScriptRunning){
                console.log("Wait 1 min for ap restore");
                if(counter == 0){
                    sendNormalMessage(runningScriptName,"Ap not enough, wait for ap restore");
                }
                counter = (counter + 1) % 5;
                for(var i = 0;i<55;i++){
                    if(!isScriptRunning){
                        break;
                    }
                    sleep(1000);
                }
                if(!isScriptRunning){
                    break;
                }
                tapScale(1600,475,100);
                sleep(5000);
                var autoWaitScreenShot = getScreenshot();
                if(checkImage(autoWaitScreenShot,selectFriendImage,1340,200,420,100)){
                    releaseImage(autoWaitScreenShot);
                    break;
                }
                tapScale(1290,1240,100);
                releaseImage(autoWaitScreenShot);
            }
            sendNormalMessage(runningScriptName,"Ap restore, continue");
            break;
        }
        sleep(1000);
        var screenShot2 = getScreenshot();
        var size = getImageSize(screenShot2);
        if(getIdentityScore(screenShot,screenShot2)>0.8){
            console.log("no apple");
            releaseImage(screenShot);
            releaseImage(screenShot2);
            isScriptRunning = false;
            return;
        }
        releaseImage(screenShot2);
        if(useApple >= 0 && useApple < 4){
            tapScale(1700,1135,100);
            sleep(2000);
            /*
            if(server == "TW"){
                while(true){
                    if(!isScriptRunning){
                        return;
                    }
                    sleep(2000);
                    var screenShot3 = getScreenshot();
                    if(checkImage(screenShot3,selectFriendImage,1340,200,420,100)){
                        releaseImage(screenShot3);
                        break;
                    }
                    releaseImage(screenShot3);
                    tapScale(1600,475,100);
                }
            }*/
        }
    }
    releaseImage(screenShot);
}
//-----------------------------------------------------friend list

function selectFriend(filter,servant,item,star){
    console.log("select friend");
    sleep(500);
    if(!isScriptRunning){
        return;
    }

    var teamScreenShot = getScreenshot();
    if(checkImage(teamScreenShot,selectTeamImage,2270,1300,230,100)){
        tapScale(200,100,100);
    }
    releaseImage(teamScreenShot);
    var servantImage;
    if(servant.length > 0){
        servantImage = openImage(itemPath+"friend_servant/"+servant+".png");
    }
    var itemImage;
    if(item.length > 0){
        itemImage = openImage(itemPath+"friend_item/"+item+".png");
    }
    while(true){
        if(!isScriptRunning){
            return;
        }
        var screenShot2 = getScreenshot();
        if(!checkImage(screenShot2,selectFriendImage,checkFriendPosition[0],checkFriendPosition[1],checkFriendPosition[2],checkFriendPosition[3])){
            releaseImage(screenShot2);
            sleep(3000);
            continue;
        }
        releaseImage(screenShot2);
        sleep(1000);
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
                tapScale(selectFriendPosition[i],250,100);
                sleep(1000);
            }
            for(var j = 0;j < 3;j++){ //loop for scroll
                if(!isScriptRunning){
                    return;
                }
                var screenShot = getScreenshot();
                var friend1;
                var friend2;
                if(servantImage == undefined && itemImage == undefined){
                    friend1 = true;
                    friend2 = true;
                }else{
                    var s1 = true;
                    var i1 = true;
                    var star1 = true;
                    var s2 = true;
                    var i2 = true;
                    var star2 = true;
                    if(servantImage != undefined){
                        if(!checkImage(screenShot,servantImage,100,460,310,195)){
                            s1 = false;
                        }
                        if(!checkImage(screenShot,servantImage,100,860,310,195)){
                            s2 = false;
                        }
                    }
                    if(itemImage != undefined){
                        if(server == "JP"){
                            if(!checkImageAndColor(screenShot,itemImage,100,655,310,90)){
                                i1 = false;
                            }else if(star == 1 && !checkStar(screenShot,0)){
                                star1 = false;
                            }
                            if(!checkImageAndColor(screenShot,itemImage,100,1055,310,90)){
                                i2 = false;
                            }else if(star == 1 && !checkStar(screenShot,1)){
                                star2 = false;
                            }
                        }else if(server == "TW"){
                            var itemSize = getImageSize(itemImage);
                            var shortImage = cropImage(itemImage,0,0,itemSize.width,((itemSize.height * 0.667) | 0));
                            if(!checkImageAndColor(screenShot,shortImage,100,655,310,60)){
                                i1 = false;
                            }else if(star == 1 && !checkStar(screenShot,0)){
                                star1 = false;
                            }
                            if(!checkImageAndColor(screenShot,shortImage,100,1055,310,60)){
                                i2 = false;
                            }else if(star == 1 && !checkStar(screenShot,1)){
                                star2 = false;
                            }
                            releaseImage(shortImage);
                        }
                    }
                    friend1 = s1 && i1 && star1;
                    friend2 = s2 && i2 && star2;
                }            
                releaseImage(screenShot);
                if(friend1||friend2){
                    if(friend1){
                        tapScale(900,535,100);
                    }else if(friend2){
                        tapScale(900,935,100);
                    }
                    if(servantImage!=undefined){
                        releaseImage(servantImage);
                    }
                    if(itemImage!=undefined){
                        releaseImage(itemImage);
                    }
                    sleep(3000);
                    return;
                }
                if(j < 2){
                    scrollFriendList();
                }
            }
        }
        reloadFriend();
    }
}

function checkStar(screenShot,position){
    var w = 10 * screenScale[0];
    var h = 10 * screenScale[1];
    var startX = screenOffset[0] + 379 * screenScale[0];
    var startY =  screenOffset[1] + (720 + position * 400)* screenScale[1];
    var isG = 0;
    var notG = 0;
    for(var i=0;i<w;i++){
        for(var j=0;j<h;j++){
            var color = getImageColor(screenShot,startX+i,startY+j);
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

function reloadFriend(){
    while(true){
        if(!isScriptRunning){
            return;
        }
        tapScale(1650,235,100);
        sleep(1000);
        var screenShot = getScreenshot();
        if(checkImage(screenShot,selectFriendImage2,1600,1080,150,80)){
            tapScale(1700,1135,100);
            releaseImage(screenShot);
            waitLoading();
            return;
        }else{
            tapScale(1250,1135,100);
            sleep(5000);
        }
        releaseImage(screenShot);
    }
}

function scrollFriendList(){
    swipeScale(800,1000,800,200,300);
}

//-----------------------------------------------------team menu
function selectTeam(team){
    if(!isScriptRunning){
        return;
    }
    if(team < 0 || team >= 10){
        return;
    }
    while(true){
        var screenShot = getScreenshot();
        if(checkImage(screenShot,selectTeamImage,2270,1300,230,100)){
            releaseImage(screenShot);
            break;
        }
        releaseImage(screenShot);
    }
    var x = 1050 + 50*team;
    var x2 = 1050 + 50*((team+1)%10);
    tapScale(x2,100,100);
    sleep(1000);
    tapScale(x,100,100);
    sleep(2000);
}

function startQuest(useItem){
    if(!isScriptRunning){
        return;
    }
    while(true){
        var screenShot = getScreenshot();
        if(checkImage(screenShot,selectTeamImage,2270,1300,230,100)){
            releaseImage(screenShot);
            break;
        }
        releaseImage(screenShot);
    }
    tapScale(2300,1335,100);
    sleep(1500);

    //check use item
    var screenShot2 = getScreenshot();
    if(checkImage(screenShot2,useItemImage,800,160,950,60)){
        if(useItem == undefined || useItem == -1){
            tapScale(1640,1300,100);
            releaseImage(screenShot2);
            return;
        }else{
            var itemPositionY = [400,700,1000];
            var y;
            if(useItem > 2){
                y = 1000;
                for(var i = 0; i < useItem - 2; i++){
                    swipeScale(800,1000,800,600,20);
                    sleep(1000);
                }
            }else{
                y = itemPositionY[useItem];
            }
            tapScale(1300,y,100);
            sleep(1000);
            tapScale(1655,1110,100);
        }
        releaseImage(screenShot2);
        sleep(5000);        
        var screenShot3 = getScreenshot();
        if(checkImage(screenShot3,useItemImage,800,160,950,60)){
            isScriptRunning = false;
            sendUrgentMessage(runningScriptName,"No enough item");
            console.log("Use item failed");
        }
        releaseImage(screenShot3);
    }else{
        releaseImage(screenShot2);
    }
}

function finishQuest(){
    console.log("Wait for quest finish");
    for(var i=0;i<50;i++){
        if(!isScriptRunning){
            return;
        }
        var r = isQuestFinish();
        switch(r){
            case -1:
                var screenShot3 = getScreenshot();
                if(checkImage(screenShot3,friendPointNew,2030,1300,300,100)){
                    sleep(3000);
                    var screenShot4 = getScreenshot();
                    if(!checkImage(screenShot4,finishStageImage[0],2280,1340,190,55)){
                        tapScale(2180,1350,100);
                        //console.log("Get new craft");
                    }
                    releaseImage(screenShot4);
                }else if(checkImage(screenShot3,friendPointBack,60,25,60,115)){
                    sleep(3000);
                    var screenShot4 = getScreenshot();
                    if(!checkImage(screenShot4,finishStageImage[0],2280,1340,190,55)){
                        //sendUrgentMessage(runningScriptName,"Get new craft");
                        console.log("Get new craft");
                        tapScale(90,80,100);
                    }
                    releaseImage(screenShot4);
                }
                releaseImage(screenShot3);
                break;
            case 0:
                console.log("Back to main screen");
                return;
            case 1:
                tapScale(650,1200,100);
                break;
            case 2:
                tapScale(2300,1335,100);
                break;
        }
    }
    console.log("Wait for quest finish timeout");
}

loadApiCnt++;
console.log("Load start stage api finish");