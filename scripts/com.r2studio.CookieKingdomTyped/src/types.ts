export type ScriptConfig = {
  isCloud?: boolean; // hidden setting
  isLocalPaid: boolean;
  hasCoolFeature?: boolean; // = isCloud || isLocalPaid
  leagueSeasonMode: 'full' | 'half' | 'quarter' | 'postSeason';
  leagueYear: number; //gLeagueYearMin
};
