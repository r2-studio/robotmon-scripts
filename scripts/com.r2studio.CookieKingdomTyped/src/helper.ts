import { Rerouter, Utils, XYRGB, Page, XY, RECT, GroupPage } from 'Rerouter';
import * as PAGES from './pages';
import * as ICONS from './icons';
import * as CONSTANTS from './constants';
import { Advanture, Advantures, BotStatus, Icon, MessageWindow, Point, Records, TaskStatus, Wish, WishStatus, productState } from './types';
import { logs, padZero, sendEventRunning, sendKeyBack } from './utils';
import { TASKS } from './tasks';
import { CookieKingdom } from '..';

export function checkLoginFailedMaxReached(loginStatus: TaskStatus, loginRetryMaxTimes: number, cookieKingdom: CookieKingdom) {
  if (loginStatus.loginRetryCount > loginRetryMaxTimes) {
    cookieKingdom.stop();
    sendEvent('gameStatus', 'login-failed');
    logs('checkLoginFailedMaxReached', `Max retry count reached, login failed`);
    return true;
  } else {
    loginStatus.loginRetryCount++;
    logs('checkLoginFailedMaxReached', `Restart game as not inputing login info correctly: ${loginStatus.loginRetryCount}`);
    var rtn = execute('am force-stop com.devsisters.ck');
    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop com.devsisters.ck'
      );
    }
    sleep(3000);
    return false;
  }
}

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
  return swipeFromToPoint(rerouter, { x: startPnt.x, y: startPnt.y }, { x: -2000, y: startPnt.y }, 5);
}

export function swipeFromToPoint(rerouter: Rerouter, fromPnt: XY, toPnt: XY, steps: number, stopIfFoundPage?: Page | null, swipingPage?: Page) {
  if (swipingPage !== undefined && !rerouter.isPageMatch(swipingPage)) {
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
    // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i);
    sleep(100);
  }

  moveTo(toPnt.x, toPnt.y, 40, 0);
  sleep(500);
  tapUp(toPnt.x, toPnt.y, 40, 0);
  sleep(500);

  if (swipingPage !== undefined && !rerouter.isPageMatch(swipingPage)) {
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
  logs('checkScreenMessage', `Checking ${message.name}, expecting ${message.targetColorCount} points and got ${cnt} points`);
  // console.log('cnt vs messageScreen.targetColorCount vs messageScreen.targetColorThreashold: ', cnt, message.targetColorCount, message.targetColorThreashold);

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

    rerouter.screen.tap(wish.refreshPnt);
    Utils.sleep(CONSTANTS.sleep);
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
  // console.log('>> ', JSON.stringify(scores));
  return scores;
}

export function findSpecificIconInScreen(target: Icon, targetArea?: RECT, isDev?: boolean): Point[] {
  if (target.image === undefined) {
    target.loadImage();
  }
  return findSpecificImageInScreen(target.image, target.thres, targetArea, isDev);
}

export function findSpecificImageInScreen(target: Image, threashold?: number, targetArea?: RECT, isDev?: boolean): Point[] {
  if (threashold === undefined) {
    threashold = 0.95;
  }

  const img = getScreenshot();
  let croppedImage;
  let foundResults;
  if (targetArea !== undefined) {
    croppedImage = cropImage(img, targetArea.x, targetArea.y, targetArea.w, targetArea.h);
    foundResults = findImages(croppedImage, target, threashold, 10, true);
    releaseImage(croppedImage);
  } else {
    foundResults = findImages(img, target, threashold, 10, true);
  }
  releaseImage(img);

  if (isDev) {
    console.log('findSpecificImageInScreen, found target icon at: ', JSON.stringify(foundResults));
  }

  let rtn: Point[] = [];
  for (let key in foundResults) {
    rtn.push(foundResults[key]);
  }
  return rtn;
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
  console.log('>>', txt);
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
  const text = ocrTextInRect(rect, icons);
  if (text === '') {
    return -1;
  }
  return +text;

  // var img = getScreenshot();
  // var croppedImage = cropImage(img, rect.x, rect.y, rect.w, rect.h);
  // releaseImage(img);

  // var txt = recognizeWishingTreeRequirements(icons, croppedImage, 10, 0.8, 0.5);
  // releaseImage(croppedImage);

  // if (txt.length === 0) {
  //   return -1;
  // } else {
  //   return +txt;
  // }
}

export function ocrStockAndReqInRect(rect: RECT, icons: Icon[]): number[] {
  const text = ocrTextInRect(rect, icons, 0.78, 8);
  // console.log(`ocrStockAndReqInRect: ${JSON.stringify(rect)}, ${text}`);
  const values = text.split('/');
  if (values.length < 2) {
    return [+text, -1];
  }

  return [+values[0], +values[1]];
}

// 在市集中能正確讀出1,876
export function ocrTextInRect(rect: RECT, icons: Icon[], overrideThre?: number, overrideOverlap?: number): string {
  var img = getScreenshot();
  var croppedImage = cropImage(img, rect.x, rect.y, rect.w, rect.h);
  releaseImage(img);

  var results: { score: number; x: number; y: number; target: string }[] = [];
  for (var i in icons) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    const thres = overrideThre === undefined ? icons[i].thres : overrideThre;
    const overlap = overrideOverlap === undefined ? 10 : overrideOverlap;

    var foundResults = findImages(croppedImage, icons[i].image, thres, overlap, true);
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
  // console.log(`=> ocrTextInRect ${JSON.stringify(rect)}, ${icons.length},  ${JSON.stringify(results)}`);
  releaseImage(croppedImage);

  if (results.length == 0) {
    return '';
  }

  var digit_width = 4;
  var output = '';
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
    output += results[i].target;
  }

  // console.log('ocrTextInRect has output: ', output);
  return output;
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
  const lastPowder = ocrNumberInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);
  const bountyLevel = countBountyLevel(rerouter);

  if (bountyLevel > 6) {
    rerouter.screen.tap({ x: 40, y: 135 });
    Utils.sleep(2000);

    const bluePower = ocrNumberInRect({ x: 454, y: 10, w: 50, h: 18 }, ICONS.wNumbers);

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

export function considerPurchaseSeasideMarket(rerouter: Rerouter, target: RECT): boolean {
  let newStock = ocrStocksInRect(target, ICONS.numberAuroraStockInTradeBird);
  // let newStock = ocrStockAndReqInRect(target, ICONS.numberAuroraStockInTradeBird);
  console.log('considerPurchaseSeasideMarket, newStock', newStock, JSON.stringify(target));
  // TODO: 兩千多會讀不出來，確定幾百可以
  if (newStock > 50) {
    rerouter.screen.tap(target);
    if (rerouter.waitScreenForMatchingPage(PAGES.rfpageMarketItemDetail, 2000)) {
      // let productNowHave = ocrNumberInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
      let productNowHave = ocrTextInRect({ x: 330, y: 154, w: 28, h: 14 }, ICONS.bNumbers);
      logs('haborShopInSeaMarket', `Considering trade ${newStock} for ${productNowHave}`);

      if (newStock > productNowHave) {
        console.log('Purchased seaside market: ', newStock, productNowHave);
        rerouter.goNext(PAGES.rfpageMarketItemDetail);
        sleep(1000);
      } else {
        console.log('NOT purchased seaside market: ', newStock, productNowHave);
        rerouter.screen.tap({ x: 438, y: 90 }); // close the window
      }
    }
  }

  return false;
}

export function tapThroughAnimate(rerouter: Rerouter, targetPage: Page, tappingPoint: XY, timeInMs: number, interval?: number): boolean {
  if (interval === undefined) {
    interval = 500;
  }

  for (let i = 0; i < timeInMs; i += interval) {
    if (rerouter.isPageMatch(targetPage)) {
      return true;
    }
    rerouter.screen.tap(tappingPoint);
  }
  return false;
}

export function handleNextProductionBuilding(rerouter: Rerouter, buildTowardsTheLeft: boolean) {
  if (buildTowardsTheLeft) {
    rerouter.screen.tap({ x: 110, y: 174 }); // to left
  } else {
    rerouter.screen.tap({ x: 349, y: 174 }); // to right
  }
}

export function SwipeProductionMenuToTop(rerouter: Rerouter) {
  return swipeFromToPoint(rerouter, { x: 430, y: 80 }, { x: 430, y: 1500 }, 4);
}
export function swipeDownOneItem(rerouter: Rerouter) {
  tapDown(430, 319, 40, 0);
  sleep(500);
  moveTo(430, 319, 40, 0);
  sleep(500);
  moveTo(430, 280, 40, 0);
  sleep(500);
  moveTo(430, 230, 40, 0);
  sleep(500);
  moveTo(430, 200, 40, 0);
  sleep(500);
  moveTo(430, 176, 40, 0);
  sleep(1600);
  tapUp(430, 176, 40, 0);
  sleep(2000);

  // return swipeFromToPoint(rerouter, { x: 430, y: 319 }, { x: 430, y: 176 }, 5);
}
export function swipeDown3Items(rerouter: Rerouter) {
  // console.log('swipe down to 3 item as currently in:', this.config.currentProductionBuilding);
  tapDown(430, 350, 40, 0);
  sleep(500);
  moveTo(430, 350, 40, 0);
  sleep(500);
  moveTo(430, 250, 40, 0);
  sleep(500);
  moveTo(430, 150, 40, 0);
  sleep(500);
  moveTo(430, 50, 40, 0);
  sleep(500);
  moveTo(430, -70, 40, 0);
  sleep(1600);
  tapUp(430, -70, 40, 0);
  sleep(1600);

  // return swipeFromToPoint(rerouter, { x: 430, y: 350 }, { x: 430, y: -70 }, 7);
}
export function swipeToToolShop456(rerouter: Rerouter) {
  SwipeProductionMenuToTop(rerouter);
  tapDown(430, 350, 40, 0);
  sleep(500);
  moveTo(430, 350, 40, 0);
  sleep(500);
  moveTo(430, 250, 40, 0);
  sleep(500);
  moveTo(430, 150, 40, 0);
  sleep(500);
  moveTo(430, 50, 40, 0);
  sleep(500);
  moveTo(430, -80, 40, 0);
  sleep(500);
  moveTo(430, -170, 40, 0);
  sleep(1600);
  tapUp(430, -170, 40, 0);
  sleep(1600);
  // return swipeFromToPoint(rerouter, { x: 430, y: 350 }, { x: 430, y: -170 }, 7);
}

function findProductRequirements(rects: RECT[]) {
  var imgOri = getScreenshot();

  var omin = 150;
  var omax = 255;
  var img = inRange(imgOri, omin, omin, omin, omin, omax, omax, omax, omax);

  var part = [];
  for (let i = 0; i < rects.length; i++) {
    let rect = rects[i];
    var line1 = '';
    var cImg1 = cropImage(img, rect.x, rect.y, rect.w, rect.h);
    line1 = recognizeWishingTreeRequirements(ICONS.numberImagesProdutRequirements, cImg1, 12, 0.7, 0.5);
    releaseImage(cImg1);

    line1 = line1.trim();
    // console.log(line1);

    if (line1.length === 0) {
      // do nothing
    } else if (line1.indexOf('/') === -1) {
      part.push([line1.substr(0, line1.length - 1), line1.substr(line1.length - 1, 1)]);
    } else {
      part.push(line1.split('/'));
    }
  }

  for (var productIdx in part) {
    for (var reqIdx in part[productIdx]) {
      part[productIdx][reqIdx] = Number(part[productIdx][reqIdx]);
    }
  }

  // console.log('part:', JSON.stringify(part));
  releaseImage(imgOri);
  releaseImage(img);
  return part;
}

export function collectFinishedGoods(rerouter: Rerouter) {
  const rfpageProducing = new Page('rfpageProducing', [
    { x: 76, y: 86, r: 134, g: 231, b: 0 },
    { x: 61, y: 89, r: 123, g: 228, b: 0 },
    { x: 38, y: 32, r: 203, g: 235, b: 236 },
  ]);
  const rfpageCancelProduction = new Page(
    'rfpageCancelProduction',
    [
      { x: 443, y: 97, r: 57, g: 166, b: 231 },
      { x: 436, y: 97, r: 255, g: 255, b: 255 },
      { x: 390, y: 105, r: 57, g: 69, b: 107 },
      { x: 408, y: 241, r: 8, g: 166, b: 222 },
      { x: 296, y: 243, r: 8, g: 166, b: 222 },
    ],
    { x: 443, y: 97 }
  );
  const rfpageCancelMultipleProduction = new Page(
    'rfpageCancelMultipleProduction',
    [
      { x: 442, y: 94, r: 34, g: 85, b: 115 },
      { x: 404, y: 244, r: 8, g: 166, b: 222 },
      { x: 303, y: 246, r: 8, g: 166, b: 222 },
      { x: 430, y: 238, r: 222, g: 207, b: 198 },
    ],
    { x: 442, y: 94 }
  );

  // Try to collect finished goods
  if (!rerouter.isPageMatch(rfpageProducing)) {
    rerouter.screen.tap({ x: 51, y: 66 });

    if (rerouter.waitScreenForMatchingPage(new GroupPage('groupPageCancel', [rfpageCancelProduction, rfpageCancelMultipleProduction]), 2000)) {
      rerouter.goNext(rfpageCancelProduction);
      logs('collectFinishedGoods', 'Found ask to cancel dialog in production, close it');
    }
  }
}

function countMagicLabSlotAvailable(rerouter: Rerouter) {
  var groupPageMagicLabSlot = new GroupPage('groupPageMagicLabSlot', [
    new Page('firstSlot', [{ x: 55, y: 69, r: 82, g: 56, b: 107 }]),
    new Page('secondSlot', [{ x: 53, y: 120, r: 82, g: 56, b: 107 }]),
    new Page('thirdSlot', [{ x: 49, y: 168, r: 82, g: 56, b: 107 }]),
    new Page('fourthSlot', [{ x: 52, y: 223, r: 82, g: 56, b: 107 }]),
    new Page('fifthSlot', [{ x: 50, y: 264, r: 77, g: 55, b: 110 }]),
    new Page('sixSlot', [{ x: 48, y: 314, r: 82, g: 60, b: 115 }]),
  ]);
  var matchedPages = rerouter.getPagesMatchImage(groupPageMagicLabSlot, rerouter.screen.getCvtDevScreenshot());

  logs('countMagicLabSlotAvailable', `countMagicLabSlotAvailable: ${matchedPages.length}`);
  return matchedPages.length;
}

export function countProductionSlotAvailable(rerouter: Rerouter) {
  if (rerouter.isPageMatch(PAGES.rfpageInMagicLab)) {
    return countMagicLabSlotAvailable(rerouter);
  }

  var groupPageProductionSlot = new GroupPage('groupPageProductionSlot', [
    new Page('firstSlot', [
      { x: 50, y: 69, r: 146, g: 88, b: 52 },
      { x: 49, y: 68, r: 146, g: 88, b: 52 },
      { x: 70, y: 90, r: 166, g: 104, b: 65 },
      { x: 42, y: 86, r: 173, g: 105, b: 66 },
    ]),
    new Page('secondSlot', [
      { x: 50, y: 120, r: 146, g: 88, b: 52 },
      { x: 49, y: 111, r: 146, g: 88, b: 52 },
      { x: 46, y: 137, r: 173, g: 105, b: 66 },
    ]),
    new Page('thirdSlot', [
      { x: 50, y: 170, r: 146, g: 88, b: 52 },
      { x: 49, y: 169, r: 146, g: 88, b: 52 },
      { x: 46, y: 179, r: 142, g: 78, b: 44 },
    ]),
    new Page('fourthSlot', [
      { x: 50, y: 219, r: 146, g: 88, b: 52 },
      { x: 50, y: 218, r: 146, g: 88, b: 52 },
      { x: 42, y: 236, r: 173, g: 105, b: 66 },
    ]),
    new Page('fifthSlot', [
      { x: 50, y: 269, r: 146, g: 88, b: 52 },
      { x: 50, y: 268, r: 146, g: 88, b: 52 },
      { x: 46, y: 286, r: 157, g: 95, b: 55 },
    ]),
  ]);
  var matchedPages = rerouter.getPagesMatchImage(groupPageProductionSlot, rerouter.screen.getCvtDevScreenshot());

  // logs('countProductionSlotAvailable', `countProductionSlotAvailable: ${matchedPages.length}, ${JSON.stringify(matchedPages)}`);
  return matchedPages.length;
}

export function collectProductItemInfo(
  id: number,
  stockRect: RECT,
  needRect1: RECT,
  needRect2: RECT,
  productionTarget: number,
  safetyStock: number
): productState {
  const minimumTarget = id <= 3 ? Math.max(10, productionTarget * Math.pow(0.85, id)) : Math.max(10, productionTarget * Math.pow(0.6, id));
  let canProduce = false;
  let need1 = {
    stock: -1,
    consume: -1,
  };
  let need2 = {
    stock: -1,
    consume: -1,
  };

  const stock = ocrNumberInRect(stockRect, ICONS.bNumbers);
  if (stock === -1) {
    return {
      id: id,
      minimumTarget: minimumTarget,
      productionTarget: productionTarget,
      stockTargetFullfilledPercent: -1,
      canProduce: canProduce,
      notEnoughStock: false,
      stock: stock,
      need: [need1, need2],
    };
  }

  var requirements = findProductRequirements([needRect1, needRect2]);
  // console.log(`requirements: "${requirements}"`); // TODO: to remove
  if (requirements.length === 0) {
    return {
      id: id,
      minimumTarget: minimumTarget,
      productionTarget: productionTarget,
      stockTargetFullfilledPercent: stock / productionTarget,
      canProduce: canProduce,
      notEnoughStock: false,
      stock: stock,
      need: [need1, need2],
    };
  }

  need1 = {
    stock: +requirements[0][0],
    consume: +requirements[0][1],
  };

  if (requirements.length > 1) {
    need2 = {
      stock: +requirements[1][0],
      consume: +requirements[1][1],
    };
    canProduce = need1['stock'] - need1['consume'] > safetyStock && need2['stock'] - need2['consume'] > safetyStock;
  } else {
    canProduce = need1['stock'] - need1['consume'] > safetyStock;
  }

  return {
    id: id,
    minimumTarget: minimumTarget,
    productionTarget: productionTarget,
    stockTargetFullfilledPercent: stock / productionTarget,
    canProduce: canProduce,
    notEnoughStock: false,
    stock: stock,
    need: requirements.length > 1 ? [need1, need2] : [need1], // Pinecone birdy toy (etc,) only need 1 material
  };
}

export function makeGoodsToTarget(rerouter: Rerouter, goodsTarget: number, safetyStock: number, axeStockTo400: boolean) {
  const goodsLocation: { [key: number | string]: RECT } = {
    1: { x: 431, y: 101, w: 22, h: 12 },
    2: { x: 431, y: 209, w: 22, h: 12 },
    3: { x: 431, y: 315, w: 22, h: 12 },
    shovel: { x: 432, y: 317, w: 22, h: 16 },
    5: { x: 431, y: 106, w: 22, h: 12 },
    6: { x: 431, y: 213, w: 22, h: 12 },
    7: { x: 431, y: 319, w: 22, h: 12 },
  };
  const productsReqY: { [key: number]: number } = {
    1: 92,
    2: 199,
    3: 306,
    4: 308,
    5: 96,
    6: 203,
    7: 310,
  };

  // TODO: recognize building to reduce drop order time
  let goodsOneStock = ocrNumberInRect(goodsLocation[1], ICONS.bNumbers);
  if (goodsOneStock === -1) {
    logs('makeGoodsToTarget', `OCR count failed, swipe to top`);

    SwipeProductionMenuToTop(rerouter);
    goodsOneStock = ocrNumberInRect(goodsLocation[1], ICONS.bNumbers);
    if (goodsOneStock === -1) {
      console.log('OCR count failed twice, skip this round');
      return;
    }
  }

  console.log('about to let productionState');
  let productionState: { [key: number]: productState } = {
    1: collectProductItemInfo(
      1,
      goodsLocation[1],
      { x: 463, y: productsReqY[1], w: 50, h: 14 },
      { x: 520, y: productsReqY[1], w: 50, h: 14 },
      goodsTarget,
      safetyStock
    ),
  };

  for (let i of [2, 3]) {
    if (!rerouter.isPageMatch(PAGES.productMapping[i])) {
      break;
    }

    productionState[i] = collectProductItemInfo(
      i,
      goodsLocation[i],
      { x: 463, y: productsReqY[i], w: 50, h: 14 },
      { x: 520, y: productsReqY[i], w: 50, h: 14 },
      goodsTarget,
      safetyStock
    );
  }

  let availableSlots = countProductionSlotAvailable(rerouter);
  const productionPage = rerouter.getPagesMatch(PAGES.groupPageGoodsProdMenu);
  const productionName = productionPage.length > 0 ? productionPage[0].name : 'otherGoodShop';
  logs('makeGoodsToTarget', `> ${productionName} has ${availableSlots} available slots, productionState: ${JSON.stringify(productionState)}`);

  if (productionName !== 'otherGoodShop') {
    console.log('Special handle building:', productionName);
    swipeDownOneItem(rerouter);

    console.log('11:');
    if (rerouter.isPageMatch(PAGES.productMapping[4])) {
      console.log('22:');
      productionState[4] = collectProductItemInfo(
        4,
        goodsLocation['shovel'],
        { x: 463, y: 308, w: 50, h: 14 },
        { x: 520, y: 308, w: 50, h: 14 },
        goodsTarget,
        safetyStock
      );
      console.log('33:');
    }
  }

  console.log('swipping down =========');
  swipeFromToPoint(rerouter, { x: 464, y: 340 }, { x: 464, y: -1500 }, 4); // SwipeProductionMenuToBottom()

  console.log('44, productionState:', JSON.stringify(productionState));
  for (let i of [5, 6, 7]) {
    if (!rerouter.isPageMatch(PAGES.productMapping[i])) {
      break;
    }
    console.log('55:', i);
    productionState[i] = collectProductItemInfo(
      i,
      goodsLocation[i],
      { x: 463, y: productsReqY[i], w: 50, h: 14 },
      { x: 520, y: productsReqY[i], w: 50, h: 14 },
      goodsTarget,
      safetyStock
    );
    console.log('66:');
  }
  logs('makeGoodsToTarget', `> ${productionName} has ${availableSlots} available slots, productionState: ${JSON.stringify(productionState)}`);

  if (productionName === 'rfpageToolShop' && axeStockTo400) {
    productionState[1].productionTarget = 400;
    productionState[1].stockTargetFullfilledPercent = goodsOneStock / 400;
  }

  let itemToProduce: { [key: number]: productState } = {};
  let itemToProduceLater: { [key: number]: productState } = {};

  // check minimum req
  for (let key in productionState) {
    if (productionState[key].stock < productionState[key].minimumTarget) {
      itemToProduce[key] = productionState[key];
    }
  }

  // check user defined production target
  for (let key in productionState) {
    if (productionState[key].stock < goodsTarget) {
      itemToProduceLater[key] = productionState[key];
    }
  }

  let itemsToProduce = Object.keys(itemToProduce).map(key => itemToProduce[+key]);
  let itemsToProduceLater = Object.keys(itemToProduceLater).map(key => itemToProduceLater[+key]);
  itemsToProduce.sort(dynamicSort('stockTargetFullfilledPercent'));
  itemsToProduceLater.sort(dynamicSort('stockTargetFullfilledPercent'));
  for (const obj of itemsToProduceLater) {
    const keyExists = itemsToProduce.some(element => element['id'] === obj['id']);
    if (!keyExists) {
      itemsToProduce.push(obj);
    }
  }
  logs('makeGoodsToTarget', `>> ${productionName} has ${availableSlots} available slots, stocks to produce: ${JSON.stringify(itemsToProduce)}`);

  const rfpageLockedGood = new Page(
    'rfpageLockedGood',
    [
      { x: 351, y: 244, r: 121, g: 207, b: 12 },
      { x: 305, y: 244, r: 121, g: 207, b: 12 },
      { x: 425, y: 244, r: 219, g: 207, b: 199 },
      { x: 425, y: 105, r: 60, g: 70, b: 105 },
      { x: 417, y: 297, r: 235, g: 219, b: 207 },
      { x: 381, y: 316, r: 237, g: 237, b: 229 },
    ],
    { x: 351, y: 244 }
  );
  for (var id in itemsToProduce) {
    var item = itemsToProduce[id];

    if (item['stock'] === -1) {
      continue;
    }

    if (item['stockTargetFullfilledPercent'] > 1) {
      // logs(makeGoodsToTarget, `stockTargetFullfilledPercent > 1 should should be stock OCR error `);
      continue;
    }

    if (item['notEnoughStock']) {
      logs('makeGoodsToTarget', `panic as found notEnoughStock `);
      ii++;
    }

    if (!item['canProduce']) {
      logs('makeGoodsToTarget', `skip as not having enough raw materials for #${id}`);
      continue;
    }

    console.log('adding item', item['id'], 'from ' + item['stock'] + ' to > ', item['productionTarget'], JSON.stringify(item));

    switch (item['id']) {
      case 1:
      case 2:
      case 3:
        SwipeProductionMenuToTop(rerouter);
        SwipeProductionMenuToTop(rerouter);
        rerouter.goNext(PAGES.productMapping[item['id']]);
        break;
      case 4:
        SwipeProductionMenuToTop(rerouter);
        SwipeProductionMenuToTop(rerouter);
        swipeDownOneItem(rerouter);
        rerouter.goNext(PAGES.productMapping[item['id']]);
        break;
      case 5:
      case 6:
      case 7:
        SwipeProductionMenuToTop(rerouter);
        SwipeProductionMenuToTop(rerouter);
        swipeToToolShop456(rerouter);
        rerouter.goNext(PAGES.productMapping[item['id']]);
        break;
    }

    for (var timer = 0; timer < 4; timer++) {
      var latestCount = countProductionSlotAvailable(rerouter);
      if (rerouter.isPageMatch(PAGES.rfpageNotEnoughStock)) {
        logs('makeGoodsToTarget', `PAGES.rfpageNotEnoughStock`);
        rerouter.goNext(PAGES.rfpageNotEnoughStock);
        itemsToProduce[id]['notEnoughStock'] = true;
        sleep(800);
        break;
      } else if (rerouter.isPageMatch(rfpageLockedGood)) {
        logs('makeGoodsToTarget', `rfpageLockedGood`);
        rerouter.goNext(rfpageLockedGood);
        break;
      }
      if (latestCount === 0) {
        console.log('No more slots, stop at: ', item['id']);
        return itemsToProduce;
      }

      sleep(1000);
    }

    // Add check if there are no worker cookie
  }

  return itemsToProduce;
}

export function swipeDirection(rerouter: Rerouter, direction: XY, targetPage: Page | null, swippingPage: Page) {
  var tapableArea = {
    fromPnt: { x: 165, y: 90 },
    endPnt: { x: 566, y: 285 },
  };

  if (targetPage !== null && rerouter.isPageMatch(targetPage)) {
    logs('swipeDirection', `Already in page ${targetPage.name}, skip swipping`);
    return true;
  }

  var x = tapableArea.fromPnt.x + Math.random() * (tapableArea.endPnt.x - tapableArea.fromPnt.x);
  var y = tapableArea.fromPnt.y + Math.random() * (tapableArea.endPnt.y - tapableArea.fromPnt.y);

  var fromPnt = { x: x, y: y };
  var toPnt = { x: x + direction.x, y: y + direction.y };
  var steps = 4;

  if (swipeFromToPoint(rerouter, fromPnt, toPnt, steps, targetPage, swippingPage)) {
    // console.log('swipe successfully');
    return true;
  } else if (rerouter.isPageMatch(PAGES.rfpageInTradeHabor)) {
    console.log('swipeDirection skip to go to head and start over');
    return false;
  } else {
    console.log('pickup house, try again');
  }
  return false;
}

function distance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function filterFindIconResults(points: Point[], minDistance: number, debug?: boolean): Point[] {
  let result: Point[] = [];
  points.sort((a, b) => b.score - a.score);

  for (let point of points) {
    let isTooClose = result.some(p => {
      let distance = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));
      let tooClose = distance < minDistance;
      if (tooClose && debug) {
        console.log(`Point ${JSON.stringify(point)} is too close to ${JSON.stringify(p)}`);
      }
      return tooClose;
    });

    if (!isTooClose) {
      result.push(point);
    }
  }

  return result;
}

function difference(array1: Point[], array2: Point[]): Point[] {
  let onlyInArray1 = array1.filter(a => !array2.some(b => a.x === b.x && a.y === b.y));
  let onlyInArray2 = array2.filter(a => !array1.some(b => a.x === b.x && a.y === b.y));
  return [...onlyInArray1, ...onlyInArray2];
}

// 1. searchForCandyHouse
// 2. if !1, swipe directinos
export function searchForCandyHouse(rerouter: Rerouter): boolean {
  // 1. find and tap candy
  let foundResults = findSpecificIconInScreen(ICONS.iconCandy);
  let filteredResults = filterFindIconResults(foundResults, 15);
  // console.log(filteredResults.length, JSON.stringify(filteredResults), filteredResults.length, JSON.stringify(filteredResults));

  if (rerouter.isPageMatch(PAGES.rfpageInProduction)) {
    logs('searchForCandyHouse', 'Found in production so hit back then search for it');
    sendKeyBack();
    Utils.sleep(1500);
  }

  if (Object.keys(filteredResults).length === 0) {
    logs('searchForCandyHouse', 'findAndTapCandy did not see any candy > 0.95, skipping');
  } else {
    // Tap at most 5 possible candies
    let i = 0;
    while (i < Math.min(5, Object.keys(filteredResults).length)) {
      if (filteredResults[i].x < 93 || filteredResults[i].x > 575 || filteredResults[i].y < 37 || filteredResults[i].y > 300) {
        logs('searchForCandyHouse', `Skipped as this point exceed feasible area: (${filteredResults[i].x}, ${filteredResults[i].y}) (93<x<575, 37<y<300)`);
        i++;
        continue;
      }

      logs('searchForCandyHouse', `tapping: (${filteredResults[i].x}, ${filteredResults[i].y}) of ${JSON.stringify(filteredResults)}`);
      rerouter.screen.tap({ x: filteredResults[i].x + 5, y: filteredResults[i].y + 5 });

      if (rerouter.waitScreenForMatchingPage(PAGES.rfpageInCandyHouse, 2000)) {
        logs('searchForCandyHouse', `rfpageInCandyHouse, return and let rfpageInCandyHouse page handle it`);
        return true;
      }

      filteredResults = findSpecificIconInScreen(ICONS.iconCandy);
      logs('searchForCandyHouse', `candies left > ${i}, ${JSON.stringify(filteredResults)}`);
      i++;
    }
  }

  // 2. find and tap house, the arrow will move, so check multiple times
  for (let i = 0; i < 3; i++) {
    filteredResults = filterFindIconResults(findSpecificIconInScreen(ICONS.iconCandyHouseUpgradeArrow), 15);
    if (Object.keys(filteredResults).length > 0) {
      console.log('Found it via candyHouseUpgradeArrow:', JSON.stringify(filteredResults));
      break;
    }
    filteredResults = filterFindIconResults(findSpecificIconInScreen(ICONS.iconCandyHouseUpgradeArrow2), 15);
    if (Object.keys(filteredResults).length > 0) {
      console.log('Found it via candyHouseUpgradeArrow2:', JSON.stringify(filteredResults));
      break;
    }
    sleep(500);
  }
  if (Object.keys(filteredResults).length === 0) {
    logs('searchForCandyHouse', 'findAndTapCandy did not see any candy house upgrade arrow > 0.95, skipping');
    return false;
  }

  let i = 0;
  while (i < Object.keys(filteredResults).length) {
    if (filteredResults[i].x < 93 || filteredResults[i].x > 575 || filteredResults[i].y < 37 || filteredResults[i].y > 300) {
      logs(
        'searchForCandyHouse',
        `Skipped upgrade house as this point exceed feasible area: (${filteredResults[i].x}, ${filteredResults[i].y}) (93<x<575, 37<y<300)`
      );
      i++;
      continue;
    }

    logs(
      'searchForCandyHouse',
      `Tap candy house green upgrade at: (${filteredResults[i].x}, ${filteredResults[i].y + 25}) of ${JSON.stringify(filteredResults)}`
    );
    rerouter.screen.tap({ x: filteredResults[i].x, y: filteredResults[i].y + 25 });

    if (rerouter.waitScreenForMatchingPage(PAGES.rfpageInCandyHouse, 2000)) {
      logs(
        'searchForCandyHouse',
        `Found upgradeable candyhouse at ${filteredResults[i].x}, ${filteredResults[i].y + 25}, return and let candy house handle this`
      );
      return true;
    }
    i++;
  }

  console.log('Finish search for upgradable candy house');
  return false;
}

export function saveImageToDisk(filename?: string) {
  if (filename === undefined) {
    const date = new Date(Utils.getTaiwanTime());
    filename = `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}T${padZero(date.getHours())}.${padZero(date.getMinutes())}.${padZero(
      date.getSeconds()
    )}-crash-img.jpg`;
  }

  var img = getScreenshot();
  saveImage(img, '/sdcard/Pictures/Screenshots/robotmon/' + filename);
  console.log(`Write to file: ${filename}`);
  releaseImage(img);
}

export function configSharePref() {
  var rtn = execute('ls /data/data/com.devsisters.ck/shared_prefs');
  if (rtn === 'exit status 1') {
    console.log('Did not find shared_pref, removing all related dirs');
    execute('rm -r /data/data/com.devsisters.ck/app_payload_lib');
    execute('rm -r /data/data/com.devsisters.ck/cache');
    execute('rm -r /data/data/com.devsisters.ck/code_cache');
    execute('rm -r /data/data/com.devsisters.ck/.sealing_reports');
    execute('rm -r /data/data/com.devsisters.ck/files');
  }

  var lines = readFile('/data/data/com.devsisters.ck/shared_prefs/com.devsisters.ck.v2.playerprefs.xml').split('\n');
  for (var idx in lines) {
    if (lines[idx].indexOf('OPTION_MUTE_BGM') !== -1) {
      console.log(lines[idx]);
      lines[idx] = '<int name="OPTION_MUTE_BGM" value="1" />';
    } else if (lines[idx].indexOf('OPTION_MUTE_SE') !== -1) {
      console.log(lines[idx]);
      lines[idx] = '<int name="OPTION_MUTE_SE" value="1" />';
    } else if (lines[idx].indexOf('OPTION_MUTE_VOICE') !== -1) {
      console.log(lines[idx]);
      lines[idx] = '<int name="OPTION_MUTE_VOICE" value="1" />';
    } else if (lines[idx].indexOf('OPTION_USE_LIGHT_SAFE_FILTER') !== -1) {
      console.log(lines[idx]);
      lines[idx] = '<int name="OPTION_USE_LIGHT_SAFE_FILTER" value="1" />';
    } else if (lines[idx].indexOf('OPTION_HIDE_SKILL_EFFECT') !== -1) {
      console.log(lines[idx]);
      lines[idx] = '<int name="OPTION_HIDE_SKILL_EFFECT" value="1" />';
    }
  }

  rtn = writeFile('/data/data/com.devsisters.ck/shared_prefs/com.devsisters.ck.v2.playerprefs.xml', lines.join('\n'));
  console.log('Write file return: ', rtn);
}

export function mergeObject(target: any) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        // console.log('merge type: ', key, source[key], typeof(source[key]))
        target[key] = source[key];
      }
    }
  }
  return target;
}

export function checkIfInBattle(rerouter: Rerouter, task: string, botStatus: BotStatus): boolean {
  // read the life bar of both players
  const rfpagePvPBattling = new Page('rfpageBattling', [
    // From PVP
    // { x: 284, y: 17, r: 145, g: 219, b: 143 },
    // { x: 351, y: 16, r: 77, g: 32, b: 12 },

    // From Super mayhem
    { x: 354, y: 14, r: 125, g: 12, b: 251 },
    { x: 285, y: 15, r: 65, g: 205, b: 12 },
  ]);
  const rfpageBountyBattle = new Page('rfpageBountyBattle', [
    { x: 454, y: 21, r: 82, g: 209, b: 0 },
    { x: 591, y: 10, r: 255, g: 255, b: 255 },
  ]);
  const rfpageTOSCBattle = new Page('rfpageTOSCBattle', [
    { x: 608, y: 41, r: 47, g: 35, b: 38 },
    { x: 616, y: 17, r: 205, g: 205, b: 203 },
  ]);
  const rfpageInIslandBattle = new Page('rfpageInIslandBattle', [
    { x: 594, y: 12, r: 249, g: 37, b: 38 },
    { x: 590, y: 20, r: 24, g: 24, b: 24 },
    { x: 453, y: 21, r: 85, g: 211, b: 2 },
  ]);
  const rfpageCookieAllianceBattle = new Page('rfpageCookieAlliance', [
    { x: 442, y: 20, r: 85, g: 215, b: 2 },
    { x: 36, y: 21, r: 51, g: 227, b: 255 },
  ]);
  const rfpageGuildDragonBattle = new Page('rfpageGuildDragonBattle', [
    { x: 556, y: 12, r: 90, g: 27, b: 175 },
    { x: 158, y: 338, r: 126, g: 247, b: 51 },
  ]);

  const rfpageAutoUseSkillEnabled = new Page('rfpageAutoUseSkillEnabled', [{ x: 28, y: 291, r: 223, g: 221, b: 1 }], { x: 41, y: 289 });
  const rfpageAutoUseSkillNotEnabled = new Page('rfpageAutoUseSkillNotEnabled', [{ x: 41, y: 289, r: 203, g: 203, b: 203 }], { x: 41, y: 289 });
  const rfpageAutoUseSkillNotEnabled2 = new Page('rfpageAutoUseSkillNotEnabled2', [{ x: 41, y: 289, r: 197, g: 193, b: 195 }], { x: 41, y: 289 });

  const rfpageSpeedBoostEnabled = new Page('rfpageSpeedBoostEnabled', [{ x: 32, y: 331, r: 161, g: 159, b: 8 }]);
  const rfpageSpeedBoost25Enabled = new Page('rfpageSpeedBoost25Enabled', [{ x: 36, y: 334, r: 153, g: 151, b: 8 }]);
  const rfpageSpeedBoostNotEnabled = new Page('rfpageSpeedBoostNotEnabled', [{ x: 33, y: 319, r: 203, g: 203, b: 203 }], { x: 33, y: 319 });
  const rfpageSpeed1_2x = new Page(
    'rfpageSpeed1_2x',
    [
      { x: 20, y: 333, r: 211, g: 209, b: 2 },
      { x: 32, y: 334, r: 161, g: 159, b: 8 },
    ],
    { x: 20, y: 333 }
  );

  const gpInBattle = new GroupPage('gpInBattle', [
    rfpagePvPBattling,
    rfpageBountyBattle,
    rfpageTOSCBattle,
    rfpageInIslandBattle,
    rfpageCookieAllianceBattle,
    rfpageGuildDragonBattle,

    rfpageAutoUseSkillEnabled,
    rfpageAutoUseSkillNotEnabled,
    rfpageAutoUseSkillNotEnabled2,

    rfpageSpeedBoostEnabled,
    rfpageSpeedBoost25Enabled,
    rfpageSpeedBoostNotEnabled,
    rfpageSpeed1_2x,
  ]);

  const matchedBattlePages = rerouter.getPagesMatch(gpInBattle);
  if (matchedBattlePages.length === 0) {
    return false;
  }

  logs('checkIfInBattle', `Found matched battle page: ${JSON.stringify(matchedBattlePages)}`);
  if (matchedBattlePages.some(element => element.name === 'rfpageAutoUseSkillEnabled')) {
    logs('checkIfInBattle', `Auto skill correctly enabled`);
  } else if (matchedBattlePages.some(element => element.name === 'rfpageAutoUseSkillNotEnabled' || element.name === 'rfpageAutoUseSkillNotEnabled2')) {
    rerouter.goNext(rfpageAutoUseSkillNotEnabled);
    Utils.sleep(1500);
    logs('checkIfInBattle', `Tap auto skill enable 1 time for rfpageAutoUseSkillNotEnabled`);
  }

  if (matchedBattlePages.some(element => element.name === 'rfpageSpeedBoostEnabled' || element.name === 'rfpageSpeedBoost25Enabled')) {
    logs('checkIfInBattle', `Speed boost correctly enabled`);
  } else if (matchedBattlePages.some(element => element.name === 'rfpageSpeedBoostNotEnabled')) {
    rerouter.goNext(rfpageSpeedBoostNotEnabled);
    Utils.sleep(1500);
    rerouter.goNext(rfpageSpeedBoostNotEnabled);
    Utils.sleep(1500);
    logs('checkIfInBattle', `Tap speed boost 2 times for rfpageSpeedBoostNotEnabled`);
  } else if (matchedBattlePages.some(element => element.name === 'rfpageSpeed1_2x')) {
    rerouter.goNext(rfpageSpeedBoostNotEnabled);
    Utils.sleep(1500);
    logs('checkIfInBattle', `Tap speed boost 1 time for rfpageSpeed1_2x`);
  }

  // 如果打太久要停
  let maxBattleTimeInMins;
  switch (task) {
    case TASKS.tropicalIslandClearBubble:
      maxBattleTimeInMins = 10;
      break;
    case TASKS.guildBattleAlliance:
      maxBattleTimeInMins = 40;
      break;
    default:
      maxBattleTimeInMins = 3;
  }

  if (botStatus.battleStarted === 0) {
    logs('checkIfInBattle', `battle started`);
    botStatus.battleStarted = Date.now();
  } else if (Date.now() - botStatus.battleStarted > maxBattleTimeInMins * CONSTANTS.minuteInMs) {
    logs('checkIfInBattle', `Max battle time reached (${Date.now() - botStatus.battleStarted > maxBattleTimeInMins * CONSTANTS.minuteInMs}), force stop`);
    rerouter.screen.tap({ x: 615, y: 19 });
    Utils.sleep(1500);
    rerouter.screen.tap({ x: 321, y: 198 });
    return true;
  } else if (Date.now() - botStatus.battleStarted < 10 * CONSTANTS.minuteInMs) {
    logs('checkIfInBattle', `battle last: ${(Date.now() - botStatus.battleStarted) / CONSTANTS.minuteInMs} mins`);
  }

  sendEventRunning(botStatus);
  return true;
}
