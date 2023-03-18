import {
  DefaultConfigValue,
  RerouterConfig,
  RouteConfig,
  ScreenConfig,
  TaskConfig,
  Task,
  RouteContext,
  Page,
  GroupPage,
  DefaultRerouterConfig,
  DefaultScreenConfig,
} from './struct';
import { Screen } from './screen';
import { Utils } from './utils';
import { Testing } from './testing';

export class Rerouter {
  public debug: boolean = true;
  public defaultConfig = DefaultConfigValue;
  public rerouterConfig: RerouterConfig = DefaultRerouterConfig;
  public screenConfig: ScreenConfig = DefaultScreenConfig;
  public screen: Screen = new Screen(this.screenConfig);

  private running: boolean = false;
  private routes: Required<RouteConfig>[] = [];
  private tasks: Required<Task>[] = [];
  private routeContext: RouteContext | null = null;
  private unknownRouteAction: ((context: RouteContext, image: Image, finishTask: () => void) => void) | null = null;

  /**
   * Recalculate some value like device width or height in screenConfig
   */
  private init(): void {
    // sort routes by priority
    this.routes.sort((a, b) => b.priority - a.priority);
    // check and calculate screen config
    const deviceWH = getScreenSize();
    const max = Math.max(deviceWH.width, deviceWH.height);
    const min = Math.min(deviceWH.width, deviceWH.height);
    const dWidth = this.screenConfig.rotation === 'horizontal' ? max : min;
    const dHeight = this.screenConfig.rotation === 'vertical' ? max : min;
    this.screenConfig.deviceWidth !== 0 ? this.screenConfig.deviceWidth : dWidth;
    this.screenConfig.deviceHeight !== 0 ? this.screenConfig.deviceHeight : dHeight;
    this.screenConfig.screenWidth !== 0 ? this.screenConfig.screenWidth : dWidth;
    this.screenConfig.screenHeight !== 0 ? this.screenConfig.screenHeight : dHeight;
    this.log(`screenWidth: ${this.screenConfig.screenWidth}, screenHeight: ${this.screenConfig.screenHeight}`);
    // new screen if screen config changed
    this.screen = new Screen(this.screenConfig);
  }

  /**
   * Add RouteConfig to Rerouter routes, after starting Rerouter will run over all RouteConfigs to match screen and do action
   * @param config information about how route match and route action
   */
  public addRoute(config: RouteConfig): void {
    this.routes.push(this.wrapRouteConfigWithDefault(config));
  }

  /**
   * Tell Rerouter what to do if not matching any route
   * @param action function to do if not matching
   */
  public addUnknownAction(action: ((context: RouteContext, image: Image, finishTask: () => void) => void) | null): void {
    this.unknownRouteAction = action;
  }

  /**
   * Add TaskConfig to Rerouter tasks, after starting Rerouter will run over all Tasks by task condition
   * @param config information about how task works
   */
  public addTask(config: TaskConfig): void {
    this.tasks.push({
      name: config.name,
      config: this.wrapTaskConfigWithDefault(config),
      startTime: 0,
      lastRunTime: 0,
      runTimes: 0,
    });
  }

  /**
   * start Rerouter to run over tasks and routes
   * @param packageName
   */
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

  /**
   * stop Rerouter
   */
  public stop(): void {
    this.log(`Rerouter stop called, trying to stop task loop`);
    this.running = false;
    if (this.routeContext !== null) {
      this.routeContext.scriptRunning = false;
    }
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

  public restartApp(): void {
    Utils.stopApp(this.rerouterConfig.packageName);
    Utils.sleep(1000);
    Utils.startApp(this.rerouterConfig.packageName);
    Utils.sleep(this.rerouterConfig.startAppDelay);
  }

  public goNext(page: Page | GroupPage): void {
    if (page.next !== undefined) {
      this.screen.tap(page.next);
    } else {
      this.warning(`${page.name} action == goNext, but no next xy`);
    }
  }

  public goBack(page: Page | GroupPage): void {
    if (page.back !== undefined) {
      this.screen.tap(page.back);
    } else {
      this.warning(`${page.name} action == goBack, but no back xy`);
    }
  }

  public isPageMatch(page: Page | GroupPage | string): boolean {
    const image = this.screen.getCvtDevScreenshot();
    const isMatch = this.isPageMatchImage(page, image);
    releaseImage(image);
    return isMatch;
  }

  public isPageMatchImage(page: Page | GroupPage | string, image: Image): boolean {
    if (typeof page === 'string') {
      const p = this.getPageByName(page);
      if (p === null) {
        this.warning(`isPageMatchImage ${page} not exist`);
        return false;
      }
      page = p;
    }
    if (page instanceof Page) {
      return this.isMatchPageImpl(image, page, this.defaultConfig.PageThres, this.debug);
    } else {
      const pages = this.isMatchGroupPageImpl(image, page, this.defaultConfig.GroupPageThres, this.debug);
      return pages.length > 0;
    }
  }

  public waitScreenForMatchingPage(page: Page | GroupPage, timeout: number, matchTimes: number = 1, interval = 600): boolean {
    return Utils.waitForAction(() => this.isPageMatch(page), timeout, matchTimes, interval);
  }

  public isRouteMatch(route: RouteConfig | string): boolean {
    const image = this.screen.getCvtDevScreenshot();
    const isMatch = this.isRouteMatchImage(route, image);
    releaseImage(image);
    return isMatch;
  }

  public isRouteMatchImage(route: RouteConfig | string, image: Image): boolean {
    const routeConfig = this.getRouteConfig(route);
    if (routeConfig === null) {
      this.warning(`isRouteMatchImage ${route} not exist`);
      return false;
    }
    const filledRouteConfig = this.wrapRouteConfigWithDefault(routeConfig);
    const rotation = this.screen.getImageRotation(image);
    const { isMatched } = this.isMatchRouteImpl(image, rotation, filledRouteConfig, 'waitScreenForMatchingRoute');
    if (isMatched) {
      return true;
    }
    return false;
  }

  public waitScreenForMatchingRoute(route: RouteConfig | string, timeout: number, matchTimes: number = 1, interval = 600): boolean {
    return Utils.waitForAction(() => this.isRouteMatch(route), timeout, matchTimes, interval);
  }

  public getPageByName(name: string): Page | GroupPage | null {
    for (const route of this.routes) {
      if (name === route.match?.name) {
        return route.match;
      }
    }
    return null;
  }

  public getRouteConfigByPath(path: string): RouteConfig | null {
    for (const route of this.routes) {
      if (path === route.path) {
        return route;
      }
    }
    return null;
  }

  private getRouteConfig(r: RouteConfig | string): RouteConfig | null {
    let route: RouteConfig | null;
    if (typeof r === 'string') {
      route = this.getRouteConfigByPath(r);
    } else {
      route = r;
    }
    return route;
  }

  private wrapRouteConfigWithDefault(config: RouteConfig): Required<RouteConfig> {
    return {
      path: config.path,
      action: config.action,
      match: config.match ?? null,
      customMatch: config.customMatch ?? null,
      rotation: config.rotation ?? this.screenConfig.rotation,
      shouldMatchTimes: config.shouldMatchTimes ?? this.defaultConfig.RouteConfigShouldMatchTimes,
      shouldMatchDuring: config.shouldMatchDuring ?? this.defaultConfig.RouteConfigShouldMatchDuring,
      beforeActionDelay: config.beforeActionDelay ?? this.defaultConfig.RouteConfigBeforeActionDelay,
      afterActionDelay: config.afterActionDelay ?? this.defaultConfig.RouteConfigAfterActionDelay,
      priority: config.priority ?? this.defaultConfig.RouteConfigPriority,
      debug: config.debug ?? this.defaultConfig.RouteConfigDebug,
    };
  }

  private wrapTaskConfigWithDefault(config: TaskConfig): Required<TaskConfig> {
    return {
      name: config.name,
      runTimesPerRound: config.runTimesPerRound ?? this.defaultConfig.TaskConfigRunTimesPerRound,
      runDuringPerRound: config.runDuringPerRound ?? this.defaultConfig.TaskConfigRunDuringPerRound,
      minRoundInterval: config.minRoundInterval ?? this.defaultConfig.TaskConfigMinRoundInterval,
      forceStop: config.forceStop ?? this.defaultConfig.TaskConfigAutoStop,
      findRouteDelay: config.findRouteDelay ?? this.defaultConfig.TaskConfigFindRouteDelay,
      beforeRoute: config.beforeRoute ?? null,
      afterRoute: config.afterRoute ?? null,
    };
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
        let skipRoute = false;
        if (task.config.beforeRoute !== null) {
          this.log(`Task: ${task.name} run ${task.runTimes} do beforeRoute()`);
          if (task.config.beforeRoute(task) === 'skipRouteLoop') {
            skipRoute = true;
          }
        }

        if (skipRoute) {
          this.log(`Task: ${task.name} run ${task.runTimes} skipRouteLoop`);
        } else {
          this.startRouteLoop(task);
        }

        if (task.config.afterRoute !== null) {
          this.log(`Task: ${task.name} run ${task.runTimes} do afterRoute()`);
          task.config.afterRoute(task);
        }

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
      this.log(`finishTaskFunc ${this.routeContext?.task.name}`);
      routeLoop = false;
    };
    // pointer for short code
    const context = this.routeContext;
    while (routeLoop && this.running) {
      // check task.autoStop
      const taskRunDuring = Date.now() - task.startTime;
      if (task.config.forceStop && taskRunDuring > task.config.runDuringPerRound) {
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
      Utils.sleep(task.config.findRouteDelay);
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
    const backXY = matchedPages[0]?.back;
    // matched and fit condition, do action
    Utils.sleep(route.beforeActionDelay);
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
      route.action(context, image, matchedPages, finishTaskFunc);
    }
    Utils.sleep(route.afterActionDelay);
  }

  private findMatchedRouteImpl(
    taskName: string,
    image: Image,
    rotation: 'vertical' | 'horizontal'
  ): {
    matchedRoute: Required<RouteConfig> | null;
    matchedPages: Page[];
  } {
    for (const route of this.routes) {
      const { isMatched, matchedPages } = this.isMatchRouteImpl(image, rotation, route, taskName);
      if (isMatched) {
        return { matchedRoute: route, matchedPages };
      }
    }
    return { matchedRoute: null, matchedPages: [] };
  }

  private isMatchRouteImpl(
    image: Image,
    rotation: 'vertical' | 'horizontal',
    route: Required<RouteConfig>,
    taskName: string
  ): {
    isMatched: boolean;
    matchedPages: Page[];
  } {
    // check rotation
    if (route.rotation !== rotation) {
      if (route.debug) {
        Utils.log(`findMatchedRoute ${route.path} not match rotation, skip`);
      }
      return { isMatched: false, matchedPages: [] };
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
        const match = this.isMatchGroupPageImpl(image, route.match, this.defaultConfig.GroupPageThres, route.debug);
        if (match.length !== 0) {
          matched = true;
          matchedPages.push(...match);
        }
      }
    }
    // check route.isMatch function
    if (!matched && route.customMatch !== null) {
      matched = route.customMatch(taskName, image);
      if (route.debug) {
        Utils.log(`findMatchedRoute ${route.path} isMatch() => ${matched}`);
      }
    }
    if (route.debug) {
      Utils.log(`findMatchedRoute ${route.path} match: ${matched}, firstPage: ${matchedPages[0]?.name}`);
    }
    if (matched) {
      return {
        isMatched: true,
        matchedPages: matchedPages,
      };
    }
    return { isMatched: false, matchedPages: [] };
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

  private isMatchGroupPageImpl(image: Image, groupPage: GroupPage, parentThres: number, debug: boolean): Page[] {
    const thres = groupPage.thres ?? parentThres;
    for (let i = 0; i < groupPage.pages.length; i++) {
      const page = groupPage.pages[i];
      if (debug) {
        Utils.log(`checkMatchGroupPage: ${groupPage.name}, page[${i}]: ${page.name}`);
      }
      const isPageMatch = this.isMatchPageImpl(image, page, thres, debug);
      if (groupPage.matchOP === '||' && isPageMatch) {
        return [page];
      }
      if (groupPage.matchOP === '&&' && !isPageMatch) {
        return [];
      }
    }
    return groupPage.pages;
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

  public async testRoutes() {
    const testing = new Testing(DefaultRerouterConfig.testingScreenshotPath);
    await testing.init();
    await testing.checkImageMatchDuplicatePages(this.routes);
    await testing.checkRoutesMatchImages(this.routes);
  }
}

export const rerouter = new Rerouter();
