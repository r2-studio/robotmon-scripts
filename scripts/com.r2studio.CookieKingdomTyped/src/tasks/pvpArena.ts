import { Page, RECT, Utils, XY, rerouter } from 'Rerouter';
import { TASKS } from '../tasks';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { assign, passiveAddRoute, recognizeWishingTreeRequirements, swipeFromToPoint } from '../helper';
import { config } from '../scriptConfig';
import * as CONSTANTS from '../constants';
import * as ICONS from '../icons';
import { globalStorage } from '../storage';

const rfpageInPVPArena = new Page('rfpageInPVPArena', [
  { x: 628, y: 22, r: 55, g: 167, b: 231 },
  { x: 522, y: 18, r: 5, g: 128, b: 254 },
  { x: 458, y: 14, r: 228, g: 148, b: 40 },
  { x: 448, y: 22, r: 120, g: 38, b: 30 },
  { x: 356, y: 20, r: 239, g: 174, b: 20 },
  { x: 180, y: 119, r: 221, g: 128, b: 0 },
  { x: 22, y: 112, r: 232, g: 198, b: 132 },
  { x: 33, y: 115, r: 238, g: 190, b: 120 },
  { x: 24, y: 74, r: 255, g: 226, b: 0 },
]);
const rfpageInPVPMedalShop = new Page('rfpageInPVPMedalShop', [
  { x: 520, y: 23, r: 0, g: 179, b: 255 },
  { x: 449, y: 20, r: 210, g: 160, b: 27 },
  { x: 357, y: 17, r: 235, g: 159, b: 5 },
  { x: 92, y: 63, r: 255, g: 255, b: 255 },
  { x: 4, y: 54, r: 95, g: 91, b: 109 },
  { x: 17, y: 345, r: 28, g: 83, b: 115 },
  { x: 148, y: 315, r: 54, g: 62, b: 95 },
]);
const rfpagePVPNotEnoughMedal = new Page(
  'rfpagePVPNotEnoughMedal',
  [
    { x: 292, y: 248, r: 123, g: 207, b: 8 },
    { x: 320, y: 185, r: 250, g: 210, b: 8 },
    { x: 338, y: 243, r: 123, g: 207, b: 8 },
  ],
  { x: 292, y: 248 }
);
const rfpagePVPArenaReadyToBattlePage = new Page(
  'rfpagePVPArenaReadyToBattlePage',
  [
    { x: 529, y: 14, r: 0, g: 196, b: 255 },
    { x: 449, y: 11, r: 242, g: 208, b: 106 },
    { x: 445, y: 24, r: 243, g: 199, b: 98 },
    { x: 359, y: 14, r: 252, g: 192, b: 32 },
    { x: 507, y: 330, r: 125, g: 69, b: 14 },
    { x: 543, y: 337, r: 121, g: 207, b: 12 },
    { x: 160, y: 334, r: 121, g: 207, b: 12 },
    { x: 76, y: 336, r: 12, g: 167, b: 223 },
    { x: 26, y: 81, r: 240, g: 175, b: 0 },
  ],
  { x: 502, y: 326 }
);
export const rfpagePvPCrystaisRefresh = new Page(
  'rfpagePvPCrystaisRefresh',
  [
    { x: 243, y: 100, r: 57, g: 69, b: 107 },
    { x: 324, y: 78, r: 255, g: 255, b: 255 },
    { x: 443, y: 92, r: 57, g: 166, b: 231 },
    { x: 402, y: 134, r: 247, g: 235, b: 222 },
    { x: 351, y: 250, r: 123, g: 207, b: 8 },
    { x: 408, y: 251, r: 222, g: 207, b: 198 },
  ],
  { x: 436, y: 90 }
);
const rfpagePvPNoArenaTicket = new Page('rfpagePvPNoArenaTicket', [
  { x: 496, y: 27, r: 255, g: 255, b: 255 },
  { x: 484, y: 26, r: 56, g: 167, b: 231 },
  { x: 317, y: 84, r: 243, g: 157, b: 69 },
  { x: 454, y: 161, r: 4, g: 151, b: 211 },
  { x: 457, y: 231, r: 4, g: 151, b: 211 },
  { x: 458, y: 303, r: 219, g: 207, b: 199 },
]);

// TODO: page is wrong
const rfpageBattleTargetCanRefresh = new Page('rfpageBattleTargetCanRefresh', [
  { x: 532, y: 306, r: 12, g: 166, b: 223 },
  { x: 522, y: 304, r: 255, g: 255, b: 255 },
  { x: 541, y: 303, r: 12, g: 166, b: 223 },
  { x: 188, y: 328, r: 56, g: 167, b: 231 },
  { x: 18, y: 323, r: 56, g: 167, b: 231 },
  { x: 35, y: 78, r: 255, g: 221, b: 16 },
  { x: 25, y: 78, r: 255, g: 232, b: 0 },
  { x: 178, y: 118, r: 204, g: 119, b: 17 },
  { x: 28, y: 114, r: 251, g: 235, b: 199 },
  { x: 615, y: 302, r: 12, g: 166, b: 223 },
]);
// TODO: need to add more points as mischeck with kingdom pass ads
// const rfpagePVPPromoted = new Page('rfpagePVPPromoted', [
//   { x: 354, y: 18, r: 43, g: 29, b: 6 },
//   { x: 447, y: 23, r: 28, g: 11, b: 3 },
//   { x: 523, y: 22, r: 11, g: 18, b: 18 },
//   { x: 27, y: 196, r: 42, g: 29, b: 17 },
//   { x: 177, y: 307, r: 22, g: 33, b: 39 },
//   { x: 177, y: 258, r: 19, g: 28, b: 30 },
// ]);

let pvpStatus: {
  [key: number]: {
    battled: boolean;
    xy: {
      x: number;
      y: number;
    };
  };
} = {
  0: {
    battled: false,
    xy: { x: 288, y: 176 },
  },
  1: {
    battled: false,
    xy: { x: 418, y: 176 },
  },
  2: {
    battled: false,
    xy: { x: 548, y: 176 },
  },
  3: {
    battled: false,
    xy: { x: 430, y: 176 },
  },
  4: {
    battled: false,
    xy: { x: 560, y: 176 },
  },
};

export function addPvpArenaRoutes() {
  // TASKS.pvpPurchaseAncientCookie
  rerouter.addRoute({
    path: `/${rfpageInPVPMedalShop.name}`,
    match: rfpageInPVPMedalShop,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, `in rfpageInPVPMedalShop`);
      if (context.task.name !== TASKS.pvpPurchaseAncientCookie) {
        sendKeyBack();
        return;
      }

      // Part of the rfpageInPVPMedalShop page
      const rfpagePVPAncientCookieSoldout = new Page('rfpagePVPAncientCookieSoldout', [
        { x: 86, y: 109, r: 206, g: 20, b: 24 },
        { x: 38, y: 131, r: 206, g: 20, b: 24 },
      ]);
      const rfpagePVPSuperEpicCookieSoldout = new Page('rfpagePVPSuperEpicCookieSoldout', [
        { x: 118, y: 127, r: 220, g: 23, b: 24 },
        { x: 170, y: 112, r: 206, g: 20, b: 24 },
        { x: 164, y: 98, r: 74, g: 76, b: 87 },
      ]);

      if (!rerouter.isPageMatchImage(rfpagePVPAncientCookieSoldout, image)) {
        rerouter.screen.tap({ x: 57, y: 125 });
        Utils.sleep(1000);
        rerouter.screen.tap({ x: 317, y: 245 });
        Utils.sleep(2000);
        logs(context.task.name, `Purchased ancient cookie successfully`);
      } else {
        logs(context.task.name, `ancient cookie already sold out`);
      }

      if (!rerouter.isPageMatchImage(rfpagePVPSuperEpicCookieSoldout, image)) {
        rerouter.screen.tap({ x: 145, y: 125 });
        Utils.sleep(1000);
        rerouter.screen.tap({ x: 317, y: 245 });
        Utils.sleep(2000);
        logs(context.task.name, `Purchased super epic cookie successfully`);
      } else {
        logs(context.task.name, `super epic cookie already sold out`);
      }

      sendKeyBack();
      finishRound(true);
    },
  });
  rerouter.addRoute({
    path: `/${rfpagePVPNotEnoughMedal.name}`,
    match: rfpagePVPNotEnoughMedal,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.pvpPurchaseAncientCookie) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpagePVPNotEnoughMedal, Need more medals, skipping`);
      rerouter.goNext(rfpagePVPNotEnoughMedal);
      finishRound(true);
    },
  });

  // TASKS.pvp
  rerouter.addRoute({
    path: `/${rfpageInPVPArena.name}`,
    match: rfpageInPVPArena,
    action: (context, image, matched, finishRound) => {
      if (context.task.name.substring(0, 3) !== TASKS.pvp) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpageInPVPArena`);

      switch (context.task.name) {
        case TASKS.pvp:
          for (let i in pvpStatus) {
            logs(context.task.name, `rfpageInPVPArena, checking #${i} so tap ${JSON.stringify(pvpStatus[i].xy)} and battled: ${pvpStatus[i].battled}`);
            if (!pvpStatus[i].battled) {
              if (+i > 2) {
                swipeFromToPoint({ x: 600, y: 182 }, { x: 0, y: 182 }, 6);
              }
              globalStorage.botStatus.battleStarted = 0;
              rerouter.screen.tap(pvpStatus[i].xy);
              pvpStatus[i].battled = true;
              Utils.sleep(config.sleepAnimate);
              return;
            }
          }

          if (rerouter.isPageMatch(rfpageBattleTargetCanRefresh)) {
            logs(context.task.name, `Tap PVP refresh`);
            rerouter.screen.tap({ x: 543, y: 303 });
            Utils.sleep(config.sleepAnimate);
            return;
          } else {
            logs(context.task.name, `Cannot tap PVP refresh, job done`);
            sendEventRunning();
            finishRound(true);
            return;
          }

        case TASKS.pvpPurchaseAncientCookie:
          rerouter.screen.tap({ x: 178, y: 118 });
          break;
        default:
          logs(context.task.name, `rfpageInPVPArena, leave because current task is not pvp related, but: ${context.task.name}`);
          sendKeyBack();
          return;
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpagePvPNoArenaTicket.name}`,
    match: rfpagePvPNoArenaTicket,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.pvp) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpagePvPNoArenaTicket, send back and finish task`);
      sendKeyBack();
      sendEventRunning();
      finishRound(true);
    },
  });
  rerouter.addRoute({
    path: `/${rfpagePVPArenaReadyToBattlePage.name}`,
    match: rfpagePVPArenaReadyToBattlePage,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.pvp) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpagePVPArenaReadyToBattlePage, tap it`);

      var ce = getCEs({ x: 496, y: 72, w: 70, h: 16 });
      if (ce < config.autoPvPTargetScoreLimit && ce !== 0) {
        logs(context.task.name, `Battle with ce ${ce}, target limit: ${config.autoPvPTargetScoreLimit}`);
        rerouter.goNext(rfpagePVPArenaReadyToBattlePage); // tap Battle
        if (rerouter.waitScreenForMatchingPage(rfpagePVPArenaReadyToBattlePage, 2000)) {
          return;
        }
      } else {
        logs(context.task.name, `Not to battle with ce ${ce}, target exceed limit: ${config.autoPvPTargetScoreLimit}`);
        sendKeyBack();
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpagePvPCrystaisRefresh.name}`,
    match: rfpagePvPCrystaisRefresh,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, `in rfpagePvPCrystaisRefresh, send back and finish round`);
      sendKeyBack();
      finishRound(true);
    },
  });
}

export function addPvpPurchaseTask() {
  rerouter.addTask({
    name: TASKS.pvpPurchaseAncientCookie,
    maxTaskDuring: 4 * CONSTANTS.minuteInMs,
    minRoundInterval: config.autoPvPIntervalInMins * CONSTANTS.minuteInMs,
    forceStop: true,
  });
}

export function addPvpArenaTask() {
  rerouter.addTask({
    name: TASKS.pvp,
    maxTaskRunTimes: 1,
    maxTaskDuring: 9 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(pvpStatus, {
        0: {
          battled: false,
          xy: { x: 288, y: 176 },
        },
        1: {
          battled: false,
          xy: { x: 418, y: 176 },
        },
        2: {
          battled: false,
          xy: { x: 548, y: 176 },
        },
        3: {
          battled: false,
          xy: { x: 430, y: 176 },
        },
        4: {
          battled: false,
          xy: { x: 560, y: 176 },
        },
      });
    },
  });
}

function getCEs(rect: RECT): number {
  var img = getScreenshot();
  var croppedImage1 = cropImage(img, rect.x, rect.y, rect.w, rect.h);

  var value1 = +recognizeWishingTreeRequirements(ICONS.numberImagesPvP, croppedImage1, 7, 0.75, 0.7) || 0;

  releaseImage(croppedImage1);
  releaseImage(img);
  return value1;
}
