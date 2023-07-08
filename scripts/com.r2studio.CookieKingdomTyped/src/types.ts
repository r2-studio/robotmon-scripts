import { RECT, XY } from 'Rerouter';

export type ScriptConfig = {
  isCloud?: boolean; // hidden setting
  isLocalPaid: boolean;
  hasCoolFeature?: boolean; // = isCloud || isLocalPaid
  leagueSeasonMode: 'full' | 'half' | 'quarter' | 'postSeason';
  leagueYear: number; //gLeagueYearMin
};

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
  0: { x: 75, y: 286, w: 60, h: 17 },
  1: { x: 180, y: 286, w: 60, h: 17 },
  2: { x: 292, y: 286, w: 60, h: 17 },
  3: { x: 400, y: 286, w: 60, h: 17 },
  4: { x: 508, y: 286, w: 60, h: 17 },
};
