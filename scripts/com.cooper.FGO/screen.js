var defaultScreenSize = [1920,1080];
//over 21:9 or less then 16:9 will have blue edge
var blackEdge = [0,0,0,0];//l 52,t 0,r 2176,b 1035
var screenScale = [];
var blueEdge = [];
var realScreenSize = [];
var resolution = 16/9;

var defaultMarginX = 0;

function initScreenSize(){
    getBlackEdge();
    var size = getScreenSize();
    blueEdge[0] = 0;
    blueEdge[1] = 0;
    //var w = size.width;
    //var h = size.height;
    var w = blackEdge[2] - blackEdge[0] + 1;
    var h = blackEdge[3] - blackEdge[1] + 1;
    //setMargin();
    if(w < h){
        //swap
        var tmp = h;
        h = w;
        w = tmp;
    }
    resolution = w/h;
    var wo = w;
    var ho = h;
    if(resolution < 16/9){
        h = wo * 9 / 16;
        blueEdge[1] = (ho - h) / 2;
        resolution = 16 / 9;
    }else if(resolution > 21/9){
        w = ho * 21 / 9;
        blueEdge[0] = (wo - w) / 2;
        resolution = 21 / 9;
    }
    //screenScale[0] = w / defaultScreenSize[0];
    screenScale[1] = h / defaultScreenSize[1];
    screenScale[0] = screenScale[1];
    realScreenSize[0] = w;
    realScreenSize[1] = h;

    if(resolution > 16 / 9){
        defaultMarginX = (realScreenSize[0] / screenScale[0] - defaultScreenSize[0]) / 2;
    }
    setMarginIcon();
    setFriendMargin();
    setInStageMargin();
    setAutoAttackMargin();
}

function getBlackEdge(){
    var screenshot = getScreenshot();
    var imageSize = getImageSize(screenshot);
    var w = imageSize.width;
    var h = imageSize.height;
    for(var j = 0; j < 3; j++){
        for(var i = 0;i<w;i++){
            if(i >= blackEdge[0]){
                break;
            }
            var color = getImageColor(screenshot,i,h/4 * j);
            if(color.r != 0 || color.g != 0 || color.b != 0){
                blackEdge[0] = i;
                break;
            }
        }
        for(var i = 0;i<h;i++){
            if(i >= blackEdge[1]){
                break;
            }
            var color = getImageColor(screenshot,w/4 * j,i);
            if(color.r != 0 || color.g != 0 || color.b != 0){
                blackEdge[1] = i;
                break;
            }
        }
        for(var i =w-1;i>=0;i--){
            if(i <= blackEdge[2]){
                break;
            }
            var color = getImageColor(screenshot,i,h/4 * j);
            if(color.r != 0 || color.g != 0 || color.b != 0){
                blackEdge[2] = i;
                break;
            }
        }
        for(var i = h-1;i>=0;i--){
            if(i <= blackEdge[3]){
                break;
            }
            var color = getImageColor(screenshot,w/4 * j,i);
            if(color.r != 0 || color.g != 0 || color.b != 0){
                blackEdge[3] = i;
                break;
            }
        }
    }
    console.log("取得黑邊 "+blackEdge);
    releaseImage(screenshot);
}

loadApiCnt++;
console.log("Load screen api finish");