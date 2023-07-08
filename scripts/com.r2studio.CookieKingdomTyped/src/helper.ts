import { Rerouter, Utils, XYRGB, Page, XY, MessageWindow, Icon, RECT, GroupPage } from 'Rerouter';
import * as PAGES from './pages';
import * as ICONS from './icons';
import * as CONSTANTS from './constants';
import { Advanture, Advantures, Records, Wish, WishStatus } from './types';
import { logs, sendKeyBack } from './utils';
import { TASKS } from './tasks';

export function scrollDownALot(rerouter: Rerouter, startPnt: XY) {
  rerouter.screen.tapDown({ x: startPnt.x, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x, y: startPnt.y / 2 });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x, y: -500 });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x, y: -1000 });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.tapUp({ x: startPnt.x, y: -1000 });
  Utils.sleep(CONSTANTS.sleepAnimate * 3);
}

export function scrollLeftALot(rerouter: Rerouter, startPnt: XY) {
  rerouter.screen.tapDown({ x: startPnt.x, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x * 2, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: 1000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: 1500, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: 2000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.tapUp({ x: 2000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleepAnimate * 3);
}

export function scrollRightALot(rerouter: Rerouter, startPnt: XY) {
  // rerouter.screen.tapDown({ x: startPnt.x, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleep);
  // rerouter.screen.moveTo({ x: startPnt.x / 2, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleep);
  // rerouter.screen.moveTo({ x: 0, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleep);
  // rerouter.screen.moveTo({ x: -1000, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleep);
  // rerouter.screen.moveTo({ x: -2000, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleep);
  // rerouter.screen.tapUp({ x: -2000, y: startPnt.y });
  // Utils.sleep(CONSTANTS.sleepAnimate * 3);

  return swipeFromToPoint(rerouter, { x: startPnt.x, y: startPnt.y }, { x: -2000, y: startPnt.y }, 5);
}

export function swipeFromToPoint(rerouter: Rerouter, fromPnt: XY, toPnt: XY, steps: number, stopIfFoundPage?: Page, swipingPage?: Page) {
  if (swipingPage === undefined) {
    swipingPage = PAGES.rfpageInKingdomVillage;
  }

  if (!rerouter.isPageMatch(swipingPage)) {
    // console.log('swipe from this point will get to another page, try again: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }

  steps = steps == undefined ? 4 : steps;
  var step_x = (toPnt.x - fromPnt.x) / steps;
  var step_y = (toPnt.y - fromPnt.y) / steps;

  tapDown(fromPnt.x, fromPnt.y, 40, 0);
  sleep(10);
  moveTo(fromPnt.x, fromPnt.y, 40, 0);
  sleep(10);

  for (var i = 0; i < steps; i++) {
    moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0);
    // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
    sleep(50);
  }

  moveTo(toPnt.x, toPnt.y, 40, 0);
  sleep(500);
  tapUp(toPnt.x, toPnt.y, 40, 0);
  sleep(500);

  if (!rerouter.isPageMatch(swipingPage)) {
    console.log('swipe but page changed, failed x, y: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }
  return true;
}

export function checkScreenMessage(rerouter: Rerouter, message: MessageWindow, pageMessageWindow?: Page) {
  if (pageMessageWindow === undefined) {
    pageMessageWindow = PAGES.rfpageGeneralMessageWindow;
  }

  if (!rerouter.isPageMatch(pageMessageWindow)) {
    return false;
  }

  var img = getScreenshot();
  var croppedImage = cropImage(img, message.x, message.y, message.width, message.height);

  var whSize = getImageSize(croppedImage);

  var cnt = 0;
  for (var i = 0; i < whSize.width; i++) {
    if (isSameColor(getImageColor(croppedImage, i, message.targetY), message.lookingForColor)) {
      cnt++;
    }
  }
  console.log('cnt vs messageScreen.targetColorCount vs messageScreen.targetColorThreashold: ', cnt, message.targetColorCount, message.targetColorThreashold);

  releaseImage(img);
  releaseImage(croppedImage);
  return Math.abs(message.targetColorCount - cnt) < message.targetColorThreashold ? true : false;
}

export function isSameColor(c1: RGB, c2: RGB, diff?: number) {
  if (diff === undefined) {
    diff = 35;
  }
  // console.log(JSON.stringify(c1), JSON.stringify(c2), diff);
  if (Math.abs(c1.r - c2.r) < diff && Math.abs(c1.g - c2.g) < diff && Math.abs(c1.b - c2.b) < diff) {
    return true;
  }
  return false;
}

export function isSameColorAtPnt(point: XY, c2: RGB, diff?: number) {
  if (point.x === undefined || point.y === undefined) {
    console.log('Error isSameColorAtPnt as x y cannot be undefined:', JSON.stringify(point));
    return false;
  }

  var img = getScreenshot();
  var color = getImageColor(img, point.x, point.y);
  releaseImage(img);
  if (!isSameColor(color, c2, diff)) {
    return false;
  }
  return true;
}

export function getStatusOfGivenWish(wish: Wish, records: Records, refreshGolden: boolean, rerouter: Rerouter): { wish: Wish; records: Records } {
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

export function checkToSendSpecificWish(wish: Wish, records: Records, safetySotck: number, rerouter: Rerouter) {
  if (rerouter.isPageMatch(PAGES.rfpageNotEnoughForTree)) {
    logs(TASKS.wishingTree, `checkToSendSpecificWish found pageNotEnoughForTree, tap to close that`);
    rerouter.goNext(PAGES.rfpageNotEnoughForTree);
    Utils.sleep(CONSTANTS.sleepAnimate);
  }

  var stocks = {};
  for (var pntIdx in wish.requirementIconPnts) {
    var reqPnt = wish.requirementIconPnts[pntIdx];

    if (isSameColorAtPnt(reqPnt, { r: 255, g: 251, b: 206 }) || isSameColorAtPnt(reqPnt, { r: 255, g: 255, b: 142 })) {
      console.log('This point has no item, skipping:', pntIdx);
      continue;
    }

    rerouter.screen.tap(reqPnt);
    Utils.sleep(CONSTANTS.sleepAnimate);

    let ocrResult = '';
    if (rerouter.waitScreenForMatchingPage(PAGES.rfpageCheckWishingTreeStock, 7000, 1)) {
      // Use this to collect stock info
      var img = getScreenshot();
      var cImg1 = cropImage(img, 325, 110, 40, 15);
      ocrResult = recognizeWishingTreeRequirements(ICONS.numberImagesProdutRequirements, cImg1, 12, 0.87, 0.7);
      releaseImage(cImg1);
      releaseImage(img);
    }

    if (!rerouter.isPageMatch(PAGES.rfpageInWishingTree)) {
      sendKeyBack();
      Utils.sleep(CONSTANTS.sleep);
    }

    rerouter.waitScreenForMatchingPage(PAGES.rfpageInWishingTree, 7000, 1);
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

  if (rerouter.waitScreenForMatchingPage(PAGES.rfpageNotEnoughForTree, 2000)) {
    logs(TASKS.wishingTree, `wish ${wish.id} tapped but not enough stock (wrong ocr?), refresh it'`);

    rerouter.goNext(PAGES.rfpageNotEnoughForTree);
    Utils.sleep(CONSTANTS.sleepAnimate * 2);

    wish.status = WishStatus.refresh;
    return { wish: wish, records: records };
  }

  console.log('wish ', wish.id, ' is fulfilled');
  records['fulfilled']++;
  return { wish: wish, records: records };
}

export function recognizeWishingTreeRequirements(words: Icon[], devImg: Image, maxLength: number, thres: number, overlapRatio: number) {
  var maxWordWidth = 0;
  var allResults = [];
  for (var w = 0; w < words.length; w++) {
    var icon = words[w];
    var wh = getImageSize(icon.image);
    maxWordWidth = Math.max(maxWordWidth, wh.width);
    var results = findImages(devImg, icon.image, thres, maxLength, true);
    for (var idx in results) {
      var result = results[idx];
      allResults.push({ char: icon.name, x: result.x, y: result.y, score: result.score, w: wh.width });
    }
  }

  allResults.sort(function (a, b) {
    return a.x - b.x;
  });
  var str = '';
  var rBound = 0;
  var maxScore = 0;
  for (var i = 0; i < allResults.length; i++) {
    const word = allResults[i];

    // console.log('word', word.char, rBound, 'x', word.x, word.score);
    if (word.x > rBound) {
      maxScore = word.score;
      str += word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    } else if (word.x <= rBound && word.score > maxScore && word.char !== ' ') {
      // overlap
      maxScore = word.score;
      str = str.substr(0, str.length - 1) + word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    }
  }
  return str;
}

export function GenAdvanture(pnt: XY, fromHead: boolean, backward: boolean) {
  return {
    pnt: pnt,
    fromHead: fromHead,
    backward: backward,
  };
}

// When there are NO timed event
export const AdvanturesBountiesAt2nd: { [key: string]: Advanture } = {
  pvp: GenAdvanture({ x: 123, y: 230 }, true, false),
  towerOfSweetChaos: GenAdvanture({ x: 214, y: 230 }, true, false),
  tropicalIsland: GenAdvanture({ x: 300, y: 230 }, true, false),
  cookieAlliance: GenAdvanture({ x: 392, y: 230 }, true, false),

  superMayhem: GenAdvanture({ x: 500, y: 150 }, false, false),
  bounties: GenAdvanture({ x: 300, y: 100 }, false, false),
  guild: GenAdvanture({ x: 10, y: 100 }, false, true),
};

export const AdvanturesBountiesAt3rd: { [key: string]: Advanture } = {
  pvp: GenAdvanture({ x: 123, y: 230 }, true, false),
  towerOfSweetChaos: GenAdvanture({ x: 214, y: 230 }, true, false),
  tropicalIsland: GenAdvanture({ x: 300, y: 230 }, true, false),
  cookieAlliance: GenAdvanture({ x: 392, y: 230 }, true, false),

  superMayhem: GenAdvanture({ x: 500, y: 150 }, false, false),
  bounties: GenAdvanture({ x: 120, y: 100 }, false, true),
  guild: GenAdvanture({ x: 320, y: 100 }, false, true),
};

export const AdvanturesBountiesAt4th: { [key: string]: Advanture } = {
  pvp: GenAdvanture({ x: 123, y: 230 }, true, false),
  towerOfSweetChaos: GenAdvanture({ x: 214, y: 230 }, true, false),
  tropicalIsland: GenAdvanture({ x: 300, y: 230 }, true, false),
  cookieAlliance: GenAdvanture({ x: 392, y: 230 }, true, false),

  superMayhem: GenAdvanture({ x: 500, y: 150 }, false, false),
  bounties: GenAdvanture({ x: 100, y: 100 }, false, true),
  guild: GenAdvanture({ x: 320, y: 100 }, false, true),
};

export function getCEs(): number[] {
  var img = getScreenshot();
  var croppedImage1 = cropImage(img, 430, 88, 46, 10);
  var croppedImage2 = cropImage(img, 430, 148, 46, 10);
  var croppedImage3 = cropImage(img, 430, 208, 46, 10);
  var croppedImage4 = cropImage(img, 430, 266, 46, 12);

  var value1 = +recognizeWishingTreeRequirements(ICONS.numberImagesPVP, croppedImage1, 7, 0.75, 0.7) || 0;
  var value2 = +recognizeWishingTreeRequirements(ICONS.numberImagesPVP, croppedImage2, 7, 0.75, 0.7) || 0;
  var value3 = +recognizeWishingTreeRequirements(ICONS.numberImagesPVP, croppedImage3, 7, 0.75, 0.7) || 0;
  var value4 = +recognizeWishingTreeRequirements(ICONS.numberImagesPVP, croppedImage4, 7, 0.75, 0.7) || 0;

  releaseImage(croppedImage1);
  releaseImage(croppedImage2);
  releaseImage(croppedImage3);
  releaseImage(croppedImage4);
  releaseImage(img);
  return [value1, value2, value3, value4];
}

export function getMayhemScores() {
  var img = getScreenshot();
  var scores = [0, 0, 0];
  var imagesLocation = [
    [
      { x: 495, y: 56, w: 47, h: 12 },
      { x: 495, y: 84, w: 47, h: 12 },
      { x: 495, y: 110, w: 47, h: 12 },
    ],
    [
      { x: 495, y: 145, w: 47, h: 12 },
      { x: 495, y: 172, w: 47, h: 12 },
      { x: 495, y: 198, w: 47, h: 12 },
    ],
    [
      { x: 495, y: 232, w: 47, h: 12 },
      { x: 495, y: 260, w: 47, h: 12 },
      { x: 495, y: 288, w: 47, h: 12 },
    ],
  ];
  for (var mayhemIdx = 0; mayhemIdx < imagesLocation.length; mayhemIdx++) {
    for (var teamIdx = 0; teamIdx < imagesLocation[mayhemIdx].length; teamIdx++) {
      var tImage = imagesLocation[mayhemIdx][teamIdx];
      var croppedImage = cropImage(img, tImage.x, tImage.y, tImage.w, tImage.h);
      var value = +recognizeWishingTreeRequirements(ICONS.numberImagesPVP, croppedImage, 7, 0.7, 0.7) || 0;
      releaseImage(croppedImage);

      if (value > scores[mayhemIdx]) {
        scores[mayhemIdx] = value;
      }
    }
  }

  releaseImage(img);
  console.log('>> ', JSON.stringify(scores));
  return scores;
}

export function findSpecificIconInScreen(target: Icon, isDev?: boolean): { [idx: string]: { score: number; x: number; y: number } } {
  if (target.image === undefined) {
    target.loadImage();
  }
  return findSpecificImageInScreen(target.image, target.thres, isDev);
}

export function findSpecificImageInScreen(target: Image, threashold?: number, isDev?: boolean): { [idx: string]: { score: number; x: number; y: number } } {
  if (threashold === undefined) {
    threashold = 0.95;
  }

  var img = getScreenshot();
  var foundResults = findImages(img, target, threashold, 10, true);
  if (isDev) {
    console.log('findSpecificImageInScreen, found target icon at: ', JSON.stringify(foundResults));
  }
  releaseImage(img);
  return foundResults;
}

export function dynamicSort(property: any) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

// Stocks like 220/2, means need 2 while we have 200
export function ocrStocksInRect(rect: RECT, icons: Icon[]): number {
  var img = getScreenshot();
  var croppedImage = cropImage(img, rect.x, rect.y, rect.w, rect.h);
  releaseImage(img);

  var txt = recognizeWishingTreeRequirements(icons, croppedImage, 10, 0.8, 0.5);
  releaseImage(croppedImage);

  if (txt.length === 0) {
    return -1;
  } else if (txt.indexOf('/') === -1) {
    return -1;
  } else {
    var stock = txt.split('/');
    return +stock[0] - +stock[1];
  }
}

export function ocrNumberInRect(rect: RECT, icons: Icon[]): number {
  var img = getScreenshot();
  var croppedImage = cropImage(img, rect.x, rect.y, rect.w, rect.h);
  releaseImage(img);

  var txt = recognizeWishingTreeRequirements(icons, croppedImage, 10, 0.8, 0.5);
  releaseImage(croppedImage);

  if (txt.length === 0) {
    return -1;
  } else {
    return +txt;
  }
}

export function ocrTextInRect(rect: RECT, icons: Icon[]) {
  var img = getScreenshot();

  var croppedImage = cropImage(img, rect.x, rect.y, rect.w, rect.h);
  releaseImage(img);

  var results: { score: number; x: number; y: number; target: string }[] = [];
  for (var i in icons) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    var foundResults = findImages(croppedImage, icons[i].image, icons[i].thres, 10, true);
    for (var j in foundResults) {
      results.push({
        x: foundResults[j].x,
        y: foundResults[j].y,
        score: foundResults[j].score,
        target: icons[i].name,
      });
    }
  }
  results.sort(dynamicSort('x'));
  // console.log('=> ', JSON.stringify(results));

  releaseImage(croppedImage);
  return ocrResultToInt(results);
}

function ocrResultToInt(results: { score: number; x: number; y: number; target: string }[]) {
  if (results.length == 0) {
    return -1;
  }

  var digit_width = 4;
  var count = '';
  var idx = 1;
  while (idx < results.length) {
    if (results[idx].x - results[idx - 1].x < digit_width) {
      // results[i].score > results[i - 1].score ? results.splice(i - 1, 1) : results.splice(i, 1);
      if (results[idx].score > results[idx - 1].score) {
        results.splice(idx - 1, 1);
      } else {
        results.splice(idx, 1);
      }
    } else {
      idx++;
    }
    // console.log('>>', idx, JSON.stringify(results))
  }

  for (var i in results) {
    count += results[i].target;
  }

  return parseInt(count, 10);
}

var bountyLevelX = 20;
var bountyLevelYRange = [60, 84, 119, 158, 190, 230, 260, 296, 333];
export function countBountyLevel(rerouter: Rerouter) {
  for (var j = 0; j < bountyLevelYRange.length; j++) {
    if (rerouter.screen.isSameColor({ x: bountyLevelX, y: bountyLevelYRange[j], r: 205, g: 66, b: 36 })) {
      return j + 4; // first one in list is Lv.4
    }
  }
  return -1;
}

export function bountyCheckIfGetBluePowder(rerouter: Rerouter): number[] {
  const lastPowder = ocrTextInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);
  const bountyLevel = countBountyLevel(rerouter);

  if (bountyLevel > 6) {
    rerouter.screen.tap({ x: 40, y: 135 });
    Utils.sleep(2000);

    const bluePower = ocrTextInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);

    // console.log('Check if we need to get blue powder: ', bluePower, lastPowder);
    if (bluePower < lastPowder && bluePower < 350) {
      return [bluePower, 6];
    }
  }

  for (var j = 0; j < bountyLevelYRange.length; j++) {
    rerouter.screen.tap({ x: bountyLevelX, y: bountyLevelYRange[j] });
    Utils.sleep(300);
  }
  return [lastPowder, bountyLevel];
}

export function handleResearchInGnomeLab(rerouter: Rerouter, finishRound: any, targetIconList: Icon[], threashold: number) {
  for (var i = 0; i < 12; i++) {
    for (var imageIdx = 0; imageIdx < ICONS.iconsGnomeLabKingdom.length; imageIdx++) {
      let foundResults = findSpecificIconInScreen(targetIconList[imageIdx]);
      console.log('>', i, imageIdx, targetIconList[imageIdx].name, JSON.stringify(foundResults));

      for (let j = 0; j < Object.keys(foundResults).length; j++) {
        rerouter.screen.tap(foundResults[j]);
        if (
          rerouter.waitScreenForMatchingPage(
            new GroupPage('groupPageLabResult', [
              PAGES.rfpageCanTapResearch,
              PAGES.rfpageNotEnoughAuroraItemForReserch,
              PAGES.rfpageNotEnoughItemsForResearch,
              PAGES.rfpageResearchComplete,
            ]),
            3000
          )
        ) {
          if (rerouter.isPageMatch(PAGES.rfpageCanTapResearch)) {
            logs(TASKS.gnomeLab, `rfpageCanTapResearch, tap it`);
            rerouter.goNext(PAGES.rfpageCanTapResearch);

            if (rerouter.waitScreenForMatchingPage(PAGES.rfpageNotEnoughAuroraItemForReserch, 3000)) {
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
            rerouter.waitScreenForMatchingPage(PAGES.rfpageInGnomeLab, 2000);
          }
        }
      }
    }

    swipeFromToPoint(rerouter, { x: 600, y: 234 }, { x: -200, y: 234 }, 5, undefined, PAGES.rfpageInGnomeLab);
  }
}

function handleResearchInGnomeLab_bak(targetIconList: Icon[], threashold: number) {
  var foundResults = [];
  for (var i = 0; i < 12; i++) {
    for (var imageIdx = 0; imageIdx < targetIconList.length; imageIdx++) {
      foundResults = findSpecificImageInScreen(targetIconList[imageIdx].img, threashold);
      // console.log('>', i, JSON.stringify(foundResults), foundResults.length, foundResults.length > 0);
      if (foundResults.length > 0) {
        console.log('Tap gnome reserach check: ', targetIconList[imageIdx].name, JSON.stringify(foundResults));
        for (var j = 0; j < foundResults.length; j++) {
          qTap(foundResults[j]);
          sleep(config.sleepAnimate * 3);
          if (checkIsPage(pageCanTapResearch)) {
            if (!config.autoLabUseAuroraMaterial) {
              var hasAuroraRequirement = false;
              for (var auroraIndex = 0; auroraIndex < auroraItems.length; auroraIndex++) {
                if (findSpecificImageInScreen(auroraItems[auroraIndex].img, 0.92).length > 0) {
                  console.log('lab restrict use of aurora items, skip this one');
                  qTap(pnt(570, 31));
                  sleep(1500);
                  hasAuroraRequirement = true;
                  break;
                }
              }

              if (!hasAuroraRequirement) {
                console.log('About to researching without Aurora item: ', JSON.stringify(foundResults[j]));
                qTap(pageCanTapResearch);

                // Check for not enough items for research
                sleep(1000);
                if (checkIsPage(pageNotEnoughAuroraItemForReserch)) {
                  console.log('Not enough aurora items, continue');
                  qTap(pageNotEnoughAuroraItemForReserch);
                  sleep(1000);
                  qTap(pnt(570, 31));
                  sleep(1500);
                  break;
                } else if (checkIsPage(pageNotEnoughItemsForResearch)) {
                  console.log('Not enough items, continue');
                  qTap(pageNotEnoughItemsForResearch);
                  sleep(1000);
                  qTap(pnt(570, 31));
                  sleep(1500);
                  break;
                } else {
                  console.log('Start researching');
                }

                sendEvent('running', '');
                return true;
              }
            } else {
              console.log('About to researching without Aurora item: ', JSON.stringify(foundResults[j]));
              qTap(pageCanTapResearch);

              sleep(1000);
              if (checkIsPage(pageNotEnoughItemsForResearch)) {
                console.log('Not enough items, continue');
                qTap(pageNotEnoughItemsForResearch);
                sleep(1000);
                qTap(pnt(570, 31));
                sleep(1500);
                break;
              } else {
                sendEvent('running', '');
                console.log('Start researching');
              }

              return true;
            }
          } else {
            if (checkIsPage(pageInKingdomVillage)) {
              console.log('Lab research accidentally fall back to village, return with false');
              return false;
            } else if (!checkIsPage(pageInGnomeLab)) {
              console.log('Research requirement not met (btn not enabled)');
              keycode('BACK', 1000);
              sleep(config.sleepAnimate * 3);
            } else {
              console.log('Not in kingdom nor lab');
            }
          }
        }
      }
    }

    if (checkIsPage(pageAlreadyResearching)) {
      console.log('Already researching, skipping handleInGnomeLab');
      return true;
    }

    swipeFromToPoint(pnt(600, 234), pnt(-200, 234), 5, 0, undefined, pageInGnomeLab);
  }

  return false;
}

export function considerPurchaseSeasideMarket(rerouter: Rerouter, target: XY | RECT): boolean {
  if (target as RECT) {
    let newStock = ocrStocksInRect(target as RECT, ICONS.numberAuroraStockInTradeBird);
    console.log('newStock', newStock);
    if (newStock > 50) {
      rerouter.screen.tap(target);
      if (rerouter.waitScreenForMatchingPage(PAGES.rfpageMarketItemDetail, 2000)) {
        var productNowHave = ocrNumberInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
        console.log('productNowHave', productNowHave);

        if (newStock > productNowHave) {
          console.log('Purchased seaside market: ', newStock, productNowHave);
          rerouter.goNext(PAGES.rfpageMarketItemDetail);
          sleep(2000);
        } else {
          console.log('NOT purchased seaside market: ', newStock, productNowHave);
          rerouter.screen.tap({ x: 438, y: 90 }); // close the window
        }
      }
    }
  }

  return false;
}
