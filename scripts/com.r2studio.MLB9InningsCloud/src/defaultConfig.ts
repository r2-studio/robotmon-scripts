import { ScriptConfig } from './types';
import { leagueYearMin } from './constants';

export const defaultConfig: ScriptConfig = {
  isCloud: true,
  isLocalPaid: false,
  leagueSeasonMode: 'full',
  leagueYear: leagueYearMin,
};
