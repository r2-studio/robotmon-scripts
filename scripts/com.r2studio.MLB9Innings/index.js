/* prettier-ignore */ !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.RF=t():e.RF=t()}(this,(function(){return function(){"use strict";var e={607:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,n(r(850),t),n(r(985),t),n(r(837),t),n(r(459),t),n(r(231),t),n(r(200),t),n(r(656),t),n(r(708),t),n(r(974),t),t.version=1},850:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.GroupPage=void 0;var r=function(){function e(e,t){this.name=e,this.pages=t}return e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=[],o=0,n=this.pages;o<n.length;o++){var i=n[o];i.isMatchImage(e,t)&&r.push(i.name)}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingOne=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": "+this.pages.map((function(e){return e.name})).join(","));for(var s=Date.now(),a="",c=0;Date.now()-s<r;){for(var f=t.getCvtDevScreenshot(),m=0,h=this.pages;m<h.length;m++){var g=h[m];if(g.isMatchImage(f,i)){a!==g.name&&(a=g.name,c=0),c++;break}}if(releaseImage(f),""!==a&&c>=o)break;sleep(n)}return e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": matched: "+a+", usedTime "+(Date.now()-s)),a},e.debug=!1,e}();t.GroupPage=r},985:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Page=void 0;var o=r(656),n=function(){function e(e,t,r,o){void 0===r&&(r=void 0),void 0===o&&(o=void 0),this.name=e,this.points=t,this.next=r,this.back=o}return e.prototype.goNext=function(t){void 0!==this.next?t.tap(this.next):e.debug&&console.log("Warning Page: "+this.name+" has no next xy")},e.prototype.goBack=function(t){void 0!==this.back?t.tap(this.back):e.debug&&console.log("Warning Page: "+this.name+" has no back xy")},e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=!0,n=0,i=this.points;n<i.length;n++){var s=i[n],a=getImageColor(e,s.x,s.y);if(o.Colors.identityColor(s,a)<t){r=!1;break}}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingScreen=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name);for(var s=Date.now(),a=0;Date.now()-s<r&&(this.isMatchScreen(t,i)&&a++,!(a>=o));)sleep(n);return a>=o?(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" success, usedTime "+(Date.now()-s)),!0):(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" timeout"),!1)},e.debug=!1,e}();t.Page=n},837:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.XYRGB=void 0;t.XYRGB=function(){this.x=0,this.y=0,this.r=0,this.g=0,this.b=0}},459:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;var o=r(656),n=function(){function e(e){this.config=e;var t=getScreenSize();this.config.deviceHeight=t.height,this.config.deviceWidth=t.width,this.config.screenWidth=t.width,this.config.screenHeight=t.height,this.config.screenOffsetX=0,this.config.screenOffsetY=0}return e.prototype.calculateDeviceOffset=function(e){var t=e(this);this.config.screenWidth=t.screenWidth,this.config.screenHeight=t.screenHeight,this.config.screenOffsetX=t.screenOffsetX,this.config.screenOffsetY=t.screenOffsetY},e.prototype.getScreenX=function(e){return Math.floor(this.config.screenOffsetX+e*this.config.screenWidth/this.config.devWidth)||0},e.prototype.getScreenY=function(e){return Math.floor(this.config.screenOffsetY+e*this.config.screenHeight/this.config.devHeight)||0},e.prototype.getScreenXY=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e)return{x:this.getScreenX(e.x),y:this.getScreenY(e.y)};if("number"==typeof e&&"number"==typeof t)return{x:this.getScreenX(e),y:this.getScreenY(t)};throw new Error("getScreenXY wrong params "+e+", "+t)},e.prototype.tap=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tap(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tap(r,o,this.config.actionDuring)}},e.prototype.tapDown=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapDown(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapDown(r,o,this.config.actionDuring)}},e.prototype.moveTo=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);moveTo(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),moveTo(r,o,this.config.actionDuring)}},e.prototype.tapUp=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapUp(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapUp(r,o,this.config.actionDuring)}},e.prototype.getScreenColor=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getCvtDevScreenshot(),o=getImageColor(r,e.x,e.y);return releaseImage(r),o}if("number"==typeof e&&"number"==typeof t)return r=this.getCvtDevScreenshot(),o=getImageColor(r,e,t),releaseImage(r),o;throw new Error("tapDown wrong params "+e+", "+t)},e.prototype.findImage=function(e){var t=this.getCvtDevScreenshot(),r=findImage(t,e);return releaseImage(t),r},e.prototype.tapImage=function(e){var t=this.findImage(e);this.tap(t)},e.prototype.isSameColor=function(e,t){void 0===t&&(t=.9);var r=this.getScreenColor(e);return o.Colors.identityColor(r,e)>t},e.prototype.getDeviceScreenshot=function(){return getScreenshot()},e.prototype.getScreenScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.screenWidth,this.config.screenHeight,100)},e.prototype.getCvtDevScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.devWidth,this.config.devHeight,100)},e.prototype.setActionDuring=function(e){this.config.actionDuring=e},e.debug=!1,e}();t.Screen=n},231:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenConfig=void 0;t.ScreenConfig=function(){this.devWidth=640,this.devHeight=360,this.deviceWidth=0,this.deviceHeight=0,this.screenWidth=0,this.screenHeight=0,this.screenOffsetX=0,this.screenOffsetY=0,this.actionDuring=180}},200:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.TaskManager=t.Task=void 0;var o=r(974),n=function(){this.name="",this.runTimes=1,this.maxRunningDuring=0,this.minIntervalDuring=0,this.lastRunDoneTime=0,this.run=function(){}};t.Task=n;var i=function(){function e(){this.isRunning=!1,this.runIdx=0,this.tasks=[]}return e.prototype.addTask=function(e,t,r,o,i){void 0===r&&(r=1),void 0===o&&(o=0),void 0===i&&(i=0);var s=new n;s.name=e,s.run=t,s.runTimes=r,s.maxRunningDuring=o,s.minIntervalDuring=i,this.tasks.push(s)},e.prototype.start=function(){if(0===this.tasks.length)throw new Error("TaskManager: No tasks to run");for(console.log("TaskManager start"),this.isRunning=!0;this.isRunning;){var e=Date.now(),t=this.tasks[this.runIdx%this.tasks.length];if(this.runIdx++,!(e-t.lastRunDoneTime<t.minIntervalDuring)){console.log("RunTask "+this.runIdx+" "+t.name+", times "+t.runTimes+", maxDuring "+t.maxRunningDuring);for(var r=0;this.isRunning&&(console.log("TaskRunning "+t.name+", times "+r+"/"+t.runTimes),t.run(),t.lastRunDoneTime=Date.now(),r++,!(0!==t.runTimes&&r>=t.runTimes))&&!(Date.now()-e>t.maxRunningDuring);)sleep(100)}}},e.prototype.stop=function(){this.isRunning=!1,o.Utils.sleep(1e3),console.log("TaskManager stop")},e}();t.TaskManager=i},656:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Colors=void 0;var r=function(){function e(){}return e.getRangeColor=function(e,t,r,o,n){void 0===n&&(n=5);var i=!1;void 0===e&&(i=!0,e=getScreenshot());for(var s=getImageSize(e),a=Math.max(0,t-o),c=Math.max(0,r-o),f=Math.min(s.width,t+o),m=Math.min(s.height,r+o),h=Math.max(1,(f-a)/n),g=Math.max(1,(m-c)/n),u=0,p={r:0,g:0,b:0},y=a;y<f;y+=h)for(var v=c;v<m;v+=g){var l=getImageColor(e,Math.floor(y),Math.floor(v));p.r+=l.r,p.g+=l.g,p.b+=l.b,u++}return i&&releaseImage(e),{r:Math.floor(p.r/u),g:Math.floor(p.g/u),b:Math.floor(p.b/u)}},e.color2hex=function(e){return((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},e.hex2Color=function(e){return{r:parseInt(e[0]+e[1],16),g:parseInt(e[2]+e[3],16),b:parseInt(e[4]+e[5],16)}},e.identityColor=function(e,t){var r=(e.r+t.r)/2,o=e.r-t.r,n=e.g-t.g,i=e.b-t.b;return 1-Math.sqrt(((512+r)*o*o>>8)+4*n*n+((767-r)*i*i>>8))/768},e}();t.Colors=r},708:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.OCR=void 0;var r=function(){function e(e){this.words=e}return e.prototype.recognize=function(e,t,r,o){void 0===o&&(o=.8);for(var n=0,i=[],s=0;s<this.words.length;s++){var a=this.words[s],c=getImageSize(a.img);n=Math.max(n,c.width);var f=findImages(e,a.img,r,t,!0);for(var m in f){var h=f[m];i.push({char:a.char,x:h.x,y:h.y,score:h.score,w:c.width})}}i.sort((function(e,t){return e.x-t.x}));for(var g="",u=0,p=0,y=0;y<i.length;y++){var v=i[y];v.x>u?(p=v.score,g+=v.char,u=Math.floor(v.x+v.w*o)):v.x<=u&&v.score>p&&" "!==v.char&&(p=v.score,g=g.substr(0,g.length-1)+v.char,u=Math.floor(v.x+v.w*o))}return g},e}();t.OCR=r},974:function(e,t){var r=this&&this.__spreadArray||function(e,t){for(var r=0,o=t.length,n=e.length;r<o;r++,n++)e[n]=t[r];return e};Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.log=void 0,t.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=(new Date).toLocaleString("en-US",{timeZone:"Asia/Taipei"}),o="["+r+"] ",n=0,i=e;n<i.length;n++){var s=i[n];o+="object"==typeof s?JSON.stringify(s)+" ":s+" "}console.log(o.substr(0,o.length-1))};var o=function(){function e(){}return e.sortStringNumberMap=function(e){var t=[];for(var r in e)t.push({key:r,count:e[r]});return t.sort((function(e,t){return t.count-e.count})),t},e.sleep=function(e){for(;e>200;)e-=200,sleep(200);e>0&&sleep(e)},e.getTaiwanTime=function(){return Date.now()+288e5},e.log=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var n=0;n<t.length;n++){var i=t[n];"object"==typeof i&&(t[n]=JSON.stringify(i))}var s=new Date(e.getTaiwanTime()),a="["+(s.getMonth()+1)+"-"+s.getDate()+"T"+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+"]";console.log.apply(console,r([a],t))},e.notifyEvent=function(t,r){null!=sendEvent&&(e.log("sendEvent",t,r),sendEvent(""+t,""+r))},e.startApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n "+e)},e.stopApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop "+e)},e.getCurrentApp=function(){for(var e="",t="",r=0,o=execute("dumpsys activity top").split("\n");r<o.length;r++){var n=o[r],i=n.indexOf("ACTIVITY");if(-1!==i){e="",t="";for(var s=!0,a=i+9;a<n.length;a++){var c=n[a];if(" "===c)break;"/"===c?s=!1:s?e+=c:t+=c}}}return[e,t]},e}();t.Utils=o}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(607)}()}));

var versionCode = 14.1;
var gLeagueYearMin = 2022;

var gSleepShort = 1500;
var gSleepMedium = 3000;
var gSleepLong = 4000;
var gSleepWaitPageLong = 24 * 1000;
var gSleepForAd = 30 * 1000;
var gMinuteInMs = 60 * 1000;
var gHourInMs = gMinuteInMs * 60;
var gDayInMs = gHourInMs * 24;
var gDuringMaxAdRetry = 2 * gMinuteInMs;

var defaultConfig = {
  isXr: true, // hidden setting
  isDev: false, // hidden, only for debug
  leagueSeasonMode: "full", // half, quarter, postSeason
  leagueYear: gLeagueYearMin, //gLeagueYearMin, // number
};

var gLogoPage = new RF.Page(
  "gLogoPage",
  [
    { x: 227, y: 184, r: 228, g: 4, b: 33 },
    { x: 258, y: 187, r: 228, g: 4, b: 33 },
    { x: 278, y: 190, r: 232, g: 48, b: 72 },
    { x: 285, y: 183, r: 254, g: 254, b: 254 },
    { x: 301, y: 172, r: 229, g: 19, b: 46 },
    { x: 316, y: 187, r: 254, g: 254, b: 254 },
    { x: 335, y: 188, r: 228, g: 4, b: 33 },
    { x: 372, y: 188, r: 252, g: 233, b: 235 },
    { x: 375, y: 169, r: 228, g: 4, b: 33 },
    { x: 395, y: 184, r: 254, g: 254, b: 254 },
    { x: 398, y: 170, r: 228, g: 4, b: 33 },
    { x: 403, y: 186, r: 254, g: 254, b: 254 },
    { x: 117, y: 114, r: 254, g: 254, b: 254 },

    // loading on left top if stuck
    // { x: 2, y: 5, r: 142, g: 208, b: 202 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gLandingPage = new RF.Page(
  "gLandingPage",
  [
    { x: 24, y: 20, r: 99, g: 101, b: 115 },
    { x: 68, y: 78, r: 24, g: 28, b: 40 },
    { x: 120, y: 136, r: 120, g: 128, b: 155 },
    { x: 136, y: 137, r: 255, g: 255, b: 255 },
    { x: 150, y: 136, r: 255, g: 255, b: 255 },
    { x: 175, y: 135, r: 255, g: 255, b: 255 },
    { x: 184, y: 135, r: 113, g: 111, b: 131 },
    { x: 204, y: 133, r: 177, g: 177, b: 188 },
    { x: 15, y: 332, r: 0, g: 28, b: 66 },
    { x: 24, y: 335, r: 255, g: 255, b: 255 },
    { x: 29, y: 329, r: 226, g: 227, b: 234 },
    { x: 66, y: 329, r: 198, g: 190, b: 181 },
    { x: 258, y: 330, r: 33, g: 46, b: 74 },
    { x: 612, y: 339, r: 41, g: 56, b: 90 },
    { x: 548, y: 42, r: 186, g: 144, b: 143 },
    { x: 587, y: 53, r: 70, g: 95, b: 133 },
    { x: 621, y: 108, r: 107, g: 87, b: 90 },
    { x: 40, y: 171, r: 177, g: 186, b: 194 },
    { x: 105, y: 169, r: 24, g: 48, b: 82 },
    { x: 143, y: 178, r: 255, g: 255, b: 255 },
    { x: 195, y: 171, r: 83, g: 92, b: 116 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

// TODO: handle login
var gLogInPage = new RF.Page(
  "gLogInPage",
  [
    { x: 226, y: 76, r: 48, g: 48, b: 48 },
    { x: 322, y: 78, r: 48, g: 48, b: 48 },
    { x: 535, y: 42, r: 48, g: 48, b: 48 },
    { x: 624, y: 40, r: 255, g: 255, b: 255 },
    { x: 66, y: 333, r: 238, g: 238, b: 238 },
    { x: 44, y: 235, r: 238, g: 238, b: 238 },
    { x: 136, y: 236, r: 238, g: 238, b: 238 },
    { x: 258, y: 232, r: 143, g: 186, b: 227 },
    { x: 548, y: 169, r: 43, g: 132, b: 216 },
    { x: 583, y: 195, r: 43, g: 132, b: 216 },
    { x: 43, y: 142, r: 255, g: 255, b: 255 },
    { x: 43, y: 195, r: 255, g: 255, b: 255 },
  ],
  { x: 554, y: 177 }, // login
  { x: 0, y: 0 }
);

var gDownloadDataPage = new RF.Page(
  "gDownloadDataPage",
  [
    { x: 103, y: 41, r: 181, g: 186, b: 189 },
    { x: 167, y: 59, r: 22, g: 30, b: 31 },
    { x: 188, y: 58, r: 39, g: 47, b: 47 },
    { x: 200, y: 59, r: 181, g: 186, b: 189 },
    { x: 209, y: 62, r: 84, g: 88, b: 92 },
    { x: 236, y: 58, r: 50, g: 56, b: 58 },
    { x: 243, y: 58, r: 144, g: 150, b: 152 },
    { x: 290, y: 57, r: 181, g: 186, b: 189 },
    { x: 317, y: 58, r: 16, g: 24, b: 24 },
    { x: 355, y: 54, r: 97, g: 101, b: 105 },
    { x: 407, y: 60, r: 16, g: 24, b: 24 },
    { x: 513, y: 48, r: 181, g: 182, b: 188 },
    { x: 527, y: 54, r: 177, g: 175, b: 177 },
    { x: 519, y: 60, r: 181, g: 185, b: 189 },
    { x: 168, y: 298, r: 222, g: 219, b: 222 },
    { x: 224, y: 296, r: 49, g: 85, b: 123 },
    { x: 249, y: 298, r: 102, g: 133, b: 171 },
    { x: 391, y: 299, r: 195, g: 221, b: 255 },
    { x: 461, y: 302, r: 222, g: 219, b: 222 },
    { x: 423, y: 303, r: 8, g: 109, b: 255 },
    { x: 526, y: 318, r: 222, g: 219, b: 222 },
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
  adTab: { x: 590, y: 77 },
  achievement: { x: 141, y: 323 },
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
  "gEndSeasonPage",
  [
    // bg
    { x: 15, y: 43, r: 0, g: 73, b: 140 },
    { x: 18, y: 126, r: 16, g: 40, b: 49 },
    { x: 19, y: 328, r: 16, g: 20, b: 8 },
    { x: 616, y: 42, r: 0, g: 73, b: 140 },
    { x: 619, y: 181, r: 4, g: 10, b: 8 },
    { x: 621, y: 350, r: 8, g: 12, b: 8 },
    { x: 416, y: 330, r: 16, g: 20, b: 8 },
    { x: 227, y: 318, r: 16, g: 20, b: 8 },
    { x: 315, y: 229, r: 24, g: 27, b: 16 },
    { x: 317, y: 170, r: 4, g: 16, b: 16 },
    { x: 315, y: 110, r: 16, g: 44, b: 66 },
    { x: 155, y: 49, r: 0, g: 69, b: 132 },
    { x: 495, y: 55, r: 0, g: 65, b: 122 },

    // ok
    { x: 534, y: 323, r: 0, g: 113, b: 248 },
    { x: 559, y: 322, r: 242, g: 246, b: 255 },
    { x: 569, y: 328, r: 94, g: 155, b: 234 },
    { x: 606, y: 321, r: 0, g: 117, b: 255 },
    { x: 610, y: 335, r: 8, g: 105, b: 255 },
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
  prevYear: { x: 178, y: 156 },
  nextYear: { x: 455, y: 156 },
  submit: { x: 285, y: 303 },
};

// * BattleModePages
var gBattleModePanelPage = new RF.Page(
  "gBattleModePanelPage",
  [
    // nav bar right
    { x: 301, y: 5, r: 206, g: 214, b: 222 },
    { x: 313, y: 10, r: 229, g: 225, b: 229 },
    { x: 324, y: 7, r: 58, g: 97, b: 132 },
    { x: 388, y: 10, r: 238, g: 234, b: 238 },
    { x: 396, y: 6, r: 242, g: 240, b: 242 },
    { x: 492, y: 10, r: 246, g: 208, b: 45 },
    { x: 486, y: 4, r: 206, g: 214, b: 222 },
    { x: 598, y: 13, r: 104, g: 126, b: 153 },
    { x: 616, y: 12, r: 206, g: 214, b: 222 },

    // bg in bottom (top will shine)
    { x: 9, y: 346, r: 16, g: 28, b: 33 },
    { x: 623, y: 344, r: 16, g: 28, b: 33 },
    { x: 397, y: 342, r: 16, g: 28, b: 33 },

    // player helmet to diff gSelectLeagueGameAmountPage
    { x: 8, y: 121, r: 115, g: 44, b: 41 },

    // back
    { x: 25, y: 313, r: 206, g: 210, b: 214 },
    { x: 42, y: 320, r: 206, g: 210, b: 214 },
    { x: 31, y: 333, r: 206, g: 210, b: 214 },
  ],
  { x: 41, y: 320 }, // back
  { x: 41, y: 320 }
);
var gBattleModePanelPageBtns = {
  rankedBattle: { x: 287, y: 160 },
  friendBattle: { x: 287, y: 245 },
  powerRanking: { x: 526, y: 160 }, // unsure what is
  pvp: { x: 525, y: 245 },
};

var gRankedBattlePanelPage = new RF.Page(
  "gRankedBattlePanelPage",
  [
    // nav bar right part icon
    // sometimes nav bar will disappear
    // { x: 312, y: 9, r: 238, g: 234, b: 238 },
    // { x: 390, y: 12, r: 127, g: 128, b: 127 },
    // { x: 493, y: 13, r: 208, g: 189, b: 51 },
    // { x: 597, y: 13, r: 74, g: 93, b: 123 },

    // match list
    { x: 18, y: 60, r: 238, g: 235, b: 230 },
    { x: 39, y: 63, r: 234, g: 230, b: 226 },
    { x: 78, y: 63, r: 238, g: 235, b: 230 },
    { x: 100, y: 65, r: 238, g: 235, b: 230 },

    // ranked shop btn
    { x: 342, y: 321, r: 94, g: 52, b: 25 },
    { x: 379, y: 322, r: 219, g: 161, b: 85 },
    { x: 400, y: 322, r: 234, g: 193, b: 137 },

    // back
    { x: 24, y: 313, r: 200, g: 201, b: 198 },
    { x: 29, y: 331, r: 214, g: 218, b: 214 },
  ],
  { x: 557, y: 332 }, // play ball
  { x: 41, y: 320 }
);

var gRankedBattleResultPage = new RF.Page(
  "gRankedBattleResultPage",
  [
    // bg in mid
    { x: 10, y: 94, r: 58, g: 93, b: 140 },
    { x: 8, y: 248, r: 140, g: 158, b: 181 },
    { x: 624, y: 95, r: 58, g: 94, b: 140 },
    { x: 621, y: 246, r: 140, g: 158, b: 181 },
    { x: 336, y: 98, r: 58, g: 97, b: 140 },
    { x: 345, y: 255, r: 148, g: 162, b: 181 },

    // tier/ score / rank
    { x: 49, y: 127, r: 198, g: 203, b: 214 },
    { x: 59, y: 130, r: 196, g: 205, b: 212 },
    { x: 74, y: 133, r: 216, g: 221, b: 228 },
    { x: 101, y: 130, r: 85, g: 117, b: 153 },
    { x: 126, y: 126, r: 207, g: 216, b: 227 },
    { x: 168, y: 129, r: 233, g: 235, b: 238 },
    { x: 188, y: 132, r: 222, g: 229, b: 230 },

    // ok
    { x: 284, y: 296, r: 8, g: 118, b: 255 },
    { x: 330, y: 297, r: 8, g: 117, b: 255 },
    { x: 364, y: 306, r: 8, g: 101, b: 247 },
    { x: 317, y: 297, r: 229, g: 237, b: 250 },
  ],
  { x: 316, y: 310 }, // ok
  { x: 316, y: 310 }
);

// a page to start auto game
var gAutoGameConfirmPage = new RF.Page(
  "gAutoGameConfirmPage",
  [
    // title
    { x: 277, y: 60, r: 180, g: 186, b: 189 },
    { x: 295, y: 58, r: 16, g: 24, b: 33 },
    { x: 308, y: 61, r: 16, g: 24, b: 33 },
    { x: 328, y: 58, r: 177, g: 183, b: 185 },
    { x: 353, y: 61, r: 177, g: 182, b: 185 },

    // bg
    { x: 108, y: 49, r: 181, g: 186, b: 189 },
    { x: 107, y: 314, r: 214, g: 219, b: 222 },
    { x: 516, y: 302, r: 214, g: 219, b: 222 },
    { x: 491, y: 171, r: 181, g: 186, b: 189 },

    // x
    { x: 510, y: 48, r: 168, g: 173, b: 176 },
    { x: 516, y: 55, r: 103, g: 105, b: 109 },
    { x: 524, y: 48, r: 71, g: 70, b: 71 },

    // no and yes
    { x: 223, y: 298, r: 41, g: 77, b: 123 },
    { x: 248, y: 298, r: 158, g: 183, b: 214 },
    { x: 388, y: 299, r: 196, g: 223, b: 255 },
    { x: 430, y: 302, r: 8, g: 113, b: 247 },

    // content to diff with confirm end (you selected)
    { x: 286, y: 180, r: 82, g: 86, b: 94 },
    { x: 304, y: 178, r: 120, g: 128, b: 136 },
    { x: 324, y: 178, r: 95, g: 103, b: 112 },
  ],
  { x: 390, y: 304 }, // yes, start auto play
  { x: 237, y: 304 } // no, not start auto play
);

// a page to end auto game
var gAutoGameConfirmEndPage = new RF.Page(
  "gAutoGameConfirmEndPage",
  [
    // title
    { x: 277, y: 60, r: 180, g: 186, b: 189 },
    { x: 295, y: 58, r: 16, g: 24, b: 33 },
    { x: 308, y: 61, r: 16, g: 24, b: 33 },
    { x: 328, y: 58, r: 177, g: 183, b: 185 },
    { x: 353, y: 61, r: 177, g: 182, b: 185 },

    // bg
    { x: 108, y: 49, r: 181, g: 186, b: 189 },
    { x: 107, y: 314, r: 214, g: 219, b: 222 },
    { x: 516, y: 302, r: 214, g: 219, b: 222 },
    { x: 491, y: 171, r: 181, g: 186, b: 189 },

    // x
    { x: 510, y: 48, r: 168, g: 173, b: 176 },
    { x: 516, y: 55, r: 103, g: 105, b: 109 },
    { x: 524, y: 48, r: 71, g: 70, b: 71 },

    // no and yes
    { x: 223, y: 298, r: 41, g: 77, b: 123 },
    { x: 248, y: 298, r: 158, g: 183, b: 214 },
    { x: 388, y: 299, r: 196, g: 223, b: 255 },
    { x: 430, y: 302, r: 8, g: 113, b: 247 },

    // TODO: use end game content
  ],
  { x: 237, y: 304 }, // no, continue auto play
  { x: 390, y: 304 } // yes, end auto play
);

// * LeagueModePages
var gLeagueModePanelPageContinue = new RF.Page(
  "gLeagueModePanelPageNextSchedule", // same behaviour as gLeagueModePanelPageNextSchedule
  [
    // nav bar star
    { x: 314, y: 10, r: 231, g: 231, b: 231 },
    { x: 320, y: 8, r: 247, g: 243, b: 247 },
    { x: 392, y: 13, r: 168, g: 169, b: 168 },
    { x: 394, y: 9, r: 142, g: 144, b: 142 },
    { x: 620, y: 6, r: 214, g: 211, b: 214 },

    // button on bottom
    { x: 41, y: 323, r: 67, g: 71, b: 60 },
    { x: 81, y: 324, r: 118, g: 132, b: 156 },
    { x: 131, y: 325, r: 57, g: 91, b: 124 },
    { x: 167, y: 321, r: 122, g: 138, b: 156 },
    { x: 180, y: 327, r: 24, g: 69, b: 123 },
    { x: 254, y: 327, r: 255, g: 255, b: 255 },
    { x: 338, y: 322, r: 255, g: 255, b: 255 },
    { x: 351, y: 334, r: 24, g: 60, b: 107 },
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

var gLeagueModeNewGamePage = new RF.Page(
  "gLeagueModeNewGamePage",
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

// normal game play start
var gSelectPlayRoleBtns = {
  playOffenseOnly: { x: 128, y: 279 },
  playAll: { x: 317, y: 282 },
  playDeffenseOnly: { x: 506, y: 281 },
};

var gSelectPlayRole = new RF.Page(
  "gSelectPlayRole",
  [
    { x: 97, y: 282, r: 255, g: 255, b: 255 },
    { x: 145, y: 282, r: 255, g: 255, b: 255 },
    { x: 499, y: 282, r: 255, g: 255, b: 255 },
    { x: 539, y: 282, r: 255, g: 255, b: 255 },
    { x: 543, y: 282, r: 255, g: 255, b: 255 },
    { x: 563, y: 282, r: 255, g: 255, b: 255 },

    { x: 90, y: 110, r: 194, g: 82, b: 24 },
    { x: 552, y: 112, r: 57, g: 120, b: 197 },
  ],
  // TODO: make which role can be selected if need
  gSelectPlayRoleBtns.playAll,
  gSelectPlayRoleBtns.playAll
);

// sometimes happened when restarting a continued game
// or cancel auto play during playing
var gLeagueContinuePlayingPage = new RF.Page(
  "gLeagueContinuePlayingPage",
  [
    // fast progression
    { x: 452, y: 279, r: 8, g: 109, b: 255 },
    { x: 476, y: 279, r: 251, g: 252, b: 255 },
    { x: 502, y: 275, r: 190, g: 220, b: 255 },
    { x: 530, y: 279, r: 218, g: 233, b: 255 },
    { x: 552, y: 273, r: 8, g: 125, b: 255 },
    { x: 563, y: 276, r: 234, g: 244, b: 255 },
    { x: 579, y: 279, r: 8, g: 109, b: 255 },
    { x: 587, y: 273, r: 8, g: 125, b: 255 },
    // continue
    { x: 458, y: 320, r: 8, g: 109, b: 255 },
    { x: 480, y: 324, r: 122, g: 168, b: 247 },
    { x: 520, y: 317, r: 84, g: 159, b: 250 },
    { x: 544, y: 324, r: 226, g: 234, b: 252 },
    { x: 572, y: 319, r: 8, g: 113, b: 255 },
    { x: 591, y: 325, r: 0, g: 97, b: 247 },
  ],
  { x: 458, y: 320 }, // continue game
  { x: 458, y: 320 } // continue game
);

var gLeagueOnPlayPageAutoOff = new RF.Page(
  "gLeagueOnPlayPageAutoOff",
  [
    // auto
    { x: 514, y: 20, r: 255, g: 255, b: 255 },
    { x: 525, y: 21, r: 255, g: 255, b: 255 },
    // camera
    { x: 556, y: 21, r: 183, g: 185, b: 186 },
    { x: 560, y: 23, r: 197, g: 198, b: 197 },
    { x: 569, y: 21, r: 206, g: 207, b: 206 },
  ],
  { x: 511, y: 20 }, // switch to auto mode
  { x: 611, y: 20 } // pause button
);

var gLeagueOnPlayPageAutoOff1 = new RF.Page(
  "gLeagueOnPlayPageAutoOff",
  // has swing button
  [
    { x: 521, y: 263, r: 24, g: 29, b: 16 },
    { x: 520, y: 255, r: 213, g: 213, b: 212 },
    { x: 533, y: 255, r: 223, g: 221, b: 222 },
    { x: 514, y: 244, r: 16, g: 28, b: 16 },
  ],
  { x: 511, y: 20 }, // switch to auto mode
  { x: 611, y: 20 } // pause button
);

// auto play on, power save off
var gLeagueOnPlayPagePowerSaveOff = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOff",
  [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    { x: 492, y: 16, r: 101, g: 103, b: 101 },
    { x: 488, y: 22, r: 210, g: 208, b: 210 },
    { x: 481, y: 27, r: 102, g: 101, b: 101 },
    { x: 489, y: 29, r: 197, g: 197, b: 197 },
  ],
  { x: 485, y: 21 }, // turn on power save
  { x: 552, y: 21 } // turn off auto play
);

// same as gLeagueOnPlayPagePowerSaveOff, but is stopped
// need to turn on autoplay
var gLeagueOnPlayPagePowerSaveOffStopped = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOff",
  [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    { x: 492, y: 16, r: 101, g: 103, b: 101 },
    { x: 488, y: 22, r: 210, g: 208, b: 210 },
    { x: 481, y: 27, r: 102, g: 101, b: 101 },
    { x: 489, y: 29, r: 197, g: 197, b: 197 },

    // disabled autoplay text
    { x: 524, y: 23, r: 91, g: 110, b: 158 },
    { x: 530, y: 20, r: 140, g: 146, b: 152 },
    { x: 533, y: 24, r: 93, g: 106, b: 143 },
    { x: 550, y: 25, r: 85, g: 105, b: 153 },
    { x: 552, y: 21, r: 147, g: 153, b: 156 },
    { x: 557, y: 20, r: 148, g: 154, b: 156 },
    { x: 566, y: 24, r: 99, g: 121, b: 173 },
    { x: 575, y: 18, r: 107, g: 121, b: 173 },
    { x: 584, y: 19, r: 97, g: 122, b: 169 },
    { x: 589, y: 22, r: 118, g: 127, b: 149 },
    { x: 595, y: 18, r: 141, g: 150, b: 156 },
    { x: 606, y: 23, r: 74, g: 93, b: 132 },
  ],
  { x: 0, y: 0 }, // turn on auto play
  { x: 0, y: 0 } // turn on auto play
);

// don't do any thing, just avoid to enter unknown
var gLeagueOnPlayPagePowerSaveOffMid = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOff",
  [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },

    // dialog on
    { x: 604, y: 47, r: 170, g: 171, b: 170 },
    { x: 607, y: 49, r: 246, g: 246, b: 246 },
    { x: 611, y: 54, r: 213, g: 210, b: 213 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);
var gLeagueOnPlayPagePowerSaveOffMid1 = new RF.Page(
  "gLeagueOnPlayPagePowerSaveOff",
  [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },

    // dialog off
    { x: 605, y: 50, r: 95, g: 99, b: 97 },
    { x: 602, y: 51, r: 109, g: 114, b: 116 },
    { x: 603, y: 49, r: 131, g: 133, b: 131 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gOnPlayPagePowerSaveOn = new RF.Page(
  "gOnPlayPagePowerSaveOn",
  [
    { x: 304, y: 136, r: 156, g: 160, b: 165 },
    { x: 305, y: 136, r: 156, g: 160, b: 165 },
    { x: 306, y: 136, r: 156, g: 160, b: 165 },
    { x: 307, y: 136, r: 156, g: 160, b: 165 },
    { x: 308, y: 136, r: 156, g: 160, b: 165 },

    { x: 301, y: 133, r: 165, g: 162, b: 165 },
    { x: 302, y: 133, r: 165, g: 162, b: 165 },
    { x: 303, y: 133, r: 165, g: 162, b: 165 },
    { x: 304, y: 133, r: 165, g: 162, b: 165 },
    { x: 305, y: 133, r: 165, g: 162, b: 165 },
    { x: 36, y: 26, r: 0, g: 0, b: 0 },
    { x: 36, y: 326, r: 0, g: 0, b: 0 },
    { x: 613, y: 330, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    { x: 602, y: 27, r: 0, g: 0, b: 0 },
    { x: 174, y: 162, r: 0, g: 0, b: 0 },
    { x: 476, y: 158, r: 0, g: 0, b: 0 },
    // score bg
    { x: 497, y: 300, r: 16, g: 20, b: 16 },
    { x: 498, y: 300, r: 16, g: 20, b: 16 },
    { x: 499, y: 300, r: 16, g: 20, b: 16 },
    { x: 500, y: 300, r: 16, g: 20, b: 16 },
    { x: 501, y: 300, r: 16, g: 20, b: 16 },
    { x: 502, y: 300, r: 16, g: 20, b: 16 },
    { x: 503, y: 300, r: 16, g: 20, b: 16 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

// FIXME: change colors
var gOnQuickPlayPage = new RF.Page(
  "gOnQuickPlayPage",
  [
    // bg right panel
    { x: 456, y: 11, r: 58, g: 77, b: 123 },
    { x: 623, y: 10, r: 58, g: 73, b: 115 },
    { x: 457, y: 348, r: 33, g: 40, b: 58 },
    { x: 632, y: 350, r: 33, g: 40, b: 58 },

    // blue btn: play manually
    { x: 298, y: 321, r: 33, g: 131, b: 255 },
    { x: 311, y: 335, r: 158, g: 191, b: 235 },
    { x: 433, y: 334, r: 8, g: 57, b: 123 },
    { x: 433, y: 349, r: 0, g: 81, b: 238 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gOnQuickPlayPage1 = new RF.Page(
  "gOnQuickPlayPage", // same behaviour, without blue btn on right bottom
  [
    // bg right panel
    { x: 454, y: 8, r: 58, g: 77, b: 123 },
    { x: 455, y: 351, r: 33, g: 40, b: 58 },
    { x: 628, y: 348, r: 33, g: 40, b: 58 },
    { x: 627, y: 9, r: 58, g: 73, b: 115 },

    // diff from other page
    { x: 433, y: 324, r: 85, g: 107, b: 68 },
    { x: 433, y: 320, r: 83, g: 109, b: 66 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

// sometimes the quick play will be paused
var gOnQuickPlayPausePage = new RF.Page(
  "gOnQuickPlayPausePage",
  [
    { x: 456, y: 11, r: 49, g: 73, b: 123 },
    { x: 472, y: 22, r: 201, g: 207, b: 218 },
    { x: 532, y: 22, r: 81, g: 100, b: 128 },
    { x: 453, y: 347, r: 24, g: 36, b: 57 },
    { x: 306, y: 276, r: 8, g: 118, b: 255 },
    { x: 421, y: 283, r: 2, g: 105, b: 247 },
    { x: 325, y: 337, r: 0, g: 97, b: 247 },
    { x: 430, y: 336, r: 0, g: 97, b: 247 },
  ],
  { x: 376, y: 329 }, // play ball // TODO: might need to set inning
  { x: 376, y: 329 }
);

// when playing, press back
var gLeagueOnPlayPausePage = new RF.Page(
  "gLeagueOnPlayPausePage",
  [
    // continue button
    { x: 89, y: 148, r: 255, g: 255, b: 255 },
    { x: 99, y: 138, r: 82, g: 89, b: 99 },
    // leave button
    { x: 527, y: 165, r: 255, g: 255, b: 255 },
    { x: 555, y: 153, r: 255, g: 255, b: 255 },
    // mlb logo
    { x: 554, y: 291, r: 0, g: 28, b: 57 },
    { x: 563, y: 294, r: 255, g: 255, b: 255 },
    { x: 565, y: 290, r: 30, g: 54, b: 88 },
  ],
  { x: 89, y: 148 }, // continue game
  { x: 527, y: 165 } // leave
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

var gBestPositionAwardBonusPage = new RF.Page(
  "gBestPositionAwardBonusPage",
  [
    // bg
    { x: 141, y: 21, r: 0, g: 81, b: 148 },
    { x: 609, y: 26, r: 0, g: 81, b: 148 },
    { x: 26, y: 335, r: 16, g: 24, b: 24 },
    { x: 626, y: 339, r: 16, g: 24, b: 24 },
    { x: 4, y: 148, r: 8, g: 24, b: 33 },
    { x: 628, y: 140, r: 16, g: 32, b: 49 },

    // team 1 being selected
    { x: 173, y: 18, r: 0, g: 117, b: 255 },
    { x: 176, y: 30, r: 158, g: 173, b: 199 },
    { x: 184, y: 36, r: 8, g: 105, b: 255 },

    // team 2 not being selected
    { x: 328, y: 27, r: 49, g: 85, b: 123 },
    { x: 337, y: 31, r: 16, g: 48, b: 82 },
    { x: 343, y: 37, r: 41, g: 77, b: 115 },

    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
  ],
  { x: 570, y: 325 },
  { x: 570, y: 325 }
);

var gBestPositionAwardBonusPage2 = new RF.Page(
  "gBestPositionAwardBonusPage",
  [
    // bg
    { x: 141, y: 21, r: 0, g: 81, b: 148 },
    { x: 609, y: 26, r: 0, g: 81, b: 148 },
    { x: 26, y: 335, r: 16, g: 24, b: 24 },
    { x: 626, y: 339, r: 16, g: 24, b: 24 },
    { x: 4, y: 148, r: 8, g: 24, b: 33 },
    { x: 628, y: 140, r: 16, g: 32, b: 49 },

    // team 1 not being selected
    { x: 189, y: 22, r: 49, g: 85, b: 123 },
    { x: 178, y: 34, r: 8, g: 48, b: 82 },
    { x: 169, y: 39, r: 41, g: 77, b: 115 },

    // team 2 being selected
    { x: 343, y: 21, r: 2, g: 117, b: 255 },
    { x: 337, y: 31, r: 163, g: 170, b: 197 },
    { x: 331, y: 40, r: 8, g: 97, b: 255 },

    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
  ],
  { x: 570, y: 325 },
  { x: 570, y: 325 }
);

// next page of gBestPositionAwardBonusPage
var gBonusGrantedByTeamRecordPage = new RF.Page(
  "gBonusGrantedByTeamRecordPage",
  [
    // table bg
    { x: 38, y: 75, r: 49, g: 69, b: 107 },
    { x: 600, y: 73, r: 49, g: 69, b: 107 },
    { x: 601, y: 289, r: 0, g: 8, b: 16 },
    { x: 28, y: 285, r: 8, g: 12, b: 16 },

    // title
    { x: 176, y: 76, r: 49, g: 68, b: 107 },
    { x: 217, y: 77, r: 128, g: 136, b: 159 },
    { x: 255, y: 76, r: 131, g: 137, b: 157 },
    { x: 278, y: 76, r: 78, g: 95, b: 128 },
    { x: 324, y: 77, r: 113, g: 122, b: 150 },
    { x: 362, y: 75, r: 46, g: 66, b: 104 },
    { x: 405, y: 77, r: 178, g: 185, b: 206 },
    { x: 425, y: 72, r: 184, g: 187, b: 206 },
    { x: 439, y: 77, r: 53, g: 70, b: 110 },

    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
  ],
  { x: 570, y: 325 },
  { x: 570, y: 325 }
);

var gPostSeasonAwardBonusPage = new RF.Page(
  "gPostSeasonAwardBonusPage",
  [
    // bg
    { x: 39, y: 24, r: 0, g: 81, b: 148 },
    { x: 320, y: 15, r: 0, g: 85, b: 165 },
    { x: 615, y: 23, r: 0, g: 81, b: 148 },
    { x: 11, y: 268, r: 16, g: 28, b: 33 },
    { x: 621, y: 258, r: 16, g: 28, b: 33 },
    { x: 624, y: 351, r: 16, g: 24, b: 24 },
    { x: 17, y: 338, r: 16, g: 24, b: 24 },
    { x: 316, y: 342, r: 16, g: 24, b: 24 },

    // ok
    { x: 531, y: 318, r: 0, g: 117, b: 255 },
    { x: 564, y: 323, r: 218, g: 234, b: 254 },
    { x: 577, y: 323, r: 255, g: 255, b: 255 },
    { x: 608, y: 318, r: 0, g: 117, b: 255 },
    { x: 606, y: 331, r: 8, g: 105, b: 255 },
  ],
  { x: 570, y: 325 },
  { x: 570, y: 325 }
);

var gGameLineUpPage = new RF.Page(
  "gGameLineUpPage",
  [
    // content top bg
    { x: 591, y: 59, r: 49, g: 73, b: 107 },
    // progress bg
    { x: 19, y: 211, r: 24, g: 32, b: 49 },
    // battle lineup button in bottom
    { x: 536, y: 322, r: 41, g: 81, b: 137 },
    { x: 553, y: 322, r: 188, g: 209, b: 224 },
    { x: 568, y: 322, r: 204, g: 220, b: 234 },
    { x: 585, y: 324, r: 107, g: 139, b: 177 },
    { x: 604, y: 324, r: 25, g: 73, b: 132 },
    // back
    { x: 26, y: 314, r: 214, g: 219, b: 214 },
    { x: 43, y: 321, r: 214, g: 219, b: 214 },
    { x: 36, y: 329, r: 211, g: 216, b: 210 },
  ],
  { x: 40, y: 324 },
  { x: 40, y: 324 }
);

var gPlayerGrowthCompeletePage = new RF.Page(
  "gPlayerGrowthCompeletePage",
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
    // bg
    { x: 4, y: 6, r: 0, g: 97, b: 189 },
    { x: 11, y: 346, r: 16, g: 16, b: 8 },
    { x: 7, y: 350, r: 16, g: 20, b: 16 },

    // title
    { x: 191, y: 29, r: 146, g: 180, b: 211 },
    { x: 223, y: 27, r: 234, g: 241, b: 248 },
    { x: 287, y: 22, r: 24, g: 103, b: 170 },
    { x: 357, y: 29, r: 234, g: 241, b: 247 },
    { x: 426, y: 29, r: 13, g: 94, b: 162 },
    { x: 456, y: 31, r: 8, g: 85, b: 156 },
    { x: 223, y: 26, r: 239, g: 244, b: 250 },
  ],
  { x: 568, y: 320 },
  { x: 568, y: 320 }
);
// TODO: check the position, must be bg of 'diamond', 'gold' ...
// bg of the word
// ref: https://www.facebook.com/mlb9innings/photos/1366596103748570
var gSelectRewardPlayerPageBtns = {
  leftCard: { x: 66, y: 217 },
  midCard: { x: 221, y: 217 },
  rightCard: { x: 377, y: 217 },
};
// only include basic types
// {r}-{g}-{b}: prority
// try x 23, y 260 in player info
var gPlayerCardColorToRank = {
  "66-74-74": 1, // normal TODO: unknown color
  "99-65-41": 2, // brown
  "99-65-49": 2, // brown
  "132-129-148": 3, // silver
  "189-166-49": 4, // gold
  "189-166-58": 4, // gold
  "198-170-57": 4, // gold
  "148-101-25": 4, // gold
  "165-166-90": 4, // gold
  "41-69-107": 5, // diamond TODO: unknown color
};

// adReward pages
var gAdRewardPage = new RF.Page(
  "gAdRewardPage",
  [
    // title
    { x: 248, y: 41, r: 181, g: 186, b: 189 },
    { x: 278, y: 48, r: 16, g: 24, b: 24 },
    { x: 307, y: 49, r: 20, g: 26, b: 28 },
    { x: 357, y: 49, r: 155, g: 161, b: 164 },
    { x: 397, y: 41, r: 181, g: 186, b: 189 },

    // watch ad
    { x: 342, y: 299, r: 49, g: 166, b: 90 },
    { x: 365, y: 303, r: 211, g: 236, b: 241 },
    { x: 413, y: 305, r: 255, g: 255, b: 255 },
    { x: 448, y: 305, r: 49, g: 158, b: 90 },
    { x: 466, y: 312, r: 41, g: 150, b: 82 },

    // cancel
    { x: 187, y: 304, r: 8, g: 114, b: 255 },
    { x: 232, y: 303, r: 197, g: 223, b: 255 },
    { x: 280, y: 308, r: 8, g: 109, b: 247 },
  ],
  { x: 404, y: 310 },
  { x: 117, y: 308 }
);

var gAdRewardRedeemPage = new RF.Page(
  "gAdRewardRedeemPage",
  [
    // title
    { x: 248, y: 41, r: 181, g: 186, b: 189 },
    { x: 278, y: 48, r: 16, g: 24, b: 24 },
    { x: 307, y: 49, r: 20, g: 26, b: 28 },
    { x: 357, y: 49, r: 155, g: 161, b: 164 },
    { x: 397, y: 41, r: 181, g: 186, b: 189 },

    // ok
    { x: 301, y: 310, r: 8, g: 109, b: 247 },
    { x: 319, y: 307, r: 19, g: 117, b: 244 },
    { x: 349, y: 307, r: 8, g: 113, b: 255 },
  ],
  { x: 303, y: 304 },
  { x: 303, y: 304 }
);

var gAdRewardOnCDPage = new RF.Page(
  "gAdRewardOnCDPage",
  [
    // title
    { x: 249, y: 53, r: 181, g: 186, b: 189 },
    { x: 270, y: 65, r: 16, g: 24, b: 24 },
    { x: 329, y: 63, r: 181, g: 186, b: 189 },
    { x: 367, y: 56, r: 79, g: 84, b: 87 },

    // x
    { x: 516, y: 48, r: 142, g: 140, b: 143 },
    { x: 522, y: 57, r: 186, g: 185, b: 188 },
    { x: 522, y: 45, r: 188, g: 186, b: 189 },

    // ok
    { x: 282, y: 299, r: 8, g: 118, b: 255 },
    { x: 317, y: 297, r: 115, g: 178, b: 255 },
    { x: 413, y: 303, r: 222, g: 219, b: 222 },
    { x: 364, y: 305, r: 1, g: 105, b: 248 },
  ],
  { x: 516, y: 48 },
  { x: 516, y: 48 }
);

// weekly mission pages
var gAchivementMissionPage = new RF.Page(
  "gAchivementMissionPage",
  [
    // nav bar right part (p, star ...)
    { x: 299, y: 13, r: 214, g: 214, b: 214 },
    { x: 318, y: 9, r: 238, g: 234, b: 238 },
    { x: 313, y: 9, r: 238, g: 234, b: 238 },
    { x: 392, y: 9, r: 232, g: 229, b: 232 },
    { x: 385, y: 2, r: 214, g: 214, b: 214 },
    { x: 496, y: 13, r: 238, g: 166, b: 16 },
    { x: 483, y: 4, r: 214, g: 219, b: 216 },
    { x: 597, y: 10, r: 213, g: 226, b: 238 },
    { x: 628, y: 14, r: 214, g: 211, b: 214 },

    // today's mission
    { x: 236, y: 65, r: 214, g: 214, b: 222 },
    { x: 246, y: 63, r: 214, g: 214, b: 222 },
    { x: 295, y: 64, r: 66, g: 71, b: 82 },
    { x: 343, y: 63, r: 214, g: 214, b: 222 },

    // complete weekly mission box
    { x: 233, y: 262, r: 230, g: 231, b: 230 },
    { x: 247, y: 269, r: 41, g: 51, b: 63 },
    { x: 257, y: 284, r: 181, g: 182, b: 189 },
    { x: 510, y: 290, r: 230, g: 231, b: 238 },

    // back btn
    { x: 24, y: 314, r: 214, g: 214, b: 214 },
    { x: 42, y: 317, r: 214, g: 219, b: 214 },
    { x: 31, y: 331, r: 214, g: 219, b: 214 },
  ],
  { x: 580, y: 278 }, // complete weekly mission box
  { x: 41, y: 320 }
);

var gWeeklyMissionBoxPage = new RF.Page(
  "gWeeklyMissionBoxPage",
  [
    // nav bar right part (p, star ...)
    { x: 299, y: 13, r: 214, g: 214, b: 214 },
    { x: 318, y: 9, r: 238, g: 234, b: 238 },
    { x: 313, y: 9, r: 238, g: 234, b: 238 },
    { x: 392, y: 9, r: 232, g: 229, b: 232 },
    { x: 385, y: 2, r: 214, g: 214, b: 214 },
    { x: 496, y: 13, r: 238, g: 166, b: 16 },
    { x: 483, y: 4, r: 214, g: 219, b: 216 },
    { x: 597, y: 10, r: 213, g: 226, b: 238 },
    { x: 628, y: 14, r: 214, g: 211, b: 214 },

    // bg of table
    { x: 14, y: 82, r: 33, g: 32, b: 41 },
    { x: 16, y: 288, r: 33, g: 44, b: 58 },
    { x: 615, y: 100, r: 33, g: 36, b: 41 },
    { x: 613, y: 283, r: 33, g: 44, b: 58 },

    // back btn
    { x: 24, y: 314, r: 214, g: 214, b: 214 },
    { x: 42, y: 317, r: 214, g: 219, b: 214 },
    { x: 31, y: 331, r: 214, g: 219, b: 214 },
  ],
  { x: 41, y: 320 }, // back btn
  { x: 41, y: 320 }
);

var gWeeklyMissionBoxPageBtns = {
  openBox: { x: 418, y: 325 },
  receiveReward: { x: 561, y: 326 },
};

var gWeeklyMissionBoxConfirmPage = new RF.Page(
  "gWeeklyMissionBoxConfirmPage",
  [
    // bg
    { x: 111, y: 42, r: 181, g: 186, b: 189 },
    { x: 117, y: 304, r: 214, g: 219, b: 222 },
    { x: 515, y: 300, r: 214, g: 219, b: 222 },
    { x: 519, y: 177, r: 181, g: 186, b: 189 },

    // title
    { x: 240, y: 58, r: 155, g: 160, b: 163 },
    { x: 267, y: 58, r: 141, g: 147, b: 149 },
    { x: 325, y: 59, r: 161, g: 167, b: 170 },
    { x: 383, y: 59, r: 171, g: 179, b: 179 },
    { x: 407, y: 59, r: 181, g: 186, b: 189 },

    // x
    { x: 515, y: 49, r: 187, g: 185, b: 188 },
    { x: 519, y: 55, r: 91, g: 91, b: 92 },

    // no & yes btn
    { x: 210, y: 293, r: 41, g: 81, b: 123 },
    { x: 238, y: 296, r: 45, g: 81, b: 128 },
    { x: 284, y: 294, r: 41, g: 78, b: 123 },

    { x: 397, y: 299, r: 40, g: 134, b: 253 },
    { x: 433, y: 307, r: 8, g: 98, b: 247 },
  ],
  { x: 387, y: 300 }, // yes btn
  { x: 387, y: 300 }
);

var gWeeklyMissionBoxRecievedPage = new RF.Page(
  "gWeeklyMissionBoxRecievedPage",
  [
    // bg
    { x: 113, y: 53, r: 181, g: 186, b: 189 },
    { x: 117, y: 307, r: 214, g: 219, b: 222 },
    { x: 496, y: 299, r: 214, g: 219, b: 222 },

    // title
    { x: 217, y: 55, r: 181, g: 186, b: 189 },
    { x: 259, y: 55, r: 177, g: 181, b: 185 },
    { x: 298, y: 59, r: 181, g: 186, b: 189 },
    { x: 341, y: 60, r: 120, g: 124, b: 128 },
    { x: 386, y: 58, r: 16, g: 24, b: 33 },
    { x: 407, y: 58, r: 181, g: 186, b: 189 },

    // x
    { x: 512, y: 47, r: 181, g: 186, b: 182 },
    { x: 519, y: 53, r: 71, g: 70, b: 71 },

    // ok btn
    { x: 288, y: 297, r: 8, g: 122, b: 255 },
    { x: 320, y: 300, r: 136, g: 190, b: 255 },
    { x: 364, y: 301, r: 8, g: 114, b: 248 },
  ],
  { x: 320, y: 300 }, // ok btn
  { x: 320, y: 300 }
);

// general pages
var gPowerSavingPage = new RF.Page(
  "gPowerSavingPage",
  [
    { x: 304, y: 136, r: 156, g: 160, b: 165 },
    { x: 305, y: 136, r: 156, g: 160, b: 165 },
    { x: 306, y: 136, r: 156, g: 160, b: 165 },
    { x: 307, y: 136, r: 156, g: 160, b: 165 },
    { x: 308, y: 136, r: 156, g: 160, b: 165 },

    { x: 301, y: 133, r: 165, g: 162, b: 165 },
    { x: 302, y: 133, r: 165, g: 162, b: 165 },
    { x: 303, y: 133, r: 165, g: 162, b: 165 },
    { x: 304, y: 133, r: 165, g: 162, b: 165 },
    { x: 305, y: 133, r: 165, g: 162, b: 165 },
    { x: 137, y: 155, r: 0, g: 0, b: 0 },
    { x: 521, y: 160, r: 0, g: 0, b: 0 },
    { x: 298, y: 50, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    // to diff from power saving during playing
    { x: 497, y: 300, r: 0, g: 0, b: 0 },
    { x: 498, y: 300, r: 0, g: 0, b: 0 },
    { x: 499, y: 300, r: 0, g: 0, b: 0 },
    { x: 500, y: 300, r: 0, g: 0, b: 0 },
    { x: 501, y: 300, r: 0, g: 0, b: 0 },
    { x: 502, y: 300, r: 0, g: 0, b: 0 },
    { x: 503, y: 300, r: 0, g: 0, b: 0 },
    { x: 555, y: 282, r: 0, g: 0, b: 0 },
    { x: 555, y: 292, r: 0, g: 0, b: 0 },
    { x: 545, y: 291, r: 0, g: 0, b: 0 },

    // score
    { x: 520, y: 280, r: 0, g: 0, b: 0 },
    { x: 525, y: 280, r: 0, g: 0, b: 0 },
    { x: 530, y: 280, r: 0, g: 0, b: 0 },
    { x: 535, y: 280, r: 0, g: 0, b: 0 },
    { x: 540, y: 280, r: 0, g: 0, b: 0 },
    { x: 545, y: 280, r: 0, g: 0, b: 0 },
    { x: 550, y: 280, r: 0, g: 0, b: 0 },
    { x: 520, y: 295, r: 0, g: 0, b: 0 },
    { x: 525, y: 295, r: 0, g: 0, b: 0 },
    { x: 530, y: 295, r: 0, g: 0, b: 0 },
    { x: 535, y: 295, r: 0, g: 0, b: 0 },
    { x: 540, y: 295, r: 0, g: 0, b: 0 },
    { x: 545, y: 295, r: 0, g: 0, b: 0 },
    { x: 550, y: 295, r: 0, g: 0, b: 0 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gPromotionPage1 = new RF.Page(
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
    // header bg and x
    { x: 558, y: 37, r: 90, g: 190, b: 148 },
    { x: 576, y: 42, r: 148, g: 203, b: 173 },
    { x: 590, y: 45, r: 145, g: 203, b: 171 },

    // purchase button
    { x: 576, y: 277, r: 255, g: 223, b: 0 },
    { x: 480, y: 278, r: 255, g: 210, b: 0 },
    { x: 506, y: 278, r: 120, g: 76, b: 8 },
    { x: 522, y: 274, r: 249, g: 245, b: 0 },
    { x: 538, y: 277, r: 128, g: 81, b: 7 },
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

// non-specific confirm page with no and yes btn
var gConfirmWithYSPage = new RF.Page(
  "gConfirmWithYSPage",
  [
    // x on right top
    { x: 513, y: 46, r: 182, g: 186, b: 188 },
    { x: 520, y: 52, r: 70, g: 69, b: 70 },
    { x: 527, y: 45, r: 67, g: 68, b: 70 },
    { x: 531, y: 54, r: 174, g: 175, b: 176 },
    { x: 511, y: 51, r: 178, g: 180, b: 186 },

    // no btn
    { x: 212, y: 301, r: 49, g: 85, b: 123 },
    { x: 249, y: 300, r: 125, g: 152, b: 188 },
    { x: 278, y: 307, r: 49, g: 81, b: 123 },

    // yes btn
    { x: 363, y: 294, r: 8, g: 122, b: 255 },
    { x: 384, y: 297, r: 244, g: 248, b: 255 },
    { x: 419, y: 307, r: 0, g: 101, b: 247 },
    { x: 395, y: 294, r: 8, g: 122, b: 255 },

    // footer bg
    { x: 142, y: 304, r: 222, g: 219, b: 222 },
    { x: 530, y: 296, r: 222, g: 219, b: 222 },
  ],
  { x: 520, y: 56 }, // x btn
  { x: 520, y: 56 }
);

// need to update apk ver
var gErrorNewUpdateAvailablePage = new RF.Page(
  "gErrorNewUpdateAvailablePage",
  [
    // title
    { x: 208, y: 45, r: 181, g: 186, b: 189 },
    { x: 236, y: 58, r: 16, g: 24, b: 24 },
    { x: 260, y: 58, r: 125, g: 129, b: 133 },
    { x: 272, y: 57, r: 128, g: 136, b: 140 },
    { x: 313, y: 56, r: 181, g: 186, b: 189 },
    { x: 335, y: 56, r: 16, g: 24, b: 24 },
    { x: 363, y: 60, r: 181, g: 186, b: 189 },
    { x: 381, y: 61, r: 16, g: 24, b: 24 },
    { x: 388, y: 63, r: 126, g: 131, b: 134 },
    { x: 397, y: 63, r: 57, g: 64, b: 70 },
    { x: 407, y: 54, r: 181, g: 186, b: 189 },
    { x: 419, y: 59, r: 181, g: 186, b: 189 },
    // new update in content (104)
    { x: 227, y: 139, r: 176, g: 178, b: 184 },
    { x: 289, y: 144, r: 117, g: 121, b: 121 },
    { x: 260, y: 144, r: 108, g: 110, b: 108 },
    { x: 309, y: 144, r: 181, g: 186, b: 189 },
    { x: 326, y: 142, r: 87, g: 91, b: 90 },
    { x: 343, y: 143, r: 83, g: 88, b: 88 },
    { x: 376, y: 144, r: 69, g: 71, b: 69 },
    { x: 395, y: 144, r: 68, g: 72, b: 71 },
    { x: 409, y: 144, r: 122, g: 123, b: 125 },
    { x: 421, y: 144, r: 181, g: 186, b: 189 },

    // ok
    { x: 285, y: 297, r: 8, g: 118, b: 255 },
    { x: 312, y: 294, r: 8, g: 125, b: 255 },
    { x: 320, y: 299, r: 135, g: 188, b: 255 },
    { x: 364, y: 307, r: 0, g: 102, b: 247 },

    // popup bg and x
    { x: 117, y: 46, r: 181, g: 186, b: 189 },
    { x: 512, y: 46, r: 188, g: 186, b: 189 },
    { x: 524, y: 57, r: 189, g: 189, b: 189 },
    { x: 157, y: 232, r: 181, g: 186, b: 189 },
    { x: 209, y: 296, r: 222, g: 219, b: 222 },
    { x: 423, y: 304, r: 222, g: 219, b: 222 },
    { x: 443, y: 227, r: 181, g: 186, b: 189 },
  ],
  // TODO: check whether need to press ok
  { x: 314, y: 299 },
  { x: 314, y: 299 }
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

// with more games button
var gQuitAppPage = new RF.Page(
  "gQuitAppPage",
  [
    { x: 279, y: 54, r: 170, g: 173, b: 178 },
    { x: 324, y: 60, r: 20, g: 27, b: 28 },
    { x: 514, y: 50, r: 181, g: 182, b: 182 },
    { x: 466, y: 295, r: 8, g: 121, b: 255 },
    { x: 414, y: 298, r: 94, g: 157, b: 233 },
    { x: 496, y: 312, r: 0, g: 90, b: 247 },
    { x: 523, y: 309, r: 222, g: 219, b: 222 },
    { x: 111, y: 297, r: 222, g: 219, b: 222 },
    { x: 307, y: 60, r: 133, g: 137, b: 141 },
    { x: 315, y: 61, r: 181, g: 186, b: 189 },
    { x: 324, y: 61, r: 52, g: 56, b: 61 },
  ],
  { x: 300, y: 303 }, // not to quit
  { x: 300, y: 303 }
);

var gQuitAppPage1 = new RF.Page(
  "gQuitAppPage1",
  [
    { x: 262, y: 56, r: 181, g: 186, b: 189 },
    { x: 300, y: 54, r: 16, g: 24, b: 24 },
    { x: 323, y: 55, r: 24, g: 30, b: 32 },
    { x: 511, y: 50, r: 178, g: 180, b: 186 },
    { x: 522, y: 54, r: 141, g: 139, b: 141 },
    { x: 522, y: 54, r: 141, g: 139, b: 141 },
    { x: 167, y: 299, r: 222, g: 219, b: 222 },
    { x: 243, y: 295, r: 49, g: 85, b: 123 },
    { x: 318, y: 298, r: 222, g: 219, b: 222 },
    { x: 382, y: 297, r: 83, g: 158, b: 255 },
    { x: 503, y: 301, r: 222, g: 219, b: 222 },
    { x: 433, y: 310, r: 0, g: 94, b: 247 },
    { x: 404, y: 301, r: 8, g: 113, b: 255 },
    { x: 213, y: 307, r: 49, g: 81, b: 123 },
  ],
  { x: 213, y: 307 }, // not to quit
  { x: 213, y: 307 }
);

var gAllPages = [
  // TODO: handle follow pages
  gLogoPage,
  gLandingPage,
  gLogInPage,

  // TODO: handle more task
  gMainPage,
  gSettingsPage,

  // BattleMode pages
  gBattleModePanelPage,
  gRankedBattlePanelPage,
  gRankedBattleResultPage,
  gAutoGameConfirmPage,
  gAutoGameConfirmEndPage,

  // start new LeagueMode pages
  gLeagueModePanelPageContinue,
  gLeagueModePanelPageNextSchedule,
  gLeagueModePanelPageNextSchedule2,
  gLeagueModeNewGamePage,

  // play process pages
  gSelectPlayRole,
  gSelectYearPage,
  gSelectSeasonModePage,
  gSelectLeagueGameAmountPage,
  gEndSeasonPage,
  gNewSeasonPage,
  gGameLineUpPage,
  gMvpPage,
  gPlayerGrowthCompeletePage,
  gPicherOfTheMonthPage,
  gGameResultPage,
  gGameResultAquiredPage,
  gGameResultOtherPage,
  gGameResultWorldChampionPage,

  // game reward pages
  gGameRewardPage,
  gSelectRewardPlayerPage,
  gLeagueRewardAchievementGradePage,
  gBestPositionAwardBonusPage,
  gBestPositionAwardBonusPage2,
  gBonusGrantedByTeamRecordPage,
  gPostSeasonAwardBonusPage,

  // on play pages
  gOnQuickPlayPage,
  gOnQuickPlayPage1,
  gOnQuickPlayPausePage,
  gOnPlayPagePowerSaveOn,
  gLeagueOnPlayPagePowerSaveOff,
  gLeagueOnPlayPagePowerSaveOffStopped,
  gLeagueOnPlayPagePowerSaveOffMid,
  gLeagueOnPlayPagePowerSaveOffMid1,
  gLeagueOnPlayPageAutoOff,
  gLeagueOnPlayPageAutoOff1,
  gLeagueOnPlayPausePage,
  gLeagueContinuePlayingPage,

  // adReward pages
  gAdRewardPage,
  gAdRewardRedeemPage,
  gAdRewardOnCDPage,

  // weekly mission pages
  gAchivementMissionPage,
  gWeeklyMissionBoxPage,
  gWeeklyMissionBoxConfirmPage,
  gWeeklyMissionBoxRecievedPage,

  // general pages
  gPowerSavingPage,
  gReviewAppPage,
  gDownloadDataPage,

  // gBackBtnPage,
  gPromotionPage1,
  gPromotionPage2,
  gPromotionPage3,
  gRechargePromotionPage,
  gTeamSupportPackagePromotionPage,
  gEventPage,
  gOkPage,
  gNextPage,
  gNextPage2,
  gConfirmWithYSPage,
  gErrorNewUpdateAvailablePage,
  gUnexpectedErrorPage,
  gQuitAppPage,
  gQuitAppPage1,
];
var gAllPagesGroup = new RF.GroupPage("gAllPages", gAllPages);

var TASK = {
  changeGameSettings: "changeGameSettings",
  playLeagueGame: "playLeagueGame",
  playBattleGame: "playBattleGame",
  adReward: "adReward",
  weeklyMission: "weeklyMission",
  recieveInbox: "recieveInbox",
};

function MLB9I(config) {
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
    runAt: 0,
  };
  this.taskHistoryRunCount = {
    changeGameSettings: 0,
    playLeagueGame: 0,
    playBattleGame: 0,
    adReward: 0,
    weeklyMission: 0,
    recieveInbox: 0,
  };
  this.unknownCount = 0;
  this.lastRestartTimestamp = Date.now();
}
MLB9I.prototype.init = function () {
  console.log("############ MLB9I init ############");
  this.isRunning = true;
  this.screenConfig.devWidth = 640;
  this.screenConfig.devHeight = 360;
};
MLB9I.prototype.start = function () {
  console.log("############ MLB9I start ############");
  console.log("script version", versionCode);
  if (this.config.isXr) {
    var plan = getUserPlan();
    if (plan != 2) {
      console.log("user plan id: ", JSON.stringify(plan));
      console.log("please subscribe premium plan");
      return;
    }
  }

  this.isRunning = true;
  // TODO: search ad related activity in x;
  // var x = execute("dumpsys activity");
  // console.log(x);
  if (this.config.isXr) {
    this.addTask(
      /* taskName */ TASK.changeGameSettings,
      /* runtimes */ 1,
      /* isRepeat */ false
    );
    this.addTask(
      /* taskName */ TASK.adReward,
      /* runtimes */ 1,
      /* isRepeat */ true,
      /* runAt    */ 1
    );
    this.addTask(
      /* taskName */ TASK.weeklyMission,
      /* runtimes */ 1,
      /* isRepeat */ true,
      /* runAt    */ 1
    );
    this.addTask(
      /* taskName */ TASK.playBattleGame,
      /* runtimes */ 10, // can play 10 times at once
      /* isRepeat */ true,
      /* runAt    */ 1
    );
  }

  this.addTask(
    /* taskName */ TASK.playLeagueGame,
    /* runtimes */ 2,
    /* isRepeat */ true
  );

  this.runTasks();
};
MLB9I.prototype.stop = function (reason) {
  console.log("############ MLB9I stop ############");
  if (reason) {
    console.log("reason:", reason);
  }
  console.log("script version", versionCode);
  this.isRunning = false;
};

// * =========== task ===========
MLB9I.prototype.addTask = function (taskName, taskRunCount, isRepeat, runAt) {
  var taskState = {
    runCount: 0,
    targetRunCount: taskRunCount,
    isRepeat: isRepeat,
    isForceStopped: false,
    runAt: 0,
  };

  switch (taskName) {
    case TASK.adReward:
      taskState.tapAdBtnCount = 0;
      taskState.runAt = runAt || Date.now() + 30 * gMinuteInMs;
      break;
    case TASK.playBattleGame:
      taskState.runAt = runAt || Date.now() + 7 * gHourInMs;
      break;
    case TASK.weeklyMission:
      taskState.runAt = runAt || Date.now() + gDayInMs;
      break;
    case TASK.playLeagueGame:
    case TASK.changeGameSettings:
    default:
      break;
  }
  this.taskQue.push({
    name: taskName,
    state: taskState,
  });
};

MLB9I.prototype.runTasks = function () {
  while (this.taskQue.length > 0 && this.isRunning) {
    var now = Date.now();

    if (this.config.isXr) {
      // restart after run 1+ day
      // avoid game getiing slower and checkin everyday
      if (now - this.lastRestartTimestamp >= gDayInMs) {
        console.log("run after 1 day, reopen");
        this.lastRestartTimestamp = now;
        this.reopenApp();
      }
    }

    // update cur task
    var task = this.taskQue.shift();
    var taskName = task.name;
    var isRepeat = task.state.isRepeat;
    var targetRunCount = task.state.targetRunCount;
    var runAt = task.state.runAt;
    this.task = taskName;
    this.taskState = task.state;

    // skip cur task if not reach least timestamp to run
    if (now < runAt) {
      this.addTask(taskName, targetRunCount, isRepeat, runAt);
      RF.Utils.sleep(gSleepShort); // to stop instantly if needed
      continue;
    }

    // run cur task
    this.runTask(taskName, targetRunCount);
    this.taskHistoryRunCount[taskName] += this.taskState.runCount;
    console.log(">>>", taskName, "runs:", this.taskHistoryRunCount[taskName]);

    // add tasks that need repeat or not reach target
    var remainRunCounts = targetRunCount - this.taskState.runCount;
    if (isRepeat) {
      this.addTask(taskName, targetRunCount, isRepeat);
    } else if (remainRunCounts > 0) {
      this.addTask(taskName, remainRunCounts, isRepeat);
    }
  }
};

MLB9I.prototype.runTask = function (taskName, taskRunCount) {
  console.log("====== task ======");
  console.log(taskName);
  console.log("==================");
  while (
    this.isRunning &&
    this.task === taskName &&
    this.taskState.runCount < taskRunCount &&
    !this.taskState.isForceStopped
  ) {
    var isAppOn = this.isAppOn();
    if (!isAppOn) {
      console.log("#ERR: not in app");
      if (this.config.isXr) {
        this.reopenApp();
        RF.Utils.sleep(gSleepLong);
      } else {
        this.stop("#ERR: not in app");
      }
    }
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

MLB9I.prototype.stopCurTask = function (reason) {
  console.log("[task-stop]", this.task);
  if (reason) {
    console.log("reason:", reason);
  }
  this.taskState.isForceStopped = true;
};

// * ======== general ========
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
MLB9I.prototype.isAppOn = function () {
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
MLB9I.prototype.startApp = function () {
  do {
    execute(
      "ANDROID_DATA=/data monkey -p com.com2us.ninepb3d.normal.freefull.google.global.android.common -c android.intent.category.LAUNCHER 1"
    );
    sleep(3000);
  } while (!this.isAppOn());
  console.log("...started app");
};
MLB9I.prototype.stopApp = function stopApp() {
  execute(
    "ANDROID_DATA=/data am force-stop com.com2us.ninepb3d.normal.freefull.google.global.android.common"
  );
  sleep(6000);
  console.log("...stopped app");
};
MLB9I.prototype.reopenApp = function stopApp() {
  this.stopApp();
  this.startApp();
};
MLB9I.prototype.findPages = function () {
  var matches = gAllPagesGroup.isMatchScreen(this.screen);
  console.log("___findPages___");
  console.log(matches);
  console.log("_______________");
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

// * =========== pages ===========
//enter app
MLB9I.prototype.handleLogoPage = function () {
  // TODO: reopen if stuck too long
  RF.Utils.sleep(gSleepMedium);
};
MLB9I.prototype.handleLandingPage = function () {
  RF.Utils.sleep(gSleepMedium);
};

MLB9I.prototype.handleMainPage = function () {
  switch (this.task) {
    case TASK.playLeagueGame:
      this.screen.tap(gMainPageBtns.leagueMode);
      break;
    case TASK.playBattleGame:
      this.screen.tap(gMainPageBtns.battleMode);
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
    case TASK.weeklyMission:
      this.screen.tap(gMainPageBtns.achievement);
    default:
      break;
  }
};

// game setting
MLB9I.prototype.handleSettingsPage = function () {
  if (this.task !== TASK.changeGameSettings) {
    gSettingsPage.goBack(this.screen);
    return;
  }
  this.taskState.runCount++;
  this.screen.tap(gSettingsPageBtns.graphicTab);
  console.log("click graphic tab");
  RF.Utils.sleep(gSleepMedium);

  // ensure is switched on
  var screenshot = getScreenshot();
  var rgb = getImageColor(
    screenshot,
    gSettingsPageBtns.graphicTabPowerSaveOn.x,
    gSettingsPageBtns.graphicTabPowerSaveOn.y
  );
  releaseImage(screenshot);
  if (!isSameColor(rgb, { r: 8, g: 118, b: 255 })) {
    this.screen.tap(gSettingsPageBtns.graphicTabPowerSaveOn);
    console.log("click power save mode on");
    RF.Utils.sleep(gSleepLong);
  }
};

// ad reward
MLB9I.prototype.handleAdRewardPage = function () {
  if (this.task !== TASK.adReward) {
    gAdRewardPage.goBack(this.screen);
    return;
  }
  console.log("watch ad");
  gAdRewardPage.goNext(this.screen);
  var expectedEndAt = Date.now() + gSleepForAd;
  RF.Utils.sleep(gSleepForAd);

  var closeBtnPositions = [
    // right
    { x: 622, y: 19 },

    // left
    { x: 8, y: 15 },
  ];
  var isAdOn = this.findPages().length === 0;
  var retryDuring = Date.now() - expectedEndAt;
  while (this.isRunning && isAdOn && retryDuring < gDuringMaxAdRetry) {
    RF.Utils.sleep(gSleepShort);
    keycode("KEYCODE_BACK", 100);
    console.log("tap back");
    RF.Utils.sleep(gSleepShort);

    // try tap close btn
    isAdOn = this.findPages().length === 0;
    for (var i = 0; i < 2 && isAdOn; i++) {
      this.screen.tap(closeBtnPositions[i]);
      RF.Utils.sleep(gSleepShort);
      isAdOn = this.findPages().length === 0;
    }
    retryDuring = Date.now() - expectedEndAt;
  }

  // cannot back to app, reopen
  if (this.isRunning && isAdOn) {
    this.reopenApp();
  }
};
MLB9I.prototype.handleAdRewardRedeemPage = function () {
  if (this.task === TASK.adReward) {
    this.taskState.runCount++;
  }
  gAdRewardRedeemPage.goNext(this.screen);
};
MLB9I.prototype.handleAdRewardOnCDPage = function () {
  if (this.task === TASK.adReward) {
    this.stopCurTask("ad is still cd");
  }
  gAdRewardOnCDPage.goBack(this.screen);
};

// weekly mission
MLB9I.prototype.handleAchivementMissionPage = function () {
  if (this.task !== TASK.weeklyMission) {
    gAchivementMissionPage.goBack(this.screen);
  }

  // collect daily one if available
  var screenshot = getScreenshot();
  var canCollectBtn = { x: 613, y: 216, r: 8, g: 125, b: 255 };
  var shortcutBtn = { x: 613, y: 130, r: 58, g: 178, b: 173 };
  for (y = 128; y < 260; y += 44) {
    var rgb = getImageColor(screenshot, canCollectBtn.x, y);
    var canCollect = isSameColor(rgb, canCollectBtn);
    if (canCollect) {
      this.screen.tap({ x: canCollectBtn.x, y: y });
      console.log("collect");
      RF.Utils.sleep(gSleepMedium);
    }
  }
  releaseImage(screenshot);

  // go to weekly mission
  gAchivementMissionPage.goNext(this.screen);
};
MLB9I.prototype.handleWeeklyMissionBoxPage = function () {
  if (this.task !== TASK.weeklyMission) {
    gWeeklyMissionBoxPage.goBack(this.screen);
    return;
  }

  var screenshot = getScreenshot();
  var okItem = { x: 27, y: 115, r: 189, g: 194, b: 197 };
  var w = 198;
  var h = 75;

  // click openBox only when all mission is complete
  // bc it is abled once a week
  for (var dx = 0; dx < 3 * w; dx += w) {
    for (var dy = 0; dy < 3 * h; dy += h) {
      var rgb = getImageColor(screenshot, okItem.x + dx, okItem.y + dy);
      if (!isSameColor(rgb, okItem)) {
        releaseImage(screenshot);
        this.stopCurTask("wait all weekly mission complete");
        return;
      }
    }
  }

  releaseImage(screenshot);
  console.log("click open");
  this.screen.tap(gWeeklyMissionBoxPageBtns.openBox);
  RF.Utils.sleep(gSleepMedium);

  // TODO: let user select the item they want in the future
  // select the left bottom one
  console.log("select right bottom item");
  this.screen.tap({ x: okItem.x, y: okItem.y + 2 * h });
  RF.Utils.sleep(gSleepMedium);

  console.log("receive right bottom item");
  this.screen.tap(gWeeklyMissionBoxPageBtns.receiveReward);

  // enter recieve confirm page
  this.taskState.runCount++;
};
MLB9I.prototype.handleWeeklyMissionBoxConfirmPage = function () {
  gWeeklyMissionBoxConfirmPage.goNext(this.screen);
};
MLB9I.prototype.handleWeeklyMissionBoxRecievedPage = function () {
  gWeeklyMissionBoxRecievedPage.goNext(this.screen);
};

// playBattleGame
MLB9I.prototype.handleBattleModePanelPage = function () {
  if (this.task !== TASK.playBattleGame) {
    gBattleModePanelPage.goBack(this.screen);
    return;
  }
  // TODO: check if play other mode too
  this.screen.tap(gBattleModePanelPageBtns.rankedBattle);
  console.log("play ranked battle");
};
MLB9I.prototype.handleRankedBattlePanelPage = function () {
  if (this.task !== TASK.playBattleGame) {
    gRankedBattlePanelPage.goBack(this.screen);
    return;
  }

  // check if it's playing already
  var screenshot = getScreenshot();
  var playingBtn = { x: 531, y: 327, r: 249, g: 249, b: 242 };
  var rgb = getImageColor(screenshot, playingBtn.x, playingBtn.y);
  var isPlaying = isSameColor(rgb, playingBtn);

  if (isPlaying) {
    releaseImage(screenshot);
    console.log("prepare playing ranking games");
    RF.Utils.sleep(gSleepMedium);
    return;
  }

  // check if play is available
  var playBtn = { x: 560, y: 331, r: 255, g: 255, b: 254 };
  rgb = getImageColor(screenshot, playBtn.x, playBtn.y);
  var isPlayAbled = isSameColor(rgb, playBtn);

  if (!isPlayAbled) {
    var freshBtn = { x: 473, y: 61, r: 163, g: 185, b: 213 };
    rgb = getImageColor(screenshot, freshBtn.x, freshBtn.y);
    var isRefreshAbled = isSameColor(rgb, freshBtn);

    releaseImage(screenshot);
    if (!isRefreshAbled) {
      this.stopCurTask("play rank game disabled");
      return;
    }

    console.log("refresh match list");
    this.screen.tap({ x: freshBtn.x, y: freshBtn.y });
    RF.Utils.sleep(gSleepShort);
    screenshot = getScreenshot();
  }

  // check if auto play on
  var selectedTeam = { x: 459, y: 104, r: 156, g: 194, b: 214 };
  rgb = getImageColor(screenshot, selectedTeam.x, selectedTeam.y);
  var isAutoOff = isSameColor(rgb, selectedTeam);
  releaseImage(screenshot);

  if (isAutoOff) {
    this.screen.tap({ x: 308, y: 66 });
    console.log("turn on auto play");
    RF.Utils.sleep(gSleepShort);
  }

  gRankedBattlePanelPage.goNext(this.screen);
  console.log("play");
  // let it auto play with random 10
};
MLB9I.prototype.handleRankedBattleResultPage = function () {
  gRankedBattleResultPage.goNext(this.screen);
};
MLB9I.prototype.handleAutoGameConfirmPage = function () {
  if (this.task !== TASK.playBattleGame) {
    gAutoGameConfirmPage.goBack(this.screen);
    return;
  }
  gAutoGameConfirmPage.goNext(this.screen);
};
MLB9I.prototype.handleAutoGameConfirmEndPage = function () {
  if (this.task !== TASK.playBattleGame) {
    gAutoGameConfirmEndPage.goBack(this.screen);
    return;
  }
  gAutoGameConfirmEndPage.goNext(this.screen);
};

// playLeagueMode
// start new LeagueMode pages
MLB9I.prototype.handleLeagueModePanelPageNextSchedule = function () {
  console.log("is enter next schedule / continue page");
  if (this.task !== TASK.playLeagueGame) {
    gLeagueModePanelPageNextSchedule.goBack(this.screen);
    return;
  }
  gLeagueModePanelPageNextSchedule.goNext(this.screen);

  // avoid to click btn too many time for trigger next page immediately
  RF.Utils.sleep(gSleepShort);
  var screenshot = getScreenshot();

  var isStillOnPage =
    gLeagueModePanelPageNextSchedule.isMatchImage(screenshot, 0.8) ||
    gLeagueModePanelPageNextSchedule2.isMatchImage(screenshot, 0.8) ||
    gLeagueModePanelPageContinue.isMatchImage(screenshot, 0.8);
  releaseImage(screenshot);
  while (this.isRunning && isStillOnPage) {
    RF.Utils.sleep(gSleepLong);
    screenshot = getScreenshot();
    isStillOnPage =
      gLeagueModePanelPageNextSchedule.isMatchImage(screenshot, 0.8) ||
      gLeagueModePanelPageNextSchedule2.isMatchImage(screenshot, 0.8) ||
      gLeagueModePanelPageContinue.isMatchImage(screenshot, 0.8);
    releaseImage(screenshot);
  }
};
MLB9I.prototype.handleLeagueModeNewGamePage = function () {
  if (this.task !== TASK.playLeagueGame) {
    gLeagueModeNewGamePage.goBack(this.screen);
    return;
  }

  console.log("check energy");

  // handle the energy to choose game
  var screenshot = getScreenshot();

  var emptyEnergy = { x: 551, y: 281, r: 3, g: 124, b: 213 };
  var rgb = getImageColor(screenshot, emptyEnergy.x, emptyEnergy.y);
  var hasEnergy0 = isSameColor(rgb, emptyEnergy);
  if (hasEnergy0) {
    releaseImage(screenshot);
    this.stopCurTask("no energy");
    return;
  }

  var digit1 = { x: 561, y: 278, r: 169, g: 172, b: 179 };
  rgb = getImageColor(screenshot, digit1.x, digit1.y);
  var hasEnergy10 = isSameColor(rgb, digit1);
  console.log("has10Energy:", hasEnergy10);

  // use quick play when has 10+ energy,
  // and slow play when has 10- energy
  var quickPlayBtn = { x: 37, y: 284 };
  var rgb = getImageColor(screenshot, quickPlayBtn.x, quickPlayBtn.y);
  releaseImage(screenshot);
  var isQuickPlayOn = isSameColor(rgb, { r: 33, g: 255, b: 140 });

  if (hasEnergy10 && !isQuickPlayOn) {
    this.screen.tap(quickPlayBtn); // select quick play
    console.log("turn on quick play");
    RF.Utils.sleep(gSleepLong);
  }
  if (!hasEnergy10 && isQuickPlayOn) {
    this.screen.tap(quickPlayBtn); // cancel quick play
    console.log("turn off quick play");
    RF.Utils.sleep(gSleepLong);
  }
  gLeagueModeNewGamePage.goNext(this.screen); // play ball
  console.log("play");
  RF.Utils.sleep(gSleepLong);
};

// play process pages
MLB9I.prototype.handleSelectPlayRole = function () {
  console.log("handle select play role");
  gSelectPlayRole.goNext(this.screen);
  return true;
};
MLB9I.prototype.handleSelectYearPage = function () {
  console.log("handle select year page");
  gSelectYearPage.goNext(this.screen);

  // go to the min year
  var activeButton = {
    x: gSelectYearPageBtns.prevYear.x,
    y: gSelectYearPageBtns.prevYear.y,
    r: 49,
    g: 85,
    b: 123,
  };

  var isNotMinYear = this.screen.isSameColor(activeButton);
  var remainClick = 12; // max click time to min year
  while (isNotMinYear && remainClick) {
    this.screen.tap(gSelectYearPageBtns.prevYear);
    RF.Utils.sleep(gSleepShort);
    isNotMinYear = this.screen.isSameColor(activeButton);
    remainClick--;
  }

  // check the diff, return to prev year
  for (
    var yearDiff = this.config.leagueYear - gLeagueYearMin;
    yearDiff > 0;
    yearDiff--
  ) {
    this.screen.tap(gSelectYearPageBtns.nextYear);
    RF.Utils.sleep(gSleepShort);
  }

  this.screen.tap(gSelectYearPageBtns.submit);
  RF.Utils.sleep(gSleepLong);
  return;
};
MLB9I.prototype.handleSelectSeasonModePage = function () {
  console.log("handle select season page");
  gSelectSeasonModePage.goNext(this.screen);
  RF.Utils.sleep(gSleepMedium);
  this.screen.tap({ x: 568, y: 333 }); // normal mode
  RF.Utils.sleep(gSleepShort);
  // TODO split page
  this.screen.tap({ x: 332, y: 301 }); // next season
  RF.Utils.sleep(gSleepLong);
};
MLB9I.prototype.handleSelectLeagueGameAmountPage = function () {
  console.log("handle select game amount page");

  // use config user setted to select which they want to play
  // TODO: handle the half, quarter, full has 2 next page
  switch (this.config.leagueSeasonMode) {
    case "full":
      console.log("select full league");
      this.screen.tap(gSelectLeagueGameAmountPageBtns.full);
      RF.Utils.sleep(gSleepShort);
      this.screen.tap({ x: 564, y: 328 }); // go next
      break;
    case "half":
      console.log("select 1/2 league");
      this.screen.tap(gSelectLeagueGameAmountPageBtns.half);
      RF.Utils.sleep(gSleepShort);
      this.screen.tap({ x: 564, y: 328 }); // go next
      // ? will go to ok / next pages
      break;
    case "quarter":
      console.log("select 1/4 league");
      this.screen.tap(gSelectLeagueGameAmountPageBtns.quarter);
      RF.Utils.sleep(gSleepShort);
      this.screen.tap({ x: 564, y: 328 }); // go next
      // ? will go to ok / next pages
      break;
    case "postSeason":
      console.log("select postSeason");
      this.screen.tap(gSelectLeagueGameAmountPageBtns.post);
      // ? will go to ok / next pages
      break;
  }
  RF.Utils.sleep(gSleepMedium);
  this.screen.tap({ x: 564, y: 328 }); // go next
  RF.Utils.sleep(gSleepLong);
  return false;
};
MLB9I.prototype.handleEndSeasonPage = function () {
  // TODO: use config to select
  console.log("end season");
  this.screen.tap({ x: 182, y: 178 }); // tap new season of left
  RF.Utils.sleep(gSleepMedium);
  gEndSeasonPage.goNext(this.screen);
};
MLB9I.prototype.handleNewSeasonPage = function () {
  console.log("new season");
  gNewSeasonPage.goNext(this.screen);
};
MLB9I.prototype.handleGameLineUpPage = function () {
  console.log("game lineup");
  gGameLineUpPage.goNext(this.screen);
};
MLB9I.prototype.handleMvpPage = function () {
  console.log("handleMvpPage");

  var okBtn = { x: 568, y: 320, r: 52, g: 120, b: 210 };

  var screenshot = getScreenshot();
  var x = okBtn.x;
  var y = okBtn.y;
  var rgb = getImageColor(screenshot, x, y);
  releaseImage(screenshot);

  // ok button still on the screen
  for (
    var maxOkButtonRemain = 10;
    isSameColor(rgb, okBtn) && maxOkButtonRemain;
    maxOkButtonRemain--
  ) {
    gMvpPage.goNext(this.screen); // ok
    RF.Utils.sleep(gSleepMedium);
    screenshot = getScreenshot();
    rgb = getImageColor(screenshot, x, y);
    releaseImage(screenshot);
  }

  // reward bonus player popup
  RF.Utils.sleep(gSleepMedium);
  this.screen.tap({ x: 322, y: 309 }); // click next
  RF.Utils.sleep(gSleepMedium);
};
MLB9I.prototype.handlePlayerGrowthCompeletePage = function () {
  console.log("player growth complete");
  gPlayerGrowthCompeletePage.goNext(this.screen);
};
MLB9I.prototype.handlePicherOfTheMonthPage = function () {
  console.log("pitcher of month");
  gPicherOfTheMonthPage.goNext(this.screen);
  RF.Utils.sleep(gSleepMedium);
};
MLB9I.prototype.handleGameResultPage = function () {
  // the page is shared between all mode
  if (this.task === TASK.playLeagueGame || this.task === TASK.playBattleGame) {
    console.log("complete a game");
    this.taskState.runCount++;
  }
  gGameResultPage.goNext(this.screen);
};
MLB9I.prototype.handleGameResultAquiredPage = function () {
  gGameResultAquiredPage.goNext(this.screen);
};
MLB9I.prototype.handleGameResultOtherPage = function () {
  this.screen.tap({ x: 0, y: 0 });
  console.log("tap");
};
MLB9I.prototype.handleGameResultWorldChampionPage = function () {
  console.log("result world champion");
  gGameResultWorldChampionPage.goNext(this.screen);
};

// game reward pages
MLB9I.prototype.handleGameRewardPage = function () {
  console.log("game reward");
  gGameRewardPage.goNext(this.screen);
};
MLB9I.prototype.handleSelectRewardPlayerPage = function () {
  // TODO: handle choose the most rare card
  console.log("handleSelectRewardPlayer");

  var screenshot = getScreenshot();
  var bestCardRank = -1;
  var bestCardPos = gSelectRewardPlayerPageBtns.leftCard;

  var positions = Object.keys(gSelectRewardPlayerPageBtns);

  // TODO: check the color
  for (var i in positions) {
    var pos = gSelectRewardPlayerPageBtns[positions[i]];
    var rgb = getImageColor(screenshot, pos.x, pos.y);
    var k = rgb.r + "-" + rgb.g + "-" + rgb.b;
    console.log(pos.x, pos.y, k);
    // select if not in basic type
    var rank = gPlayerCardColorToRank[k] || 5;
    if (rank > bestCardRank) {
      bestCardRank = rank;
      bestCardPos = pos;
    }
  }
  releaseImage(screenshot);

  this.screen.tap(bestCardPos);
  RF.Utils.sleep(gSleepShort);
  gSelectRewardPlayerPage.goNext(this.screen);
  RF.Utils.sleep(gSleepMedium);
};
MLB9I.prototype.handleLeagueRewardAchievementGradePage = function () {
  console.log("league reward achievement");
  gLeagueRewardAchievementGradePage.goNext(this.screen);
};
MLB9I.prototype.handleBestPositionAwardBonusPage = function () {
  console.log("best position award");
  gBestPositionAwardBonusPage.goNext(this.screen);
};
MLB9I.prototype.handleBonusGrantedByTeamRecordPage = function () {
  console.log("bonus granted by team");
  gBonusGrantedByTeamRecordPage.goNext(this.screen);
};
MLB9I.prototype.handlePostSeasonAwardBonusPage = function () {
  console.log("post season award bonus");
  gPostSeasonAwardBonusPage.goNext(this.screen);
};

// on play pages
MLB9I.prototype.handleOnQuickPlayPage = function () {
  this.screen.tap({ x: 0, y: 0 });
  console.log("tap");
};
MLB9I.prototype.handleOnQuickPlayPausePage = function () {
  gOnQuickPlayPausePage.goNext(this.screen);
};
MLB9I.prototype.handleOnPlayPagePowerSaveOn = function () {
  // this is share between all mode
  if (this.task !== TASK.playLeagueGame && this.task !== TASK.playBattleGame) {
    this.handlePowerSavingPage();
    return;
  }
  if (this.config.isXr && !gPowerSavingPage.isMatchScreen(this.screen)) {
    console.log("still play with power save on");
  } else {
    this.handlePowerSavingPage();
  }
};
MLB9I.prototype.handleLeagueOnPlayPagePowerSaveOff = function () {
  // page will be stopped here in any tasks
  // need to handle immediately if match
  if (gLeagueOnPlayPagePowerSaveOffStopped.isMatchScreen(this.screen)) {
    gLeagueOnPlayPagePowerSaveOffStopped.goNext(this.screen);
  }

  if (this.task !== TASK.playLeagueGame) {
    // turn off autoplay to return
    gLeagueOnPlayPagePowerSaveOff.goBack(this.screen);
    RF.Utils.sleep(gSleepMedium);
    return;
  }

  // TODO: handle quick switch to auto play off if was stopped
  if (this.config.isXr) {
    console.log("turn on power save play");
    gLeagueOnPlayPagePowerSaveOff.goNext(this.screen);
  }
  this.screen.tap({ x: 0, y: 0 });
  console.log("tap");
};
MLB9I.prototype.handleLeagueOnPlayPageAutoOff = function () {
  if (this.task !== TASK.playLeagueGame) {
    // open pause panel
    gLeagueOnPlayPageAutoOff.goBack(this.screen);
    return;
  }
  console.log("turn on auto play");
  gLeagueOnPlayPageAutoOff.goNext(this.screen);
};
MLB9I.prototype.handleLeagueOnPlayPausePage = function () {
  if (this.task !== TASK.playLeagueGame) {
    // leave game
    gLeagueOnPlayPausePage.goBack(this.screen);
    RF.Utils.sleep(gSleepMedium);
    return;
  }
  // continue play
  keycode("KEYCODE_BACK", 100);
  console.log("tap back to stay in game");
  // gLeagueOnPlayPausePage.goNext(this.screen);
};
MLB9I.prototype.handleLeagueContinuePlayingPage = function () {
  gLeagueContinuePlayingPage.goNext(this.screen);
};

// general pages
MLB9I.prototype.handlePowerSavingPage = function () {
  console.log("handlePowerSavingPage");
  this.screen.tapDown({ x: 100, y: 180 });
  RF.Utils.sleep(gSleepMedium);
  this.screen.moveTo({ x: 500, y: 180 });
  RF.Utils.sleep(gSleepMedium);
  this.screen.tapUp({ x: 500, y: 180 });
  RF.Utils.sleep(gSleepMedium);
};
MLB9I.prototype.handleReviewAppPage = function () {
  console.log("gReviewAppPage");
  gReviewAppPage.goNext(this.screen);
};
MLB9I.prototype.handleDownloadDataPage = function () {
  console.log("gDownloadDataPage");
  gDownloadDataPage.goNext(this.screen);
  RF.Utils.sleep(gSleepWaitPageLong);
};
MLB9I.prototype.handlePromotionPage1 = function () {
  console.log("gPromotionPage1");
  gPromotionPage1.goNext(this.screen);
};
MLB9I.prototype.handlePromotionPage2 = function () {
  console.log("gPromotionPage2");
  gPromotionPage2.goNext(this.screen);
};
MLB9I.prototype.handlePromotionPage3 = function () {
  console.log("gPromotionPage3");
  gPromotionPage3.goNext(this.screen);
};
MLB9I.prototype.handleRechargePromotionPage = function () {
  console.log("gRechargePromotionPage");
  gRechargePromotionPage.goNext(this.screen);
};
MLB9I.prototype.handleTeamSupportPackagePromotionPage = function () {
  console.log("gTeamSupportPackagePromotionPage");
  gTeamSupportPackagePromotionPage.goNext(this.screen);
};
MLB9I.prototype.handleEventPage = function () {
  console.log("gEventPage");
  gEventPage.goNext(this.screen);
};
MLB9I.prototype.handleOkPage = function () {
  console.log("ok page");
  gOkPage.goNext(this.screen);
};
MLB9I.prototype.handleNextPage = function () {
  console.log("next page");
  gNextPage.goNext(this.screen);
};
MLB9I.prototype.handleConfirmWithYSPage = function () {
  console.log("confirm with y/s page");
  gConfirmWithYSPage.goNext(this.screen);
};
MLB9I.prototype.handleErrorNewUpdateAvailablePage = function () {
  console.log("game apk require update");
  gErrorNewUpdateAvailablePage.goNext(this.screen);
  RF.Utils.sleep(gSleepWaitPageLong);
};
MLB9I.prototype.handleUnexpectedErrorPage = function () {
  console.log("unexpectedError happened during game");
  gUnexpectedErrorPage.goNext(this.screen);
  RF.Utils.sleep(gSleepWaitPageLong);
};
MLB9I.prototype.handleQuitAppPage = function () {
  console.log("gQuitAppPage");
  gQuitAppPage.goNext(this.screen);
};
MLB9I.prototype.handleQuitAppPage1 = function () {
  console.log("gQuitAppPage1");
  gQuitAppPage1.goNext(this.screen);
};

// try to resolve by simply tap back
MLB9I.prototype.handleUnknown = function () {
  this.screen.tap({ x: 0, y: 0 });
  console.log("tap");

  // try to resolve by simply tap back
  if (this.unknownCount % 20 === 0) {
    RF.Utils.sleep(gSleepShort);
    keycode("KEYCODE_BACK", 100);
    console.log("tap back");
    return;
  }
  if (this.config.isXr && this.unknownCount % 1000 === 0) {
    this.reopenApp();
  }
};

// * =========== utils ===========
function isSameColor(rgb1, rgb2) {
  var mean = (rgb1.r + rgb2.r) / 2;
  var r = rgb1.r - rgb2.r;
  var g = rgb1.g - rgb2.g;
  var b = rgb1.b - rgb2.b;
  var score =
    1 -
    Math.sqrt(
      (((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)
    ) /
      768;
  return score >= 0.9;
}

// * =========== entry point ===========
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
