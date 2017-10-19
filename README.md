Robotmon Javascript Apis
================

## Before Using Apis

### Install App (Only support Android) (No need to root)

Download link [Google Play](https://play.google.com/store/apps/details?id=com.r2studio.robotmon)

### Install developer tool

See [Robotmon Desktop](https://github.com/r2-studio/robotmon-desktop)

### Run background service (Important)

Service is built in app `com.r2studio.robotmon.Main`, that's start it. 

First, connect android phone to PC with USB

#### Using Double-Click Tools

1. Download [Robotmon-service-manager](https://github.com/r2-studio/robotmon-desktop/releases)
2. Unzip it
3. Double Click `windows-start.bat` in windows, `mac-start.command` in mac, `linux-start.sh` in linux

#### Using developer tool

1. Click `掃描 Scan`
2. Click `啟動 Start`

#### Using command line (need adb tools) 

```
adb shell 'nohup sh -c "LD_LIBRARY_PATH=/system/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2studio.robotmon-1/base.apk:/data/app/com.r2studio.robotmon-2/base.apk app_process32 /system/bin com.r2studio.robotmon.Main $@" > /dev/null 2> /dev/null &'
```

#### Check service is running

```
$ adb shell 'ps | grep app_process'
# or
$ adb shell 'ps | grep app_process'
shell     16035 16032 2295692 40508 futex_wait ab35c858 S app_process32
```

#### Troubling

* Check LD_LIBRARY_PATH, CLASSPATH and app_process32 is correct/exists
* Thers is no `nohub` in some devices, you may remove it and try again
* Using `app_process` instead of `app_process32` in old phones
* We only test HTC phones currently

#### If you want to kill background service

```
# find pid
$ adb shell ps app_process
# or
$ adb shell "ps | grep app_process"
# kill it
$ adb shell kill <pid>
```

## Javascript APIs

* (Only support ES5)

```
getScreenSize() {int width, int height}
getScreenshotModify(int cropX, int cropY, int cropWidth, int cropHeight, int resizeWidth, int resizeHeight, int quality) int imgPtr
getScreenshot() int imgPtr
execute(string command) string result
tap(int x, int y, int during)
swipe(int x1, int y1, int x2, int y2, int during)
tapDown(int x, int y, int during)
tapUp(int x, int y, int during)
moveTo(int x, int y, int during)
typing(string words, int during)
keycode(string label, int during)

# images (openCV functions) 
clone(int sourceImg) int imgPtr
smooth(int sourceImg, int smoothType, size int)
	smoothType:
		0 = CV_BLUR_NO_SCALE
		1 = CV_BLUR
		2 = CV_GAUSSIAN
		3 = CV_MEDIAN
		4 = CV_BILATERAL
convertColor(int sourceImg, int code)
	code:
		40 = CV_BGR2HSV
		52 = CV_BGR2HLS
	see: imgproc/types_c.h 

absDiff(int sourceImg, int targetImg) int diffImgPtr
threshold(int sourceImg, float thr, maxThr, int code)
	code:
		0 = CV_THRES_BINARY
	see: imgproc/types_c.h

eroid(int sourceImg, int w, int h, int x, int y)
canny(int sourceImg, float t1, float t2, int apertureSize) int cannyImgPtr
findContours(int cannyImgPtr, float minArea, float maxArea) {"0": {int x, int y}}

drawCircle(int imgPtr, int x, int y, int radius, int r, int g, int b, int a)
findImages(int srcPtr, int targetImg, int scoreLimit, int resultCountLimit, withoutOverlap) string json
  json format (key is string!):
    {"0": {"x": 0, "y": 0, "score": 0.99}, "1": {"x": 10, "y": 10, "score": 0.43}}

getIdentityScore(int sourceImg, int targetImg) int score
findImage(int sourceImg, int targetImg) {int x, int y, int score}
cropImage(int sourceImg, int x, int y, int width, int height) int imgPtr
resizeImage(int sourceImg, int width, int height) int imgPtr
releaseImage(int imgPtr)
getImageColor(int sourceImg, int x, int y) {int r, int g, int b, int a}
getImageSize(int imgPtr) {int width, int height}
saveImage(int imgPtr, string path)
openImage(string path) int imgPtr
sleep(int millisecond)

getStoragePath() string path
getImageFromURL(string url) int imgPtr
getImageFromBase64(string base64) int imgPtr
getBase64FromImage(int imgPtr) string base64
log(string tag, string msg) string logMsg

readFile(string path) string text
writeFile(string path, string text)
runScript(string script)

httpClient(string method, string url, string body, object headers) string result
  httpClient('GET', 'http://httpbin.org/get', '', {});
  httpClient('POST', 'http://httpbin.org/post', 'body data', {});
  httpClient('POST', 'http://httpbin.org/post', 'foo=bar&bar=foo', {'Content-Type': 'application/x-www-form-urlencoded'});

importJS(string library)
  // import shared library in libs
  importJS('RBM-0.0.2')
  // import local library
  importJS('js/customerJS.js')

getVirtualButtonHeight() int vbh
```

## RBM library

```
var rbm_config = {
  appName: 'com.your.script',
  oriScreenWidth: 1080, // developer's phone width
  oriScreenHeight: 1920, // developer's phone height
  oriVirtualButtonHeight: 0, // developer's phone with virtual button height (getVirtualButtonHeight()). If no virtual button in app, set to 0
  oriResizeFactor: 0.6, // resize screenshot ratio in developer's environment (for screencrop)
  eventDelay: 200, // milliseconds
  imageThreshold: 0.85, // recognize images threshold
  imageQuality: 80, // 0 ~ 100, compress level
  resizeFactor: 0.6, // resize screenshot ratio in user's environment (same as oriResizeFactor is better)
};

importJS('RBM-0.0.2.js');
var rbm = new RBM(rbm_config);

// Important! calculate screen size, call it after start pressed!
rbm.init(); 

// Util for console.log, if argument is object, it will convert object to JSON string
rbm.log(any type);

// get current app in foreground 
rbm.currentApp(); // => {packageName, activityName}

// launch an app
rbm.startApp(packageName, activityName);

// close an app
rbm.stop(packageName);

// Utils. Calculate interpolation from developer's screen size to user's screen size
rbm.click({x, y});
rbm.tapDown({x, y});
rbm.moveTo({x, y});
rbm.tapUp({x, y});
rbm.swipe({fromX, fromY}, {toX, toY}, step); // step: interpolation points between 'from' and 'to'

// all about images used in this library will load/save within this folder
rbm.getImagePath(); // => Robotmon/scripts/com.your.app/images

// save screenshot (in getImagePath() path)
rbm.screenshot();

// crop screenshot and save it with filename. This function will resize images with oriResizeFactor
// and compress with imageQuality
rbm.screencrop(filename, fromX, fromY, toX, toY);
rbm.screencrop('startButton.png', 100, 200, 200, 300);

// ====> Functions below will calculate resize factor between developer's and user's

// find image (with filename) in screen
rbm.findImage(filename, threshold); // => {x, y, score}
rbm.findImage('startButton.png', 0.9);

// check if image is exist in screen
rbm.imageExists(filename, threshold); // => true|false

// find image in screen and click it. No found, no click
rbm.imageClick(filename, threshold);

// find image in screen and click it until timeout (milliseconds)
rbm.imageWaitClick(filename, timeout, threshold);

// block until image found or timout
rbm.imageWaitShow(filename, timeout, threshold);

// block until image gone or timout
rbm.imageWaitGone(filename, timeout, threshold);

// <====

// keep/release current screenshot in memory. To avoid to many times screencap.
rbm.keepScreenshot();
rbm.releaseScreenshot();

/* Example
// screencap three times
rbm.imageClick('apple.png', 0.9); // screencap, and release
rbm.imageClick('banana.png', 0.9); // screencap, and release
rbm.imageClick('cat.png', 0.9); // screencap, and release

// screencap only one time (used when screen not change)
rbm.keepScreenshot(); // screencap
rbm.imageClick('apple.png', 0.9); // no screencap, no release
rbm.imageClick('banana.png', 0.9); // no screencap, no release
rbm.imageClick('cat.png', 0.9); // no screencap, no release
rbm.releaseScreenshot(); // release screencap
*/

// same as keycode(label);
rbm.keycode(label);

// same as typing(words);
rbm.typing(words);

// sleep eventDelay
rbm.sleep(); // not same as sleep(milliseconds);
```

## Connect to background service your self

### Grpc APIs (Service Client)

```
message Empty {}

message Response {
  string message = 1;
}

message RequestRunScript {
  string script = 1;
}

message RequestScreenshot {
  int32 cropX = 1;
  int32 cropY = 2;
  int32 cropWidth = 3;
  int32 cropHeight = 4;
  int32 resizeWidth = 5;
  int32 resizeHeight = 6;
  int32 quality = 7;
}

message RequestTap {
  int32 x = 1;
  int32 y = 2;
  int32 during = 3;
}

message ResponseScreenshot {
  bytes image = 1;
}

message ResponseScreenSize {
  int32 width = 1;
  int32 height = 2;
}

service GrpcService {
  rpc RunScript(RequestRunScript) returns (Response) {}
  rpc Logs(Empty) returns (stream Response) {}
  rpc GetScreenshot(RequestScreenshot) returns (ResponseScreenshot) {}
  rpc GetScreenSize(Empty) returns (ResponseScreenSize) {}
  rpc Tap(RequestTap) returns (Response) {}
  rpc TapDown(RequestTap) returns (Response) {}
  rpc TapUp(RequestTap) returns (Response) {}
  rpc MoveTo(RequestTap) returns (Response) {}
}
```