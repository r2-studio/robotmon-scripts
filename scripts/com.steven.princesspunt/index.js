importJS('RBM-0.0.3');

var developer = true;
var config = {
  appName: 'com.steven.princesspunt',
  oriScreenWidth: 1280, // source
  oriScreenHeight: 720,
  oriVirtualButtonHeight: 0,
  oriResizeFactor: 1, 
  eventDelay: 50,
  imageThreshold: 1,
  imageQuality: 100,
  resizeFactor: 1, // small -> quickly
  stoneDir: 'scripts/com.steven.prinesspunt/images',
  isRunning: false,
};

var rbm = new RBM(config);
rbm.init();

var checkOut = -1;
var friendUse = 0;

var questInfo = {
  position: {x: 0, y: 0},
  level: 1,
  levelPosition: {x: 0, y: 0}
}

var puntConfig = {
  centerX: 0, 
  centerY: 0, 
  radius: 250, 
  warning: 1,
  roleNumber: Array("0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"),
  angle: Array(0, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 80, 80, 80),
  flyDelay: Array(0, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300)
};

function findPic(fromX, fromY, toX, toY, imageName, silm){
	if(!config.isRunning) return false;
	rbm.keepScreenshotPartial(fromX, fromY, toX, toY)
	haveImage	= rbm.imageExists(imageName, silm);
	rbm.releaseScreenshot();
	return haveImage
}

function getPixelColor(intX, intY){
	if(!config.isRunning) return false;
	img = getScreenshotModify(intX, intY, 1, 1, 1, 1, 100);
	getpoint = getImageColor(img, 0, 0);
	releaseImage(img);
	colorR = getpoint.r.toString(16)
	colorG = getpoint.g.toString(16)
	colorB = getpoint.b.toString(16)
	colorHEX = rgbToHex(colorR, colorG, colorB);
	return colorHEX;
}

function rgbToHex(red, green, blue){
	if(!config.isRunning) return false;
	if(red.length == 1) red = '0' + red;
	if(green.length == 1) green = '0' + green;
	if(blue.length == 1) blue = '0' + blue;
	colorHEX = red + green + blue
	return colorHEX.toUpperCase();
}

function getGUIStr(){
	if(!config.isRunning) return false;
	color1 = this.getPixelColor(1200, 35);
	imgStr = " ";
	//console.log('color(1200, 35): ' + color1);
	switch(color1){
		case "16D0DD": 
			return "Main Page";
		case "0F6B76": 
		  color1 = getPixelColor(50, 30);
		  //return "Main Page G: " + color1
		  if(color1 == "3E483F"){
		    rbm.keepScreenshotPartial(185, 24, 536, 69);
		    if(rbm.imageExists('levelSelect.png', 0.9)){
		      imgStr = "levelSelect";
		    } else if(rbm.imageExists('friendSelect.png', 0.9)){
		      imgStr = "friendSelect";
		    } else if(rbm.imageExists('equipmentConfirm.png', 0.9)){
		      imgStr = "equipmentConfirm";
		    } else {
		      imgStr = "Main Page G - Exit - Unknown";
		    }
	      rbm.releaseScreenshot();
	      return imgStr;
		  } else if(color1 == "775C27") {
		    if(this.findPic(540, 71, 740, 111, 'questPay.png', 0.9)){
		      return "questPay";
		    } else if(this.findPic(527, 115, 752, 158, 'friendApply.png', 0.9)){
		      return "friendApply";
		    } else if(this.findPic(305, 40, 700, 128, 'loginBonus.png', 0.9)){
		      return "loginBonus";
		    } else if(this.findPic(274, 410, 360, 437, 'achievementNext.png', 0.9)){
		      return "achievementNext";
		    } else if(this.findPic(255, 152, 299, 194, 'achievement.png', 0.9)){
		      return "achievement";
		    } else if(this.findPic(732, 604, 855, 637, 'eventAdv-move.png', 0.9)){
		      return "eventAdv";
		    } else if(this.findPic(818, 593, 918, 627, 'eventBonus-close.png', 0.9)){
		      return "eventBonus";
		    } else if(this.findPic(343, 99, 387, 141, 'achievement.png', 0.9)){
		      return "friendHelpCount";
		    } else if(this.findPic(528, 174, 703, 219, 'explore-end.png', 0.9)){
		      return "explore-end";
		    } else if(this.findPic(454, 70, 823, 110, 'levelOpen.png', 0.9)){
		      return "levelOpen";
		    } else {
		      return "Main Page G - No Exit - Unknown";
		    }
		    
		  } else {
		    return "Main Page G - Unknown";
		  }
		  break;
		case "3F3416":
		  if(this.findPic(520, 45, 761, 121, 'result-fun.png', 0.9)){
		    return "result-fun";
		  } else {
		    return "Result 3F3416 - Unknown";
		  }
		  break;
		case "AF5910": 
		  if(this.findPic(181, 38, 303, 72, 'result.png', 0.9)){
		    return "result";
		  } else {
		    return "Result AF5910 - Unknown";
		  }
			break;
		case "261406":
		  if(this.findPic(181, 38, 303, 72, 'result-itemGet.png', 0.9)){
		    return "result - itemGet";
		  } else {
		    return "result 261406 - Unknown";
		  }
		  break;
		case "07181F":
		  if(this.findPic(349, 93, 939, 204, 'eventBonus-itemGet.png', 0.9)){
		    return "eventBonus-itemGet";
		  } else {
		    return "eventBonus 07181F - Unknown";
		  }
		  break;
		case "F7C147": 
			if(getPixelColor(20, 90) == "B7A076"){
			  rbm.keepScreenshotPartial(150, 580, 315, 620);
			  for(i = 1; i < 15; i ++){
			    if(rbm.imageExists('punt' + i +'.png', 0.98)){
		        imgStr = 'punt' + i;
		        break;
		      } 
			  }
			  rbm.releaseScreenshot();
			  if(imgStr == " "){
			    return "Punt Not Find";
			  } else {
			    return imgStr;
			  }
			} else {
				return "Punt - Unknown";
			}
			break;
		case "F7ED36":
		  if(this.findPic(186, 36, 274, 81, 'explore.png', 0.9)){
		    return "explore";
		  } else {
		    return "explore F7ED36 - Unknown";
		  }
		  break;
		case "7F781E":
		  if(this.findPic(588, 273, 689, 307, 'explore-exploring.png', 0.9)){
		    return "explore-exploring";
		  } else if(this.findPic(186, 36, 274, 81, 'explore-confirm.png', 0.9)) {
		    return  "explore-confirm";
		  } else {
		    return "explore 7F781E - Unknown";
		  }
		  break;
		case "4F490F":
		  if(this.findPic(186, 36, 274, 81, 'explore-result.png', 0.9)){
		    return "explore-result";
		  } else {
		    return "explore 4F490F - Unknown";
		  }
		  break;
		case "171006":
		  if(this.findPic(186, 36, 274, 81, 'explore-itemGet.png', 0.9)){
		    return "explore-itemGet";
		  } else {
		    return "explore 171006 - Unknown";
		  }
		  break;
		default:
		  if(this.findPic(205, 30, 715, 131, 'stageClear.png', 0.9)){
		    return "stageClear";
		  } else if(this.findPic(337, 85, 944, 290, 'warningConfirm.png', 0.9)) {
		    return "warningConfirm";
		  } else if(this.findPic(337, 82, 943, 270, 'warningEnter.png', 0.9)){
		    return "warningEnter";
		  } else {
		    return "Unknown";
		  }
			break;
	}
}

function main(puntConfig, questInfo){
  if(!config.isRunning) return false;
  if(developer){
    beginTime = (new Date()).getTime();
    guiStr = this.getGUIStr();
    endTime = (new Date()).getTime();
    myDate = new Date();
    if(guiStr == "Unknown" || guiStr == "Punt-Unknown" || guiStr == "Punt Not Find" || guiStr == "result"){
      
    } else {
      console.log('[' + ((myDate.getHours() + 8) % 24) + ':' + myDate.getMinutes() + ':' + myDate.getSeconds() + '] GUI: ' + guiStr + '       ms: ' + (endTime - beginTime));
    }
  } else {
    guiStr = this.getGUIStr();
  }
  
  switch(guiStr){
    case "Main Page":
      tap(questInfo.position.x, questInfo.position.y, 10);
      break;
    case "levelSelect":
      if(checkOut > -1){
        if(checkOut == 1){
          tap(questInfo.levelPosition.x, questInfo.levelPosition.y, 10);
        } else {
          tap(1100, 10, 10);
          checkOut = 1;
        }
      } else {
        tap(questInfo.levelPosition.x, questInfo.levelPosition.y, 10);
      }
      
      break;
    case "friendSelect":
      if(friendUse == 0){
        tap(640, 445, 10);
      } else {
        tap(450, 565, 10);
      }
      break;
    case "equipmentConfirm":
      tap(930, 635, 10);
      break;
    case "questPay":
      tap(480, 600, 10);
      break;
    case "friendApply":
      tap(800, 560, 10);
      break;
    case "levelOpen":
      tap(650, 600, 10);
      break;
    case "stageClear":
      tap(1000, 635, 10);
      break;
    case "result":
      tap(1000, 635, 10);
      if(checkOut > -1){
        checkOut = 0;
      }
      break;
    case "result-fun":
      tap(640, 550, 10);
      break;
    case "result - itemGet":
      tap(1000, 635, 10);
      break;
    case "eventBonus":
      tap(870, 605, 10);
      break;
    case "eventBonus-itemGet":
      tap(870, 605, 10);
      break;
    case "loginBonus":
      tap(875, 605, 10);
      break;
    case "achievementNext":
      tap(455, 545, 10);
      break;
    case "achievement":
      tap(640, 530, 10);
      break;
    case "eventAdv":
      tap(490, 620, 10);
      break;
    case "friendHelpCount":
      tap(650, 570, 10);
      break;
    case "warningConfirm":
      tap(640, 575, 10);
      break;
    case "warningEnter":
      if(puntConfig.warning == 1){
        tap(480, 575, 10);//進入
      } else {
        tap(800, 575, 10);//退出
      }
      break;
    case "explore-itemGet":
      tap(640, 620, 10);
      break;
    case "explore-confirm":
      tap(480, 635, 10);
      break;
    case "explore":
      tap(640, 630, 10);
      break;
    case "explore-end":
      tap(640, 500, 10);
      //tap(640, 630, 10);//不進入
      break;
    case "explore-exploring":
      tap(100, 50, 10);
      break;
    case "explore-result":
      tap(640, 630, 10);
    case "punt1":
      this.changeRole(puntConfig.roleNumber[1]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[1], puntConfig.flyDelay[1]);
      break;
    case "punt2":
      this.changeRole(puntConfig.roleNumber[2]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[2], puntConfig.flyDelay[2]);
      break;
    case "punt3":
      this.changeRole(puntConfig.roleNumber[3]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[3], puntConfig.flyDelay[3]);
      break;
    case "punt4":
      this.changeRole(puntConfig.roleNumber[4]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[4], puntConfig.flyDelay[4]);
      break;
    case "punt5":
      this.changeRole(puntConfig.roleNumber[5]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[5], puntConfig.flyDelay[5]);
      break;
    case "punt6":
      this.changeRole(puntConfig.roleNumber[6]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[6], puntConfig.flyDelay[6]);
      break;
    case "punt7":
      this.changeRole(puntConfig.roleNumber[7]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[7], puntConfig.flyDelay[7]);
      break;
    case "punt8":
      this.changeRole(puntConfig.roleNumber[8]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[8], puntConfig.flyDelay[8]);
      break;
    case "punt9":
      this.changeRole(puntConfig.roleNumber[9]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[9], puntConfig.flyDelay[9]);
      break;
    case "punt10":
      this.changeRole(puntConfig.roleNumber[10]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[10], puntConfig.flyDelay[10]);
      break;
    case "punt11":
      this.changeRole(puntConfig.roleNumber[11]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[11], puntConfig.flyDelay[11]);
      break;
    case "punt12":
      this.changeRole(puntConfig.roleNumber[12]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[12], puntConfig.flyDelay[12]);
      break;
    case "punt13":
      this.changeRole(puntConfig.roleNumber[13]);
      this.easyPunt(puntConfig.centerX, puntConfig.centerY, puntConfig.radius, puntConfig.angle[13], puntConfig.flyDelay[13]);
      break;
    default:
      //console.log("Main: " + guiStr);
  }
}

function findPicAttribute(imageName, silm){
  result = rbm.findImage(imageName, silm);
  if(result){
    console.log('color1(1200, 35): ' + this.getPixelColor(1200, 35));
    console.log('image information');
    console.log('position: ' + result.x + ',' + result.y);
    console.log('size: ' + result.width + ' x '+ result.height);
    console.log('range: ' + result.x + ', ' + result.y + ', ' + (result.x + result.width) + ', ' + (result.y + result.height));
    console.log("function: this.findPic(" + result.x + ', ' + result.y + ', ' + (result.x + result.width) + ', ' + (result.y + result.height) + ", '" + imageName + "', " + silm  + ")");
  } else {
    console.log('image not find');
  }
}

function getAnglePosition(formX, formY, radius, angle){
  if(!config.isRunning) return false;
  radian = (270 + angle) * Math.PI / 180;
  toX = Math.round(Math.sin(radian) * radius + formX);
  toY = Math.round(Math.cos(radian) * radius + formY);
  position = {x: toX, y: toY};
  return position;
}

function easyPunt(centerX, centerY, radius, angle, flyDelay){
  position = this.getAnglePosition(centerX, centerY, radius, angle);
  if(developer) {
    beginTime = (new Date()).getTime();
    tapDown(centerX, centerY, 40);
    sleep(300);
    moveTo(position.x, position.y, 40);
    sleep(300);
    tapUp(position.x, position.y, 40);
    sleep(flyDelay);
    tap(640, 360);
    endTime = (new Date()).getTime();
    console.log('ms: ' + (endTime - beginTime));
  } else {
    tapDown(centerX, centerY, 40);
    sleep(300);
    moveTo(position.x, position.y, 40);
    sleep(300);
    tapUp(position.x, position.y, 40);
    sleep(flyDelay);
    tap(640, 360);
  }
}

function changeRole(roleNumber){
  if(!config.isRunning) return false;
  switch(roleNumber){
    case "-3":
      tap(10, 270, 10);
      sleep(200);
      tap(10, 270, 10);
      sleep(500);
      break;
    case "-2":
      tap(10, 270, 10);
      sleep(500);
      break;
    case "-1":
      tap(90, 250, 10);
      sleep(500);
      break;
    case "0":
      break;
    case "1":
      tap(250, 90, 10);
      sleep(500);
      break;
    case "2":
      tap(270, 10, 10);
      sleep(500);
      break;
    case "3":
      tap(270, 10, 10);
      sleep(200);
      tap(270, 10, 10);
      sleep(500);
      break;
    default:
    
  }
}

function stopScriptTimer(h, m, s){
  if(!config.isRunning) return false;
  stopDate = new Date();
  stopDate.setHours(stopDate.getHours() + 8);
  stopHour = stopDate.getHours();
  stopMinutes = stopDate.getMinutes();
  stopSeconds = stopDate.getSeconds();
  // console.log(stopHour + ":" + stopMinutes + ":" + stopSeconds);
  if(stopHour >= h && stopMinutes >= m){
    return true;
  } else {
    return false;
  }
}

function setPuntConfigByQuestName(questName){
  switch(questName){
    case "exp":
      puntConfig.centerX = 516; puntConfig.centerY = 270;
      puntConfig.roleNumber[1] = "0"; puntConfig.angle[1] = 80; puntConfig.flyDelay[1] = 650;//主角斧
      puntConfig.roleNumber[2] = "0"; puntConfig.angle[2] = 80; puntConfig.flyDelay[2] = 650;//主角斧
      puntConfig.roleNumber[3] = "0"; puntConfig.angle[3] = 80; puntConfig.flyDelay[3] = 650;//主角斧
      puntConfig.roleNumber[4] = "0"; puntConfig.angle[4] = 80; puntConfig.flyDelay[4] = 650;//主角斧
      puntConfig.roleNumber[5] = "0"; puntConfig.angle[5] = 80; puntConfig.flyDelay[5] = 650;//主角斧
      puntConfig.roleNumber[6] = "0"; puntConfig.angle[6] = 80; puntConfig.flyDelay[6] = 650;//主角斧
      break;
	case "exp2015":
	  questInfo.position.x = 640; questInfo.position.y = 400; questInfo.level = 5;
      puntConfig.centerX = 516; puntConfig.centerY = 270;
	  for(i = 1; i < 11; i++){
		puntConfig.roleNumber[i] = "-1";
		puntConfig.angle[i] = 45;
		puntConfig.flyDelay[i] = 3200;
	  }
	case "exp2015-event":
	  questInfo.position.x = 640; questInfo.position.y = 400; questInfo.level = 25;
      puntConfig.centerX = 516; puntConfig.centerY = 270;
	  for(i = 1; i < 11; i++){
		puntConfig.roleNumber[i] = "-1";
		puntConfig.angle[i] = 45;
		puntConfig.flyDelay[i] = 3200;
	  }
      break;
    case "Experience the True awake New Weapon - 騎士":
      console.log("Experience the True awake New Weapon - 騎士");
	  questInfo.position.x = 640; questInfo.position.y = 400; questInfo.level = 25;
      puntConfig.centerX = 473; puntConfig.centerY = 488;
      puntConfig.roleNumber[1] = "-2"; puntConfig.angle[1] = 20; puntConfig.flyDelay[1] = 2300;//審判
      puntConfig.roleNumber[2] = "2"; puntConfig.angle[2] = 20; puntConfig.flyDelay[2] = 2300;//歌舞技
      puntConfig.roleNumber[3] = "1"; puntConfig.angle[3] = 20; puntConfig.flyDelay[3] = 2300;//死靈
      puntConfig.roleNumber[4] = "0"; puntConfig.angle[4] = 20; puntConfig.flyDelay[4] = 2300;
      puntConfig.roleNumber[5] = "0"; puntConfig.angle[5] = 20; puntConfig.flyDelay[5] = 2300;
      break;
    case "Experience the True awake New Weapon - 超人":
      console.log("Experience the True awake New Weapon - 超人");
      puntConfig.centerX = 473; puntConfig.centerY = 441;
      puntConfig.roleNumber[1] = "-1"; puntConfig.angle[1] = 25; puntConfig.flyDelay[1] = 2800;//死靈
      puntConfig.roleNumber[2] = "-1"; puntConfig.angle[2] = 80; puntConfig.flyDelay[2] = 650;//斧
      puntConfig.roleNumber[3] = "-1"; puntConfig.angle[3] = 80; puntConfig.flyDelay[3] = 650;//死靈
      puntConfig.roleNumber[4] = "-1"; puntConfig.angle[4] = 80; puntConfig.flyDelay[4] = 650;//死靈
      puntConfig.roleNumber[5] = "-1"; puntConfig.angle[5] = 80; puntConfig.flyDelay[5] = 650;//死靈
      puntConfig.roleNumber[6] = "-1"; puntConfig.angle[6] = 80; puntConfig.flyDelay[6] = 650;//死靈
      break;
    case "The Blessings of Nature":
      console.log("The Blessings of Nature");
      puntConfig.centerX = 482; puntConfig.centerY = 407;
      puntConfig.roleNumber[1] = "-1"; puntConfig.angle[1] = 80; puntConfig.flyDelay[1] = 650;
      puntConfig.roleNumber[2] = "-1"; puntConfig.angle[2] = 80; puntConfig.flyDelay[2] = 650;
      puntConfig.roleNumber[3] = "-1"; puntConfig.angle[3] = 80; puntConfig.flyDelay[3] = 650;
      puntConfig.roleNumber[4] = "-1"; puntConfig.angle[4] = 80; puntConfig.flyDelay[4] = 650;
      puntConfig.roleNumber[5] = "-1"; puntConfig.angle[5] = 80; puntConfig.flyDelay[5] = 650;
      puntConfig.roleNumber[6] = "-1"; puntConfig.angle[6] = 80; puntConfig.flyDelay[6] = 650;
      puntConfig.roleNumber[7] = "-1"; puntConfig.angle[7] = 80; puntConfig.flyDelay[7] = 650;
      puntConfig.roleNumber[8] = "-1"; puntConfig.angle[8] = 80; puntConfig.flyDelay[8] = 650;
      puntConfig.roleNumber[9] = "-1"; puntConfig.angle[9] = 80; puntConfig.flyDelay[9] = 650;
      puntConfig.roleNumber[10] = "-1"; puntConfig.angle[10] = 80; puntConfig.flyDelay[10] = 650;
      break;
    default:
      break;
  }
}

function setQuestPositionByQuestLevel(questLevel){
	switch(questLevel){
		case 1: questInfo.levelPosition.x = 280; questInfo.levelPosition.y = 300; break;
		case 2: questInfo.levelPosition.x = 460; questInfo.levelPosition.y = 300; break;
		case 3: questInfo.levelPosition.x = 640; questInfo.levelPosition.y = 300; break;
		case 4: questInfo.levelPosition.x = 820; questInfo.levelPosition.y = 300; break;
		case 5: questInfo.levelPosition.x = 1000; questInfo.levelPosition.y = 300; break;
		case 6: questInfo.levelPosition.x = 280; questInfo.levelPosition.y = 220; break;
		case 7: questInfo.levelPosition.x = 460; questInfo.levelPosition.y = 220; break;
		case 8: questInfo.levelPosition.x = 640; questInfo.levelPosition.y = 220; break;
		case 9: questInfo.levelPosition.x = 820; questInfo.levelPosition.y = 220; break;
		case 10: questInfo.levelPosition.x = 1000; questInfo.levelPosition.y = 220; break;
		case 11: questInfo.levelPosition.x = 280; questInfo.levelPosition.y = 550; break;
		case 12: questInfo.levelPosition.x = 460; questInfo.levelPosition.y = 550; break;
		case 13: questInfo.levelPosition.x = 640; questInfo.levelPosition.y = 550; break;
		case 14: questInfo.levelPosition.x = 820; questInfo.levelPosition.y = 550; break;
		case 15: questInfo.levelPosition.x = 1000; questInfo.levelPosition.y = 550; break;
		
		case 21: questInfo.levelPosition.x = 280; questInfo.levelPosition.y = 400; break;
		case 22: questInfo.levelPosition.x = 460; questInfo.levelPosition.y = 400; break;
		case 23: questInfo.levelPosition.x = 640; questInfo.levelPosition.y = 400; break;
		case 24: questInfo.levelPosition.x = 820; questInfo.levelPosition.y = 400; break;
		case 25: questInfo.levelPosition.x = 1000; questInfo.levelPosition.y = 400; break;
		
		case 99: questInfo.levelPosition.x = 640; questInfo.levelPosition.y = 300; break;
		default:
			break;
	}
}

function stop(){
  config.isRunning = false;
  console.log("My Scripts Stop");
}

function start(viewSettings){
  config.isRunning = true;
  console.log('Scripts Start');

  inputCenterX = 516;
  inputCenterY = 270;
  
  console.log('Loading View Settings');
  checkOut = Number(viewSettings.checkOut);
  friendUse = Number(viewSettings.friendUse);
  questInfo.position.x = Number(viewSettings.questPosition.x);
  questInfo.position.y = Number(viewSettings.questPosition.y);
  questInfo.level = Number(viewSettings.questLevel);
  puntConfig.centerX = Number(viewSettings.puntPosition.x);
  puntConfig.centerY = Number(viewSettings.puntPosition.y);
  puntConfig.warning = Number(viewSettings.warning);
  qName = String(viewSettings.questName);
  
  for(i = 1; i < 11; i++){
    puntConfig.roleNumber[i] = String(viewSettings.puntSetting[i].roleNumber);
    puntConfig.angle[i] = Number(viewSettings.puntSetting[i].angle);
    puntConfig.flyDelay[i] = Number(viewSettings.puntSetting[i].flyDelay);
  }
  if(qName.length > 0){
	  this.setPuntConfigByQuestName(qName);
  }
  this.setQuestPositionByQuestLevel(questInfo.level);
  console.log('Load View Settings Success');
  
  // questName = "";
  // // questName = "Experience the True awake New Weapon - 超人";
  // this.setPuntConfigByQuestName(questName);
  

  
  scriptsActive = true;
  while(scriptsActive){
    // if(this.stopScriptTimer(9, 59, 0)){
    //   console.log("Times up!! Scripts auto stop");
    //   scriptsActive = false;
    //   break;
    // }
    this.main(puntConfig, questInfo);
    sleep(500);
  }
  
  console.log('Scripts End');
}
// this.start(mySetting);
// this.stop();
config.isRunning = true;
console.log(this.getGUIStr());
config.isRunning = false;
// if(gui.indexOf("Unknown") >= 0){
//config.isRunning = true;
//console.log(this.getGUIStr());
// this.findPicAttribute('eventBonus-itemGet.png', 0.90);
// } else {
//   console.log("GUI: " + gui);
// }
