export * from './src/screen';
export * from './src/rerouter';
export * from './src/struct';
export * from './src/utils';
export const version = 1;

declare global {
  type RGB = { r: number; g: number; b: number };
  type XYRGB = { x: number; y: number; r: number; g: number; b: number };
  type Image = any;

  function getStoragePath(): string;
  function sendEvent(event: string, content: string): void;
  function execute(command: string): string;
  function sleep(during: number): void;
  function getImageSize(img: Image): { width: number; height: number };
  function getImageColor(img: Image, x: number, y: number): RGB;
  function identityColorScore(hex1: string, hex2: string): number;
  function isSameColor(hex1: string, hex2: string, threshold: number): boolean;
  function getScreenSize(): { width: number; height: number };
  function getScreenshot(): Image;
  function getScreenshotModify(
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number,
    resizeWidth: number,
    resizeHeight: number,
    quality: number
  ): Image;
  function releaseImage(img: Image): void;
  function getIdentityScore(source: Image, target: Image): number;
  function cropImage(img: Image, x: number, y: number, w: number, h: number): any;
  function findImage(sourceImg: Image, targetImg: Image): { score: number; x: number; y: number };
  function findImages(
    sourceImg: Image,
    targetImg: Image,
    scoreLimit: number,
    resultCountLimit: number,
    withoutOverlap: boolean
  ): { [idx: string]: { score: number; x: number; y: number } };
  function resizeImage(img: Image, w: number, h: number): any;
  function saveImage(img: Image, path: string): void;
  function openImage(path: string): Image;
  function drawCircle(img: Image, x: number, y: number, radius: number, r: number, g: number, b: number, a: number): void;
  function tap(x: number, y: number, during: number): void;
  function tapDown(x: number, y: number, during: number): void;
  function tapDown(x: number, y: number, during: number, id: number): void;
  function tapUp(x: number, y: number, during: number): void;
  function tapUp(x: number, y: number, during: number, id: number): void;
  function moveTo(x: number, y: number, during: number): void;
  function moveTo(x: number, y: number, during: number, id: number): void;
  function swipe(x1: number, y1: number, x2: number, y2: number): void;
  function keycode(label: string, during: number): void;
  function typing(words: string, during: number): void;
  function readFile(path: string): string;
  function writeFile(path: string, text: string): number;

  // opencv apis
  function clone(sourceImg: Image): Image;
  enum SmoothType {
    CV_BLUR_NO_SCALE = 0,
    CV_BLUR = 1,
    CV_GAUSSIAN = 2,
    CV_MEDIAN = 3,
    CV_BILATERAL = 4,
  }
  function smooth(sourceImg: Image, smoothType: SmoothType, size: number): Image;
  enum ConvertColorCode {
    CV_BGR2HSV = 40,
    CV_BGR2HLS = 52,
  }
  function convertColor(sourceImg: Image, code: ConvertColorCode): Image;
  function bgrToGray(sourceImg: Image): void;
  function absDiff(sourceImg: Image, targetImg: Image): Image;
  enum ThresholdCode {
    CV_THRES_BINARY = 0,
  }
  function threshold(sourceImg: Image, thr: number, maxThr: number, code: ThresholdCode): void;
  function eroid(sourceImg: Image, width: number, height: number, x: number, y: number): void;
  function dilate(sourceImg: Image, width: number, height: number, x: number, y: number): void;
  function inRange(sourceImg: Image, minB: number, minG: number, minR: number, minA: number, maxB: number, maxG: number, maxR: number, maxA: number): Image;
  function outRange(sourceImg: Image, minB: number, minG: number, minR: number, minA: number, maxB: number, maxG: number, maxR: number, maxA: number): Image;
  function cloneWithMask(sourceImg: Image, mask: Image): Image;
  enum HoughMethod {
    CV_HOUGH_GRADIENT = 3,
  }
  function houghCircles(
    sourceImg: Image,
    method: HoughMethod,
    dp: number,
    minDist: number,
    p1: number,
    p2: number,
    minR: number,
    maxR: number
  ): { [i: string]: { x: number; y: number; r: number } };
  function getBase64FromImage(image: Image): string;
  function getImageFromBase64(string: string): Image;
  function httpClient(method: string, url: string, body: string, headers: { [key: string]: string }): string;
  function getUserPlan(): string | undefined;
  function s3UploadFile(
    filepath: string,
    objectName: string,
    contentType: string,
    endpoint: string,
    bucket: string,
    keyId: string,
    accessKey: string,
    token: string,
    ssl: boolean
  ): number | string;
  function s3DownloadFile(
    filepath: string,
    objectName: string,
    endpoint: string,
    bucket: string,
    keyId: string,
    accessKey: string,
    token: string,
    ssl: boolean
  ): true | string;
  function readFile(path: string): string | undefined;
  function writeFile(path: string, content: string): void;
  function targz(targetPath: string, sourcePath: string): string | 'success';
  function untargz(sourcePath: string): string | 'success';
  function xDecodeHex(hexedString: string): string | undefined;
}
