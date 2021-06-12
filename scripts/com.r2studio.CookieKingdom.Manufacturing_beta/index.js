config = {
    sleep: 240,
    sleepAnimate: 800,
    sleepWhenDoubleLoginInMinutes: 30,
    localPath: getStoragePath() + '/scripts/com.r2studio.CookieKingdom.Manufacturing.beta/images',

    account: 'moonminv2@gmail.com',
    password: '12qwaszx',
    autoCollectMailIntervalInMins: -1,
    autoCollectFountainIntervalInMins: 120,
    materialsTarget: 260,
    goodsTarget: 50,
    worksBeforeCollectCandy: 40,
    isCollectCandy: true,

    jobFailedBeforeGetCandy: 3,
    jobFailedCount: 0,
    lastCollectCandyTime: new Date(),
    lastCollectMail: new Date(),
    lastCollectFountain: new Date(),
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
    console.log('tap: ', parseInt(x, 10), parseInt(y, 10))
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
    } else if (whSize.height !== 360 || whSize.width !== 640) {
        console.log('Reboot nox as screen size incorrect: ', whSize.height, whSize.width, " (h/w)");
        execute('/system/bin/reboot -p');
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
        }
        else {
            qTap(pageBarryFarm, 800)
            sleep(config.sleepAnimate);
            qTap(pageBarryFarm)
            sleep(config.sleepAnimate);
        }
        return true;
    }
    else if (checkIsPage(pageMilkFarm)) {
        console.log('Milk farm, add more')
        qTap(pageMilkFarm, 800)
        sleep(config.sleepAnimate);
        qTap(pageMilkFarm)
        sleep(config.sleepAnimate);
        return true;
    }
    else if (checkIsPage(pageCottomFarm)) {
        console.log('Cottom farm, add more')
        qTap(pageCottomFarm, 800)
        sleep(config.sleepAnimate);
        qTap(pageCottomFarm)
        sleep(config.sleepAnimate);
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
        keycode('BACK', 1000);                
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

function findAndTapFountain() {
    var fountain = getImageFromBase64("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");
    var img = getScreenshot();

    var foundResults = findImages(img, fountain, 0.92, 5, true);
    releaseImage(img);
    releaseImage(fountain);

    console.log('fountains > ', JSON.stringify(foundResults));
    if (foundResults.length > 0) {
        var bestFit = foundResults[0];
        for (var j in foundResults) {
            if (foundResults[j]['score'] > bestFit['score']) {
                bestFit = foundResults[j];
            }
        }
        console.log('best fountain > ', JSON.stringify(bestFit));

        // Fountain image is very big so require an offset
        qTap(pnt(bestFit.x + 38, bestFit.y + 24));
        sleep(config.sleepAnimate * 2);

        pageInFountain = [
            {x: 514, y: 311, r: 121, g: 207, b: 12},
            {x: 514, y: 37, r: 251, g: 251, b: 251},
            {x: 463, y: 31, r: 60, g: 70, b: 105},
            {x: 360, y: 66, r: 248, g: 202, b: 4},
            {x: 431, y: 55, r: 243, g: 233, b: 223},
            {x: 520, y: 65, r: 210, g: 217, b: 213},
            {x: 541, y: 66, r: 217, g: 207, b: 199},
        ]
        if (checkIsPage(pageInFountain)) {
            console.log('found and claim fountain');
            qTap(pageInFountain);
            sleep(config.sleepAnimate * 3);
        }
        
        handleGotoKingdomPage();
        return true;
    }
    return false;
}

function findAndTapCandy() {
    var candy = getImageFromBase64("iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAAAA3NCSVQICAjb4U/gAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAMXSURBVDhPHZNbaFxVFIa/vc9l5mRuTSZOtcGatFitpA+2VqyNqKAGQSy+FBWfLPShgoKKIKiI4pvv+qoWFPFSNamoJS0Wq23TOFrrNZgymZqZSWTGzJw558y5udKHvffLWv/6//X/W735zaE0mm8Q78hjG5qMHMfU2KaSY+E4BmGUMIgTPD/EDWO8KOKZ6Xf44p9XODe/iPHI5C2vTj/wMO3qIuaYxZBpMJQxyGUtsoZBpZLDyVhYWoNWpElKFKUs1Gd5fNdjjN+UQ11aeC81dIw2U3rNJRqb/uXR9/dx/3N7mMrCXhXg4BJ3PqXZ6tLs9HEHMX4UM1IZZmRsGIGXAXLbZsL1N44zbFvsf/5WUltRMPLk9BCmNjj8/XZmVq8la5pYSmGgcNddOgIs7RGDMCBJQw5+lOH1zU/yNGXuDbI8YY+y095KJx1w7KEHObBvmlIjxhBZ2hDmYY/du7ahk0RBGslSM3x40CcfOEgVc4bLy36Lt/s1zsZwfNBgaaDYf/c9lHpSIjVEJjs5jP79fBUllHv9EK8nktazzK0OuCMssuz1acYOTzl7qcYWvdI4Gcdmas99bGnkiAU8YhZ96YfzwgSU0vih4kAmz10qz4TnMNHL0Y581jyP3ekkoeoQDaRcmidvu12cgrdOf42OMik/zX5JKLJSAbsh+YSjM79heynFrljdgdfcBi8e+Zhn/SpekOCLO5cXlwgkP9oEs1ysUC4IEwmTGI1tZ/ij1mZqS5EXXpojknD1jB4/vuGyUvcZbDAxHApOgTvd7Vyp1VG/LBxNW7+ew8hdx+ZtYwKiyGYlrbbGshTttke0MUACJg+tel0kSeBiRalUYHxrBZ0zHVKrjPv3RZYvVAn8lJU/V7h4/ASra65EXst0LSk16ba7+L58gVBWcOIMbnddTDHRYzdPkP9PKCUhSadO7dQMVqUCScDytydx3UCmapFqsNZqX2V0+rOTVy0OrzT5/N1T6L/OnKUyuolrRoqYksR0Y8H9SBgYREEkzZYs3KKxVBM5ioWvvqNcyjM6UuKDY/P8PH+B/wFjmmx285T9wgAAAABJRU5ErkJggg==");
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

function findAndTapProductionHouse() {
    var houses = {
        sugar: "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",
        wood: "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",
        cottom: "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",
        toolShop: "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",
        stew: "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",
        jam: "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",
    }

    for (var key in houses) {
        var houseImage = getImageFromBase64(houses[key]);
        img = getScreenshot();

        var foundResults = findImages(img, houseImage, 0.88, 1, true);
        releaseImage(img);
        releaseImage(houseImage);
    
        if (foundResults.length > 0) {
            console.log('found house >> ', key, JSON.stringify(foundResults));
            var house = foundResults[0];
            // Need to add offset to images
            house.x += 10;
            house.y += 10;
            qTap(house);
            sleep(config.sleepAnimate * 3);

            if (!checkIsPage(pageInProduction)) {
                qTap(house); // prevent when there are sugar cube to collect
                sleep(config.sleepAnimate * 2);    
            }

            if (checkIsPage(pageInProduction)) {
                console.log('Found production house successfully: ', key)
                return true;
            }
            else {
                console.log('Assume found house but failed, go back to kingdom page: ', key)
                handleTryHitBackToKingdom();
            }
        }
    }
    return false;
}

var Directions = Object.freeze({
    NE: pnt(-260, 160),
    NW: pnt(460, 255),
    // SE: pnt(-460, -255),
    SW: pnt(260, -160),
    E: pnt(-500, -40),
    W: pnt(500, 40),
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
    var successSwipe = 0;
    for (var i = 0; i < 10; i ++){
        console.log('I: ', i)
        if (swipeDirection(Directions.NW)) {
            successSwipe++;
        }
        if (successSwipe > 3) {
            break;
        }
    }

    swipeFromToPoint(pnt(530, 266), pnt(60, 30), 3)
    sleep(1000)
}

function swipeFromToPoint(fromPnt, toPnt, steps, id) {
    id === undefined ? 0 : id;

    tap(fromPnt.x, fromPnt.y, 100, id);
    sleep(config.sleepAnimate * 3);
    if (!checkIsPage(pageInKingdomVillage)) {
        console.log('swipe failed, try again')
        keycode('BACK', 100);
        return false;
    }

    steps = steps == undefined? 4: steps
    step_x = (toPnt.x - fromPnt.x) / steps;
    step_y = (toPnt.y - fromPnt.y) / steps;

    tapDown(fromPnt.x, fromPnt.y, 40, 0, id);
    sleep(250);

    for (var i = 0; i < steps; i ++) {
        moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0, id);
        // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
        sleep(80);
    }

    moveTo(toPnt.x, toPnt.y, 40, 0, id);
    sleep(800);
    tapUp(toPnt.x, toPnt.y, 40, 0, id);
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
        sleep(config.sleepAnimate * 2);
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
    var directions = [
        Directions.NE, Directions.SW, Directions.E, Directions.W
    ]

    if (checkIsPage(pageInProduction)) {
        keycode('BACK', 1000);
        sleep(config.sleepAnimate * 2);
    }

    zoomOut();

    findAndTapCandy();

    if (findAndTapProductionHouse()) {
        console.log('already found house using image match, start working');
        return true;
    }
    else if (findHouseInSpecificLocation(config.findProductionTimes)){
        console.log('find house v2 success, start working')
        return true;
    }

    swipeBackToCenter();
    if (config.autoCollectFountainIntervalInMins != -1 && ((Date.now() - config.lastCollectFountain) / 60000) > config.autoCollectFountainIntervalInMins) {
        console.log('Collect fountain: ', (Date.now() - config.lastCollectFountain) / 60000, ' just passed');
        config.lastCollectFountain = Date.now();
        findAndTapFountain();
    }

    for (var i = 0; i < directions.length; i ++) {
        if (swipeDirection(directions[i])) {

            findAndTapCandy();

            if (findAndTapProductionHouse()) {
                console.log('already found house using image match, start working');
                return true;
            }
            else if (findHouseInSpecificLocation(config.findProductionTimes)){
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

    findAndTapCandy();

    return findAndTapProductionHouse();
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

    // TOS page will change when login page change
    pageTermsOfServices = [
        {x: 447, y: 233, r: 66, g: 66, b: 66},
        {x: 329, y: 126, r: 66, g: 66, b: 66},
        {x: 452, y: 126, r: 66, g: 66, b: 66},
        {x: 458, y: 216, r: 66, g: 66, b: 66},
        {x: 286, y: 216, r: 66, g: 66, b: 66},
        {x: 179, y: 126, r: 66, g: 66, b: 66}
    ]
    pageTermsOfServices2 = [
        {x: 447, y: 230, r: 255, g: 255, b: 255},
        {x: 43, y: 257, r: 96, g: 24, b: 22},
        {x: 181, y: 257, r: 95, g: 24, b: 22},
        {x: 31, y: 289, r: 92, g: 67, b: 18},
        {x: 203, y: 285, r: 90, g: 65, b: 16},
        {x: 161, y: 329, r: 37, g: 8, b: 13},
        {x: 246, y: 230, r: 255, g: 255, b: 255},
        {x: 179, y: 132, r: 255, g: 255, b: 255},
    ]
    if (checkIsPage(pageTermsOfServices) || checkIsPage(pageTermsOfServices2)) {
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
    // pageChooseLoginMethod2 is for Android 7
    pageChooseLoginMethod2 = [
        {x: 251, y: 130, r: 249, g: 251, b: 254},
        {x: 251, y: 170, r: 0, g: 1, b: 0},
        {x: 247, y: 201, r: 66, g: 103, b: 178},
        {x: 252, y: 240, r: 255, g: 95, b: 0},
        {x: 374, y: 125, r: 255, g: 255, b: 255},
        {x: 371, y: 166, r: 255, g: 255, b: 255},
        {x: 374, y: 203, r: 255, g: 255, b: 255},
        {x: 375, y: 245, r: 255, g: 255, b: 255}
    ]
    for (var i = 0; i < findLoginTime; i ++) {
        if (checkIsPage(pageChooseLoginMethod) || checkIsPage(pageChooseLoginMethod2)) {
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
            {x: 55, y: 277, r: 235, g: 181, b: 56},
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
    for (var i = 0; i < 15; i ++) {
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
            sleep(2000);
        }    
    }

    if (inputEmail) {
        pageEnterpassword = [
            {x: 374, y: 150, r: 255, g: 255, b: 255},
            {x: 381, y: 56, r: 60, g: 60, b: 60},
            {x: 266, y: 50, r: 60, g: 60, b: 60},
            {x: 401, y: 120, r: 255, g: 255, b: 255},
            {x: 316, y: 305, r: 152, g: 152, b: 152}
        ]
        pageEnterTwoPasswords = [
            {x: 243, y: 307, r: 255, g: 255, b: 255},
            {x: 377, y: 229, r: 200, g: 200, b: 200},
            {x: 367, y: 176, r: 255, g: 255, b: 255},
            {x: 371, y: 50, r: 60, g: 60, b: 60},
            {x: 319, y: 53, r: 230, g: 230, b: 230},
            {x: 244, y: 309, r: 200, g: 200, b: 200}
        ]
        for (var i = 0; i < 15; i ++) {
            if (checkIsPage(pageEnterTwoPasswords)) {
                config.run = false;
                sendEvent("gameStatus", "login-failed")
                console.log('This account id does not exist')
                return false;
            }

            if (checkIsPage(pageEnterpassword)){
                qTap(pageEnterpassword);
                typing(config.password, 3000);
                sleep(config.sleep);
                typing('\n', 200);
                sleep(config.sleep);
                qTap(pageEnterpassword);
                sleep(5000);

                if (checkIsPage(pageEnterpassword)) {
                    config.run = false;
                    sendEvent("gameStatus", "login-failed")
                    console.log('still in password page, either password too short, wrong password, or it is a new id that devPlay ask to input password twice')
                    return false;
                }

                qTap(pnt(370, 190));
                sleep(config.sleepAnimate);
                sendEvent("gameStatus", "login-success")
    
                // Touch here to start:
                console.log('successfully input password')
                return true;
            } else {
                console.log('waiting for input password field');
                sleep(2000);
            }
        }
    }

    //TODO 帳號打錯會進入教學關卡

    // sendEvent("gameStatus", "login-failed")
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
    if (checkIsPage(pageInKingdomVillage)) {
        console.log('already in kingdom')
        return true;
    }

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

function getCurrentApp() {
    var result = execute('dumpsys activity top');
    var lines = result.split('\n');
    var app = '';
    var activity = '';
    for (var i = 0; i < lines.length; i ++) {
      var line = lines[i]
      var p = line.indexOf('ACTIVITY');
      if (p !== -1) {
        app = '';
        activity = '';
        var isApp = true;
        for (var i = p + 9; i < line.length; i++) {
          var c = line[i];
          if (c === ' ') {
          } else if (c === '/') {
            isApp = false;
          } else if (isApp) {
            app += c;
          } else {
            activity += c;
          }
        }
      }
    }
    console.log('Current app: ', app, activity)
    return [app, activity];
}

function handleAutoCollectMail() {
    console.log('About to collect mails')
    if (!checkIsPage(pageInKingdomVillage)) {
        handleTryHitBackToKingdom();
    }

    pageHasUnreadMails = [
        {x: 565, y: 8, r: 255, g: 0, b: 0},
        {x: 552, y: 14, r: 251, g: 239, b: 215},
        {x: 588, y: 18, r: 219, g: 176, b: 73},
        {x: 626, y: 19, r: 69, g: 104, b: 142},
        {x: 572, y: 343, r: 48, g: 76, b: 109},
        {x: 533, y: 316, r: 255, g: 255, b: 255},
        {x: 36, y: 310, r: 186, g: 13, b: 38},
        {x: 26, y: 319, r: 252, g: 252, b: 252},
        {x: 61, y: 340, r: 56, g: 93, b: 130}
    ]

    if (checkIsPage(pageHasUnreadMails)) {
        qTap(pageHasUnreadMails);
        sleep(config.sleepAnimate * 2);

        pageGreenClaimAllButton = [
            {x: 506, y: 323, r: 121, g: 207, b: 12},
            {x: 590, y: 318, r: 121, g: 207, b: 12},
            {x: 572, y: 24, r: 60, g: 70, b: 105},
            {x: 419, y: 318, r: 54, g: 62, b: 95}
        ]

        if (checkIsPage(pageGreenClaimAllButton)) {
            console.log('found unread mail and claim all');
            qTap(pageGreenClaimAllButton);
            sleep(config.sleep);
        }

        handleTryHitBackToKingdom()
    }

    console.log('completed: handleAutoCollectMail')
}

function zoomOut() {
    tapDown(550, 72, 100, 0);
    tapDown(92, 270, 100, 1);
    sleep(config.sleep)
    
    moveTo(450, 120, 40, 0);
    moveTo(220, 210, 40, 1);
    sleep(config.sleep)
    
    moveTo(341, 200, 40, 0);
    moveTo(341, 200, 40, 1);
    sleep(config.sleep)
    
    tapUp(341, 200, 100, 0);
    tapUp(341, 200, 100, 1);
    
    return true;
}

function stop() {
    config.run = false;
    console.log('stop clicked, change config.run = false')
}

function start(inputConfig) {
    console.log('inputConfig: ', inputConfig)
    config.run = true;

    inputConfig = JSON.parse(inputConfig);
    config = mergeObject(config, inputConfig)
    console.log('start with config: ', JSON.stringify(config));
    // TODO: inputConfig.goodsTarget seems to be string

    if (getCurrentApp()[0] !== "com.devsisters.ck") {
        console.log('Cookie not active, restart CookieKingdom and wait 20s')
        execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');
        sleep(20000);
    }

    while(!checkIsPage(pageInKingdomVillage) && !checkIsPage(pageInProduction) && config.run) {
        handleInputLoginInfo();
        console.log('Trying to login');
    }
    if (!config.run) {
        console.log('wrong login info, stopping');
        return;
    }

    if (config.isCollectCandy) {
        console.log('first try collect candy')
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

        if (config.isCollectCandy && ((Date.now() - config.lastCollectCandyTime) / 60000) > config.worksBeforeCollectCandy) {
            console.log('Collect candy: ', (Date.now() - config.lastCollectCandyTime) / 60000, ' just passed');
            config.lastCollectCandyTime = Date.now();
            handleFindAndTapCandyHouse();
        }
        if (config.autoCollectMailInterval != -1 && ((Date.now() - config.lastCollectMail) / 60000) > config.autoCollectMailInterval) {
            console.log('Collect mail: ', (Date.now() - config.lastCollectMail) / 60000, ' just passed');
            config.lastCollectMail = Date.now();
            handleAutoCollectMail();
        }
        // if (config.autoCollectFountainIntervalInMins != -1 && ((Date.now() - config.lastCollectFountain) / 60000) > config.autoCollectFountainIntervalInMins) {
        //     console.log('Collect fountain: ', (Date.now() - config.lastCollectFountain) / 60000, ' just passed');
        //     config.lastCollectFountain = Date.now();
        //     findAndTapFountain();
        // }

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

            if (checkIsPage(pageInProduction)) {
                console.log('in production, continue work');
                config.jobFailedCount = 0;
                continue;
            }
            else if (handleRelogin()) {
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
            else if (handleAnnouncement() || checkIsPage(pageInKingdomVillage)) {
                console.log('in village, find production');
                handleFindAndTapCandyHouse();
                config.jobFailedCount = 0;
                continue;
            }
            else if (getCurrentApp()[0] !== "com.devsisters.ck") {
                console.log('Cookie not active, restart CookieKingdom and wait 20s')
                execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');
                sleep(20000);
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
            else if (handleFindAndTapCandyHouse()){
                console.log('just handleFindAndTapCandyHouse()');
                config.jobFailedCount = 0;
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
            console.log('Cookie action successfully at: ',  new Date().toLocaleString());
        }
    }
}

// start(JSON.stringify(config))

// sendEvent("gameStatus", "login-failed")

