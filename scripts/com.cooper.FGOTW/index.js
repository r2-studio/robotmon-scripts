var packagePath;
var imagePath;
var itemPath;

var server;
var loadApiCnt;

var version = "V3.55";

function start(loopTime, script, scriptName, be, pref) {
  startScript(loopTime, script, scriptName, be, pref);
}

function stop() {
  stopScript();
}

function initHTML(serverString) {
  console.log("初始化中");

  var img = getScreenshot();
  if (img == undefined) {
    console.log("無法取得螢幕截圖");
    releaseImage(img);
    return "noimg";
  } else if (isAllBlack(img)) {
    console.log("無法取得螢幕截圖");
    releaseImage(img);
    return "noimg";
  }
  releaseImage(img);

  server = serverString;
  initServer();

  if (!loadApi()) {
    return;
  }
  var firstTime = execute("ls " + itemPath);
  if (firstTime.length == 0 || firstTime.lastIndexOf("exit", 0) === 0) {
    var cmd =
      "cp -r " + packagePath + "basic_item/FGOV3 " + getStoragePath() + "/";
    console.log("複製基本檔案 " + cmd);
    execute(cmd);
    sleep(5000);
    var copyFailed = execute("ls " + itemPath);
    if (copyFailed.length == 0 || copyFailed.lastIndexOf("exit", 0) === 0) {
      console.log(
        "基本檔案複製失敗，請檢查權限並再試一次，還是無法初始化請洽Robotmon官方粉絲團"
      );
      return;
    } else {
      console.log("基本檔案複製成功");
    }
  }
  var scriptList = execute("ls " + itemPath + "script")
    .replace(/.js/g, "")
    .replace(/ /g, "")
    .replace(/\r\n|\n/g, ",");
  if (scriptList.slice(-1) == ",") {
    scriptList = scriptList.slice(0, -1);
  }
  var servantList = execute("ls " + itemPath + "friend_servant")
    .replace(/.png/g, "")
    .replace(/ /g, "")
    .replace(/\r\n|\n/g, ",");
  if (servantList.slice(-1) == ",") {
    servantList = servantList.slice(0, -1);
  }
  var itemList = execute("ls " + itemPath + "friend_item")
    .replace(/.png/g, "")
    .replace(/ /g, "")
    .replace(/\r\n|\n/g, ",");
  if (itemList.slice(-1) == ",") {
    itemList = itemList.slice(0, -1);
  }

  loadPreference();
  return (
    scriptList +
    ";" +
    servantList +
    ";" +
    itemList +
    ";" +
    itemPath +
    ";" +
    version +
    ";" +
    getPreferenceString()
  );
}

function initServer() {
  var path = getStoragePath();
  if (server == "JP") {
    console.log("JP server");
    packagePath = path + "/scripts/com.cooper.FGO/";
    imagePath = packagePath + "image_jp/";
  } else if (server == "TW") {
    console.log("TW server");
    packagePath = path + "/scripts/com.cooper.FGOTW/";
    imagePath = packagePath + "image_tw/";
  }
  itemPath = path + "/FGOV3/";
}

function loadApi() {
  console.log("start load api");
  loadApiCnt = 0;
  var apiList = [
    "basic",
    "screen",
    "start_stage",
    "in_stage",
    "auto_attack_ai",
    "get_box",
    "check_stage",
    "friend",
    "preference"
  ];
  for (var i = 0; i < apiList.length; i++) {
    var s = readFile(packagePath + "game_script/" + apiList[i] + ".js");
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

function isAllBlack(image) {
  var imageSize = getImageSize(image);
  if (imageSize.width <= 0 || imageSize.height <= 0) {
    console.log("螢幕截圖寬高為0");
    return true;
  }

  for (var x = 0; x < 10; x++) {
    var checkX = (imageSize.width * (x + 1)) / 11;
    for (var y = 0; y < imageSize.height; y++) {
      var color = getImageColor(image, checkX, y);
      if (color.r != 0 || color.g != 0 || color.b != 0) {
        return false;
      }
    }
  }
  console.log("螢幕截圖全黑");
  return true;
}

function showLogAlertMessage() {
  if (isScriptRunning) {
    console.log("腳本執行中開啟除錯指令，可能會擋到畫面導致腳本判斷錯誤");
  }
}

console.log("load index.js finish");
