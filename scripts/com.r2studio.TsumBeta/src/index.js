"use strict";

function TaskController(){this.tasks={},this.isRunning=!1,this.interval=200}TaskController.prototype.getFirstPriorityTaskName=function(){var t=null,n=Date.now();for(var s in this.tasks){var i=this.tasks[s];n-i.lastRunTime<i.interval||(null!==t?i.priority<t.priority?t=i:i.interval>t.interval?t=i:i.lastRunTime<t.lastRunTime&&(t=i):t=i)}return null===t?"":t.name},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=this.getFirstPriorityTaskName(),n=this.tasks[t];void 0!==n&&(n.run(),n.lastRunTime=Date.now(),n.runTimes--,0===n.runTimes&&delete this.tasks[t]),sleep(this.interval)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.updateRunInterval=function(t){t<this.interval&&t>=50&&(this.interval=t)},TaskController.prototype.newTaskObject=function(t,n,s,i,o){return{name:t,run:n,interval:s||1e3,runTimes:i||0,priority:o,lastRunTime:0,status:0}},TaskController.prototype.newTask=function(t,n,s,i,o){if(void 0===o&&(o=!1),"function"==typeof n){var e=this.newTaskObject(t,n,s,i,0);o&&(e.lastRunTime=Date.now()),this.updateRunInterval(e.interval);var r="system_newTask_"+t,a=this.newTaskObject(r,function(){this.tasks[t]=e}.bind(this),0,1,-20);return this.tasks[r]=a,e}console.log("Error not a function",t,n)},TaskController.prototype.removeTask=function(t){var n="system_removeTask_"+Date.now().toString(),s=this.newTaskObject(n,function(){delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[n]=s},TaskController.prototype.removeAllTasks=function(){var t="system_removeAllTask_"+Date.now().toString(),n=this.newTaskObject(t,function(){for(var t in this.tasks)delete this.tasks[t]}.bind(this),0,1,-20);this.tasks[t]=n},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning&&(this.isRunning=!1,console.log("wait loop stop..."))};


var ts;
var gTaskController;

// Utils
function isSameColor(c1, c2, diff) {
  if (diff === undefined) {
    diff = 20;
  }
  return Math.abs(c1.r - c2.r) <= diff
      && Math.abs(c1.g - c2.g) <= diff
      && Math.abs(c1.b - c2.b) <= diff;
}

function absColor(c1, c2) {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
}

function nowTime() {
  var offset = (new Date().getTimezoneOffset()) * 60 * 1000;
  return Date.now() + offset;
}

function debug() {
  if (Config.debugLogs) {
    var argsArray = Array.prototype.slice.call(arguments);
    var newArgs = ['*DEBUG*'].concat(argsArray);
    log.apply(null, newArgs);
  }
}

function log() {
  sleep(10);
  var args = [];
  if (ts !== undefined && ts.showHeartLog && ts.record && ts.record['hearts_count']) {
    var msg = "";
    msg += "R:"+ts.record['hearts_count'].receivedCount+" ";
    msg += "S:"+ts.record['hearts_count'].sentCount;
    if (gTaskController !== undefined && gTaskController.tasks !== undefined) {
      var sendTask = gTaskController.tasks["sendHearts"];
      if (sendTask !== undefined) {
        if (sendTask.lastRunTime === 0) {
          msg += "/0";
        } else {
          var next = (nowTime() - (sendTask.lastRunTime + sendTask.interval)) / 60000;
          msg += "/" + (+next.toFixed(0));
        }
      }
    }
    args.push("["+msg+"]");
  }
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      arguments[i] = JSON.stringify(arguments[i], null, 2);
    } else if (typeof arguments[i] == 'function') {
      if (Config.debugLogs)
        arguments[i] = arguments[i]();
      else
        arguments[i] = "";
    }
    args.push(arguments[i]);
  }
  console.log.apply(console, args);
}

// ============================TSUM=============================== //

var Config = {
  recordDir: 'tsum_record',
  tsumWidth: 16,
  tsumBoundW: 13, // tsumWidth / 2 + 2
  tsumBoundH: 13,
  screenResize: 200,
  gameContinueDelay: 400,
  colors: [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]],
  debugLogs: false
};

// Top of the square play area in logical coordinates. The board occupies the
// 1080x1080 square below this line; everything above is score/timer chrome.
// Mirrors the 465 that Tsum.prototype.detectScreenSize uses for playOffsetY.
var PlayAreaTopY = 465;

// --- Tiara Minnie+ ------------------------------------------------------
// (Ported from TsumThi)
//
// Her skill shows Minnie with a thought bubble containing one present, then a
// screen of presents to pick the matching one from. The bubble appears once per
// activation, so an activation is exactly one pick. A correct one adds a present
// to the next activation's screen (2 up to 6); a wrong one resets it to 2 --
// which is why every layout has to be handled, but also why the count never
// needs to be tracked between activations.
//
// The presents always land on the same centres for a given count, so there is
// nothing to search for: crop each known centre, crop the bubble, and compare
// the pictures directly. Centres are logical 1080x1920 and were read off
// TsumThi's doc/screenshots/TiaraMinnie (blob centres agreed within ~20px).
var TiaraLayouts = {
  2: [{x: 292, y: 973},  {x: 781, y: 1059}],
  3: [{x: 781, y: 829},  {x: 666, y: 1275}, {x: 306, y: 987}],
  4: [{x: 292, y: 1232}, {x: 263, y: 829},  {x: 796, y: 757},  {x: 796, y: 1117}],
  5: [{x: 234, y: 1117}, {x: 882, y: 1102}, {x: 292, y: 771},  {x: 839, y: 742},
      {x: 551, y: 1304}],
  6: [{x: 752, y: 757},  {x: 378, y: 728},  {x: 176, y: 973},  {x: 896, y: 1001},
      {x: 349, y: 1232}, {x: 680, y: 1261}]
};

// Presents shrink as more of them appear; these are the crop sides that put the
// present in the same fraction of the frame at every count (measured widths ran
// 270/275/252/237/237 for counts 2..6).
var TiaraSlotSide = {
  2: 300, 3: 295, 4: 280, 5: 265, 6: 260
};

var TiaraMinnieConfig = {
  // Resolution the play square is captured at for matching.
  //
  // Was briefly dropped to 300 for speed on the strength of the offline sweep
  // finding 270-720 all scoring 20/20 -- and wrong taps appeared on the device.
  // Do not lower it again without re-running the harness: the sweep varied this
  // alone against static frames, which is not the same claim as "300 is safe",
  // and a cell is only ~5.6 capture pixels wide there, so cell centres snap to
  // the grid with a tenth of a cell of error and the blur has less to work with.
  captureSize: 420,
  // Blur radius, in capture pixels, that makes one pixel read stand in for the
  // average of its cell -- so it has to stay in proportion to captureSize.
  captureBlur: 7,

  // The thought bubble is drawn at a fixed spot, so the template is a fixed
  // crop -- no searching. Verified at (250..255, 870..875) on every dream frame
  // where the present could be isolated, and +/-16px of error still ranked the
  // right present first.
  bubbleX: 252,
  bubbleY: 872,
  bubbleSide: 240,

  // Cloud test, used to tell "bubble is up" from "presents are up" and from
  // "the skill is over". Measured 0.484-0.503 on bubble frames vs 0.019-0.060
  // on present frames, so the threshold sits in a very wide gap.
  cloudBox: {x0: 60, y0: 690, x1: 450, y1: 1050},
  cloudSatMax: 70,
  cloudValMin: 180,
  // Sample spacing inside the box, leaving 162 samples. Was briefly 40 (64
  // samples): the gap between a bubble frame and a present frame is wide enough
  // for that, but the fraction is also read *during* the bubble's fade, where
  // the true value passes through the threshold and 64 samples leave a standard
  // error of 0.06 -- enough to call the cloud gone early.
  cloudStep: 24,
  cloudMinFrac: 0.25,
  // This test is polled in a loop, and it is only asking whether a big pale
  // blob is present, so it gets its own small capture with no blur. At the
  // matching resolution each check cost a 420x420 grab plus a 7px blur, which
  // made the poll slower than the interval it was polling on.
  cloudCaptureSize: 120,

  // Comparison grid. Each crop is reduced to grid x grid cells; cells are
  // compared only where the template says the present is, which drops the board
  // background (dark tsums) and the bubble background (white cloud) alike.
  // 10 through 20 all scored the same offline, so this is the cheap end of the
  // range that still held up.
  grid: 12,
  satMin: 70,
  valMin: 170,

  // Per-cell differences are divided by this and clipped at 1, so the score
  // counts clearly-disagreeing cells instead of averaging away small ones.
  // Raised the worst-case margin from 0.095 to 0.264 against the same frames.
  cellSpread: 0.30,

  // A tap needs both of these. The score alone cannot say whether the presents
  // are up yet: a green template scores 0.461 against ordinary green tsums, so
  // a board with no presents on it would clear any floor low enough to keep the
  // real matches (which fall to ~0.44 if the presents are 10px off the table).
  //
  // The margin does separate the two, because bare board has no standout winner
  // -- it reached 0.096 at best, where a real choice screen never scored under
  // 0.278. So the floor rejects noise and the margin proves a present is there.
  confidenceFloor: 0.42,
  marginFloor: 0.12,

  // Tapping a present detonates an area of the board, so the blast wants a full,
  // still board under it. The play loop clears a chain immediately before the
  // skill fires (and may have just used the fan), so at activation the tsums are
  // almost always mid-fall and a blast then catches very few of them.
  //
  // How long that takes varies with how much was cleared, so it is measured
  // rather than guessed: take a coarse brightness fingerprint of the board twice
  // and watch how much it changes. Falling tsums move it a lot, a settled board
  // barely at all (only sparkles and the fever glow).
  //
  // For scale, that measure is 0 between identical frames, ~0.06 between two
  // frames of a similar scene, and 0.20-0.30 between wholly different screens.
  // settleMaxDiff is the one number here not pinned down by measurement, so it
  // is set loose rather than tight: too strict just means every activation waits
  // out settleWaitMs, which is the delay this was added to avoid. The timeout
  // logs the diff it actually saw, which is what to tune from.
  settleWaitMs: 320,
  settleMinMs: 60,
  settlePollMs: 30,
  settleCapture: 64,
  settleGrid: 16,
  settleMaxDiff: 0.03,
  settleQuietScans: 2,

  // Timings. The bubble is shown once, ~2s after the skill fires, and the
  // presents ~1s after that. The game timer is stopped while the presents are
  // up, so the checks made there are free; everything before them costs real
  // game time, which is what these are sized against.
  //
  // Nothing can happen until the skill animation has played, so sit that out
  // rather than spending ~15 screenshots polling for something that cannot have
  // happened yet.
  dreamLeadMs: 1500,
  // Covers the lead plus a bubble arriving late. Only ever spent in full when
  // the skill did not actually fire.
  dreamWaitMs: 3000,
  dreamSettleMs: 250,
  // After the bubble clears, the presents take about a second to arrive. Waiting
  // most of that out first means the matcher never sees the hand-over frames.
  //
  // This lead and pollMs have to be read together: matching starts at (however
  // late the poll noticed the cloud go) + this. Trading one against the other by
  // their averages caused wrong taps -- doubling pollMs raises the mean lag by
  // 50ms but the *minimum* stays 0, so shortening this lead to compensate moves
  // the earliest possible start earlier, and the earliest start is what decides
  // whether the matcher can catch a present still sliding into place.
  choiceLeadMs: 500,
  choiceWaitMs: 6000,
  pollMs: 100,
  // The matching loop's own interval: it is not waiting on a known animation but
  // on the presents becoming readable, and it leaves the moment two scans agree.
  matchPollMs: 100,
  agreeScans: 2,
  pickTaps: 2,
  pickTapDuring: 60,
  pickTapGapMs: 50
};

// --- Game bubbles -------------------------------------------------------
// (Ported from TsumThi)
//
// Tiara Minnie+ makes a bubble popped as a chain goes off clear a bigger area,
// so bubbles are worth tapping the instant a long chain lands rather than on
// the play loop's periodic sweep (which is ~50 blind taps and far too slow to
// land inside a chain).
//
// A bubble is a circle like a tsum, only much bigger, so it falls out of the
// same grayscale Hough pass findTsums already runs -- on the capture the scan
// already took, which is what makes locating them cost nothing extra.
var GameBubbleConfig = {
  // Circle geometry in the 200px play-square space findTsums works in, where a
  // tsum is radius 8-14.
  //
  // NOT YET CALIBRATED: there is no saved frame with a bubble on the board to
  // measure against, so this range is reasoned from a bubble being noticeably
  // larger than a tsum, not measured. Getting it wrong costs stray taps on bare
  // board, which the game ignores -- a tap is not a drag, so nothing links.
  minRadius: 16,
  maxRadius: 30,
  minDist: 30,
  param1: 20,
  param2: 26,

  // Chain length that earns a pop, and a cap so a frame full of false circles
  // cannot turn into a long burst of taps mid-chain.
  minChainForPop: 4,
  maxTaps: 3,
  tapDuring: 10
};

// Definitions assuming screen resolution of 1080 * 1920
var Button = {
  gameBubblesFrom: {x: 100, y: 632},
  gameBubblesTo: {x: 1000, y: 1532},
  gameQuestionCancel: {x: 400, y: 1352},
  gameQuestionCancel2: {x: 400, y: 1072},
  gameStop: {x: 440, y: 1072},
  gameSkill1: {x: 160, y: 1702},
  gameSkill2: {x: 95, y: 1702},
  gameRand: {x: 985, y: 1652, color: {"a":0,"b":6,"g":180,"r":232}},
  gamePause: {x: 983, y: 322, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue: {x: 540, y: 1342, color: {"a":0,"b":13,"g":175,"r":240}},
  outGameItems: [
    {x: 205, y: 889},    // +Score
    {x: 435, y: 893},    // +Coin
    {x: 651, y: 889},    // +Exp
    {x: 871, y: 893},    // +Time
    {x: 201, y: 1167},   // +Bubble
    {x: 424, y: 1170},   // 5>4
    {x: 610, y: 1175}],  // +Combo
  outStart: {x: 500, y: 1592, color: {"a":0,"b":129,"g":111,"r":236}}, // 開始
  outClose: {x: 500, y: 1592, color: {"a":0,"b":7,"g":180,"r":236}}, // 關閉
  outReceive: {x: 910, y: 422},
  outReceiveAll: {x: 800, y: 1422},
  outReceiveOk: {x: 835, y: 1092, color: {"a":0,"b":6,"g":175,"r":236}},
  outReceiveAllHeartsDisabledJP: {x: 679, y: 880, color: {"a":0,"b":214,"g":129,"r":41}},
  outReceiveAllRubiesEnabledJP: {x: 261, y: 705, color: {"a":0,"b":33,"g":178,"r":247}},
  outReceiveAllOkJP: {x: 835, y: 1258, color: {"a":0,"b":6,"g":175,"r":236}},
  outReceiveItemSetOk: {x: 830, y: 1260, color: {"a":0,"b":8,"g":176,"r":238}},
  outReceiveClose: {x: 530, y: 1372},
  outReceiveOneBase: {y: 569},
  outReceiveOne: {x: 840, color: {"a":0,"b":30,"g":181,"r":235}, color2: {"a":0,"b":119,"g":74,"r":40}},
  outReceiveOneRubyBase: {y: 651}, // ruby
  outReceiveOneRuby: {x: 295, color: {r: 224, g: 93, b: 101}}, // ruby
  outReceiveOneAdBase: { y: 672 }, // ad
  outReceiveOneAd: { x: 290, color: { r: 90, g: 57, b: 25 } }, // ad
  outReceiveTimeout: {x: 600, y: 1092, color: {"a":0,"b":11,"g":171,"r":235}},
  outSendHeartTop: {x: 910, y: 502},
  outSendHeart0: {x: 910, y: 698, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart1: {x: 910, y: 895, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart2: {x: 910, y: 1102, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart3: {x: 910, y: 1304, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeartBottom: {x: 910, y: 1500},
  outSendHeartClose: {x: 666, y: 1426, color: {r: 236, g: 178, b: 9}},
  outSendHeartFrom: {x: 910, y: 602},
  outSendHeartTo: {x: 910, y: 1322},
  outSendHeartEnd: {x: 328, y: 1266, color: {"a":0,"b":132,"g":85,"r":47}},
  outSendHeartEnd2: {x: 227, y: 1262, color: {"a":0,"b":123,"g":78,"r":44}},
  outSendHeartEnd3: {x: 316, y: 1224, color: {r: 55, g: 91, b: 139}},
  outFriendScoreFrom: {x: 550, y: 935, color: {"a":0,"b":140,"g":93,"r":55}},
  outFriendScoreTo: {x: 760, y: 935},
  outHomePage: {x: 60, y: 1000},
  outFriendPage: {x: 60, y: 1130},
  skillLuke1: {x: 1000, y: 1372},
  skillLuke2: {x: 830, y: 1402},
  skillLuke3: {x: 670, y: 1447},
  skillLuke4: {x: 960, y: 1232},
  skillCptLy1: {x: 670, y: 1050},
  skillCptLy2: {x: 310, y: 1050},
  skillCptLy3: {x: 540, y: 414},
  outReceiveNameFromBase: {y: 532},
  outReceiveNameFrom: {x: 150},
  outReceiveNameToBase: {y: 670},
  outReceiveNameTo: {x: 660},
  moneyInfoBox: {x: 430, y: 188, w: 230, h: 56},
  outOpenTsumCollectionOrder: {x: 983, y: 890, r: 165, g: 85, b: 49},

  outCloseTsumCollectionOrderOld: {x: 552, y: 1365, r: 247, g: 174, b: 8},
  outTsumCollectionOrderByReleaseDateOld: {name: 'By Release Date', x: 331, y: 774, r: 247, g: 178, b: 8},
  outTsumCollectionOrderFavoritesOld: {name: 'By Favorites', x: 765, y: 769, r: 247, g: 174, b: 8},
  outTsumCollectionOrderBySkillOld: {name: 'By Skill', x: 310, y: 988, r: 247, g: 174, b: 8},
  outTsumCollectionOrderByLevelLockOld: {name: 'By Level Lock', x: 766, y: 984, r: 247, g: 174, b: 8},

  outCloseTsumCollectionOrderNew: {x: 552, y: 1585, r: 247, g: 185, b: 8},
  outTsumCollectionOrderByReleaseDateNew: {name: 'By Release Date', x: 330, y: 673, r: 247, g: 178, b: 8},
  outTsumCollectionOrderFavoritesNew: {name: 'By Favorites', x: 765, y: 668, r: 247, g: 174, b: 8},
  outTsumCollectionOrderBySkillNew: {name: 'By Skill', x: 310, y: 900, r: 247, g: 174, b: 8},
  outTsumCollectionOrderByLevelLockNew: {name: 'By Level Lock', x: 766, y: 894, r: 247, g: 174, b: 8},
  outTsumCollectionOrderByEntryDateNew: {name: 'By Entry Date', x: 310, y: 1125, r: 247, g: 174, b: 8},

  outTsumCollectionDoUnlock: {x: 111, y: 760, r: 173, g: 109, b: 57}
};

var Page = {

  TodayMissions: {
    name: 'TodayMissions',
    colors: [
      {x: 764, y: 445, r: 248, g: 190, b: 15, match: true, threshold: 80},
      {x: 781, y: 436, r: 165, g: 92, b: 63, match: true, threshold: 80},
      {x: 823, y: 445, r: 248, g: 249, b: 249, match: true, threshold: 80},
      {x: 554, y: 444, r: 45, g: 111, b: 142, match: true, threshold: 80},
      {x: 550, y: 1421, r: 33, g: 196, b: 231, match: true, threshold: 80},
      {x: 593, y: 1423, r: 240, g: 175, b: 8, match: true, threshold: 80},
      {x: 176, y: 1658, r: 238, g: 172, b: 8, match: true, threshold: 80},
      {x: 55, y: 1649, r: 238, g: 172, b: 8, match: true, threshold: 80},
      {x: 25, y: 1655, r: 8, g: 16, b: 26, match: true, threshold: 80}
    ],
    back: {x: 176, y: 1662},
    next: {x: 176, y: 1662}
  },
  TodayMission: {
    name: 'TodayMission',
    colors: [
      {x: 540, y: 1480, r: 238, g: 181, b: 12 , match: true, threshold: 80},
      {x: 975, y: 500, r: 161, g: 224, b: 231, match: true, threshold: 80},
      {x: 554, y: 1332, r: 24 , g: 189, b: 219, match: true, threshold: 80}
    ],
    back: {x: 558, y: 1473},
    next: {x: 558, y: 1473}
  },
  ScorePage: {
    name: 'ScorePage',
    colors: [
      {x: 302, y: 1581, r: 235, g: 184, b: 7  , match: true, threshold: 80},
      {x: 777, y: 1588, r: 248, g: 142, b: 20 , match: true, threshold: 80},
      {x: 774, y: 500, r: 243, g: 248, b: 242, match: true, threshold: 80}
    ],
    back: {x: 309, y: 1653},
    next: {x: 784, y: 1653}
  },
  ProfilePageJp: {
    name: 'ProfilePage',
    colors: [
      {x: 540, y: 1592, r: 246, g: 135, b:  17, match: true, threshold: 80}, // top of the start button
      {x: 187, y: 1599, r: 240, g: 218, b:  72, match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b:   7, match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y:  464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // above the ranking title
      {x:  34, y: 1004, r: 247, g: 178, b:   8, match: true, threshold: 80}, // left home tab button
      {x:  6, y: 1120, r:  46, g: 135, b: 232, match: true, threshold: 80}, // left ranking tab button
      {x:  6, y: 1270, r:  44, g: 134, b: 233, match: true, threshold: 80}  // left square tab button
    ],
    back: {x: 31, y: 1126},
    next: {x: 31, y: 1126},
    tsums: {x: 900, y: 1653}
  },
  ProfilePageIntl: {
    name: 'ProfilePage',
    colors: [
      {x: 540, y: 1592, r: 246, g: 135, b:  17, match: true, threshold: 80}, // top of the start button
      {x: 187, y: 1599, r: 240, g: 218, b:  72, match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b:   7, match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y:  464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // above the ranking title
      {x:  34, y: 1004, r: 247, g: 178, b:   8, match: true, threshold: 80}, // left home tab button
      {x:   6, y: 1120, r:  46, g: 135, b: 232, match: true, threshold: 80}, // left ranking tab button
      {x:   6, y: 1270, r:  52, g:  98, b: 143, match: true, threshold: 80}  // left border where in JP left square tab button is
    ],
    back: {x: 31, y: 1126},
    next: {x: 31, y: 1126},
    tsums: {x: 900, y: 1653}
  },
  SquarePage: {
    name: 'SquarePage',
    colors: [
      {x: 540, y: 1592, r: 246, g: 135, b:  17, match: true, threshold: 80}, // top of the start button
      {x: 187, y: 1599, r: 240, g: 218, b:  72, match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b:   7, match: true, threshold: 80}, // left of the myTsum button
      {x:  18, y:  994, r:  46, g: 135, b: 234, match: true, threshold: 80}, // left home tab button
      {x:  16, y: 1120, r:  46, g: 135, b: 232, match: true, threshold: 80}, // left ranking tab button
      {x:  34, y: 1270, r: 247, g: 175, b:   8, match: true, threshold: 80}  // left square tab button
    ],
    back: {x: 31, y: 1126},
    next: {x: 31, y: 1126}
  },
  FriendPage: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1592, r: 246, g: 135, b: 17 , match: true, threshold: 80}, // top of the start button
      {x: 187, y: 1599, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
      {x: 960, y: 430, r: 24, g: 192, b: 231, match: true, threshold: 80}           // right bottom next to the mailbox icon
    ],
    back: {x: 547, y: 1653},
    next: {x: 547, y: 1653},
    tsums: {x: 900, y: 1653}
  },
  FriendPage2: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1649, r: 175, g: 188, b: 197, match: true, threshold: 80}, // center of the Tsum Hades
      {x: 187, y: 1599, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
      {x: 960, y: 430, r: 24, g: 192, b: 231, match: true, threshold: 80}           // right bottom next to the mailbox icon
    ],
    back: {x: 547, y: 1653},
    next: {x: 547, y: 1653},
    tsums: {x: 900, y: 1653}
  },
  FriendPage3: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1649, r: 203, g: 192, b: 237, match: true, threshold: 80}, // center of the Tsum Ursula
      {x: 187, y: 1599, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
      {x: 960, y: 430, r: 24, g: 192, b: 231, match: true, threshold: 80}           // right bottom next to the mailbox icon
    ],
    back: {x: 547, y: 1653},
    next: {x: 547, y: 1653},
    tsums: {x: 900, y: 1653}
  },
  FriendPage4: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1649, r: 79 , g: 89 , b: 94 , match: true, threshold: 80}, // center of the Tsum Maleficentd
      {x: 187, y: 1599, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1653, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 464, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
      {x: 960, y: 430, r: 24, g: 192, b: 231, match: true, threshold: 80}           // right bottom next to the mailbox icon
    ],
    back: {x: 547, y: 1653},
    next: {x: 547, y: 1653},
    tsums: {x: 900, y: 1653}
  },
  GiftHeart: {
    name: 'GiftHeart',
    colors: [
      {x: 216, y: 1084, r: 233, g: 172, b: 6  , match: true, threshold: 80},
      {x: 673, y: 1080, r: 235, g: 174, b: 8  , match: true, threshold: 80},
      {x: 468, y: 803, r: 214, g: 61 , b: 143, match: true, threshold: 100},
      {x: 572, y: 561, r: 30 , g: 193, b: 224, match: true, threshold: 80},
      {x: 583, y: 1195, r: 28 , g: 186, b: 221, match: true, threshold: 80}
    ],
    back: {x: 774, y: 1095},
    next: {x: 320, y: 1091}
  },
  MailBox: {
    name: 'MailBox',
    colors: [
      {x: 738, y: 414, r: 240, g: 245, b: 239, match: true, threshold: 80},
      {x: 550, y: 1581, r: 238, g: 187, b: 10 , match: true, threshold: 80},
      {x: 604, y: 1419, r: 234, g: 171, b: 6  , match: true, threshold: 80}
    ],
    back: {x: 561, y: 1653},
    next: {x: 561, y: 1653}
  },
  MailBox2: {
    name: 'MailBox',
    colors: [
      {x: 738, y: 414, r: 240, g: 245, b: 239, match: true, threshold: 80},
      {x: 550, y: 1581, r: 238, g: 187, b: 10 , match: true, threshold: 80},
      {x: 619, y: 1426, r: 19 , g: 137, b: 175, match: true, threshold: 80}
    ],
    back: {x: 561, y: 1653},
    next: {x: 561, y: 1653}
  },
  ReceiveHeart: {
    name: 'ReceiveHeart',
    colors: [
      {x: 208, y: 1080, r: 233, g: 172, b: 6  , match: true, threshold: 80},
      {x: 662, y: 1080, r: 232, g: 171, b: 5  , match: true, threshold: 80},
      {x: 561, y: 554, r: 28 , g: 191, b: 222, match: true, threshold: 80},
      {x: 565, y: 1210, r: 30 , g: 195, b: 225, match: true, threshold: 80},
      {x: 334, y: 817, r: 213, g: 62 , b: 143, match: true, threshold: 90},
      {x: 586, y: 821, r: 248, g: 249, b: 51 , match: true, threshold: 100}
    ],
    back: {x: 774, y: 1095},
    next: {x: 320, y: 1091}
  },
  Received: {
    name: 'Received',
    colors: [
      {x: 799, y: 716, r: 30, g: 188, b: 223, match: true, threshold: 80},
      {x: 806, y: 889, r: 45, g: 80 , b: 122, match: true, threshold: 80},
      {x: 799, y: 1048, r: 27, g: 188, b: 217, match: true, threshold: 80}
    ],
    back: {x: 774, y: 1095},
    next: {x: 320, y: 1091}
  },
  Received2: {
    name: 'Received',
    colors: [
      {x: 799, y: 716, r: 30, g: 188, b: 223, match: true, threshold: 80},
      {x: 889, y: 824, r: 40, g: 72 , b: 111, match: true, threshold: 80},
      {x: 799, y: 1048, r: 27, g: 188, b: 217, match: true, threshold: 80}
    ],
    back: {x: 774, y: 1095},
    next: {x: 320, y: 1091}
  },
  StartPage: {
    name: 'StartPage',
    colors: [
      {x: 752, y: 471, r: 244, g: 249, b: 243, match: true, threshold: 80},
      {x: 856, y: 1430, r: 30 , g: 193, b: 224, match: true, threshold: 80},
      {x: 169, y: 1581, r: 239, g: 188, b: 11 , match: true, threshold: 80},
      {x: 547, y: 1581, r: 235, g: 118, b: 134, match: true, threshold: 80},
      {x: 792, y: 1660, r: 234, g: 171, b: 8  , match: true, threshold: 100}
    ],
    back: {x: 190, y: 1646},
    next: {x: 558, y: 1635},
    tsums: {x: 900, y: 1653}
  },
  StartPage2: {
    name: 'StartPage',
    colors: [
      {x: 820,  y: 515, r: 245, g: 250, b: 244, match: true, threshold: 80},
      {x: 954,  y: 1426, r: 31 , g: 190, b: 220, match: true, threshold: 80},
      {x: 180,  y: 1584, r: 235, g: 182, b: 8  , match: true, threshold: 80},
      {x: 540,  y: 1584, r: 238, g: 115, b: 133, match: true, threshold: 80},
      {x: 1011, y: 1675, r: 229, g: 166, b: 11 , match: true, threshold: 100}
    ],
    back: {x: 190, y: 1646},
    next: {x: 558, y: 1635}
  },
  StartPage3: {
    name: 'StartPage',
    colors: [
      {x: 400,  y: 1672, r: 245, g: 85, b: 115, match: true, threshold: 80},
      {x: 680,  y: 1672, r: 245, g: 85, b: 115, match: true, threshold: 80},
      {x: 540,  y: 1722, r: 235, g: 70, b: 90 , match: true, threshold: 80}
    ],
    back: {x: 190, y: 1646},
    next: {x: 558, y: 1635}
  },
  TsumsPage: {
    name: 'TsumsPage',
    colors: [
      {x: 27, y: 901, r: 198, g: 239, b: 247, match: true, threshold: 80},    // left of "Tsum Tsum Collection" title bar
      {x: 577, y: 906, r: 255, g: 251, b: 255, match: true, threshold: 80},   // middle of "Tsum Tsum Collection" title bar
      {x: 741, y: 899, r: 132, g: 190, b: 214, match: true, threshold: 80},   // right of "Tsum Tsum Collection" title bar (short before "Level Lock")
      {x: 1012, y: 899, r: 247, g: 186, b: 16, match: true, threshold: 80}    // yellow "order" button

    ],
    lockIcons: [
      {x: 196, y: 1195, r: 236, g: 245, b: 254},
      {x: 430, y: 1195, r: 234, g: 244, b: 253},
      {x: 665, y: 1195, r: 237, g: 246, b: 253},
      {x: 900, y: 1195, r: 236, g: 246, b: 254},
      {x: 196, y: 1450, r: 236, g: 245, b: 254},
      {x: 430, y: 1450, r: 235, g: 244, b: 253},
      {x: 665, y: 1450, r: 237, g: 246, b: 254},
      {x: 900, y: 1450, r: 236, g: 246, b: 254}
    ],
    back: {x: 176, y: 1592},
    next: {x: 176, y: 1592},
    store: {x: 910, y: 1592}
  },
  TsumTsum2025StorePage: {
    name: 'TsumTsumStorePage',
    colors: [
      {x: 30, y: 910, r: 16, g: 53, b: 93, match: true, threshold: 30},
      {x: 60, y: 910, r: 233, g: 171, b: 8, match: true, threshold: 30},
      {x: 520, y: 910, r: 237, g: 174, b: 8, match: true, threshold: 30},
      {x: 545, y: 840, r: 22, g: 65, b: 107, match: true, threshold: 30},
      {x: 570, y: 910, r: 29, g: 85, b: 159, match: true, threshold: 30},
      {x: 10, y: 955, r: 37, g: 71, b: 115, match: true, threshold: 30},
      {x: 170, y: 1490, r: 48, g: 81, b: 130, match: true, threshold: 30},
      {x: 170, y: 1515, r: 8, g: 164, b: 213, match: true, threshold: 30},
      {x: 170, y: 1570, r: 247, g: 194, b: 16, match: true, threshold: 30}
    ],
    back: {x: 190, y: 1650},
    next: {x: 1000, y: 690, r: 238, g: 172, b: 8}
  },
  ConfirmPurchaseBoxPage: {
    name: 'ConfirmPurchasePage',
    colors: [
      {x: 208, y: 1070, r: 247, g: 176, b: 8, match: true, threshold: 30},  // left of Cancel button
      {x: 420, y: 1070, r: 247, g: 176, b: 8, match: true, threshold: 30},  // right of Cancel button
      {x: 540, y: 1070, r: 54, g: 93, b: 146, match: true, threshold: 30},  // between buttons
      {x: 650, y: 1070, r: 247, g: 176, b: 8, match: true, threshold: 30},  // left of OK button
      {x: 880, y: 1070, r: 247, g: 176, b: 8, match: true, threshold: 30},  // right of OK button
      {x: 948, y: 1066, r: 33, g: 69, b: 107, match: true, threshold: 30},  // right next to OK button
      {x: 805, y: 1265, r: 239, g: 167, b: 8, match: true, threshold: 50}   // left of List button
    ],
    back: {x: 310, y: 1070},  // Cancel button
    next: {x: 760, y: 1070}   // OK button
  },
  Confirm2025PurchaseBoxPage: {
    name: 'ConfirmPurchasePage',
    colors: [
      {x: 208, y: 1070, r: 247, g: 186, b:   8, match: true, threshold: 30},  // left of Cancel button
      {x: 420, y: 1070, r: 247, g: 184, b:   8, match: true, threshold: 30},  // right of Cancel button
      {x: 540, y: 1070, r:  54, g:  90, b: 141, match: true, threshold: 30},  // between buttons
      {x: 650, y: 1070, r: 247, g: 190, b:   8, match: true, threshold: 30},  // left of OK button
      {x: 880, y: 1070, r: 247, g: 191, b:  14, match: true, threshold: 30},  // right of OK button
      {x: 948, y: 1066, r:  40, g:  70, b: 113, match: true, threshold: 30},  // right next to OK button
      {x: 785, y: 1320, r: 238, g: 171, b:   8, match: true, threshold: 50}   // left of List button
    ],
    back: {x: 310, y: 1070},  // Cancel button
    next: {x: 760, y: 1070}   // OK button
  },
  ConfirmPurchaseCapsulePage: {
    name: 'ConfirmPurchasePage',
    colors: [
      {x: 200, y: 1444, r: 247, g: 178, b: 8, match: true, threshold: 30},  // left of Cancel button
      {x: 426, y: 1444, r: 247, g: 178, b: 8, match: true, threshold: 30},  // right of Cancel button
      {x: 540, y: 1444, r: 54, g: 93, b: 146, match: true, threshold: 30},  // between buttons
      {x: 660, y: 1444, r: 247, g: 174, b: 8, match: true, threshold: 30},  // left of OK button
      {x: 860, y: 1444, r: 247, g: 178, b: 8, match: true, threshold: 30},  // right of OK button
      {x: 940, y: 1444, r: 33, g: 65, b: 107, match: true, threshold: 30},  // right next to OK button
      {x: 416, y: 790, r: 239, g: 28, b: 49, match: true, threshold: 30}    // red top of big pickup capsule image
    ],
    back: {x: 320, y: 1444},  // Cancel button
    next: {x: 766, y: 1444}   // OK button
  },
  Confirm2025PurchaseCapsulePage: {
    name: 'ConfirmPurchasePage',
    colors: [
      {x: 200, y: 1464, r: 247, g: 178, b: 8, match: true, threshold: 30},      // left of Cancel button
      {x: 426, y: 1464, r: 247, g: 178, b: 8, match: true, threshold: 30},      // right of Cancel button
      {x: 540, y: 1464, r: 54, g: 93, b: 146, match: true, threshold: 30},      // between buttons
      {x: 660, y: 1464, r: 247, g: 174, b: 8, match: true, threshold: 30},      // left of OK button
      {x: 860, y: 1464, r: 247, g: 178, b: 8, match: true, threshold: 30},      // right of OK button
      {x: 940, y: 1464, r: 33, g: 65, b: 107, match: true, threshold: 30},      // right next to OK button
      {x: 836, y: 1152, r: 255, g: 255, b: 255, match: true, threshold: 30},    // lower left of slash in "15/15"
      {x: 860, y: 1081, r: 255, g: 255, b: 255, match: true, threshold: 30},    // upper right of slash in "15/15"
      {x: 860, y: 1152, r: 48, g: 81, b: 127, match: true, threshold: 30}       // blue area under slash in "15/15"
    ],
    back: {x: 320, y: 1464},  // Cancel button
    next: {x: 766, y: 1464}   // OK button
  },
  TapOpenPageBox: {
    name: 'TapOpenPage',
    colors: [
      {x: 641, y: 328, r: 255, g: 255, b: 231, match: true, threshold: 30},
      {x: 641, y: 243, r: 255, g: 255, b: 247, match: true, threshold: 30},
      {x: 180, y: 520, r: 247, g: 182, b: 189, match: true, threshold: 30},
      {x: 899, y: 777, r: 140, g: 121, b: 156, match: true, threshold: 30},
      {x: 68, y: 1265, r: 33, g: 73, b: 107, match: true, threshold: 30},
      {x: 964, y: 1265, r: 33, g: 73, b: 115, match: true, threshold: 30},
      {x: 534, y: 1840, r: 33, g: 190, b: 231, match: true, threshold: 30}
    ],
    back: {x: 500, y: 1600},
    next: {x: 500, y: 1600}
  },
  TapOpenPageCapsule: {
    name: 'TapOpenPage',
    colors: [
      {x: 70, y: 560, r: 24, g: 85, b: 132, match: true, threshold: 30},
      {x: 899, y: 777, r: 137, g: 117, b: 148, match: true, threshold: 30},
      {x: 68, y: 1265, r: 33, g: 73, b: 107, match: true, threshold: 30},
      {x: 964, y: 1265, r: 33, g: 73, b: 115, match: true, threshold: 30},
      {x: 405, y: 1397, r: 255, g: 255, b: 255, match: true, threshold: 30}, // T from "TAP!"
      {x: 546, y: 1429, r: 255, g: 255, b: 255, match: true, threshold: 30}, // A from "TAP!"
      {x: 664, y: 1407, r: 255, g: 255, b: 255, match: true, threshold: 30}, // P from "TAP!"
      {x: 709, y: 1381, r: 255, g: 255, b: 255, match: true, threshold: 30} // ! from "TAP!"
    ],
    back: {x: 500, y: 1600},
    next: {x: 500, y: 1600}
  },
  TapOpenPageCapsuleDeprecated: {
    name: 'TapOpenPageDeprecated',
    colors: [
      {x: 620, y: 328, r: 205, g: 13, b: 34, match: true, threshold: 30},
      {x: 641, y: 243, r: 146, g: 0, b: 0, match: true, threshold: 30},
      {x: 70, y: 560, r: 24, g: 85, b: 132, match: true, threshold: 30},
      {x: 899, y: 777, r: 137, g: 117, b: 148, match: true, threshold: 30},
      {x: 68, y: 1265, r: 33, g: 73, b: 107, match: true, threshold: 30},
      {x: 964, y: 1265, r: 33, g: 73, b: 115, match: true, threshold: 30},
      {x: 534, y: 1840, r: 33, g: 190, b: 231, match: true, threshold: 30}
    ],
    back: {x: 500, y: 1600},
    next: {x: 500, y: 1600}
  },
  BoxPurchasedPage: {
    name: 'BoxPurchasedPage',
    colors: [
      {x: 156, y: 1077, r: 33, g: 195, b: 231, match: true, threshold: 30},
      {x: 48, y: 998, r: 24, g: 52, b: 82, match: true, threshold: 30},
      {x: 131, y: 1134, r: 33, g: 65, b: 107, match: true, threshold: 30},
      {x: 928, y: 1077, r: 33, g: 203, b: 239, match: true, threshold: 30},
      {x: 923, y: 1183, r: 33, g: 65, b: 107, match: true, threshold: 30},
      {x: 904, y: 1396, r: 33, g: 199, b: 239, match: true, threshold: 30},
      {x: 389, y: 1634, r: 247, g: 174, b: 8, match: true, threshold: 30},
      {x: 279, y: 1627, r: 41, g: 77, b: 115, match: true, threshold: 30},
      {x: 525, y: 1823, r: 24, g: 158, b: 189, match: true, threshold: 30}
    ],
    back: {x: 550, y: 1630},  // Close button
    next: {x: 550, y: 1630}   // Close button
  },
  PremiumPlusBoxPurchasedPage: {
    name: 'BoxPurchasedPage',
    colors: [
      {x: 156, y: 1077, r: 33, g: 195, b: 231, match: true, threshold: 30},
      {x: 48, y: 998, r: 33, g: 66, b: 99, match: true, threshold: 30},
      {x: 131, y: 1137, r: 33, g: 62, b: 101, match: true, threshold: 30},
      {x: 928, y: 1075, r: 33, g: 203, b: 236, match: true, threshold: 30},
      {x: 922, y: 1184, r: 33, g: 65, b: 107, match: true, threshold: 30},
      {x: 904, y: 1396, r: 33, g: 199, b: 239, match: true, threshold: 30},
      {x: 389, y: 1634, r: 238, g: 174, b: 8, match: true, threshold: 30},
      {x: 280, y: 1626, r: 63, g: 103, b: 147, match: true, threshold: 30},
      {x: 525, y: 1823, r: 40, g: 210, b: 247, match: true, threshold: 30}
    ],
    back: {x: 550, y: 1630},  // Close button
    next: {x: 550, y: 1630}   // Close button
  },
  GamePause: {
    name: 'GamePause',
    colors: [
      {x: 165, y: 1077, r: 234, g: 173, b:   7, match: true, threshold: 80},
      {x: 586, y: 1080, r: 239, g: 174, b:   7, match: true, threshold: 80},
      {x: 367, y:  774, r:  24, g: 191, b: 225, match: true, threshold: 80},
      {x: 738, y:  612, r: 248, g: 244, b: 245, match: true, threshold: 80},
      {x: 550, y: 1336, r: 247, g: 185, b:   8, match: true, threshold: 80}
    ],
    back: {x: 331, y: 1080},
    next: {x: 561, y: 1422}
  },
  GamePlaying480x800: {
    name: 'GamePlaying',
    colors: [
      {x: 916, y: 198, r: 253, g: 216, b: 0, match: true, threshold: 80}, // above pause
      {x: 916, y: 318, r: 241, g: 161, b: 8, match: true, threshold: 80}, // below pause
      {x: 916, y: 1688, r: 242, g: 161, b: 8, match: true, threshold: 80} // below fan
    ],
    back: {x: 986, y: 273},
    next: {x: 986, y: 273}
  },
  GamePlayingLastSeconds: {
    name: 'GamePlaying',
    colors: [
      {x: 916, y: 198, r: 181, g: 207, b: 74, match: true, threshold: 80}, // above pause
      {x: 916, y: 318, r: 190, g: 174, b: 57, match: true, threshold: 80}, // below pause
      {x: 916, y: 1688, r: 181, g: 178, b: 74, match: true, threshold: 80} // below fan
    ],
    back: {x: 986, y: 273},
    next: {x: 986, y: 273}
  },
  GamePlaying: {
    name: 'GamePlaying',
    colors: [
      {x: 916, y: 198, r: 230, g: 200, b: 20, match: true, threshold: 80}, // above pause
      {x: 916, y: 318, r: 214, g: 191, b: 28, match: true, threshold: 80}, // below pause
      {x: 916, y: 1688, r: 214, g: 191, b: 28, match: true, threshold: 80} // below fan
    ],
    back: {x: 986, y: 273},
    next: {x: 986, y: 273}
  },
  GamePlaying2: {
    name: 'GamePlaying',
    colors: [
      {x: 980, y: 258, r: 190, g: 244, b: 70, match: true, threshold: 80}, // right of pause
      {x: 852, y: 258, r: 244, g: 197, b: 20, match: true, threshold: 80}, // left of pause
      {x: 916, y: 1688, r: 230, g: 150, b: 25, match: true, threshold: 80} // below fan
    ],
    back: {x: 986, y: 273},
    next: {x: 986, y: 273}
  },
  RootDetectionLdp1080p480dpiEn: {
    name: 'RootDetectionLdp1080p480dpiEn',
    colors: [
      {x: 80, y: 690, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 70, y: 680,  r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 1000, y: 1300, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 1010, y: 1310, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 855, y: 1224},
    next: {x: 855, y: 1224},
    onDetect: switchToStartupMode
  },
  RootDetectionLdp1080p480dpiJp: {
    name: 'RootDetectionLdp1080p480dpiJp',
    colors: [
      {x: 80, y: 635, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 70, y: 625, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 1000, y: 1360, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 1010, y: 1370, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 850, y: 1280},
    next: {x: 850, y: 1280},
    onDetect: switchToStartupMode
  },
  RootDetectionLdp480x800x160dpiEn: {
    name: 'RootDetectionLdp480x800x160dpiEn',
    colors: [
      {x: 90, y: 780, r: 253 , g: 253, b: 253, match: true, threshold: 25},
      {x: 65, y: 745, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 990, y: 1190, r: 252 , g: 252, b: 252, match: true, threshold: 25},
      {x: 1015, y: 1225, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 885, y: 1135},
    next: {x: 885, y: 1135},
    onDetect: switchToStartupMode
  },
  RootDetectionNox1080p360dpiEn: {
    name: 'RootDetectionNox1080p360dpiEn',
    colors: [
      {x: 135, y: 795, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 125, y: 785, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 945, y: 1170, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 955, y: 1180, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 850, y: 1115},
    next: {x: 850, y: 1115},
    onDetect: switchToStartupMode
  },
  RootDetectionNox480x800x160dpiJp: {
    name: 'RootDetectionNox480x800x160dpiJp',
    colors: [
      {x: 85, y: 735, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 75, y: 725, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 995, y: 1240, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 1005, y: 1250, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 885, y: 1170},
    next: {x: 885, y: 1170},
    onDetect: switchToStartupMode
  },
  RootDetectionNox480x800x160dpiEn: {
    name: 'RootDetectionNox480x800x160dpiEn',
    colors: [
      {x: 85, y: 760, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 75, y: 750, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 995, y: 1215, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 1005, y: 1225, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 885, y: 1150},
    next: {x: 885, y: 1150},
    onDetect: switchToStartupMode
  },
  RootDetectionSamsungA20En: {
    name: 'RootDetectionSamsungA20En',
    colors: [
      {x: 60, y: 440, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 50, y: 440, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 60, y: 430, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 1020, y: 1310, r: 255 , g: 255, b: 255, match: true, threshold: 25},
      {x: 1020, y: 1320, r: 255 , g: 255, b: 255, match: false, threshold: 25},
      {x: 1010, y: 1325, r: 255 , g: 255, b: 255, match: false, threshold: 25}
    ],
    back: {x: 850, y: 1230},
    next: {x: 850, y: 1230},
    onDetect: switchToStartupMode
  },
  MagicalTime: {
    name: 'MagicalTime',
    colors: [
      {x: 817, y: 507, r: 244, g: 249, b: 243, match: true, threshold:  80},
      {x: 594, y: 857, r: 248, g: 102, b: 121, match: true, threshold: 100},
      {x: 208, y: 1217, r: 236, g: 175, b:   9, match: true, threshold:  80},
      {x: 662, y: 1213, r: 232, g: 171, b:   5, match: true, threshold:  80}
    ],
    back: {x: 381, y: 1221},
    next: {x: 856, y: 1221}
  },
  OutOfMedals: {
    name: 'OutOfMedals',
    colors: [
      {x: 127, y:  873, r:  74, g:  74, b:  74, match: true, threshold: 80},  // mickey left-side ear
      {x: 186, y:  898, r: 255, g: 213, b: 188, match: true, threshold: 80},  // mickey face
      {x: 865, y:  879, r: 247, g: 251, b: 255, match: true, threshold: 80},  // donald face
      {x: 474, y: 1065, r: 238, g: 174, b:   8, match: true, threshold: 80},  // left button
      {x: 540, y: 1070, r:  56, g:  91, b: 140, match: true, threshold: 80},  // blue between both buttons
      {x: 595, y: 1066, r: 238, g: 171, b:   8, match: true, threshold: 80}   // right button
    ],
    back: {x: 300, y: 1080},
    next: {x: 300, y: 1080}
  },
  NetworkDisable: {
    name: 'NetworkDisable',
    colors: [
      {x: 478, y: 1080, r: 236, g:  94, b: 116, match: true, threshold: 80},
      {x: 932, y: 1077, r: 232, g: 171, b:   5, match: true, threshold: 80}
    ],
    back: {x: 885, y: 1080},
    next: {x: 885, y: 1084}
  },
  NetworkTimeout: {
    name: 'NetworkTimeout',
    colors: [
      {x: 530, y: 590, r: 33, g: 197, b: 234, match: true, threshold: 80},
      {x: 530, y: 620, r: 59, g: 94, b: 148, match: true, threshold: 80},
      {x: 478, y: 1080, r: 232, g: 171, b: 5, match: true, threshold: 80},
      {x: 932, y: 1077, r: 232, g: 171, b: 5, match: true, threshold: 80},
      {x: 530, y: 1150, r: 59, g: 94, b: 148, match: true, threshold: 80},
      {x: 530, y: 1170, r: 33, g: 197, b: 234, match: true, threshold: 80}
    ],
    back: {x: 885, y: 1084},
    next: {x: 885, y: 1084}
  },
  FriendInfo: { // FriendInfo of Friend Page, SocailAccount of Setting Page
    name: 'FriendInfo',
    colors: [
      {x: 565, y: 576, r:  31, g: 190, b: 220, match: true, threshold: 80},
      {x: 547, y: 1195, r:  27, g: 192, b: 222, match: true, threshold: 80},
      {x: 554, y: 1332, r: 238, g: 186, b:  12, match: true, threshold: 80}
    ],
    back: {x: 576, y: 1408},
    next: {x: 576, y: 1408}
  },
  LevelUp: { // LevelUp and RankUp
    name: 'LevelUp',
    colors: [
      {x: 140, y: 1656, r: 233, g: 175, b: 6, match: true, threshold: 80}, // left of the close button
      {x: 450, y: 1656, r: 233, g: 175, b: 6, match: true, threshold: 80}, // right of the close button
      {x: 620, y: 1656, r: 233, g: 175, b: 6, match: true, threshold: 80}, // left of the share button
      {x: 930, y: 1656, r: 233, g: 175, b: 6, match: true, threshold: 80} // right of the share button
    ],
    back: {x: 300, y: 1660},
    next: {x: 300, y: 1660}
  },
  HighScore: {
    name: 'HighScore',
    colors: [
      {x: 576, y: 1325, r: 238, g: 187, b:  10, match: true, threshold: 80}, // top yellow of close button
      {x: 576, y: 1082, r:  33, g: 194, b: 231, match: true, threshold: 80}, // bottom light blue of highscore cell
      {x: 576, y:  762, r:  33, g: 194, b: 231, match: true, threshold: 80}, // top light blue of highscore cell
      {x: 576, y:  820, r:  64, g: 109, b: 171, match: true, threshold: 80}  // inner dark blue of highscore cell
    ],
    back: {x: 576, y: 1325},
    next: {x: 576, y: 1325}
  },
  ClosePage: { // including EventPage, MyInfo, SettingPage, others
    name: 'ClosePage', // the close button at center bottom
    colors: [
      {x: 540, y: 1588, r: 233, g: 180, b: 10, match: true, threshold: 80} // top right of the close button
    ],
    back: {x: 576, y: 1660},
    next: {x: 576, y: 1660}
  },
  // *** Following commented out because detection is way too unspecific and I don't know what it should detect.
  // InvitePage: {
  //   name: 'InvitePage', // the close button at left bottom
  //   colors: [
  //     {x: 180, y: 1592, r: 238, g: 180, b: 11, match: true, threshold: 80}
  //   ],
  //   back: {x: 176, y: 1592},
  //   next: {x: 176, y: 1592}
  // },
  ReceiveSkillTicket: {
    name: 'ReceiveSkillTicket',
    colors: [
      {x: 405, y: 806, r: 240, g: 155, b: 20, match: true, threshold: 80},
      {x: 488, y: 839, r: 244, g: 164, b: 23, match: true, threshold: 80},
      {x: 502, y: 821, r: 255, g: 255, b: 255, match: true, threshold: 40},
      {x: 390, y: 824, r: 58, g: 92, b: 142, match: true, threshold: 80},
      {x: 522, y: 812, r: 60, g: 95, b: 147, match: true, threshold: 80},
      {x: 874, y: 1098, r: 238, g: 174, b: 8, match: true, threshold: 80},
      {x: 198, y: 1095, r: 239, g: 174, b: 8, match: true, threshold: 80},
      {x: 160, y: 1545, r: 0, g: 4, b: 8, match: true, threshold: 80},
      {x: 526, y: 553, r: 33, g: 195, b: 231, match: true, threshold: 80}
    ],
    back: {x: 198, y: 1095},
    next: {x: 874, y: 1098}
  },
  ReceivePremiumTicket: {
    name: 'ReceivePremiumTicket',
    colors: [
      {x: 405, y: 806, r: 216, g: 20, b: 25, match: true, threshold: 80},
      {x: 488, y: 839, r: 208, g: 20, b: 23, match: true, threshold: 80},
      {x: 502, y: 821, r: 255, g: 247, b: 181, match: true, threshold: 40},
      {x: 390, y: 824, r: 58, g: 92, b: 142, match: true, threshold: 80},
      {x: 522, y: 812, r: 60, g: 95, b: 147, match: true, threshold: 80},
      {x: 874, y: 1098, r: 238, g: 174, b: 8, match: true, threshold: 80},
      {x: 198, y: 1095, r: 239, g: 174, b: 8, match: true, threshold: 80},
      {x: 160, y: 1545, r: 0, g: 4, b: 8, match: true, threshold: 80},
      {x: 526, y: 553, r: 33, g: 195, b: 231, match: true, threshold: 80}
    ],
    back: {x: 198, y: 1095},
    next: {x: 874, y: 1098}
  },
  ReceiveHeartWithoutCoins: {
    name: 'ReceiveHeartWithoutCoins',
    colors: [
      {x: 360, y: 570, r: 33, g: 198, b: 233, match: true, threshold: 30},
      {x: 400, y: 620, r: 61, g: 94, b: 147, match: true, threshold: 30},
      {x: 460, y: 820, r: 222, g: 61, b: 148, match: true, threshold: 30},
      {x: 420, y: 1100, r: 238, g: 174, b: 8, match: true, threshold: 30},
      {x: 860, y: 1100, r: 238, g: 174, b: 8, match: true, threshold: 30},
      {x: 540, y: 1100, r: 58, g: 94, b: 146, match: true, threshold: 30},
      {x: 550, y: 1600, r: 49, g: 36, b: 0, match: true, threshold: 30}
    ],
    back: {x: 420, y: 1100},
    next: {x: 860, y: 1100}
  },
  ExtraUpdateJp: {
    name: 'ExtraUpdate',
    colors: [
      {x: 104, y:  556, r:  36, g: 204, b: 239, match: true, threshold: 80},  // light blue top left
      {x: 104, y: 1194, r:  36, g: 204, b: 239, match: true, threshold: 80},  // light blue bottom left
      {x: 700, y: 1100, r: 238, g: 174, b:   8, match: true, threshold: 80},  // OK button
      {x: 200, y: 1100, r: 238, g: 174, b:   8, match: true, threshold: 80},  // Cancel button
      {x: 644, y:  676, r: 248, g: 248, b: 248, match: true, threshold: 80},  // Left of big white "o" letter
      {x: 694, y:  676, r: 248, g: 248, b: 248, match: true, threshold: 80},  // Right of big white "o" letter
      {x: 668, y:  676, r:  58, g:  93, b: 148, match: true, threshold: 80},  // Middle of big white "o" letter
      {x: 422, y:  998, r:  48, g:  93, b: 148, match: true, threshold: 80},  // Middle of small white "o" letter
      {x: 406, y:  998, r: 248, g: 248, b: 248, match: true, threshold: 80},  // Left of small white "o" letter
      {x: 434, y:  998, r: 248, g: 248, b: 248, match: true, threshold: 80}   // Right of small white "o" letter
    ],
    back: {x: 770, y: 1100},
    next: {x: 770, y: 1100}
  },
  ExtraUpdateEn: {
    name: 'ExtraUpdate',
    colors: [
      {x: 104, y:  556, r:  36, g: 204, b: 239, match: true, threshold: 80},  // light blue top left
      {x: 104, y: 1194, r:  36, g: 204, b: 239, match: true, threshold: 80},  // light blue bottom left
      {x: 700, y: 1100, r: 238, g: 174, b:   8, match: true, threshold: 80},  // OK button
      {x: 200, y: 1100, r: 238, g: 174, b:   8, match: true, threshold: 80},  // Cancel button
      {x: 520, y:  680, r: 248, g: 248, b: 248, match: true, threshold: 80},  // Left of big white "o" letter
      {x: 558, y:  680, r: 248, g: 248, b: 248, match: true, threshold: 80},  // Right of big white "o" letter
      {x: 538, y:  680, r:  55, g:  94, b: 148, match: true, threshold: 80},  // Middle of big white "o" letter
      {x: 674, y: 1002, r:  60, g: 100, b: 150, match: true, threshold: 80},  // Middle of small white "o" letter
      {x: 662, y: 1002, r: 240, g: 240, b: 240, match: true, threshold: 80},  // Left of small white "o" letter
      {x: 686, y: 1002, r: 240, g: 240, b: 240, match: true, threshold: 80}   // Right of small white "o" letter
    ],
    back: {x: 770, y: 1100},
    next: {x: 770, y: 1100}
  },
  RubyResetDifficulty: {
    name: 'RubyResetDifficulty',
    colors: [
      {x: 594, y:  972, r: 247, g:  81, b:  82, match: true, threshold: 80},  // red arrow between numbers
      {x: 610, y: 1166, r: 189, g:   0, b:  41, match: true, threshold: 80},  // ruby next to "10"
      {x: 588, y: 1096, r:  25, g: 174, b: 214, match: true, threshold: 80},  // light blue next to above ruby
      {x: 867, y: 1270, r: 238, g: 174, b:   8, match: true, threshold: 80},  // OK button
      {x: 425, y: 1275, r: 238, g: 174, b:   8, match: true, threshold: 80}   // Cancel button
    ],
    back: {x: 425, y: 1275},
    next: {x: 867, y: 1270}
  }
};

// page callbacks (this = actual Tsum instance)
function switchToStartupMode() {
  this.isStartupPhase = true;
}


// predefined log messages
var Logs = {
  start: '[TsumTsum] Start',
  stop: '[TsumTsum] Stop',
  sendMessage: 'Send Message...',
  TaskControllerStop: 'TaskController Stop',
  updateApp: 'Please update Robotmon and restart service',
  UnknownState: 'Unknown state, Exiting',
  totalTsums: 'Total Tsums',
  removeSameTsums: 'Remove same Tsums',
  recognizedTsums: 'Recognized Tsums',
  recognizingTsums: 'Recognizing Tsums',
  recognitionStart: 'Start Tsums recognition',
  recognitionTime: 'Time consumed',
  myTsum: 'myTsum',
  clearBubbles: 'Clear bubbles',
  bubbleGenerated: 'Bubble generated',
  calculationPathStart: 'Start path calculation ',
  calculatedPath: 'Calculated path',
  recalculatingPath: 'Connections 0, Recalculating path',
  useSkill: 'Use skill',
  tiaraNoDream: '[Tiara] No thought bubble appeared',
  tiaraBusy: '[Tiara] Board still moving, firing anyway; diff',
  tiaraDream: '[Tiara] Bubble shows',
  tiaraPicked: '[Tiara] Tapped',
  tiaraUnsure: '[Tiara] No present matched confidently, stopping',
  gameStart: 'Game Start',
  gaming: 'Gaming (Slow version)',
  fastGaming: 'Gaming (Fast version)',
  gameOver: 'Game Over',
  confirmingGameOver: 'Screen not recognized, confirming game over (skill animation?)',
  detectScreen: 'Detecting screen (top and bosttom)',
  calculateScreenSize: 'Calculating screen size',
  offset: 'Offset (X, Y, H, W)',
  startTsumTsumApp: 'Start TsumTsum app',
  currentPage: 'Pg:',
  friendsPage: 'Friends page',
  checkBonusItems: 'Check bonus items',
  receiveAllGifts: 'Receive all gifts',
  receiveGiftsOneByOne: 'Receive gift one by one',
  receiveGiftAgain: 'Receive gift again',
  allGiftsReceived: 'All gifts received',
  receivingGiftsCompleted: 'Receiving gifts completed',
  checkUnreceivedGift: 'Check unreceived gift',
  readRecords: 'Reading records',
  saveRecords: 'Saving records',
  recognizingHeartSender: 'Recognizing heart sender',
  calculatingHeartSender: 'Calculating heart sender',
  receiveHeartFromHeartSender: 'Receive',
  recognitionScore: 'Recognition score',
  saveNewFriend: 'Save new friend',
  saveNewFriendAgain: 'Save new friend again',
  hearts: 'hearts from heart sender today',
  startSendingHearts: 'Start sending hearts',
  checkSendingHearts: 'Check sending hearts',
  sendingHearts: 'Sending',
  sendingZeroScore: 'hearts',
  timeIsUp: 'Time\'s up',
  tsumsPage: 'Tsum collection page',
  startUnlockLevel: 'Check for level locked Tsums',
  endUnlockLevel: 'Finished unlocking Tsum levels'
}

var LogsTW = {
  start: '[TsumTsum] 啟動',
  stop: '[TsumTsum] 停止',
  sendMessage: '送出訊息中...',
  TaskControllerStop: 'TaskController 停止',
  updateApp: '請更新 Robotmon 並重新啟動 Service',
  UnknownState: '未知狀態，離開',
  totalTsums: 'Tsums 總數',
  removeSameTsums: '移除相同 Tsums 後總數',
  recognizedTsums: '成功辨識 Tsums',
  recognizingTsums: '辨識 Tsums 中',
  recognitionStart: '開始辨識 Tsums',
  recognitionTime: '耗時',
  myTsum: '我的Tsum',
  clearBubbles: '清除泡泡',
  bubbleGenerated: '產生泡泡',
  calculationPathStart: '開始計算路徑',
  calculatedPath: '成功計算路徑',
  recalculatingPath: '路徑數量為 0, 重新辨識',
  useSkill: '使用技能',
  tiaraNoDream: '[皇冠米妮] 沒有出現想像泡泡',
  tiaraBusy: '[皇冠米妮] 畫面仍在變動，仍然發動；差異',
  tiaraDream: '[皇冠米妮] 泡泡顯示',
  tiaraPicked: '[皇冠米妮] 點擊',
  tiaraUnsure: '[皇冠米妮] 沒有禮物符合，停止',
  gameStart: '遊戲開始',
  gaming: '遊戲中 (慢速版)',
  fastGaming: '遊戲中 (快速版)',
  gameOver: '遊戲結束',
  confirmingGameOver: '無法辨識畫面，確認遊戲是否結束（技能動畫中？）',
  detectScreen: '偵測畫面 (頂部與底部)',
  calculateScreenSize: '計算螢幕大小',
  offset: '位移 (X, Y, H, W)',
  startTsumTsumApp: '啟動 TsumTsum 應用程式',
  currentPage: '目前頁面',
  friendsPage: '朋友頁面',
  checkBonusItems: '檢查道具',
  receiveAllGifts: '接收所有禮物',
  receiveGiftsOneByOne: '一個一個接收禮物',
  receiveGiftAgain: '再嘗試接收禮物一次',
  allGiftsReceived: '已接收所有禮物',
  receivingGiftsCompleted: '完成接收禮物',
  checkUnreceivedGift: '檢查未接收的禮物',
  readRecords: '讀取紀錄',
  saveRecords: '儲存紀錄',
  recognizingHeartSender: '辨識送心者',
  calculatingHeartSender: '計算送心者',
  receiveHeartFromHeartSender: '今天送心者已送出',
  recognitionScore: '辨識分數',
  saveNewFriend: '儲存新朋友',
  saveNewFriendAgain: '重新儲存新朋友',
  hearts: '顆愛心',
  startSendingHearts: '開始送愛心',
  checkSendingHearts: '檢查送愛心',
  sendingHearts: '已送出',
  sendingZeroScore: '顆愛心',
  timeIsUp: '送心時間結束',
  tsumsPage: 'Tsum收集页面',
  startUnlockLevel: '检查等级锁定的Tsum',
  endUnlockLevel: '已完成解锁 Tsum 关卡'
}

// Utils for sending message
var _userPlan = -1;
var _lastSendingTime = 0;

function checkFunction(f) {
  return typeof(f) == 'function'
}
function checkCanSendMessage() {
  _userPlan = -1;
  if (getUserPlan !== undefined && checkFunction(sendNormalMessage)) {
    _userPlan = getUserPlan();
  }
  console.log('User Plan', _userPlan);
}
function canSendMessage() {
  if (_userPlan === -1) {
    return false;
  }
  var during = Date.now() - _lastSendingTime;
  return _userPlan >= 0 && during > 60 * 60 * 1000;
}
function sendMessage(topMsg, msg) {
  if (canSendMessage()) {
    _lastSendingTime = Date.now();
    console.log(sendNormalMessage(topMsg, msg));
  }
}
checkCanSendMessage();

// Utils for Tsum

function usingTimeString(startTime) {
  return Date.now() - startTime;
}


function getDistance(t1, t2) {
  var dx = t1.x - t2.x;
  var dy = t1.y - t2.y;
  return dx * dx + dy * dy;
}

function findNearTsum(tsum, tsums) {
  var minDis = Infinity;
  var minTsum = null;
  var idx = -1;

  if (!tsum || !Array.isArray(tsums) || tsums.length === 0) {
    return { dis: Infinity, tsum: null, idx: -1 };
  }

  for (var i = 0; i < tsums.length; i++) {
    var candidate = tsums[i];

    // Skip self-comparison (by reference or unique identifier/position)
    if (candidate === tsum || (candidate.x === tsum.x && candidate.y === tsum.y)) {
      continue;
    }

    var dis = getDistance(tsum, candidate);
    if (dis < minDis) {
      minDis = dis;
      minTsum = candidate;
      idx = i;
    }
  }

  var finalDistance = minDis === Infinity ? Infinity : Math.sqrt(minDis);
  return { dis: finalDistance, tsum: minTsum, idx: idx };
}

function calculateNearTsumPaths(tsum, ts) {
  var path = [];
  var tsums = ts.slice(); // copy array
  while(true) {
    var result = findNearTsum(tsum, tsums);
    var minDis = result.dis;
    var minTsum = result.tsum;
    var minIdx = result.idx;
    if (minIdx === -1 || minDis > Config.tsumWidth * 2.8) {
      break;
    }
    tsum = minTsum;
    tsums.splice(minIdx, 1);
    path.push(tsum);
  }
  return path;
}

function calculatePathCenter(path) {
  var cx = 0;
  var cy = 0;
  for (var i in path) {
    cx += path[i].x;
    cy += path[i].y;
  }
  return {x: Math.floor(cx / path.length), y: Math.floor(cy / path.length)};
}


function calculatePaths(board, logs) {
  var tsumsGrouped = {};
  var tsumList = Array.isArray(board) ? board : Object.keys(board).map(function(k) { return board[k]; });

  // 1. Group pieces by type (tsumIdx)
  for (var i = 0; i < tsumList.length; i++) {
    var tsum = tsumList[i];
    if (!tsum) continue;
    var idx = tsum.tsumIdx;
    (tsumsGrouped[idx] = tsumsGrouped[idx] || []).push(tsum);
  }

  var paths = [];
  var seenPathKeys = {};

  // 2. Search paths for each group
  for (var tsumIdx in tsumsGrouped) {
    if (!Object.prototype.hasOwnProperty.call(tsumsGrouped, tsumIdx)) continue;
    var group = tsumsGrouped[tsumIdx];

    if (group.length < 3) continue;

    for (var j = 0; j < group.length; j++) {
      var item = group[j];
      var path = calculateNearTsumPaths(item, group);

      if (path && path.length > 2) {
        var pathKey = getCanonicalPathKey(path);

        if (!seenPathKeys[pathKey]) {
          seenPathKeys[pathKey] = true;
          paths.push(path);
        }
      }
    }
  }

  // 3. Sort paths descending by length
  paths.sort(function(a, b) {
    return b.length - a.length;
  });

  if (typeof debug === 'function' && logs && logs.calculatedPath) {
    debug(logs.calculatedPath, paths.length);
  }

  return paths;
}

function getCanonicalPathKey(path) {
  var ids = path.map(function(p) {
    return (p.id !== undefined ? p.id : (p.x + ',' + p.y));
  });

  var forwardKey = ids.join('-');
  var reverseKey = ids.slice().reverse().join('-');

  return forwardKey < reverseKey ? forwardKey : reverseKey;
}

function convertTo2DArray(arr, size) {
  var result = [];
  for (var i = 0; i < arr.length; i = i + size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Game bubbles are circles too, just a good deal bigger than a tsum, so they
// come out of the same grayscale Hough pass at a larger radius. Runs on the
// board capture the scan already holds, so locating them costs no screenshot --
// which is the point: the taps have to land while the chain is still going off.
// (Ported from TsumThi.)
function findGameBubbles(img) {
  var cfg = GameBubbleConfig;
  var tmpImg = clone(img);
  var grayImg = bgrToGray(tmpImg);
  releaseImage(tmpImg);
  smooth(grayImg, 2, 9);
  // houghCircles returns centres, unlike the board points findTsums feeds the
  // pathfinder (those are shifted to a tsum's top-left corner).
  var found = houghCircles(grayImg, 3, 1, cfg.minDist, cfg.param1, cfg.param2,
                           cfg.minRadius, cfg.maxRadius);
  releaseImage(grayImg);
  var out = [];
  for (var k in found) {
    out.push({x: found[k].x, y: found[k].y, r: found[k].r});
  }
  return out;
}

function findTsums(img) {
  //var imgSize = getImageSize(img);
  // Calculate scale factor relative to original base size of 200px
  //var scale = imgSize.width / Config.screenResize;
  var scale =  1 ; // Assuming original base size is 200px
  var hsvImg = clone(img);
  var tmpImg = clone(img);
  var grayImg = bgrToGray(tmpImg);
  releaseImage(tmpImg);
  smooth(grayImg, 2, 9);
  convertColor(hsvImg, 40);

  var dp = 1;                             // Lower dp (1 or 2) gives better resolution accuracy at larger sizes
  var minDist = Math.round(22 * scale);    // Min distance between circle centers
  var param1 = 20;                        // Canny high threshold (remains unchanged)
  var param2 = Math.round(10 * scale);     // Accumulator threshold (scales with circle perimeter size)
  var minRadius = Math.round(8 * scale);  // Scaled minimum circle radius
  var maxRadius = Math.round(14 * scale); // Scaled maximum circle radius

  var points = houghCircles(grayImg,3, dp, minDist, param1, param2, minRadius, maxRadius);
  releaseImage(grayImg);

  if (ts.debug) {
  var debugImg = clone(img);
  for (var k in points) {
    var p = points[k];
    drawCircle(debugImg, p.x, p.y, minRadius, 255, 0, 0, 1);
  }
    saveImage(debugImg, ts.storagePath + "/tmp/" + ts.runTimes + "-detectedHoughCircles.jpg");
    releaseImage(debugImg);
  }

  smooth(hsvImg, 1, 22);
  var results = [];
  for (var k in points) {
    var p = points[k];
    var hsv1, hsv2, hsv3, hsv4, hsv5;
    hsv5 = hsv4 = hsv3 = hsv2 = hsv1 = getImageColor(hsvImg, p.x, p.y);
    if (p.x - 1 >= 0) { hsv2 = getImageColor(hsvImg, p.x - 1, p.y); }
    if (p.x + 1 < Config.screenResize) { hsv3 = getImageColor(hsvImg, p.x + 1, p.y); }
    if (p.y - 1 >= 0) { hsv4 = getImageColor(hsvImg, p.x, p.y - 1); }
    if (p.y + 1 < Config.screenResize) { hsv5 = getImageColor(hsvImg, p.x, p.y + 1); }
    var avgb = (hsv1.b + hsv2.b + hsv3.b + hsv4.b + hsv5.b) / 5;
    var avgg = (hsv1.g + hsv2.g + hsv3.g + hsv4.g + hsv5.g) / 5;
    var avgr = (hsv1.r + hsv2.r + hsv3.r + hsv4.r + hsv5.r) / 5;
    results.push({x: p.x, y: p.y, z: p.r, b: avgb, g: avgg, r: avgr});
  }

  if (ts.debug) {
    saveImage(hsvImg, ts.storagePath + "/tmp/" + ts.runTimes + "-hsvImg.jpg");
  }

  releaseImage(hsvImg);

  return results;
}

function distance3D(p1, p2) {
  var d = Math.sqrt((p1.b-p2.b)*(p1.b-p2.b) + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
  if (Math.abs(p1.b - p2.b) < 20) { d -= 10; }
  if (Math.abs(p1.g - p2.g) < 20) { d -= 10; }
  if (p1.r < 120 && p2.r < 120) { d -= 20; }
  return d;
}


function classifyTsums(points) {

  var  threshold = 15;
  if (!Array.isArray(points) || points.length === 0) {
    return [];
  }

  var clusters = [];

  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var bestCluster = null;
    var minDistance = Infinity;

    // Find the CLOSEST existing cluster within threshold
    for (var j = 0; j < clusters.length; j++) {
      var cluster = clusters[j];
      var d = distance3D(cluster, p);

      if (d < threshold && d < minDistance) {
        minDistance = d;
        bestCluster = cluster;
      }
    }

    if (bestCluster) {
      // Add point to closest cluster & update running average color
      bestCluster.points.push(p);
      var count = bestCluster.points.length;
      bestCluster.sumb += p.b;
      bestCluster.sumg += p.g;
      bestCluster.sumr += p.r;
      bestCluster.b = bestCluster.sumb / count;
      bestCluster.g = bestCluster.sumg / count;
      bestCluster.r = bestCluster.sumr / count;
    } else {
      // Start a new cluster
      clusters.push({
        sumb: p.b,
        sumg: p.g,
        sumr: p.r,
        b: p.b,
        g: p.g,
        r: p.r,
        points: [p]
      });
    }
  }

  return clusters;
}

function detectOffsetYInGame() {
  var img = getScreenshot();
  // var img = openImage('/sdcard/img2.jpg');
  var size = getImageSize(img);
  console.log('deviceW', size.width, 'deviceH', size.height);
  var centerY = Math.floor(size.height / 2);

  // find top black
  var topBlackY = 0;
  for (var y = centerY; y >= 0; y--) {
    var color = getImageColor(img, size.width*0.9, y);
    if (isSameColor({r: 0, g: 0, b: 0}, color, 6)) {
      // black color found
      topBlackY = y;
      break;
    }
  }
  console.log('topBlackY', topBlackY);

  var bottomBlackY = size.height;
  for (y = centerY; y < size.height; y++) {
    color = getImageColor(img, size.width*0.9, y);
    if (isSameColor({r: 0, g: 0, b: 0}, color, 6)) {
      // black color found
      bottomBlackY = y;
      break;
    }
  }
  console.log('bottomBlackY', bottomBlackY);
  console.log('screenHeight', bottomBlackY - topBlackY + 1);
  releaseImage(img);
  return -topBlackY;
}

// Tsum struct

function Tsum(isJP, detect, logs) {
  this.debug = false;
  this.autoLaunch = false;
  this.isRunning = true;
  this.isStartupPhase = true;
  this.runTimes = 0;
  this.myTsum = '';
  this.storagePath = getStoragePath();
  // screen size config
  /** @type {{width: number, height: number}}  */
  var size = getScreenSize();
  this.originScreenWidth = size.width;
  this.originScreenHeight = size.height;
  this.screenHeight = size.height;
  this.screenWidth = size.width;
  this.gameOffsetX = 0;
  this.gameOffsetY = 0;
  this.gameHeight = 0;
  this.gameWidth = 0;
  this.resizeRatio = Math.max(1, this.screenWidth / 360); // normalize page screenshots to 360px width

  this.captureGameRatio = 0;
  // playing game screen size config
  this.playOffsetX = 0;
  this.playOffsetY = 0;
  this.playHeight = 0;
  this.playWidth = 0;

  this.playResizeWidth = Config.screenResize;
  this.playResizeHeight = Config.screenResize;


  this.tsumCount = 5;
  this.isJP = isJP;
  this.logs = logs;
  this.scoreItem = false;
  this.coinItem = false;
  this.expItem = false;
  this.timeItem = false;
  this.bubbleItem = false;
  this.comboItem = false;
  this.isPause = false;
  this.receiveOneItem = false;
  this.sentToZero = false;
  this.recordReceive = true;
  this.skillInterval = 3000;
  this.skillLevel = 3;
  this.skillType = '';
  // Optional safety poll: fire the skill the instant it's ready, even mid-link,
  // rather than only at the end of each board-scan cycle (see maybeAutoTapSkill).
  this.skillAutoTap = false;
  this.skillAutoTapInterval = 500;
  this._lastSkillAutoTap = 0;
  this.unlockLevelHoursWait = 0;
  this.sendHearts = false;
  this.keepRuby = false;
  this.showHeartLog = true;
  this.sendHeartMaxDuring = 0;
  this.useFan = true;
  // Bubble positions from the last board scan, for popGameBubbles.
  this.gameBubbles = [];
  // record
  this.record = {
    hearts_count: {
      receivedCount: 0,
      sentCount: 0
    }
  };
  this.recordImages = {};
  this.receiveCheckLimit = 5;
  this.clearBubbles = true;
  this.autobuyBoxes = 0;
  this.noSkillLastFeverSec = 0;
  this.claimAllWithoutCoins = false;
  this.nextMonitorExecution = 0;
  this.lastVisitedPages = {init1: true, init2: true, init3: true};  // trigger initial monitor call on script startup
  this.handleLongSkillAnimations = false;
  // How long the play loop tolerates an unrecognized screen before accepting
  // game over (see confirmGameOver). Must outlast the longest burst-skill
  // animation; a real game over exits earlier via ScorePage detection.
  this.gameOverGraceMs = 20 * 1000;
  this.sendHeartsDownwards = true;
  this.init(detect);
}

Tsum.prototype.init = function(detect) {
  log(this.logs.calculateScreenSize);
  var isFat = false;
  if (this.screenHeight / this.screenWidth < 1.5) {
    isFat = true;
    this.gameHeight = this.screenHeight;
    this.gameWidth = this.screenHeight / 1.5;
    this.gameOffsetY = Math.floor((this.gameWidth * 16 / 9 - this.gameHeight) / 2);
    this.gameOffsetX = Math.floor((this.gameWidth - this.screenWidth) / 2);
  } else {
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.screenWidth / 9 * 16;
    this.gameOffsetX = 0;
    this.gameOffsetY = Math.floor((this.gameHeight - this.screenHeight) / 2);
    console.log('??', this.gameHeight, this.screenHeight, this.gameWidth);
  }

  if (detect && this.screenHeight / this.screenWidth > 16 / 9) {
    log('detect screen size (special screen ratio)');
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.gameWidth * 1.5;
    this.gameOffsetX = 0;
    this.gameOffsetY = detectOffsetYInGame();
  }

  this.captureGameRatio = this.gameWidth / 1080;
  if (isFat) {
    this.playWidth = this.gameWidth;
    this.playOffsetX = Math.max(-this.gameOffsetX, 0);
  } else {
    this.playWidth = this.screenWidth;
    this.playOffsetX = 0;
  }
  // noinspection JSSuspiciousNameCombination
  this.playHeight = this.playWidth; // game has square dimension
  this.playOffsetY = 465 * this.captureGameRatio - this.gameOffsetY;

  this.sleep(200);
  log(this.logs.offset, this.gameOffsetX, this.gameOffsetY, this.screenHeight, this.screenWidth);
  this.sleep(1000);
  execute("mkdir -p " + this.storagePath + '/tmp');
  this.sleep(200);
  execute("mkdir -p " + this.storagePath + '/' + Config.recordDir);
}

Tsum.prototype.sendMoneyInfo = function() {
  if (!canSendMessage()) {
    return;
  }
  var x = Math.floor(Button.moneyInfoBox.x * this.captureGameRatio - this.gameOffsetX);
  var y = Math.floor(Button.moneyInfoBox.y * this.captureGameRatio - this.gameOffsetY);
  var w = Math.floor(Button.moneyInfoBox.w * this.captureGameRatio);
  var h = Math.floor(Button.moneyInfoBox.h * this.captureGameRatio);
  var img = getScreenshotModify(x, y, w, h, Button.moneyInfoBox.w / 2, Button.moneyInfoBox.h / 2, 80);
  var base64 = getBase64FromImage(img);
  releaseImage(img);
  log(this.logs.sendMessage);
  sendMessage("Tsum Tsum", base64);
}

Tsum.prototype.isAppOn = function() {
  if (!this.autoLaunch) {
    return true;
  }
  var result = execute('dumpsys window').split('mCurrentFocus');
  if (result.length < 2) {
    return false;
  }
  result = result[1].split(" ");
  if (result.length < 3) {
    return false;
  }
  result = result[2].split("/");
  if (result.length < 2) {
    return false;
  }
  var packageName = result[0];
  return packageName.indexOf('LGTMTM') !== -1;
};

function getPackageName(isJP) {
    var packageName = 'com.linecorp.LGTMTM';
    if (!isJP) {
        packageName += 'G';
    }
    return packageName;
}

function startTsumTsumApp(isJP) {
  var packageName = getPackageName(isJP);
  execute('BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar' +
      ' am start --activity-single-top -n ' + packageName + '/com.linecorp.LGTMTM.TsumTsum');
}

Tsum.prototype.startApp = function() {
  if (!this.autoLaunch) {
    return;
  }
  log(this.logs.startTsumTsumApp);
  startTsumTsumApp(this.isJP);
  this.sleep(10000);
  log("TsumTsum app starting.");
}

Tsum.prototype.screenshot = function() {
  return getScreenshotModify(
    0,
    0,
    this.originScreenWidth,
    this.originScreenHeight,
    this.originScreenWidth / this.resizeRatio,
    this.originScreenHeight / this.resizeRatio,
    80
  );
}

Tsum.prototype.playScreenshotSquare = function() {
  return getScreenshotModify(
    this.playOffsetX,
    this.playOffsetY,
    this.playWidth,
    this.playHeight,
    this.playResizeWidth,
    this.playResizeHeight,
    100
  );
}

Tsum.prototype.toResizeXY = function(x, y) {
  var rx = Math.floor((x * this.captureGameRatio - this.gameOffsetX) / this.resizeRatio);
  var ry = Math.floor((y * this.captureGameRatio - this.gameOffsetY) / this.resizeRatio);
  return {x: rx, y: ry};
}

Tsum.prototype.toResizeXYs = function(xy) {
  return this.toResizeXY(xy.x, xy.y);
}

Tsum.prototype.getColor = function(img, xy) {
  var rxy = this.toResizeXYs(xy);
  return getImageColor(img, Math.max(rxy.x, 0), Math.max(rxy.y, 0));
}

Tsum.prototype.toRealXY = function(x, y) {
  var rx = Math.floor(x * this.captureGameRatio - this.gameOffsetX);
  var ry = Math.floor(y * this.captureGameRatio - this.gameOffsetY);
  return {x: rx, y: ry};
}

Tsum.prototype.toRealXYs = function(xy) {
  return this.toRealXY(xy.x, xy.y);
}

Tsum.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tap(rxy.x, rxy.y, during);
}

Tsum.prototype.tapDown = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tapDown(rxy.x, rxy.y, during);
}

Tsum.prototype.moveTo = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  moveTo(rxy.x, rxy.y, during);
}

Tsum.prototype.tapUp = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tapUp(rxy.x, rxy.y, during);
}

Tsum.prototype.linkTsums = function(path) {
  for (var j = 0; j < path.length; j++) {
    var point = path[j];
    var x = Math.floor(this.playOffsetX + (point.x + Config.tsumWidth / 2) * this.playWidth / this.playResizeWidth);
    var y = Math.floor(this.playOffsetY + (point.y + Config.tsumWidth / 2) * this.playHeight / this.playResizeHeight);
    if (j === 0) {
      tapDown(x, y, 10);
    }
    moveTo(x, y, 10);
    if (j === path.length - 1) {
      tapUp(x, y, 10);
    }
  }
}

// Tap the bubbles the last board scan found. Taps only -- the positions were
// worked out at scan time -- so this stays inside the window where the chain is
// still clearing. A tap that misses costs nothing: it is not a drag, so it
// links nothing and the game ignores it. (Ported from TsumThi.)
Tsum.prototype.popGameBubbles = function() {
  var bubbles = this.gameBubbles;
  if (!bubbles || bubbles.length === 0) { return; }
  var cfg = GameBubbleConfig;
  var count = Math.min(bubbles.length, cfg.maxTaps);
  for (var i = 0; i < count; i++) {
    var b = bubbles[i];
    var x = Math.floor(this.playOffsetX + b.x * this.playWidth / this.playResizeWidth);
    var y = Math.floor(this.playOffsetY + b.y * this.playHeight / this.playResizeHeight);
    tap(x, y, cfg.tapDuring);
  }
  if (this.debug) { console.log('[Bubbles] popped ' + count); }
  // A bubble only pops once; forget them until the next scan finds them again.
  this.gameBubbles = [];
};

// When skillAutoTap is on, fire the skill the moment it's ready instead of
// waiting for the next useSkill at the end of the board-scan cycle. The gauge
// can fill and sit ready for seconds while we scan, calculate and link; this is
// called often (e.g. between chains) but only does a real screenshot/check once
// per skillAutoTapInterval ms, so the timestamp guard keeps frequent calls cheap.
// Routes through useSkill so every skill type's activation (and choreography) is
// handled exactly as the normal end-of-cycle path. (Ported from TsumThi.)
Tsum.prototype.maybeAutoTapSkill = function(board) {
  if (!this.skillAutoTap) { return; }
  var now = Date.now();
  if (now - this._lastSkillAutoTap < this.skillAutoTapInterval) { return; }
  this._lastSkillAutoTap = now;
  if (this.skillType === 'burst' || this.skillType === 'burst_bubbles') {
    // A bare tap is a complete activation for burst skills, and it's a no-op
    // while the gauge isn't full -- skip the screenshots entirely.
    this.tap(Button.gameSkill1, 10);
    return;
  }
  // One readiness read before the full useSkill probe (findPage plus a double
  // gauge check, several screenshots) so the recurring cost while the gauge is
  // still filling stays at a single screenshot.
  var img = this.screenshot();
  var status;
  try {
    status = this.checkSkillReadiness(img, Button.gameSkill1);
  } finally {
    releaseImage(img);
  }
  if (status === 'active') {
    this.useSkill(board);
  }
};

Tsum.prototype.link = function(paths, board) {
  var isBubble = false;
  for (var i in paths) {
    var path = paths[i];
    // >= 7 should be correct, but practically the real chain is always shorter
    // so using a bigger value than theoretically correct
    if (path.length >= 12) {
      isBubble = true;
    }
    this.linkTsums(path);
    // Pop whatever the last scan saw the moment a long chain lands: with Tiara
    // Minnie+ a bubble popped as a chain goes off clears a bigger area.
    if (path.length >= GameBubbleConfig.minChainForPop) {
      this.popGameBubbles();
    }
    // Linking a full batch of chains can take several seconds; check between
    // chains so a gauge that fills mid-batch fires right away.
    this.maybeAutoTapSkill(board);
  }
  return isBubble;
}

Tsum.prototype.findPageObject = function(times, timeout) {
  if (times === undefined) {times = 2;}
  if (timeout === undefined) {timeout = 700;}
  var start = Date.now();
  var page = null;
  while(this.isRunning) {
    var currentPage = null;
    for (var t = 0; t < times; t++) {
      var img = this.screenshot();
      for (var key in Page) {
        page = Page[key];
        currentPage = null;
        var pageColors = page.colors || [];
        for (var i = 0; i < pageColors.length; i++) {
          var diff = absColor(pageColors[i], this.getColor(img, pageColors[i]));
          if ((diff < pageColors[i].threshold) === pageColors[i].match) {
            currentPage = page;
          } else {
            currentPage = null;
            break;
          }
        }
        if (currentPage !== null) {
          debug(this.logs.currentPage, currentPage.name + ' (' + key + ')', 'findPageObject');
          break;
        }
      }
      releaseImage(img);
      this.sleep(100);
    } // for times
    if (currentPage !== null) {
      // trigger callback if defined
      if (typeof currentPage.onDetect === "function") {
        var callback = currentPage.onDetect;
        log("Applying fn " + callback.name + "...");
        callback.apply(this);
        log("Applied fn " + callback.name + ".");
      }
      return currentPage;
    }
    if (Date.now() - start > timeout) {
      return null;
    }
  }
}

Tsum.prototype.findPage = function(times, timeout) {
  var page = this.findPageObject(times, timeout);
  if (page !== null) {
    var name = page.name;
    switch (name) {
        case "GamePause":
        case "GamePlaying":
        case "StartPage":
        case "TsumsPage":
        case "TsumTsumStorePage":
          this.isStartupPhase = false;
    }
  }
  return page != null ? page.name : 'unknown';
}

Tsum.prototype.matchesPage = function (pageName) {
  var found = false;
  var img = null;
  for (var pageId in Page) {
    var page = Page[pageId];
    if (pageName === page.name) {
      if (img == null) {
        // lazy init only if page exists
        img = this.screenshot();
      }
      var colors = page.colors || [];
      found = false;
      for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        found = isSameColor(this.getColor(img, color), color, 20);
        if (!found) {
          break;  // try next page
        }
      }
      if (found)
        break;  // exit search
    }
  }
  if (img != null) {
    releaseImage(img);
  }
  debug("*** Found", pageName, "=", found);
  return found;
}

Tsum.prototype.exitUnknownPage = function() {
  keycode('KEYCODE_DPAD_DOWN', 50);
  this.sleep(500);
  keycode('KEYCODE_ENTER', 50);
  this.tap(Button.gameQuestionCancel);
  this.tap(Button.gameQuestionCancel2);
  this.tap(Button.outClose);
  this.tap(Button.gameStop);
  this.sleep(500);
}

Tsum.prototype.goFriendPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    if (this.isStartupPhase) {
      // sleep longer to safely detect new event windows which might initially take longer to load
      this.sleep(5000);
    }
    var pageObj = this.findPageObject(2, 1000);
    var page = pageObj != null ? pageObj.name : "unknown";
    log(this.logs.currentPage, page, "goFriend");
    if (page === 'FriendPage') {
      // check again with 3 seoconds delay (Event notification/page might fly in)
      this.sleep(3000);
      page = this.findPage(1, 500);
      if (page === 'FriendPage') {
        this.sendMoneyInfo();
        this.isStartupPhase = false;
        return;
      }
    } else if (page === "ClosePage") {
      this.tap(pageObj.back);
      this.tap({x: 310, y: 1588 - 140});
    } else if (page === 'unknown') {
      this.exitUnknownPage();
    } else {
      this.tap(pageObj.back);
    }
    this.sleep(1000);
  }
}

Tsum.prototype.checkGameItem = function() {
  var isItemsOn = [false, false, false, false, false, false, false];
  if (this.scoreItem) {
    isItemsOn[0] = true;
  }
  if (this.coinItem) {
    isItemsOn[1] = true;
  }
  if (this.expItem) {
    isItemsOn[2] = true;
  }
  if (this.timeItem) {
    isItemsOn[3] = true;
  }
  if (this.bubbleItem) {
    isItemsOn[4] = true;
  }
  if (this.tsumCount === 4) {
    isItemsOn[5] = true;
  }
  if (this.comboItem) {
    isItemsOn[6] = true;
  }
  for(var t = 0; t < 3; t++) {
    var img = this.screenshot();
    var isChange = false;
    for (var i = 0; i < Button.outGameItems.length; i++) {
      var c = this.getColor(img, Button.outGameItems[i]);
      if (c.b > 128) { // off
        if (isItemsOn[i]) {
          this.tap(Button.outGameItems[i]);
          isChange = true;
          this.sleep(500);
        }
      } else { // on
        if (!isItemsOn[i]) {
          this.tap(Button.outGameItems[i]);
          isChange = true;
          this.sleep(500);
        }
      }
    }
    releaseImage(img);
    console.log("Bonus items changed = " + isChange);
    if (!isChange) {
      break;
    }
    this.sleep(500);
  }
  debug(this.logs.checkBonusItems, isItemsOn);
}

Tsum.prototype.goGamePlayingPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    var pageObj = this.findPageObject(2, 2000);
    var page = pageObj != null ? pageObj.name : "unknown";
    log(this.logs.currentPage, page, "play");
    if (page === 'FriendPage') {
      this.tap(pageObj.next);
      this.sleep(3000);
      this.lastVisitedPages.gameFriend = true;
    } else if (page === 'StartPage') {
      this.sleep(500);
      this.checkGameItem();
      this.sendMoneyInfo();
      this.tap(Button.outStart);
      this.sleep(5000); // avoid checking items again!
      this.lastVisitedPages.gameStart = true;
    } else if (page === 'GamePlaying') {
      // check again
      page = this.findPage(1, 500);
      if (page === 'GamePlaying') {
        this.isStartupPhase = false;
        return;
      }
    } else if (page === 'GamePause') {
      this.isStartupPhase = false;
      this.tap(pageObj.next);
      this.sleep(500);
    } else if (page === 'unknown') {
      this.exitUnknownPage();
    } else if (page === "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
      this.sleep(1000);
    } else {
      this.tap(pageObj.back);
      this.sleep(1000);
    }
  }
}

Tsum.prototype.goTsumsPage = function() {
  if (!this.isAppOn()) {
    this.startApp();
  }
  this.goFriendPage();
  while(this.isRunning) {
    var page = this.findPageObject(2, 2000);
    if (page != null)
      log(this.logs.currentPage, page.name, "goTsumPage");
    if (page === null) {
      this.exitUnknownPage();
    } else if (page.name === 'TsumsPage') {
      // check again
      page = this.findPageObject(1, 500);
      if (page != null && page.name === 'TsumsPage') {
        return;
      }
    } else if (page.hasOwnProperty('tsums')) {
      this.tap(page.tsums);
      this.sleep(3000);
    } else {
      this.tap(page.back);
      this.sleep(1000);
    }
  }
}

Tsum.prototype.goTsumTsumStorePage = function() {
  if (this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    this.goTsumsPage();
    var pageName = "undefined";
    for (var i = 0; i < 3; i++) {
      this.tap(this.findPageObject().store);
      this.sleep(3000);
      var page = this.findPageObject(5, 2000);
      pageName = page != null ? page.name : 'unknown';
      log("Pg: ", pageName);
      if (page !== null && page.name === 'TsumTsumStorePage') {
        var img = this.screenshot();
        var nextColor = this.getColor(img, page.next);
        releaseImage(img);
        return isSameColor(page.next, nextColor, 50);
      }
    }
    log('Unexpected page found:', page, 'goTsumTsumStorePage');
    return false;
  }
}

Tsum.prototype.clearAllBubbles = function(startDelay, endDelay, fromY, delayBetweenLines) {
  delayBetweenLines = delayBetweenLines || 0;
  if (typeof startDelay === 'number' && startDelay > 0) {
    this.sleep(startDelay);
  }

  var fy = Button.gameBubblesFrom.y;
  if (typeof fromY == 'number') {
    fy = fromY;
  }

  for (var by = fy; by <= Button.gameBubblesTo.y; by += 140) {
    for (var bx = Button.gameBubblesFrom.x; bx <= Button.gameBubblesTo.x; bx += 140) {
      this.tap({x: bx, y: by}, 10);
    }
    this.sleep(delayBetweenLines);
  }

  if (typeof endDelay === 'number' && endDelay > 0) {
    this.sleep(endDelay);
  }
}

Tsum.prototype.useCinderellaSkill = function() {
  var path, offset, y;
  for (var i = 0; i < 5; i += 1) {
    for (offset = 0; offset <= 200; offset += 200) {
      path = [];
      for (y = 170; y >= 70; y -= 20)
        path.push({x: Math.abs(offset - 10), y: y});

      for (y = 60; y <= 180; y += 20)
        path.push({x: Math.abs(offset - 40), y: y});

      for (y = 180; y >= 60; y -= 20)
        path.push({x: Math.abs(offset - 70), y: y});

      for (y = 60; y <= 180; y += 20)
        path.push({x: Math.abs(offset - 100), y: y});

      debug("Cinderella i =", i, ", offset =", offset);
      this.linkTsums(path);
    }
  }
  this.sleep(3000);
  this.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2, 200);
}

Tsum.prototype.useSkill = function(board) {
  function isSkillActive(that, img, skillButton) {
    // Don't know the reason why these are checked instead the "active skill" colors, but hopefully for a good reason
    var skillNotActiveColors = [
      {"a": 0, "b": 157, "g": 112, "r": 85},
      {"a": 0, "b": 181, "g": 139, "r": 72},
      {"a": 0, "b": 128, "g": 73, "r": 16},
      {"a": 0, "b": 178, "g": 153, "r": 3},
      {"a": 0, "b": 255, "g": 215, "r": 33}
    ];
    var currentButtonColor = that.getColor(img, skillButton);
    var skillActive = true;
    for (var colorIdx in skillNotActiveColors) {
      var color = skillNotActiveColors[colorIdx];
      var matchesSkillNotActiveColor = isSameColor(color, currentButtonColor, 60);
      // console.log(JSON.stringify(skillButton) + " - " + JSON.stringify(color) + " matches actual color " + JSON.stringify(currentButtonColor) + " = " + matchesSkillNotActiveColor);
      skillActive = skillActive && !matchesSkillNotActiveColor;
    }
    return skillActive;
  }

  if (this.skillType === 'no_skill') {
    return false;
  }

  var page = this.findPage(1, 500);
  if (page !== 'GamePlaying' && page !== 'GamePause') {
    return false;
  }

  for (var i = 0; i < 2; i++) {
    var img = this.screenshot();
    var skillActive1 = isSkillActive(this, img, Button.gameSkill1);
    var skillActive2 = this.skillType === 'block_pair_tsum' && isSkillActive(this, img, Button.gameSkill2);
    releaseImage(img);
    if (skillActive1 || skillActive2) {
      if (i === 0) {
        this.sleep(200);
      }
    } else {
      this.lastVisitedPages.gameSkillInactive = true;
      return false;
    }
  }
  this.lastVisitedPages.gameSkillActive = true;
  if (this.noSkillLastFeverSec > 0) {
    var feverAlmostOver = null;
    do {
      if (feverAlmostOver) {
        this.sleep(100);
      }
      feverAlmostOver = (function (tsum) {
        // skip skill activation if fever and fever almost over and enough seconds remaining
        var img = tsum.screenshot();
        var fever1 = isSameColor(tsum.getColor(img, {x: 340, y: 310}), {r: 0, g: 40, b: 49}, 80);
        var feverRingLeft = rgb2hsv(tsum.getColor(img, {x: 332, y: 1666}));
        var feverRingRight = rgb2hsv(tsum.getColor(img, {x: 746, y: 1666}));
        var hueDifference = Math.min(
            Math.abs(feverRingLeft.h - feverRingRight.h),
            360 - Math.abs(feverRingLeft.h - feverRingRight.h));
        var fever2 = hueDifference > 20;
        var feverStartColorHsv = rgb2hsv(tsum.getColor(img, {x: 345, y: 1670}));
        var offsetX = Math.floor((733 - 345) * tsum.noSkillLastFeverSec / 10);
        var feverEndColorHsv = rgb2hsv(tsum.getColor(img, {x: 345 + offsetX, y: 1670}));
        var feverAlmostOver = feverEndColorHsv.v < 90 || Math.abs(feverStartColorHsv.v - feverEndColorHsv.v) > 10;
        var remainingTimeColor = tsum.getColor(img, {x: 155, y: 190});
        var fewSecondsLeftColor = tsum.getColor(img, {x: 144, y: 195});
        var enoughSecondsRemaining = isSameColor(remainingTimeColor, fewSecondsLeftColor, 60);
        releaseImage(img);
        // debug({fever1: fever1, fever2: fever2, almostOver: feverAlmostOver, enoughTime: enoughSecondsRemaining});
        return fever1 && fever2 && feverAlmostOver && enoughSecondsRemaining;
      })(this);
    } while (feverAlmostOver);
  }
  log(this.logs.useSkill);
  if (this.skillType === 'block_lukej_s') {
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
  } else if (this.skillType === 'block_lightning_mcqueen_plus_s') {
    this.sleep(200);  // let tsums settle
  } else if (this.skillType === 'block_tiara_minnie_plus_s') {
    // Her picks detonate the board, so wait for it to stop moving first.
    this.tiaraWaitForSettledBoard();
  }
  this.tap(Button.gameSkill1);
  this.sleep(30);
  if (skillActive2) {
    this.tap(Button.gameSkill2);
    this.sleep(30);
  }
  if (this.skillType === 'block_lukej_s') {
    for (var i = 0; i < 5; i++) {
      this.tapDown({x: 820, y: 1200}, 20);
      this.moveTo({x: 820, y: 1150}, 20);
      if (i === 0) {
        this.sleep(1160);
      }
      this.sleep(350);
      this.moveTo({x: 825, y: 1000}, 20);
      this.sleep(100);
      this.moveTo({x: 835, y: 800}, 20);
      this.sleep(100);
      this.moveTo({x: 845, y: 600}, 20);
      this.sleep(100);
      this.moveTo({x: 850, y: 450}, 20);
      this.tapUp({x: 850, y: 420}, 20);
      this.sleep(20);
    }
    this.sleep(400);
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
    this.sleep(400);
  } else if (this.skillType === 'block_donald_s' || this.skillType === 'block_donaldx_s') {
    for (var i1 = 0; i1 < 3; i1++) {
      for (var bx = Button.gameBubblesFrom.x - 40; bx <= Button.gameBubblesTo.x + 40; bx += 150) {
        for (var by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y + 100; by += 150) {
          this.tap({x: bx, y: by}, 10);
        }
      }
    }
  } else if (this.skillType === 'block_marie_s' || this.skillType === 'block_missbunny_s' || this.skillType === 'block_rabbit_s') {
    this.clearAllBubbles(2000, 50);
  } else if(this.skillType === 'block_moana_s') {
    this.clearAllBubbles(2500, 50);
  } else if(this.skillType === 'block_mickeyh2015_s') {
    this.clearAllBubbles(1500, 50);
  } else if(this.skillType === 'block_snowwhite_s') {
    this.clearAllBubbles(1300);
    this.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
  } else if(this.skillType === 'block_cinderella_s') {
    this.sleep(1500);
    this.useCinderellaSkill(board);
  } else if(this.skillType === 'block_woody2_s'){
    this.sleep(1800);
    this.tapDown({x: 540, y: 960}, 20);
    this.moveTo({x: 980, y: 960}, 20);
    this.sleep(50);
    for (var i = 0; i < 3; i++) {
      this.moveTo({x: 100, y: 960}, 20);
      this.sleep(420);
      this.moveTo({x: 980, y: 960}, 20);
      this.sleep(480);
    }
    this.tapUp({x: 980, y: 960}, 20);
  } else if (this.skillType === 'block_cabbage_mickey_s') {
    // wait for all cabbages being placed
    this.sleep(3300);
    // find mickey in cabbage
    var colorMickeyFace = {r: 245, g: 225, b: 210};
    var startTime = Date.now();
    var foundMickey = false;
    var maybeMickey = null;
    var color = null;
    var maxTries = 5;
    for (var tries = 1; tries <= maxTries && !foundMickey; tries++) {
      this.sleep(100);
      img = this.screenshot();
      smooth(img, 2, 5);
      for (var y = 720; y < 1380 && !foundMickey; y += 25) {
        for (var x = 120; x < 1000 && !foundMickey; x +=60) {
          maybeMickey = {x: x, y: y};
          color = this.getColor(img, maybeMickey);
          // if (color.r >= 140)
          //   color.r = 255;
          foundMickey |= isSameColor(colorMickeyFace, color, 20);
          if (foundMickey) {
            var up, down, left, right;
            up = down = left = right = maybeMickey;
            up.y -= 10;
            down.y += 10;
            left.x -= 10;
            right.x += 10;
            foundMickey = (
                    isSameColor(colorMickeyFace, this.getColor(img, up), 20)
                    || isSameColor(colorMickeyFace, this.getColor(img, down), 20))
                && (
                    isSameColor(colorMickeyFace, this.getColor(img, left), 20)
                    || isSameColor(colorMickeyFace, this.getColor(img, right), 20));
          }
          if (this.debug) {
            // logical width is 1080, screenshot usually 360, so reduce xy by factor 3
            drawCircle(img, x / 3, y / 3, 4, foundMickey ? 0 : 255, foundMickey ? 255 : 0, 0, 0);
          }
        }
      }
      if (!foundMickey) {
        debug("*** Didn't find Mickey! ***", function () {
          if (ts.debug) {
            saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey_not_found-" + ts.runTimes + "-" + tries + ".jpg");
            return "Saved screenshot";
          } else {
            return "";
          }
        });
      } else {
        if (this.debug) {
          saveImage(img, getStoragePath() + "/tmp/boardImg-cabbageMickey-" + ts.runTimes + "-" + tries + ".jpg");
        }
      }
      releaseImage(img);
    }
    if (foundMickey && maybeMickey != null) {
      debug("Found mickey at position", maybeMickey, "with color", color, "in", Date.now() - startTime, "ms.");
      var tapXY = {x: maybeMickey.x + 15, y: maybeMickey.y + 15};
      for (i = 0; i < 10; i++)
        this.tap(tapXY);
      this.sleep(1000);
    } else {
      this.clearAllBubbles();
    }
  } else if (this.skillType === 'block_cpt_ly_s'){
    this.tap(Button.gameRand, 100);
    this.sleep(2100);
    this.tap(Button.skillCptLy1, 10);
    this.sleep(50);
    this.tap(Button.skillCptLy2, 10);
    if (this.skillLevel >= 2) {
      // 3rd tap
      this.sleep(500);
      this.tap(Button.skillCptLy3, 10);
    }
    if (this.skillLevel >= 4) {
      // 4th tap
      this.sleep(500);
      this.tap(Button.skillCptLy3, 10);
    }
    if (this.skillLevel === 6) {
      // 5th tap
      this.sleep(550);
      this.tap(Button.skillCptLy3, 10);
    }
    this.clearAllBubbles(600, 0, 1000, 300);
  } else if (this.skillType === 'block_tiara_minnie_plus_s'){
    this.useTiaraMinniePlusSkill();
    // Always report "did not fire", whatever happened. The caller runs
    // `while (useSkill())`, and for a skill that takes seconds of choreography
    // an immediate second go is never right: the gauge still reads active
    // through the outro, so a `true` here buys another settle wait, lead-in and
    // bubble wait -- about six seconds of standing still -- before the missing
    // bubble finally ends it. If the gauge really is full again, the next
    // board-scan cycle picks it up one cycle later, which costs nothing like
    // as much.
    return false;
  } else if (this.skillType === 'block_lightning_mcqueen_plus_s'){
    this.sleep(2000);
    for (i = 1; i <= 20; i+=1) {
      this.sleep(50);
      img = this.playScreenshotSquare();
      color = getImageColor(img, 120, 184);
      if (isSameColor({r: 245, g: 0, b: 0}, color, 10)) {
        // max speed detected
        this.tap({x: 670, y: 1050}, 10);  // tap somewhere into the game
        i = 20;
      }
      releaseImage(img);
    }
    this.sleep(2500);
    // this.clearAllBubbles(600, 0, 1000, 300);
  } else {
    this.tap(Button.gameRand, 100); // randomize tsums if tsum supports it
    this.sleep(this.skillInterval - 100);
    if (this.skillType === 'burst_bubbles') {
      this.clearAllBubbles(0, 0, 1000, 300);
    }
  }
  return true;
}

// Whether firing the fan now would be a waste: the tsums it shuffles are about
// to be cleared by a skill that is ready or nearly so. It also leaves the board
// churning right as the skill activates, which matters for skills that read the
// board on activation (Tiara Minnie+ blows up whatever is under her pick).
// Costs one screenshot, so only call it where a fan tap is actually pending.
// (Ported from TsumThi.)
Tsum.prototype.fanWouldBeWasted = function() {
  var img = this.screenshot();
  try {
    return this.checkSkillReadiness(img, Button.gameSkill1) !== 'far';
  } finally {
    releaseImage(img);
  }
};

Tsum.prototype.checkSkillReadiness = function(img, skillButton) {
  // Tiered version of isSkillActive's color check. Same reference colors, two
  // thresholds: tight (25) means firmly empty; loose (60) is the original
  // not-active match. Returns 'active', 'almost', or 'far'.
  var skillNotActiveColors = [
    {"a": 0, "b": 157, "g": 112, "r": 85},
    {"a": 0, "b": 181, "g": 139, "r": 72},
    {"a": 0, "b": 128, "g": 73, "r": 16},
    {"a": 0, "b": 178, "g": 153, "r": 3},
    {"a": 0, "b": 255, "g": 215, "r": 33}
  ];
  var c = this.getColor(img, skillButton);
  var matchesTight = false, matchesLoose = false;
  for (var i = 0; i < skillNotActiveColors.length; i++) {
    var nc = skillNotActiveColors[i];
    if (isSameColor(nc, c, 25)) { matchesTight = true; }
    if (isSameColor(nc, c, 60)) { matchesLoose = true; }
  }
  if (!matchesLoose) { return 'active'; }
  if (!matchesTight) { return 'almost'; }
  return 'far';
};

// ---------------------------------------------------------------------------
// Tiara Minnie+ (ported from TsumThi)
//
// The skill shows Minnie with a thought bubble holding one present, then a
// screen of presents to pick the match from. Both halves are read by cropping
// fixed boxes and comparing the pictures directly: the bubble is always drawn
// in the same place, and the presents always land on the centres in
// TiaraLayouts.
//
// Nothing here works out how many presents are on screen. Every centre from
// every layout is scored against the bubble and the best-matching one is
// tapped, so a miscounted screen cannot send the tap to the wrong place -- and
// two centres from different layouts that sit on the same present are both
// right answers. Offline this picked the correct present on all 20 frame/design
// pairs, and kept doing so with every centre shifted by up to 25px.
// ---------------------------------------------------------------------------

// Hue names for the debug line, over OpenCV's 0..179 hue range.
var TiaraHueNames = [
  {to: 8, name: 'red'},     {to: 20, name: 'orange'},  {to: 32, name: 'yellow'},
  {to: 44, name: 'lime'},   {to: 75, name: 'green'},   {to: 95, name: 'teal'},
  {to: 125, name: 'blue'},  {to: 145, name: 'purple'}, {to: 165, name: 'pink'},
  {to: 180, name: 'red'}
];

function tiaraHueName(h) {
  for (var i = 0; i < TiaraHueNames.length; i++) {
    if (h < TiaraHueNames[i].to) { return TiaraHueNames[i].name; }
  }
  return '?';
}

// A readable "bow/body" summary of a sampled present, so the log says what the
// script thinks it is looking at rather than just a score.
function tiaraDescribe(t, grid) {
  var split = Math.max(1, Math.floor(grid * 0.35));
  var part = function(r0, r1) {
    var sx = 0, sy = 0, w = 0;
    for (var r = r0; r < r1; r++) {
      for (var c = 0; c < grid; c++) {
        var k = (r * grid + c) * 5;
        if (t[k + 4] <= 0) { continue; }
        sx += t[k]; sy += t[k + 1]; w += t[k + 2];
      }
    }
    if (w <= 0) { return 'white'; }
    var h = Math.atan2(sy, sx) * 90 / Math.PI;
    if (h < 0) { h += 180; }
    return tiaraHueName(h);
  };
  return part(0, split) + ' bow / ' + part(split, grid) + ' body';
}

// Hue vector lookup. Every sampled cell turns its hue into a unit vector; there
// are a few thousand of those per match, and the hue is a byte.
//
// Filled for all 256 values, not just OpenCV's 0..179 hue range, so the table
// is a total function of the byte and cannot hand back undefined -- an
// out-of-range hue would otherwise turn the whole score into NaN, which fails
// every gate silently. The extra entries are the same wrap Math.cos would give.
var TiaraHueCos = [];
var TiaraHueSin = [];
(function() {
  for (var h = 0; h < 256; h++) {
    TiaraHueCos.push(Math.cos(h * Math.PI / 90));
    TiaraHueSin.push(Math.sin(h * Math.PI / 90));
  }
})();

// Reduce a template sampled by tiaraSample to just the cells it marks as
// present, laid out flat.
//
// Scoring only ever looks at those cells -- so neither the dark tsums behind a
// board present nor the white cloud behind the bubble one can influence the
// result -- which means the other cells of a candidate crop never need to be
// read at all. On the reference bubbles the mask keeps between 8% and 58% of
// the 144 cells, around 38% on average, and that is the factor it takes off
// every candidate.
function tiaraCompileTemplate(t, grid) {
  var idx = [], hx = [], hy = [], sat = [], val = [];
  var cells = grid * grid;
  for (var i = 0; i < cells; i++) {
    var k = i * 5;
    if (t[k + 4] <= 0) { continue; }
    idx.push(i);
    hx.push(t[k]); hy.push(t[k + 1]); sat.push(t[k + 2]); val.push(t[k + 3]);
  }
  return {idx: idx, hx: hx, hy: hy, sat: sat, val: val, n: idx.length};
}

// A coarse brightness fingerprint of the play area, cheap enough to take over
// and over. Used only to tell whether anything on the board is still moving.
Tsum.prototype.tiaraBoardSignature = function() {
  var cfg = TiaraMinnieConfig;
  var n = cfg.settleCapture;
  var img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
  var out = [];
  try {
    var step = n / cfg.settleGrid;
    for (var gy = 0; gy < cfg.settleGrid; gy++) {
      for (var gx = 0; gx < cfg.settleGrid; gx++) {
        var c = getImageColor(img, Math.floor((gx + 0.5) * step), Math.floor((gy + 0.5) * step));
        out.push((c.r + c.g + c.b) / 3);
      }
    }
  } finally {
    releaseImage(img);
  }
  return out;
};

function tiaraSignatureDiff(a, b) {
  var d = 0;
  for (var i = 0; i < a.length; i++) { d += Math.abs(a[i] - b[i]); }
  return d / a.length / 255;
}

// Hold off activating until the board stops moving.
//
// Tapping a present blows up an area of the board, so it pays to fire when the
// board is full and settled. The play loop clears a chain (and sometimes works
// the fan) immediately before the skill goes off, and a blast that lands while
// the tsums are still falling hits far fewer of them.
Tsum.prototype.tiaraWaitForSettledBoard = function() {
  var cfg = TiaraMinnieConfig;
  var start = Date.now();
  var deadline = start + cfg.settleWaitMs;
  var prev = this.tiaraBoardSignature();
  var quiet = 0;
  var diff = 1;
  while (Date.now() < deadline) {
    this.sleep(cfg.settlePollMs);
    var now = this.tiaraBoardSignature();
    diff = tiaraSignatureDiff(prev, now);
    prev = now;
    // Two quiet readings, not one, so a momentary lull mid-cascade doesn't pass.
    quiet = diff <= cfg.settleMaxDiff ? quiet + 1 : 0;
    if (quiet >= cfg.settleQuietScans && Date.now() - start >= cfg.settleMinMs) {
      if (this.debug) {
        console.log('[Tiara] board settled in ' + (Date.now() - start) + 'ms, diff ' + diff.toFixed(3));
      }
      return true;
    }
  }
  // Fire anyway: a late skill is worth more than a skipped one.
  log(this.logs.tiaraBusy, diff.toFixed(3));
  return false;
};

// Play square at matching resolution, blurred so one pixel read stands in for
// the average of its cell, then HSV -- where getImageColor gives b=hue 0..179,
// g=saturation, r=value.
Tsum.prototype.tiaraCapture = function() {
  var cfg = TiaraMinnieConfig;
  var img = getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight,
    cfg.captureSize, cfg.captureSize, 100);
  smooth(img, 1, cfg.captureBlur);
  convertColor(img, 40);
  return img;
};

// The capture pixel each of the grid x grid cells of the logical square
// (lcx, lcy, side) reads from, flat and in row order. Cells falling outside the
// capture are marked -1 and read as black.
//
// These depend only on the layout tables and the capture size, so every table
// is worked out once and kept -- the match loop would otherwise redo a few
// thousand of these multiplies per scan for coordinates that never change.
function tiaraCellPixels(lcx, lcy, side) {
  var cfg = TiaraMinnieConfig;
  var g = cfg.grid;
  var scale = cfg.captureSize / 1080;
  var step = side / g;
  var left = lcx - side / 2;
  var top = lcy - side / 2;
  var px = [], py = [];
  for (var cy = 0; cy < g; cy++) {
    for (var cx = 0; cx < g; cx++) {
      var x = Math.round((left + (cx + 0.5) * step) * scale);
      var y = Math.round((top + (cy + 0.5) * step - PlayAreaTopY) * scale);
      var inside = x >= 0 && y >= 0 && x < cfg.captureSize && y < cfg.captureSize;
      px.push(inside ? x : -1);
      py.push(inside ? y : -1);
    }
  }
  return {px: px, py: py};
}

var TiaraBubbleCells = null;

function tiaraBubbleCells() {
  if (TiaraBubbleCells == null) {
    var cfg = TiaraMinnieConfig;
    TiaraBubbleCells = tiaraCellPixels(cfg.bubbleX, cfg.bubbleY, cfg.bubbleSide);
  }
  return TiaraBubbleCells;
}

// Read a cell table into grid x grid cells. Each cell carries a
// saturation-weighted hue vector, saturation, value, and whether it looks like
// part of a present. Hue goes in as a vector so the 179->0 wrap cannot average
// a red into a cyan.
//
// Only the bubble goes through here; candidates are read and compared in one
// pass by tiaraScoreCandidate, which never materialises this array.
Tsum.prototype.tiaraSample = function(img, cells) {
  var cfg = TiaraMinnieConfig;
  var n = cfg.grid * cfg.grid;
  var out = [];
  for (var i = 0; i < n; i++) {
    var px = cells.px[i];
    var h = 0, s = 0, v = 0;
    if (px >= 0) {
      var col = getImageColor(img, px, cells.py[i]);
      h = col.b; s = col.g; v = col.r;
    }
    out.push(s * TiaraHueCos[h] / 255);
    out.push(s * TiaraHueSin[h] / 255);
    out.push(s / 255);
    out.push(v / 255);
    out.push((s >= cfg.satMin && v >= cfg.valMin) ? 1 : 0);
  }
  return out;
};

// Small, unblurred capture for the cloud test only. That test is polled in a
// loop and only asks whether a big pale blob is on screen, which survives heavy
// downsampling -- the margin it works with is 0.49 against 0.09.
Tsum.prototype.tiaraCloudCapture = function() {
  var n = TiaraMinnieConfig.cloudCaptureSize;
  return getScreenshotModify(
    this.playOffsetX, this.playOffsetY, this.playWidth, this.playHeight, n, n, 100);
};

var TiaraCloudPoints = null;

// The capture pixels the cloud test reads, worked out once instead of on every
// poll, with the present dropped here rather than tested each time round.
function tiaraCloudPoints() {
  if (TiaraCloudPoints != null) { return TiaraCloudPoints; }
  var cfg = TiaraMinnieConfig;
  var box = cfg.cloudBox;
  var size = cfg.cloudCaptureSize;
  var scale = size / 1080;
  var half = cfg.bubbleSide / 2;
  var ex0 = cfg.bubbleX - half, ex1 = cfg.bubbleX + half;
  var ey0 = cfg.bubbleY - half, ey1 = cfg.bubbleY + half;
  var xs = [], ys = [];
  for (var ly = box.y0; ly <= box.y1; ly += cfg.cloudStep) {
    for (var lx = box.x0; lx <= box.x1; lx += cfg.cloudStep) {
      // Skip the present itself: only the cloud around it should count.
      if (lx >= ex0 && lx <= ex1 && ly >= ey0 && ly <= ey1) { continue; }
      var px = Math.round(lx * scale);
      var py = Math.round((ly - PlayAreaTopY) * scale);
      if (px < 0 || py < 0 || px >= size || py >= size) { continue; }
      xs.push(px); ys.push(py);
    }
  }
  TiaraCloudPoints = {xs: xs, ys: ys, n: xs.length};
  return TiaraCloudPoints;
}

// How much of the area around the bubble is pale cloud. Separates "bubble is
// up" from "presents are up" and from ordinary play by a wide margin: the
// sample frames read 0.48-0.50 with a bubble and 0.02-0.06 without one.
// Takes a capture from tiaraCloudCapture, not the matching one.
//
// Reads the raw BGR pixel: OpenCV's HSV value is max(b,g,r) and its saturation
// is 255*(max-min)/max, so the pale test can be made straight from the pixel
// and the whole-image colour conversion this poll would otherwise run dropped.
// The saturation is rounded the way OpenCV rounds it, so pixels sitting exactly
// on the threshold fall the same side of it.
Tsum.prototype.tiaraCloudFrac = function(img) {
  var cfg = TiaraMinnieConfig;
  var pts = tiaraCloudPoints();
  if (pts.n === 0) { return 0; }
  var hit = 0;
  for (var i = 0; i < pts.n; i++) {
    var col = getImageColor(img, pts.xs[i], pts.ys[i]);
    var mx = col.r > col.g
      ? (col.r > col.b ? col.r : col.b)
      : (col.g > col.b ? col.g : col.b);
    if (mx < cfg.cloudValMin) { continue; }
    var mn = col.r < col.g
      ? (col.r < col.b ? col.r : col.b)
      : (col.g < col.b ? col.g : col.b);
    if (Math.round(255 * (mx - mn) / mx) <= cfg.cloudSatMax) { hit++; }
  }
  return hit / pts.n;
};

var TiaraCandidates = null;

// Every present centre from every layout, each with the cell table for the crop
// size that suits its count. Scored together; the count is never decided.
function tiaraCandidates() {
  if (TiaraCandidates != null) { return TiaraCandidates; }
  var out = [];
  for (var n = 2; n <= 6; n++) {
    var slots = TiaraLayouts[n];
    var side = TiaraSlotSide[n];
    for (var i = 0; i < slots.length; i++) {
      var cells = tiaraCellPixels(slots[i].x, slots[i].y, side);
      out.push({x: slots[i].x, y: slots[i].y, count: n, px: cells.px, py: cells.py});
    }
  }
  TiaraCandidates = out;
  return out;
}

// Similarity of one candidate crop to the compiled bubble template, 0..1.
//
// Reading the pixel and comparing it happen in the same pass, over the
// template's cells only, so a candidate costs as many pixel reads as the mask
// has cells rather than a full grid. Each cell's difference is divided by
// cellSpread and clipped, which makes the score count clearly-wrong cells
// instead of averaging away small ones -- worth roughly triple the margin of a
// plain mean.
Tsum.prototype.tiaraScoreCandidate = function(img, cand, tpl) {
  var spread = TiaraMinnieConfig.cellSpread;
  if (tpl.n <= 0) { return 0; }
  var d = 0;
  for (var j = 0; j < tpl.n; j++) {
    var i = tpl.idx[j];
    var px = cand.px[i];
    var chx = 0, chy = 0, cs = 0, cv = 0;
    if (px >= 0) {
      var col = getImageColor(img, px, cand.py[i]);
      cs = col.g / 255;
      cv = col.r / 255;
      chx = cs * TiaraHueCos[col.b];
      chy = cs * TiaraHueSin[col.b];
    }
    var cell = (Math.abs(tpl.hx[j] - chx) + Math.abs(tpl.hy[j] - chy)
              + Math.abs(tpl.sat[j] - cs) + Math.abs(tpl.val[j] - cv)) / 4 / spread;
    if (cell > 1) { cell = 1; }
    d += cell;
  }
  return 1 - d / tpl.n;
};

Tsum.prototype.tiaraBestMatch = function(img, tpl) {
  var cands = tiaraCandidates();
  var n = cands.length;
  var scores = [];
  var bi = 0;
  var i;
  for (i = 0; i < n; i++) {
    scores.push(this.tiaraScoreCandidate(img, cands[i], tpl));
    if (scores[i] > scores[bi]) { bi = i; }
  }
  var best = cands[bi];
  // Centres from different layouts can land on the same present, and tapping
  // either is correct, so the margin is measured against the best candidate
  // that is somewhere else entirely.
  var rival = -1;
  for (i = 0; i < n; i++) {
    var dx = cands[i].x - best.x, dy = cands[i].y - best.y;
    if (dx * dx + dy * dy < 100 * 100) { continue; }
    if (rival < 0 || scores[i] > scores[rival]) { rival = i; }
  }
  return {
    x: best.x, y: best.y, count: best.count, score: scores[bi],
    margin: rival < 0 ? scores[bi] : scores[bi] - scores[rival]
  };
};

// Wait for the thought bubble, then read the present inside it.
Tsum.prototype.tiaraWaitForDream = function(timeoutMs) {
  var cfg = TiaraMinnieConfig;
  var deadline = Date.now() + timeoutMs;
  var seen = false;
  while (Date.now() < deadline) {
    var img = this.tiaraCloudCapture();
    try {
      seen = this.tiaraCloudFrac(img) >= cfg.cloudMinFrac;
    } finally {
      releaseImage(img);
    }
    if (seen) { break; }
    this.sleep(cfg.pollMs);
  }
  if (!seen) { return null; }
  // The bubble scales in; reading it mid-animation gives a shrunken present.
  this.sleep(cfg.dreamSettleMs);
  var img2 = this.tiaraCapture();
  try {
    return this.tiaraSample(img2, tiaraBubbleCells());
  } finally {
    releaseImage(img2);
  }
};

// Wait for the presents to land, then tap the one matching the template. The
// game timer is stopped for this whole stretch, so every check here is free.
//
// Three things must agree before a tap goes out: the score clears the floor,
// the winner beats everything elsewhere by the margin (which is what actually
// proves a present is there rather than a lucky patch of board), and the same
// centre wins twice running.
Tsum.prototype.tiaraPick = function(tpl) {
  var cfg = TiaraMinnieConfig;
  var deadline = Date.now() + cfg.choiceWaitMs;
  var img;
  // A template with no cells scores every candidate 0, so no tap can ever clear
  // the floor. Leave now rather than spend choiceWaitMs of full-resolution
  // captures proving it.
  if (tpl.n <= 0) { return null; }

  // The presents only exist once the bubble has gone.
  while (Date.now() < deadline) {
    img = this.tiaraCloudCapture();
    var gone;
    try {
      gone = this.tiaraCloudFrac(img) < cfg.cloudMinFrac;
    } finally {
      releaseImage(img);
    }
    if (gone) { break; }
    this.sleep(cfg.pollMs);
  }
  this.sleep(cfg.choiceLeadMs);

  var agree = 0;
  var last = null;
  while (Date.now() < deadline) {
    img = this.tiaraCapture();
    var m;
    try {
      m = this.tiaraBestMatch(img, tpl);
    } finally {
      releaseImage(img);
    }
    if (m.score >= cfg.confidenceFloor && m.margin >= cfg.marginFloor) {
      agree = (last != null && last.x === m.x && last.y === m.y) ? agree + 1 : 1;
      last = m;
      if (agree >= cfg.agreeScans) {
        for (var i = 0; i < cfg.pickTaps; i++) {
          this.tap({x: m.x, y: m.y}, cfg.pickTapDuring);
          if (i + 1 < cfg.pickTaps) { this.sleep(cfg.pickTapGapMs); }
        }
        return m;
      }
    } else {
      agree = 0;
      last = null;
      if (this.debug) {
        console.log('[Tiara] waiting: best ' + m.score.toFixed(2)
          + ' margin ' + m.margin.toFixed(2) + ' at ' + m.x + ',' + m.y);
      }
    }
    this.sleep(cfg.matchPollMs);
  }
  return null;
};

// One bubble, one pick, per activation.
//
// The thought bubble is only shown once, straight after the skill fires -- it
// does not come back between picks -- so once the present is tapped there is
// nothing left to wait for and this returns straight away. (The 2-to-6
// progression happens across activations, not inside one.)
Tsum.prototype.useTiaraMinniePlusSkill = function() {
  var cfg = TiaraMinnieConfig;
  var started = Date.now();
  this.sleep(cfg.dreamLeadMs);
  var armed = Date.now();
  var template = this.tiaraWaitForDream(cfg.dreamWaitMs);
  if (template == null) {
    log(this.logs.tiaraNoDream);
    return 0;
  }
  log(this.logs.tiaraDream, tiaraDescribe(template, cfg.grid),
      'after ' + (Date.now() - armed) + 'ms');
  // Compiled once and reused by every candidate of every scan.
  var pick = this.tiaraPick(tiaraCompileTemplate(template, cfg.grid));
  if (pick == null) {
    log(this.logs.tiaraUnsure);
    return 0;
  }
  log(this.logs.tiaraPicked, pick.x + ',' + pick.y,
      'score ' + pick.score.toFixed(2), 'margin ' + pick.margin.toFixed(2),
      'layout ' + pick.count, 'total ' + (Date.now() - started) + 'ms');
  return 1;
};

Tsum.prototype.scanBoardQuick = function() {
  // load game tsums
  var startTime = Date.now();
  var srcImg = this.playScreenshotSquare();

  if (this.isPause) {
    this.tap(Button.gamePause);
    this.sleep(20);
    this.tap(Button.gamePause);
  }

  var points = findTsums(srcImg);
  // Read bubble positions off this same capture and remember them, so popping
  // one after a chain is taps only -- no screenshot in the middle of a batch,
  // which would stall the link cadence and the combo timer with it. Bubbles
  // are big and drift slowly, so a position a second old still lands.
  this.gameBubbles = this.skillType === 'block_tiara_minnie_plus_s'
    ? findGameBubbles(srcImg) : [];
  if (this.debug && this.gameBubbles.length > 0) {
    console.log('[Bubbles] found ' + this.gameBubbles.length);
  }
  debug(this.logs.recognitionStart);
  var tcs = classifyTsums(points);
  tcs.sort(function(a, b) { return a.points.length > b.points.length ? -1: 1; });
  var board = [];
  for(var i in tcs) {
    if (i >= this.tsumCount - 1) {
      break;
    }
    var tc = tcs[i];
    for (var j in tc.points) {
      var p = tc.points[j];
      board.push({tsumIdx: i, x: p.x - (Config.tsumWidth / 2), y: p.y - (Config.tsumWidth / 2)});
      if (this.debug) {
        drawCircle(srcImg, p.x, p.y, 4, Config.colors[i][0], Config.colors[i][1], Config.colors[i][2], 0);
      }
    }
  }
  if (this.debug) {
    saveImage(srcImg, this.storagePath + "/tmp/" + ts.runTimes + "-boardImg.jpg");
  }
  releaseImage(srcImg);
  debug(this.logs.recognizedTsums, board.length);
  sleep(30);
  debug(this.logs.recognitionTime, usingTimeString(startTime));

  if (this.isPause) {
    this.sleep(Config.gameContinueDelay);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
  }

  return board;
}

// GamePlaying is recognized by HUD pixels on the pause/fan buttons, and a
// long burst-skill animation (e.g. Dapper Hat Mickey) covers them for longer
// than the old two-check window (~5s) while the game is still running, so the
// play loop would bail mid-game and stall on the "unknown" screen. Thus, an
// unrecognized screen alone is not proof of game over; require positive
// confirmation instead: a game that really ends always reaches a known
// out-of-game page (the score tally lands on ScorePage). Poll until the HUD
// comes back (still playing), a known page shows up (game over), or the
// grace window runs out (the old behavior, just later).
Tsum.prototype.confirmGameOver = function() {
  log(this.logs.confirmingGameOver);
  var deadline = Date.now() + this.gameOverGraceMs;
  while (this.isRunning) {
    var page = this.findPage(1, 1500);
    if (page === 'GamePlaying' || page === 'GamePause') {
      return false;
    }
    if (page !== 'unknown') {
      return true;
    }
    if (Date.now() > deadline) {
      return true;
    }
    this.sleep(250);
  }
  return true;
}

Tsum.prototype.taskPlayGameQuick = function() {
  this.requestTsumMonitor();
  log(this.logs.gameStart);
  this.goGamePlayingPage();
  log(this.logs.fastGaming);
  if (this.isPause) {
    this.sleep(350);
  }
  this.runTimes = 0;
  var clearBubbles = 0;
  var zeroPath = 0;
  while(this.isRunning) {
    var board = this.scanBoardQuick();
    if (board == null) {
      break;
    }
    debug(this.logs.calculationPathStart);
    var paths = calculatePaths(board, this.logs);
    paths = paths.splice(0, 6);
    // Catch a gauge that filled during the scan/calculation above before linking.
    this.maybeAutoTapSkill(board);
    var isBubble = this.link(paths, board);
    if (isBubble) {
      debug(this.logs.bubbleGenerated);
      clearBubbles++;
    }
    if (paths.length < 3) {
      zeroPath++;
      if (zeroPath === 6) {
        // Same guard as the periodic fan below. Without it this fires the fan
        // with the skill already full, and useSkill() runs immediately after --
        // so the skill activates onto a board that is still being tossed about.
        // It also self-sustains: a churning board scans as few paths, which is
        // what increments this counter in the first place.
        if (!this.fanWouldBeWasted()) {
          this.tap(Button.gameRand, 60);
          this.tap(Button.gameRand, 60);
        }
        zeroPath = 0;
      }
    } else {
      // Counts *consecutive* barren scans: a board that is producing chains is
      // not stuck, and letting the count carry over between them fires the fan
      // on a board that never needed shuffling.
      zeroPath = 0;
    }
    // click bubbles
    if (this.clearBubbles && clearBubbles >= 2) {
      debug(this.logs.clearBubbles);
      clearBubbles = 0;
      // only clearing lower area in order to speed up the cleaning process
      this.clearAllBubbles(0, 0, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
    }
    if (this.useFan && this.runTimes % 4 === 3) {
      // Skip the fan when the skill is ready or about to be — useSkill() will
      // fire it next (or the next clear will fill the gauge), so the fan would
      // just be wasted on tsums about to be cleared.
      if (!this.fanWouldBeWasted()) {
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
      }
    }
    if (this.isPause) {
      this.sleep(300);
    }
    while (this.useSkill(board)) {
      if (this.skillType !== "block_cpt_ly_s") {
        clearBubbles++;
      }
    }

    // double check
    var page = this.findPage(1, 2500);
    if (page !== 'GamePlaying' && page !== 'GamePause') {
      if (this.handleLongSkillAnimations) {
        if (this.confirmGameOver()) {
          log(this.logs.gameOver);
          break;
        }
      } else {
        this.sleep(500);
        page = this.findPage(1, 2500);
        if (page !== 'GamePlaying' && page !== 'GamePause') {
          log(this.logs.gameOver);
          break;
        }
      }
    }
    this.runTimes++;
  }
}

Tsum.prototype.taskReceiveAllItems = function() {
  if (this.findPage() === 'GamePause')
    return;
  this.requestTsumMonitor();
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000);
  log(this.logs.receiveAllGifts);
  this.tap(Button.outReceive);
  this.sleep(3500);
  this.tap(Button.outReceiveAll);
  this.sleep(2500);
  this.fetchAllMails();
  this.sleep(2000);
  this.tap(Button.outReceiveClose);
  this.sleep(1500);
  this.tap(Button.outClose);
  this.goFriendPage();
  log(this.logs.allGiftsReceived);
}

Tsum.prototype.fetchAllMails = function() {
  var intlOkButton = Button.outReceiveOk;
  var jpOkButton = Button.outReceiveAllOkJP;

  var img = this.screenshot();

  if (this.isOnScreenshot(img, intlOkButton, 35)) {
    this.tap(intlOkButton);
  } else if (this.isOnScreenshot(img, jpOkButton, 35)) {
    // check important previous buttons before pressing OK
    if (this.keepRuby && this.isOnScreenshot(img, Button.outReceiveAllRubiesEnabledJP)) {
      this.tap(Button.outReceiveAllRubiesEnabledJP);
      this.sleep(500);
    }
    if (this.isOnScreenshot(img, Button.outReceiveAllHeartsDisabledJP)) {
      this.tap(Button.outReceiveAllHeartsDisabledJP);
      this.sleep(500);
    }
    this.tap(jpOkButton);
  } else {
    log("ERROR! No OK button found!");
    this.exitUnknownPage();
  }

  releaseImage(img);
}

Tsum.prototype.readRecord = function() {
  log(this.logs.readRecords);
  var recordDir = this.storagePath + '/' + Config.recordDir;
  var recordFile = recordDir + '/record.txt';
  var txt = readFile(recordFile);
  if (txt !== undefined && txt !== "") {
    this.record = JSON.parse(txt);
  }
  for (var filename in this.record) {
    if (filename !== "hearts_count") {
      this.recordImages[filename] = openImage(recordDir + '/' + filename);
    }
  }
}

Tsum.prototype.recognizeSender = function(img) {
  log(this.logs.recognizingHeartSender);
  var recordDir = this.storagePath + '/' + Config.recordDir;
  var from = this.toResizeXYs(Button.outReceiveNameFrom);
  var to = this.toResizeXYs(Button.outReceiveNameTo);
  var nameImg = cropImage(img, Math.floor(from.x), Math.floor(from.y), Math.floor(to.x - from.x), Math.floor(to.y - from.y));
  var score = 0;
  var existFilename = '';
  for(var key in this.recordImages) {
    if (this.recordImages[key] !== 0) {
      score = getIdentityScore(nameImg, this.recordImages[key]);
      if (score >= 0.98) {
        existFilename = key;
        log(this.logs.recognitionScore + " > 0.98", key, score);
        break;
      }
    }
  }
  // console.log("Score: " + score);
  if (existFilename === '') {
    var now = nowTime();
    var dayTime = Math.floor(now / (24 * 60 * 60 * 1000));
    // not found, new friend
    var filename = 'f_' + now + '.png';
    this.record[filename] = {
      receiveCounts: {},
      lastReceiveTime: now
    };
    this.record[filename].receiveCounts[dayTime] = 1;
    this.recordImages[filename] = nameImg;
    var path = recordDir + '/' + filename;
    log(this.logs.saveNewFriend, path);
    saveImage(nameImg, path);
    this.sleep(80);
    var check = execute("ls " + path);
    if (check.indexOf(filename) === -1) {
      log(this.logs.saveNewFriendAgain);
      saveImage(nameImg, path);
    }
  } else {
    releaseImage(nameImg);
  }
  return existFilename;
}

Tsum.prototype.countReceiveHeart = function(existFilename) {
  if (!existFilename) {
    return;
  }
  log(this.logs.calculatingHeartSender);
  var now = nowTime();
  var dayTime = Math.floor(now / (24 * 60 * 60 * 1000));
  // found
  if (this.record[existFilename].receiveCounts[dayTime] === undefined) {
    this.record[existFilename].receiveCounts[dayTime] = 0;
  }
  this.record[existFilename].receiveCounts[dayTime]++;
  this.record[existFilename].lastReceiveTime = now;
  log(this.logs.receiveHeartFromHeartSender, this.record[existFilename].receiveCounts[dayTime], this.logs.hearts);
}

Tsum.prototype.saveRecord = function() {
  log(this.logs.saveRecords);
  var recordFile = this.storagePath + '/' + Config.recordDir + '/record.txt';
  writeFile(recordFile, JSON.stringify(this.record));
}

Tsum.prototype.releaseRecord = function() {
  for(var filename in this.recordImages) {
    releaseImage(this.recordImages[filename]);
  }
  this.record = {};
  this.recordImages = {};
}

Tsum.prototype.clear = function() {
  var recordDir = getStoragePath() + '/' + Config.recordDir;
  execute('rm -r ' + recordDir);
}

Tsum.prototype.skipAd = function () {
  this.tap(Button.outReceiveOne);
  this.sleep(1000);
  // also gets called for skill and premium tickets, so check we really have an ad!!!
  if (this.matchesPage('ReceiveSkillTicket') || this.matchesPage('ReceivePremiumTicket')) {
    // mcs: I improved ad detection here because I don't get ad mails. So I cannot improve detection in list view
    log("Receive ticket");
    this.tap(Button.outReceiveOk);
  } else {
    log("Ignore Ad");
    if (Config.debugLogs) {
      var img = this.screenshot();
      saveImage(img, this.storagePath + "/tmp/" + this.runTimes + "-detectedAd.jpg");
      releaseImage(img);
    }
    this.sleep(4000);
    // delete ad
    this.tap({ x: 462, y: 1095});
    this.sleep(4000);
    this.tap({ x: 172, y: 1220});
    this.sleep(2000);
    this.tap({ x: 556, y: 1417});
  }
}

Tsum.prototype.taskReceiveOneItem = function() {
  if (this.findPage() === 'GamePause')
    return;
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000)
  this.tap(Button.outReceive);
  log(this.logs.receiveGiftsOneByOne);
  this.sleep(1000);

  var receivedCount = 0;
  var receiveCheckLimit = 1;

  var sender = undefined;
  var receiveTime = Date.now();
  var timeoutCounter = 0;
  var maxTimeoutCount = 100;
  var receivedHeartWithoutCoins = 0;
  while (this.isRunning && timeoutCounter < maxTimeoutCount) {
    this.requestTsumMonitor();
    var img = this.screenshot();
    var isItem = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 35);
    var isRuby = isSameColor(Button.outReceiveOneRuby.color, this.getColor(img, Button.outReceiveOneRuby), 35);
    var isNonItem = isSameColor(Button.outReceiveOne.color2, this.getColor(img, Button.outReceiveOne), 35);
    var isAd = isSameColor(Button.outReceiveOneAd.color, this.getColor(img, Button.outReceiveOneAd), 35);
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 35);
    var isOk2 = isSameColor(Button.outReceiveItemSetOk.color, this.getColor(img, Button.outReceiveItemSetOk), 35);
    var isTimeout = isSameColor(Button.outReceiveTimeout.color, this.getColor(img, Button.outReceiveTimeout), 35);
    var isHeartWithoutCoins = this.matchesPage('ReceiveHeartWithoutCoins');
    debug({
      isItem: isItem, isRuby: isRuby, isNonItem: isNonItem, isAd: isAd, isOk: isOk,
      isTimeout: isTimeout, timeoutCounter: timeoutCounter
    });
    releaseImage(img);
    if (isItem) {
      if (isAd) {
        debug("handle ad");
        this.skipAd();
        this.sleep(2000);
        this.lastVisitedPages.receiveOneItemIsAd = true;
        continue;
      }
      if (receivedHeartWithoutCoins > 2) {
        if (receivedCount <= 5 + receivedHeartWithoutCoins) {
          this.sleep(2000);
          debug("Should receive all now");
          this.taskReceiveAllItems();
          this.tap(Button.outReceive);
          this.sleep(1500);
        }
        debug("Closing");
        this.tap(Button.outClose);
        receivedHeartWithoutCoins = 0;
        this.tap(Button.outClose);
        this.goFriendPage();
        this.sleep(500);
        receivedCount = 0;
        sender = "";
        timeoutCounter = 0;
        log(this.logs.checkUnreceivedGift);
        this.sleep(500);
        this.tap(Button.outReceive);
        this.sleep(1500);
      } else if (!this.keepRuby || !isRuby) {
        this.lastVisitedPages.receiveOneItemReceiving = true;
        if (this.recordReceive) {
          img = this.screenshot();
          var isItem2 = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 30);
          if (isItem2) {
            this.tap(Button.outReceiveOne);
            sender = this.recognizeSender(img);
          }
          releaseImage(img);
        } else {
          sender = "";
        }
        this.tap(Button.outReceiveOne);
        this.sleep(200);
        timeoutCounter = 0;
      } else {
        isNonItem = true;
        receiveTime = 0;
      }
    } else if (isTimeout) {
      debug("isTimeout", "taskReceiveOneItem");
      log(this.logs.receiveGiftAgain);
      this.tap(Button.outReceiveOk);
      this.sleep(1000);
      timeoutCounter = 0;
    } else if (isOk || isOk2) {
      if (this.recordReceive && sender !== undefined && sender !== "") {
        this.countReceiveHeart(sender);
        this.saveRecord();
      }
      this.sleep(100);
      if (isOk) {
        debug("isOK", "taskReceiveOneItem")
        this.lastVisitedPages.receiveOneItemIsOK = true;
        this.tap(Button.outReceiveOk);
      } else {
        debug("isOK2", "taskReceiveOneItem")
        this.lastVisitedPages.receiveOneItemIsOK2 = true;
        this.tap(Button.outReceiveItemSetOk);
      }
      if (sender !== undefined) {
        this.record['hearts_count'].receivedCount++;
        receivedCount++;
      }
      sender = undefined;
      timeoutCounter = 0;
      if (this.claimAllWithoutCoins &&  isHeartWithoutCoins)
        receivedHeartWithoutCoins++;
    } else {
      debug("fetched all so far", "taskReceiveOneItem");
      this.tap(Button.outReceiveClose); // usual close button
    }
    this.sleep(200);

    if (!isNonItem) {
      receiveTime = Date.now();
    }

    if (Date.now() - receiveTime > 3000) {
      debug("took more than 3 seconds", "taskReceiveOneItem");
      this.tap(Button.outClose);
      this.goFriendPage();
      this.sleep(500);
      if (receivedCount === 0 || receiveCheckLimit >= this.receiveCheckLimit) {
        log(this.logs.receivingGiftsCompleted);
        break;
      } else {
        receiveCheckLimit++;
        receivedCount = 0;
        sender = "";
        timeoutCounter = 0;
        this.lastVisitedPages.receiveOneItemNextCheckCycle = true;
        log(this.logs.checkUnreceivedGift);
        this.sleep(500);
        this.tap(Button.outReceive);
        this.sleep(1500);
      }
    }
    timeoutCounter++;
    if (timeoutCounter % 10 === 0) {
      log("Timeout counter = " + timeoutCounter + " / 100");
    }
  }
  if (maxTimeoutCount <= timeoutCounter) {
    // we seem to be trapped, try to exit the trap
    log("I'm stuck! Trying exit...");
    this.exitUnknownPage();
    this.sleep(1000);
    if (this.findPage() === 'unknown') {
      // last attempt
      log("Still stuck! Last try...");
      this.exitUnknownPage();
      this.sleep(1000);
    }
  }
}

Tsum.prototype.friendPageGoToSelf = function() {
  debug("'Scrolling' to own player ranking");
  this.tap(Button.outHomePage, 100);
  this.sleep(2000);
  this.tap(Button.outFriendPage, 100);
  debug("'Scrolled' to own player ranking");
  this.sleep(2000);
}

Tsum.prototype.doHeartSending = function(startTime) {
  var retry = 0;
  var times = 0;
  var hfx = Button.outSendHeartFrom.x;
  var hfy = Button.outSendHeartFrom.y - 40; // hearts from y
  var hty = Button.outSendHeartTo.y + 30;   // hearts to y
  var finished;

  function scrollToNextHearts() {
    if (this.sendHeartsDownwards) {
      this.tapDown({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 500);
      this.tapUp({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 100);
    } else {
      this.tapDown({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y}, 50);
      this.moveTo({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartBottom.y}, 500);
      this.tapUp({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartBottom.y}, 100);
    }
  }

  while (this.isRunning && typeof finished === 'undefined') {
    this.requestTsumMonitor();
    times++;
    if (times % 15 === 0) {
      debug("Ensuring friends page");
      this.goFriendPage();
      this.lastVisitedPages.friends = true;
      debug("Ensured friends page");
    }
    var heartsPos = [];

    var img = this.screenshot();
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 40);
    for (var y = hfy; y <= hty; y += 8) {
      var isHs = isSameColor(Button.outSendHeart0.color, this.getColor(img, {x: hfx, y: y}), 40);
      if (isHs) {
        heartsPos.push({x: hfx, y: y, color: Button.outSendHeart0.color, color2: Button.outSendHeart0.color2});
        y += 140;
      }
    }
    debug("Found " + heartsPos.length + " hearts on current page");
    var isZero = true;
    var fx = Button.outFriendScoreFrom.x;
    var tx = Button.outFriendScoreTo.x;
    var sy = heartsPos.length === 0 ? Button.outFriendScoreFrom.y : (heartsPos[0].y + 35);
    for (var px = fx; px <= tx; px += 20) {
      isZero = isSameColor(Button.outFriendScoreFrom.color, this.getColor(img, {x: px, y: sy}), 40);
      if (!isZero) {
        break;
      }
    }
    var isNotEnd = isSameColor(Button.outSendHeartEnd2.color, this.getColor(img, {x: 225, y: 1056}), 40);
    var isEnd1 = isSameColor({r: 162, g: 84, b: 53}, this.getColor(img, {x: 225, y: 1056}), 40);
    var isEnd2 = isSameColor(Button.outSendHeartEnd.color, this.getColor(img, Button.outSendHeartEnd), 40);
    var isEnd3 = isSameColor(Button.outSendHeartEnd3.color, this.getColor(img, {x: 315, y: 1020}), 40);
    var isTop = isSameColor({r: 255, g: 227, b: 115}, this.getColor(img, {x: 200, y: 670}));
    releaseImage(img);

    var isEnd = !isNotEnd && isEnd1 && isEnd2 && isEnd3;
    debug('isNotEnd', isNotEnd, 'isEnd1', isEnd1, 'isEnd2', isEnd2, 'isEnd3', isEnd3, 'isEnd', isEnd, 'retry', retry, 'heartsLength', heartsPos.length, 'isZero', isZero);

    if (isOk && heartsPos.length === 0) {
      this.tap(Button.outReceiveOk);
    }

    if ((heartsPos.length === 0 && (isEnd || isTop)) || (!this.sentToZero && isZero && heartsPos.length !== 0)) {
      log("'isEnd'=" + isEnd + ", 'isZero'=" + isZero + ", 'isTop'=" + isTop);
      if (retry < 3) {
        scrollToNextHearts.call(this);
        retry++;
        log(this.logs.checkSendingHearts, retry);
        this.sleep(1000);
      } else {
        if (this.sendHeartMaxDuring !== 0) {
          this.sleep(1000);
          this.friendPageGoToSelf();
        }
        debug("Ending taskSendHearts");
        this.sendHeartsDownwards = !this.sendHeartsDownwards;
        // we're finished if we reached the top of the ranking and will send downwards again on the next run
        finished = this.sendHeartsDownwards;
      }
    } else {
      var rTimes = 0;
      for (var h in heartsPos) {
        debug("Try sending heart to", h);
        var success = this.sendHeart(heartsPos[h]);
        debug("Tried sending heart to", h, "with success=" + success);
        if (!success) {
          debug("Try again sending heart to", h);
          success = this.sendHeart(heartsPos[h]);
          debug("Tried again sending heart to", h, "with success=" + success);
        }
        if (success) {
          rTimes++;
          this.record['hearts_count'].sentCount++;
          this.lastVisitedPages.sendHeartSuccess = true;
        } else {
          debug("Try return to FriendPage");
          this.goFriendPage();
          this.sleep(1000);
          debug("Tried return to FriendPage");
        }
        if (!this.isRunning) {
          return true;  // don't let the surrounding job retry this immediately, so we pretend to be finished
        }
      }
      if (heartsPos.length !== 0 && rTimes === 0) {
        continue;
      }
      if (this.recordReceive && heartsPos.length !== 0) {
        this.saveRecord();
      }
      this.sleep(250);
      scrollToNextHearts.call(this);

      this.sleep(400);
      if (this.sendHeartMaxDuring !== 0) {
        if (Date.now() - startTime > this.sendHeartMaxDuring) {
          // we exceeded the maximum allowed sending time. leaving unfinished.
          log(this.logs.timeIsUp);
          finished = true;
        }
      }
      if (heartsPos.length === 0 && isEnd2) {
        this.sleep(700); // end bug
      }
    }
  }
  return finished;
}

Tsum.prototype.taskSendHearts = function() {
  debug("Started taskSendHearts");
  if (this.findPage() === 'GamePause')
    return;
  log(this.logs.friendsPage);
  this.goFriendPage();
  log(this.logs.startSendingHearts);
  this.sleep(1000);
  if (this.sendHeartMaxDuring === 0) {
    this.friendPageGoToSelf();
    tap(0, 0, 20); // Avoid overlap between zero score and pointer location
  }

  var startTime = Date.now();
  var finished;
  do {
    finished = this.doHeartSending(startTime);
    debug("Finished doHeartSending with result " + finished);
    this.sleep(2000);
    if (!finished) {
      this.friendPageGoToSelf();
      tap(0, 0, 20); // Avoid overlap between zero score and pointer location
    }
    this.sleep(2000);
  } while (!finished)
  debug("Finished taskSendHearts");
}

Tsum.prototype.taskAutoUnlockLevel = function() {
  if (this.findPage() === 'GamePause')
    return;
  var btn;
  var i;
  var img;
  var formerOrderButton = null;
  var orderButtons;
  var buttonCloseTsumCollectionOrder;
  var buttonOrderByLevelLock;
  log(this.logs.tsumsPage);
  this.goTsumsPage();
  this.lastVisitedPages.autoUnlockLevelTsum = true;
  log(this.logs.startUnlockLevel);

  // Switch order to "By Level Lock" and remember former selection
  this.tap(Button.outOpenTsumCollectionOrder);
  this.sleep(1000);
  img = this.screenshot();
  // detect old or new ordering view
  if (isSameColor(Button.outCloseTsumCollectionOrderNew, this.getColor(img, Button.outCloseTsumCollectionOrderNew))) {
    orderButtons = [
      Button.outTsumCollectionOrderByReleaseDateNew,
      Button.outTsumCollectionOrderByLevelLockNew,
      Button.outTsumCollectionOrderBySkillNew,
      Button.outTsumCollectionOrderFavoritesNew,
      Button.outTsumCollectionOrderByEntryDateNew
    ];
    buttonCloseTsumCollectionOrder = Button.outCloseTsumCollectionOrderNew;
    buttonOrderByLevelLock = Button.outTsumCollectionOrderByLevelLockNew;
  } else {
    orderButtons = [
      Button.outTsumCollectionOrderByReleaseDateOld,
      Button.outTsumCollectionOrderByLevelLockOld,
      Button.outTsumCollectionOrderBySkillOld,
      Button.outTsumCollectionOrderFavoritesOld
    ];
    buttonCloseTsumCollectionOrder = Button.outCloseTsumCollectionOrderOld;
    buttonOrderByLevelLock = Button.outTsumCollectionOrderByLevelLockOld;
  }
  for (i = 0; i < orderButtons.length; i++) {
    btn = orderButtons[i];
    if (isSameColor(btn, this.getColor(img, btn))) {
      formerOrderButton = btn;
      debug("Found active button: " + btn.name);
      break;
    }
  }
  releaseImage(img);

  this.tap(buttonOrderByLevelLock);
  this.sleep();
  this.tap(buttonCloseTsumCollectionOrder);
  this.sleep(1000);

  // Start looking for locks from first entries
  this.tap({x: 1, y: 1892});  // jump to first Tsum entries
  this.sleep(3000);

  // check all
  do {
    this.requestTsumMonitor();
    var allLocked = true;
    var lockIcons = Page.TsumsPage.lockIcons;
    img = this.screenshot();
    for (i = 0; i < lockIcons.length; i++) {
      var lockIcon = lockIcons[i];
      debug("Checking for lock on i=" + i);
      var realColor = this.getColor(img, lockIcon);
      debug("For i=" + i + " I found color " + JSON.stringify(realColor));
      if (isSameColor(lockIcon, realColor)) {
        debug("Unlocking i=" + i);
        this.lastVisitedPages.autoUnlockLevelUnlock = true;
        var tsumButton = {x: lockIcon.x, y: lockIcon.y - 100};
        this.tap(tsumButton);
        this.sleep(1000);
        this.tap(Button.outTsumCollectionDoUnlock);
        this.sleep(1000);
        this.tap({x: 814, y: 1071, r: 247, g: 174, b: 8}); // OK button
        this.sleep(5000);
        this.tap({x: 600, y: 600}); // just tap anywhere to close the confirmation dialog
        this.sleep(1000);
        debug("Unlocked i=" + i);
      } else {
        debug("No lock found for i=" + i);
        allLocked = false;
        break;
      }
    }
    releaseImage(img);

    // scroll to next page if all Tsums were locked
    if (allLocked) {
      debug("Clicking scroll button to move to next page")
      this.tap({x: 1030, y: 1193, r: 212, g: 239, b: 246}); // arrow, scroll right to next page
      this.sleep(3000);
    }

    // Progress until no more locks exist
  } while (this.isRunning && allLocked)



  // Reset order to former selection
  if (formerOrderButton != null && formerOrderButton !== buttonOrderByLevelLock) {
    this.tap(Button.outOpenTsumCollectionOrder);
    this.sleep(1000);
    this.tap(formerOrderButton);
    this.sleep();
    this.tap(buttonCloseTsumCollectionOrder);
    this.sleep(1000);
  }

  log(this.logs.endUnlockLevel);
}

Tsum.prototype.taskAutoBuyBoxes = function() {
  if (this.findPage() === 'GamePause')
    return;
  log("Starting taskAutoBuyBoxes");
  if (this.autobuyBoxes === 0) {
    log("Nothing to do", "taskAutoBuyBoxes");
    return;
  }
  var storeHasOpened = this.goTsumTsumStorePage();
  var lastPage = this.findPageObject(1, 200);
  if (!storeHasOpened) {
    log("Leaving AutoBuy Boxes.");
    this.autobuyBoxes = 0;
    return;
  }
  this.lastVisitedPages.autoBuyBoxesStore = true;
  log("Start buying ", this.autobuyBoxes, "boxes - taskAutoBuyBoxes");
  var countUnknownPages = 0, countSamePage = 0;
  while (this.isRunning && storeHasOpened && this.autobuyBoxes > 0 && countSamePage < 60) {
    this.requestTsumMonitor();
    var page = this.findPageObject(1, 200);
    if (page != null) {
      countUnknownPages = 0;
      this.lastVisitedPages['autoBuyBoxes' + page.name] = true;
      if (page.name === "OutOfMedals") {
        log("Out Of Medals");
        this.autobuyBoxes = 0;
        break;
      }
      if (page.name === "TsumTsumStorePage") {
        if (page !== lastPage) {
          this.autobuyBoxes--;
          log("Bought box.", this.autobuyBoxes, "left");
        }

        var img = this.screenshot();
        var nextColor = this.getColor(img, page.next);
        releaseImage(img);
        if (this.autobuyBoxes === 0) {
          log("Buying finished");
          break;
        }
        if (!isSameColor(page.next, nextColor, 50)) {
          // wait and test again
          this.sleep(500);
          page = this.findPageObject(1, 200);
          if (page.name === "TsumTsumStorePage" && !isSameColor(page.next, nextColor, 50)) {
            log("Finish with", this.autobuyBoxes, "boxes zu buy due to empty box");
            break;
          }
        }
      }
      this.tap(page.next);
      if (page === lastPage) {
        countSamePage++;
        debug("countSamePage =", countSamePage);
        if (countSamePage % 10 === 0) {
          debug("I'm stuck?!");
          this.exitUnknownPage();
        }
      } else {
        countSamePage = 0;
      }
      if (countSamePage === 30) {
        // we didn't change the page for at least 15 seconds (30 * 0.500) so try escaping from wherever we are
        log("I'm stuck on buying!");
        this.exitUnknownPage();
        countSamePage = 0;
        this.autobuyBoxes = 0;
      } else if (page.name === Page.Received.name
          || page.name === Page.FriendPage.name
          || page.name === Page.TsumsPage.name) {
        log("Collected all Tsums.");
        this.autobuyBoxes = 0;
      } else if (page.name === Page.MailBox.name) {   // matches when "Buy coins for rubies" appears
        // test again, sometimes falsely matched while page transition
        this.sleep(500);
        page = this.findPageObject(1, 200);
        if (page.name === Page.MailBox.name) {
          log("Not enough coins.");
          this.autobuyBoxes = 0;
        }
      }
      lastPage = page;
    } else {
      countUnknownPages++;
      if (countUnknownPages === 20) {
        // sometimes the final confirmation after having bought doesn't get clicked, so let's use this method
        log("Stuck?");
        this.exitUnknownPage();
      } else if (countUnknownPages > 30) {
        // this probably didn't work on 10, but let's try it again as we don't have something better here
        log("Stuck! Exit...");
        this.exitUnknownPage();
        countUnknownPages = 0;
        this.autobuyBoxes = 0;
      }
    }
    this.sleep(500);
  }
  log("Finished taskAutoBuyBoxes");
}

Tsum.prototype.taskRequestTsumMonitor = function() {
  this.requestTsumMonitor(true);
}

Tsum.prototype.requestTsumMonitor = function(force) {
  var url = this.tsumMonitorUrl;
  if (url.length === 0)
    return;
  if (this.nextMonitorExecution <= Date.now() && Object.keys(this.lastVisitedPages).length >= 2) {
    log("TsumMonitor - GET", url);
    var response = httpClient('GET', url, '', {});
    log("TsumMonitor - Response:", response.trim());
    this.nextMonitorExecution = Date.now() + 60 * 1000;
    this.lastVisitedPages = {};
  } else {
    debug("Skipping TsumMonitor call");
  }
}

Tsum.prototype.taskTsumAppRestart = function () {
    log("Preparing restarting TsumApp");
    if (!this.isAppOn()) {
        this.startApp();
    }
    this.goFriendPage();

    log("Restarting TsumApp");
    var packageName = getPackageName(ts.isJP);
    execute("am force-stop " + packageName);

    ts.sleep(10000);
    if (!this.isAppOn()) {
        this.startApp();
    }
    this.goFriendPage();
    log("TsumTsumApp restarted");
}

Tsum.prototype.sendHeart = function(btn) {
  var unknownCount = 0;
  var isGift = false;
  var isSent = false;
  // log("sendHeart");
  while (this.isRunning) {
    var page = this.findPage(1, 300);
    if (page === "FriendPage") {
      // log("sendHeart A", Date.now() / 1000);
      var img = this.screenshot();
      var isSendBtn = isSameColor(btn.color, this.getColor(img, btn), 40);
      var isSentBtn = isSameColor(btn.color2, this.getColor(img, btn), 40);
      releaseImage(img);
      if ((isSendBtn || !isSentBtn) && !isGift && !isSent) {
        debug("sendHeart A-A", Date.now() / 1000);
        this.tap(btn);
      } else {
        debug("sendHeart A-B", Date.now() / 1000);
        unknownCount += 1;
      }
    } else if (page === "GiftHeart") {
      this.lastVisitedPages.sendHeartGiftHeart = true;
      this.tap(Button.outReceiveOk);
      isGift = true;
      debug("sendHeart B", Date.now() / 1000);
    } else if (page === "Received") {
      this.lastVisitedPages.sendHeartReceived = true;
      this.sleep(100);
      this.tap(Button.outSendHeartClose);
      debug("sendHeart C", Date.now() / 1000);
      if (isGift) {
        isSent = true;
        debug("sendHeart C-C", Date.now() / 1000);
        this.sleep(100);
        return true;
      }
    } else if (page === "FriendInfo") {
      this.tap(Page.FriendInfo.back);
    } else if (page === "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
    } else {
      unknownCount++;
    }
    if (unknownCount >= 15) {
      debug(this.logs.UnknownState);
      return false;
    }
    // this.sleep(150);
  }
}

Tsum.prototype.sleep = function(t) {
  if (typeof t !== 'number') {
    t = 1000;
  }
  var waitTime = t;
  while (this.isRunning && waitTime > 0) {
    if (waitTime <= 500) {
      sleep(waitTime);
      break;
    } else {
      sleep(500);
      waitTime -= 500;
    }
  }
}

Tsum.prototype.isOnScreenshot = function(img, pageObject, colorDiff) {
  return pageObject && pageObject.color && isSameColor(pageObject.color, this.getColor(img, pageObject), colorDiff)
}


function start(settings) {
  ts = new Tsum(settings['jpVersion'], settings['specialScreenRatio'], settings['langTaiwan'] ? LogsTW : Logs);
  ts.settings = settings
  log(ts.logs.start);
  ts.debug = settings['debugGame'];
  if (settings['bonus5to4']) {
    ts.tsumCount = 4;
  }
  ts.autoLaunch = settings['autoLaunchApp'];
  ts.scoreItem = settings['bonusScore'];
  ts.coinItem = settings['bonusCoin'];
  ts.expItem = settings['bonusExp'];
  ts.timeItem = settings['bonusTime'];
  ts.bubbleItem = settings['bonusBubble'];
  ts.comboItem = settings['bonusCombo'];
  ts.isPause = settings['pauseWhenCalc'];
  ts.receiveOneItem = settings['receiveHeartsOneByOne'];
  ts.receiveSecondItem = settings['receiveHeartsSkipFirst'] || false;
  ts.recordReceive = settings['recordSender'];
  ts.sentToZero = settings['sendHeartsToZeroScore'];
  ts.receiveCheckLimit = settings['mailOpenMax'];
  ts.clearBubbles = settings['clearBubbles'];
  ts.handleLongSkillAnimations = settings['handleLongSkillAnimations'] || false;
  ts.skillInterval = settings['skillWaitingTime'] * 1000;
  ts.skillLevel = settings['skillLevel'];
  ts.skillType = settings['skillType'];
  ts.skillAutoTap = !!settings['skillAutoTap'];
  ts.unlockLevelHoursWait = settings["unlockLevelHoursWait"];
  ts.sendHearts = settings['sendHeartsAuto'];
  ts.showHeartLog = true;
  ts.keepRuby = settings['receiveHeartsSkipRuby'];
  ts.sendHeartMaxDuring = settings['sendHeartsMaxRuntime'] * 60 * 1000;
  ts.useFan = settings['useFan'];
  if (settings['recordSenderEnlarge']) {
    ts.resizeRatio = 1;
  }
  var yOffset = ts.receiveSecondItem ? 202 : 0;
  Button.outReceiveOne.y = Button.outReceiveOneBase.y + yOffset;
  Button.outReceiveOneRuby.y = Button.outReceiveOneRubyBase.y + yOffset;
  Button.outReceiveOneAd.y = Button.outReceiveOneAdBase.y + yOffset;
  Button.outReceiveNameFrom.y = Button.outReceiveNameFromBase.y + yOffset;
  Button.outReceiveNameTo.y = Button.outReceiveNameToBase.y + yOffset;

  if (ts.recordReceive) {
    ts.readRecord();
  }
  if (ts.record['hearts_count'] === undefined) {
    ts.record['hearts_count'] = {
      receivedCount: 0,
      sentCount: 0
    };
  }

  Config.debugLogs = settings['debugLogs'];
  ts.autobuyBoxes = settings['autobuyBoxes'];
  ts.noSkillLastFeverSec = settings['noSkillLastFeverSec'];
  ts.claimAllWithoutCoins = settings['claimAllWithoutCoins'];
  ts.tsumMonitorUrl = settings['tsumMonitorUrl'] || "";
  ts.tsumAppRestartFrequency = settings['tsumAppRestartFrequency'];

  if (!checkFunction(TaskController)) {
    console.log("File lose...");
    return;
  }

  gTaskController = new TaskController();
  if (ts.tsumMonitorUrl.length > 0) {
    gTaskController.newTask('requestTsumMonitor', ts.taskRequestTsumMonitor.bind(ts), 30 * 1000, 0);
  }
  gTaskController.newTask('taskAutoBuyBoxes', ts.taskAutoBuyBoxes.bind(ts), 60 * 1000, 0);
  if (settings['receiveHeartsOneByOne']) {
    gTaskController.newTask('receiveOneItem', ts.taskReceiveOneItem.bind(ts), settings['mailMinWait'] * 60 * 1000, 0);
  }
  if (settings['receiveAllHearts']) {
    gTaskController.newTask('receiveItems', ts.taskReceiveAllItems.bind(ts), settings['receiveAllHeartsMinWait'] * 60 * 1000, 0);
  }
  if (settings['sendHeartsAuto']) {
    gTaskController.newTask('sendHearts', ts.taskSendHearts.bind(ts), settings['sendHeartsMinWait'] * 60 * 1000, 0);
  }
  if (settings['autoLaunchApp'] && settings['tsumAppRestartFrequency'] > 0) {
    gTaskController.newTask('taskTsumAppRestart', ts.taskTsumAppRestart.bind(ts), settings['tsumAppRestartFrequency'] * 60 * 60 * 1000, 0, true);
  }
  if (checkFunction(outRange)) {
    if (settings['autoPlayGame']) {
      if (settings['unlockLevelHoursWait'] > 0) {
        gTaskController.newTask('autoUnlockLevel', ts.taskAutoUnlockLevel.bind(ts), settings['unlockLevelHoursWait'] * 60 * 60 * 1000, 0);
      }
      gTaskController.newTask('taskPlayGameQuick', ts.taskPlayGameQuick.bind(ts), 3 * 1000, 0);
    }
  }
  sleep(500);
  gTaskController.start();
  log(ts.logs.TaskControllerStop);
}

function stop() {
  if (ts != null) {
    log(ts.logs.stop);
    sleep(500);
    ts.isRunning = false;
    sleep(2000);
    // loop stop here...
    if (ts.recordReceive) {
      ts.releaseRecord();
    }
  }
  if (gTaskController !== undefined) gTaskController.removeAllTasks();
  if (gTaskController !== undefined) gTaskController.stop();
  ts = undefined;
}

function genRecordTable() {
  console.log("Generate Record...");
  var recordFile = getStoragePath() + "/tsum_record/record.txt";
  var txt = readFile(recordFile);
  var record = {};
  if (txt !== undefined && txt !== "") {
    try {
      record = JSON.parse(txt);
    } catch(e) {
      return "Can not parse record.txt " + JSON.stringify(e);
    }
  } else {
    return "Can not read record.txt";
  }

  // enhance records with total and average hearts per filename
  var dayMapCount = {};
  var renderRecords = [];
  for (var filename in record) {
    (function (filename) {
      if (filename !== "hearts_count") {
        var totalDay = 0;
        var totalCount = 0;
        var recordElement = record[filename];
        for (var dayTime in recordElement.receiveCounts) {
          var dayCount = recordElement.receiveCounts[dayTime];

          if (dayMapCount[+dayTime] === undefined) {
            dayMapCount[+dayTime] = 0;
          }
          dayMapCount[+dayTime] += dayCount;

          totalDay++;
          totalCount += dayCount;
        }
        var avg = 0;
        if (totalDay !== 0) {
          avg = (totalCount / totalDay).toFixed(1);
        }
        recordElement.all = totalCount;
        recordElement.avg = avg;
        recordElement.filename = filename;
        renderRecords.push(recordElement);
      }
    })(filename, dayMapCount, renderRecords);
  }

  // sort records descending by total
  renderRecords.sort(function (a, b) {
    return b.all - a.all;
  });

  // create sorted dayTime array
  var dayTimesSorted = [];
  for (var dayTime in dayMapCount) {
    if (dayMapCount.hasOwnProperty(dayTime)) {
      dayTimesSorted.push(dayTime);
    }
  }
  dayTimesSorted.sort(function (a, b) {
    return a - b;
  });

  // render records
  var html = "<html><body><style>table { border-collapse: collapse; } th, td { border: solid 1px black; text-align: right; padding: 4px 10px 4px 10px; } .records td:nth-child(2n+5), .records th:nth-child(2n+5) { background-color: lightgray; } .all { background-color: darkseagreen; } .avg { background-color: lightsteelblue; border-right-width: 5px; }</style>";
  html += "<table class='records'>";
  html += "<tr><th>UserImage</th><th class='all'>All</th><th class='avg'>Avg</th>";
  for (var j = 0; j < dayTimesSorted.length ; j++) {
    dayTime = dayTimesSorted[j];
    html += '<th>' + getDayTimeString(new Date(dayTime * (24 * 60 * 60 * 1000))) + '</th>';
  }
  html += "</tr>";
  for (var i = 0; i < renderRecords.length; i += 1) {
    var renderRecord = renderRecords[i];
    filename = renderRecord.filename;
    html += "<tr>";
    // user image
    var filePath = getStoragePath()+"/tsum_record/" + filename;
    var tmpImg = openImage(filePath);
    var base64 = getBase64FromImage(tmpImg);
    releaseImage(tmpImg);
    html += "<td><img src='data:image/png;base64," + base64 + "' /></td>";

    var totalDay = 0;
    var totalCount = 0;
    var tmpHtml = "";
    for (j = 0; j < dayTimesSorted.length ; j++) {
      dayTime = dayTimesSorted[j];
      var dayCount = parseInt(renderRecord.receiveCounts[dayTime]) || 0;
      tmpHtml += '<td>' + dayCount + '</td>';

      totalDay++;
      totalCount += dayCount;
    }
    var avg = 0;
    if (totalDay !== 0) {
      avg = (totalCount/totalDay).toFixed(1);
    }
    html += "<td class='all'>" + totalCount + "</td>";
    html += "<td class='avg'>" + avg + "</td>";
    html += tmpHtml;
    html += "</tr>";
  }
  html += "</table>";
  html += "<br /> <br />";
  // day count
  html += "<table>";
  html += "<tr><th>Date</th><th>Hearts</th></tr>";
  for (j = 0; j < dayTimesSorted.length ; j++) {
    dayTime = dayTimesSorted[j];
    var date = new Date(+dayTime * (24 * 60 * 60 * 1000));
    html += "<tr>";
    html += "<td>" + getDayTimeString(date) + "</td>";
    html += "<td>" + dayMapCount[dayTime] + "</td>";
    html += "</tr>";
  }
  html += "</table>";
  html += "</body></html>";
  var recordName = getRecordFilename();
  var oPath = getStoragePath() + "/tsum_record/" + recordName;
  writeFile(oPath, html);
  return "Download: " + getStoragePath()+"/tsum_record to PC" + "<br />Open: " + recordName;
}

function getDayTimeString(d) {
  return (d.getMonth()+1) + '/' + d.getDate();
}

function getRecordFilename() {
  var d = new Date();
  return 'recordTable_' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '.html';
}

// input: rgb in [0,255], out: h in [0,360) and s,v in [0,100]
function rgb2hsv(rgb) {
  var r = rgb.r / 255;
  var g = rgb.g / 255;
  var b = rgb.b / 255;
  var v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  var h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return {h: 60 * (h < 0 ? h + 6 : h), s: Math.round(v && c / v * 100), v: Math.round(v * 100)};
}
