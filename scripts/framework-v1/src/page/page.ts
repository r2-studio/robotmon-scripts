import { Colors } from '../utils/color';
import { XY, XYRGB } from './point';
import { Screen } from '../screen/screen';
import { getImageColor, Image, releaseImage, sleep } from '../robotmonRawAPI';

export class Page {
  public static debug = false;

  public name: string;
  public points: XYRGB[];
  public next?: XY;
  public back?: XY;

  public constructor(name: string, devPoints: XYRGB[], next: XY | undefined = undefined, back: XY | undefined = undefined) {
    this.name = name;
    this.points = devPoints;
    this.next = next;
    this.back = back;
  }

  public goNext(screen: Screen) {
    if (this.next === undefined) {
      if (Page.debug) {
        console.log(`Warning Page: ${this.name} has no next xy`);
      }
      return;
    }
    screen.tap(this.next);
  }

  public goBack(screen: Screen) {
    if (this.back === undefined) {
      if (Page.debug) {
        console.log(`Warning Page: ${this.name} has no back xy`);
      }
      return;
    }
    screen.tap(this.back);
  }

  public isMatchImage(img: Image, thres: number = 0.9): boolean {
    let same = true;
    for (const point of this.points) {
      const screenColor = getImageColor(img, point.x, point.y);
      const score = Colors.identityColor(point, screenColor);
      if (score < thres) {
        same = false;
        break;
      }
    }
    return same;
  }

  public isMatchScreen(screen: Screen, thres: number = 0.9): boolean {
    const img = screen.getCvtDevScreenshot();
    const same = this.isMatchImage(img, thres);
    releaseImage(img);
    return same;
  }

  public waitScreenForMatchingScreen(screen: Screen, timeout: number, matchTimes: number = 1, interval = 600, thres: number = 0.9): boolean {
    if (Page.debug) {
      console.log(`Page.waitScreenForMatchingScreen ${this.name}`);
    }
    const now = Date.now();
    let matchs = 0;
    while (Date.now() - now < timeout) {
      if (this.isMatchScreen(screen, thres)) {
        matchs++;
      }
      if (matchs >= matchTimes) {
        break;
      }
      sleep(interval);
    }

    if (matchs >= matchTimes) {
      if (Page.debug) {
        console.log(`Page.waitScreenForMatchingScreen ${this.name} success, usedTime ${Date.now() - now}`);
      }
      return true;
    }
    if (Page.debug) {
      console.log(`Page.waitScreenForMatchingScreen ${this.name} timeout`);
    }
    return false;
  }
}
