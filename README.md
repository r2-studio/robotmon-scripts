# Robotmon JavaScript APIs

Only support ES5

## Contents

* [JavaScript Events](#javascrip-svents)
* [JavaScript Interface](#javascrip-interface)
* [JavaScript APIs](#javascrip-apis)
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

## JavaScript APIs

```javascript
getScreenSize()
```

Returns `Object` - `{width: Integer, height: Integer}`

```javascript
getScreenshotModify(cropX, cropY, cropWidth, cropHeight, resizeWidth, resizeHeight, qualitys)
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
swipe(x1, y1, x2, y2, during)
```

* `x1` Integer
* `y1` Integer
* `x2` Integer
* `y2` Integer
* `during` Integer

```javascript
keycode(label, during)
```

* `label` String
* `during` Integer

```javascript
typing(words, during)
```

* `words` String
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
eroid(sourceImg, width, height, x, y)
```

* `sourceImg` Integer
* `width` Integer
* `height` Integer
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

```javascript
findImages(sourceImg, targetImg, scoreLimit, resultCountLimit, withoutOverlap)
```

* `sourceImg` Integer
* `targetImg` Integer
* `scoreLimit` Integer
* `resultCountLimit` Integer
* `withoutOverlap` Boolean

Returns `String` - `{"0": {"x": Integer, "y": Integer, "score": Float}, "1": {"x": Integer, "y": Integer, "score": Float}}`, Key is String!

```javascript
getIdentityScore(sourceImg, targetImg)
```

* `sourceImg` Integer
* `targetImg` Integer

Returns `Float` - The identity score 

```javascript
findImage(sourceImg, targetImg)
```

* `sourceImg` Integer
* `targetImg` Integer

Returns `Object` - `{x: Integer, y: Integer, score: Float}`

```javascript
cropImage(sourceImg, x, y, width, height)
```

* `x` Integer
* `y` Integer
* `width` Integer
* `height` Integer

Returns `Integer` - The image pointer

```javascript
resizeImage(sourceImg, width, height)
```

* `width` Integer
* `height` Integer

Returns `Integer` - The image pointer

```javascript
releaseImage(imgPtr)
```

* `imgPtr` Integer

```javascript
getImageColor(sourceImg, x, y)
```

* `sourceImg` Integer
* `x` Integer
* `y` Integer

Returns `Object` - `{r: Integer, g: Integer, b: Integer, a: Integer}`

```javascript
getImageSize(imgPtr)
```

* `imgPtr` Integer

Returns `Object` - `{width: Integer, height: Integer}`

```javascript
saveImage(imgPtr, path)
```

* `imgPtr` Integer
* `path` String

```javascript
openImage(path)
```

* `path` String

Returns `Integer` - The image pointer

```javascript
sleep(milliseconds)
```

* `milliseconds` Integer

```javascript
getStoragePath()
```

Returns `String` - The storage path

```javascript
getImageFromURL(url)
```

* `url` String

Returns `Integer` - The image pointer

```javascript
getImageFromBase64(base64)
```

* `base64` String

Returns `Integer` - The image pointer

```javascript
getBase64FromImage(imgPtr)
```

* `imgPtr` Integer

Returns `String` - base64

```javascript
log(tag, message)
```

* `tag` String
* `message` String

Returns `String` - The log message

```javascript
readFile(path)
```

* `path` String

Returns `String` - The text of the file

```javascript
writeFile(path, text)
```

* `path` String
* `text` String

```javascript
encrypt(script)
```

Returns String - The encrypted script

* `script` String

```javascript
runScript(script)
```

* `script` String

```javascript
runEncryptedScript(script)
```

* `script` String - The script is encrypted by `encrypt`

```javascript
httpClient(method, url, body, headers)

// Examples:
httpClient('GET', 'http://httpbin.org/get', '', {});
httpClient('POST', 'http://httpbin.org/post', 'body data', {});
httpClient('POST', 'http://httpbin.org/post', 'foo=bar&bar=foo', {'Content-Type': 'application/x-www-form-urlencoded'});
```

* `method` String
* `url` String
* `body` String
* `headers` Object

Returns `String` - The result

```javascript
importJS(library)

// Examples:
importJS('RBM-0.0.2') // import shared library in libs
importJS('js/customerJS') // import local library
```

* `library` String

```javascript
getVirtualButtonHeight()
```

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