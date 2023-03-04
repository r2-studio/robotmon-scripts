// robotmon function
export declare type RGB = { r: number; g: number; b: number };
export declare type Image = any;
// basic apis
export declare function getStoragePath(): string;
export declare function sendEvent(event: string, content: string): void;
export declare function execute(command: string): string;
export declare function sleep(during: number): void;
export declare function getImageSize(img: Image): { width: number; height: number };
export declare function getImageColor(img: Image, x: number, y: number): RGB;
export declare function identityColorScore(hex1: string, hex2: string): number;
export declare function isSameColor(hex1: string, hex2: string, threshold: number): boolean;
export declare function getScreenSize(): { width: number; height: number };
export declare function getScreenshot(): Image;
export declare function getScreenshotModify(
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  resizeWidth: number,
  resizeHeight: number,
  quality: number
): Image;
export declare function releaseImage(img: Image): void;
export declare function getIdentityScore(source: Image, target: Image): number;
export declare function cropImage(img: Image, x: number, y: number, w: number, h: number): any;
export declare function findImage(sourceImg: Image, targetImg: Image): { score: number; x: number; y: number };
export declare function findImages(
  sourceImg: Image,
  targetImg: Image,
  scoreLimit: number,
  resultCountLimit: number,
  withoutOverlap: boolean
): { [idx: string]: { score: number; x: number; y: number } };
export declare function resizeImage(img: Image, w: number, h: number): any;
export declare function saveImage(img: Image, path: string): void;
export declare function openImage(path: string): Image;
export declare function drawCircle(img: Image, x: number, y: number, radius: number, r: number, g: number, b: number, a: number): void;
export declare function tap(x: number, y: number, during: number): void;
export declare function tapDown(x: number, y: number, during: number): void;
export declare function tapDown(x: number, y: number, during: number, id: number): void;
export declare function tapUp(x: number, y: number, during: number): void;
export declare function tapUp(x: number, y: number, during: number, id: number): void;
export declare function moveTo(x: number, y: number, during: number): void;
export declare function moveTo(x: number, y: number, during: number, id: number): void;
export declare function swipe(x1: number, y1: number, x2: number, y2: number): void;
export declare function keycode(label: string, during: number): void;
export declare function typing(words: string, during: number): void;
// opencv apis
export declare function clone(sourceImg: Image): Image;
export declare enum SmoothType {
  CV_BLUR_NO_SCALE = 0,
  CV_BLUR = 1,
  CV_GAUSSIAN = 2,
  CV_MEDIAN = 3,
  CV_BILATERAL = 4,
}
export declare function smooth(sourceImg: Image, smoothType: SmoothType, size: number): Image;
export declare enum ConvertColorCode {
  CV_BGR2HSV = 40,
  CV_BGR2HLS = 52,
}
export declare function convertColor(sourceImg: Image, code: ConvertColorCode): Image;
export declare function bgrToGray(sourceImg: Image): void;
export declare function absDiff(sourceImg: Image, targetImg: Image): Image;
export declare enum ThresholdCode {
  CV_THRES_BINARY = 0,
}
export declare function threshold(sourceImg: Image, thr: number, maxThr: number, code: ThresholdCode): void;
export declare function eroid(sourceImg: Image, width: number, height: number, x: number, y: number): void;
export declare function dilate(sourceImg: Image, width: number, height: number, x: number, y: number): void;
export declare function inRange(
  sourceImg: Image,
  minB: number,
  minG: number,
  minR: number,
  minA: number,
  maxB: number,
  maxG: number,
  maxR: number,
  maxA: number
): Image;
export declare function outRange(
  sourceImg: Image,
  minB: number,
  minG: number,
  minR: number,
  minA: number,
  maxB: number,
  maxG: number,
  maxR: number,
  maxA: number
): Image;
export declare function cloneWithMask(sourceImg: Image, mask: Image): Image;
export declare enum HoughMethod {
  CV_HOUGH_GRADIENT = 3,
}
export declare function houghCircles(
  sourceImg: Image,
  method: HoughMethod,
  dp: number,
  minDist: number,
  p1: number,
  p2: number,
  minR: number,
  maxR: number
): { [i: string]: { x: number; y: number; r: number } };
export declare function getBase64FromImage(image: any): string;
export declare function httpClient(method: string, url: string, body: string, headers: { [key: string]: string }): string;
