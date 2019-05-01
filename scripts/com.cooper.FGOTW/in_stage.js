//-----------------------------------------------------in quest

var skillPositionX = [50,150,250,375,475,535,700,800,900];
var skillPositionY = 567;
var skillTargetX = [325,625,925];
var skillTargetY = 425;
var clothSkillX = [900,987,1075];
var clothSkillY = 317;
var enemyPositionX = [580,340,115];
var enemyPositionY = 42;
var currentStagePosition = [860,12,25,25];

var cardPositionX = [125,400,625,900,1175];
var cardPositionY = 517;
var ultPositionX = [400,625,900];
var ultPositionY = 125;
//----------------------------------------------Battle main page
function useSkill(player,skill,target){
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    console.log("使用技能 從者 "+(player+1)+", 技能 "+(skill+1)+", 目標 "+(target+1));
    if(target == undefined || target < 0){
        target = 0;
    }
    tapScale(skillPositionX[player*3+skill],skillPositionY);
    sleep(1000);
    if(!isScriptRunning){
        return;
    }
    if(isBattleServantDialog()){
        //skill null
        tapScale(1050,85);
        return;
    }
    else if(isBattleSkillFailedDialog()){
        //skill can not use
        tapScale(640,555);
        releaseImage(screenShot2);
        return;
    }
    else if(isBattleSkillDetailDialog()){
        //need confirm or in cd
        tapScale(850,425);
        sleep(500);
        if(isBattleSkillDetailDialog()){
            //in cd
            tapScale(400,425);
        }else {
            selectSkillTarget(target);
        }
    }else {
        selectSkillTarget(target);        
    }
}

function selectSkillTarget(player){
    if(!isScriptRunning){
        return;
    }
    for(var checkTarget = 0;checkTarget<3;checkTarget++){
        sleep(1000);
        if(!isBattleSkillTargetDialog()){
            return;
        }
        switch(checkTarget){
            case 0:
                console.log("選擇技能目標 "+(player+1));
                tapScale(skillTargetX[player],skillTargetY);
                break;
            case 1:
                console.log("從者不足三人，再次選擇");
                var offset = 150;
                if(player == 2){
                    offset = -150;
                }
                tapScale(skillTargetX[player]+offset,skillTargetY);
                break;
            case 2:
                console.log("從者僅剩一人，再次選擇");
                tapScale(skillTargetX[1],skillTargetY);
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
    console.log("使用禮裝技能 "+(skill+1));
    tapScale(1200,317);
    sleep(1000);
    tapScale(clothSkillX[skill],clothSkillY);
    sleep(1000);
    if(isBattleSkillDetailDialog()){
        tapScale(850,425);
        sleep(500);
        if(isBattleSkillDetailDialog()){
            //in cd
            tapScale(400,425);
            sleep(1000);
            tapScale(1200,317);
        }        
    }
    if(target1 != undefined && (target2 == undefined || target2 == -1)){
        selectSkillTarget(target1);
    }else if(target1!=undefined && target2 !=undefined){
        changePlayer(target1,target2);
    }
    sleep(1000);    
    if(isBattleServantDialog()){
        //skill null
        tapScale(1050,85);
        return;
    }
}

function selectEnemy(enemy){
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    console.log("選擇敵人 "+(enemy+1));
    tapScale(enemyPositionX[enemy],enemyPositionY);
}

function changePlayer(target1,target2){
    if(!isScriptRunning){
        return;
    }
    console.log("交換從者 "+(target1+1) +","+(target2+1));
    tapScale(138 +(200*target1),368);
    sleep(300);
    tapScale(138 +(200*target2),368);
    sleep(300);
    tapScale(650,630);
}

//-------------------------------------------------------Battle card apge
function startAttack(){ 
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    tapScale(1125,558);
    sleep(5000);
}

function selectCard(card){
    if(!isScriptRunning){
        return;
    }
    tapScale(cardPositionX[card],cardPositionY);
    sleep(500);
}

function useUlt(player){
    if(!isScriptRunning){
        return;
    }
    console.log("選擇寶具 從者"+(player+1));
    tapScale(ultPositionX[player],ultPositionY);
    sleep(1000);
    if(isBattleUltFailedDialog()){
        tapScale(640,440);
        sleep(500);
    }
}

//---------------------------------------------Battle next
function waitUntilPlayerCanMove(){
    //double check
    while(true){
        if(!isScriptRunning){
            return false;
        }
        if(isBattleMainPage()){
            sleep(500);
            if(isBattleMainPage()){
                return true;
            }
        }
        sleep(500);
    }
}

function waitUntilPlayerCanMoveOrFinish(){
    //double check
    while(true){
        if(!isScriptRunning){
            return false;
        }
        if(isBattleMainPage()){
            sleep(1000);
            if(isBattleMainPage()){
                return true;
            }
        }
        if(isFinishBondPage()){
            sleep(1500);
            if(isFinishBondPage()){
                return false;
            }
        }
        if(isBattleStageFailedDialog()){
            sleep(1000);
            if(isBattleStageFailedDialog()){
                return false;
            }
        }
        sleep(1000);
    }
}

function getCurrentStage(){
    var screenshot = getScreenshotResize();
    var crop = cropImage(screenshot,currentStagePosition[0],currentStagePosition[1],currentStagePosition[2],currentStagePosition[3]);
    var score = [];
    for(var i=0;i<3;i++){
        var stageImage = openImage(imagePath+"stage"+i+".png");
        score[i] = getIdentityScore(crop,stageImage);
        releaseImage(stageImage);
    }
    releaseImage(crop);
    releaseImage(screenshot);
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

function finishQuest(){
    while(isScriptRunning){
        if(isMainPage()){
            return;
        }
        tapScale(550,30);
        sleep(1500);
        if(isFinishDropDialoge()){
            tapScale(1100,660);
            sleep(1500);           
        } else if(isAddFriendPage()){
            tapScale(325,600);
            sleep(1500);
        } else if(isItemPage()){
            sleep(1000);
            if(isMainPage()){
                return;
            }
            sleep(2000);
            if(isItemPage()){
                sleep(1000);
                if(isMainPage()){
                    return;
                }
                tapScale(45,40);
                sleep(1500);
            }
        }
    }
}

loadApiCnt++;
console.log("Load in stage api finish");