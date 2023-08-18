import { Page, RECT, Utils, rerouter } from 'Rerouter';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import { TASKS } from '../tasks';
import { config } from '../scriptConfig';
import {
  assign,
  findSpecificIconInScreen,
  ocrNumberInRect,
  ocrStockAndReqInRect,
  ocrStocksInRect,
  ocrTextInRect,
  passiveAddRoute,
  recognizeWishingTreeRequirements,
  swipeFromToPoint,
} from '../helper';
import * as ICONS from '../icons';
import { Point, seasideStockRect } from '../types';
import { cookieKingdom } from '../..';
import * as CONSTANTS from '../constants';

const rfpageInTradeHabor = new Page('rfpageInTradeHabor', [
  { x: 314, y: 18, r: 247, g: 254, b: 203 },
  { x: 404, y: 20, r: 243, g: 232, b: 12 },
  { x: 519, y: 21, r: 0, g: 178, b: 255 },
  { x: 34, y: 222, r: 255, g: 235, b: 206 },
  { x: 96, y: 229, r: 132, g: 120, b: 32 },
  { x: 613, y: 261, r: 57, g: 166, b: 231 },
]);
const rfpageShipInHabor = new Page('rfpageShipInHabor', [
  { x: 418, y: 212, r: 55, g: 34, b: 22 },
  { x: 609, y: 211, r: 176, g: 133, b: 66 },
  { x: 585, y: 229, r: 123, g: 78, b: 44 },
]);
const rfpageNoShipInHabor = new Page('rfpageNoShipInHabor', [
  { x: 246, y: 66, r: 255, g: 12, b: 82 },
  { x: 233, y: 88, r: 249, g: 242, b: 212 },
  { x: 255, y: 138, r: 126, g: 114, b: 41 },
]);
const rfpageCanLoadThisItem = new Page(
  'rfpageCanLoadThisItem',
  [
    { x: 424, y: 201, r: 59, g: 205, b: 0 },
    { x: 351, y: 246, r: 123, g: 207, b: 8 },
    { x: 414, y: 242, r: 222, g: 207, b: 198 },
    { x: 433, y: 309, r: 57, g: 69, b: 107 },
  ],
  { x: 434, y: 50 }
);
const rfpageLoadTooMuchWarning = new Page('rfpageLoadTooMuchWarning', [
  { x: 400, y: 252, r: 123, g: 207, b: 8 },
  { x: 304, y: 253, r: 8, g: 166, b: 222 },
  { x: 436, y: 288, r: 27, g: 33, b: 51 },
  { x: 260, y: 55, r: 28, g: 34, b: 53 },
]);
const rfpageInSeasideMarket = new Page('rfpageInSeasideMarket', [
  { x: 617, y: 21, r: 255, g: 255, b: 255 },
  { x: 566, y: 183, r: 114, g: 76, b: 32 },
  { x: 256, y: 121, r: 101, g: 151, b: 23 },
  { x: 280, y: 5, r: 206, g: 227, b: 49 },
  { x: 178, y: 117, r: 247, g: 52, b: 90 },
]);
const rfpageFreeRefreshSeasideMarket = new Page('rfpageFreeRefreshSeasideMarket', [
  { x: 510, y: 333, r: 155, g: 155, b: 155 },
  { x: 504, y: 333, r: 172, g: 146, b: 126 },
  { x: 498, y: 333, r: 148, g: 120, b: 111 },
  { x: 494, y: 333, r: 175, g: 148, b: 117 },
]);
const rfpageNeedDiamondRefreshMarket = new Page(
  'rfpageNeedDiamondRefreshMarket',
  [
    { x: 426, y: 110, r: 57, g: 169, b: 231 },
    { x: 305, y: 102, r: 255, g: 255, b: 255 },
    { x: 363, y: 118, r: 57, g: 69, b: 107 },
    { x: 297, y: 124, r: 33, g: 44, b: 66 },
  ],
  { x: 426, y: 110 }
);
const rfpageMarketItemDetail = new Page(
  'rfpageMarketItemDetail',
  [
    { x: 348, y: 231, r: 123, g: 207, b: 8 },
    { x: 376, y: 236, r: 222, g: 207, b: 198 },
    { x: 378, y: 204, r: 247, g: 235, b: 222 },
    { x: 366, y: 84, r: 57, g: 69, b: 107 },
    { x: 447, y: 87, r: 57, g: 170, b: 231 },
    { x: 261, y: 15, r: 103, g: 113, b: 24 },
    { x: 214, y: 51, r: 90, g: 59, b: 33 },
  ],
  { x: 348, y: 231 }
);
const rfpageNotEnoughItemToBuyThis = new Page(
  'rfpageNotEnoughItemToBuyThis',
  [
    { x: 441, y: 95, r: 181, g: 198, b: 209 },
    { x: 378, y: 108, r: 57, g: 69, b: 107 },
    { x: 340, y: 159, r: 9, g: 67, b: 86 },
    { x: 429, y: 132, r: 247, g: 235, b: 222 },
    { x: 447, y: 126, r: 127, g: 121, b: 123 },
    { x: 298, y: 7, r: 109, g: 116, b: 28 },
    { x: 105, y: 26, r: 8, g: 48, b: 28 },
    { x: 585, y: 87, r: 119, g: 125, b: 119 },
  ],
  { x: 434, y: 95 }
);
const rfpageInShellShop = new Page('rfpageInShellShop', [
  { x: 609, y: 22, r: 57, g: 166, b: 231 },
  { x: 323, y: 28, r: 247, g: 181, b: 243 },
  { x: 272, y: 28, r: 200, g: 212, b: 214 },
  { x: 254, y: 12, r: 231, g: 199, b: 156 },
]);
// TODO: 驗證不同模擬器這邊是否辨識不同
const rfpageConfirmBuySeaFairy = new Page(
  'rfpageConfirmBuySeaFairy',
  [
    { x: 351, y: 233, r: 123, g: 207, b: 8 },
    { x: 245, y: 86, r: 57, g: 69, b: 107 },
    { x: 235, y: 242, r: 222, g: 207, b: 198 },
    { x: 318, y: 15, r: 125, g: 103, b: 117 },
    { x: 410, y: 19, r: 127, g: 95, b: 4 },
    { x: 287, y: 16, r: 119, g: 111, b: 117 },
    { x: 271, y: 30, r: 99, g: 105, b: 103 },
  ],
  { x: 304, y: 240 }
);
const rfpageConfirmBuyGuildRelics = new Page(
  'rfpageConfirmBuyGuildRelics',
  [
    { x: 309, y: 221, r: 247, g: 252, b: 200 },
    { x: 295, y: 220, r: 121, g: 207, b: 12 },
    { x: 338, y: 73, r: 154, g: 94, b: 44 },
    { x: 324, y: 75, r: 207, g: 121, b: 61 },
    { x: 318, y: 17, r: 123, g: 101, b: 115 },
    { x: 298, y: 24, r: 114, g: 102, b: 119 },
  ],
  { x: 309, y: 221 }
);
const rfpageConfirmBuyLegendSoulEssence = new Page(
  'rfpageConfirmBuyLegendSoulEssence',
  [
    { x: 302, y: 254, r: 255, g: 186, b: 239 },
    { x: 312, y: 69, r: 170, g: 109, b: 38 },
    { x: 326, y: 91, r: 198, g: 251, b: 239 },
    { x: 267, y: 100, r: 57, g: 69, b: 107 },
  ],
  { x: 302, y: 254 }
);
const rfpageConfirmBuyEpicSoulEssence = new Page(
  'rfpageConfirmBuyEpicSoulEssence',
  [
    { x: 312, y: 253, r: 247, g: 190, b: 239 },
    { x: 315, y: 84, r: 195, g: 142, b: 60 },
    { x: 282, y: 91, r: 57, g: 69, b: 107 },
  ],
  { x: 312, y: 253 }
);
export const rfpageShellShopNotEnoughShell = new Page('rfpageShellShopNotEnoughShell', [
  { x: 351, y: 243, r: 121, g: 207, b: 12 },
  { x: 320, y: 180, r: 246, g: 200, b: 229 },
  { x: 327, y: 194, r: 248, g: 180, b: 243 },
  { x: 337, y: 183, r: 207, g: 193, b: 182 },
  { x: 342, y: 158, r: 52, g: 158, b: 228 },
  { x: 318, y: 107, r: 60, g: 70, b: 105 },
  { x: 271, y: 32, r: 102, g: 103, b: 95 },
  { x: 257, y: 14, r: 113, g: 98, b: 76 },
  { x: 38, y: 7, r: 109, g: 78, b: 94 },
]);

let seasideMarketStatus = {
  needPullToRightHead: true,
  rareItems: [] as RECT[],
  rightSlideCount: 0,
  rightSlideLimit: config.autoShopInSeasideMarket ? 5 : 0,
  needToBuyRadiantShard: config.autoBuyRadiantShardsInHabor,
  purchaseIndex: 0,
  foundResults: undefined as Point[] | undefined,
  foundIndex: 0,
};
if (config.autoBalanceAuroraStocks) {
  seasideMarketStatus.rareItems.push(seasideStockRect[0]);
  seasideMarketStatus.rareItems.push(seasideStockRect[1]);
  seasideMarketStatus.rareItems.push(seasideStockRect[2]);
}
if (config.autoBuyCaramelStuff) {
  seasideMarketStatus.rareItems.push(seasideStockRect[3]);
  seasideMarketStatus.rareItems.push(seasideStockRect[4]);
}

let shellGalleryStatus = {
  autoBuySeaFairy: config.autoBuySeaFairy,
  autoBuyEpicSoulEssence: config.autoBuyEpicSoulEssence,
  autoBuyLegendSoulEssence: config.autoBuyLegendSoulEssence,
  autoBuyGuildRelic: config.autoBuyGuildRelic,
};

export function addTradeHaborRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInTradeHabor.name}`,
    match: rfpageInTradeHabor,
    action: (context, image, matched, finishRound) => {
      if (context.task.name === TASKS.findAndTapCandy) {
        logs(context.task.name, `rfpageInTradeHabor, but current task is ${context.task.name}, need to start over`);
        sendKeyBack();
        // TODO: if findAndTapCandy moved, need to changed
        cookieKingdom!.taskStatus[TASKS.findAndTapCandy]['needGotoHead'] = true;
        return;
      } else if (context.task.name.substring(0, 5) !== 'habor') {
        logs(context.task.name, `rfpageInTradeHabor, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `rfpageInTradeHabor`);

      switch (context.task.name) {
        case TASKS.haborSendShip:
          if (rerouter.isPageMatchImage(rfpageNoShipInHabor, image)) {
            logs(context.task.name, `No ship in habor, finish ${context.task.name}`);
            sendEventRunning();
            finishRound(true);
            return;
          }

          var i = 0;
          var shipInHabor = true;
          for (i = 0; i < 5 && shipInHabor; i++) {
            for (var xPixel = i === 0 ? 55 : 200; xPixel < 620; xPixel += 60) {
              rerouter.screen.tap({ x: xPixel, y: 318 });
              Utils.sleep(config.sleepAnimate * 2);

              if (rerouter.isPageMatch(rfpageCanLoadThisItem)) {
                logs(context.task.name, `can load the item at x: ${xPixel}`);
                rerouter.screen.tap({ x: 408, y: 202 }); // tap Max
                Utils.sleep(config.sleep);

                rerouter.screen.tap({ x: 342, y: 240 }); // tap load
                Utils.sleep(config.sleepAnimate);
              }
              if (rerouter.isPageMatch(rfpageLoadTooMuchWarning)) {
                rerouter.screen.tap({ x: 270, y: 252 }); // Cancel ship confirm
                Utils.sleep(config.sleepAnimate);
                rerouter.screen.tap({ x: 270, y: 200 }); // tap minus icon
                Utils.sleep(config.sleepAnimate);
                rerouter.screen.tap({ x: 320, y: 240 }); // tap load
                Utils.sleep(config.sleepAnimate);
              }
              if (rerouter.isPageMatch(rfpageLoadTooMuchWarning)) {
                //Even one item is too much
                rerouter.screen.tap({ x: 270, y: 252 }); // Cancel ship confirm
                Utils.sleep(config.sleepAnimate);
                rerouter.screen.tap({ x: 434, y: 50 }); // tap close icon
                Utils.sleep(config.sleepAnimate);
                rerouter.screen.tap({ x: 320, y: 240 }); // tap load
                Utils.sleep(config.sleepAnimate * 2);
              }

              if (rerouter.waitScreenForMatchingPage(rfpageNoShipInHabor, 3000)) {
                logs(context.task.name, `Send the ship successfully`);
                shipInHabor = false;
                break;
              }
            }

            if (rerouter.isPageMatch(rfpageNoShipInHabor)) {
              break;
            }
            swipeFromToPoint({ x: 629, y: 319 }, { x: 200, y: 319 }, 5);
          }

          return;
        case TASKS.haborShopInSeaMarket:
          rerouter.screen.tap({ x: 95, y: 230 });
          return;
        case TASKS.haborShopInShellGallery:
          rerouter.screen.tap({ x: 32, y: 226 });
          return;
        default:
          console.log('donno what to do in rfpageInTradeHabor, send back');
          sendKeyBack();
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageInSeasideMarket.name}`,
    match: rfpageInSeasideMarket,
    action: (context, image, matched, finishRound) => {
      if (context.task.name.substring(0, 5) !== 'habor') {
        logs(context.task.name, `rfpageInSeasideMarket, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `In seaside marketing, send running, task status is: ${JSON.stringify(seasideMarketStatus)}`);
      sendEventRunning();

      const marketSearchArea = { x: 0, y: 180, w: 630, h: 140 };
      if (rerouter.isPageMatch(rfpageFreeRefreshSeasideMarket)) {
        rerouter.screen.tap({ x: 543, y: 336 }); // market free refresh, no need to pull to the head of the list as refresh will reset the list
        Utils.sleep(config.sleepAnimate);

        if (rerouter.waitScreenForMatchingPage(rfpageNeedDiamondRefreshMarket, 3000)) {
          rerouter.goNext(rfpageNeedDiamondRefreshMarket);
          Utils.sleep(config.sleepAnimate);
        }
      } else if (seasideMarketStatus.needPullToRightHead) {
        // swipe to start of the list
        swipeFromToPoint({ x: 0, y: 234 }, { x: 4000, y: 234 }, 6, undefined, rfpageInSeasideMarket);
        seasideMarketStatus.needPullToRightHead = false;
      }

      const rfpage1stAuroraSoldOut = new Page('rfpage1stAuroraSoldOut', [{ x: 59, y: 262, r: 206, g: 20, b: 24 }]);
      const rfpage2ndAuroraSoldOut = new Page('rfpage2ndAuroraSoldOut', [{ x: 150, y: 257, r: 239, g: 24, b: 24 }]);
      const rfpage3rdAuroraSoldOut = new Page('rfpage3rdAuroraSoldOut', [{ x: 247, y: 260, r: 206, g: 20, b: 24 }]);
      const rfpageCarmelMapMax = new Page('rfpageCarmelMapMax', [
        { x: 339, y: 291, r: 196, g: 130, b: 72 },
        { x: 333, y: 289, r: 157, g: 91, b: 36 },
        { x: 324, y: 294, r: 148, g: 219, b: 57 },
      ]);
      const rfpageCarmeScopeMax = new Page('rfpageCarmeScopeMax', [
        { x: 431, y: 291, r: 255, g: 166, b: 73 },
        { x: 423, y: 296, r: 138, g: 199, b: 178 },
        { x: 416, y: 294, r: 148, g: 215, b: 57 },
      ]);

      // Remove sold out aurora items
      // TODO: double confirm
      if (config.autoBalanceAuroraStocks && seasideMarketStatus.rareItems.length > 0) {
        if (rerouter.isPageMatchImage(rfpage1stAuroraSoldOut, image)) {
          seasideMarketStatus.rareItems = seasideMarketStatus.rareItems.filter((obj: RECT) => obj.x !== 66);
        }
        if (rerouter.isPageMatchImage(rfpage2ndAuroraSoldOut, image)) {
          seasideMarketStatus.rareItems = seasideMarketStatus.rareItems.filter((obj: RECT) => obj.x !== 158);
        }
        if (rerouter.isPageMatchImage(rfpage3rdAuroraSoldOut, image)) {
          seasideMarketStatus.rareItems = seasideMarketStatus.rareItems.filter((obj: RECT) => obj.x !== 253);
        }
      }

      // Market will remove Carmel map/scope back from the shopping list if it is fulled
      if (config.autoBuyCaramelStuff && seasideMarketStatus.rareItems.length > 0) {
        if (rerouter.isPageMatchImage(rfpageCarmelMapMax, image)) {
          // seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 346);
          seasideMarketStatus.rareItems = seasideMarketStatus.rareItems.filter((obj: RECT) => obj.x !== 346);
        }
        if (rerouter.isPageMatchImage(rfpageCarmeScopeMax, image)) {
          // seamarketState.rareItems = seamarketState.rareItems.filter(obj => obj.x !== 439);
          seasideMarketStatus.rareItems = seasideMarketStatus.rareItems.filter((obj: RECT) => obj.x !== 439);
        }
      }

      if (seasideMarketStatus.rareItems.length > 0) {
        console.log('>> considerPurchaseSeasideMarket:', considerPurchaseSeasideMarket(seasideMarketStatus.rareItems.shift()!));
        return;
      }
      if (seasideMarketStatus.needToBuyRadiantShard) {
        logs(context.task.name, 'Purchasing radiant shard');
        rerouter.screen.tap({ x: 540, y: 270 });
        Utils.sleep(config.sleepAnimate);
        rerouter.screen.tap({ x: 315, y: 247 });
        Utils.sleep(2000);
        seasideMarketStatus.needToBuyRadiantShard = false;
      }

      // for i = rightSlideCount < rightSlideLimit
      // for j = purchaseIndex < Object.keys(ICONS.iconSeasideMarketItems)
      // for k = foundIndex < Object.keys(foundResults)
      console.log('>> 1', JSON.stringify(seasideMarketStatus));
      if (seasideMarketStatus.rightSlideCount >= seasideMarketStatus.rightSlideLimit) {
        logs(context.task.name, `Jobs finish`);
        sendKeyBack();
        sendEventRunning();
        finishRound(true);
        return;
      }

      console.log('>> 2', JSON.stringify(seasideMarketStatus));
      if (seasideMarketStatus.purchaseIndex >= Object.keys(ICONS.iconSeasideMarketItems).length) {
        seasideMarketStatus.rightSlideCount++;
        seasideMarketStatus.purchaseIndex = 0;
        swipeFromToPoint({ x: 600, y: 234 }, { x: 0, y: 234 }, 6, undefined, rfpageInSeasideMarket);
        sleep(2000);
        seasideMarketStatus.foundResults = undefined;
        return;
      }

      console.log('>> 3', JSON.stringify(seasideMarketStatus));
      if (seasideMarketStatus.foundResults && seasideMarketStatus.foundIndex >= Object.keys(seasideMarketStatus.foundResults).length) {
        seasideMarketStatus.purchaseIndex++;
        seasideMarketStatus.foundResults = undefined;
        return;
      }

      if (seasideMarketStatus.foundResults === undefined || Object.keys(seasideMarketStatus.foundResults).length === 0) {
        console.log('>> 3.1', JSON.stringify(seasideMarketStatus));

        for (let i = seasideMarketStatus.purchaseIndex; i < Object.keys(ICONS.iconSeasideMarketItems).length; i++) {
          console.log('>> 3.2', JSON.stringify(seasideMarketStatus));
          seasideMarketStatus.foundResults = findSpecificIconInScreen(ICONS.iconSeasideMarketItems[i], marketSearchArea);
          seasideMarketStatus.foundIndex = 0;
          seasideMarketStatus.purchaseIndex = i;

          if (Object.keys(seasideMarketStatus.foundResults).length > 0) {
            console.log('>> 3.3', JSON.stringify(seasideMarketStatus));
            break;
          }
        }
        if (Object.keys(seasideMarketStatus.foundResults!).length === 0) {
          return;
        }
      }

      console.log(
        `>> 4 decided to purchase ${ICONS.iconSeasideMarketItems[seasideMarketStatus.purchaseIndex].name}, state: ${JSON.stringify(seasideMarketStatus)}`
      );
      // iii++;
      rerouter.screen.tap({
        x: marketSearchArea.x + seasideMarketStatus.foundResults![seasideMarketStatus.foundIndex].x,
        y: marketSearchArea.y + seasideMarketStatus.foundResults![seasideMarketStatus.foundIndex].y,
      });
      sleep(1000);
      seasideMarketStatus.foundIndex++;
    },
  });
  rerouter.addRoute({
    path: `/${rfpageMarketItemDetail.name}`,
    match: rfpageMarketItemDetail,
    action: (context, image, matched, finishRound) => {
      if (context.task.name.substring(0, 5) !== 'habor') {
        logs(context.task.name, `rfpageInSeasideMarket, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      logs(context.task.name, `in rfpageMarketItemDetail, handle it`);
      let productNowHave = ocrNumberInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
      if (productNowHave === -1) {
        logs(
          context.task.name,
          `About to purchase ${ICONS.iconSeasideMarketItems[seasideMarketStatus.purchaseIndex].name} but found ${productNowHave} (OCR failure), skip this one`
        );
        sendKeyBack();
      }
      if (productNowHave < config.materialsTarget) {
        logs(
          context.task.name,
          `Purchased ${
            ICONS.iconSeasideMarketItems[seasideMarketStatus.purchaseIndex].name
          } in seaside market due to having ${productNowHave}, less than target ${config.materialsTarget}`
        );
        rerouter.goNext(rfpageMarketItemDetail);
        sleep(2000);
      } else {
        logs(context.task.name, `Not purchase seaside market so send back due to having ${productNowHave}, more than target ${config.materialsTarget}`);
        sendKeyBack();
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageNotEnoughItemToBuyThis.name}`,
    match: rfpageNotEnoughItemToBuyThis,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, `in rfpageNotEnoughItemToBuyThis, send back twice`);

      sendKeyBack();
      Utils.sleep(1500);
      sendKeyBack();
      Utils.sleep(1500);
    },
  });

  rerouter.addRoute({
    path: `/${rfpageInShellShop.name}`,
    match: rfpageInShellShop,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== 'haborShopInShellGallery') {
        logs(context.task.name, `rfpageInShellShop, but current task is ${context.task.name}, skipping`);
        sendKeyBack();
        return;
      }

      const rfpageLegendarySoldOut = new Page('rfpageLegendarySoldOut', [
        { x: 57, y: 102, r: 171, g: 203, b: 240 },
        { x: 82, y: 199, r: 239, g: 24, b: 24 },
      ]);
      if (shellGalleryStatus.autoBuySeaFairy) {
        if (rerouter.isPageMatchImage(rfpageLegendarySoldOut, image)) {
          logs(context.task.name, `Purchased legendary cookie successfully`);
          shellGalleryStatus.autoBuySeaFairy = false;
        } else {
          logs(context.task.name, `Purchasing legendary cookie`);
          rerouter.screen.tap({ x: 80, y: 313 });
          return;
        }
      }

      const rfpageRelicSoldOut = new Page('rfpageRelicSoldOut', [
        { x: 413, y: 235, r: 206, g: 20, b: 24 },
        { x: 387, y: 229, r: 198, g: 121, b: 57 },
      ]);
      if (shellGalleryStatus.autoBuyGuildRelic) {
        if (rerouter.isPageMatchImage(rfpageRelicSoldOut, image)) {
          logs(context.task.name, `Purchased guild relic successfully`);
          shellGalleryStatus.autoBuyGuildRelic = false;
        } else {
          logs(context.task.name, `Purchasing guild relic`);
          rerouter.screen.tap({ x: 360, y: 313 });
          return;
        }
      }

      const rfpageLegendSoulEssenceSoldOut = new Page('rfpageLegendSoulEssenceSoldOut', [
        { x: 292, y: 118, r: 205, g: 22, b: 27 },
        { x: 277, y: 140, r: 246, g: 255, b: 255 },
      ]);
      if (shellGalleryStatus.autoBuyLegendSoulEssence) {
        if (rerouter.isPageMatchImage(rfpageLegendSoulEssenceSoldOut, image)) {
          logs(context.task.name, `Purchased legend soul essence successfully`);
          shellGalleryStatus.autoBuyLegendSoulEssence = false;
        } else {
          logs(context.task.name, `Purchasing legend soul essence`);
          rerouter.screen.tap({ x: 270, y: 192 });
          return;
        }
      }

      const rfpageEpicSoulEssenceSoldOut = new Page('rfpageEpicSoulEssenceSoldOut', [
        { x: 293, y: 241, r: 206, g: 20, b: 24 },
        { x: 274, y: 263, r: 247, g: 138, b: 247 },
      ]);
      if (shellGalleryStatus.autoBuyEpicSoulEssence) {
        if (rerouter.isPageMatchImage(rfpageEpicSoulEssenceSoldOut, image)) {
          logs(context.task.name, `Purchased epic soul essence successfully`);
          shellGalleryStatus.autoBuyEpicSoulEssence = false;
        } else {
          logs(context.task.name, `Purchasing epic soul essence`);
          rerouter.screen.tap({ x: 270, y: 318 });
          return;
        }
      }

      finishRound(true);
      sendKeyBack();
      sendEventRunning();
      logs(context.task.name, `${context.path} finishRound`);
    },
  });

  passiveAddRoute([rfpageConfirmBuySeaFairy, rfpageConfirmBuyGuildRelics, rfpageConfirmBuyLegendSoulEssence, rfpageConfirmBuyEpicSoulEssence]);
}

export function addSendHaborShipTask() {
  rerouter.addTask({
    name: TASKS.haborSendShip,
    maxTaskDuring: 10 * CONSTANTS.minuteInMs,
    minRoundInterval: 120 * CONSTANTS.minuteInMs,
    forceStop: true,
  });
}

export function addSeasideMarketTask() {
  rerouter.addTask({
    name: TASKS.haborShopInSeaMarket,
    maxTaskDuring: 15 * CONSTANTS.minuteInMs,
    minRoundInterval: 120 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(seasideMarketStatus, {
        needPullToRightHead: true,
        rareItems: [] as RECT[],
        rightSlideCount: 0,
        rightSlideLimit: config.autoShopInSeasideMarket ? 5 : 0,
        needToBuyRadiantShard: config.autoBuyRadiantShardsInHabor,
        purchaseIndex: 0,
        foundResults: undefined as Point[] | undefined,
        foundIndex: 0,
      });

      if (config.autoBalanceAuroraStocks) {
        seasideMarketStatus.rareItems.push(seasideStockRect[0]);
        seasideMarketStatus.rareItems.push(seasideStockRect[1]);
        seasideMarketStatus.rareItems.push(seasideStockRect[2]);
      }
      if (config.autoBuyCaramelStuff) {
        seasideMarketStatus.rareItems.push(seasideStockRect[3]);
        seasideMarketStatus.rareItems.push(seasideStockRect[4]);
      }
    },
  });
}

export function addShellGalleryTask() {
  rerouter.addTask({
    name: TASKS.haborShopInShellGallery,
    maxTaskDuring: 3 * CONSTANTS.minuteInMs,
    minRoundInterval: 120 * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(shellGalleryStatus, {
        autoBuySeaFairy: config.autoBuySeaFairy,
        autoBuyEpicSoulEssence: config.autoBuyEpicSoulEssence,
        autoBuyLegendSoulEssence: config.autoBuyLegendSoulEssence,
        autoBuyGuildRelic: config.autoBuyGuildRelic,
      });
    },
  });
}

function considerPurchaseSeasideMarket(target: RECT): boolean {
  let newStock = ocrStocksInRect(target, ICONS.numberAuroraStockInTradeBird);
  let newStock2 = ocrStockAndReqInRect(target, ICONS.numberAuroraStockInTradeBird);
  console.log('considerPurchaseSeasideMarket, newStock', newStock, newStock2, JSON.stringify(target));
  if (newStock > 50) {
    rerouter.screen.tap(target);
    if (rerouter.waitScreenForMatchingPage(rfpageMarketItemDetail, 2000)) {
      let productNowHave = ocrNumberInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
      //   let productNowHave = ocrTextInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
      logs('haborShopInSeaMarket', `Considering trade ${newStock} for ${productNowHave}`);

      if (newStock > productNowHave) {
        console.log('Purchased seaside market: ', newStock, productNowHave);
        rerouter.goNext(rfpageMarketItemDetail);
        sleep(1000);
      } else {
        console.log('NOT purchased seaside market: ', newStock, productNowHave);
        rerouter.screen.tap({ x: 438, y: 90 }); // close the window
      }
    }
  }

  return false;
}
