var loadApiCnt = 0;
var version = "V2.29";
var isDebug = false;

var defaultScreenSize = [1280,720];
var blackEdge = [0,0,0,0];//l 52,t 0,r 2176,b 1035
var screenScale = [];
var screenOffset = [];
var realScreenSize = [];
var runningScriptName = "";

var friendServantPosition = [[51,230,155,96],[51,430,155,96]];
var friendItemPosition =  [[51,328,155,30],[51,528,155,30]];
var skillUsedInLoop = undefined;

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

function initScreenSize(){
    getBlackEdge();
    var size = getScreenSize();
    screenOffset[0] = 0;
    screenOffset[1] = 0;
    //var w = size.width;
    //var h = size.height;
    var w = blackEdge[2] - blackEdge[0] + 1;
    var h = blackEdge[3] - blackEdge[1] + 1;
    if(w < h){
        //swap
        var tmp = h;
        h = w;
        w = tmp;
    }
    var wo = w;
    var ho = h;
    if(w * 9 < h * 16){
        h = wo * 9 / 16;
        screenOffset[1] = (ho - h) / 2;
    }else if(w * 9 > h * 16){
        w = ho * 16 / 9;
        screenOffset[0] = (wo - w) / 2;
    }
    screenScale[0] = w / defaultScreenSize[0];
    screenScale[1] = h / defaultScreenSize[1];
    realScreenSize[0] = w;
    realScreenSize[1] = h;
}

function getBlackEdge(){
    var screenshot = getScreenshot();
    var imageSize = getImageSize(screenshot);
    var w = imageSize.width;
    var h = imageSize.height;
    for(var i = 0;i<w;i++){
        var color = getImageColor(screenshot,i,h/4);
        if(color.r != 0 || color.g != 0 || color.b != 0){
            blackEdge[0] = i;
            break;
        }
    }
    for(var i = 0;i<h;i++){
        var color = getImageColor(screenshot,w/4,i);
        if(color.r != 0 || color.g != 0 || color.b != 0){
            blackEdge[1] = i;
            break;
        }
    }
    for(var i =w-1;i>=0;i--){
        var color = getImageColor(screenshot,i,h/4);
        if(color.r != 0 || color.g != 0 || color.b != 0){
            blackEdge[2] = i;
            break;
        }
    }
    for(var i = h-1;i>=0;i--){
        var color = getImageColor(screenshot,w/4,i);
        if(color.r != 0 || color.g != 0 || color.b != 0){
            blackEdge[3] = i;
            break;
        }
    }
    console.log("取得黑邊 "+blackEdge);
    releaseImage(screenshot);
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
function checkIconListInScreen(iconList,allPass,threshold){
    if(threshold == undefined){
        threshold = 0.85;
    }
    var screenshot = getScreenshotResize();
    if(screenshot == null){
        return false;
    }
    for(var i = 0;i<iconList.length;i++){
        var iconId = iconList[i];
        if(iconName[iconId] == ""){
            console.log("checkIconInScreen no icon");
            continue;
        }
        var iconPath = imagePath+iconName[iconId]+".png";
        if(isDebug){
            console.log("checkIconInScreen open icon "+iconPath);
        }
        var iconImage = openImage(iconPath);
        var result = checkImage(screenshot,iconImage,iconPosition[iconId][0],iconPosition[iconId][1],iconPosition[iconId][2],iconPosition[iconId][3],threshold);
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

function checkIconInScreen(iconId,threshold){
    if(!isScriptRunning){
        return false;
    }
    if(iconName[iconId] == ""){
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
    var iconPath = imagePath+iconName[iconId]+".png";
    if(isDebug){
       console.log("checkIconInScreen open icon "+iconPath);
    }
    var iconImage = openImage(iconPath);
    var result = checkImage(screenshot,iconImage,iconPosition[iconId][0],iconPosition[iconId][1],iconPosition[iconId][2],iconPosition[iconId][3],threshold);
    releaseImage(screenshot);
    releaseImage(iconImage);
    if(isDebug){
       console.log("checkIconInScreen result "+result);
    }
    return result;
}

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
    var cutScreenshot = cropImage(screenshot,blackEdge[0] + screenOffset[0],blackEdge[1] + screenOffset[1],realScreenSize[0],realScreenSize[1]);
    var resizeScreenshot = resizeImage(cutScreenshot,defaultScreenSize[0],defaultScreenSize[1]);
    releaseImage(screenshot);
    releaseImage(cutScreenshot);
    return resizeScreenshot;
}


function checkImage(screenshot,icon,x,y,width,height,threshold){
    if(isDebug){
       console.log("checkImage");
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

function tapScale(x,y,wait){
    if(!isScriptRunning){
        return;
    }
    if(wait==undefined){
        wait = 100;
    }
    var size = getScreenSize();
    if(size.width < size.height){
        return;
    }
    x = x * screenScale[0] + screenOffset[0] + blackEdge[0];
    y = y * screenScale[1] + screenOffset[1] + blackEdge[1];
    tap(x,y,wait);
}

function swipeScale(x,y,endX,endY,step){
    var size = getScreenSize();
    if(!isScriptRunning || size.width < size.height){
        return;
    }
    x = x * screenScale[0] + screenOffset[0];
    y = y * screenScale[1] + screenOffset[1];
    endX = endX * screenScale[0] + screenOffset[0];
    endY = endY * screenScale[1] + screenOffset[1];


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
        if(!checkPixel(1200,671,255,255,255)){
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

function saveScreenShotImage(){
    var path = getStoragePath();
    var currentdate = new Date();
    var filepath = path+"/screenshot"+currentdate.getTime()+".png";
    var screenShot = getScreenshot();
    saveImage(screenShot,filepath);
    releaseImage(screenShot);
    console.log("save screenshot at "+filepath);
}

function saveCropImage(l,t,r,b){
    var path = getStoragePath();
    var width = r-l;
    var height = b-t;
    var x = l;
    var y = t;
    var currentdate = new Date();
    var filepath = path+"/crop"+"_"+x+"_"+y+"_"+width+"_"+height+".png";
    var screenShot = getScreenshot();
    var crop = cropImage(screenShot,x,y,width,height);
    saveImage(crop,filepath);
    releaseImage(screenShot);
    releaseImage(crop);
    console.log("save crop at "+filepath);
}

function saveCropImage2(name,l,t,w,h){
    var path = getStoragePath();
    var width = w;
    var height = h;
    var x = l;
    var y = t;
    var filepath = path+"/"+name+".png";
    var screenShot = getScreenshot();
    var crop = cropImage(screenShot,x,y,width,height);
    saveImage(crop,filepath);
    releaseImage(screenShot);
    releaseImage(crop);
    console.log("save crop at "+filepath);
}

function saveCropImage2Resize(name,l,t,w,h){
    var path = getStoragePath();
    var width = w;
    var height = h;
    var x = l;
    var y = t;
    var filepath = path+"/"+name+".png";
    var screenShot = getScreenshotResize();
    var crop = cropImage(screenShot,x,y,width,height);
    saveImage(crop,filepath);
    releaseImage(screenShot);
    releaseImage(crop);
    console.log("save crop at "+filepath);
}

function saveFriendServantImage(cnt){
    sleep(1000);
    initScreenSize();
    var screenShot = getScreenshotResize();
    if(screenShot==null){
        return null;
    }
    var crop;
    if(cnt==1){
        crop = cropImage(screenShot,friendServantPosition[0][0],friendServantPosition[0][1],friendServantPosition[0][2],friendServantPosition[0][3]);
    }else{
        crop = cropImage(screenShot,friendServantPosition[1][0],friendServantPosition[1][1],friendServantPosition[1][2],friendServantPosition[1][3]);
    }
    var currentdate = new Date();
    var time = currentdate.getTime();
    var filePath = itemPath+"tmp_servant_"+time+".png";
    console.log(filePath);
    saveImage(crop,filePath);
    releaseImage(crop);
    releaseImage(screenShot);
    return time;
}

function saveFriendItemImage(cnt){
    sleep(1000);
    initScreenSize();
    var screenShot = getScreenshotResize();
    if(screenShot==null){
        return null;
    }
    var crop;
    if(cnt==1){
        crop = cropImage(screenShot,friendItemPosition[0][0],friendItemPosition[0][1],friendItemPosition[0][2],friendItemPosition[0][3]);
    }else{
        crop = cropImage(screenShot,friendItemPosition[1][0],friendItemPosition[1][1],friendItemPosition[1][2],friendItemPosition[1][3]);
    }
    var currentdate = new Date();
    var time = currentdate.getTime();
    var filePath = itemPath+"tmp_item_"+time+".png";
    console.log(filePath);
    saveImage(crop,filePath);
    releaseImage(crop);
    releaseImage(screenShot);
    return time;
}

function confirmSaveFriendServantImage(imageName,time){
    if(imageName == undefined){
        execute('rm '+itemPath+"tmp_servant_"+time+".png ");
    }else{
        execute('mv '+itemPath+"tmp_servant_"+time+".png " +itemPath+"friend_servant/"+imageName+".png");
    }
    return imageName;
}

function confirmSaveFriendItemImage(imageName,time){
    if(imageName == undefined){
        execute('rm '+itemPath+"tmp_item_"+time+".png ");
    }else{
        execute('mv '+itemPath+"tmp_item_"+time+".png " +itemPath+"friend_item/"+imageName+".png");
    }
    return imageName;
}


loadApiCnt++;
console.log("Load basic api finish");