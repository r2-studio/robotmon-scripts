import { Page, Utils, rerouter } from 'Rerouter';
import { TASKS } from '../tasks';
import { logs, sendEventRunning, sendKeyBack } from '../utils';
import * as CONSTANTS from '../constants';
import { config, defaultWishes } from '../scriptConfig';
import { assign, isSameColorAtPnt, recognizeWishingTreeRequirements } from '../helper';
import { Records, Wish, WishStatus } from '../types';
import * as ICONS from '../icons';

const rfpageInWishingTree = new Page('rfpageInWishingTree', [
  { x: 157, y: 29, r: 107, g: 56, b: 82 },
  { x: 235, y: 35, r: 255, g: 0, b: 81 },
  { x: 348, y: 22, r: 255, g: 40, b: 123 },
  { x: 412, y: 18, r: 255, g: 190, b: 8 },
  { x: 523, y: 15, r: 0, g: 195, b: 255 },
]);
const rfpageNotEnoughForTree = new Page(
  'rfpageNotEnoughForTree',
  [
    { x: 445, y: 97, r: 57, g: 166, b: 231 },
    { x: 437, y: 97, r: 255, g: 255, b: 255 },
    { x: 397, y: 112, r: 57, g: 69, b: 107 },
    { x: 252, y: 142, r: 191, g: 183, b: 174 },
    { x: 247, y: 140, r: 80, g: 80, b: 80 },
    { x: 253, y: 15, r: 127, g: 22, b: 61 },
    { x: 60, y: 18, r: 41, g: 18, b: 28 },
    { x: 64, y: 41, r: 20, g: 32, b: 66 },
    { x: 8, y: 24, r: 49, g: 30, b: 94 },
    { x: 524, y: 20, r: 0, g: 69, b: 127 },
  ],
  { x: 442, y: 97 }
);
const rfpageCheckWishingTreeStock = new Page('rfpageCheckWishingTreeStock', [
  { x: 355, y: 302, r: 121, g: 207, b: 12 },
  { x: 244, y: 46, r: 60, g: 70, b: 105 },
  { x: 257, y: 21, r: 127, g: 12, b: 46 },
  { x: 410, y: 18, r: 127, g: 94, b: 4 },
  { x: 6, y: 25, r: 50, g: 31, b: 93 },
]);

let wishingTreeStatus = {
  records: {
    opened: 0,
    golden: 0,
    fulfilled: 0,
    notEnoughAndSkip: 0,
    goldenAndSkip: 0,
  },
};

let wishes = [...defaultWishes];

export function addWishingTreeRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInWishingTree.name}`,
    match: rfpageInWishingTree,
    action: (context, image, matched, finishRound) => {
      if (context.task.name !== TASKS.wishingTree) {
        logs(context.task.name, `rfpageInWishingTree, leave because current task is not wishing tree, but: ${context.task.name}`);
        rerouter.screen.tap({ x: 618, y: 20 }); // tap X
        return;
      }

      logs(context.task.name, `rfpageInWishingTree, start working`);

      const rfpageAllWishingDailyRewardCollected = new Page('rfpageAllWishingDailyRewardCollected', [
        { x: 59, y: 242, r: 247, g: 247, b: 247 },
        { x: 60, y: 256, r: 138, g: 138, b: 138 },
      ]);

      if (rerouter.isPageMatchImage(rfpageAllWishingDailyRewardCollected, image) && !config.alwaysFulfillWishes) {
        logs(context.task.name, `rfpageInWishingTree, All wish fulfilled, skipping and send running`);
        sendEventRunning();
        rerouter.screen.tap({ x: 618, y: 20 }); // tap X
        finishRound(true);
        return;
      }

      let refreshing = 0;
      for (var i in wishes) {
        var wish = wishes[i];

        let records = wishingTreeStatus.records;
        var result = getStatusOfGivenWish(wish, wishingTreeStatus.records, config.wishingTreeRefreshGoldenWishes);
        wish = result['wish'];
        records = result['records'];
        console.log('handling wish', i, JSON.stringify(wish));

        if (wish.status === 'refresh') {
          refreshing++;
          continue;
        } else if (wish.status === 'opened') {
          result = checkToSendSpecificWish(wish, records, config.wishingTreeSafetyStock);
          wish = result['wish'];
          records = result['records'];
          console.log('handled wish', i, JSON.stringify(wish));
        }

        wishingTreeStatus.records = records;
        Utils.sleep(CONSTANTS.sleep);
      }
      console.log('>>> Wising tree records', JSON.stringify(wishingTreeStatus.records));

      var rfpageCollectTreeReward = new Page('rfpageCollectTreeReward', [{ x: 85, y: 289, r: 44, g: 203, b: 8 }]);
      if (rerouter.isPageMatch(rfpageCollectTreeReward)) {
        console.log('Daily reward collected');
        rerouter.screen.tap({ x: 60, y: 255 });
        Utils.sleep(2000);

        rerouter.waitScreenForMatchingPage(rfpageInWishingTree, 8000);
        // waitUntilSeePage(pageInWishingTree, 8, pageCollectTreeReward);
      }

      if (refreshing === 4) {
        console.log('All wishes are refreshing, jobs done here');
        return;
      }

      // console.log('Run wishing tree for ', (Date.now() - wishingTreeStartTime) / 60000, ' mins, ending this task');
      sendEventRunning();
      finishRound(true);
      return true;
    },
  });
}

export function addWishingTreeTask() {
  rerouter.addTask({
    name: TASKS.wishingTree,
    maxTaskDuring: 10 * CONSTANTS.minuteInMs,
    minRoundInterval: config.autoFulfillWishesIntervalInMins * CONSTANTS.minuteInMs,
    forceStop: true,
    beforeRoute: () => {
      assign(wishingTreeStatus, {
        records: {
          opened: 0,
          golden: 0,
          fulfilled: 0,
          notEnoughAndSkip: 0,
          goldenAndSkip: 0,
        },
      });
      let wishes = [...defaultWishes];
    },
  });
}

function getStatusOfGivenWish(wish: Wish, records: Records, refreshGolden: boolean): { wish: Wish; records: Records } {
  if (isSameColorAtPnt(wish.refreshPnt, { r: 255, g: 249, b: 203 })) {
    wish.status = WishStatus.opened;
  } else if (isSameColorAtPnt(wish.refreshPnt, { r: 246, g: 210, b: 135 }, 15)) {
    rerouter.screen.tap(wish.unfoldPnt);
    Utils.sleep(CONSTANTS.sleepAnimate);
    wish.status = WishStatus.opened;
    records['opened']++;
  } else if (isSameColorAtPnt(wish.refreshPnt, { r: 193, g: 160, b: 111 })) {
    wish.status = WishStatus.refresh;
  } else if (isSameColorAtPnt(wish.refreshPnt, { r: 255, g: 222, b: 41 })) {
    // Folded golden wish
    wish.golden = true;
    records['golden']++;
    if (refreshGolden) {
      rerouter.screen.tap(wish.refreshPnt);
      Utils.sleep(CONSTANTS.sleepAnimate);
      rerouter.screen.tap(wish.refreshPnt);
      Utils.sleep(CONSTANTS.sleepAnimate);
      logs(TASKS.wishingTree, `refresh as it is an unfolded golden wish: ${JSON.stringify(wish)}`);
      wish.status = WishStatus.refresh;
    } else {
      rerouter.screen.tap(wish.unfoldPnt);
      Utils.sleep(CONSTANTS.sleepAnimate);
      wish.status = WishStatus.opened;
      records['opened']++;
    }
  } else if (isSameColorAtPnt(wish.refreshPnt, { r: 255, g: 247, b: 123 })) {
    // Expended golden wish
    wish.golden = true;
    if (refreshGolden) {
      rerouter.screen.tap(wish.refreshPnt);
      Utils.sleep(CONSTANTS.sleepAnimate);
      logs(TASKS.wishingTree, `refresh as it is an unfolded golden wish: ${JSON.stringify(wish)}`);
      wish.status = WishStatus.refresh;
      records['goldenAndSkip']++;
    } else {
      wish.status = WishStatus.opened;
    }
  }

  return { wish: wish, records: records };
}

function checkToSendSpecificWish(wish: Wish, records: Records, safetySotck: number) {
  if (rerouter.isPageMatch(rfpageNotEnoughForTree)) {
    logs(TASKS.wishingTree, `checkToSendSpecificWish found pageNotEnoughForTree, tap to close that`);
    rerouter.goNext(rfpageNotEnoughForTree);
    Utils.sleep(CONSTANTS.sleepAnimate);
  }

  let stocks: {
    stock: number;
    need: number;
  }[] = [];

  for (var pntIdx in wish.requirementIconPnts) {
    var reqPnt = wish.requirementIconPnts[pntIdx];

    if (isSameColorAtPnt(reqPnt, { r: 255, g: 251, b: 206 }) || isSameColorAtPnt(reqPnt, { r: 255, g: 255, b: 142 })) {
      console.log('This point has no item, skipping:', pntIdx);
      continue;
    }

    rerouter.screen.tap(reqPnt);
    Utils.sleep(CONSTANTS.sleepAnimate);

    let ocrResult = '';
    if (rerouter.waitScreenForMatchingPage(rfpageCheckWishingTreeStock, 7000, 1)) {
      // Use this to collect stock info
      var img = getScreenshot();
      var cImg1 = cropImage(img, 325, 110, 40, 15);
      ocrResult = recognizeWishingTreeRequirements(ICONS.numberImagesProdutRequirements, cImg1, 12, 0.87, 0.7);
      releaseImage(cImg1);
      releaseImage(img);
    }

    if (!rerouter.isPageMatch(rfpageInWishingTree)) {
      sendKeyBack();
      Utils.sleep(CONSTANTS.sleep);
    }

    rerouter.waitScreenForMatchingPage(rfpageInWishingTree, 7000, 1);
    // waitUntilSeePage(pageInWishingTree, 7, pageCheckWishingTreeStock, null, 3);

    ocrResult = ocrResult.trim();
    var stockAndReq: any[] = [];
    if (ocrResult.length === 0) {
      // do nothing
    } else if (ocrResult.indexOf('/') === -1) {
      stockAndReq = [ocrResult.substr(0, ocrResult.length - 1), ocrResult.substr(ocrResult.length - 1, 1)];
    } else {
      stockAndReq = ocrResult.split('/');
    }

    stockAndReq[0] = parseInt(stockAndReq[0], 10);
    stockAndReq[1] = parseInt(stockAndReq[1], 10);

    stocks[pntIdx] = {
      stock: stockAndReq[0],
      need: stockAndReq[1],
    };

    if (stockAndReq.length === 0 || stockAndReq[0] === null) {
      logs(TASKS.wishingTree, `OCR failed, skip this one, pntIdx, stockAndReq: ${pntIdx}, ${JSON.stringify(stockAndReq)}`);
      rerouter.screen.tap(wish.refreshPnt);
      Utils.sleep(CONSTANTS.sleep);

      wish.status = WishStatus.refresh;
      return { wish: wish, records: records };
    }

    if (stockAndReq[0] - stockAndReq[1] < safetySotck) {
      logs(TASKS.wishingTree, `Skip this one as the stock ${stockAndReq[0]} is lower than config ${safetySotck}, need ${stockAndReq[1]}`);
      rerouter.screen.tap(wish.refreshPnt);
      Utils.sleep(CONSTANTS.sleep);

      wish.status = WishStatus.refresh;
      return { wish: wish, records: records };
    }
  }

  logs(TASKS.wishingTree, `Stock is enough, fulfill this wish, ${JSON.stringify(wish)}, ${JSON.stringify(stocks)}`);
  rerouter.screen.tap(wish.fulfillPnt);
  Utils.sleep(CONSTANTS.sleep);

  if (rerouter.waitScreenForMatchingPage(rfpageNotEnoughForTree, 2000)) {
    logs(TASKS.wishingTree, `wish ${wish.id} tapped but not enough stock (wrong ocr?), refresh it'`);

    rerouter.goNext(rfpageNotEnoughForTree);
    Utils.sleep(CONSTANTS.sleepAnimate * 2);

    rerouter.screen.tap(wish.refreshPnt);
    Utils.sleep(CONSTANTS.sleep);
    wish.status = WishStatus.refresh;
    return { wish: wish, records: records };
  }

  console.log('wish ', wish.id, ' is fulfilled');
  records['fulfilled']++;
  return { wish: wish, records: records };
}
