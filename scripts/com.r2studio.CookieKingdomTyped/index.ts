import { Rerouter, rerouter, Utils, XYRGB, Page, Task } from 'Rerouter';
import { ScriptConfig } from './src/types';
import { logs, getCurrentApp, sendKeyBack } from './src/utils';
import { scrollDownALot, scrollLeftALot, scrollRightALot } from './src/helper';
import { defaultConfig } from './src/defaultScriptConfig';

import * as PAGES from './src/pages';
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
    this.rerouter.stop();
  }

  public init() {
    this.addTasks();
    this.addRoutes();
    this.handleUnknown();

    // show current page
    this.rerouter.getCurrentMatchNames();
  }

  public initTaskStatus() {
    this.taskStatus[TASKS.getInShopFreeDailyPack] = {
      trials: 0,
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
    this.rerouter.addTask({
      name: TASKS.sendHotAirBallon,
      maxTaskDuring: 3 * CONSTANTS.minuteInMs,
      minRoundInterval: this.config.autoSendHotAirBallonIntervalInMins * CONSTANTS.minuteInMs,
      forceStop: false,
    });

    // ====
  }

  public addRoutes() {
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

    this.rerouter.addRoute({
      path: `/${PAGES.rfpageUncollapsedAffairs.name}`,
      match: PAGES.rfpageUncollapsedAffairs,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, `rfpageUncollapsedAffairs, goint to task related affair: ${context.task.name}`);
        switch (context.task.name) {
          case TASKS.sendHotAirBallon:
            this.rerouter.screen.tap({ x: 103, y: 203 });
            break;
        }
      },
    });
    this.rerouter.addRoute({
      path: `/${PAGES.rfpageInHotAirBallon.name}`,
      match: PAGES.rfpageInHotAirBallon,
      action: (context, image, matched, finishRound) => {
        logs(context.task.name, 'rfpageInHotAirBallon, choose next step');
        if (this.taskStatus[TASKS.sendHotAirBallon]['changeMapFinished']) {
          this.rerouter.screen.tap({ x: 258, y: 330 }); // tap Auto
          Utils.sleep(CONSTANTS.sleepAnimate);
          this.rerouter.screen.tap({ x: 575, y: 330 }); // tap Start
        } else {
          this.rerouter.screen.tap({ x: 412, y: 330 }); // tap Change
        }
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
        } else {
          // scroll to right most and find the last map
          // scrollRightALot(rerouter, { x: 618, y: 151 });
          // TODO: continue here
          console.log('Need to find last map and continue');
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
            this.taskStatus[TASKS.getInShopFreeDailyPack] = {
              trials: 0,
            };
            this.rerouter.screen.tap({ x: 26, y: 86 });
            break;
          case TASKS.sendHotAirBallon:
            this.taskStatus[TASKS.sendHotAirBallon] = {
              changeMapFinished: false,
            };
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

declare global {
  interface Window {}
}
// if (window === undefined) {
//   (window as any) = {};
// }
// (window as any).start = start;
// (window as any).stop = stop;
// (window as any).rerouter = rerouter;

start();
