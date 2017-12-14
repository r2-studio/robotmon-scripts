# Robotmon JavaScript APIs

Only support ES5

## Contents

* [JavaScript Events](#javascrip-svents)
* [JavaScript Interface](#javascrip-interface)
* [JavaScript Raw APIs](#javascrip-apis)
* [RBM library APIs](#rbm-library-apis)
* [gRPC APIs](#grpc-apis)

## JavaScript Events

Add the following `<script>` in the `<head>` section of `index.html`

`start()` and `stop()` should defined in `index.js`

```html
<script>
  function onEvent(eventType) {
    if (eventType == 'OnPlayClick') {
      JavaScriptInterface.runScript(`start();`);
    } else if (eventType == 'OnPauseClick') {
      JavaScriptInterface.runScript('stop();');
    }
  }

  function onLog(message) {
    console.log(message);
  }
</script>
```

|event name|
|---|
|OnMenuClick|
|OnPlayClick|
|OnPauseClick|
|OnLogClick|
|OnSettingClick|
|OnCloseClick|

## JavaScript Interface

```javascript
runScript(script)
```

* `script` String

```javascript
runScriptCallback(script, callback)
```

* `script` String
* `callback` String

```javascript
clickIconButton()
```

Click the `app icon button` on floating widget.

```javascript
clickPlayButton()
```

Click the `play button` on floating widget.

```javascript
clickPauseButton()
```

Click the `pause button` on floating widget.

```javascript
clickLogButton()
```

Click the `log button` on floating widget.

```javascript
clickSettingButton()
```

Click the `setting button` on floating widget.

```javascript
clickCloseButton()
```

Click the `close button` on floating widget.

```javascript
setXY(x, y)
```

* `x` Integer
* `y` Integer

Set the position of the floating widget.

```javascript
getX()
```

Returns `Integer` - The x position of the floating widget.

```javascript
getY()
```

Returns `Integer` - The y position of the floating widget.

```javascript
showMenu()
```

Show the menu on floating widget.

```javascript
hideMenu()
```

Hide the menu on floating widget.

```javascript
showPlayButton()
```

Show the `play button` on floating widget.

```javascript
showPauseButton()
```

Show the `pause button` on floating widget.

## JavaScript Raw APIs


#### `getScreenSize()`

Returns `Object` - `{width: Integer, height: Integer}`

```javascript
var sizeObj = getScreenSize();
console.log(sizeObj.width, sizeObj.height);
// 1080 1920
```

#### `getScreenshot()`

Returns `Integer` - The image pointer

```javascript
var img = getScreenshot();
console.log(img);
// 122344533 <- image pointer
releaseImage(img); // Don't forgot release a pointer
```

#### `getScreenshotModify(cropX, cropY, cropWidth, cropHeight, resizeWidth, resizeHeight, qualitys)`

Get screenshot, crop and resize. For speeding up screenshot.

* `cropX` Integer
* `cropY` Integer
* `cropWidth`  Integer
* `cropHeight` Integer
* `resizeWidth` Integer
* `resizeHeight` Integer
* `quality` Integer

Returns `Integer` - The image pointer

```javascript
var image = getScreenshotModify(200, 200, 100, 100, 50, 50, 80);
console.log(image); // image width = 50, height = 50 
// 12333122
releaseImage(image);
```

#### `execute(command)`

Call exec command in android system. It's permission is same as `adb shell`

* `command` String

Returns `String` - The result of the execution

```javascript
var result = execute("ls -al /sdcard");
console.log(result);
// drwxr-xr-x   2 root  root    64B 12 14 23:44 Robotmon
```

#### `tap(x, y, during)`

Simulate a tap event

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
tap(200, 200, 10);
// Will inject a tap down and a tap up event to system
```

#### `tapDown(x, y, during)`

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
tapDown(200, 200, 40);
// Will inject a tapDown event to system
```

#### `tapUp(x, y, during)`

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
tapUp(200, 200, 40);
// Will inject a tapUo event to system
```

#### `moveTo(x, y, during)`

moveTo should be betewwn `tapDown` and `tapUp`

* `x` Integer
* `y` Integer
* `during` Integer

```javascript
tapDown(500, 300, 40);
moveTo(500, 600, 40);
tapUp(500, 600, 40);
// Will inject a swipe down event
```

#### `swipe(x1, y1, x2, y2, during)`

Simulate a swipe event, using `tapDown`, `moveTo` and `tapUp` event. This function may not work in some game, you should implement yourself.

* `x1` Integer
* `y1` Integer
* `x2` Integer
* `y2` Integer
* `during` Integer

```javascript
swipe(500, 300, 40); // same as above example
// Will inject a swipe down event
```

#### `keycode(label, during)`

Send a key code event to system
Like adb shell input keyevent command
[Android Keycode List](https://developer.android.com/reference/android/view/KeyEvent.html)

* `label` String
* `during` Integer

```javascript
keycode('HOME', 40); // same as keycode('KEYCODE_HOME', 40);
// Will send a HOME event to system
```

#### `typing(words, during)`

Only allow English words

* `words` String
* `during` Integer

```javascript
typing('Hello!', 100);
// Will type 'H' 'e' 'l' 'l' 'o' '!' 6 words
```

### OpenCV

#### `clone(sourceImg)`

Duplicate an image to another.

* `sourceImg` Integer

Returns `Integer` - The image pointer

```javascript
var oriImage = getScreenshot();
for (var i = 0; i < 10; i++) {
  var cloneImage = clone(oriImage);
  // modify clone Image here
  smooth(cloneImage, 1, 5); // blur
  release(cloneImage);
}
release(oriImage);
```


#### `smooth(sourceImg, smoothType, size)`

Same as OpenCV `smooth()` function.

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
var img = getScreenshot();
smooth(img, 2, 5); // Gaussian blur
saveImage(img, getStoragePath + '/smooth.png');
releaseImage(img);
```

#### `convertColor(sourceImg, code)`

Same as OpenCV `cvtColor()`.
Note that `getScreenshot` and `getScreenshotModify` is BGR order;

* `sourceImg` Integer
* `code` Integer

|code|description|
|---|---|
|40|CV_BGR2HSV|
|52|CV_BGR2HLS|

See more: [OpenCV Types](https://github.com/opencv/opencv/blob/2.4/modules/imgproc/include/opencv2/imgproc/types_c.h)

```javascript
var img = getScreenshot();
// Convert BGR to HSV color
convertColor(40, img);
releaseImage(ig);
```

#### `absDiff(sourceImg, targetImg)`

Same as OpenCV `adbdiff()`.

* `sourceImg` Integer
* `targetImg` Integer

Returns `Integer` - The image pointer of the difference

```javascript
var img1 = getScreenshot();
sleep(100);
var img2 = getScreenshot();
var diff = absDiff(img1, img2); // in gray order
releaseImage(img1);
releaseImage(img2);
releaseImage(diff);
```

#### `threshold(sourceImg, thr, maxThr, code)`

Same as OpenCV `threshold()`.

* `sourceImg` Integer
* `thr` Float
* `maxThr` Float
* `code` Integer

|code|description|
|---|---|
|0|CV_THRES_BINARY|

See more: [OpenCV Types](https://github.com/opencv/opencv/blob/2.4/modules/imgproc/include/opencv2/imgproc/types_c.h)

```javascript
keycode('MENU');
sleep(1000);
var img1 = getScreenshot();
keycode('HOME');
sleep(1000);
var img2 = getScreenshot();
var diff = absDiff(img1, img2); // in gray order
threshold(diff, 100, 255); // set to 0 if <= 100, set to 255 if > 100
var value = getImageColor(diff, 500, 200); // value => {r":255,"g":0,"b":0","a":0}
console.log(value['r']); // current diff value is show on 'r'
// 255
releaseImage(img1);
releaseImage(img2);
releaseImage(diff);
```

#### `eroid(sourceImg, width, height, x, y)`

Same as OpenCV `eroid`.

`width`, `height`, `x`, `y` is `getStructuringElement()` parameters.

* `sourceImg` Integer
* `width` Integer
* `height` Integer
* `x` Integer
* `y` Integer

```javascript
var img = getScreenshot();
threshold(img, 100, 255);
eroid(img, 3, 3, 1, 1);
saveImage(img, getStoragePath() + '/test_eroid.png');
releaseImage(img);
```

#### `canny(sourceImg, t1, t2, apertureSize)`

Same as OpenCV `canny`

* `sourceImg` Integer
* `t1` Float
* `t2` Float
* `apertureSize` Integer

Returns `Integer` - The canny image pointer

```javascript
var img = getScreenshot();
threshold(img, 30, 255);
eroid(img, 5, 5, 1, 1);
var cannyImg = canny(img, 50, 150, 3);
saveImage(cannyImg, getStoragePath() + '/test_canny.png');
releaseImage(img);
releaseImage(cannyImg);
```

#### `findContours(cannyImgPtr, minArea, maxArea)`

Same as OpenCV `findContours`.

* `cannyImgPtr` Integer (Canny image as input)
* `minArea` Float
* `maxArea` Float

Returns `Object` - `{"0": {x: Integer, y: Integer}`

```javascript
var img = getScreenshot();
threshold(img, 30, 255);
eroid(img, 5, 5, 1, 1);
var cannyImg = canny(img, 50, 150, 3);
var results = findContours(cannyImg, 1000, 10000); // area > 100
console.log(JSON.stringify(results));
// {"0":{"x":537,"y":1850},"1":{"x":133,"y":601}}
releaseImage(img);
releaseImage(cannyImg);
```

#### `drawCircle(sourceImg, x, y, radius, r, g, b, a)`

Draw circle in an image.

* `sourceImg` Integer
* `x` Integer
* `y` Integer
* `radius` Integer
* `r` Integer
* `g` Integer
* `b` Integer
* `a` Integer

```javascript
var img = getScreenshot();
drawCircle(img, 100, 100, 10, 0, 0, 255, 0); // draw a blue circle
saveImage(img, getStoragePath() + '/test_drawCircle.png');
releaseImage(img);
```

#### `getIdentityScore(sourceImg, targetImg)`

* `sourceImg` Integer
* `targetImg` Integer

Returns `Float` - The identity score

```javascript
keycode('MENU');
sleep(1000);
var img1 = getScreenshot();
keycode('HOME');
sleep(1000);
var img2 = getScreenshot();
var score = getIdentityScore(img1, img2);
console.log(score); // 0.6004924774169922
releaseImage(img1);
releaseImage(img2);
```

#### `cropImage(sourceImg, x, y, width, height)`

Crop image.

* `x` Integer
* `y` Integer
* `width` Integer
* `height` Integer

Returns `Integer` - The image pointer

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
saveImage(cropImg, getStoragePath() + '/test_crop.png');
releaseImage(img);
releaseImage(cropImg);
```

#### `findImage(sourceImg, targetImg)`

Using OpenCV `Template Match` to fing image.

* `sourceImg` Integer
* `targetImg` Integer

Returns `Object` - `{x: Integer, y: Integer, score: Float}`

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
var result = findImage(img, cropImg);
console.log(JSON.stringify(result)); // {"score":0.9999997615814209,"x":350,"y":550}
releaseImage(img);
releaseImage(cropImg);
```

#### `findImages(sourceImg, targetImg, scoreLimit, resultCountLimit, withoutOverlap)`

Same as `findImage()`, but find mulitple times.

* `sourceImg` Integer
* `targetImg` Integer
* `scoreLimit` Integer
* `resultCountLimit` Integer
* `withoutOverlap` Boolean

Returns `String` - `{"0": {"x": Integer, "y": Integer, "score": Float}, "1": {"x": Integer, "y": Integer, "score": Float}}`, Key is String!

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
var result = findImages(img, cropImg, 0.95, 3, true);
console.log(JSON.stringify(result)); // {"0":{"score":0.9999997615814209,"x":350,"y":550}}
releaseImage(img);
releaseImage(cropImg);
```

#### `resizeImage(sourceImg, width, height)`

Resize image.

* `width` Integer
* `height` Integer

Returns `Integer` - The image pointer

```javascript
var img = getScreenshot();
var resizeImg = resizeImage(img, 108, 192);
saveImage(resizeImg, getStoragePath() + '/test_resize.png');
releaseImage(img);
releaseImage(resizeImg);
```

#### `releaseImage(imgPtr)`

Very Important! You should call this function with all imgPtrs.

* `imgPtr` Integer

```javascript
var img = getScreenshot(); // keep in memory
releaseImage(img); // release from memory
```

#### `getImageColor(sourceImg, x, y)`

Get color of point from an image.

* `sourceImg` Integer
* `x` Integer
* `y` Integer

Returns `Object` - `{r: Integer, g: Integer, b: Integer, a: Integer}`

```javascript
var img = getScreenshot();
var color = getImageColor(img, 100, 100);
console.log(JSON.stringify(color)); // {"a":0,"b":21,"g":36,"r":198}
releaseImage(img);
```

#### `getImageSize(imgPtr)`

* `imgPtr` Integer

Returns `Object` - `{width: Integer, height: Integer}`

```javascript
var img = getScreenshot();
var size = getImageSize(img);
console.log(JSON.stringify(size)); // {"height":1920,"width":1080}
releaseImage(img);
```

#### `saveImage(imgPtr, path)`

Save image to disk.

* `imgPtr` Integer
* `path` String

```javascript
var img = getScreenshot();
saveImage(img, getStoragePath + '/test_save.png');
releaseImage(img);
```

#### `openImage(path)`

Open image from disk.

* `path` String

Returns `Integer` - The image pointer

```javascript
var img = openImage(getStoragePath + '/test_save.png');
releaseImage(img);
```

#### `sleep(milliseconds)`

Like `sleep` function in C language, pause current process.

* `milliseconds` Integer

```javascript
console.log('Hello');
sleep(1000);
console.log('Andy');
```

#### `getStoragePath()`

Get Robotmon folder. Like `/sdcard/Robotmon`.

Returns `String` - The storage path

```javascript
console.log(getStoragePath());
```

#### `getImageFromURL(url)`

Get image from an url.

* `url` String

Returns `Integer` - The image pointer

#### `getImageFromBase64(base64)`

Get image from a base64 string.

* `base64` String

Returns `Integer` - The image pointer

#### `getBase64FromImage(imgPtr)`

Get base64 string from an image.

* `imgPtr` Integer

Returns `String` - base64

#### `readFile(path)`

Read a file as string.

* `path` String

Returns `String` - The text of the file

#### `writeFile(path, text)`

Write a string to a file.

* `path` String
* `text` String

#### `encrypt(script)`

Encrypted a string

* `script` String

Returns String - The encrypted script

#### `runEncryptedScript(script)`

Run a encrypted javascript string.

* `script` String - The script is encrypted by `encrypt`

#### `runScript(script)`

Run a javascript string.

* `script` String

#### `httpClient(method, url, body, headers)`

Do a http request.

* `method` String
* `url` String
* `body` String
* `headers` Object

Returns `String` - The result

```javascript
httpClient('GET', 'http://httpbin.org/get', '', {});
httpClient('POST', 'http://httpbin.org/post', 'body data', {});
httpClient('POST', 'http://httpbin.org/post', 'foo=bar&bar=foo', {'Content-Type': 'application/x-www-form-urlencoded'});
```

#### `importJS(library)`

Import an JS library.

* `library` String

```javascript
importJS('RBM-0.0.2') // import shared library in libs
importJS('js/customerJS') // import local library
```

#### `getVirtualButtonHeight()`

Returns `Integer` - The height of the virtual button

## RBM library APIs

The RBM library is an API wrapper of the Robotmon JavaScript APIs.

### RBM Config

|property|description|
|---|---|
|appName|The name of the script.|
|oriScreenWidth|The width of developer's phone.|
|oriScreenHeight|The height of developer's phone.|
|oriVirtualButtonHeight|The virtual button height of developer's phone(`getVirtualButtonHeight()`). If no virtual button in app, just set to `0`.|
|oriResizeFactor|The resize ratio of the screenshot in developer's environment. For `screencrop()`. Range from `0` to `1`.|
|eventDelay|The delay milliseconds of the event.|
|imageThreshold|The threshold of image recognition. Range from `0` to `1`.|
|imageQuality|The compression level of the image. Range from `0` to `100`.|
|resizeFactor|The resize ratio of the screenshot in user's environment. Same as `oriResizeFactor` is better. Range from `0` to `1`.|

### Using

```javascript
// Import RBM library
importJS('RBM-0.0.2');

// Initial RBM config
var config = {
  appName: 'com.your.script',
  oriScreenWidth: 1080,
  oriScreenHeight: 1920,
  oriVirtualButtonHeight: 0,
  oriResizeFactor: 0.6,
  eventDelay: 200,
  imageThreshold: 0.85,
  imageQuality: 80,
  resizeFactor: 0.6,
};

// Create RBM instance
var rbm = new RBM(config);

// Important! Calculate the screen size, call it after start pressed!
rbm.init();

// Then using the following APIs of the RBM library
```

### RBM library

```javascript
rbm.log(args)
```

* `args` any type - if argument is object, it will convert object to JSON string

For general output of logging information.

```javascript
rbm.currentApp()
```

Returns `Object` - The current app in foreground. `{packageName: String, activityName: String}`

```javascript
rbm.startApp(packageName, activityName)
```

* `packageName` String
* `activityName` String

Launch an app by `packageName` and `activityName`.

```javascript
rbm.stopApp(packageName)
```

* `packageName` String

Close an app by `packageName`.

```javascript
rbm.click(position)
```

* `position` Object - `{x: Integer, y: Integer}`

```javascript
rbm.tapDown(position)
```

* `position` Object - `{x: Integer, y: Integer}`

```javascript
rbm.tapUp(position)
```

* `position` Object - `{x: Integer, y: Integer}`

```javascript
rbm.moveTo(position)
```

* `position` Object - `{x: Integer, y: Integer}`

```javascript
rbm.swipe(from, to, steps)
```

* `from` Object - `{x: Integer, y: Integer}`
* `to` Object - `{x: Integer, y: Integer}`
* `steps` Integer - Interpolation points between `from` and `to`

```javascript
rbm.keycode(label)
```

* `label` String

```javascript
rbm.typing(words)
```

* `words` String

```javascript
rbm.sleep()
```

Sleep with `eventDelay`.

```javascript
rbm.getImagePath()
// /sdcard/Robotmon/scripts/com.your.app/images
```

Returns `String` - The path of the image folder. All about images used in this library will load and save within this folder.

```javascript
rbm.screenshot(filename)
```

* `filename` String

Save the screenshot in `rbm.getImagePath()`.

```javascript
rbm.oriScreencrop(filename, fromX, fromY, toX, toY)

// Examples:
rbm.oriScreencrop('startButton.png', 100, 200, 200, 300)
```

* `filename` String
* `fromX` Integer
* `fromY` Integer
* `toX` Integer
* `toY` Integer

Crop the original screenshot and save it with `filename`. This function will resize the image with `oriResizeFactor` and compress with `imageQuality`.

```javascript
rbm.screencrop(filename, fromX, fromY, toX, toY)

// Examples:
rbm.screencrop('startButton.png', 100, 200, 200, 300)
```

* `filename` String
* `fromX` Integer
* `fromY` Integer
* `toX` Integer
* `toY` Integer

Crop the screenshot and save it with `filename`. This function will resize the image with `resizeFactor` and compress with `imageQuality`.

```javascript
rbm.findImage(filename, threshold)

// Examples:
rbm.findImage('startButton.png', 0.9)
```

* `filename` String
* `threshold` Float

Returns `Object` - Find the image with `filename` in screen. `{x: Integer, y: Integer, score: Float}`

```javascript
rbm.findImages(filename, threshold, countLimit, allowOverlap, deep)

// Examples:
rbm.findImages('startButton.png', 0.9, 3, false, false)
```

* `filename` String
* `threshold` Float
* `countLimit` Integer
* `allowOverlap` Boolean
* `deep` Boolean

Returns `Object` - Find the image with `filename` in screen. `{x: Integer, y: Integer, score: Float}`

```javascript
rbm.imageExists(filename, threshold)
```

* `filename` String
* `threshold` Float

Returns `Boolean` - Whether the image is exists in screen.

```javascript
rbm.imageClick(filename, threshold)
```

* `filename` String
* `threshold` Float

Click the image if the image is exists in screen.

```javascript
rbm.imageWaitClick(filename, timeout, threshold)
```

* `filename` String
* `timeout` Integer
* `threshold` Float

Click the image if the image is exists in screen until timeout (milliseconds).

```javascript
rbm.imageWaitShow(filename, timeout, threshold)
```

* `filename` String
* `timeout` Integer
* `threshold` Float

Block until the image is found or timeout

```javascript
rbm.imageWaitGone(filename, timeout, threshold)
```

* `filename` String
* `timeout` Integer
* `threshold` Float

Block until the image is gone or timeout

```javascript
rbm.keepScreenshot()
```

Keep the screenshot in memory. To avoid to many times screencap.


```javascript
rbm.screencrop(fromX, fromY, toX, toY)
```

* `fromX` Integer
* `fromY` Integer
* `toX` Integer
* `toY` Integer

Keep the partial screenshot in memory. To avoid to many times screencap.


```javascript
rbm.releaseScreenshot()
```

Release the screenshot in memory.

### Using keepScreenshot

```javascript
// Screencap three times
rbm.imageClick('apple.png', 0.9); // screencap, and release
rbm.imageClick('banana.png', 0.9); // screencap, and release
rbm.imageClick('cat.png', 0.9); // screencap, and release

// Screencap only one time (used when the screen has not changed)
rbm.keepScreenshot(); // screencap
rbm.imageClick('apple.png', 0.9); // no screencap, no release
rbm.imageClick('banana.png', 0.9); // no screencap, no release
rbm.imageClick('cat.png', 0.9); // no screencap, no release
rbm.releaseScreenshot(); // release
```

## gRPC APIs

### Message

```protobuf 
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
```

### Service

```protobuf 
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