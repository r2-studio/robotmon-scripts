import { Page } from 'Rerouter';
import { BotStatus } from './types';
import * as CONSTANTS from './constants';

export function logs(activity: any, message: string) {
  // console.log(
  //     `${new Date().toLocaleString()}, ${activity}, ${Array.prototype.slice.call(arguments, 1).join(',')}`
  // );
  console.log(`${new Date().toLocaleString()}, ${activity}, ${message}`);
}

export function getCurrentApp(): [string, string] {
  let result = execute('dumpsys window windows').split('mCurrentFocus');
  if (result.length < 2) {
    return ['', ''];
  }
  result = result[1].split(' ');
  if (result.length < 3) {
    return ['', ''];
  }
  result[2] = result[2].replace('}', '');
  result = result[2].split('/');

  let packageName = '';
  let activityName = '';

  if (result.length == 1) {
    packageName = result[0].trim();
  } else if (result.length > 1) {
    packageName = result[0].trim();
    activityName = result[1].trim();
  }
  return [packageName, activityName];
}

export function sendKeyBack() {
  console.log('send a back');
  keycode('KEYCODE_BACK', 100);
}

export function sendEventRunning(state: BotStatus) {
  if (state.lastSendRunning - Date.now() < 2 * CONSTANTS.minuteInMs) {
    return;
  }
  sendEvent('running', '');
  state.lastSendRunning = Date.now();
}
