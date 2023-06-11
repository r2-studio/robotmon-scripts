import { ScriptConfig } from './types';
import { leagueYearMin } from './constants';

export const defaultConfig: ScriptConfig = {
  isLocalPaid: true,
  leagueSeasonMode: 'full',
  leagueYear: leagueYearMin,
};
