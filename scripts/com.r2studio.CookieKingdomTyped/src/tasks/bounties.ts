import { Page, Utils, rerouter } from 'Rerouter';
import * as PAGES from '../pages';
import * as ICONS from '../icons';
import { TASKS } from '../tasks';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { cookieKingdom } from '../../index';
import { bountyCheckIfGetBluePowder, countBountyLevel, dynamicSort, findSpecificIconInScreen, ocrNumberInRect, passiveAddRoute } from '../helper';
import { BountyInfo } from '../types';
import * as CONSTANTS from '../constants';

const rfpageInBounties = new Page('rfpageInBounties', [
  { x: 591, y: 11, r: 41, g: 16, b: 21 },
  { x: 205, y: 5, r: 126, g: 84, b: 98 },
  { x: 19, y: 21, r: 222, g: 222, b: 222 },
  { x: 81, y: 24, r: 250, g: 250, b: 250 },
  { x: 165, y: 20, r: 92, g: 70, b: 57 },
  { x: 561, y: 336, r: 47, g: 76, b: 109 },
  { x: 515, y: 340, r: 70, g: 48, b: 35 },
  { x: 8, y: 276, r: 217, g: 211, b: 108 },
]);
const rfpageInOneOfTheBounties = new Page('rfpageInOneOfTheBounty', [
  { x: 533, y: 327, r: 121, g: 207, b: 12 },
  { x: 622, y: 329, r: 207, g: 237, b: 255 },
  { x: 614, y: 314, r: 227, g: 155, b: 65 },
  { x: 171, y: 39, r: 174, g: 167, b: 152 },
  { x: 627, y: 305, r: 231, g: 154, b: 66 },
]);
const rfpageReadyToBattleBounty = new Page(
  'rfpageReadyToBattleBounty',
  [
    { x: 612, y: 321, r: 121, g: 207, b: 12 },
    { x: 461, y: 323, r: 255, g: 230, b: 65 },
    { x: 520, y: 19, r: 6, g: 127, b: 254 },
    { x: 407, y: 19, r: 255, g: 209, b: 0 },
    { x: 159, y: 331, r: 121, g: 207, b: 12 },
    { x: 71, y: 329, r: 12, g: 167, b: 223 },
    { x: 60, y: 23, r: 255, g: 255, b: 255 },
    { x: 13, y: 20, r: 95, g: 56, b: 43 },
  ],
  { x: 612, y: 321 }
);
const rfpageNeedRefillBounty = new Page(
  'rfpageNeedRefillBounty',
  [
    { x: 427, y: 82, r: 57, g: 166, b: 231 },
    { x: 317, y: 76, r: 132, g: 130, b: 99 },
    { x: 323, y: 81, r: 115, g: 70, b: 58 },
    { x: 343, y: 92, r: 57, g: 69, b: 107 },
    { x: 309, y: 264, r: 0, g: 195, b: 255 },
  ],
  { x: 427, y: 82 }
);
const rfpageCannotRefillBountyAnymore = new Page(
  'rfpageCannotRefillBountyAnymore',
  [
    { x: 345, y: 244, r: 123, g: 207, b: 8 },
    { x: 192, y: 29, r: 57, g: 59, b: 46 },
    { x: 190, y: 41, r: 49, g: 30, b: 24 },
    { x: 215, y: 14, r: 33, g: 18, b: 23 },
    { x: 189, y: 28, r: 57, g: 58, b: 43 },
    { x: 217, y: 51, r: 115, g: 99, b: 74 },
    { x: 205, y: 55, r: 49, g: 30, b: 24 },
  ],
  { x: 345, y: 244 }
);
const rfpageNeedRefillBounties = new Page(
  'rfpageNeedRefillBounties',
  [
    { x: 428, y: 82, r: 56, g: 167, b: 231 },
    { x: 309, y: 264, r: 0, g: 193, b: 255 },
    { x: 348, y: 254, r: 121, g: 207, b: 12 },
    { x: 318, y: 75, r: 121, g: 126, b: 97 },
    { x: 417, y: 120, r: 243, g: 233, b: 223 },
  ],
  { x: 428, y: 82 }
);
const rfpageNeedRefillBounties2 = new Page(
  'rfpageNeedRefillBounties2',
  [
    { x: 442, y: 82, r: 57, g: 166, b: 239 },
    { x: 345, y: 252, r: 123, g: 207, b: 8 },
    { x: 399, y: 122, r: 247, g: 235, b: 222 },
    { x: 367, y: 83, r: 57, g: 69, b: 107 },
    { x: 334, y: 76, r: 189, g: 178, b: 165 },
    { x: 317, y: 71, r: 115, g: 117, b: 90 },
    { x: 198, y: 62, r: 115, g: 99, b: 74 },
  ],
  { x: 442, y: 82 }
);

export function addBountiesRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInBounties.name}`,
    match: rfpageInBounties,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.bounties) {
        sendKeyBack();
        return;
      }
      logs(context.task.name, `in rfpageInBounties`);

      if (!cookieKingdom.taskStatus[context.task.name]['hasBountiesLeft']) {
        logs(context.task.name, `bounty finished`);
        sendEventRunning(cookieKingdom.botStatus);
        finishRound(true);
      }

      let foundResults = findSpecificIconInScreen(ICONS.iconBountiesGreenEnter);
      foundResults.sort(dynamicSort('x'));

      const bountyCount = Object.keys(foundResults).length > 2 ? 4 : Object.keys(foundResults).length;
      if (bountyCount === 0) {
        logs(context.task.name, `cannot find bounty entry button, skipping task`);
        sendKeyBack();
        finishRound(true);
      }

      cookieKingdom.taskStatus[context.task.name]['bountyCount'] = bountyCount;
      rerouter.screen.tap({ x: foundResults[0].x + 40, y: foundResults[0].y + 10 });
      return;
    },
  });

  rerouter.addRoute({
    path: `/${rfpageInOneOfTheBounties.name}`,
    match: rfpageInOneOfTheBounties,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.bounties) {
        sendKeyBack();
        return;
      }
      if (!cookieKingdom.taskStatus[context.task.name]['hasBountiesLeft']) {
        // logs(context.task.name, `bounty finished, leave this page`);
        sendKeyBack();
      }

      logs(context.task.name, `about to start handleBounties, send running`);
      sendEvent('running', '');
      let i = 0;

      const bountyCount = cookieKingdom.taskStatus[context.task.name]['bountyCount'];
      let bounties: BountyInfo[] = [];
      for (var bountyIdx = 0; bountyIdx < bountyCount; bountyIdx++) {
        // When there are only one bounty (Sunday), it gets all types of powder thus nothing to OCR
        var powder = bountyCount === 1 ? 0 : ocrNumberInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);
        var bountyLevel = bountyCount === 1 ? 12 : countBountyLevel();

        if (bountyCount !== 1 && cookieKingdom.config.autoBountiesCheckBluePowder) {
          var rtn = bountyCheckIfGetBluePowder();
          powder = rtn[0];
          bountyLevel = rtn[1];
        }

        if (powder !== -1) {
          bounties.push({
            index: bountyIdx,
            // entryPnt: bountyEntryPnt,
            powderStock: powder,
            level: bountyLevel,
          });
        }

        rerouter.screen.tap({ x: 435, y: 178 }); // Goto right bounty
        Utils.sleep(1500);
      }

      bounties.sort(dynamicSort('level'));
      // console.log('sorted level bounties: ', JSON.stringify(bounties, ['index', 'level', 'powderStock']));

      bounties = bounties.filter(function (bounty) {
        return bounty.level === bounties[0].level;
      });
      bounties.sort(dynamicSort('powderStock'));
      logs(context.task.name, `rfpageInOneOfTheBounties sorted & filtered level bounties: ${JSON.stringify(bounties, ['index', 'level', 'powderStock'])}`);

      if (bounties.length === 0) {
        logs(context.task.name, `No bounties can be run, skipping, bounties: ${JSON.stringify(bounties)}`);
        sendKeyBack();
        sendEventRunning(cookieKingdom.botStatus);
        finishRound(true);
      }

      var targetBounty = bounties[0];
      for (i = 0; i < bountyCount; i++) {
        if (targetBounty['level'] === 6) {
          rerouter.screen.tap({ x: 40, y: 135 }); // Goto left bounty
          Utils.sleep(cookieKingdom.config.sleepAnimate * 2);
        }
        var gotBountyLevel = countBountyLevel();
        var gotMaterialStock = bountyCount === 1 ? 0 : ocrNumberInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);
        if (gotBountyLevel === targetBounty.level && gotMaterialStock === targetBounty.powderStock) {
          logs(context.task.name, `found it, level, stock: ${gotBountyLevel}, ${gotMaterialStock}`);
          rerouter.screen.tap({ x: 530, y: 330 });
          break;
        } else {
          logs(
            context.task.name,
            `wrong, ${gotBountyLevel}, ${gotMaterialStock}, ${gotBountyLevel === targetBounty.level}, ${gotMaterialStock === targetBounty.powderStock}`
          );
          rerouter.screen.tap({ x: 435, y: 178 });
          Utils.sleep(1500);
        }
      }
    },
  });

  rerouter.addRoute({
    path: `/${rfpageNeedRefillBounty.name}`,
    match: rfpageNeedRefillBounty,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.bounties) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageNeedRefillBounty, cannot battle bounty as no more runs left so finishRound`);
      rerouter.goNext(rfpageNeedRefillBounty);
      sendEventRunning(cookieKingdom.botStatus);
      finishRound(true);
    },
  });

  rerouter.addRoute({
    path: `/${rfpageCannotRefillBountyAnymore.name}`,
    match: rfpageCannotRefillBountyAnymore,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.bounties) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageCannotRefillBountyAnymore, cannot battle bounty as no more runs left so finishRound`);
      rerouter.goNext(rfpageCannotRefillBountyAnymore);
      sendEventRunning(cookieKingdom.botStatus);
      finishRound(true);
    },
  });

  passiveAddRoute([rfpageReadyToBattleBounty, rfpageNeedRefillBounties, rfpageNeedRefillBounties2]);
}

export function addBountiesTask() {
  rerouter.addTask({
    name: TASKS.bounties,
    maxTaskDuring: 15 * CONSTANTS.minuteInMs,
    minRoundInterval: cookieKingdom.config.autoHandleBountiesIntervalInMins * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      cookieKingdom.taskStatus[TASKS.bounties] = {
        hasBountiesLeft: true,
        bountyCount: 0,
      };
    },
  });
}