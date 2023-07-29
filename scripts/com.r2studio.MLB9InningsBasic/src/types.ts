export type ScriptConfig = {
  licenseId?: string;
  xrobotmonS3Key?: string;
  xrobotmonS3Token?: string;
  amazonawsS3Key?: string;
  amazonawsS3Token?: string;

  isCloud?: boolean; // hidden setting
  isLocalPaid: boolean;
  hasCoolFeature?: boolean;
  leagueSeasonMode: 'full' | 'half' | 'quarter' | 'postSeason';
  leagueYear: number; //gLeagueYearMin
};

export enum EventName {
  RUNNING = 'running',
  GAME_STATUS = 'gameStatus',
}

export enum GameStatusContent {
  WAIT_FOR_LOGIN_INPUT = 'wait-for-input',
  LOGIN_SUCCEEDED = 'login-succeeded',
  LAUNCHING = 'launching',
  PLAYING = 'playing',
}
