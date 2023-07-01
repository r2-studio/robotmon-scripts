import { Rerouter, rerouter, Utils, XYRGB, Page, Task, Icon, XY, GroupPage } from 'Rerouter';
import { ScriptConfig, Wish, WishStatus, BountyInfo } from './src/types';
import { logs, getCurrentApp, sendKeyBack } from './src/utils';
import {
  scrollDownALot,
  scrollLeftALot,
  scrollRightALot,
  getStatusOfGivenWish,
  checkToSendSpecificWish,
  AdvanturesBountiesAt3rd,
  getCEs,
  checkScreenMessage,
  AdvanturesBountiesAt2nd,
  getMayhemScores,
  findSpecificIconInScreen,
  dynamicSort,
} from './src/helper';
import { defaultConfig, defaultWishes } from './src/defaultScriptConfig';

import * as PAGES from './src/pages';
import * as ICONS from './src/icons';
import * as CONSTANTS from './src/constants';
import { TASKS } from './src/tasks';

const VERSION_CODE: number = 0.1;

export interface TaskStatus {
  [key: string]: any;
}

class CookieKingdom {
  public packageName: string = 'com.devsisters.ck';
  public rerouter: Rerouter;

  public config = defaultConfig;
  wishes = defaultWishes;
  taskStatus: TaskStatus = {};

  constructor(config: any) {
    console.log('############ new CRK ############');
    console.log(JSON.stringify(config));
    this.config = config;

    // rerouter setups
    this.rerouter = rerouter;

    this.rerouter.defaultConfig.TaskConfigAutoStop = true;
    this.rerouter.defaultConfig.RouteConfigDebug = true;

    this.rerouter.rerouterConfig.startAppDelay = 10 * 1000;

    this.rerouter.screenConfig.rotation = 'horizontal';
    this.rerouter.screenConfig.devHeight = 360;
    this.rerouter.screenConfig.devWidth = 640;

    this.rerouter.debug = false;

    console.log(`script version ${VERSION_CODE}`);
  }
  public start() {
    this.init();
    this.initTaskStatus();

    console.log('>', this.rerouter.getCurrentMatchNames());
    // return;

    this.rerouter.start(this.packageName);
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
    for (let idx in ICONS.numberImagesPVP) {
      if (ICONS.numberImagesPVP[idx].image !== undefined) {
        ICONS.numberImagesPVP[idx].releaseImage();
      }
    }
    for (let idx in ICONS.numberImagesWishingTree) {
      if (ICONS.numberImagesWishingTree[idx].image !== undefined) {
        ICONS.numberImagesWishingTree[idx].releaseImage();
      }
    }

    this.rerouter.stop();
  }

  public init() {
    this.addTasks();
    this.addRoutes();
    this.handleUnknown();

    // show current page
    this.rerouter.getCurrentMatchNames();

    for (let idx in ICONS.numberImagesProdutRequirements) {
      if (ICONS.numberImagesProdutRequirements[idx].image === undefined) {
        ICONS.numberImagesProdutRequirements[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberImagesPVP) {
      if (ICONS.numberImagesPVP[idx].image === undefined) {
        ICONS.numberImagesPVP[idx].loadImage();
      }
    }
    for (let idx in ICONS.numberImagesWishingTree) {
      if (ICONS.numberImagesWishingTree[idx].image === undefined) {
        ICONS.numberImagesWishingTree[idx].loadImage();
      }
    }
  }

  public initTaskStatus() {
    this.taskStatus[TASKS.getInShopFreeDailyPack] = {
      trials: 0,
    };
    this.taskStatus[TASKS.hotAirBallon] = {
      changeMapFinished: false,
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
    this.taskStatus[TASKS.bounties] = {
      hasBountiesLeft: true,
      bountyCount: 0,
    };
  }

  public addTasks() {
    // this.rerouter.addTask({
    //   name: TASKS.production,
    //   // maxTaskRunTimes: 2,
    //   maxTaskDuring: 10 * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });

    // this.rerouter.addTask({
    //   name: TASKS.collectKingdomPass,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: 240 * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.sendFriendReward,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: 240 * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.getInShopFreeDailyPack,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: 240 * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.collectMail,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: 240 * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.hotAirBallon,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoSendHotAirBallonIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.train,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoCollectTrainIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.wishingTree,
    //   maxTaskDuring: 10 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoFulfillWishesIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.fountain,
    //   maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoCollectFountainIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });

    // if (this.config.autoPvPPurchaseAncientCookie) {
    //   this.rerouter.addTask({
    //     name: TASKS.pvpPurchaseAncientCookie,
    //     maxTaskDuring: 12 * CONSTANTS.minuteInMs,
    //     minRoundInterval: this.config.autoPvPIntervalInMins * CONSTANTS.minuteInMs,
    //     forceStop: false,
    //   });
    // }
    // this.rerouter.addTask({
    //   name: TASKS.pvp,
    //   maxTaskDuring: 12 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoPvPIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });

    // this.rerouter.addTask({
    //   name: TASKS.superMayhem,
    //   maxTaskDuring: 15 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoSuperMayhemIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });

    // this.rerouter.addTask({
    //   name: TASKS.tropicalIslandShip,
    //   maxTaskDuring: 30 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.tropicalIslandSunbed,
    //   maxTaskDuring: 30 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });
    // this.rerouter.addTask({
    //   name: TASKS.tropicalIslandClearBubble,
    //   maxTaskDuring: 30 * CONSTANTS.minuteInMs,
    //   minRoundInterval: this.config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
    //   forceStop: false,
    // });

    this.rerouter.addTask({
      name: TASKS.bounties,
      maxTaskDuring: 30 * CONSTANTS.minuteInMs,
      minRoundInterval: this.config.autoHandleBountiesIntervalInMins * CONSTANTS.minuteInMs,
      forceStop: false,
    });
    // ====
  }

  public addRoutes() {
    // Login pages
    // TODO: verify me
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageNewDataPackAvaiableNoLanguage.name}`,
      match: PAGES.rfpageNewDataPackAvaiableNoLanguage,
      action: (context, image, matched, finishRound) => {
        console.log('> in ', PAGES.rfpageNewDataPackAvaiableNoLanguage.name);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageEnterEmail.name}`,
      match: PAGES.rfpageEnterEmail,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'input email');

        this.rerouter.screen.tap({ x: 370, y: 150 });
        Utils.sleep(CONSTANTS.sleepAnimate);

        typing(this.config.account, 1000);
        Utils.sleep(4000); // sleep must equal to typing
        typing('\n', 500);
        Utils.sleep(500);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.groupPageEnterPassword.name}`,
      match: PAGES.groupPageEnterPassword,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'input password');

        this.rerouter.goNext(PAGES.rfpageEnterPasswordLongId);
        Utils.sleep(CONSTANTS.sleepAnimate);
        typing(this.config.password, 1000);
        Utils.sleep(CONSTANTS.sleepAnimate);
        typing('\n', 500);
        Utils.sleep(CONSTANTS.sleepAnimate);
        this.rerouter.screen.tap({ x: 370, y: 190 });
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInLoginPageWithGearAndVideo.name}`,
      match: PAGES.rfpageInLoginPageWithGearAndVideo,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'tapping (575, 22) until the game start every 3 secs');

        this.rerouter.screen.tap({ x: 575, y: 22 });
        Utils.sleep(3000);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageAnnouncement.name}`,
      match: PAGES.rfpageAnnouncement,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'send login-success as saw rfpageAnnouncement');

        if (this.config.needToSendLoginSuccess) {
          sendEvent('gameStatus', 'login-succeeded');
          this.config.needToSendLoginSuccess = false;
        }
        this.rerouter.goNext(PAGES.rfpageAnnouncement);
      },
    });

    // Daily tasks
    this.rerouter.addRoute({
      path: `/${PAGES.rfkingdomPassItemCollected.name}`,
      match: PAGES.rfkingdomPassItemCollected,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfkingdomPassItemCollected, task finished');
        this.rerouter.goNext(PAGES.rfkingdomPassItemCollected);
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageMailsAllClaimed.name}`,
      match: PAGES.rfpageMailsAllClaimed,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageMailsAllClaimed, task finished');
        this.rerouter.goNext(PAGES.rfkingdomPassItemCollected);
        finishRound(true);
      },
    });
    // TODO: double verify friend reward is sent
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInFriendsList.name}`,
      match: PAGES.rfpageInFriendsList,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageInFriendsList, task finished');
        this.rerouter.goNext(PAGES.rfpageFriendRewardsSent);
        sendKeyBack();
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInShop.name}`,
      match: PAGES.rfpageInShop,
      action: (context, image, matched, finishRound) => {
        const trial = this.taskStatus[TASKS.getInShopFreeDailyPack]['trials'];

        // const rfpageNecessities = new Page('rfpageNecessities', [{ x: 114, y: 70, r: 255, g: 109, b: 107 }]);
        const rfpageNecessitiesPnt = { x: 114, y: 70 };
        const x = rfpageNecessitiesPnt.x;
        const y = rfpageNecessitiesPnt.y + trial * 20;
        logs(context.task.name, `rfpageInShop, scroll down to daily gift, trial: #${trial}, tapping (${x}, ${y})`);

        if (this.rerouter.isPageMatchImage(PAGES.rfpageIsDailyFreePackageClaimed, image)) {
          logs(context.task.name, 'rfpageIsDailyFreePackageClaimed, task finished');
          sendKeyBack();
          finishRound(true);
        } else if (this.rerouter.isPageMatchImage(PAGES.rfpageIsDailyFreePackageNotClaimed, image)) {
          logs(context.task.name, 'rfpageIsDailyFreePackageNotClaimed, tap it');
          this.rerouter.goNext(PAGES.rfpageIsDailyFreePackageNotClaimed);
        }

        if (trial < 7) {
          // Shop menu swipe up
          scrollDownALot(rerouter, { x: 60, y: 300 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          rerouter.screen.tap({
            x: x,
            y: y,
          });
          Utils.sleep(CONSTANTS.sleepAnimate * 2);
          // items swipe to left most
          scrollLeftALot(rerouter, { x: 137, y: 268 });
          Utils.sleep(CONSTANTS.sleepAnimate * 2);

          this.taskStatus[TASKS.getInShopFreeDailyPack]['trials']++;
        }
      },
    });

    // Hot air ballon pages
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInHotAirBallon.name}`,
      match: PAGES.rfpageInHotAirBallon,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageInHotAirBallon, choose next step');
        if (this.taskStatus[TASKS.hotAirBallon]['changeMapFinished']) {
          this.rerouter.screen.tap({ x: 258, y: 330 }); // tap Auto
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 575, y: 330 }); // tap Start
          logs(context.task.name, `rfpageInHotAirBallon, start new ballon trip, ep4: ${this.config.isHotAirBallonGotoEp4}`);
          finishRound(true);
        } else {
          this.rerouter.screen.tap({ x: 412, y: 330 }); // tap Change
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageBallonFlyingDock.name}`,
      match: PAGES.rfpageBallonFlyingDock,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageBallonFlyingDock, ballon is flying, finish task');
        this.rerouter.goNext(PAGES.rfpageBallonFlyingDock); // close this screen
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageChooseBallonDestination.name}`,
      match: PAGES.rfpageChooseBallonDestination,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `rfpageChooseBallonDestination, goto ep4: ${this.config.isHotAirBallonGotoEp4}`);
        scrollLeftALot(rerouter, { x: 618, y: 151 });
        if (this.config.isHotAirBallonGotoEp4 && this.rerouter.isPageMatchImage(PAGES.rfpageBallonMapEp4, image)) {
          this.rerouter.goNext(PAGES.rfpageBallonMapEp4); // tap EP4 map
          this.taskStatus[TASKS.hotAirBallon]['changeMapFinished'] = true;
          return;
        } else {
          // scroll to right most and find the last map
          scrollRightALot(rerouter, { x: 618, y: 151 });
          console.log('scrolled');
          scrollRightALot(rerouter, { x: 618, y: 151 });
          console.log('scrolled');
          scrollRightALot(rerouter, { x: 618, y: 151 });
          console.log('scrolled');

          for (let i = 0; i < 4; i++) {
            for (var xLocation = 550; xLocation >= 100; xLocation -= 125) {
              for (var yLocation = 140; yLocation <= 260; yLocation += 120) {
                this.rerouter.screen.tap({ x: xLocation, y: yLocation });

                if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpageInHotAirBallon, 2000)) {
                  this.taskStatus[TASKS.hotAirBallon]['changeMapFinished'] = true;
                  logs(context.task.name, `ballon destination choosed successfully, i, x, y = ${i}, ${xLocation}, ${yLocation}`);
                  return;
                }
              }
            }

            tapDown(30, 268, 40, 0);
            Utils.sleep(CONSTANTS.sleep);
            moveTo(250, 268, 40, 0);
            Utils.sleep(CONSTANTS.sleep);
            moveTo(620, 268, 40, 0);
            Utils.sleep(CONSTANTS.sleepAnimate);
            tapUp(620, 268, 40, 0);
            Utils.sleep(CONSTANTS.sleepAnimate * 3);
          }
        }
      },
    });

    // Train pages
    // TODO: NG！ 用鑽買東西的頁面會被判斷成 rfpageNewDataPackDownloadFailed，會自動按下花鑽石買東西
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInTrainStation.name}`,
      match: PAGES.rfpageInTrainStation,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.train) {
          logs(context.task.name, `rfpageInTrainStation, leave because current task is not wishing tree, but: ${context.task.name}`);
          this.rerouter.screen.tap({ x: 618, y: 28 }); // tap X
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

        if (!this.rerouter.isPageMatchImage(rfpageFirstTrainOut, image)) {
          this.rerouter.screen.tap({ x: 255, y: 110 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 210, y: 110 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 170, y: 110 });

          this.checkIfTrainRequirementMet();
        }
        if (!this.rerouter.isPageMatchImage(rfpageSecondTrainOut, image)) {
          this.rerouter.screen.tap({ x: 255, y: 208 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 210, y: 208 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 170, y: 208 });

          this.checkIfTrainRequirementMet();
        }
        if (!this.rerouter.isPageMatchImage(rfpageThirdTrainOut, image)) {
          this.rerouter.screen.tap({ x: 255, y: 307 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 210, y: 307 });
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 170, y: 307 });

          this.checkIfTrainRequirementMet();
        }

        if (this.config.autoCollectTrainIntervalInMins == 0) {
          logs(context.task.name, 'handleTrainStation skipped as autoCollectTrainIntervalInMins is set to 0');
          finishRound(true);
          return;
        }

        Utils.sleep(9000);

        const foundResults = this.rerouter.findIcon(ICONS.iconSendAll);
        for (let i in foundResults) {
          var sendTrainBtn = foundResults[i];
          sendTrainBtn.x += 30;
          sendTrainBtn.y += 15;
          this.rerouter.screen.tap(foundResults[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap(foundResults[i]);
          Utils.sleep(CONSTANTS.sleepAnimate);
        }

        this.rerouter.goNext(PAGES.rfpageInTrainStation);
        Utils.sleep(CONSTANTS.sleepAnimate);
        logs(context.task.name, `Tried to sent ${foundResults.length} trains`);
        finishRound(true);
      },
    });

    // Wishing trees
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInWishingTree.name}`,
      match: PAGES.rfpageInWishingTree,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.wishingTree) {
          logs(context.task.name, `rfpageInWishingTree, leave because current task is not wishing tree, but: ${context.task.name}`);
          this.rerouter.screen.tap({ x: 618, y: 28 }); // tap X
          return;
        }

        logs(context.task.name, `rfpageInWishingTree, start working`);

        const rfpageAllWishingDailyRewardCollected = new Page('rfpageAllWishingDailyRewardCollected', [
          { x: 59, y: 242, r: 247, g: 247, b: 247 },
          { x: 60, y: 256, r: 138, g: 138, b: 138 },
        ]);

        if (this.rerouter.isPageMatchImage(rfpageAllWishingDailyRewardCollected, image) && !this.config.alwaysFulfillWishes) {
          logs(context.task.name, `rfpageInWishingTree, All wish fulfilled, skipping and send running`);
          sendEvent('running', '');
          finishRound(true);
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
        if (this.rerouter.isPageMatch(rfpageCollectTreeReward)) {
          console.log('Daily reward collected');
          this.rerouter.screen.tap({ x: 60, y: 255 });
          Utils.sleep(2000);

          this.rerouter.waitScreenForMatchingPage(PAGES.rfpageInWishingTree, 8000);
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
        sendEvent('running', '');
        finishRound(true);

        return true;
      },
    });

    // Fountain
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInCookieCastle.name}`,
      match: PAGES.rfpageInCookieCastle,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'tap back to leave rfpageInCookieCastle');
        sendKeyBack();

        if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpageInKingdomVillage, 3000)) {
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
            this.rerouter.screen.tap({ x: foundResults[0].x + 10, y: foundResults[0].y + 10 });
          } else {
            console.log("Can't find fountain full image, try to tap it");
            this.rerouter.screen.tap({ x: 490, y: 359 });
            Utils.sleep(this.config.sleepAnimate);
            this.rerouter.screen.tap({ x: 490, y: 295 });
            Utils.sleep(this.config.sleepAnimate);
            this.rerouter.screen.tap({ x: 540, y: 295 });
            Utils.sleep(this.config.sleepAnimate);
          }
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInFountain.name}`,
      match: PAGES.rfpageInFountain,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.fountain) {
          sendKeyBack();
        }

        // 3rd raw is empty, fountain is pretty clean
        if (this.rerouter.isPageMatchImage(PAGES.rfpageFountain3rdRawEmpty, image)) {
          logs(context.task.name, 'rfpageFountain3rdRawEmpty 3party empty, set task complete');
          this.rerouter.screen.tap({ x: 500, y: 310 }); // tap Claim
          finishRound(true);
          return;
        }

        logs(context.task.name, 'rfpageInFountain and collect it');
        this.rerouter.screen.tap({ x: 500, y: 310 }); // tap Claim
        finishRound(true); // 如果可以正確辨識收成功，這個可以刪除，否則是用水池偏空當作有收成功
      },
    });

    // PVP
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInPVPArena.name}`,
      match: PAGES.rfpageInPVPArena,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageInPVPArena`);

        switch (context.task.name) {
          case TASKS.pvp:
            const battleY = [100, 150, 215, 275];

            var ces = getCEs();
            for (let i = 0; i < ces.length; i++) {
              var ce = ces[i];
              if (ce < this.config.autoPvPTargetScoreLimit && ce !== 0) {
                if (!this.rerouter.screen.isSameColor({ x: 590, y: battleY[i], r: 121, g: 207, b: 16 })) {
                  logs(context.task.name, `Already Battled with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
                  continue;
                }

                logs(context.task.name, `Battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
                this.rerouter.screen.tap({ x: 590, y: battleY[i] }); // tap Battle
                if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpagePVPArenaReadyToBattlePage, 2000)) {
                  return;
                }
              } else {
                logs(context.task.name, `Not to battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
              }
            }

            if (this.rerouter.isPageMatch(PAGES.rfpageBattleTargetCanRefresh)) {
              logs(context.task.name, `Tap PVP refresh`);
              this.rerouter.screen.tap({ x: 532, y: 329 });
            } else {
              logs(context.task.name, `Cannot tap PVP refresh, job done`);
              finishRound(true);
              return;
            }

            break;
          case TASKS.pvpPurchaseAncientCookie:
            this.rerouter.goNext(PAGES.rfpagePVPHasPageMedalShop);
            break;
          default:
            logs(context.task.name, `rfpageInPVPArena, leave because current task is not production, but: ${context.task.name}`);
            sendKeyBack();
            return;
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpagePvPNoArenaTicket.name}`,
      match: PAGES.rfpagePvPNoArenaTicket,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpagePvPNoArenaTicket, job done`);
        sendKeyBack();
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpagePVPArenaReadyToBattlePage.name}`,
      match: PAGES.rfpagePVPArenaReadyToBattlePage,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.pvp) {
          sendKeyBack();
          return;
        }

        logs(context.task.name, `in rfpagePVPArenaReadyToBattlePage, tap it`);
        this.rerouter.goNext(PAGES.rfpagePVPArenaReadyToBattlePage);
      },
    });

    // Super Mayhem
    this.rerouter.addRoute({
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
            if (!this.rerouter.screen.isSameColor({ x: 590, y: battleY[i], r: 121, g: 207, b: 16 })) {
              logs(context.task.name, `Already Battled with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
              continue;
            }

            logs(context.task.name, `Battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
            this.rerouter.screen.tap({ x: 590, y: battleY[i] }); // tap Battle
            if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpageSuperMayhemReadyToBattle, 2000)) {
              return;
            }
          } else {
            logs(context.task.name, `Not to battle with ${i}, ce ${ce}, target limit: ${this.config.autoPvPTargetScoreLimit}`);
          }
        }

        if (this.rerouter.isPageMatch(PAGES.rfpageBattleTargetCanRefresh)) {
          logs(context.task.name, `Tap Super mayhem refresh`);
          this.rerouter.screen.tap({ x: 532, y: 329 });
        } else {
          logs(context.task.name, `Cannot tap Super mayhem refresh, job done`);
          finishRound(true);
          return;
        }
      },
    });

    // Tropical Island
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInTropicalIsland.name}`,
      match: PAGES.rfpageInTropicalIsland,
      action: (context, image, matched, finishRound) => {
        if (context.task.name.substring(0, 14) !== 'tropicalIsland') {
          sendKeyBack();
          return;
        }

        switch (context.task.name) {
          case TASKS.tropicalIslandShip:
            logs(context.task.name, `in rfpageInTropicalIsland, check the ship status`);
            const rfpageCanClaimResource = new Page(
              'rfpageCanClaimResource',
              [
                { x: 307, y: 333, r: 123, g: 207, b: 8 },
                { x: 363, y: 331, r: 123, g: 207, b: 8 },
                { x: 33, y: 332, r: 255, g: 100, b: 176 },
              ],
              { x: 360, y: 333 }
            );
            if (this.rerouter.isPageMatchImage(rfpageCanClaimResource, image)) {
              this.rerouter.goNext(rfpageCanClaimResource);
              logs(context.task.name, `successfully collected island resource`);
            } else {
              logs(context.task.name, `more resources are on the way`);
            }
            finishRound(true);
            return;

          case TASKS.tropicalIslandSunbed:
            logs(context.task.name, `check sunbed`);
            const rfpageSunbeds = new Page(
              'rfpageSunbeds',
              [
                { x: 52, y: 323, r: 238, g: 68, b: 119 },
                { x: 61, y: 336, r: 44, g: 77, b: 110 },
              ],
              { x: 52, y: 323 }
            );
            const rfpageFreeAllCrispyCookie = new Page(
              'rfpageFreeAllCrispyCookie',
              [
                { x: 341, y: 316, r: 123, g: 207, b: 8 },
                { x: 376, y: 313, r: 49, g: 60, b: 90 },
                { x: 223, y: 85, r: 255, g: 101, b: 173 },
              ],
              { x: 341, y: 316 }
            );
            const rfpageHasNoCrispyCookie = new Page('rfpageHasNoCrispyCookie', [
              { x: 425, y: 111, r: 44, g: 46, b: 60 },
              { x: 422, y: 132, r: 44, g: 46, b: 60 },
            ]);

            this.rerouter.goNext(rfpageSunbeds);
            if (
              this.rerouter.waitScreenForMatchingPage(
                new GroupPage('groupInSunbed', [rfpageFreeAllCrispyCookie, rfpageHasNoCrispyCookie, PAGES.rfpageEmptySunbedsListInMiddle]),
                6000
              )
            ) {
              if (this.rerouter.isPageMatch(PAGES.rfpageEmptySunbedsListInMiddle)) {
                logs(context.task.name, `sun bed cookie list is empty`);
              } else if (this.rerouter.isPageMatch(rfpageFreeAllCrispyCookie)) {
                this.rerouter.goNext(rfpageFreeAllCrispyCookie);
                Utils.sleep(this.config.sleepAnimate);
                logs(context.task.name, `successfully collect sunbed cookies`);
              }
            }
            logs(context.task.name, `finish collecting cookies`);
            finishRound(true);
            return;

          case TASKS.tropicalIslandClearBubble:
            var i = 0;
            let foundResults = findSpecificIconInScreen(ICONS.iconGreenCheckedWhiteBackground);
            logs(context.task.name, `handle iconGreenCheckedWhiteBackground, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              for (i = 0; i < Object.keys(foundResults).length; i++) {
                this.rerouter.screen.tap(foundResults[i]);
                Utils.sleep(this.config.sleepAnimate);
              }
            }

            foundResults = findSpecificIconInScreen(ICONS.iconRedExclamation);
            logs(context.task.name, `handle iconRedExclamation, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              for (i = 0; i < Object.keys(foundResults).length; i++) {
                this.rerouter.screen.tap(foundResults[i]);
                Utils.sleep(this.config.sleepAnimate);
                this.rerouter.screen.tap(foundResults[i]);
                Utils.sleep(this.config.sleepAnimate);
              }
            }

            // Clear hammers
            foundResults = findSpecificIconInScreen(ICONS.iconIslandHammer);
            logs(context.task.name, `handle iconIslandHammer, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              for (i = 0; i < Object.keys(foundResults).length; i++) {
                this.rerouter.screen.tap(foundResults[i]);
                Utils.sleep(this.config.sleepAnimate * 3);
                this.rerouter.screen.tap({ x: 324, y: 263 }); // Tab build

                if (!this.rerouter.waitScreenForMatchingPage(PAGES.rfpageInTropicalIsland, 4000)) {
                  logs(context.task.name, `Not enough resource to build island, skipping`);
                  sendKeyBack();
                  sendKeyBack();
                } else {
                  logs(context.task.name, `Build hammer successfully`);
                }
              }
            }

            // Clear battles
            foundResults = findSpecificIconInScreen(ICONS.iconRedSword);
            logs(context.task.name, `handle iconRedSword, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              // this.rerouter.screen.tap(foundResults[i]);
              this.rerouter.screen.tap({ x: foundResults[i].x + 10, y: foundResults[i].y + 10 });
              return;
            }

            foundResults = findSpecificIconInScreen(ICONS.iconWhiteSword);
            logs(context.task.name, `handle iconWhiteSword, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              // this.rerouter.screen.tap(foundResults[i]);
              this.rerouter.screen.tap({ x: foundResults[i].x + 10, y: foundResults[i].y + 10 });
              return;
            }

            logs(context.task.name, `Finish tropical island`);
            sendKeyBack();
            finishRound(true);
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageBattleHasWetCookieCannotStart.name}`,
      match: PAGES.rfpageBattleHasWetCookieCannotStart,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageBattleHasWetCookieCannotStart, cannot start battle so finish current task`);
        this.rerouter.goNext(PAGES.rfpageBattleHasWetCookieCannotStart);
        sendKeyBack();
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageAddMoreCookies.name}`,
      match: PAGES.rfpageAddMoreCookies,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageAddMoreCookies, cannot start battle so finish current task`);
        this.rerouter.goNext(PAGES.rfpageAddMoreCookies);
        sendKeyBack();
        finishRound(true);
      },
    });

    // Bounties
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInBounties.name}`,
      match: PAGES.rfpageInBounties,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageInBounties`);

        if (!this.taskStatus[context.task.name]['hasBountiesLeft']) {
          logs(context.task.name, `bounty finished`);
          finishRound(true);
        }

        let foundResults = findSpecificIconInScreen(ICONS.iconBountiesGreenEnter);
        foundResults.sort(dynamicSort('x'));

        const bountyCount = Object.keys(foundResults).length > 2 ? 4 : Object.keys(foundResults).length;
        if (bountyCount === 0) {
          logs(context.task.name, `cannot find bounty entry button, skipping task`);
          sendKeyBack();
          finishRound(true);
        }

        this.taskStatus[context.task.name]['bountyCount'] = bountyCount;
        this.rerouter.screen.tap({ x: foundResults[0].x + 40, y: foundResults[0].y + 10 });
        return;
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInOneOfTheBounty.name}`,
      match: PAGES.rfpageInOneOfTheBounty,
      action: (context, image, matched, finishRound) => {
        if (!this.taskStatus[context.task.name]['hasBountiesLeft']) {
          // logs(context.task.name, `bounty finished, leave this page`);
          sendKeyBack();
        }

        logs(context.task.name, `about to start handleBounties, send running`);
        sendEvent('running', '');
        let i = 0;

        const bountyCount = this.taskStatus[context.task.name]['bountyCount'];
        let bounties: BountyInfo[] = [];
        for (var bountyIdx = 0; bountyIdx < bountyCount; bountyIdx++) {
          // When there are only one bounty (Sunday), it gets all types of powder thus nothing to OCR
          var powder = bountyCount === 1 ? 0 : ocrMaterialStorage(454, 10, 50, 18);
          var bountyLevel = bountyCount === 1 ? 12 : countBountyLevel();

          if (bountyCount !== 1 && this.config.autoBountiesCheckBluePowder) {
            var rtn = bountyCheckIfGetBluePowder();
            powder = rtn[0];
            bountyLevel = rtn[1];
          }

          if (powder !== -1) {
            bounties.push({
              index: bountyIdx,
              // entryPnt: bountyEntryPnt,
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
            sleep(config.sleepAnimate * 2);
          }
          var gotBountyLevel = countBountyLevel();
          var gotMaterialStock = bountyCount === 1 ? 0 : ocrMaterialStorage(454, 10, 50, 18);
          if (gotBountyLevel === targetBounty.level && gotMaterialStock === targetBounty.powderStock) {
            console.log('found it, level, stock: ', gotBountyLevel, gotMaterialStock);
            break;
          } else {
            console.log('wrong: ', gotBountyLevel, gotMaterialStock, gotBountyLevel === targetBounty.level, gotMaterialStock === targetBounty.powderStock);
            qTap(pnt(435, 178)); // check next one
            sleep(1500);
          }
        }
      },
    });

    // Battle handling
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageBattlePaused.name}`,
      match: PAGES.rfpageBattlePaused,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageBattlePaused, handle it`);
        switch (context.task.name) {
          case TASKS.pvp:
          case TASKS.superMayhem:
            this.rerouter.screen.tap({ x: 315, y: 159 });
            break;
          default:
            // TODO: will fail when resume battle
            console.log('I am rfpageBattlePaused, panic and donno what to do');
            ii++;
        }
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInPVPMedalShop.name}`,
      match: PAGES.rfpageInPVPMedalShop,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpageInPVPArena`);

        if (!this.rerouter.isPageMatchImage(PAGES.rfpagePVPAncientCookieSoldout, image)) {
          this.rerouter.screen.tap({ x: 57, y: 125 });
          Utils.sleep(1000);
          this.rerouter.screen.tap({ x: 317, y: 252 });
          Utils.sleep(2000);
          logs(context.task.name, `Purchased ancient cookie successfully`);
        } else {
          logs(context.task.name, `ancient cookie already sold out`);
        }

        if (!this.rerouter.isPageMatchImage(PAGES.rfpagePVPSuperEpicCookieSoldout, image)) {
          this.rerouter.screen.tap({ x: 145, y: 125 });
          Utils.sleep(1000);
          this.rerouter.screen.tap({ x: 317, y: 252 });
          Utils.sleep(2000);
          logs(context.task.name, `Purchased super epic cookie successfully`);
        } else {
          logs(context.task.name, `super epic cookie already sold out`);
        }

        sendKeyBack();
        finishRound(true);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpagePVPNotEnoughMedal.name}`,
      match: PAGES.rfpagePVPNotEnoughMedal,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in rfpagePVPNotEnoughMedal, Need more medals, skipping`);
        this.rerouter.goNext(PAGES.rfpagePVPNotEnoughMedal);
        finishRound(true);
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInProduction.name}`,
      match: PAGES.rfpageInProduction,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInProduction, leave because current task is not production, but: ${context.task.name}`);
          sendKeyBack();
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInMagicLab.name}`,
      match: PAGES.rfpageInMagicLab,
      action: (context, image, matched, finishRound) => {
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInMagicLab, leave because current task is not production, but: ${context.task.name}`);
          sendKeyBack();
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageSelectAdvantureFirstIsKingdom.name}`,
      match: PAGES.rfpageSelectAdvantureFirstIsKingdom,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `rfpageSelectAdvantureFirstIsKingdom, tap the 1st one to back to kingdom`);
        this.rerouter.goNext(PAGES.rfpageSelectAdvantureFirstIsKingdom);
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageSelectAdvanture.name}`,
      match: PAGES.rfpageSelectAdvanture,
      action: (context, image, matched, finishRound) => {
        if (this.rerouter.isPageMatchImage(PAGES.rfpageSelectAdvantureFirstIsKingdom, image)) {
          logs(context.task.name, `rfpageSelectAdvantureFirstIsKingdom, go back to "My Kingdom"`);
          this.rerouter.goNext(PAGES.rfpageSelectAdvantureFirstIsKingdom);
          return;
        }

        let advantureSetting = AdvanturesBountiesAt3rd;
        if (this.rerouter.isPageMatchImage(PAGES.rfpageBountiesAt2ndSlot, image)) {
          advantureSetting = AdvanturesBountiesAt2nd;
        }

        switch (context.task.name) {
          case TASKS.superMayhem:
            logs(context.task.name, `rfpageSelectAdvanture goto superMayhem`);
            this.rerouter.screen.tap(advantureSetting[context.task.name].pnt);
            break;
          case TASKS.bounties:
            logs(context.task.name, `rfpageSelectAdvanture goto bounties`);
            this.taskStatus['bounties'].hasBountiesLeft = true;
            this.rerouter.screen.tap(advantureSetting[context.task.name].pnt);
            break;
          default:
            logs(context.task.name, `rfpageSelectAdvanture don't know what to do, crash it`);
            ii++;
            sendKeyBack();
        }
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageUncollapsedAffairs.name}`,
      match: PAGES.rfpageUncollapsedAffairs,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `rfpageUncollapsedAffairs, going to task related affair: ${context.task.name}`);
        switch (context.task.name) {
          case TASKS.hotAirBallon:
            this.rerouter.screen.tap({ x: 103, y: 203 });
            return;
          case TASKS.train:
            if (this.rerouter.isPageMatchImage(PAGES.rfpageTrainArrived, image)) {
              this.rerouter.screen.tap({ x: 103, y: 252 });
              logs(context.task.name, `rfpageTrainArrived, goto handle train`);
            } else {
              logs(context.task.name, `no rfpageTrainArrived, no train can be send/collected, skipp this round`);
              this.rerouter.screen.tap({ x: 103, y: 336 }); // fold affairs page
              finishRound(true);
            }
            return;
          case TASKS.wishingTree:
            logs(context.task.name, `about to send wishing tree`);
            this.rerouter.screen.tap({ x: 103, y: 306 });
            return;
          default:
            this.rerouter.screen.tap({ x: 103, y: 335 });
        }
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInCookieHead.name}`,
      match: PAGES.rfpageInCookieHead,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageInCookieHead, in head');

        if (context.task.name === TASKS.fountain) {
          scrollLeftALot(this.rerouter, { x: 116, y: 180 });

          if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpageFistItemIsCastle, 3000)) {
            logs(context.task.name, 'tap goto castle');
            this.rerouter.screen.tap({ x: 260, y: 224 });
            return;
          }
        } else if (context.task.name === TASKS.pvp) {
          if (AdvanturesBountiesAt3rd[TASKS.pvp].fromHead) {
            scrollRightALot(this.rerouter, { x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);
            scrollRightALot(this.rerouter, { x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);

            this.rerouter.screen.tap(AdvanturesBountiesAt3rd[context.task.name].pnt);
            return;
          }
        } else if (
          context.task.name === TASKS.tropicalIslandShip ||
          context.task.name === TASKS.tropicalIslandSunbed ||
          context.task.name === TASKS.tropicalIslandClearBubble
        ) {
          if (AdvanturesBountiesAt3rd[TASKS.pvp].fromHead) {
            scrollRightALot(this.rerouter, { x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);
            scrollRightALot(this.rerouter, { x: 560, y: 186 });
            Utils.sleep(CONSTANTS.sleepAnimate);

            this.rerouter.screen.tap(AdvanturesBountiesAt3rd[context.task.name.substring(0, 14)].pnt);
            return;
          }
        }
      },
    });

    // this.rerouter.addRoute({
    //   path: `/${PAGES.AAAAAAAAA.name}`,
    //   match: PAGES.AAAAAAAAA,
    //   action: (context, image, matched, finishRound) => {
    //     logs(context.task.name, 'rfpageIsDailyFreePackage, daily gift collected correctly');
    //     finishRound(true);
    //   },
    // });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageGeneralMessageWindow.name}`,
      match: PAGES.rfpageGeneralMessageWindow,
      action: (context, image, matched, finishRound) => {
        if (checkScreenMessage(this.rerouter, PAGES.unfinishedPVPBattleMessageScreen)) {
          if (context.task.name !== TASKS.pvp) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedBattleMessageScreen, skip current task');
            finishRound(true);
            return;
          }

          logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedBattleMessageScreen, tap it');
          this.rerouter.screen.tap({ x: 394, y: 253 });
          return;
        } else if (checkScreenMessage(this.rerouter, PAGES.unfinishedSuperMayhemBattleMessageScreen)) {
          if (context.task.name !== TASKS.superMayhem) {
            logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedSuperMayhemBattleMessageScreen, skip current task');
            finishRound(true);
            return;
          }

          logs(context.task.name, 'rfpageGeneralMessageWindow confirm unfinishedSuperMayhemBattleMessageScreen, tap it');
          this.rerouter.screen.tap({ x: 394, y: 253 });
          return;
        }

        logs(context.task.name, 'rfpageGeneralMessageWindow crash the script');
        ii++;
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInKingdomVillage.name}`,
      match: PAGES.rfpageInKingdomVillage,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `in ${context.path}`);

        switch (context.task.name) {
          case TASKS.collectMail:
            this.rerouter.screen.tap({ x: 550, y: 20 });
            break;
          case TASKS.collectKingdomPass:
            this.rerouter.screen.tap({ x: 600, y: 85 });
            break;
          case TASKS.sendFriendReward:
            this.rerouter.screen.tap({ x: 512, y: 20 });
            break;
          case TASKS.getInShopFreeDailyPack:
            this.rerouter.screen.tap({ x: 26, y: 86 });
            break;
          case TASKS.hotAirBallon:
            this.rerouter.screen.tap({ x: 105, y: 330 });
            break;
          case TASKS.train:
            this.rerouter.screen.tap({ x: 105, y: 330 });
            break;
          case TASKS.wishingTree:
            this.rerouter.screen.tap({ x: 105, y: 330 });
            break;
          case TASKS.fountain:
          case TASKS.pvp:
          case TASKS.tropicalIslandShip:
          case TASKS.tropicalIslandSunbed:
          case TASKS.tropicalIslandClearBubble:
            this.rerouter.screen.tap({ x: 25, y: 25 }); // goto head
            break;
          case TASKS.superMayhem:
          case TASKS.bounties:
          case TASKS.guild:
            this.rerouter.screen.tap({ x: 560, y: 325 }); // goto PLAY!
            break;
          default:
            logs(context.task.name, 'Unknown task in rfpageInKingdomVillage');
            break;
        }
      },
    });

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageGeneralMessageWindow.name}`,
      match: PAGES.rfpageGeneralMessageWindow,
      action: (context, image, matched, finishRound) => {
        if (this.rerouter.isPageMatchImage(PAGES.rfpageNotifyQuitWindow, image)) {
          sendKeyBack();
          return;
        }
      },
    });

    const allPages: { [key: string]: Page } = PAGES as any;
    for (const pageIdx in allPages) {
      const page = allPages[pageIdx];
      if (!(page instanceof Page)) {
        continue;
      }
      this.rerouter.addRoute({
        path: `/${page.name}`,
        match: page,
        action: (context, image, matched, finishRound) => {
          console.log('findPath', context.path);
          this.rerouter.goNext(page);
        },
      });
    }
  }

  checkIfTrainRequirementMet() {
    // TODO: or isMessageWindowWithDiamond()
    if (this.rerouter.waitScreenForMatchingPage(PAGES.rfpageTrainNotEnoughGoods, 2000)) {
      this.rerouter.goNext(PAGES.rfpageTrainNotEnoughGoods);
      return false;
    }
  }

  public handleUnknown() {
    this.rerouter.addUnknownAction((context, image, finishRound) => {
      // this.rerouter.getCurrentMatchNames();
      Utils.log(`unknown count ${context.matchTimes}, during ${context.matchDuring}, last matched: ${context.lastMatchedPath}`);
      if (this.rerouter.checkAndStartApp()) {
        return;
      }

      const rfpageBattling = new Page('rfpageBattling', [
        // From PVP
        // { x: 284, y: 17, r: 145, g: 219, b: 143 },
        // { x: 351, y: 16, r: 77, g: 32, b: 12 },

        // From Super mayhem
        { x: 354, y: 14, r: 125, g: 12, b: 251 },
        { x: 285, y: 15, r: 65, g: 205, b: 12 },
      ]);

      // const rfpageAutoUseSkillEnabled = new Page('rfpageAutoUseSkillEnabled', [{ x: 28, y: 291, r: 223, g: 221, b: 1 }], { x: 28, y: 291 });
      // const rfpageSpeedBoostEnabled = new Page('rfpageSpeedBoostEnabled', [{ x: 31, y: 333, r: 113, g: 107, b: 17 }], { x: 31, y: 333 });
      const rfpageAutoUseSkillNotEnabled = new Page('rfpageAutoUseSkillNotEnabled', [{ x: 41, y: 289, r: 203, g: 203, b: 203 }], { x: 41, y: 289 });
      const rfpageSpeedBoostNotEnabled = new Page('rfpageSpeedBoostNotEnabled', [{ x: 33, y: 319, r: 203, g: 203, b: 203 }], { x: 33, y: 319 });
      const rfpageSpeed1_2x = new Page(
        'rfpageSpeed1_2x',
        [
          { x: 20, y: 333, r: 211, g: 209, b: 2 },
          { x: 32, y: 334, r: 161, g: 159, b: 8 },
        ],
        { x: 20, y: 333 }
      );
      if (this.rerouter.isPageMatchImage(rfpageBattling, image)) {
        logs(context.task.name, 'unknown but should be rfpageBattling so continue');
        context.matchTimes = 0;

        if (!this.rerouter.isPageMatchImage(rfpageAutoUseSkillNotEnabled, image)) {
          this.rerouter.goNext(rfpageAutoUseSkillNotEnabled);
          Utils.sleep(this.config.sleepAnimate);
          logs(context.task.name, `Tap auto skill enable 1 time for rfpageAutoUseSkillNotEnabled`);
        } else if (!this.rerouter.isPageMatchImage(rfpageSpeedBoostNotEnabled, image)) {
          this.rerouter.goNext(rfpageSpeedBoostNotEnabled);
          Utils.sleep(this.config.sleepAnimate);
          this.rerouter.goNext(rfpageSpeedBoostNotEnabled);
          Utils.sleep(this.config.sleepAnimate);
          logs(context.task.name, `Tap speed boost 2 times for rfpageSpeedBoostNotEnabled`);
        } else if (!this.rerouter.isPageMatchImage(rfpageSpeed1_2x, image)) {
          this.rerouter.goNext(rfpageSpeedBoostNotEnabled);
          Utils.sleep(this.config.sleepAnimate);
          logs(context.task.name, `Tap speed boost 1 time for rfpageSpeed1_2x`);
        }
        return;
      }

      let unknownTarget = 4;
      if (context.task.name === TASKS.pvp || context.task.name === TASKS.superMayhem) {
        unknownTarget = 60;
      }

      if (context.matchTimes % unknownTarget === 0) {
        keycode('KEYCODE_BACK', 100);
        Utils.log('keycode back for unknown');
      }
      if (context.matchTimes % 7 === 0) {
        this.rerouter.screen.tap({ x: 575, y: 22 });
        Utils.log('Unknown count 7, could be in tap to login, tapping (575, 22) until the game start');
      }
    });
  }

  public handleLogIn() {
    // TODO: handle log in
    console.log('wait for log in');
    Utils.sleep(CONSTANTS.sleep);
  }

  public isSameColor(image: Image, xyrgb: XYRGB, thres: number = 0.8): boolean {
    const rgb = getImageColor(image, xyrgb.x, xyrgb.y);
    const score = Utils.identityColor(rgb, xyrgb);
    return score > thres;
  }
}

// * =========== entry point ===========
let cookieKingdom: CookieKingdom | undefined;
export function start(jsonConfig: any) {
  const config = defaultConfig;
  if (typeof jsonConfig === 'string') {
    jsonConfig = JSON.parse(jsonConfig);
  }
  cookieKingdom = new CookieKingdom(config);
  cookieKingdom.start();
}
export function stop() {
  if (cookieKingdom === undefined) {
    return;
  }
  cookieKingdom.stop();
  cookieKingdom = undefined;
}

// // ! following is only for dev
// function run() {
//   const cookieKingdom = new CookieKingdom(defaultConfig);
//   cookieKingdom.start();
// }

// run();

// declare global {
//   interface Window {}
// }
// if (window === undefined) {
//   (window as any) = {};
// }
// (window as any).start = start;
// (window as any).stop = stop;
// (window as any).rerouter = rerouter;

sendEvent('running', '');
defaultConfig.alwaysFulfillWishes = true;
start();
console.log('jobs done');
