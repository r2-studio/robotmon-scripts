import { rerouter, Utils, XYRGB, Page, XY, GroupPage } from 'Rerouter';
import { seasideStockRect, goodsLocationRect, TaskStatus, searchHosePaths, Icon } from './src/types';
import { logs, sendKeyBack, sendEventRunning } from './src/utils';
import {
  scrollDownALot,
  scrollLeftALot,
  scrollRightALot,
  getStatusOfGivenWish,
  checkToSendSpecificWish,
  AdvanturesBountiesAt3rd,
  checkScreenMessage,
  getMayhemScores,
  findSpecificIconInScreen,
  swipeFromToPoint,
  ocrNumberInRect,
  considerPurchaseSeasideMarket,
  tapThroughAnimate,
  handleNextProductionBuilding,
  swipeDown3Items,
  countProductionSlotAvailable,
  makeGoodsToTarget,
  ocrStockAndReqInRect,
  swipeDownOneItem,
  swipeDirection,
  searchForCandyHouse,
  saveImageToDisk,
  configSharePref,
  mergeObject,
  checkIfInBattle,
  collectFinishedGoods,
  checkLoginFailedMaxReached,
  findUnmatchInPage,
  checkIfTrainRequirementMet,
  assign,
} from './src/helper';
import { config, defaultConfig, defaultWishes } from './src/scriptConfig';

import * as PAGES from './src/pages';
import * as ICONS from './src/icons';
import * as CONSTANTS from './src/constants';
import { TASKS } from './src/tasks';
import * as MessageWindow from './src/messageWindow';
import { globalStorage } from './src/storage';
import { addBountiesRoutes, addBountiesTask } from './src/tasks/bounties';
import { addHotAirBallonRoutes, addHotAirBallonTask } from './src/tasks/hotAirBallon';
import { addPvpArenaRoutes, addPvpArenaTask, addPvpPurchaseTask } from './src/tasks/pvpArena';
import { addTropicalIslandRoutes, addTropicalIslandTasks } from './src/tasks/tropicalIsland';
import { addGnomeLabRoutes, addGnomeLabTasks } from './src/tasks/gnomeLab';

const VERSION_CODE: number = 0.1;

export class CookieKingdom {
  public packageName: string = 'com.devsisters.ck';

  public config = defaultConfig;
  wishes = defaultWishes;
  taskStatus: TaskStatus = {};
  lastBattleChecked: number = 0;

  constructor(config: any) {
    console.log('############ new CRK ############');
    console.log('new CRK with input: ', JSON.stringify(config));
    try {
      if (typeof xDecodeHex !== 'undefined') {
        config.account = xDecodeHex(config.account);
        config.password = xDecodeHex(config.password);
        console.log('Decode successfully, ', config.account);
      }
    } catch (e) {
      console.log('Unable to decode, fall back to original account: ', e);
    }

    this.config = config;

    rerouter.defaultConfig.TaskConfigAutoStop = true;
    rerouter.defaultConfig.RouteConfigDebug = true;
    rerouter.rerouterConfig.startAppDelay = 15 * 1000;
    rerouter.screenConfig.rotation = 'horizontal';
    rerouter.screenConfig.devHeight = 360;
    rerouter.screenConfig.devWidth = 640;
    rerouter.debug = false;

    console.log(`script version ${VERSION_CODE}`);
  }
  public start() {
    this.init();
    this.initTaskStatus();

    console.log('>', rerouter.getCurrentMatchNames());
    // console.log('>>', findUnmatchInPage(PAGES.rfpageInPVPArena));
    // return;

    rerouter.start(this.packageName);
  }
  public stop() {
    // TODO: seems not working
    console.log('stopping');
    const allIcons: { [key: string]: Icon } = ICONS as any;
    for (const iconIdx in allIcons) {
      const icon = allIcons[iconIdx];
      if (!(icon instanceof Icon)) {
        continue;
      }
      releaseImage(icon.image);
      console.log(`release: ${iconIdx}`);
    }

    for (let idx in ICONS.numberImagesProdutRequirements) {
      if (ICONS.numberImagesProdutRequirements[idx].image !== undefined) {
        ICONS.numberImagesProdutRequirements[idx].releaseImage();
      }
    }
    for (let idx in ICONS.numberImagesPvP) {
      if (ICONS.numberImagesPvP[idx].image !== undefined) {
        ICONS.numberImagesPvP[idx].releaseImage();
      }
    }
    for (let idx in ICONS.numberImagesSuperMayhem) {
      if (ICONS.numberImagesSuperMayhem[idx].image !== undefined) {
        ICONS.numberImagesSuperMayhem[idx].releaseImage();
      }
    }
    for (let idx in ICONS.numberImagesWishingTree) {
      if (ICONS.numberImagesWishingTree[idx].image !== undefined) {
        ICONS.numberImagesWishingTree[idx].releaseImage();
      }
    }

    rerouter.stop();
  }

  public init() {
    this.addTasks();
    this.addRoutes();
    this.handleUnknown();

    // show current page
    // rerouter.getCurrentMatchNames();

    for (let idx in ICONS.numberImagesProdutRequirements) {
      if (ICONS.numberImagesProdutRequirements[idx].image === undefined) {
        ICONS.numberImagesProdutRequirements[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberImagesPvP) {
      if (ICONS.numberImagesPvP[idx].image === undefined) {
        ICONS.numberImagesPvP[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberImagesSuperMayhem) {
      if (ICONS.numberImagesSuperMayhem[idx].image === undefined) {
        ICONS.numberImagesSuperMayhem[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberImagesWishingTree) {
      if (ICONS.numberImagesWishingTree[idx].image === undefined) {
        ICONS.numberImagesWishingTree[idx].loadImage();
      }
    }
    for (let idx in ICONS.bNumbers) {
      if (ICONS.bNumbers[idx].image === undefined) {
        ICONS.bNumbers[idx].loadImage();
      }
    }
    for (let idx in ICONS.wNumbers) {
      if (ICONS.wNumbers[idx].image === undefined) {
        ICONS.wNumbers[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberAuroraStockInTradeBird) {
      if (ICONS.numberAuroraStockInTradeBird[idx].image === undefined) {
        ICONS.numberAuroraStockInTradeBird[idx].loadImage();
      }
    }

    // for (let idx in ICONS.iconsGnomeLabCookies) {
    //   if (ICONS.iconsGnomeLabCookies[idx].image === undefined) {
    //     ICONS.iconsGnomeLabCookies[idx].loadImage();
    //   }
    // }
  }

  public initTaskStatus() {
    this.taskStatus[TASKS.login] = {
      loginRetryCount: 0,
    };

    this.taskStatus[TASKS.getInShopFreeDailyPack] = {
      trials: 0,
    };
    this.taskStatus[TASKS.wishingTree] = {
      records: {
        opened: 0,
        golden: 0,
        fulfilled: 0,
        notEnoughAndSkip: 0,
        goldenAndSkip: 0,
      },
    };


    this.taskStatus[TASKS.haborShopInSeaMarket] = {
      needPullToRightHead: true,
      rareItems: [],
      rightSlideCount: 0,
      rightSlideLimit: this.config.autoShopInSeasideMarket ? 5 : 0,
      needToBuyRadiantShard: this.config.autoBuyRadiantShardsInHabor,
      purchaseIndex: 0,
      foundResults: undefined,
      foundIndex: undefined,
    };
    if (this.config.autoBalanceAuroraStocks) {
      this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.push(seasideStockRect[0]);
      this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.push(seasideStockRect[1]);
      this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.push(seasideStockRect[2]);
    }
    if (this.config.autoBuyCaramelStuff) {
      this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.push(seasideStockRect[3]);
      this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.push(seasideStockRect[4]);
    }

    this.taskStatus[TASKS.haborShopInShellGallery] = {
      autoBuySeaFairy: this.config.autoBuySeaFairy,
      autoBuyEpicSoulEssence: this.config.autoBuyEpicSoulEssence,
      autoBuyLegendSoulEssence: this.config.autoBuyLegendSoulEssence,
      autoBuyGuildRelic: this.config.autoBuyGuildRelic,
    };

    this.taskStatus[TASKS.towerOfSweetChaos] = {
      tryCount: 0,
      tryLimit: this.config.autoHandleTowerOfSweetChaos ? 4 : 0,
    };

    this.taskStatus[TASKS.guildBattleDragon] = {
      bossIdx: 0,
    };
    this.taskStatus[TASKS.guildBattleAlliance] = {
      needIgniteBeacon: true,
    };

    this.taskStatus[TASKS.findAndTapCandy] = {
      searchHousePathIdx: 0, // There are 3 paths, each with differert steps
      searchHouseIdx: 0,
      needGotoHead: true,
    };
    this.taskStatus[TASKS.production] = {
      lastProductionBuilding: '',
      productionBuildingChecked: 0,
      stocks: {},
    };
  }

  public addTasks() {
    if (this.config.isMaintainanceMode) {
      rerouter.addTask({
        name: TASKS.maintainanceMode,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        forceStop: false,
      });
      return;
    }

    // In dev:
    if (this.config.autoLabResearch) {
      addGnomeLabTasks();
    }
    return;

    rerouter.addTask({
      name: TASKS.production,
      maxTaskDuring: 5 * CONSTANTS.minuteInMs,
      minRoundInterval: 360 * CONSTANTS.minuteInMs,
      forceStop: true,
    });

    // rerouter.addTask({
    //   name: TASKS.haborShopInSeaMarket,
    //   maxTaskDuring: 30 * CONSTANTS.minuteInMs,
    //   minRoundInterval: 120 * CONSTANTS.minuteInMs,
    //   forceStop: true,
    // });
    // TODO: FIX aurora OCR
    // return;

    if (this.config.autoCollectDailyReward) {
      rerouter.addTask({
        name: TASKS.collectKingdomPass,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: 240 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
      rerouter.addTask({
        name: TASKS.sendFriendReward,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: 240 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
      rerouter.addTask({
        name: TASKS.getInShopFreeDailyPack,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: 240 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoCollectMailIntervalInMins > 0) {
      rerouter.addTask({
        name: TASKS.collectMail,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: 240 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoSendHotAirBallonIntervalInMins > 0) {
      addHotAirBallonTask();
    }
    if (this.config.autoCollectTrainIntervalInMins > 0) {
      rerouter.addTask({
        name: TASKS.train,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: this.config.autoCollectTrainIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoFulfillWishesIntervalInMins > 0) {
      rerouter.addTask({
        name: TASKS.wishingTree,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        minRoundInterval: this.config.autoFulfillWishesIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoCollectFountainIntervalInMins > 0) {
      rerouter.addTask({
        name: TASKS.fountain,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: this.config.autoCollectFountainIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoPvPPurchaseAncientCookie) {
      addPvpPurchaseTask();
    }
    if (this.config.autoPvPIntervalInMins > 0) {
      addPvpArenaTask();
    }
    // TODO: no super mayhem for now
    // if (this.config.autoSuperMayhemIntervalInMins > 0) {
    //   rerouter.addTask({
    //     name: TASKS.superMayhem,
    //     maxTaskDuring: 9 * CONSTANTS.minuteInMs,
    //     minRoundInterval: this.config.autoSuperMayhemIntervalInMins * CONSTANTS.minuteInMs,
    //     forceStop: true,
    //   });
    // }
    if (this.config.autoCollectTropicalIslandsIntervalInMins > 0) {
      addTropicalIslandTasks();
    }

    if (this.config.autoHandleBountiesIntervalInMins > 0) {
      addBountiesTask();
    }

    if (this.config.autoLabResearch) {
      addGnomeLabTasks();
    }

    if (this.config.autoHandleTradeHabor) {
      rerouter.addTask({
        name: TASKS.haborSendShip,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        minRoundInterval: 120 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }

    // TODO: some additional icons might still missing
    if (
      this.config.autoBalanceAuroraStocks ||
      this.config.autoShopInSeasideMarket ||
      this.config.autoBuyCaramelStuff ||
      this.config.autoBuyRadiantShardsInHabor
    ) {
      rerouter.addTask({
        name: TASKS.haborShopInSeaMarket,
        maxTaskDuring: 15 * CONSTANTS.minuteInMs,
        minRoundInterval: 120 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoBuySeaFairy || this.config.autoBuyEpicSoulEssence || this.config.autoBuyLegendSoulEssence || this.config.autoBuyGuildRelic) {
      rerouter.addTask({
        name: TASKS.haborShopInShellGallery,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: 120 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }

    if (this.config.autoHandleTowerOfSweetChaos) {
      rerouter.addTask({
        name: TASKS.towerOfSweetChaos,
        maxTaskDuring: 7 * CONSTANTS.minuteInMs,
        minRoundInterval: 240 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }

    rerouter.addTask({
      name: TASKS.guildCheckin,
      maxTaskDuring: 3 * CONSTANTS.minuteInMs,
      minRoundInterval: 180 * CONSTANTS.minuteInMs,
      forceStop: true,
    });
    if (this.config.autoGuildBattleDragon) {
      rerouter.addTask({
        name: TASKS.guildBattleDragon,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        minRoundInterval: 180 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }
    if (this.config.autoGuildAllianceBattle) {
      rerouter.addTask({
        name: TASKS.guildBattleAlliance,
        maxTaskDuring: 40 * CONSTANTS.minuteInMs,
        minRoundInterval: 180 * CONSTANTS.minuteInMs,
        forceStop: true,
      });
    }

    rerouter.addTask({
      name: TASKS.findAndTapCandy,
      maxTaskDuring: 7 * CONSTANTS.minuteInMs,
      minRoundInterval: this.config.autoFulfillWishesIntervalInMins * CONSTANTS.minuteInMs,
      forceStop: true,
    });
    rerouter.addTask({
      name: TASKS.production,
      maxTaskDuring: 10 * CONSTANTS.minuteInMs,
      forceStop: true,
    });

    rerouter.addTask({
      name: TASKS.resolveGreenChecks,
      maxTaskDuring: 10 * CONSTANTS.minuteInMs,
      minRoundInterval: 240 * CONSTANTS.minuteInMs,
      forceStop: true,
    });
  }

  public addRoutes() {
    // Login pages
    rerouter.addRoute({
      path: `/${PAGES.rfpageInputAge.name}`,
      match: PAGES.rfpageInputAge,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'input rfpageInputAge');

        rerouter.screen.tap({ x: 285 + Math.random() * 35, y: 213 });
        Utils.sleep(this.config.sleep);
        rerouter.goNext(PAGES.rfpageInputAge);
        Utils.sleep(this.config.sleep);

        rerouter.screen.tap({ x: 370, y: 150 });
        Utils.sleep(CONSTANTS.sleepAnimate);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageChooseLoginMethod.name}`,
      match: PAGES.rfpageChooseLoginMethod,
      action: (context, image, matched, finishRound) => {
        if (context.task.name === TASKS.maintainanceMode) {
          logs(context.task.name, 'maintainanceMode, do nothing and sleep 60s');
          Utils.sleep(60000);
          return;
        }

        logs(context.task.name, 'input rfpageChooseLoginMethod');
        rerouter.goNext(PAGES.rfpageChooseLoginMethod);
        Utils.sleep(CONSTANTS.sleepAnimate);
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageEnterEmail.name}`,
      match: PAGES.rfpageEnterEmail,
      action: (context, image, matched, finishRound) => {
        if (context.task.name === TASKS.maintainanceMode) {
          logs(context.task.name, 'maintainanceMode, do nothing and sleep 60s');
          Utils.sleep(60000);
          return;
        }

        logs(context.task.name, 'input email');

        rerouter.screen.tap({ x: 370, y: 150 });
        Utils.sleep(CONSTANTS.sleepAnimate);
        logs(context.task.name, `typing email ${this.config.account}`);

        typing(this.config.account, 1000);
        Utils.sleep(4000); // sleep must equal to typing
        typing('\n', 500);
        Utils.sleep(1000);

        const incorrectEmailFormat = {
          name: 'incorrectEmailFormat',
          x: 222,
          y: 166,
          width: 172,
          height: 12,
          targetY: 6,
          lookingForColor: { r: 226, g: 86, b: 86 },
          targetColorCount: 44,
          targetColorThreashold: 3,
        };
        const needRegisterDevPlayAccount = {
          name: 'needRegisterDevPlayAccount',
          x: 222,
          y: 166,
          width: 172,
          height: 12,
          targetY: 6,
          lookingForColor: { r: 226, g: 86, b: 86 },
          targetColorCount: 34,
          targetColorThreashold: 3,
        };
        const registerWithSocialPlatformMessageScreen = {
          name: 'registerWithSocialPlatformMessageScreen',
          x: 225,
          y: 162,
          width: 75,
          height: 13,
          targetY: 8,
          lookingForColor: { r: 244, g: 191, b: 191 },
          targetColorCount: 21,
          targetColorThreashold: 3,
        };
        if (checkScreenMessage(incorrectEmailFormat, PAGES.rfpageEnterEmail, image)) {
          logs(context.task.name, 'reported incorrectEmailFormat so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        } else if (checkScreenMessage(needRegisterDevPlayAccount, PAGES.rfpageEnterEmail, image)) {
          logs(context.task.name, 'reported needRegisterDevPlayAccount so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        } else if (checkScreenMessage(registerWithSocialPlatformMessageScreen, PAGES.rfpageEnterEmail, image)) {
          logs(context.task.name, 'reported registerWithSocialPlatformMessageScreen so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.groupPageEnterPassword.name}`,
      match: PAGES.groupPageEnterPassword,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'input password');

        rerouter.goNext(PAGES.rfpageEnterPasswordLongId);
        Utils.sleep(CONSTANTS.sleepAnimate);
        typing(this.config.password, 1000);
        Utils.sleep(CONSTANTS.sleepAnimate);
        typing('\n', 500);
        Utils.sleep(CONSTANTS.sleepAnimate);
        rerouter.screen.tap({ x: 370, y: 190 });

        const wrongPasswordMessageScreen = {
          name: 'wrongPasswordMessageScreen',
          x: 225,
          y: 162,
          width: 75,
          height: 13,
          targetY: 6,
          lookingForColor: { r: 230, g: 100, b: 100 },
          targetColorCount: 17,
          targetColorThreashold: 2,
        };
        const wrongPasswordMessageScreenWithLongId = {
          name: 'wrongPasswordMessageScreenWithLongId',
          x: 225,
          y: 175,
          width: 75,
          height: 13,
          targetY: 6,
          lookingForColor: { r: 244, g: 100, b: 100 },
          targetColorCount: 25,
          targetColorThreashold: 2,
        };
        const passwordTooShortMessageScreen = {
          name: 'passwordTooShortMessageScreen',
          x: 225,
          y: 162,
          width: 75,
          height: 13,
          targetY: 4,
          lookingForColor: { r: 244, g: 191, b: 191 },
          targetColorCount: 2,
          targetColorThreashold: 0,
        };
        if (checkScreenMessage(wrongPasswordMessageScreen, PAGES.rfpageEnterpassword, image)) {
          logs(context.task.name, 'reported wrongPasswordMessageScreen so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        }
        if (checkScreenMessage(wrongPasswordMessageScreenWithLongId, PAGES.rfpageEnterPasswordLongId, image)) {
          logs(context.task.name, 'reported wrongPasswordMessageScreenWithLongId so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        }
        if (checkScreenMessage(passwordTooShortMessageScreen, PAGES.rfpageEnterpassword, image)) {
          logs(context.task.name, 'reported passwordTooShortMessageScreen so handle it');
          checkLoginFailedMaxReached(this.taskStatus[TASKS.login], this.config.loginRetryMaxTimes, this);
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInLoginPageWithGearAndVideo.name}`,
      match: PAGES.rfpageInLoginPageWithGearAndVideo,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'tapping (575, 22) until the game start every 3 secs');

        rerouter.screen.tap({ x: 575, y: 22 });
        Utils.sleep(3000);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageAnnouncement.name}`,
      match: PAGES.rfpageAnnouncement,
      action: (context, image, matched, finishRound) => {
        if (this.config.needToSendLoginSuccess) {
          logs(context.task.name, 'have not send login-success, send it');
          sendEvent('gameStatus', 'login-succeeded');
          this.config.needToSendLoginSuccess = false;
        }
        if (this.config.needToSendPlaying) {
          Utils.sleep(3000);
          logs(context.task.name, 'have not send needToSendPlaying, send it');
          sendEvent('gameStatus', 'login-succeeded');
          this.config.needToSendPlaying = false;
        }

        rerouter.goNext(PAGES.rfpageAnnouncement);
      },
    });

    // Daily tasks
    rerouter.addRoute({
      path: `/${PAGES.rfkingdomPassItemCollected.name}`,
      match: PAGES.rfkingdomPassItemCollected,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.collectKingdomPass) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, 'rfkingdomPassItemCollected, task finished');
        rerouter.goNext(PAGES.rfkingdomPassItemCollected);
        sendEventRunning();
        finishRound(true);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageMailsAllClaimed.name}`,
      match: PAGES.rfpageMailsAllClaimed,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.collectMail) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, 'rfpageMailsAllClaimed, task finished');
        rerouter.goNext(PAGES.rfkingdomPassItemCollected);
        sendEventRunning();
        finishRound(true);
      },
    });
    // TODO: double verify friend reward is sent
    rerouter.addRoute({
      path: `/${PAGES.rfpageInFriendsList.name}`,
      match: PAGES.rfpageInFriendsList,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.sendFriendReward) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, 'rfpageInFriendsList, task finished');
        rerouter.goNext(PAGES.rfpageFriendRewardsSent);
        sendKeyBack();
        sendEventRunning();
        finishRound(true);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInShop.name}`,
      match: PAGES.rfpageInShop,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.getInShopFreeDailyPack) {
          sendKeyBack();
          return;
        }

        const trial = this.taskStatus[TASKS.getInShopFreeDailyPack]['trials'];

        // const rfpageNecessities = new Page('rfpageNecessities', [{ x: 114, y: 70, r: 255, g: 109, b: 107 }]);
        const rfpageNecessitiesPnt = { x: 114, y: 70 };

        const x = rfpageNecessitiesPnt.x;
        let y = rfpageNecessitiesPnt.y;
        for (let i = 0; i < 5; i++) {
          y = rfpageNecessitiesPnt.y + i * 20;
          rerouter.screen.tap({ x, y });
          Utils.sleep(this.config.sleepAnimate);
          logs(context.task.name, `rfpageInShop, scroll down to daily gift, trial: #${trial}, tapping (${x}, ${y})`);

          if (rerouter.isPageMatch(PAGES.rfpageIsDailyFreePackageClaimed)) {
            logs(context.task.name, 'rfpageIsDailyFreePackageClaimed, task finished');
            rerouter.goNext(PAGES.rfpageIsDailyFreePackageClaimed);
            finishRound(true);
            return;
          } else if (rerouter.isPageMatch(PAGES.rfpageIsDailyFreePackageNotClaimed)) {
            logs(context.task.name, 'rfpageIsDailyFreePackageNotClaimed, tap it');
            rerouter.goNext(PAGES.rfpageIsDailyFreePackageNotClaimed);
            return;
          }
        }

        if (trial < 7) {
          scrollDownALot({ x: 60, y: 300 });

          if (trial > 3) {
            swipeFromToPoint({ x: 60, y: 71 }, { x: 60, y: 210 }, 5);
          }
          // Shop menu swipe up
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({
            x: x,
            y: y,
          });
          Utils.sleep(CONSTANTS.sleepAnimate * 2);
          // items swipe to left most
          scrollLeftALot({ x: 137, y: 268 });
          Utils.sleep(CONSTANTS.sleepAnimate);

          this.taskStatus[TASKS.getInShopFreeDailyPack]['trials']++;
        } else {
          this.taskStatus[TASKS.getInShopFreeDailyPack]['trials'] = 0;
          logs(context.task.name, `Cannot find daily pack, max retry reached: ${this.taskStatus[TASKS.getInShopFreeDailyPack]['trials']}, skipping this task`);
          finishRound(trial);
        }
      },
    });

    // Hot air ballon pages
    addHotAirBallonRoutes();

    // Train pages
    // TODO: NG！ 用鑽買東西的頁面會被判斷成 rfpageNewDataPackDownloadFailed，會自動按下花鑽石買東西
    rerouter.addRoute({
      path: `/${PAGES.rfpageInTrainStation.name}`,
      match: PAGES.rfpageInTrainStation,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.train) {
          logs(context.task.name, `rfpageInTrainStation, leave because current task is not wishing tree, but: ${context.task.name}`);
          rerouter.screen.tap({ x: 618, y: 28 }); // tap X
          return;
        }

        logs(context.task.name, 'rfpageInTrainStation, handle train');

        const rfpageFirstTrainOut = new Page('rfpageFirstTrainOut', [
          { x: 430, y: 95, r: 121, g: 227, b: 0 },
          { x: 454, y: 94, r: 231, g: 142, b: 83 },
        ]);
        const rfpageSecondTrainOut = new Page('rfpageSecondTrainOut', [
          { x: 430, y: 198, r: 129, g: 227, b: 0 },
          { x: 453, y: 199, r: 229, g: 148, b: 85 },
        ]);
        const rfpageThirdTrainOut = new Page('rfpageThirdTrainOut', [
          { x: 430, y: 302, r: 121, g: 227, b: 0 },
          { x: 455, y: 301, r: 231, g: 138, b: 82 },
        ]);

        if (!rerouter.isPageMatchImage(rfpageFirstTrainOut, image)) {
          rerouter.screen.tap({ x: 255, y: 110 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 210, y: 110 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 170, y: 110 });
          Utils.sleep(CONSTANTS.sleepAnimate);

          checkIfTrainRequirementMet();
        }
        if (!rerouter.isPageMatchImage(rfpageSecondTrainOut, image)) {
          rerouter.screen.tap({ x: 255, y: 208 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 210, y: 208 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 170, y: 208 });
          Utils.sleep(CONSTANTS.sleepAnimate);

          checkIfTrainRequirementMet();
        }
        if (!rerouter.isPageMatchImage(rfpageThirdTrainOut, image)) {
          rerouter.screen.tap({ x: 255, y: 307 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 210, y: 307 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({ x: 170, y: 307 });
          Utils.sleep(CONSTANTS.sleepAnimate);

          checkIfTrainRequirementMet();
        }

        if (this.config.autoCollectTrainIntervalInMins == 0) {
          logs(context.task.name, 'handleTrainStation skipped as autoCollectTrainIntervalInMins is set to 0');
          finishRound(true);
          return;
        }

        Utils.sleep(8000);

        const foundResults = findSpecificIconInScreen(ICONS.iconSendAll);
        for (let i in foundResults) {
          let sendTrainBtn = foundResults[i];
          sendTrainBtn.x += 30;
          sendTrainBtn.y += 15;
          rerouter.screen.tap(foundResults[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap(foundResults[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
        }

        const foundResultsSmall = findSpecificIconInScreen(ICONS.iconSendAllSmall);
        for (let i in foundResultsSmall) {
          let sendTrainBtn = foundResultsSmall[i];
          sendTrainBtn.x += 30;
          sendTrainBtn.y += 15;
          rerouter.screen.tap(foundResultsSmall[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap(foundResultsSmall[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
        }

        rerouter.goNext(PAGES.rfpageInTrainStation);
        Utils.sleep(CONSTANTS.sleepAnimate);
        logs(context.task.name, `Tried to sent ${foundResults.length + foundResultsSmall.length} trains`);
        finishRound(true);
      },
    });

    // Wishing trees
    rerouter.addRoute({
      path: `/${PAGES.rfpageInWishingTree.name}`,
      match: PAGES.rfpageInWishingTree,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.wishingTree) {
          logs(context.task.name, `rfpageInWishingTree, leave because current task is not wishing tree, but: ${context.task.name}`);
          rerouter.screen.tap({ x: 618, y: 20 }); // tap X
          return;
        }

        logs(context.task.name, `rfpageInWishingTree, start working`);

        const rfpageAllWishingDailyRewardCollected = new Page('rfpageAllWishingDailyRewardCollected', [
          { x: 59, y: 242, r: 247, g: 247, b: 247 },
          { x: 60, y: 256, r: 138, g: 138, b: 138 },
        ]);

        if (rerouter.isPageMatchImage(rfpageAllWishingDailyRewardCollected, image) && !this.config.alwaysFulfillWishes) {
          logs(context.task.name, `rfpageInWishingTree, All wish fulfilled, skipping and send running`);
          // sendEvent('running', '');
          sendEventRunning();
          rerouter.screen.tap({ x: 618, y: 20 }); // tap X
          finishRound(true);
          return;
        }

        let refreshing = 0;
        for (var i in this.wishes) {
          var wish = this.wishes[i];

          let records = this.taskStatus[TASKS.wishingTree].records;
          var result = getStatusOfGivenWish(wish, this.taskStatus[TASKS.wishingTree].records, this.config.wishingTreeRefreshGoldenWishes, rerouter);
          wish = result['wish'];
          records = result['records'];
          console.log('handling wish', i, JSON.stringify(wish));

          if (wish.status === 'refresh') {
            refreshing++;
            continue;
          } else if (wish.status === 'opened') {
            result = checkToSendSpecificWish(wish, records, this.config.wishingTreeSafetyStock, rerouter);
            wish = result['wish'];
            records = result['records'];
            console.log('handled wish', i, JSON.stringify(wish));
          }

          this.taskStatus[TASKS.wishingTree].records = records;
          Utils.sleep(CONSTANTS.sleep);
        }
        console.log('>>> Wising tree records', JSON.stringify(this.taskStatus[TASKS.wishingTree].records));

        var rfpageCollectTreeReward = new Page('rfpageCollectTreeReward', [{ x: 85, y: 289, r: 44, g: 203, b: 8 }]);
        if (rerouter.isPageMatch(rfpageCollectTreeReward)) {
          console.log('Daily reward collected');
          rerouter.screen.tap({ x: 60, y: 255 });
          Utils.sleep(2000);

          rerouter.waitScreenForMatchingPage(PAGES.rfpageInWishingTree, 8000);
          // waitUntilSeePage(pageInWishingTree, 8, pageCollectTreeReward);
        }

        if (refreshing === 4) {
          console.log('All wishes are refreshing, jobs done here');
          // break;
          return;
        }

        // if (!checkAndRestartApp()) {
        //   console.log('detected game crashed, restart and finish handleInWishingTree');
        //   return false;
        // }

        // console.log('Run wishing tree for ', (Date.now() - wishingTreeStartTime) / 60000, ' mins, ending this task');
        sendEventRunning();
        finishRound(true);
        return true;
      },
    });

    // Fountain
    rerouter.addRoute({
      path: `/${PAGES.rfpageInCookieCastle.name}`,
      match: PAGES.rfpageInCookieCastle,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.fountain) {
          logs(context.task.name, `rfpageInCookieCastle, leave because current task is not fountain, but: ${context.task.name}`);
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);
          return;
        }

        logs(context.task.name, 'tap back to leave rfpageInCookieCastle');
        sendKeyBack();

        if (rerouter.waitScreenForMatchingPage(PAGES.rfpageInKingdomVillage, 3000)) {
          logs(context.task.name, 'try goto fountain');

          var img = getScreenshot();
          var checked = getImageFromBase64(
            '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9hPE37f8A8O/CHiC8tb++1+HT9PvW02915PDGpyeHbG5Sf7PJHLqawG0QRyh45ZDKEheKRJWjZSo9Q8SePtP8HeHb7WNWv7LTdK0u2kvb28uZVihtYI1LvLI7HaiKoLEk4AB5xX5T/HWTXvgH41f4UeI/PuvDUkN3d+FJ5GMlrrWns7PPGynI+1QCQLOODICs2AHZRneEfjHq03wt0nwdrniM6x4T8G3Uc3hrQTFLLcXUyuHtUv5mylxa2LIGgiO5pJDB5gP2VWn/ABXH+MFLL8ZisFmWHdOVJXh15/S3c+GxXHGDwmLqYTGXhKKur/a9P0Po/wCKvxz1D446rfeJvE2r+LvCvh+NGXw34e07xHqPhxrSyHznU9TktJref7TOAGS1lcpbwBd6CaSUJ9BfsA/G3xF8Zv2TvDPiXxBcXGoXWpTah9jv7u0NtNqmnJf3Men3jIERcz2aW825URX83cqhWAr4b/Zr+DGoftz+OX1HxFG1x8JNFvnbU2ust/wm+oI+TaLkgyWcEykzucpNKhiG5UlNfoc3i3yjt27cdlPAro8Of9Yce6ud53U5VWS9nSS0hG903fW7/I9fJcVisXB4qouWMvhXW3dnz3+0n8N9D/aQ+HN14Z123kjWOZbvTtRt8LeaPex58m7t3xlJUO4Z5DKzowZHZW+OdD/YC+KHiXxmml+I77wrpnhuaby9U1nRr2Y3l/bYO9ba3eIC2llxtZjI4iWRvLLFVIKK+tzzhfLcxxFPEYykpypvRv8AJ915M0zjhnLMwr062LpKUoPS/wDWp93eD9QsPAXhjT9F0fT7bS9H0q2S2s7W2iWOK2gRQqIijooXGBXXWjT6hbrNGuUfp8y9uO4zRRX0tH4D6KlFQfKuh//Z'
          );
          const foundResults = findImages(img, checked, 0.92, 5, true);
          console.log('Found checked icon at: ', JSON.stringify(foundResults));
          releaseImage(img);
          releaseImage(checked);

          if (Object.keys(foundResults).length > 0) {
            console.log('Fount fountain full check icon, tap it');
            rerouter.screen.tap({ x: foundResults[0].x + 10, y: foundResults[0].y + 10 });
          } else {
            console.log("Can't find fountain full image, try to tap it");
            rerouter.screen.tap({ x: 490, y: 359 });
            Utils.sleep(this.config.sleepAnimate);
            rerouter.screen.tap({ x: 490, y: 295 });
            Utils.sleep(this.config.sleepAnimate);
            rerouter.screen.tap({ x: 540, y: 295 });
            Utils.sleep(this.config.sleepAnimate);
          }
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInFountain.name}`,
      match: PAGES.rfpageInFountain,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.fountain) {
          sendKeyBack();
          return;
        }

        // 3rd raw is empty, fountain is pretty clean
        if (rerouter.isPageMatchImage(PAGES.rfpageFountain3rdRawEmpty, image)) {
          logs(context.task.name, 'rfpageFountain3rdRawEmpty 3rd raw empty, set task complete');
          rerouter.screen.tap({ x: 500, y: 310 }); // tap Claim
          sendEventRunning();
          finishRound(true);
          return;
        }

        logs(context.task.name, 'rfpageInFountain and collect it');
        rerouter.screen.tap({ x: 500, y: 310 }); // tap Claim
        sendEventRunning();
        finishRound(true); // 如果可以正確辨識收成功，這個可以刪除，否則是用水池偏空當作有收成功
      },
    });

    // PVP
    addPvpArenaRoutes();

    // Super Mayhem
    rerouter.addRoute({
      path: `/${PAGES.rfpageInSuperMayhem.name}`,
      match: PAGES.rfpageInSuperMayhem,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.superMayhem) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `in rfpageInSuperMayhem`);
        const battleY = [75, 160, 250];

        var scores = getMayhemScores();
        logs(context.task.name, `super mayhem scores: ${JSON.stringify(scores)}`);
        for (let i = 0; i < scores.length; i++) {
          var ce = scores[i];
          if (ce < this.config.autoPvPTargetScoreLimit && ce !== 0) {
            if (!rerouter.screen.isSameColor({ x: 590, y: battleY[i], r: 121, g: 207, b: 16 })) {
              logs(context.task.name, `Already Battled with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
              continue;
            }

            logs(context.task.name, `Battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
            rerouter.screen.tap({ x: 590, y: battleY[i] }); // tap Battle
            if (rerouter.waitScreenForMatchingPage(PAGES.rfpageSuperMayhemReadyToBattle, 2000)) {
              return;
            }
          } else {
            logs(context.task.name, `Not to battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
          }
        }

        if (rerouter.isPageMatch(PAGES.rfpageBattleTargetCanRefresh)) {
          logs(context.task.name, `Tap Super mayhem refresh`);
          rerouter.screen.tap({ x: 532, y: 329 });
        } else {
          logs(context.task.name, `Cannot tap Super mayhem refresh, job done`);
          sendEventRunning();
          finishRound(true);
          return;
        }
      },
    });

    // Tropical Island
    addTropicalIslandRoutes();

    // Bounties
    addBountiesRoutes();

    // Gnome lab
    addGnomeLabRoutes();

    // Trade habor
    rerouter.addRoute({
      path: `/${PAGES.rfpageInTradeHabor.name}`,
      match: PAGES.rfpageInTradeHabor,
      action: (context, image, matched, finishRound) => {
        if (context.task.name === TASKS.findAndTapCandy) {
          logs(context.task.name, `rfpageInTradeHabor, but current task is ${context.task.name}, need to start over`);
          sendKeyBack();
          this.taskStatus[TASKS.findAndTapCandy]['needGotoHead'] = true;
          return;
        } else if (context.task.name.substring(0, 5) !== 'habor') {
          logs(context.task.name, `rfpageInTradeHabor, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        logs(context.task.name, `rfpageInTradeHabor`);

        switch (context.task.name) {
          case TASKS.haborSendShip:
            if (rerouter.isPageMatchImage(PAGES.rfpageNoShipInHabor, image)) {
              logs(context.task.name, `No ship in habor, finish ${context.task.name}`);
              sendEventRunning();
              finishRound(true);
              return;
            }

            // TODO: send ship not test yet
            var i = 0;
            var shipInHabor = true;
            for (i = 0; i < 5 && shipInHabor; i++) {
              for (var xPixel = i === 0 ? 55 : 200; xPixel < 620; xPixel += 60) {
                rerouter.screen.tap({ x: xPixel, y: 318 });
                Utils.sleep(this.config.sleepAnimate * 2);

                if (rerouter.isPageMatch(PAGES.rfpageCanLoadThisItem)) {
                  logs(context.task.name, `can load the item at x: ${xPixel}`);
                  rerouter.screen.tap({ x: 408, y: 202 }); // tap Max
                  Utils.sleep(this.config.sleep);

                  rerouter.screen.tap({ x: 342, y: 240 }); // tap load
                  Utils.sleep(this.config.sleepAnimate);
                }
                if (rerouter.isPageMatch(PAGES.rfpageLoadTooMuchWarning)) {
                  rerouter.screen.tap({ x: 270, y: 252 }); // Cancel ship confirm
                  Utils.sleep(this.config.sleepAnimate);
                  rerouter.screen.tap({ x: 270, y: 200 }); // tap minus icon
                  Utils.sleep(this.config.sleepAnimate);
                  rerouter.screen.tap({ x: 320, y: 240 }); // tap load
                  Utils.sleep(this.config.sleepAnimate);
                }
                if (rerouter.isPageMatch(PAGES.rfpageLoadTooMuchWarning)) {
                  //Even one item is too much
                  rerouter.screen.tap({ x: 270, y: 252 }); // Cancel ship confirm
                  Utils.sleep(this.config.sleepAnimate);
                  rerouter.screen.tap({ x: 434, y: 50 }); // tap close icon
                  Utils.sleep(this.config.sleepAnimate);
                  rerouter.screen.tap({ x: 320, y: 240 }); // tap load
                  Utils.sleep(this.config.sleepAnimate * 2);
                }

                if (rerouter.waitScreenForMatchingPage(PAGES.rfpageNoShipInHabor, 3000)) {
                  logs(context.task.name, `Send the ship successfully`);
                  shipInHabor = false;
                  break;
                }
              }

              if (rerouter.isPageMatch(PAGES.rfpageNoShipInHabor)) {
                break;
              }
              swipeFromToPoint({ x: 629, y: 319 }, { x: 200, y: 319 }, 5);
            }

            return;
          case TASKS.haborShopInSeaMarket:
            rerouter.screen.tap({ x: 95, y: 230 });
            return;
          case TASKS.haborShopInShellGallery:
            rerouter.screen.tap({ x: 32, y: 226 });
            return;
          default:
            console.log('donno what to do in rfpageInTradeHabor, send back');
            sendKeyBack();
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInSeasideMarket.name}`,
      match: PAGES.rfpageInSeasideMarket,
      action: (context, image, matched, finishRound) => {
        if (context.task.name.substring(0, 5) !== 'habor') {
          logs(context.task.name, `rfpageInSeasideMarket, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        logs(context.task.name, `In seaside marketing, send running, task status is: ${JSON.stringify(this.taskStatus[TASKS.haborShopInSeaMarket])}`);
        sendEvent('running', '');

        const marketSearchArea = { x: 0, y: 180, w: 630, h: 140 };
        let seamarketState = this.taskStatus[TASKS.haborShopInSeaMarket];
        if (rerouter.isPageMatch(PAGES.rfpageFreeRefreshSeasideMarket)) {
          rerouter.screen.tap({ x: 543, y: 336 }); // market free refresh, no need to pull to the head of the list as refresh will reset the list
          Utils.sleep(this.config.sleepAnimate);

          if (rerouter.waitScreenForMatchingPage(PAGES.rfpageNeedDiamondRefreshMarket, 3000)) {
            rerouter.goNext(PAGES.rfpageNeedDiamondRefreshMarket);
            Utils.sleep(this.config.sleepAnimate);
          }
        } else if (seamarketState.needPullToRightHead) {
          // swipe to start of the list
          swipeFromToPoint({ x: 0, y: 234 }, { x: 4000, y: 234 }, 6, undefined, PAGES.rfpageInSeasideMarket);
          seamarketState.needPullToRightHead = false;
        }

        const rfpage1stAuroraSoldOut = new Page('rfpage1stAuroraSoldOut', [{ x: 59, y: 262, r: 206, g: 20, b: 24 }]);
        const rfpage2ndAuroraSoldOut = new Page('rfpage2ndAuroraSoldOut', [{ x: 150, y: 257, r: 239, g: 24, b: 24 }]);
        const rfpage3rdAuroraSoldOut = new Page('rfpage3rdAuroraSoldOut', [{ x: 247, y: 260, r: 206, g: 20, b: 24 }]);
        const rfpageCarmelMapMax = new Page('rfpageCarmelMapMax', [
          { x: 339, y: 291, r: 196, g: 130, b: 72 },
          { x: 333, y: 289, r: 157, g: 91, b: 36 },
          { x: 324, y: 294, r: 148, g: 219, b: 57 },
        ]);
        const rfpageCarmeScopeMax = new Page('rfpageCarmeScopeMax', [
          { x: 431, y: 291, r: 255, g: 166, b: 73 },
          { x: 423, y: 296, r: 138, g: 199, b: 178 },
          { x: 416, y: 294, r: 148, g: 215, b: 57 },
        ]);

        // Remove sold out aurora items
        if (this.config.autoBalanceAuroraStocks && seamarketState.rareItems.length > 0) {
          if (rerouter.isPageMatchImage(rfpage1stAuroraSoldOut, image)) {
            seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 66);
          }
          if (rerouter.isPageMatchImage(rfpage2ndAuroraSoldOut, image)) {
            seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 158);
          }
          if (rerouter.isPageMatchImage(rfpage3rdAuroraSoldOut, image)) {
            seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 253);
          }
        }

        // Market will remove Carmel map/scope back from the shopping list if it is fulled
        if (this.config.autoBuyCaramelStuff && seamarketState.rareItems.length > 0) {
          if (rerouter.isPageMatchImage(rfpageCarmelMapMax, image)) {
            seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 346);
          }
          if (rerouter.isPageMatchImage(rfpageCarmeScopeMax, image)) {
            seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 439);
          }
        }

        if (this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.length > 0) {
          console.log('>> considerPurchaseSeasideMarket:', considerPurchaseSeasideMarket(this.taskStatus[TASKS.haborShopInSeaMarket].rareItems.shift()));
          return;
        }
        if (this.taskStatus[TASKS.haborShopInSeaMarket].needToBuyRadiantShard) {
          logs(context.task.name, 'Purchasing radiant shard');
          rerouter.screen.tap({ x: 540, y: 270 });
          Utils.sleep(this.config.sleepAnimate);
          rerouter.screen.tap({ x: 315, y: 247 });
          Utils.sleep(2000);
          this.taskStatus[TASKS.haborShopInSeaMarket].needToBuyRadiantShard = false;
        }

        // for i = rightSlideCount < rightSlideLimit
        // for j = purchaseIndex < Object.keys(ICONS.iconSeasideMarketItems)
        // for k = foundIndex < Object.keys(foundResults)
        console.log('>> 1', JSON.stringify(seamarketState));
        if (this.taskStatus[TASKS.haborShopInSeaMarket].rightSlideCount >= this.taskStatus[TASKS.haborShopInSeaMarket].rightSlideLimit) {
          logs(context.task.name, `Jobs finish`);
          sendKeyBack();
          sendEventRunning();
          finishRound(true);
          return;
        }

        console.log('>> 2', JSON.stringify(seamarketState));
        if (this.taskStatus[TASKS.haborShopInSeaMarket].purchaseIndex >= Object.keys(ICONS.iconSeasideMarketItems).length) {
          seamarketState.rightSlideCount++;
          seamarketState.purchaseIndex = 0;
          swipeFromToPoint({ x: 600, y: 234 }, { x: 0, y: 234 }, 6, undefined, PAGES.rfpageInSeasideMarket);
          sleep(2000);
          seamarketState.foundResult = undefined;
          return;
        }

        console.log('>> 3', JSON.stringify(seamarketState));
        if (seamarketState.foundResults && seamarketState.foundIndex >= Object.keys(seamarketState.foundResults).length) {
          seamarketState.purchaseIndex++;
          seamarketState.foundResults = undefined;
          return;
        }

        if (seamarketState.foundResults === undefined || Object.keys(seamarketState.foundResults).length === 0) {
          console.log('>> 3.1', JSON.stringify(seamarketState));

          for (let i = seamarketState.purchaseIndex; i < Object.keys(ICONS.iconSeasideMarketItems).length; i++) {
            console.log('>> 3.2', JSON.stringify(seamarketState));
            seamarketState.foundResults = findSpecificIconInScreen(ICONS.iconSeasideMarketItems[i], marketSearchArea);
            seamarketState.foundIndex = 0;
            seamarketState.purchaseIndex = i;

            if (Object.keys(seamarketState.foundResults).length > 0) {
              console.log('>> 3.3', JSON.stringify(seamarketState));
              break;
            }
          }
          if (Object.keys(seamarketState.foundResults).length === 0) {
            return;
          }
        }

        console.log(`>> 4 decided to purchase ${ICONS.iconSeasideMarketItems[seamarketState.purchaseIndex].name}, state: ${JSON.stringify(seamarketState)}`);
        // iii++;
        rerouter.screen.tap({
          x: marketSearchArea.x + seamarketState.foundResults[seamarketState.foundIndex].x,
          y: marketSearchArea.y + seamarketState.foundResults[seamarketState.foundIndex].y,
        });
        sleep(1000);
        seamarketState.foundIndex++;
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageMarketItemDetail.name}`,
      match: PAGES.rfpageMarketItemDetail,
      action: (context, image, matched, finishRound) => {
        if (context.task.name.substring(0, 5) !== 'habor') {
          logs(context.task.name, `rfpageInSeasideMarket, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        logs(context.task.name, `in rfpageMarketItemDetail, handle it`);
        let productNowHave = ocrNumberInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
        if (productNowHave === -1) {
          logs(
            context.task.name,
            `About to purchase ${
              ICONS.iconSeasideMarketItems[this.taskStatus[TASKS.haborShopInSeaMarket].purchaseIndex].name
            } but found ${productNowHave} (OCR failure), skip this one`
          );
          sendKeyBack();
        }
        if (productNowHave < this.config.materialsTarget) {
          logs(
            context.task.name,
            `Purchased ${
              ICONS.iconSeasideMarketItems[this.taskStatus[TASKS.haborShopInSeaMarket].purchaseIndex].name
            } in seaside market due to having ${productNowHave}, less than target ${this.config.materialsTarget}`
          );
          rerouter.goNext(PAGES.rfpageMarketItemDetail);
          sleep(2000);
        } else {
          logs(context.task.name, `Not purchase seaside market so send back due to having ${productNowHave}, more than target ${this.config.materialsTarget}`);
          sendKeyBack();
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageNotEnoughItemToBuyThis.name}`,
      match: PAGES.rfpageNotEnoughItemToBuyThis,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageNotEnoughItemToBuyThis, send back twice`);

        sendKeyBack();
        Utils.sleep(1500);
        sendKeyBack();
        Utils.sleep(1500);
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageInShellShop.name}`,
      match: PAGES.rfpageInShellShop,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== 'haborShopInShellGallery') {
          logs(context.task.name, `rfpageInShellShop, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        let galleryState = this.taskStatus[TASKS.haborShopInShellGallery];
        const rfpageLegendarySoldOut = new Page('rfpageLegendarySoldOut', [
          { x: 57, y: 102, r: 171, g: 203, b: 240 },
          { x: 82, y: 199, r: 239, g: 24, b: 24 },
        ]);
        if (galleryState.autoBuySeaFairy) {
          if (rerouter.isPageMatchImage(rfpageLegendarySoldOut, image)) {
            logs(context.task.name, `Purchased legendary cookie successfully`);
            galleryState.autoBuySeaFairy = false;
          } else {
            logs(context.task.name, `Purchasing legendary cookie`);
            rerouter.screen.tap({ x: 80, y: 313 });
            return;
          }
        }

        const rfpageRelicSoldOut = new Page('rfpageRelicSoldOut', [
          { x: 413, y: 235, r: 206, g: 20, b: 24 },
          { x: 387, y: 229, r: 198, g: 121, b: 57 },
        ]);
        if (galleryState.autoBuyGuildRelic) {
          if (rerouter.isPageMatchImage(rfpageRelicSoldOut, image)) {
            logs(context.task.name, `Purchased guild relic successfully`);
            galleryState.autoBuyGuildRelic = false;
          } else {
            logs(context.task.name, `Purchasing guild relic`);
            rerouter.screen.tap({ x: 360, y: 313 });
            return;
          }
        }

        const rfpageLegendSoulEssenceSoldOut = new Page('rfpageLegendSoulEssenceSoldOut', [
          { x: 292, y: 118, r: 205, g: 22, b: 27 },
          { x: 277, y: 140, r: 246, g: 255, b: 255 },
        ]);
        if (galleryState.autoBuyLegendSoulEssence) {
          if (rerouter.isPageMatchImage(rfpageLegendSoulEssenceSoldOut, image)) {
            logs(context.task.name, `Purchased legend soul essence successfully`);
            galleryState.autoBuyLegendSoulEssence = false;
          } else {
            logs(context.task.name, `Purchasing legend soul essence`);
            rerouter.screen.tap({ x: 270, y: 192 });
            return;
          }
        }

        const rfpageEpicSoulEssenceSoldOut = new Page('rfpageEpicSoulEssenceSoldOut', [
          { x: 293, y: 241, r: 206, g: 20, b: 24 },
          { x: 274, y: 263, r: 247, g: 138, b: 247 },
        ]);
        if (galleryState.autoBuyEpicSoulEssence) {
          if (rerouter.isPageMatchImage(rfpageEpicSoulEssenceSoldOut, image)) {
            logs(context.task.name, `Purchased epic soul essence successfully`);
            galleryState.autoBuyEpicSoulEssence = false;
          } else {
            logs(context.task.name, `Purchasing epic soul essence`);
            rerouter.screen.tap({ x: 270, y: 318 });
            return;
          }
        }

        finishRound(true);
        sendKeyBack();
        sendEventRunning();
        logs(context.task.name, `${context.path} finishRound`);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInTowerOfSweetChaos.name}`,
      match: PAGES.rfpageInTowerOfSweetChaos,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.towerOfSweetChaos) {
          logs(context.task.name, `${context.path}, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        logs(context.task.name, `${context.path}, about to start handleTowerOfSweetChaos, send running`);
        sendEvent('running', '');

        const rfpageHasTrayJump = new Page(
          'rfpageHasTrayJump',
          [
            { x: 338, y: 15, r: 82, g: 0, b: 0 },
            { x: 409, y: 18, r: 0, g: 131, b: 255 },
            { x: 43, y: 323, r: 214, g: 89, b: 247 },
            { x: 32, y: 319, r: 95, g: 20, b: 27 },
            { x: 30, y: 330, r: 33, g: 8, b: 8 },
          ],
          { x: 30, y: 326 }
        );
        if (rerouter.isPageMatchImage(rfpageHasTrayJump, image)) {
          logs(context.task.name, `Found rfpageHasTrayJump so tap it`);
          rerouter.goNext(rfpageHasTrayJump);
          return;
        }

        var downArrow = findSpecificIconInScreen(ICONS.iconTowerOfSweetChoasDownArrow);
        if (Object.keys(downArrow).length > 0) {
          rerouter.screen.tap(downArrow[0]);
          Utils.sleep(5000);
        }

        rerouter.screen.tap({ x: 180, y: 30 }); // Tap up arrow
        Utils.sleep(this.config.sleepAnimate * 2);
        rerouter.screen.tap({ x: 180, y: 130 }); // Go to the top tray
        Utils.sleep(this.config.sleepAnimate);

        // 在甜點塔有可能會是戰鬥或要開寶箱
        const rfpageToSCTreasureChest = new Page(
          'rfpageToSCTreasureChest',
          [
            { x: 443, y: 328, r: 198, g: 44, b: 57 },
            { x: 388, y: 63, r: 84, g: 41, b: 114 },
            { x: 422, y: 125, r: 118, g: 78, b: 85 },
            { x: 407, y: 137, r: 255, g: 105, b: 156 },
            { x: 437, y: 149, r: 33, g: 0, b: 0 },
          ],
          { x: 443, y: 328 }
        );
        if (rerouter.isPageMatchImage(rfpageToSCTreasureChest, image)) {
          rerouter.goNext(rfpageToSCTreasureChest);
          Utils.sleep(2000);

          if (!tapThroughAnimate(PAGES.rfpageInTowerOfSweetChaos, PAGES.rfpageInTowerOfSweetChaos.next as XY, 7000)) {
            logs(context.task.name, `${context.path}, Cannot return from collect treasure chest, finish round`);
            sendKeyBack();
            finishRound(true);
            return;
          }
        }

        let toscState = this.taskStatus[TASKS.towerOfSweetChaos];
        if (toscState.tryCount > toscState.tryLimit) {
          logs(context.task.name, `${context.path}, maximum battle count reached ${toscState.tryLimit}, finish round`);
          sendKeyBack();
          sendEventRunning();
          finishRound(true);
          return;
        } else {
          rerouter.screen.tap({ x: 571, y: 327 });
          toscState.tryCount++;
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageReadyToBattleToSC.name}`,
      match: PAGES.rfpageReadyToBattleToSC,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.towerOfSweetChaos) {
          logs(context.task.name, `${context.path}, but current task is ${context.task.name}, skipping`);
          sendKeyBack();
          return;
        }

        logs(context.task.name, `${context.path}, tap battle`);
        rerouter.goNext(PAGES.rfpageReadyToBattleToSC);
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageInGuildLand.name}`,
      match: PAGES.rfpageInGuildLand,
      action: (context, image, matched, finishRound) => {
        if (context.task.name.substring(0, 5) !== 'guild') {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `in rfpageInGuildLand, handle it`);

        switch (context.task.name) {
          case TASKS.guildCheckin:
            rerouter.screen.tap({ x: 315, y: 217 }); // tap center guild level up trophy
            Utils.sleep(2000);
            break;
          case TASKS.guildExpandLand:
            // rerouter.screen.tap({ x: 315, y: 217 });
            // Utils.sleep(2000);
            break;
          case TASKS.guildBattleDragon:
            rerouter.screen.tap({ x: 150, y: 328 }); // tap dragon icon
            Utils.sleep(2000);
            break;
          case TASKS.guildBattleAlliance:
            rerouter.screen.tap({ x: 200, y: 330 }); // tap alliance icon
            Utils.sleep(5000);
            break;
          default:
            // TODO: will fail when resume battle
            console.log('I am rfpageInGuildLand, panic and donno what to do');
            saveImageToDisk();
          // ii++;
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInGuildBeacon.name}`,
      match: PAGES.rfpageInGuildBeacon,
      action: (context, image, matched, finishRound) => {
        if (context.task.name === TASKS.guildCheckin) {
          logs(context.task.name, `in rfpageInGuildBeacon, finishRound`);
          rerouter.goNext(PAGES.rfpageInGuildBeacon);
          sendEventRunning();
          finishRound(true);
        }
        sendKeyBack();
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfPageGuildBeaconIsClear.name}`,
      match: PAGES.rfPageGuildBeaconIsClear,
      action: (context, image, matched, finishRound) => {
        if (context.task.name === TASKS.guildCheckin) {
          logs(context.task.name, `in rfPageGuildBeaconIsClear, finishRound`);
          rerouter.goNext(PAGES.rfPageGuildBeaconIsClear);
          sendEventRunning();
          finishRound(true);
        }
        sendKeyBack();
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageBattleDragon.name}`,
      match: PAGES.rfpageBattleDragon,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleDragon) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `in ${context.path}, handle it`);

        const guildBossesEntryPoints = [
          { x: 113, y: 202, r: 123, g: 207, b: 8 }, // left
          { x: 312, y: 205, r: 123, g: 207, b: 8 }, // middle
          { x: 505, y: 204, r: 123, g: 207, b: 8 }, // right
        ];

        let dragonStatus = this.taskStatus[TASKS.guildBattleDragon];
        if (dragonStatus.bossIdx >= guildBossesEntryPoints.length) {
          dragonStatus.bossIdx = 0;
        }

        logs(context.task.name, `Try to fight boss: ${dragonStatus.bossIdx}`);
        let bossEntryPoint: XYRGB = guildBossesEntryPoints[dragonStatus.bossIdx];
        rerouter.screen.tap(bossEntryPoint);

        dragonStatus.bossIdx++;
        return;
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageDragonAddMoreCookie.name}`,
      match: PAGES.rfpageDragonAddMoreCookie,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleDragon) {
          sendKeyBack();
          return;
        }

        sendKeyBack();
        logs(context.task.name, `rfpageDragonAddMoreCookie, skip and finish round`);
        sendEventRunning();
        finishRound(true);
        return;
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageReadyToFightDragon.name}`,
      match: PAGES.rfpageReadyToFightDragon,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleDragon) {
          sendKeyBack();
          return;
        }

        rerouter.goNext(PAGES.rfpageReadyToFightDragon);
        Utils.sleep(6000);

        if (rerouter.isPageMatch(PAGES.rfpageReadyToFightDragon)) {
          logs(context.task.name, `Still in rfpageReadyToFightDragon 6 secs after tapped Battle!, no more dragon ticket, finish round`);
          sendEventRunning();
          finishRound(true);
          return;
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageStartedFightingSoCannotStartBeacon.name}`,
      match: PAGES.rfpageStartedFightingSoCannotStartBeacon,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleAlliance) {
          sendKeyBack();
          return;
        }

        rerouter.screen.tap({ x: 372, y: 287 });
        Utils.sleep(2000);

        if (rerouter.isPageMatch(PAGES.rfpageStartedFightingSoCannotStartBeacon)) {
          logs(context.task.name, `rfpageStartedFightingSoCannotStartBeacon, stop trying to ignite beacon`);
          this.taskStatus[TASKS.guildBattleAlliance].needIgniteBeacon = false;
          rerouter.goNext(PAGES.rfpageStartedFightingSoCannotStartBeacon);
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInCookieAlliance.name}`,
      match: PAGES.rfpageInCookieAlliance,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleAlliance) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `start guild alliance battle`);

        if (this.taskStatus[TASKS.guildBattleAlliance].needIgniteBeacon && rerouter.isPageMatchImage(PAGES.rfpageAllianceBeaconIsOff, image)) {
          rerouter.screen.tap({ x: 215, y: 198 });
          return;
        }

        rerouter.screen.tap({ x: 515, y: 324 });
        Utils.sleep(this.config.sleepAnimate);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageSelectStartingTeam.name}`,
      match: PAGES.rfpageSelectStartingTeam,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleAlliance) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `found rfpageSelectStartingTeam, tap all from top`);
        rerouter.screen.tap({ x: 470, y: 70 });
        Utils.sleep(this.config.sleep);
        rerouter.screen.tap({ x: 470, y: 113 });
        Utils.sleep(this.config.sleep);
        rerouter.screen.tap({ x: 470, y: 165 });
        Utils.sleep(this.config.sleep);
        rerouter.screen.tap({ x: 470, y: 215 });
        Utils.sleep(this.config.sleep);
        rerouter.screen.tap({ x: 470, y: 267 });
        Utils.sleep(this.config.sleep);
        return;
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageCannotRefilAllianceTicketToday.name}`,
      match: PAGES.rfpageCannotRefilAllianceTicketToday,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.guildBattleAlliance) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `found rfpageCannotRefilAllianceTicketToday, finish round`);
        rerouter.screen.tap({ x: 282, y: 276 });
        sendEventRunning();
        finishRound(true);
      },
    });

    // Battle handling
    rerouter.addRoute({
      path: `/${PAGES.rfpageBattlePaused.name}`,
      match: PAGES.rfpageBattlePaused,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageBattlePaused, handle it`);
        switch (context.task.name) {
          case TASKS.pvp:
          case TASKS.superMayhem:
          case TASKS.tropicalIslandClearBubble:
          case TASKS.bounties:
          case TASKS.towerOfSweetChaos:
          case TASKS.guildBattleDragon:
          case TASKS.guildBattleAlliance:
            rerouter.screen.tap({ x: 315, y: 159 });
            this.lastBattleChecked = Date.now();
            Utils.sleep(5000);
            break;
          default:
            logs(context.task.name, `Not sure why in battle, tap continue again in 5 secs`);
            rerouter.screen.tap({ x: 315, y: 159 });
            this.lastBattleChecked = Date.now();
            Utils.sleep(5000);
          // TODO: will fail when resume battle
          // console.log('I am rfpageBattlePaused, panic and donno what to do');
          // ii++;
        }
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageInProductionDashboard.name}`,
      match: PAGES.rfpageInProductionDashboard,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInProductionDashboard, leave because current task is not production, but: ${context.task.name}`);
          sendKeyBack();
          return;
        }

        if (
          !rerouter.isPageMatchImage(
            new Page('rfpageListIsAtTop', [
              { x: 27, y: 47, r: 49, g: 158, b: 231 },
              { x: 26, y: 114, r: 49, g: 158, b: 231 },
            ]),
            image
          )
        ) {
          swipeFromToPoint({ x: 140, y: 80 }, { x: 149, y: 270 }, 5);
          logs(context.task.name, `rfpageInProductionDashboard, swipe to the top `);
        }
        rerouter.goNext(PAGES.rfpageInProductionDashboard);
        this.config.buildTowardsTheLeft = !this.config.buildTowardsTheLeft;
        this.taskStatus[TASKS.production].productionBuildingChecked = 0;
        logs(context.task.name, `reverse buildTowardsTheLeft, it is now ${this.config.buildTowardsTheLeft}`);
        sleep(this.config.sleepAnimate * 2);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInProduction.name}`,
      match: PAGES.rfpageInProduction,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInProduction, leave because current task is not production, but: ${context.task.name}`);
          sendKeyBack();
          return;
        }

        collectFinishedGoods();

        var emptySlots = countProductionSlotAvailable();
        if (emptySlots === 0) {
          logs(context.task.name, 'No available production slot, skip this production');
          handleNextProductionBuilding(this.config.buildTowardsTheLeft);
          return true;
        }
        logs(context.task.name, `emptySlots: ${emptySlots}`);

        var materialCount = ocrNumberInRect({ x: 355, y: 10, w: 35, h: 18 }, ICONS.wNumbers);

        const materialType = rerouter.getPagesMatchImage(PAGES.groupPageMaterialProdMenu, image)[0];
        // rerouter.getCurrentMatchNames();
        // console.log('>> ', JSON.stringify(materialType));
        // iii++;

        if (materialCount == -1) {
          logs(context.task.name, 'This is not a material production');

          let newSlots = makeGoodsToTarget(this.config.goodsTarget, this.config.productSafetyStock, this.config.axeStockTo400);
          if (newSlots !== -1 && newSlots !== emptySlots) {
            logs(context.task.name, `emptySlots count changed after makeGoodsToTarget (${emptySlots} => ${newSlots}), send running`);
            sendEventRunning();
          }
        } else if (materialCount >= this.config.materialsTarget) {
          logs(context.task.name, `Skip as stock enough: ${materialCount}`);
        } else {
          logs(context.task.name, `Material tsock: ${materialCount}, target: ${this.config.materialsTarget}`);
          const materialType = rerouter.getPagesMatchImage(PAGES.groupPageMaterialProdMenu, image)[0];
          this.taskStatus[TASKS.production]['stocks'][materialType.name] = materialCount;

          if (this.taskStatus[TASKS.production].lastProductionBuilding !== materialType.name) {
            logs(context.task.name, `material building changed, send running`);
            this.taskStatus[TASKS.production].lastProductionBuilding = materialType.name;
            sendEventRunning();
          }

          switch (materialType.name) {
            case 'rfpageWoodFarm':
            case 'rfpageBeanFarm':
            case 'rfpageSugarFarm':
              if (materialCount < Math.min(200, this.config.materialsTarget)) {
                logs(context.task.name, `${materialType.name}, set the productionBuildingChecked back to 0 as stock to few: ${materialCount} (< 200)`);
                this.taskStatus[TASKS.production].productionBuildingChecked = 0;
              }

            case 'rfpagePowderFarm':
            case 'rfpageBarryFarm':
              if (rerouter.isPageMatch(PAGES.productMapping[2])) {
                logs(context.task.name, `${materialType.name}, order 2nd item`);
                rerouter.goNext(PAGES.productMapping[2]);
                Utils.sleep(this.config.sleepAnimate);
                rerouter.goNext(PAGES.productMapping[2]);
                Utils.sleep(this.config.sleepAnimate);
              } else {
                logs(context.task.name, `${materialType.name}, order 1st item`);
                rerouter.goNext(PAGES.productMapping[1]);
                Utils.sleep(this.config.sleepAnimate);
                rerouter.goNext(PAGES.productMapping[1]);
                Utils.sleep(this.config.sleepAnimate);
              }
              break;
            case 'rfpageMilkFarm':
            case 'rfpageCottomFarm':
              logs(context.task.name, `${materialType.name}, order 1st item`);
              rerouter.goNext(PAGES.productMapping[1]);
              Utils.sleep(this.config.sleepAnimate);
              rerouter.goNext(PAGES.productMapping[1]);
              Utils.sleep(this.config.sleepAnimate);
              break;
          }

          if (countProductionSlotAvailable() !== emptySlots) {
            logs(context.task.name, `slots count changed, send running`);
            sendEventRunning();
          }
        }

        this.taskStatus[TASKS.production].productionBuildingChecked++;
        if (this.taskStatus[TASKS.production].productionBuildingChecked > 30) {
          logs(context.task.name, `finish producing as productionBuildingChecked: ${this.taskStatus[TASKS.production].productionBuildingChecked}`);
          finishRound(true);
        }

        handleNextProductionBuilding(this.config.buildTowardsTheLeft);
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInMagicLab.name}`,
      match: PAGES.rfpageInMagicLab,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInMagicLab, leave because current task is not production, but: ${context.task.name}`);
          sendKeyBack();
          return;
        }
        if (this.config.magicLabProductIndex === 0 || this.config.skipMagicLabProduction) {
          handleNextProductionBuilding(this.config.buildTowardsTheLeft);
          this.taskStatus[TASKS.production].productionBuildingChecked++;
          logs(context.task.name, `skip rfpageInMagicLab, productionBuildingChecked: ${this.taskStatus[TASKS.production].productionBuildingChecked}`);
          return;
        }

        logs(context.task.name, `Its magic lab, build selected ${this.config.magicLabProductIndex}th item`);
        swipeFromToPoint({ x: 430, y: 80 }, { x: 430, y: 3000 }, 4);

        var productIdx = this.config.magicLabProductIndex;
        while (productIdx > 3) {
          logs(context.task.name, `Move down 3 items, now: ${productIdx}`);

          swipeDown3Items();
          rerouter.screen.tap({ x: 455, y: 37 });
          productIdx -= 3;
        }

        rerouter.goNext(PAGES.productMapping[productIdx]);
        Utils.sleep(this.config.sleepAnimate * 2);

        const stockAndReq = ocrStockAndReqInRect(goodsLocationRect[productIdx], ICONS.bNumbers);
        const stock = stockAndReq[0];
        logs(context.task.name, `Produce item: ${this.config.magicLabProductIndex}, current stock: ${stock}, ${JSON.stringify(stockAndReq)}`);

        handleNextProductionBuilding(this.config.buildTowardsTheLeft);
        this.taskStatus[TASKS.production].productionBuildingChecked++;
        logs(context.task.name, `rfpageInMagicLab, productionBuildingChecked: ${this.taskStatus[TASKS.production].productionBuildingChecked}`);
        return;
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageAddMoreCookies.name}`,
      match: PAGES.rfpageAddMoreCookies,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageAddMoreCookies, cannot start battle so finish current task`);
        rerouter.goNext(PAGES.rfpageAddMoreCookies);
        sendKeyBack();
        sendEventRunning();
        finishRound(true);
      },
    });

    // rerouter.addRoute({
    //   path: `/${PAGES.rfpageSelectAdvantureFirstIsKingdom.name}`,
    //   match: PAGES.rfpageSelectAdvantureFirstIsKingdom,
    //   action: (context, image, matched, finishRound) => {
    //     logs(context.task.name, `rfpageSelectAdvantureFirstIsKingdom, tap the 1st one to back to kingdom`);
    //     rerouter.goNext(PAGES.rfpageSelectAdvantureFirstIsKingdom);
    //   },
    // });
    rerouter.addRoute({
      path: `/${PAGES.rfpageSelectAdvanture.name}`,
      match: PAGES.rfpageSelectAdvanture,
      action: (context, image, matched, finishRound) => {
        if (rerouter.isPageMatchImage(PAGES.rfpageSelectAdvantureFirstIsKingdom, image)) {
          logs(context.task.name, `rfpageSelectAdvantureFirstIsKingdom, go back to "My Kingdom"`);
          rerouter.goNext(PAGES.rfpageSelectAdvantureFirstIsKingdom);
          return;
        }

        let advantureSetting = AdvanturesBountiesAt3rd;
        // if (rerouter.isPageMatchImage(PAGES.rfpageBountiesAt2ndSlot, image)) {
        //   advantureSetting = AdvanturesBountiesAt2nd;
        // }

        if (advantureSetting[context.task.name] === undefined) {
          logs(context.task.name, `rfpageSelectAdvanture but this task does not need advanture, send back`);
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);
          return;
        }

        if (advantureSetting[context.task.name].backward) {
          scrollRightALot({ x: 600, y: 180 });
          scrollRightALot({ x: 600, y: 180 });
        }

        switch (context.task.name) {
          case TASKS.superMayhem:
            logs(context.task.name, `rfpageSelectAdvanture goto superMayhem`);
            rerouter.screen.tap(advantureSetting[context.task.name].pnt);
            break;
          case TASKS.bounties:
            logs(context.task.name, `rfpageSelectAdvanture goto bounties`);
            rerouter.screen.tap(advantureSetting[context.task.name].pnt);
            break;
          case TASKS.towerOfSweetChaos:
            logs(context.task.name, `rfpageSelectAdvanture, send back`);
            sendKeyBack();
            return;
          default:
            logs(context.task.name, `rfpageSelectAdvanture don't know what to do, crash it`);
            ii++;
            sendKeyBack();
        }
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageUncollapsedAffairs.name}`,
      match: PAGES.rfpageUncollapsedAffairs,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `rfpageUncollapsedAffairs, going to task related affair: ${context.task.name}`);
        switch (context.task.name) {
          case TASKS.hotAirBallon:
            rerouter.screen.tap({ x: 103, y: 203 });
            return;
          case TASKS.train:
            rerouter.screen.tap({ x: 103, y: 252 });
            return;
          case TASKS.wishingTree:
            logs(context.task.name, `about to send wishing tree`);
            rerouter.screen.tap({ x: 103, y: 306 });
            return;
          case TASKS.gnomeLab:
            logs(context.task.name, `about to goto gnome lab`);
            rerouter.screen.tap({ x: 103, y: 150 });
            return;
          case TASKS.haborSendShip:
          case TASKS.haborShopInSeaMarket:
          case TASKS.haborShopInShellGallery:
            logs(context.task.name, `about to goto trade habor`);
            rerouter.screen.tap({ x: 103, y: 53 });
            return;
          default:
            logs(context.task.name, `nothing matched, closing the list`);
            rerouter.screen.tap({ x: 106, y: 335 });
            Utils.sleep(3000);
            if (rerouter.isPageMatch(PAGES.rfpageUncollapsedAffairs)) {
              logs(context.task.name, `nothing matched, the list is still open, go to wishing tree to force close it`);
              rerouter.screen.tap({ x: 103, y: 306 });
            }
        }
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageInCookieHead.name}`,
      match: PAGES.rfpageInCookieHead,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageInCookieHead, in head');

        const rfpageStartOfList = new Page('rfpageStartOfList', [
          { x: 114, y: 151, r: 255, g: 218, b: 0 },
          { x: 115, y: 160, r: 224, g: 0, b: 50 },
          { x: 253, y: 156, r: 247, g: 207, b: 123 },
          { x: 255, y: 160, r: 189, g: 20, b: 24 },
        ]);
        const rfpageEndOfList = new Page('rfpageEndOfList', [
          { x: 570, y: 160, r: 252, g: 0, b: 60 },
          { x: 479, y: 161, r: 68, g: 144, b: 18 },
          { x: 393, y: 158, r: 194, g: 226, b: 238 },
        ]);

        switch (context.task.name) {
          case TASKS.fountain:
          case TASKS.findAndTapCandy:
            if (!rerouter.isPageMatchImage(rfpageStartOfList, image)) {
              scrollLeftALot({ x: 116, y: 180 });
            }
            if (rerouter.waitScreenForMatchingPage(PAGES.rfpageFistItemIsCastle, 3000)) {
              logs(context.task.name, 'tap goto castle');
              rerouter.screen.tap({ x: 260, y: 224 });
              return;
            }
            return;
          case TASKS.pvp:
          case TASKS.pvpPurchaseAncientCookie:
            scrollRightALot({ x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);
            if (!rerouter.isPageMatch(rfpageEndOfList)) {
              scrollRightALot({ x: 560, y: 186 });
              Utils.sleep(CONSTANTS.sleepAnimate);
            }

            rerouter.screen.tap(AdvanturesBountiesAt3rd[context.task.name.substring(0, 3)].pnt);
            Utils.sleep(this.config.sleepAnimate);
            return;
          case TASKS.tropicalIslandShip:
          case TASKS.tropicalIslandSunbed:
          case TASKS.tropicalIslandClearBubble:
            scrollRightALot({ x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);
            if (!rerouter.isPageMatch(rfpageEndOfList)) {
              scrollRightALot({ x: 560, y: 186 });
              Utils.sleep(CONSTANTS.sleepAnimate);
            }

            rerouter.screen.tap(AdvanturesBountiesAt3rd[context.task.name.substring(0, 14)].pnt);
            return;
          case TASKS.towerOfSweetChaos:
            logs(context.task.name, `${context.path} goto tower of sweet choas`);

            scrollRightALot({ x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);
            if (!rerouter.isPageMatch(rfpageEndOfList)) {
              scrollRightALot({ x: 560, y: 186 });
              Utils.sleep(CONSTANTS.sleepAnimate);
            }

            rerouter.screen.tap(AdvanturesBountiesAt3rd[context.task.name].pnt);
            return;
          default:
            sendKeyBack();
            return;
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageBattleFinished.name}`,
      match: PAGES.rfpageBattleFinished,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageBattleFinished, tap it and reset botStatus.battleStarted to 0');
        globalStorage.botStatus.battleStarted = 0;
        rerouter.goNext(PAGES.rfpageBattleFinished);
      },
    });

    // rerouter.addRoute({
    //   path: `/${PAGES.AAAAAAAAA.name}`,
    //   match: PAGES.AAAAAAAAA,
    //   action: (context, image, matched, finishRound) => {
    //     logs(context.task.name, 'rfpageIsDailyFreePackage, daily gift collected correctly');
    //     finishRound(true);
    //   },
    // });

    rerouter.addRoute({
      path: `/${PAGES.rfpageGeneralMessageWindow.name}`,
      match: PAGES.rfpageGeneralMessageWindow,
      action: (context, image, matched, finishRound) => {
        // Some popups are classified as message windows (but can be resolved as page)
        if (rerouter.isPageMatchImage(PAGES.rfpageShellShopNotEnoughShell, image)) {
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);

          if (context.task.name === TASKS.haborShopInShellGallery) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm rfpageShellShopNotEnoughShell, send back twice and finish round');
            finishRound(true);
          }
          return;
        }

        if (checkScreenMessage(MessageWindow.theNetworkIsUnstableMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm theNetworkIsUnstableMessageScreen, tap OK');
          rerouter.screen.tap({ x: 316, y: 250 });
          return;
        } else if (checkScreenMessage(MessageWindow.theReloginIntoAnotherDeviceMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm theReloginIntoAnotherDeviceMessageScreen, wait for it');
          keycode('BACK', 1000);
          for (var i = 0; i < this.config.sleepWhenDoubleLoginInMinutes; i++) {
            sleep(60000);
            sendEvent('running', '');
            logs('handleUnexpectedMessageBox', `Detect relogin, wait: ${i}/${this.config.sleepWhenDoubleLoginInMinutes} mins to restart...`);
          }
          return;
        }

        if (
          checkScreenMessage(MessageWindow.messageTeamDontMatchToSCRow1, PAGES.rfpageGeneralMessageWindow, image) &&
          checkScreenMessage(MessageWindow.messageTeamDontMatchToSCRow2, PAGES.rfpageGeneralMessageWindow, image)
        ) {
          logs(
            context.task.name,
            'rfpageGeneralMessageWindow confirm PAGES.messageTeamDontMatchToSCRow1 && messageTeamDontMatchToSCRow2, send back and finish round'
          );
          if (context.task.name === TASKS.towerOfSweetChaos) {
            finishRound(true);
          }
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);
          sendKeyBack();
          return;
        } else if (checkScreenMessage(MessageWindow.unfinishedPVPBattleMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          if (context.task.name !== TASKS.pvp) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedPVPBattleMessageScreen, skip current task');
            finishRound(true);
            return;
          }

          logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedPVPBattleMessageScreen, tap it');
          rerouter.screen.tap({ x: 394, y: 253 });
          return;
        } else if (checkScreenMessage(MessageWindow.messageCookieDryingOnSunbed, PAGES.rfpageGeneralMessageWindow, image)) {
          if (context.task.name !== TASKS.tropicalIslandClearBubble) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm messageCookieDryingOnSunbed, end current task');
            rerouter.screen.tap({ x: 320, y: 253 });
            return;
          }

          logs(context.task.name, 'rfpageGeneralMessageWindow confirm messageCookieDryingOnSunbed, tap to close and skip current task');
          rerouter.screen.tap({ x: 320, y: 253 });
          finishRound(true);
          return;
        } else if (checkScreenMessage(MessageWindow.unfinishedSuperMayhemBattleMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          if (context.task.name !== TASKS.superMayhem) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedSuperMayhemBattleMessageScreen, skip current task');
            finishRound(true);
            return;
          }

          logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedSuperMayhemBattleMessageScreen, tap it');
          rerouter.screen.tap({ x: 394, y: 253 });
          return;
        } else if (
          checkScreenMessage(MessageWindow.downloadDataNoLanguageTitle, PAGES.rfpageGeneralMessageWindow, image) &&
          checkScreenMessage(MessageWindow.downloadDataNoLanguage, PAGES.rfpageGeneralMessageWindow, image)
        ) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm downloadDataNoLanguage, tap download');
          rerouter.screen.tap({ x: 320, y: 255 });
          return;
        } else if (checkScreenMessage(MessageWindow.battleAbnormalButLastWasSavedMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm battleAbnormalButLastWasSavedMessageScreen, tap it');
          rerouter.screen.tap({ x: 318, y: 253 });
          return;
        } else if (checkScreenMessage(MessageWindow.guildBattleAttemptNotUsedMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm guildBattleAttemptNotUsedMessageScreen, tap it');
          rerouter.screen.tap({ x: 317, y: 253 });
          return;
        } else if (checkScreenMessage(MessageWindow.TOSCsearingKeysNotUsedMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm TOSCsearingKeysNotUsedMessageScreen, tap it');
          rerouter.screen.tap({ x: 317, y: 253 });
          return;
        } else if (checkScreenMessage(MessageWindow.anErrorHasOccuredMessageScreen, PAGES.rfpageGeneralMessageWindow, image)) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm anErrorHasOccuredMessageScreen, tap it');
          rerouter.screen.tap({ x: 317, y: 253 });
          return;
        } else if (
          checkScreenMessage(MessageWindow.messageNotifyQuit, PAGES.rfpageGeneralMessageWindow, image) ||
          checkScreenMessage(MessageWindow.messageNotifyQuit2, PAGES.rfpageGeneralMessageWindow, image)
        ) {
          logs(context.task.name, 'rfpageGeneralMessageWindow confirm messageNotifyQuit/messageNotifyQuit2, send back');
          sendKeyBack();
          Utils.sleep(this.config.sleepAnimate);
          return;
        }

        saveImageToDisk();
        if (this.config.account === 'default_xrobotmon_account@gmail.com') {
          logs(context.task.name, 'rfpageGeneralMessageWindow, saved the problematic screen and crash the script');
          ii++;
        } else {
          logs(context.task.name, 'rfpageGeneralMessageWindow, saved the problematic screen');
        }
      },
    });

    rerouter.addRoute({
      path: `/${PAGES.rfpageInKingdomVillage.name}`,
      match: PAGES.rfpageInKingdomVillage,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in ${context.path}`);

        // In case game crashed during battle
        globalStorage.botStatus.battleStarted = 0;

        switch (context.task.name) {
          case TASKS.production:
            if (rerouter.isPageMatchImage(PAGES.rfpageHasDashboard, image)) {
              rerouter.screen.tap({ x: 38, y: 221 }); // Tap production dashboard
              Utils.sleep(this.config.sleepAnimate * 2);
            }
            // TODO: no dashboard cannot go
            break;
          case TASKS.collectMail:
            rerouter.screen.tap({ x: 550, y: 20 });
            break;
          case TASKS.collectKingdomPass:
            rerouter.screen.tap({ x: 600, y: 85 });
            break;
          case TASKS.sendFriendReward:
            rerouter.screen.tap({ x: 512, y: 20 });
            break;
          case TASKS.getInShopFreeDailyPack:
            rerouter.screen.tap({ x: 26, y: 86 });
            break;
          case TASKS.resolveGreenChecks:
            let foundResults = findSpecificIconInScreen(ICONS.iconGreenCheckedWithGiftBox);
            if (Object.keys(foundResults).length > 0) {
              logs(context.task.name, `Fount iconGreenCheckedWithGiftBox, tap it: ${JSON.stringify(foundResults)}`);
              rerouter.screen.tap({ x: foundResults[0].x + 12, y: foundResults[0].y + 12 });
              Utils.sleep(1500);
              return;
            }
            foundResults = findSpecificIconInScreen(ICONS.iconGreenCheckedGreenBackground);
            if (Object.keys(foundResults).length > 0) {
              logs(context.task.name, `Fount iconGreenCheckedWithGiftBox, tap it: ${JSON.stringify(foundResults)}`);
              rerouter.screen.tap({ x: foundResults[0].x + 12, y: foundResults[0].y + 12 });
              Utils.sleep(1500);
              return;
            }

            foundResults = findSpecificIconInScreen(ICONS.iconSunbedGreenCheck);
            if (Object.keys(foundResults).length > 0) {
              logs(context.task.name, `Fount iconSunbedGreenCheck, tap it: ${JSON.stringify(foundResults)}`);
              rerouter.screen.tap({ x: foundResults[0].x + 7, y: foundResults[0].y + 7 });
              Utils.sleep(1500);
              return;
            }

            // TODO：原版會直接過去把這個事件解決，現在只會按掉（如熱氣球新版只會收不會送，要等下次去熱氣球才會送）
            foundResults = findSpecificIconInScreen(ICONS.iconGreenCheckedWhiteBackground);
            if (Object.keys(foundResults).length > 0) {
              logs(context.task.name, `Fount iconGreenCheckedWhiteBackground, tap it: ${JSON.stringify(foundResults)}`);
              rerouter.screen.tap({ x: foundResults[0].x + 7, y: foundResults[0].y + 7 });
              Utils.sleep(1500);
              return;
            }

            logs(context.task.name, `Did not find any green check to resolve, finish round`);
            finishRound(true);
            break;
          case TASKS.hotAirBallon:
          case TASKS.train:
          case TASKS.wishingTree:
          case TASKS.gnomeLab:
          case TASKS.haborSendShip:
          case TASKS.haborShopInSeaMarket:
          case TASKS.haborShopInShellGallery:
            rerouter.screen.tap({ x: 105, y: 330 });
            break;
          case TASKS.fountain:
          case TASKS.pvp:
          case TASKS.pvpPurchaseAncientCookie:
          case TASKS.tropicalIslandShip:
          case TASKS.tropicalIslandSunbed:
          case TASKS.tropicalIslandClearBubble:
          case TASKS.towerOfSweetChaos:
            rerouter.screen.tap({ x: 25, y: 25 }); // goto head
            break;
          case TASKS.superMayhem:
          case TASKS.bounties:
            rerouter.screen.tap({ x: 560, y: 325 }); // goto PLAY!
            break;
          case TASKS.guildCheckin:
          case TASKS.guildExpandLand:
          case TASKS.guildBattleDragon:
          case TASKS.guildBattleAlliance:
            this.taskStatus[TASKS.guildBattleAlliance].needIgniteBeacon = true;
            rerouter.screen.tap({ x: 317, y: 325 }); // goto Guild
            break;
          case TASKS.findAndTapCandy:
            let searchHouseState = this.taskStatus[TASKS.findAndTapCandy];
            if (searchHouseState.searchHouseIdx >= searchHosePaths[searchHouseState.searchHousePathIdx].length) {
              searchHouseState.searchHousePathIdx++;
              searchHouseState.searchHouseIdx = 0;
            }
            if (searchHouseState.searchHousePathIdx >= Object.keys(searchHosePaths).length) {
              logs(context.task.name, 'Searched all paths but still cannot end the task, skip it');
              finishRound(true);
              searchHouseState.searchHousePathIdx = 0;
              searchHouseState.searchHouseIdx = 0;
              searchHouseState.needGotoHead = true;
              return;
            }

            // searchForCandyHouse();

            // 要去頭以前先原地掃一次
            if (searchHouseState.needGotoHead) {
              if (searchForCandyHouse()) {
                logs(context.task.name, 'Found rfpageInCandyHouse, return and let rfpageInCandyHouse handle it');
                return;
              }

              rerouter.screen.tap({ x: 25, y: 25 }); // goto head
              Utils.sleep(this.config.sleepAnimate);
              searchHouseState.needGotoHead = false;
              return;
            }

            console.log(
              `${searchHouseState.searchHousePathIdx}, ${searchHouseState.searchHouseIdx}, ${JSON.stringify(
                searchHosePaths[searchHouseState.searchHousePathIdx][searchHouseState.searchHouseIdx]
              )}`
            );
            swipeDirection(searchHosePaths[searchHouseState.searchHousePathIdx][searchHouseState.searchHouseIdx], null, PAGES.rfpageInKingdomVillage);
            searchHouseState.searchHouseIdx++;
            if (
              rerouter.waitScreenForMatchingPage(
                new GroupPage('groupPageDecoration', [PAGES.rfpageMovingStructures, PAGES.rfpageKingdomDecoratingExpand]),
                1000
              )
            ) {
              rerouter.goNext(PAGES.rfpageMovingStructures);
              logs(context.task.name, 'groupPageDecoration, return to try again');
              return;
            }

            if (searchForCandyHouse()) {
              logs(context.task.name, 'Found rfpageInCandyHouse, return and let rfpageInCandyHouse handle it');
              return;
            }

            break;
          default:
            logs(context.task.name, 'Unknown task in rfpageInKingdomVillage');
            break;
        }
      },
    });
    rerouter.addRoute({
      path: `/${PAGES.rfpageInCandyHouse.name}`,
      match: PAGES.rfpageInCandyHouse,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.findAndTapCandy) {
          logs(context.task.name, `rfpageInCandyHouse, leave because current task is not findAndTapCandy, but: ${context.task.name}`);
          sendKeyBack();
          return;
        }

        sendEventRunning();
        logs(context.task.name, `rfpageInCandyHouse, send running`);

        const rfpageCanUpgradeCandyMansion = new Page('rfpageCanUpgradeCandyMansion', [{ x: 303, y: 289, r: 123, g: 207, b: 8 }], { x: 303, y: 289 });
        const rfpageCanUpgradeCandyHouse = new Page('rfpageCanUpgradeCandyHouse', [{ x: 243, y: 287, r: 151, g: 218, b: 55 }], { x: 243, y: 287 });
        const groupPageCanUpgradeCandy = new GroupPage('groupPageCanUpgradeCandy', [rfpageCanUpgradeCandyHouse, rfpageCanUpgradeCandyMansion]);

        const rfpageCookieMansionUpgradeRequirement = new Page(
          'rfpageCookieMansionUpgradeRequirement',
          [
            { x: 351, y: 320, r: 123, g: 207, b: 8 },
            { x: 282, y: 322, r: 148, g: 219, b: 57 },
            { x: 199, y: 199, r: 118, g: 234, b: 231 },
          ],
          { x: 351, y: 320 }
        );
        const rfpageCookieHouseUpgradeRequirement = new Page(
          'rfpageCookieHouseUpgradeRequirement',
          [
            { x: 356, y: 314, r: 123, g: 207, b: 8 },
            { x: 330, y: 120, r: 68, g: 67, b: 66 },
            { x: 425, y: 20, r: 0, g: 50, b: 92 },
          ],
          { x: 356, y: 314 }
        );
        const groupPageUpgradeRequirements = new GroupPage('groupPageUpgradeRequirements', [
          rfpageCookieMansionUpgradeRequirement,
          rfpageCookieHouseUpgradeRequirement,
        ]);

        if (!this.config.autoUpgradeCandyHouse) {
          logs(context.task.name, `rfpageInCandyHouse, findAndTapCandy successful so finish round`);
          finishRound(true);
          sendEventRunning();
          sendKeyBack();
          return;
        }

        if (rerouter.isPageMatchImage(groupPageCanUpgradeCandy, image)) {
          logs(context.task.name, `Found upgradeable candyhouse and tap it`);
          rerouter.goNext(rfpageCanUpgradeCandyHouse);
          Utils.sleep(this.config.sleepAnimate * 2);

          if (rerouter.waitScreenForMatchingPage(PAGES.rfpageNotEnoughGnomeBuilders, 2000)) {
            logs(context.task.name, `Not enough gnome builder, skipping upgrade cookie houses and finish task`);
            finishRound(true);
            sendKeyBack();
            return;
          }

          if (rerouter.waitScreenForMatchingPage(groupPageUpgradeRequirements, 2000)) {
            logs(context.task.name, `groupPageUpgradeRequirements, tap: {x: 357, y:321}`);
            rerouter.screen.tap({ x: 357, y: 321 });

            finishRound(true);
            sendKeyBack();
            return;
          }
        } else {
          logs(context.task.name, `rfpageInCandyHouse, this house is fully upgraded, send back`);
          sendKeyBack();
        }
      },
    });

    const allPages: { [key: string]: Page } = PAGES as any;
    for (const pageIdx in allPages) {
      const page = allPages[pageIdx];
      if (!(page instanceof Page)) {
        continue;
      }
      if (rerouter.getPageByName(page.name) !== null) {
        continue;
      }
      rerouter.addRoute({
        path: `/${page.name}`,
        match: page,
        action: (context, image, matched, finishRound) => {
          if (page.next === undefined) {
            console.log(`findPath, task: ${context.task.name}, path: ${context.path} but does not have next page to go`);
            return;
          }
          console.log(`findPath, task: ${context.task.name}, path: ${context.path}`);
          rerouter.goNext(page);
        },
      });
    }
  }

  public handleUnknown() {
    rerouter.addUnknownAction((context, image, finishRound) => {
      // rerouter.getCurrentMatchNames();
      Utils.log(`unknown count ${context.matchTimes}, task: ${context.task.name},during ${context.matchDuring}, last matched: ${context.lastMatchedPath}`);
      if (rerouter.checkAndStartApp()) {
        logs('handleUnknown', 'checkAndStartApp()');
        return;
      }

      if (checkIfInBattle(context.task.name)) {
        logs('handleUnknown', 'In battle so continue monitor');
        context.matchTimes = 0;
        return;
      }

      let unknownTarget = 3;
      if (context.matchTimes % unknownTarget === 0) {
        keycode('KEYCODE_BACK', 100);
        Utils.log('keycode back for unknown');
      }
      if (context.matchTimes % 7 === 0) {
        rerouter.screen.tap({ x: 575, y: 22 });
        Utils.log('Unknown count 7, could be in tap to login, tapping (575, 22) until the game start');
      }

      if (context.matchTimes > 50) {
        logs('handleUnknown', `Save screenshots and restart game as unknown max reached: ${context.matchTimes}`);
        saveImageToDisk(undefined, 'unknown-reached');
        context.matchTimes = 0;
        var rtn = execute('am force-stop com.devsisters.ck');
        if (rtn == 'signal: aborted') {
          // MEmu
          execute(
            'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop com.devsisters.ck'
          );
        }
        sleep(15000);
      }
    });
  }
}

// * =========== entry point ===========
export let cookieKingdom: CookieKingdom | undefined;

export function start(jsonConfig: any) {
  console.log('typed inputConfig: ', jsonConfig);

  configSharePref();

  if (typeof jsonConfig === 'string') {
    jsonConfig = JSON.parse(jsonConfig);
  }

  assign(config, mergeObject(defaultConfig, jsonConfig));

  if (config.licenseId === '') {
    logs('start', 'config.licenseId is empty thus goto maintainance mode');
    config.isMaintainanceMode = true;
  }

  cookieKingdom = new CookieKingdom(config);
  cookieKingdom.start();
}
export function stop() {
  console.log('stopppping');
  if (cookieKingdom === undefined) {
    return;
  }
  cookieKingdom.stop();
  cookieKingdom = undefined;
}

declare global {
  interface Window {}
}
if (window === undefined) {
  (window as any) = {};
}
(window as any).start = start;
(window as any).stop = stop;
(window as any).rerouter = rerouter;

// ! following is only for dev
function run() {
  cookieKingdom = new CookieKingdom(defaultConfig);
  cookieKingdom.start();
}

sendEvent('running', '');
run();
console.log('jobs done');
