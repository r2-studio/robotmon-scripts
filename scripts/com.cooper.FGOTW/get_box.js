function getBox(newBox){
    if(newBox == 1 && checkIsBoxFinish()){
        resetBox();
    }
    var clickCnt = 0;
    while(true){
        if(!isScriptRunning){
            return;
        }
        if(clickCnt % 10 == 0 && checkIsBoxFinish()){
            return;
        }
        clickCnt++;
        if(clickCnt > 200){
            return;
        }
        tapScale(800,955,1000);
        sleep(1000);
    }
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
    return checkPixel(2100,500,74,125,172);
}

function resetBox(){
    console.log("reset box");
    tapScale(2100,510,100);
    sleep(1000);
    tapScale(1700,1135,100);
    waitLoading();
    sleep(1000);
    tapScale(1250,1135,100);
    sleep(1000);
}


console.log("Load get box api finish");