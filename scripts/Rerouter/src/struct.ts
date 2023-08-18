import { Screen } from './screen';

export interface XY {
  x: number;
  y: number;
}
export interface RECT {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface XYRGB {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  thres?: number;
}

export class Page {
  public name: string;
  public points: XYRGB[];
  public next?: XY;
  public back?: XY;
  public thres?: number;

  public constructor(
    name: string,
    devPoints: XYRGB[],
    next: XY | undefined = undefined,
    back: XY | undefined = undefined,
    thres: number | undefined = undefined
  ) {
    this.name = name;
    this.points = devPoints;
    this.next = next;
    this.back = back;
    this.thres = thres;
  }
}

export class GroupPage {
  public name: string;
  public pages: Page[];
  public next?: XY;
  public back?: XY;
  public thres?: number;
  /**
   * How to match pages, '&&' for match all, '||' for match one
   */
  public matchOP: '||' | '&&';

  public constructor(
    name: string,
    pages: Page[],
    next: XY | undefined = undefined,
    back: XY | undefined = undefined,
    thres: number | undefined = undefined,
    matchOP: '||' | '&&' | undefined = undefined
  ) {
    this.name = name;
    this.pages = pages;
    this.next = next;
    this.back = back;
    this.thres = thres;
    this.matchOP = matchOP || '||';
  }
}

export interface RouteContext {
  task: Task;
  screen: Screen;
  path: string;
  lastMatchedPath: string;
  scriptRunning: boolean;
  matchTimes: number;
  matchStartTS: number;
  matchDuring: number;
}

export interface RouteConfig {
  path: string;
  action: 'goNext' | 'goBack' | 'keycodeBack' | ((context: RouteContext, image: Image, matched: Page[], finishRound: (exitTask?: boolean) => void) => void);
  match?: null | Page | GroupPage;
  // TODO: notMatch?: null | Page | GroupPage;
  customMatch?: null | ((taskName: string, image: Image) => boolean);
  /**
   * One Route should be decided to one rotation, Rerouter will check this with screen rotation
   */
  rotation?: 'vertical' | 'horizontal';
  shouldMatchTimes?: number;
  shouldMatchDuring?: number;
  beforeActionDelay?: number;
  afterActionDelay?: number;
  priority?: number;
  debug?: boolean;
}

export interface TaskConfig {
  name: string;
  maxTaskRunTimes?: number;
  maxTaskDuring?: number;
  minRoundInterval?: number;
  /**
   * If enable it and task run time > maxTaskDuring, Rerouter will stop the task and do next task
   */
  forceStop?: boolean;
  /**
   * Under this task, delay(sleep) time between Rerouter to match routes
   * If task is compact, delay time can be shorter
   * If task is loose, delay time can be longer
   */
  findRouteDelay?: number;
  /**
   * Do something before go into matching route loop, if return 'skipRouteLoop', it will not go into matching route loop
   */
  beforeRoute?: null | ((task: Task) => void | 'skipRouteLoop');
  afterRoute?: null | ((task: Task) => void);
}

export interface Task {
  name: string;
  config: Required<TaskConfig>;
  startTime: number;
  lastRunTime: number;
  runTimes: number; // currentRunTimes
}

export interface ScreenConfig {
  devWidth: number; // developer measure
  devHeight: number; // developer measure
  deviceWidth: number; // runtime detect
  deviceHeight: number; // runtime detect
  screenWidth: number; // developer calculated
  screenHeight: number; // developer calculated
  screenOffsetX: number; // developer calculated
  screenOffsetY: number; // developer calculated
  actionDuring: number; // FPS, should > frame ms
  rotation: 'vertical' | 'horizontal';
}

export interface RerouterConfig {
  packageName: string;
  taskDelay: number;
  startAppDelay: number;
  autoLaunchApp: boolean;
  testingScreenshotPath: string;
}

export const DefaultConfigValue: {
  XYRGBThres: number;
  PageThres: number;
  GroupPageThres: number;
  GroupPageMatchOP: '||' | '&&';
  RouteConfigShouldMatchTimes: number;
  RouteConfigShouldMatchDuring: number;
  RouteConfigBeforeActionDelay: number;
  RouteConfigAfterActionDelay: number;
  RouteConfigPriority: number;
  RouteConfigDebug: boolean;
  TaskConfigMaxTaskRunTimes: number;
  TaskConfigMaxTaskDuring: number;
  TaskConfigMinRoundInterval: number;
  TaskConfigAutoStop: boolean;
  TaskConfigFindRouteDelay: number;
} = {
  XYRGBThres: 0.9,
  PageThres: 0.9,
  GroupPageThres: 0.9,
  GroupPageMatchOP: '||',
  RouteConfigShouldMatchTimes: 1,
  RouteConfigShouldMatchDuring: 0,
  RouteConfigBeforeActionDelay: 250,
  RouteConfigAfterActionDelay: 250,
  RouteConfigPriority: 1,
  RouteConfigDebug: false,
  TaskConfigMaxTaskRunTimes: 1,
  TaskConfigMaxTaskDuring: 0,
  TaskConfigMinRoundInterval: 0,
  TaskConfigAutoStop: false,
  TaskConfigFindRouteDelay: 2000,
};

export const DefaultRerouterConfig: RerouterConfig = {
  packageName: '',
  taskDelay: 2000,
  startAppDelay: 6000,
  autoLaunchApp: true,
  testingScreenshotPath: './screenshot',
};

export const DefaultScreenConfig: ScreenConfig = {
  devWidth: 640,
  devHeight: 360,
  deviceWidth: 0,
  deviceHeight: 0,
  screenWidth: 0,
  screenHeight: 0,
  screenOffsetX: 0,
  screenOffsetY: 0,
  actionDuring: 180,
  rotation: 'horizontal',
};
