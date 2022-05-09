config = {
  sleep: 240,
  sleepAnimate: 800,
  sleepWhenDoubleLoginInMinutes: 30,

  account: 'default_xrobotmon_account@gmail.com',
  password: '',
  materialsTarget: 1200,
  goodsTarget: 260,
  productSafetyStock: 10,
  autoCollectMailIntervalInMins: 120,
  autoCollectFountainIntervalInMins: 40,
  autoCollectTrainIntervalInMins: 20,
  autoSendHotAirBallonIntervalInMins: 40,
  isHotAirBallonGotoEp3: false,
  ballonKeepCurrentDestination: false,
  autoCollectDailyReward: true,
  autoFulfillWishesIntervalInMins: 10,
  alwaysFulfillWishes: false,
  wishingTreeSafetyStock: 20,
  wishingTreeMaxFillingMins: 8,
  wishingTreeRefreshGoldenWishes: true,
  wishingTreeForceFulfillGoldWishes: false,
  autoPvPIntervalInMins: 0,
  autoPvPTargetScoreLimit: 600000,
  autoPvPPurchaseAncientCookie: false,
  worksBeforeCollectCandy: 40,
  helpTapGreenCheck: true,
  autoCollectTropicalIslandsIntervalInMins: 40,
  autoGuildAllianceBattle: false,
  autoGuildClaimNewLand: false,
  autoGuildBattleDragon: false,
  autoHandleBountiesIntervalInMins: 0,
  autoLabResearch: false,
  autoResearchKingdom: false,
  autoResearchCookies: false,
  autoLabUseAuroraMaterial: false,
  autoHandleTradeHabor: false,
  autoBuyCaramelStuff: false,
  autoBuySeaFairy: false,
  autoBuyGuildRelic: false,
  axeStockTo400: false,
  autoSuperMayhemIntervalInMins: 0,
  autoSuperMayhemTargetScoreLimit: 500000,
  buildTowardsTheLeft: true,
  isTestAccount: false,

  jobFailedBeforeGetCandy: 3,
  jobFailedCount: 0,
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
  lastAutoPvP: 0,
  lastAutoSuperMayhem: 0,
  battleMaxLoops: 3,
  lastCollectTropicalIsland: 0,
  lastAutoGuildBattle: 0,
  lastAutoHandleBounties: 0,
  lastLabResearch: 0,
  lastHandleTradeHabor: 0,
  lastTryResolveGreenChecks: 0,
  lastFreezeCheckScreenShot: null,
  lastFreezeCheckScreenShotTime: Date.now(),
  run: true,
  isXR: true,
  findProductionTimes: 4,
  wishRefreshThreashold: 5,
  searchHouseCount: 0,
  bountyGotoNextLevel: true,
  keepProduceUntilWoodEnough: true,
  loginRetryMaxTimes: 5,
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

factoryType = [
  'wood',
  'bean',
  'sugar',
  'tool',
  'powder',
  'bean_2',
  'wood_2',
  'powder_2',
  'berry',
  'berry_2',
  'poweder_3',
  'berry_3',
];

pageWoodFarm = [
  { x: 596, y: 118, r: 123, g: 207, b: 8 },
  { x: 527, y: 86, r: 140, g: 81, b: 57 },
  { x: 520, y: 91, r: 249, g: 192, b: 139 },
  { x: 427, y: 79, r: 140, g: 81, b: 57 },
];

pageBeanFarm = [
  { x: 602, y: 122, r: 123, g: 207, b: 8 },
  { x: 527, y: 83, r: 0, g: 204, b: 223 },
  { x: 525, y: 88, r: 1, g: 252, b: 248 },
  { x: 414, y: 82, r: 0, g: 207, b: 220 },
];

pageSugarFarm = [
  { x: 600, y: 118, r: 123, g: 207, b: 8 },
  { x: 531, y: 92, r: 135, g: 151, b: 200 },
  { x: 419, y: 71, r: 244, g: 250, b: 253 },
  { x: 411, y: 89, r: 239, g: 240, b: 249 },
];

pagePowderFarm = [
  { x: 596, y: 120, r: 123, g: 207, b: 8 },
  { x: 523, y: 87, r: 231, g: 157, b: 74 },
  { x: 435, y: 90, r: 156, g: 117, b: 49 },
  { x: 423, y: 83, r: 239, g: 162, b: 82 },
];

pageBarryFarm = [
  { x: 597, y: 118, r: 123, g: 207, b: 8 },
  { x: 527, y: 90, r: 198, g: 36, b: 41 },
  { x: 428, y: 76, r: 28, g: 117, b: 16 },
  { x: 413, y: 82, r: 200, g: 26, b: 31 },
];

pageMilkFarm = [
  { x: 597, y: 118, r: 123, g: 207, b: 8 },
  { x: 521, y: 79, r: 214, g: 138, b: 99 },
  { x: 526, y: 90, r: 255, g: 255, b: 239 },
  { x: 425, y: 85, r: 255, g: 255, b: 242 },
];

pageCottomFarm = [
  { x: 596, y: 120, r: 123, g: 207, b: 8 },
  { x: 528, y: 87, r: 254, g: 231, b: 251 },
  { x: 428, y: 92, r: 255, g: 241, b: 255 },
];

var pageInKingdomVillage = [
  { x: 39, y: 313, r: 255, g: 101, b: 156 },
  { x: 24, y: 321, r: 255, g: 255, b: 255 },
  { x: 55, y: 327, r: 255, g: 227, b: 247 },
  { x: 377, y: 321, r: 121, g: 52, b: 52 },
  { x: 418, y: 321, r: 132, g: 16, b: 8 },
  { x: 466, y: 318, r: 231, g: 167, b: 85 },
];

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
pageChooseLoginMethod = [
  { x: 139, y: 233, r: 255, g: 95, b: 0 },
  { x: 165, y: 197, r: 0, g: 0, b: 0 },
  { x: 148, y: 153, r: 244, g: 154, b: 25 },
  { x: 347, y: 166, r: 177, g: 204, b: 58 },
  { x: 356, y: 196, r: 59, g: 89, b: 152 },
  { x: 126, y: 234, r: 255, g: 255, b: 255 },
];
// Smaller icons (Android 7), not updated for 5 options
pageChooseLoginMethod2 = [
  { x: 251, y: 245, r: 255, g: 95, b: 0 },
  // { x: 373, y: 243, r: 255, g: 255, b: 255 },
  // { x: 247, y: 203, r: 66, g: 103, b: 178 },
  // { x: 252, y: 205, r: 255, g: 255, b: 255 },
  // { x: 250, y: 166, r: 0, g: 1, b: 0 },
  // { x: 249, y: 123, r: 234, g: 67, b: 53 },
  // { x: 250, y: 127, r: 255, g: 255, b: 255 },
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

var pageInFountain = [
  { x: 505, y: 305, r: 121, g: 207, b: 12 },
  { x: 569, y: 310, r: 219, g: 207, b: 199 },
  { x: 368, y: 23, r: 60, g: 70, b: 105 },
  { x: 525, y: 68, r: 142, g: 79, b: 71 },
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

var pageInTropicalIsland = [
  { x: 253, y: 332, r: 192, g: 126, b: 68 },
  { x: 275, y: 319, r: 207, g: 139, b: 88 },
];

var pageInGacha = [
  { x: 627, y: 19, r: 57, g: 166, b: 231 },
  { x: 31, y: 10, r: 148, g: 81, b: 66 },
  { x: 5, y: 6, r: 17, g: 21, b: 29 },
  { x: 50, y: 10, r: 17, g: 21, b: 29 },
  { x: 417, y: 20, r: 255, g: 207, b: 0 },
  { x: 526, y: 18, r: 0, g: 130, b: 255 },
];

var pageInTowerOfRecords = [
  { x: 13, y: 33, r: 229, g: 229, b: 229 },
  { x: 92, y: 26, r: 114, g: 112, b: 113 },
  { x: 147, y: 34, r: 255, g: 223, b: 166 },
  { x: 164, y: 25, r: 44, g: 21, b: 16 },
  { x: 78, y: 244, r: 57, g: 36, b: 58 },
];

var pageAutoUseSkillEnabled = [{ x: 28, y: 291, r: 223, g: 221, b: 1 }];
var pageSpeedBoostEnabled = [{ x: 31, y: 333, r: 113, g: 107, b: 17 }];
var pageSpeed1x = [{ x: 24, y: 332, r: 135, g: 137, b: 135 }];
var pageSpeed1_2x = [
  { x: 20, y: 333, r: 211, g: 209, b: 2 },
  { x: 32, y: 334, r: 161, g: 159, b: 8 },
];

//rgb(166,104,65)
pageInProduction = [
  { x: 17, y: 44, r: 165, g: 105, b: 66 },
  { x: 84, y: 42, r: 178, g: 103, b: 66 },
  { x: 26, y: 30, r: 126, g: 73, b: 41 },
];

pageStockIsFull = [
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

var pageSelectAdvanture = [
  { x: 41, y: 334, r: 28, g: 36, b: 48 },
  { x: 35, y: 291, r: 241, g: 51, b: 92 },
  { x: 110, y: 70, r: 255, g: 255, b: 255 },
  { x: 173, y: 314, r: 28, g: 36, b: 48 },
];

var pageChooseAdvanture = [
  {x: 322, y: 337, r: 16, g: 60, b: 66},
  {x: 509, y: 336, r: 57, g: 48, b: 99},
];

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

var pageInSuperMayhem = [
  { x: 447, y: 12, r: 255, g: 29, b: 132 },
  { x: 444, y: 21, r: 238, g: 205, b: 245 },
  { x: 345, y: 18, r: 245, g: 218, b: 79 },
  { x: 81, y: 21, r: 255, g: 255, b: 255 },
  { x: 38, y: 24, r: 255, g: 255, b: 255 },
  { x: 18, y: 60, r: 212, g: 215, b: 212 },
];

var pageInHabor = [
  { x: 619, y: 18, r: 255, g: 255, b: 255 },
  { x: 313, y: 16, r: 247, g: 225, b: 218 },
  { x: 406, y: 18, r: 255, g: 211, b: 0 },
  { x: 92, y: 230, r: 255, g: 251, b: 74 },
  { x: 33, y: 227, r: 247, g: 207, b: 231 },
];

var pagePvPCrystaisRefresh = [
  { x: 243, y: 100, r: 57, g: 69, b: 107 },
  { x: 324, y: 78, r: 255, g: 255, b: 255 },
  { x: 443, y: 92, r: 57, g: 166, b: 231 },
  { x: 402, y: 134, r: 247, g: 235, b: 222 },
  { x: 351, y: 250, r: 123, g: 207, b: 8 },
  { x: 408, y: 251, r: 222, g: 207, b: 198 },
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

pagePurchaseDiamond = [
  { x: 435, y: 105, r: 56, g: 167, b: 231 },
  { x: 310, y: 87, r: 21, g: 206, b: 232 },
  { x: 317, y: 109, r: 154, g: 83, b: 55 },
  { x: 344, y: 174, r: 121, g: 207, b: 12 },
  { x: 288, y: 114, r: 112, g: 228, b: 233 },
];

pageCanGotoKingdom = [
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

function rgb(r, g, b) {
  return { r: r, g: g, b: b };
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

function checkIsPage(page, diff, img) {
  var release = false;
  if (img === undefined) {
    img = getScreenshot();
    release = true;
  }
  var whSize = getImageSize(img);
  if (whSize.width === 360) {
    console.log('image width === 360, restart CookieKingdom wait at most 50s');
    checkAndRestartApp();
    img = getScreenshot();
  } else if (whSize.height !== 360 || whSize.width !== 640) {
    console.log('Reboot nox as screen size incorrect: ', whSize.height, whSize.width, ' (h/w)');
    execute('/system/bin/reboot -p');
  }

  checkIsCookieGachaPage();
  var isPage = true;
  for (var i in page) {
    var cbtn = page[i];
    var color = getImageColor(img, cbtn.x, cbtn.y);
    if (!isSameColor(cbtn, color, diff)) {
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

function waitUntilSeePage(page, secsToWait, tappingPage, earlyQuitPage) {
  console.log('waiting for page with 1st pnt: ', JSON.stringify(page[0]), secsToWait, ' secs');
  if (secsToWait === undefined) {
    secsToWait = 5;
  }

  for (var i = 0; i < secsToWait; i++) {
    if (!checkIsPage(page)) {
      if (tappingPage !== undefined && tappingPage !== null) {
        if ((tappingPage.x, tappingPage.y, tappingPage.r, tappingPage.g, tappingPage.b && checkIsPage(tappingPage))) {
          qTap(tappingPage);
        } else {
          qTap(tappingPage);
        }
      }
      if (earlyQuitPage != undefined && checkIsPage(earlyQuitPage)) {
        console.log('waitUntilSeePage but found earlyQuitPage, return false');
        return false;
      }
      sleep(1000);
      continue;
    } else {
      console.log('found page in ', i, ' secs');
      return true;
    }
  }
  console.log('wait ', secsToWait, ' secs but did not find the page');
  return false;
}

function isMessageWindowWithDiamond() {
  pageIsDialog = [
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
  count = '';
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
  results = [];
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

  count = ocrResultToInt(results);
  return count;
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
  results = [];
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

  count = ocrResultToInt(results);
  return count;
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
  sleep(config.sleep);
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
  sleep(config.sleep);
  tapUp(430, 1500, 40, 0);
  sleep(config.sleepAnimate * 2);
}

function handleMaterialProduction() {
  pageFirstItemEnabled = [{ x: 569, y: 119, r: 121, g: 207, b: 12 }];
  pageSecondItemEnabled = [{ x: 571, y: 223, r: 121, g: 207, b: 12 }];
  pageThirdItemEnabled = [{ x: 603, y: 331, r: 123, g: 207, b: 8 }];

  if (checkIsPage(pageWoodFarm)) {
    console.log('wood farm, add more');
    qTap(pageBeanFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageBeanFarm)) {
    console.log('bean farm, add more');
    qTap(pageBeanFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageSugarFarm)) {
    console.log('sugar farm, add more');
    qTap(pageSugarFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pagePowderFarm)) {
    console.log('Powder farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
    } else {
      qTap(pagePowderFarm, 800);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (checkIsPage(pageBarryFarm)) {
    console.log('Barry farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
      qTap(pageSecondItemEnabled);
      sleep(config.sleepAnimate);
    } else {
      qTap(pageBarryFarm, 800);
      sleep(config.sleepAnimate);
      qTap(pageBarryFarm);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (checkIsPage(pageMilkFarm)) {
    console.log('Milk farm, add more');
    qTap(pageMilkFarm, 800);
    sleep(config.sleepAnimate);
    qTap(pageMilkFarm);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageCottomFarm)) {
    console.log('Cottom farm, add more');
    qTap(pageCottomFarm, 800);
    sleep(config.sleepAnimate);
    qTap(pageCottomFarm);
    sleep(config.sleepAnimate);
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
  if (!checkIsPage(pageToolShop)) {
    console.log('No need to move down one item as this is not tool shop');
  }
  console.log('Is tool shop, swipe down one item for shovel');
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
  sleep(config.sleep * 2);
  tapUp(430, 176, 40, 0);
  sleep(config.sleepAnimate * 2);
  return;
}

function swipeToToolShop456() {
  console.log('Is tool shop, swipe down to item 456');
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
  sleep(config.sleep * 2);
  tapUp(430, -170, 40, 0);
  sleep(config.sleepAnimate * 2);
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
    var cImg1 = cropImage(img, 474, partUp[i], 40, 8);
    line1 = recognizeWishingTreeRequirements(numberImagesProdutRequirements, cImg1, 12, 0.7, 0.5);
    releaseImage(cImg1);

    var cImg2 = cropImage(img, 520, partUp[i], 40, 8);
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
    parts.push(part);
  }
  // console.log(JSON.stringify(parts));
  releaseImage(imgOri);
  releaseImage(img);
  return parts;
}

function makeGoodsToTarget(target, prework, stocks) {
  // TODO: recognize building to reduce drop order time
  pageFirstItemEnabled = [{ x: 569, y: 119, r: 121, g: 207, b: 12 }];
  pageSecondItemEnabled = [{ x: 571, y: 223, r: 121, g: 207, b: 12 }];
  pageThirdItemEnabled = [{ x: 603, y: 331, r: 123, g: 207, b: 8 }];

  var goodsOneStock = ocrProductStorage(goodsLocation[1]);
  var goodsTwoStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[2]) : -1;
  var goodsThreeStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[3]) : -1;
  // console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock, 'target: ', target);
  if (goodsOneStock === -1) {
    console.log('OCR count failed, skip this round');
    return;
  }

  var prodReqList = findProductRequirements();
  var isToolShop = false;
  if (checkIsPage(pageToolShop)) {
    isToolShop = true;
  }

  var availableSlots = countProductionSlotAvailable();
  if (stocks === undefined) {
    stocks = [];
    if (!checkIsPage(pageThirdItemEnabled)) {
      [goodsOneStock, goodsTwoStock].forEach(function (value, i) {
        var canProduce = value !== -1 ? true : false;
        // console.log('>', i, JqSON.stringify(prodReqList[i]));
        if (prodReqList[i] !== undefined) {
          prodReqList[i].forEach(function (part) {
            // [0] is stock, [1] is requirement
            // console.log('>>', i, JSON.stringify(part));
            if (part[0] <= config.productSafetyStock && value > config.productSafetyStock) {
              canProduce = false;
            }
          });
        }

        stocks.push({
          id: i,
          value: value,
          // productionTarget: productionTarget,
          // stockTargetFullfilledPercent: value / productionTarget,
          requirements: prodReqList[i],
          canProduce: canProduce,
        });
      });
    } else {
      // === tool shop only ===
      var shovelStock = -1;
      if (isToolShop) {
        swipeDownOneItem();
        pageShovelEnabled = [
          { x: 575, y: 336, r: 121, g: 207, b: 12 },
          { x: 539, y: 296, r: 253, g: 253, b: 253 },
          { x: 420, y: 310, r: 81, g: 98, b: 125 },
          { x: 409, y: 297, r: 70, g: 98, b: 146 },
        ];
        shovelStock = ocrProductStorage(goodsLocation['shovel']);
        console.log('Shovel enable: ' + checkIsPage(pageShovelEnabled) + ' , stock: ' + shovelStock);

        // check shovel req
        prodReqList = prodReqList.concat(findProductRequirements([308]));

        swipeToToolShop456();
        var goodsFourStock = checkIsPage(pageFirstItemEnabled) ? ocrProductStorage(goodsLocation[4]) : -1;
        var goodsFiveStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[5]) : -1;
        var goodsSixStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[6]) : -1;
      } else {
        prodReqList.push([]);
        SwipeProductionMenuToBottom();
        var goodsFourStock = checkIsPage(pageFirstItemEnabled) ? ocrProductStorage(goodsLocation[4]) : -1;
        var goodsFiveStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[5]) : -1;
        var goodsSixStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[6]) : -1;
      }

      // SwipeProductionMenuToTop();

      prodReqList = prodReqList.concat(findProductRequirements([96]));
      if (goodsFiveStock !== -1) {
        prodReqList = prodReqList.concat(findProductRequirements([203]));
      }
      if (goodsSixStock !== -1) {
        prodReqList = prodReqList.concat(findProductRequirements([310]));
      }

      var productionTarget = [
        goodsOneStock,
        goodsTwoStock,
        goodsThreeStock,
        shovelStock,
        goodsFourStock,
        goodsFiveStock,
        goodsSixStock,
      ];
      productionTarget.forEach(function (value, i) {
        var canProduce = value !== -1 ? true : false;
        // console.log('>', i, JSON.stringify(prodReqList[i]));
        if (prodReqList[i] !== undefined) {
          prodReqList[i].forEach(function (part) {
            // console.log('>>', JSON.stringify(part))
            // Assume we can make 5 items
            if (part[0] - part[1] * availableSlots <= config.productSafetyStock && value > config.productSafetyStock) {
              canProduce = false;
            }
          });
        }

        stocks.push({
          id: i,
          value: value,
          // productionTarget: productionTarget,
          // stockTargetFullfilledPercent: value / productionTarget,
          requirements: prodReqList[i],
          canProduce: canProduce,
        });
      });
    }
  }

  for (var i = 0; i < stocks.length; i++) {
    var productionTarget = prework === true ? Math.max(10, target * Math.pow(0.7, i)) : target;

    stocks[i].productionTarget = productionTarget;
    stocks[i].stockTargetFullfilledPercent = stocks[i].value / productionTarget;
  }

  if (isToolShop && config.axeStockTo400 && stocks.length > 0 && stocks[0]['id'] === 0) {
    stocks[0].productionTarget = 400;
    stocks[0].stockTargetFullfilledPercent = goodsOneStock / 400;
  }

  stocks.sort(dynamicSort('stockTargetFullfilledPercent'));
  pageLockedGood = [
    { x: 351, y: 244, r: 121, g: 207, b: 12 },
    { x: 305, y: 244, r: 121, g: 207, b: 12 },
    { x: 425, y: 244, r: 219, g: 207, b: 199 },
    { x: 425, y: 105, r: 60, g: 70, b: 105 },
    { x: 417, y: 297, r: 235, g: 219, b: 207 },
    { x: 381, y: 316, r: 237, g: 237, b: 229 },
  ];
  // console.log('> ', JSON.stringify(stocks));

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
      if (isToolShop) {
        swipeToToolShop456();
      } else {
        SwipeProductionMenuToBottom();
        SwipeProductionMenuToBottom();
      }
      if (checkIsPage(pageFirstItemEnabled)) {
        qTap(pageFirstItemEnabled, 800);
      }
    } else if (stock['id'] == 5) {
      if (isToolShop) {
        swipeToToolShop456();
      } else {
        SwipeProductionMenuToBottom();
        SwipeProductionMenuToBottom();
      }
      if (checkIsPage(pageSecondItemEnabled)) {
        qTap(pageSecondItemEnabled, 800);
      }
    } else if (stock['id'] == 6) {
      if (isToolShop) {
        swipeToToolShop456();
      } else {
        SwipeProductionMenuToBottom();
        SwipeProductionMenuToBottom();
      }
      if (checkIsPage(pageThirdItemEnabled)) {
        qTap(pageThirdItemEnabled, 800);
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
        waitUntilSeePage(pageInProduction);
        break;
      } else if (checkIsPage(pageInProduction) && availableSlots != latestCount) {
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

function countProductionSlotAvailable() {
  var emptySlots = 0;
  var pageFirstSlotOpen = [
    { x: 50, y: 69, r: 146, g: 88, b: 52 },
    { x: 49, y: 68, r: 146, g: 88, b: 52 },
    { x: 70, y: 90, r: 166, g: 104, b: 65 },
  ];
  var pageSecondSlotOpen = [
    { x: 50, y: 120, r: 146, g: 88, b: 52 },
    { x: 49, y: 111, r: 146, g: 88, b: 52 },
  ];
  var pageThirdSlotOpen = [
    { x: 50, y: 170, r: 146, g: 88, b: 52 },
    { x: 49, y: 169, r: 146, g: 88, b: 52 },
    { x: 46, y: 179, r: 142, g: 78, b: 44 },
  ];
  var pageFourthSlotOpen = [
    { x: 50, y: 219, r: 146, g: 88, b: 52 },
    { x: 50, y: 218, r: 146, g: 88, b: 52 },
  ];
  var pageFifthSlotOpen = [
    { x: 50, y: 269, r: 146, g: 88, b: 52 },
    { x: 50, y: 268, r: 146, g: 88, b: 52 },
  ];

  if (checkIsPage(pageFirstSlotOpen)) {
    emptySlots++;
  }
  if (checkIsPage(pageSecondSlotOpen)) {
    emptySlots++;
  }
  if (checkIsPage(pageThirdSlotOpen)) {
    emptySlots++;
  }
  if (checkIsPage(pageFourthSlotOpen)) {
    emptySlots++;
  }
  if (checkIsPage(pageFifthSlotOpen)) {
    emptySlots++;
  }

  console.log('countProductionSlotAvailable: ', emptySlots);
  return emptySlots;
}

function JobScheduling() {
  if (!checkIsPage(pageInProduction)) {
    return false;
  }

  pageProducing = [
    { x: 81, y: 67, r: 166, g: 104, b: 65 },
    { x: 62, y: 90, r: 113, g: 221, b: 0 },
    { x: 20, y: 68, r: 166, g: 104, b: 65 },
  ];
  if (!checkIsPage(pageProducing)) {
    qTap(pnt(51, 66));
    sleep(config.sleepAnimate * 3);
  }
  var emptySlots = countProductionSlotAvailable();
  if (emptySlots === 0) {
    console.log('No available production slot, skip this production');
    return true;
  }
  // console.log('emptySlots: ', emptySlots);

  var materialCount = ocrMaterialStorage();
  if (materialCount == -1) {
    console.log('This is not a material production');
  } else if (materialCount >= config.materialsTarget) {
    console.log('Skip as stock enough: ', materialCount);
    return true;
  } else {
    console.log('Material stock: ', materialCount, ', target: ', config.materialsTarget);
    if (
      checkIsPage(pageWoodFarm) &&
      config.keepProduceUntilWoodEnough &&
      materialCount < Math.min(100, config.materialsTarget)
    ) {
      console.log('keep producing until wood is enough: ', Math.min(100, config.materialsTarget));
      config.lastGotoProduction = Date.now();
    }

    handleMaterialProduction();
    return true;
  }

  // Prework = true will order decreased stock for high level products
  if (countProductionSlotAvailable() > 0) {
    var stocks = makeGoodsToTarget(config.goodsTarget, true);
  }
  // And rerun one without prework if has enough space
  if (countProductionSlotAvailable() > 0) {
    console.log('still have space after prework, keep producing');
    SwipeProductionMenuToTop();
    makeGoodsToTarget(config.goodsTarget, false, stocks);
  }
  return true;
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

  pageNotEnoughStock = [
    { x: 428, y: 98, r: 56, g: 167, b: 231 },
    { x: 345, y: 104, r: 60, g: 70, b: 105 },
    { x: 370, y: 176, r: 243, g: 233, b: 223 },
    { x: 349, y: 247, r: 121, g: 207, b: 12 },
  ];
  if (checkIsPage(pageNotEnoughStock)) {
    console.log('quiting not enougth stock');
    qTap(pageNotEnoughStock);
    sleep(config.sleepAnimate);

    return waitUntilSeePage(pageInProduction, 6);
  }

  pageTwoItemNotEnoughStock = [
    { x: 444, y: 98, r: 56, g: 166, b: 231 },
    { x: 375, y: 105, r: 60, g: 70, b: 105 },
    { x: 420, y: 203, r: 243, g: 233, b: 223 },
    { x: 416, y: 246, r: 219, g: 207, b: 199 },
  ];
  if (checkIsPage(pageTwoItemNotEnoughStock)) {
    console.log('quiting not enougth stock 2');
    qTap(pageTwoItemNotEnoughStock);
    sleep(config.sleep);
    return waitUntilSeePage(pageInProduction, 6);
  }

  return false;
}

function handleRelogin() {
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
}

function handleWelcomePage() {
  pageWelcome = [
    { x: 25, y: 288, r: 225, g: 163, b: 42 },
    { x: 41, y: 255, r: 243, g: 60, b: 56 },
    { x: 131, y: 255, r: 253, g: 217, b: 52 },
    { x: 177, y: 257, r: 181, g: 48, b: 60 },
    { x: 204, y: 282, r: 225, g: 163, b: 40 },
    { x: 67, y: 324, r: 103, g: 19, b: 36 },
    { x: 160, y: 326, r: 104, g: 21, b: 38 },
  ];

  // TODO: Need to handle login event

  pageProductionList = [
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

    while (true) {
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
  if (waitUntilSeePage(pagePuffShowGuild)) {
    console.log('found puff teach guild page, tap announcment twice to leave');
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
  }

  if (waitUntilSeePage(pageAnnouncement, 4)) {
    console.log('found announcement page, leaving');
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
    return true;
  }
  return false;
}

function findAndTapCandy() {
  var candy = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAPABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9CPgpZeGfHGtt4g8dw6XrVp4svItWvFk0e1ure0VIQlpAjgzl4UU5wHdGeWZ1zvrpPid8LfDHxC+KWg2MNxq2jzeI7praa33QojBLGedJYklwyMyW8eQnmKVBbyxl5VyJrTTfDfwg0seD107/AIR9ri0tLVdQvJLR7C2WJ0ktj5VnIzLELeMo7tLI7TTbnCqgbe03wXrHhm8m8YfEBY5Nd8P3yy6Jb6drT6hb2eLSa087zZLW3ZpZI7uaNlkR41RIigVwzHxeIsy4ex+Vf7PUT5YWhT05k2rR92+lnZtptpLq9H+V5PwXxLgM3UMRacJ1FOdSSd3b44363slGKio+9JWUWrf/2Q=='
  );
  var img = getScreenshot();

  var foundResults = findImages(img, candy, 0.94, 5, true);
  releaseImage(img);
  releaseImage(candy);

  // console.log('candies > ', JSON.stringify(foundResults));
  if (foundResults.length > 0) {
    var bestFit = foundResults[0];
    for (var j in foundResults) {
      if (foundResults[j]['score'] > bestFit['score']) {
        bestFit = foundResults[j];
      }
    }
    console.log(new Date().toLocaleString(), 'best candy > ', JSON.stringify(bestFit));
    qTap(bestFit);
    sleep(config.sleepAnimate * 3);
    config.lastCollectCandyTime = Date.now();
    return true;
  }
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
      '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAA7AGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6H8Pfsb+E/hlcrqenadc3+qyzKgC2vnSRq5KMISq71AD5Jy3yqwPXIXxN8M9D1nSJp7VVlwjoqybthYqRk4KnjORz1AyCMivoL9mD4xeF9L+Cuj6RcXmoad4gWx0+TxDLqUKQpBeXen2uoeW7EphIo7pOqnYC+csCa9N0rw54Q/aS8HJaTfZb5o50jTUtOuFeZUG52jVwGUAbjlTwfMzjcAw/KuE/FjMMnxryXPHOpzTdqrne0lZOFrO/fWUd7JPS/wCa5p4H/W8JTzOhKKlyp8ri9U9Yvnv2/uu/V9T8bNR/4Sbwr8aPsvhU6wviIuIIl0gy/arkA7/LAi+Z1JUEpyDjkHFe5/tp/HX9pr9ij/gn5JrniiW10FvE+tw+GbKa1vfs2tWc0sd1PNO6Q5gjLW8E0WYxFKPOR8llDD9QNE+Hvw9/ZQN1eeGdK0WzvJ0VtQJUNdTqin53uSCy4VycOSu3O0DJJ+Cv+DjP4oQ+PP2f/ht4amkmXUNT8UrrFnZ7RteC20+8SW5RdvmPHuurYBzgAykDODj9e4g4qw+Z4GcIU1ot3ZtPuui8rXZ6HBfh/SyrHUsXjKvvJ9HyxUVvzN2co9WnaPdM/JPw7+0j4itktxHfeTGoXbay20ax7R0RQFGFxxhCMD0r2D4Y/ENvi2kcQCpqiFY5YdwVTngMpP8ACfTqDx6E+RxeFrRVurTVo5Y7jyjJGhYeW65Iz0yf4en51z+pzeJv2WfG9jd6xpmpQ6XqFtvjW4iI8xWQOIw/qMocHkdDjBr8WxGApz0p25nt59dO5/TmT8Se2rVaLjPlpNKTasru+2r2tr2uj6E/aN+DXin4Z67oGpahoF/JBbSrK0sKGWPaGVtpZeFPs2DmuX8EfFTS9Z8XabpOvaTLbrDb+TFcxq7XBjCBCJPLUNjb5hLD5Ruzhdu6l8Af8FP9W03TptJsGuGsZkMKw30quyKeMorKwB9AG/Ctf4VfDvT/ANqfxbI2lSX2j3lj+/v9TGYWtIiCpZmBKksNwAzuODnChiPJ9lVpU3HGrlSTtJN/f5fifQYjC0MwahhUqjk/hkk0/v8A1tY9Z1P9q7wH4W+Nz6lpvjrxZ4g0mzvp47XQtHt3itITK0TSI7TeWI4S0ECssW/ebaNjgAIOf+FGneN1e2/4SDwTrmqaFZxLsl01ltJGjRMAOJ2AkXgcpLGeOhHFe7/D/wDZc8E/s66St1pVnb2fia8iF293qNv9o1O4TzPvM5GIRIBgINrHJJUNFJj0r9mfxLo3xb8Q6P4Nv/D9lqV5JY3l3qV3eutxL5WRsdUZeIwzrEynIJdcEcqefA8ZYzLVUjlU5RUoqLd7NxV9rWt11Tuc+Y8I5bXwrpZi23r/AA21y9dJO97X7Nb73bOT8J6nptzpaxaXDHa29uSv2dYfI8rk/wAGBgEg4I4PJBPWtQzMYWZV3bCFbHbP/wCqvIP2jtdvf2d/jT8TtL8Pparp/h+TTZ9PhukkkjiW62maIYdTsDK5QA4j3BQCihBB4K/a6bxL8N77UL7w/faXcaaEhit4pvtFrfTuxWOKKVVD/eKBmeJQpfjcBmvKlRqVIfWN07NtvXVJ693rr5n8x8XeE+Z4LGJ5RTniKM7NNK81dtNSS3s18VlG2rtqanxV+PeseDvFrabo+h6drCW8SfaXku/KaCVhu8vG05+Qxtn/AG/aivOdB1bVtfsGvNbLHVZ5pftBaAQltrsqfJ2GxVA6nAHJ60V6uHw1CVOMrXuk76n7Llng7kdDCU6OPoKVaKSm+adnL7VrSStfbRaH63fDb4l+D/Hfw+1mz+FureF/CfjrSZG0WbUda01tWm0ue3cxvb3amaGfcmxowkkq7Ao2gqqg9f4R0HVPh34M+2/Gv4ieCddvGn8rS9Zs9Lbwx9iDxktFHM95NIZGCud0ciEoMbeGJ/Aiz/aG8QSa5400/wAB69r02h/ES7mm1CSdI0utct2eSTzJwAdskiyOZNhG7zGU5BxX1xJd32gW0CSQxMiKsdsk/wC8WCNWyVRQRtHzHgdCc+x+sxkp0n7+spa2bV/Vv8fM+cpSjGKpwVraJaLRdF5Jduh9Yftp/wDBQa3/AGff2YfFHxQ0XSB428RXHiqw0jw7deJNMY6XBb3NsLqG5McbxxTMIoZmUK0dygmg80RhsN+O/wAT/i/8QPjv48fxl4g8W3XijxB4k8yziubpUUwQ27SyRw28CgJBCmxisUeI8yspUE+Yav7XvxBuvjP8bJxqDf8ACO+H/B88kCaas88kd5IsrmS53sx2yS7jjCqiJtUE4LNtfAX4ITfGf4kLJb+HNXfwfY+fA+p2N+sVtLI0bhXhlk5bEyKrGNJMbMEAHNcUalWlhI1cc4xerlty7vlW+rtbZvXq+uuc5TVxUqeDwNGVSMuWVTlUW3DS8U29HdNxdlsr2Kv7OXwy1z4r/E+bQ9J0bUJGlhEt4JLSUhedqZ8z5kwu4jHBC4AOBjW+PPjzULP4v/ECLxJa6laCwvf+EfitfE7uul3Tb/Ot3a3OCqlV3IQMFJFbOWweN/aI8CfEj9n/AMeaPcanpuvabbQXElvY+JI1MCyqwcoUnjbaHZElPlFhJt3Ejbyfc9a+Knjz46fs+zf8LA+H/hnx9Y3lrFHpviTWIzYTxI0rFG+QrMfmI2yKI1KSfK7CRs8GKr3qwxbcZU5WSs7PdbNu0m0tm0/U/Q+H8l+o5esuw3PeF5PnTu73eqS91Jt7LvfV6/M3xB+EtrHcgSeH9O0kS28E3kWZZlQNEjhlcszEMCH5Y43Y6cV96f8ABGL4c2DeH9P0y4DXAujdatPK+DJJJDMIokYkZwqHco/hYbhg18g+MtQ8XeEMf8JBodjfWeOGs12LCvRUXb8saKMKqhQqgBRgAAfbv/BHvwNqt58QtL+y2d7ZLd/aL2SCdcMkUkaRKrYyBmQqwzg4ycDkVz5zVnVwHs27u62d7+Xc9/B0o0JVa0fdahLW1rX/AA8j6t+P37H/AIi+OPie01bwU0MmoWunNYTafduYLYpH5kkMqvtO1w7NGVbAdZFbcDEFk7f9kz/gnff/AAm1zWNY8Tajpa+JbrzLOxW0nadYLFjGz8bY8NJLGpOd+BGmGUsyip/wUd/b603/AIJ5/Cmz0XQ4UvPGWuRyi1M6MkEZRUMlzM/GI0EiHapDtvRVKjfLF+WOgf8ABbD4neJviLc3X/CUWep2b3bs+m3Oi2x09/N3BYsqouTGGIwxkzkKGc7vm8/C5K/Z3cOdrR6tL00Tba2vounQ/O8w4ydNvCJytu+WPM4re8rtWT3tq7an6Tftg/8ABO688Y+Kr3xAqQq99AlvO6os9reIrSFBKhCusgLfe+ZdpC/MQCvxz8Yfhdr/AMAfHEGgzQabaW11aRXehzwLhZZ4W3ToyMAFKExFQAQVO4nkqv0l4n/4KYeIPiV4ej8M+AtQ0hLXVtJS8lu9SntWu9OlkSCRoo5biZYGMJnjUxkSSeZ5iqoERA+bfjV+1Nq3xV8L+G/CXirfdeIrTXbS+sNUtbU263tsQ6OkycbXCyOTtG0jcCAUJfhlgndKnfkktYvePo+qXrt+H0fDvHlOeNhlspXd7JpWUvK+9/wvsaWreFtJ+La2viCPVLfSG1C3VpYGVGbeMqcliDkYC/8AAaK+I/2kr3WIfjBq0EUuqWMNvIUiWGR0SRSxYMMcHO7GfbHaivLw+RZrSpRp0sW4xS0XInZdFfrofps87ymcnKXI31fOt+vXuR/Bf4KePLO700acmmw3llEigTO0REe0KWOVb+E9CoOfSvb/AIy/HXxL4LureHVriGGNXWIyW7LczNhiSS4jSNdylcp5SN8pw7YFemeMfhTNBZR6mZNPaJpTF9t0u8M0UcjY+WQ7VKM2RhsEE7QScqp+dPjVqFj4W8R6T4Z1+PVo7PW7lBPc2cKGWO2Vsu8Jc+W0oC/KDkAkbhjg/ouIxGIqYhSxCSsr7a28n29PvPzylkWVJe3pwTmtFdtq/p+Hz2OB+I02l/FT4xeGfCd4Xk0Sa7hN9cq5ee5iCNcSgy53tuiVgCT999xyQCP3K/Zv+E3gXwF+zhL8WvFml+HtH8P+G9EkvLaOOA2un29pbIW8xoY1O0BU2eWkZ6MAj5VR8lfsY/8ABKPwX8cNAt9e8IabY6npN0gT/hJNQkmadioKPtZ/mhkOGV0gUKCcFQhFe1/8Fr/hDqPww/4JxeCdFhvl1bw/4c8XWS67NcaXDJm1lFyqTI3lO9vP58sMCPFJCGFy8bErLsPkU5081xdNuEvZU0/itZyvq7a37eqLzjE/VKX1ehUiqtSUU+W94wttdLTppu0/mcl8Ov8Agtf8Jf2sNR1f4X6l4Q0nQoPFOuWui+EILi2uSluJ3ki87UTFbvHbyBljdRGZIz9sjjkdESedfRf+Cgf7Iehfs2f8Ez/ihrUk0+qeIbHQ2klu87NmCu4RgY/NuOAQFNfmv4p03R9M+F19JpOj+F9QsIrWKfU7q6umjxFbW6BhbXUalSzuJG3FWUFggjRolY/ef7Svi7Wv+Id+z0LVNFl8PXn/AAhGh6FaTSXsU0OrW3kWqR3URQ+aivGU3JNFG6O7JtYAO/oY3L8HO2J9mk42S17vTTTVP/NHApYrB1qeGw1V8tSSbXold3u372rautdLW0Piz/gnZ4Stf2lPDfhvT11JZLrVri6i+1XERuBbNEskuCmRztQdxksOea/Wr9ib4AaL8E/EBtLMyz6hNbyXlzez/wCtumBVMf7KKJDtUcDknLFmPwF/wRX8AQ+DvD+jKsatJp/hvz/LbG7z55Ed2DduWkX6Niv0r+EGppH8XbXzsRteabcQRj+8+6KTbn/dRz/wGvnK1VPNVFfDzfrp+lj2M8xFb6p9WvZKmm0ur5bu/f5n4v8A/Bezxf4i8R/tJeLtTuLWPS4bGz06z0+Rd6TXtk7NOZVJPzbbme4iyuMCLGMgk/Kuh6vD8L9CvIbgWpv5F+1iRADDqkzQttdGZCGVsbgFwcjBAO9T+jn/AAW//Zf8Tax8ftB1LRdL1zV47vSZdJka1095odLFncm4iuZpF+WJWW8Z8uVULbs2QFYj5Z0j9kmw8Hazpa+I9Q+1ajezM5tbDddrGN6idXvArQQyZMTLLEk8TgcuCBj6LBY6MMLGFTfW/dtWT/FP7z8ZU8VhsdiKeDpSdSUuaEla1nGL5dd7Lok2l06k37PPie30rT7O3/trULqS3t7eNo7OdDJ5YijXM25tw25YlgpJYNgKTkdl8QvCMuvfZNN0udpZ9Q8UQWOm3F5B5ahp5ZXDpIqNI0LSFJFfBcHkDcMV2WgfFbxFZfCLU/gzpWuRrocPhu6F5aW9su67kaZZI5JJnUuN8ruWRDGrqFDRhCqV5P8AFO903w9rXh3Q/DOj2HmzWMGqWv2q5uY7G1VhIIQIVeOFnJBAdi7E8bSTXDQksVXapfEtflun06eX3mGbcK4vL8RhV8dWs20opJJws5pyckktbK0dbbJ6PofjV+2V8Ovgf41/4R2+XVvEF9aW0LT3GiJ5lspZchfMuDAZCV2uJI1aJ1kRldskAqDSPDfijXPFPjC6sNY8G6V9q8RXtzc6XNfeaukTSuJmto2V0BVPMGcDhi4OCCoK9iGEoRiouLf/AG81+h5WYeFVSriqlSlgVKMpNpus03d7tODd+92/U9m0/Q7j4Z6u8Gq3mlajpt8x0/VLe1mb5UbIYMGAb5eodeQQR8uefGf2yvh3FB4dhS+Yy3fhvXbKDzg21mSeeKFW443Mk6NjkDcR1FfQnxFsYbj4pW8bRr5d5JbGZQMB9wQN06ZyenrXlP8AwUVUQOyoAq3F/wCG5JAB99v7XRdx98Igz6KPStZYXnpzitFCaitXtK6f6P1ufu1HFOVpPdxbfyt/m/w7H6Q/8ETbCTw/+wVo9n5is0eqX75AxlTO2Dj8D+Veq/twfC7Q/jd8AdW8P+KviD4h+H3hu6jlbVrzSLy2tmvrMwSxzW05nilVrdkkJcKFb5B86jOfD/8Agktq9xp37F+pTQybZLGGaWAkBgjfaLw5weD0HX0r8aP2/wD9qb4h/tEfto/EHwz4y8Xaxrfh3w3qlxBp2lvKIbOBY53CZijCq5AJG5wxwcZxXz+RqriGqVJ8rinJt66c1tF1fldepx5hlMZ42dao/d5oqy3u4qXXRLz19D3b4xftX/swfspfElbP4UeGbj4p+KLWH+zLG+1CWabw/obF4yJYYJZHiadZLeJ/MiAZuGEqP81eS/Ef4z+FPF37Ifhc6br3ii68Rrqcs91oVxc3D6dYWKiUR4aXeZZUTyY4naWVxEnlswVIwvhXhTwjpviH4hzWN3arJaLo95dCJWMa+ZDCrx/dI4DdV+6wJBBBIq5rqrbeFLhI1WNI7aUKqjAUBeABX1VTLac5RcpyclZu7Vno7aJW08lfzZ5ObcQVcDVVGjTjeel7apXV9e7+7yPtb/gnJ+1B/wAKo8V2lvcWcklza2j28tm/7ua6snkDM0RJ2s6PGMHO1ghXcuS6/Wt7/wAFIbXTtBW8Oi3+h+L7NEvoYf7Qiezs0Vn3SPPgHATKuPKZTuC8ruYfH37M3g7S/Gml6LHqllDfLHb6vPGZB80MsVnI0cqHqkiMxZXUhlOCCCARx37V1guhfD+xsYZbqS3TUgv+k3MlzIwCTMMvIzM2Cq4JJIxjpXwsY0MXjvZtWlf8uq1/C3zPvMzoynhHKDtVSSUrXVvOOibS03s9Lo0f29P+Cmnjn9pL4oJHNqS26WsUUVutlbmPTJ5EJAe3imeSMhTIzmVt0uSyhxGFFTeIPhb8btN+F+h+ONT0DSb2xtDGqwIgOslJhH5T3FqM+Wksn2fKxhZRvUDywxcenf8ABPL4QeFfHfwp8Rza54d0XWpNQ8Z2+hTHULNLrFmYgTEgcER/ePzJtbpz8ow74jWTfFP9kH4Y+OtdvtYvPE2vePrLTb65XUriGKWDN1IAII3WFGViSsiIHTcQrAEivosfi6FFKm6adpcrbV27pvurbPr2sj5PC5HQhUg1rUje0npLonqtt9lp5HG/DXwlrXhn9om+m8Qafq2l3+peHxN9k1Gxa0miT7T8g2l3U4XauUOMqwIDhwPO/F3w/wBS0jQvD3jKy1S8vNN8M6WNH8RWMV+8EUMtjHLG0zFQ7hUkBbCKSp+cJ87uvafEL4ha5qnxZ8Mw3GqXkkMNrPpioZDtaCLUbu3QMP4nMUEKtI2XfylLMxANdZ+0N4X0/wANeHviVFY2sdvHcfDyKSUDLeYxXVMkk557fQD0FePh60sPmF4WtOMdPLb9fwPL40hWwWTUcxp1G6mHqu90nzqrNRknblta6aa6q1tTxvUfiH8RNen+1399qenzS5AgvPDOrSSKisVU/uEEYBAzgAE8k8k0V9LXfgfR9SSD7ZpdjqD28SwJLeQrcy7F6AvIGZu5ySSSSTyTRXsRzpW+BfgfjH/EZsY9ZU9fV/5n/9k=',
    cottom:
      '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAzAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0B9SZTnP41n6tdG/tpIZCxjkUodrFTgjBwRgj6jmobCO41vVLezs42uLq6kEUMacs7E4AH1p3jjwV4l8Kau2lyaPcf2obmOzCkF4YpXXcDJIgYKqpl2PJwDjJwD+C4HJ8TiWvYU3LVLRaXfnsj8tynKMwxs19Spyk7pXSeje1309XZLqz5N8ZeOfFXhjxvcWOpSXGrNoeqJeEGcRLdSIRJHM6Dje6lWzyRvI65r6Cm1G58T6emoaf4Y8Zahp8kYnWe2sHWC+jdP8Anm5XzkZDj7pyOAaf8X/2Ebz4jeIdFudD1K4u9QmiaLVJphKi3HKmMwLGNgC5kAQuMgrlicsfftD+EmufBr4Qabb6h/oOi6LZR2ZuLq5SG4VEXBc7uFVVHbO1RnJxX67kvDioYpe2qckorR03o27Np26XVtUl3utT+ks94dw+Lo0sTmylOvTilalJXbdlJxvZ+7q0k02rpJtpHguk/H2+8KPY6he3SeCfC/gm9ivNevdaguILHRzcbbKMywheGb7R90MoZQEM0Ycsvuf7YfxDg8E+BYdcm1LxALHyYtIvNFvNUm1C88VzPM8sRsF2bYdaFxI8lsLaOKGVhHbNGqLbTWet4Z8a/Af4l/BHxN8J4/Eceix/EjT7zQr5jdRx392b2JreSSOVzIGmYSfK0m8s2M7ulaXgX9k74naH4z8P658RPi/ovjHT/CUkl7Y2Gj+CI9Bkubt7aW0D3E32q4MkQiuZ28tFjJk8pt+1Cj+BxjgeKswzzL8VleKVOhGX75e5dpWta0XzXTknG6WzWquvjq3DeKyzE4bBZNKVOhGTcuazb5pXbd91Z2suiV9dTj/i1ovxB8EXEl1408R2tn4ftU32N7pF2dMjvzwHublhIJhcHcNyE+UN/wApkYkrx/xN+LviK7+GOo6beamdW8M6on+k3ixLJd2UWAM7lwJIRhSSQZFwSWdSQPs3wrpFhqmozXM1uWvobcWyyljgRFmbAGcZDZOcZ5Azjp5F4pt/gN4R8X32l6tofwnmvrVm+2BtPst9mQu//SSEIiJU5Hm7d3OM819djslyaWF+rVKMY2+1pFqTe6f3bvV9LH6BgsVWcquGxUIyV/c5bpqPKt31d7vS1k1bY+Sfj9puq6F4euNH1a3gs7zXLYx2U63URtLpXV0EkblgWA3ozBQxXcACxrwPwv4a8WeBvF/2eOO+t/JSSQyQyMI2QZb5XU/xbASoIJHBHav100/WvB3wt8E3K6d4f0nStBmw0tvp1pDHDcGTC8ooVG3AgZPUV8mwfAnR/FOsakvgvW7B7ewvZLUXLX0c1l9nYCa2VGDu7PHHMsbtggvHJk8ED4viHAYrLcNHFTmpXdm7W13vo38/Nrvp4mb1s9oUZVcrhGXTlmt9tU07Nq+ztp1b3t/sxeJtI8MfGPT9S1nUI7C1sY5ZVeRSytJsKqpIBx1zn2x3r079pj406PpPhSLTY5I7/UvEDD7MsTpJ5a7kbzjg5wudwbHVc18wefiqdlfiPx5brtB3adPIWI+6FlgXA+vmD/vmq4VzDlksDy78zTv15b7fLyPz3wxzxQxMMpdP43KSlfqot6qzv8NtGv8AP9JPhVYw6F8O9It4dqxrbqy4PY8/pnH4V8Z/8FhPEviTRPDct3D9oOi2djLJFGgIjluVUNEZDhsoGycFdgZAW6Lj6d/Zl8aQ+L/g1puxmaaxjNrKGf5iV6HjkA9vpXWa/Z22u2ix32lQ6hHCFmaOZVkXcMnChuGYYyM4HQ5zX3zoe1oOktOZW/L89n5Nn6hTrSoYipzrV3Xmr9V/WzPw+/YM+CXxa/ag+N+m+IPBNxrGoaPot/EmpXtxqrf2TpkqKHIG/iZiNoARSQW3HGQa/b3xh4hWT/R1YBYTmU7uhHb8O9c/4006w1LSZNH/ALNSysmcTbY0ERY9mG3pnGPXHBx0r5++N/xyh+GHiW6+HHhbT7Vtc1LSRqTyXt6/7qOczwq8MXL3DKbdyyBowo2kMcnGjhgstwzxeIk0la+l1bps3rrtb1ZWDwuJniY2jFwte/NaXM+nLZq1tb89021Yz/H/AO1y3xJ8fzeC9HmvtJ0l4CNTu7a4Ed7dxSFkjSHvGCyOXdTuVQoBBfI9K+Dv7E+g+GvDdnNrguY1KhbPTbeHY0aAEqnlqGOdozsUZUKemCB88fszfsoeIr340aH4m23WsQ2t152pG5hSGEjZt2xj+FRnOxizEEncSOfvzwnqh1jUZrpZrO6a1ea322xVpIxvUFGOSytlGBA25aM5/h2/mtHDR4lzOpiZNuhH4U9NNvm3bz31PZzXGVMBT9lR92T1k09fJX1t/wADQ8F+M/7KyyafFp/gNb630vVZTDq+jecws1bHmBnif/VM29mcHaJN67wxKEctqCaL+yB8UdJ0vXdct7P/AISPS3klu2ic25ljmXYjNxgANIVZsD52HU5P0Z4s8RR6J4g0tbe4s9LWS6FosFyzRy6gCq4jihxmTAA+fjywrnJRXDfLv/BS7QzrXxM8Nsl1dWU0ekzIskWGVw0o3I6MCjqcDKkH8OtcXEnDtPDVY+1k5Ra91X+Fa6JdNde3keNU4keGwLqYv+GleTSvJ+8lq+tm+mtu54WZt3c1xnxX+JNj4DggvLq6/s+5hSaezMpCx6msSqZrdWz97DIQpxl1UjdsYD1nw18A7g+GpDqmrSw+LoQVuFkUwWFpJhP3Hlhj8rEZEjFpOQyExttb5H/bl+HfjDU45hepp1vpnh9TDDZSSuLrzLmVVL/6vYytIyhWD4KrxzkCMhnB4yMozs4vR+f6p7eh+WZPwXicnxlPFY+fLonCUHdKo5JKMtOqbXZ3smfaH7Df7Yem6Tqduwu1m0DXgu5gwHkSEfKxB5HXBB6elfWU/wAR7Q641u11C13I+2DOVDoxLK4xxIqq69xtMZ5zmvwNtPj/ADfBjxfp1pb/AGxW1Ly1jWBVZJWLlAHVmAwMDBHIycYr7M+B3/BUHT7PwW2i+M/D9xq7wfurZomTajeokeRWjXPGMnGPvY6ftVGthKkFze6+q6fJ/ofskq2CxcuZvlnpzJ6J+af6PdH6Ma74xvd9tpuoT2Zvp4rm4N1GwMdu5kAjhUEA42EE5ycrz2J/J3UNZ1Lxl+1VY6rdXM1xNC2mmSRpCzgfa7gk5PPqa91b/gpDeeJNCjs7f4dW9ra6aBcia31VmliiyFZxuiG/PAIyexJGM181a18QU8I/GOTVLrT9S0fTdRlF1ZTXVsVh8vzBJCPMXMeNshyQxCnIJB4rxeLa2GxOT1aWGmpS0dlvo1ey9NdNjvwOHw+GpU4U5aR01bb8nd6u/W7bP278CXq2/gXRo41CxrYwkBeBygJP49a4j40aZ4r0+21C/wDCuraXY2+ohX1K2u4kw0qhUW4jkOMSbFjXDsUxEmFJzu8H+M//AAVQ8EfBHwjpmm6GJPF+vfZooVhsP3lurYVQDKDt57AHPI4r4n/ab/bV8Z/GG6hXxtr2paLpMsZeLQdHCxzXSZ/1k2WxGvC/IWO4q/XkD87yiWMp8tXDe7otXs/Rbv5K3do8elgZwxEq1RpK70sm3r22Xq9eqTPrHWf+Cgdv8PPF9pDJqt58TfiFFCNL0/SNGPmRpJIygyTbTsMzkBRtxtyQqfOawviL8SU8d+JbuXxv4/8ACun+JtPZLW40u5ma3tdJlZJHWxe62G2S8kFvcbYjK29ofvLuAr47+CHiCx0zQrfxJ4JurjStS8P306NPPAkkys8MsDbg2ULeTcEqRkI+1hnbg/UX/BPD4Z6B8a/hA2saxp97utYotHws8sEckp04ieYiNlLysdQukEjFinmuY9jPIW5+JMywuDoyx+ZRnVktLJqKTekbdEr66ttK7blseZn+BnmdSGBSUaU022m7+607Oy2TtorKTbdrxTPpbxmcaxoeof8AL5dmO1mkH/LWMw3Mu1h0OHQEHGVy2MBmB+df23/BWl6p+zXp19Naq13bmzMcgdlK/MkmOCAQXVWIPBKgnJAoor5bKZNYmi13X5n09OKeHknt/wAA/NPXtDtLnxXpF5JbxyXEblEdudo8tm47DnnNemeHIl0/QLDyUSNmgWXeFG8M4DthuoBZicZxzRRX6/j9aSufP4bS7XkaEEslh5lxDJLHNJbyQuQ5wyuCrAjOOQSM4zXunxC8R3nhb9laLUbGVYby202yeNzGsgBJiB+VgVPU9RRRXh1Yp1KSf83+R3Sk1Sk0+hoSadan4MafqC2dnDeX1vYT3EsNukRldniLE7QBySa+Bf2kPGGpn4zA/bJfm1e9jOMDKRSGKNfoEGMd+pyeaKK7MjiniJ38/wBTnzKclhFJPX3fzR7d+ymd/gHxgp+6L8tj38pT/SvRvgZ8d/GXw08A2dnofiTV9Ps5v7WBtkuC0KbL1gpRGyqHDHJUAknJJNFFeRnlGFRSjUSa5lur/ZZz5lUlGthFF2vOSfmvZVHr80n6pM//2Q==',
    flower:
      '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAA0AEkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2jwn8E7u7+CFx448ZeLLLwd8ONPDt9su5RKAyuYwwjLoiJ5m5N0jocgbQ24VV+GHwk8J/tNeGNS1D4M/EbQviPc6GAdS05YxZ3UCtkJhfMkGXKPt8woG2EqW5pn7Lv/BQ+H4eWtx4Ys5IfFGi6aDK621yskUAllk3Qjgo+XSYn5gVYFTwQF7P45f8FONL8E/CHWIfgv4fsfB+qaWGvrqPV9Pt7YTrIRGTa28LOk04aTzCXYAeUCVlUuB+XYfKaM6Km4PXq3b8D0OGfBDE5vl2HxVHBT5ayVpybja7tdq+mu2lmrNJrV/O3hv4iSfETxn/AMIj4L8vxFrqo7Tolz5Vjpqqfma6uAreWA21WRFklBkX92Qc14l+0hN4q8HfGfUtHn8b6pPJopRFOgXE2k2sDvCjSRgwyeZJgttbzZGGQcLGCVr6Z/Z18E2v7Ff7M+qeO/E1s0GvaxEHjs5gYpFzn7PaYwSrsTvfAyoPzD90TXhP7H/w81X9oT48axdf2ZqWv3ekWNzr2oXMQto7e3nYSvAJ3nlhiWW5nV4oI9wZ5NzALDBPLF9XmnD+XZHlUKtdf7RJOcm38EFsmnZK+7b1Vt11/WMt8Nck4FwNbP6NCGO+rtRk6327+61SSjKMGpOKUmpe7e76x0/2JPhp4T8aL4p1LxxrHixobNYZLOOHxPq0Uk2NxnkWK3nDShAYd52sFDqTgHNcb4i/aB8UfDf4i+IILO+i8SaDZ6pcxR2+rIttcQwJIyIizxINpUD5jLHISRyy8mvWvE3jnUfBXiu60f4d6XpPiCz168Gp6hpt6zWmoWzqUWRrpxE4tUhmdA8ciLNHLH5bIJHCyY+t/wDBO/4hftIX+u6pp9xJdLrKF7jStO01lSPcgTYLo7225HMghAbn5Fzx8/mWcYZUqGCx1CFNcqkpWbqS5tfesrxVnZJrZXvrp5ixmG4pxuLqZhkEIYOdH93O0IzhWajZ35oNQ3cnGPM9HZ7P55tIviVdfHa6uLHVr7SdQ1i/keEy3+61tEd2CwyCYAOI94VU8snhdqkj5ftC2iaC3jVpGlZVALsBufjqQABk+wArl/i78IPFltZeGNN1W41O38aaJqkV5c6dqHh1bG1toVRTuu33Ml1I3DxtatEqu6s0CtGoj5geL/FHwu+Pdr4Z8TalDfWuv5uLczQx25s4n80QmPaobaZI/KKyb23Oh3/3/HzT2dWrGhTlDmjDmtGSlp/iStdLXlbutt7n8x8U+HHEGUYCnmOYU4+z2bhJO2rUU7a62urXWqvZux6nnZlvQc54xTt3+c0FOf50nlD+6n5V4Xsz803POPF3wl0n4j6vNrS6hqUGqXS7Bf2N60bxoNo8tChASMBVARcKAoAAAArqf2L/ANnrwdF+0GL/AMe+MpNR/sUJc6Xpmo3Mvlz3AbKvI8jFMRjawReXJy2FQrJ4v8afir4h+B/xEvdN8QeG9Bhms5Y2P2aJ7OaW3fBjaOdHJG5SDzuAJIIOMDqfgv4y0bx7fPqtnfTTzYzJBcALPaSNkHft4YH+GRQFOSCqEAV/QOHyeWBazHNIOUXHng07qUntd62+e/ns/wDVzL/EnLeI1/YuV1VSqN8r1StFb8u13pa2/be69I/bo+NA/ae8dW2n6bcXFv4L8PuwtYBmNdQnyQ10yYGPl+VA3zKu4/KZGUcT+yn+0v4X/ZK8Z+NtD+I3iSx8K+B9SWw1fQtSu9GaG1bUJVngvLeS7hiIlm8q0tHRZT5mwMFykeB7P8X/AB1b/FX9nDS9Dg8Iw3/j/wAL3ixaVf2SiGbUrKUSZtpgv+scTtCFbDHDsflPmGT52/ZP1WH4kftB3HgbxRo0M3iK6vVbTLs7pItNnS0SQxeTIxVMDzMSx7X3MQwYMNn5b4nZTSz3J66zJSlCbj70bKUZJ8y5W1JLSLT0futrqeX4nZDlmZcMQ4brwdGftLwd1L4G/wB5dWupRlqnZpyasrHsf/BNrxe37V37b3jLV9O1iRdM8YTmGCW0so9PhuNJ06S4igd08vdLcSRTO4nlBZoxbrhQgJ+nf2mP+ClV9+zf4ovPDXgfR/CukeHfDqzwvc6ra3skjmG4trZpwkahipuJTFtAkkn3pJFv+ZR7t+zj+w/oPwO8R2/iS4uGv/EkMLQiZBtjhRhymcBnHLddoOfu5Ga/Mv8Abe8efDrT/wBoHxZ4V/sDSfGmqXHiWWxs7nEccYaOVmNnMbra8fleVJGZIt8T7lcEGRhXR4c5HgMO3DGQUWoqMIyf2YpJLRLVJXaVr77o/M+GsRw7hq9DLMXXp+ypxUYe1ahCUrvml70optLVJuyu3ayPvz9mXxT4e/bo8ZzXnja1tJPHXgOytRfWdlC9vYvHdeZIhVWeQ5imjnhJSZw/2ZJQUScRL8Sf8FedU+Evgb/godcP4w+0abqGk6Jo8+kiE3CW0Kq8zArHb8Aq6gsXyMBMDhs/Xf8AwSV+H3iDw34E8RfE74gahoa6l4yWK3tham2EVpBHcXMz7pYxtd2nuXUnew/dKBwNzfCP/BWC+8GftQ/8FCLieO+m1bwzJokZvDYGMTs9hFdEywkurMkSTTSOI1kcsiII2YlVWeYPL6eZ1I4HRXb0+K1te+ienY+V8RsrjmNDHYbK5SqUKaj7Nxfut89NtRdknf3raapLpY7xHWRFZGUqwyCDnI7VJg/3f0rg/A+vL4Z0Lwb4X0vT5rVtW0+CPQ59evYbW1mgWFdplmi8woAdsIYx4eXIXcqSyR3v+F06L/zz1j/wWz//ABNfMPCz3S06H8kY3hnNMIoyxFCUVJtK61drN6brRrf03Tty37TnwX8UfEj9kS31DXrezu/F/gC0XZqtjOLq18VaNuRheQXCjbOIw284Ysodi4Uyoo8I/ZX+FXjfWftHiDQ9LujpluQrXk6lLNgpIdCxwHB3AMq5OD0HUeu/t6/Fm4hsNUPw/wBUudC+DPiS6g0y00qwEKXdgjacrYMTfvFivfKnuFCufPV2dxvcKfIv2bvCmi6x8Q9P8FWnxE17wrdeKrK50t7lXN/FdXbzRR28M8dvL+7hLMIw3zkPKcoF3MP6AyfjRzwEcJVjBRqq+qbVJTV5RcVreLb0vpfqrH9E4fheeGxH9tUpyUqNvd0Up2at719LrrbzumfTOj/Gm8+GnijRtVtN0c2jTJdSFyP3iEf6snnqjFSeST05rL+AMlvrP/BVHXvETWo08yeLrm7hid+AjaZGSp/2txYYHG7pxxXnXxL8Lah8J3tfCt5d213daPC1pc3Ftu8qd4pZIsruAbb8mRkA89K7KPwV4msf2zn8T6HcaLY6Hpt0NR1e41e8+y2caxTsjlpgGMOY/LXLKUOQvDNmvleJKMsflkMqy9Xs73255O6vr5bXt16H9ZZll9bM8tp5xUXNUahLfWMOXVet3d/hrdP9vr7UodPgaa5uI4YlIy8jhUXJwMk8dcD8a+Jf22f2s/gVrWo213L4P8M/EjxJpQaGzv7yFBa2byNGMeeRncWjCYUMysoGMMc+G/G79qjUP2u/Hml/DvQfEkuvatqzSMJ7i3ksdOuFi4eC0tFw1y5BDPvfGE3xlkD7ee8M/soeIP2YPjZp8/xE1CzkMYjuZmLRSFLVsq7I5Gy3wFOdmBlfmJHJrIfDfNMwxc8Kqkac4x5uXm95q17JpNX9LrVe8fz7meO4Z4Zw0MXnkpYicnZU6fwp30c5PzWyXNpshPhZ+1v4Z1waD4N1iHUvDHgtjetdXtlpss1h4dgkSeUpZ6WoeSR5JJFw06SxwyDcLXYoJ2PEX7MHgj4U+MPGlz4mnQ+HpL1NM8P38l9JdXEzK8s4aZo0BDKVhBU/u0ltpdihGDS+2/t5/CLwlrXjPwn4I8LWselTeLox4en1mzjS4EMl2UWIySFwzyRxyedsZs7Hj2/fUHwz9tn4r+Ff2bv2svi3oXjzxNe614T8Savb6jY6Zbqlxe+HLqTTorh3SNlLmKVjIMg+WjbRsPmyss8eZRgKWSYKvkqlGdVSc43TleMrXbSTcnZt819LLrr4eU8bvE5rUw2cJUcLCcVCMLxpq8bxbTbT5douV0pPSzZu/En9kzQ/COmf8JdpNpo1ppujXaRHSHUSJo6XDkRXFpK7kjfO5jMYQE7xhgIj5nNbV9P0rqNc+Lfhvx58JdI0/wAJnUm0WU2ku66t5rdJLWCNxDHskKuxWQxyBpFZfk3DJKsvN4r8noe09mvbX5vPf5n4Z4r4nAVc8csBUU48sU2ndXV9Fq0rK10tE/O58Y/tu/ErU/GdxrFrdfYY11R7TWLuSC0jjluLqILbpIzgZ4jllGOh8xuOcV4P8NfEc17eR2Mkduyafdx3ccpjBlZjJHEFJ7KN5cBcfOFJJxiiiv2jhmjTjXwEYxVm6d9N/eR+85pJ+zxXkp/+kn3JqngWz8b/ALNGl+MNQmvpvEkt5LDPfNcMz3KD7TJ+8DZDMWAy5G4/3q7z4d6mdH/4KhfDj4d+Ra3mm+LLGHxHe313EJryKSXfmGHd+5hjXewDpEJ8HDSsCQSiuuVGHt60eVWTrW02snb7unY/R8wzLGQ4ZoxhVkl7i0k1pdab7eRyP7Fvgux8HfHi88cW6zTa5pes6Vc2DTSs0Vk8+t2Gnz7VBGRJbXEyEPuC7srtIBHoPx2+J/ib9pn9sHTY9a16+07T9W+I0nw9ksNMWOOCGwt9Eh1BJULq8gnae5csS5jZVVTHjO4or3uMZPCcS5gsL+792p8Pu7wu9rb9e5/PWW/7Vk2Eliffd4/FrtJ23vt0PUfhzqd94m/4JgfBDx/eX91N4st/FNxqv29irPJcC7v33vkEMTJGkjE8uwJbduYHidL/AGbvDv7an7Xuj+IviE2oavqN2sgvvKlW2j1ARWriHzFjUbdmxSPL2Z6NuXiiivyipiq31qhR53yJaK7srt3sttep8txdVn/rRDD3fJKUbx6P3nutn8zN1QSeHNI1/bNJdSaH4vv/AA7HJOq7ri3g1Ge0R5NoUeYUiViVCruzhQPlq99uk/vUUV8tjKcVWkkur/M+I4moUqVSKpRUfeqbJLapJLbstF2R/9k=',
    powder:
      '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',
    sugar:
      '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',
    wood: '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',
    toolShop:
      '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',
    jammery:
      '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',
    diner:
      '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',

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
      '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',
    wood_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAXABwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD88fid8PNa8BaMmhWt9oGmS3pbzIrXWLf91GoALDa2AWzgEf3G74I++v8AghB8ANE1fT5vCGkLosuq+LlaTWNRuIlufLsk+4kbA5VlKySADaHIGSdilfm//glf8DP2bf2gLrRfD/jfwZcax8Rde1JzpTa3Kbmxu3RmKxqoACSbASRKHjby/vKSFb9l/gb+xf4b/YH8EeJf2n7jTLKK88MeEL7UW8N6N5drBKlvazS+WzAeXGxDSKSqsM7SWYLtr8U4hzKWZzeVUqU+WM1zyvZNJ6r07dbrY/ZsuweGyajLMHOCqVIvkio+85NaN6d3q9ld6n094Z8D/Cr4A+B7i7sV0zQtJ0jTpLjVdYvZEhWO3iVpJZ7idsBUVQzszEIgB+6o48d+KH7OPwx/a61Wx+Onws8YeDNc0fVNNVIdbsni1CC+aOSRDJHPEWR1GAnyk4KHvmvjn/goBon7TOqfsvaT+0j8Z/2odW1bTdWuYby08GWmli00m1tpopNSh3eQAt1LAlo2wyo0sRUKXcHz5Pl34P8AwY/4Ko/Fvw9e+Pf2D/Avji18E3Wr3EMt1oHxGs/DVtqF7ARA9wI7ieJrwmKOBDdKHUmPyt26BkRzynA4/DKhOKUNGrWSX5WODDLMMtqSx6xKVVvlbet776vd6djS/wCCf/wt8GeBf+CpmjaR8PQbbT9E+JtyI7QRBY4hJZm4eJAANqo0zKuM/Kg+tfubLJNIGSaTKsMFccEGiivMTl9fr3fVP8zXiRJRoWVtH+h+Yf8AwU+8FfsZfssaReeLPjj8bPGUHh/U9VdpfAOhafMbXUbnMB/eFW2+d5UUUXm/JuiAjdmVEVflD/h+X+1poFlZ+Gf2fvhJ4X8L+DtMs47bQtH1K+lM8UKjO5vsoWMbiSdoztBAzgAAor6TI8NSzrL5YjGe81UlG1+Ve7ZJ+7Zt93JvysdWLq1MK6VGD+xGV2ot3lvumkvRJ92z/9k=',
    toolShop_r:
      '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',
    jammery_r:
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAZABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Z/aO+LnxU/Ye0Kw+EH7OujajcaVNrypqOtWngi4uX09/La9nJmIkinY2ax7lSFnjRJ7geeYzaj03xP4c1T9oHwJpPjS00jS9Zmlt5pND8V6RcWt0YJYEZV8ycbILuKWWOVFdFikgklgUwHMzR/PnwK1/wV+0z8NfFHwH/ak8fRzeJtS+KOqahJ4QedLe18m6m4aB7zDSx2rwzxupQXNsUNvLFFINp6//AIJ//DCfxv8AtCeLfGtx4zt9T07wY8mn2msG0ttRub97qJ4mt7fVZoDcx2MKxh1hjmkXzZFCTCKOSOfgzngzhzCcD8vu89OKu7NNt2UVF9ddVL56+8fPZF4i8SYvxDcalOSjNycWpRkmo6yc0rOG/LytNbJtc0U/zQ+MPxWvfCX7RWvW1ppMclvc3kj6pYpMPPlvI5ZEubmFBgYYKjsgHLB3OCztRX6TftU/8E0Phz4P8G614v0mSyvfDtxe/bNe07VtNS4MkskqfvXQjbOxkKnJ27cKAvGQV+UZb4g1+HcDTy/FYdylBWT51qunR+m72+R/V1HLsszqLxVBxkm3fSUWnu013V97Lfru/jX4kfEPwnYa7pfxO+LFzN4k8I65bR3Oj6rp+vR6dr0loluDElxAGEN+0Vu7Yygkgw2/5ga/Qf8A4JzfFb9kSf4ZJ8P/AIAfES5nu5Llrq/03xDqAbUfOKxRsXLBWk+bADnJdtxyxJNfj/8A8Exv+SueIP8AsatI/wDSyWut+An/ACeZcf8AZZb/AP8ATjLXp4mpiatCvgoVZRp0I86i25Q6aKL+F+adv7p+fYPJMtxzoY6pSiq9dJOpGKU9Urcz+3bzs33R+zn7ZWom3/Zh8Z3wuFAttKWdjIcALHLG5zz0wporlP2sv+TCPGX/AGIDf+iVor84zmlGtiYTfWK/Nn2PC054XL6lOL2qS/KJ/9k=',
    diner_r:
      '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',
  };

  if (checkIsPage(pageInGuildLand)) {
    console.log('Try to find production but is in guild, back to kingdom first');
    handleTryHitBackToKingdom();
  }

  for (var key in houses) {
    var houseImage = getImageFromBase64(houses[key]);
    img = getScreenshot();

    var foundResults = findImages(img, houseImage, 0.87, 1, true);
    releaseImage(img);
    releaseImage(houseImage);

    if (foundResults.length > 0) {
      console.log('found house >> ', key, JSON.stringify(foundResults));
      var house = foundResults[0];
      // Need to add offset to images

      for (var i = 0; i < 3; i++) {
        house.x += 12;
        house.y += 12;

        if (checkIsPage(pageInGacha)) {
          console.log('accidentally get into gacha when searching for houses, leaving');
          qTap(pnt(618, 21));
          break;
        }

        qTap(house);
        sleep(config.sleepAnimate);

        if (waitUntilSeePage(pageInProduction, 3)) {
          console.log('Found production house successfully: ', key, i);
          return true;
        } else if (checkIsPage(pageStockIsFull)) {
          console.log('Found house but stock is full, send running event and keep doing other tasks, i: ', i);
          sendEvent('running', '');
        }

        console.log('Assume found house but failed, go back to kingdom page: ', key);
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
  N: pnt(0, 250),
  E: pnt(-460, 0),
  W: pnt(460, 0),
});
function swipeDirection(direction, finishSwipeWhenInProduction, swippingPage) {
  tapableArea = {
    fromPnt: pnt(165, 90),
    endPnt: pnt(566, 285),
  };

  if (finishSwipeWhenInProduction && checkIsPage(pageInProduction)) {
    console.log('Already in production, skip swipping');
    return true;
  }

  for (var i = 0; i < 3; i++) {
    var x = tapableArea.fromPnt.x + Math.random() * (tapableArea.endPnt.x - tapableArea.fromPnt.x);
    var y = tapableArea.fromPnt.y + Math.random() * (tapableArea.endPnt.y - tapableArea.fromPnt.y);

    fromPnt = pnt(x, y);
    toPnt = pnt(x + direction.x, y + direction.y);
    steps = 8 - i * 2; // reducing steps per moving
    if (finishSwipeWhenInProduction) {
      if (swipeFromToPoint(fromPnt, toPnt, steps, 0, pageInProduction, swippingPage)) {
        console.log('swip successfully');
        return true;
      } else {
        console.log('pickup house, try again');
      }
    } else {
      if (swipeFromToPoint(fromPnt, toPnt, steps, 0, undefined, swippingPage)) {
        console.log('swip successfully');
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

  tap(fromPnt.x, fromPnt.y, 100, id);
  sleep(config.sleepAnimate);

  if (stopIfFoundPage !== undefined && waitUntilSeePage(stopIfFoundPage, 2)) {
    console.log('Swiping but accedential got into the desired page, return');
    return true;
  }

  if (!checkIsPage(swipingPage)) {
    console.log('swipe failed, try again: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }

  if (handleRelogin()) {
    console.log('handleGotoKingdomPage just wait for relogin screen: ', config.sleepWhenDoubleLoginInMinutes);
    return false;
  }

  steps = steps == undefined ? 4 : steps;
  step_x = (toPnt.x - fromPnt.x) / steps;
  step_y = (toPnt.y - fromPnt.y) / steps;

  tapDown(fromPnt.x, fromPnt.y, 40, 0, id);
  sleep(100);
  moveTo(fromPnt.x, fromPnt.y, 40, 0, id);
  sleep(100);

  for (var i = 0; i < steps; i++) {
    moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0, id);
    // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
    sleep(100);
  }

  moveTo(toPnt.x, toPnt.y, 40, 0, id);
  sleep(1000);
  tapUp(toPnt.x, toPnt.y, 40, 0, id);
  sleep(config.sleepAnimate);

  if (!checkIsPage(swipingPage)) {
    console.log('swipe failed, try again: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }
  return true;
}

function handleGotoKingdomPage() {
  console.log('trying to get to kingdom page');

  if (handleRelogin()) {
    console.log('handleGotoKingdomPage just wait for relogin screen: ', config.sleepWhenDoubleLoginInMinutes);
    return false;
  }

  if (checkIsPage(pageInKingdomVillage)) {
    console.log('already in kingdom');
    return true;
  }

  if (checkIsPage(pageInProduction)) {
    console.log('In production, hit back to kingdom page');
    keycode('BACK', 1000);
    waitUntilSeePage(pageInKingdomVillage, 8);
    return true;
  }

  pageMyKingdomCard = [
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
    handleRelogin();
    tapRandom(75, 95, 553, 285);
    sleep(config.sleepAnimate * 2);
    if (checkIsPage(pageInProduction)) {
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
    Directions.S,
    Directions.S,
    Directions.E,
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
  if (config.searchHouseCount % 2 === 1) {
    console.log('use path 2: ', config.searchHouseCount);
    directions = [
      Directions.E,
      Directions.E,
      Directions.S,
      Directions.S,
      Directions.E,
      Directions.W,
      Directions.W,
      Directions.W,
      Directions.N,
      Directions.E,
      Directions.W,
      Directions.W,
    ];
  }

  if (!checkIsPage(pageInKingdomVillage)) {
    handleTryResolveGreenChecks();

    if (!handleGotoKingdomPage()) {
      console.log('Cannnot get to kingdom page, skip handleFindAndTapCandyHouse');
      return false;
    }
  }

  var collectCandySuccess = findAndTapCandy();
  if (
    config.worksBeforeCollectCandy != 0 &&
    (Date.now() - config.lastCollectCandyTime) / 60000 < config.worksBeforeCollectCandy
  ) {
    collectCandySuccess = true;
  }

  config.searchHouseCount++;
  if (config.searchHouseCount < 6) {
    console.log('send running when searchHouseCount:', config.searchHouseCount);
    sendEvent('running', '');
  }

  if (collectCandySuccess && findAndTapProductionHouse()) {
    console.log('already found house using image match, start working');
    config.lastGotoProduction = Date.now();
    return true;
  }

  // console.log('candy&house is not here, goto castle and search again')
  gotoCastle();

  for (var i = 0; i < directions.length; i++) {
    // TODO: this does not show properly
    console.log('going towards: ', i);
    if (swipeDirection(directions[i], true)) {
      collectCandySuccess == false ? findAndTapCandy() : collectCandySuccess;

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

      if (checkIsPage(pageInProduction) && i > 2) {
        console.log('found production when swipping, start working, times swipped: ', i);
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        return true;
      } else if (collectCandySuccess && findAndTapProductionHouse()) {
        console.log('already found house using image match, start working');
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        return true;
      } else if (
        collectCandySuccess &&
        config.searchHouseCount > 3 &&
        config.isXR &&
        findHouseInNotSureWhere(config.findProductionTimes)
      ) {
        console.log('find house in random tap success, start working');
        config.searchHouseCount % 2 === 0 ? (config.searchHouseCount = 0) : (config.searchHouseCount = 1);
        config.lastGotoProduction = Date.now();
        return true;
      } else if (checkIsPage(pageStockIsFull)) {
        console.log('Found house but stock is full, send running event and keep doing other tasks');
        sendEvent('running', '');
      }
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
    rtn = execute('am force-stop com.devsisters.ck');
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
  } else if (checkIsPage(pageInProduction)) {
    console.log('Found in production, no need to relogin');
    return true;
  }

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
  pageTermsOfServices = [
    { x: 447, y: 233, r: 66, g: 66, b: 66 },
    { x: 329, y: 126, r: 66, g: 66, b: 66 },
    { x: 452, y: 126, r: 66, g: 66, b: 66 },
    { x: 458, y: 216, r: 66, g: 66, b: 66 },
    { x: 286, y: 216, r: 66, g: 66, b: 66 },
    { x: 179, y: 126, r: 66, g: 66, b: 66 },
  ];
  // Nox: cookie v1.15
  pageTermsOfServices2 = [
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
  pageTermsOfServicesMemu = [
    { x: 479, y: 238, r: 66, g: 66, b: 66 },
    { x: 482, y: 238, r: 107, g: 158, b: 153 },
    { x: 484, y: 222, r: 66, g: 66, b: 66 },
    { x: 486, y: 110, r: 66, g: 66, b: 66 },
    { x: 148, y: 123, r: 66, g: 66, b: 66 },
    { x: 171, y: 117, r: 255, g: 255, b: 255 },
    { x: 172, y: 205, r: 66, g: 66, b: 66 },
    { x: 229, y: 206, r: 254, g: 254, b: 254 },
  ];
  pageTermsOfServicesHitBack = [
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

  pageCannotFindLoginInfo = [
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
  pageCanDownloadResources = [
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

    for (var i = 0; i < 18; i++) {
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

    for (var i = 0; i < 18; i++) {
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

    for (var i = 0; i < 18; i++) {
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
  for (var i = 0; i < findLoginTime; i++) {
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
    if (!checkIsPage(pageInKingdomVillage) && !checkIsPage(pageInProduction)) {
      console.log('handleInputLoginInfo not sure what to do, tap(585, 22) announce page');
      qTap(pnt(585, 22));

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
  for (var i = 0; i < findEmailTimes; i++) {
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
  pageEnterpassword = [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 390, y: 189, r: 200, g: 200, b: 200 },
    { x: 314, y: 190, r: 200, g: 200, b: 200 },
    { x: 309, y: 189, r: 200, g: 200, b: 200 },
    { x: 301, y: 115, r: 255, g: 255, b: 255 },
    { x: 387, y: 53, r: 60, g: 60, b: 60 },
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 322, y: 52, r: 60, g: 60, b: 60 },
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

  pageEnterTwoPasswords = [
    { x: 243, y: 307, r: 255, g: 255, b: 255 },
    { x: 377, y: 229, r: 200, g: 200, b: 200 },
    { x: 367, y: 176, r: 255, g: 255, b: 255 },
    { x: 371, y: 50, r: 60, g: 60, b: 60 },
    { x: 319, y: 53, r: 230, g: 230, b: 230 },
    { x: 404, y: 184, r: 187, g: 187, b: 188 },
  ];
  for (var i = 0; i < checkPasswordTimes; i++) {
    if (checkIsPage(pageEnterTwoPasswords)) {
      config.run = false;
      sendEvent('gameStatus', 'login-failed');
      console.log('This account id does not exist');
      return false;
    }

    if (checkIsPage(pageEnterpassword)) {
      console.log('input user password');
      qTap(pageEnterpassword);
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
      console.log('successfully input password, tap (1,1) for 10s');
      for (var i = 0; i < 10; i++) {
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

        qTap(pnt(585, 22));
        sleep(2000);
        console.log('tapping (585, 22) until the game start: ', i);
      }
      return true;
    } else {
      console.log('waiting for input password field');
      sleep(2000);
    }
  }

  pageServerSelection = [
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
  if (checkIsPage(pageInProduction)) {
    if (config.buildTowardsTheLeft) {
      qTap(pnt(110, 174)); // next
    } else {
      qTap(pnt(349, 174)); // next
    }
    sleep(config.sleepAnimate * 2);
  }
}

function handleTryHitBackToKingdom() {
  console.log('trying to resolve stuck by hitting back');

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

  checkAndRestartApp();

  for (var i = 0; i < 4; i++) {
    if (waitUntilSeePage(pageInKingdomVillage, 2)) {
      console.log('Found pageInKingdomVillage, return');
      return true;
    }

    var img = getScreenshot();
    var upperRightImage = cropImage(img, 583, 1, 54, 40);
    var foundResults = findImages(upperRightImage, loginGearIcon, 0.92, 1, true);
    releaseImage(img);
    releaseImage(upperRightImage);
    if (foundResults.length > 0) {
      console.log('handleTryHitBackToKingdom found in login page, tap tap(585, 22) announcement point');
      qTap(pnt(585, 22));
      return true;
    }

    if (checkScreenMessage(messageNotifyQuit)) {
      keycode('BACK', 1000);
      if (waitUntilSeePage(pageInKingdomVillage, 5)) {
        console.log('Found quit notification, should be in kingdom');
        return true;
      } else {
        console.log(
          'Found quit notification but not kingdom page, should be in login, tap announcement icon and sleep 3s'
        );
        qTap(pnt(585, 20));
        sleep(3000);
        return true;
      }
    }
    keycode('BACK', 1000);
    sleep(2500);
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
      for (var i = p + 9; i < line.length; i++) {
        var c = line[i];
        if (c === ' ') {
        } else if (c === '/') {
          isApp = false;
        } else if (isApp) {
          app += c;
        } else {
          activity += c;
        }
      }
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

  pageHasUnreadMails = [
    { x: 556, y: 12, r: 255, g: 40, b: 41 },
    { x: 551, y: 16, r: 255, g: 239, b: 214 },
    { x: 516, y: 25, r: 231, g: 158, b: 82 },
    { x: 586, y: 21, r: 222, g: 174, b: 74 },
  ];

  if (checkIsPage(pageHasUnreadMails)) {
    qTap(pageHasUnreadMails);
    sleep(config.sleepAnimate * 2);

    pageGreenClaimAllButton = [
      { x: 506, y: 323, r: 121, g: 207, b: 12 },
      { x: 590, y: 318, r: 121, g: 207, b: 12 },
      { x: 572, y: 24, r: 60, g: 70, b: 105 },
      { x: 419, y: 318, r: 54, g: 62, b: 95 },
    ];

    if (checkIsPage(pageGreenClaimAllButton)) {
      console.log('found unread mail and claim all');
      qTap(pageGreenClaimAllButton);
      sleep(config.sleep);
    }

    handleGotoKingdomPage();
  }

  console.log('completed: handleAutoCollectMail');
}

function gotoCastle() {
  console.log('about to gotoCastle');
  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('hit back to kingdom');
    handleGotoKingdomPage();
  }

  pageInCookieHead = [
    {x: 77, y: 227, r: 57, g: 77, b: 123},
    {x: 144, y: 155, r: 255, g: 239, b: 181},
    {x: 234, y: 153, r: 222, g: 192, b: 239},
    {x: 509, y: 146, r: 177, g: 234, b: 103},
  ];

  // Tap head
  qTap(pnt(31, 41));
  if (!waitUntilSeePage(pageInCookieHead, 10)) {
    console.log('Failed to get to cookie head in 10 secs');
    handleGotoKingdomPage();
    return false;
  }

  // Tap Go Now
  qTap(pageInCookieHead);
  sleep(config.sleepAnimate * 3);

  handleTryHitBackToKingdom();
}

function handleInFountain() {
  if (waitUntilSeePage(pageInFountain, 8)) {
    qTap(pageInFountain);
    sleep(config.sleepAnimate);
    qTap(pageInFountain);
    sleep(config.sleepAnimate * 3);

    if (checkIsPage(pageStockIsFull)) {
      sendEvent('running', '');
      console.log('Fountain stock is full, send running');
    }

    handleGotoKingdomPage();

    waitUntilSeePage(pageInKingdomVillage, 6, pnt(1, 1));
    console.log('Tapped fountain successfully');
  } else {
    handleGotoKingdomPage();
    console.log('Failed to claim fountain, did not see fountain screen');
  }
}

function findAndTapFountain() {
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

  pageAllTrainsAreOut = [
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

  pageFirstTrainOut = [
    { x: 430, y: 95, r: 121, g: 227, b: 0 },
    { x: 454, y: 94, r: 231, g: 142, b: 83 },
  ];
  pageSecondTrainOut = [
    { x: 430, y: 198, r: 129, g: 227, b: 0 },
    { x: 453, y: 199, r: 229, g: 148, b: 85 },
  ];
  pageThirdTrainOut = [
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
    sendTrainBtn = foundResults[i];
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

  pageTrainNotCollapsed = [
    { x: 159, y: 325, r: 255, g: 224, b: 139 },
    { x: 144, y: 325, r: 81, g: 47, b: 37 },
    { x: 96, y: 329, r: 134, g: 183, b: 249 },
    { x: 56, y: 340, r: 48, g: 76, b: 109 },
    { x: 26, y: 321, r: 252, g: 252, b: 252 },
  ];
  pageTrainCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
    { x: 26, y: 322, r: 255, g: 255, b: 255 },
    { x: 22, y: 329, r: 82, g: 26, b: 11 },
    { x: 28, y: 273, r: 255, g: 247, b: 206 },
  ];
  pageTrainUncollapsed = [
    { x: 109, y: 231, r: 255, g: 223, b: 142 },
    { x: 120, y: 235, r: 219, g: 46, b: 73 },
    { x: 105, y: 321, r: 75, g: 116, b: 160 },
    { x: 106, y: 328, r: 255, g: 255, b: 255 },
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

    pageTrainArrived = [
      { x: 112, y: 230, r: 255, g: 223, b: 142 },
      { x: 103, y: 233, r: 222, g: 48, b: 71 },
      { x: 111, y: 221, r: 52, g: 88, b: 130 },
      { x: 119, y: 211, r: 255, g: 108, b: 108 },
    ];

    qTap(pageTrainArrived);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  }
  console.log('Finish handleTrain');
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
    { x: 611, y: 20, r: 57, g: 169, b: 231 },
    { x: 440, y: 54, r: 255, g: 186, b: 0 },
    { x: 426, y: 57, r: 181, g: 117, b: 24 },
    { x: 499, y: 344, r: 49, g: 32, b: 24 },
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
      if (checkIsPage(pageCanSendFriendRewards)) {
        qTap(pageCanSendFriendRewards);
        console.log('successfully send daily gifts to friends');
      }
    }
  }
  handleGotoKingdomPage();

  // Rewards in shop ======
  pageShop = [
    { x: 20, y: 84, r: 247, g: 190, b: 140 },
    { x: 23, y: 112, r: 181, g: 0, b: 24 },
    { x: 28, y: 119, r: 255, g: 235, b: 173 },
  ];
  if (checkIsPage(pageShop)) {
    qTap(pageShop);
    sleep(config.sleepAnimate);

    pageNecessities = [{ x: 114, y: 70, r: 255, g: 109, b: 107 }];
    pageIsDailyFreePackage = [
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
  pageGacha = [
    { x: 381, y: 329, r: 132, g: 74, b: 63 },
    { x: 373, y: 328, r: 247, g: 211, b: 148 },
    { x: 355, y: 328, r: 148, g: 81, b: 74 },
    { x: 418, y: 320, r: 132, g: 16, b: 8 },
  ];
  if (checkIsPage(pageGacha)) {
    qTap(pageGacha);
    sleep(config.sleepAnimate * 4);

    pageDailyGift = [
      { x: 48, y: 207, r: 255, g: 0, b: 0 },
      { x: 48, y: 230, r: 88, g: 86, b: 88 },
      { x: 36, y: 230, r: 205, g: 204, b: 205 },
    ];

    pageDailyGiftNotClaimed = [
      { x: 604, y: 330, r: 123, g: 207, b: 8 },
      { x: 443, y: 340, r: 137, g: 85, b: 99 },
      { x: 388, y: 323, r: 82, g: 24, b: 33 },
      { x: 451, y: 230, r: 156, g: 247, b: 255 },
      { x: 45, y: 221, r: 56, g: 74, b: 107 },
    ];
    pageDailyGiftClaimed = [
      { x: 510, y: 325, r: 125, g: 125, b: 125 },
      { x: 614, y: 324, r: 125, g: 125, b: 125 },
      { x: 416, y: 20, r: 255, g: 207, b: 0 },
      { x: 45, y: 221, r: 56, g: 74, b: 107 },
    ];

    qTap(pageDailyGift);
    if (checkIsPage(pageDailyGiftClaimed)) {
      console.log('Daily gacha gift already claimed');
      handleGotoKingdomPage();
      return true;
    }
    if (waitUntilSeePage(pageDailyGiftNotClaimed, 5)) {
      qTap(pageDailyGiftNotClaimed);

      if (waitUntilSeePage(pageDailyGiftClaimed, 5, pageDailyGiftNotClaimed)) {
        console.log('Daily gacha gift claimed successfully: ');
        handleGotoKingdomPage();
        return true;
      }
    }

    console.log('daily gacha gift NOT claimed');
    handleGotoKingdomPage();
    return false;
  }
}

// Numbers in wishing tree:
var b64N0_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ8DfD/wALeFNZsvhj4Y/4JveCfivo9l8MPCGtQ+NtV0K8utU1m81PT2ury9uLoPtljebckUa8RCCRQACBRX6fj/gm18AbFW0/wp4w+Jnh3SUleSy8O+Gfijq2n6dYF2LOtvBDOqxIWOdi/KDnaBk5K8H/AFqoT96Snd+n+YRymhTioRhFJaJWWiWy2P/Z';
var b64N0_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3b4FeCv2ZfjF+0F8Zv2f/ABx/wTi+Glzovwd8VQaH4UfT/CAtLw2zxuS13cIxN7I3lK/msAQXcY6sSvYfA3g34w61478X+Bbb9r34j6Zb+FdSjsbe90mPRYLu/jCEK95MNN3XUiqiqHclsZySSSSvL/tDCreL+5f5nTy1Xqnb5s//2Q==';
var b64N0_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzn9psWth8GPBHxetfCnhv9n/X9d8W+LNG1PQPCuly2dlqNnplzaJaTfZrgkLPH9pnglmUDzXiySdq4K/Z0/8ABMT9j7WrhtS+KXgbUviBqJRY4tV+IfiO71m6ghXO2GOS5kYxxgknauMkknJJNFeNHj3F4ZezpTqKK2Slb8Lni4vgDhXMcRLE4rBUp1JbycItu1lq7dkf/9k=';
var b64N1_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD65/4I5/s1/ss/tOfDXxb4X/aX/Yu+H2q+LfA+oWFtqup6/pz6nqEk91aC6kiuftyF7aSJnMZhTMQ27omkjZJGK6X9u/4tfFn9jf8AaGn1b9nP4hXPh4eM9BsZNctP7NsrqJ5LRXghZPtEDsh8shSA2DtHA5yVy0s2+uU1XaactXq3q99W7vXqzOlgqeFpxoxStFWWiSstrJJJWXRaH//Z';
var b64N1_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQ+MPwc/Zq+Lf7L3w18cW/7NfgXT9Xs/E3inw/rOqaVHLevqx0+SwiS4mubxFuZHO5ztmVXjLMjIjAqCvpD9s34NR63+0X4q+Hdv8AETX9P0Sw1mTXrOwso7EiK81OOI3ZDy2zuVZrWNgpY7SWxwcArzlmOHrpVHC3NZ97X6Xe9i6dKpQgqaltp2/BaI//2Q==';
var b64N1_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzH/gpx+z54e+OXh74GfGT9mb4P+APh/8A8JV8KV1PxHYaTqawQXNw2oXUaSifazXbbYjmViSQQcnNFfdz/wDBP/4T/tN/ETxP4L+KPjTxPLpfw01SXQ/CFpaNYRi0sZLie7MZY2haQiSZ8MxJ2hQScZor5TGTweIxDqNNXt08l5nvYLNsywWGjQpz0j/nc//Z';
var b64N2_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6B8M/ATWNT+IXinwZq3wT+HvxeuPDU8NnqvxC1DxZrMUt9qWZTcQSXFxd7Z5oh5O+OEeXAZAmc7lUrrPjPH8Q/hP8RdZ+FngX4w6tb+HtM1q9uNL0u70HRLxbM3M7Tyqj3FhJJgu5+8xOAMk4orysNiqCoQ5k27LojacJczP/2Q==';
var b64N2_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6S+A+g/sXWtjrmqftWT6BoFg+tPZ+DvGvhT4g+IbBPGSQIi3d28klyZLwJM2xbhsK5Z9m5QGJVXxPpPjWK7j+H2o/FG51TTfCcQ0rQE1rwd4dvHtbSL5UiV5tMZsAKO/J5OTRXmQxGGUEnG772RtyTbP/2Q==';
var b64N2_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDt/iJ8StG+Efw48K6r4cvvEvwv1zxHc6ndXem/CnXtXtoNW0lZY003Up7a5leSFph9pKM+2SRRuZRwAV6pqf7O9r+2Hqs+uftAfErWNavtF2wWV7/YWhxTGNuNrumnAyACJQAxO3nGMmivDqYjCc2sE35xX+Z0KFS2/wCJ/9k=';
var b64N3_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6L/Yd/Z1/Zh+KOj+JPC3xK+Ff7Kl9H4P1BNK0yxt/CbWuqWqRGWFn1COW4bbJL5Kuu12GN2DjABXnXwh+M/xV+GPizxZ8KPhp4m03QLHw1fxWK3uneCdE+16ksfmIkl3I9k3myAJ94BclmJzmiuaGN5IKN3/XzFLD0pybcV9x/9k=';
var b64N3_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6O/Ze+B/7Kvx0+C1n8Q/iT+zB8PPFuoT6jPFHH+zravpy6XCEidbbVEe4VjcgyNgHO3EnJzklJ+wXZ/EH9prwl4jsx8Z9c+Hln4Z1kQW1h8L9I0fSIbtpFO+a4X7C5lk/dqAcgDnAGTRXHLNlRfJeWn9dzKWX4Wq+aVOLfml/kf/Z';
var b64N3_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqdU+MnxJ+JPwM+Lfxy13x1r8HjbwhpcesaPrXgn46Xur3Oqz3FzbPZwt4aFnC9pp3kXUMT3ZjVw0T4JzkFfd2kf8ABG/4R6Jaat4B0n4n32n+AtX8xLzw1o/hPR7S/ubdrg3C2dxq6Wv264tklIZY3k6IqMzINtFfnGNocM4pwboq6VtIpfee9hswzHDppS0b6tn/2Q==';
var b64N4_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Dv2E/wBin4X67o/iLTP20fglc/EX4lQzWV54j8R/EbwxBewWf2qEywaTp87W6Qzx2kHlJLLbqsb3DysQGJVSuc/aQ/4WD+w98Rf7E/Zs+OfjrS9L8RWMdze6X4g8SSeIY4Zospvhk1j7VNCGDfMiyBCVBCg5yV5WDxWC+qw9jDljbRWSsjerGrKo3N3fU//Z';
var b64N4_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6M+Mf7EOi3Pwm8J6Za/BDxN468a6Tr+uaf8RPH+ueCJheeJNTj+xmS7XMW77F5rTx22P3flRfu8rySvQfjf8ADr4g/DH4map8Hvhj+1X8WtE8OaVcfb9Osf8AhMTfzQtdKvmRm6v457mWMGEFFklfYXfbgNgFeRSxmBdOPLCysraLa2nU6JRrczvLX1P/2Q==';
var b64N4_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDa/wCCmfgPxv8AB20+E+t/sQ/Arx3pema74JmXX9R1Dw1qdvq2sXVvfTRreaj5NnJI11KreafOCuBMvGDgFfX1n+xdpHx88V658PfiX+0h8Y7rSfh1eHS/CsFt8RLi3lgtpXkmYTTxhZrt8lUElw8j7I0G7qSV8liZ5LVrOc6Tu7dF2VuvY9GnUxcIWUvzP//Z';
var b64N5_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDtR+zh4V+OV3b6l+xh8Af2VfHum2vh/TH8V3fizxhqra7b61Nbh7z7cv2+FEd5/NIK7iSH3bSOSvc/g18NfF/gjxF4r+FXws+Oev8Ag/SfDWppa2//AAjXhvw7bz3y4cK93KdLZ7mRQoAdyWwTkkkmivJ+u4X+V/cjpvX/AJvxZ//Z';
var b64N5_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBf2if2UvhH8TfFtx4j/Zw/Zt+Cvij4bRavd2vg/V/hbeXmqXJijEO+LU/tOp24hnUMhVY1ZSGY7uMAr7B/ZY/Y98N/tQeCr+y8ffFbxXpVj4U1aWz0bS/BMWl6FbJvx5kzx2NjEJZX8uPc75+4MYycleBWzPB06ji1L5KJ2RWIavzfiz//2Q==';
var b64N5_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDO8ffs0fsI6vry+Mv2p9E8AeGNB1e3aT4cax8BLvUtQ0vW7FLiZZHnmlvfM+0xkRq6GNFXd8u/JIK+0vhF/wAE9Pg3+2f8I9D+Jnx88T+IL66sxNYaRpmkw6bpmn6ZbIwPlW9raWcccYLMzMcFmJ5OAACvk8TisI68tZr0UbHpU6uLjBJS/Fn/2Q==';
var b64N6_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0H48/8E1rl9c0n9nH9lT9oP4OeG/FHgLw/Z3fxWl1y7voNSu9R1KFZ4A3lxmNLOOGLZbW6k+TGTk/OBRXoPin43fH/wCDfxy8YfDHwV8aLsJoD2mnDXtQ8LaHdapqVtCjpbreXUtgzXBiTKozfNhjuLE5orn/ALQhNczV790mzKOCpQXLBWS6J2S9EtEf/9k=';
var b64N6_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6Y8Hfs5/HDwJ8WfG/hP8A4Jo2nw88U+FvClzbeE/E9tb+PbvTdVttbsPOe6uNVkktZFu7uaS7bLpgKsKpliuaK3P2Zr/45/HbXvHllP8AtSeM/CTaH4mZbi58C6fommS6zcSAq93fMmnH7RORCg38Ac4AyaK4KmZYT2j9pT5n1bSbfzuc/wDZsUkoTcUtknZL0XQ//9k=';
var b64N6_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rw7+3vc/8E6NO1Hxb8Cfgd4R+Ivwi+JniS8k+HDfC/xHNBbaRHpccFjcW08VzAG+0FhHK8ynbNJJIwAGMleg/sxfsTfDP/gpp8IYfF37T/ivxEYfCur3ln4b0DwhJaaHp2niZxLcypDZW0e6WZwrSO5YkouNoyCV5NbOMqp1XGrh1KS3euv3TX5HBUybF1ZudPFThF7RjyWXpeDf4+mh/9k=';
var b64N6_4 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAOAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6X/a5+LnxN+NEml/Hu7+NN1YaNbeJ9U8QaR4b8P69YC88N+GNFuZ7Eauulz7ZtQkuJt73JSRCLKWS2X/WSByvqjxH/wAExvBfiHxRqFt/wuHXLbwPq1zeyX3gqLRdMZhBeXP2q80+LUWtjewWE85Mj2ySgEsQCq/KCvzrHU+GsZ7N1KPM1FLaP6ntYbF5lhYuNOdk3c//2Q==';
var b64N7_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7G/Z6/ZW/ZH8OeLvHvgj4+fCL4Laxa+GNct9H0vxfH8MVsZdYvI7WOa+80NdT+a8bXEAaTcMu75UY5KX4j/sVeCfit8afG/w+8S/E/wAZw6P4d8TXOp6RZ6Zf2tuIZ9Vc3d3uZLbdKDIFCmQsyqirk4orxaWaUIUoqabdld2Wui8zodKbbsf/2Q==';
var b64N7_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2PxF4h/Yg/Z/+H2mah8Zf2UPhZqE2teKNettAv/Cnw+GmxX+nWNxFapeNAJp9okmE4X942Vjz3wCvp39j79jr4UeJ4PEmkfES41HxPB4Qvo/C/hyPWVtdtlp9m8xjVVggjXezTOzuQS5AJ6UV8vXz+lh6rpunzWtrprodkcPKavc//9k=';
var b64N7_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCL9srwtrT+DvhZpv7O/wCxvZweI7vwc2ueNrf4X/DvUYoIor2YnTfPhsYrnyXa3iaQLI//AC0YKWwTRX6l/wDBO/4b6e/wmv8A4na7ruoarrvifUV/tO/vPJjPl2sS2tvDGkEcaRxpHGMKF6sx70V8Pjs6lDFzjGOifaP+TPWowj7NX39Wf//Z';
var b64N8_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDrvi94I+DHxK8KeDvjH8WtR/ZOvfFXjbSptZ8U3n7UHjPW7XV7m/M7WzS2kNrMsKWXk2tvFGVUZSFRyAKK9d/bI8AW37OfxQj+Evgy707VfD9hZeboll4x8DaBrT6TDK7SNa2895p8kwgDsxVGdtu4gHGACvMoYrDOjFxjZWXRG79snbm/E//Z';
var b64N8_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6N8DfsV/sT/FTxfqVx8R9H+CWoXH9gaPqjP4q+IniC38XfatQilvLyTWY47pURpbmSWWJVAH7yY4BJyVs+INI+I/wz+L3if4Z+D/jfqkNt4f+y2Nvqd14P8M3WoXVtGjLBFc3U+lPJcCJBsRnJYKTksTmivMWKwbSfJ+COjmrrRSf3s//2Q==';
var b64N8_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6P8O/sY/sl2Os+JtP8K/aLBNK8TzaRBH+zH8Q/ERvI7O1ggW2h8RD7Vhb+NGKqBwF3AcAAFdz8D/g14y+N2teMLTXf2lPGuitofiF4mufCOnaDpUuqSuMPdXrW2mKbqdhGgMj+hwBk5K8Orisr53z0rv/AAxO2E8Wo2jUaXqz/9k=';
var b64N8_4 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD07x3p3gJPC3w58WyeN/2e9P1Hxb8K9F8Q+IG+OdtLdeIr3UrtZXuLqWTcw8mRgDEowFUYAAwAVhftp+LLj9nH46XH7P2meGfDPi3SPBWlWuj+G9Q8eeENO1PULXTYlb7PZm4aBWkihViqbssF6sx5orlpVqMqacVpYppp2P/Z';
var b64N9_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqvhx+zB8Vbj4PfDzwn+wD+zX+x9r91pHw60wfGW1+N2nRTeKtN8Yu04v4rqNsvFDuQCEH5CinysxhDRX3P8Z/h541+F/x98W3/wAGf2gPF3g5PE8tlqms2+j2WjzCe4FpFaL+8vNPnl2LFax7U37VLOQBuNFeRh8yoToRk4tXS7f5nROE+d3dz//Z';
var b64N9_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7X/Y1/Yc/ZK+Nfibxp/wrj9lj9l/xd8GtEttDtfhjqUGhRX3iBJjY7tUj1wyK0kd4J/L+SXEoBO8bs0V2KfsRaL448c+L/BqftF/FbQNG0fxXfahp+m+EPFUWkqLjUp3u7qSWS1gSW6JkYBTO8hRECqQM5K8P+2sJFLmi72XRdUvM6fY1X1P/2Q==';
var b64N9_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7L+B/7BX/AATy+M/hLXPGv7Unwx/Zy07wz/wnur2vwY1n4Pa6thb6p4YiMKwG8mtZUW5u0bcJBlhGzkDG45K7j4Lf8EzP2XvjR4Oj0T9oPR7/AOIGn+CD/wAI94L03xI9uttodjASNtvFaQwJ5kp2tNM4aWUom5iEUAr5qtn+BpVXF022vJHdClX5dJ2+bP/Z';
var b64Nd_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDX/ZIuv2bf+Cbf7KPhbxl+0X+ybpPxy8cfGXUtR8QTXr+GodUOm6TbtFZ2Lx/aIC0dtcmO4uITtQtGw3DcpwV+lP7DX7OPgbw3pWua1r97eeJ722gsPC9hdeIILVvsekaUs0dlaRJBBFGiIJ5icLljIST0wV8fU4ghg5ewpU/djZL7j0qlOriqjrVZXlJtt+bP/9k=';
var b64Nd_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDf0f8A4Ji/GDVPgh8Of2cv2XPhz4Pfxz4W8Jp4q+MniHxloMN1eT6h4glkubTT5ZCAfOtLe12umdo89CoAfkr9VP2JfANp4a+Gmp+P7/XtQ1nxF4412TWPFGu6sYjcX1yIYrZMiGONFRIbeKNUVQAE9SSSvg8VnuJpYiUKKSitEmu2h6ao+19+o7yerfqf/9k=';
var b64Nd_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0PXfiz8GP2cPg94Nv/CnwO8aeK9D8Tvfy+AvDfgbxJqGmR6J4VtHistPvJoreZN8mpzQX+otNJukke4kZ2ZsmivvD/gnD8FfC2j+Dda8V61d3Gu6gsen+GLWfV7a1xaaVpEUkFlaxRwQxxxoolmY4X5nlY+gBXxdfOqWEqujCimo2V3u9FuegqEqq55Sd2f/Z';
var b64NE =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9eYJvKlmUOCplyBvUEfKoxyD6UUWipcXd0ZkDETYBP0x/Siv5lTg9z9T07H//2Q==';

var b64_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzuD/gm/8AsJa/Zx2fxe+Flv8ADrQ7CG0TwP4vh8S3lu3juzksLWebUHa5neOYrPK67oFRBv2YytFfkhD/AKfNLbX376O2bZbRy/MsSnkhQfujPOBRX5rDg3PJRus2qx8le3rrNvXd62u9ElZLreIp/wDPtH//2Q==';
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
var b64_9 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxD4jfBH/gjpp/wT+G3xH8YtY+G7PxTpMsuhjT5NbstTvIYY7aOeXUVvJCssv2s3IWW3VYGUELnbwV+ZCf6+Zu/mlc+w5x9Mk/maK+Ew/CGKp0+V5liHq/t9G20uuy0v1302Ol4iL+wj//2Q==';

// The material requirement numbers in production
var b64N0_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDnH8V/s6/Aea8+J/8AwWDvfB/iP4F/EnUP7V/Ym0u78HHVItJ8JLa2zOlrbQWJfS4Psk2iwm2lEZM9rcy+WWkeecoooA//2Q==';
var b64N0_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5g+HX/BSv/gmL8NNU8Vap+0wLj9oPwZ4l8Tzap8Ivhpd/DOK4f4R6ZLFEz6UG1Zo4YUw1vZrb2Ek1qiaOrqyiZVooooA//9k=';
var b64N0_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDk/wDgobc/sl/s8Wiy/wDBaT9mHxp4y8L+I/jJ40uf2T9M8B6xb20GhfDqK30OHTYIoLPULZLKyMC24gsmVZInjuXeKN52aUoooA//2Q==';
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

function identityColor(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)) / 768;
}

function identifyPointColor(pnt, color) {
  var img = getScreenshot();
  var imgColor = getImageColor(img, pnt.x, pnt.y);
  releaseImage(img);
  return identityColor(imgColor, color);
}

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
    var word = allResults[i];

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

function findWishingTreeWords() {
  var partUp = [126, 240, 354, 470];
  var img = getScreenshot();
  var parts = [];
  for (var i = 0; i < partUp.length; i++) {
    if (identifyPointColor(pnt(partUp[i], 180), { r: 255, g: 249, b: 203 }) > 0.92) {
      // qTap(foldedWishTipPnt);
      // sleep(config.sleepAnimate);
      continue;
    }

    var line1 = '';
    var line2 = '';
    var cImg1 = cropImage(img, partUp[i], 202, 110, 18);
    line1 = recognizeWishingTreeRequirements(numberImages, cImg1, 12, 0.8, 0.9);
    releaseImage(cImg1);

    var cImg2 = cropImage(img, partUp[i], 240, 110, 14);
    line2 = recognizeWishingTreeRequirements(numberImages, cImg2, 12, 0.84, 0.9);
    releaseImage(cImg2);

    // console.log(line1);
    // console.log(line2);

    line1 = line1.trim();
    line2 = line2.trim();
    var line = (line1 + ' ' + line2).replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').trim();
    var lines = line.split(' ');
    var needed = [];
    for (var j = 0; j < lines.length; j++) {
      var str = lines[j];
      var vs = str.split('/');
      if (vs.length === 2) {
        needed.push({ own: +vs[0] || 0, request: +vs[1] || 0, success: true });
      } else {
        needed.push({ own: 0, request: 0, success: false });
      }
    }
    parts.push(needed);
  }
  releaseImage(img);
  // console.log(JSON.stringify(parts));
  return parts;
}

function wish(refreshPnt, unfoldPnt, fulfillPnt, recogDetail, status) {
  return {
    refreshPnt: refreshPnt,
    unfoldPnt: unfoldPnt,
    fulfillPnt: fulfillPnt,
    recogDetail: recogDetail,
    status: status,
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  };
}

function getCEs() {
  var img = getScreenshot();
  var croppedImage1 = cropImage(img, 435,  88, 42, 10);
  var croppedImage2 = cropImage(img, 435, 148, 42, 10);
  var croppedImage3 = cropImage(img, 435, 208, 42, 10);
  var croppedImage4 = cropImage(img, 435, 268, 42, 10);

  var value1 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage1, 6, 0.85, 0.7) || 0;
  var value2 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage2, 6, 0.85, 0.7) || 0;
  var value3 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage3, 6, 0.85, 0.7) || 0;
  var value4 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage4, 6, 0.85, 0.7) || 0;

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
  var kingdomArena = [
    { x: 181, y: 267, r: 56, g: 167, b: 231 },
    { x: 181, y: 306, r: 56, g: 167, b: 231 },
    { x: 182, y: 335, r: 48, g: 76, b: 109 },
    { x: 373, y: 327, r: 41, g: 35, b: 33 },
    { x: 296, y: 70, r: 65, g: 58, b: 56 },
  ];

  if (!handleGotoAdventure(Advantures.pvp, kingdomArena)) {
    console.log('unable to goto pvp, skipping handlePVP');
    return false;
  }

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
    {x: 118, y: 127, r: 220, g: 23, b: 24},
    {x: 170, y: 112, r: 206, g: 20, b: 24},
    {x: 164, y: 98, r: 74, g: 76, b: 87},
  ];
  var pageNotEnoughMedal = [
    {x: 292, y: 248, r: 123, g: 207, b: 8},
    {x: 320, y: 185, r: 250, g: 210, b: 8},
    {x: 338, y: 243, r: 123, g: 207, b: 8},
  ]
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
        }
        else {
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
        }
        else {
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

  sendEvent('running', '');

  tap(560, 330, 100); // Free Refresh
  sleep(3000);

  if (checkIsPage(pagePvPCrystaisRefresh)) {
    console.log('crystaisRefreshPage');
    tap(436, 90, 100); // X cancel
    sleep(3000);
  }

  var arenaReadyToBattlePage = [
    { x: 533, y: 331, r: 77, g: 170, b: 4 },
    { x: 490, y: 322, r: 194, g: 11, b: 27 },
    { x: 611, y: 279, r: 227, g: 219, b: 211 },
    { x: 164, y: 332, r: 123, g: 207, b: 8 },
    { x: 78, y: 330, r: 0, g: 150, b: 214 },
  ];

  console.log('go kingdomArena success');

  // TODO: we can loop pvp many times in case we have lots of tickets
  var ces = getCEs();
  for (var i = 0; i < ces.length; i++) {
    var ce = ces[i];
    if (ce < config.autoPvPTargetScoreLimit) {
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
      sleep(5000);

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

  sendEvent('running', '');
  console.log('finish pvp, goto kingdom');
  handleGotoKingdomPage();
}

function handleWishingTree() {
  console.log('handleWishingTree: ', new Date());

  var wishes = [
    wish(pnt(183, 79), pnt(183, 180), pnt(183, 283), undefined, 'unknown'),
    wish(pnt(295, 79), pnt(295, 180), pnt(295, 283), undefined, 'unknown'),
    wish(pnt(400, 79), pnt(400, 180), pnt(400, 283), undefined, 'unknown'),
    wish(pnt(520, 79), pnt(520, 180), pnt(520, 283), undefined, 'unknown'),
  ];

  pageNotCollapsedWisingTree = [
    { x: 92, y: 316, r: 162, g: 90, b: 227 },
    { x: 101, y: 325, r: 134, g: 183, b: 249 },
    { x: 57, y: 341, r: 55, g: 89, b: 132 },
  ];
  pageCollapsedAffairs = [
    { x: 96, y: 329, r: 255, g: 223, b: 142 },
    { x: 127, y: 344, r: 40, g: 66, b: 97 },
    { x: 26, y: 323, r: 252, g: 252, b: 252 },
  ];
  pageUncollapsedAffairs = [
    { x: 115, y: 329, r: 69, g: 105, b: 146 },
    { x: 102, y: 286, r: 134, g: 183, b: 249 },
    { x: 129, y: 292, r: 52, g: 86, b: 125 },
    { x: 111, y: 230, r: 255, g: 223, b: 142 },
    { x: 106, y: 177, r: 255, g: 109, b: 200 },
  ];

  if (!checkIsPage(pageInWishingTree)) {
    if (!checkIsPage(pageInKingdomVillage)) {
      handleGotoKingdomPage();
      waitUntilSeePage(pageInKingdomVillage, 8);
    }

    if (checkIsPage(pageNotCollapsedWisingTree)) {
      qTap(pageNotCollapsedWisingTree);
    } else if (checkIsPage(pageCollapsedAffairs)) {
      qTap(pageCollapsedAffairs);
      if (!waitUntilSeePage(pageUncollapsedAffairs, 6)) {
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

  sendEvent('running', '');

  var pageNotEnoughForTree = [
    { x: 428, y: 98, r: 56, g: 166, b: 231 },
    { x: 386, y: 107, r: 60, g: 70, b: 105 },
    { x: 427, y: 171, r: 243, g: 233, b: 223 },
    { x: 403, y: 240, r: 219, g: 207, b: 199 },
  ];

  var wishingTreeStartTime = Date.now();
  while (true) {
    if ((Date.now() - wishingTreeStartTime) / 60000 > config.wishingTreeMaxFillingMins) {
      console.log('Run wishing tree longer than ', config.wishingTreeMaxFillingMins, ' mins, ending this task');
      return true;
    }

    allDailyRewardCollect = [
      { x: 59, y: 242, r: 247, g: 247, b: 247 },
      { x: 60, y: 256, r: 138, g: 138, b: 138 },
    ];
    if (checkIsPage(allDailyRewardCollect) && !config.alwaysFulfillWishes) {
      console.log('All wish fulfilled, skipping and send running');
      handleGotoKingdomPage();
      sendEvent('running', '');
      return true;
    }

    for (var i in wishes) {
      wishes[i].golden = false;
      if (identifyPointColor(wishes[i].unfoldPnt, { r: 255, g: 249, b: 203 }) > 0.95) {
        wishes[i].status = 'opened';
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 241, g: 205, b: 126 }) > 0.95) {
        qTap(wishes[i].unfoldPnt);
        wishes[i].status = 'opened';
        sleep(config.sleepAnimate);
      } else if (identifyPointColor(wishes[i].refreshPnt, { r: 193, g: 160, b: 111 }) > 0.95) {
        wishes[i].status = 'refresh';
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 252, g: 219, b: 50 }) > 0.95) {
        // Folded golden wish
        if (config.wishingTreeForceFulfillGoldWishes) {
          wishes[i].golden = true;
        }
        if (config.wishingTreeRefreshGoldenWishes) {
          qTap(wishes[i].refreshPnt);
          sleep(config.sleepAnimate * 2);
          qTap(wishes[i].refreshPnt);
          sleep(config.sleepAnimate);
          console.log('refresh as it is an unfolded golden wish: ', i);
          wishes[i].status = 'refreshed';
        } else {
          qTap(wishes[i].unfoldPnt);
          wishes[i].status = 'opened';
          sleep(config.sleepAnimate);
        }
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 252, g: 247, b: 122 }) > 0.95) {
        // Expend golden wish
        if (config.wishingTreeForceFulfillGoldWishes) {
          wishes[i].golden = true;
        }
        if (config.wishingTreeRefreshGoldenWishes) {
          qTap(wishes[i].refreshPnt);
          sleep(config.sleepAnimate);
          console.log('refresh as it is a golden wish: ', i);
          wishes[i].status = 'refreshed';
        } else {
          wishes[i].status = 'opened';
        }
      }
    }

    var treeRequirement = findWishingTreeWords();
    for (var idx in treeRequirement) {
      // Max fail count reached, tap refresh
      if (wishes[idx].failedCount >= config.wishRefreshThreashold) {
        wishes[idx].failedCount = 0;
        wishes[idx].status = 'unknown';
        qTap(wishes[idx].refreshPnt);
        sleep(config.sleep);
        console.log('wish ', idx, ' reached max fail, need refresh');
        break;
      }

      if (wishes[idx].status != 'opened') {
        console.log('continue as this wish is not opened:', idx);
        continue;
      }

      wishes[idx].requirements = treeRequirement[idx];
      wishes[idx].requireFulfilled = 0;
      for (var req in wishes[idx].requirements) {
        if (wishes[idx]['requirements'][req]['success']) {
          // Need to keep some safety stock
          if (wishes[idx]['requirements'][req]['request'] === 0) {
            console.log('req  is 0, ocr mistake, ignore this requirement:', idx, req);
            wishes[idx].requireFulfilled++;
          }
          else if (
            wishes[idx]['requirements'][req]['own'] - wishes[idx]['requirements'][req]['request'] <
            config.wishingTreeSafetyStock
          ) {
            console.log('wish ', idx, req, ' is below safety stock: ', wishes[idx]['requirements'][req]['own'], '/', wishes[idx]['requirements'][req]['request'], '<', config.wishingTreeSafetyStock);
            wishes[idx].failedCount++;
            break;
          } else {
            // console.log('wish ', idx, ' req ', req, ' can be fulfilled');
            wishes[idx].requireFulfilled++;
          }
        } else {
          console.log(' + failed ocr', idx, req);
          wishes[idx].failedCount++;
        }
      }
      if (wishes[idx].golden || (wishes[idx].requireFulfilled != 0 && wishes[idx].requireFulfilled === wishes[idx].requirements.length)) {
        if (wishes[idx].golden) {
          console.log('Force fulfill golden wish: ', idx);
        }

        qTap(wishes[idx].fulfillPnt);
        sleep(config.sleepAnimate * 2);
        if (checkIsPage(pageNotEnoughForTree)) {
          qTap(pageNotEnoughForTree);
          sleep(config.sleepAnimate * 2);
          qTap(wishes[idx].refreshPnt);
          wishes[idx].failedCount = 0;
          wishes[idx].status = 'refresh';
          console.log('wish ', idx, ' does not have enough stock, refreshed');
        } else {
          wishes[idx].failedCount = 0;
          console.log('wish ', idx, ' is fulfilled');
        }
      }
    }

    pageCollectTreeReward = [{ x: 85, y: 289, r: 44, g: 203, b: 8 }];
    if (checkIsPage(pageCollectTreeReward)) {
      console.log('Daily reward collected');
      qTap(pnt(60, 255));
      sleep(1500);
      waitUntilSeePage(pageInWishingTree, 8, pageCollectTreeReward);
    }

    var failedWishes = 0;
    for (var idx in wishes) {
      if (wishes[idx].status != 'opened') {
        failedWishes++;
      }
    }
    if (failedWishes >= 4) {
      console.log('All wishes are refreshing, done here');
      qTap(pnt(617, 16)); // close wishing tree
      sleep(1000);
      handleGotoKingdomPage();

      if (checkIsPage(pageUncollapsedAffairs)) {
        qTap(pageUncollapsedAffairs);
      }
      sendEvent('running', '');
      return true;
    }
    sleep(1000);
  }
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

  pageChooseBallonDestination = [
    { x: 285, y: 15, r: 208, g: 161, b: 89 },
    { x: 319, y: 7, r: 91, g: 61, b: 45 },
    { x: 352, y: 18, r: 210, g: 162, b: 89 },
    { x: 616, y: 15, r: 56, g: 165, b: 231 },
  ];
  pageCanStartBallonTrip = [
    { x: 580, y: 330, r: 121, g: 207, b: 12 },
    { x: 478, y: 327, r: 241, g: 51, b: 92 },
    { x: 417, y: 330, r: 12, g: 167, b: 223 },
    { x: 437, y: 316, r: 138, g: 85, b: 60 },
  ];

  // Tap Change location
  if (!config.ballonKeepCurrentDestination) {
    pageChangeLocation = [
      { x: 354, y: 339, r: 12, g: 167, b: 223 },
      { x: 416, y: 335, r: 12, g: 167, b: 223 },
      { x: 436, y: 344, r: 142, g: 88, b: 65 },
    ];
    qTap(pageChangeLocation);
    sleep(2000);
    if (checkIsPage(pageStockIsFull)) {
      console.log('goto ballon but stock is full, quitting');
      sendEvent('running', '');
      handleGotoKingdomPage();
      return;
    }
    if (!waitUntilSeePage(pageChooseBallonDestination, 8, pageChangeLocation)) {
      console.log('Cannot find the pageChooseBallonDestination, quitting');
      handleGotoKingdomPage();
      return;
    }

    if (config.isHotAirBallonGotoEp3) {
      console.log('ballon going to ep3');

      var pageBallonMapEp3 = [
        { x: 517, y: 221, r: 255, g: 221, b: 45 },
        { x: 43, y: 116, r: 131, g: 227, b: 84 },
        { x: 11, y: 160, r: 148, g: 106, b: 53 },
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

        if (checkIsPage(pageBallonMapEp3)) {
          qTap(pageBallonMapEp3);
          sleep(config.sleepAnimate);
          console.log('Found ep3 at try: ', i);
        }
      }
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

      for (var i = 0; i < 4; i++) {
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

  pageTrainUncollapsed = [
    { x: 109, y: 231, r: 255, g: 223, b: 142 },
    { x: 120, y: 235, r: 219, g: 46, b: 73 },
    { x: 105, y: 321, r: 75, g: 116, b: 160 },
    { x: 106, y: 328, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageTrainUncollapsed)) {
    qTap(pageCollapsedaffairs);
  }
  return;
}

function handleGotoHotAirBallon() {
  console.log('start handleGotoHotAirBallon: ', new Date());
  handleGotoKingdomPage();

  pageHotAirBallonReady = [
    { x: 205, y: 326, r: 255, g: 109, b: 200 },
    { x: 198, y: 324, r: 255, g: 109, b: 200 },
    { x: 204, y: 313, r: 255, g: 109, b: 200 },
    { x: 57, y: 344, r: 40, g: 66, b: 97 },
  ];
  pageCollapsedaffairs = [
    { x: 97, y: 327, r: 255, g: 221, b: 136 },
    { x: 116, y: 330, r: 134, g: 183, b: 249 },
    { x: 125, y: 342, r: 38, g: 71, b: 96 },
    { x: 110, y: 324, r: 162, g: 90, b: 227 },
  ];
  pageBallonFlying = [
    { x: 610, y: 17, r: 57, g: 166, b: 231 },
    { x: 219, y: 30, r: 55, g: 20, b: 38 },
    { x: 253, y: 51, r: 162, g: 162, b: 162 },
    { x: 263, y: 316, r: 255, g: 255, b: 255 },
  ];

  if (checkIsPage(pageCollapsedaffairs)) {
    console.log('Found collapsed kingdom affairs');
    qTap(pageCollapsedaffairs);
    sleep(config.sleepAnimate * 2);
    qTap(pnt(108, 173));
    sleep(3000);
    if (!waitUntilSeePage(pageInHotAirBallon, 10, pnt(1, 1), pageBallonFlying)) {
      console.log('Cannot find pageInHotAirBallon, should be flying');
      handleGotoKingdomPage();

      if (!checkIsPage(pageCollapsedaffairs)) {
        qTap(pageCollapsedaffairs);
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
  pageGnomeTeachRemoveGround = [
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
  foundResults = findImages(img, item, 0.88, 5, true);
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
          sleep(8000);

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
  }

  sendEvent('running', '');

  foundResults = findSpecificImageInScreen(greenCheckedWriteBackground, 0.95);
  if (foundResults.length > 0) {
    console.log('Tap green check at: ', JSON.stringify(foundResults));
    for (var i = 0; i < foundResults.length; i++) {
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
    }
  }

  foundResults = findSpecificImageInScreen(redExclamation, 0.935);
  if (foundResults.length > 0) {
    console.log('Tap redExclamation check at: ', JSON.stringify(foundResults));
    for (var i = 0; i < foundResults.length; i++) {
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
      qTap(foundResults[i]);
      sleep(config.sleepAnimate);
    }
  }

  // Collect resource if ready
  pageResourceisReady = [
    { x: 370, y: 330, r: 123, g: 207, b: 8 },
    { x: 278, y: 333, r: 255, g: 108, b: 118 },
  ];
  if (checkIsPage(pageResourceisReady)) {
    console.log('successfully collected tropical island resources');
    qTap(pageResourceisReady);
    sleep(config.sleepAnimate);
    waitUntilSeePage(pageInTropicalIsland, 6);
  }

  // Auto collect sunbeds
  pageSunbeds = [
    { x: 52, y: 323, r: 238, g: 68, b: 119 },
    { x: 61, y: 336, r: 44, g: 77, b: 110 },
  ];
  pageFreeAllCrispyCookie = [
    { x: 341, y: 316, r: 123, g: 207, b: 8 },
    { x: 376, y: 313, r: 49, g: 60, b: 90 },
    { x: 223, y: 85, r: 255, g: 101, b: 173 },
  ];
  pageHasNoCrispyCookie = [
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
  foundResults = findSpecificImageInScreen(islandHammer, 0.935);
  if (foundResults.length > 0) {
    console.log('Tap island hammer at: ', JSON.stringify(foundResults));
    for (var i = 0; i < foundResults.length; i++) {
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
  tropicalIsland: { pnt: pnt(329, 68), backward: true },
  bounties: { pnt: pnt(500, 100), backward: false },
  pvp: { pnt: pnt(500, 250), backward: false },
  guild: { pnt: pnt(123, 175), backward: true },
  // superMayhem: { pnt: pnt(10, 172), backward: true },
  cookieAlliance: { pnt: pnt(454, 275), backward: true },
  towerOfSweetChaos: { pnt: pnt(117, 265), backward: true },
});

function handleGotoAdventure(destination, targetPage) {
  console.log('handleGotoAdventure: ', JSON.stringify(destination));
  if (!checkIsPage(targetPage)) {
    if (!checkIsPage(pageInKingdomVillage)) {
      handleGotoKingdomPage();
    }
    if (!waitUntilSeePage(pageInKingdomVillage, 6)) {
      console.log('Skipping ', destination, ' as cannot goto kingdom');
      return false;
    }

    qTap(pnt(560, 330)); // tap play

    if (!destination.backward && waitUntilSeePage(pageSelectAdvanture, 6)) {
      console.log('tap: ', JSON.stringify(destination))
      qTap(destination.pnt);
      sleep(config.sleepAnimate)
      if (waitUntilSeePage(targetPage, 8)) {
        return true;
      } else {
        console.log('Cannot goto ', JSON.stringify(destination), ', skipping');
        return false;
      }
    }

    if (destination.backward && waitUntilSeePage(pageSelectAdvanture, 6)) {
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

      if (waitUntilSeePage(pageChooseAdvanture, 2)) {
        qTap(destination.pnt);
        if (waitUntilSeePage(targetPage, 8)) {
          return true;
        } else {
          console.log('Cannot goto ', JSON.stringify(destination), ', skipping');
          return false;
        }
      }
    }

  } else {
    // console.log('already in target page')
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

var pageDragonTotalDamage = [
  { x: 427, y: 243, r: 231, g: 215, b: 222 },
  { x: 410, y: 247, r: 156, g: 0, b: 49 },
  { x: 260, y: 268, r: 255, g: 255, b: 255 },
  { x: 555, y: 311, r: 89, g: 22, b: 45 },
];

var pageReadyToFightDragon = [
  { x: 34, y: 83, r: 231, g: 231, b: 226 },
  { x: 35, y: 115, r: 170, g: 178, b: 220 },
  { x: 27, y: 290, r: 123, g: 130, b: 206 },
  { x: 25, y: 220, r: 198, g: 167, b: 247 },
];
var pageRedValvetDragonWon = [
  { x: 289, y: 238, r: 239, g: 28, b: 57 },
  { x: 358, y: 233, r: 222, g: 16, b: 41 },
  { x: 426, y: 236, r: 231, g: 216, b: 223 },
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

function waitForBattle(battleName, waitTimeInSecs, needToCheckAutoUseSkill, pageExitBattle, pageExitBattleAbnormal) {
  console.log('Battling for: ', battleName);

  if (needToCheckAutoUseSkill === undefined) {
    needToCheckAutoUseSkill = false;
  }

  var autoUseSkillCheckedCnt = 0;
  var speedBoostCheckedCnt = 0;
  for (var j = 0; j < waitTimeInSecs && config.run; j++) {
    if (checkIsPage(pageInGacha)) {
      console.log('Found in gacha page, finish auto battle: ', battleName);
      qTap(pageInGacha);
      handleGotoKingdomPage();
      return false;
    }
    if (checkIsPage(pageInKingdomVillage)) {
      console.log('battle lead to kingdom, return');
      return false;
    }
    if (checkIsPage(pageKingdomDecorating)) {
      console.log('Found in pageKingdomDecorating page, finish auto island battle');
      qTap(pageKingdomDecorating);
      handleGotoKingdomPage();
      return false;
    }
    if (checkIsPage(pageInKingdomConstructionShop)) {
      console.log('Found pageInKingdomConstructionShop, exit');
      qTap(pageInKingdomConstructionShop);
      return false;
    }

    if (checkIsPage(pageBattleVictoryButNeedTap)) {
      console.log('pageBattleVictoryButNeedTap: ', battleName, j);
      qTap(pnt(321, 345));
      sleep(2000);
      j += 2;
    }

    if (pageExitBattle !== undefined && checkIsPage(pageExitBattle)) {
      console.log('Battle successfully finished, return');
      qTap(pnt(306, 326));
      return true;
    }

    // if (checkIsPage(pageExitBattleAbnormal)) {
    //   console.log('Battle meet pageExitBattleAbnormal, return', JSON.stringify(pageExitBattleAbnormal));
    //   return false;
    // }

    if (checkIsPage(pageBattleFinished)) {
      console.log('Battle success: ', battleName, j, ' secs');
      qTap(pnt(616, 323));
      sleep(2000);
      j += 2;
    } else if (checkIsPage(pageBattleDefeat)) {
      console.log('Battle finished, lost: ', battleName, j);
      qTap(pnt(616, 323));
      sleep(2000);
      j += 2;
    } else if (checkIsPage(pageDefeatWithGotoKingdom)) {
      console.log('failed (defeated) with goto kingdom, stop battle: ', battleName, j);
      qTap(pageDefeatWithGotoKingdom);
      sleep(1500);
      return false;
    }

    // PVP finish condition
    // pvp will tap(320, 350, 100)
    if (battleName === 'pvp') {
      if (checkIsPage(pageNoArenaTicket)) {
        console.log('No arena ticket, finish auto pvp');
        qTap(pageNoArenaTicket);
        sleep(config.sleepAnimate);
        return false;
      } else if (checkIsPage(pagePvPCrystaisRefresh)) {
        console.log('crystaisRefreshPage');
        tap(436, 90, 100); // X cancel
        sleep(1500);
        return false;
      }
    }

    // Island battle finish condition
    if (battleName === 'islandRedsword') {
      if (checkIsPage(pageFoundOctopus)) {
        console.log('Island battle found octopus, exit');
        qTap(pageFoundOctopus);
        sleep(1500);
        return true;
      } else if (checkIsPage(pageBattleFinishedWithSunbeds)) {
        console.log('failed to clear the sword (pageBattleFinishedWithSunbeds), stop battle in islands');
        qTap(pageBattleFinishedWithSunbeds);
        sleep(1500);
        return false;
      } else if (checkIsPage(pageIslandSunbedWithWetCookie)) {
        console.log('failed to clear the sword (pageIslandSunbedWithWetCookie), stop battle in islands');
        keycode('BACK', 1000);
        sleep(1500);
        return false;
      }
    }

    // Bounty finish condition
    if (battleName === 'bounty') {
      if (checkIsPage(pageNeedRefillBounties) || checkIsPage(pageNeedRefillBounties2)) {
        console.log('No bounties left, return to kingdom');
        sendEvent('running', 'finish bounties');
        return false;
      } else if (checkIsPage(pageBattleFinishedWithoutNextLv)) {
        console.log('Win bounty and (can only) retry');
        qTap(pageBattleFinishedWithoutNextLv);
        sleep(2000);
        j += 2;
        return true;
      } else if (checkIsPage(pageBattleFinishedWithNextLv)) {
        if (config.bountyGotoNextLevel) {
          console.log('Win bounty and goto next level');
          qTap(pageBattleFinishedWithNextLv);
        } else {
          console.log('Win bounty and retry');
          qTap(pnt(320, 350));
        }
        sleep(2000);
        return true;
      } else if (checkIsPage(pageWinBountyAndFinish)) {
        console.log('Successfully cleared bounties');
        qTap(pageWinBountyAndFinish);
        sleep(2000);
        return true;
      }
    }

    // Guild alliance battle handle reward
    if (battleName === 'alliance') {
      if (checkIsPage(pageAllianceReward)) {
        console.log('Open 2nd reward with ticket, and tap middle');
        qTap(pageAllianceReward);
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
      } else if (checkIsPage(pageAllianceResults)) {
        console.log('pageAllianceResults, exit', j);
        qTap(pageAllianceResults);
        sleep(config.sleepAnimate * 3);
        return true;
      } else if (checkIsPage(pageAllianceResults2)) {
        console.log('pageAllianceResults2, exit', j);
        qTap(pnt(600, 320));
        sleep(config.sleepAnimate * 3);
        return true;
      } else if (checkIsPage(pageAllianceRewardGet)) {
        console.log('pageAllianceRewardGet, tap middle');
        qTap(pnt(323, 337));
      }
    }

    if (battleName === 'guildDragon') {
      if (checkIsPage(pageDragonTotalDamage)) {
        qTap(pnt(320, 336));
        sleep(1000);
        j++;
      }
      if (checkIsPage(pageRedValvetDragonWon)) {
        for (var tapToSkip = 0; tapToSkip < 5; tapToSkip++) {
          if (checkIsPage(pageReadyToFightDragon)) {
            break;
          }
          qTap(pnt(320, 336));
          sleep(1000);
          j++;
        }
      }
    }

    if (needToCheckAutoUseSkill) {
      if (checkIsPage(pageAutoUseSkillEnabled)) {
        autoUseSkillCheckedCnt++;
      } else if (autoUseSkillCheckedCnt < 5 && !checkIsPage(pageAutoUseSkillEnabled)) {
        console.log(battleName, 'battle skill not enabled, enable it');
        qTap(pageAutoUseSkillEnabled);
        sleep(2000);
        j += 2;
        autoUseSkillCheckedCnt++;
      }
    }

    if (checkIsPage(pageSpeedBoostEnabled)) {
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

    if (j % 30 === 0) {
      console.log('In ', battleName, ' for ', j, '/', waitTimeInSecs, 'secs, time: ', new Date().toLocaleString());
      sendEvent('running', '');
    }
    sleep(1000);
  }

  console.log('Battle reach time limit but does not seems finished: ', battleName);
  return false;
}

function handleGuildCheckinAndBattle() {
  if (!checkIsPage(pageInGuildLand)) {
    handleGotoKingdomPage();

    if (checkIsPage(pageInkingdomCanGotoGuild)) {
      waitUntilSeePage(pageInGuildLand, 12, pageInkingdomCanGotoGuild);
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

  foundResults = findSpecificImageInScreen(icon, 0.94, true);
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

  console.log('tap fire 6 times to checkin');
  for (var i = 0; i < 6; i++) {
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
    for (var i = 0; i < guildDirections.length; i++) {
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

function guildBattleDragon() {
  var pageBattleDragon = [
    { x: 531, y: 326, r: 121, g: 207, b: 12 },
    { x: 165, y: 334, r: 121, g: 207, b: 12 },
    { x: 74, y: 333, r: 4, g: 151, b: 211 },
  ];
  var pageNoMoreDragonToFight = [
    { x: 419, y: 19, r: 255, g: 211, b: 0 },
    { x: 415, y: 42, r: 242, g: 175, b: 93 },
    { x: 478, y: 325, r: 180, g: 180, b: 180 },
  ];
  var pageDragonAddMoreCookie = [
    { x: 300, y: 250, r: 8, g: 166, b: 222 },
    { x: 408, y: 250, r: 123, g: 207, b: 8 },
    { x: 419, y: 18, r: 127, g: 95, b: 4 },
    { x: 518, y: 18, r: 20, g: 117, b: 127 },
  ];

  // Old users does not have config.autoGuildBattleDragon key (Feb 7, 2022)
  if (config.autoGuildBattleDragon === undefined || config.autoGuildBattleDragon) {
    console.log('about to guildBattleDragon');
    handleGotoKingdomPage();
    handleGotoAdventure(Advantures.guild, pageBattleDragon);
    if (checkIsPage(pageNoMoreDragonToFight)) {
      console.log('No more dragon to fight, skipping');
      return true;
    }

    if (waitUntilSeePage(pageReadyToFightDragon, 6, pageReadyToFightDragon)) {
      qTap(pageBattleDragon); // Tap ready to start
      // qTap(pnt(386, 256));  // Tap practice
      if (waitUntilSeePage(pageBattleDragon, 6, pageBattleDragon)) {
        qTap(pageBattleDragon); // Tap battle
        sleep(5000);
        if (checkIsPage(pageDragonAddMoreCookie)) {
          console.log('Found need to add more cookie to dragon fight, skipping');
          handleGotoKingdomPage();
          return false;
        }

        if (waitForBattle('guildDragon', 180, true, pageReadyToFightDragon)) {
          console.log('battle dragon finished, go back to kingdom');
        } else {
          console.log('Finish pageCookieAlliance due to battle return false');
        }
        handleGotoKingdomPage();
      }
    }
  }
}

function handleGuildBattleAlliance() {
  var pageCookieAlliance = [
    { x: 333, y: 21, r: 255, g: 255, b: 255 },
    { x: 329, y: 14, r: 246, g: 225, b: 250 },
    { x: 73, y: 332, r: 0, g: 150, b: 214 },
    { x: 29, y: 141, r: 151, g: 75, b: 13 },
  ];
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
  var pageAllianceAddMoreCookie = [
    { x: 304, y: 251, r: 8, g: 166, b: 222 },
    { x: 248, y: 102, r: 57, g: 69, b: 107 },
    { x: 341, y: 11, r: 25, g: 36, b: 54 },
    { x: 480, y: 320, r: 23, g: 34, b: 9 },
    { x: 497, y: 320, r: 35, g: 29, b: 35 },
  ];

  if (config.autoGuildAllianceBattle) {
    console.log('start guild alliance battle: ', config.autoGuildAllianceBattle, checkIsPage(pageInGuildLand));
    if (!checkIsPage(pageCookieAlliance)) {
      handleGotoKingdomPage();
      handleGotoAdventure(Advantures.cookieAlliance, pageCookieAlliance);
    }

    if (waitUntilSeePage(pageCookieAlliance, 6)) {
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

        if (waitForBattle('alliance', 1800, false, pageCookieAlliance)) {
          console.log('pageCookieAlliance battle finished, wait at most 12 secs and try next one');
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
}

function countBountyLevel() {
  var bountyLevelX = 20;
  var bountyLevelYRange = [60, 84, 119, 158, 190, 243, 260, 296, 333];

  for (var j = 0; j < bountyLevelYRange.length; j++) {
    if (checkIsPage([{ x: bountyLevelX, y: bountyLevelYRange[j], r: 205, g: 66, b: 36 }])) {
      return j + 1; // there is no level 0
    }
  }
  return -1;
}

function handleBounties() {
  handleGotoAdventure(Advantures.bounties, pageInBounties);
  if (!checkIsPage(pageInBounties)) {
    console.log('failed to goto bounties, skipping');
    handleGotoKingdomPage();
    return;
  }

  console.log('about to start handleBounties, send running');
  sendEvent('running', '');

  var pageInOneOfTheBounty = [
    { x: 533, y: 327, r: 121, g: 207, b: 12 },
    { x: 622, y: 329, r: 207, g: 237, b: 255 },
    { x: 614, y: 314, r: 227, g: 155, b: 65 },
    { x: 171, y: 39, r: 174, g: 167, b: 152 },
  ];

  var foundResults = findSpecificImageInScreen(bountiesGreenEnter, 0.97);
  foundResults.sort(dynamicSort('x'));

  var dayOfWeek = new Date().getDay();
  var bountyCount = 2;
  if (foundResults.length === 1) {
    bountyCount = 1;
  } else if (foundResults.length > 2) {
    bountyCount = 4;
  }

  var bounties = [];
  if (foundResults.length === 1) {
    var bountyEntryPnt = pnt(foundResults[0].x + 40, foundResults[0].y + 10);
    qTap(bountyEntryPnt);
    if (waitUntilSeePage(pageInOneOfTheBounty, 4)) {
      bounties.push({
        index: 0,
        entryPnt: bountyEntryPnt,
        powderStock: 0,
        level: countBountyLevel(),
      });
    }
  } else {
    for (var i = 0; i < foundResults.length; i++) {
      var bountyEntryPnt = pnt(foundResults[i].x + 40, foundResults[i].y + 10);
      qTap(bountyEntryPnt);

      if (waitUntilSeePage(pageInOneOfTheBounty, 4)) {
        for (var bountyIdx = 0; bountyIdx < bountyCount; bountyIdx++) {
          var powder = ocrMaterialStorage(350, 13, 40, 18);

          if (powder !== -1) {
            bounties.push({
              index: bountyIdx,
              entryPnt: bountyEntryPnt,
              powderStock: powder,
              level: countBountyLevel(),
            });
          }

          // Goto right bounty
          qTap(pnt(435, 178));
          sleep(1500);
        }

        break;
      }
    }
  }

  bounties.sort(dynamicSort('level'));
  // console.log('sorted level bounties: ', JSON.stringify(bounties));
  bounties = bounties.filter(function (bounty) {
    return bounty.level === bounties[0].level;
  });
  bounties.sort(dynamicSort('powderStock'));
  console.log('sorted & filtered level bounties: ', JSON.stringify(bounties));

  // if (bounties.)

  if (dayOfWeek !== 0 && bounties.length === 0) {
    console.log('No bounties can be run, skipping, day: ', dayOfWeek);
    return handleGotoKingdomPage();
  }

  var targetBounty = bounties[0];
  for (var i = 0; i < bountyCount; i++) {
    var gotBountyLevel = countBountyLevel();
    var gotMaterialStock = ocrMaterialStorage(350, 13, 40, 18);
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

  for (var i = 0; i < 5; i++) {
    qTap(pnt(530, 330));
    sleep(1500);
    qTap(pnt(530, 330));
    sleep(1500);
    qTap(pnt(530, 330));
    sleep(1500);

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

  pageLabCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
    { x: 26, y: 322, r: 255, g: 255, b: 255 },
    { x: 22, y: 329, r: 82, g: 26, b: 11 },
    { x: 28, y: 273, r: 255, g: 247, b: 206 },
  ];
  pageLabUncollapsed = [
    {x: 102, y: 118, r: 255, g: 239, b: 255},
    {x: 106, y: 128, r: 255, g: 240, b: 250},
    {x: 109, y: 73, r: 189, g: 101, b: 99},
    {x: 111, y: 229, r: 255, g: 223, b: 140},
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

  if (checkIsPage(pageAlreadyResearching)) {
    console.log('Already researching, skipping handleInGnomeLab');
    return true;
  }

  sendEvent('running', '');

  var researching = false;
  if (config.autoResearchKingdom) {
    qTap(pnt(296, 340));
    sleep(config.sleepAnimate);
    researching = handleResearchInGnomeLab(gnomeLabKingdom, 0.94);
  }
  if (!researching && config.autoResearchCookies) {
    qTap(pnt(416, 340));
    sleep(config.sleepAnimate);
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

  var pageNotEnoughItemForReserch = [
    { x: 436, y: 97, r: 255, g: 255, b: 255 },
    { x: 427, y: 97, r: 56, g: 167, b: 231 },
    { x: 414, y: 100, r: 60, g: 70, b: 105 },
    { x: 310, y: 249, r: 0, g: 193, b: 255 },
    { x: 261, y: 248, r: 219, g: 207, b: 199 },
    { x: 287, y: 252, r: 121, g: 207, b: 12 },
  ];

  var foundResults = [];
  for (var i = 0; i < 10; i++) {
    for (var imageIdx = 0; imageIdx < targetIconList.length; imageIdx++) {
      foundResults = findSpecificImageInScreen(targetIconList[imageIdx].img, threashold);
      // console.log('>', i, JSON.stringify(foundResults), foundResults.length, foundResults.length > 0);
      if (foundResults.length > 0) {
        console.log('Tap gnome reserach check i, at: ', imageIdx, JSON.stringify(foundResults));
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
                console.log('Start researching without Aurora item: ', JSON.stringify(foundResults[j]));
                qTap(pageCanTapResearch);

                // Check for not enough items for research
                sleep(1000);
                if (checkIsPage(pageNotEnoughItemForReserch)) {
                  console.log('Not enough items, continue');
                  qTap(pageNotEnoughItemForReserch);
                  sleep(1000);
                  qTap(pnt(570, 31));
                  sleep(1500);
                  break;
                }

                return true;
              }
            } else {
              console.log('Start researching: ', JSON.stringify(foundResults[j]));
              qTap(pageCanTapResearch);
              return true;
            }
          } else {
            console.log('Research requirement not met (btn not enabled): ', JSON.stringify(foundResults[j]));
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

    tapDown(626, 268, 40, 0);
    sleep(config.sleep);
    moveTo(300, 268, 40, 0);
    sleep(config.sleep);
    moveTo(-100, 268, 40, 0);
    sleep(1100);
    tapUp(-100, 268, 40, 0);
    sleep(config.sleepAnimate * 3);
  }

  return false;
}

function handleGotoTradeHabor() {
  console.log('try to handleGotoTradeHabor');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage(gnomeLabKingdom);
  }

  pageLabCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
    { x: 26, y: 322, r: 255, g: 255, b: 255 },
    { x: 22, y: 329, r: 82, g: 26, b: 11 },
    { x: 28, y: 273, r: 255, g: 247, b: 206 },
  ];
  pageHaborUncollapsed = [
    { x: 104, y: 72, r: 255, g: 251, b: 107 },
    { x: 114, y: 75, r: 231, g: 121, b: 156 },
    { x: 105, y: 321, r: 79, g: 118, b: 162 },
  ];
  if (checkIsPage(pageLabCollapsed)) {
    qTap(pageLabCollapsed);
    sleep(config.sleepAnimate * 4);
  }

  if (checkIsPage(pageHaborUncollapsed)) {
    qTap(pageHaborUncollapsed);
    sleep(config.sleepAnimate * 2);

    handleInHabor();
  }
  handleGotoKingdomPage();
}

function handleInHabor() {
  var pageInHabor = [
    {x: 303, y: 13, r: 255, g: 186, b: 239},
    {x: 310, y: 16, r: 247, g: 252, b: 203},
    {x: 409, y: 20, r: 255, g: 207, b: 0},
    {x: 521, y: 20, r: 0, g: 136, b: 255},
  ]
  var pageShipInHabor = [
    { x: 266, y: 190, r: 195, g: 94, b: 46 },
    { x: 36, y: 225, r: 247, g: 185, b: 247 },
    { x: 94, y: 232, r: 255, g: 251, b: 74 },
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

  if (config.autoHandleTradeHabor && waitUntilSeePage(pageShipInHabor, 4, pageShipInHabor, pageNoShipInHabor)) {
    console.log('ship still there, load all items');
    var shipInHabor = true;
    for (var i = 0; i < 5 && shipInHabor; i++) {
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
  }
  else {
    console.log('No need to send ship');
  }

  var pageNeedDiamondRefreshMarket = [
    { x: 426, y: 110, r: 57, g: 169, b: 231 },
    { x: 305, y: 102, r: 255, g: 255, b: 255 },
    { x: 363, y: 118, r: 57, g: 69, b: 107 },
    { x: 297, y: 124, r: 33, g: 44, b: 66 },
  ];
  if (config.autoBuyCaramelStuff && waitUntilSeePage(pageInHabor, 4)) {
    qTap(pnt(93, 230)); // Seaside market
    sleep(config.sleepAnimate);
    qTap(pnt(543, 336));
    sleep(config.sleepAnimate);

    if (waitUntilSeePage(pageNeedDiamondRefreshMarket, 3)) {
      qTap(pageNeedDiamondRefreshMarket);
      sleep(config.sleepAnimate);
    }

    qTap(pnt(420, 250));
    sleep(config.sleepAnimate);
    qTap(pnt(315, 247));
    sleep(config.sleepAnimate * 2);
    qTap(pnt(530, 245));
    sleep(config.sleepAnimate);
    qTap(pnt(315, 247));
    sleep(config.sleepAnimate);
    console.log('Purchased carmel stuff successfully');
    keycode('BACK', 800);
    sleep(config.sleepAnimate);
  }
  else {
    console.log('No need to autoBuyCaramelStuff');
  }


  var pageCanGotoShellShop = [
    { x: 33, y: 227, r: 247, g: 207, b: 231 },
    { x: 92, y: 233, r: 255, g: 251, b: 74 },
    { x: 346, y: 19, r: 223, g: 230, b: 231 },
    { x: 605, y: 211, r: 173, g: 130, b: 57 },
  ];
  var pageInShellShop = [
    { x: 609, y: 22, r: 57, g: 166, b: 231 },
    { x: 310, y: 17, r: 247, g: 254, b: 199 },
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
  if ((config.autoBuySeaFairy || config.autoBuyGuildRelic) && waitUntilSeePage(pageInHabor, 4)) {
    console.log('Try to purchase sea fairy in shell shop');
    qTap(pageCanGotoShellShop);
    sleep(config.sleepAnimate);

    if (waitUntilSeePage(pageInShellShop, 4)) {
      if (config.autoBuySeaFairy) {
        if (waitUntilSeePage(pageConfirmBuySeaFairy, 4, pnt(80, 313), pageLegendarySoldOut)) {
          qTap(pageConfirmBuySeaFairy);
          sleep(1500);
          console.log('Purchased legendary cookie successfully');
        }
      }

      if (config.autoBuyGuildRelic) {
        for (var i = 0; i < 2; i++) {
          if (waitUntilSeePage(pageConfirmBuyGuildRelics, 4, pnt(402, 187))) {
            qTap(pageConfirmBuyGuildRelics);
            sleep(1500);
            console.log('Purchased guild relic successfully: ', i);
          }
        }
      }

      keycode('BACK', 80);
    }
  }
  else {
    console.log('No need to autoBuySeaFairy');
  }

  handleGotoKingdomPage();
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

    if (getCurrentApp()[0] !== 'com.devsisters.ck') {
      var rtn = execute('ls /data/data/com.devsisters.ck/shared_prefs');
      if (rtn === 'exit status 1') {
        console.log('Did not find shared_pref, removing all related dirs');
        execute('rm -r /data/data/com.devsisters.ck/app_payload_lib');
        execute('rm -r /data/data/com.devsisters.ck/cache');
        execute('rm -r /data/data/com.devsisters.ck/code_cache');
        execute('rm -r /data/data/com.devsisters.ck/.sealing_reports');
        execute('rm -r /data/data/com.devsisters.ck/files');
      }

      console.log('Cookie not active, restart CookieKingdom and wait 50s till see pageInputAge');
      rtn = execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');

      if (rtn == 'signal: aborted') {
        // MEmu
        execute(
          'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity'
        );
      }

      var img;
      var whSize;
      for (var timer = 0; timer < 30; timer ++) {
        img = getScreenshot();
        whSize = getImageSize(img);
        releaseImage(img);
        if (whSize.width === 640) {
          break;
        }
        sleep(1000);
      }

      if (whSize.width !== 640) {
        console.log(
          'Reboot as failed to start the game after 50 secs'
        );
        execute('/system/bin/reboot -p');
      }

      if (waitUntilSeePage(pageAnnouncement, 50, pnt(585, 22), pageInputAge)) {
        return true;
      }
    } else {
      // console.log('checkAndRestartApp found correct app: com.devsisters.ck')
      return true;
    }
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
    recordTab = recordList[i];
    if (checkIsPage(recordTab)) {
      console.log('handleTowerOfRecords in: ', i);
      qTap(recordTab);
      sleep(config.sleepAnimate);

      for (var j = 0; j < 4; j++) {
        foundResults = findSpecificImageInScreen(diamondInTowerOfRecords, 0.935, true);
        if (foundResults.length > 0) {
          console.log('Tap ToR diamond at: ', JSON.stringify(foundResults));
          for (var i = 0; i < foundResults.length; i++) {
            qTap(foundResults[i]);
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
      { x: 498, y: 56, w: 42, h: 12 },
      { x: 498, y: 84, w: 42, h: 12 },
      { x: 498, y: 110, w: 42, h: 12 },
    ],
    [
      { x: 498, y: 145, w: 42, h: 12 },
      { x: 498, y: 172, w: 42, h: 12 },
      { x: 498, y: 198, w: 42, h: 12 },
    ],
    [
      { x: 498, y: 232, w: 42, h: 12 },
      { x: 498, y: 260, w: 42, h: 12 },
      { x: 498, y: 286, w: 42, h: 12 },
    ],
  ];
  for (var mayhemIdx = 0; mayhemIdx < imagesLocation.length; mayhemIdx++) {
    for (var teamIdx = 0; teamIdx < imagesLocation[mayhemIdx].length; teamIdx++) {
      var tImage = imagesLocation[mayhemIdx][teamIdx];
      var croppedImage = cropImage(img, tImage.x, tImage.y, tImage.w, tImage.h);
      var value = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage, 6, 0.85, 0.7) || 0;
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
  var scores = getMayhemScores();
  console.log('super mayhem scores: ', JSON.stringify(scores));
  var battleEntriesPnts = [
    [{ x: 586, y: 97, r: 123, g: 207, b: 16 }],
    [{ x: 583, y: 186, r: 123, g: 207, b: 16 }],
    [{ x: 581, y: 275, r: 123, g: 207, b: 16 }],
  ];

  var needToCheckSpeed = true;
  for (var loopTimes = 0; loopTimes < config.battleMaxLoops; loopTimes++) {
    var loopHasBattled = false;
    for (var scoreIdx = 0; scoreIdx < scores.length; scoreIdx++) {
      if (scores[scoreIdx] < config.autoSuperMayhemTargetScoreLimit) {
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

          // wait for battle finish
          for (var j = 0; j < 60 && config.run; j++) {
            if (j % 3 == 0) {
              console.log('Waiting for battle', j);
            }
            sleep(3000);
            tap(320, 350, 100); // center-bottom
            sleep(2000);
            if (checkIsPage(pageNoMayhemTicket)) {
              console.log('No mayhem ticket, finish auto pvp');
              qTap(pageNoMayhemTicket);
              handleGotoKingdomPage();
              return;
            }
            if (checkIsPage(pageInGacha)) {
              console.log('Found in gacha page, finish auto super mayhem');
              qTap(pageInGacha);
              handleGotoKingdomPage();
              return;
            }
            if (checkIsPage(battleFinishPage)) {
              console.log('Battle finished, won: ', j);
              waitUntilSeePage(pageInSuperMayhem, 25, pnt(616, 323), pagePvPCrystaisRefresh);

              if (checkIsPage(pagePvPCrystaisRefresh)) {
                console.log('crystaisRefreshPage');
                tap(436, 90, 100); // X cancel
                sleep(1500);
              }
              break;
            }
            if (checkIsPage(pageBattleDefeat)) {
              console.log('Battle finished, lost: ', j);
              waitUntilSeePage(pageInSuperMayhem, 25, pnt(616, 323), pagePvPCrystaisRefresh);

              if (checkIsPage(pagePvPCrystaisRefresh)) {
                console.log('crystaisRefreshPage');
                tap(436, 90, 100); // X cancel
                sleep(1500);
              }
              break;
            }
            if (checkIsPage(pagePvPCrystaisRefresh)) {
              console.log('crystaisRefreshPage');
              tap(436, 90, 100); // X cancel
              sleep(3000);
              j += 3;
              break;
            }
            if (needToCheckSpeed && !checkIsPage(pageSpeedBoostEnabled)) {
              qTap(pageSpeedBoostEnabled);
              sleep(3000);
              qTap(pageSpeedBoostEnabled);
              sleep(2000);
              j += 5;

              if (checkIsPage(pageSpeedBoostEnabled)) {
                needToCheckSpeed = false;
              }
            }
          }
        }
      } else {
        console.log('SKIP battle with stronger opponent', scoreIdx, 'power', scores[scoreIdx]);
      }
    }
    sendEvent('running', '');
    console.log('Finish battle loop: ', loopTimes, 'and try tap refresh');

    tap(560, 330, 100); // Free Refresh
    sleep(3000);

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

function handleAutoPromoteCookies() {

  var pageInCookieList = [
    {x: 164, y: 341, r: 235, g: 237, b: 242},
    {x: 148, y: 340, r: 66, g: 93, b: 140},
    {x: 30, y: 317, r: 230, g: 142, b: 33},
  ]
  if (!checkIsPage(pageInCookieList)) {
    if (checkIsPage(pageInKingdomVillage)){
      handleTryHitBackToKingdom();
    }

    qTap(pnt(464, 327)); // icon Cookies
    sleep(config.sleepAnimate);
    qTap(pnt(195, 335)); // Cookies tab
    sleep(config.sleepAnimate*2);
  }

  for (var i = 0; i < 10; i ++) {
    var results = findSpecificImageInScreen(cookiePromoteGreenArrow, 0.7);
    // console.log('>', JSON.stringify(results))

    for (var idx in results) {
      if (!checkIsPage(pageInCookieList)) {
        break;
      }

      var cookie = results[idx]
      qTap(cookie);
      sleep(config.sleepAnimate*2);
      qTap(pnt(518, 311));
      sleep(config.sleepAnimate);
      qTap(pnt(518, 311));
      sleep(config.sleepAnimate);

      for (var j =0; j < 10; j ++) {
          if (!checkIsPage(pageInCookieList)) {
            keycode('BACK', 1000);
            sleep(config.sleepAnimate*2);
          }
      }
    }

    console.log('swiping')
    tapDown(305, 315, 40, 0);
    sleep(config.sleep * 4);
    moveTo(305, 200, 40, 0);
    sleep(config.sleep * 2);
    moveTo(305, 200, 40, 0);
    sleep(config.sleep * 2);
    moveTo(305, 100, 40, 0);
    sleep(config.sleep * 2);
    moveTo(305, 100, 40, 0);
    sleep(config.sleep * 2);
    tapUp(305, 0, 40, 0);
    sleep(config.sleepAnimate*2);
  }
}

function handleTryResolveGreenChecks() {
  if (checkIsPage(pageAnnouncement)) {
    qTap(pageAnnouncement);
    waitUntilSeePage(pageInKingdomVillage, 5);
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
  foundResults = findSpecificImageInScreen(greenCheckedWriteBackground, 0.94);
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
    foundResults = findSpecificImageInScreen(greenCheckedWriteBackground, 0.94);
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

    rtn = execute('am force-stop com.devsisters.ck');
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
  releaseImage(greenCheckedWriteBackground);
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

  for (var i = 0; i < auroraItems.length; i++) {
    releaseImage(auroraItems[i].img);
  }

  for (var i = 0; i < gnomeLabCookies.length; i++) {
    releaseImage(gnomeLabCookies[i].img);
  }

  for (var i = 0; i < gnomeLabKingdom.length; i++) {
    releaseImage(gnomeLabKingdom[i].img);
  }

  for (var i = 0; i < numberImagesPVP.length; i++) {
    releaseImage(numberImagesPVP[i].img);
  }

  for (var i = 0; i < numberImages.length; i++) {
    releaseImage(numberImages[i].img);
  }

  for (var i = 0; i < bNumbers.length; i++) {
    releaseImage(bNumbers[i].img);
  }

  for (var i = 0; i < wNumbers.length; i++) {
    releaseImage(wNumbers[i].img);
  }

  config.run = false;
  console.log('stop clicked, change config.run = false');
}

var greenCheckedWriteBackground;
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
var auroraItems = [];
var gnomeLabKingdom = [];
var gnomeLabCookies = [];
var numberImagesPVP = [];
var numberImages = [];
var numberImagesProdutRequirements = [];
var bNumbers = [];
var wNumbers = [];
function loadImages() {
  greenCheckedWriteBackground = getImageFromBase64(
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
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAaABYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4R8NeB/H3xB1MeGPhh4E1nxJrU8Mslrovh/S5by6mWNC8jLFErMwVAWJAOACa+uf2Mv8Ag3h+Nv7Yf7Gdz+1vd/GO48Ianew6hc+GfBGo+AZpptWihUmCQTtdRFFncEIywuNpVxvziu9/4Nw/iR428Of8FE7vwf4Q+Caa/pXiPwfLZ+J/GAgnMvhWCNZblD5i/uliubiGCJkcbmZYSjDy3V/ur9rn4tf8FXov20vFc3wR+P3gHwD8MvAy6d/YvhfXvD8F9N4vJs47mUzZQ3EaS3EklqGgmhISIFV3qWf6rHVcTUxboUUlZX337nz6ng8JhViMQ9G7bdXt5n88njr4TfF34XaVY678TvhL4n8N2WpXd1a6fea/oFzZxXNxauI7mGN5kUPJC52SKCSjcMARiiv2W/4L9fGD4i2Pw38F6JH+y9Y/E/T9Y8Sz32o3mt6be3dtp1zBblIE8uzeN1eRLifaS4ULC42sSChThUm46o0dKCe593/s1/seeFf2RrGK1/Zo8JaJ4VzaPZ6lBcQSznVVy8kctzJvEkskckhKFmJCSSRgorDGP408V6/4T8W6npPxBv59b1+1mlNlNDpUi/bQwYxBQissZYbVxnAxX0OxIVlBIBfJHvWTpZM3iNRMd48xuG56OQPyHH0rjqTdatKq97WPncLiamXUfYRbkrt3k7u7erueL6n8AfiV4q0mzfxX4mtzb7BI0Gk2MkM6TlRlX3s2VX5xkYyTjHy5JXuE8MS69KixKFES4AXj7qH+p/OiuyniHTgk4pnlYqhUxdd1JVZp+TsvyP/Z'
  );

  cookiePromoteGreenArrow = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAASAA8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDjf2aP2edK/wCC0nibwp8Y/wBs7wTeeAPgN8O9Xu7i48NaT4lmur74j6kCkYs4NkNuba1gKSxz3vBJlltrd1lFxLa4v7dX/BLQfslfFGy/a3/4Ja+CPEd54YisG0nWvg3b6jfahqGjxyuStzp0shuJ7iFpWBliAkljZ5JBmGST7P8AZX7Lv7M3j/8AYo/aE8e/sJ6v8fp/Hvhnw54Q8O6/8NkvtLS0vdN02+vtfhe0lWORkuJIxYQb7mNIvNZg7RqzV5p/wW9/aW+Nn7Ff7KmifEf4MeJv7D1/UvHNrpokmZ1eW2a1u5ZAqo6MRuhjyQcDjPUV/IuceOfiZm3jLhsDl06SXPFQjaXJVhUhGUfatpO6jbWMYqMr6SV7/L8R8S8SZvxO6eMtKbcU2rrorPmjy8rStZxSs9d9T5S/4OzPiJ8QPh5+3d8OPE/gDx1rOh6ld/CRbW61DR9Tltp5oF1S8dYnkjYMyBmZgpOASTjJr8w/Cvxl+L/xO8ZaVofxJ+K3iXxDZRTyzRWeua7cXcSSiCQBwkrsAwDMM4zgn1oor7vw+/5lX+GP6nXX/wCR3H1X5H//2Q=='
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
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAkACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7t+KHxRt/Ado2o3dhdareywXF7PBBMrSx20QDT3si5Mzwxs8Sv5Mc0xeeJEikeREbO+AnxS1r44apbeF7bwVcQatc6i1iFtLXUPs8dwhtnnhk+3WVpcwvDb3tlcv5tsiNFdK0LzeXMIvAv+ClvxL8DfDnUvC3iDxlrF1p1rptndNqt1aXP2a5kspJ7WVltGeeMzzo9ksyeRHM1vdQ2EkrW0bq8m14C+F9t8DIW+Lf7SX7a1r4P8NTefbappmveAdT1a9urn7TZ21+kMU14Ln7d5aadAzy2+opEdNkIkMELxV9flPBWHzLhuni+WUqlS9uVScnJSklGKSaekbtWctVa1017DxSo1dY3S3u7X+7U+mZ7e+srufTtTsJLW6tbmSC5tpWRmiljco6kozKcMpGQSD2JpRaXslpNfW9qZIrYoblllQGJXcIr7SwZl3sqnaDjcCcDJHw74+/b+/ZM8a6trdhovxr/aN8eafp3iFBPB4qsfC0Gn641veq1zBP9igtrpoLiNZI2inHzxzZdfm43P2S/HXgH4t+L7bQ/wBjr9tq70b+09fvdUj+GHjPwRDc6fbWBhee4tdMtNOtRLcyRBZnRINSjiV4SrRnzdx7a/g/xNhculja9Nws/hlGatGzd3Jq8WtNHGz79BxxtCU720fT/Lr6b/M+xI1aWzbUI+YFuvsxmz8vnBd5jB7sFwSByAy5xkZK5zwb8R/jZ4U1bUv2Wvjtb21vLHI/iPwnMNHW3i1bT3dYZZbfzLi4KS284PnxwspjXUrZ5VQ3ixgr83zfAwy3GvDxlflSu73Tfk1ujdcy3/r8tTJ0jw/4x+OH7SetfCnSPDukalZeBdA8K+KEh1PxHdaayXlxqWq+TNGbeCXznik0iORd+zy3VHUsxzH+avxy8d/ED9uv42S+LdR+NGn/AA3sNPn07TrTwrrDWRl06ykujB9ks7KUxNJPCizM6h4oFa3CSyQvPG0n6P6z+0GP2Wf2odG8QweAPtsPxC8E32k3eoRxfNcanptxBc6XaNI8qKFW1vfEFx5S4kl8lgGVUZ0yviB+zz+yD8d/AniH4g+Pv2UvDraT4l1G7uNc1jwt45uP7ftLvUrhiZnsZlFsk3nSttRJJ2LMPLSYthv6P8J88lkmUxxf1b3ZJU4TjyOSlze/7s5pXnbRpcz00eqPHzGnVrRcMPNRqd2uZLz5eaN/vtf7jlP2Rv8Agnj+yf4t+G2i+OtX0D4XaH4Ju/hXa3HxZ1q9Z7jU5dZhs5o75HuJJTDYJE8+9zB5U5ljYPIEQxy/H/w+1Lwf4p0XR/hD+zr4JvLKe2Gl3lt8SJtH1Sx1K3aF0dV0ox3MlsJXwke9stH5haHzCu4ezeKP+CTqeLPG/iT4KfBL4LaUvw5sbxbD/hP7nV4LS5t7prOG6ETrGsk8sqR3EI8wqUlxyoUMg97t/wBm2y/Yz8EWnjXVfHlh4i8TQaWtvpmsa1cizs7XUEhcsd8rg3EkgXKSuI9oWQmMMVdP0TD5thMNXq/8KE686/K4UtVbRuKnK/aS5uZx91JKLaSfdleNWAw9elKMKkqqUU5QXuJa80ebmtJ7aPbu7Ndn+0b428deKP2Rvgd+0R448Oz2XxG8HXXhKPxM39lpDcPNrUVnba3pt1Auy4WNo52uxbqAhvdLsQUke3ERK+dvjr8TtW+Mv7QHwq8G/BrXvFul6Drni7RpL/WPEOsXE9xq09ora7cJOnnNFBE9vpksCQwqqeZIzFQhWOIr+ZvEPKMDkWOoUakW6koc7S93lUpO0Wve1upO17pNJ2d0s8HXWJpuUXto9N2t3u7+umvQ63/grT4mT4a/sKap8d9C8P2Mvif4ceL9F17wzf3bTMI52vI7KSJ41kVHiktrq5ibgPiZirqQpGJdW0cnhe0uBJNHLcpbTma3uHikjkXbMrIyEMpWRVIIP8I60UV+q+EU5rJeS+nMnbpey1PBzJv2sn15v8jxP4kftTftM+DPHniD4e+Gvj54osNNvNYTUb1dO1H7JJcXEtpAjM724QldiIgj+4qooCjFU/CHxA8eeMvHfhQ+MPG2r6sX8W25LanqUtwc+bByPMY4Jzye+BnOBRRX9WSy3LsPlkZ0qMIycd1FJ/C+qR8piqtWWKfNJvXue6f8E7/Eeq/Gvx58WPin41uW+2eCPidrfgXw9Y2btHaQ2MH2SZ7l48nzbudmjEkrkqqwKsKQh5hKUUV/nDx9UqVOLcTztuzS17cq0P07BxjHDRSXQ//Z'
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
      name: 'charge',
      img: getImageFromBase64(
        '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'
      ),
    },
    {
      name: 'defense',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAcAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD60/ah8U/Gq28RW2g/BRPF2q63H/ZKaF4M8I6/oej/APCQ3l7qP2dorzUNX02+W2t44IpZMwRpKTlQ2WUpzfxD/wCCcP8AwU8015L2w8H/AAK0zSrzxZFd2nh6b9ob4p3mtLpoj/fwHxJ9sikgJbZ/o8NkLV2xI8ZMSKey+KvxD0L4VftM+E/FXiJttrZW2k+IdRunbZBp+laf4n0iw1G+uJCNsNvbReIY7uWVyqRwWk7uVVCw+/Pj3rOk+HNEh8Q69qUFnY2Fvc3F7eXMgSOCJFVnkdjwqqoJJPAArwuG8Lhp5bSlyJt3u7K71Z3Z/ia9OvUtJpK1tXpsflz+yz8af2irz9q/V/gf8adP1/QpLGXxbZ6l4P13xZpXiCHTX0yPwhd2E1hqNlpdhNLBNaeJmLLeefP+6iLujiRT9j+FPiL4x8EQzW/hnWWt47hg0qGNXBIyMgMDg89uuB6CvjDTJvjFf/t1eKP2vvA37O3jTxJ8PvEZ1O/8M32l+G75bzUbXUdA8JWxcQz28aRsJ/CcYjV5AHj1PdK1s1sY5fqDwb408MfEDw7beK/B+rJe2F3EskMyoyHDKGG5HAZDtYHawBwRxXl8Y8O5tkGNhiJ4d0qc0uVpWV9dHb4ZaN8rtK2trHRwpxBlOfYSVCnXjVqQb5k3d9NVf4o6r3ldX0vc5b48/AXTfjdYaJqVh421rwj4s8I6yur+CvG3hqaNL/Rb0RvE5VZUeG4gmhklgntZ0khnhldHQ5BX5z+MPhf9tT4bfAnW/h1quieF9O+Hnh/S9S1XU7/w78cNa0bw5a2cTo26DRJ7S5u9NjisY2jj0aDWBog2HfAqYiPyr/wTrtfiH8dfjj418F/FH9pb4x6pYaV8J9Y1jTo5fjFry+Rew2l1JHKMXYBIaJeGBHXjOCO8/wCCfXw+1/42/AP4a+NfiZ+0L8YtS1PxL8G/H/iDUrl/jHry5vtPvr6C0dVW7C4jS1TAYHl3Jydu3rybA5rlrjOjWTje9mn0f4XLzLEZfjoyhVpu9rXTPYPAf/BXP9jbwzffC/45w/ttadb6n8MvBh8OXnw5PjyzVdRjgtrWC3WxdLZrdbS6kjWa8a5f7SnlEQiXyLUj1v8A4Jw6n4f139ndPEHhDxDZaxo93fQjTdY0y6Se2vFi0+zt5GjkjLI+2WGWNsE7ZI3Q4ZWA+G/2q9F8c/DL9lD4c+NPBX7SHxis9bfUfCdlq2rr8YdeabVl1bwjJrFw9xm72l1uUAjKKgWMlSG4I8P0P4l/tDXokE37Xnxn+TGMfFnWe+fW59q+z414krcT5Z/Z6w8aV5xndScrKPtbQXux0Tqyd25S7tnxXB3CtLhjMfr31iVW0JQs4pXcvZJzfvS1apQVo8sd7RR//9k='
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
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAcAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9BvGXxB0vwjd2Hh610y+1vxHrTNH4b8I6FEs2p6xKrIpSCJmVQitLH5lxK0dvbo/mzywxK0i3/iR4P/aT+C+g2/jbx18NdO1ixNpLda5oXgu5nvtU0WBZiqPFGYl/tYmENNLFAsc0bIYbePUHZGbxS7/aX/bj/Zs+MvjH4M/swfse+GfF/jn4sapbX3hb4nf239suLXQ7S3hiktLrSHljmb7FNLMIT9os9JEurxyz3NtPdT/aOW+Jf7C//BT79h37Z+2ZoP7bdt408dzWEmqfE3TPFeq3k+kX0Dl5rj7V9quI7Rra0kRRDLptpo8lpYifZDeuq2c/xuU5FltbBqdS83JatfZ9O7XXd+R72ZZrjaNZxg1Cz2f2vXsn029T6S8KeLvC/jrQLfxX4L8Q2eqabdb/ALPfWFwssblHKOAykjKurKw6qykHBBFerfDr44WHhvRzpHjXRrjVVhwLGVVR3jTnKEyMOBxjHuOgFfA/7M37bmrfGT4z+Ifjr8ZP2b5Pghovi/TYLGJNR1Ga5h1rWNMjuGvdQupjFBDamO0FtAss0Uc8sVvAk7IqWMNfWdeRmmW5lwxmPJUhKKavFyi480X1V97PRtdV8juy7MMv4hwTlCcZOLtJRkpcsl0bWza116M8isvGH/BQD4SeIfib4C/Zu+HHwr0eT4h6zBe2Hx41vWbm71PRbNbS0txby6IbUR3txbkXjWoF3Fa4kV5Y2kacXHl/xf8A2IPAvwr0fxb8e9I+K3xF1fxn4mtnm+Ims+JPGc16njeWC2lFk+pWzj7MDaNsa2NrDb/ZhGscW2LdG3wl8Hv+DgX9tz4sfs9fEL40ar4Q+HWn6h4Iso7iwsdM0K7FreFnVStwJbuSQrgn/VvGfetr4nf8FT/2gPjP+y54lvvip4E8Ba7YQeCNG8Qy6DqPh6SSyubma5VxG6mbfsjeNHjKusisoJc4Fe/keYZtlma4LFzalToThLkTceZQkm4t8r3StqmvI8vOsBgM0yrF4SN4yrQnHmavyucWk0rrZu+6fmfof4y+OA0Dwv8AFfwPp3jj4NN8HtZ8I6zffDnSLO8hkv4bq9Z5dPNtaJai7FzFem1NxBMqpZAI24LCleq/DLTNO0T4beHtG0fToLO0tNDtIbW0tYVjigjSFFVERQAqgAAAAAAYFfg3+2x+11oP7JHinw34c8G/sc/BvXY9e8OQ6pcTeJfD9+0kMj9Y4/st7AoQdtwZvVjTfCH/AAc/ftxeAvDOn+C/CH7PXwN0/SNIsIbHStMtPC+qxwWdtCgjihjRdTARFRVUKOAFAFfRcb5/T4rwtLDUaHs5Qm5Sk5X5rxSu0oq83a853952dlbX5/gzhupwxiqtarX9pGUVGKULcqUm+VPmf7uN7U4W9xXV3c//2Q=='
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
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAcAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9K9T1K+1m/l1PUbhpZ5m3SO3c/QcAegHAHFfLnjb49aJ4v/bp8KfDPVpNQtfCF/4a1rwto/jPTZLnULPQPG15rWi2WiapqFlZywkWZ1K3v9Hik87zJ7hdYtZEgtYbqd++/a+0XxdqmmeAdS8KfAm++ICaN8StO1LW9IsU0q4KabFFcG6VrLV7q1s75biItYbZJQ1ub8XsQaaziFfLfjj4hfAPxpoupfHX4Ff8ElH0nSdW8YeE10b4fWX7VGueAtYuNVbUrLQtLuW8O6JO+maTJBquntaozzxSxyaPK8gimhdF+A4fwWHq/wC01Jpu9uV/3mld2u9btK6Wp9Tm2Lq0v3EItK17rTbW2tlpZN26H3Tper+NdI8car8Hvi54Kj0DxjoGm6ffanaafqDX2nXVteLKIrmyuzFE08JmtruD97FBOHtXLQpG8Ly7NfANv8eNJu/jhqHgn9r/AP4JBeLI9f8AB/h1bm11Px5+2Rrfjl/DQvru1jklsZJL27Oj6iIVWdLm3MN1GfsX72BbyCY+4fs3ftb+F9D+F8WifGPUfEkOpQ6hczaYZ9HvdUaTSLiQ3WnBLmGOWW6jhtJ4bP7XchJrp7KWdg/mCR/Xzjw8z/C5fHM8Lh5zoTlZWi21otdLtx/vNJapXbPHy3jvIMRmTy2tiIRrxjzNOSV9/lfS9r3sr2SPo6vlT4wfslax4O/by8P/ALYfwb+G3ijW9Sv/AAzrlgs2meKLKCz8GeJ7+LTNMj8VLa37+U0g0mO7imVYbtZTZ2ebR23SV+Y3ir4r/tFabculv+138aMLfxRc/F7W/utMqHpdDsTX1V8b/AfiHwt+2Z4y+F3h79oX4w2ugaP+yxZ+MrDTo/jHrxVNXlaxjaYsbsscfaJGAJ+9gkkZB4ctyXHYSt7ajVSa01T6/P5+qPTx2YYXE0vZVYNp67r+vL0PVtI/bZ+C37Evx2/aJ/Zl1b9sGz+H2qeMbvSXPjbxt4ll1jU7YQ6FBN5MklxOb1VuTcvElwpm+ygIsMAUh4Y/ip/wVD/Zy+PHgXwP8OPE/wC2j8OvEmoeA9Flt9S8Zar4wsbFtXubiYkrH9pnWWeKGGG3jE8qxzTMHlljjaTbV/8A4Zx0eH9oPUfB3/C6vi++l3+ieBbK3s3+M/iArp8mrabqNxdXcJ+2bvtG+1i2tIXUDdlTmvzp8L/GX9pLUfDtlqF1+198ZjLNao8hHxb1rkkDP/L1X7FlXHuI4epYeX1OnOpSjFKbk7uSpqm5v3ea8oKzjzuKbbtfU/J804BpZ7Xr3xlSNOrJtxSVlFzdRQS5uW0Zu6lyKdko83Lof//Z'
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
  ];
  numberImagesPVP = [
    { char: '0', img: getImageFromBase64(b64_0) },
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
    { char: '9', img: getImageFromBase64(b64_9) },
  ];

  numberImages = [
    { char: '0', img: getImageFromBase64(b64N0_1) },
    { char: '0', img: getImageFromBase64(b64N0_2) },
    // { char: '0', img: getImageFromBase64(b64N0_3) },
    { char: '1', img: getImageFromBase64(b64N1_1) },
    { char: '1', img: getImageFromBase64(b64N1_2) },
    { char: '1', img: getImageFromBase64(b64N1_3) },
    { char: '2', img: getImageFromBase64(b64N2_1) },
    { char: '2', img: getImageFromBase64(b64N2_2) },
    { char: '2', img: getImageFromBase64(b64N2_3) },
    { char: '3', img: getImageFromBase64(b64N3_1) },
    { char: '3', img: getImageFromBase64(b64N3_2) },
    { char: '3', img: getImageFromBase64(b64N3_3) },
    { char: '4', img: getImageFromBase64(b64N4_1) },
    { char: '4', img: getImageFromBase64(b64N4_2) },
    { char: '4', img: getImageFromBase64(b64N4_3) },
    { char: '5', img: getImageFromBase64(b64N5_1) },
    { char: '5', img: getImageFromBase64(b64N5_2) },
    { char: '5', img: getImageFromBase64(b64N5_3) },
    { char: '6', img: getImageFromBase64(b64N6_1) },
    { char: '6', img: getImageFromBase64(b64N6_2) },
    { char: '6', img: getImageFromBase64(b64N6_3) },
    { char: '6', img: getImageFromBase64(b64N6_4) },
    { char: '7', img: getImageFromBase64(b64N7_1) },
    { char: '7', img: getImageFromBase64(b64N7_2) },
    { char: '7', img: getImageFromBase64(b64N7_3) },
    { char: '8', img: getImageFromBase64(b64N8_1) },
    { char: '8', img: getImageFromBase64(b64N8_2) },
    { char: '8', img: getImageFromBase64(b64N8_3) },
    { char: '8', img: getImageFromBase64(b64N8_4) },
    { char: '9', img: getImageFromBase64(b64N9_1) },
    { char: '9', img: getImageFromBase64(b64N9_2) },
    { char: '9', img: getImageFromBase64(b64N9_3) },
    { char: '/', img: getImageFromBase64(b64Nd_1) },
    { char: '/', img: getImageFromBase64(b64Nd_2) },
    { char: '/', img: getImageFromBase64(b64Nd_3) },
    { char: ' ', img: getImageFromBase64(b64NE) },
  ];

  numberImagesProdutRequirements = [
    { char: '0', img: getImageFromBase64(b64N0_0) },
    { char: '0', img: getImageFromBase64(b64N0_1) },
    { char: '0', img: getImageFromBase64(b64N0_2) },
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
}

function start(inputConfig) {
  console.log('inputConfig: ', inputConfig);
  config.run = true;

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
  console.log('start with: ', config.materialsTarget, config.goodsTarget, config.run);

  loadImages();

  checkAndRestartApp();

  if (config.account !== 'default_xrobotmon_account@gmail.com' && config.account !== 'aaa@gmail.com') {
    while (
      !checkIsPage(pageInKingdomVillage) &&
      !checkIsPage(pageAnnouncement) &&
      !checkIsPage(pageInProduction) &&
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

  if (checkIsPage(pageInProduction)) {
    console.log('Already in production, reset all side tasks');
    config.lastCollectMail = Date.now();
    config.lastCollectDailyReward = Date.now();
    config.lastSendHotAirBallon = Date.now();
    config.lastCollectTrain = Date.now();
    config.lastFulfillWishes = Date.now();
    config.lastCollectFountain = Date.now();
    config.lastCollectCandyTime = Date.now();
    config.lastAutoPvP = Date.now();
    config.lastAutoSuperMayhem = Date.now();
    config.lastCollectTropicalIsland = Date.now();
    config.lastAutoGuildBattle = Date.now();
    config.lastAutoHandleBounties = Date.now();
    config.lastLabResearch = Date.now();
    config.lastHandleTradeHabor = Date.now();

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

    if ((Date.now() - config.lastGotoProduction) / 60000 > 10) {
      console.log(
        'Check other tasks as we have produce for: ',
        (Date.now() - config.lastGotoProduction) / 60000,
        ' mins'
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
        config.lastSendHotAirBallon = Date.now();
      }

      if (
        config.autoCollectTrainIntervalInMins != 0 &&
        (Date.now() - config.lastCollectTrain) / 60000 > config.autoCollectTrainIntervalInMins
      ) {
        console.log('Collect train: ', (Date.now() - config.lastCollectTrain) / 60000, ' mins just passed');
        handleTrain();
        config.lastCollectTrain = Date.now();
      }

      if (
        config.autoFulfillWishesIntervalInMins != 0 &&
        (Date.now() - config.lastFulfillWishes) / 60000 > config.autoFulfillWishesIntervalInMins
      ) {
        console.log('Fulfill wishes: ', (Date.now() - config.lastFulfillWishes) / 60000, ' mins just passed');
        handleWishingTree();
        config.lastFulfillWishes = Date.now();
      }

      if (
        config.autoCollectFountainIntervalInMins != 0 &&
        (Date.now() - config.lastCollectFountain) / 60000 > config.autoCollectFountainIntervalInMins
      ) {
        console.log('Collect fountain: ', (Date.now() - config.lastCollectFountain) / 60000, ' just passed');
        findAndTapFountain();
        config.lastCollectFountain = Date.now();
      }

      if (
        config.autoPvPIntervalInMins != 0 &&
        (Date.now() - config.lastAutoPvP) / 60000 > config.autoPvPIntervalInMins
      ) {
        console.log('AutoPvP: ', (Date.now() - config.lastAutoPvP) / 60000, ' just passed');
        handlePVP();
        config.lastAutoPvP = Date.now();
      }

      // if (
      //   config.autoSuperMayhemIntervalInMins != 0 &&
      //   (Date.now() - config.lastAutoSuperMayhem) / 60000 > config.autoSuperMayhemIntervalInMins
      // ) {
      //   console.log('Auto Super Mayhem: ', (Date.now() - config.lastAutoSuperMayhem) / 60000, ' just passed');
      //   handleSuperMayhem();
      //   config.lastAutoSuperMayhem = Date.now();
      // }

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
        config.lastCollectTropicalIsland = Date.now();
      }

      if (
        config.autoHandleBountiesIntervalInMins != 0 &&
        (Date.now() - config.lastAutoHandleBounties) / 60000 > config.autoHandleBountiesIntervalInMins
      ) {
        console.log('autoBounty: ', (Date.now() - config.lastAutoHandleBounties) / 60000, ' just passed');
        handleBounties();
        config.lastAutoHandleBounties = Date.now();
      }

      if (config.autoLabResearch && (Date.now() - config.lastLabResearch) / 60000 > 20) {
        console.log('autoResearch: ', (Date.now() - config.lastLabResearch) / 60000, ' just passed');
        handleGotoGnomeLab();
        config.lastLabResearch = Date.now();
      }

      if (
        (config.autoHandleTradeHabor || config.autoBuyCaramelStuff || config.autoBuySeaFairy) &&
        (Date.now() - config.lastHandleTradeHabor) / 60000 > 120
      ) {
        console.log('handleTradeHabor: ', (Date.now() - config.lastHandleTradeHabor) / 60000, ' just passed');
        handleGotoTradeHabor();
        config.lastHandleTradeHabor = Date.now();
      }

      if ((Date.now() - config.lastTryResolveGreenChecks) / 60000 > 20) {
        console.log(
          'handleTryResolveGreenChecks: ',
          (Date.now() - config.lastTryResolveGreenChecks) / 60000,
          ' just passed'
        );
        handleTryResolveGreenChecks();
      }

      if ((Date.now() - config.lastAutoGuildBattle) / 60000 > 120) {
        console.log('autoGuildBattle: ', (Date.now() - config.lastAutoGuildBattle) / 60000, ' mins just passed (>120)');
        handleGuildCheckinAndBattle();
        if (config.autoGuildBattleDragon) {
          guildBattleDragon();
        }
        if (config.autoGuildAllianceBattle) {
          handleGuildBattleAlliance();
        }
        config.lastAutoGuildBattle = Date.now();
      }

      if (
        config.worksBeforeCollectCandy != 0 &&
        (Date.now() - config.lastCollectCandyTime) / 60000 > config.worksBeforeCollectCandy
      ) {
        console.log('Collect candy: ', (Date.now() - config.lastCollectCandyTime) / 60000, ' just passed');
        handleFindAndTapCandyHouse();
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

      if (checkIsPage(pageInProduction)) {
        console.log('in production, continue work');
        config.jobFailedCount = 0;
        continue;
      } else if (handleRelogin()) {
        console.log('just handleRelogin()');
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
        console.log('Cookie not active, restart CookieKingdom and wait 20s');
        checkAndRestartApp();
      } else if (checkIsPage(pageCookieKingdomIsNotResponding)) {
        console.log('Popped cookie kingdom is not responding window, tap wait');
        qTap(pageCookieKingdomIsNotResponding);
        sleep(3000);
      } else if (checkIsPage(pageCookieKingdomIsNotResponding2)) {
        console.log('Popped cookie kingdom is not responding window, tap wait');
        qTap(pageCookieKingdomIsNotResponding2);
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
      } else if (handleFindAndTapCandyHouse()) {
        console.log('just handleFindAndTapCandyHouse()');
        config.jobFailedCount = 0;
        continue;
      } else if (config.jobFailedCount % 10 == 0 && handleGotoKingdomPage()) {
        console.log('just handleGotoKingdomPage()');
        config.jobFailedCount = 0;
        continue;
      }
    } else {
      config.jobFailedCount = 0;
      sendEvent('running', '');
      // console.log('Cookie action successfully at: ', new Date().toLocaleString());
    }
  }
}

// sendEvent('running', '')
// loadImages();
// start(JSON.stringify(config));
