// ============================TSUM=============================== //

var Config: TsumConfig = {
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
var PlayAreaTopY = 465;

// --- Tiara Minnie+ ------------------------------------------------------
//
// Her skill shows Minnie with a thought bubble containing one present, then a
// screen of presents to pick the matching one from. The bubble appears once per
// activation and is not shown again, so an activation is exactly one pick. A
// correct one adds a present to the next activation's screen (2 up to 6); a
// wrong one resets it to 2 -- which is why every layout has to be handled, but
// also why the count never needs to be tracked between activations.
//
// The presents always land on the same centres for a given count, so there is
// nothing to search for: crop each known centre, crop the bubble, and compare
// the pictures directly. Centres are logical 1080x1920 and were read off the
// reference frames in ../com.r2studio.TsumThi/doc/screenshots/TiaraMinnie/
// (2..6.png; blob centres agreed within ~20px).
var TiaraLayouts: { [n: number]: Point[] } = {
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
var TiaraSlotSide: { [n: number]: number } = {
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
  // Sample spacing inside the box, leaving 162 samples.
  //
  // Was briefly 40 (64 samples). The gap between a bubble frame and a present
  // frame is wide enough for that, but the fraction is also read *during* the
  // bubble's fade, where the true value passes through the threshold: at 64
  // samples the standard error there is 0.06, so a mid-fade reading can call
  // the cloud gone early, and matching then starts on the hand-over frames.
  // The sample count is not really buying precision at the extremes, it is
  // buying it in the middle.
  cloudStep: 24,
  cloudMinFrac: 0.25,
  // This test is polled in a loop, and it is only asking whether a big pale
  // blob is present, so it gets its own small capture with no blur. At the
  // matching resolution each check cost a 420x420 grab plus a 7px blur, which
  // made the poll slower than the interval it was polling on.
  //
  // This is the resolution the whole play square would be captured at; only
  // cloudBox is actually grabbed, scaled to match. Nothing outside the box is
  // ever read, so capturing the rest of the board was pure overhead.
  cloudCaptureSize: 120,

  // Comparison grid. Each crop is reduced to grid x grid cells; cells are
  // compared only where the template says the present is, which drops the board
  // background (dark tsums) and the bubble background (white cloud) alike.
  // 10 through 20 all scored the same offline, so this is the cheap end of the
  // range that still held up: 12x12 cells over 20 candidates is 2880 reads.
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
  // settleMaxDiff is the one number here not pinned down by measurement -- there
  // were no consecutive-frame pairs to calibrate falling tsums against -- so it
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
  // game time, which is what these two are sized against.
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
  // late the poll noticed the cloud go) + this. Trading one against the other
  // by their averages is what caused wrong taps -- pollMs 100->200 raises the
  // mean lag by 50ms but the *minimum* stays 0, so taking 100ms off this lead
  // moved the earliest possible start from 500ms to 400ms after the bubble
  // cleared. It is the earliest start that decides whether the matcher can see
  // a present still sliding into place, and a present caught in transit can sit
  // convincingly on a centre belonging to another layout.
  choiceLeadMs: 500,
  choiceWaitMs: 6000,
  pollMs: 100,
  // The matching loop keeps its own interval: it is not waiting on a known
  // animation but on the presents becoming readable, and it leaves the moment
  // two scans agree, so a slower cadence here would just delay the tap.
  matchPollMs: 100,
  agreeScans: 2,
  pickTaps: 2,
  pickTapDuring: 60,
  pickTapGapMs: 50
};

// --- Game bubbles -------------------------------------------------------
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
var Button: ButtonMap = {
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

var Page: PageMap = {

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
      {x: 27,   y: 901, r: 197, g: 243, b: 254, match: true, threshold: 80},   // light header bar, far left (sort-independent)
      {x: 436,  y: 902, r: 247, g: 247, b: 247, match: true, threshold: 80},   // white header gap between "Collection" and the dropdowns (sort-independent)
      {x: 713,  y: 900, r: 247, g: 187, b: 16,  match: true, threshold: 80},   // "All Tsums" (left) dropdown gold fill
      {x: 1030, y: 900, r: 249, g: 190, b: 19,  match: true, threshold: 80}    // right (sort) dropdown gold beside the arrow -- right-anchored, survives every sort label
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
  // Root-detection warning (a native Android AlertDialog) as it looks on a
  // handful of emulators. All variants share the page name so the navigation
  // loops handle them the same way: hand the screen to dismissSystemDialog(),
  // which finds the real "PERMIT" button in device pixels. The back/next
  // coordinates below belong to one specific emulator and dpi each, so they are
  // only a last-resort hint -- see dialogs.ts for why they cannot be trusted.
  // The matched variant's key is still logged, so detection stays diagnosable.
  RootDetectionLdp1080p480dpiEn: {
    name: 'RootDetection',
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
    name: 'RootDetection',
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
    name: 'RootDetection',
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
    name: 'RootDetection',
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
    name: 'RootDetection',
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
    name: 'RootDetection',
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
    name: 'RootDetection',
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
  // White AlertDialog variant on 1080x1920 portrait: a white popup box over a
  // dimmed grey background, with blue "REFUSE" / "PERMIT" link-style buttons
  // bottom-right.
  // Only the panel/scrim probes are kept: probes on the button text itself never
  // matched, because findPageObject reads a screenshot downscaled to 360px wide
  // and JPEG-compressed, which leaves nothing of a thin blue glyph at a guessed
  // position. The panel/scrim shape is coarse on purpose -- the tap that follows
  // is located and verified by dismissSystemDialog(), not by these coordinates.
  RootDetection1080pEn: {
    name: 'RootDetection',
    colors: [
      {x: 950, y:  868, r: 255, g: 255, b: 255, match: true,  threshold: 25}, // white dialog interior (top-right)
      {x: 540, y: 1100, r: 255, g: 255, b: 255, match: true,  threshold: 25}, // white dialog interior (below buttons)
      {x: 540, y:  300, r: 255, g: 255, b: 255, match: false, threshold: 25}, // dimmed grey overlay above dialog
      {x: 540, y: 1500, r: 255, g: 255, b: 255, match: false, threshold: 25}  // dimmed grey overlay below dialog
    ],
    back: {x: 932, y: 1059}, // estimated PERMIT position, hint only
    next: {x: 932, y: 1059},
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


