config = {
  sleep: 240,
  sleepAnimate: 800,
  sleepWhenDoubleLoginInMinutes: 30,
  localPath: getStoragePath() + '/scripts/com.r2studio.CookieKingdom.Manufacturing.beta/images',

  account: 'default_xrobotmon_account@gmail.com',
  password: '',
  autoCollectMailIntervalInMins: 40,
  autoCollectFountainIntervalInMins: 40,
  autoCollectTrainIntervalInMins: 20,
  autoSendHotAirBallonIntervalInMins: 40,
  isHotAirBallonGotoEp3: false,
  autoCollectDailyReward: true,
  autoFulfillWishesIntervalInMins: 11,
  alwaysFulfillWishes: false,
  wishingTreeSafetyStock: 40,
  wishingTreeMaxFillingMins: 5,
  autoPvPIntervalInMins: 0,
  autoPvPTargetScoreLimit: 400000,
  materialsTarget: 300,
  goodsTarget: 60,
  worksBeforeCollectCandy: 40,
  productionFocusOnMin: true,
  helpTapGreenCheck: true,
  pvpCELimit: 250000,
  autoCollectTropicalIslandsIntervalInMins: 40,
  buildTowardsTheLeft: true,

  jobFailedBeforeGetCandy: 4,
  jobFailedCount: 0,
  lastNetworkIssueOccurTime: 0,
  networkIssueCount: 0,
  networkIssueCountThreasHold: 20,
  lastCollectCandyTime: 0,
  lastCollectMail: 0,
  lastCollectFountain: 0,
  lastCollectTrain: 0,
  lastSendHotAirBallon: 0,
  lastCollectDailyReward: 0,
  lastFulfillWishes: 0,
  lastAutoPvP: 0,
  lastCollectTropicalIsland: 0,
  run: true,
  isXR: true,
  findProductionTimes: 8,
  wishRefreshThreashold: 5,
  wishAlreadyFulfilled: false,

  stock_axe: 60,
  stock_pickaxe: 60,
  stock_saw: 60,
  stock_shovel: 60,
  stock_stack: 60,
  stock_tongs: 60,
  stock_hammer: 60,
  stock_jellybeanJam: 60,
  stock_jellyJam: 60,
  stock_toffeeJam: 60,
  stock_pomegranateJam: 60,
  stock_sparkleberryJam: 60,
  stock_pineconeBirdyToy: 60,
  stock_acornLamp: 60,
  stock_cuckooClock: 60,
  stock_dreamcatcher: 60,
  stock_heartyRye: 60,
  stock_tartJampie: 60,
  stock_ginkgoFocaccia: 60,
  stock_glazedDonuts: 60,
  stock_flyffyCastella: 60,
  stock_goldenCroissant: 60,
  stock_hotJellyStew: 60,
  stock_bearJellyBurger: 60,
  stock_candyPasta: 60,
  stock_fluffyOmurice: 60,
  stock_jellyDeluxePizza: 60,
  stock_fancyJellybeanMeal: 60,
  stock_biscuitPlanter: 60,
  stock_shinyGlass: 60,
  stock_gleamyBead: 60,
  stock_colorfulBowl: 60,
  stock_candyFlower: 60,
  stock_happyPlanter: 60,
  stock_candyBouquet: 60,
  stock_lollipopFlowerBasket: 60,
  stock_bellFlowerBouquet: 60,
  stock_glitteringYogurtWeeath: 60,
  stock_cream: 60,
  stock_butter: 60,
  stock_homemadeCheese: 60,
  stock_jellybeanLatte: 60,
  stock_bubblyBoba: 60,
  stock_sweetberryJuicy: 60,
  stock_cloudPillow: 60,
  stock_bearJellyToy: 60,
  stock_pitayaDragonToy: 60,
  stock_creamRootBeer: 60,
  stock_redberryJuice: 60,
  stock_vintageRootBottle: 60,
  stock_spookyMuffin: 60,
  stock_strawberryCake: 60,
  stock_partyCake: 60,
  stock_glazedRing: 60,
  stock_rubyberryBrooch: 40,
  stock_bearJellyCrown: 40,
};

factoryType = [
  'wood',
  'bean',
  'sugar',
  'tool',
  'powder',
  'bean_2',
  'wood_2',
  'powder_2',
  'berry',
  'berry_2',
  'poweder_3',
  'berry_3',
];

pageBaseProductNoThirdFigure = [
  { x: 362, y: 23, r: 35, g: 30, b: 20 },
  { x: 358, y: 23, r: 35, g: 30, b: 20 },
  { x: 362, y: 19, r: 35, g: 30, b: 20 },
  { x: 360, y: 16, r: 35, g: 30, b: 20 },
  { x: 358, y: 19, r: 35, g: 30, b: 20 },
];

pageWoodFarm = [
  { x: 584, y: 118, r: 121, g: 207, b: 12 },
  { x: 434, y: 73, r: 174, g: 98, b: 73 },
  { x: 528, y: 82, r: 145, g: 85, b: 56 },
];

pageBeanFarm = [
  { x: 590, y: 121, r: 121, g: 207, b: 12 },
  { x: 311, y: 22, r: 0, g: 255, b: 247 },
  { x: 427, y: 83, r: 0, g: 253, b: 251 },
  { x: 425, y: 82, r: 2, g: 252, b: 250 },
  { x: 526, y: 89, r: 0, g: 254, b: 251 },
];

pageSugarFarm = [
  { x: 586, y: 119, r: 121, g: 207, b: 12 },
  { x: 426, y: 69, r: 237, g: 245, b: 245 },
  { x: 307, y: 13, r: 250, g: 252, b: 252 },
  { x: 523, y: 81, r: 236, g: 245, b: 244 },
  { x: 428, y: 95, r: 254, g: 254, b: 254 },
];

pagePowderFarm = [
  { x: 582, y: 119, r: 121, g: 207, b: 12 },
  { x: 315, y: 24, r: 159, g: 117, b: 52 },
  { x: 435, y: 91, r: 158, g: 117, b: 51 },
  { x: 528, y: 89, r: 235, g: 207, b: 138 },
];

pageBarryFarm = [
  { x: 587, y: 123, r: 121, g: 207, b: 12 },
  { x: 425, y: 86, r: 194, g: 38, b: 46 },
  { x: 429, y: 79, r: 32, g: 116, b: 40 },
  { x: 306, y: 19, r: 190, g: 38, b: 44 },
  { x: 524, y: 90, r: 163, g: 31, b: 35 },
];

pageMilkFarm = [
  { x: 587, y: 121, r: 121, g: 207, b: 12 },
  { x: 303, y: 25, r: 238, g: 245, b: 241 },
  { x: 418, y: 91, r: 246, g: 246, b: 238 },
  { x: 526, y: 89, r: 255, g: 253, b: 235 },
];

pageCottomFarm = [
  { x: 582, y: 119, r: 121, g: 207, b: 12 },
  { x: 528, y: 87, r: 254, g: 231, b: 251 },
  { x: 428, y: 92, r: 255, g: 241, b: 255 },
];

pageInKingdomVillage = [
  { x: 321, y: 15, r: 255, g: 238, b: 17 },
  { x: 428, y: 14, r: 0, g: 193, b: 255 },
  { x: 517, y: 22, r: 235, g: 161, b: 89 },
  { x: 551, y: 15, r: 251, g: 239, b: 215 },
  { x: 617, y: 308, r: 71, g: 122, b: 190 },
  { x: 27, y: 225, r: 223, g: 156, b: 77 },
  { x: 19, y: 111, r: 190, g: 3, b: 37 },
];

//rgb(166,104,65)
pageInProduction = [
  { x: 609, y: 19, r: 56, g: 167, b: 231 },
  { x: 617, y: 19, r: 255, g: 255, b: 255 },
  { x: 625, y: 18, r: 34, g: 85, b: 119 },
  { x: 619, y: 331, r: 166, g: 104, b: 65 },
  { x: 19, y: 321, r: 166, g: 104, b: 65 },
];

pageNotifyQuit = [
  { x: 299, y: 249, r: 12, g: 165, b: 219 },
  { x: 258, y: 249, r: 19, g: 21, b: 22 },
  { x: 215, y: 255, r: 217, g: 205, b: 195 },
  { x: 344, y: 256, r: 121, g: 205, b: 12 },
  { x: 354, y: 249, r: 155, g: 155, b: 155 },
  { x: 277, y: 140, r: 88, g: 86, b: 82 },
  { x: 285, y: 142, r: 217, g: 209, b: 199 },
  { x: 258, y: 98, r: 60, g: 70, b: 104 },
  { x: 358, y: 140, r: 46, g: 46, b: 46 },
];

pageCookieKingdomIsNotResponding = [
  { x: 399, y: 209, r: 238, g: 238, b: 238 },
  { x: 182, y: 167, r: 238, g: 238, b: 238 },
  { x: 359, y: 184, r: 238, g: 238, b: 238 },
  { x: 281, y: 211, r: 238, g: 238, b: 238 },
  { x: 280, y: 186, r: 162, g: 162, b: 162 },
  { x: 214, y: 157, r: 227, g: 227, b: 227 },
  { x: 242, y: 157, r: 31, g: 31, b: 31 },
  { x: 393, y: 217, r: 142, g: 202, b: 197 },
];

pageReloginOrNetworkError = [
  { x: 297, y: 241, r: 121, g: 207, b: 12 },
  { x: 429, y: 101, r: 60, g: 70, b: 105 },
  { x: 432, y: 137, r: 243, g: 233, b: 223 },
  { x: 427, y: 252, r: 219, g: 207, b: 199 },
  { x: 334, y: 242, r: 121, g: 207, b: 12 },
  { x: 306, y: 241, r: 121, g: 207, b: 12 },
  { x: 303, y: 241, r: 121, g: 207, b: 12 },
  { x: 212, y: 244, r: 219, g: 207, b: 199 },
];

pageCanGotoKingdom = [
  { x: 601, y: 322, r: 187, g: 22, b: 31 },
  { x: 606, y: 326, r: 235, g: 191, b: 113 },
  { x: 603, y: 333, r: 87, g: 46, b: 54 },
  { x: 621, y: 310, r: 56, g: 92, b: 134 },
  { x: 540, y: 328, r: 220, g: 149, b: 73 },
  { x: 490, y: 322, r: 134, g: 18, b: 10 },
  { x: 442, y: 318, r: 146, g: 80, b: 69 },
];

var anErrorHasOccuredMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 83,
  targetColorThreashold: 5,
};

var theNetworkIsUnstableMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 51,
  targetColorThreashold: 5,
};

var anUnknownErrorHasOccurMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 79,
  targetColorThreashold: 3,
};

var theReloginIntoAnotherDeviceMessageScreen = {
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 74,
  targetColorThreashold: 5,
};

function pnt(x, y) {
  return { x: x, y: y };
}

function rect(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
  };
}

function rgb(r, g, b) {
  return { r: r, g: g, b: b };
}

function qTap(page, sleepTime) {
  if (sleepTime == undefined) {
    sleepTime = 0;
  }
  if (Array.isArray(page)) {
    page = page[0];
  }
  // tap(page.x, page.y, sleepTime);
  if (page.x != undefined && page.y != undefined) {
    tapDown(page.x, page.y, 10);
    sleep(sleepTime);
    tapUp(page.x, page.y, 10);
    sleep(sleepTime);
  }
}

function tapRandom(x1, y1, x2, y2, sleepTime) {
  var x = x1 + Math.random() * (x2 - x1);
  var y = y1 + Math.random() * (y2 - y1);
  console.log('tap: ', parseInt(x, 10), parseInt(y, 10));
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
    console.log('image size is incorrect, restart CookieKingdom wait 20s');
    checkAndRestartApp();
    img = getScreenshot();
  } else if (whSize.height !== 360 || whSize.width !== 640) {
    console.log('Reboot nox as screen size incorrect: ', whSize.height, whSize.width, ' (h/w)');
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

function waitUntilSeePage(page, secsToWait, tappingPage, earlyQuitPage) {
  console.log('waiting for page with 1st pnt: ', JSON.stringify(page[0]), secsToWait, ' secs');
  if (secsToWait === undefined) {
    secsToWait = 5;
  }

  for (var i = 0; i < secsToWait; i++) {
    if (!checkIsPage(page)) {
      if (tappingPage != undefined) {
        if ((tappingPage.x, tappingPage.y, tappingPage.r, tappingPage.g, tappingPage.b && checkIsPage(tappingPage))) {
          qTap(tappingPage);
        } else {
          qTap(tappingPage);
        }
      }
      if (earlyQuitPage != undefined && checkIsPage(earlyQuitPage)) {
        console.log('waitUntilSeePage but found earlyQuitPage, return false');
        return false;
      }
      sleep(1000);
      continue;
    } else {
      console.log('found page in ', i, ' secs');
      return true;
    }
  }
  console.log('wait ', secsToWait, ' secs but did not find the page');
  return false;
}

function isMessageWindowWithDiamond() {
  pageIsDialog = [
    { x: 412, y: 106, r: 60, g: 70, b: 105 },
    { x: 415, y: 139, r: 243, g: 233, b: 223 },
    { x: 410, y: 250, r: 219, g: 207, b: 199 },
  ];
  if (!checkIsPage(pageIsDialog)) {
    return false;
  }

  var dialogDiamond = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAKAAsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDS/ao8YeBf2lr7S5rf4JaPaXnhDTG0+4kv1gu9ctp4pJLhjNOYcqwEiOCp8pgweMmJkxz3w1uf2hpPAeltp9r8O0sTAPs6+JdVvL7VVj/hE89vEscpAxhwCWXaWZ23O1/9oSCNv2zvghamNfs2uLrMeoxY/d6gttarNbLMvSQQyu7xhs7GdmXBJNe+V+B+NHi/gsw4H4cy/C5Nh6N6cql7OajyynRcIJ2lGMnHnacpfZjrycz/AJp4fyetg8wxeJr15VXOSSUrpLRS+FPkvZpXjCOzfVo//9k='
  );
  var img = getScreenshot();

  var foundResults = findImages(img, dialogDiamond, 0.92, 5, true);
  releaseImage(img);
  releaseImage(dialogDiamond);

  if (foundResults.length > 0) {
    console.log('Found dialog diamond icon at: ', JSON.stringify(foundResults));
    return true;
  }
  return false;
}

function checkScreenMessage(messageScreen, pageMessageWindow) {
  if (pageMessageWindow === undefined) {
    pageMessageWindow = [
      { x: 424, y: 101, r: 57, g: 69, b: 107 },
      { x: 431, y: 128, r: 243, g: 233, b: 223 },
      { x: 429, y: 244, r: 219, g: 207, b: 199 },
    ];
  }
  if (!checkIsPage(pageMessageWindow)) {
    return false;
  }

  var img = getScreenshot();
  var croppedImage = cropImage(img, messageScreen.x, messageScreen.y, messageScreen.width, messageScreen.height);

  var whSize = getImageSize(croppedImage);

  var cnt = 0;
  for (var i = 0; i < whSize.width; i++) {
    if (isSameColor(getImageColor(croppedImage, i, messageScreen.targetY), messageScreen.lookingForColor)) {
      cnt++;
    }
  }
  // console.log('>> ', cnt, messageScreen.targetColorCount)
  return Math.abs(messageScreen.targetColorCount - cnt) < messageScreen.targetColorThreashold ? true : false;
}

function handleToolShopShovels() {
  pageToolShop = [
    { x: 420, y: 191, r: 178, g: 16, b: 13 },
    { x: 414, y: 75, r: 135, g: 143, b: 170 },
    { x: 413, y: 84, r: 183, g: 190, b: 211 },
  ];
  if (checkIsPage(pageToolShop)) {
    console.log('Is tool shop, check adding shovel');
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
      { x: 409, y: 297, r: 70, g: 98, b: 146 },
    ];
    var shovelStock = ocrProductStorage(goodsLocation['shovel']);
    console.log('Shovel enable: ' + checkIsPage(pageShovelEnabled) + ' , stock: ' + shovelStock);

    if (shovelStock == -1) {
      console.log('ocr failed, skip this shovel check');
    }

    if (checkIsPage(pageShovelEnabled)) {
      if (shovelStock < 10) {
        console.log('Shovel < 10, add 2');
        qTap(pageShovelEnabled);
        sleep(config.sleepAnimate);
        qTap(pageShovelEnabled);
        sleep(config.sleepAnimate);
      } else if (shovelStock < config.goodsTarget) {
        console.log('10 < ', shovelStock, ' < ', config.goodsTarget, ', add 2');
        qTap(pageShovelEnabled);
        sleep(config.sleepAnimate);
        qTap(pageShovelEnabled);
        sleep(config.sleepAnimate);
      } else {
        console.log('shovels > ', config.goodsTarget, ', skipping');
        return;
      }
      handleNotEnoughStock();
    } else {
      console.log('shovel not enabled, swipe to top');
      SwipeProductionMenuToTop();
    }
  } else {
    // console.log('Not in tool shop, skip shovel check');
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
  1: rect(432, 101, 22, 12),
  2: rect(432, 209, 22, 12),
  3: rect(432, 315, 22, 12),
  4: rect(432, 106, 22, 12),
  5: rect(432, 213, 22, 12),
  6: rect(432, 319, 22, 12),
  shovel: rect(432, 317, 22, 16),
};

function ocrResultToInt(results) {
  if (results.length == 0) {
    return -1;
  }

  var digit_width = 4;
  count = '';
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

  // console.log('about to load ocr image for: ', JSON.stringify(rect));
  results = [];
  for (var i in bNumbers) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    var foundResults = findImages(croppedImage, bNumbers[i]['img'], 0.9, 10, true);
    for (var j in foundResults) {
      foundResults[j]['target'] = bNumbers[i].char;
      results.push(foundResults[j]);
    }
  }
  results.sort(compare);
  // console.log('=> ', JSON.stringify(results));

  releaseImage(croppedImage);

  count = ocrResultToInt(results);
  return count;
}

function ocrMaterialStorage() {
  var img = getScreenshot();
  var croppedImage = cropImage(img, 350, 10, 30, 18);
  // var croppedImage = cropImage(img, 430, 311, 23, 15);
  releaseImage(img);

  // console.log('about to load ocr material images');
  results = [];
  for (var i in wNumbers) {
    // numbers[i] = bgrToGray(numbers[i], 40)
    var foundResults = findImages(croppedImage, wNumbers[i]['img'], 0.8, 10, true);
    for (var j in foundResults) {
      foundResults[j]['target'] = wNumbers[i].char;
      results.push(foundResults[j]);
    }
  }
  results.sort(compare);
  // console.log('=> ', JSON.stringify(results));

  releaseImage(croppedImage);

  count = ocrResultToInt(results);
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
  tapDown(430, 80, 40, 0);
  sleep(config.sleep);
  moveTo(430, 350, 40, 0);
  sleep(config.sleep);
  moveTo(430, 1000, 40, 0);
  sleep(config.sleep);
  tapUp(430, 1000, 40, 0);
  sleep(config.sleepAnimate * 3);
}

function handleMaterialProduction() {
  pageFirstItemEnabled = [{ x: 569, y: 119, r: 121, g: 207, b: 12 }];
  pageSecondItemEnabled = [{ x: 571, y: 223, r: 121, g: 207, b: 12 }];
  pageThirdItemEnabled = [{ x: 568, y: 329, r: 121, g: 207, b: 14 }];

  if (checkIsPage(pageWoodFarm)) {
    console.log('wood farm, add more');
    qTap(pageBeanFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageBeanFarm)) {
    console.log('bean farm, add more');
    qTap(pageBeanFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageSugarFarm)) {
    console.log('sugar farm, add more');
    qTap(pageSugarFarm, 800);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pagePowderFarm)) {
    console.log('Powder farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
    } else {
      qTap(pagePowderFarm, 800);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (checkIsPage(pageBarryFarm)) {
    console.log('Barry farm, add more');
    if (checkIsPage(pageSecondItemEnabled)) {
      qTap(pageSecondItemEnabled, 800);
      sleep(config.sleepAnimate);
      qTap(pageSecondItemEnabled);
      sleep(config.sleepAnimate);
    } else {
      qTap(pageBarryFarm, 800);
      sleep(config.sleepAnimate);
      qTap(pageBarryFarm);
      sleep(config.sleepAnimate);
    }
    return true;
  } else if (checkIsPage(pageMilkFarm)) {
    console.log('Milk farm, add more');
    qTap(pageMilkFarm, 800);
    sleep(config.sleepAnimate);
    qTap(pageMilkFarm);
    sleep(config.sleepAnimate);
    return true;
  } else if (checkIsPage(pageCottomFarm)) {
    console.log('Cottom farm, add more');
    qTap(pageCottomFarm, 800);
    sleep(config.sleepAnimate);
    qTap(pageCottomFarm);
    sleep(config.sleepAnimate);
    return true;
  }
}

function makeGoodsToTarget(target, orderAmount) {
  var itemsAdd = 0;
  pageFirstItemEnabled = [{ x: 587, y: 122, r: 121, g: 207, b: 12 }];
  pageSecondItemEnabled = [{ x: 587, y: 230, r: 121, g: 207, b: 12 }];
  pageThirdItemEnabled = [{ x: 587, y: 332, r: 121, g: 207, b: 12 }];

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
  var goodsOneStock = ocrProductStorage(goodsLocation[1]);
  var goodsTwoStock = ocrProductStorage(goodsLocation[2]);
  var goodsThreeStock = ocrProductStorage(goodsLocation[3]);
  console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock, 'target: ', target);
  if (goodsOneStock === -1 || goodsTwoStock === -1 || goodsThreeStock === -1) {
    console.log('OCR count failed, skip this round');
    return -1;
  }

  if (goodsOneStock < target) {
    console.log('add 1st item from ' + goodsOneStock + ' to > ', target);
    for (i = 0; i < orderAmount; i++) {
      qTap(pageFirstItemEnabled);
      sleep(config.sleepAnimate * 3);
      if (!handleNotEnoughStock()) {
        itemsAdd++;
      }

      // Add check if there are no worker
    }
  }
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 1st item filled the queue');
    return itemsAdd;
  }

  if (!checkIsPage(pageSecondItemEnabled)) {
    console.log('2nd item is not enabled');
    return itemsAdd;
  } else if (goodsTwoStock < target) {
    console.log('add 2nd item from ' + goodsTwoStock + ' to > ', target);
    for (i = 0; i < orderAmount; i++) {
      qTap(pageSecondItemEnabled);
      sleep(config.sleepAnimate);
      if (!handleNotEnoughStock()) {
        itemsAdd++;
      }
    }
  }
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 2nd item filled the queue');
    return itemsAdd;
  }

  if (!checkIsPage(pageThirdItemEnabled)) {
    console.log('3rd item is not enabled');
    return itemsAdd;
  } else if (goodsThreeStock < target) {
    console.log('add 3rd item from ' + goodsThreeStock + ' to > ', target);
    for (i = 0; i < orderAmount; i++) {
      qTap(pageThirdItemEnabled);
      sleep(config.sleepAnimate);
      if (!handleNotEnoughStock()) {
        itemsAdd++;
      }
    }
  }
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 3rd item filled the queue');
    return itemsAdd;
  }

  // === tool shop only ===
  handleToolShopShovels();
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production shovel filled the queue');
    return itemsAdd;
  }
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

  var goodsFourStock = ocrProductStorage(goodsLocation[4]);
  var goodsFiveStock = ocrProductStorage(goodsLocation[5]);
  var goodsSixStock = ocrProductStorage(goodsLocation[6]);
  console.log('In stock: ', goodsFourStock, goodsFiveStock, goodsSixStock, ' target: ', target);
  if (goodsFourStock === -1 || goodsFiveStock === -1 || goodsSixStock === -1) {
    console.log('2nd OCR count failed, skip this round');
    SwipeProductionMenuToTop();
    return itemsAdd;
  }

  if (!checkIsPage(pageFirstItemEnabled)) {
    console.log('4th item is not enabled');
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
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 4td item filled the queue');
    return itemsAdd;
  }

  if (!checkIsPage(pageSecondItemEnabled)) {
    console.log('5th item is not enabled');
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
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 5th item filled the queue');
    return itemsAdd;
  }

  if (!checkIsPage(pageThirdItemEnabled)) {
    console.log('6th item is not enabled');
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
  if (countProductionSlotAvailable() == 0) {
    console.log('Early stop production 6th item filled the queue');
    return itemsAdd;
  }

  SwipeProductionMenuToTop();
  return itemsAdd;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function makeGoodsToTargetV2(target) {
  // TODO: recognize building to reduce drop order time
  var itemsAdd = 0;
  pageFirstItemEnabled = [{ x: 587, y: 122, r: 121, g: 207, b: 12 }];
  pageSecondItemEnabled = [{ x: 587, y: 230, r: 121, g: 207, b: 12 }];
  pageThirdItemEnabled = [{ x: 587, y: 332, r: 121, g: 207, b: 12 }];

  var goodsOneStock = ocrProductStorage(goodsLocation[1]);
  var goodsTwoStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[2]) : -1;
  var goodsThreeStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[3]) : -1;
  // console.log('In stock: ', goodsOneStock, goodsTwoStock, goodsThreeStock, 'target: ', target);
  if (goodsOneStock === -1) {
    console.log('OCR count failed, skip this round');
    return -1;
  }

  // === tool shop only ===
  handleToolShopShovels();
  var availableSlots = countProductionSlotAvailable();
  if (availableSlots == 0) {
    console.log('Early stop production shovel filled the queue');
    return itemsAdd;
  }
  // end of tool shop ===

  var stocks = [];
  if (!checkIsPage(pageThirdItemEnabled)) {
    [goodsOneStock, goodsTwoStock].forEach(function (value, i) {
      stocks.push({
        id: i,
        value: value,
      });
    });
  } else {
    SwipeProductionMenuToBottom();
    var goodsFourStock = checkIsPage(pageFirstItemEnabled) ? ocrProductStorage(goodsLocation[4]) : -1;
    var goodsFiveStock = checkIsPage(pageSecondItemEnabled) ? ocrProductStorage(goodsLocation[5]) : -1;
    var goodsSixStock = checkIsPage(pageThirdItemEnabled) ? ocrProductStorage(goodsLocation[6]) : -1;
    SwipeProductionMenuToTop();

    [goodsOneStock, goodsTwoStock, goodsThreeStock, goodsFourStock, goodsFiveStock, goodsSixStock].forEach(function (
      value,
      i
    ) {
      stocks.push({
        id: i,
        value: value,
      });
    });
  }

  // console.log('unsorted stocks: ', JSON.stringify(stocks));
  stocks.sort(dynamicSort('value'));
  console.log('stocks: ', JSON.stringify(stocks));
  pageLockedGood = [
    { x: 351, y: 244, r: 121, g: 207, b: 12 },
    { x: 305, y: 244, r: 121, g: 207, b: 12 },
    { x: 425, y: 244, r: 219, g: 207, b: 199 },
    { x: 425, y: 105, r: 60, g: 70, b: 105 },
    { x: 417, y: 297, r: 235, g: 219, b: 207 },
    { x: 381, y: 316, r: 237, g: 237, b: 229 },
  ];

  for (var id in stocks) {
    var stock = stocks[id];

    if (stock['value'] === -1) {
      continue;
    } else if (stock['value'] >= target) {
      continue;
    } else if (stock['id'] == 0) {
      console.log('add 1st item from ' + goodsOneStock + ' to > ', target);
      SwipeProductionMenuToTop();
      qTap(pageFirstItemEnabled, 800);
    } else if (stock['id'] == 1) {
      console.log('add 2nd item from ' + goodsTwoStock + ' to > ', target);
      SwipeProductionMenuToTop();
      qTap(pageSecondItemEnabled, 800);
    } else if (stock['id'] == 2) {
      console.log('add 3rd item from ' + goodsThreeStock + ' to > ', target);
      SwipeProductionMenuToTop();
      qTap(pageThirdItemEnabled, 800);
    } else if (stock['id'] == 3) {
      console.log('add 4th item from ' + goodsFourStock + ' to > ', target);
      SwipeProductionMenuToBottom();
      qTap(pageFirstItemEnabled, 800);
    } else if (stock['id'] == 4) {
      console.log('add 5th item from ' + goodsFiveStock + ' to > ', target);
      SwipeProductionMenuToBottom();
      qTap(pageSecondItemEnabled, 800);
    } else if (stock['id'] == 5) {
      console.log('add 6th item from ' + goodsSixStock + ' to > ', target);
      SwipeProductionMenuToBottom();
      qTap(pageThirdItemEnabled, 800);
    }

    for (var timer = 0; timer < 4; timer++) {
      var latestCount = countProductionSlotAvailable();
      if (handleNotEnoughStock()) {
        sleep(800);
        break;
      } else if (checkIsPage(pageLockedGood)) {
        qTap(pageLockedGood);
        break;
      } else if (checkIsPage(pageInProduction) && availableSlots != latestCount) {
        availableSlots = latestCount;
        break;
      }
      sleep(1000);
    }

    if (countProductionSlotAvailable() == 0) {
      console.log('No slots, stop at: ', stock['id']);
      return stock['id'];
    }

    // Add check if there are no worker
  }

  return -1;
}

function countProductionSlotAvailable() {
  // flower ring will misunderstood
  var emptySlots = 0;
  if (identifyPointColor(pnt(50, 269), { r: 146, g: 88, b: 52 }) > 0.98) {
    emptySlots++;
  }
  if (identifyPointColor(pnt(50, 219), { r: 146, g: 88, b: 52 }) > 0.98) {
    emptySlots++;
  }
  if (identifyPointColor(pnt(50, 170), { r: 146, g: 88, b: 52 }) > 0.98) {
    emptySlots++;
  }
  if (identifyPointColor(pnt(50, 120), { r: 146, g: 88, b: 52 }) > 0.98) {
    emptySlots++;
  }
  if (identifyPointColor(pnt(50, 69), { r: 146, g: 88, b: 52 }) > 0.98) {
    emptySlots++;
  }

  console.log('countProductionSlotAvailable: ', emptySlots);
  return emptySlots;
}

function JobScheduling() {
  // isNoThirdFigure = checkIsPage(pageBaseProductNoThirdFigure);
  // console.log('if stock < 99: ', isNoThirdFigure)
  // if (!isNoThirdFigure) {
  //     console.log('> 99, no need to add more')
  //     return true;
  // }

  if (!checkIsPage(pageInProduction)) {
    return false;
  }

  pageProducing = [
    { x: 81, y: 67, r: 166, g: 104, b: 65 },
    { x: 62, y: 90, r: 113, g: 221, b: 0 },
    { x: 20, y: 68, r: 166, g: 104, b: 65 },
  ];
  if (!checkIsPage(pageProducing)) {
    qTap(pnt(51, 66));
    sleep(config.sleepAnimate * 3);
  }
  var emptySlots = countProductionSlotAvailable();
  if (emptySlots === 0) {
    console.log('No available production slot, skip this production');
    return true;
  }
  // console.log('emptySlots: ', emptySlots);

  var materialCount = ocrMaterialStorage();
  if (materialCount == -1) {
    console.log('This is not a material production');
  } else if (materialCount >= config.materialsTarget) {
    console.log('Skip as stock enough: ', materialCount);
    return true;
  } else {
    console.log('Material stock: ', materialCount, ', target: ', config.materialsTarget);
    handleMaterialProduction();
    return true;
  }

  // TODO: if no enough at first time, skip second check
  // TODO: count items produced
  // TODO: record not enough resources (keep list of all items)

  if (config.productionFocusOnMin) {
    makeGoodsToTargetV2(config.goodsTarget);
    return true;
  } else {
    var itemsAdd = makeGoodsToTarget(10, 2);
    console.log('add: ', itemsAdd, ' items');
    if (itemsAdd == -1) {
      return false;
    } else if (itemsAdd < emptySlots) {
      itemsAdd = itemsAdd + makeGoodsToTarget(config.goodsTarget, emptySlots - itemsAdd > 3 ? 2 : 1);
      if (itemsAdd == -1) {
        return false;
      }
    }
  }
  return true;
}

function handleNotEnoughStock() {
  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }

  pageNotEnoughStock = [
    { x: 428, y: 98, r: 56, g: 167, b: 231 },
    { x: 345, y: 104, r: 60, g: 70, b: 105 },
    { x: 370, y: 176, r: 243, g: 233, b: 223 },
    { x: 349, y: 247, r: 121, g: 207, b: 12 },
  ];
  if (checkIsPage(pageNotEnoughStock)) {
    console.log('quiting not enougth stock');
    qTap(pageNotEnoughStock);
    sleep(config.sleepAnimate);

    return waitUntilSeePage(pageInProduction, 6);
  }

  pageTwoItemNotEnoughStock = [
    { x: 444, y: 98, r: 56, g: 166, b: 231 },
    { x: 375, y: 105, r: 60, g: 70, b: 105 },
    { x: 420, y: 203, r: 243, g: 233, b: 223 },
    { x: 416, y: 246, r: 219, g: 207, b: 199 },
  ];
  if (checkIsPage(pageTwoItemNotEnoughStock)) {
    console.log('quiting not enougth stock 2');
    qTap(pageTwoItemNotEnoughStock);
    sleep(config.sleep);
    return waitUntilSeePage(pageInProduction, 6);
  }

  return false;
}

function handleRelogin() {
  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    return false;
  }

  if (checkScreenMessage(theReloginIntoAnotherDeviceMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theReloginIntoAnotherDeviceMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
    for (var i = 0; i < config.sleepWhenDoubleLoginInMinutes; i++) {
      sleep(60 * 1000);
      sendEvent('running', '');
      console.log('Detect relogin, wait: ', i, '/', config.sleepWhenDoubleLoginInMinutes, 'mins to restart...');
    }
    return true;
  }
  if (checkIsPage(pageReloginOrNetworkError)) {
    console.log('quiting pageReloginOrNetworkError');
    qTap(pageReloginOrNetworkError);
    for (var i = 0; i < config.sleepWhenDoubleLoginInMinutes; i++) {
      sleep(60 * 1000);
      sendEvent('running', '');
      console.log('Detect relogin, wait: ', i, '/', config.sleepWhenDoubleLoginInMinutes, 'mins to restart...');
    }
    return true;
  }
}

function handleWelcomePage() {
  pageWelcome = [
    { x: 25, y: 288, r: 225, g: 163, b: 42 },
    { x: 41, y: 255, r: 243, g: 60, b: 56 },
    { x: 131, y: 255, r: 253, g: 217, b: 52 },
    { x: 177, y: 257, r: 181, g: 48, b: 60 },
    { x: 204, y: 282, r: 225, g: 163, b: 40 },
    { x: 67, y: 324, r: 103, g: 19, b: 36 },
    { x: 160, y: 326, r: 104, g: 21, b: 38 },
  ];

  // TODO: Need to handle login event

  pageAnnouncement = [
    { x: 610, y: 19, r: 56, g: 167, b: 231 },
    { x: 619, y: 19, r: 255, g: 255, b: 255 },
    { x: 628, y: 18, r: 56, g: 167, b: 231 },
    { x: 59, y: 219, r: 54, g: 64, b: 87 },
    { x: 71, y: 317, r: 54, g: 64, b: 87 },
    { x: 19, y: 114, r: 63, g: 0, b: 9 },
    { x: 25, y: 321, r: 75, g: 75, b: 75 },
  ];
  pageProductionList = [
    { x: 315, y: 12, r: 204, g: 8, b: 40 },
    { x: 420, y: 9, r: 240, g: 172, b: 2 },
    { x: 526, y: 11, r: 0, g: 193, b: 255 },
    { x: 71, y: 303, r: 158, g: 125, b: 97 },
    { x: 133, y: 338, r: 154, g: 96, b: 69 },
    { x: 497, y: 302, r: 158, g: 126, b: 97 },
    { x: 627, y: 302, r: 160, g: 129, b: 101 },
  ];

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
    { x: 610, y: 19, r: 56, g: 167, b: 231 },
    { x: 619, y: 19, r: 255, g: 255, b: 255 },
    { x: 628, y: 18, r: 56, g: 167, b: 231 },
    { x: 59, y: 219, r: 54, g: 64, b: 87 },
    { x: 71, y: 317, r: 54, g: 64, b: 87 },
    { x: 19, y: 114, r: 63, g: 0, b: 9 },
    { x: 25, y: 321, r: 75, g: 75, b: 75 },
  ];

  if (checkIsPage(pageAnnouncement)) {
    console.log('found announcement page, leaving');
    qTap(pageAnnouncement);
    sleep(config.sleepAnimate);
    return true;
  }
  return false;
}

function findAndTapCandy() {
  var candy = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAPABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9CPgpZeGfHGtt4g8dw6XrVp4svItWvFk0e1ure0VIQlpAjgzl4UU5wHdGeWZ1zvrpPid8LfDHxC+KWg2MNxq2jzeI7praa33QojBLGedJYklwyMyW8eQnmKVBbyxl5VyJrTTfDfwg0seD107/AIR9ri0tLVdQvJLR7C2WJ0ktj5VnIzLELeMo7tLI7TTbnCqgbe03wXrHhm8m8YfEBY5Nd8P3yy6Jb6drT6hb2eLSa087zZLW3ZpZI7uaNlkR41RIigVwzHxeIsy4ex+Vf7PUT5YWhT05k2rR92+lnZtptpLq9H+V5PwXxLgM3UMRacJ1FOdSSd3b44363slGKio+9JWUWrf/2Q=='
  );
  var img = getScreenshot();

  var foundResults = findImages(img, candy, 0.93, 5, true);
  releaseImage(img);
  releaseImage(candy);

  // console.log('candies > ', JSON.stringify(foundResults));
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
    artisan:
      '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',
    bakery:
      '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',
    barry:
      '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',
    beanshop:
      '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',
    carpentry:
      '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',
    cottom:
      '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAzAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0B9SZTnP41n6tdG/tpIZCxjkUodrFTgjBwRgj6jmobCO41vVLezs42uLq6kEUMacs7E4AH1p3jjwV4l8Kau2lyaPcf2obmOzCkF4YpXXcDJIgYKqpl2PJwDjJwD+C4HJ8TiWvYU3LVLRaXfnsj8tynKMwxs19Spyk7pXSeje1309XZLqz5N8ZeOfFXhjxvcWOpSXGrNoeqJeEGcRLdSIRJHM6Dje6lWzyRvI65r6Cm1G58T6emoaf4Y8Zahp8kYnWe2sHWC+jdP8Anm5XzkZDj7pyOAaf8X/2Ebz4jeIdFudD1K4u9QmiaLVJphKi3HKmMwLGNgC5kAQuMgrlicsfftD+EmufBr4Qabb6h/oOi6LZR2ZuLq5SG4VEXBc7uFVVHbO1RnJxX67kvDioYpe2qckorR03o27Np26XVtUl3utT+ks94dw+Lo0sTmylOvTilalJXbdlJxvZ+7q0k02rpJtpHguk/H2+8KPY6he3SeCfC/gm9ivNevdaguILHRzcbbKMywheGb7R90MoZQEM0Ycsvuf7YfxDg8E+BYdcm1LxALHyYtIvNFvNUm1C88VzPM8sRsF2bYdaFxI8lsLaOKGVhHbNGqLbTWet4Z8a/Af4l/BHxN8J4/Eceix/EjT7zQr5jdRx392b2JreSSOVzIGmYSfK0m8s2M7ulaXgX9k74naH4z8P658RPi/ovjHT/CUkl7Y2Gj+CI9Bkubt7aW0D3E32q4MkQiuZ28tFjJk8pt+1Cj+BxjgeKswzzL8VleKVOhGX75e5dpWta0XzXTknG6WzWquvjq3DeKyzE4bBZNKVOhGTcuazb5pXbd91Z2suiV9dTj/i1ovxB8EXEl1408R2tn4ftU32N7pF2dMjvzwHublhIJhcHcNyE+UN/wApkYkrx/xN+LviK7+GOo6beamdW8M6on+k3ixLJd2UWAM7lwJIRhSSQZFwSWdSQPs3wrpFhqmozXM1uWvobcWyyljgRFmbAGcZDZOcZ5Azjp5F4pt/gN4R8X32l6tofwnmvrVm+2BtPst9mQu//SSEIiJU5Hm7d3OM819djslyaWF+rVKMY2+1pFqTe6f3bvV9LH6BgsVWcquGxUIyV/c5bpqPKt31d7vS1k1bY+Sfj9puq6F4euNH1a3gs7zXLYx2U63URtLpXV0EkblgWA3ozBQxXcACxrwPwv4a8WeBvF/2eOO+t/JSSQyQyMI2QZb5XU/xbASoIJHBHav100/WvB3wt8E3K6d4f0nStBmw0tvp1pDHDcGTC8ooVG3AgZPUV8mwfAnR/FOsakvgvW7B7ewvZLUXLX0c1l9nYCa2VGDu7PHHMsbtggvHJk8ED4viHAYrLcNHFTmpXdm7W13vo38/Nrvp4mb1s9oUZVcrhGXTlmt9tU07Nq+ztp1b3t/sxeJtI8MfGPT9S1nUI7C1sY5ZVeRSytJsKqpIBx1zn2x3r079pj406PpPhSLTY5I7/UvEDD7MsTpJ5a7kbzjg5wudwbHVc18wefiqdlfiPx5brtB3adPIWI+6FlgXA+vmD/vmq4VzDlksDy78zTv15b7fLyPz3wxzxQxMMpdP43KSlfqot6qzv8NtGv8AP9JPhVYw6F8O9It4dqxrbqy4PY8/pnH4V8Z/8FhPEviTRPDct3D9oOi2djLJFGgIjluVUNEZDhsoGycFdgZAW6Lj6d/Zl8aQ+L/g1puxmaaxjNrKGf5iV6HjkA9vpXWa/Z22u2ix32lQ6hHCFmaOZVkXcMnChuGYYyM4HQ5zX3zoe1oOktOZW/L89n5Nn6hTrSoYipzrV3Xmr9V/WzPw+/YM+CXxa/ag+N+m+IPBNxrGoaPot/EmpXtxqrf2TpkqKHIG/iZiNoARSQW3HGQa/b3xh4hWT/R1YBYTmU7uhHb8O9c/4006w1LSZNH/ALNSysmcTbY0ERY9mG3pnGPXHBx0r5++N/xyh+GHiW6+HHhbT7Vtc1LSRqTyXt6/7qOczwq8MXL3DKbdyyBowo2kMcnGjhgstwzxeIk0la+l1bps3rrtb1ZWDwuJniY2jFwte/NaXM+nLZq1tb89021Yz/H/AO1y3xJ8fzeC9HmvtJ0l4CNTu7a4Ed7dxSFkjSHvGCyOXdTuVQoBBfI9K+Dv7E+g+GvDdnNrguY1KhbPTbeHY0aAEqnlqGOdozsUZUKemCB88fszfsoeIr340aH4m23WsQ2t152pG5hSGEjZt2xj+FRnOxizEEncSOfvzwnqh1jUZrpZrO6a1ea322xVpIxvUFGOSytlGBA25aM5/h2/mtHDR4lzOpiZNuhH4U9NNvm3bz31PZzXGVMBT9lR92T1k09fJX1t/wADQ8F+M/7KyyafFp/gNb630vVZTDq+jecws1bHmBnif/VM29mcHaJN67wxKEctqCaL+yB8UdJ0vXdct7P/AISPS3klu2ic25ljmXYjNxgANIVZsD52HU5P0Z4s8RR6J4g0tbe4s9LWS6FosFyzRy6gCq4jihxmTAA+fjywrnJRXDfLv/BS7QzrXxM8Nsl1dWU0ekzIskWGVw0o3I6MCjqcDKkH8OtcXEnDtPDVY+1k5Ra91X+Fa6JdNde3keNU4keGwLqYv+GleTSvJ+8lq+tm+mtu54WZt3c1xnxX+JNj4DggvLq6/s+5hSaezMpCx6msSqZrdWz97DIQpxl1UjdsYD1nw18A7g+GpDqmrSw+LoQVuFkUwWFpJhP3Hlhj8rEZEjFpOQyExttb5H/bl+HfjDU45hepp1vpnh9TDDZSSuLrzLmVVL/6vYytIyhWD4KrxzkCMhnB4yMozs4vR+f6p7eh+WZPwXicnxlPFY+fLonCUHdKo5JKMtOqbXZ3smfaH7Df7Yem6Tqduwu1m0DXgu5gwHkSEfKxB5HXBB6elfWU/wAR7Q641u11C13I+2DOVDoxLK4xxIqq69xtMZ5zmvwNtPj/ADfBjxfp1pb/AGxW1Ly1jWBVZJWLlAHVmAwMDBHIycYr7M+B3/BUHT7PwW2i+M/D9xq7wfurZomTajeokeRWjXPGMnGPvY6ftVGthKkFze6+q6fJ/ofskq2CxcuZvlnpzJ6J+af6PdH6Ma74xvd9tpuoT2Zvp4rm4N1GwMdu5kAjhUEA42EE5ycrz2J/J3UNZ1Lxl+1VY6rdXM1xNC2mmSRpCzgfa7gk5PPqa91b/gpDeeJNCjs7f4dW9ra6aBcia31VmliiyFZxuiG/PAIyexJGM181a18QU8I/GOTVLrT9S0fTdRlF1ZTXVsVh8vzBJCPMXMeNshyQxCnIJB4rxeLa2GxOT1aWGmpS0dlvo1ey9NdNjvwOHw+GpU4U5aR01bb8nd6u/W7bP278CXq2/gXRo41CxrYwkBeBygJP49a4j40aZ4r0+21C/wDCuraXY2+ohX1K2u4kw0qhUW4jkOMSbFjXDsUxEmFJzu8H+M//AAVQ8EfBHwjpmm6GJPF+vfZooVhsP3lurYVQDKDt57AHPI4r4n/ab/bV8Z/GG6hXxtr2paLpMsZeLQdHCxzXSZ/1k2WxGvC/IWO4q/XkD87yiWMp8tXDe7otXs/Rbv5K3do8elgZwxEq1RpK70sm3r22Xq9eqTPrHWf+Cgdv8PPF9pDJqt58TfiFFCNL0/SNGPmRpJIygyTbTsMzkBRtxtyQqfOawviL8SU8d+JbuXxv4/8ACun+JtPZLW40u5ma3tdJlZJHWxe62G2S8kFvcbYjK29ofvLuAr47+CHiCx0zQrfxJ4JurjStS8P306NPPAkkys8MsDbg2ULeTcEqRkI+1hnbg/UX/BPD4Z6B8a/hA2saxp97utYotHws8sEckp04ieYiNlLysdQukEjFinmuY9jPIW5+JMywuDoyx+ZRnVktLJqKTekbdEr66ttK7blseZn+BnmdSGBSUaU022m7+607Oy2TtorKTbdrxTPpbxmcaxoeof8AL5dmO1mkH/LWMw3Mu1h0OHQEHGVy2MBmB+df23/BWl6p+zXp19Naq13bmzMcgdlK/MkmOCAQXVWIPBKgnJAoor5bKZNYmi13X5n09OKeHknt/wAA/NPXtDtLnxXpF5JbxyXEblEdudo8tm47DnnNemeHIl0/QLDyUSNmgWXeFG8M4DthuoBZicZxzRRX6/j9aSufP4bS7XkaEEslh5lxDJLHNJbyQuQ5wyuCrAjOOQSM4zXunxC8R3nhb9laLUbGVYby202yeNzGsgBJiB+VgVPU9RRRXh1Yp1KSf83+R3Sk1Sk0+hoSadan4MafqC2dnDeX1vYT3EsNukRldniLE7QBySa+Bf2kPGGpn4zA/bJfm1e9jOMDKRSGKNfoEGMd+pyeaKK7MjiniJ38/wBTnzKclhFJPX3fzR7d+ymd/gHxgp+6L8tj38pT/SvRvgZ8d/GXw08A2dnofiTV9Ps5v7WBtkuC0KbL1gpRGyqHDHJUAknJJNFFeRnlGFRSjUSa5lur/ZZz5lUlGthFF2vOSfmvZVHr80n6pM//2Q==',
    flower:
      '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',
    powder:
      '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',
    sugar:
      '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',
    wood: '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',
    toolShop:
      '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',
    // diner: "",
    // jammery: "",
  };

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
      house.x += 20;
      house.y += 20;
      qTap(house);
      sleep(config.sleepAnimate * 3);

      if (!waitUntilSeePage(pageInProduction, 2)) {
        qTap(house); // prevent when there are sugar cube to collect
      }

      if (waitUntilSeePage(pageInProduction, 8)) {
        console.log('Found production house successfully: ', key);
        return true;
      } else {
        console.log('Assume found house but failed, go back to kingdom page: ', key);
        handleTryHitBackToKingdom();
      }
    }
  }
  return false;
}

var Directions = Object.freeze({
  NE: pnt(-480, 245),
  NW: pnt(460, 255),
  SE: pnt(-460, -255),
  SW: pnt(480, -245),
  S: pnt(0, -250),
  N: pnt(0, 250),
  E: pnt(-460, 0),
  W: pnt(460, 0),
});
function swipeDirection(direction, finishSwipeWhenInProduction) {
  tapableArea = {
    fromPnt: pnt(165, 58),
    endPnt: pnt(566, 285),
  };

  for (var i = 0; i < 3; i++) {
    var x = tapableArea.fromPnt.x + Math.random() * (tapableArea.endPnt.x - tapableArea.fromPnt.x);
    var y = tapableArea.fromPnt.y + Math.random() * (tapableArea.endPnt.y - tapableArea.fromPnt.y);

    fromPnt = pnt(x, y);
    toPnt = pnt(x + direction.x, y + direction.y);
    if (finishSwipeWhenInProduction) {
      if (swipeFromToPoint(fromPnt, toPnt, 8, 0, pageInProduction)) {
        console.log('swip successfully');
        return true;
      } else {
        console.log('pickup house, try again');
      }
    } else {
      if (swipeFromToPoint(fromPnt, toPnt, 8, 0)) {
        console.log('swip successfully');
        return true;
      } else {
        console.log('pickup house, try again');
      }
    }
    if (swipeFromToPoint(fromPnt, toPnt, 8, 0, pageInProduction)) {
      console.log('swip successfully');
      return true;
    } else {
      console.log('pickup house, try again');
    }
  }
  handleGotoKingdomPage();
  return false;
}

function swipeFromToPoint(fromPnt, toPnt, steps, id, stopIfFoundPage) {
  id === undefined ? 0 : id;

  tap(fromPnt.x, fromPnt.y, 100, id);
  sleep(config.sleepAnimate * 3);

  if (stopIfFoundPage != undefined && checkIsPage(stopIfFoundPage)) {
    console.log('Swiping but accedential got into the desired page, return');
    return true;
  }

  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('swipe failed, try again: ', fromPnt.x, fromPnt.y);
    keycode('BACK', 100);
    return false;
  }

  steps = steps == undefined ? 4 : steps;
  step_x = (toPnt.x - fromPnt.x) / steps;
  step_y = (toPnt.y - fromPnt.y) / steps;

  tapDown(fromPnt.x, fromPnt.y, 40, 0, id);
  sleep(100);

  for (var i = 0; i < steps; i++) {
    moveTo(fromPnt.x + step_x * i, fromPnt.y + step_y * i, 40, 0, id);
    // console.log('in pnt: ', fromPnt.x + step_x * i, fromPnt.y + step_y * i)
    sleep(100);
  }

  moveTo(toPnt.x, toPnt.y, 40, 0, id);
  sleep(1500);
  tapUp(toPnt.x, toPnt.y, 40, 0, id);
  sleep(config.sleepAnimate);

  if (!checkIsPage(pageInKingdomVillage)) {
    keycode('BACK', 100);
  }
  return true;
}

function handleGotoKingdomPage() {
  console.log('trying to get to kingdom page');

  if (handleRelogin()) {
    console.log('handleGotoKingdomPage just wait for relogin screen: ', config.sleepWhenDoubleLoginInMinutes);
    return false;
  }

  if (checkIsPage(pageInKingdomVillage)) {
    console.log('already in kingdom');
    return true;
  }

  if (checkIsPage(pageInProduction)) {
    console.log('In production, hit back to kingdom page');
    keycode('BACK', 1000);
    waitUntilSeePage(pageInKingdomVillage, 8);
    return true;
  }

  if (checkIsPage(pageCanGotoKingdom)) {
    console.log('Can goto kingdom (not in village), going to kingdom and wait 3secs');
    qTap(pageCanGotoKingdom);
    sleep(config.sleepAnimate * 2);

    qTap(pnt(100, 200));
    if (waitUntilSeePage(pageInKingdomVillage, 10)) {
      return true;
    }
  }

  return handleTryHitBackToKingdom();
}

function findHouseInNotSureWhere(tryCount) {
  handleGotoKingdomPage();
  tryCount = tryCount == undefined ? 3 : tryCount;

  for (var i = 0; i < tryCount; i++) {
    handleRelogin();
    tapRandom(75, 95, 553, 285);
    sleep(config.sleepAnimate * 2);
    if (checkIsPage(pageInProduction)) {
      console.log('found production in try: ', i);
      return true;
    }
    console.log('try another random point for production');
    handleGotoKingdomPage();
  }
  return false;
}

function handleFindAndTapCandyHouse() {
  var directions = [
    Directions.S,
    Directions.S,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.E,
    Directions.N,
    Directions.W,
    Directions.W,
    Directions.W,
    Directions.W,
  ];

  if (!checkIsPage(pageInKingdomVillage)) {
    if (!handleTryHitBackToKingdom()) {
      console.log('Cannnot get to kingdom page, skip handleFindAndTapCandyHouse');
      return false;
    }
  }

  var collectCandySuccess = findAndTapCandy();

  if (collectCandySuccess && findAndTapProductionHouse()) {
    console.log('already found house using image match, start working');
    return true;
  }

  gotoCastle();

  for (var i = 0; i < directions.length; i++) {
    // TODO: this does not show properly
    console.log('going towards: ', i);
    if (swipeDirection(directions[i], true)) {
      collectCandySuccess == false ? findAndTapCandy() : collectCandySuccess;

      if (config.helpTapGreenCheck) {
        var greenChecked = getImageFromBase64(
          '/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1EQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9KvH/APwUBs78XC6hceILPw/Dff2Zcazb+G9RXw/Dcib7O0UmpiE2oInzC26basqmNtsg21c1zx3Z+GdFvNS1G8t7HT9Pge5urm4lEcNvEilnd2JwqqoJJPAANfEup/EfXPh1ZQ/B/wARtJJoGi6c9r4fgc77DXtJChHYofka5VWxdIRlmfzduyTg8HeOLqPQ7G11rxFHrGi+E7qKXw3obRzT3V3cKwaGTUJX+SeG02gwoSzyyGJpgzW++f8AhXPs+p4vFyniKlRuMU+ao1L2i700l7qb0UW3bdtNSS+Br8eYHDYqrhcW3TcFdX+0v7vm+i6+R7dq3iCb4kRah4i8aX3ibw3YsM+H9AttbvNCbTbILv8A7S1B7aWGY3Uw+ZbWZjFBCE8yMyvIqd9+yN+0H4i+Iv7P+i6xearqUy3U16tldSI1q+pWKXk8dneNGFRQ1xbLDOSqIjGUsqIpCj5U8H6fc/theL5v7VZrr4b6Zds+rTTnevi++R8m2U/8tLWKQZmf7ssimMblSQn6lHiZVGAy/nXlwzbHpc+Iapt25YRVvZxV9JP4pTndSld6WX+GPflOaYjEw+tVvdjL4Y9Uujfmz5/+N2k2fxh8Jvpc0k1jdWsy3em6lCAbjTLtM+XPHnuMkEdGRnU/KxFeFaf8KvH3ibUI9J1aHSdBsZCE1XWNN1BpHuYSDvSziKB4Xk+6Wdj5as2zcQpBRXyFHOa1OPK1GVtVdX5X3Wtvk7q+tj5TMMswmNqwrYumpSpu8W+n+a8ndH0j4X8S2nhHRLPS7Czgs9M0+FLe3t4IxGkEajCqoHGABjFdhavdXkCyRoWjbkHcBmiirwNadaUvaO/U9qjVlLRs/9k='
        );
        var img = getScreenshot();

        var foundResults = findImages(img, greenChecked, 0.92, 5, true);
        console.log('Found green Checked icon at: ', JSON.stringify(foundResults));
        releaseImage(img);
        releaseImage(greenChecked);

        if (foundResults.length > 0) {
          console.log('Fount green checked, tap it');
          qTap(foundResults[0]);
        }
      }

      if (checkIsPage(pageInProduction) && i > 2) {
        console.log('found production when swipping, start working, times swipped: ', i);
        return true;
      } else if (collectCandySuccess && findAndTapProductionHouse()) {
        console.log('already found house using image match, start working');
        return true;
      } else if (collectCandySuccess && findHouseInNotSureWhere(config.findProductionTimes)) {
        console.log('find house in random tap success, start working');
        return true;
      }
    }
  }
  return false;
}

function handleInputLoginInfo() {
  if (handleAnnouncement()) {
    console.log('Found announcement page, handleInputLoginInfo success');
    return true;
  } else if (checkIsPage(pageInKingdomVillage)) {
    console.log('Found pageInKingdomVillage, handleInputLoginInfo success');
    return true;
  } else if (checkIsPage(pageInProduction)) {
    console.log('Found in production, no need to relogin');
    return true;
  }

  var isInputAge = false;
  pageInputAge = [
    { x: 366, y: 278, r: 254, g: 94, b: 0 },
    { x: 320, y: 154, r: 50, g: 50, b: 50 },
    { x: 319, y: 161, r: 255, g: 255, b: 255 },
    { x: 287, y: 69, r: 60, g: 60, b: 60 },
    { x: 335, y: 66, r: 99, g: 99, b: 99 },
    { x: 253, y: 213, r: 254, g: 94, b: 0 },
    { x: 252, y: 231, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageInputAge)) {
    console.log('start input age');
    qTap(pnt(285 + Math.random() * 35, 213));
    sleep(config.sleep);
    qTap(pageInputAge);
    sleep(config.sleep);
    qTap(pageInputAge);
    sleep(config.sleepAnimate * 2);
    isInputAge = true;
  }

  // TOS page will change when login page change
  pageTermsOfServices = [
    { x: 447, y: 233, r: 66, g: 66, b: 66 },
    { x: 329, y: 126, r: 66, g: 66, b: 66 },
    { x: 452, y: 126, r: 66, g: 66, b: 66 },
    { x: 458, y: 216, r: 66, g: 66, b: 66 },
    { x: 286, y: 216, r: 66, g: 66, b: 66 },
    { x: 179, y: 126, r: 66, g: 66, b: 66 },
  ];
  // Nox: cookie v1.15
  pageTermsOfServices2 = [
    { x: 447, y: 230, r: 255, g: 255, b: 255 },
    { x: 43, y: 257, r: 96, g: 24, b: 22 },
    { x: 181, y: 257, r: 95, g: 24, b: 22 },
    { x: 31, y: 289, r: 92, g: 67, b: 18 },
    { x: 203, y: 285, r: 90, g: 65, b: 16 },
    { x: 161, y: 329, r: 37, g: 8, b: 13 },
    { x: 246, y: 230, r: 255, g: 255, b: 255 },
    { x: 179, y: 132, r: 255, g: 255, b: 255 },
  ];
  // Memu: cookie v1.16
  pageTermsOfServicesMemu = [
    { x: 479, y: 238, r: 66, g: 66, b: 66 },
    { x: 482, y: 238, r: 107, g: 158, b: 153 },
    { x: 484, y: 222, r: 66, g: 66, b: 66 },
    { x: 486, y: 110, r: 66, g: 66, b: 66 },
    { x: 148, y: 123, r: 66, g: 66, b: 66 },
    { x: 171, y: 117, r: 255, g: 255, b: 255 },
    { x: 172, y: 205, r: 66, g: 66, b: 66 },
    { x: 229, y: 206, r: 254, g: 254, b: 254 },
  ];

  if (checkIsPage(pageTermsOfServices) || checkIsPage(pageTermsOfServices2)) {
    console.log('accept term of service, sleep 5s');
    qTap(pageTermsOfServices);
    sleep(5000);
  } else if (checkIsPage(pageTermsOfServicesMemu)) {
    console.log('accept term of service for memu, sleep 5s');
    qTap(pageTermsOfServicesMemu);
    sleep(5000);
  }

  pageCannotFindLoginInfo = [
    { x: 316, y: 243, r: 82, g: 136, b: 5 },
    { x: 323, y: 242, r: 254, g: 254, b: 254 },
    { x: 332, y: 243, r: 123, g: 207, b: 8 },
    { x: 305, y: 242, r: 123, g: 207, b: 8 },
    { x: 300, y: 242, r: 123, g: 207, b: 8 },
    { x: 343, y: 243, r: 123, g: 207, b: 8 },
    { x: 201, y: 106, r: 57, g: 69, b: 107 },
    { x: 422, y: 95, r: 57, g: 69, b: 107 },
    { x: 438, y: 106, r: 57, g: 69, b: 107 },
    { x: 383, y: 177, r: 215, g: 205, b: 195 },
    { x: 377, y: 178, r: 231, g: 220, b: 209 },
    { x: 371, y: 178, r: 231, g: 220, b: 209 },
    { x: 243, y: 180, r: 80, g: 80, b: 80 },
  ];
  if (checkIsPage(pageCannotFindLoginInfo)) {
    console.log("quit can't find login info page");
    keycode('BACK', 1000);
    sleep(config.sleepAnimate);
  }

  // v1.15
  pageCanDownloadResources = [
    { x: 346, y: 240, r: 121, g: 207, b: 12 },
    { x: 420, y: 237, r: 219, g: 207, b: 199 },
    { x: 418, y: 172, r: 243, g: 233, b: 223 },
    { x: 412, y: 103, r: 60, g: 70, b: 105 },
    { x: 219, y: 98, r: 60, g: 70, b: 105 },
    { x: 221, y: 250, r: 219, g: 207, b: 199 },
  ];
  if (checkIsPage(pageCanDownloadResources)) {
    console.log('start download resources, wait 10 secs');
    qTap(pageCanDownloadResources);
    sleep(10000);

    for (var i = 0; i < 18; i++) {
      // wait for yellow bar (download progress bar) disapper
      if (!checkIsPage([{ x: 16, y: 349, r: 255, g: 210, b: 76 }])) {
        console.log('download finished');
        break;
      }
      console.log('wait for download: ', i);
      sleep(3000);
    }
  }

  var findLoginTime = isInputAge ? 5 : 2;
  var isChooseLogin = false;
  // Bigger icons (Android 5)
  pageChooseLoginMethod = [
    { x: 317, y: 242, r: 255, g: 255, b: 255 },
    { x: 251, y: 128, r: 251, g: 188, b: 5 },
    { x: 268, y: 130, r: 255, g: 255, b: 255 },
    { x: 289, y: 130, r: 66, g: 133, b: 244 },
    { x: 242, y: 167, r: 255, g: 255, b: 255 },
    { x: 274, y: 165, r: 0, g: 1, b: 0 },
    { x: 236, y: 204, r: 255, g: 255, b: 255 },
    { x: 258, y: 204, r: 66, g: 103, b: 178 },
    { x: 284, y: 207, r: 255, g: 255, b: 255 },
    { x: 275, y: 234, r: 255, g: 95, b: 0 },
  ];
  // Smaller icons (Android 7)
  pageChooseLoginMethod2 = [
    { x: 251, y: 245, r: 255, g: 95, b: 0 },
    { x: 373, y: 243, r: 255, g: 255, b: 255 },
    { x: 247, y: 203, r: 66, g: 103, b: 178 },
    { x: 252, y: 205, r: 255, g: 255, b: 255 },
    { x: 250, y: 166, r: 0, g: 1, b: 0 },
    { x: 249, y: 123, r: 234, g: 67, b: 53 },
    { x: 250, y: 127, r: 255, g: 255, b: 255 },
  ];
  for (var i = 0; i < findLoginTime; i++) {
    if (checkIsPage(pageChooseLoginMethod)) {
      console.log('choose to login via email');
      isChooseLogin = true;
      qTap(pageChooseLoginMethod);
      sleep(config.sleepAnimate);
      break;
    } else if (checkIsPage(pageChooseLoginMethod2)) {
      console.log('choose to login via email 2');
      isChooseLogin = true;
      qTap(pageChooseLoginMethod2);
      sleep(config.sleepAnimate);
      break;
    } else {
      console.log('waiting for pageChooseLoginMethod: ', i);
      sleep(3000);
    }
  }

  if (!isChooseLogin) {
    if (!checkIsPage(pageInKingdomVillage) && !checkIsPage(pageInProduction)) {
      console.log('handleInputLoginInfo not sure what to do, tap(1, 1)');
      qTap(pnt(1, 1));
    }
  }

  var inputEmail = false;
  var findEmailTimes = isChooseLogin ? 5 : 2;
  pageEnterEmail = [
    { x: 313, y: 153, r: 255, g: 255, b: 255 },
    { x: 373, y: 190, r: 200, g: 200, b: 200 },
    { x: 377, y: 150, r: 255, g: 255, b: 255 },
    { x: 362, y: 98, r: 255, g: 255, b: 255 },
    { x: 227, y: 97, r: 132, g: 132, b: 132 },
    { x: 272, y: 98, r: 202, g: 202, b: 202 },
    { x: 275, y: 55, r: 60, g: 60, b: 60 },
    { x: 304, y: 55, r: 230, g: 230, b: 230 },
  ];
  for (var i = 0; i < findEmailTimes; i++) {
    if (checkIsPage(pageEnterEmail)) {
      console.log('inputing user email ', config.account);
      inputEmail = true;
      qTap(pageEnterEmail);
      sleep(config.sleepAnimate);
      typing(config.account, 3000);
      // sleep(3000);
      typing('\n', 200);
      sleep(config.sleepAnimate);
      break;
    } else {
      console.log('cannot find input email field');
      sleep(2000);
    }
  }

  var checkPasswordTimes = inputEmail ? 15 : 3;
  pageEnterpassword = [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 390, y: 189, r: 200, g: 200, b: 200 },
    { x: 314, y: 190, r: 200, g: 200, b: 200 },
    { x: 309, y: 189, r: 200, g: 200, b: 200 },
    { x: 301, y: 115, r: 255, g: 255, b: 255 },
    { x: 387, y: 53, r: 60, g: 60, b: 60 },
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 322, y: 52, r: 60, g: 60, b: 60 },
  ];

  // Check if wrong password set. Any red string in this area means wrong password
  pageEnteredPassword = [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 301, y: 115, r: 255, g: 255, b: 255 },
    { x: 387, y: 53, r: 60, g: 60, b: 60 },
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 322, y: 52, r: 60, g: 60, b: 60 },
  ];
  var wrongPasswordMessageScreen = {
    x: 225,
    y: 162,
    width: 75,
    height: 13,
    targetY: 4,
    lookingForColor: { r: 244, g: 191, b: 191 },
    targetColorCount: 8,
    targetColorThreashold: 1,
  };
  var passwordTooShortMessageScreen = {
    x: 225,
    y: 162,
    width: 75,
    height: 13,
    targetY: 4,
    lookingForColor: { r: 244, g: 191, b: 191 },
    targetColorCount: 2,
    targetColorThreashold: 0,
  };

  pageEnterTwoPasswords = [
    { x: 243, y: 307, r: 255, g: 255, b: 255 },
    { x: 377, y: 229, r: 200, g: 200, b: 200 },
    { x: 367, y: 176, r: 255, g: 255, b: 255 },
    { x: 371, y: 50, r: 60, g: 60, b: 60 },
    { x: 319, y: 53, r: 230, g: 230, b: 230 },
    { x: 404, y: 184, r: 187, g: 187, b: 188 },
  ];
  for (var i = 0; i < checkPasswordTimes; i++) {
    if (checkIsPage(pageEnterTwoPasswords)) {
      config.run = false;
      sendEvent('gameStatus', 'login-failed');
      console.log('This account id does not exist');
      return false;
    }

    if (checkIsPage(pageEnterpassword)) {
      qTap(pageEnterpassword);
      sleep(config.sleepAnimate);
      typing(config.password, 2000);
      sleep(config.sleep);
      typing('\n', 200);
      sleep(config.sleep);
      qTap(pageEnterpassword);
      sleep(5000);

      if (checkIsPage(pageEnteredPassword)) {
        if (checkScreenMessage(passwordTooShortMessageScreen, pageEnteredPassword)) {
          console.log('DevPlay report password too short');
          config.run = false;
          sendEvent('gameStatus', 'login-failed');
          return false;
        }
        if (checkScreenMessage(wrongPasswordMessageScreen, pageEnteredPassword)) {
          console.log('DevPlay report wrong password');
          config.run = false;
          sendEvent('gameStatus', 'login-failed');
          return false;
        }
      }
      if (checkIsPage(pageEnterpassword)) {
        config.run = false;
        sendEvent('gameStatus', 'login-failed');
        console.log(
          'still in password page, either password too short, wrong password, or it is a new id that devPlay ask to input password twice'
        );
        return false;
      }

      qTap(pnt(370, 190));
      sleep(config.sleepAnimate);
      sendEvent('gameStatus', 'login-succeeded');

      keycode('BACK', 1000);
      sleep(config.sleepAnimate);
      keycode('BACK', 1000);

      // Touch here to start:
      console.log('successfully input password, tap (1,1) for 10s');
      for (var i = 0; 1 < 10; i++) {
        if (checkIsPage(pageAnnouncement) || checkIsPage(pageInKingdomVillage)) {
          console.log('found announcement page, return from handleInputLoginInfo');
          return true;
        }

        if (checkIsPage(pageNotifyQuit)) {
          console.log('found unexpected quit window, closing it');
          keycode('BACK', 1000);
          sleep(config.sleepAnimate);
        }

        qTap(pnt(1, 1));
        sleep(2000);
        console.log('tapping (1, 1) until the game start: ', i);
      }
      return true;
    } else {
      console.log('waiting for input password field');
      sleep(2000);
    }
  }

  // sendEvent("gameStatus", "login-failed")
  console.log('cannot find input email field');
  return false;
}

function handleNextProductionBuilding() {
  if (checkIsPage(pageInProduction)) {
    if (config.buildTowardsTheLeft) {
      qTap(pnt(110, 174)); // next
    } else {
      qTap(pnt(349, 174)); // next
    }
    sleep(config.sleepAnimate * 2);
  }
}

function handleTryHitBackToKingdom() {
  console.log('trying to resolve stuck by hitting back');

  if (checkScreenMessage(anErrorHasOccuredMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anErrorHasOccuredMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }
  if (checkScreenMessage(theNetworkIsUnstableMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found theNetworkIsUnstableMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }
  if (checkScreenMessage(anUnknownErrorHasOccurMessageScreen)) {
    config.lastNetworkIssueOccurTime = Date.now();
    config.networkIssueCount++;
    console.log('Found anUnknownErrorHasOccurMessageScreen, error count is now: ', config.networkIssueCount);
    keycode('BACK', 1000);
  }

  for (var i = 0; i < 4; i++) {
    if (checkIsPage(pageInKingdomVillage)) {
      console.log('Found pageInKingdomVillage, return');
      return true;
    }

    pageChooseWhereToGo = [
      { x: 100, y: 315, r: 36, g: 74, b: 28 },
      { x: 315, y: 315, r: 28, g: 36, b: 48 },
      { x: 321, y: 20, r: 255, g: 193, b: 6 },
      { x: 425, y: 16, r: 0, g: 193, b: 255 },
      { x: 551, y: 24, r: 247, g: 231, b: 207 },
    ];
    if (checkIsPage(pageChooseWhereToGo)) {
      qTap(pageChooseWhereToGo);
      console.log('Found pageChooseWhereToGo, tap first to goto Kingdom');
      sleep(config.sleepAnimate * 3);
      return true;
    }

    if (checkIsPage(pageNotifyQuit)) {
      console.log('Found quit notification, should be in kingdom');
      keycode('BACK', 1000);
      return waitUntilSeePage(pageInKingdomVillage, 6);
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
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
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
  // console.log('Current app: ', app, activity);
  return [app, activity];
}

function handleAutoCollectMail() {
  console.log('About to collect mails');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleTryHitBackToKingdom();
  }

  pageHasUnreadMails = [
    { x: 565, y: 8, r: 255, g: 0, b: 0 },
    { x: 552, y: 14, r: 251, g: 239, b: 215 },
    { x: 588, y: 18, r: 219, g: 176, b: 73 },
    { x: 626, y: 19, r: 69, g: 104, b: 142 },
    { x: 572, y: 343, r: 48, g: 76, b: 109 },
    { x: 533, y: 316, r: 255, g: 255, b: 255 },
    { x: 36, y: 310, r: 186, g: 13, b: 38 },
    { x: 26, y: 319, r: 252, g: 252, b: 252 },
    { x: 61, y: 340, r: 56, g: 93, b: 130 },
  ];

  if (checkIsPage(pageHasUnreadMails)) {
    qTap(pageHasUnreadMails);
    sleep(config.sleepAnimate * 2);

    pageGreenClaimAllButton = [
      { x: 506, y: 323, r: 121, g: 207, b: 12 },
      { x: 590, y: 318, r: 121, g: 207, b: 12 },
      { x: 572, y: 24, r: 60, g: 70, b: 105 },
      { x: 419, y: 318, r: 54, g: 62, b: 95 },
    ];

    if (checkIsPage(pageGreenClaimAllButton)) {
      console.log('found unread mail and claim all');
      qTap(pageGreenClaimAllButton);
      sleep(config.sleep);
    }

    handleTryHitBackToKingdom();
  }

  console.log('completed: handleAutoCollectMail');
}

function gotoCastle() {
  console.log('about to gotoCastle');
  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('hit back to kingdom');
    handleTryHitBackToKingdom();
  }

  pageInCookieHead = [
    { x: 601, y: 141, r: 24, g: 34, b: 52 },
    { x: 602, y: 256, r: 24, g: 34, b: 52 },
    { x: 546, y: 294, r: 65, g: 78, b: 117 },
  ];

  // Tap head
  qTap(pnt(31, 41));
  if (!waitUntilSeePage(pageInCookieHead, 10)) {
    console.log('Failed to get to cookie head in 10 secs');
    handleGotoKingdomPage();
    return false;
  }

  // Tap Go Now
  qTap(pnt(92, 280));
  sleep(config.sleepAnimate * 3);

  for (var i = 0; i < 10; i++) {
    if (!checkIsPage(pageInCookieHead)) {
      console.log('leave Cookie head');
      break;
    }
    sleep(1000);
  }

  keycode('BACK', 30);
  sleep(config.sleepAnimate * 3);
}

function findAndTapFountain() {
  console.log('about to claim fountain');
  if (!checkIsPage(pageInKingdomVillage)) {
    console.log('hit back to kingdom');
    handleTryHitBackToKingdom();
  }

  gotoCastle();

  var checked = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QBGRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9hPE37f8A8O/CHiC8tb++1+HT9PvW02915PDGpyeHbG5Sf7PJHLqawG0QRyh45ZDKEheKRJWjZSo9Q8SePtP8HeHb7WNWv7LTdK0u2kvb28uZVihtYI1LvLI7HaiKoLEk4AB5xX5T/HWTXvgH41f4UeI/PuvDUkN3d+FJ5GMlrrWns7PPGynI+1QCQLOODICs2AHZRneEfjHq03wt0nwdrniM6x4T8G3Uc3hrQTFLLcXUyuHtUv5mylxa2LIGgiO5pJDB5gP2VWn/ABXH+MFLL8ZisFmWHdOVJXh15/S3c+GxXHGDwmLqYTGXhKKur/a9P0Po/wCKvxz1D446rfeJvE2r+LvCvh+NGXw34e07xHqPhxrSyHznU9TktJref7TOAGS1lcpbwBd6CaSUJ9BfsA/G3xF8Zv2TvDPiXxBcXGoXWpTah9jv7u0NtNqmnJf3Men3jIERcz2aW825URX83cqhWAr4b/Zr+DGoftz+OX1HxFG1x8JNFvnbU2ust/wm+oI+TaLkgyWcEykzucpNKhiG5UlNfoc3i3yjt27cdlPAro8Of9Yce6ud53U5VWS9nSS0hG903fW7/I9fJcVisXB4qouWMvhXW3dnz3+0n8N9D/aQ+HN14Z123kjWOZbvTtRt8LeaPex58m7t3xlJUO4Z5DKzowZHZW+OdD/YC+KHiXxmml+I77wrpnhuaby9U1nRr2Y3l/bYO9ba3eIC2llxtZjI4iWRvLLFVIKK+tzzhfLcxxFPEYykpypvRv8AJ915M0zjhnLMwr062LpKUoPS/wDWp93eD9QsPAXhjT9F0fT7bS9H0q2S2s7W2iWOK2gRQqIijooXGBXXWjT6hbrNGuUfp8y9uO4zRRX0tH4D6KlFQfKuh//Z'
  );
  var img = getScreenshot();

  var foundResults = findImages(img, checked, 0.92, 5, true);
  console.log('Found checked icon at: ', JSON.stringify(foundResults));
  releaseImage(img);
  releaseImage(checked);

  if (foundResults.length > 0) {
    console.log('Fount fountain full check icon, tap it');
    qTap(foundResults[0]);
  } else {
    console.log("Can't find fountain full image, try to tap it");
    qTap(pnt(490, 359));
    sleep(config.sleepAnimate);

    qTap(pnt(499, 295));
    sleep(config.sleepAnimate);
    qTap(pnt(540, 295));
    sleep(config.sleepAnimate);
  }

  // Tap Fountain
  pageInFountain = [
    { x: 504, y: 305, r: 121, g: 207, b: 12 },
    { x: 362, y: 60, r: 190, g: 147, b: 38 },
    { x: 442, y: 57, r: 195, g: 200, b: 196 },
    { x: 489, y: 27, r: 60, g: 70, b: 105 },
    { x: 513, y: 67, r: 243, g: 233, b: 223 },
  ];

  if (waitUntilSeePage(pageInFountain, 8)) {
    qTap(pageInFountain);
    sleep(config.sleepAnimate);
    qTap(pageInFountain);
    sleep(config.sleepAnimate * 3);
    handleTryHitBackToKingdom();
    console.log('Tapped fountain successfully');
  } else {
    handleTryHitBackToKingdom();
    console.log('Failed to claim fountain, did not see fountain screen');
  }
  return true;
}

function handleTrainStation() {
  pageInTrainStation = [
    { x: 618, y: 11, r: 56, g: 165, b: 231 },
    { x: 411, y: 19, r: 255, g: 208, b: 2 },
    { x: 393, y: 12, r: 93, g: 48, b: 32 },
    { x: 10, y: 355, r: 56, g: 34, b: 28 },
    { x: 605, y: 327, r: 130, g: 22, b: 31 },
  ];

  if (!waitUntilSeePage(pageInTrainStation, 5)) {
    console.log('Wait but not find train station, skipping');
    return false;
  }

  qTap(pnt(255, 110));
  sleep(config.sleepAnimate);
  qTap(pnt(210, 110));
  sleep(config.sleepAnimate);
  qTap(pnt(170, 110));
  sleep(config.sleepAnimate * 2);
  if (checkIsPage(pageTrainNotEnoughGoods) || isMessageWindowWithDiamond()) {
    console.log('not enough goods in train 1');
    qTap(pageTrainNotEnoughGoods);
    sleep(config.sleepAnimate);
  }

  qTap(pnt(255, 208));
  sleep(config.sleepAnimate);
  qTap(pnt(210, 208));
  sleep(config.sleepAnimate);
  qTap(pnt(170, 208));
  sleep(config.sleepAnimate * 2);
  if (checkIsPage(pageTrainNotEnoughGoods) || isMessageWindowWithDiamond()) {
    console.log('not enough goods in train 2');
    qTap(pageTrainNotEnoughGoods);
    sleep(config.sleepAnimate);
  }

  qTap(pnt(255, 307));
  sleep(config.sleepAnimate);
  qTap(pnt(210, 307));
  sleep(config.sleepAnimate);
  qTap(pnt(170, 303));
  sleep(config.sleepAnimate * 2);
  if (checkIsPage(pageTrainNotEnoughGoods) || isMessageWindowWithDiamond()) {
    console.log('not enough goods in train 3');
    qTap(pageTrainNotEnoughGoods);
    sleep(config.sleepAnimate);
  }
  sleep(9000);

  var imageSendAll = getImageFromBase64(
    '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'
  );
  var img = getScreenshot();

  var foundResults = findImages(img, imageSendAll, 0.92, 5, true);
  console.log('Found send trains at: ', JSON.stringify(foundResults));
  releaseImage(img);
  releaseImage(imageSendAll);

  for (var i in foundResults) {
    sendTrainBtn = foundResults[i];
    sendTrainBtn.x += 30;
    sendTrainBtn.y += 20;
    qTap(foundResults[i]);
    sleep(config.sleepAnimate);
  }

  qTap(pageInTrainStation);
  sleep(config.sleepAnimate);
  console.log('Tried to sent ', foundResults.length, 'trains');
}

function handleTrain() {
  console.log('try to handle train');
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
  }

  pageTrainNotCollapsed = [
    { x: 159, y: 325, r: 255, g: 224, b: 139 },
    { x: 144, y: 325, r: 81, g: 47, b: 37 },
    { x: 96, y: 329, r: 134, g: 183, b: 249 },
    { x: 56, y: 340, r: 48, g: 76, b: 109 },
    { x: 26, y: 321, r: 252, g: 252, b: 252 },
  ];
  pageTrainCollapsed = [
    { x: 98, y: 327, r: 255, g: 228, b: 143 },
    { x: 91, y: 327, r: 222, g: 52, b: 66 },
    { x: 127, y: 345, r: 41, g: 65, b: 99 },
    { x: 26, y: 322, r: 255, g: 255, b: 255 },
    { x: 22, y: 329, r: 82, g: 26, b: 11 },
    { x: 28, y: 273, r: 255, g: 247, b: 206 },
  ];
  pageTrainUncollapsed = [
    { x: 109, y: 231, r: 255, g: 223, b: 142 },
    { x: 120, y: 235, r: 219, g: 46, b: 73 },
    { x: 105, y: 321, r: 75, g: 116, b: 160 },
    { x: 106, y: 328, r: 255, g: 255, b: 255 },
  ];
  pageTrainNotEnoughGoods = [
    { x: 436, y: 30, r: 56, g: 165, b: 231 },
    { x: 221, y: 40, r: 60, g: 70, b: 105 },
    { x: 222, y: 100, r: 243, g: 233, b: 223 },
    { x: 211, y: 300, r: 219, g: 207, b: 199 },
    { x: 357, y: 300, r: 121, g: 207, b: 12 },
  ];
  if (checkIsPage(pageTrainNotCollapsed)) {
    qTap(pageTrainNotCollapsed);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  } else if (checkIsPage(pageTrainUncollapsed)) {
    qTap(pageTrainUncollapsed);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  } else if (checkIsPage(pageTrainCollapsed)) {
    qTap(pageTrainCollapsed);
    sleep(config.sleepAnimate);

    pageTrainArrived = [
      { x: 112, y: 230, r: 255, g: 223, b: 142 },
      { x: 103, y: 233, r: 222, g: 48, b: 71 },
      { x: 111, y: 221, r: 52, g: 88, b: 130 },
      { x: 119, y: 211, r: 255, g: 108, b: 108 },
    ];

    qTap(pageTrainArrived);
    sleep(config.sleepAnimate * 2);

    handleTrainStation();
  }
  handleTryHitBackToKingdom();
}

function handleGetDailyRewards() {
  handleGotoKingdomPage();

  pageShop = [
    { x: 25, y: 84, r: 238, g: 187, b: 136 },
    { x: 35, y: 65, r: 255, g: 0, b: 0 },
    { x: 21, y: 71, r: 195, g: 4, b: 12 },
  ];
  if (checkIsPage(pageShop)) {
    qTap(pageShop);
    sleep(config.sleepAnimate);

    tapDown(60, 300, 40, 0);
    sleep(config.sleep);
    moveTo(60, 150, 40, 0);
    sleep(config.sleep);
    moveTo(60, -1000, 40, 0);
    sleep(config.sleep);
    tapUp(60, -1000, 40, 0);
    sleep(config.sleepAnimate * 4);

    pageNecessities = [
      { x: 114, y: 177, r: 255, g: 108, b: 108 },
      { x: 113, y: 195, r: 40, g: 40, b: 52 },
      { x: 25, y: 18, r: 163, g: 163, b: 165 },
    ];
    pageIsDailyFreePackage = [
      { x: 181, y: 186, r: 13, g: 203, b: 252 },
      { x: 190, y: 204, r: 255, g: 255, b: 255 },
      { x: 235, y: 220, r: 242, g: 121, b: 189 },
      { x: 253, y: 166, r: 255, g: 253, b: 166 },
    ];
    if (checkIsPage(pageNecessities)) {
      qTap(pageNecessities);
      sleep(config.sleepAnimate * 4);
      qTap(pageNecessities);
      sleep(config.sleepAnimate * 4);

      if (checkIsPage(pageIsDailyFreePackage)) {
        qTap(pnt(265, 323));
        sleep(config.sleepAnimate);
        qTap(pnt(265, 323));
        sleep(config.sleepAnimate);
      }
    }
    handleGotoKingdomPage();
  }

  pageGacha = [
    { x: 380, y: 308, r: 255, g: 108, b: 108 },
    { x: 369, y: 317, r: 146, g: 80, b: 72 },
    { x: 374, y: 331, r: 84, g: 76, b: 76 },
  ];
  pointsInGacha = [pnt(163, 288), pnt(163, 260), pnt(163, 183), pnt(163, 153)];
  if (checkIsPage(pageGacha)) {
    qTap(pageGacha);
    sleep(config.sleepAnimate * 4);

    pageDailyGift = [
      { x: 163, y: 183, r: 255, g: 0, b: 0 },
      { x: 523, y: 19, r: 4, g: 131, b: 255 },
      { x: 418, y: 19, r: 255, g: 206, b: 1 },
    ];

    pageDailyGiftNotClaimed = [
      { x: 607, y: 317, r: 121, g: 207, b: 12 },
      { x: 537, y: 318, r: 121, g: 207, b: 12 },
      { x: 587, y: 317, r: 121, g: 207, b: 12 },
      { x: 444, y: 341, r: 132, g: 86, b: 102 },
    ];
    pageDailyGiftClaimed = [
      { x: 510, y: 325, r: 125, g: 125, b: 125 },
      { x: 614, y: 324, r: 125, g: 125, b: 125 },
      { x: 416, y: 20, r: 255, g: 207, b: 0 },
    ];
    for (var idx in pointsInGacha) {
      var point = pointsInGacha[idx];
      qTap(point);

      if (waitUntilSeePage(pageDailyGiftNotClaimed, 3)) {
        qTap(pageDailyGiftNotClaimed);

        // TODO: add the function to keep tapping (1, 1) while waiting
        if (waitUntilSeePage(pageDailyGiftClaimed, 5)) {
          console.log('Daily gacha gift claimed successfully at idx: ', idx);
          handleGotoKingdomPage();
          return true;
        }
      }
    }

    console.log('daily gacha gift NOT claimed');
    handleGotoKingdomPage();
    return false;
  }
}

// Numbers in wishing tree:
var b64N0_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ8DfD/wALeFNZsvhj4Y/4JveCfivo9l8MPCGtQ+NtV0K8utU1m81PT2ury9uLoPtljebckUa8RCCRQACBRX6fj/gm18AbFW0/wp4w+Jnh3SUleSy8O+Gfijq2n6dYF2LOtvBDOqxIWOdi/KDnaBk5K8H/AFqoT96Snd+n+YRymhTioRhFJaJWWiWy2P/Z';
var b64N0_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3b4FeCv2ZfjF+0F8Zv2f/ABx/wTi+Glzovwd8VQaH4UfT/CAtLw2zxuS13cIxN7I3lK/msAQXcY6sSvYfA3g34w61478X+Bbb9r34j6Zb+FdSjsbe90mPRYLu/jCEK95MNN3XUiqiqHclsZySSSSvL/tDCreL+5f5nTy1Xqnb5s//2Q==';
var b64N0_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzn9psWth8GPBHxetfCnhv9n/X9d8W+LNG1PQPCuly2dlqNnplzaJaTfZrgkLPH9pnglmUDzXiySdq4K/Z0/8ABMT9j7WrhtS+KXgbUviBqJRY4tV+IfiO71m6ghXO2GOS5kYxxgknauMkknJJNFeNHj3F4ZezpTqKK2Slb8Lni4vgDhXMcRLE4rBUp1JbycItu1lq7dkf/9k=';
var b64N1_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD65/4I5/s1/ss/tOfDXxb4X/aX/Yu+H2q+LfA+oWFtqup6/pz6nqEk91aC6kiuftyF7aSJnMZhTMQ27omkjZJGK6X9u/4tfFn9jf8AaGn1b9nP4hXPh4eM9BsZNctP7NsrqJ5LRXghZPtEDsh8shSA2DtHA5yVy0s2+uU1XaactXq3q99W7vXqzOlgqeFpxoxStFWWiSstrJJJWXRaH//Z';
var b64N1_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQ+MPwc/Zq+Lf7L3w18cW/7NfgXT9Xs/E3inw/rOqaVHLevqx0+SwiS4mubxFuZHO5ztmVXjLMjIjAqCvpD9s34NR63+0X4q+Hdv8AETX9P0Sw1mTXrOwso7EiK81OOI3ZDy2zuVZrWNgpY7SWxwcArzlmOHrpVHC3NZ97X6Xe9i6dKpQgqaltp2/BaI//2Q==';
var b64N1_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzH/gpx+z54e+OXh74GfGT9mb4P+APh/8A8JV8KV1PxHYaTqawQXNw2oXUaSifazXbbYjmViSQQcnNFfdz/wDBP/4T/tN/ETxP4L+KPjTxPLpfw01SXQ/CFpaNYRi0sZLie7MZY2haQiSZ8MxJ2hQScZor5TGTweIxDqNNXt08l5nvYLNsywWGjQpz0j/nc//Z';
var b64N2_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6B8M/ATWNT+IXinwZq3wT+HvxeuPDU8NnqvxC1DxZrMUt9qWZTcQSXFxd7Z5oh5O+OEeXAZAmc7lUrrPjPH8Q/hP8RdZ+FngX4w6tb+HtM1q9uNL0u70HRLxbM3M7Tyqj3FhJJgu5+8xOAMk4orysNiqCoQ5k27LojacJczP/2Q==';
var b64N2_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6S+A+g/sXWtjrmqftWT6BoFg+tPZ+DvGvhT4g+IbBPGSQIi3d28klyZLwJM2xbhsK5Z9m5QGJVXxPpPjWK7j+H2o/FG51TTfCcQ0rQE1rwd4dvHtbSL5UiV5tMZsAKO/J5OTRXmQxGGUEnG772RtyTbP/2Q==';
var b64N2_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDt/iJ8StG+Efw48K6r4cvvEvwv1zxHc6ndXem/CnXtXtoNW0lZY003Up7a5leSFph9pKM+2SRRuZRwAV6pqf7O9r+2Hqs+uftAfErWNavtF2wWV7/YWhxTGNuNrumnAyACJQAxO3nGMmivDqYjCc2sE35xX+Z0KFS2/wCJ/9k=';
var b64N3_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6L/Yd/Z1/Zh+KOj+JPC3xK+Ff7Kl9H4P1BNK0yxt/CbWuqWqRGWFn1COW4bbJL5Kuu12GN2DjABXnXwh+M/xV+GPizxZ8KPhp4m03QLHw1fxWK3uneCdE+16ksfmIkl3I9k3myAJ94BclmJzmiuaGN5IKN3/XzFLD0pybcV9x/9k=';
var b64N3_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6O/Ze+B/7Kvx0+C1n8Q/iT+zB8PPFuoT6jPFHH+zravpy6XCEidbbVEe4VjcgyNgHO3EnJzklJ+wXZ/EH9prwl4jsx8Z9c+Hln4Z1kQW1h8L9I0fSIbtpFO+a4X7C5lk/dqAcgDnAGTRXHLNlRfJeWn9dzKWX4Wq+aVOLfml/kf/Z';
var b64N3_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCL9uKPwz8OfhP8JfHHws8CeHW1bxVYarJ4l1z9nS8TT/Dt80E0KQR7JJ1JuIlZw5wDh0HYAFfXP7Df7J/ww/4KJfAa1+IP7SE2oPHoN7NYeHfDvhUwaNpmlRlt0rRQ2cUZLyttLtIzn92u3aAclefPizEYGboQq1Eo9E7L5e8efW4VyDHVXXxGDoznLeUqcXJ9NW1dn//Z';
var b64N4_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Dv2E/wBin4X67o/iLTP20fglc/EX4lQzWV54j8R/EbwxBewWf2qEywaTp87W6Qzx2kHlJLLbqsb3DysQGJVSuc/aQ/4WD+w98Rf7E/Zs+OfjrS9L8RWMdze6X4g8SSeIY4Zospvhk1j7VNCGDfMiyBCVBCg5yV5WDxWC+qw9jDljbRWSsjerGrKo3N3fU//Z';
var b64N4_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6M+Mf7EOi3Pwm8J6Za/BDxN468a6Tr+uaf8RPH+ueCJheeJNTj+xmS7XMW77F5rTx22P3flRfu8rySvQfjf8ADr4g/DH4map8Hvhj+1X8WtE8OaVcfb9Osf8AhMTfzQtdKvmRm6v457mWMGEFFklfYXfbgNgFeRSxmBdOPLCysraLa2nU6JRrczvLX1P/2Q==';
var b64N4_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDa/wCCmfgPxv8AB20+E+t/sQ/Arx3pema74JmXX9R1Dw1qdvq2sXVvfTRreaj5NnJI11KreafOCuBMvGDgFfX1n+xdpHx88V658PfiX+0h8Y7rSfh1eHS/CsFt8RLi3lgtpXkmYTTxhZrt8lUElw8j7I0G7qSV8liZ5LVrOc6Tu7dF2VuvY9GnUxcIWUvzP//Z';
var b64N5_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDtR+zh4V+OV3b6l+xh8Af2VfHum2vh/TH8V3fizxhqra7b61Nbh7z7cv2+FEd5/NIK7iSH3bSOSvc/g18NfF/gjxF4r+FXws+Oev8Ag/SfDWppa2//AAjXhvw7bz3y4cK93KdLZ7mRQoAdyWwTkkkmivJ+u4X+V/cjpvX/AJvxZ//Z';
var b64N5_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBf2if2UvhH8TfFtx4j/Zw/Zt+Cvij4bRavd2vg/V/hbeXmqXJijEO+LU/tOp24hnUMhVY1ZSGY7uMAr7B/ZY/Y98N/tQeCr+y8ffFbxXpVj4U1aWz0bS/BMWl6FbJvx5kzx2NjEJZX8uPc75+4MYycleBWzPB06ji1L5KJ2RWIavzfiz//2Q==';
var b64N5_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDO8ffs0fsI6vry+Mv2p9E8AeGNB1e3aT4cax8BLvUtQ0vW7FLiZZHnmlvfM+0xkRq6GNFXd8u/JIK+0vhF/wAE9Pg3+2f8I9D+Jnx88T+IL66sxNYaRpmkw6bpmn6ZbIwPlW9raWcccYLMzMcFmJ5OAACvk8TisI68tZr0UbHpU6uLjBJS/Fn/2Q==';
var b64N6_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0H48/8E1rl9c0n9nH9lT9oP4OeG/FHgLw/Z3fxWl1y7voNSu9R1KFZ4A3lxmNLOOGLZbW6k+TGTk/OBRXoPin43fH/wCDfxy8YfDHwV8aLsJoD2mnDXtQ8LaHdapqVtCjpbreXUtgzXBiTKozfNhjuLE5orn/ALQhNczV790mzKOCpQXLBWS6J2S9EtEf/9k=';
var b64N6_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6Y8Hfs5/HDwJ8WfG/hP8A4Jo2nw88U+FvClzbeE/E9tb+PbvTdVttbsPOe6uNVkktZFu7uaS7bLpgKsKpliuaK3P2Zr/45/HbXvHllP8AtSeM/CTaH4mZbi58C6fommS6zcSAq93fMmnH7RORCg38Ac4AyaK4KmZYT2j9pT5n1bSbfzuc/wDZsUkoTcUtknZL0XQ//9k=';
var b64N6_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rw7+3vc/8E6NO1Hxb8Cfgd4R+Ivwi+JniS8k+HDfC/xHNBbaRHpccFjcW08VzAG+0FhHK8ynbNJJIwAGMleg/sxfsTfDP/gpp8IYfF37T/ivxEYfCur3ln4b0DwhJaaHp2niZxLcypDZW0e6WZwrSO5YkouNoyCV5NbOMqp1XGrh1KS3euv3TX5HBUybF1ZudPFThF7RjyWXpeDf4+mh/9k=';
var b64N7_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7G/Z6/ZW/ZH8OeLvHvgj4+fCL4Laxa+GNct9H0vxfH8MVsZdYvI7WOa+80NdT+a8bXEAaTcMu75UY5KX4j/sVeCfit8afG/w+8S/E/wAZw6P4d8TXOp6RZ6Zf2tuIZ9Vc3d3uZLbdKDIFCmQsyqirk4orxaWaUIUoqabdld2Wui8zodKbbsf/2Q==';
var b64N7_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2PxF4h/Yg/Z/+H2mah8Zf2UPhZqE2teKNettAv/Cnw+GmxX+nWNxFapeNAJp9okmE4X942Vjz3wCvp39j79jr4UeJ4PEmkfES41HxPB4Qvo/C/hyPWVtdtlp9m8xjVVggjXezTOzuQS5AJ6UV8vXz+lh6rpunzWtrprodkcPKavc//9k=';
var b64N7_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCL9srwtrT+DvhZpv7O/wCxvZweI7vwc2ueNrf4X/DvUYoIor2YnTfPhsYrnyXa3iaQLI//AC0YKWwTRX6l/wDBO/4b6e/wmv8A4na7ruoarrvifUV/tO/vPJjPl2sS2tvDGkEcaRxpHGMKF6sx70V8Pjs6lDFzjGOifaP+TPWowj7NX39Wf//Z';
var b64N8_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDrvi94I+DHxK8KeDvjH8WtR/ZOvfFXjbSptZ8U3n7UHjPW7XV7m/M7WzS2kNrMsKWXk2tvFGVUZSFRyAKK9d/bI8AW37OfxQj+Evgy707VfD9hZeboll4x8DaBrT6TDK7SNa2895p8kwgDsxVGdtu4gHGACvMoYrDOjFxjZWXRG79snbm/E//Z';
var b64N8_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6N8DfsV/sT/FTxfqVx8R9H+CWoXH9gaPqjP4q+IniC38XfatQilvLyTWY47pURpbmSWWJVAH7yY4BJyVs+INI+I/wz+L3if4Z+D/jfqkNt4f+y2Nvqd14P8M3WoXVtGjLBFc3U+lPJcCJBsRnJYKTksTmivMWKwbSfJ+COjmrrRSf3s//2Q==';
var b64N8_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6P8O/sY/sl2Os+JtP8K/aLBNK8TzaRBH+zH8Q/ERvI7O1ggW2h8RD7Vhb+NGKqBwF3AcAAFdz8D/g14y+N2teMLTXf2lPGuitofiF4mufCOnaDpUuqSuMPdXrW2mKbqdhGgMj+hwBk5K8Orisr53z0rv/AAxO2E8Wo2jUaXqz/9k=';
var b64N9_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqvhx+zB8Vbj4PfDzwn+wD+zX+x9r91pHw60wfGW1+N2nRTeKtN8Yu04v4rqNsvFDuQCEH5CinysxhDRX3P8Z/h541+F/x98W3/wAGf2gPF3g5PE8tlqms2+j2WjzCe4FpFaL+8vNPnl2LFax7U37VLOQBuNFeRh8yoToRk4tXS7f5nROE+d3dz//Z';
var b64N9_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7X/Y1/Yc/ZK+Nfibxp/wrj9lj9l/xd8GtEttDtfhjqUGhRX3iBJjY7tUj1wyK0kd4J/L+SXEoBO8bs0V2KfsRaL448c+L/BqftF/FbQNG0fxXfahp+m+EPFUWkqLjUp3u7qSWS1gSW6JkYBTO8hRECqQM5K8P+2sJFLmi72XRdUvM6fY1X1P/2Q==';
var b64N9_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7L+B/7BX/AATy+M/hLXPGv7Unwx/Zy07wz/wnur2vwY1n4Pa6thb6p4YiMKwG8mtZUW5u0bcJBlhGzkDG45K7j4Lf8EzP2XvjR4Oj0T9oPR7/AOIGn+CD/wAI94L03xI9uttodjASNtvFaQwJ5kp2tNM4aWUom5iEUAr5qtn+BpVXF022vJHdClX5dJ2+bP/Z';
var b64Nd_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDX/ZIuv2bf+Cbf7KPhbxl+0X+ybpPxy8cfGXUtR8QTXr+GodUOm6TbtFZ2Lx/aIC0dtcmO4uITtQtGw3DcpwV+lP7DX7OPgbw3pWua1r97eeJ722gsPC9hdeIILVvsekaUs0dlaRJBBFGiIJ5icLljIST0wV8fU4ghg5ewpU/djZL7j0qlOriqjrVZXlJtt+bP/9k=';
var b64Nd_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDf0f8A4Ji/GDVPgh8Of2cv2XPhz4Pfxz4W8Jp4q+MniHxloMN1eT6h4glkubTT5ZCAfOtLe12umdo89CoAfkr9VP2JfANp4a+Gmp+P7/XtQ1nxF4412TWPFGu6sYjcX1yIYrZMiGONFRIbeKNUVQAE9SSSvg8VnuJpYiUKKSitEmu2h6ao+19+o7yerfqf/9k=';
var b64Nd_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0PXfiz8GP2cPg94Nv/CnwO8aeK9D8Tvfy+AvDfgbxJqGmR6J4VtHistPvJoreZN8mpzQX+otNJukke4kZ2ZsmivvD/gnD8FfC2j+Dda8V61d3Gu6gsen+GLWfV7a1xaaVpEUkFlaxRwQxxxoolmY4X5nlY+gBXxdfOqWEqujCimo2V3u9FuegqEqq55Sd2f/Z';
var b64NE =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAMAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9eYJvKlmUOCplyBvUEfKoxyD6UUWipcXd0ZkDETYBP0x/Siv5lTg9z9T07H//2Q==';

var b64_0 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDr/h3F+zro9pqVx8cPC3gK6sdQ1V7z4coPAqu1t4ZdIxZxOUtwQwdZyQ+X55PSiiiv5WWWrEfvHVmvJOy002t5a+Z7nPbof//Z';
var b64_1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDE/YA8EfB/4zfsZ+AfGHjz4C/DqbUo9Pu7KS7sfBFnD9pSDULqNJJP3ZaSQqF3SMdzEZNFFFfyhn1avQzzFU6c5KKqTSSb0XMz26STpxb7I//Z';
var b64_2 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDB17w947+F/g7wX4Y+K37PXgb4s+IG8IW91qPi2ewsdPGZpppFtUjWGPKQoyxhyoLbT2xRRRX8u4fF+1pKcoK7u9HOK36KMlFLySSR7bjZ7n//2Q==';
var b64_3 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDR8Kan8KPAHwr8F6F+0x4E8LTeL28MxzX8viDwjaX0ro003llJLK3WMRbMbVI3rzuNFFFfzHhsup4yiq8pyi5XdouyV3slbRdj2XNxdj//2Q==';
var b64_4 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5e8YeE/2I9Q/4JneCfDnwn+JujDV7Dx1HJ4k1y+8J3wvbq7m00vNEz+Rjyo3wqBWIKgE85ooor8zwOGrYeVaCrzf7yTu+VvV3f2TslO9tFsf/2Q==';
var b64_5 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCx4/8A2P8A4h+Pn0fx5qvjqy+Bses6FBc6f8PtU+CXgjXWtbYl1jlju7W1l3xyBSwWV2mHO/tRRRX8kYLOcwq4aMk4xWuns6btr3lCUn6yk2+rPflTgn/wWf/Z';
var b64_6 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzr4t/En/ghh8Y9U0nxX8XPjV4g0fyfD1nZ+GNL8E3PiOC1ttIiQrbpJC1gEgnz5m9Id0WSGDMzMaKKK/LcPwXThRUYY/ExS2SqKy/8kO14ht3cV9x/9k=';
var b64_7 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxC8/4KF/DX4HfD3wD4E+L8Ok+J/FJ8CWN/rmrXPge03NLdGS4WIGOBFIjikjjyBzs6miiivzDBcFZJjMLGvUT5p+87NJXbvokrJdl0O2WIqRdj//Z';
var b64_8 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyX9pC4+Blh/wTm+F2qjwDoKR3P9grY6hJo6GGd10q5F2YlSETxkzbDIZXbe2GXgUUUV+QcO4RSwlR88v4lRb9pNfja78zvrSakvRH/9k=';
var b64_9 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDW0L48/wDBIjwt8PPCWu/tF/s9aZb3/irw1Brnh7Rrz4RaPv0jSZmdbe08yxV0nCmORhLIxmYSDzApG0FFFfgOG4OweMpe2liK0bt6RqWS1a0VvL/M9V15J2svuP/Z';

function identityColor(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)) / 768;
}

function identifyPointColor(pnt, color) {
  var img = getScreenshot();
  var imgColor = getImageColor(img, pnt.x, pnt.y);
  releaseImage(img);
  return identityColor(imgColor, color);
}

function recognizeWishingTreeRequirements(words, devImg, maxLength, thres, overlapRatio) {
  var maxWordWidth = 0;
  var allResults = [];
  for (var w = 0; w < words.length; w++) {
    var word = words[w];
    var wh = getImageSize(word.img);
    maxWordWidth = Math.max(maxWordWidth, wh.width);
    var results = findImages(devImg, word.img, thres, maxLength, true);
    for (var idx in results) {
      var result = results[idx];
      allResults.push({ char: word.char, x: result.x, y: result.y, score: result.score, w: wh.width });
    }
  }

  allResults.sort(function (a, b) {
    return a.x - b.x;
  });
  var str = '';
  var rBound = 0;
  var maxScore = 0;
  for (var i = 0; i < allResults.length; i++) {
    var word = allResults[i];

    // console.log('word', word.char, rBound, 'x', word.x, word.score);
    if (word.x > rBound) {
      maxScore = word.score;
      str += word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    } else if (word.x <= rBound && word.score > maxScore && word.char !== ' ') {
      // overlap
      maxScore = word.score;
      str = str.substr(0, str.length - 1) + word.char;
      rBound = Math.floor(word.x + word.w * overlapRatio);
    }
  }
  return str;
}

function findWishingTreeWords() {
  var partUp = [126, 240, 354, 470];
  var img = getScreenshot();
  var parts = [];
  for (var i = 0; i < partUp.length; i++) {
    if (identifyPointColor(pnt(partUp[i], 180), { r: 255, g: 249, b: 203 }) > 0.92) {
      // qTap(foldedWishTipPnt);
      // sleep(config.sleepAnimate);
      continue;
    }

    var line1 = '';
    var line2 = '';
    var cImg1 = cropImage(img, partUp[i], 204, 110, 14);
    line1 = recognizeWishingTreeRequirements(numberImages, cImg1, 12, 0.84, 0.9);
    releaseImage(cImg1);

    var cImg2 = cropImage(img, partUp[i], 240, 110, 14);
    line2 = recognizeWishingTreeRequirements(numberImages, cImg2, 12, 0.84, 0.9);
    releaseImage(cImg2);

    // console.log(line1);
    // console.log(line2);

    line1 = line1.trim();
    line2 = line2.trim();
    var line = (line1 + ' ' + line2).replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').trim();
    var lines = line.split(' ');
    var needed = [];
    for (var j = 0; j < lines.length; j++) {
      var str = lines[j];
      var vs = str.split('/');
      if (vs.length === 2) {
        needed.push({ own: +vs[0] || 0, request: +vs[1] || 0, success: true });
      } else {
        needed.push({ own: 0, request: 0, success: false });
      }
    }
    parts.push(needed);
  }
  releaseImage(img);
  // console.log(JSON.stringify(parts));
  return parts;
}

function wish(refreshPnt, unfoldPnt, fulfillPnt, recogDetail, status) {
  return {
    refreshPnt: refreshPnt,
    unfoldPnt: unfoldPnt,
    fulfillPnt: fulfillPnt,
    recogDetail: recogDetail,
    status: status,
    failedCount: 0,
    requireFulfilled: 0,
  };
}

function getCEs() {
  var img = getScreenshot();
  var croppedImage1 = cropImage(img, 282, 106, 40, 8);
  var croppedImage2 = cropImage(img, 282, 162, 40, 8);
  var croppedImage3 = cropImage(img, 282, 219, 40, 8);
  var croppedImage4 = cropImage(img, 282, 276, 40, 8);

  var value1 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage1, 6, 0.85, 0.7) || 0;
  var value2 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage2, 6, 0.85, 0.7) || 0;
  var value3 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage3, 6, 0.85, 0.7) || 0;
  var value4 = +recognizeWishingTreeRequirements(numberImagesPVP, croppedImage4, 6, 0.85, 0.7) || 0;

  releaseImage(croppedImage1);
  releaseImage(croppedImage2);
  releaseImage(croppedImage3);
  releaseImage(croppedImage4);
  releaseImage(img);
  return [value1, value2, value3, value4];
}

function handlePVP(ceLimit) {
  if (ceLimit === undefined) {
    ceLimit = 250000;
  }
  console.log('handlePVP: ', new Date());
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
    waitUntilSeePage(pageInKingdomVillage, 8);
  }
  console.log('go to pvp page');
  tap(571, 325, 100); // play button
  sleep(3000);
  tap(509, 272, 100); // PVP button
  sleep(3000);

  var battleY = [108, 162, 223, 275];
  var kingdomArena = [
    { x: 181, y: 267, r: 56, g: 167, b: 231 },
    { x: 181, y: 306, r: 56, g: 167, b: 231 },
    { x: 182, y: 335, r: 48, g: 76, b: 109 },
    { x: 373, y: 327, r: 41, g: 35, b: 33 },
    { x: 296, y: 70, r: 65, g: 58, b: 56 },
  ];

  if (!checkIsPage(kingdomArena)) {
    console.log('go kingdomArena failed');
    return;
  }

  var crystaisRefresh = [
    { x: 243, y: 100, r: 57, g: 69, b: 107 },
    { x: 324, y: 78, r: 255, g: 255, b: 255 },
    { x: 443, y: 92, r: 57, g: 166, b: 231 },
    { x: 402, y: 134, r: 247, g: 235, b: 222 },
    { x: 351, y: 250, r: 123, g: 207, b: 8 },
    { x: 408, y: 251, r: 222, g: 207, b: 198 },
  ];
  tap(560, 330, 100); // Free Refresh
  sleep(3000);

  if (checkIsPage(crystaisRefresh)) {
    console.log('crystaisRefreshPage');
    tap(436, 90, 100); // X cancel
    sleep(3000);
  }

  var battleFinishPage = [
    { x: 56, y: 331, r: 247, g: 89, b: 24 },
    { x: 584, y: 332, r: 8, g: 166, b: 222 },
    { x: 606, y: 24, r: 57, g: 169, b: 231 },
  ];
  var battleDefeatPage = [
    { x: 243, y: 58, r: 69, g: 90, b: 105 },
    { x: 280, y: 54, r: 46, g: 46, b: 46 },
    { x: 410, y: 57, r: 60, g: 92, b: 95 },
    { x: 397, y: 48, r: 142, g: 158, b: 158 },
  ];

  var pageNoArenaTicket = [
    { x: 314, y: 111, r: 228, g: 121, b: 37 },
    { x: 347, y: 104, r: 36, g: 46, b: 65 },
    { x: 414, y: 120, r: 243, g: 233, b: 223 },
    { x: 300, y: 259, r: 12, g: 167, b: 223 },
  ];

  console.log('go kingdomArena success');
  var ces = getCEs();
  for (var i = 0; i < ces.length; i++) {
    var ce = ces[i];
    if (ce < ceLimit) {
      console.log('Battle with', i, 'ce', ce);
      tap(590, battleY[i], 100);
      sleep(3000);
      if (checkIsPage(kingdomArena)) {
        // already battled
        console.log('Battle with', i, 'failed. Already Battled');
        continue;
      }
      tap(550, 320, 100); // start battle
      // wait for battle finish
      for (var j = 0; j < 30 && config.run; j++) {
        console.log('Waiting for battle', j);
        sleep(2000);
        tap(320, 265, 100); // center
        sleep(2000);
        if (checkIsPage(pageNoArenaTicket)) {
          console.log('No arena ticket, finish auto pvp');
          qTap(pageNoArenaTicket);
          handleGotoKingdomPage();
          return;
        }
        if (checkIsPage(battleFinishPage)) {
          console.log('Battle finished, won: ', j);
          waitUntilSeePage(kingdomArena, 25, pnt(616, 323));
          sleep(2000);
          break;
        }
        if (checkIsPage(battleDefeatPage)) {
          console.log('Battle finished, lost: ', j);
          waitUntilSeePage(kingdomArena, 25, pnt(616, 323));
          sleep(2000);
          break;
        }
      }
    } else {
      console.log('Not to battle with', i, 'ce', ce);
    }
  }

  console.log('finish pvp, goto kingdom');
  handleGotoKingdomPage();
}

function handleWishingTree() {
  console.log('handleWishingTree: ', new Date());
  if (!checkIsPage(pageInKingdomVillage)) {
    handleGotoKingdomPage();
    waitUntilSeePage(pageInKingdomVillage, 8);
  }

  var wishes = [
    wish(pnt(183, 79), pnt(183, 180), pnt(183, 283), undefined, 'unknown'),
    wish(pnt(295, 79), pnt(295, 180), pnt(295, 283), undefined, 'unknown'),
    wish(pnt(400, 79), pnt(400, 180), pnt(400, 283), undefined, 'unknown'),
    wish(pnt(520, 79), pnt(520, 180), pnt(520, 283), undefined, 'unknown'),
  ];

  pageNotCollapsedWisingTree = [
    { x: 92, y: 316, r: 162, g: 90, b: 227 },
    { x: 101, y: 325, r: 134, g: 183, b: 249 },
    { x: 57, y: 341, r: 55, g: 89, b: 132 },
  ];
  pageCollapsedAffairs = [
    { x: 96, y: 329, r: 255, g: 223, b: 142 },
    { x: 127, y: 344, r: 40, g: 66, b: 97 },
    { x: 26, y: 323, r: 252, g: 252, b: 252 },
  ];
  pageUncollapsedAffairs = [
    { x: 115, y: 329, r: 69, g: 105, b: 146 },
    { x: 102, y: 286, r: 134, g: 183, b: 249 },
    { x: 129, y: 292, r: 52, g: 86, b: 125 },
    { x: 111, y: 230, r: 255, g: 223, b: 142 },
    { x: 106, y: 177, r: 255, g: 109, b: 200 },
  ];
  pageInWishingTree = [
    { x: 385, y: 24, r: 255, g: 46, b: 121 },
    { x: 411, y: 20, r: 255, g: 206, b: 2 },
    { x: 516, y: 17, r: 25, g: 212, b: 255 },
    { x: 599, y: 9, r: 101, g: 62, b: 186 },
    { x: 503, y: 28, r: 105, g: 56, b: 81 },
  ];

  if (checkIsPage(pageNotCollapsedWisingTree)) {
    qTap(pageNotCollapsedWisingTree);
  } else if (checkIsPage(pageCollapsedAffairs)) {
    qTap(pageCollapsedAffairs);
    if (!waitUntilSeePage(pageUncollapsedAffairs, 6)) {
      console.log('Cannot get into wishing tree page, skipping');
      return false;
    }
    qTap(pnt(106, 284));
  }

  if (!waitUntilSeePage(pageInWishingTree, 6)) {
    console.log('Cannot get into wishing tree page, skipping');
    return false;
  }

  var pageNotEnoughForTree = [
    { x: 428, y: 98, r: 56, g: 166, b: 231 },
    { x: 386, y: 107, r: 60, g: 70, b: 105 },
    { x: 427, y: 171, r: 243, g: 233, b: 223 },
    { x: 403, y: 240, r: 219, g: 207, b: 199 },
  ];

  var wishingTreeStartTime = Date.now();
  while (true) {
    if ((Date.now() - wishingTreeStartTime) / 60000 > config.wishingTreeMaxFillingMins) {
      console.log('Run wishing tree longer than ', config.wishingTreeMaxFillingMins, ' mins, ending this task');
      return true;
    }

    allDailyRewardCollect = [
      { x: 59, y: 242, r: 247, g: 247, b: 247 },
      { x: 60, y: 256, r: 138, g: 138, b: 138 },
    ];
    if (checkIsPage(allDailyRewardCollect) && !config.alwaysFulfillWishes) {
      console.log('All wish fulfilled, skipping');
      config.wishAlreadyFulfilled = true;
      return true;
    }

    for (var i in wishes) {
      if (identifyPointColor(wishes[i].unfoldPnt, { r: 255, g: 249, b: 203 }) > 0.95) {
        wishes[i].status = 'opened';
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 241, g: 205, b: 126 }) > 0.95) {
        qTap(wishes[i].unfoldPnt);
        sleep(config.sleepAnimate);
        wishes[i].status = 'opened';
        sleep(config.sleepAnimate * 2);
      } else if (identifyPointColor(wishes[i].refreshPnt, { r: 193, g: 160, b: 111 }) > 0.95) {
        wishes[i].status = 'refresh';
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 252, g: 219, b: 50 }) > 0.95) {
        qTap(wishes[i].refreshPnt);
        sleep(config.sleepAnimate * 2);
        qTap(wishes[i].refreshPnt);
        sleep(config.sleepAnimate);
        console.log('refresh as it is an unfolded golden wish: ', i);
        wishes[i].status = 'refreshed';
      } else if (identifyPointColor(wishes[i].unfoldPnt, { r: 252, g: 247, b: 122 }) > 0.95) {
        qTap(wishes[i].refreshPnt);
        sleep(config.sleepAnimate);
        console.log('refresh as it is a golden wish: ', i);
        wishes[i].status = 'refreshed';
      }
    }

    var treeRequirement = findWishingTreeWords();
    for (var idx in treeRequirement) {
      // Max fail count reached, tap refresh
      if (wishes[idx].failedCount >= config.wishRefreshThreashold) {
        wishes[idx].failedCount = 0;
        wishes[idx].status = 'unknown';
        qTap(wishes[idx].refreshPnt);
        sleep(config.sleep);
        console.log('wish ', idx, ' reached max fail, need refresh');
        break;
      }

      if (wishes[idx].status != 'opened') {
        console.log('continue as this wish is not opened');
        continue;
      }

      wishes[idx].requirements = treeRequirement[idx];
      wishes[idx].requireFulfilled = 0;
      for (var req in wishes[idx].requirements) {
        if (wishes[idx]['requirements'][req]['success']) {
          // Need to keep some safety stock
          if (wishes[idx]['requirements'][req]['own'] < config.wishingTreeSafetyStock) {
            console.log('wish ', idx, ' is below safety stock');
            wishes[idx].failedCount++;
            break;
          } else {
            // console.log('wish ', idx, ' req ', req, ' can be fulfilled');
            wishes[idx].requireFulfilled++;
          }
        } else {
          console.log(' + failed ocr');
          wishes[idx].failedCount++;
        }
      }
      if (wishes[idx].requireFulfilled != 0 && wishes[idx].requireFulfilled === wishes[idx].requirements.length) {
        qTap(wishes[idx].fulfillPnt);
        sleep(config.sleepAnimate * 2);
        if (checkIsPage(pageNotEnoughForTree)) {
          qTap(pageNotEnoughForTree);
          sleep(config.sleepAnimate * 2);
          qTap(wishes[idx].refreshPnt);
          wishes[idx].failedCount = 0;
          wishes[idx].status = 'refresh';
          console.log('wish ', idx, ' does not have enough stock, refreshed');
        } else {
          wishes[idx].failedCount = 0;
          console.log('wish ', idx, ' is fulfilled');
        }
      }
    }

    pageCollectTreeReward = [{ x: 85, y: 289, r: 44, g: 203, b: 8 }];
    if (checkIsPage(pageCollectTreeReward)) {
      console.log('Daily reward collected');
      qTap(pnt(60, 255));
      sleep(1500);
      waitUntilSeePage(pageInWishingTree, 8, pageCollectTreeReward);
    }

    var failedWishes = 0;
    for (var idx in wishes) {
      if (wishes[idx].status != 'opened') {
        failedWishes++;
      }
    }
    if (failedWishes >= 4) {
      console.log('All wishes are refreshing, done here');
      handleGotoKingdomPage();

      if (checkIsPage(pageUncollapsedAffairs)) {
        qTap(pageUncollapsedAffairs);
      }
      return true;
    }
    sleep(1000);
  }
}

function handleHotAirBallon() {
  console.log('start handleHotAirBallon: ', new Date());
  handleGotoKingdomPage();

  pageHotAirBallonReady = [
    { x: 205, y: 326, r: 255, g: 109, b: 200 },
    { x: 198, y: 324, r: 255, g: 109, b: 200 },
    { x: 204, y: 313, r: 255, g: 109, b: 200 },
    { x: 57, y: 344, r: 40, g: 66, b: 97 },
  ];
  pageCollapsedaffairs = [
    { x: 97, y: 327, r: 255, g: 221, b: 136 },
    { x: 116, y: 330, r: 134, g: 183, b: 249 },
    { x: 125, y: 342, r: 38, g: 71, b: 96 },
    { x: 110, y: 324, r: 162, g: 90, b: 227 },
  ];
  pageInHotAirBallon = [
    { x: 270, y: 330, r: 255, g: 211, b: 0 },
    { x: 158, y: 331, r: 12, g: 167, b: 223 },
    { x: 184, y: 312, r: 223, g: 175, b: 97 },
    { x: 331, y: 312, r: 142, g: 88, b: 65 },
    { x: 565, y: 84, r: 255, g: 251, b: 235 },
  ];
  pageChooseBallonDestination = [
    { x: 285, y: 15, r: 208, g: 161, b: 89 },
    { x: 319, y: 7, r: 91, g: 61, b: 45 },
    { x: 352, y: 18, r: 210, g: 162, b: 89 },
    { x: 616, y: 15, r: 56, g: 165, b: 231 },
  ];
  pageCanStartBallonTrip = [
    { x: 580, y: 330, r: 121, g: 207, b: 12 },
    { x: 478, y: 327, r: 241, g: 51, b: 92 },
    { x: 417, y: 330, r: 12, g: 167, b: 223 },
    { x: 437, y: 316, r: 138, g: 85, b: 60 },
  ];
  pageBallonFlying = [
    { x: 525, y: 16, r: 0, g: 193, b: 255 },
    { x: 365, y: 316, r: 119, g: 224, b: 0 },
  ];

  if (checkIsPage(pageCollapsedaffairs)) {
    console.log('Found collapsed kingdom affairs');
    qTap(pageCollapsedaffairs);
    sleep(config.sleepAnimate * 2);
    qTap(pnt(108, 173));
    sleep(2000);
    if (!waitUntilSeePage(pageInHotAirBallon, 12, pnt(1, 1), pageBallonFlying)) {
      console.log('Cannot find pageInHotAirBallon, should be flying');
      handleGotoKingdomPage();

      if (!checkIsPage(pageCollapsedaffairs)) {
        qTap(pageCollapsedaffairs);
      }
      return false;
    }
  } else if (checkIsPage(pageHotAirBallonReady)) {
    console.log('Found hot air ballon ready');
    qTap(pageHotAirBallonReady);
    sleep(2000);
    if (!waitUntilSeePage(pageInHotAirBallon, 12, pnt(1, 1), pageBallonFlying)) {
      console.log('Cannot find pageInHotAirBallon, should be flying');
      handleGotoKingdomPage();

      return false;
    }
  } else {
    console.log('Did not find either hot air ballon, skipping');
    return false;
  }

  // Tap Change location
  pageChangeLocation = [
    { x: 354, y: 339, r: 12, g: 167, b: 223 },
    { x: 416, y: 335, r: 12, g: 167, b: 223 },
    { x: 436, y: 344, r: 142, g: 88, b: 65 },
  ];
  qTap(pageChangeLocation);
  sleep(2000);
  if (!waitUntilSeePage(pageChooseBallonDestination, 8, pageChangeLocation)) {
    console.log('Cannot find the pageChooseBallonDestination, quitting');
    handleGotoKingdomPage();
  }

  if (config.isHotAirBallonGotoEp3) {
    // Do not change the ballon target for Robotmon users
    if (config.isXR) {
      sleep(2000);
      tapDown(50, 268, 40, 0);
      sleep(config.sleep);
      moveTo(400, 268, 40, 0);
      sleep(config.sleep);
      moveTo(2000, 268, 40, 0);
      sleep(config.sleep);
      tapUp(2000, 268, 40, 0);
      sleep(config.sleepAnimate * 3);
  
      qTap(pnt(510, 190));
      sleep(2000);  
    }
  }
  else {
    tapDown(626, 268, 40, 0);
    sleep(config.sleep);
    moveTo(400, 268, 40, 0);
    sleep(config.sleep);
    moveTo(-2000, 268, 40, 0);
    sleep(1100);
    tapUp(-2000, 268, 40, 0);
    sleep(config.sleepAnimate * 3);

    for (var i = 0; i < 4; i++) {
      for (var xLocation = 550; xLocation >= 100; xLocation -= 125) {
        for (var yLocation = 85; yLocation < 285; yLocation += 70) {
          qTap(pnt(xLocation, yLocation));
          sleep(2000);

          if (waitUntilSeePage(pageChooseBallonDestination, 5)) {
            continue;
          }

          if (checkIsPage(pageInHotAirBallon)) {
            console.log('ballon destination choosed successfully, i, x, y = ', i, xLocation, yLocation);
            i = 10;
            xLocation = 0;
            yLocation = 500;
          }
        }
      }

      tapDown(30, 268, 40, 0);
      sleep(config.sleep);
      moveTo(250, 268, 40, 0);
      sleep(config.sleep);
      moveTo(620, 268, 40, 0);
      sleep(1100);
      tapUp(620, 268, 40, 0);
      sleep(config.sleepAnimate * 3);
    }
  }

  if (waitUntilSeePage(pageInHotAirBallon, 8)) {
    qTap(pnt(250, 330)); // Tap Auto
    sleep(config.sleepAnimate);
    qTap(pageCanStartBallonTrip);
    sleep(config.sleepAnimate * 2);
    console.log('Successfully sent ballon');
  }

  handleGotoKingdomPage();

  pageTrainUncollapsed = [
    { x: 109, y: 231, r: 255, g: 223, b: 142 },
    { x: 120, y: 235, r: 219, g: 46, b: 73 },
    { x: 105, y: 321, r: 75, g: 116, b: 160 },
    { x: 106, y: 328, r: 255, g: 255, b: 255 },
  ];
  if (checkIsPage(pageTrainUncollapsed)) {
    qTap(pageCollapsedaffairs);
  }
}

function handleSkipRemoveGroundGuide() {
  pageGnomeTeachRemoveGround = [
    { x: 610, y: 25, r: 5, g: 14, b: 20 },
    { x: 20, y: 132, r: 56, g: 35, b: 22 },
    { x: 213, y: 147, r: 60, g: 36, b: 20 },
    { x: 210, y: 162, r: 255, g: 243, b: 239 },
    { x: 299, y: 82, r: 212, g: 110, b: 127 },
  ];

  if (checkIsPage(pageGnomeTeachRemoveGround)) {
    console.log('found pageGnomeTeachRemoveGround');
    qTap(pageGnomeTeachRemoveGround);
    sleep(config.sleepAnimate);
  }
}

function handleCollectIslandResources() {
  pageCanGoSodaIsland = [
    { x: 326, y: 97, r: 187, g: 187, b: 187 },
    { x: 201, y: 316, r: 28, g: 36, b: 48 },
    { x: 400, y: 317, r: 20, g: 62, b: 65 },
  ];
  pageInTropicalIsland = [
    { x: 253, y: 332, r: 192, g: 126, b: 68 },
    { x: 276, y: 333, r: 255, g: 105, b: 122 },
    { x: 295, y: 338, r: 237, g: 237, b: 229 },
  ];

  if (!checkIsPage(pageInTropicalIsland)) {
    handleGotoKingdomPage();

    sleep(1500);
    qTap(pnt(560, 330));

    if (waitUntilSeePage(pageCanGoSodaIsland, 9)) {
      qTap(pageCanGoSodaIsland);

      if (!waitUntilSeePage(pageInTropicalIsland, 6, pageCanGoSodaIsland)) {
        console.log("Can't goto tropical island page in 6 secs, skipping this task");
        return false;
      }
    } else {
      console.log("Can't find goto tropical island page in 6 secs, skipping this task");
      return false;
    }
  } else {
    console.log('already in tropical islands');
  }

  // Auto collect sunbeds
  pageSunbeds = [
    { x: 52, y: 323, r: 238, g: 68, b: 119 },
    { x: 61, y: 336, r: 44, g: 77, b: 110 },
  ];
  pageHasCrispyCookie = [
    { x: 429, y: 128, r: 121, g: 207, b: 16 },
    { x: 438, y: 127, r: 215, g: 242, b: 157 },
  ];
  pageHasNoCrispyCookie = [
    { x: 425, y: 111, r: 44, g: 46, b: 60 },
    { x: 422, y: 132, r: 44, g: 46, b: 60 },
  ];
  if (waitUntilSeePage(pageHasCrispyCookie, 8, pageSunbeds, pageHasNoCrispyCookie)) {
    console.log('try to release crispy cookies');
    for (var i = 0; i < 50; i++) {
      if (checkIsPage(pageHasCrispyCookie)) {
        qTap(pageHasCrispyCookie);
        sleep(1000);
        // console.log('wait another time')
      } else {
        break;
      }
    }

    if (!checkIsPage(pageHasNoCrispyCookie)) {
      console.log('found wet cookie, skipping this task');
      handleGotoKingdomPage();
      return false;
    }

    keycode('BACK', 1000);
    sleep(2000);
  } else {
    console.log('No cookies need to be free');
    keycode('BACK', 1000);
    sleep(2000);
  }

  // Auto clear red sword
  pageReadyToClearRedSword = [
    { x: 531, y: 324, r: 121, g: 207, b: 12 },
    { x: 456, y: 28, r: 241, g: 53, b: 60 },
    { x: 494, y: 23, r: 252, g: 246, b: 216 },
    { x: 572, y: 327, r: 60, g: 70, b: 105 },
  ];
  pageBattleToClearSodaIsland = [
    { x: 601, y: 326, r: 121, g: 207, b: 12 },
    { x: 623, y: 313, r: 60, g: 70, b: 105 },
    { x: 573, y: 84, r: 254, g: 253, b: 251 },
    { x: 165, y: 335, r: 121, g: 207, b: 12 },
  ];
  pageBattleHasWetCookieCannotStart = [
    { x: 350, y: 250, r: 123, g: 207, b: 8 },
    { x: 420, y: 200, r: 247, g: 235, b: 222 },
    { x: 400, y: 100, r: 57, g: 69, b: 107 },
  ];
  pageBattleFinished = [
    { x: 609, y: 330, r: 12, g: 167, b: 223 },
    { x: 310, y: 27, r: 217, g: 45, b: 67 },
    { x: 296, y: 67, r: 106, g: 138, b: 162 },
    { x: 413, y: 68, r: 50, g: 137, b: 215 },
  ];
  pageBattleFailed = [
    { x: 279, y: 64, r: 41, g: 44, b: 41 },
    { x: 399, y: 48, r: 140, g: 158, b: 156 },
    { x: 553, y: 325, r: 61, g: 180, b: 4 },
  ];
  pageAutoUseSkillEnabled = [{ x: 28, y: 291, r: 223, g: 221, b: 1 }];
  pageSpeedBoostEnabled = [{ x: 19, y: 333, r: 249, g: 245, b: 0 }];
  var redSword = getImageFromBase64(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAaABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9J/2kf+CnngbwiqeE9AXUtJF7ZS3E+sPpVxcPaWcckMU1zKbdJEsrdXuIEN1O6opmUZViCPkXSvHnwB+OXxR8Sal8adSu7vwrpUdpafDzxJo/ivUNP0uG5EP2i+uvtmm3cDSzkvDEDJugh+yhVlMs80K7P7Neh/Hzxb+0b8SPiX8G9QsrzQtM8PaNpOv2XiOOSKK81QPNcW9hY3USfuTHbzSXM5cTANdWq7F83zIpvFPhP4G/HyK60r4fxy+CPFcsst5c2FxZ+Ut1JuDSyG3R/IulZ5Q0txbsX8x08yQlfLP8ueLPF3GGAwTvhqtHCzty4unaUYO/vRlFRk6WqSUpJqWtvL+gMvjwrl+cV+H6clFwa5lGT9o7LRybfvJPdR+Ha2pFqX7Mv7RdtfzR/DP9ubXtE0EyFtM0nWPCljrNxaRt83lm9uf31woJO1pSzhNoZ3ILkr5C134R/s1fDXVJPA/7Rn7MWoan4309UTxHqun+MrY299OVDfaYQ+owMkUissiIYYyiuF2LtxRXzuCyrjmrg6c6XFsHFxi0/q9GV00rPmc7y06vV7s+iVCnbSvFLs6k016rl0Z+in/BLXwpB8Sv2BPFWm+A5Ld9c134zeJLfxPqUzB3smN1HD5mM5LLp0VqqKCOPL5AryH/AIKHfHX4b6neQ/sN/B1YLq28M6vb3HjDxlpOohW0KW1nEsVjZXED749SeaNTcOCDDE0qN+9mGz5A+M/xa+Kvwt/4J3eLrD4Y/EzxB4cg1b9oe4tdUh0HWp7NLyCXw5pfmxSiJ1EiPk7lbIbPINXfBul6ZoPhex0nQ9OgsrWK1Tyra0hWONMjJwqgAZJJ+pr+ic0z6thuG6ODhBWqQs29dGrNWt1PnOBfCfJ+KvF7Msdj6rlHC1ZNQt8TUmld32T1atrs3Y6RfhV8EdTL6l8QNDTxfrNxK8l/4i8VxR3d/eMzEgyy7VztBCKAAFRFUABRRWWZJMn5z+dFfBU63soKEEkloktEktkl0R/X8OD8ihFRjRjZf3V/kf/Z'
  );

  var img = getScreenshot();
  var foundResults = findImages(img, redSword, 0.8, 5, true);
  console.log('Found', foundResults.length, 'redSword icon');
  releaseImage(img);

  for (var i = 0; i < foundResults.length; i++) {
    img = getScreenshot();

    foundResults = findImages(img, redSword, 0.8, 5, true);
    console.log('Found redSword icon at: ', JSON.stringify(foundResults));
    releaseImage(img);

    if (foundResults.length > 0) {
      qTap(foundResults[0]);

      if (waitUntilSeePage(pageReadyToClearRedSword, 8)) {
        console.log('pageReadyToClearRedSword');
        qTap(pageReadyToClearRedSword);

        if (waitUntilSeePage(pageBattleToClearSodaIsland, 8)) {
          console.log('pageBattleToClearSodaIsland');
          qTap(pageBattleToClearSodaIsland);
          sleep(1500);
          qTap(pageBattleToClearSodaIsland);
          sleep(15000);

          if (checkIsPage(pageBattleHasWetCookieCannotStart)) {
            console.log('Has wet cookie cannot start the battle, skip this task');
            qTap(pageBattleHasWetCookieCannotStart);
            sleep(config.sleepAnimate);
            handleGotoKingdomPage();
            return true;
          }

          if (!checkIsPage(pageAutoUseSkillEnabled)) {
            console.log('Island battle skill not enabled, enable it');
            qTap(pageAutoUseSkillEnabled);
            sleep(1500);
          }
          if (!checkIsPage(pageSpeedBoostEnabled)) {
            console.log('Island battle speed boost not enabled, enable it');
            qTap(pageSpeedBoostEnabled);
            sleep(1500);
            qTap(pageSpeedBoostEnabled);
            sleep(1500);
          }

          if (waitUntilSeePage(pageBattleFinished, 590, pnt(323, 337), pageBattleFailed)) {
            console.log('Successfully cleared a red sword');
            qTap(pageBattleFinished);
          } else {
            console.log('failed to clear the sword');
            qTap(pageBattleFailed);
            break;
          }
          waitUntilSeePage(pageInTropicalIsland, 10);
        }
      }
    }
  }
  releaseImage(redSword);

  //TODO: tap collect resources

  handleGotoKingdomPage();
  return true;
}

function checkAndRestartApp() {
  if (getCurrentApp()[0] !== 'com.devsisters.ck') {
    console.log('Cookie not active, restart CookieKingdom and wait 20s');
    rtn = execute('am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity');

    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n com.devsisters.ck/com.devsisters.plugin.OvenUnityPlayerActivity'
      );
    }
    sleep(20000);
  }
}

function stop() {
  for (var i = 0; i < numberImagesPVP.length; i++) {
    releaseImage(numberImagesPVP[i].img);
  }

  for (var i = 0; i < numberImages.length; i++) {
    releaseImage(numberImages[i].img);
  }

  for (var i = 0; i < bNumbers.length; i++) {
    releaseImage(bNumbers[i].img);
  }

  for (var i = 0; i < wNumbers.length; i++) {
    releaseImage(wNumbers[i].img);
  }

  config.run = false;
  console.log('stop clicked, change config.run = false');
}

var numberImagesPVP = [];
var numberImages = [];
var bNumbers = [];
var wNumbers = [];
function loadImages() {
  numberImagesPVP = [
    { char: '0', img: getImageFromBase64(b64_0) },
    { char: '1', img: getImageFromBase64(b64_1) },
    { char: '2', img: getImageFromBase64(b64_2) },
    { char: '3', img: getImageFromBase64(b64_3) },
    { char: '4', img: getImageFromBase64(b64_4) },
    { char: '5', img: getImageFromBase64(b64_5) },
    { char: '6', img: getImageFromBase64(b64_6) },
    { char: '7', img: getImageFromBase64(b64_7) },
    { char: '8', img: getImageFromBase64(b64_8) },
    { char: '9', img: getImageFromBase64(b64_9) },
  ];

  numberImages = [
    { char: '0', img: getImageFromBase64(b64N0_1) },
    { char: '0', img: getImageFromBase64(b64N0_2) },
    { char: '0', img: getImageFromBase64(b64N0_3) },
    { char: '1', img: getImageFromBase64(b64N1_1) },
    { char: '1', img: getImageFromBase64(b64N1_2) },
    { char: '1', img: getImageFromBase64(b64N1_3) },
    { char: '2', img: getImageFromBase64(b64N2_1) },
    { char: '2', img: getImageFromBase64(b64N2_2) },
    { char: '2', img: getImageFromBase64(b64N2_3) },
    { char: '3', img: getImageFromBase64(b64N3_1) },
    { char: '3', img: getImageFromBase64(b64N3_2) },
    { char: '3', img: getImageFromBase64(b64N3_3) },
    { char: '4', img: getImageFromBase64(b64N4_1) },
    { char: '4', img: getImageFromBase64(b64N4_2) },
    { char: '4', img: getImageFromBase64(b64N4_3) },
    { char: '5', img: getImageFromBase64(b64N5_1) },
    { char: '5', img: getImageFromBase64(b64N5_2) },
    { char: '5', img: getImageFromBase64(b64N5_3) },
    { char: '6', img: getImageFromBase64(b64N6_1) },
    { char: '6', img: getImageFromBase64(b64N6_2) },
    { char: '6', img: getImageFromBase64(b64N6_3) },
    { char: '7', img: getImageFromBase64(b64N7_1) },
    { char: '7', img: getImageFromBase64(b64N7_2) },
    { char: '7', img: getImageFromBase64(b64N7_3) },
    { char: '8', img: getImageFromBase64(b64N8_1) },
    { char: '8', img: getImageFromBase64(b64N8_2) },
    { char: '8', img: getImageFromBase64(b64N8_3) },
    { char: '9', img: getImageFromBase64(b64N9_1) },
    { char: '9', img: getImageFromBase64(b64N9_2) },
    { char: '9', img: getImageFromBase64(b64N9_3) },
    { char: '/', img: getImageFromBase64(b64Nd_1) },
    { char: '/', img: getImageFromBase64(b64Nd_2) },
    { char: '/', img: getImageFromBase64(b64Nd_3) },
    { char: ' ', img: getImageFromBase64(b64NE) },
  ];

  bNumbers = [
    {
      char: '0',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7F/ZY/aM/aE1r4+y2fgn4seJPFfjK80vxPL8V/BmpztPbeGbu31yCDTUjgKgWu62acBQf3iIH9yUUVlC7RpKyZ//Z'
      ),
    },

    {
      char: '1',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD68svhv8cvhf8AHD4veCvC998R7/R7X4kO+kXuqX9/dvPFJpenSMyzOTvXzXlxg4ByBjGKKKKwsbJ6H//Z'
      ),
    },
    {
      char: '2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3P9oHw34g8X/ta/EOy/Zu/aN+K/wX0XRb2PT9Uub218Rai3inVFmumubyPYGWOBN6RRkHDhSQAAKKKK5d2b3sf//Z'
      ),
    },
    {
      char: '3',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7g+Adh4lk/wCCo3xK8JfDf4s+MdQ8JJ4Vvbi/TSPFuravFFqo1WNCl2moBYrSdFMqRx25dPKUnNFFFZQ2NJbn/9k='
      ),
    },
    {
      char: '4',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Z+Cbf8FA9P8A+CrnjL4y/G79lXxld2OtfDS8tdD0e28R6a2mWNnHq9utqIpxceSJWijZ3jdhMWldtmwZoooqIxt1Kb8j/9k='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAHAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD379k74keDvCPjHx/8JPhZ8H/B3xjk8Oa0/wDbvi24tbzSb5bqe/1Bza3Ju5iLkxABEkiVU2AA5IzRRRWENYm0tJH/2Q=='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAJAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7j/ZZttY8J/t4fFL4f69feI/Hmo3Vxrmrtr/hLx9rU0Oj28msL5GlXNndBLS3mWN12mDcdsLjO05JX354U/5Dut/9fa/yNFRGNkU5XZ//2Q=='
      ),
    },
    {
      char: '6',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD63/YW/bO/4KKeD08ar4//AGWdf+IfiDVtffUteYRajYSaFdPPcw/2cRdgwMiQwQMgtQECOCxZm3EoorGN+Xc1klfY/9k='
      ),
    },
    {
      char: '7',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7f8IfsO+Lfjb+1n8ZtP8Ag/8AGj4k+D/BnhHU9M0e1m1Dxpql0NT1YwzXV/JF9omYpGn2m2iATCfJkd6KKKzUItFuTTP/2Q=='
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCj+258W/26vDHxW1u9+FXxn+JkOqXXjrxJFrsXhnxFrbXyQQ6gyWQvLMsLayQQkiAWxIeMMWwQuSiiuGV+Y61ax//Z'
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAJAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpI/23f22xfzt4E/aX8TQ6o9xeHxMdMupdeneddTvo4vtFiUUaK4hSNRbgsJFUPxRX7FfDP/koXjr/ALDif+gGisVTbW5r7Rdj/9k='
      ),
    },
    {
      char: '9',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAIAAUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD37TPg1/wVft/jd498A/Bb4neIZtW0DUEXxt4p/wCExvr2x1m8uJ7q4gNvHdIqWrRWklujxQAoMoCSQQCiisVBPqauR//Z'
      ),
    },
  ];

  wNumbers = [
    {
      char: '0',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDK/Zt+AXwN1H4KfCb9mHUv2d/DeoeEviZ8C/Enizxf8SbjSA99a6rbLO0MiXn/ACxETRJHsyM7vU0V+e2kfteftN+Bv2WdY/Z+8I/G7xBYeDLhzHJ4ft74iDy5TmWMfxKjkfMoIU9xRWDSWljRNvW5/9k='
      ),
    },
    {
      char: '1',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzf9kHTPgJ8cv+CacMt9+zJ4M0zV/CXxEtNLudftLAvd6v5tleStLO8hJJyiDAwBt6UV8IfDb9oH40/D34c3ngDwT8SdU0zRrvWIb+4060n2xSXKRSRrKRj7wR2H0NFeeq0bK6NXGV9D//2Q=='
      ),
    },
    {
      char: '2',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzX9hjWfhnrX7CniHxv+25+yb4GsfhHottZaZ4T16x8J7NY13WjexmSVJVy8yrD5gkb7vAHXNFdD+yz8TfiTF/wTO8N+FoviDri6Zawv8AZtOXVphBF/xMGPyx7tq888CisIq8UaJn/9k='
      ),
    },
    {
      char: '3',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzbX7H4RfGH/gjrr/xS8QfDT4ea34i8OX3h+3tNK8IeCJNE1Dw0sk4id57t1C3ZnVQxKE/for4r+NP7aH7U3xO+BWg/A/x18btbv8AwlaRQJDoTSqkBEChYdwRQZNgA27icYorhnOLex1wpNrc/9k='
      ),
    },
    {
      char: '4',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDH+Kf/AASJufgz/wAEX/Fuj6P+zvc698YtS1Dw3r1/4lgtY2EEN3cgmws2LZCxREeb6mTHOKK/P74e/F74sQ/sP/FTQYvih4iWxm1rQjNZLrc4icrM20lN+DjAxkcUVztRdtDN2lqf/9k='
      ),
    },
    {
      char: '5',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz79rDTPCPx0/YQ03xn+xUfhhc+HvCXgvwpaePNHl+HZtNZt9UdY45Z1v5owJlebAZVPTceQaK+Ifin+2H+0540/Z50H4C+JfjNrNx4PtREItAEixwEQ5MW/YoMmzHy7icUVxTnFsapSmro//Z'
      ),
    },
    {
      char: '6',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzb9sn/glR4E0/9jTwR4B/Zr8R+GG8WeEPBuj+L/iF9t0GaPUdUfWCkcbLqDHyjDGZFUQqO26ivNfj/wDGX4v3n/BIzwJpV38VfEktrJcW9tJbSa7cNG0MUhMUZUvgohAKr0XHGKK5pxhfYbqzi7I//9k='
      ),
    },
    {
      char: '7',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDifhP+1F8K/Cf/AATf8PftB/tY/szfDe6uPEPjtdF8GQ6Z4RtrSeWxsrKQXFxIVUGQNI8Q3H+JWor8xfiP8Xvid488B+Efhn4x8cajqOgeEra6j8N6TczlodOSWRXkEa9gzEk0Vye10Q4U3OKdz//Z'
      ),
    },
    {
      char: '8',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDr/jP+zJ+yM37JOoeENO+EHhrU7jRPhd4O1i28B6T4VFprmkXV3NAtxfTaqcLcLMHIMYYkbs4or8vPGv7dX7X/AIu/Z60z4MeJP2hfEt34Zg8q2j0qS9+XyYDmGNmADsiFQVUsQMDFFcUq1NvY6FSl3P/Z'
      ),
    },
    {
      char: '9',
      img: getImageFromBase64(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAALAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBfGPw2/YD8S/8ABNS++Mmn6N8NU+GOjeHvDFjo11YaE8HiC28TvLGuopczsoM24GQkKWAGDwKK/I3xL8Zvirr3wd0X4Lax491O48J6TqVze6d4fkuT9lguHCB5QnTcRxk59qKr2dzH2tj/2Q=='
      ),
    },
  ];
}

function start(inputConfig) {
  console.log('inputConfig: ', inputConfig);
  config.run = true;

  inputConfig = JSON.parse(inputConfig);
  config = mergeObject(config, inputConfig);
  console.log('start with: ', config.materialsTarget, config.goodsTarget, config.run);

  loadImages();

  checkAndRestartApp();

  if (config.account !== 'default_xrobotmon_account@gmail.com' && config.account !== 'aaa@gmail.com') {
    while (!checkIsPage(pageInKingdomVillage) && !checkIsPage(pageInProduction) && config.run) {
      if (checkIsPage(pageNotifyQuit)) {
        console.log('found pageNotifyQuit while trying to login, hit back');
        qTap(pageNotifyQuit);
      }

      handleInputLoginInfo();
      console.log('Trying to login');
    }
    if (!config.run) {
      console.log('wrong login info, stopping');
      return;
    }
  }

  if (checkIsPage(pageInProduction)) {
    console.log('Already in production, reset all side tasks');
    config.lastCollectMail = Date.now();
    config.lastCollectDailyReward = Date.now();
    config.lastSendHotAirBallon = Date.now();
    config.lastCollectTrain = Date.now();
    config.lastFulfillWishes = Date.now();
    config.lastCollectFountain = Date.now();
    config.lastCollectCandyTime = Date.now();
    config.lastAutoPvP = Date.now();
  } else {
    handleGotoKingdomPage();
  }

  for (var i = 1; i < 100000000; i++) {
    console.log('start loop', i, Date.now());

    if (config.run == false) {
      console.log('jobs done!');
      break;
    }

    if (
      config.autoCollectMailIntervalInMins != 0 &&
      (Date.now() - config.lastCollectMail) / 60000 > config.autoCollectMailIntervalInMins
    ) {
      console.log('Collect mail: ', (Date.now() - config.lastCollectMail) / 60000, ' mins just passed');
      handleAutoCollectMail();
      config.lastCollectMail = Date.now();
    }
    if (config.autoCollectDailyReward && (Date.now() - config.lastCollectDailyReward) / 60000 > 240) {
      console.log('Collect daily reward: ', (Date.now() - config.lastCollectDailyReward) / 60000, ' mins just passed');
      handleGetDailyRewards();
      config.lastCollectDailyReward = Date.now();
    }

    if (
      config.autoSendHotAirBallonIntervalInMins != 0 &&
      (Date.now() - config.lastSendHotAirBallon) / 60000 > config.autoSendHotAirBallonIntervalInMins
    ) {
      console.log('Check hot air ballon: ', (Date.now() - config.lastSendHotAirBallon) / 60000, ' mins just passed');
      handleHotAirBallon();
      config.lastSendHotAirBallon = Date.now();
    }

    if (
      config.autoCollectTrainIntervalInMins != 0 &&
      (Date.now() - config.lastCollectTrain) / 60000 > config.autoCollectTrainIntervalInMins
    ) {
      console.log('Collect train: ', (Date.now() - config.lastCollectTrain) / 60000, ' mins just passed');
      handleTrain();
      config.lastCollectTrain = Date.now();
    }

    if (
      config.autoFulfillWishesIntervalInMins != 0 &&
      (Date.now() - config.lastFulfillWishes) / 60000 > config.autoFulfillWishesIntervalInMins
    ) {
      if (config.wishAlreadyFulfilled && !config.alwaysFulfillWishes) {
        console.log(
          'Wish daily reward already collected, skipping: ',
          (Date.now() - config.lastFulfillWishes) / 60000,
          ' mins just passed'
        );
        config.lastFulfillWishes = Date.now();
      } else {
        console.log('Fulfill wishes: ', (Date.now() - config.lastFulfillWishes) / 60000, ' mins just passed');
        handleWishingTree();
        config.lastFulfillWishes = Date.now();
        sendEvent('running', '');
      }
    }

    if (
      config.autoCollectFountainIntervalInMins != 0 &&
      (Date.now() - config.lastCollectFountain) / 60000 > config.autoCollectFountainIntervalInMins
    ) {
      console.log('Collect fountain: ', (Date.now() - config.lastCollectFountain) / 60000, ' just passed');
      findAndTapFountain();
      config.lastCollectFountain = Date.now();
    }

    if (
      config.worksBeforeCollectCandy != 0 &&
      (Date.now() - config.lastCollectCandyTime) / 60000 > config.worksBeforeCollectCandy
    ) {
      console.log('Collect candy: ', (Date.now() - config.lastCollectCandyTime) / 60000, ' just passed');
      handleFindAndTapCandyHouse();
      config.lastCollectCandyTime = Date.now();
    }

    if (config.autoPvPIntervalInMins != 0 && (Date.now() - config.lastAutoPvP) / 60000 > config.autoPvPIntervalInMins) {
      console.log('AutoPvP: ', (Date.now() - config.lastAutoPvP) / 60000, ' just passed');
      handlePVP(config.autoPvPTargetScoreLimit);
      config.lastAutoPvP = Date.now();
      sendEvent('running', '');
    }

    if (
      config.autoCollectTropicalIslandsIntervalInMins != 0 &&
      (Date.now() - config.lastCollectTropicalIsland) / 60000 > config.autoCollectTropicalIslandsIntervalInMins
    ) {
      console.log('Collect Tropical island: ', (Date.now() - config.lastCollectTropicalIsland) / 60000, ' just passed');
      handleCollectIslandResources();
      config.lastCollectTropicalIsland = Date.now();
      sendEvent('running', '');
    }

    var act = JobScheduling();
    // console.log('JobScheduling result: ', act);
    sleep(config.sleep);
    handleNotEnoughStock();
    sleep(config.sleep);
    handleNextProductionBuilding();
    console.log('performed  act: ', act);

    if ((Date.now() - config.lastNetworkIssueOccurTime) / 1000 > 180) {
      config.networkIssueCount = 0;
    }
    if (config.networkIssueCount > config.networkIssueCountThreasHold) {
      console.log(
        'Reboot nox as too many network error: ',
        config.networkIssueCount,
        ' in ',
        (Date.now() - config.lastNetworkIssueOccurTime) / 1000,
        ' secs'
      );
      execute('/system/bin/reboot -p');
    }

    if (!act) {
      config.jobFailedCount++;
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
      } else if (handleRelogin()) {
        console.log('just handleRelogin()');
        config.jobFailedCount = 0;
        continue;
      } else if (handleWelcomePage()) {
        console.log('just handleWelcomePage()');
        handleAnnouncement();
        config.jobFailedCount = 0;
        continue;
      } else if (handleAnnouncement() || checkIsPage(pageInKingdomVillage)) {
        console.log('in village, find production');
        handleFindAndTapCandyHouse();
        config.jobFailedCount = 0;
        continue;
      } else if (getCurrentApp()[0] !== 'com.devsisters.ck') {
        console.log('Cookie not active, restart CookieKingdom and wait 20s');
        checkAndRestartApp();
      } else if (checkIsPage(pageCookieKingdomIsNotResponding)) {
        console.log('Popped cookie kingdom is not responding window, tap wait');
        qTap(pageCookieKingdomIsNotResponding);
        sleep(3000);
      } else if (handleSkipRemoveGroundGuide()) {
        console.log('successfully resolved stuck by pageGnomeTeachRemoveGround');
      } else if (handleGotoKingdomPage()) {
        console.log('just handleGotoKingdomPage(), start looking for productions');
        handleFindAndTapCandyHouse();
        config.jobFailedCount = 0;
        continue;
      } else if (handleInputLoginInfo()) {
        console.log('login, wait 10s and check for handleWelcomePage()');
        sleep(10000);
        for (var j = 0; j < 3; j++) {
          if (handleWelcomePage() || handleAnnouncement()) {
            handleFindAndTapCandyHouse();
            config.jobFailedCount = 0;
            break;
          }
          sleep(3000);
        }
      } else if (handleFindAndTapCandyHouse()) {
        console.log('just handleFindAndTapCandyHouse()');
        config.jobFailedCount = 0;
        continue;
      } else if (config.jobFailedCount % 10 == 0 && handleTryHitBackToKingdom()) {
        console.log('just handleTryHitBackToKingdom()');
        config.jobFailedCount = 0;
        continue;
      }
    } else {
      config.jobFailedCount = 0;
      sendEvent('running', '');
      console.log('Cookie action successfully at: ', new Date().toLocaleString());
    }
  }
}

// start(JSON.stringify(config));
