import { Rerouter, rerouter, Utils, XYRGB, Page, XY, MessageWindow } from 'Rerouter';
import * as PAGES from './pages';
import * as CONSTANTS from './constants';

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
