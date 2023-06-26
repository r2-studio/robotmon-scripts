import { Rerouter, rerouter, Utils, XYRGB, Page, Task, Icon, XY } from 'Rerouter';
import { ScriptConfig, Wish, WishStatus } from './src/types';
import { logs, getCurrentApp, sendKeyBack } from './src/utils';
import { scrollDownALot, scrollLeftALot, scrollRightALot, getStatusOfGivenWish, checkToSendSpecificWish } from './src/helper';
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
    this.rerouter.addTask({
      name: TASKS.wishingTree,
      maxTaskDuring: 10 * CONSTANTS.minuteInMs,
      minRoundInterval: this.config.autoFulfillWishesIntervalInMins * CONSTANTS.minuteInMs,
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

        sendEvent('gameStatus', 'login-succeeded');
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
        const x = PAGES.rfpageNecessities.points[0].x;
        const y = PAGES.rfpageNecessities.points[0].y + trial * 20;
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
        finishRound();
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

        if (this.rerouter.isPageMatch(rfpageAllWishingDailyRewardCollected) && !this.config.alwaysFulfillWishes) {
          logs(context.task.name, `rfpageInWishingTree, All wish fulfilled, skipping and send running`);
          sendEvent('running', '');
          finishRound();
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

        return true;
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
        if (context.task.name !== TASKS.production) {
          logs(context.task.name, `rfpageInProduction, leave because current task is not production, but: ${context.task.name}`);
          this.rerouter.goNext(PAGES.rfpageSelectAdvantureFirstIsKingdom);
        }
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

        // switch(context.task.name) {
        //   case TASKS.
        // }
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

    // this.rerouter.addRoute({
    //   path: `/${PAGES.AAAAAAAAA.name}`,
    //   match: PAGES.AAAAAAAAA,
    //   action: (context, image, matched, finishRound) => {
    //     logs(context.task.name, 'rfpageIsDailyFreePackage, daily gift collected correctly');
    //     finishRound(true);
    //   },
    // });

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

      if (context.matchTimes % 4 === 0) {
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
