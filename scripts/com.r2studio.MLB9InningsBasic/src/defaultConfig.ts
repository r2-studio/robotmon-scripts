import { ScriptConfig } from './types';
import { leagueYearMin } from './constants';

export const defaultConfig: ScriptConfig = {
  isLocalPaid: false,
  leagueSeasonMode: 'full',
  leagueYear: leagueYearMin,
};
