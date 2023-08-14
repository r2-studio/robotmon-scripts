import { GroupPage, Page, Utils, rerouter } from 'Rerouter';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { TASKS } from '../tasks';
import { config } from '../scriptConfig';
import * as CONSTANTS from '../constants';
import * as ICONS from '../icons';
import { findSpecificIconInScreen, passiveAddRoute } from '../helper';

const rfpageInTropicalIsland = new Page('rfpageInTropicalIsland', [
  { x: 38, y: 333, r: 255, g: 97, b: 173 },
  { x: 49, y: 323, r: 239, g: 77, b: 140 },
  { x: 62, y: 341, r: 44, g: 81, b: 118 },
]);
const rfpageReadyToClearRedSword = new Page(
  'rfpageReadyToClearRedSword',
  [
    { x: 531, y: 324, r: 121, g: 207, b: 12 },
    { x: 456, y: 28, r: 241, g: 53, b: 60 },
    { x: 494, y: 23, r: 252, g: 246, b: 216 },
    { x: 572, y: 327, r: 60, g: 70, b: 105 },
  ],
  { x: 531, y: 324 }
);
const rfpageBattleToClearSodaIsland = new Page(
  'rfpageBattleToClearSodaIsland',
  [
    { x: 601, y: 326, r: 121, g: 207, b: 12 },
    { x: 623, y: 313, r: 60, g: 70, b: 105 },
    { x: 573, y: 84, r: 254, g: 253, b: 251 },
    { x: 165, y: 335, r: 121, g: 207, b: 12 },
    { x: 297, y: 83, r: 82, g: 215, b: 0 },
    { x: 426, y: 74, r: 255, g: 36, b: 33 },
  ],
  { x: 601, y: 326 }
);
const rfpageEmptySunbedsListInMiddle = new Page(
  'rfpageEmptySunbedsListInMiddle',
  [
    { x: 217, y: 60, r: 133, g: 231, b: 74 },
    { x: 229, y: 132, r: 44, g: 46, b: 60 },
    { x: 247, y: 52, r: 57, g: 69, b: 107 },
    { x: 226, y: 82, r: 165, g: 60, b: 90 },
    { x: 428, y: 19, r: 2, g: 67, b: 127 },
    { x: 47, y: 328, r: 119, g: 40, b: 67 },
  ],
  { x: 437, y: 57 }
);

let tropicalIslandStatus = {
  iconRedExclamationCount: 0,
};

export function addTropicalIslandTasks() {
    rerouter.addTask({
        name: TASKS.tropicalIslandShip,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
      rerouter.addTask({
        name: TASKS.tropicalIslandSunbed,
        maxTaskDuring: 3 * CONSTANTS.minuteInMs,
        minRoundInterval: config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
      rerouter.addTask({
        name: TASKS.tropicalIslandClearBubble,
        maxTaskDuring: 30 * CONSTANTS.minuteInMs,
        minRoundInterval: config.autoCollectTropicalIslandsIntervalInMins * CONSTANTS.minuteInMs,
        forceStop: true,
      });
}

export function addTropicalIslandRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInTropicalIsland.name}`,
    match: rfpageInTropicalIsland,
    action: (context, image, matched, finishRound) => {
      if (context.task.name.substring(0, 14) !== 'tropicalIsland') {
        sendKeyBack();
        return;
      }

      switch (context.task.name) {
        case TASKS.tropicalIslandShip:
          logs(context.task.name, `in rfpageInTropicalIsland, check the ship status`);
          const rfpageCanClaimResource = new Page(
            'rfpageCanClaimResource',
            [
              { x: 307, y: 333, r: 123, g: 207, b: 8 },
              { x: 363, y: 331, r: 123, g: 207, b: 8 },
              { x: 33, y: 332, r: 255, g: 100, b: 176 },
            ],
            { x: 360, y: 333 }
          );
          if (rerouter.isPageMatchImage(rfpageCanClaimResource, image)) {
            rerouter.goNext(rfpageCanClaimResource);
            logs(context.task.name, `successfully collected island resource`);
          } else {
            logs(context.task.name, `more resources are on the way`);
          }
          finishRound(true);
          sendEventRunning();
          return;

        case TASKS.tropicalIslandSunbed:
          logs(context.task.name, `check sunbed`);
          const rfpageSunbedsWithFinishedCookies = new Page(
            'rfpageSunbedsWithFinishedCookies',
            [
              { x: 52, y: 323, r: 238, g: 68, b: 119 },
              { x: 61, y: 336, r: 44, g: 77, b: 110 },
              { x: 61, y: 303, r: 255, g: 0, b: 0 },
            ],
            { x: 52, y: 323 }
          );
          const rfpageFreeAllCrispyCookie = new Page(
            'rfpageFreeAllCrispyCookie',
            [
              { x: 341, y: 316, r: 123, g: 207, b: 8 },
              { x: 376, y: 313, r: 49, g: 60, b: 90 },
              { x: 223, y: 85, r: 255, g: 101, b: 173 },
            ],
            { x: 341, y: 316 }
          );
          const rfpageHasNoCrispyCookie = new Page('rfpageHasNoCrispyCookie', [
            { x: 425, y: 111, r: 44, g: 46, b: 60 },
            { x: 422, y: 132, r: 44, g: 46, b: 60 },
          ]);

          rerouter.goNext(rfpageSunbedsWithFinishedCookies);

          // Waiting is equired, as the cookie list shows up with a delay
          if (rerouter.waitScreenForMatchingPage(new GroupPage('groupInSunbed', [rfpageFreeAllCrispyCookie, rfpageHasNoCrispyCookie]), 5000)) {
            if (rerouter.isPageMatch(rfpageFreeAllCrispyCookie)) {
              rerouter.goNext(rfpageFreeAllCrispyCookie);
              Utils.sleep(config.sleepAnimate);
              logs(context.task.name, `successfully collect sunbed cookies`);
            }
          } else if (rerouter.isPageMatch(rfpageEmptySunbedsListInMiddle)) {
            logs(context.task.name, `sun bed cookie list is empty`);
            rerouter.goNext(rfpageEmptySunbedsListInMiddle);
          }

          logs(context.task.name, `finish collecting cookies`);
          finishRound(true);
          sendEventRunning();
          return;

        case TASKS.tropicalIslandClearBubble:
          let foundResults;
          let i = 0;
          foundResults = findSpecificIconInScreen(ICONS.iconGreenCheckedWhiteBackground);
          logs(context.task.name, `handle iconGreenCheckedWhiteBackground, found ${Object.keys(foundResults).length} of them`);
          if (Object.keys(foundResults).length > 0) {
            for (i = 0; i < Object.keys(foundResults).length; i++) {
              rerouter.screen.tap(foundResults[i]);
              Utils.sleep(config.sleepAnimate);
            }
          }

          foundResults = findSpecificIconInScreen(ICONS.iconRedExclamation);
          if (tropicalIslandStatus['iconRedExclamationCount'] < Object.keys(foundResults).length) {
            logs(context.task.name, `handle iconRedExclamation, found ${Object.keys(foundResults).length} of them`);
            if (Object.keys(foundResults).length > 0) {
              for (i = 0; i < Object.keys(foundResults).length; i++) {
                rerouter.screen.tap(foundResults[i]);
                Utils.sleep(config.sleepAnimate);
                rerouter.screen.tap(foundResults[i]);
                Utils.sleep(config.sleepAnimate);
                tropicalIslandStatus['iconRedExclamationCount']++;
                return;
              }
            }
          }

          // Clear hammers
          foundResults = findSpecificIconInScreen(ICONS.iconIslandHammer);
          logs(context.task.name, `handle iconIslandHammer, found ${Object.keys(foundResults).length} of them`);
          if (Object.keys(foundResults).length > 0) {
            for (i = 0; i < Object.keys(foundResults).length; i++) {
              rerouter.screen.tap(foundResults[i]);
              Utils.sleep(config.sleepAnimate * 3);
              rerouter.screen.tap({ x: 324, y: 263 }); // Tab build

              if (!rerouter.waitScreenForMatchingPage(rfpageInTropicalIsland, 4000)) {
                logs(context.task.name, `Not enough resource to build island, skipping`);
                sendKeyBack();
                sendKeyBack();
              } else {
                logs(context.task.name, `Build hammer successfully`);
              }
            }
          }

          // Clear battles
          foundResults = findSpecificIconInScreen(ICONS.iconRedSword);
          logs(context.task.name, `handle iconRedSword, found ${Object.keys(foundResults).length} of them`);
          if (Object.keys(foundResults).length > 0) {
            sendEventRunning();
            rerouter.screen.tap({ x: foundResults[i].x + 10, y: foundResults[i].y + 10 });
            return;
          }

          foundResults = findSpecificIconInScreen(ICONS.iconWhiteSword);
          logs(context.task.name, `handle iconWhiteSword, found ${Object.keys(foundResults).length} of them`);
          if (Object.keys(foundResults).length > 0) {
            // rerouter.screen.tap(foundResults[i]);
            rerouter.screen.tap({ x: foundResults[i].x + 10, y: foundResults[i].y + 10 });
            return;
          }

          logs(context.task.name, `Finish tropical island`);
          sendKeyBack();
          sendEventRunning();
          finishRound(true);
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageBattleToClearSodaIsland.name}`,
    match: rfpageBattleToClearSodaIsland,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.tropicalIslandClearBubble) {
        logs(context.task.name, `in rfpageBattleToClearSodaIsland, send back as this is not my task`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpageBattleToClearSodaIsland, start battle`);
      rerouter.goNext(rfpageBattleToClearSodaIsland);
      return;
    },
  });

  passiveAddRoute([rfpageReadyToClearRedSword]);
}
