import { RECT, XY } from 'Rerouter';

export type ScriptConfig = {
  isCloud?: boolean; // hidden setting
  isLocalPaid: boolean;
  hasCoolFeature?: boolean; // = isCloud || isLocalPaid
  leagueSeasonMode: 'full' | 'half' | 'quarter' | 'postSeason';
  leagueYear: number; //gLeagueYearMin
};

// The state of individual tasks
export interface TaskStatus {
  [key: string]: any;
}

// The state of overall bot
export interface BotStatus {
  [key: string]: any;
}

export enum WishStatus {
  opened = 'opened',
  refresh = 'refresh',
  unknown = 'unknown',
}

export type Wish = {
  id: number;
  refreshPnt: XY;
  unfoldPnt: XY;
  fulfillPnt: XY;
  status: WishStatus;
  requirementIconPnts: { [key: number]: XY };
  failedCount: number;
  requireFulfilled: number;
  golden: boolean;
};

export type Records = {
  opened: number;
  golden: number;
  fulfilled: number;
  notEnoughAndSkip: number;
  goldenAndSkip: number;
};

export type BountyInfo = {
  index: number;
  // entryPnt: XY;
  powderStock: number;
  level: number;
};

export enum Advantures {
  bounties = 'bounties',
  pvp = 'pvp',
  guild = 'guild',
  towerOfSweetChaos = 'towerOfSweetChaos',
  superMayhem = 'superMayhem',
  tropicalIsland = 'tropicalIsland',
  cookieAlliance = 'cookieAlliance',
}

export type Advanture = {
  pnt: XY;
  fromHead: boolean;
  backward: boolean;
};

export const seasideStockRect: { [key: number]: RECT } = {
  0: { x: 66, y: 284, w: 60, h: 17 },
  1: { x: 158, y: 286, w: 60, h: 17 },
  2: { x: 253, y: 286, w: 60, h: 17 },
  3: { x: 346, y: 286, w: 60, h: 17 },
  4: { x: 439, y: 286, w: 60, h: 17 },
};

export const goodsLocationRect: { [key: string | number]: RECT } = {
  1: { x: 431, y: 101, w: 22, h: 12 },
  2: { x: 431, y: 209, w: 22, h: 12 },
  3: { x: 431, y: 315, w: 22, h: 12 },
  4: { x: 431, y: 106, w: 22, h: 12 },
  5: { x: 431, y: 213, w: 22, h: 12 },
  6: { x: 431, y: 319, w: 22, h: 12 },
  shovel: { x: 432, y: 317, w: 22, h: 16 },
};

export type productState = {
  id: number;
  stock: number;
  canProduce: boolean;
  minimumTarget: number;
  productionTarget: number;
  stockTargetFullfilledPercent: number;
  notEnoughStock: boolean;
  need: {
    [key: number]: {
      stock: number;
      consume: number;
    };
  };
};

export const Directions = Object.freeze({
  NE: { x: -480, y: 245 },
  NW: { x: 460, y: 255 },
  SE: { x: -460, y: -255 },
  SW: { x: 480, y: -245 },
  S: { x: 0, y: -250 },
  SS: { x: 0, y: -350 },
  N: { x: 0, y: 250 },
  NN: { x: 0, y: 350 },
  E: { x: -460, y: 0 },
  EE: { x: -560, y: 0 },
  W: { x: 460, y: 0 },
  WW: { x: 560, y: 0 },
});

export const searchHosePaths: { [key: number]: XY[] } = {
  0: [
    Directions.SS,
    Directions.S,
    Directions.EE,
    Directions.N,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.N,
    Directions.W,
    Directions.W,
    Directions.W,
    Directions.W,
  ],
  1: [Directions.EE, Directions.SS, Directions.E, Directions.W, Directions.W, Directions.W, Directions.N, Directions.E, Directions.W, Directions.W],
  2: [Directions.EE, Directions.EE, Directions.SS, Directions.EE, Directions.S, Directions.W, Directions.W, Directions.W, Directions.N],
};
