// Ambient declarations for the Robotmon runtime and inlined HTML globals.
// These cover the surface used by index.ts (device script) and settings.ts
// (settings UI). The geometry/color/page shapes used throughout index.ts are
// modelled here so the device script can be fully type-checked; settings.ts
// remains a best-effort port (`// @ts-nocheck`).

// --- Shared geometry / colour value shapes ---

/** A screen coordinate in the script's logical 1080x1920 space. */
interface Point {
  x: number;
  y: number;
}

/** A BGRA colour sample as returned by the image/colour APIs. */
interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Anything carrying r/g/b channels: a `Color`, a `Coord`, a `PageColor`, or a
 * bare `{r, g, b}` literal. Used by the colour-comparison helpers, which are
 * fed entries from the heterogeneous Button/Page tables.
 */
type ColorLike = { r?: number; g?: number; b?: number; a?: number };

/**
 * A tappable/checkable location. Position is always present; the colour
 * channels and the various per-entry extras (reference colours, sizes,
 * labels) are optional because the Button/Page tables are heterogeneous.
 */
interface Coord {
  x: number;
  y: number;
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  w?: number;
  h?: number;
  z?: number;
  name?: string;
  color?: Color;
  color2?: Color;
}

/** One reference pixel used to fingerprint a page. */
interface PageColor {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  match: boolean;
  threshold: number;
}

/** A recognisable game page: a colour fingerprint plus navigation anchors. */
interface PageDef {
  name: string;
  colors: PageColor[];
  back: Coord;
  next: Coord;
  tsums?: Coord;
  store?: Coord;
  lockIcons?: Coord[];
  onDetect?: (this: any) => void;
}

/**
 * A connectable chain of same-colour tsums. It is an array of board points
 * carrying an extra `tsumIdx` tag identifying which colour cluster it belongs
 * to (used to prioritise the player's own tsum in 5>4 mode).
 */
interface TsumPath extends Array<any> {
  tsumIdx?: number;
}

/** A unit of work scheduled by the TaskController. */
interface Task {
  name: string;
  run: () => void;
  interval: number;
  runTimes: number;
  priority: number;
  lastRunTime: number;
  status: number;
}

/** Static tuning constants for the player. */
interface TsumConfig {
  recordDir: string;
  tsumWidth: number;
  tsumBoundW: number;
  tsumBoundH: number;
  screenResize: number;
  gameContinueDelay: number;
  colors: number[][];
  debugLogs: boolean;
  // "Experimental Tsum Connections": gates the reworked color recognition
  // (circular/sat-weighted hue, k-means refinement, ring-median sampling).
  // Off = original pipeline.
  experimentalConnections: boolean;
  // Color-clustering tuning, overridable from the settings page. Only used
  // when experimentalConnections is on.
  colorHueWeightX10: number;
  colorHueBonus: number;
  colorSatBonus: number;
  colorMergeDist: number;
  colorSampleSmooth: number;
}

type PageMap = { [name: string]: PageDef };
type ButtonMap = { [name: string]: any };
type StringMap = { [name: string]: string };

// --- Robotmon native runtime (provided by the host environment) ---
declare function sleep(ms: number): void;
declare function tap(x: number, y: number, during?: number): void;
declare function tapDown(x: number, y: number, during?: number): void;
declare function tapUp(x: number, y: number, during?: number): void;
declare function moveTo(x: number, y: number, during?: number): void;
declare function tapMove(id: number, x: number, y: number): void;
declare function press(key: string | number): void;
declare function keycode(code: string, during?: number): void;
declare function swipe(x1: number, y1: number, x2: number, y2: number, steps?: number): void;
declare function getColor(x: number, y: number): Color;
declare function getColors(points: any): any;
declare function getScreenshot(...args: any[]): any;
declare function getScreenshotModify(...args: any[]): any;
declare function releaseImage(img: any): void;
declare function openImage(path: string): any;
declare function saveImage(img: any, path: string): void;
declare function cloneImage(img: any): any;
declare function clone(img: any): any;
declare function cropImage(img: any, x: number, y: number, w: number, h: number): any;
declare function getBase64FromImage(img: any): string;
declare function getImageColor(img: any, x: number, y: number): Color;
declare function getImageColors(img: any, points: any): any;
declare function getImageWidth(img: any): number;
declare function getImageHeight(img: any): number;
declare function getImageSize(img: any): { width: number; height: number };
declare function getScreenSize(): { width: number; height: number };
declare function getDeviceSize(): { width: number; height: number };
declare function getStoragePath(): string;
declare function getCurrentPackage(): string;
declare function launchApp(pkg: string): void;
declare function killCurrentPackage(): void;
declare function killApp(pkg: string): void;
declare function execute(cmd: string): string;
declare function readFile(path: string): string;
declare function writeFile(path: string, content: string): void;
declare function setScreenOrientation(orientation: number): void;
declare function keepScreenAwake(...args: any[]): void;

// --- Robotmon image-processing helpers (OpenCV-backed) ---
declare function smooth(img: any, type: number, size: number): void;
declare function convertColor(img: any, code: number): void;
declare function outRange(img: any, ...bounds: number[]): any;
declare function bgrToGray(img: any): any;
declare function houghCircles(img: any, ...params: number[]): Array<{ x: number; y: number; r: number }>;
declare function drawCircle(img: any, ...params: number[]): void;
declare function getIdentityScore(img1: any, img2: any): number;

// --- Robotmon networking / account helpers ---
declare function httpClient(method: string, url: string, body: string, headers: any): string;
declare function getUserPlan(): number;
declare function sendNormalMessage(topMsg: string, msg: string): string;

// --- Robotmon JavaScript bridge available inside the settings WebView ---
declare const JavaScriptInterface: {
    runScript(script: string): void;
    runScriptCallback(script: string, callbackName: string): void;
    showMenu(): void;
    hideMenu(): void;
    [key: string]: any;
};

// --- jQuery (loaded via CDN in index.html) ---
declare const $: any;
declare const jQuery: any;

// --- Shared cross-file globals from index.ts / settings.ts ---
declare var Config: TsumConfig;
declare var Button: ButtonMap;
declare var Page: PageMap;
declare var Logs: StringMap;
declare var LogsTW: StringMap;
declare var ts: any;
declare var gTaskController: any;
declare var settings: any;
declare var ASC: boolean;
declare var VERSION: string;

// Functions called across the script <-> settings boundary (via runScript /
// runScriptCallback). Declared so either file can reference the other.
declare function start(cfg?: any): void;
declare function stop(): void;
declare function log(...args: any[]): void;
declare function debug(...args: any[]): void;
declare function i18n(zhTW: string, en: string): string;
declare function saveLocale(locale: string): void;
declare function resetSettings(): void;
declare function genRecord(record: any): void;
declare function genRecordTable(path?: string): void;
declare function assignImage(results: string): void;
declare function exportSuccess(): void;
// Implemented in both index.ts and settings.ts; the ambient declaration lets
// the two global-scope copies coexist (they share one TS compilation).
declare function getDayTimeString(d: Date): string;
declare function getRecordFilename(): string;
declare function onEvent(eventType: string): void;
declare function onLog(message: string): void;
