var icon = [];
var iconMargin = [];

function setMarginIcon(){
	if(resolution < 17 / 9){
		return;
	}
	icon["main"][0] = realScreenSize[0] / screenScale[0] - 337;
	iconMargin["main"] = true;

	icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 220;
	iconMargin["battleMain1"] = true;

	icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 220;
	iconMargin["battleMain2"] = true;

	if(resolution <= 18 / 9){
		return
	}
	icon["teamPage"][0] = realScreenSize[0] / screenScale[0] - 305;
	icon["teamPage"][1] = realScreenSize[1] / screenScale[1] - 150;
	iconMargin["teamPage"] = true;

	icon["friendPage"][0] = 1237;
	iconMargin["friendPage"] = true;

	icon["friendEnd"][0] = realScreenSize[0] / screenScale[0] - 195;
	iconMargin["friendEnd"] = true;

	icon["friendEnd3"][0] = realScreenSize[0] / screenScale[0] - 195;
	iconMargin["friendEnd3"] = true;

	icon["battleMain3"][0] = realScreenSize[0] / screenScale[0] - 375;
	iconMargin["battleMain3"] = true;

	if(resolution > 18 / 9){
		icon["battleMain1"][0] = realScreenSize[0] / screenScale[0] - 265;
		iconMargin["battleMain1"] = true;
	
		icon["battleMain2"][0] = realScreenSize[0] / screenScale[0] - 265;
		iconMargin["battleMain2"] = true;
	}
}

function checkIconListInScreen(iconList,allPass,threshold){
    if(threshold == undefined){
        threshold = 0.85;
    }
    var screenshot = getScreenshotResize();
    if(screenshot == null){
        return false;
    }
    for(var i = 0;i<iconList.length;i++){
        var iconName = iconList[i];
        if(icon[iconName] == undefined){
            console.log("checkIconInScreen no icon");
            return false;
        }
	    var margin = 0;
	   	if(iconMargin[iconName] != true){
	   		margin = defaultMarginX;
   		}
        var iconPath = imagePath+iconName+".png";
        if(isDebug){
            console.log("checkIconInScreen open icon "+iconPath);
        }
        var iconImage = openImage(iconPath);
        var result = checkImage(screenshot,iconImage,icon[iconName][0] + margin,icon[iconName][1],icon[iconName][2],icon[iconName][3],threshold);
        releaseImage(iconImage);
        if(isDebug){
            console.log("checkIconInScreen result "+result);
        }
        if(result && !allPass){
            releaseImage(screenshot);
            return true;
        }
        if(!result && allPass){
            releaseImage(screenshot);
            return false;
        }
   }
   releaseImage(screenshot);
   return allPass;
}

function checkIconInScreen(iconName,threshold){
    if(!isScriptRunning){
        return false;
    }
    if(icon[iconName] == undefined){
       console.log("checkIconInScreen no icon");
        return false;
    }
    var screenshot = getScreenshotResize();
    if(screenshot == null){
        return false;
    }
    if(threshold == undefined){
        threshold = 0.85;
    }

    var margin = 0;
   	if(iconMargin[iconName] != true){
   		margin = defaultMarginX;
   	}
    var iconPath = imagePath+iconName+".png";
    if(isDebug){
       console.log("checkIconInScreen open icon "+iconPath);
    }
    var iconImage = openImage(iconPath);
    var result = checkImage(screenshot,iconImage,icon[iconName][0] + margin,icon[iconName][1],icon[iconName][2],icon[iconName][3],threshold);
    releaseImage(screenshot);
    releaseImage(iconImage);
    if(isDebug){
       console.log("checkIconInScreen result "+result);
    }
    return result;
}

function clickIcon(iconName){
    var margin = 0;
   	if(iconMargin[iconName] != true){
   		margin = defaultMarginX;
	}
    tapScale(icon[iconName][0] + icon[iconName][2] / 2 + margin,icon[iconName][1] + icon[iconName][3] / 2,100,0);
}
//select stage-----------------------------------------------
icon["main"] =  [1710,924,150,75];
icon["apple"] =  [795,67,300,75];
icon["selectStageItemFull"] = [487,225,900,187];
icon["selectStageServantFull"] = [487,225,900,187];

function isMainPage(){
	return checkIconInScreen("main");
}

function isStageRestart(){
	//TODO:TW
	return checkIconInScreen("stageRestart");
}

function isStageRestartEvent(){
	return false;
}

function isItemOrServantFullDialog(){
	return checkIconListInScreen(["selectStageServantFull","selectStageItemFull"],false);
}

function isUseAppleDialog(){
	return checkIconInScreen("apple",0.75);
}

//select friend-----------------------------------------------
icon["friendPage"] =  [1110,150,225,75];
icon["friendRefresh"] = [840,150,240,90];
icon["friendEnd"] = [1852,1027,60,45];
icon["friendEnd3"] = [1852,1027,60,45];
icon["friendEmpty"] = [675,630,525,60];


function isSelectFriendPage(){
	//Align left
	return checkIconInScreen("friendPage");
}

function isSelectFriendRefreshDialog()
{	//TODO
	return checkIconListInScreen(["friendRefresh"],false);
}

function isSelectFriendEnd(){
	//TODO: need check
	return checkIconListInScreen(["friendEnd","friendEnd3"],false);
}

function isSelectFriendEmpty(){
	return checkIconInScreen("friendEmpty");
}

//select team-----------------------------------------------
icon["teamPage"] =  [1702,975,172,75];

function isSelectTeamPage(){
	return checkIconInScreen("teamPage");
}

function isUseItemDialog(){
	//TODO
	return false;
}

//battle-----------------------------------------------
icon["battleMain1"] =  [1752,262,90,90];
icon["battleMain2"] =  [1752,423,90,90];
icon["battleMain3"] =  [1672,960,105,75];
icon["battleServant1"] =  [375,90,210,45];
icon["battleServant2"] =  [375,90,210,45];
icon["battleSkill"] =  [855,255,210,45];
icon["battleTarget"] =  [1620,195,60,60];
icon["spaceColor"] = [690,240,540,90];
icon["emiyaColor"] = [690,240,540,90];
icon["ultFailed"] = [900,637,123,60];
icon["skillFailed"] = [870,802,180,60];

function isBattleMainPage(){
	if(checkIconListInScreen(["battleMain1","battleMain2","battleMain3"],true,0.8)){
		//if(server == "TW"){
			return true;
		//}
		/*
		// double check ring color
		var screenshot = getScreenshotResize();
		if(checkPixel(1075,665,163,146,121,screenshot)
			&& checkPixel(1135,690,191,175,150,screenshot)
			&& checkPixel(1200,665,163,146,121,screenshot)){
			releaseImage(screenshot);
			return true;
		}
		releaseImage(screenshot);
		*/
	}
	return false;
}

function isBattleCardPage(){
	// no idea to check
	return false;
}

function isBattleServantDialog(){
	return checkIconListInScreen(["battleServant1","battleServant2"],false);
}

function isBattleSkillFailedDialog(){
	return checkIconInScreen("skillFailed");
}

function isBattleUltFailedDialog(){
	return checkIconInScreen("ultFailed");
}

function isBattleSkillDetailDialog(){
	return checkIconInScreen("battleSkill");
}

function isBattleSkillTargetDialog(){
	return checkIconInScreen("battleTarget");
}

function isBattleSkillSpaceDialog(){
	return checkIconInScreen("spaceColor",0.75);
}

function isBattleSkillEmiyaDialog(){
	if(server == "TW"){
		return false;
	}
	return checkIconInScreen("emiyaColor",0.75);
}

//finish-----------------------------------------------
icon["finishNext"] =  [1575,933,180,60];
icon["stageRestart"] =  [1140,810,240,75];
icon["stageFailed"] = [750,150,412,75];
icon["addFriend"] = [1710,135,120,37];

function isBattleStageFailedDialog(){
	//TODO: need check
	return checkIconInScreen("stageFailed");
}

function isFinishBondPage(){
	if(isFinishNext()){
		sleep(3000);
		if(isFinishNext()){
			return true;			
		}
	}
	tapScale(460,5);
	return false;
}

function isFinishNext(){
	return checkIconInScreen("finishNext");
}

function isFinishDropDialoge(){
	//TODO: need check
	//TODO:TW
	//return checkIconInScreen(28);
	return false;
}


function isAddFriendPage(){
	return checkIconInScreen("addFriend");
}

function isItemPage(){
	//TODO:
	return false;
}

//friendPoint-----------------------------------------------
icon["friendPointMain"] = [675,562,675,108];
icon["friendPointFree"] = [787,787,337,75];
icon["friendPointContinue"] = [1050,975,187,63];
icon["friendPointTen"] = [1125,787,240,75];
icon["friendPointServantFull"] = [487,225,900,187];
icon["friendPointItemFull"] = [487,225,900,187];

function isFriendPointMainPage(){
	return checkIconInScreen("friendPointMain");
}

function isFriendPointFree(){
	return checkIconInScreen("friendPointFree");
}

function isFriendPointTen(){
	return checkIconInScreen("friendPointTen");
}

/*
function isFriendPointReload(){
	//TODO: need check
	return checkIconInScreen("friendPointReload");
}
*/
function isFriendPointNew(){
	//TODO: need check
	//return checkIconInScreen(22);
	return false;
}

function isFriendPointFull(){
	//TODO: need check
	return checkIconListInScreen(["friendPointItemFull","friendPointServantFull"],false);
}

function isFriendPointContinue(){
	return checkIconInScreen("friendPointContinue");
}

function isPresentBoxFull(){
	//TODO: need check
	return checkIconInScreen(26);
}

//getbox-----------------------------------------------
icon["boxNoPoint"] =  [360,630,195,82];
icon["boxFull"] = [712,600,487,300];
icon["boxReset"] = [1657,330,142,30];

function isGetBoxNoPoint(){
	return checkIconInScreen("boxNoPoint");
}

function isGetBoxFull(){
	return checkIconInScreen("boxFull");
}

loadApiCnt++;
console.log("Load check stage api finish");