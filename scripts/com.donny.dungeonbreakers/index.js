importJS('RBM-0.0.3');

// ============================breakdrongeonheros=============================== //

var config = {
  appName: 'com.donny.dungeonbreakers',
  oriScreenWidth: 1280, // source
  oriScreenHeight: 720,
  oriVirtualButtonHeight: 0,
  oriResizeFactor: 1, 
  eventDelay: 500,
  imageThreshold: 1,
  imageQuality: 100,
  resizeFactor: 1, // small -> quickly
  stoneDir: 'scripts/com.donny.breakdrongeonheros/images',
  isRunning: false,
  PackangName: 'com.linktown.dungeonbreakers',
  LaunchActivityName: 'com.linktown.dungeonbreakers.MainActivity',
  
  BrowerPackangName:'com.android.browser',
  BrowerLaunchActivityName: 'com.android.browser.BrowserActivity',
};

var rbm = new RBM(config);
rbm.init();

function usingTimeString(startTime) {
  return '循環時間：' + (Date.now() - startTime) + 'ms';
}

function num_Recognition(x1, y1, x2, y2, numstr) { //數字辨識
	//console.log('數字辨識-測試function');
	var Character = { 
	    'Attributes':[
	        {'No':0, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':1, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':2, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':3, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':4, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':5, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	        {'No':6, 'Value':0, 'x':0, 'y':'', 'Rank':''}, 
	    ], 
	}; 	
	
	//抓圖辨識數字及x位置
	rbm.keepScreenshotPartial(x1, y1, x2, y2);
	var arrynum = 1
	for (var i = 0; i <= 9; i++) {
			
		var results = rbm.findImages(numstr + i + '.png', 0.96, 6, false, false);
		//rbm.log(i, rbm.findImages(numstr + i + '.png', 0.90, 6, true, false));
		//rbm.log(i, rbm.findImages(numstr + '2-' + i + '.png', 0.90, 6, false, false));
		
		for (var index in results){
			var result = results[index];
			//rbm.log(i, numstr + i + '.png', result.x, result.y, result.score)
			Character.Attributes[arrynum].Value = i;
			Character.Attributes[arrynum].x = result.x;
			Character.Attributes[arrynum].y = result.y;
			
			arrynum = arrynum + 1
		}
	}
	rbm.releaseScreenshot();
	
	Character.Attributes = Character.Attributes.sort(function (a, b) {
		return a.x < b.x ? 1 : -1;
	});
	
	var Resultvalue = 0
	
	for (var k = 0; k <= 6; k++) {
		Resultvalue = Resultvalue + Character.Attributes[k].Value * Math.pow(10,k);
	}
	
	return Resultvalue
}

function tapitem(x1,y1,x2,y2,tapimage,str,sly,s){ //重複找圖點擊, str:輸入 '' 為不顯示。
	rbm.keepScreenshotPartial(x1, y1, x2, y2);
	rbm.imageClick(tapimage, sly);
	rbm.releaseScreenshot();
	if (str != '') console.log(str);
	sleep(s);
}

//主流程函數區//

function main(){ //主流程執行
	for (var i = 1; i <= 2; i++){
		if (!config.isRunning) return false;
		
		console.log('Main-i=',i);
		
		     if (  i < 2 ) returnStageset(returnStage); //關卡回歸
		else if (i%2 == 0) tapADRuby(45);  //廣告拿寶石
		
		tapGoblin(90);
	}
	
	checkDebug();
}

function returnStageset(setStage){ //關卡回歸
	console.log('關卡回歸')
	if (!config.isRunning ) return false;
	if (returnStageswitch == 0 && returnLimitTimeSec == 0) return false;
	
	var returnCheck = 0;
	
	var sizeObj = getScreenSize();
	if (sizeObj.width == 1280){
		tap(455, 38); sleep(500);
		tap(455, 38); sleep(500);
		rbm.keepScreenshotPartial(550, 50, 610, 90);  //確認在回歸視窗
		var targetImg = rbm.imageExists('WindowReturn.png', 0.95);
		rbm.releaseScreenshot();
		//console.log('WindowReturn.png:', targetImg);

		if (targetImg) {
			Stage = num_Recognition(950, 294, 1031, 320, 'ReturnStage_Num_') * 1
			console.log('Stage=', Stage, '; LimitStage=', LimitStage)
			//console.log('1111')
			if (returnStageswitch == 1){  //自動回歸：關卡設定
				if (Stage < setStage) {   //關卡未達回歸關卡
					console.log('關卡：', Stage + '/' + setStage + ',未達到回歸關卡');
				}
				else if (Stage >= setStage) { //指定大於/等於關卡後轉生
					returnCheck = 1;
					console.log('自動回歸-關卡：', Stage + '/' + setStage + ' ,關卡達到')
				}
			}

			if (returnLimitTimeSec != 0){  //自動回歸：卡關時間
				if (Stage > LimitStage) {
					console.log('自動回歸-時間：', Stage + '>' + LimitStage + ' ,無卡關')
					LimitStage = Stage;
					returnLimitTimer = Date.now();
				}
				else if (Stage <= LimitStage){
					returnLimitTimer = Math.round(( Date.now() - returnLimitTimer ) / 1000 )
					if (returnLimitTimer >= returnLimitTimeSec){
						returnCheck = 1;
						console.log('自動回歸-時間：', returnLimitTimer + '/' + returnLimitTimeSec + ' ,達到回歸關卡,回歸')
					}
				}
			}
			
			if (returnCheck == 0){
				tap(170, 385); sleep(50);
				tap(170, 385); sleep(50);
			}
			else if (returnCheck == 1){
				rbm.keepScreenshotPartial(700, 590, 770, 650);  //點擊回歸，進行回歸
				var targetImg = rbm.imageClick('ReturnButton.png', 0.95);
				rbm.releaseScreenshot();
				sleep(1000);
			}
			
			
			sleep(800);
		}
		else {
			console.log('不在回歸視窗')
		}
	}
}

function tapGoblin(setTimes){ //點擊哥布林(錢袋夢)(畫面連點)
	console.log('點擊哥布林(錢袋夢)(畫面連點)')
	if (!config.isRunning) return false;
	
	var sizeObj = getScreenSize();
	if (sizeObj.width == 1280){
		for (var i = 1; i <= setTimes; i++){
			sleep(100)
			if (!config.isRunning) return false;
			
			if (tapGoblinswitch == 1){
				if (i <= 2){
					tap(170, 385); sleep(50);
					tap(170, 385); sleep(50);
					tap(170, 385); sleep(50);
				}
				else {
					tap(170, 385); sleep(50); //防呆用
					
					tap(310, 425); sleep(50);
					tap(515, 425); sleep(50);
				}
			}
			else if (tapGoblinswitch == 0){
				sleep(150);
			}
			if (i%10 == 0){
				console.log('i= ', i)
			}
		}
	}
	
	sleep(500);
}

function tapADRuby(waitTime){ //檢查是否有廣告看拿寶石
	console.log('檢查是否有廣告看拿寶石')
	for (var i = 1; i <= 3; i++){
		if (!config.isRunning || getADRubyswitch == 0) return false;
		
		var sizeObj = getScreenSize();
		if (sizeObj.width == 1280){
			console.log(sizeObj.width, sizeObj.height);
			rbm.keepScreenshotPartial(690, 10, 735, 45);  //點擊上方鑽石進入快速補給
			rbm.imageClick('mainrubyicon.png', 0.95);
			rbm.releaseScreenshot();
			console.log('mainrubyicon.png');
			sleep(500);
		}
		
		var sizeObj = getScreenSize();
		if (sizeObj.width == 1280){
			rbm.keepScreenshotPartial(570, 170, 710, 220);  //快速補給選單點擊 紅寶石頁籤
			var targetImg = rbm.imageExists('Rubysheet.png', 0.95);
			rbm.releaseScreenshot();
			console.log('Rubysheet.png');

			if (targetImg) {
				rbm.imageClick('Rubysheet.png', 0.95);
			}			
			else{
				watiAD(waitTime);	
			}	
		}
	}
	sleep(500);	
}

function watiAD(waitTime) { //自動等待時間廣告(ESC版)
	console.log('自動等待時間廣告(ESC版)')
	if (!config.isRunning ) return false;

	var sizeObj = getScreenSize();
	if (sizeObj.width == 1280){
		rbm.keepScreenshotPartial(470, 530, 550, 620); //確認可以看廣告拿鑽
		var targetImg1 = rbm.imageExists('ADRubycheck.png', 0.95);
		rbm.releaseScreenshot();
		if (targetImg1) {
			for (var i = 0; i < waitTime; i++){
				if (!config.isRunning) return false;
				
				var sizeObj = getScreenSize();
				if (sizeObj.width == 1280){
					rbm.keepScreenshotPartial(470, 530, 550, 620);
					var targetImg2 = rbm.imageExists('ADRubycheck.png', 0.95);
					rbm.releaseScreenshot();
					if (targetImg2) {
						rbm.imageClick('ADRubycheck.png', 0.95);
						console.log('ADRubycheck.png');
					}			
					else{
						keycode('BACK', 100); 
						//console.log('BACK');
					}
				}
				
				sleep(1000);
				console.log('AD Time: ', i, '秒')
				
				var sizeObj = getScreenSize();
				if (sizeObj.width == 1280){
					rbm.keepScreenshotPartial(500, 500, 770, 630);  //出現確認按鈕跳出檢查
					var targetImg3 = rbm.imageExists('okbutton.png', 0.95);
					rbm.releaseScreenshot();
					if (targetImg3) {
						rbm.imageClick('okbutton.png', 0.95);
						console.log('okbutton.png');
						return false;
					}
				}
			}
		}
	}
}

function checkDebug(){ //檢查卡畫面
	console.log('檢查卡畫面')
	var sizeObj = getScreenSize();
	if (sizeObj.width == 1280){
		rbm.keepScreenshotPartial(500, 500, 770, 630);  //出現確認按鈕跳出檢查
		rbm.imageClick('okbutton.png', 0.95);
		rbm.releaseScreenshot();
		console.log('okbutton.png');
		sleep(100);
	}
}

function pause(){
	while(config.isRunning) {
		sleep(1000);
	}
}


//config.isRunning = true;	
for(var n = 0; n <= 0; n++) {
	if (!config.isRunning) break;
	if (n == 1) {

	}
	else if (n > 1) {
		
	}
	
	console.log('n = '+ n);
}

function stop() {
	config.isRunning=false;
}

function start(returnStageC, stageNum_thC, stageNum_huC, stageNum_teC, stageNum_orC, returnLimitTimeC, hidoutLvC, herosLvC, getADRubyC, tapGoblinC) {
	rbm.init();
	config.isRunning = true;
	
	returnStageswitch = returnStageC;    //自動回歸,指定關卡開關
	returnStage = stageNum_thC + stageNum_huC + stageNum_teC + stageNum_orC; //回歸,指定關卡(千/佰/拾位)
	returnLimitTimeSec = returnLimitTimeC * 60;  //自動回歸,卡關時間 分鐘→秒
	console.log('returnStageswitch=', returnStageC, '; returnStage=', returnStage, '; returnLimitTimeSec=', returnLimitTimeSec)
	
	hidoutLv = hidoutLvC;               //基地,等級目標
	herosLvswitch = herosLvC;           //英雄等級升級
	console.log('hidoutLv=', hidoutLvC, '; herosLvswitch=', herosLvC)
	
	getADRubyswitch = getADRubyC;       //看廣告拿紅寶石
	tapGoblinswitch = tapGoblinC;       //點擊錢袋哥布林
	console.log('getADRubyswitch=', getADRubyC, '; tapGoblinswitch=', tapGoblinC)
	
	
	returnLimitTimer = Date.now();      //自動回歸-時間初值
	LimitStage = 1;                     //自動回歸-極限關卡初值
	
	while(config.isRunning) {
		main();
	}
}