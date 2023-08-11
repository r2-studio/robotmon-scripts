import { WishStatus } from './types';

export const defaultConfig = {
  sleep: 240,
  sleepAnimate: 800,
  sleepWhenDoubleLoginInMinutes: 30,

  // Sample TEST long ID
  // account: 'moonminv35moonminv35moonminv35moonminv35moonminv35moonminv35moonminv35@gmail.com',
  account: 'default_xrobotmon_account@gmail.com',
  password: '',
  materialsTarget: 2000,
  goodsTarget: 320,
  productSafetyStock: 10,
  skipMagicLabProduction: false,
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
  autoLabResearch: true,
  autoResearchKingdom: true,
  autoResearchCookies: true,
  autoLabUseAuroraMaterial: true,
  autoHandleTradeHabor: true,
  autoBalanceAuroraStocks: true,
  autoShopInSeasideMarket: true,
  autoBuyCaramelStuff: true,
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
  isNewKingdomCheckRequired: true,
  isSendPlayingRequired: true,

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
  isMaintainanceMode: false,
  loginRetryMaxTimes: 2,
  loginRetryCount: 0,
  tryRestartGameCount: 0,
  tryRestartGameLimit: 5,
  needToSendLoginSuccess: true,
  needToSendPlaying: true,

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

export const defaultWishes = [
  {
    id: 0,
    refreshPnt: { x: 149, y: 74 },
    unfoldPnt: { x: 163, y: 160 },
    fulfillPnt: { x: 183, y: 283 },
    status: WishStatus.unknown,
    requirementIconPnts: {
      0: { x: 162, y: 198 },
      1: { x: 198, y: 198 },
      2: { x: 162, y: 235 },
      3: { x: 198, y: 235 },
    },
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  },
  {
    id: 1,
    refreshPnt: { x: 264, y: 74 },
    unfoldPnt: { x: 275, y: 160 },
    fulfillPnt: { x: 295, y: 283 },
    status: WishStatus.unknown,
    requirementIconPnts: {
      0: { x: 275, y: 198 },
      1: { x: 312, y: 198 },
      2: { x: 275, y: 235 },
      3: { x: 312, y: 235 },
    },
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  },
  {
    id: 2,
    refreshPnt: { x: 377, y: 74 },
    unfoldPnt: { x: 390, y: 160 },
    fulfillPnt: { x: 400, y: 283 },
    status: WishStatus.unknown,
    requirementIconPnts: {
      0: { x: 390, y: 198 },
      1: { x: 425, y: 198 },
      2: { x: 390, y: 235 },
      3: { x: 425, y: 235 },
    },
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  },
  {
    id: 3,
    refreshPnt: { x: 490, y: 74 },
    unfoldPnt: { x: 500, y: 160 },
    fulfillPnt: { x: 520, y: 283 },
    status: WishStatus.unknown,
    requirementIconPnts: {
      0: { x: 508, y: 198 },
      1: { x: 545, y: 198 },
      2: { x: 508, y: 235 },
      3: { x: 545, y: 235 },
    },
    failedCount: 0,
    requireFulfilled: 0,
    golden: false,
  },
];
