
var iconName = ["main","apple","friendPage","friendRefresh","teamPage","teamItem",
"battleMain1","battleMain2","battleMain3","finish1","finish2",
"battleServant","battleSkill","battleTarget","addFriend","ultFailed",
"stageFailed","skillFailed","itemDetail","friendPointMain","friendPointFree",
"friendPointTen","friendPointNew","friendPointReload","friendPointItemFull","friendPointServantFull",
"selectStageItemFull","selectStageServantFull","finishDrop","finish3"];
var iconPosition = [[1140,650,100,50],[530,30,200,60],[740,100,150,50],[560,100,160,60],[1135,650,115,50],[400,50,400,50],
[1168,175,60,60],[1168,282,60,60],[1100,630,70,50],[60,150,240,50],[700,320,280,40],
[560,70,150,40],[570,170,140,30],[1080,130,40,40],[60,70,100,55],[600,425,82,40],
[500,100,275,50],[580,535,120,40],[0,0,70,80],[450,375,450,72],[525,525,225,50],
[750,525,160,50],[1015,650,150,50],[700,650,125,42],[325,150,600,125],[325,150,600,125],
[325,150,600,125],[325,150,600,125],[150,70,170,40],[700,350,280,40]];
//select stage
function isMainPage(){
	return checkIconInScreen(0);
}

function isItemOrServantFullDialog(){
	return checkIconListInScreen([26,27],false);
}

function isUseAppleDialog(){
	return checkIconInScreen(1);
}

//select friend
function isSelectFriendPage(){
	return checkIconInScreen(2);
}

function isSelectFriendRefreshDialog(){
	return checkIconInScreen(3);
}

//select team
function isSelectTeamPage(){
	return checkIconInScreen(4);
}

function isUseItemDialog(){
	return checkIconInScreen(5);
}

//battle
function isBattleMainPage(){
	return checkIconListInScreen([6,7,8],true,0.8);
}

function isBattleCardPage(){
	// no idea to check
	return false;
}

function isBattleServantDialog(){
	return checkIconInScreen(11);
}

function isBattleSkillFailedDialog(){
	return checkIconInScreen(17);
}

function isBattleSkillDetailDialog(){
	return checkIconInScreen(12);
}

function isBattleSkillTargetDialog(){
	return checkIconInScreen(13);
}

function isBattleUltFailedDialog(){
	return checkIconInScreen(15);
}

function isBattleStageFailedDialog(){
	return checkIconInScreen(16);
}

//finish
function isFinishBondPage(){
	return checkIconListInScreen([9,10,29],false);
}

function isFinishDropDialoge(){
	return checkIconInScreen(28);
}

function isAddFriendPage(){
	return checkIconInScreen(14);
}

function isItemPage(){
	return checkIconInScreen(18);
}

function isFriendPointMainPage(){
	return checkIconInScreen(19);
}

function isFriendPointFree(){
	return checkIconInScreen(20);
}

function isFriendPointTen(){
	return checkIconInScreen(21);
}

function isFriendPointNew(){
	return checkIconInScreen(22);
}

function isFriendPointReload(){
	return checkIconInScreen(23);
}

function isFriendPointFull(){	
	return checkIconListInScreen([24,25],false);
}

function isPresentBoxFull(){
	return checkIconInScreen(26);
}

function checkAllPage(){
	var name = ["main","itemFull","apple","friend","refresh","team","item","battleMain","battleCard","battleServant","skillFailed","skillDetail","skillTarget","ultFailed","stageFailed","bond","addFriend","item"];
	var result = [];
	result[0] = isMainPage();
	result[1] = isItemOrServantFullDialog();
	result[2] = isUseAppleDialog();
	result[3] = isSelectFriendPage();
	result[4] = isSelectFriendRefreshDialog();
	result[5] = isSelectTeamPage();
	result[6] = isUseItemDialog();
	result[7] = isBattleMainPage();
	result[8] = isBattleCardPage();
	result[9] = isBattleServantDialog();
	result[10] = isBattleSkillFailedDialog();
	result[11] = isBattleSkillDetailDialog();
	result[12] = isBattleSkillTargetDialog();
	result[13] = isBattleUltFailedDialog();
	result[14] = isBattleStageFailedDialog();
	result[15] = isFinishBondPage();
	result[16] = isAddFriendPage();
	result[17] = isItemPage();
	var inPage = false;
    for(var i = 0;i<result.length;i++){
    	if(result[i]){
    		inPage = true;
    		console.log("is in page "+name[i]);
    	}
    }
    if(!inPage){
    	console.log("not in any page");
    }
}

loadApiCnt++;
console.log("Load check stage api finish");