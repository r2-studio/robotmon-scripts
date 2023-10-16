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
var VERSION_CODE = 15.38;
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
        tasks_1.setting.addTask();
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
        modules_1.Config.config.isRunWeeklyMission && tasks_1.weeklyMission.addTask();
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
        tasks_1.setting.addRoutes();
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
            PAGE.dailyPromotion,
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
    isRunPlayBattleGame: true,
    isRunAdReward: false,
    isRunWeeklyMission: false,
};
function set(jsonConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
    exports.config.isRunWeeklyMission = exports.config.hasCoolFeature && ((_l = c.isRunWeeklyMission) !== null && _l !== void 0 ? _l : exports.config.isRunWeeklyMission);
    exports.config.isRunAdReward = exports.config.hasCoolFeature && ((_m = c.isRunAdReward) !== null && _m !== void 0 ? _m : exports.config.isRunAdReward);
    exports.config.isRunPlayBattleGame = exports.config.hasCoolFeature && ((_o = c.isRunPlayBattleGame) !== null && _o !== void 0 ? _o : exports.config.isRunPlayBattleGame);
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
exports.leagueOnPlayAutoOffGroup = exports.leagueOnPlayAutoOff1 = exports.leagueOnPlayAutoOff = exports.leagueContinuePlaying = exports.selectPlayRole = exports.selectPlayRoleBtns = exports.leagueModeGameInfo = exports.leagueModePanel = exports.rechargeBallLeagueMode = exports.rechargeBallRankMode = exports.autoGameConfirmEnd = exports.autoGameConfirm = exports.rankedBattleGameInfo = exports.rankedBattleResult = exports.rankedBattleWeeklyRankking = exports.rankedBattleWaitToRefresh = exports.rankedBattlePanelBtns = exports.rankedBattlePanel = exports.battleModePanelBtns = exports.battleModePanel = exports.selectYearBtns = exports.selectYear = exports.selectLeagueGameAmountBtns = exports.selectLeagueGameAmount = exports.selectSeasonMode = exports.leagueResetDialogBtns = exports.leagueResetDialog = exports.leagueResetDialogYN = exports.selectNormalMasterLeagueModeProceed = exports.selectNormalMasterLeagueModeBtns = exports.selectNormalMasterLeagueMode = exports.endSeasonProceedSelected = exports.endSeasonProceed = exports.endSeason = exports.newSeason = exports.mainBtns = exports.main = exports.progressBarRunning = exports.downloadData = exports.googleLogIn90 = exports.fbLogIn90 = exports.logInHive90 = exports.logInHive = exports.loginSelectWay = exports.landing = exports.landingLoading = exports.TOS90v2 = exports.TOS90 = exports.TOS = exports.logo = void 0;
exports.reviewApp = exports.event = exports.enterGamePromotion = exports.teamSupportPackagePromotion = exports.rechargePromotion = exports.promotion3 = exports.promotion2 = exports.promotion1 = exports.dailyPromotion = exports.powerSaving = exports.weeklyMissionBoxReceived = exports.weeklyMissionBoxConfirm = exports.weeklyMissionBoxBtns = exports.weeklyMissionBox = exports.achivementMission = exports.adGroup = exports.adRewardOnCD = exports.adRewardRedeem = exports.adReward = exports.playerCardColorToRank = exports.selectRewardPlayerBtns = exports.selectRewardPlayer = exports.mvp = exports.pitcherOfTheMonth = exports.leagueRewardAchievementGradeBonusPlayer = exports.leagueRewardAchievementGrade = exports.playerGrowthComplete = exports.gameLineUp = exports.postSeasonAwardBonus = exports.bonusGrantedByTeamRecord = exports.bestPositionAwardBonusGroup = exports.bestPositionAwardBonus2 = exports.bestPositionAwardBonus = exports.gameReward = exports.gameResultWorldChampion = exports.gameResultOther = exports.gameResultAquired = exports.gameResult = exports.leagueModeUnexpectedError = exports.leagueOnPlayPause = exports.onQuickPlayGroup = exports.onQuickPlayPause = exports.onQuickPlay1 = exports.onQuickPlay = exports.onPlayPowerSaveOn = exports.leagueOnPlayPowerSaveOffGroups = exports.leagueOnPlayPowerSaveOffMid1 = exports.leagueOnPlayPowerSaveOffMid = exports.leagueOnPlayPowerSaveOffStopped = exports.leagueOnPlayPowerSaveOff = void 0;
exports.quitApp1 = exports.quitApp = exports.appIsNotResponding = exports.unexpectedError = exports.errorNewUpdateAvailable = exports.confirmWithYS = exports.next2 = exports.next = exports.ok = void 0;
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
exports.dailyPromotion = new Rerouter_1.Page('dailyPromotion', [
    // black bg
    { x: 45, y: 148, r: 10, g: 2, b: 3 },
    { x: 600, y: 145, r: 10, g: 9, b: 10 },
    { x: 328, y: 336, r: 3, g: 3, b: 3 },
    // don't show this again today (unselcted)
    { x: 176, y: 279, r: 111, g: 122, b: 146 },
    { x: 205, y: 280, r: 2, g: 2, b: 2 },
    { x: 241, y: 280, r: 10, g: 6, b: 7 },
    { x: 272, y: 282, r: 9, g: 8, b: 8 },
    // x
    { x: 480, y: 275, r: 115, g: 115, b: 115 },
    { x: 484, y: 278, r: 129, g: 129, b: 129 },
    { x: 479, y: 280, r: 204, g: 204, b: 205 },
    { x: 486, y: 281, r: 148, g: 148, b: 148 },
], { x: 483, y: 280 }, // x
{ x: 483, y: 280 });
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setting = exports.weeklyMission = void 0;
__exportStar(__webpack_require__(/*! ./taskNames */ "./src/tasks/taskNames.ts"), exports);
exports.weeklyMission = __importStar(__webpack_require__(/*! ./weeklyMission */ "./src/tasks/weeklyMission.ts"));
exports.setting = __importStar(__webpack_require__(/*! ./setting */ "./src/tasks/setting.ts"));


/***/ }),

/***/ "./src/tasks/setting.ts":
/*!******************************!*\
  !*** ./src/tasks/setting.ts ***!
  \******************************/
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
var taskNames_1 = __webpack_require__(/*! ./taskNames */ "./src/tasks/taskNames.ts");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
function addTask() {
    console.log('addTask setting');
    // only run once
    modules_1.rerouter.addTask({
        name: taskNames_1.TASK.settingDefault,
        // maxTaskRunTimes: 1,
        minRoundInterval: Number.POSITIVE_INFINITY,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        forceStop: true,
    });
}
exports.addTask = addTask;
function addRoutes() {
    modules_1.rerouter.addRoute({
        path: "/".concat(settings.name),
        match: settings,
        action: function (context, image, matched, finishRound) {
            modules_1.state.checkUploadSession();
            var inactiveTabColor = { r: 58, g: 65, b: 74 };
            var tab = (0, utils_1.arrayFind)(Object.keys(settingsTabs), function (t) {
                var _a = settingsTabs[t], x = _a.x, y = _a.y;
                return !(0, utils_1.isSameColor)(image, __assign({ x: x, y: y }, inactiveTabColor));
            });
            switch (context.task.name) {
                case taskNames_1.TASK.settingDefault:
                    if (tab === 'graphicTab') {
                        modules_1.rerouter.screen.tap(settingsGraphTabBtns.powerSaveOn);
                        Rerouter_1.Utils.sleep(CONSTANTS.sleepShort);
                        finishRound(true);
                        modules_1.state.onRunning();
                    }
                    else {
                        // go to graphicTab
                        modules_1.rerouter.screen.tap(settingsTabs.graphicTab);
                    }
                    break;
                case taskNames_1.TASK.settingResetLeagueProgress:
                    if (!modules_1.state.leagueGame.needResetProgress) {
                        finishRound(true);
                        break;
                    }
                    // go to leagueResetDialog
                    modules_1.rerouter.screen.tap(settingsBtns.leagueReset);
                    modules_1.state.leagueGame.needResetProgress = false;
                    break;
                default:
                    modules_1.rerouter.goBack(settings);
                    break;
            }
        },
    });
    // FIXME: this should only run when needed
    modules_1.rerouter.addTask({
        name: taskNames_1.TASK.settingResetLeagueProgress,
        minRoundInterval: 1 * CONSTANTS.minuteInMs,
        maxTaskDuring: 10 * CONSTANTS.minuteInMs,
        beforeRoute: function (task) {
            if (!modules_1.state.leagueGame.needResetProgress) {
                return 'skipRouteLoop';
            }
        },
        forceStop: true,
    });
}
exports.addRoutes = addRoutes;
var settings = new Rerouter_1.Page('settings', [
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
var settingsTabs = {
    soundAndLanTab: { x: 22, y: 55 },
    graphicTab: { x: 111, y: 55 },
};
var settingsBtns = {
    leagueReset: { x: 562, y: 217 },
};
// FIXME: add lan change pages
var settingsSoundTab = new Rerouter_1.Page('settings/sound', [
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
var settingsSoundTabBtns = {
    lang: { x: 401, y: 190 },
    // add more if need more setting
};
var settingsSoundTabLanSelect = new Rerouter_1.Page('settings/sound/lanSelect', [
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
var settingsSoundTabLanSelectProceedBtns = {
    yes: { x: 407, y: 307 },
};
var settingsGraphTab = new Rerouter_1.Page('settings/graph', [
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
var settingsGraphTabBtns = {
    qualityNormal: { x: 212, y: 120 },
    maxFPS30: { x: 83, y: 175 },
    powerSaveOn: { x: 222, y: 222 },
    bigHeadModeOff: { x: 86, y: 283 },
    // add more if need more setting
};


/***/ }),

/***/ "./src/tasks/taskNames.ts":
/*!********************************!*\
  !*** ./src/tasks/taskNames.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TASK = void 0;
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
var taskNames_1 = __webpack_require__(/*! ./taskNames */ "./src/tasks/taskNames.ts");
var CONSTANTS = __importStar(__webpack_require__(/*! ../constants */ "./src/constants.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
function addTask() {
    modules_1.rerouter.addTask({
        name: taskNames_1.TASK.weeklyMission,
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
            if (context.task.name !== taskNames_1.TASK.weeklyMission) {
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
            if (context.task.name !== taskNames_1.TASK.weeklyMission) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9DQUFvQztBQUNuRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZixhQUFhLG1CQUFPLENBQUMsZ0VBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLG9FQUFnQjtBQUNyQyxhQUFhLG1CQUFPLENBQUMsZ0VBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLDhEQUFhO0FBQ2xDLGVBQWU7QUFDZjs7Ozs7Ozs7Ozs7QUN0QmE7QUFDYjtBQUNBO0FBQ0EsaURBQWlELE9BQU87QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFLE9BQU87QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQ25DLGVBQWUsbUJBQU8sQ0FBQyw0REFBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsNERBQVU7QUFDakMsY0FBYyxtQkFBTyxDQUFDLDBEQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxpQ0FBaUM7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQyx5REFBeUQsaUNBQWlDO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLHlEQUF5RCxtQ0FBbUM7QUFDNUY7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4REFBOEQ7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLDhIQUE4SDtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQywrQkFBK0I7SUFDL0IsMENBQTBDO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFRixrQkFBa0I7QUFDTCxXQUFHLEdBQUcsSUFBSSxlQUFJLENBQ3pCLEtBQUssRUFDTDtJQUNFLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsOEJBQThCO0FBQ2pCLGFBQUssR0FBRyxJQUFJLGVBQUksQ0FDM0IsT0FBTyxFQUNQO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixvQ0FBb0M7QUFDdkIsZUFBTyxHQUFHLElBQUksZUFBSSxDQUM3QixTQUFTLEVBQ1Q7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLG9DQUFvQztBQUN2QixzQkFBYyxHQUFHLElBQUksZUFBSSxDQUNwQyxnQkFBZ0IsRUFDaEI7SUFDRSxpQkFBaUI7SUFDakIsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxlQUFPLEdBQUcsSUFBSSxlQUFJLENBQzdCLFNBQVMsRUFDVDtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGtCQUFrQjtBQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsc0JBQWMsR0FBRyxJQUFJLGVBQUksQ0FDcEMsZ0JBQWdCLEVBQ2hCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2xDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBRXBDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxhQUFhO0FBQ2pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYTtDQUNqQyxDQUFDO0FBRVcsaUJBQVMsR0FBRyxJQUFJLGVBQUksQ0FDL0IsV0FBVyxFQUNYO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVE7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ2xDLENBQUM7QUFFRixrQkFBa0I7QUFDTCxtQkFBVyxHQUFHLElBQUksZUFBSSxDQUNqQyxhQUFhLEVBQ2I7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVE7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ2xDLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUFDLFdBQVcsRUFBRTtJQUM3QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxxQkFBYSxHQUFHLElBQUksZUFBSSxDQUFDLGVBQWUsRUFBRTtJQUNyRCxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxvQkFBWSxHQUFHLElBQUksZUFBSSxDQUNsQyxjQUFjLEVBQ2Q7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFDVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxZQUFJLEdBQUcsSUFBSSxlQUFJLENBQzFCLE1BQU0sRUFDTjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QywwQkFBMEI7SUFDMUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFekMsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxnQkFBUSxHQUFHO0lBQ3RCLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM5QixVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDOUIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUs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RyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGdDQUF3QixHQUFHLElBQUksZUFBSSxDQUM5QywwQkFBMEIsRUFDMUI7SUFDRSxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLG9DQUE0QixHQUFHLElBQUksZUFBSSxDQUNsRCw4QkFBOEIsRUFDOUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXhDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxzQkFBc0I7SUFDdEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsd0NBQWdDLEdBQUc7SUFDOUMsTUFBTSxFQUFFO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztLQUNQO0lBQ0QsTUFBTSxFQUFFO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztLQUNQO0NBQ0YsQ0FBQztBQUVXLDJDQUFtQyxHQUFHLElBQUksZUFBSSxDQUN6RCxxQ0FBcUMsRUFDckM7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLG1DQUFtQztBQUN0QiwyQkFBbUIsR0FBRyxJQUFJLGVBQUksQ0FDekMscUJBQXFCLEVBQ3JCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVB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QUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0IsQ0FBQztBQUVXLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxrQkFBa0IsRUFDbEI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyw4QkFBc0IsR0FBRyxJQUFJLGVBQUksQ0FDNUMsd0JBQXdCLEVBQ3hCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXRDLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUs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RUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyxzQkFBYyxHQUFHO0lBQzVCLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNCLENBQUM7QUFFRixnQkFBZ0I7QUFDSCx1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsZ0NBQWdDO0lBQ2hDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLGdEQUFnRDtJQUNoRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU87QUFDMUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLDJCQUFtQixHQUFHO0lBQ2pDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNoQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDaEMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QixDQUFDO0FBRVcseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLDBCQUEwQjtJQUMxQixtQ0FBbUM7SUFDbkMsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3Qyw0Q0FBNEM7SUFDNUMsMkNBQTJDO0lBRTNDLGFBQWE7SUFDYiw0Q0FBNEM7SUFDNUMsNkNBQTZDO0lBQzdDLDZDQUE2QztJQUU3QyxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsc0NBQXNDO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLDJCQUEyQjtJQUMzQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4Qyw2QkFBNkI7SUFDN0IsMkNBQTJDO0lBQzNDLDhDQUE4QztJQUU5Qyx3Q0FBd0M7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZO0FBQ2hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFVyw2QkFBcUIsR0FBRztJQUNuQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQzNCLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN6RCxDQUFDO0FBRUYseUNBQXlDO0FBQzVCLGlDQUF5QixHQUFHLElBQUksZUFBSSxDQUMvQywyQkFBMkIsRUFDM0I7SUFDRSxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSTtBQUN2QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsa0NBQTBCLEdBQUcsSUFBSSxlQUFJLENBQ2hELDRCQUE0QixFQUM1QjtJQUNFLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSztBQUN6QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxxQkFBcUI7SUFDckIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLO0FBQ3pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyw0QkFBb0IsR0FBRyxJQUFJLGVBQUksQ0FDMUMsc0JBQXNCLEVBQ3RCO0lBQ0Usd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFeEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLDJCQUEyQjtJQUMzQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFRiw0QkFBNEI7QUFDZix1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxhQUFhO0lBQ2IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsa0RBQWtEO0lBQ2xELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSx1QkFBdUI7QUFDM0MsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQywwQkFBMEI7Q0FDOUMsQ0FBQztBQUVGLDBCQUEwQjtBQUNiLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxhQUFhO0lBQ2IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsNkJBQTZCO0NBQzlCLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSx5QkFBeUI7QUFDN0MsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUI7Q0FDekMsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTO0FBQzVCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyw4QkFBc0IsR0FBRyxJQUFJLGVBQUksQ0FDNUMsd0JBQXdCLEVBQ3hCO0lBQ0UsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUztBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRUYsZ0JBQWdCO0FBQ0gsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7QUFDL0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLHlCQUF5QjtBQUNaLDBCQUFrQixHQUFHO0lBQ2hDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNuQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDckMsQ0FBQztBQUVXLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDO0FBQ0QsZ0RBQWdEO0FBQ2hELDBCQUFrQixDQUFDLE9BQU8sRUFDMUIsMEJBQWtCLENBQUMsT0FBTyxDQUMzQixDQUFDO0FBRUYsc0RBQXNEO0FBQ3RELHFDQUFxQztBQUN4Qiw2QkFBcUIsR0FBRyxJQUFJLGVBQUksQ0FDM0MsdUJBQXVCLEVBQ3ZCO0lBQ0UsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsZ0JBQWdCO0FBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCO0NBQ3BDLENBQUM7QUFFVywy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RyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMseUJBQXlCO0lBQ3pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxvQkFBb0I7QUFDcEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0I7Q0FDcEMsQ0FBQztBQUVGLGtEQUFrRDtBQUNyQyxtQ0FBMkIsR0FBRyxJQUFJLGVBQUksQ0FDakQsMEJBQTBCLEVBQzFCO0lBQ0Us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O0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2xDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRUYsdUJBQXVCO0FBQ1YsbUJBQVcsR0FBRyxJQUFJLGVBQUksQ0FDakMsYUFBYSxFQUNiO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFF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RSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLDhDQUE4QztBQUNsRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxvQkFBUyxDQUFD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LEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7Q0FDdEQsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUztDQUNwRCxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN2QyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHlCQUF5QixFQUN6QjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyw4QkFBc0IsR0FBRyxJQUFJLGVBQUksQ0FDNUMsd0JBQXdCLEVBQ3hCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2Qyw0QkFBNEI7SUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLCtCQUF1QixHQUFHLElBQUksZUFBSSxDQUM3Qyx3QkFBd0IsRUFDeEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsNEJBQTRCO0lBQzVCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV0QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsbUNBQTJCLEdBQUcsSUFBSSxvQkFBUyxDQUN0RCx3QkFBd0IsRUFDeEIsQ0FBQyw4QkFBc0IsRUFBRSwrQkFBdUIsQ0FBQyxFQUNqRCw4QkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUN2QyxDQUFDO0FBRUYsdUNBQXVDO0FBQzFCLGdDQUF3QixHQUFHLElBQUksZUFBSSxDQUM5QywwQkFBMEIsRUFDMUI7SUFDRSxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFckMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyw0QkFBb0IsR0FBRyxJQUFJLGVBQUksQ0FDMUMsc0JBQXNCLEVBQ3RCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLGlDQUFpQztJQUNqQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRVcsNEJBQW9CLEdBQUcsSUFBSSxlQUFJLENBQzFDLHNCQUFzQixFQUN0QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsb0NBQTRCLEdBQUcsSUFBSSxlQUFJLENBQ2xELDhCQUE4QixFQUM5QjtJQUNFLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUNGLElBQUk7QUFFUywrQ0FBdUMsR0FBRyxJQUFJLGVBQUksQ0FDN0QseUNBQXlDLEVBQ3pDO0lBQ0UsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLFdBQUcsR0FBRyxJQUFJLGVBQUksQ0FDekIsS0FBSyxFQUNMO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUVyQyxvQkFBb0I7SUFDcEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBQ0YsK0RBQStEO0FBQy9ELGlCQUFpQjtBQUNqQixvRUFBb0U7QUFDcEUsbUNBQW1DO0FBQ3RCLDhCQUFzQixHQUFHO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ25CLENBQUM7QUFDRiwyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCLGlDQUFpQztBQUNwQiw2QkFBcUIsR0FBNEI7SUFDNUQsVUFBVSxFQUFFLENBQUM7SUFDYixVQUFVLEVBQUUsQ0FBQztJQUNiLFVBQVUsRUFBRSxDQUFDO0lBQ2IsYUFBYSxFQUFFLENBQUM7SUFDaEIsWUFBWSxFQUFFLENBQUM7SUFDZixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsWUFBWSxFQUFFLENBQUM7SUFDZixZQUFZLEVBQUUsQ0FBQztJQUNmLFdBQVcsRUFBRSxDQUFDLEVBQUUsOEJBQThCO0NBQy9DLENBQUM7QUFFRixpQkFBaUI7QUFDSixnQkFBUSxHQUFHLElBQUksZUFBSSxDQUM5QixVQUFVLEVBQ1Y7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMseUJBQXlCO0lBQ3pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLFNBQVM7SUFDVCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxzQkFBYyxHQUFHLElBQUksZUFBSSxDQUNwQyxnQkFBZ0IsRUFDaEI7SUFDRSxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxvQkFBWSxHQUFHLElBQUksZUFBSSxD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QUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxrQkFBa0IsRUFDbEI7SUFDRSxtQ0FBbUM7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7QUFDOUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDRCQUFvQixHQUFHO0lBQ2xDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMzQixhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDbEMsQ0FBQztBQUVXLCtCQUF1QixHQUFHLElBQUksZUFBSSxDQUM3Qyx5QkFBeUIsRUFDekI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVU7QUFDOUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGdDQUF3QixHQUFHLElBQUksZUFBSSxDQUM5QywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQVM7QUFDN0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLGdCQUFnQjtBQUNILG1CQUFXLEdBQUcsSUFBSSxlQUFJLENBQ2pDLGFBQWEsRUFDYjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLDJDQUEyQztJQUMzQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUVwQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7Q0FDckMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUVwQywwQ0FBMEM7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFcEMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJO0FBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUNoQyxZQUFZLEVBQ1o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVB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RSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsaUJBQVMsR0FBRyxJQUFJLGVBQUksQ0FDL0IsV0FBVyxFQUNYO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYscUJBQXFCO0FBQ1IsVUFBRSxHQUFHLElBQUksZUFBSSxDQUN4QixJQUFJLEVBQ0o7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRix1QkFBdUI7QUFDVixZQUFJLEdBQUcsSUFBSSxlQUFJLENBQzFCLE1BQU0sRUFDTjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGFBQUssR0FBRyxJQUFJLGVBQUksQ0FDM0IsTUFBTSxFQUNOO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsZ0RBQWdEO0FBQ25DLHFCQUFhLEdBQUcsSUFBSSxlQUFJLENBQ25DLGVBQWUsRUFDZjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUTtBQUMzQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRUYseUJBQXlCO0FBQ1osK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHlCQUF5QixFQUN6QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6Qyw4QkFBOEI7SUFDOUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQztBQUNELHVDQUF1QztBQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsOENBQThDO0FBQzlDLG1DQUFtQztBQUN0Qix1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVk7QUFDaEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLHlCQUF5QjtBQUNaLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWM7QUFDbEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGdCQUFRLEdBQUcsSUFBSSxlQUFJLENBQzlCLFVBQVUsRUFDVjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFj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LEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUVyQyxhQUFhO0lBQ2IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFDRixJQUFNLG9CQUFvQixHQUFHO0lBQzNCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QixnQ0FBZ0M7Q0FDakMsQ0FBQztBQUNGLElBQU0seUJBQXlCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLDBCQUEwQixFQUMxQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUVwQyxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjO0FBQ2xDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYztDQUNsQyxDQUFDO0FBQ0YsSUFBTSxvQ0FBb0MsR0FBRztJQUMzQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEIsQ0FBQztBQUVGLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQy9CLGdCQUFnQixFQUNoQjtJQUNFLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFDRixJQUFNLG9CQUFvQixHQUFHO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDM0IsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQy9CLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFB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QUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7QUFDOUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLElBQU0sb0JBQW9CLEdBQUc7SUFDM0IsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNsQyxDQUFDO0FBRUYsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDdEMseUJBQXlCLEVBQ3pCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVO0FBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixJQUFNLHdCQUF3QixHQUFHLElBQUksZUFBSSxDQUN2QywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxH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ZXMiOlsid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL1Jlcm91dGVyL2Rpc3Qvc3JjL3Jlcm91dGVyLmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvc3RydWN0LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9jaGFyZW5jL2NoYXJlbmMuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9jcnlwdC9jcnlwdC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL21kNS9tZDUuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvY29uZmlnLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9ldmVudFNlbmRlci50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3Jlcm91dGVyLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9zZXNzaW9uLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9zdGF0ZS50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3BhZ2VzLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvdGFza3MvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy90YXNrcy9zZXR0aW5nLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvdGFza3MvdGFza05hbWVzLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvdGFza3Mvd2Vla2x5TWlzc2lvbi50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3Rlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVzdC8uL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZlcnNpb24gPSB2b2lkIDA7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3NjcmVlblwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3Jlcm91dGVyXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvc3RydWN0XCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvdXRpbHNcIiksIGV4cG9ydHMpO1xuZXhwb3J0cy52ZXJzaW9uID0gMTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVyb3V0ZXIgPSBleHBvcnRzLlJlcm91dGVyID0gdm9pZCAwO1xudmFyIHN0cnVjdF8xID0gcmVxdWlyZShcIi4vc3RydWN0XCIpO1xudmFyIHNjcmVlbl8xID0gcmVxdWlyZShcIi4vc2NyZWVuXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBSZXJvdXRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZXJvdXRlcigpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHN0cnVjdF8xLkRlZmF1bHRDb25maWdWYWx1ZTtcbiAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZyA9IHN0cnVjdF8xLkRlZmF1bHRSZXJvdXRlckNvbmZpZztcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0U2NyZWVuQ29uZmlnO1xuICAgICAgICB0aGlzLnNjcmVlbiA9IG5ldyBzY3JlZW5fMS5TY3JlZW4odGhpcy5zY3JlZW5Db25maWcpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yb3V0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy50YXNrcyA9IFtdO1xuICAgICAgICB0aGlzLnJvdXRlQ29udGV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMudW5rbm93blJvdXRlQWN0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVjYWxjdWxhdGUgc29tZSB2YWx1ZSBsaWtlIGRldmljZSB3aWR0aCBvciBoZWlnaHQgaW4gc2NyZWVuQ29uZmlnXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHNvcnQgcm91dGVzIGJ5IHByaW9yaXR5XG4gICAgICAgIHRoaXMucm91dGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGIucHJpb3JpdHkgLSBhLnByaW9yaXR5OyB9KTtcbiAgICAgICAgLy8gY2hlY2sgYW5kIGNhbGN1bGF0ZSBzY3JlZW4gY29uZmlnXG4gICAgICAgIHZhciBkZXZpY2VXSCA9IGdldFNjcmVlblNpemUoKTtcbiAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4KGRldmljZVdILndpZHRoLCBkZXZpY2VXSC5oZWlnaHQpO1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4oZGV2aWNlV0gud2lkdGgsIGRldmljZVdILmhlaWdodCk7XG4gICAgICAgIHZhciBkV2lkdGggPSB0aGlzLnNjcmVlbkNvbmZpZy5yb3RhdGlvbiA9PT0gJ2hvcml6b250YWwnID8gbWF4IDogbWluO1xuICAgICAgICB2YXIgZEhlaWdodCA9IHRoaXMuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID09PSAndmVydGljYWwnID8gbWF4IDogbWluO1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VXaWR0aCA9IHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZVdpZHRoIHx8IGRXaWR0aDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlSGVpZ2h0ID0gdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlSGVpZ2h0IHx8IGRIZWlnaHQ7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbldpZHRoID0gdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuV2lkdGggfHwgZFdpZHRoO1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5IZWlnaHQgPSB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5IZWlnaHQgfHwgZEhlaWdodDtcbiAgICAgICAgdGhpcy5sb2coXCJzY3JlZW5XaWR0aDogXCIuY29uY2F0KHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbldpZHRoLCBcIiwgc2NyZWVuSGVpZ2h0OiBcIikuY29uY2F0KHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbkhlaWdodCkpO1xuICAgICAgICAvLyBuZXcgc2NyZWVuIGlmIHNjcmVlbiBjb25maWcgY2hhbmdlZFxuICAgICAgICB0aGlzLnNjcmVlbiA9IG5ldyBzY3JlZW5fMS5TY3JlZW4odGhpcy5zY3JlZW5Db25maWcpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIFJvdXRlQ29uZmlnIHRvIFJlcm91dGVyIHJvdXRlcywgYWZ0ZXIgc3RhcnRpbmcgUmVyb3V0ZXIgd2lsbCBydW4gb3ZlciBhbGwgUm91dGVDb25maWdzIHRvIG1hdGNoIHNjcmVlbiBhbmQgZG8gYWN0aW9uXG4gICAgICogQHBhcmFtIGNvbmZpZyBpbmZvcm1hdGlvbiBhYm91dCBob3cgcm91dGUgbWF0Y2ggYW5kIHJvdXRlIGFjdGlvblxuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXMucHVzaCh0aGlzLndyYXBSb3V0ZUNvbmZpZ1dpdGhEZWZhdWx0KGNvbmZpZykpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGVsbCBSZXJvdXRlciB3aGF0IHRvIGRvIGlmIG5vdCBtYXRjaGluZyBhbnkgcm91dGVcbiAgICAgKiBAcGFyYW0gYWN0aW9uIGZ1bmN0aW9uIHRvIGRvIGlmIG5vdCBtYXRjaGluZ1xuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5hZGRVbmtub3duQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICB0aGlzLnVua25vd25Sb3V0ZUFjdGlvbiA9IGFjdGlvbjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBUYXNrQ29uZmlnIHRvIFJlcm91dGVyIHRhc2tzLCBhZnRlciBzdGFydGluZyBSZXJvdXRlciB3aWxsIHJ1biBvdmVyIGFsbCBUYXNrcyBieSB0YXNrIGNvbmRpdGlvblxuICAgICAqIEBwYXJhbSBjb25maWcgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRhc2sgd29ya3NcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuYWRkVGFzayA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdGhpcy50YXNrcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgICAgICAgY29uZmlnOiB0aGlzLndyYXBUYXNrQ29uZmlnV2l0aERlZmF1bHQoY29uZmlnKSxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgICAgICAgIGxhc3RSdW5UaW1lOiAwLFxuICAgICAgICAgICAgcnVuVGltZXM6IDAsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogc3RhcnQgUmVyb3V0ZXIgdG8gcnVuIG92ZXIgdGFza3MgYW5kIHJvdXRlc1xuICAgICAqIEBwYXJhbSBwYWNrYWdlTmFtZVxuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICB0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lID0gcGFja2FnZU5hbWU7XG4gICAgICAgIC8vIGNoZWNrIHRhc2tzXG4gICAgICAgIGlmICh0aGlzLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdGFydCBmYWlsZWQsIG5vIHRhc2tzIC4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdGFydGVkIC4uLlwiKTtcbiAgICAgICAgLy8gdGFzayBjb250cm9sbGVyXG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhcnRUYXNrTG9vcCgpO1xuICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0b3BwZWQgLi4uXCIpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogc3RvcCBSZXJvdXRlclxuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0b3AgY2FsbGVkLCB0cnlpbmcgdG8gc3RvcCB0YXNrIGxvb3BcIik7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5yb3V0ZUNvbnRleHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVDb250ZXh0LnNjcmlwdFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmNoZWNrSW5BcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYWNrYWdlTmFtZSA9IHV0aWxzXzEuVXRpbHMuZ2V0Q3VycmVudEFwcCgpWzBdO1xuICAgICAgICBpZiAocGFja2FnZU5hbWUgPT09IHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1dGlsc18xLlV0aWxzLmlzQXBwT25Ub3AodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuY2hlY2tBbmRTdGFydEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrSW5BcHAoKSkge1xuICAgICAgICAgICAgdGhpcy5sb2coXCJBcHBJc05vdFN0YXJ0ZWQsIHN0YXJ0QXBwIFwiLmNvbmNhdCh0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QXBwKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdGFydCBhcHAgZmFpbGVkLCBubyBwYWNrYWdlTmFtZSAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zdGFydEFwcCh0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKTtcbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0aGlzLnJlcm91dGVyQ29uZmlnLnN0YXJ0QXBwRGVsYXkpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0b3BBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wIGFwcCBmYWlsZWQsIG5vIHBhY2thZ2VOYW1lIC4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1dGlsc18xLlV0aWxzLnN0b3BBcHAodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSk7XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAoMTAwMCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUucmVzdGFydEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wQXBwKCk7XG4gICAgICAgIHRoaXMuc3RhcnRBcHAoKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nb05leHQgPSBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICBpZiAocGFnZS5uZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2NyZWVuLnRhcChwYWdlLm5leHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiXCIuY29uY2F0KHBhZ2UubmFtZSwgXCIgYWN0aW9uID09IGdvTmV4dCwgYnV0IG5vIG5leHQgeHlcIikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ29CYWNrID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgaWYgKHBhZ2UuYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAocGFnZS5iYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChwYWdlLm5hbWUsIFwiIGFjdGlvbiA9PSBnb0JhY2ssIGJ1dCBubyBiYWNrIHh5XCIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUGFnZU1hdGNoID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgaXNNYXRjaCA9IHRoaXMuaXNQYWdlTWF0Y2hJbWFnZShwYWdlLCBpbWFnZSk7XG4gICAgICAgIHJlbGVhc2VJbWFnZShpbWFnZSk7XG4gICAgICAgIHJldHVybiBpc01hdGNoO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUGFnZU1hdGNoSW1hZ2UgPSBmdW5jdGlvbiAocGFnZSwgaW1hZ2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLmdldFBhZ2VCeU5hbWUocGFnZSk7XG4gICAgICAgICAgICBpZiAocCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZyhcImlzUGFnZU1hdGNoSW1hZ2UgXCIuY29uY2F0KHBhZ2UsIFwiIG5vdCBleGlzdFwiKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFnZSA9IHA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZ2UgaW5zdGFuY2VvZiBzdHJ1Y3RfMS5QYWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc01hdGNoUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIHRoaXMuZGVidWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5pc01hdGNoR3JvdXBQYWdlSW1wbChpbWFnZSwgcGFnZSwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgICAgIHJldHVybiBwYWdlcy5sZW5ndGggPiAwO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0UGFnZXNNYXRjaCA9IGZ1bmN0aW9uIChncm91cFBhZ2UpIHtcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgbWF0Y2ggPSB0aGlzLmdldFBhZ2VzTWF0Y2hJbWFnZShncm91cFBhZ2UsIGltYWdlLCB0aGlzLmRlZmF1bHRDb25maWcuR3JvdXBQYWdlVGhyZXMpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0UGFnZXNNYXRjaEltYWdlID0gZnVuY3Rpb24gKGdyb3VwUGFnZSwgaW1hZ2UsIHBhcmVudFRocmVzLCBkZWJ1Zykge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICAgICAgdmFyIHRocmVzID0gKF9iID0gKF9hID0gZ3JvdXBQYWdlLnRocmVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwYXJlbnRUaHJlcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cFBhZ2UucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gZ3JvdXBQYWdlLnBhZ2VzW2ldO1xuICAgICAgICAgICAgdmFyIGlzUGFnZU1hdGNoID0gdGhpcy5pc01hdGNoUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRocmVzLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgICAgIGlmIChpc1BhZ2VNYXRjaCkge1xuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2gocGFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndhaXRTY3JlZW5Gb3JNYXRjaGluZ1BhZ2UgPSBmdW5jdGlvbiAocGFnZSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1hdGNoVGltZXMgPT09IHZvaWQgMCkgeyBtYXRjaFRpbWVzID0gMTsgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IHZvaWQgMCkgeyBpbnRlcnZhbCA9IDYwMDsgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy53YWl0Rm9yQWN0aW9uKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlzUGFnZU1hdGNoKHBhZ2UpOyB9LCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNSb3V0ZU1hdGNoID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIGlzTWF0Y2ggPSB0aGlzLmlzUm91dGVNYXRjaEltYWdlKHJvdXRlLCBpbWFnZSk7XG4gICAgICAgIHJlbGVhc2VJbWFnZShpbWFnZSk7XG4gICAgICAgIHJldHVybiBpc01hdGNoO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUm91dGVNYXRjaEltYWdlID0gZnVuY3Rpb24gKHJvdXRlLCBpbWFnZSkge1xuICAgICAgICB2YXIgcm91dGVDb25maWcgPSB0aGlzLmdldFJvdXRlQ29uZmlnKHJvdXRlKTtcbiAgICAgICAgaWYgKHJvdXRlQ29uZmlnID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJpc1JvdXRlTWF0Y2hJbWFnZSBcIi5jb25jYXQocm91dGUsIFwiIG5vdCBleGlzdFwiKSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZpbGxlZFJvdXRlQ29uZmlnID0gdGhpcy53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdChyb3V0ZUNvbmZpZyk7XG4gICAgICAgIHZhciByb3RhdGlvbiA9IHRoaXMuc2NyZWVuLmdldEltYWdlUm90YXRpb24oaW1hZ2UpO1xuICAgICAgICB2YXIgaXNNYXRjaGVkID0gdGhpcy5pc01hdGNoUm91dGVJbXBsKGltYWdlLCByb3RhdGlvbiwgZmlsbGVkUm91dGVDb25maWcsICd3YWl0U2NyZWVuRm9yTWF0Y2hpbmdSb3V0ZScpLmlzTWF0Y2hlZDtcbiAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndhaXRTY3JlZW5Gb3JNYXRjaGluZ1JvdXRlID0gZnVuY3Rpb24gKHJvdXRlLCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAobWF0Y2hUaW1lcyA9PT0gdm9pZCAwKSB7IG1hdGNoVGltZXMgPSAxOyB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PT0gdm9pZCAwKSB7IGludGVydmFsID0gNjAwOyB9XG4gICAgICAgIHJldHVybiB1dGlsc18xLlV0aWxzLndhaXRGb3JBY3Rpb24oZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuaXNSb3V0ZU1hdGNoKHJvdXRlKTsgfSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VCeU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2IgPSB0aGlzLnJvdXRlczsgX2kgPCBfYi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IF9iW19pXTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAoKF9hID0gcm91dGUubWF0Y2gpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZS5tYXRjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRSb3V0ZUNvbmZpZ0J5UGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnJvdXRlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChwYXRoID09PSByb3V0ZS5wYXRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldEN1cnJlbnRNYXRjaE5hbWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBtYXRjaGVkTmFtZXMgPSBbXTtcbiAgICAgICAgdGhpcy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IHJvdXRlLm1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCBpbnN0YW5jZW9mIHN0cnVjdF8xLlBhZ2UgJiYgX3RoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBtYXRjaCwgX3RoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIF90aGlzLmRlYnVnKSkgfHxcbiAgICAgICAgICAgICAgICAobWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5Hcm91cFBhZ2UgJiYgX3RoaXMuaXNNYXRjaEdyb3VwUGFnZUltcGwoaW1hZ2UsIG1hdGNoLCBfdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgX3RoaXMuZGVidWcpLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZE5hbWVzLnB1c2gobWF0Y2gubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxvZyhcImN1cnJlbnQgbWF0Y2g6IFwiLCBtYXRjaGVkTmFtZXMpO1xuICAgICAgICByZXR1cm4gbWF0Y2hlZE5hbWVzO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFJvdXRlQ29uZmlnID0gZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgdmFyIHJvdXRlO1xuICAgICAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByb3V0ZSA9IHRoaXMuZ2V0Um91dGVDb25maWdCeVBhdGgocik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByb3V0ZSA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndyYXBSb3V0ZUNvbmZpZ1dpdGhEZWZhdWx0ID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGNvbmZpZy5wYXRoLFxuICAgICAgICAgICAgYWN0aW9uOiBjb25maWcuYWN0aW9uLFxuICAgICAgICAgICAgbWF0Y2g6IChfYSA9IGNvbmZpZy5tYXRjaCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbnVsbCxcbiAgICAgICAgICAgIGN1c3RvbU1hdGNoOiAoX2IgPSBjb25maWcuY3VzdG9tTWF0Y2gpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGwsXG4gICAgICAgICAgICByb3RhdGlvbjogKF9jID0gY29uZmlnLnJvdGF0aW9uKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB0aGlzLnNjcmVlbkNvbmZpZy5yb3RhdGlvbixcbiAgICAgICAgICAgIHNob3VsZE1hdGNoVGltZXM6IChfZCA9IGNvbmZpZy5zaG91bGRNYXRjaFRpbWVzKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdTaG91bGRNYXRjaFRpbWVzLFxuICAgICAgICAgICAgc2hvdWxkTWF0Y2hEdXJpbmc6IChfZSA9IGNvbmZpZy5zaG91bGRNYXRjaER1cmluZykgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hEdXJpbmcsXG4gICAgICAgICAgICBiZWZvcmVBY3Rpb25EZWxheTogKF9mID0gY29uZmlnLmJlZm9yZUFjdGlvbkRlbGF5KSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdCZWZvcmVBY3Rpb25EZWxheSxcbiAgICAgICAgICAgIGFmdGVyQWN0aW9uRGVsYXk6IChfZyA9IGNvbmZpZy5hZnRlckFjdGlvbkRlbGF5KSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdBZnRlckFjdGlvbkRlbGF5LFxuICAgICAgICAgICAgcHJpb3JpdHk6IChfaCA9IGNvbmZpZy5wcmlvcml0eSkgIT09IG51bGwgJiYgX2ggIT09IHZvaWQgMCA/IF9oIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnUHJpb3JpdHksXG4gICAgICAgICAgICBkZWJ1ZzogKF9qID0gY29uZmlnLmRlYnVnKSAhPT0gbnVsbCAmJiBfaiAhPT0gdm9pZCAwID8gX2ogOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdEZWJ1ZyxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53cmFwVGFza0NvbmZpZ1dpdGhEZWZhdWx0ID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2c7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICAgIG1heFRhc2tSdW5UaW1lczogKF9hID0gY29uZmlnLm1heFRhc2tSdW5UaW1lcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdGhpcy5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdNYXhUYXNrUnVuVGltZXMsXG4gICAgICAgICAgICBtYXhUYXNrRHVyaW5nOiAoX2IgPSBjb25maWcubWF4VGFza0R1cmluZykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdGhpcy5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdNYXhUYXNrRHVyaW5nLFxuICAgICAgICAgICAgbWluUm91bmRJbnRlcnZhbDogKF9jID0gY29uZmlnLm1pblJvdW5kSW50ZXJ2YWwpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWluUm91bmRJbnRlcnZhbCxcbiAgICAgICAgICAgIGZvcmNlU3RvcDogKF9kID0gY29uZmlnLmZvcmNlU3RvcCkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogdGhpcy5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdBdXRvU3RvcCxcbiAgICAgICAgICAgIGZpbmRSb3V0ZURlbGF5OiAoX2UgPSBjb25maWcuZmluZFJvdXRlRGVsYXkpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnRmluZFJvdXRlRGVsYXksXG4gICAgICAgICAgICBiZWZvcmVSb3V0ZTogKF9mID0gY29uZmlnLmJlZm9yZVJvdXRlKSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiBudWxsLFxuICAgICAgICAgICAgYWZ0ZXJSb3V0ZTogKF9nID0gY29uZmlnLmFmdGVyUm91dGUpICE9PSBudWxsICYmIF9nICE9PSB2b2lkIDAgPyBfZyA6IG51bGwsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnRUYXNrTG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRhc2tJZHggPSAwO1xuICAgICAgICB3aGlsZSAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRoaXMudGFza3NbdGFza0lkeCAlIHRoaXMudGFza3MubGVuZ3RoXTtcbiAgICAgICAgICAgIHRhc2tJZHgrKztcbiAgICAgICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdmFyIGlzVGFza1J1bkZpcnN0VGltZSA9IHRhc2subGFzdFJ1blRpbWUgPT09IDA7XG4gICAgICAgICAgICBpZiAobm93IC0gdGFzay5sYXN0UnVuVGltZSA8PSB0YXNrLmNvbmZpZy5taW5Sb3VuZEludGVydmFsICYmICFpc1Rhc2tSdW5GaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIGR1cmluZzogXCIpLmNvbmNhdChub3cgLSB0YXNrLmxhc3RSdW5UaW1lLCBcIiA8PSBtaW5Sb3VuZEludGVydmFsLCBza2lwXCIpKTtcbiAgICAgICAgICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHRoaXMucmVyb3V0ZXJDb25maWcudGFza0RlbGF5KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhc2suc3RhcnRUaW1lID0gbm93O1xuICAgICAgICAgICAgdGFzay5ydW5UaW1lcyA9IDA7XG4gICAgICAgICAgICB2YXIgZXhpdFRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFzay5jb25maWcubWF4VGFza1J1blRpbWVzICYmIHRoaXMucnVubmluZyAmJiAhZXhpdFRhc2s7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcykpO1xuICAgICAgICAgICAgICAgIHZhciBza2lwUm91dGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGFzay5jb25maWcuYmVmb3JlUm91dGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBkbyBiZWZvcmVSb3V0ZSgpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmJlZm9yZVJvdXRlKHRhc2spID09PSAnc2tpcFJvdXRlTG9vcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNraXBSb3V0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNraXBSb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMsIFwiIHNraXBSb3V0ZUxvb3BcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpdFRhc2sgPSB0aGlzLnN0YXJ0Um91dGVMb29wKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGFzay5jb25maWcuYWZ0ZXJSb3V0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMsIFwiIGRvIGFmdGVyUm91dGUoKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suY29uZmlnLmFmdGVyUm91dGUodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhc2sucnVuVGltZXMrKztcbiAgICAgICAgICAgICAgICB0YXNrLmxhc3RSdW5UaW1lID0gbm93O1xuICAgICAgICAgICAgICAgIHZhciBkdXJpbmcgPSBub3cgLSB0YXNrLnN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBpZiAodGFzay5jb25maWcubWF4VGFza0R1cmluZyA+IDAgJiYgZHVyaW5nID49IHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiB0YXNrRHVyaW5nOiBcIikuY29uY2F0KGR1cmluZywgXCIvXCIpLmNvbmNhdCh0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nLCBcIiByZWFjaGVkLCBzdG9wXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0aGlzLnJlcm91dGVyQ29uZmlnLnRhc2tEZWxheSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdGFydFJvdXRlTG9vcCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB0aGlzLnJvdXRlQ29udGV4dCA9IHtcbiAgICAgICAgICAgIHRhc2s6IHRhc2ssXG4gICAgICAgICAgICBzY3JlZW46IHRoaXMuc2NyZWVuLFxuICAgICAgICAgICAgc2NyaXB0UnVubmluZzogdGhpcy5ydW5uaW5nLFxuICAgICAgICAgICAgcGF0aDogJycsXG4gICAgICAgICAgICBsYXN0TWF0Y2hlZFBhdGg6IChfYiA9IChfYSA9IHRoaXMucm91dGVDb250ZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGFzdE1hdGNoZWRQYXRoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAnJyxcbiAgICAgICAgICAgIG1hdGNoVGltZXM6IDAsXG4gICAgICAgICAgICBtYXRjaFN0YXJ0VFM6IDAsXG4gICAgICAgICAgICBtYXRjaER1cmluZzogMCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJvdXRlTG9vcCA9IHRydWU7XG4gICAgICAgIHZhciBleGl0VGFza1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICB2YXIgZmluaXNoUm91bmRGdW5jID0gZnVuY3Rpb24gKGV4aXRUYXNrKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoZXhpdFRhc2sgPT09IHZvaWQgMCkgeyBleGl0VGFzayA9IGZhbHNlOyB9XG4gICAgICAgICAgICByb3V0ZUxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIGV4aXRUYXNrUmVzdWx0ID0gZXhpdFRhc2s7XG4gICAgICAgICAgICBfdGhpcy5sb2coXCJmaW5pc2ggcm91bmQ6IFwiLmNvbmNhdCgoX2EgPSBfdGhpcy5yb3V0ZUNvbnRleHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50YXNrLm5hbWUsIFwiOyBleGl0VGFzazogXCIpLmNvbmNhdChleGl0VGFzaykpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBwb2ludGVyIGZvciBzaG9ydCBjb2RlXG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5yb3V0ZUNvbnRleHQ7XG4gICAgICAgIHdoaWxlIChyb3V0ZUxvb3AgJiYgdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRhc2suYXV0b1N0b3BcbiAgICAgICAgICAgIHZhciB0YXNrUnVuRHVyaW5nID0gbm93IC0gdGFzay5zdGFydFRpbWU7XG4gICAgICAgICAgICBpZiAodGFzay5jb25maWcuZm9yY2VTdG9wICYmIHRhc2tSdW5EdXJpbmcgPiB0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrIFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIEF1dG9TdG9wLCBleGNlZWQgdGFza1J1bkR1cmluZ1wiKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayBpc0FwcE9uIG9yIGF1dG8gbGF1bmNoIGl0XG4gICAgICAgICAgICBpZiAodGhpcy5yZXJvdXRlckNvbmZpZy5hdXRvTGF1bmNoQXBwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBbmRTdGFydEFwcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByb3RhdGlvbiA9IHRoaXMuc2NyZWVuLmdldFJvdGF0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgX2QgPSB0aGlzLmZpbmRNYXRjaGVkUm91dGVJbXBsKHRhc2submFtZSwgaW1hZ2UsIHJvdGF0aW9uKSwgbWF0Y2hlZFJvdXRlID0gX2QubWF0Y2hlZFJvdXRlLCBtYXRjaGVkUGFnZXMgPSBfZC5tYXRjaGVkUGFnZXM7XG4gICAgICAgICAgICAvLyBjb250ZXh0Lm1hdGNoU3RhcnRUUyA9IDAgaWYgaW5pdCBydW5cbiAgICAgICAgICAgIGNvbnRleHQubWF0Y2hTdGFydFRTID0gY29udGV4dC5tYXRjaFN0YXJ0VFMgfHwgbm93O1xuICAgICAgICAgICAgY29udGV4dC5wYXRoID0gKF9jID0gbWF0Y2hlZFJvdXRlID09PSBudWxsIHx8IG1hdGNoZWRSb3V0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbWF0Y2hlZFJvdXRlLnBhdGgpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6ICcnO1xuICAgICAgICAgICAgLy8gZmlyc3QgbWF0Y2hcbiAgICAgICAgICAgIGlmIChjb250ZXh0LnBhdGggIT09IGNvbnRleHQubGFzdE1hdGNoZWRQYXRoKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tYXRjaFRpbWVzID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1hdGNoU3RhcnRUUyA9IG5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQubWF0Y2hEdXJpbmcgPSBub3cgLSBjb250ZXh0Lm1hdGNoU3RhcnRUUztcbiAgICAgICAgICAgIGNvbnRleHQubWF0Y2hUaW1lcysrO1xuICAgICAgICAgICAgaWYgKG1hdGNoZWRSb3V0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVua25vd25Sb3V0ZUFjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVua25vd25Sb3V0ZUFjdGlvbihjb250ZXh0LCBpbWFnZSwgZmluaXNoUm91bmRGdW5jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvQWN0aW9uRm9yUm91dGUoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWRSb3V0ZSwgbWF0Y2hlZFBhZ2VzLCBmaW5pc2hSb3VuZEZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIGxhc3RNYXRjaGVkUGF0aCBhZnRlciBhY3Rpb24gZG9uZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBsYXN0TWF0Y2hlZFBhdGggd2lsbCBiZSBjdXJyZW50IHBhdGggd2hlbiBkb2luZyBhY3Rpb25cbiAgICAgICAgICAgIGNvbnRleHQubGFzdE1hdGNoZWRQYXRoID0gY29udGV4dC5wYXRoO1xuICAgICAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGFzay5jb25maWcuZmluZFJvdXRlRGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleGl0VGFza1Jlc3VsdDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5kb0FjdGlvbkZvclJvdXRlID0gZnVuY3Rpb24gKGNvbnRleHQsIGltYWdlLCByb3V0ZSwgbWF0Y2hlZFBhZ2VzLCBmaW5pc2hSb3VuZCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiaGFuZGxlTWF0Y2hlZFJvdXRlOiBcIi5jb25jYXQocm91dGUucGF0aCwgXCIsIHRpbWVzOiBcIikuY29uY2F0KGNvbnRleHQubWF0Y2hUaW1lcywgXCIsIGR1cmluZzogXCIpLmNvbmNhdChjb250ZXh0Lm1hdGNoRHVyaW5nKSk7XG4gICAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgPCByb3V0ZS5zaG91bGRNYXRjaFRpbWVzIHx8IGNvbnRleHQubWF0Y2hEdXJpbmcgPCByb3V0ZS5zaG91bGRNYXRjaER1cmluZykge1xuICAgICAgICAgICAgLy8gc2hvdWxkIHN0aWxsIHdhaXQgZm9yIG1hdGNoaW5nIGNvbmRpdGlvblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXh0WFkgPSAoX2EgPSBtYXRjaGVkUGFnZXNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uZXh0O1xuICAgICAgICB2YXIgYmFja1hZID0gKF9iID0gbWF0Y2hlZFBhZ2VzWzBdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYmFjaztcbiAgICAgICAgLy8gbWF0Y2hlZCBhbmQgZml0IGNvbmRpdGlvbiwgZG8gYWN0aW9uXG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAocm91dGUuYmVmb3JlQWN0aW9uRGVsYXkpO1xuICAgICAgICBpZiAocm91dGUuYWN0aW9uID09PSAnZ29OZXh0Jykge1xuICAgICAgICAgICAgaWYgKG5leHRYWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKG5leHRYWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocm91dGUucGF0aCwgXCIgYWN0aW9uID09IGdvTmV4dCwgYnV0IG5vIG5leHQgeHlcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJvdXRlLmFjdGlvbiA9PT0gJ2dvQmFjaycpIHtcbiAgICAgICAgICAgIGlmIChiYWNrWFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuLnRhcChiYWNrWFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIGFjdGlvbiA9PSBnb0JhY2ssIGJ1dCBubyBiYWNrIHh5XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3V0ZS5hY3Rpb24gPT09ICdrZXljb2RlQmFjaycpIHtcbiAgICAgICAgICAgIGtleWNvZGUoJ0JBQ0snLCB0aGlzLnNjcmVlbkNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcm91dGUuYWN0aW9uKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkUGFnZXMsIGZpbmlzaFJvdW5kKTtcbiAgICAgICAgfVxuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHJvdXRlLmFmdGVyQWN0aW9uRGVsYXkpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmZpbmRNYXRjaGVkUm91dGVJbXBsID0gZnVuY3Rpb24gKHRhc2tOYW1lLCBpbWFnZSwgcm90YXRpb24pIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucm91dGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdXRlID0gX2FbX2ldO1xuICAgICAgICAgICAgdmFyIF9iID0gdGhpcy5pc01hdGNoUm91dGVJbXBsKGltYWdlLCByb3RhdGlvbiwgcm91dGUsIHRhc2tOYW1lKSwgaXNNYXRjaGVkID0gX2IuaXNNYXRjaGVkLCBtYXRjaGVkUGFnZXMgPSBfYi5tYXRjaGVkUGFnZXM7XG4gICAgICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCAnY3VycmVudCBtYXRjaDonLCBtYXRjaGVkUGFnZXMubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLm5hbWU7IH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBtYXRjaGVkUm91dGU6IHJvdXRlLCBtYXRjaGVkUGFnZXM6IG1hdGNoZWRQYWdlcyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IG1hdGNoZWRSb3V0ZTogbnVsbCwgbWF0Y2hlZFBhZ2VzOiBbXSB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzTWF0Y2hSb3V0ZUltcGwgPSBmdW5jdGlvbiAoaW1hZ2UsIHJvdGF0aW9uLCByb3V0ZSwgdGFza05hbWUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAvLyBjaGVjayByb3RhdGlvblxuICAgICAgICBpZiAocm91dGUucm90YXRpb24gIT09IHJvdGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiZmluZE1hdGNoZWRSb3V0ZSBcIi5jb25jYXQocm91dGUucGF0aCwgXCIgbm90IG1hdGNoIHJvdGF0aW9uLCBza2lwXCIpKTtcbiAgICAgICAgICAgIHJldHVybiB7IGlzTWF0Y2hlZDogZmFsc2UsIG1hdGNoZWRQYWdlczogW10gfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNNYXRjaGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBtYXRjaGVkUGFnZXMgPSBbXTtcbiAgICAgICAgLy8gY2hlY2sgcm91dGUubWF0Y2hcbiAgICAgICAgaWYgKHJvdXRlLm1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAocm91dGUubWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5QYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5pc01hdGNoUGFnZUltcGwoaW1hZ2UsIHJvdXRlLm1hdGNoLCB0aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCByb3V0ZS5kZWJ1Zyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzTWF0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZWRQYWdlcy5wdXNoKHJvdXRlLm1hdGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyb3V0ZS5tYXRjaCBpbnN0YW5jZW9mIHN0cnVjdF8xLkdyb3VwUGFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRoaXMuaXNNYXRjaEdyb3VwUGFnZUltcGwoaW1hZ2UsIHJvdXRlLm1hdGNoLCB0aGlzLmRlZmF1bHRDb25maWcuR3JvdXBQYWdlVGhyZXMsIHJvdXRlLmRlYnVnKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzTWF0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZWRQYWdlcy5wdXNoLmFwcGx5KG1hdGNoZWRQYWdlcywgbWF0Y2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayByb3V0ZS5pc01hdGNoIGZ1bmN0aW9uXG4gICAgICAgIGlmICghaXNNYXRjaGVkICYmIHJvdXRlLmN1c3RvbU1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpc01hdGNoZWQgPSByb3V0ZS5jdXN0b21NYXRjaCh0YXNrTmFtZSwgaW1hZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImZpbmRNYXRjaGVkUm91dGUgXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIGlzTWF0Y2goKSA9PiBcIikuY29uY2F0KGlzTWF0Y2hlZCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJmaW5kTWF0Y2hlZFJvdXRlIFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBtYXRjaDogXCIpLmNvbmNhdChpc01hdGNoZWQsIFwiLCBmaXJzdFBhZ2U6IFwiKS5jb25jYXQoKF9hID0gbWF0Y2hlZFBhZ2VzWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNNYXRjaGVkOiBpc01hdGNoZWQsXG4gICAgICAgICAgICBtYXRjaGVkUGFnZXM6IG1hdGNoZWRQYWdlcyxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc01hdGNoUGFnZUltcGwgPSBmdW5jdGlvbiAoaW1hZ2UsIHBhZ2UsIHBhcmVudFRocmVzLCBkZWJ1Zykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciB0aHJlcyA9IChfYSA9IHBhZ2UudGhyZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHBhcmVudFRocmVzO1xuICAgICAgICB2YXIgaXNTYW1lID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcImNoZWNrTWF0Y2hQYWdlW1wiLmNvbmNhdChwYWdlLm5hbWUsIFwiXVwiKSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHBhZ2UucG9pbnRzW2ldO1xuICAgICAgICAgICAgdmFyIGNvbG9yID0gZ2V0SW1hZ2VDb2xvcihpbWFnZSwgcG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICB2YXIgc2NvcmUgPSB1dGlsc18xLlV0aWxzLmlkZW50aXR5Q29sb3IocG9pbnQsIGNvbG9yKTtcbiAgICAgICAgICAgIHZhciBpc1BvaW50Q29sb3JNYXRjaCA9IHNjb3JlID49IHRocmVzO1xuICAgICAgICAgICAgaWYgKCFpc1BvaW50Q29sb3JNYXRjaCkge1xuICAgICAgICAgICAgICAgIGlzU2FtZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJwb2ludFtcIi5jb25jYXQoaSwgXCJdIG1hdGNoIGZhbHNlOiBzY29yZTogXCIpLmNvbmNhdChzY29yZSwgXCIsIHRocmVzOiBcIikuY29uY2F0KHRocmVzLCBcIlxcblwiKSwgXCJleHBlY3Q6IFwiLmNvbmNhdCh1dGlsc18xLlV0aWxzLmZvcm1hdFhZUkdCKHBvaW50KSwgXCJcXG5cIiksIFwiICAgZ2V0OiBcIi5jb25jYXQodXRpbHNfMS5VdGlscy5mb3JtYXRYWVJHQihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29sb3IpLCB7IHg6IHBvaW50LngsIHk6IHBvaW50LnkgfSkpKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcImNoZWNrTWF0Y2hQYWdlW1wiLmNvbmNhdChwYWdlLm5hbWUsIFwiXVttYXRjaDogXCIpLmNvbmNhdChpc1NhbWUsIFwiXVwiKSk7XG4gICAgICAgIHJldHVybiBpc1NhbWU7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNNYXRjaEdyb3VwUGFnZUltcGwgPSBmdW5jdGlvbiAoaW1hZ2UsIGdyb3VwUGFnZSwgcGFyZW50VGhyZXMsIGRlYnVnKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIHRocmVzID0gKF9hID0gZ3JvdXBQYWdlLnRocmVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwYXJlbnRUaHJlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cFBhZ2UucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gZ3JvdXBQYWdlLnBhZ2VzW2ldO1xuICAgICAgICAgICAgdmFyIGlzUGFnZU1hdGNoID0gdGhpcy5pc01hdGNoUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRocmVzLCBkZWJ1Zyk7XG4gICAgICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwiY2hlY2tNYXRjaEdyb3VwUGFnZTogXCIuY29uY2F0KGdyb3VwUGFnZS5uYW1lLCBcIiwgcGFnZVtcIikuY29uY2F0KGksIFwiXTogXCIpLmNvbmNhdChwYWdlLm5hbWUsIFwiIG1hdGNoOiBcIikuY29uY2F0KGlzUGFnZU1hdGNoKSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXBQYWdlLm1hdGNoT1AgPT09ICd8fCcgJiYgaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3BhZ2VdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyb3VwUGFnZS5tYXRjaE9QID09PSAnJiYnICYmICFpc1BhZ2VNYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JvdXBQYWdlLm1hdGNoT1AgPT09ICcmJicgPyBncm91cFBhZ2UucGFnZXMgOiBbXTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dJbXBsLmFwcGx5KHRoaXMsIF9fc3ByZWFkQXJyYXkoW3RoaXMuZGVidWddLCBhcmdzLCBmYWxzZSkpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmxvZ0ltcGwgPSBmdW5jdGlvbiAoZGVidWcpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWJ1ZyB8fCAhdGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9ubHkgbG9nIHdoZW4gZGVidWcgKyB0aGlzLmRlYnVnIGlzIHRydWVcbiAgICAgICAgdXRpbHNfMS5VdGlscy5sb2cuYXBwbHkodXRpbHNfMS5VdGlscywgX19zcHJlYWRBcnJheShbJ1tSZXJvdXRlcl1bZGVidWddJ10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud2FybmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB1dGlsc18xLlV0aWxzLmxvZy5hcHBseSh1dGlsc18xLlV0aWxzLCBfX3NwcmVhZEFycmF5KFsnW1Jlcm91dGVyXVt3YXJuaW5nXSddLCBhcmdzLCBmYWxzZSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFJlcm91dGVyO1xufSgpKTtcbmV4cG9ydHMuUmVyb3V0ZXIgPSBSZXJvdXRlcjtcbmV4cG9ydHMucmVyb3V0ZXIgPSBuZXcgUmVyb3V0ZXIoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcm91dGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TY3JlZW4gPSB2b2lkIDA7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIFNjcmVlbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTY3JlZW4oY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cbiAgICBTY3JlZW4ucHJvdG90eXBlLmNhbGN1bGF0ZURldmljZU9mZnNldCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gZnVuYyh0aGlzKTtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuV2lkdGggPSByZXN1bHRzLnNjcmVlbldpZHRoO1xuICAgICAgICB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQgPSByZXN1bHRzLnNjcmVlbkhlaWdodDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WCA9IHJlc3VsdHMuc2NyZWVuT2Zmc2V0WDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSA9IHJlc3VsdHMuc2NyZWVuT2Zmc2V0WTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWCA9IGZ1bmN0aW9uIChkZXZYKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFggKyAoZGV2WCAqIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoKSAvIHRoaXMuY29uZmlnLmRldldpZHRoKSB8fCAwO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5ZID0gZnVuY3Rpb24gKGRldlkpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSArIChkZXZZICogdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0KSAvIHRoaXMuY29uZmlnLmRldkhlaWdodCkgfHwgMDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWFkgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0U2NyZWVuWFkgd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXAgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgdGFwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICB0YXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXBEb3duID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHRhcERvd24oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHRhcERvd24oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5tb3ZlVG8gPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgbW92ZVRvKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICBtb3ZlVG8oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXBVcCA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICB0YXBVcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgdGFwVXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5Db2xvciA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciBpbWcgPSB0aGlzLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgICAgIHZhciByZ2IgPSBnZXRJbWFnZUNvbG9yKGltZywgcDEueCwgcDEueSk7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgICAgIHJldHVybiByZ2I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWcsIHAxLCBwMik7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgICAgIHJldHVybiByZ2I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZmluZEltYWdlID0gZnVuY3Rpb24gKGRldkltZykge1xuICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciByZXN1bHQgPSBmaW5kSW1hZ2UoaW1nLCBkZXZJbWcpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwSW1hZ2UgPSBmdW5jdGlvbiAoZGV2SW1nKSB7XG4gICAgICAgIHZhciB4eSA9IHRoaXMuZmluZEltYWdlKGRldkltZyk7XG4gICAgICAgIHRoaXMudGFwKHh5KTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuaXNTYW1lQ29sb3IgPSBmdW5jdGlvbiAoZGV2Q29sb3JQb2ludCwgdGhyZXMpIHtcbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSAwLjk7IH1cbiAgICAgICAgdmFyIHJnYiA9IHRoaXMuZ2V0U2NyZWVuQ29sb3IoZGV2Q29sb3JQb2ludCk7XG4gICAgICAgIHZhciBzY29yZSA9IHV0aWxzXzEuVXRpbHMuaWRlbnRpdHlDb2xvcihyZ2IsIGRldkNvbG9yUG9pbnQpO1xuICAgICAgICBpZiAoc2NvcmUgPiB0aHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLy8gY3VycmVudGx5IHJlYWwgZGV2aWNlIHNjcmVlbnNob3RcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldERldmljZVNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90KCk7XG4gICAgfTtcbiAgICAvLyBjdXJyZW50bHkgZGV2aWNlIHNjcmVlbnNob3QgY3V0IGJ5IG9mZnNldFxuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuU2NyZWVuc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFNjcmVlbnNob3RNb2RpZnkodGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WCwgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSwgdGhpcy5jb25maWcuc2NyZWVuV2lkdGgsIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCwgdGhpcy5jb25maWcuc2NyZWVuV2lkdGgsIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCwgMTAwKTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFNjcmVlbnNob3RNb2RpZnkodGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WCwgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSwgdGhpcy5jb25maWcuc2NyZWVuV2lkdGgsIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCwgdGhpcy5jb25maWcuZGV2V2lkdGgsIHRoaXMuY29uZmlnLmRldkhlaWdodCwgMTAwKTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0Um90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IGdldFNjcmVlblNpemUoKSwgd2lkdGggPSBfYS53aWR0aCwgaGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldEltYWdlUm90YXRpb24gPSBmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgdmFyIF9hID0gZ2V0SW1hZ2VTaXplKGltYWdlKSwgd2lkdGggPSBfYS53aWR0aCwgaGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnNldEFjdGlvbkR1cmluZyA9IGZ1bmN0aW9uIChkdXJpbmcpIHtcbiAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nID0gZHVyaW5nO1xuICAgIH07XG4gICAgU2NyZWVuLmRlYnVnID0gZmFsc2U7XG4gICAgcmV0dXJuIFNjcmVlbjtcbn0oKSk7XG5leHBvcnRzLlNjcmVlbiA9IFNjcmVlbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjcmVlbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRGVmYXVsdFNjcmVlbkNvbmZpZyA9IGV4cG9ydHMuRGVmYXVsdFJlcm91dGVyQ29uZmlnID0gZXhwb3J0cy5EZWZhdWx0Q29uZmlnVmFsdWUgPSBleHBvcnRzLkdyb3VwUGFnZSA9IGV4cG9ydHMuUGFnZSA9IHZvaWQgMDtcbnZhciBQYWdlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhZ2UobmFtZSwgZGV2UG9pbnRzLCBuZXh0LCBiYWNrLCB0aHJlcykge1xuICAgICAgICBpZiAobmV4dCA9PT0gdm9pZCAwKSB7IG5leHQgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKGJhY2sgPT09IHZvaWQgMCkgeyBiYWNrID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0aHJlcyA9PT0gdm9pZCAwKSB7IHRocmVzID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucG9pbnRzID0gZGV2UG9pbnRzO1xuICAgICAgICB0aGlzLm5leHQgPSBuZXh0O1xuICAgICAgICB0aGlzLmJhY2sgPSBiYWNrO1xuICAgICAgICB0aGlzLnRocmVzID0gdGhyZXM7XG4gICAgfVxuICAgIHJldHVybiBQYWdlO1xufSgpKTtcbmV4cG9ydHMuUGFnZSA9IFBhZ2U7XG52YXIgR3JvdXBQYWdlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdyb3VwUGFnZShuYW1lLCBwYWdlcywgbmV4dCwgYmFjaywgdGhyZXMsIG1hdGNoT1ApIHtcbiAgICAgICAgaWYgKG5leHQgPT09IHZvaWQgMCkgeyBuZXh0ID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmIChiYWNrID09PSB2b2lkIDApIHsgYmFjayA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodGhyZXMgPT09IHZvaWQgMCkgeyB0aHJlcyA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAobWF0Y2hPUCA9PT0gdm9pZCAwKSB7IG1hdGNoT1AgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wYWdlcyA9IHBhZ2VzO1xuICAgICAgICB0aGlzLm5leHQgPSBuZXh0O1xuICAgICAgICB0aGlzLmJhY2sgPSBiYWNrO1xuICAgICAgICB0aGlzLnRocmVzID0gdGhyZXM7XG4gICAgICAgIHRoaXMubWF0Y2hPUCA9IG1hdGNoT1AgfHwgJ3x8JztcbiAgICB9XG4gICAgcmV0dXJuIEdyb3VwUGFnZTtcbn0oKSk7XG5leHBvcnRzLkdyb3VwUGFnZSA9IEdyb3VwUGFnZTtcbmV4cG9ydHMuRGVmYXVsdENvbmZpZ1ZhbHVlID0ge1xuICAgIFhZUkdCVGhyZXM6IDAuOSxcbiAgICBQYWdlVGhyZXM6IDAuOSxcbiAgICBHcm91cFBhZ2VUaHJlczogMC45LFxuICAgIEdyb3VwUGFnZU1hdGNoT1A6ICd8fCcsXG4gICAgUm91dGVDb25maWdTaG91bGRNYXRjaFRpbWVzOiAxLFxuICAgIFJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hEdXJpbmc6IDAsXG4gICAgUm91dGVDb25maWdCZWZvcmVBY3Rpb25EZWxheTogMjUwLFxuICAgIFJvdXRlQ29uZmlnQWZ0ZXJBY3Rpb25EZWxheTogMjUwLFxuICAgIFJvdXRlQ29uZmlnUHJpb3JpdHk6IDEsXG4gICAgUm91dGVDb25maWdEZWJ1ZzogZmFsc2UsXG4gICAgVGFza0NvbmZpZ01heFRhc2tSdW5UaW1lczogMSxcbiAgICBUYXNrQ29uZmlnTWF4VGFza0R1cmluZzogMCxcbiAgICBUYXNrQ29uZmlnTWluUm91bmRJbnRlcnZhbDogMCxcbiAgICBUYXNrQ29uZmlnQXV0b1N0b3A6IGZhbHNlLFxuICAgIFRhc2tDb25maWdGaW5kUm91dGVEZWxheTogMjAwMCxcbn07XG5leHBvcnRzLkRlZmF1bHRSZXJvdXRlckNvbmZpZyA9IHtcbiAgICBwYWNrYWdlTmFtZTogJycsXG4gICAgdGFza0RlbGF5OiAyMDAwLFxuICAgIHN0YXJ0QXBwRGVsYXk6IDYwMDAsXG4gICAgYXV0b0xhdW5jaEFwcDogdHJ1ZSxcbiAgICB0ZXN0aW5nU2NyZWVuc2hvdFBhdGg6ICcuL3NjcmVlbnNob3QnLFxufTtcbmV4cG9ydHMuRGVmYXVsdFNjcmVlbkNvbmZpZyA9IHtcbiAgICBkZXZXaWR0aDogNjQwLFxuICAgIGRldkhlaWdodDogMzYwLFxuICAgIGRldmljZVdpZHRoOiAwLFxuICAgIGRldmljZUhlaWdodDogMCxcbiAgICBzY3JlZW5XaWR0aDogMCxcbiAgICBzY3JlZW5IZWlnaHQ6IDAsXG4gICAgc2NyZWVuT2Zmc2V0WDogMCxcbiAgICBzY3JlZW5PZmZzZXRZOiAwLFxuICAgIGFjdGlvbkR1cmluZzogMTgwLFxuICAgIHJvdGF0aW9uOiAnaG9yaXpvbnRhbCcsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RydWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5VdGlscyA9IGV4cG9ydHMubG9nID0gdm9pZCAwO1xuZnVuY3Rpb24gbG9nKCkge1xuICAgIHZhciBtc2dzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgbXNnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywge1xuICAgICAgICB0aW1lWm9uZTogJ0FzaWEvVGFpcGVpJyxcbiAgICB9KTtcbiAgICB2YXIgbWVzc2FnZSA9IFwiW1wiLmNvbmNhdChkYXRlLCBcIl0gXCIpO1xuICAgIGZvciAodmFyIF9hID0gMCwgbXNnc18xID0gbXNnczsgX2EgPCBtc2dzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgIHZhciBtc2cgPSBtc2dzXzFbX2FdO1xuICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJcIi5jb25jYXQoSlNPTi5zdHJpbmdpZnkobXNnKSwgXCIgXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlwiLmNvbmNhdChtc2csIFwiIFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlLnN1YnN0cigwLCBtZXNzYWdlLmxlbmd0aCAtIDEpKTtcbn1cbmV4cG9ydHMubG9nID0gbG9nO1xudmFyIFV0aWxzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFV0aWxzKCkge1xuICAgIH1cbiAgICBVdGlscy5pZGVudGl0eUNvbG9yID0gZnVuY3Rpb24gKGUxLCBlMikge1xuICAgICAgICB2YXIgbWVhbiA9IChlMS5yICsgZTIucikgLyAyO1xuICAgICAgICB2YXIgciA9IGUxLnIgLSBlMi5yO1xuICAgICAgICB2YXIgZyA9IGUxLmcgLSBlMi5nO1xuICAgICAgICB2YXIgYiA9IGUxLmIgLSBlMi5iO1xuICAgICAgICByZXR1cm4gMSAtIE1hdGguc3FydCgoKCg1MTIgKyBtZWFuKSAqIHIgKiByKSA+PiA4KSArIDQgKiBnICogZyArICgoKDc2NyAtIG1lYW4pICogYiAqIGIpID4+IDgpKSAvIDc2ODtcbiAgICB9O1xuICAgIFV0aWxzLmZvcm1hdFhZUkdCID0gZnVuY3Rpb24gKHh5cmdiKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoeHlyZ2IpO1xuICAgICAgICB2YXIgZm9ybWF0T2JqID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICB2YXIgc3RyID0gXCJcIi5jb25jYXQoeHlyZ2Jba10pO1xuICAgICAgICAgICAgd2hpbGUgKHN0ci5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJyAnICsgc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9ybWF0T2JqW2tdID0gc3RyO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4ID0gZm9ybWF0T2JqLngsIHkgPSBmb3JtYXRPYmoueSwgciA9IGZvcm1hdE9iai5yLCBnID0gZm9ybWF0T2JqLmcsIGIgPSBmb3JtYXRPYmouYjtcbiAgICAgICAgcmV0dXJuIFwieyB4OiBcIi5jb25jYXQoeCwgXCIsIHk6IFwiKS5jb25jYXQoeSwgXCIsIHI6IFwiKS5jb25jYXQociwgXCIsIGc6IFwiKS5jb25jYXQoZywgXCIsIGI6IFwiKS5jb25jYXQoYiwgXCIgfVwiKTtcbiAgICB9O1xuICAgIFV0aWxzLnNvcnRTdHJpbmdOdW1iZXJNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtYXApIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7IGtleToga2V5LCBjb3VudDogbWFwW2tleV0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiLmNvdW50IC0gYS5jb3VudDsgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG4gICAgVXRpbHMuc2xlZXAgPSBmdW5jdGlvbiAoZHVyaW5nKSB7XG4gICAgICAgIHdoaWxlIChkdXJpbmcgPiAyMDApIHtcbiAgICAgICAgICAgIGR1cmluZyAtPSAyMDA7XG4gICAgICAgICAgICBzbGVlcCgyMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkdXJpbmcgPiAwKSB7XG4gICAgICAgICAgICBzbGVlcChkdXJpbmcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5nZXRUYWl3YW5UaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSArIDggKiA2MCAqIDYwICogMTAwMDtcbiAgICB9O1xuICAgIFV0aWxzLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tpXSA9IEpTT04uc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShVdGlscy5nZXRUYWl3YW5UaW1lKCkpO1xuICAgICAgICB2YXIgZGF0ZVN0cmluZyA9IFwiW1wiLmNvbmNhdChkYXRlLmdldE1vbnRoKCkgKyAxLCBcIi1cIikuY29uY2F0KGRhdGUuZ2V0RGF0ZSgpLCBcIlRcIikuY29uY2F0KGRhdGUuZ2V0SG91cnMoKSwgXCI6XCIpLmNvbmNhdChkYXRlLmdldE1pbnV0ZXMoKSwgXCI6XCIpLmNvbmNhdChkYXRlLmdldFNlY29uZHMoKSwgXCJdXCIpO1xuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBfX3NwcmVhZEFycmF5KFtkYXRlU3RyaW5nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFV0aWxzLm5vdGlmeUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBjb250ZW50KSB7XG4gICAgICAgIGlmIChzZW5kRXZlbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBVdGlscy5sb2coJ3NlbmRFdmVudCcsIGV2ZW50LCBjb250ZW50KTtcbiAgICAgICAgICAgIHNlbmRFdmVudCgnJyArIGV2ZW50LCAnJyArIGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zdGFydEFwcCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICBleGVjdXRlKFwiQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrMi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9zZXJ2aWNlcy5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvd2Vidmlld2Nocm9taXVtLmphciBhbSBzdGFydCAtbiBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtb2ouamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtbGliYXJ0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9vcmcuYXBhY2hlLmh0dHAubGVnYWN5LmJvb3QuamFyIGFtIHN0YXJ0IC1uIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgICAgICBleGVjdXRlKFwiQU5EUk9JRF9EQVRBPS9kYXRhIG1vbmtleSAtLXBjdC1zeXNrZXlzIDAgLXAgXCIuY29uY2F0KHBhY2thZ2VOYW1lLCBcIiAtYyBhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUiAxXCIpKTtcbiAgICAgICAgZXhlY3V0ZSgnQU5EUk9JRF9CT09UTE9HTz0xICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfUk9PVD0vc3lzdGVtICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfQVNTRVRTPS9zeXN0ZW0vYXBwICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfREFUQT0vZGF0YSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1NUT1JBR0U9L3N0b3JhZ2UgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9BUlRfUk9PVD0vYXBleC9jb20uYW5kcm9pZC5hcnQgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9JMThOX1JPT1Q9L2FwZXgvY29tLmFuZHJvaWQuaTE4biAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1RaREFUQV9ST09UPS9hcGV4L2NvbS5hbmRyb2lkLnR6ZGF0YSAnICtcbiAgICAgICAgICAgICdFWFRFUk5BTF9TVE9SQUdFPS9zZGNhcmQgJyArXG4gICAgICAgICAgICAnQVNFQ19NT1VOVFBPSU5UPS9tbnQvYXNlYyAnICtcbiAgICAgICAgICAgICdCT09UQ0xBU1NQQVRIPS9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtb2ouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtbGliYXJ0LmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWljdTRqLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9va2h0dHAuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2JvdW5jeWNhc3RsZS5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmstYXRiLWJhY2t3YXJkLWNvbXBhdGliaWxpdHkuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmNvbnNjcnlwdC9qYXZhbGliL2NvbnNjcnlwdC5qYXI6L2FwZXgvY29tLmFuZHJvaWQubWVkaWEvamF2YWxpYi91cGRhdGFibGUtbWVkaWEuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm1lZGlhcHJvdmlkZXIvamF2YWxpYi9mcmFtZXdvcmstbWVkaWFwcm92aWRlci5qYXI6L2FwZXgvY29tLmFuZHJvaWQub3Muc3RhdHNkL2phdmFsaWIvZnJhbWV3b3JrLXN0YXRzZC5qYXI6L2FwZXgvY29tLmFuZHJvaWQucGVybWlzc2lvbi9qYXZhbGliL2ZyYW1ld29yay1wZXJtaXNzaW9uLmphcjovYXBleC9jb20uYW5kcm9pZC5zZGtleHQvamF2YWxpYi9mcmFtZXdvcmstc2RrZXh0ZW5zaW9ucy5qYXI6L2FwZXgvY29tLmFuZHJvaWQud2lmaS9qYXZhbGliL2ZyYW1ld29yay13aWZpLmphcjovYXBleC9jb20uYW5kcm9pZC50ZXRoZXJpbmcvamF2YWxpYi9mcmFtZXdvcmstdGV0aGVyaW5nLmphciAnICtcbiAgICAgICAgICAgICdERVgyT0FUQk9PVENMQVNTUEFUSD0vYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLW9qLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWxpYmFydC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1pY3U0ai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvb2todHRwLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9ib3VuY3ljYXN0bGUuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLWF0Yi1iYWNrd2FyZC1jb21wYXRpYmlsaXR5LmphciAnICtcbiAgICAgICAgICAgICdTWVNURU1TRVJWRVJDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29tLmFuZHJvaWQubG9jYXRpb24ucHJvdmlkZXIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3NlcnZpY2VzLmphcjovc3lzdGVtL2ZyYW1ld29yay9ldGhlcm5ldC1zZXJ2aWNlLmphcjovYXBleC9jb20uYW5kcm9pZC5wZXJtaXNzaW9uL2phdmFsaWIvc2VydmljZS1wZXJtaXNzaW9uLmphcjovYXBleC9jb20uYW5kcm9pZC5pcHNlYy9qYXZhbGliL2FuZHJvaWQubmV0Lmlwc2VjLmlrZS5qYXIgJyArXG4gICAgICAgICAgICBcIm1vbmtleSAtLXBjdC1zeXNrZXlzIDAgLXAgXCIuY29uY2F0KHBhY2thZ2VOYW1lLCBcIiAtYyBhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUiAxXCIpKTtcbiAgICB9O1xuICAgIFV0aWxzLnN0b3BBcHAgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgZXhlY3V0ZShcIkJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yazIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvc2VydmljZXMuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3dlYnZpZXdjaHJvbWl1bS5qYXIgYW0gZm9yY2Utc3RvcCBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtb2ouamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtbGliYXJ0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9vcmcuYXBhY2hlLmh0dHAubGVnYWN5LmJvb3QuamFyIGFtIGZvcmNlLXN0b3AgXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgfTtcbiAgICBVdGlscy5nZXRDdXJyZW50QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZXhlY3V0ZSgnZHVtcHN5cyB3aW5kb3cgd2luZG93cycpLnNwbGl0KCdtQ3VycmVudEZvY3VzJyk7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuIFsnJywgJyddO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFsxXS5zcGxpdCgnICcpO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRbMl0gPSByZXN1bHRbMl0ucmVwbGFjZSgnfScsICcnKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0WzJdLnNwbGl0KCcvJyk7XG4gICAgICAgIHZhciBwYWNrYWdlTmFtZSA9ICcnO1xuICAgICAgICB2YXIgYWN0aXZpdHlOYW1lID0gJyc7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lID0gcmVzdWx0WzBdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcGFja2FnZU5hbWUgPSByZXN1bHRbMF0udHJpbSgpO1xuICAgICAgICAgICAgYWN0aXZpdHlOYW1lID0gcmVzdWx0WzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BhY2thZ2VOYW1lLCBhY3Rpdml0eU5hbWVdO1xuICAgIH07XG4gICAgVXRpbHMuaXNBcHBPblRvcCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICB2YXIgdG9wSW5mbyA9IGV4ZWN1dGUoJ2R1bXBzeXMgYWN0aXZpdHkgYWN0aXZpdGllcyB8IGdyZXAgbVJlc3VtZWRBY3Rpdml0eScpO1xuICAgICAgICByZXR1cm4gdG9wSW5mby5pbmRleE9mKHBhY2thZ2VOYW1lKSAhPT0gLTE7XG4gICAgfTtcbiAgICBVdGlscy5zZW5kU2xhY2tNZXNzYWdlID0gZnVuY3Rpb24gKHVybCwgdGl0bGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGJvZHkgPSB7XG4gICAgICAgICAgICBibG9ja3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnKicgKyB0aXRsZSArICcqJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RpdmlkZXInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgICAgaHR0cENsaWVudCgnUE9TVCcsIHVybCwgSlNPTi5zdHJpbmdpZnkoYm9keSksIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVXRpbHMud2FpdEZvckFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBtYXRjaHMgPSAwO1xuICAgICAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIG5vdyA8IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb24oKSkge1xuICAgICAgICAgICAgICAgIG1hdGNocysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNocyA+PSBtYXRjaFRpbWVzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBVdGlscy5zbGVlcChpbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNocyA+PSBtYXRjaFRpbWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gVXRpbHM7XG59KCkpO1xuZXhwb3J0cy5VdGlscyA9IFV0aWxzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwidmFyIGNoYXJlbmMgPSB7XG4gIC8vIFVURi04IGVuY29kaW5nXG4gIHV0Zjg6IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIGNoYXJlbmMuYmluLnN0cmluZ1RvQnl0ZXModW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoY2hhcmVuYy5iaW4uYnl0ZXNUb1N0cmluZyhieXRlcykpKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gQmluYXJ5IGVuY29kaW5nXG4gIGJpbjoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBzdHIgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgc3RyLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkpO1xuICAgICAgcmV0dXJuIHN0ci5qb2luKCcnKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhcmVuYztcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIGJhc2U2NG1hcFxuICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycsXG5cbiAgY3J5cHQgPSB7XG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gbGVmdFxuICAgIHJvdGw6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCBiKSB8IChuID4+PiAoMzIgLSBiKSk7XG4gICAgfSxcblxuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIHJpZ2h0XG4gICAgcm90cjogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8ICgzMiAtIGIpKSB8IChuID4+PiBiKTtcbiAgICB9LFxuXG4gICAgLy8gU3dhcCBiaWctZW5kaWFuIHRvIGxpdHRsZS1lbmRpYW4gYW5kIHZpY2UgdmVyc2FcbiAgICBlbmRpYW46IGZ1bmN0aW9uKG4pIHtcbiAgICAgIC8vIElmIG51bWJlciBnaXZlbiwgc3dhcCBlbmRpYW5cbiAgICAgIGlmIChuLmNvbnN0cnVjdG9yID09IE51bWJlcikge1xuICAgICAgICByZXR1cm4gY3J5cHQucm90bChuLCA4KSAmIDB4MDBGRjAwRkYgfCBjcnlwdC5yb3RsKG4sIDI0KSAmIDB4RkYwMEZGMDA7XG4gICAgICB9XG5cbiAgICAgIC8vIEVsc2UsIGFzc3VtZSBhcnJheSBhbmQgc3dhcCBhbGwgaXRlbXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbi5sZW5ndGg7IGkrKylcbiAgICAgICAgbltpXSA9IGNyeXB0LmVuZGlhbihuW2ldKTtcbiAgICAgIHJldHVybiBuO1xuICAgIH0sXG5cbiAgICAvLyBHZW5lcmF0ZSBhbiBhcnJheSBvZiBhbnkgbGVuZ3RoIG9mIHJhbmRvbSBieXRlc1xuICAgIHJhbmRvbUJ5dGVzOiBmdW5jdGlvbihuKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdOyBuID4gMDsgbi0tKVxuICAgICAgICBieXRlcy5wdXNoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBiaWctZW5kaWFuIDMyLWJpdCB3b3Jkc1xuICAgIGJ5dGVzVG9Xb3JkczogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHdvcmRzID0gW10sIGkgPSAwLCBiID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrLCBiICs9IDgpXG4gICAgICAgIHdvcmRzW2IgPj4+IDVdIHw9IGJ5dGVzW2ldIDw8ICgyNCAtIGIgJSAzMik7XG4gICAgICByZXR1cm4gd29yZHM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYmlnLWVuZGlhbiAzMi1iaXQgd29yZHMgdG8gYSBieXRlIGFycmF5XG4gICAgd29yZHNUb0J5dGVzOiBmdW5jdGlvbih3b3Jkcykge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYiA9IDA7IGIgPCB3b3Jkcy5sZW5ndGggKiAzMjsgYiArPSA4KVxuICAgICAgICBieXRlcy5wdXNoKCh3b3Jkc1tiID4+PiA1XSA+Pj4gKDI0IC0gYiAlIDMyKSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBoZXggc3RyaW5nXG4gICAgYnl0ZXNUb0hleDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGhleCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldICYgMHhGKS50b1N0cmluZygxNikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGhleCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgaGV4VG9CeXRlczogZnVuY3Rpb24oaGV4KSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBjID0gMDsgYyA8IGhleC5sZW5ndGg7IGMgKz0gMilcbiAgICAgICAgYnl0ZXMucHVzaChwYXJzZUludChoZXguc3Vic3RyKGMsIDIpLCAxNikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGJhc2UtNjQgc3RyaW5nXG4gICAgYnl0ZXNUb0Jhc2U2NDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGJhc2U2NCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHZhciB0cmlwbGV0ID0gKGJ5dGVzW2ldIDw8IDE2KSB8IChieXRlc1tpICsgMV0gPDwgOCkgfCBieXRlc1tpICsgMl07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgNDsgaisrKVxuICAgICAgICAgIGlmIChpICogOCArIGogKiA2IDw9IGJ5dGVzLmxlbmd0aCAqIDgpXG4gICAgICAgICAgICBiYXNlNjQucHVzaChiYXNlNjRtYXAuY2hhckF0KCh0cmlwbGV0ID4+PiA2ICogKDMgLSBqKSkgJiAweDNGKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goJz0nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlNjQuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBiYXNlLTY0IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBiYXNlNjRUb0J5dGVzOiBmdW5jdGlvbihiYXNlNjQpIHtcbiAgICAgIC8vIFJlbW92ZSBub24tYmFzZS02NCBjaGFyYWN0ZXJzXG4gICAgICBiYXNlNjQgPSBiYXNlNjQucmVwbGFjZSgvW15BLVowLTkrXFwvXS9pZywgJycpO1xuXG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMCwgaW1vZDQgPSAwOyBpIDwgYmFzZTY0Lmxlbmd0aDtcbiAgICAgICAgICBpbW9kNCA9ICsraSAlIDQpIHtcbiAgICAgICAgaWYgKGltb2Q0ID09IDApIGNvbnRpbnVlO1xuICAgICAgICBieXRlcy5wdXNoKCgoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpIC0gMSkpXG4gICAgICAgICAgICAmIChNYXRoLnBvdygyLCAtMiAqIGltb2Q0ICsgOCkgLSAxKSkgPDwgKGltb2Q0ICogMikpXG4gICAgICAgICAgICB8IChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkpKSA+Pj4gKDYgLSBpbW9kNCAqIDIpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9O1xuXG4gIG1vZHVsZS5leHBvcnRzID0gY3J5cHQ7XG59KSgpO1xuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY3J5cHQgPSByZXF1aXJlKCdjcnlwdCcpLFxyXG4gICAgICB1dGY4ID0gcmVxdWlyZSgnY2hhcmVuYycpLnV0ZjgsXHJcbiAgICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyksXHJcbiAgICAgIGJpbiA9IHJlcXVpcmUoJ2NoYXJlbmMnKS5iaW4sXHJcblxyXG4gIC8vIFRoZSBjb3JlXHJcbiAgbWQ1ID0gZnVuY3Rpb24gKG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIC8vIENvbnZlcnQgdG8gYnl0ZSBhcnJheVxyXG4gICAgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT0gU3RyaW5nKVxyXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuY29kaW5nID09PSAnYmluYXJ5JylcclxuICAgICAgICBtZXNzYWdlID0gYmluLnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXNzYWdlID0gdXRmOC5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgZWxzZSBpZiAoaXNCdWZmZXIobWVzc2FnZSkpXHJcbiAgICAgIG1lc3NhZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZXNzYWdlLCAwKTtcclxuICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2UpICYmIG1lc3NhZ2UuY29uc3RydWN0b3IgIT09IFVpbnQ4QXJyYXkpXHJcbiAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnRvU3RyaW5nKCk7XHJcbiAgICAvLyBlbHNlLCBhc3N1bWUgYnl0ZSBhcnJheSBhbHJlYWR5XHJcblxyXG4gICAgdmFyIG0gPSBjcnlwdC5ieXRlc1RvV29yZHMobWVzc2FnZSksXHJcbiAgICAgICAgbCA9IG1lc3NhZ2UubGVuZ3RoICogOCxcclxuICAgICAgICBhID0gIDE3MzI1ODQxOTMsXHJcbiAgICAgICAgYiA9IC0yNzE3MzM4NzksXHJcbiAgICAgICAgYyA9IC0xNzMyNTg0MTk0LFxyXG4gICAgICAgIGQgPSAgMjcxNzMzODc4O1xyXG5cclxuICAgIC8vIFN3YXAgZW5kaWFuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbVtpXSA9ICgobVtpXSA8PCAgOCkgfCAobVtpXSA+Pj4gMjQpKSAmIDB4MDBGRjAwRkYgfFxyXG4gICAgICAgICAgICAgKChtW2ldIDw8IDI0KSB8IChtW2ldID4+PiAgOCkpICYgMHhGRjAwRkYwMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQYWRkaW5nXHJcbiAgICBtW2wgPj4+IDVdIHw9IDB4ODAgPDwgKGwgJSAzMik7XHJcbiAgICBtWygoKGwgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbDtcclxuXHJcbiAgICAvLyBNZXRob2Qgc2hvcnRjdXRzXHJcbiAgICB2YXIgRkYgPSBtZDUuX2ZmLFxyXG4gICAgICAgIEdHID0gbWQ1Ll9nZyxcclxuICAgICAgICBISCA9IG1kNS5faGgsXHJcbiAgICAgICAgSUkgPSBtZDUuX2lpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkgKz0gMTYpIHtcclxuXHJcbiAgICAgIHZhciBhYSA9IGEsXHJcbiAgICAgICAgICBiYiA9IGIsXHJcbiAgICAgICAgICBjYyA9IGMsXHJcbiAgICAgICAgICBkZCA9IGQ7XHJcblxyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyAwXSwgIDcsIC02ODA4NzY5MzYpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyAyXSwgMTcsICA2MDYxMDU4MTkpO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgNF0sICA3LCAtMTc2NDE4ODk3KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgNV0sIDEyLCAgMTIwMDA4MDQyNik7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDhdLCAgNywgIDE3NzAwMzU0MTYpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyA5XSwgMTIsIC0xOTU4NDE0NDE3KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsxMF0sIDE3LCAtNDIwNjMpO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsxMl0sICA3LCAgMTgwNDYwMzY4Mik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krMTVdLCAyMiwgIDEyMzY1MzUzMjkpO1xyXG5cclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgMV0sICA1LCAtMTY1Nzk2NTEwKTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsgNl0sICA5LCAtMTA2OTUwMTYzMik7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTFdLCAxNCwgIDY0MzcxNzcxMyk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDVdLCAgNSwgLTcwMTU1ODY5MSk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTBdLCAgOSwgIDM4MDE2MDgzKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgOV0sICA1LCAgNTY4NDQ2NDM4KTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsxNF0sICA5LCAtMTAxOTgwMzY5MCk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDhdLCAyMCwgIDExNjM1MzE1MDEpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKzEzXSwgIDUsIC0xNDQ0NjgxNDY3KTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsgMl0sICA5LCAtNTE0MDM3ODQpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyA3XSwgMTQsICAxNzM1MzI4NDczKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyA1XSwgIDQsIC0zNzg1NTgpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krMTRdLCAyMywgLTM1MzA5NTU2KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgMV0sICA0LCAtMTUzMDk5MjA2MCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsxM10sICA0LCAgNjgxMjc5MTc0KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgMF0sIDExLCAtMzU4NTM3MjIyKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgM10sIDE2LCAtNzIyNTIxOTc5KTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgNl0sIDIzLCAgNzYwMjkxODkpO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyA5XSwgIDQsIC02NDAzNjQ0ODcpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKzEyXSwgMTEsIC00MjE4MTU4MzUpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xyXG5cclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgMF0sICA2LCAtMTk4NjMwODQ0KTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyA1XSwgMjEsIC01NzQzNDA1NSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krMTJdLCAgNiwgIDE3MDA0ODU1NzEpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsxMF0sIDE1LCAtMTA1MTUyMyk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDYsICAxODczMzEzMzU5KTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsxNV0sIDEwLCAtMzA2MTE3NDQpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsxM10sIDIxLCAgMTMwOTE1MTY0OSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDRdLCAgNiwgLTE0NTUyMzA3MCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKyAyXSwgMTUsICA3MTg3ODcyNTkpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xyXG5cclxuICAgICAgYSA9IChhICsgYWEpID4+PiAwO1xyXG4gICAgICBiID0gKGIgKyBiYikgPj4+IDA7XHJcbiAgICAgIGMgPSAoYyArIGNjKSA+Pj4gMDtcclxuICAgICAgZCA9IChkICsgZGQpID4+PiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjcnlwdC5lbmRpYW4oW2EsIGIsIGMsIGRdKTtcclxuICB9O1xyXG5cclxuICAvLyBBdXhpbGlhcnkgZnVuY3Rpb25zXHJcbiAgbWQ1Ll9mZiAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGIgJiBjIHwgfmIgJiBkKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9nZyAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGIgJiBkIHwgYyAmIH5kKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9oaCAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGIgXiBjIF4gZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faWkgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChjIF4gKGIgfCB+ZCkpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuXHJcbiAgLy8gUGFja2FnZSBwcml2YXRlIGJsb2Nrc2l6ZVxyXG4gIG1kNS5fYmxvY2tzaXplID0gMTY7XHJcbiAgbWQ1Ll9kaWdlc3RzaXplID0gMTY7XHJcblxyXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIGlmIChtZXNzYWdlID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZSA9PT0gbnVsbClcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGFyZ3VtZW50ICcgKyBtZXNzYWdlKTtcclxuXHJcbiAgICB2YXIgZGlnZXN0Ynl0ZXMgPSBjcnlwdC53b3Jkc1RvQnl0ZXMobWQ1KG1lc3NhZ2UsIG9wdGlvbnMpKTtcclxuICAgIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuYXNCeXRlcyA/IGRpZ2VzdGJ5dGVzIDpcclxuICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMuYXNTdHJpbmcgPyBiaW4uYnl0ZXNUb1N0cmluZyhkaWdlc3RieXRlcykgOlxyXG4gICAgICAgIGNyeXB0LmJ5dGVzVG9IZXgoZGlnZXN0Ynl0ZXMpO1xyXG4gIH07XHJcblxyXG59KSgpO1xyXG4iLCJleHBvcnQgY29uc3QgcGFja2FnZU5hbWU6IHN0cmluZyA9ICdjb20uY29tMnVzLm5pbmVwYjNkLm5vcm1hbC5mcmVlZnVsbC5nb29nbGUuZ2xvYmFsLmFuZHJvaWQuY29tbW9uJztcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVllYXJNaW46IG51bWJlciA9IDIwMjM7XG5leHBvcnQgY29uc3Qgc2xlZXBTaG9ydDogbnVtYmVyID0gMTUwMDtcbmV4cG9ydCBjb25zdCBzbGVlcE1lZGl1bTogbnVtYmVyID0gMzAwMDtcbmV4cG9ydCBjb25zdCBzbGVlcExvbmc6IG51bWJlciA9IDQwMDA7XG5leHBvcnQgY29uc3Qgc2xlZXBXYWl0UGFnZUxvbmc6IG51bWJlciA9IDI0ICogMTAwMDtcbmV4cG9ydCBjb25zdCBzbGVlcEZvckFkOiBudW1iZXIgPSAzMCAqIDEwMDA7XG5leHBvcnQgY29uc3QgbWludXRlSW5NczogbnVtYmVyID0gNjAgKiAxMDAwO1xuZXhwb3J0IGNvbnN0IGhvdXJJbk1zOiBudW1iZXIgPSBtaW51dGVJbk1zICogNjA7XG5leHBvcnQgY29uc3QgZGF5SW5NczogbnVtYmVyID0gaG91ckluTXMgKiAyNDtcbmV4cG9ydCBjb25zdCBkdXJpbmdNYXhBZFJldHJ5OiBudW1iZXIgPSAzMDAwO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoV2FpdGluZ0xvZ2luUGFnZXNJbnRlcnZhbDogbnVtYmVyID0gMzAgKiBtaW51dGVJbk1zO1xuZXhwb3J0IGNvbnN0IHNlbmRSdW5uaW5nRXZlbnRJbnRlcnZhbDogbnVtYmVyID0gNSAqIG1pbnV0ZUluTXM7XG5leHBvcnQgY29uc3Qgc2VuZFdhaXRJbnB1dEV2ZW50SW50ZXJ2YWw6IG51bWJlciA9IDUgKiBtaW51dGVJbk1zO1xuZXhwb3J0IGNvbnN0IHVwbG9hZFNlc3Npb25JbnRlcnZhbDogbnVtYmVyID0gMSAqIGhvdXJJbk1zO1xuIiwiaW1wb3J0IHsgVXRpbHMsIFJvdXRlQ29uZmlnIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0IHsgcmVyb3V0ZXIsIENvbmZpZywgc3RhdGUgfSBmcm9tICcuL21vZHVsZXMnO1xuaW1wb3J0IHsgVEFTSywgd2Vla2x5TWlzc2lvbiwgc2V0dGluZyB9IGZyb20gJy4vdGFza3MnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4vY29uc3RhbnRzJztcblxuaW1wb3J0ICogYXMgUEFHRSBmcm9tICcuL3BhZ2VzJztcbmltcG9ydCB7IGlzU2FtZUNvbG9yLCBnZXRDb2xvckNvdW50SW5SYW5nZSwgaXNTYW1lQ29sb3JDb3VudCwgYXJyYXlGaW5kLCBTYXZlUGFnZVJlZmVyZW5jZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBWRVJTSU9OX0NPREU6IG51bWJlciA9IDE1LjM4O1xuXG5leHBvcnQgY2xhc3MgTUxCOUkge1xuICBwdWJsaWMgc3RhdGljIHBhY2thZ2VOYW1lOiBzdHJpbmcgPSAnY29tLmNvbTJ1cy5uaW5lcGIzZC5ub3JtYWwuZnJlZWZ1bGwuZ29vZ2xlLmdsb2JhbC5hbmRyb2lkLmNvbW1vbic7XG5cbiAgY29uc3RydWN0b3IoanNvbkNvbmZpZzogYW55KSB7XG4gICAgY29uc29sZS5sb2coJyMjIyMjIyMjIyMjIyBuZXcgTUxCOUkgIyMjIyMjIyMjIyMjJyk7XG4gICAgY29uc29sZS5sb2coYHNjcmlwdCB2ZXJzaW9uICR7VkVSU0lPTl9DT0RFfWApO1xuICAgIHN0YXRlLmluaXQoanNvbkNvbmZpZyk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnQoKSB7XG4gICAgaWYgKENvbmZpZy5jb25maWcuaXNMb2NhbFBhaWQpIHtcbiAgICAgIHZhciBwbGFuID0gZ2V0VXNlclBsYW4oKTtcbiAgICAgIGlmIChwbGFuICE9ICd1c2VyX3BsYW5fbWxiOWknKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1c2VyIHBsYW4gaWQ6ICcsIEpTT04uc3RyaW5naWZ5KHBsYW4pKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsZWFzZSBzdWJzY3JpYmUgcHJlbWl1bSBwbGFuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZXNBbmRUYXNrcygpO1xuICAgIHJlcm91dGVyLnN0YXJ0KE1MQjlJLnBhY2thZ2VOYW1lKTtcbiAgfVxuICBwdWJsaWMgc3RvcCgpIHtcbiAgICByZXJvdXRlci5zdG9wKCk7XG4gICAgc3RhdGUuZW5kKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzQW5kVGFza3MoKSB7XG4gICAgdGhpcy5hZGRSb3V0ZXMoKTtcbiAgICB0aGlzLmhhbmRsZVVua25vd24oKTtcbiAgICAvLyByZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpO1xuXG4gICAgaWYgKENvbmZpZy5jb25maWcuaXNMb2NhbFBhaWQgfHwgQ29uZmlnLmNvbmZpZy5pc0Rldikge1xuICAgICAgdGhpcy5hZGRQcmVtaXVtVGFza3MoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICAgIHRoaXMuYWRkQmFzaWNUYXNrcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIUNvbmZpZy5jb25maWcubGljZW5zZUlkKSB7XG4gICAgICBjb25zb2xlLmxvZygnbm8gbGljZW5zZSBpZCcpO1xuICAgICAgdGhpcy5hZGRTdGF5SW5Mb2dpblRhc2tzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hZGRQcmVtaXVtVGFza3MoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRCYXNpY1Rhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5wbGF5TGVhZ3VlR2FtZSxcbiAgICAgIC8vIG1heFRhc2tSdW5UaW1lczogMixcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLmhvdXJJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRQcmVtaXVtVGFza3MoKSB7XG4gICAgc2V0dGluZy5hZGRUYXNrKCk7XG5cbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0sucGxheUxlYWd1ZUdhbWUsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDIsXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIENvbmZpZy5jb25maWcuaXNSdW5QbGF5QmF0dGxlR2FtZSAmJlxuICAgICAgcmVyb3V0ZXIuYWRkVGFzayh7XG4gICAgICAgIG5hbWU6IFRBU0sucGxheUJhdHRsZUdhbWUsXG4gICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgICAgbWF4VGFza0R1cmluZzogMTAgKiBDT05TVEFOVFMuaG91ckluTXMsXG4gICAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgQ29uZmlnLmNvbmZpZy5pc1J1bldlZWtseU1pc3Npb24gJiYgd2Vla2x5TWlzc2lvbi5hZGRUYXNrKCk7XG4gICAgQ29uZmlnLmNvbmZpZy5pc1J1bkFkUmV3YXJkICYmXG4gICAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgICAgbmFtZTogVEFTSy5hZFJld2FyZCxcbiAgICAgICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgICAgICBtaW5Sb3VuZEludGVydmFsOiBDT05TVEFOVFMubWludXRlSW5NcyAqIDMwLFxuICAgICAgICBmaW5kUm91dGVEZWxheTogQ09OU1RBTlRTLnNsZWVwTWVkaXVtLFxuICAgICAgICBtYXhUYXNrRHVyaW5nOiBDT05TVEFOVFMuc2xlZXBGb3JBZCArIENPTlNUQU5UUy5kdXJpbmdNYXhBZFJldHJ5LFxuICAgICAgICBmb3JjZVN0b3A6IHRydWUsXG4gICAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5yZXN0YXJ0QXBwUGVyRGF5LFxuICAgICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgICAgbWluUm91bmRJbnRlcnZhbDogQ09OU1RBTlRTLmRheUluTXMsXG4gICAgICBiZWZvcmVSb3V0ZTogdGFzayA9PiB7XG4gICAgICAgIGlmICh0YXNrLmxhc3RSdW5UaW1lICE9PSAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3RhcnQgYXBwIHRhc2snKTtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgIH0sXG4gICAgICBtYXhUYXNrRHVyaW5nOiAzMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRTdGF5SW5Mb2dpblRhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5zdGF5SW5Mb2dpbixcbiAgICAgIGZvcmNlU3RvcDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzKCkge1xuICAgIC8vICoqIGxhdW5jaGluZyBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxvZ28ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubG9nbyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3YWl0IGFwcCBsb2FkaW5nIC4uLicpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcblxuICAgICAgICAvLyByZW9wZW4gaWYgc3R1Y2tcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKG5vdyAtIGNvbnRleHQubWF0Y2hTdGFydFRTID4gNSAqIENPTlNUQU5UUy5taW51dGVJbk1zKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0dWNrIGluIGxhdW5jaCBwYWdlIHRvbyBsb25nLCByZXN0YXJ0IGFwcCcpO1xuICAgICAgICAgIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sYW5kaW5nTG9hZGluZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sYW5kaW5nTG9hZGluZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oXyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsYW5kaW5nIGxvYWRpbmcuLi4nKTtcbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcbiAgICAgIH0pLFxuICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwTWVkaXVtLFxuICAgIH0pO1xuICAgIFtQQUdFLmRvd25sb2FkRGF0YSwgUEFHRS5wcm9ncmVzc0JhclJ1bm5pbmddLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiBDT05TVEFOVFMuc2xlZXBMb25nLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgW1BBR0UuVE9TLCBQQUdFLlRPUzkwLCBQQUdFLlRPUzkwdjJdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAqKiBsb2dpbiBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxhbmRpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGFuZGluZyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5vbkxvZ2luUGFnZSgpO1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0suc3RheUluTG9naW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLnN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIGhpdmUgbG9naW4gZm9yIGF2b2lkIGFwcCBjcnVzaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGFuZGluZyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxvZ2luU2VsZWN0V2F5fWAsXG4gICAgICBtYXRjaDogUEFHRS5sb2dpblNlbGVjdFdheSxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnN0YXlJbkxvZ2luKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubG9naW5TZWxlY3RXYXkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayB0aGUgZGlyZWN0aW9uIHRvIGdvIGJ5IHByZXZpb3VzIHBhZ2VcbiAgICAgICAgbGV0IGlzR29OZXh0ID0gdHJ1ZTtcbiAgICAgICAgc3dpdGNoIChjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aC5zdWJzdHJpbmcoMSkpIHtcbiAgICAgICAgICBjYXNlIFBBR0UubG9nSW5IaXZlLm5hbWU6XG4gICAgICAgICAgY2FzZSBQQUdFLmxvZ0luSGl2ZTkwLm5hbWU6XG4gICAgICAgICAgICBpc0dvTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0dvTmV4dCkge1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxvZ2luU2VsZWN0V2F5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygna2V5Y29kZSBiYWNrJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgW1BBR0UubG9nSW5IaXZlLCBQQUdFLmxvZ0luSGl2ZTkwXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IGNvbnRleHQgPT4ge1xuICAgICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG5lZWRVc2VySW5wdXQgPSBjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5zdGF5SW5Mb2dpbjtcbiAgICAgICAgICBzdGF0ZS5vbkxvZ2luUGFnZShuZWVkVXNlcklucHV0KTtcblxuICAgICAgICAgIGlmICghbmVlZFVzZXJJbnB1dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICAgIGtleWNvZGUoJ0JBQ0snLCAxMDApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2tleWNvZGUgYmFjaycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLnN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIGJhY2sgZm9yIGF2b2lkIHNlc3Npb24gZXhwaXJlZCcpO1xuICAgICAgICAgIGtleWNvZGUoJ0JBQ0snLCAxMDApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdrZXljb2RlIGJhY2snKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFtQQUdFLmZiTG9nSW45MCwgUEFHRS5nb29nbGVMb2dJbjkwXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246ICdrZXljb2RlQmFjaycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICoqIG1haW5cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5tYWluLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm1haW4sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc3QgdGFzayA9IGNvbnRleHQudGFzay5uYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXNrKTtcblxuICAgICAgICBzd2l0Y2ggKHRhc2spIHtcbiAgICAgICAgICBjYXNlIFRBU0suc3RheUluTG9naW46XG4gICAgICAgICAgICAvLyBzaG91bGQgYmUgaW5hY2Nlc3NpYmxlIHVubGVzcyBjbGVhciBzZXNzaW9uIGlzIGZhaWxlZFxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdEZWZhdWx0OlxuICAgICAgICAgIGNhc2UgVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzczpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5zZXR0aW5ncyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5sZWFndWVNb2RlKTtcbiAgICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cysrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlCYXR0bGVHYW1lOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmJhdHRsZU1vZGUpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFRBU0suYWRSZXdhcmQ6XG4gICAgICAgICAgICAvLyBzb21ldGltZXMgd29uJ3QgdHJpZ2dlciBhbnl0aGluZyBpZiBzdGlsbCBvbiBjZFxuICAgICAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA+IDIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkIGlzIHN0aWxsIG9uIGNkJyk7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmFkVGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgVEFTSy53ZWVrbHlNaXNzaW9uOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmFjaGlldmVtZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLm9uTG9naW5TdWNjZXNzKCk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vICoqIGdhbWUgc2V0dGluZ1xuICAgIHNldHRpbmcuYWRkUm91dGVzKCk7XG5cbiAgICAvLyAqKiBhZCByZXdhcmRcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hZFJld2FyZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oY29udGV4dCA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5hZFJld2FyZCkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmFkUmV3YXJkKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnd2F0Y2ggYWQnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuYWRSZXdhcmQpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBGb3JBZCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hZFJld2FyZFJlZGVlbS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZFJlZGVlbSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnYWQgcmV3YXJkIGdldCcpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5hZFJld2FyZFJlZGVlbSk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLmFkUmV3YXJkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmFkUmV3YXJkT25DRC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZE9uQ0QsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkIGlzIHN0aWxsIGNkJyk7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmFkUmV3YXJkT25DRCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLmFkUmV3YXJkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gKiogd2Vla2x5IG1pc3Npb25cbiAgICB3ZWVrbHlNaXNzaW9uLmFkZFJvdXRlcygpO1xuXG4gICAgLy8gKiogcGxheUJhdHRsZUdhbWVcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5iYXR0bGVNb2RlUGFuZWwubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYmF0dGxlTW9kZVBhbmVsLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmJhdHRsZU1vZGVQYW5lbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHBsYXkgb3RoZXIgbW9kZSB0b29cbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLmJhdHRsZU1vZGVQYW5lbEJ0bnMucmFua2VkQmF0dGxlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgcmFua2VkIGJhdHRsZScpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlUGFuZWwubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlUGFuZWwsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UucmFua2VkQmF0dGxlUGFuZWwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhbm5vdCBwbGF5XG4gICAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgPiA1KSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgcGxheSBpcyBhdmFpbGFibGVcbiAgICAgICAgY29uc3QgaXNQbGF5RGlzYWJsZWQgPSBpc1NhbWVDb2xvcihpbWFnZSwgUEFHRS5yYW5rZWRCYXR0bGVQYW5lbEJ0bnMuZGlzYWJsZWRQbGF5QnRuKTtcbiAgICAgICAgaWYgKGlzUGxheURpc2FibGVkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JhbmtlZCBiYXR0bGUgcGxheSBkaXNhYmxlZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnJhbmtlZEJhdHRsZVBhbmVsKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgcmFua2VkIGJhdHRsZSAoc2luZ2xlKScpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZVdhaXRUb1JlZnJlc2gubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncGxheSByYW5rIGdhbWUgZGlzYWJsZWQnKTtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8pO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgW1BBR0UucmFua2VkQmF0dGxlUmVzdWx0LCBQQUdFLnJhbmtlZEJhdHRsZVdlZWtseVJhbmtraW5nXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYXV0b0dhbWVDb25maXJtLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmF1dG9HYW1lQ29uZmlybSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5hdXRvR2FtZUNvbmZpcm0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5hdXRvR2FtZUNvbmZpcm0pO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYXV0b0dhbWVDb25maXJtRW5kLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmF1dG9HYW1lQ29uZmlybUVuZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5hdXRvR2FtZUNvbmZpcm1FbmQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5hdXRvR2FtZUNvbmZpcm1FbmQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlR2FtZUluZm8ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBbUEFHRS5yZWNoYXJnZUJhbGxSYW5rTW9kZSwgUEFHRS5yZWNoYXJnZUJhbGxMZWFndWVNb2RlXS5mb3JFYWNoKHAgPT5cbiAgICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgICAgcGF0aDogYC8ke3AubmFtZX1gLFxuICAgICAgICBtYXRjaDogcCxcbiAgICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICAgICAgY2FzZSBUQVNLLnBsYXlCYXR0bGVHYW1lOlxuICAgICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2Fubm90IGNvbnRpbnVlOiByZWNoYXJnZSBiYWxsIG5lZWRlZCcpO1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXJvdXRlci5nb0JhY2socCk7XG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gKiogcGxheUxlYWd1ZU1vZGVcbiAgICAvLyBlbnRlciBnYW1lIGluZm9cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVNb2RlUGFuZWwubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlTW9kZVBhbmVsLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU1vZGVQYW5lbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FuIHBsYXkgbGVhZ3VlIG1vZGVcbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzKys7XG5cbiAgICAgICAgLy8gYXZvaWQgdG8gY2xpY2sgYnRuIHRvbyBtYW55IHRpbWUgZm9yIHRyaWdnZXIgbmV4dCBwYWdlIGltbWVkaWF0ZWx5XG4gICAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgPCAyKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlTW9kZVBhbmVsKTtcbiAgICAgICAgfVxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVNb2RlR2FtZUluZm8ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlTW9kZUdhbWVJbmZvLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU1vZGVHYW1lSW5mbyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2NoZWNrIGVuZXJneScpO1xuICAgICAgICBjb25zdCBlbXB0eUVuZXJneSA9IHsgeDogNTUxLCB5OiAyODEsIHI6IDMsIGc6IDEyNCwgYjogMjEzIH07XG4gICAgICAgIGNvbnN0IGhhc0VuZXJneTAgPSBpc1NhbWVDb2xvcihpbWFnZSwgZW1wdHlFbmVyZ3ksIDAuOSk7XG4gICAgICAgIGlmIChoYXNFbmVyZ3kwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ25vIGVuZXJneScpO1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRpZ2l0MSA9IHsgeDogNTYxLCB5OiAyNzgsIHI6IDE2OSwgZzogMTcyLCBiOiAxNzkgfTtcbiAgICAgICAgY29uc3QgaGFzRW5lcmd5MTAgPSBpc1NhbWVDb2xvcihpbWFnZSwgZGlnaXQxKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhczEwRW5lcmd5OicsIGhhc0VuZXJneTEwKTtcblxuICAgICAgICAvLyB1c2UgcXVpY2sgcGxheSB3aGVuIGhhcyAxMCsgZW5lcmd5LFxuICAgICAgICAvLyBhbmQgc2xvdyBwbGF5IHdoZW4gaGFzIDEwLSBlbmVyZ3lcbiAgICAgICAgY29uc3QgcXVpY2tQbGF5T25CdG4gPSB7IHg6IDM3LCB5OiAyODQsIHI6IDMzLCBnOiAyNTUsIGI6IDE0MCB9O1xuICAgICAgICBjb25zdCBpc1F1aWNrUGxheU9uID0gaXNTYW1lQ29sb3IoaW1hZ2UsIHF1aWNrUGxheU9uQnRuKTtcblxuICAgICAgICBpZiAoaGFzRW5lcmd5MTAgJiYgIWlzUXVpY2tQbGF5T24pIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHF1aWNrUGxheU9uQnRuKTsgLy8gc2VsZWN0IHF1aWNrIHBsYXlcbiAgICAgICAgICBjb25zb2xlLmxvZygndHVybiBvbiBxdWljayBwbGF5Jyk7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNFbmVyZ3kxMCAmJiBpc1F1aWNrUGxheU9uKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChxdWlja1BsYXlPbkJ0bik7IC8vIGNhbmNlbCBxdWljayBwbGF5XG4gICAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gb2ZmIHF1aWNrIHBsYXknKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU1vZGVHYW1lSW5mbyk7IC8vIHBsYXkgYmFsbFxuICAgICAgICBjb25zb2xlLmxvZygncGxheSBsZWFndWUgbW9kZSBnYW1lJyk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgdGhpbmdzXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0UGxheVJvbGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0UGxheVJvbGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3QgcGxheSByb2xlJyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdFBsYXlSb2xlKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdFllYXIubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0WWVhcixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCB5ZWFyIHBhZ2UnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0WWVhcik7XG5cbiAgICAgICAgLy8gZ28gdG8gdGhlIG1pbiB5ZWFyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUJ1dHRvbiA9IHtcbiAgICAgICAgICB4OiBQQUdFLnNlbGVjdFllYXJCdG5zLnByZXZZZWFyLngsXG4gICAgICAgICAgeTogUEFHRS5zZWxlY3RZZWFyQnRucy5wcmV2WWVhci55LFxuICAgICAgICAgIHI6IDQ5LFxuICAgICAgICAgIGc6IDg1LFxuICAgICAgICAgIGI6IDEyMyxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgaXNOb3RNaW5ZZWFyID0gcmVyb3V0ZXIuc2NyZWVuLmlzU2FtZUNvbG9yKGFjdGl2ZUJ1dHRvbik7XG4gICAgICAgIGZvciAobGV0IHJlbWFpbkNsaWNrID0gMTI7IHJlbWFpbkNsaWNrID4gMCAmJiBpc05vdE1pblllYXI7IHJlbWFpbkNsaWNrLS0pIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0WWVhckJ0bnMucHJldlllYXIpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICBpc05vdE1pblllYXIgPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3IoYWN0aXZlQnV0dG9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHRoZSBkaWZmLCByZXR1cm4gdG8gcHJldiB5ZWFyXG4gICAgICAgIGZvciAodmFyIHllYXJEaWZmID0gQ29uZmlnLmNvbmZpZy5sZWFndWVZZWFyIC0gQ09OU1RBTlRTLmxlYWd1ZVllYXJNaW47IHllYXJEaWZmID4gMDsgeWVhckRpZmYtLSkge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RZZWFyQnRucy5uZXh0WWVhcik7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VibWl0IGNoYW5nZXNcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdFllYXJCdG5zLnN1Ym1pdCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdFNlYXNvbk1vZGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0U2Vhc29uTW9kZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCBzZWFzb24gcGFnZScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3RTZWFzb25Nb2RlKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2OCwgeTogMzMzIH0pOyAvLyBub3JtYWwgbW9kZVxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIC8vIFRPRE8gc3BsaXQgcGFnZVxuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMzMyLCB5OiAzMDEgfSk7IC8vIG5leHQgc2Vhc29uXG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50LFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IGxlYWd1ZSBnYW1lIGFtb3VudCBwYWdlJyk7XG4gICAgICAgIC8vIHVzZSBjb25maWcgdXNlciBzZXR0ZWQgdG8gc2VsZWN0IHdoaWNoIHRoZXkgd2FudCB0byBwbGF5XG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgaGFsZiwgcXVhcnRlciwgZnVsbCBoYXMgMiBuZXh0IHBhZ2VcbiAgICAgICAgc3dpdGNoIChDb25maWcuY29uZmlnLmxlYWd1ZVNlYXNvbk1vZGUpIHtcbiAgICAgICAgICBjYXNlICdmdWxsJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgZnVsbCBsZWFndWUnKTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50QnRucy5mdWxsKTtcbiAgICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiA1NjQsIHk6IDMyOCB9KTsgLy8gZ28gbmV4dFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaGFsZic6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0IDEvMiBsZWFndWUnKTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50QnRucy5oYWxmKTtcbiAgICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiA1NjQsIHk6IDMyOCB9KTsgLy8gZ28gbmV4dFxuICAgICAgICAgICAgLy8gPyB3aWxsIGdvIHRvIG9rIC8gbmV4dCBwYWdlc1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0IDEvNCBsZWFndWUnKTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50QnRucy5xdWFydGVyKTtcbiAgICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiA1NjQsIHk6IDMyOCB9KTsgLy8gZ28gbmV4dFxuICAgICAgICAgICAgLy8gPyB3aWxsIGdvIHRvIG9rIC8gbmV4dCBwYWdlc1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncG9zdFNlYXNvbic6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0IHBvc3RTZWFzb24nKTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50QnRucy5wb3N0KTtcbiAgICAgICAgICAgIC8vID8gd2lsbCBnbyB0byBvayAvIG5leHQgcGFnZXNcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiA1NjQsIHk6IDMyOCB9KTsgLy8gZ28gbmV4dFxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gc2Vhc29uIG5ldy8gZW5kXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubmV3U2Vhc29uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm5ld1NlYXNvbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmVuZFNlYXNvbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5lbmRTZWFzb24sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5lbmRTZWFzb25Qcm9jZWVkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmVuZFNlYXNvblByb2NlZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBlbmQgc2Vhc29uIHByb2NlZWQnKTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDE4MiwgeTogMTc4IH0pOyAvLyB0YXAgbmV3IHNlYXNvbiBvZiBsZWZ0XG4gICAgICAgIC8vIHdpbGwgZ28gdG8gZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5lbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IG5vcm1hbCAvIG1hc3RlciBtb2RlJyk7XG5cbiAgICAgICAgLy8gaWYgY2Fubm90IHNlbGVjdCBtYXN0ZXIgbW9kZSwgYXQgbGVhc3Qgc2VsZWN0IG5vcm1hbCBtb2RlXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlQnRucy5ub3JtYWwpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlQnRucy5tYXN0ZXIpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIC8vIHdoZXRoZXIgY2hvb3NlIGFueSBtb2RlLCB3aWxsIGp1bXAgdG8gcHJvY2VlZCBwYWdlXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXNldERpYWxvZ1lOLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSByZXNldCBsZWFndWUgZGlhbG9nIHdpdGggeWVzL25vJyk7XG5cbiAgICAgICAgLy8gVE9ETzogbGV0IHVzZXIgY2hvb3NlIGluIGNvbmZpZ1xuICAgICAgICBpZiAoY29udGV4dC5sYXN0TWF0Y2hlZFBhdGggPT09IGAvJHtQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVQcm9jZWVkLm5hbWV9YCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXNldCBsZWFndWUgbW9kZScpO1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdCByZXNldFxuICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVSZXNldERpYWxvZ1lOKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlUmVzZXREaWFsb2cubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmVzZXREaWFsb2csXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzKSB7XG4gICAgICAgICAgLy8gY2FuY2VsXG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlUmVzZXREaWFsb2cpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHJlc2V0IGxlYWd1ZSBkaWFsb2cnKTtcbiAgICAgICAgLy8gVE9ETzogbGV0IHVzZXIgY2FuIHNlbGVjdCBzcGVjaWZpYyBtb2RlIGFuZCB5ZWFyIHRvIHBsYXlcbiAgICAgICAgLy8gcmVzZXRcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlUmVzZXREaWFsb2cpO1xuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVNb2RlVW5leHBlY3RlZEVycm9yLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IsXG4gICAgICBhY3Rpb246IChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNvbWV0aW1lcyBzb21lIHVua25vd24gcmVhc29uIGNhbm5vdCBlbnRlciBnYW1lXG4gICAgICAgICAgICBjb25zdCB7IHRyeUVudGVyR2FtZUNudHMgfSA9IHN0YXRlLmxlYWd1ZUdhbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJ5IGVudGVyIGdhbWUgY250cycsIHRyeUVudGVyR2FtZUNudHMpO1xuICAgICAgICAgICAgaWYgKHRyeUVudGVyR2FtZUNudHMgPT09IDMpIHtcbiAgICAgICAgICAgICAgcmVyb3V0ZXIucmVzdGFydEFwcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyeUVudGVyR2FtZUNudHMgPiAzKSB7XG4gICAgICAgICAgICAgIC8vIGNhbiBvbmx5IHJlc29sdmVkIGJ5IHJlc2V0dGluZyBsZWFndWUgbW9kZSBwcm9ncmVzc1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlUmVzZXRMZWFndWVNb2RlUHJvZ3Jlc3MnKTtcblxuICAgICAgICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVNb2RlVW5leHBlY3RlZEVycm9yKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBvdGhlclxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVMaW5lVXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZUxpbmVVcCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnBsYXllckdyb3d0aENvbXBsZXRlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnBsYXllckdyb3d0aENvbXBsZXRlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucGl0Y2hlck9mVGhlTW9udGgubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucGl0Y2hlck9mVGhlTW9udGgsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5tdnAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubXZwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGVNdnBQYWdlJyk7XG4gICAgICAgIGNvbnN0IG9rQnRuID0geyB4OiA1NjgsIHk6IDMyMCwgcjogNTIsIGc6IDEyMCwgYjogMjEwIH07XG4gICAgICAgIGxldCBpc09rQnRuT25TY3JlZW4gPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3Iob2tCdG4pO1xuXG4gICAgICAgIC8vIG9rIGJ1dHRvbiBzdGlsbCBvbiB0aGUgc2NyZWVuXG4gICAgICAgIGZvciAodmFyIG1heE9rQnV0dG9uUmVtYWluID0gMTA7IGlzT2tCdG5PblNjcmVlbiAmJiBtYXhPa0J1dHRvblJlbWFpbiA+IDA7IG1heE9rQnV0dG9uUmVtYWluLS0pIHtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5tdnApOyAvLyBva1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgICAgaXNPa0J0bk9uU2NyZWVuID0gcmVyb3V0ZXIuc2NyZWVuLmlzU2FtZUNvbG9yKG9rQnRuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJld2FyZCBib251cyBwbGF5ZXIgcG9wdXBcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDMyMiwgeTogMzA5IH0pOyAvLyBjbGljayBuZXh0XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIGdhbWUgb3ZlclxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXN1bHQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJlc3VsdCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlCYXR0bGVHYW1lOlxuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb21wbGV0ZSBhIGdhbWUnKTtcbiAgICAgICAgICAgIGZpbmlzaFJvdW5kKCk7XG4gICAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5nYW1lUmVzdWx0KTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXN1bHRBcXVpcmVkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXN1bHRBcXVpcmVkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdFdvcmxkQ2hhbXBpb24ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJlc3VsdFdvcmxkQ2hhbXBpb24sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmVzdWx0T3RoZXIubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJlc3VsdE90aGVyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFwJyk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIGdhbWUgcmV3YXJkIHBhZ2VzXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJld2FyZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmV3YXJkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGVCb251c1BsYXllcixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmJlc3RQb3NpdGlvbkF3YXJkQm9udXNHcm91cC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5iZXN0UG9zaXRpb25Bd2FyZEJvbnVzR3JvdXAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5ib251c0dyYW50ZWRCeVRlYW1SZWNvcmQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYm9udXNHcmFudGVkQnlUZWFtUmVjb3JkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucG9zdFNlYXNvbkF3YXJkQm9udXMubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucG9zdFNlYXNvbkF3YXJkQm9udXMsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXIubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGVTZWxlY3RSZXdhcmRQbGF5ZXInKTtcbiAgICAgICAgbGV0IGJlc3RDYXJkUmFuayA9IC0xO1xuICAgICAgICBsZXQgYmVzdENhcmRQb3MgPSBQQUdFLnNlbGVjdFJld2FyZFBsYXllckJ0bnNbMF07XG5cbiAgICAgICAgZm9yIChjb25zdCBwb3Mgb2YgUEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXJCdG5zKSB7XG4gICAgICAgICAgY29uc3QgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWFnZSwgcG9zLngsIHBvcy55KTtcbiAgICAgICAgICBjb25zdCBrID0gcmdiLnIgKyAnLScgKyByZ2IuZyArICctJyArIHJnYi5iO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHBvcy54LCBwb3MueSwgayk7XG4gICAgICAgICAgLy8gc2VsZWN0IGlmIG5vdCBpbiBiYXNpYyB0eXBlXG4gICAgICAgICAgY29uc3QgcmFuayA9IFBBR0UucGxheWVyQ2FyZENvbG9yVG9SYW5rW2tdID8/IDU7XG4gICAgICAgICAgaWYgKHJhbmsgPiBiZXN0Q2FyZFJhbmspIHtcbiAgICAgICAgICAgIGJlc3RDYXJkUmFuayA9IHJhbms7XG4gICAgICAgICAgICBiZXN0Q2FyZFBvcyA9IHBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKGJlc3RDYXJkUG9zKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCcsIGJlc3RDYXJkUG9zLngsIGJlc3RDYXJkUG9zLnkpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdFJld2FyZFBsYXllcik7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIG9uIHBsYXkgcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5vblF1aWNrUGxheUdyb3VwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm9uUXVpY2tQbGF5R3JvdXAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ29uIHF1aWNrIHBsYXlpbmcnKTtcblxuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICAvLyBzdWNjZXNzIGVudGVyIGdhbWVcbiAgICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLm9uUnVubmluZyh0cnVlKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uub25RdWlja1BsYXlHcm91cCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5vblF1aWNrUGxheVBhdXNlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm9uUXVpY2tQbGF5UGF1c2UsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5vblBsYXlQb3dlclNhdmVPbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5vblBsYXlQb3dlclNhdmVPbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICAvLyB0aGlzIGlzIHNoYXJlIGJldHdlZW4gYWxsIG1vZGVcbiAgICAgICAgbGV0IGlzT25QbGF5VGFzayA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlCYXR0bGVHYW1lOlxuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgIGlzT25QbGF5VGFzayA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUgfHwgIWlzT25QbGF5VGFzayB8fCByZXJvdXRlci5pc1BhZ2VNYXRjaChQQUdFLnBvd2VyU2F2aW5nKSkge1xuICAgICAgICAgIHRoaXMuaGFuZGxlUG93ZXJTYXZpbmdQYWdlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgeyBsYXN0Q2hlY2tQb3dlclNhdmVBdDogbGFzdENoZWNrVGltZUF0LCBwb3dlclNhdmVDb2xvckNvdW50OiBjb2xvckNvdW50IH0gPSBzdGF0ZS5sZWFndWVHYW1lO1xuICAgICAgICBpZiAobm93IC0gbGFzdENoZWNrVGltZUF0IDwgQ09OU1RBTlRTLnNlbmRSdW5uaW5nRXZlbnRJbnRlcnZhbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVzZSB0aW1lIHRvIGNoZWNrIHdoZXRoZXIgZ2FtZSBpcyBzdGlsbCBwbGF5aW5nXG4gICAgICAgIGNvbnN0IGNvbG9yQ250Tm93ID0gZ2V0Q29sb3JDb3VudEluUmFuZ2UoaW1hZ2UsIHsgeDogMzMxLCB5OiAzMTAgfSwgeyB4OiA0MDMsIHk6IDMxMSB9KTtcbiAgICAgICAgY29uc3QgaXNTYW1lID0gaXNTYW1lQ29sb3JDb3VudChjb2xvckNudE5vdywgY29sb3JDb3VudCk7XG5cbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5sYXN0Q2hlY2tQb3dlclNhdmVBdCA9IG5vdztcbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5wb3dlclNhdmVDb2xvckNvdW50ID0gY29sb3JDbnROb3c7XG5cbiAgICAgICAgaWYgKCFpc1NhbWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZ2FtZSBpcyBzdGlsbCBwbGF5aW5nIHdpdGggcG93ZXIgc2F2ZSBvbicpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGlzIHN0dWNrJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZHcm91cHMubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmR3JvdXBzLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIC8vIHBhZ2Ugd2lsbCBiZSBzdG9wcGVkIGhlcmUgaW4gYW55IHRhc2tzXG4gICAgICAgIC8vIG5lZWQgdG8gaGFuZGxlIGltbWVkaWF0ZWx5IGlmIG1hdGNoXG4gICAgICAgIGZvciAoY29uc3QgcGFnZU9yR3JvdXAgb2YgbWF0Y2hlZCkge1xuICAgICAgICAgIGlmIChwYWdlT3JHcm91cC5uYW1lID09PSBQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZlN0b3BwZWQubmFtZSkge1xuICAgICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmU3RvcHBlZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICAvLyB0dXJuIG9mZiBhdXRvcGxheSB0byByZXR1cm5cbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmYpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VjY2VzcyBlbnRlciBnYW1lXG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cyA9IDA7XG5cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIHF1aWNrIHN3aXRjaCB0byBhdXRvIHBsYXkgb2ZmIGlmIHdhcyBzdG9wcGVkXG4gICAgICAgIGlmIChDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gb24gcG93ZXIgc2F2ZSBwbGF5Jyk7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmKTtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMCwgeTogMCB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcCcpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICAvLyBvcGVuIHBhdXNlIHBhbmVsXG4gICAgICAgICAga2V5Y29kZSgnS0VZQ09ERV9CQUNLJywgMTAwKTtcbiAgICAgICAgICAvLyByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygndHVybiBvbiBhdXRvIHBsYXknKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU9uUGxheVBhdXNlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU9uUGxheVBhdXNlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIG9wZW4gcGF1c2UgcGFuZWxcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVPblBsYXlQYXVzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRpbnVlIHBsYXlcbiAgICAgICAga2V5Y29kZSgnS0VZQ09ERV9CQUNLJywgMTAwKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcCBiYWNrIHRvIHN0YXkgaW4gZ2FtZScpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlQ29udGludWVQbGF5aW5nLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZUNvbnRpbnVlUGxheWluZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuXG4gICAgLy8gKiogZ2VuZXJhbCBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnBvd2VyU2F2aW5nLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnBvd2VyU2F2aW5nLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlUG93ZXJTYXZpbmdQYWdlKCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBbUEFHRS5lcnJvck5ld1VwZGF0ZUF2YWlsYWJsZSwgUEFHRS5hcHBJc05vdFJlc3BvbmRpbmddLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgICAgIGFmdGVyQWN0aW9uRGVsYXk6IENPTlNUQU5UUy5zbGVlcFdhaXRQYWdlTG9uZyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgW1xuICAgICAgUEFHRS51bmV4cGVjdGVkRXJyb3IsXG4gICAgICBQQUdFLnJldmlld0FwcCxcbiAgICAgIFBBR0UuZGFpbHlQcm9tb3Rpb24sXG4gICAgICBQQUdFLnByb21vdGlvbjEsXG4gICAgICBQQUdFLnByb21vdGlvbjIsXG4gICAgICBQQUdFLnByb21vdGlvbjMsXG4gICAgICBQQUdFLnJlY2hhcmdlUHJvbW90aW9uLFxuICAgICAgUEFHRS50ZWFtU3VwcG9ydFBhY2thZ2VQcm9tb3Rpb24sXG4gICAgICBQQUdFLmVudGVyR2FtZVByb21vdGlvbixcbiAgICAgIFBBR0UuZXZlbnQsXG4gICAgICBQQUdFLm9rLFxuICAgICAgUEFHRS5uZXh0LFxuICAgICAgUEFHRS5jb25maXJtV2l0aFlTLFxuICAgICAgUEFHRS5xdWl0QXBwLFxuICAgICAgUEFHRS5xdWl0QXBwMSxcbiAgICBdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlVW5rbm93bigpIHtcbiAgICByZXJvdXRlci5hZGRVbmtub3duQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgIC8vIHJlcm91dGVyLmdldEN1cnJlbnRNYXRjaE5hbWVzKCk7XG4gICAgICBjb25zdCBsYXN0TWF0Y2hlZFBhdGggPSBjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aC5zdWJzdHJpbmcoMSk7XG4gICAgICBVdGlscy5sb2coYHVua25vd24gY291bnQgJHtjb250ZXh0Lm1hdGNoVGltZXN9LCBkdXJpbmcgJHtjb250ZXh0Lm1hdGNoRHVyaW5nfSwgbGFzdCBtYXRjaGVkOiAke2xhc3RNYXRjaGVkUGF0aH1gKTtcbiAgICAgIGNvbnN0IGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gICAgICBpZiAoIWlzSW5BcHApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25vdCBpbiBhcHAnKTtcbiAgICAgICAgaWYgKENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdE1hdGNoZWRQYXRoID09PSBQQUdFLmFkUmV3YXJkLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ2xvc2VBZCgpO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgIGNhc2UgVEFTSy5wbGF5QmF0dGxlR2FtZTpcbiAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLm1pbnV0ZUluTXMgKiAyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbWlnaHQgYmUgaW4gcGxheWluZyBhbmltYXRpb24nKTtcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhcCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmlzV2FpdGluZ0xvZ2luKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3YWl0IHVzZXIgaW5wdXQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMCwgeTogMCB9KTtcbiAgICAgIGNvbnNvbGUubG9nKCd0YXAnKTtcblxuICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyAlIDExID09PSAwKSB7XG4gICAgICAgIGtleWNvZGUoJ0tFWUNPREVfQkFDSycsIDEwMCk7XG4gICAgICAgIFV0aWxzLmxvZygna2V5Y29kZSBiYWNrIGZvciB1bmtub3duJyk7XG4gICAgICB9XG4gICAgICBpZiAoY29udGV4dC5tYXRjaER1cmluZyA+IENPTlNUQU5UUy5taW51dGVJbk1zICogMzApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0dWNrIGluIHVua25vd24gcGFnZSBtb3JlIHRoYW4gMzAgbWluJyk7XG4gICAgICAgIENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUgJiYgcmVyb3V0ZXIucmVzdGFydEFwcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZUNsb3NlQWQoKSB7XG4gICAgY29uc29sZS5sb2coJ3RyeSBjbG9zZSBhZCcpO1xuICAgIGtleWNvZGUoJ0JBQ0snLCAxMDApO1xuICAgIGNvbnNvbGUubG9nKCdrZXkgY29kZSBiYWNrJyk7XG4gICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICBpZiAocmVyb3V0ZXIuZ2V0Q3VycmVudE1hdGNoTmFtZXMoKS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB0cnkgdGFwIGNsb3NlIGJ0blxuICAgIGZvciAoY29uc3QgY2xvc2VCdG4gb2YgW1xuICAgICAgLy8gcmlnaHRcbiAgICAgIHsgeDogNjIyLCB5OiAxOSB9LFxuXG4gICAgICAvLyBsZWZ0XG4gICAgICB7IHg6IDgsIHk6IDE1IH0sXG4gICAgXSkge1xuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChjbG9zZUJ0bik7XG4gICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBoYW5kbGVQb3dlclNhdmluZ1BhZ2UoKSB7XG4gICAgY29uc29sZS5sb2coJ2hhbmRsZVBvd2VyU2F2aW5nUGFnZScpO1xuICAgIHJlcm91dGVyLnNjcmVlbi50YXBEb3duKHsgeDogMTAwLCB5OiAxODAgfSk7XG4gICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICByZXJvdXRlci5zY3JlZW4ubW92ZVRvKHsgeDogNTAwLCB5OiAxODAgfSk7XG4gICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICByZXJvdXRlci5zY3JlZW4udGFwVXAoeyB4OiA1MDAsIHk6IDE4MCB9KTtcbiAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICB9XG5cbiAgcHVibGljIHdyYXBSb3V0ZUFjdGlvbihhY3Rpb246IFJvdXRlQ29uZmlnWydhY3Rpb24nXSk6IFJvdXRlQ29uZmlnWydhY3Rpb24nXSB7XG4gICAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCd3cmFwUm91dGVBY3Rpb24nLCBjb250ZXh0LnRhc2submFtZSwgbWF0Y2hlZFswXS5uYW1lKTtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGFjdGlvbihjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpO1xuICAgICAgfVxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ2dvTmV4dCcpIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KG1hdGNoZWRbMF0pO1xuICAgICAgfVxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ2dvQmFjaycpIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKG1hdGNoZWRbMF0pO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGxvYWQgc2Vzc2lvbiBpZiBuZWVkZWRcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjcmlwdENvbmZpZyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGxlYWd1ZVllYXJNaW4gfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgY29uc3QgY29uZmlnOiBTY3JpcHRDb25maWcgPSB7XG4gIGxlYWd1ZVNlYXNvbk1vZGU6ICdmdWxsJyxcbiAgbGVhZ3VlWWVhcjogbGVhZ3VlWWVhck1pbixcblxuICBpc1J1blBsYXlCYXR0bGVHYW1lOiB0cnVlLFxuICBpc1J1bkFkUmV3YXJkOiBmYWxzZSxcbiAgaXNSdW5XZWVrbHlNaXNzaW9uOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXQoanNvbkNvbmZpZzogYW55KSB7XG4gIGlmICh0eXBlb2YganNvbkNvbmZpZyAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjID0gSlNPTi5wYXJzZShqc29uQ29uZmlnKTtcbiAgY29uZmlnLmxlYWd1ZVNlYXNvbk1vZGUgPSBjLmxlYWd1ZVNlYXNvbk1vZGUgPz8gY29uZmlnLmxlYWd1ZVNlYXNvbk1vZGU7XG4gIGNvbmZpZy5sZWFndWVZZWFyID0gYy5sZWFndWVZZWFyID8/IGNvbmZpZy5sZWFndWVZZWFyO1xuXG4gIGNvbmZpZy54cm9ib3Rtb25TM0tleSA9IGMueHJvYm90bW9uUzNLZXkgPz8gY29uZmlnLnhyb2JvdG1vblMzS2V5O1xuICBjb25maWcueHJvYm90bW9uUzNUb2tlbiA9IGMueHJvYm90bW9uUzNUb2tlbiA/PyBjb25maWcueHJvYm90bW9uUzNUb2tlbjtcbiAgY29uZmlnLmFtYXpvbmF3c1MzS2V5ID0gYy5hbWF6b25hd3NTM0tleSA/PyBjb25maWcuYW1hem9uYXdzUzNLZXk7XG4gIGNvbmZpZy5hbWF6b25hd3NTM1Rva2VuID0gYy5hbWF6b25hd3NTM1Rva2VuID8/IGNvbmZpZy5hbWF6b25hd3NTM1Rva2VuO1xuICBjb25maWcubGljZW5zZUlkID0gYy5saWNlbnNlSWQgPz8gY29uZmlnLmxpY2Vuc2VJZDtcblxuICBjb25maWcuaXNDbG91ZCA9IGMuaXNDbG91ZCA/PyB0cnVlO1xuICBjb25maWcuaXNMb2NhbFBhaWQgPSBjLmlzTG9jYWxQYWlkID8/IGZhbHNlO1xuICBjb25maWcuaXNEZXYgPSBjLmlzRGV2ID8/IGZhbHNlO1xuICBjb25maWcuaGFzQ29vbEZlYXR1cmUgPSBjb25maWcuaXNDbG91ZCB8fCBjb25maWcuaXNMb2NhbFBhaWQgfHwgYy5pc0RldiB8fCBmYWxzZTtcblxuICBjb25maWcuaXNSdW5XZWVrbHlNaXNzaW9uID0gY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIChjLmlzUnVuV2Vla2x5TWlzc2lvbiA/PyBjb25maWcuaXNSdW5XZWVrbHlNaXNzaW9uKTtcbiAgY29uZmlnLmlzUnVuQWRSZXdhcmQgPSBjb25maWcuaGFzQ29vbEZlYXR1cmUgJiYgKGMuaXNSdW5BZFJld2FyZCA/PyBjb25maWcuaXNSdW5BZFJld2FyZCk7XG4gIGNvbmZpZy5pc1J1blBsYXlCYXR0bGVHYW1lID0gY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIChjLmlzUnVuUGxheUJhdHRsZUdhbWUgPz8gY29uZmlnLmlzUnVuUGxheUJhdHRsZUdhbWUpO1xufVxuIiwiaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxubGV0IGxhc3RSdW5uaW5nRXZlbnQ6IG51bWJlciA9IDA7XG5sZXQgbGFzdFNlbmRHYW1lU3RhdHVzRXZlbnRBdDogbnVtYmVyID0gMDtcbmxldCBjbnQgPSAwO1xuZW51bSBFdmVudE5hbWUge1xuICBSVU5OSU5HID0gJ3J1bm5pbmcnLFxuICBHQU1FX1NUQVRVUyA9ICdnYW1lU3RhdHVzJyxcbn1cbmVudW0gR2FtZVN0YXR1c0NvbnRlbnQge1xuICBXQUlUX0ZPUl9MT0dJTl9JTlBVVCA9ICd3YWl0LWZvci1pbnB1dCcsXG4gIExPR0lOX1NVQ0NFRURFRCA9ICdsb2dpbi1zdWNjZWVkZWQnLFxuICBMQVVOQ0hJTkcgPSAnbGF1bmNoaW5nJyxcbiAgUExBWUlORyA9ICdwbGF5aW5nJyxcbn1cbmNvbnN0IHByZWZpeCA9ICdbRXZlbnRdJztcblxuZXhwb3J0IGxldCBsYXN0R2FtZVN0YXR1c0V2ZW50OiBzdHJpbmcgPSAnJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luSW5wdXRpbmcoKSB7XG4gIGNudCsrO1xuICBjb25zb2xlLmxvZyhgbG9naW5JbnB1dGluZzogJHtjbnR9YCk7XG4gIGNvbnN0IGNvbnRlbnQgPSBHYW1lU3RhdHVzQ29udGVudC5XQUlUX0ZPUl9MT0dJTl9JTlBVVDtcbiAgcmV0dXJuIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MoKSB7XG4gIGlmIChsYXN0R2FtZVN0YXR1c0V2ZW50ICE9PSBHYW1lU3RhdHVzQ29udGVudC5XQUlUX0ZPUl9MT0dJTl9JTlBVVCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuTE9HSU5fU1VDQ0VFREVEO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhdW5jaGluZygpIHtcbiAgLy8gc2V0IHRvIGRlZmF1bHQgb25jZSBhcHAgaXMgbGF1bmNoZWQgKGZpcnN0IGFuZCBhZ2FpbilcbiAgbGFzdFJ1bm5pbmdFdmVudCA9IDA7XG4gIGNvbnN0IGNvbnRlbnQgPSBHYW1lU3RhdHVzQ29udGVudC5MQVVOQ0hJTkc7XG4gIHJldHVybiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGxheWluZygpIHtcbiAgY29uc3QgY29udGVudCA9IEdhbWVTdGF0dXNDb250ZW50LlBMQVlJTkc7XG4gIHJldHVybiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVubmluZyh1c2VJbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGlmICh1c2VJbnRlcnZhbCAmJiBub3cgLSBsYXN0UnVubmluZ0V2ZW50IDwgQ09OU1RBTlRTLnNlbmRSdW5uaW5nRXZlbnRJbnRlcnZhbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsYXN0UnVubmluZ0V2ZW50ID0gbm93O1xuICBzZW5kRXZlbnQoRXZlbnROYW1lLlJVTk5JTkcsICcnKTtcbiAgY29uc29sZS5sb2coYCR7cHJlZml4fSBydW5uaW5nYCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmIChsYXN0R2FtZVN0YXR1c0V2ZW50ID09PSBjb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gc2xlZXAgZm9yIHNlbmQgMSsgZXZlbnRzIGluIGEgc2hvcnQgdGltZVxuICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIGxhc3RTZW5kR2FtZVN0YXR1c0V2ZW50QXQ7XG4gIGlmIChkaWZmIDwgQ09OU1RBTlRTLnNsZWVwTWVkaXVtKSB7XG4gICAgVXRpbHMuc2xlZXAoZGlmZik7XG4gIH1cblxuICBsYXN0R2FtZVN0YXR1c0V2ZW50ID0gY29udGVudDtcbiAgc2VuZEV2ZW50KEV2ZW50TmFtZS5HQU1FX1NUQVRVUywgY29udGVudCk7XG4gIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gJHtjb250ZW50fWApO1xuICBsYXN0U2VuZEdhbWVTdGF0dXNFdmVudEF0ID0gRGF0ZS5ub3coKTtcbiAgcmV0dXJuIHRydWU7XG59XG4iLCJleHBvcnQgeyByZXJvdXRlciB9IGZyb20gJy4vcmVyb3V0ZXInO1xuZXhwb3J0ICogYXMgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmV4cG9ydCAqIGFzIHN0YXRlIGZyb20gJy4vc3RhdGUnO1xuIiwiaW1wb3J0IHsgcmVyb3V0ZXIgYXMgciB9IGZyb20gJ1Jlcm91dGVyJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5yLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0F1dG9TdG9wID0gdHJ1ZTtcbnIuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ0RlYnVnID0gZmFsc2U7XG5yLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5ID0gMTAwMDtcblxuLy8gaWYgbm90IHNldCBwYWNrYWdlTmFtZSBmaXJzdCwgY2Fubm90IGhhbmRsZSBzdGFydC8gc3RvcCBhcHBcbnIucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUgPSBDT05TVEFOVFMucGFja2FnZU5hbWU7XG5yLnJlcm91dGVyQ29uZmlnLnN0YXJ0QXBwRGVsYXkgPSAxMCAqIDEwMDA7XG5yLnJlcm91dGVyQ29uZmlnLnRhc2tEZWxheSA9IDUwMDtcblxuci5zY3JlZW5Db25maWcucm90YXRpb24gPSAnaG9yaXpvbnRhbCc7XG5yLnNjcmVlbkNvbmZpZy5kZXZIZWlnaHQgPSAzNjA7XG5yLnNjcmVlbkNvbmZpZy5kZXZXaWR0aCA9IDY0MDtcblxuZXhwb3J0IGxldCByZXJvdXRlciA9IHI7XG4iLCJpbXBvcnQgeyBkZWZhdWx0IGFzIE1ENSB9IGZyb20gJ21kNSc7XG5pbXBvcnQgeyBleGVjdXRlQ29tbWFuZHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyByZXJvdXRlciB9IGZyb20gJy4vcmVyb3V0ZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vIGFwcCBvcmlnaW4gaW5mb1xuY29uc3QgYXBwU2Vzc2lvblJvb3QgPSBgZGF0YS9kYXRhLyR7Q09OU1RBTlRTLnBhY2thZ2VOYW1lfWA7XG5jb25zdCBhcHBSZWNvcmRSb290ID0gYC9zZGNhcmQvQW5kcm9pZC9kYXRhLyR7Q09OU1RBTlRTLnBhY2thZ2VOYW1lfS9maWxlc2A7XG5cbi8vIGNhY2hlIGluZm9cbmNvbnN0IGxpY2Vuc2VGaWxlUGF0aDogc3RyaW5nID0gJy9zZGNhcmQvUm9ib3Rtb24vbGljZW5zZS50eHQnO1xuY29uc3Qgc2NyaXB0Q2FjaGVSb290ID0gJy9zZGNhcmQvUm9ib3Rtb24vbG9naW5DYWNoZSc7XG5jb25zdCBhbmRyb2lkSWRGaWxlUGF0aCA9IGAke3NjcmlwdENhY2hlUm9vdH0vYW5kcm9pZF9pZC50eHRgO1xuY29uc3QgZ2FtZVJlY29yZENhY2hlUm9vdCA9IGAke3NjcmlwdENhY2hlUm9vdH0vZ2FtZVJlY29yZGA7XG5cbi8vIGNsb3VkIGluZm9cbmNvbnN0IGVuZHBvaW50ID0gJ3MzLnJvYm90bW9uLmFwcDo5MDAwJztcbmNvbnN0IGJ1Y2tldCA9ICdtbGItcmVjb3JkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRTZXNzaW9uKCkge1xuICBpZiAoIWNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB7IGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGNvbnN0IGxhc3RMaWNlbnNlSWQgPSByZWFkRmlsZShsaWNlbnNlRmlsZVBhdGgpIHx8ICcnO1xuICB3cml0ZUZpbGUobGljZW5zZUZpbGVQYXRoLCBsaWNlbnNlSWQpO1xuICBjb25zb2xlLmxvZyhgbGFzdExpY2Vuc2VJZDogJHtsYXN0TGljZW5zZUlkfSwgY3VycmVudExpY2Vuc2VJZDogJHtsaWNlbnNlSWR9YCk7XG5cbiAgLy8gYWN0aW9ucyBiYXNlZCBvbiBsYXN0IGFuZCBjdXJyZW50IGxpY2Vuc2VJZFxuICBzd2l0Y2ggKGxpY2Vuc2VJZCkge1xuICAgIC8vIGVtcHR5IGxpY2Vuc2VJZFxuICAgIGNhc2UgJyc6XG4gICAgICBsb2dPdXQoKTtcbiAgICAgIHNsZWVwKDMwMDApO1xuICAgICAgYnJlYWs7XG5cbiAgICAvLyBoYXMgbGljZW5zZUlkXG4gICAgZGVmYXVsdDpcbiAgICAgIHN3aXRjaCAobGFzdExpY2Vuc2VJZCkge1xuICAgICAgICAvLyBlbXB0eSBsYXN0TGljZW5zZUlkXG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gc2FtZSBsaWNlbnNlSWRcbiAgICAgICAgY2FzZSBsaWNlbnNlSWQ6XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gZGlmZmVyZW50IGxpY2Vuc2VJZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGxvZ091dCgpO1xuICAgICAgICAgIHNsZWVwKDMwMDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNDbG91ZFNlc3Npb24gPSBmZXRjaFNlc3Npb24oKTtcbiAgICAgIGlmIChoYXNDbG91ZFNlc3Npb24pIHtcbiAgICAgICAgbG9nSW4oKTtcbiAgICAgICAgc2xlZXAoMzAwMCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIHJlc3RhcnQgYXBwIGlmIG5lZWRlZFxuICBsZXQgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgd2hpbGUgKCFpc0luQXBwKSB7XG4gICAgcmVyb3V0ZXIuc3RhcnRBcHAoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB9XG4gIHNsZWVwKDMwMDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kU2Vzc2lvbigpIHtcbiAgaWYgKCFjb25maWcuaXNDbG91ZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgeyBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuICBpZiAobGljZW5zZUlkKSB7XG4gICAgbG9nT3V0KCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgY29uc29sZS5sb2coJz09PT0gc3RvcCBzY3JpcHQ6IGhhcyBsaWNlbnNlSWQ7IGNsb3NlIGFwcCBhbmQgY2xlYXIgc2Vzc2lvbicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCc9PT09IHN0b3Agc2NyaXB0OiBubyBsaWNlbnNlSWQ7IG5vdCB0byBjbG9zZSBhcHAgZm9yIGxldCBuZXcgdXNlciBsb2dpbicpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRTZXNzaW9uKCkge1xuICBpZiAoIWNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB7IHhyb2JvdG1vblMzS2V5LCB4cm9ib3Rtb25TM1Rva2VuLCBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuXG4gIGlmICghKHhyb2JvdG1vblMzS2V5ICYmIHhyb2JvdG1vblMzVG9rZW4gJiYgbGljZW5zZUlkKSkge1xuICAgIGNvbnNvbGUubG9nKCdmYWlsZWQgdXBsb2FkOyByZXF1aXJlZCBrZXkgaXMgZW1wdHknKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zb2xlLmxvZyhgdXBsb2FkIHNlc3Npb24gJHtsaWNlbnNlSWR9IHN0YXJ0YCk7XG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICAvLyByZW1vdmUgdG1wIGZpbGUgcm9vdFxuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCxcbiAgICBgcm0gLWYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcblxuICAgIC8vIGNvcHkgbG9jYWwgc2Vzc2lvbiB0byB0bXAgZmlsZSByb290XG4gICAgYG1rZGlyIC1wICR7c2NyaXB0Q2FjaGVSb290fS9gLFxuICAgIGBjcCAtciAke2FwcFNlc3Npb25Sb290fS9maWxlcyAke3NjcmlwdENhY2hlUm9vdH0vYCxcbiAgICBgY3AgLXIgJHthcHBTZXNzaW9uUm9vdH0vc2hhcmVkX3ByZWZzICR7c2NyaXB0Q2FjaGVSb290fS9gXG4gICk7XG4gIGNvcHlHYW1lUmVjb3JkVG9DYWNoZSgpO1xuXG4gIC8vIGNvcHkgY3VycmVudCBhbmRyb2lkIGlkIHRvIHRtcCBmaWxlIHJvb3RcbiAgY29uc3QgYW5kcm9pZElkID0gZXhlY3V0ZSgnQU5EUk9JRF9EQVRBPS9kYXRhIHNldHRpbmdzIGdldCBzZWN1cmUgYW5kcm9pZF9pZCcpO1xuICBjb25zb2xlLmxvZyhgdXBsb2FkIGFuZHJvaWRJZDogJHthbmRyb2lkSWR9YCk7XG4gIHdyaXRlRmlsZShhbmRyb2lkSWRGaWxlUGF0aCwgYW5kcm9pZElkKTtcblxuICB0YXJneihgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCwgYCR7c2NyaXB0Q2FjaGVSb290fWApO1xuXG4gIC8vIHVwbG9hZCBzZXNzaW9uXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGNvbnN0IHNlc3Npb25GaWxlTmFtZSA9IGBsb2dpbkNhY2hlLyR7bGljZW5zZUlkfS5nemA7XG4gIGNvbnN0IHNpemVPckVycm9yID0gczNVcGxvYWRGaWxlKFxuICAgIGAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLFxuICAgIHNlc3Npb25GaWxlTmFtZSxcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICBlbmRwb2ludCxcbiAgICBidWNrZXQsXG4gICAgeHJvYm90bW9uUzNLZXksXG4gICAgeHJvYm90bW9uUzNUb2tlbixcbiAgICAnJyxcbiAgICBmYWxzZVxuICApO1xuICBjb25zb2xlLmxvZyhgdXBsb2FkIHNlc3Npb24gdG8gJHtlbmRwb2ludH0gZmluaXNoLiBzaXplT3JFcnJvciAke3NpemVPckVycm9yfTsgdXNlZFRpbWUgJHtEYXRlLm5vdygpIC0gbm93fWApO1xuXG4gIC8vIHJlbW92ZSB0bXAgZmlsZSByb290XG4gIGV4ZWN1dGVDb21tYW5kcyhgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fWAsIGBybSAtZiAke3NjcmlwdENhY2hlUm9vdH0uZ3pgKTtcbn1cblxuZnVuY3Rpb24gbG9nT3V0KCkge1xuICBjb25zb2xlLmxvZyhgZG8gbG9nb3V0YCk7XG4gIGxldCBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB3aGlsZSAoaXNJbkFwcCkge1xuICAgIHJlcm91dGVyLnN0b3BBcHAoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB9XG4gIGNvbnNvbGUubG9nKCdhcHAgaXMgc3RvcHBlZCwgY2xlYXIgc2Vzc2lvbiBzdGFydCcpO1xuICBjbGVhclNlc3Npb24oKTtcbiAgd3JpdGVGaWxlKGxpY2Vuc2VGaWxlUGF0aCwgJycpO1xufVxuZnVuY3Rpb24gbG9nSW4oKSB7XG4gIGxldCB7IGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGNvbnNvbGUubG9nKGBkbyBsb2dpbmApO1xuICBsZXQgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgd2hpbGUgKGlzSW5BcHApIHtcbiAgICByZXJvdXRlci5zdG9wQXBwKCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgfVxuICBjb25zb2xlLmxvZygnYXBwIGlzIHN0b3BwZWQsIHNldCBzZXNzaW9uIHN0YXJ0Jyk7XG4gIHNldFNlc3Npb24oKTtcbiAgd3JpdGVGaWxlKGxpY2Vuc2VGaWxlUGF0aCwgbGljZW5zZUlkKTtcbn1cblxuZnVuY3Rpb24gZmV0Y2hTZXNzaW9uKCk6IGJvb2xlYW4ge1xuICBsZXQgeyB4cm9ib3Rtb25TM0tleSwgeHJvYm90bW9uUzNUb2tlbiwgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcbiAgaWYgKCEoeHJvYm90bW9uUzNLZXkgJiYgeHJvYm90bW9uUzNUb2tlbiAmJiBsaWNlbnNlSWQpKSB7XG4gICAgY29uc29sZS5sb2coJ2ZldGNoIGZhaWxlZDogcmVxdWlyZWQga2V5IGlzIGVtcHR5Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc29sZS5sb2coYGZldGNoU2Vzc2lvbiBzdGFydCAke2xpY2Vuc2VJZH1gKTtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgLy8gcmVtb3ZlIG9sZCBmaWxlc1xuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCxcbiAgICBgcm0gLWYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcblxuICAgIC8vIGNyZWF0ZSB0bXAgZmlsZSByb290XG4gICAgYG1rZGlyIC1wICR7c2NyaXB0Q2FjaGVSb290fWBcbiAgKTtcblxuICBjb25zdCBzZXNzaW9uRmlsZU5hbWUgPSBgbG9naW5DYWNoZS8ke2xpY2Vuc2VJZH0uZ3pgO1xuICBjb25zdCByZXN1bHRPckVycm9yID0gczNEb3dubG9hZEZpbGUoYCR7c2NyaXB0Q2FjaGVSb290fS5nemAsIHNlc3Npb25GaWxlTmFtZSwgZW5kcG9pbnQsIGJ1Y2tldCwgeHJvYm90bW9uUzNLZXksIHhyb2JvdG1vblMzVG9rZW4sICcnLCBmYWxzZSk7XG4gIGlmIChyZXN1bHRPckVycm9yICE9PSB0cnVlKSB7XG4gICAgY29uc29sZS5sb2coYGZldGNoU2Vzc2lvbiBmYWlsZWQgJHtyZXN1bHRPckVycm9yfWApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zb2xlLmxvZyhgRG93bmxvYWQgc2Vzc2lvbiBmcm9tICR7ZW5kcG9pbnR9IGZpbmlzaC4gdXNlZFRpbWVgLCBEYXRlLm5vdygpIC0gbm93LCBsaWNlbnNlSWQsIHJlc3VsdE9yRXJyb3IpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2V0U2Vzc2lvbigpIHtcbiAgLy8gY2xlYXIgYXBwIHNlc3Npb24gdG8gYXZvaWQgY2Fubm90IG92ZXJ3cml0ZVxuICBjb25zdCBnYW1lUmVjb3JkRmlsZU5hbWUgPSBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKSB8fCAnTk9UX0VYSVNUX1JFQ09SRCc7XG4gIGV4ZWN1dGVDb21tYW5kcyhgcm0gLXJmICR7YXBwU2Vzc2lvblJvb3R9L2ZpbGVzYCwgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLCBgcm0gLXJmICR7YXBwUmVjb3JkUm9vdH0vJHtnYW1lUmVjb3JkRmlsZU5hbWV9YCk7XG5cbiAgLy8gdW50YXJneiBjbG91ZCBzZXNzaW9uIGFuZCBvdmVyd3JpdGUgYXBwIHNlc3Npb25cbiAgY29uc29sZS5sb2coYHNldCBzZXNzaW9uIHN0YXJ0YCk7XG4gIHVudGFyZ3ooYCR7c2NyaXB0Q2FjaGVSb290fS5nemApO1xuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgYGNwIC1yICR7c2NyaXB0Q2FjaGVSb290fS9maWxlcyAke2FwcFNlc3Npb25Sb290fS9gLFxuICAgIGBjcCAtciAke3NjcmlwdENhY2hlUm9vdH0vc2hhcmVkX3ByZWZzICR7YXBwU2Vzc2lvblJvb3R9L2AsXG4gICAgYGNwIC1yICR7c2NyaXB0Q2FjaGVSb290fS9nYW1lUmVjb3JkLyogJHthcHBSZWNvcmRSb290fS9gLFxuXG4gICAgYGNobW9kIC1SIDc3NyAke2FwcFNlc3Npb25Sb290fS9maWxlc2AsXG4gICAgYGNobW9kIC1SIDc3NyAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLFxuICAgIGBjaG1vZCAtUiA3NzcgJHthcHBSZWNvcmRSb290fWBcbiAgKTtcbiAgc2V0QW5kcm9pZElkKCdjbG91ZCcpO1xuICBjb25zb2xlLmxvZygnc2V0IHNlc3Npb24gZG9uZScpO1xuICBzbGVlcCgyMDAwKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJTZXNzaW9uKCkge1xuICBzZXRBbmRyb2lkSWQoJ3JhbmRvbScpO1xuICBjb25zdCBnYW1lUmVjb3JkRmlsZU5hbWUgPSBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKSB8fCAnTk9UX0VYSVNUX1JFQ09SRCc7XG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICBgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fS5nemAsXG4gICAgYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH1gLFxuXG4gICAgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9maWxlc2AsXG4gICAgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLFxuICAgIGBybSAtcmYgJHthcHBSZWNvcmRSb290fS8ke2dhbWVSZWNvcmRGaWxlTmFtZX1gXG4gICk7XG4gIGNvbnNvbGUubG9nKCdjbGVhciBzZXNzaW9uIGRvbmUnKTtcbiAgc2xlZXAoMjAwMCk7XG59XG5cbmZ1bmN0aW9uIHNldEFuZHJvaWRJZChzb3VyY2U6ICdyYW5kb20nIHwgJ2Nsb3VkJykge1xuICBsZXQgW29yaUFuZHJvaWRJZF0gPSBleGVjdXRlQ29tbWFuZHMoJ0FORFJPSURfREFUQT0vZGF0YSBzZXR0aW5ncyBnZXQgc2VjdXJlIGFuZHJvaWRfaWQnKTtcbiAgbGV0IGFuZHJvaWRJZCA9IE1ENShgJHtEYXRlLm5vdygpfSR7b3JpQW5kcm9pZElkfWApLnN1YnN0cmluZygwLCAxNik7XG4gIGlmIChzb3VyY2UgPT09ICdjbG91ZCcpIHtcbiAgICBhbmRyb2lkSWQgPSByZWFkRmlsZShhbmRyb2lkSWRGaWxlUGF0aCkgfHwgYW5kcm9pZElkO1xuICB9XG4gIGV4ZWN1dGVDb21tYW5kcygnQU5EUk9JRF9EQVRBPS9kYXRhIHNldHRpbmdzIHB1dCBzZWN1cmUgYW5kcm9pZF9pZCAnICsgYW5kcm9pZElkKTtcbiAgY29uc29sZS5sb2coJ29yaUFuZHJvaWRJZCcsIG9yaUFuZHJvaWRJZCk7XG4gIGNvbnNvbGUubG9nKCdzZXRBbmRyb2lkSWQnLCBhbmRyb2lkSWQpO1xufVxuXG5mdW5jdGlvbiBjb3B5R2FtZVJlY29yZFRvQ2FjaGUoKSB7XG4gIGNvbnN0IGZpbGVOYW1lID0gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCk7XG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZXhlY3V0ZUNvbW1hbmRzKGBta2RpciAtcCAke2dhbWVSZWNvcmRDYWNoZVJvb3R9YCwgYGNwIC1yICR7YXBwUmVjb3JkUm9vdH0vJHtmaWxlTmFtZX0gJHtnYW1lUmVjb3JkQ2FjaGVSb290fS8ke2ZpbGVOYW1lfS9gKTtcbn1cblxuZnVuY3Rpb24gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCkge1xuICBjb25zdCBmaWxlcyA9IGV4ZWN1dGVDb21tYW5kcyhgbHMgJHthcHBSZWNvcmRSb290fWApWzBdLnNwbGl0KCdcXG4nKTtcbiAgZm9yIChsZXQgZmlsZU5hbWUgb2YgZmlsZXMpIHtcbiAgICBpZiAoZmlsZU5hbWUubGVuZ3RoID09PSAzMikge1xuICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS50cmltKCk7XG4gICAgICBjb25zb2xlLmxvZyhgZ2FtZSByZWNvcmQgJHtmaWxlTmFtZX1gKTtcbiAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuIiwiaW1wb3J0IHsgcmVyb3V0ZXIgfSBmcm9tICcuL3Jlcm91dGVyJztcbmltcG9ydCAqIGFzIEV2ZW50U2VuZGVyIGZyb20gJy4vZXZlbnRTZW5kZXInO1xuaW1wb3J0ICogYXMgU2Vzc2lvbiBmcm9tICcuL3Nlc3Npb24nO1xuaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBleGVjdXRlQ29tbWFuZHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVHYW1lID0ge1xuICB0cnlFbnRlckdhbWVDbnRzOiAwLFxuICBuZWVkUmVzZXRQcm9ncmVzczogZmFsc2UsXG4gIGxhc3RDaGVja1Bvd2VyU2F2ZUF0OiAwLFxuICBwb3dlclNhdmVDb2xvckNvdW50OiB7fSxcbn07XG5leHBvcnQgbGV0IGlzV2FpdGluZ0xvZ2luID0gZmFsc2U7XG5sZXQgbGFzdFVwbG9hZFNlc3Npb25BdCA9IDA7XG5sZXQgaGFzU2Vzc2lvbiA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdChqc29uQ29uZmlnOiBhbnkpIHtcbiAgQ29uZmlnLnNldChqc29uQ29uZmlnKTtcbiAgcmVyb3V0ZXIuZGVidWcgPSBDb25maWcuY29uZmlnLmlzQ2xvdWQgfHwgQ29uZmlnLmNvbmZpZy5pc0RldiB8fCBmYWxzZTtcbiAgcmVyb3V0ZXIucmVyb3V0ZXJDb25maWcuYXV0b0xhdW5jaEFwcCA9IENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUgfHwgZmFsc2U7XG4gIGlmIChDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICBTZXNzaW9uLmluaXRTZXNzaW9uKCk7XG4gICAgZXhlY3V0ZUNvbW1hbmRzKCdwbSBkaXNhYmxlLXVzZXIgY29tLmFuZHJvaWQuaW5wdXRtZXRob2QubGF0aW4nKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kKCkge1xuICBpZiAoQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgU2Vzc2lvbi5lbmRTZXNzaW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uUnVubmluZyh1c2VJbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIChDb25maWcuY29uZmlnLmlzQ2xvdWQgPz8gQ29uZmlnLmNvbmZpZy5pc0RldikgJiYgRXZlbnRTZW5kZXIucnVubmluZyh1c2VJbnRlcnZhbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvZ2luUGFnZShuZWVkVXNlcklucHV0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgaGFzU2Vzc2lvbiA9IGZhbHNlO1xuICBpc1dhaXRpbmdMb2dpbiA9IHRydWU7XG4gIGlmICghKENvbmZpZy5jb25maWcuaXNDbG91ZCA/PyBDb25maWcuY29uZmlnLmlzRGV2KSkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyB1c2UgaW50ZXJ2YWwgaW4gcnVubmluZ1xuICBFdmVudFNlbmRlci5ydW5uaW5nKHRydWUpO1xuXG4gIGlmIChuZWVkVXNlcklucHV0KSB7XG4gICAgRXZlbnRTZW5kZXIubG9naW5JbnB1dGluZygpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvZ2luU3VjY2VzcygpIHtcbiAgaGFzU2Vzc2lvbiA9IHRydWU7XG4gIGlzV2FpdGluZ0xvZ2luID0gZmFsc2U7XG4gIGlmICghKENvbmZpZy5jb25maWcuaXNDbG91ZCA/PyBDb25maWcuY29uZmlnLmlzRGV2KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBFdmVudFNlbmRlci5sb2dpblN1Y2Nlc3MoKTtcbiAgRXZlbnRTZW5kZXIucGxheWluZygpO1xuICBFdmVudFNlbmRlci5ydW5uaW5nKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxhdW5jaGluZygpIHtcbiAgaGFzU2Vzc2lvbiA9IGZhbHNlO1xuICBsYXN0VXBsb2FkU2Vzc2lvbkF0ID0gMDtcbiAgbGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzID0gbGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzO1xuICBsZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzID0gZmFsc2U7XG4gIGxlYWd1ZUdhbWUubGFzdENoZWNrUG93ZXJTYXZlQXQgPSAwO1xuICBsZWFndWVHYW1lLnBvd2VyU2F2ZUNvbG9yQ291bnQgPSB7fTtcbiAgKENvbmZpZy5jb25maWcuaXNDbG91ZCA/PyBDb25maWcuY29uZmlnLmlzRGV2KSAmJiBFdmVudFNlbmRlci5sYXVuY2hpbmcoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVXBsb2FkU2Vzc2lvbigpIHtcbiAgLy8gb25seSB1cGxvYWQgc2Vzc2lvbiB3aGVuIGlzIHBsYXlpbmdcbiAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQgfHwgIWhhc1Nlc3Npb24pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgaWYgKG5vdyAtIGxhc3RVcGxvYWRTZXNzaW9uQXQgPCBDT05TVEFOVFMudXBsb2FkU2Vzc2lvbkludGVydmFsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxhc3RVcGxvYWRTZXNzaW9uQXQgPSBub3c7XG4gIGNvbnNvbGUubG9nKCd1cGxvYWQgc2Vzc2lvbicpO1xuICBTZXNzaW9uLnVwbG9hZFNlc3Npb24oKTtcbn1cbiIsImltcG9ydCB7IEdyb3VwUGFnZSwgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcblxuZXhwb3J0IGNvbnN0IGxvZ28gPSBuZXcgUGFnZShcbiAgJ2xvZ28nLFxuICBbXG4gICAgeyB4OiAyMjcsIHk6IDE4NCwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogMjU4LCB5OiAxODcsIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDI3OCwgeTogMTkwLCByOiAyMzIsIGc6IDQ4LCBiOiA3MiB9LFxuICAgIHsgeDogMjg1LCB5OiAxODMsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDMwMSwgeTogMTcyLCByOiAyMjksIGc6IDE5LCBiOiA0NiB9LFxuICAgIHsgeDogMzE2LCB5OiAxODcsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDMzNSwgeTogMTg4LCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiAzNzIsIHk6IDE4OCwgcjogMjUyLCBnOiAyMzMsIGI6IDIzNSB9LFxuICAgIHsgeDogMzc1LCB5OiAxNjksIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDM5NSwgeTogMTg0LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiAzOTgsIHk6IDE3MCwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogNDAzLCB5OiAxODYsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDExNywgeTogMTE0LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG5cbiAgICAvLyBsb2FkaW5nIG9uIGxlZnQgdG9wIGlmIHN0dWNrXG4gICAgLy8geyB4OiAyLCB5OiA1LCByOiAxNDIsIGc6IDIwOCwgYjogMjAyIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuLy8gdGVybSBvZiBzZXJ2aWNlXG5leHBvcnQgY29uc3QgVE9TID0gbmV3IFBhZ2UoXG4gICdUT1MnLFxuICBbXG4gICAgLy8gbG9nb1xuICAgIHsgeDogMjg5LCB5OiA0MCwgcjogMjMyLCBnOiA1MiwgYjogNzQgfSxcbiAgICB7IHg6IDI5MywgeTogMzQsIHI6IDIyOSwgZzogMjEsIGI6IDQ2IH0sXG4gICAgeyB4OiAyOTksIHk6IDM4LCByOiAyMjcsIGc6IDYsIGI6IDMzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDM3LCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMTMsIHk6IDM5LCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMjEsIHk6IDM3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjUsIHk6IDQyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzMsIHk6IDMzLCByOiAyNTIsIGc6IDIyMywgYjogMjI3IH0sXG4gICAgeyB4OiAzMzgsIHk6IDM4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNDIsIHk6IDM4LCByOiAyNDYsIGc6IDE3NiwgYjogMTg1IH0sXG4gICAgeyB4OiAzNDQsIHk6IDM3LCByOiAyNDYsIGc6IDE3NywgYjogMTg1IH0sXG4gICAgeyB4OiAzNDYsIHk6IDM2LCByOiAyMzQsIGc6IDY4LCBiOiA4OSB9LFxuICAgIHsgeDogMzM1LCB5OiAzNCwgcjogMjM0LCBnOiA2NywgYjogODcgfSxcbiAgICB7IHg6IDMzNSwgeTogMzcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM0NCwgeTogMzUsIHI6IDIyNywgZzogNiwgYjogMzMgfSxcblxuICAgIC8vIGNvcHlyaWdodFxuICAgIHsgeDogMjg5LCB5OiAzMzUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwMCwgeTogMzM2LCByOiAxOTQsIGc6IDE5NywgYjogMTk1IH0sXG4gICAgeyB4OiAzMDEsIHk6IDMzNiwgcjogMTg3LCBnOiAxOTIsIGI6IDE4OSB9LFxuICAgIHsgeDogMzA3LCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxMCwgeTogMzM2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDMzNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIzLCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMiwgeTogMzM2LCByOiAxODEsIGc6IDE4NiwgYjogMTgzIH0sXG4gICAgeyB4OiAzNDAsIHk6IDMzNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gYWdyZWUgYnRuIGJnXG4gICAgeyB4OiAxNywgeTogMjkzLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA1NCwgeTogMzA1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MiwgeTogMzE3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxMTEsIHk6IDMxNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjQzLCB5OiAyOTcsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDI1NSwgeTogMjkxLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA1OTksIHk6IDMwNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjEzLCB5OiAyOTUsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDYwMywgeTogMzE2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0MjEsIHk6IDMyMiwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuXG4gICAgLy8gYmcgY29ybmVyIG91dHNpZGVcbiAgICB7IHg6IDcyLCB5OiAzMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTExLCB5OiA0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTg2LCB5OiAzOSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTQsIHk6IDM0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjE5LCB5OiAzNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGJnIGNvcm5lciBpbnNpZGVcbiAgICB7IHg6IDIyLCB5OiA3NywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogMTAwLCB5OiA3NywgcjogMTk3LCBnOiAxOTcsIGI6IDE5NyB9LFxuICAgIHsgeDogMTgsIHk6IDI1MywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNjEzLCB5OiAyODYsIHI6IDIxNiwgZzogMjE2LCBiOiAyMTYgfSxcbiAgICB7IHg6IDYxMywgeTogODAsIHI6IDIxNSwgZzogMjE1LCBiOiAyMTUgfSxcbiAgICB7IHg6IDYwOSwgeTogNzMsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDMwNSwgeTogNzYsIHI6IDE4MywgZzogMTgzLCBiOiAxODMgfSxcbiAgICB7IHg6IDMwNCwgeTogMjkxLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDYgfSxcbiAgeyB4OiAzMjAsIHk6IDMwNiB9XG4pO1xuXG4vLyB0ZXJtIG9mIHNlcnZpY2UsIHN1aXQgZGdpOTBcbmV4cG9ydCBjb25zdCBUT1M5MCA9IG5ldyBQYWdlKFxuICAnVE9TOTAnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDMyLCB5OiAyOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTAsIHk6IDM0MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjIyLCB5OiAzNDMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYyMSwgeTogMzIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGxvZ29cbiAgICB7IHg6IDI4OCwgeTogMjcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwMSwgeTogMjcsIHI6IDI0NiwgZzogMTc3LCBiOiAxODUgfSxcbiAgICB7IHg6IDMyMSwgeTogMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMCwgeTogMjgsIHI6IDI0NSwgZzogMTYxLCBiOiAxNzEgfSxcbiAgICB7IHg6IDMzMCwgeTogMjgsIHI6IDIzMCwgZzogMzYsIGI6IDYwIH0sXG4gICAgeyB4OiAzNDQsIHk6IDI4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9XG4pO1xuXG4vLyBmb3IgZGdpOTAgYW5kIG5hdmkgYmFyIGlzIHNtYWxsZXJcbmV4cG9ydCBjb25zdCBUT1M5MHYyID0gbmV3IFBhZ2UoXG4gICdUT1M5MHYyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAyLCB5OiAyMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMSwgeTogNDIsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDEsIHk6IDMyNSwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNywgeTogMzQ4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MzEsIHk6IDM1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjI4LCB5OiAzMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYzMywgeTogMjkyLCByOiAyMTMsIGc6IDIxMywgYjogMjEzIH0sXG4gICAgeyB4OiA2MzAsIHk6IDQwLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA2MjgsIHk6IDIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBsb2dvXG4gICAgeyB4OiAyOTYsIHk6IDIxLCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMTYsIHk6IDI0LCByOiAyMjcsIGc6IDYsIGI6IDMzIH0sXG4gICAgeyB4OiAzNDAsIHk6IDIyLCByOiAyMzksIGc6IDExNSwgYjogMTMwIH0sXG4gIF0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9XG4pO1xuXG4vLyBsaWtlIGxhbmRpbmcgYnV0IGhhcyBwcm9ncmVzcyBiYXJcbmV4cG9ydCBjb25zdCBsYW5kaW5nTG9hZGluZyA9IG5ldyBQYWdlKFxuICAnbGFuZGluZ0xvYWRpbmcnLFxuICBbXG4gICAgLy8gbG9nbyBpbiBjZW50ZXJcbiAgICAvLyA5aW5uaW5nc1xuICAgIHsgeDogMjk1LCB5OiAyNDIsIHI6IDMwLCBnOiA1MCwgYjogODIgfSxcbiAgICB7IHg6IDI4MywgeTogMjIwLCByOiA2MCwgZzogNjksIGI6IDk0IH0sXG4gICAgeyB4OiAyOTIsIHk6IDIyMCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzAwLCB5OiAyMTUsIHI6IDIzNCwgZzogMjM1LCBiOiAyMzcgfSxcbiAgICB7IHg6IDM1MCwgeTogMjIwLCByOiAyNDQsIGc6IDIzNSwgYjogMjM3IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxhbmRpbmcgPSBuZXcgUGFnZShcbiAgJ2xhbmRpbmcnLFxuICBbXG4gICAgLy8gbG9nbyBpbiBjZW50ZXJcbiAgICB7IHg6IDI5NywgeTogMjQ2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyODEsIHk6IDI0NCwgcjogOCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzMDMsIHk6IDI0MywgcjogMjE5LCBnOiAxNDksIGI6IDE2NCB9LFxuXG4gICAgLy8gOWlubmluZ3NcbiAgICB7IHg6IDIxOCwgeTogMjY5LCByOiA4OCwgZzogOTksIGI6IDEzMCB9LFxuICAgIHsgeDogMjM5LCB5OiAyNzcsIHI6IDI2LCBnOiA0NSwgYjogNjUgfSxcbiAgICB7IHg6IDI3NCwgeTogMjc0LCByOiAyNSwgZzogNDEsIGI6IDc0IH0sXG4gICAgeyB4OiAzMTMsIHk6IDI3OCwgcjogMTM0LCBnOiAxNDMsIGI6IDE2MCB9LFxuICAgIHsgeDogMzI3LCB5OiAyODIsIHI6IDk5LCBnOiAxMDQsIGI6IDEyOCB9LFxuICAgIHsgeDogMzUwLCB5OiAyNjksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAyNTQsIHk6IDIwMCB9LCAvLyB0byBzZWxlY3QgbG9naW5cbiAgeyB4OiAyNTQsIHk6IDIwMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbG9naW5TZWxlY3RXYXkgPSBuZXcgUGFnZShcbiAgJ2xvZ2luU2VsZWN0V2F5JyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiA1MSwgeTogNzIsIHI6IDcsIGc6IDcsIGI6IDggfSxcbiAgICB7IHg6IDUzLCB5OiAzMDYsIHI6IDcsIGc6IDYsIGI6IDcgfSxcbiAgICB7IHg6IDYxOCwgeTogMzE1LCByOiA1LCBnOiA1LCBiOiA1IH0sXG5cbiAgICAvLyBnb29nbGUgYnRuXG4gICAgeyB4OiAxODAsIHk6IDIwMCwgcjogMjUxLCBnOiAxODgsIGI6IDUgfSxcbiAgICB7IHg6IDE4NSwgeTogMjA1LCByOiA5MiwgZzogMTg1LCBiOiAxMTYgfSxcbiAgICB7IHg6IDMwNywgeTogMjAyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBmYiBidG5cbiAgICB7IHg6IDMzNCwgeTogMjAxLCByOiAyMDUsIGc6IDIyNSwgYjogMjUyIH0sXG4gICAgeyB4OiAzMzMsIHk6IDIwMSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gICAgeyB4OiAzMzEsIHk6IDE5NywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gaGl2ZSBidG5cbiAgICB7IHg6IDE4MiwgeTogMjI4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxODUsIHk6IDIzNCwgcjogMjQwLCBnOiAyNDYsIGI6IDI1NSB9LFxuICAgIHsgeDogMzA3LCB5OiAyMzUsIHI6IDE4LCBnOiAxMTksIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDI0MywgeTogMjMyIH0sIC8vIGxvZ2luIGhpdmVcbiAgeyB4OiAyNDMsIHk6IDIzMiB9IC8vIGxvZ2luIGhpdmVcbik7XG5cbmV4cG9ydCBjb25zdCBsb2dJbkhpdmUgPSBuZXcgUGFnZShcbiAgJ2xvZ0luSGl2ZScsXG4gIFtcbiAgICB7IHg6IDIyNiwgeTogNzYsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDMyMiwgeTogNzgsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDUzNSwgeTogNDIsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDYyNCwgeTogNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDY2LCB5OiAzMzMsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDQ0LCB5OiAyMzUsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDEzNiwgeTogMjM2LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAyNTgsIHk6IDIzMiwgcjogMTQzLCBnOiAxODYsIGI6IDIyNyB9LFxuICAgIHsgeDogNTQ4LCB5OiAxNjksIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTgzLCB5OiAxOTUsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNDMsIHk6IDE0MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDMsIHk6IDE5NSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU1NCwgeTogMTc3IH0sIC8vIGxvZ2luXG4gIHsgeDogNTc0LCB5OiA0MCB9IC8vIGJhY2sgdG8gZ2FtZVxuKTtcblxuLy8gc3VpdCBmb3IgZHBpIDkwXG5leHBvcnQgY29uc3QgbG9nSW5IaXZlOTAgPSBuZXcgUGFnZShcbiAgJ2xvZ0luSGl2ZTkwJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMSwgeTogMTcxLCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAxMCwgeTogMzI2LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDEwNywgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNjI3LCB5OiAzMjYsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAzMTksIHk6IDcyLCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAzMzgsIHk6IDcxLCByOiAxNDgsIGc6IDE0OCwgYjogMTQ4IH0sXG4gICAgeyB4OiAzNzUsIHk6IDcxLCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG5cbiAgICAvLyBpbnB1dFxuICAgIHsgeDogNDgwLCB5OiAxNTUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ4MCwgeTogMTk5LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBsb2dpbiBidG5cbiAgICB7IHg6IDU1OCwgeTogMTYwLCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU4OSwgeTogMTc1LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDUzMiwgeTogMTYyLCByOiAxMTAsIGc6IDE3MSwgYjogMjI4IH0sXG4gIF0sXG4gIHsgeDogNTU0LCB5OiAxNzcgfSwgLy8gbG9naW5cbiAgeyB4OiA1NzQsIHk6IDQwIH0gLy8gYmFjayB0byBnYW1lXG4pO1xuXG5leHBvcnQgY29uc3QgZmJMb2dJbjkwID0gbmV3IFBhZ2UoJ2ZiTG9nSW45MCcsIFtcbiAgLy8gZmIgbG9nb1xuICB7IHg6IDMwNCwgeTogMTQsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDMxNiwgeTogMTcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMDksIHk6IDMxLCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMjUsIHk6IDMyLCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMzEsIHk6IDE1LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMjQsIHk6IDEyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzQ1LCB5OiAxMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMyMywgeTogMTksIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDMzMCwgeTogMjMsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuXG4gIC8vIGJnXG4gIHsgeDogNzMsIHk6IDEwMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDUyLCB5OiAyNjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMTIsIHk6IDMxNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDU5MSwgeTogMTk3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogNDkyLCB5OiA2MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMxOCwgeTogODYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAvLyBsb2dpbiBidG4gYmdcbiAgeyB4OiAyMDMsIHk6IDE5NCwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogNDMzLCB5OiAxOTcsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBnb29nbGVMb2dJbjkwID0gbmV3IFBhZ2UoJ2dvb2dsZUxvZ0luOTAnLCBbXG4gIC8vIGdvb2dsZSBsb2dvXG4gIHsgeDogMjk1LCB5OiA2NCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMwNiwgeTogNjcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMTgsIHk6IDY4LCByOiAyNTEsIGc6IDE4OCwgYjogNSB9LFxuICB7IHg6IDMyMSwgeTogNjgsIHI6IDI1MywgZzogMjIxLCBiOiAxMzAgfSxcbiAgeyB4OiAzMjksIHk6IDY4LCByOiA2NiwgZzogMTMzLCBiOiAyNDQgfSxcbiAgeyB4OiAzMzUsIHk6IDY4LCByOiAyMzQsIGc6IDY3LCBiOiA1MyB9LFxuXG4gIC8vIGJnXG4gIHsgeDogOTQsIHk6IDMzLCByOiA3NSwgZzogMTI5LCBiOiAyMTggfSxcbiAgeyB4OiA2NywgeTogMjI3LCByOiA3OSwgZzogMTMyLCBiOiAyMjEgfSxcbiAgeyB4OiAxNDIsIHk6IDMyOSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDU1OSwgeTogMzM4LCByOiA2MSwgZzogMTE0LCBiOiAyMDMgfSxcbiAgeyB4OiA1MzksIHk6IDgwLCByOiA2MywgZzogMTE3LCBiOiAyMDUgfSxcbiAgeyB4OiAzNTAsIHk6IDMzNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gIC8vIGxvZ2luIGJ0biBiZ1xuICB7IHg6IDQ3OCwgeTogMjI0LCByOiAyNiwgZzogMTE1LCBiOiAyMzIgfSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZG93bmxvYWREYXRhID0gbmV3IFBhZ2UoXG4gICdkb3dubG9hZERhdGEnLFxuICBbXG4gICAgeyB4OiAxMDMsIHk6IDQxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxNjcsIHk6IDU5LCByOiAyMiwgZzogMzAsIGI6IDMxIH0sXG4gICAgeyB4OiAxODgsIHk6IDU4LCByOiAzOSwgZzogNDcsIGI6IDQ3IH0sXG4gICAgeyB4OiAyMDAsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMDksIHk6IDYyLCByOiA4NCwgZzogODgsIGI6IDkyIH0sXG4gICAgeyB4OiAyMzYsIHk6IDU4LCByOiA1MCwgZzogNTYsIGI6IDU4IH0sXG4gICAgeyB4OiAyNDMsIHk6IDU4LCByOiAxNDQsIGc6IDE1MCwgYjogMTUyIH0sXG4gICAgeyB4OiAyOTAsIHk6IDU3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTcsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzNTUsIHk6IDU0LCByOiA5NywgZzogMTAxLCBiOiAxMDUgfSxcbiAgICB7IHg6IDQwNywgeTogNjAsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDUxMywgeTogNDgsIHI6IDE4MSwgZzogMTgyLCBiOiAxODggfSxcbiAgICB7IHg6IDUyNywgeTogNTQsIHI6IDE3NywgZzogMTc1LCBiOiAxNzcgfSxcbiAgICB7IHg6IDUxOSwgeTogNjAsIHI6IDE4MSwgZzogMTg1LCBiOiAxODkgfSxcbiAgICB7IHg6IDE2OCwgeTogMjk4LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAyMjQsIHk6IDI5NiwgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI0OSwgeTogMjk4LCByOiAxMDIsIGc6IDEzMywgYjogMTcxIH0sXG4gICAgeyB4OiAzOTEsIHk6IDI5OSwgcjogMTk1LCBnOiAyMjEsIGI6IDI1NSB9LFxuICAgIHsgeDogNDYxLCB5OiAzMDIsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQyMywgeTogMzAzLCByOiA4LCBnOiAxMDksIGI6IDI1NSB9LFxuICAgIHsgeDogNTI2LCB5OiAzMTgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiA0MjEsIHk6IDI5MyB9LFxuICB7IHg6IDQyMSwgeTogMjkzIH1cbik7XG5leHBvcnQgY29uc3QgcHJvZ3Jlc3NCYXJSdW5uaW5nID0gbmV3IFBhZ2UoXG4gICdwcm9ncmVzc0JhclJ1bm5pbmcnLFxuICBbXG4gICAgLy8gcHJvZ3Jlc3MgYmFyXG4gICAgeyB4OiAyMDcsIHk6IDMxNiwgcjogMCwgZzogMTUwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDE5LCB5OiAzMjAsIHI6IDgsIGc6IDEyLCBiOiAxNiB9LFxuICAgIHsgeDogNjI4LCB5OiAzMjAsIHI6IDgsIGc6IDEyLCBiOiAxNiB9LFxuICAgIHsgeDogMTk1LCB5OiAzMjksIHI6IDI1NSwgZzogMjAyLCBiOiAwIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG1haW4gPSBuZXcgUGFnZShcbiAgJ21haW4nLFxuICBbXG4gICAgLy8gbmF2aSBiYXIgcmlnaHRcbiAgICB7IHg6IDYyMiwgeTogOSwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTk4LCB5OiAxMSwgcjogMjE0LCBnOiAyMjYsIGI6IDIzOCB9LFxuICAgIHsgeDogNTkyLCB5OiAxNCwgcjogNzQsIGc6IDkzLCBiOiAxMjMgfSxcbiAgICB7IHg6IDQ5NCwgeTogMTUsIHI6IDIzOSwgZzogMTc5LCBiOiAyOCB9LFxuICAgIHsgeDogNTAzLCB5OiAxNywgcjogNzQsIGc6IDg0LCBiOiA5MCB9LFxuICAgIHsgeDogMzg5LCB5OiAxMiwgcjogMTk3LCBnOiAyMDIsIGI6IDE5NyB9LFxuICAgIHsgeDogMzEzLCB5OiAxMSwgcjogMTc0LCBnOiAxNzgsIGI6IDE3OSB9LFxuICAgIHsgeDogMjk3LCB5OiAxNSwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuXG4gICAgLy8gYnRuIGxlZnQsIHdpdGggc2V0dGluZ3NcbiAgICB7IHg6IDMxLCB5OiAzMjYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDg3LCB5OiAzMjYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEzNywgeTogMzI2LCByOiAxMDgsIGc6IDExNCwgYjogMTAwIH0sXG4gICAgeyB4OiAxODksIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjQzLCB5OiAzMjgsIHI6IDEyNiwgZzogMTI5LCBiOiAxMjYgfSxcbiAgICB7IHg6IDI5OSwgeTogMzI4LCByOiAxMDMsIGc6IDEwNywgYjogOTkgfSxcblxuICAgIC8vIGJ0biByaWdodFxuICAgIHsgeDogNTIzLCB5OiAzMzYsIHI6IDI1LCBnOiA3MywgYjogMTQwIH0sXG4gICAgeyB4OiA1NzksIHk6IDMzOCwgcjogOTAsIGc6IDI0LCBiOiAyNSB9LFxuICAgIHsgeDogNTk5LCB5OiAzMjksIHI6IDIzNywgZzogMjI0LCBiOiAyMjggfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbWFpbkJ0bnMgPSB7XG4gIGxlYWd1ZU1vZGU6IHsgeDogMjA0LCB5OiAxNTQgfSxcbiAgYmF0dGxlTW9kZTogeyB4OiAzNTAsIHk6IDE0NSB9LFxuICBzcGVjaWFsTW9kZTogeyB4OiA0MzgsIHk6IDE0NSB9LFxuICBjbHViTW9kZTogeyB4OiA1NTYsIHk6IDE0NSB9LFxuICBzZXR0aW5nczogeyB4OiAyOTgsIHk6IDMyNyB9LFxuICBhZFRhYjogeyB4OiA1OTAsIHk6IDc3IH0sXG4gIGFjaGlldmVtZW50OiB7IHg6IDEzOSwgeTogMzIwIH0sXG59O1xuXG4vLyB0ZWxsIHVzZXIgdGhlIHNlYXNvbiBzdGFydFxuZXhwb3J0IGNvbnN0IG5ld1NlYXNvbiA9IG5ldyBQYWdlKFxuICAnbmV3U2Vhc29uJyxcbiAgW1xuICAgIC8vIGJnIGJvdHRvbVxuICAgIHsgeDogNTMsIHk6IDMzNCwgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA2MTMsIHk6IDMzNCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuXG4gICAgLy8gbmV4dCBvciBvayBidG4gYmdcbiAgICB7IHg6IDI1NCwgeTogMjkyLCByOiAwLCBnOiAxMTcsIGI6IDI0NyB9LFxuICAgIHsgeDogMjU1LCB5OiAzMTEsIHI6IDgsIGc6IDEwMiwgYjogMjQ3IH0sXG4gICAgeyB4OiAzNzYsIHk6IDI5MiwgcjogMCwgZzogMTE3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDM3NiwgeTogMzEzLCByOiAxNiwgZzogMTAxLCBiOiAyNTQgfSxcblxuICAgIC8vIGxvZ28gaW4gY2VudGVyIHJpZ2h0XG4gICAgeyB4OiAzNTQsIHk6IDE0NywgcjogMCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzNzQsIHk6IDE1OCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzg2LCB5OiAxNDksIHI6IDE5MiwgZzogMjAsIGI6IDY1IH0sXG4gIF0sXG4gIHsgeDogMzI0LCB5OiAzMDUgfSxcbiAgeyB4OiAzMjQsIHk6IDMwNSB9XG4pO1xuXG4vLyBjaGVjayB0aGVyZSBtaWdodCBiZSBtYW55IGRpZmYgdGl0bGVzIGZvciBlbmQgc2Vhc29uXG5leHBvcnQgY29uc3QgZW5kU2Vhc29uID0gbmV3IFBhZ2UoXG4gICdlbmRTZWFzb24nLFxuICBbXG4gICAgLy8geFxuICAgIHsgeDogNTE4LCB5OiA0NywgcjogNzEsIGc6IDczLCBiOiA3MiB9LFxuXG4gICAgLy8gbG9nbyBvbiBjZW50ZXIgcmlnaHRcbiAgICB7IHg6IDM1NywgeTogMTQ0LCByOiAwLCBnOiAyOCwgYjogNjYgfSxcbiAgICB7IHg6IDM2OSwgeTogMTUwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzODUsIHk6IDE0MCwgcjogMTg5LCBnOiAxNCwgYjogNTggfSxcblxuICAgIC8vIG5leHRcbiAgICB7IHg6IDI4MCwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzEyLCB5OiAyOTksIHI6IDE2LCBnOiAxMTUsIGI6IDI0MiB9LFxuICAgIHsgeDogMzM5LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiAzNjgsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9LFxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG5cbi8vIGFmdGVyIGVuZFNlYXNvbiwgeHggc2Vhc29uIGlzIG92ZXJcbmV4cG9ydCBjb25zdCBlbmRTZWFzb25Qcm9jZWVkID0gbmV3IFBhZ2UoXG4gICdlbmRTZWFzb25Qcm9jZWVkJyxcbiAgW1xuICAgIC8vIGhvdyB3b3VsZCB5b3UgbGlrZSB0byBwcm9jZWVkIHdpdGggbmV4dCBzZWFzb24gP1xuICAgIHsgeDogNDUyLCB5OiAzOCwgcjogMTk1LCBnOiAyMTMsIGI6IDIyOSB9LFxuICAgIHsgeDogNTA4LCB5OiAzNiwgcjogOCwgZzogODUsIGI6IDE0OCB9LFxuICAgIHsgeDogNTQ1LCB5OiAzNCwgcjogMjUzLCBnOiAyNTMsIGI6IDI1NCB9LFxuICAgIHsgeDogNTY2LCB5OiAzNCwgcjogNDMsIGc6IDEwNywgYjogMTY3IH0sXG4gICAgeyB4OiAyNzcsIHk6IDM0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NjgsIHk6IDMxLCByOiAyMTksIGc6IDIzMiwgYjogMjM3IH0sXG4gICAgeyB4OiA1NjgsIHk6IDM4LCByOiA0NSwgZzogMTA3LCBiOiAxNjUgfSxcbiAgICB7IHg6IDU1MywgeTogMzgsIHI6IDMwLCBnOiA5OCwgYjogMTYwIH0sXG5cbiAgICAvLyBiZyBjb3JuZXJcbiAgICB7IHg6IDgsIHk6IDEzLCByOiAwLCBnOiA5NywgYjogMTgxIH0sXG4gICAgeyB4OiA4LCB5OiAzNDMsIHI6IDE2LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNjI1LCB5OiAyMiwgcjogMCwgZzogODksIGI6IDE2NCB9LFxuICAgIHsgeDogNjI4LCB5OiAzNTAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzksIHk6IDMyNSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDU1OCwgeTogMzI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzEsIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjA2LCB5OiAzMjUsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkID0gbmV3IFBhZ2UoXG4gICdlbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWQnLFxuICBbXG4gICAgLy8gYmcgY29ybmVyXG4gICAgeyB4OiA4LCB5OiAxMywgcjogMCwgZzogOTcsIGI6IDE4MSB9LFxuICAgIHsgeDogOCwgeTogMzQzLCByOiAxNiwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyNSwgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYyOCwgeTogMzUwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTM5LCB5OiAzMjUsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiA1NTgsIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTcxLCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNiwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE2LCB5OiAxOSwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMTksIHk6IDMzNywgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNjIzLCB5OiAyMiwgcjogMCwgZzogODksIGI6IDE2NCB9LFxuICAgIHsgeDogNjE5LCB5OiAyMzIsIHI6IDE2LCBnOiAyNCwgYjogMTYgfSxcblxuICAgIC8vIE5PUk1BTCBMRUFHVUVcbiAgICB7IHg6IDEyNSwgeTogMTY0LCByOiAyMTQsIGc6IDIyMCwgYjogMjIxIH0sXG4gICAgeyB4OiAxNDMsIHk6IDE2NSwgcjogNDEsIGc6IDEwNSwgYjogMjggfSxcblxuICAgIC8vIG1vZGUgYmdcbiAgICB7IHg6IDQ2LCB5OiA4NywgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDcsIHk6IDI4OCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogMzM3LCB5OiA3OSwgcjogNTgsIGc6IDU3LCBiOiA2NiB9LFxuICAgIHsgeDogMzQyLCB5OiAyODQsIHI6IDU4LCBnOiA1NywgYjogNjYgfSxcblxuICAgIC8vIHJld2FyZCBpbmZvIGluIGJvdGhcbiAgICB7IHg6IDEzOCwgeTogMjcwLCByOiA4LCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMTA2LCB5OiAyNzIsIHI6IDY1LCBnOiAxNDcsIGI6IDI0OSB9LFxuICAgIHsgeDogMzk1LCB5OiAyNzMsIHI6IDE5NSwgZzogMjIxLCBiOiAyNTMgfSxcbiAgICB7IHg6IDQyMSwgeTogMjc2LCByOiA4LCBnOiAxMDIsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU2NSwgeTogMzI4IH0sXG4gIHsgeDogNTY1LCB5OiAzMjggfVxuKTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVCdG5zID0ge1xuICBub3JtYWw6IHtcbiAgICB4OiAxNzAsXG4gICAgeTogMTYwLFxuICB9LFxuICBtYXN0ZXI6IHtcbiAgICB4OiA0NzAsXG4gICAgeTogMTYwLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVQcm9jZWVkID0gbmV3IFBhZ2UoXG4gICdzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTYsIHk6IDE5LCByOiAwLCBnOiA5MywgYjogMTczIH0sXG4gICAgeyB4OiAxOSwgeTogMzM3LCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA2MjMsIHk6IDIyLCByOiAwLCBnOiA4OSwgYjogMTY0IH0sXG4gICAgeyB4OiA2MTksIHk6IDIzMiwgcjogMTYsIGc6IDI0LCBiOiAxNiB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDUzNSwgeTogMzI2LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogNTcwLCB5OiAzMzAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNSwgeTogMzI4LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU2NSwgeTogMzI4IH0sXG4gIHsgeDogNTY1LCB5OiAzMjggfVxuKTtcblxuLy8gYSBkaWFsb2cgdG8gY29uZmlybSBsZWFndWUgcmVzZXRcbmV4cG9ydCBjb25zdCBsZWFndWVSZXNldERpYWxvZ1lOID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXNldERpYWxvZ1lOJyxcbiAgW1xuICAgIHsgeDogMTE1LCB5OiA1NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA4LCB5OiAzMDUsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUwOCwgeTogMzA4LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTQsIHk6IDUwLCByOiAxODEsIGc6IDE4MiwgYjogMTgxIH0sXG4gICAgeyB4OiA1MzEsIHk6IDQ4LCByOiAxNjcsIGc6IDE3MiwgYjogMTc0IH0sXG4gICAgeyB4OiAyNjIsIHk6IDU3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMTksIHk6IDYxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDcsIHk6IDYyLCByOiAxMjcsIGc6IDEzMywgYjogMTM3IH0sXG4gICAgeyB4OiAzNzQsIHk6IDYyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMjAsIHk6IDMwMiwgcjogNDEsIGc6IDczLCBiOiAxMjMgfSxcbiAgICB7IHg6IDM5OSwgeTogMzA2LCByOiAxNTUsIGc6IDE5NSwgYjogMjUxIH0sXG4gICAgeyB4OiA0NDMsIHk6IDMwNSwgcjogOCwgZzogMTA1LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAxOTMsIHk6IDMwMCB9LCAvLyBubywgY2FuY2VsXG4gIHsgeDogMzcxLCB5OiAzMDAgfSAvLyB5ZXMsIHJlc2V0XG4pO1xuXG4vLyBhIGRpYWxvZyB0byBzZWxlY3QgeWVhciwgbm9ybWFsIG9yIG1hc3RlciBsZWFndWVcbi8vIFRPRE86IGxldCB1c2VyIGNhbiBzZWxlY3Qgc3BlY2lmaWMgbW9kZSBhbmQgeWVhciB0byBwbGF5XG5leHBvcnQgY29uc3QgbGVhZ3VlUmVzZXREaWFsb2cgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZVJlc2V0RGlhbG9nJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNzAsIHk6IDQwLCByOiA0MCwgZzogNDQsIGI6IDQ5IH0sXG4gICAgeyB4OiAyOTMsIHk6IDQ0LCByOiAxNDYsIGc6IDE0OCwgYjogMTU1IH0sXG4gICAgeyB4OiAzMjYsIHk6IDQ1LCByOiAxOTMsIGc6IDE5NywgYjogMjA2IH0sXG4gICAgeyB4OiAzNTEsIHk6IDQyLCByOiAyMSwgZzogMjYsIGI6IDMwIH0sXG4gICAgeyB4OiAzNjQsIHk6IDQyLCByOiAxODgsIGc6IDE5MiwgYjogMTk4IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTIxLCB5OiAyNSwgcjogMTkxLCBnOiAxOTksIGI6IDIwNiB9LFxuICAgIHsgeDogMTE2LCB5OiAyODgsIHI6IDIzOSwgZzogMjQyLCBiOiAyMzkgfSxcbiAgICB7IHg6IDUxOCwgeTogMzUsIHI6IDcyLCBnOiA3NSwgYjogODAgfSxcbiAgICB7IHg6IDUxNywgeTogMjkyLCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG5cbiAgICAvLyBjYW5jZWwgYnRuIGJnXG4gICAgeyB4OiAxODUsIHk6IDI4MiwgcjogNDEsIGc6IDc1LCBiOiAxMTggfSxcblxuICAgIC8vIHJlc2V0IHRvIHllYXIgWFggYnRuIGJnXG4gICAgeyB4OiAzMjcsIHk6IDI5NywgcjogMywgZzogNzksIGI6IDIzNSB9LFxuICBdLFxuICB7IHg6IDM3MSwgeTogMzAwIH0sIC8vIHJlc2V0IHRvIHllYXIgWFhcbiAgeyB4OiAxOTMsIHk6IDMwMCB9IC8vIGNhbmNlbFxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJlc2V0RGlhbG9nQnRucyA9IHtcbiAgbm9ybWFsOiB7IHg6IDIxOCwgeTogMTA1IH0sXG4gIG1hc3RlcjogeyB4OiA0MDIsIHk6IDEwNSB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFNlYXNvbk1vZGUgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdFNlYXNvbk1vZGUnLFxuICBbXG4gICAgeyB4OiAxMDQsIHk6IDE2LCByOiAwLCBnOiA5MywgYjogMTczIH0sXG4gICAgeyB4OiAyMzUsIHk6IDM3LCByOiAxNDMsIGc6IDE4MSwgYjogMjA3IH0sXG4gICAgeyB4OiAzMDksIHk6IDM2LCByOiAxNDUsIGc6IDE4MiwgYjogMjA5IH0sXG4gICAgeyB4OiAzMzcsIHk6IDM4LCByOiAxMDMsIGc6IDE0OSwgYjogMTkxIH0sXG4gICAgeyB4OiAzNzYsIHk6IDMyLCByOiAyNDUsIGc6IDI0NywgYjogMjUzIH0sXG4gICAgeyB4OiA0MjIsIHk6IDM2LCByOiAxNDUsIGc6IDE3NywgYjogMjA5IH0sXG4gICAgeyB4OiA0MCwgeTogNzUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMxNCwgeTogMTgzLCByOiAzMywgZzogMzYsIGI6IDMzIH0sXG4gICAgeyB4OiAzNDEsIHk6IDkzLCByOiA0MSwgZzogNDgsIGI6IDQ5IH0sXG4gICAgeyB4OiA1MzksIHk6IDMyMywgcjogMCwgZzogNjksIGI6IDE0OSB9LFxuICAgIHsgeDogNTUzLCB5OiAzMjgsIHI6IDAsIGc6IDY1LCBiOiAxNDggfSxcbiAgXSxcbiAgeyB4OiAxNzgsIHk6IDE4MyB9LFxuICB7IHg6IDE3OCwgeTogMTgzIH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RMZWFndWVHYW1lQW1vdW50ID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RMZWFndWVHYW1lQW1vdW50JyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAxNzksIHk6IDYwLCByOiA4LCBnOiA2NSwgYjogMTE1IH0sXG4gICAgeyB4OiAxOTUsIHk6IDU5LCByOiA1MiwgZzogOTksIGI6IDE0MSB9LFxuICAgIHsgeDogMjQ1LCB5OiA1NiwgcjogMTc3LCBnOiAxOTgsIGI6IDIxMiB9LFxuICAgIHsgeDogMzYxLCB5OiA1NywgcjogNSwgZzogNjYsIGI6IDExNSB9LFxuICAgIHsgeDogNDM5LCB5OiA1NiwgcjogMTk0LCBnOiAyMDgsIGI6IDIyMSB9LFxuICAgIHsgeDogNDgzLCB5OiA1NiwgcjogMCwgZzogNjUsIGI6IDExNSB9LFxuXG4gICAgLy8gYW1vdW50IHRpdGxlIGJnXG4gICAgeyB4OiAzMCwgeTogMTA0LCByOiAyMzAsIGc6IDIyNywgYjogMjMwIH0sXG4gICAgeyB4OiA3MCwgeTogMTAwLCByOiAyMjgsIGc6IDIyOCwgYjogMjI4IH0sXG4gICAgeyB4OiAxMTYsIHk6IDEwMCwgcjogMTk3LCBnOiAxOTgsIGI6IDE5NyB9LFxuICAgIHsgeDogMjA5LCB5OiAxMDIsIHI6IDQxLCBnOiA0OSwgYjogNTggfSxcbiAgICB7IHg6IDI0NCwgeTogMTAyLCByOiAxMTQsIGc6IDEyMSwgYjogMTI4IH0sXG4gICAgeyB4OiAyNzYsIHk6IDEwMiwgcjogNDQsIGc6IDU0LCBiOiA2NiB9LFxuICAgIHsgeDogMzYxLCB5OiA5OCwgcjogNTQsIGc6IDYwLCBiOiA3MCB9LFxuICAgIHsgeDogNDA5LCB5OiAxMDIsIHI6IDc0LCBnOiA3OSwgYjogODcgfSxcbiAgICB7IHg6IDQ1NiwgeTogOTksIHI6IDIzMCwgZzogMjMxLCBiOiAyMzAgfSxcbiAgICB7IHg6IDQ5NiwgeTogOTcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzAgfSxcbiAgICB7IHg6IDUzNywgeTogMTAxLCByOiA5MiwgZzogOTgsIGI6IDEwNiB9LFxuICAgIHsgeDogNTgyLCB5OiA5OSwgcjogMjAwLCBnOiAyMDQsIGI6IDIwNyB9LFxuICAgIHsgeDogNTk4LCB5OiA5OSwgcjogMjMwLCBnOiAyMzEsIGI6IDIzMCB9LFxuICBdLFxuICB7IHg6IDM5LCB5OiAzMTQgfSxcbiAgeyB4OiAzOSwgeTogMzE0IH1cbik7XG5leHBvcnQgY29uc3Qgc2VsZWN0TGVhZ3VlR2FtZUFtb3VudEJ0bnMgPSB7XG4gIGZ1bGw6IHsgeDogMjUsIHk6IDI4NSB9LFxuICBoYWxmOiB7IHg6IDI0NSwgeTogMjg1IH0sXG4gIHF1YXJ0ZXI6IHsgeDogNDAwLCB5OiAxMTIgfSxcbiAgcG9zdDogeyB4OiA2MDAsIHk6IDExMiB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFllYXIgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdFllYXInLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDEwMywgeTogMjQsIHI6IDIwMSwgZzogMjAxLCBiOiAyMDUgfSxcbiAgICB7IHg6IDEwNCwgeTogMjg5LCByOiAyNDAsIGc6IDI0MCwgYjogMjQwIH0sXG4gICAgeyB4OiA1MTksIHk6IDM0LCByOiA3NCwgZzogNzEsIGI6IDc0IH0sXG4gICAgeyB4OiA1MjgsIHk6IDI5NSwgcjogMjQ0LCBnOiAyNDIsIGI6IDI0NCB9LFxuXG4gICAgLy8gdGl0bGUgc2VsZWN0IHllYXJcbiAgICB7IHg6IDI3NywgeTogMzgsIHI6IDE4MiwgZzogMTg3LCBiOiAxOTEgfSxcbiAgICB7IHg6IDMxMSwgeTogMzQsIHI6IDIwLCBnOiAyNCwgYjogMjkgfSxcbiAgICB7IHg6IDM0MiwgeTogNDAsIHI6IDIxLCBnOiAyNSwgYjogMzAgfSxcbiAgICB7IHg6IDM1OSwgeTogNDAsIHI6IDE2LCBnOiAyNiwgYjogMzMgfSxcblxuICAgIC8vIHllYXIgYmdcbiAgICB7IHg6IDIzMCwgeTogMTM2LCByOiA3MSwgZzogNzgsIGI6IDk0IH0sXG4gICAgeyB4OiA0MDMsIHk6IDE1MSwgcjogNzIsIGc6IDc5LCBiOiA5NCB9LFxuXG4gICAgLy8gcmVzZXQgeWVhciBidG4gYmdcbiAgICB7IHg6IDMyOCwgeTogMjk2LCByOiAxLCBnOiA4MSwgYjogMjM4IH0sXG4gIF0sXG4gIHsgeDogMzkyLCB5OiAzMDIgfSxcbiAgeyB4OiA1MjAsIHk6IDQ5IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RZZWFyQnRucyA9IHtcbiAgcHJldlllYXI6IHsgeDogMTc4LCB5OiAxNTYgfSxcbiAgbmV4dFllYXI6IHsgeDogNDU1LCB5OiAxNTYgfSxcbiAgc3VibWl0OiB7IHg6IDI4NSwgeTogMzAzIH0sXG59O1xuXG4vLyAqIEJhdHRsZU1vZGVzXG5leHBvcnQgY29uc3QgYmF0dGxlTW9kZVBhbmVsID0gbmV3IFBhZ2UoXG4gICdiYXR0bGVNb2RlUGFuZWwnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogMzAxLCB5OiA1LCByOiAyMDYsIGc6IDIxNCwgYjogMjIyIH0sXG4gICAgeyB4OiAzMTMsIHk6IDEwLCByOiAyMjksIGc6IDIyNSwgYjogMjI5IH0sXG4gICAgeyB4OiAzMjQsIHk6IDcsIHI6IDU4LCBnOiA5NywgYjogMTMyIH0sXG4gICAgeyB4OiAzODgsIHk6IDEwLCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzOTYsIHk6IDYsIHI6IDI0MiwgZzogMjQwLCBiOiAyNDIgfSxcbiAgICB7IHg6IDQ5MiwgeTogMTAsIHI6IDI0NiwgZzogMjA4LCBiOiA0NSB9LFxuICAgIHsgeDogNDg2LCB5OiA0LCByOiAyMDYsIGc6IDIxNCwgYjogMjIyIH0sXG4gICAgeyB4OiA1OTgsIHk6IDEzLCByOiAxMDQsIGc6IDEyNiwgYjogMTUzIH0sXG4gICAgeyB4OiA2MTYsIHk6IDEyLCByOiAyMDYsIGc6IDIxNCwgYjogMjIyIH0sXG5cbiAgICAvLyBiZyBpbiBib3R0b20gKHRvcCB3aWxsIHNoaW5lKVxuICAgIHsgeDogOSwgeTogMzQ2LCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjMsIHk6IDM0NCwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogMzk3LCB5OiAzNDIsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcblxuICAgIC8vIHBsYXllciBoZWxtZXQgdG8gZGlmZiBnU2VsZWN0TGVhZ3VlR2FtZUFtb3VudFxuICAgIHsgeDogOCwgeTogMTIxLCByOiAxMTUsIGc6IDQ0LCBiOiA0MSB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjUsIHk6IDMxMywgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNDIsIHk6IDMyMCwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogMzEsIHk6IDMzMywgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuICBdLFxuICB7IHg6IDQxLCB5OiAzMjAgfSwgLy8gYmFja1xuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBiYXR0bGVNb2RlUGFuZWxCdG5zID0ge1xuICByYW5rZWRCYXR0bGU6IHsgeDogMjg3LCB5OiAxNjAgfSxcbiAgZnJpZW5kQmF0dGxlOiB7IHg6IDI4NywgeTogMjQ1IH0sXG4gIHBvd2VyUmFua2luZzogeyB4OiA1MjYsIHk6IDE2MCB9LCAvLyB1bnN1cmUgd2hhdCBpc1xuICBwdnA6IHsgeDogNTI1LCB5OiAyNDUgfSxcbn07XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVQYW5lbCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlUGFuZWwnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodCBwYXJ0IGljb25cbiAgICAvLyBzb21ldGltZXMgbmF2IGJhciB3aWxsIGRpc2FwcGVhclxuICAgIC8vIHsgeDogMzEyLCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgLy8geyB4OiAzOTAsIHk6IDEyLCByOiAxMjcsIGc6IDEyOCwgYjogMTI3IH0sXG4gICAgLy8geyB4OiA0OTMsIHk6IDEzLCByOiAyMDgsIGc6IDE4OSwgYjogNTEgfSxcbiAgICAvLyB7IHg6IDU5NywgeTogMTMsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG5cbiAgICAvLyBiZyBpbiBsZWZ0XG4gICAgLy8geyB4OiAyMiwgeTogNjYsIHI6IDE4OSwgZzogMTkwLCBiOiAxODkgfSxcbiAgICAvLyB7IHg6IDE2LCB5OiAxOTQsIHI6IDIzMCwgZzogMjI3LCBiOiAyMzAgfSxcbiAgICAvLyB7IHg6IDE4LCB5OiAyNjAsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcblxuICAgIC8vIHRlYW0gc3VwcG9ydCBiZ1xuICAgIHsgeDogNDg3LCB5OiA4NiwgcjogMjQ3LCBnOiAyNDMsIGI6IDI0NyB9LFxuICAgIHsgeDogNjE0LCB5OiA5NSwgcjogMjQ3LCBnOiAyNDMsIGI6IDI0NyB9LFxuXG4gICAgLy8gYmcgb2Ygd2luL2xvc2UgcmF0aW8gaW4gYm90dG9tIGxlZnRcbiAgICB7IHg6IDE0NCwgeTogMjg2LCByOiA2NiwgZzogNjEsIGI6IDY2IH0sXG4gICAgeyB4OiAzNTQsIHk6IDI4NiwgcjogNjYsIGc6IDY5LCBiOiA2NiB9LFxuXG4gICAgLy8gYmcgb2YgZXF1aXBtZW50IGluIHJpZ2h0XG4gICAgeyB4OiA0ODgsIHk6IDI0OSwgcjogMzMsIGc6IDg1LCBiOiAxNTYgfSxcbiAgICB7IHg6IDU2MiwgeTogMjUwLCByOiAzMywgZzogODUsIGI6IDE1NiB9LFxuXG4gICAgLy8gLy8gZW5lcmd5IChiYWxsKSBpbiBib3R0b21cbiAgICAvLyB7IHg6IDQyNCwgeTogMzI1LCByOiA1MSwgZzogNTgsIGI6IDUxIH0sXG4gICAgLy8geyB4OiA0MjgsIHk6IDMyNiwgcjogMjUzLCBnOiAyNTEsIGI6IDI1MyB9LFxuXG4gICAgLy8gbGluZSB1cCAsIHBvd2VyIHJhbmtpbmcsIHN0YXRzIGJ0biBiZ1xuICAgIHsgeDogODIsIHk6IDMyOCwgcjogMjUsIGc6IDY5LCBiOiAxMTYgfSxcbiAgICB7IHg6IDE0NiwgeTogMzMwLCByOiAyNSwgZzogNjUsIGI6IDExNSB9LFxuICAgIHsgeDogMjQ4LCB5OiAzMzAsIHI6IDI1LCBnOiA2NSwgYjogMTE1IH0sXG4gICAgLy8gYmFja1xuICAgIHsgeDogNDIsIHk6IDMyMywgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICBdLFxuICB7IHg6IDU1NywgeTogMzMyIH0sIC8vIHBsYXkgYmFsbFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJhbmtlZEJhdHRsZVBhbmVsQnRucyA9IHtcbiAgYXdheUdhbWU6IHsgeDogMTg1LCB5OiA2NSB9LFxuICBob21lR2FtZTogeyB4OiAyOTMsIHk6IDY1IH0sXG4gIGRpc2FibGVkUGxheUJ0bjogeyB4OiA1MDIsIHk6IDMxNywgcjogOTAsIGc6IDczLCBiOiA0OSB9LFxufTtcblxuLy8gY2xpY2sgcmVmcmVzaCBidG4gaW4gcmFua2VkQmF0dGxlUGFuZWxcbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoID0gbmV3IFBhZ2UoXG4gICdyYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoJyxcbiAgW1xuICAgIC8vIHRpdGxlIGFuZCB4XG4gICAgeyB4OiAyMDcsIHk6IDUyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyODYsIHk6IDUzLCByOiAxMjcsIGc6IDEzMSwgYjogMTM1IH0sXG4gICAgeyB4OiAzNjIsIHk6IDU3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzOTYsIHk6IDUxLCByOiAzNiwgZzogNDQsIGI6IDUyIH0sXG4gICAgeyB4OiA1MTgsIHk6IDUwLCByOiAxNDUsIGc6IDE0NiwgYjogMTQ1IH0sXG5cbiAgICAvLyBjb3VudCBkb3duIGJnXG4gICAgeyB4OiAxMTQsIHk6IDE1MSwgcjogMjUsIGc6IDg1LCBiOiA4MiB9LFxuICAgIHsgeDogNTIwLCB5OiAxNTUsIHI6IDI1LCBnOiA1MywgYjogNDkgfSxcblxuICAgIC8vIG90aGVyIGJnXG4gICAgeyB4OiAxMDYsIHk6IDkxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDYsIHk6IDMxMSwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTI3LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyOCwgeTogMjU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MjMsIHk6IDk5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gIF0sXG4gIHsgeDogNTIwLCB5OiA1MCB9LCAvLyB4XG4gIHsgeDogNTIwLCB5OiA1MCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlV2Vla2x5UmFua2tpbmcgPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZVdlZWtseVJhbmtraW5nJyxcbiAgW1xuICAgIC8vIHdlZWtseSByYW5ra2luZ1xuICAgIHsgeDogMzA5LCB5OiA0NCwgcjogMjQsIGc6IDMwLCBiOiAzNyB9LFxuICAgIHsgeDogMzQ0LCB5OiA1NCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzc0LCB5OiA1NCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDUxLCB5OiA0OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTEsIHk6IDMxMywgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogNjA2LCB5OiAzMDQsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDYwMywgeTogNDIsIHI6IDc0LCBnOiA3NywgYjogNzQgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyOTYsIHk6IDMwNywgcjogOCwgZzogMTE0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNSwgeTogMzEwLCByOiAxNzYsIGc6IDIwOCwgYjogMjUxIH0sXG4gICAgeyB4OiAzNjQsIHk6IDMwOCwgcjogOCwgZzogMTEzLCBiOiAyNDggfSxcbiAgXSxcbiAgeyB4OiAzMTYsIHk6IDMwMSB9LCAvLyBva1xuICB7IHg6IDMxNiwgeTogMzAxIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVSZXN1bHQgPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZVJlc3VsdCcsXG4gIFtcbiAgICAvLyBiZyBpbiBtaWRcbiAgICB7IHg6IDEwLCB5OiA5NCwgcjogNTgsIGc6IDkzLCBiOiAxNDAgfSxcbiAgICB7IHg6IDgsIHk6IDI0OCwgcjogMTQwLCBnOiAxNTgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjI0LCB5OiA5NSwgcjogNTgsIGc6IDk0LCBiOiAxNDAgfSxcbiAgICB7IHg6IDYyMSwgeTogMjQ2LCByOiAxNDAsIGc6IDE1OCwgYjogMTgxIH0sXG4gICAgeyB4OiAzMzYsIHk6IDk4LCByOiA1OCwgZzogOTcsIGI6IDE0MCB9LFxuICAgIHsgeDogMzQ1LCB5OiAyNTUsIHI6IDE0OCwgZzogMTYyLCBiOiAxODEgfSxcblxuICAgIC8vIHRpZXIvIHNjb3JlIC8gcmFua1xuICAgIHsgeDogNDksIHk6IDEyNywgcjogMTk4LCBnOiAyMDMsIGI6IDIxNCB9LFxuICAgIHsgeDogNTksIHk6IDEzMCwgcjogMTk2LCBnOiAyMDUsIGI6IDIxMiB9LFxuICAgIHsgeDogNzQsIHk6IDEzMywgcjogMjE2LCBnOiAyMjEsIGI6IDIyOCB9LFxuICAgIHsgeDogMTAxLCB5OiAxMzAsIHI6IDg1LCBnOiAxMTcsIGI6IDE1MyB9LFxuICAgIHsgeDogMTI2LCB5OiAxMjYsIHI6IDIwNywgZzogMjE2LCBiOiAyMjcgfSxcbiAgICB7IHg6IDE2OCwgeTogMTI5LCByOiAyMzMsIGc6IDIzNSwgYjogMjM4IH0sXG4gICAgeyB4OiAxODgsIHk6IDEzMiwgcjogMjIyLCBnOiAyMjksIGI6IDIzMCB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDI4NCwgeTogMjk2LCByOiA4LCBnOiAxMTgsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMwLCB5OiAyOTcsIHI6IDgsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzNjQsIHk6IDMwNiwgcjogOCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxNywgeTogMjk3LCByOiAyMjksIGc6IDIzNywgYjogMjUwIH0sXG4gIF0sXG4gIHsgeDogMzE2LCB5OiAzMTAgfSwgLy8gb2tcbiAgeyB4OiAzMTYsIHk6IDMxMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlR2FtZUluZm8gPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZUdhbWVJbmZvJyxcbiAgW1xuICAgIC8vIHJpZ2h0IHBhcnQgb2YgbmF2IGJhclxuICAgIHsgeDogNjE2LCB5OiAxMCwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTk1LCB5OiAxMywgcjogNzQsIGc6IDkzLCBiOiAxMjMgfSxcbiAgICB7IHg6IDU4OSwgeTogMTUsIHI6IDc1LCBnOiA5NCwgYjogMTIzIH0sXG4gICAgeyB4OiA1NjcsIHk6IDE0LCByOiA3NCwgZzogODUsIGI6IDkwIH0sXG4gICAgeyB4OiA1NzMsIHk6IDE1LCByOiA3NCwgZzogODUsIGI6IDkwIH0sXG4gICAgeyB4OiA0NzgsIHk6IDIwLCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA0NzEsIHk6IDExLCByOiAyMDUsIGc6IDIxOCwgYjogMjMwIH0sXG4gICAgeyB4OiA0NzMsIHk6IDEwLCByOiAyMDYsIGc6IDIxOSwgYjogMjMwIH0sXG4gICAgeyB4OiAzOTMsIHk6IDgsIHI6IDEyOSwgZzogMTI3LCBiOiAxMjkgfSxcbiAgICB7IHg6IDMxOSwgeTogMTQsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcblxuICAgIC8vIGdhbWUgaW5mbyB0aXRsZVxuICAgIHsgeDogMjg0LCB5OiA1OCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogMjk4LCB5OiA2MiwgcjogMTEwLCBnOiAxMTEsIGI6IDEyMSB9LFxuICAgIHsgeDogMzA3LCB5OiA2MywgcjogMTYzLCBnOiAxNjYsIGI6IDE3MSB9LFxuICAgIHsgeDogMzIwLCB5OiA2MiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogMzMyLCB5OiA2MywgcjogMjIxLCBnOiAyMjEsIGI6IDIyNSB9LFxuICAgIHsgeDogMzQ4LCB5OiA2MCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogMjA1LCB5OiA2MiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNDczLCB5OiA2NiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogMTQ4LCB5OiA2MSwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuXG4gICAgLy8gcGxheWJhbGwvIHBsYXlpbmcgYnRuXG4gICAgeyB4OiA0ODcsIHk6IDMyOCwgcjogMjEyLCBnOiAxODgsIGI6IDMyIH0sXG4gICAgeyB4OiA2MTAsIHk6IDMyNSwgcjogMjE0LCBnOiAxNzksIGI6IDAgfSxcbiAgICB7IHg6IDU1MiwgeTogMzM5LCByOiAxODEsIGc6IDE0MiwgYjogMCB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjYsIHk6IDMxNiwgcjogMjE0LCBnOiAyMTgsIGI6IDIxNCB9LFxuICAgIHsgeDogNDAsIHk6IDMxNiwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICAgIHsgeDogMzMsIHk6IDMyOSwgcjogMjExLCBnOiAyMTUsIGI6IDIxMCB9LFxuXG4gICAgLy8gYmcgYmV0d2VlbiBiYWNrIGFuZCBwbGF5XG4gICAgeyB4OiAxMzgsIHk6IDMyNSwgcjogNTgsIGc6IDY5LCBiOiA0OSB9LFxuICAgIHsgeDogMjAwLCB5OiAzMjksIHI6IDQ5LCBnOiA2MSwgYjogNDEgfSxcbiAgICB7IHg6IDI2NSwgeTogMzMwLCByOiA1MiwgZzogNjIsIGI6IDQ0IH0sXG4gICAgeyB4OiAzNDUsIHk6IDMzMywgcjogNjYsIGc6IDc1LCBiOiA1OCB9LFxuICAgIHsgeDogNDAyLCB5OiAzMzQsIHI6IDQ5LCBnOiA1MywgYjogMzMgfSxcbiAgXSxcbiAgeyB4OiA1MTgsIHk6IDMyOSB9LFxuICB7IHg6IDI2LCB5OiAzMTYgfVxuKTtcblxuLy8gYSBwYWdlIHRvIHN0YXJ0IGF1dG8gZ2FtZVxuZXhwb3J0IGNvbnN0IGF1dG9HYW1lQ29uZmlybSA9IG5ldyBQYWdlKFxuICAnYXV0b0dhbWVDb25maXJtJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNzcsIHk6IDYwLCByOiAxODAsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyOTUsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMjgsIHk6IDU4LCByOiAxNzcsIGc6IDE4MywgYjogMTg1IH0sXG4gICAgeyB4OiAzNTMsIHk6IDYxLCByOiAxNzcsIGc6IDE4MiwgYjogMTg1IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTA4LCB5OiA0OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA3LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNiwgeTogMzAyLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0OTEsIHk6IDE3MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTEwLCB5OiA0OCwgcjogMTY4LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogNTE2LCB5OiA1NSwgcjogMTAzLCBnOiAxMDUsIGI6IDEwOSB9LFxuICAgIHsgeDogNTI0LCB5OiA0OCwgcjogNzEsIGc6IDcwLCBiOiA3MSB9LFxuXG4gICAgLy8gbm8gYW5kIHllc1xuICAgIHsgeDogMjIzLCB5OiAyOTgsIHI6IDQxLCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiAyNDgsIHk6IDI5OCwgcjogMTU4LCBnOiAxODMsIGI6IDIxNCB9LFxuICAgIHsgeDogMzg4LCB5OiAyOTksIHI6IDE5NiwgZzogMjIzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzMCwgeTogMzAyLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuXG4gICAgLy8gY29udGVudCB0byBkaWZmIHdpdGggY29uZmlybSBlbmQgKHlvdSBzZWxlY3RlZClcbiAgICB7IHg6IDI4NiwgeTogMTgwLCByOiA4MiwgZzogODYsIGI6IDk0IH0sXG4gICAgeyB4OiAzMDQsIHk6IDE3OCwgcjogMTIwLCBnOiAxMjgsIGI6IDEzNiB9LFxuICAgIHsgeDogMzI0LCB5OiAxNzgsIHI6IDk1LCBnOiAxMDMsIGI6IDExMiB9LFxuICBdLFxuICB7IHg6IDM5MCwgeTogMzA0IH0sIC8vIHllcywgc3RhcnQgYXV0byBwbGF5XG4gIHsgeDogMjM3LCB5OiAzMDQgfSAvLyBubywgbm90IHN0YXJ0IGF1dG8gcGxheVxuKTtcblxuLy8gYSBwYWdlIHRvIGVuZCBhdXRvIGdhbWVcbmV4cG9ydCBjb25zdCBhdXRvR2FtZUNvbmZpcm1FbmQgPSBuZXcgUGFnZShcbiAgJ2F1dG9HYW1lQ29uZmlybUVuZCcsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjc3LCB5OiA2MCwgcjogMTgwLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjk1LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzA4LCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzI4LCB5OiA1OCwgcjogMTc3LCBnOiAxODMsIGI6IDE4NSB9LFxuICAgIHsgeDogMzUzLCB5OiA2MSwgcjogMTc3LCBnOiAxODIsIGI6IDE4NSB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDEwOCwgeTogNDksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwNywgeTogMzE0LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTYsIHk6IDMwMiwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDkxLCB5OiAxNzEsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxMCwgeTogNDgsIHI6IDE2OCwgZzogMTczLCBiOiAxNzYgfSxcbiAgICB7IHg6IDUxNiwgeTogNTUsIHI6IDEwMywgZzogMTA1LCBiOiAxMDkgfSxcbiAgICB7IHg6IDUyNCwgeTogNDgsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcblxuICAgIC8vIG5vIGFuZCB5ZXNcbiAgICB7IHg6IDIyMywgeTogMjk4LCByOiA0MSwgZzogNzcsIGI6IDEyMyB9LFxuICAgIHsgeDogMjQ4LCB5OiAyOTgsIHI6IDE1OCwgZzogMTgzLCBiOiAyMTQgfSxcbiAgICB7IHg6IDM4OCwgeTogMjk5LCByOiAxOTYsIGc6IDIyMywgYjogMjU1IH0sXG4gICAgeyB4OiA0MzAsIHk6IDMwMiwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcblxuICAgIC8vIFRPRE86IHVzZSBlbmQgZ2FtZSBjb250ZW50XG4gIF0sXG4gIHsgeDogMjM3LCB5OiAzMDQgfSwgLy8gbm8sIGNvbnRpbnVlIGF1dG8gcGxheVxuICB7IHg6IDM5MCwgeTogMzA0IH0gLy8geWVzLCBlbmQgYXV0byBwbGF5XG4pO1xuXG5leHBvcnQgY29uc3QgcmVjaGFyZ2VCYWxsUmFua01vZGUgPSBuZXcgUGFnZShcbiAgJ3JlY2hhcmdlQmFsbFJhbmtNb2RlJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAxOTIsIHk6IDQ5LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAyNDEsIHk6IDQ5LCByOiAxODIsIGc6IDE4MiwgYjogMTkxIH0sXG4gICAgeyB4OiAzMDIsIHk6IDU4LCByOiAxNjAsIGc6IDE2MSwgYjogMTY4IH0sXG4gICAgeyB4OiAzNDUsIHk6IDU5LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAzNjIsIHk6IDU5LCByOiAzMiwgZzogMzgsIGI6IDQ2IH0sXG4gICAgeyB4OiA0MTUsIHk6IDYwLCByOiA2NywgZzogNzIsIGI6IDgwIH0sXG4gICAgeyB4OiA0MzgsIHk6IDU4LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTE1LCB5OiA0NiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA5LCB5OiAzMDYsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyMSwgeTogMzA1LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTUsIHk6IDQ0LCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiA0OSB9LCAvLyBjYW5jZWxcbiAgeyB4OiA1MTgsIHk6IDQ5IH1cbik7XG5cbmV4cG9ydCBjb25zdCByZWNoYXJnZUJhbGxMZWFndWVNb2RlID0gbmV3IFBhZ2UoXG4gICdyZWNoYXJnZUJhbGxMZWFndWVNb2RlJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMjQsIHk6IDU1LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAyNjgsIHk6IDYwLCByOiAyNCwgZzogMzIsIGI6IDM3IH0sXG4gICAgeyB4OiAzMTYsIHk6IDYyLCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAzNjgsIHk6IDYxLCByOiAyMywgZzogMzEsIGI6IDQwIH0sXG4gICAgeyB4OiA0MDEsIHk6IDU2LCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiA0NDAsIHk6IDYwLCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTEwLCB5OiA1MywgcjogMTk3LCBnOiAxOTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMTE0LCB5OiAyOTgsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDMxNSwgeTogMzA3LCByOiAyMzQsIGc6IDI0MSwgYjogMjM0IH0sXG4gICAgeyB4OiA1MjEsIHk6IDMwNiwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogNTE4LCB5OiA1MSwgcjogMTk3LCBnOiAxOTgsIGI6IDE5OCB9LFxuICBdLFxuICB7IHg6IDUxOCwgeTogNDkgfSwgLy8gY2FuY2VsXG4gIHsgeDogNTE4LCB5OiA0OSB9XG4pO1xuXG4vLyAqIExlYWd1ZU1vZGVzXG5leHBvcnQgY29uc3QgbGVhZ3VlTW9kZVBhbmVsID0gbmV3IFBhZ2UoXG4gICdsZWFndWVNb2RlUGFuZWwnLFxuICBbXG4gICAgLy8gbmF2aSBiYXJcbiAgICB7IHg6IDMwMCwgeTogMTIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxNiwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzIwLCB5OiAxNSwgcjogMTQ0LCBnOiAxNDgsIGI6IDE0OSB9LFxuICAgIHsgeDogMzg4LCB5OiAxMCwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzg1LCB5OiA5LCByOiA2NCwgZzogNjcsIGI6IDcxIH0sXG4gICAgeyB4OiA0OTMsIHk6IDExLCByOiAyNDQsIGc6IDIwNCwgYjogMzkgfSxcbiAgICB7IHg6IDU3MSwgeTogMTQsIHI6IDE0NywgZzogMTYxLCBiOiAxNzEgfSxcbiAgICB7IHg6IDYwNiwgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgeyB4OiA2MzEsIHk6IDE1LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG5cbiAgICAvLyBidG4gaW4gYm90dG9tXG4gICAgeyB4OiA4NSwgeTogMzI2LCByOiAyMzQsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAxMTIsIHk6IDMyNywgcjogMjE0LCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogMTYzLCB5OiAzMjYsIHI6IDIyMiwgZzogMjI1LCBiOiAyMjcgfSxcbiAgICB7IHg6IDE5OCwgeTogMzI3LCByOiA4MCwgZzogMTE3LCBiOiAxNTkgfSxcbiAgICB7IHg6IDI1MSwgeTogMzI0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyNzgsIHk6IDMzMCwgcjogMTg5LCBnOiAyMDYsIGI6IDIxOSB9LFxuICBdLFxuICB7IHg6IDYxNiwgeTogMzM2IH0sXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlTW9kZUdhbWVJbmZvID0gbmV3IFBhZ2UoXG4gICdsZWFndWVNb2RlR2FtZUluZm8nLFxuICBbXG4gICAgeyB4OiAyOTIsIHk6IDksIHI6IDIxNCwgZzogMjEzLCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxNCwgeTogNywgcjogMjU1LCBnOiAyNTEsIGI6IDI1NSB9LFxuICAgIHsgeDogMzc5LCB5OiAzLCByOiAyMTQsIGc6IDIxNSwgYjogMjE0IH0sXG4gICAgeyB4OiAzODksIHk6IDEwLCByOiAyMzksIGc6IDIzNiwgYjogMjM5IH0sXG4gICAgeyB4OiA0ODIsIHk6IDMsIHI6IDIxNCwgZzogMjE4LCBiOiAyMjAgfSxcbiAgICB7IHg6IDQ5MywgeTogOSwgcjogMjU1LCBnOiAyNDYsIGI6IDE5MiB9LFxuICAgIHsgeDogNTg5LCB5OiAxMSwgcjogNzQsIGc6IDkzLCBiOiAxMjMgfSxcbiAgICB7IHg6IDU5NiwgeTogMTEsIHI6IDgxLCBnOiAxMDQsIGI6IDEzMSB9LFxuICAgIHsgeDogNjI0LCB5OiAxMiwgcjogMjE0LCBnOiAyMTEsIGI6IDIxNCB9LFxuICAgIHsgeDogMjYsIHk6IDMxMiwgcjogMjA5LCBnOiAyMTQsIGI6IDIwOSB9LFxuICAgIHsgeDogNjMxLCB5OiA1NiwgcjogMjA2LCBnOiAyMDcsIGI6IDIxNCB9LFxuICAgIHsgeDogNjMxLCB5OiA3MCwgcjogMTY4LCBnOiAxNzcsIGI6IDE5MyB9LFxuICAgIHsgeDogNjIzLCB5OiA2NCwgcjogMzMsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiAyNzAsIHk6IDE3OSwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogMjU2LCB5OiAyMTQsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDI0MiwgeTogMjQyLCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiA2MTIsIHk6IDI4MSwgcjogMjQsIGc6IDM2LCBiOiA0OSB9LFxuICBdLFxuICB7IHg6IDU0NiwgeTogMzI1IH0sIC8vIHBsYXlCYWxsXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG4vLyBub3JtYWwgZ2FtZSBwbGF5IHN0YXJ0XG5leHBvcnQgY29uc3Qgc2VsZWN0UGxheVJvbGVCdG5zID0ge1xuICBwbGF5T2ZmZW5zZU9ubHk6IHsgeDogMTI4LCB5OiAyNzkgfSxcbiAgcGxheUFsbDogeyB4OiAzMTcsIHk6IDI4MiB9LFxuICBwbGF5RGVmZmVuc2VPbmx5OiB7IHg6IDUwNiwgeTogMjgxIH0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0UGxheVJvbGUgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdFBsYXlSb2xlJyxcbiAgW1xuICAgIHsgeDogOTcsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTQ1LCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ5OSwgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1MzksIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTQzLCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2MywgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICB7IHg6IDkwLCB5OiAxMTAsIHI6IDE5NCwgZzogODIsIGI6IDI0IH0sXG4gICAgeyB4OiA1NTIsIHk6IDExMiwgcjogNTcsIGc6IDEyMCwgYjogMTk3IH0sXG4gIF0sXG4gIC8vIFRPRE86IG1ha2Ugd2hpY2ggcm9sZSBjYW4gYmUgc2VsZWN0ZWQgaWYgbmVlZFxuICBzZWxlY3RQbGF5Um9sZUJ0bnMucGxheUFsbCxcbiAgc2VsZWN0UGxheVJvbGVCdG5zLnBsYXlBbGxcbik7XG5cbi8vIHNvbWV0aW1lcyBoYXBwZW5lZCB3aGVuIHJlc3RhcnRpbmcgYSBjb250aW51ZWQgZ2FtZVxuLy8gb3IgY2FuY2VsIGF1dG8gcGxheSBkdXJpbmcgcGxheWluZ1xuZXhwb3J0IGNvbnN0IGxlYWd1ZUNvbnRpbnVlUGxheWluZyA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlQ29udGludWVQbGF5aW5nJyxcbiAgW1xuICAgIC8vIGZhc3QgcHJvZ3Jlc3Npb25cbiAgICB7IHg6IDQ1MiwgeTogMjc5LCByOiA4LCBnOiAxMDksIGI6IDI1NSB9LFxuICAgIHsgeDogNDc2LCB5OiAyNzksIHI6IDI1MSwgZzogMjUyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDUwMiwgeTogMjc1LCByOiAxOTAsIGc6IDIyMCwgYjogMjU1IH0sXG4gICAgeyB4OiA1MzAsIHk6IDI3OSwgcjogMjE4LCBnOiAyMzMsIGI6IDI1NSB9LFxuICAgIHsgeDogNTUyLCB5OiAyNzMsIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NjMsIHk6IDI3NiwgcjogMjM0LCBnOiAyNDQsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc5LCB5OiAyNzksIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sXG4gICAgeyB4OiA1ODcsIHk6IDI3MywgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICAvLyBjb250aW51ZVxuICAgIHsgeDogNDU4LCB5OiAzMjAsIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sXG4gICAgeyB4OiA0ODAsIHk6IDMyNCwgcjogMTIyLCBnOiAxNjgsIGI6IDI0NyB9LFxuICAgIHsgeDogNTIwLCB5OiAzMTcsIHI6IDg0LCBnOiAxNTksIGI6IDI1MCB9LFxuICAgIHsgeDogNTQ0LCB5OiAzMjQsIHI6IDIyNiwgZzogMjM0LCBiOiAyNTIgfSxcbiAgICB7IHg6IDU3MiwgeTogMzE5LCByOiA4LCBnOiAxMTMsIGI6IDI1NSB9LFxuICAgIHsgeDogNTkxLCB5OiAzMjUsIHI6IDAsIGc6IDk3LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA0NTgsIHk6IDMyMCB9LCAvLyBjb250aW51ZSBnYW1lXG4gIHsgeDogNDU4LCB5OiAzMjAgfSAvLyBjb250aW51ZSBnYW1lXG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5QXV0b09mZiA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5QXV0b09mZicsXG4gIFtcbiAgICAvLyBhdXRvXG4gICAgeyB4OiA1MTQsIHk6IDIwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1MjUsIHk6IDIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgLy8gY2FtZXJhXG4gICAgeyB4OiA1NTYsIHk6IDIxLCByOiAxODMsIGc6IDE4NSwgYjogMTg2IH0sXG4gICAgeyB4OiA1NjAsIHk6IDIzLCByOiAxOTcsIGc6IDE5OCwgYjogMTk3IH0sXG4gICAgeyB4OiA1NjksIHk6IDIxLCByOiAyMDYsIGc6IDIwNywgYjogMjA2IH0sXG4gIF0sXG4gIHsgeDogNTExLCB5OiAyMCB9LCAvLyBzd2l0Y2ggdG8gYXV0byBtb2RlXG4gIHsgeDogNjExLCB5OiAyMCB9IC8vIHBhdXNlIGJ1dHRvblxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheUF1dG9PZmYxID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlBdXRvT2ZmJyxcbiAgLy8gaGFzIHN3aW5nIGJ1dHRvblxuICBbXG4gICAgeyB4OiA1MjEsIHk6IDI2MywgcjogMjQsIGc6IDI5LCBiOiAxNiB9LFxuICAgIHsgeDogNTIwLCB5OiAyNTUsIHI6IDIxMywgZzogMjEzLCBiOiAyMTIgfSxcbiAgICB7IHg6IDUzMywgeTogMjU1LCByOiAyMjMsIGc6IDIyMSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTQsIHk6IDI0NCwgcjogMTYsIGc6IDI4LCBiOiAxNiB9LFxuICBdLFxuICB7IHg6IDUxMSwgeTogMjAgfSwgLy8gc3dpdGNoIHRvIGF1dG8gbW9kZVxuICB7IHg6IDYxMSwgeTogMjAgfSAvLyBwYXVzZSBidXR0b25cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAgPSBuZXcgR3JvdXBQYWdlKFxuICAnbGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwJyxcbiAgW2xlYWd1ZU9uUGxheUF1dG9PZmYsIGxlYWd1ZU9uUGxheUF1dG9PZmYxXSxcbiAgbGVhZ3VlT25QbGF5QXV0b09mZi5uZXh0IC8qIG5leHQgKi8sXG4gIGxlYWd1ZU9uUGxheUF1dG9PZmYuYmFjayAvKiBiYWNrICovXG4pO1xuXG4vLyBhdXRvIHBsYXkgb24sIHBvd2VyIHNhdmUgb2ZmXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQb3dlclNhdmVPZmYnLFxuICBbXG4gICAgLy8gYmF0dGVyeVxuICAgIHsgeDogNDg2LCB5OiAxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDkyLCB5OiAxNiwgcjogMTAxLCBnOiAxMDMsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg4LCB5OiAyMiwgcjogMjEwLCBnOiAyMDgsIGI6IDIxMCB9LFxuICAgIHsgeDogNDgxLCB5OiAyNywgcjogMTAyLCBnOiAxMDEsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg5LCB5OiAyOSwgcjogMTk3LCBnOiAxOTcsIGI6IDE5NyB9LFxuICBdLFxuICB7IHg6IDQ4NSwgeTogMjEgfSwgLy8gdHVybiBvbiBwb3dlciBzYXZlXG4gIHsgeDogNTUyLCB5OiAyMSB9IC8vIHR1cm4gb2ZmIGF1dG8gcGxheVxuKTtcblxuLy8gc2FtZSBhcyBnTGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmLCBidXQgaXMgc3RvcHBlZFxuLy8gbmVlZCB0byB0dXJuIG9uIGF1dG9wbGF5XG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmU3RvcHBlZCA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmJyxcbiAgW1xuICAgIC8vIGJhdHRlcnlcbiAgICB7IHg6IDQ4NiwgeTogMTMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ5MiwgeTogMTYsIHI6IDEwMSwgZzogMTAzLCBiOiAxMDEgfSxcbiAgICB7IHg6IDQ4OCwgeTogMjIsIHI6IDIxMCwgZzogMjA4LCBiOiAyMTAgfSxcbiAgICB7IHg6IDQ4MSwgeTogMjcsIHI6IDEwMiwgZzogMTAxLCBiOiAxMDEgfSxcbiAgICB7IHg6IDQ4OSwgeTogMjksIHI6IDE5NywgZzogMTk3LCBiOiAxOTcgfSxcblxuICAgIC8vIGRpc2FibGVkIGF1dG9wbGF5IHRleHRcbiAgICB7IHg6IDUyNCwgeTogMjMsIHI6IDkxLCBnOiAxMTAsIGI6IDE1OCB9LFxuICAgIHsgeDogNTMwLCB5OiAyMCwgcjogMTQwLCBnOiAxNDYsIGI6IDE1MiB9LFxuICAgIHsgeDogNTMzLCB5OiAyNCwgcjogOTMsIGc6IDEwNiwgYjogMTQzIH0sXG4gICAgeyB4OiA1NTAsIHk6IDI1LCByOiA4NSwgZzogMTA1LCBiOiAxNTMgfSxcbiAgICB7IHg6IDU1MiwgeTogMjEsIHI6IDE0NywgZzogMTUzLCBiOiAxNTYgfSxcbiAgICB7IHg6IDU1NywgeTogMjAsIHI6IDE0OCwgZzogMTU0LCBiOiAxNTYgfSxcbiAgICB7IHg6IDU2NiwgeTogMjQsIHI6IDk5LCBnOiAxMjEsIGI6IDE3MyB9LFxuICAgIHsgeDogNTc1LCB5OiAxOCwgcjogMTA3LCBnOiAxMjEsIGI6IDE3MyB9LFxuICAgIHsgeDogNTg0LCB5OiAxOSwgcjogOTcsIGc6IDEyMiwgYjogMTY5IH0sXG4gICAgeyB4OiA1ODksIHk6IDIyLCByOiAxMTgsIGc6IDEyNywgYjogMTQ5IH0sXG4gICAgeyB4OiA1OTUsIHk6IDE4LCByOiAxNDEsIGc6IDE1MCwgYjogMTU2IH0sXG4gICAgeyB4OiA2MDYsIHk6IDIzLCByOiA3NCwgZzogOTMsIGI6IDEzMiB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSwgLy8gdHVybiBvbiBhdXRvIHBsYXlcbiAgeyB4OiAwLCB5OiAwIH0gLy8gdHVybiBvbiBhdXRvIHBsYXlcbik7XG5cbi8vIGRvbid0IGRvIGFueSB0aGluZywganVzdCBhdm9pZCB0byBlbnRlciB1bmtub3duXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmTWlkID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQb3dlclNhdmVPZmYnLFxuICBbXG4gICAgLy8gYmF0dGVyeVxuICAgIHsgeDogNDg2LCB5OiAxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gZGlhbG9nIG9uXG4gICAgeyB4OiA2MDQsIHk6IDQ3LCByOiAxNzAsIGc6IDE3MSwgYjogMTcwIH0sXG4gICAgeyB4OiA2MDcsIHk6IDQ5LCByOiAyNDYsIGc6IDI0NiwgYjogMjQ2IH0sXG4gICAgeyB4OiA2MTEsIHk6IDU0LCByOiAyMTMsIGc6IDIxMCwgYjogMjEzIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZNaWQxID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQb3dlclNhdmVPZmYnLFxuICBbXG4gICAgLy8gYmF0dGVyeVxuICAgIHsgeDogNDg2LCB5OiAxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gZGlhbG9nIG9mZlxuICAgIHsgeDogNjA1LCB5OiA1MCwgcjogOTUsIGc6IDk5LCBiOiA5NyB9LFxuICAgIHsgeDogNjAyLCB5OiA1MSwgcjogMTA5LCBnOiAxMTQsIGI6IDExNiB9LFxuICAgIHsgeDogNjAzLCB5OiA0OSwgcjogMTMxLCBnOiAxMzMsIGI6IDEzMSB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZHcm91cHMgPSBuZXcgR3JvdXBQYWdlKCdsZWFndWVPblBsYXlQb3dlclNhdmVPZmZHcm91cCcsIFtcbiAgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmLFxuICBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkLFxuICBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZNaWQsXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZDEsXG5dKTtcblxuZXhwb3J0IGNvbnN0IG9uUGxheVBvd2VyU2F2ZU9uID0gbmV3IFBhZ2UoXG4gICdvblBsYXlQb3dlclNhdmVPbicsXG4gIFtcbiAgICB7IHg6IDMwNCwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA2LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNywgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDgsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuXG4gICAgeyB4OiAzMDEsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzAyLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwMywgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDQsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA1LCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDM2LCB5OiAyNiwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogMzYsIHk6IDMyNiwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjEzLCB5OiAzMzAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDYxOCwgeTogMTAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDYwMiwgeTogMjcsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDE3NCwgeTogMTYyLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA0NzYsIHk6IDE1OCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIC8vIHNjb3JlIGJnXG4gICAgeyB4OiA0OTcsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNDk4LCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDQ5OSwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA1MDAsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNTAxLCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMiwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA1MDMsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbi8vIEZJWE1FOiBjaGFuZ2UgY29sb3JzXG5leHBvcnQgY29uc3Qgb25RdWlja1BsYXkgPSBuZXcgUGFnZShcbiAgJ29uUXVpY2tQbGF5JyxcbiAgW1xuICAgIC8vIGJnIHJpZ2h0IHBhbmVsXG4gICAgeyB4OiA0NTYsIHk6IDExLCByOiA1OCwgZzogNzcsIGI6IDEyMyB9LFxuICAgIHsgeDogNjIzLCB5OiAxMCwgcjogNTgsIGc6IDczLCBiOiAxMTUgfSxcbiAgICB7IHg6IDQ1NywgeTogMzQ4LCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG4gICAgeyB4OiA2MzIsIHk6IDM1MCwgcjogMzMsIGc6IDQwLCBiOiA1OCB9LFxuXG4gICAgLy8gYmx1ZSBidG46IHBsYXkgbWFudWFsbHlcbiAgICB7IHg6IDI5OCwgeTogMzIxLCByOiAzMywgZzogMTMxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxMSwgeTogMzM1LCByOiAxNTgsIGc6IDE5MSwgYjogMjM1IH0sXG4gICAgeyB4OiA0MzMsIHk6IDMzNCwgcjogOCwgZzogNTcsIGI6IDEyMyB9LFxuICAgIHsgeDogNDMzLCB5OiAzNDksIHI6IDAsIGc6IDgxLCBiOiAyMzggfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3Qgb25RdWlja1BsYXkxID0gbmV3IFBhZ2UoXG4gICdvblF1aWNrUGxheScsIC8vIHNhbWUgYmVoYXZpb3VyLCB3aXRob3V0IGJsdWUgYnRuIG9uIHJpZ2h0IGJvdHRvbVxuICBbXG4gICAgLy8gYmcgcmlnaHQgcGFuZWxcbiAgICB7IHg6IDQ1NCwgeTogOCwgcjogNTgsIGc6IDc3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDQ1NSwgeTogMzUxLCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDM0OCwgcjogMzMsIGc6IDQwLCBiOiA1OCB9LFxuICAgIHsgeDogNjI3LCB5OiA5LCByOiA1OCwgZzogNzMsIGI6IDExNSB9LFxuXG4gICAgLy8gZGlmZiBmcm9tIG90aGVyIHBhZ2VcbiAgICB7IHg6IDQzMywgeTogMzI0LCByOiA4NSwgZzogMTA3LCBiOiA2OCB9LFxuICAgIHsgeDogNDMzLCB5OiAzMjAsIHI6IDgzLCBnOiAxMDksIGI6IDY2IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuLy8gc29tZXRpbWVzIHRoZSBxdWljayBwbGF5IHdpbGwgYmUgcGF1c2VkXG5leHBvcnQgY29uc3Qgb25RdWlja1BsYXlQYXVzZSA9IG5ldyBQYWdlKFxuICAnb25RdWlja1BsYXlQYXVzZScsXG4gIFtcbiAgICB7IHg6IDQ1NiwgeTogMTEsIHI6IDQ5LCBnOiA3MywgYjogMTIzIH0sXG4gICAgeyB4OiA0NzIsIHk6IDIyLCByOiAyMDEsIGc6IDIwNywgYjogMjE4IH0sXG4gICAgeyB4OiA1MzIsIHk6IDIyLCByOiA4MSwgZzogMTAwLCBiOiAxMjggfSxcbiAgICB7IHg6IDQ1MywgeTogMzQ3LCByOiAyNCwgZzogMzYsIGI6IDU3IH0sXG4gICAgeyB4OiAzMDYsIHk6IDI3NiwgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQyMSwgeTogMjgzLCByOiAyLCBnOiAxMDUsIGI6IDI0NyB9LFxuICAgIHsgeDogMzI1LCB5OiAzMzcsIHI6IDAsIGc6IDk3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDQzMCwgeTogMzM2LCByOiAwLCBnOiA5NywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzc2LCB5OiAzMjkgfSwgLy8gcGxheSBiYWxsIC8vIFRPRE86IG1pZ2h0IG5lZWQgdG8gc2V0IGlubmluZ1xuICB7IHg6IDM3NiwgeTogMzI5IH1cbik7XG5cbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheUdyb3VwID0gbmV3IEdyb3VwUGFnZSgnb25RdWlja1BsYXknLCBbb25RdWlja1BsYXksIG9uUXVpY2tQbGF5MV0sIG9uUXVpY2tQbGF5Lm5leHQgLyogbmV4dCAqLyk7XG5cbi8vIHdoZW4gcGxheWluZywgcHJlc3MgYmFja1xuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBhdXNlID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQYXVzZScsXG4gIFtcbiAgICAvLyBjb250aW51ZSBidXR0b25cbiAgICB7IHg6IDg5LCB5OiAxNDgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDk5LCB5OiAxMzgsIHI6IDgyLCBnOiA4OSwgYjogOTkgfSxcbiAgICAvLyBsZWF2ZSBidXR0b25cbiAgICB7IHg6IDUyNywgeTogMTY1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NTUsIHk6IDE1MywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIC8vIG1sYiBsb2dvXG4gICAgeyB4OiA1NTQsIHk6IDI5MSwgcjogMCwgZzogMjgsIGI6IDU3IH0sXG4gICAgeyB4OiA1NjMsIHk6IDI5NCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTY1LCB5OiAyOTAsIHI6IDMwLCBnOiA1NCwgYjogODggfSxcbiAgXSxcbiAgeyB4OiA4OSwgeTogMTQ4IH0sIC8vIGNvbnRpbnVlIGdhbWVcbiAgeyB4OiA1MjcsIHk6IDE2NSB9IC8vIGxlYXZlXG4pO1xuXG4vLyBjYW5ub3QgZ28gdG8gbGVhZ3VlIG1vZGUgZHVlIHRvIHVuZXhwZWN0ZWQgZXJyb3JcbmV4cG9ydCBjb25zdCBsZWFndWVNb2RlVW5leHBlY3RlZEVycm9yID0gbmV3IFBhZ2UoXG4gICdsZWFndWVNb2RlVW5leHBlY3RlZEVycm9yJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNzIsIHk6IDYyLCByOiAxOTMsIGc6IDE5OCwgYjogMjAyIH0sXG4gICAgeyB4OiAzMTEsIHk6IDU5LCByOiAxNiwgZzogMjMsIGI6IDMyIH0sXG4gICAgeyB4OiAzMzgsIHk6IDYwLCByOiA3MSwgZzogNzIsIGI6IDgwIH0sXG4gICAgeyB4OiAzOTYsIHk6IDYwLCByOiAxOTIsIGc6IDE5OCwgYjogMjAzIH0sXG5cbiAgICAvLyBjb250ZW50XG4gICAgeyB4OiAyMDYsIHk6IDEzNywgcjogNTgsIGc6IDY3LCBiOiA3OCB9LFxuICAgIHsgeDogMzMzLCB5OiAxODAsIHI6IDEwMCwgZzogMTA5LCBiOiAxMTggfSxcbiAgICB7IHg6IDM2OCwgeTogMjAzLCByOiAxMzksIGc6IDE0NSwgYjogMTU0IH0sXG5cbiAgICAvLyBvayAmIGJnXG4gICAgeyB4OiAzMTksIHk6IDMwMSwgcjogMjQsIGc6IDExNywgYjogMjM4IH0sXG4gICAgeyB4OiAxNjQsIHk6IDMwNCwgcjogMjM5LCBnOiAyNDIsIGI6IDIzOSB9LFxuICAgIHsgeDogNDg3LCB5OiAzMDMsIHI6IDI0MSwgZzogMjQwLCBiOiAyNDEgfSxcbiAgXSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9LFxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmVzdWx0ID0gbmV3IFBhZ2UoXG4gICdnYW1lUmVzdWx0JyxcbiAgW1xuICAgIHsgeDogNDU4LCB5OiAyNCwgcjogNDEsIGc6IDQ0LCBiOiA0OSB9LCAvLyB0aXRsZVxuICAgIHsgeDogMTI2LCB5OiAzMzMsIHI6IDQ5LCBnOiA4MSwgYjogMTIzIH0sIC8vIHZpZXcgYWxsIGJ0blxuICAgIHsgeDogMjQ3LCB5OiAzMzUsIHI6IDQxLCBnOiA4MSwgYjogMTE1IH0sIC8vIGJveCBzY29yZSBidG5cbiAgICB7IHg6IDYwOSwgeTogMzM1LCByOiA4LCBnOiAxMDksIGI6IDI1NSB9LCAvLyBuZXh0IGJ0blxuICBdLFxuICB7IHg6IDYwOSwgeTogMzM1IH0sXG4gIHsgeDogNjA5LCB5OiAzMzUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXN1bHRBcXVpcmVkID0gbmV3IFBhZ2UoXG4gICdnYW1lUmVzdWx0QXF1aXJlZCcsXG4gIFtcbiAgICB7IHg6IDQ0OSwgeTogMjMsIHI6IDQxLCBnOiA0NCwgYjogNDkgfSwgLy8gdGl0bGVcbiAgICB7IHg6IDM5LCB5OiAzMjksIHI6IDIxMywgZzogMjE4LCBiOiAyMTMgfSwgLy8gYmFjayBidG5cbiAgICB7IHg6IDE1OCwgeTogMjg3LCByOiAyNDcsIGc6IDEyNiwgYjogNTEgfSwgLy8gcGxheWVyIHBhY2sgYnRuXG4gICAgeyB4OiA2MTIsIHk6IDMyOCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSwgLy8gb2sgYnRuXG4gIF0sXG4gIHsgeDogNjEyLCB5OiAzMjggfSxcbiAgeyB4OiA2MTIsIHk6IDMyOCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdE90aGVyID0gbmV3IFBhZ2UoXG4gICdnYW1lUmVzdWx0T3RoZXInLFxuICBbXG4gICAgeyB4OiA3MSwgeTogMjksIHI6IDAsIGc6IDg1LCBiOiAxNTYgfSxcbiAgICB7IHg6IDU1NiwgeTogMTUsIHI6IDIxMiwgZzogMjI4LCBiOiAyNDEgfSxcbiAgICB7IHg6IDU5NSwgeTogMTMsIHI6IDAsIGc6IDkzLCBiOiAxODEgfSxcbiAgICB7IHg6IDYxMCwgeTogMTMsIHI6IDAsIGc6IDI4LCBiOiA1NyB9LFxuICAgIHsgeDogNjE4LCB5OiAxMywgcjogMTcsIGc6IDI2LCBiOiA1OCB9LFxuICAgIHsgeDogNjI0LCB5OiA4LCByOiAyNDMsIGc6IDI0NCwgYjogMjQ1IH0sXG4gICAgeyB4OiA2MjcsIHk6IDI0LCByOiAxNjUsIGc6IDE4NiwgYjogMjAyIH0sXG4gICAgeyB4OiA1NzgsIHk6IDIzLCByOiA3MCwgZzogMTMyLCBiOiAxODIgfSxcbiAgICB7IHg6IDI0OSwgeTogNTYsIHI6IDg0LCBnOiAxMjEsIGI6IDE2MSB9LFxuICAgIHsgeDogMjY3LCB5OiA1NiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzE5LCB5OiA2MCwgcjogMTY4LCBnOiAxOTEsIGI6IDIwOCB9LFxuICAgIHsgeDogMzc3LCB5OiA1OCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjksIHk6IDkzLCByOiAwLCBnOiAzNiwgYjogNjYgfSxcbiAgICB7IHg6IDYxNywgeTogMzE0LCByOiAxNiwgZzogMjQsIGI6IDE3IH0sXG4gICAgeyB4OiAxMDgsIHk6IDMyMiwgcjogOCwgZzogMjAsIGI6IDE2IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXN1bHRXb3JsZENoYW1waW9uID0gbmV3IFBhZ2UoXG4gICdnYW1lUmVzdWx0V29ybGRDaGFtcGlvbicsXG4gIFtcbiAgICB7IHg6IDI1MiwgeTogMjIsIHI6IDU3LCBnOiA2NywgYjogNzQgfSxcbiAgICB7IHg6IDMyMywgeTogNDIsIHI6IDExNiwgZzogMTA5LCBiOiA4MyB9LFxuICAgIHsgeDogMzUwLCB5OiA3MywgcjogNjYsIGc6IDkxLCBiOiA5NiB9LFxuICAgIHsgeDogNDksIHk6IDMzMSwgcjogMTYsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogMjA5LCB5OiAzMjIsIHI6IDgsIGc6IDIwLCBiOiAyNCB9LFxuICAgIHsgeDogMjk0LCB5OiAzMjYsIHI6IDIwOCwgZzogMjA4LCBiOiAyMTIgfSxcbiAgICB7IHg6IDQwMCwgeTogMzIzLCByOiAxOTIsIGc6IDE5MCwgYjogMTkyIH0sXG4gICAgeyB4OiA0MzksIHk6IDMyMywgcjogODUsIGc6IDk4LCBiOiAxMDAgfSxcbiAgICB7IHg6IDU3OCwgeTogMTk1LCByOiAxNiwgZzogMzYsIGI6IDQxIH0sXG4gICAgeyB4OiAzMTYsIHk6IDE2NywgcjogMjEyLCBnOiAyMTAsIGI6IDIxMiB9LFxuICAgIHsgeDogMzM4LCB5OiAxNzMsIHI6IDY1LCBnOiA3MSwgYjogNzEgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJld2FyZCA9IG5ldyBQYWdlKFxuICAnZ2FtZVJld2FyZCcsXG4gIFtcbiAgICB7IHg6IDI0LCB5OiAzMzYsIHI6IDE2LCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDU3NywgeTogMjYsIHI6IDAsIGc6IDQsIGI6IDAgfSxcbiAgICB7IHg6IDYwMSwgeTogMzM1LCByOiAxNiwgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiA0MTEsIHk6IDI2OCwgcjogOCwgZzogMTE0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzNCwgeTogMjcwLCByOiA2NiwgZzogMTQ0LCBiOiAyNTIgfSxcbiAgICB7IHg6IDQ4NywgeTogMjc0LCByOiAwLCBnOiAxMDIsIGI6IDI0NyB9LFxuICAgIHsgeDogNDk3LCB5OiAxMjIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ2MSwgeTogMTkzLCByOiA0MiwgZzogNTgsIGI6IDU4IH0sXG4gIF0sXG4gIHsgeDogNDEyLCB5OiAyNzEgfSxcbiAgeyB4OiA0MTIsIHk6IDI3MSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYmVzdFBvc2l0aW9uQXdhcmRCb251cyA9IG5ldyBQYWdlKFxuICAnYmVzdFBvc2l0aW9uQXdhcmRCb251cycsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTQxLCB5OiAyMSwgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogNjA5LCB5OiAyNiwgcjogMCwgZzogODEsIGI6IDE0OCB9LFxuICAgIHsgeDogMjYsIHk6IDMzNSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNjI2LCB5OiAzMzksIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDQsIHk6IDE0OCwgcjogOCwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0MCwgcjogMTYsIGc6IDMyLCBiOiA0OSB9LFxuXG4gICAgLy8gdGVhbSAxIGJlaW5nIHNlbGVjdGVkXG4gICAgeyB4OiAxNzMsIHk6IDE4LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMTc2LCB5OiAzMCwgcjogMTU4LCBnOiAxNzMsIGI6IDE5OSB9LFxuICAgIHsgeDogMTg0LCB5OiAzNiwgcjogOCwgZzogMTA1LCBiOiAyNTUgfSxcblxuICAgIC8vIHRlYW0gMiBub3QgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDMyOCwgeTogMjcsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAzMzcsIHk6IDMxLCByOiAxNiwgZzogNDgsIGI6IDgyIH0sXG4gICAgeyB4OiAzNDMsIHk6IDM3LCByOiA0MSwgZzogNzcsIGI6IDExNSB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDU0NywgeTogMzIwLCByOiAwLCBnOiAxMTMsIGI6IDI0OCB9LFxuICAgIHsgeDogNTY2LCB5OiAzMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3NywgeTogMzI0LCByOiAyMjgsIGc6IDIzOSwgYjogMjQ4IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyNSwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxMSwgeTogMzE2LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGJlc3RQb3NpdGlvbkF3YXJkQm9udXMyID0gbmV3IFBhZ2UoXG4gICdiZXN0UG9zaXRpb25Bd2FyZEJvbnVzJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNDEsIHk6IDIxLCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI2LCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiAyNiwgeTogMzM1LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA2MjYsIHk6IDMzOSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNCwgeTogMTQ4LCByOiA4LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDYyOCwgeTogMTQwLCByOiAxNiwgZzogMzIsIGI6IDQ5IH0sXG5cbiAgICAvLyB0ZWFtIDEgbm90IGJlaW5nIHNlbGVjdGVkXG4gICAgeyB4OiAxODksIHk6IDIyLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMTc4LCB5OiAzNCwgcjogOCwgZzogNDgsIGI6IDgyIH0sXG4gICAgeyB4OiAxNjksIHk6IDM5LCByOiA0MSwgZzogNzcsIGI6IDExNSB9LFxuXG4gICAgLy8gdGVhbSAyIGJlaW5nIHNlbGVjdGVkXG4gICAgeyB4OiAzNDMsIHk6IDIxLCByOiAyLCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzM3LCB5OiAzMSwgcjogMTYzLCBnOiAxNzAsIGI6IDE5NyB9LFxuICAgIHsgeDogMzMxLCB5OiA0MCwgcjogOCwgZzogOTcsIGI6IDI1NSB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDU0NywgeTogMzIwLCByOiAwLCBnOiAxMTMsIGI6IDI0OCB9LFxuICAgIHsgeDogNTY2LCB5OiAzMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3NywgeTogMzI0LCByOiAyMjgsIGc6IDIzOSwgYjogMjQ4IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyNSwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxMSwgeTogMzE2LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGJlc3RQb3NpdGlvbkF3YXJkQm9udXNHcm91cCA9IG5ldyBHcm91cFBhZ2UoXG4gICdiZXN0UG9zaXRpb25Bd2FyZEJvbnVzJyxcbiAgW2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMsIGJlc3RQb3NpdGlvbkF3YXJkQm9udXMyXSxcbiAgYmVzdFBvc2l0aW9uQXdhcmRCb251cy5uZXh0IC8qIG5leHQgKi9cbik7XG5cbi8vIG5leHQgcGFnZSBvZiBnQmVzdFBvc2l0aW9uQXdhcmRCb251c1xuZXhwb3J0IGNvbnN0IGJvbnVzR3JhbnRlZEJ5VGVhbVJlY29yZCA9IG5ldyBQYWdlKFxuICAnYm9udXNHcmFudGVkQnlUZWFtUmVjb3JkJyxcbiAgW1xuICAgIC8vIHRhYmxlIGJnXG4gICAgeyB4OiAzOCwgeTogNzUsIHI6IDQ5LCBnOiA2OSwgYjogMTA3IH0sXG4gICAgeyB4OiA2MDAsIHk6IDczLCByOiA0OSwgZzogNjksIGI6IDEwNyB9LFxuICAgIHsgeDogNjAxLCB5OiAyODksIHI6IDAsIGc6IDgsIGI6IDE2IH0sXG4gICAgeyB4OiAyOCwgeTogMjg1LCByOiA4LCBnOiAxMiwgYjogMTYgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAxNzYsIHk6IDc2LCByOiA0OSwgZzogNjgsIGI6IDEwNyB9LFxuICAgIHsgeDogMjE3LCB5OiA3NywgcjogMTI4LCBnOiAxMzYsIGI6IDE1OSB9LFxuICAgIHsgeDogMjU1LCB5OiA3NiwgcjogMTMxLCBnOiAxMzcsIGI6IDE1NyB9LFxuICAgIHsgeDogMjc4LCB5OiA3NiwgcjogNzgsIGc6IDk1LCBiOiAxMjggfSxcbiAgICB7IHg6IDMyNCwgeTogNzcsIHI6IDExMywgZzogMTIyLCBiOiAxNTAgfSxcbiAgICB7IHg6IDM2MiwgeTogNzUsIHI6IDQ2LCBnOiA2NiwgYjogMTA0IH0sXG4gICAgeyB4OiA0MDUsIHk6IDc3LCByOiAxNzgsIGc6IDE4NSwgYjogMjA2IH0sXG4gICAgeyB4OiA0MjUsIHk6IDcyLCByOiAxODQsIGc6IDE4NywgYjogMjA2IH0sXG4gICAgeyB4OiA0MzksIHk6IDc3LCByOiA1MywgZzogNzAsIGI6IDExMCB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDU0NywgeTogMzIwLCByOiAwLCBnOiAxMTMsIGI6IDI0OCB9LFxuICAgIHsgeDogNTY2LCB5OiAzMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3NywgeTogMzI0LCByOiAyMjgsIGc6IDIzOSwgYjogMjQ4IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyNSwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxMSwgeTogMzE2LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHBvc3RTZWFzb25Bd2FyZEJvbnVzID0gbmV3IFBhZ2UoXG4gICdwb3N0U2Vhc29uQXdhcmRCb251cycsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMzksIHk6IDI0LCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiAzMjAsIHk6IDE1LCByOiAwLCBnOiA4NSwgYjogMTY1IH0sXG4gICAgeyB4OiA2MTUsIHk6IDIzLCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiAxMSwgeTogMjY4LCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjEsIHk6IDI1OCwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogNjI0LCB5OiAzNTEsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDE3LCB5OiAzMzgsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDMxNiwgeTogMzQyLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTMxLCB5OiAzMTgsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiA1NjQsIHk6IDMyMywgcjogMjE4LCBnOiAyMzQsIGI6IDI1NCB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwOCwgeTogMzE4LCByOiAwLCBnOiAxMTcsIGI6IDI1NSB9LFxuICAgIHsgeDogNjA2LCB5OiAzMzEsIHI6IDgsIGc6IDEwNSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZUxpbmVVcCA9IG5ldyBQYWdlKFxuICAnZ2FtZUxpbmVVcCcsXG4gIFtcbiAgICAvLyBjb250ZW50IHRvcCBiZ1xuICAgIHsgeDogNTkxLCB5OiA1OSwgcjogNDksIGc6IDczLCBiOiAxMDcgfSxcbiAgICAvLyBwcm9ncmVzcyBiZ1xuICAgIHsgeDogMTksIHk6IDIxMSwgcjogMjQsIGc6IDMyLCBiOiA0OSB9LFxuICAgIC8vIGJhdHRsZSBsaW5ldXAgYnV0dG9uIGluIGJvdHRvbVxuICAgIHsgeDogNTM2LCB5OiAzMjIsIHI6IDQxLCBnOiA4MSwgYjogMTM3IH0sXG4gICAgeyB4OiA1NTMsIHk6IDMyMiwgcjogMTg4LCBnOiAyMDksIGI6IDIyNCB9LFxuICAgIHsgeDogNTY4LCB5OiAzMjIsIHI6IDIwNCwgZzogMjIwLCBiOiAyMzQgfSxcbiAgICB7IHg6IDU4NSwgeTogMzI0LCByOiAxMDcsIGc6IDEzOSwgYjogMTc3IH0sXG4gICAgeyB4OiA2MDQsIHk6IDMyNCwgcjogMjUsIGc6IDczLCBiOiAxMzIgfSxcbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNiwgeTogMzE0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiA0MywgeTogMzIxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzNiwgeTogMzI5LCByOiAyMTEsIGc6IDIxNiwgYjogMjEwIH0sXG4gIF0sXG4gIHsgeDogNDAsIHk6IDMyNCB9LFxuICB7IHg6IDQwLCB5OiAzMjQgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHBsYXllckdyb3d0aENvbXBsZXRlID0gbmV3IFBhZ2UoXG4gICdwbGF5ZXJHcm93dGhDb21wbGV0ZScsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTE1LCB5OiA0NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTE0LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNCwgeTogMzAxLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MjIsIHk6IDc0LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTAsIHk6IDE2OSwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogMTEwLCB5OiAyMzAsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyMiwgeTogMTU2LCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1MTMsIHk6IDIzMCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8gY29udGludWVcbiAgICB7IHg6IDI0MCwgeTogMzAwLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICAgIHsgeDogMzEyLCB5OiAzMDEsIHI6IDIyMywgZzogMjMzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMzNywgeTogMzA2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzOTksIHk6IDMwMiwgcjogOCwgZzogMTEwLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzMjUsIHk6IDMwNCB9LFxuICB7IHg6IDMyNSwgeTogMzA0IH1cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlJyxcbiAgW1xuICAgIC8vIHRpdGxlIGJnICYgeFxuICAgIHsgeDogMjAsIHk6IDM0LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAyMCwgeTogNjMsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDYwMCwgeTogMzYsIHI6IDIxMiwgZzogMjA5LCBiOiAyMTIgfSxcbiAgICB7IHg6IDYxMSwgeTogNTYsIHI6IDIyMiwgZzogMjE4LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ0MiwgeTogNjcsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHByb2dyZXNzIGJhciBiZ1xuICAgIHsgeDogMTYsIHk6IDc5LCByOiAwLCBnOiA0OSwgYjogOTAgfSxcbiAgICB7IHg6IDE4LCB5OiAxOTMsIHI6IDAsIGc6IDQ5LCBiOiA5MCB9LFxuICAgIHsgeDogNjE2LCB5OiAxOTksIHI6IDE2LCBnOiA2NSwgYjogMTE1IH0sXG5cbiAgICAvLyBiZyBpbiBib3R0b21cbiAgICB7IHg6IDYxOCwgeTogMjE1LCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiA2MTMsIHk6IDMyNiwgcjogNDEsIGc6IDQ1LCBiOiA0OSB9LFxuICBdLFxuICB7IHg6IDYwMCwgeTogNDUgfSxcbiAgeyB4OiA2MDAsIHk6IDQ1IH1cbik7XG4vLyByXG5cbmV4cG9ydCBjb25zdCBsZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlQm9udXNQbGF5ZXIgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGVCb251c1BsYXllcicsXG4gIFtcbiAgICAvLyB0aXRsZSBhbmQgeFxuICAgIHsgeDogMTczLCB5OiA1OCwgcjogMTQ3LCBnOiAxNTMsIGI6IDE1NiB9LFxuICAgIHsgeDogMjI5LCB5OiA1OCwgcjogNzksIGc6IDgyLCBiOiA4MiB9LFxuICAgIHsgeDogMzIwLCB5OiA2MCwgcjogMTYwLCBnOiAxNjMsIGI6IDE2NCB9LFxuICAgIHsgeDogMzczLCB5OiA1NSwgcjogMTc3LCBnOiAxODQsIGI6IDE4NSB9LFxuICAgIHsgeDogNDQzLCB5OiA2MCwgcjogMTAxLCBnOiAxMDUsIGI6IDExMCB9LFxuICAgIHsgeDogNTIxLCB5OiA1MSwgcjogNjYsIGc6IDY5LCBiOiA2NiB9LFxuXG4gICAgLy8gbG9nbyBvbiBjZW50ZXJcbiAgICB7IHg6IDI5MCwgeTogMTMyLCByOiA4LCBnOiAyOCwgYjogNjYgfSxcbiAgICB7IHg6IDMyNSwgeTogMTUwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNTcsIHk6IDEzMywgcjogMTg5LCBnOiAwLCBiOiAzMyB9LFxuXG4gICAgLy8gbmV4dFxuICAgIHsgeDogMjgxLCB5OiAyOTgsIHI6IDgsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzMjMsIHk6IDI5OSwgcjogMjIwLCBnOiAyMzQsIGI6IDI1MCB9LFxuICAgIHsgeDogMzY1LCB5OiAzMDcsIHI6IDgsIGc6IDEwMSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzMDcsIHk6IDMwMSwgcjogMjUwLCBnOiAyNTIsIGI6IDI1NCB9LFxuICAgIHsgeDogMzI5LCB5OiAyOTcsIHI6IDI1MiwgZzogMjUzLCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9LFxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBwaXRjaGVyT2ZUaGVNb250aCA9IG5ldyBQYWdlKFxuICAncGl0Y2hlck9mVGhlTW9udGgnLFxuICBbXG4gICAgeyB4OiAyNywgeTogMzgsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTggfSxcbiAgICB7IHg6IDYwMiwgeTogNDYsIHI6IDE1NCwgZzogMTUyLCBiOiAxNTUgfSxcbiAgICB7IHg6IDUzNSwgeTogMzA5LCByOiAxMzksIGc6IDE4OCwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMxNiwgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICAgIHsgeDogMzkxLCB5OiAzMDksIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiA1NDUsIHk6IDMxMCB9LFxuICB7IHg6IDU0NSwgeTogMzEwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBtdnAgPSBuZXcgUGFnZShcbiAgJ212cCcsXG4gIFtcbiAgICB7IHg6IDI3MywgeTogMjMsIHI6IDAsIGc6IDg5LCBiOiAxNjUgfSxcbiAgICB7IHg6IDI5NywgeTogMjUsIHI6IDkwLCBnOiAxNDUsIGI6IDIwMCB9LFxuICAgIHsgeDogMzIwLCB5OiAyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMyLCB5OiAyOSwgcjogMTI2LCBnOiAxNjksIGI6IDIwNCB9LFxuICAgIHsgeDogMzgwLCB5OiA1MywgcjogMCwgZzogNjUsIGI6IDEyMiB9LFxuICAgIHsgeDogNDkzLCB5OiAzMjIsIHI6IDE2LCBnOiAyMCwgYjogOCB9LFxuICAgIHsgeDogNTY4LCB5OiAzMjAsIHI6IDM4LCBnOiAxMjAsIGI6IDIxOCB9LFxuICAgIHsgeDogNjM1LCB5OiAzNDEsIHI6IDgsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA2MjAsIHk6IDE2NCwgcjogMCwgZzogOCwgYjogOCB9LFxuICAgIHsgeDogOSwgeTogMTc2LCByOiAxMiwgZzogMjQsIGI6IDI0IH0sXG4gIF0sXG4gIHsgeDogNTY4LCB5OiAzMjAgfSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0UmV3YXJkUGxheWVyID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RSZXdhcmRQbGF5ZXInLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDQsIHk6IDYsIHI6IDAsIGc6IDk3LCBiOiAxODkgfSxcbiAgICB7IHg6IDExLCB5OiAzNDYsIHI6IDE2LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNywgeTogMzUwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG5cbiAgICAvLyBmb3JtIGJnIGluIGJvdHRvbVxuICAgIHsgeDogNjUsIHk6IDMwMSwgcjogNjYsIGc6IDc3LCBiOiA2NiB9LFxuICAgIHsgeDogNjUsIHk6IDMyNiwgcjogNDAsIGc6IDQ1LCBiOiAzMyB9LFxuICAgIHsgeDogMTc1LCB5OiAzMDMsIHI6IDY2LCBnOiA3NywgYjogNTggfSxcbiAgICB7IHg6IDE3NCwgeTogMzI4LCByOiA0MSwgZzogNDUsIGI6IDMzIH0sXG4gICAgeyB4OiAyNzUsIHk6IDMwNCwgcjogNjYsIGc6IDczLCBiOiA1OCB9LFxuICAgIHsgeDogMjc1LCB5OiAzMjQsIHI6IDQxLCBnOiA0OCwgYjogMzMgfSxcbiAgICB7IHg6IDM4NCwgeTogMzAxLCByOiA2NiwgZzogNzMsIGI6IDU4IH0sXG4gICAgeyB4OiAzODQsIHk6IDMyMSwgcjogNDEsIGc6IDQ1LCBiOiAzMyB9LFxuICBdLFxuICB7IHg6IDU2OCwgeTogMzIwIH0sXG4gIHsgeDogNTY4LCB5OiAzMjAgfVxuKTtcbi8vIFRPRE86IGNoZWNrIHRoZSBwb3NpdGlvbiwgbXVzdCBiZSBiZyBvZiAnZGlhbW9uZCcsICdvbGQnIC4uLlxuLy8gYmcgb2YgdGhlIHdvcmRcbi8vIHJlZjogaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL21sYjlpbm5pbmdzL3Bob3Rvcy8xMzY2NTk2MTAzNzQ4NTcwXG4vLyBsZWZ0LCBtaWQgYW5kIHJpZ2h0IHJlc3BlY3RpdmVseVxuZXhwb3J0IGNvbnN0IHNlbGVjdFJld2FyZFBsYXllckJ0bnMgPSBbXG4gIHsgeDogNjYsIHk6IDIxNyB9LFxuICB7IHg6IDIyMSwgeTogMjE3IH0sXG4gIHsgeDogMzc3LCB5OiAyMTcgfSxcbl07XG4vLyBvbmx5IGluY2x1ZGUgYmFzaWMgdHlwZXNcbi8vIHtyfS17Z30te2J9OiBwcm9yaXR5XG4vLyB0cnkgeCAyMywgeSAyNjAgaW4gcGxheWVyIGluZm9cbmV4cG9ydCBjb25zdCBwbGF5ZXJDYXJkQ29sb3JUb1Jhbms6IHsgW2s6IHN0cmluZ106IG51bWJlciB9ID0ge1xuICAnNjYtNzQtNzQnOiAxLCAvLyBub3JtYWwgVE9ETzogdW5rbm93biBjb2xvclxuICAnOTktNjUtNDEnOiAyLCAvLyBicm93blxuICAnOTktNjUtNDknOiAyLCAvLyBicm93blxuICAnMTMyLTEyOS0xNDgnOiAzLCAvLyBzaWx2ZXJcbiAgJzE4OS0xNjYtNDknOiA0LCAvLyBnb2xkXG4gICcxODktMTY2LTU4JzogNCwgLy8gZ29sZFxuICAnMTk4LTE3MC01Nyc6IDQsIC8vIGdvbGRcbiAgJzE0OC0xMDEtMjUnOiA0LCAvLyBnb2xkXG4gICcxNjUtMTY2LTkwJzogNCwgLy8gZ29sZFxuICAnNDEtNjktMTA3JzogNSwgLy8gZGlhbW9uZCBUT0RPOiB1bmtub3duIGNvbG9yXG59O1xuXG4vLyBhZFJld2FyZCBwYWdlc1xuZXhwb3J0IGNvbnN0IGFkUmV3YXJkID0gbmV3IFBhZ2UoXG4gICdhZFJld2FyZCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMjgsIHk6IDQ1LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzNiwgeTogMjY3LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiAzMiwgeTogMzA3LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiA2MDUsIHk6IDUyLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA2MTEsIHk6IDI0NCwgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogNjA3LCB5OiAzMTksIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcblxuICAgIC8vIHdhdGNoIGFkIGljb24gJiBidG4gYmdcbiAgICB7IHg6IDM0NCwgeTogMzAwLCByOiA0OSwgZzogMTYyLCBiOiA5MCB9LFxuICAgIHsgeDogNDkwLCB5OiAzMTgsIHI6IDQxLCBnOiAxNDIsIGI6IDgyIH0sXG4gICAgeyB4OiAzNjEsIHk6IDMwOCwgcjogMCwgZzogMTQ3LCBiOiAxNDEgfSxcbiAgICB7IHg6IDM3NSwgeTogMzE2LCByOiAwLCBnOiAxMTAsIGI6IDEwNyB9LFxuXG4gICAgLy8gY2FuY2VsXG4gICAgeyB4OiAxOTAsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDIwNCwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMjE5LCB5OiAzMTAsIHI6IDI0MiwgZzogMjQ2LCBiOiAyNTMgfSxcbiAgICB7IHg6IDIzMiwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMjQ3LCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyNTgsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA0MDQsIHk6IDMxMCB9LFxuICB7IHg6IDIyNCwgeTogMzEwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBhZFJld2FyZFJlZGVlbSA9IG5ldyBQYWdlKFxuICAnYWRSZXdhcmRSZWRlZW0nLFxuICBbXG4gICAgLy8gYWQgcmV3YXJkIHRpdGxlXG4gICAgeyB4OiAyNzQsIHk6IDUxLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzMDIsIHk6IDQ5LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMzQsIHk6IDUxLCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzNTYsIHk6IDUyLCByOiA5MCwgZzogOTQsIGI6IDEwMiB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDI1LCB5OiA0NiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzYsIHk6IDMwNywgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogNjAxLCB5OiA0MiwgcjogMTIzLCBnOiAxMTgsIGI6IDEyMyB9LFxuICAgIHsgeDogNTkxLCB5OiAzMTgsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDIxLCB5OiAyNzMsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDE4LCB5OiA4MSwgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogNjE2LCB5OiA4NSwgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogNjA4LCB5OiAyNjksIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAzMDEsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxOSwgeTogMzA3LCByOiAxOSwgZzogMTE3LCBiOiAyNDQgfSxcbiAgICB7IHg6IDM0OSwgeTogMzA3LCByOiA4LCBnOiAxMTMsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDMwMywgeTogMzA0IH0sXG4gIHsgeDogMzAzLCB5OiAzMDQgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkUmV3YXJkT25DRCA9IG5ldyBQYWdlKFxuICAnYWRSZXdhcmRPbkNEJyxcbiAgW1xuICAgIC8vIHRpdGxlIChhbGVydClcbiAgICB7IHg6IDIyMCwgeTogNTMsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDMxMiwgeTogNTgsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDMzMCwgeTogNTUsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODgsIHk6IDMwMSwgcjogOCwgZzogMTE0LCBiOiAyNDggfSxcbiAgICB7IHg6IDMxMywgeTogMzA0LCByOiAxNTksIGc6IDE5MCwgYjogMjM1IH0sXG4gICAgeyB4OiAzNjIsIHk6IDMwNywgcjogOCwgZzogOTgsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDUxNiwgeTogNDggfSwgLy8gY2xvc2VcbiAgeyB4OiA1MTYsIHk6IDQ4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBhZEdyb3VwID0gbmV3IEdyb3VwUGFnZSgnYWRQYWdlcycsIFthZFJld2FyZCwgYWRSZXdhcmRSZWRlZW0sIGFkUmV3YXJkT25DRF0pO1xuXG4vLyB3ZWVrbHkgbWlzc2lvbiBwYWdlc1xuZXhwb3J0IGNvbnN0IGFjaGl2ZW1lbnRNaXNzaW9uID0gbmV3IFBhZ2UoXG4gICdhY2hpdmVtZW50TWlzc2lvbicsXG4gIFtcbiAgICAvLyB0b2RheSBtaXNzaW9uIGJnXG4gICAgeyB4OiAyMzUsIHk6IDU1LCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiAyMzEsIHk6IDcxLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiA1ODgsIHk6IDcyLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG5cbiAgICAvLyBsZWZ0IHNlY3Rpb24gd29ybGQgcmVjb3JkIGJnIGxlZnQgYm90dG9tXG4gICAgeyB4OiAxNiwgeTogMjkzLCByOiAyNSwgZzogNDAsIGI6IDc0IH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVhZFxuICAgIHsgeDogNzUsIHk6IDg4LCByOiA2NiwgZzogNTksIGI6IDkwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAzMSwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNTgwLCB5OiAyNzggfSwgLy8gY29tcGxldGUgd2Vla2x5IG1pc3Npb24gYm94XG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5leHBvcnQgY29uc3Qgd2Vla2x5TWlzc2lvbkJveCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveCcsXG4gIFtcbiAgICAvLyBuYXYgYmFyIHJpZ2h0IHBhcnQgKHAsIHN0YXIgLi4uKVxuICAgIHsgeDogMjk5LCB5OiAxMywgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogMzE4LCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzMTMsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDM5MiwgeTogOSwgcjogMjMyLCBnOiAyMjksIGI6IDIzMiB9LFxuICAgIHsgeDogMzg1LCB5OiAyLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0OTYsIHk6IDEzLCByOiAyMzgsIGc6IDE2NiwgYjogMTYgfSxcbiAgICB7IHg6IDQ4MywgeTogNCwgcjogMjE0LCBnOiAyMTksIGI6IDIxNiB9LFxuICAgIHsgeDogNTk3LCB5OiAxMCwgcjogMjEzLCBnOiAyMjYsIGI6IDIzOCB9LFxuICAgIHsgeDogNjI4LCB5OiAxNCwgcjogMjE0LCBnOiAyMTEsIGI6IDIxNCB9LFxuXG4gICAgLy8gYmcgb2YgdGFibGVcbiAgICB7IHg6IDE0LCB5OiA4MiwgcjogMzMsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogMTYsIHk6IDI4OCwgcjogMzMsIGc6IDQ0LCBiOiA1OCB9LFxuICAgIHsgeDogNjE1LCB5OiAxMDAsIHI6IDMzLCBnOiAzNiwgYjogNDEgfSxcbiAgICB7IHg6IDYxMywgeTogMjgzLCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG5cbiAgICAvLyBkZXNjcmlwdGlvbiBmb290ZXJcbiAgICB7IHg6IDgwLCB5OiAzMDcsIHI6IDIwMiwgZzogMjAxLCBiOiAxOTYgfSxcbiAgICB7IHg6IDg5LCB5OiAzMTUsIHI6IDQ5LCBnOiA2MSwgYjogMzQgfSxcbiAgICB7IHg6IDEwMywgeTogMzE5LCByOiA3MywgZzogODMsIGI6IDY2IH0sXG4gICAgeyB4OiAxNzIsIHk6IDMzNSwgcjogNzgsIGc6IDg0LCBiOiA3MiB9LFxuICAgIHsgeDogMjUwLCB5OiAzMzgsIHI6IDEwMSwgZzogMTA2LCBiOiA5MyB9LFxuICAgIHsgeDogMjczLCB5OiAzMDcsIHI6IDE1OSwgZzogMTU5LCBiOiAxNDkgfSxcbiAgICB7IHg6IDI4NCwgeTogMzA5LCByOiA1NiwgZzogNjEsIGI6IDQwIH0sXG5cbiAgICAvLyBiYWNrIGJ0blxuICAgIHsgeDogMjQsIHk6IDMxNCwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogNDIsIHk6IDMxNywgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICAgIHsgeDogMzEsIHk6IDMzMSwgcjogMjE0LCBnOiAyMTksIGI6IDIxNCB9LFxuICBdLFxuICB7IHg6IDQxLCB5OiAzMjAgfSwgLy8gYmFjayBidG5cbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94QnRucyA9IHtcbiAgb3BlbkJveDogeyB4OiA0MTgsIHk6IDMyNSB9LFxuICByZWNlaXZlUmV3YXJkOiB7IHg6IDU2MSwgeTogMzI2IH0sXG59O1xuXG5leHBvcnQgY29uc3Qgd2Vla2x5TWlzc2lvbkJveENvbmZpcm0gPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3hDb25maXJtJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTEsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE1LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxOSwgeTogMTc3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjQwLCB5OiA1OCwgcjogMTU1LCBnOiAxNjAsIGI6IDE2MyB9LFxuICAgIHsgeDogMjY3LCB5OiA1OCwgcjogMTQxLCBnOiAxNDcsIGI6IDE0OSB9LFxuICAgIHsgeDogMzI1LCB5OiA1OSwgcjogMTYxLCBnOiAxNjcsIGI6IDE3MCB9LFxuICAgIHsgeDogMzgzLCB5OiA1OSwgcjogMTcxLCBnOiAxNzksIGI6IDE3OSB9LFxuICAgIHsgeDogNDA3LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTE1LCB5OiA0OSwgcjogMTg3LCBnOiAxODUsIGI6IDE4OCB9LFxuICAgIHsgeDogNTE5LCB5OiA1NSwgcjogOTEsIGc6IDkxLCBiOiA5MiB9LFxuXG4gICAgLy8gbm8gJiB5ZXMgYnRuXG4gICAgeyB4OiAyMTAsIHk6IDI5MywgcjogNDEsIGc6IDgxLCBiOiAxMjMgfSxcbiAgICB7IHg6IDIzOCwgeTogMjk2LCByOiA0NSwgZzogODEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjg0LCB5OiAyOTQsIHI6IDQxLCBnOiA3OCwgYjogMTIzIH0sXG5cbiAgICB7IHg6IDM5NywgeTogMjk5LCByOiA0MCwgZzogMTM0LCBiOiAyNTMgfSxcbiAgICB7IHg6IDQzMywgeTogMzA3LCByOiA4LCBnOiA5OCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzg3LCB5OiAzMDAgfSwgLy8geWVzIGJ0blxuICB7IHg6IDM4NywgeTogMzAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94UmVjZWl2ZWQgPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTEzLCB5OiA1MywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTE3LCB5OiAzMDcsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ5NiwgeTogMjk5LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjE3LCB5OiA1NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjU5LCB5OiA1NSwgcjogMTc3LCBnOiAxODEsIGI6IDE4NSB9LFxuICAgIHsgeDogMjk4LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzQxLCB5OiA2MCwgcjogMTIwLCBnOiAxMjQsIGI6IDEyOCB9LFxuICAgIHsgeDogMzg2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogNDA3LCB5OiA1OCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTEyLCB5OiA0NywgcjogMTgxLCBnOiAxODYsIGI6IDE4MiB9LFxuICAgIHsgeDogNTE5LCB5OiA1MywgcjogNzEsIGc6IDcwLCBiOiA3MSB9LFxuXG4gICAgLy8gb2sgYnRuXG4gICAgeyB4OiAyODgsIHk6IDI5NywgcjogOCwgZzogMTIyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMCwgeTogMzAwLCByOiAxMzYsIGc6IDE5MCwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjQsIHk6IDMwMSwgcjogOCwgZzogMTE0LCBiOiAyNDggfSxcbiAgXSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9LCAvLyBvayBidG5cbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG4vLyBnZW5lcmFsIHBhZ2VzXG5leHBvcnQgY29uc3QgcG93ZXJTYXZpbmcgPSBuZXcgUGFnZShcbiAgJ3Bvd2VyU2F2aW5nJyxcbiAgW1xuICAgIHsgeDogMzA0LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDYsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA3LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwOCwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG5cbiAgICB7IHg6IDMwMSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDIsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzAzLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNCwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMTM3LCB5OiAxNTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUyMSwgeTogMTYwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiAyOTgsIHk6IDUwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA2MTgsIHk6IDEwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgLy8gdG8gZGlmZiBmcm9tIHBvd2VyIHNhdmluZyBkdXJpbmcgcGxheWluZ1xuICAgIHsgeDogNDk3LCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDQ5OCwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA0OTksIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTAwLCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUwMSwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDIsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTAzLCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1NSwgeTogMjgyLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NTUsIHk6IDI5MiwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQ1LCB5OiAyOTEsIHI6IDAsIGc6IDAsIGI6IDAgfSxcblxuICAgIC8vIHNjb3JlXG4gICAgeyB4OiA1MjAsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTI1LCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzMCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MzUsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQwLCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0NSwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NTAsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTIwLCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUyNSwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MzAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTM1LCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0MCwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDUsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTUwLCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGFpbHlQcm9tb3Rpb24gPSBuZXcgUGFnZShcbiAgJ2RhaWx5UHJvbW90aW9uJyxcbiAgW1xuICAgIC8vIGJsYWNrIGJnXG4gICAgeyB4OiA0NSwgeTogMTQ4LCByOiAxMCwgZzogMiwgYjogMyB9LFxuICAgIHsgeDogNjAwLCB5OiAxNDUsIHI6IDEwLCBnOiA5LCBiOiAxMCB9LFxuICAgIHsgeDogMzI4LCB5OiAzMzYsIHI6IDMsIGc6IDMsIGI6IDMgfSxcblxuICAgIC8vIGRvbid0IHNob3cgdGhpcyBhZ2FpbiB0b2RheSAodW5zZWxjdGVkKVxuICAgIHsgeDogMTc2LCB5OiAyNzksIHI6IDExMSwgZzogMTIyLCBiOiAxNDYgfSxcbiAgICB7IHg6IDIwNSwgeTogMjgwLCByOiAyLCBnOiAyLCBiOiAyIH0sXG4gICAgeyB4OiAyNDEsIHk6IDI4MCwgcjogMTAsIGc6IDYsIGI6IDcgfSxcbiAgICB7IHg6IDI3MiwgeTogMjgyLCByOiA5LCBnOiA4LCBiOiA4IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA0ODAsIHk6IDI3NSwgcjogMTE1LCBnOiAxMTUsIGI6IDExNSB9LFxuICAgIHsgeDogNDg0LCB5OiAyNzgsIHI6IDEyOSwgZzogMTI5LCBiOiAxMjkgfSxcbiAgICB7IHg6IDQ3OSwgeTogMjgwLCByOiAyMDQsIGc6IDIwNCwgYjogMjA1IH0sXG4gICAgeyB4OiA0ODYsIHk6IDI4MSwgcjogMTQ4LCBnOiAxNDgsIGI6IDE0OCB9LFxuICBdLFxuICB7IHg6IDQ4MywgeTogMjgwIH0sIC8vIHhcbiAgeyB4OiA0ODMsIHk6IDI4MCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcHJvbW90aW9uMSA9IG5ldyBQYWdlKFxuICAncHJvbW90aW9uMScsXG4gIFtcbiAgICB7IHg6IDYwMywgeTogMjcsIHI6IDEyNCwgZzogMTMwLCBiOiAxMzIgfSxcbiAgICB7IHg6IDYxMiwgeTogMzMsIHI6IDYwLCBnOiA2MCwgYjogNjAgfSxcbiAgICB7IHg6IDYwNSwgeTogNDAsIHI6IDE3NCwgZzogMTc4LCBiOiAxODEgfSxcbiAgICB7IHg6IDYwNSwgeTogMzUsIHI6IDE4MSwgZzogMTc4LCBiOiAxODEgfSxcbiAgICB7IHg6IDYxMiwgeTogMzksIHI6IDE4MSwgZzogMTc4LCBiOiAxODEgfSxcbiAgICB7IHg6IDYxNiwgeTogMzksIHI6IDE4MSwgZzogMTc4LCBiOiAxODEgfSxcbiAgICB7IHg6IDYxNSwgeTogMjksIHI6IDE0MiwgZzogMTQ0LCBiOiAxNDIgfSxcbiAgXSxcbiAgeyB4OiA2MTEsIHk6IDM2IH0sXG4gIHsgeDogNjExLCB5OiAzNiB9XG4pO1xuXG5leHBvcnQgY29uc3QgcHJvbW90aW9uMiA9IG5ldyBQYWdlKFxuICAncHJvbW90aW9uMicsXG4gIFtcbiAgICB7IHg6IDQzLCB5OiAzMSwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogMzA2LCB5OiAyOSwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogNTQ2LCB5OiAzMiwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogNTc2LCB5OiAzNiwgcjogMTczLCBnOiAxNzQsIGI6IDE4MCB9LFxuICAgIHsgeDogNTgwLCB5OiA0MCwgcjogMTc0LCBnOiAxNzIsIGI6IDE3NSB9LFxuICAgIHsgeDogNTg3LCB5OiAzNiwgcjogMjA2LCBnOiAyMDcsIGI6IDIxMyB9LFxuICAgIHsgeDogNTc2LCB5OiA0NiwgcjogMjEzLCBnOiAyMTEsIGI6IDIxNSB9LFxuICAgIHsgeDogNTg0LCB5OiA0NSwgcjogMjEyLCBnOiAyMTAsIGI6IDIxMyB9LFxuICAgIHsgeDogNTk1LCB5OiA1NSwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDU3OCwgeTogMzkgfSxcbiAgeyB4OiA1NzgsIHk6IDM5IH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9tb3Rpb24zID0gbmV3IFBhZ2UoXG4gICdwcm9tb3Rpb24zJyxcbiAgW1xuICAgIHsgeDogNTk4LCB5OiAzNywgcjogMTAxLCBnOiAxMDMsIGI6IDEwMiB9LFxuICAgIHsgeDogNjA0LCB5OiA0NSwgcjogNzEsIGc6IDczLCBiOiA3MSB9LFxuICAgIHsgeDogNjEyLCB5OiA1MywgcjogMTc0LCBnOiAxNzUsIGI6IDE3NiB9LFxuICAgIHsgeDogNjE3LCB5OiAzMywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICBdLFxuICB7IHg6IDYwMSwgeTogNDMgfSxcbiAgeyB4OiA2MDEsIHk6IDQzIH1cbik7XG5cbmV4cG9ydCBjb25zdCByZWNoYXJnZVByb21vdGlvbiA9IG5ldyBQYWdlKFxuICAncmVjaGFyZ2VQcm9tb3Rpb24nLFxuICBbXG4gICAgeyB4OiAxMTQsIHk6IDQ1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMjksIHk6IDU5LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAyODAsIHk6IDYwLCByOiAzNSwgZzogNDMsIGI6IDQ4IH0sXG4gICAgeyB4OiAzNDAsIHk6IDU4LCByOiAxNzYsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiA0MDcsIHk6IDY2LCByOiAzOCwgZzogNDUsIGI6IDQ3IH0sXG4gICAgeyB4OiA0NTYsIHk6IDg5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MjAsIHk6IDUwLCByOiA2NywgZzogNjgsIGI6IDY4IH0sXG4gICAgeyB4OiA1MjQsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MjksIHk6IDQzLCByOiAxNTEsIGc6IDE1NSwgYjogMTU2IH0sXG4gICAgeyB4OiAxODAsIHk6IDMwMiwgcjogNzUsIGc6IDE0OSwgYjogMjU1IH0sXG4gICAgeyB4OiAxNDQsIHk6IDI4OSwgcjogNDEsIGc6IDE0MiwgYjogMjU1IH0sXG4gICAgeyB4OiAxMTAsIHk6IDMwMCwgcjogMjIyLCBnOiAyMjMsIGI6IDIyMiB9LFxuICAgIHsgeDogMzM3LCB5OiAyODgsIHI6IDQxLCBnOiAxNDIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzY2LCB5OiAzMDIsIHI6IDI1MiwgZzogMjUzLCBiOiAyNTQgfSxcbiAgICB7IHg6IDQzOCwgeTogMzAyLCByOiAyNTUsIGc6IDIyNiwgYjogMTI1IH0sXG4gICAgeyB4OiA1MjIsIHk6IDMxMSwgcjogMjIyLCBnOiAyMjMsIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDUxOCwgeTogNTMgfSxcbiAgeyB4OiA1MTgsIHk6IDUzIH1cbik7XG5cbmV4cG9ydCBjb25zdCB0ZWFtU3VwcG9ydFBhY2thZ2VQcm9tb3Rpb24gPSBuZXcgUGFnZShcbiAgJ3RlYW1TdXBwb3J0UGFja2FnZVByb21vdGlvbicsXG4gIFtcbiAgICAvLyBoZWFkZXIgYmcgYW5kIHhcbiAgICB7IHg6IDU1OCwgeTogMzcsIHI6IDkwLCBnOiAxOTAsIGI6IDE0OCB9LFxuICAgIHsgeDogNTc2LCB5OiA0MiwgcjogMTQ4LCBnOiAyMDMsIGI6IDE3MyB9LFxuICAgIHsgeDogNTkwLCB5OiA0NSwgcjogMTQ1LCBnOiAyMDMsIGI6IDE3MSB9LFxuXG4gICAgLy8gcHVyY2hhc2UgYnV0dG9uXG4gICAgeyB4OiA1NzYsIHk6IDI3NywgcjogMjU1LCBnOiAyMjMsIGI6IDAgfSxcbiAgICB7IHg6IDQ4MCwgeTogMjc4LCByOiAyNTUsIGc6IDIxMCwgYjogMCB9LFxuICAgIHsgeDogNTA2LCB5OiAyNzgsIHI6IDEyMCwgZzogNzYsIGI6IDggfSxcbiAgICB7IHg6IDUyMiwgeTogMjc0LCByOiAyNDksIGc6IDI0NSwgYjogMCB9LFxuICAgIHsgeDogNTM4LCB5OiAyNzcsIHI6IDEyOCwgZzogODEsIGI6IDcgfSxcbiAgXSxcbiAgeyB4OiA1ODMsIHk6IDQ1IH0sXG4gIHsgeDogNTgzLCB5OiA0NSB9XG4pO1xuXG5leHBvcnQgY29uc3QgZW50ZXJHYW1lUHJvbW90aW9uID0gbmV3IFBhZ2UoXG4gICdlbnRlckdhbWVQcm9tb3Rpb24nLFxuICBbXG4gICAgLy8geFxuICAgIHsgeDogMjc3LCB5OiAyODAsIHI6IDExMywgZzogMTI0LCBiOiAxNDcgfSxcblxuICAgIC8vIGRvbnQgc2hvdyB0aGlzIGFnYWluIHRvZGF5XG4gICAgeyB4OiAyNDAsIHk6IDI4MCwgcjogMTAsIGc6IDcsIGI6IDMgfSxcbiAgICB7IHg6IDIwNywgeTogMjgxLCByOiAzNiwgZzogMzksIGI6IDQ3IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMjc5LCB5OiAzNiwgcjogMywgZzogMywgYjogMyB9LFxuICAgIHsgeDogNzYsIHk6IDE2OSwgcjogMCwgZzogMiwgYjogNSB9LFxuICAgIHsgeDogMzI2LCB5OiAzMzcsIHI6IDMsIGc6IDMsIGI6IDIgfSxcbiAgICB7IHg6IDU3MSwgeTogMjExLCByOiAyLCBnOiAyLCBiOiA1IH0sXG4gIF0sXG4gIHsgeDogNDg1LCB5OiAyODEgfSxcbiAgeyB4OiA0ODUsIHk6IDI4MSB9XG4pO1xuXG4vLyBUT0RPOiBhZGQgdGhpcyBwYWdlXG4vLyBleHBvcnQgY29uc3QgZW50ZXJHYW1lUHJvbW90aW9uID0gbmV3IFBhZ2UoXG4vLyAgICdlbnRlckdhbWVQcm9tb3Rpb24nLFxuLy8gICBbXG5cbi8vICAgXSxcbi8vICAgeyB4OiA1ODMsIHk6IDQ1IH0sXG4vLyAgIHsgeDogNTgzLCB5OiA0NSB9XG4vLyApO1xuXG4vLyBhIHBhZ2Ugd2l0aCBhIGNsb3NlIGJ0biBidXQgdGFsbGVyIHRoYW4gcHJvbW90aW9uIHBhZ2VcbmV4cG9ydCBjb25zdCBldmVudCA9IG5ldyBQYWdlKFxuICAnZXZlbnQnLFxuICBbXG4gICAgeyB4OiAyMCwgeTogMjEsIHI6IDI1MywgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDQ3LCB5OiAzMiwgcjogMTMyLCBnOiAxMzQsIGI6IDE0MCB9LFxuICAgIHsgeDogNDgsIHk6IDIzLCByOiAyNDYsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiA2MDMsIHk6IDE5LCByOiAxMjQsIGc6IDEzMCwgYjogMTMyIH0sXG4gICAgeyB4OiA2MTIsIHk6IDIyLCByOiA0OSwgZzogNTIsIGI6IDQ5IH0sXG4gICAgeyB4OiA2MjIsIHk6IDI2LCByOiAxODEsIGc6IDE3OCwgYjogMTgxIH0sXG4gIF0sXG4gIHsgeDogNjExLCB5OiAyMyB9LFxuICB7IHg6IDYxMSwgeTogMjMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJldmlld0FwcCA9IG5ldyBQYWdlKFxuICAncmV2aWV3QXBwJyxcbiAgW1xuICAgIHsgeDogMTA2LCB5OiA0MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzE2LCB5OiA1OCwgcjogODQsIGc6IDkwLCBiOiA5MyB9LFxuICAgIHsgeDogNTEwLCB5OiA0MywgcjogMTY4LCBnOiAxNzYsIGI6IDE3NiB9LFxuICAgIHsgeDogNTI1LCB5OiA1NywgcjogMTQzLCBnOiAxNDQsIGI6IDE0NCB9LFxuICAgIHsgeDogMzA1LCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzM4LCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMTE0LCB5OiAzMDEsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDE1MywgeTogMjk3LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMTc4LCB5OiAyOTksIHI6IDE2OCwgZzogMTkwLCBiOiAyMjQgfSxcbiAgICB7IHg6IDI0MSwgeTogMjk4LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAyODUsIHk6IDMwNSwgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDMwOCwgeTogMzAyLCByOiA3OSwgZzogMTA4LCBiOiAxNDUgfSxcbiAgICB7IHg6IDM2NSwgeTogMzAyLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0MjEsIHk6IDI5OSwgcjogOCwgZzogMTE0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzOCwgeTogMjk5LCByOiA0NywgZzogMTM4LCBiOiAyNTQgfSxcbiAgICB7IHg6IDQ4OSwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI1NSB9LFxuICAgIHsgeDogNTI4LCB5OiAzMDUsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgXSxcbiAgeyB4OiAxNjEsIHk6IDI5MiB9LFxuICB7IHg6IDE2MSwgeTogMjkyIH1cbik7XG5cbi8vIHBhZ2UgaGFzIG9rIGJ1dHRvblxuZXhwb3J0IGNvbnN0IG9rID0gbmV3IFBhZ2UoXG4gICdvaycsXG4gIFtcbiAgICB7IHg6IDI3OSwgeTogMzAwLCByOiAwLCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzEwLCB5OiAzMDEsIHI6IDEzNiwgZzogMTg4LCBiOiAyNTQgfSxcbiAgICB7IHg6IDMyNiwgeTogMzAxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjIsIHk6IDMwMCwgcjogMCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDM2OSwgeTogMzEyLCByOiA4LCBnOiAxMDEsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDMxOSwgeTogMzAzIH0sXG4gIHsgeDogMzE5LCB5OiAzMDMgfVxuKTtcblxuLy8gcGFnZSBoYXMgbmV4dCBidXR0b25cbmV4cG9ydCBjb25zdCBuZXh0ID0gbmV3IFBhZ2UoXG4gICduZXh0JyxcbiAgW1xuICAgIHsgeDogMjczLCB5OiAzMDQsIHI6IDgsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDMwNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzE0LCB5OiAzMTQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMSwgeTogMzA1LCByOiAyMjQsIGc6IDIzNiwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjgsIHk6IDMxMCwgcjogMSwgZzogMTA2LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMywgeTogMjk5LCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzc0LCB5OiAzMDUsIHI6IDgsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzODAsIHk6IDMxOSwgcjogMCwgZzogODksIGI6IDI0NyB9LFxuICAgIHsgeDogMjY1LCB5OiAzMTgsIHI6IDAsIGc6IDg5LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzNDYsIHk6IDMwNyB9LFxuICB7IHg6IDM0NiwgeTogMzA3IH1cbik7XG5cbmV4cG9ydCBjb25zdCBuZXh0MiA9IG5ldyBQYWdlKFxuICAnbmV4dCcsXG4gIFtcbiAgICB7IHg6IDIyNiwgeTogMjk2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAyNzUsIHk6IDI5NiwgcjogOCwgZzogMTIxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwNiwgeTogMjk5LCByOiAyNTQsIGc6IDI1NCwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTQsIHk6IDMwMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIxLCB5OiAyOTksIHI6IDIwMSwgZzogMjIzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMSwgeTogMjk5LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjQsIHk6IDMxMCwgcjogMCwgZzogOTQsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDM0NiwgeTogMzA3IH0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfVxuKTtcblxuLy8gbm9uLXNwZWNpZmljIGNvbmZpcm0gcGFnZSB3aXRoIG5vIGFuZCB5ZXMgYnRuXG5leHBvcnQgY29uc3QgY29uZmlybVdpdGhZUyA9IG5ldyBQYWdlKFxuICAnY29uZmlybVdpdGhZUycsXG4gIFtcbiAgICAvLyB4IG9uIHJpZ2h0IHRvcFxuICAgIHsgeDogNTEzLCB5OiA0NiwgcjogMTgyLCBnOiAxODYsIGI6IDE4OCB9LFxuICAgIHsgeDogNTIwLCB5OiA1MiwgcjogNzAsIGc6IDY5LCBiOiA3MCB9LFxuICAgIHsgeDogNTI3LCB5OiA0NSwgcjogNjcsIGc6IDY4LCBiOiA3MCB9LFxuICAgIHsgeDogNTMxLCB5OiA1NCwgcjogMTc0LCBnOiAxNzUsIGI6IDE3NiB9LFxuICAgIHsgeDogNTExLCB5OiA1MSwgcjogMTc4LCBnOiAxODAsIGI6IDE4NiB9LFxuXG4gICAgLy8gbm8gYnRuXG4gICAgeyB4OiAyMTIsIHk6IDMwMSwgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI0OSwgeTogMzAwLCByOiAxMjUsIGc6IDE1MiwgYjogMTg4IH0sXG4gICAgeyB4OiAyNzgsIHk6IDMwNywgcjogNDksIGc6IDgxLCBiOiAxMjMgfSxcblxuICAgIC8vIHllcyBidG5cbiAgICB7IHg6IDM2MywgeTogMjk0LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzg0LCB5OiAyOTcsIHI6IDI0NCwgZzogMjQ4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQxOSwgeTogMzA3LCByOiAwLCBnOiAxMDEsIGI6IDI0NyB9LFxuICAgIHsgeDogMzk1LCB5OiAyOTQsIHI6IDgsIGc6IDEyMiwgYjogMjU1IH0sXG5cbiAgICAvLyBmb290ZXIgYmdcbiAgICB7IHg6IDE0MiwgeTogMzA0LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MzAsIHk6IDI5NiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDUyMCwgeTogNTYgfSwgLy8geCBidG5cbiAgeyB4OiA1MjAsIHk6IDU2IH1cbik7XG5cbi8vIG5lZWQgdG8gdXBkYXRlIGFwayB2ZXJcbmV4cG9ydCBjb25zdCBlcnJvck5ld1VwZGF0ZUF2YWlsYWJsZSA9IG5ldyBQYWdlKFxuICAnZXJyb3JOZXdVcGRhdGVBdmFpbGFibGUnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDIwOCwgeTogNDUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDIzNiwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDI2MCwgeTogNTgsIHI6IDEyNSwgZzogMTI5LCBiOiAxMzMgfSxcbiAgICB7IHg6IDI3MiwgeTogNTcsIHI6IDEyOCwgZzogMTM2LCBiOiAxNDAgfSxcbiAgICB7IHg6IDMxMywgeTogNTYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMzNSwgeTogNTYsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDM2MywgeTogNjAsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDM4MSwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDM4OCwgeTogNjMsIHI6IDEyNiwgZzogMTMxLCBiOiAxMzQgfSxcbiAgICB7IHg6IDM5NywgeTogNjMsIHI6IDU3LCBnOiA2NCwgYjogNzAgfSxcbiAgICB7IHg6IDQwNywgeTogNTQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDQxOSwgeTogNTksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICAvLyBuZXcgdXBkYXRlIGluIGNvbnRlbnQgKDEwNClcbiAgICB7IHg6IDIyNywgeTogMTM5LCByOiAxNzYsIGc6IDE3OCwgYjogMTg0IH0sXG4gICAgeyB4OiAyODksIHk6IDE0NCwgcjogMTE3LCBnOiAxMjEsIGI6IDEyMSB9LFxuICAgIHsgeDogMjYwLCB5OiAxNDQsIHI6IDEwOCwgZzogMTEwLCBiOiAxMDggfSxcbiAgICB7IHg6IDMwOSwgeTogMTQ0LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMjYsIHk6IDE0MiwgcjogODcsIGc6IDkxLCBiOiA5MCB9LFxuICAgIHsgeDogMzQzLCB5OiAxNDMsIHI6IDgzLCBnOiA4OCwgYjogODggfSxcbiAgICB7IHg6IDM3NiwgeTogMTQ0LCByOiA2OSwgZzogNzEsIGI6IDY5IH0sXG4gICAgeyB4OiAzOTUsIHk6IDE0NCwgcjogNjgsIGc6IDcyLCBiOiA3MSB9LFxuICAgIHsgeDogNDA5LCB5OiAxNDQsIHI6IDEyMiwgZzogMTIzLCBiOiAxMjUgfSxcbiAgICB7IHg6IDQyMSwgeTogMTQ0LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMjg1LCB5OiAyOTcsIHI6IDgsIGc6IDExOCwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTIsIHk6IDI5NCwgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMCwgeTogMjk5LCByOiAxMzUsIGc6IDE4OCwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjQsIHk6IDMwNywgcjogMCwgZzogMTAyLCBiOiAyNDcgfSxcblxuICAgIC8vIHBvcHVwIGJnIGFuZCB4XG4gICAgeyB4OiAxMTcsIHk6IDQ2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MTIsIHk6IDQ2LCByOiAxODgsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MjQsIHk6IDU3LCByOiAxODksIGc6IDE4OSwgYjogMTg5IH0sXG4gICAgeyB4OiAxNTcsIHk6IDIzMiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjA5LCB5OiAyOTYsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQyMywgeTogMzA0LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0NDMsIHk6IDIyNywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICBdLFxuICAvLyBUT0RPOiBjaGVjayB3aGV0aGVyIG5lZWQgdG8gcHJlc3Mgb2tcbiAgeyB4OiAzMTQsIHk6IDI5OSB9LFxuICB7IHg6IDMxNCwgeTogMjk5IH1cbik7XG5cbi8vIGZvciBzb21lIHNpdHVhdGlvbiwgdW5leHBlY3RlZEVycm9yIGhhcHBlbnNcbi8vIHRoaXMgYWxzbyBpbmNsdWRlcyBuZXR3b3JrIGVycm9yXG5leHBvcnQgY29uc3QgdW5leHBlY3RlZEVycm9yID0gbmV3IFBhZ2UoXG4gICd1bmV4cGVjdGVkRXJyb3InLFxuICBbXG4gICAgeyB4OiAzMjMsIHk6IDM5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiA1MTQsIHk6IDQ0LCByOiA4MCwgZzogODEsIGI6IDgxIH0sXG4gICAgeyB4OiA1MjQsIHk6IDQ4LCByOiA2NCwgZzogNzAsIGI6IDcxIH0sXG4gICAgeyB4OiA1MTgsIHk6IDU0LCByOiA2NSwgZzogNzEsIGI6IDcxIH0sXG4gICAgeyB4OiAzMTUsIHk6IDI2OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzE1LCB5OiAyOTMsIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTYsIHk6IDI5OSwgcjogMjQxLCBnOiAyNDcsIGI6IDI1NSB9LFxuICAgIHsgeDogMzE3LCB5OiAzMTAsIHI6IDAsIGc6IDkyLCBiOiAyNDUgfSxcbiAgICB7IHg6IDMxNywgeTogMzEzLCByOiAwLCBnOiA4NSwgYjogMjQwIH0sXG4gICAgeyB4OiAzMTcsIHk6IDMyMywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDMxNCwgeTogMjk5IH0sXG4gIHsgeDogMzE0LCB5OiAyOTkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFwcElzTm90UmVzcG9uZGluZyA9IG5ldyBQYWdlKFxuICAnYXBwSXNOb3RSZXNwb25kaW5nJyxcbiAgW1xuICAgIHsgeDogMTY0LCB5OiAxNTQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE4OSwgeTogMTU3LCByOiAyMDMsIGc6IDIwMywgYjogMjAzIH0sXG4gICAgeyB4OiAyMjMsIHk6IDE1OCwgcjogMTcxLCBnOiAxNzEsIGI6IDE3MSB9LFxuICAgIHsgeDogMjU0LCB5OiAxNTgsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDI3MywgeTogMTU3LCByOiA5NiwgZzogOTYsIGI6IDk2IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE1NywgcjogNTQsIGc6IDU0LCBiOiA1NCB9LFxuICAgIHsgeDogMTY4LCB5OiAxODUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDIwNSwgeTogMTkwLCByOiAxMTksIGc6IDExOSwgYjogMTE5IH0sXG4gICAgeyB4OiAyMTgsIHk6IDE4NCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjMwLCB5OiAxODYsIHI6IDg1LCBnOiA4NSwgYjogODUgfSxcbiAgICB7IHg6IDE3MCwgeTogMjExLCByOiAxMjcsIGc6IDIwMiwgYjogMTk1IH0sXG4gICAgeyB4OiAyMTAsIHk6IDIxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTk5LCB5OiAyMTMsIHI6IDExMSwgZzogMTExLCBiOiAxMTEgfSxcbiAgICB7IHg6IDQ2NiwgeTogMTY2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0NjksIHk6IDIxOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDIyMCwgeTogMTg2IH0sIC8vIGNsb3NlIGFwcFxuICB7IHg6IDIyMCwgeTogMTg2IH1cbik7XG5cbi8vIHdpdGggbW9yZSBnYW1lcyBidXR0b25cbmV4cG9ydCBjb25zdCBxdWl0QXBwID0gbmV3IFBhZ2UoXG4gICdxdWl0QXBwJyxcbiAgW1xuICAgIHsgeDogMjc5LCB5OiA1NCwgcjogMTcwLCBnOiAxNzMsIGI6IDE3OCB9LFxuICAgIHsgeDogMzI0LCB5OiA2MCwgcjogMjAsIGc6IDI3LCBiOiAyOCB9LFxuICAgIHsgeDogNTE0LCB5OiA1MCwgcjogMTgxLCBnOiAxODIsIGI6IDE4MiB9LFxuICAgIHsgeDogNDY2LCB5OiAyOTUsIHI6IDgsIGc6IDEyMSwgYjogMjU1IH0sXG4gICAgeyB4OiA0MTQsIHk6IDI5OCwgcjogOTQsIGc6IDE1NywgYjogMjMzIH0sXG4gICAgeyB4OiA0OTYsIHk6IDMxMiwgcjogMCwgZzogOTAsIGI6IDI0NyB9LFxuICAgIHsgeDogNTIzLCB5OiAzMDksIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDExMSwgeTogMjk3LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzMDcsIHk6IDYwLCByOiAxMzMsIGc6IDEzNywgYjogMTQxIH0sXG4gICAgeyB4OiAzMTUsIHk6IDYxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMjQsIHk6IDYxLCByOiA1MiwgZzogNTYsIGI6IDYxIH0sXG4gIF0sXG4gIHsgeDogMzAwLCB5OiAzMDMgfSwgLy8gbm90IHRvIHF1aXRcbiAgeyB4OiAzMDAsIHk6IDMwMyB9XG4pO1xuXG5leHBvcnQgY29uc3QgcXVpdEFwcDEgPSBuZXcgUGFnZShcbiAgJ3F1aXRBcHAxJyxcbiAgW1xuICAgIHsgeDogMjYyLCB5OiA1NiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzAwLCB5OiA1NCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzIzLCB5OiA1NSwgcjogMjQsIGc6IDMwLCBiOiAzMiB9LFxuICAgIHsgeDogNTExLCB5OiA1MCwgcjogMTc4LCBnOiAxODAsIGI6IDE4NiB9LFxuICAgIHsgeDogNTIyLCB5OiA1NCwgcjogMTQxLCBnOiAxMzksIGI6IDE0MSB9LFxuICAgIHsgeDogNTIyLCB5OiA1NCwgcjogMTQxLCBnOiAxMzksIGI6IDE0MSB9LFxuICAgIHsgeDogMTY3LCB5OiAyOTksIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDI0MywgeTogMjk1LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMzE4LCB5OiAyOTgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDM4MiwgeTogMjk3LCByOiA4MywgZzogMTU4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUwMywgeTogMzAxLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0MzMsIHk6IDMxMCwgcjogMCwgZzogOTQsIGI6IDI0NyB9LFxuICAgIHsgeDogNDA0LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gICAgeyB4OiAyMTMsIHk6IDMwNywgcjogNDksIGc6IDgxLCBiOiAxMjMgfSxcbiAgXSxcbiAgeyB4OiAyMTMsIHk6IDMwNyB9LCAvLyBub3QgdG8gcXVpdFxuICB7IHg6IDIxMywgeTogMzA3IH1cbik7XG4iLCJleHBvcnQgKiBmcm9tICcuL3Rhc2tOYW1lcyc7XG5leHBvcnQgKiBhcyB3ZWVrbHlNaXNzaW9uIGZyb20gJy4vd2Vla2x5TWlzc2lvbic7XG5leHBvcnQgKiBhcyBzZXR0aW5nIGZyb20gJy4vc2V0dGluZyc7XG4iLCJpbXBvcnQgeyBVdGlscywgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcbmltcG9ydCB7IHN0YXRlLCByZXJvdXRlciB9IGZyb20gJy4uL21vZHVsZXMnO1xuXG5pbXBvcnQgeyBUQVNLIH0gZnJvbSAnLi90YXNrTmFtZXMnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBpc1NhbWVDb2xvciwgYXJyYXlGaW5kIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVGFzaygpIHtcbiAgY29uc29sZS5sb2coJ2FkZFRhc2sgc2V0dGluZycpO1xuICAvLyBvbmx5IHJ1biBvbmNlXG4gIHJlcm91dGVyLmFkZFRhc2soe1xuICAgIG5hbWU6IFRBU0suc2V0dGluZ0RlZmF1bHQsXG4gICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgIG1pblJvdW5kSW50ZXJ2YWw6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRSb3V0ZXMoKSB7XG4gIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICBwYXRoOiBgLyR7c2V0dGluZ3MubmFtZX1gLFxuICAgIG1hdGNoOiBzZXR0aW5ncyxcbiAgICBhY3Rpb246IChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgICAgY29uc3QgaW5hY3RpdmVUYWJDb2xvciA9IHsgcjogNTgsIGc6IDY1LCBiOiA3NCB9O1xuICAgICAgY29uc3QgdGFiID0gYXJyYXlGaW5kKE9iamVjdC5rZXlzKHNldHRpbmdzVGFicyksIHQgPT4ge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHNldHRpbmdzVGFic1t0IGFzIGtleW9mIHR5cGVvZiBzZXR0aW5nc1RhYnNdO1xuICAgICAgICByZXR1cm4gIWlzU2FtZUNvbG9yKGltYWdlLCB7IHgsIHksIC4uLmluYWN0aXZlVGFiQ29sb3IgfSk7XG4gICAgICB9KTtcblxuICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICBjYXNlIFRBU0suc2V0dGluZ0RlZmF1bHQ6XG4gICAgICAgICAgaWYgKHRhYiA9PT0gJ2dyYXBoaWNUYWInKSB7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHNldHRpbmdzR3JhcGhUYWJCdG5zLnBvd2VyU2F2ZU9uKTtcbiAgICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGdvIHRvIGdyYXBoaWNUYWJcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoc2V0dGluZ3NUYWJzLmdyYXBoaWNUYWIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzOlxuICAgICAgICAgIGlmICghc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcykge1xuICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZ28gdG8gbGVhZ3VlUmVzZXREaWFsb2dcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHNldHRpbmdzQnRucy5sZWFndWVSZXNldCk7XG4gICAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKHNldHRpbmdzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICAvLyBGSVhNRTogdGhpcyBzaG91bGQgb25seSBydW4gd2hlbiBuZWVkZWRcbiAgcmVyb3V0ZXIuYWRkVGFzayh7XG4gICAgbmFtZTogVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzcyxcbiAgICBtaW5Sb3VuZEludGVydmFsOiAxICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgbWF4VGFza0R1cmluZzogMTAgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICBiZWZvcmVSb3V0ZTogdGFzayA9PiB7XG4gICAgICBpZiAoIXN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgIH1cbiAgICB9LFxuICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgfSk7XG59XG5cbmNvbnN0IHNldHRpbmdzID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncycsXG4gIFtcbiAgICAvLyBuYXZpIGluIHJpZ2h0XG4gICAgLy8geyB4OiA2MjUsIHk6IDcsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICAvLyB7IHg6IDU5MywgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgLy8geyB4OiA1OTAsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIC8vIHsgeDogNDg3LCB5OiAxNSwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIC8vIHsgeDogNDgxLCB5OiAxNSwgcjogNzcsIGc6IDg2LCBiOiA5MyB9LFxuICAgIC8vIHsgeDogMzkxLCB5OiAxMSwgcjogNzksIGc6IDgwLCBiOiA3OSB9LFxuICAgIC8vIHsgeDogMzc4LCB5OiAxNiwgcjogMTMzLCBnOiAxNTAsIGI6IDE2OSB9LFxuICAgIC8vIHsgeDogMzEzLCB5OiAxMSwgcjogMTc4LCBnOiAxNzgsIGI6IDE3OSB9LFxuXG4gICAgLy8gYmcgb2YgcmlnaHQgc2VjdGlvblxuICAgIHsgeDogNDc4LCB5OiAxMTksIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ3NiwgeTogMTc1LCByOiAzNiwgZzogNDAsIGI6IDQ0IH0sXG4gICAgeyB4OiA0NzYsIHk6IDIyOCwgcjogMTA3LCBnOiA5NywgYjogOTAgfSxcbiAgICB7IHg6IDQ3NCwgeTogMjgzLCByOiA2NiwgZzogNzcsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI5MywgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYwNSwgeTogMTc4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDgsIHk6IDEyMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuXG4gICAgLy8gZ29vZ2xlIHBsYXkgZ2FtZSBpY29uIGluIHJpZ2h0IHNlY3Rpb25cbiAgICB7IHg6IDQ5MCwgeTogMTE1LCByOiAzNSwgZzogMzgsIGI6IDUxIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNSwgeTogMzEyLCByOiAxOTMsIGc6IDE5OCwgYjogMTkxIH0sXG4gICAgeyB4OiAzOSwgeTogMzIyLCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmNvbnN0IHNldHRpbmdzVGFicyA9IHtcbiAgc291bmRBbmRMYW5UYWI6IHsgeDogMjIsIHk6IDU1IH0sXG4gIGdyYXBoaWNUYWI6IHsgeDogMTExLCB5OiA1NSB9LFxufTtcbmNvbnN0IHNldHRpbmdzQnRucyA9IHtcbiAgbGVhZ3VlUmVzZXQ6IHsgeDogNTYyLCB5OiAyMTcgfSxcbn07XG5cbi8vIEZJWE1FOiBhZGQgbGFuIGNoYW5nZSBwYWdlc1xuY29uc3Qgc2V0dGluZ3NTb3VuZFRhYiA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3Mvc291bmQnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogNjIxLCB5OiA4LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEwLCByOiA3NCwgZzogOTcsIGI6IDEzMSB9LFxuICAgIHsgeDogNTAzLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogMzkyLCB5OiAxMiwgcjogMTc2LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogMzE1LCB5OiA4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE3LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvLyBoaWdobGlnaHRlZCBzb3VuZCB0YWJcbiAgICB7IHg6IDE5LCB5OiA2MCwgcjogMCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDIwLCB5OiA3MSwgcjogMCwgZzogODksIGI6IDIyMiB9LFxuICAgIHsgeDogOTUsIHk6IDY5LCByOiAwLCBnOiA5MiwgYjogMjMwIH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAxMTcsIHk6IDU2LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAyMDUsIHk6IDU0LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzMDAsIHk6IDUyLCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzOTQsIHk6IDU1LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG5cbiAgICAvLyBiZyB0YWJsZVxuICAgIHsgeDogMjAsIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAyMCwgeTogMjkyLCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA0NTksIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NjAsIHk6IDI4OSwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuXG4gICAgLy8gcmlnaHQgc2lkZWJhciBiZ1xuICAgIHsgeDogNDgwLCB5OiAxMjAsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ4MywgeTogMTc5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0ODUsIHk6IDIzMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNDg2LCB5OiAyODYsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMiwgeTogMTE5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTAsIHk6IDE4MCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMCwgeTogMjg3LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmNvbnN0IHNldHRpbmdzU291bmRUYWJCdG5zID0ge1xuICBsYW5nOiB7IHg6IDQwMSwgeTogMTkwIH0sXG4gIC8vIGFkZCBtb3JlIGlmIG5lZWQgbW9yZSBzZXR0aW5nXG59O1xuY29uc3Qgc2V0dGluZ3NTb3VuZFRhYkxhblNlbGVjdCA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3Mvc291bmQvbGFuU2VsZWN0JyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAyOTMsIHk6IDE4LCByOiAyNSwgZzogMjAsIGI6IDI1IH0sXG4gICAgeyB4OiA0MywgeTogMzQzLCByOiA4LCBnOiA0LCBiOiAwIH0sXG4gICAgeyB4OiA2MjIsIHk6IDM0NSwgcjogOCwgZzogOCwgYjogOCB9LFxuXG4gICAgLy8gbGFuZyBlbmdsaXNoIGJ0blxuICAgIHsgeDogMTYwLCB5OiAxMjcsIHI6IDQ5LCBnOiA4OSwgYjogMTIzIH0sXG4gICAgeyB4OiAxOTAsIHk6IDEzMiwgcjogNTgsIGc6IDkyLCBiOiAxMjkgfSxcbiAgICB7IHg6IDIxMywgeTogMTMzLCByOiA4MCwgZzogMTEzLCBiOiAxNTEgfSxcbiAgICB7IHg6IDIyOSwgeTogMTMzLCByOiAxNjYsIGc6IDE4OSwgYjogMjE4IH0sXG4gICAgeyB4OiAyNDEsIHk6IDEzMywgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI2NiwgeTogMTQyLCByOiA0OSwgZzogODEsIGI6IDExNSB9LFxuICAgIHsgeDogMjgyLCB5OiAxMjksIHI6IDQ5LCBnOiA4OSwgYjogMTIzIH0sXG4gICAgeyB4OiAxNjYsIHk6IDE0NSwgcjogNDEsIGc6IDc3LCBiOiAxMTUgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI2LCB5OiAzMTYsIHI6IDIwNiwgZzogMjEwLCBiOiAyMDYgfSxcbiAgICB7IHg6IDQzLCB5OiAzMjEsIHI6IDIwNiwgZzogMjEwLCBiOiAyMDYgfSxcbiAgICB7IHg6IDM0LCB5OiAzMjksIHI6IDIwMSwgZzogMjA2LCBiOiAyMDEgfSxcbiAgXSxcbiAgeyB4OiAyMDAsIHk6IDEzMSB9LCAvLyBlbmdsaXNoIGJ0blxuICB7IHg6IDIwMCwgeTogMTMxIH0gLy8gZW5nbGlzaCBidG5cbik7XG5jb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0UHJvY2VlZEJ0bnMgPSB7XG4gIHllczogeyB4OiA0MDcsIHk6IDMwNyB9LFxufTtcblxuY29uc3Qgc2V0dGluZ3NHcmFwaFRhYiA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3MvZ3JhcGgnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogNjIxLCB5OiA4LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEwLCByOiA3NCwgZzogOTcsIGI6IDEzMSB9LFxuICAgIHsgeDogNTAzLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogMzkyLCB5OiAxMiwgcjogMTc2LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogMzE1LCB5OiA4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE3LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvLyBoaWdobGlnaHRlZCBncmFwaCB0YWJcbiAgICB7IHg6IDEyMywgeTogNTksIHI6IDAsIGc6IDEwMSwgYjogMjU0IH0sXG4gICAgeyB4OiAxNDksIHk6IDU5LCByOiAyOCwgZzogMTE5LCBiOiAyNTQgfSxcbiAgICB7IHg6IDE3NywgeTogNjQsIHI6IDAsIGc6IDk3LCBiOiAyMzggfSxcblxuICAgIC8vIG90aGVyIHRhYnNcbiAgICB7IHg6IDM3LCB5OiA2MywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogNjIsIHk6IDYyLCByOiAxMzQsIGc6IDE0MywgYjogMTU4IH0sXG4gICAgeyB4OiAyMzIsIHk6IDU3LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAyNjcsIHk6IDYzLCByOiAxNTYsIGc6IDE2NywgYjogMTgwIH0sXG4gICAgeyB4OiAzMjIsIHk6IDYzLCByOiAxNjAsIGc6IDE2NSwgYjogMTgwIH0sXG4gICAgeyB4OiAzNTMsIHk6IDYzLCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiA0MDEsIHk6IDY0LCByOiAxNzEsIGc6IDE3OSwgYjogMTkyIH0sXG4gICAgeyB4OiA0NDAsIHk6IDYxLCByOiAxNTUsIGc6IDE1OSwgYjogMTc3IH0sXG5cbiAgICAvLyBiZyB0YWJsZVxuICAgIHsgeDogMTksIHk6IDkwLCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAyMywgeTogMjkxLCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NTksIHk6IDg0LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NTgsIHk6IDI4NywgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDQxLCB5OiAzMjAgfSxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5jb25zdCBzZXR0aW5nc0dyYXBoVGFiQnRucyA9IHtcbiAgcXVhbGl0eU5vcm1hbDogeyB4OiAyMTIsIHk6IDEyMCB9LFxuICBtYXhGUFMzMDogeyB4OiA4MywgeTogMTc1IH0sXG4gIHBvd2VyU2F2ZU9uOiB7IHg6IDIyMiwgeTogMjIyIH0sXG4gIGJpZ0hlYWRNb2RlT2ZmOiB7IHg6IDg2LCB5OiAyODMgfSxcbiAgLy8gYWRkIG1vcmUgaWYgbmVlZCBtb3JlIHNldHRpbmdcbn07XG4iLCJleHBvcnQgZW51bSBUQVNLIHtcbiAgcmVzdGFydEFwcFBlckRheSA9ICdyZXN0YXJ0QXBwUGVyRGF5JyxcbiAgc2V0dGluZ0RlZmF1bHQgPSAnc2V0dGluZ0RlZmF1bHQnLFxuICBzZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzcyA9ICdzZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzcycsXG4gIHBsYXlMZWFndWVHYW1lID0gJ3BsYXlMZWFndWVHYW1lJyxcbiAgcGxheUJhdHRsZUdhbWUgPSAncGxheUJhdHRsZUdhbWUnLFxuICBhZFJld2FyZCA9ICdhZFJld2FyZCcsXG4gIHdlZWtseU1pc3Npb24gPSAnd2Vla2x5TWlzc2lvbicsXG4gIHJlY2lldmVJbmJveCA9ICdyZWNpZXZlSW5ib3gnLFxuICBzdGF5SW5Mb2dpbiA9ICdzdGF5SW5Mb2dpbicsXG4gIHVwbG9hZENhY2hlID0gJ3VwbG9hZENhY2hlJyxcbiAgc2VuZEFsaXZlRXZlbnQgPSAnc2VuZEFsaXZlRXZlbnQnLFxuICBzZW5kV2FpdEV2ZW50ID0gJ3NlbmRXYWl0RXZlbnQnLFxufVxuIiwiaW1wb3J0IHsgVXRpbHMsIFBhZ2UgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgeyBzdGF0ZSwgcmVyb3V0ZXIgfSBmcm9tICcuLi9tb2R1bGVzJztcblxuaW1wb3J0IHsgVEFTSyB9IGZyb20gJy4vdGFza05hbWVzJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNTYW1lQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYXNrKCkge1xuICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICBuYW1lOiBUQVNLLndlZWtseU1pc3Npb24sXG4gICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5kYXlJbk1zLFxuICAgIG1heFRhc2tEdXJpbmc6IDMwICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgZm9yY2VTdG9wOiB0cnVlLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJvdXRlcygpIHtcbiAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgIHBhdGg6IGAvJHthY2hpZXZlbWVudE1pc3Npb24ubmFtZX1gLFxuICAgIG1hdGNoOiBhY2hpZXZlbWVudE1pc3Npb24sXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UpID0+IHtcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLndlZWtseU1pc3Npb24pIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGNvbGxlY3QgZGFpbHkgb25lIGlmIGF2YWlsYWJsZVxuICAgICAgY29uc3QgeCA9IDYxMztcbiAgICAgIGNvbnN0IGNhbkNvbGxlY3RDb2xvciA9IHsgcjogOCwgZzogMTI1LCBiOiAyNTUgfTtcbiAgICAgIGZvciAobGV0IHkgPSAxMjg7IHkgPCAyNjA7IHkgKz0gNDQpIHtcbiAgICAgICAgY29uc3QgY2FuQ29sbGVjdCA9IGlzU2FtZUNvbG9yKGltYWdlLCB7IHgsIHksIC4uLmNhbkNvbGxlY3RDb2xvciB9KTtcbiAgICAgICAgaWYgKGNhbkNvbGxlY3QpIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeCwgeSB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY29sbGVjdCcpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVyb3V0ZXIuZ29OZXh0KGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgfSxcbiAgfSk7XG4gIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICBwYXRoOiBgLyR7d2Vla2x5TWlzc2lvbkJveC5uYW1lfWAsXG4gICAgbWF0Y2g6IHdlZWtseU1pc3Npb25Cb3gsXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICBzdGF0ZS5jaGVja1VwbG9hZFNlc3Npb24oKTtcbiAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy53ZWVrbHlNaXNzaW9uKSB7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayh3ZWVrbHlNaXNzaW9uQm94KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW5Db2xsZWN0Q29sb3IgPSB7IHI6IDE4OSwgZzogMTk0LCBiOiAxOTcgfTtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFsyNywgMTE1XTtcbiAgICAgIGNvbnN0IFt3LCBoXSA9IFsxOTgsIDc1XTtcbiAgICAgIC8vIGNsaWNrIG9wZW5Cb3ggb25seSB3aGVuIGFsbCBtaXNzaW9uIGlzIGNvbXBsZXRlXG4gICAgICAvLyBiYyBpdCBpcyBhYmxlZCBvbmNlIGEgd2Vla1xuICAgICAgZm9yICh2YXIgZHggPSAwOyBkeCA8IDMgKiB3OyBkeCArPSB3KSB7XG4gICAgICAgIGZvciAodmFyIGR5ID0gMDsgZHkgPCAzICogaDsgZHkgKz0gaCkge1xuICAgICAgICAgIGNvbnN0IGNhbkNvbGxlY3QgPSBpc1NhbWVDb2xvcihpbWFnZSwgeyB4OiB4ICsgZHgsIHk6IHkgKyBkeSwgLi4uY2FuQ29sbGVjdENvbG9yIH0pO1xuICAgICAgICAgIGlmICghY2FuQ29sbGVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhaXQgYWxsIHdlZWtseSBtaXNzaW9uIGNvbXBsZXRlJyk7XG4gICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnY2xpY2sgb3BlbicpO1xuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh3ZWVrbHlNaXNzaW9uQm94QnRucy5vcGVuQm94KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIC8vIFRPRE86IGxldCB1c2VyIHNlbGVjdCB0aGUgaXRlbSB0aGV5IHdhbnQgaW4gdGhlIGZ1dHVyZVxuICAgICAgLy8gc2VsZWN0IHRoZSBsZWZ0IGJvdHRvbSBvbmVcbiAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgcmlnaHQgYm90dG9tIGl0ZW0nKTtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiB4ICsgMiAqIHcsIHk6IHkgKyAyICogaCB9KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlIHJpZ2h0IGJvdHRvbSBpdGVtJyk7XG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKHdlZWtseU1pc3Npb25Cb3hCdG5zLnJlY2VpdmVSZXdhcmQpO1xuXG4gICAgICAvLyBlbnRlciByZWNlaXZlIGNvbmZpcm0gcGFnZVxuICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICB9LFxuICB9KTtcblxuICBbd2Vla2x5TWlzc2lvbkJveENvbmZpcm0sIHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZF0uZm9yRWFjaChwID0+IHtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICBtYXRjaDogcCxcbiAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgfSk7XG4gIH0pO1xufVxuXG5jb25zdCBhY2hpZXZlbWVudE1pc3Npb24gPSBuZXcgUGFnZShcbiAgJ2FjaGlldmVtZW50TWlzc2lvbicsXG4gIFtcbiAgICAvLyB0b2RheSBtaXNzaW9uIGJnXG4gICAgeyB4OiAyMzUsIHk6IDU1LCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiAyMzEsIHk6IDcxLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiA1ODgsIHk6IDcyLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG5cbiAgICAvLyBsZWZ0IHNlY3Rpb24gd29ybGQgcmVjb3JkIGJnIGxlZnQgYm90dG9tXG4gICAgeyB4OiAxNiwgeTogMjkzLCByOiAyNSwgZzogNDAsIGI6IDc0IH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVhZFxuICAgIHsgeDogNzUsIHk6IDg4LCByOiA2NiwgZzogNTksIGI6IDkwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAzMSwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNTgwLCB5OiAyNzggfSwgLy8gY29tcGxldGUgd2Vla2x5IG1pc3Npb24gYm94XG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5jb25zdCB3ZWVrbHlNaXNzaW9uQm94ID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94JyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCAocCwgc3RhciAuLi4pXG4gICAgeyB4OiAyOTksIHk6IDEzLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTgsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMxMywgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzkyLCB5OiA5LCByOiAyMzIsIGc6IDIyOSwgYjogMjMyIH0sXG4gICAgeyB4OiAzODUsIHk6IDIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ5NiwgeTogMTMsIHI6IDIzOCwgZzogMTY2LCBiOiAxNiB9LFxuICAgIHsgeDogNDgzLCB5OiA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE2IH0sXG4gICAgeyB4OiA1OTcsIHk6IDEwLCByOiAyMTMsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0LCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG5cbiAgICAvLyBiZyBvZiB0YWJsZVxuICAgIHsgeDogMTQsIHk6IDgyLCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAxNiwgeTogMjg4LCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTUsIHk6IDEwMCwgcjogMzMsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAyODMsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvb3RlclxuICAgIHsgeDogODAsIHk6IDMwNywgcjogMjAyLCBnOiAyMDEsIGI6IDE5NiB9LFxuICAgIHsgeDogODksIHk6IDMxNSwgcjogNDksIGc6IDYxLCBiOiAzNCB9LFxuICAgIHsgeDogMTAzLCB5OiAzMTksIHI6IDczLCBnOiA4MywgYjogNjYgfSxcbiAgICB7IHg6IDE3MiwgeTogMzM1LCByOiA3OCwgZzogODQsIGI6IDcyIH0sXG4gICAgeyB4OiAyNTAsIHk6IDMzOCwgcjogMTAxLCBnOiAxMDYsIGI6IDkzIH0sXG4gICAgeyB4OiAyNzMsIHk6IDMwNywgcjogMTU5LCBnOiAxNTksIGI6IDE0OSB9LFxuICAgIHsgeDogMjg0LCB5OiAzMDksIHI6IDU2LCBnOiA2MSwgYjogNDAgfSxcblxuICAgIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAyNCwgeTogMzE0LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MiwgeTogMzE3LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMSwgeTogMzMxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LCAvLyBiYWNrIGJ0blxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveEJ0bnMgPSB7XG4gIG9wZW5Cb3g6IHsgeDogNDE4LCB5OiAzMjUgfSxcbiAgcmVjZWl2ZVJld2FyZDogeyB4OiA1NjEsIHk6IDMyNiB9LFxufTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveENvbmZpcm0gPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3hDb25maXJtJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTEsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE1LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxOSwgeTogMTc3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjQwLCB5OiA1OCwgcjogMTU1LCBnOiAxNjAsIGI6IDE2MyB9LFxuICAgIHsgeDogMjY3LCB5OiA1OCwgcjogMTQxLCBnOiAxNDcsIGI6IDE0OSB9LFxuICAgIHsgeDogMzI1LCB5OiA1OSwgcjogMTYxLCBnOiAxNjcsIGI6IDE3MCB9LFxuICAgIHsgeDogMzgzLCB5OiA1OSwgcjogMTcxLCBnOiAxNzksIGI6IDE3OSB9LFxuICAgIHsgeDogNDA3LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTE1LCB5OiA0OSwgcjogMTg3LCBnOiAxODUsIGI6IDE4OCB9LFxuICAgIHsgeDogNTE5LCB5OiA1NSwgcjogOTEsIGc6IDkxLCBiOiA5MiB9LFxuXG4gICAgLy8gbm8gJiB5ZXMgYnRuXG4gICAgeyB4OiAyMTAsIHk6IDI5MywgcjogNDEsIGc6IDgxLCBiOiAxMjMgfSxcbiAgICB7IHg6IDIzOCwgeTogMjk2LCByOiA0NSwgZzogODEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjg0LCB5OiAyOTQsIHI6IDQxLCBnOiA3OCwgYjogMTIzIH0sXG5cbiAgICB7IHg6IDM5NywgeTogMjk5LCByOiA0MCwgZzogMTM0LCBiOiAyNTMgfSxcbiAgICB7IHg6IDQzMywgeTogMzA3LCByOiA4LCBnOiA5OCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzg3LCB5OiAzMDAgfSwgLy8geWVzIGJ0blxuICB7IHg6IDM4NywgeTogMzAwIH1cbik7XG5cbmNvbnN0IHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTMsIHk6IDUzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNywgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDk2LCB5OiAyOTksIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMTcsIHk6IDU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyNTksIHk6IDU1LCByOiAxNzcsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiAyOTgsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDEsIHk6IDYwLCByOiAxMjAsIGc6IDEyNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTIsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTgyIH0sXG4gICAgeyB4OiA1MTksIHk6IDUzLCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBvayBidG5cbiAgICB7IHg6IDI4OCwgeTogMjk3LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMDAsIHI6IDEzNiwgZzogMTkwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzAxLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sIC8vIG9rIGJ0blxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG4iLCJpbXBvcnQgeyBVdGlscywgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNhdmVQYWdlUmVmZXJlbmNlKGltZzogSW1hZ2UsIHBhZ2U6IFBhZ2UpIHtcbiAgY29uc3QgeyBuYW1lLCBwb2ludHMgfSA9IHBhZ2U7XG4gIGNvbnN0IHJhZGl1cyA9IDM7XG4gIGNvbnN0IHJnYmE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzI1NSwgMjAsIDE0NywgMF07XG4gIGZvciAoY29uc3QgeyB4LCB5IH0gb2YgcG9pbnRzKSB7XG4gICAgZHJhd0NpcmNsZShpbWcsIHgsIHksIHJhZGl1cywgLi4ucmdiYSk7XG4gIH1cbiAgc2F2ZUltYWdlKGltZywgYC9zZGNhcmQvUGljdHVyZXMvU2NyZWVuc2hvdHMvcm9ib3Rtb24vbWxiLyR7bmFtZX0ucG5nYCk7XG4gIGNvbnNvbGUubG9nKGBbU2F2ZVBhZ2VSZWZlcmVuY2VdOiAke25hbWV9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlQ29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCByZXN1bHRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgY29tbWFuZHMpIHtcbiAgICBjb25zdCByZXMgPSBleGVjdXRlKGNvbW1hbmQpO1xuICAgIGlmIChlbmRzV2l0aChyZXMsICdleGl0IHN0YXR1cyAxJykpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbRXJyb3JdOiAke2NvbW1hbmR9IDpcXG4gJHtyZXN9XFxuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBbT2tdOiAke2NvbW1hbmR9IDpcXG4gJHtyZXN9XFxuYCk7XG4gICAgICBjb25zb2xlLmxvZyhgW09rXTogJHtjb21tYW5kfWApO1xuICAgIH1cbiAgICByZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZHNXaXRoKHN0cjogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlGaW5kPFQ+KGFycjogVFtdLCBjb25kaXRpb246IChlbDogVCkgPT4gYm9vbGVhbik6IFQgfCB1bmRlZmluZWQge1xuICBmb3IgKGNvbnN0IGVsIG9mIGFycikge1xuICAgIGlmIChjb25kaXRpb24oZWwpKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVDb2xvcihpbWFnZTogSW1hZ2UgfCBSR0IsIHRhcmdldDogWFlSR0IgfCBSR0IsIHRocmVzOiBudW1iZXIgPSAwLjgpOiBib29sZWFuIHtcbiAgbGV0IGltYWdlUkdCOiBSR0IgfCB1bmRlZmluZWQ7XG4gIGlmICgncicgaW4gaW1hZ2UpIHtcbiAgICAvLyBpbWFnZSBpcyBSR0JcbiAgICBpbWFnZVJHQiA9IGltYWdlO1xuICB9IGVsc2UgaWYgKCd4JyBpbiB0YXJnZXQpIHtcbiAgICAvLyBpbWFnZSBpcyBJbWFnZSwgdGFyZ2V0IGlzIFhZUkdCXG4gICAgaW1hZ2VSR0IgPSBnZXRJbWFnZUNvbG9yKGltYWdlLCB0YXJnZXQueCwgdGFyZ2V0LnkpO1xuICB9XG5cbiAgaWYgKGltYWdlUkdCID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBpcyBub3QgWFlSR0InKTtcbiAgfVxuXG4gIGNvbnN0IHNjb3JlID0gVXRpbHMuaWRlbnRpdHlDb2xvcihpbWFnZVJHQiwgdGFyZ2V0KTtcbiAgcmV0dXJuIHNjb3JlID4gdGhyZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xvckNvdW50SW5SYW5nZShpbWFnZTogSW1hZ2UsIGxlZnRUb3A6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgcmlnaHRCb3R0b206IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSk6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSB7XG4gIGNvbnN0IGNudDogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gIGNvbnN0IHsgeDogeDEsIHk6IHkxIH0gPSBsZWZ0VG9wO1xuICBjb25zdCB7IHg6IHgyLCB5OiB5MiB9ID0gcmlnaHRCb3R0b207XG4gIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcbiAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gZ2V0SW1hZ2VDb2xvcihpbWFnZSwgeCwgeSk7XG4gICAgICBjb25zdCBjb2xvciA9IGAke3J9LSR7Z30tJHtifWA7XG4gICAgICBpZiAoY250W2NvbG9yXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNudFtjb2xvcl0gPSAwO1xuICAgICAgfVxuICAgICAgY250W2NvbG9yXSsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY250O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lQ29sb3JDb3VudChjbnQxOiB7IFtjb2xvcjogc3RyaW5nXTogbnVtYmVyIH0sIGNudDI6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xuICBjb25zdCBrZXlzMSA9IE9iamVjdC5rZXlzKGNudDEpO1xuICBjb25zdCBrZXlzMiA9IE9iamVjdC5rZXlzKGNudDIpO1xuICBpZiAoa2V5czEubGVuZ3RoICE9PSBrZXlzMi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5czEpIHtcbiAgICBpZiAoY250MVtrZXldICE9PSBjbnQyW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgTUxCOUkgfSBmcm9tICcuL3NyYyc7XG5cbmxldCBtbGI5aTogTUxCOUkgfCB1bmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoanNvbkNvbmZpZzogYW55KSB7XG4gIG1sYjlpID0gbmV3IE1MQjlJKGpzb25Db25maWcpO1xuICBtbGI5aS5zdGFydCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHN0b3AoKSB7XG4gIGlmIChtbGI5aSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG1sYjlpLnN0b3AoKTtcbiAgbWxiOWkgPSB1bmRlZmluZWQ7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7fVxufVxuKHdpbmRvdyBhcyBhbnkpLnN0YXJ0ID0gc3RhcnQ7XG4od2luZG93IGFzIGFueSkuc3RvcCA9IHN0b3A7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
function start(jsonConfig){window.start(jsonConfig);}
function stop(){window.stop();}

