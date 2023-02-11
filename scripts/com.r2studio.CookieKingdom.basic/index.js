/* prettier-ignore */ !function (e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.RF = t() : e.RF = t() }(this, (function () { return function () { "use strict"; var e = { 607: function (e, t, r) { var o = this && this.__createBinding || (Object.create ? function (e, t, r, o) { void 0 === o && (o = r), Object.defineProperty(e, o, { enumerable: !0, get: function () { return t[r] } }) } : function (e, t, r, o) { void 0 === o && (o = r), e[o] = t[r] }), n = this && this.__exportStar || function (e, t) { for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r) }; Object.defineProperty(t, "__esModule", { value: !0 }), t.version = void 0, n(r(850), t), n(r(985), t), n(r(837), t), n(r(459), t), n(r(231), t), n(r(200), t), n(r(656), t), n(r(708), t), n(r(974), t), t.version = 1 }, 850: function (e, t) { Object.defineProperty(t, "__esModule", { value: !0 }), t.GroupPage = void 0; var r = function () { function e(e, t) { this.name = e, this.pages = t } return e.prototype.isMatchImage = function (e, t) { void 0 === t && (t = .9); for (var r = [], o = 0, n = this.pages; o < n.length; o++) { var i = n[o]; i.isMatchImage(e, t) && r.push(i.name) } return r }, e.prototype.isMatchScreen = function (e, t) { void 0 === t && (t = .9); var r = e.getCvtDevScreenshot(), o = this.isMatchImage(r, t); return releaseImage(r), o }, e.prototype.waitScreenForMatchingOne = function (t, r, o, n, i) { void 0 === o && (o = 1), void 0 === n && (n = 600), void 0 === i && (i = .9), e.debug && console.log("GroupPage.waitScreenForMatchingOne " + this.name + ": " + this.pages.map((function (e) { return e.name })).join(",")); for (var s = Date.now(), a = "", c = 0; Date.now() - s < r;) { for (var f = t.getCvtDevScreenshot(), m = 0, h = this.pages; m < h.length; m++) { var g = h[m]; if (g.isMatchImage(f, i)) { a !== g.name && (a = g.name, c = 0), c++; break } } if (releaseImage(f), "" !== a && c >= o) break; sleep(n) } return e.debug && console.log("GroupPage.waitScreenForMatchingOne " + this.name + ": matched: " + a + ", usedTime " + (Date.now() - s)), a }, e.debug = !1, e }(); t.GroupPage = r }, 985: function (e, t, r) { Object.defineProperty(t, "__esModule", { value: !0 }), t.Page = void 0; var o = r(656), n = function () { function e(e, t, r, o) { void 0 === r && (r = void 0), void 0 === o && (o = void 0), this.name = e, this.points = t, this.next = r, this.back = o } return e.prototype.goNext = function (t) { void 0 !== this.next ? t.tap(this.next) : e.debug && console.log("Warning Page: " + this.name + " has no next xy") }, e.prototype.goBack = function (t) { void 0 !== this.back ? t.tap(this.back) : e.debug && console.log("Warning Page: " + this.name + " has no back xy") }, e.prototype.isMatchImage = function (e, t) { void 0 === t && (t = .9); for (var r = !0, n = 0, i = this.points; n < i.length; n++) { var s = i[n], a = getImageColor(e, s.x, s.y); if (o.Colors.identityColor(s, a) < t) { r = !1; break } } return r }, e.prototype.isMatchScreen = function (e, t) { void 0 === t && (t = .9); var r = e.getCvtDevScreenshot(), o = this.isMatchImage(r, t); return releaseImage(r), o }, e.prototype.waitScreenForMatchingScreen = function (t, r, o, n, i) { void 0 === o && (o = 1), void 0 === n && (n = 600), void 0 === i && (i = .9), e.debug && console.log("Page.waitScreenForMatchingScreen " + this.name); for (var s = Date.now(), a = 0; Date.now() - s < r && (this.isMatchScreen(t, i) && a++, !(a >= o));)sleep(n); return a >= o ? (e.debug && console.log("Page.waitScreenForMatchingScreen " + this.name + " success, usedTime " + (Date.now() - s)), !0) : (e.debug && console.log("Page.waitScreenForMatchingScreen " + this.name + " timeout"), !1) }, e.debug = !1, e }(); t.Page = n }, 837: function (e, t) { Object.defineProperty(t, "__esModule", { value: !0 }), t.XYRGB = void 0; t.XYRGB = function () { this.x = 0, this.y = 0, this.r = 0, this.g = 0, this.b = 0 } }, 459: function (e, t, r) { Object.defineProperty(t, "__esModule", { value: !0 }), t.Screen = void 0; var o = r(656), n = function () { function e(e) { this.config = e; var t = getScreenSize(); this.config.deviceHeight = t.height, this.config.deviceWidth = t.width, this.config.screenWidth = t.width, this.config.screenHeight = t.height, this.config.screenOffsetX = 0, this.config.screenOffsetY = 0 } return e.prototype.calculateDeviceOffset = function (e) { var t = e(this); this.config.screenWidth = t.screenWidth, this.config.screenHeight = t.screenHeight, this.config.screenOffsetX = t.screenOffsetX, this.config.screenOffsetY = t.screenOffsetY }, e.prototype.getScreenX = function (e) { return Math.floor(this.config.screenOffsetX + e * this.config.screenWidth / this.config.devWidth) || 0 }, e.prototype.getScreenY = function (e) { return Math.floor(this.config.screenOffsetY + e * this.config.screenHeight / this.config.devHeight) || 0 }, e.prototype.getScreenXY = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) return { x: this.getScreenX(e.x), y: this.getScreenY(e.y) }; if ("number" == typeof e && "number" == typeof t) return { x: this.getScreenX(e), y: this.getScreenY(t) }; throw new Error("getScreenXY wrong params " + e + ", " + t) }, e.prototype.tap = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) { var r = this.getScreenX(e.x), o = this.getScreenY(e.y); tap(r, o, this.config.actionDuring) } else { if ("number" != typeof e || "number" != typeof t) throw new Error("tapDown wrong params " + e + ", " + t); r = this.getScreenX(e), o = this.getScreenY(t), tap(r, o, this.config.actionDuring) } }, e.prototype.tapDown = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) { var r = this.getScreenX(e.x), o = this.getScreenY(e.y); tapDown(r, o, this.config.actionDuring) } else { if ("number" != typeof e || "number" != typeof t) throw new Error("tapDown wrong params " + e + ", " + t); r = this.getScreenX(e), o = this.getScreenY(t), tapDown(r, o, this.config.actionDuring) } }, e.prototype.moveTo = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) { var r = this.getScreenX(e.x), o = this.getScreenY(e.y); moveTo(r, o, this.config.actionDuring) } else { if ("number" != typeof e || "number" != typeof t) throw new Error("tapDown wrong params " + e + ", " + t); r = this.getScreenX(e), o = this.getScreenY(t), moveTo(r, o, this.config.actionDuring) } }, e.prototype.tapUp = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) { var r = this.getScreenX(e.x), o = this.getScreenY(e.y); tapUp(r, o, this.config.actionDuring) } else { if ("number" != typeof e || "number" != typeof t) throw new Error("tapDown wrong params " + e + ", " + t); r = this.getScreenX(e), o = this.getScreenY(t), tapUp(r, o, this.config.actionDuring) } }, e.prototype.getScreenColor = function (e, t) { if (void 0 === t && (t = void 0), "object" == typeof e) { var r = this.getCvtDevScreenshot(), o = getImageColor(r, e.x, e.y); return releaseImage(r), o } if ("number" == typeof e && "number" == typeof t) return r = this.getCvtDevScreenshot(), o = getImageColor(r, e, t), releaseImage(r), o; throw new Error("tapDown wrong params " + e + ", " + t) }, e.prototype.findImage = function (e) { var t = this.getCvtDevScreenshot(), r = findImage(t, e); return releaseImage(t), r }, e.prototype.tapImage = function (e) { var t = this.findImage(e); this.tap(t) }, e.prototype.isSameColor = function (e, t) { void 0 === t && (t = .9); var r = this.getScreenColor(e); return o.Colors.identityColor(r, e) > t }, e.prototype.getDeviceScreenshot = function () { return getScreenshot() }, e.prototype.getScreenScreenshot = function () { return getScreenshotModify(this.config.screenOffsetX, this.config.screenOffsetY, this.config.screenWidth, this.config.screenHeight, this.config.screenWidth, this.config.screenHeight, 100) }, e.prototype.getCvtDevScreenshot = function () { return getScreenshotModify(this.config.screenOffsetX, this.config.screenOffsetY, this.config.screenWidth, this.config.screenHeight, this.config.devWidth, this.config.devHeight, 100) }, e.prototype.setActionDuring = function (e) { this.config.actionDuring = e }, e.debug = !1, e }(); t.Screen = n }, 231: function (e, t) { Object.defineProperty(t, "__esModule", { value: !0 }), t.ScreenConfig = void 0; t.ScreenConfig = function () { this.devWidth = 640, this.devHeight = 360, this.deviceWidth = 0, this.deviceHeight = 0, this.screenWidth = 0, this.screenHeight = 0, this.screenOffsetX = 0, this.screenOffsetY = 0, this.actionDuring = 180 } }, 200: function (e, t, r) { Object.defineProperty(t, "__esModule", { value: !0 }), t.TaskManager = t.Task = void 0; var o = r(974), n = function () { this.name = "", this.runTimes = 1, this.maxRunningDuring = 0, this.minIntervalDuring = 0, this.lastRunDoneTime = 0, this.run = function () { } }; t.Task = n; var i = function () { function e() { this.isRunning = !1, this.runIdx = 0, this.tasks = [] } return e.prototype.addTask = function (e, t, r, o, i) { void 0 === r && (r = 1), void 0 === o && (o = 0), void 0 === i && (i = 0); var s = new n; s.name = e, s.run = t, s.runTimes = r, s.maxRunningDuring = o, s.minIntervalDuring = i, this.tasks.push(s) }, e.prototype.start = function () { if (0 === this.tasks.length) throw new Error("TaskManager: No tasks to run"); for (console.log("TaskManager start"), this.isRunning = !0; this.isRunning;) { var e = Date.now(), t = this.tasks[this.runIdx % this.tasks.length]; if (this.runIdx++, !(e - t.lastRunDoneTime < t.minIntervalDuring)) { console.log("RunTask " + this.runIdx + " " + t.name + ", times " + t.runTimes + ", maxDuring " + t.maxRunningDuring); for (var r = 0; this.isRunning && (console.log("TaskRunning " + t.name + ", times " + r + "/" + t.runTimes), t.run(), t.lastRunDoneTime = Date.now(), r++, !(0 !== t.runTimes && r >= t.runTimes)) && !(Date.now() - e > t.maxRunningDuring);)sleep(100) } } }, e.prototype.stop = function () { this.isRunning = !1, o.Utils.sleep(1e3), console.log("TaskManager stop") }, e }(); t.TaskManager = i }, 656: function (e, t) { Object.defineProperty(t, "__esModule", { value: !0 }), t.Colors = void 0; var r = function () { function e() { } return e.getRangeColor = function (e, t, r, o, n) { void 0 === n && (n = 5); var i = !1; void 0 === e && (i = !0, e = getScreenshot()); for (var s = getImageSize(e), a = Math.max(0, t - o), c = Math.max(0, r - o), f = Math.min(s.width, t + o), m = Math.min(s.height, r + o), h = Math.max(1, (f - a) / n), g = Math.max(1, (m - c) / n), u = 0, p = { r: 0, g: 0, b: 0 }, y = a; y < f; y += h)for (var v = c; v < m; v += g) { var l = getImageColor(e, Math.floor(y), Math.floor(v)); p.r += l.r, p.g += l.g, p.b += l.b, u++ } return i && releaseImage(e), { r: Math.floor(p.r / u), g: Math.floor(p.g / u), b: Math.floor(p.b / u) } }, e.color2hex = function (e) { return ((1 << 24) + (e.r << 16) + (e.g << 8) + e.b).toString(16).slice(1) }, e.hex2Color = function (e) { return { r: parseInt(e[0] + e[1], 16), g: parseInt(e[2] + e[3], 16), b: parseInt(e[4] + e[5], 16) } }, e.identityColor = function (e, t) { var r = (e.r + t.r) / 2, o = e.r - t.r, n = e.g - t.g, i = e.b - t.b; return 1 - Math.sqrt(((512 + r) * o * o >> 8) + 4 * n * n + ((767 - r) * i * i >> 8)) / 768 }, e }(); t.Colors = r }, 708: function (e, t) { Object.defineProperty(t, "__esModule", { value: !0 }), t.OCR = void 0; var r = function () { function e(e) { this.words = e } return e.prototype.recognize = function (e, t, r, o) { void 0 === o && (o = .8); for (var n = 0, i = [], s = 0; s < this.words.length; s++) { var a = this.words[s], c = getImageSize(a.img); n = Math.max(n, c.width); var f = findImages(e, a.img, r, t, !0); for (var m in f) { var h = f[m]; i.push({ char: a.char, x: h.x, y: h.y, score: h.score, w: c.width }) } } i.sort((function (e, t) { return e.x - t.x })); for (var g = "", u = 0, p = 0, y = 0; y < i.length; y++) { var v = i[y]; v.x > u ? (p = v.score, g += v.char, u = Math.floor(v.x + v.w * o)) : v.x <= u && v.score > p && " " !== v.char && (p = v.score, g = g.substr(0, g.length - 1) + v.char, u = Math.floor(v.x + v.w * o)) } return g }, e }(); t.OCR = r }, 974: function (e, t) { var r = this && this.__spreadArray || function (e, t) { for (var r = 0, o = t.length, n = e.length; r < o; r++, n++)e[n] = t[r]; return e }; Object.defineProperty(t, "__esModule", { value: !0 }), t.Utils = t.log = void 0, t.log = function () { for (var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t]; for (var r = (new Date).toLocaleString("en-US", { timeZone: "Asia/Taipei" }), o = "[" + r + "] ", n = 0, i = e; n < i.length; n++) { var s = i[n]; o += "object" == typeof s ? JSON.stringify(s) + " " : s + " " } console.log(o.substr(0, o.length - 1)) }; var o = function () { function e() { } return e.sortStringNumberMap = function (e) { var t = []; for (var r in e) t.push({ key: r, count: e[r] }); return t.sort((function (e, t) { return t.count - e.count })), t }, e.sleep = function (e) { for (; e > 200;)e -= 200, sleep(200); e > 0 && sleep(e) }, e.getTaiwanTime = function () { return Date.now() + 288e5 }, e.log = function () { for (var t = [], o = 0; o < arguments.length; o++)t[o] = arguments[o]; for (var n = 0; n < t.length; n++) { var i = t[n]; "object" == typeof i && (t[n] = JSON.stringify(i)) } var s = new Date(e.getTaiwanTime()), a = "[" + (s.getMonth() + 1) + "-" + s.getDate() + "T" + s.getHours() + ":" + s.getMinutes() + ":" + s.getSeconds() + "]"; console.log.apply(console, r([a], t)) }, e.notifyEvent = function (t, r) { null != sendEvent && (e.log("sendEvent", t, r), sendEvent("" + t, "" + r)) }, e.startApp = function (e) { execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n " + e), execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n " + e) }, e.stopApp = function (e) { execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop " + e), execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop " + e) }, e.getCurrentApp = function () { for (var e = "", t = "", r = 0, o = execute("dumpsys activity top").split("\n"); r < o.length; r++) { var n = o[r], i = n.indexOf("ACTIVITY"); if (-1 !== i) { e = "", t = ""; for (var s = !0, a = i + 9; a < n.length; a++) { var c = n[a]; if (" " === c) break; "/" === c ? s = !1 : s ? e += c : t += c } } } return [e, t] }, e }(); t.Utils = o } }, t = {}; return function r(o) { var n = t[o]; if (void 0 !== n) return n.exports; var i = t[o] = { exports: {} }; return e[o].call(i.exports, i, i.exports, r), i.exports }(607) }() }));
// var rfaaaa = new RF.Page(
//   'rfaaaa',
//   aaaa,
//   aaaa[0]
// );

var config = {
  sleep: 240,
  sleepAnimate: 800,
  sleepWhenDoubleLoginInMinutes: 30,

  account: 'default_xrobotmon_account@gmail.com',
  password: '',
  materialsTarget: 2000,
  goodsTarget: 320,
  productSafetyStock: 10,
  skipMagicLabProduction: true,
  magicLabProductIndex: 13,
  autoCollectMailIntervalInMins: 120,
  autoCollectFountainIntervalInMins: 40,
  autoCollectTrainIntervalInMins: 20,
  autoSendHotAirBallonIntervalInMins: 40,
  isHotAirBallonGotoEp4: false,
  ballonKeepCurrentDestination: false,
  autoCollectDailyReward: true,
  autoFulfillWishesIntervalInMins: 10,
  alwaysFulfillWishes: false,
  wishingTreeSafetyStock: 10,
  wishingTreeMaxFillingMins: 8,
  wishingTreeRefreshGoldenWishes: true,
  wishingTreeForceFulfillGoldWishes: false,
  autoHandleEventWishingTreeAmounts: 0,
  autoPvPIntervalInMins: 0,
  autoPvPTargetScoreLimit: 1000000,
  autoPvPPurchaseAncientCookie: true,
  worksBeforeCollectCandy: 40,
  autoUpgradeCandyHouse: true,
  helpTapGreenCheck: true,
  autoCollectTropicalIslandsIntervalInMins: 40,
  autoGuildAllianceBattle: true,
  autoAllianceUseTimeJumpers: false,
  autoGuildClaimNewLand: false,
  autoGuildBattleDragon: false,
  autoHandleBountiesIntervalInMins: 180,
  autoBountiesCheckBluePowder: true,
  autoLabResearch: false,
  autoResearchKingdom: true,
  autoResearchCookies: true,
  autoLabUseAuroraMaterial: true,
  autoHandleTradeHabor: true,
  autoBalanceAuroraStocks: true,
  autoShopInSeasideMarket: false,
  autoBuyCaramelStuff: false,
  autoBuyRadiantShardsInHabor: true,
  autoBuySeaFairy: true,
  autoBuyEpicSoulEssence: true,
  autoBuyLegendSoulEssence: true,
  autoBuyGuildRelic: true,
  axeStockTo400: false,
  autoSuperMayhemIntervalInMins: 0,
  autoSuperMayhemTargetScoreLimit: 1000000,
  autoHandleTowerOfSweetChaos: true,
  autoHandleCollectCookieOdysseyMission: true,
  buildTowardsTheLeft: true,
  isTestAccount: false,

  jobFailedCount: 4,
  jobFailedBeforeGetCandy: 3,
  productionBuildingChecked: 0,
  productionDashboardEnabled: true,
  currentProductionBuilding: 'NONE',
  lastNetworkIssueOccurTime: 0,
  networkIssueCount: 0,
  networkIssueCountThreasHold: 20,
  lastGotoProduction: 0,
  lastCollectCandyTime: 0,
  lastCollectMail: 0,
  lastCollectFountain: 0,
  lastCollectTrain: 0,
  lastSendHotAirBallon: 0,
  lastCollectDailyReward: 0,
  lastFulfillWishes: 0,
  lastAutoHandleEventWishingTree: 0,
  lastAutoPvP: 0,
  lastAutoSuperMayhem: 0,
  battleMaxLoops: 3,
  lastCollectTropicalIsland: 0,
  lastAutoGuildBattle: 0,
  lastAutoHandleBounties: 0,
  lastLabResearch: 0,
  lastHandleTradeHabor: 0,
  lastAutoHandleTowerOfSweetChaos: 0,
  lastAutoHandleCollectCookieOdysseyMission: 0,
  lastTryResolveGreenChecks: 0,
  lastFreezeCheckScreenShot: null,
  lastFreezeCheckScreenShotTime: Date.now(),
  run: true,
  isXR: true,
  findProductionTimes: 4,
  wishRefreshThreashold: 5,
  searchHouseCount: 0,
  keepProduceUntilWoodEnough: true,
  loginRetryMaxTimes: 2,
  loginRetryCount: 0,
  tryRestartGameLimit: 5,

  stock_axe: 60,
  stock_pickaxe: 60,
  stock_saw: 60,
  stock_shovel: 60,
  stock_stack: 60,
  stock_tongs: 60,
  stock_hammer: 60,
  stock_jellybeanJam: 60,
  stock_jellyJam: 60,
  stock_toffeeJam: 60,
  stock_pomegranateJam: 60,
  stock_sparkleberryJam: 60,
  stock_pineconeBirdyToy: 60,
  stock_acornLamp: 60,
  stock_cuckooClock: 60,
  stock_dreamcatcher: 60,
  stock_heartyRye: 60,
  stock_tartJampie: 60,
  stock_ginkgoFocaccia: 60,
  stock_glazedDonuts: 60,
  stock_flyffyCastella: 60,
  stock_goldenCroissant: 60,
  stock_hotJellyStew: 60,
  stock_bearJellyBurger: 60,
  stock_candyPasta: 60,
  stock_fluffyOmurice: 60,
  stock_jellyDeluxePizza: 60,
  stock_fancyJellybeanMeal: 60,
  stock_biscuitPlanter: 60,
  stock_shinyGlass: 60,
  stock_gleamyBead: 60,
  stock_colorfulBowl: 60,
  stock_candyFlower: 60,
  stock_happyPlanter: 60,
  stock_candyBouquet: 60,
  stock_lollipopFlowerBasket: 60,
  stock_bellFlowerBouquet: 60,
  stock_glitteringYogurtWeeath: 60,
  stock_cream: 60,
  stock_butter: 60,
  stock_homemadeCheese: 60,
  stock_jellybeanLatte: 60,
  stock_bubblyBoba: 60,
  stock_sweetberryJuicy: 60,
  stock_cloudPillow: 60,
  stock_bearJellyToy: 60,
  stock_pitayaDragonToy: 60,
  stock_creamRootBeer: 60,
  stock_redberryJuice: 60,
  stock_vintageRootBottle: 60,
  stock_spookyMuffin: 60,
  stock_strawberryCake: 60,
  stock_partyCake: 60,
  stock_glazedRing: 60,
  stock_rubyberryBrooch: 40,
  stock_bearJellyCrown: 40,
};

var rfpageWoodFarm = new RF.Page(
  'rfpageWoodFarm',
  [
    { x: 596, y: 118, r: 123, g: 207, b: 8 },
    { x: 527, y: 86, r: 140, g: 81, b: 57 },
    { x: 520, y: 91, r: 249, g: 192, b: 139 },
    { x: 427, y: 79, r: 140, g: 81, b: 57 },
  ],
  { x: 596, y: 118 }
);

var rfpageBeanFarm = new RF.Page(
  'rfpageBeanFarm',
  [
    { x: 602, y: 122, r: 123, g: 207, b: 8 },
    { x: 527, y: 83, r: 0, g: 204, b: 223 },
    { x: 525, y: 88, r: 1, g: 252, b: 248 },
    { x: 414, y: 82, r: 0, g: 207, b: 220 },
  ],
  { x: 602, y: 122 }
);
var rfpageSugarFarm = new RF.Page(
  'rfpageSugarFarm',
  [
    { x: 600, y: 118, r: 123, g: 207, b: 8 },
    { x: 531, y: 92, r: 135, g: 151, b: 200 },
    { x: 419, y: 71, r: 244, g: 250, b: 253 },
    { x: 411, y: 89, r: 239, g: 240, b: 249 },
  ],
  { x: 600, y: 118 }
);
var rfpagePowderFarm = new RF.Page(
  'rfpagePowderFarm',
  [
    { x: 596, y: 120, r: 123, g: 207, b: 8 },
    { x: 523, y: 87, r: 231, g: 157, b: 74 },
    { x: 435, y: 90, r: 156, g: 117, b: 49 },
    { x: 423, y: 83, r: 239, g: 162, b: 82 },
  ],
  { x: 596, y: 120 }
);
var rfpageBarryFarm = new RF.Page(
  'rfpageBarryFarm',
  [
    { x: 597, y: 118, r: 123, g: 207, b: 8 },
    { x: 527, y: 90, r: 198, g: 36, b: 41 },
    { x: 428, y: 76, r: 28, g: 117, b: 16 },
    { x: 413, y: 82, r: 200, g: 26, b: 31 },
  ],
  { x: 597, y: 118 }
);

var rfpageMilkFarm = new RF.Page(
  'rfpageMilkFarm',
  [
    { x: 597, y: 118, r: 123, g: 207, b: 8 },
    { x: 521, y: 79, r: 214, g: 138, b: 99 },
    { x: 526, y: 90, r: 255, g: 255, b: 239 },
    { x: 425, y: 85, r: 255, g: 255, b: 242 },
  ],
  { x: 597, y: 118 }
);

var rfpageCottomFarm = new RF.Page(
  'rfpageCottomFarm',
  [
    { x: 596, y: 120, r: 123, g: 207, b: 8 },
    { x: 528, y: 87, r: 254, g: 231, b: 251 },
    { x: 428, y: 92, r: 255, g: 241, b: 255 },
  ],
  { x: 596, y: 120 }
);

var pageInKingdomVillage = [
  { x: 39, y: 313, r: 255, g: 101, b: 156 },
  { x: 24, y: 321, r: 255, g: 255, b: 255 },
  { x: 55, y: 327, r: 255, g: 227, b: 247 },
  { x: 377, y: 321, r: 121, g: 52, b: 52 },
  { x: 418, y: 321, r: 132, g: 16, b: 8 },
  { x: 466, y: 318, r: 231, g: 167, b: 85 },
];
var rfpageInKingdomVillage = new RF.Page(
  'rfpageInKingdomVillage',
  pageInKingdomVillage,
  pageInKingdomVillage[0]
);

var pageInLoginPageWithGearAndVideo = [
  {x: 621, y: 13, r: 233, g: 233, b: 235},
  {x: 622, y: 16, r: 3, g: 4, b: 9},
  {x: 597, y: 16, r: 233, g: 235, b: 239},
  {x: 593, y: 16, r: 4, g: 6, b: 11},
  {x: 590, y: 17, r: 233, g: 235, b: 239},
  {x: 594, y: 23, r: 14, g: 14, b: 25},
]

var pageLoginFacebook = [
  { x: 186, y: 72, r: 59, g: 89, b: 152 },
  { x: 484, y: 71, r: 59, g: 89, b: 152 },
  { x: 376, y: 123, r: 255, g: 235, b: 232 },
  { x: 602, y: 167, r: 255, g: 255, b: 255 },
  { x: 506, y: 24, r: 21, g: 21, b: 21 },
];

var pageInCookieGacha = [
  { x: 36, y: 233, r: 205, g: 204, b: 205 },
  { x: 35, y: 75, r: 206, g: 215, b: 231 },
  { x: 30, y: 12, r: 148, g: 81, b: 66 },
  { x: 268, y: 17, r: 218, g: 173, b: 234 },
  { x: 342, y: 16, r: 99, g: 117, b: 132 },
  { x: 418, y: 21, r: 239, g: 195, b: 2 },
  { x: 524, y: 20, r: 0, g: 139, b: 255 },
];

var pageInputAge = [
  { x: 366, y: 278, r: 254, g: 94, b: 0 },
  { x: 320, y: 154, r: 50, g: 50, b: 50 },
  { x: 319, y: 161, r: 255, g: 255, b: 255 },
  { x: 287, y: 69, r: 60, g: 60, b: 60 },
  { x: 335, y: 66, r: 99, g: 99, b: 99 },
  { x: 253, y: 213, r: 254, g: 94, b: 0 },
  { x: 252, y: 231, r: 255, g: 255, b: 255 },
];

// Bigger icons (Android 5)
var pageChooseLoginMethod = [
  { x: 139, y: 233, r: 255, g: 95, b: 0 },
  { x: 165, y: 197, r: 0, g: 0, b: 0 },
  { x: 148, y: 153, r: 244, g: 154, b: 25 },
  { x: 347, y: 166, r: 177, g: 204, b: 58 },
  { x: 356, y: 196, r: 59, g: 89, b: 152 },
  { x: 126, y: 234, r: 255, g: 255, b: 255 },
];
// Smaller icons (Android 7), not updated for 5 options
var pageChooseLoginMethod2 = [
  { x: 251, y: 245, r: 255, g: 95, b: 0 },
];

var pageAnnouncement = [
  { x: 610, y: 19, r: 56, g: 167, b: 231 },
  { x: 619, y: 19, r: 255, g: 255, b: 255 },
  { x: 628, y: 18, r: 56, g: 167, b: 231 },
  { x: 59, y: 219, r: 54, g: 64, b: 87 },
  { x: 71, y: 317, r: 54, g: 64, b: 87 },
  { x: 19, y: 114, r: 63, g: 0, b: 9 },
  { x: 25, y: 321, r: 75, g: 75, b: 75 },
];

var pageInMailBox = [
  {x: 609, y: 11, r: 57, g: 166, b: 231},
  {x: 609, y: 19, r: 255, g: 255, b: 255},
  {x: 53, y: 130, r: 255, g: 239, b: 214},
  {x: 37, y: 33, r: 57, g: 69, b: 107},
]

var pageInFountain = [
  { x: 505, y: 305, r: 121, g: 207, b: 12 },
  { x: 569, y: 310, r: 219, g: 207, b: 199 },
  { x: 368, y: 23, r: 60, g: 70, b: 105 },
  { x: 525, y: 68, r: 142, g: 79, b: 71 },
];

var pageNotCollapsedWisingTree = [
  {x: 92, y: 332, r: 52, g: 86, b: 125},
  {x: 112, y: 292, r: 138, g: 108, b: 199},
  {x: 56, y: 324, r: 252, g: 201, b: 235},
];
var pageCollapsedAffairs = [
  { x: 96, y: 329, r: 255, g: 223, b: 142 },
  { x: 127, y: 344, r: 40, g: 66, b: 97 },
  { x: 26, y: 323, r: 252, g: 252, b: 252 },
];
var pageUncollapsedAffairs = [
  { x: 115, y: 329, r: 69, g: 105, b: 146 },
  { x: 102, y: 286, r: 134, g: 183, b: 249 },
  { x: 129, y: 292, r: 52, g: 86, b: 125 },
  { x: 111, y: 230, r: 255, g: 223, b: 142 },
  { x: 106, y: 177, r: 255, g: 109, b: 200 },
];

var pageBallonFlyingDock = [
  { x: 611, y: 17, r: 57, g: 166, b: 231 },
  { x: 213, y: 15, r: 50, g: 21, b: 37 },
  { x: 250, y: 51, r: 255, g: 255, b: 255 },
  { x: 269, y: 51, r: 217, g: 217, b: 217 },
  { x: 346, y: 50, r: 40, g: 6, b: 21 },
];

var pageInHotAirBallon = [
  { x: 270, y: 330, r: 255, g: 211, b: 0 },
  { x: 158, y: 331, r: 12, g: 167, b: 223 },
  { x: 184, y: 312, r: 223, g: 175, b: 97 },
  { x: 331, y: 312, r: 142, g: 88, b: 65 },
  { x: 565, y: 84, r: 255, g: 251, b: 235 },
];

var pageInTrainStation = [
  { x: 618, y: 11, r: 56, g: 165, b: 231 },
  { x: 411, y: 19, r: 255, g: 208, b: 2 },
  { x: 393, y: 12, r: 93, g: 48, b: 32 },
  { x: 10, y: 355, r: 56, g: 34, b: 28 },
  { x: 605, y: 327, r: 130, g: 22, b: 31 },
];

var pageTrainNotEnoughGoods = [
  { x: 477, y: 28, r: 55, g: 163, b: 229 },
  { x: 221, y: 40, r: 60, g: 70, b: 105 },
  { x: 222, y: 100, r: 243, g: 233, b: 223 },
  { x: 211, y: 300, r: 219, g: 207, b: 199 },
  { x: 357, y: 300, r: 121, g: 207, b: 12 },
];

var pageInWishingTree = [
  { x: 157, y: 29, r: 107, g: 56, b: 82 },
  { x: 235, y: 35, r: 255, g: 0, b: 81 },
  { x: 348, y: 22, r: 255, g: 40, b: 123 },
  { x: 412, y: 18, r: 255, g: 190, b: 8 },
  { x: 523, y: 15, r: 0, g: 195, b: 255 },
];

var pageNotEnoughForTree = [
  { x: 428, y: 98, r: 56, g: 166, b: 231 },
  { x: 386, y: 107, r: 60, g: 70, b: 105 },
  { x: 427, y: 171, r: 243, g: 233, b: 223 },
  { x: 403, y: 240, r: 219, g: 207, b: 199 },
];

var pageCheckWishingTreeStock = [
  {x: 477, y: 37, r: 255, g: 255, b: 255},
  {x: 171, y: 50, r: 57, g: 69, b: 107},
  {x: 118, y: 28, r: 53, g: 28, b: 41},
]

var pageInTropicalIsland = [
  {x: 38, y: 333, r: 255, g: 97, b: 173},
  {x: 49, y: 323, r: 239, g: 77, b: 140},
  {x: 62, y: 341, r: 44, g: 81, b: 118},
];

var pageInGacha = [
  {x: 619, y: 18, r: 255, g: 255, b: 255},
  {x: 626, y: 18, r: 62, g: 164, b: 232},
  {x: 521, y: 14, r: 0, g: 192, b: 255},
  {x: 407, y: 19, r: 255, g: 209, b: 0},
  {x: 21, y: 14, r: 117, g: 54, b: 40},
  {x: 37, y: 24, r: 74, g: 58, b: 58},
];
var rfpageInGacha = new RF.Page(
  'rfpageInGacha',
  pageInGacha,
  pageInGacha[0]
);

var pageInTowerOfRecords = [
  { x: 618, y: 23, r: 255, g: 255, b: 255 },
  { x: 106, y: 23, r: 39, g: 36, b: 32 },
  { x: 92, y: 20, r: 114, g: 112, b: 110 },
  { x: 16, y: 14, r: 179, g: 179, b: 179 },
  { x: 4, y: 18, r: 35, g: 34, b: 33 },
];

var pageAutoUseSkillEnabled = [{ x: 28, y: 291, r: 223, g: 221, b: 1 }];
var pageSpeedBoostEnabled = [{ x: 31, y: 333, r: 113, g: 107, b: 17 }];
var pageSpeed1x = [{ x: 24, y: 332, r: 135, g: 137, b: 135 }];
var pageSpeed1_2x = [
  { x: 20, y: 333, r: 211, g: 209, b: 2 },
  { x: 32, y: 334, r: 161, g: 159, b: 8 },
];
var rfpageAutoUseSkillEnabled = new RF.Page(
  'rfpageAutoUseSkillEnabled',
  pageAutoUseSkillEnabled,
  pageAutoUseSkillEnabled[0]
);
var rfpageSpeedBoostEnabled = new RF.Page(
  'rfpageSpeedBoostEnabled',
  pageSpeedBoostEnabled,
  pageSpeedBoostEnabled[0]
);
var rfpageSpeed1x = new RF.Page(
  'rfpageSpeed1x',
  pageSpeed1x,
  pageSpeed1x[0]
);
var rfpageSpeed1_2x = new RF.Page(
  'rfpageSpeed1_2x',
  pageSpeed1_2x,
  pageSpeed1_2x[0]
);

//rgb(166,104,65)
var pageInProduction = [
  { x: 17, y: 44, r: 165, g: 105, b: 66 },
  { x: 84, y: 42, r: 178, g: 103, b: 66 },
  { x: 26, y: 30, r: 126, g: 73, b: 41 },
];
var pageInMagicLab = [
  { x: 18, y: 46, r: 123, g: 89, b: 140 },
  { x: 81, y: 47, r: 123, g: 89, b: 140 },
  { x: 27, y: 30, r: 115, g: 85, b: 140 },
];

var pageHasDashboard = [
  {x: 38, y: 221, r: 77, g: 89, b: 123},
  {x: 33, y: 221, r: 107, g: 44, b: 41},
  {x: 25, y: 226, r: 222, g: 159, b: 74},
  {x: 424, y: 20, r: 0, g: 138, b: 255},
];
var pageInCookieActivityDashboard = [
  {x: 247, y: 331, r: 56, g: 74, b: 107},
  {x: 28, y: 18, r: 229, g: 158, b: 76},
  {x: 558, y: 339, r: 239, g: 190, b: 41},
]
var pageInProductionDashboard = [
  {x: 408, y: 330, r: 56, g: 74, b: 107},
  {x: 540, y: 341, r: 123, g: 207, b: 8},
  {x: 27, y: 16, r: 206, g: 32, b: 49},
]

var pageStockIsFull = [
  { x: 436, y: 96, r: 255, g: 255, b: 255 },
  { x: 320, y: 83, r: 107, g: 48, b: 49 },
  { x: 320, y: 93, r: 132, g: 16, b: 8 },
  { x: 321, y: 108, r: 241, g: 229, b: 216 },
];

var pageToolShop = [
  { x: 420, y: 191, r: 178, g: 16, b: 13 },
  { x: 414, y: 75, r: 135, g: 143, b: 170 },
  { x: 413, y: 84, r: 183, g: 190, b: 211 },
];

var pageIsJammery = [
  { x: 490, y: 83, r: 0, g: 178, b: 206 },
  { x: 440, y: 89, r: 19, g: 114, b: 129 },
  { x: 430, y: 88, r: 247, g: 243, b: 222 },
];

// var pageIsCarpentryShop = [
//   { x: 494, y: 83, r: 140, g: 86, b: 57 },
//   { x: 517, y: 87, r: 165, g: 105, b: 66 },
//   { x: 433, y: 73, r: 88, g: 46, b: 30 },
//   { x: 420, y: 81, r: 214, g: 146, b: 115 },
//   { x: 424, y: 64, r: 84, g: 3, b: 3 },
// ];

var pageIsJampieDiner = [
  { x: 535, y: 84, r: 210, g: 36, b: 57 },
  { x: 493, y: 83, r: 0, g: 224, b: 231 },
  { x: 414, y: 81, r: 217, g: 48, b: 77 },
  { x: 432, y: 73, r: 220, g: 149, b: 99 },
];

var pageIsBakery = [
  {x: 496, y: 82, r: 184, g: 174, b: 155},
  {x: 539, y: 86, r: 176, g: 83, b: 11},
  {x: 439, y: 75, r: 173, g: 82, b: 24},
  {x: 423, y: 70, r: 198, g: 116, b: 63},
  {x: 424, y: 99, r: 255, g: 219, b: 123},
]

var pageIsFlowerShop = [
  {x: 418, y: 80, r: 255, g: 89, b: 165},
  {x: 413, y: 95, r: 8, g: 150, b: 8},
  {x: 431, y: 86, r: 214, g: 0, b: 82},
  {x: 490, y: 86, r: 197, g: 39, b: 41},
  {x: 538, y: 82, r: 165, g: 85, b: 41},
]

var pageSelectAdvanture = [
  { x: 41, y: 334, r: 28, g: 36, b: 48 },
  { x: 35, y: 291, r: 241, g: 51, b: 92 },
  { x: 110, y: 70, r: 255, g: 255, b: 255 },
  { x: 173, y: 314, r: 28, g: 36, b: 48 },
];

var pageChooseAdvanture = [
  { x: 612, y: 18, r: 57, g: 166, b: 231 },
  { x: 423, y: 19, r: 0, g: 131, b: 255 },
  { x: 13, y: 27, r: 179, g: 108, b: 56 },
  { x: 25, y: 17, r: 214, g: 235, b: 239 },
  { x: 28, y: 27, r: 228, g: 199, b: 86 },
  { x: 44, y: 22, r: 255, g: 255, b: 255 },
];

var pageInOneOfTheBounty = [
  { x: 533, y: 327, r: 121, g: 207, b: 12 },
  { x: 622, y: 329, r: 207, g: 237, b: 255 },
  { x: 614, y: 314, r: 227, g: 155, b: 65 },
  { x: 171, y: 39, r: 174, g: 167, b: 152 },
];

var pageNeedRefillBounty = [
  {x: 427, y: 82, r: 57, g: 166, b: 231},
  {x: 317, y: 76, r: 132, g: 130, b: 99},
  {x: 323, y: 81, r: 115, g: 70, b: 58},
  {x: 343, y: 92, r: 57, g: 69, b: 107},
  {x: 309, y: 264, r: 0, g: 195, b: 255},
]

var pageCannotRefillBountyAnymore = [
  {x: 345, y: 244, r: 123, g: 207, b: 8},
  {x: 192, y: 29, r: 57, g: 59, b: 46},
  {x: 190, y: 41, r: 49, g: 30, b: 24},
]

var pageInkingdomCanGotoGuild = [
  { x: 319, y: 330, r: 255, g: 174, b: 0 },
  { x: 364, y: 334, r: 107, g: 93, b: 90 },
  { x: 417, y: 326, r: 115, g: 12, b: 0 },
  { x: 460, y: 327, r: 206, g: 113, b: 16 },
];
var pageInGuildLand = [
  { x: 445, y: 329, r: 74, g: 61, b: 154 },
  { x: 212, y: 329, r: 173, g: 150, b: 198 },
  { x: 163, y: 327, r: 107, g: 32, b: 49 },
  { x: 144, y: 326, r: 231, g: 207, b: 214 },
  { x: 107, y: 324, r: 225, g: 213, b: 198 },
  { x: 41, y: 303, r: 217, g: 146, b: 99 },
  { x: 19, y: 267, r: 206, g: 195, b: 247 },
];

var pageInGnomeLab = [
  { x: 15, y: 11, r: 211, g: 9, b: 35 },
  { x: 25, y: 21, r: 255, g: 223, b: 244 },
  { x: 328, y: 15, r: 169, g: 8, b: 36 },
  { x: 308, y: 28, r: 16, g: 12, b: 8 },
];

var pageAlreadyResearching = [
  { x: 47, y: 69, r: 237, g: 237, b: 229 },
  { x: 159, y: 67, r: 117, g: 223, b: 0 },
];

var pageInBounties = [
  { x: 616, y: 341, r: 49, g: 77, b: 107 },
  { x: 634, y: 337, r: 54, g: 32, b: 22 },
  { x: 479, y: 19, r: 40, g: 32, b: 23 },
  { x: 456, y: 26, r: 70, g: 50, b: 37 },
  { x: 416, y: 5, r: 122, g: 84, b: 95 },
];

var kingdomArena = [
  { x: 181, y: 267, r: 56, g: 167, b: 231 },
  { x: 181, y: 306, r: 56, g: 167, b: 231 },
  { x: 182, y: 335, r: 48, g: 76, b: 109 },
  { x: 373, y: 327, r: 41, g: 35, b: 33 },
  { x: 296, y: 70, r: 65, g: 58, b: 56 },
];

var pageInSuperMayhem = [
  {x: 450, y: 13, r: 181, g: 132, b: 178},
  {x: 449, y: 21, r: 239, g: 235, b: 247},
  {x: 37, y: 134, r: 145, g: 69, b: 8},
  {x: 137, y: 333, r: 214, g: 134, b: 8},
];

var pageBattleDragon = [
  { x: 317, y: 18, r: 0, g: 36, b: 132 },
  { x: 224, y: 19, r: 165, g: 245, b: 246 },
  { x: 409, y: 20, r: 255, g: 204, b: 0 },
  { x: 524, y: 20, r: 0, g: 139, b: 255 },
];
var pageNoMoreDragonToFight = [
  { x: 601, y: 326, r: 160, g: 160, b: 160 },
  { x: 522, y: 13, r: 0, g: 195, b: 255 },
  { x: 408, y: 15, r: 255, g: 239, b: 16 },
  { x: 29, y: 115, r: 181, g: 182, b: 222 },
];
var pageReadyToFightDragon = [
  { x: 493, y: 325, r: 134, g: 233, b: 253 },
  { x: 316, y: 19, r: 68, g: 83, b: 231 },
  { x: 108, y: 335, r: 123, g: 207, b: 8 },
  { x: 73, y: 333, r: 0, g: 150, b: 214 },
];
var pageDragonAddMoreCookie = [
  { x: 300, y: 250, r: 8, g: 166, b: 222 },
  { x: 408, y: 250, r: 123, g: 207, b: 8 },
  { x: 419, y: 18, r: 127, g: 95, b: 4 },
  { x: 518, y: 18, r: 20, g: 117, b: 127 },
];
var pageDragonRemainHealth = [
  { x: 368, y: 233, r: 132, g: 65, b: 255 },
  { x: 153, y: 334, r: 1, g: 31, b: 41 },
  { x: 79, y: 334, r: 42, g: 15, b: 4 },
];
var pageDragonTotalDamage = [
  { x: 427, y: 243, r: 231, g: 215, b: 222 },
  { x: 410, y: 247, r: 156, g: 0, b: 49 },
  { x: 260, y: 268, r: 255, g: 255, b: 255 },
  { x: 555, y: 311, r: 89, g: 22, b: 45 },
];
var pageRedValvetDragonWon = [
  { x: 289, y: 238, r: 239, g: 28, b: 57 },
  { x: 358, y: 233, r: 222, g: 16, b: 41 },
  { x: 426, y: 236, r: 231, g: 216, b: 223 },
];
var rfpageDragonRemainHealth = new RF.Page(
  'rfpageDragonRemainHealth',
  pageDragonRemainHealth,
  pageDragonRemainHealth[0]
);
var rfpageDragonTotalDamage = new RF.Page(
  'rfpageDragonTotalDamage',
  pageDragonTotalDamage,
  pageDragonTotalDamage[0]
);
var rfpageRedValvetDragonWon = new RF.Page(
  'rfpageRedValvetDragonWon',
  pageRedValvetDragonWon,
  pageRedValvetDragonWon[0]
);
var rfpageDragonHasExtraTime = new RF.Page(
  'rfpageDragonHasExtraTime',
  [
    {x: 405, y: 281, r: 121, g: 207, b: 12},
    {x: 304, y: 280, r: 12, g: 167, b: 223},
    {x: 608, y: 333, r: 60, g: 103, b: 6},
    {x: 516, y: 330, r: 6, g: 83, b: 111},
    {x: 128, y: 333, r: 6, g: 83, b: 111},
  ],
  { x: 405, y: 281 }
);

var pageCookieAlliance = [
  { x: 333, y: 21, r: 255, g: 255, b: 255 },
  { x: 329, y: 25, r: 66, g: 69, b: 222 },
  { x: 73, y: 332, r: 0, g: 150, b: 214 },
  { x: 29, y: 141, r: 151, g: 75, b: 13 },
];

var pageInHabor = [
  { x: 323, y: 28, r: 247, g: 181, b: 243 },
  { x: 408, y: 20, r: 255, g: 207, b: 0 },
  { x: 522, y: 18, r: 4, g: 135, b: 255 },
  { x: 619, y: 263, r: 57, g: 166, b: 231 },
];

var pagePvPCrystaisRefresh = [
  { x: 243, y: 100, r: 57, g: 69, b: 107 },
  { x: 324, y: 78, r: 255, g: 255, b: 255 },
  { x: 443, y: 92, r: 57, g: 166, b: 231 },
  { x: 402, y: 134, r: 247, g: 235, b: 222 },
  { x: 351, y: 250, r: 123, g: 207, b: 8 },
  { x: 408, y: 251, r: 222, g: 207, b: 198 },
];
var rfpagePvPCrystaisRefresh = new RF.Page(
  'rfpagePvPCrystaisRefresh',
  pagePvPCrystaisRefresh,
  { x: 436, y: 90 }
);

var pageInTowerOfSweetChaos = [
  { x: 611, y: 21, r: 57, g: 166, b: 231 },
  { x: 497, y: 17, r: 255, g: 207, b: 0 },
  { x: 407, y: 15, r: 0, g: 195, b: 255 },
  { x: 337, y: 9, r: 251, g: 213, b: 216 },
  { x: 19, y: 59, r: 255, g: 255, b: 255 },
];

var pageReadyToBattleToSC = [
  { x: 477, y: 327, r: 123, g: 210, b: 13 },
  { x: 491, y: 329, r: 168, g: 3, b: 44 },
  { x: 337, y: 12, r: 82, g: 0, b: 0 },
  { x: 72, y: 339, r: 0, g: 150, b: 214 },
];

var pageToSCTreasureChest = [
  { x: 443, y: 328, r: 198, g: 44, b: 57 },
  { x: 388, y: 63, r: 84, g: 41, b: 114 },
  { x: 422, y: 125, r: 118, g: 78, b: 85 },
  { x: 407, y: 137, r: 255, g: 105, b: 156 },
  { x: 437, y: 149, r: 33, g: 0, b: 0 },
];

var pageToSCTeamsNotMeetRequirement = [
  { x: 343, y: 244, r: 123, g: 207, b: 8 },
  { x: 337, y: 22, r: 77, g: 15, b: 25 },
  { x: 287, y: 21, r: 21, g: 3, b: 5 },
  { x: 496, y: 318, r: 33, g: 6, b: 10 },
];

var pageCookieKingdomIsNotResponding = [
  { x: 399, y: 209, r: 238, g: 238, b: 238 },
  { x: 182, y: 167, r: 238, g: 238, b: 238 },
  { x: 359, y: 184, r: 238, g: 238, b: 238 },
  { x: 281, y: 211, r: 238, g: 238, b: 238 },
  { x: 280, y: 186, r: 162, g: 162, b: 162 },
  { x: 214, y: 157, r: 227, g: 227, b: 227 },
  { x: 242, y: 157, r: 31, g: 31, b: 31 },
  { x: 393, y: 217, r: 142, g: 202, b: 197 },
];

var pageCookieKingdomIsNotResponding2 = [
  { x: 478, y: 221, r: 238, g: 238, b: 238 },
  { x: 252, y: 190, r: 238, g: 238, b: 238 },
  { x: 146, y: 189, r: 238, g: 238, b: 238 },
  { x: 155, y: 157, r: 238, g: 238, b: 238 },
  { x: 220, y: 156, r: 87, g: 87, b: 87 },
  { x: 325, y: 160, r: 100, g: 100, b: 100 },
];

var pageCookieKingdomHasStopped = [
  {x: 484, y: 205, r: 0, g: 150, b: 136},
  {x: 478, y: 205, r: 238, g: 238, b: 238},
  {x: 440, y: 172, r: 238, g: 238, b: 238},
  {x: 402, y: 169, r: 57, g: 57, b: 57},
]

var pageInCookieHead = [
  { x: 610, y: 21, r: 57, g: 166, b: 231 },
  { x: 301, y: 95, r: 137, g: 143, b: 144 },
  { x: 32, y: 52, r: 142, g: 148, b: 155 },
  {x: 12, y: 20, r: 141, g: 150, b: 167},
  {x: 12, y: 27, r: 21, g: 32, b: 47}
];

var pagePurchaseDiamond = [
  { x: 435, y: 105, r: 56, g: 167, b: 231 },
  { x: 310, y: 87, r: 21, g: 206, b: 232 },
  { x: 317, y: 109, r: 154, g: 83, b: 55 },
  { x: 344, y: 174, r: 121, g: 207, b: 12 },
  { x: 288, y: 114, r: 112, g: 228, b: 233 },
];

var pageCanGotoKingdom = [
  { x: 601, y: 322, r: 187, g: 22, b: 31 },
  { x: 606, y: 326, r: 235, g: 191, b: 113 },
  { x: 603, y: 333, r: 87, g: 46, b: 54 },
  { x: 621, y: 310, r: 56, g: 92, b: 134 },
  { x: 540, y: 328, r: 220, g: 149, b: 73 },
  { x: 490, y: 322, r: 134, g: 18, b: 10 },
  { x: 442, y: 318, r: 146, g: 80, b: 69 },
];

var pageCookieKingdomNotResponding = [
  { x: 486, y: 222, r: 95, g: 185, b: 176 },
  { x: 147, y: 157, r: 238, g: 238, b: 238 },
  { x: 156, y: 191, r: 238, g: 238, b: 238 },
  { x: 253, y: 191, r: 238, g: 238, b: 238 },
  { x: 479, y: 222, r: 238, g: 238, b: 238 },
];

var pageGooglePlaystoreHasStopped = [
  { x: 485, y: 207, r: 10, g: 153, b: 140 },
  { x: 147, y: 170, r: 238, g: 238, b: 238 },
  { x: 263, y: 172, r: 238, g: 238, b: 238 },
  { x: 327, y: 172, r: 238, g: 238, b: 238 },
  { x: 418, y: 171, r: 238, g: 238, b: 238 },
];

var facebookRefreshTokenExpiredLogout = {
  x: 220,
  y: 135,
  width: 196,
  height: 14,

  targetY: 4,
  lookingForColor: { r: 140, g: 135, b: 128 },
  targetColorCount: 16,
  targetColorThreashold: 5,
};

var anErrorHasOccuredMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 83,
  targetColorThreashold: 5,
};

var theNetworkIsUnstableMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 51,
  targetColorThreashold: 5,
};

var anUnknownErrorHasOccurMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 79,
  targetColorThreashold: 3,
};

var theReloginIntoAnotherDeviceMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 74,
  targetColorThreashold: 1,
};

var messageNotifyQuit = {
  x: 220,
  y: 162,
  width: 196,
  height: 12,

  targetY: 4,
  lookingForColor: { r: 95, g: 95, b: 95 },
  targetColorCount: 31,
  targetColorThreashold: 5,
};

function pnt(x, y) {
  return { x: x, y: y };
}

function rect(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
  };
}

function qTap(page, sleepTime) {
  if (sleepTime == undefined) {
    sleepTime = 0;
  }
  if (Array.isArray(page)) {
    page = page[0];
  }
  // tap(page.x, page.y, sleepTime);
  if (page.x != undefined && page.y != undefined) {
    tapDown(page.x, page.y, 10);
    sleep(sleepTime);
    tapUp(page.x, page.y, 10);
    sleep(sleepTime);
  }
}

function tapRandom(x1, y1, x2, y2, sleepTime) {
  var x = x1 + Math.random() * (x2 - x1);
  var y = y1 + Math.random() * (y2 - y1);
  console.log('tap: ', parseInt(x, 10), parseInt(y, 10));
  qTap(pnt(x, y), sleepTime);
}

function isSameColor(c1, c2, diff) {
  if (diff === undefined) {
    diff = 35;
  }
  // console.log(JSON.stringify(c1), JSON.stringify(c2), diff);
  if (Math.abs(c1.r - c2.r) < diff && Math.abs(c1.g - c2.g) < diff && Math.abs(c1.b - c2.b) < diff) {
    return true;
  }
  return false;
}

function isSameColorAtPnt(point, c2, diff) {
  if (point.x === undefined || point.y === undefined) {
    console.log('Error isSameColorAtPnt as x y cannot be undefined:', JSON.stringify(point));
    return false;
  }

  var img = getScreenshot();
  var color = getImageColor(img, point.x, point.y);
  releaseImage(img);
  if (!isSameColor(color, c2, diff)) {
    return false;
  }
  return true;
}

function checkIsPage(page, diff, img) {
  var release = false;
  if (img === undefined) {
    img = getScreenshot();
    release = true;
  }

  var whSize = getImageSize(img);
  if (whSize.height !== 360 || whSize.width !== 640) {
    console.log('Reboot nox as screen size incorrect: ', whSize.height, whSize.width, ' (h/w)');
    execute('/system/bin/reboot -p');
  }

  checkIsCookieGachaPage();
  var isPage = true;
  for (var i in page) {
    var cbtn = page[i];
    var color = getImageColor(img, cbtn.x, cbtn.y);
    if (!isSameColor(cbtn, color, diff)) {
      // console.log('pixel violation, ask for: ', JSON.stringify(cbtn), ', but get: ', JSON.stringify(color), diff)
      isPage = false;
      break;
    }
  }
  if (release) {
    releaseImage(img);
  }
  return isPage;
}

function mergeObject(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        // console.log('merge type: ', key, source[key], typeof(source[key]))
        target[key] = source[key];
      }
    }
  }
  return target;
}

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

function waitUntilSeePages(pages, secsToWait, tappingPage, earlyQuitPage, checkingIntervalInSecs) {
  return waitUntilSeePagesCheckDelay(undefined, pages, secsToWait, tappingPage, earlyQuitPage, checkingIntervalInSecs)
}

function waitUntilSeePagesCheckDelay(pageStart, pages, secsToWait, tappingPage, earlyQuitPage, checkingIntervalInSecs, pntEntry) {
  if (secsToWait === undefined) {
    secsToWait = 5;
  }
  if (checkingIntervalInSecs === undefined) {
    checkingIntervalInSecs = 1.5;
  }

  console.log(
    'waiting for page with 1st pnt in 1st page: { x: {0}, y: {1}, r: {2}, g: {3}, b: {4} }, for {5} secs, checkingIntervalInSecs {6} secs'.format(
      pages[0][0].x,
      pages[0][0].y,
      pages[0][0].r,
      pages[0][0].g,
      pages[0][0].b,
      secsToWait,
      checkingIntervalInSecs
    )
  );
  var lastTapTime = 0;
  for (var i = 0; i < secsToWait; i++) {
    for (var j = 0; j < pages.length; j++) {
      if (checkIsPage(pages[j])) {
        console.log('found page index', j, 'in', i, 'secs');
        return true;
      }
    }

    if (earlyQuitPage != undefined && checkIsPage(earlyQuitPage)) {
      console.log('waitUntilSeePage but found earlyQuitPage, return false');
      return false;
    }
    else if (i > 3 && pageStart !== undefined && checkIsPage(pageStart)) {
      qTap(pntEntry);
      console.log('Tap the pntEntry again as we are still in pageStart for', i, 'secs');
    }

    if (tappingPage !== undefined && tappingPage !== null && i >= lastTapTime + checkingIntervalInSecs) {
      console.log('still waiting so tap again, i: {0}, lastTapTime: {1}, x, y = ({2}, {3})'.format(
        i, lastTapTime, tappingPage.x, tappingPage.y))
      if ((tappingPage.x, tappingPage.y, tappingPage.r, tappingPage.g, tappingPage.b && checkIsPage(tappingPage))) {
        qTap(tappingPage);
      } else {
        qTap(tappingPage);
      }
      lastTapTime = i;
    }

    handleUnexpectedMessageBox();
    sleep(1000);
  }
  // console.log('wait ', secsToWait, ' secs but did not find the page');
  return false;
}

function waitUntilSeePage(page, secsToWait, tappingPage, earlyQuitPage, checkingIntervalInSecs) {
  return waitUntilSeePagesCheckDelay(undefined, [page], secsToWait, tappingPage, earlyQuitPage, checkingIntervalInSecs)
}

function isMessageWindowWithDiamond() {
  var pageIsDialog = [
    { x: 412, y: 106, r: 60, g: 70, b: 105 },
    { x: 415, y: 139, r: 243, g: 233, b: 223 },
    { x: 410, y: 250, r: 219, g: 207, b: 199 },
  ];
  if (!checkIsPage(pageIsDialog)) {
    return false;
  }

  var dialogDiamond = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAKAAsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDS/ao8YeBf2lr7S5rf4JaPaXnhDTG0+4kv1gu9ctp4pJLhjNOYcqwEiOCp8pgweMmJkxz3w1uf2hpPAeltp9r8O0sTAPs6+JdVvL7VVj/hE89vEscpAxhwCWXaWZ23O1/9oSCNv2zvghamNfs2uLrMeoxY/d6gttarNbLMvSQQyu7xhs7GdmXBJNe+V+B+NHi/gsw4H4cy/C5Nh6N6cql7OajyynRcIJ2lGMnHnacpfZjrycz/AJp4fyetg8wxeJr15VXOSSUrpLRS+FPkvZpXjCOzfVo//9k='
  );
  var img = getScreenshot();

  var foundResults = findImages(img, dialogDiamond, 0.92, 5, true);
  releaseImage(img);
  releaseImage(dialogDiamond);

  if (foundResults.length > 0) {
    console.log('Found dialog diamond icon at: ', JSON.stringify(foundResults));
    return true;
  }
  return false;
}

function checkScreenMessage(messageScreen, pageMessageWindow) {
  if (pageMessageWindow === undefined) {
    pageMessageWindow = [
      { x: 424, y: 101, r: 57, g: 69, b: 107 },
      { x: 431, y: 128, r: 243, g: 233, b: 223 },
      { x: 429, y: 244, r: 219, g: 207, b: 199 },
    ];
  }
  if (!checkIsPage(pageMessageWindow)) {
    return false;
  }

  var img = getScreenshot();
  var croppedImage = cropImage(img, messageScreen.x, messageScreen.y, messageScreen.width, messageScreen.height);

  var whSize = getImageSize(croppedImage);

  var cnt = 0;
  for (var i = 0; i < whSize.width; i++) {
    if (isSameColor(getImageColor(croppedImage, i, messageScreen.targetY), messageScreen.lookingForColor)) {
      cnt++;
    }
  }
  // console.log(
  //   'cnt vs messageScreen.targetColorCount vs messageScreen.targetColorThreashold: ',
  //   cnt,
  //   messageScreen.targetColorCount,
  //   messageScreen.targetColorThreashold
  // );

  releaseImage(img);
  releaseImage(croppedImage);
  return Math.abs(messageScreen.targetColorCount - cnt) < messageScreen.targetColorThreashold ? true : false;
}

function compare(a, b) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

var goodsLocation = {
  1: rect(431, 101, 22, 12),
  2: rect(431, 209, 22, 12),
  3: rect(431, 315, 22, 12),
  4: rect(431, 106, 22, 12),
  5: rect(431, 213, 22, 12),
  6: rect(431, 319, 22, 12),
  shovel: rect(432, 317, 22, 16),
};

function ocrResultToInt(results) {
  if (results.length == 0) {
    return -1;
  }

  var digit_width = 4;
  var count = '';
  var idx = 1;
  while (idx < results.length) {
    if (results[idx].x - results[idx - 1].x < digit_width) {
      // results[i].score > results[i - 1].score ? results.splice(i - 1, 1) : results.splice(i, 1);
      if (results[idx].score > results[idx - 1].score) {
        results.splice(idx - 1, 1);
      } else {
        results.splice(idx, 1);
      }
    } else {
      idx++;
    }
    // console.log('>>', idx, JSON.stringify(results))
  }

  for (var i in results) {
    count += results[i].target;
  }

  return parseInt(count, 10);
}

function ocrProductStorage(rect) {
  var img = getScreenshot();
  var croppedImage = cropImage(img, rect.x, rect.y, rect.width, rect.height);
  // var croppedImage = cropImage(img, 430, 311, 23, 15);
  releaseImage(img);

  // console.log('about to load ocr image for: ', JSON.stringify(rect));
  var results = [];
  for (var i in bNumbers) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    var foundResults = findImages(croppedImage, bNumbers[i]['img'], 0.9, 10, true);
    for (var j in foundResults) {
      foundResults[j]['target'] = bNumbers[i].char;
      results.push(foundResults[j]);
    }
  }
  results.sort(compare);
  // console.log('=> ', JSON.stringify(results));

  releaseImage(croppedImage);

  return ocrResultToInt(results);
}

function ocrMaterialStorage(x, y, w, h) {
  var img = getScreenshot();
  x = typeof x !== 'undefined' ? x : 355;
  y = typeof y !== 'undefined' ? y : 10;
  w = typeof w !== 'undefined' ? w : 35;
  h = typeof h !== 'undefined' ? h : 18;

  var croppedImage = cropImage(img, x, y, w, h);
  releaseImage(img);

  // console.log('about to load ocr material images');
  var results = [];
  for (var i in wNumbers) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    var foundResults = findImages(croppedImage, wNumbers[i]['img'], 0.8, 10, true);
    for (var j in foundResults) {
      foundResults[j]['target'] = wNumbers[i].char;
      results.push(foundResults[j]);
    }
  }
  results.sort(compare);
  // console.log('=> ', JSON.stringify(results));

  releaseImage(croppedImage);
  return ocrResultToInt(results);
}

function SwipeProductionMenuToBottom() {
  tapDown(464, 340, 40, 0);
  sleep(config.sleep);
  moveTo(464, 340, 40, 0);
  sleep(config.sleep);
  moveTo(464, 270, 40, 0);
  sleep(config.sleep);
  moveTo(464, -400, 40, 0);
  sleep(config.sleep);
  moveTo(464, -1500, 40, 0);
  sleep(config.sleepAnimate);
  tapUp(464, -1500, 40, 0);
  sleep(config.sleepAnimate * 2);
}

function SwipeProductionMenuToTop() {
  tapDown(430, 80, 40, 0);
  sleep(config.sleep);
  moveTo(430, 80, 40, 0);
  sleep(config.sleep);
  moveTo(430, 150, 40, 0);
  sleep(config.sleep);
  moveTo(430, 800, 40, 0);
  sleep(config.sleep);
  moveTo(430, 1500, 40, 0);
  sleep(config.sleepAnimate);
  tapUp(430, 1500, 40, 0);
  sleep(config.sleepAnimate * 2);
}

function setProductionBuilding(building) {
  if (config.currentProductionBuilding !== building) {
    console.log(
      'Send running as currently in {0} (last record was {1})'.format(building, config.currentProductionBuilding)
    );
    config.currentProductionBuilding = building;
    sendEvent('running', '');
  }
}

var pageFirstItemEnabled = [{ x: 569, y: 119, r: 121, g: 207, b: 12 }];
var pageSecondItemEnabled = [{ x: 571, y: 223, r: 121, g: 207, b: 12 }];
var pageThirdItemEnabled = [{ x: 603, y: 331, r: 123, g: 207, b: 8 }];
var pageFourthItemEnabled = [{x: 599, y: 128, r: 121, g: 207, b: 12}];
var pageFifthItemEnabled = [{x: 596, y: 232, r: 121, g: 207, b: 12}];
var pageSixItemEnabled = [{x: 597, y: 339, r: 121, g: 207, b: 12}];

var groupPageMaterialProdMenu = new RF.GroupPage('groupPageMaterialProdMenu', [
  rfpageWoodFarm,
  rfpageBeanFarm,
  rfpageSugarFarm,
  rfpagePowderFarm,
  rfpageBarryFarm,
  rfpageMilkFarm,
  rfpageCottomFarm,
])

function handleMaterialProduction() {
  var matchedPages = groupPageMaterialProdMenu.isMatchScreen(this.screen);
  console.log('groupPageMaterialProdMenu matchedPages:', matchedPages)

  if (matchedPages.indexOf('rfpageWoodFarm') !== -1) {
    console.log('wood farm, add more');
    qTap(pageFirstItemEnabled, 800);
    sleep(config.sleepAnimate);

    setProductionBuilding('wood');
    return true;
  } else if (matchedPages.indexOf('rfpageBeanFarm') !== -1) {
    console.log('bean farm, add more');
    qTap(pageFirstItemEnabled, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (matchedPages.indexOf('rfpageSugarFarm') !== -1) {
    console.log('sugar farm, add more');
    qTap(pageFirstItemEnabled, 800);
    sleep(config.sleepAnimate);

    setProductionBuilding('sugar');
    return true;
  } else if (matchedPages.indexOf('rfpagePowderFarm') !== -1) {
    console.log('Powder farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
    } else {
      qTap(pageFirstItemEnabled, 800);
      sleep(config.sleepAnimate);
      qTap(pageFirstItemEnabled);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (matchedPages.indexOf('rfpageBarryFarm') !== -1) {
    console.log('Barry farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
      qTap(pageSecondItemEnabled);
      sleep(config.sleepAnimate);
    } else {
      qTap(pageFirstItemEnabled, 800);
      sleep(config.sleepAnimate);
      qTap(pageFirstItemEnabled);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (matchedPages.indexOf('rfpageMilkFarm') !== -1) {
    console.log('Milk farm, add more');
    qTap(pageFirstItemEnabled, 800);
    sleep(config.sleepAnimate);
    qTap(pageFirstItemEnabled);
    sleep(config.sleepAnimate);

    setProductionBuilding('milk');
    return true;
  } else if (matchedPages.indexOf('rfpageCottomFarm') !== -1) {
    console.log('Cottom farm, add more');
    qTap(pageFirstItemEnabled, 800);
    sleep(config.sleepAnimate);
    qTap(pageFirstItemEnabled);
    sleep(config.sleepAnimate);

    setProductionBuilding('cottom');
    return true;
  }
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function swipeDownOneItem() {
  console.log('swipe down one item for 4th item as currently in:', config.currentProductionBuilding);
  tapDown(430, 319, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 319, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 280, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 230, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 200, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 176, 40, 0);
  sleep(config.sleepAnimate * 2);
  tapUp(430, 176, 40, 0);
  sleep(config.sleepAnimate * 2);
  return;
}

function swipeDown3Items() {
  console.log('swipe down to 3 item as currently in:', config.currentProductionBuilding);
  tapDown(430, 350, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 350, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 250, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 150, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 50, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, -70, 40, 0);
  sleep(config.sleepAnimate * 2);
  tapUp(430, -70, 40, 0);
  sleep(config.sleepAnimate * 2);
  return;
}

function swipeToToolShop456() {
  console.log('swipe down to item 456 as currently in:', config.currentProductionBuilding);
  SwipeProductionMenuToTop();
  tapDown(430, 350, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 350, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 250, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 150, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, 50, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, -80, 40, 0);
  sleep(config.sleep * 2);
  moveTo(430, -170, 40, 0);
  sleep(config.sleepAnimate * 2);
  tapUp(430, -170, 40, 0);
  sleep(3000);
  return;
}

function findProductRequirements(partUp) {
  if (partUp === undefined) {
    partUp = [92, 199, 306];
  }
  var imgOri = getScreenshot();

  var omin = 150;
  var omax = 255;
  var img = inRange(imgOri, omin, omin, omin, omin, omax, omax, omax, omax);

  var parts = [];
  for (var i = 0; i < partUp.length; i++) {
    var line1 = '';
    var line2 = '';
    var cImg1 = cropImage(img, 474, partUp[i], 40, 14);
    line1 = recognizeWishingTreeRequirements(numberImagesProdutRequirements, cImg1, 12, 0.7, 0.5);
    releaseImage(cImg1);

    var cImg2 = cropImage(img, 520, partUp[i], 40, 14);
    line2 = recognizeWishingTreeRequirements(numberImagesProdutRequirements, cImg2, 12, 0.7, 0.5);
    releaseImage(cImg2);

    line1 = line1.trim();
    line2 = line2.trim();
    // console.log(line1, line2);
    var part = [];
    if (line1.length === 0) {
      // do nothing
    } else if (line1.indexOf('/') === -1) {
      part.push([line1.substr(0, line1.length - 1), line1.substr(line1.length - 1, 1)]);
    } else {
      part.push(line1.split('/'));
    }

    if (line2.length === 0) {
      // do nothing
    } else if (line2.indexOf('/') === -1) {
      part.push([line2.substr(0, line2.length - 1), line2.substr(line2.length - 1, 1)]);
    } else {
      part.push(line2.split('/'));
    }
    for (var productIdx in part) {
      for (var reqIdx in part[productIdx]) {
        part[productIdx][reqIdx] = Number(part[productIdx][reqIdx]);
      }
    }
    parts.push(part);
  }
  // console.log(JSON.stringify(parts));
  releaseImage(imgOri);
  releaseImage(img);
  return parts;
}

function makeMagicLabGoodsToTarget() {
  var productIdx = config.magicLabProductIndex;

  SwipeProductionMenuToTop();
  while(productIdx > 3) {
    console.log('Move down 3 items, now:', productIdx);
    swipeDown3Items()
    sleep(1000);
    qTap(pnt(455, 37))
    productIdx -= 3;
  }

  var productMapping = {
    1 : pageFirstItemEnabled,
    2 : pageSecondItemEnabled,
    3 : pageThirdItemEnabled,
  }

  if (!checkIsPage(productMapping[productIdx])) {
    console.log('The selected product is not active, skipping');
    return false;
  }

  var stock = ocrProductStorage(goodsLocation[productIdx]);
  qTap(productMapping[productIdx]);
  sleep(config.sleepAnimate);

  console.log('Produce item: {0}, current stock: {1}'.format(config.magicLabProductIndex, stock))
  return true;
}

function makeGoodsToTarget(target, prework, stocks) {
  // TODO: recognize building to reduce drop order time
  var goodsOneStock = ocrProductStorage(goodsLocation[1]);
  if (goodsOneStock === -1) {
    console.log('OCR count failed, swipe to top');
    SwipeProductionMenuToTop();
    goodsOneStock = ocrProductStorage(goodsLocation[1]);
    if (goodsOneStock === -1) {
      console.log('OCR count failed twice, skip this round');
      return;
    }
  }

  var goodsTwoStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[2]) : -1;
  var goodsThreeStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[3]) : -1;
  // console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock, 'target: ', target);

  if (checkIsPage(pageToolShop)) {
    setProductionBuilding('toolShop');
  } else if (checkIsPage(pageIsJammery)) {
    setProductionBuilding('jammery');
  }
  // else if (checkIsPage(pageIsCarpentryShop)) {
  //   setProductionBuilding('carpentryShop');
  // }
  else if (checkIsPage(pageIsJampieDiner)) {
    setProductionBuilding('jampieDiner');
  } else if (checkIsPage(pageIsBakery)) {
    setProductionBuilding('bakery');
  } else if (checkIsPage(pageIsFlowerShop)) {
    setProductionBuilding('flowerShop');
  } else if (checkIsPage(pageInMagicLab)) {
    setProductionBuilding('magicLab');
  }
   else {
    setProductionBuilding('otherGoodShop');
  }

  var prodReqList = findProductRequirements();
  var availableSlots = countProductionSlotAvailable();
  if (stocks === undefined) {
    stocks = [];
    if (!checkIsPage(pageThirdItemEnabled)) {
      [goodsOneStock, goodsTwoStock].forEach(function (value, i) {
        var canProduce = value !== -1 ? true : false;
        // console.log('>', i, JSON.stringify(prodReqList[i]));
        if (prodReqList[i] !== undefined) {
          prodReqList[i].forEach(function (part) {
            // [0] is stock, [1] is requirement
            // console.log('>>', i, JSON.stringify(part));
            if (part[0] < part[1]) {
              console.log('Cant even build one, skip this');
              canProduce = false;
            }
            if (part[0] - part[1] * availableSlots <= config.productSafetyStock && value > config.productSafetyStock) {
              canProduce = false;
            }
          });
        }

        stocks.push({
          id: i,
          value: value,
          requirements: prodReqList[i],
          canProduce: canProduce,
        });
      });
    } else {
      var middleItemStock = -1;
      if (config.currentProductionBuilding !== 'otherGoodShop') {
        // === shop with 7 items only ===
        console.log('Special handle building:', config.currentProductionBuilding);
        swipeDownOneItem();
        middleItemStock = ocrProductStorage(goodsLocation['shovel']);
        console.log('id:3th item stock: ' + middleItemStock);

        // check shovel req
        prodReqList = prodReqList.concat(findProductRequirements([308]));

        swipeToToolShop456();
      } else {
        prodReqList.push([]);
        SwipeProductionMenuToBottom();
      }
      var goodsFourStock = checkIsPage(pageFourthItemEnabled) ? ocrProductStorage(goodsLocation[4]) : -1;
      var goodsFiveStock = checkIsPage(pageFifthItemEnabled) ? ocrProductStorage(goodsLocation[5]) : -1;
      var goodsSixStock = checkIsPage(pageSixItemEnabled) ? ocrProductStorage(goodsLocation[6]) : -1;

      prodReqList = prodReqList.concat(findProductRequirements([96]));
      if (goodsFiveStock !== -1) {
        prodReqList = prodReqList.concat(findProductRequirements([203]));
      }
      if (goodsSixStock !== -1) {
        prodReqList = prodReqList.concat(findProductRequirements([310]));
      }

      var productionItems = [
        goodsOneStock,
        goodsTwoStock,
        goodsThreeStock,
        middleItemStock,
        goodsFourStock,
        goodsFiveStock,
        goodsSixStock,
      ];
      productionItems.forEach(function (value, i) {
        var canProduce = value !== -1 ? true : false;
        // console.log('>', i, JSON.stringify(prodReqList[i]));
        if (prodReqList[i] !== undefined) {
          prodReqList[i].forEach(function (part) {
            // console.log('>>', JSON.stringify(part))
            // Assume we can make 5 items, part[0] is stock, part[1] is requirement
            if (part[0] < part[1]) {
              console.log('Cant even build one, skip this');
              canProduce = false;
            }
            if (part[0] - part[1] * availableSlots <= config.productSafetyStock && value > config.productSafetyStock) {
              canProduce = false;
            }
          });
        }

        stocks.push({
          id: i,
          value: value,
          requirements: prodReqList[i],
          canProduce: canProduce,
        });
      });
    }
  }

  for (var i = 0; i < stocks.length; i++) {
    var productionTarget = 10;
    if (i <= 3) {
      productionTarget = prework === true ? Math.max(10, target * Math.pow(0.85, i)) : target;
    } else {
      productionTarget = prework === true ? Math.max(10, target * Math.pow(0.6, i)) : target;
    }

    stocks[i].productionTarget = productionTarget;
    stocks[i].stockTargetFullfilledPercent = stocks[i].value / productionTarget;
  }

  if (
    config.currentProductionBuilding === 'toolShop' &&
    config.axeStockTo400 &&
    stocks.length > 0 &&
    stocks[0]['id'] === 0
  ) {
    stocks[0].productionTarget = 400;
    stocks[0].stockTargetFullfilledPercent = goodsOneStock / 400;
  }

  stocks.sort(dynamicSort('stockTargetFullfilledPercent'));
  var pageLockedGood = [
    { x: 351, y: 244, r: 121, g: 207, b: 12 },
    { x: 305, y: 244, r: 121, g: 207, b: 12 },
    { x: 425, y: 244, r: 219, g: 207, b: 199 },
    { x: 425, y: 105, r: 60, g: 70, b: 105 },
    { x: 417, y: 297, r: 235, g: 219, b: 207 },
    { x: 381, y: 316, r: 237, g: 237, b: 229 },
  ];
  console.log('> ', JSON.stringify(stocks));

  for (var id in stocks) {
    var stock = stocks[id];

    if (stock['value'] === -1) {
      continue;
    }

    if (stock['stockTargetFullfilledPercent'] > 1) {
      // console.log('skip as: ', id, stock['stockTargetFullfilledPercent'], stock['stockTargetFullfilledPercent'] > 1)
      continue;
    }
    if (stock['notEnoughStock']) {
      // console.log('skip as: ', id, stock['notEnoughStock'], 'known not enough stock')
      continue;
    }
    if (!stock['canProduce']) {
      console.log('skip as stock below safety: ', stock['id'], JSON.stringify(stock));
      continue;
    }

    console.log(
      'adding item',
      stock['id'],
      'from ' + stock['value'] + ' to > ',
      stock['productionTarget'],
      JSON.stringify(stock)
    );

    if (stock['id'] == 0) {
      SwipeProductionMenuToTop();
      SwipeProductionMenuToTop();
      qTap(pageFirstItemEnabled, 800);
    } else if (stock['id'] == 1) {
      SwipeProductionMenuToTop();
      SwipeProductionMenuToTop();
      if (checkIsPage(pageSecondItemEnabled)) {
        qTap(pageSecondItemEnabled, 800);
      }
    } else if (stock['id'] == 2) {
      SwipeProductionMenuToTop();
      SwipeProductionMenuToTop();
      if (checkIsPage(pageThirdItemEnabled)) {
        qTap(pageThirdItemEnabled, 800);
      }
    } else if (stock['id'] == 3) {
      SwipeProductionMenuToTop();
      SwipeProductionMenuToTop();
      swipeDownOneItem();
      qTap(pageThirdItemEnabled, 800);
    } else if (stock['id'] == 4) {
      if (config.currentProductionBuilding !== 'otherGoodShop') {
        SwipeProductionMenuToTop();
        SwipeProductionMenuToTop();
        swipeToToolShop456();
      } else {
        SwipeProductionMenuToBottom();
        SwipeProductionMenuToBottom();
      }
      if (checkIsPage(pageFourthItemEnabled)) {
        qTap(pageFourthItemEnabled, 800);
      }
    } else if (stock['id'] == 5) {
      if (config.currentProductionBuilding !== 'otherGoodShop') {
        SwipeProductionMenuToTop();
        SwipeProductionMenuToTop();
        swipeToToolShop456();
    } else {
        SwipeProductionMenuToTop();
        SwipeProductionMenuToTop();
        swipeToToolShop456();
      }
      if (checkIsPage(pageFifthItemEnabled)) {
        qTap(pageFifthItemEnabled, 800);
      }
    } else if (stock['id'] == 6) {
      if (config.currentProductionBuilding !== 'otherGoodShop') {
        swipeToToolShop456();
      } else {
        SwipeProductionMenuToBottom();
        SwipeProductionMenuToBottom();
      }
      if (checkIsPage(pageSixItemEnabled)) {
        qTap(pageSixItemEnabled, 800);
      }
    }

    for (var timer = 0; timer < 4; timer++) {
      var latestCount = countProductionSlotAvailable();
      if (handleNotEnoughStock()) {
        stocks[id]['notEnoughStock'] = true;
        sleep(800);
        break;
      } else if (checkIsPage(pageLockedGood)) {
        qTap(pageLockedGood);
        waitUntilSeePages([pageInProduction, pageInMagicLab], 5);
        break;
      } else if (waitUntilSeePages([pageInProduction, pageInMagicLab]) && availableSlots != latestCount) {
        availableSlots = latestCount;
        break;
      }
      sleep(1000);
    }

    if (countProductionSlotAvailable() == 0) {
      console.log('No slots, stop at: ', stock['id']);
      return stocks;
    }
    // Add check if there are no worker
  }

  return stocks;
}

function countMagicLabSlotAvailable() {
  var groupPageMagicLabSlot = new RF.GroupPage('groupPageMagicLabSlot', [
    new RF.Page('firstSlot', [{ x: 55, y: 69, r: 82, g: 56, b: 107 }]),
    new RF.Page('secondSlot', [{ x: 53, y: 120, r: 82, g: 56, b: 107 }]),
    new RF.Page('thirdSlot', [{ x: 49, y: 168, r: 82, g: 56, b: 107 }]),
    new RF.Page('fourthSlot', [{ x: 52, y: 223, r: 82, g: 56, b: 107 }]),
    new RF.Page('fifthSlot', [{ x: 50, y: 264, r: 77, g: 55, b: 110 }]),
    new RF.Page('sixSlot', [{ x: 48, y: 314, r: 82, g: 60, b: 115 }]),
  ])
  var matchedPages = groupPageMagicLabSlot.isMatchScreen(this.screen);

  console.log('countMagicLabSlotAvailable: ', matchedPages.length);
  // TODO: test me
  return matchedPages.length;
}

function countProductionSlotAvailable() {
  if (checkIsPage(pageInMagicLab)) {
    return countMagicLabSlotAvailable();
  }

  var groupPageMagicLabSlot = new RF.GroupPage('groupPageMagicLabSlot', [
    new RF.Page('firstSlot', [
      { x: 50, y: 69, r: 146, g: 88, b: 52 },
      { x: 49, y: 68, r: 146, g: 88, b: 52 },
      { x: 70, y: 90, r: 166, g: 104, b: 65 },
      { x: 42, y: 86, r: 173, g: 105, b: 66 },
    ]),
    new RF.Page('secondSlot', [
      { x: 50, y: 120, r: 146, g: 88, b: 52 },
      { x: 49, y: 111, r: 146, g: 88, b: 52 },
      { x: 46, y: 137, r: 173, g: 105, b: 66 },
    ]),
    new RF.Page('thirdSlot', [
      { x: 50, y: 170, r: 146, g: 88, b: 52 },
      { x: 49, y: 169, r: 146, g: 88, b: 52 },
      { x: 46, y: 179, r: 142, g: 78, b: 44 },
    ]),
    new RF.Page('fourthSlot', [
      { x: 50, y: 219, r: 146, g: 88, b: 52 },
      { x: 50, y: 218, r: 146, g: 88, b: 52 },
      { x: 42, y: 236, r: 173, g: 105, b: 66 },
    ]),
    new RF.Page('fifthSlot', [
      { x: 50, y: 269, r: 146, g: 88, b: 52 },
      { x: 50, y: 268, r: 146, g: 88, b: 52 },
      { x: 46, y: 286, r: 157, g: 95, b: 55 },
    ]),
  ])
  var matchedPages = groupPageMagicLabSlot.isMatchScreen(this.screen);

  console.log('countMagicLabSlotAvailable: ', matchedPages.length);
  // TODO: test me
  return matchedPages.length;
}

function JobScheduling() {
  if (!checkIsPage(pageInProduction) && !checkIsPage(pageInMagicLab)) {
    return false;
  }

  if (checkIsPage(pageInMagicLab)) {
    if (config.skipMagicLabProduction) {
      console.log('Skip magic lab as requested by config');
      return true;
    }
    else if (config.magicLabProductIndex !== 0) {
      console.log('Its magic lab, build selected {0}th item'.format(config.magicLabProductIndex));
      return makeMagicLabGoodsToTarget();
    } else {
      console.log('Magic lab produce the same way as other product buildings')
    }
  }

  var pageProducing = [
    { x: 76, y: 86, r: 134, g: 231, b: 0 },
    { x: 61, y: 89, r: 123, g: 228, b: 0 },
    { x: 38, y: 32, r: 203, g: 235, b: 236 },
  ];
  var pageCancelProduction = [
    { x: 443, y: 97, r: 57, g: 166, b: 231 },
    { x: 436, y: 97, r: 255, g: 255, b: 255 },
    { x: 390, y: 105, r: 57, g: 69, b: 107 },
    { x: 408, y: 241, r: 8, g: 166, b: 222 },
    { x: 296, y: 243, r: 8, g: 166, b: 222 },
  ];
  var pageCancelMultipleProduction = [
    { x: 442, y: 94, r: 34, g: 85, b: 115 },
    { x: 404, y: 244, r: 8, g: 166, b: 222 },
    { x: 303, y: 246, r: 8, g: 166, b: 222 },
    { x: 430, y: 238, r: 222, g: 207, b: 198 },
  ];
  if (!checkIsPage(pageProducing)) {
    qTap(pnt(51, 66));
    sleep(config.sleepAnimate * 3);
  }
  if (checkIsPage(pageCancelProduction)) {
    qTap(pageCancelProduction);
    sleep(config.sleepAnimate * 2);
    console.log('Found ask to cancel dialog in production, close it');
  }
  if (checkIsPage(pageCancelMultipleProduction)) {
    qTap(pageCancelMultipleProduction);
    sleep(config.sleepAnimate * 2);
    console.log('Found ask to pageCancelMultipleProduction dialog in production, close it');
  }
  var emptySlots = countProductionSlotAvailable();
  if (emptySlots === 0) {
    console.log('No available production slot, skip this production');
    return true;
  }
  // console.log('emptySlots: ', emptySlots);

  if (checkIsPage(pageInMagicLab) && config.skipMagicLabProduction) {
    console.log('Skip magic lab as requested by config 2');
    return true;
  }

  var materialCount = ocrMaterialStorage();
  if (materialCount == -1) {
    console.log('This is not a material production');
  } else if (materialCount >= config.materialsTarget) {
    console.log('Skip as stock enough: ', materialCount);
    return true;
  } else {
    console.log('Material stock: ', materialCount, ', target: ', config.materialsTarget);
    if (
      rfpageWoodFarm.isMatchScreen(this.screen) &&
      config.keepProduceUntilWoodEnough &&
      materialCount < Math.min(200, config.materialsTarget)
    ) {
      console.log('keep producing until wood is enough: ', materialCount, Math.min(300, config.materialsTarget));
      config.lastGotoProduction = Date.now();
    }
    else if (
      rfpageBeanFarm.isMatchScreen(this.screen) &&
      config.keepProduceUntilWoodEnough &&
      materialCount < Math.min(100, config.materialsTarget)
    ) {
      console.log('keep producing until bean is enough: ', materialCount, Math.min(200, config.materialsTarget));
      config.lastGotoProduction = Date.now();
    }
    else if (
      rfpageSugarFarm.isMatchScreen(this.screen) &&
      config.keepProduceUntilWoodEnough &&
      materialCount < Math.min(100, config.materialsTarget)
    ) {
      console.log('keep producing until sugar is enough: ', materialCount, Math.min(200, config.materialsTarget));
      config.lastGotoProduction = Date.now();
    }

    handleMaterialProduction();

    if (checkIsPage(pageInMagicLab) && config.skipMagicLabProduction) {
      console.log('Skip magic lab as requested by config 3');
      return true;
    }

    if (countProductionSlotAvailable() !== emptySlots) {
      sendEvent('running', '');
      return true;
    }
    return false;
  }

  // Prework = true will order decreased stock for high level products
  var stocks = makeGoodsToTarget(config.goodsTarget, true);

  // And rerun one without prework if has enough space
  if (countProductionSlotAvailable() > 0) {
    console.log('still have space after prework, keep producing');
    SwipeProductionMenuToTop();
    makeGoodsToTarget(config.goodsTarget, false, stocks);
  }

  if (countProductionSlotAvailable() !== emptySlots) {
    sendEvent('running', '');
    return true;
  }
  return false;
}

function handleNotEnoughStock() {
  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }

  var pageNotEnoughStock = [
    { x: 428, y: 98, r: 56, g: 167, b: 231 },
    { x: 345, y: 104, r: 60, g: 70, b: 105 },
    { x: 370, y: 176, r: 243, g: 233, b: 223 },
    { x: 349, y: 247, r: 121, g: 207, b: 12 },
  ];
  if (checkIsPage(pageNotEnoughStock)) {
    console.log('quiting not enougth stock (pageNotEnoughStock)');
    qTap(pageNotEnoughStock);
    sleep(config.sleepAnimate);

    return waitUntilSeePages([pageInProduction, pageInMagicLab], 6);
  }

  var pageTwoItemNotEnoughStock = [
    { x: 444, y: 98, r: 56, g: 166, b: 231 },
    { x: 375, y: 105, r: 60, g: 70, b: 105 },
    { x: 420, y: 203, r: 243, g: 233, b: 223 },
    { x: 416, y: 246, r: 219, g: 207, b: 199 },
  ];
  if (checkIsPage(pageTwoItemNotEnoughStock)) {
    console.log('quiting not enougth stock (pageTwoItemNotEnoughStock)');
    qTap(pageTwoItemNotEnoughStock);
    sleep(config.sleep);
    return waitUntilSeePages([pageInProduction, pageInMagicLab], 6);
  }

  // Disney materials cannot be bought via crystals
  var pageNotEnoughDisneyMaterial = [
    { x: 299, y: 244, r: 123, g: 207, b: 8 },
    { x: 349, y: 243, r: 123, g: 207, b: 8 },
    { x: 413, y: 18, r: 127, g: 105, b: 0 },
    { x: 532, y: 21, r: 4, g: 73, b: 127 },
    { x: 313, y: 249, r: 104, g: 175, b: 7 },
    { x: 429, y: 96, r: 57, g: 69, b: 107 },
    { x: 227, y: 27, r: 126, g: 126, b: 126 },
  ];
  if (checkIsPage(pageNotEnoughDisneyMaterial)) {
    console.log('quiting not enougth stock (pageNotEnoughDisneyMaterial)');
    qTap(pageNotEnoughDisneyMaterial);
    sleep(config.sleepAnimate);

    return waitUntilSeePages([pageInProduction, pageInMagicLab], 6);
  }
  return false;
}

// This window can change language
var pageNewDataPackAvailable = [
  {x: 358, y: 265, r: 123, g: 205, b: 8},
  {x: 373, y: 219, r: 8, g: 165, b: 219},
  {x: 210, y: 190, r: 255, g: 255, b: 255},
  {x: 258, y: 83, r: 57, g: 69, b: 106},
  {x: 246, y: 125, r: 153, g: 147, b: 139},
];
var pageNewDataPackDownloadFailed = [
  {x: 350, y: 245, r: 123, g: 205, b: 8},
  {x: 342, y: 107, r: 57, g: 69, b: 106},
  {x: 264, y: 245, r: 221, g: 205, b: 195},
]

// If already choose language in pageNewDataPackAvailable
var pageNewDataPackAvaiableNoLanguage = [
  {x: 366, y: 252, r: 123, g: 205, b: 8},
  {x: 398, y: 254, r: 221, g: 205, b: 195},
  {x: 263, y: 254, r: 147, g: 217, b: 57},
  {x: 246, y: 254, r: 221, g: 205, b: 195},
  {x: 341, y: 96, r: 255, g: 255, b: 255},
  {x: 284, y: 99, r: 253, g: 253, b: 251,}
]

function handleUnexpectedMessageBox() {
  if (checkIsPage(pagePurchaseDiamond)) {
    console.log('Accidentally goto purchase diamond page, hit back twice');
    keycode('BACK', 1000);
    sleep(2000);
    keycode('BACK', 1000);
    sleep(2000);
    return false;
  }

  if (checkIsPage(pageGooglePlaystoreHasStopped)) {
    console.log('Found pageGooglePlaystoreHasStopped, press it');
    qTap(pageGooglePlaystoreHasStopped);
    sleep(2000);
    return false;
  }

  if (checkIsPage(pageCookieKingdomNotResponding)) {
    console.log('Found pageCookieKingdomNotResponding, press it');
    qTap(pageCookieKingdomNotResponding);
    sleep(2000);
    return false;
  }

  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }

  if (checkIsPage(pageCookieKingdomIsNotResponding)) {
    console.log('Found pageCookieKingdomIsNotResponding, press it');
    qTap(pageCookieKingdomIsNotResponding);
    sleep(2000);
    return false;
  }
  if (checkIsPage(pageCookieKingdomIsNotResponding2)) {
    console.log('Found pageCookieKingdomIsNotResponding2, press it');
    qTap(pageCookieKingdomIsNotResponding2);
    sleep(2000);
    return false;
  }
  if (checkIsPage(pageCookieKingdomHasStopped)) {
    console.log('Found pageCookieKingdomHasStopped, press it');
    qTap(pageCookieKingdomHasStopped);
    sleep(2000);
    return false;
  }

  if (checkScreenMessage(theReloginIntoAnotherDeviceMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theReloginIntoAnotherDeviceMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    for (var i = 0; i < config.sleepWhenDoubleLoginInMinutes; i++) {
      sleep(60000);
      sendEvent('running', '');
      console.log('Detect relogin, wait: ', i, '/', config.sleepWhenDoubleLoginInMinutes, 'mins to restart...');
    }
    return true;
  }

  if (checkIsPage(pageNewDataPackAvailable) || checkIsPage(pageNewDataPackAvaiableNoLanguage)) {
    console.log('New data pack available found, tap and wait for download');
    qTap(pageNewDataPackAvailable);
    sleep(10000);
    for (i = 0; i < 18; i++) {
      if (checkIsPage(pageNewDataPackDownloadFailed)) {
        console.log('Failed to doenload resources, tap to continue');
        qTap(pageNewDataPackDownloadFailed);
        break;
      }
      // wait for yellow bar (download progress bar) disapper
      if (!checkIsPage([{ x: 16, y: 349, r: 255, g: 210, b: 76 }])) {
        console.log('download finished');
        break;
      }
      console.log('wait for download: ', i);
      sleep(3000);
    }
  }

  handleBTSIntro();
}

function handleBTSIntro() {
  var pageACookieIntroBTSRoom = [
    {x: 167, y: 322, r: 205, g: 142, b: 247},
    {x: 218, y: 21, r: 65, g: 14, b: 24},
    {x: 315, y: 20, r: 67, g: 54, b: 0},
    {x: 423, y: 18, r: 0, g: 34, b: 67},
  ];

  if (!checkIsPage(pageAnnouncement) && checkIsPage(pageACookieIntroBTSRoom)) {
    console.log('Found pageACookieIntroBTSRoom, tap into');
    qTap(pageACookieIntroBTSRoom);
    sleep(2000);
    qTap(pageACookieIntroBTSRoom);
    sleep(2000);
  }

  var pageInBTSTrailer = [
    {x: 524, y: 333, r: 107, g: 52, b: 231},
    {x: 33, y: 326, r: 255, g: 255, b: 255},
    {x: 24, y: 18, r: 209, g: 142, b: 242},
    {x: 24, y: 14, r: 206, g: 130, b: 244},
  ];
  // var pageInBTSTrailerLeaving = [
  //   {x: 619, y: 12, r: 49, g: 162, b: 231},
  //   {x: 524, y: 19, r: 86, g: 86, b: 86},
  //   {x: 28, y: 16, r: 86, g: 70, b: 45},
  // ]
  if (checkIsPage(pageInBTSTrailer)) {
    console.log('found pageInBTSTrailer, leaving');

    for (var i = 0; i < 20; i ++) {
      if (checkIsPage(pageInBTSTrailer)) {
        console.log('trying to leave the BTS trailer: ', i)
        qTap(pnt(620, 20));
        sleep(2000);
      } else {
        console.log('Finally left the BTS trailer')
        break;
      }
    }
  }
}

function handleWelcomePage() {
  var pageWelcome = [
    { x: 25, y: 288, r: 225, g: 163, b: 42 },
    { x: 41, y: 255, r: 243, g: 60, b: 56 },
    { x: 131, y: 255, r: 253, g: 217, b: 52 },
    { x: 177, y: 257, r: 181, g: 48, b: 60 },
    { x: 204, y: 282, r: 225, g: 163, b: 40 },
    { x: 67, y: 324, r: 103, g: 19, b: 36 },
    { x: 160, y: 326, r: 104, g: 21, b: 38 },
  ];

  // TODO: Need to handle login event

  var pageProductionList = [
    { x: 315, y: 12, r: 204, g: 8, b: 40 },
    { x: 420, y: 9, r: 240, g: 172, b: 2 },
    { x: 526, y: 11, r: 0, g: 193, b: 255 },
    { x: 71, y: 303, r: 158, g: 125, b: 97 },
    { x: 133, y: 338, r: 154, g: 96, b: 69 },
    { x: 497, y: 302, r: 158, g: 126, b: 97 },
    { x: 627, y: 302, r: 160, g: 129, b: 101 },
  ];

  if (checkIsPage(pageWelcome)) {
    console.log('In welcome page, entering game');
    qTap(pnt(324, 329));
    sleep(config.sleepAnimate);

    for (var i = 0; i < 5; i ++) {
      if (checkIsPage(pageAnnouncement)) {
        qTap(pageAnnouncement);
        sleep(config.sleepAnimate);
        break;
      } else if (checkIsPage(pageProductionList)) {
        keycode('BACK', 1000);
        // break;
      }
      qTap(pnt(50, 329));
      sleep(3000);
      console.log('tap and wait for announce page');
    }
    handleFindAndTapCandyHouse();
  } else {
    console.log('Confirmed not in welcome page');
  }
}

function handleAnnouncement() {
  var pagePuffShowGuild = [
    { x: 318, y: 325, r: 255, g: 192, b: 0 },
    { x: 332, y: 257, r: 255, g: 243, b: 239 },
    { x: 369, y: 318, r: 50, g: 27, b: 22 },
    { x: 418, y: 318, r: 47, g: 7, b: 5 },
    { x: 566, y: 344, r: 17, g: 26, b: 36 },
  ];
  if (checkIsPage(pagePuffShowGuild)) {
    console.log('found puff teach guild page, tap announcment twice to leave');
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
  }

  if (checkIsPage(pageAnnouncement)) {
    console.log('found announcement page, leaving');
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
    return true;
  }
  return false;
}

function findAndTapCandy() {
  var pageCanUpgradeCandyMansion = [{ x: 303, y: 289, r: 123, g: 207, b: 8 }];
  var pageCanUpgradeCandyHouse = [{ x: 243, y: 287, r: 151, g: 218, b: 55 }];
  var pageCookieHouseUpgradeRequirement = [
    {x: 351, y: 320, r: 123, g: 207, b: 8},
    {x: 282, y: 322, r: 148, g: 219, b: 57},
    {x: 199, y: 199, r: 118, g: 234, b: 231},
  ]

  var foundResults = findSpecificImageInScreen(candy, 0.95);
  // console.log('candies > ', JSON.stringify(foundResults));
  if (foundResults.length === 0) {
    console.log('findAndTapCandy did not see any candy > 0.91, skipping')
  } else {
    for (var i in foundResults) {
      if (foundResults[i] === undefined) {
        console.log('No more candies to collect, i: ', i)
        break;
      }
      if (foundResults[i].x < 50 || foundResults[i].x > 575 || foundResults[i].y < 37 || foundResults[i].y > 300 ) {
        console.log('Skipped as this point exceed feasible area: ({0}, {1}) (50<x<575, 37<y<300)'.format(foundResults[i].x, foundResults[i].y));
        continue;
      }

      console.log('{0}, tapping candy {1} > {2}'.format(new Date().toLocaleString(), i, JSON.stringify(foundResults[i])))
      qTap(pnt(foundResults[i].x + 5, foundResults[i].y + 5));
      sleep(3000);
      handleTryHitBackToKingdom();

      foundResults = findSpecificImageInScreen(candy, 0.91);
      console.log('candies left > ', i, JSON.stringify(foundResults));
      if (foundResults.length === 0 || foundResults[i + 1] === undefined ) {
        config.lastCollectCandyTime = Date.now();
        console.log('Candy collected successfully:', i);
        break;
      }
    }
  }

  if (config.autoUpgradeCandyHouse) {
    for (i = 0; i < 10; i ++) {
      console.log('image match round:', i)
      foundResults = findSpecificImageInScreen(candyHouseUpgradeArrow, 0.86);
      if (foundResults.length > 0) {
        console.log('Found it via candyHouseUpgradeArrow:', JSON.stringify(foundResults))
        break;
      }
      foundResults = findSpecificImageInScreen(candyHouseUpgradeArrow2, 0.86);
      if (foundResults.length > 0) {
        console.log('Found it via candyHouseUpgradeArrow2:', JSON.stringify(foundResults))
        break;
      }
      sleep(300);
    }

    console.log('Trying to upgrade candy house, possible houses: ', foundResults.length);
    for (i = 0; i < foundResults.length; i ++) {
      if (foundResults[i] === undefined) {
        console.log('skip as not getting enough image match result');
        break;
      }
      if (foundResults[i].y > 270) {
        console.log('skip this house as y to large:', foundResults[i].y);
        continue;
      }
      console.log('Tap candy house green upgrade at: ', JSON.stringify(foundResults[i]));
      qTap(pnt(foundResults[i].x, foundResults[i].y + 25));
      if (waitUntilSeePages([pageCanUpgradeCandyMansion, pageCanUpgradeCandyHouse], 3)) {
        qTap(pageCanUpgradeCandyHouse);
        sleep(config.sleepAnimate * 2);
        if (waitUntilSeePage(pageCookieHouseUpgradeRequirement, 4)) {
          qTap(pnt(357, 321));
        }

        if (waitUntilSeePage(pageInKingdomVillage)) {
          console.log('Successfully upgrade candy house at: ', JSON.stringify(foundResults[0]));
          break;
        } else {
          console.log('Find upgradable house but cannot upgrade due to not enough worker/resources');
        }
      } else {
        console.log('Cannot find cookie house/mansion upgrade page');
      }

      foundResults = findSpecificImageInScreen(candyHouseUpgradeArrow, 0.86);
      console.log('upgradable candy house left > ', i, JSON.stringify(foundResults));
      if (foundResults.length === 0 || foundResults[i + 1] === undefined ) {
        config.lastCollectCandyTime = Date.now();
        console.log('No more upgradeable candy house to check:', i);
        break;
      }
    }

    console.log('Finish try upgrading candy house');
    handleTryHitBackToKingdom();
  }

  return true;
}

function handleProductionDashboard(needProduceAll) {
  if (!handleTryHitBackToKingdom()) {
    console.log('Failed to handleTryHitBackToKingdom(), skipping handleProductionDashboard');
    return false;
  }

  if (!checkIsPage(pageHasDashboard)) {
    console.log('handleProductionDashboard cannot find pageHasDashboard, skipping');
    return false;
  }

  qTap(pageHasDashboard);
  if (waitUntilSeePages([pageInCookieActivityDashboard], 5, undefined, pageInProductionDashboard)) {
    qTap(pnt(408, 330));
    sleep(config.sleepAnimate);
  }

  if (!checkIsPage(pageInProductionDashboard)) {
    config.productionDashboardEnabled = false;
    console.log('Failed to find pageInProductionDashboard, skipping handleProductionDashboard');
    return false;
  }

  if (needProduceAll) {
    qTap(pnt(570, 340)); // Tap produce all (with icon) in list
    sleep(config.sleepAnimate);
    qTap(pnt(312, 112)); // Tap Lowest Qty in Storage first
    sleep(config.sleepAnimate);
    qTap(pnt(320, 278)); // Tap Produce all
    sleep(config.sleepAnimate);
    console.log('Just produce all lowest in dashboard');
  }
  if (checkIsPage(pageInProductionDashboard)) {
    console.log('going to the first building');
    qTap(pnt(18, 48));
    return waitUntilSeePage(pageInProduction);
  }

  console.log('handleProductionDashboard cannot meet success critiria');
  return false;
}

function findAndTapProductionHouse() {
  var houses = {
    artisan:
      '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',
    bakery:
      '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',
    barry:
      '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',
    beanshop:
      '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',
    carpentry:
      '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',
    cottom:
      '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',
    flower:
      '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',
    powder:
      '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',
    sugar:
      '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABMAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9EvC3/BVr4d67rFta3eh+PNDtrh1jN/qOlRpawbiAC7JK5AyQM7SBmvVfHP7T+l+D9OLWei+IvEd85xb2OmWnmzXHzKpbGflRdw3O+FXIyckA/K3iL9oHSNG+JmueGdUvvhz4F02ysGie+8SeHbjUotWSS3R8vKslvbQR5aSLyppi8pVdoAkQt8teNvjP4i+MGqax4d8I6hqXiAfa720m0vwTpo0vSbqzQoIZ28hA8kDLI8flSTXAUxuwZ1kWvzPhbLa+d414GnUjTcVzOU1JRUeruotfe1du3p9VnVHC5fRVeVOUk7JJNat7b2v8r2W9j2P/AIKPeOfF37W/h7TfBeqeMPCPguzt9RaXVfC1ldNqt8yxbgrXhhkWBWWRoGW2lds7nmDZtth8H8Nf8FNvFnhX4ft8F/FzSaxJ4DspPD+kQ6dcrptrqQgm+zBdTn3LO1vDGiBTA0JlEZScsJHkXznVPgz4++J8VrL4P0efVNI0OOW6uLXREdrt7mNTG9okUc0U9xEEnhMjW65QXC5wyhX4nwL8IvFHwRn1bTvEHgexs9Qm0oalpsHiDTore7GFbfCVlia4JaON5FSR4o1NvjbIz7D1cS4HAZbmUsqo4j23s9JPSPvLWWibaS83pZo+w4ZwaxuTRxdaEKc5O8I8yclF7O2j1221umfoV+zl+11Z658AY7jWdUs9I8L6UzW+m3EllFpsd1HFGzPEqRqkcskTRygiCMIAgABdXNN+NH7Sx0CTVNF09rjTdZtQRbSCGK8W7JDqoGyQeU28A/P8wxyjDIr46+GfxdX9qn4aR2U181v/AGTbLplzZqAFEfy7J44MtHbiRI42AiCorKyqoCDPr/wq+H9rpW1IElFnb42LI5k2KOiAtk7Rzgc4BI44r81zbFww1WULe8nt27a9b/iux9vk2TQrU41nJOLV1bv1+7Z+ZT/4J9fEBvhV4v8Aip8K/Emp6Z4fsbfULXWvDEF9qmye40mRCv2UvJt+0xWjiIrIxZla8dcKFArk/iv8Rl+Kv7WPxLgP9gXOgaWunaLbSW0q3Emt3EdotxdXkrAbZCBd29oCGYgWAUkbQow/20f2Y9L/AGwNQ3aH4dj1zxt4H0y41E2l3pitJeWMUimZIkmTdK6Nh0VAwkHmKA5bjyn4eXvhd/2e9ZvNKl0zw/e+G7ZDZ6TZ6e0Eb3cjk/umjGyFSxZwxI3bivLbgPJy3hqh/alTiSdSXNVgoOHK2oO8LyTu3aXLezVlzSd9NP5a8WeD62WZo6uBjz0q8raNLkb97W7SvKSaS0u3ZauKelrX7N+o+JfGUln4REdzbxnFzJdymO305yu4RvIAxYkY+VFZ1DoWAVgxg+M//BP/AOJVp4KN9pejv4it7UpLOmnxyNPHlTnEZUFxkjBXJIydoAr9Kf8AgmB8M9F8dfBzTb7XIIv+EV8MlVsheonnXV1LKVZmkUZkaW43lhw8kjJwd2K+4rHVb2PSC2meD9UbS4YYTbootrNp0kCEbIZZEMYQMwdZhE6lMKj5r7DI8PnGNqfWsKrQi7K8b3t3d0l6J3t06n31PhfhzhyNOjWg62KjZyqc7ik3r7sUmrW7p+re385/7M/wS+KXiqwGraOPsNpb5Fm17LJbzXDgAbYCo3jI+UMfk6jkg17D438XeLPi3p3h698Za9qevz2lrBa2Npdy/wCi6WghiQRxxD5AcRKGYAeYV3MGYlq/WXwb+zj8OUm8dX9jPHqWuWrXLSWcsTWsmjbhII90DYf5irssjALIAHTIwx/JPRrLXvHRtbTR9JaGC02GbU9UR4bZGGAfKjwJLg4LEbdsZx/rO1ehhsdj1i6izOMadldK1nH1vrqrPu/wPtcdnGRUMH9cVW0Y6OUra3V/dW/lZfjueV/tL2C23jazmjVI4YbGGFY1TaozJOeMdMbf1or2TXv2PLPxdbI2peJtevdSbYZJisKxZUEYSJUG1csxC7iRuOSTzRXq0uIMBGKjKf4M+Bfilw/KTkqkl/25L9Ez7w/aJ8U/CfSJbfTfEC3WpfErW9GuF0HRtItLzUdUvCscjRyC1tVZioZHw8ihDsYEkIdvyf8AECfxZ8BPg5H/AMJx4Rk+H+n61Y/ZdNW61aA+I9Wt5NTutRkjtbCFn+zkGW1WSW6aMRCMoAZJUA+zPhN42h0X49/FTWoN10+k+DPCdrcWqzNCczX2svjeBkMEZCCM/e6HkVjftX/soeGf20vhzbzRyGZvD8sk8crxOLuxDxndHIYWWQRvtUkoxRzEMgso2/X5TkqoZS61Dn9pOMZXUuVprVcrTja1+rd/R2OHMs9dLG8tWKnGm37tk7rqvednf5fefmd8Nvj94yvPirJr3gvXbXwbLoOnvY6dBZvuFvulSQwqxBMpYqTNJIpDcfLnKjlfj5b/ABG+K/xSj8YeKNY1bxDq3lwqt9DM0ssBjZiiIvBRUYlhsRVBkY8nJr66v/8Agm74PdbWzh0+exudRt82T6Gbq9iRgU/eb9pVU+dQSwAO4EEYNeH/ABF8NR6D8T/Gmj+Eta/tSbwneLBEupWhmvJbMWkbMoRGQ+ablJl5wWCZ24Civn+EMDlmcxlPD0nTnHRSe8t20ujdlrq31eup41PjrMeKcDWgoyhRg43fJG6968VzqLaXMk7Rlba1jxH4PfEub4PfFZdRu7aS3sAkNhqKbNm9GLbnA/2dsZAAJzlc8k1+glvrel6feaHpMmsro8OrXEaNqRT/AEeJHB/eFyjIVztHspBJABNfHvxf+Bniq20XTPiJ4q0NYdF0FjNjSW+3WN7GMlCbnIiaaI+YWCsVJRlVUO7P2Z/wSj/aN8F6B8DY/AHj6KNvGXhiFdSsrQW8l5dapbSwTQC3jjUEzyxIbmPylXAicEA7ZHHzXFXDMvrFOpyO+1mldrZaJvVPfyav2P3DhziCVDBzj7RVH1cbpKX2nqlpLfRWupNXvc95l+GsP7Hn7G/iT4g3lrocXj7wp4Jnntbq7hXbY3ENrPJDCSZGRn86doi8ZXzV8tOcDPyr+wH+zX4L/bJ1rUL7wzodraa/DM91rTaqqTyW7Of9bHKFCBJCx+SGKMIcgRBQGPW/8FSvizayeE2sPiHpWp6tqHiDTZn8PeFoZ5bbStALxtGtzdzqAl3eru5WIvFHlkBwfMk1v+DfWwjtfGPjyazY/ZbrS7Wdc/wb3yB6kEA/lXBxBw5isHRofWrxVVt2Ta0VtH06meU51Of1nFU0m4rRvW71vby2s76n2d4d/ZO0z9mr9mzVdH0XULg29ncW2rz7Yv3ccdteC7mWKMZILIJFxnn5QAo4rN+Ovxl1LwH8FXXwdcLeWWvSQnT7yxm82C0tRE05lt/LZ18oxQnOCV2ktkEEt7X4+1jS9K8IahJrmoQ2OmSW8kdxNM4RQhRt3J77dxxz0Nfnjda/ofiL4i3ejfBbS/FnxTurGd2dEu5LLw5bu27El2+5beVWEakFwVlCBTnG2vu+B8/w+BpvAeylUSfMoxXM7u292kldLWTSPhs1yevmkpY6vVUXs5SVo2XZpWuuyVz379kbRNI+GnwD8feKL7VobWPWLT7G9xPKBbM1vDO5ZZDgNgzsj8/I0To21o3A/Pz4e/Fnw7L4a0mzbVrdbqC0hikD5VN4QAjeRtzkHHPODivoL9rD9iLxhe/s2+KPHXxM+J10da8E6W15oPhjwtBGugQSKPKt7WeO4jdLmEvKqhPLBQ42SYAFUdQe1vlbT7pbeZbyJ1a3lAYTx4w42n7y4YAjpzz1rwuOsNip4/8AtLHRSda9oxldxUVH4ny2ejW2mj1e5h/qFh+J8v8A7OweK5FQkpOThdSlJNJL300k07t3burJW14G3lWdVeNtwYBlIPX0NFNuvgl/wry7lvvBVtZwrcEyXOmzzv5UjckPCx3CNuduwjYflxs2ncV8PKk5O9OzXm0n9x+KZ54U8VZdinh44WVVLaVNOUX9yuvRpP5Wb9k+BmouP2gP2rrdpG8mxt/BFrHuPYW07/zkP51Yu/izeeF9Uhn0G6kt761fct0h+6R2A6MD0IIKkZBBBr4j/Y2/bbtfhz8FfjtqHjLUNS1TxR4ivNBWOSd7i5W68iO5CLNdlWWHI2BRKwO0HaGC5PuP7KXxqtP2p/D+vXWn6bqGntoYjilMpSSCWZ13hYpVOHwo5BCkCRCRhlJ/qLKa1GOHpYZSTlyQ09IRT/FM+nzDGUMTjZToy5uZtr0u/u9HqfaPwe+MmhfFq7WzntbPQfEly+DBGfLtdSY4UeUzZ2yHhfLY4Py7T1A1Pi9+zJ4L+OWnQWPi/QV1JtPl823d5Zba6s3O3PlyxMkse4BQwVgHXg5HFfJ+4gV9X/sgftPaT8RNUg8F/ETbNezQt/ZWrSu0ZuPLUs8EzqR8+wFlZvv7X3Hdt39lSMqS5obfiisPUcnyXKvgf4P+HvhVJcx6Dby263Uzz3DGeR/tMrhAZJCzEyybY41EkhZwqBQdoxXIfCD/AIJ9/Dv4K+MrrxB8PdBbSvEerAfarm3luLuS0QMVEaJOzxRAKAFKLhUYqMAkV9GXekaB4L8TWFutreXMepTlIpL4eZ5KkYQFQoALt0DAkDk46DzD9tT9sm3/AGcvh8kfhm3tfFGuzakuizWVpMJ20h2hknDTW8PzH5Yj8nyEjJ3DGDxYzFU4Q+sVY3tqna7+SSb6dOxvWx31ShOTk1HqlfX5Lf8ArzJP2jv2P7X9qD4L6t4P8af2a1hdRbrZZp2F1bXCkFJFki+aPI3KSpOUkcFSCRXxJ8KvCPjr/gj542k8P6fZ6L8Qm8XWkFj4cu7e7+ztF5O6MJexuBsx5ykSg7H8piRHyot+OP20/id4wtZvs/ii6t9PvDuePT7aKD7KVbcYxIqCZQpABDNuxkN3FQ+Gb6fVdAl0fSNNe41rXBGk9tNZW9487KWd5orgoJLYl2AZUBBUkvIcAV+UZ/xVl+aThhpYedRxemri09NEld62V9V3PAynxSq4KrOGAg2pKzU0rPskle+/dejPS/Bvw3H7RWoW/iT44eONW+Ik8zSPaeD/AAUklxpFu4Yt5U19DiBSpLKEeVCpziRgefeNL+Pnhv4L2VrpkvgO9+GvhaRN1ncvDaLpllKz7THctaySLbsxIYyN+7Yk/vN/ynkfif4b+KHw+8KeGdJ8HrbX0cdhGJ7x2h+0SlQVyVmfaqNjIA3MMHtgn1jwB4N8Vaz4WtRrWlw/2lIjC4NujLbEZOMM+ByuM9s5xxX6ZlTwlCUsJQw7pRik27JRb8pfaa6t366n0tbP8Xj6zp4pSvFLVr3V5R6aeWh4l+3rqtxrHiXwX4Jur7UP+EN8SabqWo6za2MyWs+oyWd1pclqRcBDJEEllMmYmQsyqCSuQeM8PfsM/D+XSNCufEWu+AfDNz4rUzaa9+2Nav2jbyxKsrlZXnVnXEiytIpkU7gSDXeftG/set4c8M6DfaDqUOiWul65ZQW+mi4EsaPqF5DZG1gfD/Z4ZZJ4C8GDCTDEyLDIpmHkn/BUHQPBOj/D34T+CfihqkI1vSNTlvpbjwxMZb3S/DvlIl1uRl+Z53jMaArgspYbxE8bepjsUqNBSpNX27Xu/wBdPwPMx2LeFwrlezi09W1G90t+/ZnIfD/4i6Lrvi/xBo+i+Kv+Ey0jTrwpoutS2Rs31m1WKHzpQpVVfyrpposoB8iwsR+8VnK6NvGHjP4p23gm+8aQ+DdLk8I6FLpem6P4Z0iWwtNNW4+ytNGfMuZ9+w2kSJs2KAGwuGGCv5w4k+pPHzlgGnB22Vo368qstL7aW7aH9d8JxzGOV0oZqv3qVnrdtdG9XrbfW/fU+Qv2H/gv4h8af8Emvid4b0mzVNc1nx5p9sHMyx+agtHdkDjoAjEjkEGQ9OK9U/4J1fF69+HPh28+HevTW+rTWNrBrWiahbzMY9R064Ucx70VjHHICA56+ZgAKgz4L4I+PXij9nP4fWPgOGbUPD+tW+vahrV5bS7JbLU4Lmz0+CHK5aOZk+z3IBwSnmuFIJcDzmPw0kN/4Tu9N1TVrXWtAkSCK81W+N5a2ECMWg8iPyi8aQkk+WC4bcdvljcr/wBE0cLVVKjjMNHmTjHZ9Glt0d9Xp2P4+x2FVHEe0wXvwjommneN9Hpo773W5+l+sXMN1qMk1upWOY7yh6oT1H5/oa9F/Y4gWT9o/wAMFlDbXuGGR0P2abmvJ/B/ibSfiTocOpaBdRXVkF2yzNONokHUYIVl4IOwgt35yK9T/Zf22P7QfhXyZ2dvtZRmVSqkFGBwTyQQSDkCvSr6U5LyZSvzL1ON/wCCv/7UPxC+DvjHw3pdvNrWkeA/Elk4k1XSRtmnvkZ3kgklX97EFiSJkEe0yb5h84QhfnT9nfwMnjHxj4TjjtLSRdX1i2giu4bq4hnkjmkWLyTLE/yRtu+YohkBAw3G0/qp8Y/2WLP9qr4c6x4T1q3ddF1IGP7ThFkgZW+WSIujjepHDbSBzn0r4x8czn/gmv4/+GGi+NPBOh+L2W98zUPG9091e3dpaR6jHI94bPbKkMsNnKGjkjLS5spsNt3A/nfEmQ+1nTx1Cs4yjON03oo3Wse2u6+fTXxcZwPXzTM4YrD1XzJ3SeqSSu+XR2b5elrtn0D8UfgzpPw58ZeDdCjtbHWdP8Uztp15p+oQC6hs8NCWaLzNz5/fMCCQvyn5AxNe/wDhH9nLwv4IsWtdN0y3t7UcpBEFhiXJJJCxhMEkk9+STX522/7SGj/HX/gpV4R1zwprGt33gf8AtHSLCR7sS21vJqEjsg8iCUh/LKhAGMceW807RyW+/v2gP2lm+BOiW62XhHxR401y4QhLTSrRjFCwCYM8xBESszgAgOxOcKcHHuTzGm1Otde43Ftavo9bK/Vaan2GbYKnlqjiK6tzQUruOqu2mtLt6r/gHo3h7w5a2xgaztra3W4LRnZEI8BGdWJIGTjY2Mnn2zVqysV1K0hdluDbuZxJKinMAjLpje2eWaPH4j2NfO/hX9o39oLx94dk/s34P2XhmbzMRSa1O1vHFG5YsrCfyJJWy2cx7MDI2twa77wXonjiTQZIvHPiTw2uqR3MjQp4XspjZxxkA9Z2V1cuXJKlgeD1rLBY+ni52pqXq4yS/FK/yODC5hTrtezhK3dxaX42f4Hgf/BVjW9S8M/BnwX4f02eMX3i/wAX20TIL17FjHaW1zfo6XCxyNEyXVraPlF3Ns2gruLD5JsvhTrGp+FtY0rxJdeFPEcviO8t7vVNevdJvLjxJMsBAjiS+lvnSJRDugykCny5JMbWYMPr7/gp58WtB+EH7NesaBqVlq2u+IPHmny2elrPL5i6fLFtJ1HeVxEbd5IpIzhpBKIym0B5E/NHx18UtU+I9xC13qq3UMLeYltbR+Tbwv0yBksx4yC7MRuONvIr5njDNsXTqwoYOokrNT91Nq/m0907WVmrXb1VrxHG/COSYep/bOFeJxCa5Yp2XK/5r6JaN7SbvblSuz6o0jS4dD0q1srdWW3s4lgiDO0jBFAVQWYlmOAOSST1NFfNfgiPxXr2qx3drrniG3iXBM11qU80LN0O2Nm2NzngjAxyelFfkVejTpy5alVJ+d/0TP0LL/pNZFVoqX1HEJdLKla3lepH8jY+Knw6034p+DJtH1J3hjldHiniC+bBIrBgyFgcHjBwMlSw7184+KftmjePNa8P3H2CSW3SCKSeGz+zQSBYEl8/ywT5ThAWcj5QHkPCsQPq5rVYJn6s3QufvGvmvQrG18c+MPiL4Z1Czs5IbUTxi/EK/b5QHjUeZKQfM+6jfMCCyKTyBX7B4W4rF3r4enK8IpNRe3M2tb2bWiaa2d0+h+I8Dy5q0qdaT9mtWkle76q/p6fce2f8E/viX4e0vQ/FPhnxHrVjpbSSRXujtcSLDHJOSI5h5jYGCqxYT7xPIHBI+wv2S4V1L9oTwrsZZEa4aVWU5VgInbIPQjivyN8K6tJrmiw3UqxpJIiMQgIUZRW7k9ya/Zz9jfw3aad4/wDCtzFHtmW4mQH0UQTIFHoMc/XHoBX65mUFGLl3X6H1FSn76aPtLRPELWFtGs/zRKg56FOP5V+df/BX3wP4P8RftBeEPEOk2ir4y16FNL1dC5T+19Fj852++RF5gIdAE/fsm/HyIwHu/wDwUz/aY8Rfst/s6f8ACQ+G4tNmv5LyC1xfRPJGok3AthWX5hgEZJGeoNfkt8Tf2kvHf7VHjjwpp/jjxLeatbG6a0VI4IbVUSWOUNhYkVS2CcMwJAJHQkH834hzSnhaSo8t5z2urxVmt9Uz6DJc1p0s5oYR8ydR8t1purb9vkeg+GPE3hVfjtpsnw9htbG1jmit7jS7NWs4NT3F0ecKoKs8SzK370B3CYBG0Gv3EuPEuoixW1t5pFjhAVGWQq20Dv0zn1OTkfWv5yPhB+0d4otPC82pR3FuNR8Eael9oVw0W9tOczQoVVWJR0O5TsdWA2KAACwb+ib7QzGP+HK9R24rXIsVHEqrN7819kkm4xVlbfbd62sepnlFrD4bE2spQa+Jyek5btpX3vol102Od+JXxf0P4OeE5NV8T6xaaPZoxQz3MnzTSHJEUajLSysFO1EDM2MAE8V5qfjx4i8fXtuuh6DeeHdFlYs+oauoj1GWMFSHitMMIldSSGuSsqMpVrUjLL8u/wDBwPeXPgHSfhTrWjXl9pmt2N7drbaha3MkFzbrLGnmKroQRny09+DzgnPh/wDwR7/ar+IHjP8Abg8KeE/EPijWPE2ha9DfpcW+sXUl9saOzmuEdGkYkMHhUckjDMMcgj7jD4KDwzxC6XdvQ+V5lJaH6e+HPhdY6gH1D7Xqcck6jzr/AFCJZJJyMkDzDJuYA5wFG1egAHFWNR/ZE+Gfie7mudf8DeFvEuosDG95qukW9xJ77dynHTIOSfevQ9X0qHVn/fqzlMhWzytJcSNb6eGViWAC7jyTjjP14rx6kvaLllt2Bxi/dktD8sPjt8Nrf4UfFvxV4ds9S+02nh+5jW0umjy0imCKRlYKeWR2ZCRj7h4orL+LGqya34+8QX9wqtcXmpXFw/XG5pGY459aK/lzNsDCti5zh7qu7JX0V9EfitSi5VJeysld79r6L5LQ/9k=',
    wood: '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABEAFQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDoxHj/APVT402kc9anUDHTvUA1OAWv2jy7gWPnfZ/tgt5Psfnb9nk+fjyvM3/Ls3bs8YzX87x5pfCj8Mo06tW/souVtXZN2Xd22RT13xVpfhmSGPUdS07T5bskQJc3CRGbBAO0MRuwWUcf3h610H7MnjP4W+PvjXp9n448V6ba+B2s7hp7+31Hy7T7cslssFrcXUZxbo6STNkvGSYlAfkhvi/wB8abX4t/FG71bUrlfMvgDbQrOVktVXPlxIcZAXOc4ALFmxljX6cfs1/to/DX40r4JtPi1oek+KfFXga+E2iazfWgluLR1DIk25sk5KggMT88cbkB0Up9bhcijRcZ1HeS3VtP6X/Bt0P2HLeAYYN0sTiJc01q42TV7bLvbv3V7E37cWlfs/8Aw98Ixv4G8VaD/wAJlZzRLNpOl6ydSR7UFfNluh5jraLHEWlErlBIV2fOzJj5h8KftU/Dvwbpy+MPE1jrniTwVZzNY3kWmQtDcwXDhDFIVkaItENwyAwJMiHJ2tG/uH7ZP7IXirU/H81jpHiDwR4ps/ixd3LWdudWfTr3RLGWUJdu/wDo8sP2HT4p4B9qkMStvgtxEbiW2iuvkP8Abl/Yw0r9mf8AZ+8O6WfG2m6prWveIjLcJcwi3Ito0uIo5lgjaVxGEMbMcybjL8pIAB5sRTw6xkKVbljOXwxunzRXxStvZXSvbfv0eB4frZln8H7KMIQet3FucU7c3LvezVrrTu7JHsmgftCeE5Le68Sar8VrL4uaH5LWun+HtO+Hy+F7rTXSKTygbxfLKwQ7lTawuEYMGERK7hsWSulvGsjq0m0BmC7Qx7kDt9K+V/2cP2WtY/aU1O5+H9jN4Z0fVdXjmu7ef+14JraWYQ/avLCRzMhfdDEjJApeBZWZowFcV9MeCUlTwhpIuZVmuFs4RLIMgSNsGWGRnk5PPrXLxDBLklZX16Ly7D8YMvwuGjhp4dpzfNzOyu/h5dUlt72nma+/AH8qeHJP8P5VEGB//XTlIzj+tfMWPxHnJQWP/wCqiozjP3qKRPMcr4m1r7HYTWlrfWFrrF5DIlhHcyAeZNsYr8mcsARkgdgak8bftJWeq+A/HHhHwP430/w7oPgzwhZafoXhnXtOuLO51O3kt5be4hlMypNJdq3kCOSB2iO6PJJlaRfePgv+xK/7QX7PV9rmmmzm1B7+e2nsZ4lCXwUKRuZjtyAUUAgABc5OAK9e/ZA/4Je/DnwT8NYtS1zwxcSeLNUaaS6ub6SR7qzZpG3CN3+YBsBssMtwW3HLH1crx1enKdNUr31TbsnZ23169N9T+mOE+DMNlmCo45YpTjWjB1I8vvxbjzJR11Vm027baauy/BrxL8PYfhvo8NvqUN1perS3Bu4InjMFxFCVwsO1/nbGAQcck4ycEn2/TP2qW8c/s+6F/bHh+O31LwuotVvJSifacZBc7sMpYGNmUE+bIFIAwCv6mftc/wDBNvwnbeGprzUI7zWfB65e7s2iDXMDBcIySDG1ixIDqFI3KoxndX4U/tFeEm+AXx61bQGMetaHb3AltJLkJLcRwMMrlwqhpEB2sdoyUIAXt7mWYyeZVPqOKThVi+fq+ZbOzVumlvXrtvxHwFKphPr2ExTrQc7pNWcXZ3h8S+LRXuklr1u/sb4H/wDBQvQPhj8abHxV4413UrHwfrPhc6Jq8kWjvftbapaTxy2YdoI5Lna0d1qR+ZnTLgkK7Ozcz+1Rri/8FW/2o/C+j/C+71fUtB0PTJbSxF/pUunW4nkljkubza8QuHXAtIlZlwHUhQNxY/LM9u+lpN5Vw8lndokc1rKhKzRqBtxJkneOokO/twRkH7y/4IoeHdY+Aus674s8ReEbyM31vayaVeNJCwurVkkaSO3LFWUuJVYFtqOUXJXaCeXHcI5Zhs3nxXS5vrPLypNx5duXmty35uXRvm+HSx2ZPwhRqZrHM5xcajjrFW5U7d1te1r36nXeC/8AgkYvhPwhNo0nxU1DUvElq9zKLG3aGS3aQBomSSMxyeY67GDR/ag3BUBGNa/hfUr6eG60/WII7XXtFm+xanFCT5SzBEkDxk9Y3jkjkXPIWQBsMGA29O/4Ks+C/hx+0fq3w51LSLrS/D/hW6aPTtdNwIIY7qOJCUuLNYnIKy+YiukpVkSLgAk1j/H3Wbn4SeIrHxLr19pMEfjy/hgsfDscTy62N0SJHIqRu7SjYIGZBEFX7QAJXby45MsZ9arL/aVra8dtb2008unSy+e/iZwpLOcrUsvg6lajJ2Serj9tJN3e0WlvdaXNINu/XvUgl2/nxzVCz1JL7zGSO4QQytCfNgeLcy4zt3AbhyMMuQc8E1OGZm/3vavB5e5/KGKwtfDVXQxMHCcd4yTTXqnqvmWDcsP/ANeKKrmYxcHiijlOc+9f+CX7LL+zneJ826PXLkHIxnKRHP8AP8q+FPi3/wAFU/isf2mvFF54b8TCOz8Pa5c2FloL2CNYJBFNLCizx5SRtwhYzO8gKP5pR40ChPOP2ff+CmfxE/Yh+CuneMtQtv8AhLLPxlrAnl0GKNLYW1u8TlGhYnONkQfnJbeqgqSztu+O/iJ8M/8Ago18atL+J3wbv7PQvilbtu13wteTxaRf6nJ5EkQuMSlV+0xxkskoZkyqrI4DeZF9NgYyw9NwrKyTa5t4tpvS/S/nbXa5/XvAksNmGAo1adpxVOMGno4yhGMZaPdXV1KN9Ozul+jHwz/aY8TfGrTtb8CeNvAK+CfGWpaHdTafbw6vFqFreMsQHlmQrH5Vxufd5Q37FQlnBxu/Kf8Aaf8A+COepa/f28evXWuaH4mt08sPb2wurR49zHCL8jyLuO3zd2G2ZCjpX6lfs7fBXx1rfxftfHHxIjsbJ9BgnPh/Q9NaA6fpc1zlZpo3XdPJIYvkZpZNjbyyRRZCrqf8FN4hq37Efj9fJR7hdIuvJJA3KxgkHBPTIOPpmuHNfaUp/W8LV5ZxW6s1bt+Nv0PqcpxWHp4j6hKmp06jV9XpLund3W113vZn88PhSyuPhJ+1l4f+EfjrXdC1TS5NQsdMnv7K58y2jjl8sGMSfLgLu8t3GDGQxydtfr5+2f8AFmz/AGd/2cfFXiCHU9WtbBtAGm6FZ2Xlm1S5mtvLeWRAQGmglb7SSVMgWE9iuPg3/gnv/wAE8/Dn7SHx01/xR4+g0/UtI8PSpZQ2lwhuLeForWO7nmmixiQLHKiqh3KzM2RwCfav+Ckfxw8O/C678D6J4Ttda1a0u7fU4tasp4ovPsNNuLCbSndQmULPBf3fk7gQslscqUD49jEVPr1ShFO8uW8tFZu1/le1umux6FGisLGo5pct9L32vbV6teTV3a/kfHPxF07wD49/Z/bxd4TtfGlt4ih1KKCAXpt5LS809EljllkREUwTGWJHjhSSQIkjJmdlac/Uf7H3x/0L9rX9ma+8NeKLHQx8QPhzp015aeJ9VhE82l2UMDFb1JGYHbbRxKzpgFjBEd2SpXjPEHgPxJ8Zvg7Y/av+EC/Z3+EN5q9vqmmQazdQNfXEiWbQQK0pjgSRFD3syLshJN7M2HQReXznw5/ZH8e/sqWk3xs8F+O/BXjDTPDs11JewaZcFrfUtKAZZ38wHyvmiLPJCSRGAdruVVT3YiVLEUvZ1J+/fS7b1/lva3qY4WOIoVlWpxfLZX6O1ld23Vn23+Z598D/AIp+KvDnxD8TePodP/ty3XTTc6rbGFdOkNuZYIUmZEyiSiV4QwUSH96+Aclh9reG/Edl4t8PWOradK1xp+pW8d1bSlGTfG6hlbDAEZUg4IBGeleT+FP2ufD/AMd/2e7X4c+Ff2X/AATc/ELWbSPRP+ErsLWDdaXkgEQvFh+zAxPuO4FpwiHEhfYCK9cgttU015bPW9Pk0fWbJvJvbNmLiCUAFlV8AOoz1A65BAYMB8ljPayd6tPkabW6117LbSy/4dW/LPpFZRhm8LmuEwjptrknP2inzJKKhdJy/vWndXWjV0mTsu4/xUVia74wh0G8WGSOSRigfKjPcj+lFckaNRq6R/MKpzeqR8a/tq/HfxF8ToNL8Ox6La6MtvcpqcObg3FzJxPCEbaAo3bs4UtgoOWzgeAnWfMvYhrVtNp9/ZkmG9hkaGWAjJ3JMu0rg9m25PrWv4m06/sPFGpXyvrTRxXTNDc3ltJ5k0YJKM7AMocLjOGIyDgkVma54ztdblhF48FvJtCxDdt3AnII5PXPHbmv1zB4WOHoqgo6fPrvvc/qDgOOEo5RTpYWrGTWsrO+rbevVNbLa9r6n2V+xv8A8Ft/jZ+ylfWuk61eN8TvCcb7fsuqyCLU4F54Sf7rnLE/PhjgDdX3H8f/APgs/wDBf9qf9iXxQ2j+JIdD16O2KXui62y2d5AsqvENqOQZfvqcx7gM4zmvxMm8MXWm2wuLC4ZFOGZUyY+efmXoc9yMH3HFSQanY3eoWH/CRWTSWdvOkkqyqZIHUNluW+7lQc7uOcZNePjuGcLiItUm4X3Udn8novlbzTP0DD4xxrRrVIpyjs3v82t/nd9E0fpt/wAEzPA/jnwrrXirxdHz4b8Yi11XRrFLb7TdeUlukctxKnKLBcRKoKEb9hBJjYYrx3QvGt9+3P8A8FKbjWtNXTIdJ0URNDbQ2ohsjY2flgARjLGOeV2lAcuR9rzkgAV9yah+2do/wY/Y78WeJPDjPcLr+j/afD2vWTRTbrudfJgV1JBxGzrKANwws4bYQof8mz421LwVqWlXWm3uoaLLe2l1p9w1hdSW7XNsHTEUhQgtG20Eocj2rxctwc66nUh7rSUV6Ja3XfRfO57GPxChVjTkrpavXe7v92unY+kv2hfiRF8R/jf4sk16a3urXwffXOlQzX+I7GxQytFHFFAGJdpGjJllkx/q2bIjSNF840rx944+AnhDxzJ4k8Mtp+nfHLTrSO0vNSQxxmwVJ7OTy41Iw583C72BUKjlJFkUnmofEOnXXwq8KaLY2E2uXENssk9hYloo4LqRIGMlwsZ3bkVxGjtmPZuQ7cE1Na/Cf4ieK/GdjNcXzXi2Sw/2XEb6aVdIiibzFt4kYsYlEhZljjJjUscMB81dmFwsYJwqWSXfyd9Nd7pPqrXPoc+qSdCnHD9795K6a+6zafXax2X7EPjbx1+z38Y7NrHw7feKfBXiq+tbKbTkuI421BpGC27IGdQZFaYornAIkddw3ZH1R8c7/wAWX3xi8WeKtRWLS9P8O2dl/bPhue3t/tei2TrI0d088dzIDjEjEOAxjj4DMUaTzXR/2edU8eeAL66+ID6Zo3heOLzrq4upvJmjRCG3MqYChdhyG2tnrnpVXRPiv4K+HN3d+EfhNp+qapqviawkivdU1S/ktrGeJoJ44xJHM3m3Sxy7W8oRbMZZW4BrHHSjiZuo0rpWb6dNW27J/K58bxBleW1MoqUczmo0GtXLRxfRr0dmt9T05fB3i3xXZw6hoWgafqmnXBljWWaa9WRXimkhdWWGzmVfmjJG5wxUq2NrKSV82/tF+LbL4f8AxNuLeTw9oepfbI1vFuLma9jmYOWBB8m5jVsFSASuQoVc4UAFcmHyWVSlGotmr7P/AOTX5I/PuG/D/hXF5Vh8VUoOUpwi2+eortpX0TS3vsrC/sR/s06H+1v8HdX8UeKL3WobrS9XjsILbTrhbe3ClWfecozlgUA+9jBOQeCOx+IHwZ0L4L62NN0a3by7mEvJJNtZ33E7hhQFwe/y5PrRRXoZxWm60oNuy2V9Foj6LwnwdClw/SlSgot3bskru/W2584+AP2eNF8W/Eu+0qS61OzsYbydYo7VolEKB2KouYz8qjAA9AK92/Zz/Zs8M6l+1xovh3UYZtV0yGGW6Md3sbznjVCu8BQCCTyMAH6UUV6WOqTVOVm/hf5H2GDowdJSaV+bt5nqn/BXDxAmhfs3LBY6dp9nD4Z+Jd34btY4lcI1vaWUvlMy7sB8SEHYFTAGFGK+KfG/gWzX7VcLJdLLpd2sCHzMiUSqhJYHjI6DaF467jzRRXLw/J/Vl8/zRy47Wq2+y/Nn0d+z94Xt9flttCvHmmtdNgWOKXIWUqofhioAOfXGRgAEDivpz9iz4Y6F8TfGd9puqafG2m273duLWJmjSTy+Fd2B3ucMQQzFCD93gYKK8LP6ko0qnK7f8Oe5g2/YX9f0PP8A/gtP4Y024+D/AMHdSk0+zbUr+yliubsRKs867LKMBnGGO1ZZNvPy7jjqc/JGm+Ko/hP8UrOxtNJ03U5o5o7RL3UzNc3EaKw27f3gjVh/eVAx7k0UUsok3lsE9ve/9KZ/P/iRXqrNKtBSfJKCvG7s7N2utnboS/ty3Tf8LV0psL8+ixMeP+m09FFFfU5V/ukPQ+q4Jb/sLDf4f1P/2Q==',
    toolShop:
      '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',
    jammery:
      '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',
    diner:
      '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',
    inn:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAeABkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6G/4Jp/Czwd41+Dmm/D3TIwPh/wCGZIY1FxZr9pa5eYLs3bcGe4nm5cnktIcjkV9m+IfiZoHwv0FNE8K22m6TpcC3cKNBGkmJYWMcki7pEVsSAqxmMbO6kJ5u4E/McX7Ovxr/AGUv+CZ3xXvtI8bz+F9Y8L+Hm8W6BqxhSW4DaTPJrHkyxAqNkoi+zsDtO12ymODw3w3/AOCo3xm+Jf7Lvgrx9r1p4DvNY1nxVqFncalf6JPcS4toNPkjmaGJI1t5ybp0LKGTakbBhuZV/GspyupHASxDly1Ztu8oty+LTs9Vrbvq9rP9Vz/FzzDMvY05KVKnZJRfu35bt9U3e6v2Vup9dfG74B2f7TEugxX2tQRQWUEN8l9JZFbuSynTMYcYUCYNHMjKNoCylhtJ2iD/AId9fs+f3NU/K1/+MV+afwX/AOCjHxfvP+CpDard+MNW1jW9d1LTPCzWt9axDTvsNxfW6taGMOWjYMzGGRXUrISzo/mzh/2Z8v3r0sRkmXVcRKtVpJyla9/JLZX0PJedZ1l2Hp4elXcYJaJebd7u13r/AMA89/bF+FFt+0J+y14++CkvifUtEXxH4YurT+1NLJ82ElCwBUOnmxsVCyQllWWNnjYgOTX4z/Db4NfFf4O6fdeHL34IXtxqEEsPk3vh/U0ks71lRRuijkG+ME5UrIYwCM5VcE/sx+0L+0H4a/Z88CX3jrxHoF5fxWdhdXb29lsDPHbx+Y4yxAyV6DoT1I61+Ov7WH/BUj9oT45TzWnwJ07QvhpoFzZqUvbDTln1KdJQ6kkDy0gYjYQwMjoyna43V0UKjxdX6rGLlPda8qXq/PTZNm+T8uBw0sTXVqbdr7t90l39Wkenfs3ab+zF/wAE7PFWrftffth6ppw+IWsM954R+HlkFmk0YSGQmd+Xaa7cfIG3PDAfMVZhv+Ts/wDiJZ+Dv/Qiat/4KU/+TK+P/iL+yv8AAD9n7w9bfFf4/J4l+JniPU9Shty2taqHt5b2RXYmSMBFZCQ2XdJH+6cE5Nc7/wAIT8Jf+jL/AIb/APgzk/8AkOvCwGcUs+c6mEpVq6g+VyhKnSjddEpy55f4pWv2R7GYZfhMDUisRyQctUpKc3bpfkSjH0V/Vn//2Q==',
    cake:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAaABoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDL1b9sib9kb4C+FviVonh7Rrvxr431Sa18NWOuPI9jYxwJE11duiMpY7ZraJFDp81wWJYRlG+y/gR+2D4G+Mfwe0j4qeIPF3hXw3c6jaGe40RNfF59kONypJM6QFSRtyPL4LYGa+fv+CgX7Bfgm6/Zy8Iw6Fo9nfyeC/GMd2JdVV1jjtrmE2zQIE3MEe4FidpDjMSg7U3Mvy9YfDr4weDtQsr2++EV5PKlxc2dgG8O3BS6kQFnICRbZV2mVw4Z12x5RmVfl/MMuhhsuy1xlFe0UXJR196Tkly3W1lrd6JKy1Z+qZlTo55SdfDpzqKUlfmUfdUG4q0tLOSS0V05cz0TPoP4V/8ABUDwd+0f+2t4O+Dfif4I6FNBrGo6np9nrVn4hlukVIYpJIZBG8EYkUtGVDNjetyGCqUw36ACZQMBMAdBX5b/APBPP9kLXZ/2zPB/xk8SeEbPQrnRBq+rarp19aT291KPKns4wYDHsRvMu4pld2V2QBguGGz9QPtMf94fnXV/sa9+EVFvfzfr1PHzz2McVGlQvyxitLtpPra/6HMfFPwy/jv4Z+IPBrKSNV0W5tV8skMrPEwVlI5DAkEEHIIBBzXxB4J/bQi8Daba+DtU1rwt4gudEtZYJp7bxTHA1xI1zFlpovLk+zhAWjHzyF2KjAL4HqP/AAWQ8Qa94f8A2L7xtB1u7sTeeJtNtLw2dy0Xn28kpEkL7SNyMOGU8EdRX5W/2bp1l+zh4w8SWdhBFqNl428PRWV/FEFnt0ktdUZ1RwNyBmjjJAIBMak/dGOvA5ZRzDDSc907Ly2v16n1fC3D9PHZRXxk56Qa91Ld2738+3zP0A/Zv8TfHn45/H3UD8GfiNb2kOsyjU/iFrttYCY6XpkSzrZ6bEkjb1lmnml2Sv8AZ3eOyLmHy1Cv71ffswanLezSjxB4zuA0rET3N2fMk5+8/lxqm49TtULk8ADivkP/AIN7/E3iTV73xxDqviC+ukOpafMVuLt3BlljnEj4JPzP5ce49W2LnOBX6m5PrXoxynL8NaM6anpvJJ/8D8D4zMszxuCx0oUp8q0206Ld7v5v0sf/2Q==',

    // Rotated buildings
    artisan_r:
      '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',
    bakery_r:
      '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',
    barry_r:
      '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',
    beanshop_r:
      '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',
    carpentry_r:
      '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',
    cottom_r:
      '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',
    flower_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAcABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6m/bv/a40/wDZzufiz8Nvg74k8V/DzQ/hvY2Wra/qfhzRLeaLUtSvDay3FrG07Rt5ggvNM8tIJoSHvJmfeFiik6T9hT9r3xB+0Xf3f7PPxu8YW/ibS9Yv7m08KeJEeMXS3ENlFfRrE6JmdPszPJ9omWOUT286PGNxgt/Iv+CxHwqtLz4p+Gfjv8FPido11cePpRDd+Bb+4aSLV7y2ggD38McKlxPFaR2yu33gkMK5TlZLv/BF7x/P8f8A4un4h+KfhRLZ6d4d0oxeHNR0XT7uTS7TUTE0NwJLi42lJhE8sKqI9hBl3MWMefk+XhipwcoQpxvy20jrza31X2XfyVl52X9D4rPeCaHClPDyrQ+vWd4cjdeNZJWk5qPMotqMrylypNx02fjvgf8Aas/ar0HULfVbP4X3KXtjPcNqGoWmjh7a9Rm84i7tEjjhklMrGZ5LYQvMdiskm1TX2N+zD/wVj+DnjOyh8KfFbTrfwxdW7iB721QfYY2AJYS4ANqwVdzrIqBS4UZNbf7L2gaHqn7D3ji51PRrS5ksJtWvrN7m2SQw3EemxMki7gQCCo59Bivzl8TfB/Q9a+PUVnN4g1qOe60ma5fUU1Ddc/IrssRd1bzIh5a/JIHBxzX3vFHhdhc8zDOMwytqhHCTcWm2+dxjdu1rarr8Te7R+TcLeKOU5vhsuynibCupVxCXLXpWjOPM7RUk2ozSb1+F272P/9k=',
    powder_r:
      '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',
    sugar_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAqAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Tf2gtR+CfhPxP4U1vxT4YtIvEMuoCfRNdurpbK1huIEQot5dbJGRHCiMP5UhUBh8gJJ9Cv8AVPiJ4ZhbxVrXibwjeaVdywi0sFE1nLbrg+aq3LPKt7KSP3aeTb7scsOcfG3xt+L3wt/bf+FXhD4r/BT4jReIbfQbe4g1XS9DXzpPMufsxErQ534X7O4yFYos4Z1SMSOnQfBv9pPw3pvwT0nWPjL4/j1WWxaWPRrb7f8AaNSu7edknAhBDOyszqhmIMSBYzIyoisPG4W4c4czHh+ONgoyqSbVVX1TTdr2a5XZK70duttD1M8xWe4bMlhKzlaOkE1fR2+G+63206o4P/grV/wi/iX4Eab8SvA+lzfYPGTXVrrWjT5h8qcsLaZ2SMkNcCWTyjsONwZgzbiW/NTxT8bvA3w68L+GNM8U+EvEula1JokX9s2l/b7SZ1ADPHC8MLQxZyqjMgOxiHxgD97bj4CeB/ip8JdA8M/F3w7aPqNrY+dO+nzkra3syhrloSw5UyFsF1ORjIzX5y/8FLrvwl/wT+8eaB4d/wCEavPE0HiW0uLq1a31hbL7MkTRptYNBNuYljyCBxnvhfxTMG8pzWtUwtLnozm+Vc9nt10t3d7a+R9RmfB3Dfihk+DwOc1pxq4dP4UveT6KTTat7uzT0tqjqf2e/wDgmj+zNqP7K/wr+IHwW1LVfhh401f4faPq2o+K/CtwXS/vbm0iec3VtK2JFMjP8kbxjkLgqAouXF78Uf2XfEEuu/tifAyy+I2gyXIkm+Ivg+SdCnP37q2Up5fLBndk2HG1d5JNSfsdeJdD+G+kfEbxJ4mvrTQfCkXiGzstF0fTLcQW0FwbRJpI7S1gH+ule4XCxIZZXA4dsV7L4C+M37QXi2/t/F2i+C9I8NaIkCPDpHi20kk1TVCyZbzPs8/l6apOAARdPhiXSNl8s/0nm/DWXZpVlUmnGb+3F8s9dbX+1ba0lKK7HyOV8TZnlbdDm56a+y72+T3i/NNM91+BP7TXwQ/aN8PJ4g+Evjuz1FSAJLQPsuIGILbXiPzKdozgjIHXFfnz/wAF+NF0DxT8T/AH9one1jpN9Bj51wS8Emfl68Ov5V2P7RX7OPgOTd8XfDPw51X4IeNrJZbvUPFfgDVDqWhx/NtWCWBBb3bSuVjLeRZBAXYsZSK8J8W/D/xV+1fex6p+2X+2mvhefRE+z+Hbvw18OrzU5Ncjb/W3szSRKIwSkcaLsjb90+5F4Lfj2fcE43A1IQjiKbi3e85KnJKz3TbT16p/JH1uV8YcJZZXeIxNb2LcbKMnfVtaqWl1vulbTVs+mP2KfgT8Jb34cad8SPDvjga7e393qMiazKWu7S2uvtcsN5Hp7GRlit2nhkXzIwPPWNHYv8mPaPHPwB+I3ijwnLoHhfxS2m3V2o8rUNOkxLCAQTw5jPI4+Ug+/r5/+xZpWl6B8H9R0DQtNt7Kw074meMrXT7K0hWOG2gTxFqASKNFAVEUcBQAB2FfVegAKrRKAFW4lRVHQKJGAA9gABiv2vHVJzjKM9VK6a209VZr7z8sUI1aHLLZq2l1+K1PmPwd+zL8QtF8CeI/Bvxk8d32qWWqwKlkLuCbNvIHb54pX3qWyUkCkBFMR5fcBXz38Tvhv+0ILfTvBHizw94t1hdEMyaZLbyXGo2UdqSkca26oGWAHyd20kPtaMMibQD+ntx/osEKW37sb+icD9Kg1nw14ckdJ5PD9kzvku5tEJY8dTjmvk8x4WyzNqFOi+aHJdJqV21e9nzXbSd2rvS+h4uO4dwuLpQhGUo8qte/NdN82t7vR7a6bbH/2Q==',
    wood_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD88fid8PNa8BaMmhWt9oGmS3pbzIrXWLf91GoALDa2AWzgEf3G74I++v8AghB8ANE1fT5vCGkLosuq+LlaTWNRuIlufLsk+4kbA5VlKySADaHIGSdilfm//glf8DP2bf2gLrRfD/jfwZcax8Rde1JzpTa3Kbmxu3RmKxqoACSbASRKHjby/vKSFb9l/gb+xf4b/YH8EeJf2n7jTLKK88MeEL7UW8N6N5drBKlvazS+WzAeXGxDSKSqsM7SWYLtr8U4hzKWZzeVUqU+WM1zyvZNJ6r07dbrY/ZsuweGyajLMHOCqVIvkio+85NaN6d3q9ld6n094Z8D/Cr4A+B7i7sV0zQtJ0jTpLjVdYvZEhWO3iVpJZ7idsBUVQzszEIgB+6o48d+KH7OPwx/a61Wx+Onws8YeDNc0fVNNVIdbsni1CC+aOSRDJHPEWR1GAnyk4KHvmvjn/goBon7TOqfsvaT+0j8Z/2odW1bTdWuYby08GWmli00m1tpopNSh3eQAt1LAlo2wyo0sRUKXcHz5Pl34P8AwY/4Ko/Fvw9e+Pf2D/Avji18E3Wr3EMt1oHxGs/DVtqF7ARA9wI7ieJrwmKOBDdKHUmPyt26BkRzynA4/DKhOKUNGrWSX5WODDLMMtqSx6xKVVvlbet776vd6djS/wCCf/wt8GeBf+CpmjaR8PQbbT9E+JtyI7QRBY4hJZm4eJAANqo0zKuM/Kg+tfubLJNIGSaTKsMFccEGiivMTl9fr3fVP8zXiRJRoWVtH+h+Yf8AwU+8FfsZfssaReeLPjj8bPGUHh/U9VdpfAOhafMbXUbnMB/eFW2+d5UUUXm/JuiAjdmVEVflD/h+X+1poFlZ+Gf2fvhJ4X8L+DtMs47bQtH1K+lM8UKjO5vsoWMbiSdoztBAzgAAor6TI8NSzrL5YjGe81UlG1+Ve7ZJ+7Zt93JvysdWLq1MK6VGD+xGV2ot3lvumkvRJ92z/9k=',
    toolShop_r:
      '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',
    jammery_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAZABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Z/aO+LnxU/Ye0Kw+EH7OujajcaVNrypqOtWngi4uX09/La9nJmIkinY2ax7lSFnjRJ7geeYzaj03xP4c1T9oHwJpPjS00jS9Zmlt5pND8V6RcWt0YJYEZV8ycbILuKWWOVFdFikgklgUwHMzR/PnwK1/wV+0z8NfFHwH/ak8fRzeJtS+KOqahJ4QedLe18m6m4aB7zDSx2rwzxupQXNsUNvLFFINp6//AIJ//DCfxv8AtCeLfGtx4zt9T07wY8mn2msG0ttRub97qJ4mt7fVZoDcx2MKxh1hjmkXzZFCTCKOSOfgzngzhzCcD8vu89OKu7NNt2UVF9ddVL56+8fPZF4i8SYvxDcalOSjNycWpRkmo6yc0rOG/LytNbJtc0U/zQ+MPxWvfCX7RWvW1ppMclvc3kj6pYpMPPlvI5ZEubmFBgYYKjsgHLB3OCztRX6TftU/8E0Phz4P8G614v0mSyvfDtxe/bNe07VtNS4MkskqfvXQjbOxkKnJ27cKAvGQV+UZb4g1+HcDTy/FYdylBWT51qunR+m72+R/V1HLsszqLxVBxkm3fSUWnu013V97Lfru/jX4kfEPwnYa7pfxO+LFzN4k8I65bR3Oj6rp+vR6dr0loluDElxAGEN+0Vu7Yygkgw2/5ga/Qf8A4JzfFb9kSf4ZJ8P/AIAfES5nu5Llrq/03xDqAbUfOKxRsXLBWk+bADnJdtxyxJNfj/8A8Exv+SueIP8AsatI/wDSyWut+An/ACeZcf8AZZb/AP8ATjLXp4mpiatCvgoVZRp0I86i25Q6aKL+F+adv7p+fYPJMtxzoY6pSiq9dJOpGKU9Urcz+3bzs33R+zn7ZWom3/Zh8Z3wuFAttKWdjIcALHLG5zz0wporlP2sv+TCPGX/AGIDf+iVor84zmlGtiYTfWK/Nn2PC054XL6lOL2qS/KJ/9k=',
    diner_r:
      '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',
    inn_r:
      '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',
    cake_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAnACwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z',
  };

  if (!handleTryHitBackToKingdom()) {
    console.log('Failed to handleTryHitBackToKingdom(), skipping findAndTapProductionHouse');
    return false;
  }

  if (config.productionDashboardEnabled && handleProductionDashboard(false)) {
    console.log('Successfully goto production via the dashboard, returning from findAndTapProductionHouse')
    return true;
  }

  for (var key in houses) {
    var houseImage = getImageFromBase64(houses[key]);
    var img = getScreenshot();
    var startX = 69;
    var startY = 40;
    var targetArea = cropImage(img, startX, startY, 500, 250);
    var foundResults = findImages(targetArea, houseImage, 0.9, 3, true);
    releaseImage(img);
    releaseImage(houseImage);
    releaseImage(targetArea);

    if (foundResults.length > 0) {
      foundResults[0].x += startX;
      foundResults[0].y += startY;
      console.log('found house >> ', key, JSON.stringify(foundResults));

      var house = foundResults[0];
      // Need to add offset to images
      for (var i = 0; i < 2; i++) {
        house.x += 18;
        house.y += 18;

        if (house.y > 300) {
          console.log('Skip current trial as location forbidden (y>300): ', house.x, house.y);
          break;
        }

        qTap(house);
        sleep(config.sleepAnimate);

        if (waitUntilSeePages([pageInProduction, pageInMagicLab], 5)) {
          console.log('Found production house successfully: ', key, i);
          return true;
        } else if (checkIsPage(pageStockIsFull)) {
          console.log('Found house but stock is full, send running event and keep doing other tasks, i: ', i);
          sendEvent('running', '');
        } else if (checkIsPage(pageInGacha)) {
          console.log('accidentally get into gacha when searching for houses, leaving');
          qTap(pnt(618, 21));
          break;
        } else if (checkIsPage(pageInHabor)) {
          console.log('pass this point as it is too close to habor');
          return false;
        }

        console.log('Assume found house but cant get into it in 5 secs, go back to kingdom page: ', key, i);
        handleGotoKingdomPage();
      }
    }
  }
  return false;
}

var Directions = Object.freeze({
  NE: pnt(-480, 245),
  NW: pnt(460, 255),
  SE: pnt(-460, -255),
  SW: pnt(480, -245),
  S: pnt(0, -250),
  SS: pnt(0, -350),
  N: pnt(0, 250),
  NN: pnt(0, 350),
  E: pnt(-460, 0),
  EE: pnt(-560, 0),
  W: pnt(460, 0),
  WW: pnt(560, 0),
});
function swipeDirection(direction, finishSwipeWhenInProduction, swippingPage) {
  var tapableArea = {
    fromPnt: pnt(165, 90),
    endPnt: pnt(566, 285),
  };

  if (finishSwipeWhenInProduction && !checkIsPage(pageInKingdomVillage) && waitUntilSeePages([pageInProduction, pageInMagicLab], 5)) {
    console.log('Already in production, skip swipping');
    return true;
  }

  for (var i = 1; i < 2; i++) {
    var x = tapableArea.fromPnt.x + Math.random() * (tapableArea.endPnt.x - tapableArea.fromPnt.x);
    var y = tapableArea.fromPnt.y + Math.random() * (tapableArea.endPnt.y - tapableArea.fromPnt.y);

    var fromPnt = pnt(x, y);
    var toPnt = pnt(x + direction.x, y + direction.y);
    var steps = 8 - i * 2; // reducing steps per moving
    if (finishSwipeWhenInProduction) {
      if (swipeFromToPoint(fromPnt, toPnt, steps, 0, pageInProduction, swippingPage)) {
        console.log('swip successfully, idx:', i);
        return true;
      } else if (checkIsPage(pageInHabor)) {
        console.log('swipeDirection skip to go to head and start over');
        return false;
      } else {
        console.log('pickup house, try again');
      }
    } else {
      if (swipeFromToPoint(fromPnt, toPnt, steps, 0, undefined, swippingPage)) {
        console.log('swip successfully, idx:', i);
        return true;
      } else {
        console.log('pickup house, try again');
      }
    }
  }
  handleGotoKingdomPage();
  return false;
}

function swipeFromToPoint(fromPnt, toPnt, steps, id, stopIfFoundPage, swipingPage) {
  id === undefined ? 0 : id;
  if (swipingPage === undefined) {
    swipingPage = pageInKingdomVillage;
  }

  // tap(fromPnt.x, fromPnt.y, 100, id);
  // sleep(config.sleepAnimate);

  // if (stopIfFoundPage !== undefined && waitUntilSeePage(stopIfFoundPage, 2)) {
  //   console.log('Swiping but accedential got into the desired page, return');
  //   return true;
  // }

  if (checkIsPage(pageInHabor)) {
    console.log('swipeFromToPoint tapped into habor, go to head and start over');
    return false;
  }

  if (!checkIsPage(swipingPage)) {
    console.log('swipe from this point will get to another page, try again: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }

  if (handleUnexpectedMessageBox()) {
    console.log('handleGotoKingdomPage just wait for relogin screen: ', config.sleepWhenDoubleLoginInMinutes);
    return false;
  }

  steps = steps == undefined ? 4 : steps;
  var step_x = (toPnt.x - fromPnt.x) / steps;
  var step_y = (toPnt.y - fromPnt.y) / steps;

  tapDown(fromPnt.x, fromPnt.y, 40, 0, id);
  sleep(10);
  moveTo(fromPnt.x, fromPnt.y, 40, 0, id);
  sleep(10);

  for (var i = 0; i < steps; i++) {
    moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0, id);
    // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
    sleep(50);
  }

  moveTo(toPnt.x, toPnt.y, 40, 0, id);
  sleep(500);
  tapUp(toPnt.x, toPnt.y, 40, 0, id);
  sleep(config.sleepAnimate);

  if (!checkIsPage(swipingPage)) {
    console.log('swipe but page changed, failed x, y: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }
  return true;
}

function handleGotoKingdomPage() {
  console.log('trying to get to kingdom page');

  if (handleUnexpectedMessageBox()) {
    console.log('handleGotoKingdomPage just wait for relogin screen: ', config.sleepWhenDoubleLoginInMinutes);
    return false;
  }

  if (checkIsPage(pageInKingdomVillage)) {
    console.log('already in kingdom');
    return true;
  }

  if (checkIsPage(pageInProduction) || checkIsPage(pageInMagicLab)) {
    console.log('In production, hit back to kingdom page');
    keycode('BACK', 1000);
    waitUntilSeePage(pageInKingdomVillage, 8);
    return true;
  }

  var pageMyKingdomCard = [
    { x: 20, y: 313, r: 24, g: 73, b: 41 },
    { x: 26, y: 14, r: 215, g: 232, b: 232 },
    { x: 200, y: 316, r: 24, g: 73, b: 41 },
    { x: 110, y: 69, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageCanGotoKingdom)) {
    console.log('Can goto kingdom (not in village), going to kingdom and wait 3secs');
    qTap(pageCanGotoKingdom);
    sleep(config.sleepAnimate * 2);

    for (var i = 0; i < 5; i++) {
      tapDown(50, 268, 40, 0);
      sleep(config.sleep);
      moveTo(200, 268, 40, 0);
      sleep(config.sleep);
      moveTo(2000, 268, 40, 0);
      sleep(config.sleep);
      tapUp(2000, 268, 40, 0);
      sleep(config.sleepAnimate * 3);

      if (checkIsPage(pageMyKingdomCard)) {
        qTap(pageMyKingdomCard);
        sleep(config.sleepAnimate);
        // console.log('Found my kingdom at try: ', i)
        if (waitUntilSeePage(pageInKingdomVillage, 10)) {
          return true;
        }
      }
    }
  }

  if (checkIsPage(pageChooseLoginMethod) || checkIsPage(pageChooseLoginMethod2)) {
    console.log('Asked to goto kingdom but found login page, handleInputLoginInfo()');
    handleInputLoginInfo();
  }

  return handleTryHitBackToKingdom();
}

function findHouseInNotSureWhere(tryCount) {
  handleGotoKingdomPage();
  tryCount = tryCount == undefined ? 3 : tryCount;

  for (var i = 0; i < tryCount; i++) {
    handleUnexpectedMessageBox();
    tapRandom(75, 95, 553, 285);
    sleep(config.sleepAnimate * 2);
    if (waitUntilSeePages([pageInProduction, pageInMagicLab])) {
      console.log('found production in try: ', i);
      return true;
    }
    console.log('try another random point for production');
    handleGotoKingdomPage();
  }
  return false;
}

function handleFindAndTapCandyHouse() {
  var directions = [
    Directions.SS,
    Directions.S,
    Directions.EE,
    Directions.N,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.N,
    Directions.W,
    Directions.W,
    Directions.W,
    Directions.W,
  ];
  if (config.searchHouseCount % 3 === 1) {
    console.log('use path 2: ', config.searchHouseCount);
    directions = [
      Directions.EE,
      Directions.SS,
      Directions.E,
      Directions.W,
      Directions.W,
      Directions.W,
      Directions.N,
      Directions.E,
      Directions.W,
      Directions.W,
    ];
  } else if (config.searchHouseCount % 3 === 2) {
    console.log('use path 3: ', config.searchHouseCount);
    directions = [
      Directions.EE,
      Directions.EE,
      Directions.SS,
      Directions.EE,
      Directions.S,
      Directions.W,
      Directions.W,
      Directions.W,
      Directions.N,
    ];
  }

  var timeStartFindHouses = Date.now();
  console.log('handleFindAndTapCandyHouse after:', (Date.now() - timeStartFindHouses) / 1000, 'secs');

  if (!checkIsPage(pageInKingdomVillage)) {
    handleTryResolveGreenChecks();

    if (!handleGotoKingdomPage()) {
      console.log('Cannnot get to kingdom page, skip handleFindAndTapCandyHouse');
      return false;
    }
  }

  config.productionBuildingChecked = 0;

  var needCollectCandy = config.worksBeforeCollectCandy > 0 && (Date.now() - config.lastCollectCandyTime) / 60000 > config.worksBeforeCollectCandy * 0.6;
  if (needCollectCandy) {
    needCollectCandy = !findAndTapCandy();
  }

  config.searchHouseCount++;
  if (config.searchHouseCount < 8) {
    console.log('send running when searchHouseCount:', config.searchHouseCount);
    sendEvent('running', '');
  }

  if (!needCollectCandy && findAndTapProductionHouse()) {
    console.log(
      'Found house using findAndTapProductionHouse, start working after looking for production for',
      (Date.now() - timeStartFindHouses) / 1000,
      'secs (this round)'
    );
    config.lastGotoProduction = Date.now();
    return true;
  }

  // console.log('candy&house is not here, goto castle and search again')
  gotoCastle();

  for (var i = 0; i < directions.length; i++) {
    // TODO: this does not show properly
    console.log('going towards path {0}, step {1}'.format(config.searchHouseCount % 3, i));
    if (swipeDirection(directions[i], true)) {
      if (needCollectCandy) {
        needCollectCandy = !findAndTapCandy();
      }

      if (config.helpTapGreenCheck) {
        var greenChecked = getImageFromBase64(
          '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9KvH/APwUBs78XC6hceILPw/Dff2Zcazb+G9RXw/Dcib7O0UmpiE2oInzC26basqmNtsg21c1zx3Z+GdFvNS1G8t7HT9Pge5urm4lEcNvEilnd2JwqqoJJPAANfEup/EfXPh1ZQ/B/wARtJJoGi6c9r4fgc77DXtJChHYofka5VWxdIRlmfzduyTg8HeOLqPQ7G11rxFHrGi+E7qKXw3obRzT3V3cKwaGTUJX+SeG02gwoSzyyGJpgzW++f8AhXPs+p4vFyniKlRuMU+ao1L2i700l7qb0UW3bdtNSS+Br8eYHDYqrhcW3TcFdX+0v7vm+i6+R7dq3iCb4kRah4i8aX3ibw3YsM+H9AttbvNCbTbILv8A7S1B7aWGY3Uw+ZbWZjFBCE8yMyvIqd9+yN+0H4i+Iv7P+i6xearqUy3U16tldSI1q+pWKXk8dneNGFRQ1xbLDOSqIjGUsqIpCj5U8H6fc/theL5v7VZrr4b6Zds+rTTnevi++R8m2U/8tLWKQZmf7ssimMblSQn6lHiZVGAy/nXlwzbHpc+Iapt25YRVvZxV9JP4pTndSld6WX+GPflOaYjEw+tVvdjL4Y9Uujfmz5/+N2k2fxh8Jvpc0k1jdWsy3em6lCAbjTLtM+XPHnuMkEdGRnU/KxFeFaf8KvH3ibUI9J1aHSdBsZCE1XWNN1BpHuYSDvSziKB4Xk+6Wdj5as2zcQpBRXyFHOa1OPK1GVtVdX5X3Wtvk7q+tj5TMMswmNqwrYumpSpu8W+n+a8ndH0j4X8S2nhHRLPS7Czgs9M0+FLe3t4IxGkEajCqoHGABjFdhavdXkCyRoWjbkHcBmiirwNadaUvaO/U9qjVlLRs/9k='
        );
        var img = getScreenshot();

        var foundResults = findImages(img, greenChecked, 0.92, 5, true);
        if (foundResults.length > 0) {
          console.log('Found green Checked icon at: ', JSON.stringify(foundResults));
        }
        releaseImage(img);
        releaseImage(greenChecked);

        if (foundResults.length > 0) {
          console.log('Fount green checked, tap it');
          qTap(foundResults[0]);
        }
      }

      if (waitUntilSeePages([pageInProduction, pageInMagicLab], 2) && config.searchHouseCount > 3) {
        console.log(
          'found production when swipping, start working, config.searchHouseCount: ',
          config.searchHouseCount,
          'looking for production for',
          (Date.now() - timeStartFindHouses) / 1000,
          'secs (this round)'
        );
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        config.buildTowardsTheLeft = !config.buildTowardsTheLeft;
        sendEvent('running', '');
        return true;
      } else if (!needCollectCandy && findAndTapProductionHouse()) {
        console.log(
          'Found house using findAndTapProductionHouse, start working after looking for production for',
          (Date.now() - timeStartFindHouses) / 1000,
          'secs (this round)'
        );
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        config.buildTowardsTheLeft = !config.buildTowardsTheLeft;
        sendEvent('running', '');
        return true;
      } else if (
        !needCollectCandy &&
        config.searchHouseCount > 3 &&
        config.isXR &&
        findHouseInNotSureWhere(config.findProductionTimes)
      ) {
        console.log(
          'find house in random tap success, start working after looking for production for',
          (Date.now() - timeStartFindHouses) / 1000,
          'secs (this round)'
        );
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        config.buildTowardsTheLeft = !config.buildTowardsTheLeft;
        sendEvent('running', '');
        return true;
      } else if (checkIsPage(pageStockIsFull)) {
        console.log('Found house but stock is full, send running event and keep doing other tasks');
        sendEvent('running', '');
      }
    } else if (checkIsPage(pageInHabor)) {
      console.log('handleFindAndTapCandyHouse end up in habor, break this search and start over from castle');
      gotoCastle();
      return false;
    }
  }
  return false;
}

function handleLoginFailed() {
  if (config.loginRetryCount > config.loginRetryMaxTimes) {
    config.run = false;
    sendEvent('gameStatus', 'login-failed');
    console.log('Max retry count reached, login failed: ', new Date().toLocaleString());
    return false;
  } else {
    console.log('Restart game as not inputing login info correctly: ', config.loginRetryCount);
    config.loginRetryCount++;
    var rtn = execute('am force-stop com.devsisters.ck');
    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop com.devsisters.ck'
      );
    }
    sleep(3000);
    checkAndRestartApp();
    return false;
  }
}

function handleInputLoginInfo() {
  if (handleAnnouncement()) {
    console.log('Found announcement page, handleInputLoginInfo success');
    return true;
  } else if (checkIsPage(pageInKingdomVillage)) {
    console.log('Found pageInKingdomVillage, handleInputLoginInfo success');
    return true;
  } else if (waitUntilSeePages([pageInProduction, pageInMagicLab])) {
    console.log('Found in production, no need to relogin');
    return true;
  }
  var i = 0;

  checkIsFacebookPage();

  if (checkScreenMessage(facebookRefreshTokenExpiredLogout)) {
    console.log('Found facebook refresh token failed, tap logout cancel button');
    qTap(pnt(276, 252));
    sleep(2000);
  }

  var isInputAge = false;
  if (waitUntilSeePage(pageInputAge, 2)) {
    console.log('start input age');
    qTap(pnt(285 + Math.random() * 35, 213));
    sleep(config.sleep);
    qTap(pageInputAge);
    sleep(config.sleep);
    qTap(pageInputAge);
    sleep(config.sleepAnimate * 2);
    isInputAge = true;
  }

  // TOS page will change when login page change
  var pageTermsOfServices = [
    { x: 447, y: 233, r: 66, g: 66, b: 66 },
    { x: 329, y: 126, r: 66, g: 66, b: 66 },
    { x: 452, y: 126, r: 66, g: 66, b: 66 },
    { x: 458, y: 216, r: 66, g: 66, b: 66 },
    { x: 286, y: 216, r: 66, g: 66, b: 66 },
    { x: 179, y: 126, r: 66, g: 66, b: 66 },
  ];
  // Nox: cookie v1.15
  var pageTermsOfServices2 = [
    { x: 447, y: 230, r: 255, g: 255, b: 255 },
    { x: 43, y: 257, r: 96, g: 24, b: 22 },
    { x: 181, y: 257, r: 95, g: 24, b: 22 },
    { x: 31, y: 289, r: 92, g: 67, b: 18 },
    { x: 203, y: 285, r: 90, g: 65, b: 16 },
    { x: 161, y: 329, r: 37, g: 8, b: 13 },
    { x: 246, y: 230, r: 255, g: 255, b: 255 },
    { x: 179, y: 132, r: 255, g: 255, b: 255 },
  ];
  // Memu: cookie v1.16
  var pageTermsOfServicesMemu = [
    { x: 479, y: 238, r: 66, g: 66, b: 66 },
    { x: 482, y: 238, r: 107, g: 158, b: 153 },
    { x: 484, y: 222, r: 66, g: 66, b: 66 },
    { x: 486, y: 110, r: 66, g: 66, b: 66 },
    { x: 148, y: 123, r: 66, g: 66, b: 66 },
    { x: 171, y: 117, r: 255, g: 255, b: 255 },
    { x: 172, y: 205, r: 66, g: 66, b: 66 },
    { x: 229, y: 206, r: 254, g: 254, b: 254 },
  ];
  var pageTermsOfServicesHitBack = [
    { x: 305, y: 218, r: 255, g: 255, b: 255 },
    { x: 320, y: 218, r: 255, g: 255, b: 255 },
    { x: 334, y: 217, r: 254, g: 94, b: 0 },
    { x: 350, y: 163, r: 255, g: 255, b: 255 },
    { x: 356, y: 163, r: 255, g: 255, b: 255 },
    { x: 148, y: 123, r: 26, g: 26, b: 26 },
  ];

  if (checkIsPage(pageTermsOfServices) || checkIsPage(pageTermsOfServices2)) {
    console.log('accept term of service, sleep 5s');
    qTap(pageTermsOfServices);
    sleep(5000);
  } else if (checkIsPage(pageTermsOfServicesHitBack)) {
    console.log('close and accept term of service, sleep 5s');
    qTap(pageTermsOfServicesHitBack);
    sleep(2000);
    qTap(pageTermsOfServicesMemu);
    sleep(3000);
  } else if (checkIsPage(pageTermsOfServicesMemu)) {
    console.log('accept term of service for memu, sleep 5s');
    qTap(pageTermsOfServicesMemu);
    sleep(5000);
  }

  var pageCannotFindLoginInfo = [
    { x: 316, y: 243, r: 82, g: 136, b: 5 },
    { x: 323, y: 242, r: 254, g: 254, b: 254 },
    { x: 332, y: 243, r: 123, g: 207, b: 8 },
    { x: 305, y: 242, r: 123, g: 207, b: 8 },
    { x: 300, y: 242, r: 123, g: 207, b: 8 },
    { x: 343, y: 243, r: 123, g: 207, b: 8 },
    { x: 201, y: 106, r: 57, g: 69, b: 107 },
    { x: 422, y: 95, r: 57, g: 69, b: 107 },
    { x: 438, y: 106, r: 57, g: 69, b: 107 },
    { x: 383, y: 177, r: 215, g: 205, b: 195 },
    { x: 377, y: 178, r: 231, g: 220, b: 209 },
    { x: 371, y: 178, r: 231, g: 220, b: 209 },
    { x: 243, y: 180, r: 80, g: 80, b: 80 },
  ];
  if (checkIsPage(pageCannotFindLoginInfo)) {
    console.log("quit can't find login info page");
    keycode('BACK', 1000);
    sleep(config.sleepAnimate);
  }

  // v1.15
  var pageCanDownloadResources = [
    { x: 346, y: 240, r: 121, g: 207, b: 12 },
    { x: 420, y: 237, r: 219, g: 207, b: 199 },
    { x: 418, y: 172, r: 243, g: 233, b: 223 },
    { x: 412, y: 103, r: 60, g: 70, b: 105 },
    { x: 219, y: 98, r: 60, g: 70, b: 105 },
    { x: 221, y: 250, r: 219, g: 207, b: 199 },
  ];
  if (checkIsPage(pageCanDownloadResources)) {
    console.log('start download resources, wait 10 secs');
    qTap(pageCanDownloadResources);
    sleep(10000);

    for (i = 0; i < 18; i++) {
      // wait for yellow bar (download progress bar) disapper
      if (!checkIsPage([{ x: 16, y: 349, r: 255, g: 210, b: 76 }])) {
        console.log('download finished');
        break;
      }
      console.log('wait for download: ', i);
      sleep(3000);
    }
  }

  // v2.0.1
  var pageDownloadDataAndVoiceOver = [
    { x: 207, y: 192, r: 39, g: 204, b: 0 },
    { x: 372, y: 216, r: 12, g: 167, b: 223 },
    { x: 445, y: 218, r: 12, g: 167, b: 223 },
    { x: 430, y: 81, r: 60, g: 70, b: 105 },
    { x: 214, y: 195, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageDownloadDataAndVoiceOver)) {
    qTap(pageDownloadDataAndVoiceOver);
    sleep(config.sleepAnimate);
    qTap(pnt(320, 268));
    console.log('start download resources, wait 10 secs');
    sleep(10000);

    for (i = 0; i < 18; i++) {
      // wait for yellow bar (download progress bar) disapper
      if (!checkIsPage([{ x: 16, y: 349, r: 255, g: 210, b: 76 }])) {
        console.log('download finished');
        break;
      }
      console.log('wait for download: ', i);
      sleep(3000);
    }
  }

  // v2.0.1 has 'New data pak is available'
  var pageDownloadNewDataPakIsAvailable = [
    { x: 368, y: 254, r: 123, g: 207, b: 8 },
    { x: 441, y: 99, r: 57, g: 69, b: 107 },
    { x: 346, y: 251, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageDownloadNewDataPakIsAvailable)) {
    qTap(pageDownloadNewDataPakIsAvailable);
    sleep(config.sleepAnimate);
    console.log('start download new data pak, wait 10 secs');
    sleep(10000);

    for (i = 0; i < 18; i++) {
      // wait for yellow bar (download progress bar) disapper
      if (!checkIsPage([{ x: 16, y: 349, r: 255, g: 210, b: 76 }])) {
        console.log('download finished');
        break;
      }
      console.log('wait for download: ', i);
      sleep(3000);
    }
  }

  var findLoginTime = isInputAge ? 5 : 2;
  var isChooseLogin = false;
  for (i = 0; i < findLoginTime; i++) {
    if (checkIsPage(pageChooseLoginMethod)) {
      console.log('choose to login via email');
      isChooseLogin = true;
      qTap(pageChooseLoginMethod);
      sleep(config.sleepAnimate);
      break;
    } else if (checkIsPage(pageChooseLoginMethod2)) {
      console.log('choose to login via email 2');
      isChooseLogin = true;
      qTap(pageChooseLoginMethod2);
      sleep(config.sleepAnimate);
      break;
    } else {
      console.log('waiting for pageChooseLoginMethod: ', i);
      sleep(3000);
    }
  }

  if (!isChooseLogin) {
    if (!waitUntilSeePages([pageInKingdomVillage, pageInProduction, pageInMagicLab])) {
      console.log('handleInputLoginInfo not sure what to do, tap(575, 22) announce page');
      qTap(pnt(575, 22));

      if (handleAnnouncement()) {
        console.log('handleLogin handle accouncement success, login success');
        return true;
      }
      if (checkIsPage(pageInFountain)) {
        console.log('handleLogin found myself in fountain, login success');
        return true;
      }
    }
  }

  var inputEmail = false;
  var findEmailTimes = isChooseLogin ? 5 : 2;
  var pageEnterEmail = [
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 320, y: 53, r: 223, g: 223, b: 223 },
    { x: 322, y: 99, r: 245, g: 245, b: 245 },
    { x: 357, y: 97, r: 70, g: 70, b: 70 },
    { x: 362, y: 98, r: 255, g: 255, b: 255 },
    { x: 368, y: 98, r: 255, g: 255, b: 255 },
    { x: 391, y: 124, r: 255, g: 255, b: 255 },
  ];
  for (i = 0; i < findEmailTimes; i++) {
    if (checkIsPage(pageEnterEmail)) {
      console.log('inputing user email ', config.account);
      inputEmail = true;
      qTap(pnt(370, 150)); // input field
      sleep(config.sleepAnimate);
      typing(config.account, 1000);
      sleep(4000); // sleep must equal to typing
      typing('\n', 500);
      sleep(500);
      break;
    } else {
      console.log('cannot find input email field, i: ', i);
      sleep(2000);
    }
  }

  var incorrectEmailFormat = {
    x: 222,
    y: 166,
    width: 172,
    height: 12,
    targetY: 6,
    lookingForColor: { r: 226, g: 86, b: 86 },
    targetColorCount: 22,
    targetColorThreashold: 3,
  };
  if (checkScreenMessage(incorrectEmailFormat, pageEnterEmail)) {
    console.log('Incorrect email format, return and try again');
    keycode('BACK', 1000);
    sleep(config.sleepAnimate);
    return false;
  }

  var needRegisterDevPlayAccount = {
    x: 222,
    y: 166,
    width: 172,
    height: 12,
    targetY: 6,
    lookingForColor: { r: 226, g: 86, b: 86 },
    targetColorCount: 34,
    targetColorThreashold: 3,
  };
  if (checkScreenMessage(needRegisterDevPlayAccount, pageEnterEmail)) {
    console.log('DevPlay report user registered via social media account, but need DevPlay account');
    config.run = false;
    sendEvent('gameStatus', 'login-failed');
    return false;
  }

  var registerWithSocialPlatformMessageScreen = {
    x: 225,
    y: 162,
    width: 75,
    height: 13,
    targetY: 8,
    lookingForColor: { r: 244, g: 191, b: 191 },
    targetColorCount: 21,
    targetColorThreashold: 3,
  };
  if (checkScreenMessage(registerWithSocialPlatformMessageScreen, pageEnterEmail)) {
    console.log('DevPlay report user registered via social media account, "Please use it to sign in"');
    config.run = false;
    sendEvent('gameStatus', 'login-failed');
    return false;
  }

  var checkPasswordTimes = inputEmail ? 15 : 3;
  var pageEnterpassword = [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 390, y: 189, r: 200, g: 200, b: 200 },
    { x: 314, y: 190, r: 200, g: 200, b: 200 },
    { x: 309, y: 189, r: 200, g: 200, b: 200 },
    { x: 301, y: 115, r: 255, g: 255, b: 255 },
    { x: 387, y: 53, r: 60, g: 60, b: 60 },
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 322, y: 52, r: 60, g: 60, b: 60 },
  ];
  var pageEnterPasswordLongId = [
    { x: 370, y: 161, r: 255, g: 255, b: 255 },
    { x: 391, y: 196, r: 200, g: 200, b: 200 },
    { x: 378, y: 56, r: 60, g: 60, b: 60 },
  ];

  // Check if wrong password set. Any red string in this area means wrong password
  var pageEnteredPassword = [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 301, y: 115, r: 255, g: 255, b: 255 },
    { x: 387, y: 53, r: 60, g: 60, b: 60 },
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 322, y: 52, r: 60, g: 60, b: 60 },
  ];
  var wrongPasswordMessageScreen = {
    x: 225,
    y: 162,
    width: 75,
    height: 13,
    targetY: 6,
    lookingForColor: { r: 244, g: 191, b: 191 },
    targetColorCount: 25,
    targetColorThreashold: 2,
  };
  var passwordTooShortMessageScreen = {
    x: 225,
    y: 162,
    width: 75,
    height: 13,
    targetY: 4,
    lookingForColor: { r: 244, g: 191, b: 191 },
    targetColorCount: 2,
    targetColorThreashold: 0,
  };

  var pageEnterTwoPasswords = [
    { x: 243, y: 307, r: 255, g: 255, b: 255 },
    { x: 377, y: 229, r: 200, g: 200, b: 200 },
    { x: 367, y: 176, r: 255, g: 255, b: 255 },
    { x: 371, y: 50, r: 60, g: 60, b: 60 },
    { x: 319, y: 53, r: 230, g: 230, b: 230 },
    { x: 404, y: 184, r: 187, g: 187, b: 188 },
  ];
  for (i = 0; i < checkPasswordTimes; i++) {
    if (checkIsPage(pageEnterTwoPasswords)) {
      config.run = false;
      sendEvent('gameStatus', 'login-failed');
      console.log('This account id does not exist');
      return false;
    }

    if (!checkIsPage(pageEnterpassword) && !checkIsPage(pageEnterPasswordLongId)) {
      console.log('waiting for input password field');
      sleep(2000);
      continue;
    }

    if (checkIsPage(pageEnterpassword)) {
      console.log('input user pageEnterpassword');
      qTap(pageEnterpassword);
    } else if (checkIsPage(pageEnterPasswordLongId)) {
      console.log('input user pageEnterPasswordLongId');
      qTap(pageEnterPasswordLongId);
    }
    sleep(config.sleepAnimate);
    typing(config.password, 1000);
    sleep(1000); // sleep must equal to typing
    typing('\n', 500);
    sleep(500);
    qTap(pnt(370, 190)); // Login button

    for (var t = 0; t < 6; t++) {
      if (checkScreenMessage(passwordTooShortMessageScreen, pageEnteredPassword)) {
        console.log('DevPlay report password too short');
        return handleLoginFailed();
      }
      if (checkScreenMessage(wrongPasswordMessageScreen, pageEnteredPassword)) {
        console.log('DevPlay report wrong password');
        return handleLoginFailed();
      }
      sleep(1000);
    }

    if (checkIsPage(pageEnterpassword)) {
      console.log(
        'still in password page, either password too short, wrong password, or it is a new id that devPlay ask to input password twice'
      );
      return handleLoginFailed();
    }
    if (checkIsPage(pageChooseLoginMethod) || checkIsPage(pageChooseLoginMethod2)) {
      console.log(
        'still in LOGIN page, either password too short, wrong password, or it is a new id that devPlay ask to input password twice'
      );
      return handleLoginFailed();
    }

    sendEvent('gameStatus', 'login-succeeded');
    console.log('Send login-succeeded');

    // Touch here to start:
    console.log('successfully input password, tap announcement icon for 10s');
    for (i = 0; i < 100; i++) {
      if (checkIsPage(pageAnnouncement) || checkIsPage(pageInKingdomVillage)) {
        console.log('found announcement page, return from handleInputLoginInfo');
        return true;
      }

      if (checkScreenMessage(messageNotifyQuit)) {
        console.log('found unexpected quit window, closing it');
        keycode('BACK', 1000);
        sleep(config.sleepAnimate);
      }

      checkIsFacebookPage();

      if (checkScreenMessage(facebookRefreshTokenExpiredLogout)) {
        console.log('Found facebook refresh token failed, tap logout cancel button');
        qTap(pnt(276, 252));
        sleep(2000);
      }

      qTap(pnt(575, 22));
      sleep(3000);
      console.log('tapping (575, 22) until the game start: ', i, '/100');
    }
    return true;
  }

  var pageServerSelection = [
    { x: 380, y: 236, r: 60, g: 70, b: 105 },
    { x: 348, y: 239, r: 121, g: 207, b: 12 },
    { x: 308, y: 243, r: 255, g: 255, b: 255 },
    { x: 447, y: 149, r: 60, g: 70, b: 105 },
    { x: 388, y: 104, r: 44, g: 46, b: 60 },
    { x: 326, y: 75, r: 101, g: 137, b: 231 },
    { x: 318, y: 106, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageServerSelection)) {
    console.log('Found server selection screen, seems like a new devPlayAccount');
    return handleLoginFailed();
  }

  // sendEvent("gameStatus", "login-failed")
  console.log('cannot find input email field');
  return false;
}

function handleNextProductionBuilding() {
  if (checkIsPage(pageInProduction) || checkIsPage(pageInMagicLab)) {
    if (config.buildTowardsTheLeft) {
      qTap(pnt(110, 174)); // to left
    } else {
      qTap(pnt(349, 174)); // to right
    }
    config.productionBuildingChecked++;
    console.log('productionBuildingChecked: ', config.productionBuildingChecked);
    sleep(config.sleepAnimate * 2);
  }
}

function handleSkipProductionDashboardIntro() {
  var pageGnomeLabProdBoardIntro = [
    {x: 281, y: 114, r: 170, g: 15, b: 35},
    {x: 217, y: 21, r: 82, g: 17, b: 30},
    {x: 311, y: 16, r: 86, g: 64, b: 2},
    {x: 424, y: 19, r: 0, g: 45, b: 86},
  ]

  if (!checkIsPage(pageGnomeLabProdBoardIntro)) {
    return false;
  }

  console.log('About to handle pageGnomeLabProdBoardIntro')

  // Tap to enter the lab
  qTap(pnt(300, 200));
  sleep(2000);

  if (waitUntilSeePage(pageInGnomeLab, 20, pnt(13, 13), undefined, 1)) {
    console.log('Success skip gnome lab production dashboard intro')
  }
  return true;
}

function handleSkipProductionDashboardIsDone() {
  var pageProductionDashboardIsDone = [
    {x: 25, y: 222, r: 227, g: 163, b: 81},
    {x: 37, y: 220, r: 75, g: 83, b: 115},
    {x: 212, y: 170, r: 255, g: 243, b: 239},
  ];
  var pageProductionDashboardIntroducing = [
    {x: 607, y: 26, r: 3, g: 6, b: 8},
    {x: 19, y: 9, r: 100, g: 88, b: 25},
    {x: 26, y: 25, r: 102, g: 70, b: 42},
    {x: 30, y: 12, r: 99, g: 8, b: 16},
  ]
  var pageInProductionDashboard = [
    {x: 619, y: 340, r: 123, g: 207, b: 8},
    {x: 19, y: 14, r: 253, g: 206, b: 74},
    {x: 31, y: 13, r: 198, g: 36, b: 41},
    {x: 28, y: 26, r: 239, g: 207, b: 139},
    {x: 619, y: 19, r: 255, g: 255, b: 255},
  ]

  if (!checkIsPage(pageProductionDashboardIsDone)) {
    return false;
  }

  console.log('About to handle pageProductionDashboardIsDone');
  // Tap production dashboard icon
  qTap(pnt(27, 226));

  if (!waitUntilSeePage(pageProductionDashboardIntroducing, 7)) {
    return false;
  }
  // Tap skip
  qTap(pageProductionDashboardIntroducing);

  if (!waitUntilSeePage(pageProductionDashboardIntroducing, 7)) {
    return false;
  }

  if (waitUntilSeePage(pageInProductionDashboard)) {
    console.log('Succssfully resolved production dashboard intro');
    return true;
  }

  return false;
}

function handleSkipKingdomStory() {
  var pageInKingdomStoryMission = [
    {x: 562, y: 85, r: 47, g: 116, b: 156},
    {x: 498, y: 104, r: 181, g: 48, b: 33},
    {x: 543, y: 107, r: 48, g: 67, b: 106},
    {x: 584, y: 19, r: 67, g: 53, b: 22},
  ]

  if (!checkIsPage(pageInKingdomStoryMission)) {
    return false;
  }

  console.log('Resolving handleSkipKingdomStory');
  qTap(pageInKingdomStoryMission);
  return waitUntilSeePage(pageInKingdomVillage);
}

function handleSkipHallOfHeros() {
  var pageHallIntro = [
    { x: 365, y: 138, r: 177, g: 196, b: 209 },
    { x: 285, y: 110, r: 90, g: 209, b: 225 },
    { x: 277, y: 150, r: 74, g: 182, b: 82 },
  ];
  var pageSpeedUpSlot = [
    { x: 456, y: 41, r: 255, g: 255, b: 255 },
    { x: 318, y: 35, r: 96, g: 144, b: 194 },
    { x: 312, y: 50, r: 202, g: 146, b: 89 },
    { x: 255, y: 50, r: 57, g: 69, b: 107 },
  ];

  if (checkIsPage(pageHallIntro)) {
    for (var i = 0; i < 15; i++) {
      qTap(pageHallIntro);
      sleep(1000);

      if (checkIsPage(pageSpeedUpSlot)) {
        qTap(pnt(64, 241));
        sleep(2000);
      }
    }
    qTap(pnt(64, 241));
    sleep(2000);
    keycode('BACK', 1000);
  }
}

function handleSkipTreasureIntro() {
  var pageTreasureIntro = new RF.Page(
    'pageTreasureIntro',
    [
      {x: 607, y: 266, r: 117, g: 106, b: 215},
      {x: 606, y: 266, r: 117, g: 106, b: 215},
      {x: 445, y: 230, r: 255, g: 243, b: 239},
      {x: 622, y: 198, r: 253, g: 196, b: 113},
      {x: 339, y: 19, r: 47, g: 38, b: 66},
      {x: 329, y: 15, r: 67, g: 65, b: 67},
    ],
    {x: 607, y: 266 }
  );
  var pageTreasureIntro2 = new RF.Page(
    'pageTreasureIntro2',
    [
      {x: 603, y: 266, r: 115, g: 105, b: 214},
      {x: 493, y: 208, r: 255, g: 243, b: 239},
      {x: 337, y: 19, r: 52, g: 35, b: 83},
      {x: 523, y: 21, r: 1, g: 48, b: 86},
    ],
    {x: 603, y: 266 }
  );

  var groupPageTreasureIntro = new RF.GroupPage('groupPageTreasureIntro', [pageTreasureIntro, pageTreasureIntro2]);
  var matchedPages = groupPageTreasureIntro.isMatchScreen(this.screen);
  if (matchedPages.length === 0) {
    return true;
  }

  console.log('handleSkipTreasureIntro matchedPages: ', matchedPages)
  if (matchedPages.indexOf('pageTreasureIntro') !== -1 || matchedPages.indexOf('pageTreasureIntro2') !== -1) {
    pageTreasureIntro.goNext(this.screen);
    sleep(2000);
    pageTreasureIntro.goNext(this.screen);
    sleep(2000);
    pageTreasureIntro.goNext(this.screen);
    sleep(1000);
    pageTreasureIntro.goNext(this.screen);
    sleep(1000);
    return handleTryHitBackToKingdom();
  }
}

function handleTryHitBackToKingdom() {
  if (checkIsPage(pageInLoginPageWithGearAndVideo)) {
    console.log('In login page (found gear and video icon), skipping handleTryHitBackToSpecificPage');
    return false;
  }

  if (handleTryHitBackToSpecificPages([pageInKingdomVillage])) {
    return true;
  }

  console.log(
    'Found quit notification but not kingdom page, should be in login, tap announcement icon and sleep 3s'
  );
  qTap(pnt(585, 20));
  sleep(3000);
  return false;
}

function handleTryHitBackToSpecificPages(targetPages) {
  if (waitUntilSeePages(targetPages, 2)) {
    return true;
  }

  console.log('trying to go to specific page by hitting back');

  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }

  // New features intro that needs to be by pass
  handleSkipHallOfHeros();
  handleSkipProductionDashboardIntro();
  handleSkipProductionDashboardIsDone()
  handleSkipKingdomStory()
  handleSkipTreasureIntro()

  var pageNotifyQuitWindow = [
    { x: 374, y: 98, r: 57, g: 69, b: 107 },
    { x: 301, y: 250, r: 8, g: 166, b: 222 },
    { x: 404, y: 250, r: 123, g: 207, b: 8 },
    { x: 425, y: 250, r: 222, g: 207, b: 198 },
  ];
  var pageBattlePaused = [
    {x: 307, y: 200, r: 253, g: 253, b: 251},
    {x: 621, y: 26, r: 56, g: 165, b: 227},
    {x: 613, y: 23, r: 35, g: 85, b: 114},
    {x: 278, y: 160, r: 12, g: 165, b: 219},
    {x: 288, y: 157, r: 241, g: 241, b: 239},
    {x: 293, y: 201, r: 241, g: 90, b: 28},
  ]

  for (var i = 0; i < 4; i++) {
    keycode('BACK', 2000);

    if (waitUntilSeePages(targetPages, 4)) {
      console.log('No quit windows for 4 secs, and found targetPage successfully');
      return true;
    }

    if (checkIsPage(pageNotifyQuitWindow)) {
      if (checkScreenMessage(messageNotifyQuit)) {
        console.log('Found quit notification, should be in kingdom or login page');
        keycode('BACK', 1000);
        return false;
      }
    }
    if (checkIsPage(pageBattlePaused)) {
      console.log('Need to go back to kingdom but found in battle, tap exit and sleep 2s');
      qTap(pageBattlePaused);
      sleep(2000);
    }

    checkAndRestartApp();
    handleCheckIfAtLoginScreen();
  }
  return false;
}

function getCurrentApp() {
  var result = execute('dumpsys activity top');
  var lines = result.split('\n');
  var app = '';
  var activity = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var p = line.indexOf('ACTIVITY');
    if (p !== -1) {
      app = '';
      activity = '';
      var isApp = true;
      for (var j = p + 9; j < line.length; j++) {
        var c = line[j];
        if (c === ' ') {
        } else if (c === '/') {
          isApp = false;
        } else if (isApp) {
          app += c;
        } else {
          activity += c;
        }
      }
      break;
    }
  }
  // console.log('Current app: ', app, activity);
  return [app, activity];
}

function handleAutoCollectMail() {
  console.log('About to collect mails');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
  }

  var pageHasUnreadMails = [
    { x: 555, y: 9, r: 255, g: 0, b: 0 },
    { x: 551, y: 17, r: 255, g: 239, b: 214 },
  ];

  if (!checkIsPage(pageHasUnreadMails)) {
    console.log('No need to collect any mails, skipping');
    return;
  }

  qTap(pageHasUnreadMails);
  sleep(config.sleepAnimate * 2);

  var pageGreenClaimAllButton = [
    { x: 506, y: 323, r: 121, g: 207, b: 12 },
    { x: 590, y: 318, r: 121, g: 207, b: 12 },
    { x: 572, y: 24, r: 60, g: 70, b: 105 },
    { x: 419, y: 318, r: 54, g: 62, b: 95 },
  ];

  if (!checkIsPage(pageGreenClaimAllButton)) {
    console.log('Cannot find pageGreenClaimAllButton, skipping');
    return;
  }

  console.log('found unread mail and claim all');
  sendEvent('running', '');
  qTap(pageGreenClaimAllButton);
  sleep(config.sleep);

  handleGotoKingdomPage();

  console.log('completed: handleAutoCollectMail');
}

function gotoCastle() {
  console.log('about to gotoCastle');
  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('hit back to kingdom');
    handleGotoKingdomPage();
  }

  var pageInCastleMission = [
    { x: 405, y: 20, r: 255, g: 215, b: 8 },
    { x: 527, y: 15, r: 0, g: 195, b: 255 },
    { x: 535, y: 54, r: 90, g: 52, b: 49 },
  ];
  var pageInCastleUpgrading = [
    { x: 275, y: 112, r: 98, g: 115, b: 136 },
    { x: 271, y: 114, r: 255, g: 255, b: 255 },
    { x: 210, y: 188, r: 240, g: 230, b: 224 },
    { x: 205, y: 193, r: 127, g: 150, b: 194 },
  ];
  var pageFistItemIsCastle = [
    {x: 275, y: 228, r: 57, g: 77, b: 123},
    {x: 255, y: 151, r: 245, g: 160, b: 161},
    {x: 252, y: 159, r: 239, g: 190, b: 115},
  ];

  if (checkScreenMessage(messageNotifyQuit)) {
    // todo: debug log
    console.log('seems like im in notify quit page');
  }
  // Tap head
  if (!waitUntilSeePage(pageInCookieHead, 12, pnt(20, 30), null, 4)) {
    console.log('Failed to get to cookie head in', 12, 'secs, skipping');

    handleGotoKingdomPage();
    return false;
  }

  console.log('gotoCastle: in cookie head');

  // Swipe to the 1st of the list in head and tap Go Now
  for (var i = 0; i < 5; i++) {
    if (checkIsPage(pageFistItemIsCastle)) {
      break;
    }
    tapDown(0, 186, 40, 0);
    sleep(config.sleep);
    moveTo(0, 186, 40, 0);
    sleep(config.sleep);
    moveTo(200, 186, 40, 0);
    sleep(config.sleep);
    moveTo(400, 186, 40, 0);
    sleep(config.sleep);
    moveTo(560, 186, 40, 0);
    sleep(config.sleep);
    tapUp(560, 186, 40, 0);
    sleep(config.sleepAnimate * 2);
    console.log('Cant find castle in cookie head, retry:', i);
  }

  // Back to village and find castle missions page
  if (
    !waitUntilSeePages([pageInCastleMission, pageInCastleUpgrading, pageInKingdomVillage], 12, pageFistItemIsCastle, null, 3)
  ) {
    console.log('Failed to leave to cookie head in', 12, 'secs, skipping');

    handleGotoKingdomPage();
    return false;
  }

  console.log('get to castle successfully');
  handleTryHitBackToKingdom();
}

function handleInFountain() {
  if (waitUntilSeePage(pageInFountain, 8)) {
    console.log('handleInFountain and in fountain, send running');
    sendEvent('running', '');

    qTap(pageInFountain);
    sleep(config.sleepAnimate * 2);
    qTap(pageInFountain);
    sleep(3000);

    if (checkIsPage(pageStockIsFull)) {
      console.log('Fountain stock is full, tap to close dialog');
    }

    handleGotoKingdomPage();

    waitUntilSeePage(pageInKingdomVillage, 8, pnt(1, 1));
    console.log('Was in fountain, tappped and now in kingdom, collect fountain successfully');
    config.lastCollectFountain = Date.now();
  } else {
    handleGotoKingdomPage();
    console.log('Failed to claim fountain, did not see fountain screen');
  }
}

function handleFindAndTapFountain() {
  console.log('about to claim fountain');
  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('hit back to kingdom');
    handleGotoKingdomPage();
  }

  gotoCastle();

  var checked = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9hPE37f8A8O/CHiC8tb++1+HT9PvW02915PDGpyeHbG5Sf7PJHLqawG0QRyh45ZDKEheKRJWjZSo9Q8SePtP8HeHb7WNWv7LTdK0u2kvb28uZVihtYI1LvLI7HaiKoLEk4AB5xX5T/HWTXvgH41f4UeI/PuvDUkN3d+FJ5GMlrrWns7PPGynI+1QCQLOODICs2AHZRneEfjHq03wt0nwdrniM6x4T8G3Uc3hrQTFLLcXUyuHtUv5mylxa2LIGgiO5pJDB5gP2VWn/ABXH+MFLL8ZisFmWHdOVJXh15/S3c+GxXHGDwmLqYTGXhKKur/a9P0Po/wCKvxz1D446rfeJvE2r+LvCvh+NGXw34e07xHqPhxrSyHznU9TktJref7TOAGS1lcpbwBd6CaSUJ9BfsA/G3xF8Zv2TvDPiXxBcXGoXWpTah9jv7u0NtNqmnJf3Men3jIERcz2aW825URX83cqhWAr4b/Zr+DGoftz+OX1HxFG1x8JNFvnbU2ust/wm+oI+TaLkgyWcEykzucpNKhiG5UlNfoc3i3yjt27cdlPAro8Of9Yce6ud53U5VWS9nSS0hG903fW7/I9fJcVisXB4qouWMvhXW3dnz3+0n8N9D/aQ+HN14Z123kjWOZbvTtRt8LeaPex58m7t3xlJUO4Z5DKzowZHZW+OdD/YC+KHiXxmml+I77wrpnhuaby9U1nRr2Y3l/bYO9ba3eIC2llxtZjI4iWRvLLFVIKK+tzzhfLcxxFPEYykpypvRv8AJ915M0zjhnLMwr062LpKUoPS/wDWp93eD9QsPAXhjT9F0fT7bS9H0q2S2s7W2iWOK2gRQqIijooXGBXXWjT6hbrNGuUfp8y9uO4zRRX0tH4D6KlFQfKuh//Z'
  );
  var img = getScreenshot();

  var foundResults = findImages(img, checked, 0.92, 5, true);
  console.log('Found checked icon at: ', JSON.stringify(foundResults));
  releaseImage(img);
  releaseImage(checked);

  if (foundResults.length > 0) {
    console.log('Fount fountain full check icon, tap it');
    qTap(pnt(foundResults[0].x + 10, foundResults[0].y + 10));
  } else {
    console.log("Can't find fountain full image, try to tap it");
    qTap(pnt(490, 359));
    sleep(config.sleepAnimate);

    qTap(pnt(499, 295));
    sleep(config.sleepAnimate);
    qTap(pnt(540, 295));
    sleep(config.sleepAnimate);
  }

  // Tap Fountain
  handleInFountain();

  return true;
}

function handleTrainStation() {
  if (!waitUntilSeePage(pageInTrainStation, 5)) {
    console.log('Wait but not find train station, skipping');
    return false;
  }

  console.log('About to handleTrainStation, send running');
  sendEvent('running', '');

  var pageAllTrainsAreOut = [
    { x: 431, y: 96, r: 114, g: 223, b: 0 },
    { x: 431, y: 199, r: 114, g: 224, b: 0 },
    { x: 431, y: 301, r: 125, g: 227, b: 0 },
    { x: 185, y: 95, r: 227, g: 143, b: 85 },
    { x: 188, y: 201, r: 227, g: 139, b: 85 },
    { x: 188, y: 303, r: 229, g: 143, b: 87 },
  ];
  if (checkIsPage(pageAllTrainsAreOut)) {
    console.log('all trains are out, skipping this check');
    return true;
  }

  var pageFirstTrainOut = [
    { x: 430, y: 95, r: 121, g: 227, b: 0 },
    { x: 454, y: 94, r: 231, g: 142, b: 83 },
  ];
  var pageSecondTrainOut = [
    { x: 430, y: 198, r: 129, g: 227, b: 0 },
    { x: 453, y: 199, r: 229, g: 148, b: 85 },
  ];
  var pageThirdTrainOut = [
    { x: 430, y: 302, r: 121, g: 227, b: 0 },
    { x: 455, y: 301, r: 231, g: 138, b: 82 },
  ];

  if (!checkIsPage(pageFirstTrainOut)) {
    qTap(pnt(255, 110));
    sleep(config.sleepAnimate);
    qTap(pnt(210, 110));
    sleep(config.sleepAnimate);
    qTap(pnt(170, 110));
    if (waitUntilSeePage(pageTrainNotEnoughGoods, 4) || isMessageWindowWithDiamond()) {
      console.log('not enough goods in train 1');
      qTap(pageTrainNotEnoughGoods);
      sleep(config.sleepAnimate);
    }
  }

  if (!checkIsPage(pageSecondTrainOut)) {
    qTap(pnt(255, 208));
    sleep(config.sleepAnimate);
    qTap(pnt(210, 208));
    sleep(config.sleepAnimate);
    qTap(pnt(170, 208));
    if (waitUntilSeePage(pageTrainNotEnoughGoods, 4) || isMessageWindowWithDiamond()) {
      console.log('not enough goods in train 2');
      qTap(pageTrainNotEnoughGoods);
      sleep(config.sleepAnimate);
    }
  }

  if (!checkIsPage(pageThirdTrainOut)) {
    qTap(pnt(255, 307));
    sleep(config.sleepAnimate);
    qTap(pnt(210, 307));
    sleep(config.sleepAnimate);
    qTap(pnt(170, 303));
    if (waitUntilSeePage(pageTrainNotEnoughGoods, 4) || isMessageWindowWithDiamond()) {
      console.log('not enough goods in train 3');
      qTap(pageTrainNotEnoughGoods);
      sleep(config.sleepAnimate);
    }
  }

  if (config.autoCollectTrainIntervalInMins == 0) {
    console.log('handleTrainStation skipped as autoCollectTrainIntervalInMins is set to 0');
    return;
  }
  sleep(9000);

  var imageSendAll = getImageFromBase64(
    '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'
  );
  var img = getScreenshot();

  var foundResults = findImages(img, imageSendAll, 0.92, 5, true);
  console.log('Found send trains at: ', JSON.stringify(foundResults));
  releaseImage(img);
  releaseImage(imageSendAll);

  for (var i in foundResults) {
    var sendTrainBtn = foundResults[i];
    sendTrainBtn.x += 30;
    sendTrainBtn.y += 20;
    qTap(foundResults[i]);
    sleep(config.sleepAnimate);
  }

  qTap(pageInTrainStation);
  sleep(config.sleepAnimate);
  console.log('Tried to sent ', foundResults.length, 'trains');
  return true;
}

function handleTrain() {
  console.log('try to handle train');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
  }

  var pageTrainNotCollapsed = [
    { x: 159, y: 325, r: 255, g: 224, b: 139 },
    { x: 144, y: 325, r: 81, g: 47, b: 37 },
    { x: 96, y: 329, r: 134, g: 183, b: 249 },
    { x: 56, y: 340, r: 48, g: 76, b: 109 },
    { x: 26, y: 321, r: 252, g: 252, b: 252 },
  ];
  var pageTrainCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
    { x: 26, y: 322, r: 255, g: 255, b: 255 },
    { x: 22, y: 329, r: 82, g: 26, b: 11 },
    { x: 28, y: 273, r: 255, g: 247, b: 206 },
  ];
  var pageTrainUncollapsed = [
    { x: 110, y: 251, r: 238, g: 109, b: 98 },
    { x: 103, y: 244, r: 114, g: 22, b: 29 },
    { x: 84, y: 258, r: 49, g: 85, b: 132 },
    { x: 99, y: 247, r: 228, g: 176, b: 110 },
  ];
  if (checkIsPage(pageTrainNotCollapsed)) {
    qTap(pageTrainNotCollapsed);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  } else if (checkIsPage(pageTrainUncollapsed)) {
    qTap(pageTrainUncollapsed);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  } else if (checkIsPage(pageTrainCollapsed)) {
    qTap(pageTrainCollapsed);
    sleep(config.sleepAnimate);

    var pageTrainArrived = [
      { x: 114, y: 255, r: 245, g: 215, b: 130 },
      { x: 117, y: 242, r: 206, g: 57, b: 55 },
      { x: 110, y: 245, r: 49, g: 89, b: 132 },
    ];

    if (checkIsPage(pageTrainArrived)) {
      qTap(pnt(105, 252));
      sleep(config.sleepAnimate * 2);

      handleTrainStation();
    }
  }
  console.log('Finish handleTrain');
  qTap(pnt(614, 20));
  sleep(2000);
  handleGotoKingdomPage();
}

function handleGetDailyRewards() {
  handleGotoKingdomPage();

  var pageKingdomPassAds = [
    { x: 349, y: 286, r: 123, g: 207, b: 8 },
    { x: 250, y: 15, r: 42, g: 8, b: 15 },
    { x: 323, y: 18, r: 45, g: 33, b: 1 },
    { x: 427, y: 19, r: 0, g: 23, b: 45 },
  ];
  var pageInKingdomPass = [
    { x: 528, y: 340, r: 123, g: 207, b: 16 },
    { x: 471, y: 68, r: 247, g: 158, b: 0 },
    { x: 491, y: 73, r: 181, g: 117, b: 24 },
  ];
  var kingdomPassItemCollected = [
    { x: 528, y: 338, r: 161, g: 161, b: 161 },
    { x: 501, y: 344, r: 49, g: 32, b: 24 },
    { x: 630, y: 71, r: 181, g: 117, b: 24 },
  ];
  // Collect Kingdom Pass Rewards
  qTap(pnt(600, 85));
  if (waitUntilSeePage(pageKingdomPassAds, 3)) {
    qTap(pageKingdomPassAds);
    sleep(1000);
    console.log('skip kingdom pass ads');
  }

  if (checkIsPage(pageInKingdomPass)) {
    console.log('about to collect kingdom pass, send running');
    sendEvent('running', '');

    qTap(pnt(66, 57));
    sleep(1000);
    qTap(pnt(581, 340));
    waitUntilSeePage(kingdomPassItemCollected, 3, pnt(581, 340));

    qTap(pnt(151, 56));
    sleep(1000);
    qTap(pnt(581, 340));
    waitUntilSeePage(kingdomPassItemCollected, 3, pnt(581, 340));

    qTap(pnt(254, 57));
    sleep(1000);
    qTap(pnt(581, 340));
    waitUntilSeePage(kingdomPassItemCollected, 3, pnt(581, 340));

    qTap(pageInKingdomPass);
    console.log('successfully claimed all the kingdom pass rewards');
  } else {
    console.log('failed to find the kingdom pass page');
  }

  handleGotoKingdomPage();
  // Send friend rewards ======
  var pageFriends = [
    { x: 519, y: 24, r: 231, g: 159, b: 85 },
    { x: 553, y: 14, r: 251, g: 239, b: 215 },
    { x: 587, y: 19, r: 219, g: 175, b: 73 },
    { x: 618, y: 28, r: 64, g: 98, b: 132 },
  ];
  var pageInFriendsList = [
    { x: 23, y: 90, r: 255, g: 227, b: 0 },
    { x: 14, y: 70, r: 135, g: 152, b: 192 },
    { x: 13, y: 47, r: 52, g: 64, b: 89 },
    { x: 187, y: 351, r: 57, g: 69, b: 107 },
    { x: 234, y: 350, r: 57, g: 69, b: 107 },
  ];
  var pageCanSendFriendRewards = [
    { x: 402, y: 345, r: 82, g: 211, b: 0 },
    { x: 340, y: 350, r: 57, g: 69, b: 107 },
    { x: 24, y: 89, r: 255, g: 227, b: 0 },
    { x: 19, y: 107, r: 135, g: 152, b: 192 },
  ];
  if (checkIsPage(pageFriends)) {
    qTap(pageFriends);
    sleep(2000);
    if (waitUntilSeePage(pageInFriendsList, 6, pnt(23, 85))) {
      console.log('about to send daily freind gifts, send running');
      sendEvent('running', '');

      if (checkIsPage(pageCanSendFriendRewards)) {
        qTap(pageCanSendFriendRewards);
        console.log('successfully send daily gifts to friends');
      }
    }
  }
  handleGotoKingdomPage();

  // Rewards in shop ======
  var pageShop = [
    { x: 20, y: 84, r: 247, g: 190, b: 140 },
    { x: 23, y: 112, r: 181, g: 0, b: 24 },
    { x: 28, y: 119, r: 255, g: 235, b: 173 },
  ];
  if (checkIsPage(pageShop)) {
    console.log('about to get daily free reward from shop, send running');
    sendEvent('running', '');

    qTap(pageShop);
    sleep(config.sleepAnimate);

    var pageNecessities = [{ x: 114, y: 70, r: 255, g: 109, b: 107 }];
    var pageIsDailyFreePackage = [
      { x: 181, y: 186, r: 13, g: 203, b: 252 },
      { x: 190, y: 204, r: 255, g: 255, b: 255 },
      { x: 235, y: 220, r: 242, g: 121, b: 189 },
      { x: 253, y: 166, r: 255, g: 253, b: 166 },
    ];

    for (var i = 0; i < 7; i++) {
      if (!checkIsPage(pageIsDailyFreePackage)) {
        // Shop menu swipe up
        tapDown(60, 300, 40, 0);
        sleep(config.sleep);
        moveTo(60, 300, 40, 0);
        sleep(config.sleep);
        moveTo(60, 150, 40, 0);
        sleep(config.sleep);
        moveTo(60, -1000, 40, 0);
        sleep(config.sleep);
        tapUp(60, -1000, 40, 0);
        sleep(config.sleepAnimate * 4);

        qTap(pnt(pageNecessities[0].x, pageNecessities[0].y + i * 20));
        sleep(config.sleepAnimate * 2);

        // items swipe to left most
        tapDown(137, 20, 40, 0);
        sleep(config.sleep);
        moveTo(500, 20, 40, 0);
        sleep(config.sleep);
        moveTo(2000, 268, 40, 0);
        sleep(config.sleep);
        tapUp(2000, 268, 40, 0);
        sleep(config.sleepAnimate * 3);
      } else {
        console.log('Got daily reward correctly at ', i, 'y: ', pageNecessities[0].y - i * 10);
        qTap(pnt(265, 323));
        sleep(config.sleepAnimate);
        qTap(pnt(265, 323));
        sleep(config.sleepAnimate);
        break;
      }
    }
  }
  handleGotoKingdomPage();

  // Rewards in Gacha ======
  var pageGacha = [
    { x: 381, y: 329, r: 132, g: 74, b: 63 },
    { x: 373, y: 328, r: 247, g: 211, b: 148 },
    { x: 355, y: 328, r: 148, g: 81, b: 74 },
    { x: 418, y: 320, r: 132, g: 16, b: 8 },
  ];
  if (checkIsPage(pageGacha)) {
    console.log('about to get daily free gacha gifts, send running');
    sendEvent('running', '');

    qTap(pageGacha);
    sleep(config.sleepAnimate * 4);
    qTap(pnt(30, 70)); // Tap the first icon
    sleep(config.sleepAnimate * 2);

    var pageDailyGiftNotClaimed = [
      { x: 604, y: 330, r: 123, g: 207, b: 8 },
      { x: 443, y: 340, r: 137, g: 85, b: 99 },
      { x: 388, y: 323, r: 82, g: 24, b: 33 },
      { x: 451, y: 230, r: 156, g: 247, b: 255 },
      { x: 45, y: 221, r: 56, g: 74, b: 107 },
    ];
    var pageDailyGiftClaimed = [
      { x: 510, y: 325, r: 125, g: 125, b: 125 },
      { x: 614, y: 324, r: 125, g: 125, b: 125 },
      { x: 416, y: 20, r: 255, g: 207, b: 0 },
      { x: 45, y: 221, r: 56, g: 74, b: 107 },
    ];
    var pageDailyWatchAddGift = [
      {x: 610, y: 329, r: 0, g: 150, b: 214},
      {x: 441, y: 335, r: 140, g: 89, b: 107},
      {x: 101, y: 324, r: 33, g: 218, b: 255},
      {x: 177, y: 241, r: 175, g: 139, b: 58},
    ]

    var dailyGiftYs = [280, 225, 330];
    for (i in dailyGiftYs) {
      qTap(pnt(30, dailyGiftYs[i]));
      if (waitUntilSeePage(pageDailyGiftClaimed, 2)) {
        console.log('Daily gacha gift already claimed');
        handleGotoKingdomPage();
        return true;
      }
      if (checkIsPage(pageDailyWatchAddGift)) {
        // Not doing it for now as seems like will stuck in ads
        console.log('Not doing it for now as seems like will stuck in ads')
        break;
      }
      else if (checkIsPage(pageDailyGiftNotClaimed)) {
        qTap(pageDailyGiftNotClaimed);

        if (waitUntilSeePage(pageDailyGiftClaimed, 5, pageDailyGiftNotClaimed)) {
          console.log('Daily gacha gift claimed successfully: ');
          handleGotoKingdomPage();
          return true;
        }
      }
    }

    console.log('daily gacha gift NOT claimed');
    handleGotoKingdomPage();
    return false;
  }
}

// Numbers in wishing tree:
var b64N0_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ8DfD/wALeFNZsvhj4Y/4JveCfivo9l8MPCGtQ+NtV0K8utU1m81PT2ury9uLoPtljebckUa8RCCRQACBRX6fj/gm18AbFW0/wp4w+Jnh3SUleSy8O+Gfijq2n6dYF2LOtvBDOqxIWOdi/KDnaBk5K8H/AFqoT96Snd+n+YRymhTioRhFJaJWWiWy2P/Z';
var b64N0_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3b4FeCv2ZfjF+0F8Zv2f/ABx/wTi+Glzovwd8VQaH4UfT/CAtLw2zxuS13cIxN7I3lK/msAQXcY6sSvYfA3g34w61478X+Bbb9r34j6Zb+FdSjsbe90mPRYLu/jCEK95MNN3XUiqiqHclsZySSSSvL/tDCreL+5f5nTy1Xqnb5s//2Q==';
var b64N0_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzn9psWth8GPBHxetfCnhv9n/X9d8W+LNG1PQPCuly2dlqNnplzaJaTfZrgkLPH9pnglmUDzXiySdq4K/Z0/8ABMT9j7WrhtS+KXgbUviBqJRY4tV+IfiO71m6ghXO2GOS5kYxxgknauMkknJJNFeNHj3F4ZezpTqKK2Slb8Lni4vgDhXMcRLE4rBUp1JbycItu1lq7dkf/9k=';
var b64N1_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD65/4I5/s1/ss/tOfDXxb4X/aX/Yu+H2q+LfA+oWFtqup6/pz6nqEk91aC6kiuftyF7aSJnMZhTMQ27omkjZJGK6X9u/4tfFn9jf8AaGn1b9nP4hXPh4eM9BsZNctP7NsrqJ5LRXghZPtEDsh8shSA2DtHA5yVy0s2+uU1XaactXq3q99W7vXqzOlgqeFpxoxStFWWiSstrJJJWXRaH//Z';
var b64N1_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQ+MPwc/Zq+Lf7L3w18cW/7NfgXT9Xs/E3inw/rOqaVHLevqx0+SwiS4mubxFuZHO5ztmVXjLMjIjAqCvpD9s34NR63+0X4q+Hdv8AETX9P0Sw1mTXrOwso7EiK81OOI3ZDy2zuVZrWNgpY7SWxwcArzlmOHrpVHC3NZ97X6Xe9i6dKpQgqaltp2/BaI//2Q==';
var b64N1_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzH/gpx+z54e+OXh74GfGT9mb4P+APh/8A8JV8KV1PxHYaTqawQXNw2oXUaSifazXbbYjmViSQQcnNFfdz/wDBP/4T/tN/ETxP4L+KPjTxPLpfw01SXQ/CFpaNYRi0sZLie7MZY2haQiSZ8MxJ2hQScZor5TGTweIxDqNNXt08l5nvYLNsywWGjQpz0j/nc//Z';
var b64N2_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6B8M/ATWNT+IXinwZq3wT+HvxeuPDU8NnqvxC1DxZrMUt9qWZTcQSXFxd7Z5oh5O+OEeXAZAmc7lUrrPjPH8Q/hP8RdZ+FngX4w6tb+HtM1q9uNL0u70HRLxbM3M7Tyqj3FhJJgu5+8xOAMk4orysNiqCoQ5k27LojacJczP/2Q==';
var b64N2_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6S+A+g/sXWtjrmqftWT6BoFg+tPZ+DvGvhT4g+IbBPGSQIi3d28klyZLwJM2xbhsK5Z9m5QGJVXxPpPjWK7j+H2o/FG51TTfCcQ0rQE1rwd4dvHtbSL5UiV5tMZsAKO/J5OTRXmQxGGUEnG772RtyTbP/2Q==';
var b64N2_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDt/iJ8StG+Efw48K6r4cvvEvwv1zxHc6ndXem/CnXtXtoNW0lZY003Up7a5leSFph9pKM+2SRRuZRwAV6pqf7O9r+2Hqs+uftAfErWNavtF2wWV7/YWhxTGNuNrumnAyACJQAxO3nGMmivDqYjCc2sE35xX+Z0KFS2/wCJ/9k=';
var b64N3_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6L/Yd/Z1/Zh+KOj+JPC3xK+Ff7Kl9H4P1BNK0yxt/CbWuqWqRGWFn1COW4bbJL5Kuu12GN2DjABXnXwh+M/xV+GPizxZ8KPhp4m03QLHw1fxWK3uneCdE+16ksfmIkl3I9k3myAJ94BclmJzmiuaGN5IKN3/XzFLD0pybcV9x/9k=';
var b64N3_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6O/Ze+B/7Kvx0+C1n8Q/iT+zB8PPFuoT6jPFHH+zravpy6XCEidbbVEe4VjcgyNgHO3EnJzklJ+wXZ/EH9prwl4jsx8Z9c+Hln4Z1kQW1h8L9I0fSIbtpFO+a4X7C5lk/dqAcgDnAGTRXHLNlRfJeWn9dzKWX4Wq+aVOLfml/kf/Z';
var b64N3_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqdU+MnxJ+JPwM+Lfxy13x1r8HjbwhpcesaPrXgn46Xur3Oqz3FzbPZwt4aFnC9pp3kXUMT3ZjVw0T4JzkFfd2kf8ABG/4R6Jaat4B0n4n32n+AtX8xLzw1o/hPR7S/ubdrg3C2dxq6Wv264tklIZY3k6IqMzINtFfnGNocM4pwboq6VtIpfee9hswzHDppS0b6tn/2Q==';
var b64N4_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Dv2E/wBin4X67o/iLTP20fglc/EX4lQzWV54j8R/EbwxBewWf2qEywaTp87W6Qzx2kHlJLLbqsb3DysQGJVSuc/aQ/4WD+w98Rf7E/Zs+OfjrS9L8RWMdze6X4g8SSeIY4Zospvhk1j7VNCGDfMiyBCVBCg5yV5WDxWC+qw9jDljbRWSsjerGrKo3N3fU//Z';
var b64N4_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6M+Mf7EOi3Pwm8J6Za/BDxN468a6Tr+uaf8RPH+ueCJheeJNTj+xmS7XMW77F5rTx22P3flRfu8rySvQfjf8ADr4g/DH4map8Hvhj+1X8WtE8OaVcfb9Osf8AhMTfzQtdKvmRm6v457mWMGEFFklfYXfbgNgFeRSxmBdOPLCysraLa2nU6JRrczvLX1P/2Q==';
var b64N4_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDa/wCCmfgPxv8AB20+E+t/sQ/Arx3pema74JmXX9R1Dw1qdvq2sXVvfTRreaj5NnJI11KreafOCuBMvGDgFfX1n+xdpHx88V658PfiX+0h8Y7rSfh1eHS/CsFt8RLi3lgtpXkmYTTxhZrt8lUElw8j7I0G7qSV8liZ5LVrOc6Tu7dF2VuvY9GnUxcIWUvzP//Z';
var b64N5_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDtR+zh4V+OV3b6l+xh8Af2VfHum2vh/TH8V3fizxhqra7b61Nbh7z7cv2+FEd5/NIK7iSH3bSOSvc/g18NfF/gjxF4r+FXws+Oev8Ag/SfDWppa2//AAjXhvw7bz3y4cK93KdLZ7mRQoAdyWwTkkkmivJ+u4X+V/cjpvX/AJvxZ//Z';
var b64N5_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBf2if2UvhH8TfFtx4j/Zw/Zt+Cvij4bRavd2vg/V/hbeXmqXJijEO+LU/tOp24hnUMhVY1ZSGY7uMAr7B/ZY/Y98N/tQeCr+y8ffFbxXpVj4U1aWz0bS/BMWl6FbJvx5kzx2NjEJZX8uPc75+4MYycleBWzPB06ji1L5KJ2RWIavzfiz//2Q==';
var b64N5_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDO8ffs0fsI6vry+Mv2p9E8AeGNB1e3aT4cax8BLvUtQ0vW7FLiZZHnmlvfM+0xkRq6GNFXd8u/JIK+0vhF/wAE9Pg3+2f8I9D+Jnx88T+IL66sxNYaRpmkw6bpmn6ZbIwPlW9raWcccYLMzMcFmJ5OAACvk8TisI68tZr0UbHpU6uLjBJS/Fn/2Q==';
var b64N6_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0H48/8E1rl9c0n9nH9lT9oP4OeG/FHgLw/Z3fxWl1y7voNSu9R1KFZ4A3lxmNLOOGLZbW6k+TGTk/OBRXoPin43fH/wCDfxy8YfDHwV8aLsJoD2mnDXtQ8LaHdapqVtCjpbreXUtgzXBiTKozfNhjuLE5orn/ALQhNczV790mzKOCpQXLBWS6J2S9EtEf/9k=';
var b64N6_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6Y8Hfs5/HDwJ8WfG/hP8A4Jo2nw88U+FvClzbeE/E9tb+PbvTdVttbsPOe6uNVkktZFu7uaS7bLpgKsKpliuaK3P2Zr/45/HbXvHllP8AtSeM/CTaH4mZbi58C6fommS6zcSAq93fMmnH7RORCg38Ac4AyaK4KmZYT2j9pT5n1bSbfzuc/wDZsUkoTcUtknZL0XQ//9k=';
var b64N6_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rw7+3vc/8E6NO1Hxb8Cfgd4R+Ivwi+JniS8k+HDfC/xHNBbaRHpccFjcW08VzAG+0FhHK8ynbNJJIwAGMleg/sxfsTfDP/gpp8IYfF37T/ivxEYfCur3ln4b0DwhJaaHp2niZxLcypDZW0e6WZwrSO5YkouNoyCV5NbOMqp1XGrh1KS3euv3TX5HBUybF1ZudPFThF7RjyWXpeDf4+mh/9k=';
var b64N6_4_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6X/a5+LnxN+NEml/Hu7+NN1YaNbeJ9U8QaR4b8P69YC88N+GNFuZ7Eauulz7ZtQkuJt73JSRCLKWS2X/WSByvqjxH/wAExvBfiHxRqFt/wuHXLbwPq1zeyX3gqLRdMZhBeXP2q80+LUWtjewWE85Mj2ySgEsQCq/KCvzrHU+GsZ7N1KPM1FLaP6ntYbF5lhYuNOdk3c//2Q==';
var b64N7_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7G/Z6/ZW/ZH8OeLvHvgj4+fCL4Laxa+GNct9H0vxfH8MVsZdYvI7WOa+80NdT+a8bXEAaTcMu75UY5KX4j/sVeCfit8afG/w+8S/E/wAZw6P4d8TXOp6RZ6Zf2tuIZ9Vc3d3uZLbdKDIFCmQsyqirk4orxaWaUIUoqabdld2Wui8zodKbbsf/2Q==';
var b64N7_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2PxF4h/Yg/Z/+H2mah8Zf2UPhZqE2teKNettAv/Cnw+GmxX+nWNxFapeNAJp9okmE4X942Vjz3wCvp39j79jr4UeJ4PEmkfES41HxPB4Qvo/C/hyPWVtdtlp9m8xjVVggjXezTOzuQS5AJ6UV8vXz+lh6rpunzWtrprodkcPKavc//9k=';
var b64N7_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCL9srwtrT+DvhZpv7O/wCxvZweI7vwc2ueNrf4X/DvUYoIor2YnTfPhsYrnyXa3iaQLI//AC0YKWwTRX6l/wDBO/4b6e/wmv8A4na7ruoarrvifUV/tO/vPJjPl2sS2tvDGkEcaRxpHGMKF6sx70V8Pjs6lDFzjGOifaP+TPWowj7NX39Wf//Z';
var b64N8_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDrvi94I+DHxK8KeDvjH8WtR/ZOvfFXjbSptZ8U3n7UHjPW7XV7m/M7WzS2kNrMsKWXk2tvFGVUZSFRyAKK9d/bI8AW37OfxQj+Evgy707VfD9hZeboll4x8DaBrT6TDK7SNa2895p8kwgDsxVGdtu4gHGACvMoYrDOjFxjZWXRG79snbm/E//Z';
var b64N8_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6N8DfsV/sT/FTxfqVx8R9H+CWoXH9gaPqjP4q+IniC38XfatQilvLyTWY47pURpbmSWWJVAH7yY4BJyVs+INI+I/wz+L3if4Z+D/jfqkNt4f+y2Nvqd14P8M3WoXVtGjLBFc3U+lPJcCJBsRnJYKTksTmivMWKwbSfJ+COjmrrRSf3s//2Q==';
var b64N8_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6P8O/sY/sl2Os+JtP8K/aLBNK8TzaRBH+zH8Q/ERvI7O1ggW2h8RD7Vhb+NGKqBwF3AcAAFdz8D/g14y+N2teMLTXf2lPGuitofiF4mufCOnaDpUuqSuMPdXrW2mKbqdhGgMj+hwBk5K8Orisr53z0rv/AAxO2E8Wo2jUaXqz/9k=';
var b64N8_4_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD07x3p3gJPC3w58WyeN/2e9P1Hxb8K9F8Q+IG+OdtLdeIr3UrtZXuLqWTcw8mRgDEowFUYAAwAVhftp+LLj9nH46XH7P2meGfDPi3SPBWlWuj+G9Q8eeENO1PULXTYlb7PZm4aBWkihViqbssF6sx5orlpVqMqacVpYppp2P/Z';
var b64N9_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqvhx+zB8Vbj4PfDzwn+wD+zX+x9r91pHw60wfGW1+N2nRTeKtN8Yu04v4rqNsvFDuQCEH5CinysxhDRX3P8Z/h541+F/x98W3/wAGf2gPF3g5PE8tlqms2+j2WjzCe4FpFaL+8vNPnl2LFax7U37VLOQBuNFeRh8yoToRk4tXS7f5nROE+d3dz//Z';
var b64N9_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7X/Y1/Yc/ZK+Nfibxp/wrj9lj9l/xd8GtEttDtfhjqUGhRX3iBJjY7tUj1wyK0kd4J/L+SXEoBO8bs0V2KfsRaL448c+L/BqftF/FbQNG0fxXfahp+m+EPFUWkqLjUp3u7qSWS1gSW6JkYBTO8hRECqQM5K8P+2sJFLmi72XRdUvM6fY1X1P/2Q==';
var b64N9_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7L+B/7BX/AATy+M/hLXPGv7Unwx/Zy07wz/wnur2vwY1n4Pa6thb6p4YiMKwG8mtZUW5u0bcJBlhGzkDG45K7j4Lf8EzP2XvjR4Oj0T9oPR7/AOIGn+CD/wAI94L03xI9uttodjASNtvFaQwJ5kp2tNM4aWUom5iEUAr5qtn+BpVXF022vJHdClX5dJ2+bP/Z';
var b64Nd_1_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDX/ZIuv2bf+Cbf7KPhbxl+0X+ybpPxy8cfGXUtR8QTXr+GodUOm6TbtFZ2Lx/aIC0dtcmO4uITtQtGw3DcpwV+lP7DX7OPgbw3pWua1r97eeJ722gsPC9hdeIILVvsekaUs0dlaRJBBFGiIJ5icLljIST0wV8fU4ghg5ewpU/djZL7j0qlOriqjrVZXlJtt+bP/9k=';
var b64Nd_2_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDf0f8A4Ji/GDVPgh8Of2cv2XPhz4Pfxz4W8Jp4q+MniHxloMN1eT6h4glkubTT5ZCAfOtLe12umdo89CoAfkr9VP2JfANp4a+Gmp+P7/XtQ1nxF4412TWPFGu6sYjcX1yIYrZMiGONFRIbeKNUVQAE9SSSvg8VnuJpYiUKKSitEmu2h6ao+19+o7yerfqf/9k=';
var b64Nd_3_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0PXfiz8GP2cPg94Nv/CnwO8aeK9D8Tvfy+AvDfgbxJqGmR6J4VtHistPvJoreZN8mpzQX+otNJukke4kZ2ZsmivvD/gnD8FfC2j+Dda8V61d3Gu6gsen+GLWfV7a1xaaVpEUkFlaxRwQxxxoolmY4X5nlY+gBXxdfOqWEqujCimo2V3u9FuegqEqq55Sd2f/Z';
var b64NE_tree =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9eYJvKlmUOCplyBvUEfKoxyD6UUWipcXd0ZkDETYBP0x/Siv5lTg9z9T07H//2Q==';

var b64_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzuD/gm/8AsJa/Zx2fxe+Flv8ADrQ7CG0TwP4vh8S3lu3juzksLWebUHa5neOYrPK67oFRBv2YytFfkhD/AKfNLbX376O2bZbRy/MsSnkhQfujPOBRX5rDg3PJRus2qx8le3rrNvXd62u9ElZLreIp/wDPtH//2Q==';
var b64_0_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxP4O/DL/glpfeCtMl8X2/wYbw4dJhbQNY13xyltrV9dGWb7YL6IXazRsmLcIskaDa2UzljRRRX4NXwmJniKn+11laUlpUa2k1f1drvzb2PUjKKivdX3H/2Q==';
var b64_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD488I/AT9mXxV+yT4A8XeK/wBnL/hHPFUOv69ofiaSHVr5p7+ezNkfNnSeT9zIDO6mJFVVwRjOaK+Fjqmp6nM11qOoz3EsqrNLJPMzs8jjLuSTyzHknqe9FfEQyHGtyksZNKTk7Xk7c0m7azbsr2Xkjo9rH+VH/9k=';
var b64_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5N/aE/Z3+FXw4+CXwo8TfHX9gjWfCHinxVolzqH2T4X2WsSWdxph+z/Y5bmW9uJ0e7YGV3EUnyrJHvVCQKK+AIte1zUZHg1DWbueO2Oy3Sa5ZhEvPyqCflHA4HpRXxOCyXFU8OlPFTbvJ6SmlrJtJJzk7JaK7ex0SqRb+H+vuP//Z';
var b64_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDiv+CX37Bf7LH7RP7Lum+Nf2j/ANjrT47tXaPStT/sDxPpTapDuYG5a8lvTb6lkgDdapGkWNpGWGCvyFk1XU7q7m0651GeS3tXxawPMxSENy2xScLk8nHWivyLHcDZ3jsbUr082q04yk2orntHXZfvV+R3wxNKMUnTT/r0P//Z';
var b64_4 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwnxX/AMErvgRof7OHwzvvh+PB3irXLqPUP+Ev8WwfFPSmttRuttpIscAS+2pHCJWi2kCTcGZgAyUV+YTu8czWyOVjTBWMHCgnqQPfA/Kivz+lw9n1NNPMHJ3k7uEusm/+fttL2SVkkrJJaHU6tJ/Y/r7j/9k=';
var b64_4_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDw7xd/wS5+CGjfs5/DTUfh8/g7xRrl2mof8Jf4st/inpTW2oXW20kWO3CX21I4RK0W0gSbgzMAGSivzPlVVu5LZVAjQKyxgfKCepA98D8qK+ApcO59TTTzByd5O7hLrJv/AJ+20vZJJJLRJLQ6fa0n9j+vuP/Z';
var b64_5 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5n/aG/Y00LxN4G+H/AMRf2fP2d/hr4W8O6z4diMcHxF8L+JdD1a8nS1tDNcu1xe+XewvJIzRzwIkZDHg8Givzjt/GPi6B5Fh8VakgQ+UgW+kG2NfuoOeFGTgdBk0V+eUMszTCUlSWLcrX1cW3Zu6u+fW21+p1ucJO/L/X3H//2Q==';
var b64_6 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5s/ad/wCCNWhWvh/wDf8AwK+IXh7QrG48J2x1bVfGMV9Ztr988EFxLeW08rPBdW/+kLGpt0RU8vDF2OQV+b6SSapNJZ6k5uIbNvLtIpzvWBDyVQHhRnnAor4zA5RxJQwyh/aPNa+rpJvd7vmOiVSi3fk/E//Z';
var b64_6_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5w/aa/wCCOOhWXh/wDf8AwM+IXh/Q7G48KWzarqvjFL6zbXr54IbiW8tppWeC6t/9IWNTboip5eGLscgr85rQnVJprTUybmKzfy7SKf51gQ8lUB4UZ5wKK+KwWT8SUcMof2jzWvq6Sb3e75jolUot35PxP//Z';
var b64_7 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD51/YqX/gnro/7LHh/4gft4/sufDyCbWNSvLHwnqWnyata3mqw2awie5ut+oOkjGSdVDRJEvyN8voV+dUaq91LE6gqu0qpHAJ6n8cCivzvEcDfXMTOvLHV480m7RqSjFK+iS5nsvvetlsdaxPKkuVfcf/Z';
var b64_7_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4h+Pevfs7fDr4FfCHWvFX7EvgOLxj4q8PXmravaeFr7V7KNNPM6w2MsyT307GWTyblyQyqQRhRRXx9agP5isMhJSqg9h1wPQcn86K+XwmQ0aNHlnVnJ3k789RbybStz7JOy8kbSqtvRfgv8j/2Q==';
var b64_8 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDnPH//AATY/YOtvBvha6l/Z1ubPztMgaO4TUdQ0Y3Qexspmc3d7eNDqx8yaU/aLRUiXds25Aor8erRm1WWaz1Qm5hs38uziuPnWBDyVQHhRnnAor8yw/Budqkl/atR7/z9/KqjseJp3+Bf18j/2Q==';
var b64_8_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwf/gnt8PP+CZviL9lHQ9U/aR0r4btrzarqCaxP4g8W6faXAkWRPs6yNLeR3cRMW8rEsJt2ALmXeApKKK/AM2w+Knm2IaxVaK55aKpJLft/Wh6lOUVTj7q27H/2Q==';
var b64_9 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxD4jfBH/gjpp/wT+G3xH8YtY+G7PxTpMsuhjT5NbstTvIYY7aOeXUVvJCssv2s3IWW3VYGUELnbwV+ZCf6+Zu/mlc+w5x9Mk/maK+Ew/CGKp0+V5liHq/t9G20uuy0v1302Ol4iL+wj//2Q==';

// The material requirement numbers in production
var b64N0_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDnH8V/s6/Aea8+J/8AwWDvfB/iP4F/EnUP7V/Ym0u78HHVItJ8JLa2zOlrbQWJfS4Psk2iwm2lEZM9rcy+WWkeecoooA//2Q==';
var b64N0_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5g+HX/BSv/gmL8NNU8Vap+0wLj9oPwZ4l8Tzap8Ivhpd/DOK4f4R6ZLFEz6UG1Zo4YUw1vZrb2Ek1qiaOrqyiZVooooA//9k=';
var b64N0_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDk/wDgobc/sl/s8Wiy/wDBaT9mHxp4y8L+I/jJ40uf2T9M8B6xb20GhfDqK30OHTYIoLPULZLKyMC24gsmVZInjuXeKN52aUoooA//2Q==';
var b64N0_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0/wAT/tZfGjxf8ZdJ03wR43vrCXxHfaynhXS4rS3OnRR2L3UcC3m8GWQ3LWU5LIR5YKjrzRXlf7RGrR/DL9ovXvC/hbSLVJPDOvzQ+GtWkDm60tNZO66ERDBDta5nMRdH8vzWHI4or53lxM5P2bWnf+u1j9RjDhqhhKUsZQk3KKa5HbTlinza6vn5nfs16L//2Q=='
var b64N1_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8gvjJ8XPFPj3/AIJpfAj4eeJfERu4PA3xN+IOn6BZm2RPsNhcW/hq98sMqgybrq4vJMsWYb8ZChACiigD/9k=';
var b64N1_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8z/26/wBpiD9oX/glR+xx4d1Lxu2sa98O7jx34Y1iFtPMH9nwwzaM9jbAiNElC2T2x3oWzn52L76KKKAP/9k=';
var b64N2_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD83/8Agqf4b+PHg79kX9le1+M3xR8UfEOPxV4O1HxtZ+OvFfiaS+ljn1W30ppNCginLTwW9jBb2T7mYxyzahcNGFAYUUUUAf/Z';
var b64N2_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5o/4Jd/8ABVP4f/8ABPL9mbTbRv23PDvxC8T+LIIjrfgn4i6j4wg07wFa2imOysdP8jQ7yOSR0lkNw8bpEBFbRoHERkcoooA//9k=';
var b64N2_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDoP2Ef2Y/+Ci3gj9g34Ra98Wf+CZHhv9uux8YeCtO1/wAFWPxJ8WeFLTRvhfoUun2cFhpmljVopLo3FxaW9vNeKiR2ymO12GWdruQlFFAH/9k=';
var b64N3_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6I/4N9fBH7Tfg79hXQNR/bn0/Xbax1rw9ot78L5/ibf6V4r0O50A2CCzbQ7TT2S60MCzFitzbXbSCV1inj2SSXKKUUUAf/9k=';
var b64N3_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDhP+CB/wDwV7/Yf/Yg/Zt1PwB+2Z+2lBbaxdrpp0aTTbDxZ4ikhs44HC2M9pfWD2WnyWodYA+nt5c6KiuD9mjllKKKAP/Z';
var b64N4_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5h/bQ8N/8Egvj3+w5+z78KPhF/wAFCIPAHg34Zaz4t03TLvVPhPr2pXus3lzHolzeTXLJEm2XeySHaPKxchIwqxbQUUUAf//Z';
var b64N4_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzb/gif/wWB/4JufsKeDPEnwR1j9rP4raV4ETw/oN1o+n/ABP8LNcFPEjvqX9uPpsWjpdi1sJANNkSGaQuJHm5c75HKKKBJWR//9k=';
var b64N5_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4d+Cfxb/4Jlfty/s9+AvDH/BVn9qW9+Hmp/Cvwxb+GvAVj8Ml1+aWfTIlEROo20+l31lFc/uI5BPZSL5yzhZUUwIKKKKAP//Z';
var b64N5_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyr4VePPglrP7O/wAK/ih/wUw/bm/aF/ZH0y++FnhvQPhXZfC74salrOn+NLHSdItLSXVf7OsbCddGJjNkxiaUGV5pGMasjyTFFFAH/9k=';
var b64N6_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4j/bp+Lv/AARA+NfiDQdZHi34iXFloOm23h7whZfCNL95NP8AD9lpWmxW0Oop4l2RRz/a/wC0mH9nkxuHaSbMrmSQoooA/9k=';
var b64N6_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4K/4L2/Cn4O6TrPw0+PXwV0jWtI8J+LLa60f4WaPceLJNT0tvAOl6VoQ0G/so7i1hutPe5+2X73NrctLKLlJZSzed5kpRRQB//9k=';
var b64N7_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5J/Z4/wCC4f7YH/BLD/gnf8GfBnwN+M1j418S/EG417xBq+lfECx1G/j8L6Ba3EGiaPp1m7XKIsfmaVqkvlx/KiyxLsXGXKKKAP/Z';
var b64N7_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5u/YO/wCC1H7Wf/BJD/gnz8OfFfjDXde+LGnfFfVtYTwZ4Z1/x3Mlr4P0bRTa2EUdt5ltK0Qmne6UwLJ5McdpAyIjSybiiigD/9k=';
var b64N7_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD85/8Ags7+1F44+J/hL9n/APZr8WfGfxH4+Hgb4fXXi0+IvHWsXep+IF/4Sy7/ALY0+0vr24wtxJFoB8PBxCvlR3D3SI7qFClFFAH/2Q==';
var b64N7_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7B/Ze/Zd/Zl1rxr8TG/aM+GNp4Y17SfFUOjXni3Rf2i/GEyeK7i3s4Wmmd5ZoH3QGZISmGCEFVO0Ciuu+J3/BHPxb8amTwz46/aRbT/Dui6zquo+Go/Delyw3k02pXTXN3NfvJM6zSkiFA0YRcRk7RnAK8SlxHg6dKMZTd0lsmlsjZ4abbsj/2Q==';
var b64N8_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDR/wCCRv8AwWv/AOCVP7LFlc6n8cP2gNA0O4vfgb8LfDXnx6F4u1PUJr/RNEnt9QgnhNg9lZQw3E5SJbLKzMZ7iSR3mwhRRQB//9k=';
var b64N9_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5b+Lf/BWz9lPS/wBlr4N+I/in+xX4f+J/iXxXZanq1x4D8T3ER0T4fWdubXRILbQUmsZVtbG5bRp5/sisTAwwzybg5KKKAP/Z';
var b64N9_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDH/wCCbX/Bcn9kf/gnt+x94K+Nn7UXw4+M+tS/Efw3pfhTQPBWmXum6voWjQ+EtPttLl1PToLie3+wDUZZjNPH8zvc28zt8nlSSlFFAH//2Q==';
var b64NS_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8fv2xLrwN8Pvgz8FP2Zvh/qVtfnRvBQ8a+Mr9bK4hlbxB4jhtbp4CZXZGjh0u20WFTEFQvHM5+aRgpRRQB//Z';
var b64NS_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8i/8AgqV4k0KD9qy4/Z38C6kLrwt8C9Asvhn4emXQYNNW5fSVaPU74QxFiBe6w+qajmV3l/08h2yNqlFFAH//2Q==';
var b64NS_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5S/ai+K/7EP7Ud34R+F//AAUm/aL8ReGNf0nwZpvxG1DxB4d0C48zX/EPjW1i1y7QyeTqMkltYaP/AMIxpcHmmJlWwkVQ0YQIUUU00uhm4Nu/M193+R//2Q==';
var b64NS_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8pfjX8df2a/jD8GPhJ8BPHHxw8ZyQfDvwZHcX/iXR/h3FqNxqeuX6RC5tZHvNVtX8jTrCy0XSoGwwZdOk8sLAsGSiinddiHBt6Sa+7/I//9k=';

function recognizeWishingTreeRequirements(words, devImg, maxLength, thres, overlapRatio) {
  var maxWordWidth = 0;
  var allResults = [];
  for (var w = 0; w < words.length; w++) {
    var word = words[w];
    var wh = getImageSize(word.img);
    maxWordWidth = Math.max(maxWordWidth, wh.width);
    var results = findImages(devImg, word.img, thres, maxLength, true);
    for (var idx in results) {
      var result = results[idx];
      allResults.push({ char: word.char, x: result.x, y: result.y, score: result.score, w: wh.width });
    }
  }

  allResults.sort(function (a, b) {
    return a.x - b.x;
  });
  var str = '';
  var rBound = 0;
  var maxScore = 0;
  for (var i = 0; i < allResults.length; i++) {
    word = allResults[i];

    // console.log('word', word.char, rBound, 'x', word.x, word.score);
    if (word.x > rBound) {
      maxScore = word.score;
      str += word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    } else if (word.x <= rBound && word.score > maxScore && word.char !== ' ') {
      // overlap
      maxScore = word.score;
      str = str.substr(0, str.length - 1) + word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    }
  }
  return str;
}

function genWish(id, refreshPnt, unfoldPnt, fulfillPnt, recogDetail, status, requirementIconPnts) {
  return {
    id: id,
    refreshPnt: refreshPnt,
    unfoldPnt: unfoldPnt,
    fulfillPnt: fulfillPnt,
    recogDetail: recogDetail,
    status: status,
    requirementIconPnts: requirementIconPnts,
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  };
}

function getCEs() {
  var img = getScreenshot();
  var croppedImage1 = cropImage(img, 430, 88, 46, 10);
  var croppedImage2 = cropImage(img, 430, 148, 46, 10);
  var croppedImage3 = cropImage(img, 430, 208, 46, 10);
  var croppedImage4 = cropImage(img, 430, 266, 46, 12);

  var value1 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage1, 7, 0.75, 0.7) || 0;
  var value2 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage2, 7, 0.75, 0.7) || 0;
  var value3 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage3, 7, 0.75, 0.7) || 0;
  var value4 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage4, 7, 0.75, 0.7) || 0;

  releaseImage(croppedImage1);
  releaseImage(croppedImage2);
  releaseImage(croppedImage3);
  releaseImage(croppedImage4);
  releaseImage(img);
  return [value1, value2, value3, value4];
}

function handlePVP() {
  console.log('handlePVP: ', new Date());

  var battleY = [108, 162, 223, 275];

  if (!handleGotoAdventure(Advantures.pvp, kingdomArena)) {
    console.log('unable to goto pvp, skipping handlePVP');
    return false;
  }

  console.log('about to start handlePVP, send running');
  sendEvent('running', '');

  var pageHasPageMedalShop = [
    { x: 41, y: 333, r: 245, g: 187, b: 44 },
    { x: 122, y: 298, r: 57, g: 166, b: 231 },
    { x: 118, y: 261, r: 57, g: 166, b: 231 },
    { x: 54, y: 334, r: 49, g: 77, b: 107 },
  ];
  var pageInMedalShop = [
    { x: 39, y: 336, r: 113, g: 65, b: 1 },
    { x: 89, y: 67, r: 255, g: 255, b: 255 },
    { x: 357, y: 17, r: 113, g: 77, b: 16 },
    { x: 452, y: 20, r: 61, g: 8, b: 10 },
  ];
  var pageAncientCookieSoldout = [
    { x: 86, y: 109, r: 206, g: 20, b: 24 },
    { x: 38, y: 131, r: 206, g: 20, b: 24 },
  ];
  var pageSuperEpicCookieSoldout = [
    { x: 118, y: 127, r: 220, g: 23, b: 24 },
    { x: 170, y: 112, r: 206, g: 20, b: 24 },
    { x: 164, y: 98, r: 74, g: 76, b: 87 },
  ];
  var pageNotEnoughMedal = [
    { x: 292, y: 248, r: 123, g: 207, b: 8 },
    { x: 320, y: 185, r: 250, g: 210, b: 8 },
    { x: 338, y: 243, r: 123, g: 207, b: 8 },
  ];
  if (config.autoPvPPurchaseAncientCookie && checkIsPage(pageHasPageMedalShop)) {
    console.log('Auto purchase ancient cookie...');
    qTap(pageHasPageMedalShop);
    sleep(1500);
    if (checkIsPage(pageInMedalShop)) {
      if (!checkIsPage(pageAncientCookieSoldout)) {
        qTap(pnt(57, 125));
        sleep(1000);
        qTap(pnt(317, 252));
        sleep(2000);

        if (checkIsPage(pageNotEnoughMedal)) {
          qTap(pageNotEnoughMedal);
          sleep(2000);
          qTap(pnt(439, 92));
          sleep(2000);
          console.log('Need more medals, skipping');
        } else {
          console.log('Purchased ancient cookie successfully');
        }
      } else {
        console.log('ancient cookie already sold out');
      }

      if (!checkIsPage(pageSuperEpicCookieSoldout)) {
        qTap(pnt(145, 125));
        sleep(1000);
        qTap(pnt(317, 252));
        sleep(2000);
        if (checkIsPage(pageNotEnoughMedal)) {
          qTap(pageNotEnoughMedal);
          sleep(2000);
          qTap(pnt(439, 92));
          sleep(2000);
          console.log('Need more medals, skipping');
        } else {
          console.log('Purchased super epic cookie successfully');
        }
      } else {
        console.log('super epic cookie already sold out');
      }

      keycode('BACK', 1000);
      for (var i = 0; i < 5; i++) {
        if (waitUntilSeePage(kingdomArena, 3)) {
          break;
        }

        keycode('BACK', 1000);
        console.log('tap back to arena: ', i);
      }
    }
  }

  var arenaReadyToBattlePage = [
    { x: 533, y: 331, r: 77, g: 170, b: 4 },
    { x: 490, y: 322, r: 194, g: 11, b: 27 },
    { x: 611, y: 279, r: 227, g: 219, b: 211 },
    { x: 164, y: 332, r: 123, g: 207, b: 8 },
    { x: 78, y: 330, r: 0, g: 150, b: 214 },
  ];

  console.log('go kingdomArena success');
  for (var loop = 0; loop < 5; loop++) {
    var ces = getCEs();
    for (i = 0; i < ces.length; i++) {
      var ce = ces[i];
      if (ce < config.autoPvPTargetScoreLimit && ce !== 0) {
        console.log('Battle with', i, 'ce', ce, 'target limit: ', config.autoPvPTargetScoreLimit);
        if (checkIsPage(pagePvPCrystaisRefresh)) {
          console.log('crystaisRefreshPage');
          tap(436, 90, 100); // X cancel
          sleep(1500);
        }

        if (!waitUntilSeePage(arenaReadyToBattlePage, 5, pnt(590, battleY[i]))) {
          console.log('Wait 8 sec but did not find the pvp battle page, skipping');
          continue;
        }
        if (checkIsPage(kingdomArena)) {
          // already battled
          console.log('Battle with', i, 'failed. Already Battled');
          continue;
        }
        tap(550, 320, 100); // start battle
        if (waitUntilSeePage(pageNoArenaTicket, 5)) {
          console.log('Not enough arena ticket, skipping pvp');
          return handleGotoKingdomPage();
        }

        if (waitForBattle('pvp', 120, false, kingdomArena)) {
          console.log('PvP battle finished, try next one');
          continue;
        } else {
          console.log('Finish PvP due to battle return false');
          break;
        }
      } else {
        console.log('Not to battle with', i, 'ce', ce, ', limit', config.autoPvPTargetScoreLimit);
      }
    }

    tap(560, 330, 100); // Free Refresh
    sleep(5000);
    if (waitUntilSeePage(pagePvPCrystaisRefresh, 1)) {
      console.log('crystaisRefreshPage');
      tap(436, 90, 100); // X cancel
      break;
    }
  }

  sendEvent('running', '');
  console.log('finish pvp, goto kingdom');
  // handleGotoKingdomPage();
}

function handleWishingTree() {
  console.log('handleWishingTree: ', new Date());

  if (!checkIsPage(pageInWishingTree)) {
    if (!checkIsPage(pageInKingdomVillage)) {
      handleGotoKingdomPage();
      waitUntilSeePage(pageInKingdomVillage, 8);
    }

    if (checkIsPage(pageNotCollapsedWisingTree)) {
      qTap(pageNotCollapsedWisingTree);
    } else if (checkIsPage(pageCollapsedAffairs)) {
      qTap(pageCollapsedAffairs);
      if (!waitUntilSeePage(pageNotCollapsedWisingTree, 6)) {
        console.log('Cannot get into wishing tree page, skipping');
        return false;
      }
      qTap(pnt(106, 284));
    }

    if (!waitUntilSeePage(pageInWishingTree, 6)) {
      console.log('Cannot get into wishing tree page, skipping');
      return false;
    }
  }

  return handleInWishingTree();
}

function getStatusOfGivenWish(wish, records) {
  wish.golden = false;
  if (isSameColorAtPnt(wish.unfoldPnt, { r: 255, g: 249, b: 203 })) {
    wish.status = 'opened';
  }
  else if (isSameColorAtPnt(wish.unfoldPnt, { r: 246, g: 210, b: 135 }, 15)) {
    qTap(wish.unfoldPnt);
    sleep(config.sleepAnimate);
    wish.status = 'opened';
    records['opened'] ++;
  }
  else if (isSameColorAtPnt(wish.refreshPnt, { r: 193, g: 160, b: 111 })) {
    wish.status = 'refresh';
  }
  else if (isSameColorAtPnt(wish.unfoldPnt, {r: 255, g: 222, b: 41})) {
    // Folded golden wish
    wish.golden = true;
    records['golden'] ++;
    if (config.wishingTreeRefreshGoldenWishes) {
      qTap(wish.refreshPnt);
      sleep(config.sleepAnimate * 2);
      qTap(wish.refreshPnt);
      sleep(config.sleepAnimate);
      console.log('refresh as it is an unfolded golden wish:', JSON.stringify(wish));
      wish.status = 'refreshed';
    } else {
      qTap(wish.unfoldPnt);
      sleep(config.sleepAnimate);
      wish.status = 'opened';
      records['opened'] ++;
    }
  } else if (isSameColorAtPnt(wish.unfoldPnt, { r: 255, g: 247, b: 123 })) {
    // Expend golden wish
    wish.golden = true;
    records['golden'] ++;
    if (config.wishingTreeRefreshGoldenWishes) {
      qTap(wish.refreshPnt);
      sleep(config.sleepAnimate);
      console.log('refresh as it is a golden wish:', JSON.stringify(wish));
      wish.status = 'refreshed';
      records['goldenAndSkip'] ++;
    } else {
      wish.status = 'opened';
    }
  }

  return {wish: wish, records: records};
}

function checkToSendSpecificWish(wish, records) {
  for (var pntIdx in wish.requirementIconPnts) {
    var reqPnt = wish.requirementIconPnts[pntIdx];

    if (isSameColorAtPnt(reqPnt, { r: 255, g: 251, b: 206}) || isSameColorAtPnt(reqPnt, { r: 255, g: 255, b: 142})) {
      // console.log('This point has no item, skipping:', pntIdx);
      continue;
    }

    qTap(reqPnt);
    sleep(config.sleepAnimate);

    var ocrResult = "";
    if (waitUntilSeePage(pageCheckWishingTreeStock, 7, reqPnt, null, 3)) {
      // Use this to collect stock info
      var img = getScreenshot()
      var cImg1 = cropImage(img, 325, 110, 40, 15);
      ocrResult = recognizeWishingTreeRequirements(numberImagesWishingTree, cImg1, 12, 0.87, 0.7);
      releaseImage(cImg1);
      releaseImage(img);
    }

    if (!checkIsPage(pageInWishingTree)) {
      keycode('BACK', 1000);
      sleep(config.sleepAnimate);
    }
    waitUntilSeePage(pageInWishingTree, 7, pageCheckWishingTreeStock, null, 3);

    ocrResult = ocrResult.trim();
    var stockAndReq = []
    if (ocrResult.length === 0) {
      // do nothing
    } else if (ocrResult.indexOf('/') === -1) {
      stockAndReq = ocrResult.substr(0, ocrResult.length - 1), ocrResult.substr(ocrResult.length - 1, 1);
    } else {
      stockAndReq = ocrResult.split('/');
    }

    // console.log('|>', pntIdx, JSON.stringify(stockAndReq))
    if (stockAndReq.length === 0 || (stockAndReq[0] - stockAndReq[1] < config.wishingTreeSafetyStock)) {
      console.log('Skip this one as the stock {0} is lower than config {1}, need {2}'.format(stockAndReq[0], config.wishingTreeSafetyStock, stockAndReq[1]));
      qTap(wish.refreshPnt);
      sleep(config.sleep);
      wish.status = 'refresh';
      return {wish: wish, records: records};
    }

    sleep(config.sleep);
  }

  console.log('Stock is enough, fulfill this wish', JSON.stringify(wish));
  qTap(wish.fulfillPnt);
  sleep(config.sleep);

  if (checkIsPage(pageNotEnoughForTree)) {
    qTap(pageNotEnoughForTree);
    sleep(config.sleepAnimate * 2);
    console.log('wish ', wish.id, ' tapped but not enough stock (wrong ocr?), refresh it');

    qTap(wish.refreshPnt);
    sleep(config.sleepAnimate);
    wish.status = 'refresh';
    return {wish: wish, records: records};
  }

  console.log('wish ', wish.id, ' is fulfilled');
  records['fulfilled'] ++;
  return {wish: wish, records: records};
}

function handleInWishingTree() {
  if (!checkIsPage(pageInWishingTree)) {
    console.log('handleInWishingTree cannot find the wishing tree, skipping');
    return false;
  }

  console.log('handleInWishingTree: ', new Date());
  sendEvent('running', '');

  // wish(id, refreshPnt, unfoldPnt, fulfillPnt, recogDetail, status, requirementIconPnts)
  var wishes = [
    genWish(0, pnt(183, 79), pnt(183, 190), pnt(183, 283), undefined, 'unknown',
    {
      0: pnt(162, 198),
      1: pnt(198, 198),
      2: pnt(162, 235),
      3: pnt(198, 235),
    }),
    genWish(1, pnt(295, 79), pnt(295, 190), pnt(295, 283), undefined, 'unknown',
    {
      0: pnt(275, 198),
      1: pnt(312, 198),
      2: pnt(275, 235),
      3: pnt(312, 235),
    }),
    genWish(2, pnt(400, 79), pnt(400, 190), pnt(400, 283), undefined, 'unknown',
    {
      0: pnt(390, 198),
      1: pnt(425, 198),
      2: pnt(390, 235),
      3: pnt(425, 235),
    }),
    genWish(3, pnt(520, 79), pnt(520, 190), pnt(520, 283), undefined, 'unknown',
    {
      0: pnt(508, 198),
      1: pnt(545, 198),
      2: pnt(508, 235),
      3: pnt(545, 235),
    }),
  ];

  var wishingTreeStartTime = Date.now();
  var records = {
    'opened': 0,
    'golden': 0,
    'fulfilled': 0,
    'notEnoughAndSkip': 0,
    'goldenAndSkip': 0
  }

  while ((Date.now() - wishingTreeStartTime) / 60000 < config.wishingTreeMaxFillingMins) {
    var pageAllDailyRewardCollect = [
      { x: 59, y: 242, r: 247, g: 247, b: 247 },
      { x: 60, y: 256, r: 138, g: 138, b: 138 },
    ];
    if (checkIsPage(pageAllDailyRewardCollect) && !config.alwaysFulfillWishes) {
      console.log('All wish fulfilled, skipping and send running');
      sendEvent('running', '');
      break;
    }

    var refreshing = 0;
    for (var i in wishes) {
      var wish = wishes[i];

      var result = getStatusOfGivenWish(wish, records);
      wish = result['wish'];
      records = result['records'];
      console.log('handling wish', i, JSON.stringify(wish));

      if (wish.status === 'refresh') {
        refreshing ++;
        continue;
      }
      else if (wish.status === 'opened') {
        result = checkToSendSpecificWish(wish, records);
        wish = result['wish'];
        records = result['records'];
        console.log('handled wish', i, JSON.stringify(wish));
      }

      sleep(config.sleep)
    }
    console.log('>>> Wising tree records', JSON.stringify(records))

    var pageCollectTreeReward = [{ x: 85, y: 289, r: 44, g: 203, b: 8 }];
    if (checkIsPage(pageCollectTreeReward)) {
      console.log('Daily reward collected');
      qTap(pnt(60, 255));
      sleep(2000);
      waitUntilSeePage(pageInWishingTree, 8, pageCollectTreeReward);
    }

    if (refreshing === 4) {
      console.log('All wishes are refreshing, jobs done here');
      break;
    }

    if (!checkAndRestartApp()) {
      console.log('detected game crashed, restart and finish handleInWishingTree');
      return false;
    }
  }
  console.log('Run wishing tree for ', (Date.now() - wishingTreeStartTime) / 60000, ' mins, ending this task');

  handleTryHitBackToKingdom();
  if (checkIsPage(pageUncollapsedAffairs)) {
    qTap(pageUncollapsedAffairs);
  }

  return true;
}

function handleEventWishingTree() {
  if (!config.autoHandleEventWishingTreeAmounts === 0) {
    return false;
  }

  var lastMonth = 9;
  var lastDate = 14;
  if (new Date().getMonth() > lastMonth && new Date().getDate() > lastDate) {
    console.log('skipping handleEventWishingTree as the event is over:', new Date().toLocaleString());
  }

  var pageCanGotoEvent = [
    { x: 19, y: 111, r: 222, g: 86, b: 104 },
    { x: 28, y: 115, r: 254, g: 229, b: 180 },
  ];
  var pageInEvent = [
    { x: 114, y: 16, r: 102, g: 102, b: 107 },
    { x: 105, y: 18, r: 247, g: 226, b: 173 },
    { x: 76, y: 20, r: 19, g: 19, b: 26 },
  ];
  var pageDisneyCookieWishlist = [
    { x: 190, y: 24, r: 41, g: 24, b: 8 },
    { x: 182, y: 49, r: 247, g: 235, b: 222 },
    { x: 145, y: 105, r: 34, g: 26, b: 108 },
    { x: 133, y: 94, r: 74, g: 40, b: 8 },
  ];

  console.log('handleEventWishingTree at:', new Date().toLocaleString());
  if (!checkIsPage(pageInKingdomVillage) && !checkIsPage(pageInEvent)) {
    handleTryHitBackToKingdom();
  }

  if (checkIsPage(pageCanGotoEvent)) {
    qTap(pageCanGotoEvent);
    waitUntilSeePage(pageInEvent, 5);
  }

  if (!checkIsPage(pageInEvent)) {
    console.log('Failed to goto pageInEvent, skip handleEventWishingTree');
    return false;
  }

  for (var i = 0; i < 3; i++) {
    tapDown(59, 80, 40, 0);
    sleep(config.sleep);
    moveTo(59, 80, 40, 0);
    sleep(config.sleep);
    moveTo(59, 270, 40, 0);
    sleep(config.sleep);
    moveTo(59, 400, 40, 0);
    sleep(config.sleep);
    moveTo(59, 600, 40, 0);
    sleep(config.sleep);
    tapUp(59, 600, 40, 0);
    sleep(config.sleepAnimate * 2);
  }

  if (!waitUntilSeePage(pageDisneyCookieWishlist, 5, pnt(62, 265))) {
    console.log('Failed to goto pageDisneyCookieWishlist, skip handleEventWishingTree');
    return false;
  }

  // Fulfill wishes 50 times
  for (i = 0; i < config.autoHandleEventWishingTreeAmounts; i++) {
    qTap(pnt(230, 142));
    sleep(config.sleepAnimate);
    qTap(pnt(390, 142));
    sleep(config.sleepAnimate);
    qTap(pnt(540, 142));
    sleep(config.sleepAnimate * 2);

    qTap(pnt(230, 280));
    sleep(config.sleepAnimate);
    qTap(pnt(390, 280));
    sleep(config.sleepAnimate);
    qTap(pnt(540, 280));
    sleep(config.sleepAnimate * 2);
    sendEvent('running', '');
    console.log('Fulfill wish and send running, #', i);
  }

  // Reset all the left over wishes
  qTap(pnt(174, 277));
  sleep(config.sleepAnimate);
  qTap(pnt(336, 277));
  sleep(config.sleepAnimate);
  qTap(pnt(495, 277));
  sleep(config.sleepAnimate);

  console.log('Successfully handleEventWishingTree');
}

function handleInHotAirBallon() {
  if (config.autoSendHotAirBallonIntervalInMins == 0) {
    console.log('handleInHotAirBallon skipped as autoSendHotAirBallonIntervalInMins is set to 0');
    return;
  }

  if (!waitUntilSeePage(pageInHotAirBallon, 8, pnt(1, 1), pageBallonFlyingDock)) {
    console.log('Wait but not find pageInHotAirBallon station, skipping');
    return false;
  }

  console.log('About to handleInHotAirBallon, send running');
  sendEvent('running', '');

  var pageChooseBallonDestination = [
    { x: 285, y: 15, r: 208, g: 161, b: 89 },
    { x: 319, y: 7, r: 91, g: 61, b: 45 },
    { x: 352, y: 18, r: 210, g: 162, b: 89 },
    { x: 616, y: 15, r: 56, g: 165, b: 231 },
  ];
  var pageCanStartBallonTrip = [
    { x: 580, y: 330, r: 121, g: 207, b: 12 },
    { x: 478, y: 327, r: 241, g: 51, b: 92 },
    { x: 417, y: 330, r: 12, g: 167, b: 223 },
    { x: 437, y: 316, r: 138, g: 85, b: 60 },
  ];

  // Tap Change location
  if (!config.ballonKeepCurrentDestination) {
    var pageChangeLocation = [
      { x: 354, y: 339, r: 12, g: 167, b: 223 },
      { x: 416, y: 335, r: 12, g: 167, b: 223 },
      { x: 436, y: 344, r: 142, g: 88, b: 65 },
    ];
    qTap(pageChangeLocation);
    sleep(2000);
    if (checkIsPage(pageStockIsFull)) {
      console.log('goto ballon but stock is full, quitting');
      handleGotoKingdomPage();
      return;
    }
    if (!waitUntilSeePage(pageChooseBallonDestination, 8, pageChangeLocation)) {
      console.log('Cannot find the pageChooseBallonDestination, quitting');
      handleGotoKingdomPage();
      return;
    }

    if (config.isHotAirBallonGotoEp4) {
      console.log('ballon going to ep4');

      var pageBallonMapEp4 = [
        {x: 611, y: 204, r: 236, g: 228, b: 255},
        {x: 9, y: 37, r: 56, g: 33, b: 19},
        {x: 40, y: 120, r: 129, g: 229, b: 81},
      ];
      for (var i = 0; i < 5; i++) {
        tapDown(50, 268, 40, 0);
        sleep(config.sleep);
        moveTo(200, 268, 40, 0);
        sleep(config.sleep);
        moveTo(2000, 268, 40, 0);
        sleep(config.sleep);
        tapUp(2000, 268, 40, 0);
        sleep(config.sleepAnimate * 3);

        if (checkIsPage(pageBallonMapEp4)) {
          console.log('Found ep4 at try: ', i);
          break;
        }
      }
      qTap(pageBallonMapEp4);
      sleep(config.sleepAnimate);
    } else {
      console.log('ballon going to the latest map');
      tapDown(626, 268, 40, 0);
      sleep(config.sleep);
      moveTo(400, 268, 40, 0);
      sleep(config.sleep);
      moveTo(-2000, 268, 40, 0);
      sleep(1100);
      tapUp(-2000, 268, 40, 0);
      sleep(config.sleepAnimate * 3);

      for (i = 0; i < 4; i++) {
        for (var xLocation = 550; xLocation >= 100; xLocation -= 125) {
          for (var yLocation = 85; yLocation < 285; yLocation += 70) {
            qTap(pnt(xLocation, yLocation));
            sleep(2000);

            if (waitUntilSeePage(pageChooseBallonDestination, 5)) {
              continue;
            }

            if (checkIsPage(pageInHotAirBallon)) {
              console.log('ballon destination choosed successfully, i, x, y = ', i, xLocation, yLocation);
              i = 10;
              xLocation = 0;
              yLocation = 500;
            }
          }
        }

        tapDown(30, 268, 40, 0);
        sleep(config.sleep);
        moveTo(250, 268, 40, 0);
        sleep(config.sleep);
        moveTo(620, 268, 40, 0);
        sleep(1100);
        tapUp(620, 268, 40, 0);
        sleep(config.sleepAnimate * 3);
      }
    }
  }

  if (waitUntilSeePage(pageInHotAirBallon, 8)) {
    qTap(pnt(250, 330)); // Tap Auto
    sleep(config.sleepAnimate);
    qTap(pageCanStartBallonTrip);
    sleep(config.sleepAnimate * 2);
    console.log('Successfully sent ballon');
  }

  handleGotoKingdomPage();

  var pageTrainUncollapsed = [
    { x: 109, y: 231, r: 255, g: 223, b: 142 },
    { x: 120, y: 235, r: 219, g: 46, b: 73 },
    { x: 105, y: 321, r: 75, g: 116, b: 160 },
    { x: 106, y: 328, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageTrainUncollapsed)) {
    qTap(pageCollapsedAffairs);
  }
  return;
}

function handleGotoHotAirBallon() {
  console.log('start handleGotoHotAirBallon: ', new Date());
  handleGotoKingdomPage();

  var pageHotAirBallonReady = [
    { x: 122, y: 185, r: 255, g: 166, b: 165 },
    { x: 103, y: 206, r: 255, g: 109, b: 206 },
    { x: 118, y: 209, r: 57, g: 89, b: 132 },
  ];
  var pageBallonFlying = [
    { x: 610, y: 17, r: 57, g: 166, b: 231 },
    { x: 219, y: 30, r: 55, g: 20, b: 38 },
    { x: 253, y: 51, r: 162, g: 162, b: 162 },
    { x: 263, y: 316, r: 255, g: 255, b: 255 },
  ];

  if (checkIsPage(pageCollapsedAffairs)) {
    console.log('Found collapsed kingdom affairs');
    qTap(pageCollapsedAffairs);
    sleep(config.sleepAnimate * 2);
    qTap(pnt(108, 200));
    sleep(3000);
    if (!waitUntilSeePage(pageInHotAirBallon, 10, pnt(1, 1), pageBallonFlying)) {
      console.log('Cannot find pageInHotAirBallon, should be flying');
      handleGotoKingdomPage();

      if (!checkIsPage(pageCollapsedAffairs)) {
        qTap(pageCollapsedAffairs);
      }
      return false;
    }
  } else if (checkIsPage(pageHotAirBallonReady)) {
    console.log('Found hot air ballon ready');
    qTap(pageHotAirBallonReady);
    sleep(3000);
    if (!waitUntilSeePage(pageInHotAirBallon, 10, pnt(1, 1), pageBallonFlying)) {
      console.log('Cannot find pageInHotAirBallon, should be flying');
      handleGotoKingdomPage();

      return false;
    }
  } else {
    console.log('Did not find either hot air ballon, skipping');
    return false;
  }

  return handleInHotAirBallon();
}

function handleSkipRemoveGroundGuide() {
  var pageGnomeTeachRemoveGround = [
    { x: 610, y: 25, r: 5, g: 14, b: 20 },
    { x: 20, y: 132, r: 56, g: 35, b: 22 },
    { x: 213, y: 147, r: 60, g: 36, b: 20 },
    { x: 210, y: 162, r: 255, g: 243, b: 239 },
    { x: 299, y: 82, r: 212, g: 110, b: 127 },
  ];

  if (checkIsPage(pageGnomeTeachRemoveGround)) {
    console.log('found pageGnomeTeachRemoveGround');
    qTap(pageGnomeTeachRemoveGround);
    sleep(config.sleepAnimate);
  }
}

function handleAutoBattleInIslands(item) {
  // Auto clear red sword
  var pageReadyToClearRedSword = [
    { x: 531, y: 324, r: 121, g: 207, b: 12 },
    { x: 456, y: 28, r: 241, g: 53, b: 60 },
    { x: 494, y: 23, r: 252, g: 246, b: 216 },
    { x: 572, y: 327, r: 60, g: 70, b: 105 },
  ];
  var pageBattleToClearSodaIsland = [
    { x: 601, y: 326, r: 121, g: 207, b: 12 },
    { x: 623, y: 313, r: 60, g: 70, b: 105 },
    { x: 573, y: 84, r: 254, g: 253, b: 251 },
    { x: 165, y: 335, r: 121, g: 207, b: 12 },
  ];
  var pageBattleHasWetCookieCannotStart = [
    { x: 350, y: 250, r: 123, g: 207, b: 8 },
    { x: 420, y: 200, r: 247, g: 235, b: 222 },
    { x: 400, y: 100, r: 57, g: 69, b: 107 },
  ];
  var pageAddMoreCookies = [
    { x: 304, y: 253, r: 12, g: 167, b: 223 },
    { x: 168, y: 331, r: 60, g: 103, b: 6 },
    { x: 152, y: 180, r: 65, g: 65, b: 53 },
    { x: 131, y: 203, r: 65, g: 66, b: 52 },
    { x: 101, y: 235, r: 65, g: 68, b: 53 },
    { x: 176, y: 242, r: 97, g: 75, b: 33 },
  ];
  // Will be seen when lost in battle
  var pageSunbedsListInMiddle = [
    { x: 217, y: 60, r: 133, g: 231, b: 74 },
    { x: 247, y: 52, r: 57, g: 69, b: 107 },
    { x: 226, y: 82, r: 165, g: 60, b: 90 },
    { x: 428, y: 19, r: 2, g: 67, b: 127 },
    { x: 47, y: 328, r: 119, g: 40, b: 67 },
  ];

  var img = getScreenshot();
  var foundResults = findImages(img, item, 0.88, 5, true);
  console.log('Found item icon at: ', JSON.stringify(foundResults));
  releaseImage(img);

  for (var i = 0; i < foundResults.length; i++) {
    waitUntilSeePage(pageInTropicalIsland, 15);
    img = getScreenshot();

    foundResults = findImages(img, item, 0.8, 5, true);
    console.log('Found item icon at: ', JSON.stringify(foundResults));
    releaseImage(img);

    if (foundResults.length > 0) {
      // console.log('tap: ', foundResults[0].x + 10, foundResults[0].y + 10)
      qTap(pnt(foundResults[0].x + 10, foundResults[0].y + 10));

      if (checkIsPage(pageSunbedsListInMiddle)) {
        console.log('pageSunbedsListInMiddle, just lost a battle, finish');
        qTap(pnt(441, 53));
        sleep(config.sleepAnimate);
        handleGotoKingdomPage();
        return;
      }

      if (waitUntilSeePage(pageReadyToClearRedSword, 8)) {
        console.log('pageReadyToClearRedSword');
        qTap(pageReadyToClearRedSword);

        if (waitUntilSeePage(pageBattleToClearSodaIsland, 8)) {
          console.log('pageBattleToClearSodaIsland');
          qTap(pageBattleToClearSodaIsland);
          sleep(1500);
          qTap(pageBattleToClearSodaIsland);
          sleep(6000);

          if (checkIsPage(pageBattleHasWetCookieCannotStart)) {
            console.log('Has wet cookie cannot start the battle, skip this task');
            qTap(pageBattleHasWetCookieCannotStart);
            sleep(config.sleepAnimate);
            handleGotoKingdomPage();
            return false;
          }

          if (checkIsPage(pageAddMoreCookies)) {
            console.log('No island battle team selected, cannot start the battle, skip this task');
            qTap(pageAddMoreCookies);
            sleep(config.sleepAnimate);
            handleGotoKingdomPage();
            return false;
          }

          if (rfpageCanEquipTopping.isMatchScreen(this.screen)) {
            console.log('Found rfpageCanEquipTopping, tap OK and wait for 5 secs');
            rfpageCanEquipTopping.goNext(this.screen);
            sleep(5000);
          } else if (rfpageCanEquipTopping2.isMatchScreen(this.screen)) {
            console.log('Found rfpageCanEquipTopping2, tap OK and wait for 5 secs');
            rfpageCanEquipTopping2.goNext(this.screen);
            sleep(5000);
          }

          if (waitForBattle('islandRedsword', 600, true, pageInTropicalIsland)) {
            console.log('Successfully clear sword idx: ', i);
            continue;
          } else {
            console.log('Fail during clearing the sword, exiting: ', i);
            return false;
          }
        }
      }
    }
  }

  console.log('no more selected items need to be cleared, return');
  return true;
}

function handleCollectIslandResources() {
  handleGotoAdventure(Advantures.tropicalIsland, pageInTropicalIsland);
  if (!checkIsPage(pageInTropicalIsland)) {
    console.log('failed to goto pageInTropicalIsland, skipping');
    handleGotoKingdomPage();
    return;
  }

  console.log('about to start handleCollectIslandResources, send running');
  sendEvent('running', '');

  // Collect resource if ready
  var pageResourceisReady = [
    {x: 307, y: 333, r: 123, g: 207, b: 8},
    {x: 363, y: 331, r: 123, g: 207, b: 8},
    {x: 33, y: 332, r: 255, g: 100, b: 176},
  ];
  // var pageShipOnTheWay = [
  //   { x: 275, y: 335, r: 247, g: 52, b: 86 },
  //   { x: 291, y: 337, r: 255, g: 255, b: 255 },
  //   { x: 307, y: 335, r: 0, g: 170, b: 255 },
  // ];
  if (checkIsPage(pageResourceisReady)) {
    console.log('successfully collected tropical island resources');
    qTap(pageResourceisReady);
    sleep(config.sleepAnimate);
    waitUntilSeePage(pageInTropicalIsland, 6);
  } else {
    console.log('tropical island ship is still on the way');
  }

  var i = 0;
  foundResults = findSpecificImageInScreen(greenCheckedWhiteBackground, 0.95);
  if (foundResults.length > 0) {
    console.log('Tap green check at: ', JSON.stringify(foundResults));
    for (i = 0; i < foundResults.length; i++) {
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
    }
  }

  foundResults = findSpecificImageInScreen(redExclamation, 0.935);
  if (foundResults.length > 0) {
    console.log('Tap redExclamation check at: ', JSON.stringify(foundResults));
    for (i = 0; i < foundResults.length; i++) {
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
    }
  }

  // Auto collect sunbeds
  var pageSunbeds = [
    { x: 52, y: 323, r: 238, g: 68, b: 119 },
    { x: 61, y: 336, r: 44, g: 77, b: 110 },
  ];
  var pageFreeAllCrispyCookie = [
    { x: 341, y: 316, r: 123, g: 207, b: 8 },
    { x: 376, y: 313, r: 49, g: 60, b: 90 },
    { x: 223, y: 85, r: 255, g: 101, b: 173 },
  ];
  var pageHasNoCrispyCookie = [
    { x: 425, y: 111, r: 44, g: 46, b: 60 },
    { x: 422, y: 132, r: 44, g: 46, b: 60 },
  ];
  qTap(pageSunbeds);
  sleep(2000);
  if (waitUntilSeePage(pageFreeAllCrispyCookie, 8, pageSunbeds, pageHasNoCrispyCookie)) {
    console.log('try to release crispy cookies');
    qTap(pageFreeAllCrispyCookie);
    sleep(1000);

    if (!checkIsPage(pageHasNoCrispyCookie)) {
      console.log('found wet cookie, skipping this task');
      handleGotoKingdomPage();
      return false;
    }

    keycode('BACK', 1000);
    sleep(2000);
  } else {
    console.log('No cookies need to / can be be free');
    keycode('BACK', 1000);
    sleep(2000);
  }

  // Clear hammers
  var foundResults = findSpecificImageInScreen(islandHammer, 0.935);
  if (foundResults.length > 0) {
    console.log('Tap island hammer at: ', JSON.stringify(foundResults));
    for (i = 0; i < foundResults.length; i++) {
      qTap(foundResults[i]);
      sleep(config.sleepAnimate * 3);
      qTap(pnt(324, 263)); // Tab build

      if (!waitUntilSeePage(pageInTropicalIsland, 4)) {
        console.log('Not enough resource to build island, skipping');
        keycode('BACK', 1000);
        sleep(1000);
        keycode('BACK', 1000);
        sleep(1000);
      } else {
        console.log('Build hammer successfully');
      }
    }
  }

  // Clear battles
  var redSword = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAaABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9J/2kf+CnngbwiqeE9AXUtJF7ZS3E+sPpVxcPaWcckMU1zKbdJEsrdXuIEN1O6opmUZViCPkXSvHnwB+OXxR8Sal8adSu7vwrpUdpafDzxJo/ivUNP0uG5EP2i+uvtmm3cDSzkvDEDJugh+yhVlMs80K7P7Neh/Hzxb+0b8SPiX8G9QsrzQtM8PaNpOv2XiOOSKK81QPNcW9hY3USfuTHbzSXM5cTANdWq7F83zIpvFPhP4G/HyK60r4fxy+CPFcsst5c2FxZ+Ut1JuDSyG3R/IulZ5Q0txbsX8x08yQlfLP8ueLPF3GGAwTvhqtHCzty4unaUYO/vRlFRk6WqSUpJqWtvL+gMvjwrl+cV+H6clFwa5lGT9o7LRybfvJPdR+Ha2pFqX7Mv7RdtfzR/DP9ubXtE0EyFtM0nWPCljrNxaRt83lm9uf31woJO1pSzhNoZ3ILkr5C134R/s1fDXVJPA/7Rn7MWoan4309UTxHqun+MrY299OVDfaYQ+owMkUissiIYYyiuF2LtxRXzuCyrjmrg6c6XFsHFxi0/q9GV00rPmc7y06vV7s+iVCnbSvFLs6k016rl0Z+in/BLXwpB8Sv2BPFWm+A5Ld9c134zeJLfxPqUzB3smN1HD5mM5LLp0VqqKCOPL5AryH/AIKHfHX4b6neQ/sN/B1YLq28M6vb3HjDxlpOohW0KW1nEsVjZXED749SeaNTcOCDDE0qN+9mGz5A+M/xa+Kvwt/4J3eLrD4Y/EzxB4cg1b9oe4tdUh0HWp7NLyCXw5pfmxSiJ1EiPk7lbIbPINXfBul6ZoPhex0nQ9OgsrWK1Tyra0hWONMjJwqgAZJJ+pr+ic0z6thuG6ODhBWqQs29dGrNWt1PnOBfCfJ+KvF7Msdj6rlHC1ZNQt8TUmld32T1atrs3Y6RfhV8EdTL6l8QNDTxfrNxK8l/4i8VxR3d/eMzEgyy7VztBCKAAFRFUABRRWWZJMn5z+dFfBU63soKEEkloktEktkl0R/X8OD8ihFRjRjZf3V/kf/Z'
  );
  var whiteSword = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAdABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9t/i/+0J8G/gF4bg8W/GD4hab4c0y6v0soL/VrgRRNMyO+3J6ARxyyMxwqRxSSMVRGYfKn7Z/7T3hfx/8evD3wX/4XB4g0TwPaeCIvFE/iLwB43m0satd30lzb2KTahYsHt7WKK1up8FhHcvLB8w8jElX9rK/+KPiD9tbwEfg5q9vrV74a+Hev6lrPhnUENvBpdvMY4YL2O+Ri1veXVyqWcatFKGt11AqYwsok8U1j4W/A34qy6vpPgnQ7n4ceM7i6uZNd0D7FDAZ54vLWa4ntI38m82+fEGubd8lpFR5sgoPwPxh4/4i4Zy+rQw+Eq06M1FLGQUZwpyum1ONpON1onKKTvZdbfd8G5TkmNzOlHF1lzNN+zXxW1Skk7XS3drvt0Z9Efsp/tIfGL4WfHvw1+zL8SviDrPxB8O+M7G9/wCEX17WhbyatolzZW6zPFcywpGbuykiVttzIjTRz7I5ZZvtMZjK88/4JZeDfht8HfFmr+DviHHqcfxkOmXkzC7vJbnTF8Om/Hl/2O3+qit9xtRcJtine4TzJIwjQMSvuvDGvmdXgjCVMwxscZUkr+1jazi37qbTacorST7pni8VQwdHPKtPDU3CMdLNWvb7SXRPdHb/ALNM154o+Ov7VPiXTon1nxHY614Z0bStKluwEhtINDS6tQNzKEQ3WoXzscjOWHJBzxP7V3gbQND8OWH7HPhbUrfUfij4uYX9trps/PuPDlq8q/a/EkhDxvb+UFaO2JYeddLDHh0Sdkq+NPgB8XPDn7QnjPxn8IP2odZ8Caf4u0uy0nxraeGfD9kb7U5dPe7S3uY7y6Sb7K3l3JQ7I9+I0IcEDHQfCf4R+A/gtY3sHgfS5/tmrXX2rXtc1S/lvdS1e5Ocz3d3OzzXEnJwXY7QcKFGBX2qqTlgJ4SUE4ycua+qak3pbzTtrt5nyuJwGFq5vTzBzd4RhypXVpRSWr7XV7K99ro6z9mT4G6X8CNR8Q+Itc+Kuq+M/EWvzRQP4j1+0toLqLS7febSx220ccRWNpriQuqK0kk7sRjaqlWtGN1qupR2H2ny/M3fPtzjCk9OPSiuPA4HB5XhIYXCU406cFaMYpKKXZJaJHfXxFfGVnWrScpPdvc//9k='
  );

  var battleResult = handleAutoBattleInIslands(redSword);
  if (battleResult) {
    battleResult = handleAutoBattleInIslands(whiteSword);
  }

  releaseImage(redSword);
  releaseImage(whiteSword);

  handleGotoKingdomPage();
  return true;
}

var Advantures = Object.freeze({
  bounties: 'bounties',
  pvp: 'pvp',
  guild: 'guild',
  towerOfSweetChaos: 'towerOfSweetChaos',
  superMayhem: 'superMayhem',
  tropicalIsland: 'tropicalIsland',
  cookieAlliance: 'cookieAlliance',
});

function GenAdvanture(pnt, fromHead, backward) {
  return {
    pnt: pnt,
    fromHead: fromHead,
    backward: backward,
  };
}

// When there are NO timed event
var AdvanturesBountiesAt2nd = Object.freeze({
  pvp: GenAdvanture(pnt(123, 230), true, false),
  towerOfSweetChaos: GenAdvanture(pnt(214, 230), true, false),
  tropicalIsland: GenAdvanture(pnt(300, 230), true, false),
  cookieAlliance: GenAdvanture(pnt(392, 230), true, false),

  superMayhem: GenAdvanture(pnt(500, 150), false, false),
  bounties: GenAdvanture(pnt(300, 100), false, false),
  guild: GenAdvanture(pnt(10, 100), false, true),
});

var AdvanturesBountiesAt3rd = Object.freeze({
  pvp: GenAdvanture(pnt(123, 230), true, false),
  towerOfSweetChaos: GenAdvanture(pnt(214, 230), true, false),
  tropicalIsland: GenAdvanture(pnt(300, 230), true, false),
  cookieAlliance: GenAdvanture(pnt(392, 230), true, false),

  superMayhem: GenAdvanture(pnt(500, 150), false, false),
  bounties: GenAdvanture(pnt(500, 100), false, false),
  guild: GenAdvanture(pnt(630, 100), false, false),
});

var AdvanturesBountiesAt4th = Object.freeze({
  pvp: GenAdvanture(pnt(123, 230), true, false),
  towerOfSweetChaos: GenAdvanture(pnt(214, 230), true, false),
  tropicalIsland: GenAdvanture(pnt(300, 230), true, false),
  cookieAlliance: GenAdvanture(pnt(392, 230), true, false),

  superMayhem: GenAdvanture(pnt(500, 150), false, false),
  bounties: GenAdvanture(pnt(625, 100), false, false),
  guild: GenAdvanture(pnt(120, 100), false, true),
});

// With super mayhem
// var pageAdventureItemsNoEvents = [
//   { x: 25, y: 16, r: 214, g: 235, b: 231 },
//   { x: 13, y: 29, r: 253, g: 222, b: 89 },
//   { x: 551, y: 179, r: 33, g: 16, b: 8 },
//   { x: 547, y: 334, r: 49, g: 4, b: 8 },
// ];

// Case not exist for now
var pageBountiesAt2ndSlot = [
  { x: 242, y: 68, r: 255, g: 255, b: 255 },
  { x: 347, y: 102, r: 198, g: 65, b: 0 },
  { x: 328, y: 112, r: 206, g: 150, b: 66 },
  { x: 294, y: 130, r: 222, g: 147, b: 96 },
  { x: 231, y: 138, r: 253, g: 234, b: 74 },
];

// Most general case, 1. world exploration 2. guild battle 3 Bounties & pvp
var pageBountiesAt3rdSlot = [
  { x: 595, y: 86, r: 148, g: 73, b: 33 },
  { x: 588, y: 152, r: 173, g: 122, b: 66 },
  { x: 585, y: 177, r: 24, g: 12, b: 8 },
];

// Perhaps with Cooklie Odysses and super mayhem not finished
var pageBountiesAt4rdSlot = [
  // TODO
];

function handleGotoAdventure(targetAdvanture, targetPage) {
  console.log('handleGotoAdventure: ', targetAdvanture);
  if (!checkIsPage(targetPage)) {
    // Route from Head
    if (AdvanturesBountiesAt3rd[targetAdvanture].fromHead) {
      if (!checkIsPage(pageInCookieHead)) {
        if (!checkIsPage(pageInKingdomVillage)) {
          handleTryHitBackToKingdom();
        }

        // Tap head
        if (checkScreenMessage(messageNotifyQuit)) {
          // todo: debug log
          console.log('seems like im in notify quit page');
        }
        // Tap head
        if (!waitUntilSeePage(pageInCookieHead, 12, pnt(20, 30), null, 3)) {
          console.log('Failed to get to cookie head in', 12, 'secs, skipping');

          handleGotoKingdomPage();
          return false;
        }
      }

      // swipe to the end of the list in head
      for (var i = 0; i < 3; i++) {
        tapDown(560, 186, 40, 0);
        sleep(config.sleep);
        moveTo(560, 186, 40, 0);
        sleep(config.sleep);
        moveTo(400, 186, 40, 0);
        sleep(config.sleep);
        moveTo(200, 186, 40, 0);
        sleep(config.sleep);
        moveTo(0, 186, 40, 0);
        sleep(config.sleep);
        tapUp(0, 186, 40, 0);
        sleep(config.sleepAnimate * 2);
      }

      qTap(AdvanturesBountiesAt3rd[targetAdvanture].pnt);
      if (waitUntilSeePage(targetPage, 15)) {
        console.log(targetAdvanture, 'page found');
        return true;
      }
      return false;
    }

    // Route from PLAY! btn
    if (!checkIsPage(pageChooseAdvanture)) {
      if (!checkIsPage(pageInKingdomVillage)) {
        handleGotoKingdomPage();
      }
      if (!waitUntilSeePage(pageInKingdomVillage, 6)) {
        console.log('Skipping ', targetAdvanture, ' as cannot goto kingdom');
        return false;
      }

      qTap(pnt(560, 330)); // tap play
      if (!waitUntilSeePage(pageSelectAdvanture, 6)) {
        console.log('failed to goto choose adventure, skipping');
        return false;
      }
    }

    var destination;
    if (checkIsPage(pageBountiesAt2ndSlot)) {
      console.log('pageBountiesAt2ndSlot', JSON.stringify(AdvanturesBountiesAt2nd[targetAdvanture]));
      destination = AdvanturesBountiesAt2nd[targetAdvanture];
    } else if (checkIsPage(pageBountiesAt3rdSlot)) {
      console.log('pageBountiesAt3rdSlot', JSON.stringify(AdvanturesBountiesAt3rd[targetAdvanture]));
      destination = AdvanturesBountiesAt3rd[targetAdvanture];
    } else if (checkIsPage(pageBountiesAt4rdSlot)) {
      console.log('pageBountiesAt4rdSlot', JSON.stringify(AdvanturesBountiesAt4th[targetAdvanture]));
      destination = AdvanturesBountiesAt4th[targetAdvanture];
    }

    if (destination.backward) {
      for (var swipe = 0; swipe < 3; swipe++) {
        tapDown(410, 186, 40, 0);
        sleep(config.sleep);
        moveTo(200, 186, 40, 0);
        sleep(config.sleep);
        moveTo(0, 186, 40, 0);
        sleep(config.sleep);
        moveTo(-400, 186, 40, 0);
        sleep(config.sleep);
        tapUp(-400, 186, 40, 0);
        sleep(config.sleepAnimate);
      }
    }

    qTap(destination.pnt);
    if (waitUntilSeePage(targetPage, 8, destination.pnt, null, 3)) {
      return true;
    } else {
      console.log('Cannot goto ', JSON.stringify(destination), ', skipping');
      return false;
    }
  } else {
    console.log('already in target page');
    return true;
  }
}

var pageBattleVictoryButNeedTap = [
  { x: 230, y: 49, r: 49, g: 134, b: 214 },
  { x: 224, y: 58, r: 231, g: 182, b: 41 },
  { x: 254, y: 59, r: 123, g: 190, b: 255 },
  { x: 329, y: 27, r: 214, g: 44, b: 66 },
  { x: 371, y: 56, r: 198, g: 223, b: 222 },
  { x: 410, y: 68, r: 49, g: 138, b: 214 },
  { x: 26, y: 332, r: 11, g: 1, b: 1 },
];

var pageBattleFinished = [
  { x: 56, y: 331, r: 247, g: 89, b: 24 },
  { x: 584, y: 332, r: 8, g: 166, b: 222 },
  { x: 606, y: 24, r: 57, g: 169, b: 231 },
];

var pageBattleDefeat = [
  { x: 243, y: 58, r: 69, g: 90, b: 105 },
  { x: 280, y: 54, r: 46, g: 46, b: 46 },
  { x: 410, y: 57, r: 60, g: 92, b: 95 },
  { x: 397, y: 48, r: 142, g: 158, b: 158 },
];

var pageDefeatWithGotoKingdom = [
  { x: 81, y: 314, r: 247, g: 89, b: 24 },
  { x: 85, y: 175, r: 231, g: 231, b: 231 },
  { x: 92, y: 232, r: 222, g: 146, b: 74 },
  { x: 243, y: 58, r: 70, g: 93, b: 107 },
  { x: 294, y: 58, r: 41, g: 44, b: 41 },
];

var pageNoArenaTicket = [
  { x: 314, y: 111, r: 228, g: 121, b: 37 },
  { x: 347, y: 104, r: 36, g: 46, b: 65 },
  { x: 414, y: 120, r: 243, g: 233, b: 223 },
  { x: 300, y: 259, r: 12, g: 167, b: 223 },
];

var pageBattleFinishedWithSunbeds = [
  { x: 491, y: 322, r: 12, g: 167, b: 223 },
  { x: 537, y: 324, r: 239, g: 74, b: 117 },
  { x: 553, y: 331, r: 60, g: 180, b: 6 },
  { x: 310, y: 26, r: 222, g: 48, b: 70 },
  { x: 330, y: 28, r: 204, g: 37, b: 60 },
];

var pageIslandSunbedWithWetCookie = [
  { x: 218, y: 60, r: 133, g: 231, b: 74 },
  { x: 228, y: 82, r: 104, g: 52, b: 79 },
  { x: 444, y: 102, r: 41, g: 44, b: 57 },
];

var pageFoundOctopus = [
  { x: 500, y: 330, r: 8, g: 166, b: 222 }, // exit
  { x: 360, y: 243, r: 229, g: 18, b: 50 },
];

var pageInKingdomConstructionShop = [
  { x: 624, y: 19, r: 33, g: 85, b: 123 },
  { x: 20, y: 12, r: 181, g: 8, b: 33 },
  { x: 11, y: 24, r: 99, g: 40, b: 41 },
  { x: 28, y: 27, r: 255, g: 223, b: 247 },
  { x: 330, y: 15, r: 178, g: 8, b: 33 },
  { x: 179, y: 340, r: 156, g: 101, b: 74 },
  { x: 194, y: 335, r: 255, g: 255, b: 255 },
];
var pageKingdomDecorating = [
  { x: 619, y: 12, r: 57, g: 169, b: 231 },
  { x: 42, y: 23, r: 99, g: 174, b: 49 },
  { x: 33, y: 25, r: 48, g: 100, b: 14 },
  { x: 33, y: 81, r: 255, g: 255, b: 255 },
  { x: 20, y: 222, r: 57, g: 69, b: 107 },
  { x: 33, y: 212, r: 255, g: 255, b: 255 },
];

var pageBattleFinishedWithNextLv = [
  { x: 589, y: 333, r: 121, g: 207, b: 12 },
  { x: 388, y: 334, r: 12, g: 167, b: 223 },
  { x: 490, y: 333, r: 12, g: 167, b: 223 },
  { x: 58, y: 334, r: 243, g: 90, b: 28 },
];
var pageWinBountyAndFinish = [
  { x: 607, y: 332, r: 12, g: 167, b: 223 },
  { x: 488, y: 320, r: 25, g: 2, b: 6 },
  { x: 417, y: 319, r: 25, g: 5, b: 6 },
  { x: 74, y: 332, r: 243, g: 90, b: 28 },
];
var pageBattleFinishedWithoutNextLv = [
  { x: 466, y: 324, r: 252, g: 252, b: 252 },
  { x: 464, y: 331, r: 8, g: 166, b: 222 },
  { x: 309, y: 25, r: 228, g: 52, b: 71 },
  { x: 320, y: 25, r: 255, g: 255, b: 132 },
  { x: 330, y: 25, r: 228, g: 52, b: 74 },
  { x: 401, y: 323, r: 26, g: 4, b: 12 },
];
var pageNeedRefillBounties = [
  { x: 428, y: 82, r: 56, g: 167, b: 231 },
  { x: 309, y: 264, r: 0, g: 193, b: 255 },
  { x: 348, y: 254, r: 121, g: 207, b: 12 },
  { x: 318, y: 75, r: 121, g: 126, b: 97 },
  { x: 417, y: 120, r: 243, g: 233, b: 223 },
];
var pageNeedRefillBounties2 = [
  { x: 442, y: 82, r: 57, g: 166, b: 239 },
  { x: 345, y: 252, r: 123, g: 207, b: 8 },
  { x: 399, y: 122, r: 247, g: 235, b: 222 },
  { x: 367, y: 83, r: 57, g: 69, b: 107 },
  { x: 334, y: 76, r: 189, g: 178, b: 165 },
  { x: 317, y: 71, r: 115, g: 117, b: 90 },
  { x: 198, y: 62, r: 115, g: 99, b: 74 },
];

var pageAllianceReward = [
  { x: 397, y: 243, r: 189, g: 150, b: 82 },
  { x: 257, y: 41, r: 19, g: 29, b: 6 },
  { x: 310, y: 22, r: 29, g: 6, b: 8 },
  { x: 374, y: 46, r: 41, g: 45, b: 45 },
  { x: 422, y: 76, r: 12, g: 31, b: 49 },
  { x: 618, y: 20, r: 255, g: 255, b: 255 },
];
var pageAllianceResults = [
  { x: 612, y: 333, r: 8, g: 166, b: 222 },
  { x: 259, y: 57, r: 66, g: 136, b: 202 },
  { x: 329, y: 26, r: 222, g: 48, b: 74 },
  { x: 368, y: 49, r: 198, g: 223, b: 222 },
  { x: 76, y: 336, r: 247, g: 89, b: 24 },
  { x: 188, y: 333, r: 8, g: 166, b: 222 },
];
var pageAllianceResults2 = [
  { x: 310, y: 29, r: 209, g: 39, b: 60 },
  { x: 317, y: 37, r: 48, g: 83, b: 134 },
  { x: 401, y: 67, r: 35, g: 116, b: 192 },
  { x: 371, y: 62, r: 78, g: 134, b: 140 },
  { x: 25, y: 19, r: 241, g: 242, b: 241 },
  { x: 560, y: 333, r: 8, g: 166, b: 222 },
];
var pageAllianceRewardGet = [
  { x: 191, y: 187, r: 49, g: 34, b: 21 },
  { x: 401, y: 213, r: 55, g: 45, b: 27 },
  { x: 175, y: 288, r: 53, g: 53, b: 53 },
];

var pageSelectStartingTeam = [
  { x: 260, y: 29, r: 140, g: 88, b: 230 },
  { x: 160, y: 63, r: 107, g: 101, b: 222 },
  { x: 399, y: 107, r: 255, g: 200, b: 0 },
  { x: 488, y: 306, r: 0, g: 150, b: 214 },
];
var pageSelectNextTeam = [
  { x: 256, y: 34, r: 135, g: 87, b: 223 },
  { x: 172, y: 57, r: 49, g: 32, b: 90 },
  { x: 162, y: 70, r: 107, g: 101, b: 219 },
  { x: 163, y: 119, r: 123, g: 117, b: 227 },
];
var pageKeepBattleByOrderNotCheckWhenStart = [
  { x: 145, y: 311, r: 239, g: 235, b: 239 },
  { x: 135, y: 303, r: 30, g: 19, b: 52 },
  { x: 140, y: 274, r: 49, g: 32, b: 90 },
];
var pageKeepBattleByOrderNotCheck = [
  { x: 146, y: 323, r: 237, g: 233, b: 235 },
  { x: 153, y: 254, r: 49, g: 40, b: 98 },
  { x: 149, y: 270, r: 147, g: 129, b: 235 },
];
var pageBattleTowerOfSweetChaosVictory = [
  { x: 549, y: 322, r: 148, g: 219, b: 57 },
  { x: 222, y: 60, r: 231, g: 182, b: 41 },
  { x: 209, y: 59, r: 38, g: 121, b: 198 },
  { x: 256, y: 59, r: 123, g: 190, b: 255 },
];
var pageCanEquipTopping = [
  {x: 400, y: 266, r: 121, g: 207, b: 12},
  {x: 267, y: 160, r: 233, g: 182, b: 131},
  {x: 294, y: 264, r: 12, g: 167, b: 223},
  {x: 389, y: 162, r: 199, g: 181, b: 170},
];
var pageCanEquipTopping2 = [
  {x: 397, y: 267, r: 123, g: 207, b: 8},
  {x: 277, y: 163, r: 255, g: 255, b: 186},
  {x: 265, y: 165, r: 198, g: 182, b: 173},
  {x: 265, y: 165, r: 198, g: 182, b: 173},
  {x: 252, y: 77, r: 57, g: 69, b: 107},
];
// Mainly in guild alliance
var pageCanEquipTopping3 = [
  {x: 407, y: 275, r: 123, g: 207, b: 8},
  {x: 299, y: 275, r: 8, g: 166, b: 222},
  {x: 276, y: 154, r: 255, g: 251, b: 164},
  {x: 276, y: 159, r: 232, g: 165, b: 96},
  {x: 288, y: 156, r: 226, g: 226, b: 226},
  {x: 262, y: 155, r: 198, g: 182, b: 173},
];

var rfpageBattleVictoryButNeedTap = new RF.Page(
  'rfpageBattleVictoryButNeedTap',
  pageBattleVictoryButNeedTap,
  { x: 230, y: 49 }
);

var rfpageBattleFinished = new RF.Page(
  'rfpageBattleFinished',
  pageBattleFinished,
  { x: 56, y: 331 }
);
var rfpageBattleDefeat = new RF.Page(
  'rfpageBattleDefeat',
  pageBattleDefeat,
  { x: 243, y: 58 }
);
var rfpageDefeatWithGotoKingdom = new RF.Page(
  'rfpageDefeatWithGotoKingdom',
  pageDefeatWithGotoKingdom,
  { x: 81, y: 314 }
);
var rfpageNoArenaTicket = new RF.Page(
  'rfpageNoArenaTicket',
  pageNoArenaTicket,
  { x: 280, y: 250 }
);
var rfpageBattleFinishedWithSunbeds = new RF.Page(
  'rfpageBattleFinishedWithSunbeds',
  pageBattleFinishedWithSunbeds,
  { x: 491, y: 322 }
);
var rfpageIslandSunbedWithWetCookie = new RF.Page(
  'rfpageIslandSunbedWithWetCookie',
  pageIslandSunbedWithWetCookie,
  { x: 218, y: 60 }
);

var rfpageFoundOctopus = new RF.Page(
  'rfpageFoundOctopus',
  pageFoundOctopus,
  { x: 500, y: 330 }
);
var rfpageInKingdomConstructionShop = new RF.Page(
  'rfpageInKingdomConstructionShop',
  pageInKingdomConstructionShop,
  { x: 624, y: 19 }
);
var rfpageKingdomDecorating = new RF.Page(
  'rfpageKingdomDecorating',
  pageKingdomDecorating,
  { x: 619, y: 12 }
);
var rfpageBattleFinishedWithNextLv = new RF.Page(
  'rfpageBattleFinishedWithNextLv',
  pageBattleFinishedWithNextLv,
  { x: 589, y: 333 }
);
var rfpageWinBountyAndFinish = new RF.Page(
  'rfpageWinBountyAndFinish',
  pageWinBountyAndFinish,
  pageWinBountyAndFinish[0]
);
var rfpageBattleFinishedWithoutNextLv = new RF.Page(
  'rfpageBattleFinishedWithoutNextLv',
  pageBattleFinishedWithoutNextLv,
  { x: 466, y: 324 }
);
var rfpageNeedRefillBounties = new RF.Page(
  'rfpageNeedRefillBounties',
  pageNeedRefillBounties,
  { x: 428, y: 82 }
);
var rfpageNeedRefillBounties2 = new RF.Page(
  'rfpageNeedRefillBounties2',
  pageNeedRefillBounties2,
  { x: 442, y: 82 }
);

var rfpageAllianceReward = new RF.Page(
  'rfpageAllianceReward',
  pageAllianceReward,
  { x: 397, y: 243 }
);
var rfpageAllianceResults = new RF.Page(
  'rfpageAllianceResults',
  pageAllianceResults,
  { x: 612, y: 333 }
);
var rfpageAllianceResults2 = new RF.Page(
  'rfpageAllianceResults2',
  pageAllianceResults2,
  { x: 310, y: 29 }
);
var rfpageAllianceRewardGet = new RF.Page(
  'rfpageAllianceRewardGet',
  pageAllianceRewardGet,
  { x: 191, y: 187 }
);

var rfpageSelectStartingTeam = new RF.Page(
  'rfpageSelectStartingTeam',
  pageSelectStartingTeam,
  { x: 260, y: 29 }
);
var rfpageSelectNextTeam = new RF.Page(
  'rfpageSelectNextTeam',
  pageSelectNextTeam,
  pageSelectNextTeam[0]
);
var rfpageKeepBattleByOrderNotCheckWhenStart = new RF.Page(
  'rfpageKeepBattleByOrderNotCheckWhenStart',
  pageKeepBattleByOrderNotCheckWhenStart,
  pageKeepBattleByOrderNotCheckWhenStart[0]
);
var rfpageKeepBattleByOrderNotCheck = new RF.Page(
  'rfpageKeepBattleByOrderNotCheck',
  pageKeepBattleByOrderNotCheck,
  pageKeepBattleByOrderNotCheck[0]
);
var rfpageBattleTowerOfSweetChaosVictory = new RF.Page(
  'rfpageBattleTowerOfSweetChaosVictory',
  pageBattleTowerOfSweetChaosVictory,
  pageBattleTowerOfSweetChaosVictory[0]
);
var rfpageCanEquipTopping = new RF.Page(
  'rfpageCanEquipTopping',
  pageCanEquipTopping,
  pageCanEquipTopping[0]
);
var rfpageCanEquipTopping2 = new RF.Page(
  'rfpageCanEquipTopping2',
  pageCanEquipTopping2,
  pageCanEquipTopping2[0]
);
var rfpageCanEquipTopping3 = new RF.Page(
  'rfpageCanEquipTopping3',
  pageCanEquipTopping3,
  pageCanEquipTopping3[0]
);

var groupPageBattle = new RF.GroupPage('groupPageBattle', [
  rfpageBattleVictoryButNeedTap,
  rfpageBattleFinished,
  rfpageBattleDefeat,
  rfpageDefeatWithGotoKingdom,
  rfpageNoArenaTicket,
  rfpagePvPCrystaisRefresh,
  rfpageBattleFinishedWithSunbeds,
  rfpageIslandSunbedWithWetCookie,
  rfpageFoundOctopus,
  rfpageInKingdomConstructionShop,
  rfpageKingdomDecorating,
  rfpageBattleFinishedWithNextLv,
  rfpageWinBountyAndFinish,
  rfpageBattleFinishedWithoutNextLv,
  rfpageNeedRefillBounties,
  rfpageNeedRefillBounties2,
  rfpageDragonRemainHealth,
  rfpageDragonTotalDamage,
  rfpageRedValvetDragonWon,
  rfpageDragonHasExtraTime,
  rfpageAllianceReward,
  rfpageAllianceResults,
  rfpageAllianceResults2,
  rfpageAllianceRewardGet,
  rfpageSelectStartingTeam,
  rfpageSelectNextTeam,
  rfpageKeepBattleByOrderNotCheckWhenStart,
  rfpageKeepBattleByOrderNotCheck,
  rfpageBattleTowerOfSweetChaosVictory,
  rfpageCanEquipTopping,
  rfpageCanEquipTopping2,
  rfpageCanEquipTopping3,
  rfpageInGacha,
  rfpageInKingdomVillage,
  rfpageAutoUseSkillEnabled,
  rfpageSpeedBoostEnabled,
  rfpageSpeed1x,
  rfpageSpeed1_2x,
]);

function waitForBattle(battleName, waitTimeInSecs, needToCheckAutoUseSkill, pageExitBattle) {
  console.log('Battling for: ', battleName);

  if (needToCheckAutoUseSkill === undefined) {
    needToCheckAutoUseSkill = false;
  }

  if (pageExitBattle !== undefined) {
    groupPageBattle.pages.push(new RF.Page(
      'rfpageExitBattle',
      pageExitBattle,
      pageExitBattle[0]
    ))
  }

  var autoUseSkillCheckedCnt = 0;
  var speedBoostCheckedCnt = 0;
  var loggingCnt = 0;
  for (var j = 0; j < waitTimeInSecs && config.run; j++) {
    var matchedPages = groupPageBattle.isMatchScreen(this.screen);
    console.log('matchedPages at', j,':', matchedPages)

    if (matchedPages.indexOf('rfpageInGacha') !== -1) {
      console.log('Found in gacha page, finish auto battle: ', battleName);
      rfpageInGacha.goNext(this.screen);
      handleGotoKingdomPage();
      return false;
    }
    if (matchedPages.indexOf('rfpageInKingdomVillage') !== -1) {
      console.log('battle lead to kingdom, return false');
      return false;
    }
    if (matchedPages.indexOf('rfpageKingdomDecorating') !== -1) {
      console.log('Found in rfpageKingdomDecorating page, finish waitForBattle');
      rfpageKingdomDecorating.goNext(this.screen);
      handleGotoKingdomPage();
      return false;
    }
    if (matchedPages.indexOf('rfpageInKingdomConstructionShop') !== -1) {
      console.log('Found rfpageInKingdomConstructionShop, exit');
      rfpageInKingdomConstructionShop.goNext(this.screen);
      return false;
    }
    if (matchedPages.indexOf('rfpageCanEquipTopping') !== -1) {
      console.log('Found rfpageCanEquipTopping, tap OK and wait for 5 secs');
      rfpageCanEquipTopping.goNext(this.screen);
      sleep(5000);
    } else if (matchedPages.indexOf('rfpageCanEquipTopping2') !== -1) {
      console.log('Found rfpageCanEquipTopping2, tap OK and wait for 5 secs');
      rfpageCanEquipTopping2.goNext(this.screen);
      sleep(5000);
    }
    else if (matchedPages.indexOf('rfpageCanEquipTopping3') !== -1) {
      console.log('Found rfpageCanEquipTopping3, tap OK and wait for 5 secs');
      rfpageCanEquipTopping3.goNext(this.screen);
      sleep(5000);
    }

    if (matchedPages.indexOf('rfpageBattleVictoryButNeedTap') !== -1) {
      console.log('rfpageBattleVictoryButNeedTap: ', battleName, j);
      qTap(pnt(321, 345));
      sleep(2000);
      j += 2;
    }

    if (matchedPages.indexOf('rfpageExitBattle') !== -1) {
      console.log('Battle successfully finished, return');
      // qTap(pnt(306, 326));
      return true;
    }

    if (matchedPages.indexOf('rfpageBattleFinished') !== -1) {
      console.log('Battle success: ', battleName, j, 'secs');
      qTap(pnt(616, 323));
      sleep(2000);
      j += 2;
    } else if (matchedPages.indexOf('rfpageBattleDefeat') !== -1) {
      console.log('Battle finished, lost: ', battleName, j, 'secs');
      qTap(pnt(616, 323));
      sleep(2000);
      j += 2;
    } else if (matchedPages.indexOf('rfpageDefeatWithGotoKingdom') !== -1) {
      console.log('failed (defeated) with goto kingdom, stop battle: ', battleName, j);
      rfpageDefeatWithGotoKingdom.goNext(this.screen);
      sleep(1500);
      return false;
    }

    // PVP finish condition
    // pvp will tap(320, 350, 100)
    if (battleName === 'pvp') {
      if (matchedPages.indexOf('rfpageNoArenaTicket') !== -1) {
        console.log('No arena ticket, finish auto pvp');
        rfpageNoArenaTicket.goNext(this.screen);
        sleep(config.sleepAnimate);
        return false;
      } else if (matchedPages.indexOf('rfpagePvPCrystaisRefresh') !== -1) {
        console.log('rfpagePvPCrystaisRefresh');
        rfpagePvPCrystaisRefresh.goNext(this.screen); // X cancel
        sleep(1500);
        return false;
      }
    }

    // Island battle finish condition
    if (battleName === 'islandRedsword') {
      if (matchedPages.indexOf('rfpageFoundOctopus') !== -1) {
        console.log('Island battle found octopus, exit');
        rfpageFoundOctopus.goNext(this.screen);
        sleep(1500);
        return true;
      } else if (matchedPages.indexOf('rfpageBattleFinishedWithSunbeds') !== -1) {
        console.log('failed to clear the sword (rfpageBattleFinishedWithSunbeds), stop battle in islands');
        rfpageBattleFinishedWithSunbeds.goNext(this.screen);
        sleep(1500);
        return false;
      } else if (matchedPages.indexOf('rfpageIslandSunbedWithWetCookie') !== -1) {
        console.log('failed to clear the sword (pageIslandSunbedWithWetCookie), stop battle in islands');
        keycode('BACK', 1000);
        sleep(1500);
        return false;
      }
    }

    // Bounty finish condition
    if (battleName === 'bounty') {
      if (matchedPages.indexOf('rfpageNeedRefillBounties') !== -1 || matchedPages.indexOf('rfpageNeedRefillBounties2') !== -1) {
        console.log('No bounties left, return to kingdom');
        sendEvent('running', 'finish bounties');
        return false;
      } else if (matchedPages.indexOf('rfpageBattleFinishedWithoutNextLv') !== -1) {
        console.log('Win bounty with pageBattleFinishedWithoutNextLv and (can only) tap retry');
        rfpageBattleFinishedWithoutNextLv.goNext(this.screen);
        sleep(2000);
        return true;
      } else if (matchedPages.indexOf('rfpageBattleFinishedWithNextLv') !== -1) {
        if (config.autoBountiesCheckBluePowder) {
          console.log('Win bounty but stay in this level for blue powder');
          qTap(pnt(387, 322))
        }
        else {
          console.log('Win bounty and goto next level');
          rfpageBattleFinishedWithNextLv.goNext(this.screen);
        }
        sleep(2000);
        return true;
      } else if (matchedPages.indexOf('rfpageWinBountyAndFinish') !== -1) {
        console.log('Successfully cleared bounties');
        rfpageWinBountyAndFinish.goNext(this.screen);
        sleep(2000);
        return true;
      }
    }

    // Guild alliance battle handle reward
    if (battleName === 'alliance') {
      if (matchedPages.indexOf('rfpageAllianceReward') !== -1) {
        console.log('Open 2nd reward with ticket, and tap middle');
        rfpageAllianceReward.goNext(this.screen);
        sleep(config.sleepAnimate * 3);

        if (waitUntilSeePage(pageAllianceResults, 6, pnt(323, 337))) {
          console.log('pageAllianceResults, exit', j);
          qTap(pageAllianceResults);
          sleep(config.sleepAnimate * 3);
          return true;
        }

        if (checkIsPage(pageAllianceReward)) {
          console.log('Not enough ticket for 2nd reward, skipping');
          qTap(pnt(619, 21)); // close icon
        }
      } else if (matchedPages.indexOf('rfpageAllianceResults') !== -1) {
        console.log('rfpageAllianceResults, exit', j);
        qTap(pageAllianceResults);
        sleep(config.sleepAnimate * 3);
        return true;
      } else if (matchedPages.indexOf('rfpageAllianceResults2') !== -1) {
        console.log('pageAllianceResults2, exit', j);
        qTap(pnt(600, 320));
        sleep(config.sleepAnimate * 3);
        return true;
      } else if (matchedPages.indexOf('rfpageAllianceRewardGet') !== -1) {
        console.log('rfpageAllianceRewardGet, tap middle');
        qTap(pnt(323, 337));
      }
    }

    if (battleName === 'guildDragon') {
      if (matchedPages.indexOf('rfpageDragonRemainHealth') !== -1) {
        qTap(pnt(320, 336));
        sleep(1000);
        j++;
      }
      if (matchedPages.indexOf('rfpageDragonTotalDamage') !== -1) {
        qTap(pnt(320, 336));
        sleep(1000);
        j++;
      }
      if (matchedPages.indexOf('rfpageDragonHasExtraTime') !== -1) {
        console.log('rfpageDragonHasExtraTime found, build battle has extra time, tap continue fighting');
        rfpageDragonHasExtraTime.goNext(this.screen);
        sleep(5000);
        j += 5;
      }
      if (matchedPages.indexOf('rfpageRedValvetDragonWon') !== -1) {
        if (waitUntilSeePage(pageReadyToFightDragon, 5, pnt(320, 336))) {
          console.log('Successfully back to pageReadyToFightDragon, finish waitForBattle');
          return true;
        }
      }
    }

    if (battleName === 'TowerOfSweetChaos') {
      if (matchedPages.indexOf('rfpageBattleTowerOfSweetChaosVictory') !== -1) {
        console.log('ToSC victory, tap next (pageBattleTowerOfSweetChaosVictory)');
        rfpageBattleTowerOfSweetChaosVictory.goNext(this.screen);
        sleep(1500);
        return true;
      }

      // TODO: might need to handle failed cases
    }

    if (needToCheckAutoUseSkill) {
      if (matchedPages.indexOf('rfpageAutoUseSkillEnabled') !== -1) {
        autoUseSkillCheckedCnt++;
      } else if (autoUseSkillCheckedCnt < 5 && matchedPages.indexOf('rfpageAutoUseSkillEnabled') === -1) {
        console.log(battleName, 'battle skill not enabled, enable it');
        rfpageAutoUseSkillEnabled.goNext(this.screen);
        sleep(3000);
        j += 3;
        // autoUseSkillCheckedCnt++;
      }
    }

    if (matchedPages.indexOf('rfpageSpeedBoostEnabled') !== -1) {
      speedBoostCheckedCnt++;
    }
    if (speedBoostCheckedCnt < 5 && !checkIsPage(pageSpeedBoostEnabled)) {
      if (checkIsPage(pageSpeed1x)) {
        console.log(battleName, 'tap speed boost as its 1x');
        qTap(pageSpeedBoostEnabled);
        sleep(3000);
        qTap(pageSpeedBoostEnabled);
        sleep(2000);
        j += 5;
      }
      if (checkIsPage(pageSpeed1_2x)) {
        console.log(battleName, 'tap speed boost as its 1.2x');
        qTap(pageSpeedBoostEnabled);
        sleep(2000);
        j += 2;
      }
    }

    if (checkIsPage(pageSelectNextTeam) && checkIsPage(pageKeepBattleByOrderNotCheck)) {
      qTap(pageKeepBattleByOrderNotCheck);
      sleep(8000);
      console.log('alliance battle, tap keep battle with this order');
    }

    if (j - loggingCnt > 20) {
      if (!checkAndRestartApp()) {
        console.log('Game crashed during battle, leaving waitForBattle loop');
        return false;
      }

      console.log('In ', battleName, ' for ', j, '/', waitTimeInSecs, 'secs, time: ', new Date().toLocaleString());
      sendEvent('running', '');
      loggingCnt = j;
    }

    sleep(1000);
  }

  console.log('Battle reach time limit but does not seems finished: ', battleName);

  var pageBattlePauseAndExit = [
    {x: 362, y: 202, r: 245, g: 89, b: 24},
    {x: 373, y: 148, r: 8, g: 165, b: 219},
    {x: 611, y: 28, r: 255, g: 255, b: 255},
    {x: 604, y: 24, r: 57, g: 165, b: 227},
  ]
  if (battleName === 'alliance') {
    console.log('Quitting alliance battle for waitForBattle()');
    qTap(pnt(616, 17));
    if (waitUntilSeePage(pageBattlePauseAndExit, 6))
    {
      qTap(pageBattlePauseAndExit);
      sleep(config.sleepAnimate);
      handleTryHitBackToKingdom();
    }
  }
  return false;
}

function handleGuildCheckinAndBattle() {
  if (!checkIsPage(pageInGuildLand)) {
    handleGotoKingdomPage();

    if (checkIsPage(pageInkingdomCanGotoGuild)) {
      waitUntilSeePage(pageInGuildLand, 18, pageInkingdomCanGotoGuild);
    }
  }

  return handleInGuildPage();
}

function tryExpandGuildLand(icon) {
  var pageDonateGuildTool = [
    { x: 417, y: 35, r: 57, g: 69, b: 107 },
    { x: 421, y: 156, r: 63, g: 204, b: 0 },
    { x: 351, y: 253, r: 123, g: 207, b: 8 },
    { x: 428, y: 287, r: 57, g: 69, b: 107 },
  ];
  var pageCanExpand = [
    { x: 291, y: 270, r: 123, g: 207, b: 8 },
    { x: 350, y: 271, r: 123, g: 207, b: 8 },
  ];
  var pageAlreadySendMax = [
    { x: 441, y: 32, r: 57, g: 166, b: 231 },
    { x: 424, y: 156, r: 63, g: 204, b: 0 },
    { x: 306, y: 136, r: 255, g: 0, b: 0 },
    { x: 329, y: 137, r: 254, g: 23, b: 22 },
    { x: 338, y: 138, r: 247, g: 235, b: 222 },
  ];

  var foundResults = findSpecificImageInScreen(icon, 0.94, true);
  if (foundResults.length > 0) {
    console.log('Found guild expand icons: ', JSON.stringify(foundResults));
    qTap(pnt(foundResults[0].x + 10, foundResults[0].y + 10));
    sleep(2000);

    if (checkIsPage(pageCanExpand)) {
      qTap(pageCanExpand);
      sleep(config.sleepAnimate * 2);

      if (checkIsPage(pageAlreadySendMax)) {
        console.log('already send max, exit');
        qTap(pageAlreadySendMax);
        waitUntilSeePage(pageInGuildLand, 2);
        return true;
      }

      if (checkIsPage(pageDonateGuildTool)) {
        qTap(pnt(422, 158)); // Max icon
        sleep(config.sleepAnimate);
        qTap(pnt(347, 252)); // Send icon
        sleep(config.sleepAnimate);

        if (waitUntilSeePage(pageInGuildLand, 2)) {
          console.log('Successfully donated guild land');
          return true;
        }
      }
    }
  }
  return false;
}

function handleInGuildPage() {
  if (!checkIsPage(pageInGuildLand)) {
    console.log('skipping handleInGuildPage as cannot find pageInGuildLand');
    return false;
  }

  var pageInputGuildWelcomeText = [
    { x: 434, y: 105, r: 57, g: 166, b: 231 },
    { x: 420, y: 107, r: 57, g: 69, b: 107 },
    { x: 439, y: 209, r: 247, g: 235, b: 222 },
    { x: 438, y: 235, r: 222, g: 207, b: 198 },
    { x: 358, y: 240, r: 123, g: 207, b: 8 },
    { x: 28, y: 272, r: 86, g: 86, b: 89 },
    { x: 26, y: 321, r: 76, g: 76, b: 76 },
    { x: 160, y: 326, r: 25, g: 3, b: 9 },
  ];
  var pageInGuildBeacon = [
    { x: 270, y: 194, r: 110, g: 105, b: 224 },
    { x: 224, y: 207, r: 99, g: 75, b: 185 },
    { x: 225, y: 255, r: 115, g: 113, b: 185 },
    { x: 187, y: 216, r: 190, g: 208, b: 241 },
  ];
  var pageInGuildBeacon2 = [
    { x: 214, y: 190, r: 102, g: 74, b: 181 },
    { x: 182, y: 196, r: 197, g: 218, b: 230 },
    { x: 240, y: 230, r: 241, g: 245, b: 249 },
    { x: 227, y: 233, r: 131, g: 130, b: 205 },
  ];

  var i = 0;
  console.log('tap fire 6 times to checkin');
  for (i = 0; i < 6; i++) {
    qTap(pnt(312, 180));
    sleep(1000);

    if (checkIsPage(pageInputGuildWelcomeText)) {
      qTap(pageInputGuildWelcomeText);
      sleep(500);
    }

    if (waitUntilSeePage(pageInGuildBeacon, 2)) {
      qTap(pnt(600, 21));
      sleep(2000);
      break;
    } else if (waitUntilSeePage(pageInGuildBeacon2, 2)) {
      qTap(pnt(600, 21));
      sleep(2000);
      break;
    }
  }

  // Claim land ===========
  var guildDirections = [Directions.S, Directions.E, Directions.S, Directions.E];
  if (config.autoGuildClaimNewLand && waitUntilSeePage(pageInGuildLand, 2)) {
    console.log('about to expand the guild land');
    for (i = 0; i < guildDirections.length; i++) {
      swipeDirection(guildDirections[i], false, pageInGuildLand);

      if (tryExpandGuildLand(guildExpandLandPlusSelected)) {
        console.log('Successfully sent selected tools: ', i);
        break;
      } else if (tryExpandGuildLand(guildExpandLandPlus)) {
        console.log('Successfully sent NOT selected tools: ', i);
        break;
      }
    }
    sleep(1000);
  }

  handleGotoKingdomPage();
}

var guildBossesEntryPoints = {
  left: { x: 113, y: 202, r: 123, g: 207, b: 8 },
  middle: { x: 312, y: 205, r: 123, g: 207, b: 8 },
  right: { x: 505, y: 204, r: 123, g: 207, b: 8 },
};
var pageInGuildBattleGuide = [
  { x: 225, y: 20, r: 13, g: 15, b: 42 },
  { x: 318, y: 18, r: 33, g: 75, b: 86 },
  { x: 405, y: 19, r: 86, g: 70, b: 0 },
];
function handleGuildBattleDragon() {
  // Old users does not have config.autoGuildBattleDragon key (Feb 7, 2022)
  if (config.autoGuildBattleDragon === undefined || config.autoGuildBattleDragon) {
    console.log('about to guildBattleDragon');
    handleGotoAdventure(Advantures.guild, pageBattleDragon);

    console.log('about to start handleGuildBattleDragon, send running');
    sendEvent('running', '');

    // To avoid trapped by cream puff cookie guide
    for (var i = 0; i < 12; i++) {
      if (checkIsPage(pageInGuildBattleGuide)) {
        qTap(pnt(166, 19));
        sleep(1000);
      } else {
        break;
      }
    }

    waitUntilSeePage(pageBattleDragon, 6, pnt(300, 312)); // tapping middle low to pass enemy defeated animate
    if (checkIsPage(pageNoMoreDragonToFight)) {
      console.log('No more dragon to fight, skipping');
      return true;
    }

    for (var bossIdx in guildBossesEntryPoints) {
      console.log('Try to fight:', bossIdx);

      var bossEntryPoint = guildBossesEntryPoints[bossIdx];
      qTap(bossEntryPoint);
      if (waitUntilSeePage(pageReadyToFightDragon, 6)) {
        qTap(pageReadyToFightDragon); // Tap BATTLE! to start
        // qTap(pnt(386, 256));  // Tap practice
        sleep(6000);
        if (checkIsPage(pageDragonAddMoreCookie)) {
          console.log('Found need to add more cookie to dragon fight, skipping');
          handleGotoKingdomPage();
          return false;
        }

        if (checkIsPage(pageReadyToFightDragon)) {
          console.log('Still in dragon battle page, we run out of tickets, skipping');
          handleGotoKingdomPage();
          return false;
        }

        if (waitForBattle('guildDragon', 180, true, pageBattleDragon)) {
          console.log('battle dragon finished, go back to kingdom');
        } else {
          console.log('Finish pageCookieAlliance due to battle return false');
        }
      }

      if (!checkIsPage(pageBattleDragon)) {
        handleGotoAdventure(Advantures.guild, pageBattleDragon);
      }
    }

    handleGotoKingdomPage();
  }
}

function handleGuildBattleAlliance() {
  var pageNoAllianceTicket = [
    { x: 244, y: 252, r: 49, g: 190, b: 231 },
    { x: 327, y: 77, r: 156, g: 144, b: 217 },
    { x: 317, y: 100, r: 244, g: 235, b: 231 },
    { x: 355, y: 256, r: 0, g: 198, b: 255 },
    { x: 334, y: 22, r: 85, g: 80, b: 109 },
  ];
  var pageAllianceSteupTeam = [
    { x: 619, y: 18, r: 255, g: 255, b: 255 },
    { x: 606, y: 90, r: 247, g: 89, b: 24 },
    { x: 603, y: 112, r: 123, g: 207, b: 8 },
    { x: 608, y: 139, r: 0, g: 150, b: 214 },
    { x: 610, y: 168, r: 0, g: 150, b: 214 },
    { x: 507, y: 129, r: 134, g: 17, b: 158 },
  ];
  var pageAllianceBeaconIsOff = [
    { x: 215, y: 198, r: 94, g: 102, b: 153 },
    { x: 202, y: 201, r: 209, g: 226, b: 248 },
    { x: 209, y: 198, r: 99, g: 109, b: 156 },
  ];
  var pageBeaconOfValor = [
    { x: 223, y: 300, r: 255, g: 187, b: 8 },
    { x: 178, y: 288, r: 49, g: 60, b: 90 },
    { x: 196, y: 177, r: 49, g: 40, b: 8 },
    { x: 182, y: 168, r: 190, g: 192, b: 208 },
    { x: 183, y: 87, r: 247, g: 198, b: 159 },
    { x: 464, y: 22, r: 57, g: 166, b: 231 },
    { x: 487, y: 246, r: 88, g: 104, b: 156 },
  ];
  var pageCannotLightBeacon = [
    { x: 436, y: 284, r: 0, g: 134, b: 189 },
    { x: 261, y: 112, r: 114, g: 80, b: 44 },
    { x: 261, y: 226, r: 118, g: 82, b: 50 },
    { x: 250, y: 192, r: 83, g: 87, b: 104 },
    { x: 197, y: 104, r: 107, g: 142, b: 198 },
  ];
  var pageAllianceTimeJump = [
    {x: 358, y: 277, r: 123, g: 207, b: 8},
    {x: 393, y: 281, r: 189, g: 170, b: 214},
    {x: 318, y: 32, r: 182, g: 129, b: 37},
  ]
  var pageAllianceAddMoreCookie = [
    { x: 304, y: 251, r: 8, g: 166, b: 222 },
    { x: 248, y: 102, r: 57, g: 69, b: 107 },
    { x: 341, y: 11, r: 25, g: 36, b: 54 },
    { x: 480, y: 320, r: 23, g: 34, b: 9 },
    { x: 497, y: 320, r: 35, g: 29, b: 35 },
  ];
  var pageLightBeaconReminder = [
    { x: 301, y: 250, r: 8, g: 166, b: 222 },
    { x: 403, y: 248, r: 123, g: 207, b: 8 },
    { x: 333, y: 19, r: 49, g: 38, b: 75 },
    { x: 187, y: 166, r: 104, g: 111, b: 122 },
  ];

  if (!config.autoGuildAllianceBattle) {
    return;
  }

  console.log('start guild alliance battle: ', config.autoGuildAllianceBattle, checkIsPage(pageInGuildLand));
  handleGotoAdventure(Advantures.cookieAlliance, pageCookieAlliance);
  if (!checkIsPage(pageCookieAlliance)) {
    console.log('failed to goto pageCookieAlliance, skipping');
    handleGotoKingdomPage();
    return;
  }

  console.log('about to start handleGuildBattleAlliance, send running');
  sendEvent('running', '');

  if (waitUntilSeePage(pageCookieAlliance, 6)) {

    // check beacon
    if (checkIsPage(pageAllianceBeaconIsOff)) {
      qTap(pageAllianceBeaconIsOff);

      if (waitUntilSeePage(pageBeaconOfValor, 4)) {
        qTap(pnt(191, 294)); // 7D
        sleep(config.sleepAnimate);
        qTap(pageBeaconOfValor);
        sleep(config.sleepAnimate * 2);
      }

      if (waitUntilSeePage(pageCannotLightBeacon, 4)) {
        keycode('BACK', 1000);
        sleep(config.sleepAnimate);
      }

      for (var i = 0; i < 5; i++) {
        if (waitUntilSeePage(pageCookieAlliance, 3)) {
          break;
        }
        keycode('BACK', 1000);
        console.log('tap back to pageCookieAlliance: ', i);
      }
    }


    if (config.autoAllianceUseTimeJumpers) {
      console.log('Use time jumpers during guild alliance');
      qTap(pnt(477, 322));

      if (!waitUntilSeePagesCheckDelay(pageCookieAlliance, [pageAllianceTimeJump], 6)) {
        console.log('Failed to find pageAllianceTimeJump, skipping alliance battle');
        handleGotoKingdomPage()
        return false;
      }

      qTap(pnt(420, 180));
      sleep(config.sleepAnimate);
      qTap(pnt(360, 280));
      sleep(2000);
      if (waitUntilSeePagesCheckDelay(pageAllianceTimeJump, [pageCookieAlliance], 8, undefined, undefined, 1, pnt(360, 280))) {
        console.log('Successfully time jump the cookie alliance');
        handleGotoKingdomPage()
        return true
      }
      console.log('Attemp to cookie alliance but failed, skipping');
      handleGotoKingdomPage()
      return false;
    }

    for (var j = 0; j < 5; j++) {
      qTap(pnt(578, 320)); // Battle alliance
      sleep(3000);

      if (checkIsPage(pageNoAllianceTicket)) {
        console.log('Not enough alliance ticket, skipping');
        qTap(pageNoAllianceTicket);
        sleep(1500);
        keycode('BACK', 1000);
        sleep(1500);
        break;
      }

      if (checkIsPage(pageAllianceAddMoreCookie)) {
        console.log('Not enough cookie to fight alliance, skipping');
        qTap(pageAllianceAddMoreCookie);
        sleep(1500);
        keycode('BACK', 1000);
        sleep(1500);
        break;
      }

      if (checkIsPage(pageAllianceSteupTeam)) {
        console.log('got into team setup page, skip alliance');
        break;
      }

      if (checkIsPage(pageLightBeaconReminder)) {
        console.log('Need to light the beacon, found pageLightBeaconReminder');
        qTap(pageLightBeaconReminder);
        sleep(config.sleepAnimate);

      }

      if (waitUntilSeePage(pageSelectStartingTeam, 4)) {
        if (checkIsPage(pageKeepBattleByOrderNotCheckWhenStart)) {
          qTap(pageKeepBattleByOrderNotCheckWhenStart);
          sleep(1000);
          console.log('alliance battle, tap keep battle with this order');
        }

        for (var tapY = 73; tapY < 296; tapY += 50) {
          qTap(pnt(474, tapY)); // tap the top most available team
          sleep(1500);
        }
      }

      if (rfpageCanEquipTopping.isMatchScreen(this.screen)) {
        console.log('Found rfpageCanEquipTopping, tap OK and wait for 5 secs');
        rfpageCanEquipTopping.goNext(this.screen);
        sleep(5000);
      } else if (rfpageCanEquipTopping2.isMatchScreen(this.screen)) {
        console.log('Found rfpageCanEquipTopping2, tap OK and wait for 5 secs');
        rfpageCanEquipTopping2.goNext(this.screen);
        sleep(5000);
      }

      if (waitForBattle('alliance', 1800, false, pageCookieAlliance)) {
        console.log('pageCookieAlliance battle finished, wait at most 15 secs and try next one');
        waitUntilSeePage(pageCookieAlliance, 15);
        continue;
      } else {
        console.log('Finish pageCookieAlliance due to battle return false');
        break;
      }
    }

    handleGotoKingdomPage();
  }
}

var bountyLevelX = 20;
var bountyLevelYRange = [60, 84, 119, 158, 190, 230, 260, 296, 333];
function countBountyLevel() {
  for (var j = 0; j < bountyLevelYRange.length; j++) {
    if (checkIsPage([{ x: bountyLevelX, y: bountyLevelYRange[j], r: 205, g: 66, b: 36 }])) {
      return j + 4; // first one in list is Lv.4
    }
  }
  return -1;
}

function bountyCheckIfGetBluePowder() {
  if (!checkIsPage(pageInOneOfTheBounty)) {
    return [-1, -1];
  }

  console.log('About to check blue powder')

  var lastPowder = ocrMaterialStorage(454, 10, 50, 18);
  var bountyLevel = countBountyLevel();

  if (bountyLevel > 6) {
    qTap(pnt(40, 135));
    sleep(config.sleepAnimate*2);

    var bluePower = ocrMaterialStorage(454, 10, 50, 18);

    console.log('Check if we need to get blue powder: ', bluePower, lastPowder);
    if (bluePower < lastPowder && bluePower < 350) {
      return [bluePower, 6];
    }
  }

  for (var j = 0; j < bountyLevelYRange.length; j++) {
    qTap(pnt({ x: bountyLevelX, y: bountyLevelYRange[j] }))
    sleep(config.sleep)
  }
  return [lastPowder, bountyLevel];
}

function handleBounties() {
  if (!checkIsPage(pageInOneOfTheBounty)) {
    handleGotoAdventure(Advantures.bounties, pageInBounties);
    if (!checkIsPage(pageInBounties)) {
      console.log('failed to goto bounties, skipping');
      handleGotoKingdomPage();
      return;
    }

    var foundResults = findSpecificImageInScreen(bountiesGreenEnter, 0.97);
    foundResults.sort(dynamicSort('x'));

    var bountyCount = foundResults.length;
    if (foundResults.length > 2) {
      bountyCount = 4;
    }

    if (foundResults.length > 0 ){
      var bountyEntryPnt = pnt(foundResults[0].x + 40, foundResults[0].y + 10);
      qTap(bountyEntryPnt);
    }
    if (waitUntilSeePage(pageInOneOfTheBounty, 4)) {
      console.log('Found pageInOneOfTheBounty, starting handleBounties');
    } else {
      console.log('Cannot find pageInOneOfTheBounty, skipping handleBounties');
      return false;
    }
  } else {
    bountyCount = 4;
  }

  console.log('about to start handleBounties, send running');
  sendEvent('running', '');
  var i = 0;

  var bounties = [];
  for (var bountyIdx = 0; bountyIdx < bountyCount; bountyIdx++) {
    // When there are only one bounty (Sunday), it gets all types of powder thus nothing to OCR
    var powder = bountyCount === 1 ? 0 : ocrMaterialStorage(454, 10, 50, 18);
    var bountyLevel = bountyCount === 1 ? 12 : countBountyLevel();

    if (bountyCount !== 1 && config.autoBountiesCheckBluePowder) {
      var rtn = bountyCheckIfGetBluePowder();
      powder = rtn[0];
      bountyLevel = rtn[1];
    }

    if (powder !== -1) {
      bounties.push({
        index: bountyIdx,
        entryPnt: bountyEntryPnt,
        powderStock: powder,
        level: bountyLevel,
      });
    }

    // Goto right bounty
    qTap(pnt(435, 178));
    sleep(1500);
  }

  bounties.sort(dynamicSort('level'));
  // console.log('sorted level bounties: ', JSON.stringify(bounties, ['index', 'level', 'powderStock']));

  bounties = bounties.filter(function (bounty) {
    return bounty.level === bounties[0].level;
  });
  bounties.sort(dynamicSort('powderStock'));
  console.log('sorted & filtered level bounties: ', JSON.stringify(bounties, ['index', 'level', 'powderStock']));

  if (bounties.length === 0) {
    console.log('No bounties can be run, skipping, bounties: ', JSON.stringify(bounties));
    return handleGotoKingdomPage();
  }

  var targetBounty = bounties[0];
  for (i = 0; i < bountyCount; i++) {
    if (targetBounty['level'] === 6) {
      qTap(pnt(40, 135));
      sleep(config.sleepAnimate*2);
    }
    var gotBountyLevel = countBountyLevel();
    var gotMaterialStock = bountyCount === 1 ? 0 : ocrMaterialStorage(454, 10, 50, 18);
    if (gotBountyLevel === targetBounty.level && gotMaterialStock === targetBounty.powderStock) {
      console.log('found it, level, stock: ', gotBountyLevel, gotMaterialStock);
      break;
    } else {
      console.log(
        'wrong: ',
        gotBountyLevel,
        gotMaterialStock,
        gotBountyLevel === targetBounty.level,
        gotMaterialStock === targetBounty.powderStock
      );
      qTap(pnt(435, 178)); // check next one
      sleep(1500);
    }
  }

  for (i = 0; i < 5; i++) {
    sendEvent('running', '');
    qTap(pnt(530, 330));
    sleep(1500);
    qTap(pnt(530, 330));
    sleep(1500);
    qTap(pnt(530, 330));
    sleep(1500);

    if (checkIsPage(pageNeedRefillBounty)){
      console.log("Found pageNeedRefillBounty, cannot battle bounty as no more runs left");
      qTap(pageNeedRefillBounty);
      sleep(config.sleepAnimate);
      handleTryHitBackToKingdom();
      return false;
    }

    if (checkIsPage(pageCannotRefillBountyAnymore)) {
      console.log("Found pageCannotRefillBountyAnymore, cannot battle bounty as no more runs left");
      qTap(pageCannotRefillBountyAnymore);
      sleep(config.sleepAnimate);
      handleTryHitBackToKingdom();
      return false;
    }

    if (waitForBattle('bounty', 180, true, pageInOneOfTheBounty)) {
      console.log('pageInBounties battle finished, try next one');
      continue;
    } else {
      console.log('Finish pageInBounties due to battle return false');
      break;
    }
  }

  handleGotoKingdomPage();
  return true;
}

function handleGotoGnomeLab() {
  console.log('try to handleGotoGnomeLab');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
  }

  var pageLabCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
  ];
  var pageLabUncollapsed = [
    { x: 104, y: 145, r: 255, g: 255, b: 255 },
    { x: 97, y: 143, r: 206, g: 12, b: 24 },
    { x: 96, y: 163, r: 255, g: 223, b: 247 },
    { x: 87, y: 158, r: 57, g: 93, b: 132 },
  ];
  if (checkIsPage(pageLabCollapsed)) {
    qTap(pageLabCollapsed);
    sleep(config.sleepAnimate * 4);
  }

  if (checkIsPage(pageLabUncollapsed)) {
    qTap(pageLabUncollapsed);
    sleep(config.sleepAnimate * 2);

    handleInGnomeLab();
  } else {
    console.log('Cannot find gnome lab, skipping');
  }
  handleGotoKingdomPage();
}

function handleInGnomeLab() {
  if (!waitUntilSeePage(pageInGnomeLab, 8)) {
    console.log('skipping handleInGnomeLab as cannot find pageInGnomeLab');
    return false;
  }

  console.log('handleInGnomeLab in gnome lab, send running');
  sendEvent('running', '');

  if (checkIsPage(pageAlreadyResearching)) {
    console.log('Already researching, skipping handleInGnomeLab');
    return true;
  }

  var researching = false;
  if (config.autoResearchKingdom) {
    qTap(pnt(296, 340));
    sleep(config.sleepAnimate);
    console.log('Research kingdom tech');
    researching = handleResearchInGnomeLab(gnomeLabKingdom, 0.94);
  }
  if (!researching && config.autoResearchCookies) {
    qTap(pnt(416, 340));
    sleep(config.sleepAnimate);
    console.log('Research cookie tech');
    handleResearchInGnomeLab(gnomeLabCookies, 0.9);
  }
  return handleGotoKingdomPage();
}

function handleResearchInGnomeLab(targetIconList, threashold) {
  var pageCanTapResearch = [
    { x: 276, y: 318, r: 121, g: 207, b: 12 },
    { x: 220, y: 317, r: 54, g: 62, b: 95 },
    { x: 398, y: 315, r: 54, g: 62, b: 95 },
  ];

  var pageNotEnoughAuroraItemForReserch = [
    { x: 436, y: 97, r: 255, g: 255, b: 255 },
    { x: 427, y: 97, r: 56, g: 167, b: 231 },
    { x: 414, y: 100, r: 60, g: 70, b: 105 },
    { x: 310, y: 249, r: 0, g: 193, b: 255 },
    { x: 261, y: 248, r: 219, g: 207, b: 199 },
    { x: 287, y: 252, r: 121, g: 207, b: 12 },
  ];

  // Tools, etc
  var pageNotEnoughItemsForResearch = [
    { x: 435, y: 95, r: 255, g: 255, b: 255 },
    { x: 303, y: 250, r: 8, g: 125, b: 255 },
    { x: 287, y: 247, r: 123, g: 207, b: 16 },
    { x: 261, y: 245, r: 222, g: 207, b: 198 },
    { x: 305, y: 100, r: 57, g: 69, b: 107 },
    { x: 22, y: 20, r: 127, g: 102, b: 122 },
  ];

  var foundResults = [];
  for (var i = 0; i < 12; i++) {
    for (var imageIdx = 0; imageIdx < targetIconList.length; imageIdx++) {
      foundResults = findSpecificImageInScreen(targetIconList[imageIdx].img, threashold);
      // console.log('>', i, JSON.stringify(foundResults), foundResults.length, foundResults.length > 0);
      if (foundResults.length > 0) {
        console.log('Tap gnome reserach check: ', targetIconList[imageIdx].name, JSON.stringify(foundResults));
        for (var j = 0; j < foundResults.length; j++) {
          qTap(foundResults[j]);
          sleep(config.sleepAnimate * 3);
          if (checkIsPage(pageCanTapResearch)) {
            if (!config.autoLabUseAuroraMaterial) {
              var hasAuroraRequirement = false;
              for (var auroraIndex = 0; auroraIndex < auroraItems.length; auroraIndex++) {
                if (findSpecificImageInScreen(auroraItems[auroraIndex].img, 0.92).length > 0) {
                  console.log('lab restrict use of aurora items, skip this one');
                  qTap(pnt(570, 31));
                  sleep(1500);
                  hasAuroraRequirement = true;
                  break;
                }
              }

              if (!hasAuroraRequirement) {
                console.log('About to researching without Aurora item: ', JSON.stringify(foundResults[j]));
                qTap(pageCanTapResearch);

                // Check for not enough items for research
                sleep(1000);
                if (checkIsPage(pageNotEnoughAuroraItemForReserch)) {
                  console.log('Not enough aurora items, continue');
                  qTap(pageNotEnoughAuroraItemForReserch);
                  sleep(1000);
                  qTap(pnt(570, 31));
                  sleep(1500);
                  break;
                } else if (checkIsPage(pageNotEnoughItemsForResearch)) {
                  console.log('Not enough items, continue');
                  qTap(pageNotEnoughItemsForResearch);
                  sleep(1000);
                  qTap(pnt(570, 31));
                  sleep(1500);
                  break;
                } else {
                  console.log('Start researching');
                }

                sendEvent('running', '');
                return true;
              }
            } else {
              console.log('About to researching without Aurora item: ', JSON.stringify(foundResults[j]));
              qTap(pageCanTapResearch);

              sleep(1000);
              if (checkIsPage(pageNotEnoughItemsForResearch)) {
                console.log('Not enough items, continue');
                qTap(pageNotEnoughItemsForResearch);
                sleep(1000);
                qTap(pnt(570, 31));
                sleep(1500);
                break;
              } else {
                sendEvent('running', '');
                console.log('Start researching');
              }

              return true;
            }
          } else {
            console.log('Research requirement not met (btn not enabled)');
            keycode('BACK', 1000);
            sleep(config.sleepAnimate * 3);
          }
        }
      }
    }

    if (checkIsPage(pageAlreadyResearching)) {
      console.log('Already researching, skipping handleInGnomeLab');
      return true;
    }

    swipeFromToPoint(pnt(600, 234), pnt(-200, 234), 5, 0, undefined, pageInGnomeLab)
  }

  return false;
}

function handleTradeHabor() {
  handleGotoTradeHabor();
  handleInHabor();
  handleGotoKingdomPage();
}

function handleGotoTradeHabor () {
  if (!checkIsPage(pageInHabor)) {
    console.log('try to handleGotoTradeHabor');
    if (!checkIsPage(pageInKingdomVillage)) {
      handleGotoKingdomPage(gnomeLabKingdom);
    }

    var pageLabCollapsed = [
      { x: 98, y: 327, r: 255, g: 228, b: 143 },
      { x: 91, y: 327, r: 222, g: 52, b: 66 },
      { x: 127, y: 345, r: 41, g: 65, b: 99 },
      { x: 26, y: 322, r: 255, g: 255, b: 255 },
      { x: 22, y: 329, r: 82, g: 26, b: 11 },
      { x: 28, y: 273, r: 255, g: 247, b: 206 },
    ];
    var pageHaborUncollapsed = [
      { x: 113, y: 99, r: 252, g: 58, b: 163 },
      { x: 105, y: 105, r: 255, g: 251, b: 107 },
      { x: 84, y: 105, r: 57, g: 105, b: 156 },
    ];
    var pageHaborUncollapsed2 = [
      { x: 114, y: 50, r: 255, g: 65, b: 168 },
      { x: 104, y: 55, r: 255, g: 253, b: 107 },
    ];
    if (checkIsPage(pageLabCollapsed)) {
      qTap(pageLabCollapsed);
      sleep(config.sleepAnimate * 4);
    }

    if (checkIsPage(pageHaborUncollapsed)) {
      qTap(pageHaborUncollapsed);
      sleep(config.sleepAnimate * 2);
    } else if (checkIsPage(pageHaborUncollapsed2)) {
      qTap(pageHaborUncollapsed2);
      sleep(config.sleepAnimate * 2);
    }
    return waitUntilSeePage(pageInHabor, 4);
  }
}

var seasideStockRect = {
  0: new rect(78, 286, 60, 17),
  1: new rect(188, 286, 60, 17),
  2: new rect(298, 286, 60, 17),
  3: new rect(400, 286, 60, 17),
  4: new rect(510, 286, 60, 17),
};
function ocrSeasideMarketStockAfterPurchase(rect) {
  var img = getScreenshot();
  var croppedImage = cropImage(img, rect.x, rect.y, rect.width, rect.height);
  releaseImage(img);

  var txt = recognizeWishingTreeRequirements(numberAuroraStockInTradeBird, croppedImage, 10, 0.8, 0.5);
  releaseImage(croppedImage);

  if (txt.length === 0) {
    return -1;
  } else if (txt.indexOf('/') === -1) {
    return -1;
  } else {
    var stock = txt.split('/');
    return stock[0] - stock[1];
  }
}

function handleInHabor() {
  var pageShipInHabor = [
    { x: 418, y: 212, r: 55, g: 34, b: 22 },
    { x: 609, y: 211, r: 176, g: 133, b: 66 },
    { x: 585, y: 229, r: 123, g: 78, b: 44 },
  ];
  var pageNoShipInHabor = [
    { x: 246, y: 66, r: 255, g: 12, b: 82 },
    { x: 233, y: 88, r: 249, g: 242, b: 212 },
    { x: 255, y: 138, r: 126, g: 114, b: 41 },
  ];
  var pageCanLoadThisItem = [
    { x: 424, y: 201, r: 59, g: 205, b: 0 },
    { x: 351, y: 246, r: 123, g: 207, b: 8 },
    { x: 414, y: 242, r: 222, g: 207, b: 198 },
    { x: 433, y: 309, r: 57, g: 69, b: 107 },
  ];
  var pageLoadTooMuchWarning = [
    { x: 400, y: 252, r: 123, g: 207, b: 8 },
    { x: 304, y: 253, r: 8, g: 166, b: 222 },
    { x: 436, y: 288, r: 27, g: 33, b: 51 },
    { x: 260, y: 55, r: 28, g: 34, b: 53 },
  ];

  if (config.autoHandleTradeHabor && !waitUntilSeePage(pageNoShipInHabor, 4, pageShipInHabor, pageShipInHabor)) {
    console.log('ship still there, load all items and send running');
    sendEvent('running', '');
    var i = 0;

    var shipInHabor = true;
    for (i = 0; i < 5 && shipInHabor; i++) {
      for (var xPixel = i === 0 ? 55 : 200; xPixel < 620; xPixel += 60) {
        qTap(pnt(xPixel, 318));
        // console.log('tap: ', xPixel, 318)
        sleep(config.sleepAnimate * 2);

        if (checkIsPage(pageCanLoadThisItem)) {
          console.log('can load the item at x: ', xPixel);
          qTap(pageCanLoadThisItem); // tap Max
          sleep(config.sleep);

          qTap(pnt(342, 240)); // tap load
          sleep(config.sleepAnimate);
        }
        if (checkIsPage(pageLoadTooMuchWarning)) {
          qTap(pnt(270, 252)); // Cancel ship confirm
          sleep(config.sleepAnimate);
          qTap(pnt(270, 200)); // tap minus icon
          sleep(config.sleepAnimate);
          qTap(pnt(320, 240)); // tap load
          sleep(config.sleepAnimate);
        }
        if (checkIsPage(pageLoadTooMuchWarning)) {
          //Even one item is too much
          qTap(pnt(270, 252)); // Cancel ship confirm
          sleep(config.sleepAnimate);
          qTap(pnt(434, 50)); // tap close icon
          sleep(config.sleepAnimate * 2);
        }

        if (waitUntilSeePage(pageNoShipInHabor, 3)) {
          console.log('Send the ship successfully');
          shipInHabor = false;
          break;
        }

        if (!handleTryHitBackToSpecificPages([pageShipInHabor, pageNoShipInHabor])) {
          handleGotoTradeHabor();
        }
      }

      if (checkIsPage(pageNoShipInHabor)) {
        break;
      }

      tapDown(629, 319, 40, 0);
      sleep(config.sleep);
      moveTo(629, 319, 40, 0);
      sleep(config.sleep);
      moveTo(500, 319, 40, 0);
      sleep(config.sleep);
      moveTo(350, 319, 40, 0);
      sleep(config.sleep);
      moveTo(200, 319, 40, 0);
      sleep(config.sleep);
      tapUp(200, 319, 40, 0);
      sleep(config.sleepAnimate * 2);
    }
  } else {
    console.log('No need to send ship, config.autoHandleTradeHabor: ', config.autoHandleTradeHabor);
  }

  var pageInSeasideMarket = [
    {x: 617, y: 21, r: 255, g: 255, b: 255},
    {x: 566, y: 183, r: 114, g: 76, b: 32},
    {x: 256, y: 121, r: 101, g: 151, b: 23},
    {x: 280, y: 5, r: 206, g: 227, b: 49},
    {x: 178, y: 117, r: 247, g: 52, b: 90},
  ]
  var pageFreeRefreshSeasideMarket = [
    {x: 510, y: 333, r: 155, g: 155, b: 155},
    {x: 504, y: 333, r: 172, g: 146, b: 126},
    {x: 498, y: 333, r: 148, g: 120, b: 111},
    {x: 494, y: 333, r: 175, g: 148, b: 117},
  ]
  var pageNeedDiamondRefreshMarket = [
    { x: 426, y: 110, r: 57, g: 169, b: 231 },
    { x: 305, y: 102, r: 255, g: 255, b: 255 },
    { x: 363, y: 118, r: 57, g: 69, b: 107 },
    { x: 297, y: 124, r: 33, g: 44, b: 66 },
  ];
  var pageMarketItemDetail = [
    { x: 350, y: 246, r: 123, g: 207, b: 8 },
    { x: 411, y: 16, r: 127, g: 93, b: 8 },
    { x: 521, y: 21, r: 0, g: 71, b: 126 },
    { x: 397, y: 103, r: 57, g: 69, b: 107 },
  ];
  var pageNotEnoughItemToBuyThis = [
    {x: 434, y: 95, r: 255, g: 255, b: 255},
    {x: 305, y: 250, r: 8, g: 125, b: 255},
    {x: 343, y: 160, r: 49, g: 158, b: 231},
    {x: 339, y: 198, r: 206, g: 195, b: 181},
  ]
  if (
    config.autoBalanceAuroraStocks || config.autoShopInSeasideMarket || config.autoBuyCaramelStuff || config.autoBuyRadiantShardsInHabor
  ) {
    if (waitUntilSeePage(pageInHabor, 4, undefined, pageInSeasideMarket)) {
      qTap(pnt(93, 230)); // Seaside market
      sleep(config.sleepAnimate * 2);
    }

    console.log('should be in seaside market');
    if (checkIsPage(pageFreeRefreshSeasideMarket)) {
      qTap(pnt(543, 336)); // market free refresh, no need to pull to the head of the list as refresh will reset the list
      sleep(config.sleepAnimate);
      if (waitUntilSeePage(pageNeedDiamondRefreshMarket, 3)) {
        qTap(pageNeedDiamondRefreshMarket);
        sleep(config.sleepAnimate);
      }
    } else {
      // swipe to start of the list
      swipeFromToPoint(pnt(0, 234), pnt(4000, 234), 6, 0, undefined, pageInSeasideMarket)
    }

    console.log('In seaside marketing, send running');
    sendEvent('running', '');

    var newStock;
    var minStock = Math.max(config.productSafetyStock, 150);

    if (config.autoBalanceAuroraStocks) {
      for (var auroraIdx = 0; auroraIdx < 3; auroraIdx++) {
        newStock = ocrSeasideMarketStockAfterPurchase(seasideStockRect[auroraIdx]);
        if (newStock > 50) {
          qTap(seasideStockRect[auroraIdx]);
          if (waitUntilSeePage(pageMarketItemDetail, 3)) {
            var productNowHave = ocrProductStorage(rect(330, 154, 28, 14));
            if (newStock > productNowHave) {
              console.log('Purchased seaside market: ', auroraIdx, newStock, productNowHave);
              qTap(pageMarketItemDetail);
              sleep(2000);
            } else {
              console.log('NOT purchased seaside market: ', auroraIdx, newStock, productNowHave);
            }
            if (!handleTryHitBackToSpecificPages([pageInSeasideMarket])) {
              handleGotoTradeHabor();
              qTap(pnt(93, 230)); // Seaside market
              sleep(config.sleepAnimate * 2);
            }
          }
        }
      }
    }

    if (config.autoBuyCaramelStuff) {
      newStock = ocrSeasideMarketStockAfterPurchase(seasideStockRect[3]);
      if (newStock > minStock) {
        qTap(pnt(420, 250));
        sleep(config.sleepAnimate);
        qTap(pnt(315, 247));
        waitUntilSeePage(pageInSeasideMarket);
        console.log('Purchased carmel spyglass');
      }

      newStock = ocrSeasideMarketStockAfterPurchase(seasideStockRect[4]);
      if (newStock > minStock) {
        qTap(pnt(530, 245));
        sleep(config.sleepAnimate);
        qTap(pnt(315, 247));
        waitUntilSeePage(pageInSeasideMarket);
        console.log('Purchased carmel map fragment');
      }
      console.log('Purchased carmel stuff successfully');
    }

    if (config.autoBuyRadiantShardsInHabor) {
      qTap(pnt(612, 270));
      sleep(config.sleepAnimate);
      qTap(pnt(315, 247));
      waitUntilSeePage(pageInSeasideMarket);
      console.log('Purchased radiant shards successfully');
    }

    // Buy if resource > max(safetyStock, 150) and target < config.materialTarget
    if (config.autoShopInSeasideMarket) {
      for (i = 0; i < 5; i ++) {
        for (var purcaseIndex = 0; purcaseIndex < seasideMarketItems.length; purcaseIndex ++){
          var foundResults = findSpecificImageInScreen(seasideMarketItems[purcaseIndex].img, 0.96);
          if (foundResults && foundResults.length > 0) {
            console.log('found market items i: {0}, name: {1} result: {2} > '.format(i, seasideMarketItems[purcaseIndex].name, JSON.stringify(foundResults)));
            for(var foundIdx = 0; foundIdx < foundResults.length; foundIdx++) {
              newStock = ocrSeasideMarketStockAfterPurchase(new rect(foundResults[foundIdx].x, 286, 65, 17));
              console.log('newStock: ', newStock)
              if (newStock > 1 && newStock < minStock) {
                console.log('Does not purchase {0} as stock {1} < safety ({2})'.format(seasideMarketItems[purcaseIndex].name, newStock, minStock))
                continue;
              }

              qTap(foundResults[foundIdx]);
              if (waitUntilSeePage(pageMarketItemDetail, 3)) {
                productNowHave = ocrProductStorage(rect(330, 154, 28, 14));
                if (productNowHave < config.materialsTarget) {
                  console.log('Purchased seaside market: ', foundIdx, seasideMarketItems[purcaseIndex].name, productNowHave);
                  qTap(pageMarketItemDetail);
                  if (waitUntilSeePage(pageNotEnoughItemToBuyThis, 2)) {
                    console.log('OOPS, not enough items to buy this one, skipping');
                    qTap(pageNotEnoughItemToBuyThis);
                  }
                  sleep(2000)
                } else {
                  console.log('NOT purchased seaside market: ', foundIdx, seasideMarketItems[purcaseIndex].name, productNowHave);
                }
              }

              if (!handleTryHitBackToSpecificPages([pageInSeasideMarket])) {
                console.log('Going back to trade habor');
                handleGotoTradeHabor();
                qTap(pnt(93, 230)); // Seaside market
                sleep(config.sleepAnimate * 2);
              }
            }
          }
        }

        console.log('swipe to right and see other ')
        swipeFromToPoint(pnt(600, 234), pnt(0, 234), 6, 0, undefined, pageInSeasideMarket)
      }
    }

    if (!handleTryHitBackToSpecificPages([pageShipInHabor, pageNoShipInHabor])) {
      handleGotoTradeHabor();
    }
  } else {
    console.log('No need to shop in seaside market');
  }

  var pageCanGotoShellShop = [
    { x: 33, y: 227, r: 247, g: 207, b: 231 },
    { x: 92, y: 233, r: 255, g: 251, b: 74 },
    { x: 346, y: 19, r: 223, g: 230, b: 231 },
    { x: 605, y: 211, r: 173, g: 130, b: 57 },
  ];
  var pageInShellShop = [
    { x: 609, y: 22, r: 57, g: 166, b: 231 },
    { x: 323, y: 28, r: 247, g: 181, b: 243 },
    { x: 272, y: 28, r: 200, g: 212, b: 214 },
    { x: 254, y: 12, r: 231, g: 199, b: 156 },
  ];
  var pageLegendarySoldOut = [
    { x: 57, y: 102, r: 171, g: 203, b: 240 },
    { x: 82, y: 199, r: 239, g: 24, b: 24 },
  ];
  var pageConfirmBuySeaFairy = [
    { x: 307, y: 256, r: 231, g: 240, b: 217 },
    { x: 292, y: 241, r: 148, g: 219, b: 57 },
    { x: 241, y: 258, r: 222, g: 207, b: 198 },
    { x: 313, y: 77, r: 255, g: 255, b: 255 },
    { x: 273, y: 96, r: 57, g: 69, b: 107 },
  ];
  var pageConfirmBuyGuildRelics = [
    { x: 349, y: 254, r: 123, g: 207, b: 8 },
    { x: 335, y: 81, r: 156, g: 93, b: 41 },
    { x: 324, y: 38, r: 83, g: 106, b: 124 },
  ];
  var pageRelicsSoldOut = [
    {x: 413, y: 235, r: 206, g: 20, b: 24},
    {x: 387, y: 229, r: 198, g: 121, b: 57},
  ]
  var pageConfirmBuyLegendSoulEssence = [
    { x: 302, y: 254, r: 255, g: 186, b: 239 },
    { x: 312, y: 69, r: 170, g: 109, b: 38 },
    { x: 326, y: 91, r: 198, g: 251, b: 239 },
    { x: 267, y: 100, r: 57, g: 69, b: 107 },
  ];
  var pageLegendSoulEssenceSoldOut = [
    {x: 292, y: 118, r: 205, g: 22, b: 27},
    {x: 277, y: 140, r: 246, g: 255, b: 255},
  ]
  var pageConfirmBuyEpicSoulEssence = [
    { x: 312, y: 253, r: 247, g: 190, b: 239 },
    { x: 315, y: 84, r: 195, g: 142, b: 60 },
    { x: 282, y: 91, r: 57, g: 69, b: 107 },
  ];
  var pageEpicSoulEssenceSoldOut = [
    {x: 293, y: 241, r: 206, g: 20, b: 24},
    {x: 274, y: 263, r: 247, g: 138, b: 247},
  ]
  if (
    (config.autoBuySeaFairy ||
      config.autoBuyGuildRelic ||
      config.autoBuyEpicSoulEssence ||
      config.autoBuyLegendSoulEssence) &&
    waitUntilSeePage(pageInHabor, 4)
  ) {
    console.log('Try to purchase sea fairy in shell shop and send running');
    sendEvent('running', '');

    qTap(pageCanGotoShellShop);
    sleep(config.sleepAnimate);

    if (waitUntilSeePage(pageInShellShop, 4)) {
      sleep(1000);
      if (config.autoBuySeaFairy) {
        console.log('checking autoBuySeaFairy')
        if (waitUntilSeePage(pageConfirmBuySeaFairy, 4, pnt(80, 313), pageLegendarySoldOut)) {
          qTap(pageConfirmBuySeaFairy);
          sleep(1500);
          console.log('Purchased legendary cookie successfully');
        }
      }

      if (config.autoBuyGuildRelic) {
        console.log('checking autoBuyGuildRelic')
        for (i = 0; i < 2; i++) {
          qTap(pnt(930, 316));
          if (waitUntilSeePage(pageConfirmBuyGuildRelics, 5, pnt(390, 316), pageRelicsSoldOut)) {
            qTap(pageConfirmBuyGuildRelics);
            sleep(1500);
            console.log('Purchased guild relic successfully: ', i);
          }
        }
      }

      if (config.autoBuyLegendSoulEssence) {
        console.log('checking autoBuyLegendSoulEssence')
        for (i = 0; i < 2; i++) {
          qTap(pnt(270, 192));
          if (waitUntilSeePage(pageConfirmBuyLegendSoulEssence, 5, pnt(270, 192), pageLegendSoulEssenceSoldOut)) {
            qTap(pageConfirmBuyEpicSoulEssence);
            sleep(1500);
            console.log('Purchased legend soul essence successfully: ', i);
          }
        }
      }
      if (config.autoBuyEpicSoulEssence) {
        console.log('checking autoBuyEpicSoulEssence')
        for (i = 0; i < 3; i++) {
          qTap(pnt(270, 318));
          if (waitUntilSeePage(pageConfirmBuyEpicSoulEssence, 5, pnt(270, 318), pageEpicSoulEssenceSoldOut)) {
            qTap(pageConfirmBuyEpicSoulEssence);
            sleep(1500);
            console.log('Purchased epic soul essence successfully: ', i);
          }
        }
      }

      handleTryHitBackToSpecificPages([pageShipInHabor, pageNoShipInHabor]);
    }
  } else {
    console.log('No need to autoBuySeaFairy');
  }

  sendEvent('running', '');
}

function handleCheckIfAtLoginScreen() {
  var img = getScreenshot();
  var upperRightImage = cropImage(img, 580, 1, 55, 40);
  var foundResults = findImages(upperRightImage, loginGearIcon, 0.92, 1, true);
  releaseImage(img);
  releaseImage(upperRightImage);
  if (foundResults.length > 0) {
    console.log('handleTryHitBackToKingdom found in login page, tap tap(575, 22) announcement point');
    qTap(pnt(575, 22));
    return true;
  }
}

// Facebook login page can only tap back to CrK, not use cmd to call Crk back to the front
function checkIsFacebookPage() {
  var img = getScreenshot();
  for (var i in pageLoginFacebook) {
    var cbtn = pageLoginFacebook[i];
    var color = getImageColor(img, cbtn.x, cbtn.y);
    if (!isSameColor(cbtn, color, 35)) {
      releaseImage(img);
      return false;
    }
  }

  console.log('In facebook page, tap back to game');
  for (var j = 0; j < 8; j++) {
    keycode('BACK', 80);
    return true;
  }
}

function checkIsCookieGachaPage() {
  var img = getScreenshot();
  for (var i in pageInCookieGacha) {
    var cbtn = pageInCookieGacha[i];
    var color = getImageColor(img, cbtn.x, cbtn.y);
    if (!isSameColor(cbtn, color, 35)) {
      releaseImage(img);
      return false;
    }
  }

  console.log('In cookie gacha page, tap daily gift to avoid misclick');
  for (var j = 0; j < 4; j++) {
    qTap(pnt(35, 230));
    sleep(100);
    return true;
  }
}

function checkAndRestartApp() {
  for (var i = 0; i < config.tryRestartGameLimit; i++) {
    if (checkIsFacebookPage()) {
      console.log('Skip checkAndRestartApp() as its facebook page');
      return false;
    }

    if (getCurrentApp()[0] === 'com.devsisters.ck') {
      // console.log('checkAndRestartApp found correct app: com.devsisters.ck')
      return true;
    }

    console.log('Cookie not active, restart CookieKingdom and wait up to 50s till see pageInputAge');

    var rtn = execute('ls /data/data/com.devsisters.ck/shared_prefs');
    if (rtn === 'exit status 1') {
      console.log('Did not find shared_pref, removing all related dirs');
      execute('rm -r /data/data/com.devsisters.ck/app_payload_lib');
      execute('rm -r /data/data/com.devsisters.ck/cache');
      execute('rm -r /data/data/com.devsisters.ck/code_cache');
      execute('rm -r /data/data/com.devsisters.ck/.sealing_reports');
      execute('rm -r /data/data/com.devsisters.ck/files');
    }

    rtn = execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');

    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity'
      );
    }

    var img;
    var whSize;
    for (var timer = 0; timer < 30; timer++) {
      img = getScreenshot();
      whSize = getImageSize(img);
      releaseImage(img);
      if (whSize.width === 640) {
        break;
      }
      sleep(1000);
    }

    if (whSize.width !== 640) {
      console.log('Reboot as failed to start the game after 50 secs');
      execute('/system/bin/reboot -p');
    }

    if (waitUntilSeePage(pageAnnouncement, 50, pnt(575, 22), pageInMailBox)) {
      console.log('Successfully see announcement page after restart the game');
    }
    return false;
  }
}

function findSpecificImageInScreen(target, threashold, isDev) {
  if (threashold === undefined) {
    threashold = 0.95;
  }

  var img = getScreenshot();
  var foundResults = findImages(img, target, threashold, 5, true);
  if (isDev) {
    console.log('findSpecificImageInScreen, found target icon at: ', JSON.stringify(foundResults));
  }
  releaseImage(img);
  return foundResults;
}

function handleTowerOfRecords() {
  var adventuresRecordsRedCheck = [{ x: 117, y: 49, r: 255, g: 0, b: 0 }];
  var specialRecordsRedCheck = [{ x: 117, y: 89, r: 255, g: 0, b: 0 }];
  var cookieStoriesRedCheck = [{ x: 117, y: 128, r: 255, g: 0, b: 0 }];
  var recordList = [adventuresRecordsRedCheck, specialRecordsRedCheck, cookieStoriesRedCheck];
  for (var i = 0; i < recordList.length; i++) {
    var recordTab = recordList[i];
    if (checkIsPage(recordTab)) {
      console.log('handleTowerOfRecords in: ', i);
      qTap(recordTab);
      sleep(config.sleepAnimate);

      for (var j = 0; j < 4; j++) {
        var foundResults = findSpecificImageInScreen(diamondInTowerOfRecords, 0.935, true);
        if (foundResults.length > 0) {
          console.log('Tap ToR diamond at: ', JSON.stringify(foundResults));
          for (var k = 0; k < foundResults.length; k++) {
            qTap(foundResults[k]);
            sleep(config.sleepAnimate);
          }

          if (checkIsPage(recordTab)) {
            console.log('No more red points being found, return');
            handleGotoKingdomPage();
            return;
          }
        }

        tapDown(307, 330, 40, 0);
        sleep(config.sleep);
        moveTo(307, 330, 40, 0);
        sleep(config.sleep);
        moveTo(307, 270, 40, 0);
        sleep(config.sleep);
        moveTo(307, 100, 40, 0);
        sleep(config.sleep);
        moveTo(307, 0, 40, 0);
        sleep(config.sleep);
        tapUp(307, 0, 40, 0);
        sleep(config.sleepAnimate * 4);
      }
    }
  }
  handleGotoKingdomPage();
}

function getMayhemScores() {
  var img = getScreenshot();
  var scores = [0, 0, 0];
  var imagesLocation = [
    [
      { x: 495, y: 56, w: 47, h: 12 },
      { x: 495, y: 84, w: 47, h: 12 },
      { x: 495, y: 110, w: 47, h: 12 },
    ],
    [
      { x: 495, y: 145, w: 47, h: 12 },
      { x: 495, y: 172, w: 47, h: 12 },
      { x: 495, y: 198, w: 47, h: 12 },
    ],
    [
      { x: 495, y: 232, w: 47, h: 12 },
      { x: 495, y: 260, w: 47, h: 12 },
      { x: 495, y: 288, w: 47, h: 12 },
    ],
  ];
  for (var mayhemIdx = 0; mayhemIdx < imagesLocation.length; mayhemIdx++) {
    for (var teamIdx = 0; teamIdx < imagesLocation[mayhemIdx].length; teamIdx++) {
      var tImage = imagesLocation[mayhemIdx][teamIdx];
      var croppedImage = cropImage(img, tImage.x, tImage.y, tImage.w, tImage.h);
      var value = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage, 7, 0.7, 0.7) || 0;
      releaseImage(croppedImage);

      if (value > scores[mayhemIdx]) {
        scores[mayhemIdx] = value;
      }
    }
  }

  releaseImage(img);
  console.log('>> ', JSON.stringify(scores));
  return scores;
}

function handleSuperMayhem() {
  if (!handleGotoAdventure(Advantures.superMayhem, pageInSuperMayhem)) {
    console.log('skipping handleSuperMayhem as cannot find the path');
    return false;
  }

  console.log('starting handleSuperMayhem');
  sendEvent('running', '');

  var pageBattlePrepare = [
    { x: 548, y: 329, r: 123, g: 207, b: 8 },
    { x: 505, y: 325, r: 255, g: 251, b: 255 },
    { x: 270, y: 334, r: 123, g: 207, b: 8 },
    { x: 304, y: 218, r: 255, g: 223, b: 24 },
  ];

  var battleFinishPage = [
    { x: 56, y: 331, r: 247, g: 89, b: 24 },
    { x: 584, y: 332, r: 8, g: 166, b: 222 },
    { x: 606, y: 24, r: 57, g: 169, b: 231 },
  ];

  var pageNoMayhemTicket = [
    { x: 301, y: 250, r: 8, g: 166, b: 222 },
    { x: 355, y: 254, r: 0, g: 195, b: 255 },
    { x: 317, y: 92, r: 231, g: 204, b: 220 },
    { x: 307, y: 80, r: 148, g: 0, b: 68 },
    { x: 261, y: 97, r: 57, g: 69, b: 107 },
  ];

  console.log('start super Mayhem success');
  var battleEntriesPnts = [
    [{ x: 586, y: 97, r: 123, g: 207, b: 16 }],
    [{ x: 583, y: 186, r: 123, g: 207, b: 16 }],
    [{ x: 581, y: 275, r: 123, g: 207, b: 16 }],
  ];

  for (var loopTimes = 0; loopTimes < config.battleMaxLoops; loopTimes++) {
    var scores = getMayhemScores();
    console.log('super mayhem scores: ', JSON.stringify(scores));

    var loopHasBattled = false;
    for (var scoreIdx = 0; scoreIdx < scores.length; scoreIdx++) {
      if (scores[scoreIdx] < config.autoSuperMayhemTargetScoreLimit && scores[scoreIdx] != 0) {
        if (!checkIsPage(battleEntriesPnts[scoreIdx])) {
          console.log('skip', scoreIdx, 'as already battled');
          continue;
        }
        if (checkIsPage(pagePvPCrystaisRefresh)) {
          console.log('crystaisRefreshPage');
          tap(436, 90, 100); // X cancel
          break;
        }

        console.log('Battle with', scoreIdx, 'power', scores[scoreIdx]);
        if (waitUntilSeePage(pageBattlePrepare, 10, battleEntriesPnts[scoreIdx])) {
          tap(550, 320, 100); // start battle
          loopHasBattled = true;

          if (waitUntilSeePage(pageNoMayhemTicket, 5)) {
            console.log('No mayhem ticket, finish auto super mayhem');
            qTap(pageNoMayhemTicket);
            handleGotoKingdomPage();
            return;
          }

          if (rfpageCanEquipTopping.isMatchScreen(this.screen)) {
            console.log('Found rfpageCanEquipTopping, tap OK and wait for 5 secs');
            rfpageCanEquipTopping.goNext(this.screen);
            sleep(5000);
          } else if (rfpageCanEquipTopping2.isMatchScreen(this.screen)) {
            console.log('Found rfpageCanEquipTopping2, tap OK and wait for 5 secs');
            rfpageCanEquipTopping2.goNext(this.screen);
            sleep(5000);
          }

          if (waitForBattle('superMayhem', 120, false, kingdomArena)) {
            console.log('PvP battle finished, try next one');
            continue;
          }
        }
      } else {
        console.log('SKIP battle with stronger opponent', scoreIdx, 'power', scores[scoreIdx]);
      }
    }
    sendEvent('running', '');
    console.log('Finish battle loop: ', loopTimes, 'and try tap refresh');

    tap(560, 330, 100); // Free Refresh
    sleep(5000);

    if (checkIsPage(pagePvPCrystaisRefresh)) {
      console.log('crystaisRefreshPage');
      tap(436, 90, 100); // X cancel

      if (!loopHasBattled) {
        console.log('No one can battle with, return');
        break;
      }
    }
  }

  console.log('finish Super Mayhem, goto kingdom');
  handleGotoKingdomPage();
}

function handleTowerOfSweetChaos() {
  console.log('start handleTowerOfSweetChaos: ', config.autoHandleTowerOfSweetChaos, checkIsPage(pageCookieAlliance));

  if (!checkIsPage(pageReadyToBattleToSC)) {
    handleGotoAdventure(Advantures.towerOfSweetChaos, pageInTowerOfSweetChaos);
    if (!checkIsPage(pageInTowerOfSweetChaos)) {
      console.log('unable to goto TowerOfSweetChaos, skipping handleTowerOfSweetChaos');
      handleGotoKingdomPage();
      return;
    }
  }

  console.log('about to start handleTowerOfSweetChaos, send running');
  sendEvent('running', '');

  var downArrow = findSpecificImageInScreen(towerOfSweetChoasDownArrow);
  if (downArrow.length > 0) {
    qTap(downArrow[0]);
    sleep(5000);
  }

  qTap(pnt(180, 133)); // Go to the top tray
  sleep(config.sleepAnimate);

  console.log('starting handleTowerOfSweetChaos', JSON.stringify(pageReadyToBattleToSC));
  var idx = 0;
  while (readyAndBattleTray() && idx < 5) {
    console.log('just finished tray for', idx, 'times');
    idx++;
  }

  console.log('Finish ToSC at ', idx, 'battles');
  handleTryHitBackToKingdom();
  return;
}

var pageCookieOdysseyMissionIcon = [
  { x: 622, y: 122, r: 239, g: 34, b: 28 },
  { x: 616, y: 139, r: 206, g: 162, b: 33 },
  { x: 606, y: 134, r: 255, g: 255, b: 255 },
];
var pageInCookieOdysseyMissionList = [
  { x: 143, y: 37, r: 57, g: 69, b: 107 },
  { x: 143, y: 68, r: 239, g: 203, b: 66 },
];
function handleCollectCookieOdyssey() {
  console.log('about to handleCollectCookieOdyssey');

  if (!checkIsPage(pageInCookieOdysseyMissionList)) {
    if (!checkIsPage(pageInKingdomVillage)) {
      handleTryHitBackToKingdom();
    }

    if (checkIsPage(pageCookieOdysseyMissionIcon)) {
      qTap(pageCookieOdysseyMissionIcon);

      if (!waitUntilSeePage(pageInCookieOdysseyMissionList, 3)) {
        console.log('Cannot go to odyssey mission page, skipping');
        return false;
      }
    }
  }

  console.log('In pageInCookieOdysseyMissionList, send running');
  sendEvent('running', '');

  for (var scrollTimes = 0; scrollTimes < 4; scrollTimes++) {
    var img = getScreenshot();

    for (var y = 280; y >= 115; y -= 20) {
      var color = getImageColor(img, 536, y);

      if (isSameColor({ r: 101, g: 211, b: 0 }, color, 35)) {
        qTap(pnt(533, y));
        sleep(config.sleepAnimate);
        console.log('Collected odyssey mission at y:', y);
      }
    }

    releaseImage(img);

    tapDown(340, 280, 40, 0);
    sleep(config.sleep);
    moveTo(340, 280, 40, 0);
    sleep(config.sleep);
    moveTo(340, 180, 40, 0);
    sleep(config.sleep);
    moveTo(340, 180, 40, 0);
    sleep(config.sleep);
    moveTo(340, 50, 40, 0);
    sleep(config.sleep);
    tapUp(340, 50, 40, 0);
    sleep(config.sleepAnimate * 2);
  }

  handleTryHitBackToKingdom();
}

function readyAndBattleTray() {
  if (checkIsPage(pageToSCTreasureChest)) {
    console.log('Try to open a treasure chest');
    qTap(pageToSCTreasureChest);
    sleep(5000);
    if (!waitUntilSeePage(pageInTowerOfSweetChaos, 15, pageToSCTreasureChest)) {
      console.log('Failed to open chest and goto pageInTowerOfSweetChaos, skipping');
      return false;
    }
  }

  if (checkIsPage(pageInTowerOfSweetChaos)) {
    qTap(pnt(571, 327)); // tap Ready
    if (!waitUntilSeePage(pageReadyToBattleToSC, 6)) {
      console.log('Failed to goto pageReadyToBattleTowerOfSweetChaos, skipping');
      return false;
    }
  }

  qTap(pageReadyToBattleToSC);
  if (waitUntilSeePage(pageToSCTeamsNotMeetRequirement, 5)) {
    console.log('ToSC team requirement not met, skipping');
    return false;
  }

  if (rfpageCanEquipTopping.isMatchScreen(this.screen)) {
    console.log('Found rfpageCanEquipTopping, tap OK and wait for 5 secs');
    rfpageCanEquipTopping.goNext(this.screen);
    sleep(5000);
  } else if (rfpageCanEquipTopping2.isMatchScreen(this.screen)) {
    console.log('Found rfpageCanEquipTopping2, tap OK and wait for 5 secs');
    rfpageCanEquipTopping2.goNext(this.screen);
    sleep(5000);
  }

  if (waitForBattle('TowerOfSweetChaos', 180, true, pageInTowerOfSweetChaos)) {
    console.log('TowerOfSweetChaos battle finished, try next one');
    if (
      waitUntilSeePage(pageReadyToBattleToSC, 20) ||
      checkIsPage(pageInTowerOfSweetChaos) ||
      checkIsPage(pageToSCTreasureChest)
    ) {
      return true;
    }
    return false;
  }

  console.log('Finish TowerOfSweetChaos due to battle return false');
  return false;
}

// function handleAutoPromoteCookies() {
//   var pageInCookieList = [
//     { x: 164, y: 341, r: 235, g: 237, b: 242 },
//     { x: 148, y: 340, r: 66, g: 93, b: 140 },
//     { x: 30, y: 317, r: 230, g: 142, b: 33 },
//   ];
//   if (!checkIsPage(pageInCookieList)) {
//     if (checkIsPage(pageInKingdomVillage)) {
//       handleTryHitBackToKingdom();
//     }

//     qTap(pnt(464, 327)); // icon Cookies
//     sleep(config.sleepAnimate);
//     qTap(pnt(195, 335)); // Cookies tab
//     sleep(config.sleepAnimate * 2);
//   }

//   for (var i = 0; i < 10; i++) {
//     var results = findSpecificImageInScreen(cookiePromoteGreenArrow, 0.7);
//     // console.log('>', JSON.stringify(results))

//     for (var idx in results) {
//       if (!checkIsPage(pageInCookieList)) {
//         break;
//       }

//       var cookie = results[idx];
//       qTap(cookie);
//       sleep(config.sleepAnimate * 2);
//       qTap(pnt(518, 311));
//       sleep(config.sleepAnimate);
//       qTap(pnt(518, 311));
//       sleep(config.sleepAnimate);

//       for (var j = 0; j < 10; j++) {
//         if (!checkIsPage(pageInCookieList)) {
//           keycode('BACK', 1000);
//           sleep(config.sleepAnimate * 2);
//         }
//       }
//     }

//     console.log('swiping');
//     tapDown(305, 315, 40, 0);
//     sleep(config.sleep * 4);
//     moveTo(305, 200, 40, 0);
//     sleep(config.sleep * 2);
//     moveTo(305, 200, 40, 0);
//     sleep(config.sleep * 2);
//     moveTo(305, 100, 40, 0);
//     sleep(config.sleep * 2);
//     moveTo(305, 100, 40, 0);
//     sleep(config.sleep * 2);
//     tapUp(305, 0, 40, 0);
//     sleep(config.sleepAnimate * 2);
//   }
// }

function handleTryResolveGreenChecks() {
  if (checkIsPage(pageAnnouncement)) {
    qTap(pageAnnouncement);
    if (waitUntilSeePage(pageInKingdomVillage, 5)) {
      return true;
    }
  }

  if (checkIsPage(pageChooseLoginMethod) || checkIsPage(pageChooseLoginMethod2)) {
    console.log('Asked to handleTryResolveGreenChecks but found login page, handleInputLoginInfo()');
    return handleInputLoginInfo();
  }

  // Only try resolve green check every 3 mins
  if ((Date.now() - config.lastTryResolveGreenChecks) / 60000 < 3) {
    return false;
  }

  // handle greenCheckedWithGiftBox
  foundResults = findSpecificImageInScreen(greenCheckedWithGiftBox, 0.94);
  if (foundResults.length > 0) {
    console.log('Fount greenCheckedWithGiftBox, tap it: ', JSON.stringify(foundResults));
    qTap(pnt(foundResults[0].x + 12, foundResults[0].y + 12));
    sleep(1500);
    handleGotoKingdomPage();
  }

  // handle sunbedGreenCheck
  var foundResults = findSpecificImageInScreen(sunbedGreenCheck, 0.985);
  if (foundResults.length > 0) {
    qTap(pnt(foundResults[0].x + 7, foundResults[0].y + 7));
    console.log('Fount green sunbedGreenCheck, tap it: ', JSON.stringify(foundResults[0]));
    if (waitUntilSeePage(pageInTropicalIsland, 10)) {
      console.log('green check leads to tropicall island, resolve it');
      handleCollectIslandResources();
    }
  }

  // handle other green checks
  foundResults = findSpecificImageInScreen(greenCheckedWhiteBackground, 0.94);
  if (foundResults.length === 0) {
    console.log('Confirmed no green check in this screen, back to kingdom');
    handleGotoKingdomPage();
    return false;
  }

  var cnt = 0;
  var totalCnt = foundResults.length;
  while (foundResults.length > 0 && cnt < totalCnt) {
    var tapIdx = Math.floor(Math.random() * foundResults.length);
    console.log('Fount green checked, tap it: ', tapIdx, JSON.stringify(foundResults[tapIdx]));
    qTap(foundResults[tapIdx]);

    for (var i = 0; i < 6; i++) {
      if (checkIsPage(pageInTropicalIsland)) {
        console.log('green check leads to tropicall island, resolve it');
        handleCollectIslandResources();
        break;
      } else if (checkIsPage(pageInHotAirBallon)) {
        console.log('green check leads to hot air ballon');
        handleInHotAirBallon();
        break;
      } else if (checkIsPage(pageInTowerOfRecords)) {
        console.log('green check leads to tower of records, resolve it');
        handleTowerOfRecords();
        // keycode('BACK', 1000);
        break;
      } else if (checkIsPage(pageInTrainStation)) {
        console.log('green check leads to train station');
        handleTrainStation();
        break;
      } else if (checkIsPage(pageInFountain)) {
        console.log('green check leads to fountain');
        handleInFountain();
        break;
      } else if (checkIsPage(pageStockIsFull)) {
        console.log('green check found stock is full, send running');
        qTap(pageStockIsFull);
        sendEvent('running', '');
        break;
      } else if (checkIsPage(pageInGnomeLab)) {
        console.log('green check leads to gnome lab, resolve it');
        handleInGnomeLab();
        break;
      }
      sleep(1000);
    }

    handleGotoKingdomPage();

    cnt++;
    foundResults = findSpecificImageInScreen(greenCheckedWhiteBackground, 0.94);
  }

  config.lastTryResolveGreenChecks = Date.now();
  // handleGotoKingdomPage();
  return true;
}

function checkIsFreeze() {
  if ((Date.now() - config.lastFreezeCheckScreenShotTime) / 1000 < 5) {
    // Builtin cool down 3 secs
    return true;
  }

  if (config.lastFreezeCheckScreenShot === null) {
    console.log('config.lastFreezeCheckScreenShot is null , skipping checkIsFreeze');
    config.lastFreezeCheckScreenShot = getScreenshot();
    config.lastFreezeCheckScreenShotTime = Date.now();
    return;
  }

  var img = getScreenshot();
  var foundResults = findImages(img, config.lastFreezeCheckScreenShot, 0.999, 1, true);

  if (foundResults.length === 0) {
    releaseImage(config.lastFreezeCheckScreenShot);
    config.lastFreezeCheckScreenShot = img;
    config.lastFreezeCheckScreenShotTime = Date.now();
    console.log('No need to restart app, screen not freeze, updaate last screenshot&time');
    return;
  } else {
    releaseImage(img);
  }

  if ((Date.now() - config.lastFreezeCheckScreenShotTime) / 1000 > 180) {
    console.log(
      'RESTART cookie app as screen freeze for: ',
      (Date.now() - config.lastFreezeCheckScreenShotTime) / 1000,
      'secs (> targeting 180s)'
    );
    config.lastFreezeCheckScreenShot = null;
    config.lastFreezeCheckScreenShotTime = Date.now();

    var rtn = execute('am force-stop com.devsisters.ck');
    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop com.devsisters.ck'
      );
    }
    sleep(3000);
    checkAndRestartApp();
  }
}

function stop() {
  releaseImage(candy);
  releaseImage(greenCheckedWhiteBackground);
  releaseImage(greenCheckedWithGiftBox);
  releaseImage(sunbedGreenCheck);
  releaseImage(redExclamation);
  releaseImage(islandHammer);
  releaseImage(bountiesGreenEnter);
  releaseImage(guildExpandLandPlusSelected);
  releaseImage(guildExpandLandPlus);
  releaseImage(diamondInTowerOfRecords);
  releaseImage(loginGearIcon);
  releaseImage(cookiePromoteGreenArrow);
  releaseImage(towerOfSweetChoasDownArrow);
  releaseImage(candyHouseUpgradeArrow);
  releaseImage(candyHouseUpgradeArrow2);

  var i = 0;
  for (i = 0; i < auroraItems.length; i++) {
    releaseImage(auroraItems[i].img);
  }

  for (i = 0; i < gnomeLabCookies.length; i++) {
    releaseImage(gnomeLabCookies[i].img);
  }

  for (i = 0; i < gnomeLabKingdom.length; i++) {
    releaseImage(gnomeLabKingdom[i].img);
  }

  for (i = 0; i < numberImagesPVP.length; i++) {
    releaseImage(numberImagesPVP[i].img);
  }

  for (i = 0; i < numberImagesWishingTree.length; i++) {
    releaseImage(numberImagesWishingTree[i].img);
  }

  for (i = 0; i < numberAuroraStockInTradeBird.length; i++) {
    releaseImage(numberAuroraStockInTradeBird[i].img);
  }

  for (i = 0; i < bNumbers.length; i++) {
    releaseImage(bNumbers[i].img);
  }

  for (i = 0; i < wNumbers.length; i++) {
    releaseImage(wNumbers[i].img);
  }

  for (i = 0; i < seasideMarketItems.length; i++) {
    releaseImage(seasideMarketItems[i].img);
  }

  config.run = false;
  console.log('stop clicked, change config.run = false');
}

var candy;
var greenCheckedWhiteBackground;
var greenCheckedWithGiftBox;
var sunbedGreenCheck;
var redExclamation;
var islandHammer;
var bountiesGreenEnter;
var guildExpandLandPlusSelected;
var guildExpandLandPlus;
var diamondInTowerOfRecords;
var loginGearIcon;
var cookiePromoteGreenArrow;
var towerOfSweetChoasDownArrow;
var candyHouseUpgradeArrow;
var candyHouseUpgradeArrow2;
var auroraItems = [];
var gnomeLabKingdom = [];
var gnomeLabCookies = [];
var numberImagesPVP = [];
var numberImagesWishingTree = [];
var numberImagesProdutRequirements = [];
var numberAuroraStockInTradeBird
var bNumbers = [];
var wNumbers = [];
var seasideMarketItems = [];
function loadImages() {
  candy = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9TPAfi86p4R1Pwj4p8FjW765tJbzVLjVr9JFvLAR7XidZGzINgIK8kqDxxXyh8ev29Pi58DPitqfwp+HP/BQTwV4D0TSEtk07wj4p8N6vql9pqPbxSbJLltIuzICXLoPPk2o6J8u3YpRX3+T8P5dmGd1VUTXu30t3S6po/laOaZllmFp0KdaXLFzimm4StFreVPklK923zN3dm9Vc/9k='
  );

  greenCheckedWhiteBackground = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAVABoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9hfHH7cngXwTe6hql/wCDPFN74N0HUZdP8U/EfTrCB9F0W6iz50cuZ1uZliOVmntoJoLZklE8kX2e48rsfi/8e/BfwR+HV78TPGlxcPZWnlR29rptqbi61C5mkWK3tLaJfmmnmleOKONeWd1HfNfnd+2X4A+IX7OHj6XxFbXMl98NfEuvXd5pF4u8t4d1nUb2S6ubO56jyLq8uJpYLjgLLM1u+Abbd5roX7REHgL4axWWoeM9Re18KxXI8MR6nPGmneDNOaLZMbIIokMsivJbo0hc21uxtbQRx3Dxn8Pz7xbxnDObYzL8fgJKcUnQcZcyq3dl9lct9NuZq0lva/wWZ8dYLJMzq4LH05QaV6b39ptpHTdt2++7R7l+0l+0j8TLrwVc/FW1+IXijTvireL5XhDSPCfjG+bTNO1WXK6dolrp0Eq2WsNvwJ7i8gnM7yTunk20UCQ/ofHrzmNTMFVyo3KpyAe4BwM/kK+Hf2Df2Zr/AE68sv2qPjx4cuLfxZPZungzw9qi/vPCthMuHd4+iajcIcTPy0UWLdSB55m+qv8AhID/AM9j+dfU+HeC4tw+W1MbxHiHPEYhqXs7JQoxSsoRS6tazfV97Xf02TrMZ4b22M0lPXl/lXb17nkfxGs9C+JHhjV/ht458PWup6JqltLZanp92m6O5hddrK3pkHqMEHkHIBrwH4S/8E+/hp8MviDpfjrWfHniTxZH4euVuvD+l+JTaPHb3S4MV1M8UCSXc0RGYnlZtjYkIaVUlUor6zFZZl2OrUq2IoxnOm7wbSbi+6b2Z0YnL8Di61OrWpRlKm7xbSbi+6b2PpTT/FWoyXSQShWDuASeozxWodUuAcYoorsb1O+KTWp//9k='
  );

  greenCheckedWithGiftBox = getImageFromBase64(
    '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'
  );

  sunbedGreenCheck = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPABIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2X9jfxl+zT/wT5/Zusvg78WfEPhD4gfCzxMIta8Y+ItG8F3lza2WsvDamJ3jmubo6naZggtknhtbZo3tbeVoZBPNcQ8B4U+B/wK+D+v8AiLxL4r/Z6j+IPxB+I/iW+tvhz8JfEeh2twPDdjLcyXFloNvbyGW3smt7ZYjd3LkR2SQSxxmNRO13paD+xz+078APDfh/xb4BOq+I31xzqfiTw3YSWNjfeFdZmdrh3sjJeiBrYuwSSJbljHOpmhZkmdI+++F2veDf+Ccvwx1j9t/9t/VpbTXtVQabp+gaVbm/fRoJFkuINGt5I12S3k5ty8907RwNJEiB1iijZ/wmtlHiFxBmP9jY6XscLCbk61FuEqlJ/DSi7uUXupyTvZb7OXw9GvxZmOZywmLpKEIvn9qnq4vaEVraW6k72S2vdM+4/wBnvQvHvw1+AXgf4dfELxh/amv6B4P0zTdc1OO5edbu8gtY4pphLKokkDyKzb3AZs5IBJor8Qtd/wCC4f8AwU/8Xa3eeLPBH7UPgnw1ouqXUl3pHhyX4f6fdtpVrIxeK0M8mkM8xiRlj8xmZn27iSSTRX7dHDV4pJH2y5ErXP/Z'
  );
  redExclamation = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAbABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yPj58YIfgj8DPGnxnTQJtXPhDwnqOtDS4JAj3ptbWSfyVY8KX8vaCehNflr4x/4KbX//AAgekfETwH8X/if/AMLmNuLrXNZ1LWgvhJJ/K3Gzi0NXe3ksGf8AdhjFHepFh/tLzAuf0u+Iy2Hjr4e694I1Aebb6zo11Yzxk/fSWJo2HTuGNfzh6fruo2nwUttcYTCMeEEuVuF/hH2YNuLLwpByD6EEHkV8PxhmOZ4KNFYSfLztpu3+Fq10/P7z9+8COCuF+Mp5m84g5fV6anG0uVfbTTs9ej7aa32P6V/gB8aNP+PHwH8E/HG00SfTIvGfhHTddi024kDyWi3drHcCJmGAzKJNpIABIorjv2fbdfh58BPBHgB0aE6H4Q03TzCylShhtY49pGOMbcY7UV9opOyufz/J+87PT5GTP46tYZGi+0FivBwa/B3x38R/gvqmjT/EXWPgH4f034mPrE2va5rNzrEy/Z/EokknNj/Yhf7GFhvf3f2WS3ea4SHLFpJDKf2YN/eI5RbhsDpXG3XwF+BN98SV+M178EfB03jBZUlXxXL4XtG1ISIoRXF0Y/N3BQFB3ZAAHQV89m2W18zhTUKrhyu+nU+y4N4vy3haripYrBrEe1puEbycOVv7Xu/Eu8Xps9Gj3Dwx8R7jVdCsb3XbM6fezWUcl5Z+aJBbylAXj3D721iRnviiuBa/vGRgZz0/rRXrrn6nyELVFdfkj//Z'
  );
  islandHammer = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAWABkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9H4/i7oP7OvxV8S/Dv9nPwLY+PPH2nXEen/EL4sfF7xpJYie9aCK9TS4ZrSxupW8uO6jnNnbW1tYW5uhs2ySSJW7o/wC0d/wU+8RnUPH2g/s8/BW80HQZ3tZPC1h8RdQk1HxK8aP5s1hfz2MFvbDzPLiSK5iG9klLSxJsdsX/AIKGfsA/Cf4z+BPHPx7+DngNdO+ND6CJtN17R9fuNLbWJrVQ0dteBJUt7kSRobcNco4VXAJVV48W/ZQ/bk8PSeCdM1/wv4geXw/NbxrZX4jJt5I9gaOKeEcwTeXsO372CDwpBPBBylVcKk+Xta2q+a3XVa/id6jQjh4yowTS0d09HZdnaz6aL71c+u9D/aw/Yt/at8L+IfhH8Z7bStKvtIiim8bfC/4v6bb2d7pirLG0U09rdFopoRKYWjuoWlgLmMpKWxUf/DEP7JH/AEVL4of+JN+Mv/lzXmd1oXwA/bY8XaPrnx4+EHhHxJofg1bpNGPiHR7fUba4vriOISuhmQhIkjABX5keRgWw9shrW/4YC/4Jl/8ARpnwa/8ACN03/wCN1u44rZJS+9foznnTwFTWSa+Sf3O6If2+P2qtX/Zr/Z8uPEvhvRorzXPEGpweH9A+3RCS0t7u6Dqs9wmQZIo1V3MY5kKqmUDl1/OD4O+Ifin8XPHng79jP4exaEup/wDCNpp/g74ja8pTUNF0rTY1KxXMUEZj1RIk2eTaSeXASqiXftDkor4PiTCUcyzTDUcRdxhKM42lKLUk3qnFp3tpvqm09Gz7jh2lTpZDiK8UubVX30SWlnpbXY674T/tl+KvBv7LnjL4t+GLeeO48DT3+keJNL81Uhu9Ws7aJrp7diH2xM7jy5mUSYGWj42n0L/h2V/wUf8A+j9vBv8A4auz/wDiKKK+ldSrWjDmk/hWza6vs12PDq06WGqTVOK+JrVJ6JLa6dt3sf/Z'
  );

  bountiesGreenEnter = getImageFromBase64(
    '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'
  );

  guildExpandLandPlusSelected = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAdABEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5F+BHw2+Lnx81jxNYfDm68OeX4V07R5bq11y4mtTIb6a/jMouI1lwsX2SMmIQlmWWRlYvGkM3e6v+xV+0ra+INM8J+D/FXhbVBqvizw/oujaxqttPbf2jNqmq2mn7JbeEyGyWE3EkrzB7gCOGIiORpZRb9X+zH+w3+2T8GPhxd/H7w74w+HNveeOLHSmTwF4sa9W6itLb7a8V3cXFuHSxLLckrA0csrB1Z1hH3vRYPip+2x+zr8TrH4l/FH4M2Glaj4N8P67rHg/SPDXhrxTqtxf+IksGtLbSNSgFnZy6fDd2+oXDR3M6NApiWRztKbvBxnHnBleVLB4HEwdWMuWrLm9xP3pJKT9y7h56tO2qd+vh7AeEcuDWswu8xUWrXny8/v8AI7r3Lcsotq6u4Lzv1v8AxD5/8FBP+hj+Fv8A4Ut//wDIFFYf27/g5E/6Ll4m/wDDOeDf/ljRWP8Arvwd/wBDGh/4Np//ACR8D/ZnC38//kx9ofs4fsoeNP2mLvSfjHof7QeiaHpnhf4k2dzqnhlPCct3qrz6VqkF4Y5roahEtobkRRuoa3lJt7mKbLCYKvrv7ZX7HfiXx98VNS/ais/2h/DfhbSNM8BW9jrGleKPDztbCOwm1G7+0tqIvYlsYyLxhI7W8wRYd+G+7Xwjrnjrwfqvwa8Hftn6l8LdMm1vw9baL41tEdYzdKlhc2+qGwjuzEXiWURPCZApCiVm2Nyp9v8A2vpfBvxZ/wCCg/jjUfEXw/02a88BaZonhjTby+t47mQMlq+rm6iZkzAW/thYSik/8egfcd+xP5xyTibgvA+FOMpYnLLqlUp06tL2kv3tW0V7TnS93WLdl/L5q/FhMxy2lw7V56HwyipR5n70u9+m34eh88/8Na6H/wBGtfFf/wAIFv8A4qivoD7NH/dX/vgUV/Ov1rK/+gP/AMqSPhfr2F/59/8AkzP/2Q=='
  );
  guildExpandLandPlus = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAASAA8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDvfDXhTTf2T/gr4n+IOo+FdE8R+M9M0q71e/8AFLAyzW/k2kxbT9NnYEWdoVJTzI41mnIWWVj8kUX0T+1N+z1pXwxh0f4bfE/XG8f6L4r0FhqGn6nY7I2ubOS0eWZVkeYIrTSRPHGQ5jUOrPIdr1xXw2/bG8d/sW+BfHHxN8C/CLw1440nU4P+EhuNXm8aSaVdx2Ntp8YSxh8vTrkXEIMVxcRlpUUPfSgIuWd/rf8Aa3/ax+Jf7N+p+GNG+G3wr0fxNL4gtr+a6Or+MptIW1W2a1UbfKsLoyljcnOdm3Z/Fu4/lLK8myHi7hTG55nGbKWLfsnKs6c74R81+RJSSldtx0slvskfn+Dw2BxeWVMTWrrnXL71n+71231vsfmL+w6zeKf2IPDmn+J2Oo2839o2UsF+fOR7Zbu4iWAq+QYxGAgT7oUBcY4rkf8AgnT8Vvij8YvCfiTx18XPiTr/AIq1uLVY9Pj1nxHrE99dJaRxeZHbiWZmcRK80zqmdoaWQgZZslFfA4j/AJJ/iX/sJh/6dmeLH/kXYz/HH/0pn//Z'
  );

  diamondInTowerOfRecords = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAATABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9btc+M/hHS/A2l/swfsgfCeMSy6YuleHdG0+2TTtO0ywjRI2f5FP2W1hRlVn2fJlFiSWWSGKT4t/aj+Mv7Ufwe8e6v4V+HHxV8I38theyRf2TrHge8Wa32Ego9xFrOyRtwwpCIGHzEJkA5tl+3x8d/wBmT9oHXtG06Hw7cad4pu7fUPA0+safIzfZ4LCOK405jFJGGkjn+2XQDbnMV8SjkROkPz58SfjF8RLj4h63d31st29zqk9wL3U4JFnukkcyLO+WGTIrB84wd2Rwa9DwG8B+G/GDh7C8V8X06GPVaknThCTjTorm1oqMWmpQek3JufNeKlyRR/Jni14q5/hMXDLcik6eJg25uUY8jptLl5OZNSvJyTa25bN30X1L+yv+2XqHx0jm8OeKYP7K8RWMaebHbXjvBd/L8zIr/NC2VdvKbeNv3ZZTHN5ZXwVoHxW+OC/F7VrWw+FcUkX2yWHQtM0tp9M17VrlIoxeC3n80fZbeIoXknddkv7uNdzTgqV+HeN30TvDDI+Pq1PKeIMJllCpGM44bEzbnTvdNRk5OUqbavBy97Vq7SUn73DfHvFtbKYSxeXTrz0vOlOkovRPVTnD3le0uVOKatdNOMfpr9sPwtoPif8AZn8aTa1YCWXR/Dt5q+k3KSNHLZX1rA81vcRSIQ0ciOoIZSOMg5BIPk/ww+IPi0fs76d8Tk1JF12X4eDUZb9LSJTJc/YhN5jKF2MfMJOCMYwuNoABRX6N+zwxFerkmdYac26aqU2ottxTcdWo7Xdld21PhfGzD0KuCy+U4Jt1XHVJ+60rr0dldbOwf8Ew9G0zW/Bni74o6vaLc6+3i+80RdTmJaSPT7by2htkzxHGGdmIUDex3NubBooor+F/pC4vFYzxsz6piKkpy+s1FeTbdk7JXd9EtEui0R+04aEKeGhGCslFaL0R/9k='
  );

  loginGearIcon = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAATABIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8/fgj+yN+1x+2hrHiPwn+x58Dp/G2o+FbK2l1/wAnWtPs4tOa680WqyNeXMIYuYZDtUlgiFulfTH7Y/8AwbWft0/AGLQ739m3xZJ8e7e/gvpPEC2ui6d4bk0Mw+QYAq3Opu135yvcYWNSym3AP+sFd9/wb5fH/wCBv7P/AMfPi/c/H79uOx+GenT6JZR6V4H8Y+I7TTNG1ae48oHWreW8uhG17CLM2zoIVxG8bFpMlU+j/wBhP9ibxf8A8EYfgt8bvC/7b/8AwU/+H3he4+MctzcfD7XZfGTia2vILe4S619bfVXQT6jIbuyeaKESjNpbq8sm5MfT5tmeM/tGpFSsoNpLy8+/z+R5+DpU54aMt7q5+AsHizQbiFLhdYtlEihgrzqGGRnBGeDRXKeKftfiLxNqPiBdH1LxAL+/muBr2tyyR3upb3LfabhRPLtmkzvceZJhmI3t94lQsyxDXwr/AMm/yNvYxPob4/aPpGo+C9Ru9Q0q2nltdPuWtpZoFZoT5ecqSMqcgdPQelcv4O/aX/aI/aZ0/wAVy/tLfHHxZ8SD4b8HSHw5/wALB1+41saU11qWnQ3D2wvXlFu7x4UvHtb5VOcqCCivezmMf7bpu32Zf+ksz4YbUZeUZ/8ApEn+ZyWB6CiiiuEo/9k='
  );

  cookiePromoteGreenArrow = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAASAA8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDjf2aP2edK/wCC0nibwp8Y/wBs7wTeeAPgN8O9Xu7i48NaT4lmur74j6kCkYs4NkNuba1gKSxz3vBJlltrd1lFxLa4v7dX/BLQfslfFGy/a3/4Ja+CPEd54YisG0nWvg3b6jfahqGjxyuStzp0shuJ7iFpWBliAkljZ5JBmGST7P8AZX7Lv7M3j/8AYo/aE8e/sJ6v8fp/Hvhnw54Q8O6/8NkvtLS0vdN02+vtfhe0lWORkuJIxYQb7mNIvNZg7RqzV5p/wW9/aW+Nn7Ff7KmifEf4MeJv7D1/UvHNrpokmZ1eW2a1u5ZAqo6MRuhjyQcDjPUV/IuceOfiZm3jLhsDl06SXPFQjaXJVhUhGUfatpO6jbWMYqMr6SV7/L8R8S8SZvxO6eMtKbcU2rrorPmjy8rStZxSs9d9T5S/4OzPiJ8QPh5+3d8OPE/gDx1rOh6ld/CRbW61DR9Tltp5oF1S8dYnkjYMyBmZgpOASTjJr8w/Cvxl+L/xO8ZaVofxJ+K3iXxDZRTyzRWeua7cXcSSiCQBwkrsAwDMM4zgn1oor7vw+/5lX+GP6nXX/wCR3H1X5H//2Q=='
  );

  towerOfSweetChoasDownArrow = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAeAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD85vAPiXxH+0J8R/C3wb8KaRZyeKPGfibS9B0qW6xAlzf3c8dnbedMCwSMPMoZ1jB2jcVdlFfon8Qv+DXzw94jVdQ13/goubSG0LbLj/hSKrtQno7Nr+D27DnPTJFfnt/wT6tPBVj/AMFFPgfYWHjq2a90z49+CHS2iu42ivEk1+xK+UsjecpVSSy5kC7T83Ir+hDxffa14v1CS71CSTyN+be1Dny48ZwcAYLcnLdTnrgADzqOV/Vqko11eadj6vNc3r88Y4eVo21Vlvf9D8sz/wAG1/hiz1uPTPhV/wAFD7zVvEMx8rRIrr4PnT7Ge8YlIoZ7tNYmkghZ9oeaOCcojFljlI2H804NXtruxt9WvbpYTdwpKPtEoB5UHGSeTX9PPwu8NQR/FHw3c+SAya/ZsRtJBxOh9K/m0+E6fAS08HaZLe3vhe71GbS4Gvf7b1y3Z0bYuVCEtswTjGAR0PIqcThI6OCsyspzWveaqyvtbb/gH3Z/wTK/4K7+Mf2IdFf9mX9o/wAUXtj8JEub278C+KdCt3ij8OT3N1Ndy2N7DbAM0E1xPL5dx8xjkdEfEL5tf1Q8OeIvCuu+HrLxP4f1Ww1LT9Rs4rvTtQ0+7jnt7u3kUPHNFIhZZEZSGVlJDAggkGv57WuILrTZbW8tUmhlVklilUMrqQQVIPBBGeK9B/ZL/bv/AGgP+Cf1pr2veDdRbxT8LNEsIH1D4Y63qsiR2st1PIqT6bcFJTZsLht8kW0xSCaYld/lun2uc5XHCJ4ik/db1T3V+3l+K8zxsZhVF+0j1P3J8b+O/AXw98I3nj34jeLNA8OaFp4Q3+s+IdSitLW2DusaGSaYqiBnZVG4jJYDqa/Gr/grH/wUi8X/APBT24f4DeB7l7b4Q+FvEkep+H/FGrx3Zv8AxDfRQz25u0gklVYbQpcSGIPGJipVmKGR4IuF+Mv7WPx7/b/+N3g2/wD2jNTs/wDhA73VRr/g/wCGenHfp2mwbPLQXTtGj39wERsvLlVM04jWOOYxDy5r1JdTvJkgAje7laNDztBc4FY5LgKGPxFsQrxtey0vrbVrX7jLB04yqrm9T//Z'
  );

  candyHouseUpgradeArrow = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAQAAsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7O8IfBr4c+H9T8c6fqXjCz1OTQtZn0/wrP44tn1e0knitYMpLZ6fJa/akhvJLhJvtEgDrbLCn7zzpU9b8N/8ABQv4H6TolvpXxu/Z98b6Z4ptUMOq2XhL4M+IPEuloVJVDaanp+myQXUDRhGRspIqsEmht5lkt4/zg/YM/a0+BP7JvgLxB+zX+17+1xY6Jd+Ddbs9O8CQ+N9SQSP4dTRtNEH2dkgjDwLcC8RRtYxlGjMkrIXPiv7UvxF/4Lk/tN/HvxF8Zv8Aglg/xC8RfAfUZ4bXwPrfhm0tP7PvGs4I7K/kgMwDtGb+3vMMRhvvD5SK/l3Jc68R8fx7jssw2Eo0sNSh7spqrCnK0lZqpyPmnJT1jypWhpZxblw1s64nq57iMLWgv3eiu5aWdnrrv6K+5//Z'
  );

  candyHouseUpgradeArrow2 = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAA8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9BvEP7IP7PPwt+Kll5+q6haaXqqi91jRbDxAq2MEPyxi4fzI3uo1McRiigtmG5o0VESOO4mh2L/wB+xD8SdAk/wCE+8LaP4Jn8J2ph0XxBp+rC2nbS55oi2bl8faN0+0zRzqzxyyqx5ljlk/LiL9rz4bfsV+P9J/a6+JNz8QdY8M+KPDjeCLnQ7LW3vXtnhuJL+waK3u7hYkhg8vVFVUkQJ9vO1MM2Pur/gkF8WPgT+3p4y8Y/wDBQvwb4S8QQWPhOyT4ceGrbxLc7bizkZodU1WZLSKaS2QXAuNHTzSzSn+zyv7teJP5/WZ8QT8RVltPDU44B0nOU9OeTaVk/euuWasklblbbu+Xl9HMsbn+X8VfUJyTpximpJu+qv8A8Da3qf/Z'
  );

  auroraItems = [
    {
      name: 'column',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'brick',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'compas',
      img: getImageFromBase64(
        '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'
      ),
    },
  ];

  gnomeLabKingdom = [
    {
      name: 'craftsmanship',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'smithy',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAZAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6u8bfF/xH4iklFtfPp9gucRQy7SV5yXcYJ4PI4X2714Kf2u/g5e6feah4dm1fVF0u+t7fWoo9FmtZNNWaJ5kmlS7EJKGONyoTfJIUZYkkZWUdBqz2Hj3TvFvheXxzrGi694WvYLybSl0+xfTtY8OzwIryMLiKaV2S481JZF8qNU+XlgWHkU+kaV4Pln8FaTqfg9dO8TQz32naJqyW2j2c8sBjeS7F3bW6hGtrQzyGWTznaBSPLm8pUbatQq4SgsXUs6Ss5K9pWbW2nLs3uzfDwp4mToRT9rL4P5dnfm69rW8z6S8I+NbmG1tfEvgrxJutruFLi1urK4Dw3EbKGRxjKyKQQR1BBzXqHg743aY2kra+IxFb3EPBkO8rKCScgKrYx0IP4eg+av2abnRr74bPqHhO6jk0KfWb06II2hbbEszJIS0TsGL3CzyfNtcCQK6RspRfQKybpt3pu8Xs/LoZShOnJwmrNaP1W5wfxj+F3ifxLqmhfFL4U+IotJ8c+Drtrvw7cXzyGwvdylZLO8jQ5MMqFk81B5sO9mTcrSxS48vwXsPjh4f8Xat8W/AtzoVz4ztxbx6NcaiL2XQgsfMsDNNcW6Tfa2muI5oVi/di0DxK8O0eqUVs8RUlhnQesX/VvTqTG8Kimt1sfP37Pvw/+KP7POs/8I0mqaVqXg7XpIbltaljuFaDVPJihaKdAZGskmATZJ++iMlttLiW+Cw+56Lr0Grr9nms57K+jt4pbrTLzaJrcSA7c7GZHUlXUSRs8bGN9jsFJrz74x/8kNtf+xr8Hf8AqS6TR8Jf+Tifiv8A9dtB/wDTYlfd8T8MZRk2Xc+Ei48rirXbVpXdte1tNdtz+c/CjxL414y4idHOK8KsZQm2/ZqMuan7NXvFpXn7S87xteKcVG7v/9k='
      ),
    },
    {
      name: 'bakery',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7U/ac/av0X4E2N266Be+K/FDaVc6u2i2d0qNHbR7t13dzvkQQtJ8gbDyOxby45PLk2fI0X/BU79qrWDP470nw18MrXwfDc/vZrtbmWW3X5cQySreKfOO5QB5AYl1GzJAPP/tz6VfeIf2nPHVzqd9fzWsOsWdjMwRnWyjXTLCZYo9xAKYlExQEKJJnJwXJPH678dviLqtxa+B7Ux23w0sLEabZ/DkMjWX2DDBt/wC7CveuXkle+2CXz5WeMRKEjT+b8Xm9eGJnCLsou3+d7p/LY/ozL+GaSwNGq6XtHOPM220lfZJL+tN1sfav7JH/AAUK+H37TmtyeBdW8PN4Y8SYd7Cykv8A7Ta6ki72It5zHGWlWNDI0Txo2zcyeYsUrR/RMd7dxII4rqRVHQK5AFflP+zf4d8PeH/H/gzV4fEGo298fiFoaTz2u5I0hfUYI1jd1xkyyPHEVHylJGDbtxA/VOvVyvGTxmHcpbp2/BP9T5viLKoZRjIwp6KSvbtrb7jxz9pb9mK5+K2pJ8QPAp0v/hIYrAWV3p+uGRbPVbZGd4ozNGrSWcqPI+2eNZAUlkWSKU+S0Pklp+y94At1tk8a/sTfF681VMf2jdeEfEnhcaY75+byPtmqRzyIOzyRROw5MSE7QUUsTk2X4uu6s4+9tdNq+29nZ+trmOE4gzfBYdUKVVqK2Xb9beR5jeWvw9t/i74f8OeGLOKLx9e+GYdSNjDC8Vl/YiahbSXN5MqbEW5WWOMQ3EDLdLcGB23Rxlo/Wfh3+0p+2R408E6d4x+DfwZ1jxh4U1a3+2eHvEt/p+j+ZfWkpLxuPN1yyl2BWCp5tvHLsVfN3ybnYor+oPFTHYXLsHQksJRm5VJr3oPSyTduWUfibbl3eu5/DHgDkmLzatiX/aOJp8tGg7QqKz5nUVmpxmrQjTjGFknGN0nZ2P/Z'
      ),
    },
    {
      name: 'candyHouseFaster',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9RfiF8SvEXxE1RrvVLhorVWH2XT43PlRAZAOP4m5OWPJyegwB5/49+IGleCE0zTWmtJta8QatBpXhnRp9ShtpNTvpnCJEhkIyFBMjlQzJHHI4VtuD5n+2z+1t4E/ZZ+FGreKvE/jP+yjZWkUl5NYrDPqKCYyrbwWdvLlZLy5aCdIWlVoIhBcXMqyR2skMnmV3+2r8HNd8K6b47+H/AMNtQl8GfFHQrS40jShNK8viS0HnJd2ur38gee/NtfXOoWcmnyTT2iRLCFgWOaNj+QzTjReMxHNJX2Su3+KSXnfQ/S8JhZV6scPRstOui0/N9bddbtHuPwt+POr+JfEE/wAN/i14Ag8I+MNNuILHWdKtvFNjq1pbapJp8WoNpq3Fu4c3MdvKSyyRRCQ212YDPHbSSj16Dx740toVt4vFF8ERQqg3DHAHQcnpXxF8KPEfxi+Jvxoh0HwlcS6RpFxFb2tv4F8L2qfbEt3k324s4pB5cLQPaJPGZ2htQLVhKPsYuY6+r/AXiO48W+EbHxDdf2az3MZJuNF1RL6wugGKi5tLlABcWsoAlhlKoZIpI2ZI2JRc4VHUw0cTRTgm7NXej3VnpfT1s7rte8dg1hMR7Go1J2T/AM9Lu2v3r52+P/8Agt9+zhqf7QHwG8IWHgLw7pUvipPG3l2l9chYbh7b+yNUZ7ZJ8ZUM4RtpZULKCSMA18Tf8E9f2n3/AGJ5/E37Pnxv+HGtajNZXM+oeG49C1OzivtM11o0tpUe7kWVWtriExCUMtwqyWltIsRZS4KK9rLZKvhHh6iThZuz9T6HhvC0sdjI0Kt+Wzejs73T0a1W1vS66n1N8TPBcdx8M/HOtXWi3fhzw/4pSfV/ih4CfUE1GR4bWyutlnZ3TgxGS3leKRTKjq72NvteCMNHJ7r8Nvi/8XvhT8N/Dvwv8GfDnwhrel+G9AstLstV1bxpeadc3KW9ukW6S3i0u5SI5QjCzODjPy52gor+pYeH/COaZbRjWwqXuwl7rcdZR1+FrTRad7tbs/yyzTxo8TeH87xX1bMpyXtatNKoo1EowneNueMndXa5r3cbRbajBR//2Q=='
      ),
    },
    {
      name: 'fountainFaster',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAcACEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9tde8e+AfhDpmLXRbdb+dpUjs7GFI3dUdlDSMB8q5GMnJOTgHBx5rr/7Q/wARNXlU2F3bWEaPuWO2tlbOGyu4ybuRjtgH0rjdX1a/13VJ9Y1S4MtxcymSaQjqSf0Ht0FfIv7RHxJ+Kvxw+KGs6N8CfiHfab4T+Gn2W01W+tdUl0rTvEfiG5nnguNNbURGpc6dFFG8sdvcIiy3oWdg9uIW/P8AALM+IMxjhMJJQT8+VJd5S6Lu9kfUY2WWZBls8bjveUd9OZtvRRjHq29Et2fc2nftB/FWxuVnn1+K6ResFxZRBG+pRVb8iK9G+G/x50LxZqsdjrsK6dfSW4j3M/7mVweArE5BO5vlPsASTX59/AHxt8SPgf4y074W/tCfEK51ey8auR4Mv0WfVbXTtTV7ySXTJdYRDE3nW0UNzbRzyNKcXMYkbYkMX0UrMrBlYgg5BB6Vnjv7W4fzGeFxEuZx8+aMl3jLqn0a0NME8p4gy6GLwqtGa005Wu6lHo09GnqmfW/22z/vn9f8KK+ZP+FnfEL/AKHPUv8AwMf/ABoro/t+l/IzP+w6v86PIv2gfHfibw9pvh74afD3XtL0fxb8Sdek8MeEdf164SPT9Jv20+9vftc+4N5myKymMcAX9/P5EBaJZWmj+YPHvwyn+HuufEL4P6H4hub3Rvhbrvl6SP7ftLjXNUvb3UZ7qa+W8fKLO8zSzXK/IdyBXVGTyx6v/wAFR7fT4f2TW8UzaTaXF7onj/wnc6VNdWyyG2lk1+wtZWQkZUvb3FxA2Mbop5UPyuwP0N4c/ZY+CnivwB8N/Hlx4V+zSeNhaPfadbSk2tpLc2Ut40sSSb2crOC4WdpUO5g6uDivqfDfNctyqjjZ4jmUnTdpQjGUotNa2nJR2ezTT1vorP4zxUy7MMfDLVh+WUXXtKE5SjF6X3gnK9rpNOLjvG7enwr4S1iy8VraeH/2gfiUPBPga20qPV9b8R3MtrBd+HLvT9X32dzNe/Z2S6vFawilghkE0ckj+UsRWSSI/Sv7HfxY8b/En4Vnw98XJ7W48b+DbmPQvGGp6ckq2Wr3sdvC51G0E1tbSG3nEgdSYI0D+YsfmRoksnEfHb4deDfCXxk1HSfDOhxWdq8Fxbz2yEvFMI9T1G1Ysj7lAkSFS8agR5ZgqKpCjwz9nfxz4gf4m/s56fY3X2NviAdUv9Su7Zm86xibTzrEmn2rOW8uyeZEia3YOohji27ZIYpU/ROMeGcFxZwtTzqlVadOjzR5oRTkotuSkouycr6cvuxtotdPwfgfxPzXg/xDq8KVsLCVKtilBuM5+45qMYuPMnzKKjaXN71S6fNFw9/9AaKKK/mrkfc/s8//2Q=='
      ),
    },
    {
      name: 'flower',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6x+IXxSutXhfRNJuvs2lW4Ks4O0zqP4mJ5C4HTj1PbFTS/h95ZuX+JviKbwVHHbPJZR6x4fuZb3UWSSNJFtrIbJp1j82MyOgbYZYhg7yV4fxh8VtD+Cun2/xJ1zUFg/svUbe4tENvLMZ545VkSPy4Q0jglPm2jhA7HAUke2fGb4S/GCP4raj8bPFepzxeFdb0rRteTVfDniGW40S20nTUsrua2l1OO2ZJrQXcdxL5dzb28c1tqck0LiSK4WP4bjjiTH8P5ZOrg6XtJJK6V243vq0tVHT1d9NmfQcNYLLMzx7oV6iUoq/LdXd9l11erV1b3Wcnrnwf8Wada63rXh/y9e0fw+sb6lq+mYIgjeFJwZocmS3dYpEeWNxmFWDOQhDnEtPFPiewt1s7DxJqEEKD5Iobx1Ve/ABwK9Uuta+PP7Kn7HeveO57+XRb7w74J0DwjqniPxppNze31+++1tjKLqeCG41S5tTdX8qTtZx29xLdElOJa8U0i/0vVdKtdU0O/hu7K5t0ls7q2mEkc0TKCjq4JDKVIIYEgg5r0eEs5x2c5TCtjKfs6jWsf+3pJNX1tLl5l5PdnNnODwuCxbp0ZX8r3a0T10XV2+Wtjzb9p34M+Ivino+nap4KkRtY0wzQW9vdX8lvBJFceWHZmTOCjxxSZKv8iSKEYuMfCXxq+NX7ZGpa/q/7FPjn9qrxBaeEdGv5NO1HwzPqF/NpN7aRbZ4S1sLuQbGVYZVhB2gvhwG3YKK6M1y/CwcsXGNqjsm/RGvB+R5Xic+q16sG5ThZ2lNXS01UZJPR9U7WTVme5fs9eE/i5+1b8Irfw9q/7WnjnULTwV41ttN0TTPEOuzXmkJYw6daK8VvFKjSWEyLPIsMyB9oCo6yDc5+n/hFFBYfD+y0mbxxerLYS3FncQa9pfn3ttLDPJE8E8sM5ilkjZGjaSL925TcgCkAFFfvXCnB3DeKyHB4iph17SdKLlJXTbVt2rd9el9T+EfFLxA43yDxRzfC5dj504U6soRuoVOWCbtBe1hU91bq+q2TSuj/2Q=='
      ),
    },
    {
      name: 'diner',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6c8aeNdR8UXjvc3bpYwuxtbZmwsSc4J9TjqT/AC4rzhPjj8Pb1Wk0C/utViCho73TbCWSzmGcfJdlRbuQQQQJCQQQeQa86/a71681HxToXwat3tbmbxJ4R8RXmgaBeSrHFrOtWf2D7HbSs4MZj2z3L+XKVjZ0iyykA18S+I/hb8dviXLceNfHGs6rcXFnPMviGSfUfstzbCO78hlWF1DLieXy1TLlQxby41DKvgY/Na1PFSw9CycUm3LW9+yTX3330sfp/A/h5PizDTxMp2jHonbrZa2e78l016H6X6L4ti8ZtdjRvENhoVvpGnDUdd1HxFbkQ2lsS20kiRFKssczGZXdE8rDDLri94Q1W41/wnpeu3gbzr3ToJ5d+ny2h3PGrHME37yE5P8Aq3+dfutyDXyPqH7Mf7TP7Png/wAB/sK6t4Y1vTT401G28Q/EAxzrI8um3F35S6ezQO0tuVghMlxny2RI40y6TzKPpX9nzxkvjr4WWusR+IYdYjtdT1LTINXgn81b+Oyv7izS48wEiQyLAHLr8rFiy4BArlyXGZjiMyrRxcui5YpWSS0be7Tk9Um9vw8zi3h/D5Jg6PsY+7JtqTd3JO9n0VtGlp0T1vd+cf8ABQL9lvxF+0f8MbDVfhsLceMfCd497oS3EgjF5EygT2YdjtjMmyJ1ZvlLwIrMiszj5p+GP7R3if4rQPpGs6u8us6XeTWt2+vWcGrXFhcLJmVYpL2KaNVDIwDKG46Ciitc/wAJQqKNWS95BwbmOLpOdGErJK6aumr9mj234N2GhfGH4X+PW8X/ABE1htG8L+LpJv7RaBILZo7fStNuZI73TbRYre9tBIrMbcRq5G7y5EeR3f1rwR8Iv7C8M2+meAPEniXwdpKtI9r4f8PXmly2UBeRneSJr3T57giV2aY+ZIWBlIwuAilFf0Hwrk2T1eHcJKeHg26VNt8qu3Zq7a3dl/nsrf52+LnGHF2WeIOaPD5hXiliKsVH2tTlS92Tsua2rk35O7jZynzf/9k='
      ),
    },
    {
      name: 'materials',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9JviV8R7Ux3vxA+JHiez0+ztYd91f39ylvbWkIPdnIWNBnqT1JJJJJPzP4x/aQ+JWiWnhj4geG/GcN9d6rZzT+IfBV/of2bTdHRWLpbi92m4lumjUx+aB5W9lbyesa7H7cOr+G/C114T8XeMNWguLG2TUoIdAuF+U3cscXl6kzrloUgRJrZpQAqpqjbmVWIb5Z1P9uL4orZm00f4feFdGWxhzHF4jtLi58naAA0ixTRj5WG0Kskm47ckcrX5N4L8MeGK4Wq53xRKGKq4nmh7KUXKVJJyi2tebmleM1UXLy8qjGV+dP4rxezP6QOZ8b4fIuAculSw1CCnPEzmqdGo5pcqT0UnT5ZRdN+0UufmlBJQkv0D8KfEz4feOYbOXwl4z02/Oo6XFqNrBb3iGWS0kVWSby87ghDryR/EK7jwf8Q/EXgiJ7PS5t9rIS32V3YIrnHzDaRg4GK8w8M/tw/Duy/Ym8C+Hfh34F0rVUuNFs4fD/hq7sBd2WjWunmGIW87b0aSS3ngmjRkUYe1VjtK7mu/By81a/wDhrpV/rrvJLPC8kTtfrd7oTIxiZZlz5iGPYVZizlSu95H3O35H4j+Flbw5wFDOcBjXKFSfJG65Zu6cuZJaOFlaV7WbW99P6K4e4kXEFepgcXh7SgrvqtGlbyd9vRlH4keE/HE3xY+HfxX8F6fYX6eEdbnl1jTLjU5LG4ns5odkhtp0SRfNUqpEMiqkvQywkLIPjH4yfCfxT/wUl/bd1S58JatrHh/w2NI0+78cavrMFlHqNtahIoLWGBbZ5Fa4nn0++m5LW8SyuzqzYimKK8fh7ibNcBw1iqVFpKkouOmznOzfZ2vdX2flofSQpxneq/iS5V6N3/P+tjd+J3w/0X4K6Kmi/DXU9X0TSPCOrXlrovhbTNYnhtNbnm8+ztbaV0YS2shuLkulzC6BJ55LiRXdjKv0J+zP8dR488XeJPg095Fe3Pgqz043cyWYt5LNbiANDDMEVYZWcRySrJAqIFPltFGY1eYor+vfHnJsoxHgjTzCrQjKvShhnCbvzRc+SM2mmviWjTvF725rM/gnwCzziHEeMlbCzxtV0ZPFc0HLmjJU53hFqSlZRlOUouLjJaR5uS8H/9k='
      ),
    },
    {
      name: 'goods',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'latte',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAWABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Q8S/Ef4h+P8A9pbwv+yr8INU0/TNT8Q300cut38XmpaJZw2t9f8AmR9SfsdzAkKLjzZLl3aa3FmIr3ET9lf4ga34d8LeIPD/AO3l8WNG1DxFb20cV1qPhuPULGK7mc+Ulw0VoLa2nbdBG1pJIvlSSugmnMQEnzH+1p/wVN0v9m/9otdb8NfC241q7t9amsLSDTdaax1PTntrqW0uLqK5W0n8ma/k082ot1WWN7eyt5ZtrvGlv9b/ALL3x4179uDwPqfxq+CH7WdikV1qMVl4xltvhxBperQoI4p2t5LsRwTM4ikQLOu+IsG2ljGyj8yWUOdCMuRttLZrqlv7y632vo12s/1CGY/VKV3KMI9XKPNd3ez5J6Wto7ap2ve6x/2evit8YbT4seIf2YfjrqOn694j8IWNvPqHizR7Zbe1u/tO6SBPLO1hNtWeOSMRhY3s3+dzJsi9syfWvBvifF8C/wBnzxRY+Hvg62meItN8TzWumx+KtQt3/tddf/tS10/7dZ6kEiinjsn1GKGewt2CDZdxTRFri7Ne81x5hgK2AcI1FZtdn0duv3PzTOKnmGDzKc6uFacLra3ZO9k3a97pdmj4+/bk/wCCWuj/ALROsy+PfhXd2NlqVyJmv/D+oX8tlY3lxNIhecTRQz/Z8nzZpFW3ZpZiHWSBpLhp+G+Anjj4N/sx+A/Ff7Gn7O/7NOoXmrf2Rq9x4p/4Sz4v3o0nU5JIpBI8tvDZNbz7EEcUatZodkKFmMheRiivWynFYh07OW2i/AWIo061LknqtdLv9BPid4q0G++OMnwk/s0t4gs/ADa7qus3Vsk0E3h5tQ8u4014mbbeGb7JJFsmULEsgdHPzxP3nw00f9vb42/DzQ/jL8G/jxbeHfCfizSbfWPDmj6jqNvdXNvZXMYmi857nSbmRZWRw7xefKkTMY43aNENFFfvviniZUsNSahB/vJL3oQlsltzRdvNrV9dj+Ifo75Ng8Ri8ReVSNqNJ+5Vq09ZSle/s5xuvdVk7qN5OKTlK/8A/9k='
      ),
    },
    {
      name: 'milkWell',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAZAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9DPj/APHPW9AsLfxBeaHqHiDV9Quo9N0HRrFG2vKUZlVnwy28CIjyPKwOAp2iSVkjf59+Nv7Yniv4PeENT1Lxvq2m2fidJEk8MeDNCaKa6vHlH7iG5VhK8tuSsm6aMWxPAXD7Y5PSP2qPgbov7RGi+E/hle+FbPxFqV14wjbQPDGoapNY2+q3X2K8VkluYGEtvHFbtcXTSRiRlW0JEF1zbTe9fs4f8Ekv2T/2ZdZ07xj4K+H32rXbDeYvEuv3bXl2uXVlCRH/AEe2ddoHnwqs3XbIgZgfyzDZPi8ygq6qJRu+Zu9/y1+/1Pv55zl+WQlQnR5p2Vu1u2+nndN9jkbebUBdXul6zodzpt/p1/LaXtjdlC8ciNjIaNmRlZSrqQx+VxnByo2/DPjfxV4OeR/DetS2vnACVFwVb0JU5GffGeT61tftf3nwa8J+AH1jwwulabrPh/R9X1WE2MMdvNcR6bFNNcxMH2O8ckkTREKZcmR5RGxiE0PIV1Z5lMsmrwqUpNRnfl3TVnqu+l9+vY87KsfLMaUqVeHvQtfs79fvTuuhk+J9O15rnSPF/gue3h8Q+GdXj1TQprptqeaqPFNCz7X8tZ7aa5tmlCO0a3DSKpZFFek67/wUI/Zt0TRz4U+Lvxq0zwFqmqwGO1s/GOvwafeWxZBlz5jGJ1Utt81Wkt2ZHVZHKSBOMoqMnz6rlcfZuCnG97Xs0/Wz08rfrd5lk0MfUVWM3CS02umvNd/M+Jv2hvHngDxZHcnXfig6aZ4h8fXMHhxpDBdJ4lvBeLZwI1oGMOowultaAyQlM2kS7ZorTelewfsc/Gnxl8QJrnwdrEN5fQ6PpMMOqTiU3kGhapBtgn0xtSdgb+bcrllIknheCVriUfabeMfG37cH/Je/jT/2Sfw5/wCrHvK+3f8AgnP/AMo/Pgb/ANkh8N/+my3r9H4z4nw2YcNUqM8HDnkoJT+0n7OnNyVktXzWte1lqnpb8S4B4IzLBcd4vMv7UrOHPWm6V/3bUsRXgoNNyXLFxclZJqT9xwTnz//Z'
      ),
    },
    {
      name: 'ballonFaster',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'materialStorage',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAZABoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7e/a0+Jnif4X/AAV1Dxf4V1RbbUn1PT7c3RhE88VtLewpez28RDefcRWhuZ449km54lzHIMo3xw3xs+Cfxe8LW3wc0jxn8QNJg8S+K5mXW4rPcmi6nq1xJFJqj29zcxtA8ckqv5ikPGDGYyoQFOq/4Kjf8FCo/wBlT46fD3wDN8P7bU5NMns/F+nTy65HbGe6jku7ZLdkaCRtg+/vjaOTcVCsAGDfHH7QP/BRHw7+0d8Yj8ZvGXwg1DTrt76wurnStA8WW9tZXDWylWWRfsDSMJ8s03z5Yu20oDivmuEM9zbh7CyWEo071HrOUbz5HZOKd9E+1nq7nqcXeEGTeIeNwmOzPHYiEaCcoUqdb2dKU03yynBQbk9bX50re7bV3/Y7xh4s0XwD8TNN+Fn/AAsLSPFd/qMpWZtDsmtW00fZ2mUypJNIsikRlT5chlRpYt0IjEkydIuraqihE1KcADAAlOAPzr83/wBkn9vLx78XfixafGyb9mK/i8If8JnY+Gte8VR6obu307UNYuPJgEa+XF5k3n3FqJJSZmt4Jwp8sXamT9GK+V4gq5LLNJxytpxhaM9VpUspNNJ+47Si+V62als0fVYKjjcLR9niakZTT+y72XRN9z4l/wCCiPieS0/bf+Aum3/iay8P2en69p12niG+vxbRWLSarbiSeSUn91HEsCSGQ4CjJzwa7H4i678FYNGjPxGX4NfG/wCLNr4S1C2i+Oa/FzwXpaRajJpYi08tY3t5LFrX2abZF9s1K1EirCJBbzFVR8X/AIKff8jP4R/68Lr/ANDjr4k+PP8AyKFt/wBhJP8A0XJW+WqKorzt+Hk7rpvuujR9xDO51Mqw+DULezjOPMpOMnzyk/ijyzS96zjzOErLmi7JL7iuPjf+zj4h+APi6y1b4JfEvW7DUvidpFnq2lyfGxPEGtal4geXRV0+S11uDxJdLEUkk0sLt1KEQmE5VOd/SWXjz9oHSbOHStD/AGMfj/DZW0SxWcV38RvCd1KkSjCK81xrM00rBQAXllkkY5LO7Esfj3/gm19zxX/2UP4df+na6r9Wq/HMq4HwOXZlmNOOKxMv3+reJre85UaE+aXv+9P3uVzfvSUYp6JJfkuV5VUp4rFwdedo1GlblWnLFpP3dXrvp6H/2Q=='
      ),
    },
    {
      name: 'goodStorage',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3v9qf4sft0+NPG3iL4Y/shjwb4e0/w3e29hqfjHW/F2jQXUV/JaWt8Ixa6jKMx/Z5yCBC27IZJgUkjHmviO48Nfs/fCG8/ZH8RftK2/hq78OeHodJ1bUptDVIopLrTBNPNaEPBN5KiWVYxFGuFt4SnkJhh4/+2V+1V+0d+zp+3t4/+Gfwd1fxzPe6nBCuif2PdXFxcfZZ7L7W4hU20mTFcXF0Y2Ut5McaxqVVXQ+F+I/2vv2hPGXiy28U+KfDXj7VNRt9Ll062fUYJbhlhlkhcgmSyZpW/cgBpC5Akk5y+a+SwmHoRwFNUHySly3ly36XfVXfbXS/yP6R4ZxGV4NUvbrlTV5uMbyd77802mt0rcqd22m0j9Wf2RP2kbn4p32tfCDxH4c0uy1Hwjp9hLp2p6HMVsdb02ZGWG5itpMTWMq+V++sn8w2plijM0jFtpXwj+xj4d/aX1n41+G/iVL8KNe8IaH8Tb7UvDGieKJPE8NrFp2oW1pJc3Ma6fGFugzLoLwyNKiJuVAJP3axEr4iKwtWc4wxEJ8kpQbi01zRdpJqLlyyTTUoN3jJNbWPg8zjl9LGyjgJupS0s2knsrppSkrp9pNbanqn7UHxI8JWn/BWPSdB8dftH6J8KRa+FZbOw8a6nrYtDpAl0m+aK6DLIrqwnmKoQVJbaNy5zXXfEn9vf9luC8uNT8M6R4B8QeNIrLT7a/8AjrB8cPCGheJtaRLpJNRkjtrO4VLKea3a5t4p4rmO6KeSsl3GWaWMor6LC4OFbAOnzSjzLVxdnrFLR7xavdSjaSe0kffYiMMxyXDUKy932HIrNxaTlK75otN36xk5U3ZNwbVzqrf9pb4J/Ev4N/DrW/DX7PHxA8SQeJfHerDwTp+i+M7STWP7ZUay17dDUxriwSb47fVWMqahJ5iSlQDuKqUUV/P2RcAZQ3jEsRiFbE4haYmsr8tWS5pWmrydryk9ZO7ep/PWQ5bLFQxKlXqLkrVIKzS0jKyv7u/mf//Z'
      ),
    },
    {
      name: 'fountainStarJellies',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'materialsFaster2',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'goodsFaster2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAaACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7d8YfHCWxhTSvCqRyTiJfPvXG5VbbyEXuQccnjjoetfOniX9rhvG/xB03wV4A+KPhHWxd6BqeuahqOqeNhb2FnDaTWsJVngjmWHebiQq+3aDaupCoZJoMb9sbxX8GfD3wdfSv2gLIzeFNbv0ttVBkVAIoY5L1wrujoszJaOkHmI0TXLwLKBGzstfxf+0t/wAE0vgb4U8Sz/sffGX4UaJ8RIIvKn8T6x4/udaS4s7qaa9FukzJF9qkgx5IKIXIa1Sa6IFykvPiKsqdNtdFfpfTsurPuOE+HcBmlOWJxknyp25bJJ6K8pS54ySV18MZXejaV2egfDP47/E1vH2p/D/WJYdO1HS/D+natPBYatc3KQC8udQhS3mjuraBo50SwV3R4wyNMYyoMe9/dPh18YV1i6bSPEFuFvLh1EMkRCpM+NuMMQFYgDvgnOMcA/mH8RP20dD+JdvpviLR/i58INC1XVLuzk07xP4e8QxaZqWlzXV9bSSPeLJve7iWMXCyx3O2DN008lsz26ivsX4T/EFPib8P9J+IVrpUunf2jB5q2rXkFwYmDFflmt5HilXKkq6MQylSOuBx4DH1K9SVCvTcKiSdm07xfVOLa0ejV7p76NN68ecJS4ZzBTpcvsanw8s4ztotG1KW+rV3rrbYpfFLxTrfgK98HePtG0XRNS/snx/o/nWGu2Rmjc3FwLKGVCCGjlhuLmC5VlIJ+zlcgOa97/4ah+Pf/PHwr/4A3X/x+vnj9oD/AJEjS/8AsfvCv/p/0+vU6/POP8RWoZjS5Ha8PLuzXg/D0q+CqOa2l+iK3xR/4KE/tF/DCx1DULrwJ4XvILWdFjvoBefZrWIm2DXF+wcvZwIJppXmCSxJFaOWdZHjhfzr4Laz4nuNAuNI+I/9n2niZtSvdRvNE00/6Np9rd3k1xa29sdoWW2hhkS2SSPMebZ4wd0bBewmAXxsJVGGE8WGHX7iV4H8E9a1k/8ADP8Aop1a6+x3Pwuvbq5tPPbypZ0tdKVZWXOGcLJIAxGQJGAPzHP7tlXAmT4Lg3D5xRclWqUKVSV3dXlGHMkuibfN5O62sl/I0PGfinHeK+J4YxUKcsNTxVWjFqLjNJTrcjbu03GNPlenvLlfuyjJz//Z'
      ),
    },
    {
      name: 'cottom',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9K/GXjO91KS58V+MNYeTy42eaeUkiNBlsKB0A5woHfgV09p8BfifeaJp+pFtAt7rVtrafp11qkokZTGZMOyQMquFByAWQY++eMy/BDwJ4p1NNT+KBvVg0p9I1Sw0q5sLnE0DpiOW4OcFJhNHJHGVB2rFIxY+coX228u9KsknsdYvoTdo8RM1zOI2mRipMiFiNoU+ZhQcDbznIz8/kvDGDlgo18bHnnPW12uVdNmtXu76ray1Z9/isTHDpUaMU5J672W3u2XLtf3nfR6aWbPlbStWtNXt2ntWw0UzwXERYFoZUYq8bbSRlWBHBIOMgkEGuo034o/EDSLGPTdO8VXUcEK7YowwO0enIrZ+OdmfFejXXxutLW5ksPD3w8v8AUE8RQpbpaXqW05lFq8e8XDO8EcjIxAjgL5G8ySR1w9fNcQ5LWyDFJ05Pknfl11VrXjLzV10V97HXONCvRjWhZxleyupWt0vbs1rZPytvb+G/xAi+DfxJh8W+JvE3ib/hFr3empafYl7m1srsxhI7t4VDSCEhRG4jDBXMUzLGi3Eta03/AAUE+BsuuR6GmpaVrvh3yrm5OvWixzaVpPllfLt7q8i329rIY3bYHwMRkFgXiEhRX2HCmPxGIylqq+b2cowV/wCV/wCV7LysfVZNkeAzjCzxOJTco2irO2i2emt/ete+yXz+D9O+IPxQvvB/gfwFf/HHxVJax6Zc3dl4Y1nxLdX8t3N51lOmoh5/tHnPZTYkQXaT26zXkI3RhLeOtu9/4KJfFOG5eDwP8B4vHOmx4SLxR4e0rxZLaXjgYlVG03w/qVrmOQPEyx3kxV42V/LcPEhRX6j4hZVkqwFGtUwsJS5+W75k7OCk9YSi3q9ndLolqf59+Due8ZZzn+Kw1XN8QoKnzJN06iTVaVNW9tTqW92OrVpPaTcYwUf/2Q=='
      ),
    },
    {
      name: 'researchSpeed',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'barrelInn',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9M/D+mR+IXkvLnVI4oxq0WmxB5UEl5fuizfZlLuqoTCS/mMerIqLK7bBa8E3Hwn8W/ESw8F/2vJcRaxZ3sFvLoer/AGp7S4jRJfOcyW0Hl4TcqZjlSRmYHbsOPiDx/wDtxftSfsaf8FO/+FPeBPHlp4i8LfEux0LVLPwNrNu6eRdXFzFpTw21xlxDuWxZw2I4w15I0gk2KR6F+0V/wUJ/ae8BePfipo3hu/8AAugCw1XUrTR9V03QZbm9njsjMsP2pknZHbZGBiZUTLMi7TjH479XmqlKcalldOUXC/Mt7JuS10aenVb2979IlRqzUrLpo+a1r6aq3dpr/g6fQn2XU7Bm0/W1hF7bOYbwWzFoxKh2vsJwSu4HBPOMUV8Af8Ehv2oNa8Z+K774MJ4s1PXxcR6hrevzaxY4eG5aS3EctvNsjZ4nRt0okRyZbmMrJw3mlZVIOFRxaNKlN05WvfqZv/BVD9mP4wS/tL2P7V1smu6j4TtfCtvaLq/hm1E2oeEbm0nln8zyY/LL2rrLJMZmctHIjFpYUWOOXye9+Nnw++JGi+K9N8JeJ5PGl7LYy3Gq29mUvJHgZnE93OYGuXESq4eR5ECZJDugPmAor0MvUp4+jPmatKK/H+trfea4uUZcN4u8U7Ql+R674Yu/gB8GfiNr3iL4a6lpeg3WjTacPGjaMyRWWlStcTC3hjeORPsV3cXBjR7SISpOPKjltQLkNKUUV/S3EeIy6jXhz4ChO/P8VO9rVJLTVb2u/wC82+p/A/AvD+ZZphqz/tjHUuV0laniZQT5sPSnro7uPNyRfSEYR2ij/9k='
      ),
    },
    {
      name: 'maisonDuCake',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9APip8Xfh78FfC6+LviP4gFhaS3cdpZxx28k895cyZ2QQQRK0s8pwxCRqzbVZsbVYj8h/jT+1j+0j8YbfUvHGra/4qsNW1LWlOk3Oj+M7y0t/DOZI9trHDbMsYKIVTztokcSb2LllNfrP4p/Zj8WfFe/vP2iLa+0q9ttL0mXSPA+jXEgjuGu47ib+0pUk8twolaK3tgr7AHtt5ZVI8zkP+CbH7Jvwu+H37Gfj79m34r+M/CPi/wAT/EfWX1Hx7L4UnhkutHUQW8NtZecdxmltpLdp1Z4/KjmndVSVQZJfy/DZdNwp1FNJzT0a+5K/V73V7LU/p7hTO+EOFciqY3EU/rOInOFOcbK9ODcudx0dmla7dlKX7vSzk/i74f8A7b37ZXhnQ9A+K3jv9onR/Exk8Q2Wk2Hw71HSY7W/1i6u4J7GCaH+zrQ+ZCtwzXEkMrK7NBGsW0uoBX1P8ZPhP+y/4V8Cx+Ovhv8Asz6CLDULSx8HeFvFV3NHdRGLW9QtbGDVLQs8puZVlvllF24jkaPKwyiGRRRWOMhRpOPKl9zSdu10r+q0Pg+LJZPnubPE5SpYSm0rwtF697Rk+XS103e9361/2u/iL4p8AXfiH4e/2n4R03TtdTS9Z0jxF4+1ULYeH4l+122s6gLR5I7e5+zSLoBiSdXH2jVWLExFlT5j8d/BZPjG3iT4mfHfxX4o+KGqeEvDX2n4e+IPBfhV9J0GS0S3lleR5obNtKmghkEcyraXSSy/vQwkbZGpRXJlNWdXOowjaPK4apK8tVpJtO+/k+zOrG5zisDwZiKdJJOVOp71nzJcrTUZXvFNKzSsnd31Og1TU/2d7X4n3+q2sGl3N7Z65YS+KpUtGmtP7UtWuYNNgslixINZW6imSKPT90m+K4jkjE8se8oor+keJuII4SvC+DoVObn+OnzWtUktNVa9rvvJt9T+DOAPDiGd4OrJ5vj6PIqCtSxMoJ82HpTXMknfkUlTh/LThCC0ij//2Q=='
      ),
    },
    {
      name: 'jewelry',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD79+IWmz3fwyh8TP438PPZ+INQvtJm0xdRjlKmC4aERDjzPtBMTsUiXzQ26Nd5QFtS9+GviPwN8U9H+G3wn0LTJ/DbeBGWXXb3UvsNgurWc8QeEpHAfLmnF1MzSeWqs1qVPzBwvnfiX9nb4ay+MdY+IU/xW1nwTonhPR73xn4kl0yWG4g0yVJFmfUILOWCYpI/lXMz+UjRO6zs8LT3XnVa0fS9aHhe++NH7TN7JDFaaZNdxeDwqS6f4ZsE3T+S0VspS+u0XJkuSrkyGX7OIo5CjfNZ3xZkmYcIUsoyuH76OkrwsoyfLZ3TvOVtnf8Ax9E88p4b4gwvGmIzPMKq9itYe823FqV4tWSSu+ZrpZcr1udbofxA06+8VyeANZa2tdbSyN7bwW96J4NQtVZY5J7WXC+csUrLFKCqvE7Rl0CTQPKV8ifBjxHonir9vjX/AI23+h3llpPijXYNO8H/AGjTo4xCbS0exN9eBgTaztNaahY26u0c+3U5ojEH+0JEV+efVsVhYRhX1l3ty3to7LXZpxdnuntsv0v2+DxDvh5xkrK/K1KzcVJJ2b3i1JX6NPZo+gP2qPhN4m8aeDtcv/A8Oq3k2teFb3w/4i0DSZIRNq1jPbzpEIjPc20ccsM0+/LzKjwvcRsGdoXi8U8R+Df2idD+Cnje4/ar8MeLfiRbJ4O1O48PxXuqaXa6d4elS0kK3N3DYOsuoTRD95DG8N5i5t4GV4W/0lSiujL60sPjKc4JXUov5pr5/wCa0ehjmEVistrYee0otX6pNNaP5nHXfiXWvFXjW0ttD+AninUv7U0YWml/bPDpjuvGOlN9pW5tktLuSBFtLeVYd11qeyFBdJHGNmpQTTFFFfsGZ+LHE1CquWFLXmesH/PJfzdkvz3Z/OGTfRw8PZU5pzr6cq0qJf8ALuDe0FvKTfZX0stD/9k='
      ),
    },
    {
      name: 'trainFaster',
      img: getImageFromBase64(
        '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'
      ),
    },
  ];

  gnomeLabCookies = [
    {
      name: 'tastierStarJellies',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAYAB8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6E8Y+MrPR4JNf8S6gXklYJChIM11LtOyCJeskjbdqRryeABXuPw1/YX1jxzb6SbL42tc6i+mwXXiq2ttBWa1s5iP3lta5aGQhWwBLI0mRzs7V474A1C70v45+H7rS4WkkfStSi1AHG2OxPkM7jkZf7Qlmg6/LI5xxlfr/AMDfEjxP4AuZfH/hmys20/Wpli8m+mBMZ3HC8EMADn1OACa+uwmUf8I8cRGHNKonZu1laTSSuvJu6326a/G8Q4TimeOoYqjCSwUG+eUHJSbtfZNJpbW10bas0eA/tFfs4+IvgVrhutLtNb1fwzJZtOdYfSmkFg0Y/fJcyQp5cagbZBI4jBVyOfLZjwega9faHerqelTpkoR8yh0dSO4PDDofqAe1fYvxu8Q/GnSdL1jwN4E1G1vfEd94fuLzT7qwlV7awlMbiO4mMuFCIxQ5IYtuVVVyQp+ItBWKzs28Otplzp9zo7ixvtKv1AuLGVFX91IASM7SjBlLI6OkiM6OrH4p4ijDFfVak4+1tzKN1zOF7c3Lvy3sr6q/bS+/DeZ4rHSq05RkoQ0vO/NzXd1e75ku+ltFq72XVdB03V3hubpZYri2Zja3tndSW9xblhhvLliZZEyODtYZHByOK6eT9oD4p3Xh3RNAm8EQ3dzo2n21pqN3f695MWqyQRJCLsGOOV/MkVC771UhnIDP94lFfRZZxBj8rpunTtKPRSu1Hu4q6tfr30e6TX3mAzTGZbzewaXMrapNa21s7q+ltjzf9nP43fFvWP2kfin8L/2nPiT4UitLGx0fXvA0Z1cQyQ6df3WrRm0kacxrM1ubKOMSJGuUKF/masLRPFXxL+J/7ZPxG14ePfD0/gTwMbfwrothpFus1xqVxLpulam1xcXauVZLdrqeKKJcgG5nJ2n7xRX8t5LlmEq/SSzXGSTclQU0rtqMpRoJtXbeqlJWbaXM7dLfBYWhT/1sr1OvL6K75W9F6vTZdEf/2Q=='
      ),
    },
    {
      name: 'charge',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'defense',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'magic',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'support',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'bombard',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'range',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'heal',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'ambush',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'allCookies',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAfACIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9rfFHxd8F/DDTItK0DRLdr+4tkle0s41jjiJUYMpXvgkhRk4AzgEGvJPFv7Wfi2312HS117ZqLWr3UGh6Dor3t00KkJJOLeNJZmjUyKGfBRSy5IyK5nVdWtLC1udc1zUY4III3nu7u6mCpGigszuzHAAAJJJ4GSa+cv2bP2vG+K3wt8b6X4M8Z6Vfw33xH8QWXiW/014JXvUtdVuIrBDKmcRLp6WIQKVDp+8O4zOz/kOacQSwuHlXqOUYLSMYd2nZN6WT6vp0TP0TLMhjiaqpQSlN6ty7XV2l89F97PrrwH+1r4q8SWH/AAkXhzxrpniGwMstuZI44njSaKRopYy0O0rIkiOjKTlWVlYAgivYPht8ZvDHja6uLZ1NheybXFrO4O8hdpCN/FgKD0B5PBAzX5j/AAm+Nnhbwp/wUBn+EkXjfSLKPxT8P3u9X0u61JI5bjVra6tYrJo4nYbpJLWe4QsqlpEs0Uki2UJ9aWd5dafdx31jcPFNC4eKWNsMrDoQaeU57jKmGp15XtJXtLV723/Lv2FmmR4WnXnRVlKPVK3RPb8/zPrQatZkZEV3/wCAU3/xNFeXWP7VOgJZQpqvh+8e6ESi5aCEBDJj5iuSeM5x7UV9cszwb+3+B8p/ZWO/k/FHyL+2D4X+L3ib4O+b8ENAsNa1/SNe07VYPDupSRRxaqttcpL5IllISKVWVZ4nJA82CMFlBLDx74b/ABS+IPxF8CWPjLx9oU2mXl3LcIlncX8Vz8kczxb0lhklikRihKvHI6kcg9QPpT4q+Cbj4l/C/wASfDi08S3ejS+INAvNNi1iwOJ7Fp4HiE8fI+dC25eRyo5r42j8Ef8ABSD43fEUeDNd8FeFPBGoaUZLjxb4sur77fpN7KoIgjsLa3ukvGhnYBwsxtzBCrKxkfap/Kc8y2pmNOEacbyvq+ayS31XX7r306o/VchzCjgnU9tK0bXta7b20f6PTr3IPjh4v+L/AMUvA/jz4T/DTw34oOgW+koPFPibw/p9zLBY2sqTi5lMsBKwMi2ssZknVYlJyrTGGeFPqP4K/HvXvGmtp8MPiv8ACnxH4M8aR6RLqcmla1olzbpcWSXTW63KNNGhTf8Au22OB8zyJE84glkHx74f/wCCk+n/AAF+C/xI/YQ/aB8W33hPxDLrl42rL4Uke6gt7+a7djBcTfZA82n3NjPa3DGErMioIjG5kmhHt37Nn/BQ/wCEn7Yv7Uum/D34c/EDxXrUPhb4T3EWmTeOoI21e9ij1C1M9zczQwJGWU3NrAAXkdhEJGZ3eVq/oL/iHvC+UeGVOtRhFYiMI1ZT9vzSbnClpy/BbnlKKhFKceW7bs2/wSXHvEmbeJM8PVlL6s5ypRh7DliuSdX3ub+JdwjGXPJunLmtFK6S+ow0gAwn86Knj0vXJI1khscowBU+avI7d6K/IPY1H/X/AAT9Y5on/9k='
      ),
    },
    {
      name: 'arenaTicketRechargeRate',
      img: getImageFromBase64(
        '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'
      ),
    },
  ];

  numberImagesPVP = [
    { char: '0', img: getImageFromBase64(b64_0) },
    { char: '0', img: getImageFromBase64(b64_0_1) },
    { char: '1', img: getImageFromBase64(b64_1) },
    { char: '2', img: getImageFromBase64(b64_2) },
    { char: '3', img: getImageFromBase64(b64_3) },
    { char: '4', img: getImageFromBase64(b64_4) },
    { char: '4', img: getImageFromBase64(b64_4_1) },
    { char: '5', img: getImageFromBase64(b64_5) },
    { char: '6', img: getImageFromBase64(b64_6) },
    { char: '6', img: getImageFromBase64(b64_6_1) },
    { char: '7', img: getImageFromBase64(b64_7) },
    { char: '7', img: getImageFromBase64(b64_7_1) },
    { char: '8', img: getImageFromBase64(b64_8) },
    { char: '8', img: getImageFromBase64(b64_8_1) },
    { char: '9', img: getImageFromBase64(b64_9) },
  ];

  numberImagesWishingTree = [
    { char: '0', img: getImageFromBase64(b64N0_1_tree) },
    { char: '0', img: getImageFromBase64(b64N0_2_tree) },
    { char: '0', img: getImageFromBase64(b64N0_3_tree) },
    { char: '1', img: getImageFromBase64(b64N1_1_tree) },
    { char: '1', img: getImageFromBase64(b64N1_2_tree) },
    { char: '1', img: getImageFromBase64(b64N1_3_tree) },
    { char: '2', img: getImageFromBase64(b64N2_1_tree) },
    { char: '2', img: getImageFromBase64(b64N2_2_tree) },
    { char: '2', img: getImageFromBase64(b64N2_3_tree) },
    { char: '3', img: getImageFromBase64(b64N3_1_tree) },
    { char: '3', img: getImageFromBase64(b64N3_2_tree) },
    { char: '3', img: getImageFromBase64(b64N3_3_tree) },
    { char: '4', img: getImageFromBase64(b64N4_1_tree) },
    { char: '4', img: getImageFromBase64(b64N4_2_tree) },
    { char: '4', img: getImageFromBase64(b64N4_3_tree) },
    { char: '5', img: getImageFromBase64(b64N5_1_tree) },
    { char: '5', img: getImageFromBase64(b64N5_2_tree) },
    { char: '5', img: getImageFromBase64(b64N5_3_tree) },
    { char: '6', img: getImageFromBase64(b64N6_1_tree) },
    { char: '6', img: getImageFromBase64(b64N6_2_tree) },
    { char: '6', img: getImageFromBase64(b64N6_3_tree) },
    { char: '6', img: getImageFromBase64(b64N6_4_tree) },
    { char: '7', img: getImageFromBase64(b64N7_1_tree) },
    { char: '7', img: getImageFromBase64(b64N7_2_tree) },
    { char: '7', img: getImageFromBase64(b64N7_3_tree) },
    { char: '8', img: getImageFromBase64(b64N8_1_tree) },
    { char: '8', img: getImageFromBase64(b64N8_2_tree) },
    { char: '8', img: getImageFromBase64(b64N8_3_tree) },
    { char: '8', img: getImageFromBase64(b64N8_4_tree) },
    { char: '9', img: getImageFromBase64(b64N9_1_tree) },
    { char: '9', img: getImageFromBase64(b64N9_2_tree) },
    { char: '9', img: getImageFromBase64(b64N9_3_tree) },
    { char: '/', img: getImageFromBase64(b64Nd_1_tree) },
    { char: '/', img: getImageFromBase64(b64Nd_2_tree) },
    { char: '/', img: getImageFromBase64(b64Nd_3_tree) },
    { char: ' ', img: getImageFromBase64(b64NE_tree) },
  ];

  numberAuroraStockInTradeBird = [
    {
      char: '0',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDb8G29r8UvAPhL49ftDft3XnwW0f4seLLnRPgt4e0LwlFqDagkMrQi9vpZM7I3kQgD5VAIBOSM+BftGf8ABR79o79i344eJf2WvjN8G9M13xL4L1JrDUdb0ySaKC/GA8c6oFOzfE8bFcnBJHavbPgL+zv4c/4KVfsgfAPwv4a+KVv4Svv2avFd3pnj2y13T5pZJ9KN4L2OaB7dXRpigiyN3B3V8xf8FCfFvxx/bO/bV+I/7SP7PPgvTrvwb4g8SSx6HdandpBPKlqq2bu0bkMuZLdyAQDjFfkmZcAeF2GyehHH4alClGyhO/K53jfWcWnK9m9W77niVcsyaFCKqwiorZ7X079T/9k='
      ),
    },
    {
      char: '1',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCX4UDx5+0x+xR4+/ba8Pft26DpfiTwZ4NuvEsfwe8LaDFctpsELuiQ6nNORIJHZOiADBBFYn/Dc1x/0DLT/v4P8az/ANkHw4nwd+AH7T3grxlLBaatrH7KdlLJHChdWu55ZpJU3ICMK8pUE9QBXyF/wwz8Uf8AovA/KT/4ivwjMPC7hXi7KMHicqw9OjBKWy+JNpRba1k9G7yu9T5urk+Cx1CnOjBRWvz7ep//2Q=='
      ),
    },
    {
      char: '2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC5+yJpXhn9sPU/Cvw4b/gp14k8O/Gzxfosl9YeB4fhWqaJYXSR+Y9hLNKuZGUEB/mDYyQK4v8A4ST/AIKhf88fht/36l/+Lr6T/YU+B/xC+KfwK8Qf8FAvAvxL8Pv8aPE9jf6J8MbTxDa3Q0vwNprStG8qCOJzLduEVmk6EgAHatfld/whH7UH/Rabv/wpJv8A5Fr8vwfAXCmPynD1cwyejGq46xppWje2jl7nM7dbPW+ttX49PLMFVoQdWhFO2y6fPS5//9k='
      ),
    },
    {
      char: '3',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwB/7I03g79sbxt4f+Dmo/8ABSLxv4T+N/iW3llXwHafCQNo2jXKKzmznuJFO/AXly4J7dquf8Kj/wCCnH/RdPg1/wCAz/8AxyvTP+CUtp+0v4RudU/a48Q+PPhnpPwI8ZXusav4w0aTRLy58S28bI8bJDdxQqUJKBgFZgoyAelfAP8Awu7/AIJjf9BT4g/+DC8/+Kr87wPh/wAGY/K8PUxeV0Yz5I3ShFWbSbV18Vn1bZ5dPLMvqUYOdGKdl0P/2Q=='
      ),
    },
    {
      char: '4',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0D4ueMPiLqPirwz+zz8AbGG/+JHxA1EWXh6G4TfFYQLg3GoXA7QwpliTgFtozzXyn/wAFcv2mf2oP+CTv7WEX7LGkfGS3+IEUvhKw1xtf1bQYreTfcmVWiVYm2lAYiVPXD89K9v8ADv7X/wCzD+yH8YvjLcftWXPjPSvFPjmys9E8GeMvClvFcS6PoXlgyxwAtmGR5SxZsZI6ZFcX/wAF2rn/AIJAePP2vPDGt/H34m/FGPWU+EegQ2o8PaSrQtZKs3ks5kAPmFT83bNfgnhn4acHT4KoVsXSp4irWSqSk0ny3V1BPdcq0a6yvfpb5nKMowDy+MpxU3LVvt5fL8z/2Q=='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCCw1T4aaN+yD8NP20P2t/+CinxJ8Ar8VnvJNG8O+CvhjHqtvaCF+YyyI7jCsvzPjcc4ryP/hp0/wDR4XxX/wDDJD/Cvqb/AIJX6J+12fhzoT/FH4jfC68/Zg8Favr2n674N8R+EZNQ1YWlvLPG6owhZMtIoZSCcIMHmvmL/hfX/BCH/o3y8/8ABPL/AIV8DS4H4TxWCo1MPgMPGLin71GMnZpW1Tj873PMjl2BnTi40o2t1imf/9k='
      ),
    },
    {
      char: '6',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCn4v8Ai18W/Fv7Lfi39u+x+J1v8P8A4d6HdDSfh/Yz+Hjf3fjXWEcCcEZHkWqkPGJBz8pckDFRf8N2eGf+h38H/wDg8i/+Kr6b/wCCePjr4i/Er9hj9nDwn8HvHvg7Q/C3wjkvNC/aA8O+KfC8l6+om2UxSi3YROr7nVjkHnIJz0rL/wCGnv8Ag3B/6N4sv/CHm/8AjdfimYeCXB+Z5fhaeESpqnHWSipOpez5pSur7Nr10sj56rw9gK1KChpZb2vfzZ//2Q=='
      ),
    },
    {
      char: '7',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDC/Zl8Y6b+0J4js/A37TP7aHxP+GXj/WfiHd+E9H8PeC/hM17otzcwTm1xFfSRsjs08U4ILZXZyOK9n8b/ALJ+teB/Gmr+C5f+Comos2j6pcWTNP4Y07zCYpGjy3P3vl5964L9jq1svgd+0JonxD/aJ1iKX/hTHwv8RfEq/gggeZL/AMTajdTSMUCg4WGSeUoxwMGvki6/YT+KHx6uZPjn4t+OWt2Gq+NJDrup2NveEx29xeH7RJGpBwVV5GA9hX4bQxHhhgeH6GPzDAYeFKrOpGlalGTlThJxjJtpu8opSd+585CWT08LGpVpxSk3y+7e6Tsn92p//9k='
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ+FvhrxJ8avg98Lf2i/jp+2F4m+GsXx08RyaX8LPCngLwNHqsdqFkeNJdRncEgs0bEj5VAIr6E/4cz/8ABTz/AKPw8Ef+EMv/AMcri/8Aglr4m+PUf7DXwe8JfspfErwnpkvgn4marJ8c7Dxto9xdtARdyF105kUpGgjK4EZ4LH3r63/4bU/4Jy/9Fd8Xf9+tS/8AiK+Fwvh7wHPA0oxy6i4qKs+SLbTS1crXl6tts82GV5a6cV7KNrdl+fU//9k='
      ),
    },
    {
      char: '9',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDofg94I1X4zeEPhB45/aF/b21P4V+JP2hBLL8HfBfhXwXFf23kKpaJ76eQE7nAyRlQM4HIr0H/AIdd/wDBbP8A6K78Of8Awnn/APjlcx+wR+0037F3hjxH4d/asXwn4o+H/wCzl4UttW8DzXvhZrnXrG6v4z5dhaTKGRIlfMYkYoQpGc4Jrmf+H5v/AAVd/wCiKaX/AODu0/8AjlflFHIPCSeT4TEVMNh40qkE6bnGMXJWXV2cnqrt3evmeLHDZG6EJuEUmtLpI//Z'
      ),
    },
    {
      char: '/',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAPAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBLz4i+Pvjh8M/it+0Z4B+MkvgnwV8Ivh7pmpG5i0SK9/trxBfxrPDppEhGFEUtsG2ndmY/3a+S/wDh5j/wUF/6JpF/4Q93X1T4L8NeG/D37FH7NP7FPhy+W4uviJqk/wAVvipMEdRJFbMPslluYDzFSRo48DI2RLXnn/D1S+/6JGv/AIHCv5d4hyXIOGJYbJsBk1LGVaVKMqs5tRac27Xe8m+WT12Vj43FYfDYNww9LDxqNJNt6b/nsz//2Q=='
      ),
    },
  ];

  numberImagesProdutRequirements = [
    { char: '0', img: getImageFromBase64(b64N0_0) },
    { char: '0', img: getImageFromBase64(b64N0_1) },
    { char: '0', img: getImageFromBase64(b64N0_2) },
    { char: '0', img: getImageFromBase64(b64N0_3) },
    { char: '1', img: getImageFromBase64(b64N1_0) },
    { char: '1', img: getImageFromBase64(b64N1_1) },
    { char: '2', img: getImageFromBase64(b64N2_0) },
    { char: '2', img: getImageFromBase64(b64N2_1) },
    { char: '2', img: getImageFromBase64(b64N2_2) },
    { char: '3', img: getImageFromBase64(b64N3_0) },
    { char: '3', img: getImageFromBase64(b64N3_1) },
    { char: '4', img: getImageFromBase64(b64N4_0) },
    { char: '4', img: getImageFromBase64(b64N4_1) },
    { char: '5', img: getImageFromBase64(b64N5_0) },
    { char: '5', img: getImageFromBase64(b64N5_1) },
    { char: '6', img: getImageFromBase64(b64N6_0) },
    { char: '6', img: getImageFromBase64(b64N6_1) },
    { char: '7', img: getImageFromBase64(b64N7_0) },
    { char: '7', img: getImageFromBase64(b64N7_1) },
    { char: '7', img: getImageFromBase64(b64N7_2) },
    { char: '7', img: getImageFromBase64(b64N7_3) },
    { char: '8', img: getImageFromBase64(b64N8_0) },
    { char: '9', img: getImageFromBase64(b64N9_0) },
    { char: '9', img: getImageFromBase64(b64N9_1) },
    { char: '/', img: getImageFromBase64(b64NS_0) },
    { char: '/', img: getImageFromBase64(b64NS_1) },
    { char: '/', img: getImageFromBase64(b64NS_2) },
    { char: '/', img: getImageFromBase64(b64NS_3) },
  ];

  bNumbers = [
    {
      char: '0',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7F/ZY/aM/aE1r4+y2fgn4seJPFfjK80vxPL8V/BmpztPbeGbu31yCDTUjgKgWu62acBQf3iIH9yUUVlC7RpKyZ//Z'
      ),
    },

    {
      char: '1',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD68svhv8cvhf8AHD4veCvC998R7/R7X4kO+kXuqX9/dvPFJpenSMyzOTvXzXlxg4ByBjGKKKKwsbJ6H//Z'
      ),
    },
    {
      char: '2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3P9oHw34g8X/ta/EOy/Zu/aN+K/wX0XRb2PT9Uub218Rai3inVFmumubyPYGWOBN6RRkHDhSQAAKKKK5d2b3sf//Z'
      ),
    },
    {
      char: '3',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7g+Adh4lk/wCCo3xK8JfDf4s+MdQ8JJ4Vvbi/TSPFuravFFqo1WNCl2moBYrSdFMqRx25dPKUnNFFFZQ2NJbn/9k='
      ),
    },
    {
      char: '4',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Z+Cbf8FA9P8A+CrnjL4y/G79lXxld2OtfDS8tdD0e28R6a2mWNnHq9utqIpxceSJWijZ3jdhMWldtmwZoooqIxt1Kb8j/9k='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD379k74keDvCPjHx/8JPhZ8H/B3xjk8Oa0/wDbvi24tbzSb5bqe/1Bza3Ju5iLkxABEkiVU2AA5IzRRRWENYm0tJH/2Q=='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAJAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7j/ZZttY8J/t4fFL4f69feI/Hmo3Vxrmrtr/hLx9rU0Oj28msL5GlXNndBLS3mWN12mDcdsLjO05JX354U/5Dut/9fa/yNFRGNkU5XZ//2Q=='
      ),
    },
    {
      char: '6',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD63/YW/bO/4KKeD08ar4//AGWdf+IfiDVtffUteYRajYSaFdPPcw/2cRdgwMiQwQMgtQECOCxZm3EoorGN+Xc1klfY/9k='
      ),
    },
    {
      char: '7',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7f8IfsO+Lfjb+1n8ZtP8Ag/8AGj4k+D/BnhHU9M0e1m1Dxpql0NT1YwzXV/JF9omYpGn2m2iATCfJkd6KKKzUItFuTTP/2Q=='
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCj+258W/26vDHxW1u9+FXxn+JkOqXXjrxJFrsXhnxFrbXyQQ6gyWQvLMsLayQQkiAWxIeMMWwQuSiiuGV+Y61ax//Z'
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAJAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpI/23f22xfzt4E/aX8TQ6o9xeHxMdMupdeneddTvo4vtFiUUaK4hSNRbgsJFUPxRX7FfDP/koXjr/ALDif+gGisVTbW5r7Rdj/9k='
      ),
    },
    {
      char: '9',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD37TPg1/wVft/jd498A/Bb4neIZtW0DUEXxt4p/wCExvr2x1m8uJ7q4gNvHdIqWrRWklujxQAoMoCSQQCiisVBPqauR//Z'
      ),
    },
  ];

  wNumbers = [
    {
      char: '0',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDK/Zt+AXwN1H4KfCb9mHUv2d/DeoeEviZ8C/Enizxf8SbjSA99a6rbLO0MiXn/ACxETRJHsyM7vU0V+e2kfteftN+Bv2WdY/Z+8I/G7xBYeDLhzHJ4ft74iDy5TmWMfxKjkfMoIU9xRWDSWljRNvW5/9k='
      ),
    },
    {
      char: '1',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzf9kHTPgJ8cv+CacMt9+zJ4M0zV/CXxEtNLudftLAvd6v5tleStLO8hJJyiDAwBt6UV8IfDb9oH40/D34c3ngDwT8SdU0zRrvWIb+4060n2xSXKRSRrKRj7wR2H0NFeeq0bK6NXGV9D//2Q=='
      ),
    },
    {
      char: '2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzX9hjWfhnrX7CniHxv+25+yb4GsfhHottZaZ4T16x8J7NY13WjexmSVJVy8yrD5gkb7vAHXNFdD+yz8TfiTF/wTO8N+FoviDri6Zawv8AZtOXVphBF/xMGPyx7tq888CisIq8UaJn/9k='
      ),
    },
    {
      char: '3',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzbX7H4RfGH/gjrr/xS8QfDT4ea34i8OX3h+3tNK8IeCJNE1Dw0sk4id57t1C3ZnVQxKE/for4r+NP7aH7U3xO+BWg/A/x18btbv8AwlaRQJDoTSqkBEChYdwRQZNgA27icYorhnOLex1wpNrc/9k='
      ),
    },
    {
      char: '4',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDH+Kf/AASJufgz/wAEX/Fuj6P+zvc698YtS1Dw3r1/4lgtY2EEN3cgmws2LZCxREeb6mTHOKK/P74e/F74sQ/sP/FTQYvih4iWxm1rQjNZLrc4icrM20lN+DjAxkcUVztRdtDN2lqf/9k='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz79rDTPCPx0/YQ03xn+xUfhhc+HvCXgvwpaePNHl+HZtNZt9UdY45Z1v5owJlebAZVPTceQaK+Ifin+2H+0540/Z50H4C+JfjNrNx4PtREItAEixwEQ5MW/YoMmzHy7icUVxTnFsapSmro//Z'
      ),
    },
    {
      char: '6',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzb9sn/glR4E0/9jTwR4B/Zr8R+GG8WeEPBuj+L/iF9t0GaPUdUfWCkcbLqDHyjDGZFUQqO26ivNfj/wDGX4v3n/BIzwJpV38VfEktrJcW9tJbSa7cNG0MUhMUZUvgohAKr0XHGKK5pxhfYbqzi7I//9k='
      ),
    },
    {
      char: '7',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDifhP+1F8K/Cf/AATf8PftB/tY/szfDe6uPEPjtdF8GQ6Z4RtrSeWxsrKQXFxIVUGQNI8Q3H+JWor8xfiP8Xvid488B+Efhn4x8cajqOgeEra6j8N6TczlodOSWRXkEa9gzEk0Vye10Q4U3OKdz//Z'
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDr/jP+zJ+yM37JOoeENO+EHhrU7jRPhd4O1i28B6T4VFprmkXV3NAtxfTaqcLcLMHIMYYkbs4or8vPGv7dX7X/AIu/Z60z4MeJP2hfEt34Zg8q2j0qS9+XyYDmGNmADsiFQVUsQMDFFcUq1NvY6FSl3P/Z'
      ),
    },
    {
      char: '9',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBfGPw2/YD8S/8ABNS++Mmn6N8NU+GOjeHvDFjo11YaE8HiC28TvLGuopczsoM24GQkKWAGDwKK/I3xL8Zvirr3wd0X4Lax491O48J6TqVze6d4fkuT9lguHCB5QnTcRxk59qKr2dzH2tj/2Q=='
      ),
    },
  ];

  seasideMarketItems = [
    {
      name: 'white_powder_support',
      img: getImageFromBase64(
          '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'
        ),
    },
    {
      name: 'white_powder_charge',
      img: getImageFromBase64(
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAlAC8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yKq63rejeGtGu/EfiPV7XT9P0+1kub+/vbhYobaFFLPLI7EKiKoLFiQAASatV4r/AMFFfBXhn4j/ALEnxH8CeL/ihrPg6x1Xw80Da5oEkf2oSGRDFbKkrok6XEgS2e3Z0E8c7w708zeP55iouSUnZH00Iuc1FdT88/2sP+DlzRrrxg2gfsg/DHTtT8O6Pes954h8ameFtbjRmDLaWsbI8CttBSaZi43EPbKVwfpb/gnL/wAFI9X/AOCg/jjxN4HT9mLxN4Ibw3pdrqTX+r3AltpYJ5miiRmMcTJJJ5c7phHR1t5RuUqM/ll8JH+HOm+Lbi++LfwbXRfHVkIYJo5tDlmDPABDFLYKFf5SqqB5Qyu3byNrN7P+zb/wUG+JH7E6eIrPwhJ4Kg1Dx94jmu9VfWPCV7Pq9rb28CwWcGY7kbD5Yjkjjlh2q93NJgg+UfSryw8KfLTjZ9Hvfr06W6+nc+lqZRFUP3aTl56W163/ACP3GJyxqrqNhNdqGt7ySJx/dkIBH4V4p/wTX+NnjX9oT9jLwh8UviR4/wBO8Ta/frd/2nqumzWTbsXcvkpKtkfKhmWDyQ8WFdGyHSN9yL7rXmNOMrM+bnF0qjjfY8n/AGx/2lT+zJ8JD4l0LRotW8UazfJpfhDRZ2cR3V86s2+ZkBKQQxpJPK5KgJERuUsDXw/8Svh5o/jvX774jftG/EfwL4t8RmK0h1HUPH3ibS4rbSvtsS3Fnp9rptzP5NgssMDzRLJH58q+a7MxLE9n+2BrsHx4/wCCji/C86lcCHwDoWl6Ra2skUbJBf6tIZ57mMkAhjbi0j6gfIw4ya+d/ir4p/Z1T9oVviZ4p/aN0bxC+nfGfWfGHiTRdM0TVWfVIbVYV0LTFlksPs9x5RhuIS7MI1W/k2u6EvXZTwqq+620rJu3W+qXpa2nW+t9LfQ4Kl9Uw8KiinKV3tey6fedpP8AsWeJILG4bwxaa5qWm2l3daff2nh3Xk1VLe7iYedDNNA009vKhfbsMqbcYAG3jx/VvAWk+FZZdNsdJjWB0KO0mZHmU5J8x3JaQncxLOSWJJJJNaX7G2g/BL4geM/hr8OvB2uePfDeq+HvHup+J9Vu5bW1uYZrVktHZJL1Lm2e3SK3sNrSmJyzyyOqjcsQ3/2mvGCy32o+NNQtUS71jUJrlII8hVaRy7AZ7At0znH0rmrYaMJpQ3f9dD6DC4mrO6q9PXT8X2OY/Z4/aSP/AATy+LEfxq8E6ew8L3zhPiR4O02ZYo9RsOS1/DCcRi8t/mkVjs81PNiZgXVl/aPw54i0Dxh4esPFvhTW7TU9L1Syiu9N1GwuFlgureRA8csbqSroysGVgSCCCK/n+mkv9YuXecvPJJy+Rn/6wHb0r9N/+CDPxa8QePv2Kb74ceJNTa6f4aeO9S8L6bNcXbzXD2EYiuIPMLkkBPtDwIBhRHAigfLXdiMLyYbmbvJb+j/y/XyPmc6pU5T9tBWvv/medftt3Z8Ff8FPNSsvC0f2SfV/hHo/iS9vo5G837Zb6ldWUTIQRsxGqc8nKDGOcpc/8E2vA37YlrH8e9B8a/8ACG6hfXH2fXdPg0CC4tbq5ijjja5iSE24hMrB5XU78vISGHSiio1Uo+cV/kdtGco5bTmt1p8hfGfwT8D/ALIkZ+D3w70W1bUb/QrVfE/i10k+2aoDI8hiUPI620BZULRx43+XHuZguD8t/tIXtxqXjSDRJWAihVQuP9xWz9f3hH4CiisacpPFff8Akz2KSvg1Lq0m/vRzyeC00rwsniWHUSy3E3ltbmLoV77s+/TFfbX/AAbw6HZr8B/i54yjZxPqHxo1C1ljLZRUhtbV1IHr/pDA+uBRRXVGcqmDrOT6pfifO5q26CP/2Q=='
        ),
    },
    {
      name: 'blue_powder_support',
      img: getImageFromBase64(
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAlAC8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9t9F0u9t40mvbmUEjKw7yMemf8Pz9K5j9oz9ov4Sfsp/CDVvjh8bfFMWk6DpEa+bKxHmTyuwWKCJSRvkdyFUZA5ySqgsO4r4q/wCCwf7OHxn8W6H4a/a4+Bmhaf4o1X4WafqP27wZqunm5eWwuWt3uL7T1Esf+nQJbcR7g00TyIjBwiSfz7h4QqVlGb0f9W8rn1NPlqVUpuyOJ+IX/BXX9p7xWsk3wB/Zy8OeHbOO7b7Pd/EPUp7ue7tsZRmtrIoLaTn5kM0m05HOMn1P9n7/AIKZfCn9pfxl4O+Gup+EvFHg3x74q0jzbbwr4k8Mahaq91DafabyC2upreOG4WBQ5LEoWUAhcsFryP8AYz+LH7SVz8EbrT0/Z58F60PFl4+o+HvHl7fqmmCxaGNoJjAXku5HaXeTF5MIZCAZFPzV598PPi1+zx8EP+ClOq/HL4vaheeIpvCPgnUdM0bVNP8ADIk+0+KZmhN1Y2KxzeTYxwWkMsMW9QN15qC3N3mNd32U+H8JXoqOWSlXq2u4wptcumt23K/vNL0u9Njw3nlbBp1c4w9PB0ldRk63M5yu7K3KklyLmbvvpG6uz9MPD+leILfW4bjUdOMUSo+HDqwztxzg8A549cHOOM9LXD/s4/Hzwh+098GdH+OPgPS9TstK1trkWttrEUaXKGC5lt33rFJIgy8LEYY8EZwcgdxXxuIpV6FeVKsrTi2muzTs18mepSr0sVSjWpNOMkmmtmnqn80Y3xE+Ifgv4TeBtV+JXxF8QwaVoeiWT3ep6hcZKwxKMk4UFmY9AigszEKoJIB+Sbzxz+0H/wAFAPBep61P44j+D3wZ1Xwxf/arNxZPrWtaTNBOkl3d3V1G8GlxCHy5FESuwVpS0y5jYan7fuuT/Gj9o74bfsZRXRfQUtZvG/xF08ZX7bY2sqw6fbOGBiuIJLzd5sDK2REjAoVBPzL/AMFBP+Chmqw6x8Rv2RPh/wDD6206wgvH8P6v4nnv7j+0Lxra8Rp2VVdY44pGgMewq2YmOWO/A+gyHLfrFRVH0ab8lrays9Xa+uyOjETw+EwXNVjzSmnZPVW21NI/s1ftg6d8PrvT/gR8VfA/iTweNTaO3vPBHxLmsVe62RvIg+wxzrZOfM81o1uf3hdpW3vIxPLv/wAE1/FdxDf6t418XeJ4YrlJhLbWGqQx2MM00is8uAsk0ssioQ/myPHI8kshQM+RP/wTK/bE0zw3FoX7Gsnwm1LUn8YfEIXH9vWWvqhs3uYre2MjWxtm82OJITI371PlMnIr7Q8f/FbT/B3w/uNI12JZ4pTtsLZTiR33BtvT7o5yx6e5wp+wzfiPPMLPlpzVOMteaEYRlOStfmcUm9X2tr93ymT8FcMVoKdWm6rguVRqTnOEE+kIzbS00vutk+/z5+wr8e9e/YG1/R/2XPirrd7rHwl17WhZeCvEtxaK914S1O7nLCyvniVfNsbm5lbyrkoDbyyiKQ+UyPH+i9fmN8SvDI+L3hHWfDHi60Z9N1jT5ra8SFQgWKRSpMe7PzLnKtyQVBzkV9Tf8El/2jfEX7Sn7D/hfXPiBrIvfGHhZ5/C/jOR55JZvt9iwjDzPIzM80tubeeRsnLzseOg/P8AMKNSoniZJ3b18276/wCf/BPratHD0oqNG1o6WXS23ocf8fdAeD/gqPpnigX2Vuv2fri1Nv5f3TFrkTht2e/nEYx/D1548F/4LbfEXxRqPwg+FuiarfvdR3fiTWpZJZ3LSZt4LBYxuPUAXMvXJ560UV7GQSksTFX0cTTMknlMZPdW/M9+/Zj+HXwh8B/Bj4beO/B/wW8J6d4nm+GWjTyeKrXRkTUTLeaVA9zL5o/jfzZFL43bXYZ5rz/496reX3xBm0+d/wB1YwRRwICcDcgcnGcZJbGRjhR6UUVzZjXrV8dUU5XUXJLy1OnA06dPCwcVa6Tf3I5Dw0dQ8TamdGfU5YEjZkiKAHAAJ5H8X0r2/wD4I6+Bx8Pfh38Y9BGpm78748apfmUw+Xg3OmaVcFMZP3fN25zzjOBnAKK+24qwOEo8I0a0IJSvFX62s3+Z+BeH2c5rj+N81oYis5QV2ovZNSik0tlo2tP8j//Z'
        ),
    },
    {
      name: 'blue_powder_ambush',
      img: getImageFromBase64(
          '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'
        ),
    },
    {
      name: 'purple_powder',
      img: getImageFromBase64(
          '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'
        ),
    },
    {
      name: 'purity_crystals',
      img: getImageFromBase64(
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAgAC4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9xYLaC1iENtEFUdvX3ryz9rX9tD4AfsU+Ao/Hfxz8WG1+2NImj6NYoJb/AFORAC6wRFlyFyu6RysaF0DOpdc8D/wUm/4KL+CP2CPA2g6TFbWuqfEX4hXsumfDTwzeS+XHqF4piR5HO5S6RtcQAxIfNlaVEXaC8sfm3/BO/wDYa0X4i+N9U/aj/wCCg+o3njj4pXc5s7bTPF+nhdP0hVk+aK3if92zB2aPZtVY8SKqfMxP5rwpwb/a9L6/jW44dPRR+OdtGo9op7yfmkm72+hm5qnKUVe2/wDX9dyx+yx/wWy+BXxj8Tt8Pf2ifCE/we16Yyy6a3ibU1bTLmBVyN15JHCIJcrKNsiKhMYCyM7iMbOv/wDBRzQvjj42uPh3+wX+zRr3xq1qzvRBqPia3b+y/DunsEkB83UJhhyDGpEW1UmUkxyMQAem/aL/AOCef7PH7af7RmjfE74kaRIEg1ES6ilrIyf2lHDCyxoxbLR7ljt1fbhSkRG3cwkT33wt4Q+Ffw50W0+BPgvwbpVh4MttObSxo9jbeXCisDGyMAPmyOGJJJ3lmYnp+hV+BeE4YtV6VGbvG/snJ8kX19745eS5l69FhKpiKT5Xo7X+X4ang37Bn7XOk/Hu9134UfE7w5beEvjB4HeS08a+EYrsvFOgkVRf2hd3M1uTtXcHfyzIoZmV4Xf6Sr8of+CsP7MXxM/Zd+JXhn9pf9n/AFGCy+JHww1OTXPhxqeoiTHibTlRhd6NKtvgzmRJGiKfIQZWAMKXRev0I/Yj/a4+HX7c/wCy54Q/ag+GTiOx8T6Ysl5ppkZ30u+QmO6snZ0Qs0MyyR79irIFEi5R1J/O+N+GqeUYiOMwkWsPV27Rl1in23a6rVPa79CtCEZJwnzppNPrZ9+zMD/gpF+zZ+x5+1R+yD4q+Gf7c1xpeneAo7cXs3ifUNQispfDl2gKQala3Uvy29xG0hVWOVkEjQukkcskT/NH/BE39sz4r/tRfs/6r8M/ibpviDxfYfDjVpdC8D/HybRmtLXxxo1tJ5EFzcwzETxXIj8ksSrswkAcmRJGPnP/AAW++B3xN8WftgfCrxJ+0T8QL7W/2fNUl+x+F/B32uCCwsPHOxjAl/CI1a7iuLdJjbs7ylZ1lg2pHOEm/Qv9mzxb8IPG/wCzZ4Z0z4LeDrfQNIsVa3udCtcE2N1EB5iMy8yMxcyeY+HkDq7AFzX3PAGWPA5Ksd7XnjUduVbQa3vfXma0ts/km/IxGNpYfEJPRqzvtp2Xcq2mv/EHxf8AG28+D3wjvBpWkeHbZT418WzpG1zI1zbP9nhso33BfveasrKVLQgnciCO48i/Y+8SeOtCuPF/7OHjG8fV77wDrUtvHrFlKbuCS2kmcRq86O6RvuVwIWKOi/u9gaKQJ9B6t8CfBfxXvol1q91nSr+1tRB/a3hzV5bC7msfPSWSxkliILwOw5X7y73KMjNmvRfAngDwJ8JvB9r4K8AeG7LRdG0+MiCztIwkaAkszserMSSzOxLMSSxJJNfb/wBqUsKpJR5m7dLbdb6t3u1a1l8tePE14Yqzg+m/f+v+B0Pzs/4KBftj/BP9oPwVL4R1r4jadp3hT4e3K6z4r8aTOoiKpE9uEtlwXumkllK5jUKWMSx+c0kYbzD/AINyPD3xX17xF8b/ANozwNpus6F+z/8AEHxQl34F0LxXI897favFmK+1KCQSCOON2QpNtjdWkWOJJAtkwfrv+CqH/BLf4T/tt/FLUvBvgDWDYwau66prc9tats0PUx8ouowu1ZWlWSRjA5yxMjFlWSNl9s/4Jb/tq2f7Q3grVP2fdd+Gml+HPFPwljh0TVP+EKgjfwxe20Ja3t7nTHgylvbyLDujtpAjog2oHWNivi+JE8XHgyMMFhr0LxdST3ptvRNdOZ6J+X3bZdGNOrJTfv8Aby/V/kf/2Q=='
        ),
    },
    {
      name: 'swiftness_crystal',
      img: getImageFromBase64(
          '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'
          ),
    },
    {
      name: 'arcane_crystal',
      img: getImageFromBase64(
          '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'
        ),
    },
    {
      name: 'power_crystal',
      img: getImageFromBase64(
          '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'
        ),
    },
    {
      name: 'milk',
      img: getImageFromBase64(
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAhACsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yK87+NnxK+BvwkWPWvjJ8WLHQH1DcNNsri/C3F95ajfHbW65luZPmX5YlZ87cDk7vOf+CgX7T3xA+DeneGvgt8EdS0zTPHnxFF+uha9rYR7fS7a0WE3VxHE2ftN0BcReVAQUPzyPuWIxyfEngD4dfCbwrq2seO/HX7QOkanr0V4tl4r8T634kS/1Ke4jRYxFd3c8gdHCwhRE2FTy8KoAwP59VKp7PnXU/SMjyWGOXtq9Xkh5ayfp29fwPtrRv22/hnNd3Wo/Cr4J/ErxdaWtuJbnWLSws7BdpKqf9H1S7tJxtJA4hA5Jyc7q9o+EvxT8J/Gr4fWHxK8EteDT9QMyCLUbCS1uLeaGZ4JoZYpAGSSOWOSNgRjKHBIwT+Rv7Q/7f3w98BeHtQ8A/s+3Musa1cxtCPErsyw6Yd5VjFwonkwpwdvl4dWDNgrX05/wTw+HPx4/ZG/Zf+B/jfVfGPifUbf4peNbi01vwBq0sV3b2VrfyXt1ZX9k6AvaqLeIXU0ZLeZ9pkL+WyYHpZdlFXNXUjSkuaEHN32dt1fo+19O7XTj4mpYDKKMKsOZpyUddXZ9fv7Jeh9801oonO541J9SKdRXjnjnyJ/wWX+HvhT4jfs9eCdK+J0+rWPgeD4taRJ4+8RaFZRS3ehaS0N1C98jSI/lBJpYFd1ViEdhtYEqfinRf+CDnx51e5tdV0H9pT4Y6t4W1TUVTRPFNu+oRtqlo+Ghu1iS1eHEkbq42XEkR3HbKyjdX6N/8FBPiD8QvDfwo8O/Cb4U6i+meIPi34707wLY+Io13NoUV6sz3N+qbl3vFawXBQBlxIUbJCkH3L4QfAT4afA74WaL8F/hn4Yg0bwv4fsRa6XotiWWONMlmZ2zvmkd2d5JHJaR3Z3yzFj+hcPZRl+Z5OniqWqk7ST1a0vf0e2v3W15Hm2YZfXlHDz0drpq6T8vXrb8enxV+zH/AMEbv2Vv2cPFNj4k8Qa5bfFvxIiSNFc69FFBoVh8wVXNmrSCaXBYbZJpAMBxGpCmvtVPAvwr8RR3D+NV0rxC9xcx3Eo1uCGeNJUhaLfGkgIj+V5OnIEjDODiusg0fTdOZpbDT4IWf77RRBS31I61znj7xve6HqWn+EtBbTl1TV7a6l086vKUglaAR/uBt+YyOZVAABwqyPhtmxvtsvw9DAT+r4Sly310fRK7be7sk+rPKxU8VmVTnxE+d+ey9FsvuPCPjX9s/Z413Ufif8LdHa103Stmpa34f0fnTdU0fdHDcSRQbtkN5CCj7kMalY3ZhziT2zTtR0/V9Pg1bSb6G5tbqFZra5t5A8csbAMrqw4ZSCCCOCDXjPxk8YW3xMn1/wADWWqT2+k6tp+s2H9n2tjHbiXTo9HX7TM7SJ5q3C3tyIdp2qht5kZN6MD1H7Idy97+yh8MrtxzL8P9GYfQ2UJH6V8t4hYGnGjh8W0lUldPu10v5ppr526IWSxqUK9Sjf3d0u3p6/pfe55j/wAFE/8AkYf2c/8As5nw7/6SahX2EnaiiunhT/kSU/8AFL80a4n/AHyfoh0v3K8B+Ef/ACMeu/8AZbNa/wDTdc0UV97gP9yxf+GP6l0P4U/l+Z5LZf8AJZ9a/wCxJ8Sf+hW1ev8A7HP/ACaJ8K/+yb6H/wCm+Ciivz7jz/kTYX1f5yM8u/3+p/hR/9k='
        ),
    },
    {
      name: 'cotton',
      img: getImageFromBase64(
          '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'
        ),
    },
  ]
}

function testRunAtLocal() {
  config.autoPvPIntervalInMins = 30;
  config.autoUpgradeCandyHouse = true;
  config.autoBountiesCheckBluePowder = true;
  config.autoGuildBattleDragon = true;
  config.autoHandleTowerOfSweetChaos = true;
  config.skipMagicLabProduction = false;
  config.autoHandleEventWishingTreeAmounts = 0;
  config.autoHandleCollectCookieOdysseyMission = true;

  loadImages();
  start(JSON.stringify(config));
}

function initRobotmonFramework() {
  this.screenConfig = new RF.ScreenConfig();
  this.screenConfig.devWidth = 640;
  this.screenConfig.devHeight = 360;
  this.screenConfig.actionDuring = 100;
  this.screen = new RF.Screen(this.screenConfig);

  // this.taskManager = new RF.TaskManager();
}

function start(inputConfig) {
  console.log('inputConfig: ', inputConfig);
  config.run = true;
  initRobotmonFramework();

  var rtn = execute('ls /data/data/com.devsisters.ck/shared_prefs');
  if (rtn === 'exit status 1') {
    console.log('Did not find shared_pref, removing all related dirs');
    execute('rm -r /data/data/com.devsisters.ck/app_payload_lib');
    execute('rm -r /data/data/com.devsisters.ck/cache');
    execute('rm -r /data/data/com.devsisters.ck/code_cache');
    execute('rm -r /data/data/com.devsisters.ck/.sealing_reports');
    execute('rm -r /data/data/com.devsisters.ck/files');
  }

  inputConfig = JSON.parse(inputConfig);
  config = mergeObject(config, inputConfig);

  if (!config.isXR) {
    config.magicLabProductIndex = 0;
    config.autoUpgradeCandyHouse = false;
    config.autoPvPPurchaseAncientCookie = false;
    config.autoGuildAllianceBattle = false;
    config.autoHandleBountiesIntervalInMins = 0;
    config.autoBountiesCheckBluePowder = false;
    config.autoHandleTradeHabor = false;
    config.autoBuySeaFairy = false;
    config.autoBuyEpicSoulEssence = false;
    config.autoBuyLegendSoulEssence = false;
    config.autoBuyGuildRelic = false;
    config.autoHandleCollectCookieOdysseyMission = false;
  }

  console.log('start with: ', config.materialsTarget, config.goodsTarget, config.run);

  loadImages();

  checkAndRestartApp();

  handleCheckIfAtLoginScreen()

  if (config.account !== 'default_xrobotmon_account@gmail.com' && config.account !== 'aaa@gmail.com') {
    while (
      !waitUntilSeePages([pageInKingdomVillage, pageAnnouncement, pageInProduction, pageInMagicLab], 2) &&
      config.run
    ) {
      // sendEvent('gameStatus', 'launching');
      if (checkScreenMessage(messageNotifyQuit)) {
        console.log('found messageNotifyQuit while trying to login, hit back');
        keycode('BACK', 1000);
      }

      if (handleInputLoginInfo()) {
        console.log('handleInputLoginInfo success');
        break;
      }

      // we might get into village but seen lots of green checks
      // TODO: Can be improve to enhance login speed
      if (handleTryResolveGreenChecks()) {
        handleGotoKingdomPage();
        console.log('successfully handled green check, we are in village, stop trying login');
        break;
      }

      console.log('Trying to login');
    }
    if (!config.run) {
      console.log('wrong login info, stopping');
      return;
    }
    sendEvent('running', '');
    sendEvent('gameStatus', 'playing');

    if (!config.isTestAccount) {
      config.lastGotoProduction = Date.now();
    }
  }

  if (waitUntilSeePages([pageInProduction, pageInMagicLab], 2)) {
    console.log('Already in production, reset all side tasks');
    config.lastCollectMail = Date.now();
    config.lastCollectDailyReward = Date.now();
    config.lastSendHotAirBallon = Date.now();
    config.lastCollectTrain = Date.now();
    config.lastFulfillWishes = Date.now();
    config.lastAutoHandleEventWishingTree = Date.now();
    config.lastCollectFountain = Date.now();
    config.lastCollectCandyTime = Date.now();
    config.lastAutoPvP = Date.now();
    config.lastAutoSuperMayhem = Date.now();
    config.lastCollectTropicalIsland = Date.now();
    config.lastAutoGuildBattle = Date.now();
    config.lastAutoHandleBounties = Date.now();
    config.lastLabResearch = Date.now();
    config.lastHandleTradeHabor = Date.now();
    config.lastAutoHandleTowerOfSweetChaos = Date.now();
    config.lastAutoHandleCollectCookieOdysseyMission = Date.now();

    config.lastGotoProduction = Date.now();
  } else {
    handleTryResolveGreenChecks();
    handleGotoKingdomPage();
  }

  for (var i = 1; i < 100000000; i++) {
    console.log('start loop', i, new Date().toLocaleString());

    if (config.run == false) {
      console.log('jobs done!');
      break;
    }

    if ((Date.now() - config.lastGotoProduction) / 60000 > 12 && config.productionBuildingChecked > 50) {
      console.log(
        'Check other tasks as we have produce for {0} (>12) mins, productionBuildingChecked: {1}'.format(
          (Date.now() - config.lastGotoProduction) / 60000,
          config.productionBuildingChecked
        )
      );

      if (
        config.autoCollectMailIntervalInMins != 0 &&
        (Date.now() - config.lastCollectMail) / 60000 > config.autoCollectMailIntervalInMins
      ) {
        console.log('Collect mail: ', (Date.now() - config.lastCollectMail) / 60000, ' mins just passed');
        handleAutoCollectMail();
        config.lastCollectMail = Date.now();
      }

      if (config.autoCollectDailyReward && (Date.now() - config.lastCollectDailyReward) / 60000 > 240) {
        console.log(
          'Collect daily reward: ',
          (Date.now() - config.lastCollectDailyReward) / 60000,
          ' mins just passed'
        );
        handleGetDailyRewards();
        config.lastCollectDailyReward = Date.now();
      }

      if (
        config.autoSendHotAirBallonIntervalInMins != 0 &&
        (Date.now() - config.lastSendHotAirBallon) / 60000 > config.autoSendHotAirBallonIntervalInMins
      ) {
        console.log('Check hot air ballon: ', (Date.now() - config.lastSendHotAirBallon) / 60000, ' mins just passed');
        handleGotoHotAirBallon();
        checkAndRestartApp();
        config.lastSendHotAirBallon = Date.now();
      }

      if (
        config.autoCollectTrainIntervalInMins != 0 &&
        (Date.now() - config.lastCollectTrain) / 60000 > config.autoCollectTrainIntervalInMins
      ) {
        console.log('Collect train: ', (Date.now() - config.lastCollectTrain) / 60000, ' mins just passed');
        handleTrain();
        checkAndRestartApp();
        config.lastCollectTrain = Date.now();
      }

      if (
        config.autoFulfillWishesIntervalInMins != 0 &&
        (Date.now() - config.lastFulfillWishes) / 60000 > config.autoFulfillWishesIntervalInMins
      ) {
        console.log('Fulfill wishes: ', (Date.now() - config.lastFulfillWishes) / 60000, ' mins just passed');
        handleWishingTree();
        checkAndRestartApp();
        config.lastFulfillWishes = Date.now();
      }

      if (
        config.autoHandleEventWishingTreeAmounts > 0 &&
        (Date.now() - config.lastAutoHandleEventWishingTree) / 60000 > 20
      ) {
        console.log(
          'Fulfill event wishes: ',
          (Date.now() - config.lastAutoHandleEventWishingTree) / 60000,
          ' mins just passed'
        );
        handleEventWishingTree();
        config.lastAutoHandleEventWishingTree = Date.now();
      }

      if (
        config.autoCollectFountainIntervalInMins != 0 &&
        (Date.now() - config.lastCollectFountain) / 60000 > config.autoCollectFountainIntervalInMins
      ) {
        console.log('Collect fountain: ', (Date.now() - config.lastCollectFountain) / 60000, ' just passed');
        handleFindAndTapFountain();
        checkAndRestartApp();
      }

      if (
        config.autoPvPIntervalInMins != 0 &&
        (Date.now() - config.lastAutoPvP) / 60000 > config.autoPvPIntervalInMins
      ) {
        console.log('AutoPvP: ', (Date.now() - config.lastAutoPvP) / 60000, ' just passed');
        handlePVP();
        checkAndRestartApp();
        config.lastAutoPvP = Date.now();
      }

      if (
        config.autoSuperMayhemIntervalInMins != 0 &&
        (Date.now() - config.lastAutoSuperMayhem) / 60000 > config.autoSuperMayhemIntervalInMins
      ) {
        console.log('Auto Super Mayhem: ', (Date.now() - config.lastAutoSuperMayhem) / 60000, ' just passed');
        handleSuperMayhem();
        config.lastAutoSuperMayhem = Date.now();
      }

      if (
        config.autoCollectTropicalIslandsIntervalInMins != 0 &&
        (Date.now() - config.lastCollectTropicalIsland) / 60000 > config.autoCollectTropicalIslandsIntervalInMins
      ) {
        console.log(
          'Collect Tropical island: ',
          (Date.now() - config.lastCollectTropicalIsland) / 60000,
          ' just passed'
        );
        handleCollectIslandResources();
        checkAndRestartApp();
        config.lastCollectTropicalIsland = Date.now();
      }

      if (
        config.autoHandleBountiesIntervalInMins != 0 &&
        (Date.now() - config.lastAutoHandleBounties) / 60000 > config.autoHandleBountiesIntervalInMins
      ) {
        console.log('autoBounty: ', (Date.now() - config.lastAutoHandleBounties) / 60000, ' just passed');
        handleBounties();
        checkAndRestartApp();
        config.lastAutoHandleBounties = Date.now();
      }

      if (config.autoLabResearch && (Date.now() - config.lastLabResearch) / 60000 > 15) {
        console.log('autoResearch: ', (Date.now() - config.lastLabResearch) / 60000, ' just passed (> 15 mins)');
        handleGotoGnomeLab();
        checkAndRestartApp();
        config.lastLabResearch = Date.now();
      }

      if (
        (config.autoHandleTradeHabor ||
          config.autoBalanceAuroraStocks ||
          config.autoBuyLegendSoulEssence ||
          config.autoBuyEpicSoulEssence ||
          config.autoBuyCaramelStuff ||
          config.autoBuyRadiantShardsInHabor ||
          config.autoBuySeaFairy) &&
        (Date.now() - config.lastHandleTradeHabor) / 60000 > 120
      ) {
        console.log('handleTradeHabor: ', (Date.now() - config.lastHandleTradeHabor) / 60000, ' just passed');
        handleTradeHabor();
        checkAndRestartApp();
        config.lastHandleTradeHabor = Date.now();
      }

      if (config.autoHandleTowerOfSweetChaos && (Date.now() - config.lastAutoHandleTowerOfSweetChaos) / 60000 > 240) {
        console.log(
          'handleTowerOfSweetChaos: ',
          (Date.now() - config.lastAutoHandleTowerOfSweetChaos) / 60000,
          ' just passed'
        );
        handleTowerOfSweetChaos();
        checkAndRestartApp();
        config.lastAutoHandleTowerOfSweetChaos = Date.now();
      }

      if (
        config.autoHandleCollectCookieOdysseyMission &&
        (Date.now() - config.lastAutoHandleCollectCookieOdysseyMission) / 60000 > 360
      ) {
        console.log(
          'handleCollectCookieOdyssey: ',
          (Date.now() - config.lastAutoHandleCollectCookieOdysseyMission) / 60000,
          ' just passed'
        );
        handleCollectCookieOdyssey();
        config.lastAutoHandleCollectCookieOdysseyMission = Date.now();
      }

      if ((Date.now() - config.lastTryResolveGreenChecks) / 60000 > 20) {
        console.log(
          'handleTryResolveGreenChecks: ',
          (Date.now() - config.lastTryResolveGreenChecks) / 60000,
          ' just passed'
        );
        handleTryResolveGreenChecks();
      }

      if ((Date.now() - config.lastAutoGuildBattle) / 60000 > 180) {
        console.log('autoGuildBattle: ', (Date.now() - config.lastAutoGuildBattle) / 60000, ' mins just passed (>120)');
        handleGuildCheckinAndBattle();
        if (config.autoGuildBattleDragon) {
          handleGuildBattleDragon();
        }
        if (config.autoGuildAllianceBattle) {
          handleGuildBattleAlliance();
        }
        checkAndRestartApp();
        config.lastAutoGuildBattle = Date.now();
      }

      if (
        config.worksBeforeCollectCandy != 0 &&
        (Date.now() - config.lastCollectCandyTime) / 60000 > config.worksBeforeCollectCandy
      ) {
        console.log('Collect candy: ', (Date.now() - config.lastCollectCandyTime) / 60000, ' just passed');
        handleFindAndTapCandyHouse();
        checkAndRestartApp();
        config.lastCollectCandyTime = Date.now();
      }
    }

    var act = JobScheduling();
    // console.log('JobScheduling result: ', act);
    sleep(config.sleep);
    handleNotEnoughStock();
    sleep(config.sleep);
    handleNextProductionBuilding();
    console.log('performed  act: ', act);

    if ((Date.now() - config.lastNetworkIssueOccurTime) / 1000 > 180) {
      config.networkIssueCount = 0;
    }
    if (config.networkIssueCount > config.networkIssueCountThreasHold) {
      console.log(
        'Reboot nox as too many network error: ',
        config.networkIssueCount,
        ' in ',
        (Date.now() - config.lastNetworkIssueOccurTime) / 1000,
        ' secs'
      );
      execute('/system/bin/reboot -p');
    }

    checkIsFreeze();
    if (!act) {
      config.jobFailedCount++;
      if (config.jobFailedCount < config.jobFailedBeforeGetCandy) {
        console.log(config.jobFailedCount + '/' + config.jobFailedBeforeGetCandy + ' jobFail, continue');
        sleep(1000);
        continue;
      }
      console.log('max job fails reached, check for handling: ', config.jobFailedCount);

      if (checkIsPage(pageInProduction) || checkIsPage(pageInMagicLab)) {
        console.log('in production, continue work');
        config.jobFailedCount = 0;
        continue;
      } else if (handleUnexpectedMessageBox()) {
        console.log('just handleUnexpectedMessageBox()');
        config.jobFailedCount = 0;
        continue;
      } else if (handleCheckIfAtLoginScreen()) {
        console.log('just handleCheckIfAtLoginScreen()');
        config.jobFailedCount = 0;
        continue;
      } else if (handleTryResolveGreenChecks()) {
        console.log('just handleTryResolveGreenChecks()');
        handleGotoKingdomPage();
        config.jobFailedCount = 0;
        continue;
      } else if (handleWelcomePage()) {
        console.log('just handleWelcomePage()');
        handleAnnouncement();
        config.jobFailedCount = 0;
        continue;
      } else if (handleAnnouncement() || checkIsPage(pageInKingdomVillage)) {
        console.log('in village, find production');
        handleFindAndTapCandyHouse();
        config.jobFailedCount = 0;
        continue;
      } else if (getCurrentApp()[0] !== 'com.devsisters.ck') {
        console.log('Cookie not active, calling checkAndRestartApp to restart CookieKingdom');
        checkAndRestartApp();
      } else if (checkIsPage(pageCookieKingdomIsNotResponding)) {
        console.log('Popped pageCookieKingdomIsNotResponding, tap wait');
        qTap(pageCookieKingdomIsNotResponding);
        sleep(3000);
      } else if (checkIsPage(pageCookieKingdomIsNotResponding2)) {
        console.log('Popped pageCookieKingdomIsNotResponding2, tap wait');
        qTap(pageCookieKingdomIsNotResponding2);
        sleep(3000);
      } else if (checkIsPage(pageCookieKingdomHasStopped)) {
        console.log('Popped pageCookieKingdomHasStopped, tap OK');
        qTap(pageCookieKingdomHasStopped);
        sleep(3000);
      } else if (handleSkipRemoveGroundGuide()) {
        console.log('successfully resolved stuck by pageGnomeTeachRemoveGround');
      } else if (handleGotoKingdomPage()) {
        console.log('just handleGotoKingdomPage(), start looking for productions');
        handleFindAndTapCandyHouse();
        config.jobFailedCount = 0;
        continue;
      } else if (handleInputLoginInfo()) {
        console.log('login, wait 5s and check for handleWelcomePage()');
        sleep(5000);
        for (var j = 0; j < 3; j++) {
          if (handleWelcomePage() || handleAnnouncement()) {
            handleFindAndTapCandyHouse();
            config.jobFailedCount = 0;
            break;
          }
          sleep(3000);
        }
      }
    } else {
      config.jobFailedCount = 0;
      sendEvent('running', '');
      // console.log('Cookie action successfully at: ', new Date().toLocaleString());
    }
  }
}

// testRunAtLocal();
// loadImages()
// initRobotmonFramework()
