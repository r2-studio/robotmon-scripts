import { rerouter as r } from 'Rerouter';
import * as CONSTANTS from '../constants';

r.defaultConfig.TaskConfigAutoStop = true;
r.defaultConfig.RouteConfigDebug = false;

// if not set packageName first, cannot handle start/ stop app
r.rerouterConfig.packageName = CONSTANTS.packageName;
r.rerouterConfig.startAppDelay = 10 * 1000;

r.screenConfig.rotation = 'horizontal';
r.screenConfig.devHeight = 360;
r.screenConfig.devWidth = 640;

r.debug = true;
export let rerouter = r;
