import { Screen } from './screen'

export interface XY {
  x: number;
  y: number;
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
    thres: number | undefined) {
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
  public matchOP?: '||' | '&&';

  public constructor(
    name: string, 
    pages: Page[], 
    next: XY | undefined = undefined, 
    back: XY | undefined = undefined, 
    thres: number | undefined,
    matchOP: '||' | '&&' | undefined = undefined,
  ) {
    this.name = name;
    this.pages = pages;
    this.next = next;
    this.back = back;
    this.thres = thres;
    this.matchOP = matchOP;
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
  action: 'goNext' | 'goBack' | 'keycodeBack' | ((context: RouteContext, image: Image, matched: Page[], finishTask: () => void) => void);
  match?: null | Page | GroupPage;
  isMatch?: null | ((taskName: string, image: Image) => boolean);
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
  runTimesPerRound?: number;
  runDuringPerRound?: number;
  minRoundInterval?: number;
  autoStop?: boolean;
  findRouteDelay?: number;
  beforeRoute?: null | ((task: Task) => undefined | 'skipRouteLoop');
  afterRoute?: null | ((task: Task) => void);
}

export interface Task {
  name: string;
  config: Required<TaskConfig>;
  startTime: number;
  lastRunTime: number;
  runTimes: number;
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
  TaskConfigRunTimesPerRound: number;
  TaskConfigRunDuringPerRound: number;
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
  TaskConfigRunTimesPerRound: 1,
  TaskConfigRunDuringPerRound: 0,
  TaskConfigMinRoundInterval: 0,
  TaskConfigAutoStop: false,
  TaskConfigFindRouteDelay: 2000,
};

export const DefaultRerouterConfig: RerouterConfig = {
  packageName: '',
  taskDelay: 2000,
  startAppDelay: 6000,
  autoLaunchApp: true,
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