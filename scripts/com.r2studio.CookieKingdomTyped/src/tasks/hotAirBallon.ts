import { Page, Utils, rerouter } from 'Rerouter';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { TASKS } from '../tasks';
import * as CONSTANTS from '../constants';
import { config } from '../scriptConfig';
import { assign, scrollLeftALot, scrollRightALot } from '../helper';

export const rfpageInHotAirBallon = new Page('rfpageInHotAirBallon', [
  { x: 270, y: 330, r: 255, g: 211, b: 0 },
  { x: 158, y: 331, r: 12, g: 167, b: 223 },
  { x: 184, y: 312, r: 223, g: 175, b: 97 },
  { x: 331, y: 312, r: 142, g: 88, b: 65 },
  { x: 565, y: 84, r: 255, g: 251, b: 235 },
]);
export const rfpageBallonFlyingDock = new Page(
  'rfpageBallonFlyingDock',
  [
    { x: 611, y: 17, r: 57, g: 166, b: 231 },
    { x: 213, y: 15, r: 50, g: 21, b: 37 },
    { x: 250, y: 51, r: 255, g: 255, b: 255 },
    { x: 269, y: 51, r: 217, g: 217, b: 217 },
    { x: 346, y: 50, r: 40, g: 6, b: 21 },
    { x: 129, y: 23, r: 43, g: 6, b: 26 },
    { x: 37, y: 51, r: 6, g: 14, b: 3 },
  ],
  { x: 616, y: 17 }
);
export const rfpageChooseBallonDestination = new Page('rfpageChooseBallonDestination', [
  { x: 285, y: 15, r: 208, g: 161, b: 89 },
  { x: 319, y: 7, r: 91, g: 61, b: 45 },
  { x: 352, y: 18, r: 210, g: 162, b: 89 },
  { x: 616, y: 15, r: 56, g: 165, b: 231 },
]);
export const rfpageBallonMapEp4 = new Page(
  'rfpageBallonMapEp4',
  [
    { x: 611, y: 204, r: 236, g: 228, b: 255 },
    { x: 9, y: 37, r: 56, g: 33, b: 19 },
    { x: 40, y: 120, r: 129, g: 229, b: 81 },
  ],
  { x: 610, y: 230 }
);

let hotAirBallonStatus = {
  changeMapFinished: false,
};

export function addHotAirBallonRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInHotAirBallon.name}`,
    match: rfpageInHotAirBallon,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.hotAirBallon) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, 'rfpageInHotAirBallon, choose next step');
      if (hotAirBallonStatus['changeMapFinished']) {
        rerouter.screen.tap({ x: 258, y: 330 }); // tap Auto
        Utils.sleep(CONSTANTS.sleepAnimate);
        rerouter.screen.tap({ x: 575, y: 330 }); // tap Start
        logs(context.task.name, `rfpageInHotAirBallon, start new ballon trip, ep4: ${config.isHotAirBallonGotoEp4}`);
        finishRound(true);
      } else {
        rerouter.screen.tap({ x: 412, y: 330 }); // tap Change
      }
    },
  });

  rerouter.addRoute({
    path: `/${rfpageBallonFlyingDock.name}`,
    match: rfpageBallonFlyingDock,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.hotAirBallon) {
        rerouter.screen.tap({ x: 616, y: 17 });
        return;
      }

      logs(context.task.name, 'rfpageBallonFlyingDock, ballon is flying, finish task');
      rerouter.goNext(rfpageBallonFlyingDock); // close this screen
      sendEventRunning();
      finishRound(true);
    },
  });

  rerouter.addRoute({
    path: `/${rfpageChooseBallonDestination.name}`,
    match: rfpageChooseBallonDestination,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.hotAirBallon) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageChooseBallonDestination, goto ep4: ${config.isHotAirBallonGotoEp4}`);
      scrollLeftALot({ x: 618, y: 151 });
      if (config.isHotAirBallonGotoEp4 && rerouter.isPageMatchImage(rfpageBallonMapEp4, image)) {
        rerouter.goNext(rfpageBallonMapEp4); // tap EP4 map
        hotAirBallonStatus['changeMapFinished'] = true;
        return;
      } else {
        // scroll to right most and find the last map
        scrollRightALot({ x: 618, y: 151 });
        scrollRightALot({ x: 618, y: 151 });
        scrollRightALot({ x: 618, y: 151 });

        for (let i = 0; i < 4; i++) {
          for (var xLocation = 550; xLocation >= 100; xLocation -= 125) {
            for (var yLocation = 140; yLocation <= 260; yLocation += 120) {
              rerouter.screen.tap({ x: xLocation, y: yLocation });

              if (rerouter.waitScreenForMatchingPage(rfpageInHotAirBallon, 2000)) {
                hotAirBallonStatus['changeMapFinished'] = true;
                logs(context.task.name, `ballon destination choosed successfully, i, x, y = ${i}, ${xLocation}, ${yLocation}`);
                return;
              }
            }
          }

          tapDown(30, 268, 40, 0);
          Utils.sleep(CONSTANTS.sleep);
          moveTo(250, 268, 40, 0);
          Utils.sleep(CONSTANTS.sleep);
          moveTo(620, 268, 40, 0);
          Utils.sleep(CONSTANTS.sleepAnimate);
          tapUp(620, 268, 40, 0);
          Utils.sleep(CONSTANTS.sleepAnimate * 3);
        }
      }
    },
  });
}

export function addHotAirBallonTask() {
  rerouter.addTask({
    name: TASKS.hotAirBallon,
    maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    minRoundInterval: config.autoSendHotAirBallonIntervalInMins * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(hotAirBallonStatus, {
        changeMapFinished: false,
      });
    },
  });
}
