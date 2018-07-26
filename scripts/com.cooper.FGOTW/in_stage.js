//-----------------------------------------------------in quest
function startAttack(){ 
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    tapScale(2250,1115,100);
    sleep(5000);
}

function checkPlayerCanMove(){
    var x = [2150,2320,2320];
    var y = [1285,370,600];
    var w = [220,120,120];
    var h = [65,80,80];
    var r = [true,true];
    for(var j = 0;j<2;j++){
        var screenShot = getScreenshot();
        for(var i = 0;i<3;i++){
            if(!checkImage(screenShot,selectStartImage[i],x[i],y[i],w[i],h[i])){
                r[j] = false;
                break;
            }
        }
        releaseImage(screenShot);
        sleep(1000);
    }
    return r[0]&&r[1];
}

function waitUntilPlayerCanMove(){
    /*
    while(true){
        if(!isScriptRunning){
            return;
        }
        console.log("waitUntilPlayerCanMove");
        if(checkPlayerCanMove()){
            sleep(500);
            if(checkPlayerCanMove()){
                return;
            }
        }
        sleep(1500);
    }*/
    return waitUntilPlayerCanMoveOrFinish();
}

function waitUntilPlayerCanMoveOrFinish(){

    console.log("waitUntilPlayerCanMoveOrFinish");
    var cnt = 0;
    while(true){
        if(!isScriptRunning){
            return false;
        }
        cnt = (cnt + 1 )%10;
        if(cnt == 0){
            console.log("waitUntilPlayerCanMoveOrFinish still looping");
        }
        var screenShot = getScreenshot();
        if(checkImage(screenShot,stageFailedImage,1000,200,550,100)){
            console.log("Stage failed");
            sendUrgentMessage(runningScriptName,"Stage failed");
            isScriptRunning = false;
            releaseImage(screenShot);
            return false;
        }
        releaseImage(screenShot);
        if(checkPlayerCanMove()){
            console.log("Player can move");
            return true;
        }
        if(isQuestFinish() >= 0){
            console.log("Quest finish");
            return false;            
        }
    }
}

function selectCard(card){
    if(!isScriptRunning){
        return;
    }
    //console.log("selectCard "+card);
    if(card == 0){
        tapScale(250,1035,100);
    }else if(card == 1){
        tapScale(800,1035,100);
    }else if(card == 2){
        tapScale(1250,1035,100);
    }else if(card == 3){
        tapScale(1800,1035,100);
    }else if(card == 4){
        tapScale(2350,1035,100);
    }
    sleep(500);
}

function useUlt(player){
    if(!isScriptRunning){
        return;
    }
    console.log("use servent "+(player+1)+" ult");
    if(player == 0){
        tapScale(800,250,100);
    }else if(player == 1){
        tapScale(1250,250,100);
    }else if(player == 2){
        tapScale(1800,250,100);
    }
    sleep(1000);
    var screenShot = getScreenshot();
    if(checkImage(screenShot,ultFailedImage,1200,850,165,80)){
        tapScale(1280,880,100);
        sleep(500);
    }
    releaseImage(screenShot);
}

function useSkill(player,skill,target,checkUsed){
    if(!isScriptRunning){
        return;
    }
    console.log("useSkill servent "+(player+1)+", skill "+(skill+1)+", target "+(target+1));
    if(target == undefined || target < 0){
        target = 0;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    if(checkUsed == undefined || checkUsed == true){
        var screenShot = getScreenshot();
        if(checkImage(screenShot,skillUsedImage,skillPositionX[player*3+skill],skillPositionY,skillPositionW,skillPositionH)){
            console.log("skill already used");
            releaseImage(screenShot);
            return;
        }
        releaseImage(screenShot);
    }
    if(player == 0){
        if(skill == 0){
            tapScale(100,1135,100);
        }else if(skill == 1){
            tapScale(300,1135,100);
        }else if(skill == 2){
            tapScale(500,1135,100);
        }
    }
    else if(player == 1){
        if(skill == 0){
            tapScale(750,1135,100);
        }else if(skill == 1){
            tapScale(950,1135,100);
        }else if(skill == 2){
            tapScale(1150,1135,100);         
        }
    }
    else if(player == 2){
        if(skill == 0){
            tapScale(1400,1135,100);
        }else if(skill == 1){
            tapScale(1600,1135,100);
        }else if(skill == 2){
            tapScale(1800,1135,100);
        }
    }
    sleep(1000);    
    if(!isScriptRunning){
        return;
    }
    var screenShot2 = getScreenshot();
    if(checkImage(screenShot2,skillNullImage,2085,142,69,67)){
        tapScale(2100,170,100);
        releaseImage(screenShot2);
        return;
    }
    if(checkImage(screenShot2,skillFailedImage,1160,1070,240,80)){
        tapScale(1280,1110,100);
        releaseImage(screenShot2);
        return;
    }
    if(checkImage(screenShot2,skillCheckImage,1070,325,420,85)){
        tapScale(1700,850,100);
        sleep(500);
        var screenShot3 = getScreenshot();
        if(checkImage(screenShot3,skillCheckImage,1070,325,420,85)){
            tapScale(800,850,100);
        }else {
            selectSkillTarget(target);
        }
        releaseImage(screenShot3);
    }else {
        selectSkillTarget(target);
    }
    releaseImage(screenShot2);
    sleep(3000);
}

function selectSkillTarget(player){
    if(!isScriptRunning){
        return;
    }
    var targetX = [650,1250,1850];
    for(var checkTarget = 0;checkTarget<3;checkTarget++){
        sleep(1000);
        var screenShot = getScreenshot();
        if(!checkImage(screenShot,skillNullImage,2161,269,69,67)){
            releaseImage(screenShot);
            return;
        }
        releaseImage(screenShot);
        switch(checkTarget){
            case 0:
                console.log("Select skill target "+(player+1));
                tapScale(targetX[player],850,100);
                break;
            case 1:
                console.log("Two servant left, select again");
                var offset = 300;
                if(player == 2){
                    offset = -300;
                }
                tapScale(targetX[player]+offset,850,100);
                break;
            case 2:
                console.log("Only one servant left");
                tapScale(targetX[1],850,100);
                break;
        }
    }
}

function useClothesSkill(skill,target1,target2){
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    console.log("useClothesSkill "+(skill+1));
    tapScale(2400,635,100);
    sleep(1000);
    if(skill == 0){
        tapScale(1800,635,100);
    }else if(skill == 1){
        tapScale(1975,635,100);
    }else if(skill == 2){
        tapScale(2150,635,100);
    }
    sleep(1000);

    var screenShot2 = getScreenshot();
    if(checkImage(screenShot2,skillCheckImage,1070,325,420,85)){
        tapScale(1700,850,100);
        sleep(500);
        var screenShot3 = getScreenshot();
        if(checkImage(screenShot3,skillCheckImage,1070,325,420,85)){
            //skill already used
            tapScale(800,850,100);
            sleep(1000);
            tapScale(2400,635,100);
            releaseImage(screenShot2);
            releaseImage(screenShot3);
            return;
        }
    }
    releaseImage(screenShot2);
    releaseImage(screenShot3);

    if(target1 != undefined && (target2 == undefined || target2 == -1)){
        selectSkillTarget(target1);
    }else if(target1!=undefined && target2 !=undefined){
        changePlayer(target1,target2);
    }
    sleep(1000);    
    var screenShot = getScreenshot();
    if(checkImage(screenShot,skillNullImage,2085,142,69,67)){
        tapScale(2100,170,100);
        releaseImage(screenShot);
        return;
    }
    sleep(3000);
}

function selectEnemy(enemy){
    if(!isScriptRunning){
        return;
    }
    switch(enemy){
        case 0:
        tapScale(1160,85,100);
        break;
        case 1:
        tapScale(680,85,100);
        break;
        case 2:
        tapScale(230,85,100);
        break;
    }
    
}

function changePlayer(target1,target2){
    if(!isScriptRunning){
        return;
    }
    console.log("useClothesSkill "+(target1+1) +","+(target2+1));
    if(target1 == 0 || target2 == 0){
        tapScale(275,735,100);
        sleep(300);
    }
    if(target1 == 1 || target2 == 1){
        tapScale(675,735,100);
        sleep(300);
    }
    if(target1 == 2 || target2 == 2){
        tapScale(1075,735,100);
        sleep(300);
    }
    if(target1 == 3 || target2 == 3){
        tapScale(1475,735,100);
        sleep(300);
    }
    if(target1 == 4 || target2 == 4){
        tapScale(1875,735,100);
        sleep(300);
    }
    if(target1 == 5 || target2 == 5){
        tapScale(2275,735,100);
        sleep(300);
    }
    tapScale(1300,1260,100);
}

function getCurrentStage(){
    var width = 50* screenScale[0];
    var height = 50* screenScale[1];
    var screenShot = getScreenshot();
    var crop = cropImage(screenShot,currentStageX * screenScale[0] + screenOffset[0],currentStageY * screenScale[1] + screenOffset[1],width,height);
    var score = [];
    for(var i=0;i<3;i++){
        var scaleImage = resizeImage(currentStageImage[i],width,height);
        score[i] = getIdentityScore(crop,scaleImage);
        releaseImage(scaleImage);
    }
    releaseImage(crop);
    releaseImage(screenShot);
    var result;
    if(score[0]>=score[1] && score[0]>=score[2]){
        result = 0;
    }else if(score[1]>=score[0] && score[1]>score[2]){
        result = 1;
    }else{
        result = 2;
    }
    return result;
}

function isQuestFinish(){
    var positionX = [2280,1792,990,1294,222,215,2080,1390,141,1480,1083];
    var positionY = [1340,1191,165,362,142,137,1300,550,317,500,1337];
    var positionW = [190,221,230,373,545,2141,270,510,649,420,376];
    var positionH = [55,60,285,89,77,233,100,40,113,60,77];
    var sameImage = [-1,-1];
    for(var j = 0;j<2;j++){
        var screenShot = getScreenshot();
        if(checkImage(screenShot,stageNotFinishImage,1950,1400,150,20)){
            console.log("Still in stage");
            releaseImage(screenShot);
            return -1;
        }
        for(var i = 0;i<11;i++){
            if(checkImage(screenShot,finishStageImage[i],positionX[i],positionY[i],positionW[i],positionH[i])){
                if(checkImage(screenShot,whiteImage,1000,500,500,500)){
                    releaseImage(screenShot);
                    return -1;
                }
                sameImage[j]=i;
                break;
            }
        }
        sleep(1000);
        releaseImage(screenShot);
    }
    if(sameImage[0] == sameImage[1]){
        if(sameImage[0] == -1){
            return -1;
        }else if(sameImage[0]<2){
            return sameImage[0];
        }else if(sameImage[0] == 4 ){
            var plan = getUserPlan();
            if(plan > 0){
                var itemX = 360;
                var itemY = 300;
                var itemW = 1860;
                var itemH = 1000;
                var itemScreenshot = getScreenshot();
                var itemCrop = cropImage(itemScreenshot, itemX* screenScale[0] + screenOffset[0], itemY * screenScale[1] + screenOffset[1], itemW * screenScale[0], itemH* screenScale[1]);
                var smallCrop;
                if(plan == 1){
                    smallCrop = resizeImage(itemCrop,300,140);
                }else if(plan = 2){
                    smallCrop = resizeImage(itemCrop,405,189);
                }
                var base = getBase64FromImage(smallCrop);
                sendNormalMessage(runningScriptName,base);
                releaseImage(itemScreenshot);
                releaseImage(itemCrop);
                releaseImage(smallCrop);
            }else{
                sendNormalMessage(runningScriptName,"Finish quest");
            }
            return 2;
        }
        else{
            return 2;
        }
    }
    return -1;
}

loadApiCnt++;
console.log("Load in stage api finish");