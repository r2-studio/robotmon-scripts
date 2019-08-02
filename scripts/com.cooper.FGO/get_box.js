var boxResetPosition = [1105,220,95,20];
var boxFullImage;
var boxFullPosition = [475,400,325,200];
var boxNoPointImage;
var boxNoPointPosition = [240,420,130,55];

function getBox(newBox,fast){
    boxFullImage = openImage(imagePath+"boxFull.png");
    boxNoPointImage = openImage(imagePath+"boxNoPoint.png");

    var waitTime = 100;
    var checkTime = 50;
    if(fast != 1){
        waitTime = 1000;
        checkTime = 5;
    }
    if(checkIsBoxFinish()){
        if(!isScriptRunning){
            return;
        }
        if(newBox){
            resetBox();
        }else{
            console.log("此箱已抽完");
            return;
        }
    }  
    console.log("開始抽箱");
    while(isScriptRunning){
        if(checkIsBoxFinish()){
            break;
        }
        for(var t = 0;t<checkTime;t++){
            tapScale(400,477);
            sleep(waitTime);
        }
    }
    releaseImage(boxFullImage);
    releaseImage(boxNoPointImage);
    console.log("結束抽箱");
}

function checkIsBoxFinish(){
    var screenshot = getScreenshotResize();
    var r = false;
    if(checkImage(screenshot,boxFullImage,boxFullPosition[0],boxFullPosition[1],boxFullPosition[2],boxFullPosition[3])){
        console.log("禮物箱已滿");
        sendUrgentMessage(runningScriptName,"禮物箱已滿");
        releaseImage(screenshot);
        isScriptRunning = false;
        return true;
    }
    if(checkImage(screenshot,boxNoPointImage,boxNoPointPosition[0],boxNoPointPosition[1],boxNoPointPosition[2],boxNoPointPosition[3])){
        r = true;
    }
    releaseImage(screenshot);
    return r;
}

function resetBox(){
    console.log("重置箱子");
    tapScale(boxResetPosition[0] + boxResetPosition[2]/2,boxResetPosition[1] + boxResetPosition[3]/2);
    sleep(1000);
    tapScale(850,567);
    waitLoading();
    sleep(1000);
    tapScale(625,567);
    sleep(1000);
}

function getFriendPoint(){
    while(isScriptRunning){
        if(!isFriendPointMainPage()){
            console.log("請移到友抽畫面再執行");
            isScriptRunning = false;
            return;
        }
        if(isFriendPointTen()){
            tapScale(800,550);
        }else if(isFriendPointFree()){
            tapScale(625,550);
        }else if(isFriendPointContinue()){
            tapScale(750,650);
        }else{
            console.log("結束友抽");
            isScriptRunning = false;
            return;
        }
        sleep(1000);
        if(isFriendPointFull()){
            console.log("結束友抽-倉庫已滿");
            isScriptRunning = false;
            return;
        }
        tapScale(850,567);
        sleep(1000);
        while(isScriptRunning){
            sleep(2000);
            if(isFriendPointReload()){
                tapScale(750,650);
                break;
            }else if(isFriendPointNew()){
                tapScale(1090,675);
            }else if(isItemPage()){
                tapScale(45,40);
            }else if(isFriendPointContinue()){
                tapScale(750,650);
                sleep(1000);        
                if(isFriendPointFull()){
                    console.log("結束友抽-倉庫已滿");
                    isScriptRunning = false;
                    return;
                }
                tapScale(850,567);
                sleep(1000);
            }
            else {
                tapScale(750,650);
            }
        }
        sleep(2000);
    }
}

loadApiCnt++;
console.log("Load get box api finish");