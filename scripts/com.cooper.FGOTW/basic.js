var version = "V1.14";
var isDebug = false;

var noApImage;
var stageFullImage;
var stageFullImage2;
var selectFriendImage;
var selectFriendImage2;
var selectTeamImage;
var finishStageImage = [];
var whiteImage;
var currentStageImage = [];
var cardListImage = [];
var cardDisableImage = [];
var cardWeakImage = [];
var skillCheckImage;
var skillUsedImage;
var skillNullImage;
var skillFailedImage;
var friendPointCheckImage;
var friendPointFreeImage;
var friendPointTenImage;
var friendPointReloadImage;
var friendPointFullImage;
var friendPointFullImage2;
var friendPointNew;
var friendPointBack;
var starImage;
var useItemImage;

var selectStartImage = [];
var selectBackImage;

var skillColor = [];
var resetFriendCnt;
var isImageInit = false;
var isScriptRunning = false;

var defaultScreenSize = [2560,1440];
var screenScale = [];
var screenOffset = [];

function startScript(loopTime,script){
    loadImage();
    initScreenSize();
    isScriptRunning = true;
    for(var loop = 0;loop<loopTime;loop++){
        if(!isScriptRunning){
            return;
        }
        runScript(script);
    }
    releaseAllImage();
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
    isScriptRunning = true;
    initServer();
    loadApi();
    loadImage();
    initScreenSize();
}

function loadImage(){
    if(isImageInit){
        releaseAllImage();
    }

    noApImage = openImage(imagePath+"NoAP.png");

    stageFullImage = openImage(imagePath+"StageFull.png");
    stageFullImage2 = openImage(imagePath+"StageFull2.png");

    for(var i=0;i<11;i++){
        finishStageImage[i] = openImage(imagePath+"FinishStage"+i+".png");
    }
    whiteImage = openImage(imagePath+"White.png");

    for(var i=0;i<3;i++){
        currentStageImage[i] = openImage(imagePath+"CurrentStage"+i+".png");
    }

    cardListImage[0] = openImage(imagePath+"CardListB.png");
    cardListImage[1] = openImage(imagePath+"CardListN.png");
    cardListImage[2] = openImage(imagePath+"CardListQ.png");

    cardDisableImage[0] =  openImage(imagePath+"CardDisable1.png");
    cardDisableImage[1] =  openImage(imagePath+"CardDisable2.png");

    cardWeakImage[0] =  openImage(imagePath+"CardWeak.png");
    cardWeakImage[1] =  openImage(imagePath+"CardResist.png");

    skillCheckImage = openImage(imagePath+"SkillCheck.png");
    skillUsedImage = openImage(imagePath+"SkillUsed.png");
    skillNullImage = openImage(imagePath+"SkillNull.png");
    skillFailedImage = openImage(imagePath+"SkillFailed.png");

    selectFriendImage = openImage(imagePath+"SelectFriend1.png");
    selectFriendImage2 = openImage(imagePath+"SelectFriend2.png");
    selectTeamImage = openImage(imagePath+"SelectTeam.png");

    friendPointCheckImage = openImage(imagePath+"FriendPointCheck.png");
    friendPointTenImage = openImage(imagePath+"FriendPointTen.png");
    friendPointFreeImage = openImage(imagePath+"FriendPointFree.png");
    friendPointReloadImage = openImage(imagePath+"FriendPointReload.png");
    friendPointFullImage = openImage(imagePath+"FriendPointFull.png");
    friendPointFullImage2 = openImage(imagePath+"FriendPointFull2.png");
    friendPointNew = openImage(imagePath+"FriendPointNew.png");
    friendPointBack = openImage(imagePath+"FriendPointBack.png");

    selectStartImage[0] = openImage(imagePath+"SelectStart.png");
    selectStartImage[1] = openImage(imagePath+"SelectStart2.png");
    selectStartImage[2] = openImage(imagePath+"SelectStart3.png");
    selectBackImage = openImage(imagePath+"SelectBack.png");
    
    starImage = openImage(imagePath+"Star.png");
    useItemImage = openImage(imagePath+"UseItem.png");
    isImageInit = true;
}

function releaseAllImage(){
    isImageInit = false;

    releaseImage(noApImage);

    releaseImage(stageFullImage);
    releaseImage(stageFullImage2);

    for(var i=0;i<11;i++){
        releaseImage(finishStageImage[i]);
    }
    releaseImage(whiteImage);

    for(var i=0;i<3;i++){
        releaseImage(currentStageImage[i]);        
        releaseImage(cardListImage[i]);
        releaseImage(selectStartImage[i]);
    }

    releaseImage(selectFriendImage);
    releaseImage(selectFriendImage2);
    releaseImage(selectTeamImage);
    
    releaseImage(friendPointCheckImage);
    releaseImage(friendPointTenImage);
    releaseImage(friendPointFreeImage);
    releaseImage(friendPointReloadImage);
    releaseImage(friendPointFullImage);
    releaseImage(friendPointFullImage2);
    releaseImage(friendPointNew);
    releaseImage(friendPointBack);

    releaseImage(skillCheckImage);
    releaseImage(skillUsedImage);
    releaseImage(skillNullImage);
    releaseImage(skillFailedImage);

    releaseImage(selectBackImage);

    releaseImage(starImage);
    releaseImage(useItemImage);
}

function initScreenSize(){
    var size = getScreenSize();
    screenOffset[0] = 0;
    screenOffset[1] = 0;
    var w = size.width;
    var h = size.height;
    if(w < h){
        //swap
        var tmp = h;
        h = w;
        w = tmp;
    }
    var ho = h;
    var wo = w;
    if(w * 9 < h * 16){
        h = wo * 9 / 16;
        screenOffset[1] = (ho - h) / 2;
    }else if(w * 9 > h * 16){
        w = ho * 16 / 9;
        screenOffset[0] = (wo - w) / 2;
    }
    screenScale[0] = w / defaultScreenSize[0];
    screenScale[1] = h / defaultScreenSize[1];
}

function saveScript(scriptName,scriptContent){
    var path = getStoragePath();
    writeFile(itemPath+"script/"+scriptName+".js",scriptContent);
    console.log("save file "+scriptName+" finish");
    return scriptName;
}

function deleteScript(scriptName){
    var path = getStoragePath();
    execute('rm '+itemPath+"script/"+scriptName+".js");
    return scriptName;
}

function readScript(scriptName){
    var path = getStoragePath();
    return readFile(itemPath+"script/"+scriptName+".js");
}
//-----------------------------------------------------generial

function checkPixel(x,y,r,g,b){
    var size = getScreenSize();
    if(size.width < size.height){
        return false;
    }
    var w = size.width;
    var h = size.height;
    x = x * screenScale[0] + screenOffset[0];
    y = y * screenScale[1] + screenOffset[1];
    var screenShot = getScreenshot();
    var color = getImageColor(screenShot,x,y);
    releaseImage(screenShot);
    if(isSameColor(color.r,color.g,color.b,r,g,b)){
        return true;
    }
    return false;
}

function checkImage(imageBig,imageSmall,x,y,width,height,threshold){
    var size = getScreenSize();
    if(size.width < size.height){
        console.log("screen size error");
        return false;
    }
    if(threshold == undefined){
        threshold = 0.85;
    }
    x = x * screenScale[0] + screenOffset[0];
    y = y * screenScale[1] + screenOffset[1];
    width = width * screenScale[0];
    height = height * screenScale[1];
    var resizeSmall = resizeImage(imageSmall,width,height);
    var crop = cropImage(imageBig,x,y,width,height);
    var score = getIdentityScore(crop,resizeSmall);
    releaseImage(crop);
    releaseImage(resizeSmall);
    if(isDebug){
        console.log("check image score "+score);
    }
    if(score > threshold){
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
    var size = getScreenSize();
    if(size.width < size.height){
        return;
    }
    x = x * screenScale[0] + screenOffset[0];
    y = y * screenScale[1] + screenOffset[1];
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
        moveTo(x + s * xStep, y + s * yStep, 4)
    }
    moveTo(endX,endY,4);
    sleep(1000);
    tapUp(endX, endY)
}

function waitLoading(){
    while(true){
        if(!isScriptRunning){
            return;
        }
        sleep(3000);
        if(!checkPixel(2400,1342,255,255,255)){
            return;
        }
    }
}

function isSameColor(r1,g1,b1,r2,g2,b2){
    if(b1==undefined){
        var c1 = r1;
        var c2 = g1;
        r1=c1.r;
        g1=c1.g;
        b1=c1.b;
        r2=c2.r;
        g2=c2.g;
        b2=c2.b;
    }
    //console.log(r1+","+g1+","+b1);
    //console.log(r2+","+g2+","+b2);
    var diff = 0;
    diff += Math.abs(r1-r2);
    diff += Math.abs(g1-g2);
    diff += Math.abs(b1-b2);
    if(isDebug){
        console.log("check pixel diff "+diff);
    }
    if(diff<20){
        return true;
    }
    return false;
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
    var filepath = path+"/crop"+currentdate.getTime()+"_"+x+"_"+y+"_"+width+"_"+height+".png";
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

function saveFriendServantImage(cnt){
    sleep(1000);
    var screenShot = getScreenshot();
    var crop;
    if(cnt==1){
        crop = cropImage(screenShot,100 * screenScale[0] + screenOffset[0],460* screenScale[1] + screenOffset[1],310* screenScale[0],195* screenScale[1]);
    }else{
        crop = cropImage(screenShot,100 * screenScale[0] + screenOffset[0],860* screenScale[1] + screenOffset[1],310* screenScale[0],195* screenScale[1]);
    }
    resizeImage(crop,260,195);
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
    var screenShot = getScreenshot();
    var crop;
    if(cnt==1){
        crop = cropImage(screenShot,100 * screenScale[0] + screenOffset[0],655* screenScale[1] + screenOffset[1],310* screenScale[0],90* screenScale[1]);
    }else{
        crop = cropImage(screenShot,100 * screenScale[0] + screenOffset[0],1055* screenScale[1] + screenOffset[1],310* screenScale[0],90* screenScale[1]);
    }
    resizeImage(crop,260,65);
    var currentdate = new Date();
    var time = currentdate.getTime();
    var filePath = itemPath+"tmp_item_"+time+".png";
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

console.log("Load basic api finish");