import { rerouter, Page, Utils, GroupPage } from '../src'

var gMainPage = new Page(
  "gMainPage",
  [
    { x: 227, y: 184, r: 228, g: 4, b: 33 },
    { x: 258, y: 187, r: 228, g: 4, b: 33 },
    { x: 278, y: 190, r: 232, g: 48, b: 72 },
    { x: 285, y: 183, r: 254, g: 254, b: 254 },
    { x: 301, y: 172, r: 229, g: 19, b: 46 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gLogoPage = new Page(
  "gLogoPage",
  [
    { x: 227, y: 184, r: 228, g: 4, b: 33 },
    { x: 258, y: 187, r: 228, g: 4, b: 33 },
    { x: 278, y: 190, r: 232, g: 48, b: 72 },
    { x: 285, y: 183, r: 254, g: 254, b: 254 },
    { x: 301, y: 172, r: 229, g: 19, b: 46 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var gAdPage = new Page(
  "gAdPage",
  [
    { x: 227, y: 184, r: 228, g: 4, b: 33 },
    { x: 258, y: 187, r: 228, g: 4, b: 33 },
    { x: 278, y: 190, r: 232, g: 48, b: 72 },
    { x: 285, y: 183, r: 254, g: 254, b: 254 },
    { x: 301, y: 172, r: 229, g: 19, b: 46 },
  ],
  { x: 0, y: 0 },
  { x: 0, y: 0 }
);

var groupPage = new GroupPage('', [gAdPage, gAdPage]);


class CRK {
  public packageName: string = '';
  public account: string = ''
  public password: string = '';

  public init() {
    // change some default config
    rerouter.defaultConfig.TaskConfigAutoStop = true;
    rerouter.rerouterConfig.startAppDelay = 10 * 1000;
    rerouter.rerouterConfig.autoLaunchApp = true;
    rerouter.screenConfig.rotation = 'horizontal';
    rerouter.screenConfig.devHeight = 360;
    rerouter.screenConfig.devWidth = 640;

    // add route
    rerouter.addRoute({
      path: '/main',
      match: gMainPage,
      action: (context, image) => {
        if (context.task.name === 'tree') {
          rerouter.screen.tap({x: 50, y: 100}); // go tree
        } else if (context.task.name === 'pvp') {
          rerouter.screen.tap({x: 50, y: 150}); // go pvp
        } else if (context.task.name === 'tradeA' || context.task.name === 'tradeB' || context.task.name === 'tradeC') {
          rerouter.screen.tap({x: 50, y: 200}); // go trade
        }
      },
    });

     // add route
    rerouter.addRoute({
      path: '/trade',
      match: gMainPage,
      action: (context, image, matched, changeTask) => {
        if (context.task.name === 'tradeA') {
          rerouter.screen.tap({x: 50, y: 100}); // go tree
        } else if (context.task.name === 'tradeB') {
          rerouter.screen.tap({x: 50, y: 150}); // go pvp
        } else if (context.task.name === 'tradeC') {
          rerouter.screen.tap({x: 50, y: 200}); // go trade
          changeTask();
        }
      },
    });

    rerouter.addRoute({
      path: '/logo',
      match: gLogoPage,
      // shouldMatchTimes: 2,
      action: (context, image, matched, finishTask) => {
        Utils.log('now task', context.task.name);
        Utils.log('doLogin', this.password, this.account);
        // will change to next task
        finishTask();
      },
    });

    rerouter.addRoute({
      path: '/ad',
      match: gAdPage,
      action: 'keycodeBack',
    });

    // route do custom match
    rerouter.addRoute({
      path: '/login/mess',
      customMatch: (taskName, image) => {
        if (taskName === 'login') {
          return false;
        }
        for (let i = 0; i < 10; i++) {
          const image2 = rerouter.screen.getCvtDevScreenshot();
          // do some check
          releaseImage(image2);
        }
        // check page
        const rgb = getImageColor(image, 100, 100);
        if (rgb.r === 255 && rgb.g === 255 && rgb.b > 100) {
          return true;
        }
        return false;
      },
      action: () => {
        rerouter.screen.tap({ x: 100, y: 100 });
      },
    });

    // add task
    rerouter.addTask({
      name: 'goToKingdom',
    });
    rerouter.addTask({
      name: 'tsumPlayGame',
      runTimesPerRound: 100,
      runDuringPerRound: 2 * 60 * 60 * 1000,
      forceStop: true, // if exceed runDuringPerRound, auto stop task
    });
    rerouter.addTask({
      name: 'uploadRecord',
      beforeRoute: (task) => {
        // do upload record
        return 'skipRouteLoop';
      },
      minRoundInterval: 60 * 60 * 1000, // 1 hour
    });

    // handle unknown
    this.handleUnknown();
  };

  public start() {
    rerouter.start(this.packageName);
  }

  public stop() {
    rerouter.stop();
  }

  public handleUnknown() {
    rerouter.addUnknownAction((context, image, finishTask) => {
      Utils.log(`unknown count ${context.matchTimes}, during ${context.matchDuring}`);
      if (context.matchDuring > 60 * 1000) {
        rerouter.restartApp();
      }
    });
  }

}

