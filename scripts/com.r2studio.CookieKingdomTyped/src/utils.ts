import { Page, Utils } from 'Rerouter';
import { BotStatus } from './types';
import * as CONSTANTS from './constants';

export function padZero(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function logs(activity: any, message: string) {
  const date = new Date(Utils.getTaiwanTime());
  console.log(
    `[${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}T${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
      date.getSeconds()
    )}], ${activity}, ${message}`
  );
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

export function sendEventRunning() {
  sendEvent('running', '');
}
