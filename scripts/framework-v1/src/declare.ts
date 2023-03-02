// robotmon function
declare type RGB = { r: number; g: number; b: number };
declare type Image = any;
// basic apis
declare function getStoragePath(): string;
declare function sendEvent(event: string, content: string): void;
declare function execute(command: string): string;
declare function sleep(during: number): void;
declare function getImageSize(img: Image): { width: number; height: number };
declare function getImageColor(img: Image, x: number, y: number): RGB;
declare function identityColorScore(hex1: string, hex2: string): number;
declare function isSameColor(hex1: string, hex2: string, threshold: number): boolean;
declare function getScreenSize(): { width: number; height: number };
declare function getScreenshot(): Image;
declare function getScreenshotModify(
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  resizeWidth: number,
  resizeHeight: number,
  quality: number
): Image;
declare function releaseImage(img: Image): void;
declare function getIdentityScore(source: Image, target: Image): number;
declare function cropImage(img: Image, x: number, y: number, w: number, h: number): any;
declare function findImage(sourceImg: Image, targetImg: Image): { score: number; x: number; y: number };
declare function findImages(
  sourceImg: Image,
  targetImg: Image,
  scoreLimit: number,
  resultCountLimit: number,
  withoutOverlap: boolean
): { [idx: string]: { score: number; x: number; y: number } };
declare function resizeImage(img: Image, w: number, h: number): any;
declare function saveImage(img: Image, path: string): void;
declare function openImage(path: string): Image;
declare function drawCircle(img: Image, x: number, y: number, radius: number, r: number, g: number, b: number, a: number): void;
declare function tap(x: number, y: number, during: number): void;
declare function tapDown(x: number, y: number, during: number): void;
declare function tapDown(x: number, y: number, during: number, id: number): void;
declare function tapUp(x: number, y: number, during: number): void;
declare function tapUp(x: number, y: number, during: number, id: number): void;
declare function moveTo(x: number, y: number, during: number): void;
declare function moveTo(x: number, y: number, during: number, id: number): void;
declare function swipe(x1: number, y1: number, x2: number, y2: number): void;
declare function keycode(label: string, during: number): void;
declare function typing(words: string, during: number): void;
// opencv apis
declare function clone(sourceImg: Image): Image;
declare enum SmoothType {
  CV_BLUR_NO_SCALE = 0,
  CV_BLUR = 1,
  CV_GAUSSIAN = 2,
  CV_MEDIAN = 3,
  CV_BILATERAL = 4,
}
declare function smooth(sourceImg: Image, smoothType: SmoothType, size: number): Image;
declare enum ConvertColorCode {
  CV_BGR2HSV = 40,
  CV_BGR2HLS = 52,
}
declare function convertColor(sourceImg: Image, code: ConvertColorCode): Image;
declare function bgrToGray(sourceImg: Image): void;
declare function absDiff(sourceImg: Image, targetImg: Image): Image;
declare enum ThresholdCode {
  CV_THRES_BINARY = 0,
}
declare function threshold(sourceImg: Image, thr: number, maxThr: number, code: ThresholdCode): void;
declare function eroid(sourceImg: Image, width: number, height: number, x: number, y: number): void;
declare function dilate(sourceImg: Image, width: number, height: number, x: number, y: number): void;
declare function inRange(
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
declare function outRange(
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
declare function cloneWithMask(sourceImg: Image, mask: Image): Image;
declare enum HoughMethod {
  CV_HOUGH_GRADIENT = 3,
}
declare function houghCircles(
  sourceImg: Image,
  method: HoughMethod,
  dp: number,
  minDist: number,
  p1: number,
  p2: number,
  minR: number,
  maxR: number
): { [i: string]: { x: number; y: number; r: number } };
declare function getBase64FromImage(image: any): string;
declare function httpClient(method: string, url: string, body: string, headers: { [key: string]: string }): string;
