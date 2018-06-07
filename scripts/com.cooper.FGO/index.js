function start(loopTime,script){
    startScript(loopTime,script);
}

function stop(){
    stopScript();
}

function loadApi(){
    console.log("start load api");
    var apiList = ["basic","start_stage","in_stage","auto_attack_ai","get_box"];    
    var path = getStoragePath();
    for(var i = 0;i<apiList.length;i++){
        var s = readFile(path+"/scripts/FGO/"+apiList[i]+".js");
        if(s.length == 0){
            return false;
        }
        runEncryptedScript(s);
    }
    console.log("load api success");
    return true;
}

function initHTML(){
    if(!loadApi()){
        return;
    }
    initScreenSize();
    var path = getStoragePath();

    var firstTime = execute("ls -m "+path+"/FGO");
    execute("mkdir "+path+"/FGO");
    execute("mkdir "+path+"/FGO/script");
    execute("mkdir "+path+"/FGO/friend_servant");
    execute("mkdir "+path+"/FGO/friend_item");
    if(firstTime.length == 0){
        console.log("First time run script, init basic item");
        execute("cp "+path+"/scripts/FGO/BasicItem/自動戰鬥.js "+path+"/FGO/script/自動戰鬥.js");
        execute("cp "+path+"/scripts/FGO/BasicItem/抽箱.js "+path+"/FGO/script/抽箱.js");
        execute("cp "+path+"/scripts/FGO/BasicItem/友抽.js "+path+"/FGO/script/友抽.js");
        execute("cp "+path+"/scripts/FGO/BasicItem/孔明.png "+path+"/FGO/friend_servant/孔明.png");
        execute("cp "+path+"/scripts/FGO/BasicItem/梅林.png "+path+"/FGO/friend_servant/梅林.png");
        execute("cp "+path+"/scripts/FGO/BasicItem/絆.png "+path+"/FGO/friend_item/絆.png");
    }
    var scriptList = execute("ls -m "+path+"/FGO/script").replace(/.js/g,'').replace(/ /g,'');
    var servantList = execute("ls -m "+path+"/FGO/friend_servant").replace(/.png/g,'').replace(/ /g,'');
    var itemList = execute("ls -m "+path+"/FGO/friend_item").replace(/.png/g,'').replace(/ /g,'');
    return scriptList+';'+servantList+';'+itemList+';'+path;
}