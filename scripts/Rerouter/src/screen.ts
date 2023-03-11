import { ScreenConfig, XY, XYRGB } from './struct';
import { Utils } from './utils';

export class Screen {
  public static debug: boolean = false;

  private config: ScreenConfig;

  public constructor(config: ScreenConfig) {
    this.config = config;
  }

  public calculateDeviceOffset(func: (screen: Screen) => { screenWidth: number; screenHeight: number; screenOffsetX: number; screenOffsetY: number }) {
    const results = func(this);
    this.config.screenWidth = results.screenWidth;
    this.config.screenHeight = results.screenHeight;
    this.config.screenOffsetX = results.screenOffsetX;
    this.config.screenOffsetY = results.screenOffsetY;
  }

  public getScreenX(devX: number): number {
    return Math.floor(this.config.screenOffsetX + (devX * this.config.screenWidth) / this.config.devWidth) || 0;
  }

  public getScreenY(devY: number): number {
    return Math.floor(this.config.screenOffsetY + (devY * this.config.screenHeight) / this.config.devHeight) || 0;
  }

  public getScreenXY(devXY: XY): { x: number; y: number };
  public getScreenXY(devX: number, devY: number): { x: number; y: number };
  public getScreenXY(p1: any, p2: any = undefined): { x: number; y: number } {
    if (typeof p1 === 'object') {
      const x = this.getScreenX(p1.x);
      const y = this.getScreenY(p1.y);
      return { x, y };
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const x = this.getScreenX(p1);
      const y = this.getScreenY(p2);
      return { x, y };
    } else {
      throw new Error(`getScreenXY wrong params ${p1}, ${p2}`);
    }
  }

  public tap(devXY: { x: number; y: number }): void;
  public tap(devX: number, devY: number): void;
  public tap(p1: any, p2: any = undefined): void {
    if (typeof p1 === 'object') {
      const x = this.getScreenX(p1.x);
      const y = this.getScreenY(p1.y);
      tap(x, y, this.config.actionDuring);
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const x = this.getScreenX(p1);
      const y = this.getScreenY(p2);
      tap(x, y, this.config.actionDuring);
    } else {
      throw new Error(`tapDown wrong params ${p1}, ${p2}`);
    }
  }

  public tapDown(devXY: { x: number; y: number }): void;
  public tapDown(devX: number, devY: number): void;
  public tapDown(p1: any, p2: any = undefined): void {
    if (typeof p1 === 'object') {
      const x = this.getScreenX(p1.x);
      const y = this.getScreenY(p1.y);
      tapDown(x, y, this.config.actionDuring);
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const x = this.getScreenX(p1);
      const y = this.getScreenY(p2);
      tapDown(x, y, this.config.actionDuring);
    } else {
      throw new Error(`tapDown wrong params ${p1}, ${p2}`);
    }
  }

  public moveTo(devXY: { x: number; y: number }): void;
  public moveTo(devX: number, devY: number): void;
  public moveTo(p1: any, p2: any = undefined): void {
    if (typeof p1 === 'object') {
      const x = this.getScreenX(p1.x);
      const y = this.getScreenY(p1.y);
      moveTo(x, y, this.config.actionDuring);
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const x = this.getScreenX(p1);
      const y = this.getScreenY(p2);
      moveTo(x, y, this.config.actionDuring);
    } else {
      throw new Error(`tapDown wrong params ${p1}, ${p2}`);
    }
  }

  public tapUp(devXY: { x: number; y: number }): void;
  public tapUp(devX: number, devY: number): void;
  public tapUp(p1: any, p2: any = undefined): void {
    if (typeof p1 === 'object') {
      const x = this.getScreenX(p1.x);
      const y = this.getScreenY(p1.y);
      tapUp(x, y, this.config.actionDuring);
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const x = this.getScreenX(p1);
      const y = this.getScreenY(p2);
      tapUp(x, y, this.config.actionDuring);
    } else {
      throw new Error(`tapDown wrong params ${p1}, ${p2}`);
    }
  }

  public getScreenColor(devXY: { x: number; y: number }): RGB;
  public getScreenColor(devX: number, devY: number): RGB;
  public getScreenColor(p1: any, p2: any = undefined): RGB {
    if (typeof p1 === 'object') {
      const img = this.getCvtDevScreenshot();
      const rgb = getImageColor(img, p1.x, p1.y);
      releaseImage(img);
      return rgb;
    } else if (typeof p1 === 'number' && typeof p2 === 'number') {
      const img = this.getCvtDevScreenshot();
      const rgb = getImageColor(img, p1, p2);
      releaseImage(img);
      return rgb;
    } else {
      throw new Error(`tapDown wrong params ${p1}, ${p2}`);
    }
  }

  public findImage(devImg: Image): { score: number; x: number; y: number } {
    const img = this.getCvtDevScreenshot();
    const result = findImage(img, devImg);
    releaseImage(img);
    return result;
  }

  public tapImage(devImg: Image) {
    const xy = this.findImage(devImg);
    this.tap(xy);
  }

  public isSameColor(devColorPoint: XYRGB, thres: number = 0.9): boolean {
    const rgb = this.getScreenColor(devColorPoint);
    const score = Utils.identityColor(rgb, devColorPoint);
    if (score > thres) {
      return true;
    }
    return false;
  }

  // currently real device screenshot
  public getDeviceScreenshot(): Image {
    return getScreenshot();
  }

  // currently device screenshot cut by offset
  public getScreenScreenshot(): Image {
    return getScreenshotModify(
      this.config.screenOffsetX,
      this.config.screenOffsetY,
      this.config.screenWidth,
      this.config.screenHeight,
      this.config.screenWidth,
      this.config.screenHeight,
      100
    );
  }

  public getCvtDevScreenshot(): Image {
    return getScreenshotModify(
      this.config.screenOffsetX,
      this.config.screenOffsetY,
      this.config.screenWidth,
      this.config.screenHeight,
      this.config.devWidth,
      this.config.devHeight,
      100
    );
  }

  public getRotation(): 'vertical' | 'horizontal' {
    const { width, height } = getScreenSize();
    if (width > height) {
      return 'horizontal';
    }
    return 'vertical';
  }

  public getImageRotation(image: Image): 'vertical' | 'horizontal' {
    const { width, height } = getImageSize(image);
    if (width > height) {
      return 'horizontal';
    }
    return 'vertical';
  }

  public setActionDuring(during: number) {
    this.config.actionDuring = during;
  }
}
