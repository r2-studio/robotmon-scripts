var blackEdge = [0, 0, 0, 0]; //l 52,t 0,r 2176,b 1035
var selectFriendLoose = 0; //0 strict 1 loose
var servantDirection = 0; //0 l->r 1 r->l
var skillDirection = 0; //0 l->r 1 r->l
var spaceUltColor = 1;
var kukulkanUseStar = 7;
var dubaiSkill = 0;
var friendAlgorithm = 0; //0 pixel detection 1 image matching
var PREFERENCE_DEFAULT_VALUE = "0,0,0,0,0,0,0,1,7,0,0"

function loadPreference() {
  var fileName = "preferencejp.js";
  if (server == "TW") {
    fileName = "preferencetw.js";
  }
  var valueMissing = false;
  var preference = undefined;
  try {
    preference = readFile(itemPath + fileName);
  } catch (e) {
    console.log("偏好設定檔案不存在");
    valueMissing = true;
  }
  if (preference == undefined || preference == null || preference.length == 0) {
    preference = PREFERENCE_DEFAULT_VALUE;
    valueMissing = true;
  }
  var split = preference.split(",");
  var defaultSplit = PREFERENCE_DEFAULT_VALUE.split(",");
  for (var i = 0; i < defaultSplit.length; i++) {
    if (split[i] == undefined || split[i] == null || isNaN(split[i])) {
      split[i] = defaultSplit[i];
      valueMissing = true;
    }
  }
  for (var i = 0; i < 4; i++) {
    blackEdge[i] = split[i];
  }
  selectFriendLoose = split[4];
  servantDirection = split[5];
  skillDirection = split[6];
  spaceUltColor = split[7];
  kukulkanUseStar = split[8];
  dubaiSkill = split[9];
  friendAlgorithm = split[10];
  if (valueMissing) {
    console.log("偏好設定缺損，重新建立");
    writeFile(itemPath + fileName, getPreferenceString());
  }
  return getPreferenceString();
}

function savePreference(pref) {
  var fileName = "preferencejp.js";
  if (server == "TW") {
    fileName = "preferencetw.js";
  }
  console.log("儲存偏好設定", pref);
  blackEdge = pref.slice(0, 4);
  selectFriendLoose = pref[4];
  servantDirection = pref[5];
  skillDirection = pref[6];
  spaceUltColor = pref[7];
  kukulkanUseStar = pref[8];
  dubaiSkill = pref[9];
  friendAlgorithm = pref[10];
  return writeFile(itemPath + fileName, getPreferenceString());
}

function setOtherPreference(pref) {
  selectFriendLoose = pref[0];
  servantDirection = pref[1];
  skillDirection = pref[2];
  spaceUltColor = pref[3];
  kukulkanUseStar = pref[4];
  dubaiSkill = pref[5];
  friendAlgorithm = pref[6];
}

function getPreferenceString() {
  var p = "";
  for (var i = 0; i < 4; i++) {
    p += blackEdge[i];
    p += ",";
  }
  p += selectFriendLoose;
  p += ",";
  p += servantDirection;
  p += ",";
  p += skillDirection;
  p += ",";
  p += spaceUltColor;
  p += ",";
  p += kukulkanUseStar;
  p += ",";
  p += dubaiSkill;
  p += ",";
  p += friendAlgorithm;

  return p;
}

function getKKLArray() {
  var t = 1;
  var arr = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    if ((kukulkanUseStar & t) == 0) {
      arr[i] = 0;
    } else {
      arr[i] = 1;
    }
    t *= 2;
  }
  return arr;
}

function resetSpaceUltColor(pref){
  spaceUltColor = pref[3];
}

loadApiCnt++;
console.log("Load preference api finish");
