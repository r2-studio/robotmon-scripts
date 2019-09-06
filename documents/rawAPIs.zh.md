# Robotmon Raw APIs 中文版


#### `getScreenSize()`

取得螢幕大小

回傳值 `Object` - `{width: Number, height: Number}`

```javascript
var sizeObj = getScreenSize();
console.log(sizeObj.width, sizeObj.height);
// 1080 1920
```
---
#### `getScreenshot()`

取得螢幕截圖，回傳值為圖片的指標，以數字代表

提示：圖片顏色將以 BGR 順序放置

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var img = getScreenshot();
console.log(img);
// 122344533 <- 圖片指標
releaseImage(img); // 圖片存在記憶體中，用完後必須釋放記憶體
```
---
#### `getScreenshotModify(cropX, cropY, cropWidth, cropHeight, resizeWidth, resizeHeight, qualitys)`

取得螢幕截圖，可設定截圖範圍，然後縮放圖片。（縮小圖片可以加速圖片運算速度）

提示：圖片顏色將以 BGR 順序放置

* `cropX` Number
* `cropY` Number
* `cropWidth`  Number
* `cropHeight` Number
* `resizeWidth` Number
* `resizeHeight` Number
* `quality` Number

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var image = getScreenshotModify(200, 200, 100, 100, 50, 50, 80);
console.log(image); // image width = 50, height = 50 
// 12333122
releaseImage(image);
```

#### `execute(command)`

呼叫 Android 系統指令，等同於 `adb shell` 指令。權限同等啟動Service方式。（透過電腦啟動：擁有adb權限；透過app啟動：只擁有app權限）

* `command` String

回傳值 `String` - 執行指令結果

```javascript
var result = execute("ls -al /sdcard");
console.log(result);
// drwxr-xr-x   2 root  root    64B 12 14 23:44 Robotmon
```

#### `tap(x, y, during)`

模擬觸控螢幕，點擊

* `x` Number
* `y` Number
* `during` Number
* `touchId` Number（不同 `touchId` 可以完成多點觸控，預設為 0）

```javascript
tap(200, 200, 10);
// 模擬手指點擊螢幕座標(200,200)位置
```

#### `tapDown(x, y, during)`

模擬觸控螢幕，按下螢幕

* `x` Number
* `y` Number
* `during` Number
* `touchId` Number（不同 `touchId` 可以完成多點觸控，預設為 0）

```javascript
tapDown(200, 200, 40);
// 模擬手指按下螢幕座標(200,200)位置
```

#### `tapUp(x, y, during)`

模擬觸控螢幕，離開螢幕

* `x` Number
* `y` Number
* `during` Number
* `touchId` Number（不同 `touchId` 可以完成多點觸控，預設為 0）

```javascript
tapUp(200, 200, 40);
// 模擬手指離開螢幕座標(200,200)位置
```

#### `moveTo(x, y, during)`

模擬觸控螢幕，手指移動位置。`moveTo`必須介於`tapDown` 和 `tapUp`之間

* `x` Number
* `y` Number
* `during` Number
* `touchId` Number（不同 `touchId` 可以完成多點觸控，預設為 0）

```javascript
tapDown(500, 300, 40);
moveTo(500, 600, 40);
tapUp(500, 600, 40);
// 模擬手指在螢幕上滑動事件
```

```javascript
tapDown(500, 300, 40, 1);
tapDown(800, 300, 40, 2);
moveTo(500, 600, 40, 1);
moveTo(800, 600, 40, 2);
tapUp(500, 600, 40, 1);
tapUp(800, 600, 40, 2);
// 模擬2根手指在螢幕上執行多點觸控
```

#### `swipe(x1, y1, x2, y2, during)`

模擬觸控螢幕，滑動。結合`tapDown`、`moveTo`和`tapUp`事件。
由於不同app偵測滑動事件各有不同，因此此功能在某些app中無法使用，請拆開事件自行撰寫。

提示：可以在三個事件中間自行插入 `sleep` 與更多的 `moveTo`

* `x1` Number
* `y1` Number
* `x2` Number
* `y2` Number
* `during` Number

```javascript
swipe(500, 300, 600, 400, 80);
```

#### `keycode(label, during)`

模擬系統按鍵，此功能類似 `adb shell input keyevent`
請參考 [Android Keycode 列表](https://developer.android.com/reference/android/view/KeyEvent.html)

* `label` String
* `during` Number

```javascript
keycode('HOME', 40); // 等同 keycode('KEYCODE_HOME', 40);
// 點擊Home鍵

keycode('BACK', 40);
// 點擊返回鍵
```

#### `typing(words, during)`

模擬打字，目前只支援英文數字

* `words` String
* `during` Number

```javascript
typing('Hello!', 100);
// 輸入字串 'H' 'e' 'l' 'l' 'o' '!'
```

### OpenCV

#### `clone(sourceImg)`

複製圖片到新的記憶體空間。（將佔用兩份記憶體）

提示：請記得`releaseImage`

* `sourceImg` Number

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var oriImage = getScreenshot();
for (var i = 0; i < 10; i++) {
  var cloneImage = clone(oriImage);
  // 修改複製過的圖片，不會修改原始圖片
  smooth(cloneImage, 1, 5); // 模糊處理
  release(cloneImage);
}
release(oriImage);
```


#### `smooth(sourceImg, smoothType, size)`

等同於 OpenCV `smooth()` function.

* `sourceImg` Number
* `smoothType` Number
* `size` Number

|smoothType|description|
|---|---|
|0|CV_BLUR_NO_SCALE|
|1|CV_BLUR|
|2|CV_GAUSSIAN|
|3|CV_MEDIAN|
|4|CV_BILATERAL|

```javascript
var img = getScreenshot();
smooth(img, 2, 5); // 高斯模糊
saveImage(img, getStoragePath + '/smooth.png');
releaseImage(img);
```

#### `convertColor(sourceImg, code)`

等同於 OpenCV `cvtColor()`。轉換圖片顏色。不支援不同channels數量，如果要轉灰階，請使用 `bgrToGray`。

* `sourceImg` Number
* `code` Number

|code|description|
|---|---|
|40|CV_BGR2HSV|
|52|CV_BGR2HLS|

詳細資訊: [OpenCV Types](https://github.com/opencv/opencv/blob/2.4/modules/imgproc/include/opencv2/imgproc/types_c.h)

```javascript
var img = getScreenshot();
// 將圖片從 BGR 轉成 HSV 顏色
convertColor(img, 40);
releaseImage(img);
```

#### `bgrToGray(sourceImg)`

轉換圖片從BGR格式（三通道）至灰階圖片（一通道）

* `sourceImg` Number

回傳值 `Number` - 灰階圖片指標

```javascript
var img = getScreenshot();
var gray = bgrToGray(img); // gray image
releaseImage(img);
releaseImage(gray);
```

#### `absDiff(sourceImg, targetImg)`

等同於 OpenCV `adbdiff()`.

* `sourceImg` Number
* `targetImg` Number

回傳值 `Number` - 圖片指標（以數字表示），紀錄差值

```javascript
var img1 = getScreenshot();
sleep(100);
var img2 = getScreenshot();
var grayImg1 = bgrToGray(img1);
var grayImg2 = bgrToGray(img2);
var diff = absDiff(grayImg1, grayImg2); // 必須先轉為灰階
releaseImage(grayImg1);
releaseImage(grayImg2);
releaseImage(img1);
releaseImage(img2);
releaseImage(diff);
```

#### `threshold(sourceImg, thr, maxThr, code)`

等同於 OpenCV `threshold()`.

* `sourceImg` Number
* `thr` Float
* `maxThr` Float
* `code` Number

|code|description|
|---|---|
|0|CV_THRES_BINARY|

詳細資料: [OpenCV Types](https://github.com/opencv/opencv/blob/2.4/modules/imgproc/include/opencv2/imgproc/types_c.h)

```javascript
keycode('MENU');
sleep(1000);
var img1 = getScreenshot();
keycode('HOME');
sleep(1000);
var img2 = getScreenshot();
var grayImg1 = bgrToGray(img1);
var grayImg2 = bgrToGray(img2);
var diff = absDiff(grayImg1, grayImg2); // 必須先轉為灰階
threshold(diff, 100, 255); // 將圖片值（灰階）如果小於等於100設為0，大於100設為255
var value = getImageColor(diff, 500, 200); // value => {r":255,"g":0,"b":0","a":0}
console.log(value['r']); // 灰階資料將存在 r 的欄位中，g 與 b 將為 0
releaseImage(grayImg1);
releaseImage(grayImg2);
releaseImage(img1);
releaseImage(img2);
releaseImage(diff);
```

#### `eroid(sourceImg, width, height, x, y)`

等同於 OpenCV `eroid`

`width`, `height`, `x`, `y` 為 `getStructuringElement()` 的參數.

* `sourceImg` Number
* `width` Number
* `height` Number
* `x` Number
* `y` Number

```javascript
var img = getScreenshot();
threshold(img, 100, 255);
eroid(img, 3, 3, 1, 1);
saveImage(img, getStoragePath() + '/test_eroid.png');
releaseImage(img);
```

#### `dilate(sourceImg, width, height, x, y)`

等同於 OpenCV `dilate`

`width`, `height`, `x`, `y` 為 `getStructuringElement()` 參數.

* `sourceImg` Number
* `width` Number
* `height` Number
* `x` Number
* `y` Number

```javascript
var img = getScreenshot();
threshold(img, 100, 255);
dilate(img, 3, 3, 1, 1);
saveImage(img, getStoragePath() + '/test_dilate.png');
releaseImage(img);
```

#### `inRange(sourceImg, minB, minG, minR, minA, maxB, maxG, maxR, maxA)`

等同於 OpenCV `inRange + clone + mask` 過濾圖片的每個像素，只保留範圍顏色，範圍外的值歸零

* `sourceImg` Number
* `minB` Number
* `minG` Number
* `minR` Number
* `minA` Number
* `maxB` Number
* `maxG` Number
* `maxR` Number
* `maxA` Number

回傳值 `Number` - 過濾後的圖片指標

```javascript
var img = getScreenshot();
var filteredImg = inRange(img, 0, 255, 255, 255, 255, 255, 255, 255); // 只保留藍色的像素
saveImage(filteredImg, getStoragePath() + '/test_filterd.png');
releaseImage(img);
releaseImage(filteredImg);
```

#### `outRange(sourceImg, minB, minG, minR, minA, maxB, maxG, maxR, maxA)`

等同於 OpenCV `inRange + clone + not + mask`. 過濾圖片的每個像素，只保留範圍外的顏色，範圍內的值歸零

* `sourceImg` Number
* `minB` Number
* `minG` Number
* `minR` Number
* `minA` Number
* `maxB` Number
* `maxG` Number
* `maxR` Number
* `maxA` Number

回傳值 `Number` - 過濾後的圖片指標

```javascript
var img = getScreenshot();
var filteredImg = outRange(img, 0, 255, 255, 255, 255, 255, 255, 255); // 保留除了藍色以外的顏色
saveImage(filteredImg, getStoragePath() + '/test_filterd.png');
releaseImage(img);
releaseImage(filteredImg);
```

#### `cloneWithMask(sourceImg, mask)`

等同於 OpenCV `copyTo`. 使用遮罩過濾複製圖片

* `sourceImg` Number
* `mask` Number

回傳值 `Number` - 新圖片指標

```javascript
// 比較兩張圖片的差異，並且只保留差異，將不同的像素歸零
var img1 = getScreenshot();
sleep(100);
var img2 = getScreenshot();
var diff = absDiff(img1, img2);
sleep(100);
var img3 = cloneWithMask(img1, diff);
releaseImage(img1);
releaseImage(img2);
releaseImage(img3);
releaseImage(diff);
```

#### `houghCircles(sourceImg, method, dp, minDist, p1, p2, minR, maxR)`

等同於 OpenCV `houghCircles`. 尋找圓形圖案.

* `sourceImg` Number
* `method` Number (3 = CV_HOUGH_GRADIENT)
* `dp` Float (1) (ratio between input image and input params.)
* `minDist` Float (圓與圓之間的最小距離)
* `p1` Float (輪廓canny閾值參數)
* `p2` Float (圓心閾值參數，最小認定為圓心值)
* `minR` Number (圓最小半徑)
* `maxR` Number (圓最大半徑)

回傳值 `Object` - Array of circles

```javascript
var img = getScreenshot();
var points = houghCircles(img, 3, 1, 8, 4, 8, 6, 14);
console.log(points); // {"0": {"x": 102, "y": "233", "r": 9}}
releaseImage(img);
```

#### `canny(sourceImg, t1, t2, apertureSize)`

等同於 OpenCV `canny` 邊緣梯度檢測

* `sourceImg` Number
* `t1` Float
* `t2` Float
* `apertureSize` Number

回傳值 `Number` - 圖片指標

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

等同於 OpenCV `findContours`. 尋找輪廓

* `cannyImgPtr` Number (必須是Canny後的圖片)
* `minArea` Number
* `maxArea` Number

回傳值 `Object` - `{"0": {x: Number, y: Number}`

```javascript
var img = getScreenshot();
threshold(img, 30, 255);
eroid(img, 5, 5, 1, 1);
var cannyImg = canny(img, 50, 150, 3);
var results = findContours(cannyImg, 1000, 10000); // 面積 > 100
console.log(JSON.stringify(results));
// {"0":{"x":537,"y":1850},"1":{"x":133,"y":601}}
releaseImage(img);
releaseImage(cannyImg);
```

#### `drawCircle(sourceImg, x, y, radius, r, g, b, a)`

在圖片上畫圓

* `sourceImg` Number
* `x` Number
* `y` Number
* `radius` Number
* `r` Number
* `g` Number
* `b` Number
* `a` Number

```javascript
var img = getScreenshot();
drawCircle(img, 100, 100, 10, 0, 0, 255, 0); // 畫一個藍色圓圈
saveImage(img, getStoragePath() + '/test_drawCircle.png');
releaseImage(img);
```

#### `getIdentityScore(sourceImg, targetImg)`

兩個圖片的相似度，兩湯圖片的大小必須一致

* `sourceImg` Number
* `targetImg` Number

回傳值 `Float` - 相似度 0~1 之間

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

裁剪圖片

* `x` Number
* `y` Number
* `width` Number
* `height` Number

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
saveImage(cropImg, getStoragePath() + '/test_crop.png');
releaseImage(img);
releaseImage(cropImg);
```

#### `findImage(sourceImg, targetImg)`

使用 OpenCV `Template Match` 以圖找圖片

* `sourceImg` Number
* `targetImg` Number

回傳值 `Object` - `{x: Number, y: Number, score: Float}`
（x, y 像素座標，score 為相似度 0~1）

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
var result = findImage(img, cropImg);
console.log(JSON.stringify(result)); // {"score":0.9999997615814209,"x":350,"y":550}
releaseImage(img);
releaseImage(cropImg);
```

#### `findImages(sourceImg, targetImg, scoreLimit, resultCountLimit, withoutOverlap)`

等同於重複執行 `findImage()`， 以圖找多圖

* `sourceImg` Number
* `targetImg` Number
* `scoreLimit` Number 相似度限制（可節省時間，越高越快）
* `resultCountLimit` Number 結果數量限制（可節省時間，越低越快）

回傳值 `String` - `{"0": {"x": Number, "y": Number, "score": Float}, "1": {"x": Number, "y": Number, "score": Float}}`, Key is String!

```javascript
var img = getScreenshot();
var cropImg = cropImage(img, 350, 550, 150, 150);
var result = findImages(img, cropImg, 0.95, 3);
console.log(JSON.stringify(result)); // {"0":{"score":0.9999997615814209,"x":350,"y":550}}
releaseImage(img);
releaseImage(cropImg);
```

#### `resizeImage(sourceImg, width, height)`

Resize image.

* `width` Number
* `height` Number

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var img = getScreenshot();
var resizeImg = resizeImage(img, 108, 192);
saveImage(resizeImg, getStoragePath() + '/test_resize.png');
releaseImage(img);
releaseImage(resizeImg);
```

#### `releaseImage(imgPtr)`

Very Important! You should call this function with all imgPtrs.

* `imgPtr` Number

```javascript
var img = getScreenshot(); // keep in memory
releaseImage(img); // release from memory
```

#### `getImageColor(sourceImg, x, y)`

Get color of point from an image.

* `sourceImg` Number
* `x` Number
* `y` Number

回傳值 `Object` - `{r: Number, g: Number, b: Number, a: Number}`

```javascript
var img = getScreenshot();
var color = getImageColor(img, 100, 100);
console.log(JSON.stringify(color)); // {"a":0,"b":21,"g":36,"r":198}
releaseImage(img);
```

#### `getImageSize(imgPtr)`

* `imgPtr` Number

回傳值 `Object` - `{width: Number, height: Number}`

```javascript
var img = getScreenshot();
var size = getImageSize(img);
console.log(JSON.stringify(size)); // {"height":1920,"width":1080}
releaseImage(img);
```

#### `saveImage(imgPtr, path)`

Save image to disk.

* `imgPtr` Number
* `path` String

```javascript
var img = getScreenshot();
saveImage(img, getStoragePath + '/test_save.png');
releaseImage(img);
```

#### `openImage(path)`

Open image from disk.

* `path` String

回傳值 `Number` - 圖片指標（以數字表示）

```javascript
var img = openImage(getStoragePath + '/test_save.png');
releaseImage(img);
```

#### `sleep(milliseconds)`

Like `sleep` function in C language, pause current process.

* `milliseconds` Number

```javascript
console.log('Hello');
sleep(1000);
console.log('Andy');
```

#### `getStoragePath()`

Get Robotmon folder. Like `/sdcard/Robotmon`.

回傳值 `String` - The storage path

```javascript
console.log(getStoragePath());
```

#### `getImageFromURL(url)`

Get image from an url.

* `url` String

回傳值 `Number` - 圖片指標（以數字表示）

#### `getImageFromBase64(base64)`

Get image from a base64 string.

* `base64` String

回傳值 `Number` - 圖片指標（以數字表示）

#### `getBase64FromImage(imgPtr)`

Get base64 string from an image.

* `imgPtr` Number

回傳值 `String` - base64

#### `readFile(path)`

Read a file as string.

* `path` String

回傳值 `String` - The text of the file

#### `writeFile(path, text)`

Write a string to a file.

* `path` String
* `text` String

#### `encrypt(script)`

Encrypted a string

* `script` String

回傳值 String - The encrypted script

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

回傳值 `String` - The result

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

回傳值 `Number` - The height of the virtual button

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
|resizeFactor|The resize ratio of the screenshot in user's environment. 等同於 `oriResizeFactor` is better. Range from `0` to `1`.|

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

回傳值 `Object` - The current app in foreground. `{packageName: String, activityName: String}`

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

* `position` Object - `{x: Number, y: Number}`

```javascript
rbm.tapDown(position)
```

* `position` Object - `{x: Number, y: Number}`

```javascript
rbm.tapUp(position)
```

* `position` Object - `{x: Number, y: Number}`

```javascript
rbm.moveTo(position)
```

* `position` Object - `{x: Number, y: Number}`

```javascript
rbm.swipe(from, to, steps)
```

* `from` Object - `{x: Number, y: Number}`
* `to` Object - `{x: Number, y: Number}`
* `steps` Number - Interpolation points between `from` and `to`

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

回傳值 `String` - The path of the image folder. All about images used in this library will load and save within this folder.

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
* `fromX` Number
* `fromY` Number
* `toX` Number
* `toY` Number

Crop the original screenshot and save it with `filename`. This function will resize the image with `oriResizeFactor` and compress with `imageQuality`.

```javascript
rbm.screencrop(filename, fromX, fromY, toX, toY)

// Examples:
rbm.screencrop('startButton.png', 100, 200, 200, 300)
```

* `filename` String
* `fromX` Number
* `fromY` Number
* `toX` Number
* `toY` Number

Crop the screenshot and save it with `filename`. This function will resize the image with `resizeFactor` and compress with `imageQuality`.

```javascript
rbm.findImage(filename, threshold)

// Examples:
rbm.findImage('startButton.png', 0.9)
```

* `filename` String
* `threshold` Float

回傳值 `Object` - Find the image with `filename` in screen. `{x: Number, y: Number, score: Float}`

```javascript
rbm.findImages(filename, threshold, countLimit, allowOverlap, deep)

// Examples:
rbm.findImages('startButton.png', 0.9, 3, false, false)
```

* `filename` String
* `threshold` Float
* `countLimit` Number
* `allowOverlap` Boolean
* `deep` Boolean

回傳值 `Object` - Find the image with `filename` in screen. `{x: Number, y: Number, score: Float}`

```javascript
rbm.imageExists(filename, threshold)
```

* `filename` String
* `threshold` Float

回傳值 `Boolean` - Whether the image is exists in screen.

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
* `timeout` Number
* `threshold` Float

Click the image if the image is exists in screen until timeout (milliseconds).

```javascript
rbm.imageWaitShow(filename, timeout, threshold)
```

* `filename` String
* `timeout` Number
* `threshold` Float

Block until the image is found or timeout

```javascript
rbm.imageWaitGone(filename, timeout, threshold)
```

* `filename` String
* `timeout` Number
* `threshold` Float

Block until the image is gone or timeout

```javascript
rbm.keepScreenshot()
```

Keep the screenshot in memory. To avoid to many times screencap.


```javascript
rbm.screencrop(fromX, fromY, toX, toY)
```

* `fromX` Number
* `fromY` Number
* `toX` Number
* `toY` Number

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
  rpc RunScript(RequestRunScript) 回傳值 (Response) {}
  rpc Logs(Empty) 回傳值 (stream Response) {}
  rpc GetScreenshot(RequestScreenshot) 回傳值 (ResponseScreenshot) {}
  rpc GetScreenSize(Empty) 回傳值 (ResponseScreenSize) {}
  rpc Tap(RequestTap) 回傳值 (Response) {}
  rpc TapDown(RequestTap) 回傳值 (Response) {}
  rpc TapUp(RequestTap) 回傳值 (Response) {}
  rpc MoveTo(RequestTap) 回傳值 (Response) {}
}
```

## Debug

* use 'robotmon-desktop/light-manager' 'StartService'' 
* use 'robotmon-desktop/light-manager' 'EnableRemotePhone' 
* reconnect USB ethernet tethering if required
* On mobile, launch the 'Robotmon' click menu/IP to get *IP* of mobile
* On mobile, launch the 'Robotmon' click any script
* build 'robotmon-desktop/app' on linux
* run 'robotmon-desktop/app' click 'Robotmon Devices' 新增 *IP*
* click '同步螢幕' if required
* run 'adb logcat | grep Robotmon:' to show related message
