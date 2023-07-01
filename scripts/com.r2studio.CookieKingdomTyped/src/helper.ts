import { Rerouter, Utils, XYRGB, Page, XY, MessageWindow, Icon } from 'Rerouter';
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
  bounties: GenAdvanture({ x: 500, y: 100 }, false, false),
  guild: GenAdvanture({ x: 630, y: 100 }, false, false),
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

function handleGotoAdventure(targetAdvanture: Advantures, targetPage: Page, rerouter: Rerouter) {
  logs('handleGotoAdventure task', `going to Advanture: ${targetAdvanture} with page: ${targetPage}`);

  if (rerouter.isPageMatch(targetPage)) {
    return true;
  }

  // Route from Head
  if (AdvanturesBountiesAt3rd[targetAdvanture].fromHead) {
  }

  if (!checkIsPage(targetPage)) {
    // Route from Head
    if (AdvanturesBountiesAt3rd[targetAdvanture].fromHead) {
      if (!checkIsPage(pageInCookieHead)) {
        if (!checkIsPage(pageInKingdomVillage)) {
          handleTryHitBackToKingdom();
        }

        // Tap head
        if (checkScreenMessage(messageNotifyQuit)) {
          // todo: debug log
          console.log('seems like im in notify quit page');
        }
        // Tap head
        if (!waitUntilSeePage(pageInCookieHead, 12, pnt(20, 30), null, 3)) {
          console.log('Failed to get to cookie head in', 12, 'secs, skipping');

          handleGotoKingdomPage();
          return false;
        }
      }

      // swipe to the end of the list in head
      for (var i = 0; i < 3; i++) {
        tapDown(560, 186, 40, 0);
        sleep(config.sleep);
        moveTo(560, 186, 40, 0);
        sleep(config.sleep);
        moveTo(400, 186, 40, 0);
        sleep(config.sleep);
        moveTo(200, 186, 40, 0);
        sleep(config.sleep);
        moveTo(0, 186, 40, 0);
        sleep(config.sleep);
        tapUp(0, 186, 40, 0);
        sleep(config.sleepAnimate * 2);
      }

      qTap(AdvanturesBountiesAt3rd[targetAdvanture].pnt);
      if (waitUntilSeePage(targetPage, 15)) {
        console.log(targetAdvanture, 'page found');
        return true;
      }
      return false;
    }

    // Route from PLAY! btn
    if (!checkIsPage(pageChooseAdvanture)) {
      if (!checkIsPage(pageInKingdomVillage)) {
        handleGotoKingdomPage();
      }
      if (!waitUntilSeePage(pageInKingdomVillage, 6)) {
        console.log('Skipping ', targetAdvanture, ' as cannot goto kingdom');
        return false;
      }

      qTap(pnt(560, 330)); // tap play
      if (!rfpageSelectAdvanture.waitScreenForMatchingScreen(this.screen, 6000)) {
        console.log('failed to goto choose adventure, skipping');
        return false;
      }
    }

    var destination;
    if (checkIsPage(pageBountiesAt2ndSlot)) {
      console.log('pageBountiesAt2ndSlot', JSON.stringify(AdvanturesBountiesAt2nd[targetAdvanture]));
      destination = AdvanturesBountiesAt2nd[targetAdvanture];
    } else if (checkIsPage(pageBountiesAt3rdSlot)) {
      console.log('pageBountiesAt3rdSlot', JSON.stringify(AdvanturesBountiesAt3rd[targetAdvanture]));
      destination = AdvanturesBountiesAt3rd[targetAdvanture];
    } else if (checkIsPage(pageBountiesAt4rdSlot)) {
      console.log('pageBountiesAt4rdSlot', JSON.stringify(AdvanturesBountiesAt4th[targetAdvanture]));
      destination = AdvanturesBountiesAt4th[targetAdvanture];
    }

    if (destination.backward) {
      for (var swipe = 0; swipe < 3; swipe++) {
        tapDown(600, 190, 40, 0);
        sleep(config.sleep);
        moveTo(200, 190, 40, 0);
        sleep(config.sleep);
        moveTo(0, 190, 40, 0);
        sleep(config.sleep);
        moveTo(-400, 190, 40, 0);
        sleep(config.sleep);
        tapUp(-400, 190, 40, 0);
        sleep(config.sleepAnimate);
      }
    }

    qTap(destination.pnt);
    if (waitUntilSeePage(targetPage, 8, destination.pnt, null, 3)) {
      return true;
    } else {
      console.log('Cannot goto ', JSON.stringify(destination), ', skipping');
      return false;
    }
  } else {
    console.log('already in target page');
    return true;
  }
}

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
