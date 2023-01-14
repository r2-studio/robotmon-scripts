/* prettier-ignore */ !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.RF=t():e.RF=t()}(this,(function(){return function(){"use strict";var e={607:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,n(r(850),t),n(r(985),t),n(r(837),t),n(r(459),t),n(r(231),t),n(r(200),t),n(r(656),t),n(r(708),t),n(r(974),t),t.version=1},850:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.GroupPage=void 0;var r=function(){function e(e,t){this.name=e,this.pages=t}return e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=[],o=0,n=this.pages;o<n.length;o++){var i=n[o];i.isMatchImage(e,t)&&r.push(i.name)}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingOne=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": "+this.pages.map((function(e){return e.name})).join(","));for(var s=Date.now(),a="",c=0;Date.now()-s<r;){for(var f=t.getCvtDevScreenshot(),m=0,h=this.pages;m<h.length;m++){var g=h[m];if(g.isMatchImage(f,i)){a!==g.name&&(a=g.name,c=0),c++;break}}if(releaseImage(f),""!==a&&c>=o)break;sleep(n)}return e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": matched: "+a+", usedTime "+(Date.now()-s)),a},e.debug=!1,e}();t.GroupPage=r},985:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Page=void 0;var o=r(656),n=function(){function e(e,t,r,o){void 0===r&&(r=void 0),void 0===o&&(o=void 0),this.name=e,this.points=t,this.next=r,this.back=o}return e.prototype.goNext=function(t){void 0!==this.next?t.tap(this.next):e.debug&&console.log("Warning Page: "+this.name+" has no next xy")},e.prototype.goBack=function(t){void 0!==this.back?t.tap(this.back):e.debug&&console.log("Warning Page: "+this.name+" has no back xy")},e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=!0,n=0,i=this.points;n<i.length;n++){var s=i[n],a=getImageColor(e,s.x,s.y);if(o.Colors.identityColor(s,a)<t){r=!1;break}}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingScreen=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name);for(var s=Date.now(),a=0;Date.now()-s<r&&(this.isMatchScreen(t,i)&&a++,!(a>=o));)sleep(n);return a>=o?(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" success, usedTime "+(Date.now()-s)),!0):(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" timeout"),!1)},e.debug=!1,e}();t.Page=n},837:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.XYRGB=void 0;t.XYRGB=function(){this.x=0,this.y=0,this.r=0,this.g=0,this.b=0}},459:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;var o=r(656),n=function(){function e(e){this.config=e;var t=getScreenSize();this.config.deviceHeight=t.height,this.config.deviceWidth=t.width,this.config.screenWidth=t.width,this.config.screenHeight=t.height,this.config.screenOffsetX=0,this.config.screenOffsetY=0}return e.prototype.calculateDeviceOffset=function(e){var t=e(this);this.config.screenWidth=t.screenWidth,this.config.screenHeight=t.screenHeight,this.config.screenOffsetX=t.screenOffsetX,this.config.screenOffsetY=t.screenOffsetY},e.prototype.getScreenX=function(e){return Math.floor(this.config.screenOffsetX+e*this.config.screenWidth/this.config.devWidth)||0},e.prototype.getScreenY=function(e){return Math.floor(this.config.screenOffsetY+e*this.config.screenHeight/this.config.devHeight)||0},e.prototype.getScreenXY=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e)return{x:this.getScreenX(e.x),y:this.getScreenY(e.y)};if("number"==typeof e&&"number"==typeof t)return{x:this.getScreenX(e),y:this.getScreenY(t)};throw new Error("getScreenXY wrong params "+e+", "+t)},e.prototype.tap=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tap(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tap(r,o,this.config.actionDuring)}},e.prototype.tapDown=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapDown(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapDown(r,o,this.config.actionDuring)}},e.prototype.moveTo=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);moveTo(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),moveTo(r,o,this.config.actionDuring)}},e.prototype.tapUp=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapUp(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapUp(r,o,this.config.actionDuring)}},e.prototype.getScreenColor=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getCvtDevScreenshot(),o=getImageColor(r,e.x,e.y);return releaseImage(r),o}if("number"==typeof e&&"number"==typeof t)return r=this.getCvtDevScreenshot(),o=getImageColor(r,e,t),releaseImage(r),o;throw new Error("tapDown wrong params "+e+", "+t)},e.prototype.findImage=function(e){var t=this.getCvtDevScreenshot(),r=findImage(t,e);return releaseImage(t),r},e.prototype.tapImage=function(e){var t=this.findImage(e);this.tap(t)},e.prototype.isSameColor=function(e,t){void 0===t&&(t=.9);var r=this.getScreenColor(e);return o.Colors.identityColor(r,e)>t},e.prototype.getDeviceScreenshot=function(){return getScreenshot()},e.prototype.getScreenScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.screenWidth,this.config.screenHeight,100)},e.prototype.getCvtDevScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.devWidth,this.config.devHeight,100)},e.prototype.setActionDuring=function(e){this.config.actionDuring=e},e.debug=!1,e}();t.Screen=n},231:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenConfig=void 0;t.ScreenConfig=function(){this.devWidth=360,this.devHeight=640,this.deviceWidth=0,this.deviceHeight=0,this.screenWidth=0,this.screenHeight=0,this.screenOffsetX=0,this.screenOffsetY=0,this.actionDuring=180}},200:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.TaskManager=t.Task=void 0;var o=r(974),n=function(){this.name="",this.runTimes=1,this.maxRunningDuring=0,this.minIntervalDuring=0,this.lastRunDoneTime=0,this.run=function(){}};t.Task=n;var i=function(){function e(){this.isRunning=!1,this.runIdx=0,this.tasks=[]}return e.prototype.addTask=function(e,t,r,o,i){void 0===r&&(r=1),void 0===o&&(o=0),void 0===i&&(i=0);var s=new n;s.name=e,s.run=t,s.runTimes=r,s.maxRunningDuring=o,s.minIntervalDuring=i,this.tasks.push(s)},e.prototype.start=function(){if(0===this.tasks.length)throw new Error("TaskManager: No tasks to run");for(console.log("TaskManager start"),this.isRunning=!0;this.isRunning;){var e=Date.now(),t=this.tasks[this.runIdx%this.tasks.length];if(this.runIdx++,!(e-t.lastRunDoneTime<t.minIntervalDuring)){console.log("RunTask "+this.runIdx+" "+t.name+", times "+t.runTimes+", maxDuring "+t.maxRunningDuring);for(var r=0;this.isRunning&&(console.log("TaskRunning "+t.name+", times "+r+"/"+t.runTimes),t.run(),t.lastRunDoneTime=Date.now(),r++,!(0!==t.runTimes&&r>=t.runTimes))&&!(Date.now()-e>t.maxRunningDuring);)sleep(100)}}},e.prototype.stop=function(){this.isRunning=!1,o.Utils.sleep(1e3),console.log("TaskManager stop")},e}();t.TaskManager=i},656:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Colors=void 0;var r=function(){function e(){}return e.getRangeColor=function(e,t,r,o,n){void 0===n&&(n=5);var i=!1;void 0===e&&(i=!0,e=getScreenshot());for(var s=getImageSize(e),a=Math.max(0,t-o),c=Math.max(0,r-o),f=Math.min(s.width,t+o),m=Math.min(s.height,r+o),h=Math.max(1,(f-a)/n),g=Math.max(1,(m-c)/n),u=0,p={r:0,g:0,b:0},y=a;y<f;y+=h)for(var v=c;v<m;v+=g){var l=getImageColor(e,Math.floor(y),Math.floor(v));p.r+=l.r,p.g+=l.g,p.b+=l.b,u++}return i&&releaseImage(e),{r:Math.floor(p.r/u),g:Math.floor(p.g/u),b:Math.floor(p.b/u)}},e.color2hex=function(e){return((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},e.hex2Color=function(e){return{r:parseInt(e[0]+e[1],16),g:parseInt(e[2]+e[3],16),b:parseInt(e[4]+e[5],16)}},e.identityColor=function(e,t){var r=(e.r+t.r)/2,o=e.r-t.r,n=e.g-t.g,i=e.b-t.b;return 1-Math.sqrt(((512+r)*o*o>>8)+4*n*n+((767-r)*i*i>>8))/768},e}();t.Colors=r},708:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.OCR=void 0;var r=function(){function e(e){this.words=e}return e.prototype.recognize=function(e,t,r,o){void 0===o&&(o=.8);for(var n=0,i=[],s=0;s<this.words.length;s++){var a=this.words[s],c=getImageSize(a.img);n=Math.max(n,c.width);var f=findImages(e,a.img,r,t,!0);for(var m in f){var h=f[m];i.push({char:a.char,x:h.x,y:h.y,score:h.score,w:c.width})}}i.sort((function(e,t){return e.x-t.x}));for(var g="",u=0,p=0,y=0;y<i.length;y++){var v=i[y];v.x>u?(p=v.score,g+=v.char,u=Math.floor(v.x+v.w*o)):v.x<=u&&v.score>p&&" "!==v.char&&(p=v.score,g=g.substr(0,g.length-1)+v.char,u=Math.floor(v.x+v.w*o))}return g},e}();t.OCR=r},974:function(e,t){var r=this&&this.__spreadArray||function(e,t){for(var r=0,o=t.length,n=e.length;r<o;r++,n++)e[n]=t[r];return e};Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.log=void 0,t.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=(new Date).toLocaleString("en-US",{timeZone:"Asia/Taipei"}),o="["+r+"] ",n=0,i=e;n<i.length;n++){var s=i[n];o+="object"==typeof s?JSON.stringify(s)+" ":s+" "}console.log(o.substr(0,o.length-1))};var o=function(){function e(){}return e.sortStringNumberMap=function(e){var t=[];for(var r in e)t.push({key:r,count:e[r]});return t.sort((function(e,t){return t.count-e.count})),t},e.sleep=function(e){for(;e>200;)e-=200,sleep(200);e>0&&sleep(e)},e.getTaiwanTime=function(){return Date.now()+288e5},e.log=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var n=0;n<t.length;n++){var i=t[n];"object"==typeof i&&(t[n]=JSON.stringify(i))}var s=new Date(e.getTaiwanTime()),a="["+(s.getMonth()+1)+"-"+s.getDate()+"T"+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+"]";console.log.apply(console,r([a],t))},e.notifyEvent=function(t,r){null!=sendEvent&&(e.log("sendEvent",t,r),sendEvent(""+t,""+r))},e.startApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n "+e)},e.stopApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop "+e)},e.getCurrentApp=function(){for(var e="",t="",r=0,o=execute("dumpsys activity top").split("\n");r<o.length;r++){var n=o[r],i=n.indexOf("ACTIVITY");if(-1!==i){e="",t="";for(var s=!0,a=i+9;a<n.length;a++){var c=n[a];if(" "===c)break;"/"===c?s=!1:s?e+=c:t+=c}}}return[e,t]},e}();t.Utils=o}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(607)}()}));

var gScriptVersion = "13.4";

var gSleepShort = 1500;
var gSleepMedium = 3000;
var gSleepLong = 4000;
var gSleepWaitPageLong = 24 * 1000;
var gSleepForAd = 30 * 1000;

var defaultConfig = {
  isXr: true, // hidden setting
  isDev: false, // hidden, only for debug
};

// Uncheck the play demo 
var gPageStartBattleWithPlayDemo = new RF.Page(
  "gPageStartBattleWithPlayDemo",
  [
    {x: 226, y: 534, r: 255, g: 214, b: 61},
    {x: 316, y: 562, r: 230, g: 170, b: 32},
    {x: 143, y: 556, r: 126, g: 118, b: 20},
    {x: 124, y: 19, r: 62, g: 147, b: 249},
    {x: 269, y: 25, r: 188, g: 228, b: 233},
  ],
  { x: 224, y: 535 },
  { x: 25, y: 610 }
);


var gPageStartBattle = new RF.Page(
  "gPageStartBattle",
  [
    {x: 318, y: 566, r: 223, g: 159, b: 34},
    {x: 224, y: 535, r: 10, g: 13, b: 16},
    {x: 145, y: 559, r: 115, g: 83, b: 14},
    {x: 240, y: 22, r: 143, g: 117, b: 16},
    {x: 268, y: 21, r: 149, g: 201, b: 226},
  ],
  { x: 318, y: 567 }, // Start Battle
  { x: 25, y: 610 }
);

var gPageIgnoreNoEneNeedWindow = new RF.Page(
  "gPageIgnoreNoEneNeedWindow",
  [
    {x: 289, y: 494, r: 229, g: 171, b: 33},
    {x: 141, y: 499, r: 93, g: 135, b: 184},
    {x: 68, y: 446, r: 58, g: 141, b: 231},
    {x: 14, y: 445, r: 231, g: 179, b: 24},
  ],
  { x: 290, y: 492 }, // Start Battle
  { x: 130, y: 496 }
);

var gPageChooseBattleTeamMember = new RF.Page(
  "gPageChooseBattleTeamMember",
  [
    {x: 219, y: 605, r: 116, g: 83, b: 13},
    {x: 23, y: 611, r: 17, g: 102, b: 221},
    {x: 290, y: 318, r: 213, g: 215, b: 205},
    {x: 307, y: 17, r: 224, g: 28, b: 28},
    {x: 291, y: 28, r: 14, g: 96, b: 239},
    {x: 297, y: 49, r: 17, g: 179, b: 26},
  ],
  { x: 212, y: 603 } // Ready Icon
)

var gPageTeamReady = new RF.Page(
  "gPageTeamReady",
  [
    {x: 223, y: 606, r: 227, g: 169, b: 29},
    {x: 18, y: 610, r: 99, g: 190, b: 252},
    {x: 306, y: 17, r: 167, g: 19, b: 19},
    {x: 290, y: 30, r: 16, g: 107, b: 244},
    {x: 322, y: 28, r: 181, g: 175, b: 47},
  ],
  { x: 212, y: 603 } // Ready Icon
)


var gPageChooseBattleTeamMember = new RF.Page(
  "gPageChooseBattleTeamMember",
  [
    {x: 219, y: 605, r: 116, g: 83, b: 13},
    {x: 23, y: 611, r: 17, g: 102, b: 221},
    {x: 290, y: 318, r: 213, g: 215, b: 205},
    {x: 307, y: 17, r: 224, g: 28, b: 28},
    {x: 291, y: 28, r: 14, g: 96, b: 239},
    {x: 297, y: 49, r: 17, g: 179, b: 26},
  ],
  { x: 212, y: 603 } // Ready Icon
)

var gPageBattleClear = new RF.Page(
  "gPageBattleClear",
  [
    {x: 215, y: 608, r: 231, g: 171, b: 31},
    {x: 141, y: 603, r: 231, g: 164, b: 27},
    {x: 107, y: 571, r: 153, g: 153, b: 153},
  ],
  { x: 212, y: 603 }
)

var gPageCollectChallenge = new RF.Page(
  "gPageCollectChallenge",
  [
    {x: 226, y: 605, r: 229, g: 171, b: 31},
    {x: 148, y: 603, r: 211, g: 213, b: 203},
    {x: 238, y: 61, r: 37, g: 226, b: 241},
    {x: 17, y: 112, r: 98, g: 118, b: 137},
  ],
  { x: 260, y: 603 }
)

var gPageContinueChapter = new RF.Page(
  "gPageContinueChapter",
  [
    {x: 295, y: 411, r: 230, g: 170, b: 31},
    {x: 147, y: 409, r: 96, g: 146, b: 197},
    {x: 80, y: 358, r: 51, g: 153, b: 238},
    {x: 273, y: 215, r: 56, g: 150, b: 243},
  ],
  {x: 284, y: 413 } // Yes Icon
)

var gPageInBattle = new RF.Page(
  "gPageInBattle",
  [
    {x: 94, y: 452, r: 101, g: 249, b: 255},
    {x: 89, y: 434, r: 4, g: 48, b: 65},
  ]
)

var gPageLogOfStory = new RF.Page(
  "gPageLogOfStory",
  [
    {x: 5, y: 33, r: 114, g: 133, b: 151},
    {x: 23, y: 612, r: 20, g: 100, b: 215},
    {x: 53, y: 611, r: 21, g: 104, b: 206},
    {x: 36, y: 615, r: 0, g: 34, b: 68},
  ],
  {x: 36, y: 615}
)



var gAllPages = [
  gPageStartBattleWithPlayDemo,
  gPageStartBattle,
  gPageIgnoreNoEneNeedWindow,
  gPageChooseBattleTeamMember,
  gPageTeamReady,
  gPageBattleClear,
  gPageCollectChallenge,
  gPageContinueChapter,
  gPageInBattle,
  gPageLogOfStory,

];
var gAllPagesGroup = new RF.GroupPage("gAllPages", gAllPages);

var TASK = {
  changeGameSettings: "changeGameSettings",
  progressStory: "progressStory",
  adReward: "adReward",
};

function DragonBall(config) {
  console.log("############ new MLB9I ############");
  console.log(JSON.stringify(config));
  this.config = config;
  this.screenConfig = new RF.ScreenConfig();
  this.screen = new RF.Screen(this.screenConfig);
  this.isRunning = false;

  // TODO: make task selectable
  this.taskQue = [];
  this.task = "";
  this.taskState = {
    runCount: 0,
    targetRunCount: 0,
    isRepeat: false,
    isForceStopped: false,
  };
  this.taskHistoryRunCount = {
    changeGameSettings: 0,
    playLeagueGame: 0,
    adReward: 0,
  };
  this.unknownCount = 0;
}
DragonBall.prototype.init = function () {
  console.log("############ MLB9I init ############");
  this.isRunning = true;
  this.screenConfig.devWidth = 360;
  this.screenConfig.devHeight = 640;
};
DragonBall.prototype.start = function () {
  this.isRunning = true;
  // if (this.config.isDev) {
  //   this.addTask(
  //     /* taskName */ TASK.changeGameSettings,
  //     /* runtimes */ 1,
  //     /* isRepeat */ false
  //   );
  // }
  this.addTask(
    /* taskName */ TASK.progressStory,
    /* runtimes */ 2,
    /* isRepeat */ true
  );
  this.runTasks();
};
DragonBall.prototype.stop = function (reason) {
  console.log("############ MLB9I stop ############");
  if (reason) {
    console.log("reason:", reason);
  }
  this.isRunning = false;
};

// * =========== task ===========
DragonBall.prototype.addTask = function (taskName, taskRunCount, isRepeat) {
  var taskState = {
    runCount: 0,
    targetRunCount: taskRunCount,
    isRepeat: isRepeat,
    isForceStopped: false,
  };

  // TODO: add task related state by task
  switch (taskName) {
    case TASK.progressStory:
    case TASK.changeGameSettings:
    default:
      break;
  }
  this.taskQue.push({
    name: taskName,
    state: taskState,
  });
};

DragonBall.prototype.runTasks = function () {
  while (this.taskQue.length > 0 && this.isRunning) {
    // update cur task
    var task = this.taskQue.shift();
    this.task = task.name;
    this.taskState = task.state;

    // run cur task
    var targetRunCount = task.state.targetRunCount;
    this.runTask(task.name, targetRunCount);
    this.taskHistoryRunCount[task.name] += this.taskState.runCount;
    console.log(">>>", task.name, "runs:", this.taskHistoryRunCount[task.name]);

    // add tasks that need repeat or not reach target
    if (!this.isRunning) {
      break;
    }
    var isRepeat = task.state.isRepeat;
    var remainRunCounts = targetRunCount - this.taskState.runCount;
    if (isRepeat) {
      this.addTask(task.name, targetRunCount, isRepeat);
    } else if (remainRunCounts > 0) {
      this.addTask(task.name, remainRunCounts, isRepeat);
    }
  }
};

DragonBall.prototype.runTask = function (taskName, taskRunCount) {
  console.log("====== task ======");
  console.log(taskName);
  console.log("==================");
  while (
    this.isRunning &&
    this.task === taskName &&
    this.taskState.runCount < taskRunCount &&
    !this.taskState.isForceStopped
  ) {
    // var isAppOn = this.isAppOn();
    // if (!isAppOn) {
    //   console.log("#ERR: not in app");
    //   if (this.config.isDev) {
    //     this.reopenApp();
    //     RF.Utils.sleep(gSleepLong);
    //   } else {
    //     this.stop("#ERR: not in app");
    //   }
    // }
    var pages = this.findPages();
    // console.log(pages);
    // RF.Utils.sleep(gSleepShort);
    // continue;
    var currentPage = pages[0] || "Unknown";

    if (currentPage !== "Unknown") {
      this.unknownCount = 0;
    } else {
      this.unknownCount++;
    }

    var handler =
      "handle" + (currentPage[0] === "g" ? currentPage.substr(1) : currentPage);
    console.log(handler);
    if (typeof this[handler] === "function") {
      this[handler].bind(this)();
    } else {
      console.log("#ERR:" + currentPage, handler);
    }
    RF.Utils.sleep(gSleepShort);
  }
};

DragonBall.prototype.stopCurTask = function (reason) {
  console.log("[task-stop]", this.task);
  if (reason) {
    console.log("reason:", reason);
  }
  this.taskState.isForceStopped = true;
};

// * ======== general ========
DragonBall.prototype.debug = function (errMsg) {
  if (this.config.isDev) {
    var screenshot = getScreenshot();
    saveImage(
      screenshot,
      "mlb-error" + errMsg + "-" + new Date().toISOString() + ".jpg"
    );
    releaseImage(screenshot);
  }
};
DragonBall.prototype.isAppOn = function () {
  var result = execute("dumpsys window windows").split("mCurrentFocus");
  if (result.length < 2) {
    return false;
  }
  result = result[1].split(" ");
  if (result.length < 3) {
    return false;
  }
  result[2] = result[2].replace("}", "");
  result = result[2].split("/");

  var packageName = "";
  var activityName = "";

  if (result.length == 1) {
    packageName = result[0].trim();
  } else if (result.length > 1) {
    packageName = result[0].trim();
    activityName = result[1].trim();
  }

  console.log("isAppOn", packageName, activityName);
  if (
    packageName ===
    "com.com2us.ninepb3d.normal.freefull.google.global.android.common"
  ) {
    return true;
  }
  return false;
};
DragonBall.prototype.startApp = function () {
  do {
    execute(
      "ANDROID_DATA=/data monkey -p com.com2us.ninepb3d.normal.freefull.google.global.android.common -c android.intent.category.LAUNCHER 1"
    );
    sleep(3000);
  } while (!this.isAppOn());
  console.log("...started app");
};
DragonBall.prototype.stopApp = function stopApp() {
  execute(
    "ANDROID_DATA=/data am force-stop com.com2us.ninepb3d.normal.freefull.google.global.android.common"
  );
  sleep(6000);
  console.log("...stopped app");
};
DragonBall.prototype.reopenApp = function stopApp() {
  this.stopApp();
  this.startApp();
};
DragonBall.prototype.findPages = function () {
  var matches = gAllPagesGroup.isMatchScreen(this.screen);
  console.log("___findPages___");
  console.log(matches);
  console.log("_______________");
  return matches;
};
DragonBall.prototype.getPageByName = function (pageName) {
  for (var i = 0; i < gAllPages.length; i++) {
    if (gAllPages[i].name === pageName) {
      return gAllPages[i];
    }
  }
  return null;
};

// * =========== pages ===========
//enter app
DragonBall.prototype.handlePageStartBattleWithPlayDemo = function () {
  gPageStartBattleWithPlayDemo.goNext(this.screen)
};

DragonBall.prototype.handlePageStartBattle = function () {
  gPageStartBattle.goNext(this.screen)
};

DragonBall.prototype.handlePageIgnoreNoEneNeedWindow = function () {
  gPageIgnoreNoEneNeedWindow.goNext(this.screen)
};

DragonBall.prototype.handlePageChooseBattleTeamMember = function () {
  this.screen.tap({x: 100, y: 370});
  RF.Utils.sleep(1000);
  this.screen.tap({x: 180, y: 370});
  RF.Utils.sleep(1000);
  this.screen.tap({x: 255, y: 370});
  RF.Utils.sleep(1000);
  this.screen.tap({x: 98, y: 443});
  RF.Utils.sleep(1000);
  this.screen.tap({x: 180, y: 443});
  RF.Utils.sleep(1000);

  gPageChooseBattleTeamMember.goNext(this.screen)
};

DragonBall.prototype.handlePageBattleClear = function () {
  gPageBattleClear.goNext(this.screen)
};

DragonBall.prototype.handlePageCollectChallenge = function () {
  gPageCollectChallenge.goNext(this.screen)
};

DragonBall.prototype.handlePageContinueChapter = function () {
  gPageContinueChapter.goNext(this.screen)
};

DragonBall.prototype.handlePageTeamReady = function () {
  gPageTeamReady.goNext(this.screen)
};

DragonBall.prototype.handlePageInBattle = function () {
  this.unknownCount = 0;
  RF.Utils.sleep(3000);
};

DragonBall.prototype.handlePageLogOfStory = function () {
  gPageLogOfStory.goNext(this.screen)
  RF.Utils.sleep(2000);
  this.screen.tap({x: 293, y: 21});  
};




DragonBall.prototype.handleMainPage = function () {
  switch (this.task) {
    case TASK.progressStory:
      this.screen.tap(gMainPageBtns.leagueMode);
      break;
    case TASK.changeGameSettings:
      this.screen.tap(gMainPageBtns.settings);
      break;
    case TASK.adReward:
      // sometimes won't trigger anything if still on cd
      if (this.taskState.tapAdBtnCount > 2) {
        this.stopCurTask("ad is still cd");
        return;
      }
      this.taskState.tapAdBtnCount++;
      this.screen.tap(gMainPageBtns.adTab);
      console.log("tap ad tab");
      break;
    default:
      break;
  }
};

// try to resolve by simply tap back
DragonBall.prototype.handleUnknown = function () {
  this.screen.tap({ x: 0, y: 0 });
  console.log("tap");

  // try to resolve by simply tap back
  if (this.unknownCount % 20 === 0) {
    RF.Utils.sleep(gSleepShort);
    keycode("KEYCODE_BACK", 100);
    console.log("tap back");
    return;
  }
  // TODO: unknown too many times, force to restart app
};

// * =========== entry point ===========
var dragonBall;
function start(jsonConfig) {
  var config = defaultConfig;
  if (typeof jsonConfig === "string") {
    config = JSON.parse(jsonConfig);
  } else if (typeof jsonConfig === "object") {
    config = jsonConfig;
  }

  dragonBall = new DragonBall(config);
  console.log(JSON.stringify(dragonBall.start));
  dragonBall.start();
}
function stop() {
  if (dragonBall === undefined) {
    return;
  }
  dragonBall.stop();
  dragonBall = undefined;
}



// start();
