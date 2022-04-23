/* prettier-ignore */ !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.RF=t():e.RF=t()}(this,(function(){return function(){"use strict";var e={607:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||o(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,n(r(850),t),n(r(985),t),n(r(837),t),n(r(459),t),n(r(231),t),n(r(200),t),n(r(656),t),n(r(708),t),n(r(974),t),t.version=1},850:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.GroupPage=void 0;var r=function(){function e(e,t){this.name=e,this.pages=t}return e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=[],o=0,n=this.pages;o<n.length;o++){var i=n[o];i.isMatchImage(e,t)&&r.push(i.name)}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingOne=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": "+this.pages.map((function(e){return e.name})).join(","));for(var s=Date.now(),a="",c=0;Date.now()-s<r;){for(var f=t.getCvtDevScreenshot(),m=0,h=this.pages;m<h.length;m++){var g=h[m];if(g.isMatchImage(f,i)){a!==g.name&&(a=g.name,c=0),c++;break}}if(releaseImage(f),""!==a&&c>=o)break;sleep(n)}return e.debug&&console.log("GroupPage.waitScreenForMatchingOne "+this.name+": matched: "+a+", usedTime "+(Date.now()-s)),a},e.debug=!1,e}();t.GroupPage=r},985:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Page=void 0;var o=r(656),n=function(){function e(e,t,r,o){void 0===r&&(r=void 0),void 0===o&&(o=void 0),this.name=e,this.points=t,this.next=r,this.back=o}return e.prototype.goNext=function(t){void 0!==this.next?t.tap(this.next):e.debug&&console.log("Warning Page: "+this.name+" has no next xy")},e.prototype.goBack=function(t){void 0!==this.back?t.tap(this.back):e.debug&&console.log("Warning Page: "+this.name+" has no back xy")},e.prototype.isMatchImage=function(e,t){void 0===t&&(t=.9);for(var r=!0,n=0,i=this.points;n<i.length;n++){var s=i[n],a=getImageColor(e,s.x,s.y);if(o.Colors.identityColor(s,a)<t){r=!1;break}}return r},e.prototype.isMatchScreen=function(e,t){void 0===t&&(t=.9);var r=e.getCvtDevScreenshot(),o=this.isMatchImage(r,t);return releaseImage(r),o},e.prototype.waitScreenForMatchingScreen=function(t,r,o,n,i){void 0===o&&(o=1),void 0===n&&(n=600),void 0===i&&(i=.9),e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name);for(var s=Date.now(),a=0;Date.now()-s<r&&(this.isMatchScreen(t,i)&&a++,!(a>=o));)sleep(n);return a>=o?(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" success, usedTime "+(Date.now()-s)),!0):(e.debug&&console.log("Page.waitScreenForMatchingScreen "+this.name+" timeout"),!1)},e.debug=!1,e}();t.Page=n},837:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.XYRGB=void 0;t.XYRGB=function(){this.x=0,this.y=0,this.r=0,this.g=0,this.b=0}},459:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.Screen=void 0;var o=r(656),n=function(){function e(e){this.config=e;var t=getScreenSize();this.config.deviceHeight=t.height,this.config.deviceWidth=t.width,this.config.screenWidth=t.width,this.config.screenHeight=t.height,this.config.screenOffsetX=0,this.config.screenOffsetY=0}return e.prototype.calculateDeviceOffset=function(e){var t=e(this);this.config.screenWidth=t.screenWidth,this.config.screenHeight=t.screenHeight,this.config.screenOffsetX=t.screenOffsetX,this.config.screenOffsetY=t.screenOffsetY},e.prototype.getScreenX=function(e){return Math.floor(this.config.screenOffsetX+e*this.config.screenWidth/this.config.devWidth)||0},e.prototype.getScreenY=function(e){return Math.floor(this.config.screenOffsetY+e*this.config.screenHeight/this.config.devHeight)||0},e.prototype.getScreenXY=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e)return{x:this.getScreenX(e.x),y:this.getScreenY(e.y)};if("number"==typeof e&&"number"==typeof t)return{x:this.getScreenX(e),y:this.getScreenY(t)};throw new Error("getScreenXY wrong params "+e+", "+t)},e.prototype.tap=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tap(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tap(r,o,this.config.actionDuring)}},e.prototype.tapDown=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapDown(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapDown(r,o,this.config.actionDuring)}},e.prototype.moveTo=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);moveTo(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),moveTo(r,o,this.config.actionDuring)}},e.prototype.tapUp=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getScreenX(e.x),o=this.getScreenY(e.y);tapUp(r,o,this.config.actionDuring)}else{if("number"!=typeof e||"number"!=typeof t)throw new Error("tapDown wrong params "+e+", "+t);r=this.getScreenX(e),o=this.getScreenY(t),tapUp(r,o,this.config.actionDuring)}},e.prototype.getScreenColor=function(e,t){if(void 0===t&&(t=void 0),"object"==typeof e){var r=this.getCvtDevScreenshot(),o=getImageColor(r,e.x,e.y);return releaseImage(r),o}if("number"==typeof e&&"number"==typeof t)return r=this.getCvtDevScreenshot(),o=getImageColor(r,e,t),releaseImage(r),o;throw new Error("tapDown wrong params "+e+", "+t)},e.prototype.findImage=function(e){var t=this.getCvtDevScreenshot(),r=findImage(t,e);return releaseImage(t),r},e.prototype.tapImage=function(e){var t=this.findImage(e);this.tap(t)},e.prototype.isSameColor=function(e,t){void 0===t&&(t=.9);var r=this.getScreenColor(e);return o.Colors.identityColor(r,e)>t},e.prototype.getDeviceScreenshot=function(){return getScreenshot()},e.prototype.getScreenScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.screenWidth,this.config.screenHeight,100)},e.prototype.getCvtDevScreenshot=function(){return getScreenshotModify(this.config.screenOffsetX,this.config.screenOffsetY,this.config.screenWidth,this.config.screenHeight,this.config.devWidth,this.config.devHeight,100)},e.prototype.setActionDuring=function(e){this.config.actionDuring=e},e.debug=!1,e}();t.Screen=n},231:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenConfig=void 0;t.ScreenConfig=function(){this.devWidth=640,this.devHeight=360,this.deviceWidth=0,this.deviceHeight=0,this.screenWidth=0,this.screenHeight=0,this.screenOffsetX=0,this.screenOffsetY=0,this.actionDuring=180}},200:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0}),t.TaskManager=t.Task=void 0;var o=r(974),n=function(){this.name="",this.runTimes=1,this.maxRunningDuring=0,this.minIntervalDuring=0,this.lastRunDoneTime=0,this.run=function(){}};t.Task=n;var i=function(){function e(){this.isRunning=!1,this.runIdx=0,this.tasks=[]}return e.prototype.addTask=function(e,t,r,o,i){void 0===r&&(r=1),void 0===o&&(o=0),void 0===i&&(i=0);var s=new n;s.name=e,s.run=t,s.runTimes=r,s.maxRunningDuring=o,s.minIntervalDuring=i,this.tasks.push(s)},e.prototype.start=function(){if(0===this.tasks.length)throw new Error("TaskManager: No tasks to run");for(console.log("TaskManager start"),this.isRunning=!0;this.isRunning;){var e=Date.now(),t=this.tasks[this.runIdx%this.tasks.length];if(this.runIdx++,!(e-t.lastRunDoneTime<t.minIntervalDuring)){console.log("RunTask "+this.runIdx+" "+t.name+", times "+t.runTimes+", maxDuring "+t.maxRunningDuring);for(var r=0;this.isRunning&&(console.log("TaskRunning "+t.name+", times "+r+"/"+t.runTimes),t.run(),t.lastRunDoneTime=Date.now(),r++,!(0!==t.runTimes&&r>=t.runTimes))&&!(Date.now()-e>t.maxRunningDuring);)sleep(100)}}},e.prototype.stop=function(){this.isRunning=!1,o.Utils.sleep(1e3),console.log("TaskManager stop")},e}();t.TaskManager=i},656:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Colors=void 0;var r=function(){function e(){}return e.getRangeColor=function(e,t,r,o,n){void 0===n&&(n=5);var i=!1;void 0===e&&(i=!0,e=getScreenshot());for(var s=getImageSize(e),a=Math.max(0,t-o),c=Math.max(0,r-o),f=Math.min(s.width,t+o),m=Math.min(s.height,r+o),h=Math.max(1,(f-a)/n),g=Math.max(1,(m-c)/n),u=0,p={r:0,g:0,b:0},y=a;y<f;y+=h)for(var v=c;v<m;v+=g){var l=getImageColor(e,Math.floor(y),Math.floor(v));p.r+=l.r,p.g+=l.g,p.b+=l.b,u++}return i&&releaseImage(e),{r:Math.floor(p.r/u),g:Math.floor(p.g/u),b:Math.floor(p.b/u)}},e.color2hex=function(e){return((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},e.hex2Color=function(e){return{r:parseInt(e[0]+e[1],16),g:parseInt(e[2]+e[3],16),b:parseInt(e[4]+e[5],16)}},e.identityColor=function(e,t){var r=(e.r+t.r)/2,o=e.r-t.r,n=e.g-t.g,i=e.b-t.b;return 1-Math.sqrt(((512+r)*o*o>>8)+4*n*n+((767-r)*i*i>>8))/768},e}();t.Colors=r},708:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.OCR=void 0;var r=function(){function e(e){this.words=e}return e.prototype.recognize=function(e,t,r,o){void 0===o&&(o=.8);for(var n=0,i=[],s=0;s<this.words.length;s++){var a=this.words[s],c=getImageSize(a.img);n=Math.max(n,c.width);var f=findImages(e,a.img,r,t,!0);for(var m in f){var h=f[m];i.push({char:a.char,x:h.x,y:h.y,score:h.score,w:c.width})}}i.sort((function(e,t){return e.x-t.x}));for(var g="",u=0,p=0,y=0;y<i.length;y++){var v=i[y];v.x>u?(p=v.score,g+=v.char,u=Math.floor(v.x+v.w*o)):v.x<=u&&v.score>p&&" "!==v.char&&(p=v.score,g=g.substr(0,g.length-1)+v.char,u=Math.floor(v.x+v.w*o))}return g},e}();t.OCR=r},974:function(e,t){var r=this&&this.__spreadArray||function(e,t){for(var r=0,o=t.length,n=e.length;r<o;r++,n++)e[n]=t[r];return e};Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.log=void 0,t.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=(new Date).toLocaleString("en-US",{timeZone:"Asia/Taipei"}),o="["+r+"] ",n=0,i=e;n<i.length;n++){var s=i[n];o+="object"==typeof s?JSON.stringify(s)+" ":s+" "}console.log(o.substr(0,o.length-1))};var o=function(){function e(){}return e.sortStringNumberMap=function(e){var t=[];for(var r in e)t.push({key:r,count:e[r]});return t.sort((function(e,t){return t.count-e.count})),t},e.sleep=function(e){for(;e>200;)e-=200,sleep(200);e>0&&sleep(e)},e.getTaiwanTime=function(){return Date.now()+288e5},e.log=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];for(var n=0;n<t.length;n++){var i=t[n];"object"==typeof i&&(t[n]=JSON.stringify(i))}var s=new Date(e.getTaiwanTime()),a="["+(s.getMonth()+1)+"-"+s.getDate()+"T"+s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+"]";console.log.apply(console,r([a],t))},e.notifyEvent=function(t,r){null!=sendEvent&&(e.log("sendEvent",t,r),sendEvent(""+t,""+r))},e.startApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n "+e)},e.stopApp=function(e){execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop "+e),execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop "+e)},e.getCurrentApp=function(){for(var e="",t="",r=0,o=execute("dumpsys activity top").split("\n");r<o.length;r++){var n=o[r],i=n.indexOf("ACTIVITY");if(-1!==i){e="",t="";for(var s=!0,a=i+9;a<n.length;a++){var c=n[a];if(" "===c)break;"/"===c?s=!1:s?e+=c:t+=c}}}return[e,t]},e}();t.Utils=o}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(607)}()}));
/* prettier-ignore */ function getSqSegDist(i,t,e){var r=t[0],n=t[1],u=e[0]-r,f=e[1]-n;if(0!==u||0!==f){var s=((i[0]-r)*u+(i[1]-n)*f)/(u*u+f*f);s>1?(r=e[0],n=e[1]):s>0&&(r+=u*s,n+=f*s)}return(u=i[0]-r)*u+(f=i[1]-n)*f}
/* prettier-ignore */ function simplifyDPStep(i,t,e,r,n){for(var u,f=r,s=t+1;s<e;s++){var p=getSqSegDist(i[s],i[t],i[e]);p>f&&(u=s,f=p)}f>r&&(u-t>1&&simplifyDPStep(i,t,u,r,n),n.push(i[u]),e-u>1&&simplifyDPStep(i,u,e,r,n))}
/* prettier-ignore */ var simplifyDouglasPeucker=function(i,t){if(i.length<=1)return i;var e=(t="number"==typeof t?t:1)*t,r=i.length-1,n=[i[0]];return simplifyDPStep(i,0,r,e,n),n.push(i[r]),n};
/* prettier-ignore */ function getSqDist(i,t){var e=i[0]-t[0],r=i[1]-t[1];return e*e+r*r}
/* prettier-ignore */ var simplifyRadialDist=function(i,t){if(i.length<=1)return i;for(var e,r=(t="number"==typeof t?t:1)*t,n=i[0],u=[n],f=1,s=i.length;f<s;f++)getSqDist(e=i[f],n)>r&&(u.push(e),n=e);return n!==e&&u.push(e),u};
/* prettier-ignore */ function simplify(i,t){return i=simplifyRadialDist(i,t),i=simplifyDouglasPeucker(i,t)}

RF.Page.debug = true;
RF.GroupPage.debug = true;
RF.Screen.debug = true;

var TsumLinkDistance = 52;

// extension
RF.GroupPage.prototype.getPageByName = function (name) {
  for (var i = 0; i < this.pages.length; i++) {
    if (this.pages[i].name === name) {
      return this.pages[i];
    }
  }
  return null;
};

var launchPointsSTADIUM = [
  { x: 81, y: 197, r: 178, g: 191, b: 219 },
  { x: 114, y: 200, r: 178, g: 176, b: 198 },
  { x: 144, y: 185, r: 205, g: 215, b: 232 },
  { x: 186, y: 202, r: 192, g: 188, b: 196 },
  { x: 205, y: 200, r: 193, g: 189, b: 200 },
  { x: 241, y: 202, r: 227, g: 222, b: 229 },
  { x: 293, y: 177, r: 178, g: 182, b: 210 },
];

var gLoadingPage = new RF.Page(
  'gLoadingPage',
  [
    { x: 54, y: 98, r: 0, g: 0, b: 0 },
    { x: 303, y: 101, r: 0, g: 0, b: 0 },
    { x: 58, y: 496, r: 0, g: 0, b: 0 },
    { x: 298, y: 504, r: 0, g: 0, b: 0 },
    { x: 181, y: 312, r: 255, g: 255, b: 255 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gLaunchingPage = new RF.Page(
  'gLaunchingPage',
  launchPointsSTADIUM.concat([
    // without GO TO STADIUM
    { x: 113, y: 564, r: 33, g: 57, b: 87 },
    { x: 176, y: 563, r: 31, g: 55, b: 85 },
    { x: 211, y: 563, r: 29, g: 52, b: 80 },
    { x: 249, y: 563, r: 35, g: 59, b: 89 },
  ]),
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gLaunchFinishPage = new RF.Page(
  'gLaunchFinishPage',
  launchPointsSTADIUM.concat([
    // with GO TO STADIUM
    { x: 113, y: 564, r: 223, g: 240, b: 253 },
    { x: 176, y: 563, r: 230, g: 243, b: 254 },
    { x: 211, y: 563, r: 224, g: 241, b: 254 },
    { x: 249, y: 563, r: 229, g: 246, b: 254 },
  ]),
  { x: 182, y: 562 },
  { x: 0, y: 0 }
);

var gInfoDownloadAsset = new RF.Page(
  'gInfoDownloadAsset',
  [
    { x: 181, y: 39, r: 6, g: 16, b: 33 },
    { x: 70, y: 181, r: 227, g: 233, b: 247 },
    { x: 61, y: 347, r: 70, g: 108, b: 233 },
    { x: 111, y: 477, r: 4, g: 184, b: 255 },
    { x: 250, y: 478, r: 255, g: 178, b: 32 },
    { x: 189, y: 306, r: 44, g: 77, b: 193 },
    { x: 301, y: 347, r: 70, g: 108, b: 233 },
  ],
  { x: 251, y: 464 }, // OK
  { x: 0, y: 0 }
);

var mainTopBarPoints = [
  { x: 130, y: 28, r: 255, g: 233, b: 85 },
  { x: 260, y: 28, r: 255, g: 92, b: 97 },
  { x: 29, y: 63, r: 255, g: 218, b: 66 },
  { x: 328, y: 71, r: 252, g: 216, b: 0 },
  { x: 276, y: 61, r: 210, g: 69, b: 0 },
];

var gMainPage = new RF.Page(
  'gMainPage',
  mainTopBarPoints.concat([{ x: 182, y: 412, r: 236, g: 249, b: 255 }]),
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gMainPage2 = new RF.Page(
  'gMainPage',
  mainTopBarPoints.concat([{ x: 176, y: 247, r: 48, g: 34, b: 103 }]),
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gMainPlayPage = new RF.Page(
  'gMainPlayPage',
  mainTopBarPoints.concat([{ x: 179, y: 465, r: 29, g: 47, b: 121 }]),
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gMainPlayingPage = new RF.Page(
  'gMainPlayingPage',
  [
    { x: 234, y: 17, r: 5, g: 46, b: 112 },
    { x: 333, y: 14, r: 255, g: 236, b: 102 },
    { x: 319, y: 571, r: 245, g: 161, b: 26 },
    { x: 325, y: 556, r: 173, g: 57, b: 14 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gMainPlayingPausePage = new RF.Page(
  'gMainPlayingPausePage',
  [
    { x: 334, y: 32, r: 27, g: 35, b: 36 },
    { x: 97, y: 178, r: 234, g: 239, b: 247 },
    { x: 282, y: 174, r: 227, g: 235, b: 247 },
    { x: 161, y: 340, r: 255, g: 214, b: 63 },
    { x: 307, y: 341, r: 255, g: 215, b: 63 },
    { x: 183, y: 471, r: 255, g: 187, b: 32 },
    { x: 332, y: 547, r: 28, g: 36, b: 39 },
  ],
  { x: 158, y: 340 }, // try again, exit
  { x: 182, y: 434 } // continue
);

var gPlayNoEnoughHearts = new RF.Page(
  'gPlayNoEnoughHearts',
  [
    { x: 50, y: 92, r: 226, g: 233, b: 246 },
    { x: 207, y: 96, r: 250, g: 251, b: 254 },
    { x: 180, y: 137, r: 35, g: 65, b: 166 },
    { x: 114, y: 427, r: 255, g: 208, b: 48 },
    { x: 247, y: 425, r: 255, g: 220, b: 65 },
    { x: 189, y: 238, r: 130, g: 124, b: 175 },
    { x: 184, y: 527, r: 250, g: 228, b: 95 },
    { x: 63, y: 566, r: 19, g: 50, b: 64 },
  ],
  { x: 181, y: 529 },
  { x: 0, y: 0 }
);

var gPlayBtn = { x: 181, y: 564, r: 251, g: 223, b: 88 };
var gPlayPauseBtn = { x: 334, y: 32, r: 250, g: 214, b: 57 };
var gPlayFanBtn1 = { x: 336, y: 552, r: 253, g: 223, b: 85 };
var gPlayFanBtn2 = { x: 335, y: 552, r: 21, g: 82, b: 192 };
var gPlaySkill1Btn1 = { x: 48, y: 580, r: 240, g: 149, b: 22 };
var gPlaySkill1Btn2 = { x: 44, y: 521, r: 255, g: 245, b: 130 };
var gPlaySkill2Btn1 = { x: 128, y: 589, r: 235, g: 147, b: 22 };
var gPlaySkill2Btn2 = { x: 123, y: 532, r: 250, g: 240, b: 125 };

// ========== For Mail Box ==========
var mailBoxBasicPoints = [
  { x: 68, y: 95, r: 226, g: 233, b: 246 },
  { x: 310, y: 95, r: 226, g: 233, b: 246 },
  { x: 142, y: 137, r: 31, g: 182, b: 254 },
  { x: 120, y: 142, r: 47, g: 77, b: 209 },
  { x: 182, y: 144, r: 28, g: 51, b: 139 },
  { x: 182, y: 526, r: 250, g: 228, b: 95 },
];

var gMailBoxPage = new RF.Page(
  'gMailBoxPage',
  mailBoxBasicPoints.concat([
    { x: 90, y: 165, r: 27, g: 48, b: 134 }, // selector closed
  ]),
  { x: 180, y: 550 }, // OK
  { x: 0, y: 0 }
);

var gMailBoxSelectorOpenedPage = new RF.Page(
  'gMailBoxSelectorOpenedPage',
  mailBoxBasicPoints.concat([
    { x: 90, y: 165, r: 59, g: 114, b: 255 }, // selector opened
  ]),
  { x: 180, y: 550 }, // OK
  { x: 0, y: 0 }
);

var gMailClaimHeartPage = new RF.Page(
  'gMailClaimHeartPage',
  [
    { x: 82, y: 91, r: 31, g: 38, b: 51 },
    { x: 86, y: 185, r: 230, g: 235, b: 247 },
    { x: 283, y: 187, r: 227, g: 235, b: 247 },
    { x: 180, y: 256, r: 255, g: 127, b: 191 },
    { x: 109, y: 447, r: 69, g: 236, b: 251 }, // Cancel
    { x: 249, y: 443, r: 251, g: 229, b: 97 }, // OK
    { x: 194, y: 398, r: 55, g: 88, b: 253 },
  ],
  { x: 249, y: 443 },
  { x: 109, y: 447 }
);

var gMailGetAllPage = new RF.Page(
  'gMailGetAllPage',
  [
    { x: 95, y: 184, r: 231, g: 236, b: 247 },
    { x: 91, y: 94, r: 44, g: 51, b: 63 },
    { x: 180, y: 243, r: 36, g: 68, b: 178 },
    { x: 179, y: 285, r: 43, g: 76, b: 191 },
    { x: 180, y: 343, r: 40, g: 74, b: 186 },
    { x: 179, y: 394, r: 58, g: 93, b: 255 },
    { x: 110, y: 445, r: 75, g: 240, b: 251 },
    { x: 254, y: 443, r: 251, g: 229, b: 97 },
  ],
  { x: 248, y: 463 },
  { x: 110, y: 463 }
);

var gMailReceivedRewardPage = new RF.Page(
  'gMailReceivedRewardPage',
  [
    { x: 75, y: 90, r: 43, g: 50, b: 63 },
    { x: 83, y: 183, r: 227, g: 235, b: 247 },
    { x: 289, y: 187, r: 227, g: 233, b: 247 },
    { x: 182, y: 249, r: 38, g: 71, b: 178 },
    { x: 180, y: 339, r: 40, g: 74, b: 186 },
    { x: 177, y: 447, r: 251, g: 227, b: 92 },
    { x: 226, y: 545, r: 47, g: 46, b: 35 },
  ],
  { x: 227, y: 463 },
  { x: 0, y: 0 }
);

var gMailOpenBtn = { x: 330, y: 61, r: 225, g: 121, b: 58 };
var gMailSelectorMoreBtn = { x: 142, y: 142, r: 0, g: 72, b: 171 };
var gMailSelectorHeartsBtn = { x: 144, y: 285, r: 44, g: 102, b: 243 };
var gMailClaimAllBtn = { x: 312, y: 144, r: 255, g: 216, b: 66 };
var gMailClaimItemBtn = { x: 310, y: 204, r: 255, g: 217, b: 68 };
var gMailLeftHeartIcon = { x: 64, y: 199, r: 255, g: 135, b: 198 };
var gMailGetAllOnBtn = { x: 304, y: 146, r: 255, g: 213, b: 58 };
var gMailGetAllOffBtn = { x: 304, y: 146, r: 44, g: 76, b: 187 };

// ========== For Mail Box End ==========
// ========== For Friend Page ==========
var friendBasePoints = [
  { x: 75, y: 94, r: 227, g: 234, b: 246 },
  { x: 284, y: 92, r: 227, g: 234, b: 246 },
  { x: 57, y: 455, r: 255, g: 228, b: 90 },
  { x: 175, y: 450, r: 62, g: 98, b: 255 },
  { x: 292, y: 476, r: 249, g: 192, b: 0 },
  { x: 235, y: 551, r: 254, g: 197, b: 54 },
];

var gFriendPage = new RF.Page('gFriendPage', friendBasePoints, { x: 180, y: 550 }, {});

var gFriendBottomPage = new RF.Page(
  'gFriendBottomPage',
  friendBasePoints.concat([
    { x: 60, y: 409, r: 32, g: 62, b: 189 },
    { x: 87, y: 410, r: 211, g: 70, b: 0 },
    { x: 306, y: 409, r: 29, g: 61, b: 187 },
    { x: 95, y: 397, r: 51, g: 70, b: 202 },
    { x: 98, y: 421, r: 31, g: 63, b: 194 },
  ]),
  { x: 180, y: 550 },
  {}
);

var gFriendSendHeartGiftPage = new RF.Page(
  'gFriendSendHeartGiftPage',
  [
    { x: 95, y: 184, r: 231, g: 236, b: 247 },
    { x: 272, y: 185, r: 231, g: 235, b: 247 },
    { x: 180, y: 251, r: 255, g: 134, b: 196 },
    { x: 179, y: 304, r: 40, g: 78, b: 195 },
    { x: 179, y: 400, r: 55, g: 90, b: 255 },
    { x: 144, y: 448, r: 66, g: 233, b: 251 },
    { x: 289, y: 450, r: 251, g: 222, b: 86 },
  ],
  { x: 283, y: 463 },
  { x: 151, y: 463 }
);

var gFriendOpenBtn = { x: 323, y: 113, r: 41, g: 89, b: 178 };
// ========== For Friend Page End ==========

var gAllGroupPages = new RF.GroupPage('AllPage', [
  gLaunchingPage,
  gLaunchFinishPage,
  gInfoDownloadAsset,
  gMainPage,
  gMainPage2,
  gMainPlayPage,
  gMailBoxPage,
  gMailBoxSelectorOpenedPage,
  gMailClaimHeartPage,
  gMailReceivedRewardPage,
  // gMailGetAllPage, // recognize to different page
  gFriendPage,
  gFriendSendHeartGiftPage,
  gFriendBottomPage,
  gMainPlayingPausePage,
  gLoadingPage,
]);

function Stadium(config) {
  this.screenConfig = new RF.ScreenConfig();
  this.screenConfig.devWidth = 360;
  this.screenConfig.devHeight = 640;
  this.screenConfig.screenWidth = 360;
  this.screenConfig.screenHeight = 640;
  this.screenConfig.actionDuring = 26;

  this.config = {
    sendToZero: config.sendToZero,
  };

  this.screen = new RF.Screen(this.screenConfig);
  this.taskManager = new RF.TaskManager();
  this.running = false;

  if (config.enableSendHeart) {
    this.taskManager.addTask('taskSendHearts', this.taskSendHearts.bind(this));
  }
  if (config.enableReceiveHeart) {
    if (config.receiveAllHearts) {
      this.taskManager.addTask('taskReceiveHeartsAll', this.taskReceiveHeartsAll.bind(this));
    } else {
      this.taskManager.addTask('taskReceiveHeartsOneByOne', this.taskReceiveHeartsOneByOne.bind(this));
    }
  }
  if (config.playGameCount > 0) {
    this.taskManager.addTask('taskPlayGame', this.taskPlayGame.bind(this), config.playGameCount, 1800 * 1000);
  }
}

Stadium.prototype.start = function () {
  this.taskManager.start();
};

Stadium.prototype.stop = function () {
  this.taskManager.stop();
};

// ============ TASK Receive hearts ===========
Stadium.prototype.goMailHeartsPage = function () {
  this.goToMainPage();
  this.screen.tap(gMailOpenBtn);
  if (gMailBoxPage.waitScreenForMatchingScreen(this.screen, 5000, 2, 1000)) {
    console.log('goMailHeartsPage -> MailBoxPage');
    this.screen.tap(gMailSelectorMoreBtn);
  } else {
    return false;
  }
  if (gMailBoxSelectorOpenedPage.waitScreenForMatchingScreen(this.screen, 5000, 2, 1000)) {
    console.log('goMailHeartsPage -> MailBoxSelectorOpenedPage');
    this.screen.tap(gMailSelectorHeartsBtn);
  } else {
    return false;
  }
  RF.Utils.sleep(2000);
  return true;
};

Stadium.prototype.isMailGetAllBtnClickable = function () {
  if (this.screen.isSameColor(gMailGetAllOnBtn) && !this.screen.isSameColor(gMailGetAllOffBtn)) {
    return true;
  }
  return false;
};

Stadium.prototype.taskReceiveHeartsAll = function () {
  if (!this.goMailHeartsPage()) {
    console.log('Can not go to mailHeartsPage');
    return false;
  }
  if (!this.isMailGetAllBtnClickable()) {
    console.log('No hearts to receive');
    return false;
  }
  console.log('Start to receive hearts ...');

  this.screen.tap(gMailClaimAllBtn);
  if (gMailGetAllPage.waitScreenForMatchingScreen(this.screen, 5000, 2, 1000)) {
    gMailGetAllPage.goNext(this.screen);
  } else {
    return false;
  }
  if (gMailReceivedRewardPage.waitScreenForMatchingScreen(this.screen, 5000, 2, 1000)) {
    gMailReceivedRewardPage.goNext(this.screen);
  } else {
    return false;
  }

  console.log('Finish to receive hearts ...');
};

Stadium.prototype.taskReceiveHeartsOneByOne = function () {
  if (!this.goMailHeartsPage()) {
    console.log('Can not go to mailHeartsPage');
    return false;
  }

  for (var i = 0; i < 50; i++) {
    console.log('Receive one heart ...');
    if (this.screen.isSameColor(gMailClaimItemBtn)) {
      this.screen.tap(gMailClaimItemBtn);
      if (gMailClaimHeartPage.waitScreenForMatchingScreen(this.screen, 3000, 2, 500)) {
        console.log('gMailClaimHeartPage Receive Reward OK');
        gMailClaimHeartPage.goNext(this.screen);
      }
      // TODO check loading timeout
      if (gMailReceivedRewardPage.waitScreenForMatchingScreen(this.screen, 30000, 2, 1000)) {
        console.log('gMailReceivedRewardPage OK');
        gMailReceivedRewardPage.goNext(this.screen);
      }
      if (gMailBoxPage.waitScreenForMatchingScreen(this.screen, 5000, 2, 1000)) {
        console.log('Receive one heart done');
      }
    }
    if (!this.isMailGetAllBtnClickable()) {
      console.log('No hearts to receive');
      break;
    }
  }
  return true;
};

// ============ TASK Receive hearts END ===========
// ============ TASK Sends heart ===========
Stadium.prototype.getSendHeartPositions = function () {
  var ys = [];
  var img = this.screen.getCvtDevScreenshot();
  for (var y = 120; y < 426; y += 2) {
    var c = getImageColor(img, 306, y);
    var score = RF.Colors.identityColor(c, { r: 255, g: 93, b: 159 });
    if (score > 0.95) {
      ys.push(y);
      y += 40;
    }
  }
  releaseImage(img);
  return ys;
};

Stadium.prototype.scrollFriendPage = function (y) {
  this.screen.tapDown({ x: 305, y: 400 });
  RF.Utils.sleep(100);
  this.screen.moveTo({ x: 305, y: 400 });
  RF.Utils.sleep(100);
  this.screen.moveTo({ x: 305, y: 400 + y / 2 });
  RF.Utils.sleep(100);
  this.screen.moveTo({ x: 305, y: 400 + y });
  RF.Utils.sleep(600);
  this.screen.tapUp({ x: 305, y: 400 + y });
  RF.Utils.sleep(100);
};

Stadium.prototype.isFriendZeroScore = function (y) {
  var white = 0;
  var img = this.screen.getCvtDevScreenshot();
  for (var x = 152; x < 192; x += 2) {
    var c = getImageColor(img, x, y);
    var score = RF.Colors.identityColor(c, { r: 255, g: 255, b: 255 });
    if (score > 0.9) {
      white++;
    }
  }
  releaseImage(img);
  console.log('white count', white, 'y', y);
  if (white === 0) {
    return true;
  }
  return false;
};

Stadium.prototype.taskSendHearts = function () {
  this.goToMainPage();
  RF.Utils.sleep(2000);
  this.screen.tap(gFriendOpenBtn);
  gFriendPage.waitScreenForMatchingScreen(this.screen, 20000, 2, 1000);
  console.log('Start to send hearts ...');
  // go to top
  this.scrollFriendPage(20000);
  for (var t = 0; t < 100; t++) {
    // Max 600 * 4 = 2400
    console.log('Send Heart Page', t);
    if (gFriendBottomPage.waitScreenForMatchingScreen(this.screen, 100, 1, 200)) {
      console.log('Bottom Page Send heart page');
      break;
    }
    var ys = this.getSendHeartPositions();
    if (ys.length === 0) {
      // move down
      this.scrollFriendPage(-500);
    }
    for (var i = 0; i < ys.length; i++) {
      var y = ys[i];
      if (!this.config.sendToZero) {
        if (this.isFriendZeroScore(y + 8) && this.isFriendZeroScore(y + 16)) {
          console.log('send heart score is zero, break');
          t = 99999;
          break;
        }
      }
      this.screen.tap({ x: 306, y: y });
      if (!gFriendSendHeartGiftPage.waitScreenForMatchingScreen(this.screen, 3000, 2, 600)) {
        console.log('Not match gFriendSendHeartGiftPage');
        break;
      }
      gFriendSendHeartGiftPage.goNext(this.screen);
      RF.Utils.sleep(1000);
      if (!gFriendPage.waitScreenForMatchingScreen(this.screen, 3000, 2, 600)) {
        console.log('Not match gFriendPage');
        break;
      }
    }
  }
};

// ============ TASK Sends heart END ===========
// ============ TASK Play game ===========
Stadium.prototype.goToPlayingPage = function () {
  console.log('Going to playing page');
  this.goToMainPage();
  this.screen.tap(gPlayBtn);
  if (!gMainPlayPage.waitScreenForMatchingScreen(this.screen, 3000, 2)) {
    console.log('Can not go to play page');
    return false;
  }
  RF.Utils.sleep(1000);
  this.screen.tap(gPlayBtn);
  if (gPlayNoEnoughHearts.waitScreenForMatchingScreen(this.screen, 3000, 2)) {
    console.log('No enough hearts!');
    return false;
  }
  if (!gMainPlayingPage.waitScreenForMatchingScreen(this.screen, 40000, 2)) {
    console.log('Can not go to playing page');
    return false;
  }
  console.log('In playing page');
  return true;
};

Stadium.prototype.tapRandomBubbles = function () {
  var gameBubbles = [
    { x: 143, y: 441 },
    { x: 157, y: 372 },
    { x: 184, y: 407 },
    { x: 227, y: 443 },
    { x: 132, y: 421 },
    { x: 187, y: 420 },
    { x: 163, y: 479 },
    { x: 243, y: 483 },
    { x: 280, y: 463 },
    { x: 226, y: 371 },
    { x: 236, y: 236 },
    { x: 176, y: 480 },
    { x: 44, y: 422 },
  ];
  for (var i = 0; i < 3; i++) {
    var xy = gameBubbles[Math.floor(Math.random() * gameBubbles.length)];
    this.screen.tap(xy);
  }
};

Stadium.prototype.scanBoard = function (srcImg, tsumKindCount) {
  var avgColorPoints = this.findCircles(srcImg);
  var tsumColors = this.classifyTsums(avgColorPoints);
  tsumColors.sort(function (a, b) {
    return a.points.length > b.points.length ? -1 : 1;
  });
  var board = [];
  for (var i = 0; i < tsumColors.length; i++) {
    var tsumColor = tsumColors[i];
    for (var p in tsumColor.points) {
      var point = tsumColor.points[p];
      board.push({
        tsumIdx: i,
        x: point.x - 8, // 8 is tsum radius, tsumWidth(16) / 2
        y: point.y - 8, // make x,y to left top
      });
      // if (Game.debug) {
      //   drawCircle(srcImg, point.x, point.y, 4, Game.colorsDB[i % 5][0], Game.colorsDB[i % 5][1], Game.colorsDB[i % 5][2], 0);
      // }
    }
  } // for
  // if (Game.debug) {
  //   saveImage(srcImg, `/sdcard/Robotmon/tmp/board-${Date.now()}.jpg`);
  // }
  return board;
};

Stadium.prototype.findCircles = function (img) {
  var hsvImg = clone(img);
  smooth(hsvImg, 1, 7);
  convertColor(hsvImg, 40);
  var filter1 = outRange(hsvImg, 80, 160, 20, 0, 120, 255, 210, 255);
  var filter2 = outRange(filter1, 80, 100, 90, 0, 130, 170, 190, 255);
  var mask = bgrToGray(filter2);

  releaseImage(filter1);
  releaseImage(filter2);

  var points = houghCircles(mask, 3, 1, 22, 4, 7, 8, 14);

  smooth(hsvImg, 1, 22);
  var results = [];
  for (var k in points) {
    var p = points[k];
    // console.log(k, p.x, p.y, p.r);
    // drawCircle(img, Math.floor(p.x), Math.floor(p.y), Math.floor(p.r), 255, 0, 0, 0);
    var hsv1 = getImageColor(hsvImg, p.x, p.y);
    var hsv2 = hsv1;
    var hsv3 = hsv1;
    var hsv4 = hsv1;
    var hsv5 = hsv1;
    if (p.x - 1 >= 0) {
      hsv2 = getImageColor(hsvImg, p.x - 1, p.y);
    }
    if (p.x + 1 < 200) {
      hsv3 = getImageColor(hsvImg, p.x + 1, p.y);
    }
    if (p.y - 1 >= 0) {
      hsv4 = getImageColor(hsvImg, p.x, p.y - 1);
    }
    if (p.y + 1 < 200) {
      hsv5 = getImageColor(hsvImg, p.x, p.y + 1);
    }
    var avgb = (hsv1.b + hsv2.b + hsv3.b + hsv4.b + hsv5.b) / 5;
    var avgg = (hsv1.g + hsv2.g + hsv3.g + hsv4.g + hsv5.g) / 5;
    var avgr = (hsv1.r + hsv2.r + hsv3.r + hsv4.r + hsv5.r) / 5;
    results.push({ x: p.x, y: p.y, z: p.r, b: avgb, g: avgg, r: avgr });
  }

  // if (Game.debug) {
  //   saveImage(img, getStoragePath() + "/tmp/circle.jpg");
  //   saveImage(mask, getStoragePath() + "/tmp/mask.jpg");
  //   saveImage(hsvImg, getStoragePath() + "/tmp/hsvImg.jpg");
  // }
  releaseImage(mask);
  releaseImage(hsvImg);

  return results;
};

Stadium.prototype.classifyTsums = function (points) {
  if (points.length === 0) {
    return [];
  }
  var tsumColors = [];
  for (var p in points) {
    var point = points[p];
    var isSame = false;
    for (var t in tsumColors) {
      var tsumColor = tsumColors[t];
      var d = this.distance3D(tsumColor, point);
      // merge near circles
      if (d < 15) {
        var count = tsumColor.points.length + 1;
        isSame = true;
        tsumColor.sumb += point.b;
        tsumColor.sumg += point.g;
        tsumColor.sumr += point.r;
        tsumColor.b = tsumColor.sumb / count;
        tsumColor.g = tsumColor.sumg / count;
        tsumColor.r = tsumColor.sumr / count;
        tsumColor.points.push(point);
        break;
      }
    }
    if (!isSame) {
      tsumColors.push({
        sumb: point.b,
        sumg: point.g,
        sumr: point.r,
        b: point.b,
        g: point.g,
        r: point.r,
        points: [point],
      });
    }
  }
  return tsumColors;
};

Stadium.prototype.distance3D = function (p1, p2) {
  var d = Math.sqrt((p1.b - p2.b) * (p1.b - p2.b) + (p1.g - p2.g) * (p1.g - p2.g) + (p1.r - p2.r) * (p1.r - p2.r));
  if (Math.abs(p1.b - p2.b) < 20) {
    d -= 10;
  }
  if (Math.abs(p1.g - p2.g) < 20) {
    d -= 10;
  }
  if (p1.r < 120 && p2.r < 120) {
    d -= 20;
  }
  return d;
};

Stadium.prototype.groupNearTsums = function (tsums) {
  var groupsTsums = [];
  for (var i = 0; i < tsums.length; i++) {
    var curTsum = tsums[i];
    var findGroup = false;
    // find suitable group
    for (var gt in groupsTsums) {
      var groupTsums = groupsTsums[gt];
      for (var t in groupTsums) {
        var gTsum = groupTsums[t];
        var dis = this.getDistance(curTsum, gTsum);
        if (dis > TsumLinkDistance) {
          continue;
        }
        findGroup = true;
        groupTsums.push(curTsum);
        break;
      }
      if (findGroup) {
        break;
      }
    }
    if (!findGroup) {
      groupsTsums.push([curTsum]);
    }
  }
  // make sure tsum count in group is more than 3
  return groupsTsums.filter(function (v) {
    return v.length > 3;
  });
};

Stadium.prototype.calculatePaths = function (board) {
  var now = Date.now();
  var tsums = {};
  for (var t in board) {
    var tsum = board[t];
    var idx = tsum.tsumIdx;
    if (tsums[idx] == undefined) {
      tsums[idx] = [];
    }
    tsums[idx].push(tsum);
  }

  var allPaths = [];
  for (var tsumIdx in tsums) {
    var groupsTsums = this.groupNearTsums(tsums[tsumIdx]);
    if (groupsTsums.length === 0) {
      continue;
    }
    for (var i = 0; i < groupsTsums.length; i++) {
      var groupTsums = groupsTsums[i];
      var paths = [];

      for (var t in groupTsums) {
        var tsum = groupTsums[t];
        var path = this.calculateNearTsumPaths(tsum, groupTsums);
        if (path.length <= 2) {
          continue;
        }
        var alreadExist = false;
        for (var p in paths) {
          var point = paths[p];
          if (point.length === paths.length) {
            alreadExist = true;
          }
        }
        if (!alreadExist) {
          paths.push(path);
        }
      }
      paths.sort(function (a, b) {
        return b.length - a.length;
      });
      if (paths.length > 0) {
        allPaths.push(paths[0]);
      }
    }
  }

  allPaths.sort(function (a, b) {
    return b.length - a.length;
  });
  // console.log('calculated path count:', paths.length);
  this.log('groupsTsums calculatePaths2 usedTime', Date.now() - now, 'allPath count', allPaths.length);
  return allPaths;
};

Stadium.prototype.calculatePathsOld = function (board) {
  var now = Date.now();
  var tsums = {};
  for (var t in board) {
    var tsum = board[t];
    var idx = String(tsum.tsumIdx);
    if (tsums[idx] == undefined) {
      tsums[idx] = [];
    }
    tsums[idx].push(tsum);
  }
  var centers = {};
  var paths = [];

  for (var tsumIdx in tsums) {
    for (var i = 0; i < tsums[tsumIdx].length; i++) {
      var path = this.calculateNearTsumPaths(tsums[tsumIdx][i], tsums[tsumIdx]);
      if (path.length > 2) {
        var c = this.calculatePathCenter(path);
        if (centers[c.x] == c.y) {
          // path already exists
        } else {
          centers[c.x] = c.y;
          paths.push(path);
        }
      } else {
        tsums[tsumIdx].splice(i, 1);
        i--;
      }
    }
  }

  paths.sort(function (a, b) {
    return b.length - a.length;
  });
  this.log('calculatePaths usedTime', Date.now() - now, 'allPath count', paths.length);
  return paths;
};

Stadium.prototype.calculatePathCenter = function (path) {
  var cx = 0;
  var cy = 0;
  for (var i in path) {
    cx += path[i].x;
    cy += path[i].y;
  }
  return { x: Math.floor(cx / path.length), y: Math.floor(cy / path.length) };
};

Stadium.prototype.calculateNearTsumPaths = function (tsum, ts) {
  var path = [];
  var tsums = ts.slice(); // copy array
  while (true) {
    var result = this.findNearTsum(tsum, tsums);
    var minDis = result.dis;
    var minTsum = result.tsum;
    var minIdx = result.idx;
    if (minIdx == -1 || minDis > TsumLinkDistance) {
      break;
    }
    tsum = minTsum;
    tsums.splice(minIdx, 1);
    path.push(tsum);
  }
  return path;
};

Stadium.prototype.findNearTsum = function (tsum, tsums) {
  var minDis = 99999;
  var minTsum;
  var idx = -1;
  for (var i = 0; i < tsums.length; i++) {
    var dis = this.getDistance(tsum, tsums[i]);
    if (dis < minDis) {
      minDis = dis;
      minTsum = tsums[i];
      idx = i;
    }
  }
  return { dis: minDis, tsum: minTsum, idx: idx };
};

Stadium.prototype.getDistance = function (t1, t2) {
  return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));
};

Stadium.prototype.linkPath = function (path) {
  // path = this.simplifyPath(path);
  path = path.splice(0, 10);
  for (var j = 0; j < path.length; j++) {
    var point = path[j];
    var x = Math.floor(point.x * 1.8 + 8);
    var y = Math.floor(point.y * 1.8 + 160 + 8);
    if (j == 0) {
      RF.Utils.sleep(3);
      this.screen.tapDown(x, y);
      // this.log('linkStart', x, y);
    }
    this.screen.moveTo(x, y);
    // RF.Utils.sleep(3);
    if (j == path.length - 1) {
      this.screen.tapUp(x, y);
      // this.log('linkEnd', x, y);
      RF.Utils.sleep(3);
    }
  }
};

Stadium.prototype.simplifyPath = function (path) {
  var path1 = [];
  for (var p in path) {
    var pos = path[p];
    path1.push([pos.x, pos.y]);
  }
  var path2 = simplify(path1, 20);
  var newPath = [];
  for (var p in path2) {
    var pos = path2[p];
    newPath.push({ tsumIdx: 0, x: pos[0], y: pos[1] });
  }
  console.log('simplifyPath length', path.length, newPath.length);
  return newPath;
};

Stadium.prototype.linkPaths = function (paths) {
  paths = paths.splice(0, 3);
  var hasBubble = false;
  for (var p in paths) {
    var path = paths[p];
    if (path.length >= 8) {
      hasBubble = true;
    }
    this.linkPath(path);
  }
  return hasBubble;
};

Stadium.prototype.playOneTime = function () {
  var now = Date.now();
  var playImg = this.getGameScreenshot();
  var tsumBoard = this.scanBoard(playImg, 5);
  releaseImage(playImg);
  console.log('scanBoard time', Date.now() - now);

  now = Date.now();
  var paths;
  if (now % 2 === 1) {
    paths = this.calculatePaths(tsumBoard);
  } else {
    paths = this.calculatePathsOld(tsumBoard);
  }
  console.log('calculated path count:', paths.length);
  if (paths.length <= 1) {
    this.screen.tap(gPlayFanBtn1);
  }
  console.log('calculatePaths time', Date.now() - now);
  now = Date.now();

  var hasBubble = this.linkPaths(paths);
  console.log('linkPath time', Date.now() - now, hasBubble);
  now = Date.now();
  this.tapRandomBubbles();
  console.log('tapRandomBubbles time', Date.now() - now);
  return paths.length;
};

Stadium.prototype.getGameScreenshot = function () {
  var wholeImage = this.screen.getCvtDevScreenshot();
  var img = cropImage(wholeImage, 0, 160, 360, 360);
  var rimg = resizeImage(img, 200, 200);
  releaseImage(img);
  releaseImage(wholeImage);
  return rimg;
};

Stadium.prototype.isMatchSkill = function () {
  var points = [gPlaySkill1Btn1, gPlaySkill1Btn2, gPlaySkill2Btn1, gPlaySkill2Btn2];
  var match = false;
  var img = this.screen.getCvtDevScreenshot();
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var c = getImageColor(img, point.x, point.y);
    var score = RF.Colors.identityColor(c, point);
    if (score > 0.9) {
      match = true;
      break;
    }
  }
  releaseImage(img);
  return match;
};

Stadium.prototype.taskPlayGame = function () {
  if (!this.goToPlayingPage()) {
    console.log('Can not go to playing page');
    return;
  }
  console.log('Start to play game ...');
  var now = Date.now();
  var exitTimes = 0;
  for (var i = 0; i < 140; i++) {
    console.log('Round ', i, 'usedTime', Date.now() - now);
    this.playOneTime();
    RF.Utils.sleep(30);
    if (this.isMatchSkill()) {
      console.log('Use Skill ...');
      this.screen.tap(gPlaySkill1Btn1);
      this.screen.tap(gPlaySkill2Btn1);
      RF.Utils.sleep(2000);
    }
    if (!this.screen.isSameColor(gPlayFanBtn1) && !this.screen.isSameColor(gPlayFanBtn2)) {
      if (exitTimes++ > 4) {
        console.log('Gameover Exit');
        break;
      }
    }
  }
};

Stadium.prototype.log = RF.Utils.log;

// ============ TASK Play game END ===========

Stadium.prototype.goToMainPage = function () {
  var startTime = Date.now();
  var matchTimes = 0;
  var loadingTimes = 0;
  for (var i = 0; i < 300; i++) {
    RF.Utils.sleep(2000);
    // check is app on
    var capps = RF.Utils.getCurrentApp();
    if (capps[0] !== 'com.linecorp.LGTM2') {
      RF.Utils.startApp('com.linecorp.LGTM2/.MainActivity');
      continue;
    }
    if (capps[1] !== '.MainActivity') {
      // Other page like PromotionWebView
      keycode('KEYCODE_BACK', 200);
      continue;
    }
    // check is main page
    var pages = gAllGroupPages.isMatchScreen(this.screen);
    if (pages.length === 0) {
      console.log('goToMainPage -> currentPage UnknownPage', 'usedTime', Date.now() - startTime);
      if (i % 2 === 1) {
        keycode('KEYCODE_BACK', 200);
      }
      if (i % 4 === 3) {
        this.screen.tap({ x: 210, y: 310 });
      }
      continue;
    }
    var currentPageName = pages[0];
    var currentPage = gAllGroupPages.getPageByName(currentPageName);
    console.log('goToMainPage -> currentPage', currentPageName, 'usedTime', Date.now() - startTime);
    if (currentPageName === 'gMainPage') {
      matchTimes++;
      if (matchTimes > 1) {
        break;
      }
    } else if (currentPageName === 'gLaunchFinishPage' || currentPageName === 'gLaunchingPage') {
      gLaunchFinishPage.goNext(this.screen);
    } else if (currentPageName === 'gMainPlayingPausePage') {
      gMainPlayingPausePage.goNext(this.screen); // Try again, exit playing game page
    } else if (currentPageName === 'gInfoDownloadAsset') {
      gInfoDownloadAsset.goNext(this.screen);
    } else if (currentPageName === 'gLoadingPage') {
      loadingTimes++;
      if (loadingTimes > 12) {
        console.log('Always loding, restart app ...');
        RF.Utils.stopApp('com.linecorp.LGTM2');
        RF.Utils.sleep(3000);
        loadingTimes = 0;
      }
    } else {
      matchTimes = 0;
      loadingTimes = 0;
      keycode('KEYCODE_BACK', 200);
    }
  }
  RF.Utils.sleep(1000);
};

function start(json) {
  var config = {
    // default config
    enableSendHeart: true,
    enableReceiveHeart: true,
    playGameCount: 20,
    sendToZero: false,
    receiveAllHearts: false,
    receiveExtraCheckTimes: 0,
  };
  if (json !== undefined) {
    try {
      config = JSON.parse(json);
    } catch (e) {}
  }

  var stadium = new Stadium(config);
  var pages = gAllGroupPages.isMatchScreen(stadium.screen);
  console.log(pages.join(', '));
  // stadium.taskReceiveHeartsAll();
  // console.log(stadium.isMailGetAllBtnClickable());
  // stadium.handlePages();
  // stadium.taskSendHearts();
  // stadium.isFriendZeroScore(286)
  // stadium.scrollFriendPage(-20000);
  stadium.start();
}

// =============== FOR TESTING ================
function printPagePointsColor(page) {
  var img = getScreenshotModify(0, 0, 360, 640, 360, 640, 100);
  for (var i in page.points) {
    var xyrgb = page.points[i];
    var color = getImageColor(img, xyrgb.x, xyrgb.y);
    var r = color.r;
    var g = color.g;
    var b = color.b;
    console.log('{x: ' + xyrgb.x + ', y: ' + xyrgb.y + ', r: ' + r + ', g: ' + g + ', b: ' + b + '}');
  }
  releaseImage(img);
}
// printPagePointsColor(gLaunchFinishPage);
