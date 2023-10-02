var window = window || {};

/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/Rerouter/dist/index.js":
/*!*********************************************!*\
  !*** ./node_modules/Rerouter/dist/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
__exportStar(__webpack_require__(/*! ./src/screen */ "./node_modules/Rerouter/dist/src/screen.js"), exports);
__exportStar(__webpack_require__(/*! ./src/rerouter */ "./node_modules/Rerouter/dist/src/rerouter.js"), exports);
__exportStar(__webpack_require__(/*! ./src/struct */ "./node_modules/Rerouter/dist/src/struct.js"), exports);
__exportStar(__webpack_require__(/*! ./src/utils */ "./node_modules/Rerouter/dist/src/utils.js"), exports);
exports.version = 1;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/rerouter.js":
/*!****************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/rerouter.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rerouter = exports.Rerouter = void 0;
var struct_1 = __webpack_require__(/*! ./struct */ "./node_modules/Rerouter/dist/src/struct.js");
var screen_1 = __webpack_require__(/*! ./screen */ "./node_modules/Rerouter/dist/src/screen.js");
var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/Rerouter/dist/src/utils.js");
var Rerouter = /** @class */ (function () {
    function Rerouter() {
        this.debug = true;
        this.defaultConfig = struct_1.DefaultConfigValue;
        this.rerouterConfig = struct_1.DefaultRerouterConfig;
        this.screenConfig = struct_1.DefaultScreenConfig;
        this.screen = new screen_1.Screen(this.screenConfig);
        this.running = false;
        this.routes = [];
        this.tasks = [];
        this.routeContext = null;
        this.unknownRouteAction = null;
    }
    /**
     * Recalculate some value like device width or height in screenConfig
     */
    Rerouter.prototype.init = function () {
        // sort routes by priority
        this.routes.sort(function (a, b) { return b.priority - a.priority; });
        // check and calculate screen config
        var deviceWH = getScreenSize();
        var max = Math.max(deviceWH.width, deviceWH.height);
        var min = Math.min(deviceWH.width, deviceWH.height);
        var dWidth = this.screenConfig.rotation === 'horizontal' ? max : min;
        var dHeight = this.screenConfig.rotation === 'vertical' ? max : min;
        this.screenConfig.deviceWidth = this.screenConfig.deviceWidth || dWidth;
        this.screenConfig.deviceHeight = this.screenConfig.deviceHeight || dHeight;
        this.screenConfig.screenWidth = this.screenConfig.screenWidth || dWidth;
        this.screenConfig.screenHeight = this.screenConfig.screenHeight || dHeight;
        this.log("screenWidth: ".concat(this.screenConfig.screenWidth, ", screenHeight: ").concat(this.screenConfig.screenHeight));
        // new screen if screen config changed
        this.screen = new screen_1.Screen(this.screenConfig);
    };
    /**
     * Add RouteConfig to Rerouter routes, after starting Rerouter will run over all RouteConfigs to match screen and do action
     * @param config information about how route match and route action
     */
    Rerouter.prototype.addRoute = function (config) {
        this.routes.push(this.wrapRouteConfigWithDefault(config));
    };
    /**
     * Tell Rerouter what to do if not matching any route
     * @param action function to do if not matching
     */
    Rerouter.prototype.addUnknownAction = function (action) {
        this.unknownRouteAction = action;
    };
    /**
     * Add TaskConfig to Rerouter tasks, after starting Rerouter will run over all Tasks by task condition
     * @param config information about how task works
     */
    Rerouter.prototype.addTask = function (config) {
        this.tasks.push({
            name: config.name,
            config: this.wrapTaskConfigWithDefault(config),
            startTime: 0,
            lastRunTime: 0,
            runTimes: 0,
        });
    };
    /**
     * start Rerouter to run over tasks and routes
     * @param packageName
     */
    Rerouter.prototype.start = function (packageName) {
        this.rerouterConfig.packageName = packageName;
        // check tasks
        if (this.tasks.length === 0) {
            this.log("Rerouter start failed, no tasks ...");
            return;
        }
        this.init();
        this.log("Rerouter started ...");
        // task controller
        this.running = true;
        this.startTaskLoop();
        this.log("Rerouter stopped ...");
    };
    /**
     * stop Rerouter
     */
    Rerouter.prototype.stop = function () {
        this.log("Rerouter stop called, trying to stop task loop");
        this.running = false;
        if (this.routeContext !== null) {
            this.routeContext.scriptRunning = false;
        }
    };
    Rerouter.prototype.checkInApp = function () {
        var packageName = utils_1.Utils.getCurrentApp()[0];
        if (packageName === this.rerouterConfig.packageName) {
            return true;
        }
        return utils_1.Utils.isAppOnTop(this.rerouterConfig.packageName);
    };
    Rerouter.prototype.checkAndStartApp = function () {
        if (!this.checkInApp()) {
            this.log("AppIsNotStarted, startApp ".concat(this.rerouterConfig.packageName));
            this.startApp();
            return true;
        }
        return false;
    };
    Rerouter.prototype.startApp = function () {
        if (!this.rerouterConfig.packageName) {
            this.log("Rerouter start app failed, no packageName ...");
            return;
        }
        utils_1.Utils.startApp(this.rerouterConfig.packageName);
        utils_1.Utils.sleep(this.rerouterConfig.startAppDelay);
    };
    Rerouter.prototype.stopApp = function () {
        if (!this.rerouterConfig.packageName) {
            this.log("Rerouter stop app failed, no packageName ...");
            return;
        }
        utils_1.Utils.stopApp(this.rerouterConfig.packageName);
        utils_1.Utils.sleep(1000);
    };
    Rerouter.prototype.restartApp = function () {
        this.stopApp();
        this.startApp();
    };
    Rerouter.prototype.goNext = function (page) {
        if (page.next !== undefined) {
            this.screen.tap(page.next);
        }
        else {
            this.warning("".concat(page.name, " action == goNext, but no next xy"));
        }
    };
    Rerouter.prototype.goBack = function (page) {
        if (page.back !== undefined) {
            this.screen.tap(page.back);
        }
        else {
            this.warning("".concat(page.name, " action == goBack, but no back xy"));
        }
    };
    Rerouter.prototype.isPageMatch = function (page) {
        var image = this.screen.getCvtDevScreenshot();
        var isMatch = this.isPageMatchImage(page, image);
        releaseImage(image);
        return isMatch;
    };
    Rerouter.prototype.isPageMatchImage = function (page, image) {
        if (typeof page === 'string') {
            var p = this.getPageByName(page);
            if (p === null) {
                this.warning("isPageMatchImage ".concat(page, " not exist"));
                return false;
            }
            page = p;
        }
        if (page instanceof struct_1.Page) {
            return this.isMatchPageImpl(image, page, this.defaultConfig.PageThres, this.debug);
        }
        else {
            var pages = this.isMatchGroupPageImpl(image, page, this.defaultConfig.GroupPageThres, this.debug);
            return pages.length > 0;
        }
    };
    Rerouter.prototype.getPagesMatch = function (groupPage) {
        var image = this.screen.getCvtDevScreenshot();
        var match = this.getPagesMatchImage(groupPage, image, this.defaultConfig.GroupPageThres);
        releaseImage(image);
        return match;
    };
    Rerouter.prototype.getPagesMatchImage = function (groupPage, image, parentThres, debug) {
        var _a, _b;
        var pages = [];
        var thres = (_b = (_a = groupPage.thres) !== null && _a !== void 0 ? _a : parentThres) !== null && _b !== void 0 ? _b : this.defaultConfig.PageThres;
        for (var i = 0; i < groupPage.pages.length; i++) {
            var page = groupPage.pages[i];
            var isPageMatch = this.isMatchPageImpl(image, page, thres, this.debug);
            if (isPageMatch) {
                pages.push(page);
            }
        }
        return pages;
    };
    Rerouter.prototype.waitScreenForMatchingPage = function (page, timeout, matchTimes, interval) {
        var _this = this;
        if (matchTimes === void 0) { matchTimes = 1; }
        if (interval === void 0) { interval = 600; }
        return utils_1.Utils.waitForAction(function () { return _this.isPageMatch(page); }, timeout, matchTimes, interval);
    };
    Rerouter.prototype.isRouteMatch = function (route) {
        var image = this.screen.getCvtDevScreenshot();
        var isMatch = this.isRouteMatchImage(route, image);
        releaseImage(image);
        return isMatch;
    };
    Rerouter.prototype.isRouteMatchImage = function (route, image) {
        var routeConfig = this.getRouteConfig(route);
        if (routeConfig === null) {
            this.warning("isRouteMatchImage ".concat(route, " not exist"));
            return false;
        }
        var filledRouteConfig = this.wrapRouteConfigWithDefault(routeConfig);
        var rotation = this.screen.getImageRotation(image);
        var isMatched = this.isMatchRouteImpl(image, rotation, filledRouteConfig, 'waitScreenForMatchingRoute').isMatched;
        if (isMatched) {
            return true;
        }
        return false;
    };
    Rerouter.prototype.waitScreenForMatchingRoute = function (route, timeout, matchTimes, interval) {
        var _this = this;
        if (matchTimes === void 0) { matchTimes = 1; }
        if (interval === void 0) { interval = 600; }
        return utils_1.Utils.waitForAction(function () { return _this.isRouteMatch(route); }, timeout, matchTimes, interval);
    };
    Rerouter.prototype.getPageByName = function (name) {
        var _a;
        for (var _i = 0, _b = this.routes; _i < _b.length; _i++) {
            var route = _b[_i];
            if (name === ((_a = route.match) === null || _a === void 0 ? void 0 : _a.name)) {
                return route.match;
            }
        }
        return null;
    };
    Rerouter.prototype.getRouteConfigByPath = function (path) {
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            if (path === route.path) {
                return route;
            }
        }
        return null;
    };
    Rerouter.prototype.getCurrentMatchNames = function () {
        var _this = this;
        var image = this.screen.getCvtDevScreenshot();
        var matchedNames = [];
        this.routes.forEach(function (route) {
            var match = route.match;
            if ((match instanceof struct_1.Page && _this.isMatchPageImpl(image, match, _this.defaultConfig.PageThres, _this.debug)) ||
                (match instanceof struct_1.GroupPage && _this.isMatchGroupPageImpl(image, match, _this.defaultConfig.PageThres, _this.debug).length > 0)) {
                matchedNames.push(match.name);
            }
        });
        this.log("current match: ", matchedNames);
        return matchedNames;
    };
    Rerouter.prototype.getRouteConfig = function (r) {
        var route;
        if (typeof r === 'string') {
            route = this.getRouteConfigByPath(r);
        }
        else {
            route = r;
        }
        return route;
    };
    Rerouter.prototype.wrapRouteConfigWithDefault = function (config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            path: config.path,
            action: config.action,
            match: (_a = config.match) !== null && _a !== void 0 ? _a : null,
            customMatch: (_b = config.customMatch) !== null && _b !== void 0 ? _b : null,
            rotation: (_c = config.rotation) !== null && _c !== void 0 ? _c : this.screenConfig.rotation,
            shouldMatchTimes: (_d = config.shouldMatchTimes) !== null && _d !== void 0 ? _d : this.defaultConfig.RouteConfigShouldMatchTimes,
            shouldMatchDuring: (_e = config.shouldMatchDuring) !== null && _e !== void 0 ? _e : this.defaultConfig.RouteConfigShouldMatchDuring,
            beforeActionDelay: (_f = config.beforeActionDelay) !== null && _f !== void 0 ? _f : this.defaultConfig.RouteConfigBeforeActionDelay,
            afterActionDelay: (_g = config.afterActionDelay) !== null && _g !== void 0 ? _g : this.defaultConfig.RouteConfigAfterActionDelay,
            priority: (_h = config.priority) !== null && _h !== void 0 ? _h : this.defaultConfig.RouteConfigPriority,
            debug: (_j = config.debug) !== null && _j !== void 0 ? _j : this.defaultConfig.RouteConfigDebug,
        };
    };
    Rerouter.prototype.wrapTaskConfigWithDefault = function (config) {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            name: config.name,
            maxTaskRunTimes: (_a = config.maxTaskRunTimes) !== null && _a !== void 0 ? _a : this.defaultConfig.TaskConfigMaxTaskRunTimes,
            maxTaskDuring: (_b = config.maxTaskDuring) !== null && _b !== void 0 ? _b : this.defaultConfig.TaskConfigMaxTaskDuring,
            minRoundInterval: (_c = config.minRoundInterval) !== null && _c !== void 0 ? _c : this.defaultConfig.TaskConfigMinRoundInterval,
            forceStop: (_d = config.forceStop) !== null && _d !== void 0 ? _d : this.defaultConfig.TaskConfigAutoStop,
            findRouteDelay: (_e = config.findRouteDelay) !== null && _e !== void 0 ? _e : this.defaultConfig.TaskConfigFindRouteDelay,
            beforeRoute: (_f = config.beforeRoute) !== null && _f !== void 0 ? _f : null,
            afterRoute: (_g = config.afterRoute) !== null && _g !== void 0 ? _g : null,
        };
    };
    Rerouter.prototype.startTaskLoop = function () {
        var taskIdx = 0;
        while (this.running) {
            var task = this.tasks[taskIdx % this.tasks.length];
            taskIdx++;
            var now = Date.now();
            var isTaskRunFirstTime = task.lastRunTime === 0;
            if (now - task.lastRunTime <= task.config.minRoundInterval && !isTaskRunFirstTime) {
                this.log("Task: ".concat(task.name, " during: ").concat(now - task.lastRunTime, " <= minRoundInterval, skip"));
                utils_1.Utils.sleep(this.rerouterConfig.taskDelay);
                continue;
            }
            task.startTime = now;
            task.runTimes = 0;
            var exitTask = false;
            for (var i = 0; i < task.config.maxTaskRunTimes && this.running && !exitTask; i++) {
                this.log("Task: ".concat(task.name, " run ").concat(task.runTimes));
                var skipRoute = false;
                if (task.config.beforeRoute !== null) {
                    this.log("Task: ".concat(task.name, " run ").concat(task.runTimes, " do beforeRoute()"));
                    if (task.config.beforeRoute(task) === 'skipRouteLoop') {
                        skipRoute = true;
                    }
                }
                if (skipRoute) {
                    this.log("Task: ".concat(task.name, " run ").concat(task.runTimes, " skipRouteLoop"));
                }
                else {
                    exitTask = this.startRouteLoop(task);
                }
                if (task.config.afterRoute !== null) {
                    this.log("Task: ".concat(task.name, " run ").concat(task.runTimes, " do afterRoute()"));
                    task.config.afterRoute(task);
                }
                task.runTimes++;
                task.lastRunTime = now;
                var during = now - task.startTime;
                if (task.config.maxTaskDuring > 0 && during >= task.config.maxTaskDuring) {
                    this.log("Task: ".concat(task.name, " taskDuring: ").concat(during, "/").concat(task.config.maxTaskDuring, " reached, stop"));
                    break;
                }
            }
            utils_1.Utils.sleep(this.rerouterConfig.taskDelay);
        }
    };
    Rerouter.prototype.startRouteLoop = function (task) {
        var _this = this;
        var _a, _b, _c;
        this.routeContext = {
            task: task,
            screen: this.screen,
            scriptRunning: this.running,
            path: '',
            lastMatchedPath: (_b = (_a = this.routeContext) === null || _a === void 0 ? void 0 : _a.lastMatchedPath) !== null && _b !== void 0 ? _b : '',
            matchTimes: 0,
            matchStartTS: 0,
            matchDuring: 0,
        };
        var routeLoop = true;
        var exitTaskResult = false;
        var finishRoundFunc = function (exitTask) {
            var _a;
            if (exitTask === void 0) { exitTask = false; }
            routeLoop = false;
            exitTaskResult = exitTask;
            _this.log("finish round: ".concat((_a = _this.routeContext) === null || _a === void 0 ? void 0 : _a.task.name, "; exitTask: ").concat(exitTask));
        };
        // pointer for short code
        var context = this.routeContext;
        while (routeLoop && this.running) {
            var now = Date.now();
            // check task.autoStop
            var taskRunDuring = now - task.startTime;
            if (task.config.forceStop && taskRunDuring > task.config.maxTaskDuring) {
                this.log("Task ".concat(task.name, " AutoStop, exceed taskRunDuring"));
                break;
            }
            // check isAppOn or auto launch it
            if (this.rerouterConfig.autoLaunchApp) {
                if (this.checkAndStartApp()) {
                    continue;
                }
            }
            var rotation = this.screen.getRotation();
            var image = this.screen.getCvtDevScreenshot();
            var _d = this.findMatchedRouteImpl(task.name, image, rotation), matchedRoute = _d.matchedRoute, matchedPages = _d.matchedPages;
            // context.matchStartTS = 0 if init run
            context.matchStartTS = context.matchStartTS || now;
            context.path = (_c = matchedRoute === null || matchedRoute === void 0 ? void 0 : matchedRoute.path) !== null && _c !== void 0 ? _c : '';
            // first match
            if (context.path !== context.lastMatchedPath) {
                context.matchTimes = 0;
                context.matchStartTS = now;
            }
            context.matchDuring = now - context.matchStartTS;
            context.matchTimes++;
            if (matchedRoute === null) {
                if (this.unknownRouteAction !== null) {
                    this.unknownRouteAction(context, image, finishRoundFunc);
                }
            }
            else {
                this.doActionForRoute(context, image, matchedRoute, matchedPages, finishRoundFunc);
            }
            // update lastMatchedPath after action done
            // otherwise the lastMatchedPath will be current path when doing action
            context.lastMatchedPath = context.path;
            releaseImage(image);
            utils_1.Utils.sleep(task.config.findRouteDelay);
        }
        return exitTaskResult;
    };
    Rerouter.prototype.doActionForRoute = function (context, image, route, matchedPages, finishRound) {
        var _a, _b;
        this.logImpl(route.debug, "handleMatchedRoute: ".concat(route.path, ", times: ").concat(context.matchTimes, ", during: ").concat(context.matchDuring));
        if (context.matchTimes < route.shouldMatchTimes || context.matchDuring < route.shouldMatchDuring) {
            // should still wait for matching condition
            return;
        }
        var nextXY = (_a = matchedPages[0]) === null || _a === void 0 ? void 0 : _a.next;
        var backXY = (_b = matchedPages[0]) === null || _b === void 0 ? void 0 : _b.back;
        // matched and fit condition, do action
        utils_1.Utils.sleep(route.beforeActionDelay);
        if (route.action === 'goNext') {
            if (nextXY !== undefined) {
                this.screen.tap(nextXY);
            }
            else {
                this.warning("".concat(route.path, " action == goNext, but no next xy"));
            }
        }
        else if (route.action === 'goBack') {
            if (backXY !== undefined) {
                this.screen.tap(backXY);
            }
            else {
                this.warning("".concat(route.path, " action == goBack, but no back xy"));
            }
        }
        else if (route.action === 'keycodeBack') {
            keycode('BACK', this.screenConfig.actionDuring);
        }
        else {
            route.action(context, image, matchedPages, finishRound);
        }
        utils_1.Utils.sleep(route.afterActionDelay);
    };
    Rerouter.prototype.findMatchedRouteImpl = function (taskName, image, rotation) {
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            var _b = this.isMatchRouteImpl(image, rotation, route, taskName), isMatched = _b.isMatched, matchedPages = _b.matchedPages;
            if (isMatched) {
                this.logImpl(route.debug, 'current match:', matchedPages.map(function (p) { return p.name; }));
                return { matchedRoute: route, matchedPages: matchedPages };
            }
        }
        return { matchedRoute: null, matchedPages: [] };
    };
    Rerouter.prototype.isMatchRouteImpl = function (image, rotation, route, taskName) {
        var _a;
        // check rotation
        if (route.rotation !== rotation) {
            this.logImpl(route.debug, "findMatchedRoute ".concat(route.path, " not match rotation, skip"));
            return { isMatched: false, matchedPages: [] };
        }
        var isMatched = false;
        var matchedPages = [];
        // check route.match
        if (route.match !== null) {
            if (route.match instanceof struct_1.Page) {
                var match = this.isMatchPageImpl(image, route.match, this.defaultConfig.PageThres, route.debug);
                if (match) {
                    isMatched = true;
                    matchedPages.push(route.match);
                }
            }
            else if (route.match instanceof struct_1.GroupPage) {
                var match = this.isMatchGroupPageImpl(image, route.match, this.defaultConfig.GroupPageThres, route.debug);
                if (match.length !== 0) {
                    isMatched = true;
                    matchedPages.push.apply(matchedPages, match);
                }
            }
        }
        // check route.isMatch function
        if (!isMatched && route.customMatch !== null) {
            isMatched = route.customMatch(taskName, image);
            this.logImpl(route.debug, "findMatchedRoute ".concat(route.path, " isMatch() => ").concat(isMatched));
        }
        this.logImpl(route.debug, "findMatchedRoute ".concat(route.path, " match: ").concat(isMatched, ", firstPage: ").concat((_a = matchedPages[0]) === null || _a === void 0 ? void 0 : _a.name));
        return {
            isMatched: isMatched,
            matchedPages: matchedPages,
        };
    };
    Rerouter.prototype.isMatchPageImpl = function (image, page, parentThres, debug) {
        var _a;
        var thres = (_a = page.thres) !== null && _a !== void 0 ? _a : parentThres;
        var isSame = true;
        this.logImpl(debug, "checkMatchPage[".concat(page.name, "]"));
        for (var i = 0; i < page.points.length; i++) {
            var point = page.points[i];
            var color = getImageColor(image, point.x, point.y);
            var score = utils_1.Utils.identityColor(point, color);
            var isPointColorMatch = score >= thres;
            if (!isPointColorMatch) {
                isSame = false;
                this.logImpl(debug, "point[".concat(i, "] match false: score: ").concat(score, ", thres: ").concat(thres, "\n"), "expect: ".concat(utils_1.Utils.formatXYRGB(point), "\n"), "   get: ".concat(utils_1.Utils.formatXYRGB(__assign(__assign({}, color), { x: point.x, y: point.y }))));
                break;
            }
        }
        this.logImpl(debug, "checkMatchPage[".concat(page.name, "][match: ").concat(isSame, "]"));
        return isSame;
    };
    Rerouter.prototype.isMatchGroupPageImpl = function (image, groupPage, parentThres, debug) {
        var _a;
        var thres = (_a = groupPage.thres) !== null && _a !== void 0 ? _a : parentThres;
        for (var i = 0; i < groupPage.pages.length; i++) {
            var page = groupPage.pages[i];
            var isPageMatch = this.isMatchPageImpl(image, page, thres, debug);
            this.logImpl(debug, "checkMatchGroupPage: ".concat(groupPage.name, ", page[").concat(i, "]: ").concat(page.name, " match: ").concat(isPageMatch));
            if (groupPage.matchOP === '||' && isPageMatch) {
                return [page];
            }
            if (groupPage.matchOP === '&&' && !isPageMatch) {
                return [];
            }
        }
        return groupPage.matchOP === '&&' ? groupPage.pages : [];
    };
    Rerouter.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logImpl.apply(this, __spreadArray([this.debug], args, false));
    };
    Rerouter.prototype.logImpl = function (debug) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!debug || !this.debug) {
            return;
        }
        // only log when debug + this.debug is true
        utils_1.Utils.log.apply(utils_1.Utils, __spreadArray(['[Rerouter][debug]'], args, false));
    };
    Rerouter.prototype.warning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        utils_1.Utils.log.apply(utils_1.Utils, __spreadArray(['[Rerouter][warning]'], args, false));
    };
    return Rerouter;
}());
exports.Rerouter = Rerouter;
exports.rerouter = new Rerouter();
//# sourceMappingURL=rerouter.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/screen.js":
/*!**************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/screen.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Screen = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/Rerouter/dist/src/utils.js");
var Screen = /** @class */ (function () {
    function Screen(config) {
        this.config = config;
    }
    Screen.prototype.calculateDeviceOffset = function (func) {
        var results = func(this);
        this.config.screenWidth = results.screenWidth;
        this.config.screenHeight = results.screenHeight;
        this.config.screenOffsetX = results.screenOffsetX;
        this.config.screenOffsetY = results.screenOffsetY;
    };
    Screen.prototype.getScreenX = function (devX) {
        return Math.floor(this.config.screenOffsetX + (devX * this.config.screenWidth) / this.config.devWidth) || 0;
    };
    Screen.prototype.getScreenY = function (devY) {
        return Math.floor(this.config.screenOffsetY + (devY * this.config.screenHeight) / this.config.devHeight) || 0;
    };
    Screen.prototype.getScreenXY = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var x = this.getScreenX(p1.x);
            var y = this.getScreenY(p1.y);
            return { x: x, y: y };
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var x = this.getScreenX(p1);
            var y = this.getScreenY(p2);
            return { x: x, y: y };
        }
        else {
            throw new Error("getScreenXY wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.tap = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var x = this.getScreenX(p1.x);
            var y = this.getScreenY(p1.y);
            tap(x, y, this.config.actionDuring);
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var x = this.getScreenX(p1);
            var y = this.getScreenY(p2);
            tap(x, y, this.config.actionDuring);
        }
        else {
            throw new Error("tapDown wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.tapDown = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var x = this.getScreenX(p1.x);
            var y = this.getScreenY(p1.y);
            tapDown(x, y, this.config.actionDuring);
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var x = this.getScreenX(p1);
            var y = this.getScreenY(p2);
            tapDown(x, y, this.config.actionDuring);
        }
        else {
            throw new Error("tapDown wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.moveTo = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var x = this.getScreenX(p1.x);
            var y = this.getScreenY(p1.y);
            moveTo(x, y, this.config.actionDuring);
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var x = this.getScreenX(p1);
            var y = this.getScreenY(p2);
            moveTo(x, y, this.config.actionDuring);
        }
        else {
            throw new Error("tapDown wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.tapUp = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var x = this.getScreenX(p1.x);
            var y = this.getScreenY(p1.y);
            tapUp(x, y, this.config.actionDuring);
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var x = this.getScreenX(p1);
            var y = this.getScreenY(p2);
            tapUp(x, y, this.config.actionDuring);
        }
        else {
            throw new Error("tapDown wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.getScreenColor = function (p1, p2) {
        if (p2 === void 0) { p2 = undefined; }
        if (typeof p1 === 'object') {
            var img = this.getCvtDevScreenshot();
            var rgb = getImageColor(img, p1.x, p1.y);
            releaseImage(img);
            return rgb;
        }
        else if (typeof p1 === 'number' && typeof p2 === 'number') {
            var img = this.getCvtDevScreenshot();
            var rgb = getImageColor(img, p1, p2);
            releaseImage(img);
            return rgb;
        }
        else {
            throw new Error("tapDown wrong params ".concat(p1, ", ").concat(p2));
        }
    };
    Screen.prototype.findImage = function (devImg) {
        var img = this.getCvtDevScreenshot();
        var result = findImage(img, devImg);
        releaseImage(img);
        return result;
    };
    Screen.prototype.tapImage = function (devImg) {
        var xy = this.findImage(devImg);
        this.tap(xy);
    };
    Screen.prototype.isSameColor = function (devColorPoint, thres) {
        if (thres === void 0) { thres = 0.9; }
        var rgb = this.getScreenColor(devColorPoint);
        var score = utils_1.Utils.identityColor(rgb, devColorPoint);
        if (score > thres) {
            return true;
        }
        return false;
    };
    // currently real device screenshot
    Screen.prototype.getDeviceScreenshot = function () {
        return getScreenshot();
    };
    // currently device screenshot cut by offset
    Screen.prototype.getScreenScreenshot = function () {
        return getScreenshotModify(this.config.screenOffsetX, this.config.screenOffsetY, this.config.screenWidth, this.config.screenHeight, this.config.screenWidth, this.config.screenHeight, 100);
    };
    Screen.prototype.getCvtDevScreenshot = function () {
        return getScreenshotModify(this.config.screenOffsetX, this.config.screenOffsetY, this.config.screenWidth, this.config.screenHeight, this.config.devWidth, this.config.devHeight, 100);
    };
    Screen.prototype.getRotation = function () {
        var _a = getScreenSize(), width = _a.width, height = _a.height;
        if (width > height) {
            return 'horizontal';
        }
        return 'vertical';
    };
    Screen.prototype.getImageRotation = function (image) {
        var _a = getImageSize(image), width = _a.width, height = _a.height;
        if (width > height) {
            return 'horizontal';
        }
        return 'vertical';
    };
    Screen.prototype.setActionDuring = function (during) {
        this.config.actionDuring = during;
    };
    Screen.debug = false;
    return Screen;
}());
exports.Screen = Screen;
//# sourceMappingURL=screen.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/struct.js":
/*!**************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/struct.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultScreenConfig = exports.DefaultRerouterConfig = exports.DefaultConfigValue = exports.GroupPage = exports.Page = void 0;
var Page = /** @class */ (function () {
    function Page(name, devPoints, next, back, thres) {
        if (next === void 0) { next = undefined; }
        if (back === void 0) { back = undefined; }
        if (thres === void 0) { thres = undefined; }
        this.name = name;
        this.points = devPoints;
        this.next = next;
        this.back = back;
        this.thres = thres;
    }
    return Page;
}());
exports.Page = Page;
var GroupPage = /** @class */ (function () {
    function GroupPage(name, pages, next, back, thres, matchOP) {
        if (next === void 0) { next = undefined; }
        if (back === void 0) { back = undefined; }
        if (thres === void 0) { thres = undefined; }
        if (matchOP === void 0) { matchOP = undefined; }
        this.name = name;
        this.pages = pages;
        this.next = next;
        this.back = back;
        this.thres = thres;
        this.matchOP = matchOP || '||';
    }
    return GroupPage;
}());
exports.GroupPage = GroupPage;
exports.DefaultConfigValue = {
    XYRGBThres: 0.9,
    PageThres: 0.9,
    GroupPageThres: 0.9,
    GroupPageMatchOP: '||',
    RouteConfigShouldMatchTimes: 1,
    RouteConfigShouldMatchDuring: 0,
    RouteConfigBeforeActionDelay: 250,
    RouteConfigAfterActionDelay: 250,
    RouteConfigPriority: 1,
    RouteConfigDebug: false,
    TaskConfigMaxTaskRunTimes: 1,
    TaskConfigMaxTaskDuring: 0,
    TaskConfigMinRoundInterval: 0,
    TaskConfigAutoStop: false,
    TaskConfigFindRouteDelay: 2000,
};
exports.DefaultRerouterConfig = {
    packageName: '',
    taskDelay: 2000,
    startAppDelay: 6000,
    autoLaunchApp: true,
    testingScreenshotPath: './screenshot',
};
exports.DefaultScreenConfig = {
    devWidth: 640,
    devHeight: 360,
    deviceWidth: 0,
    deviceHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    screenOffsetX: 0,
    screenOffsetY: 0,
    actionDuring: 180,
    rotation: 'horizontal',
};
//# sourceMappingURL=struct.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/utils.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = exports.log = void 0;
function log() {
    var msgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msgs[_i] = arguments[_i];
    }
    var date = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Taipei',
    });
    var message = "[".concat(date, "] ");
    for (var _a = 0, msgs_1 = msgs; _a < msgs_1.length; _a++) {
        var msg = msgs_1[_a];
        if (typeof msg === 'object') {
            message += "".concat(JSON.stringify(msg), " ");
        }
        else {
            message += "".concat(msg, " ");
        }
    }
    console.log(message.substr(0, message.length - 1));
}
exports.log = log;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.identityColor = function (e1, e2) {
        var mean = (e1.r + e2.r) / 2;
        var r = e1.r - e2.r;
        var g = e1.g - e2.g;
        var b = e1.b - e2.b;
        return 1 - Math.sqrt((((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)) / 768;
    };
    Utils.formatXYRGB = function (xyrgb) {
        var keys = Object.keys(xyrgb);
        var formatObj = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var k = keys_1[_i];
            var str = "".concat(xyrgb[k]);
            while (str.length < 3) {
                str = ' ' + str;
            }
            formatObj[k] = str;
        }
        var x = formatObj.x, y = formatObj.y, r = formatObj.r, g = formatObj.g, b = formatObj.b;
        return "{ x: ".concat(x, ", y: ").concat(y, ", r: ").concat(r, ", g: ").concat(g, ", b: ").concat(b, " }");
    };
    Utils.sortStringNumberMap = function (map) {
        var results = [];
        for (var key in map) {
            results.push({ key: key, count: map[key] });
        }
        results.sort(function (a, b) { return b.count - a.count; });
        return results;
    };
    Utils.sleep = function (during) {
        while (during > 200) {
            during -= 200;
            sleep(200);
        }
        if (during > 0) {
            sleep(during);
        }
    };
    Utils.getTaiwanTime = function () {
        return Date.now() + 8 * 60 * 60 * 1000;
    };
    Utils.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (typeof arg === 'object') {
                args[i] = JSON.stringify(arg);
            }
        }
        var date = new Date(Utils.getTaiwanTime());
        var dateString = "[".concat(date.getMonth() + 1, "-").concat(date.getDate(), "T").concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds(), "]");
        console.log.apply(console, __spreadArray([dateString], args, false));
    };
    Utils.notifyEvent = function (event, content) {
        if (sendEvent != undefined) {
            Utils.log('sendEvent', event, content);
            sendEvent('' + event, '' + content);
        }
    };
    Utils.startApp = function (packageName) {
        execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n ".concat(packageName));
        execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n ".concat(packageName));
        execute("ANDROID_DATA=/data monkey --pct-syskeys 0 -p ".concat(packageName, " -c android.intent.category.LAUNCHER 1"));
        execute('ANDROID_BOOTLOGO=1 ' +
            'ANDROID_ROOT=/system ' +
            'ANDROID_ASSETS=/system/app ' +
            'ANDROID_DATA=/data ' +
            'ANDROID_STORAGE=/storage ' +
            'ANDROID_ART_ROOT=/apex/com.android.art ' +
            'ANDROID_I18N_ROOT=/apex/com.android.i18n ' +
            'ANDROID_TZDATA_ROOT=/apex/com.android.tzdata ' +
            'EXTERNAL_STORAGE=/sdcard ' +
            'ASEC_MOUNTPOINT=/mnt/asec ' +
            'BOOTCLASSPATH=/apex/com.android.art/javalib/core-oj.jar:/apex/com.android.art/javalib/core-libart.jar:/apex/com.android.art/javalib/core-icu4j.jar:/apex/com.android.art/javalib/okhttp.jar:/apex/com.android.art/javalib/bouncycastle.jar:/apex/com.android.art/javalib/apache-xml.jar:/system/framework/framework.jar:/system/framework/ext.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/framework-atb-backward-compatibility.jar:/apex/com.android.conscrypt/javalib/conscrypt.jar:/apex/com.android.media/javalib/updatable-media.jar:/apex/com.android.mediaprovider/javalib/framework-mediaprovider.jar:/apex/com.android.os.statsd/javalib/framework-statsd.jar:/apex/com.android.permission/javalib/framework-permission.jar:/apex/com.android.sdkext/javalib/framework-sdkextensions.jar:/apex/com.android.wifi/javalib/framework-wifi.jar:/apex/com.android.tethering/javalib/framework-tethering.jar ' +
            'DEX2OATBOOTCLASSPATH=/apex/com.android.art/javalib/core-oj.jar:/apex/com.android.art/javalib/core-libart.jar:/apex/com.android.art/javalib/core-icu4j.jar:/apex/com.android.art/javalib/okhttp.jar:/apex/com.android.art/javalib/bouncycastle.jar:/apex/com.android.art/javalib/apache-xml.jar:/system/framework/framework.jar:/system/framework/ext.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/framework-atb-backward-compatibility.jar ' +
            'SYSTEMSERVERCLASSPATH=/system/framework/com.android.location.provider.jar:/system/framework/services.jar:/system/framework/ethernet-service.jar:/apex/com.android.permission/javalib/service-permission.jar:/apex/com.android.ipsec/javalib/android.net.ipsec.ike.jar ' +
            "monkey --pct-syskeys 0 -p ".concat(packageName, " -c android.intent.category.LAUNCHER 1"));
    };
    Utils.stopApp = function (packageName) {
        execute("BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop ".concat(packageName));
        execute("ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop ".concat(packageName));
    };
    Utils.getCurrentApp = function () {
        var result = execute('dumpsys window windows').split('mCurrentFocus');
        if (result.length < 2) {
            return ['', ''];
        }
        result = result[1].split(' ');
        if (result.length < 3) {
            return ['', ''];
        }
        result[2] = result[2].replace('}', '');
        result = result[2].split('/');
        var packageName = '';
        var activityName = '';
        if (result.length == 1) {
            packageName = result[0].trim();
        }
        else if (result.length > 1) {
            packageName = result[0].trim();
            activityName = result[1].trim();
        }
        return [packageName, activityName];
    };
    Utils.isAppOnTop = function (packageName) {
        var topInfo = execute('dumpsys activity activities | grep mResumedActivity');
        return topInfo.indexOf(packageName) !== -1;
    };
    Utils.sendSlackMessage = function (url, title, message) {
        var body = {
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '*' + title + '*',
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: message,
                    },
                },
            ],
        };
        httpClient('POST', url, JSON.stringify(body), {
            'Content-Type': 'application/json',
        });
    };
    Utils.waitForAction = function (action, timeout, matchTimes, interval) {
        if (matchTimes === void 0) { matchTimes = 1; }
        if (interval === void 0) { interval = 600; }
        var now = Date.now();
        var matchs = 0;
        while (Date.now() - now < timeout) {
            if (action()) {
                matchs++;
            }
            if (matchs >= matchTimes) {
                break;
            }
            Utils.sleep(interval);
        }
        if (matchs >= matchTimes) {
            return true;
        }
        return false;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
/***/ (function(module) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
/***/ (function(module) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ (function(module) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
      utf8 = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8),
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
      bin = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uploadSessionInterval = exports.sendWaitInputEventInterval = exports.sendRunningEventInterval = exports.switchWaitingLoginPagesInterval = exports.duringMaxAdRetry = exports.dayInMs = exports.hourInMs = exports.minuteInMs = exports.sleepForAd = exports.sleepWaitPageLong = exports.sleepLong = exports.sleepMedium = exports.sleepShort = exports.leagueYearMin = exports.packageName = void 0;
exports.packageName = 'com.com2us.ninepb3d.normal.freefull.google.global.android.common';
exports.leagueYearMin = 2023;
exports.sleepShort = 1500;
exports.sleepMedium = 3000;
exports.sleepLong = 4000;
exports.sleepWaitPageLong = 24 * 1000;
exports.sleepForAd = 30 * 1000;
exports.minuteInMs = 60 * 1000;
exports.hourInMs = exports.minuteInMs * 60;
exports.dayInMs = exports.hourInMs * 24;
exports.duringMaxAdRetry = 3000;
exports.switchWaitingLoginPagesInterval = 30 * exports.minuteInMs;
exports.sendRunningEventInterval = 5 * exports.minuteInMs;
exports.sendWaitInputEventInterval = 5 * exports.minuteInMs;
exports.uploadSessionInterval = 1 * exports.hourInMs;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MLB9I = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
var modules_1 = __webpack_require__(/*! ./modules */ "./src/modules/index.ts");
var tasks_1 = __webpack_require__(/*! ./tasks */ "./src/tasks/index.ts");
var CONSTANTS = __importStar(__webpack_require__(/*! ./constants */ "./src/constants.ts"));
var PAGE = __importStar(__webpack_require__(/*! ./pages */ "./src/pages.ts"));
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var VERSION_CODE = 15.37;
var MLB9I = /** @class */ (function () {
    function MLB9I(jsonConfig) {
        console.log('############ new MLB9I ############');
        console.log("script version ".concat(VERSION_CODE));
        modules_1.state.init(jsonConfig);
    }
    MLB9I.prototype.start = function () {
        if (modules_1.Config.config.isLocalPaid) {
            var plan = getUserPlan();
            if (plan != 'user_plan_mlb9i') {
                console.log('user plan id: ', JSON.stringify(plan));
                console.log('please subscribe premium plan');
                return;
            }
        }
        this.addRoutesAndTasks();
        modules_1.rerouter.start(MLB9I.packageName);
    };
    MLB9I.prototype.stop = function () {
        modules_1.rerouter.stop();
        modules_1.state.end();
    };
    MLB9I.prototype.addRoutesAndTasks = function () {
        this.addRoutes();
        this.handleUnknown();
        // rerouter.getCurrentMatchNames();
        if (modules_1.Config.config.isLocalPaid || modules_1.Config.config.isDev) {
            this.addPremiumTasks();
            return;
        }
        if (!modules_1.Config.config.isCloud) {
            this.addBasicTasks();
            return;
        }
        if (!modules_1.Config.config.licenseId) {
            console.log('no license id');
            this.addStayInLoginTasks();
            return;
        }
        this.addPremiumTasks();
    };
    MLB9I.prototype.addBasicTasks = function () {
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.playLeagueGame,
            // maxTaskRunTimes: 2,
            maxTaskDuring: 10 * CONSTANTS.hourInMs,
            forceStop: true,
        });
    };
    MLB9I.prototype.addPremiumTasks = function () {
        // only run once
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.settingDefault,
            // maxTaskRunTimes: 1,
            minRoundInterval: Number.POSITIVE_INFINITY,
            maxTaskDuring: 10 * CONSTANTS.minuteInMs,
            forceStop: true,
        });
        // FIXME: this should only run when needed
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.settingResetLeagueProgress,
            minRoundInterval: 1 * CONSTANTS.minuteInMs,
            maxTaskDuring: 10 * CONSTANTS.minuteInMs,
            beforeRoute: function (task) {
                if (!modules_1.state.leagueGame.needResetProgress) {
                    return 'skipRouteLoop';
                }
            },
            forceStop: true,
        });
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.playLeagueGame,
            // maxTaskRunTimes: 2,
            maxTaskDuring: 10 * CONSTANTS.hourInMs,
            forceStop: true,
        });
        modules_1.Config.config.isRunPlayBattleGame &&
            modules_1.rerouter.addTask({
                name: tasks_1.TASK.playBattleGame,
                minRoundInterval: CONSTANTS.hourInMs,
                maxTaskDuring: 10 * CONSTANTS.hourInMs,
                forceStop: true,
            });
        tasks_1.weeklyMission.addTask();
        modules_1.Config.config.isRunAdReward &&
            modules_1.rerouter.addTask({
                name: tasks_1.TASK.adReward,
                // maxTaskRunTimes: 1,
                minRoundInterval: CONSTANTS.minuteInMs * 30,
                findRouteDelay: CONSTANTS.sleepMedium,
                maxTaskDuring: CONSTANTS.sleepForAd + CONSTANTS.duringMaxAdRetry,
                forceStop: true,
            });
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.restartAppPerDay,
            // maxTaskRunTimes: 1,
            minRoundInterval: CONSTANTS.dayInMs,
            beforeRoute: function (task) {
                if (task.lastRunTime !== 0) {
                    console.log('restart app task');
                    modules_1.rerouter.restartApp();
                }
                return 'skipRouteLoop';
            },
            maxTaskDuring: 30 * CONSTANTS.minuteInMs,
            forceStop: true,
        });
    };
    MLB9I.prototype.addStayInLoginTasks = function () {
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.stayInLogin,
            forceStop: false,
        });
    };
    MLB9I.prototype.addRoutes = function () {
        var _this = this;
        // ** launching pages
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.logo.name),
            match: PAGE.logo,
            action: function (context) {
                console.log('wait app loading ...');
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                if (!modules_1.Config.config.hasCoolFeature) {
                    return;
                }
                modules_1.state.onLaunching();
                // reopen if stuck
                var now = Date.now();
                if (now - context.matchStartTS > 5 * CONSTANTS.minuteInMs) {
                    console.log('stuck in launch page too long, restart app');
                    modules_1.rerouter.restartApp();
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                    return;
                }
            },
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.landingLoading.name),
            match: PAGE.landingLoading,
            action: this.wrapRouteAction(function (_) {
                console.log('landing loading...');
                modules_1.state.onLaunching();
            }),
            afterActionDelay: CONSTANTS.sleepMedium,
        });
        [PAGE.downloadData, PAGE.progressBarRunning].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: _this.wrapRouteAction('goNext'),
                afterActionDelay: CONSTANTS.sleepLong,
            });
        });
        [PAGE.TOS, PAGE.TOS90, PAGE.TOS90v2].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: _this.wrapRouteAction('goNext'),
            });
        });
        // ** login pages
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.landing.name),
            match: PAGE.landing,
            action: function (context) {
                if (!modules_1.Config.config.isCloud) {
                    console.log('stay in login');
                    return;
                }
                modules_1.state.onLoginPage();
                if (context.task.name === tasks_1.TASK.stayInLogin) {
                    console.log('stay in login');
                    if (context.matchDuring < CONSTANTS.switchWaitingLoginPagesInterval) {
                        return;
                    }
                    console.log('click hive login for avoid app crush');
                }
                modules_1.rerouter.goNext(PAGE.landing);
            },
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.loginSelectWay),
            match: PAGE.loginSelectWay,
            action: function (context) {
                if (!modules_1.Config.config.isCloud) {
                    console.log('stay in login');
                    return;
                }
                if (context.task.name !== tasks_1.TASK.stayInLogin) {
                    modules_1.rerouter.goNext(PAGE.loginSelectWay);
                    return;
                }
                // check the direction to go by previous page
                var isGoNext = true;
                switch (context.lastMatchedPath.substring(1)) {
                    case PAGE.logInHive.name:
                    case PAGE.logInHive90.name:
                        isGoNext = false;
                        break;
                    default:
                        break;
                }
                if (isGoNext) {
                    modules_1.rerouter.goNext(PAGE.loginSelectWay);
                }
                else {
                    keycode('BACK', 100);
                    console.log('keycode back');
                }
            },
        });
        [PAGE.logInHive, PAGE.logInHive90].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: function (context) {
                    if (!modules_1.Config.config.isCloud) {
                        console.log('stay in login');
                        return;
                    }
                    var needUserInput = context.task.name !== tasks_1.TASK.stayInLogin;
                    modules_1.state.onLoginPage(needUserInput);
                    if (!needUserInput) {
                        console.log('stay in login');
                        keycode('BACK', 100);
                        console.log('keycode back');
                        return;
                    }
                    if (context.matchDuring < CONSTANTS.switchWaitingLoginPagesInterval) {
                        return;
                    }
                    console.log('click back for avoid session expired');
                    keycode('BACK', 100);
                    console.log('keycode back');
                },
            });
        });
        [PAGE.fbLogIn90, PAGE.googleLogIn90].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: 'keycodeBack',
            });
        });
        // ** main
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.main.name),
            match: PAGE.main,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                var task = context.task.name;
                console.log(task);
                switch (task) {
                    case tasks_1.TASK.stayInLogin:
                        // should be inaccessible unless clear session is failed
                        return;
                    case tasks_1.TASK.settingDefault:
                    case tasks_1.TASK.settingResetLeagueProgress:
                        modules_1.rerouter.screen.tap(PAGE.mainBtns.settings);
                        break;
                    case tasks_1.TASK.playLeagueGame:
                        modules_1.rerouter.screen.tap(PAGE.mainBtns.leagueMode);
                        modules_1.state.leagueGame.tryEnterGameCnts++;
                        break;
                    case tasks_1.TASK.playBattleGame:
                        modules_1.rerouter.screen.tap(PAGE.mainBtns.battleMode);
                        break;
                    case tasks_1.TASK.adReward:
                        // sometimes won't trigger anything if still on cd
                        if (context.matchTimes > 2) {
                            console.log('ad is still on cd');
                            finishRound(true);
                        }
                        else {
                            modules_1.rerouter.screen.tap(PAGE.mainBtns.adTab);
                        }
                        break;
                    case tasks_1.TASK.weeklyMission:
                        modules_1.rerouter.screen.tap(PAGE.mainBtns.achievement);
                        break;
                    default:
                        break;
                }
                modules_1.state.onLoginSuccess();
            }),
        });
        // ** game setting
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.settings.name),
            match: PAGE.settings,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                var inactiveTabColor = { r: 58, g: 65, b: 74 };
                var tab = (0, utils_1.arrayFind)(Object.keys(PAGE.settingsTabs), function (t) {
                    var _a = PAGE.settingsTabs[t], x = _a.x, y = _a.y;
                    return !(0, utils_1.isSameColor)(image, __assign({ x: x, y: y }, inactiveTabColor));
                });
                switch (context.task.name) {
                    case tasks_1.TASK.settingDefault:
                        if (tab === 'graphicTab') {
                            modules_1.rerouter.screen.tap(PAGE.settingsGraphTabBtns.powerSaveOn);
                            Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                            finishRound(true);
                            modules_1.state.onRunning();
                        }
                        else {
                            // go to graphicTab
                            modules_1.rerouter.screen.tap(PAGE.settingsTabs.graphicTab);
                        }
                        break;
                    case tasks_1.TASK.settingResetLeagueProgress:
                        if (!modules_1.state.leagueGame.needResetProgress) {
                            finishRound(true);
                            break;
                        }
                        // go to leagueResetDialog
                        modules_1.rerouter.screen.tap(PAGE.settingsBtns.leagueReset);
                        modules_1.state.leagueGame.needResetProgress = false;
                        break;
                    default:
                        modules_1.rerouter.goBack(PAGE.settings);
                        break;
                }
            }),
        });
        // ** ad reward
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.adReward.name),
            match: PAGE.adReward,
            action: this.wrapRouteAction(function (context) {
                if (context.task.name !== tasks_1.TASK.adReward) {
                    modules_1.rerouter.goBack(PAGE.adReward);
                    return;
                }
                console.log('watch ad');
                modules_1.rerouter.goNext(PAGE.adReward);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepForAd);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.adRewardRedeem.name),
            match: PAGE.adRewardRedeem,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('ad reward get');
                modules_1.rerouter.goNext(PAGE.adRewardRedeem);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                if (context.task.name === tasks_1.TASK.adReward) {
                    finishRound(true);
                    modules_1.state.onRunning();
                }
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.adRewardOnCD.name),
            match: PAGE.adRewardOnCD,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('ad is still cd');
                modules_1.rerouter.goBack(PAGE.adRewardOnCD);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                if (context.task.name === tasks_1.TASK.adReward) {
                    finishRound(true);
                    modules_1.state.onRunning();
                }
            }),
        });
        // ** weekly mission
        tasks_1.weeklyMission.addRoutes();
        // ** playBattleGame
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.battleModePanel.name),
            match: PAGE.battleModePanel,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.battleModePanel);
                    return;
                }
                // TODO: check if play other mode too
                modules_1.rerouter.screen.tap(PAGE.battleModePanelBtns.rankedBattle);
                console.log('play ranked battle');
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.rankedBattlePanel.name),
            match: PAGE.rankedBattlePanel,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.rankedBattlePanel);
                    return;
                }
                // cannot play
                if (context.matchTimes > 5) {
                    finishRound(true);
                    modules_1.state.onRunning();
                    return;
                }
                // check if play is available
                var isPlayDisabled = (0, utils_1.isSameColor)(image, PAGE.rankedBattlePanelBtns.disabledPlayBtn);
                if (isPlayDisabled) {
                    finishRound(true);
                    modules_1.state.onRunning();
                    console.log('ranked battle play disabled');
                    return;
                }
                modules_1.rerouter.goNext(PAGE.rankedBattlePanel);
                console.log('play ranked battle (single)');
                Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.rankedBattleWaitToRefresh.name),
            match: PAGE.rankedBattleWaitToRefresh,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name === tasks_1.TASK.playBattleGame) {
                    console.log('play rank game disabled');
                    finishRound(true);
                    modules_1.state.onRunning();
                }
                modules_1.rerouter.goBack(PAGE.rankedBattleWaitToRefresh);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.rankedBattleGameInfo.name),
            match: PAGE.rankedBattleGameInfo,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.rankedBattleGameInfo);
                    return;
                }
                modules_1.rerouter.goNext(PAGE.rankedBattleGameInfo);
            }),
        });
        [PAGE.rankedBattleResult, PAGE.rankedBattleWeeklyRankking].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: _this.wrapRouteAction('goNext'),
            });
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.autoGameConfirm.name),
            match: PAGE.autoGameConfirm,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.autoGameConfirm);
                    return;
                }
                modules_1.rerouter.goNext(PAGE.autoGameConfirm);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.autoGameConfirmEnd.name),
            match: PAGE.autoGameConfirmEnd,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.autoGameConfirmEnd);
                    return;
                }
                modules_1.rerouter.goNext(PAGE.autoGameConfirmEnd);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.rankedBattleGameInfo.name),
            match: PAGE.rankedBattleGameInfo,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playBattleGame) {
                    modules_1.rerouter.goBack(PAGE.rankedBattleGameInfo);
                    return;
                }
                modules_1.rerouter.goNext(PAGE.rankedBattleGameInfo);
            }),
        });
        [PAGE.rechargeBallRankMode, PAGE.rechargeBallLeagueMode].forEach(function (p) {
            return modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: _this.wrapRouteAction(function (context, image, matched, finishRound) {
                    switch (context.task.name) {
                        case tasks_1.TASK.playBattleGame:
                        case tasks_1.TASK.playLeagueGame:
                            console.log('cannot continue: recharge ball needed');
                            finishRound(true);
                        default:
                            break;
                    }
                    modules_1.rerouter.goBack(p);
                }),
            });
        });
        // ** playLeagueMode
        // enter game info
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueModePanel.name),
            match: PAGE.leagueModePanel,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playLeagueGame) {
                    modules_1.rerouter.goBack(PAGE.leagueModePanel);
                    return;
                }
                // can play league mode
                modules_1.state.leagueGame.tryEnterGameCnts++;
                // avoid to click btn too many time for trigger next page immediately
                if (context.matchTimes < 2) {
                    modules_1.rerouter.goNext(PAGE.leagueModePanel);
                }
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueModeGameInfo.name),
            match: PAGE.leagueModeGameInfo,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playLeagueGame) {
                    modules_1.rerouter.goBack(PAGE.leagueModeGameInfo);
                    return;
                }
                console.log('check energy');
                var emptyEnergy = { x: 551, y: 281, r: 3, g: 124, b: 213 };
                var hasEnergy0 = (0, utils_1.isSameColor)(image, emptyEnergy, 0.9);
                if (hasEnergy0) {
                    console.log('no energy');
                    finishRound(true);
                    modules_1.state.onRunning();
                    return;
                }
                var digit1 = { x: 561, y: 278, r: 169, g: 172, b: 179 };
                var hasEnergy10 = (0, utils_1.isSameColor)(image, digit1);
                console.log('has10Energy:', hasEnergy10);
                // use quick play when has 10+ energy,
                // and slow play when has 10- energy
                var quickPlayOnBtn = { x: 37, y: 284, r: 33, g: 255, b: 140 };
                var isQuickPlayOn = (0, utils_1.isSameColor)(image, quickPlayOnBtn);
                if (hasEnergy10 && !isQuickPlayOn) {
                    modules_1.rerouter.screen.tap(quickPlayOnBtn); // select quick play
                    console.log('turn on quick play');
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
                }
                if (!hasEnergy10 && isQuickPlayOn) {
                    modules_1.rerouter.screen.tap(quickPlayOnBtn); // cancel quick play
                    console.log('turn off quick play');
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
                }
                modules_1.rerouter.goNext(PAGE.leagueModeGameInfo); // play ball
                console.log('play league mode game');
                Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
            }),
        });
        // select things
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectPlayRole.name),
            match: PAGE.selectPlayRole,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle select play role');
                modules_1.rerouter.goNext(PAGE.selectPlayRole);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectYear.name),
            match: PAGE.selectYear,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle select year page');
                modules_1.rerouter.goNext(PAGE.selectYear);
                // go to the min year
                var activeButton = {
                    x: PAGE.selectYearBtns.prevYear.x,
                    y: PAGE.selectYearBtns.prevYear.y,
                    r: 49,
                    g: 85,
                    b: 123,
                };
                var isNotMinYear = modules_1.rerouter.screen.isSameColor(activeButton);
                for (var remainClick = 12; remainClick > 0 && isNotMinYear; remainClick--) {
                    modules_1.rerouter.screen.tap(PAGE.selectYearBtns.prevYear);
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                    isNotMinYear = modules_1.rerouter.screen.isSameColor(activeButton);
                }
                // check the diff, return to prev year
                for (var yearDiff = modules_1.Config.config.leagueYear - CONSTANTS.leagueYearMin; yearDiff > 0; yearDiff--) {
                    modules_1.rerouter.screen.tap(PAGE.selectYearBtns.nextYear);
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                }
                // submit changes
                modules_1.rerouter.screen.tap(PAGE.selectYearBtns.submit);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectSeasonMode.name),
            match: PAGE.selectSeasonMode,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle select season page');
                modules_1.rerouter.goNext(PAGE.selectSeasonMode);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                modules_1.rerouter.screen.tap({ x: 568, y: 333 }); // normal mode
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                // TODO split page
                modules_1.rerouter.screen.tap({ x: 332, y: 301 }); // next season
                Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectLeagueGameAmount.name),
            match: PAGE.selectLeagueGameAmount,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle select league game amount page');
                // use config user setted to select which they want to play
                // TODO: handle the half, quarter, full has 2 next page
                switch (modules_1.Config.config.leagueSeasonMode) {
                    case 'full':
                        console.log('select full league');
                        modules_1.rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.full);
                        Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                        modules_1.rerouter.screen.tap({ x: 564, y: 328 }); // go next
                        break;
                    case 'half':
                        console.log('select 1/2 league');
                        modules_1.rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.half);
                        Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                        modules_1.rerouter.screen.tap({ x: 564, y: 328 }); // go next
                        // ? will go to ok / next pages
                        break;
                    case 'quarter':
                        console.log('select 1/4 league');
                        modules_1.rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.quarter);
                        Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                        modules_1.rerouter.screen.tap({ x: 564, y: 328 }); // go next
                        // ? will go to ok / next pages
                        break;
                    case 'postSeason':
                        console.log('select postSeason');
                        modules_1.rerouter.screen.tap(PAGE.selectLeagueGameAmountBtns.post);
                        // ? will go to ok / next pages
                        break;
                }
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                modules_1.rerouter.screen.tap({ x: 564, y: 328 }); // go next
                Rerouter_1.Utils.sleep(CONSTANTS.sleepLong);
            }),
        });
        // season new/ end
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.newSeason.name),
            match: PAGE.newSeason,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.endSeason.name),
            match: PAGE.endSeason,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.endSeasonProceed.name),
            match: PAGE.endSeasonProceed,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle end season proceed');
                modules_1.rerouter.screen.tap({ x: 182, y: 178 }); // tap new season of left
                // will go to endSeasonProceedSelected
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.endSeasonProceedSelected.name),
            match: PAGE.endSeasonProceedSelected,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectNormalMasterLeagueMode.name),
            match: PAGE.selectNormalMasterLeagueMode,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle select normal / master mode');
                // if cannot select master mode, at least select normal mode
                modules_1.rerouter.screen.tap(PAGE.selectNormalMasterLeagueModeBtns.normal);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                modules_1.rerouter.screen.tap(PAGE.selectNormalMasterLeagueModeBtns.master);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                // whether choose any mode, will jump to proceed page
                modules_1.rerouter.goNext(PAGE.selectNormalMasterLeagueMode);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectNormalMasterLeagueModeProceed.name),
            match: PAGE.selectNormalMasterLeagueModeProceed,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueResetDialogYN.name),
            match: PAGE.leagueResetDialogYN,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handle reset league dialog with yes/no');
                // TODO: let user choose in config
                if (context.lastMatchedPath === "/".concat(PAGE.selectNormalMasterLeagueModeProceed.name)) {
                    console.log('reset league mode');
                    modules_1.rerouter.goNext(PAGE.leagueResetDialogYN);
                    return;
                }
                // not reset
                modules_1.rerouter.goBack(PAGE.leagueResetDialogYN);
                return;
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueResetDialog.name),
            match: PAGE.leagueResetDialog,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.settingResetLeagueProgress) {
                    // cancel
                    modules_1.rerouter.goBack(PAGE.leagueResetDialog);
                    return;
                }
                console.log('handle reset league dialog');
                // TODO: let user can select specific mode and year to play
                // reset
                modules_1.rerouter.goNext(PAGE.leagueResetDialog);
                modules_1.state.leagueGame.needResetProgress = false;
                finishRound(true);
                return;
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueModeUnexpectedError.name),
            match: PAGE.leagueModeUnexpectedError,
            action: function (context, image, matched, finishRound) {
                switch (context.task.name) {
                    case tasks_1.TASK.playLeagueGame:
                        if (!modules_1.Config.config.hasCoolFeature) {
                            break;
                        }
                        // sometimes some unknown reason cannot enter game
                        var tryEnterGameCnts = modules_1.state.leagueGame.tryEnterGameCnts;
                        console.log('try enter game cnts', tryEnterGameCnts);
                        if (tryEnterGameCnts === 3) {
                            modules_1.rerouter.restartApp();
                        }
                        if (tryEnterGameCnts > 3) {
                            // can only resolved by resetting league mode progress
                            console.log('handleResetLeagueModeProgress');
                            modules_1.state.leagueGame.needResetProgress = true;
                            finishRound(true);
                        }
                        break;
                    default:
                        break;
                }
                modules_1.rerouter.goNext(PAGE.leagueModeUnexpectedError);
            },
        });
        // other
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameLineUp.name),
            match: PAGE.gameLineUp,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.playerGrowthComplete.name),
            match: PAGE.playerGrowthComplete,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.pitcherOfTheMonth.name),
            match: PAGE.pitcherOfTheMonth,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.mvp.name),
            match: PAGE.mvp,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('handleMvpPage');
                var okBtn = { x: 568, y: 320, r: 52, g: 120, b: 210 };
                var isOkBtnOnScreen = modules_1.rerouter.screen.isSameColor(okBtn);
                // ok button still on the screen
                for (var maxOkButtonRemain = 10; isOkBtnOnScreen && maxOkButtonRemain > 0; maxOkButtonRemain--) {
                    modules_1.rerouter.goNext(PAGE.mvp); // ok
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                    isOkBtnOnScreen = modules_1.rerouter.screen.isSameColor(okBtn);
                }
                // reward bonus player popup
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                modules_1.rerouter.screen.tap({ x: 322, y: 309 }); // click next
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
            }),
        });
        // game over
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameResult.name),
            match: PAGE.gameResult,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                switch (context.task.name) {
                    case tasks_1.TASK.playBattleGame:
                    case tasks_1.TASK.playLeagueGame:
                        console.log('complete a game');
                        finishRound();
                        modules_1.state.onRunning();
                        break;
                    default:
                        break;
                }
                modules_1.rerouter.goNext(PAGE.gameResult);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameResultAquired.name),
            match: PAGE.gameResultAquired,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameResultWorldChampion.name),
            match: PAGE.gameResultWorldChampion,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameResultOther.name),
            match: PAGE.gameResultOther,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                modules_1.rerouter.screen.tap({ x: 0, y: 0 });
                console.log('tap');
            }),
        });
        // game reward pages
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.gameReward.name),
            match: PAGE.gameReward,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueRewardAchievementGrade.name),
            match: PAGE.leagueRewardAchievementGrade,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueRewardAchievementGradeBonusPlayer.name),
            match: PAGE.leagueRewardAchievementGradeBonusPlayer,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.bestPositionAwardBonusGroup.name),
            match: PAGE.bestPositionAwardBonusGroup,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.bonusGrantedByTeamRecord.name),
            match: PAGE.bonusGrantedByTeamRecord,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.postSeasonAwardBonus.name),
            match: PAGE.postSeasonAwardBonus,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.selectRewardPlayer.name),
            match: PAGE.selectRewardPlayer,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                var _a;
                console.log('handleSelectRewardPlayer');
                var bestCardRank = -1;
                var bestCardPos = PAGE.selectRewardPlayerBtns[0];
                for (var _i = 0, _b = PAGE.selectRewardPlayerBtns; _i < _b.length; _i++) {
                    var pos = _b[_i];
                    var rgb = getImageColor(image, pos.x, pos.y);
                    var k = rgb.r + '-' + rgb.g + '-' + rgb.b;
                    console.log(pos.x, pos.y, k);
                    // select if not in basic type
                    var rank = (_a = PAGE.playerCardColorToRank[k]) !== null && _a !== void 0 ? _a : 5;
                    if (rank > bestCardRank) {
                        bestCardRank = rank;
                        bestCardPos = pos;
                    }
                }
                modules_1.rerouter.screen.tap(bestCardPos);
                console.log('select', bestCardPos.x, bestCardPos.y);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                modules_1.rerouter.goNext(PAGE.selectRewardPlayer);
                Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
            }),
        });
        // on play pages
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.onQuickPlayGroup.name),
            match: PAGE.onQuickPlayGroup,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                console.log('on quick playing');
                if (context.task.name === tasks_1.TASK.playLeagueGame) {
                    // success enter game
                    modules_1.state.leagueGame.tryEnterGameCnts = 0;
                }
                modules_1.state.onRunning(true);
                modules_1.rerouter.goNext(PAGE.onQuickPlayGroup);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.onQuickPlayPause.name),
            match: PAGE.onQuickPlayPause,
            action: this.wrapRouteAction('goNext'),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.onPlayPowerSaveOn.name),
            match: PAGE.onPlayPowerSaveOn,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                // this is share between all mode
                var isOnPlayTask = false;
                switch (context.task.name) {
                    case tasks_1.TASK.playBattleGame:
                    case tasks_1.TASK.playLeagueGame:
                        isOnPlayTask = true;
                        break;
                    default:
                        break;
                }
                if (!modules_1.Config.config.hasCoolFeature || !isOnPlayTask || modules_1.rerouter.isPageMatch(PAGE.powerSaving)) {
                    _this.handlePowerSavingPage();
                    return;
                }
                var now = Date.now();
                var _a = modules_1.state.leagueGame, lastCheckTimeAt = _a.lastCheckPowerSaveAt, colorCount = _a.powerSaveColorCount;
                if (now - lastCheckTimeAt < CONSTANTS.sendRunningEventInterval) {
                    return;
                }
                // use time to check whether game is still playing
                var colorCntNow = (0, utils_1.getColorCountInRange)(image, { x: 331, y: 310 }, { x: 403, y: 311 });
                var isSame = (0, utils_1.isSameColorCount)(colorCntNow, colorCount);
                modules_1.state.leagueGame.lastCheckPowerSaveAt = now;
                modules_1.state.leagueGame.powerSaveColorCount = colorCntNow;
                if (!isSame) {
                    console.log('game is still playing with power save on');
                    modules_1.state.onRunning();
                    return;
                }
                console.log('game is stuck');
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueOnPlayPowerSaveOffGroups.name),
            match: PAGE.leagueOnPlayPowerSaveOffGroups,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                // page will be stopped here in any tasks
                // need to handle immediately if match
                for (var _i = 0, matched_1 = matched; _i < matched_1.length; _i++) {
                    var pageOrGroup = matched_1[_i];
                    if (pageOrGroup.name === PAGE.leagueOnPlayPowerSaveOffStopped.name) {
                        modules_1.rerouter.goNext(PAGE.leagueOnPlayPowerSaveOffStopped);
                        break;
                    }
                }
                if (context.task.name !== tasks_1.TASK.playLeagueGame) {
                    // turn off autoplay to return
                    modules_1.rerouter.goBack(PAGE.leagueOnPlayPowerSaveOff);
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                    return;
                }
                // success enter game
                modules_1.state.leagueGame.tryEnterGameCnts = 0;
                // TODO: handle quick switch to auto play off if was stopped
                if (modules_1.Config.config.hasCoolFeature) {
                    console.log('turn on power save play');
                    modules_1.rerouter.goNext(PAGE.leagueOnPlayPowerSaveOff);
                }
                modules_1.rerouter.screen.tap({ x: 0, y: 0 });
                console.log('tap');
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueOnPlayAutoOffGroup.name),
            match: PAGE.leagueOnPlayAutoOffGroup,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playLeagueGame) {
                    // open pause panel
                    keycode('KEYCODE_BACK', 100);
                    // rerouter.goBack(PAGE.leagueOnPlayAutoOffGroup);
                    return;
                }
                console.log('turn on auto play');
                modules_1.rerouter.goNext(PAGE.leagueOnPlayAutoOffGroup);
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueOnPlayPause.name),
            match: PAGE.leagueOnPlayPause,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                if (context.task.name !== tasks_1.TASK.playLeagueGame) {
                    // open pause panel
                    modules_1.rerouter.goBack(PAGE.leagueOnPlayPause);
                    return;
                }
                // continue play
                keycode('KEYCODE_BACK', 100);
                console.log('tap back to stay in game');
            }),
        });
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.leagueContinuePlaying.name),
            match: PAGE.leagueContinuePlaying,
            action: this.wrapRouteAction('goNext'),
        });
        // ** general pages
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.powerSaving.name),
            match: PAGE.powerSaving,
            action: this.wrapRouteAction(function (context, image, matched, finishRound) {
                _this.handlePowerSavingPage();
            }),
        });
        [PAGE.errorNewUpdateAvailable, PAGE.appIsNotResponding].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: 'goNext',
                afterActionDelay: CONSTANTS.sleepWaitPageLong,
            });
        });
        [
            PAGE.unexpectedError,
            PAGE.reviewApp,
            PAGE.promotion1,
            PAGE.promotion2,
            PAGE.promotion3,
            PAGE.rechargePromotion,
            PAGE.teamSupportPackagePromotion,
            PAGE.enterGamePromotion,
            PAGE.event,
            PAGE.ok,
            PAGE.next,
            PAGE.confirmWithYS,
            PAGE.quitApp,
            PAGE.quitApp1,
        ].forEach(function (p) {
            modules_1.rerouter.addRoute({
                path: "/".concat(p.name),
                match: p,
                action: _this.wrapRouteAction('goNext'),
            });
        });
    };
    MLB9I.prototype.handleUnknown = function () {
        var _this = this;
        modules_1.rerouter.addUnknownAction(function (context, image, finishRound) {
            // rerouter.getCurrentMatchNames();
            var lastMatchedPath = context.lastMatchedPath.substring(1);
            Rerouter_1.Utils.log("unknown count ".concat(context.matchTimes, ", during ").concat(context.matchDuring, ", last matched: ").concat(lastMatchedPath));
            var isInApp = modules_1.rerouter.checkInApp();
            if (!isInApp) {
                console.log('not in app');
                if (modules_1.Config.config.hasCoolFeature) {
                    modules_1.rerouter.restartApp();
                }
                return;
            }
            if (lastMatchedPath === PAGE.adReward.name) {
                return _this.handleCloseAd();
            }
            switch (context.task.name) {
                case tasks_1.TASK.playBattleGame:
                case tasks_1.TASK.playLeagueGame:
                    if (context.matchDuring < CONSTANTS.minuteInMs * 2) {
                        console.log('might be in playing animation');
                        modules_1.rerouter.screen.tap({ x: 0, y: 0 });
                        console.log('tap');
                        return;
                    }
                    break;
                default:
                    break;
            }
            if (modules_1.state.isWaitingLogin) {
                console.log('wait user input');
                return;
            }
            modules_1.rerouter.screen.tap({ x: 0, y: 0 });
            console.log('tap');
            if (context.matchTimes % 11 === 0) {
                keycode('KEYCODE_BACK', 100);
                Rerouter_1.Utils.log('keycode back for unknown');
            }
            if (context.matchDuring > CONSTANTS.minuteInMs * 30) {
                console.log('stuck in unknown page more than 30 min');
                modules_1.Config.config.hasCoolFeature && modules_1.rerouter.restartApp();
            }
        });
    };
    MLB9I.prototype.handleCloseAd = function () {
        console.log('try close ad');
        keycode('BACK', 100);
        console.log('key code back');
        Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
        if (modules_1.rerouter.getCurrentMatchNames().length !== 0) {
            return;
        }
        // try tap close btn
        for (var _i = 0, _a = [
            // right
            { x: 622, y: 19 },
            // left
            { x: 8, y: 15 },
        ]; _i < _a.length; _i++) {
            var closeBtn = _a[_i];
            modules_1.rerouter.screen.tap(closeBtn);
            Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
        }
    };
    MLB9I.prototype.handlePowerSavingPage = function () {
        console.log('handlePowerSavingPage');
        modules_1.rerouter.screen.tapDown({ x: 100, y: 180 });
        Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
        modules_1.rerouter.screen.moveTo({ x: 500, y: 180 });
        Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
        modules_1.rerouter.screen.tapUp({ x: 500, y: 180 });
        Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
    };
    MLB9I.prototype.wrapRouteAction = function (action) {
        if (!modules_1.Config.config.isCloud) {
            return action;
        }
        return function (context, image, matched, finishRound) {
            console.log('wrapRouteAction', context.task.name, matched[0].name);
            if (typeof action === 'function') {
                action(context, image, matched, finishRound);
            }
            if (action === 'goNext') {
                modules_1.rerouter.goNext(matched[0]);
            }
            if (action === 'goBack') {
                modules_1.rerouter.goBack(matched[0]);
            }
            // upload session if needed
            modules_1.state.checkUploadSession();
        };
    };
    MLB9I.packageName = 'com.com2us.ninepb3d.normal.freefull.google.global.android.common';
    return MLB9I;
}());
exports.MLB9I = MLB9I;


/***/ }),

/***/ "./src/modules/config.ts":
/*!*******************************!*\
  !*** ./src/modules/config.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.set = exports.config = void 0;
var constants_1 = __webpack_require__(/*! ../constants */ "./src/constants.ts");
exports.config = {
    leagueSeasonMode: 'full',
    leagueYear: constants_1.leagueYearMin,
    isRunAdReward: false,
    isRunPlayBattleGame: true,
};
function set(jsonConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (typeof jsonConfig !== 'string') {
        return;
    }
    var c = JSON.parse(jsonConfig);
    exports.config.leagueSeasonMode = (_a = c.leagueSeasonMode) !== null && _a !== void 0 ? _a : exports.config.leagueSeasonMode;
    exports.config.leagueYear = (_b = c.leagueYear) !== null && _b !== void 0 ? _b : exports.config.leagueYear;
    exports.config.xrobotmonS3Key = (_c = c.xrobotmonS3Key) !== null && _c !== void 0 ? _c : exports.config.xrobotmonS3Key;
    exports.config.xrobotmonS3Token = (_d = c.xrobotmonS3Token) !== null && _d !== void 0 ? _d : exports.config.xrobotmonS3Token;
    exports.config.amazonawsS3Key = (_e = c.amazonawsS3Key) !== null && _e !== void 0 ? _e : exports.config.amazonawsS3Key;
    exports.config.amazonawsS3Token = (_f = c.amazonawsS3Token) !== null && _f !== void 0 ? _f : exports.config.amazonawsS3Token;
    exports.config.licenseId = (_g = c.licenseId) !== null && _g !== void 0 ? _g : exports.config.licenseId;
    exports.config.isCloud = (_h = c.isCloud) !== null && _h !== void 0 ? _h : true;
    exports.config.isLocalPaid = (_j = c.isLocalPaid) !== null && _j !== void 0 ? _j : false;
    exports.config.isDev = (_k = c.isDev) !== null && _k !== void 0 ? _k : false;
    exports.config.hasCoolFeature = exports.config.isCloud || exports.config.isLocalPaid || c.isDev || false;
    exports.config.isRunAdReward = exports.config.hasCoolFeature && ((_l = c.isRunAdReward) !== null && _l !== void 0 ? _l : exports.config.isRunAdReward);
    exports.config.isRunPlayBattleGame = exports.config.hasCoolFeature && ((_m = c.isRunPlayBattleGame) !== null && _m !== void 0 ? _m : exports.config.isRunPlayBattleGame);
}
exports.set = set;


/***/ }),

/***/ "./src/modules/eventSender.ts":
/*!************************************!*\
  !*** ./src/modules/eventSender.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.running = exports.playing = exports.launching = exports.loginSuccess = exports.loginInputing = exports.lastGameStatusEvent = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
var lastRunningEvent = 0;
var lastSendGameStatusEventAt = 0;
var cnt = 0;
var EventName;
(function (EventName) {
    EventName["RUNNING"] = "running";
    EventName["GAME_STATUS"] = "gameStatus";
})(EventName || (EventName = {}));
var GameStatusContent;
(function (GameStatusContent) {
    GameStatusContent["WAIT_FOR_LOGIN_INPUT"] = "wait-for-input";
    GameStatusContent["LOGIN_SUCCEEDED"] = "login-succeeded";
    GameStatusContent["LAUNCHING"] = "launching";
    GameStatusContent["PLAYING"] = "playing";
})(GameStatusContent || (GameStatusContent = {}));
var prefix = '[Event]';
exports.lastGameStatusEvent = '';
function loginInputing() {
    cnt++;
    console.log("loginInputing: ".concat(cnt));
    var content = GameStatusContent.WAIT_FOR_LOGIN_INPUT;
    return handleSendGameStatusEvent(content);
}
exports.loginInputing = loginInputing;
function loginSuccess() {
    if (exports.lastGameStatusEvent !== GameStatusContent.WAIT_FOR_LOGIN_INPUT) {
        return false;
    }
    var content = GameStatusContent.LOGIN_SUCCEEDED;
    return handleSendGameStatusEvent(content);
}
exports.loginSuccess = loginSuccess;
function launching() {
    // set to default once app is launched (first and again)
    lastRunningEvent = 0;
    var content = GameStatusContent.LAUNCHING;
    return handleSendGameStatusEvent(content);
}
exports.launching = launching;
function playing() {
    var content = GameStatusContent.PLAYING;
    return handleSendGameStatusEvent(content);
}
exports.playing = playing;
function running(useInterval) {
    if (useInterval === void 0) { useInterval = false; }
    var now = Date.now();
    if (useInterval && now - lastRunningEvent < CONSTANTS.sendRunningEventInterval) {
        return;
    }
    lastRunningEvent = now;
    sendEvent(EventName.RUNNING, '');
    console.log("".concat(prefix, " running"));
}
exports.running = running;
function handleSendGameStatusEvent(content) {
    if (exports.lastGameStatusEvent === content) {
        return false;
    }
    // sleep for send 1+ events in a short time
    var diff = Date.now() - lastSendGameStatusEventAt;
    if (diff < CONSTANTS.sleepMedium) {
        Rerouter_1.Utils.sleep(diff);
    }
    exports.lastGameStatusEvent = content;
    sendEvent(EventName.GAME_STATUS, content);
    console.log("".concat(prefix, " ").concat(content));
    lastSendGameStatusEventAt = Date.now();
    return true;
}


/***/ }),

/***/ "./src/modules/index.ts":
/*!******************************!*\
  !*** ./src/modules/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.state = exports.Config = exports.rerouter = void 0;
var rerouter_1 = __webpack_require__(/*! ./rerouter */ "./src/modules/rerouter.ts");
Object.defineProperty(exports, "rerouter", ({ enumerable: true, get: function () { return rerouter_1.rerouter; } }));
exports.Config = __importStar(__webpack_require__(/*! ./config */ "./src/modules/config.ts"));
exports.state = __importStar(__webpack_require__(/*! ./state */ "./src/modules/state.ts"));


/***/ }),

/***/ "./src/modules/rerouter.ts":
/*!*********************************!*\
  !*** ./src/modules/rerouter.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rerouter = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
Rerouter_1.rerouter.defaultConfig.TaskConfigAutoStop = true;
Rerouter_1.rerouter.defaultConfig.RouteConfigDebug = false;
Rerouter_1.rerouter.defaultConfig.TaskConfigFindRouteDelay = 1000;
// if not set packageName first, cannot handle start/ stop app
Rerouter_1.rerouter.rerouterConfig.packageName = CONSTANTS.packageName;
Rerouter_1.rerouter.rerouterConfig.startAppDelay = 10 * 1000;
Rerouter_1.rerouter.rerouterConfig.taskDelay = 500;
Rerouter_1.rerouter.screenConfig.rotation = 'horizontal';
Rerouter_1.rerouter.screenConfig.devHeight = 360;
Rerouter_1.rerouter.screenConfig.devWidth = 640;
exports.rerouter = Rerouter_1.rerouter;


/***/ }),

/***/ "./src/modules/session.ts":
/*!********************************!*\
  !*** ./src/modules/session.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uploadSession = exports.endSession = exports.initSession = void 0;
var md5_1 = __importDefault(__webpack_require__(/*! md5 */ "./node_modules/md5/md5.js"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var rerouter_1 = __webpack_require__(/*! ./rerouter */ "./src/modules/rerouter.ts");
var config_1 = __webpack_require__(/*! ./config */ "./src/modules/config.ts");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
// app origin info
var appSessionRoot = "data/data/".concat(CONSTANTS.packageName);
var appRecordRoot = "/sdcard/Android/data/".concat(CONSTANTS.packageName, "/files");
// cache info
var licenseFilePath = '/sdcard/Robotmon/license.txt';
var scriptCacheRoot = '/sdcard/Robotmon/loginCache';
var androidIdFilePath = "".concat(scriptCacheRoot, "/android_id.txt");
var gameRecordCacheRoot = "".concat(scriptCacheRoot, "/gameRecord");
// cloud info
var endpoint = 's3.robotmon.app:9000';
var bucket = 'mlb-record';
function initSession() {
    if (!config_1.config.isCloud) {
        return;
    }
    var licenseId = config_1.config.licenseId;
    licenseId = licenseId || '';
    var lastLicenseId = readFile(licenseFilePath) || '';
    writeFile(licenseFilePath, licenseId);
    console.log("lastLicenseId: ".concat(lastLicenseId, ", currentLicenseId: ").concat(licenseId));
    // actions based on last and current licenseId
    switch (licenseId) {
        // empty licenseId
        case '':
            logOut();
            sleep(3000);
            break;
        // has licenseId
        default:
            switch (lastLicenseId) {
                // empty lastLicenseId
                case '':
                    break;
                // same licenseId
                case licenseId:
                    break;
                // different licenseId
                default:
                    logOut();
                    sleep(3000);
                    break;
            }
            var hasCloudSession = fetchSession();
            if (hasCloudSession) {
                logIn();
                sleep(3000);
            }
            break;
    }
    // restart app if needed
    var isInApp = rerouter_1.rerouter.checkInApp();
    while (!isInApp) {
        rerouter_1.rerouter.startApp();
        sleep(3000);
        isInApp = rerouter_1.rerouter.checkInApp();
    }
    sleep(3000);
}
exports.initSession = initSession;
function endSession() {
    if (!config_1.config.isCloud) {
        return;
    }
    var licenseId = config_1.config.licenseId;
    licenseId = licenseId || '';
    if (licenseId) {
        logOut();
        sleep(3000);
        console.log('==== stop script: has licenseId; close app and clear session');
    }
    else {
        console.log('==== stop script: no licenseId; not to close app for let new user login');
    }
}
exports.endSession = endSession;
function uploadSession() {
    if (!config_1.config.isCloud) {
        return;
    }
    var xrobotmonS3Key = config_1.config.xrobotmonS3Key, xrobotmonS3Token = config_1.config.xrobotmonS3Token, licenseId = config_1.config.licenseId;
    licenseId = licenseId || '';
    if (!(xrobotmonS3Key && xrobotmonS3Token && licenseId)) {
        console.log('failed upload; required key is empty');
        return false;
    }
    console.log("upload session ".concat(licenseId, " start"));
    (0, utils_1.executeCommands)(
    // remove tmp file root
    "rm -rf ".concat(scriptCacheRoot), "rm -f ".concat(scriptCacheRoot, ".gz"), 
    // copy local session to tmp file root
    "mkdir -p ".concat(scriptCacheRoot, "/"), "cp -r ".concat(appSessionRoot, "/files ").concat(scriptCacheRoot, "/"), "cp -r ".concat(appSessionRoot, "/shared_prefs ").concat(scriptCacheRoot, "/"));
    copyGameRecordToCache();
    // copy current android id to tmp file root
    var androidId = execute('ANDROID_DATA=/data settings get secure android_id');
    console.log("upload androidId: ".concat(androidId));
    writeFile(androidIdFilePath, androidId);
    targz("".concat(scriptCacheRoot, ".gz"), "".concat(scriptCacheRoot));
    // upload session
    var now = Date.now();
    var sessionFileName = "loginCache/".concat(licenseId, ".gz");
    var sizeOrError = s3UploadFile("".concat(scriptCacheRoot, ".gz"), sessionFileName, 'application/octet-stream', endpoint, bucket, xrobotmonS3Key, xrobotmonS3Token, '', false);
    console.log("upload session to ".concat(endpoint, " finish. sizeOrError ").concat(sizeOrError, "; usedTime ").concat(Date.now() - now));
    // remove tmp file root
    (0, utils_1.executeCommands)("rm -rf ".concat(scriptCacheRoot), "rm -f ".concat(scriptCacheRoot, ".gz"));
}
exports.uploadSession = uploadSession;
function logOut() {
    console.log("do logout");
    var isInApp = rerouter_1.rerouter.checkInApp();
    while (isInApp) {
        rerouter_1.rerouter.stopApp();
        sleep(3000);
        isInApp = rerouter_1.rerouter.checkInApp();
    }
    console.log('app is stopped, clear session start');
    clearSession();
    writeFile(licenseFilePath, '');
}
function logIn() {
    var licenseId = config_1.config.licenseId;
    licenseId = licenseId || '';
    console.log("do login");
    var isInApp = rerouter_1.rerouter.checkInApp();
    while (isInApp) {
        rerouter_1.rerouter.stopApp();
        sleep(3000);
        isInApp = rerouter_1.rerouter.checkInApp();
    }
    console.log('app is stopped, set session start');
    setSession();
    writeFile(licenseFilePath, licenseId);
}
function fetchSession() {
    var xrobotmonS3Key = config_1.config.xrobotmonS3Key, xrobotmonS3Token = config_1.config.xrobotmonS3Token, licenseId = config_1.config.licenseId;
    licenseId = licenseId || '';
    if (!(xrobotmonS3Key && xrobotmonS3Token && licenseId)) {
        console.log('fetch failed: required key is empty');
        return false;
    }
    console.log("fetchSession start ".concat(licenseId));
    var now = Date.now();
    (0, utils_1.executeCommands)(
    // remove old files
    "rm -rf ".concat(scriptCacheRoot), "rm -f ".concat(scriptCacheRoot, ".gz"), 
    // create tmp file root
    "mkdir -p ".concat(scriptCacheRoot));
    var sessionFileName = "loginCache/".concat(licenseId, ".gz");
    var resultOrError = s3DownloadFile("".concat(scriptCacheRoot, ".gz"), sessionFileName, endpoint, bucket, xrobotmonS3Key, xrobotmonS3Token, '', false);
    if (resultOrError !== true) {
        console.log("fetchSession failed ".concat(resultOrError));
        return false;
    }
    console.log("Download session from ".concat(endpoint, " finish. usedTime"), Date.now() - now, licenseId, resultOrError);
    return true;
}
function setSession() {
    // clear app session to avoid cannot overwrite
    var gameRecordFileName = getGameRecordFileName() || 'NOT_EXIST_RECORD';
    (0, utils_1.executeCommands)("rm -rf ".concat(appSessionRoot, "/files"), "rm -rf ".concat(appSessionRoot, "/shared_prefs"), "rm -rf ".concat(appRecordRoot, "/").concat(gameRecordFileName));
    // untargz cloud session and overwrite app session
    console.log("set session start");
    untargz("".concat(scriptCacheRoot, ".gz"));
    (0, utils_1.executeCommands)("cp -r ".concat(scriptCacheRoot, "/files ").concat(appSessionRoot, "/"), "cp -r ".concat(scriptCacheRoot, "/shared_prefs ").concat(appSessionRoot, "/"), "cp -r ".concat(scriptCacheRoot, "/gameRecord/* ").concat(appRecordRoot, "/"), "chmod -R 777 ".concat(appSessionRoot, "/files"), "chmod -R 777 ".concat(appSessionRoot, "/shared_prefs"), "chmod -R 777 ".concat(appRecordRoot));
    setAndroidId('cloud');
    console.log('set session done');
    sleep(2000);
}
function clearSession() {
    setAndroidId('random');
    var gameRecordFileName = getGameRecordFileName() || 'NOT_EXIST_RECORD';
    (0, utils_1.executeCommands)("rm -rf ".concat(scriptCacheRoot, ".gz"), "rm -rf ".concat(scriptCacheRoot), "rm -rf ".concat(appSessionRoot, "/files"), "rm -rf ".concat(appSessionRoot, "/shared_prefs"), "rm -rf ".concat(appRecordRoot, "/").concat(gameRecordFileName));
    console.log('clear session done');
    sleep(2000);
}
function setAndroidId(source) {
    var oriAndroidId = (0, utils_1.executeCommands)('ANDROID_DATA=/data settings get secure android_id')[0];
    var androidId = (0, md5_1.default)("".concat(Date.now()).concat(oriAndroidId)).substring(0, 16);
    if (source === 'cloud') {
        androidId = readFile(androidIdFilePath) || androidId;
    }
    (0, utils_1.executeCommands)('ANDROID_DATA=/data settings put secure android_id ' + androidId);
    console.log('oriAndroidId', oriAndroidId);
    console.log('setAndroidId', androidId);
}
function copyGameRecordToCache() {
    var fileName = getGameRecordFileName();
    if (!fileName) {
        return;
    }
    (0, utils_1.executeCommands)("mkdir -p ".concat(gameRecordCacheRoot), "cp -r ".concat(appRecordRoot, "/").concat(fileName, " ").concat(gameRecordCacheRoot, "/").concat(fileName, "/"));
}
function getGameRecordFileName() {
    var files = (0, utils_1.executeCommands)("ls ".concat(appRecordRoot))[0].split('\n');
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var fileName = files_1[_i];
        if (fileName.length === 32) {
            fileName = fileName.trim();
            console.log("game record ".concat(fileName));
            return fileName;
        }
    }
    return '';
}


/***/ }),

/***/ "./src/modules/state.ts":
/*!******************************!*\
  !*** ./src/modules/state.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkUploadSession = exports.onLaunching = exports.onLoginSuccess = exports.onLoginPage = exports.onRunning = exports.end = exports.init = exports.isWaitingLogin = exports.leagueGame = void 0;
var rerouter_1 = __webpack_require__(/*! ./rerouter */ "./src/modules/rerouter.ts");
var EventSender = __importStar(__webpack_require__(/*! ./eventSender */ "./src/modules/eventSender.ts"));
var Session = __importStar(__webpack_require__(/*! ./session */ "./src/modules/session.ts"));
var Config = __importStar(__webpack_require__(/*! ./config */ "./src/modules/config.ts"));
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
exports.leagueGame = {
    tryEnterGameCnts: 0,
    needResetProgress: false,
    lastCheckPowerSaveAt: 0,
    powerSaveColorCount: {},
};
exports.isWaitingLogin = false;
var lastUploadSessionAt = 0;
var hasSession = false;
function init(jsonConfig) {
    Config.set(jsonConfig);
    rerouter_1.rerouter.debug = Config.config.isCloud || Config.config.isDev || false;
    rerouter_1.rerouter.rerouterConfig.autoLaunchApp = Config.config.hasCoolFeature || false;
    if (Config.config.isCloud) {
        Session.initSession();
        (0, utils_1.executeCommands)('pm disable-user com.android.inputmethod.latin');
    }
}
exports.init = init;
function end() {
    if (Config.config.isCloud) {
        Session.endSession();
    }
}
exports.end = end;
function onRunning(useInterval) {
    var _a;
    if (useInterval === void 0) { useInterval = false; }
    ((_a = Config.config.isCloud) !== null && _a !== void 0 ? _a : Config.config.isDev) && EventSender.running(useInterval);
}
exports.onRunning = onRunning;
function onLoginPage(needUserInput) {
    var _a;
    if (needUserInput === void 0) { needUserInput = false; }
    hasSession = false;
    exports.isWaitingLogin = true;
    if (!((_a = Config.config.isCloud) !== null && _a !== void 0 ? _a : Config.config.isDev)) {
        return;
    }
    // use interval in running
    EventSender.running(true);
    if (needUserInput) {
        EventSender.loginInputing();
    }
}
exports.onLoginPage = onLoginPage;
function onLoginSuccess() {
    var _a;
    hasSession = true;
    exports.isWaitingLogin = false;
    if (!((_a = Config.config.isCloud) !== null && _a !== void 0 ? _a : Config.config.isDev)) {
        return;
    }
    EventSender.loginSuccess();
    EventSender.playing();
    EventSender.running();
}
exports.onLoginSuccess = onLoginSuccess;
function onLaunching() {
    var _a;
    hasSession = false;
    lastUploadSessionAt = 0;
    exports.leagueGame.tryEnterGameCnts = exports.leagueGame.tryEnterGameCnts;
    exports.leagueGame.needResetProgress = false;
    exports.leagueGame.lastCheckPowerSaveAt = 0;
    exports.leagueGame.powerSaveColorCount = {};
    ((_a = Config.config.isCloud) !== null && _a !== void 0 ? _a : Config.config.isDev) && EventSender.launching();
}
exports.onLaunching = onLaunching;
function checkUploadSession() {
    // only upload session when is playing
    if (!Config.config.isCloud || !hasSession) {
        return;
    }
    var now = Date.now();
    if (now - lastUploadSessionAt < CONSTANTS.uploadSessionInterval) {
        return;
    }
    lastUploadSessionAt = now;
    console.log('upload session');
    Session.uploadSession();
}
exports.checkUploadSession = checkUploadSession;


/***/ }),

/***/ "./src/pages.ts":
/*!**********************!*\
  !*** ./src/pages.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rechargeBallRankMode = exports.autoGameConfirmEnd = exports.autoGameConfirm = exports.rankedBattleGameInfo = exports.rankedBattleResult = exports.rankedBattleWeeklyRankking = exports.rankedBattleWaitToRefresh = exports.rankedBattlePanelBtns = exports.rankedBattlePanel = exports.battleModePanelBtns = exports.battleModePanel = exports.selectYearBtns = exports.selectYear = exports.selectLeagueGameAmountBtns = exports.selectLeagueGameAmount = exports.selectSeasonMode = exports.leagueResetDialogBtns = exports.leagueResetDialog = exports.leagueResetDialogYN = exports.selectNormalMasterLeagueModeProceed = exports.selectNormalMasterLeagueModeBtns = exports.selectNormalMasterLeagueMode = exports.endSeasonProceedSelected = exports.endSeasonProceed = exports.endSeason = exports.newSeason = exports.settingsGraphTabBtns = exports.settingsGraphTab = exports.settingsSoundTabLanSelectProceedBtns = exports.settingsSoundTabLanSelect = exports.settingsSoundTabBtns = exports.settingsSoundTab = exports.settingsBtns = exports.settingsTabs = exports.settings = exports.mainBtns = exports.main = exports.progressBarRunning = exports.downloadData = exports.googleLogIn90 = exports.fbLogIn90 = exports.logInHive90 = exports.logInHive = exports.loginSelectWay = exports.landing = exports.landingLoading = exports.TOS90v2 = exports.TOS90 = exports.TOS = exports.logo = void 0;
exports.powerSaving = exports.weeklyMissionBoxReceived = exports.weeklyMissionBoxConfirm = exports.weeklyMissionBoxBtns = exports.weeklyMissionBox = exports.achivementMission = exports.adGroup = exports.adRewardOnCD = exports.adRewardRedeem = exports.adReward = exports.playerCardColorToRank = exports.selectRewardPlayerBtns = exports.selectRewardPlayer = exports.mvp = exports.pitcherOfTheMonth = exports.leagueRewardAchievementGradeBonusPlayer = exports.leagueRewardAchievementGrade = exports.playerGrowthComplete = exports.gameLineUp = exports.postSeasonAwardBonus = exports.bonusGrantedByTeamRecord = exports.bestPositionAwardBonusGroup = exports.bestPositionAwardBonus2 = exports.bestPositionAwardBonus = exports.gameReward = exports.gameResultWorldChampion = exports.gameResultOther = exports.gameResultAquired = exports.gameResult = exports.leagueModeUnexpectedError = exports.leagueOnPlayPause = exports.onQuickPlayGroup = exports.onQuickPlayPause = exports.onQuickPlay1 = exports.onQuickPlay = exports.onPlayPowerSaveOn = exports.leagueOnPlayPowerSaveOffGroups = exports.leagueOnPlayPowerSaveOffMid1 = exports.leagueOnPlayPowerSaveOffMid = exports.leagueOnPlayPowerSaveOffStopped = exports.leagueOnPlayPowerSaveOff = exports.leagueOnPlayAutoOffGroup = exports.leagueOnPlayAutoOff1 = exports.leagueOnPlayAutoOff = exports.leagueContinuePlaying = exports.selectPlayRole = exports.selectPlayRoleBtns = exports.leagueModeGameInfo = exports.leagueModePanel = exports.rechargeBallLeagueMode = void 0;
exports.quitApp1 = exports.quitApp = exports.appIsNotResponding = exports.unexpectedError = exports.errorNewUpdateAvailable = exports.confirmWithYS = exports.next2 = exports.next = exports.ok = exports.reviewApp = exports.event = exports.enterGamePromotion = exports.teamSupportPackagePromotion = exports.rechargePromotion = exports.promotion3 = exports.promotion2 = exports.promotion1 = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
exports.logo = new Rerouter_1.Page('logo', [
    { x: 227, y: 184, r: 228, g: 4, b: 33 },
    { x: 258, y: 187, r: 228, g: 4, b: 33 },
    { x: 278, y: 190, r: 232, g: 48, b: 72 },
    { x: 285, y: 183, r: 254, g: 254, b: 254 },
    { x: 301, y: 172, r: 229, g: 19, b: 46 },
    { x: 316, y: 187, r: 254, g: 254, b: 254 },
    { x: 335, y: 188, r: 228, g: 4, b: 33 },
    { x: 372, y: 188, r: 252, g: 233, b: 235 },
    { x: 375, y: 169, r: 228, g: 4, b: 33 },
    { x: 395, y: 184, r: 254, g: 254, b: 254 },
    { x: 398, y: 170, r: 228, g: 4, b: 33 },
    { x: 403, y: 186, r: 254, g: 254, b: 254 },
    { x: 117, y: 114, r: 254, g: 254, b: 254 },
    // loading on left top if stuck
    // { x: 2, y: 5, r: 142, g: 208, b: 202 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
// term of service
exports.TOS = new Rerouter_1.Page('TOS', [
    // logo
    { x: 289, y: 40, r: 232, g: 52, b: 74 },
    { x: 293, y: 34, r: 229, g: 21, b: 46 },
    { x: 299, y: 38, r: 227, g: 6, b: 33 },
    { x: 308, y: 37, r: 248, g: 192, b: 199 },
    { x: 313, y: 39, r: 248, g: 192, b: 199 },
    { x: 321, y: 37, r: 255, g: 255, b: 255 },
    { x: 325, y: 42, r: 255, g: 255, b: 255 },
    { x: 333, y: 33, r: 252, g: 223, b: 227 },
    { x: 338, y: 38, r: 255, g: 255, b: 255 },
    { x: 342, y: 38, r: 246, g: 176, b: 185 },
    { x: 344, y: 37, r: 246, g: 177, b: 185 },
    { x: 346, y: 36, r: 234, g: 68, b: 89 },
    { x: 335, y: 34, r: 234, g: 67, b: 87 },
    { x: 335, y: 37, r: 255, g: 255, b: 255 },
    { x: 344, y: 35, r: 227, g: 6, b: 33 },
    // copyright
    { x: 289, y: 335, r: 255, g: 255, b: 255 },
    { x: 300, y: 336, r: 194, g: 197, b: 195 },
    { x: 301, y: 336, r: 187, g: 192, b: 189 },
    { x: 307, y: 336, r: 255, g: 255, b: 255 },
    { x: 310, y: 336, r: 255, g: 255, b: 255 },
    { x: 320, y: 335, r: 255, g: 255, b: 255 },
    { x: 323, y: 336, r: 255, g: 255, b: 255 },
    { x: 332, y: 336, r: 181, g: 186, b: 183 },
    { x: 340, y: 336, r: 255, g: 255, b: 255 },
    // agree btn bg
    { x: 17, y: 293, r: 232, g: 232, b: 232 },
    { x: 54, y: 305, r: 255, g: 255, b: 255 },
    { x: 62, y: 317, r: 255, g: 255, b: 255 },
    { x: 111, y: 316, r: 255, g: 255, b: 255 },
    { x: 243, y: 297, r: 232, g: 232, b: 232 },
    { x: 255, y: 291, r: 232, g: 232, b: 232 },
    { x: 599, y: 304, r: 255, g: 255, b: 255 },
    { x: 613, y: 295, r: 232, g: 232, b: 232 },
    { x: 603, y: 316, r: 255, g: 255, b: 255 },
    { x: 421, y: 322, r: 232, g: 232, b: 232 },
    // bg corner outside
    { x: 72, y: 32, r: 255, g: 255, b: 255 },
    { x: 511, y: 40, r: 255, g: 255, b: 255 },
    { x: 586, y: 39, r: 255, g: 255, b: 255 },
    { x: 14, y: 340, r: 255, g: 255, b: 255 },
    { x: 619, y: 340, r: 255, g: 255, b: 255 },
    // bg corner inside
    { x: 22, y: 77, r: 232, g: 232, b: 232 },
    { x: 100, y: 77, r: 197, g: 197, b: 197 },
    { x: 18, y: 253, r: 232, g: 232, b: 232 },
    { x: 613, y: 286, r: 216, g: 216, b: 216 },
    { x: 613, y: 80, r: 215, g: 215, b: 215 },
    { x: 609, y: 73, r: 232, g: 232, b: 232 },
    { x: 305, y: 76, r: 183, g: 183, b: 183 },
    { x: 304, y: 291, r: 232, g: 232, b: 232 },
], { x: 320, y: 306 }, { x: 320, y: 306 });
// term of service, suit dgi90
exports.TOS90 = new Rerouter_1.Page('TOS90', [
    // bg
    { x: 32, y: 28, r: 255, g: 255, b: 255 },
    { x: 10, y: 342, r: 255, g: 255, b: 255 },
    { x: 622, y: 343, r: 255, g: 255, b: 255 },
    { x: 621, y: 32, r: 255, g: 255, b: 255 },
    // logo
    { x: 288, y: 27, r: 255, g: 255, b: 255 },
    { x: 301, y: 27, r: 246, g: 177, b: 185 },
    { x: 321, y: 24, r: 255, g: 255, b: 255 },
    { x: 320, y: 28, r: 245, g: 161, b: 171 },
    { x: 330, y: 28, r: 230, g: 36, b: 60 },
    { x: 344, y: 28, r: 255, g: 255, b: 255 },
], { x: 321, y: 321 }, { x: 321, y: 321 });
// for dgi90 and navi bar is smaller
exports.TOS90v2 = new Rerouter_1.Page('TOS90v2', [
    // bg
    { x: 2, y: 23, r: 255, g: 255, b: 255 },
    { x: 1, y: 42, r: 232, g: 232, b: 232 },
    { x: 1, y: 325, r: 232, g: 232, b: 232 },
    { x: 7, y: 348, r: 255, g: 255, b: 255 },
    { x: 631, y: 350, r: 255, g: 255, b: 255 },
    { x: 628, y: 321, r: 255, g: 255, b: 255 },
    { x: 633, y: 292, r: 213, g: 213, b: 213 },
    { x: 630, y: 40, r: 232, g: 232, b: 232 },
    { x: 628, y: 21, r: 255, g: 255, b: 255 },
    // logo
    { x: 296, y: 21, r: 248, g: 192, b: 199 },
    { x: 316, y: 24, r: 227, g: 6, b: 33 },
    { x: 340, y: 22, r: 239, g: 115, b: 130 },
], { x: 321, y: 321 }, { x: 321, y: 321 });
// like landing but has progress bar
exports.landingLoading = new Rerouter_1.Page('landingLoading', [
    // logo in center
    // 9innings
    { x: 295, y: 242, r: 30, g: 50, b: 82 },
    { x: 283, y: 220, r: 60, g: 69, b: 94 },
    { x: 292, y: 220, r: 255, g: 255, b: 255 },
    { x: 300, y: 215, r: 234, g: 235, b: 237 },
    { x: 350, y: 220, r: 244, g: 235, b: 237 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.landing = new Rerouter_1.Page('landing', [
    // logo in center
    { x: 297, y: 246, r: 255, g: 255, b: 255 },
    { x: 281, y: 244, r: 8, g: 28, b: 66 },
    { x: 303, y: 243, r: 219, g: 149, b: 164 },
    // 9innings
    { x: 218, y: 269, r: 88, g: 99, b: 130 },
    { x: 239, y: 277, r: 26, g: 45, b: 65 },
    { x: 274, y: 274, r: 25, g: 41, b: 74 },
    { x: 313, y: 278, r: 134, g: 143, b: 160 },
    { x: 327, y: 282, r: 99, g: 104, b: 128 },
    { x: 350, y: 269, r: 255, g: 255, b: 255 },
], { x: 254, y: 200 }, // to select login
{ x: 254, y: 200 });
exports.loginSelectWay = new Rerouter_1.Page('loginSelectWay', [
    // bg
    { x: 51, y: 72, r: 7, g: 7, b: 8 },
    { x: 53, y: 306, r: 7, g: 6, b: 7 },
    { x: 618, y: 315, r: 5, g: 5, b: 5 },
    // google btn
    { x: 180, y: 200, r: 251, g: 188, b: 5 },
    { x: 185, y: 205, r: 92, g: 185, b: 116 },
    { x: 307, y: 202, r: 255, g: 255, b: 255 },
    // fb btn
    { x: 334, y: 201, r: 205, g: 225, b: 252 },
    { x: 333, y: 201, r: 24, g: 119, b: 242 },
    { x: 331, y: 197, r: 255, g: 255, b: 255 },
    // hive btn
    { x: 182, y: 228, r: 255, g: 255, b: 255 },
    { x: 185, y: 234, r: 240, g: 246, b: 255 },
    { x: 307, y: 235, r: 18, g: 119, b: 255 },
], { x: 243, y: 232 }, // login hive
{ x: 243, y: 232 } // login hive
);
exports.logInHive = new Rerouter_1.Page('logInHive', [
    { x: 226, y: 76, r: 48, g: 48, b: 48 },
    { x: 322, y: 78, r: 48, g: 48, b: 48 },
    { x: 535, y: 42, r: 48, g: 48, b: 48 },
    { x: 624, y: 40, r: 255, g: 255, b: 255 },
    { x: 66, y: 333, r: 238, g: 238, b: 238 },
    { x: 44, y: 235, r: 238, g: 238, b: 238 },
    { x: 136, y: 236, r: 238, g: 238, b: 238 },
    { x: 258, y: 232, r: 143, g: 186, b: 227 },
    { x: 548, y: 169, r: 43, g: 132, b: 216 },
    { x: 583, y: 195, r: 43, g: 132, b: 216 },
    { x: 43, y: 142, r: 255, g: 255, b: 255 },
    { x: 43, y: 195, r: 255, g: 255, b: 255 },
], { x: 554, y: 177 }, // login
{ x: 574, y: 40 } // back to game
);
// suit for dpi 90
exports.logInHive90 = new Rerouter_1.Page('logInHive90', [
    // bg
    { x: 11, y: 171, r: 238, g: 238, b: 238 },
    { x: 10, y: 326, r: 238, g: 238, b: 238 },
    { x: 628, y: 107, r: 238, g: 238, b: 238 },
    { x: 627, y: 326, r: 238, g: 238, b: 238 },
    // title
    { x: 319, y: 72, r: 238, g: 238, b: 238 },
    { x: 338, y: 71, r: 148, g: 148, b: 148 },
    { x: 375, y: 71, r: 48, g: 48, b: 48 },
    // input
    { x: 480, y: 155, r: 255, g: 255, b: 255 },
    { x: 480, y: 199, r: 255, g: 255, b: 255 },
    // login btn
    { x: 558, y: 160, r: 43, g: 132, b: 216 },
    { x: 589, y: 175, r: 43, g: 132, b: 216 },
    { x: 532, y: 162, r: 110, g: 171, b: 228 },
], { x: 554, y: 177 }, // login
{ x: 574, y: 40 } // back to game
);
exports.fbLogIn90 = new Rerouter_1.Page('fbLogIn90', [
    // fb logo
    { x: 304, y: 14, r: 24, g: 119, b: 242 },
    { x: 316, y: 17, r: 255, g: 255, b: 255 },
    { x: 309, y: 31, r: 24, g: 119, b: 242 },
    { x: 325, y: 32, r: 24, g: 119, b: 242 },
    { x: 331, y: 15, r: 24, g: 119, b: 242 },
    { x: 324, y: 12, r: 255, g: 255, b: 255 },
    { x: 345, y: 11, r: 255, g: 255, b: 255 },
    { x: 323, y: 19, r: 24, g: 119, b: 242 },
    { x: 330, y: 23, r: 24, g: 119, b: 242 },
    // bg
    { x: 73, y: 102, r: 255, g: 255, b: 255 },
    { x: 52, y: 261, r: 255, g: 255, b: 255 },
    { x: 312, y: 315, r: 255, g: 255, b: 255 },
    { x: 591, y: 197, r: 255, g: 255, b: 255 },
    { x: 492, y: 62, r: 255, g: 255, b: 255 },
    { x: 318, y: 86, r: 255, g: 255, b: 255 },
    // login btn bg
    { x: 203, y: 194, r: 24, g: 119, b: 242 },
    { x: 433, y: 197, r: 24, g: 119, b: 242 },
]);
exports.googleLogIn90 = new Rerouter_1.Page('googleLogIn90', [
    // google logo
    { x: 295, y: 64, r: 255, g: 255, b: 255 },
    { x: 306, y: 67, r: 255, g: 255, b: 255 },
    { x: 318, y: 68, r: 251, g: 188, b: 5 },
    { x: 321, y: 68, r: 253, g: 221, b: 130 },
    { x: 329, y: 68, r: 66, g: 133, b: 244 },
    { x: 335, y: 68, r: 234, g: 67, b: 53 },
    // bg
    { x: 94, y: 33, r: 75, g: 129, b: 218 },
    { x: 67, y: 227, r: 79, g: 132, b: 221 },
    { x: 142, y: 329, r: 255, g: 255, b: 255 },
    { x: 559, y: 338, r: 61, g: 114, b: 203 },
    { x: 539, y: 80, r: 63, g: 117, b: 205 },
    { x: 350, y: 334, r: 255, g: 255, b: 255 },
    // login btn bg
    { x: 478, y: 224, r: 26, g: 115, b: 232 },
]);
exports.downloadData = new Rerouter_1.Page('downloadData', [
    { x: 103, y: 41, r: 181, g: 186, b: 189 },
    { x: 167, y: 59, r: 22, g: 30, b: 31 },
    { x: 188, y: 58, r: 39, g: 47, b: 47 },
    { x: 200, y: 59, r: 181, g: 186, b: 189 },
    { x: 209, y: 62, r: 84, g: 88, b: 92 },
    { x: 236, y: 58, r: 50, g: 56, b: 58 },
    { x: 243, y: 58, r: 144, g: 150, b: 152 },
    { x: 290, y: 57, r: 181, g: 186, b: 189 },
    { x: 317, y: 58, r: 16, g: 24, b: 24 },
    { x: 355, y: 54, r: 97, g: 101, b: 105 },
    { x: 407, y: 60, r: 16, g: 24, b: 24 },
    { x: 513, y: 48, r: 181, g: 182, b: 188 },
    { x: 527, y: 54, r: 177, g: 175, b: 177 },
    { x: 519, y: 60, r: 181, g: 185, b: 189 },
    { x: 168, y: 298, r: 222, g: 219, b: 222 },
    { x: 224, y: 296, r: 49, g: 85, b: 123 },
    { x: 249, y: 298, r: 102, g: 133, b: 171 },
    { x: 391, y: 299, r: 195, g: 221, b: 255 },
    { x: 461, y: 302, r: 222, g: 219, b: 222 },
    { x: 423, y: 303, r: 8, g: 109, b: 255 },
    { x: 526, y: 318, r: 222, g: 219, b: 222 },
], { x: 421, y: 293 }, { x: 421, y: 293 });
exports.progressBarRunning = new Rerouter_1.Page('progressBarRunning', [
    // progress bar
    { x: 207, y: 316, r: 0, g: 150, b: 255 },
    { x: 19, y: 320, r: 8, g: 12, b: 16 },
    { x: 628, y: 320, r: 8, g: 12, b: 16 },
    { x: 195, y: 329, r: 255, g: 202, b: 0 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.main = new Rerouter_1.Page('main', [
    // navi bar right
    { x: 622, y: 9, r: 214, g: 210, b: 214 },
    { x: 598, y: 11, r: 214, g: 226, b: 238 },
    { x: 592, y: 14, r: 74, g: 93, b: 123 },
    { x: 494, y: 15, r: 239, g: 179, b: 28 },
    { x: 503, y: 17, r: 74, g: 84, b: 90 },
    { x: 389, y: 12, r: 197, g: 202, b: 197 },
    { x: 313, y: 11, r: 174, g: 178, b: 179 },
    { x: 297, y: 15, r: 214, g: 214, b: 214 },
    // btn left, with settings
    { x: 31, y: 326, r: 255, g: 255, b: 255 },
    { x: 87, y: 326, r: 255, g: 255, b: 255 },
    { x: 137, y: 326, r: 108, g: 114, b: 100 },
    { x: 189, y: 325, r: 255, g: 255, b: 255 },
    { x: 243, y: 328, r: 126, g: 129, b: 126 },
    { x: 299, y: 328, r: 103, g: 107, b: 99 },
    // btn right
    { x: 523, y: 336, r: 25, g: 73, b: 140 },
    { x: 579, y: 338, r: 90, g: 24, b: 25 },
    { x: 599, y: 329, r: 237, g: 224, b: 228 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.mainBtns = {
    leagueMode: { x: 204, y: 154 },
    battleMode: { x: 350, y: 145 },
    specialMode: { x: 438, y: 145 },
    clubMode: { x: 556, y: 145 },
    settings: { x: 298, y: 327 },
    adTab: { x: 590, y: 77 },
    achievement: { x: 139, y: 320 },
};
exports.settings = new Rerouter_1.Page('settings', [
    // navi in right
    // { x: 625, y: 7, r: 214, g: 210, b: 214 },
    // { x: 593, y: 14, r: 74, g: 93, b: 123 },
    // { x: 590, y: 14, r: 74, g: 93, b: 123 },
    // { x: 487, y: 15, r: 214, g: 210, b: 214 },
    // { x: 481, y: 15, r: 77, g: 86, b: 93 },
    // { x: 391, y: 11, r: 79, g: 80, b: 79 },
    // { x: 378, y: 16, r: 133, g: 150, b: 169 },
    // { x: 313, y: 11, r: 178, g: 178, b: 179 },
    // bg of right section
    { x: 478, y: 119, r: 41, g: 45, b: 58 },
    { x: 476, y: 175, r: 36, g: 40, b: 44 },
    { x: 476, y: 228, r: 107, g: 97, b: 90 },
    { x: 474, y: 283, r: 66, g: 77, b: 58 },
    { x: 609, y: 293, r: 41, g: 45, b: 58 },
    { x: 608, y: 234, r: 41, g: 45, b: 58 },
    { x: 605, y: 178, r: 41, g: 45, b: 58 },
    { x: 608, y: 122, r: 41, g: 45, b: 58 },
    // google play game icon in right section
    { x: 490, y: 115, r: 35, g: 38, b: 51 },
    // back
    { x: 25, y: 312, r: 193, g: 198, b: 191 },
    { x: 39, y: 322, r: 58, g: 69, b: 49 },
], { x: 41, y: 320 }, { x: 41, y: 320 });
exports.settingsTabs = {
    soundAndLanTab: { x: 22, y: 55 },
    graphicTab: { x: 111, y: 55 },
};
exports.settingsBtns = {
    leagueReset: { x: 562, y: 217 },
};
// FIXME: add lan change pages
exports.settingsSoundTab = new Rerouter_1.Page('settings/sound', [
    // nav bar right
    { x: 621, y: 8, r: 214, g: 210, b: 214 },
    { x: 595, y: 10, r: 74, g: 97, b: 131 },
    { x: 503, y: 15, r: 74, g: 85, b: 90 },
    { x: 392, y: 12, r: 176, g: 173, b: 176 },
    { x: 315, y: 8, r: 238, g: 243, b: 238 },
    { x: 302, y: 17, r: 214, g: 214, b: 214 },
    // highlighted sound tab
    { x: 19, y: 60, r: 0, g: 101, b: 247 },
    { x: 20, y: 71, r: 0, g: 89, b: 222 },
    { x: 95, y: 69, r: 0, g: 92, b: 230 },
    // other tabs
    { x: 117, y: 56, r: 58, g: 65, b: 74 },
    { x: 205, y: 54, r: 58, g: 65, b: 74 },
    { x: 300, y: 52, r: 58, g: 65, b: 74 },
    { x: 394, y: 55, r: 58, g: 65, b: 74 },
    // bg table
    { x: 20, y: 85, r: 230, g: 231, b: 238 },
    { x: 20, y: 292, r: 206, g: 210, b: 214 },
    { x: 459, y: 85, r: 230, g: 231, b: 238 },
    { x: 460, y: 289, r: 206, g: 210, b: 214 },
    // right sidebar bg
    { x: 480, y: 120, r: 41, g: 45, b: 58 },
    { x: 483, y: 179, r: 41, g: 45, b: 58 },
    { x: 485, y: 232, r: 41, g: 45, b: 58 },
    { x: 486, y: 286, r: 41, g: 45, b: 58 },
    { x: 612, y: 119, r: 41, g: 45, b: 58 },
    { x: 610, y: 180, r: 41, g: 45, b: 58 },
    { x: 608, y: 234, r: 41, g: 45, b: 58 },
    { x: 610, y: 287, r: 41, g: 45, b: 58 },
], { x: 41, y: 320 }, { x: 41, y: 320 });
exports.settingsSoundTabBtns = {
    lang: { x: 401, y: 190 },
    // add more if need more setting
};
exports.settingsSoundTabLanSelect = new Rerouter_1.Page('settings/sound/lanSelect', [
    // bg
    { x: 293, y: 18, r: 25, g: 20, b: 25 },
    { x: 43, y: 343, r: 8, g: 4, b: 0 },
    { x: 622, y: 345, r: 8, g: 8, b: 8 },
    // lang english btn
    { x: 160, y: 127, r: 49, g: 89, b: 123 },
    { x: 190, y: 132, r: 58, g: 92, b: 129 },
    { x: 213, y: 133, r: 80, g: 113, b: 151 },
    { x: 229, y: 133, r: 166, g: 189, b: 218 },
    { x: 241, y: 133, r: 49, g: 85, b: 123 },
    { x: 266, y: 142, r: 49, g: 81, b: 115 },
    { x: 282, y: 129, r: 49, g: 89, b: 123 },
    { x: 166, y: 145, r: 41, g: 77, b: 115 },
    // back
    { x: 26, y: 316, r: 206, g: 210, b: 206 },
    { x: 43, y: 321, r: 206, g: 210, b: 206 },
    { x: 34, y: 329, r: 201, g: 206, b: 201 },
], { x: 200, y: 131 }, // english btn
{ x: 200, y: 131 } // english btn
);
exports.settingsSoundTabLanSelectProceedBtns = {
    yes: { x: 407, y: 307 },
};
exports.settingsGraphTab = new Rerouter_1.Page('settings/graph', [
    // nav bar right
    { x: 621, y: 8, r: 214, g: 210, b: 214 },
    { x: 595, y: 10, r: 74, g: 97, b: 131 },
    { x: 503, y: 15, r: 74, g: 85, b: 90 },
    { x: 392, y: 12, r: 176, g: 173, b: 176 },
    { x: 315, y: 8, r: 238, g: 243, b: 238 },
    { x: 302, y: 17, r: 214, g: 214, b: 214 },
    // highlighted graph tab
    { x: 123, y: 59, r: 0, g: 101, b: 254 },
    { x: 149, y: 59, r: 28, g: 119, b: 254 },
    { x: 177, y: 64, r: 0, g: 97, b: 238 },
    // other tabs
    { x: 37, y: 63, r: 58, g: 65, b: 74 },
    { x: 62, y: 62, r: 134, g: 143, b: 158 },
    { x: 232, y: 57, r: 58, g: 65, b: 74 },
    { x: 267, y: 63, r: 156, g: 167, b: 180 },
    { x: 322, y: 63, r: 160, g: 165, b: 180 },
    { x: 353, y: 63, r: 58, g: 65, b: 74 },
    { x: 401, y: 64, r: 171, g: 179, b: 192 },
    { x: 440, y: 61, r: 155, g: 159, b: 177 },
    // bg table
    { x: 19, y: 90, r: 230, g: 231, b: 238 },
    { x: 23, y: 291, r: 230, g: 231, b: 238 },
    { x: 459, y: 84, r: 230, g: 231, b: 238 },
    { x: 458, y: 287, r: 230, g: 231, b: 238 },
], { x: 41, y: 320 }, { x: 41, y: 320 });
exports.settingsGraphTabBtns = {
    qualityNormal: { x: 212, y: 120 },
    maxFPS30: { x: 83, y: 175 },
    powerSaveOn: { x: 222, y: 222 },
    bigHeadModeOff: { x: 86, y: 283 },
    // add more if need more setting
};
// tell user the season start
exports.newSeason = new Rerouter_1.Page('newSeason', [
    // bg bottom
    { x: 53, y: 334, r: 16, g: 16, b: 8 },
    { x: 613, y: 334, r: 16, g: 20, b: 16 },
    // next or ok btn bg
    { x: 254, y: 292, r: 0, g: 117, b: 247 },
    { x: 255, y: 311, r: 8, g: 102, b: 247 },
    { x: 376, y: 292, r: 0, g: 117, b: 247 },
    { x: 376, y: 313, r: 16, g: 101, b: 254 },
    // logo in center right
    { x: 354, y: 147, r: 0, g: 28, b: 66 },
    { x: 374, y: 158, r: 255, g: 255, b: 255 },
    { x: 386, y: 149, r: 192, g: 20, b: 65 },
], { x: 324, y: 305 }, { x: 324, y: 305 });
// check there might be many diff titles for end season
exports.endSeason = new Rerouter_1.Page('endSeason', [
    // x
    { x: 518, y: 47, r: 71, g: 73, b: 72 },
    // logo on center right
    { x: 357, y: 144, r: 0, g: 28, b: 66 },
    { x: 369, y: 150, r: 255, g: 255, b: 255 },
    { x: 385, y: 140, r: 189, g: 14, b: 58 },
    // next
    { x: 280, y: 301, r: 8, g: 113, b: 247 },
    { x: 312, y: 299, r: 16, g: 115, b: 242 },
    { x: 339, y: 301, r: 8, g: 113, b: 247 },
    { x: 368, y: 301, r: 8, g: 113, b: 247 },
], { x: 320, y: 300 }, { x: 320, y: 300 });
// after endSeason, xx season is over
exports.endSeasonProceed = new Rerouter_1.Page('endSeasonProceed', [
    // how would you like to proceed with next season ?
    { x: 452, y: 38, r: 195, g: 213, b: 229 },
    { x: 508, y: 36, r: 8, g: 85, b: 148 },
    { x: 545, y: 34, r: 253, g: 253, b: 254 },
    { x: 566, y: 34, r: 43, g: 107, b: 167 },
    { x: 277, y: 34, r: 255, g: 255, b: 255 },
    { x: 568, y: 31, r: 219, g: 232, b: 237 },
    { x: 568, y: 38, r: 45, g: 107, b: 165 },
    { x: 553, y: 38, r: 30, g: 98, b: 160 },
    // bg corner
    { x: 8, y: 13, r: 0, g: 97, b: 181 },
    { x: 8, y: 343, r: 16, g: 16, b: 8 },
    { x: 625, y: 22, r: 0, g: 89, b: 164 },
    { x: 628, y: 350, r: 16, g: 20, b: 16 },
    // ok
    { x: 539, y: 325, r: 8, g: 113, b: 247 },
    { x: 558, y: 325, r: 255, g: 255, b: 255 },
    { x: 571, y: 325, r: 255, g: 255, b: 255 },
    { x: 606, y: 325, r: 8, g: 113, b: 247 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.endSeasonProceedSelected = new Rerouter_1.Page('endSeasonProceedSelected', [
    // bg corner
    { x: 8, y: 13, r: 0, g: 97, b: 181 },
    { x: 8, y: 343, r: 16, g: 16, b: 8 },
    { x: 625, y: 22, r: 0, g: 89, b: 164 },
    { x: 628, y: 350, r: 16, g: 20, b: 16 },
    // ok
    { x: 539, y: 325, r: 8, g: 113, b: 247 },
    { x: 558, y: 325, r: 255, g: 255, b: 255 },
    { x: 571, y: 325, r: 255, g: 255, b: 255 },
    { x: 606, y: 325, r: 8, g: 113, b: 247 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.selectNormalMasterLeagueMode = new Rerouter_1.Page('selectNormalMasterLeagueMode', [
    // bg
    { x: 16, y: 19, r: 0, g: 93, b: 173 },
    { x: 19, y: 337, r: 16, g: 20, b: 16 },
    { x: 623, y: 22, r: 0, g: 89, b: 164 },
    { x: 619, y: 232, r: 16, g: 24, b: 16 },
    // NORMAL LEAGUE
    { x: 125, y: 164, r: 214, g: 220, b: 221 },
    { x: 143, y: 165, r: 41, g: 105, b: 28 },
    // mode bg
    { x: 46, y: 87, r: 230, g: 231, b: 238 },
    { x: 47, y: 288, r: 230, g: 231, b: 238 },
    { x: 337, y: 79, r: 58, g: 57, b: 66 },
    { x: 342, y: 284, r: 58, g: 57, b: 66 },
    // reward info in both
    { x: 138, y: 270, r: 8, g: 117, b: 255 },
    { x: 106, y: 272, r: 65, g: 147, b: 249 },
    { x: 395, y: 273, r: 195, g: 221, b: 253 },
    { x: 421, y: 276, r: 8, g: 102, b: 247 },
], { x: 565, y: 328 }, { x: 565, y: 328 });
exports.selectNormalMasterLeagueModeBtns = {
    normal: {
        x: 170,
        y: 160,
    },
    master: {
        x: 470,
        y: 160,
    },
};
exports.selectNormalMasterLeagueModeProceed = new Rerouter_1.Page('selectNormalMasterLeagueModeProceed', [
    // bg
    { x: 16, y: 19, r: 0, g: 93, b: 173 },
    { x: 19, y: 337, r: 16, g: 20, b: 16 },
    { x: 623, y: 22, r: 0, g: 89, b: 164 },
    { x: 619, y: 232, r: 16, g: 24, b: 16 },
    // ok
    { x: 535, y: 326, r: 8, g: 113, b: 247 },
    { x: 570, y: 330, r: 255, g: 255, b: 255 },
    { x: 605, y: 328, r: 8, g: 113, b: 247 },
], { x: 565, y: 328 }, { x: 565, y: 328 });
// a dialog to confirm league reset
exports.leagueResetDialogYN = new Rerouter_1.Page('leagueResetDialogYN', [
    { x: 115, y: 54, r: 181, g: 186, b: 189 },
    { x: 108, y: 305, r: 214, g: 219, b: 222 },
    { x: 508, y: 308, r: 214, g: 219, b: 222 },
    { x: 514, y: 50, r: 181, g: 182, b: 181 },
    { x: 531, y: 48, r: 167, g: 172, b: 174 },
    { x: 262, y: 57, r: 181, g: 186, b: 189 },
    { x: 286, y: 58, r: 16, g: 24, b: 33 },
    { x: 319, y: 61, r: 181, g: 186, b: 189 },
    { x: 347, y: 62, r: 127, g: 133, b: 137 },
    { x: 374, y: 62, r: 181, g: 186, b: 189 },
    { x: 220, y: 302, r: 41, g: 73, b: 123 },
    { x: 399, y: 306, r: 155, g: 195, b: 251 },
    { x: 443, y: 305, r: 8, g: 105, b: 247 },
], { x: 193, y: 300 }, // no, cancel
{ x: 371, y: 300 } // yes, reset
);
// a dialog to select year, normal or master league
// TODO: let user can select specific mode and year to play
exports.leagueResetDialog = new Rerouter_1.Page('leagueResetDialog', [
    // title
    { x: 270, y: 40, r: 40, g: 44, b: 49 },
    { x: 293, y: 44, r: 146, g: 148, b: 155 },
    { x: 326, y: 45, r: 193, g: 197, b: 206 },
    { x: 351, y: 42, r: 21, g: 26, b: 30 },
    { x: 364, y: 42, r: 188, g: 192, b: 198 },
    // bg
    { x: 121, y: 25, r: 191, g: 199, b: 206 },
    { x: 116, y: 288, r: 239, g: 242, b: 239 },
    { x: 518, y: 35, r: 72, g: 75, b: 80 },
    { x: 517, y: 292, r: 239, g: 242, b: 239 },
    // cancel btn bg
    { x: 185, y: 282, r: 41, g: 75, b: 118 },
    // reset to year XX btn bg
    { x: 327, y: 297, r: 3, g: 79, b: 235 },
], { x: 371, y: 300 }, // reset to year XX
{ x: 193, y: 300 } // cancel
);
exports.leagueResetDialogBtns = {
    normal: { x: 218, y: 105 },
    master: { x: 402, y: 105 },
};
exports.selectSeasonMode = new Rerouter_1.Page('selectSeasonMode', [
    { x: 104, y: 16, r: 0, g: 93, b: 173 },
    { x: 235, y: 37, r: 143, g: 181, b: 207 },
    { x: 309, y: 36, r: 145, g: 182, b: 209 },
    { x: 337, y: 38, r: 103, g: 149, b: 191 },
    { x: 376, y: 32, r: 245, g: 247, b: 253 },
    { x: 422, y: 36, r: 145, g: 177, b: 209 },
    { x: 40, y: 75, r: 181, g: 186, b: 189 },
    { x: 314, y: 183, r: 33, g: 36, b: 33 },
    { x: 341, y: 93, r: 41, g: 48, b: 49 },
    { x: 539, y: 323, r: 0, g: 69, b: 149 },
    { x: 553, y: 328, r: 0, g: 65, b: 148 },
], { x: 178, y: 183 }, { x: 178, y: 183 });
exports.selectLeagueGameAmount = new Rerouter_1.Page('selectLeagueGameAmount', [
    // title
    { x: 179, y: 60, r: 8, g: 65, b: 115 },
    { x: 195, y: 59, r: 52, g: 99, b: 141 },
    { x: 245, y: 56, r: 177, g: 198, b: 212 },
    { x: 361, y: 57, r: 5, g: 66, b: 115 },
    { x: 439, y: 56, r: 194, g: 208, b: 221 },
    { x: 483, y: 56, r: 0, g: 65, b: 115 },
    // amount title bg
    { x: 30, y: 104, r: 230, g: 227, b: 230 },
    { x: 70, y: 100, r: 228, g: 228, b: 228 },
    { x: 116, y: 100, r: 197, g: 198, b: 197 },
    { x: 209, y: 102, r: 41, g: 49, b: 58 },
    { x: 244, y: 102, r: 114, g: 121, b: 128 },
    { x: 276, y: 102, r: 44, g: 54, b: 66 },
    { x: 361, y: 98, r: 54, g: 60, b: 70 },
    { x: 409, y: 102, r: 74, g: 79, b: 87 },
    { x: 456, y: 99, r: 230, g: 231, b: 230 },
    { x: 496, y: 97, r: 230, g: 231, b: 230 },
    { x: 537, y: 101, r: 92, g: 98, b: 106 },
    { x: 582, y: 99, r: 200, g: 204, b: 207 },
    { x: 598, y: 99, r: 230, g: 231, b: 230 },
], { x: 39, y: 314 }, { x: 39, y: 314 });
exports.selectLeagueGameAmountBtns = {
    full: { x: 25, y: 285 },
    half: { x: 245, y: 285 },
    quarter: { x: 400, y: 112 },
    post: { x: 600, y: 112 },
};
exports.selectYear = new Rerouter_1.Page('selectYear', [
    // bg
    { x: 103, y: 24, r: 201, g: 201, b: 205 },
    { x: 104, y: 289, r: 240, g: 240, b: 240 },
    { x: 519, y: 34, r: 74, g: 71, b: 74 },
    { x: 528, y: 295, r: 244, g: 242, b: 244 },
    // title select year
    { x: 277, y: 38, r: 182, g: 187, b: 191 },
    { x: 311, y: 34, r: 20, g: 24, b: 29 },
    { x: 342, y: 40, r: 21, g: 25, b: 30 },
    { x: 359, y: 40, r: 16, g: 26, b: 33 },
    // year bg
    { x: 230, y: 136, r: 71, g: 78, b: 94 },
    { x: 403, y: 151, r: 72, g: 79, b: 94 },
    // reset year btn bg
    { x: 328, y: 296, r: 1, g: 81, b: 238 },
], { x: 392, y: 302 }, { x: 520, y: 49 });
exports.selectYearBtns = {
    prevYear: { x: 178, y: 156 },
    nextYear: { x: 455, y: 156 },
    submit: { x: 285, y: 303 },
};
// * BattleModes
exports.battleModePanel = new Rerouter_1.Page('battleModePanel', [
    // nav bar right
    { x: 301, y: 5, r: 206, g: 214, b: 222 },
    { x: 313, y: 10, r: 229, g: 225, b: 229 },
    { x: 324, y: 7, r: 58, g: 97, b: 132 },
    { x: 388, y: 10, r: 238, g: 234, b: 238 },
    { x: 396, y: 6, r: 242, g: 240, b: 242 },
    { x: 492, y: 10, r: 246, g: 208, b: 45 },
    { x: 486, y: 4, r: 206, g: 214, b: 222 },
    { x: 598, y: 13, r: 104, g: 126, b: 153 },
    { x: 616, y: 12, r: 206, g: 214, b: 222 },
    // bg in bottom (top will shine)
    { x: 9, y: 346, r: 16, g: 28, b: 33 },
    { x: 623, y: 344, r: 16, g: 28, b: 33 },
    { x: 397, y: 342, r: 16, g: 28, b: 33 },
    // player helmet to diff gSelectLeagueGameAmount
    { x: 8, y: 121, r: 115, g: 44, b: 41 },
    // back
    { x: 25, y: 313, r: 206, g: 210, b: 214 },
    { x: 42, y: 320, r: 206, g: 210, b: 214 },
    { x: 31, y: 333, r: 206, g: 210, b: 214 },
], { x: 41, y: 320 }, // back
{ x: 41, y: 320 });
exports.battleModePanelBtns = {
    rankedBattle: { x: 287, y: 160 },
    friendBattle: { x: 287, y: 245 },
    powerRanking: { x: 526, y: 160 },
    pvp: { x: 525, y: 245 },
};
exports.rankedBattlePanel = new Rerouter_1.Page('rankedBattlePanel', [
    // nav bar right part icon
    // sometimes nav bar will disappear
    // { x: 312, y: 9, r: 238, g: 234, b: 238 },
    // { x: 390, y: 12, r: 127, g: 128, b: 127 },
    // { x: 493, y: 13, r: 208, g: 189, b: 51 },
    // { x: 597, y: 13, r: 74, g: 93, b: 123 },
    // bg in left
    // { x: 22, y: 66, r: 189, g: 190, b: 189 },
    // { x: 16, y: 194, r: 230, g: 227, b: 230 },
    // { x: 18, y: 260, r: 247, g: 243, b: 247 },
    // team support bg
    { x: 487, y: 86, r: 247, g: 243, b: 247 },
    { x: 614, y: 95, r: 247, g: 243, b: 247 },
    // bg of win/lose ratio in bottom left
    { x: 144, y: 286, r: 66, g: 61, b: 66 },
    { x: 354, y: 286, r: 66, g: 69, b: 66 },
    // bg of equipment in right
    { x: 488, y: 249, r: 33, g: 85, b: 156 },
    { x: 562, y: 250, r: 33, g: 85, b: 156 },
    // // energy (ball) in bottom
    // { x: 424, y: 325, r: 51, g: 58, b: 51 },
    // { x: 428, y: 326, r: 253, g: 251, b: 253 },
    // line up , power ranking, stats btn bg
    { x: 82, y: 328, r: 25, g: 69, b: 116 },
    { x: 146, y: 330, r: 25, g: 65, b: 115 },
    { x: 248, y: 330, r: 25, g: 65, b: 115 },
    // back
    { x: 42, y: 323, r: 214, g: 219, b: 214 },
], { x: 557, y: 332 }, // play ball
{ x: 41, y: 320 });
exports.rankedBattlePanelBtns = {
    awayGame: { x: 185, y: 65 },
    homeGame: { x: 293, y: 65 },
    disabledPlayBtn: { x: 502, y: 317, r: 90, g: 73, b: 49 },
};
// click refresh btn in rankedBattlePanel
exports.rankedBattleWaitToRefresh = new Rerouter_1.Page('rankedBattleWaitToRefresh', [
    // title and x
    { x: 207, y: 52, r: 181, g: 186, b: 189 },
    { x: 286, y: 53, r: 127, g: 131, b: 135 },
    { x: 362, y: 57, r: 181, g: 186, b: 189 },
    { x: 396, y: 51, r: 36, g: 44, b: 52 },
    { x: 518, y: 50, r: 145, g: 146, b: 145 },
    // count down bg
    { x: 114, y: 151, r: 25, g: 85, b: 82 },
    { x: 520, y: 155, r: 25, g: 53, b: 49 },
    // other bg
    { x: 106, y: 91, r: 181, g: 186, b: 189 },
    { x: 106, y: 311, r: 214, g: 219, b: 222 },
    { x: 527, y: 300, r: 214, g: 219, b: 222 },
    { x: 528, y: 255, r: 181, g: 186, b: 189 },
    { x: 523, y: 99, r: 181, g: 186, b: 189 },
], { x: 520, y: 50 }, // x
{ x: 520, y: 50 });
exports.rankedBattleWeeklyRankking = new Rerouter_1.Page('rankedBattleWeeklyRankking', [
    // weekly rankking
    { x: 309, y: 44, r: 24, g: 30, b: 37 },
    { x: 344, y: 54, r: 16, g: 24, b: 33 },
    { x: 374, y: 54, r: 16, g: 24, b: 33 },
    // bg
    { x: 51, y: 48, r: 222, g: 219, b: 222 },
    { x: 51, y: 313, r: 238, g: 243, b: 238 },
    { x: 606, y: 304, r: 238, g: 243, b: 238 },
    // x
    { x: 603, y: 42, r: 74, g: 77, b: 74 },
    // ok
    { x: 296, y: 307, r: 8, g: 114, b: 255 },
    { x: 315, y: 310, r: 176, g: 208, b: 251 },
    { x: 364, y: 308, r: 8, g: 113, b: 248 },
], { x: 316, y: 301 }, // ok
{ x: 316, y: 301 });
exports.rankedBattleResult = new Rerouter_1.Page('rankedBattleResult', [
    // bg in mid
    { x: 10, y: 94, r: 58, g: 93, b: 140 },
    { x: 8, y: 248, r: 140, g: 158, b: 181 },
    { x: 624, y: 95, r: 58, g: 94, b: 140 },
    { x: 621, y: 246, r: 140, g: 158, b: 181 },
    { x: 336, y: 98, r: 58, g: 97, b: 140 },
    { x: 345, y: 255, r: 148, g: 162, b: 181 },
    // tier/ score / rank
    { x: 49, y: 127, r: 198, g: 203, b: 214 },
    { x: 59, y: 130, r: 196, g: 205, b: 212 },
    { x: 74, y: 133, r: 216, g: 221, b: 228 },
    { x: 101, y: 130, r: 85, g: 117, b: 153 },
    { x: 126, y: 126, r: 207, g: 216, b: 227 },
    { x: 168, y: 129, r: 233, g: 235, b: 238 },
    { x: 188, y: 132, r: 222, g: 229, b: 230 },
    // ok
    { x: 284, y: 296, r: 8, g: 118, b: 255 },
    { x: 330, y: 297, r: 8, g: 117, b: 255 },
    { x: 364, y: 306, r: 8, g: 101, b: 247 },
    { x: 317, y: 297, r: 229, g: 237, b: 250 },
], { x: 316, y: 310 }, // ok
{ x: 316, y: 310 });
exports.rankedBattleGameInfo = new Rerouter_1.Page('rankedBattleGameInfo', [
    // right part of nav bar
    { x: 616, y: 10, r: 214, g: 210, b: 214 },
    { x: 595, y: 13, r: 74, g: 93, b: 123 },
    { x: 589, y: 15, r: 75, g: 94, b: 123 },
    { x: 567, y: 14, r: 74, g: 85, b: 90 },
    { x: 573, y: 15, r: 74, g: 85, b: 90 },
    { x: 478, y: 20, r: 214, g: 210, b: 214 },
    { x: 471, y: 11, r: 205, g: 218, b: 230 },
    { x: 473, y: 10, r: 206, g: 219, b: 230 },
    { x: 393, y: 8, r: 129, g: 127, b: 129 },
    { x: 319, y: 14, r: 197, g: 198, b: 197 },
    // game info title
    { x: 284, y: 58, r: 41, g: 45, b: 58 },
    { x: 298, y: 62, r: 110, g: 111, b: 121 },
    { x: 307, y: 63, r: 163, g: 166, b: 171 },
    { x: 320, y: 62, r: 41, g: 45, b: 58 },
    { x: 332, y: 63, r: 221, g: 221, b: 225 },
    { x: 348, y: 60, r: 41, g: 45, b: 58 },
    { x: 205, y: 62, r: 41, g: 45, b: 58 },
    { x: 473, y: 66, r: 41, g: 45, b: 58 },
    { x: 148, y: 61, r: 41, g: 45, b: 58 },
    // playball/ playing btn
    { x: 487, y: 328, r: 212, g: 188, b: 32 },
    { x: 610, y: 325, r: 214, g: 179, b: 0 },
    { x: 552, y: 339, r: 181, g: 142, b: 0 },
    // back
    { x: 26, y: 316, r: 214, g: 218, b: 214 },
    { x: 40, y: 316, r: 214, g: 219, b: 214 },
    { x: 33, y: 329, r: 211, g: 215, b: 210 },
    // bg between back and play
    { x: 138, y: 325, r: 58, g: 69, b: 49 },
    { x: 200, y: 329, r: 49, g: 61, b: 41 },
    { x: 265, y: 330, r: 52, g: 62, b: 44 },
    { x: 345, y: 333, r: 66, g: 75, b: 58 },
    { x: 402, y: 334, r: 49, g: 53, b: 33 },
], { x: 518, y: 329 }, { x: 26, y: 316 });
// a page to start auto game
exports.autoGameConfirm = new Rerouter_1.Page('autoGameConfirm', [
    // title
    { x: 277, y: 60, r: 180, g: 186, b: 189 },
    { x: 295, y: 58, r: 16, g: 24, b: 33 },
    { x: 308, y: 61, r: 16, g: 24, b: 33 },
    { x: 328, y: 58, r: 177, g: 183, b: 185 },
    { x: 353, y: 61, r: 177, g: 182, b: 185 },
    // bg
    { x: 108, y: 49, r: 181, g: 186, b: 189 },
    { x: 107, y: 314, r: 214, g: 219, b: 222 },
    { x: 516, y: 302, r: 214, g: 219, b: 222 },
    { x: 491, y: 171, r: 181, g: 186, b: 189 },
    // x
    { x: 510, y: 48, r: 168, g: 173, b: 176 },
    { x: 516, y: 55, r: 103, g: 105, b: 109 },
    { x: 524, y: 48, r: 71, g: 70, b: 71 },
    // no and yes
    { x: 223, y: 298, r: 41, g: 77, b: 123 },
    { x: 248, y: 298, r: 158, g: 183, b: 214 },
    { x: 388, y: 299, r: 196, g: 223, b: 255 },
    { x: 430, y: 302, r: 8, g: 113, b: 247 },
    // content to diff with confirm end (you selected)
    { x: 286, y: 180, r: 82, g: 86, b: 94 },
    { x: 304, y: 178, r: 120, g: 128, b: 136 },
    { x: 324, y: 178, r: 95, g: 103, b: 112 },
], { x: 390, y: 304 }, // yes, start auto play
{ x: 237, y: 304 } // no, not start auto play
);
// a page to end auto game
exports.autoGameConfirmEnd = new Rerouter_1.Page('autoGameConfirmEnd', [
    // title
    { x: 277, y: 60, r: 180, g: 186, b: 189 },
    { x: 295, y: 58, r: 16, g: 24, b: 33 },
    { x: 308, y: 61, r: 16, g: 24, b: 33 },
    { x: 328, y: 58, r: 177, g: 183, b: 185 },
    { x: 353, y: 61, r: 177, g: 182, b: 185 },
    // bg
    { x: 108, y: 49, r: 181, g: 186, b: 189 },
    { x: 107, y: 314, r: 214, g: 219, b: 222 },
    { x: 516, y: 302, r: 214, g: 219, b: 222 },
    { x: 491, y: 171, r: 181, g: 186, b: 189 },
    // x
    { x: 510, y: 48, r: 168, g: 173, b: 176 },
    { x: 516, y: 55, r: 103, g: 105, b: 109 },
    { x: 524, y: 48, r: 71, g: 70, b: 71 },
    // no and yes
    { x: 223, y: 298, r: 41, g: 77, b: 123 },
    { x: 248, y: 298, r: 158, g: 183, b: 214 },
    { x: 388, y: 299, r: 196, g: 223, b: 255 },
    { x: 430, y: 302, r: 8, g: 113, b: 247 },
    // TODO: use end game content
], { x: 237, y: 304 }, // no, continue auto play
{ x: 390, y: 304 } // yes, end auto play
);
exports.rechargeBallRankMode = new Rerouter_1.Page('rechargeBallRankMode', [
    // title
    { x: 192, y: 49, r: 197, g: 198, b: 206 },
    { x: 241, y: 49, r: 182, g: 182, b: 191 },
    { x: 302, y: 58, r: 160, g: 161, b: 168 },
    { x: 345, y: 59, r: 197, g: 198, b: 206 },
    { x: 362, y: 59, r: 32, g: 38, b: 46 },
    { x: 415, y: 60, r: 67, g: 72, b: 80 },
    { x: 438, y: 58, r: 197, g: 198, b: 206 },
    // bg
    { x: 115, y: 46, r: 181, g: 186, b: 189 },
    { x: 109, y: 306, r: 214, g: 219, b: 222 },
    { x: 521, y: 305, r: 214, g: 219, b: 222 },
    { x: 515, y: 44, r: 71, g: 70, b: 71 },
], { x: 518, y: 49 }, // cancel
{ x: 518, y: 49 });
exports.rechargeBallLeagueMode = new Rerouter_1.Page('rechargeBallLeagueMode', [
    // title
    { x: 224, y: 55, r: 197, g: 198, b: 206 },
    { x: 268, y: 60, r: 24, g: 32, b: 37 },
    { x: 316, y: 62, r: 197, g: 198, b: 206 },
    { x: 368, y: 61, r: 23, g: 31, b: 40 },
    { x: 401, y: 56, r: 197, g: 198, b: 206 },
    { x: 440, y: 60, r: 197, g: 198, b: 206 },
    // bg
    { x: 110, y: 53, r: 197, g: 198, b: 206 },
    { x: 114, y: 298, r: 238, g: 243, b: 238 },
    { x: 315, y: 307, r: 234, g: 241, b: 234 },
    { x: 521, y: 306, r: 238, g: 243, b: 238 },
    { x: 518, y: 51, r: 197, g: 198, b: 198 },
], { x: 518, y: 49 }, // cancel
{ x: 518, y: 49 });
// * LeagueModes
exports.leagueModePanel = new Rerouter_1.Page('leagueModePanel', [
    // navi bar
    { x: 300, y: 12, r: 214, g: 214, b: 214 },
    { x: 316, y: 9, r: 238, g: 234, b: 238 },
    { x: 320, y: 15, r: 144, g: 148, b: 149 },
    { x: 388, y: 10, r: 238, g: 234, b: 238 },
    { x: 385, y: 9, r: 64, g: 67, b: 71 },
    { x: 493, y: 11, r: 244, g: 204, b: 39 },
    { x: 571, y: 14, r: 147, g: 161, b: 171 },
    { x: 606, y: 14, r: 74, g: 93, b: 123 },
    { x: 631, y: 15, r: 214, g: 219, b: 214 },
    // btn in bottom
    { x: 85, y: 326, r: 234, g: 238, b: 238 },
    { x: 112, y: 327, r: 214, g: 231, b: 238 },
    { x: 163, y: 326, r: 222, g: 225, b: 227 },
    { x: 198, y: 327, r: 80, g: 117, b: 159 },
    { x: 251, y: 324, r: 255, g: 255, b: 255 },
    { x: 278, y: 330, r: 189, g: 206, b: 219 },
], { x: 616, y: 336 }, { x: 41, y: 320 });
exports.leagueModeGameInfo = new Rerouter_1.Page('leagueModeGameInfo', [
    { x: 292, y: 9, r: 214, g: 213, b: 214 },
    { x: 314, y: 7, r: 255, g: 251, b: 255 },
    { x: 379, y: 3, r: 214, g: 215, b: 214 },
    { x: 389, y: 10, r: 239, g: 236, b: 239 },
    { x: 482, y: 3, r: 214, g: 218, b: 220 },
    { x: 493, y: 9, r: 255, g: 246, b: 192 },
    { x: 589, y: 11, r: 74, g: 93, b: 123 },
    { x: 596, y: 11, r: 81, g: 104, b: 131 },
    { x: 624, y: 12, r: 214, g: 211, b: 214 },
    { x: 26, y: 312, r: 209, g: 214, b: 209 },
    { x: 631, y: 56, r: 206, g: 207, b: 214 },
    { x: 631, y: 70, r: 168, g: 177, b: 193 },
    { x: 623, y: 64, r: 33, g: 125, b: 255 },
    { x: 270, y: 179, r: 206, g: 211, b: 222 },
    { x: 256, y: 214, r: 206, g: 211, b: 222 },
    { x: 242, y: 242, r: 206, g: 211, b: 222 },
    { x: 612, y: 281, r: 24, g: 36, b: 49 },
], { x: 546, y: 325 }, // playBall
{ x: 41, y: 320 });
// normal game play start
exports.selectPlayRoleBtns = {
    playOffenseOnly: { x: 128, y: 279 },
    playAll: { x: 317, y: 282 },
    playDeffenseOnly: { x: 506, y: 281 },
};
exports.selectPlayRole = new Rerouter_1.Page('selectPlayRole', [
    { x: 97, y: 282, r: 255, g: 255, b: 255 },
    { x: 145, y: 282, r: 255, g: 255, b: 255 },
    { x: 499, y: 282, r: 255, g: 255, b: 255 },
    { x: 539, y: 282, r: 255, g: 255, b: 255 },
    { x: 543, y: 282, r: 255, g: 255, b: 255 },
    { x: 563, y: 282, r: 255, g: 255, b: 255 },
    { x: 90, y: 110, r: 194, g: 82, b: 24 },
    { x: 552, y: 112, r: 57, g: 120, b: 197 },
], 
// TODO: make which role can be selected if need
exports.selectPlayRoleBtns.playAll, exports.selectPlayRoleBtns.playAll);
// sometimes happened when restarting a continued game
// or cancel auto play during playing
exports.leagueContinuePlaying = new Rerouter_1.Page('leagueContinuePlaying', [
    // fast progression
    { x: 452, y: 279, r: 8, g: 109, b: 255 },
    { x: 476, y: 279, r: 251, g: 252, b: 255 },
    { x: 502, y: 275, r: 190, g: 220, b: 255 },
    { x: 530, y: 279, r: 218, g: 233, b: 255 },
    { x: 552, y: 273, r: 8, g: 125, b: 255 },
    { x: 563, y: 276, r: 234, g: 244, b: 255 },
    { x: 579, y: 279, r: 8, g: 109, b: 255 },
    { x: 587, y: 273, r: 8, g: 125, b: 255 },
    // continue
    { x: 458, y: 320, r: 8, g: 109, b: 255 },
    { x: 480, y: 324, r: 122, g: 168, b: 247 },
    { x: 520, y: 317, r: 84, g: 159, b: 250 },
    { x: 544, y: 324, r: 226, g: 234, b: 252 },
    { x: 572, y: 319, r: 8, g: 113, b: 255 },
    { x: 591, y: 325, r: 0, g: 97, b: 247 },
], { x: 458, y: 320 }, // continue game
{ x: 458, y: 320 } // continue game
);
exports.leagueOnPlayAutoOff = new Rerouter_1.Page('leagueOnPlayAutoOff', [
    // auto
    { x: 514, y: 20, r: 255, g: 255, b: 255 },
    { x: 525, y: 21, r: 255, g: 255, b: 255 },
    // camera
    { x: 556, y: 21, r: 183, g: 185, b: 186 },
    { x: 560, y: 23, r: 197, g: 198, b: 197 },
    { x: 569, y: 21, r: 206, g: 207, b: 206 },
], { x: 511, y: 20 }, // switch to auto mode
{ x: 611, y: 20 } // pause button
);
exports.leagueOnPlayAutoOff1 = new Rerouter_1.Page('leagueOnPlayAutoOff', 
// has swing button
[
    { x: 521, y: 263, r: 24, g: 29, b: 16 },
    { x: 520, y: 255, r: 213, g: 213, b: 212 },
    { x: 533, y: 255, r: 223, g: 221, b: 222 },
    { x: 514, y: 244, r: 16, g: 28, b: 16 },
], { x: 511, y: 20 }, // switch to auto mode
{ x: 611, y: 20 } // pause button
);
exports.leagueOnPlayAutoOffGroup = new Rerouter_1.GroupPage('leagueOnPlayAutoOffGroup', [exports.leagueOnPlayAutoOff, exports.leagueOnPlayAutoOff1], exports.leagueOnPlayAutoOff.next /* next */, exports.leagueOnPlayAutoOff.back /* back */);
// auto play on, power save off
exports.leagueOnPlayPowerSaveOff = new Rerouter_1.Page('leagueOnPlayPowerSaveOff', [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    { x: 492, y: 16, r: 101, g: 103, b: 101 },
    { x: 488, y: 22, r: 210, g: 208, b: 210 },
    { x: 481, y: 27, r: 102, g: 101, b: 101 },
    { x: 489, y: 29, r: 197, g: 197, b: 197 },
], { x: 485, y: 21 }, // turn on power save
{ x: 552, y: 21 } // turn off auto play
);
// same as gLeagueOnPlayPowerSaveOff, but is stopped
// need to turn on autoplay
exports.leagueOnPlayPowerSaveOffStopped = new Rerouter_1.Page('leagueOnPlayPowerSaveOff', [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    { x: 492, y: 16, r: 101, g: 103, b: 101 },
    { x: 488, y: 22, r: 210, g: 208, b: 210 },
    { x: 481, y: 27, r: 102, g: 101, b: 101 },
    { x: 489, y: 29, r: 197, g: 197, b: 197 },
    // disabled autoplay text
    { x: 524, y: 23, r: 91, g: 110, b: 158 },
    { x: 530, y: 20, r: 140, g: 146, b: 152 },
    { x: 533, y: 24, r: 93, g: 106, b: 143 },
    { x: 550, y: 25, r: 85, g: 105, b: 153 },
    { x: 552, y: 21, r: 147, g: 153, b: 156 },
    { x: 557, y: 20, r: 148, g: 154, b: 156 },
    { x: 566, y: 24, r: 99, g: 121, b: 173 },
    { x: 575, y: 18, r: 107, g: 121, b: 173 },
    { x: 584, y: 19, r: 97, g: 122, b: 169 },
    { x: 589, y: 22, r: 118, g: 127, b: 149 },
    { x: 595, y: 18, r: 141, g: 150, b: 156 },
    { x: 606, y: 23, r: 74, g: 93, b: 132 },
], { x: 0, y: 0 }, // turn on auto play
{ x: 0, y: 0 } // turn on auto play
);
// don't do any thing, just avoid to enter unknown
exports.leagueOnPlayPowerSaveOffMid = new Rerouter_1.Page('leagueOnPlayPowerSaveOff', [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    // dialog on
    { x: 604, y: 47, r: 170, g: 171, b: 170 },
    { x: 607, y: 49, r: 246, g: 246, b: 246 },
    { x: 611, y: 54, r: 213, g: 210, b: 213 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.leagueOnPlayPowerSaveOffMid1 = new Rerouter_1.Page('leagueOnPlayPowerSaveOff', [
    // battery
    { x: 486, y: 13, r: 255, g: 255, b: 255 },
    // dialog off
    { x: 605, y: 50, r: 95, g: 99, b: 97 },
    { x: 602, y: 51, r: 109, g: 114, b: 116 },
    { x: 603, y: 49, r: 131, g: 133, b: 131 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.leagueOnPlayPowerSaveOffGroups = new Rerouter_1.GroupPage('leagueOnPlayPowerSaveOffGroup', [
    exports.leagueOnPlayPowerSaveOff,
    exports.leagueOnPlayPowerSaveOffStopped,
    exports.leagueOnPlayPowerSaveOffMid,
    exports.leagueOnPlayPowerSaveOffMid1,
]);
exports.onPlayPowerSaveOn = new Rerouter_1.Page('onPlayPowerSaveOn', [
    { x: 304, y: 136, r: 156, g: 160, b: 165 },
    { x: 305, y: 136, r: 156, g: 160, b: 165 },
    { x: 306, y: 136, r: 156, g: 160, b: 165 },
    { x: 307, y: 136, r: 156, g: 160, b: 165 },
    { x: 308, y: 136, r: 156, g: 160, b: 165 },
    { x: 301, y: 133, r: 165, g: 162, b: 165 },
    { x: 302, y: 133, r: 165, g: 162, b: 165 },
    { x: 303, y: 133, r: 165, g: 162, b: 165 },
    { x: 304, y: 133, r: 165, g: 162, b: 165 },
    { x: 305, y: 133, r: 165, g: 162, b: 165 },
    { x: 36, y: 26, r: 0, g: 0, b: 0 },
    { x: 36, y: 326, r: 0, g: 0, b: 0 },
    { x: 613, y: 330, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    { x: 602, y: 27, r: 0, g: 0, b: 0 },
    { x: 174, y: 162, r: 0, g: 0, b: 0 },
    { x: 476, y: 158, r: 0, g: 0, b: 0 },
    // score bg
    { x: 497, y: 300, r: 16, g: 20, b: 16 },
    { x: 498, y: 300, r: 16, g: 20, b: 16 },
    { x: 499, y: 300, r: 16, g: 20, b: 16 },
    { x: 500, y: 300, r: 16, g: 20, b: 16 },
    { x: 501, y: 300, r: 16, g: 20, b: 16 },
    { x: 502, y: 300, r: 16, g: 20, b: 16 },
    { x: 503, y: 300, r: 16, g: 20, b: 16 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
// FIXME: change colors
exports.onQuickPlay = new Rerouter_1.Page('onQuickPlay', [
    // bg right panel
    { x: 456, y: 11, r: 58, g: 77, b: 123 },
    { x: 623, y: 10, r: 58, g: 73, b: 115 },
    { x: 457, y: 348, r: 33, g: 40, b: 58 },
    { x: 632, y: 350, r: 33, g: 40, b: 58 },
    // blue btn: play manually
    { x: 298, y: 321, r: 33, g: 131, b: 255 },
    { x: 311, y: 335, r: 158, g: 191, b: 235 },
    { x: 433, y: 334, r: 8, g: 57, b: 123 },
    { x: 433, y: 349, r: 0, g: 81, b: 238 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.onQuickPlay1 = new Rerouter_1.Page('onQuickPlay', // same behaviour, without blue btn on right bottom
[
    // bg right panel
    { x: 454, y: 8, r: 58, g: 77, b: 123 },
    { x: 455, y: 351, r: 33, g: 40, b: 58 },
    { x: 628, y: 348, r: 33, g: 40, b: 58 },
    { x: 627, y: 9, r: 58, g: 73, b: 115 },
    // diff from other page
    { x: 433, y: 324, r: 85, g: 107, b: 68 },
    { x: 433, y: 320, r: 83, g: 109, b: 66 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
// sometimes the quick play will be paused
exports.onQuickPlayPause = new Rerouter_1.Page('onQuickPlayPause', [
    { x: 456, y: 11, r: 49, g: 73, b: 123 },
    { x: 472, y: 22, r: 201, g: 207, b: 218 },
    { x: 532, y: 22, r: 81, g: 100, b: 128 },
    { x: 453, y: 347, r: 24, g: 36, b: 57 },
    { x: 306, y: 276, r: 8, g: 118, b: 255 },
    { x: 421, y: 283, r: 2, g: 105, b: 247 },
    { x: 325, y: 337, r: 0, g: 97, b: 247 },
    { x: 430, y: 336, r: 0, g: 97, b: 247 },
], { x: 376, y: 329 }, // play ball // TODO: might need to set inning
{ x: 376, y: 329 });
exports.onQuickPlayGroup = new Rerouter_1.GroupPage('onQuickPlay', [exports.onQuickPlay, exports.onQuickPlay1], exports.onQuickPlay.next /* next */);
// when playing, press back
exports.leagueOnPlayPause = new Rerouter_1.Page('leagueOnPlayPause', [
    // continue button
    { x: 89, y: 148, r: 255, g: 255, b: 255 },
    { x: 99, y: 138, r: 82, g: 89, b: 99 },
    // leave button
    { x: 527, y: 165, r: 255, g: 255, b: 255 },
    { x: 555, y: 153, r: 255, g: 255, b: 255 },
    // mlb logo
    { x: 554, y: 291, r: 0, g: 28, b: 57 },
    { x: 563, y: 294, r: 255, g: 255, b: 255 },
    { x: 565, y: 290, r: 30, g: 54, b: 88 },
], { x: 89, y: 148 }, // continue game
{ x: 527, y: 165 } // leave
);
// cannot go to league mode due to unexpected error
exports.leagueModeUnexpectedError = new Rerouter_1.Page('leagueModeUnexpectedError', [
    // title
    { x: 272, y: 62, r: 193, g: 198, b: 202 },
    { x: 311, y: 59, r: 16, g: 23, b: 32 },
    { x: 338, y: 60, r: 71, g: 72, b: 80 },
    { x: 396, y: 60, r: 192, g: 198, b: 203 },
    // content
    { x: 206, y: 137, r: 58, g: 67, b: 78 },
    { x: 333, y: 180, r: 100, g: 109, b: 118 },
    { x: 368, y: 203, r: 139, g: 145, b: 154 },
    // ok & bg
    { x: 319, y: 301, r: 24, g: 117, b: 238 },
    { x: 164, y: 304, r: 239, g: 242, b: 239 },
    { x: 487, y: 303, r: 241, g: 240, b: 241 },
], { x: 320, y: 300 }, { x: 320, y: 300 });
exports.gameResult = new Rerouter_1.Page('gameResult', [
    { x: 458, y: 24, r: 41, g: 44, b: 49 },
    { x: 126, y: 333, r: 49, g: 81, b: 123 },
    { x: 247, y: 335, r: 41, g: 81, b: 115 },
    { x: 609, y: 335, r: 8, g: 109, b: 255 }, // next btn
], { x: 609, y: 335 }, { x: 609, y: 335 });
exports.gameResultAquired = new Rerouter_1.Page('gameResultAquired', [
    { x: 449, y: 23, r: 41, g: 44, b: 49 },
    { x: 39, y: 329, r: 213, g: 218, b: 213 },
    { x: 158, y: 287, r: 247, g: 126, b: 51 },
    { x: 612, y: 328, r: 8, g: 109, b: 247 }, // ok btn
], { x: 612, y: 328 }, { x: 612, y: 328 });
exports.gameResultOther = new Rerouter_1.Page('gameResultOther', [
    { x: 71, y: 29, r: 0, g: 85, b: 156 },
    { x: 556, y: 15, r: 212, g: 228, b: 241 },
    { x: 595, y: 13, r: 0, g: 93, b: 181 },
    { x: 610, y: 13, r: 0, g: 28, b: 57 },
    { x: 618, y: 13, r: 17, g: 26, b: 58 },
    { x: 624, y: 8, r: 243, g: 244, b: 245 },
    { x: 627, y: 24, r: 165, g: 186, b: 202 },
    { x: 578, y: 23, r: 70, g: 132, b: 182 },
    { x: 249, y: 56, r: 84, g: 121, b: 161 },
    { x: 267, y: 56, r: 255, g: 255, b: 255 },
    { x: 319, y: 60, r: 168, g: 191, b: 208 },
    { x: 377, y: 58, r: 255, g: 255, b: 255 },
    { x: 29, y: 93, r: 0, g: 36, b: 66 },
    { x: 617, y: 314, r: 16, g: 24, b: 17 },
    { x: 108, y: 322, r: 8, g: 20, b: 16 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.gameResultWorldChampion = new Rerouter_1.Page('gameResultWorldChampion', [
    { x: 252, y: 22, r: 57, g: 67, b: 74 },
    { x: 323, y: 42, r: 116, g: 109, b: 83 },
    { x: 350, y: 73, r: 66, g: 91, b: 96 },
    { x: 49, y: 331, r: 16, g: 32, b: 41 },
    { x: 209, y: 322, r: 8, g: 20, b: 24 },
    { x: 294, y: 326, r: 208, g: 208, b: 212 },
    { x: 400, y: 323, r: 192, g: 190, b: 192 },
    { x: 439, y: 323, r: 85, g: 98, b: 100 },
    { x: 578, y: 195, r: 16, g: 36, b: 41 },
    { x: 316, y: 167, r: 212, g: 210, b: 212 },
    { x: 338, y: 173, r: 65, g: 71, b: 71 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.gameReward = new Rerouter_1.Page('gameReward', [
    { x: 24, y: 336, r: 16, g: 32, b: 41 },
    { x: 577, y: 26, r: 0, g: 4, b: 0 },
    { x: 601, y: 335, r: 16, g: 32, b: 41 },
    { x: 411, y: 268, r: 8, g: 114, b: 255 },
    { x: 434, y: 270, r: 66, g: 144, b: 252 },
    { x: 487, y: 274, r: 0, g: 102, b: 247 },
    { x: 497, y: 122, r: 255, g: 255, b: 255 },
    { x: 461, y: 193, r: 42, g: 58, b: 58 },
], { x: 412, y: 271 }, { x: 412, y: 271 });
exports.bestPositionAwardBonus = new Rerouter_1.Page('bestPositionAwardBonus', [
    // bg
    { x: 141, y: 21, r: 0, g: 81, b: 148 },
    { x: 609, y: 26, r: 0, g: 81, b: 148 },
    { x: 26, y: 335, r: 16, g: 24, b: 24 },
    { x: 626, y: 339, r: 16, g: 24, b: 24 },
    { x: 4, y: 148, r: 8, g: 24, b: 33 },
    { x: 628, y: 140, r: 16, g: 32, b: 49 },
    // team 1 being selected
    { x: 173, y: 18, r: 0, g: 117, b: 255 },
    { x: 176, y: 30, r: 158, g: 173, b: 199 },
    { x: 184, y: 36, r: 8, g: 105, b: 255 },
    // team 2 not being selected
    { x: 328, y: 27, r: 49, g: 85, b: 123 },
    { x: 337, y: 31, r: 16, g: 48, b: 82 },
    { x: 343, y: 37, r: 41, g: 77, b: 115 },
    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.bestPositionAwardBonus2 = new Rerouter_1.Page('bestPositionAwardBonus', [
    // bg
    { x: 141, y: 21, r: 0, g: 81, b: 148 },
    { x: 609, y: 26, r: 0, g: 81, b: 148 },
    { x: 26, y: 335, r: 16, g: 24, b: 24 },
    { x: 626, y: 339, r: 16, g: 24, b: 24 },
    { x: 4, y: 148, r: 8, g: 24, b: 33 },
    { x: 628, y: 140, r: 16, g: 32, b: 49 },
    // team 1 not being selected
    { x: 189, y: 22, r: 49, g: 85, b: 123 },
    { x: 178, y: 34, r: 8, g: 48, b: 82 },
    { x: 169, y: 39, r: 41, g: 77, b: 115 },
    // team 2 being selected
    { x: 343, y: 21, r: 2, g: 117, b: 255 },
    { x: 337, y: 31, r: 163, g: 170, b: 197 },
    { x: 331, y: 40, r: 8, g: 97, b: 255 },
    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.bestPositionAwardBonusGroup = new Rerouter_1.GroupPage('bestPositionAwardBonus', [exports.bestPositionAwardBonus, exports.bestPositionAwardBonus2], exports.bestPositionAwardBonus.next /* next */);
// next page of gBestPositionAwardBonus
exports.bonusGrantedByTeamRecord = new Rerouter_1.Page('bonusGrantedByTeamRecord', [
    // table bg
    { x: 38, y: 75, r: 49, g: 69, b: 107 },
    { x: 600, y: 73, r: 49, g: 69, b: 107 },
    { x: 601, y: 289, r: 0, g: 8, b: 16 },
    { x: 28, y: 285, r: 8, g: 12, b: 16 },
    // title
    { x: 176, y: 76, r: 49, g: 68, b: 107 },
    { x: 217, y: 77, r: 128, g: 136, b: 159 },
    { x: 255, y: 76, r: 131, g: 137, b: 157 },
    { x: 278, y: 76, r: 78, g: 95, b: 128 },
    { x: 324, y: 77, r: 113, g: 122, b: 150 },
    { x: 362, y: 75, r: 46, g: 66, b: 104 },
    { x: 405, y: 77, r: 178, g: 185, b: 206 },
    { x: 425, y: 72, r: 184, g: 187, b: 206 },
    { x: 439, y: 77, r: 53, g: 70, b: 110 },
    // ok
    { x: 547, y: 320, r: 0, g: 113, b: 248 },
    { x: 566, y: 321, r: 255, g: 255, b: 255 },
    { x: 577, y: 324, r: 228, g: 239, b: 248 },
    { x: 605, y: 325, r: 8, g: 109, b: 247 },
    { x: 611, y: 316, r: 0, g: 117, b: 255 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.postSeasonAwardBonus = new Rerouter_1.Page('postSeasonAwardBonus', [
    // bg
    { x: 39, y: 24, r: 0, g: 81, b: 148 },
    { x: 320, y: 15, r: 0, g: 85, b: 165 },
    { x: 615, y: 23, r: 0, g: 81, b: 148 },
    { x: 11, y: 268, r: 16, g: 28, b: 33 },
    { x: 621, y: 258, r: 16, g: 28, b: 33 },
    { x: 624, y: 351, r: 16, g: 24, b: 24 },
    { x: 17, y: 338, r: 16, g: 24, b: 24 },
    { x: 316, y: 342, r: 16, g: 24, b: 24 },
    // ok
    { x: 531, y: 318, r: 0, g: 117, b: 255 },
    { x: 564, y: 323, r: 218, g: 234, b: 254 },
    { x: 577, y: 323, r: 255, g: 255, b: 255 },
    { x: 608, y: 318, r: 0, g: 117, b: 255 },
    { x: 606, y: 331, r: 8, g: 105, b: 255 },
], { x: 570, y: 325 }, { x: 570, y: 325 });
exports.gameLineUp = new Rerouter_1.Page('gameLineUp', [
    // content top bg
    { x: 591, y: 59, r: 49, g: 73, b: 107 },
    // progress bg
    { x: 19, y: 211, r: 24, g: 32, b: 49 },
    // battle lineup button in bottom
    { x: 536, y: 322, r: 41, g: 81, b: 137 },
    { x: 553, y: 322, r: 188, g: 209, b: 224 },
    { x: 568, y: 322, r: 204, g: 220, b: 234 },
    { x: 585, y: 324, r: 107, g: 139, b: 177 },
    { x: 604, y: 324, r: 25, g: 73, b: 132 },
    // back
    { x: 26, y: 314, r: 214, g: 219, b: 214 },
    { x: 43, y: 321, r: 214, g: 219, b: 214 },
    { x: 36, y: 329, r: 211, g: 216, b: 210 },
], { x: 40, y: 324 }, { x: 40, y: 324 });
exports.playerGrowthComplete = new Rerouter_1.Page('playerGrowthComplete', [
    // bg
    { x: 115, y: 47, r: 181, g: 186, b: 189 },
    { x: 114, y: 300, r: 214, g: 219, b: 222 },
    { x: 514, y: 301, r: 214, g: 219, b: 222 },
    { x: 522, y: 74, r: 181, g: 186, b: 189 },
    { x: 110, y: 169, r: 206, g: 210, b: 214 },
    { x: 110, y: 230, r: 181, g: 186, b: 189 },
    { x: 522, y: 156, r: 206, g: 210, b: 214 },
    { x: 513, y: 230, r: 181, g: 186, b: 189 },
    // continue
    { x: 240, y: 300, r: 8, g: 114, b: 248 },
    { x: 312, y: 301, r: 223, g: 233, b: 247 },
    { x: 337, y: 306, r: 255, g: 255, b: 255 },
    { x: 399, y: 302, r: 8, g: 110, b: 247 },
], { x: 325, y: 304 }, { x: 325, y: 304 });
exports.leagueRewardAchievementGrade = new Rerouter_1.Page('leagueRewardAchievementGrade', [
    // title bg & x
    { x: 20, y: 34, r: 222, g: 219, b: 222 },
    { x: 20, y: 63, r: 222, g: 219, b: 222 },
    { x: 600, y: 36, r: 212, g: 209, b: 212 },
    { x: 611, y: 56, r: 222, g: 218, b: 222 },
    { x: 442, y: 67, r: 222, g: 219, b: 222 },
    // progress bar bg
    { x: 16, y: 79, r: 0, g: 49, b: 90 },
    { x: 18, y: 193, r: 0, g: 49, b: 90 },
    { x: 616, y: 199, r: 16, g: 65, b: 115 },
    // bg in bottom
    { x: 618, y: 215, r: 33, g: 32, b: 41 },
    { x: 613, y: 326, r: 41, g: 45, b: 49 },
], { x: 600, y: 45 }, { x: 600, y: 45 });
// r
exports.leagueRewardAchievementGradeBonusPlayer = new Rerouter_1.Page('leagueRewardAchievementGradeBonusPlayer', [
    // title and x
    { x: 173, y: 58, r: 147, g: 153, b: 156 },
    { x: 229, y: 58, r: 79, g: 82, b: 82 },
    { x: 320, y: 60, r: 160, g: 163, b: 164 },
    { x: 373, y: 55, r: 177, g: 184, b: 185 },
    { x: 443, y: 60, r: 101, g: 105, b: 110 },
    { x: 521, y: 51, r: 66, g: 69, b: 66 },
    // logo on center
    { x: 290, y: 132, r: 8, g: 28, b: 66 },
    { x: 325, y: 150, r: 255, g: 255, b: 255 },
    { x: 357, y: 133, r: 189, g: 0, b: 33 },
    // next
    { x: 281, y: 298, r: 8, g: 117, b: 255 },
    { x: 323, y: 299, r: 220, g: 234, b: 250 },
    { x: 365, y: 307, r: 8, g: 101, b: 247 },
    { x: 307, y: 301, r: 250, g: 252, b: 254 },
    { x: 329, y: 297, r: 252, g: 253, b: 255 },
], { x: 320, y: 300 }, { x: 320, y: 300 });
exports.pitcherOfTheMonth = new Rerouter_1.Page('pitcherOfTheMonth', [
    { x: 27, y: 38, r: 181, g: 186, b: 198 },
    { x: 602, y: 46, r: 154, g: 152, b: 155 },
    { x: 535, y: 309, r: 139, g: 188, b: 255 },
    { x: 605, y: 316, r: 0, g: 97, b: 247 },
    { x: 391, y: 309, r: 222, g: 219, b: 222 },
], { x: 545, y: 310 }, { x: 545, y: 310 });
exports.mvp = new Rerouter_1.Page('mvp', [
    { x: 273, y: 23, r: 0, g: 89, b: 165 },
    { x: 297, y: 25, r: 90, g: 145, b: 200 },
    { x: 320, y: 25, r: 255, g: 255, b: 255 },
    { x: 332, y: 29, r: 126, g: 169, b: 204 },
    { x: 380, y: 53, r: 0, g: 65, b: 122 },
    { x: 493, y: 322, r: 16, g: 20, b: 8 },
    { x: 568, y: 320, r: 38, g: 120, b: 218 },
    { x: 635, y: 341, r: 8, g: 16, b: 8 },
    { x: 620, y: 164, r: 0, g: 8, b: 8 },
    { x: 9, y: 176, r: 12, g: 24, b: 24 },
], { x: 568, y: 320 }, { x: 568, y: 320 });
exports.selectRewardPlayer = new Rerouter_1.Page('selectRewardPlayer', [
    // bg
    { x: 4, y: 6, r: 0, g: 97, b: 189 },
    { x: 11, y: 346, r: 16, g: 16, b: 8 },
    { x: 7, y: 350, r: 16, g: 20, b: 16 },
    // form bg in bottom
    { x: 65, y: 301, r: 66, g: 77, b: 66 },
    { x: 65, y: 326, r: 40, g: 45, b: 33 },
    { x: 175, y: 303, r: 66, g: 77, b: 58 },
    { x: 174, y: 328, r: 41, g: 45, b: 33 },
    { x: 275, y: 304, r: 66, g: 73, b: 58 },
    { x: 275, y: 324, r: 41, g: 48, b: 33 },
    { x: 384, y: 301, r: 66, g: 73, b: 58 },
    { x: 384, y: 321, r: 41, g: 45, b: 33 },
], { x: 568, y: 320 }, { x: 568, y: 320 });
// TODO: check the position, must be bg of 'diamond', 'old' ...
// bg of the word
// ref: https://www.facebook.com/mlb9innings/photos/1366596103748570
// left, mid and right respectively
exports.selectRewardPlayerBtns = [
    { x: 66, y: 217 },
    { x: 221, y: 217 },
    { x: 377, y: 217 },
];
// only include basic types
// {r}-{g}-{b}: prority
// try x 23, y 260 in player info
exports.playerCardColorToRank = {
    '66-74-74': 1,
    '99-65-41': 2,
    '99-65-49': 2,
    '132-129-148': 3,
    '189-166-49': 4,
    '189-166-58': 4,
    '198-170-57': 4,
    '148-101-25': 4,
    '165-166-90': 4,
    '41-69-107': 5, // diamond TODO: unknown color
};
// adReward pages
exports.adReward = new Rerouter_1.Page('adReward', [
    // bg
    { x: 28, y: 45, r: 222, g: 219, b: 222 },
    { x: 36, y: 267, r: 181, g: 186, b: 197 },
    { x: 32, y: 307, r: 238, g: 243, b: 238 },
    { x: 605, y: 52, r: 222, g: 219, b: 222 },
    { x: 611, y: 244, r: 181, g: 186, b: 197 },
    { x: 607, y: 319, r: 238, g: 243, b: 238 },
    // watch ad icon & btn bg
    { x: 344, y: 300, r: 49, g: 162, b: 90 },
    { x: 490, y: 318, r: 41, g: 142, b: 82 },
    { x: 361, y: 308, r: 0, g: 147, b: 141 },
    { x: 375, y: 316, r: 0, g: 110, b: 107 },
    // cancel
    { x: 190, y: 310, r: 8, g: 109, b: 247 },
    { x: 204, y: 310, r: 8, g: 109, b: 247 },
    { x: 219, y: 310, r: 242, g: 246, b: 253 },
    { x: 232, y: 310, r: 8, g: 109, b: 247 },
    { x: 247, y: 310, r: 8, g: 109, b: 247 },
    { x: 258, y: 310, r: 8, g: 109, b: 247 },
], { x: 404, y: 310 }, { x: 224, y: 310 });
exports.adRewardRedeem = new Rerouter_1.Page('adRewardRedeem', [
    // ad reward title
    { x: 274, y: 51, r: 222, g: 219, b: 222 },
    { x: 302, y: 49, r: 16, g: 24, b: 33 },
    { x: 334, y: 51, r: 16, g: 24, b: 33 },
    { x: 356, y: 52, r: 90, g: 94, b: 102 },
    // bg
    { x: 25, y: 46, r: 222, g: 219, b: 222 },
    { x: 36, y: 307, r: 238, g: 243, b: 238 },
    { x: 601, y: 42, r: 123, g: 118, b: 123 },
    { x: 591, y: 318, r: 238, g: 243, b: 238 },
    { x: 21, y: 273, r: 181, g: 186, b: 197 },
    { x: 18, y: 81, r: 181, g: 186, b: 197 },
    { x: 616, y: 85, r: 181, g: 186, b: 197 },
    { x: 608, y: 269, r: 181, g: 186, b: 197 },
    // ok
    { x: 301, y: 310, r: 8, g: 109, b: 247 },
    { x: 319, y: 307, r: 19, g: 117, b: 244 },
    { x: 349, y: 307, r: 8, g: 113, b: 255 },
], { x: 303, y: 304 }, { x: 303, y: 304 });
exports.adRewardOnCD = new Rerouter_1.Page('adRewardOnCD', [
    // title (alert)
    { x: 220, y: 53, r: 197, g: 198, b: 206 },
    { x: 312, y: 58, r: 197, g: 198, b: 206 },
    { x: 330, y: 55, r: 16, g: 24, b: 33 },
    // ok
    { x: 288, y: 301, r: 8, g: 114, b: 248 },
    { x: 313, y: 304, r: 159, g: 190, b: 235 },
    { x: 362, y: 307, r: 8, g: 98, b: 247 },
], { x: 516, y: 48 }, // close
{ x: 516, y: 48 });
exports.adGroup = new Rerouter_1.GroupPage('adPages', [exports.adReward, exports.adRewardRedeem, exports.adRewardOnCD]);
// weekly mission pages
exports.achivementMission = new Rerouter_1.Page('achivementMission', [
    // today mission bg
    { x: 235, y: 55, r: 247, g: 247, b: 247 },
    { x: 231, y: 71, r: 247, g: 247, b: 247 },
    { x: 588, y: 72, r: 247, g: 247, b: 247 },
    // left section world record bg left bottom
    { x: 16, y: 293, r: 25, g: 40, b: 74 },
    // player head
    { x: 75, y: 88, r: 66, g: 59, b: 90 },
    // back
    { x: 31, y: 316, r: 214, g: 219, b: 214 },
], { x: 580, y: 278 }, // complete weekly mission box
{ x: 41, y: 320 });
exports.weeklyMissionBox = new Rerouter_1.Page('weeklyMissionBox', [
    // nav bar right part (p, star ...)
    { x: 299, y: 13, r: 214, g: 214, b: 214 },
    { x: 318, y: 9, r: 238, g: 234, b: 238 },
    { x: 313, y: 9, r: 238, g: 234, b: 238 },
    { x: 392, y: 9, r: 232, g: 229, b: 232 },
    { x: 385, y: 2, r: 214, g: 214, b: 214 },
    { x: 496, y: 13, r: 238, g: 166, b: 16 },
    { x: 483, y: 4, r: 214, g: 219, b: 216 },
    { x: 597, y: 10, r: 213, g: 226, b: 238 },
    { x: 628, y: 14, r: 214, g: 211, b: 214 },
    // bg of table
    { x: 14, y: 82, r: 33, g: 32, b: 41 },
    { x: 16, y: 288, r: 33, g: 44, b: 58 },
    { x: 615, y: 100, r: 33, g: 36, b: 41 },
    { x: 613, y: 283, r: 33, g: 44, b: 58 },
    // description footer
    { x: 80, y: 307, r: 202, g: 201, b: 196 },
    { x: 89, y: 315, r: 49, g: 61, b: 34 },
    { x: 103, y: 319, r: 73, g: 83, b: 66 },
    { x: 172, y: 335, r: 78, g: 84, b: 72 },
    { x: 250, y: 338, r: 101, g: 106, b: 93 },
    { x: 273, y: 307, r: 159, g: 159, b: 149 },
    { x: 284, y: 309, r: 56, g: 61, b: 40 },
    // back btn
    { x: 24, y: 314, r: 214, g: 214, b: 214 },
    { x: 42, y: 317, r: 214, g: 219, b: 214 },
    { x: 31, y: 331, r: 214, g: 219, b: 214 },
], { x: 41, y: 320 }, // back btn
{ x: 41, y: 320 });
exports.weeklyMissionBoxBtns = {
    openBox: { x: 418, y: 325 },
    receiveReward: { x: 561, y: 326 },
};
exports.weeklyMissionBoxConfirm = new Rerouter_1.Page('weeklyMissionBoxConfirm', [
    // bg
    { x: 111, y: 42, r: 181, g: 186, b: 189 },
    { x: 117, y: 304, r: 214, g: 219, b: 222 },
    { x: 515, y: 300, r: 214, g: 219, b: 222 },
    { x: 519, y: 177, r: 181, g: 186, b: 189 },
    // title
    { x: 240, y: 58, r: 155, g: 160, b: 163 },
    { x: 267, y: 58, r: 141, g: 147, b: 149 },
    { x: 325, y: 59, r: 161, g: 167, b: 170 },
    { x: 383, y: 59, r: 171, g: 179, b: 179 },
    { x: 407, y: 59, r: 181, g: 186, b: 189 },
    // x
    { x: 515, y: 49, r: 187, g: 185, b: 188 },
    { x: 519, y: 55, r: 91, g: 91, b: 92 },
    // no & yes btn
    { x: 210, y: 293, r: 41, g: 81, b: 123 },
    { x: 238, y: 296, r: 45, g: 81, b: 128 },
    { x: 284, y: 294, r: 41, g: 78, b: 123 },
    { x: 397, y: 299, r: 40, g: 134, b: 253 },
    { x: 433, y: 307, r: 8, g: 98, b: 247 },
], { x: 387, y: 300 }, // yes btn
{ x: 387, y: 300 });
exports.weeklyMissionBoxReceived = new Rerouter_1.Page('weeklyMissionBoxReceived', [
    // bg
    { x: 113, y: 53, r: 181, g: 186, b: 189 },
    { x: 117, y: 307, r: 214, g: 219, b: 222 },
    { x: 496, y: 299, r: 214, g: 219, b: 222 },
    // title
    { x: 217, y: 55, r: 181, g: 186, b: 189 },
    { x: 259, y: 55, r: 177, g: 181, b: 185 },
    { x: 298, y: 59, r: 181, g: 186, b: 189 },
    { x: 341, y: 60, r: 120, g: 124, b: 128 },
    { x: 386, y: 58, r: 16, g: 24, b: 33 },
    { x: 407, y: 58, r: 181, g: 186, b: 189 },
    // x
    { x: 512, y: 47, r: 181, g: 186, b: 182 },
    { x: 519, y: 53, r: 71, g: 70, b: 71 },
    // ok btn
    { x: 288, y: 297, r: 8, g: 122, b: 255 },
    { x: 320, y: 300, r: 136, g: 190, b: 255 },
    { x: 364, y: 301, r: 8, g: 114, b: 248 },
], { x: 320, y: 300 }, // ok btn
{ x: 320, y: 300 });
// general pages
exports.powerSaving = new Rerouter_1.Page('powerSaving', [
    { x: 304, y: 136, r: 156, g: 160, b: 165 },
    { x: 305, y: 136, r: 156, g: 160, b: 165 },
    { x: 306, y: 136, r: 156, g: 160, b: 165 },
    { x: 307, y: 136, r: 156, g: 160, b: 165 },
    { x: 308, y: 136, r: 156, g: 160, b: 165 },
    { x: 301, y: 133, r: 165, g: 162, b: 165 },
    { x: 302, y: 133, r: 165, g: 162, b: 165 },
    { x: 303, y: 133, r: 165, g: 162, b: 165 },
    { x: 304, y: 133, r: 165, g: 162, b: 165 },
    { x: 305, y: 133, r: 165, g: 162, b: 165 },
    { x: 137, y: 155, r: 0, g: 0, b: 0 },
    { x: 521, y: 160, r: 0, g: 0, b: 0 },
    { x: 298, y: 50, r: 0, g: 0, b: 0 },
    { x: 618, y: 10, r: 0, g: 0, b: 0 },
    // to diff from power saving during playing
    { x: 497, y: 300, r: 0, g: 0, b: 0 },
    { x: 498, y: 300, r: 0, g: 0, b: 0 },
    { x: 499, y: 300, r: 0, g: 0, b: 0 },
    { x: 500, y: 300, r: 0, g: 0, b: 0 },
    { x: 501, y: 300, r: 0, g: 0, b: 0 },
    { x: 502, y: 300, r: 0, g: 0, b: 0 },
    { x: 503, y: 300, r: 0, g: 0, b: 0 },
    { x: 555, y: 282, r: 0, g: 0, b: 0 },
    { x: 555, y: 292, r: 0, g: 0, b: 0 },
    { x: 545, y: 291, r: 0, g: 0, b: 0 },
    // score
    { x: 520, y: 280, r: 0, g: 0, b: 0 },
    { x: 525, y: 280, r: 0, g: 0, b: 0 },
    { x: 530, y: 280, r: 0, g: 0, b: 0 },
    { x: 535, y: 280, r: 0, g: 0, b: 0 },
    { x: 540, y: 280, r: 0, g: 0, b: 0 },
    { x: 545, y: 280, r: 0, g: 0, b: 0 },
    { x: 550, y: 280, r: 0, g: 0, b: 0 },
    { x: 520, y: 295, r: 0, g: 0, b: 0 },
    { x: 525, y: 295, r: 0, g: 0, b: 0 },
    { x: 530, y: 295, r: 0, g: 0, b: 0 },
    { x: 535, y: 295, r: 0, g: 0, b: 0 },
    { x: 540, y: 295, r: 0, g: 0, b: 0 },
    { x: 545, y: 295, r: 0, g: 0, b: 0 },
    { x: 550, y: 295, r: 0, g: 0, b: 0 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.promotion1 = new Rerouter_1.Page('promotion1', [
    { x: 603, y: 27, r: 124, g: 130, b: 132 },
    { x: 612, y: 33, r: 60, g: 60, b: 60 },
    { x: 605, y: 40, r: 174, g: 178, b: 181 },
    { x: 605, y: 35, r: 181, g: 178, b: 181 },
    { x: 612, y: 39, r: 181, g: 178, b: 181 },
    { x: 616, y: 39, r: 181, g: 178, b: 181 },
    { x: 615, y: 29, r: 142, g: 144, b: 142 },
], { x: 611, y: 36 }, { x: 611, y: 36 });
exports.promotion2 = new Rerouter_1.Page('promotion2', [
    { x: 43, y: 31, r: 206, g: 211, b: 222 },
    { x: 306, y: 29, r: 206, g: 211, b: 222 },
    { x: 546, y: 32, r: 206, g: 211, b: 222 },
    { x: 576, y: 36, r: 173, g: 174, b: 180 },
    { x: 580, y: 40, r: 174, g: 172, b: 175 },
    { x: 587, y: 36, r: 206, g: 207, b: 213 },
    { x: 576, y: 46, r: 213, g: 211, b: 215 },
    { x: 584, y: 45, r: 212, g: 210, b: 213 },
    { x: 595, y: 55, r: 206, g: 211, b: 222 },
], { x: 578, y: 39 }, { x: 578, y: 39 });
exports.promotion3 = new Rerouter_1.Page('promotion3', [
    { x: 598, y: 37, r: 101, g: 103, b: 102 },
    { x: 604, y: 45, r: 71, g: 73, b: 71 },
    { x: 612, y: 53, r: 174, g: 175, b: 176 },
    { x: 617, y: 33, r: 181, g: 186, b: 189 },
], { x: 601, y: 43 }, { x: 601, y: 43 });
exports.rechargePromotion = new Rerouter_1.Page('rechargePromotion', [
    { x: 114, y: 45, r: 181, g: 186, b: 189 },
    { x: 229, y: 59, r: 16, g: 24, b: 24 },
    { x: 280, y: 60, r: 35, g: 43, b: 48 },
    { x: 340, y: 58, r: 176, g: 181, b: 185 },
    { x: 407, y: 66, r: 38, g: 45, b: 47 },
    { x: 456, y: 89, r: 181, g: 186, b: 189 },
    { x: 520, y: 50, r: 67, g: 68, b: 68 },
    { x: 524, y: 58, r: 181, g: 186, b: 189 },
    { x: 529, y: 43, r: 151, g: 155, b: 156 },
    { x: 180, y: 302, r: 75, g: 149, b: 255 },
    { x: 144, y: 289, r: 41, g: 142, b: 255 },
    { x: 110, y: 300, r: 222, g: 223, b: 222 },
    { x: 337, y: 288, r: 41, g: 142, b: 255 },
    { x: 366, y: 302, r: 252, g: 253, b: 254 },
    { x: 438, y: 302, r: 255, g: 226, b: 125 },
    { x: 522, y: 311, r: 222, g: 223, b: 222 },
], { x: 518, y: 53 }, { x: 518, y: 53 });
exports.teamSupportPackagePromotion = new Rerouter_1.Page('teamSupportPackagePromotion', [
    // header bg and x
    { x: 558, y: 37, r: 90, g: 190, b: 148 },
    { x: 576, y: 42, r: 148, g: 203, b: 173 },
    { x: 590, y: 45, r: 145, g: 203, b: 171 },
    // purchase button
    { x: 576, y: 277, r: 255, g: 223, b: 0 },
    { x: 480, y: 278, r: 255, g: 210, b: 0 },
    { x: 506, y: 278, r: 120, g: 76, b: 8 },
    { x: 522, y: 274, r: 249, g: 245, b: 0 },
    { x: 538, y: 277, r: 128, g: 81, b: 7 },
], { x: 583, y: 45 }, { x: 583, y: 45 });
exports.enterGamePromotion = new Rerouter_1.Page('enterGamePromotion', [
    // x
    { x: 277, y: 280, r: 113, g: 124, b: 147 },
    // dont show this again today
    { x: 240, y: 280, r: 10, g: 7, b: 3 },
    { x: 207, y: 281, r: 36, g: 39, b: 47 },
    // bg
    { x: 279, y: 36, r: 3, g: 3, b: 3 },
    { x: 76, y: 169, r: 0, g: 2, b: 5 },
    { x: 326, y: 337, r: 3, g: 3, b: 2 },
    { x: 571, y: 211, r: 2, g: 2, b: 5 },
], { x: 485, y: 281 }, { x: 485, y: 281 });
// TODO: add this page
// export const enterGamePromotion = new Page(
//   'enterGamePromotion',
//   [
//   ],
//   { x: 583, y: 45 },
//   { x: 583, y: 45 }
// );
// a page with a close btn but taller than promotion page
exports.event = new Rerouter_1.Page('event', [
    { x: 20, y: 21, r: 253, g: 254, b: 254 },
    { x: 47, y: 32, r: 132, g: 134, b: 140 },
    { x: 48, y: 23, r: 246, g: 247, b: 247 },
    { x: 603, y: 19, r: 124, g: 130, b: 132 },
    { x: 612, y: 22, r: 49, g: 52, b: 49 },
    { x: 622, y: 26, r: 181, g: 178, b: 181 },
], { x: 611, y: 23 }, { x: 611, y: 23 });
exports.reviewApp = new Rerouter_1.Page('reviewApp', [
    { x: 106, y: 42, r: 181, g: 186, b: 189 },
    { x: 316, y: 58, r: 84, g: 90, b: 93 },
    { x: 510, y: 43, r: 168, g: 176, b: 176 },
    { x: 525, y: 57, r: 143, g: 144, b: 144 },
    { x: 305, y: 61, r: 16, g: 24, b: 24 },
    { x: 338, y: 61, r: 16, g: 24, b: 24 },
    { x: 114, y: 301, r: 222, g: 219, b: 222 },
    { x: 153, y: 297, r: 49, g: 85, b: 123 },
    { x: 178, y: 299, r: 168, g: 190, b: 224 },
    { x: 241, y: 298, r: 222, g: 219, b: 222 },
    { x: 285, y: 305, r: 49, g: 85, b: 123 },
    { x: 308, y: 302, r: 79, g: 108, b: 145 },
    { x: 365, y: 302, r: 222, g: 219, b: 222 },
    { x: 421, y: 299, r: 8, g: 114, b: 255 },
    { x: 438, y: 299, r: 47, g: 138, b: 254 },
    { x: 489, y: 301, r: 8, g: 113, b: 255 },
    { x: 528, y: 305, r: 222, g: 219, b: 222 },
], { x: 161, y: 292 }, { x: 161, y: 292 });
// page has ok button
exports.ok = new Rerouter_1.Page('ok', [
    { x: 279, y: 300, r: 0, g: 113, b: 247 },
    { x: 310, y: 301, r: 136, g: 188, b: 254 },
    { x: 326, y: 301, r: 255, g: 255, b: 255 },
    { x: 362, y: 300, r: 0, g: 113, b: 247 },
    { x: 369, y: 312, r: 8, g: 101, b: 255 },
], { x: 319, y: 303 }, { x: 319, y: 303 });
// page has next button
exports.next = new Rerouter_1.Page('next', [
    { x: 273, y: 304, r: 8, g: 117, b: 255 },
    { x: 305, y: 307, r: 255, g: 255, b: 255 },
    { x: 314, y: 314, r: 255, g: 255, b: 255 },
    { x: 321, y: 305, r: 224, g: 236, b: 255 },
    { x: 328, y: 310, r: 1, g: 106, b: 255 },
    { x: 333, y: 299, r: 8, g: 125, b: 255 },
    { x: 374, y: 305, r: 8, g: 117, b: 255 },
    { x: 380, y: 319, r: 0, g: 89, b: 247 },
    { x: 265, y: 318, r: 0, g: 89, b: 247 },
], { x: 346, y: 307 }, { x: 346, y: 307 });
exports.next2 = new Rerouter_1.Page('next', [
    { x: 226, y: 296, r: 222, g: 219, b: 222 },
    { x: 275, y: 296, r: 8, g: 121, b: 255 },
    { x: 306, y: 299, r: 254, g: 254, b: 255 },
    { x: 314, y: 303, r: 255, g: 255, b: 255 },
    { x: 321, y: 299, r: 201, g: 223, b: 255 },
    { x: 331, y: 299, r: 255, g: 255, b: 255 },
    { x: 364, y: 310, r: 0, g: 94, b: 247 },
], { x: 346, y: 307 }, { x: 346, y: 307 });
// non-specific confirm page with no and yes btn
exports.confirmWithYS = new Rerouter_1.Page('confirmWithYS', [
    // x on right top
    { x: 513, y: 46, r: 182, g: 186, b: 188 },
    { x: 520, y: 52, r: 70, g: 69, b: 70 },
    { x: 527, y: 45, r: 67, g: 68, b: 70 },
    { x: 531, y: 54, r: 174, g: 175, b: 176 },
    { x: 511, y: 51, r: 178, g: 180, b: 186 },
    // no btn
    { x: 212, y: 301, r: 49, g: 85, b: 123 },
    { x: 249, y: 300, r: 125, g: 152, b: 188 },
    { x: 278, y: 307, r: 49, g: 81, b: 123 },
    // yes btn
    { x: 363, y: 294, r: 8, g: 122, b: 255 },
    { x: 384, y: 297, r: 244, g: 248, b: 255 },
    { x: 419, y: 307, r: 0, g: 101, b: 247 },
    { x: 395, y: 294, r: 8, g: 122, b: 255 },
    // footer bg
    { x: 142, y: 304, r: 222, g: 219, b: 222 },
    { x: 530, y: 296, r: 222, g: 219, b: 222 },
], { x: 520, y: 56 }, // x btn
{ x: 520, y: 56 });
// need to update apk ver
exports.errorNewUpdateAvailable = new Rerouter_1.Page('errorNewUpdateAvailable', [
    // title
    { x: 208, y: 45, r: 181, g: 186, b: 189 },
    { x: 236, y: 58, r: 16, g: 24, b: 24 },
    { x: 260, y: 58, r: 125, g: 129, b: 133 },
    { x: 272, y: 57, r: 128, g: 136, b: 140 },
    { x: 313, y: 56, r: 181, g: 186, b: 189 },
    { x: 335, y: 56, r: 16, g: 24, b: 24 },
    { x: 363, y: 60, r: 181, g: 186, b: 189 },
    { x: 381, y: 61, r: 16, g: 24, b: 24 },
    { x: 388, y: 63, r: 126, g: 131, b: 134 },
    { x: 397, y: 63, r: 57, g: 64, b: 70 },
    { x: 407, y: 54, r: 181, g: 186, b: 189 },
    { x: 419, y: 59, r: 181, g: 186, b: 189 },
    // new update in content (104)
    { x: 227, y: 139, r: 176, g: 178, b: 184 },
    { x: 289, y: 144, r: 117, g: 121, b: 121 },
    { x: 260, y: 144, r: 108, g: 110, b: 108 },
    { x: 309, y: 144, r: 181, g: 186, b: 189 },
    { x: 326, y: 142, r: 87, g: 91, b: 90 },
    { x: 343, y: 143, r: 83, g: 88, b: 88 },
    { x: 376, y: 144, r: 69, g: 71, b: 69 },
    { x: 395, y: 144, r: 68, g: 72, b: 71 },
    { x: 409, y: 144, r: 122, g: 123, b: 125 },
    { x: 421, y: 144, r: 181, g: 186, b: 189 },
    // ok
    { x: 285, y: 297, r: 8, g: 118, b: 255 },
    { x: 312, y: 294, r: 8, g: 125, b: 255 },
    { x: 320, y: 299, r: 135, g: 188, b: 255 },
    { x: 364, y: 307, r: 0, g: 102, b: 247 },
    // popup bg and x
    { x: 117, y: 46, r: 181, g: 186, b: 189 },
    { x: 512, y: 46, r: 188, g: 186, b: 189 },
    { x: 524, y: 57, r: 189, g: 189, b: 189 },
    { x: 157, y: 232, r: 181, g: 186, b: 189 },
    { x: 209, y: 296, r: 222, g: 219, b: 222 },
    { x: 423, y: 304, r: 222, g: 219, b: 222 },
    { x: 443, y: 227, r: 181, g: 186, b: 189 },
], 
// TODO: check whether need to press ok
{ x: 314, y: 299 }, { x: 314, y: 299 });
// for some situation, unexpectedError happens
// this also includes network error
exports.unexpectedError = new Rerouter_1.Page('unexpectedError', [
    { x: 323, y: 39, r: 181, g: 186, b: 189 },
    { x: 514, y: 44, r: 80, g: 81, b: 81 },
    { x: 524, y: 48, r: 64, g: 70, b: 71 },
    { x: 518, y: 54, r: 65, g: 71, b: 71 },
    { x: 315, y: 269, r: 181, g: 186, b: 189 },
    { x: 315, y: 293, r: 8, g: 125, b: 255 },
    { x: 316, y: 299, r: 241, g: 247, b: 255 },
    { x: 317, y: 310, r: 0, g: 92, b: 245 },
    { x: 317, y: 313, r: 0, g: 85, b: 240 },
    { x: 317, y: 323, r: 222, g: 219, b: 222 },
], { x: 314, y: 299 }, { x: 314, y: 299 });
exports.appIsNotResponding = new Rerouter_1.Page('appIsNotResponding', [
    { x: 164, y: 154, r: 255, g: 255, b: 255 },
    { x: 189, y: 157, r: 203, g: 203, b: 203 },
    { x: 223, y: 158, r: 171, g: 171, b: 171 },
    { x: 254, y: 158, r: 48, g: 48, b: 48 },
    { x: 273, y: 157, r: 96, g: 96, b: 96 },
    { x: 302, y: 157, r: 54, g: 54, b: 54 },
    { x: 168, y: 185, r: 255, g: 255, b: 255 },
    { x: 205, y: 190, r: 119, g: 119, b: 119 },
    { x: 218, y: 184, r: 255, g: 255, b: 255 },
    { x: 230, y: 186, r: 85, g: 85, b: 85 },
    { x: 170, y: 211, r: 127, g: 202, b: 195 },
    { x: 210, y: 213, r: 255, g: 255, b: 255 },
    { x: 199, y: 213, r: 111, g: 111, b: 111 },
    { x: 466, y: 166, r: 255, g: 255, b: 255 },
    { x: 469, y: 218, r: 255, g: 255, b: 255 },
], { x: 220, y: 186 }, // close app
{ x: 220, y: 186 });
// with more games button
exports.quitApp = new Rerouter_1.Page('quitApp', [
    { x: 279, y: 54, r: 170, g: 173, b: 178 },
    { x: 324, y: 60, r: 20, g: 27, b: 28 },
    { x: 514, y: 50, r: 181, g: 182, b: 182 },
    { x: 466, y: 295, r: 8, g: 121, b: 255 },
    { x: 414, y: 298, r: 94, g: 157, b: 233 },
    { x: 496, y: 312, r: 0, g: 90, b: 247 },
    { x: 523, y: 309, r: 222, g: 219, b: 222 },
    { x: 111, y: 297, r: 222, g: 219, b: 222 },
    { x: 307, y: 60, r: 133, g: 137, b: 141 },
    { x: 315, y: 61, r: 181, g: 186, b: 189 },
    { x: 324, y: 61, r: 52, g: 56, b: 61 },
], { x: 300, y: 303 }, // not to quit
{ x: 300, y: 303 });
exports.quitApp1 = new Rerouter_1.Page('quitApp1', [
    { x: 262, y: 56, r: 181, g: 186, b: 189 },
    { x: 300, y: 54, r: 16, g: 24, b: 24 },
    { x: 323, y: 55, r: 24, g: 30, b: 32 },
    { x: 511, y: 50, r: 178, g: 180, b: 186 },
    { x: 522, y: 54, r: 141, g: 139, b: 141 },
    { x: 522, y: 54, r: 141, g: 139, b: 141 },
    { x: 167, y: 299, r: 222, g: 219, b: 222 },
    { x: 243, y: 295, r: 49, g: 85, b: 123 },
    { x: 318, y: 298, r: 222, g: 219, b: 222 },
    { x: 382, y: 297, r: 83, g: 158, b: 255 },
    { x: 503, y: 301, r: 222, g: 219, b: 222 },
    { x: 433, y: 310, r: 0, g: 94, b: 247 },
    { x: 404, y: 301, r: 8, g: 113, b: 255 },
    { x: 213, y: 307, r: 49, g: 81, b: 123 },
], { x: 213, y: 307 }, // not to quit
{ x: 213, y: 307 });


/***/ }),

/***/ "./src/tasks/index.ts":
/*!****************************!*\
  !*** ./src/tasks/index.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.weeklyMission = exports.TASK = void 0;
var TASK;
(function (TASK) {
    TASK["restartAppPerDay"] = "restartAppPerDay";
    TASK["settingDefault"] = "settingDefault";
    TASK["settingResetLeagueProgress"] = "settingResetLeagueProgress";
    TASK["playLeagueGame"] = "playLeagueGame";
    TASK["playBattleGame"] = "playBattleGame";
    TASK["adReward"] = "adReward";
    TASK["weeklyMission"] = "weeklyMission";
    TASK["recieveInbox"] = "recieveInbox";
    TASK["stayInLogin"] = "stayInLogin";
    TASK["uploadCache"] = "uploadCache";
    TASK["sendAliveEvent"] = "sendAliveEvent";
    TASK["sendWaitEvent"] = "sendWaitEvent";
})(TASK = exports.TASK || (exports.TASK = {}));
exports.weeklyMission = __importStar(__webpack_require__(/*! ./weeklyMission */ "./src/tasks/weeklyMission.ts"));


/***/ }),

/***/ "./src/tasks/weeklyMission.ts":
/*!************************************!*\
  !*** ./src/tasks/weeklyMission.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addRoutes = exports.addTask = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
var modules_1 = __webpack_require__(/*! ../modules */ "./src/modules/index.ts");
var index_1 = __webpack_require__(/*! ./index */ "./src/tasks/index.ts");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
function addTask() {
    modules_1.rerouter.addTask({
        name: index_1.TASK.weeklyMission,
        // maxTaskRunTimes: 1,
        minRoundInterval: CONSTANTS.dayInMs,
        maxTaskDuring: 30 * CONSTANTS.minuteInMs,
        forceStop: true,
    });
}
exports.addTask = addTask;
function addRoutes() {
    modules_1.rerouter.addRoute({
        path: "/".concat(achievementMission.name),
        match: achievementMission,
        action: function (context, image) {
            modules_1.state.checkUploadSession();
            if (context.task.name !== index_1.TASK.weeklyMission) {
                modules_1.rerouter.goBack(achievementMission);
                return;
            }
            // collect daily one if available
            var x = 613;
            var canCollectColor = { r: 8, g: 125, b: 255 };
            for (var y = 128; y < 260; y += 44) {
                var canCollect = (0, utils_1.isSameColor)(image, __assign({ x: x, y: y }, canCollectColor));
                if (canCollect) {
                    modules_1.rerouter.screen.tap({ x: x, y: y });
                    console.log('collect');
                    Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
                }
            }
            modules_1.rerouter.goNext(achievementMission);
        },
    });
    modules_1.rerouter.addRoute({
        path: "/".concat(weeklyMissionBox.name),
        match: weeklyMissionBox,
        action: function (context, image, matched, finishRound) {
            modules_1.state.checkUploadSession();
            if (context.task.name !== index_1.TASK.weeklyMission) {
                modules_1.rerouter.goBack(weeklyMissionBox);
                return;
            }
            var canCollectColor = { r: 189, g: 194, b: 197 };
            var _a = [27, 115], x = _a[0], y = _a[1];
            var _b = [198, 75], w = _b[0], h = _b[1];
            // click openBox only when all mission is complete
            // bc it is abled once a week
            for (var dx = 0; dx < 3 * w; dx += w) {
                for (var dy = 0; dy < 3 * h; dy += h) {
                    var canCollect = (0, utils_1.isSameColor)(image, __assign({ x: x + dx, y: y + dy }, canCollectColor));
                    if (!canCollect) {
                        console.log('wait all weekly mission complete');
                        finishRound(true);
                        modules_1.state.onRunning();
                        return;
                    }
                }
            }
            console.log('click open');
            modules_1.rerouter.screen.tap(weeklyMissionBoxBtns.openBox);
            Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
            // TODO: let user select the item they want in the future
            // select the left bottom one
            console.log('select right bottom item');
            modules_1.rerouter.screen.tap({ x: x + 2 * w, y: y + 2 * h });
            Rerouter_1.Utils.sleep(CONSTANTS.sleepMedium);
            console.log('receive right bottom item');
            modules_1.rerouter.screen.tap(weeklyMissionBoxBtns.receiveReward);
            // enter receive confirm page
            finishRound(true);
            modules_1.state.onRunning();
        },
    });
    [weeklyMissionBoxConfirm, weeklyMissionBoxReceived].forEach(function (p) {
        modules_1.rerouter.addRoute({
            path: "/".concat(p.name),
            match: p,
            action: 'goNext',
        });
    });
}
exports.addRoutes = addRoutes;
var achievementMission = new Rerouter_1.Page('achievementMission', [
    // today mission bg
    { x: 235, y: 55, r: 247, g: 247, b: 247 },
    { x: 231, y: 71, r: 247, g: 247, b: 247 },
    { x: 588, y: 72, r: 247, g: 247, b: 247 },
    // left section world record bg left bottom
    { x: 16, y: 293, r: 25, g: 40, b: 74 },
    // player head
    { x: 75, y: 88, r: 66, g: 59, b: 90 },
    // back
    { x: 31, y: 316, r: 214, g: 219, b: 214 },
], { x: 580, y: 278 }, // complete weekly mission box
{ x: 41, y: 320 });
var weeklyMissionBox = new Rerouter_1.Page('weeklyMissionBox', [
    // nav bar right part (p, star ...)
    { x: 299, y: 13, r: 214, g: 214, b: 214 },
    { x: 318, y: 9, r: 238, g: 234, b: 238 },
    { x: 313, y: 9, r: 238, g: 234, b: 238 },
    { x: 392, y: 9, r: 232, g: 229, b: 232 },
    { x: 385, y: 2, r: 214, g: 214, b: 214 },
    { x: 496, y: 13, r: 238, g: 166, b: 16 },
    { x: 483, y: 4, r: 214, g: 219, b: 216 },
    { x: 597, y: 10, r: 213, g: 226, b: 238 },
    { x: 628, y: 14, r: 214, g: 211, b: 214 },
    // bg of table
    { x: 14, y: 82, r: 33, g: 32, b: 41 },
    { x: 16, y: 288, r: 33, g: 44, b: 58 },
    { x: 615, y: 100, r: 33, g: 36, b: 41 },
    { x: 613, y: 283, r: 33, g: 44, b: 58 },
    // description footer
    { x: 80, y: 307, r: 202, g: 201, b: 196 },
    { x: 89, y: 315, r: 49, g: 61, b: 34 },
    { x: 103, y: 319, r: 73, g: 83, b: 66 },
    { x: 172, y: 335, r: 78, g: 84, b: 72 },
    { x: 250, y: 338, r: 101, g: 106, b: 93 },
    { x: 273, y: 307, r: 159, g: 159, b: 149 },
    { x: 284, y: 309, r: 56, g: 61, b: 40 },
    // back btn
    { x: 24, y: 314, r: 214, g: 214, b: 214 },
    { x: 42, y: 317, r: 214, g: 219, b: 214 },
    { x: 31, y: 331, r: 214, g: 219, b: 214 },
], { x: 41, y: 320 }, // back btn
{ x: 41, y: 320 });
var weeklyMissionBoxBtns = {
    openBox: { x: 418, y: 325 },
    receiveReward: { x: 561, y: 326 },
};
var weeklyMissionBoxConfirm = new Rerouter_1.Page('weeklyMissionBoxConfirm', [
    // bg
    { x: 111, y: 42, r: 181, g: 186, b: 189 },
    { x: 117, y: 304, r: 214, g: 219, b: 222 },
    { x: 515, y: 300, r: 214, g: 219, b: 222 },
    { x: 519, y: 177, r: 181, g: 186, b: 189 },
    // title
    { x: 240, y: 58, r: 155, g: 160, b: 163 },
    { x: 267, y: 58, r: 141, g: 147, b: 149 },
    { x: 325, y: 59, r: 161, g: 167, b: 170 },
    { x: 383, y: 59, r: 171, g: 179, b: 179 },
    { x: 407, y: 59, r: 181, g: 186, b: 189 },
    // x
    { x: 515, y: 49, r: 187, g: 185, b: 188 },
    { x: 519, y: 55, r: 91, g: 91, b: 92 },
    // no & yes btn
    { x: 210, y: 293, r: 41, g: 81, b: 123 },
    { x: 238, y: 296, r: 45, g: 81, b: 128 },
    { x: 284, y: 294, r: 41, g: 78, b: 123 },
    { x: 397, y: 299, r: 40, g: 134, b: 253 },
    { x: 433, y: 307, r: 8, g: 98, b: 247 },
], { x: 387, y: 300 }, // yes btn
{ x: 387, y: 300 });
var weeklyMissionBoxReceived = new Rerouter_1.Page('weeklyMissionBoxReceived', [
    // bg
    { x: 113, y: 53, r: 181, g: 186, b: 189 },
    { x: 117, y: 307, r: 214, g: 219, b: 222 },
    { x: 496, y: 299, r: 214, g: 219, b: 222 },
    // title
    { x: 217, y: 55, r: 181, g: 186, b: 189 },
    { x: 259, y: 55, r: 177, g: 181, b: 185 },
    { x: 298, y: 59, r: 181, g: 186, b: 189 },
    { x: 341, y: 60, r: 120, g: 124, b: 128 },
    { x: 386, y: 58, r: 16, g: 24, b: 33 },
    { x: 407, y: 58, r: 181, g: 186, b: 189 },
    // x
    { x: 512, y: 47, r: 181, g: 186, b: 182 },
    { x: 519, y: 53, r: 71, g: 70, b: 71 },
    // ok btn
    { x: 288, y: 297, r: 8, g: 122, b: 255 },
    { x: 320, y: 300, r: 136, g: 190, b: 255 },
    { x: 364, y: 301, r: 8, g: 114, b: 248 },
], { x: 320, y: 300 }, // ok btn
{ x: 320, y: 300 });


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSameColorCount = exports.getColorCountInRange = exports.isSameColor = exports.arrayFind = exports.endsWith = exports.executeCommands = exports.SavePageReference = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
function SavePageReference(img, page) {
    var name = page.name, points = page.points;
    var radius = 3;
    var rgba = [255, 20, 147, 0];
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var _a = points_1[_i], x = _a.x, y = _a.y;
        drawCircle.apply(void 0, __spreadArray([img, x, y, radius], rgba, false));
    }
    saveImage(img, "/sdcard/Pictures/Screenshots/robotmon/mlb/".concat(name, ".png"));
    console.log("[SavePageReference]: ".concat(name));
}
exports.SavePageReference = SavePageReference;
function executeCommands() {
    var commands = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        commands[_i] = arguments[_i];
    }
    var results = [];
    for (var _a = 0, commands_1 = commands; _a < commands_1.length; _a++) {
        var command = commands_1[_a];
        var res = execute(command);
        if (endsWith(res, 'exit status 1')) {
            console.log("[Error]: ".concat(command, " :\n ").concat(res, "\n"));
        }
        else {
            // console.log(`[Ok]: ${command} :\n ${res}\n`);
            console.log("[Ok]: ".concat(command));
        }
        results.push(res);
    }
    return results;
}
exports.executeCommands = executeCommands;
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
exports.endsWith = endsWith;
function arrayFind(arr, condition) {
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var el = arr_1[_i];
        if (condition(el)) {
            return el;
        }
    }
    return undefined;
}
exports.arrayFind = arrayFind;
function isSameColor(image, target, thres) {
    if (thres === void 0) { thres = 0.8; }
    var imageRGB;
    if ('r' in image) {
        // image is RGB
        imageRGB = image;
    }
    else if ('x' in target) {
        // image is Image, target is XYRGB
        imageRGB = getImageColor(image, target.x, target.y);
    }
    if (imageRGB === undefined) {
        throw new Error('target is not XYRGB');
    }
    var score = Rerouter_1.Utils.identityColor(imageRGB, target);
    return score > thres;
}
exports.isSameColor = isSameColor;
function getColorCountInRange(image, leftTop, rightBottom) {
    var cnt = {};
    var x1 = leftTop.x, y1 = leftTop.y;
    var x2 = rightBottom.x, y2 = rightBottom.y;
    for (var x = x1; x <= x2; x++) {
        for (var y = y1; y <= y2; y++) {
            var _a = getImageColor(image, x, y), r = _a.r, g = _a.g, b = _a.b;
            var color = "".concat(r, "-").concat(g, "-").concat(b);
            if (cnt[color] === undefined) {
                cnt[color] = 0;
            }
            cnt[color]++;
        }
    }
    return cnt;
}
exports.getColorCountInRange = getColorCountInRange;
function isSameColorCount(cnt1, cnt2) {
    var keys1 = Object.keys(cnt1);
    var keys2 = Object.keys(cnt2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        if (cnt1[key] !== cnt2[key]) {
            return false;
        }
    }
    return true;
}
exports.isSameColorCount = isSameColorCount;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
var exports = __webpack_exports__;
/*!******************!*\
  !*** ./index.ts ***!
  \******************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stop = exports.start = void 0;
var src_1 = __webpack_require__(/*! ./src */ "./src/index.ts");
var mlb9i;
function start(jsonConfig) {
    mlb9i = new src_1.MLB9I(jsonConfig);
    mlb9i.start();
}
exports.start = start;
function stop() {
    if (mlb9i === undefined) {
        return;
    }
    mlb9i.stop();
    mlb9i = undefined;
}
exports.stop = stop;
window.start = start;
window.stop = stop;

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4REFBOEQ7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLDhIQUE4SDtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLCtCQUErQjtJQUMvQiwwQ0FBMEM7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLFdBQUcsR0FBRyxJQUFJLGVBQUksQ0FDekIsS0FBSyxFQUNMO0lBQ0UsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVB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QUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsb0NBQW9DO0FBQ3ZCLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLGlCQUFpQjtJQUNqQixXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsa0JBQWtCO0FBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxzQkFBYyxHQUFHLElBQUksZUFBSSxDQUNwQyxnQkFBZ0IsRUFDaEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFcEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFNBQVM7SUFDVCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGFBQWE7QUFDakMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhO0NBQ2pDLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUMvQixXQUFXLEVBQ1g7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUTtBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGVBQWU7Q0FDbEMsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLG1CQUFXLEdBQUcsSUFBSSxlQUFJLENBQ2pDLGFBQWEsRUFDYjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUTtBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGVBQWU7Q0FDbEMsQ0FBQztBQUVXLGlCQUFTLEdBQUcsSUFBSSxlQUFJLENBQUMsV0FBVyxFQUFFO0lBQzdDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLENBQUMsQ0FBQztBQUVVLHFCQUFhLEdBQUcsSUFBSSxlQUFJLENBQUMsZUFBZSxFQUFFO0lBQ3JELGNBQWM7SUFDZCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLENBQUMsQ0FBQztBQUVVLG9CQUFZLEdBQUcsSUFBSSxlQUFJLENBQ2xDLGNBQWMsRUFDZDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUNXLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLFlBQUksR0FBRyxJQUFJLGVBQUksQ0FDMUIsTUFBTSxFQUNOO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLDBCQUEwQjtJQUMxQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FB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RSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFckMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBQ1csNEJBQW9CLEdBQUc7SUFDbEMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLGdDQUFnQztDQUNqQyxDQUFDO0FBQ1csaUNBQXlCLEdBQUcsSUFBSSxlQUFJLENBQy9DLDBCQUEwQixFQUMxQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUVwQyxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjO0FBQ2xDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYztDQUNsQyxDQUFDO0FBQ1csNENBQW9DLEdBQUc7SUFDbEQsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hCLENBQUM7QUFFVyx3QkFBZ0IsR0FBRyxJQUFJLGVBQUksQ0FDdEMsZ0JBQWdCLEVBQ2hCO0lBQ0UsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV0QyxhQUFhO0lBQ2IsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLDRCQUFvQixHQUFHO0lBQ2xDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQy9CLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNqQyxnQ0FBZ0M7Q0FDakMsQ0FBQztBQUVGLDZCQUE2QjtBQUNoQixpQkFBUyxHQUFHLElBQUksZUFBSSxDQUMvQixXQUFXLEVBQ1g7SUFDRSxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLHVCQUF1QjtJQUN2QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRix1REFBdUQ7QUFDMUMsaUJBQVMsR0FBRyxJQUFJLGVBQUksQ0FDL0IsV0FBVyxFQUNYO0lBQ0UsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLHVCQUF1QjtJQUN2QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV4QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYscUNBQXFDO0FBQ3hCLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxrQkFBa0IsRUFDbEI7SUFDRSxtREFBbUQ7SUFDbkQsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxnQ0FBd0IsR0FBRyxJQUFJLGVBQUksQ0FDOUMsMEJBQTBCLEVBQzFCO0lBQ0UsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxvQ0FBNEIsR0FBRyxJQUFJLGVBQUksQ0FDbEQsOEJBQThCLEVBQzlCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV4QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHdDQUFnQyxHQUFHO0lBQzlDLE1BQU0sRUFBRTtRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDUDtJQUNELE1BQU0sRUFBRTtRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7S0FDUDtDQUNGLENBQUM7QUFFVywyQ0FBbUMsR0FBRyxJQUFJLGVBQUksQ0FDekQscUNBQXFDLEVBQ3JDO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixtQ0FBbUM7QUFDdEIsMkJBQW1CLEdBQUcsSUFBSSxlQUFJLENBQ3pDLHFCQUFxQixFQUNyQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxhQUFhO0FBQ2pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYTtDQUNqQyxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELDJEQUEyRDtBQUM5Qyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsMEJBQTBCO0lBQzFCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxtQkFBbUI7QUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTO0NBQzdCLENBQUM7QUFFVyw2QkFBcUIsR0FBRztJQUNuQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNCLENBQUM7QUFFVyx3QkFBZ0IsR0FBRyxJQUFJLGVBQUksQ0FDdEMsa0JBQWtCLEVBQ2xCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsOEJBQXNCLEdBQUcsSUFBSSxlQUFJLENBQzVDLHdCQUF3QixFQUN4QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV0QyxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBQ1csa0NBQTBCLEdBQUc7SUFDeEMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QixPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pCLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxvQkFBb0I7SUFDcEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsc0JBQWMsR0FBRztJQUM1QixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzVCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQixDQUFDO0FBRUYsZ0JBQWdCO0FBQ0gsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGdDQUFnQztJQUNoQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxnREFBZ0Q7SUFDaEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPO0FBQzFCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFDVywyQkFBbUIsR0FBRztJQUNqQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDaEMs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R0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUs7QUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSztBQUN6QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsNEJBQW9CLEdBQUcsSUFBSSxlQUFJLENBQzFDLHNCQUFzQixFQUN0QjtJQUNFLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBRXhDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QywyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRUYsNEJBQTRCO0FBQ2YsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLGtEQUFrRDtJQUNsRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsdUJBQXVCO0FBQzNDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsMEJBQTBCO0NBQzlDLENBQUM7QUFFRiwwQkFBMEI7QUFDYiwwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLDZCQUE2QjtDQUM5QixFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUseUJBQXlCO0FBQzdDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMscUJBQXFCO0NBQ3pDLENBQUM7QUFFVyw0QkFBb0IsR0FBRyxJQUFJLGVBQUksQ0FDMUMsc0JBQXNCLEVBQ3RCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN2QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUztBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsOEJBQXNCLEdBQUcsSUFBSSxlQUFJLENBQzVDLHdCQUF3QixFQUN4QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVM7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLGdCQUFnQjtBQUNILHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXO0FBQy9CLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFB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QUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFB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LEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxF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QUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNsQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENB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QyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFRiwwQ0FBMEM7QUFDN0Isd0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQ3RDLGtCQUFrQixFQUNsQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSw4Q0FBOEM7QUFDbEUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHdCQUFnQixHQUFHLElBQUksb0JBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLG9CQUFZLENBQUMsRUFBRSxtQkFBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUV2SCwyQkFBMkI7QUFDZCx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0Usa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGdCQUFnQjtBQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVE7Q0FDNUIsQ0FBQztBQUVGLG1EQUFtRDtBQUN0QyxpQ0FBeUIsR0FBRyxJQUFJLGVBQUksQ0FDL0MsMkJBQTJCLEVBQzNCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXO0NBQ3RELEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHlCQUFpQixHQUFHLElBQUksZUFBSSxDQUN2QyxtQkFBbUIsRUFDbkI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVM7Q0FDcEQsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLCtCQUF1QixHQUFHLElBQUksZUFBSSxDQUM3Qyx5QkFBeUIsRUFDekI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsOEJBQXNCLEdBQUcsSUFBSSxlQUFJLENBQzVDLHdCQUF3QixFQUN4QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsNEJBQTRCO0lBQzVCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVywrQkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDN0Msd0JBQXdCLEVBQ3hCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLDRCQUE0QjtJQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLG1DQUEyQixHQUFHLElBQUksb0JBQVMsQ0FDdEQsd0JBQXdCLEVBQ3hCLENBQUMsOEJBQXNCLEVBQUUsK0JBQXVCLENBQUMsRUFDakQsOEJBQXNCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDdkMsQ0FBQztBQUVGLHVDQUF1QztBQUMxQixnQ0FBd0IsR0FBRyxJQUFJLGVBQUksQ0FDOUMsMEJBQTBCLEVBQzFCO0lBQ0UsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXJDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsNEJBQW9CLEdBQUcsSUFBSSxlQUFJLENBQzFDLHNCQUFzQixFQUN0QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLGNBQWM7SUFDZCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxpQ0FBaUM7SUFDakMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFF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RTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHlCQUFpQixHQUFHLElBQUksZUFBSSxDQUN2QyxtQkFBbUIsRUFDbkI7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxXQUFHLEdBQUcsSUFBSSxlQUFJLENBQ3pCLEtBQUssRUFDTDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3RDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFckMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVB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RSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsc0JBQWMsR0FBRyxJQUFJLGVBQUksQ0FDcEMsZ0JBQWdCLEVBQ2hCO0lBQ0Usa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMs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QUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGNBQWM7SUFDZCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxxQkFBcUI7SUFDckIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXO0FBQzlCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFVyw0QkFBb0IsR0FBRztJQUNsQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ2xDLENBQUM7QUFFVywrQkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDN0MseUJBQXlCLEVBQ3pCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVO0FBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxnQ0FBd0IsR0FBRyxJQUFJLGVBQUksQ0FDOUMsMEJBQTBCLEVBQzFCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsU0FBUztJQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTO0FBQzdCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixnQkFBZ0I7QUFDSCxtQkFBVyxHQUFHLElBQUksZUFBSSxDQUNqQyxhQUFhLEVBQ2I7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQywyQ0FBMkM7SUFDM0MsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFcEMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0NBQ3JDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsbUNBQTJCLEdBQUcsSUFBSSxlQUFJLENBQ2pELDZCQUE2QixFQUM3QjtJQUNFLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUs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QUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsaUJBQVMsR0FBRyxJQUFJLGVBQUksQ0FDL0IsV0FBVyxFQUNYO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYscUJBQXFCO0FBQ1IsVUFBRSxHQUFHLElBQUksZUFBSSxDQUN4QixJQUFJLEVBQ0o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRix1QkFBdUI7QUFDVixZQUFJLEdBQUcsSUFBSSxlQUFJLENBQzFCLE1BQU0sRUFDTjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGFBQUssR0FBRyxJQUFJLGVBQUksQ0FDM0IsTUFBTSxFQUNOO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsZ0RBQWdEO0FBQ25DLHFCQUFhLEdBQUcsSUFBSSxlQUFJLENBQ25DLGVBQWUsRUFDZjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUTtBQUMzQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRUYseUJBQXlCO0FBQ1osK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHlCQUF5QixFQUN6QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6Qyw4QkFBOEI7SUFDOUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQztBQUNELHVDQUF1QztBQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsOENBQThDO0FBQzlDLG1DQUFtQztBQUN0Qix1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVk7QUFDaEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLHlCQUF5QjtBQUNaLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWM7QUFDbEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGdCQUFRLEdBQUcsSUFBSSxlQUFJLENBQzlCLFVBQVUsRUFDVjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxF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RUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztBQUM5QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRUYsSUFBTSxvQkFBb0IsR0FBRztJQUMzQixPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ2xDLENBQUM7QUFFRixJQUFNLHVCQUF1QixHQUFHLElBQUksZUFBSSxDQUN0Qyx5QkFBeUIsRUFDekI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVU7QUFDOUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLDBCQUEwQixFQUMxQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFNBQVM7SUFDVCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUztBQUM3QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNu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QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDakMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELEtBQWtCLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLLEVBQUU7UUFBcEIsSUFBTSxHQUFHO1FBQ1osSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVpELDRDQVlDOzs7Ozs7O1VDeEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdEJBLCtEQUE4QjtBQUU5QixJQUFJLEtBQXdCLENBQUM7QUFDN0IsU0FBZ0IsS0FBSyxDQUFDLFVBQWU7SUFDbkMsS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlCLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQixDQUFDO0FBSEQsc0JBR0M7QUFDRCxTQUFnQixJQUFJO0lBQ2xCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPO0tBQ1I7SUFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3BCLENBQUM7QUFORCxvQkFNQztBQUtBLE1BQWMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzdCLE1BQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvcmVyb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy9zdHJ1Y3QuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2NoYXJlbmMvY2hhcmVuYy5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvbWQ1L21kNS5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL2V2ZW50U2VuZGVyLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvcmVyb3V0ZXIudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3Nlc3Npb24udHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3N0YXRlLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvcGFnZXMudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy90YXNrcy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3Rhc2tzL3dlZWtseU1pc3Npb24udHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Rlc3QvLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy52ZXJzaW9uID0gdm9pZCAwO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9zY3JlZW5cIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9yZXJvdXRlclwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3N0cnVjdFwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3V0aWxzXCIpLCBleHBvcnRzKTtcbmV4cG9ydHMudmVyc2lvbiA9IDE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlcm91dGVyID0gZXhwb3J0cy5SZXJvdXRlciA9IHZvaWQgMDtcbnZhciBzdHJ1Y3RfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdFwiKTtcbnZhciBzY3JlZW5fMSA9IHJlcXVpcmUoXCIuL3NjcmVlblwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgUmVyb3V0ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVyb3V0ZXIoKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0Q29uZmlnVmFsdWU7XG4gICAgICAgIHRoaXMucmVyb3V0ZXJDb25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0UmVyb3V0ZXJDb25maWc7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnID0gc3RydWN0XzEuRGVmYXVsdFNjcmVlbkNvbmZpZztcbiAgICAgICAgdGhpcy5zY3JlZW4gPSBuZXcgc2NyZWVuXzEuU2NyZWVuKHRoaXMuc2NyZWVuQ29uZmlnKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucm91dGVzID0gW107XG4gICAgICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLnVua25vd25Sb3V0ZUFjdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlY2FsY3VsYXRlIHNvbWUgdmFsdWUgbGlrZSBkZXZpY2Ugd2lkdGggb3IgaGVpZ2h0IGluIHNjcmVlbkNvbmZpZ1xuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBzb3J0IHJvdXRlcyBieSBwcmlvcml0eVxuICAgICAgICB0aGlzLnJvdXRlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTsgfSk7XG4gICAgICAgIC8vIGNoZWNrIGFuZCBjYWxjdWxhdGUgc2NyZWVuIGNvbmZpZ1xuICAgICAgICB2YXIgZGV2aWNlV0ggPSBnZXRTY3JlZW5TaXplKCk7XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heChkZXZpY2VXSC53aWR0aCwgZGV2aWNlV0guaGVpZ2h0KTtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluKGRldmljZVdILndpZHRoLCBkZXZpY2VXSC5oZWlnaHQpO1xuICAgICAgICB2YXIgZFdpZHRoID0gdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24gPT09ICdob3Jpem9udGFsJyA/IG1heCA6IG1pbjtcbiAgICAgICAgdmFyIGRIZWlnaHQgPSB0aGlzLnNjcmVlbkNvbmZpZy5yb3RhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IG1heCA6IG1pbjtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlV2lkdGggPSB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VXaWR0aCB8fCBkV2lkdGg7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZUhlaWdodCA9IHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZUhlaWdodCB8fCBkSGVpZ2h0O1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCA9IHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbldpZHRoIHx8IGRXaWR0aDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0ID0gdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0IHx8IGRIZWlnaHQ7XG4gICAgICAgIHRoaXMubG9nKFwic2NyZWVuV2lkdGg6IFwiLmNvbmNhdCh0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCwgXCIsIHNjcmVlbkhlaWdodDogXCIpLmNvbmNhdCh0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5IZWlnaHQpKTtcbiAgICAgICAgLy8gbmV3IHNjcmVlbiBpZiBzY3JlZW4gY29uZmlnIGNoYW5nZWRcbiAgICAgICAgdGhpcy5zY3JlZW4gPSBuZXcgc2NyZWVuXzEuU2NyZWVuKHRoaXMuc2NyZWVuQ29uZmlnKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBSb3V0ZUNvbmZpZyB0byBSZXJvdXRlciByb3V0ZXMsIGFmdGVyIHN0YXJ0aW5nIFJlcm91dGVyIHdpbGwgcnVuIG92ZXIgYWxsIFJvdXRlQ29uZmlncyB0byBtYXRjaCBzY3JlZW4gYW5kIGRvIGFjdGlvblxuICAgICAqIEBwYXJhbSBjb25maWcgaW5mb3JtYXRpb24gYWJvdXQgaG93IHJvdXRlIG1hdGNoIGFuZCByb3V0ZSBhY3Rpb25cbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMucm91dGVzLnB1c2godGhpcy53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdChjb25maWcpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRlbGwgUmVyb3V0ZXIgd2hhdCB0byBkbyBpZiBub3QgbWF0Y2hpbmcgYW55IHJvdXRlXG4gICAgICogQHBhcmFtIGFjdGlvbiBmdW5jdGlvbiB0byBkbyBpZiBub3QgbWF0Y2hpbmdcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuYWRkVW5rbm93bkFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy51bmtub3duUm91dGVBY3Rpb24gPSBhY3Rpb247XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgVGFza0NvbmZpZyB0byBSZXJvdXRlciB0YXNrcywgYWZ0ZXIgc3RhcnRpbmcgUmVyb3V0ZXIgd2lsbCBydW4gb3ZlciBhbGwgVGFza3MgYnkgdGFzayBjb25kaXRpb25cbiAgICAgKiBAcGFyYW0gY29uZmlnIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0YXNrIHdvcmtzXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFRhc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMudGFza3MucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy53cmFwVGFza0NvbmZpZ1dpdGhEZWZhdWx0KGNvbmZpZyksXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBsYXN0UnVuVGltZTogMCxcbiAgICAgICAgICAgIHJ1blRpbWVzOiAwLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0YXJ0IFJlcm91dGVyIHRvIHJ1biBvdmVyIHRhc2tzIGFuZCByb3V0ZXNcbiAgICAgKiBAcGFyYW0gcGFja2FnZU5hbWVcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSA9IHBhY2thZ2VOYW1lO1xuICAgICAgICAvLyBjaGVjayB0YXNrc1xuICAgICAgICBpZiAodGhpcy50YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgZmFpbGVkLCBubyB0YXNrcyAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnRlZCAuLi5cIik7XG4gICAgICAgIC8vIHRhc2sgY29udHJvbGxlclxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0VGFza0xvb3AoKTtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wcGVkIC4uLlwiKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0b3AgUmVyb3V0ZXJcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wIGNhbGxlZCwgdHJ5aW5nIHRvIHN0b3AgdGFzayBsb29wXCIpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMucm91dGVDb250ZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlQ29udGV4dC5zY3JpcHRSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5jaGVja0luQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSB1dGlsc18xLlV0aWxzLmdldEN1cnJlbnRBcHAoKVswXTtcbiAgICAgICAgaWYgKHBhY2thZ2VOYW1lID09PSB0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy5pc0FwcE9uVG9wKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmNoZWNrQW5kU3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja0luQXBwKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQXBwSXNOb3RTdGFydGVkLCBzdGFydEFwcCBcIi5jb25jYXQodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEFwcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgYXBwIGZhaWxlZCwgbm8gcGFja2FnZU5hbWUgLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc3RhcnRBcHAodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSk7XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy5zdGFydEFwcERlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdG9wQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RvcCBhcHAgZmFpbGVkLCBubyBwYWNrYWdlTmFtZSAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zdG9wQXBwKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKDEwMDApO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnJlc3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcEFwcCgpO1xuICAgICAgICB0aGlzLnN0YXJ0QXBwKCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ29OZXh0ID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgaWYgKHBhZ2UubmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAocGFnZS5uZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChwYWdlLm5hbWUsIFwiIGFjdGlvbiA9PSBnb05leHQsIGJ1dCBubyBuZXh0IHh5XCIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdvQmFjayA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmIChwYWdlLmJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKHBhZ2UuYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocGFnZS5uYW1lLCBcIiBhY3Rpb24gPT0gZ29CYWNrLCBidXQgbm8gYmFjayB4eVwiKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaCA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIGlzTWF0Y2ggPSB0aGlzLmlzUGFnZU1hdGNoSW1hZ2UocGFnZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaEltYWdlID0gZnVuY3Rpb24gKHBhZ2UsIGltYWdlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRQYWdlQnlOYW1lKHBhZ2UpO1xuICAgICAgICAgICAgaWYgKHAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJpc1BhZ2VNYXRjaEltYWdlIFwiLmNvbmNhdChwYWdlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhZ2UgPSBwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWdlIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMuaXNNYXRjaEdyb3VwUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRoaXMuZGVmYXVsdENvbmZpZy5Hcm91cFBhZ2VUaHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICByZXR1cm4gcGFnZXMubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2ggPSBmdW5jdGlvbiAoZ3JvdXBQYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5nZXRQYWdlc01hdGNoSW1hZ2UoZ3JvdXBQYWdlLCBpbWFnZSwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChncm91cFBhZ2UsIGltYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgIHZhciB0aHJlcyA9IChfYiA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICBpZiAoaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdQYWdlID0gZnVuY3Rpb24gKHBhZ2UsIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuVXRpbHMud2FpdEZvckFjdGlvbihmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5pc1BhZ2VNYXRjaChwYWdlKTsgfSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUm91dGVNYXRjaCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBpc01hdGNoID0gdGhpcy5pc1JvdXRlTWF0Y2hJbWFnZShyb3V0ZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1JvdXRlTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChyb3V0ZSwgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHJvdXRlQ29uZmlnID0gdGhpcy5nZXRSb3V0ZUNvbmZpZyhyb3V0ZSk7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiaXNSb3V0ZU1hdGNoSW1hZ2UgXCIuY29uY2F0KHJvdXRlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmaWxsZWRSb3V0ZUNvbmZpZyA9IHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQocm91dGVDb25maWcpO1xuICAgICAgICB2YXIgcm90YXRpb24gPSB0aGlzLnNjcmVlbi5nZXRJbWFnZVJvdGF0aW9uKGltYWdlKTtcbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIGZpbGxlZFJvdXRlQ29uZmlnLCAnd2FpdFNjcmVlbkZvck1hdGNoaW5nUm91dGUnKS5pc01hdGNoZWQ7XG4gICAgICAgIGlmIChpc01hdGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdSb3V0ZSA9IGZ1bmN0aW9uIChyb3V0ZSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1hdGNoVGltZXMgPT09IHZvaWQgMCkgeyBtYXRjaFRpbWVzID0gMTsgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IHZvaWQgMCkgeyBpbnRlcnZhbCA9IDYwMDsgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy53YWl0Rm9yQWN0aW9uKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlzUm91dGVNYXRjaChyb3V0ZSk7IH0sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRQYWdlQnlOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2IubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYltfaV07XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gKChfYSA9IHJvdXRlLm1hdGNoKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGUubWF0Y2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0Um91dGVDb25maWdCeVBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAocGF0aCA9PT0gcm91dGUucGF0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRDdXJyZW50TWF0Y2hOYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgbWF0Y2hlZE5hbWVzID0gW107XG4gICAgICAgIHRoaXMucm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSByb3V0ZS5tYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5QYWdlICYmIF90aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgbWF0Y2gsIF90aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCBfdGhpcy5kZWJ1ZykpIHx8XG4gICAgICAgICAgICAgICAgKG1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuR3JvdXBQYWdlICYmIF90aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCBtYXRjaCwgX3RoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIF90aGlzLmRlYnVnKS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoZWROYW1lcy5wdXNoKG1hdGNoLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2coXCJjdXJyZW50IG1hdGNoOiBcIiwgbWF0Y2hlZE5hbWVzKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWROYW1lcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRSb3V0ZUNvbmZpZyA9IGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHZhciByb3V0ZTtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcm91dGUgPSB0aGlzLmdldFJvdXRlQ29uZmlnQnlQYXRoKHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcm91dGUgPSByO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBjb25maWcucGF0aCxcbiAgICAgICAgICAgIGFjdGlvbjogY29uZmlnLmFjdGlvbixcbiAgICAgICAgICAgIG1hdGNoOiAoX2EgPSBjb25maWcubWF0Y2gpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGwsXG4gICAgICAgICAgICBjdXN0b21NYXRjaDogKF9iID0gY29uZmlnLmN1c3RvbU1hdGNoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBudWxsLFxuICAgICAgICAgICAgcm90YXRpb246IChfYyA9IGNvbmZpZy5yb3RhdGlvbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24sXG4gICAgICAgICAgICBzaG91bGRNYXRjaFRpbWVzOiAoX2QgPSBjb25maWcuc2hvdWxkTWF0Y2hUaW1lcykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hUaW1lcyxcbiAgICAgICAgICAgIHNob3VsZE1hdGNoRHVyaW5nOiAoX2UgPSBjb25maWcuc2hvdWxkTWF0Y2hEdXJpbmcpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoRHVyaW5nLFxuICAgICAgICAgICAgYmVmb3JlQWN0aW9uRGVsYXk6IChfZiA9IGNvbmZpZy5iZWZvcmVBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQmVmb3JlQWN0aW9uRGVsYXksXG4gICAgICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiAoX2cgPSBjb25maWcuYWZ0ZXJBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQWZ0ZXJBY3Rpb25EZWxheSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAoX2ggPSBjb25maWcucHJpb3JpdHkpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1ByaW9yaXR5LFxuICAgICAgICAgICAgZGVidWc6IChfaiA9IGNvbmZpZy5kZWJ1ZykgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnRGVidWcsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud3JhcFRhc2tDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICAgICAgICBtYXhUYXNrUnVuVGltZXM6IChfYSA9IGNvbmZpZy5tYXhUYXNrUnVuVGltZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza1J1blRpbWVzLFxuICAgICAgICAgICAgbWF4VGFza0R1cmluZzogKF9iID0gY29uZmlnLm1heFRhc2tEdXJpbmcpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza0R1cmluZyxcbiAgICAgICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IChfYyA9IGNvbmZpZy5taW5Sb3VuZEludGVydmFsKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ01pblJvdW5kSW50ZXJ2YWwsXG4gICAgICAgICAgICBmb3JjZVN0b3A6IChfZCA9IGNvbmZpZy5mb3JjZVN0b3ApICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnQXV0b1N0b3AsXG4gICAgICAgICAgICBmaW5kUm91dGVEZWxheTogKF9lID0gY29uZmlnLmZpbmRSb3V0ZURlbGF5KSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5LFxuICAgICAgICAgICAgYmVmb3JlUm91dGU6IChfZiA9IGNvbmZpZy5iZWZvcmVSb3V0ZSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogbnVsbCxcbiAgICAgICAgICAgIGFmdGVyUm91dGU6IChfZyA9IGNvbmZpZy5hZnRlclJvdXRlKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBudWxsLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0VGFza0xvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YXNrSWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0aGlzLnRhc2tzW3Rhc2tJZHggJSB0aGlzLnRhc2tzLmxlbmd0aF07XG4gICAgICAgICAgICB0YXNrSWR4Kys7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHZhciBpc1Rhc2tSdW5GaXJzdFRpbWUgPSB0YXNrLmxhc3RSdW5UaW1lID09PSAwO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHRhc2subGFzdFJ1blRpbWUgPD0gdGFzay5jb25maWcubWluUm91bmRJbnRlcnZhbCAmJiAhaXNUYXNrUnVuRmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBkdXJpbmc6IFwiKS5jb25jYXQobm93IC0gdGFzay5sYXN0UnVuVGltZSwgXCIgPD0gbWluUm91bmRJbnRlcnZhbCwgc2tpcFwiKSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0aGlzLnJlcm91dGVyQ29uZmlnLnRhc2tEZWxheSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLnN0YXJ0VGltZSA9IG5vdztcbiAgICAgICAgICAgIHRhc2sucnVuVGltZXMgPSAwO1xuICAgICAgICAgICAgdmFyIGV4aXRUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2suY29uZmlnLm1heFRhc2tSdW5UaW1lcyAmJiB0aGlzLnJ1bm5pbmcgJiYgIWV4aXRUYXNrOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMpKTtcbiAgICAgICAgICAgICAgICB2YXIgc2tpcFJvdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmJlZm9yZVJvdXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcywgXCIgZG8gYmVmb3JlUm91dGUoKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5iZWZvcmVSb3V0ZSh0YXNrKSA9PT0gJ3NraXBSb3V0ZUxvb3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBza2lwUm91dGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChza2lwUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBza2lwUm91dGVMb29wXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXRUYXNrID0gdGhpcy5zdGFydFJvdXRlTG9vcCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmFmdGVyUm91dGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBkbyBhZnRlclJvdXRlKClcIikpO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmNvbmZpZy5hZnRlclJvdXRlKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnJ1blRpbWVzKys7XG4gICAgICAgICAgICAgICAgdGFzay5sYXN0UnVuVGltZSA9IG5vdztcbiAgICAgICAgICAgICAgICB2YXIgZHVyaW5nID0gbm93IC0gdGFzay5zdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcgPiAwICYmIGR1cmluZyA+PSB0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgdGFza0R1cmluZzogXCIpLmNvbmNhdChkdXJpbmcsIFwiL1wiKS5jb25jYXQodGFzay5jb25maWcubWF4VGFza0R1cmluZywgXCIgcmVhY2hlZCwgc3RvcFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy50YXNrRGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnRSb3V0ZUxvb3AgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQgPSB7XG4gICAgICAgICAgICB0YXNrOiB0YXNrLFxuICAgICAgICAgICAgc2NyZWVuOiB0aGlzLnNjcmVlbixcbiAgICAgICAgICAgIHNjcmlwdFJ1bm5pbmc6IHRoaXMucnVubmluZyxcbiAgICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgICAgbGFzdE1hdGNoZWRQYXRoOiAoX2IgPSAoX2EgPSB0aGlzLnJvdXRlQ29udGV4dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxhc3RNYXRjaGVkUGF0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogJycsXG4gICAgICAgICAgICBtYXRjaFRpbWVzOiAwLFxuICAgICAgICAgICAgbWF0Y2hTdGFydFRTOiAwLFxuICAgICAgICAgICAgbWF0Y2hEdXJpbmc6IDAsXG4gICAgICAgIH07XG4gICAgICAgIHZhciByb3V0ZUxvb3AgPSB0cnVlO1xuICAgICAgICB2YXIgZXhpdFRhc2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZpbmlzaFJvdW5kRnVuYyA9IGZ1bmN0aW9uIChleGl0VGFzaykge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgaWYgKGV4aXRUYXNrID09PSB2b2lkIDApIHsgZXhpdFRhc2sgPSBmYWxzZTsgfVxuICAgICAgICAgICAgcm91dGVMb29wID0gZmFsc2U7XG4gICAgICAgICAgICBleGl0VGFza1Jlc3VsdCA9IGV4aXRUYXNrO1xuICAgICAgICAgICAgX3RoaXMubG9nKFwiZmluaXNoIHJvdW5kOiBcIi5jb25jYXQoKF9hID0gX3RoaXMucm91dGVDb250ZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudGFzay5uYW1lLCBcIjsgZXhpdFRhc2s6IFwiKS5jb25jYXQoZXhpdFRhc2spKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcG9pbnRlciBmb3Igc2hvcnQgY29kZVxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMucm91dGVDb250ZXh0O1xuICAgICAgICB3aGlsZSAocm91dGVMb29wICYmIHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAvLyBjaGVjayB0YXNrLmF1dG9TdG9wXG4gICAgICAgICAgICB2YXIgdGFza1J1bkR1cmluZyA9IG5vdyAtIHRhc2suc3RhcnRUaW1lO1xuICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmZvcmNlU3RvcCAmJiB0YXNrUnVuRHVyaW5nID4gdGFzay5jb25maWcubWF4VGFza0R1cmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzayBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBBdXRvU3RvcCwgZXhjZWVkIHRhc2tSdW5EdXJpbmdcIikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2hlY2sgaXNBcHBPbiBvciBhdXRvIGxhdW5jaCBpdFxuICAgICAgICAgICAgaWYgKHRoaXMucmVyb3V0ZXJDb25maWcuYXV0b0xhdW5jaEFwcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQW5kU3RhcnRBcHAoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcm90YXRpb24gPSB0aGlzLnNjcmVlbi5nZXRSb3RhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICAgICAgdmFyIF9kID0gdGhpcy5maW5kTWF0Y2hlZFJvdXRlSW1wbCh0YXNrLm5hbWUsIGltYWdlLCByb3RhdGlvbiksIG1hdGNoZWRSb3V0ZSA9IF9kLm1hdGNoZWRSb3V0ZSwgbWF0Y2hlZFBhZ2VzID0gX2QubWF0Y2hlZFBhZ2VzO1xuICAgICAgICAgICAgLy8gY29udGV4dC5tYXRjaFN0YXJ0VFMgPSAwIGlmIGluaXQgcnVuXG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoU3RhcnRUUyA9IGNvbnRleHQubWF0Y2hTdGFydFRTIHx8IG5vdztcbiAgICAgICAgICAgIGNvbnRleHQucGF0aCA9IChfYyA9IG1hdGNoZWRSb3V0ZSA9PT0gbnVsbCB8fCBtYXRjaGVkUm91dGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hdGNoZWRSb3V0ZS5wYXRoKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAnJztcbiAgICAgICAgICAgIC8vIGZpcnN0IG1hdGNoXG4gICAgICAgICAgICBpZiAoY29udGV4dC5wYXRoICE9PSBjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQubWF0Y2hUaW1lcyA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tYXRjaFN0YXJ0VFMgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoRHVyaW5nID0gbm93IC0gY29udGV4dC5tYXRjaFN0YXJ0VFM7XG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoVGltZXMrKztcbiAgICAgICAgICAgIGlmIChtYXRjaGVkUm91dGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmtub3duUm91dGVBY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bmtub3duUm91dGVBY3Rpb24oY29udGV4dCwgaW1hZ2UsIGZpbmlzaFJvdW5kRnVuYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb0FjdGlvbkZvclJvdXRlKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkUm91dGUsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmRGdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBsYXN0TWF0Y2hlZFBhdGggYWZ0ZXIgYWN0aW9uIGRvbmVcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgbGFzdE1hdGNoZWRQYXRoIHdpbGwgYmUgY3VycmVudCBwYXRoIHdoZW4gZG9pbmcgYWN0aW9uXG4gICAgICAgICAgICBjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCA9IGNvbnRleHQucGF0aDtcbiAgICAgICAgICAgIHJlbGVhc2VJbWFnZShpbWFnZSk7XG4gICAgICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHRhc2suY29uZmlnLmZpbmRSb3V0ZURlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhpdFRhc2tSZXN1bHQ7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZG9BY3Rpb25Gb3JSb3V0ZSA9IGZ1bmN0aW9uIChjb250ZXh0LCBpbWFnZSwgcm91dGUsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImhhbmRsZU1hdGNoZWRSb3V0ZTogXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiLCB0aW1lczogXCIpLmNvbmNhdChjb250ZXh0Lm1hdGNoVGltZXMsIFwiLCBkdXJpbmc6IFwiKS5jb25jYXQoY29udGV4dC5tYXRjaER1cmluZykpO1xuICAgICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzIDwgcm91dGUuc2hvdWxkTWF0Y2hUaW1lcyB8fCBjb250ZXh0Lm1hdGNoRHVyaW5nIDwgcm91dGUuc2hvdWxkTWF0Y2hEdXJpbmcpIHtcbiAgICAgICAgICAgIC8vIHNob3VsZCBzdGlsbCB3YWl0IGZvciBtYXRjaGluZyBjb25kaXRpb25cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV4dFhZID0gKF9hID0gbWF0Y2hlZFBhZ2VzWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmV4dDtcbiAgICAgICAgdmFyIGJhY2tYWSA9IChfYiA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmJhY2s7XG4gICAgICAgIC8vIG1hdGNoZWQgYW5kIGZpdCBjb25kaXRpb24sIGRvIGFjdGlvblxuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHJvdXRlLmJlZm9yZUFjdGlvbkRlbGF5KTtcbiAgICAgICAgaWYgKHJvdXRlLmFjdGlvbiA9PT0gJ2dvTmV4dCcpIHtcbiAgICAgICAgICAgIGlmIChuZXh0WFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuLnRhcChuZXh0WFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIGFjdGlvbiA9PSBnb05leHQsIGJ1dCBubyBuZXh0IHh5XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3V0ZS5hY3Rpb24gPT09ICdnb0JhY2snKSB7XG4gICAgICAgICAgICBpZiAoYmFja1hZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAoYmFja1hZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBhY3Rpb24gPT0gZ29CYWNrLCBidXQgbm8gYmFjayB4eVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocm91dGUuYWN0aW9uID09PSAna2V5Y29kZUJhY2snKSB7XG4gICAgICAgICAgICBrZXljb2RlKCdCQUNLJywgdGhpcy5zY3JlZW5Db25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvdXRlLmFjdGlvbihjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZFBhZ2VzLCBmaW5pc2hSb3VuZCk7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcChyb3V0ZS5hZnRlckFjdGlvbkRlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5maW5kTWF0Y2hlZFJvdXRlSW1wbCA9IGZ1bmN0aW9uICh0YXNrTmFtZSwgaW1hZ2UsIHJvdGF0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnJvdXRlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IF9hW19pXTtcbiAgICAgICAgICAgIHZhciBfYiA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIHJvdXRlLCB0YXNrTmFtZSksIGlzTWF0Y2hlZCA9IF9iLmlzTWF0Y2hlZCwgbWF0Y2hlZFBhZ2VzID0gX2IubWF0Y2hlZFBhZ2VzO1xuICAgICAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgJ2N1cnJlbnQgbWF0Y2g6JywgbWF0Y2hlZFBhZ2VzLm1hcChmdW5jdGlvbiAocCkgeyByZXR1cm4gcC5uYW1lOyB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZFJvdXRlOiByb3V0ZSwgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBtYXRjaGVkUm91dGU6IG51bGwsIG1hdGNoZWRQYWdlczogW10gfTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc01hdGNoUm91dGVJbXBsID0gZnVuY3Rpb24gKGltYWdlLCByb3RhdGlvbiwgcm91dGUsIHRhc2tOYW1lKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gY2hlY2sgcm90YXRpb25cbiAgICAgICAgaWYgKHJvdXRlLnJvdGF0aW9uICE9PSByb3RhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImZpbmRNYXRjaGVkUm91dGUgXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIG5vdCBtYXRjaCByb3RhdGlvbiwgc2tpcFwiKSk7XG4gICAgICAgICAgICByZXR1cm4geyBpc01hdGNoZWQ6IGZhbHNlLCBtYXRjaGVkUGFnZXM6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgbWF0Y2hlZFBhZ2VzID0gW107XG4gICAgICAgIC8vIGNoZWNrIHJvdXRlLm1hdGNoXG4gICAgICAgIGlmIChyb3V0ZS5tYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJvdXRlLm1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgcm91dGUuZGVidWcpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaChyb3V0ZS5tYXRjaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocm91dGUubWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5Hcm91cFBhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzLCByb3V0ZS5kZWJ1Zyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaC5hcHBseShtYXRjaGVkUGFnZXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgcm91dGUuaXNNYXRjaCBmdW5jdGlvblxuICAgICAgICBpZiAoIWlzTWF0Y2hlZCAmJiByb3V0ZS5jdXN0b21NYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaXNNYXRjaGVkID0gcm91dGUuY3VzdG9tTWF0Y2godGFza05hbWUsIGltYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJmaW5kTWF0Y2hlZFJvdXRlIFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBpc01hdGNoKCkgPT4gXCIpLmNvbmNhdChpc01hdGNoZWQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiZmluZE1hdGNoZWRSb3V0ZSBcIi5jb25jYXQocm91dGUucGF0aCwgXCIgbWF0Y2g6IFwiKS5jb25jYXQoaXNNYXRjaGVkLCBcIiwgZmlyc3RQYWdlOiBcIikuY29uY2F0KChfYSA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzTWF0Y2hlZDogaXNNYXRjaGVkLFxuICAgICAgICAgICAgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNNYXRjaFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBwYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgdGhyZXMgPSAoX2EgPSBwYWdlLnRocmVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwYXJlbnRUaHJlcztcbiAgICAgICAgdmFyIGlzU2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1cIikpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBwYWdlLnBvaW50c1tpXTtcbiAgICAgICAgICAgIHZhciBjb2xvciA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgdmFyIHNjb3JlID0gdXRpbHNfMS5VdGlscy5pZGVudGl0eUNvbG9yKHBvaW50LCBjb2xvcik7XG4gICAgICAgICAgICB2YXIgaXNQb2ludENvbG9yTWF0Y2ggPSBzY29yZSA+PSB0aHJlcztcbiAgICAgICAgICAgIGlmICghaXNQb2ludENvbG9yTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpc1NhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwicG9pbnRbXCIuY29uY2F0KGksIFwiXSBtYXRjaCBmYWxzZTogc2NvcmU6IFwiKS5jb25jYXQoc2NvcmUsIFwiLCB0aHJlczogXCIpLmNvbmNhdCh0aHJlcywgXCJcXG5cIiksIFwiZXhwZWN0OiBcIi5jb25jYXQodXRpbHNfMS5VdGlscy5mb3JtYXRYWVJHQihwb2ludCksIFwiXFxuXCIpLCBcIiAgIGdldDogXCIuY29uY2F0KHV0aWxzXzEuVXRpbHMuZm9ybWF0WFlSR0IoX19hc3NpZ24oX19hc3NpZ24oe30sIGNvbG9yKSwgeyB4OiBwb2ludC54LCB5OiBwb2ludC55IH0pKSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1bbWF0Y2g6IFwiKS5jb25jYXQoaXNTYW1lLCBcIl1cIikpO1xuICAgICAgICByZXR1cm4gaXNTYW1lO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzTWF0Y2hHcm91cFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBncm91cFBhZ2UsIHBhcmVudFRocmVzLCBkZWJ1Zykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciB0aHJlcyA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgZGVidWcpO1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcImNoZWNrTWF0Y2hHcm91cFBhZ2U6IFwiLmNvbmNhdChncm91cFBhZ2UubmFtZSwgXCIsIHBhZ2VbXCIpLmNvbmNhdChpLCBcIl06IFwiKS5jb25jYXQocGFnZS5uYW1lLCBcIiBtYXRjaDogXCIpLmNvbmNhdChpc1BhZ2VNYXRjaCkpO1xuICAgICAgICAgICAgaWYgKGdyb3VwUGFnZS5tYXRjaE9QID09PSAnfHwnICYmIGlzUGFnZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwYWdlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncm91cFBhZ2UubWF0Y2hPUCA9PT0gJyYmJyAmJiAhaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwUGFnZS5tYXRjaE9QID09PSAnJiYnID8gZ3JvdXBQYWdlLnBhZ2VzIDogW107XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbC5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5KFt0aGlzLmRlYnVnXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5sb2dJbXBsID0gZnVuY3Rpb24gKGRlYnVnKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVidWcgfHwgIXRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbmx5IGxvZyB3aGVuIGRlYnVnICsgdGhpcy5kZWJ1ZyBpcyB0cnVlXG4gICAgICAgIHV0aWxzXzEuVXRpbHMubG9nLmFwcGx5KHV0aWxzXzEuVXRpbHMsIF9fc3ByZWFkQXJyYXkoWydbUmVyb3V0ZXJdW2RlYnVnXSddLCBhcmdzLCBmYWxzZSkpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5sb2cuYXBwbHkodXRpbHNfMS5VdGlscywgX19zcHJlYWRBcnJheShbJ1tSZXJvdXRlcl1bd2FybmluZ10nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIHJldHVybiBSZXJvdXRlcjtcbn0oKSk7XG5leHBvcnRzLlJlcm91dGVyID0gUmVyb3V0ZXI7XG5leHBvcnRzLnJlcm91dGVyID0gbmV3IFJlcm91dGVyKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXJvdXRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2NyZWVuID0gdm9pZCAwO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBTY3JlZW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2NyZWVuKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgU2NyZWVuLnByb3RvdHlwZS5jYWxjdWxhdGVEZXZpY2VPZmZzZXQgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGZ1bmModGhpcyk7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoID0gcmVzdWx0cy5zY3JlZW5XaWR0aDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0ID0gcmVzdWx0cy5zY3JlZW5IZWlnaHQ7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFggPSByZXN1bHRzLnNjcmVlbk9mZnNldFg7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFkgPSByZXN1bHRzLnNjcmVlbk9mZnNldFk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblggPSBmdW5jdGlvbiAoZGV2WCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYICsgKGRldlggKiB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCkgLyB0aGlzLmNvbmZpZy5kZXZXaWR0aCkgfHwgMDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWSA9IGZ1bmN0aW9uIChkZXZZKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFkgKyAoZGV2WSAqIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCkgLyB0aGlzLmNvbmZpZy5kZXZIZWlnaHQpIHx8IDA7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblhZID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldFNjcmVlblhZIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHRhcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgdGFwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwRG93biA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICB0YXBEb3duKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICB0YXBEb3duKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUubW92ZVRvID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIG1vdmVUbyh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgbW92ZVRvKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwVXAgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgdGFwVXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHRhcFVwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuQ29sb3IgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWcsIHAxLngsIHAxLnkpO1xuICAgICAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGltZyA9IHRoaXMuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICAgICAgdmFyIHJnYiA9IGdldEltYWdlQ29sb3IoaW1nLCBwMSwgcDIpO1xuICAgICAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmZpbmRJbWFnZSA9IGZ1bmN0aW9uIChkZXZJbWcpIHtcbiAgICAgICAgdmFyIGltZyA9IHRoaXMuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZmluZEltYWdlKGltZywgZGV2SW1nKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnRhcEltYWdlID0gZnVuY3Rpb24gKGRldkltZykge1xuICAgICAgICB2YXIgeHkgPSB0aGlzLmZpbmRJbWFnZShkZXZJbWcpO1xuICAgICAgICB0aGlzLnRhcCh4eSk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmlzU2FtZUNvbG9yID0gZnVuY3Rpb24gKGRldkNvbG9yUG9pbnQsIHRocmVzKSB7XG4gICAgICAgIGlmICh0aHJlcyA9PT0gdm9pZCAwKSB7IHRocmVzID0gMC45OyB9XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLmdldFNjcmVlbkNvbG9yKGRldkNvbG9yUG9pbnQpO1xuICAgICAgICB2YXIgc2NvcmUgPSB1dGlsc18xLlV0aWxzLmlkZW50aXR5Q29sb3IocmdiLCBkZXZDb2xvclBvaW50KTtcbiAgICAgICAgaWYgKHNjb3JlID4gdGhyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8vIGN1cnJlbnRseSByZWFsIGRldmljZSBzY3JlZW5zaG90XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXREZXZpY2VTY3JlZW5zaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdCgpO1xuICAgIH07XG4gICAgLy8gY3VycmVudGx5IGRldmljZSBzY3JlZW5zaG90IGN1dCBieSBvZmZzZXRcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90TW9kaWZ5KHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFgsIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFksIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIDEwMCk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldEN2dERldlNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90TW9kaWZ5KHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFgsIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFksIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIHRoaXMuY29uZmlnLmRldldpZHRoLCB0aGlzLmNvbmZpZy5kZXZIZWlnaHQsIDEwMCk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EgPSBnZXRTY3JlZW5TaXplKCksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRJbWFnZVJvdGF0aW9uID0gZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgIHZhciBfYSA9IGdldEltYWdlU2l6ZShpbWFnZSksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5zZXRBY3Rpb25EdXJpbmcgPSBmdW5jdGlvbiAoZHVyaW5nKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyA9IGR1cmluZztcbiAgICB9O1xuICAgIFNjcmVlbi5kZWJ1ZyA9IGZhbHNlO1xuICAgIHJldHVybiBTY3JlZW47XG59KCkpO1xuZXhwb3J0cy5TY3JlZW4gPSBTY3JlZW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY3JlZW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY3JlZW5Db25maWcgPSBleHBvcnRzLkRlZmF1bHRSZXJvdXRlckNvbmZpZyA9IGV4cG9ydHMuRGVmYXVsdENvbmZpZ1ZhbHVlID0gZXhwb3J0cy5Hcm91cFBhZ2UgPSBleHBvcnRzLlBhZ2UgPSB2b2lkIDA7XG52YXIgUGFnZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYWdlKG5hbWUsIGRldlBvaW50cywgbmV4dCwgYmFjaywgdGhyZXMpIHtcbiAgICAgICAgaWYgKG5leHQgPT09IHZvaWQgMCkgeyBuZXh0ID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmIChiYWNrID09PSB2b2lkIDApIHsgYmFjayA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodGhyZXMgPT09IHZvaWQgMCkgeyB0aHJlcyA9IHVuZGVmaW5lZDsgfVxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnBvaW50cyA9IGRldlBvaW50cztcbiAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgdGhpcy5iYWNrID0gYmFjaztcbiAgICAgICAgdGhpcy50aHJlcyA9IHRocmVzO1xuICAgIH1cbiAgICByZXR1cm4gUGFnZTtcbn0oKSk7XG5leHBvcnRzLlBhZ2UgPSBQYWdlO1xudmFyIEdyb3VwUGFnZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHcm91cFBhZ2UobmFtZSwgcGFnZXMsIG5leHQsIGJhY2ssIHRocmVzLCBtYXRjaE9QKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSB2b2lkIDApIHsgbmV4dCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAoYmFjayA9PT0gdm9pZCAwKSB7IGJhY2sgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKG1hdGNoT1AgPT09IHZvaWQgMCkgeyBtYXRjaE9QID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucGFnZXMgPSBwYWdlcztcbiAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgdGhpcy5iYWNrID0gYmFjaztcbiAgICAgICAgdGhpcy50aHJlcyA9IHRocmVzO1xuICAgICAgICB0aGlzLm1hdGNoT1AgPSBtYXRjaE9QIHx8ICd8fCc7XG4gICAgfVxuICAgIHJldHVybiBHcm91cFBhZ2U7XG59KCkpO1xuZXhwb3J0cy5Hcm91cFBhZ2UgPSBHcm91cFBhZ2U7XG5leHBvcnRzLkRlZmF1bHRDb25maWdWYWx1ZSA9IHtcbiAgICBYWVJHQlRocmVzOiAwLjksXG4gICAgUGFnZVRocmVzOiAwLjksXG4gICAgR3JvdXBQYWdlVGhyZXM6IDAuOSxcbiAgICBHcm91cFBhZ2VNYXRjaE9QOiAnfHwnLFxuICAgIFJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hUaW1lczogMSxcbiAgICBSb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoRHVyaW5nOiAwLFxuICAgIFJvdXRlQ29uZmlnQmVmb3JlQWN0aW9uRGVsYXk6IDI1MCxcbiAgICBSb3V0ZUNvbmZpZ0FmdGVyQWN0aW9uRGVsYXk6IDI1MCxcbiAgICBSb3V0ZUNvbmZpZ1ByaW9yaXR5OiAxLFxuICAgIFJvdXRlQ29uZmlnRGVidWc6IGZhbHNlLFxuICAgIFRhc2tDb25maWdNYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgVGFza0NvbmZpZ01heFRhc2tEdXJpbmc6IDAsXG4gICAgVGFza0NvbmZpZ01pblJvdW5kSW50ZXJ2YWw6IDAsXG4gICAgVGFza0NvbmZpZ0F1dG9TdG9wOiBmYWxzZSxcbiAgICBUYXNrQ29uZmlnRmluZFJvdXRlRGVsYXk6IDIwMDAsXG59O1xuZXhwb3J0cy5EZWZhdWx0UmVyb3V0ZXJDb25maWcgPSB7XG4gICAgcGFja2FnZU5hbWU6ICcnLFxuICAgIHRhc2tEZWxheTogMjAwMCxcbiAgICBzdGFydEFwcERlbGF5OiA2MDAwLFxuICAgIGF1dG9MYXVuY2hBcHA6IHRydWUsXG4gICAgdGVzdGluZ1NjcmVlbnNob3RQYXRoOiAnLi9zY3JlZW5zaG90Jyxcbn07XG5leHBvcnRzLkRlZmF1bHRTY3JlZW5Db25maWcgPSB7XG4gICAgZGV2V2lkdGg6IDY0MCxcbiAgICBkZXZIZWlnaHQ6IDM2MCxcbiAgICBkZXZpY2VXaWR0aDogMCxcbiAgICBkZXZpY2VIZWlnaHQ6IDAsXG4gICAgc2NyZWVuV2lkdGg6IDAsXG4gICAgc2NyZWVuSGVpZ2h0OiAwLFxuICAgIHNjcmVlbk9mZnNldFg6IDAsXG4gICAgc2NyZWVuT2Zmc2V0WTogMCxcbiAgICBhY3Rpb25EdXJpbmc6IDE4MCxcbiAgICByb3RhdGlvbjogJ2hvcml6b250YWwnLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cnVjdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVXRpbHMgPSBleHBvcnRzLmxvZyA9IHZvaWQgMDtcbmZ1bmN0aW9uIGxvZygpIHtcbiAgICB2YXIgbXNncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG1zZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHtcbiAgICAgICAgdGltZVpvbmU6ICdBc2lhL1RhaXBlaScsXG4gICAgfSk7XG4gICAgdmFyIG1lc3NhZ2UgPSBcIltcIi5jb25jYXQoZGF0ZSwgXCJdIFwiKTtcbiAgICBmb3IgKHZhciBfYSA9IDAsIG1zZ3NfMSA9IG1zZ3M7IF9hIDwgbXNnc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICB2YXIgbXNnID0gbXNnc18xW19hXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiXCIuY29uY2F0KEpTT04uc3RyaW5naWZ5KG1zZyksIFwiIFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJcIi5jb25jYXQobXNnLCBcIiBcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cobWVzc2FnZS5zdWJzdHIoMCwgbWVzc2FnZS5sZW5ndGggLSAxKSk7XG59XG5leHBvcnRzLmxvZyA9IGxvZztcbnZhciBVdGlscyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVdGlscygpIHtcbiAgICB9XG4gICAgVXRpbHMuaWRlbnRpdHlDb2xvciA9IGZ1bmN0aW9uIChlMSwgZTIpIHtcbiAgICAgICAgdmFyIG1lYW4gPSAoZTEuciArIGUyLnIpIC8gMjtcbiAgICAgICAgdmFyIHIgPSBlMS5yIC0gZTIucjtcbiAgICAgICAgdmFyIGcgPSBlMS5nIC0gZTIuZztcbiAgICAgICAgdmFyIGIgPSBlMS5iIC0gZTIuYjtcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnNxcnQoKCgoNTEyICsgbWVhbikgKiByICogcikgPj4gOCkgKyA0ICogZyAqIGcgKyAoKCg3NjcgLSBtZWFuKSAqIGIgKiBiKSA+PiA4KSkgLyA3Njg7XG4gICAgfTtcbiAgICBVdGlscy5mb3JtYXRYWVJHQiA9IGZ1bmN0aW9uICh4eXJnYikge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHh5cmdiKTtcbiAgICAgICAgdmFyIGZvcm1hdE9iaiA9IHt9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzXzFbX2ldO1xuICAgICAgICAgICAgdmFyIHN0ciA9IFwiXCIuY29uY2F0KHh5cmdiW2tdKTtcbiAgICAgICAgICAgIHdoaWxlIChzdHIubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgIHN0ciA9ICcgJyArIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcm1hdE9ialtrXSA9IHN0cjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeCA9IGZvcm1hdE9iai54LCB5ID0gZm9ybWF0T2JqLnksIHIgPSBmb3JtYXRPYmouciwgZyA9IGZvcm1hdE9iai5nLCBiID0gZm9ybWF0T2JqLmI7XG4gICAgICAgIHJldHVybiBcInsgeDogXCIuY29uY2F0KHgsIFwiLCB5OiBcIikuY29uY2F0KHksIFwiLCByOiBcIikuY29uY2F0KHIsIFwiLCBnOiBcIikuY29uY2F0KGcsIFwiLCBiOiBcIikuY29uY2F0KGIsIFwiIH1cIik7XG4gICAgfTtcbiAgICBVdGlscy5zb3J0U3RyaW5nTnVtYmVyTWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBrZXk6IGtleSwgY291bnQ6IG1hcFtrZXldIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5jb3VudCAtIGEuY291bnQ7IH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuICAgIFV0aWxzLnNsZWVwID0gZnVuY3Rpb24gKGR1cmluZykge1xuICAgICAgICB3aGlsZSAoZHVyaW5nID4gMjAwKSB7XG4gICAgICAgICAgICBkdXJpbmcgLT0gMjAwO1xuICAgICAgICAgICAgc2xlZXAoMjAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHVyaW5nID4gMCkge1xuICAgICAgICAgICAgc2xlZXAoZHVyaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuZ2V0VGFpd2FuVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCkgKyA4ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfTtcbiAgICBVdGlscy5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoVXRpbHMuZ2V0VGFpd2FuVGltZSgpKTtcbiAgICAgICAgdmFyIGRhdGVTdHJpbmcgPSBcIltcIi5jb25jYXQoZGF0ZS5nZXRNb250aCgpICsgMSwgXCItXCIpLmNvbmNhdChkYXRlLmdldERhdGUoKSwgXCJUXCIpLmNvbmNhdChkYXRlLmdldEhvdXJzKCksIFwiOlwiKS5jb25jYXQoZGF0ZS5nZXRNaW51dGVzKCksIFwiOlwiKS5jb25jYXQoZGF0ZS5nZXRTZWNvbmRzKCksIFwiXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgX19zcHJlYWRBcnJheShbZGF0ZVN0cmluZ10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICBVdGlscy5ub3RpZnlFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgY29udGVudCkge1xuICAgICAgICBpZiAoc2VuZEV2ZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVXRpbHMubG9nKCdzZW5kRXZlbnQnLCBldmVudCwgY29udGVudCk7XG4gICAgICAgICAgICBzZW5kRXZlbnQoJycgKyBldmVudCwgJycgKyBjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuc3RhcnRBcHAgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgZXhlY3V0ZShcIkJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yazIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvc2VydmljZXMuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3dlYnZpZXdjaHJvbWl1bS5qYXIgYW0gc3RhcnQgLW4gXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgICAgIGV4ZWN1dGUoXCJBTkRST0lEX0RBVEE9L2RhdGEgQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLW9qLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWxpYmFydC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb3JnLmFwYWNoZS5odHRwLmxlZ2FjeS5ib290LmphciBhbSBzdGFydCAtbiBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBtb25rZXkgLS1wY3Qtc3lza2V5cyAwIC1wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSwgXCIgLWMgYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuTEFVTkNIRVIgMVwiKSk7XG4gICAgICAgIGV4ZWN1dGUoJ0FORFJPSURfQk9PVExPR089MSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1JPT1Q9L3N5c3RlbSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0FTU0VUUz0vc3lzdGVtL2FwcCAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0RBVEE9L2RhdGEgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9TVE9SQUdFPS9zdG9yYWdlICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfQVJUX1JPT1Q9L2FwZXgvY29tLmFuZHJvaWQuYXJ0ICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfSTE4Tl9ST09UPS9hcGV4L2NvbS5hbmRyb2lkLmkxOG4gJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9UWkRBVEFfUk9PVD0vYXBleC9jb20uYW5kcm9pZC50emRhdGEgJyArXG4gICAgICAgICAgICAnRVhURVJOQUxfU1RPUkFHRT0vc2RjYXJkICcgK1xuICAgICAgICAgICAgJ0FTRUNfTU9VTlRQT0lOVD0vbW50L2FzZWMgJyArXG4gICAgICAgICAgICAnQk9PVENMQVNTUEFUSD0vYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLW9qLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWxpYmFydC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1pY3U0ai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvb2todHRwLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9ib3VuY3ljYXN0bGUuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLWF0Yi1iYWNrd2FyZC1jb21wYXRpYmlsaXR5LmphcjovYXBleC9jb20uYW5kcm9pZC5jb25zY3J5cHQvamF2YWxpYi9jb25zY3J5cHQuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm1lZGlhL2phdmFsaWIvdXBkYXRhYmxlLW1lZGlhLmphcjovYXBleC9jb20uYW5kcm9pZC5tZWRpYXByb3ZpZGVyL2phdmFsaWIvZnJhbWV3b3JrLW1lZGlhcHJvdmlkZXIuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm9zLnN0YXRzZC9qYXZhbGliL2ZyYW1ld29yay1zdGF0c2QuamFyOi9hcGV4L2NvbS5hbmRyb2lkLnBlcm1pc3Npb24vamF2YWxpYi9mcmFtZXdvcmstcGVybWlzc2lvbi5qYXI6L2FwZXgvY29tLmFuZHJvaWQuc2RrZXh0L2phdmFsaWIvZnJhbWV3b3JrLXNka2V4dGVuc2lvbnMuamFyOi9hcGV4L2NvbS5hbmRyb2lkLndpZmkvamF2YWxpYi9mcmFtZXdvcmstd2lmaS5qYXI6L2FwZXgvY29tLmFuZHJvaWQudGV0aGVyaW5nL2phdmFsaWIvZnJhbWV3b3JrLXRldGhlcmluZy5qYXIgJyArXG4gICAgICAgICAgICAnREVYMk9BVEJPT1RDTEFTU1BBVEg9L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1vai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1saWJhcnQuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtaWN1NGouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL29raHR0cC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYm91bmN5Y2FzdGxlLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay1hdGItYmFja3dhcmQtY29tcGF0aWJpbGl0eS5qYXIgJyArXG4gICAgICAgICAgICAnU1lTVEVNU0VSVkVSQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvbS5hbmRyb2lkLmxvY2F0aW9uLnByb3ZpZGVyLmphcjovc3lzdGVtL2ZyYW1ld29yay9zZXJ2aWNlcy5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXRoZXJuZXQtc2VydmljZS5qYXI6L2FwZXgvY29tLmFuZHJvaWQucGVybWlzc2lvbi9qYXZhbGliL3NlcnZpY2UtcGVybWlzc2lvbi5qYXI6L2FwZXgvY29tLmFuZHJvaWQuaXBzZWMvamF2YWxpYi9hbmRyb2lkLm5ldC5pcHNlYy5pa2UuamFyICcgK1xuICAgICAgICAgICAgXCJtb25rZXkgLS1wY3Qtc3lza2V5cyAwIC1wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSwgXCIgLWMgYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuTEFVTkNIRVIgMVwiKSk7XG4gICAgfTtcbiAgICBVdGlscy5zdG9wQXBwID0gZnVuY3Rpb24gKHBhY2thZ2VOYW1lKSB7XG4gICAgICAgIGV4ZWN1dGUoXCJCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvbnNjcnlwdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb2todHRwLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWp1bml0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9ib3VuY3ljYXN0bGUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsyLmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvbW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYW5kcm9pZC5wb2xpY3kuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3NlcnZpY2VzLmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay93ZWJ2aWV3Y2hyb21pdW0uamFyIGFtIGZvcmNlLXN0b3AgXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgICAgIGV4ZWN1dGUoXCJBTkRST0lEX0RBVEE9L2RhdGEgQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLW9qLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWxpYmFydC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb3JnLmFwYWNoZS5odHRwLmxlZ2FjeS5ib290LmphciBhbSBmb3JjZS1zdG9wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgIH07XG4gICAgVXRpbHMuZ2V0Q3VycmVudEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGV4ZWN1dGUoJ2R1bXBzeXMgd2luZG93IHdpbmRvd3MnKS5zcGxpdCgnbUN1cnJlbnRGb2N1cycpO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSByZXN1bHRbMV0uc3BsaXQoJyAnKTtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICByZXR1cm4gWycnLCAnJ107XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0WzJdID0gcmVzdWx0WzJdLnJlcGxhY2UoJ30nLCAnJyk7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFsyXS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSAnJztcbiAgICAgICAgdmFyIGFjdGl2aXR5TmFtZSA9ICcnO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZSA9IHJlc3VsdFswXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lID0gcmVzdWx0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgIGFjdGl2aXR5TmFtZSA9IHJlc3VsdFsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwYWNrYWdlTmFtZSwgYWN0aXZpdHlOYW1lXTtcbiAgICB9O1xuICAgIFV0aWxzLmlzQXBwT25Ub3AgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgdmFyIHRvcEluZm8gPSBleGVjdXRlKCdkdW1wc3lzIGFjdGl2aXR5IGFjdGl2aXRpZXMgfCBncmVwIG1SZXN1bWVkQWN0aXZpdHknKTtcbiAgICAgICAgcmV0dXJuIHRvcEluZm8uaW5kZXhPZihwYWNrYWdlTmFtZSkgIT09IC0xO1xuICAgIH07XG4gICAgVXRpbHMuc2VuZFNsYWNrTWVzc2FnZSA9IGZ1bmN0aW9uICh1cmwsIHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBib2R5ID0ge1xuICAgICAgICAgICAgYmxvY2tzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyonICsgdGl0bGUgKyAnKicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkaXZpZGVyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICAgIGh0dHBDbGllbnQoJ1BPU1QnLCB1cmwsIEpTT04uc3RyaW5naWZ5KGJvZHkpLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFV0aWxzLndhaXRGb3JBY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uLCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCkge1xuICAgICAgICBpZiAobWF0Y2hUaW1lcyA9PT0gdm9pZCAwKSB7IG1hdGNoVGltZXMgPSAxOyB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PT0gdm9pZCAwKSB7IGludGVydmFsID0gNjAwOyB9XG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICB2YXIgbWF0Y2hzID0gMDtcbiAgICAgICAgd2hpbGUgKERhdGUubm93KCkgLSBub3cgPCB0aW1lb3V0KSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICBtYXRjaHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaHMgPj0gbWF0Y2hUaW1lcykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVXRpbHMuc2xlZXAoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaHMgPj0gbWF0Y2hUaW1lcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIFV0aWxzO1xufSgpKTtcbmV4cG9ydHMuVXRpbHMgPSBVdGlscztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsInZhciBjaGFyZW5jID0ge1xuICAvLyBVVEYtOCBlbmNvZGluZ1xuICB1dGY4OiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBjaGFyZW5jLmJpbi5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNoYXJlbmMuYmluLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEJpbmFyeSBlbmNvZGluZ1xuICBiaW46IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgc3RyID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHN0ci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pKTtcbiAgICAgIHJldHVybiBzdHIuam9pbignJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJlbmM7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBiYXNlNjRtYXBcbiAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuXG4gIGNyeXB0ID0ge1xuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIGxlZnRcbiAgICByb3RsOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgYikgfCAobiA+Pj4gKDMyIC0gYikpO1xuICAgIH0sXG5cbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiByaWdodFxuICAgIHJvdHI6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCAoMzIgLSBiKSkgfCAobiA+Pj4gYik7XG4gICAgfSxcblxuICAgIC8vIFN3YXAgYmlnLWVuZGlhbiB0byBsaXR0bGUtZW5kaWFuIGFuZCB2aWNlIHZlcnNhXG4gICAgZW5kaWFuOiBmdW5jdGlvbihuKSB7XG4gICAgICAvLyBJZiBudW1iZXIgZ2l2ZW4sIHN3YXAgZW5kaWFuXG4gICAgICBpZiAobi5jb25zdHJ1Y3RvciA9PSBOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0LnJvdGwobiwgOCkgJiAweDAwRkYwMEZGIHwgY3J5cHQucm90bChuLCAyNCkgJiAweEZGMDBGRjAwO1xuICAgICAgfVxuXG4gICAgICAvLyBFbHNlLCBhc3N1bWUgYXJyYXkgYW5kIHN3YXAgYWxsIGl0ZW1zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpKyspXG4gICAgICAgIG5baV0gPSBjcnlwdC5lbmRpYW4obltpXSk7XG4gICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYW4gYXJyYXkgb2YgYW55IGxlbmd0aCBvZiByYW5kb20gYnl0ZXNcbiAgICByYW5kb21CeXRlczogZnVuY3Rpb24obikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXTsgbiA+IDA7IG4tLSlcbiAgICAgICAgYnl0ZXMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYmlnLWVuZGlhbiAzMi1iaXQgd29yZHNcbiAgICBieXRlc1RvV29yZHM6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciB3b3JkcyA9IFtdLCBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KVxuICAgICAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpO1xuICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGJpZy1lbmRpYW4gMzItYml0IHdvcmRzIHRvIGEgYnl0ZSBhcnJheVxuICAgIHdvcmRzVG9CeXRlczogZnVuY3Rpb24od29yZHMpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOClcbiAgICAgICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xuICAgIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBoZXggPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4RikudG9TdHJpbmcoMTYpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgIGJ5dGVzVG9CYXNlNjQ6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBiYXNlNjQgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICB2YXIgdHJpcGxldCA9IChieXRlc1tpXSA8PCAxNikgfCAoYnl0ZXNbaSArIDFdIDw8IDgpIHwgYnl0ZXNbaSArIDJdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKylcbiAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA8PSBieXRlcy5sZW5ndGggKiA4KVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goYmFzZTY0bWFwLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRikpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKCc9Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYmFzZS02NCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgYmFzZTY0VG9CeXRlczogZnVuY3Rpb24oYmFzZTY0KSB7XG4gICAgICAvLyBSZW1vdmUgbm9uLWJhc2UtNjQgY2hhcmFjdGVyc1xuICAgICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL1teQS1aMC05K1xcL10vaWcsICcnKTtcblxuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDAsIGltb2Q0ID0gMDsgaSA8IGJhc2U2NC5sZW5ndGg7XG4gICAgICAgICAgaW1vZDQgPSArK2kgJSA0KSB7XG4gICAgICAgIGlmIChpbW9kNCA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgYnl0ZXMucHVzaCgoKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgJiAoTWF0aC5wb3coMiwgLTIgKiBpbW9kNCArIDgpIC0gMSkpIDw8IChpbW9kNCAqIDIpKVxuICAgICAgICAgICAgfCAoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpKSkgPj4+ICg2IC0gaW1vZDQgKiAyKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNyeXB0O1xufSkoKTtcbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNyeXB0ID0gcmVxdWlyZSgnY3J5cHQnKSxcclxuICAgICAgdXRmOCA9IHJlcXVpcmUoJ2NoYXJlbmMnKS51dGY4LFxyXG4gICAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpLFxyXG4gICAgICBiaW4gPSByZXF1aXJlKCdjaGFyZW5jJykuYmluLFxyXG5cclxuICAvLyBUaGUgY29yZVxyXG4gIG1kNSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICAvLyBDb252ZXJ0IHRvIGJ5dGUgYXJyYXlcclxuICAgIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09IFN0cmluZylcclxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGluZyA9PT0gJ2JpbmFyeScpXHJcbiAgICAgICAgbWVzc2FnZSA9IGJpbi5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbWVzc2FnZSA9IHV0Zjguc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgIGVsc2UgaWYgKGlzQnVmZmVyKG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWVzc2FnZSwgMCk7XHJcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlKSAmJiBtZXNzYWdlLmNvbnN0cnVjdG9yICE9PSBVaW50OEFycmF5KVxyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS50b1N0cmluZygpO1xyXG4gICAgLy8gZWxzZSwgYXNzdW1lIGJ5dGUgYXJyYXkgYWxyZWFkeVxyXG5cclxuICAgIHZhciBtID0gY3J5cHQuYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpLFxyXG4gICAgICAgIGwgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXHJcbiAgICAgICAgYSA9ICAxNzMyNTg0MTkzLFxyXG4gICAgICAgIGIgPSAtMjcxNzMzODc5LFxyXG4gICAgICAgIGMgPSAtMTczMjU4NDE5NCxcclxuICAgICAgICBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgICAvLyBTd2FwIGVuZGlhblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSAoKG1baV0gPDwgIDgpIHwgKG1baV0gPj4+IDI0KSkgJiAweDAwRkYwMEZGIHxcclxuICAgICAgICAgICAgICgobVtpXSA8PCAyNCkgfCAobVtpXSA+Pj4gIDgpKSAmIDB4RkYwMEZGMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFkZGluZ1xyXG4gICAgbVtsID4+PiA1XSB8PSAweDgwIDw8IChsICUgMzIpO1xyXG4gICAgbVsoKChsICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGw7XHJcblxyXG4gICAgLy8gTWV0aG9kIHNob3J0Y3V0c1xyXG4gICAgdmFyIEZGID0gbWQ1Ll9mZixcclxuICAgICAgICBHRyA9IG1kNS5fZ2csXHJcbiAgICAgICAgSEggPSBtZDUuX2hoLFxyXG4gICAgICAgIElJID0gbWQ1Ll9paTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XHJcblxyXG4gICAgICB2YXIgYWEgPSBhLFxyXG4gICAgICAgICAgYmIgPSBiLFxyXG4gICAgICAgICAgY2MgPSBjLFxyXG4gICAgICAgICAgZGQgPSBkO1xyXG5cclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgMF0sICA3LCAtNjgwODc2OTM2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDRdLCAgNywgLTE3NjQxODg5Nyk7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDcsICAxNzcwMDM1NDE2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krMTJdLCAgNywgIDE4MDQ2MDM2ODIpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDFdLCAgNSwgLTE2NTc5NjUxMCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDZdLCAgOSwgLTEwNjk1MDE2MzIpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA1XSwgIDUsIC03MDE1NTg2OTEpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzEwXSwgIDksICAzODAxNjA4Myk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDldLCAgNSwgIDU2ODQ0NjQzOCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTRdLCAgOSwgLTEwMTk4MDM2OTApO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsxM10sICA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDJdLCAgOSwgLTUxNDAzNzg0KTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgNV0sICA0LCAtMzc4NTU4KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDFdLCAgNCwgLTE1MzA5OTIwNjApO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krMTNdLCAgNCwgIDY4MTI3OTE3NCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgOV0sICA0LCAtNjQwMzY0NDg3KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDBdLCAgNiwgLTE5ODYzMDg0NCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDYsICAxNzAwNDg1NTcxKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgOF0sICA2LCAgMTg3MzMxMzM1OSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDYsIC0xNDU1MjMwNzApO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICAgIGEgPSAoYSArIGFhKSA+Pj4gMDtcclxuICAgICAgYiA9IChiICsgYmIpID4+PiAwO1xyXG4gICAgICBjID0gKGMgKyBjYykgPj4+IDA7XHJcbiAgICAgIGQgPSAoZCArIGRkKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3J5cHQuZW5kaWFuKFthLCBiLCBjLCBkXSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG4gIG1kNS5fZmYgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgYyB8IH5iICYgZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5fZ2cgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgZCB8IGMgJiB+ZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faGggID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2lpICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYyBeIChiIHwgfmQpKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcblxyXG4gIC8vIFBhY2thZ2UgcHJpdmF0ZSBibG9ja3NpemVcclxuICBtZDUuX2Jsb2Nrc2l6ZSA9IDE2O1xyXG4gIG1kNS5fZGlnZXN0c2l6ZSA9IDE2O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IG51bGwpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBhcmd1bWVudCAnICsgbWVzc2FnZSk7XHJcblxyXG4gICAgdmFyIGRpZ2VzdGJ5dGVzID0gY3J5cHQud29yZHNUb0J5dGVzKG1kNShtZXNzYWdlLCBvcHRpb25zKSk7XHJcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmFzQnl0ZXMgPyBkaWdlc3RieXRlcyA6XHJcbiAgICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLmFzU3RyaW5nID8gYmluLmJ5dGVzVG9TdHJpbmcoZGlnZXN0Ynl0ZXMpIDpcclxuICAgICAgICBjcnlwdC5ieXRlc1RvSGV4KGRpZ2VzdGJ5dGVzKTtcclxuICB9O1xyXG5cclxufSkoKTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhY2thZ2VOYW1lOiBzdHJpbmcgPSAnY29tLmNvbTJ1cy5uaW5lcGIzZC5ub3JtYWwuZnJlZWZ1bGwuZ29vZ2xlLmdsb2JhbC5hbmRyb2lkLmNvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVZZWFyTWluOiBudW1iZXIgPSAyMDIzO1xuZXhwb3J0IGNvbnN0IHNsZWVwU2hvcnQ6IG51bWJlciA9IDE1MDA7XG5leHBvcnQgY29uc3Qgc2xlZXBNZWRpdW06IG51bWJlciA9IDMwMDA7XG5leHBvcnQgY29uc3Qgc2xlZXBMb25nOiBudW1iZXIgPSA0MDAwO1xuZXhwb3J0IGNvbnN0IHNsZWVwV2FpdFBhZ2VMb25nOiBudW1iZXIgPSAyNCAqIDEwMDA7XG5leHBvcnQgY29uc3Qgc2xlZXBGb3JBZDogbnVtYmVyID0gMzAgKiAxMDAwO1xuZXhwb3J0IGNvbnN0IG1pbnV0ZUluTXM6IG51bWJlciA9IDYwICogMTAwMDtcbmV4cG9ydCBjb25zdCBob3VySW5NczogbnVtYmVyID0gbWludXRlSW5NcyAqIDYwO1xuZXhwb3J0IGNvbnN0IGRheUluTXM6IG51bWJlciA9IGhvdXJJbk1zICogMjQ7XG5leHBvcnQgY29uc3QgZHVyaW5nTWF4QWRSZXRyeTogbnVtYmVyID0gMzAwMDtcblxuZXhwb3J0IGNvbnN0IHN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWw6IG51bWJlciA9IDMwICogbWludXRlSW5NcztcbmV4cG9ydCBjb25zdCBzZW5kUnVubmluZ0V2ZW50SW50ZXJ2YWw6IG51bWJlciA9IDUgKiBtaW51dGVJbk1zO1xuZXhwb3J0IGNvbnN0IHNlbmRXYWl0SW5wdXRFdmVudEludGVydmFsOiBudW1iZXIgPSA1ICogbWludXRlSW5NcztcbmV4cG9ydCBjb25zdCB1cGxvYWRTZXNzaW9uSW50ZXJ2YWw6IG51bWJlciA9IDEgKiBob3VySW5NcztcbiIsImltcG9ydCB7IFV0aWxzLCBSb3V0ZUNvbmZpZyB9IGZyb20gJ1Jlcm91dGVyJztcbmltcG9ydCB7IHJlcm91dGVyLCBDb25maWcsIHN0YXRlIH0gZnJvbSAnLi9tb2R1bGVzJztcbmltcG9ydCB7IFRBU0ssIHdlZWtseU1pc3Npb24gfSBmcm9tICcuL3Rhc2tzJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmltcG9ydCAqIGFzIFBBR0UgZnJvbSAnLi9wYWdlcyc7XG5pbXBvcnQgeyBpc1NhbWVDb2xvciwgZ2V0Q29sb3JDb3VudEluUmFuZ2UsIGlzU2FtZUNvbG9yQ291bnQsIGFycmF5RmluZCwgU2F2ZVBhZ2VSZWZlcmVuY2UgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgVkVSU0lPTl9DT0RFOiBudW1iZXIgPSAxNS4zNztcblxuZXhwb3J0IGNsYXNzIE1MQjlJIHtcbiAgcHVibGljIHN0YXRpYyBwYWNrYWdlTmFtZTogc3RyaW5nID0gJ2NvbS5jb20ydXMubmluZXBiM2Qubm9ybWFsLmZyZWVmdWxsLmdvb2dsZS5nbG9iYWwuYW5kcm9pZC5jb21tb24nO1xuXG4gIGNvbnN0cnVjdG9yKGpzb25Db25maWc6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKCcjIyMjIyMjIyMjIyMgbmV3IE1MQjlJICMjIyMjIyMjIyMjIycpO1xuICAgIGNvbnNvbGUubG9nKGBzY3JpcHQgdmVyc2lvbiAke1ZFUlNJT05fQ09ERX1gKTtcbiAgICBzdGF0ZS5pbml0KGpzb25Db25maWcpO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0KCkge1xuICAgIGlmIChDb25maWcuY29uZmlnLmlzTG9jYWxQYWlkKSB7XG4gICAgICB2YXIgcGxhbiA9IGdldFVzZXJQbGFuKCk7XG4gICAgICBpZiAocGxhbiAhPSAndXNlcl9wbGFuX21sYjlpJykge1xuICAgICAgICBjb25zb2xlLmxvZygndXNlciBwbGFuIGlkOiAnLCBKU09OLnN0cmluZ2lmeShwbGFuKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwbGVhc2Ugc3Vic2NyaWJlIHByZW1pdW0gcGxhbicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGVzQW5kVGFza3MoKTtcbiAgICByZXJvdXRlci5zdGFydChNTEI5SS5wYWNrYWdlTmFtZSk7XG4gIH1cbiAgcHVibGljIHN0b3AoKSB7XG4gICAgcmVyb3V0ZXIuc3RvcCgpO1xuICAgIHN0YXRlLmVuZCgpO1xuICB9XG5cbiAgcHVibGljIGFkZFJvdXRlc0FuZFRhc2tzKCkge1xuICAgIHRoaXMuYWRkUm91dGVzKCk7XG4gICAgdGhpcy5oYW5kbGVVbmtub3duKCk7XG4gICAgLy8gcmVyb3V0ZXIuZ2V0Q3VycmVudE1hdGNoTmFtZXMoKTtcblxuICAgIGlmIChDb25maWcuY29uZmlnLmlzTG9jYWxQYWlkIHx8IENvbmZpZy5jb25maWcuaXNEZXYpIHtcbiAgICAgIHRoaXMuYWRkUHJlbWl1bVRhc2tzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICB0aGlzLmFkZEJhc2ljVGFza3MoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFDb25maWcuY29uZmlnLmxpY2Vuc2VJZCkge1xuICAgICAgY29uc29sZS5sb2coJ25vIGxpY2Vuc2UgaWQnKTtcbiAgICAgIHRoaXMuYWRkU3RheUluTG9naW5UYXNrcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWRkUHJlbWl1bVRhc2tzKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkQmFzaWNUYXNrcygpIHtcbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0sucGxheUxlYWd1ZUdhbWUsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDIsXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgYWRkUHJlbWl1bVRhc2tzKCkge1xuICAgIC8vIG9ubHkgcnVuIG9uY2VcbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0suc2V0dGluZ0RlZmF1bHQsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgICBtaW5Sb3VuZEludGVydmFsOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICAgIC8vIEZJWE1FOiB0aGlzIHNob3VsZCBvbmx5IHJ1biB3aGVuIG5lZWRlZFxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzcyxcbiAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IDEgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgICBiZWZvcmVSb3V0ZTogdGFzayA9PiB7XG4gICAgICAgIGlmICghc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcykge1xuICAgICAgICAgIHJldHVybiAnc2tpcFJvdXRlTG9vcCc7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmb3JjZVN0b3A6IHRydWUsXG4gICAgfSk7XG5cbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0sucGxheUxlYWd1ZUdhbWUsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDIsXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIENvbmZpZy5jb25maWcuaXNSdW5QbGF5QmF0dGxlR2FtZSAmJlxuICAgICAgcmVyb3V0ZXIuYWRkVGFzayh7XG4gICAgICAgIG5hbWU6IFRBU0sucGxheUJhdHRsZUdhbWUsXG4gICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgICAgbWF4VGFza0R1cmluZzogMTAgKiBDT05TVEFOVFMuaG91ckluTXMsXG4gICAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgd2Vla2x5TWlzc2lvbi5hZGRUYXNrKCk7XG4gICAgQ29uZmlnLmNvbmZpZy5pc1J1bkFkUmV3YXJkICYmXG4gICAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgICAgbmFtZTogVEFTSy5hZFJld2FyZCxcbiAgICAgICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgICAgICBtaW5Sb3VuZEludGVydmFsOiBDT05TVEFOVFMubWludXRlSW5NcyAqIDMwLFxuICAgICAgICBmaW5kUm91dGVEZWxheTogQ09OU1RBTlRTLnNsZWVwTWVkaXVtLFxuICAgICAgICBtYXhUYXNrRHVyaW5nOiBDT05TVEFOVFMuc2xlZXBGb3JBZCArIENPTlNUQU5UUy5kdXJpbmdNYXhBZFJldHJ5LFxuICAgICAgICBmb3JjZVN0b3A6IHRydWUsXG4gICAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5yZXN0YXJ0QXBwUGVyRGF5LFxuICAgICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgICAgbWluUm91bmRJbnRlcnZhbDogQ09OU1RBTlRTLmRheUluTXMsXG4gICAgICBiZWZvcmVSb3V0ZTogdGFzayA9PiB7XG4gICAgICAgIGlmICh0YXNrLmxhc3RSdW5UaW1lICE9PSAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3RhcnQgYXBwIHRhc2snKTtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgIH0sXG4gICAgICBtYXhUYXNrRHVyaW5nOiAzMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRTdGF5SW5Mb2dpblRhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5zdGF5SW5Mb2dpbixcbiAgICAgIGZvcmNlU3RvcDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzKCkge1xuICAgIC8vICoqIGxhdW5jaGluZyBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxvZ28ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubG9nbyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3YWl0IGFwcCBsb2FkaW5nIC4uLicpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcblxuICAgICAgICAvLyByZW9wZW4gaWYgc3R1Y2tcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKG5vdyAtIGNvbnRleHQubWF0Y2hTdGFydFRTID4gNSAqIENPTlNUQU5UUy5taW51dGVJbk1zKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0dWNrIGluIGxhdW5jaCBwYWdlIHRvbyBsb25nLCByZXN0YXJ0IGFwcCcpO1xuICAgICAgICAgIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sYW5kaW5nTG9hZGluZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sYW5kaW5nTG9hZGluZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oXyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsYW5kaW5nIGxvYWRpbmcuLi4nKTtcbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcbiAgICAgIH0pLFxuICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwTWVkaXVtLFxuICAgIH0pO1xuICAgIFtQQUdFLmRvd25sb2FkRGF0YSwgUEFHRS5wcm9ncmVzc0JhclJ1bm5pbmddLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiBDT05TVEFOVFMuc2xlZXBMb25nLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgW1BBR0UuVE9TLCBQQUdFLlRPUzkwLCBQQUdFLlRPUzkwdjJdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAqKiBsb2dpbiBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxhbmRpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGFuZGluZyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5vbkxvZ2luUGFnZSgpO1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0suc3RheUluTG9naW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLnN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIGhpdmUgbG9naW4gZm9yIGF2b2lkIGFwcCBjcnVzaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGFuZGluZyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxvZ2luU2VsZWN0V2F5fWAsXG4gICAgICBtYXRjaDogUEFHRS5sb2dpblNlbGVjdFdheSxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnN0YXlJbkxvZ2luKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubG9naW5TZWxlY3RXYXkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayB0aGUgZGlyZWN0aW9uIHRvIGdvIGJ5IHByZXZpb3VzIHBhZ2VcbiAgICAgICAgbGV0IGlzR29OZXh0ID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoIChjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aC5zdWJzdHJpbmcoMSkpIHtcbiAgICAgICAgICBjYXNlIFBBR0UubG9nSW5IaXZlLm5hbWU6XG4gICAgICAgICAgY2FzZSBQQUdFLmxvZ0luSGl2ZTkwLm5hbWU6XG4gICAgICAgICAgICBpc0dvTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0dvTmV4dCkge1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxvZ2luU2VsZWN0V2F5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygna2V5Y29kZSBiYWNrJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgW1BBR0UubG9nSW5IaXZlLCBQQUdFLmxvZ0luSGl2ZTkwXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IGNvbnRleHQgPT4ge1xuICAgICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG5lZWRVc2VySW5wdXQgPSBjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5zdGF5SW5Mb2dpbjtcbiAgICAgICAgICBzdGF0ZS5vbkxvZ2luUGFnZShuZWVkVXNlcklucHV0KTtcblxuICAgICAgICAgIGlmICghbmVlZFVzZXJJbnB1dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICAgIGtleWNvZGUoJ0JBQ0snLCAxMDApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2tleWNvZGUgYmFjaycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLnN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIGJhY2sgZm9yIGF2b2lkIHNlc3Npb24gZXhwaXJlZCcpO1xuICAgICAgICAgIGtleWNvZGUoJ0JBQ0snLCAxMDApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdrZXljb2RlIGJhY2snKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFtQQUdFLmZiTG9nSW45MCwgUEFHRS5nb29nbGVMb2dJbjkwXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246ICdrZXljb2RlQmFjaycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICoqIG1haW5cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5tYWluLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm1haW4sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc3QgdGFzayA9IGNvbnRleHQudGFzay5uYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXNrKTtcblxuICAgICAgICBzd2l0Y2ggKHRhc2spIHtcbiAgICAgICAgICBjYXNlIFRBU0suc3RheUluTG9naW46XG4gICAgICAgICAgICAvLyBzaG91bGQgYmUgaW5hY2Nlc3NpYmxlIHVubGVzcyBjbGVhciBzZXNzaW9uIGlzIGZhaWxlZFxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdEZWZhdWx0OlxuICAgICAgICAgIGNhc2UgVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzczpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5zZXR0aW5ncyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5sZWFndWVNb2RlKTtcbiAgICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cysrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlCYXR0bGVHYW1lOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmJhdHRsZU1vZGUpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFRBU0suYWRSZXdhcmQ6XG4gICAgICAgICAgICAvLyBzb21ldGltZXMgd29uJ3QgdHJpZ2dlciBhbnl0aGluZyBpZiBzdGlsbCBvbiBjZFxuICAgICAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA+IDIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkIGlzIHN0aWxsIG9uIGNkJyk7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmFkVGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgVEFTSy53ZWVrbHlNaXNzaW9uOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmFjaGlldmVtZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLm9uTG9naW5TdWNjZXNzKCk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vICoqIGdhbWUgc2V0dGluZ1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNldHRpbmdzLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNldHRpbmdzLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnN0IGluYWN0aXZlVGFiQ29sb3IgPSB7IHI6IDU4LCBnOiA2NSwgYjogNzQgfTtcbiAgICAgICAgY29uc3QgdGFiID0gYXJyYXlGaW5kKE9iamVjdC5rZXlzKFBBR0Uuc2V0dGluZ3NUYWJzKSwgdCA9PiB7XG4gICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBQQUdFLnNldHRpbmdzVGFic1t0IGFzIGtleW9mIHR5cGVvZiBQQUdFLnNldHRpbmdzVGFic107XG4gICAgICAgICAgcmV0dXJuICFpc1NhbWVDb2xvcihpbWFnZSwgeyB4LCB5LCAuLi5pbmFjdGl2ZVRhYkNvbG9yIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdEZWZhdWx0OlxuICAgICAgICAgICAgaWYgKHRhYiA9PT0gJ2dyYXBoaWNUYWInKSB7XG4gICAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZXR0aW5nc0dyYXBoVGFiQnRucy5wb3dlclNhdmVPbik7XG4gICAgICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZ28gdG8gZ3JhcGhpY1RhYlxuICAgICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2V0dGluZ3NUYWJzLmdyYXBoaWNUYWIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzOlxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzKSB7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdvIHRvIGxlYWd1ZVJlc2V0RGlhbG9nXG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2V0dGluZ3NCdG5zLmxlYWd1ZVJlc2V0KTtcbiAgICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnNldHRpbmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vICoqIGFkIHJld2FyZFxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmFkUmV3YXJkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmFkUmV3YXJkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbihjb250ZXh0ID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLmFkUmV3YXJkKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UuYWRSZXdhcmQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCd3YXRjaCBhZCcpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5hZFJld2FyZCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcEZvckFkKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmFkUmV3YXJkUmVkZWVtLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmFkUmV3YXJkUmVkZWVtLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhZCByZXdhcmQgZ2V0Jyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmFkUmV3YXJkUmVkZWVtKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0suYWRSZXdhcmQpIHtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYWRSZXdhcmRPbkNELm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmFkUmV3YXJkT25DRCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnYWQgaXMgc3RpbGwgY2QnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UuYWRSZXdhcmRPbkNEKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0suYWRSZXdhcmQpIHtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyAqKiB3ZWVrbHkgbWlzc2lvblxuICAgIHdlZWtseU1pc3Npb24uYWRkUm91dGVzKCk7XG5cbiAgICAvLyAqKiBwbGF5QmF0dGxlR2FtZVxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmJhdHRsZU1vZGVQYW5lbC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5iYXR0bGVNb2RlUGFuZWwsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UuYmF0dGxlTW9kZVBhbmVsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogY2hlY2sgaWYgcGxheSBvdGhlciBtb2RlIHRvb1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UuYmF0dGxlTW9kZVBhbmVsQnRucy5yYW5rZWRCYXR0bGUpO1xuICAgICAgICBjb25zb2xlLmxvZygncGxheSByYW5rZWQgYmF0dGxlJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5yYW5rZWRCYXR0bGVQYW5lbC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVQYW5lbCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVQYW5lbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2Fubm90IHBsYXlcbiAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA+IDUpIHtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBpZiBwbGF5IGlzIGF2YWlsYWJsZVxuICAgICAgICBjb25zdCBpc1BsYXlEaXNhYmxlZCA9IGlzU2FtZUNvbG9yKGltYWdlLCBQQUdFLnJhbmtlZEJhdHRsZVBhbmVsQnRucy5kaXNhYmxlZFBsYXlCdG4pO1xuICAgICAgICBpZiAoaXNQbGF5RGlzYWJsZWQpIHtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmFua2VkIGJhdHRsZSBwbGF5IGRpc2FibGVkJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UucmFua2VkQmF0dGxlUGFuZWwpO1xuICAgICAgICBjb25zb2xlLmxvZygncGxheSByYW5rZWQgYmF0dGxlIChzaW5nbGUpJyk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSA9PT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdwbGF5IHJhbmsgZ2FtZSBkaXNhYmxlZCcpO1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnJhbmtlZEJhdHRsZVdhaXRUb1JlZnJlc2gpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlR2FtZUluZm8ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBbUEFHRS5yYW5rZWRCYXR0bGVSZXN1bHQsIFBBR0UucmFua2VkQmF0dGxlV2Vla2x5UmFua2tpbmddLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hdXRvR2FtZUNvbmZpcm0ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYXV0b0dhbWVDb25maXJtLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmF1dG9HYW1lQ29uZmlybSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmF1dG9HYW1lQ29uZmlybSk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hdXRvR2FtZUNvbmZpcm1FbmQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYXV0b0dhbWVDb25maXJtRW5kLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmF1dG9HYW1lQ29uZmlybUVuZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmF1dG9HYW1lQ29uZmlybUVuZCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mby5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIFtQQUdFLnJlY2hhcmdlQmFsbFJhbmtNb2RlLCBQQUdFLnJlY2hhcmdlQmFsbExlYWd1ZU1vZGVdLmZvckVhY2gocCA9PlxuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY29udGludWU6IHJlY2hhcmdlIGJhbGwgbmVlZGVkJyk7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhwKTtcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyAqKiBwbGF5TGVhZ3VlTW9kZVxuICAgIC8vIGVudGVyIGdhbWUgaW5mb1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVQYW5lbC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVNb2RlUGFuZWwsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlTW9kZVBhbmVsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYW4gcGxheSBsZWFndWUgbW9kZVxuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMrKztcblxuICAgICAgICAvLyBhdm9pZCB0byBjbGljayBidG4gdG9vIG1hbnkgdGltZSBmb3IgdHJpZ2dlciBuZXh0IHBhZ2UgaW1tZWRpYXRlbHlcbiAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA8IDIpIHtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVNb2RlUGFuZWwpO1xuICAgICAgICB9XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVHYW1lSW5mby5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVNb2RlR2FtZUluZm8sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlTW9kZUdhbWVJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2sgZW5lcmd5Jyk7XG4gICAgICAgIGNvbnN0IGVtcHR5RW5lcmd5ID0geyB4OiA1NTEsIHk6IDI4MSwgcjogMywgZzogMTI0LCBiOiAyMTMgfTtcbiAgICAgICAgY29uc3QgaGFzRW5lcmd5MCA9IGlzU2FtZUNvbG9yKGltYWdlLCBlbXB0eUVuZXJneSwgMC45KTtcbiAgICAgICAgaWYgKGhhc0VuZXJneTApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZW5lcmd5Jyk7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlnaXQxID0geyB4OiA1NjEsIHk6IDI3OCwgcjogMTY5LCBnOiAxNzIsIGI6IDE3OSB9O1xuICAgICAgICBjb25zdCBoYXNFbmVyZ3kxMCA9IGlzU2FtZUNvbG9yKGltYWdlLCBkaWdpdDEpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGFzMTBFbmVyZ3k6JywgaGFzRW5lcmd5MTApO1xuXG4gICAgICAgIC8vIHVzZSBxdWljayBwbGF5IHdoZW4gaGFzIDEwKyBlbmVyZ3ksXG4gICAgICAgIC8vIGFuZCBzbG93IHBsYXkgd2hlbiBoYXMgMTAtIGVuZXJneVxuICAgICAgICBjb25zdCBxdWlja1BsYXlPbkJ0biA9IHsgeDogMzcsIHk6IDI4NCwgcjogMzMsIGc6IDI1NSwgYjogMTQwIH07XG4gICAgICAgIGNvbnN0IGlzUXVpY2tQbGF5T24gPSBpc1NhbWVDb2xvcihpbWFnZSwgcXVpY2tQbGF5T25CdG4pO1xuXG4gICAgICAgIGlmIChoYXNFbmVyZ3kxMCAmJiAhaXNRdWlja1BsYXlPbikge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAocXVpY2tQbGF5T25CdG4pOyAvLyBzZWxlY3QgcXVpY2sgcGxheVxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9uIHF1aWNrIHBsYXknKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc0VuZXJneTEwICYmIGlzUXVpY2tQbGF5T24pIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHF1aWNrUGxheU9uQnRuKTsgLy8gY2FuY2VsIHF1aWNrIHBsYXlcbiAgICAgICAgICBjb25zb2xlLmxvZygndHVybiBvZmYgcXVpY2sgcGxheScpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlTW9kZUdhbWVJbmZvKTsgLy8gcGxheSBiYWxsXG4gICAgICAgIGNvbnNvbGUubG9nKCdwbGF5IGxlYWd1ZSBtb2RlIGdhbWUnKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCB0aGluZ3NcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RQbGF5Um9sZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RQbGF5Um9sZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCBwbGF5IHJvbGUnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0UGxheVJvbGUpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0WWVhci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RZZWFyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IHllYXIgcGFnZScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3RZZWFyKTtcblxuICAgICAgICAvLyBnbyB0byB0aGUgbWluIHllYXJcbiAgICAgICAgY29uc3QgYWN0aXZlQnV0dG9uID0ge1xuICAgICAgICAgIHg6IFBBR0Uuc2VsZWN0WWVhckJ0bnMucHJldlllYXIueCxcbiAgICAgICAgICB5OiBQQUdFLnNlbGVjdFllYXJCdG5zLnByZXZZZWFyLnksXG4gICAgICAgICAgcjogNDksXG4gICAgICAgICAgZzogODUsXG4gICAgICAgICAgYjogMTIzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBpc05vdE1pblllYXIgPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3IoYWN0aXZlQnV0dG9uKTtcbiAgICAgICAgZm9yIChsZXQgcmVtYWluQ2xpY2sgPSAxMjsgcmVtYWluQ2xpY2sgPiAwICYmIGlzTm90TWluWWVhcjsgcmVtYWluQ2xpY2stLSkge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RZZWFyQnRucy5wcmV2WWVhcik7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgIGlzTm90TWluWWVhciA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihhY3RpdmVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdGhlIGRpZmYsIHJldHVybiB0byBwcmV2IHllYXJcbiAgICAgICAgZm9yICh2YXIgeWVhckRpZmYgPSBDb25maWcuY29uZmlnLmxlYWd1ZVllYXIgLSBDT05TVEFOVFMubGVhZ3VlWWVhck1pbjsgeWVhckRpZmYgPiAwOyB5ZWFyRGlmZi0tKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdFllYXJCdG5zLm5leHRZZWFyKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdWJtaXQgY2hhbmdlc1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0WWVhckJ0bnMuc3VibWl0KTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0U2Vhc29uTW9kZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RTZWFzb25Nb2RlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IHNlYXNvbiBwYWdlJyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdFNlYXNvbk1vZGUpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY4LCB5OiAzMzMgfSk7IC8vIG5vcm1hbCBtb2RlXG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgLy8gVE9ETyBzcGxpdCBwYWdlXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAzMzIsIHk6IDMwMSB9KTsgLy8gbmV4dCBzZWFzb25cbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50Lm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3QgbGVhZ3VlIGdhbWUgYW1vdW50IHBhZ2UnKTtcbiAgICAgICAgLy8gdXNlIGNvbmZpZyB1c2VyIHNldHRlZCB0byBzZWxlY3Qgd2hpY2ggdGhleSB3YW50IHRvIHBsYXlcbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBoYWxmLCBxdWFydGVyLCBmdWxsIGhhcyAyIG5leHQgcGFnZVxuICAgICAgICBzd2l0Y2ggKENvbmZpZy5jb25maWcubGVhZ3VlU2Vhc29uTW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2Z1bGwnOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCBmdWxsIGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLmZ1bGwpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdoYWxmJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgMS8yIGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLmhhbGYpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICAvLyA/IHdpbGwgZ28gdG8gb2sgLyBuZXh0IHBhZ2VzXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgMS80IGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLnF1YXJ0ZXIpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICAvLyA/IHdpbGwgZ28gdG8gb2sgLyBuZXh0IHBhZ2VzXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwb3N0U2Vhc29uJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgcG9zdFNlYXNvbicpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLnBvc3QpO1xuICAgICAgICAgICAgLy8gPyB3aWxsIGdvIHRvIG9rIC8gbmV4dCBwYWdlc1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBzZWFzb24gbmV3LyBlbmRcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5uZXdTZWFzb24ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubmV3U2Vhc29uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZW5kU2Vhc29uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmVuZFNlYXNvbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmVuZFNlYXNvblByb2NlZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZW5kU2Vhc29uUHJvY2VlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIGVuZCBzZWFzb24gcHJvY2VlZCcpO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMTgyLCB5OiAxNzggfSk7IC8vIHRhcCBuZXcgc2Vhc29uIG9mIGxlZnRcbiAgICAgICAgLy8gd2lsbCBnbyB0byBlbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWRcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmVuZFNlYXNvblByb2NlZWRTZWxlY3RlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5lbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3Qgbm9ybWFsIC8gbWFzdGVyIG1vZGUnKTtcblxuICAgICAgICAvLyBpZiBjYW5ub3Qgc2VsZWN0IG1hc3RlciBtb2RlLCBhdCBsZWFzdCBzZWxlY3Qgbm9ybWFsIG1vZGVcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVCdG5zLm5vcm1hbCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVCdG5zLm1hc3Rlcik7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgLy8gd2hldGhlciBjaG9vc2UgYW55IG1vZGUsIHdpbGwganVtcCB0byBwcm9jZWVkIHBhZ2VcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZSk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmVzZXREaWFsb2dZTixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHJlc2V0IGxlYWd1ZSBkaWFsb2cgd2l0aCB5ZXMvbm8nKTtcblxuICAgICAgICAvLyBUT0RPOiBsZXQgdXNlciBjaG9vc2UgaW4gY29uZmlnXG4gICAgICAgIGlmIChjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCA9PT0gYC8ke1BBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQubmFtZX1gKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Jlc2V0IGxlYWd1ZSBtb2RlJyk7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlUmVzZXREaWFsb2dZTik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90IHJlc2V0XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXNldERpYWxvZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVSZXNldERpYWxvZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0suc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAvLyBjYW5jZWxcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVSZXNldERpYWxvZyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgcmVzZXQgbGVhZ3VlIGRpYWxvZycpO1xuICAgICAgICAvLyBUT0RPOiBsZXQgdXNlciBjYW4gc2VsZWN0IHNwZWNpZmljIG1vZGUgYW5kIHllYXIgdG8gcGxheVxuICAgICAgICAvLyByZXNldFxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVSZXNldERpYWxvZyk7XG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvcixcbiAgICAgIGFjdGlvbjogKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgaWYgKCFDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc29tZXRpbWVzIHNvbWUgdW5rbm93biByZWFzb24gY2Fubm90IGVudGVyIGdhbWVcbiAgICAgICAgICAgIGNvbnN0IHsgdHJ5RW50ZXJHYW1lQ250cyB9ID0gc3RhdGUubGVhZ3VlR2FtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cnkgZW50ZXIgZ2FtZSBjbnRzJywgdHJ5RW50ZXJHYW1lQ250cyk7XG4gICAgICAgICAgICBpZiAodHJ5RW50ZXJHYW1lQ250cyA9PT0gMykge1xuICAgICAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ5RW50ZXJHYW1lQ250cyA+IDMpIHtcbiAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgcmVzb2x2ZWQgYnkgcmVzZXR0aW5nIGxlYWd1ZSBtb2RlIHByb2dyZXNzXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGVSZXNldExlYWd1ZU1vZGVQcm9ncmVzcycpO1xuXG4gICAgICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIG90aGVyXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZUxpbmVVcC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lTGluZVVwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucGxheWVyR3Jvd3RoQ29tcGxldGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucGxheWVyR3Jvd3RoQ29tcGxldGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5waXRjaGVyT2ZUaGVNb250aC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5waXRjaGVyT2ZUaGVNb250aCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm12cC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5tdnAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZU12cFBhZ2UnKTtcbiAgICAgICAgY29uc3Qgb2tCdG4gPSB7IHg6IDU2OCwgeTogMzIwLCByOiA1MiwgZzogMTIwLCBiOiAyMTAgfTtcbiAgICAgICAgbGV0IGlzT2tCdG5PblNjcmVlbiA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihva0J0bik7XG5cbiAgICAgICAgLy8gb2sgYnV0dG9uIHN0aWxsIG9uIHRoZSBzY3JlZW5cbiAgICAgICAgZm9yICh2YXIgbWF4T2tCdXR0b25SZW1haW4gPSAxMDsgaXNPa0J0bk9uU2NyZWVuICYmIG1heE9rQnV0dG9uUmVtYWluID4gMDsgbWF4T2tCdXR0b25SZW1haW4tLSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLm12cCk7IC8vIG9rXG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgICBpc09rQnRuT25TY3JlZW4gPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3Iob2tCdG4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV3YXJkIGJvbnVzIHBsYXllciBwb3B1cFxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMzIyLCB5OiAzMDkgfSk7IC8vIGNsaWNrIG5leHRcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gZ2FtZSBvdmVyXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0LFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbXBsZXRlIGEgZ2FtZScpO1xuICAgICAgICAgICAgZmluaXNoUm91bmQoKTtcbiAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmdhbWVSZXN1bHQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdEFxdWlyZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJlc3VsdEFxdWlyZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmVzdWx0V29ybGRDaGFtcGlvbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0V29ybGRDaGFtcGlvbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXN1bHRPdGhlci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0T3RoZXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXAnKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gZ2FtZSByZXdhcmQgcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmV3YXJkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXdhcmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlQm9udXNQbGF5ZXIubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYmVzdFBvc2l0aW9uQXdhcmRCb251c0dyb3VwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmJlc3RQb3NpdGlvbkF3YXJkQm9udXNHcm91cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmJvbnVzR3JhbnRlZEJ5VGVhbVJlY29yZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5ib251c0dyYW50ZWRCeVRlYW1SZWNvcmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5wb3N0U2Vhc29uQXdhcmRCb251cy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5wb3N0U2Vhc29uQXdhcmRCb251cyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdFJld2FyZFBsYXllci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZVNlbGVjdFJld2FyZFBsYXllcicpO1xuICAgICAgICBsZXQgYmVzdENhcmRSYW5rID0gLTE7XG4gICAgICAgIGxldCBiZXN0Q2FyZFBvcyA9IFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyQnRuc1swXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBvcyBvZiBQQUdFLnNlbGVjdFJld2FyZFBsYXllckJ0bnMpIHtcbiAgICAgICAgICBjb25zdCByZ2IgPSBnZXRJbWFnZUNvbG9yKGltYWdlLCBwb3MueCwgcG9zLnkpO1xuICAgICAgICAgIGNvbnN0IGsgPSByZ2IuciArICctJyArIHJnYi5nICsgJy0nICsgcmdiLmI7XG4gICAgICAgICAgY29uc29sZS5sb2cocG9zLngsIHBvcy55LCBrKTtcbiAgICAgICAgICAvLyBzZWxlY3QgaWYgbm90IGluIGJhc2ljIHR5cGVcbiAgICAgICAgICBjb25zdCByYW5rID0gUEFHRS5wbGF5ZXJDYXJkQ29sb3JUb1Jhbmtba10gPz8gNTtcbiAgICAgICAgICBpZiAocmFuayA+IGJlc3RDYXJkUmFuaykge1xuICAgICAgICAgICAgYmVzdENhcmRSYW5rID0gcmFuaztcbiAgICAgICAgICAgIGJlc3RDYXJkUG9zID0gcG9zO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoYmVzdENhcmRQb3MpO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0JywgYmVzdENhcmRQb3MueCwgYmVzdENhcmRQb3MueSk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gb24gcGxheSBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUXVpY2tQbGF5R3JvdXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uub25RdWlja1BsYXlHcm91cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnb24gcXVpY2sgcGxheWluZycpO1xuXG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSA9PT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIHN1Y2Nlc3MgZW50ZXIgZ2FtZVxuICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUub25SdW5uaW5nKHRydWUpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5vblF1aWNrUGxheUdyb3VwKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUXVpY2tQbGF5UGF1c2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uub25RdWlja1BsYXlQYXVzZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUGxheVBvd2VyU2F2ZU9uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm9uUGxheVBvd2VyU2F2ZU9uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIC8vIHRoaXMgaXMgc2hhcmUgYmV0d2VlbiBhbGwgbW9kZVxuICAgICAgICBsZXQgaXNPblBsYXlUYXNrID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgaXNPblBsYXlUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSB8fCAhaXNPblBsYXlUYXNrIHx8IHJlcm91dGVyLmlzUGFnZU1hdGNoKFBBR0UucG93ZXJTYXZpbmcpKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVQb3dlclNhdmluZ1BhZ2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCB7IGxhc3RDaGVja1Bvd2VyU2F2ZUF0OiBsYXN0Q2hlY2tUaW1lQXQsIHBvd2VyU2F2ZUNvbG9yQ291bnQ6IGNvbG9yQ291bnQgfSA9IHN0YXRlLmxlYWd1ZUdhbWU7XG4gICAgICAgIGlmIChub3cgLSBsYXN0Q2hlY2tUaW1lQXQgPCBDT05TVEFOVFMuc2VuZFJ1bm5pbmdFdmVudEludGVydmFsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXNlIHRpbWUgdG8gY2hlY2sgd2hldGhlciBnYW1lIGlzIHN0aWxsIHBsYXlpbmdcbiAgICAgICAgY29uc3QgY29sb3JDbnROb3cgPSBnZXRDb2xvckNvdW50SW5SYW5nZShpbWFnZSwgeyB4OiAzMzEsIHk6IDMxMCB9LCB7IHg6IDQwMywgeTogMzExIH0pO1xuICAgICAgICBjb25zdCBpc1NhbWUgPSBpc1NhbWVDb2xvckNvdW50KGNvbG9yQ250Tm93LCBjb2xvckNvdW50KTtcblxuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLmxhc3RDaGVja1Bvd2VyU2F2ZUF0ID0gbm93O1xuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnBvd2VyU2F2ZUNvbG9yQ291bnQgPSBjb2xvckNudE5vdztcblxuICAgICAgICBpZiAoIWlzU2FtZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGlzIHN0aWxsIHBsYXlpbmcgd2l0aCBwb3dlciBzYXZlIG9uJyk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2dhbWUgaXMgc3R1Y2snKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3Vwcy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZHcm91cHMsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgLy8gcGFnZSB3aWxsIGJlIHN0b3BwZWQgaGVyZSBpbiBhbnkgdGFza3NcbiAgICAgICAgLy8gbmVlZCB0byBoYW5kbGUgaW1tZWRpYXRlbHkgaWYgbWF0Y2hcbiAgICAgICAgZm9yIChjb25zdCBwYWdlT3JHcm91cCBvZiBtYXRjaGVkKSB7XG4gICAgICAgICAgaWYgKHBhZ2VPckdyb3VwLm5hbWUgPT09IFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmU3RvcHBlZC5uYW1lKSB7XG4gICAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIHR1cm4gb2ZmIGF1dG9wbGF5IHRvIHJldHVyblxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZik7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdWNjZXNzIGVudGVyIGdhbWVcbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzID0gMDtcblxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgcXVpY2sgc3dpdGNoIHRvIGF1dG8gcGxheSBvZmYgaWYgd2FzIHN0b3BwZWRcbiAgICAgICAgaWYgKENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygndHVybiBvbiBwb3dlciBzYXZlIHBsYXknKTtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmYpO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFwJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIG9wZW4gcGF1c2UgcGFuZWxcbiAgICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICAgIC8vIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9uIGF1dG8gcGxheScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXApO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlT25QbGF5UGF1c2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlT25QbGF5UGF1c2UsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgLy8gb3BlbiBwYXVzZSBwYW5lbFxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheVBhdXNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29udGludWUgcGxheVxuICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICBjb25zb2xlLmxvZygndGFwIGJhY2sgdG8gc3RheSBpbiBnYW1lJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVDb250aW51ZVBsYXlpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlQ29udGludWVQbGF5aW5nLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG5cbiAgICAvLyAqKiBnZW5lcmFsIHBhZ2VzXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucG93ZXJTYXZpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucG93ZXJTYXZpbmcsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb3dlclNhdmluZ1BhZ2UoKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIFtQQUdFLmVycm9yTmV3VXBkYXRlQXZhaWxhYmxlLCBQQUdFLmFwcElzTm90UmVzcG9uZGluZ10uZm9yRWFjaChwID0+IHtcbiAgICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgICAgcGF0aDogYC8ke3AubmFtZX1gLFxuICAgICAgICBtYXRjaDogcCxcbiAgICAgICAgYWN0aW9uOiAnZ29OZXh0JyxcbiAgICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwV2FpdFBhZ2VMb25nLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBbXG4gICAgICBQQUdFLnVuZXhwZWN0ZWRFcnJvcixcbiAgICAgIFBBR0UucmV2aWV3QXBwLFxuICAgICAgUEFHRS5wcm9tb3Rpb24xLFxuICAgICAgUEFHRS5wcm9tb3Rpb24yLFxuICAgICAgUEFHRS5wcm9tb3Rpb24zLFxuICAgICAgUEFHRS5yZWNoYXJnZVByb21vdGlvbixcbiAgICAgIFBBR0UudGVhbVN1cHBvcnRQYWNrYWdlUHJvbW90aW9uLFxuICAgICAgUEFHRS5lbnRlckdhbWVQcm9tb3Rpb24sXG4gICAgICBQQUdFLmV2ZW50LFxuICAgICAgUEFHRS5vayxcbiAgICAgIFBBR0UubmV4dCxcbiAgICAgIFBBR0UuY29uZmlybVdpdGhZUyxcbiAgICAgIFBBR0UucXVpdEFwcCxcbiAgICAgIFBBR0UucXVpdEFwcDEsXG4gICAgXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVVua25vd24oKSB7XG4gICAgcmVyb3V0ZXIuYWRkVW5rbm93bkFjdGlvbigoY29udGV4dCwgaW1hZ2UsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAvLyByZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpO1xuICAgICAgY29uc3QgbGFzdE1hdGNoZWRQYXRoID0gY29udGV4dC5sYXN0TWF0Y2hlZFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgVXRpbHMubG9nKGB1bmtub3duIGNvdW50ICR7Y29udGV4dC5tYXRjaFRpbWVzfSwgZHVyaW5nICR7Y29udGV4dC5tYXRjaER1cmluZ30sIGxhc3QgbWF0Y2hlZDogJHtsYXN0TWF0Y2hlZFBhdGh9YCk7XG4gICAgICBjb25zdCBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICAgICAgaWYgKCFpc0luQXBwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdub3QgaW4gYXBwJyk7XG4gICAgICAgIGlmIChDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlKSB7XG4gICAgICAgICAgcmVyb3V0ZXIucmVzdGFydEFwcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhc3RNYXRjaGVkUGF0aCA9PT0gUEFHRS5hZFJld2FyZC5uYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNsb3NlQWQoKTtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICBpZiAoY29udGV4dC5tYXRjaER1cmluZyA8IENPTlNUQU5UUy5taW51dGVJbk1zICogMikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ21pZ2h0IGJlIGluIHBsYXlpbmcgYW5pbWF0aW9uJyk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMCwgeTogMCB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXAnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5pc1dhaXRpbmdMb2dpbikge1xuICAgICAgICBjb25zb2xlLmxvZygnd2FpdCB1c2VyIGlucHV0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICBjb25zb2xlLmxvZygndGFwJyk7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgJSAxMSA9PT0gMCkge1xuICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICBVdGlscy5sb2coJ2tleWNvZGUgYmFjayBmb3IgdW5rbm93bicpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRleHQubWF0Y2hEdXJpbmcgPiBDT05TVEFOVFMubWludXRlSW5NcyAqIDMwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdHVjayBpbiB1bmtub3duIHBhZ2UgbW9yZSB0aGFuIDMwIG1pbicpO1xuICAgICAgICBDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVDbG9zZUFkKCkge1xuICAgIGNvbnNvbGUubG9nKCd0cnkgY2xvc2UgYWQnKTtcbiAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICBjb25zb2xlLmxvZygna2V5IGNvZGUgYmFjaycpO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgaWYgKHJlcm91dGVyLmdldEN1cnJlbnRNYXRjaE5hbWVzKCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdHJ5IHRhcCBjbG9zZSBidG5cbiAgICBmb3IgKGNvbnN0IGNsb3NlQnRuIG9mIFtcbiAgICAgIC8vIHJpZ2h0XG4gICAgICB7IHg6IDYyMiwgeTogMTkgfSxcblxuICAgICAgLy8gbGVmdFxuICAgICAgeyB4OiA4LCB5OiAxNSB9LFxuICAgIF0pIHtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoY2xvc2VCdG4pO1xuICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgaGFuZGxlUG93ZXJTYXZpbmdQYWdlKCkge1xuICAgIGNvbnNvbGUubG9nKCdoYW5kbGVQb3dlclNhdmluZ1BhZ2UnKTtcbiAgICByZXJvdXRlci5zY3JlZW4udGFwRG93bih7IHg6IDEwMCwgeTogMTgwIH0pO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgcmVyb3V0ZXIuc2NyZWVuLm1vdmVUbyh7IHg6IDUwMCwgeTogMTgwIH0pO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgcmVyb3V0ZXIuc2NyZWVuLnRhcFVwKHsgeDogNTAwLCB5OiAxODAgfSk7XG4gICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgfVxuXG4gIHB1YmxpYyB3cmFwUm91dGVBY3Rpb24oYWN0aW9uOiBSb3V0ZUNvbmZpZ1snYWN0aW9uJ10pOiBSb3V0ZUNvbmZpZ1snYWN0aW9uJ10ge1xuICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnd3JhcFJvdXRlQWN0aW9uJywgY29udGV4dC50YXNrLm5hbWUsIG1hdGNoZWRbMF0ubmFtZSk7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhY3Rpb24oY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT09ICdnb05leHQnKSB7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChtYXRjaGVkWzBdKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT09ICdnb0JhY2snKSB7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhtYXRjaGVkWzBdKTtcbiAgICAgIH1cblxuICAgICAgLy8gdXBsb2FkIHNlc3Npb24gaWYgbmVlZGVkXG4gICAgICBzdGF0ZS5jaGVja1VwbG9hZFNlc3Npb24oKTtcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY3JpcHRDb25maWcgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBsZWFndWVZZWFyTWluIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogU2NyaXB0Q29uZmlnID0ge1xuICBsZWFndWVTZWFzb25Nb2RlOiAnZnVsbCcsXG4gIGxlYWd1ZVllYXI6IGxlYWd1ZVllYXJNaW4sXG4gIGlzUnVuQWRSZXdhcmQ6IGZhbHNlLFxuICBpc1J1blBsYXlCYXR0bGVHYW1lOiB0cnVlLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldChqc29uQ29uZmlnOiBhbnkpIHtcbiAgaWYgKHR5cGVvZiBqc29uQ29uZmlnICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGMgPSBKU09OLnBhcnNlKGpzb25Db25maWcpO1xuICBjb25maWcubGVhZ3VlU2Vhc29uTW9kZSA9IGMubGVhZ3VlU2Vhc29uTW9kZSA/PyBjb25maWcubGVhZ3VlU2Vhc29uTW9kZTtcbiAgY29uZmlnLmxlYWd1ZVllYXIgPSBjLmxlYWd1ZVllYXIgPz8gY29uZmlnLmxlYWd1ZVllYXI7XG5cbiAgY29uZmlnLnhyb2JvdG1vblMzS2V5ID0gYy54cm9ib3Rtb25TM0tleSA/PyBjb25maWcueHJvYm90bW9uUzNLZXk7XG4gIGNvbmZpZy54cm9ib3Rtb25TM1Rva2VuID0gYy54cm9ib3Rtb25TM1Rva2VuID8/IGNvbmZpZy54cm9ib3Rtb25TM1Rva2VuO1xuICBjb25maWcuYW1hem9uYXdzUzNLZXkgPSBjLmFtYXpvbmF3c1MzS2V5ID8/IGNvbmZpZy5hbWF6b25hd3NTM0tleTtcbiAgY29uZmlnLmFtYXpvbmF3c1MzVG9rZW4gPSBjLmFtYXpvbmF3c1MzVG9rZW4gPz8gY29uZmlnLmFtYXpvbmF3c1MzVG9rZW47XG4gIGNvbmZpZy5saWNlbnNlSWQgPSBjLmxpY2Vuc2VJZCA/PyBjb25maWcubGljZW5zZUlkO1xuXG4gIGNvbmZpZy5pc0Nsb3VkID0gYy5pc0Nsb3VkID8/IHRydWU7XG4gIGNvbmZpZy5pc0xvY2FsUGFpZCA9IGMuaXNMb2NhbFBhaWQgPz8gZmFsc2U7XG4gIGNvbmZpZy5pc0RldiA9IGMuaXNEZXYgPz8gZmFsc2U7XG4gIGNvbmZpZy5oYXNDb29sRmVhdHVyZSA9IGNvbmZpZy5pc0Nsb3VkIHx8IGNvbmZpZy5pc0xvY2FsUGFpZCB8fCBjLmlzRGV2IHx8IGZhbHNlO1xuXG4gIGNvbmZpZy5pc1J1bkFkUmV3YXJkID0gY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIChjLmlzUnVuQWRSZXdhcmQgPz8gY29uZmlnLmlzUnVuQWRSZXdhcmQpO1xuICBjb25maWcuaXNSdW5QbGF5QmF0dGxlR2FtZSA9IGNvbmZpZy5oYXNDb29sRmVhdHVyZSAmJiAoYy5pc1J1blBsYXlCYXR0bGVHYW1lID8/IGNvbmZpZy5pc1J1blBsYXlCYXR0bGVHYW1lKTtcbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmxldCBsYXN0UnVubmluZ0V2ZW50OiBudW1iZXIgPSAwO1xubGV0IGxhc3RTZW5kR2FtZVN0YXR1c0V2ZW50QXQ6IG51bWJlciA9IDA7XG5sZXQgY250ID0gMDtcbmVudW0gRXZlbnROYW1lIHtcbiAgUlVOTklORyA9ICdydW5uaW5nJyxcbiAgR0FNRV9TVEFUVVMgPSAnZ2FtZVN0YXR1cycsXG59XG5lbnVtIEdhbWVTdGF0dXNDb250ZW50IHtcbiAgV0FJVF9GT1JfTE9HSU5fSU5QVVQgPSAnd2FpdC1mb3ItaW5wdXQnLFxuICBMT0dJTl9TVUNDRUVERUQgPSAnbG9naW4tc3VjY2VlZGVkJyxcbiAgTEFVTkNISU5HID0gJ2xhdW5jaGluZycsXG4gIFBMQVlJTkcgPSAncGxheWluZycsXG59XG5jb25zdCBwcmVmaXggPSAnW0V2ZW50XSc7XG5cbmV4cG9ydCBsZXQgbGFzdEdhbWVTdGF0dXNFdmVudDogc3RyaW5nID0gJyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpbklucHV0aW5nKCkge1xuICBjbnQrKztcbiAgY29uc29sZS5sb2coYGxvZ2luSW5wdXRpbmc6ICR7Y250fWApO1xuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuV0FJVF9GT1JfTE9HSU5fSU5QVVQ7XG4gIHJldHVybiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5TdWNjZXNzKCkge1xuICBpZiAobGFzdEdhbWVTdGF0dXNFdmVudCAhPT0gR2FtZVN0YXR1c0NvbnRlbnQuV0FJVF9GT1JfTE9HSU5fSU5QVVQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgY29udGVudCA9IEdhbWVTdGF0dXNDb250ZW50LkxPR0lOX1NVQ0NFRURFRDtcbiAgcmV0dXJuIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hpbmcoKSB7XG4gIC8vIHNldCB0byBkZWZhdWx0IG9uY2UgYXBwIGlzIGxhdW5jaGVkIChmaXJzdCBhbmQgYWdhaW4pXG4gIGxhc3RSdW5uaW5nRXZlbnQgPSAwO1xuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuTEFVTkNISU5HO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXlpbmcoKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBHYW1lU3RhdHVzQ29udGVudC5QTEFZSU5HO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bm5pbmcodXNlSW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBpZiAodXNlSW50ZXJ2YWwgJiYgbm93IC0gbGFzdFJ1bm5pbmdFdmVudCA8IENPTlNUQU5UUy5zZW5kUnVubmluZ0V2ZW50SW50ZXJ2YWwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGFzdFJ1bm5pbmdFdmVudCA9IG5vdztcbiAgc2VuZEV2ZW50KEV2ZW50TmFtZS5SVU5OSU5HLCAnJyk7XG4gIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gcnVubmluZ2ApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAobGFzdEdhbWVTdGF0dXNFdmVudCA9PT0gY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHNsZWVwIGZvciBzZW5kIDErIGV2ZW50cyBpbiBhIHNob3J0IHRpbWVcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBsYXN0U2VuZEdhbWVTdGF0dXNFdmVudEF0O1xuICBpZiAoZGlmZiA8IENPTlNUQU5UUy5zbGVlcE1lZGl1bSkge1xuICAgIFV0aWxzLnNsZWVwKGRpZmYpO1xuICB9XG5cbiAgbGFzdEdhbWVTdGF0dXNFdmVudCA9IGNvbnRlbnQ7XG4gIHNlbmRFdmVudChFdmVudE5hbWUuR0FNRV9TVEFUVVMsIGNvbnRlbnQpO1xuICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9ICR7Y29udGVudH1gKTtcbiAgbGFzdFNlbmRHYW1lU3RhdHVzRXZlbnRBdCA9IERhdGUubm93KCk7XG4gIHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IHsgcmVyb3V0ZXIgfSBmcm9tICcuL3Jlcm91dGVyJztcbmV4cG9ydCAqIGFzIENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5leHBvcnQgKiBhcyBzdGF0ZSBmcm9tICcuL3N0YXRlJztcbiIsImltcG9ydCB7IHJlcm91dGVyIGFzIHIgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuci5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdBdXRvU3RvcCA9IHRydWU7XG5yLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdEZWJ1ZyA9IGZhbHNlO1xuci5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdGaW5kUm91dGVEZWxheSA9IDEwMDA7XG5cbi8vIGlmIG5vdCBzZXQgcGFja2FnZU5hbWUgZmlyc3QsIGNhbm5vdCBoYW5kbGUgc3RhcnQvIHN0b3AgYXBwXG5yLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lID0gQ09OU1RBTlRTLnBhY2thZ2VOYW1lO1xuci5yZXJvdXRlckNvbmZpZy5zdGFydEFwcERlbGF5ID0gMTAgKiAxMDAwO1xuci5yZXJvdXRlckNvbmZpZy50YXNrRGVsYXkgPSA1MDA7XG5cbnIuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID0gJ2hvcml6b250YWwnO1xuci5zY3JlZW5Db25maWcuZGV2SGVpZ2h0ID0gMzYwO1xuci5zY3JlZW5Db25maWcuZGV2V2lkdGggPSA2NDA7XG5cbmV4cG9ydCBsZXQgcmVyb3V0ZXIgPSByO1xuIiwiaW1wb3J0IHsgZGVmYXVsdCBhcyBNRDUgfSBmcm9tICdtZDUnO1xuaW1wb3J0IHsgZXhlY3V0ZUNvbW1hbmRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgcmVyb3V0ZXIgfSBmcm9tICcuL3Jlcm91dGVyJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vLyBhcHAgb3JpZ2luIGluZm9cbmNvbnN0IGFwcFNlc3Npb25Sb290ID0gYGRhdGEvZGF0YS8ke0NPTlNUQU5UUy5wYWNrYWdlTmFtZX1gO1xuY29uc3QgYXBwUmVjb3JkUm9vdCA9IGAvc2RjYXJkL0FuZHJvaWQvZGF0YS8ke0NPTlNUQU5UUy5wYWNrYWdlTmFtZX0vZmlsZXNgO1xuXG4vLyBjYWNoZSBpbmZvXG5jb25zdCBsaWNlbnNlRmlsZVBhdGg6IHN0cmluZyA9ICcvc2RjYXJkL1JvYm90bW9uL2xpY2Vuc2UudHh0JztcbmNvbnN0IHNjcmlwdENhY2hlUm9vdCA9ICcvc2RjYXJkL1JvYm90bW9uL2xvZ2luQ2FjaGUnO1xuY29uc3QgYW5kcm9pZElkRmlsZVBhdGggPSBgJHtzY3JpcHRDYWNoZVJvb3R9L2FuZHJvaWRfaWQudHh0YDtcbmNvbnN0IGdhbWVSZWNvcmRDYWNoZVJvb3QgPSBgJHtzY3JpcHRDYWNoZVJvb3R9L2dhbWVSZWNvcmRgO1xuXG4vLyBjbG91ZCBpbmZvXG5jb25zdCBlbmRwb2ludCA9ICdzMy5yb2JvdG1vbi5hcHA6OTAwMCc7XG5jb25zdCBidWNrZXQgPSAnbWxiLXJlY29yZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2Vzc2lvbigpIHtcbiAgaWYgKCFjb25maWcuaXNDbG91ZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgeyBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuICBjb25zdCBsYXN0TGljZW5zZUlkID0gcmVhZEZpbGUobGljZW5zZUZpbGVQYXRoKSB8fCAnJztcbiAgd3JpdGVGaWxlKGxpY2Vuc2VGaWxlUGF0aCwgbGljZW5zZUlkKTtcbiAgY29uc29sZS5sb2coYGxhc3RMaWNlbnNlSWQ6ICR7bGFzdExpY2Vuc2VJZH0sIGN1cnJlbnRMaWNlbnNlSWQ6ICR7bGljZW5zZUlkfWApO1xuXG4gIC8vIGFjdGlvbnMgYmFzZWQgb24gbGFzdCBhbmQgY3VycmVudCBsaWNlbnNlSWRcbiAgc3dpdGNoIChsaWNlbnNlSWQpIHtcbiAgICAvLyBlbXB0eSBsaWNlbnNlSWRcbiAgICBjYXNlICcnOlxuICAgICAgbG9nT3V0KCk7XG4gICAgICBzbGVlcCgzMDAwKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgLy8gaGFzIGxpY2Vuc2VJZFxuICAgIGRlZmF1bHQ6XG4gICAgICBzd2l0Y2ggKGxhc3RMaWNlbnNlSWQpIHtcbiAgICAgICAgLy8gZW1wdHkgbGFzdExpY2Vuc2VJZFxuICAgICAgICBjYXNlICcnOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIHNhbWUgbGljZW5zZUlkXG4gICAgICAgIGNhc2UgbGljZW5zZUlkOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIC8vIGRpZmZlcmVudCBsaWNlbnNlSWRcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBsb2dPdXQoKTtcbiAgICAgICAgICBzbGVlcCgzMDAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgaGFzQ2xvdWRTZXNzaW9uID0gZmV0Y2hTZXNzaW9uKCk7XG4gICAgICBpZiAoaGFzQ2xvdWRTZXNzaW9uKSB7XG4gICAgICAgIGxvZ0luKCk7XG4gICAgICAgIHNsZWVwKDMwMDApO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyByZXN0YXJ0IGFwcCBpZiBuZWVkZWRcbiAgbGV0IGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIHdoaWxlICghaXNJbkFwcCkge1xuICAgIHJlcm91dGVyLnN0YXJ0QXBwKCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgfVxuICBzbGVlcCgzMDAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZFNlc3Npb24oKSB7XG4gIGlmICghY29uZmlnLmlzQ2xvdWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHsgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcbiAgaWYgKGxpY2Vuc2VJZCkge1xuICAgIGxvZ091dCgpO1xuICAgIHNsZWVwKDMwMDApO1xuICAgIGNvbnNvbGUubG9nKCc9PT09IHN0b3Agc2NyaXB0OiBoYXMgbGljZW5zZUlkOyBjbG9zZSBhcHAgYW5kIGNsZWFyIHNlc3Npb24nKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnPT09PSBzdG9wIHNjcmlwdDogbm8gbGljZW5zZUlkOyBub3QgdG8gY2xvc2UgYXBwIGZvciBsZXQgbmV3IHVzZXIgbG9naW4nKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkU2Vzc2lvbigpIHtcbiAgaWYgKCFjb25maWcuaXNDbG91ZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgeyB4cm9ib3Rtb25TM0tleSwgeHJvYm90bW9uUzNUb2tlbiwgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcblxuICBpZiAoISh4cm9ib3Rtb25TM0tleSAmJiB4cm9ib3Rtb25TM1Rva2VuICYmIGxpY2Vuc2VJZCkpIHtcbiAgICBjb25zb2xlLmxvZygnZmFpbGVkIHVwbG9hZDsgcmVxdWlyZWQga2V5IGlzIGVtcHR5Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc29sZS5sb2coYHVwbG9hZCBzZXNzaW9uICR7bGljZW5zZUlkfSBzdGFydGApO1xuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgLy8gcmVtb3ZlIHRtcCBmaWxlIHJvb3RcbiAgICBgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fWAsXG4gICAgYHJtIC1mICR7c2NyaXB0Q2FjaGVSb290fS5nemAsXG5cbiAgICAvLyBjb3B5IGxvY2FsIHNlc3Npb24gdG8gdG1wIGZpbGUgcm9vdFxuICAgIGBta2RpciAtcCAke3NjcmlwdENhY2hlUm9vdH0vYCxcbiAgICBgY3AgLXIgJHthcHBTZXNzaW9uUm9vdH0vZmlsZXMgJHtzY3JpcHRDYWNoZVJvb3R9L2AsXG4gICAgYGNwIC1yICR7YXBwU2Vzc2lvblJvb3R9L3NoYXJlZF9wcmVmcyAke3NjcmlwdENhY2hlUm9vdH0vYFxuICApO1xuICBjb3B5R2FtZVJlY29yZFRvQ2FjaGUoKTtcblxuICAvLyBjb3B5IGN1cnJlbnQgYW5kcm9pZCBpZCB0byB0bXAgZmlsZSByb290XG4gIGNvbnN0IGFuZHJvaWRJZCA9IGV4ZWN1dGUoJ0FORFJPSURfREFUQT0vZGF0YSBzZXR0aW5ncyBnZXQgc2VjdXJlIGFuZHJvaWRfaWQnKTtcbiAgY29uc29sZS5sb2coYHVwbG9hZCBhbmRyb2lkSWQ6ICR7YW5kcm9pZElkfWApO1xuICB3cml0ZUZpbGUoYW5kcm9pZElkRmlsZVBhdGgsIGFuZHJvaWRJZCk7XG5cbiAgdGFyZ3ooYCR7c2NyaXB0Q2FjaGVSb290fS5nemAsIGAke3NjcmlwdENhY2hlUm9vdH1gKTtcblxuICAvLyB1cGxvYWQgc2Vzc2lvblxuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBjb25zdCBzZXNzaW9uRmlsZU5hbWUgPSBgbG9naW5DYWNoZS8ke2xpY2Vuc2VJZH0uZ3pgO1xuICBjb25zdCBzaXplT3JFcnJvciA9IHMzVXBsb2FkRmlsZShcbiAgICBgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcbiAgICBzZXNzaW9uRmlsZU5hbWUsXG4gICAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgZW5kcG9pbnQsXG4gICAgYnVja2V0LFxuICAgIHhyb2JvdG1vblMzS2V5LFxuICAgIHhyb2JvdG1vblMzVG9rZW4sXG4gICAgJycsXG4gICAgZmFsc2VcbiAgKTtcbiAgY29uc29sZS5sb2coYHVwbG9hZCBzZXNzaW9uIHRvICR7ZW5kcG9pbnR9IGZpbmlzaC4gc2l6ZU9yRXJyb3IgJHtzaXplT3JFcnJvcn07IHVzZWRUaW1lICR7RGF0ZS5ub3coKSAtIG5vd31gKTtcblxuICAvLyByZW1vdmUgdG1wIGZpbGUgcm9vdFxuICBleGVjdXRlQ29tbWFuZHMoYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH1gLCBgcm0gLWYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCk7XG59XG5cbmZ1bmN0aW9uIGxvZ091dCgpIHtcbiAgY29uc29sZS5sb2coYGRvIGxvZ291dGApO1xuICBsZXQgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgd2hpbGUgKGlzSW5BcHApIHtcbiAgICByZXJvdXRlci5zdG9wQXBwKCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgfVxuICBjb25zb2xlLmxvZygnYXBwIGlzIHN0b3BwZWQsIGNsZWFyIHNlc3Npb24gc3RhcnQnKTtcbiAgY2xlYXJTZXNzaW9uKCk7XG4gIHdyaXRlRmlsZShsaWNlbnNlRmlsZVBhdGgsICcnKTtcbn1cbmZ1bmN0aW9uIGxvZ0luKCkge1xuICBsZXQgeyBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuICBjb25zb2xlLmxvZyhgZG8gbG9naW5gKTtcbiAgbGV0IGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIHdoaWxlIChpc0luQXBwKSB7XG4gICAgcmVyb3V0ZXIuc3RvcEFwcCgpO1xuICAgIHNsZWVwKDMwMDApO1xuICAgIGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIH1cbiAgY29uc29sZS5sb2coJ2FwcCBpcyBzdG9wcGVkLCBzZXQgc2Vzc2lvbiBzdGFydCcpO1xuICBzZXRTZXNzaW9uKCk7XG4gIHdyaXRlRmlsZShsaWNlbnNlRmlsZVBhdGgsIGxpY2Vuc2VJZCk7XG59XG5cbmZ1bmN0aW9uIGZldGNoU2Vzc2lvbigpOiBib29sZWFuIHtcbiAgbGV0IHsgeHJvYm90bW9uUzNLZXksIHhyb2JvdG1vblMzVG9rZW4sIGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGlmICghKHhyb2JvdG1vblMzS2V5ICYmIHhyb2JvdG1vblMzVG9rZW4gJiYgbGljZW5zZUlkKSkge1xuICAgIGNvbnNvbGUubG9nKCdmZXRjaCBmYWlsZWQ6IHJlcXVpcmVkIGtleSBpcyBlbXB0eScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGBmZXRjaFNlc3Npb24gc3RhcnQgJHtsaWNlbnNlSWR9YCk7XG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgZXhlY3V0ZUNvbW1hbmRzKFxuICAgIC8vIHJlbW92ZSBvbGQgZmlsZXNcbiAgICBgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fWAsXG4gICAgYHJtIC1mICR7c2NyaXB0Q2FjaGVSb290fS5nemAsXG5cbiAgICAvLyBjcmVhdGUgdG1wIGZpbGUgcm9vdFxuICAgIGBta2RpciAtcCAke3NjcmlwdENhY2hlUm9vdH1gXG4gICk7XG5cbiAgY29uc3Qgc2Vzc2lvbkZpbGVOYW1lID0gYGxvZ2luQ2FjaGUvJHtsaWNlbnNlSWR9Lmd6YDtcbiAgY29uc3QgcmVzdWx0T3JFcnJvciA9IHMzRG93bmxvYWRGaWxlKGAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLCBzZXNzaW9uRmlsZU5hbWUsIGVuZHBvaW50LCBidWNrZXQsIHhyb2JvdG1vblMzS2V5LCB4cm9ib3Rtb25TM1Rva2VuLCAnJywgZmFsc2UpO1xuICBpZiAocmVzdWx0T3JFcnJvciAhPT0gdHJ1ZSkge1xuICAgIGNvbnNvbGUubG9nKGBmZXRjaFNlc3Npb24gZmFpbGVkICR7cmVzdWx0T3JFcnJvcn1gKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc29sZS5sb2coYERvd25sb2FkIHNlc3Npb24gZnJvbSAke2VuZHBvaW50fSBmaW5pc2guIHVzZWRUaW1lYCwgRGF0ZS5ub3coKSAtIG5vdywgbGljZW5zZUlkLCByZXN1bHRPckVycm9yKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHNldFNlc3Npb24oKSB7XG4gIC8vIGNsZWFyIGFwcCBzZXNzaW9uIHRvIGF2b2lkIGNhbm5vdCBvdmVyd3JpdGVcbiAgY29uc3QgZ2FtZVJlY29yZEZpbGVOYW1lID0gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCkgfHwgJ05PVF9FWElTVF9SRUNPUkQnO1xuICBleGVjdXRlQ29tbWFuZHMoYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9maWxlc2AsIGBybSAtcmYgJHthcHBTZXNzaW9uUm9vdH0vc2hhcmVkX3ByZWZzYCwgYHJtIC1yZiAke2FwcFJlY29yZFJvb3R9LyR7Z2FtZVJlY29yZEZpbGVOYW1lfWApO1xuXG4gIC8vIHVudGFyZ3ogY2xvdWQgc2Vzc2lvbiBhbmQgb3ZlcndyaXRlIGFwcCBzZXNzaW9uXG4gIGNvbnNvbGUubG9nKGBzZXQgc2Vzc2lvbiBzdGFydGApO1xuICB1bnRhcmd6KGAke3NjcmlwdENhY2hlUm9vdH0uZ3pgKTtcbiAgZXhlY3V0ZUNvbW1hbmRzKFxuICAgIGBjcCAtciAke3NjcmlwdENhY2hlUm9vdH0vZmlsZXMgJHthcHBTZXNzaW9uUm9vdH0vYCxcbiAgICBgY3AgLXIgJHtzY3JpcHRDYWNoZVJvb3R9L3NoYXJlZF9wcmVmcyAke2FwcFNlc3Npb25Sb290fS9gLFxuICAgIGBjcCAtciAke3NjcmlwdENhY2hlUm9vdH0vZ2FtZVJlY29yZC8qICR7YXBwUmVjb3JkUm9vdH0vYCxcblxuICAgIGBjaG1vZCAtUiA3NzcgJHthcHBTZXNzaW9uUm9vdH0vZmlsZXNgLFxuICAgIGBjaG1vZCAtUiA3NzcgJHthcHBTZXNzaW9uUm9vdH0vc2hhcmVkX3ByZWZzYCxcbiAgICBgY2htb2QgLVIgNzc3ICR7YXBwUmVjb3JkUm9vdH1gXG4gICk7XG4gIHNldEFuZHJvaWRJZCgnY2xvdWQnKTtcbiAgY29uc29sZS5sb2coJ3NldCBzZXNzaW9uIGRvbmUnKTtcbiAgc2xlZXAoMjAwMCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyU2Vzc2lvbigpIHtcbiAgc2V0QW5kcm9pZElkKCdyYW5kb20nKTtcbiAgY29uc3QgZ2FtZVJlY29yZEZpbGVOYW1lID0gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCkgfHwgJ05PVF9FWElTVF9SRUNPUkQnO1xuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLFxuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCxcblxuICAgIGBybSAtcmYgJHthcHBTZXNzaW9uUm9vdH0vZmlsZXNgLFxuICAgIGBybSAtcmYgJHthcHBTZXNzaW9uUm9vdH0vc2hhcmVkX3ByZWZzYCxcbiAgICBgcm0gLXJmICR7YXBwUmVjb3JkUm9vdH0vJHtnYW1lUmVjb3JkRmlsZU5hbWV9YFxuICApO1xuICBjb25zb2xlLmxvZygnY2xlYXIgc2Vzc2lvbiBkb25lJyk7XG4gIHNsZWVwKDIwMDApO1xufVxuXG5mdW5jdGlvbiBzZXRBbmRyb2lkSWQoc291cmNlOiAncmFuZG9tJyB8ICdjbG91ZCcpIHtcbiAgbGV0IFtvcmlBbmRyb2lkSWRdID0gZXhlY3V0ZUNvbW1hbmRzKCdBTkRST0lEX0RBVEE9L2RhdGEgc2V0dGluZ3MgZ2V0IHNlY3VyZSBhbmRyb2lkX2lkJyk7XG4gIGxldCBhbmRyb2lkSWQgPSBNRDUoYCR7RGF0ZS5ub3coKX0ke29yaUFuZHJvaWRJZH1gKS5zdWJzdHJpbmcoMCwgMTYpO1xuICBpZiAoc291cmNlID09PSAnY2xvdWQnKSB7XG4gICAgYW5kcm9pZElkID0gcmVhZEZpbGUoYW5kcm9pZElkRmlsZVBhdGgpIHx8IGFuZHJvaWRJZDtcbiAgfVxuICBleGVjdXRlQ29tbWFuZHMoJ0FORFJPSURfREFUQT0vZGF0YSBzZXR0aW5ncyBwdXQgc2VjdXJlIGFuZHJvaWRfaWQgJyArIGFuZHJvaWRJZCk7XG4gIGNvbnNvbGUubG9nKCdvcmlBbmRyb2lkSWQnLCBvcmlBbmRyb2lkSWQpO1xuICBjb25zb2xlLmxvZygnc2V0QW5kcm9pZElkJywgYW5kcm9pZElkKTtcbn1cblxuZnVuY3Rpb24gY29weUdhbWVSZWNvcmRUb0NhY2hlKCkge1xuICBjb25zdCBmaWxlTmFtZSA9IGdldEdhbWVSZWNvcmRGaWxlTmFtZSgpO1xuICBpZiAoIWZpbGVOYW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGV4ZWN1dGVDb21tYW5kcyhgbWtkaXIgLXAgJHtnYW1lUmVjb3JkQ2FjaGVSb290fWAsIGBjcCAtciAke2FwcFJlY29yZFJvb3R9LyR7ZmlsZU5hbWV9ICR7Z2FtZVJlY29yZENhY2hlUm9vdH0vJHtmaWxlTmFtZX0vYCk7XG59XG5cbmZ1bmN0aW9uIGdldEdhbWVSZWNvcmRGaWxlTmFtZSgpIHtcbiAgY29uc3QgZmlsZXMgPSBleGVjdXRlQ29tbWFuZHMoYGxzICR7YXBwUmVjb3JkUm9vdH1gKVswXS5zcGxpdCgnXFxuJyk7XG4gIGZvciAobGV0IGZpbGVOYW1lIG9mIGZpbGVzKSB7XG4gICAgaWYgKGZpbGVOYW1lLmxlbmd0aCA9PT0gMzIpIHtcbiAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUudHJpbSgpO1xuICAgICAgY29uc29sZS5sb2coYGdhbWUgcmVjb3JkICR7ZmlsZU5hbWV9YCk7XG4gICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cbiIsImltcG9ydCB7IHJlcm91dGVyIH0gZnJvbSAnLi9yZXJvdXRlcic7XG5pbXBvcnQgKiBhcyBFdmVudFNlbmRlciBmcm9tICcuL2V2ZW50U2VuZGVyJztcbmltcG9ydCAqIGFzIFNlc3Npb24gZnJvbSAnLi9zZXNzaW9uJztcbmltcG9ydCAqIGFzIENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuaW1wb3J0IHsgZXhlY3V0ZUNvbW1hbmRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlR2FtZSA9IHtcbiAgdHJ5RW50ZXJHYW1lQ250czogMCxcbiAgbmVlZFJlc2V0UHJvZ3Jlc3M6IGZhbHNlLFxuICBsYXN0Q2hlY2tQb3dlclNhdmVBdDogMCxcbiAgcG93ZXJTYXZlQ29sb3JDb3VudDoge30sXG59O1xuZXhwb3J0IGxldCBpc1dhaXRpbmdMb2dpbiA9IGZhbHNlO1xubGV0IGxhc3RVcGxvYWRTZXNzaW9uQXQgPSAwO1xubGV0IGhhc1Nlc3Npb24gPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoanNvbkNvbmZpZzogYW55KSB7XG4gIENvbmZpZy5zZXQoanNvbkNvbmZpZyk7XG4gIHJlcm91dGVyLmRlYnVnID0gQ29uZmlnLmNvbmZpZy5pc0Nsb3VkIHx8IENvbmZpZy5jb25maWcuaXNEZXYgfHwgZmFsc2U7XG4gIHJlcm91dGVyLnJlcm91dGVyQ29uZmlnLmF1dG9MYXVuY2hBcHAgPSBDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlIHx8IGZhbHNlO1xuICBpZiAoQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgU2Vzc2lvbi5pbml0U2Vzc2lvbigpO1xuICAgIGV4ZWN1dGVDb21tYW5kcygncG0gZGlzYWJsZS11c2VyIGNvbS5hbmRyb2lkLmlucHV0bWV0aG9kLmxhdGluJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZCgpIHtcbiAgaWYgKENvbmZpZy5jb25maWcuaXNDbG91ZCkge1xuICAgIFNlc3Npb24uZW5kU2Vzc2lvbigpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvblJ1bm5pbmcodXNlSW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAoQ29uZmlnLmNvbmZpZy5pc0Nsb3VkID8/IENvbmZpZy5jb25maWcuaXNEZXYpICYmIEV2ZW50U2VuZGVyLnJ1bm5pbmcodXNlSW50ZXJ2YWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25Mb2dpblBhZ2UobmVlZFVzZXJJbnB1dDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIGhhc1Nlc3Npb24gPSBmYWxzZTtcbiAgaXNXYWl0aW5nTG9naW4gPSB0cnVlO1xuICBpZiAoIShDb25maWcuY29uZmlnLmlzQ2xvdWQgPz8gQ29uZmlnLmNvbmZpZy5pc0RldikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gdXNlIGludGVydmFsIGluIHJ1bm5pbmdcbiAgRXZlbnRTZW5kZXIucnVubmluZyh0cnVlKTtcblxuICBpZiAobmVlZFVzZXJJbnB1dCkge1xuICAgIEV2ZW50U2VuZGVyLmxvZ2luSW5wdXRpbmcoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb25Mb2dpblN1Y2Nlc3MoKSB7XG4gIGhhc1Nlc3Npb24gPSB0cnVlO1xuICBpc1dhaXRpbmdMb2dpbiA9IGZhbHNlO1xuICBpZiAoIShDb25maWcuY29uZmlnLmlzQ2xvdWQgPz8gQ29uZmlnLmNvbmZpZy5pc0RldikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgRXZlbnRTZW5kZXIubG9naW5TdWNjZXNzKCk7XG4gIEV2ZW50U2VuZGVyLnBsYXlpbmcoKTtcbiAgRXZlbnRTZW5kZXIucnVubmluZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25MYXVuY2hpbmcoKSB7XG4gIGhhc1Nlc3Npb24gPSBmYWxzZTtcbiAgbGFzdFVwbG9hZFNlc3Npb25BdCA9IDA7XG4gIGxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cyA9IGxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cztcbiAgbGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IGZhbHNlO1xuICBsZWFndWVHYW1lLmxhc3RDaGVja1Bvd2VyU2F2ZUF0ID0gMDtcbiAgbGVhZ3VlR2FtZS5wb3dlclNhdmVDb2xvckNvdW50ID0ge307XG4gIChDb25maWcuY29uZmlnLmlzQ2xvdWQgPz8gQ29uZmlnLmNvbmZpZy5pc0RldikgJiYgRXZlbnRTZW5kZXIubGF1bmNoaW5nKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1VwbG9hZFNlc3Npb24oKSB7XG4gIC8vIG9ubHkgdXBsb2FkIHNlc3Npb24gd2hlbiBpcyBwbGF5aW5nXG4gIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkIHx8ICFoYXNTZXNzaW9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGlmIChub3cgLSBsYXN0VXBsb2FkU2Vzc2lvbkF0IDwgQ09OU1RBTlRTLnVwbG9hZFNlc3Npb25JbnRlcnZhbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsYXN0VXBsb2FkU2Vzc2lvbkF0ID0gbm93O1xuICBjb25zb2xlLmxvZygndXBsb2FkIHNlc3Npb24nKTtcbiAgU2Vzc2lvbi51cGxvYWRTZXNzaW9uKCk7XG59XG4iLCJpbXBvcnQgeyBHcm91cFBhZ2UsIFBhZ2UgfSBmcm9tICdSZXJvdXRlcic7XG5cbmV4cG9ydCBjb25zdCBsb2dvID0gbmV3IFBhZ2UoXG4gICdsb2dvJyxcbiAgW1xuICAgIHsgeDogMjI3LCB5OiAxODQsIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDI1OCwgeTogMTg3LCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiAyNzgsIHk6IDE5MCwgcjogMjMyLCBnOiA0OCwgYjogNzIgfSxcbiAgICB7IHg6IDI4NSwgeTogMTgzLCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiAzMDEsIHk6IDE3MiwgcjogMjI5LCBnOiAxOSwgYjogNDYgfSxcbiAgICB7IHg6IDMxNiwgeTogMTg3LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiAzMzUsIHk6IDE4OCwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogMzcyLCB5OiAxODgsIHI6IDI1MiwgZzogMjMzLCBiOiAyMzUgfSxcbiAgICB7IHg6IDM3NSwgeTogMTY5LCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiAzOTUsIHk6IDE4NCwgcjogMjU0LCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogMzk4LCB5OiAxNzAsIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDQwMywgeTogMTg2LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiAxMTcsIHk6IDExNCwgcjogMjU0LCBnOiAyNTQsIGI6IDI1NCB9LFxuXG4gICAgLy8gbG9hZGluZyBvbiBsZWZ0IHRvcCBpZiBzdHVja1xuICAgIC8vIHsgeDogMiwgeTogNSwgcjogMTQyLCBnOiAyMDgsIGI6IDIwMiB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbi8vIHRlcm0gb2Ygc2VydmljZVxuZXhwb3J0IGNvbnN0IFRPUyA9IG5ldyBQYWdlKFxuICAnVE9TJyxcbiAgW1xuICAgIC8vIGxvZ29cbiAgICB7IHg6IDI4OSwgeTogNDAsIHI6IDIzMiwgZzogNTIsIGI6IDc0IH0sXG4gICAgeyB4OiAyOTMsIHk6IDM0LCByOiAyMjksIGc6IDIxLCBiOiA0NiB9LFxuICAgIHsgeDogMjk5LCB5OiAzOCwgcjogMjI3LCBnOiA2LCBiOiAzMyB9LFxuICAgIHsgeDogMzA4LCB5OiAzNywgcjogMjQ4LCBnOiAxOTIsIGI6IDE5OSB9LFxuICAgIHsgeDogMzEzLCB5OiAzOSwgcjogMjQ4LCBnOiAxOTIsIGI6IDE5OSB9LFxuICAgIHsgeDogMzIxLCB5OiAzNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzI1LCB5OiA0MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMzLCB5OiAzMywgcjogMjUyLCBnOiAyMjMsIGI6IDIyNyB9LFxuICAgIHsgeDogMzM4LCB5OiAzOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzQyLCB5OiAzOCwgcjogMjQ2LCBnOiAxNzYsIGI6IDE4NSB9LFxuICAgIHsgeDogMzQ0LCB5OiAzNywgcjogMjQ2LCBnOiAxNzcsIGI6IDE4NSB9LFxuICAgIHsgeDogMzQ2LCB5OiAzNiwgcjogMjM0LCBnOiA2OCwgYjogODkgfSxcbiAgICB7IHg6IDMzNSwgeTogMzQsIHI6IDIzNCwgZzogNjcsIGI6IDg3IH0sXG4gICAgeyB4OiAzMzUsIHk6IDM3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNDQsIHk6IDM1LCByOiAyMjcsIGc6IDYsIGI6IDMzIH0sXG5cbiAgICAvLyBjb3B5cmlnaHRcbiAgICB7IHg6IDI4OSwgeTogMzM1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMDAsIHk6IDMzNiwgcjogMTk0LCBnOiAxOTcsIGI6IDE5NSB9LFxuICAgIHsgeDogMzAxLCB5OiAzMzYsIHI6IDE4NywgZzogMTkyLCBiOiAxODkgfSxcbiAgICB7IHg6IDMwNywgeTogMzM2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTAsIHk6IDMzNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMzUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMywgeTogMzM2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzIsIHk6IDMzNiwgcjogMTgxLCBnOiAxODYsIGI6IDE4MyB9LFxuICAgIHsgeDogMzQwLCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGFncmVlIGJ0biBiZ1xuICAgIHsgeDogMTcsIHk6IDI5MywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNTQsIHk6IDMwNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjIsIHk6IDMxNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTExLCB5OiAzMTYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI0MywgeTogMjk3LCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiAyNTUsIHk6IDI5MSwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNTk5LCB5OiAzMDQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYxMywgeTogMjk1LCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA2MDMsIHk6IDMxNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDIxLCB5OiAzMjIsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcblxuICAgIC8vIGJnIGNvcm5lciBvdXRzaWRlXG4gICAgeyB4OiA3MiwgeTogMzIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUxMSwgeTogNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU4NiwgeTogMzksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE0LCB5OiAzNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYxOSwgeTogMzQwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBiZyBjb3JuZXIgaW5zaWRlXG4gICAgeyB4OiAyMiwgeTogNzcsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDEwMCwgeTogNzcsIHI6IDE5NywgZzogMTk3LCBiOiAxOTcgfSxcbiAgICB7IHg6IDE4LCB5OiAyNTMsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDYxMywgeTogMjg2LCByOiAyMTYsIGc6IDIxNiwgYjogMjE2IH0sXG4gICAgeyB4OiA2MTMsIHk6IDgwLCByOiAyMTUsIGc6IDIxNSwgYjogMjE1IH0sXG4gICAgeyB4OiA2MDksIHk6IDczLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiAzMDUsIHk6IDc2LCByOiAxODMsIGc6IDE4MywgYjogMTgzIH0sXG4gICAgeyB4OiAzMDQsIHk6IDI5MSwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzA2IH0sXG4gIHsgeDogMzIwLCB5OiAzMDYgfVxuKTtcblxuLy8gdGVybSBvZiBzZXJ2aWNlLCBzdWl0IGRnaTkwXG5leHBvcnQgY29uc3QgVE9TOTAgPSBuZXcgUGFnZShcbiAgJ1RPUzkwJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAzMiwgeTogMjgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEwLCB5OiAzNDIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYyMiwgeTogMzQzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MjEsIHk6IDMyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBsb2dvXG4gICAgeyB4OiAyODgsIHk6IDI3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMDEsIHk6IDI3LCByOiAyNDYsIGc6IDE3NywgYjogMTg1IH0sXG4gICAgeyB4OiAzMjEsIHk6IDI0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDI4LCByOiAyNDUsIGc6IDE2MSwgYjogMTcxIH0sXG4gICAgeyB4OiAzMzAsIHk6IDI4LCByOiAyMzAsIGc6IDM2LCBiOiA2MCB9LFxuICAgIHsgeDogMzQ0LCB5OiAyOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDMyMSwgeTogMzIxIH0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfVxuKTtcblxuLy8gZm9yIGRnaTkwIGFuZCBuYXZpIGJhciBpcyBzbWFsbGVyXG5leHBvcnQgY29uc3QgVE9TOTB2MiA9IG5ldyBQYWdlKFxuICAnVE9TOTB2MicsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMiwgeTogMjMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEsIHk6IDQyLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiAxLCB5OiAzMjUsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDcsIHk6IDM0OCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjMxLCB5OiAzNTAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYyOCwgeTogMzIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MzMsIHk6IDI5MiwgcjogMjEzLCBnOiAyMTMsIGI6IDIxMyB9LFxuICAgIHsgeDogNjMwLCB5OiA0MCwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNjI4LCB5OiAyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gbG9nb1xuICAgIHsgeDogMjk2LCB5OiAyMSwgcjogMjQ4LCBnOiAxOTIsIGI6IDE5OSB9LFxuICAgIHsgeDogMzE2LCB5OiAyNCwgcjogMjI3LCBnOiA2LCBiOiAzMyB9LFxuICAgIHsgeDogMzQwLCB5OiAyMiwgcjogMjM5LCBnOiAxMTUsIGI6IDEzMCB9LFxuICBdLFxuICB7IHg6IDMyMSwgeTogMzIxIH0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfVxuKTtcblxuLy8gbGlrZSBsYW5kaW5nIGJ1dCBoYXMgcHJvZ3Jlc3MgYmFyXG5leHBvcnQgY29uc3QgbGFuZGluZ0xvYWRpbmcgPSBuZXcgUGFnZShcbiAgJ2xhbmRpbmdMb2FkaW5nJyxcbiAgW1xuICAgIC8vIGxvZ28gaW4gY2VudGVyXG4gICAgLy8gOWlubmluZ3NcbiAgICB7IHg6IDI5NSwgeTogMjQyLCByOiAzMCwgZzogNTAsIGI6IDgyIH0sXG4gICAgeyB4OiAyODMsIHk6IDIyMCwgcjogNjAsIGc6IDY5LCBiOiA5NCB9LFxuICAgIHsgeDogMjkyLCB5OiAyMjAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwMCwgeTogMjE1LCByOiAyMzQsIGc6IDIzNSwgYjogMjM3IH0sXG4gICAgeyB4OiAzNTAsIHk6IDIyMCwgcjogMjQ0LCBnOiAyMzUsIGI6IDIzNyB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBsYW5kaW5nID0gbmV3IFBhZ2UoXG4gICdsYW5kaW5nJyxcbiAgW1xuICAgIC8vIGxvZ28gaW4gY2VudGVyXG4gICAgeyB4OiAyOTcsIHk6IDI0NiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjgxLCB5OiAyNDQsIHI6IDgsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzAzLCB5OiAyNDMsIHI6IDIxOSwgZzogMTQ5LCBiOiAxNjQgfSxcblxuICAgIC8vIDlpbm5pbmdzXG4gICAgeyB4OiAyMTgsIHk6IDI2OSwgcjogODgsIGc6IDk5LCBiOiAxMzAgfSxcbiAgICB7IHg6IDIzOSwgeTogMjc3LCByOiAyNiwgZzogNDUsIGI6IDY1IH0sXG4gICAgeyB4OiAyNzQsIHk6IDI3NCwgcjogMjUsIGc6IDQxLCBiOiA3NCB9LFxuICAgIHsgeDogMzEzLCB5OiAyNzgsIHI6IDEzNCwgZzogMTQzLCBiOiAxNjAgfSxcbiAgICB7IHg6IDMyNywgeTogMjgyLCByOiA5OSwgZzogMTA0LCBiOiAxMjggfSxcbiAgICB7IHg6IDM1MCwgeTogMjY5LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMjU0LCB5OiAyMDAgfSwgLy8gdG8gc2VsZWN0IGxvZ2luXG4gIHsgeDogMjU0LCB5OiAyMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxvZ2luU2VsZWN0V2F5ID0gbmV3IFBhZ2UoXG4gICdsb2dpblNlbGVjdFdheScsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogNTEsIHk6IDcyLCByOiA3LCBnOiA3LCBiOiA4IH0sXG4gICAgeyB4OiA1MywgeTogMzA2LCByOiA3LCBnOiA2LCBiOiA3IH0sXG4gICAgeyB4OiA2MTgsIHk6IDMxNSwgcjogNSwgZzogNSwgYjogNSB9LFxuXG4gICAgLy8gZ29vZ2xlIGJ0blxuICAgIHsgeDogMTgwLCB5OiAyMDAsIHI6IDI1MSwgZzogMTg4LCBiOiA1IH0sXG4gICAgeyB4OiAxODUsIHk6IDIwNSwgcjogOTIsIGc6IDE4NSwgYjogMTE2IH0sXG4gICAgeyB4OiAzMDcsIHk6IDIwMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gZmIgYnRuXG4gICAgeyB4OiAzMzQsIHk6IDIwMSwgcjogMjA1LCBnOiAyMjUsIGI6IDI1MiB9LFxuICAgIHsgeDogMzMzLCB5OiAyMDEsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICAgIHsgeDogMzMxLCB5OiAxOTcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGhpdmUgYnRuXG4gICAgeyB4OiAxODIsIHk6IDIyOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTg1LCB5OiAyMzQsIHI6IDI0MCwgZzogMjQ2LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwNywgeTogMjM1LCByOiAxOCwgZzogMTE5LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAyNDMsIHk6IDIzMiB9LCAvLyBsb2dpbiBoaXZlXG4gIHsgeDogMjQzLCB5OiAyMzIgfSAvLyBsb2dpbiBoaXZlXG4pO1xuXG5leHBvcnQgY29uc3QgbG9nSW5IaXZlID0gbmV3IFBhZ2UoXG4gICdsb2dJbkhpdmUnLFxuICBbXG4gICAgeyB4OiAyMjYsIHk6IDc2LCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG4gICAgeyB4OiAzMjIsIHk6IDc4LCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG4gICAgeyB4OiA1MzUsIHk6IDQyLCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG4gICAgeyB4OiA2MjQsIHk6IDQwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2NiwgeTogMzMzLCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiA0NCwgeTogMjM1LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAxMzYsIHk6IDIzNiwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogMjU4LCB5OiAyMzIsIHI6IDE0MywgZzogMTg2LCBiOiAyMjcgfSxcbiAgICB7IHg6IDU0OCwgeTogMTY5LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU4MywgeTogMTk1LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDQzLCB5OiAxNDIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzLCB5OiAxOTUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NTQsIHk6IDE3NyB9LCAvLyBsb2dpblxuICB7IHg6IDU3NCwgeTogNDAgfSAvLyBiYWNrIHRvIGdhbWVcbik7XG5cbi8vIHN1aXQgZm9yIGRwaSA5MFxuZXhwb3J0IGNvbnN0IGxvZ0luSGl2ZTkwID0gbmV3IFBhZ2UoXG4gICdsb2dJbkhpdmU5MCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTEsIHk6IDE3MSwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogMTAsIHk6IDMyNiwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNjI4LCB5OiAxMDcsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDYyNywgeTogMzI2LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMzE5LCB5OiA3MiwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogMzM4LCB5OiA3MSwgcjogMTQ4LCBnOiAxNDgsIGI6IDE0OCB9LFxuICAgIHsgeDogMzc1LCB5OiA3MSwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuXG4gICAgLy8gaW5wdXRcbiAgICB7IHg6IDQ4MCwgeTogMTU1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0ODAsIHk6IDE5OSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gbG9naW4gYnRuXG4gICAgeyB4OiA1NTgsIHk6IDE2MCwgcjogNDMsIGc6IDEzMiwgYjogMjE2IH0sXG4gICAgeyB4OiA1ODksIHk6IDE3NSwgcjogNDMsIGc6IDEzMiwgYjogMjE2IH0sXG4gICAgeyB4OiA1MzIsIHk6IDE2MiwgcjogMTEwLCBnOiAxNzEsIGI6IDIyOCB9LFxuICBdLFxuICB7IHg6IDU1NCwgeTogMTc3IH0sIC8vIGxvZ2luXG4gIHsgeDogNTc0LCB5OiA0MCB9IC8vIGJhY2sgdG8gZ2FtZVxuKTtcblxuZXhwb3J0IGNvbnN0IGZiTG9nSW45MCA9IG5ldyBQYWdlKCdmYkxvZ0luOTAnLCBbXG4gIC8vIGZiIGxvZ29cbiAgeyB4OiAzMDQsIHk6IDE0LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMTYsIHk6IDE3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzA5LCB5OiAzMSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzI1LCB5OiAzMiwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzMxLCB5OiAxNSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzI0LCB5OiAxMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDM0NSwgeTogMTEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMjMsIHk6IDE5LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMzAsIHk6IDIzLCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcblxuICAvLyBiZ1xuICB7IHg6IDczLCB5OiAxMDIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1MiwgeTogMjYxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzEyLCB5OiAzMTUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1OTEsIHk6IDE5NywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDQ5MiwgeTogNjIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMTgsIHk6IDg2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgLy8gbG9naW4gYnRuIGJnXG4gIHsgeDogMjAzLCB5OiAxOTQsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDQzMywgeTogMTk3LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ29vZ2xlTG9nSW45MCA9IG5ldyBQYWdlKCdnb29nbGVMb2dJbjkwJywgW1xuICAvLyBnb29nbGUgbG9nb1xuICB7IHg6IDI5NSwgeTogNjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMDYsIHk6IDY3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzE4LCB5OiA2OCwgcjogMjUxLCBnOiAxODgsIGI6IDUgfSxcbiAgeyB4OiAzMjEsIHk6IDY4LCByOiAyNTMsIGc6IDIyMSwgYjogMTMwIH0sXG4gIHsgeDogMzI5LCB5OiA2OCwgcjogNjYsIGc6IDEzMywgYjogMjQ0IH0sXG4gIHsgeDogMzM1LCB5OiA2OCwgcjogMjM0LCBnOiA2NywgYjogNTMgfSxcblxuICAvLyBiZ1xuICB7IHg6IDk0LCB5OiAzMywgcjogNzUsIGc6IDEyOSwgYjogMjE4IH0sXG4gIHsgeDogNjcsIHk6IDIyNywgcjogNzksIGc6IDEzMiwgYjogMjIxIH0sXG4gIHsgeDogMTQyLCB5OiAzMjksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1NTksIHk6IDMzOCwgcjogNjEsIGc6IDExNCwgYjogMjAzIH0sXG4gIHsgeDogNTM5LCB5OiA4MCwgcjogNjMsIGc6IDExNywgYjogMjA1IH0sXG4gIHsgeDogMzUwLCB5OiAzMzQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAvLyBsb2dpbiBidG4gYmdcbiAgeyB4OiA0NzgsIHk6IDIyNCwgcjogMjYsIGc6IDExNSwgYjogMjMyIH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRGF0YSA9IG5ldyBQYWdlKFxuICAnZG93bmxvYWREYXRhJyxcbiAgW1xuICAgIHsgeDogMTAzLCB5OiA0MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTY3LCB5OiA1OSwgcjogMjIsIGc6IDMwLCBiOiAzMSB9LFxuICAgIHsgeDogMTg4LCB5OiA1OCwgcjogMzksIGc6IDQ3LCBiOiA0NyB9LFxuICAgIHsgeDogMjAwLCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjA5LCB5OiA2MiwgcjogODQsIGc6IDg4LCBiOiA5MiB9LFxuICAgIHsgeDogMjM2LCB5OiA1OCwgcjogNTAsIGc6IDU2LCBiOiA1OCB9LFxuICAgIHsgeDogMjQzLCB5OiA1OCwgcjogMTQ0LCBnOiAxNTAsIGI6IDE1MiB9LFxuICAgIHsgeDogMjkwLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzE3LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzU1LCB5OiA1NCwgcjogOTcsIGc6IDEwMSwgYjogMTA1IH0sXG4gICAgeyB4OiA0MDcsIHk6IDYwLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA1MTMsIHk6IDQ4LCByOiAxODEsIGc6IDE4MiwgYjogMTg4IH0sXG4gICAgeyB4OiA1MjcsIHk6IDU0LCByOiAxNzcsIGc6IDE3NSwgYjogMTc3IH0sXG4gICAgeyB4OiA1MTksIHk6IDYwLCByOiAxODEsIGc6IDE4NSwgYjogMTg5IH0sXG4gICAgeyB4OiAxNjgsIHk6IDI5OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjI0LCB5OiAyOTYsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAyNDksIHk6IDI5OCwgcjogMTAyLCBnOiAxMzMsIGI6IDE3MSB9LFxuICAgIHsgeDogMzkxLCB5OiAyOTksIHI6IDE5NSwgZzogMjIxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ2MSwgeTogMzAyLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0MjMsIHk6IDMwMywgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUyNiwgeTogMzE4LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNDIxLCB5OiAyOTMgfSxcbiAgeyB4OiA0MjEsIHk6IDI5MyB9XG4pO1xuZXhwb3J0IGNvbnN0IHByb2dyZXNzQmFyUnVubmluZyA9IG5ldyBQYWdlKFxuICAncHJvZ3Jlc3NCYXJSdW5uaW5nJyxcbiAgW1xuICAgIC8vIHByb2dyZXNzIGJhclxuICAgIHsgeDogMjA3LCB5OiAzMTYsIHI6IDAsIGc6IDE1MCwgYjogMjU1IH0sXG4gICAgeyB4OiAxOSwgeTogMzIwLCByOiA4LCBnOiAxMiwgYjogMTYgfSxcbiAgICB7IHg6IDYyOCwgeTogMzIwLCByOiA4LCBnOiAxMiwgYjogMTYgfSxcbiAgICB7IHg6IDE5NSwgeTogMzI5LCByOiAyNTUsIGc6IDIwMiwgYjogMCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBtYWluID0gbmV3IFBhZ2UoXG4gICdtYWluJyxcbiAgW1xuICAgIC8vIG5hdmkgYmFyIHJpZ2h0XG4gICAgeyB4OiA2MjIsIHk6IDksIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDU5OCwgeTogMTEsIHI6IDIxNCwgZzogMjI2LCBiOiAyMzggfSxcbiAgICB7IHg6IDU5MiwgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgeyB4OiA0OTQsIHk6IDE1LCByOiAyMzksIGc6IDE3OSwgYjogMjggfSxcbiAgICB7IHg6IDUwMywgeTogMTcsIHI6IDc0LCBnOiA4NCwgYjogOTAgfSxcbiAgICB7IHg6IDM4OSwgeTogMTIsIHI6IDE5NywgZzogMjAyLCBiOiAxOTcgfSxcbiAgICB7IHg6IDMxMywgeTogMTEsIHI6IDE3NCwgZzogMTc4LCBiOiAxNzkgfSxcbiAgICB7IHg6IDI5NywgeTogMTUsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcblxuICAgIC8vIGJ0biBsZWZ0LCB3aXRoIHNldHRpbmdzXG4gICAgeyB4OiAzMSwgeTogMzI2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA4NywgeTogMzI2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxMzcsIHk6IDMyNiwgcjogMTA4LCBnOiAxMTQsIGI6IDEwMCB9LFxuICAgIHsgeDogMTg5LCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI0MywgeTogMzI4LCByOiAxMjYsIGc6IDEyOSwgYjogMTI2IH0sXG4gICAgeyB4OiAyOTksIHk6IDMyOCwgcjogMTAzLCBnOiAxMDcsIGI6IDk5IH0sXG5cbiAgICAvLyBidG4gcmlnaHRcbiAgICB7IHg6IDUyMywgeTogMzM2LCByOiAyNSwgZzogNzMsIGI6IDE0MCB9LFxuICAgIHsgeDogNTc5LCB5OiAzMzgsIHI6IDkwLCBnOiAyNCwgYjogMjUgfSxcbiAgICB7IHg6IDU5OSwgeTogMzI5LCByOiAyMzcsIGc6IDIyNCwgYjogMjI4IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG1haW5CdG5zID0ge1xuICBsZWFndWVNb2RlOiB7IHg6IDIwNCwgeTogMTU0IH0sXG4gIGJhdHRsZU1vZGU6IHsgeDogMzUwLCB5OiAxNDUgfSxcbiAgc3BlY2lhbE1vZGU6IHsgeDogNDM4LCB5OiAxNDUgfSxcbiAgY2x1Yk1vZGU6IHsgeDogNTU2LCB5OiAxNDUgfSxcbiAgc2V0dGluZ3M6IHsgeDogMjk4LCB5OiAzMjcgfSxcbiAgYWRUYWI6IHsgeDogNTkwLCB5OiA3NyB9LFxuICBhY2hpZXZlbWVudDogeyB4OiAxMzksIHk6IDMyMCB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncycsXG4gIFtcbiAgICAvLyBuYXZpIGluIHJpZ2h0XG4gICAgLy8geyB4OiA2MjUsIHk6IDcsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICAvLyB7IHg6IDU5MywgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgLy8geyB4OiA1OTAsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIC8vIHsgeDogNDg3LCB5OiAxNSwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIC8vIHsgeDogNDgxLCB5OiAxNSwgcjogNzcsIGc6IDg2LCBiOiA5MyB9LFxuICAgIC8vIHsgeDogMzkxLCB5OiAxMSwgcjogNzksIGc6IDgwLCBiOiA3OSB9LFxuICAgIC8vIHsgeDogMzc4LCB5OiAxNiwgcjogMTMzLCBnOiAxNTAsIGI6IDE2OSB9LFxuICAgIC8vIHsgeDogMzEzLCB5OiAxMSwgcjogMTc4LCBnOiAxNzgsIGI6IDE3OSB9LFxuXG4gICAgLy8gYmcgb2YgcmlnaHQgc2VjdGlvblxuICAgIHsgeDogNDc4LCB5OiAxMTksIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ3NiwgeTogMTc1LCByOiAzNiwgZzogNDAsIGI6IDQ0IH0sXG4gICAgeyB4OiA0NzYsIHk6IDIyOCwgcjogMTA3LCBnOiA5NywgYjogOTAgfSxcbiAgICB7IHg6IDQ3NCwgeTogMjgzLCByOiA2NiwgZzogNzcsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI5MywgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYwNSwgeTogMTc4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDgsIHk6IDEyMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuXG4gICAgLy8gZ29vZ2xlIHBsYXkgZ2FtZSBpY29uIGluIHJpZ2h0IHNlY3Rpb25cbiAgICB7IHg6IDQ5MCwgeTogMTE1LCByOiAzNSwgZzogMzgsIGI6IDUxIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNSwgeTogMzEyLCByOiAxOTMsIGc6IDE5OCwgYjogMTkxIH0sXG4gICAgeyB4OiAzOSwgeTogMzIyLCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1RhYnMgPSB7XG4gIHNvdW5kQW5kTGFuVGFiOiB7IHg6IDIyLCB5OiA1NSB9LFxuICBncmFwaGljVGFiOiB7IHg6IDExMSwgeTogNTUgfSxcbn07XG5leHBvcnQgY29uc3Qgc2V0dGluZ3NCdG5zID0ge1xuICBsZWFndWVSZXNldDogeyB4OiA1NjIsIHk6IDIxNyB9LFxufTtcblxuLy8gRklYTUU6IGFkZCBsYW4gY2hhbmdlIHBhZ2VzXG5leHBvcnQgY29uc3Qgc2V0dGluZ3NTb3VuZFRhYiA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3Mvc291bmQnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogNjIxLCB5OiA4LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEwLCByOiA3NCwgZzogOTcsIGI6IDEzMSB9LFxuICAgIHsgeDogNTAzLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogMzkyLCB5OiAxMiwgcjogMTc2LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogMzE1LCB5OiA4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE3LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvLyBoaWdobGlnaHRlZCBzb3VuZCB0YWJcbiAgICB7IHg6IDE5LCB5OiA2MCwgcjogMCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDIwLCB5OiA3MSwgcjogMCwgZzogODksIGI6IDIyMiB9LFxuICAgIHsgeDogOTUsIHk6IDY5LCByOiAwLCBnOiA5MiwgYjogMjMwIH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAxMTcsIHk6IDU2LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAyMDUsIHk6IDU0LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzMDAsIHk6IDUyLCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzOTQsIHk6IDU1LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG5cbiAgICAvLyBiZyB0YWJsZVxuICAgIHsgeDogMjAsIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAyMCwgeTogMjkyLCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA0NTksIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NjAsIHk6IDI4OSwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuXG4gICAgLy8gcmlnaHQgc2lkZWJhciBiZ1xuICAgIHsgeDogNDgwLCB5OiAxMjAsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ4MywgeTogMTc5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0ODUsIHk6IDIzMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNDg2LCB5OiAyODYsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMiwgeTogMTE5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTAsIHk6IDE4MCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMCwgeTogMjg3LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiQnRucyA9IHtcbiAgbGFuZzogeyB4OiA0MDEsIHk6IDE5MCB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0ID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncy9zb3VuZC9sYW5TZWxlY3QnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDI5MywgeTogMTgsIHI6IDI1LCBnOiAyMCwgYjogMjUgfSxcbiAgICB7IHg6IDQzLCB5OiAzNDMsIHI6IDgsIGc6IDQsIGI6IDAgfSxcbiAgICB7IHg6IDYyMiwgeTogMzQ1LCByOiA4LCBnOiA4LCBiOiA4IH0sXG5cbiAgICAvLyBsYW5nIGVuZ2xpc2ggYnRuXG4gICAgeyB4OiAxNjAsIHk6IDEyNywgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE5MCwgeTogMTMyLCByOiA1OCwgZzogOTIsIGI6IDEyOSB9LFxuICAgIHsgeDogMjEzLCB5OiAxMzMsIHI6IDgwLCBnOiAxMTMsIGI6IDE1MSB9LFxuICAgIHsgeDogMjI5LCB5OiAxMzMsIHI6IDE2NiwgZzogMTg5LCBiOiAyMTggfSxcbiAgICB7IHg6IDI0MSwgeTogMTMzLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjY2LCB5OiAxNDIsIHI6IDQ5LCBnOiA4MSwgYjogMTE1IH0sXG4gICAgeyB4OiAyODIsIHk6IDEyOSwgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE2NiwgeTogMTQ1LCByOiA0MSwgZzogNzcsIGI6IDExNSB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjYsIHk6IDMxNiwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogNDMsIHk6IDMyMSwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogMzQsIHk6IDMyOSwgcjogMjAxLCBnOiAyMDYsIGI6IDIwMSB9LFxuICBdLFxuICB7IHg6IDIwMCwgeTogMTMxIH0sIC8vIGVuZ2xpc2ggYnRuXG4gIHsgeDogMjAwLCB5OiAxMzEgfSAvLyBlbmdsaXNoIGJ0blxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0UHJvY2VlZEJ0bnMgPSB7XG4gIHllczogeyB4OiA0MDcsIHk6IDMwNyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWIgPSBuZXcgUGFnZShcbiAgJ3NldHRpbmdzL2dyYXBoJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDYyMSwgeTogOCwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTk1LCB5OiAxMCwgcjogNzQsIGc6IDk3LCBiOiAxMzEgfSxcbiAgICB7IHg6IDUwMywgeTogMTUsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDM5MiwgeTogMTIsIHI6IDE3NiwgZzogMTczLCBiOiAxNzYgfSxcbiAgICB7IHg6IDMxNSwgeTogOCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMzAyLCB5OiAxNywgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuXG4gICAgLy8gaGlnaGxpZ2h0ZWQgZ3JhcGggdGFiXG4gICAgeyB4OiAxMjMsIHk6IDU5LCByOiAwLCBnOiAxMDEsIGI6IDI1NCB9LFxuICAgIHsgeDogMTQ5LCB5OiA1OSwgcjogMjgsIGc6IDExOSwgYjogMjU0IH0sXG4gICAgeyB4OiAxNzcsIHk6IDY0LCByOiAwLCBnOiA5NywgYjogMjM4IH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAzNywgeTogNjMsIHI6IDU4LCBnOiA2NSwgYjogNzQgfSxcbiAgICB7IHg6IDYyLCB5OiA2MiwgcjogMTM0LCBnOiAxNDMsIGI6IDE1OCB9LFxuICAgIHsgeDogMjMyLCB5OiA1NywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogMjY3LCB5OiA2MywgcjogMTU2LCBnOiAxNjcsIGI6IDE4MCB9LFxuICAgIHsgeDogMzIyLCB5OiA2MywgcjogMTYwLCBnOiAxNjUsIGI6IDE4MCB9LFxuICAgIHsgeDogMzUzLCB5OiA2MywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogNDAxLCB5OiA2NCwgcjogMTcxLCBnOiAxNzksIGI6IDE5MiB9LFxuICAgIHsgeDogNDQwLCB5OiA2MSwgcjogMTU1LCBnOiAxNTksIGI6IDE3NyB9LFxuXG4gICAgLy8gYmcgdGFibGVcbiAgICB7IHg6IDE5LCB5OiA5MCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogMjMsIHk6IDI5MSwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU5LCB5OiA4NCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU4LCB5OiAyODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWJCdG5zID0ge1xuICBxdWFsaXR5Tm9ybWFsOiB7IHg6IDIxMiwgeTogMTIwIH0sXG4gIG1heEZQUzMwOiB7IHg6IDgzLCB5OiAxNzUgfSxcbiAgcG93ZXJTYXZlT246IHsgeDogMjIyLCB5OiAyMjIgfSxcbiAgYmlnSGVhZE1vZGVPZmY6IHsgeDogODYsIHk6IDI4MyB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcblxuLy8gdGVsbCB1c2VyIHRoZSBzZWFzb24gc3RhcnRcbmV4cG9ydCBjb25zdCBuZXdTZWFzb24gPSBuZXcgUGFnZShcbiAgJ25ld1NlYXNvbicsXG4gIFtcbiAgICAvLyBiZyBib3R0b21cbiAgICB7IHg6IDUzLCB5OiAzMzQsIHI6IDE2LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNjEzLCB5OiAzMzQsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIG5leHQgb3Igb2sgYnRuIGJnXG4gICAgeyB4OiAyNTQsIHk6IDI5MiwgcjogMCwgZzogMTE3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI1NSwgeTogMzExLCByOiA4LCBnOiAxMDIsIGI6IDI0NyB9LFxuICAgIHsgeDogMzc2LCB5OiAyOTIsIHI6IDAsIGc6IDExNywgYjogMjQ3IH0sXG4gICAgeyB4OiAzNzYsIHk6IDMxMywgcjogMTYsIGc6IDEwMSwgYjogMjU0IH0sXG5cbiAgICAvLyBsb2dvIGluIGNlbnRlciByaWdodFxuICAgIHsgeDogMzU0LCB5OiAxNDcsIHI6IDAsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzc0LCB5OiAxNTgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4NiwgeTogMTQ5LCByOiAxOTIsIGc6IDIwLCBiOiA2NSB9LFxuICBdLFxuICB7IHg6IDMyNCwgeTogMzA1IH0sXG4gIHsgeDogMzI0LCB5OiAzMDUgfVxuKTtcblxuLy8gY2hlY2sgdGhlcmUgbWlnaHQgYmUgbWFueSBkaWZmIHRpdGxlcyBmb3IgZW5kIHNlYXNvblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvbiA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uJyxcbiAgW1xuICAgIC8vIHhcbiAgICB7IHg6IDUxOCwgeTogNDcsIHI6IDcxLCBnOiA3MywgYjogNzIgfSxcblxuICAgIC8vIGxvZ28gb24gY2VudGVyIHJpZ2h0XG4gICAgeyB4OiAzNTcsIHk6IDE0NCwgcjogMCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzNjksIHk6IDE1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzg1LCB5OiAxNDAsIHI6IDE4OSwgZzogMTQsIGI6IDU4IH0sXG5cbiAgICAvLyBuZXh0XG4gICAgeyB4OiAyODAsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxMiwgeTogMjk5LCByOiAxNiwgZzogMTE1LCBiOiAyNDIgfSxcbiAgICB7IHg6IDMzOSwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzY4LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG4vLyBhZnRlciBlbmRTZWFzb24sIHh4IHNlYXNvbiBpcyBvdmVyXG5leHBvcnQgY29uc3QgZW5kU2Vhc29uUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZCcsXG4gIFtcbiAgICAvLyBob3cgd291bGQgeW91IGxpa2UgdG8gcHJvY2VlZCB3aXRoIG5leHQgc2Vhc29uID9cbiAgICB7IHg6IDQ1MiwgeTogMzgsIHI6IDE5NSwgZzogMjEzLCBiOiAyMjkgfSxcbiAgICB7IHg6IDUwOCwgeTogMzYsIHI6IDgsIGc6IDg1LCBiOiAxNDggfSxcbiAgICB7IHg6IDU0NSwgeTogMzQsIHI6IDI1MywgZzogMjUzLCBiOiAyNTQgfSxcbiAgICB7IHg6IDU2NiwgeTogMzQsIHI6IDQzLCBnOiAxMDcsIGI6IDE2NyB9LFxuICAgIHsgeDogMjc3LCB5OiAzNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTY4LCB5OiAzMSwgcjogMjE5LCBnOiAyMzIsIGI6IDIzNyB9LFxuICAgIHsgeDogNTY4LCB5OiAzOCwgcjogNDUsIGc6IDEwNywgYjogMTY1IH0sXG4gICAgeyB4OiA1NTMsIHk6IDM4LCByOiAzMCwgZzogOTgsIGI6IDE2MCB9LFxuXG4gICAgLy8gYmcgY29ybmVyXG4gICAgeyB4OiA4LCB5OiAxMywgcjogMCwgZzogOTcsIGI6IDE4MSB9LFxuICAgIHsgeDogOCwgeTogMzQzLCByOiAxNiwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyNSwgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYyOCwgeTogMzUwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTM5LCB5OiAzMjUsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiA1NTgsIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTcxLCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNiwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvblByb2NlZWRTZWxlY3RlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkJyxcbiAgW1xuICAgIC8vIGJnIGNvcm5lclxuICAgIHsgeDogOCwgeTogMTMsIHI6IDAsIGc6IDk3LCBiOiAxODEgfSxcbiAgICB7IHg6IDgsIHk6IDM0MywgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA2MjUsIHk6IDIyLCByOiAwLCBnOiA4OSwgYjogMTY0IH0sXG4gICAgeyB4OiA2MjgsIHk6IDM1MCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDUzOSwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogNTU4LCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3MSwgeTogMzI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDYsIHk6IDMyNSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNiwgeTogMTksIHI6IDAsIGc6IDkzLCBiOiAxNzMgfSxcbiAgICB7IHg6IDE5LCB5OiAzMzcsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDYyMywgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYxOSwgeTogMjMyLCByOiAxNiwgZzogMjQsIGI6IDE2IH0sXG5cbiAgICAvLyBOT1JNQUwgTEVBR1VFXG4gICAgeyB4OiAxMjUsIHk6IDE2NCwgcjogMjE0LCBnOiAyMjAsIGI6IDIyMSB9LFxuICAgIHsgeDogMTQzLCB5OiAxNjUsIHI6IDQxLCBnOiAxMDUsIGI6IDI4IH0sXG5cbiAgICAvLyBtb2RlIGJnXG4gICAgeyB4OiA0NiwgeTogODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDQ3LCB5OiAyODgsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDMzNywgeTogNzksIHI6IDU4LCBnOiA1NywgYjogNjYgfSxcbiAgICB7IHg6IDM0MiwgeTogMjg0LCByOiA1OCwgZzogNTcsIGI6IDY2IH0sXG5cbiAgICAvLyByZXdhcmQgaW5mbyBpbiBib3RoXG4gICAgeyB4OiAxMzgsIHk6IDI3MCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEwNiwgeTogMjcyLCByOiA2NSwgZzogMTQ3LCBiOiAyNDkgfSxcbiAgICB7IHg6IDM5NSwgeTogMjczLCByOiAxOTUsIGc6IDIyMSwgYjogMjUzIH0sXG4gICAgeyB4OiA0MjEsIHk6IDI3NiwgcjogOCwgZzogMTAyLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlQnRucyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgeDogMTcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbiAgbWFzdGVyOiB7XG4gICAgeDogNDcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE2LCB5OiAxOSwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMTksIHk6IDMzNywgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNjIzLCB5OiAyMiwgcjogMCwgZzogODksIGI6IDE2NCB9LFxuICAgIHsgeDogNjE5LCB5OiAyMzIsIHI6IDE2LCBnOiAyNCwgYjogMTYgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzUsIHk6IDMyNiwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDU3MCwgeTogMzMwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyOCwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbi8vIGEgZGlhbG9nIHRvIGNvbmZpcm0gbGVhZ3VlIHJlc2V0XG5leHBvcnQgY29uc3QgbGVhZ3VlUmVzZXREaWFsb2dZTiA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmVzZXREaWFsb2dZTicsXG4gIFtcbiAgICB7IHg6IDExNSwgeTogNTQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwOCwgeTogMzA1LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MDgsIHk6IDMwOCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiA1MCwgcjogMTgxLCBnOiAxODIsIGI6IDE4MSB9LFxuICAgIHsgeDogNTMxLCB5OiA0OCwgcjogMTY3LCBnOiAxNzIsIGI6IDE3NCB9LFxuICAgIHsgeDogMjYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzE5LCB5OiA2MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzQ3LCB5OiA2MiwgcjogMTI3LCBnOiAxMzMsIGI6IDEzNyB9LFxuICAgIHsgeDogMzc0LCB5OiA2MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjIwLCB5OiAzMDIsIHI6IDQxLCBnOiA3MywgYjogMTIzIH0sXG4gICAgeyB4OiAzOTksIHk6IDMwNiwgcjogMTU1LCBnOiAxOTUsIGI6IDI1MSB9LFxuICAgIHsgeDogNDQzLCB5OiAzMDUsIHI6IDgsIGc6IDEwNSwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMTkzLCB5OiAzMDAgfSwgLy8gbm8sIGNhbmNlbFxuICB7IHg6IDM3MSwgeTogMzAwIH0gLy8geWVzLCByZXNldFxuKTtcblxuLy8gYSBkaWFsb2cgdG8gc2VsZWN0IHllYXIsIG5vcm1hbCBvciBtYXN0ZXIgbGVhZ3VlXG4vLyBUT0RPOiBsZXQgdXNlciBjYW4gc2VsZWN0IHNwZWNpZmljIG1vZGUgYW5kIHllYXIgdG8gcGxheVxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJlc2V0RGlhbG9nID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXNldERpYWxvZycsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjcwLCB5OiA0MCwgcjogNDAsIGc6IDQ0LCBiOiA0OSB9LFxuICAgIHsgeDogMjkzLCB5OiA0NCwgcjogMTQ2LCBnOiAxNDgsIGI6IDE1NSB9LFxuICAgIHsgeDogMzI2LCB5OiA0NSwgcjogMTkzLCBnOiAxOTcsIGI6IDIwNiB9LFxuICAgIHsgeDogMzUxLCB5OiA0MiwgcjogMjEsIGc6IDI2LCBiOiAzMCB9LFxuICAgIHsgeDogMzY0LCB5OiA0MiwgcjogMTg4LCBnOiAxOTIsIGI6IDE5OCB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDEyMSwgeTogMjUsIHI6IDE5MSwgZzogMTk5LCBiOiAyMDYgfSxcbiAgICB7IHg6IDExNiwgeTogMjg4LCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG4gICAgeyB4OiA1MTgsIHk6IDM1LCByOiA3MiwgZzogNzUsIGI6IDgwIH0sXG4gICAgeyB4OiA1MTcsIHk6IDI5MiwgcjogMjM5LCBnOiAyNDIsIGI6IDIzOSB9LFxuXG4gICAgLy8gY2FuY2VsIGJ0biBiZ1xuICAgIHsgeDogMTg1LCB5OiAyODIsIHI6IDQxLCBnOiA3NSwgYjogMTE4IH0sXG5cbiAgICAvLyByZXNldCB0byB5ZWFyIFhYIGJ0biBiZ1xuICAgIHsgeDogMzI3LCB5OiAyOTcsIHI6IDMsIGc6IDc5LCBiOiAyMzUgfSxcbiAgXSxcbiAgeyB4OiAzNzEsIHk6IDMwMCB9LCAvLyByZXNldCB0byB5ZWFyIFhYXG4gIHsgeDogMTkzLCB5OiAzMDAgfSAvLyBjYW5jZWxcbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVSZXNldERpYWxvZ0J0bnMgPSB7XG4gIG5vcm1hbDogeyB4OiAyMTgsIHk6IDEwNSB9LFxuICBtYXN0ZXI6IHsgeDogNDAyLCB5OiAxMDUgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RTZWFzb25Nb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RTZWFzb25Nb2RlJyxcbiAgW1xuICAgIHsgeDogMTA0LCB5OiAxNiwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMjM1LCB5OiAzNywgcjogMTQzLCBnOiAxODEsIGI6IDIwNyB9LFxuICAgIHsgeDogMzA5LCB5OiAzNiwgcjogMTQ1LCBnOiAxODIsIGI6IDIwOSB9LFxuICAgIHsgeDogMzM3LCB5OiAzOCwgcjogMTAzLCBnOiAxNDksIGI6IDE5MSB9LFxuICAgIHsgeDogMzc2LCB5OiAzMiwgcjogMjQ1LCBnOiAyNDcsIGI6IDI1MyB9LFxuICAgIHsgeDogNDIyLCB5OiAzNiwgcjogMTQ1LCBnOiAxNzcsIGI6IDIwOSB9LFxuICAgIHsgeDogNDAsIHk6IDc1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTQsIHk6IDE4MywgcjogMzMsIGc6IDM2LCBiOiAzMyB9LFxuICAgIHsgeDogMzQxLCB5OiA5MywgcjogNDEsIGc6IDQ4LCBiOiA0OSB9LFxuICAgIHsgeDogNTM5LCB5OiAzMjMsIHI6IDAsIGc6IDY5LCBiOiAxNDkgfSxcbiAgICB7IHg6IDU1MywgeTogMzI4LCByOiAwLCBnOiA2NSwgYjogMTQ4IH0sXG4gIF0sXG4gIHsgeDogMTc4LCB5OiAxODMgfSxcbiAgeyB4OiAxNzgsIHk6IDE4MyB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCcsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMTc5LCB5OiA2MCwgcjogOCwgZzogNjUsIGI6IDExNSB9LFxuICAgIHsgeDogMTk1LCB5OiA1OSwgcjogNTIsIGc6IDk5LCBiOiAxNDEgfSxcbiAgICB7IHg6IDI0NSwgeTogNTYsIHI6IDE3NywgZzogMTk4LCBiOiAyMTIgfSxcbiAgICB7IHg6IDM2MSwgeTogNTcsIHI6IDUsIGc6IDY2LCBiOiAxMTUgfSxcbiAgICB7IHg6IDQzOSwgeTogNTYsIHI6IDE5NCwgZzogMjA4LCBiOiAyMjEgfSxcbiAgICB7IHg6IDQ4MywgeTogNTYsIHI6IDAsIGc6IDY1LCBiOiAxMTUgfSxcblxuICAgIC8vIGFtb3VudCB0aXRsZSBiZ1xuICAgIHsgeDogMzAsIHk6IDEwNCwgcjogMjMwLCBnOiAyMjcsIGI6IDIzMCB9LFxuICAgIHsgeDogNzAsIHk6IDEwMCwgcjogMjI4LCBnOiAyMjgsIGI6IDIyOCB9LFxuICAgIHsgeDogMTE2LCB5OiAxMDAsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcbiAgICB7IHg6IDIwOSwgeTogMTAyLCByOiA0MSwgZzogNDksIGI6IDU4IH0sXG4gICAgeyB4OiAyNDQsIHk6IDEwMiwgcjogMTE0LCBnOiAxMjEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjc2LCB5OiAxMDIsIHI6IDQ0LCBnOiA1NCwgYjogNjYgfSxcbiAgICB7IHg6IDM2MSwgeTogOTgsIHI6IDU0LCBnOiA2MCwgYjogNzAgfSxcbiAgICB7IHg6IDQwOSwgeTogMTAyLCByOiA3NCwgZzogNzksIGI6IDg3IH0sXG4gICAgeyB4OiA0NTYsIHk6IDk5LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA0OTYsIHk6IDk3LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA1MzcsIHk6IDEwMSwgcjogOTIsIGc6IDk4LCBiOiAxMDYgfSxcbiAgICB7IHg6IDU4MiwgeTogOTksIHI6IDIwMCwgZzogMjA0LCBiOiAyMDcgfSxcbiAgICB7IHg6IDU5OCwgeTogOTksIHI6IDIzMCwgZzogMjMxLCBiOiAyMzAgfSxcbiAgXSxcbiAgeyB4OiAzOSwgeTogMzE0IH0sXG4gIHsgeDogMzksIHk6IDMxNCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zID0ge1xuICBmdWxsOiB7IHg6IDI1LCB5OiAyODUgfSxcbiAgaGFsZjogeyB4OiAyNDUsIHk6IDI4NSB9LFxuICBxdWFydGVyOiB7IHg6IDQwMCwgeTogMTEyIH0sXG4gIHBvc3Q6IHsgeDogNjAwLCB5OiAxMTIgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RZZWFyID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RZZWFyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMDMsIHk6IDI0LCByOiAyMDEsIGc6IDIwMSwgYjogMjA1IH0sXG4gICAgeyB4OiAxMDQsIHk6IDI4OSwgcjogMjQwLCBnOiAyNDAsIGI6IDI0MCB9LFxuICAgIHsgeDogNTE5LCB5OiAzNCwgcjogNzQsIGc6IDcxLCBiOiA3NCB9LFxuICAgIHsgeDogNTI4LCB5OiAyOTUsIHI6IDI0NCwgZzogMjQyLCBiOiAyNDQgfSxcblxuICAgIC8vIHRpdGxlIHNlbGVjdCB5ZWFyXG4gICAgeyB4OiAyNzcsIHk6IDM4LCByOiAxODIsIGc6IDE4NywgYjogMTkxIH0sXG4gICAgeyB4OiAzMTEsIHk6IDM0LCByOiAyMCwgZzogMjQsIGI6IDI5IH0sXG4gICAgeyB4OiAzNDIsIHk6IDQwLCByOiAyMSwgZzogMjUsIGI6IDMwIH0sXG4gICAgeyB4OiAzNTksIHk6IDQwLCByOiAxNiwgZzogMjYsIGI6IDMzIH0sXG5cbiAgICAvLyB5ZWFyIGJnXG4gICAgeyB4OiAyMzAsIHk6IDEzNiwgcjogNzEsIGc6IDc4LCBiOiA5NCB9LFxuICAgIHsgeDogNDAzLCB5OiAxNTEsIHI6IDcyLCBnOiA3OSwgYjogOTQgfSxcblxuICAgIC8vIHJlc2V0IHllYXIgYnRuIGJnXG4gICAgeyB4OiAzMjgsIHk6IDI5NiwgcjogMSwgZzogODEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDM5MiwgeTogMzAyIH0sXG4gIHsgeDogNTIwLCB5OiA0OSB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0WWVhckJ0bnMgPSB7XG4gIHByZXZZZWFyOiB7IHg6IDE3OCwgeTogMTU2IH0sXG4gIG5leHRZZWFyOiB7IHg6IDQ1NSwgeTogMTU2IH0sXG4gIHN1Ym1pdDogeyB4OiAyODUsIHk6IDMwMyB9LFxufTtcblxuLy8gKiBCYXR0bGVNb2Rlc1xuZXhwb3J0IGNvbnN0IGJhdHRsZU1vZGVQYW5lbCA9IG5ldyBQYWdlKFxuICAnYmF0dGxlTW9kZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDMwMSwgeTogNSwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogMzEzLCB5OiAxMCwgcjogMjI5LCBnOiAyMjUsIGI6IDIyOSB9LFxuICAgIHsgeDogMzI0LCB5OiA3LCByOiA1OCwgZzogOTcsIGI6IDEzMiB9LFxuICAgIHsgeDogMzg4LCB5OiAxMCwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzk2LCB5OiA2LCByOiAyNDIsIGc6IDI0MCwgYjogMjQyIH0sXG4gICAgeyB4OiA0OTIsIHk6IDEwLCByOiAyNDYsIGc6IDIwOCwgYjogNDUgfSxcbiAgICB7IHg6IDQ4NiwgeTogNCwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogNTk4LCB5OiAxMywgcjogMTA0LCBnOiAxMjYsIGI6IDE1MyB9LFxuICAgIHsgeDogNjE2LCB5OiAxMiwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuXG4gICAgLy8gYmcgaW4gYm90dG9tICh0b3Agd2lsbCBzaGluZSlcbiAgICB7IHg6IDksIHk6IDM0NiwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogNjIzLCB5OiAzNDQsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDM5NywgeTogMzQyLCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVsbWV0IHRvIGRpZmYgZ1NlbGVjdExlYWd1ZUdhbWVBbW91bnRcbiAgICB7IHg6IDgsIHk6IDEyMSwgcjogMTE1LCBnOiA0NCwgYjogNDEgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI1LCB5OiAzMTMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDQyLCB5OiAzMjAsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxLCB5OiAzMzMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sIC8vIGJhY2tcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5leHBvcnQgY29uc3QgYmF0dGxlTW9kZVBhbmVsQnRucyA9IHtcbiAgcmFua2VkQmF0dGxlOiB7IHg6IDI4NywgeTogMTYwIH0sXG4gIGZyaWVuZEJhdHRsZTogeyB4OiAyODcsIHk6IDI0NSB9LFxuICBwb3dlclJhbmtpbmc6IHsgeDogNTI2LCB5OiAxNjAgfSwgLy8gdW5zdXJlIHdoYXQgaXNcbiAgcHZwOiB7IHg6IDUyNSwgeTogMjQ1IH0sXG59O1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlUGFuZWwgPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCBpY29uXG4gICAgLy8gc29tZXRpbWVzIG5hdiBiYXIgd2lsbCBkaXNhcHBlYXJcbiAgICAvLyB7IHg6IDMxMiwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIC8vIHsgeDogMzkwLCB5OiAxMiwgcjogMTI3LCBnOiAxMjgsIGI6IDEyNyB9LFxuICAgIC8vIHsgeDogNDkzLCB5OiAxMywgcjogMjA4LCBnOiAxODksIGI6IDUxIH0sXG4gICAgLy8geyB4OiA1OTcsIHk6IDEzLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuXG4gICAgLy8gYmcgaW4gbGVmdFxuICAgIC8vIHsgeDogMjIsIHk6IDY2LCByOiAxODksIGc6IDE5MCwgYjogMTg5IH0sXG4gICAgLy8geyB4OiAxNiwgeTogMTk0LCByOiAyMzAsIGc6IDIyNywgYjogMjMwIH0sXG4gICAgLy8geyB4OiAxOCwgeTogMjYwLCByOiAyNDcsIGc6IDI0MywgYjogMjQ3IH0sXG5cbiAgICAvLyB0ZWFtIHN1cHBvcnQgYmdcbiAgICB7IHg6IDQ4NywgeTogODYsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxNCwgeTogOTUsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcblxuICAgIC8vIGJnIG9mIHdpbi9sb3NlIHJhdGlvIGluIGJvdHRvbSBsZWZ0XG4gICAgeyB4OiAxNDQsIHk6IDI4NiwgcjogNjYsIGc6IDYxLCBiOiA2NiB9LFxuICAgIHsgeDogMzU0LCB5OiAyODYsIHI6IDY2LCBnOiA2OSwgYjogNjYgfSxcblxuICAgIC8vIGJnIG9mIGVxdWlwbWVudCBpbiByaWdodFxuICAgIHsgeDogNDg4LCB5OiAyNDksIHI6IDMzLCBnOiA4NSwgYjogMTU2IH0sXG4gICAgeyB4OiA1NjIsIHk6IDI1MCwgcjogMzMsIGc6IDg1LCBiOiAxNTYgfSxcblxuICAgIC8vIC8vIGVuZXJneSAoYmFsbCkgaW4gYm90dG9tXG4gICAgLy8geyB4OiA0MjQsIHk6IDMyNSwgcjogNTEsIGc6IDU4LCBiOiA1MSB9LFxuICAgIC8vIHsgeDogNDI4LCB5OiAzMjYsIHI6IDI1MywgZzogMjUxLCBiOiAyNTMgfSxcblxuICAgIC8vIGxpbmUgdXAgLCBwb3dlciByYW5raW5nLCBzdGF0cyBidG4gYmdcbiAgICB7IHg6IDgyLCB5OiAzMjgsIHI6IDI1LCBnOiA2OSwgYjogMTE2IH0sXG4gICAgeyB4OiAxNDYsIHk6IDMzMCwgcjogMjUsIGc6IDY1LCBiOiAxMTUgfSxcbiAgICB7IHg6IDI0OCwgeTogMzMwLCByOiAyNSwgZzogNjUsIGI6IDExNSB9LFxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDQyLCB5OiAzMjMsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1NTcsIHk6IDMzMiB9LCAvLyBwbGF5IGJhbGxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVQYW5lbEJ0bnMgPSB7XG4gIGF3YXlHYW1lOiB7IHg6IDE4NSwgeTogNjUgfSxcbiAgaG9tZUdhbWU6IHsgeDogMjkzLCB5OiA2NSB9LFxuICBkaXNhYmxlZFBsYXlCdG46IHsgeDogNTAyLCB5OiAzMTcsIHI6IDkwLCBnOiA3MywgYjogNDkgfSxcbn07XG5cbi8vIGNsaWNrIHJlZnJlc2ggYnRuIGluIHJhbmtlZEJhdHRsZVBhbmVsXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCcsXG4gIFtcbiAgICAvLyB0aXRsZSBhbmQgeFxuICAgIHsgeDogMjA3LCB5OiA1MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1MywgcjogMTI3LCBnOiAxMzEsIGI6IDEzNSB9LFxuICAgIHsgeDogMzYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzk2LCB5OiA1MSwgcjogMzYsIGc6IDQ0LCBiOiA1MiB9LFxuICAgIHsgeDogNTE4LCB5OiA1MCwgcjogMTQ1LCBnOiAxNDYsIGI6IDE0NSB9LFxuXG4gICAgLy8gY291bnQgZG93biBiZ1xuICAgIHsgeDogMTE0LCB5OiAxNTEsIHI6IDI1LCBnOiA4NSwgYjogODIgfSxcbiAgICB7IHg6IDUyMCwgeTogMTU1LCByOiAyNSwgZzogNTMsIGI6IDQ5IH0sXG5cbiAgICAvLyBvdGhlciBiZ1xuICAgIHsgeDogMTA2LCB5OiA5MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA2LCB5OiAzMTEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyNywgeTogMzAwLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MjgsIHk6IDI1NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIzLCB5OiA5OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICBdLFxuICB7IHg6IDUyMCwgeTogNTAgfSwgLy8geFxuICB7IHg6IDUyMCwgeTogNTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJhbmtlZEJhdHRsZVdlZWtseVJhbmtraW5nID0gbmV3IFBhZ2UoXG4gICdyYW5rZWRCYXR0bGVXZWVrbHlSYW5ra2luZycsXG4gIFtcbiAgICAvLyB3ZWVrbHkgcmFua2tpbmdcbiAgICB7IHg6IDMwOSwgeTogNDQsIHI6IDI0LCBnOiAzMCwgYjogMzcgfSxcbiAgICB7IHg6IDM0NCwgeTogNTQsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDM3NCwgeTogNTQsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiA1MSwgeTogNDgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxLCB5OiAzMTMsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDYwNiwgeTogMzA0LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA2MDMsIHk6IDQyLCByOiA3NCwgZzogNzcsIGI6IDc0IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMjk2LCB5OiAzMDcsIHI6IDgsIGc6IDExNCwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTUsIHk6IDMxMCwgcjogMTc2LCBnOiAyMDgsIGI6IDI1MSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDgsIHI6IDgsIGc6IDExMywgYjogMjQ4IH0sXG4gIF0sXG4gIHsgeDogMzE2LCB5OiAzMDEgfSwgLy8gb2tcbiAgeyB4OiAzMTYsIHk6IDMwMSB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlUmVzdWx0ID0gbmV3IFBhZ2UoXG4gICdyYW5rZWRCYXR0bGVSZXN1bHQnLFxuICBbXG4gICAgLy8gYmcgaW4gbWlkXG4gICAgeyB4OiAxMCwgeTogOTQsIHI6IDU4LCBnOiA5MywgYjogMTQwIH0sXG4gICAgeyB4OiA4LCB5OiAyNDgsIHI6IDE0MCwgZzogMTU4LCBiOiAxODEgfSxcbiAgICB7IHg6IDYyNCwgeTogOTUsIHI6IDU4LCBnOiA5NCwgYjogMTQwIH0sXG4gICAgeyB4OiA2MjEsIHk6IDI0NiwgcjogMTQwLCBnOiAxNTgsIGI6IDE4MSB9LFxuICAgIHsgeDogMzM2LCB5OiA5OCwgcjogNTgsIGc6IDk3LCBiOiAxNDAgfSxcbiAgICB7IHg6IDM0NSwgeTogMjU1LCByOiAxNDgsIGc6IDE2MiwgYjogMTgxIH0sXG5cbiAgICAvLyB0aWVyLyBzY29yZSAvIHJhbmtcbiAgICB7IHg6IDQ5LCB5OiAxMjcsIHI6IDE5OCwgZzogMjAzLCBiOiAyMTQgfSxcbiAgICB7IHg6IDU5LCB5OiAxMzAsIHI6IDE5NiwgZzogMjA1LCBiOiAyMTIgfSxcbiAgICB7IHg6IDc0LCB5OiAxMzMsIHI6IDIxNiwgZzogMjIxLCBiOiAyMjggfSxcbiAgICB7IHg6IDEwMSwgeTogMTMwLCByOiA4NSwgZzogMTE3LCBiOiAxNTMgfSxcbiAgICB7IHg6IDEyNiwgeTogMTI2LCByOiAyMDcsIGc6IDIxNiwgYjogMjI3IH0sXG4gICAgeyB4OiAxNjgsIHk6IDEyOSwgcjogMjMzLCBnOiAyMzUsIGI6IDIzOCB9LFxuICAgIHsgeDogMTg4LCB5OiAxMzIsIHI6IDIyMiwgZzogMjI5LCBiOiAyMzAgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODQsIHk6IDI5NiwgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMCwgeTogMjk3LCByOiA4LCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDYsIHI6IDgsIGc6IDEwMSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzMTcsIHk6IDI5NywgcjogMjI5LCBnOiAyMzcsIGI6IDI1MCB9LFxuICBdLFxuICB7IHg6IDMxNiwgeTogMzEwIH0sIC8vIG9rXG4gIHsgeDogMzE2LCB5OiAzMTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJhbmtlZEJhdHRsZUdhbWVJbmZvID0gbmV3IFBhZ2UoXG4gICdyYW5rZWRCYXR0bGVHYW1lSW5mbycsXG4gIFtcbiAgICAvLyByaWdodCBwYXJ0IG9mIG5hdiBiYXJcbiAgICB7IHg6IDYxNiwgeTogMTAsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDU5NSwgeTogMTMsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgeyB4OiA1ODksIHk6IDE1LCByOiA3NSwgZzogOTQsIGI6IDEyMyB9LFxuICAgIHsgeDogNTY3LCB5OiAxNCwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogNTczLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogNDc4LCB5OiAyMCwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNDcxLCB5OiAxMSwgcjogMjA1LCBnOiAyMTgsIGI6IDIzMCB9LFxuICAgIHsgeDogNDczLCB5OiAxMCwgcjogMjA2LCBnOiAyMTksIGI6IDIzMCB9LFxuICAgIHsgeDogMzkzLCB5OiA4LCByOiAxMjksIGc6IDEyNywgYjogMTI5IH0sXG4gICAgeyB4OiAzMTksIHk6IDE0LCByOiAxOTcsIGc6IDE5OCwgYjogMTk3IH0sXG5cbiAgICAvLyBnYW1lIGluZm8gdGl0bGVcbiAgICB7IHg6IDI4NCwgeTogNTgsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDI5OCwgeTogNjIsIHI6IDExMCwgZzogMTExLCBiOiAxMjEgfSxcbiAgICB7IHg6IDMwNywgeTogNjMsIHI6IDE2MywgZzogMTY2LCBiOiAxNzEgfSxcbiAgICB7IHg6IDMyMCwgeTogNjIsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDMzMiwgeTogNjMsIHI6IDIyMSwgZzogMjIxLCBiOiAyMjUgfSxcbiAgICB7IHg6IDM0OCwgeTogNjAsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDIwNSwgeTogNjIsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ3MywgeTogNjYsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDE0OCwgeTogNjEsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcblxuICAgIC8vIHBsYXliYWxsLyBwbGF5aW5nIGJ0blxuICAgIHsgeDogNDg3LCB5OiAzMjgsIHI6IDIxMiwgZzogMTg4LCBiOiAzMiB9LFxuICAgIHsgeDogNjEwLCB5OiAzMjUsIHI6IDIxNCwgZzogMTc5LCBiOiAwIH0sXG4gICAgeyB4OiA1NTIsIHk6IDMzOSwgcjogMTgxLCBnOiAxNDIsIGI6IDAgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI2LCB5OiAzMTYsIHI6IDIxNCwgZzogMjE4LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQwLCB5OiAzMTYsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMzLCB5OiAzMjksIHI6IDIxMSwgZzogMjE1LCBiOiAyMTAgfSxcblxuICAgIC8vIGJnIGJldHdlZW4gYmFjayBhbmQgcGxheVxuICAgIHsgeDogMTM4LCB5OiAzMjUsIHI6IDU4LCBnOiA2OSwgYjogNDkgfSxcbiAgICB7IHg6IDIwMCwgeTogMzI5LCByOiA0OSwgZzogNjEsIGI6IDQxIH0sXG4gICAgeyB4OiAyNjUsIHk6IDMzMCwgcjogNTIsIGc6IDYyLCBiOiA0NCB9LFxuICAgIHsgeDogMzQ1LCB5OiAzMzMsIHI6IDY2LCBnOiA3NSwgYjogNTggfSxcbiAgICB7IHg6IDQwMiwgeTogMzM0LCByOiA0OSwgZzogNTMsIGI6IDMzIH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiAzMjkgfSxcbiAgeyB4OiAyNiwgeTogMzE2IH1cbik7XG5cbi8vIGEgcGFnZSB0byBzdGFydCBhdXRvIGdhbWVcbmV4cG9ydCBjb25zdCBhdXRvR2FtZUNvbmZpcm0gPSBuZXcgUGFnZShcbiAgJ2F1dG9HYW1lQ29uZmlybScsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjc3LCB5OiA2MCwgcjogMTgwLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjk1LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzA4LCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzI4LCB5OiA1OCwgcjogMTc3LCBnOiAxODMsIGI6IDE4NSB9LFxuICAgIHsgeDogMzUzLCB5OiA2MSwgcjogMTc3LCBnOiAxODIsIGI6IDE4NSB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDEwOCwgeTogNDksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwNywgeTogMzE0LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTYsIHk6IDMwMiwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDkxLCB5OiAxNzEsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxMCwgeTogNDgsIHI6IDE2OCwgZzogMTczLCBiOiAxNzYgfSxcbiAgICB7IHg6IDUxNiwgeTogNTUsIHI6IDEwMywgZzogMTA1LCBiOiAxMDkgfSxcbiAgICB7IHg6IDUyNCwgeTogNDgsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcblxuICAgIC8vIG5vIGFuZCB5ZXNcbiAgICB7IHg6IDIyMywgeTogMjk4LCByOiA0MSwgZzogNzcsIGI6IDEyMyB9LFxuICAgIHsgeDogMjQ4LCB5OiAyOTgsIHI6IDE1OCwgZzogMTgzLCBiOiAyMTQgfSxcbiAgICB7IHg6IDM4OCwgeTogMjk5LCByOiAxOTYsIGc6IDIyMywgYjogMjU1IH0sXG4gICAgeyB4OiA0MzAsIHk6IDMwMiwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcblxuICAgIC8vIGNvbnRlbnQgdG8gZGlmZiB3aXRoIGNvbmZpcm0gZW5kICh5b3Ugc2VsZWN0ZWQpXG4gICAgeyB4OiAyODYsIHk6IDE4MCwgcjogODIsIGc6IDg2LCBiOiA5NCB9LFxuICAgIHsgeDogMzA0LCB5OiAxNzgsIHI6IDEyMCwgZzogMTI4LCBiOiAxMzYgfSxcbiAgICB7IHg6IDMyNCwgeTogMTc4LCByOiA5NSwgZzogMTAzLCBiOiAxMTIgfSxcbiAgXSxcbiAgeyB4OiAzOTAsIHk6IDMwNCB9LCAvLyB5ZXMsIHN0YXJ0IGF1dG8gcGxheVxuICB7IHg6IDIzNywgeTogMzA0IH0gLy8gbm8sIG5vdCBzdGFydCBhdXRvIHBsYXlcbik7XG5cbi8vIGEgcGFnZSB0byBlbmQgYXV0byBnYW1lXG5leHBvcnQgY29uc3QgYXV0b0dhbWVDb25maXJtRW5kID0gbmV3IFBhZ2UoXG4gICdhdXRvR2FtZUNvbmZpcm1FbmQnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI3NywgeTogNjAsIHI6IDE4MCwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI5NSwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMwOCwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMyOCwgeTogNTgsIHI6IDE3NywgZzogMTgzLCBiOiAxODUgfSxcbiAgICB7IHg6IDM1MywgeTogNjEsIHI6IDE3NywgZzogMTgyLCBiOiAxODUgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMDgsIHk6IDQ5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDcsIHk6IDMxNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE2LCB5OiAzMDIsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ5MSwgeTogMTcxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTAsIHk6IDQ4LCByOiAxNjgsIGc6IDE3MywgYjogMTc2IH0sXG4gICAgeyB4OiA1MTYsIHk6IDU1LCByOiAxMDMsIGc6IDEwNSwgYjogMTA5IH0sXG4gICAgeyB4OiA1MjQsIHk6IDQ4LCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBubyBhbmQgeWVzXG4gICAgeyB4OiAyMjMsIHk6IDI5OCwgcjogNDEsIGc6IDc3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI0OCwgeTogMjk4LCByOiAxNTgsIGc6IDE4MywgYjogMjE0IH0sXG4gICAgeyB4OiAzODgsIHk6IDI5OSwgcjogMTk2LCBnOiAyMjMsIGI6IDI1NSB9LFxuICAgIHsgeDogNDMwLCB5OiAzMDIsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG5cbiAgICAvLyBUT0RPOiB1c2UgZW5kIGdhbWUgY29udGVudFxuICBdLFxuICB7IHg6IDIzNywgeTogMzA0IH0sIC8vIG5vLCBjb250aW51ZSBhdXRvIHBsYXlcbiAgeyB4OiAzOTAsIHk6IDMwNCB9IC8vIHllcywgZW5kIGF1dG8gcGxheVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlY2hhcmdlQmFsbFJhbmtNb2RlID0gbmV3IFBhZ2UoXG4gICdyZWNoYXJnZUJhbGxSYW5rTW9kZScsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMTkyLCB5OiA0OSwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMjQxLCB5OiA0OSwgcjogMTgyLCBnOiAxODIsIGI6IDE5MSB9LFxuICAgIHsgeDogMzAyLCB5OiA1OCwgcjogMTYwLCBnOiAxNjEsIGI6IDE2OCB9LFxuICAgIHsgeDogMzQ1LCB5OiA1OSwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMzYyLCB5OiA1OSwgcjogMzIsIGc6IDM4LCBiOiA0NiB9LFxuICAgIHsgeDogNDE1LCB5OiA2MCwgcjogNjcsIGc6IDcyLCBiOiA4MCB9LFxuICAgIHsgeDogNDM4LCB5OiA1OCwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDExNSwgeTogNDYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwOSwgeTogMzA2LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MjEsIHk6IDMwNSwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE1LCB5OiA0NCwgcjogNzEsIGc6IDcwLCBiOiA3MSB9LFxuICBdLFxuICB7IHg6IDUxOCwgeTogNDkgfSwgLy8gY2FuY2VsXG4gIHsgeDogNTE4LCB5OiA0OSB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmVjaGFyZ2VCYWxsTGVhZ3VlTW9kZSA9IG5ldyBQYWdlKFxuICAncmVjaGFyZ2VCYWxsTGVhZ3VlTW9kZScsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjI0LCB5OiA1NSwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMjY4LCB5OiA2MCwgcjogMjQsIGc6IDMyLCBiOiAzNyB9LFxuICAgIHsgeDogMzE2LCB5OiA2MiwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMzY4LCB5OiA2MSwgcjogMjMsIGc6IDMxLCBiOiA0MCB9LFxuICAgIHsgeDogNDAxLCB5OiA1NiwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogNDQwLCB5OiA2MCwgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMCwgeTogNTMsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDExNCwgeTogMjk4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMTUsIHk6IDMwNywgcjogMjM0LCBnOiAyNDEsIGI6IDIzNCB9LFxuICAgIHsgeDogNTIxLCB5OiAzMDYsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDUxOCwgeTogNTEsIHI6IDE5NywgZzogMTk4LCBiOiAxOTggfSxcbiAgXSxcbiAgeyB4OiA1MTgsIHk6IDQ5IH0sIC8vIGNhbmNlbFxuICB7IHg6IDUxOCwgeTogNDkgfVxuKTtcblxuLy8gKiBMZWFndWVNb2Rlc1xuZXhwb3J0IGNvbnN0IGxlYWd1ZU1vZGVQYW5lbCA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlTW9kZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdmkgYmFyXG4gICAgeyB4OiAzMDAsIHk6IDEyLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTYsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMyMCwgeTogMTUsIHI6IDE0NCwgZzogMTQ4LCBiOiAxNDkgfSxcbiAgICB7IHg6IDM4OCwgeTogMTAsIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDM4NSwgeTogOSwgcjogNjQsIGc6IDY3LCBiOiA3MSB9LFxuICAgIHsgeDogNDkzLCB5OiAxMSwgcjogMjQ0LCBnOiAyMDQsIGI6IDM5IH0sXG4gICAgeyB4OiA1NzEsIHk6IDE0LCByOiAxNDcsIGc6IDE2MSwgYjogMTcxIH0sXG4gICAgeyB4OiA2MDYsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNjMxLCB5OiAxNSwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuXG4gICAgLy8gYnRuIGluIGJvdHRvbVxuICAgIHsgeDogODUsIHk6IDMyNiwgcjogMjM0LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogMTEyLCB5OiAzMjcsIHI6IDIxNCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDE2MywgeTogMzI2LCByOiAyMjIsIGc6IDIyNSwgYjogMjI3IH0sXG4gICAgeyB4OiAxOTgsIHk6IDMyNywgcjogODAsIGc6IDExNywgYjogMTU5IH0sXG4gICAgeyB4OiAyNTEsIHk6IDMyNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjc4LCB5OiAzMzAsIHI6IDE4OSwgZzogMjA2LCBiOiAyMTkgfSxcbiAgXSxcbiAgeyB4OiA2MTYsIHk6IDMzNiB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU1vZGVHYW1lSW5mbyA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlTW9kZUdhbWVJbmZvJyxcbiAgW1xuICAgIHsgeDogMjkyLCB5OiA5LCByOiAyMTQsIGc6IDIxMywgYjogMjE0IH0sXG4gICAgeyB4OiAzMTQsIHk6IDcsIHI6IDI1NSwgZzogMjUxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM3OSwgeTogMywgcjogMjE0LCBnOiAyMTUsIGI6IDIxNCB9LFxuICAgIHsgeDogMzg5LCB5OiAxMCwgcjogMjM5LCBnOiAyMzYsIGI6IDIzOSB9LFxuICAgIHsgeDogNDgyLCB5OiAzLCByOiAyMTQsIGc6IDIxOCwgYjogMjIwIH0sXG4gICAgeyB4OiA0OTMsIHk6IDksIHI6IDI1NSwgZzogMjQ2LCBiOiAxOTIgfSxcbiAgICB7IHg6IDU4OSwgeTogMTEsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgeyB4OiA1OTYsIHk6IDExLCByOiA4MSwgZzogMTA0LCBiOiAxMzEgfSxcbiAgICB7IHg6IDYyNCwgeTogMTIsIHI6IDIxNCwgZzogMjExLCBiOiAyMTQgfSxcbiAgICB7IHg6IDI2LCB5OiAzMTIsIHI6IDIwOSwgZzogMjE0LCBiOiAyMDkgfSxcbiAgICB7IHg6IDYzMSwgeTogNTYsIHI6IDIwNiwgZzogMjA3LCBiOiAyMTQgfSxcbiAgICB7IHg6IDYzMSwgeTogNzAsIHI6IDE2OCwgZzogMTc3LCBiOiAxOTMgfSxcbiAgICB7IHg6IDYyMywgeTogNjQsIHI6IDMzLCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjcwLCB5OiAxNzksIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDI1NiwgeTogMjE0LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiAyNDIsIHk6IDI0MiwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogNjEyLCB5OiAyODEsIHI6IDI0LCBnOiAzNiwgYjogNDkgfSxcbiAgXSxcbiAgeyB4OiA1NDYsIHk6IDMyNSB9LCAvLyBwbGF5QmFsbFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuLy8gbm9ybWFsIGdhbWUgcGxheSBzdGFydFxuZXhwb3J0IGNvbnN0IHNlbGVjdFBsYXlSb2xlQnRucyA9IHtcbiAgcGxheU9mZmVuc2VPbmx5OiB7IHg6IDEyOCwgeTogMjc5IH0sXG4gIHBsYXlBbGw6IHsgeDogMzE3LCB5OiAyODIgfSxcbiAgcGxheURlZmZlbnNlT25seTogeyB4OiA1MDYsIHk6IDI4MSB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFBsYXlSb2xlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RQbGF5Um9sZScsXG4gIFtcbiAgICB7IHg6IDk3LCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE0NSwgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0OTksIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTM5LCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU0MywgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NjMsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgeyB4OiA5MCwgeTogMTEwLCByOiAxOTQsIGc6IDgyLCBiOiAyNCB9LFxuICAgIHsgeDogNTUyLCB5OiAxMTIsIHI6IDU3LCBnOiAxMjAsIGI6IDE5NyB9LFxuICBdLFxuICAvLyBUT0RPOiBtYWtlIHdoaWNoIHJvbGUgY2FuIGJlIHNlbGVjdGVkIGlmIG5lZWRcbiAgc2VsZWN0UGxheVJvbGVCdG5zLnBsYXlBbGwsXG4gIHNlbGVjdFBsYXlSb2xlQnRucy5wbGF5QWxsXG4pO1xuXG4vLyBzb21ldGltZXMgaGFwcGVuZWQgd2hlbiByZXN0YXJ0aW5nIGEgY29udGludWVkIGdhbWVcbi8vIG9yIGNhbmNlbCBhdXRvIHBsYXkgZHVyaW5nIHBsYXlpbmdcbmV4cG9ydCBjb25zdCBsZWFndWVDb250aW51ZVBsYXlpbmcgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZUNvbnRpbnVlUGxheWluZycsXG4gIFtcbiAgICAvLyBmYXN0IHByb2dyZXNzaW9uXG4gICAgeyB4OiA0NTIsIHk6IDI3OSwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ3NiwgeTogMjc5LCByOiAyNTEsIGc6IDI1MiwgYjogMjU1IH0sXG4gICAgeyB4OiA1MDIsIHk6IDI3NSwgcjogMTkwLCBnOiAyMjAsIGI6IDI1NSB9LFxuICAgIHsgeDogNTMwLCB5OiAyNzksIHI6IDIxOCwgZzogMjMzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDU1MiwgeTogMjczLCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTYzLCB5OiAyNzYsIHI6IDIzNCwgZzogMjQ0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3OSwgeTogMjc5LCByOiA4LCBnOiAxMDksIGI6IDI1NSB9LFxuICAgIHsgeDogNTg3LCB5OiAyNzMsIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgLy8gY29udGludWVcbiAgICB7IHg6IDQ1OCwgeTogMzIwLCByOiA4LCBnOiAxMDksIGI6IDI1NSB9LFxuICAgIHsgeDogNDgwLCB5OiAzMjQsIHI6IDEyMiwgZzogMTY4LCBiOiAyNDcgfSxcbiAgICB7IHg6IDUyMCwgeTogMzE3LCByOiA4NCwgZzogMTU5LCBiOiAyNTAgfSxcbiAgICB7IHg6IDU0NCwgeTogMzI0LCByOiAyMjYsIGc6IDIzNCwgYjogMjUyIH0sXG4gICAgeyB4OiA1NzIsIHk6IDMxOSwgcjogOCwgZzogMTEzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDU5MSwgeTogMzI1LCByOiAwLCBnOiA5NywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogNDU4LCB5OiAzMjAgfSwgLy8gY29udGludWUgZ2FtZVxuICB7IHg6IDQ1OCwgeTogMzIwIH0gLy8gY29udGludWUgZ2FtZVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheUF1dG9PZmYgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheUF1dG9PZmYnLFxuICBbXG4gICAgLy8gYXV0b1xuICAgIHsgeDogNTE0LCB5OiAyMCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTI1LCB5OiAyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIC8vIGNhbWVyYVxuICAgIHsgeDogNTU2LCB5OiAyMSwgcjogMTgzLCBnOiAxODUsIGI6IDE4NiB9LFxuICAgIHsgeDogNTYwLCB5OiAyMywgcjogMTk3LCBnOiAxOTgsIGI6IDE5NyB9LFxuICAgIHsgeDogNTY5LCB5OiAyMSwgcjogMjA2LCBnOiAyMDcsIGI6IDIwNiB9LFxuICBdLFxuICB7IHg6IDUxMSwgeTogMjAgfSwgLy8gc3dpdGNoIHRvIGF1dG8gbW9kZVxuICB7IHg6IDYxMSwgeTogMjAgfSAvLyBwYXVzZSBidXR0b25cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlBdXRvT2ZmMSA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5QXV0b09mZicsXG4gIC8vIGhhcyBzd2luZyBidXR0b25cbiAgW1xuICAgIHsgeDogNTIxLCB5OiAyNjMsIHI6IDI0LCBnOiAyOSwgYjogMTYgfSxcbiAgICB7IHg6IDUyMCwgeTogMjU1LCByOiAyMTMsIGc6IDIxMywgYjogMjEyIH0sXG4gICAgeyB4OiA1MzMsIHk6IDI1NSwgcjogMjIzLCBnOiAyMjEsIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiAyNDQsIHI6IDE2LCBnOiAyOCwgYjogMTYgfSxcbiAgXSxcbiAgeyB4OiA1MTEsIHk6IDIwIH0sIC8vIHN3aXRjaCB0byBhdXRvIG1vZGVcbiAgeyB4OiA2MTEsIHk6IDIwIH0gLy8gcGF1c2UgYnV0dG9uXG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwID0gbmV3IEdyb3VwUGFnZShcbiAgJ2xlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCcsXG4gIFtsZWFndWVPblBsYXlBdXRvT2ZmLCBsZWFndWVPblBsYXlBdXRvT2ZmMV0sXG4gIGxlYWd1ZU9uUGxheUF1dG9PZmYubmV4dCAvKiBuZXh0ICovLFxuICBsZWFndWVPblBsYXlBdXRvT2ZmLmJhY2sgLyogYmFjayAqL1xuKTtcblxuLy8gYXV0byBwbGF5IG9uLCBwb3dlciBzYXZlIG9mZlxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZiA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmJyxcbiAgW1xuICAgIC8vIGJhdHRlcnlcbiAgICB7IHg6IDQ4NiwgeTogMTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ5MiwgeTogMTYsIHI6IDEwMSwgZzogMTAzLCBiOiAxMDEgfSxcbiAgICB7IHg6IDQ4OCwgeTogMjIsIHI6IDIxMCwgZzogMjA4LCBiOiAyMTAgfSxcbiAgICB7IHg6IDQ4MSwgeTogMjcsIHI6IDEwMiwgZzogMTAxLCBiOiAxMDEgfSxcbiAgICB7IHg6IDQ4OSwgeTogMjksIHI6IDE5NywgZzogMTk3LCBiOiAxOTcgfSxcbiAgXSxcbiAgeyB4OiA0ODUsIHk6IDIxIH0sIC8vIHR1cm4gb24gcG93ZXIgc2F2ZVxuICB7IHg6IDU1MiwgeTogMjEgfSAvLyB0dXJuIG9mZiBhdXRvIHBsYXlcbik7XG5cbi8vIHNhbWUgYXMgZ0xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZiwgYnV0IGlzIHN0b3BwZWRcbi8vIG5lZWQgdG8gdHVybiBvbiBhdXRvcGxheVxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZlN0b3BwZWQgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0OTIsIHk6IDE2LCByOiAxMDEsIGc6IDEwMywgYjogMTAxIH0sXG4gICAgeyB4OiA0ODgsIHk6IDIyLCByOiAyMTAsIGc6IDIwOCwgYjogMjEwIH0sXG4gICAgeyB4OiA0ODEsIHk6IDI3LCByOiAxMDIsIGc6IDEwMSwgYjogMTAxIH0sXG4gICAgeyB4OiA0ODksIHk6IDI5LCByOiAxOTcsIGc6IDE5NywgYjogMTk3IH0sXG5cbiAgICAvLyBkaXNhYmxlZCBhdXRvcGxheSB0ZXh0XG4gICAgeyB4OiA1MjQsIHk6IDIzLCByOiA5MSwgZzogMTEwLCBiOiAxNTggfSxcbiAgICB7IHg6IDUzMCwgeTogMjAsIHI6IDE0MCwgZzogMTQ2LCBiOiAxNTIgfSxcbiAgICB7IHg6IDUzMywgeTogMjQsIHI6IDkzLCBnOiAxMDYsIGI6IDE0MyB9LFxuICAgIHsgeDogNTUwLCB5OiAyNSwgcjogODUsIGc6IDEwNSwgYjogMTUzIH0sXG4gICAgeyB4OiA1NTIsIHk6IDIxLCByOiAxNDcsIGc6IDE1MywgYjogMTU2IH0sXG4gICAgeyB4OiA1NTcsIHk6IDIwLCByOiAxNDgsIGc6IDE1NCwgYjogMTU2IH0sXG4gICAgeyB4OiA1NjYsIHk6IDI0LCByOiA5OSwgZzogMTIxLCBiOiAxNzMgfSxcbiAgICB7IHg6IDU3NSwgeTogMTgsIHI6IDEwNywgZzogMTIxLCBiOiAxNzMgfSxcbiAgICB7IHg6IDU4NCwgeTogMTksIHI6IDk3LCBnOiAxMjIsIGI6IDE2OSB9LFxuICAgIHsgeDogNTg5LCB5OiAyMiwgcjogMTE4LCBnOiAxMjcsIGI6IDE0OSB9LFxuICAgIHsgeDogNTk1LCB5OiAxOCwgcjogMTQxLCBnOiAxNTAsIGI6IDE1NiB9LFxuICAgIHsgeDogNjA2LCB5OiAyMywgcjogNzQsIGc6IDkzLCBiOiAxMzIgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sIC8vIHR1cm4gb24gYXV0byBwbGF5XG4gIHsgeDogMCwgeTogMCB9IC8vIHR1cm4gb24gYXV0byBwbGF5XG4pO1xuXG4vLyBkb24ndCBkbyBhbnkgdGhpbmcsIGp1c3QgYXZvaWQgdG8gZW50ZXIgdW5rbm93blxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZCA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmJyxcbiAgW1xuICAgIC8vIGJhdHRlcnlcbiAgICB7IHg6IDQ4NiwgeTogMTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGRpYWxvZyBvblxuICAgIHsgeDogNjA0LCB5OiA0NywgcjogMTcwLCBnOiAxNzEsIGI6IDE3MCB9LFxuICAgIHsgeDogNjA3LCB5OiA0OSwgcjogMjQ2LCBnOiAyNDYsIGI6IDI0NiB9LFxuICAgIHsgeDogNjExLCB5OiA1NCwgcjogMjEzLCBnOiAyMTAsIGI6IDIxMyB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmTWlkMSA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmJyxcbiAgW1xuICAgIC8vIGJhdHRlcnlcbiAgICB7IHg6IDQ4NiwgeTogMTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGRpYWxvZyBvZmZcbiAgICB7IHg6IDYwNSwgeTogNTAsIHI6IDk1LCBnOiA5OSwgYjogOTcgfSxcbiAgICB7IHg6IDYwMiwgeTogNTEsIHI6IDEwOSwgZzogMTE0LCBiOiAxMTYgfSxcbiAgICB7IHg6IDYwMywgeTogNDksIHI6IDEzMSwgZzogMTMzLCBiOiAxMzEgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmR3JvdXBzID0gbmV3IEdyb3VwUGFnZSgnbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmR3JvdXAnLCBbXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZixcbiAgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmU3RvcHBlZCxcbiAgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmTWlkLFxuICBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZNaWQxLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBvblBsYXlQb3dlclNhdmVPbiA9IG5ldyBQYWdlKFxuICAnb25QbGF5UG93ZXJTYXZlT24nLFxuICBbXG4gICAgeyB4OiAzMDQsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA1LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNiwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDcsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA4LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcblxuICAgIHsgeDogMzAxLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwMiwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDMsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA0LCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzNiwgeTogMjYsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDM2LCB5OiAzMjYsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDYxMywgeTogMzMwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA2MTgsIHk6IDEwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA2MDIsIHk6IDI3LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiAxNzQsIHk6IDE2MiwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNDc2LCB5OiAxNTgsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICAvLyBzY29yZSBiZ1xuICAgIHsgeDogNDk3LCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDQ5OCwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA0OTksIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNTAwLCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMSwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA1MDIsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNTAzLCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG4vLyBGSVhNRTogY2hhbmdlIGNvbG9yc1xuZXhwb3J0IGNvbnN0IG9uUXVpY2tQbGF5ID0gbmV3IFBhZ2UoXG4gICdvblF1aWNrUGxheScsXG4gIFtcbiAgICAvLyBiZyByaWdodCBwYW5lbFxuICAgIHsgeDogNDU2LCB5OiAxMSwgcjogNTgsIGc6IDc3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDYyMywgeTogMTAsIHI6IDU4LCBnOiA3MywgYjogMTE1IH0sXG4gICAgeyB4OiA0NTcsIHk6IDM0OCwgcjogMzMsIGc6IDQwLCBiOiA1OCB9LFxuICAgIHsgeDogNjMyLCB5OiAzNTAsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcblxuICAgIC8vIGJsdWUgYnRuOiBwbGF5IG1hbnVhbGx5XG4gICAgeyB4OiAyOTgsIHk6IDMyMSwgcjogMzMsIGc6IDEzMSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTEsIHk6IDMzNSwgcjogMTU4LCBnOiAxOTEsIGI6IDIzNSB9LFxuICAgIHsgeDogNDMzLCB5OiAzMzQsIHI6IDgsIGc6IDU3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDQzMywgeTogMzQ5LCByOiAwLCBnOiA4MSwgYjogMjM4IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG9uUXVpY2tQbGF5MSA9IG5ldyBQYWdlKFxuICAnb25RdWlja1BsYXknLCAvLyBzYW1lIGJlaGF2aW91ciwgd2l0aG91dCBibHVlIGJ0biBvbiByaWdodCBib3R0b21cbiAgW1xuICAgIC8vIGJnIHJpZ2h0IHBhbmVsXG4gICAgeyB4OiA0NTQsIHk6IDgsIHI6IDU4LCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiA0NTUsIHk6IDM1MSwgcjogMzMsIGc6IDQwLCBiOiA1OCB9LFxuICAgIHsgeDogNjI4LCB5OiAzNDgsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcbiAgICB7IHg6IDYyNywgeTogOSwgcjogNTgsIGc6IDczLCBiOiAxMTUgfSxcblxuICAgIC8vIGRpZmYgZnJvbSBvdGhlciBwYWdlXG4gICAgeyB4OiA0MzMsIHk6IDMyNCwgcjogODUsIGc6IDEwNywgYjogNjggfSxcbiAgICB7IHg6IDQzMywgeTogMzIwLCByOiA4MywgZzogMTA5LCBiOiA2NiB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbi8vIHNvbWV0aW1lcyB0aGUgcXVpY2sgcGxheSB3aWxsIGJlIHBhdXNlZFxuZXhwb3J0IGNvbnN0IG9uUXVpY2tQbGF5UGF1c2UgPSBuZXcgUGFnZShcbiAgJ29uUXVpY2tQbGF5UGF1c2UnLFxuICBbXG4gICAgeyB4OiA0NTYsIHk6IDExLCByOiA0OSwgZzogNzMsIGI6IDEyMyB9LFxuICAgIHsgeDogNDcyLCB5OiAyMiwgcjogMjAxLCBnOiAyMDcsIGI6IDIxOCB9LFxuICAgIHsgeDogNTMyLCB5OiAyMiwgcjogODEsIGc6IDEwMCwgYjogMTI4IH0sXG4gICAgeyB4OiA0NTMsIHk6IDM0NywgcjogMjQsIGc6IDM2LCBiOiA1NyB9LFxuICAgIHsgeDogMzA2LCB5OiAyNzYsIHI6IDgsIGc6IDExOCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MjEsIHk6IDI4MywgcjogMiwgZzogMTA1LCBiOiAyNDcgfSxcbiAgICB7IHg6IDMyNSwgeTogMzM3LCByOiAwLCBnOiA5NywgYjogMjQ3IH0sXG4gICAgeyB4OiA0MzAsIHk6IDMzNiwgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDM3NiwgeTogMzI5IH0sIC8vIHBsYXkgYmFsbCAvLyBUT0RPOiBtaWdodCBuZWVkIHRvIHNldCBpbm5pbmdcbiAgeyB4OiAzNzYsIHk6IDMyOSB9XG4pO1xuXG5leHBvcnQgY29uc3Qgb25RdWlja1BsYXlHcm91cCA9IG5ldyBHcm91cFBhZ2UoJ29uUXVpY2tQbGF5JywgW29uUXVpY2tQbGF5LCBvblF1aWNrUGxheTFdLCBvblF1aWNrUGxheS5uZXh0IC8qIG5leHQgKi8pO1xuXG4vLyB3aGVuIHBsYXlpbmcsIHByZXNzIGJhY2tcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQYXVzZSA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5UGF1c2UnLFxuICBbXG4gICAgLy8gY29udGludWUgYnV0dG9uXG4gICAgeyB4OiA4OSwgeTogMTQ4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA5OSwgeTogMTM4LCByOiA4MiwgZzogODksIGI6IDk5IH0sXG4gICAgLy8gbGVhdmUgYnV0dG9uXG4gICAgeyB4OiA1MjcsIHk6IDE2NSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTU1LCB5OiAxNTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICAvLyBtbGIgbG9nb1xuICAgIHsgeDogNTU0LCB5OiAyOTEsIHI6IDAsIGc6IDI4LCBiOiA1NyB9LFxuICAgIHsgeDogNTYzLCB5OiAyOTQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2NSwgeTogMjkwLCByOiAzMCwgZzogNTQsIGI6IDg4IH0sXG4gIF0sXG4gIHsgeDogODksIHk6IDE0OCB9LCAvLyBjb250aW51ZSBnYW1lXG4gIHsgeDogNTI3LCB5OiAxNjUgfSAvLyBsZWF2ZVxuKTtcblxuLy8gY2Fubm90IGdvIHRvIGxlYWd1ZSBtb2RlIGR1ZSB0byB1bmV4cGVjdGVkIGVycm9yXG5leHBvcnQgY29uc3QgbGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvciA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvcicsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjcyLCB5OiA2MiwgcjogMTkzLCBnOiAxOTgsIGI6IDIwMiB9LFxuICAgIHsgeDogMzExLCB5OiA1OSwgcjogMTYsIGc6IDIzLCBiOiAzMiB9LFxuICAgIHsgeDogMzM4LCB5OiA2MCwgcjogNzEsIGc6IDcyLCBiOiA4MCB9LFxuICAgIHsgeDogMzk2LCB5OiA2MCwgcjogMTkyLCBnOiAxOTgsIGI6IDIwMyB9LFxuXG4gICAgLy8gY29udGVudFxuICAgIHsgeDogMjA2LCB5OiAxMzcsIHI6IDU4LCBnOiA2NywgYjogNzggfSxcbiAgICB7IHg6IDMzMywgeTogMTgwLCByOiAxMDAsIGc6IDEwOSwgYjogMTE4IH0sXG4gICAgeyB4OiAzNjgsIHk6IDIwMywgcjogMTM5LCBnOiAxNDUsIGI6IDE1NCB9LFxuXG4gICAgLy8gb2sgJiBiZ1xuICAgIHsgeDogMzE5LCB5OiAzMDEsIHI6IDI0LCBnOiAxMTcsIGI6IDIzOCB9LFxuICAgIHsgeDogMTY0LCB5OiAzMDQsIHI6IDIzOSwgZzogMjQyLCBiOiAyMzkgfSxcbiAgICB7IHg6IDQ4NywgeTogMzAzLCByOiAyNDEsIGc6IDI0MCwgYjogMjQxIH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdCA9IG5ldyBQYWdlKFxuICAnZ2FtZVJlc3VsdCcsXG4gIFtcbiAgICB7IHg6IDQ1OCwgeTogMjQsIHI6IDQxLCBnOiA0NCwgYjogNDkgfSwgLy8gdGl0bGVcbiAgICB7IHg6IDEyNiwgeTogMzMzLCByOiA0OSwgZzogODEsIGI6IDEyMyB9LCAvLyB2aWV3IGFsbCBidG5cbiAgICB7IHg6IDI0NywgeTogMzM1LCByOiA0MSwgZzogODEsIGI6IDExNSB9LCAvLyBib3ggc2NvcmUgYnRuXG4gICAgeyB4OiA2MDksIHk6IDMzNSwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSwgLy8gbmV4dCBidG5cbiAgXSxcbiAgeyB4OiA2MDksIHk6IDMzNSB9LFxuICB7IHg6IDYwOSwgeTogMzM1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmVzdWx0QXF1aXJlZCA9IG5ldyBQYWdlKFxuICAnZ2FtZVJlc3VsdEFxdWlyZWQnLFxuICBbXG4gICAgeyB4OiA0NDksIHk6IDIzLCByOiA0MSwgZzogNDQsIGI6IDQ5IH0sIC8vIHRpdGxlXG4gICAgeyB4OiAzOSwgeTogMzI5LCByOiAyMTMsIGc6IDIxOCwgYjogMjEzIH0sIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAxNTgsIHk6IDI4NywgcjogMjQ3LCBnOiAxMjYsIGI6IDUxIH0sIC8vIHBsYXllciBwYWNrIGJ0blxuICAgIHsgeDogNjEyLCB5OiAzMjgsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sIC8vIG9rIGJ0blxuICBdLFxuICB7IHg6IDYxMiwgeTogMzI4IH0sXG4gIHsgeDogNjEyLCB5OiAzMjggfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXN1bHRPdGhlciA9IG5ldyBQYWdlKFxuICAnZ2FtZVJlc3VsdE90aGVyJyxcbiAgW1xuICAgIHsgeDogNzEsIHk6IDI5LCByOiAwLCBnOiA4NSwgYjogMTU2IH0sXG4gICAgeyB4OiA1NTYsIHk6IDE1LCByOiAyMTIsIGc6IDIyOCwgYjogMjQxIH0sXG4gICAgeyB4OiA1OTUsIHk6IDEzLCByOiAwLCBnOiA5MywgYjogMTgxIH0sXG4gICAgeyB4OiA2MTAsIHk6IDEzLCByOiAwLCBnOiAyOCwgYjogNTcgfSxcbiAgICB7IHg6IDYxOCwgeTogMTMsIHI6IDE3LCBnOiAyNiwgYjogNTggfSxcbiAgICB7IHg6IDYyNCwgeTogOCwgcjogMjQzLCBnOiAyNDQsIGI6IDI0NSB9LFxuICAgIHsgeDogNjI3LCB5OiAyNCwgcjogMTY1LCBnOiAxODYsIGI6IDIwMiB9LFxuICAgIHsgeDogNTc4LCB5OiAyMywgcjogNzAsIGc6IDEzMiwgYjogMTgyIH0sXG4gICAgeyB4OiAyNDksIHk6IDU2LCByOiA4NCwgZzogMTIxLCBiOiAxNjEgfSxcbiAgICB7IHg6IDI2NywgeTogNTYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxOSwgeTogNjAsIHI6IDE2OCwgZzogMTkxLCBiOiAyMDggfSxcbiAgICB7IHg6IDM3NywgeTogNTgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI5LCB5OiA5MywgcjogMCwgZzogMzYsIGI6IDY2IH0sXG4gICAgeyB4OiA2MTcsIHk6IDMxNCwgcjogMTYsIGc6IDI0LCBiOiAxNyB9LFxuICAgIHsgeDogMTA4LCB5OiAzMjIsIHI6IDgsIGc6IDIwLCBiOiAxNiB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmVzdWx0V29ybGRDaGFtcGlvbiA9IG5ldyBQYWdlKFxuICAnZ2FtZVJlc3VsdFdvcmxkQ2hhbXBpb24nLFxuICBbXG4gICAgeyB4OiAyNTIsIHk6IDIyLCByOiA1NywgZzogNjcsIGI6IDc0IH0sXG4gICAgeyB4OiAzMjMsIHk6IDQyLCByOiAxMTYsIGc6IDEwOSwgYjogODMgfSxcbiAgICB7IHg6IDM1MCwgeTogNzMsIHI6IDY2LCBnOiA5MSwgYjogOTYgfSxcbiAgICB7IHg6IDQ5LCB5OiAzMzEsIHI6IDE2LCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDIwOSwgeTogMzIyLCByOiA4LCBnOiAyMCwgYjogMjQgfSxcbiAgICB7IHg6IDI5NCwgeTogMzI2LCByOiAyMDgsIGc6IDIwOCwgYjogMjEyIH0sXG4gICAgeyB4OiA0MDAsIHk6IDMyMywgcjogMTkyLCBnOiAxOTAsIGI6IDE5MiB9LFxuICAgIHsgeDogNDM5LCB5OiAzMjMsIHI6IDg1LCBnOiA5OCwgYjogMTAwIH0sXG4gICAgeyB4OiA1NzgsIHk6IDE5NSwgcjogMTYsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogMzE2LCB5OiAxNjcsIHI6IDIxMiwgZzogMjEwLCBiOiAyMTIgfSxcbiAgICB7IHg6IDMzOCwgeTogMTczLCByOiA2NSwgZzogNzEsIGI6IDcxIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXdhcmQgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXdhcmQnLFxuICBbXG4gICAgeyB4OiAyNCwgeTogMzM2LCByOiAxNiwgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiA1NzcsIHk6IDI2LCByOiAwLCBnOiA0LCBiOiAwIH0sXG4gICAgeyB4OiA2MDEsIHk6IDMzNSwgcjogMTYsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogNDExLCB5OiAyNjgsIHI6IDgsIGc6IDExNCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MzQsIHk6IDI3MCwgcjogNjYsIGc6IDE0NCwgYjogMjUyIH0sXG4gICAgeyB4OiA0ODcsIHk6IDI3NCwgcjogMCwgZzogMTAyLCBiOiAyNDcgfSxcbiAgICB7IHg6IDQ5NywgeTogMTIyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0NjEsIHk6IDE5MywgcjogNDIsIGc6IDU4LCBiOiA1OCB9LFxuICBdLFxuICB7IHg6IDQxMiwgeTogMjcxIH0sXG4gIHsgeDogNDEyLCB5OiAyNzEgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGJlc3RQb3NpdGlvbkF3YXJkQm9udXMgPSBuZXcgUGFnZShcbiAgJ2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE0MSwgeTogMjEsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDYwOSwgeTogMjYsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDI2LCB5OiAzMzUsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDYyNiwgeTogMzM5LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA0LCB5OiAxNDgsIHI6IDgsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogNjI4LCB5OiAxNDAsIHI6IDE2LCBnOiAzMiwgYjogNDkgfSxcblxuICAgIC8vIHRlYW0gMSBiZWluZyBzZWxlY3RlZFxuICAgIHsgeDogMTczLCB5OiAxOCwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE3NiwgeTogMzAsIHI6IDE1OCwgZzogMTczLCBiOiAxOTkgfSxcbiAgICB7IHg6IDE4NCwgeTogMzYsIHI6IDgsIGc6IDEwNSwgYjogMjU1IH0sXG5cbiAgICAvLyB0ZWFtIDIgbm90IGJlaW5nIHNlbGVjdGVkXG4gICAgeyB4OiAzMjgsIHk6IDI3LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMzM3LCB5OiAzMSwgcjogMTYsIGc6IDQ4LCBiOiA4MiB9LFxuICAgIHsgeDogMzQzLCB5OiAzNywgcjogNDEsIGc6IDc3LCBiOiAxMTUgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1NDcsIHk6IDMyMCwgcjogMCwgZzogMTEzLCBiOiAyNDggfSxcbiAgICB7IHg6IDU2NiwgeTogMzIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzcsIHk6IDMyNCwgcjogMjI4LCBnOiAyMzksIGI6IDI0OCB9LFxuICAgIHsgeDogNjA1LCB5OiAzMjUsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiA2MTEsIHk6IDMxNiwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzMiA9IG5ldyBQYWdlKFxuICAnYmVzdFBvc2l0aW9uQXdhcmRCb251cycsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTQxLCB5OiAyMSwgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogNjA5LCB5OiAyNiwgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogMjYsIHk6IDMzNSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNjI2LCB5OiAzMzksIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDQsIHk6IDE0OCwgcjogOCwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0MCwgcjogMTYsIGc6IDMyLCBiOiA0OSB9LFxuXG4gICAgLy8gdGVhbSAxIG5vdCBiZWluZyBzZWxlY3RlZFxuICAgIHsgeDogMTg5LCB5OiAyMiwgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE3OCwgeTogMzQsIHI6IDgsIGc6IDQ4LCBiOiA4MiB9LFxuICAgIHsgeDogMTY5LCB5OiAzOSwgcjogNDEsIGc6IDc3LCBiOiAxMTUgfSxcblxuICAgIC8vIHRlYW0gMiBiZWluZyBzZWxlY3RlZFxuICAgIHsgeDogMzQzLCB5OiAyMSwgcjogMiwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzNywgeTogMzEsIHI6IDE2MywgZzogMTcwLCBiOiAxOTcgfSxcbiAgICB7IHg6IDMzMSwgeTogNDAsIHI6IDgsIGc6IDk3LCBiOiAyNTUgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1NDcsIHk6IDMyMCwgcjogMCwgZzogMTEzLCBiOiAyNDggfSxcbiAgICB7IHg6IDU2NiwgeTogMzIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzcsIHk6IDMyNCwgcjogMjI4LCBnOiAyMzksIGI6IDI0OCB9LFxuICAgIHsgeDogNjA1LCB5OiAzMjUsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiA2MTEsIHk6IDMxNiwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzR3JvdXAgPSBuZXcgR3JvdXBQYWdlKFxuICAnYmVzdFBvc2l0aW9uQXdhcmRCb251cycsXG4gIFtiZXN0UG9zaXRpb25Bd2FyZEJvbnVzLCBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzMl0sXG4gIGJlc3RQb3NpdGlvbkF3YXJkQm9udXMubmV4dCAvKiBuZXh0ICovXG4pO1xuXG4vLyBuZXh0IHBhZ2Ugb2YgZ0Jlc3RQb3NpdGlvbkF3YXJkQm9udXNcbmV4cG9ydCBjb25zdCBib251c0dyYW50ZWRCeVRlYW1SZWNvcmQgPSBuZXcgUGFnZShcbiAgJ2JvbnVzR3JhbnRlZEJ5VGVhbVJlY29yZCcsXG4gIFtcbiAgICAvLyB0YWJsZSBiZ1xuICAgIHsgeDogMzgsIHk6IDc1LCByOiA0OSwgZzogNjksIGI6IDEwNyB9LFxuICAgIHsgeDogNjAwLCB5OiA3MywgcjogNDksIGc6IDY5LCBiOiAxMDcgfSxcbiAgICB7IHg6IDYwMSwgeTogMjg5LCByOiAwLCBnOiA4LCBiOiAxNiB9LFxuICAgIHsgeDogMjgsIHk6IDI4NSwgcjogOCwgZzogMTIsIGI6IDE2IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMTc2LCB5OiA3NiwgcjogNDksIGc6IDY4LCBiOiAxMDcgfSxcbiAgICB7IHg6IDIxNywgeTogNzcsIHI6IDEyOCwgZzogMTM2LCBiOiAxNTkgfSxcbiAgICB7IHg6IDI1NSwgeTogNzYsIHI6IDEzMSwgZzogMTM3LCBiOiAxNTcgfSxcbiAgICB7IHg6IDI3OCwgeTogNzYsIHI6IDc4LCBnOiA5NSwgYjogMTI4IH0sXG4gICAgeyB4OiAzMjQsIHk6IDc3LCByOiAxMTMsIGc6IDEyMiwgYjogMTUwIH0sXG4gICAgeyB4OiAzNjIsIHk6IDc1LCByOiA0NiwgZzogNjYsIGI6IDEwNCB9LFxuICAgIHsgeDogNDA1LCB5OiA3NywgcjogMTc4LCBnOiAxODUsIGI6IDIwNiB9LFxuICAgIHsgeDogNDI1LCB5OiA3MiwgcjogMTg0LCBnOiAxODcsIGI6IDIwNiB9LFxuICAgIHsgeDogNDM5LCB5OiA3NywgcjogNTMsIGc6IDcwLCBiOiAxMTAgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1NDcsIHk6IDMyMCwgcjogMCwgZzogMTEzLCBiOiAyNDggfSxcbiAgICB7IHg6IDU2NiwgeTogMzIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzcsIHk6IDMyNCwgcjogMjI4LCBnOiAyMzksIGI6IDI0OCB9LFxuICAgIHsgeDogNjA1LCB5OiAzMjUsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiA2MTEsIHk6IDMxNiwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBwb3N0U2Vhc29uQXdhcmRCb251cyA9IG5ldyBQYWdlKFxuICAncG9zdFNlYXNvbkF3YXJkQm9udXMnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDM5LCB5OiAyNCwgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogMzIwLCB5OiAxNSwgcjogMCwgZzogODUsIGI6IDE2NSB9LFxuICAgIHsgeDogNjE1LCB5OiAyMywgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogMTEsIHk6IDI2OCwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogNjIxLCB5OiAyNTgsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDYyNCwgeTogMzUxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAxNywgeTogMzM4LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzMTYsIHk6IDM0MiwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDUzMSwgeTogMzE4LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogNTY0LCB5OiAzMjMsIHI6IDIxOCwgZzogMjM0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDU3NywgeTogMzIzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDgsIHk6IDMxOCwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNiwgeTogMzMxLCByOiA4LCBnOiAxMDUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVMaW5lVXAgPSBuZXcgUGFnZShcbiAgJ2dhbWVMaW5lVXAnLFxuICBbXG4gICAgLy8gY29udGVudCB0b3AgYmdcbiAgICB7IHg6IDU5MSwgeTogNTksIHI6IDQ5LCBnOiA3MywgYjogMTA3IH0sXG4gICAgLy8gcHJvZ3Jlc3MgYmdcbiAgICB7IHg6IDE5LCB5OiAyMTEsIHI6IDI0LCBnOiAzMiwgYjogNDkgfSxcbiAgICAvLyBiYXR0bGUgbGluZXVwIGJ1dHRvbiBpbiBib3R0b21cbiAgICB7IHg6IDUzNiwgeTogMzIyLCByOiA0MSwgZzogODEsIGI6IDEzNyB9LFxuICAgIHsgeDogNTUzLCB5OiAzMjIsIHI6IDE4OCwgZzogMjA5LCBiOiAyMjQgfSxcbiAgICB7IHg6IDU2OCwgeTogMzIyLCByOiAyMDQsIGc6IDIyMCwgYjogMjM0IH0sXG4gICAgeyB4OiA1ODUsIHk6IDMyNCwgcjogMTA3LCBnOiAxMzksIGI6IDE3NyB9LFxuICAgIHsgeDogNjA0LCB5OiAzMjQsIHI6IDI1LCBnOiA3MywgYjogMTMyIH0sXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjYsIHk6IDMxNCwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICAgIHsgeDogNDMsIHk6IDMyMSwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICAgIHsgeDogMzYsIHk6IDMyOSwgcjogMjExLCBnOiAyMTYsIGI6IDIxMCB9LFxuICBdLFxuICB7IHg6IDQwLCB5OiAzMjQgfSxcbiAgeyB4OiA0MCwgeTogMzI0IH1cbik7XG5cbmV4cG9ydCBjb25zdCBwbGF5ZXJHcm93dGhDb21wbGV0ZSA9IG5ldyBQYWdlKFxuICAncGxheWVyR3Jvd3RoQ29tcGxldGUnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExNSwgeTogNDcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNCwgeTogMzAwLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTQsIHk6IDMwMSwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTIyLCB5OiA3NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTEwLCB5OiAxNjksIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDExMCwgeTogMjMwLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MjIsIHk6IDE1NiwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTEzLCB5OiAyMzAsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIGNvbnRpbnVlXG4gICAgeyB4OiAyNDAsIHk6IDMwMCwgcjogOCwgZzogMTE0LCBiOiAyNDggfSxcbiAgICB7IHg6IDMxMiwgeTogMzAxLCByOiAyMjMsIGc6IDIzMywgYjogMjQ3IH0sXG4gICAgeyB4OiAzMzcsIHk6IDMwNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzk5LCB5OiAzMDIsIHI6IDgsIGc6IDExMCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzI1LCB5OiAzMDQgfSxcbiAgeyB4OiAzMjUsIHk6IDMwNCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZSA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZScsXG4gIFtcbiAgICAvLyB0aXRsZSBiZyAmIHhcbiAgICB7IHg6IDIwLCB5OiAzNCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjAsIHk6IDYzLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA2MDAsIHk6IDM2LCByOiAyMTIsIGc6IDIwOSwgYjogMjEyIH0sXG4gICAgeyB4OiA2MTEsIHk6IDU2LCByOiAyMjIsIGc6IDIxOCwgYjogMjIyIH0sXG4gICAgeyB4OiA0NDIsIHk6IDY3LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG5cbiAgICAvLyBwcm9ncmVzcyBiYXIgYmdcbiAgICB7IHg6IDE2LCB5OiA3OSwgcjogMCwgZzogNDksIGI6IDkwIH0sXG4gICAgeyB4OiAxOCwgeTogMTkzLCByOiAwLCBnOiA0OSwgYjogOTAgfSxcbiAgICB7IHg6IDYxNiwgeTogMTk5LCByOiAxNiwgZzogNjUsIGI6IDExNSB9LFxuXG4gICAgLy8gYmcgaW4gYm90dG9tXG4gICAgeyB4OiA2MTgsIHk6IDIxNSwgcjogMzMsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAzMjYsIHI6IDQxLCBnOiA0NSwgYjogNDkgfSxcbiAgXSxcbiAgeyB4OiA2MDAsIHk6IDQ1IH0sXG4gIHsgeDogNjAwLCB5OiA0NSB9XG4pO1xuLy8gclxuXG5leHBvcnQgY29uc3QgbGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlQm9udXNQbGF5ZXInLFxuICBbXG4gICAgLy8gdGl0bGUgYW5kIHhcbiAgICB7IHg6IDE3MywgeTogNTgsIHI6IDE0NywgZzogMTUzLCBiOiAxNTYgfSxcbiAgICB7IHg6IDIyOSwgeTogNTgsIHI6IDc5LCBnOiA4MiwgYjogODIgfSxcbiAgICB7IHg6IDMyMCwgeTogNjAsIHI6IDE2MCwgZzogMTYzLCBiOiAxNjQgfSxcbiAgICB7IHg6IDM3MywgeTogNTUsIHI6IDE3NywgZzogMTg0LCBiOiAxODUgfSxcbiAgICB7IHg6IDQ0MywgeTogNjAsIHI6IDEwMSwgZzogMTA1LCBiOiAxMTAgfSxcbiAgICB7IHg6IDUyMSwgeTogNTEsIHI6IDY2LCBnOiA2OSwgYjogNjYgfSxcblxuICAgIC8vIGxvZ28gb24gY2VudGVyXG4gICAgeyB4OiAyOTAsIHk6IDEzMiwgcjogOCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzMjUsIHk6IDE1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzU3LCB5OiAxMzMsIHI6IDE4OSwgZzogMCwgYjogMzMgfSxcblxuICAgIC8vIG5leHRcbiAgICB7IHg6IDI4MSwgeTogMjk4LCByOiA4LCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIzLCB5OiAyOTksIHI6IDIyMCwgZzogMjM0LCBiOiAyNTAgfSxcbiAgICB7IHg6IDM2NSwgeTogMzA3LCByOiA4LCBnOiAxMDEsIGI6IDI0NyB9LFxuICAgIHsgeDogMzA3LCB5OiAzMDEsIHI6IDI1MCwgZzogMjUyLCBiOiAyNTQgfSxcbiAgICB7IHg6IDMyOSwgeTogMjk3LCByOiAyNTIsIGc6IDI1MywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcGl0Y2hlck9mVGhlTW9udGggPSBuZXcgUGFnZShcbiAgJ3BpdGNoZXJPZlRoZU1vbnRoJyxcbiAgW1xuICAgIHsgeDogMjcsIHk6IDM4LCByOiAxODEsIGc6IDE4NiwgYjogMTk4IH0sXG4gICAgeyB4OiA2MDIsIHk6IDQ2LCByOiAxNTQsIGc6IDE1MiwgYjogMTU1IH0sXG4gICAgeyB4OiA1MzUsIHk6IDMwOSwgcjogMTM5LCBnOiAxODgsIGI6IDI1NSB9LFxuICAgIHsgeDogNjA1LCB5OiAzMTYsIHI6IDAsIGc6IDk3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDM5MSwgeTogMzA5LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTQ1LCB5OiAzMTAgfSxcbiAgeyB4OiA1NDUsIHk6IDMxMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbXZwID0gbmV3IFBhZ2UoXG4gICdtdnAnLFxuICBbXG4gICAgeyB4OiAyNzMsIHk6IDIzLCByOiAwLCBnOiA4OSwgYjogMTY1IH0sXG4gICAgeyB4OiAyOTcsIHk6IDI1LCByOiA5MCwgZzogMTQ1LCBiOiAyMDAgfSxcbiAgICB7IHg6IDMyMCwgeTogMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMiwgeTogMjksIHI6IDEyNiwgZzogMTY5LCBiOiAyMDQgfSxcbiAgICB7IHg6IDM4MCwgeTogNTMsIHI6IDAsIGc6IDY1LCBiOiAxMjIgfSxcbiAgICB7IHg6IDQ5MywgeTogMzIyLCByOiAxNiwgZzogMjAsIGI6IDggfSxcbiAgICB7IHg6IDU2OCwgeTogMzIwLCByOiAzOCwgZzogMTIwLCBiOiAyMTggfSxcbiAgICB7IHg6IDYzNSwgeTogMzQxLCByOiA4LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNjIwLCB5OiAxNjQsIHI6IDAsIGc6IDgsIGI6IDggfSxcbiAgICB7IHg6IDksIHk6IDE3NiwgcjogMTIsIGc6IDI0LCBiOiAyNCB9LFxuICBdLFxuICB7IHg6IDU2OCwgeTogMzIwIH0sXG4gIHsgeDogNTY4LCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFJld2FyZFBsYXllciA9IG5ldyBQYWdlKFxuICAnc2VsZWN0UmV3YXJkUGxheWVyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiA0LCB5OiA2LCByOiAwLCBnOiA5NywgYjogMTg5IH0sXG4gICAgeyB4OiAxMSwgeTogMzQ2LCByOiAxNiwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDcsIHk6IDM1MCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuXG4gICAgLy8gZm9ybSBiZyBpbiBib3R0b21cbiAgICB7IHg6IDY1LCB5OiAzMDEsIHI6IDY2LCBnOiA3NywgYjogNjYgfSxcbiAgICB7IHg6IDY1LCB5OiAzMjYsIHI6IDQwLCBnOiA0NSwgYjogMzMgfSxcbiAgICB7IHg6IDE3NSwgeTogMzAzLCByOiA2NiwgZzogNzcsIGI6IDU4IH0sXG4gICAgeyB4OiAxNzQsIHk6IDMyOCwgcjogNDEsIGc6IDQ1LCBiOiAzMyB9LFxuICAgIHsgeDogMjc1LCB5OiAzMDQsIHI6IDY2LCBnOiA3MywgYjogNTggfSxcbiAgICB7IHg6IDI3NSwgeTogMzI0LCByOiA0MSwgZzogNDgsIGI6IDMzIH0sXG4gICAgeyB4OiAzODQsIHk6IDMwMSwgcjogNjYsIGc6IDczLCBiOiA1OCB9LFxuICAgIHsgeDogMzg0LCB5OiAzMjEsIHI6IDQxLCBnOiA0NSwgYjogMzMgfSxcbiAgXSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9LFxuICB7IHg6IDU2OCwgeTogMzIwIH1cbik7XG4vLyBUT0RPOiBjaGVjayB0aGUgcG9zaXRpb24sIG11c3QgYmUgYmcgb2YgJ2RpYW1vbmQnLCAnb2xkJyAuLi5cbi8vIGJnIG9mIHRoZSB3b3JkXG4vLyByZWY6IGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9tbGI5aW5uaW5ncy9waG90b3MvMTM2NjU5NjEwMzc0ODU3MFxuLy8gbGVmdCwgbWlkIGFuZCByaWdodCByZXNwZWN0aXZlbHlcbmV4cG9ydCBjb25zdCBzZWxlY3RSZXdhcmRQbGF5ZXJCdG5zID0gW1xuICB7IHg6IDY2LCB5OiAyMTcgfSxcbiAgeyB4OiAyMjEsIHk6IDIxNyB9LFxuICB7IHg6IDM3NywgeTogMjE3IH0sXG5dO1xuLy8gb25seSBpbmNsdWRlIGJhc2ljIHR5cGVzXG4vLyB7cn0te2d9LXtifTogcHJvcml0eVxuLy8gdHJ5IHggMjMsIHkgMjYwIGluIHBsYXllciBpbmZvXG5leHBvcnQgY29uc3QgcGxheWVyQ2FyZENvbG9yVG9SYW5rOiB7IFtrOiBzdHJpbmddOiBudW1iZXIgfSA9IHtcbiAgJzY2LTc0LTc0JzogMSwgLy8gbm9ybWFsIFRPRE86IHVua25vd24gY29sb3JcbiAgJzk5LTY1LTQxJzogMiwgLy8gYnJvd25cbiAgJzk5LTY1LTQ5JzogMiwgLy8gYnJvd25cbiAgJzEzMi0xMjktMTQ4JzogMywgLy8gc2lsdmVyXG4gICcxODktMTY2LTQ5JzogNCwgLy8gZ29sZFxuICAnMTg5LTE2Ni01OCc6IDQsIC8vIGdvbGRcbiAgJzE5OC0xNzAtNTcnOiA0LCAvLyBnb2xkXG4gICcxNDgtMTAxLTI1JzogNCwgLy8gZ29sZFxuICAnMTY1LTE2Ni05MCc6IDQsIC8vIGdvbGRcbiAgJzQxLTY5LTEwNyc6IDUsIC8vIGRpYW1vbmQgVE9ETzogdW5rbm93biBjb2xvclxufTtcblxuLy8gYWRSZXdhcmQgcGFnZXNcbmV4cG9ydCBjb25zdCBhZFJld2FyZCA9IG5ldyBQYWdlKFxuICAnYWRSZXdhcmQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDI4LCB5OiA0NSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzYsIHk6IDI2NywgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogMzIsIHk6IDMwNywgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogNjA1LCB5OiA1MiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNjExLCB5OiAyNDQsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDYwNywgeTogMzE5LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG5cbiAgICAvLyB3YXRjaCBhZCBpY29uICYgYnRuIGJnXG4gICAgeyB4OiAzNDQsIHk6IDMwMCwgcjogNDksIGc6IDE2MiwgYjogOTAgfSxcbiAgICB7IHg6IDQ5MCwgeTogMzE4LCByOiA0MSwgZzogMTQyLCBiOiA4MiB9LFxuICAgIHsgeDogMzYxLCB5OiAzMDgsIHI6IDAsIGc6IDE0NywgYjogMTQxIH0sXG4gICAgeyB4OiAzNzUsIHk6IDMxNiwgcjogMCwgZzogMTEwLCBiOiAxMDcgfSxcblxuICAgIC8vIGNhbmNlbFxuICAgIHsgeDogMTkwLCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyMDQsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDIxOSwgeTogMzEwLCByOiAyNDIsIGc6IDI0NiwgYjogMjUzIH0sXG4gICAgeyB4OiAyMzIsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI0NywgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMjU4LCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogNDA0LCB5OiAzMTAgfSxcbiAgeyB4OiAyMjQsIHk6IDMxMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgYWRSZXdhcmRSZWRlZW0gPSBuZXcgUGFnZShcbiAgJ2FkUmV3YXJkUmVkZWVtJyxcbiAgW1xuICAgIC8vIGFkIHJld2FyZCB0aXRsZVxuICAgIHsgeDogMjc0LCB5OiA1MSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzAyLCB5OiA0OSwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzM0LCB5OiA1MSwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzU2LCB5OiA1MiwgcjogOTAsIGc6IDk0LCBiOiAxMDIgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAyNSwgeTogNDYsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDM2LCB5OiAzMDcsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDYwMSwgeTogNDIsIHI6IDEyMywgZzogMTE4LCBiOiAxMjMgfSxcbiAgICB7IHg6IDU5MSwgeTogMzE4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAyMSwgeTogMjczLCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiAxOCwgeTogODEsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDYxNiwgeTogODUsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDYwOCwgeTogMjY5LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMzAxLCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzMTksIHk6IDMwNywgcjogMTksIGc6IDExNywgYjogMjQ0IH0sXG4gICAgeyB4OiAzNDksIHk6IDMwNywgcjogOCwgZzogMTEzLCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAzMDMsIHk6IDMwNCB9LFxuICB7IHg6IDMwMywgeTogMzA0IH1cbik7XG5cbmV4cG9ydCBjb25zdCBhZFJld2FyZE9uQ0QgPSBuZXcgUGFnZShcbiAgJ2FkUmV3YXJkT25DRCcsXG4gIFtcbiAgICAvLyB0aXRsZSAoYWxlcnQpXG4gICAgeyB4OiAyMjAsIHk6IDUzLCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAzMTIsIHk6IDU4LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAzMzAsIHk6IDU1LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMjg4LCB5OiAzMDEsIHI6IDgsIGc6IDExNCwgYjogMjQ4IH0sXG4gICAgeyB4OiAzMTMsIHk6IDMwNCwgcjogMTU5LCBnOiAxOTAsIGI6IDIzNSB9LFxuICAgIHsgeDogMzYyLCB5OiAzMDcsIHI6IDgsIGc6IDk4LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1MTYsIHk6IDQ4IH0sIC8vIGNsb3NlXG4gIHsgeDogNTE2LCB5OiA0OCB9XG4pO1xuXG5leHBvcnQgY29uc3QgYWRHcm91cCA9IG5ldyBHcm91cFBhZ2UoJ2FkUGFnZXMnLCBbYWRSZXdhcmQsIGFkUmV3YXJkUmVkZWVtLCBhZFJld2FyZE9uQ0RdKTtcblxuLy8gd2Vla2x5IG1pc3Npb24gcGFnZXNcbmV4cG9ydCBjb25zdCBhY2hpdmVtZW50TWlzc2lvbiA9IG5ldyBQYWdlKFxuICAnYWNoaXZlbWVudE1pc3Npb24nLFxuICBbXG4gICAgLy8gdG9kYXkgbWlzc2lvbiBiZ1xuICAgIHsgeDogMjM1LCB5OiA1NSwgcjogMjQ3LCBnOiAyNDcsIGI6IDI0NyB9LFxuICAgIHsgeDogMjMxLCB5OiA3MSwgcjogMjQ3LCBnOiAyNDcsIGI6IDI0NyB9LFxuICAgIHsgeDogNTg4LCB5OiA3MiwgcjogMjQ3LCBnOiAyNDcsIGI6IDI0NyB9LFxuXG4gICAgLy8gbGVmdCBzZWN0aW9uIHdvcmxkIHJlY29yZCBiZyBsZWZ0IGJvdHRvbVxuICAgIHsgeDogMTYsIHk6IDI5MywgcjogMjUsIGc6IDQwLCBiOiA3NCB9LFxuXG4gICAgLy8gcGxheWVyIGhlYWRcbiAgICB7IHg6IDc1LCB5OiA4OCwgcjogNjYsIGc6IDU5LCBiOiA5MCB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMzEsIHk6IDMxNiwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICBdLFxuICB7IHg6IDU4MCwgeTogMjc4IH0sIC8vIGNvbXBsZXRlIHdlZWtseSBtaXNzaW9uIGJveFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3ggPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3gnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodCBwYXJ0IChwLCBzdGFyIC4uLilcbiAgICB7IHg6IDI5OSwgeTogMTMsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxOCwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzEzLCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzOTIsIHk6IDksIHI6IDIzMiwgZzogMjI5LCBiOiAyMzIgfSxcbiAgICB7IHg6IDM4NSwgeTogMiwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogNDk2LCB5OiAxMywgcjogMjM4LCBnOiAxNjYsIGI6IDE2IH0sXG4gICAgeyB4OiA0ODMsIHk6IDQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTYgfSxcbiAgICB7IHg6IDU5NywgeTogMTAsIHI6IDIxMywgZzogMjI2LCBiOiAyMzggfSxcbiAgICB7IHg6IDYyOCwgeTogMTQsIHI6IDIxNCwgZzogMjExLCBiOiAyMTQgfSxcblxuICAgIC8vIGJnIG9mIHRhYmxlXG4gICAgeyB4OiAxNCwgeTogODIsIHI6IDMzLCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDE2LCB5OiAyODgsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcbiAgICB7IHg6IDYxNSwgeTogMTAwLCByOiAzMywgZzogMzYsIGI6IDQxIH0sXG4gICAgeyB4OiA2MTMsIHk6IDI4MywgcjogMzMsIGc6IDQ0LCBiOiA1OCB9LFxuXG4gICAgLy8gZGVzY3JpcHRpb24gZm9vdGVyXG4gICAgeyB4OiA4MCwgeTogMzA3LCByOiAyMDIsIGc6IDIwMSwgYjogMTk2IH0sXG4gICAgeyB4OiA4OSwgeTogMzE1LCByOiA0OSwgZzogNjEsIGI6IDM0IH0sXG4gICAgeyB4OiAxMDMsIHk6IDMxOSwgcjogNzMsIGc6IDgzLCBiOiA2NiB9LFxuICAgIHsgeDogMTcyLCB5OiAzMzUsIHI6IDc4LCBnOiA4NCwgYjogNzIgfSxcbiAgICB7IHg6IDI1MCwgeTogMzM4LCByOiAxMDEsIGc6IDEwNiwgYjogOTMgfSxcbiAgICB7IHg6IDI3MywgeTogMzA3LCByOiAxNTksIGc6IDE1OSwgYjogMTQ5IH0sXG4gICAgeyB4OiAyODQsIHk6IDMwOSwgcjogNTYsIGc6IDYxLCBiOiA0MCB9LFxuXG4gICAgLy8gYmFjayBidG5cbiAgICB7IHg6IDI0LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQyLCB5OiAzMTcsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxLCB5OiAzMzEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sIC8vIGJhY2sgYnRuXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5leHBvcnQgY29uc3Qgd2Vla2x5TWlzc2lvbkJveEJ0bnMgPSB7XG4gIG9wZW5Cb3g6IHsgeDogNDE4LCB5OiAzMjUgfSxcbiAgcmVjZWl2ZVJld2FyZDogeyB4OiA1NjEsIHk6IDMyNiB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3hDb25maXJtID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94Q29uZmlybScsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTExLCB5OiA0MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTE3LCB5OiAzMDQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNSwgeTogMzAwLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTksIHk6IDE3NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI0MCwgeTogNTgsIHI6IDE1NSwgZzogMTYwLCBiOiAxNjMgfSxcbiAgICB7IHg6IDI2NywgeTogNTgsIHI6IDE0MSwgZzogMTQ3LCBiOiAxNDkgfSxcbiAgICB7IHg6IDMyNSwgeTogNTksIHI6IDE2MSwgZzogMTY3LCBiOiAxNzAgfSxcbiAgICB7IHg6IDM4MywgeTogNTksIHI6IDE3MSwgZzogMTc5LCBiOiAxNzkgfSxcbiAgICB7IHg6IDQwNywgeTogNTksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxNSwgeTogNDksIHI6IDE4NywgZzogMTg1LCBiOiAxODggfSxcbiAgICB7IHg6IDUxOSwgeTogNTUsIHI6IDkxLCBnOiA5MSwgYjogOTIgfSxcblxuICAgIC8vIG5vICYgeWVzIGJ0blxuICAgIHsgeDogMjEwLCB5OiAyOTMsIHI6IDQxLCBnOiA4MSwgYjogMTIzIH0sXG4gICAgeyB4OiAyMzgsIHk6IDI5NiwgcjogNDUsIGc6IDgxLCBiOiAxMjggfSxcbiAgICB7IHg6IDI4NCwgeTogMjk0LCByOiA0MSwgZzogNzgsIGI6IDEyMyB9LFxuXG4gICAgeyB4OiAzOTcsIHk6IDI5OSwgcjogNDAsIGc6IDEzNCwgYjogMjUzIH0sXG4gICAgeyB4OiA0MzMsIHk6IDMwNywgcjogOCwgZzogOTgsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDM4NywgeTogMzAwIH0sIC8vIHllcyBidG5cbiAgeyB4OiAzODcsIHk6IDMwMCB9XG4pO1xuXG5leHBvcnQgY29uc3Qgd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94UmVjZWl2ZWQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMywgeTogNTMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNywgeTogMzA3LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0OTYsIHk6IDI5OSwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDIxNywgeTogNTUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI1OSwgeTogNTUsIHI6IDE3NywgZzogMTgxLCBiOiAxODUgfSxcbiAgICB7IHg6IDI5OCwgeTogNTksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDM0MSwgeTogNjAsIHI6IDEyMCwgZzogMTI0LCBiOiAxMjggfSxcbiAgICB7IHg6IDM4NiwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDQwNywgeTogNTgsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxMiwgeTogNDcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODIgfSxcbiAgICB7IHg6IDUxOSwgeTogNTMsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcblxuICAgIC8vIG9rIGJ0blxuICAgIHsgeDogMjg4LCB5OiAyOTcsIHI6IDgsIGc6IDEyMiwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDMwMCwgcjogMTM2LCBnOiAxOTAsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDEsIHI6IDgsIGc6IDExNCwgYjogMjQ4IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSwgLy8gb2sgYnRuXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcblxuLy8gZ2VuZXJhbCBwYWdlc1xuZXhwb3J0IGNvbnN0IHBvd2VyU2F2aW5nID0gbmV3IFBhZ2UoXG4gICdwb3dlclNhdmluZycsXG4gIFtcbiAgICB7IHg6IDMwNCwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA2LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNywgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDgsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuXG4gICAgeyB4OiAzMDEsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzAyLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwMywgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDQsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA1LCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDEzNywgeTogMTU1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjEsIHk6IDE2MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogMjk4LCB5OiA1MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjE4LCB5OiAxMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIC8vIHRvIGRpZmYgZnJvbSBwb3dlciBzYXZpbmcgZHVyaW5nIHBsYXlpbmdcbiAgICB7IHg6IDQ5NywgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA0OTgsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNDk5LCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUwMCwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDEsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTAyLCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUwMywgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NTUsIHk6IDI4MiwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTU1LCB5OiAyOTIsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0NSwgeTogMjkxLCByOiAwLCBnOiAwLCBiOiAwIH0sXG5cbiAgICAvLyBzY29yZVxuICAgIHsgeDogNTIwLCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUyNSwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MzAsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTM1LCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0MCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDUsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTUwLCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUyMCwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjUsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTMwLCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzNSwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQ1LCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1MCwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHByb21vdGlvbjEgPSBuZXcgUGFnZShcbiAgJ3Byb21vdGlvbjEnLFxuICBbXG4gICAgeyB4OiA2MDMsIHk6IDI3LCByOiAxMjQsIGc6IDEzMCwgYjogMTMyIH0sXG4gICAgeyB4OiA2MTIsIHk6IDMzLCByOiA2MCwgZzogNjAsIGI6IDYwIH0sXG4gICAgeyB4OiA2MDUsIHk6IDQwLCByOiAxNzQsIGc6IDE3OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MDUsIHk6IDM1LCByOiAxODEsIGc6IDE3OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MTIsIHk6IDM5LCByOiAxODEsIGc6IDE3OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MTYsIHk6IDM5LCByOiAxODEsIGc6IDE3OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MTUsIHk6IDI5LCByOiAxNDIsIGc6IDE0NCwgYjogMTQyIH0sXG4gIF0sXG4gIHsgeDogNjExLCB5OiAzNiB9LFxuICB7IHg6IDYxMSwgeTogMzYgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHByb21vdGlvbjIgPSBuZXcgUGFnZShcbiAgJ3Byb21vdGlvbjInLFxuICBbXG4gICAgeyB4OiA0MywgeTogMzEsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDMwNiwgeTogMjksIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDU0NiwgeTogMzIsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDU3NiwgeTogMzYsIHI6IDE3MywgZzogMTc0LCBiOiAxODAgfSxcbiAgICB7IHg6IDU4MCwgeTogNDAsIHI6IDE3NCwgZzogMTcyLCBiOiAxNzUgfSxcbiAgICB7IHg6IDU4NywgeTogMzYsIHI6IDIwNiwgZzogMjA3LCBiOiAyMTMgfSxcbiAgICB7IHg6IDU3NiwgeTogNDYsIHI6IDIxMywgZzogMjExLCBiOiAyMTUgfSxcbiAgICB7IHg6IDU4NCwgeTogNDUsIHI6IDIxMiwgZzogMjEwLCBiOiAyMTMgfSxcbiAgICB7IHg6IDU5NSwgeTogNTUsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiA1NzgsIHk6IDM5IH0sXG4gIHsgeDogNTc4LCB5OiAzOSB9XG4pO1xuXG5leHBvcnQgY29uc3QgcHJvbW90aW9uMyA9IG5ldyBQYWdlKFxuICAncHJvbW90aW9uMycsXG4gIFtcbiAgICB7IHg6IDU5OCwgeTogMzcsIHI6IDEwMSwgZzogMTAzLCBiOiAxMDIgfSxcbiAgICB7IHg6IDYwNCwgeTogNDUsIHI6IDcxLCBnOiA3MywgYjogNzEgfSxcbiAgICB7IHg6IDYxMiwgeTogNTMsIHI6IDE3NCwgZzogMTc1LCBiOiAxNzYgfSxcbiAgICB7IHg6IDYxNywgeTogMzMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgXSxcbiAgeyB4OiA2MDEsIHk6IDQzIH0sXG4gIHsgeDogNjAxLCB5OiA0MyB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmVjaGFyZ2VQcm9tb3Rpb24gPSBuZXcgUGFnZShcbiAgJ3JlY2hhcmdlUHJvbW90aW9uJyxcbiAgW1xuICAgIHsgeDogMTE0LCB5OiA0NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjI5LCB5OiA1OSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMjgwLCB5OiA2MCwgcjogMzUsIGc6IDQzLCBiOiA0OCB9LFxuICAgIHsgeDogMzQwLCB5OiA1OCwgcjogMTc2LCBnOiAxODEsIGI6IDE4NSB9LFxuICAgIHsgeDogNDA3LCB5OiA2NiwgcjogMzgsIGc6IDQ1LCBiOiA0NyB9LFxuICAgIHsgeDogNDU2LCB5OiA4OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIwLCB5OiA1MCwgcjogNjcsIGc6IDY4LCBiOiA2OCB9LFxuICAgIHsgeDogNTI0LCB5OiA1OCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTI5LCB5OiA0MywgcjogMTUxLCBnOiAxNTUsIGI6IDE1NiB9LFxuICAgIHsgeDogMTgwLCB5OiAzMDIsIHI6IDc1LCBnOiAxNDksIGI6IDI1NSB9LFxuICAgIHsgeDogMTQ0LCB5OiAyODksIHI6IDQxLCBnOiAxNDIsIGI6IDI1NSB9LFxuICAgIHsgeDogMTEwLCB5OiAzMDAsIHI6IDIyMiwgZzogMjIzLCBiOiAyMjIgfSxcbiAgICB7IHg6IDMzNywgeTogMjg4LCByOiA0MSwgZzogMTQyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NiwgeTogMzAyLCByOiAyNTIsIGc6IDI1MywgYjogMjU0IH0sXG4gICAgeyB4OiA0MzgsIHk6IDMwMiwgcjogMjU1LCBnOiAyMjYsIGI6IDEyNSB9LFxuICAgIHsgeDogNTIyLCB5OiAzMTEsIHI6IDIyMiwgZzogMjIzLCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiA1MTgsIHk6IDUzIH0sXG4gIHsgeDogNTE4LCB5OiA1MyB9XG4pO1xuXG5leHBvcnQgY29uc3QgdGVhbVN1cHBvcnRQYWNrYWdlUHJvbW90aW9uID0gbmV3IFBhZ2UoXG4gICd0ZWFtU3VwcG9ydFBhY2thZ2VQcm9tb3Rpb24nLFxuICBbXG4gICAgLy8gaGVhZGVyIGJnIGFuZCB4XG4gICAgeyB4OiA1NTgsIHk6IDM3LCByOiA5MCwgZzogMTkwLCBiOiAxNDggfSxcbiAgICB7IHg6IDU3NiwgeTogNDIsIHI6IDE0OCwgZzogMjAzLCBiOiAxNzMgfSxcbiAgICB7IHg6IDU5MCwgeTogNDUsIHI6IDE0NSwgZzogMjAzLCBiOiAxNzEgfSxcblxuICAgIC8vIHB1cmNoYXNlIGJ1dHRvblxuICAgIHsgeDogNTc2LCB5OiAyNzcsIHI6IDI1NSwgZzogMjIzLCBiOiAwIH0sXG4gICAgeyB4OiA0ODAsIHk6IDI3OCwgcjogMjU1LCBnOiAyMTAsIGI6IDAgfSxcbiAgICB7IHg6IDUwNiwgeTogMjc4LCByOiAxMjAsIGc6IDc2LCBiOiA4IH0sXG4gICAgeyB4OiA1MjIsIHk6IDI3NCwgcjogMjQ5LCBnOiAyNDUsIGI6IDAgfSxcbiAgICB7IHg6IDUzOCwgeTogMjc3LCByOiAxMjgsIGc6IDgxLCBiOiA3IH0sXG4gIF0sXG4gIHsgeDogNTgzLCB5OiA0NSB9LFxuICB7IHg6IDU4MywgeTogNDUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGVudGVyR2FtZVByb21vdGlvbiA9IG5ldyBQYWdlKFxuICAnZW50ZXJHYW1lUHJvbW90aW9uJyxcbiAgW1xuICAgIC8vIHhcbiAgICB7IHg6IDI3NywgeTogMjgwLCByOiAxMTMsIGc6IDEyNCwgYjogMTQ3IH0sXG5cbiAgICAvLyBkb250IHNob3cgdGhpcyBhZ2FpbiB0b2RheVxuICAgIHsgeDogMjQwLCB5OiAyODAsIHI6IDEwLCBnOiA3LCBiOiAzIH0sXG4gICAgeyB4OiAyMDcsIHk6IDI4MSwgcjogMzYsIGc6IDM5LCBiOiA0NyB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDI3OSwgeTogMzYsIHI6IDMsIGc6IDMsIGI6IDMgfSxcbiAgICB7IHg6IDc2LCB5OiAxNjksIHI6IDAsIGc6IDIsIGI6IDUgfSxcbiAgICB7IHg6IDMyNiwgeTogMzM3LCByOiAzLCBnOiAzLCBiOiAyIH0sXG4gICAgeyB4OiA1NzEsIHk6IDIxMSwgcjogMiwgZzogMiwgYjogNSB9LFxuICBdLFxuICB7IHg6IDQ4NSwgeTogMjgxIH0sXG4gIHsgeDogNDg1LCB5OiAyODEgfVxuKTtcblxuLy8gVE9ETzogYWRkIHRoaXMgcGFnZVxuLy8gZXhwb3J0IGNvbnN0IGVudGVyR2FtZVByb21vdGlvbiA9IG5ldyBQYWdlKFxuLy8gICAnZW50ZXJHYW1lUHJvbW90aW9uJyxcbi8vICAgW1xuXG4vLyAgIF0sXG4vLyAgIHsgeDogNTgzLCB5OiA0NSB9LFxuLy8gICB7IHg6IDU4MywgeTogNDUgfVxuLy8gKTtcblxuLy8gYSBwYWdlIHdpdGggYSBjbG9zZSBidG4gYnV0IHRhbGxlciB0aGFuIHByb21vdGlvbiBwYWdlXG5leHBvcnQgY29uc3QgZXZlbnQgPSBuZXcgUGFnZShcbiAgJ2V2ZW50JyxcbiAgW1xuICAgIHsgeDogMjAsIHk6IDIxLCByOiAyNTMsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiA0NywgeTogMzIsIHI6IDEzMiwgZzogMTM0LCBiOiAxNDAgfSxcbiAgICB7IHg6IDQ4LCB5OiAyMywgcjogMjQ2LCBnOiAyNDcsIGI6IDI0NyB9LFxuICAgIHsgeDogNjAzLCB5OiAxOSwgcjogMTI0LCBnOiAxMzAsIGI6IDEzMiB9LFxuICAgIHsgeDogNjEyLCB5OiAyMiwgcjogNDksIGc6IDUyLCBiOiA0OSB9LFxuICAgIHsgeDogNjIyLCB5OiAyNiwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICBdLFxuICB7IHg6IDYxMSwgeTogMjMgfSxcbiAgeyB4OiA2MTEsIHk6IDIzIH1cbik7XG5cbmV4cG9ydCBjb25zdCByZXZpZXdBcHAgPSBuZXcgUGFnZShcbiAgJ3Jldmlld0FwcCcsXG4gIFtcbiAgICB7IHg6IDEwNiwgeTogNDIsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMxNiwgeTogNTgsIHI6IDg0LCBnOiA5MCwgYjogOTMgfSxcbiAgICB7IHg6IDUxMCwgeTogNDMsIHI6IDE2OCwgZzogMTc2LCBiOiAxNzYgfSxcbiAgICB7IHg6IDUyNSwgeTogNTcsIHI6IDE0MywgZzogMTQ0LCBiOiAxNDQgfSxcbiAgICB7IHg6IDMwNSwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDMzOCwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDExNCwgeTogMzAxLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAxNTMsIHk6IDI5NywgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE3OCwgeTogMjk5LCByOiAxNjgsIGc6IDE5MCwgYjogMjI0IH0sXG4gICAgeyB4OiAyNDEsIHk6IDI5OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjg1LCB5OiAzMDUsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDMwMiwgcjogNzksIGc6IDEwOCwgYjogMTQ1IH0sXG4gICAgeyB4OiAzNjUsIHk6IDMwMiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDIxLCB5OiAyOTksIHI6IDgsIGc6IDExNCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MzgsIHk6IDI5OSwgcjogNDcsIGc6IDEzOCwgYjogMjU0IH0sXG4gICAgeyB4OiA0ODksIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDUyOCwgeTogMzA1LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogMTYxLCB5OiAyOTIgfSxcbiAgeyB4OiAxNjEsIHk6IDI5MiB9XG4pO1xuXG4vLyBwYWdlIGhhcyBvayBidXR0b25cbmV4cG9ydCBjb25zdCBvayA9IG5ldyBQYWdlKFxuICAnb2snLFxuICBbXG4gICAgeyB4OiAyNzksIHk6IDMwMCwgcjogMCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxMCwgeTogMzAxLCByOiAxMzYsIGc6IDE4OCwgYjogMjU0IH0sXG4gICAgeyB4OiAzMjYsIHk6IDMwMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzYyLCB5OiAzMDAsIHI6IDAsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiAzNjksIHk6IDMxMiwgcjogOCwgZzogMTAxLCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAzMTksIHk6IDMwMyB9LFxuICB7IHg6IDMxOSwgeTogMzAzIH1cbik7XG5cbi8vIHBhZ2UgaGFzIG5leHQgYnV0dG9uXG5leHBvcnQgY29uc3QgbmV4dCA9IG5ldyBQYWdlKFxuICAnbmV4dCcsXG4gIFtcbiAgICB7IHg6IDI3MywgeTogMzA0LCByOiA4LCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzA1LCB5OiAzMDcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNCwgeTogMzE0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjEsIHk6IDMwNSwgcjogMjI0LCBnOiAyMzYsIGI6IDI1NSB9LFxuICAgIHsgeDogMzI4LCB5OiAzMTAsIHI6IDEsIGc6IDEwNiwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzMsIHk6IDI5OSwgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM3NCwgeTogMzA1LCByOiA4LCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzgwLCB5OiAzMTksIHI6IDAsIGc6IDg5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI2NSwgeTogMzE4LCByOiAwLCBnOiA4OSwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfSxcbiAgeyB4OiAzNDYsIHk6IDMwNyB9XG4pO1xuXG5leHBvcnQgY29uc3QgbmV4dDIgPSBuZXcgUGFnZShcbiAgJ25leHQnLFxuICBbXG4gICAgeyB4OiAyMjYsIHk6IDI5NiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjc1LCB5OiAyOTYsIHI6IDgsIGc6IDEyMSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMDYsIHk6IDI5OSwgcjogMjU0LCBnOiAyNTQsIGI6IDI1NSB9LFxuICAgIHsgeDogMzE0LCB5OiAzMDMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMSwgeTogMjk5LCByOiAyMDEsIGc6IDIyMywgYjogMjU1IH0sXG4gICAgeyB4OiAzMzEsIHk6IDI5OSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMTAsIHI6IDAsIGc6IDk0LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzNDYsIHk6IDMwNyB9LFxuICB7IHg6IDM0NiwgeTogMzA3IH1cbik7XG5cbi8vIG5vbi1zcGVjaWZpYyBjb25maXJtIHBhZ2Ugd2l0aCBubyBhbmQgeWVzIGJ0blxuZXhwb3J0IGNvbnN0IGNvbmZpcm1XaXRoWVMgPSBuZXcgUGFnZShcbiAgJ2NvbmZpcm1XaXRoWVMnLFxuICBbXG4gICAgLy8geCBvbiByaWdodCB0b3BcbiAgICB7IHg6IDUxMywgeTogNDYsIHI6IDE4MiwgZzogMTg2LCBiOiAxODggfSxcbiAgICB7IHg6IDUyMCwgeTogNTIsIHI6IDcwLCBnOiA2OSwgYjogNzAgfSxcbiAgICB7IHg6IDUyNywgeTogNDUsIHI6IDY3LCBnOiA2OCwgYjogNzAgfSxcbiAgICB7IHg6IDUzMSwgeTogNTQsIHI6IDE3NCwgZzogMTc1LCBiOiAxNzYgfSxcbiAgICB7IHg6IDUxMSwgeTogNTEsIHI6IDE3OCwgZzogMTgwLCBiOiAxODYgfSxcblxuICAgIC8vIG5vIGJ0blxuICAgIHsgeDogMjEyLCB5OiAzMDEsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAyNDksIHk6IDMwMCwgcjogMTI1LCBnOiAxNTIsIGI6IDE4OCB9LFxuICAgIHsgeDogMjc4LCB5OiAzMDcsIHI6IDQ5LCBnOiA4MSwgYjogMTIzIH0sXG5cbiAgICAvLyB5ZXMgYnRuXG4gICAgeyB4OiAzNjMsIHk6IDI5NCwgcjogOCwgZzogMTIyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4NCwgeTogMjk3LCByOiAyNDQsIGc6IDI0OCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MTksIHk6IDMwNywgcjogMCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDM5NSwgeTogMjk0LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuXG4gICAgLy8gZm9vdGVyIGJnXG4gICAgeyB4OiAxNDIsIHk6IDMwNCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTMwLCB5OiAyOTYsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiA1MjAsIHk6IDU2IH0sIC8vIHggYnRuXG4gIHsgeDogNTIwLCB5OiA1NiB9XG4pO1xuXG4vLyBuZWVkIHRvIHVwZGF0ZSBhcGsgdmVyXG5leHBvcnQgY29uc3QgZXJyb3JOZXdVcGRhdGVBdmFpbGFibGUgPSBuZXcgUGFnZShcbiAgJ2Vycm9yTmV3VXBkYXRlQXZhaWxhYmxlJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMDgsIHk6IDQ1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMzYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAyNjAsIHk6IDU4LCByOiAxMjUsIGc6IDEyOSwgYjogMTMzIH0sXG4gICAgeyB4OiAyNzIsIHk6IDU3LCByOiAxMjgsIGc6IDEzNiwgYjogMTQwIH0sXG4gICAgeyB4OiAzMTMsIHk6IDU2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMzUsIHk6IDU2LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzNjMsIHk6IDYwLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzODEsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzODgsIHk6IDYzLCByOiAxMjYsIGc6IDEzMSwgYjogMTM0IH0sXG4gICAgeyB4OiAzOTcsIHk6IDYzLCByOiA1NywgZzogNjQsIGI6IDcwIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU0LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA0MTksIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgLy8gbmV3IHVwZGF0ZSBpbiBjb250ZW50ICgxMDQpXG4gICAgeyB4OiAyMjcsIHk6IDEzOSwgcjogMTc2LCBnOiAxNzgsIGI6IDE4NCB9LFxuICAgIHsgeDogMjg5LCB5OiAxNDQsIHI6IDExNywgZzogMTIxLCBiOiAxMjEgfSxcbiAgICB7IHg6IDI2MCwgeTogMTQ0LCByOiAxMDgsIGc6IDExMCwgYjogMTA4IH0sXG4gICAgeyB4OiAzMDksIHk6IDE0NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzI2LCB5OiAxNDIsIHI6IDg3LCBnOiA5MSwgYjogOTAgfSxcbiAgICB7IHg6IDM0MywgeTogMTQzLCByOiA4MywgZzogODgsIGI6IDg4IH0sXG4gICAgeyB4OiAzNzYsIHk6IDE0NCwgcjogNjksIGc6IDcxLCBiOiA2OSB9LFxuICAgIHsgeDogMzk1LCB5OiAxNDQsIHI6IDY4LCBnOiA3MiwgYjogNzEgfSxcbiAgICB7IHg6IDQwOSwgeTogMTQ0LCByOiAxMjIsIGc6IDEyMywgYjogMTI1IH0sXG4gICAgeyB4OiA0MjEsIHk6IDE0NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDI4NSwgeTogMjk3LCByOiA4LCBnOiAxMTgsIGI6IDI1NSB9LFxuICAgIHsgeDogMzEyLCB5OiAyOTQsIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDI5OSwgcjogMTM1LCBnOiAxODgsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDcsIHI6IDAsIGc6IDEwMiwgYjogMjQ3IH0sXG5cbiAgICAvLyBwb3B1cCBiZyBhbmQgeFxuICAgIHsgeDogMTE3LCB5OiA0NiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTEyLCB5OiA0NiwgcjogMTg4LCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTI0LCB5OiA1NywgcjogMTg5LCBnOiAxODksIGI6IDE4OSB9LFxuICAgIHsgeDogMTU3LCB5OiAyMzIsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDIwOSwgeTogMjk2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0MjMsIHk6IDMwNCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDQzLCB5OiAyMjcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgXSxcbiAgLy8gVE9ETzogY2hlY2sgd2hldGhlciBuZWVkIHRvIHByZXNzIG9rXG4gIHsgeDogMzE0LCB5OiAyOTkgfSxcbiAgeyB4OiAzMTQsIHk6IDI5OSB9XG4pO1xuXG4vLyBmb3Igc29tZSBzaXR1YXRpb24sIHVuZXhwZWN0ZWRFcnJvciBoYXBwZW5zXG4vLyB0aGlzIGFsc28gaW5jbHVkZXMgbmV0d29yayBlcnJvclxuZXhwb3J0IGNvbnN0IHVuZXhwZWN0ZWRFcnJvciA9IG5ldyBQYWdlKFxuICAndW5leHBlY3RlZEVycm9yJyxcbiAgW1xuICAgIHsgeDogMzIzLCB5OiAzOSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTE0LCB5OiA0NCwgcjogODAsIGc6IDgxLCBiOiA4MSB9LFxuICAgIHsgeDogNTI0LCB5OiA0OCwgcjogNjQsIGc6IDcwLCBiOiA3MSB9LFxuICAgIHsgeDogNTE4LCB5OiA1NCwgcjogNjUsIGc6IDcxLCBiOiA3MSB9LFxuICAgIHsgeDogMzE1LCB5OiAyNjksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMxNSwgeTogMjkzLCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzE2LCB5OiAyOTksIHI6IDI0MSwgZzogMjQ3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNywgeTogMzEwLCByOiAwLCBnOiA5MiwgYjogMjQ1IH0sXG4gICAgeyB4OiAzMTcsIHk6IDMxMywgcjogMCwgZzogODUsIGI6IDI0MCB9LFxuICAgIHsgeDogMzE3LCB5OiAzMjMsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiAzMTQsIHk6IDI5OSB9LFxuICB7IHg6IDMxNCwgeTogMjk5IH1cbik7XG5cbmV4cG9ydCBjb25zdCBhcHBJc05vdFJlc3BvbmRpbmcgPSBuZXcgUGFnZShcbiAgJ2FwcElzTm90UmVzcG9uZGluZycsXG4gIFtcbiAgICB7IHg6IDE2NCwgeTogMTU0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxODksIHk6IDE1NywgcjogMjAzLCBnOiAyMDMsIGI6IDIwMyB9LFxuICAgIHsgeDogMjIzLCB5OiAxNTgsIHI6IDE3MSwgZzogMTcxLCBiOiAxNzEgfSxcbiAgICB7IHg6IDI1NCwgeTogMTU4LCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG4gICAgeyB4OiAyNzMsIHk6IDE1NywgcjogOTYsIGc6IDk2LCBiOiA5NiB9LFxuICAgIHsgeDogMzAyLCB5OiAxNTcsIHI6IDU0LCBnOiA1NCwgYjogNTQgfSxcbiAgICB7IHg6IDE2OCwgeTogMTg1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyMDUsIHk6IDE5MCwgcjogMTE5LCBnOiAxMTksIGI6IDExOSB9LFxuICAgIHsgeDogMjE4LCB5OiAxODQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDIzMCwgeTogMTg2LCByOiA4NSwgZzogODUsIGI6IDg1IH0sXG4gICAgeyB4OiAxNzAsIHk6IDIxMSwgcjogMTI3LCBnOiAyMDIsIGI6IDE5NSB9LFxuICAgIHsgeDogMjEwLCB5OiAyMTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE5OSwgeTogMjEzLCByOiAxMTEsIGc6IDExMSwgYjogMTExIH0sXG4gICAgeyB4OiA0NjYsIHk6IDE2NiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDY5LCB5OiAyMTgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAyMjAsIHk6IDE4NiB9LCAvLyBjbG9zZSBhcHBcbiAgeyB4OiAyMjAsIHk6IDE4NiB9XG4pO1xuXG4vLyB3aXRoIG1vcmUgZ2FtZXMgYnV0dG9uXG5leHBvcnQgY29uc3QgcXVpdEFwcCA9IG5ldyBQYWdlKFxuICAncXVpdEFwcCcsXG4gIFtcbiAgICB7IHg6IDI3OSwgeTogNTQsIHI6IDE3MCwgZzogMTczLCBiOiAxNzggfSxcbiAgICB7IHg6IDMyNCwgeTogNjAsIHI6IDIwLCBnOiAyNywgYjogMjggfSxcbiAgICB7IHg6IDUxNCwgeTogNTAsIHI6IDE4MSwgZzogMTgyLCBiOiAxODIgfSxcbiAgICB7IHg6IDQ2NiwgeTogMjk1LCByOiA4LCBnOiAxMjEsIGI6IDI1NSB9LFxuICAgIHsgeDogNDE0LCB5OiAyOTgsIHI6IDk0LCBnOiAxNTcsIGI6IDIzMyB9LFxuICAgIHsgeDogNDk2LCB5OiAzMTIsIHI6IDAsIGc6IDkwLCBiOiAyNDcgfSxcbiAgICB7IHg6IDUyMywgeTogMzA5LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAxMTEsIHk6IDI5NywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzA3LCB5OiA2MCwgcjogMTMzLCBnOiAxMzcsIGI6IDE0MSB9LFxuICAgIHsgeDogMzE1LCB5OiA2MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzI0LCB5OiA2MSwgcjogNTIsIGc6IDU2LCBiOiA2MSB9LFxuICBdLFxuICB7IHg6IDMwMCwgeTogMzAzIH0sIC8vIG5vdCB0byBxdWl0XG4gIHsgeDogMzAwLCB5OiAzMDMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHF1aXRBcHAxID0gbmV3IFBhZ2UoXG4gICdxdWl0QXBwMScsXG4gIFtcbiAgICB7IHg6IDI2MiwgeTogNTYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMwMCwgeTogNTQsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDMyMywgeTogNTUsIHI6IDI0LCBnOiAzMCwgYjogMzIgfSxcbiAgICB7IHg6IDUxMSwgeTogNTAsIHI6IDE3OCwgZzogMTgwLCBiOiAxODYgfSxcbiAgICB7IHg6IDUyMiwgeTogNTQsIHI6IDE0MSwgZzogMTM5LCBiOiAxNDEgfSxcbiAgICB7IHg6IDUyMiwgeTogNTQsIHI6IDE0MSwgZzogMTM5LCBiOiAxNDEgfSxcbiAgICB7IHg6IDE2NywgeTogMjk5LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAyNDMsIHk6IDI5NSwgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDMxOCwgeTogMjk4LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzODIsIHk6IDI5NywgcjogODMsIGc6IDE1OCwgYjogMjU1IH0sXG4gICAgeyB4OiA1MDMsIHk6IDMwMSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDMzLCB5OiAzMTAsIHI6IDAsIGc6IDk0LCBiOiAyNDcgfSxcbiAgICB7IHg6IDQwNCwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI1NSB9LFxuICAgIHsgeDogMjEzLCB5OiAzMDcsIHI6IDQ5LCBnOiA4MSwgYjogMTIzIH0sXG4gIF0sXG4gIHsgeDogMjEzLCB5OiAzMDcgfSwgLy8gbm90IHRvIHF1aXRcbiAgeyB4OiAyMTMsIHk6IDMwNyB9XG4pO1xuIiwiZXhwb3J0IGVudW0gVEFTSyB7XG4gIHJlc3RhcnRBcHBQZXJEYXkgPSAncmVzdGFydEFwcFBlckRheScsXG4gIHNldHRpbmdEZWZhdWx0ID0gJ3NldHRpbmdEZWZhdWx0JyxcbiAgc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3MgPSAnc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3MnLFxuICBwbGF5TGVhZ3VlR2FtZSA9ICdwbGF5TGVhZ3VlR2FtZScsXG4gIHBsYXlCYXR0bGVHYW1lID0gJ3BsYXlCYXR0bGVHYW1lJyxcbiAgYWRSZXdhcmQgPSAnYWRSZXdhcmQnLFxuICB3ZWVrbHlNaXNzaW9uID0gJ3dlZWtseU1pc3Npb24nLFxuICByZWNpZXZlSW5ib3ggPSAncmVjaWV2ZUluYm94JyxcbiAgc3RheUluTG9naW4gPSAnc3RheUluTG9naW4nLFxuICB1cGxvYWRDYWNoZSA9ICd1cGxvYWRDYWNoZScsXG4gIHNlbmRBbGl2ZUV2ZW50ID0gJ3NlbmRBbGl2ZUV2ZW50JyxcbiAgc2VuZFdhaXRFdmVudCA9ICdzZW5kV2FpdEV2ZW50Jyxcbn1cblxuZXhwb3J0ICogYXMgd2Vla2x5TWlzc2lvbiBmcm9tICcuL3dlZWtseU1pc3Npb24nO1xuIiwiaW1wb3J0IHsgVXRpbHMsIFBhZ2UgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgeyBzdGF0ZSwgcmVyb3V0ZXIgfSBmcm9tICcuLi9tb2R1bGVzJztcblxuaW1wb3J0IHsgVEFTSyB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBpc1NhbWVDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRhc2soKSB7XG4gIHJlcm91dGVyLmFkZFRhc2soe1xuICAgIG5hbWU6IFRBU0sud2Vla2x5TWlzc2lvbixcbiAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgbWluUm91bmRJbnRlcnZhbDogQ09OU1RBTlRTLmRheUluTXMsXG4gICAgbWF4VGFza0R1cmluZzogMzAgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICBmb3JjZVN0b3A6IHRydWUsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkUm91dGVzKCkge1xuICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgcGF0aDogYC8ke2FjaGlldmVtZW50TWlzc2lvbi5uYW1lfWAsXG4gICAgbWF0Y2g6IGFjaGlldmVtZW50TWlzc2lvbixcbiAgICBhY3Rpb246IChjb250ZXh0LCBpbWFnZSkgPT4ge1xuICAgICAgc3RhdGUuY2hlY2tVcGxvYWRTZXNzaW9uKCk7XG4gICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sud2Vla2x5TWlzc2lvbikge1xuICAgICAgICByZXJvdXRlci5nb0JhY2soYWNoaWV2ZW1lbnRNaXNzaW9uKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gY29sbGVjdCBkYWlseSBvbmUgaWYgYXZhaWxhYmxlXG4gICAgICBjb25zdCB4ID0gNjEzO1xuICAgICAgY29uc3QgY2FuQ29sbGVjdENvbG9yID0geyByOiA4LCBnOiAxMjUsIGI6IDI1NSB9O1xuICAgICAgZm9yIChsZXQgeSA9IDEyODsgeSA8IDI2MDsgeSArPSA0NCkge1xuICAgICAgICBjb25zdCBjYW5Db2xsZWN0ID0gaXNTYW1lQ29sb3IoaW1hZ2UsIHsgeCwgeSwgLi4uY2FuQ29sbGVjdENvbG9yIH0pO1xuICAgICAgICBpZiAoY2FuQ29sbGVjdCkge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4LCB5IH0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdjb2xsZWN0Jyk7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXJvdXRlci5nb05leHQoYWNoaWV2ZW1lbnRNaXNzaW9uKTtcbiAgICB9LFxuICB9KTtcbiAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgIHBhdGg6IGAvJHt3ZWVrbHlNaXNzaW9uQm94Lm5hbWV9YCxcbiAgICBtYXRjaDogd2Vla2x5TWlzc2lvbkJveCxcbiAgICBhY3Rpb246IChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLndlZWtseU1pc3Npb24pIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKHdlZWtseU1pc3Npb25Cb3gpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNhbkNvbGxlY3RDb2xvciA9IHsgcjogMTg5LCBnOiAxOTQsIGI6IDE5NyB9O1xuICAgICAgY29uc3QgW3gsIHldID0gWzI3LCAxMTVdO1xuICAgICAgY29uc3QgW3csIGhdID0gWzE5OCwgNzVdO1xuICAgICAgLy8gY2xpY2sgb3BlbkJveCBvbmx5IHdoZW4gYWxsIG1pc3Npb24gaXMgY29tcGxldGVcbiAgICAgIC8vIGJjIGl0IGlzIGFibGVkIG9uY2UgYSB3ZWVrXG4gICAgICBmb3IgKHZhciBkeCA9IDA7IGR4IDwgMyAqIHc7IGR4ICs9IHcpIHtcbiAgICAgICAgZm9yICh2YXIgZHkgPSAwOyBkeSA8IDMgKiBoOyBkeSArPSBoKSB7XG4gICAgICAgICAgY29uc3QgY2FuQ29sbGVjdCA9IGlzU2FtZUNvbG9yKGltYWdlLCB7IHg6IHggKyBkeCwgeTogeSArIGR5LCAuLi5jYW5Db2xsZWN0Q29sb3IgfSk7XG4gICAgICAgICAgaWYgKCFjYW5Db2xsZWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnd2FpdCBhbGwgd2Vla2x5IG1pc3Npb24gY29tcGxldGUnKTtcbiAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdjbGljayBvcGVuJyk7XG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKHdlZWtseU1pc3Npb25Cb3hCdG5zLm9wZW5Cb3gpO1xuICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcblxuICAgICAgLy8gVE9ETzogbGV0IHVzZXIgc2VsZWN0IHRoZSBpdGVtIHRoZXkgd2FudCBpbiB0aGUgZnV0dXJlXG4gICAgICAvLyBzZWxlY3QgdGhlIGxlZnQgYm90dG9tIG9uZVxuICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCByaWdodCBib3R0b20gaXRlbScpO1xuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IHggKyAyICogdywgeTogeSArIDIgKiBoIH0pO1xuICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcblxuICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmUgcmlnaHQgYm90dG9tIGl0ZW0nKTtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAod2Vla2x5TWlzc2lvbkJveEJ0bnMucmVjZWl2ZVJld2FyZCk7XG5cbiAgICAgIC8vIGVudGVyIHJlY2VpdmUgY29uZmlybSBwYWdlXG4gICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgIH0sXG4gIH0pO1xuXG4gIFt3ZWVrbHlNaXNzaW9uQm94Q29uZmlybSwgd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkXS5mb3JFYWNoKHAgPT4ge1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBwLFxuICAgICAgYWN0aW9uOiAnZ29OZXh0JyxcbiAgICB9KTtcbiAgfSk7XG59XG5cbmNvbnN0IGFjaGlldmVtZW50TWlzc2lvbiA9IG5ldyBQYWdlKFxuICAnYWNoaWV2ZW1lbnRNaXNzaW9uJyxcbiAgW1xuICAgIC8vIHRvZGF5IG1pc3Npb24gYmdcbiAgICB7IHg6IDIzNSwgeTogNTUsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDIzMSwgeTogNzEsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDU4OCwgeTogNzIsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcblxuICAgIC8vIGxlZnQgc2VjdGlvbiB3b3JsZCByZWNvcmQgYmcgbGVmdCBib3R0b21cbiAgICB7IHg6IDE2LCB5OiAyOTMsIHI6IDI1LCBnOiA0MCwgYjogNzQgfSxcblxuICAgIC8vIHBsYXllciBoZWFkXG4gICAgeyB4OiA3NSwgeTogODgsIHI6IDY2LCBnOiA1OSwgYjogOTAgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDMxLCB5OiAzMTYsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1ODAsIHk6IDI3OCB9LCAvLyBjb21wbGV0ZSB3ZWVrbHkgbWlzc2lvbiBib3hcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmNvbnN0IHdlZWtseU1pc3Npb25Cb3ggPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3gnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodCBwYXJ0IChwLCBzdGFyIC4uLilcbiAgICB7IHg6IDI5OSwgeTogMTMsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxOCwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzEzLCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzOTIsIHk6IDksIHI6IDIzMiwgZzogMjI5LCBiOiAyMzIgfSxcbiAgICB7IHg6IDM4NSwgeTogMiwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogNDk2LCB5OiAxMywgcjogMjM4LCBnOiAxNjYsIGI6IDE2IH0sXG4gICAgeyB4OiA0ODMsIHk6IDQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTYgfSxcbiAgICB7IHg6IDU5NywgeTogMTAsIHI6IDIxMywgZzogMjI2LCBiOiAyMzggfSxcbiAgICB7IHg6IDYyOCwgeTogMTQsIHI6IDIxNCwgZzogMjExLCBiOiAyMTQgfSxcblxuICAgIC8vIGJnIG9mIHRhYmxlXG4gICAgeyB4OiAxNCwgeTogODIsIHI6IDMzLCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDE2LCB5OiAyODgsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcbiAgICB7IHg6IDYxNSwgeTogMTAwLCByOiAzMywgZzogMzYsIGI6IDQxIH0sXG4gICAgeyB4OiA2MTMsIHk6IDI4MywgcjogMzMsIGc6IDQ0LCBiOiA1OCB9LFxuXG4gICAgLy8gZGVzY3JpcHRpb24gZm9vdGVyXG4gICAgeyB4OiA4MCwgeTogMzA3LCByOiAyMDIsIGc6IDIwMSwgYjogMTk2IH0sXG4gICAgeyB4OiA4OSwgeTogMzE1LCByOiA0OSwgZzogNjEsIGI6IDM0IH0sXG4gICAgeyB4OiAxMDMsIHk6IDMxOSwgcjogNzMsIGc6IDgzLCBiOiA2NiB9LFxuICAgIHsgeDogMTcyLCB5OiAzMzUsIHI6IDc4LCBnOiA4NCwgYjogNzIgfSxcbiAgICB7IHg6IDI1MCwgeTogMzM4LCByOiAxMDEsIGc6IDEwNiwgYjogOTMgfSxcbiAgICB7IHg6IDI3MywgeTogMzA3LCByOiAxNTksIGc6IDE1OSwgYjogMTQ5IH0sXG4gICAgeyB4OiAyODQsIHk6IDMwOSwgcjogNTYsIGc6IDYxLCBiOiA0MCB9LFxuXG4gICAgLy8gYmFjayBidG5cbiAgICB7IHg6IDI0LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQyLCB5OiAzMTcsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxLCB5OiAzMzEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sIC8vIGJhY2sgYnRuXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5jb25zdCB3ZWVrbHlNaXNzaW9uQm94QnRucyA9IHtcbiAgb3BlbkJveDogeyB4OiA0MTgsIHk6IDMyNSB9LFxuICByZWNlaXZlUmV3YXJkOiB7IHg6IDU2MSwgeTogMzI2IH0sXG59O1xuXG5jb25zdCB3ZWVrbHlNaXNzaW9uQm94Q29uZmlybSA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveENvbmZpcm0nLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMSwgeTogNDIsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNywgeTogMzA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTUsIHk6IDMwMCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE5LCB5OiAxNzcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNDAsIHk6IDU4LCByOiAxNTUsIGc6IDE2MCwgYjogMTYzIH0sXG4gICAgeyB4OiAyNjcsIHk6IDU4LCByOiAxNDEsIGc6IDE0NywgYjogMTQ5IH0sXG4gICAgeyB4OiAzMjUsIHk6IDU5LCByOiAxNjEsIGc6IDE2NywgYjogMTcwIH0sXG4gICAgeyB4OiAzODMsIHk6IDU5LCByOiAxNzEsIGc6IDE3OSwgYjogMTc5IH0sXG4gICAgeyB4OiA0MDcsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTUsIHk6IDQ5LCByOiAxODcsIGc6IDE4NSwgYjogMTg4IH0sXG4gICAgeyB4OiA1MTksIHk6IDU1LCByOiA5MSwgZzogOTEsIGI6IDkyIH0sXG5cbiAgICAvLyBubyAmIHllcyBidG5cbiAgICB7IHg6IDIxMCwgeTogMjkzLCByOiA0MSwgZzogODEsIGI6IDEyMyB9LFxuICAgIHsgeDogMjM4LCB5OiAyOTYsIHI6IDQ1LCBnOiA4MSwgYjogMTI4IH0sXG4gICAgeyB4OiAyODQsIHk6IDI5NCwgcjogNDEsIGc6IDc4LCBiOiAxMjMgfSxcblxuICAgIHsgeDogMzk3LCB5OiAyOTksIHI6IDQwLCBnOiAxMzQsIGI6IDI1MyB9LFxuICAgIHsgeDogNDMzLCB5OiAzMDcsIHI6IDgsIGc6IDk4LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzODcsIHk6IDMwMCB9LCAvLyB5ZXMgYnRuXG4gIHsgeDogMzg3LCB5OiAzMDAgfVxuKTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94UmVjZWl2ZWQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMywgeTogNTMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNywgeTogMzA3LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0OTYsIHk6IDI5OSwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDIxNywgeTogNTUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI1OSwgeTogNTUsIHI6IDE3NywgZzogMTgxLCBiOiAxODUgfSxcbiAgICB7IHg6IDI5OCwgeTogNTksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDM0MSwgeTogNjAsIHI6IDEyMCwgZzogMTI0LCBiOiAxMjggfSxcbiAgICB7IHg6IDM4NiwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDQwNywgeTogNTgsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxMiwgeTogNDcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODIgfSxcbiAgICB7IHg6IDUxOSwgeTogNTMsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcblxuICAgIC8vIG9rIGJ0blxuICAgIHsgeDogMjg4LCB5OiAyOTcsIHI6IDgsIGc6IDEyMiwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDMwMCwgcjogMTM2LCBnOiAxOTAsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDEsIHI6IDgsIGc6IDExNCwgYjogMjQ4IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSwgLy8gb2sgYnRuXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcbiIsImltcG9ydCB7IFV0aWxzLCBQYWdlIH0gZnJvbSAnUmVyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gU2F2ZVBhZ2VSZWZlcmVuY2UoaW1nOiBJbWFnZSwgcGFnZTogUGFnZSkge1xuICBjb25zdCB7IG5hbWUsIHBvaW50cyB9ID0gcGFnZTtcbiAgY29uc3QgcmFkaXVzID0gMztcbiAgY29uc3QgcmdiYTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMjU1LCAyMCwgMTQ3LCAwXTtcbiAgZm9yIChjb25zdCB7IHgsIHkgfSBvZiBwb2ludHMpIHtcbiAgICBkcmF3Q2lyY2xlKGltZywgeCwgeSwgcmFkaXVzLCAuLi5yZ2JhKTtcbiAgfVxuICBzYXZlSW1hZ2UoaW1nLCBgL3NkY2FyZC9QaWN0dXJlcy9TY3JlZW5zaG90cy9yb2JvdG1vbi9tbGIvJHtuYW1lfS5wbmdgKTtcbiAgY29uc29sZS5sb2coYFtTYXZlUGFnZVJlZmVyZW5jZV06ICR7bmFtZX1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgY29tbWFuZCBvZiBjb21tYW5kcykge1xuICAgIGNvbnN0IHJlcyA9IGV4ZWN1dGUoY29tbWFuZCk7XG4gICAgaWYgKGVuZHNXaXRoKHJlcywgJ2V4aXQgc3RhdHVzIDEnKSkge1xuICAgICAgY29uc29sZS5sb2coYFtFcnJvcl06ICR7Y29tbWFuZH0gOlxcbiAke3Jlc31cXG5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5sb2coYFtPa106ICR7Y29tbWFuZH0gOlxcbiAke3Jlc31cXG5gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBbT2tdOiAke2NvbW1hbmR9YCk7XG4gICAgfVxuICAgIHJlc3VsdHMucHVzaChyZXMpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kc1dpdGgoc3RyOiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUZpbmQ8VD4oYXJyOiBUW10sIGNvbmRpdGlvbjogKGVsOiBUKSA9PiBib29sZWFuKTogVCB8IHVuZGVmaW5lZCB7XG4gIGZvciAoY29uc3QgZWwgb2YgYXJyKSB7XG4gICAgaWYgKGNvbmRpdGlvbihlbCkpIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2FtZUNvbG9yKGltYWdlOiBJbWFnZSB8IFJHQiwgdGFyZ2V0OiBYWVJHQiB8IFJHQiwgdGhyZXM6IG51bWJlciA9IDAuOCk6IGJvb2xlYW4ge1xuICBsZXQgaW1hZ2VSR0I6IFJHQiB8IHVuZGVmaW5lZDtcbiAgaWYgKCdyJyBpbiBpbWFnZSkge1xuICAgIC8vIGltYWdlIGlzIFJHQlxuICAgIGltYWdlUkdCID0gaW1hZ2U7XG4gIH0gZWxzZSBpZiAoJ3gnIGluIHRhcmdldCkge1xuICAgIC8vIGltYWdlIGlzIEltYWdlLCB0YXJnZXQgaXMgWFlSR0JcbiAgICBpbWFnZVJHQiA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHRhcmdldC54LCB0YXJnZXQueSk7XG4gIH1cblxuICBpZiAoaW1hZ2VSR0IgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGFyZ2V0IGlzIG5vdCBYWVJHQicpO1xuICB9XG5cbiAgY29uc3Qgc2NvcmUgPSBVdGlscy5pZGVudGl0eUNvbG9yKGltYWdlUkdCLCB0YXJnZXQpO1xuICByZXR1cm4gc2NvcmUgPiB0aHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbG9yQ291bnRJblJhbmdlKGltYWdlOiBJbWFnZSwgbGVmdFRvcDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCByaWdodEJvdHRvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KTogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9IHtcbiAgY29uc3QgY250OiB7IFtjb2xvcjogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgY29uc3QgeyB4OiB4MSwgeTogeTEgfSA9IGxlZnRUb3A7XG4gIGNvbnN0IHsgeDogeDIsIHk6IHkyIH0gPSByaWdodEJvdHRvbTtcbiAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xuICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBnZXRJbWFnZUNvbG9yKGltYWdlLCB4LCB5KTtcbiAgICAgIGNvbnN0IGNvbG9yID0gYCR7cn0tJHtnfS0ke2J9YDtcbiAgICAgIGlmIChjbnRbY29sb3JdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY250W2NvbG9yXSA9IDA7XG4gICAgICB9XG4gICAgICBjbnRbY29sb3JdKys7XG4gICAgfVxuICB9XG4gIHJldHVybiBjbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVDb2xvckNvdW50KGNudDE6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSwgY250MjogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9KTogYm9vbGVhbiB7XG4gIGNvbnN0IGtleXMxID0gT2JqZWN0LmtleXMoY250MSk7XG4gIGNvbnN0IGtleXMyID0gT2JqZWN0LmtleXMoY250Mik7XG4gIGlmIChrZXlzMS5sZW5ndGggIT09IGtleXMyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzMSkge1xuICAgIGlmIChjbnQxW2tleV0gIT09IGNudDJba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTEI5SSB9IGZyb20gJy4vc3JjJztcblxubGV0IG1sYjlpOiBNTEI5SSB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydChqc29uQ29uZmlnOiBhbnkpIHtcbiAgbWxiOWkgPSBuZXcgTUxCOUkoanNvbkNvbmZpZyk7XG4gIG1sYjlpLnN0YXJ0KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RvcCgpIHtcbiAgaWYgKG1sYjlpID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbWxiOWkuc3RvcCgpO1xuICBtbGI5aSA9IHVuZGVmaW5lZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHt9XG59XG4od2luZG93IGFzIGFueSkuc3RhcnQgPSBzdGFydDtcbih3aW5kb3cgYXMgYW55KS5zdG9wID0gc3RvcDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
function start(jsonConfig){window.start(jsonConfig);}
function stop(){window.stop();}

