//-----------------------------------------------------in quest
//var skillPositionX = [75,225,375,562,712,802,1050,1200,1350];
var skillPositionX = [75,207,339,552,683,816,1028,1160,1292];
var skillPositionY = 850;
var skillTargetX = [487,937,1387];
var skillTargetY = 637;
var clothSkillOffsetX = 130;
var clothSkillY = 475;
var enemyPositionX = [870,510,172];
var enemyPositionY = 63;
var currentStagePosition = [1317,18,37,37];

var cardPositionX = [187,600,937,1350,1762];
var cardPositionY = 775;
var ultPositionX = [600,937,1350];
var ultPositionY = 187;

var emiyaUltPositionX = [1125,675];
var spaceUltPositionX = [1350,900,450];
var spaceUltPositionY = 675;
var spaceUltColor = 2;
var colorName = ["紅","藍","綠"];

var useMargin = undefined;
//----------------------------------------------Battle main page
function setInStageMargin(){
    useMargin = 0;
    var leftMargin = defaultMarginX;
    currentStagePosition[0] = realScreenSize[0] / screenScale[0] - 656;
    if(resolution > 18/9){
        leftMargin = 75;
        skillPositionY = 850 - 24;
    }
    skillPositionX[0] = 75 + leftMargin;
    skillPositionX[1] = 225 + leftMargin;
    skillPositionX[2] = 375 + leftMargin;
    skillPositionX[3] = 562 + leftMargin;
    skillPositionX[4] = 712 + leftMargin;
    skillPositionX[5] = 802 + leftMargin;
    skillPositionX[6] = 1050 + leftMargin;
    skillPositionX[7] = 1200 + leftMargin;
    skillPositionX[8] = 1350 + leftMargin;

    enemyPositionX[0] = 870 + leftMargin;
    enemyPositionX[1] = 510 + leftMargin;
    enemyPositionX[2] = 172 + leftMargin;
}

function useSkill(player,skill,target){
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    console.log("使用技能 從者 "+(player+1)+", 技能 "+(skill+1)+", 目標 "+(target+1));
    skillUsedInLoop[player*3+skill] = true;
    tapScale(skillPositionX[player*3+skill],skillPositionY,undefined,useMargin);
    sleep(1000);
    if(!isScriptRunning){
        return;
    }
    if(isBattleServantDialog()){        
        console.log("使用技能-無此技能");
        //skill null
        tapScale(1575,127);
    }
    else if(isBattleSkillFailedDialog()){
        //skill can not use
        console.log("使用技能-條件未達成，無法使用");
        tapScale(960,832);
    }
    else if(isBattleSkillDetailDialog()){
        //need confirm or in cd
        console.log("使用技能-確認畫面");
        tapScale(1275,637);
        sleep(1000);
        if(isBattleSkillDetailDialog()){
            //in cd
            console.log("使用技能-技能無法使用");
            tapScale(600,637);
            return;
        }
    }

    if(!isScriptRunning){
        return;
    }
    if(isBattleSkillSpaceDialog()){
        if(spaceUltColor == undefined || spaceUltColor < 0 || spaceUltColor > 2){
            console.log("未指定顏色，設為綠色");
            spaceUltColor = 2;
        }
        console.log("使用技能-宇宙伊斯塔寶具顏色 "+colorName[spaceUltColor]);
        tapScale(spaceUltPositionX[spaceUltColor],spaceUltPositionY);
    }else if(isBattleSkillEmiyaDialog()){
        if(spaceUltColor == undefined || spaceUltColor < 0 || spaceUltColor >= 2){
            console.log("未指定顏色，設為藍色");
            spaceUltColor = 1;
        }
        console.log("使用技能-紅A寶具顏色 "+colorName[spaceUltColor]);
        tapScale(emiyaUltPositionX[spaceUltColor],spaceUltPositionY);
    }else if(isBattleSkillTargetDialog()){
        console.log("使用技能-選擇目標");
        if(target == undefined || target < 0){
            console.log("未設定目標，強迫選擇從者1");
            target = 0;
        }
        selectSkillTarget(target);
    // }else if(target >= 0){
    //     sleep(1500);
    //     console.log("無法偵測目標從者視窗，強迫選擇好友");
    //     selectSkillTarget(target);
    }else{
        console.log("使用技能-技能動畫中");
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
    console.log("使用衣服技能 "+(skill+1));
    clickIcon("battleMain2");
    sleep(1000);
    tapScale(icon["battleMain2"][0] - clothSkillOffsetX * (3 - skill),clothSkillY,undefined,0);
    sleep(1000);
    if(isBattleSkillDetailDialog()){
        console.log("使用衣服技能-確認畫面");
        tapScale(1275,637);
        sleep(500);
        if(isBattleSkillDetailDialog()){
            //in cd
            console.log("使用衣服技能-技能無法使用");
            tapScale(600,637);
            sleep(1000);
            tapScale(1800,475);
            return;
        }        
    }
    if(isBattleSkillTargetDialog()){
        if(target1 == undefined || target1 < 0){
            target1 = 0;
        }
        console.log("使用衣服技能-選擇目標");
        selectSkillTarget(target1);
    }else if(target1!=undefined && target2 !=undefined && target2 >= 0 && skill == 2){
        console.log("使用衣服技能-選擇換人目標");
        changePlayer(target1,target2);
    }
    sleep(1000);    
    if(isBattleServantDialog()){
        //skill null
        tapScale(1575,127);
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
    skillUsedInLoop[target1 * 3] = false;
    skillUsedInLoop[target1 * 3 + 1] = false;
    skillUsedInLoop[target1 * 3 + 2] = false;
    tapScale(207 +(300*target1),552);
    sleep(300);
    tapScale(207 +(300*target2),552);
    sleep(300);
    tapScale(975,945);
}

//-------------------------------------------------------Battle card apge
function startAttack(){ 
    if(!isScriptRunning){
        return;
    }
    if(!waitUntilPlayerCanMove()){
        return;
    }
    clickIcon("battleMain3");
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
        tapScale(960,660);
        sleep(500);
    }
}

//---------------------------------------------Battle next
function waitUntilPlayerCanMove(){
    //double check
    while(isScriptRunning){
        if(isBattleMainPage()){
            sleep(500);
            if(isBattleMainPage()){
                return true;
            }
        }
        sleep(500);
    }
    return false;
}

function waitUntilPlayerCanMoveOrFinish(){
    //double check
    while(isScriptRunning){
        if(isBattleMainPage()){
            sleep(1000);
            if(isBattleMainPage()){
                return true;
            }
        }
        if(isFinishBondPage()){
            return false;
        }
        if(isBattleStageFailedDialog()){
            sleep(1000);
            if(isBattleStageFailedDialog()){
                return false;
            }
        }
        sleep(1000);
    }
    return false;
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
            sleep(3000);
            return;
        }else if(isStageRestart()){
            sleep(1000);
            return;
        }
        tapScale(460,5);
        sleep(1500);
        if(isFinishDropDialoge() || isFinishNext()){
            tapScale(1650,990);
            sleep(1500);           
        }else if(isAddFriendPage()){
            tapScale(487,900);
            sleep(1500);
        }else if(isItemPage()){
            sleep(1000);
            if(isMainPage()){
                return;
            }
            sleep(2000);
            if(isItemPage()){
                sleep(1000);
                if(isMainPage()){
                    sleep(3000);
                    return;
                }
                tapScale(67,60);
                sleep(1500);
            }
        }
    }
}

function setSpaceUltColor(color){    
    spaceUltColor = color;
    console.log("設定改變寶具顏色 - "+colorName[spaceUltColor]);
}

loadApiCnt++;
console.log("Load in stage api finish");