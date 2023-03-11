import _ from 'lodash';
import { DefaultConfigValue, RerouterConfig, RouteConfig, ScreenConfig, TaskConfig, Task, RouteContext, Page, GroupPage, DefaultRerouterConfig, DefaultScreenConfig } from "./struct";
import { Screen } from './screen';
import { Utils } from "./utils";

export class Rerouter {
  public debug: boolean = true;
  public defaultConfig = _.cloneDeep(DefaultConfigValue);
  public rerouterConfig: RerouterConfig = _.cloneDeep(DefaultRerouterConfig);
  public screenConfig: ScreenConfig = _.cloneDeep(DefaultScreenConfig);
  public screen: Screen = new Screen(this.screenConfig);

  private running: boolean = false;
  private routes: Required<RouteConfig>[] = [];
  private tasks: Required<Task>[] = [];
  private routeContext: RouteContext | null = null;
  private unknownRouteAction: ((context: RouteContext, image: Image, finishTask: () => void) => void) | null = null;

  public init(): void {
    // sort routes by priority
    this.routes.sort((a, b) => b.priority - a.priority);
    // check and claculate screen config
    const deviceWH = getScreenSize();
    const max = Math.max(deviceWH.width, deviceWH.height);
    const min = Math.min(deviceWH.width, deviceWH.height);
    const dWitdh = this.screenConfig.rotation === 'horizontal' ? max : min;
    const dHeight = this.screenConfig.rotation === 'vertical' ? max : min;
    this.screenConfig.deviceWidth !== 0 ? this.screenConfig.deviceWidth : dWitdh;
    this.screenConfig.deviceHeight !== 0 ? this.screenConfig.deviceHeight : dHeight;
    this.screenConfig.screenWidth !== 0 ? this.screenConfig.screenWidth : dWitdh;
    this.screenConfig.screenHeight !== 0 ? this.screenConfig.screenHeight : dHeight;
    this.log(`screenWidth: ${this.screenConfig.screenWidth}, screenHeight: ${this.screenConfig.screenHeight}`);
    // new screen if screen config changed
    this.screen = new Screen(this.screenConfig);
  }

  public addRoute(config: RouteConfig): void {
    this.routes.push(this.wrapRouteConfigWithDefault(config));
  }

  public addUnknownAction(action: ((context: RouteContext, image: Image, finishTask: () => void) => void) | null): void {
    this.unknownRouteAction = action;
  }

  public addTask(config: TaskConfig): void {
    this.tasks.push({
      name: config.name,
      config: this.wrapTaskConfigWithDefault(config),
      startTime: 0,
      lastRunTime: 0,
      runTimes: 0,
    });
  }

  public start(packageName: string): void {
    this.rerouterConfig.packageName = packageName;
    // check tasks
    if (this.tasks.length === 0) {
      this.log(`Rerouter start failed, no tasks ...`);
      return;
    }

    this.init();
    this.log(`Rerouter started ...`);
    // task controller
    this.running = true;
    this.startTaskLoop();
    this.log(`Rerouter stopped ...`);
  }

  public stop(): void {
    this.log(`Rerouter stop called, trying to stop task loop`);
    this.running = false;
    if (this.routeContext !== null) {
      this.routeContext.scriptRunning = false;
    }
  }

  private wrapRouteConfigWithDefault(config: RouteConfig): Required<RouteConfig> {
    return {
      path: config.path,
      action: config.action,
      match: config.match ?? null,
      isMatch: config.isMatch ?? null,
      matchGroupOP: config.matchGroupOP ?? this.defaultConfig.RouteConfigMatchGroupOP,
      rotation: config.rotation ?? this.screenConfig.rotation,
      shouldMatchTimes: config.shouldMatchTimes ?? this.defaultConfig.RouteConfigShouldMatchTimes,
      shouldMatchDuring: config.shouldMatchDuring ?? this.defaultConfig.RouteConfigShouldMatchDuring,
      beforeActionDelay: config.beforeActionDelay ?? this.defaultConfig.RouteConfigBeforeActionDelay,
      afterActionDelay: config.afterActionDelay ?? this.defaultConfig.RouteConfigAfterActionDelay,
      priority: config.priority ?? this.defaultConfig.RouteConfigPriority,
      debug: config.debug ?? this.defaultConfig.RouteConfigDebug,
    }
  }

  private wrapTaskConfigWithDefault(config: TaskConfig): Required<TaskConfig> {
    return {
      name: config.name,
      runTimesPerRound: config.runTimesPerRound ?? this.defaultConfig.TaskConfigRunTimesPerRound,
      runDuringPerRound: config.runDuringPerRound ?? this.defaultConfig.TaskConfigRunDuringPerRound,
      minRoundInterval: config.minRoundInterval ?? this.defaultConfig.TaskConfigMinRoundInterval,
      autoStop: config.autoStop ?? this.defaultConfig.TaskConfigAutoStop,
      matchRotation: config.matchRotation ?? this.screenConfig.rotation,
    }
  }

  private startTaskLoop(): void {
    let taskIdx = 0;
    while (this.running) {
      const task = this.tasks[taskIdx % this.tasks.length];
      taskIdx++;

      if (Date.now() - task.lastRunTime <= task.config.minRoundInterval) {
        this.log(`Task: ${task.name} during: ${Date.now() - task.lastRunTime} <= minRoundInterval, skip`);
        Utils.sleep(this.rerouterConfig.taskDelay);
        continue;
      }

      task.startTime = Date.now();
      task.runTimes = 0;
      for (let i = 0; i < task.config.runTimesPerRound && this.running; i++) {
        this.log(`Task: ${task.name} run ${task.runTimes}`);
        this.startRouteLoop(task);
        task.runTimes++;
        task.lastRunTime = Date.now();
        const during = Date.now() - task.startTime;
        if (task.config.runDuringPerRound > 0 && during >= task.config.runDuringPerRound) {
          this.log(`Task: ${task.name} runDuringPerRound: ${during} reached, stop`);
          break;
        }
      }
      Utils.sleep(this.rerouterConfig.taskDelay);
    }
  }

  private startRouteLoop(task: Task): void {
    this.routeContext = {
      task: task,
      screen: this.screen,
      scriptRunning: this.running,
      path: '',
      lastMatchedPath: '',
      matchTimes: 0,
      matchStartTS: 0,
      matchDuring: 0,
    };

    let routeLoop = true;
    const finishTaskFunc = () => {
      this.log(`finishTaskFunc ${this.routeContext?.task.name}`)
      routeLoop = false;
    };
    // pointer for short code
    const context = this.routeContext;
    while (routeLoop && this.running) {
      // check task.autoStop
      const taskRunDuring = Date.now() - task.startTime;
      if (task.config.autoStop && taskRunDuring > task.config.runDuringPerRound) {
        this.log(`Task ${task.name} AutoStop, exceed taskRunDuring`);
        break;
      }

      // check isAppOn or auto launch it
      if (this.rerouterConfig.autoLaunchApp) {
        if (this.checkAndStartApp()) {
          continue;
        }
      }

      const rotation = this.screen.getRotation();
      // check task.matchRotation
      if (task.config.matchRotation !== 'both' && task.config.matchRotation !== rotation) {
        this.log(`Task ${task.name} not matchRotation, stop. currentRotation: ${rotation}`);
        break;
      }

      const image = this.screen.getCvtDevScreenshot();
      const { matchedRoute, matchedPages } = this.findMatchedRouteImpl(task.name, image, rotation);

      context.path = matchedRoute?.path ?? '';
      if (context.path !== context.lastMatchedPath) {
        context.matchTimes = 0;
        context.matchStartTS = Date.now();
      }
      context.lastMatchedPath = matchedRoute?.path ?? '';

      context.matchTimes++;
      context.matchDuring = Date.now() - context.matchStartTS;

      if (matchedRoute === null) {
        if (this.unknownRouteAction !== null) {
          this.unknownRouteAction(context, image, finishTaskFunc);
        }
      } else {
        this.doActionForRoute(context, image, matchedRoute, matchedPages, finishTaskFunc);
      }
      releaseImage(image);
      Utils.sleep(this.rerouterConfig.routeDelay);
    }
  }

  private doActionForRoute(context: RouteContext, image: Image, route: Required<RouteConfig>, matchedPages: Page[], finishTaskFunc: () => void) {
    if (route.debug) {
      Utils.log(`handleMatchedRoute: ${route.path}, times: ${context.matchTimes}, during: ${context.matchDuring}`);
    }
    if (context.matchTimes < route.shouldMatchTimes || context.matchDuring < route.shouldMatchDuring) {
      // should still wait for matching condition
      return;
    }
    const nextXY = matchedPages[0]?.next;
    const backXY = matchedPages[0]?.next;
    // matched and fit condition, do action
    if (route.action === 'goNext') {
      if (nextXY !== undefined) {
        this.screen.tap(nextXY);
      } else {
        this.warning(`${route.path} action == goNext, but no next xy`);
      }
    } else if (route.action === 'goBack') {
      if (backXY !== undefined) {
        this.screen.tap(backXY);
      } else {
        this.warning(`${route.path} action == goBack, but no back xy`);
      }
    } else if (route.action === 'keycodeBack') {
      keycode('BACK', this.screenConfig.actionDuring);
    } else {
      Utils.sleep(route.beforeActionDelay);
      route.action(context, image, matchedPages, finishTaskFunc);
      Utils.sleep(route.afterActionDelay);
    }
  }

  private findMatchedRouteImpl(taskName: string, image: Image, rotation: 'vertical' | 'horizontal'): {
    matchedRoute: Required<RouteConfig> | null,
    matchedPages: Page[]
  } {
    for (const route of this.routes) {
      const { matchedRoute, matchedPages } = this.isMatchRouteImpl(image, rotation, route, taskName);
      if (matchedRoute !== null) {
        return { matchedRoute, matchedPages };
      }
    }
    return { matchedRoute: null, matchedPages: [] };
  }

  private isMatchRouteImpl(image: Image, rotation: 'vertical' | 'horizontal', route: Required<RouteConfig>, taskName: string): {
    matchedRoute: Required<RouteConfig> | null,
    matchedPages: Page[]
  } {
    // check rotation
    if (route.rotation !== rotation) {
      if (route.debug) {
        Utils.log(`findMatchedRoute ${route.path} not match roataion, skip`);
      }
      return { matchedRoute: null, matchedPages: [] };
    }
    let matched = false;
    let matchedPages: Page[] = [];
    // check route.match
    if (route.match !== null) {
      if (route.match instanceof Page) {
        const match = this.isMatchPageImpl(image, route.match, this.defaultConfig.PageThres, route.debug);
        if (match) {
          matched = true;
          matchedPages.push(route.match);
        }
      } else if (route.match instanceof GroupPage) {
        const match = this.isMatchGroupPageImpl(image, route.match, route.matchGroupOP, this.defaultConfig.GroupPageThres, route.debug);
        if (match.length !== 0) {
          matched = true;
          matchedPages.push(...match);
        }
      }
    }
    // check route.isMatch function
    if (!matched && route.isMatch !== null) {
      matched = route.isMatch(taskName, image);
      if (route.debug) {
        Utils.log(`findMatchedRoute ${route.path} isMatch() => ${matched}`);
      }
    }
    if (route.debug) {
      Utils.log(`findMatchedRoute ${route.path} match: ${matched}, firstPage: ${matchedPages[0]?.name}`);
    }
    if (matched) {
      return {
        matchedRoute: route,
        matchedPages: matchedPages,
      };
    }
    return { matchedRoute: null, matchedPages: [] };
  }

  private isMatchPageImpl(image: Image, page: Page, parentThres: number, debug: boolean): boolean {
    const thres = page.thres ?? parentThres;
    let isSame = true;
    for (let i = 0; i < page.points.length; i++) {
      const point = page.points[i];
      const color = getImageColor(image, point.x, point.y);
      const score = Utils.identityColor(point, color);
      if (debug) {
        Utils.log(`checkMatchPage[${i}]: ${page.name}, score: ${score}, thres: ${thres}, match: ${score < thres}`);
        Utils.log(`point[${i}]: {x: ${point.x}, y: ${point.y}, r: ${point.r}, g: ${point.g}, b: ${point.b}}`);
        Utils.log(`color[${i}]: {x: ${point.x}, y: ${point.y}, r: ${color.r}, g: ${color.g}, b: ${color.b}}`);
      }
      if (score < thres) {
        isSame = false;
        break;
      }
    }
    return isSame;
  }

  private isMatchGroupPageImpl(image: Image, groupPage: GroupPage, matchGroupOP: '||' | '&&', parentThres: number, debug: boolean): Page[] {
    const thres = groupPage.thres ?? parentThres;
    for (let i = 0; i < groupPage.pages.length; i++) {
      const page = groupPage.pages[i];
      if (debug) {
        Utils.log(`checkMatchGroupPage: ${groupPage.name}, page[${i}]: ${page.name}`);
      }
      const isPageMatch = this.isMatchPageImpl(image, page, thres, debug);
      if (matchGroupOP === '||' && isPageMatch) {
        return [page];
      }
      if (matchGroupOP === '&&' && !isPageMatch) {
        return [];
      }
    }
    return groupPage.pages;
  }

  public checkAndStartApp(): boolean {
    const [packageName] = Utils.getCurrentApp();
    if (packageName !== this.rerouterConfig.packageName) {
      this.log(`AppIsNotStarted, startApp ${packageName}`);
      Utils.startApp(packageName);
      Utils.sleep(this.rerouterConfig.startAppDelay);
      return true;
    }
    return false;
  }

  private log(...args: any[]): void {
    if (!this.debug) {
      return;
    }
    Utils.log('[Rerouter][debug]', ...args);
  }

  private warning(...args: any[]): void {
    Utils.log('[Rerouter][warning]', ...args);
  }
}

export const rerouter = new Rerouter();