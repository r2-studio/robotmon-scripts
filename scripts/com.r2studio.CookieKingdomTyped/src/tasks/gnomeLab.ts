import { GroupPage, Page, Utils, rerouter } from 'Rerouter';
import { TASKS } from '../tasks';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import * as CONSTANTS from '../constants';
import * as ICONS from '../icons';
import { config } from '../scriptConfig';
import { assign, findSpecificIconInScreen, swipeFromToPoint } from '../helper';
import { Icon } from '../types';

// Gnome lab
export const rfpageInGnomeLab = new Page('rfpageInGnomeLab', [
  { x: 15, y: 11, r: 211, g: 9, b: 35 },
  { x: 25, y: 21, r: 255, g: 223, b: 244 },
  { x: 328, y: 15, r: 169, g: 8, b: 36 },
  { x: 308, y: 28, r: 16, g: 12, b: 8 },
]);
export const rfpageCanTapResearch = new Page(
  'rfpageCanTapResearch',
  [
    { x: 276, y: 318, r: 121, g: 207, b: 12 },
    { x: 220, y: 317, r: 54, g: 62, b: 95 },
    { x: 398, y: 315, r: 54, g: 62, b: 95 },
  ],
  { x: 276, y: 318 }
);
export const rfpageResearchComplete = new Page(
  'rfpageResearchComplete',
  [
    { x: 432, y: 62, r: 24, g: 81, b: 115 },
    { x: 326, y: 14, r: 93, g: 4, b: 16 },
    { x: 407, y: 20, r: 104, g: 77, b: 0 },
    { x: 419, y: 260, r: 215, g: 241, b: 157 },
    { x: 425, y: 102, r: 247, g: 235, b: 222 },
    { x: 354, y: 200, r: 255, g: 243, b: 0 },
  ],
  { x: 432, y: 62 }
);
export const rfpageNotEnoughAuroraItemForReserch = new Page(
  'rfpageNotEnoughAuroraItemForReserch',
  [
    { x: 434, y: 96, r: 255, g: 255, b: 255 },
    { x: 22, y: 21, r: 127, g: 108, b: 122 },
    { x: 13, y: 11, r: 95, g: 1, b: 17 },
    { x: 4, y: 16, r: 7, g: 0, b: 0 },
    { x: 292, y: 235, r: 189, g: 85, b: 247 },
    { x: 350, y: 251, r: 0, g: 182, b: 255 },
  ],
  { x: 434, y: 96 }
);
// Tools, etc
export const rfpageNotEnoughItemsForResearch = new Page('rfpageNotEnoughItemsForResearch', [
  { x: 435, y: 95, r: 255, g: 255, b: 255 },
  { x: 303, y: 250, r: 8, g: 125, b: 255 },
  { x: 287, y: 247, r: 123, g: 207, b: 16 },
  { x: 261, y: 245, r: 222, g: 207, b: 198 },
  { x: 305, y: 100, r: 57, g: 69, b: 107 },
  { x: 22, y: 20, r: 127, g: 102, b: 122 },
]);

let gnomeLabStatus = {
  kingdomSearchCount: 0,
  cookieSearchCount: 0,
  searchLimit: 12,
  targetImageIndex: 0,
  needResearchKingdom: config.autoResearchKingdom,
  needResearchCookie: config.autoResearchCookies,
};

export function addGnomeLabRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInGnomeLab.name}`,
    match: rfpageInGnomeLab,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.gnomeLab) {
        logs(context.task.name, `rfpageInGnomeLab, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      const rfpageAlreadyResearching = new Page('rfpageAlreadyResearching', [
        { x: 47, y: 69, r: 237, g: 237, b: 229 },
        { x: 159, y: 67, r: 117, g: 223, b: 0 },
      ]);
      if (rerouter.isPageMatchImage(rfpageAlreadyResearching, image)) {
        logs(context.task.name, `rfpageInGnomeLab, Already researching, skipping handleInGnomeLab`);
        sendKeyBack();
        sendEventRunning();
        finishRound(true);
        return;
      }

      logs(context.task.name, `rfpageInGnomeLab, handleInGnomeLab in gnome lab, send running`);
      sendEvent('running', '');

      logs(
        context.task.name,
        `rfpageInGnomeLab, kingdomSearchCount: ${gnomeLabStatus.kingdomSearchCount}, targetImageInde: ${gnomeLabStatus.targetImageIndex}`
      );

      // TODO： 極光產品檢查還沒做
      if (config.autoResearchKingdom) {
        rerouter.screen.tap({ x: 200, y: 340 });
        handleResearchInGnomeLab(finishRound, ICONS.iconsGnomeLabKingdom, 0.94);
      }
      if (config.autoResearchCookies) {
        rerouter.screen.tap({ x: 310, y: 340 });
        handleResearchInGnomeLab(finishRound, ICONS.iconsGnomeLabCookies, 0.9);
      }

      return;
    },
  });
  rerouter.addRoute({
    path: `/${rfpageCanTapResearch.name}`,
    match: rfpageCanTapResearch,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.gnomeLab) {
        logs(context.task.name, `rfpageCanTapResearch, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageCanTapResearch, start researching and finishRound`);
      rerouter.goNext(rfpageCanTapResearch);

      if (rerouter.waitScreenForMatchingPage(rfpageNotEnoughAuroraItemForReserch, 2000)) {
        logs(context.task.name, `rfpageNotEnoughAuroraItemForReserch, cannot research this one`);
        sendKeyBack();
        Utils.sleep(config.sleep);
        sendKeyBack();
      } else {
        logs(context.task.name, `start researching and finish round`);
        sendKeyBack();
        sendEventRunning();
        finishRound(true);
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageNotEnoughAuroraItemForReserch.name}`,
    match: rfpageNotEnoughAuroraItemForReserch,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.gnomeLab) {
        logs(context.task.name, `rfpageCanTapResearch, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageNotEnoughAuroraItemForReserch, skip and finishRound`);
      rerouter.goNext(rfpageNotEnoughAuroraItemForReserch);
      sendKeyBack();
      finishRound(true);
    },
  });
  rerouter.addRoute({
    path: `/${rfpageNotEnoughItemsForResearch.name}`,
    match: rfpageNotEnoughItemsForResearch,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.gnomeLab) {
        logs(context.task.name, `rfpageCanTapResearch, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageNotEnoughItemsForResearch, skip and finishRound`);
      rerouter.goNext(rfpageNotEnoughItemsForResearch);
      sendKeyBack();
      finishRound(true);
    },
  });
}

export function addGnomeLabTasks() {
  rerouter.addTask({
    name: TASKS.gnomeLab,
    maxTaskDuring: 15 * CONSTANTS.minuteInMs,
    minRoundInterval: 15 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(gnomeLabStatus, {
        kingdomSearchCount: 0,
        cookieSearchCount: 0,
        searchLimit: 12,
        targetImageIndex: 0,
        needResearchKingdom: config.autoResearchKingdom,
        needResearchCookie: config.autoResearchCookies,
      });
    },
  });
}

function handleResearchInGnomeLab(finishRound: any, targetIconList: Icon[], threashold: number) {
  for (var i = 0; i < 12; i++) {
    for (var imageIdx = 0; imageIdx < targetIconList.length; imageIdx++) {
      let foundResults = findSpecificIconInScreen(targetIconList[imageIdx]);
      console.log('>', i, imageIdx, targetIconList[imageIdx].name, JSON.stringify(foundResults));

      for (let j = 0; j < Object.keys(foundResults).length; j++) {
        rerouter.screen.tap(foundResults[j]);
        if (
          rerouter.waitScreenForMatchingPage(
            new GroupPage('groupPageLabResult', [
              rfpageCanTapResearch,
              rfpageNotEnoughAuroraItemForReserch,
              rfpageNotEnoughItemsForResearch,
              rfpageResearchComplete,
            ]),
            3000
          )
        ) {
          if (rerouter.isPageMatch(rfpageCanTapResearch)) {
            logs(TASKS.gnomeLab, `rfpageCanTapResearch, tap it`);
            rerouter.goNext(rfpageCanTapResearch);

            if (rerouter.waitScreenForMatchingPage(rfpageNotEnoughAuroraItemForReserch, 3000)) {
              logs(TASKS.gnomeLab, `rfpageNotEnoughAuroraItemForReserch, back`);
              sendKeyBack();
              Utils.sleep(1000);
              sendKeyBack();
            } else {
              sendKeyBack();
              finishRound(true);
            }
            return;
          } else {
            logs(TASKS.gnomeLab, `rfpageInGnomeLab, cannot tap this one, continue: ${rerouter.getCurrentMatchNames()}`);
            sendKeyBack();
            rerouter.waitScreenForMatchingPage(rfpageInGnomeLab, 2000);
          }
        }
      }
    }

    swipeFromToPoint({ x: 600, y: 234 }, { x: -200, y: 234 }, 5, undefined, rfpageInGnomeLab);
  }
}
