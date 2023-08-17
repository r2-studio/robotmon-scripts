import { Page, Utils, rerouter } from 'Rerouter';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { TASKS } from '../tasks';
import { saveImageToDisk } from '../helper';
import { config } from '../scriptConfig';
import * as CONSTANTS from '../constants';
import * as ICONS from '../icons';
import { assign, findSpecificIconInScreen, passiveAddRoute } from '../helper';

const rfpageInGuildLand = new Page('rfpageInGuildLand', [
  { x: 445, y: 329, r: 74, g: 61, b: 154 },
  { x: 212, y: 329, r: 173, g: 150, b: 198 },
  { x: 163, y: 327, r: 107, g: 32, b: 49 },
  { x: 144, y: 326, r: 231, g: 207, b: 214 },
  { x: 107, y: 324, r: 225, g: 213, b: 198 },
  { x: 41, y: 303, r: 217, g: 146, b: 99 },
  { x: 19, y: 267, r: 206, g: 195, b: 247 },
]);
const rfpageInputGuildWelcomeText = new Page(
  'rfpageInputGuildWelcomeText',
  [
    { x: 434, y: 105, r: 57, g: 166, b: 231 },
    { x: 420, y: 107, r: 57, g: 69, b: 107 },
    { x: 439, y: 209, r: 247, g: 235, b: 222 },
    { x: 438, y: 235, r: 222, g: 207, b: 198 },
    { x: 358, y: 240, r: 123, g: 207, b: 8 },
    { x: 28, y: 272, r: 86, g: 86, b: 89 },
    { x: 26, y: 321, r: 76, g: 76, b: 76 },
    { x: 160, y: 326, r: 25, g: 3, b: 9 },
  ],
  { x: 434, y: 105 }
);
const rfpageInGuildBeacon = new Page(
  'rfpageInGuildBeacon',
  [
    { x: 519, y: 317, r: 123, g: 207, b: 8 },
    { x: 393, y: 86, r: 255, g: 209, b: 0 },
    { x: 302, y: 82, r: 223, g: 223, b: 223 },
    { x: 232, y: 291, r: 68, g: 58, b: 103 },
    { x: 207, y: 161, r: 246, g: 238, b: 246 },
    { x: 99, y: 105, r: 203, g: 209, b: 213 },
    { x: 159, y: 268, r: 220, g: 223, b: 227 },
  ],
  { x: 516, y: 322 }
);
const rfpageGuildBeaconLevelUp = new Page(
  'rfpageGuildBeaconLevelUp',
  [
    { x: 525, y: 320, r: 123, g: 207, b: 8 },
    { x: 608, y: 319, r: 49, g: 60, b: 90 },
    { x: 380, y: 261, r: 107, g: 198, b: 247 },
    { x: 347, y: 290, r: 222, g: 223, b: 231 },
    { x: 391, y: 86, r: 255, g: 211, b: 0 },
    { x: 569, y: 88, r: 74, g: 75, b: 77 },
    { x: 215, y: 279, r: 216, g: 219, b: 223 },
  ],
  { x: 477, y: 321 }
);
const rfPageGuildBeaconIsClear = new Page(
  'rfPageGuildBeaconIsClear',
  [
    { x: 600, y: 25, r: 255, g: 255, b: 255 },
    { x: 365, y: 29, r: 57, g: 69, b: 107 },
    { x: 391, y: 85, r: 255, g: 211, b: 0 },
    { x: 435, y: 254, r: 181, g: 178, b: 198 },
    { x: 522, y: 320, r: 120, g: 120, b: 120 },
    { x: 559, y: 326, r: 49, g: 60, b: 90 },
    { x: 511, y: 186, r: 255, g: 255, b: 255 },
  ],
  { x: 600, y: 25 }
);
const rfpageBattleDragon = new Page(
  'rfpageBattleDragon',
  [
    { x: 409, y: 20, r: 255, g: 204, b: 0 },
    { x: 524, y: 20, r: 0, g: 139, b: 255 },
    { x: 317, y: 22, r: 218, g: 227, b: 240 },
    { x: 223, y: 29, r: 192, g: 201, b: 237 },
    { x: 37, y: 103, r: 171, g: 153, b: 220 },
  ],
  { x: 600, y: 25 }
);
const rfpageNoMoreDragonToFight = new Page('rfpageNoMoreDragonToFight', [
  { x: 601, y: 326, r: 160, g: 160, b: 160 },
  { x: 522, y: 13, r: 0, g: 195, b: 255 },
  { x: 408, y: 15, r: 255, g: 239, b: 16 },
  { x: 29, y: 115, r: 181, g: 182, b: 222 },
]);
const rfpageReadyToFightDragon = new Page(
  'rfpageReadyToFightDragon',
  [
    { x: 493, y: 325, r: 134, g: 233, b: 253 },
    { x: 108, y: 335, r: 123, g: 207, b: 8 },
    { x: 323, y: 12, r: 233, g: 156, b: 244 },
    { x: 41, y: 195, r: 251, g: 226, b: 237 },
    { x: 610, y: 194, r: 12, g: 167, b: 223 },
  ],
  { x: 493, y: 325 }
);
const rfpageDragonAddMoreCookie = new Page('rfpageDragonAddMoreCookie', [
  { x: 300, y: 250, r: 8, g: 166, b: 222 },
  { x: 408, y: 250, r: 123, g: 207, b: 8 },
  { x: 419, y: 18, r: 127, g: 95, b: 4 },
  { x: 518, y: 18, r: 20, g: 117, b: 127 },
]);
const rfpageDragonRemainHealth = new Page(
  'rfpageDragonRemainHealth',
  [
    { x: 368, y: 233, r: 132, g: 65, b: 255 },
    { x: 153, y: 334, r: 1, g: 31, b: 41 },
    { x: 79, y: 334, r: 42, g: 15, b: 4 },
  ],
  { x: 572, y: 330 }
);
const rfpageInCookieAlliance = new Page('rfpageInCookieAlliance', [
  { x: 582, y: 334, r: 121, g: 207, b: 12 },
  { x: 552, y: 336, r: 121, g: 207, b: 12 },
  { x: 334, y: 22, r: 176, g: 166, b: 222 },
  { x: 37, y: 143, r: 183, g: 101, b: 26 },
  { x: 27, y: 202, r: 251, g: 207, b: 160 },
  { x: 73, y: 339, r: 12, g: 167, b: 223 },
  { x: 65, y: 92, r: 24, g: 36, b: 77 },
]);
const rfpageNoAllianceTicket = new Page('rfpageNoAllianceTicket', [
  { x: 244, y: 252, r: 49, g: 190, b: 231 },
  { x: 327, y: 77, r: 156, g: 144, b: 217 },
  { x: 317, y: 100, r: 244, g: 235, b: 231 },
  { x: 355, y: 256, r: 0, g: 198, b: 255 },
  { x: 334, y: 22, r: 85, g: 80, b: 109 },
]);
const rfpageNoAllianceTicket2 = new Page('rfpageNoAllianceTicket2', [
  { x: 248, y: 278, r: 12, g: 167, b: 223 },
  { x: 355, y: 282, r: 0, g: 193, b: 255 },
  { x: 318, y: 154, r: 181, g: 169, b: 219 },
  { x: 343, y: 126, r: 52, g: 159, b: 227 },
]);
const rfpageAllianceSteupTeam = new Page('rfpageAllianceSteupTeam', [
  { x: 619, y: 18, r: 255, g: 255, b: 255 },
  { x: 606, y: 90, r: 247, g: 89, b: 24 },
  { x: 603, y: 112, r: 123, g: 207, b: 8 },
  { x: 608, y: 139, r: 0, g: 150, b: 214 },
  { x: 610, y: 168, r: 0, g: 150, b: 214 },
  { x: 507, y: 129, r: 134, g: 17, b: 158 },
]);
const rfpageAllianceBeaconIsOff = new Page('rfpageAllianceBeaconIsOff', [
  { x: 215, y: 198, r: 94, g: 102, b: 153 },
  { x: 202, y: 201, r: 209, g: 226, b: 248 },
  { x: 209, y: 198, r: 99, g: 109, b: 156 },
]);

const rfpageBeaconOfValor = new Page(
  'rfpageBeaconOfValor',
  [
    { x: 223, y: 300, r: 255, g: 187, b: 8 },
    { x: 178, y: 288, r: 49, g: 60, b: 90 },
    { x: 196, y: 177, r: 49, g: 40, b: 8 },
    { x: 182, y: 168, r: 190, g: 192, b: 208 },
    { x: 183, y: 87, r: 247, g: 198, b: 159 },
    { x: 464, y: 22, r: 57, g: 166, b: 231 },
    { x: 487, y: 246, r: 88, g: 104, b: 156 },
  ],
  { x: 223, y: 300 }
);
const rfpageCannotLightBeacon = new Page('rfpageCannotLightBeacon', [
  { x: 436, y: 284, r: 0, g: 134, b: 189 },
  { x: 261, y: 112, r: 114, g: 80, b: 44 },
  { x: 261, y: 226, r: 118, g: 82, b: 50 },
  { x: 250, y: 192, r: 83, g: 87, b: 104 },
  { x: 197, y: 104, r: 107, g: 142, b: 198 },
]);
const rfpageAllianceTimeJump = new Page('rfpageAllianceTimeJump', [
  { x: 358, y: 277, r: 123, g: 207, b: 8 },
  { x: 393, y: 281, r: 189, g: 170, b: 214 },
  { x: 318, y: 32, r: 182, g: 129, b: 37 },
]);
const rfpageAllianceAddMoreCookie = new Page(
  'rfpageAllianceAddMoreCookie',
  [
    { x: 407, y: 250, r: 121, g: 207, b: 12 },
    { x: 297, y: 253, r: 12, g: 167, b: 223 },
    { x: 275, y: 136, r: 110, g: 107, b: 104 },
    { x: 252, y: 135, r: 46, g: 46, b: 46 },
    { x: 335, y: 23, r: 41, g: 41, b: 66 },
    { x: 603, y: 311, r: 26, g: 45, b: 3 },
    { x: 488, y: 328, r: 36, g: 32, b: 7 },
    { x: 37, y: 144, r: 57, g: 22, b: 0 },
    { x: 17, y: 157, r: 50, g: 41, b: 85 },
  ],
  { x: 297, y: 25 }
);
const rfpageLightBeaconReminder = new Page('rfpageLightBeaconReminder', [
  { x: 301, y: 250, r: 8, g: 166, b: 222 },
  { x: 403, y: 248, r: 123, g: 207, b: 8 },
  { x: 333, y: 19, r: 49, g: 38, b: 75 },
  { x: 187, y: 166, r: 104, g: 111, b: 122 },
]);
// A very long text down below saying fight already started, cannot light beacon, need to be closed
const rfpageStartedFightingSoCannotStartBeacon = new Page(
  'rfpageStartedFightingSoCannotStartBeacon',
  [
    { x: 473, y: 23, r: 255, g: 255, b: 255 },
    { x: 191, y: 82, r: 227, g: 165, b: 82 },
    { x: 197, y: 183, r: 219, g: 147, b: 77 },
    { x: 184, y: 185, r: 242, g: 213, b: 49 },
    { x: 179, y: 312, r: 55, g: 62, b: 96 },
  ],
  { x: 473, y: 23 }
);

// Choose the 2nd alliance reward, need to add tap ({x: 620, y: 22}) when not enough tickets
const rfpageAllianceReward = new Page(
  'rfpageAllianceReward',
  [
    { x: 397, y: 243, r: 189, g: 150, b: 82 },
    { x: 257, y: 41, r: 19, g: 29, b: 6 },
    { x: 310, y: 22, r: 29, g: 6, b: 8 },
    { x: 374, y: 46, r: 41, g: 45, b: 45 },
    { x: 422, y: 76, r: 12, g: 31, b: 49 },
    { x: 618, y: 20, r: 255, g: 255, b: 255 },
  ],
  { x: 397, y: 243 }
);
const rfpageAllianceResults = new Page(
  'rfpageAllianceResults',
  [
    { x: 612, y: 333, r: 8, g: 166, b: 222 },
    { x: 259, y: 57, r: 66, g: 136, b: 202 },
    { x: 329, y: 26, r: 222, g: 48, b: 74 },
    { x: 368, y: 49, r: 198, g: 223, b: 222 },
    { x: 76, y: 336, r: 247, g: 89, b: 24 },
    { x: 188, y: 333, r: 8, g: 166, b: 222 },
  ],
  { x: 612, y: 333 }
);
const rfpageAllianceResults2 = new Page(
  'rfpageAllianceResults2',
  [
    { x: 310, y: 29, r: 209, g: 39, b: 60 },
    { x: 317, y: 37, r: 48, g: 83, b: 134 },
    { x: 401, y: 67, r: 35, g: 116, b: 192 },
    { x: 371, y: 62, r: 78, g: 134, b: 140 },
    { x: 25, y: 19, r: 241, g: 242, b: 241 },
    { x: 560, y: 333, r: 8, g: 166, b: 222 },
  ],
  { x: 310, y: 29 }
);
const rfpageCannotRefilAllianceTicketToday = new Page('rfpageCannotRefilAllianceTicketToday', [
  { x: 345, y: 275, r: 121, g: 207, b: 12 },
  { x: 331, y: 129, r: 52, g: 159, b: 227 },
  { x: 306, y: 147, r: 69, g: 52, b: 160 },
  { x: 333, y: 24, r: 126, g: 124, b: 127 },
  { x: 218, y: 74, r: 60, g: 70, b: 105 },
]);
const rfpageSelectStartingTeam = new Page('rfpageSelectStartingTeam', [
  { x: 260, y: 29, r: 140, g: 88, b: 230 },
  { x: 160, y: 63, r: 107, g: 101, b: 222 },
  { x: 399, y: 107, r: 255, g: 200, b: 0 },
  { x: 488, y: 306, r: 0, g: 150, b: 214 },
]);
const rfpageSelectNextTeam = new Page(
  'rfpageSelectNextTeam',
  [
    { x: 256, y: 34, r: 135, g: 87, b: 223 },
    { x: 172, y: 57, r: 49, g: 32, b: 90 },
    { x: 162, y: 70, r: 107, g: 101, b: 219 },
    { x: 163, y: 119, r: 123, g: 117, b: 227 },
  ],
  { x: 256, y: 34 }
);
const rfpageKeepBattleByOrderNotCheckWhenStart = new Page(
  'rfpageKeepBattleByOrderNotCheckWhenStart',
  [
    { x: 145, y: 311, r: 239, g: 235, b: 239 },
    { x: 135, y: 303, r: 30, g: 19, b: 52 },
    { x: 140, y: 274, r: 49, g: 32, b: 90 },
  ],
  { x: 145, y: 311 }
);
const rfpageKeepBattleByOrderNotCheck = new Page(
  'rfpageKeepBattleByOrderNotCheck',
  [
    { x: 146, y: 323, r: 237, g: 233, b: 235 },
    { x: 153, y: 254, r: 49, g: 40, b: 98 },
    { x: 149, y: 270, r: 147, g: 129, b: 235 },
  ],
  { x: 146, y: 323 }
);

let guildBattleDragonStatus = {
  bossIdx: 0,
};
let guildBattleAllianceStatus = {
  needIgniteBeacon: true,
};

export function addGuildRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInGuildLand.name}`,
    match: rfpageInGuildLand,
    action: (context, image, matched, finishRound) => {
      if (context.task.name.substring(0, 5) !== 'guild') {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpageInGuildLand, handle it`);

      switch (context.task.name) {
        case TASKS.guildCheckin:
          rerouter.screen.tap({ x: 315, y: 217 }); // tap center guild level up trophy
          Utils.sleep(2000);
          break;
        case TASKS.guildExpandLand:
          // rerouter.screen.tap({ x: 315, y: 217 });
          // Utils.sleep(2000);
          break;
        case TASKS.guildBattleDragon:
          rerouter.screen.tap({ x: 150, y: 328 }); // tap dragon icon
          Utils.sleep(2000);
          break;
        case TASKS.guildBattleAlliance:
          rerouter.screen.tap({ x: 200, y: 330 }); // tap alliance icon
          Utils.sleep(5000);
          break;
        default:
          // TODO: will fail when resume battle
          console.log('I am rfpageInGuildLand, panic and donno what to do');
          saveImageToDisk();
        // ii++;
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageInGuildBeacon.name}`,
    match: rfpageInGuildBeacon,
    action: (context, image, matched, finishRound) => {
      if (context.task.name === TASKS.guildCheckin) {
        logs(context.task.name, `in rfpageInGuildBeacon, finishRound`);
        rerouter.goNext(rfpageInGuildBeacon);
        sendEventRunning();
        finishRound(true);
      }
      sendKeyBack();
    },
  });
  rerouter.addRoute({
    path: `/${rfPageGuildBeaconIsClear.name}`,
    match: rfPageGuildBeaconIsClear,
    action: (context, image, matched, finishRound) => {
      if (context.task.name === TASKS.guildCheckin) {
        logs(context.task.name, `in rfPageGuildBeaconIsClear, finishRound`);
        rerouter.goNext(rfPageGuildBeaconIsClear);
        sendEventRunning();
        finishRound(true);
      }
      sendKeyBack();
    },
  });
  // Guild dragon
  rerouter.addRoute({
    path: `/${rfpageBattleDragon.name}`,
    match: rfpageBattleDragon,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleDragon) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in ${context.path}, handle it`);

      const guildBossesEntryPoints = [
        { x: 113, y: 202, r: 123, g: 207, b: 8 }, // left
        { x: 312, y: 205, r: 123, g: 207, b: 8 }, // middle
        { x: 505, y: 204, r: 123, g: 207, b: 8 }, // right
      ];

      if (guildBattleDragonStatus.bossIdx >= guildBossesEntryPoints.length) {
        guildBattleDragonStatus.bossIdx = 0;
      }

      logs(context.task.name, `Try to fight boss: ${guildBattleDragonStatus.bossIdx}`);
      let bossEntryPoint: XYRGB = guildBossesEntryPoints[guildBattleDragonStatus.bossIdx];
      rerouter.screen.tap(bossEntryPoint);

      guildBattleDragonStatus.bossIdx++;
      return;
    },
  });
  rerouter.addRoute({
    path: `/${rfpageDragonAddMoreCookie.name}`,
    match: rfpageDragonAddMoreCookie,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleDragon) {
        sendKeyBack();
        return;
      }

      sendKeyBack();
      logs(context.task.name, `rfpageDragonAddMoreCookie, skip and finish round`);
      sendEventRunning();
      finishRound(true);
      return;
    },
  });
  rerouter.addRoute({
    path: `/${rfpageReadyToFightDragon.name}`,
    match: rfpageReadyToFightDragon,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleDragon) {
        sendKeyBack();
        return;
      }

      rerouter.goNext(rfpageReadyToFightDragon);
      Utils.sleep(6000);

      if (rerouter.isPageMatch(rfpageReadyToFightDragon)) {
        logs(context.task.name, `Still in rfpageReadyToFightDragon 6 secs after tapped Battle!, no more dragon ticket, finish round`);
        sendEventRunning();
        finishRound(true);
        return;
      }
    },
  });
  // Guild alliance battle
  rerouter.addRoute({
    path: `/${rfpageStartedFightingSoCannotStartBeacon.name}`,
    match: rfpageStartedFightingSoCannotStartBeacon,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleAlliance) {
        sendKeyBack();
        return;
      }

      rerouter.screen.tap({ x: 372, y: 287 });
      Utils.sleep(2000);

      if (rerouter.isPageMatch(rfpageStartedFightingSoCannotStartBeacon)) {
        logs(context.task.name, `rfpageStartedFightingSoCannotStartBeacon, stop trying to ignite beacon`);
        guildBattleAllianceStatus.needIgniteBeacon = false;
        rerouter.goNext(rfpageStartedFightingSoCannotStartBeacon);
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageInCookieAlliance.name}`,
    match: rfpageInCookieAlliance,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleAlliance) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `start guild alliance battle`);

      if (guildBattleAllianceStatus.needIgniteBeacon && rerouter.isPageMatchImage(rfpageAllianceBeaconIsOff, image)) {
        rerouter.screen.tap({ x: 215, y: 198 });
        return;
      }

      rerouter.screen.tap({ x: 515, y: 324 });
      Utils.sleep(config.sleepAnimate);
    },
  });
  rerouter.addRoute({
    path: `/${rfpageSelectStartingTeam.name}`,
    match: rfpageSelectStartingTeam,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleAlliance) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `found rfpageSelectStartingTeam, tap all from top`);
      rerouter.screen.tap({ x: 470, y: 70 });
      Utils.sleep(config.sleep);
      rerouter.screen.tap({ x: 470, y: 113 });
      Utils.sleep(config.sleep);
      rerouter.screen.tap({ x: 470, y: 165 });
      Utils.sleep(config.sleep);
      rerouter.screen.tap({ x: 470, y: 215 });
      Utils.sleep(config.sleep);
      rerouter.screen.tap({ x: 470, y: 267 });
      Utils.sleep(config.sleep);
      return;
    },
  });
  rerouter.addRoute({
    path: `/${rfpageCannotRefilAllianceTicketToday.name}`,
    match: rfpageCannotRefilAllianceTicketToday,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.guildBattleAlliance) {
        sendKeyBack();
        return;
      }

      logs(context.task.name, `found rfpageCannotRefilAllianceTicketToday, finish round`);
      rerouter.screen.tap({ x: 282, y: 276 });
      sendEventRunning();
      finishRound(true);
    },
  });

  passiveAddRoute([
    rfpageInputGuildWelcomeText,
    rfpageGuildBeaconLevelUp,
    rfpageNoMoreDragonToFight,
    rfpageDragonRemainHealth,
    rfpageAllianceReward,
    rfpageAllianceResults,
    rfpageAllianceResults2,
    rfpageSelectNextTeam,
    rfpageKeepBattleByOrderNotCheckWhenStart,
    rfpageKeepBattleByOrderNotCheck,
  ]);
}

export function addGuildCheckinTask() {
  rerouter.addTask({
    name: TASKS.guildCheckin,
    maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    minRoundInterval: 180 * CONSTANTS.minuteInMs,
    forceStop: true,
  });
}

export function addGuildBattleDragonTask() {
  rerouter.addTask({
    name: TASKS.guildBattleDragon,
    maxTaskDuring: 10 * CONSTANTS.minuteInMs,
    minRoundInterval: 180 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(guildBattleDragonStatus, {
        bossIdx: 0,
      });
    },
  });
}

export function addGuildBattleAllianceTask() {
  rerouter.addTask({
    name: TASKS.guildBattleAlliance,
    maxTaskDuring: 40 * CONSTANTS.minuteInMs,
    minRoundInterval: 180 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(guildBattleAllianceStatus, {
        needIgniteBeacon: true,
      });
    },
  });
}
