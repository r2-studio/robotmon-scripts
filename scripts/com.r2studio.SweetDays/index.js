!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.RF=t():e.RF=t()}(this,(function(){return function(){"use strict";var e={607:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,n(r(850),t),n(r(985),t),n(r(837),t),n(r(459),t),n(r(231),t),n(r(200),t),n(r(656),t),n(r(708),t),n(r(974),t),t.version=1},850:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.GroupPage=void 0;var r=function(){function e(e,t){this.name=e,this.pages=t}return e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=[],o=0,n=this.pages;o<n.length;o++){var i=n[o];i.isMatchImage(e,t)&&r.push(i.name)}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingOne=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": "+this.pages.map((function(e){return e.name})).join(","));for(var s=Date.now(),a="",c=0;Date.now()-s<r;){for(var f=t.getCvtDevScreenshot(),m=0,h=this.pages;m<h.length;m++){var g=h[m];if(g.isMatchImage(f,i)){a!==g.name&&(a=g.name,c=0),c++;break}}if(releaseImage(f),""!==a&&c>=o)break;sleep(n)}return e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": matched: "+a+", usedTime "+(Date.now()-s)),a},e.debug=!1,e}();t.GroupPage=r},985:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Page=void 0;var o=r(656),n=function(){function e(e,t,r,o){void 0===r&&(r=void 0),void 0===o&&(o=void 0),this.name=e,this.points=t,this.next=r,this.back=o}return e.prototype.goNext=function(t){void 0!==this.next?t.tap(this.next):e.debug&&console.log("Warning Page: "+this.name+" has no next xy")},e.prototype.goBack=function(t){void 0!==this.back?t.tap(this.back):e.debug&&console.log("Warning Page: "+this.name+" has no back xy")},e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=!0,n=0,i=this.points;n<i.length;n++){var s=i[n],a=getImageColor(e,s.x,s.y);if(o.Colors.identityColor(s,a)<t){r=!1;break}}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingScreen=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name);for(var s=Date.now(),a=0;Date.now()-s<r&&(this.isMatchScreen(t,i)&&a++,!(a>=o));)sleep(n);return a>=o?(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" success, usedTime "+(Date.now()-s)),!0):(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" timeout"),!1)},e.debug=!1,e}();t.Page=n},837:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.XYRGB=void 0;t.XYRGB=function(){this.x=0,this.y=0,this.r=0,this.g=0,this.b=0}},459:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;var o=r(656),n=function(){function e(e){this.config=e;var t=getScreenSize();this.config.deviceHeight=t.height,this.config.deviceWidth=t.width,this.config.screenWidth=t.width,this.config.screenHeight=t.height,this.config.screenOffsetX=0,this.config.screenOffsetY=0}return e.prototype.calculateDeviceOffset=function(e){var t=e(this);this.config.screenWidth=t.screenWidth,this.config.screenHeight=t.screenHeight,this.config.screenOffsetX=t.screenOffsetX,this.config.screenOffsetY=t.screenOffsetY},e.prototype.getScreenX=function(e){return Math.floor(this.config.screenOffsetX+e*this.config.screenWidth/this.config.devWidth)||0},e.prototype.getScreenY=function(e){return Math.floor(this.config.screenOffsetY+e*this.config.screenHeight/this.config.devHeight)||0},e.prototype.getScreenXY=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e)return{x:this.getScreenX(e.x),y:this.getScreenY(e.y)};if("number"==typeof e&&"number"==typeof t)return{x:this.getScreenX(e),y:this.getScreenY(t)};throw new Error("getScreenXY wrong params "+e+", "+t)},e.prototype.tap=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tap(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tap(r,o,this.config.actionDuring)}},e.prototype.tapDown=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapDown(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapDown(r,o,this.config.actionDuring)}},e.prototype.moveTo=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);moveTo(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),moveTo(r,o,this.config.actionDuring)}},e.prototype.tapUp=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapUp(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapUp(r,o,this.config.actionDuring)}},e.prototype.getScreenColor=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getCvtDevScreenshot(),o=getImageColor(r,e.x,e.y);return releaseImage(r),o}if("number"==typeof e&&"number"==typeof t)return r=this.getCvtDevScreenshot(),o=getImageColor(r,e,t),releaseImage(r),o;throw new Error("tapDown wrong params "+e+", "+t)},e.prototype.findImage=function(e){var t=this.getCvtDevScreenshot(),r=findImage(t,e);return releaseImage(t),r},e.prototype.tapImage=function(e){var t=this.findImage(e);this.tap(t)},e.prototype.isSameColor=function(e,t){void 0===t&&(t=.9);var r=this.getScreenColor(e);return o.Colors.identityColor(r,e)>t},e.prototype.getDeviceScreenshot=function(){return getScreenshot()},e.prototype.getScreenScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.screenWidth,this.config.screenHeight,100)},e.prototype.getCvtDevScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.devWidth,this.config.devHeight,100)},e.prototype.setActionDuring=function(e){this.config.actionDuring=e},e.debug=!1,e}();t.Screen=n},231:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenConfig=void 0;t.ScreenConfig=function(){this.devWidth=640,this.devHeight=360,this.deviceWidth=0,this.deviceHeight=0,this.screenWidth=0,this.screenHeight=0,this.screenOffsetX=0,this.screenOffsetY=0,this.actionDuring=180}},200:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.TaskManager=t.Task=void 0;var o=r(974),n=function(){this.name="",this.runTimes=1,this.maxRunningDuring=0,this.minIntervalDuring=0,this.lastRunDoneTime=0,this.run=function(){}};t.Task=n;var i=function(){function e(){this.isRunning=!1,this.runIdx=0,this.tasks=[]}return e.prototype.addTask=function(e,t,r,o,i){void 0===r&&(r=1),void 0===o&&(o=0),void 0===i&&(i=0);var s=new n;s.name=e,s.run=t,s.runTimes=r,s.maxRunningDuring=o,s.minIntervalDuring=i,this.tasks.push(s)},e.prototype.start=function(){if(0===this.tasks.length)throw new Error("TaskManager: No tasks to run");for(console.log("TaskManager start"),this.isRunning=!0;this.isRunning;){var e=Date.now(),t=this.tasks[this.runIdx%this.tasks.length];if(this.runIdx++,!(e-t.lastRunDoneTime<t.minIntervalDuring)){console.log("RunTask "+this.runIdx+" "+t.name+", times "+t.runTimes+", maxDuring "+t.maxRunningDuring);for(var r=0;this.isRunning&&(console.log("TaskRunning "+t.name+", times "+r+"/"+t.runTimes),t.run(),t.lastRunDoneTime=Date.now(),r++,!(0!==t.runTimes&&r>=t.runTimes))&&!(Date.now()-e>t.maxRunningDuring);)sleep(100)}}},e.prototype.stop=function(){this.isRunning=!1,o.Utils.sleep(1e3),console.log("TaskManager stop")},e}();t.TaskManager=i},656:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Colors=void 0;var r=function(){function e(){}return e.getRangeColor=function(e,t,r,o,n){void 0===n&&(n=5);var i=!1;void 0===e&&(i=!0,e=getScreenshot());for(var s=getImageSize(e),a=Math.max(0,t-o),c=Math.max(0,r-o),f=Math.min(s.width,t+o),m=Math.min(s.height,r+o),h=Math.max(1,(f-a)/n),g=Math.max(1,(m-c)/n),u=0,p={r:0,g:0,b:0},y=a;y<f;y+=h)for(var v=c;v<m;v+=g){var l=getImageColor(e,Math.floor(y),Math.floor(v));p.r+=l.r,p.g+=l.g,p.b+=l.b,u++}return i&&releaseImage(e),{r:Math.floor(p.r/u),g:Math.floor(p.g/u),b:Math.floor(p.b/u)}},e.color2hex=function(e){return((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},e.hex2Color=function(e){return{r:parseInt(e[0]+e[1],16),g:parseInt(e[2]+e[3],16),b:parseInt(e[4]+e[5],16)}},e.identityColor=function(e,t){var r=(e.r+t.r)/2,o=e.r-t.r,n=e.g-t.g,i=e.b-t.b;return 1-Math.sqrt(((512+r)*o*o>>8)+4*n*n+((767-r)*i*i>>8))/768},e}();t.Colors=r},708:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.OCR=void 0;var r=function(){function e(e){this.words=e}return e.prototype.recognize=function(e,t,r,o){void 0===o&&(o=.8);for(var n=0,i=[],s=0;s<this.words.length;s++){var a=this.words[s],c=getImageSize(a.img);n=Math.max(n,c.width);var f=findImages(e,a.img,r,t,!0);for(var m in f){var h=f[m];i.push({char:a.char,x:h.x,y:h.y,score:h.score,w:c.width})}}i.sort((function(e,t){return e.x-t.x}));for(var g="",u=0,p=0,y=0;y<i.length;y++){var v=i[y];v.x>u?(p=v.score,g+=v.char,u=Math.floor(v.x+v.w*o)):v.x<=u&&v.score>p&&" "!==v.char&&(p=v.score,g=g.substr(0,g.length-1)+v.char,u=Math.floor(v.x+v.w*o))}return g},e}();t.OCR=r},974:function(e,t){var r=this&&this.__spreadArray||function(e,t){for(var r=0,o=t.length,n=e.length;r<o;r++,n++)e[n]=t[r];return e};Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.log=void 0,t.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=(new Date).toLocaleString("en-US",{timeZone:"Asia/Taipei"}),o="["+r+"] ",n=0,i=e;n<i.length;n++){var s=i[n];o+="object"==typeof s?JSON.stringify(s)+" ":s+" "}console.log(o.substr(0,o.length-1))};var o=function(){function e(){}return e.sortStringNumberMap=function(e){var t=[];for(var r in e)t.push({key:r,count:e[r]});return t.sort((function(e,t){return t.count-e.count})),t},e.sleep=function(e){for(;e>200;)e-=200,sleep(200);e>0&&sleep(e)},e.getTaiwanTime=function(){return Date.now()+288e5},e.log=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var n=0;n<t.length;n++){var i=t[n];"object"==typeof i&&(t[n]=JSON.stringify(i))}var s=new Date(e.getTaiwanTime()),a="["+(s.getMonth()+1)+"-"+s.getDate()+"T"+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+"]";console.log.apply(console,r([a],t))},e.notifyEvent=function(t,r){null!=sendEvent&&(e.log("sendEvent",t,r),sendEvent(""+t,""+r))},e.startApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n "+e)},e.stopApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop "+e)},e.getCurrentApp=function(){for(var e="",t="",r=0,o=execute("dumpsys activity top").split("\n");r<o.length;r++){var n=o[r],i=n.indexOf("ACTIVITY");if(-1!==i){e="",t="";for(var s=!0,a=i+9;a<n.length;a++){var c=n[a];if(" "===c)break;"/"===c?s=!1:s?e+=c:t+=c}}}return[e,t]},e}();t.Utils=o}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(607)}()}));


RF.Page.debug = true;
RF.GroupPage.debug = true;
RF.Screen.debug = true;

var gSleepFrame = 266;
var gSleepShort = 1000;
var gSleepMedium = 2000;
var gSleepLong = 3000;
var gSleepWaitPageShort = 12 * 1000;
var gSleepWaitPageMedium = 24 * 1000;
var gSleepWaitPageLong = 36 * 1000;

var gMainDailyMissionBtn = { x: 34, y: 34 };
var gMainOutsideOpenBtn = { x: 30, y: 610 };
var gMainOutsideHomeBtn = { x: 30, y: 610 };
var gMainOutsideWalkBtn = { x: 90, y: 610 };
var gMainOutsideReturnVisitBtn = { x: 150, y: 610 };
var gMainOutsideInvitationBtn = { x: 270, y: 610 };
var gMainOutsideWaterFlowersBtn = { x: 250, y: 460 };
var gMainFriendBtn = { x: 150, y: 610 };
var gMainFriendHoldPartyBtn = { x: 90, y: 610 };

// var gMission1stIcon = { x: 111, y: 121, r: 250, g: 70, b: 97 };
// var gMission2stIcon = { x: 250, y: 152, r: 250, g: 70, b: 97 };
// var gMission3stIcon = { x: 306, y: 250, r: 250, g: 70, b: 97 };
// var gMission4stIcon = { x: 113, y: 287, r: 250, g: 70, b: 97 };
// var gMission5stIcon = { x: 141, y: 319, r: 250, g: 70, b: 97 };
// var gMission6stIcon = { x: 171, y: 334, r: 250, g: 70, b: 97 };
// var gMission7stIcon = { x: 295, y: 340, r: 250, g: 70, b: 97 };
// var gMission8stIcon = { x: 304, y: 429, r: 250, g: 70, b: 97 };
// var gMission9stIcon = { x: 334, y: 432, r: 250, g: 70, b: 97 };
// var gMission10stIcon = { x: 111, y: 505, r: 250, g: 70, b: 97 };
// var gMission11stIcon = { x: 295, y: 539, r: 250, g: 70, b: 97 };
// var gMission12stIcon = { x: 158, y: 579, r: 250, g: 70, b: 97 };

// var gMissionIcons = [
//   gMission1stIcon,
//   gMission2stIcon,
//   gMission3stIcon,
//   gMission4stIcon,
//   gMission5stIcon,
//   gMission6stIcon,
//   gMission7stIcon,
//   gMission8stIcon,
//   gMission9stIcon,
//   gMission10stIcon,
//   gMission11stIcon,
//   gMission12stIcon,
// ];

// var gMission1stOkIcon = { x: 110, y: 124, r: 13, g: 194, b: 152 };
// var gMission2stOkIcon = { x: 282, y: 249, r: 13, g: 194, b: 152 };
// var gMission3stOkIcon = { x: 271, y: 332, r: 13, g: 194, b: 152 };
// var gMission4stOkIcon = { x: 112, y: 290, r: 13, g: 194, b: 152 };
// var gMission5stOkIcon = { x: 295, y: 344, r: 13, g: 194, b: 152 };
// var gMission6stOkIcon = { x: 302, y: 431, r: 13, g: 194, b: 152 };
// var gMission7stOkIcon = { x: 110, y: 508, r: 13, g: 194, b: 152 };
// var gMission8stOkIcon = { x: 270, y: 523, r: 13, g: 194, b: 152 };
// var gMission9stOkIcon = { x: 292, y: 543, r: 13, g: 194, b: 152 };
// var gMission10stOkIcon = { x: 128, y: 565, r: 13, g: 194, b: 152 };

// var gMissionOkIcons = [
//   gMission1stOkIcon,
//   gMission2stOkIcon,
//   gMission3stOkIcon,
//   gMission4stOkIcon,
//   gMission5stOkIcon,
//   gMission6stOkIcon,
//   gMission7stOkIcon,
//   gMission8stOkIcon,
//   gMission9stOkIcon,
//   gMission10stOkIcon,
// ];

var gMission1st = { x: 81, y: 134, r: 245, g: 179, b: 190 };
var gMission2st = { x: 213, y: 184, r: 208, g: 226, b: 242 };
var gMission3st = { x: 57, y: 220, r: 198, g: 225, b: 249 };
var gMission4st = { x: 259, y: 286, r: 249, g: 253, b: 252 };
var gMission5st = { x: 74, y: 305, r: 255, g: 246, b: 235 };
var gMission6st = { x: 133, y: 349, r: 255, g: 240, b: 209 };
var gMission7st = { x: 257, y: 357, r: 183, g: 243, b: 193 };
var gMission8st = { x: 297, y: 460, r: 249, g: 242, b: 236 };
var gMission9st = { x: 83, y: 517, r: 76, g: 94, b: 80 };
var gMission10st = { x: 261, y: 546, r: 192, g: 212, b: 242 };
var gMission11st = { x: 127, y: 594, r: 255, g: 250, b: 178 };

var gMission1stGo = { x: 80, y: 350 };
var gMission2stGo = { x: 125, y: 346 };
var gMission3stGo = { x: 0, y: 0 };
var gMission4stGo = { x: 0, y: 0 };
var gMission5stGo = { x: 80, y: 370 };
var gMission6stGo = { x: 0, y: 0 };
var gMission7stGo = { x: 56, y: 404 };
var gMission8stGo = { x: 0, y: 0 };
var gMission9stGo = { x: 125, y: 347 };
var gMission10stGo = { x: 106, y: 362 };
var gMission11stGo = { x: 0, y: 0 };

var gMissionCookieList = [
  gMission1st,
  gMission2st,
  // gMission3st,
  gMission4st,
  gMission5st,
  gMission6st,
  gMission7st,
  gMission8st,
  gMission9st,
  gMission10st,
  gMission11st,
];

var gMissionCookieRoleList = [
  gMission1stGo,
  gMission2stGo,
  // gMission3stGo,
  gMission4stGo,
  gMission5stGo,
  gMission6stGo,
  gMission7stGo,
  gMission8stGo,
  gMission9stGo,
  gMission10stGo,
  gMission11stGo,
];

var gStorePage1 = new RF.Page(
  'gStorePage',
  [
    { x: 39, y: 17, r: 255, g: 255, b: 255 },
    { x: 305, y: 15, r: 255, g: 255, b: 255 },
    { x: 48, y: 54, r: 239, g: 155, b: 155 },
    { x: 106, y: 54, r: 255, g: 255, b: 255 },
    { x: 241, y: 53, r: 244, g: 211, b: 215 },
    { x: 346, y: 54, r: 244, g: 211, b: 215 },
  ],
  { x: 340, y: 18 }
);

var gStorePage2 = new RF.Page(
  'gStorePage',
  [
    { x: 62, y: 19, r: 255, g: 255, b: 255 },
    { x: 288, y: 17, r: 255, g: 255, b: 255 },
    { x: 22, y: 52, r: 244, g: 211, b: 215 },
    { x: 128, y: 52, r: 255, g: 255, b: 255 },
    { x: 150, y: 46, r: 239, g: 168, b: 168 },
    { x: 229, y: 51, r: 255, g: 255, b: 255 },
    { x: 247, y: 51, r: 244, g: 211, b: 215 },
    { x: 345, y: 55, r: 244, g: 211, b: 215 },
  ],
  { x: 340, y: 18 }
);

var gStorePage3 = new RF.Page(
  'gStorePage',
  [
    { x: 65, y: 15, r: 255, g: 255, b: 255 },
    { x: 291, y: 15, r: 255, g: 255, b: 255 },
    { x: 16, y: 50, r: 244, g: 211, b: 215 },
    { x: 113, y: 51, r: 244, g: 211, b: 215 },
    { x: 136, y: 39, r: 244, g: 211, b: 215 },
    { x: 228, y: 43, r: 244, g: 211, b: 215 },
    { x: 248, y: 49, r: 255, g: 255, b: 255 },
    { x: 282, y: 55, r: 239, g: 155, b: 155 },
    { x: 344, y: 53, r: 255, g: 255, b: 255 },
  ],
  { x: 340, y: 18 }
);

var gMissionOtherHomePage = new RF.Page(
  'gMissionOtherHomePage',
  [
    { x: 36, y: 32, r: 255, g: 255, b: 255 },
    { x: 203, y: 22, r: 80, g: 77, b: 75 },
    { x: 295, y: 21, r: 85, g: 77, b: 75 },
    { x: 28, y: 25, r: 255, g: 255, b: 255 },
    { x: 184, y: 18, r: 250, g: 116, b: 136 },
  ],
  { x: 34, y: 34 }
);

var gGiftPageGetting = new RF.Page(
  'gGiftPageGetting',
  [
    { x: 61, y: 203, r: 239, g: 155, b: 155 },
    { x: 291, y: 203, r: 239, g: 155, b: 155 },
    { x: 43, y: 272, r: 244, g: 228, b: 228 },
    { x: 314, y: 274, r: 244, g: 228, b: 228 },
    { x: 45, y: 380, r: 244, g: 228, b: 228 },
    { x: 319, y: 382, r: 244, g: 228, b: 228 },
    { x: 70, y: 460, r: 255, g: 255, b: 255 },
    { x: 209, y: 460, r: 239, g: 155, b: 155 },
    { x: 326, y: 460, r: 151, g: 201, b: 180 },
  ],
  { x: 324, y: 50 }
);

var gMainPopupDialog = new RF.Page(
  'gMainPopupDialog',
  [
    { x: 24, y: 26, r: 239, g: 155, b: 155 },
    { x: 338, y: 164, r: 151, g: 201, b: 180 },
    { x: 265, y: 170, r: 252, g: 252, b: 252 },
    { x: 218, y: 308, r: 244, g: 228, b: 228 },
    { x: 221, y: 321, r: 248, g: 248, b: 248 },
  ],
  { x: 330, y: 165 }
);

var gGameBackBtnPage = new RF.Page(
  'gGameBackBtnPage',
  [
    { x: 14, y: 26, r: 255, g: 255, b: 255 },
    { x: 27, y: 26, r: 255, g: 255, b: 255 },
  ],
  { x: 25, y: 25 }
);
var gMainPage = new RF.Page('MainPage', [
  { x: 23, y: 25, r: 239, g: 155, b: 155 },
  { x: 84, y: 11, r: 193, g: 172, b: 139 },
  { x: 105, y: 22, r: 344, g: 53, b: 91 },
  { x: 180, y: 16, r: 147, g: 195, b: 175 },
  { x: 203, y: 22, r: 71, g: 63, b: 66 },
  { x: 295, y: 21, r: 85, g: 79, b: 79 },
  { x: 272, y: 18, r: 255, g: 255, b: 255 },
  { x: 35, y: 603, r: 239, g: 155, b: 155 },
  { x: 66, y: 607, r: 255, g: 255, b: 255 },
  { x: 146, y: 600, r: 239, g: 155, b: 155 },
  { x: 211, y: 610, r: 239, g: 155, b: 155 },
  { x: 296, y: 608, r: 255, g: 255, b: 255 },
]);

var gMainPageOutsideMenu = new RF.Page(
  'gMainPageOutsideMenu',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 35, y: 545, r: 255, g: 255, b: 255 },
    { x: 50, y: 554, r: 239, g: 155, b: 155 },
    { x: 144, y: 556, r: 239, g: 155, b: 155 },
    { x: 168, y: 551, r: 255, g: 255, b: 255 },
    { x: 210, y: 554, r: 239, g: 155, b: 155 },
    { x: 225, y: 552, r: 255, g: 255, b: 255 },
    { x: 152, y: 607, r: 239, g: 155, b: 155 },
    { x: 272, y: 607, r: 244, g: 193, b: 193 },
  ],
  { x: 30, y: 550 }
);

var gMainPageOutsideMenuReturnVisit = new RF.Page(
  'gMainPageOutsideMenuReturnVisit',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 38, y: 518, r: 239, g: 155, b: 155 },
    { x: 47, y: 507, r: 255, g: 255, b: 255 },
    { x: 135, y: 528, r: 239, g: 155, b: 155 },
    { x: 150, y: 520, r: 255, g: 255, b: 255 },
    { x: 275, y: 523, r: 239, g: 155, b: 155 },
    { x: 317, y: 510, r: 255, g: 255, b: 255 },
  ],
  { x: 150, y: 520 }
);

var gMainPageOutsideMenuInvitation = new RF.Page(
  'gMainPageOutsideMenuInvitation',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 38, y: 520, r: 239, g: 155, b: 155 },
    { x: 152, y: 519, r: 239, g: 155, b: 155 },
    { x: 153, y: 503, r: 255, g: 255, b: 255 },
    { x: 273, y: 520, r: 255, g: 255, b: 255 },
    { x: 288, y: 522, r: 239, g: 155, b: 155 },
  ],
  { x: 270, y: 520 }
);

var gMainPageFriendMenu = new RF.Page(
  'gMainPageFriendMenu',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 35, y: 548, r: 239, g: 155, b: 155 },
    { x: 145, y: 555, r: 255, g: 255, b: 255 },
    { x: 168, y: 563, r: 239, g: 155, b: 155 },
    { x: 146, y: 599, r: 239, g: 155, b: 155 },
    { x: 158, y: 600, r: 255, g: 255, b: 255 },
    { x: 268, y: 606, r: 255, g: 255, b: 255 },
  ],
  { x: 150, y: 550 }
);

var gMainPageItemMenu = new RF.Page(
  'gMainPageItemMenu',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 207, y: 554, r: 255, g: 255, b: 255 },
    { x: 227, y: 552, r: 239, g: 155, b: 155 },
    { x: 145, y: 555, r: 239, g: 155, b: 155 },
    { x: 33, y: 546, r: 239, g: 155, b: 155 },
    { x: 36, y: 601, r: 239, g: 155, b: 155 },
    { x: 214, y: 610, r: 239, g: 155, b: 155 },
    { x: 268, y: 606, r: 239, g: 155, b: 155 },
    { x: 282, y: 608, r: 255, g: 255, b: 255 },
  ],
  { x: 210, y: 550 }
);

var gOutsidePageWalkAround = new RF.Page(
  'gOutsidePageWalkAround',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 31, y: 603, r: 255, g: 255, b: 255 },
    { x: 46, y: 608, r: 255, g: 255, b: 255 },
    { x: 93, y: 599, r: 239, g: 155, b: 155 },
    { x: 153, y: 608, r: 239, g: 155, b: 155 },
    { x: 224, y: 604, r: 255, g: 255, b: 255 },
    { x: 273, y: 610, r: 239, g: 155, b: 155 },
  ],
  { x: 30, y: 610 }
);

var gOutsidePageReturnVisit = new RF.Page(
  'gOutsidePageReturnVisit',
  [
    { x: 23, y: 25, r: 239, g: 155, b: 155 },
    { x: 84, y: 11, r: 193, g: 172, b: 139 },
    { x: 105, y: 22, r: 74, g: 76, b: 79 },
    { x: 180, y: 16, r: 147, g: 195, b: 175 },
    { x: 203, y: 22, r: 74, g: 76, b: 79 },
    { x: 295, y: 21, r: 74, g: 76, b: 79 },
    { x: 272, y: 18, r: 255, g: 255, b: 255 },
    { x: 31, y: 518, r: 255, g: 255, b: 255 },
    { x: 46, y: 519, r: 255, g: 255, b: 255 },
    { x: 91, y: 522, r: 239, g: 155, b: 155 },
    { x: 149, y: 516, r: 255, g: 255, b: 255 },
    { x: 166, y: 524, r: 239, g: 155, b: 155 },
    { x: 273, y: 520, r: 239, g: 155, b: 155 },
  ],
  { x: 30, y: 520 }
);

var gNetworkWarning = new RF.Page(
  'gNetworkWarning',
  [
    { x: 38, y: 229, r: 239, g: 155, b: 155 },
    { x: 334, y: 228, r: 239, g: 155, b: 155 },
    { x: 39, y: 359, r: 255, g: 255, b: 255 },
    { x: 330, y: 357, r: 255, g: 255, b: 255 },
    { x: 36, y: 410, r: 239, g: 155, b: 155 },
    { x: 178, y: 407, r: 255, g: 255, b: 255 },
    { x: 327, y: 407, r: 151, g: 201, b: 180 },
  ],
  { x: 266, y: 408 }
);

var gGetGiftPage = new RF.Page(
  'gGetGiftPage',
  [
    { x: 50, y: 226, r: 239, g: 155, b: 155 },
    { x: 330, y: 224, r: 239, g: 155, b: 155 },
    { x: 59, y: 314, r: 244, g: 228, b: 228 },
    { x: 297, y: 312, r: 244, g: 228, b: 228 },
    { x: 46, y: 401, r: 255, g: 255, b: 255 },
    { x: 265, y: 403, r: 255, g: 255, b: 255 },
    { x: 328, y: 404, r: 151, g: 201, b: 180 },
    { x: 179, y: 393, r: 239, g: 155, b: 155 },
  ],
  { x: 176, y: 391 }
);

var gGetGiftMusicPage = new RF.Page(
  'gGetGiftMusicPage',
  [
    { x: 64, y: 145, r: 239, g: 155, b: 155 },
    { x: 301, y: 145, r: 239, g: 155, b: 155 },
    { x: 71, y: 216, r: 255, g: 255, b: 255 },
    { x: 113, y: 352, r: 252, g: 186, b: 113 },
    { x: 161, y: 477, r: 239, g: 155, b: 155 },
    { x: 312, y: 478, r: 151, g: 201, b: 180 },
  ],
  { x: 250, y: 488 }
);

var gBuyItemPage = new RF.Page(
  'gBuyItemPage',
  [
    { x: 59, y: 228, r: 239, g: 155, b: 155 },
    { x: 296, y: 225, r: 239, g: 155, b: 155 },
    { x: 35, y: 339, r: 244, g: 228, b: 228 },
    { x: 324, y: 340, r: 244, g: 228, b: 228 },
    { x: 48, y: 404, r: 255, g: 255, b: 255 },
    { x: 185, y: 404, r: 229, g: 106, b: 121 },
    { x: 328, y: 405, r: 151, g: 201, b: 180 },
  ],
  { x: 324, y: 406 }
);

var gNoStrength = new RF.Page(
  'gNoStrength',
  [
    { x: 93, y: 223, r: 239, g: 155, b: 155 },
    { x: 279, y: 226, r: 239, g: 155, b: 155 },
    { x: 217, y: 308, r: 85, g: 79, b: 79 },
    { x: 239, y: 393, r: 229, g: 106, b: 121 },
    { x: 330, y: 404, r: 151, g: 201, b: 180 },
    { x: 72, y: 404, r: 255, g: 255, b: 255 },
    { x: 187, y: 265, r: 147, g: 195, b: 175 },
  ],
  { x: 320, y: 400 }
);

var gWarningDialog = new RF.Page(
  'gWarningDialog',
  [
    { x: 90, y: 225, r: 239, g: 155, b: 155 },
    { x: 259, y: 225, r: 239, g: 155, b: 155 },
    { x: 173, y: 347, r: 255, g: 255, b: 255 },
    { x: 153, y: 406, r: 239, g: 155, b: 155 },
    { x: 207, y: 405, r: 239, g: 155, b: 155 },
  ],
  { x: 176, y: 410 }
);

var gWarningDialog2 = new RF.Page(
  'gWarningDialog2',
  [
    { x: 49, y: 191, r: 239, g: 155, b: 155 },
    { x: 319, y: 189, r: 239, g: 155, b: 155 },
    { x: 41, y: 403, r: 255, g: 255, b: 255 },
    { x: 322, y: 400, r: 255, g: 255, b: 255 },
    { x: 42, y: 438, r: 255, g: 255, b: 255 },
    { x: 124, y: 439, r: 239, g: 155, b: 155 },
    { x: 329, y: 432, r: 151, g: 201, b: 180 },
  ],
  { x: 322, y: 430 }
);

var gWarningHomeFlower = new RF.Page(
  'gWarningHomeFlower',
  [
    { x: 62, y: 226, r: 239, g: 155, b: 155 },
    { x: 319, y: 226, r: 239, g: 155, b: 155 },
    { x: 63, y: 400, r: 255, g: 255, b: 255 },
    { x: 217, y: 404, r: 239, g: 155, b: 155 },
    { x: 270, y: 404, r: 255, g: 255, b: 255 },
    { x: 328, y: 404, r: 151, g: 201, b: 180 },
    { x: 180, y: 347, r: 255, g: 255, b: 255 },
  ],
  { x: 320, y: 410 }
);

var gMissionPage = new RF.Page(
  'gMissionPage',
  [
    { x: 28, y: 26, r: 255, g: 255, b: 255 },
    { x: 206, y: 22, r: 81, g: 77, b: 70 },
    { x: 298, y: 19, r: 81, g: 77, b: 70 },
    { x: 235, y: 220, r: 173, g: 234, b: 189 },
    { x: 144, y: 492, r: 255, g: 218, b: 204 },
    { x: 35, y: 567, r: 192, g: 242, b: 250 },
  ],
  { x: 20, y: 26 }
);

var gMissionNoCookie = new RF.Page('gMissionNoCookie', [
  { x: 28, y: 24, r: 255, g: 255, b: 255 },
  { x: 90, y: 21, r: 212, g: 212, b: 212 },
  { x: 108, y: 21, r: 212, g: 212, b: 212 },
  { x: 122, y: 21, r: 212, g: 212, b: 212 },
  { x: 137, y: 21, r: 212, g: 212, b: 212 },
  { x: 152, y: 21, r: 212, g: 212, b: 212 },
  { x: 210, y: 21, r: 81, g: 77, b: 70 },
  { x: 305, y: 20, r: 81, g: 77, b: 70 },
]);

var gMissionEmptyDialog = new RF.Page(
  'gMissionEmptyDialog',
  [
    { x: 9, y: 330, r: 255, g: 239, b: 241 },
    { x: 8, y: 407, r: 255, g: 239, b: 241 },
    { x: 6, y: 463, r: 255, g: 239, b: 241 },
    { x: 8, y: 541, r: 255, g: 239, b: 241 },
    { x: 6, y: 611, r: 255, g: 239, b: 241 },
    { x: 97, y: 327, r: 255, g: 239, b: 241 },
    { x: 192, y: 327, r: 255, g: 239, b: 241 },
    { x: 290, y: 328, r: 255, g: 239, b: 241 },
  ],
  { x: 188, y: 594 }
);

var gMissionNewDialog = new RF.Page(
  'gMissionNewDialog',
  [
    { x: 53, y: 153, r: 239, g: 155, b: 155 },
    { x: 321, y: 149, r: 239, g: 155, b: 155 },
    { x: 45, y: 198, r: 255, g: 255, b: 255 },
    { x: 320, y: 198, r: 255, g: 255, b: 255 },
    { x: 63, y: 354, r: 191, g: 175, b: 154 },
    { x: 220, y: 487, r: 239, g: 155, b: 155 },
    { x: 292, y: 372, r: 244, g: 228, b: 228 },
  ],
  { x: 180, y: 480 }
);

var gMissionFinishDialog1 = new RF.Page(
  'gMissionFinishDialog1',
  [
    { x: 39, y: 180, r: 239, g: 155, b: 155 },
    { x: 323, y: 181, r: 239, g: 155, b: 155 },
    { x: 55, y: 299, r: 191, g: 175, b: 154 },
    { x: 311, y: 299, r: 191, g: 175, b: 154 },
    { x: 319, y: 320, r: 244, g: 228, b: 228 },
    { x: 215, y: 441, r: 239, g: 155, b: 155 },
  ],
  { x: 180, y: 450 }
);

var gMissionFinishDialog2 = new RF.Page(
  'gMissionFinishDialog2',
  [
    { x: 40, y: 154, r: 239, g: 155, b: 155 },
    { x: 323, y: 154, r: 239, g: 155, b: 155 },
    { x: 73, y: 261, r: 191, g: 175, b: 154 },
    { x: 74, y: 353, r: 191, g: 175, b: 154 },
    { x: 60, y: 373, r: 244, g: 228, b: 228 },
    { x: 44, y: 481, r: 239, g: 155, b: 155 },
    { x: 193, y: 480, r: 151, g: 201, b: 180 },
  ],
  { x: 100, y: 480 }
);

var gMissionNewSleep = new RF.Page(
  'gMissionNewSleep',
  [
    { x: 65, y: 547, r: 239, g: 155, b: 155 },
    { x: 296, y: 546, r: 239, g: 155, b: 155 },
    { x: 28, y: 588, r: 255, g: 255, b: 255 },
    { x: 331, y: 590, r: 255, g: 255, b: 255 },
    { x: 338, y: 614, r: 255, g: 255, b: 255 },
    { x: 26, y: 613, r: 255, g: 255, b: 255 },
  ],
  { x: 150, y: 340 }
);

var gMainPageFlowerFinishUpgrade = new RF.Page(
  'gMainPageFlowerFinishUpgrade',
  [
    { x: 201, y: 336, r: 239, g: 155, b: 155 },
    { x: 178, y: 465, r: 255, g: 255, b: 255 },
    { x: 128, y: 466, r: 255, g: 255, b: 255 },
    { x: 8, y: 508, r: 244, g: 211, b: 215 },
    { x: 74, y: 610, r: 255, g: 255, b: 255 },
    { x: 240, y: 608, r: 229, g: 106, b: 121 },
    { x: 340, y: 610, r: 151, g: 201, b: 180 },
    { x: 109, y: 24, r: 83, g: 72, b: 67 },
  ],
  { x: 340, y: 610 }, // goNext() not upgrade
  { x: 187, y: 611 } // goBack() spent money upgrade
);

var gFriendHoldingParty = new RF.Page('gFriendHoldingParty', [
  { x: 351, y: 102, r: 255, g: 255, b: 255 },
  { x: 349, y: 114, r: 244, g: 228, b: 228 },
  { x: 294, y: 109, r: 255, g: 255, b: 255 },
]);

var gFriendHoldPartyPage = new RF.Page(
  'gFriendHoldPartyPage',
  [
    { x: 97, y: 146, r: 255, g: 255, b: 255 },
    { x: 92, y: 164, r: 239, g: 155, b: 155 },
    { x: 172, y: 200, r: 255, g: 255, b: 255 },
    { x: 70, y: 398, r: 244, g: 228, b: 228 },
    { x: 73, y: 439, r: 255, g: 255, b: 255 },
    { x: 117, y: 615, r: 243, g: 205, b: 138 },
    { x: 338, y: 608, r: 151, g: 201, b: 180 },
    { x: 335, y: 569, r: 244, g: 228, b: 228 },
  ],
  { x: 330, y: 610 }
);

var gFriendHoldingPartyWarning = new RF.Page(
  'gFriendHoldingPartyWarning',
  [
    { x: 39, y: 226, r: 239, g: 155, b: 155 },
    { x: 333, y: 229, r: 239, g: 155, b: 155 },
    { x: 82, y: 327, r: 255, g: 255, b: 255 },
    { x: 266, y: 326, r: 255, g: 255, b: 255 },
    { x: 150, y: 405, r: 239, g: 155, b: 155 },
    { x: 218, y: 405, r: 239, g: 155, b: 155 },
    { x: 308, y: 406, r: 255, g: 255, b: 255 },
    { x: 238, y: 613, r: 140, g: 121, b: 88 },
  ],
  { x: 182, y: 406 }
);

var gFriendHoldPartyContentPage1 = new RF.Page(
  'gFriendHoldPartyContentPage1',
  [
    { x: 31, y: 87, r: 239, g: 155, b: 155 },
    { x: 331, y: 87, r: 239, g: 155, b: 155 },
    { x: 31, y: 149, r: 255, g: 255, b: 255 },
    { x: 59, y: 285, r: 191, g: 175, b: 154 },
    { x: 313, y: 286, r: 191, g: 175, b: 154 },
    { x: 314, y: 398, r: 244, g: 228, b: 228 },
    { x: 221, y: 546, r: 239, g: 155, b: 155 },
    { x: 331, y: 544, r: 151, g: 201, b: 180 },
  ],
  { x: 330, y: 546 }
);

var gFriendHoldPartyContentPage2 = new RF.Page(
  'gFriendHoldPartyContentPage2',
  [
    { x: 83, y: 404, r: 255, g: 255, b: 255 },
    { x: 93, y: 420, r: 239, g: 155, b: 155 },
    { x: 157, y: 425, r: 255, g: 255, b: 255 },
    { x: 219, y: 600, r: 239, g: 155, b: 155 },
    { x: 341, y: 608, r: 151, g: 201, b: 180 },
    { x: 289, y: 405, r: 239, g: 155, b: 155 },
    { x: 333, y: 417, r: 255, g: 255, b: 255 },
  ],
  { x: 330, y: 610 }
);

var gFriendHoldPartyContentPage3 = new RF.Page(
  'gFriendHoldPartyContentPage3',
  [
    { x: 18, y: 340, r: 253, g: 248, b: 242 },
    { x: 291, y: 341, r: 253, g: 248, b: 243 },
    { x: 39, y: 380, r: 239, g: 155, b: 155 },
    { x: 195, y: 408, r: 255, g: 255, b: 255 },
    { x: 69, y: 577, r: 244, g: 211, b: 215 },
    { x: 53, y: 608, r: 255, g: 255, b: 255 },
    { x: 219, y: 598, r: 239, g: 155, b: 155 },
    { x: 341, y: 610, r: 151, g: 201, b: 180 },
  ],
  { x: 330, y: 610 }
);

var gFriendHoldPartyContentPage4 = new RF.Page(
  'gFriendHoldPartyContentPage4',
  [
    { x: 25, y: 420, r: 255, g: 255, b: 255 },
    { x: 178, y: 418, r: 255, g: 255, b: 255 },
    { x: 198, y: 417, r: 239, g: 155, b: 155 },
    { x: 318, y: 417, r: 255, g: 255, b: 255 },
    { x: 68, y: 456, r: 244, g: 211, b: 215 },
    { x: 72, y: 556, r: 244, g: 228, b: 228 },
    { x: 68, y: 615, r: 255, g: 255, b: 255 },
    { x: 219, y: 600, r: 239, g: 155, b: 155 },
    { x: 338, y: 608, r: 151, g: 201, b: 180 },
  ],
  { x: 330, y: 610 }
);

var gFriendJoinPartyPage = new RF.Page(
  'gFriendJoinPartyPage',
  [
    { x: 43, y: 228, r: 255, g: 255, b: 255 },
    { x: 180, y: 224, r: 255, g: 255, b: 255 },
    { x: 198, y: 225, r: 239, g: 155, b: 155 },
    { x: 328, y: 222, r: 255, g: 255, b: 255 },
    { x: 72, y: 444, r: 244, g: 228, b: 228 },
    { x: 273, y: 442, r: 244, g: 228, b: 228 },
    { x: 72, y: 611, r: 255, g: 255, b: 255 },
    { x: 287, y: 611, r: 255, g: 255, b: 255 },
    { x: 215, y: 615, r: 226, g: 226, b: 226 },
    { x: 338, y: 611, r: 151, g: 201, b: 180 },
  ],
  { x: 330, y: 614 }
);

var gFriendJoinPartyBuyItemPage = new RF.Page(
  'gFriendJoinPartyBuyItemPage',
  [
    { x: 77, y: 218, r: 255, g: 255, b: 255 },
    { x: 180, y: 208, r: 255, g: 255, b: 255 },
    { x: 195, y: 210, r: 239, g: 155, b: 155 },
    { x: 333, y: 215, r: 255, g: 255, b: 255 },
    { x: 76, y: 424, r: 244, g: 228, b: 228 },
    { x: 60, y: 613, r: 255, g: 255, b: 255 },
    { x: 185, y: 613, r: 229, g: 106, b: 121 },
    { x: 341, y: 610, r: 151, g: 201, b: 180 },
  ],
  { x: 330, y: 616 }
);

var gAllPages = [
  gStorePage1,
  gStorePage2,
  gStorePage3,
  gGiftPageGetting,
  gNetworkWarning,
  gGetGiftPage,
  gGetGiftMusicPage,
  gMainPopupDialog,
  gNoStrength,
  gWarningHomeFlower,
  gWarningDialog,
  gWarningDialog2,
  gBuyItemPage,
  gMissionOtherHomePage,
  // mission
  gMissionPage,
  gMissionNewDialog,
  gMissionFinishDialog1,
  gMissionFinishDialog2,
  gMissionNewSleep,
  // in home
  gMainPage,
  gMainPageOutsideMenu,
  gMainPageOutsideMenuReturnVisit,
  gMainPageOutsideMenuInvitation,
  gMainPageFriendMenu,
  gMainPageItemMenu,
  gMainPageFlowerFinishUpgrade,
  // outside
  gOutsidePageWalkAround,
  gOutsidePageReturnVisit,
  // friend
  gFriendHoldPartyPage,
  gFriendHoldPartyContentPage1,
  gFriendHoldPartyContentPage2,
  gFriendHoldPartyContentPage3,
  gFriendHoldPartyContentPage4,
  gFriendHoldingPartyWarning,
  gFriendJoinPartyPage,
  gFriendJoinPartyBuyItemPage,
  gMissionEmptyDialog,
];

var gAllGroupPages = new RF.GroupPage('AllPage', gAllPages);

function SD(config) {
  this.config = config;
  this.screenConfig = new RF.ScreenConfig();
  this.screen = new RF.Screen(this.screenConfig);
  this.taskManager = new RF.TaskManager();
  this.running = false;
}

SD.prototype.calculateScreenSize = function () {
  if (this.screenConfig.deviceHeight > (this.screenConfig.deviceWidth * 16) / 9) {
    var screenHeight = (this.screenConfig.devWidth * 16) / 9;
    var offsetY = Math.floor((this.screenConfig.deviceHeight - screenHeight) / 2);
    console.log('screenRatio', this.screenConfig.deviceHeight, '/', this.screenConfig.deviceWidth);
    console.log('screenRatio > 16/9 offset', offsetY);

    this.screenConfig.screenWidth = this.screenConfig.deviceWidth;
    this.screenConfig.screenHeight = Math.floor(screenHeight);
    this.screenConfig.screenOffsetX = 0;
    this.screenConfig.screenOffsetY = offsetY;
  }
  console.log('calculateScreenSize screenConfig', JSON.stringify(this.screenConfig, null, 2));
};

SD.prototype.detectScreenSize = function () {
  var deviceWH = getScreenSize();
  var screenHeight = (deviceWH.width * 16) / 9;
  var maxOffsetY = deviceWH.height - screenHeight;
  var offsetY = 0;
  var img = getScreenshot();
  var x = deviceWH.width * 0.96;
  for (var y = maxOffsetY; y >= 0; y--) {
    var color = getImageColor(img, x, y);
    var score = RF.Colors.identityColor({ r: 0, g: 0, b: 0 }, color);
    if (score > 0.98) {
      console.log('detect offsetY', y);
      offsetY = y;
      break;
    }
  }
  releaseImage(img);

  this.screenConfig.screenWidth = this.screenConfig.deviceWidth;
  this.screenConfig.screenHeight = Math.floor(screenHeight);
  this.screenConfig.screenOffsetX = 0;
  this.screenConfig.screenOffsetY = offsetY;
  console.log('detectScreenSize screenConfig', JSON.stringify(this.screenConfig, null, 2));
};

SD.prototype.manualSetOffsetY = function (offsetY) {
  this.screenConfig.screenWidth = this.screenConfig.deviceWidth;
  this.screenConfig.screenHeight = Math.floor((this.screenConfig.deviceWidth * 16) / 9);
  this.screenConfig.screenOffsetX = 0;
  this.screenConfig.screenOffsetY = offsetY;
  console.log('manualSetOffsetY screenConfig', JSON.stringify(this.screenConfig, null, 2));
};

var defaultConfig = {
  enableTaskReturnVisit: true,
  returnVisitMinInterval: 20,
  enableTaskWalkAround: true,
  walkAroundMinInterval: 20,
  walkAroundOnlyTakeFruit: true,
  enableTaskJoinParty: true,
  enableTaskHoldParty: true,
  enableTaskHomeFlower: true,
  enableTaskCookieMission: true,
  // enableTaskFinishDailyMission: true,
  // enableTaskNewDailyMission: true,
  calculateScreenMethod: 'auto', // auto, detect, manual
  manualSetOffsetY: 0,
};

SD.prototype.init = function () {
  this.running = true;
  this.screenConfig.devWidth = 360;
  this.screenConfig.devHeight = 640;
  this.screenConfig.actionDuring = 266;
  if (this.config.calculateScreenMethod === 'auto') {
    this.calculateScreenSize();
  } else if (this.config.calculateScreenMethod === 'detect') {
    this.detectScreenSize();
  } else if (this.config.calculateScreenMethod === 'manual') {
    this.manualSetOffsetY(manualSetOffsetY);
  }
  // addTask(name: string, run: () => void, runTimes: number = 1, maxRunningDuring: number = 0, minIntervalDuring: number = 0)
  if (this.config.enableTaskReturnVisit) {
    this.taskManager.addTask(
      'taskReturnVisit',
      this.taskReturnVisit.bind(this),
      1,
      0,
      this.config.returnVisitMinInterval * 60 * 1000
    );
  }
  if (this.config.enableTaskWalkAround) {
    this.taskManager.addTask(
      'TaskWalkAround',
      this.taskWalkAround.bind(this),
      1,
      0,
      this.config.walkAroundMinInterval * 60 * 1000
    );
  }
  if (this.config.enableTaskJoinParty) {
    this.taskManager.addTask('taskJoinParty', this.taskJoinParty.bind(this), 1);
  }
  if (this.config.enableTaskHoldParty) {
    this.taskManager.addTask('taskHoldParty', this.taskHoldParty.bind(this), 1);
  }
  if (this.config.enableTaskCookieMission) {
    this.taskManager.addTask('taskCookieMission', this.taskCookieMission.bind(this), 1);
  }
  // if (this.config.enableTaskFinishDailyMission) {
  //   this.taskManager.addTask('taskFinishDailyMission', this.taskFinishDailyMission.bind(this), 1);
  // }
  // if (this.config.enableTaskNewDailyMission) {
  //   this.taskManager.addTask('taskNewDailyMission', this.taskNewDailyMission.bind(this), 1);
  // }
  if (this.config.enableTaskHomeFlower) {
    this.taskManager.addTask('taskHomeFlower', this.taskHomeFlower.bind(this), 1);
  }
};

SD.prototype.taskWalkAround = function () {
  console.log('taskWalkAround start ...');
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainOutsideOpenBtn);
  RF.Utils.sleep(gSleepMedium);
  for (var i = 0; i < 5; i++) {
    this.screen.tap(gMainOutsideWalkBtn); // go others home
    RF.Utils.sleep(gSleepMedium);
    var success = gOutsidePageWalkAround.waitScreenForMatchingScreen(this.screen, gSleepWaitPageLong, 2, gSleepShort);
    if (!success) {
      console.log('taskWalkAround failed');
      return;
    }
    RF.Utils.sleep(gSleepLong);

    if (this.config.walkAroundOnlyTakeFruit) {
      console.log('Only take fruit, check it');
      if (!this.isFruit()) {
        console.log('Not fruit, go next');
        i--;
        continue;
      }
    }

    this.screen.tap(gMainOutsideWaterFlowersBtn); // water it
    console.log('taskWalkAround water flower success times', i);
    RF.Utils.sleep(gSleepWaitPageShort); // water flower so long

    // check exception
    var pages = this.findPages();
    if (pages.length > 0) {
      var page = pages[0];
      if (page === 'gNoStrength') {
        console.log('taskWalkAround No Strength', page, 'times', i);
        this.goMainPage();
        return;
      } else if (page === 'gWarningDialog') {
        gWarningDialog.goNext(this.screen);
        RF.Utils.sleep(gSleepLong);
        continue;
      }
    }

    // might have animation
    success = gOutsidePageWalkAround.waitScreenForMatchingScreen(this.screen, gSleepWaitPageLong, 2, gSleepShort);
    if (!success) {
      console.log('taskWalkAround wait animation failed');
      return;
    }
  }
  this.goMainPage();
};

SD.prototype.taskReturnVisit = function () {
  console.log('taskReturnVisit start ...');
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainOutsideOpenBtn);
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainOutsideReturnVisitBtn);
  RF.Utils.sleep(gSleepLong);
  for (var i = 0; i < 5; i++) {
    // check empty
    var isEmpty = this.screen.isSameColor({ x: 50, y: 620, r: 244, g: 211, b: 215 }, 0.99);
    if (isEmpty) {
      console.log('taskReturnVisit no people to return times', i);
      return;
    }
    this.screen.tap({ x: 30, y: 600 });
    RF.Utils.sleep(gSleepMedium);
    var success = gOutsidePageReturnVisit.waitScreenForMatchingScreen(this.screen, gSleepWaitPageLong, 2, gSleepShort);
    if (!success) {
      console.log('taskReturnVisit failed');
      return;
    }
    RF.Utils.sleep(gSleepLong);
    this.screen.tap(gMainOutsideWaterFlowersBtn); // water it
    console.log('taskReturnVisit water flower success times', i);
    RF.Utils.sleep(gSleepWaitPageShort); // water flower so long

    // check exception
    var pages = this.findPages();
    if (pages.length > 0) {
      var page = pages[0];
      if (page === 'gNoStrength') {
        console.log('taskWalkAround No Strength', page, 'times', i);
        return;
      } else if (page === 'gGetGiftMusicPage') {
        gGetGiftMusicPage.goNext();
        RF.Utils.sleep(gSleepLong);
      } else if (page === 'gWarningDialog') {
        gWarningDialog.goNext(this.screen);
        RF.Utils.sleep(gSleepLong);
        continue;
      }
    }

    // might have animation
    success = gOutsidePageReturnVisit.waitScreenForMatchingScreen(this.screen, gSleepWaitPageLong, 2, gSleepShort);
    if (!success) {
      console.log('taskReturnVisit wait animation failed');
      return;
    }
    RF.Utils.sleep(gSleepLong);
  }
  this.goMainPage();
};

SD.prototype.taskJoinParty = function () {
  console.log('taskJoinParty start ...');
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainOutsideOpenBtn);
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainOutsideInvitationBtn);
  RF.Utils.sleep(gSleepLong);
  for (var i = 0; i < 1; i++) {
    var peoplePoints = [
      { x: 60, y: 574, r: 147, g: 195, b: 175 }, // color green is already joined
      { x: 130, y: 574, r: 147, g: 195, b: 175 },
      { x: 197, y: 574, r: 147, g: 195, b: 175 },
      { x: 263, y: 574, r: 147, g: 195, b: 175 },
      { x: 331, y: 576, r: 147, g: 195, b: 175 },
    ];
    var p = 0;
    for (; p < peoplePoints.length; p++) {
      var point = peoplePoints[p];
      if (this.screen.isSameColor(point)) {
        console.log('taskJoinParty already joined.', p);
        continue;
      }
      console.log('taskJoinParty join', p);
      this.screen.tap(point);
      break;
    }
    if (p >= peoplePoints.length) {
      console.log('taskJoinParty no people can join');
      return;
    }
    RF.Utils.sleep(gSleepLong);
    this.screen.tap({ x: 180, y: 550 }); // join
    RF.Utils.sleep(gSleepMedium);
    for (var c = 0; c < 6; c++) {
      this.screen.tap({ x: 35, y: 300 });
    }
    var points = [
      { x: 101, y: 303 },
      { x: 169, y: 298 },
      { x: 230, y: 302 },
      { x: 301, y: 302 },
      { x: 39, y: 378 },
      { x: 107, y: 378 },
      { x: 168, y: 378 },
      { x: 235, y: 378 },
    ];
    for (var d = 0; d < 6; d++) {
      for (var c = 0; c < points.length; c++) {
        this.screen.tap(points[c]);
      }
    }
    RF.Utils.sleep(gSleepShort);
    var isReady1 = this.screen.isSameColor({ x: 210, y: 610, r: 239, g: 155, b: 155 });
    if (!isReady1) {
      console.log('taskJoinParty item might not enough');
      return;
    }

    this.screen.tap({ x: 210, y: 610 }); // decide 1
    console.log('taskJoinParty ready item');

    RF.Utils.sleep(gSleepLong);
    RF.Utils.sleep(gSleepLong);
    var isReady2 = this.screen.isSameColor({ x: 210, y: 600, r: 239, g: 155, b: 155 });
    if (!isReady2) {
      console.log('taskJoinParty clothing might not enough');
      this.goMainPage();
      return;
    }
    this.screen.tap({ x: 210, y: 600 }); // decide 2
    console.log('taskJoinParty ready clothing');

    RF.Utils.sleep(gSleepWaitPageShort); // water flower so long
    var success = gOutsidePageWalkAround.waitScreenForMatchingScreen(this.screen, gSleepWaitPageLong, 2, gSleepShort);
    RF.Utils.sleep(gSleepWaitPageShort);
    if (success) {
      console.log('taskJoinParty success, water flower');
    }
    RF.Utils.sleep(gSleepLong);
  }
  this.goMainPage();
};

SD.prototype.taskHoldParty = function () {
  console.log('taskHoldParty start ...');
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  if (gFriendHoldingParty.isMatchScreen(this.screen)) {
    console.log('taskHoldParty already holding, skip');
    return;
  }

  this.screen.tap(gMainFriendBtn);
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainFriendHoldPartyBtn);
  RF.Utils.sleep(gSleepLong);
  var whiteSeedPoints = [
    { x: 54, y: 288, r: 255, g: 255, b: 255 },
    { x: 121, y: 289, r: 255, g: 255, b: 255 },
    { x: 185, y: 288, r: 255, g: 255, b: 255 },
    { x: 253, y: 289, r: 255, g: 255, b: 255 },
    { x: 322, y: 289, r: 255, g: 255, b: 255 },
    { x: 54, y: 369, r: 255, g: 255, b: 255 },
    { x: 117, y: 369, r: 255, g: 255, b: 255 },
    { x: 185, y: 369, r: 255, g: 255, b: 255 },
    { x: 256, y: 369, r: 255, g: 255, b: 255 },
    { x: 319, y: 369, r: 255, g: 255, b: 255 },
  ];
  var p = 0;
  for (; p < whiteSeedPoints.length; p++) {
    var seedPoint = whiteSeedPoints[p];
    if (this.screen.isSameColor(seedPoint)) {
      this.screen.tap(seedPoint);
      RF.Utils.sleep(gSleepMedium);
      if (this.screen.isSameColor({ x: 206, y: 530, r: 255, g: 255, b: 255 })) {
        break;
      } else {
        console.log('taskHoldParty seed < 3,', p);
      }
    }
  }
  if (p >= whiteSeedPoints.length) {
    console.log('taskHoldParty no seed to use');
    return;
  }
  console.log('taskHoldParty use seed', p);
  RF.Utils.sleep(gSleepLong * 2);
  this.screen.tap({ x: 180, y: 610 }); // ready to hold party
  RF.Utils.sleep(gSleepLong * 2);
  if (gFriendHoldingPartyWarning.isMatchScreen(this.screen)) {
    gFriendHoldingPartyWarning.goNext(this.screen);
    console.log('taskHoldParty already holding, return');
    return;
  }
  this.screen.tap({ x: 180, y: 540 }); // ready 1, gFriendHoldPartyContentPage1
  RF.Utils.sleep(gSleepLong * 2);
  this.screen.tap({ x: 180, y: 610 }); // next step 2, gFriendHoldPartyContentPage2
  RF.Utils.sleep(gSleepLong * 2);
  this.screen.tap({ x: 180, y: 610 }); // next step 3, gFriendHoldPartyContentPage3
  RF.Utils.sleep(gSleepLong * 2);
  this.screen.tap({ x: 180, y: 610 }); // next step 4, gFriendHoldPartyContentPage4
  RF.Utils.sleep(gSleepWaitPageMedium);
  console.log('taskHoldParty success');
  this.goMainPage();
};

SD.prototype.taskHomeFlower = function () {
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainDailyMissionBtn);
  RF.Utils.sleep(gSleepLong);
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap({ x: 180, y: 570 });
  RF.Utils.sleep(gSleepLong);

  var homeFlowerReplyGP = new RF.GroupPage('homeFlowerReply', [
    gWarningHomeFlower,
    gGetGiftPage,
    gMainPageFlowerFinishUpgrade,
  ]);

  for (var i = 0; i < 3; i++) {
    var match = homeFlowerReplyGP.waitScreenForMatchingOne(this.screen, gSleepWaitPageShort, 2, gSleepShort);
    RF.Utils.sleep(gSleepMedium);
    if (match === 'gGetGiftPage') {
      gGetGiftPage.goNext(this.screen);
    } else if (match === 'gWarningHomeFlower') {
      gWarningHomeFlower.goNext(this.screen);
    } else if (match === 'gMainPageFlowerFinishUpgrade') {
      gMainPageFlowerFinishUpgrade.goNext(this.screen);
    }
    RF.Utils.sleep(gSleepMedium);
  }
  this.goMainPage();
};

var gMissionHandlePages = new RF.GroupPage('gMissionHandlePages', [
  gGetGiftPage,
  gMissionNewDialog,
  gMissionFinishDialog1,
  gMissionFinishDialog2,
  gMissionNewSleep,
  gMissionEmptyDialog,
  gMissionPage,
  gMissionOtherHomePage,
]);

SD.prototype.handleMissionPages = function () {
  for (var t = 0; t < 6; t++) {
    var match = gMissionHandlePages.waitScreenForMatchingOne(this.screen, gSleepWaitPageShort, 2, gSleepShort);
    RF.Utils.sleep(gSleepMedium);
    if (match === 'gGetGiftPage') {
      gGetGiftPage.goNext(this.screen);
      RF.Utils.sleep(gSleepLong);
    } else if (match === 'gMissionNewDialog') {
      RF.Utils.sleep(gSleepMedium);
      gMissionNewDialog.goNext(this.screen);
      for (var c = 0; c < 5; c++) {
        this.screen.tap({ x: 210, y: 600 });
        RF.Utils.sleep(gSleepShort / 2);
      }
    } else if (match === 'gMissionFinishDialog1') {
      gMissionFinishDialog1.goNext(this.screen);
      for (var c = 0; c < 5; c++) {
        this.screen.tap({ x: 210, y: 600 });
        RF.Utils.sleep(gSleepShort / 2);
      }
      if (this.screen.isSameColor({ x: 100, y: 338, r: 239, g: 155, b: 155 })) {
        this.screen.tap({ x: 100, y: 338 });
        RF.Utils.sleep(gSleepShort / 2);
      }
    } else if (match === 'gMissionFinishDialog2') {
      gMissionFinishDialog2.goNext(this.screen);
      for (var c = 0; c < 5; c++) {
        this.screen.tap({ x: 210, y: 600 });
        RF.Utils.sleep(gSleepShort / 2);
      }
    } else if (match === 'gMissionNewSleep') {
      for (var c = 0; c < 20; c++) {
        console.log('swipe');
        this.screen.tapDown({ x: 240, y: 360 });
        this.screen.moveTo({ x: 240, y: 360 });
        this.screen.moveTo({ x: 160, y: 360 });
        this.screen.moveTo({ x: 110, y: 360 });
        this.screen.tapUp({ x: 110, y: 360 });
        RF.Utils.sleep(gSleepShort);
      }
      for (var c = 0; c < 24; c++) {
        console.log('tap');
        this.screen.tap({ x: 150, y: 340 });
      }
      for (var c = 0; c < 5; c++) {
        this.screen.tap({ x: 210, y: 600 });
        RF.Utils.sleep(gSleepShort / 2);
      }
    } else if (match === 'gMissionEmptyDialog') {
      for (var c = 0; c < 6; c++) {
        this.screen.tap({ x: 210, y: 600 });
        RF.Utils.sleep(gSleepShort / 2);
      }
      if (this.screen.isSameColor({ x: 100, y: 338, r: 239, g: 155, b: 155 })) {
        this.screen.tap({ x: 100, y: 338 });
        RF.Utils.sleep(gSleepShort / 2);
      }
    } else if (match === 'gMissionPage') {
      // done
      RF.Utils.sleep(gSleepMedium);
      break;
    } else if (match === 'gMissionOtherHomePage') {
      gMissionOtherHomePage.goNext(this.screen);
      RF.Utils.sleep(gSleepLong * 2);
      // mission done
      break;
    } else {
      this.screen.tap({ x: 210, y: 600 });
    }
    RF.Utils.sleep(gSleepMedium);
  }
};

SD.prototype.taskCookieMission = function () {
  console.log('taskCookieMission start ...');
  this.goMainPage();
  RF.Utils.sleep(gSleepLong);
  this.screen.tap(gMainDailyMissionBtn);
  RF.Utils.sleep(gSleepLong * 2);
  if (gMissionNoCookie.isMatchScreen(this.screen)) {
    console.log('taskCookieMission no cookie, skip');
    return;
  }

  for (var i = 1; i < gMissionCookieList.length; i++) {
    console.log('Try Mission', i);
    var missionCookieBtn = gMissionCookieList[i];
    this.screen.tap(missionCookieBtn);
    RF.Utils.sleep(gSleepLong);

    if (gMissionPage.isMatchScreen(this.screen)) {
      console.log('No Mission. Skip', i);
      RF.Utils.sleep(gSleepMedium);
      continue;
    }
    RF.Utils.sleep(gSleepLong * 2);

    var missionCookieRoleBtn = gMissionCookieRoleList[i];
    console.log('Talk to Role', i);
    this.screen.tap(missionCookieRoleBtn);

    RF.Utils.sleep(gSleepLong);
    this.handleMissionPages();
    RF.Utils.sleep(gSleepLong);
  }
};

// SD.prototype.taskFinishDailyMission = function () {
//   console.log('taskFinishDailyMission start ...');
//   this.goMainPage();
//   RF.Utils.sleep(gSleepLong);
//   this.screen.tap(gMainDailyMissionBtn);
//   RF.Utils.sleep(gSleepLong * 2);

//   for (var i = 0; i < gMissionOkIcons.length; i++) {
//     var missionOkIcon = gMissionOkIcons[i];
//     var isMission = this.screen.isSameColor(missionOkIcon);
//     if (!isMission) {
//       console.log('taskFinishDailyMission Mission not match', i);
//       continue;
//     }
//     console.log('taskFinishDailyMission Take mission', i);
//     this.screen.tap(missionOkIcon);
//     RF.Utils.sleep(gSleepWaitPageShort); // wait for animate

//     this.handleMissionPages();

//     RF.Utils.sleep(gSleepLong);
//   }
//   this.goMainPage();
// };

// SD.prototype.taskNewDailyMission = function () {
//   console.log('taskNewDailyMission start ...');
//   this.goMainPage();
//   RF.Utils.sleep(gSleepLong);
//   this.screen.tap(gMainDailyMissionBtn);
//   RF.Utils.sleep(gSleepLong * 2);
//   for (var i = 0; i < gMissionIcons.length; i++) {
//     var missionIcon = gMissionIcons[i];
//     var isMission = this.screen.isSameColor(missionIcon);
//     if (!isMission) {
//       console.log('taskNewDailyMission not icon', i);
//       continue;
//     }
//     console.log('taskNewDailyMission Take mission', i);
//     this.screen.tap(missionIcon);
//     RF.Utils.sleep(gSleepWaitPageShort); // wait for animate

//     this.handleMissionPages();

//     RF.Utils.sleep(gSleepLong);
//   }
//   console.log('taskNewDailyMission done');
//   this.goMainPage();
// };

SD.prototype.start = function () {
  console.log('start');
  this.taskManager.start();
};

SD.prototype.stop = function () {
  this.running = false;
  this.taskManager.stop();
};

SD.prototype.getPageByName = function (pageName) {
  for (var i = 0; i < gAllPages.length; i++) {
    if (gAllPages[i].name === pageName) {
      return gAllPages[i];
    }
  }
  return null;
};

SD.prototype.findPages = function () {
  var matches = gAllGroupPages.isMatchScreen(this.screen);
  return matches;
};

SD.prototype.goMainPage = function () {
  for (var i = 0; i < 120 && this.running; i++) {
    var pageNames = this.findPages();
    if (pageNames.length > 0) {
      var pageName = pageNames[0];
      console.log('current page', i, pageName);
      if (pageName === 'MainPage') {
        RF.Utils.sleep(gSleepLong);
        return;
      } else {
        var page = this.getPageByName(pageName);
        if (page !== null) {
          page.goNext(this.screen);
        }
      }
    } else {
      // unknown
      console.log('Unknown Page', i);
      if (gGameBackBtnPage.isMatchScreen(this.screen)) {
        console.log('GameBackBtnPage goNext');
        gGameBackBtnPage.goNext(this.screen);
      }
      // unknown too long, try to restart app
      if (i % 30 === 29) {
        console.log('Unknown > 1 min, stop App');
        this.stopApp();
        RF.Utils.sleep(gSleepLong);
      }
      // check is in app
      if (i % 10 === 0) {
        if (!this.checkIsInApp()) {
          console.log('Not in app, start app');
          this.startApp();
        } else {
          this.screen.tap(1, 1, 100);
          console.log('keycode BACK');
          keycode('BACK', 100);
        }
      }
    }
    RF.Utils.sleep(gSleepMedium);
  }
};

SD.prototype.checkIsInApp = function () {
  // jp.cocone.sweetdays/.ui.AppActivity ['jp.cocone.sweetdays', '.ui.AppActivity']
  var result = RF.Utils.getCurrentApp();
  if (result[0] === 'jp.cocone.sweetdays') {
    return true;
  }
  return false;
};

SD.prototype.startApp = function () {
  RF.Utils.startApp('jp.cocone.sweetdays/.ui.AppActivity');
};

SD.prototype.stopApp = function () {
  RF.Utils.stopApp('jp.cocone.sweetdays');
};

SD.prototype.isFruit = function () {
  var match = 0;
  var img = this.screen.getCvtDevScreenshot();
  for (var y = 300; y < 420; y++) {
    var rgb = getImageColor(img, 220, y);
    var score = RF.Colors.identityColor(rgb, { r: 229, g: 106, b: 121 });
    if (score > 0.95) {
      match++;
      // console.log(y, score);
    }
  }
  releaseImage(img);
  if (match > 1) {
    console.log('NotFruit');
    return false;
  }
  console.log('isFruit');
  return true;
};

var sd = null;

function start(jsonConfig) {
  var config = defaultConfig;
  if (typeof jsonConfig === 'string') {
    config = JSON.parse(jsonConfig);
  } else if (typeof jsonConfig === 'object') {
    config = jsonConfig;
  }

  sd = new SD(config);
  sd.init();
  sd.start();
  // sd.isFruit();
  // console.log(sd.findPages());
  // sd.goMainPage();
  // sd.taskHomeFlower();
}

function stop() {
  if (sd !== null) {
    sd.stop();
  }
}
