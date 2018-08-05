function getBox(newBox,fast){
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
            console.log("box already empty, please reset");
            return;
        }
    }  
    console.log("start getbox");
    while(isScriptRunning){
        for(var t = 0;t<checkTime;t++){
            tapScale(800,955,100);
            sleep(waitTime);
        }
        if(checkIsBoxFinish()){
            break;
        }
    }
    console.log("finish getbox");
}

function getFriendPoint(){
    while(true){
        if(!isScriptRunning){
            return;
        }
        var screenShot = getScreenshot();
        if(!checkImage(screenShot,friendPointCheckImage,750,750,1100,145)){
            console.log("not in friend point page");
            sleep(10000);
            continue;
        }
        if(checkImage(screenShot,friendPointTenImage,1500,1050,320,100)){
            tapScale(1600,1100,100);
        }
        else if(checkImage(screenShot,friendPointFreeImage,1050,1050,450,100)){
            tapScale(1250,1100,100);
        }else{
            releaseImage(screenShot);
            return;
        }
        releaseImage(screenShot);
        sleep(1000);

        var screenShot2 = getScreenshot();
        if(checkImage(screenShot2,friendPointFullImage,650,300,1200,250)){
            console.log("item box full");
            releaseImage(screenShot2);
            return;
        }else if(checkImage(screenShot2,friendPointFullImage2,650,300,1200,250)){
            console.log("item box full");
            releaseImage(screenShot2);
            return;
        }
        releaseImage(screenShot2);

        tapScale(1700,1135,100);
        sleep(1000);

        while(true){
            if(!isScriptRunning){
                return;
            }
            var screenShot3 = getScreenshot();
            if(checkImage(screenShot3,friendPointReloadImage,1400,1300,250,85)){
                tapScale(1500,1300,100);
                sleep(3000);
                releaseImage(screenShot3);
                break;
            }else if(checkImage(screenShot3,friendPointNew,2030,1300,300,100)){
                tapScale(2180,1350,100);
                sleep(5000);
            }else if(checkImage(screenShot3,friendPointBack,60,25,60,115)){
                tapScale(90,80,100);
                sleep(5000);
            }else{
                tapScale(1700,1135,100);
                sleep(3000);    
            }
            releaseImage(screenShot3);
        }
    }
}

function checkIsBoxFinish(){
    var screenShot = getScreenshot();
    var r = false;
    if(checkImage(screenShot,presentBoxFullImgae,950,800,650,400)){
        console.log("Present box full");
        sendUrgentMessage(runningScriptName,"Present box full");
        releaseImage(screenShot);
        isScriptRunning = false;
        return true;
    }
    if(checkImage(screenShot,checkBoxImage,2210,360,190,40)){
        sleep(1000);
        var screenShot2 = getScreenshot();
        if(checkImage(screenShot2,checkBoxPointImage,500,800,250,200)){
            r = true;
        }
        releaseImage(screenShot2);
    }
    releaseImage(screenShot);
    return r;
}

function resetBox(){
    console.log("reset box");
    tapScale(2300,400,100);
    sleep(1000);
    tapScale(1700,1135,100);
    waitLoading();
    sleep(1000);
    tapScale(1250,1135,100);
    sleep(1000);
}

loadApiCnt++;
console.log("Load get box api finish");