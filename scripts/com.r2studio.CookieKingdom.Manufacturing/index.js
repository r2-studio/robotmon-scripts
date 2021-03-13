config = {
    sleep: 240,
    sleepAnimate: 800,
  
    run: true,
}

factoryType = ['wood', 'bean', 'sugar', 'tool', 'powder', 'bean_2', 'wood_2', 'powder_2', 'berry', 'berry_2', 'poweder_3', 'berry_3'];

pageBaseProductNoThirdFigure = [
    {x: 362, y: 23, r: 35, g: 30, b: 20},
    {x: 358, y: 23, r: 35, g: 30, b: 20},
    {x: 362, y: 19, r: 35, g: 30, b: 20},
    {x: 360, y: 16, r: 35, g: 30, b: 20},
    {x: 358, y: 19, r: 35, g: 30, b: 20},

]

pageWoodFarm = [
    {x: 584, y: 118, r: 121, g: 207, b: 12},
    {x: 206, y: 180, r: 251, g: 233, b: 182},
    {x: 205, y: 183, r: 251, g: 235, b: 182},
    {x: 434, y: 73, r: 174, g: 98, b: 73},
]

pageBeanFarm = [
    {x: 590, y: 121, r: 121, g: 207, b: 12},
    {x: 311, y: 22, r: 0, g: 255, b: 247},
    {x: 427, y: 83, r: 0, g: 253, b: 251},
    {x: 152, y: 179, r: 219, g: 171, b: 130},
    {x: 425, y: 82, r: 2, g: 252, b: 250}
]

pageSugarFarm = [
    {x: 586, y: 119, r: 121, g: 207, b: 12},
    {x: 426, y: 69, r: 237, g: 245, b: 245},
    {x: 276, y: 105, r: 217, g: 233, b: 232},
    {x: 171, y: 170, r: 142, g: 161, b: 178}
]

pagePowderFarm = [
    {x: 582, y: 119, r: 121, g: 207, b: 12},
    {x: 315, y: 24, r: 159, g: 117, b: 52},
    {x: 435, y: 91, r: 158, g: 117, b: 51},
    {x: 182, y: 185, r: 255, g: 239, b: 195},
    {x: 169, y: 190, r: 231, g: 149, b: 74}
]

pageBarryFarm = [
    {x: 571, y: 116, r: 121, g: 207, b: 13},
    {x: 304, y: 21, r: 190, g: 37, b: 37},
    {x: 409, y: 89, r: 174, g: 10, b: 24},
    {x: 236, y: 142, r: 250, g: 232, b: 181},
    {x: 220, y: 159, r: 213, g: 23, b: 39}
]

pageMilkFarm = [
    {x: 587, y: 121, r: 121, g: 207, b: 12},
    {x: 303, y: 25, r: 238, g: 245, b: 241},
    {x: 418, y: 91, r: 246, g: 246, b: 238},
    {x: 269, y: 169, r: 255, g: 254, b: 241}
]

pageCottomFarm = [
    {x: 582, y: 119, r: 121, g: 207, b: 12},
    {x: 528, y: 87, r: 254, g: 231, b: 251},
    {x: 428, y: 92, r: 255, g: 241, b: 255},
    {x: 252, y: 169, r: 251, g: 233, b: 179},
    {x: 192, y: 136, r: 254, g: 224, b: 242}
]

function pnt(x, y) {
    return {x: x, y: y};
}

function rect(x, y, width, height) {
    return {
        x:x, y:y, width:width, height:height
    }
}

function rgb(r, g, b) {
return {r:r, g:g, b:b}
}

function qTap(page, sleepTime) {
if (sleepTime == undefined) {
    sleepTime = config.sleep;
}
if (Array.isArray(page)) {
    page = page[0];
}
tap(page.x, page.y, sleepTime);
sleep(sleepTime);
}

function isSameColor(c1, c2, diff) {
if (diff === undefined) {
    diff = 35;
}
// console.log(JSON.stringify(c1), JSON.stringify(c2), diff);
if (Math.abs(c1.r - c2.r) < diff && Math.abs(c1.g - c2.g) < diff && Math.abs(c1.b - c2.b) < diff) {
    return true;
}
return false;
}

function checkIsPage(page, diff, img) {
var release = false;
if (img === undefined) {
    img = getScreenshot();
    release = true;
}
var whSize = getImageSize(img);
if (whSize.width === 360) {
    throw new Error('ROBroken');
}
var isPage = true;
for (var i in page) {
    var cbtn = page[i];
    var color = getImageColor(img, cbtn.x, cbtn.y);
    if (!isSameColor(cbtn, color, diff)) {
    isPage = false;
    break;
    }
}
if (release) {
    releaseImage(img);
}
return isPage;
}

function handleToolShopShovels() {
    pageToolShop = [
        {x: 280, y: 179, r: 254, g: 235, b: 182},
        {x: 304, y: 157, r: 138, g: 146, b: 171},
        {x: 414, y: 75, r: 135, g: 143, b: 170},
        {x: 413, y: 84, r: 183, g: 190, b: 211}
    ]
    if (checkIsPage(pageToolShop)) {
        console.log('Is tool shop, check adding shovel')
        tapDown(515, 319, 40, 0);
        sleep(config.sleep * 2);
        moveTo(515, 280, 40, 0);
        sleep(config.sleep * 2);
        moveTo(515, 230, 40, 0);
        sleep(config.sleep * 2);
        moveTo(515, 200, 40, 0);
        sleep(config.sleep * 2);
        moveTo(515, 176, 40, 0);
        sleep(config.sleep * 2);
        tapUp(515, 176, 40, 0);
        sleep(config.sleepAnimate * 2);

        pageShovelEnabled = [
            {x: 575, y: 336, r: 121, g: 207, b: 12},
            {x: 539, y: 296, r: 253, g: 253, b: 253},
            {x: 420, y: 310, r: 81, g: 98, b: 125},
            {x: 409, y: 297, r: 70, g: 98, b: 146}
        ]
        var shovelStock = ocrProductStorage(goodsLocation['shovel'])
        console.log('Shovel enable: ' + checkIsPage(pageShovelEnabled) + ' , stock: ' + shovelStock);

        // pageShovelOneDigits = [
        //     {x: 438, y: 323, r: 255, g: 255, b: 255},
        //     {x: 446, y: 321, r: 255, g: 255, b: 255}
        // ]
        // pageShovelTwoDigits = [
        //     {x: 448, y: 321, r: 255, g: 255, b: 255},
        //     {x: 449, y: 324, r: 255, g: 255, b: 255},
        //     {x: 435, y: 326, r: 255, g: 255, b: 255},
        //     {x: 435, y: 322, r: 255, g: 255, b: 255}
        // ]
    
        if (checkIsPage(pageShovelEnabled)){
            if (shovelStock < 10) {
                console.log('Shovel < 10, add 4');
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
            }
            else if (shovelStock < 58){
                console.log('10 < Shovel < 58, add 2');
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
            }
            else {
                console.log('failed to count shovels')
            }
            handleNotEnoughStock();
        }
        else {
            console.log('cannot find shovels')
        }
    
    }
    else {
        console.log('Not in tool shop, skip shovel check')
    }
}

function compare( a, b ) {
    if ( a.x < b.x ){
      return -1;
    }
    if ( a.x > b.x ){
      return 1;
    }
    return 0;
}

goodsLocation = {
    1: rect(430, 101, 18, 12),
    2: rect(430, 206, 20, 12),
    3: rect(430, 314, 20, 12),
    4: rect(430, 106, 18, 12),
    5: rect(432, 212, 18, 12),
    6: rect(432, 317, 18, 12),
    shovel: rect(432, 317, 18, 16),
}  

function ocrResultToInt(results) {
    if (results.length == 0) {
        return -1;
    }

    var digit_width = 5;
    for (var i in results){
        if (results[i].target == '1') {
            // 1 is very thin so we set the width to 4
            digit_width = 4;
            break;
        }
    }

    count = "";
    var idx = 1;
    while(idx < results.length) {
        if (results[idx].x - results[idx - 1].x < digit_width) {
            // results[i].score > results[i - 1].score ? results.splice(i - 1, 1) : results.splice(i, 1);
            if (results[idx].score > results[idx - 1].score) {
                results.splice(idx - 1, 1);
            } else{
                results.splice(idx, 1);
            }
        } else {
            idx ++;
        }
        // console.log('>>', idx, JSON.stringify(results))
    }

    for (var i in results) {
        count += results[i].target;
    }
    return count;
}

function ocrProductStorage(rect) {
    var img = getScreenshot();
    var croppedImage = cropImage(img, rect.x, rect.y, rect.width, rect.height);
    // var croppedImage = cropImage(img, 430, 311, 23, 15);
    releaseImage(img);

    var num_0 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2n4z/ALUfxD8A2us+I9O13T5nt9fPh9PDf2RWVY1tkl+1Bj85yxI5GMSL36lfUF38P/C+pfFi+1G88N6RdahLpqCS7nsInlcbwMFyuT0HU9hRWVn3NNOx/9k=");
    var num_1 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAJAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7n8bap4j0f9pz4dWkHiO6/wCEe1m1v0m0Ty0EAeGAuHLAbmJJHU4GOKK9D13/AJHrwx/uXX/oAopDP//Z");
    var num_2 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7k+OPjvxf4J8b+DofD+u6XIurahbWSeGZbLfc3aNJ/pE3m78okcfzZAwCMHOQKKyvjh4e0rUPjZ4Iv7rTLO5vofs6xXM1ujyRj7QThWIyBnniiovqV0P/2Q==");
    var num_3 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAHAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6I+Imo6Rq/wC25oOgeHZRFr9uJpdYSwE1veEtp7MhaZ3MTRbWiwiqCGySetFFFRHW5b0sf//Z");
    var num_4 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAJAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1P9pP9qP4iaJ8PvAiadcah4Z1JtMsb7WL+OydRc3E8DN5KPsKgLjcwznLKB0OCvrz4zf8iRa/9fMf/oDUVi077mia7H//2Q==");
    var num_5 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAJAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1j4q/G/X/AIW+PPEdr448deNdJW51e9fSIPDM+l3EC2ImYQqysjSRsFKjD4J/A0Uuv/8AJbPiZ/2FP6vRWOvc10P/2Q==");
    var num_6 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2f46XfiZfjj4vk1rSZb6wD28OkJceHdS1GFbVYVJaN7WVEBaR5NwOWyo7AUUUVg9zVbH/2Q==");
    var num_7 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2X9rfWvinpXxVfRvhZ4q8UXU8Vst9q1tDMrwWnnMwgjRQuV4ikPJPBFFFFYtXZqmf/9k=");
    var num_8 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDr/Gvj/wAUeC/E+reH9Z8aNdajpNytibi+8XSaVJIiW0GD5ARsqXMjCTPz7j/dooorBm6R/9k=");
    var num_9 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0LWv2dfi94r8WaxaaEsukyWEnmXusmea3bUpZ2ecIxdtshhV1j3J8vOO3BRRWaii+Zn//2Q==");

    numbers = [num_0, num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9];
    results = []
    for (var i in numbers) {
        // numbers[i] = bgrToGray(numbers[i], 40)
        var foundResults = findImages(croppedImage, numbers[i], 0.87, 10, true);
        for (var j in foundResults) {
            foundResults[j]['target'] = i;
            results.push(foundResults[j]);
        }
    }
    results.sort( compare );
    console.log('=> ', JSON.stringify(results));

    for (var i in numbers) {
        releaseImage(numbers[i]);
    }
    releaseImage(croppedImage);

    count = ocrResultToInt(results)
    return count;
}

function ocrMaterialStorage() {
    var img = getScreenshot();
    var croppedImage = cropImage(img, 338, 8, 49, 26);
    // var croppedImage = cropImage(img, 430, 311, 23, 15);
    releaseImage(img);

    var num_0 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAOAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzfwP+zx4d8QeC/DOkXuvazH8R/FGgXfiCwkiKfYYEhDMsTjGSWVCc9qK4Lwh+1nqfhzwBYaKPDunXPiXR9NuNH0zxNIX+0WtpPnzEC52seWAJ6A0USq8jszJQUlc//9k=");
    var num_1 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAMAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxn9mnwb8P/iJ8GvGceo6BfT+LtG8i4Oqy3zeUY3uEjCJGMY4Zsk5orx74X/FDX/hvo+vWeizxRw6vDFHdedCHLBJVkXGenzAUVzqStsaNtM//2Q==");
    var num_2 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAANAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxz4ZaL4C8e/s8+MdS1TwXJoEnh3SvMg8W/wBoys93qRf5IVVjtO4fwjpiivMh+1J4ot/gpb/C9tO0Wfw7HHIsby2CNOjOxzIH67xnhutFZzepUYto/9k=");
    var num_3 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAMAAkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyr9jz4feC/i1oGr6V4i8M6XdyWsVxLcalJrUkWqMPKLRi1t84fBU5x6184fZNH/5+Nf8A++K7r4W/HrxH8KvB1/beHrTRoLxmlCarNp0cl7CJFCuElPIGPyya8k/tzUP+fyb/AL7Nc6m1FGV1ZH//2Q==");
    var num_4 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAMAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz/wDY5/ZosPibp+o+KPG8N7caNLBdWujWcXmf6VdJCzs7EdEQD8WIFFeQ/Cj9pb4kfCg21r4d8U3trp1ukqx6dJIZLZd6kMRGeM85B9aKlOyFZM//2Q==");
    var num_5 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAMAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzX4BfD/wz4u+AJu7Hw74f8ZfEVtVu0fTdV1h7a6FokKsjQxqw3tu3cfWivGvhP8cdf+E/hzU18P2mkRXzb/L1S409JbuDcu1vLkPK8UVgmrIzuj//2Q==");
    var num_6 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmvE37O3hnxv8AACO98KtpGn+LfFv2/wAWrHcWLs62UEr7baGYfJCAoyfXpRXyro3xw8e6P8K7rwpZeKtRtvDrEwmwjlwgjc/OgPUKe4BwaKz0Ljdn/9k=");
    var num_7 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyz9hbQvAfxU1G50Dxl4EtL+y0u2e9v/EUl5MsqqzKkSbQ23l2A/GivFPh34z1nwx8F/iFaaVfNZQ3lxYecYkXe22UkDfjcBnsCAe9FZp6CTsf/9k=");
    var num_8 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC18Mfhz4FvP2dvDNtdaNpb3mpeEdS1OfRpdN36hf3EbNsuY7zpGFx90nnFFfHWjfHDx7pPwxn8L2firUbfQArW4skl+VY3++gPUKcnIBxRWDkuxnzI/9k=");
    var num_9 = getImageFromBase64("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBnwr8J/D3xN+ztqTva+GxYaRoV/J4o8+0I1KHUt7eQ8c2MBegAU/hRXxVb+LtatPCV54fh1O5i0S7uUnnsVkIjldQ21mHfFFK4rI//2Q==");

    numbers = [num_0, num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9];
    results = []
    for (var i in numbers) {
        // numbers[i] = bgrToGray(numbers[i], 40)
        var foundResults = findImages(croppedImage, numbers[i], 0.87, 10, true);
        for (var j in foundResults) {
            foundResults[j]['target'] = i;
            results.push(foundResults[j]);
        }
    }
    results.sort( compare );
    console.log('=> ', JSON.stringify(results));

    for (var i in numbers) {
        releaseImage(numbers[i]);
    }
    releaseImage(croppedImage);

    count = ocrResultToInt(results)
    return count;
}

function JobScheduling() {
    // isNoThirdFigure = checkIsPage(pageBaseProductNoThirdFigure);
    // console.log('if stock < 99: ', isNoThirdFigure)
    // if (!isNoThirdFigure) {
    //     console.log('> 99, no need to add more')
    //     return true;
    // }

    //rgb(166,104,65)
    pageAnyProduction = [
        {x: 20, y: 43, r: 166, g: 104, b: 65},
        {x: 80, y: 44, r: 166, g: 104, b: 65}
    ]
    pageAlreadyProducing = [
        {x: 459, y: 39, r: 54, g: 173, b: 224},
        {x: 400, y: 48, r: 60, g: 70, b: 105},
    ]
    if (checkIsPage(pageAnyProduction)) {
        qTap(pnt(48, 74));
        sleep(config.sleepAnimate * 2);
    }
    if (checkIsPage(pageAlreadyProducing)) {
        qTap(pageAlreadyProducing);
        sleep(config.sleepAnimate * 2);
    }

    var materialCount = ocrMaterialStorage();
    if (materialCount == -1) {
        console.log('This is not a material production');
    } else if (materialCount > 100) {
        console.log('Skip as stock enough: ', materialCount);
        return;
    } else {
        console.log('Material stock: ', materialCount)
        pageFirstItemEnabled = [
            {x: 569, y: 119, r: 121, g: 207, b: 12},
        ]
        pageSecondItemEnabled = [
            {x: 571, y: 223, r: 121, g: 207, b: 12},
        ]
        pageThirdItemEnabled = [
            {x: 568, y: 329, r: 121, g: 207, b: 14},
        ]
    
        if (checkIsPage(pageWoodFarm)){
            console.log('wood farm, add more')
            qTap(pageWoodFarm)
            sleep(config.sleepAnimate);
            qTap(pageWoodFarm)
            sleep(config.sleepAnimate);
            qTap(pageWoodFarm)
            sleep(config.sleepAnimate);
            qTap(pageWoodFarm)
            return true;
        }
        else if (checkIsPage(pageBeanFarm)){
            console.log('bean farm, add more')
            qTap(pageBeanFarm)    
            sleep(config.sleepAnimate);
            qTap(pageBeanFarm)    
            sleep(config.sleepAnimate);
            qTap(pageBeanFarm)    
            sleep(config.sleepAnimate);
            qTap(pageBeanFarm)    
            return true;
        }
        else if (checkIsPage(pageSugarFarm)){
            console.log('sugar farm, add more')
            qTap(pageSugarFarm)    
            sleep(config.sleepAnimate);
            qTap(pageSugarFarm)    
            sleep(config.sleepAnimate);
            qTap(pageSugarFarm)    
            sleep(config.sleepAnimate);
            qTap(pageSugarFarm)    
            return true;
        }
        else if (checkIsPage(pagePowderFarm)){
            console.log('Powder farm, add more')
            if (checkIsPage(pageSecondItemEnabled)) {
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
            } else {
                qTap(pagePowderFarm)
                sleep(config.sleepAnimate);
                qTap(pagePowderFarm)
                sleep(config.sleepAnimate);
                qTap(pagePowderFarm)
                sleep(config.sleepAnimate);
                qTap(pagePowderFarm)    
            }
            return true;
        }
        else if (checkIsPage(pageBarryFarm)){
            console.log('Barry farm, add more')
            if (checkIsPage(pageSecondItemEnabled)) {
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
            }
            else {
                qTap(pageBarryFarm)
                sleep(config.sleepAnimate);
                qTap(pageBarryFarm)
                sleep(config.sleepAnimate);
                qTap(pageBarryFarm)
                sleep(config.sleepAnimate);
                qTap(pageBarryFarm)
            }
            return true;
        }
        else if (checkIsPage(pageMilkFarm)){
            console.log('Milk farm, add more')
            qTap(pageMilkFarm)    
            sleep(config.sleepAnimate);
            qTap(pageMilkFarm)    
            sleep(config.sleepAnimate);
            qTap(pageMilkFarm)    
            sleep(config.sleepAnimate);
            qTap(pageMilkFarm)    
            return true;
        }
        else if (checkIsPage(pageCottomFarm)){
            console.log('Cottom farm, add more')
            qTap(pageCottomFarm)    
            sleep(config.sleepAnimate);
            qTap(pageCottomFarm)    
            sleep(config.sleepAnimate);
            qTap(pageCottomFarm)    
            sleep(config.sleepAnimate);
            qTap(pageCottomFarm)    
            return true;
        }
        return true;
    }

    pageFirstItemEnabled = [
        {x: 587, y: 122, r: 121, g: 207, b: 12}
    ]
    pageSecondItemEnabled = [
        {x: 587, y: 230, r: 121, g: 207, b: 12}
    ]
    pageThirdItemEnabled = [
        {x: 587, y: 332, r: 121, g: 207, b: 12}
    ]

    // pageFirstItemHasOneDigits = [
    //     {x: 446, y: 107, r: 255, g: 255, b: 255},
    //     {x: 437, y: 107, r: 255, g: 255, b: 255}
    // ]

    // pageSecondItemHasOneDigits = [
    //     {x: 446, y: 213, r: 255, g: 255, b: 255},
    //     {x: 437, y: 213, r: 255, g: 255, b: 255}
    // ]

    // pageThirdItemHasOneDigits = [
    //     {x: 446, y: 320, r: 255, g: 255, b: 255},
    //     {x: 437, y: 320, r: 255, g: 255, b: 255}
    // ]

    // //rgb(77,71,65)
    // pageFirstItemHasThreeDigits = [
    //     {x: 436, y: 107, r: 77, g: 71, b: 65}
    // ]
    // //rgb(203,201,199)
    // pageSecondItemHasThreeDigits = [
    //     {x: 437, y: 212, r: 65, g: 58, b: 51}
    // ]
    // pageThirdItemHasThreeDigits = [
    //     {x: 436, y: 320, r: 77, g: 71, b: 65}
    // ]

    itemsAdd = 0;
    // add < 10
    var goodsOneStock = ocrProductStorage(goodsLocation[1])
    var goodsTwoStock = ocrProductStorage(goodsLocation[2])
    var goodsThreeStock = ocrProductStorage(goodsLocation[3])
    console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock);

    if (goodsOneStock < 10) {
        console.log('add 1st item from ' + goodsOneStock + ' to > 10')
        qTap(pageFirstItemEnabled);
        sleep(config.sleepAnimate);
        if (!handleNotEnoughStock()) {
            itemsAdd ++;
        }
    }

    if (checkIsPage(pageSecondItemEnabled) && goodsTwoStock < 10) {
        console.log('add 2nd item from ' + goodsTwoStock + ' to > 10')
        qTap(pageSecondItemEnabled);
        sleep(config.sleepAnimate);
        if (!handleNotEnoughStock()) {
            itemsAdd ++;
        }
    }    

    if (checkIsPage(pageThirdItemEnabled) && goodsThreeStock < 10) {
        console.log('add 3rd item from ' + goodsThreeStock + ' to > 10')
        qTap(pageThirdItemEnabled);
        sleep(config.sleepAnimate);
        if (!handleNotEnoughStock()) {
            itemsAdd ++;
        }
    }

    if (itemsAdd > 2) {
        return true;
    }

    // add 10 < x < 60
    if (goodsOneStock < 58) {
        console.log('add 1st item to > 58')
        qTap(pageFirstItemEnabled);
        sleep(config.sleepAnimate);
        if (!handleNotEnoughStock()) {
            itemsAdd ++;
        }
    }

    if (!checkIsPage(pageSecondItemEnabled)) {
        return;
    } else {
        if (goodsOneStock < 58) {
            console.log('add 2nd item to > 58')
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }    
    }

    if (!checkIsPage(pageThirdItemEnabled)) {
        return;
    } else {
        if (goodsThreeStock < 58) {
            console.log('add 3rd item to > 58')
            qTap(pageThirdItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }
    }

    if (itemsAdd > 3) {
        return true;
    }

    // === tool shop only ===
    handleToolShopShovels();
    // end of tool shop ===
    
    // Slide to buttom
    tapDown(515, 340, 40, 0);
    sleep(config.sleep);
    moveTo(515, 150, 40, 0);
    sleep(config.sleep);
    moveTo(515, -1500, 40, 0);
    sleep(config.sleep);
    tapUp(515, -150, 40, 0);
    sleep(config.sleepAnimate * 3);

    // pageFirstItemHasOneDigits = [
    //     {x: 446, y: 112, r: 255, g: 255, b: 255},
    //     {x: 437, y: 112, r: 255, g: 255, b: 255}
    // ]
    // pageSecondItemHasOneDigits = [
    //     {x: 446, y: 217, r: 255, g: 255, b: 255},
    //     {x: 437, y: 217, r: 255, g: 255, b: 255}
    // ]
    // pageThirdItemHasOneDigits = [
    //     {x: 446, y: 324, r: 255, g: 255, b: 255},
    //     {x: 437, y: 324, r: 255, g: 255, b: 255}
    // ]

    // pageSecondItemHasThreeDigits = [
    //     {x: 436, y: 217, r: 77, g: 71, b: 65}
    // ]
    // pageThirdItemHasThreeDigits = [
    //     {x: 436, y: 324, r: 77, g: 71, b: 65}
    // ]

    var goodsFourStock = ocrProductStorage(goodsLocation[4])
    var goodsFiveStock = ocrProductStorage(goodsLocation[5])
    var goodsSixStock = ocrProductStorage(goodsLocation[6])

    // add < 10
    if (!checkIsPage(pageFirstItemEnabled)) {
        console.log('4th item is not enabled')
        return;
    } else {
        if (goodsFourStock < 10) {
            console.log('add 4th item from ' + goodsFourStock + ' to > 10')
            qTap(pageFirstItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }
    }

    if (!checkIsPage(pageSecondItemEnabled)) {
        console.log('5th item is not enabled')
        // return;
    } else {
        if (goodsFiveStock < 10) {
            console.log('add 5th item from ' + goodsFiveStock + ' to > 10')
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }    
    }

    if (!checkIsPage(pageThirdItemEnabled)) {
        console.log('6th item is not enabled')
        // return;
    } else {
        if (goodsSixStock < 10) {
            console.log('add 6th item from ' + goodsSixStock + ' to > 10')
            qTap(pageThirdItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }
    }

    // add 10 < x < 100
    if (goodsFourStock < 58 && checkIsPage(pageFirstItemEnabled)) {
        console.log('add 4th item to > 58')
        qTap(pageFirstItemEnabled);
        sleep(config.sleepAnimate);
        if (!handleNotEnoughStock()) {
            itemsAdd ++;
        }
    }

    if (!checkIsPage(pageSecondItemEnabled)) {
        return;
    } else {
        if (goodsFiveStock < 58) {
            console.log('add 5th item to > 58')
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }    
    }

    if (!checkIsPage(pageThirdItemEnabled)) {
        // return;
    } else {
        if (goodsSixStock < 58) {
            console.log('add 6th item to > 58')
            qTap(pageThirdItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd ++;
            }
        }
    }
}

function handleNotEnoughStock() {
    pageNotEnoughStock = [
        {x: 428, y: 98, r: 56, g: 167, b: 231},
        {x: 345, y: 104, r: 60, g: 70, b: 105},
        {x: 370, y: 176, r: 243, g: 233, b: 223},
        {x: 349, y: 247, r: 121, g: 207, b: 12}
    ]
    if (checkIsPage(pageNotEnoughStock)) {
        console.log('quiting not enougth stock')
        qTap(pageNotEnoughStock);
        sleep(config.sleep);
        return true;
    }

    pageTwoItemNotEnoughStock = [
        {x: 444, y: 98, r: 56, g: 166, b: 231},
        {x: 375, y: 105, r: 60, g: 70, b: 105},
        {x: 420, y: 203, r: 243, g: 233, b: 223},
        {x: 416, y: 246, r: 219, g: 207, b: 199}
    ]
    if (checkIsPage(pageTwoItemNotEnoughStock)) {
        console.log('quiting not enougth stock 2')
        qTap(pageTwoItemNotEnoughStock);
        sleep(config.sleep);
        return true;
    }

    pageNotEnoughRequiredItems = [
        {x: 354, y: 241, r: 121, g: 207, b: 12},
        {x: 297, y: 247, r: 121, g: 207, b: 12},
        {x: 233, y: 108, r: 60, g: 70, b: 105},
        {x: 426, y: 108, r: 60, g: 70, b: 105},
        {x: 430, y: 134, r: 243, g: 233, b: 223},
        {x: 419, y: 247, r: 219, g: 207, b: 199},
        {x: 252, y: 245, r: 219, g: 207, b: 199},
        {x: 212, y: 247, r: 219, g: 207, b: 199},
    ]
    if (checkIsPage(pageNotEnoughRequiredItems)) {
        console.log('quiting pageNotEnoughRequiredItems')
        qTap(pageNotEnoughRequiredItems);
        sleep(config.sleep);
        return true;
    }

    pageAnErrorHasOccuredWhileProcessing = [
        {x: 348, y: 246, r: 121, g: 207, b: 12},
        {x: 297, y: 247, r: 121, g: 207, b: 12},
        {x: 233, y: 108, r: 60, g: 70, b: 105},
        {x: 410, y: 108, r: 60, g: 70, b: 105},
        {x: 430, y: 134, r: 243, g: 233, b: 223},
        {x: 419, y: 247, r: 219, g: 207, b: 199},
        {x: 252, y: 245, r: 219, g: 207, b: 199},
        {x: 212, y: 247, r: 219, g: 207, b: 199},
    ]
    if (checkIsPage(pageAnErrorHasOccuredWhileProcessing)) {
        console.log('quiting pageAnErrorHasOccuredWhileProcessing')
        qTap(pageAnErrorHasOccuredWhileProcessing);
        sleep(config.sleep);
        return true;
    }

    return false;
}

function start() {

    for (var i = 1; i < 100000000; i++) {
        var runMain = false;
        console.log("start loop", i);
  
        var act = JobScheduling();
        sleep(config.sleep);
        handleNotEnoughStock();
        sleep(config.sleep);
        qTap(pnt(349, 174)); // next
        sleep(config.sleepAnimate);

        if (config.run == false) {
            console.log('jobs done!')
            break;
        }
    }
  }
  
   start();
//   JobScheduling()
// ocrMaterialStorage();
// ocrProductStorage(goodsLocation[2]);
// ocrProductStorage(rect(433, 315, 16, 12));
// ocrProductStorage(goodsLocation['shovel'])
