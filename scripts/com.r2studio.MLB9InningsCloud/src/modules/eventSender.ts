import { Utils } from 'rerouter';
import * as CONSTANTS from '../constants';

let lastRunningEvent: number = 0;
let lastSendGameStatusEventAt: number = 0;
let cnt = 0;
enum EventName {
  RUNNING = 'running',
  GAME_STATUS = 'gameStatus',
}
enum GameStatusContent {
  WAIT_FOR_LOGIN_INPUT = 'wait-for-input',
  LOGIN_SUCCEEDED = 'login-succeeded',
  LAUNCHING = 'launching',
  PLAYING = 'playing',
}
const prefix = '[Event]';

export let lastGameStatusEvent: string = '';

export function loginInputing() {
  cnt++;
  console.log(`loginInputing: ${cnt}`);
  const content = GameStatusContent.WAIT_FOR_LOGIN_INPUT;
  return handleSendGameStatusEvent(content);
}

export function loginSuccess() {
  if (lastGameStatusEvent !== GameStatusContent.WAIT_FOR_LOGIN_INPUT) {
    return false;
  }
  const content = GameStatusContent.LOGIN_SUCCEEDED;
  return handleSendGameStatusEvent(content);
}

export function launching() {
  // set to default once app is launched (first and again)
  lastRunningEvent = 0;
  const content = GameStatusContent.LAUNCHING;
  return handleSendGameStatusEvent(content);
}

export function playing() {
  const content = GameStatusContent.PLAYING;
  return handleSendGameStatusEvent(content);
}

export function running(useInterval: boolean = false) {
  const now = Date.now();
  if (useInterval && now - lastRunningEvent < CONSTANTS.sendRunningEventInterval) {
    return;
  }
  lastRunningEvent = now;
  sendEvent(EventName.RUNNING, '');
  console.log(`${prefix} running`);
}

function handleSendGameStatusEvent(content: string): boolean {
  if (lastGameStatusEvent === content) {
    return false;
  }

  // sleep for send 1+ events in a short time
  const diff = Date.now() - lastSendGameStatusEventAt;
  if (diff < CONSTANTS.sleepMedium) {
    Utils.sleep(diff);
  }

  lastGameStatusEvent = content;
  sendEvent(EventName.GAME_STATUS, content);
  console.log(`${prefix} ${content}`);
  lastSendGameStatusEventAt = Date.now();
  return true;
}
