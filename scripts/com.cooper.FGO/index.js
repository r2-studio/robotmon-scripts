var packagePath;
var imagePath;
var itemPath;

var server;
var loadApiCnt;

function start(loopTime,script,scriptName){
    startScript(loopTime,script,scriptName);
}

function stop(){
    stopScript();
}

function initServer(){
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
    itemPath = path+"/FGOV2/";
}

function loadApi(){
    console.log("start load api");
    loadApiCnt = 0;
    var apiList = ["basic","start_stage","in_stage","auto_attack_ai","get_box","check_stage"];
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
    initScreenSize();

    var firstTime = execute("ls "+itemPath);
    if(firstTime.length == 0 || firstTime.lastIndexOf("exit", 0) === 0){
        console.log("First time run script, init basic item");
        execute("mkdir "+itemPath);
        execute("mkdir "+itemPath+"script");
        execute("mkdir "+itemPath+"friend_servant");
        execute("mkdir "+itemPath+"friend_item");
        execute("cp "+packagePath+"BasicItem/script3.js "+itemPath+"script/自動周回.js");
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
        // if(server == "JP"){
        // execute("cp "+packagePath+"BasicItem/friend3.png "+itemPath+"friend_servant/術師匠.png");
        // sleep(500);
        // execute("cp "+packagePath+"BasicItem/item3.png "+itemPath+"friend_item/絆2.png");
        // sleep(500);
        // execute("cp "+packagePath+"BasicItem/item4.png "+itemPath+"friend_item/QP2.png");
        // sleep(500);            
        // }
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
    return scriptList+';'+servantList+';'+itemList+';'+itemPath+';'+version;
}