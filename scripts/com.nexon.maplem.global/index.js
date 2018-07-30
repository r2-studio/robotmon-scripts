
// for (var key in gPageColors) {
// 	var pageColors = gPageColors[key];
// 	console.log("  \"" + key + "\": [\n");
// 	for(var i in pageColors) {
// 		var xyColor = pageColors[i];
// 		var x = Math.floor(xyColor.x * gDevToUserRatio);
// 		var y = Math.floor(xyColor.y * gDevToUserRatio);
// 		console.log("    {x: ", x, ", y: ", y, ", r: ", xyColor.r, ", g: ", xyColor.g, ", b: ", xyColor.b, "},\n");
// 	}
// 	console.log("  ],\n")
// }


// ===== utils =====
function Colors() {}

Colors.isSameColor = function (c1, c2, d) {
  d = d || 25;
  if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
    return true;
  }
  return false;
}

Colors.mergeColor = function (c1, c2) {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2),
  };
}

Colors.diffColor = function (c, c1) {
  return Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
}

Colors.distanceColor = function (c, c1) {
  return Math.sqrt((c1.r - c.r)*(c1.r - c.r) + (c1.g - c.g)*(c1.g - c.g) + (c1.b - c.b)*(c1.b - c.b));
}

Colors.identityScore = function(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512+mean)*r*r)>>8) + 4*g*g + (((767-mean)*b*b)>>8)) / 768;
}

Colors.minMaxDiff = function (c) {
  var max = Math.max(Math.max(c.r, c.g), c.b);
  var min = Math.min(Math.min(c.r, c.g), c.b);
  return max - min;
}

// ===== start =====

// ===== config =====
var gConfig = {
	selectRole: 0,
};

// ===== setting =====

var gBtnSelectRole = [
	{x: 402,y: 333}, {x: 678,y: 333}, {x: 997,y: 340}, {x: 249,y: 745}, {x: 543,y: 745},
];
var gBtnUnknown = {x: 1900, y: 1073};
var gBtnStartGame = {x: 1160, y: 608, r: 144, g: 187, b: 22};
var gBtnGuide01 = {x: 352, y: 860};
var gBtnGuide03 = [
	{x: 684, y: 237},
	{x: 1177, y: 346},
	{x: 1689, y: 945},
	{x: 1746, y: 957},
	{x: 1689, y: 945},
	{x: 1689, y: 945},
	{x: 985, y: 957},
	{x: 1867, y: 57},
	{x: 1867, y: 57},
];
var gBtnGuide04 = [
	{x: 1567.5 , y: 51 },
	{x: 108 , y: 462 },
	{x: 1644 , y: 951 },
	{x: 1644 , y: 951 },
	{x: 1644 , y: 951 },
	{x: 1644 , y: 951 },
	{x: 972 , y: 970.5 },
	{x: 1644 , y: 951 },
	{x: 972 , y: 963 },
	{x: 1867.5 , y: 57 },
	{x: 1867.5 , y: 57 },
];
var gBtnGuide05 = [
	{x: 1344, y: 199},
	{x: 1344, y: 199},
	{x: 1344, y: 199},
	{x: 1651, y: 957},
	{x: 1651, y: 957},
	{x: 1184, y: 334},
	{x: 1651, y: 957},
	{x: 1792, y: 990},
	{x: 985, y: 977},
	{x: 972, y: 1002},
	{x: 972, y: 1002},
	{x: 972, y: 1002},
	{x: 1651, y: 945},
	{x: 1068, y: 957},
	{x: 1651, y: 945},
	{x: 1651, y: 945},
	{x: 1011, y: 957},
	{x: 1011, y: 957},
	{x: 1011, y: 957},
	{x: 1856, y: 57},
];
var gBtnGuide06 = [
	{x: 1248, y: 1002},
	{x: 1638, y: 957},
	{x: 1248, y: 848},
	{x: 1638, y: 957},
	{x: 1248, y: 1002},
	{x: 1638, y: 957},
	{x: 998, y: 957},
];
var gBtnGuide07 = [
	{x: 902, y: 237},
	{x: 1632, y: 957},
	{x: 1632, y: 957},
	{x: 1184, y: 340},
	{x: 1420, y: 957},
	{x: 665, y: 302},
	{x: 1081, y: 797},
	{x: 1632, y: 957},
	{x: 966, y: 977},
	{x: 1862, y: 64},
	{x: 1862, y: 64},
];
var gBtnGuide08 = [
	{x: 1638, y: 70},
	{x: 211, y: 630},
	{x: 556, y: 623},
	{x: 896, y: 630},
	{x: 1241, y: 630},
	{x: 1235, y: 630},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1625, y: 945},
	{x: 1126, y: 964},
	{x: 1862, y: 64},
];
var gBtnGuide09 = [
	{x: 115, y: 597},
	{x: 1164, y: 347},
	{x: 1657, y: 951},
	{x: 1657, y: 951},
	{x: 960, y: 1009},
	{x: 1657, y: 951},
	{x: 1657, y: 951},
	{x: 947, y: 816},
	{x: 947, y: 816},
	{x: 1657, y: 951},
	{x: 1657, y: 951},
	{x: 1657, y: 951},
	{x: 1100, y: 990},
	{x: 1100, y: 990},
	{x: 1100, y: 990},
	{x: 1862, y: 57},
];
var gBtnGuideAuto = [
	{x: 512, y: 1002},
	{x: 1695 , y: 951},
	{x: 1695 , y: 951},
	{x: 1695 , y: 951},
	{x: 1401, y: 610},
	{x: 1695 , y: 951},
	{x: 1695 , y: 951},
	{x: 992, y: 970},
];
var gBtnSelectTask = [
	{x: 185, y: 405},
	{x: 185, y: 488},
];

// ===== script =====
var gUserWidth = getScreenSize().width;
var gUserHeight = getScreenSize().height;
var gDevWidth = 1920;
var gDevHeight = 1080;
var gResizeWidth = 640;
var gResizeHeight = 360;
var gDevToImgRatio = 1/3;
var gDevToUserRatio = gUserWidth / gDevWidth;

var gPageColors = {
	"goFindNPC":[
		{x: 1107, y: 308, r: 245, g: 122, b: 78},
		{x: 915, y: 327, r: 117, g: 133, b: 148},
	],
	"menu": [
		{x: 1893 , y: 1053 , r: 87 , g: 123 , b: 62 },
		{x: 37 , y: 1015 , r: 225 , g: 185 , b: 0 },
		{x: 1765 , y: 70 , r: 155 , g: 184 , b: 92 },
		{x: 1209, y: 297, r: 238, g: 120, b: 30},
	],
	"menu_select_server": [
		{x: 1458 , y: 340 , r: 247 , g: 252 , b: 246 },
		{x: 1893 , y: 1053 , r: 87 , g: 123 , b: 62 },
		{x: 447 , y: 63 , r: 78 , g: 94 , b: 107 },
	],
	"gamg_select_role_info": [
		{x: 63 , y: 63 , r: 255 , g: 120 , b: 86 },
		{x: 568 , y: 726 , r: 247 , g: 122 , b: 76 },
		{x: 1830 , y: 96 , r: 77 , g: 123 , b: 156 },
	],
	"gamg_select_role": [
		{x: 1740 , y: 912 , r: 144 , g: 187 , b: 22 },
		{x: 1605 , y: 597 , r: 238 , g: 229 , b: 190 },
		{x: 703 , y: 585 , r: 129 , g: 150 , b: 23 },
		{x: 1765 , y: 225 , r: 221 , g: 195 , b: 136 },
	],
	"welcome": [
		{x: 1600, y: 109, r: 31, g: 43, b: 41},
		{x: 978 , y: 108 , r: 161 , g: 210 , b: 215 },
		{x: 978 , y: 270 , r: 236 , g: 121 , b: 30 },
		{x: 447 , y: 835 , r: 42 , g: 41 , b: 37 },
	],
	"task_dialog_ignore": [
		{x: 102 , y: 75 , r: 218 , g: 213 , b: 209 },
		{x: 1887 , y: 1053 , r: 0 , g: 0 , b: 0 },
		{x: 18 , y: 1060 , r: 1 , g: 2 , b: 0 },
	],
	"task_dialog_ignore2": [
		{x: 140, y: 83, r: 171 , g: 183 , b: 183},
		{x: 1887 , y: 1053 , r: 0 , g: 0 , b: 0 },
		{x: 18 , y: 1060 , r: 1 , g: 2 , b: 0 },
	],
	"task_dialog_confirm": [
		{x: 1816 , y: 976 , r: 247 , g: 122 , b: 76 },
		{x: 1887 , y: 1053 , r: 4 , g: 3 , b: 0 },
		{x: 18 , y: 1060 , r: 1 , g: 2 , b: 0 },
	],
	"task_dialog_confirm2": [
		{x: 1695 , y: 951 , r: 247 , g: 122 , b: 76 },
		{x: 1887 , y: 1053 , r: 4 , g: 3 , b: 0 },
		{x: 18 , y: 1060 , r: 1 , g: 2 , b: 0 },
	],
	"task_dialog_skip": [
		{x: 1824 , y: 180 , r: 215 , g: 231 , b: 230, score: 0.8 },
		{x: 1305 , y: 192 , r: 36 , g: 56 , b: 63 },
		{x: 1209, y: 668, r: 238, g: 243, b: 237, score: 0.8},
	],
	"task_done": [
		{x: 1081 , y: 963 , r: 247 , g: 122 , b: 76 },
		{x: 741 , y: 82 , r: 78 , g: 94 , b: 107 },
		{x: 1234 , y: 90 , r: 78 , g: 94 , b: 107 },
	],
	"online_sign": [
		{x: 1728 , y: 90 , r: 249 , g: 252 , b: 245 },
		{x: 300 , y: 96 , r: 78 , g: 94 , b: 107 },
		{x: 1593 , y: 96 , r: 78 , g: 94 , b: 107 },
		{x: 1728 , y: 1021 , r: 234 , g: 239 , b: 233 },
	],
	"guideAuto": [
		{x: 512, y: 1002, r: 191, g: 185, b: 159, score: 0.8},
		{x: 499, y: 887, r: 238, g: 123, b: 60, score: 0.85},
		{x: 569, y: 996, r: 203, g: 206, b: 187, score: 0.8},
		{x: 1900, y: 51, r: 2, g: 30, b: 42},
	],
	"guide08": [
		{x: 1638, y: 90, r: 242, g: 249, b: 242, score: 0.85 },
		{x: 1574, y: 64, r: 156, g: 137, b: 32, score: 0.8},
		{x: 1638, y: 180, r: 244, g: 160, b: 88, score: 0.8},
		{x: 1811, y: 96, r: 20, g: 20, b: 20},
	],
	"guide06": [
		{x: 1248, y: 1002, r: 248, g: 235, b: 201, score: 0.85 },
		{x: 1241, y: 893, r: 248, g: 118, b: 60, score: 0.9},
		{x: 1273, y: 990, r: 206, g: 31, b: 4, score: 0.85},
	],
	"guide05": [
		{x: 1088, y: 77, r: 249, g: 254, b: 248, score: 0.85 },
		{x: 1036, y: 64, r: 175, g: 165, b: 116, score: 0.85 },
		{x: 1798, y: 109, r: 19, g: 19, b: 17},
		{x: 1100, y: 180, r: 250, g: 142, b: 67, score: 0.85 },
	],
	"guide04": [
		{x: 1593 , y: 57 , r: 113 , g: 124 , b: 90, score: 0.85 },
		{x: 1509 , y: 51 , r: 217 , g: 213 , b: 166 },
		{x: 537 , y: 841 , r: 22 , g: 17 , b: 0 },
		{x: 1567 , y: 160 , r: 249 , g: 167 , b: 94, score: 0.85 },
	],
	"guide03": [
		{x: 268 , y: 57 , r: 249 , g: 255 , b: 253 },
		{x: 102 , y: 45 , r: 8 , g: 16 , b: 1 },
		{x: 210 , y: 51 , r: 180 , g: 170 , b: 122, score: 0.85 },
		{x: 274 , y: 172 , r: 252 , g: 180 , b: 95 },
	],
	"guide02": [
		{x: 6, y: 398, r: 250, g: 245, b: 152},
		{x: 236, y: 867, r: 7, g: 6, b: 1},
		{x: 1632, y: 925, r: 60 , g: 62 , b: 61},
		{x: 1753, y: 38, r: 68 , g: 70 , b: 65},
	],
	"guide01": [
		{x: 1068 , y: 192 , r: 75 , g: 57 , b: 53 },
		{x: 1215 , y: 192 , r: 45 , g: 11 , b: 10 },
		{x: 1734 , y: 198 , r: 166 , g: 51 , b: 54 },
		{x: 960 , y: 996 , r: 74 , g: 53 , b: 0 },
	],
	"autoBattleCancel": [
		{x: 1478, y: 192, r: 251, g: 253, b: 248},
		{x: 742, y: 192, r: 78, g: 94, b: 107},
		{x: 1209, y: 199, r: 78, g: 94, b: 107},
		{x: 1113, y: 874, r: 247, g: 122, b: 76},
	],
	"exitGame": [
		{x: 748, y: 803, r: 117, g: 133, b: 148},
		{x: 1043, y: 829, r: 84, g: 174, b: 162},
		{x: 1286, y: 257, r: 78, g: 94, b: 107},
		{x: 1344, y: 816, r: 247, g: 122, b: 76},
	],
	"exitFeverBuff": [
		{x: 1478, y: 192, r: 251, g: 253, b: 248},
		{x: 1292, y: 192, r: 78, g: 94, b: 107},
		{x: 633, y: 186, r: 78, g: 94, b: 107},
		{x: 1376, y: 816, r: 247, g: 122, b: 76},
	],
	"task_two_select": [
		{x: 614, y: 816, r: 84, g: 174, b: 162},
		{x: 614, y: 919, r: 247, g: 122, b: 76},
		{x: 1875, y: 1028, r: 10, g: 10, b: 8},
	],
	"task_two_select2": [
		{x: 608, y: 816, r: 247, g: 122, b: 76},
		{x: 614, y: 912, r: 247, g: 122, b: 76},
		{x: 1875, y: 1028, r: 10, g: 10, b: 8},
	],
	"blackBottom": [
		{x: 499, y: 964, r: 13, g: 11, b: 0, score: 0.8},
		{x: 505, y: 1035, r: 20, g: 20, b: 20, score: 0.8},
		{x: 32, y: 1060, r: 7, g: 8, b: 2},
		{x: 1894, y: 1054, r: 4, g: 3, b: 0},
	],
	"autoPlayBtn": [
		{x: 538, y: 1034, r: 161 , g: 199 , b: 122, score: 0.8},
		{x: 471, y: 958, r: 156 , g: 135 , b: 92, score: 0.8},
		{x: 511, y: 987, r: 215 , g: 213 , b: 190, score: 0.8},
	],
	"skillPage": [
		{x: 953, y: 57, r: 78, g: 94, b: 107},
		{x: 140, y: 919, r: 75, g: 77, b: 74},
		{x: 576, y: 983, r: 222, g: 228, b: 226},
		{x: 691, y: 623, r: 62, g: 64, b: 61},
	],
	"otherPage": [
		{x: 1862, y: 64, r: 248, g: 253, b: 249},
		{x: 716, y: 70, r: 78, g: 94, b: 107},
		{x: 1184, y: 70, r: 78, g: 94, b: 107},
		// {x: 115, y: 990, r: 75, g: 77, b: 74},
	],
	"suggest_ware_confirm": [
		{x: 1759 , y: 462 , r: 246 , g: 175 , b: 147, score: 0.8 },
		{x: 1644 , y: 462 , r: 117 , g: 133 , b: 148, score: 0.8 },
	],
};

function MapleM() {
	this.running = false;
	this.noAutoCount = 0;
	this.unknownCount = 0;
}

MapleM.prototype.getScreenshot = function() {
	return getScreenshotModify(0, 0, gUserWidth, gUserHeight, gResizeWidth, gResizeHeight, 90);
}

MapleM.prototype.isSamePoint = function(img, xyColor) {
	var x = Math.floor(xyColor.x * gDevToImgRatio);
	var y = Math.floor(xyColor.y * gDevToImgRatio);
	var c = getImageColor(img, x, y);
	var s = Colors.identityScore(c, xyColor);
	if (xyColor.score !== undefined && s > xyColor.score) {
		return true;
	} else if (s > 0.85) {
		return true;
	}
	return false;
}

MapleM.prototype.clickPoint = function(xy) {
	var x = Math.floor(xy.x * gDevToUserRatio);
	var y = Math.floor(xy.y * gDevToUserRatio);
	tap(x, y, 20);
}

MapleM.prototype.tapDown = function(xy) {
	var x = Math.floor(xy.x * gDevToUserRatio);
	var y = Math.floor(xy.y * gDevToUserRatio);
	tapDown(x, y, 20);
}

MapleM.prototype.tapUp = function(xy) {
	var x = Math.floor(xy.x * gDevToUserRatio);
	var y = Math.floor(xy.y * gDevToUserRatio);
	tapDown(x, y, 20);
}

MapleM.prototype.printPage = function(name) {
	var img = this.getScreenshot();
	console.log('name', name);
	var pageColors = gPageColors[name];
	for(var i in pageColors) {
		var xyColor = pageColors[i];
		var x = Math.floor(xyColor.x * gDevToImgRatio);
		var y = Math.floor(xyColor.y * gDevToImgRatio);
		var c = getImageColor(img, x, y);
		var s = Colors.identityScore(c, xyColor);
		console.log('{r:', c.r, ', g:', c.g, ', b:', c.b, '}', s);
	}
	releaseImage(img);
}

MapleM.prototype.getCurrentPage = function() {
	var img = this.getScreenshot();
	var cPage = "unknown";
	for (var key in gPageColors) {
		var isPage = true;
		var pageColors = gPageColors[key];
		for(var i in pageColors) {
			var xyColor = pageColors[i];
			var isSamePoint = this.isSamePoint(img, xyColor);
			if (!isSamePoint) {
				isPage = false;
				break;
			}
		}
		if (isPage) {
			cPage = key;
			break;
		}
	}
	releaseImage(img);
	return cPage;
}

MapleM.prototype.guide01 = function() {
	// walk right
	this.tapDown(gBtnGuide01);
	sleep(8000);
	this.tapUp(gBtnGuide01);
}

MapleM.prototype.guide03 = function() {
	this.clickPoint({x: 274, y: 57}); sleep(500);
	var xyColor = {x: 902, y: 237, r: 247, g: 252, b: 246};
	var img = this.getScreenshot();
	var isGuide07 = this.isSamePoint(img, xyColor);
	releaseImage(img);
	if (isGuide07) {
		for (var i in gBtnGuide07) {
			var xy = gBtnGuide07[i];
			this.clickPoint(xy);
			sleep(3500);
		}
	} else {
		for (var i in gBtnGuide03) {
			var xy = gBtnGuide03[i];
			this.clickPoint(xy);
			sleep(3500);
		}
	}
}

MapleM.prototype.guide04 = function() {
	for (var i in gBtnGuide04) {
		var xy = gBtnGuide04[i];
		this.clickPoint(xy);
		sleep(3500);
	}
}

MapleM.prototype.guide05 = function() {
	this.clickPoint({x: 1088, y: 70}); sleep(4000);
	var xyColor = {x: 236, y: 597, r: 238, g: 141, b: 62, score: 0.8};
	var img = this.getScreenshot();
	var isGuide09 = this.isSamePoint(img, xyColor);
	releaseImage(img);
	if (isGuide09) {
		for (var i in gBtnGuide09) {
			var xy = gBtnGuide09[i];
			this.clickPoint(xy);
			sleep(3500);
		}
	} else {
		for (var i in gBtnGuide05) {
			var xy = gBtnGuide05[i];
			this.clickPoint(xy);
			sleep(3500);
		}
	}
	
}

MapleM.prototype.guide06 = function() {
	for (var i in gBtnGuide06) {
		var xy = gBtnGuide06[i];
		this.clickPoint(xy);
		sleep(3500);
	}
}

MapleM.prototype.guide08 = function() {
	for (var i in gBtnGuide08) {
		var xy = gBtnGuide08[i];
		this.clickPoint(xy);
		sleep(3500);
	}
}

MapleM.prototype.s01_launchGame = function() {
  execute('am start -n com.nexon.maplem.global/com.nexon.maplem.module.MapleUnityActivity');
}

MapleM.prototype.s02_touchToStart = function() {
}

MapleM.prototype.run = function() {
	var currentPage = this.getCurrentPage();
	// sleep(300)
	// var currentPage2 = this.getCurrentPage();
	// if (currentPage !== currentPage2) {
	// 	return;
	// }
	console.log("current page", currentPage, this.noAutoCount, this.unknownCount);
	switch (currentPage) {
	case "unknown":
		this.unknownCount++;
		this.clickPoint(gBtnUnknown);
		if (this.unknownCount === 20) {
			keycode('BACK', 20);
			this.unknownCount = 0;
		}
		break;
	case "guide01":
		this.guide01();
		break;
	case "guide03":
		this.guide03();
		break;
	case "guide04":
		this.guide04();
		break;
	case "guide05":
		this.guide05();
		break;
	case "guide06":
		this.guide06();
		break;
	case "guide08":
		this.guide08();
		break;
	case "blackBottom":
		this.clickPoint({x: 140, y: 83});
		this.clickPoint({x: 953, y: 507});
		break;
	case "autoPlayBtn":
		this.noAutoCount++;
		break;
	case "goFindNPC":
		break;
	case "skillPage":
		this.clickPoint({x: 1779, y: 572}); sleep(500);
		this.clickPoint({x: 1779, y: 572}); sleep(500);
		this.clickPoint({x: 1792, y: 379}); sleep(500);
		break;
	default:
		if (gPageColors[currentPage] === undefined) {
			console.log('Error page not found', currentPage);
			break;
		}
		this.clickPoint(gPageColors[currentPage][0]);
		break;
	}
	if (currentPage !== "unknown") {
		this.unknownCount = 0;
	}
	if (currentPage !== "autoPlayBtn") {
		this.noAutoCount = 0;
	}
	if (this.noAutoCount == 2) {
		console.log("Select task 2");
		this.clickPoint(gBtnSelectTask[1]);
	} else if (this.noAutoCount == 4) {
		console.log("Select task 1");
		this.clickPoint(gBtnSelectTask[0]);
		this.noAutoCount = 0;
	}
}

MapleM.prototype.start = function() {
	if (this.running === true) {
		return;
	}
	this.running = true;
	while(this.running) {
		this.run();
		sleep(300);
	}
}

MapleM.prototype.stop = function() {
	this.running = false;
}

var m = undefined;

function start() {
	if (m == undefined) {
		m = new MapleM();
	}
	m.start();
}

function stop() {
	if (m != undefined) {
		m.stop();
		m = undefined;
	}
}

// start();

// unknown, click, then back

var m = new MapleM();
var page = m.getCurrentPage();
console.log(page);
m.run();

// m.printPage('menu');
// m.guide03();
// m.clickPoint(gPageColors['guide02'][0]);
// m.clickPoint(gBtnSelectRole[gConfig.selectRole]);
// m.clickPoint(gBtnStartGame);