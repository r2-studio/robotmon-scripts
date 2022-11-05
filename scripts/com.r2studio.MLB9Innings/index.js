/* prettier-ignore */ !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.RF=t():e.RF=t()}(this,(function(){return function(){"use strict";var e={607:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,n(r(850),t),n(r(985),t),n(r(837),t),n(r(459),t),n(r(231),t),n(r(200),t),n(r(656),t),n(r(708),t),n(r(974),t),t.version=1},850:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.GroupPage=void 0;var r=function(){function e(e,t){this.name=e,this.pages=t}return e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=[],o=0,n=this.pages;o<n.length;o++){var i=n[o];i.isMatchImage(e,t)&&r.push(i.name)}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingOne=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": "+this.pages.map((function(e){return e.name})).join(","));for(var s=Date.now(),a="",c=0;Date.now()-s<r;){for(var f=t.getCvtDevScreenshot(),m=0,h=this.pages;m<h.length;m++){var g=h[m];if(g.isMatchImage(f,i)){a!==g.name&&(a=g.name,c=0),c++;break}}if(releaseImage(f),""!==a&&c>=o)break;sleep(n)}return e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": matched: "+a+", usedTime "+(Date.now()-s)),a},e.debug=!1,e}();t.GroupPage=r},985:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Page=void 0;var o=r(656),n=function(){function e(e,t,r,o){void 0===r&&(r=void 0),void 0===o&&(o=void 0),this.name=e,this.points=t,this.next=r,this.back=o}return e.prototype.goNext=function(t){void 0!==this.next?t.tap(this.next):e.debug&&console.log("Warning Page: "+this.name+" has no next xy")},e.prototype.goBack=function(t){void 0!==this.back?t.tap(this.back):e.debug&&console.log("Warning Page: "+this.name+" has no back xy")},e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=!0,n=0,i=this.points;n<i.length;n++){var s=i[n],a=getImageColor(e,s.x,s.y);if(o.Colors.identityColor(s,a)<t){r=!1;break}}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingScreen=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name);for(var s=Date.now(),a=0;Date.now()-s<r&&(this.isMatchScreen(t,i)&&a++,!(a>=o));)sleep(n);return a>=o?(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" success, usedTime "+(Date.now()-s)),!0):(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" timeout"),!1)},e.debug=!1,e}();t.Page=n},837:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.XYRGB=void 0;t.XYRGB=function(){this.x=0,this.y=0,this.r=0,this.g=0,this.b=0}},459:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;var o=r(656),n=function(){function e(e){this.config=e;var t=getScreenSize();this.config.deviceHeight=t.height,this.config.deviceWidth=t.width,this.config.screenWidth=t.width,this.config.screenHeight=t.height,this.config.screenOffsetX=0,this.config.screenOffsetY=0}return e.prototype.calculateDeviceOffset=function(e){var t=e(this);this.config.screenWidth=t.screenWidth,this.config.screenHeight=t.screenHeight,this.config.screenOffsetX=t.screenOffsetX,this.config.screenOffsetY=t.screenOffsetY},e.prototype.getScreenX=function(e){return Math.floor(this.config.screenOffsetX+e*this.config.screenWidth/this.config.devWidth)||0},e.prototype.getScreenY=function(e){return Math.floor(this.config.screenOffsetY+e*this.config.screenHeight/this.config.devHeight)||0},e.prototype.getScreenXY=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e)return{x:this.getScreenX(e.x),y:this.getScreenY(e.y)};if("number"==typeof e&&"number"==typeof t)return{x:this.getScreenX(e),y:this.getScreenY(t)};throw new Error("getScreenXY wrong params "+e+", "+t)},e.prototype.tap=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tap(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tap(r,o,this.config.actionDuring)}},e.prototype.tapDown=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapDown(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapDown(r,o,this.config.actionDuring)}},e.prototype.moveTo=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);moveTo(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),moveTo(r,o,this.config.actionDuring)}},e.prototype.tapUp=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapUp(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapUp(r,o,this.config.actionDuring)}},e.prototype.getScreenColor=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getCvtDevScreenshot(),o=getImageColor(r,e.x,e.y);return releaseImage(r),o}if("number"==typeof e&&"number"==typeof t)return r=this.getCvtDevScreenshot(),o=getImageColor(r,e,t),releaseImage(r),o;throw new Error("tapDown wrong params "+e+", "+t)},e.prototype.findImage=function(e){var t=this.getCvtDevScreenshot(),r=findImage(t,e);return releaseImage(t),r},e.prototype.tapImage=function(e){var t=this.findImage(e);this.tap(t)},e.prototype.isSameColor=function(e,t){void 0===t&&(t=.9);var r=this.getScreenColor(e);return o.Colors.identityColor(r,e)>t},e.prototype.getDeviceScreenshot=function(){return getScreenshot()},e.prototype.getScreenScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.screenWidth,this.config.screenHeight,100)},e.prototype.getCvtDevScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.devWidth,this.config.devHeight,100)},e.prototype.setActionDuring=function(e){this.config.actionDuring=e},e.debug=!1,e}();t.Screen=n},231:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenConfig=void 0;t.ScreenConfig=function(){this.devWidth=640,this.devHeight=360,this.deviceWidth=0,this.deviceHeight=0,this.screenWidth=0,this.screenHeight=0,this.screenOffsetX=0,this.screenOffsetY=0,this.actionDuring=180}},200:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.TaskManager=t.Task=void 0;var o=r(974),n=function(){this.name="",this.runTimes=1,this.maxRunningDuring=0,this.minIntervalDuring=0,this.lastRunDoneTime=0,this.run=function(){}};t.Task=n;var i=function(){function e(){this.isRunning=!1,this.runIdx=0,this.tasks=[]}return e.prototype.addTask=function(e,t,r,o,i){void 0===r&&(r=1),void 0===o&&(o=0),void 0===i&&(i=0);var s=new n;s.name=e,s.run=t,s.runTimes=r,s.maxRunningDuring=o,s.minIntervalDuring=i,this.tasks.push(s)},e.prototype.start=function(){if(0===this.tasks.length)throw new Error("TaskManager: No tasks to run");for(console.log("TaskManager start"),this.isRunning=!0;this.isRunning;){var e=Date.now(),t=this.tasks[this.runIdx%this.tasks.length];if(this.runIdx++,!(e-t.lastRunDoneTime<t.minIntervalDuring)){console.log("RunTask "+this.runIdx+" "+t.name+", times "+t.runTimes+", maxDuring "+t.maxRunningDuring);for(var r=0;this.isRunning&&(console.log("TaskRunning "+t.name+", times "+r+"/"+t.runTimes),t.run(),t.lastRunDoneTime=Date.now(),r++,!(0!==t.runTimes&&r>=t.runTimes))&&!(Date.now()-e>t.maxRunningDuring);)sleep(100)}}},e.prototype.stop=function(){this.isRunning=!1,o.Utils.sleep(1e3),console.log("TaskManager stop")},e}();t.TaskManager=i},656:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Colors=void 0;var r=function(){function e(){}return e.getRangeColor=function(e,t,r,o,n){void 0===n&&(n=5);var i=!1;void 0===e&&(i=!0,e=getScreenshot());for(var s=getImageSize(e),a=Math.max(0,t-o),c=Math.max(0,r-o),f=Math.min(s.width,t+o),m=Math.min(s.height,r+o),h=Math.max(1,(f-a)/n),g=Math.max(1,(m-c)/n),u=0,p={r:0,g:0,b:0},y=a;y<f;y+=h)for(var v=c;v<m;v+=g){var l=getImageColor(e,Math.floor(y),Math.floor(v));p.r+=l.r,p.g+=l.g,p.b+=l.b,u++}return i&&releaseImage(e),{r:Math.floor(p.r/u),g:Math.floor(p.g/u),b:Math.floor(p.b/u)}},e.color2hex=function(e){return((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},e.hex2Color=function(e){return{r:parseInt(e[0]+e[1],16),g:parseInt(e[2]+e[3],16),b:parseInt(e[4]+e[5],16)}},e.identityColor=function(e,t){var r=(e.r+t.r)/2,o=e.r-t.r,n=e.g-t.g,i=e.b-t.b;return 1-Math.sqrt(((512+r)*o*o>>8)+4*n*n+((767-r)*i*i>>8))/768},e}();t.Colors=r},708:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.OCR=void 0;var r=function(){function e(e){this.words=e}return e.prototype.recognize=function(e,t,r,o){void 0===o&&(o=.8);for(var n=0,i=[],s=0;s<this.words.length;s++){var a=this.words[s],c=getImageSize(a.img);n=Math.max(n,c.width);var f=findImages(e,a.img,r,t,!0);for(var m in f){var h=f[m];i.push({char:a.char,x:h.x,y:h.y,score:h.score,w:c.width})}}i.sort((function(e,t){return e.x-t.x}));for(var g="",u=0,p=0,y=0;y<i.length;y++){var v=i[y];v.x>u?(p=v.score,g+=v.char,u=Math.floor(v.x+v.w*o)):v.x<=u&&v.score>p&&" "!==v.char&&(p=v.score,g=g.substr(0,g.length-1)+v.char,u=Math.floor(v.x+v.w*o))}return g},e}();t.OCR=r},974:function(e,t){var r=this&&this.__spreadArray||function(e,t){for(var r=0,o=t.length,n=e.length;r<o;r++,n++)e[n]=t[r];return e};Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.log=void 0,t.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=(new Date).toLocaleString("en-US",{timeZone:"Asia/Taipei"}),o="["+r+"] ",n=0,i=e;n<i.length;n++){var s=i[n];o+="object"==typeof s?JSON.stringify(s)+" ":s+" "}console.log(o.substr(0,o.length-1))};var o=function(){function e(){}return e.sortStringNumberMap=function(e){var t=[];for(var r in e)t.push({key:r,count:e[r]});return t.sort((function(e,t){return t.count-e.count})),t},e.sleep=function(e){for(;e>200;)e-=200,sleep(200);e>0&&sleep(e)},e.getTaiwanTime=function(){return Date.now()+288e5},e.log=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var n=0;n<t.length;n++){var i=t[n];"object"==typeof i&&(t[n]=JSON.stringify(i))}var s=new Date(e.getTaiwanTime()),a="["+(s.getMonth()+1)+"-"+s.getDate()+"T"+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+"]";console.log.apply(console,r([a],t))},e.notifyEvent=function(t,r){null!=sendEvent&&(e.log("sendEvent",t,r),sendEvent(""+t,""+r))},e.startApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n "+e)},e.stopApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop "+e)},e.getCurrentApp=function(){for(var e="",t="",r=0,o=execute("dumpsys activity top").split("\n");r<o.length;r++){var n=o[r],i=n.indexOf("ACTIVITY");if(-1!==i){e="",t="";for(var s=!0,a=i+9;a<n.length;a++){var c=n[a];if(" "===c)break;"/"===c?s=!1:s?e+=c:t+=c}}}return[e,t]},e}();t.Utils=o}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(607)}()}));

var gScriptVersion = 7;
var gLeagueYearLatest = 2022;

var gSleepShort = 2000;
var gSleepMedium = 3000;
var gSleepLong = 4000;
var gSleepWaitPageShort = 12 * 1000;
var gSleepWaitPageMedium = 24 * 1000;
var gSleepWaitPageLong = 36 * 1000;

var defaultConfig = {
  isXr: true, // hidden setting
  isDev: true, // hidden, only for debug
  leagueSeasonMode: "full", // half, quarter, postSeason
  leagueYear: gLeagueYearLatest, // number
};

var gDownloadDataPage = new RF.Page(
  "gDownloadDataPage",
  [
    { x: 123, y: 57, r: 181, g: 186, b: 189 },
    { x: 168, y: 58, r: 16, g: 24, b: 24 },
    { x: 189, y: 58, r: 16, g: 24, b: 24 },
    { x: 237, y: 60, r: 134, g: 138, b: 142 },
    { x: 260, y: 62, r: 16, g: 24, b: 24 },
    { x: 272, y: 62, r: 52, g: 58, b: 60 },
    { x: 278, y: 59, r: 111, g: 117, b: 119 },
    { x: 289, y: 59, r: 163, g: 168, b: 171 },
    { x: 303, y: 59, r: 169, g: 176, b: 178 },
    { x: 362, y: 60, r: 90, g: 96, b: 102 },
    { x: 514, y: 46, r: 136, g: 138, b: 143 },
    { x: 518, y: 50, r: 137, g: 139, b: 143 },
    { x: 521, y: 44, r: 182, g: 183, b: 189 },
    { x: 342, y: 138, r: 86, g: 96, b: 101 },
    { x: 192, y: 159, r: 107, g: 157, b: 204 },
    { x: 330, y: 161, r: 145, g: 172, b: 199 },
    { x: 363, y: 181, r: 28, g: 125, b: 226 },
    { x: 193, y: 235, r: 181, g: 186, b: 189 },
    { x: 283, y: 300, r: 49, g: 85, b: 123 },
    { x: 256, y: 301, r: 144, g: 168, b: 202 },
    { x: 353, y: 305, r: 0, g: 105, b: 247 },
    { x: 384, y: 307, r: 219, g: 229, b: 252 },
    { x: 491, y: 302, r: 222, g: 219, b: 222 },
  ],
  { x: 421, y: 293 },
  { x: 421, y: 293 }
);

var gMainPage = new RF.Page(
  "gMainPage",
  [
    { x: 289, y: 11, r: 214, g: 215, b: 214 },
    { x: 315, y: 11, r: 222, g: 223, b: 222 },
    { x: 380, y: 7, r: 207, g: 210, b: 210 },
    { x: 390, y: 12, r: 130, g: 128, b: 130 },
    { x: 481, y: 7, r: 74, g: 85, b: 90 },
    { x: 493, y: 11, r: 252, g: 209, b: 38 },
    { x: 622, y: 9, r: 214, g: 211, b: 214 },
    { x: 41, y: 324, r: 110, g: 112, b: 102 },
    { x: 58, y: 341, r: 41, g: 52, b: 33 },
    { x: 86, y: 323, r: 255, g: 255, b: 255 },
    { x: 103, y: 340, r: 208, g: 211, b: 208 },
    { x: 187, y: 325, r: 255, g: 255, b: 255 },
    { x: 211, y: 341, r: 57, g: 65, b: 49 },
    { x: 241, y: 323, r: 123, g: 132, b: 122 },
    { x: 326, y: 331, r: 57, g: 71, b: 49 },
    { x: 520, y: 323, r: 131, g: 46, b: 44 },
    { x: 530, y: 350, r: 57, g: 65, b: 49 },
    { x: 587, y: 325, r: 255, g: 255, b: 255 },
    { x: 627, y: 341, r: 49, g: 65, b: 41 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gMainPageBtns = {
  leagueMode: { x: 204, y: 154 },
  battleMode: { x: 350, y: 145 },
  specialMode: { x: 438, y: 145 },
  clubMode: { x: 556, y: 145 },
  settings: { x: 243, y: 323 },
};

var gSettingsPage = new RF.Page(
  "gSettingsPage",
  [
    { x: 22, y: 92, r: 231, g: 235, b: 239 },
    { x: 20, y: 178, r: 206, g: 211, b: 222 },
    { x: 19, y: 290, r: 206, g: 211, b: 222 },
    { x: 457, y: 292, r: 206, g: 211, b: 222 },
    { x: 457, y: 90, r: 231, g: 235, b: 239 },
    { x: 480, y: 86, r: 33, g: 44, b: 49 },
    { x: 485, y: 287, r: 41, g: 44, b: 49 },
    { x: 498, y: 108, r: 56, g: 85, b: 117 },
    { x: 501, y: 169, r: 16, g: 118, b: 255 },
    { x: 499, y: 158, r: 32, g: 46, b: 54 },
    { x: 504, y: 217, r: 160, g: 159, b: 164 },
    { x: 499, y: 274, r: 74, g: 121, b: 181 },
    { x: 25, y: 313, r: 214, g: 218, b: 214 },
    { x: 41, y: 321, r: 110, g: 120, b: 110 },
    { x: 30, y: 330, r: 214, g: 219, b: 214 },
    { x: 295, y: 9, r: 214, g: 211, b: 214 },
    { x: 314, y: 8, r: 247, g: 243, b: 247 },
    { x: 388, y: 7, r: 232, g: 233, b: 232 },
    { x: 474, y: 16, r: 74, g: 81, b: 90 },
    { x: 492, y: 12, r: 59, g: 50, b: 43 },
    { x: 623, y: 12, r: 214, g: 211, b: 214 },
  ],
  { x: 41, y: 320 },
  { x: 41, y: 320 }
);
var gSettingsPageBtns = {
  graphicTab: { x: 152, y: 62 },
  graphicTabPowerSaveOn: { x: 222, y: 222 },
};

var gBackBtnPage = new RF.Page(
  "gBackBtnPage",
  [
    { x: 24, y: 314, r: 214, g: 219, b: 214 },
    { x: 28, y: 310, r: 192, g: 199, b: 190 },
    { x: 41, y: 316, r: 222, g: 219, b: 214 },
    { x: 35, y: 329, r: 211, g: 216, b: 210 },
    { x: 29, y: 332, r: 214, g: 219, b: 214 },
  ],
  { x: 41, y: 320 },
  { x: 41, y: 320 }
);

// tell user the season start
var gNewSeasonPage = new RF.Page(
  "gNewSeasonPage",
  [
    { x: 153, y: 21, r: 0, g: 89, b: 165 },
    { x: 294, y: 50, r: 154, g: 182, b: 203 },
    { x: 316, y: 58, r: 226, g: 234, b: 240 },
    { x: 443, y: 55, r: 0, g: 65, b: 117 },
    { x: 425, y: 55, r: 255, g: 255, b: 255 },
    { x: 537, y: 13, r: 0, g: 93, b: 181 },
    { x: 272, y: 301, r: 0, g: 113, b: 247 },
    { x: 311, y: 302, r: 101, g: 158, b: 235 },
    { x: 324, y: 296, r: 252, g: 253, b: 255 },
    { x: 367, y: 305, r: 8, g: 109, b: 254 },
  ],
  { x: 292, y: 297 },
  { x: 292, y: 297 }
);

var gEndSeasonPage = new RF.Page(
  "gSeasonEndPage",
  [
    { x: 164, y: 13, r: 0, g: 93, b: 181 },
    { x: 131, y: 39, r: 32, g: 104, b: 165 },
    { x: 170, y: 35, r: 255, g: 255, b: 255 },
    { x: 249, y: 38, r: 18, g: 94, b: 157 },
    { x: 326, y: 41, r: 26, g: 99, b: 158 },
    { x: 489, y: 38, r: 48, g: 113, b: 166 },
    { x: 601, y: 18, r: 0, g: 93, b: 173 },
    { x: 622, y: 70, r: 2, g: 57, b: 105 },
    { x: 621, y: 112, r: 0, g: 31, b: 49 },
    { x: 56, y: 343, r: 8, g: 12, b: 8 },
    { x: 315, y: 148, r: 0, g: 16, b: 16 },
  ],
  { x: 567, y: 335 },
  { x: 567, y: 335 }
);

var gSelectSeasonModePage = new RF.Page(
  "gSelectSeasonModePage",
  [
    { x: 104, y: 16, r: 0, g: 93, b: 173 },
    { x: 235, y: 37, r: 143, g: 181, b: 207 },
    { x: 309, y: 36, r: 145, g: 182, b: 209 },
    { x: 337, y: 38, r: 103, g: 149, b: 191 },
    { x: 376, y: 32, r: 245, g: 247, b: 253 },
    { x: 422, y: 36, r: 145, g: 177, b: 209 },
    { x: 40, y: 75, r: 181, g: 186, b: 189 },
    { x: 314, y: 183, r: 33, g: 36, b: 33 },
    { x: 341, y: 93, r: 41, g: 48, b: 49 },
    { x: 539, y: 323, r: 0, g: 69, b: 149 },
    { x: 553, y: 328, r: 0, g: 65, b: 148 },
  ],
  { x: 178, y: 183 },
  { x: 178, y: 183 }
);

var gSelectLeagueGameAmountPage = new RF.Page(
  "gSelectLeagueGameAmountPage",
  [
    { x: 625, y: 8, r: 206, g: 215, b: 222 },
    { x: 603, y: 15, r: 66, g: 93, b: 123 },
    { x: 597, y: 14, r: 66, g: 93, b: 123 },
    { x: 494, y: 11, r: 249, g: 194, b: 26 },
    { x: 391, y: 11, r: 79, g: 80, b: 79 },
    { x: 313, y: 10, r: 229, g: 229, b: 229 },
    { x: 162, y: 58, r: 5, g: 68, b: 122 },
    { x: 187, y: 60, r: 21, g: 77, b: 128 },
    { x: 25, y: 87, r: 231, g: 231, b: 239 },
    { x: 191, y: 88, r: 231, g: 231, b: 239 },
    { x: 346, y: 88, r: 231, g: 231, b: 239 },
    { x: 492, y: 91, r: 231, g: 231, b: 239 },
    { x: 610, y: 286, r: 41, g: 52, b: 57 },
    { x: 449, y: 279, r: 41, g: 52, b: 57 },
    { x: 298, y: 282, r: 41, g: 52, b: 57 },
    { x: 141, y: 284, r: 41, g: 52, b: 57 },
  ],
  { x: 39, y: 314 },
  { x: 39, y: 314 }
);
var gSelectLeagueGameAmountPageBtns = {
  full: { x: 25, y: 285 },
  half: { x: 245, y: 285 },
  quarter: { x: 400, y: 112 },
  post: { x: 600, y: 112 },
};

var gSelectYearPage = new RF.Page(
  "gSelectYearPage",
  [
    { x: 274, y: 63, r: 16, g: 24, b: 24 },
    { x: 330, y: 58, r: 61, g: 69, b: 72 },
    { x: 358, y: 62, r: 30, g: 37, b: 42 },
    { x: 211, y: 105, r: 8, g: 121, b: 255 },
    { x: 217, y: 302, r: 41, g: 73, b: 123 },
    { x: 262, y: 302, r: 82, g: 109, b: 154 },
    { x: 337, y: 300, r: 126, g: 182, b: 253 },
    { x: 393, y: 299, r: 246, g: 249, b: 253 },
    { x: 465, y: 223, r: 181, g: 186, b: 189 },
    { x: 518, y: 52, r: 171, g: 173, b: 173 },
    { x: 482, y: 311, r: 222, g: 219, b: 222 },
    { x: 144, y: 308, r: 222, g: 219, b: 222 },
  ],
  { x: 392, y: 302 },
  { x: 520, y: 49 }
);

var gSelectYearPageBtns = {
  prevYear: { x: 0, y: 0 },
  nextYear: { x: 0, y: 0 },
  submit: { x: 285, y: 303 },
};

var gLeagueModePanelPageContinue = new RF.Page(
  "gLeagueModePanelPageContinue",
  [
    { x: 627, y: 5, r: 214, g: 211, b: 214 },
    { x: 25, y: 314, r: 214, g: 219, b: 214 },
    { x: 41, y: 323, r: 67, g: 71, b: 60 },
    { x: 86, y: 323, r: 69, g: 94, b: 127 },
    { x: 127, y: 320, r: 168, g: 194, b: 221 },
    { x: 206, y: 323, r: 115, g: 144, b: 174 },
    { x: 294, y: 320, r: 206, g: 225, b: 242 },
    { x: 372, y: 324, r: 24, g: 69, b: 132 },
    { x: 518, y: 318, r: 231, g: 147, b: 1 },
    { x: 548, y: 317, r: 255, g: 255, b: 255 },
    { x: 581, y: 333, r: 74, g: 36, b: 0 },
  ],
  { x: 616, y: 336 },
  { x: 41, y: 320 }
);

var gLeagueModePanelPageNextSchedule = new RF.Page(
  "gLeagueModePanelPageNextSchedule",
  [
    { x: 313, y: 10, r: 229, g: 229, b: 229 },
    { x: 321, y: 7, r: 165, g: 169, b: 173 },
    { x: 389, y: 9, r: 250, g: 248, b: 250 },
    { x: 495, y: 11, r: 253, g: 203, b: 18 },
    { x: 631, y: 11, r: 214, g: 211, b: 214 },
    { x: 41, y: 322, r: 62, g: 77, b: 62 },
    { x: 91, y: 324, r: 24, g: 69, b: 132 },
    { x: 173, y: 324, r: 93, g: 112, b: 140 },
    { x: 254, y: 327, r: 255, g: 255, b: 255 },
    { x: 351, y: 329, r: 24, g: 63, b: 109 },
    { x: 533, y: 335, r: 181, g: 150, b: 0 },
    { x: 459, y: 334, r: 48, g: 56, b: 33 },
  ],
  { x: 616, y: 336 },
  { x: 41, y: 320 }
);

var gLeagueModePanelPageNextSchedule2 = new RF.Page(
  "gLeagueModePanelPageNextSchedule",
  [
    { x: 199, y: 215, r: 0, g: 0, b: 0 },
    { x: 299, y: 9, r: 214, g: 215, b: 214 },
    { x: 312, y: 7, r: 255, g: 251, b: 255 },
    { x: 371, y: 12, r: 57, g: 97, b: 132 },
    { x: 387, y: 8, r: 221, g: 221, b: 221 },
    { x: 390, y: 10, r: 143, g: 141, b: 143 },
    { x: 393, y: 11, r: 67, g: 70, b: 67 },
    { x: 470, y: 12, r: 177, g: 191, b: 202 },
    { x: 476, y: 12, r: 177, g: 191, b: 202 },
    { x: 493, y: 9, r: 255, g: 246, b: 192 },
    { x: 496, y: 13, r: 245, g: 166, b: 8 },
    { x: 568, y: 13, r: 117, g: 124, b: 134 },
    { x: 573, y: 15, r: 74, g: 81, b: 90 },
    { x: 580, y: 18, r: 214, g: 211, b: 214 },
    { x: 597, y: 13, r: 74, g: 93, b: 123 },
    { x: 603, y: 15, r: 74, g: 93, b: 123 },
    { x: 622, y: 14, r: 214, g: 215, b: 214 },
    { x: 621, y: 29, r: 0, g: 56, b: 90 },
    { x: 600, y: 30, r: 246, g: 242, b: 246 },
    { x: 600, y: 30, r: 246, g: 242, b: 246 },
    { x: 27, y: 315, r: 214, g: 219, b: 214 },
    { x: 45, y: 319, r: 215, g: 219, b: 214 },
    { x: 37, y: 330, r: 214, g: 219, b: 214 },
    { x: 71, y: 316, r: 24, g: 77, b: 141 },
    { x: 80, y: 320, r: 144, g: 162, b: 185 },
    { x: 108, y: 320, r: 194, g: 214, b: 233 },
    { x: 174, y: 315, r: 24, g: 77, b: 148 },
    { x: 173, y: 320, r: 168, g: 181, b: 198 },
    { x: 206, y: 321, r: 214, g: 231, b: 244 },
    { x: 245, y: 320, r: 24, g: 73, b: 140 },
    { x: 251, y: 321, r: 181, g: 195, b: 214 },
    { x: 286, y: 323, r: 94, g: 133, b: 172 },
    { x: 315, y: 328, r: 24, g: 65, b: 116 },
    { x: 337, y: 324, r: 177, g: 193, b: 207 },
    { x: 376, y: 320, r: 185, g: 207, b: 227 },
    { x: 402, y: 330, r: 21, g: 62, b: 112 },
    { x: 611, y: 327, r: 194, g: 173, b: 87 },
    { x: 599, y: 326, r: 255, g: 255, b: 254 },
    { x: 561, y: 326, r: 255, g: 255, b: 255 },
    { x: 506, y: 324, r: 240, g: 230, b: 196 },
  ],
  { x: 616, y: 336 },
  { x: 41, y: 320 }
);

var gLeagueNewGamePage = new RF.Page(
  "gLeagueNewGamePage",
  [
    { x: 292, y: 9, r: 214, g: 213, b: 214 },
    { x: 314, y: 7, r: 255, g: 251, b: 255 },
    { x: 379, y: 3, r: 214, g: 215, b: 214 },
    { x: 389, y: 10, r: 239, g: 236, b: 239 },
    { x: 482, y: 3, r: 214, g: 218, b: 220 },
    { x: 493, y: 9, r: 255, g: 246, b: 192 },
    { x: 589, y: 11, r: 74, g: 93, b: 123 },
    { x: 596, y: 11, r: 81, g: 104, b: 131 },
    { x: 624, y: 12, r: 214, g: 211, b: 214 },
    { x: 26, y: 312, r: 209, g: 214, b: 209 },
    { x: 631, y: 56, r: 206, g: 207, b: 214 },
    { x: 631, y: 70, r: 168, g: 177, b: 193 },
    { x: 623, y: 64, r: 33, g: 125, b: 255 },
    { x: 270, y: 179, r: 206, g: 211, b: 222 },
    { x: 256, y: 214, r: 206, g: 211, b: 222 },
    { x: 242, y: 242, r: 206, g: 211, b: 222 },
    { x: 612, y: 281, r: 24, g: 36, b: 49 },
  ],
  { x: 546, y: 325 }, // playBall
  { x: 41, y: 320 }
);
var gLeagueNewGamePageQuickPlayOn = new RF.Page(
  "gLeagueNewGamePageOnQuickPlayOn",
  [
    { x: 292, y: 9, r: 214, g: 213, b: 214 },
    { x: 314, y: 7, r: 255, g: 251, b: 255 },
    { x: 379, y: 3, r: 214, g: 215, b: 214 },
    { x: 389, y: 10, r: 239, g: 236, b: 239 },
    { x: 482, y: 3, r: 214, g: 218, b: 220 },
    { x: 493, y: 9, r: 255, g: 246, b: 192 },
    { x: 589, y: 11, r: 74, g: 93, b: 123 },
    { x: 596, y: 11, r: 81, g: 104, b: 131 },
    { x: 624, y: 12, r: 214, g: 211, b: 214 },
    { x: 26, y: 312, r: 209, g: 214, b: 209 },
    { x: 631, y: 56, r: 206, g: 207, b: 214 },
    { x: 631, y: 70, r: 168, g: 177, b: 193 },
    { x: 623, y: 64, r: 33, g: 125, b: 255 },
    { x: 270, y: 179, r: 206, g: 211, b: 222 },
    { x: 256, y: 214, r: 206, g: 211, b: 222 },
    { x: 242, y: 242, r: 206, g: 211, b: 222 },
    { x: 612, y: 281, r: 24, g: 36, b: 49 },

    { x: 39, y: 285, r: 33, g: 255, b: 140 }, // green check
  ],
  { x: 100, y: 281 }, // quick play off
  { x: 41, y: 320 }
);

var gLeagueNewGamePageQuickPlayOff = new RF.Page(
  "gLeagueNewGamePageOnQuickPlayOff",
  [
    { x: 292, y: 9, r: 214, g: 213, b: 214 },
    { x: 314, y: 7, r: 255, g: 251, b: 255 },
    { x: 379, y: 3, r: 214, g: 215, b: 214 },
    { x: 389, y: 10, r: 239, g: 236, b: 239 },
    { x: 482, y: 3, r: 214, g: 218, b: 220 },
    { x: 493, y: 9, r: 255, g: 246, b: 192 },
    { x: 589, y: 11, r: 74, g: 93, b: 123 },
    { x: 596, y: 11, r: 81, g: 104, b: 131 },
    { x: 624, y: 12, r: 214, g: 211, b: 214 },
    { x: 26, y: 312, r: 209, g: 214, b: 209 },
    { x: 631, y: 56, r: 206, g: 207, b: 214 },
    { x: 631, y: 70, r: 168, g: 177, b: 193 },
    { x: 623, y: 64, r: 33, g: 125, b: 255 },
    { x: 270, y: 179, r: 206, g: 211, b: 222 },
    { x: 256, y: 214, r: 206, g: 211, b: 222 },
    { x: 242, y: 242, r: 206, g: 211, b: 222 },
    { x: 612, y: 281, r: 24, g: 36, b: 49 },

    { x: 39, y: 284, r: 16, g: 36, b: 57 }, // grey check
  ],
  { x: 100, y: 281 }, // quick play
  { x: 41, y: 320 }
);

// normal game play start
var gLeagueNewGamePageSelectPlayRole = new RF.Page(
  "gLeagueNewGamePageSelectPlayRole",
  [
    { x: 174, y: 110, r: 27, g: 32, b: 35 },
    { x: 478, y: 108, r: 33, g: 32, b: 33 },
    { x: 107, y: 285, r: 253, g: 252, b: 253 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);
var gLeagueNewGamePageSelectPlayRoleBtns = {
  playOffenseOnly: { x: 128, y: 279 },
  playAll: { x: 317, y: 282 },
  playDeffenseOnly: { x: 506, y: 281 },
};

// sometimes happened when restarting a continued game
var gLeagueContinuePlayingPage = new RF.Page(
  "gLeagueContinuePlayingPage",
  [
    { x: 457, y: 276, r: 8, g: 118, b: 255 },
    { x: 494, y: 277, r: 175, g: 206, b: 254 },
    { x: 556, y: 277, r: 255, g: 255, b: 255 },
    { x: 467, y: 322, r: 1, g: 105, b: 247 },
    { x: 514, y: 320, r: 244, g: 248, b: 255 },
    { x: 589, y: 320, r: 8, g: 109, b: 255 },
    { x: 200, y: 6, r: 24, g: 32, b: 49 },
    { x: 504, y: 8, r: 24, g: 32, b: 49 },
    { x: 503, y: 25, r: 8, g: 16, b: 33 },
    { x: 502, y: 39, r: 28, g: 38, b: 49 },
  ],
  { x: 525, y: 321 },
  { x: 525, y: 321 }
);

var gLeagueOnPlayPageAutoOff = new RF.Page(
  "gLeagueOnPlayPageAutoOff",
  [
    { x: 14, y: 10, r: 255, g: 255, b: 255 },
    { x: 25, y: 47, r: 255, g: 255, b: 255 },
    { x: 147, y: 11, r: 0, g: 12, b: 24 },
    { x: 562, y: 20, r: 213, g: 214, b: 213 },
    { x: 565, y: 22, r: 205, g: 203, b: 205 },
  ],
  { x: 511, y: 20 }, // switch to auto mode
  { x: 511, y: 20 }
);

var gLeagueOnPlayPageAutoOff = new RF.Page(
  "gLeagueOnPlayPageAutoOff",
  [
    { x: 14, y: 10, r: 255, g: 255, b: 255 },
    { x: 25, y: 47, r: 255, g: 255, b: 255 },
    { x: 147, y: 11, r: 0, g: 12, b: 24 },
    { x: 562, y: 20, r: 213, g: 214, b: 213 },
    { x: 565, y: 22, r: 205, g: 203, b: 205 },
  ],
  { x: 511, y: 20 }, // switch to auto mode
  { x: 511, y: 20 }
);

// auto play on, power save off
var gLeagueOnPlayPagePowerSaveOff = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOff",
  [
    { x: 484, y: 14, r: 255, g: 255, b: 255 },
    { x: 488, y: 22, r: 222, g: 218, b: 222 },
    { x: 484, y: 29, r: 187, g: 192, b: 195 },
    { x: 493, y: 29, r: 174, g: 179, b: 182 },
    { x: 16, y: 8, r: 255, g: 255, b: 255 },
    { x: 206, y: 11, r: 21, g: 20, b: 21 },
  ],
  { x: 485, y: 21 }, // turn on power save
  { x: 485, y: 21 }
);

var gLeagueOnPlayPagePowerSaveOn = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOn",
  [
    { x: 298, y: 136, r: 156, g: 160, b: 165 },
    { x: 36, y: 26, r: 0, g: 0, b: 0 },
    { x: 36, y: 326, r: 0, g: 0, b: 0 },
    { x: 613, y: 330, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    { x: 602, y: 27, r: 0, g: 0, b: 0 },
    { x: 174, y: 162, r: 0, g: 0, b: 0 },
    { x: 476, y: 158, r: 0, g: 0, b: 0 },
    { x: 484, y: 299, r: 16, g: 20, b: 16 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gLeagueOnQuickPlayPage = new RF.Page(
  "gLeagueOnQuickPlayPage",
  [
    { x: 456, y: 11, r: 49, g: 73, b: 123 },
    { x: 472, y: 22, r: 201, g: 207, b: 218 },
    { x: 532, y: 22, r: 81, g: 100, b: 128 },
    { x: 453, y: 347, r: 24, g: 36, b: 57 },
    { x: 328, y: 345, r: 0, g: 93, b: 247 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

// when playing, press back
var gLeagueOnPlayPausePage = new RF.Page(
  "gLeagueOnPlayPausePage",
  [
    { x: 94, y: 340, r: 210, g: 207, b: 210 },
    { x: 91, y: 334, r: 186, g: 184, b: 186 },
    { x: 552, y: 289, r: 33, g: 58, b: 84 },
    { x: 562, y: 294, r: 255, g: 255, b: 255 },
    { x: 566, y: 290, r: 43, g: 60, b: 85 },
    { x: 93, y: 139, r: 74, g: 89, b: 99 },
    { x: 95, y: 148, r: 255, g: 255, b: 255 },
    { x: 91, y: 157, r: 19, g: 41, b: 53 },
    { x: 204, y: 151, r: 255, g: 255, b: 255 },
    { x: 443, y: 165, r: 83, g: 100, b: 107 },
    { x: 412, y: 153, r: 61, g: 73, b: 86 },
    { x: 528, y: 152, r: 255, g: 255, b: 255 },
    { x: 557, y: 152, r: 189, g: 192, b: 198 },
  ],
  { x: 94, y: 153 },
  { x: 94, y: 153 }
);

var gGameResultPage = new RF.Page(
  "gGameResultPage",
  [
    { x: 458, y: 24, r: 41, g: 44, b: 49 }, // title
    { x: 126, y: 333, r: 49, g: 81, b: 123 }, // view all btn
    { x: 247, y: 335, r: 41, g: 81, b: 115 }, // box score btn
    { x: 609, y: 335, r: 8, g: 109, b: 255 }, // next btn
  ],
  { x: 609, y: 335 },
  { x: 609, y: 335 }
);

var gGameResultAquiredPage = new RF.Page(
  "gGameResultAquiredPage",
  [
    { x: 449, y: 23, r: 41, g: 44, b: 49 }, // title
    { x: 39, y: 329, r: 213, g: 218, b: 213 }, // back btn
    { x: 158, y: 287, r: 247, g: 126, b: 51 }, // player pack btn
    { x: 612, y: 328, r: 8, g: 109, b: 247 }, // ok btn
  ],
  { x: 612, y: 328 },
  { x: 612, y: 328 }
);

var gGameResultOtherPage = new RF.Page(
  "gGameResultOtherPage",
  [
    { x: 71, y: 29, r: 0, g: 85, b: 156 },
    { x: 556, y: 15, r: 212, g: 228, b: 241 },
    { x: 595, y: 13, r: 0, g: 93, b: 181 },
    { x: 610, y: 13, r: 0, g: 28, b: 57 },
    { x: 618, y: 13, r: 17, g: 26, b: 58 },
    { x: 624, y: 8, r: 243, g: 244, b: 245 },
    { x: 627, y: 24, r: 165, g: 186, b: 202 },
    { x: 578, y: 23, r: 70, g: 132, b: 182 },
    { x: 249, y: 56, r: 84, g: 121, b: 161 },
    { x: 267, y: 56, r: 255, g: 255, b: 255 },
    { x: 319, y: 60, r: 168, g: 191, b: 208 },
    { x: 377, y: 58, r: 255, g: 255, b: 255 },
    { x: 29, y: 93, r: 0, g: 36, b: 66 },
    { x: 617, y: 314, r: 16, g: 24, b: 17 },
    { x: 108, y: 322, r: 8, g: 20, b: 16 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gGameResultWorldChampionPage = new RF.Page(
  "gGameResultWorldChampionPage",
  [
    { x: 252, y: 22, r: 57, g: 67, b: 74 },
    { x: 323, y: 42, r: 116, g: 109, b: 83 },
    { x: 350, y: 73, r: 66, g: 91, b: 96 },
    { x: 49, y: 331, r: 16, g: 32, b: 41 },
    { x: 209, y: 322, r: 8, g: 20, b: 24 },
    { x: 294, y: 326, r: 208, g: 208, b: 212 },
    { x: 400, y: 323, r: 192, g: 190, b: 192 },
    { x: 439, y: 323, r: 85, g: 98, b: 100 },
    { x: 578, y: 195, r: 16, g: 36, b: 41 },
    { x: 316, y: 167, r: 212, g: 210, b: 212 },
    { x: 338, y: 173, r: 65, g: 71, b: 71 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gGameRewardPage = new RF.Page(
  "gGameRewardPage",
  [
    { x: 24, y: 336, r: 16, g: 32, b: 41 },
    { x: 577, y: 26, r: 0, g: 4, b: 0 },
    { x: 601, y: 335, r: 16, g: 32, b: 41 },
    { x: 411, y: 268, r: 8, g: 114, b: 255 },
    { x: 434, y: 270, r: 66, g: 144, b: 252 },
    { x: 487, y: 274, r: 0, g: 102, b: 247 },
    { x: 497, y: 122, r: 255, g: 255, b: 255 },
    { x: 461, y: 193, r: 42, g: 58, b: 58 },
  ],
  { x: 412, y: 271 },
  { x: 412, y: 271 }
);

var gGameLineUpPage = new RF.Page(
  "gGameLineUpPage",
  [
    { x: 601, y: 63, r: 70, g: 85, b: 120 },
    { x: 24, y: 66, r: 89, g: 120, b: 155 },
    { x: 60, y: 72, r: 173, g: 190, b: 211 },
    { x: 18, y: 92, r: 0, g: 101, b: 255 },
    { x: 24, y: 104, r: 226, g: 235, b: 250 },
    { x: 24, y: 228, r: 0, g: 113, b: 247 },
    { x: 27, y: 254, r: 0, g: 117, b: 255 },
    { x: 546, y: 323, r: 24, g: 73, b: 132 },
    { x: 586, y: 322, r: 213, g: 230, b: 246 },
    { x: 606, y: 322, r: 73, g: 108, b: 145 },
    { x: 270, y: 324, r: 153, g: 170, b: 190 },
    { x: 306, y: 322, r: 190, g: 212, b: 231 },
    { x: 201, y: 323, r: 196, g: 214, b: 232 },
    { x: 169, y: 322, r: 177, g: 185, b: 192 },
    { x: 120, y: 319, r: 60, g: 106, b: 160 },
    { x: 76, y: 325, r: 194, g: 196, b: 212 },
    { x: 43, y: 323, r: 214, g: 219, b: 214 },
  ],
  { x: 40, y: 324 },
  { x: 40, y: 324 }
);

var gPlayerGrowthCompeletePage = new RF.Page(
  "gPlayerGrowthCompeletePage ",
  [
    { x: 163, y: 79, r: 181, g: 186, b: 189 },
    { x: 223, y: 60, r: 41, g: 49, b: 49 },
    { x: 347, y: 57, r: 49, g: 56, b: 58 },
    { x: 308, y: 70, r: 181, g: 186, b: 189 },
    { x: 303, y: 62, r: 82, g: 89, b: 91 },
    { x: 517, y: 50, r: 188, g: 189, b: 189 },
    { x: 521, y: 63, r: 181, g: 183, b: 189 },
    { x: 527, y: 46, r: 60, g: 63, b: 67 },
    { x: 131, y: 165, r: 206, g: 211, b: 222 },
    { x: 146, y: 144, r: 57, g: 81, b: 99 },
    { x: 489, y: 138, r: 214, g: 32, b: 247 },
    { x: 488, y: 157, r: 187, g: 190, b: 203 },
    { x: 172, y: 246, r: 181, g: 186, b: 189 },
    { x: 265, y: 297, r: 8, g: 118, b: 255 },
    { x: 287, y: 306, r: 219, g: 231, b: 255 },
    { x: 298, y: 302, r: 232, g: 240, b: 251 },
    { x: 310, y: 305, r: 255, g: 255, b: 255 },
    { x: 324, y: 298, r: 251, g: 253, b: 255 },
    { x: 407, y: 294, r: 8, g: 122, b: 255 },
    { x: 416, y: 315, r: 0, g: 85, b: 239 },
    { x: 464, y: 309, r: 222, g: 219, b: 222 },
    { x: 108, y: 300, r: 222, g: 219, b: 222 },
  ],
  { x: 325, y: 304 },
  { x: 325, y: 304 }
);

var gLeagueRewardAchievementGradePage = new RF.Page(
  "gLeagueRewardAchievementGradePage",
  [
    { x: 17, y: 32, r: 181, g: 186, b: 189 },
    { x: 179, y: 45, r: 45, g: 50, b: 54 },
    { x: 287, y: 53, r: 73, g: 78, b: 81 },
    { x: 334, y: 48, r: 72, g: 79, b: 80 },
    { x: 394, y: 51, r: 16, g: 24, b: 24 },
    { x: 439, y: 50, r: 118, g: 122, b: 126 },
    { x: 442, y: 50, r: 79, g: 85, b: 92 },
    { x: 587, y: 46, r: 181, g: 186, b: 189 },
    { x: 595, y: 37, r: 179, g: 180, b: 186 },
    { x: 601, y: 44, r: 189, g: 186, b: 189 },
    { x: 597, y: 52, r: 149, g: 154, b: 156 },
    { x: 608, y: 37, r: 188, g: 185, b: 188 },
    { x: 609, y: 51, r: 181, g: 183, b: 182 },
    { x: 615, y: 68, r: 181, g: 186, b: 189 },
    { x: 614, y: 84, r: 16, g: 65, b: 107 },
    { x: 609, y: 197, r: 16, g: 65, b: 107 },
    { x: 607, y: 217, r: 24, g: 28, b: 33 },
    { x: 614, y: 323, r: 33, g: 40, b: 49 },
    { x: 610, y: 348, r: 8, g: 8, b: 0 },
    { x: 17, y: 83, r: 0, g: 48, b: 90 },
    { x: 18, y: 199, r: 0, g: 48, b: 90 },
    { x: 20, y: 325, r: 33, g: 40, b: 49 },
  ],
  { x: 600, y: 45 },
  { x: 600, y: 45 }
);

var gPicherOfTheMonthPage = new RF.Page(
  "gPicherOfTheMonthPage",
  [
    { x: 27, y: 38, r: 181, g: 186, b: 198 },
    { x: 602, y: 46, r: 154, g: 152, b: 155 },
    { x: 535, y: 309, r: 139, g: 188, b: 255 },
    { x: 605, y: 316, r: 0, g: 97, b: 247 },
    { x: 391, y: 309, r: 222, g: 219, b: 222 },
  ],
  { x: 545, y: 310 },
  { x: 545, y: 310 }
);

var gMvpPage = new RF.Page(
  "gMvpPage",
  [
    { x: 273, y: 23, r: 0, g: 89, b: 165 },
    { x: 297, y: 25, r: 90, g: 145, b: 200 },
    { x: 320, y: 25, r: 255, g: 255, b: 255 },
    { x: 332, y: 29, r: 126, g: 169, b: 204 },
    { x: 380, y: 53, r: 0, g: 65, b: 122 },
    { x: 493, y: 322, r: 16, g: 20, b: 8 },
    { x: 568, y: 320, r: 38, g: 120, b: 218 },
    { x: 635, y: 341, r: 8, g: 16, b: 8 },
    { x: 620, y: 164, r: 0, g: 8, b: 8 },
    { x: 9, y: 176, r: 12, g: 24, b: 24 },
  ],
  { x: 568, y: 320 },
  { x: 568, y: 320 }
);

var gSelectRewardPlayerPage = new RF.Page(
  "gSelectRewardPlayerPage",
  [
    { x: 3, y: 8, r: 0, g: 97, b: 189 },
    { x: 176, y: 27, r: 0, g: 85, b: 156 },
    { x: 208, y: 27, r: 144, g: 183, b: 215 },
    { x: 290, y: 28, r: 255, g: 255, b: 255 },
    { x: 371, y: 24, r: 3, g: 91, b: 166 },
    { x: 442, y: 28, r: 115, g: 160, b: 204 },
    { x: 65, y: 288, r: 66, g: 73, b: 57 },
    { x: 65, y: 328, r: 34, g: 44, b: 33 },
    { x: 483, y: 287, r: 66, g: 73, b: 66 },
    { x: 484, y: 332, r: 45, g: 56, b: 52 },
    { x: 174, y: 289, r: 66, g: 73, b: 62 },
    { x: 169, y: 325, r: 33, g: 44, b: 33 },
    { x: 368, y: 286, r: 59, g: 69, b: 57 },
    { x: 362, y: 325, r: 33, g: 44, b: 33 },
    { x: 627, y: 345, r: 8, g: 12, b: 8 },
    { x: 9, y: 345, r: 8, g: 16, b: 8 },
  ],
  { x: 568, y: 320 },
  { x: 568, y: 320 }
);
// TODO: check the position, must be bg of 'diamond', 'gold' ...
// ref: https://www.facebook.com/mlb9innings/photos/1366596103748570
var gSelectRewardPlayerPageButtons = {
  leftCard: { x: 66, y: 217 },
  midCard: { x: 224, y: 217 },
  rightCard: { x: 379, y: 217 },
};

var gPowerSavingPage = new RF.Page(
  "gPowerSavingPage",
  [
    { x: 298, y: 136, r: 156, g: 160, b: 165 },
    { x: 137, y: 155, r: 0, g: 0, b: 0 },
    { x: 521, y: 160, r: 0, g: 0, b: 0 },
    { x: 298, y: 50, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    // to diff from power saving during playing
    { x: 493, y: 291, r: 0, g: 0, b: 0 },
    { x: 506, y: 282, r: 0, g: 0, b: 0 },
    { x: 506, y: 304, r: 0, g: 0, b: 0 },
    { x: 503, y: 280, r: 0, g: 0, b: 0 },
    { x: 502, y: 291, r: 0, g: 0, b: 0 },
    { x: 561, y: 280, r: 0, g: 0, b: 0 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gPromotionPage = new RF.Page(
  "gPromotionPage1",
  [
    { x: 603, y: 27, r: 124, g: 130, b: 132 },
    { x: 612, y: 33, r: 60, g: 60, b: 60 },
    { x: 605, y: 40, r: 174, g: 178, b: 181 },
    { x: 605, y: 35, r: 181, g: 178, b: 181 },
    { x: 612, y: 39, r: 181, g: 178, b: 181 },
    { x: 616, y: 39, r: 181, g: 178, b: 181 },
    { x: 615, y: 29, r: 142, g: 144, b: 142 },
  ],
  { x: 611, y: 36 },
  { x: 611, y: 36 }
);

var gPromotionPage2 = new RF.Page(
  "gPromotionPage2",
  [
    { x: 43, y: 31, r: 206, g: 211, b: 222 },
    { x: 306, y: 29, r: 206, g: 211, b: 222 },
    { x: 546, y: 32, r: 206, g: 211, b: 222 },
    { x: 576, y: 36, r: 173, g: 174, b: 180 },
    { x: 580, y: 40, r: 174, g: 172, b: 175 },
    { x: 587, y: 36, r: 206, g: 207, b: 213 },
    { x: 576, y: 46, r: 213, g: 211, b: 215 },
    { x: 584, y: 45, r: 212, g: 210, b: 213 },
    { x: 595, y: 55, r: 206, g: 211, b: 222 },
  ],
  { x: 578, y: 39 },
  { x: 578, y: 39 }
);

var gPromotionPage3 = new RF.Page(
  "gPromotionPage3",
  [
    { x: 598, y: 37, r: 101, g: 103, b: 102 },
    { x: 604, y: 45, r: 71, g: 73, b: 71 },
    { x: 612, y: 53, r: 174, g: 175, b: 176 },
    { x: 617, y: 33, r: 181, g: 186, b: 189 },
  ],
  { x: 601, y: 43 },
  { x: 601, y: 43 }
);

var gRechargePromotionPage = new RF.Page(
  "gRechargePromotionPage",
  [
    { x: 114, y: 45, r: 181, g: 186, b: 189 },
    { x: 229, y: 59, r: 16, g: 24, b: 24 },
    { x: 280, y: 60, r: 35, g: 43, b: 48 },
    { x: 340, y: 58, r: 176, g: 181, b: 185 },
    { x: 407, y: 66, r: 38, g: 45, b: 47 },
    { x: 456, y: 89, r: 181, g: 186, b: 189 },
    { x: 520, y: 50, r: 67, g: 68, b: 68 },
    { x: 524, y: 58, r: 181, g: 186, b: 189 },
    { x: 529, y: 43, r: 151, g: 155, b: 156 },
    { x: 180, y: 302, r: 75, g: 149, b: 255 },
    { x: 144, y: 289, r: 41, g: 142, b: 255 },
    { x: 110, y: 300, r: 222, g: 223, b: 222 },
    { x: 337, y: 288, r: 41, g: 142, b: 255 },
    { x: 366, y: 302, r: 252, g: 253, b: 254 },
    { x: 438, y: 302, r: 255, g: 226, b: 125 },
    { x: 522, y: 311, r: 222, g: 223, b: 222 },
  ],
  { x: 518, y: 53 },
  { x: 518, y: 53 }
);

var gTeamSupportPackagePromotionPage = new RF.Page(
  "gTeamSupportPackagePromotionPage",
  [
    { x: 207, y: 40, r: 90, g: 190, b: 148 },
    { x: 230, y: 39, r: 8, g: 32, b: 41 },
    { x: 368, y: 43, r: 48, g: 113, b: 95 },
    { x: 525, y: 55, r: 90, g: 190, b: 148 },
    { x: 577, y: 37, r: 115, g: 167, b: 141 },
    { x: 583, y: 46, r: 148, g: 207, b: 174 },
    { x: 590, y: 30, r: 90, g: 190, b: 148 },
  ],
  { x: 583, y: 45 },
  { x: 583, y: 45 }
);

// a page wwith a close btn but taller than promotion page
var gEventPage = new RF.Page(
  "gEventPage",
  [
    { x: 20, y: 21, r: 253, g: 254, b: 254 },
    { x: 47, y: 32, r: 132, g: 134, b: 140 },
    { x: 48, y: 23, r: 246, g: 247, b: 247 },
    { x: 603, y: 19, r: 124, g: 130, b: 132 },
    { x: 612, y: 22, r: 49, g: 52, b: 49 },
    { x: 622, y: 26, r: 181, g: 178, b: 181 },
  ],
  { x: 611, y: 23 },
  { x: 611, y: 23 }
);

var gReviewAppPage = new RF.Page(
  "gReviewAppPage",
  [
    { x: 106, y: 42, r: 181, g: 186, b: 189 },
    { x: 316, y: 58, r: 84, g: 90, b: 93 },
    { x: 510, y: 43, r: 168, g: 176, b: 176 },
    { x: 525, y: 57, r: 143, g: 144, b: 144 },
    { x: 305, y: 61, r: 16, g: 24, b: 24 },
    { x: 338, y: 61, r: 16, g: 24, b: 24 },
    { x: 114, y: 301, r: 222, g: 219, b: 222 },
    { x: 153, y: 297, r: 49, g: 85, b: 123 },
    { x: 178, y: 299, r: 168, g: 190, b: 224 },
    { x: 241, y: 298, r: 222, g: 219, b: 222 },
    { x: 285, y: 305, r: 49, g: 85, b: 123 },
    { x: 308, y: 302, r: 79, g: 108, b: 145 },
    { x: 365, y: 302, r: 222, g: 219, b: 222 },
    { x: 421, y: 299, r: 8, g: 114, b: 255 },
    { x: 438, y: 299, r: 47, g: 138, b: 254 },
    { x: 489, y: 301, r: 8, g: 113, b: 255 },
    { x: 528, y: 305, r: 222, g: 219, b: 222 },
  ],
  { x: 161, y: 292 },
  { x: 161, y: 292 }
);

// page has ok button
var gOkPage = new RF.Page(
  "gOkPage",
  [
    { x: 279, y: 300, r: 0, g: 113, b: 247 },
    { x: 310, y: 301, r: 136, g: 188, b: 254 },
    { x: 326, y: 301, r: 255, g: 255, b: 255 },
    { x: 362, y: 300, r: 0, g: 113, b: 247 },
    { x: 369, y: 312, r: 8, g: 101, b: 255 },
  ],
  { x: 319, y: 303 },
  { x: 319, y: 303 }
);

// page has next button
var gNextPage = new RF.Page(
  "gNextPage",
  [
    { x: 273, y: 304, r: 8, g: 117, b: 255 },
    { x: 305, y: 307, r: 255, g: 255, b: 255 },
    { x: 314, y: 314, r: 255, g: 255, b: 255 },
    { x: 321, y: 305, r: 224, g: 236, b: 255 },
    { x: 328, y: 310, r: 1, g: 106, b: 255 },
    { x: 333, y: 299, r: 8, g: 125, b: 255 },
    { x: 374, y: 305, r: 8, g: 117, b: 255 },
    { x: 380, y: 319, r: 0, g: 89, b: 247 },
    { x: 265, y: 318, r: 0, g: 89, b: 247 },
  ],
  { x: 346, y: 307 },
  { x: 346, y: 307 }
);

var gNextPage2 = new RF.Page(
  "gNextPage",
  [
    { x: 226, y: 296, r: 222, g: 219, b: 222 },
    { x: 275, y: 296, r: 8, g: 121, b: 255 },
    { x: 306, y: 299, r: 254, g: 254, b: 255 },
    { x: 314, y: 303, r: 255, g: 255, b: 255 },
    { x: 321, y: 299, r: 201, g: 223, b: 255 },
    { x: 331, y: 299, r: 255, g: 255, b: 255 },
    { x: 364, y: 310, r: 0, g: 94, b: 247 },
  ],
  { x: 346, y: 307 },
  { x: 346, y: 307 }
);

// for some situation, unexpectedError happens
// this also includes network error
var gUnexpectedErrorPage = new RF.Page(
  "gUnexpectedErrorPage",
  [
    { x: 323, y: 39, r: 181, g: 186, b: 189 },
    { x: 514, y: 44, r: 80, g: 81, b: 81 },
    { x: 524, y: 48, r: 64, g: 70, b: 71 },
    { x: 518, y: 54, r: 65, g: 71, b: 71 },
    { x: 315, y: 269, r: 181, g: 186, b: 189 },
    { x: 315, y: 293, r: 8, g: 125, b: 255 },
    { x: 316, y: 299, r: 241, g: 247, b: 255 },
    { x: 317, y: 310, r: 0, g: 92, b: 245 },
    { x: 317, y: 313, r: 0, g: 85, b: 240 },
    { x: 317, y: 323, r: 222, g: 219, b: 222 },
  ],
  { x: 314, y: 299 },
  { x: 314, y: 299 }
);

var gLeagueModePanelPages = [
  gLeagueModePanelPageContinue,
  gLeagueModePanelPageNextSchedule,
  gLeagueModePanelPageNextSchedule2,
];
var gLeagueModePanelPagesGroup = new RF.GroupPage(
  "gLeagueModePanelPages",
  gLeagueModePanelPages
);

var gLeagueOnPlayPages = [
  gLeagueOnPlayPagePowerSaveOn,
  gLeagueOnPlayPagePowerSaveOff,
  gLeagueOnPlayPageAutoOff,
  gLeagueOnQuickPlayPage,
  gLeagueOnPlayPausePage,
  gLeagueContinuePlayingPage,
];
var gLeagueOnPlayPagesGroup = new RF.GroupPage(
  "gLeagueOnPlayPages",
  gLeagueOnPlayPages
);

var gAllPages = [
  gMainPage,
  gSettingsPage,
  gNewSeasonPage,
  gEndSeasonPage,
  gSelectSeasonModePage,
  gSelectYearPage,
  gSelectLeagueGameAmountPage,
  gLeagueNewGamePage,
  gGameResultPage,
  gGameResultAquiredPage,
  gGameResultOtherPage,
  gGameResultWorldChampionPage,
  gGameRewardPage,
  gGameLineUpPage,
  gPlayerGrowthCompeletePage,
  gLeagueRewardAchievementGradePage,
  gPicherOfTheMonthPage,
  gMvpPage,
  gSelectRewardPlayerPage,
  gReviewAppPage,
  gOkPage,
  gNextPage,
  gNextPage2,
  gDownloadDataPage,
  gBackBtnPage,
  gPromotionPage,
  gPromotionPage2,
  gPromotionPage3,
  gRechargePromotionPage,
  gTeamSupportPackagePromotionPage,
  gEventPage,
  gPowerSavingPage,
  gUnexpectedErrorPage,
]
  .concat(gLeagueModePanelPages)
  .concat(gLeagueOnPlayPages);
var gAllPagesGroup = new RF.GroupPage("gAllPages", gAllPages);

function MLB9I(config) {
  console.log("new MLB9I");
  this.config = config;
  this.screenConfig = new RF.ScreenConfig();
  this.screen = new RF.Screen(this.screenConfig);
  this.taskManager = new RF.TaskManager();
  this.running = false;
}
MLB9I.prototype.debug = function (errMsg) {
  if (this.config.isDev) {
    var screenshot = getScreenshot();
    saveImage(
      screenshot,
      "mlb-error" + errMsg + "-" + new Date().toISOString() + ".jpg"
    );
    releaseImage(screenshot);
  }
};

MLB9I.prototype.init = function () {
  console.log("MLB9I init");
  this.running = true;
  this.screenConfig.devWidth = 640;
  this.screenConfig.devHeight = 360;
};

MLB9I.prototype.start = function () {
  console.log("MLB9I start");
  console.log("script version", gScriptVersion);
  this.running = true;

  // var screenshot = getScreenshot();
  // for (var p in ppos) {
  //   p = ppos[p];
  //   console.log(p.x, p.y);
  //   var rgb = getImageColor(screenshot, p.x, p.y);
  //   console.log([
  //     [p.r, rgb.r, p.r === rgb.r],
  //     [p.g, rgb.g, p.g === rgb.g],
  //     [p.b, rgb.b, p.b === rgb.b],
  //   ]);
  // }
  // console.log("playing save");
  // for (var p in lpos) {
  //   p = lpos[p];
  //   console.log(p.x, p.y);
  //   var rgb = getImageColor(screenshot, p.x, p.y);
  //   console.log([
  //     [p.r, rgb.r, p.r === rgb.r],
  //     [p.g, rgb.g, p.g === rgb.g],
  //     [p.b, rgb.b, p.b === rgb.b],
  //   ]);
  // }
  // releaseImage(screenshot);

  // console.log(gPowerSavingPage.isMatchScreen(this.screen));
  // console.log(gLeagueOnPlayPagePowerSaveOn.isMatchScreen(this.screen, 1));

  if (this.config.isXr === true) {
    var isOk = this.handleSetPowerSave();
    if (!isOk) {
      return;
    }
  }
  this.taskManager.addTask(
    "playLeagueMode",
    this.taskPlayLeagueMode.bind(this)
  );
  this.taskManager.start();
};

MLB9I.prototype.stop = function () {
  console.log("MLB9I stop");
  this.running = false;
  this.taskManager.stop();
};

MLB9I.prototype.tryDo = function (isOk, maxTryTime, curTryTime) {
  curTryTime = curTryTime || 0;
  maxTryTime || 120;
  console.log("try do", curTryTime);
  if (!this.running || isOk(curTryTime)) {
    return true;
  }
  if (maxTryTime === curTryTime) {
    return false;
  }
  RF.Utils.sleep(gSleepShort);
  return this.tryDo(isOk, maxTryTime, curTryTime + 1);
};

MLB9I.prototype.findPages = function () {
  var matches = gAllPagesGroup.isMatchScreen(this.screen);
  console.log("====findPages====");
  console.log(matches);
  console.log("====findPages====");
  return matches;
};

MLB9I.prototype.getPageByName = function (pageName) {
  for (var i = 0; i < gAllPages.length; i++) {
    if (gAllPages[i].name === pageName) {
      return gAllPages[i];
    }
  }
  return null;
};

MLB9I.prototype.goToPage = function (
  targetPage,
  maxTryTime,
  interval,
  isGoBack
) {
  console.log("=== go to page ", targetPage.name);
  var continueActionName = isGoBack ? "goBack" : "goNext";
  maxTryTime = maxTryTime || 120;
  interval = interval === undefined ? gSleepShort : interval;
  var hasError = false;

  function goTo(tryTime) {
    var pageNames = this.findPages();
    var pageName = pageNames[0];
    console.log("current page", tryTime, pageName);
    if (pageName === targetPage.name) {
      return true;
    }
    // cannot leave main page
    if (pageName === "gMainPage") {
      hasError = true;
      return true;
    }
    if (pageName === "gUnexpectedErrorPage") {
      gUnexpectedErrorPage.goNext(this.screen);
      RF.Utils.sleep(gSleepWaitPageLong);
      return false;
    }
    if (pageName === "gPowerSavingPage") {
      this.handlePowerSavingPage();
      return false;
    }
    if (pageName === "gMvpPage") {
      this.handleMvpPage();
      return false;
    }
    if (pageName === "gDownloadDataPage") {
      RF.Utils.sleep(gSleepWaitPageShort);
      return false;
    }
    if (pageName === "gLeagueOnPlayPage") {
      this.screen.tap({ x: 0, y: 0 });
      console.log("tap");
      RF.Utils.sleep(gSleepWaitPageLong);
      return false;
    }
    if (pageName === "gLeagueOnQuickPlayPage") {
      RF.Utils.sleep(gSleepWaitPageLong);
      return false;
    }
    // ! handle swipe pages
    var page = this.getPageByName(pageName);
    if (page !== null) {
      page[continueActionName](this.screen);
      return false;
    }
    console.log("Unknown Page", tryTime);

    keycode("KEYCODE_BACK", 100);
    console.log("tap back");

    // TODO: unknown too long, try to restart app
    if (tryTime % 30 === 29) {
      console.log("??");
      // console.log('Unknown > 1 min, stop App');
      // this.stopApp();
      // RF.Utils.sleep(gSleepLong);
    }
    // TODO: check is in app
    else if (tryTime % 10 === 0) {
      this.screen.tap({ x: 0, y: 0 });
      console.log("tap");
      // if (!this.checkIsInApp()) {
      //   console.log('Not in app, start app');
      //   this.startApp();
      // } else {
      //   this.screen.tap(1, 1, 100);
      //   console.log('keycode BACK');
      //   keycode('BACK', 100);
      // }
    }
    RF.Utils.sleep(interval);
    return false;
  }
  var isOk = this.tryDo(goTo.bind(this), maxTryTime);
  return isOk && !hasError;
};

MLB9I.prototype.goMainPage = function () {
  return this.goToPage(gMainPage, 60, gSleepShort, true);
};

MLB9I.prototype.handleSetPowerSave = function () {
  if (!this.goMainPage()) {
    console.log("cannot go to main page");
    return false;
  }
  RF.Utils.sleep(gSleepShort);

  this.screen.tap(gMainPageBtns.settings);
  console.log("click setting button");
  RF.Utils.sleep(gSleepMedium);

  if (
    !gSettingsPage.waitScreenForMatchingScreen(
      this.screen,
      gSleepWaitPageLong,
      2
    )
  ) {
    console.log("cannot go to setting page");
    return false;
  }

  this.screen.tap(gSettingsPageBtns.graphicTab);
  console.log("click graphic tab");
  RF.Utils.sleep(gSleepShort);

  // ensure is switched on
  var screenshot = getScreenshot();
  var rgb = getImageColor(
    screenshot,
    gSettingsPageBtns.graphicTabPowerSaveOn.x,
    gSettingsPageBtns.graphicTabPowerSaveOn.y
  );
  releaseImage(screenshot);
  if (rgb.r !== 8 || rgb.g !== 118 || rgb.b !== 255) {
    this.screen.tap(gSettingsPageBtns.graphicTabPowerSaveOn);
    console.log("click power save mode on");
    RF.Utils.sleep(gSleepShort);
  }
  return true;
};

MLB9I.prototype.handlePowerSavingPage = function () {
  console.log("handlePowerSavingPage");
  this.screen.tapDown({ x: 100, y: 180 });
  RF.Utils.sleep(gSleepMedium);
  this.screen.moveTo({ x: 500, y: 180 });
  RF.Utils.sleep(gSleepMedium);
  this.screen.tapUp({ x: 500, y: 180 });
  RF.Utils.sleep(gSleepMedium);
};

MLB9I.prototype.handleMvpPage = function () {
  console.log("handleMvpPage");

  var screenshot = getScreenshot();
  var x = gMvpPage.next.x;
  var y = gMvpPage.next.y;
  var rgb = getImageColor(screenshot, x, y);
  releaseImage(screenshot);

  // ok button still on the screen
  while (rgb.r === 38 && rgb.g === 120 && rgb.b === 218) {
    gMvpPage.goNext(this.screen); // ok
    RF.Utils.sleep(gSleepMedium);
    screenshot = getScreenshot();
    rgb = getImageColor(screenshot, x, y);
    releaseImage(screenshot);
  }

  // reward bonus player popup
  RF.Utils.sleep(gSleepMedium);
  this.screen.tap({ x: 322, y: 309 }); // click next
  RF.Utils.sleep(gSleepShort);

  if (gSelectRewardPlayerPage.isMatchScreen(this.screen)) {
    this.handleSelectRewardPlayer();
    return true;
  }

  console.log("cannot enter gSelectRewardPlayerPage");
  return false;
};

// TODO: handle choose the most rare card
MLB9I.prototype.handleSelectRewardPlayer = function () {
  console.log("handleSelectRewardPlayer");

  var screenshot = getScreenshot();
  var bestCardPos = gSelectRewardPlayerPageButtons.leftCard;
  for (pos in Object.values(gSelectRewardPlayerPageButtons)) {
    var rgb = getImageColor(screenshot, pos.x, pos.y);
    console.log(rgb.r, rgb.g, rgb.b);
    // TODO: check the color priority
    if (true) {
      bestCardPos = pos;
    }
  }
  releaseImage(screenshot);

  this.screen.tap(bestCardPos);
  RF.Utils.sleep(gSleepShort);

  gSelectRewardPlayerPage.goNext(this.screen);
  RF.Utils.sleep(gSleepMedium);
};

MLB9I.prototype.handleSelectYearPage = function () {
  console.log("handle select year page");
  // TODO: use config to select year
  gSelectYearPage.goNext(this.screen);

  // go to the latest year
  var isNotLatestYear = true;
  while (isNotLatestYear) {
    this.screen.tap(gSelectYearPageBtns.nextYear);
    RF.Utils.sleep(gSleepShort);
    isNotLatestYear = false;
  }

  // check the diff, return to prev year
  for (
    var yearDiff = gLeagueYearLatest - this.config.leagueYear;
    yearDiff > 0;
    yearDiff--
  ) {
    this.screen.tap(gSelectYearPageBtns.prevYear);
    RF.Utils.sleep(gSleepShort);
  }

  // this.screen.tap({ x: 285, y: 303 });
  this.screen.tap(gSelectYearPageBtns.submit);
  return;
};

MLB9I.prototype.handleEndSeasonPage = function () {
  // TODO: use config to select
  console.log("end season");
  this.screen.tap({ x: 182, y: 178 }); // tap new season of left
  RF.Utils.sleep(gSleepMedium);
  gEndSeasonPage.goNext(this.screen);
  RF.Utils.sleep(gSleepMedium);
};

MLB9I.prototype.handleLeagueModeNextSchedulePage = function () {
  console.log("##handle LeagueModeNextSchedulePage");

  function goNewGamePanel(tryTime) {
    console.log("#### go new game panel", tryTime);

    var screenshot = getScreenshot();
    if (gLeagueModePanelPageNextSchedule.isMatchImage(screenshot)) {
      console.log("is enter next schedule page");
      gLeagueModePanelPageNextSchedule.goNext(this.screen);
      RF.Utils.sleep(gSleepShort);
    }

    if (
      gLeagueNewGamePage.waitScreenForMatchingScreen(
        this.screen,
        gSleepWaitPageLong,
        2
      )
    ) {
      console.log("is enter new game page");
      releaseImage(screenshot);
      RF.Utils.sleep(gSleepShort);
      return true;
    }

    // sometime gGameResultOtherPage will show before entering game
    if (gGameResultOtherPage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      this.screen.tap({ x: 0, y: 0 });
      RF.Utils.sleep(gSleepMedium);
      return false;
    }

    releaseImage(screenshot);
    RF.Utils.sleep(gSleepWaitPageShort);
    return false;
  }

  var isEnterNewGamePanel = this.tryDo(goNewGamePanel.bind(this), 15);
  if (!isEnterNewGamePanel) {
    console.log("cannot enter new game page");
    this.debug("isEnterNewGamePanel");
    return isEnterNewGamePanel;
  }
  console.log("check energy");

  // handle the energy to choose game
  var screenshot = getScreenshot();
  var hasEnergy = false;
  for (var y = 274; y < 286 && !hasEnergy; y++) {
    for (var x = 567; x < 572; x++) {
      var rgb = getImageColor(screenshot, x, y);
      if (rgb.r === 24 && rgb.g === 36 && rgb.b === 49) {
        continue;
      }
      hasEnergy = true;
      break;
    }
  }
  if (!hasEnergy) {
    releaseImage(screenshot);
    console.log("no energy");
    return !hasEnergy;
  }

  var has10Energy = false;
  for (var y = 274; y < 286 && !has10Energy; y++) {
    for (var x = 556; x < 564; x++) {
      var rgb = getImageColor(screenshot, x, y);
      if (rgb.r === 24 && rgb.g === 36 && rgb.b === 49) {
        continue;
      }
      has10Energy = true;
      break;
    }
  }
  console.log("has10Energy:", has10Energy);

  // use quick play when has 10+ energy,
  // and slow play when has 10- energy
  if (has10Energy && gLeagueNewGamePageQuickPlayOff.isMatchImage(screenshot)) {
    gLeagueNewGamePageQuickPlayOff.goNext(this.screen); // select quick play
    console.log("turn on quick play");
  } else if (
    !has10Energy &&
    gLeagueNewGamePageQuickPlayOn.isMatchImage(screenshot)
  ) {
    gLeagueNewGamePageQuickPlayOn.goNext(this.screen); // cancel quick play
    console.log("turn off quick play");
  }

  releaseImage(screenshot);
  RF.Utils.sleep(gSleepShort);
  gLeagueNewGamePage.goNext(this.screen); // play ball
  console.log("play");

  function enterGame(tryTime) {
    if (
      gLeagueNewGamePageSelectPlayRole.waitScreenForMatchingScreen(
        this.screen,
        gSleepWaitPageLong,
        2,
        600,
        0.7
      )
    ) {
      // TODO: might add to config
      console.log("handle select player role");
      this.screen.tap(gLeagueNewGamePageSelectPlayRoleBtns.playAll);
      RF.Utils.sleep(gSleepMedium);
      return true;
    }

    var pageName = gLeagueOnPlayPagesGroup.waitScreenForMatchingOne(
      this.screen,
      gSleepWaitPageLong,
      2
    );
    if (pageName !== "") {
      console.log(pageName);
      return true;
    }

    this.screen.tap({ x: 0, y: 0 });
    console.log("tap");
    RF.Utils.sleep(gSleepShort);
    return false;
  }

  var isEnterGame = this.tryDo(enterGame.bind(this), 150);
  if (!isEnterGame) {
    console.log("cannot enter game");
    this.debug("isEnterGame");
  }
  return true;
};

MLB9I.prototype.handleEnterLeagueGame = function () {
  var hasError = false;
  function enterGame(tryTime) {
    console.log("####### try start game");
    // check if enter the panel
    var pageName = gLeagueModePanelPagesGroup.waitScreenForMatchingOne(
      this.screen,
      gSleepWaitPageShort,
      2
    );
    console.log(pageName);
    if (pageName === "gLeagueModePanelPageNextSchedule") {
      hasError = !this.handleLeagueModeNextSchedulePage();
      return true;
    }
    if (pageName === "gLeagueModePanelPageContinue") {
      gLeagueModePanelPageContinue.goNext(this.screen);
      RF.Utils.sleep(gSleepMedium);
      gLeagueNewGamePage.goNext(this.screen); // play ball
      RF.Utils.sleep(gSleepMedium);
      return true;
    }

    var screenshot = getScreenshot();
    if (gMainPage.isMatchImage(screenshot)) {
      console.log("main page");
      releaseImage(screenshot);
      RF.Utils.sleep(gSleepShort);
      return false;
    }
    if (gLeagueRewardAchievementGradePage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      console.log("league reward achievement");
      gLeagueRewardAchievementGradePage.goNext(this.screen);
      RF.Utils.sleep(gSleepMedium);
      return false;
    }
    if (gNewSeasonPage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      console.log("new season");
      gNewSeasonPage.goNext(this.screen);
      RF.Utils.sleep(gSleepMedium);
      return false;
    }
    if (gEndSeasonPage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      this.handleEndSeasonPage();
      return false;
    }
    if (gSelectSeasonModePage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      console.log("handle select season page");
      gSelectSeasonModePage.goNext(this.screen);
      RF.Utils.sleep(gSleepMedium);
      this.screen.tap({ x: 568, y: 333 }); // normal mode
      RF.Utils.sleep(gSleepShort);
      this.screen.tap({ x: 332, y: 301 }); // next season
      RF.Utils.sleep(gSleepMedium);
      return false;
    }
    if (gSelectYearPage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      this.handleSelectYearPage();
      RF.Utils.sleep(gSleepMedium);
      return false;
    }
    if (gSelectLeagueGameAmountPage.isMatchImage(screenshot)) {
      releaseImage(screenshot);
      console.log("handle select game amount page");

      // use config user setted to select which they want to play
      // TODO: handle the half, quarter, full has 2 next page
      switch (this.config.leagueSeasonMode) {
        case "full":
          console.log("select full league");
          this.screen.tap(gSelectLeagueGameAmountPageBtns["full"]);
          RF.Utils.sleep(gSleepShort);
          this.screen.tap({ x: 564, y: 328 }); // go next
          break;
        case "half":
          console.log("select 1/2 league");
          this.screen.tap(gSelectLeagueGameAmountPageBtns["half"]);
          RF.Utils.sleep(gSleepShort);
          this.screen.tap({ x: 564, y: 328 }); // go next
          // ? will go to ok / next pages
          break;
        case "quarter":
          console.log("select 1/4 league");
          this.screen.tap(gSelectLeagueGameAmountPageBtns["quarter"]);
          RF.Utils.sleep(gSleepShort);
          this.screen.tap({ x: 564, y: 328 }); // go next
          // ? will go to ok / next pages
          break;
        case "postSeason":
          console.log("select postSeason");
          this.screen.tap(gSelectLeagueGameAmountPageBtns["postSeason"]);
          // ? will go to ok / next pages
          break;
      }
      RF.Utils.sleep(gSleepMedium);
      this.screen.tap({ x: 564, y: 328 }); // go next
      RF.Utils.sleep(gSleepLong);
      return false;
    }

    if (gUnexpectedErrorPage.isMatchImage(screenshot)) {
      console.log("unexpected page");
      releaseImage(screenshot);
      gUnexpectedErrorPage.goNext(this.screen);
      RF.Utils.sleep(gSleepWaitPageLong);
      return false;
    }
    if (gOkPage.isMatchImage(screenshot)) {
      console.log("ok page");
      releaseImage(screenshot);
      gOkPage.goNext(this.screen);
      RF.Utils.sleep(gSleepShort);
      return false;
    }
    if (gNextPage.isMatchImage(screenshot)) {
      console.log("next page");
      releaseImage(screenshot);
      gNextPage.goNext(this.screen);
      RF.Utils.sleep(gSleepShort);
      return false;
    }
    if (gNextPage2.isMatchImage(screenshot)) {
      console.log("next2 page");
      releaseImage(screenshot);
      gNextPage2.goNext(this.screen);
      RF.Utils.sleep(gSleepShort);
      return false;
    }

    releaseImage(screenshot);

    this.screen.tap({ x: 0, y: 0 });
    console.log("tap");

    if (tryTime % 25 === 0) {
      RF.Utils.sleep(gSleepMedium);
      keycode("KEYCODE_BACK", 100);
      console.log("tap back");
    }

    RF.Utils.sleep(gSleepMedium);
    return false;
  }

  var isEnterGame = this.tryDo(enterGame.bind(this), 75);
  return isEnterGame && !hasError;
};

MLB9I.prototype.handlePlayGame = function () {
  // wait the game is overed
  function endPlaying(tryTime) {
    console.log("#########check end play");

    // check whether is on play
    var pageName = gLeagueOnPlayPagesGroup.waitScreenForMatchingOne(
      this.screen,
      gSleepMedium,
      1
    );
    if (pageName !== "") {
      console.log("still playing");

      // handle play operation settings
      switch (pageName) {
        case "gLeagueContinuePlayingPage":
          gLeagueContinuePlayingPage.goNext(this.screen);
          RF.Utils.sleep(gSleepWaitPageLong);
          break;

        case "gLeagueOnPlayPausePage":
          gLeagueContinuePlayingPage.goNext(this.screen);
          RF.Utils.sleep(gSleepWaitPageLong);
          break;

        case "gLeagueContinuePlayingPage":
          gLeagueOnPlayPausePage.goNext(this.screen);
          RF.Utils.sleep(gSleepShort);
          break;

        case "gLeagueOnPlayPagePowerSaveOn":
          // game over when power save on
          if (gPowerSavingPage.isMatchScreen(this.screen, 1)) {
            console.log("end playing with power save on");
            this.handlePowerSavingPage();
            break;
          }

          // still playing
          if (this.config.isXr) {
            console.log("still play with power save on");
          } else {
            this.handlePowerSavingPage();
          }
          RF.Utils.sleep(gSleepWaitPageLong);
          break;

        case "gLeagueOnPlayPageAutoOff":
          gLeagueOnPlayPageAutoOff.goNext(this.screen);
          console.log("turn on auto play");
          RF.Utils.sleep(gSleepMedium);
        // not break here to handle power save play

        case "gLeagueOnPlayPagePowerSaveOff":
          if (this.config.isXr) {
            gLeagueOnPlayPagePowerSaveOff.goNext(this.screen);
            console.log("turn on power save play");
          }
          RF.Utils.sleep(gSleepWaitPageLong);

        default:
          this.screen.tap({ x: 0, y: 0 });
          console.log("tap");
          break;
      }
      return false;
    }

    this.screen.tap({ x: 0, y: 0 });
    console.log("tap");

    // check whether game is ended
    if (gMvpPage.isMatchScreen(this.screen)) {
      this.handleMvpPage();
      RF.Utils.sleep(gSleepMedium);
      return false;
    }

    // come back to main page
    if (gMainPage.isMatchScreen(this.screen)) {
      console.log("reach main page");
      return true;
    }

    if (this.goToPage(gGameResultOtherPage, 5)) {
      console.log("reach GameResultOther");
      gGameResultOtherPage.goNext(this.screen);
      RF.Utils.sleep(gSleepShort);
      return true;
    }

    RF.Utils.sleep(gSleepShort);
    return false;
  }

  var isEndGame = this.tryDo(endPlaying.bind(this), 100);
  if (!isEndGame) {
    console.log("is not end game");
  }
  return isEndGame;
};

MLB9I.prototype.taskPlayLeagueMode = function () {
  // go to leagueMode and start play all
  if (!this.goMainPage()) {
    console.log("cannot go to main page");
    this.debug("isEnterMainPage");
    return;
  }
  RF.Utils.sleep(gSleepShort);
  this.screen.tap(gMainPageBtns.leagueMode);
  console.log("click leagueMode button");
  RF.Utils.sleep(gSleepLong);

  var isEnterGame = this.handleEnterLeagueGame();
  if (!isEnterGame) {
    console.log("is not enter leagueMode game");
    this.stop();
    return;
  }
  console.log("handlePlayGame");
  var isPlayOk = this.handlePlayGame();
  console.log("isplayok:", isPlayOk);
  if (!isPlayOk) {
    this.stop();
  }
};

var mlb9i;
function start(jsonConfig) {
  var config = defaultConfig;
  if (typeof jsonConfig === "string") {
    config = JSON.parse(jsonConfig);
  } else if (typeof jsonConfig === "object") {
    config = jsonConfig;
  }

  mlb9i = new MLB9I(config);
  mlb9i.start();
}
function stop() {
  if (mlb9i === undefined) {
    return;
  }
  mlb9i.stop();
  mlb9i = undefined;
}

// ! remember to comment
// start();
// stop();
