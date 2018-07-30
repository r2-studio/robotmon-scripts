
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
	{x: 268,y: 222}, {x: 452,y: 222}, {x: 665,y: 227}, {x: 166,y: 497}, {x: 362,y: 497},
];
var gBtnStartGame = {x: 1160, y: 608, r: 144, g: 187, b: 22};
var gBtnGuide01 = {x: 238, y:578};
var gBtnGuide03 = [
	{x: 183, y: 38},
	{x: 456, y: 158},
	{x: 785, y: 231},
	{x: 1126, y: 630},
	{x: 1164, y: 638},
	{x: 1126, y: 630},
	{x: 1126, y: 630},
	{x: 1126, y: 630},
	{x: 1126, y: 630},
	{x: 657, y: 638},
	{x: 1245, y: 38},
	{x: 1245, y: 38},
];
var gBtnGuide04 = [
	{x: 1045, y: 34},
	{x: 72, y: 308},
	{x: 1096, y: 634},
	{x: 1096, y: 634},
	{x: 1096, y: 634},
	{x: 1096, y: 634},
	{x: 648, y: 647},
	{x: 1096, y: 634},
	{x: 648, y: 642},
	{x: 1245, y: 38},
	{x: 1245, y: 38},
];

// ===== script =====
var gDevWidth = 1280;
var gDevHeight = 720;
var gResizeWidth = 640;
var gResizeHeight = 360;
var gDevToImgRatio = 0.5;

var gPageColors = {
	"menu": [
		{x: 1262, y: 702, r: 87, g: 123, b: 62, score: 0.9},
		{x: 25, y: 677, r: 225, g: 185, b: 0, score: 0.9},
		{x: 1177, y: 47, r: 155, g: 184, b: 92, score: 0.9},
	],
	"menu_select_server": [
		{x: 1262, y: 702, r: 87, g: 123, b: 62, score: 0.9},
		{x: 298, y: 42, r: 78, g: 94, b: 107, score: 0.9},
		{x: 972, y: 227, r: 247, g: 252, b: 246, score: 0.9},
	],
	"gamg_select_role_info": [
		{x: 42, y: 42, r: 255, g: 120, b: 86},
		{x: 379, y: 484, r: 247, g: 122, b: 76},
		{x: 1220, y: 64, r: 77, g: 123, b: 156},
	],
	"gamg_select_role": [
		{x: 1160, y: 608, r: 144, g: 187, b: 22},
		{x: 1070, y: 398, r: 238, g: 229, b: 190},
		{x: 469, y: 390, r: 129, g: 150, b: 23},
		{x: 1177, y: 150, r: 221, g: 195, b: 136},
	],
	"welcome": [
		{x: 1105, y: 68, r: 28, g: 37, b: 32},
		{x: 652, y: 72, r: 161, g: 210, b: 215},
		{x: 652, y: 180, r: 236, g: 121, b: 30},
		{x: 298, y: 557, r: 42, g: 41, b: 37},
	],
	"task_dialog_ignore": [
		{x: 68, y: 50, r: 218, g: 213, b: 209, score: 0.8},
		{x: 1258, y: 702, r: 0, g: 0, b: 0},
		{x: 12, y: 707, r: 1, g: 2, b: 0},
	],
	"task_dialog_confirm": [
		{x: 1211, y: 651, r: 247, g: 122, b: 76},
		{x: 1258, y: 702, r: 4, g: 3, b: 0},
		{x: 12, y: 707, r: 1, g: 2, b: 0},
	],
	"task_dialog_confirm2": [
		{x: 1130, y: 634, r: 247, g: 122, b: 76},
		{x: 1258, y: 702, r: 4, g: 3, b: 0},
		{x: 12, y: 707, r: 1, g: 2, b: 0},
	],
	"task_dialog_skip": [
		{x: 1216, y: 120, r: 215 , g: 231 , b: 230},
		{x: 870, y: 128, r: 36 , g: 56 , b: 63},
		{x: 832, y: 420, r: 236, g: 242, b: 238},
	],
	"task_done": [
		{x: 721, y: 642, r: 247, g: 122, b: 76},
		{x: 494, y: 55, r: 78, g: 94, b: 107},
		{x: 823, y: 60, r: 78, g: 94, b: 107},
	],
	"online_sign": [
		{x: 1152, y: 60, r: 249, g: 252, b: 245},
		{x: 200, y: 64, r: 78, g: 94, b: 107},
		{x: 1062, y: 64, r: 78, g: 94, b: 107},
		{x: 1152, y: 681, r: 234, g: 239, b: 233},
	],
	"suggest_ware_confirm": [
		{x: 1173, y: 308, r: 246, g: 175, b: 147},
		{x: 1096, y: 308, r: 117, g: 133, b: 148},
	],
	"guide04": [
		{x: 1062, y: 38, r: 142, g: 156, b: 156},
		{x: 1006, y: 34, r: 213 , g: 214 , b: 172},
		{x: 358, y: 561, r: 33, g: 28, b: 8},
		{x: 1045, y: 107, r: 250, g: 156, b: 96, score: 0.7},
	],
	"guide03": [
		{x: 179, y: 38, r: 249, g: 255, b: 253},
		{x: 68, y: 30, r: 8, g: 16, b: 1},
		{x: 140, y: 34, r: 190, g: 187, b: 142, score: 0.7},
		{x: 183, y: 115, r: 252, g: 180, b: 95},
	],
	"guide02": [
		{x: 200, y: 270, r: 63, g: 49, b: 20},
		{x: 426, y: 55, r: 40, g: 16, b: 6},
		{x: 1254, y: 668, r: 23, g: 38, b: 41},
		{x: 1224, y: 145, r: 43, g: 62, b: 66},
	],
	"guide_01": [
		{x: 712, y: 128, r: 75, g: 57, b: 53},
		{x: 810, y: 128, r: 45, g: 11, b: 10},
		{x: 1156, y: 132, r: 166, g: 51, b: 54},
		{x: 640, y: 664, r: 74, g: 53, b: 0},
	],
	
};

function MapleM(){}

MapleM.prototype.getScreenshot = function() {
	return getScreenshotModify(0, 0, gDevWidth, gDevHeight, gResizeWidth, gResizeHeight, 90);
}

MapleM.prototype.isSamePoint = function(img, xyColor) {
	var x = Math.floor(xyColor.x * gDevToImgRatio);
	var y = Math.floor(xyColor.y * gDevToImgRatio);
	var c = getImageColor(img, x, y);
	var s = Colors.identityScore(c, xyColor);
	if (xyColor.score !== undefined && s > xyColor.score) {
		return true;
	} else if (s > 0.9) {
		return true;
	}
	return false;
}

MapleM.prototype.clickPoint = function(xy) {
	tap(xy.x, xy.y, 20);
}

MapleM.prototype.tapDown = function(xy) {
	tapDown(xy.x, xy.y, 20);
}

MapleM.prototype.tapUp = function(xy) {
	tapDown(xy.x, xy.y, 20);
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
		console.log('{r:', c.r, ', g:', c.g, ', b:', c.b, '}');
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
	// walk right
	for (var i in gBtnGuide03) {
		var xy = gBtnGuide03[i];
		this.clickPoint(xy);
		sleep(2000);
	}
}

MapleM.prototype.guide04 = function() {
	// walk right
	for (var i in gBtnGuide04) {
		var xy = gBtnGuide04[i];
		this.clickPoint(xy);
		sleep(2000);
	}
}

MapleM.prototype.s01_launchGame = function() {
  execute('am start -n com.nexon.maplem.global/com.nexon.maplem.module.MapleUnityActivity');
}

MapleM.prototype.s02_touchToStart = function() {
}

// unknown, click, then back

var m = new MapleM();
var page = m.getCurrentPage();
console.log(page);
// m.printPage('guide04');
// m.guide03();
// m.clickPoint(gPageColors['guide02'][0]);
// m.clickPoint(gBtnSelectRole[gConfig.selectRole]);
// m.clickPoint(gBtnStartGame);