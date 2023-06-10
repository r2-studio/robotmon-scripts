import { Rerouter, rerouter, Utils, XYRGB } from 'Rerouter';

import { GlobalPages } from './src/globalPages';
import * as CONSTANTS from './src/constants';
import { TASK } from './src/task';
import { defaultConfig } from './src/config';

class TsumTsum {
  public static VERSION_CODE: number = 1;
  public static PACKAGE_JAPAN: string = 'com.linecorp.LGTMTM';
  public static PACKAGE_GLOBAL: string = 'com.linecorp.LGTMTMG';

  public rerouter: Rerouter;
  public config = defaultConfig;
  public packageName = TsumTsum.PACKAGE_GLOBAL;

  constructor(config: any) {
    console.log(`############ TsumTsum (${TsumTsum.VERSION_CODE}) ############`);
    console.log(JSON.stringify(config));
    this.config = config;

    this.rerouter = rerouter;

    this.rerouter.defaultConfig.TaskConfigAutoStop = true;
    this.rerouter.defaultConfig.RouteConfigDebug = false;

    this.rerouter.rerouterConfig.startAppDelay = 10 * 1000;
    this.rerouter.rerouterConfig.autoLaunchApp = true;

    this.rerouter.screenConfig.rotation = 'vertical';
    this.rerouter.screenConfig.devHeight = 640;
    this.rerouter.screenConfig.devWidth = 360;

    this.rerouter.debug = false;
  }
  public start() {
    this.init();
    this.rerouter.start(this.packageName);
  }
  public stop() {
    this.rerouter.stop();
  }

  public init() {
    this.addBasicTasks();
    this.addRoutes();
    this.handleUnknown();
  }

  public addBasicTasks() {
    this.rerouter.addTask({
      name: TASK.SendHearts,
      // maxTaskRunTimes: 2,
      maxTaskDuring: 30 * CONSTANTS.minuteInMs,
      forceStop: false,
    });
  }

  public addRoutes() {
    this.rerouter.addRoute({
      path: `/${GlobalPages.SelectCountry.name}`,
      match: GlobalPages.SelectCountry,
      action: (context, image, finishRound) => {
        // default is US country
        console.log('SelectCountry');
        this.rerouter.screen.tap({ x: 180, y: 260 }); // selection
        Utils.sleep(CONSTANTS.sleepShort);
        this.rerouter.screen.tap({ x: 300, y: 600 }); // OK
        Utils.sleep(CONSTANTS.sleepShort);
        this.rerouter.goNext(GlobalPages.SelectCountry);
        Utils.sleep(CONSTANTS.sleepMedium);
      },
    });

    // all pages click next
    for (const key in GlobalPages) {
      const pageName = key as keyof typeof GlobalPages;
      const page = GlobalPages[pageName];
      this.rerouter.addRoute({
        path: `/${pageName}`,
        match: page,
        action: (context, image, finishRound) => {
          this.rerouter.goNext(page);
        },
      });
    }
  }

  public handleUnknown() {
    this.rerouter.addUnknownAction((context, image, finishRound) => {
      Utils.log(`unknown count ${context.matchTimes}, during ${context.matchDuring}, last matched: ${context.lastMatchedPath}`);
      if (context.matchTimes % 3 === 0) {
        this.rerouter.screen.tap({ x: 360 - 1, y: 640 - 1 });
      }
    });
  }
}

// * =========== entry point ===========
let tsumtsum: TsumTsum | undefined;
export function start(jsonConfig: any) {
  const config = defaultConfig;
  if (typeof jsonConfig === 'string') {
    jsonConfig = JSON.parse(jsonConfig);
  }
  tsumtsum = new TsumTsum(config);
  tsumtsum.start();
}
export function stop() {
  if (tsumtsum === undefined) {
    return;
  }
  tsumtsum.stop();
  tsumtsum = undefined;
}

declare global {
  interface Window {}
}
(window as any).start = start;
(window as any).stop = stop;
