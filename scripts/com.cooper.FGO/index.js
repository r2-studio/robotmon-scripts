var packagePath;
var imagePath;
var itemPath;

var server;
var loadApiCnt;

var version = "V3.03";
var havePlan = false;
var freeMode = false;

function start(loopTime,script,scriptName){
    startScript(loopTime,script,scriptName);
}

function stop(){
    stopScript();
}

function initServer(){
    //havePlan = (getUserPlan() == 3) && !freeMode;
    havePlan = true;
    var path = getStoragePath();
    if(server == "JP"){
        console.log("JP server");
        packagePath = path+"/scripts/com.cooper.FGO/";
        imagePath = packagePath+"image_jp/"
    }
    else if(server == "TW"){
        console.log("TW server");
        packagePath = path+"/scripts/com.cooper.FGOTW/";
        imagePath = packagePath+"image_tw/"
    }
    itemPath = path+"/FGOV3/";
}

function loadApi(){
    console.log("start load api");
    loadApiCnt = 0;
    var apiList = ["basic","screen","start_stage","in_stage","auto_attack_ai","get_box","check_stage","friend"];
    for(var i = 0;i<apiList.length;i++){
        var s = readFile(packagePath+apiList[i]+".js");
        if(s == undefined || s.length == 0){
            console.log("load api failed");
            return false;
        }
        runScript(s);
    }
    if(loadApiCnt == apiList.length){
        console.log("load api success");
        return true;
    }else{
        console.log("load api failed");
        return false;        
    }
}

function initHTML(serverString){
    server = serverString;
    console.log("Init server "+server);
    initServer();

    if(!loadApi()){
        return;
    }
    var firstTime = execute("ls "+itemPath);
    if(firstTime.length == 0 || firstTime.lastIndexOf("exit", 0) === 0){
        console.log("First time run script, init basic item");
        execute("mkdir "+itemPath);
        sleep(500);
        execute("mkdir "+itemPath+"script");
        sleep(500);
        execute("mkdir "+itemPath+"friend_servant");
        sleep(500);
        execute("mkdir "+itemPath+"friend_item");
        sleep(500);

        execute("cp "+packagePath+"BasicItem/default.js "+itemPath+"script/自動周回.js");
        sleep(1000);

        execute("cp "+packagePath+"BasicItem/csaber.png "+itemPath+"friend_servant/C_Saber.png");
        sleep(1500);
        execute("cp "+packagePath+"BasicItem/cskadi.png "+itemPath+"friend_servant/C_Skadi.png");
        sleep(1500);

        execute("cp "+packagePath+"BasicItem/qp.png "+itemPath+"friend_item/QP.png");
        sleep(1500);
        execute("cp "+packagePath+"BasicItem/kitune.png "+itemPath+"friend_item/絆.png");
        sleep(1500);
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
    return scriptList+';'+servantList+';'+itemList+';'+itemPath+';'+version+';'+havePlan;
}