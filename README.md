# Robotmon JavaScript APIs

Only support ES5

## Contents

* [JavaScript APIs](#JavaScript)
* [RBM library APIs](#RBM)
* [gRPC APIs](#gRPC)

## JavaScript APIs

```javascript
getScreenSize()
```

Returns `Object` - `{width: Integer, height: Integer}`

```javascript
getScreenshotModify(cropX, cropY, cropWidth, cropHeight, resizeWidth, resizeHeight, quality)
```

* `cropX` Integer
* `cropY` Integer
* `cropWidth`  Integer
* `cropHeight` Integer
* `resizeWidth` Integer
* `resizeHeight` Integer
* `quality` Integer

Returns `Integer` - The image pointer

```javascript
getScreenshot()
```

Returns `Integer` - The image pointer

```javascript
execute(command)
```

* `command` String

Returns `String` - The result of the execution

```javascript
tap(x, y, during)
```

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
swipe(x1, y1, x2, y2, during)
```

* `x1` Integer
* `y1` Integer
* `x2` Integer
* `y2` Integer
* `during` Integer

```javascript
tapDown(x, y, during)
```

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
tapUp(x, y, during)
```

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
moveTo(x, y, during)
```

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
typing(words, during)
```

* `words` String
* `during` Integer

```javascript
keycode(label, during)
```

* `label` String
* `during` Integer

### OpenCV

```javascript
clone(sourceImg)
```

* `sourceImg` Integer

Returns `Integer` - The image pointer

```javascript
smooth(sourceImg, smoothType, size)
```

* `sourceImg` Integer
* `smoothType` Integer
* `size` Integer

|smoothType|description|
|---|---|
|0|CV_BLUR_NO_SCALE|
|1|CV_BLUR|
|2|CV_GAUSSIAN|
|3|CV_MEDIAN|
|4|CV_BILATERAL|

```javascript
convertColor(sourceImg, code)
```

* `sourceImg` Integer
* `code` Integer

|code|description|
|---|---|
|40|CV_BGR2HSV|
|52|CV_BGR2HLS|

See more: imgproc/types_c.h

```javascript
absDiff(sourceImg, targetImg)
```

* `sourceImg` Integer
* `targetImg` Integer

Returns `Integer` - The image pointer of the difference

```javascript
threshold(sourceImg, thr, maxThr, code)
```

* `sourceImg` Integer
* `thr` Float
* `maxThr` Float
* `code` Integer

|code|description|
|---|---|
|0|CV_THRES_BINARY|

See more: imgproc/types_c.h

```javascript
eroid(sourceImg, w, h, x, y)
```

* `sourceImg` Integer
* `w` Integer
* `h` Integer
* `x` Integer
* `y` Integer

```javascript
canny(sourceImg, t1, t2, apertureSize)
```

* `sourceImg` Integer
* `t1` Float
* `t2` Float
* `apertureSize` Integer

Returns `Integer` - The canny image pointer

```javascript
findContours(cannyImgPtr, minArea, maxArea)
```

* `cannyImgPtr` Integer
* `minArea` Float
* `maxArea` Float

Returns `Object` - `{"0": {x: Integer, y: Integer}`

```javascript
drawCircle(sourceImg, x, y, radius, r, g, b, a)
```

* `sourceImg` Integer
* `x` Integer
* `y` Integer
* `radius` Integer
* `r` Integer
* `g` Integer
* `b` Integer
* `a` Integer

```
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

## gRPC APIs (Service Client)

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