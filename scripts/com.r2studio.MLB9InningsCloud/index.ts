import { Utils, RouteConfig } from 'Rerouter';
import { rerouter, Config, Session, EventSender } from './src/modules';

import * as PAGE from './src/pages';
import * as CONSTANTS from './src/constants';
import { TASK } from './src/task';
import { isSameColor, getColorCountInRange, isSameColorCount, arrayFind, executeCommands } from './src/utils';

const VERSION_CODE: number = 15.32;

class MLB9I {
  public static packageName: string = 'com.com2us.ninepb3d.normal.freefull.google.global.android.common';
  public state = {
    hasSession: false,
    isWaitingLogin: false,
    lastUploadSession: 0,

    leagueGame: {
      lastCheckPowerSaveAt: 0,
      powerSaveColorCount: {},
      tryEnterGameCnts: 0,
      needResetProgress: false,
    },
  };

  constructor(jsonConfig: any) {
    console.log('############ new MLB9I ############');
    Config.set(jsonConfig);

    // rerouter setups
    rerouter.rerouterConfig.autoLaunchApp = Config.config.hasCoolFeature || false;
    console.log(`script version ${VERSION_CODE}`);
  }

  public init() {
    if (Config.config.isLocalPaid) {
      var plan = getUserPlan();
      if (plan != 'user_plan_mlb9i') {
        console.log('user plan id: ', JSON.stringify(plan));
        console.log('please subscribe premium plan');
        return;
      }
    }

    this.addRoutes();
    this.handleUnknown();
    // rerouter.getCurrentMatchNames();

    if (Config.config.isLocalPaid) {
      this.addPremiumTasks();
      this.addBasicTasks();
      return;
    }
    if (!Config.config.isCloud) {
      this.addBasicTasks();
      return;
    }
    if (!Config.config.licenseId) {
      console.log('no license id');
      this.addStayInLoginTasks();
      return;
    }

    this.addPremiumTasks();
    this.addBasicTasks();
  }

  public start() {
    if (Config.config.isCloud) {
      Session.initSession();
      executeCommands('pm disable-user com.android.inputmethod.latin');
    }
    this.init();

    rerouter.start(MLB9I.packageName);
  }
  public stop() {
    rerouter.stop();
    if (!Config.config.isCloud) {
      return;
    }
    Session.endSession();
  }

  public addBasicTasks() {
    rerouter.addTask({
      name: TASK.playLeagueGame,
      // maxTaskRunTimes: 2,
      maxTaskDuring: 10 * CONSTANTS.hourInMs,
      forceStop: true,
    });
  }
  public addPremiumTasks() {
    // only run once
    rerouter.addTask({
      name: TASK.settingDefault,
      // maxTaskRunTimes: 1,
      minRoundInterval: Number.POSITIVE_INFINITY,
      maxTaskDuring: 10 * CONSTANTS.minuteInMs,
      forceStop: true,
    });

    // FIXME: this should only run when needed
    rerouter.addTask({
      name: TASK.settingResetLeagueProgress,
      minRoundInterval: 1 * CONSTANTS.minuteInMs,
      maxTaskDuring: 10 * CONSTANTS.minuteInMs,
      beforeRoute: task => {
        const { needResetProgress } = this.state.leagueGame;
        if (!needResetProgress) {
          return 'skipRouteLoop';
        }
      },
      forceStop: true,
    });

    rerouter.addTask({
      name: TASK.restartAppPerDay,
      // maxTaskRunTimes: 1,
      minRoundInterval: CONSTANTS.dayInMs,
      beforeRoute: task => {
        if (task.lastRunTime !== 0) {
          console.log('restart app task');
          rerouter.restartApp();
        }
        return 'skipRouteLoop';
      },
      maxTaskDuring: 30 * CONSTANTS.minuteInMs,
      forceStop: true,
    });

    rerouter.addTask({
      name: TASK.weeklyMission,
      // maxTaskRunTimes: 1,
      minRoundInterval: CONSTANTS.dayInMs,
      maxTaskDuring: 30 * CONSTANTS.minuteInMs,
      forceStop: true,
    });

    rerouter.addTask({
      name: TASK.adReward,
      // maxTaskRunTimes: 1,
      minRoundInterval: CONSTANTS.minuteInMs * 30,
      findRouteDelay: CONSTANTS.sleepMedium,

      maxTaskDuring: CONSTANTS.sleepForAd + CONSTANTS.duringMaxAdRetry,
      forceStop: true,
    });

    rerouter.addTask({
      name: TASK.playBattleGame,
      minRoundInterval: CONSTANTS.hourInMs,
      maxTaskDuring: 10 * CONSTANTS.hourInMs,
      forceStop: true,
    });
  }
  public addStayInLoginTasks() {
    rerouter.addTask({
      name: TASK.stayInLogin,
      forceStop: false,
    });
  }

  public addRoutes() {
    // ** launching pages
    rerouter.addRoute({
      path: `/${PAGE.logo.name}`,
      match: PAGE.logo,
      action: context => {
        console.log('wait app loading ...');
        Utils.sleep(CONSTANTS.sleepMedium);
        if (!Config.config.hasCoolFeature) {
          return;
        }

        // set to default once app is launched (first and again)
        this.state.hasSession = false;
        this.state.lastUploadSession = 0;
        this.state.leagueGame = {
          lastCheckPowerSaveAt: 0,
          powerSaveColorCount: {},
          tryEnterGameCnts: this.state.leagueGame.tryEnterGameCnts,
          needResetProgress: false,
        };

        // reopen if stuck
        const now = Date.now();
        if (now - context.matchStartTS > 5 * CONSTANTS.minuteInMs) {
          console.log('stuck in launch page too long, restart app');
          rerouter.restartApp();
          Utils.sleep(CONSTANTS.sleepMedium);
          return;
        }

        EventSender.launching();
      },
    });
    rerouter.addRoute({
      path: `/${PAGE.landingLoading.name}`,
      match: PAGE.landingLoading,
      action: this.wrapRouteAction(_ => {
        console.log('landing loading...');

        // set to default once app is launched (first and again)
        this.state.hasSession = false;
        this.state.lastUploadSession = 0;
        this.state.leagueGame = {
          lastCheckPowerSaveAt: 0,
          powerSaveColorCount: {},
          tryEnterGameCnts: this.state.leagueGame.tryEnterGameCnts,
          needResetProgress: false,
        };

        EventSender.launching();
      }),
      afterActionDelay: CONSTANTS.sleepMedium,
    });
    [PAGE.downloadData, PAGE.progressBarRunning].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: this.wrapRouteAction('goNext'),
        afterActionDelay: CONSTANTS.sleepLong,
      });
    });
    [PAGE.TOS, PAGE.TOS90, PAGE.TOS90v2].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: this.wrapRouteAction('goNext'),
      });
    });

    // ** login pages
    rerouter.addRoute({
      path: `/${PAGE.landing.name}`,
      match: PAGE.landing,
      action: context => {
        if (!Config.config.isCloud) {
          console.log('stay in login');
          return;
        }
        this.state.hasSession = false;
        this.state.isWaitingLogin = true;

        // use interval
        EventSender.running(true);
        if (context.task.name === TASK.stayInLogin) {
          console.log('stay in login');
          if (context.matchDuring < CONSTANTS.switchWaitingLoginPagesInterval) {
            return;
          }
          console.log('click hive login for avoid app crush');
        }

        rerouter.goNext(PAGE.landing);
      },
    });

    [PAGE.logIn, PAGE.logIn90].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: context => {
          if (!Config.config.isCloud) {
            console.log('stay in login');
            return;
          }

          this.state.hasSession = false;
          this.state.isWaitingLogin = true;
          if (context.task.name === TASK.stayInLogin) {
            console.log('stay in login');
            keycode('BACK', 100);
            console.log('keycode back');
            return;
          }

          // use interval
          EventSender.running(true);
          EventSender.loginInputing();
          if (context.matchDuring < CONSTANTS.switchWaitingLoginPagesInterval) {
            return;
          }
          console.log('click back for avoid session expired');
          keycode('BACK', 100);
          console.log('keycode back');
        },
      });
    });
    [PAGE.fbLogIn90, PAGE.googleLogIn90].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: 'keycodeBack',
      });
    });

    // ** main
    rerouter.addRoute({
      path: `/${PAGE.main.name}`,
      match: PAGE.main,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        const task = context.task.name;
        console.log(task);

        switch (task) {
          case TASK.stayInLogin:
            // should be inaccessible unless clear session is failed
            Session.endSession();
            return;

          case TASK.settingDefault:
          case TASK.settingResetLeagueProgress:
            rerouter.screen.tap(PAGE.mainBtns.settings);
            break;

          case TASK.playLeagueGame:
            rerouter.screen.tap(PAGE.mainBtns.leagueMode);
            this.state.leagueGame.tryEnterGameCnts++;
            break;
          case TASK.playBattleGame:
            rerouter.screen.tap(PAGE.mainBtns.battleMode);
            break;

          case TASK.adReward:
            // sometimes won't trigger anything if still on cd
            if (context.matchTimes > 2) {
              console.log('ad is still on cd');
              finishRound(true);
            } else {
              rerouter.screen.tap(PAGE.mainBtns.adTab);
            }
            break;
          case TASK.weeklyMission:
            rerouter.screen.tap(PAGE.mainBtns.achievement);
            break;
          default:
            break;
        }

        this.state.hasSession = true;
        this.state.isWaitingLogin = false;
        EventSender.loginSuccess();
        EventSender.playing();
        EventSender.running();
      }),
    });

    // ** game setting
    rerouter.addRoute({
      path: `/${PAGE.settings.name}`,
      match: PAGE.settings,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        const inactiveTabColor = { r: 58, g: 65, b: 74 };
        const tab = arrayFind(Object.keys(PAGE.settingsTabs), t => {
          const { x, y } = PAGE.settingsTabs[t as keyof typeof PAGE.settingsTabs];
          return !isSameColor(image, { x, y, ...inactiveTabColor });
        });

        switch (context.task.name) {
          case TASK.settingDefault:
            if (tab === 'graphicTab') {
              rerouter.screen.tap(PAGE.settingsGraphTabBtns.powerSaveOn);
              Utils.sleep(CONSTANTS.sleepShort);
              finishRound(true);
              EventSender.running();
            } else {
              // go to graphicTab
              rerouter.screen.tap(PAGE.settingsTabs.graphicTab);
            }
            break;
          case TASK.settingResetLeagueProgress:
            if (!this.state.leagueGame.needResetProgress) {
              finishRound(true);
              break;
            }
            // go to leagueResetDialog
            rerouter.screen.tap(PAGE.settingsBtns.leagueReset);
            this.state.leagueGame.needResetProgress = false;

            break;
          default:
            rerouter.goBack(PAGE.settings);
            break;
        }
      }),
    });

    // ** ad reward
    rerouter.addRoute({
      path: `/${PAGE.adReward.name}`,
      match: PAGE.adReward,
      action: this.wrapRouteAction(context => {
        if (context.task.name !== TASK.adReward) {
          rerouter.goBack(PAGE.adReward);
          return;
        }

        console.log('watch ad');
        rerouter.goNext(PAGE.adReward);
        Utils.sleep(CONSTANTS.sleepForAd);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.adRewardRedeem.name}`,
      match: PAGE.adRewardRedeem,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('ad reward get');
        rerouter.goNext(PAGE.adRewardRedeem);
        Utils.sleep(CONSTANTS.sleepShort);
        if (context.task.name === TASK.adReward) {
          finishRound(true);
          EventSender.running();
        }
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.adRewardOnCD.name}`,
      match: PAGE.adRewardOnCD,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('ad is still cd');
        rerouter.goBack(PAGE.adRewardOnCD);
        Utils.sleep(CONSTANTS.sleepShort);
        if (context.task.name === TASK.adReward) {
          finishRound(true);
          EventSender.running();
        }
      }),
    });

    // ** weekly mission
    rerouter.addRoute({
      path: `/${PAGE.achivementMission.name}`,
      match: PAGE.achivementMission,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.weeklyMission) {
          rerouter.goBack(PAGE.achivementMission);
          return;
        }
        // collect daily one if available
        const x = 613;
        const canCollectColor = { r: 8, g: 125, b: 255 };
        for (let y = 128; y < 260; y += 44) {
          const canCollect = isSameColor(image, { x, y, ...canCollectColor });
          if (canCollect) {
            rerouter.screen.tap({ x, y });
            console.log('collect');
            Utils.sleep(CONSTANTS.sleepMedium);
          }
        }

        rerouter.goNext(PAGE.achivementMission);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.weeklyMissionBox.name}`,
      match: PAGE.weeklyMissionBox,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.weeklyMission) {
          rerouter.goBack(PAGE.weeklyMissionBox);
          return;
        }

        const canCollectColor = { r: 189, g: 194, b: 197 };
        const [x, y] = [27, 115];
        const [w, h] = [198, 75];
        // click openBox only when all mission is complete
        // bc it is abled once a week
        for (var dx = 0; dx < 3 * w; dx += w) {
          for (var dy = 0; dy < 3 * h; dy += h) {
            const canCollect = isSameColor(image, { x: x + dx, y: y + dy, ...canCollectColor });
            if (!canCollect) {
              console.log('wait all weekly mission complete');
              finishRound(true);
              EventSender.running();
              return;
            }
          }
          console.log('click open');
          rerouter.screen.tap(PAGE.weeklyMissionBoxBtns.openBox);
          Utils.sleep(CONSTANTS.sleepMedium);

          // TODO: let user select the item they want in the future
          // select the left bottom one
          console.log('select right bottom item');
          rerouter.screen.tap({ x, y: y + 2 * h });
          Utils.sleep(CONSTANTS.sleepMedium);

          console.log('receive right bottom item');
          rerouter.screen.tap(PAGE.weeklyMissionBoxBtns.receiveReward);

          // enter receive confirm page
          finishRound(true);
          EventSender.running();
        }
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.weeklyMissionBoxConfirm.name}`,
      match: PAGE.weeklyMissionBoxConfirm,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.weeklyMissionBoxReceived.name}`,
      match: PAGE.weeklyMissionBoxReceived,
      action: this.wrapRouteAction('goNext'),
    });

    // ** playBattleGame
    rerouter.addRoute({
      path: `/${PAGE.battleModePanel.name}`,
      match: PAGE.battleModePanel,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.battleModePanel);
          return;
        }
        // TODO: check if play other mode too
        rerouter.screen.tap(PAGE.battleModePanelBtns.rankedBattle);
        console.log('play ranked battle');
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.rankedBattlePanel.name}`,
      match: PAGE.rankedBattlePanel,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.rankedBattlePanel);
          return;
        }

        // cannot play
        if (context.matchTimes > 5) {
          finishRound(true);
          EventSender.running();
          return;
        }

        // check if play is available
        const isPlayDisabled = isSameColor(image, PAGE.rankedBattlePanelBtns.disabledPlayBtn);
        if (isPlayDisabled) {
          finishRound(true);
          EventSender.running();
          console.log('ranked battle play disabled');
          return;
        }

        rerouter.goNext(PAGE.rankedBattlePanel);
        console.log('play ranked battle (single)');
        Utils.sleep(CONSTANTS.sleepLong);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.rankedBattleWaitToRefresh.name}`,
      match: PAGE.rankedBattleWaitToRefresh,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name === TASK.playBattleGame) {
          console.log('play rank game disabled');
          finishRound(true);
          EventSender.running();
        }
        rerouter.goBack(PAGE.rankedBattleWaitToRefresh);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.rankedBattleGameInfo.name}`,
      match: PAGE.rankedBattleGameInfo,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.rankedBattleGameInfo);
          return;
        }
        rerouter.goNext(PAGE.rankedBattleGameInfo);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.rankedBattleResult.name}`,
      match: PAGE.rankedBattleResult,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.autoGameConfirm.name}`,
      match: PAGE.autoGameConfirm,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.autoGameConfirm);
          return;
        }
        rerouter.goNext(PAGE.autoGameConfirm);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.autoGameConfirmEnd.name}`,
      match: PAGE.autoGameConfirmEnd,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.autoGameConfirmEnd);
          return;
        }
        rerouter.goNext(PAGE.autoGameConfirmEnd);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.rankedBattleGameInfo.name}`,
      match: PAGE.rankedBattleGameInfo,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playBattleGame) {
          rerouter.goBack(PAGE.rankedBattleGameInfo);
          return;
        }
        rerouter.goNext(PAGE.rankedBattleGameInfo);
      }),
    });
    [PAGE.rechargeBallRankMode, PAGE.rechargeBallLeagueMode].forEach(p =>
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: this.wrapRouteAction((context, image, matched, finishRound) => {
          switch (context.task.name) {
            case TASK.playBattleGame:
            case TASK.playLeagueGame:
              console.log('cannot continue: recharge ball needed');
              finishRound(true);
            default:
              break;
          }
          rerouter.goBack(p);
        }),
      })
    );

    // ** playLeagueMode
    // enter game info
    rerouter.addRoute({
      path: `/${PAGE.leagueModePanel.name}`,
      match: PAGE.leagueModePanel,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playLeagueGame) {
          rerouter.goBack(PAGE.leagueModePanel);
          return;
        }

        // can play league mode
        this.state.leagueGame.tryEnterGameCnts++;

        // avoid to click btn too many time for trigger next page immediately
        if (context.matchTimes < 2) {
          rerouter.goNext(PAGE.leagueModePanel);
        }
        Utils.sleep(CONSTANTS.sleepShort);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueModeGameInfo.name}`,
      match: PAGE.leagueModeGameInfo,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playLeagueGame) {
          rerouter.goBack(PAGE.leagueModeGameInfo);
          return;
        }

        console.log('check energy');
        const emptyEnergy = { x: 551, y: 281, r: 3, g: 124, b: 213 };
        const hasEnergy0 = isSameColor(image, emptyEnergy, 0.9);
        if (hasEnergy0) {
          console.log('no energy');
          finishRound(true);
          EventSender.running();
          return;
        }

        const digit1 = { x: 561, y: 278, r: 169, g: 172, b: 179 };
        const hasEnergy10 = isSameColor(image, digit1);
        console.log('has10Energy:', hasEnergy10);

        // use quick play when has 10+ energy,
        // and slow play when has 10- energy
        const quickPlayOnBtn = { x: 37, y: 284, r: 33, g: 255, b: 140 };
        const isQuickPlayOn = isSameColor(image, quickPlayOnBtn);

        if (hasEnergy10 && !isQuickPlayOn) {
          rerouter.screen.tap(quickPlayOnBtn); // select quick play
          console.log('turn on quick play');
          Utils.sleep(CONSTANTS.sleepLong);
        }
        if (!hasEnergy10 && isQuickPlayOn) {
          rerouter.screen.tap(quickPlayOnBtn); // cancel quick play
          console.log('turn off quick play');
          Utils.sleep(CONSTANTS.sleepLong);
        }

        rerouter.goNext(PAGE.leagueModeGameInfo); // play ball
        console.log('play league mode game');
        Utils.sleep(CONSTANTS.sleepLong);
      }),
    });

    // select things
    rerouter.addRoute({
      path: `/${PAGE.selectPlayRole.name}`,
      match: PAGE.selectPlayRole,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle select play role');
        rerouter.goNext(PAGE.selectPlayRole);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectYear.name}`,
      match: PAGE.selectYear,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle select year page');
        rerouter.goNext(PAGE.selectYear);

        // go to the min year
        const activeButton = {
          x: PAGE.selectYearBtns.prevYear.x,
          y: PAGE.selectYearBtns.prevYear.y,
          r: 49,
          g: 85,
          b: 123,
        };

        let isNotMinYear = rerouter.screen.isSameColor(activeButton);
        for (let remainClick = 12; remainClick > 0 && isNotMinYear; remainClick--) {
          rerouter.screen.tap(PAGE.selectYearBtns.prevYear);
          Utils.sleep(CONSTANTS.sleepShort);
          isNotMinYear = rerouter.screen.isSameColor(activeButton);
        }

        // check the diff, return to prev year
        for (var yearDiff = Config.config.leagueYear - CONSTANTS.leagueYearMin; yearDiff > 0; yearDiff--) {
          rerouter.screen.tap(PAGE.selectYearBtns.nextYear);
          Utils.sleep(CONSTANTS.sleepShort);
        }

        // submit changes
        rerouter.screen.tap(PAGE.selectYearBtns.submit);
        Utils.sleep(CONSTANTS.sleepShort);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectSeasonMode.name}`,
      match: PAGE.selectSeasonMode,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle select season page');
        rerouter.goNext(PAGE.selectSeasonMode);
        Utils.sleep(CONSTANTS.sleepMedium);
        rerouter.screen.tap({ x: 568, y: 333 }); // normal mode
        Utils.sleep(CONSTANTS.sleepShort);
        // TODO split page
        rerouter.screen.tap({ x: 332, y: 301 }); // next season
        Utils.sleep(CONSTANTS.sleepLong);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectLeagueGameAmount.name}`,
      match: PAGE.selectLeagueGameAmount,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle select league game amount page');
        // use config user setted to select which they want to play
        // TODO: handle the half, quarter, full has 2 next page
        switch (Config.config.leagueSeasonMode) {
          case 'full':
            console.log('select full league');
            rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.full);
            Utils.sleep(CONSTANTS.sleepShort);
            rerouter.screen.tap({ x: 564, y: 328 }); // go next
            break;
          case 'half':
            console.log('select 1/2 league');
            rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.half);
            Utils.sleep(CONSTANTS.sleepShort);
            rerouter.screen.tap({ x: 564, y: 328 }); // go next
            // ? will go to ok / next pages
            break;
          case 'quarter':
            console.log('select 1/4 league');
            rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.quarter);
            Utils.sleep(CONSTANTS.sleepShort);
            rerouter.screen.tap({ x: 564, y: 328 }); // go next
            // ? will go to ok / next pages
            break;
          case 'postSeason':
            console.log('select postSeason');
            rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.post);
            // ? will go to ok / next pages
            break;
        }
        Utils.sleep(CONSTANTS.sleepMedium);
        rerouter.screen.tap({ x: 564, y: 328 }); // go next
        Utils.sleep(CONSTANTS.sleepLong);
      }),
    });

    // season new/ end
    rerouter.addRoute({
      path: `/${PAGE.newSeason.name}`,
      match: PAGE.newSeason,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.endSeason.name}`,
      match: PAGE.endSeason,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.endSeasonProceed.name}`,
      match: PAGE.endSeasonProceed,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle end season proceed');
        rerouter.screen.tap({ x: 182, y: 178 }); // tap new season of left
        // will go to endSeasonProceedSelected
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.endSeasonProceedSelected.name}`,
      match: PAGE.endSeasonProceedSelected,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectNormalMasterLeagueMode.name}`,
      match: PAGE.selectNormalMasterLeagueMode,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle select normal / master mode');

        // if cannot select master mode, at least select normal mode
        rerouter.screen.tap(PAGE.selectNormalMasterLeagueModeBtns.normal);
        Utils.sleep(CONSTANTS.sleepShort);
        rerouter.screen.tap(PAGE.selectNormalMasterLeagueModeBtns.master);
        Utils.sleep(CONSTANTS.sleepShort);
        // whether choose any mode, will jump to proceed page
        rerouter.goNext(PAGE.selectNormalMasterLeagueMode);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectNormalMasterLeagueModeProceed.name}`,
      match: PAGE.selectNormalMasterLeagueModeProceed,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueResetDialogYN.name}`,
      match: PAGE.leagueResetDialogYN,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handle reset league dialog with yes/no');

        // TODO: let user choose in config
        if (context.lastMatchedPath === `/${PAGE.selectNormalMasterLeagueModeProceed.name}`) {
          console.log('reset league mode');
          rerouter.goNext(PAGE.leagueResetDialogYN);
          return;
        }

        // not reset
        rerouter.goBack(PAGE.leagueResetDialogYN);
        return;
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueResetDialog.name}`,
      match: PAGE.leagueResetDialog,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.settingResetLeagueProgress) {
          // cancel
          rerouter.goBack(PAGE.leagueResetDialog);
          return;
        }
        console.log('handle reset league dialog');
        // TODO: let user can select specific mode and year to play
        // reset
        rerouter.goNext(PAGE.leagueResetDialog);
        this.state.leagueGame.needResetProgress = false;
        finishRound(true);
        return;
      }),
    });

    // other
    rerouter.addRoute({
      path: `/${PAGE.gameLineUp.name}`,
      match: PAGE.gameLineUp,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.playerGrowthComplete.name}`,
      match: PAGE.playerGrowthComplete,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.pitcherOfTheMonth.name}`,
      match: PAGE.pitcherOfTheMonth,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.mvp.name}`,
      match: PAGE.mvp,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handleMvpPage');
        const okBtn = { x: 568, y: 320, r: 52, g: 120, b: 210 };
        let isOkBtnOnScreen = rerouter.screen.isSameColor(okBtn);

        // ok button still on the screen
        for (var maxOkButtonRemain = 10; isOkBtnOnScreen && maxOkButtonRemain > 0; maxOkButtonRemain--) {
          rerouter.goNext(PAGE.mvp); // ok
          Utils.sleep(CONSTANTS.sleepMedium);
          isOkBtnOnScreen = rerouter.screen.isSameColor(okBtn);
        }

        // reward bonus player popup
        Utils.sleep(CONSTANTS.sleepMedium);
        rerouter.screen.tap({ x: 322, y: 309 }); // click next
        Utils.sleep(CONSTANTS.sleepMedium);
      }),
    });

    // game over
    rerouter.addRoute({
      path: `/${PAGE.gameResult.name}`,
      match: PAGE.gameResult,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        switch (context.task.name) {
          case TASK.playBattleGame:
          case TASK.playLeagueGame:
            console.log('complete a game');
            finishRound();
            EventSender.running();
            break;
          default:
            break;
        }
        rerouter.goNext(PAGE.gameResult);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.gameResultAquired.name}`,
      match: PAGE.gameResultAquired,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.gameResultWorldChampion.name}`,
      match: PAGE.gameResultWorldChampion,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.gameResultOther.name}`,
      match: PAGE.gameResultOther,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        rerouter.screen.tap({ x: 0, y: 0 });
        console.log('tap');
      }),
    });

    // game reward pages
    rerouter.addRoute({
      path: `/${PAGE.gameReward.name}`,
      match: PAGE.gameReward,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueRewardAchievementGrade.name}`,
      match: PAGE.leagueRewardAchievementGrade,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueRewardAchievementGradeBonusPlayer.name}`,
      match: PAGE.leagueRewardAchievementGradeBonusPlayer,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.bestPositionAwardBonusGroup.name}`,
      match: PAGE.bestPositionAwardBonusGroup,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.bonusGrantedByTeamRecord.name}`,
      match: PAGE.bonusGrantedByTeamRecord,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.postSeasonAwardBonus.name}`,
      match: PAGE.postSeasonAwardBonus,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.selectRewardPlayer.name}`,
      match: PAGE.selectRewardPlayer,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('handleSelectRewardPlayer');
        let bestCardRank = -1;
        let bestCardPos = PAGE.selectRewardPlayerBtns[0];

        for (const pos of PAGE.selectRewardPlayerBtns) {
          const rgb = getImageColor(image, pos.x, pos.y);
          const k = rgb.r + '-' + rgb.g + '-' + rgb.b;
          console.log(pos.x, pos.y, k);
          // select if not in basic type
          const rank = PAGE.playerCardColorToRank[k] ?? 5;
          if (rank > bestCardRank) {
            bestCardRank = rank;
            bestCardPos = pos;
          }
        }

        rerouter.screen.tap(bestCardPos);
        console.log('select', bestCardPos.x, bestCardPos.y);
        Utils.sleep(CONSTANTS.sleepShort);
        rerouter.goNext(PAGE.selectRewardPlayer);
        Utils.sleep(CONSTANTS.sleepMedium);
      }),
    });

    // on play pages
    rerouter.addRoute({
      path: `/${PAGE.onQuickPlayGroup.name}`,
      match: PAGE.onQuickPlayGroup,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        console.log('on quick playing');

        if (context.task.name === TASK.playLeagueGame) {
          // success enter game
          this.state.leagueGame.tryEnterGameCnts = 0;
        }
        EventSender.running(true);
        rerouter.goNext(PAGE.onQuickPlayGroup);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.onQuickPlayPause.name}`,
      match: PAGE.onQuickPlayPause,
      action: this.wrapRouteAction('goNext'),
    });
    rerouter.addRoute({
      path: `/${PAGE.onPlayPowerSaveOn.name}`,
      match: PAGE.onPlayPowerSaveOn,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        // this is share between all mode
        let isOnPlayTask = false;
        switch (context.task.name) {
          case TASK.playBattleGame:
          case TASK.playLeagueGame:
            isOnPlayTask = true;
            break;
          default:
            break;
        }

        if (!Config.config.hasCoolFeature || !isOnPlayTask || rerouter.isPageMatch(PAGE.powerSaving)) {
          this.handlePowerSavingPage();
          return;
        }

        const now = Date.now();
        const { lastCheckPowerSaveAt: lastCheckTimeAt, powerSaveColorCount: colorCount } = this.state.leagueGame;
        if (now - lastCheckTimeAt < CONSTANTS.sendRunningEventInterval) {
          return;
        }

        // use time to check whether game is still playing
        const colorCntNow = getColorCountInRange(image, { x: 331, y: 310 }, { x: 403, y: 311 });
        const isSame = isSameColorCount(colorCntNow, colorCount);

        this.state.leagueGame.lastCheckPowerSaveAt = now;
        this.state.leagueGame.powerSaveColorCount = colorCntNow;

        if (!isSame) {
          console.log('game is still playing with power save on');
          EventSender.running();
          return;
        }

        console.log('game is stuck');
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueOnPlayPowerSaveOffGroups.name}`,
      match: PAGE.leagueOnPlayPowerSaveOffGroups,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        // page will be stopped here in any tasks
        // need to handle immediately if match
        for (const pageOrGroup of matched) {
          if (pageOrGroup.name === PAGE.leagueOnPlayPowerSaveOffStopped.name) {
            rerouter.goNext(PAGE.leagueOnPlayPowerSaveOffStopped);
            break;
          }
        }

        if (context.task.name !== TASK.playLeagueGame) {
          // turn off autoplay to return
          rerouter.goBack(PAGE.leagueOnPlayPowerSaveOff);
          Utils.sleep(CONSTANTS.sleepMedium);
          return;
        }

        // success enter game
        this.state.leagueGame.tryEnterGameCnts = 0;

        // TODO: handle quick switch to auto play off if was stopped
        if (Config.config.hasCoolFeature) {
          console.log('turn on power save play');
          rerouter.goNext(PAGE.leagueOnPlayPowerSaveOff);
        }
        rerouter.screen.tap({ x: 0, y: 0 });
        console.log('tap');
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueOnPlayAutoOffGroup.name}`,
      match: PAGE.leagueOnPlayAutoOffGroup,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playLeagueGame) {
          // open pause panel
          keycode('KEYCODE_BACK', 100);
          // rerouter.goBack(PAGE.leagueOnPlayAutoOffGroup);
          return;
        }
        console.log('turn on auto play');
        rerouter.goNext(PAGE.leagueOnPlayAutoOffGroup);
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueOnPlayPause.name}`,
      match: PAGE.leagueOnPlayPause,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        if (context.task.name !== TASK.playLeagueGame) {
          // open pause panel
          rerouter.goBack(PAGE.leagueOnPlayPause);
          return;
        }
        // continue play
        keycode('KEYCODE_BACK', 100);
        console.log('tap back to stay in game');
      }),
    });
    rerouter.addRoute({
      path: `/${PAGE.leagueContinuePlaying.name}`,
      match: PAGE.leagueContinuePlaying,
      action: this.wrapRouteAction('goNext'),
    });

    // ** general pages
    rerouter.addRoute({
      path: `/${PAGE.powerSaving.name}`,
      match: PAGE.powerSaving,
      action: this.wrapRouteAction((context, image, matched, finishRound) => {
        this.handlePowerSavingPage();
      }),
    });
    [PAGE.errorNewUpdateAvailable, PAGE.appIsNotResponding].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: 'goNext',
        afterActionDelay: CONSTANTS.sleepWaitPageLong,
      });
    });

    rerouter.addRoute({
      path: `/${PAGE.unexpectedError.name}`,
      match: PAGE.unexpectedError,
      action: (context, image, matched, finishRound) => {
        switch (context.task.name) {
          case TASK.playLeagueGame:
            if (!Config.config.hasCoolFeature) {
              break;
            }
            // sometimes some unknown reason cannot enter game
            const { tryEnterGameCnts } = this.state.leagueGame;
            console.log('try enter game cnts', tryEnterGameCnts);
            if (tryEnterGameCnts === 3) {
              rerouter.restartApp();
            }
            if (tryEnterGameCnts === 4) {
              // can only resolved by resetting league mode progress
              console.log('handleResetLeagueModeProgress');

              this.state.leagueGame.needResetProgress = true;
              finishRound(true);
            }

            break;
          default:
            break;
        }

        rerouter.goNext(PAGE.unexpectedError);
      },
    });

    [
      PAGE.reviewApp,
      PAGE.promotion1,
      PAGE.promotion2,
      PAGE.promotion3,
      PAGE.rechargePromotion,
      PAGE.teamSupportPackagePromotion,
      PAGE.enterGamePromotion,
      PAGE.event,
      PAGE.ok,
      PAGE.next,
      PAGE.confirmWithYS,
      PAGE.quitApp,
      PAGE.quitApp1,
    ].forEach(p => {
      rerouter.addRoute({
        path: `/${p.name}`,
        match: p,
        action: this.wrapRouteAction('goNext'),
      });
    });
  }

  public handleUnknown() {
    rerouter.addUnknownAction((context, image, finishRound) => {
      // rerouter.getCurrentMatchNames();
      Utils.log(`unknown count ${context.matchTimes}, during ${context.matchDuring}, last matched: ${context.lastMatchedPath}`);
      const isInApp = rerouter.checkInApp();
      if (!isInApp) {
        console.log('not in app');
        if (Config.config.hasCoolFeature) {
          rerouter.restartApp();
        }
        return;
      }

      switch (context.lastMatchedPath.substring(1)) {
        case PAGE.adReward.name:
          return this.handleCloseAd();
        default:
          break;
      }
      if (this.state.isWaitingLogin) {
        console.log('wait user input');
        return;
      }

      rerouter.screen.tap({ x: 0, y: 0 });
      console.log('tap');

      if (context.matchTimes % 11 === 0) {
        keycode('KEYCODE_BACK', 100);
        Utils.log('keycode back for unknown');
      }
      if (context.matchDuring > CONSTANTS.minuteInMs * 30) {
        console.log('stuck in unknown page more than 30 min');
        Config.config.hasCoolFeature && rerouter.restartApp();
      }
    });
  }

  public handleCloseAd() {
    console.log('try close ad');
    keycode('BACK', 100);
    console.log('key code back');
    Utils.sleep(CONSTANTS.sleepMedium);
    if (rerouter.getCurrentMatchNames().length !== 0) {
      return;
    }

    // try tap close btn
    for (const closeBtn of [
      // right
      { x: 622, y: 19 },

      // left
      { x: 8, y: 15 },
    ]) {
      rerouter.screen.tap(closeBtn);
      Utils.sleep(CONSTANTS.sleepShort);
    }
  }
  public handlePowerSavingPage() {
    console.log('handlePowerSavingPage');
    rerouter.screen.tapDown({ x: 100, y: 180 });
    Utils.sleep(CONSTANTS.sleepMedium);
    rerouter.screen.moveTo({ x: 500, y: 180 });
    Utils.sleep(CONSTANTS.sleepMedium);
    rerouter.screen.tapUp({ x: 500, y: 180 });
    Utils.sleep(CONSTANTS.sleepMedium);
  }

  public wrapRouteAction(action: RouteConfig['action']): RouteConfig['action'] {
    if (!Config.config.isCloud) {
      return action;
    }

    return (context, image, matched, finishRound) => {
      console.log('wrapRouteAction', context.task.name, matched[0].name);
      if (typeof action === 'function') {
        action(context, image, matched, finishRound);
      }
      if (action === 'goNext') {
        rerouter.goNext(matched[0]);
      }
      if (action === 'goBack') {
        rerouter.goBack(matched[0]);
      }

      // upload session if needed
      this.handleImplementUploadSession();
    };
  }

  public handleImplementUploadSession() {
    // only upload session when is playing
    if (!Config.config.isCloud || !this.state.hasSession) {
      return;
    }

    const now = Date.now();
    if (now - this.state.lastUploadSession < CONSTANTS.uploadSessionInterval) {
      return;
    }

    this.state.lastUploadSession = now;
    console.log('upload session');
    Session.uploadSession();
  }
}

// * =========== entry point ===========
let mlb9i: MLB9I | undefined;
export function start(jsonConfig: any) {
  mlb9i = new MLB9I(jsonConfig);
  mlb9i.start();
}
export function stop() {
  if (mlb9i === undefined) {
    return;
  }
  mlb9i.stop();
  mlb9i = undefined;
}

// ! following is only for dev
// function run() {
//   const mlb = new MLB9I(defaultConfig);
//   mlb.start();
// }

// run();

declare global {
  interface Window {}
}
(window as any).start = start;
(window as any).stop = stop;
