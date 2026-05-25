// Ambient declarations for the Robotmon runtime and inlined HTML globals.
// These cover the surface used by index.ts (device script) and settings.ts
// (settings UI). Types are intentionally loose ("any") — this is a
// best-effort port; tighten incrementally per-file as needed.

// --- Robotmon native runtime (provided by the host environment) ---
declare function sleep(ms: number): void;
declare function tap(x: number, y: number): void;
declare function tapDown(id: number, x: number, y: number): void;
declare function tapUp(id: number, x: number, y: number): void;
declare function tapMove(id: number, x: number, y: number): void;
declare function press(key: string | number): void;
declare function swipe(x1: number, y1: number, x2: number, y2: number, steps?: number): void;
declare function getColor(x: number, y: number): any;
declare function getColors(points: any): any;
declare function getScreenshot(...args: any[]): any;
declare function getScreenshotModify(...args: any[]): any;
declare function releaseImage(img: any): void;
declare function openImage(path: string): any;
declare function getBase64FromImage(img: any): string;
declare function getImageColor(img: any, x: number, y: number): any;
declare function getImageColors(img: any, points: any): any;
declare function getImageWidth(img: any): number;
declare function getImageHeight(img: any): number;
declare function getScreenSize(): any;
declare function getStoragePath(): string;
declare function getCurrentPackage(): string;
declare function launchApp(pkg: string): void;
declare function killCurrentPackage(): void;
declare function killApp(pkg: string): void;
declare function execute(cmd: string): any;
declare function readFile(path: string): string;
declare function writeFile(path: string, content: string): void;
declare function getDeviceSize(): any;
declare function setScreenOrientation(orientation: number): void;
declare function keepScreenAwake(...args: any[]): void;

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
declare var Config: any;
declare var Button: any;
declare var Page: any;
declare var Logs: any;
declare var LogsTW: any;
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
declare function onEvent(eventType: string): void;
declare function onLog(message: string): void;
