var packagePath;
var imagePath;
var itemPath;
var server;

var skillPositionX;
var skillPositionY;
var skillPositionW;
var skillPositionH;

var updateCardListX;
var updateCardListY;
var updateCardListOffsetWeakX;
var updateCardListOffsetWeakY;

var currentStageX;
var currentStageY;

var selectFriendPosition;

function start(loopTime,script){
    startScript(loopTime,script);
}

function stop(){
    stopScript();
}

function loadApi(){
    console.log("start load api");
    var apiList = ["basic","start_stage","in_stage","auto_attack_ai","get_box"];
    for(var i = 0;i<apiList.length;i++){
        var s = readFile(packagePath+apiList[i]+".js");
        if(s == undefined || s.length == 0){
            console.log("load api failed");
            return false;
        }
        runScript(s);
    }
    console.log("load api success");
    return true;
}

function initHTML(serverString){
    server = serverString;
    console.log("Init server "+server);
    initServer();

    if(!loadApi()){
        return;
    }
    initScreenSize();

    var firstTime = execute("ls "+itemPath);
    if(firstTime.length == 0){
        console.log("First time run script, init basic item");
        execute("mkdir "+itemPath);
        execute("mkdir "+itemPath+"script");
        execute("mkdir "+itemPath+"friend_servant");
        execute("mkdir "+itemPath+"friend_item");
        execute("cp "+packagePath+"BasicItem/script3.js "+itemPath+"script/自動戰鬥.js");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/script2.js "+itemPath+"script/抽箱.js");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/script1.js "+itemPath+"script/友抽.js");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/friend1.png "+itemPath+"friend_servant/孔明.png");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/friend2.png "+itemPath+"friend_servant/梅林.png");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/item1.png "+itemPath+"friend_item/絆.png");
        sleep(500);
        execute("cp "+packagePath+"BasicItem/item2.png "+itemPath+"friend_item/QP.png");
        sleep(500);
    }
    var scriptList = execute("ls "+itemPath+"script").replace(/.js/g,'').replace(/ /g,'').replace(/\r\n|\n/g,",");
    if(scriptList.slice(-1)==','){
      scriptList = scriptList.slice(0,-1);
    }
    var servantList = execute("ls "+itemPath+"friend_servant").replace(/.png/g,'').replace(/ /g,'').replace(/\r\n|\n/g,",");
    if(servantList.slice(-1)==','){
      servantList = servantList.slice(0,-1);
    }
    var itemList = execute("ls "+itemPath+"friend_item").replace(/.png/g,'').replace(/ /g,'').replace(/\r\n|\n/g,",");
    if(itemList.slice(-1)==','){
      itemList = itemList.slice(0,-1);
    }
    return scriptList+';'+servantList+';'+itemList+';'+itemPath;
}

function initServer(){
    var path = getStoragePath();
    if(server == "JP"){
        console.log("JP server");
        packagePath = path+"/scripts/com.cooper.FGO/";
        imagePath = packagePath+"image_jp/"

        skillPositionX =[62,249,436,696,884,1071,1335,1523,1710];
        skillPositionY = 1200;
        skillPositionW = 37;
        skillPositionH = 33;

        updateCardListX = [126,638,1146,1664,2184];
        updateCardListY = [1070,1100];
        updateCardListOffsetWeakX = 230;
        updateCardListOffsetWeakY = [-310,-340];

        currentStageX = 1720;
        currentStageY = 25;

        selectFriendPosition = [180,315,450,585,725,860,995,1130,1265];
    }
    else if(server == "TW"){
        console.log("TW server");
        packagePath = path+"/scripts/com.cooper.FGOTW/";
        imagePath = packagePath+"image_tw/"

        skillPositionX =[47,236,427,682,871,1062,1320,1509,1700];
        skillPositionY = 1185;
        skillPositionW = 32;
        skillPositionH = 32;

        updateCardListX = [126,638,1148,1664,2184];
        updateCardListY = [1070,1100];
        updateCardListOffsetWeakX = 225;
        updateCardListOffsetWeakY = [-310,-340];

        currentStageX = 1700;
        currentStageY = 25;

        selectFriendPosition = [315,450,585,725,860,995,1130,1265];
    }
    itemPath = path+"/FGO/";
}