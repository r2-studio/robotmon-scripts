config = {
    sleep: 240,
    sleepAnimate: 800,
    sleepWhenDoubleLoginInMinutes: 30,
    localPath: getStoragePath() + '/scripts/com.r2studio.CookieKingdom.Manufacturing.beta/images',

    account: 'moonminv2@gmail.com',
    password: '12qwaszx',
    materialsTarget: 260,
    goodsTarget: 50,
    worksBeforeCollectCandy: 40,
    isCollectCandy: true,

    jobFailedBeforeGetCandy: 5,
    jobFailedCount: 0,
    run: true,
    isXR: true,
    findCookieHouseV2: true,
    findProductionTimes: 8,
}

factoryType = ['wood', 'bean', 'sugar', 'tool', 'powder', 'bean_2', 'wood_2', 'powder_2', 'berry', 'berry_2', 'poweder_3', 'berry_3'];

pageBaseProductNoThirdFigure = [
    { x: 362, y: 23, r: 35, g: 30, b: 20 },
    { x: 358, y: 23, r: 35, g: 30, b: 20 },
    { x: 362, y: 19, r: 35, g: 30, b: 20 },
    { x: 360, y: 16, r: 35, g: 30, b: 20 },
    { x: 358, y: 19, r: 35, g: 30, b: 20 },
]

pageWoodFarm = [
    { x: 584, y: 118, r: 121, g: 207, b: 12 },
    { x: 434, y: 73, r: 174, g: 98, b: 73 },
    { x: 528, y: 82, r: 145, g: 85, b: 56 }
]

pageBeanFarm = [
    { x: 590, y: 121, r: 121, g: 207, b: 12 },
    { x: 311, y: 22, r: 0, g: 255, b: 247 },
    { x: 427, y: 83, r: 0, g: 253, b: 251 },
    { x: 425, y: 82, r: 2, g: 252, b: 250 },
    {x: 526, y: 89, r: 0, g: 254, b: 251}
]

pageSugarFarm = [
    { x: 586, y: 119, r: 121, g: 207, b: 12 },
    { x: 426, y: 69, r: 237, g: 245, b: 245 },
    { x: 307, y: 13, r: 250, g: 252, b: 252 },
    { x: 523, y: 81, r: 236, g: 245, b: 244 },
    { x: 428, y: 95, r: 254, g: 254, b: 254 }
]

pagePowderFarm = [
    { x: 582, y: 119, r: 121, g: 207, b: 12 },
    { x: 315, y: 24, r: 159, g: 117, b: 52 },
    { x: 435, y: 91, r: 158, g: 117, b: 51 },
    { x: 528, y: 89, r: 235, g: 207, b: 138 }
]

pageBarryFarm = [
    { x: 587, y: 123, r: 121, g: 207, b: 12 },
    { x: 425, y: 86, r: 194, g: 38, b: 46 },
    { x: 429, y: 79, r: 32, g: 116, b: 40 },
    { x: 306, y: 19, r: 190, g: 38, b: 44 },
    { x: 524, y: 90, r: 163, g: 31, b: 35 },
]

pageMilkFarm = [
    { x: 587, y: 121, r: 121, g: 207, b: 12 },
    { x: 303, y: 25, r: 238, g: 245, b: 241 },
    { x: 418, y: 91, r: 246, g: 246, b: 238 },
    { x: 526, y: 89, r: 255, g: 253, b: 235 }
]

pageCottomFarm = [
    { x: 582, y: 119, r: 121, g: 207, b: 12 },
    { x: 528, y: 87, r: 254, g: 231, b: 251 },
    { x: 428, y: 92, r: 255, g: 241, b: 255 },

]

pageInKingdomVillage = [
    {x: 248, y: 15, r: 241, g: 51, b: 92},
    {x: 321, y: 15, r: 255, g: 238, b: 17},
    {x: 428, y: 14, r: 0, g: 193, b: 255},
    {x: 517, y: 22, r: 235, g: 161, b: 89},
    {x: 551, y: 15, r: 251, g: 239, b: 215},
    {x: 617, y: 308, r: 71, g: 122, b: 190},
    {x: 27, y: 225, r: 223, g: 156, b: 77},
    {x: 19, y: 111, r: 190, g: 3, b: 37}
]

pageInProduction = [
    { x: 609, y: 19, r: 56, g: 167, b: 231 },
    { x: 617, y: 19, r: 255, g: 255, b: 255 },
    { x: 625, y: 18, r: 34, g: 85, b: 119 },
    { x: 619, y: 331, r: 166, g: 104, b: 65 },
    { x: 19, y: 321, r: 166, g: 104, b: 65 }
]

function pnt(x, y) {
    return { x: x, y: y };
}

function rect(x, y, width, height) {
    return {
        x: x, y: y, width: width, height: height
    }
}

function rgb(r, g, b) {
    return { r: r, g: g, b: b }
}

function qTap(page, sleepTime) {
    if (sleepTime == undefined) {
        sleepTime = 0;
    }
    if (Array.isArray(page)) {
        page = page[0];
    }
    // tap(page.x, page.y, sleepTime);
    tapDown(page.x, page.y, 10);
    sleep(sleepTime);
    tapUp(page.x, page.y, 10);
    sleep(sleepTime);
}

function tapRandom(x1, y1, x2, y2, sleepTime) {
    var x = x1 + Math.random() * (x2 - x1);
    var y = y1 + Math.random() * (y2 - y1);
    console.log('tap: ', x, y)
    qTap(pnt(x, y), sleepTime);
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
        console.log('image size is incorrect, restart CookieKingdom wait 20s')
        execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');
        sleep(20000);
        img = getScreenshot();
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

function mergeObject(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                // console.log('merge type: ', key, source[key], typeof(source[key]))
                target[key] = source[key];
            }
        }
    }
    return target;
}

function handleToolShopShovels() {
    pageToolShop = [
        { x: 280, y: 179, r: 254, g: 235, b: 182 },
        { x: 304, y: 157, r: 138, g: 146, b: 171 },
        { x: 414, y: 75, r: 135, g: 143, b: 170 },
        { x: 413, y: 84, r: 183, g: 190, b: 211 }
    ]
    if (checkIsPage(pageToolShop)) {
        console.log('Is tool shop, check adding shovel')
        tapDown(430, 319, 40, 0);
        sleep(config.sleep * 2);
        moveTo(430, 280, 40, 0);
        sleep(config.sleep * 2);
        moveTo(430, 230, 40, 0);
        sleep(config.sleep * 2);
        moveTo(430, 200, 40, 0);
        sleep(config.sleep * 2);
        moveTo(430, 176, 40, 0);
        sleep(config.sleep * 2);
        tapUp(430, 176, 40, 0);
        sleep(config.sleepAnimate * 2);

        pageShovelEnabled = [
            { x: 575, y: 336, r: 121, g: 207, b: 12 },
            { x: 539, y: 296, r: 253, g: 253, b: 253 },
            { x: 420, y: 310, r: 81, g: 98, b: 125 },
            { x: 409, y: 297, r: 70, g: 98, b: 146 }
        ]
        var shovelStock = ocrProductStorage(goodsLocation['shovel'])
        console.log('Shovel enable: ' + checkIsPage(pageShovelEnabled) + ' , stock: ' + shovelStock);

        if (shovelStock == -1) {
            console.log('ocr failed, skip this shovel check')
        }
        // pageShovelTwoDigits = [
        //     {x: 448, y: 321, r: 255, g: 255, b: 255},
        //     {x: 449, y: 324, r: 255, g: 255, b: 255},
        //     {x: 435, y: 326, r: 255, g: 255, b: 255},
        //     {x: 435, y: 322, r: 255, g: 255, b: 255}
        // ]

        if (checkIsPage(pageShovelEnabled)) {
            if (shovelStock < 10) {
                console.log('Shovel < 10, add 2');
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
            }
            else if (shovelStock < config.goodsTarget) {
                console.log('10 < ', shovelStock , ' < ', config.goodsTarget, ', add 2');
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
                qTap(pageShovelEnabled);
                sleep(config.sleepAnimate);
            }
            else {
                console.log('shovels > ', config.goodsTarget, ', skipping');
                return;
            }
            handleNotEnoughStock();
        }
        else {
            console.log('cannot find shovels')
        }

    }
    else {
        // console.log('Not in tool shop, skip shovel check')
    }
}

function compare(a, b) {
    if (a.x < b.x) {
        return -1;
    }
    if (a.x > b.x) {
        return 1;
    }
    return 0;
}

goodsLocation = {
    1: rect(430, 101, 22, 12),
    2: rect(430, 206, 22, 12),
    3: rect(430, 314, 22, 12),
    4: rect(430, 106, 22, 12),
    5: rect(430, 212, 22, 12),
    6: rect(430, 317, 22, 12),
    shovel: rect(430, 317, 22, 16),
}

function ocrResultToInt(results) {
    if (results.length == 0) {
        return -1;
    }

    var digit_width = 5;
    for (var i in results) {
        if (results[i].target == '1') {
            // 1 is very thin so we set the width to 4
            digit_width = 4;
            break;
        }
    }

    count = "";
    var idx = 1;
    while (idx < results.length) {
        if (results[idx].x - results[idx - 1].x < digit_width) {
            // results[i].score > results[i - 1].score ? results.splice(i - 1, 1) : results.splice(i, 1);
            if (results[idx].score > results[idx - 1].score) {
                results.splice(idx - 1, 1);
            } else {
                results.splice(idx, 1);
            }
        } else {
            idx++;
        }
        // console.log('>>', idx, JSON.stringify(results))
    }

    for (var i in results) {
        count += results[i].target;
    }
    
    return parseInt(count, 10);
}

function ocrProductStorage(rect) {
    var img = getScreenshot();
    var croppedImage = cropImage(img, rect.x, rect.y, rect.width, rect.height);
    // var croppedImage = cropImage(img, 430, 311, 23, 15);
    releaseImage(img);

    var num_0 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAcAAAAICAYAAAA1BOUGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADiSURBVBhXY/wPBAxAcOvmdYYH9+8xqGtoMcjKyTMwMTExMIAk9+3e+d/ewui/nbnBf28Xu//Xr14BCf9n+vbtK8O82dMZ5OTlGaobWhhExcQZFsydBTKMgenRw4cM7969ZbCysWdwcfNk0NDSZjh35iTDv3//GJh+/vzB8P/ffwZuHm6wPezs7Aw/fvyASPLzCzAws7AwvHj+jOH3798Mnz59ZBAQFGJgAYqxyMkrMOgZGDIc3LeXgZmZheHKpYsMfgHBYDvBXnny+BHD4gVzGF4+f86grKrGEBWXyCAsLMIAANMJW83BlymiAAAAAElFTkSuQmCC");
    var num_1 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACcSURBVBhXY/wPBP/+/WN49/YNAyMTE4OgoBADE5BmfPf27f+d27cwnD19kkFCUoohPTufgYeHh4Hl6pVLDHNnTgOqZmR48/o1w+9fvxhAgMnS2pZh8sx5DJ7efgxAU8GCIMDEzMzMoKCoBOUiABOUZmBkZISyIAAugQ7AEiDVrKysDGzsbAidUH/8f/Hi+f97d27///PnD1Dk/38AUx08JObLjGQAAAAASUVORK5CYII=");
    var num_2 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADVSURBVBhXY/wPBM+fPWW4evkSAwsLC4OOnj6DiKgYA+P5s6f/11eXMXx4/54BBJSUVRl6Jk1jYJGUkmbw9Q9m0NDSZrh88QLDimWLGM6fPcPAIi4hyZCSkc0ANJHh+7dvDOzs7Azc3FwMTGD9QPDxwweG7Vs3MSgpqTCoqWsygFT+//379/+ywpz/gd6u/48fPfz/379//8E6QJYfPXyQQVRMDOy69+/fQYwSExNnsLCyYeDl5WO4cf0qw5fPnxnA/vj48QPDr5+/QGoYGBkZGASFhBkAIEtWxj/l6uAAAAAASUVORK5CYII=");
    var num_3 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADqSURBVBhXHc5PKwRhAIDx533HmHFD2Tks4US0LGslB0p74iDa2nJTDq4uLlwcfA1Fbe1NbPa6yRfwZxMX3FBmzWbG1Px7TZ4v8HtEHMeq4zi47g+6rjOQsdA0DdF6uFPV0xPato1hmswvLFKubCFNs4fevn6WV0o4zje16hmt+1tQaVEUKd/31fHRoVorLamb66aSqcHV5TmVjVUa9Qvys3PMFIpIIQSTuWm2d3bJTeV5e33h1/OQQRDw+fFOdnCIbsOgkzqe59LVtr842N8jSRKEkKxvlhkeGUWEYaienx7/dzOWxdj4BAB/T2le1db1DyMAAAAASUVORK5CYII=");
    var num_4 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAC6SURBVBhXY/wPBAxQ8O7dW4Z/f/8yiIiKMTBBxRhev3rFMGVCD8P0KRMYQGpZQIK/f/9mWL92JcPe3TsZhIVFwBJgHRfPn2XYtX0rAxMjI4gLBkwf3r9nWLd6BYOOrj6DopIyVBgosW/vLoazZ04x8PHzM/z48YPhx/fvDBfOnWFgNjHUbbh7+xbDkyePGV6/fsXwEyjJzMTMALIIDorzMv+HB3r///v3738Ufzx6+IDh169fDCqqagwAt5dfBK7iYtEAAAAASUVORK5CYII=");
    var num_5 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAARml2dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADcSURBVBhXY/z79+//Vy9fMPz7948BBJiYmBiERUQZGN+9ffu/ub6K4dfPn2AJbl5ehozsfAaWX79+Mly8cI7B1c2TQV1Tm4GDg4OBmYWZgQWkipmZmcHAyITB0cWNgYWFheHNm9cMjC9fvPifEh/JwMbGCsTsDG4e3gxhkTEMjN++fft/7MghsPmHDuxlOH3yOENzey8DE0irtLQMg5iYOMP///8ZGIDoJ9Belq9fvjBM7O1kuHb1MgMjIxODs5s7g4WlNQPYHw/v32N4+vQJg4CAIIO2rh5QASMDAKPUS95n8aj7AAAAAElFTkSuQmCC");
    var num_6 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAYAAACXDi8zAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADaSURBVBhXY/wPBAxA8OXLFwYWFhYGDg4OEJeBCUQ8f/aUYVJfJ8OuHVsZ/v37B5EAqeztbGU4evggg6ioGAMjIyNYgmHd6pX/naxN/q9ctvj/169f/v/9+xdk+n9mNRWFhts3bzA8ffKYYc3KZQxMTEwMauoaDExfv3xlEBEVZSgoKWfQNzBi2LV9K8PXr18ZmHh5eRl+/fzFwMzCyvD37x+EHSePH/3v4+bw387c4L+rnfl/oHH/f//+/R/sj2dPnzDcu3uHQVJKmkFBUYmBmZmZAe5BVMDAAAAkLWEdNbvjbAAAAABJRU5ErkJggg==");
    var num_7 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAYAAAAx8TU7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACZSURBVBhXY7xw7sz/9+/fM4AAIyMjg5KyCgNjRlLs/2tXL4MFQSAmPpmB8fatm/8/f/rE8Pz5U4bezlaGlPRsBiYVVTUGQ2MTBpAEHy8fg5q6BgMTSMv///8Ztmxcx6CgpMygoKgEEbxy6SLDo0cPGTS1dRiEhEUggls3b2Dg5uJmMLewArsALCghKcVg7+TCoKGlA+QxMAAA77ks9RUMMREAAAAASUVORK5CYII=");
    var num_8 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAYAAAD6reaeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADDSURBVBhXY/wPBB8+vGf4/OkTAxc3N4OgoBAD4/mzp/9vWLua4fnzp0ABYQZvX38GZjEhvobLly4yZOcVMdy8fo3h2NFDDEwfP35k4OLiZtDQ1GYQl5BgePfmDQOTtq4ew+NHDxgSokMYNq5bw2Bta8/A7GBr3fDz10+GxJQMBkZGBoavX78wML16+YKBEQgVlZUZuHl4GZ4+eczAuG71yv8zp05k+P79GwMLKytDbHwyA9idD+7fA6sQFRNjUFRUZgAAvOxK5k7kXdsAAAAASUVORK5CYII=");
    var num_9 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFqSURBVChTJZBLS+MAFIW/JG0a02K0atp0MmJBKj4QqxtduJIBXShuBnRk/os/ZBh14ca3WBGfXYm6cOcDLc6iSIsiddJRxmoekzB3cQ+H+93L5Qifdc1zXQ9FjdKe6URPJHh6fKBwc83rywuC2aJ5umHydWqakZEvRGMxqpbFzs42iwtziOFwhN6+LN9mvuO4DvmjI+rUOsYnJhkcGkYMTGtbGlmWOTw4YP7nD/L5PEYySVdPN6Lj2LzXaiiKQir1ibZ0mpSRQgqF8IBQ7e2N66tLisUio2Nj9GWzmKZJtWpRLpeQ6qOR2edKhdtCAct/Lt4UJ5Pp4PLigtXlJUT/CrW/r5yfHXN2ekIkolAuldjf2/X1/j8QlKY1ku0fwDCS5HJb5DbX/Rz+IGkxZTYAbNvh48Ph7tcdG2srPJaDbRehNdHgCQHhNykko6oq1u+KbwVsP2HRdtxgQkNcJ96sIwgSnhfGwdd6mX/SG4I/DdtcMwAAAABJRU5ErkJggg==");

    numbers = [num_0, num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9];
    results = []
    for (var i in numbers) {
        // numbers[i] = bgrToGray(numbers[i], 40)
        var foundResults = findImages(croppedImage, numbers[i], 0.9, 10, true);
        for (var j in foundResults) {
            foundResults[j]['target'] = i;
            results.push(foundResults[j]);
        }
    }
    results.sort(compare);
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
    var croppedImage = cropImage(img, 353, 10, 30, 18);
    // var croppedImage = cropImage(img, 430, 311, 23, 15);
    releaseImage(img);

    var num_0 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFWSURBVChTJY9LSwJhFIaf7xtn8E5ldPHSZWJqYSiuwoWZG2kr1Lb+Sr8h+hVGUJDRvla6F7IC06BamIGGE+Z8jdPZvHDOwznPEaa5onTdYH3dZGlpmff3N1pPz3xPHIQSiGx2W5XL+xwcHBKJROj1etRq11xcnOP3B5BrayZHR8fesNFoeFmpVMhkstj2DzKdThOLxbi9veHs7JSrq0tMc4Odnfw/EI8nGA6HPD62+Ph4odV6wOfzkUqlEEIhDUNnMpkwHo/dhp/fXwellAdNS9ojm0AgQDQ664IQDAbRNI3BYIDjOMjua9cD8vk8hUKBUqlEv9+n2WwipYam6/rJ4uICu7tFcrkclmVRr9epVquupI3Y2tpUyWSSYnGPRCJBp9Ph/v6OdrvtbpAIy1pVrop7JkQoFGbkOk2/EsJzRMTno0o3DGZm5pjmz2hE//ML5b7ohCV/hoh86Nn+fc4AAAAASUVORK5CYII=");
    var num_1 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAALCAIAAADN+VtyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADcSURBVChTYxSWV/kPBH9+83BzqioqsbGz3X/85NWbt8xcAkKc7GxGejrpSQnREeGGBvof3r9/9vwFCwMDAy8Pj6OdbaC/Pzs7++fPX8RFRX79+A7S8ffPny+fPjx58uTb128ysjKnTp0+dfY8EwMD468//y7fvLtt195Hjx8DDQCCf/8ZgBIMQLt///337cd3IAMiAQQgCawAKsEIRth0MDJwMP4DS4EkmZiYgK4SBokzMrAz/Pzx4/vzF6+Pnzr14tUboM9VgRKsjP95Wb+zsLBxcXG/+vT728+/AO3lY2xhN8CLAAAAAElFTkSuQmCC");
    var num_2 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFPSURBVChTXU9NSwJRFD3zJhwwRakJKvwcW7s2d7nJRRTpPwiiIHJT7f0ruSvaFRi0CL82WdAqjUgrZxGaMzrqouc4r+e4637B5Z57z7mCP7LKQgEFoUAQY3OMRvMdH60miChAEHienp2w1G4KHo8XlmVxQAOXVxe4u7+FKBIQSZIwHI1QLBagqioSGwlsb+1gcWEJjLuoD7RstfqAUqWAnt5HfD0OSikqlRL0vgbS0b/x9llHt/cD0zQxvWgYBrqaZmsghBc2sRAORJBOpTEcDlAuF2EMdAiEAyw+DPoU7O8dIBqNIp/P4+b22uafGgn5FRwdZpDcTKLd7uClXoPL5Qa/bwPEWCyWzRxnIMsyHJIDSlixX356fsRkYmKupX4hlzuH0zlvbzDGUH+tgf5Suxd8a8vM6/ZyteKMlwOoSbnIPp/yWFFkNmWbSfpvwB9Xioq5P5vdVAAAAABJRU5ErkJggg==");
    var num_3 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAYAAACzkJeoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAEpSURBVChTHc3LSgIBAIXhfy6YOtNM0BiaJU7QBcygV0iKVu2LIFr0Di5a9Datol3RKjeZlyTdhIpCmoGakKKOik02tD4/3xECaxszMxRkNbiCIAjU6h9U32vYM5CPDg84PTlmQdf+x1a7zd39A9c3t8iDfp9ms0kqnSIYWCYW20OSJHKveeSndJZipUr3u8vuToRodBtVUVFVBXnyC4axyMX5GeFQCK+i8JR8pliuIIui4HB+9h3O5/MxnU7pO1fdXg/JrepXna82mWyWcqlE2DQRRZHMSw5Rc2wzbDIYWAyGFi6XC13T0L0u5MjWOpfxOLb9g67rKF4PhUKeequD3Gh88phIsGQYjMYjSsU30ukk1miC4Dc3Z9q8F4/bzRwWw2GfsRP1bJU/dnVv2uvBhwgAAAAASUVORK5CYII=");
    var num_4 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAE2SURBVChTRZDBSgJhFIW//4/UGSREDSUUZRwHHRAyEMuNgaZtbGM+gCufwiB8Hd/A3sKNK3OVu8qERHBm+mcUupu7uN8953CEaeY9TuO6LpqmYxgm2+0Pq9U78nTD87zg2G53GY9f6PWecBznHwCBZZUYDofUajVyubxS5Aj40qlUmsFgQKlU4nA4BC/RaPQI6LpOs3lPtXrDfD5ns9kEgK5rSCGE+rLp959ZLpdMp1P2+30A+LYymUzQ6TxSKBRUSA3btgNp0zRpNO6QkYhOOp1CSqlCWrRarcDSMAzq9VtEuWx5mUyWRCKpJF0qlWtGoxGLxYLJ5BVRLGZVUeJoqXY8fknnoct6/cHsbeYDmVOTPqRCyTO0cBjn4PCrwoqr5IV3HgoRi8Xx93634+vzG094uFHJH6FRV99qDYEAAAAAAElFTkSuQmCC");
    var num_5 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAIAAAA88gD/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD1SURBVBhXFY6xToNAAIbvjgMqhI2kMF0LgdrGKmt9Cd6gPoUx8XGYTHS0dmG2Uw2pIobUUdOhRxC9QTg9z3/8kv/LB0+OgnA0wVgFEMg1Tf26LTHxDs8vLnu9A4kkz5+fbq6vsGVZ4/GkLMvF4hZCsHt/o5RiIQTnvCiKJElUVRGi/e06ZTo9juPYNE3Hcft9h9K6/qgU3x9GUSQfhJDZ7NQwjDx/URAC6/VDmqZS4nn+YEA2m0ckBGDsq22/Of/Rdf2/DgDsuu58fhaGI6m2bXu5vNvK3qraZ1kmH5x3sm+1umeMwSAYQgg1TcMYfTYUIQgE+AM9AWnbTdYDFAAAAABJRU5ErkJggg==");
    var num_6 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAIAAAA88gD/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD9SURBVBhXAfIADf8AHhcSHRYRIRwZMy8tLCYjISEcGxkUABwVESUfHGNiYLe3toOCgCIiIBoWEQAgGhVUUVDNzc3T09NkZGIfHxwkIR0AOzYypaWk3NvbeXl4JSUjHR0ZKCciAFpYV+jo6O3t7cHBwJ2dnWFdXCEfHQB2dXX+/v7l5eXBwcHd3d28vLtMSkoAgX9/8vLyoqKiR0dHlZWU5OTkfXx8AG9tbPPz86urqk5NS52dneLi4n18fABHQkDCwcHo6OjMzMzh4eG7urpCQD8AHhsXSkhHiYmJnZ2cgoKBRkVDGhcUABgUDxsYEygnIzEuLCYlIRoVERkUDxB5ZLOxkgZyAAAAAElFTkSuQmCC");
    var num_7 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAcAAAALCAIAAAA88gD/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD0SURBVBhXJY7NSsNAFEbnzsSAFSuJbWcTBAOFug44VotrEeKzuREfxIUKfYG0tqMWa1PIZuqqnWDaSvo7iSOej7v4DvfChcsGc5yjXJPpQUksh4O+cXXt+/6N7v+0W8H93S2plA+Xq1UURVoxxpJp0mw+k2z70//ohYPPYvHglLFWEDw9PuD1Mp3PvgEj13XjWL6+cbVZYwWFLMeUOvXzCyFEt9smOwZWSu3u7ddqJ7Zth2H4JQQhBAMgy6qws7qUkvPOVm0A6wChlHqeNxoJzl8MA+tnSKlkpeliPJ5o1Xvv4L9jBNXqMQCYpqm35rNYW5SjX2sPbXwEnO8NAAAAAElFTkSuQmCC");
    var num_8 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFbSURBVChTJZBfK4NhGMZ/z2NWW/Pauwmzqb2KKG2F+XsgRzgaBztWfAU+D0XWDsUH4EgOkJo/YRqhjW3MstmKx+N1391dJ1fdv+sSg72WEk2Kn+8flF4hBQ7ZhNSaq34g2r0e1dLqpX9gANPnJ5d7JnNzzVetCh4nYmxkSC0trxCLjeJ2uymXyxwc7LO9tcnr5wtyYnKKeHyBQqHAxvo6lUqFRCLB9MwMSilkVyiEy+Xi4jzN3u4O51r9/jZ6rB6E0Dx3mQyNRoPZuXnCYctmyedzpNNpG1g+3D9QKhYJBoNEolFbHx+fuLy64G9k2ArjaHaQSqVYW10lmUwS0m8jkei/wTRNvF7TjlXSoI16HcMw6OjotA2OW525WCwQX1i0owYCAbLZLKcnx+jeEH1WtxoeHSemz2g1eMnnOTo81JBnVOUXoqvNUM1Op37j40/rtRpvpXeU0PV7JL/UFYQPFcWm0AAAAABJRU5ErkJggg==");
    var num_9 = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAIAAAA/PgD0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFOSURBVChTY5QV4//37z8HF7eKmqaYuPibVy9v37z+9cuXZ28/sfz/zyAuJRsaEens7MrNw/Pp48ft27cuXTifgYGBiZWVXc/AMCo69u+/v/v37ePk4vT1C7CwtAXJATlyCopsbGx79+xZMG/O/v37JSUktHS0QXJ///759fMnBweHlJS0gqKilKQUMwvLf6AMAwPLzx8/rl+7+ujRIw9PTwNDQxkZmU+fPj5//gwox8zHzf7+3btbt29//PhRSFhITU396pUra1evik9IZALK//z+9ezJoydPHGdn53j+7NnuXTufP3sCFAfJAQE/v6ChkbGkpMSWLZu3bFz/9ctnoCALRA5ox4ljx96+fXNg3963r18wg7UwyokLMIJoBmYWNi4uro8f3jEyMP759//p649Mf/7+AwoLCIkJiYgxMjL//8/6l4H5Px8bAwMDAORuhTrbm+APAAAAAElFTkSuQmCC");

    numbers = [num_0, num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9];
    results = []
    for (var i in numbers) {
        // numbers[i] = bgrToGray(numbers[i], 40)
        var foundResults = findImages(croppedImage, numbers[i], 0.8, 10, true);
        for (var j in foundResults) {
            foundResults[j]['target'] = i;
            results.push(foundResults[j]);
        }
    }
    results.sort(compare);
    console.log('=> ', JSON.stringify(results));

    for (var i in numbers) {
        releaseImage(numbers[i]);
    }
    releaseImage(croppedImage);

    count = ocrResultToInt(results)
    return count;
}

function SwipeProductionMenuToBottom() {
    tapDown(430, 340, 40, 0);
    sleep(config.sleep);
    moveTo(430, 150, 40, 0);
    sleep(config.sleep);
    moveTo(430, -1000, 40, 0);
    sleep(config.sleep);
    tapUp(430, -1000, 40, 0);
    sleep(config.sleepAnimate * 3);
}

function SwipeProductionMenuToTop() {
    tapDown(430, 52, 40, 0);
    sleep(config.sleep);
    moveTo(430, 350, 40, 0);
    sleep(config.sleep);
    moveTo(430, 1000, 40, 0);
    sleep(config.sleep);
    tapUp(430, 1000, 40, 0);
    sleep(config.sleepAnimate * 3);
}

function handleMaterialProduction() {
    pageFirstItemEnabled = [
        { x: 569, y: 119, r: 121, g: 207, b: 12 },
    ]
    pageSecondItemEnabled = [
        { x: 571, y: 223, r: 121, g: 207, b: 12 },
    ]
    pageThirdItemEnabled = [
        { x: 568, y: 329, r: 121, g: 207, b: 14 },
    ]

    // TODO: tap second production
    if (checkIsPage(pageWoodFarm)) {
        console.log('wood farm, add more')
        qTap(pageWoodFarm, 800);
        sleep(config.sleepAnimate);
        return true;
    }
    else if (checkIsPage(pageBeanFarm)) {
        console.log('bean farm, add more')
        qTap(pageBeanFarm, 800)
        sleep(config.sleepAnimate);
        return true;
    }
    else if (checkIsPage(pageSugarFarm)) {
        console.log('sugar farm, add more')
        qTap(pageSugarFarm, 800)
        sleep(config.sleepAnimate);
        return true;
    }
    else if (checkIsPage(pagePowderFarm)) {
        console.log('Powder farm, add more')
        if (checkIsPage(pageSecondItemEnabled)) {
            qTap(pageSecondItemEnabled, 800);
            sleep(config.sleepAnimate);
        } else {
            qTap(pagePowderFarm, 800)
            sleep(config.sleepAnimate);
        }
        return true;
    }
    else if (checkIsPage(pageBarryFarm)) {
        console.log('Barry farm, add more')
        if (checkIsPage(pageSecondItemEnabled)) {
            qTap(pageSecondItemEnabled, 800);
            sleep(config.sleepAnimate);
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
        }
        else {
            qTap(pageBarryFarm, 800)
            sleep(config.sleepAnimate);
            qTap(pageBarryFarm)
            sleep(config.sleepAnimate);
            qTap(pageBarryFarm)
            sleep(config.sleepAnimate);
            qTap(pageBarryFarm)
        }
        return true;
    }
    else if (checkIsPage(pageMilkFarm)) {
        console.log('Milk farm, add more')
        qTap(pageMilkFarm, 800)
        sleep(config.sleepAnimate);
        qTap(pageMilkFarm)
        sleep(config.sleepAnimate);
        qTap(pageMilkFarm)
        sleep(config.sleepAnimate);
        qTap(pageMilkFarm)
        return true;
    }
    else if (checkIsPage(pageCottomFarm)) {
        console.log('Cottom farm, add more')
        qTap(pageCottomFarm, 800)
        sleep(config.sleepAnimate);
        qTap(pageCottomFarm)
        sleep(config.sleepAnimate);
        qTap(pageCottomFarm)
        sleep(config.sleepAnimate);
        qTap(pageCottomFarm)
        return true;
    }
}

function makeGoodsToTarget(target, orderAmount) {
    var itemsAdd = 0;
    pageFirstItemEnabled = [
        { x: 587, y: 122, r: 121, g: 207, b: 12 }
    ]
    pageSecondItemEnabled = [
        { x: 587, y: 230, r: 121, g: 207, b: 12 }
    ]
    pageThirdItemEnabled = [
        { x: 587, y: 332, r: 121, g: 207, b: 12 }
    ]

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

    // add < 10
    var goodsOneStock = ocrProductStorage(goodsLocation[1])
    var goodsTwoStock = ocrProductStorage(goodsLocation[2])
    var goodsThreeStock = ocrProductStorage(goodsLocation[3])
    console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock, 'target: ', target);
    console.log('type: ', typeof(goodsOneStock), typeof(target))
    if (goodsOneStock === -1 || goodsTwoStock === -1 || goodsThreeStock === -1) {
        console.log('OCR count failed, skip this round');
        return -1;
    }

    if (goodsOneStock < target) {
        console.log('add 1st item from ' + goodsOneStock + ' to > ', target);
        for (i = 0; i < orderAmount; i++) {
            qTap(pageFirstItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd++;
            }
        }
    }

    if (!checkIsPage(pageSecondItemEnabled)) {
        console.log('2nd item is not enabled')
        return itemsAdd;
    }
    else if (goodsTwoStock < target) {
        console.log('add 2nd item from ' + goodsTwoStock + ' to > ', target);
        for (i = 0; i < orderAmount; i++) {
            qTap(pageSecondItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd++;
            }
        }
    }

    if (!checkIsPage(pageThirdItemEnabled)) {
        console.log('3rd item is not enabled')
        return itemsAdd;
    }
    else if (goodsThreeStock < target) {
        console.log('add 3rd item from ' + goodsThreeStock + ' to > ', target);
        for (i = 0; i < orderAmount; i++) {
            qTap(pageThirdItemEnabled);
            sleep(config.sleepAnimate);
            if (!handleNotEnoughStock()) {
                itemsAdd++;
            }
        }
    }

    if (itemsAdd > 4) {
        return true;
    }

    // === tool shop only ===
    handleToolShopShovels();
    // end of tool shop ===

    SwipeProductionMenuToBottom();

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
    console.log('In stock: ', goodsFourStock, goodsFiveStock, goodsSixStock, ' target: ', target);
    if (goodsFourStock === -1 && goodsFiveStock === -1 && goodsSixStock === -1) {
        console.log('2nd OCR count failed, skip this round');
        SwipeProductionMenuToTop();
        return -1;
    }

    if (!checkIsPage(pageFirstItemEnabled)) {
        console.log('4th item is not enabled')
        SwipeProductionMenuToTop();
        return itemsAdd;
    } else {
        if (goodsFourStock < target) {
            console.log('add 4th item from ' + goodsFourStock + ' to > ', target);
            for (i = 0; i < orderAmount; i++) {
                qTap(pageFirstItemEnabled);
                sleep(config.sleepAnimate);
                if (!handleNotEnoughStock()) {
                    itemsAdd++;
                }
            }
        }
    }

    if (!checkIsPage(pageSecondItemEnabled)) {
        console.log('5th item is not enabled')
        SwipeProductionMenuToTop();
        return itemsAdd;
    } else {
        if (goodsFiveStock < target) {
            console.log('add 5th item from ' + goodsFiveStock + ' to > ', target);
            for (i = 0; i < orderAmount; i++) {
                qTap(pageSecondItemEnabled);
                sleep(config.sleepAnimate);
                if (!handleNotEnoughStock()) {
                    itemsAdd++;
                }
            }
        }
    }

    if (!checkIsPage(pageThirdItemEnabled)) {
        console.log('6th item is not enabled')
        SwipeProductionMenuToTop();
        return itemsAdd;
    } else {
        if (goodsSixStock < target) {
            console.log('add 6th item from ' + goodsSixStock + ' to > ', target);
            for (i = 0; i < orderAmount; i++) {
                qTap(pageThirdItemEnabled);
                sleep(config.sleepAnimate);
                if (!handleNotEnoughStock()) {
                    itemsAdd++;
                }
            }
        }
    }

    SwipeProductionMenuToTop();
    return itemsAdd;
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
        {x: 20, y: 294, r: 166, g: 104, b: 65},
        {x: 80, y: 300, r: 166, g: 104, b: 65}
    ]
    if (!checkIsPage(pageAnyProduction)) {
        return false;
    }

    var materialCount = ocrMaterialStorage();
    if (materialCount == -1) {
        console.log('This is not a material production');
    } else if (materialCount >= config.materialsTarget) {
        console.log('Skip as stock enough: ', materialCount);
        return true;
    } else {
        console.log('Material stock: ', materialCount, ', target: ', config.materialsTarget)
        handleMaterialProduction();
        return true;
    }

    // TODO: if no enough at first time, skip second check
    // TODO: count items produced
    // TODO: record not enough resources (keep list of all items)

    var itemsAdd = makeGoodsToTarget(10, 2);
    console.log('add: ', itemsAdd, ' items')
    if (itemsAdd == -1) {
        return false;
    } else if (itemsAdd < 3) {
        itemsAdd = makeGoodsToTarget(config.goodsTarget, 1);
        if (itemsAdd == -1) {
            return false;
        }
    }

    return true;
}

function handleNotEnoughStock() {
    pageNotEnoughStock = [
        { x: 428, y: 98, r: 56, g: 167, b: 231 },
        { x: 345, y: 104, r: 60, g: 70, b: 105 },
        { x: 370, y: 176, r: 243, g: 233, b: 223 },
        { x: 349, y: 247, r: 121, g: 207, b: 12 }
    ]
    if (checkIsPage(pageNotEnoughStock)) {
        console.log('quiting not enougth stock')
        qTap(pageNotEnoughStock);
        sleep(config.sleep);
        return true;
    }

    pageTwoItemNotEnoughStock = [
        { x: 444, y: 98, r: 56, g: 166, b: 231 },
        { x: 375, y: 105, r: 60, g: 70, b: 105 },
        { x: 420, y: 203, r: 243, g: 233, b: 223 },
        { x: 416, y: 246, r: 219, g: 207, b: 199 }
    ]
    if (checkIsPage(pageTwoItemNotEnoughStock)) {
        console.log('quiting not enougth stock 2')
        qTap(pageTwoItemNotEnoughStock);
        sleep(config.sleep);
        return true;
    }

    // pageNotEnoughRequiredItems = [
    //     {x: 354, y: 241, r: 121, g: 207, b: 12},
    //     {x: 297, y: 247, r: 121, g: 207, b: 12},
    //     {x: 233, y: 108, r: 60, g: 70, b: 105},
    //     {x: 426, y: 108, r: 60, g: 70, b: 105},
    //     {x: 430, y: 134, r: 243, g: 233, b: 223},
    //     {x: 419, y: 247, r: 219, g: 207, b: 199},
    //     {x: 252, y: 245, r: 219, g: 207, b: 199},
    //     {x: 212, y: 247, r: 219, g: 207, b: 199},
    // ]
    // if (checkIsPage(pageNotEnoughRequiredItems)) {
    //     console.log('quiting pageNotEnoughRequiredItems')
    //     qTap(pageNotEnoughRequiredItems);
    //     sleep(config.sleep);
    //     return true;
    // }

    return false;
}

function handleRelogin() {
    pageReloginOrNetworkError = [
        { x: 297, y: 241, r: 121, g: 207, b: 12 },
        { x: 429, y: 101, r: 60, g: 70, b: 105 },
        { x: 432, y: 137, r: 243, g: 233, b: 223 },
        { x: 427, y: 252, r: 219, g: 207, b: 199 },
        { x: 334, y: 242, r: 121, g: 207, b: 12 },
        { x: 306, y: 241, r: 121, g: 207, b: 12 },
        { x: 303, y: 241, r: 121, g: 207, b: 12 },
        { x: 212, y: 244, r: 219, g: 207, b: 199 }
    ]
    if (checkIsPage(pageReloginOrNetworkError)) {
        console.log('quiting pageReloginOrNetworkError')
        qTap(pageReloginOrNetworkError);
        for (var i = 0; i < config.sleepWhenDoubleLoginInMinutes; i++) {
            sleep(60 * 1000);
            sendEvent("running", "");
            console.log('Detect relogin, wait: ', i, '/', config.sleepWhenDoubleLoginInMinutes, 'mins to restart...');
        }
        return true;
    }
}

function handleWelcomePage() {
    pageWelcome = [
        {x: 25, y: 288, r: 225, g: 163, b: 42},
        {x: 41, y: 255, r: 243, g: 60, b: 56},
        {x: 131, y: 255, r: 253, g: 217, b: 52},
        {x: 177, y: 257, r: 181, g: 48, b: 60},
        {x: 204, y: 282, r: 225, g: 163, b: 40},
        {x: 67, y: 324, r: 103, g: 19, b: 36},
        {x: 160, y: 326, r: 104, g: 21, b: 38}
    ]

    // TODO: Need to handle login event

    pageAnnouncement = [
        {x: 610, y: 19, r: 56, g: 167, b: 231},
        {x: 619, y: 19, r: 255, g: 255, b: 255},
        {x: 628, y: 18, r: 56, g: 167, b: 231},
        {x: 59, y: 219, r: 54, g: 64, b: 87},
        {x: 71, y: 317, r: 54, g: 64, b: 87},
        {x: 19, y: 114, r: 63, g: 0, b: 9},
        {x: 25, y: 321, r: 75, g: 75, b: 75}
    ]
    pageProductionList = [
        {x: 315, y: 12, r: 204, g: 8, b: 40},
        {x: 420, y: 9, r: 240, g: 172, b: 2},
        {x: 526, y: 11, r: 0, g: 193, b: 255},
        {x: 71, y: 303, r: 158, g: 125, b: 97},
        {x: 133, y: 338, r: 154, g: 96, b: 69},
        {x: 497, y: 302, r: 158, g: 126, b: 97},
        {x: 627, y: 302, r: 160, g: 129, b: 101}
        
    ]

    if (checkIsPage(pageWelcome)) {
        console.log('In welcome page, entering game');
        qTap(pnt(324, 329));
        sleep(config.sleepAnimate);

        while (true) {
            if (checkIsPage(pageAnnouncement)) {
                qTap(pageAnnouncement);
                sleep(config.sleepAnimate);
                break;
            } else if (checkIsPage(pageProductionList)) {
                keycode('BACK', 1000);                
                // break;
            }
            qTap(pnt(50, 329));
            sleep(3000);
            console.log('tap and wait for announce page');
        }
        handleFindAndTapCandyHouse();
    } else {
        console.log('Confirmed not in welcome page');
    }
}

function handleAnnouncement() {
    pageAnnouncement = [
        {x: 610, y: 19, r: 56, g: 167, b: 231},
        {x: 619, y: 19, r: 255, g: 255, b: 255},
        {x: 628, y: 18, r: 56, g: 167, b: 231},
        {x: 59, y: 219, r: 54, g: 64, b: 87},
        {x: 71, y: 317, r: 54, g: 64, b: 87},
        {x: 19, y: 114, r: 63, g: 0, b: 9},
        {x: 25, y: 321, r: 75, g: 75, b: 75}
    ]

    if (checkIsPage(pageAnnouncement)) {
        console.log('found announcement page, leaving')
        qTap(pageAnnouncement);
        sleep(config.sleepAnimate);
        return true;
    }
    return false;
}

function findAndTapCandy() {
    var candy = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAAA3NCSVQICAjb4U/gAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOrSURBVDhPTZRraBxVFMd/985zs5vsZkmwicWkFg0IYg3Y0oIlUqlaECpIiRAsFBGLqC2IH9riF+kHFUREUvBRRbGgUazoF0WUttjWtJWQmkLSGE1rXibR5rGzO8/r2VDQO5y7OzP3nPN/3Dtq+rd3jNJgiIijkNnREXaefZieI/eSSx1++nAQryHBy0NbweNwz0Ze/mGIj28dIdfgY0myZzu4roOaHOs3jq1ROmH0lyEev/ggD7x4Hx8V23mqukCrSrhH3vW66xmL/sCxMhoci+fODDHQMSF5Nq7vQEsz2lIRaVxhamIcWxaGxqIvlyNTjqBNUHJZlseYnqfk5yg7Ho24a0W8go9bFsgtTUyPXEOZ6KQhS4jCgKPnS3zX0k5X93psoEHmLnI8Kv+kt5RYkgiwSPHxOIGAoMoXX53l9HZpYMyogRtsOxmzeXe34IgFkYhIJghseqTQDrn7b9Ru/vpr82DtopSEpwcuoKKlz8xDX97Gvr1bpCM8ITEiMS8xI7FHov78/+OKrFisVeuuEUuE8mz/J+extVZcHZ/j08VxcsrCdhv5JqvIAqFi2czky+ynIGQNX8fzBOkkRmSxjbinWOOQSsFcAiqtfG60r9h4OOX+F7bgyYKdfpGBdFGIZtLNpmRpCpLVaJalyCqJbAc3s/G1FrIJR/ovMP9SG1rMk2FhlE9z1aVQczm1HNAcujQl4qigmI4jfo+rLBifVLeSqmZmxZJrGcxK0WRZoInatjKK3nc1ux7bRC4SmkLHFuqdeUmU6x+TMMiqIHB5vXGDzPVEOLB8ldUsJNMpTp1O3bY0VQxNKjqKHsVMkU+1hEMuVpRSm5ZYaEYuWt69GSyuFeqPF+Qe7qzdTWdlE08+0833l+akWBCIcJq95VZ6y83sLhXZkRe5QxEpEq1Ch7JQt0PDZG2FQ0vTTFUCkiTlL8aZcId56+Bl7mhKUX9eedus6+hk8yuaIALHGIbf2MXQ9RqnbtRIBEIgseKFLLsxsZOI8KkYkXL82V/Fzoi5fpdEmOhMBPx7aZUfDwZcOhTQtU4zIxus3fO53RZ3BLUnUmzzm9lT6MSrOWTimmU08+/ZzB3zqEuVmkzOpnaYOvczcRITpgnH9wU88tq3a/unu+SzwRJxpeuxE8NcD5bpy7cRy8b64MBlOYXmZiFFlGWoM+/3mUb5aliFMrds3YrvuGw/mscSh9xKRY5KA0U/4vSrAXc938BKNaOWJELNYrUSkWW67iNhEvIvXjKLGJ5QEOoAAAAASUVORK5CYII=");
    var img = getScreenshot();

    var foundResults = findImages(img, candy, 0.92, 5, true);
    releaseImage(img);
    releaseImage(candy);

    console.log('candies > ', JSON.stringify(foundResults));
    if (foundResults.length > 0) {
        var bestFit = foundResults[0];
        for (var j in foundResults) {
            if (foundResults[j]['score'] > bestFit['score']) {
                bestFit = foundResults[j];
            }
        }
        console.log('best candy > ', JSON.stringify(bestFit));
        qTap(bestFit);
        sleep(config.sleepAnimate * 3);
        return true;
    }
    return false;
}

var Directions = Object.freeze({
    NE: pnt(-480, 245),
    NW: pnt(460, 255),
    SE: pnt(-460, -255),
    SW: pnt(480, -245)
})
function swipeDirection(direction) {
    tapableArea = {
        fromPnt: pnt(75, 95),
        endPnt: pnt(550, 285)
    }

    for (var i = 0; i < 10; i ++) {
        var x = tapableArea.fromPnt.x + Math.random() * (tapableArea.endPnt.x - tapableArea.fromPnt.x);
        var y = tapableArea.fromPnt.y + Math.random() * (tapableArea.endPnt.y - tapableArea.fromPnt.y);
    
        fromPnt = pnt(x, y);
        toPnt = pnt(x + direction.x, y + direction.y);
        if (swipeFromToPoint(fromPnt, toPnt)) {
            console.log('swip successfully')
            return true;
        }
        else {
            console.log('pickup house, try again')
        }
    }
    return false;
}

function swipeBackToCenter() {
    for (var i = 0; i < 10; i ++){
        if (swipeFromToPoint(pnt(66, 100), pnt(1500, 1000))) {
            break;
        }
    }
    swipeDirection(Directions.SE)
    sleep(1000)
    swipeDirection(Directions.SE)
    sleep(1000)
    swipeDirection(Directions.SE)
    sleep(1000)
}

function swipeFromToPoint(fromPnt, toPnt, steps) {

    tap(fromPnt.x, fromPnt.y, 100);
    sleep(config.sleepAnimate * 3);
    if (!checkIsPage(pageInKingdomVillage)) {
        console.log('swipe failed, try again')
        keycode('BACK', 100);
        return false;
    }

    steps = steps == undefined? 4: steps
    step_x = (toPnt.x - fromPnt.x) / steps;
    step_y = (toPnt.y - fromPnt.y) / steps;

    tapDown(fromPnt.x, fromPnt.y, 40, 0);
    sleep(250);

    for (var i = 0; i < steps; i ++) {
        moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0);
        // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
        sleep(80);
    }

    moveTo(toPnt.x, toPnt.y, 40, 0);
    sleep(800);
    tapUp(toPnt.x, toPnt.y, 40, 0);
    sleep(config.sleepAnimate);

    if (!checkIsPage(pageInKingdomVillage)) {
        keycode('BACK', 100);
    }
    return true;
}

function handleGotoKingdomPage() {
    console.log('trying to get to kingdom page')

    if (checkIsPage(pageInKingdomVillage)) {
        console.log('already in kingdom')
        return true;
    }

    if (checkIsPage(pageInProduction)) {
        console.log('In production, hit back to kingdom page')
        keycode('BACK', 1000);
        return true;
    }

    return handleTryHitBackToKingdom();
}

function findHouseInSpecificLocation(tryCount) {
    handleGotoKingdomPage();
    tryCount = tryCount == undefined ? 3 : tryCount;

    for (var i = 0; i < tryCount; i ++) {
        tapRandom(75, 95, 553, 285);
        sleep(config.sleepAnimate);
         if (checkIsPage(pageInProduction)) {
             console.log('found production in try: ', i)
            return true;
        }
        console.log('try another random point for production');
        handleGotoKingdomPage();
    }
    return false;
}

function handleFindAndTapCandyHouseV2() {
    var directions = [Directions.NE, Directions.SE, Directions.SW, Directions.SW, Directions.NE, Directions.NW]

    if (checkIsPage(pageInProduction)) {
        keycode('BACK', 1000);
        sleep(config.sleepAnimate * 2);
    }

    findAndTapCandy();

    if (findHouseInSpecificLocation(config.findProductionTimes)){
        console.log('find house v2 success, start working')
        return true;
    }

    swipeBackToCenter();
    for (var i = 0; i < directions.length; i ++) {
        if (swipeDirection(directions[i])) {

            findAndTapCandy();

            if (findHouseInSpecificLocation(3)){
                console.log('find house v2 success, start working')
                return true;
            }
        }
    }
    return false;
}

function handleFindAndTapCandyHouse() {
    if (config.findCookieHouseV2) {
        handleFindAndTapCandyHouseV2();
        return;
    }

    if (checkIsPage(pageInProduction)) {
        qTap(pageInProduction);
        sleep(config.sleepAnimate * 2);
    }

    // Tap the candy
    findAndTapCandy();

    // Tap the sugar house
    var sugarHouse = getImageFromBase64("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");
    img = getScreenshot();

    var foundResults = findImages(img, sugarHouse, 0.88, 3, true);
    releaseImage(img);
    releaseImage(sugarHouse);

    console.log('houses > ', JSON.stringify(foundResults));
    if (foundResults.length > 0) {
        var bestFit = foundResults[0];
        for (var j in foundResults) {
            if (foundResults[j]['score'] > bestFit['score']) {
                bestFit = foundResults[j];
            }
        }
        console.log('best house >> ', JSON.stringify(bestFit));
        qTap(bestFit);
        sleep(config.sleepAnimate * 2);
        qTap(bestFit); // prevent when there are sugar cube to collect
        sleep(config.sleepAnimate * 3);
        return true;
    }

    return false;
}

function handleInputLoginInfo() {
    if (handleAnnouncement()) {
        console.log('Found announcement page, handleInputLoginInfo success');
        return true;
    }
    else if (checkIsPage(pageInKingdomVillage)) {
        console.log('Found pageInKingdomVillage, handleInputLoginInfo success');
        return true;
    }
    else if (checkIsPage(pageInProduction)) {
        console.log('Found in production, no need to relogin')
        return true;
    }

    var isInputAge = false;
    pageInputAge = [
        {x: 243, y: 276, r: 254, g: 94, b: 0},
        {x: 401, y: 274, r: 254, g: 94, b: 0},
        {x: 416, y: 248, r: 255, g: 255, b: 255},
        {x: 403, y: 101, r: 255, g: 255, b: 255},
        {x: 404, y: 66, r: 60, g: 60, b: 60},
        {x: 408, y: 210, r: 254, g: 94, b: 0},
        {x: 232, y: 216, r: 254, g: 94, b: 0}
    ]
    if (checkIsPage(pageInputAge)){
        console.log('start input age');
        qTap(pnt(285 + Math.random() * 35, 213));
        sleep(config.sleep);
        qTap(pageInputAge);
        sleep(config.sleep);
        qTap(pnt(450, 222));
        sleep(config.sleepAnimate * 2);
    }

    pageTermsOfServices = [
        {x: 447, y: 233, r: 66, g: 66, b: 66},
        {x: 329, y: 126, r: 66, g: 66, b: 66},
        {x: 452, y: 126, r: 66, g: 66, b: 66},
        {x: 458, y: 216, r: 66, g: 66, b: 66},
        {x: 286, y: 216, r: 66, g: 66, b: 66},
        {x: 179, y: 126, r: 66, g: 66, b: 66},
    ]
    if (checkIsPage(pageTermsOfServices)) {
        console.log('accept term of service');
        qTap(pageTermsOfServices);
        sleep(config.sleepAnimate * 2);
    }

    pageCannotFindLoginInfo = [
        {x: 44, y: 255, r: 119, g: 30, b: 27},
        {x: 65, y: 323, r: 49, g: 10, b: 17},
        {x: 22, y: 289, r: 112, g: 81, b: 19},
        {x: 315, y: 242, r: 88, g: 149, b: 8},
        {x: 299, y: 247, r: 121, g: 205, b: 12},
        {x: 248, y: 245, r: 217, g: 205, b: 195},
        {x: 259, y: 108, r: 60, g: 70, b: 104},
        {x: 231, y: 163, r: 81, g: 81, b: 80},
        {x: 373, y: 177, r: 80, g: 80, b: 80},
        {x: 337, y: 178, r: 80, g: 80, b: 80},
        {x: 241, y: 178, r: 80, g: 80, b: 80},
        {x: 222, y: 182, r: 241, g: 231, b: 219}
    ]
    if (checkIsPage(pageCannotFindLoginInfo)) {
        console.log("quit can't find login info page")
        keycode('BACK', 1000);
        sleep(config.sleepAnimate);
    }

    pageCanDownloadResources = [
        {x: 346, y: 240, r: 121, g: 207, b: 12},
        {x: 420, y: 237, r: 219, g: 207, b: 199},
        {x: 418, y: 172, r: 243, g: 233, b: 223},
        {x: 412, y: 103, r: 60, g: 70, b: 105},
        {x: 219, y: 98, r: 60, g: 70, b: 105},
        {x: 221, y: 250, r: 219, g: 207, b: 199}
    ]
    if (checkIsPage(pageCanDownloadResources)){
        console.log('start download resources, wait 10 secs');
        qTap(pageCanDownloadResources);
        sleep(10000);

        for (var i = 0; i < 18; i ++) {
            // wait for yellow bar (download progress bar) disapper
            if (!checkIsPage([{x: 16, y: 349, r: 255, g: 210, b: 76}])){
                console.log('download finished');
                break;
            }
            console.log('wait for download: ', i);
            sleep(3000);
        }
    }

    var findLoginTime = isInputAge ? 20 : 6;
    var isChooseLogin = false
    pageChooseLoginMethod = [
        {x: 307, y: 239, r: 255, g: 95, b: 0},
        {x: 272, y: 78, r: 255, g: 95, b: 0},
        {x: 360, y: 78, r: 255, g: 255, b: 255},
        {x: 301, y: 125, r: 66, g: 133, b: 244},
        {x: 318, y: 119, r: 255, g: 255, b: 255},
        {x: 283, y: 167, r: 0, g: 1, b: 0},
        {x: 308, y: 169, r: 255, g: 255, b: 255},
        {x: 392, y: 203, r: 255, g: 255, b: 255},
    ]
    for (var i = 0; i < findLoginTime; i ++) {
        if (checkIsPage(pageChooseLoginMethod)) {
            console.log('choose to login via email');
            isChooseLogin = true;
            qTap(pageChooseLoginMethod);
            sleep(config.sleepAnimate);
            break;
        } else {
            console.log('waiting for pageChooseLoginMethod: ', i);
            sleep(3000);
        }
    }

    if (!isChooseLogin) {
        pageKingdomLogo = [
            {x: 22, y: 276, r: 225, g: 163, b: 40},
            {x: 24, y: 296, r: 225, g: 163, b: 40},
            {x: 32, y: 286, r: 229, g: 167, b: 44},
            {x: 65, y: 325, r: 101, g: 22, b: 36},
            {x: 107, y: 327, r: 239, g: 223, b: 122},
            {x: 162, y: 327, r: 94, g: 21, b: 33},
            {x: 178, y: 291, r: 233, g: 177, b: 52},
            {x: 189, y: 295, r: 56, g: 30, b: 20},
            {x: 182, y: 252, r: 237, g: 60, b: 56},
            {x: 110, y: 240, r: 223, g: 66, b: 42},
            {x: 59, y: 252, r: 255, g: 217, b: 52},
            {x: 66, y: 251, r: 56, g: 30, b: 20}
        ]
        console.log('did not see email input, but found kingdom log, tapping logo');
        qTap(pageKingdomLogo);
        return true;
    }

    var inputEmail = false;
    pageEnterEmail = [
        {x: 375, y: 152, r: 255, g: 255, b: 255},
        {x: 372, y: 59, r: 60, g: 60, b: 60},
        {x: 297, y: 52, r: 60, g: 60, b: 60},
        {x: 279, y: 53, r: 60, g: 60, b: 60},
        {x: 312, y: 192, r: 200, g: 200, b: 200},
        {x: 297, y: 152, r: 255, g: 255, b: 255}
    ]
    for (var i = 0; i < 10; i ++) {
        if (checkIsPage(pageEnterEmail)){
            console.log('inputing user email ', config.account)
            inputEmail = true;
            qTap(pageEnterEmail);
            typing(config.account, 100);
            sleep(config.sleepAnimate);
            qTap(pnt(370, 190));
            qTap(pnt(370, 190));
            sleep(config.sleepAnimate);
            break;
        } else {
            console.log('cannot find input email field');
            sleep(3000);
        }    
    }

    if (inputEmail) {
        pageEnterpassword = [
            {x: 374, y: 150, r: 255, g: 255, b: 255},
            {x: 381, y: 56, r: 60, g: 60, b: 60},
            {x: 266, y: 50, r: 60, g: 60, b: 60},
            {x: 401, y: 120, r: 255, g: 255, b: 255},
            {x: 393, y: 188, r: 200, g: 200, b: 200},
            {x: 358, y: 307, r: 255, g: 255, b: 255}
        ]
        for (var i = 0; i < 2; i ++) {
            if (checkIsPage(pageEnterpassword)){
                qTap(pageEnterpassword);
                typing(config.password, 100);
                sleep(config.sleep);
                qTap(pageEnterpassword);
                sleep(config.sleep);

                if (!checkIsPage(
                    [{x: 376, y: 186, r: 254, g: 94, b: 0}])
                ) {
                    sendEvent("gameStatus", "login-failed")
                    console.log('wrong password length')
                    return false;
                }
                qTap(pnt(370, 190));
                sleep(config.sleepAnimate);
                sendEvent("gameStatus", "login-success")
    
                // Touch here to start:
                qTap(pnt(370, 190));
                return true;
            } else {
                console.log('waiting for input password field');
                sleep(10000);
            }
        }
    }

    sendEvent("gameStatus", "login-failed")
    console.log('cannot find input email field');
    return false;
}

function handleNextProductionBuilding() {
    if (checkIsPage(pageInProduction)) {
        qTap(pnt(349, 174)); // next
        sleep(config.sleepAnimate * 2);
    }
}

function handleTryHitBackToKingdom() {
    console.log('trying to resolve stuch by hitting back')
    pageNotifyQuit = [
        {x: 299, y: 249, r: 12, g: 165, b: 219},
        {x: 258, y: 249, r: 19, g: 21, b: 22},
        {x: 215, y: 255, r: 217, g: 205, b: 195},
        {x: 344, y: 256, r: 121, g: 205, b: 12},
        {x: 354, y: 249, r: 155, g: 155, b: 155},
        {x: 277, y: 140, r: 88, g: 86, b: 82},
        {x: 285, y: 142, r: 217, g: 209, b: 199},
        {x: 258, y: 98, r: 60, g: 70, b: 104},
        {x: 358, y: 140, r: 46, g: 46, b: 46}
    ]

    for (var i = 0; i < 4; i ++) {
        if (checkIsPage(pageNotifyQuit)) {
            console.log('Found quit notification, should be in kingdom');
            keycode('BACK', 1000);
            sleep(config.sleepAnimate);
            return true;
        }
        keycode('BACK', 1000);
        sleep(config.sleepAnimate * 2);
    }
    return false;
}

function stop() {}

function start(inputConfig) {
    console.log('inputConfig: ', inputConfig)

    inputConfig = JSON.parse(inputConfig);
    console.log('start with: ', inputConfig.materialsTarget, inputConfig.goodsTarget);
    config = mergeObject(config, inputConfig)
    // TODO: inputConfig.goodsTarget seems to be string

    if (config.isXR) {
        while(!handleInputLoginInfo()) {
            console.log('XR: trying to login');
        }
        handleFindAndTapCandyHouse();
        // for (var j = 0; j < 20; j ++){
        //     if (handleWelcomePage()) {
        //         handleFindAndTapCandyHouse();
        //         config.jobFailedCount = 0;
        //         break;
        //     }
        //     sleep(3000);
        //     console.log('waiting for annoucement page...')
        // }
    }

    if (config.isCollectCandy) {
        console.log('try collect candy')
        handleFindAndTapCandyHouse();
    }

    for (var i = 1; i < 100000000; i++) {
        console.log("start loop", i);

        var act = JobScheduling();
        sleep(config.sleep);
        handleNotEnoughStock();
        sleep(config.sleep);
        handleNextProductionBuilding();
        console.log('performed  act: ', act)

        if (config.isCollectCandy && i % config.worksBeforeCollectCandy == 0) {
            handleFindAndTapCandyHouse();
        }

        if (config.run == false) {
            console.log('jobs done!')
            break;
        }

        if (!act) {
            config.jobFailedCount ++;
            if (config.jobFailedCount < config.jobFailedBeforeGetCandy) {
                console.log(config.jobFailedCount + '/' + config.jobFailedBeforeGetCandy + ' jobFail, continue');
                sleep(1000);
                continue;
            }
            console.log('max job fails reached, check for handling: ', config.jobFailedCount);

            if (handleRelogin()) {
                console.log('just handleRelogin()');
                config.jobFailedCount = 0;
                continue;
            }
            else if (handleWelcomePage()) {
                console.log('just handleWelcomePage()');
                handleAnnouncement();
                config.jobFailedCount = 0;
                continue;
            }
            else if (handleAnnouncement()) {
                console.log('just handleAnnouncement()');
                handleFindAndTapCandyHouse();
                config.jobFailedCount = 0;
                continue;
            }
            else if (handleFindAndTapCandyHouse()){
                console.log('just handleFindAndTapCandyHouse()');
                config.jobFailedCount = 0;
                continue;
            }
            else if (handleInputLoginInfo()) {
                console.log('login, wait for handleWelcomePage()')
                for (var j = 0; j < 20; j ++){
                    if (handleWelcomePage() || handleAnnouncement()) {
                        handleFindAndTapCandyHouse();
                        config.jobFailedCount = 0;
                        break;
                    }
                    sleep(3000);
                }
                continue;
            }
            else if (config.jobFailedCount %21 > 0 && handleTryHitBackToKingdom()){
                console.log('just handleTryHitBackToKingdom()');
                config.jobFailedCount = 0;
                continue;
            }
        } else {
            config.jobFailedCount = 0;
            sendEvent("running", "");
        }
    }
}

start(JSON.stringify(config))

// sendEvent("gameStatus", "login-failed")
