import { Rerouter, Utils, XYRGB, Page, XY, MessageWindow, Icon } from 'Rerouter';
import * as PAGES from './pages';
import * as ICONS from './icons';
import * as CONSTANTS from './constants';
import { Records, Wish, WishStatus } from './types';
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
  rerouter.screen.tapDown({ x: startPnt.x, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: startPnt.x / 2, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: 0, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: -1000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.moveTo({ x: -2000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleep);
  rerouter.screen.tapUp({ x: -2000, y: startPnt.y });
  Utils.sleep(CONSTANTS.sleepAnimate * 3);
}

export function checkScreenMessage(rerouter: Rerouter, message: MessageWindow, pageMessageWindow: Page) {
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
  // console.log(
  //   'cnt vs messageScreen.targetColorCount vs messageScreen.targetColorThreashold: ',
  //   cnt,
  //   messageScreen.targetColorCount,
  //   messageScreen.targetColorThreashold
  // );

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
