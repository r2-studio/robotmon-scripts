var packagePath;
var imagePath;
var itemPath;

var server;
var loadApiCnt;

var version = "V1.02";

function start(script, selectServer) {
  server = selectServer;
  startScript(script);
}

function stop() {
  stopScript();
}

function init() {
  packagePath = getStoragePath() + "/scripts/com.cooper.FGOFreeTool/";
  if (!loadApi()) {
    return;
  }
  return version;
}

function loadApi() {
  console.log("start load api");
  loadApiCnt = 0;
  var apiList = ["basic", "screen", "get_box", "check_stage"];
  for (var i = 0; i < apiList.length; i++) {
    var s = readFile(packagePath + apiList[i] + ".js");
    if (s == undefined || s.length == 0) {
      console.log("load api failed");
      return false;
    }
    runScript(s);
  }
  if (loadApiCnt == apiList.length) {
    console.log("load api success");
    return true;
  } else {
    console.log("load api failed");
    return false;
  }
}

console.log("load index.jx finish");
