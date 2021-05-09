config = {
    sleep: 240,
    sleepAnimate: 800,
    sleepWhenDoubleLoginInMinutes: 30,
    localPath: getStoragePath() + '/scripts/com.r2studio.CookieKingdom.Manufacturing.beta/images',

    account: 'moonminv2@gmail.com',
    password: '12qwaszx',
    materialsTarget: 260,
    goodsTarget: 55,
    worksBeforeCollectCandy: 40,

    jobFailedBeforeGetCandy: 5,
    jobFailedCount: 0,
    run: true,
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
    { x: 152, y: 179, r: 219, g: 171, b: 130 },
    { x: 425, y: 82, r: 2, g: 252, b: 250 }
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
        console.log('image size is incorrect, restart CookieKingdom')
        execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');
        sleep(config.sleepAnimate * 2);
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

        // pageShovelTwoDigits = [
        //     {x: 448, y: 321, r: 255, g: 255, b: 255},
        //     {x: 449, y: 324, r: 255, g: 255, b: 255},
        //     {x: 435, y: 326, r: 255, g: 255, b: 255},
        //     {x: 435, y: 322, r: 255, g: 255, b: 255}
        // ]

        if (checkIsPage(pageShovelEnabled)) {
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
            else if (shovelStock < config.goodsTarget) {
                console.log('10 < Shovel < ', config.goodsTarget, ', add 2');
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
    return count;
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
        qTap(pageWoodFarm)
        sleep(config.sleepAnimate);
        qTap(pageWoodFarm)
        sleep(config.sleepAnimate);
        qTap(pageWoodFarm)
        sleep(config.sleepAnimate);
        qTap(pageWoodFarm)
        return true;
    }
    else if (checkIsPage(pageBeanFarm)) {
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
    else if (checkIsPage(pageSugarFarm)) {
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
    else if (checkIsPage(pagePowderFarm)) {
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
    else if (checkIsPage(pageBarryFarm)) {
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
    else if (checkIsPage(pageMilkFarm)) {
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
    else if (checkIsPage(pageCottomFarm)) {
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

    var itemsAdd = makeGoodsToTarget(10, 2);
    console.log('add: ', itemsAdd)
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
        { x: 499, y: 328, r: 96, g: 31, b: 76 },
        { x: 577, y: 329, r: 93, g: 30, b: 74 },
        { x: 612, y: 296, r: 227, g: 165, b: 40 },
        { x: 547, y: 304, r: 253, g: 239, b: 125 },
        { x: 463, y: 297, r: 227, g: 165, b: 40 },
        { x: 591, y: 268, r: 191, g: 48, b: 57 },
        { x: 480, y: 270, r: 243, g: 60, b: 56 }
    ]

    // TODO: Need to handle login event

    pageAnnouncement = [
        { x: 610, y: 20, r: 56, g: 167, b: 231 },
        { x: 619, y: 19, r: 255, g: 255, b: 255 },
        { x: 628, y: 18, r: 56, g: 167, b: 231 },
        { x: 585, y: 48, r: 54, g: 64, b: 87 },
        { x: 584, y: 288, r: 54, g: 64, b: 87 },
        { x: 59, y: 77, r: 141, g: 152, b: 186 },
        { x: 58, y: 136, r: 56, g: 64, b: 85 },
        { x: 58, y: 323, r: 54, g: 64, b: 87 }
    ]

    if (checkIsPage(pageWelcome)) {
        console.log('In welcome page, quitting');
        qTap(pnt(324, 329));
        sleep(config.sleepAnimate);

        while (true) {
            if (checkIsPage(pageAnnouncement)) {
                qTap(pageAnnouncement);
                sleep(config.sleepAnimate);
                break;
            }
            qTap(pnt(324, 329));
            sleep(3000);
            console.log('tap middle and wait for announce page');
        }
        handleFindAndTapCandyHouse();
    } else {
        console.log('Confirmed not in welcome page');
    }
}

function handleAnnouncement() {
    pageAnnouncement = [
        { x: 610, y: 20, r: 56, g: 167, b: 231 },
        { x: 619, y: 19, r: 255, g: 255, b: 255 },
        { x: 628, y: 18, r: 56, g: 167, b: 231 },
        { x: 585, y: 48, r: 54, g: 64, b: 87 },
        { x: 584, y: 288, r: 54, g: 64, b: 87 },
        { x: 59, y: 77, r: 141, g: 152, b: 186 },
        { x: 58, y: 136, r: 56, g: 64, b: 85 },
        { x: 58, y: 323, r: 54, g: 64, b: 87 }
    ]

    if (checkIsPage(pageAnnouncement)) {
        console.log('found announcement page, leaving')
        qTap(pageAnnouncement);
        sleep(config.sleepAnimate);
        return true;
    }
    return false;
}

function handleFindAndTapCandyHouse() {
    pageInProduction = [
        { x: 609, y: 19, r: 56, g: 167, b: 231 },
        { x: 617, y: 19, r: 255, g: 255, b: 255 },
        { x: 625, y: 18, r: 34, g: 85, b: 119 },
        { x: 619, y: 331, r: 166, g: 104, b: 65 },
        { x: 19, y: 321, r: 166, g: 104, b: 65 }
    ]

    if (checkIsPage(pageInProduction)) {
        qTap(pageInProduction);
        sleep(config.sleepAnimate * 2);
    }

    // Tap the candy
    var candy = openImage(config.localPath + '/candy.png');
    var img = getScreenshot();

    var foundResults = findImages(img, candy, 0.92, 5, true);
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
    }

    releaseImage(img);
    releaseImage(candy);

    // Tap the sugar house
    var sugarHouse = openImage(config.localPath + '/sugarHouse.png');
    img = getScreenshot();

    var foundResults = findImages(img, sugarHouse, 0.92, 3, true);
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
    }

    releaseImage(img);
    releaseImage(sugarHouse);
}

function handleInputLoginInfo() {
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
        sleep(config.sleepAnimate);
    } else {
        console.log('did not find input age page, return')
        return false;
    }

    // TODO: update the download resource page
    pageCanDownloadResources = [
        {x: 346, y: 240, r: 121, g: 207, b: 12},
        {x: 420, y: 237, r: 219, g: 207, b: 199},
        {x: 418, y: 172, r: 243, g: 233, b: 223},
        {x: 412, y: 103, r: 60, g: 70, b: 105},
        {x: 219, y: 98, r: 60, g: 70, b: 105},
        {x: 221, y: 250, r: 219, g: 207, b: 199}
    ]
    if (checkIsPage(pageCanDownloadResources)){
        console.log('start download resources');
        qTap(pageCanDownloadResources);
        sleep(config.sleepAnimate);

        for (var i = 0; i < 6; i ++) {
            // wait for yellow bar (download progress bar) disapper
            if (!checkIsPage([{x: 16, y: 349, r: 255, g: 210, b: 76}])){
                console.log('download finished');
                break;
            }
            console.log('wait for download: ', i);
            sleep(10000);
        }
    }

    pageChooseLoginMethod = [
        {x: 395, y: 245, r: 255, g: 255, b: 255},
        {x: 392, y: 203, r: 255, g: 255, b: 255},
        {x: 384, y: 162, r: 255, g: 255, b: 255},
        {x: 389, y: 125, r: 255, g: 255, b: 255},
        {x: 250, y: 244, r: 255, g: 107, b: 19},
        {x: 246, y: 201, r: 66, g: 103, b: 178},
        {x: 250, y: 165, r: 0, g: 1, b: 0},
        {x: 276, y: 84, r: 255, g: 95, b: 0}
    ]
    for (var i = 0; i < 6; i ++) {
        if (checkIsPage(pageChooseLoginMethod)) {
            qTap(pageChooseLoginMethod);
            sleep(config.sleepAnimate);
            break;
        } else {
            console.log('waiting for pageChooseLoginMethod: ', i);
            sleep(10000);
        }
    }

    pageEnterEmail = [
        {x: 402, y: 157, r: 255, g: 255, b: 255},
        {x: 406, y: 63, r: 60, g: 60, b: 60},
        {x: 294, y: 54, r: 95, g: 95, b: 95},
        {x: 392, y: 194, r: 200, g: 200, b: 200}
    ]
    for (var i = 0; i < 2; i ++) {
        if (checkIsPage(pageEnterEmail)){
            console.log('inputing user email')
            qTap(pageEnterEmail);
            typing(config.account, 100);
            sleep(config.sleepAnimate);
            qTap(pnt(370, 190));
            sleep(config.sleepAnimate);
            break;
        } else {
            console.log('cannot find input email field');
            sleep(10000);
        }    
    }

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
    sendEvent("gameStatus", "login-failed")
    console.log('cannot find input email field');
    return false;
}

function stop() {}

function start(inputJson) {
    inputConfig = JSON.parse(inputJson)

    console.log('start with: ', inputConfig.materialsTarget, inputConfig.goodsTarget);
    config.materialsTarget = inputConfig.materialsTarget;
    config.goodsTarget = inputConfig.goodsTarget;

    
    // USE Object.Assign!!!!!!!!!!!!!!!!!!!!

    handleFindAndTapCandyHouse();
    for (var i = 1; i < 100000000; i++) {
        console.log("start loop", i);

        var act = JobScheduling();
        sleep(config.sleep);
        handleNotEnoughStock();
        sleep(config.sleep);
        qTap(pnt(349, 174)); // next
        sleep(config.sleepAnimate);
        console.log('act: ', act)

        if (i % config.worksBeforeCollectCandy == 0) {
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
            else if (handleInputLoginInfo()) {
                console.log('just handleInputLoginInfo()');
                for (var i = 0; j < 20; i ++){
                    if (handleWelcomePage()) {
                        console.log('login, wait for handleWelcomePage()')
                        config.jobFailedCount = 0;
                        break;
                    }
                    sleep(3000);
                }
                continue;
            }
            else if (handleWelcomePage()) {
                console.log('just handleWelcomePage()');
                handleAnnouncement();
                config.jobFailedCount = 0;
                continue;
            } else if (handleAnnouncement()) {
                console.log('just handleAnnouncement()');
                handleFindAndTapCandyHouse();
                config.jobFailedCount = 0;
                continue;
            } else if (handleFindAndTapCandyHouse()){
                console.log('just handleFindAndTapCandyHouse()');
                config.jobFailedCount = 0;
                continue;
            }
        } else {
            config.jobFailedCount = 0;
            sendEvent("running", "");
        }
    }
}

start(JSON.stringify({'materialsTarget': 260, 'goodsTarget': 40}))
//   JobScheduling()
// ocrMaterialStorage();
// ocrProductStorage(goodsLocation[2]);
// ocrProductStorage(rect(433, 315, 16, 12));
// ocrProductStorage(goodsLocation['shovel'])

//TODO: Auto restart, Auto input id/pwd, add find all houses
// handleFindAndTapCandyHouse()


// sendEvent("gameStatus", "login-failed")
