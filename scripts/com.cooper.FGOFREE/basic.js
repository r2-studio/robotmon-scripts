var loadApiCnt = 0;

var runningScriptName = "";
var isDebug = false;

var skillUsedInLoop = undefined;

var lastTimeUseItem = -1;

function startScript(loopTime,script,scriptName){
    console.log("開始執行指令，版本"+version);
    initScreenSize();
    isScriptRunning = true;
    runningScriptName = scriptName;
    var next = 1;
    if(loopTime < 0){
        next = 0;
        loopTime = 1;
    }
    for(var loop = 0;loop<loopTime;loop+= next){
        if(!isScriptRunning){
            break;
        }
        if(next == 0){
            console.log("Start script");
            sendNormalMessage (runningScriptName, "Start loop");
        }else{
            console.log("Start script loop "+(loop+1)+"/"+loopTime);
            sendNormalMessage (runningScriptName, "Start loop "+(loop+1)+"/"+loopTime);
        }
        skillUsedInLoop = [false,false,false,false,false,false,false,false,false];
        spaceUltColor = -1;
        isReplay = false;
        runScript(script);
        if(!havePlan){
            break;
        }
    }
    isScriptRunning = false;
    console.log("script finish");
}

function stopScript(){
    isScriptRunning = false;
    console.log("User press stop");
}

function initIDE(serverString){
    server = serverString;
    isImageInit = false;
    isDebug = true;
    // initServer();
    initScreenSize();
    isScriptRunning = true;
}


function saveScript(scriptName,scriptContent){
    writeFile(itemPath+"script/"+scriptName+".js",scriptContent);
    console.log("save file "+scriptName+" finish");
    return scriptName;
}

function deleteScript(scriptName){
    execute('rm '+itemPath+"script/"+scriptName+".js");
    return scriptName;
}

function readScript(scriptName){
    return readFile(itemPath+"script/"+scriptName+".js");
}

//-----------------------------------------------------generial

var orientationLog = false;
function getScreenshotResize(){
    var size = getScreenSize();
    if(size.width < size.height){
        if(!orientationLog){
            orientationLog = true;
            console.log("螢幕方向錯誤");
        }
        return null;
    }
    if(orientationLog){        
        console.log("螢幕方向回復");
        orientationLog = false;
    }
    var screenshot = getScreenshot();
    var cutScreenshot = cropImage(screenshot,blackEdge[0] + blueEdge[0],blackEdge[1] + blueEdge[1],realScreenSize[0],realScreenSize[1]);
    var resizeScreenshot = resizeImage(cutScreenshot,realScreenSize[0] / screenScale[0],realScreenSize[1] / screenScale[1]);
    releaseImage(screenshot);
    releaseImage(cutScreenshot);
    return resizeScreenshot;
}


function checkImage(screenshot,icon,x,y,width,height,threshold){
    if(isDebug){
        console.log("checkImage",x,y,width,height);
    }
    if(threshold == undefined){
        threshold = 0.85;
    }
    var crop = cropImage(screenshot,x,y,width,height);    
    var find = findImage(crop,icon);
    releaseImage(crop);
    if(isDebug){
        console.log("checkImage reslut "+find.score +" threshold "+threshold);
    }
    if(find == undefined){
        return false;
    }
    if(find.score > threshold){
        return true;
    }else{
        return false;
    }
}

function checkImageAndColor(screenshot,icon,x,y,width,height){
    var threshold = 0.9;
    var crop = cropImage(screenshot,x,y,width,height);
    var find = findImage(crop,icon);
    var r = false;
    if(isDebug){
        console.log("checkImageAndColor find score"+find.score);
    }
    if(find.score > threshold){
        r = compareImageColor(crop,find.x,find.y,icon,width,height,10);
    }
    if(isDebug){
        console.log("checkImageAndColor compareImageColor "+r);
    }
    releaseImage(crop);
    return r;
}

function checkPixel(x,y,r,g,b,screenshot){
    var needRelease = false;
    if(screenshot == undefined){
        needRelease = true;
        screenshot = getScreenshotResize();
    }
    if(screenshot==null){
        return false;
    }
    var color = getImageColor(screenshot,x,y);
    if(needRelease){
        releaseImage(screenshot);
    }
    if(isDebug){
        console.log("get color "+x+","+y+":"+color.r+","+color.g+","+color.b);
    }
    if(isSameColor(color.r,color.g,color.b,r,g,b)){
        return true;
    }
    return false;
}

function findImageResize(imageBig,imageSmall,threshold){
    if(threshold == undefined){
        threshold = 0.85;
    }
    var imageSizeBig = getImageSize(imageBig);
    var imageSize = getImageSize(imageSmall);
    var width = imageSize.width * screenScale[0];
    var height = imageSize.height * screenScale[1];
    if(imageBig.width<width||imageSize.height<height){
        console.log("image size bug");
        return false;
    }
    var resizeSmall = resizeImage(imageSmall,width,height);
    var find = findImage(imageBig,resizeSmall);
    releaseImage(resizeSmall);
    if(find.score > threshold){
        return true; 
    }else{
        return false;
    }
}

function getImageLightness(img,sparse){
    if(sparse == undefined){
        sparse = 1;
    }
    var size = getImageSize(img);
    var tmp = clone(img);
    convertColor(tmp,52);
    var l = 0;
    var cnt = 0;
    for(var i=0;i<size.width;i+=sparse){
        for(var j=0;j<size.height;j+=sparse){
            cnt++;
            l += getImageColor(tmp,i,j).g;
        }
    }
    l = l / cnt;
    releaseImage(tmp);
    return l;
}

function tapScale(x,y,wait,margin){
    if(!isScriptRunning){
        return;
    }
    if(wait==undefined){
        wait = 100;
    }
    if(margin == undefined){
        margin = defaultMarginX;
    }
    var size = getScreenSize();
    if(size.width < size.height){
        return;
    }
    x = (x + margin)* screenScale[0] + blueEdge[0] + blackEdge[0];
    y = y * screenScale[1] + blueEdge[1] + blackEdge[1];
    tap(x,y,wait);
}

function swipeScale(x,y,endX,endY,step){
    var size = getScreenSize();
    if(!isScriptRunning || size.width < size.height){
        return;
    }
    x = x * screenScale[0] + blueEdge[0] + blackEdge[0] + defaultMarginX;
    y = y * screenScale[1] + blueEdge[1] + blackEdge[1];
    endX = endX * screenScale[0] + blueEdge[0] + blackEdge[0] + defaultMarginX;
    endY = endY * screenScale[1] + blueEdge[1] + blackEdge[1];


    xStep = (endX - x) / step;
    yStep = (endY - y) / step;

    tapDown(x, y, 40);
    //avoid outside loop i
    for (var s = 0; s < step; s ++) {
        if(!isScriptRunning){
          break;
        }
        moveTo(x + s * xStep, y + s * yStep, 4)
    }
    moveTo(endX,endY,4);
    sleep(1000);
    tapUp(endX, endY,40);
    sleep(1000);
}

function waitLoading(){
    while(isScriptRunning){
        sleep(1500);
        if(!checkPixel(1800 + defaultMarginX,1006,255,255,255)){
            return;
        }
    }
}

function isSameColor(r1,g1,b1,r2,g2,b2,threshold){
    if(r2==undefined){
        threshold = b1;
        var c1 = r1;
        var c2 = g1;
        r1=c1.r;
        g1=c1.g;
        b1=c1.b;
        r2=c2.r;
        g2=c2.g;
        b2=c2.b;
    }
    if(threshold==undefined){
        threshold = 20;
    }
    //console.log(r1+","+g1+","+b1);
    //console.log(r2+","+g2+","+b2);
    var diff = 0;
    diff += Math.abs(r1-r2);
    diff += Math.abs(g1-g2);
    diff += Math.abs(b1-b2);
    // if(isDebug){
    //     console.log("check pixel diff "+diff);
    // }
    if(diff<threshold){
        return true;
    }
    return false;
}

function compareImageColor(image1,offsetx,offsety,image2,w,h,scale){
    var e = 0;
    var c = 0;
    for(var x=0;x<w;x+=scale){
        for(var y=0;y<h;y+=scale){
            var color1 = getImageColor(image1,offsetx+x,offsety+y);
            var color2 = getImageColor(image2,x,y);
            if(!isSameColor(color1.r,color1.g,color1.b,color2.r,color2.g,color2.b)){
                e++;
            }else{
                c++;
            }
        }
    }
    return e * 2  < c;
}

loadApiCnt++;
console.log("Load basic api finish");