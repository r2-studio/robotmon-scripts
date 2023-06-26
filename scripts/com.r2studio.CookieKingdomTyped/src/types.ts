import { XY } from 'Rerouter';

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
