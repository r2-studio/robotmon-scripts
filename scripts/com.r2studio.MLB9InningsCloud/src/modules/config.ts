import { ScriptConfig } from '../types';
import { defaultConfig } from '../defaultConfig';

export let config: ScriptConfig = defaultConfig;

export function set(jsonConfig: any) {
  if (typeof jsonConfig === 'string') {
    const c = JSON.parse(jsonConfig);
    config.leagueSeasonMode = c.leagueSeasonMode ?? config.leagueSeasonMode;
    config.leagueYear = c.leagueYear ?? config.leagueYear;

    config.xrobotmonS3Key = c.xrobotmonS3Key ?? config.xrobotmonS3Key;
    config.xrobotmonS3Token = c.xrobotmonS3Token ?? config.xrobotmonS3Token;
    config.amazonawsS3Key = c.amazonawsS3Key ?? config.amazonawsS3Key;
    config.amazonawsS3Token = c.amazonawsS3Token ?? config.amazonawsS3Token;
    config.licenseId = c.licenseId ?? config.licenseId;
  }
  config.hasCoolFeature = config.hasCoolFeature || config.isCloud || config.isLocalPaid;
}
