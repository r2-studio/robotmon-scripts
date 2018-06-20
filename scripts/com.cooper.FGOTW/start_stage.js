//selectFriend(0,"","贗作",1);
//-----------------------------------------------------select stage
function selectStage(useApple){
    if(!isScriptRunning){
        return;
    }
    tapScale(1600,475,100);
    sleep(1000);
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
    if(checkImage(screenShot,noApImage,900,70,750,110)){
        console.log("ap not enough");
        switch(useApple){
            case -1:
            isScriptRunning = false;
            releaseImage(screenShot);
            return;
            case 2://gold
            tapScale(750,600,100);
            break;
            case 1://silver
            tapScale(750,900,100);
            break;
            case 0://bronze
            tapScale(750,1120,100);
            break;
            case 3:
            tapScale(750,350,100);
            break;
            case 4:
                //wait for auto recover
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
        tapScale(1700,1135,100);
        sleep(2000);
        if(server == "TW"){
            tapScale(1600,475,100);
            sleep(1000);
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
    var servantImage;
    if(servant.length > 0){
        servantImage = openImage(itemPath+"friend_servant/"+servant+".png");
    }
    var itemImage;
    if(item.length > 0){
        itemImage = openImage(itemPath+"friend_item/"+item+".png");
    }
    while(true){
        var screenShot2 = getScreenshot();
        if(!checkImage(screenShot2,selectFriendImage,1340,200,420,100)){
            releaseImage(screenShot2);
            sleep(3000);
            continue;
        }
        releaseImage(screenShot2);
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
                            if(!checkImage(screenShot,itemImage,100,655,310,90,0.9)){
                                i1 = false;
                            }else if(star == 1 && !checkImage(screenShot,starImage,377,713,14,14)){
                                star1 = false;
                            }
                            if(!checkImage(screenShot,itemImage,100,1055,310,90,0.9)){
                                i2 = false;
                            }else if(star == 1 && !checkImage(screenShot,starImage,377,1113,14,14)){
                                star2 = false;
                            }
                        }else if(server == "TW"){
                            var itemSize = getImageSize(itemImage);
                            var shortImage = cropImage(itemImage,0,0,itemSize.width,((itemSize.height * 0.667) | 0));
                            if(!checkImage(screenShot,shortImage,100,655,310,60,0.9)){
                                i1 = false;
                            }else if(star == 1 && !checkImage(screenShot,starImage,377,713,14,14)){
                                star1 = false;
                            }
                            if(!checkImage(screenShot,shortImage,100,1055,310,60,0.9)){
                                i2 = false;
                            }else if(star == 1 && !checkImage(screenShot,starImage,377,1113,14,14)){
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
    swipeScale(800,1000,800,201,50);
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
    sleep(100);
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
        }else{
            var itemPositionY = [400,700,1000];
            var y;
            if(useItem > 2){
                y = 1000;
                for(var i = 0; i < useItem - 2; i++){
                    swipeScale(800,1000,800,650,20);
                    sleep(500);
                }
            }else{
                y = itemPositionY[useItem];
            }
            tapScale(1300,y,100);
            sleep(1000);
            tapScale(1655,1110,100);
        }
        releaseImage(screenShot2);
        sleep(3000);
        
        var screenShot3 = getScreenshot();
        if(checkImage(screenShot3,useItemImage,800,160,950,60)){
            isScriptRunning = false;
            console.log("No item");
        }
        releaseImage(screenShot3);
    }
}

function finishQuest(){
    console.log("Wait for quest finish");
    sleep(500);
    for(var i=0;i<30;i++){
        if(!isScriptRunning){
            return;
        }
        var r = isQuestFinish();
        switch(r){
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
        sleep(1500);
    }
    isScriptRunning = false;
    console.log("Wait for quest finish timeout");
}


console.log("Load start stage api finish");