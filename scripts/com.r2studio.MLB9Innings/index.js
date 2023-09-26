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
exports.duringMaxAdRetry = 2 * exports.minuteInMs;
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
var VERSION_CODE = 15.34;
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
        [PAGE.logIn, PAGE.logIn90].forEach(function (p) {
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
        modules_1.rerouter.addRoute({
            path: "/".concat(PAGE.rankedBattleResult.name),
            match: PAGE.rankedBattleResult,
            action: this.wrapRouteAction('goNext'),
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
            Rerouter_1.Utils.log("unknown count ".concat(context.matchTimes, ", during ").concat(context.matchDuring, ", last matched: ").concat(context.lastMatchedPath));
            var isInApp = modules_1.rerouter.checkInApp();
            if (!isInApp) {
                console.log('not in app');
                if (modules_1.Config.config.hasCoolFeature) {
                    modules_1.rerouter.restartApp();
                }
                return;
            }
            switch (context.lastMatchedPath.substring(1)) {
                case PAGE.adReward.name:
                    return _this.handleCloseAd();
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
    isRunAdReward: true,
    isRunPlayBattleGame: true,
};
function set(jsonConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
    exports.config.hasCoolFeature = exports.config.isCloud || exports.config.isLocalPaid || c.isDev || false;
    exports.config.isRunAdReward = exports.config.hasCoolFeature && ((_k = c.isRunAdReward) !== null && _k !== void 0 ? _k : exports.config.isRunAdReward);
    exports.config.isRunPlayBattleGame = exports.config.hasCoolFeature && ((_l = c.isRunPlayBattleGame) !== null && _l !== void 0 ? _l : exports.config.isRunPlayBattleGame);
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
// if not set packageName first, cannot handle start/ stop app
Rerouter_1.rerouter.rerouterConfig.packageName = CONSTANTS.packageName;
Rerouter_1.rerouter.rerouterConfig.startAppDelay = 10 * 1000;
Rerouter_1.rerouter.screenConfig.rotation = 'horizontal';
Rerouter_1.rerouter.screenConfig.devHeight = 360;
Rerouter_1.rerouter.screenConfig.devWidth = 640;
Rerouter_1.rerouter.debug = true;
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
    if (useInterval === void 0) { useInterval = false; }
    EventSender.running(useInterval);
}
exports.onRunning = onRunning;
function onLoginPage(needUserInput) {
    if (needUserInput === void 0) { needUserInput = false; }
    hasSession = false;
    exports.isWaitingLogin = true;
    // use interval in running
    EventSender.running(true);
    if (needUserInput) {
        EventSender.loginInputing();
    }
}
exports.onLoginPage = onLoginPage;
function onLoginSuccess() {
    hasSession = true;
    exports.isWaitingLogin = false;
    EventSender.loginSuccess();
    EventSender.playing();
    EventSender.running();
}
exports.onLoginSuccess = onLoginSuccess;
function onLaunching() {
    hasSession = false;
    lastUploadSessionAt = 0;
    exports.leagueGame.tryEnterGameCnts = exports.leagueGame.tryEnterGameCnts;
    exports.leagueGame.needResetProgress = false;
    exports.leagueGame.lastCheckPowerSaveAt = 0;
    exports.leagueGame.powerSaveColorCount = {};
    EventSender.launching();
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
exports.leagueModePanel = exports.rechargeBallLeagueMode = exports.rechargeBallRankMode = exports.autoGameConfirmEnd = exports.autoGameConfirm = exports.rankedBattleGameInfo = exports.rankedBattleResult = exports.rankedBattleWaitToRefresh = exports.rankedBattlePanelBtns = exports.rankedBattlePanel = exports.battleModePanelBtns = exports.battleModePanel = exports.selectYearBtns = exports.selectYear = exports.selectLeagueGameAmountBtns = exports.selectLeagueGameAmount = exports.selectSeasonMode = exports.leagueResetDialogBtns = exports.leagueResetDialog = exports.leagueResetDialogYN = exports.selectNormalMasterLeagueModeProceed = exports.selectNormalMasterLeagueModeBtns = exports.selectNormalMasterLeagueMode = exports.endSeasonProceedSelected = exports.endSeasonProceed = exports.endSeason = exports.newSeason = exports.settingsGraphTabBtns = exports.settingsGraphTab = exports.settingsSoundTabLanSelectProceedBtns = exports.settingsSoundTabLanSelect = exports.settingsSoundTabBtns = exports.settingsSoundTab = exports.settingsBtns = exports.settingsTabs = exports.settings = exports.mainBtns = exports.main = exports.progressBarRunning = exports.downloadData = exports.googleLogIn90 = exports.fbLogIn90 = exports.logIn90 = exports.logIn = exports.landing = exports.landingLoading = exports.TOS90v2 = exports.TOS90 = exports.TOS = exports.logo = void 0;
exports.promotion2 = exports.promotion1 = exports.powerSaving = exports.weeklyMissionBoxReceived = exports.weeklyMissionBoxConfirm = exports.weeklyMissionBoxBtns = exports.weeklyMissionBox = exports.achivementMission = exports.adGroup = exports.adRewardOnCD = exports.adRewardRedeem = exports.adReward = exports.playerCardColorToRank = exports.selectRewardPlayerBtns = exports.selectRewardPlayer = exports.mvp = exports.pitcherOfTheMonth = exports.leagueRewardAchievementGradeBonusPlayer = exports.leagueRewardAchievementGrade = exports.playerGrowthComplete = exports.gameLineUp = exports.postSeasonAwardBonus = exports.bonusGrantedByTeamRecord = exports.bestPositionAwardBonusGroup = exports.bestPositionAwardBonus2 = exports.bestPositionAwardBonus = exports.gameReward = exports.gameResultWorldChampion = exports.gameResultOther = exports.gameResultAquired = exports.gameResult = exports.leagueModeUnexpectedError = exports.leagueOnPlayPause = exports.onQuickPlayGroup = exports.onQuickPlayPause = exports.onQuickPlay1 = exports.onQuickPlay = exports.onPlayPowerSaveOn = exports.leagueOnPlayPowerSaveOffGroups = exports.leagueOnPlayPowerSaveOffMid1 = exports.leagueOnPlayPowerSaveOffMid = exports.leagueOnPlayPowerSaveOffStopped = exports.leagueOnPlayPowerSaveOff = exports.leagueOnPlayAutoOffGroup = exports.leagueOnPlayAutoOff1 = exports.leagueOnPlayAutoOff = exports.leagueContinuePlaying = exports.selectPlayRole = exports.selectPlayRoleBtns = exports.leagueModeGameInfo = void 0;
exports.quitApp1 = exports.quitApp = exports.appIsNotResponding = exports.unexpectedError = exports.errorNewUpdateAvailable = exports.confirmWithYS = exports.next2 = exports.next = exports.ok = exports.reviewApp = exports.event = exports.enterGamePromotion = exports.teamSupportPackagePromotion = exports.rechargePromotion = exports.promotion3 = void 0;
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
], { x: 254, y: 200 }, // hive login
{ x: 254, y: 200 });
exports.logIn = new Rerouter_1.Page('logIn', [
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
exports.logIn90 = new Rerouter_1.Page('logIn90', [
    // bg
    { x: 19, y: 30, r: 48, g: 48, b: 48 },
    { x: 6, y: 132, r: 238, g: 238, b: 238 },
    { x: 630, y: 25, r: 48, g: 48, b: 48 },
    { x: 631, y: 339, r: 238, g: 238, b: 238 },
    { x: 14, y: 345, r: 238, g: 238, b: 238 },
    { x: 80, y: 340, r: 238, g: 238, b: 238 },
    { x: 282, y: 340, r: 238, g: 238, b: 238 },
    { x: 420, y: 336, r: 238, g: 238, b: 238 },
    { x: 567, y: 338, r: 238, g: 238, b: 238 },
    // input
    { x: 478, y: 131, r: 255, g: 255, b: 255 },
    { x: 478, y: 188, r: 255, g: 255, b: 255 },
    // login btn
    { x: 500, y: 130, r: 43, g: 132, b: 216 },
    { x: 500, y: 155, r: 43, g: 132, b: 216 },
    { x: 499, y: 184, r: 43, g: 132, b: 216 },
    { x: 595, y: 129, r: 43, g: 132, b: 216 },
    { x: 597, y: 155, r: 43, g: 132, b: 216 },
    { x: 598, y: 188, r: 43, g: 132, b: 216 },
    { x: 548, y: 124, r: 43, g: 132, b: 216 },
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
    { x: 420, y: 330, r: 198, g: 181, b: 34 },
    { x: 473, y: 333, r: 58, g: 34, b: 5 },
    { x: 529, y: 333, r: 33, g: 81, b: 149 },
    { x: 589, y: 336, r: 100, g: 27, b: 27 },
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
], { x: 404, y: 310 }, { x: 117, y: 308 });
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
    // title
    { x: 249, y: 53, r: 181, g: 186, b: 189 },
    { x: 270, y: 65, r: 16, g: 24, b: 24 },
    { x: 329, y: 63, r: 181, g: 186, b: 189 },
    { x: 367, y: 56, r: 79, g: 84, b: 87 },
    // x
    { x: 516, y: 48, r: 142, g: 140, b: 143 },
    { x: 522, y: 57, r: 186, g: 185, b: 188 },
    { x: 522, y: 45, r: 188, g: 186, b: 189 },
    // ok
    { x: 282, y: 299, r: 8, g: 118, b: 255 },
    { x: 317, y: 297, r: 115, g: 178, b: 255 },
    { x: 413, y: 303, r: 222, g: 219, b: 222 },
    { x: 364, y: 305, r: 1, g: 105, b: 248 },
], { x: 516, y: 48 }, { x: 516, y: 48 });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4REFBOEQ7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLDhIQUE4SDtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLCtCQUErQjtJQUMvQiwwQ0FBMEM7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLFdBQUcsR0FBRyxJQUFJLGVBQUksQ0FDekIsS0FBSyxFQUNMO0lBQ0UsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxF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QUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsb0NBQW9DO0FBQ3ZCLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLGlCQUFpQjtJQUNqQixXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsYUFBYTtBQUNqQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsYUFBSyxHQUFHLElBQUksZUFBSSxDQUMzQixPQUFPLEVBQ1A7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUTtBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGVBQWU7Q0FDbEMsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVE7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ2xDLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUFDLFdBQVcsRUFBRTtJQUM3QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxxQkFBYSxHQUFHLElBQUksZUFBSSxDQUFDLGVBQWUsRUFBRTtJQUNyRCxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxvQkFBWSxHQUFHLElBQUksZUFBSSxDQUNsQyxjQUFjLEVBQ2Q7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFDVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxZQUFJLEdBQUcsSUFBSSxlQUFJLENBQzFCLE1BQU0sRUFDTjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QywwQkFBMEI7SUFDMUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFekMsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxnQkFBUSxHQUFHO0lBQ3RCLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM5QixVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDOUIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQy9CLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hCLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNoQyxDQUFDO0FBRVcsZ0JBQVEsR0FBRyxJQUFJLGVBQUksQ0FDOUIsVUFBVSxFQUNWO0lBQ0UsZ0JBQWdCO0lBQ2hCLDRDQUE0QztJQUM1QywyQ0FBMkM7SUFDM0MsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3QywwQ0FBMEM7SUFDMUMsMENBQTBDO0lBQzFDLDZDQUE2QztJQUM3Qyw2Q0FBNkM7SUFFN0Msc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHlDQUF5QztJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBQ1csb0JBQVksR0FBRztJQUMxQixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDaEMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQzlCLENBQUM7QUFDVyxvQkFBWSxHQUFHO0lBQzFCLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNoQyxDQUFDO0FBRUYsOEJBQThCO0FBQ2pCLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxnQkFBZ0IsRUFDaEI7SUFDRSxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXJDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLDRCQUFvQixHQUFHO0lBQ2xDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QixnQ0FBZ0M7Q0FDakMsQ0FBQztBQUNXLGlDQUF5QixHQUFHLElBQUksZUFBSSxDQUMvQywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFcEMsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYztBQUNsQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGNBQWM7Q0FDbEMsQ0FBQztBQUNXLDRDQUFvQyxHQUFHO0lBQ2xELEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QixDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQ3RDLGdCQUFnQixFQUNoQjtJQUNFLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFF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RSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsb0NBQTRCLEdBQUcsSUFBSSxlQUFJLENBQ2xELDhCQUE4QixFQUM5QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFeEMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHNCQUFzQjtJQUN0QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx3Q0FBZ0MsR0FBRztJQUM5QyxNQUFNLEVBQUU7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO0tBQ1A7SUFDRCxNQUFNLEVBQUU7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO0tBQ1A7Q0FDRixDQUFDO0FBRVcsMkNBQW1DLEdBQUcsSUFBSSxlQUFJLENBQ3pELHFDQUFxQyxFQUNyQztJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsbUNBQW1DO0FBQ3RCLDJCQUFtQixHQUFHLElBQUksZUFBSSxDQUN6QyxxQkFBcUIsRUFDckI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsYUFBYTtBQUNqQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWE7Q0FDakMsQ0FBQztBQUVGLG1EQUFtRDtBQUNuRCwyREFBMkQ7QUFDOUMseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLDBCQUEwQjtJQUMxQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsbUJBQW1CO0FBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUztDQUM3QixDQUFDO0FBRVcsNkJBQXFCLEdBQUc7SUFDbkMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQixDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQ3RDLGtCQUFrQixFQUNsQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLGtDQUEwQixHQUFHO0lBQ3hDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLHNCQUFjLEdBQUc7SUFDNUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM1QixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0IsQ0FBQztBQUVGLGdCQUFnQjtBQUNILHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsZ0RBQWdEO0lBQ2hELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTztBQUMxQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcs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QkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJO0FBQ3ZCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUs7QUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUV4QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsMkJBQTJCO0lBQzNCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLDRCQUE0QjtBQUNmLHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxrREFBa0Q7SUFDbEQsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLHVCQUF1QjtBQUMzQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLDBCQUEwQjtDQUM5QyxDQUFDO0FBRUYsMEJBQTBCO0FBQ2IsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4Qyw2QkFBNkI7Q0FDOUIsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLHlCQUF5QjtBQUM3QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHFCQUFxQjtDQUN6QyxDQUFDO0FBRVcsNEJBQW9CLEdBQUcsSUFBSSxlQUFJLENBQzFDLHNCQUFzQixFQUN0QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVM7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTO0FBQzVCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFRixnQkFBZ0I7QUFDSCx1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztBQUMvQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRUYseUJBQXlCO0FBQ1osMEJBQWtCLEdBQUc7SUFDaEMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMzQixnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNyQyxDQUFDO0FBRVcsc0JBQWMsR0FBRyxJQUFJLGVBQUksQ0FDcEMsZ0JBQWdCLEVBQ2hCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUM7QUFDRCxnREFBZ0Q7QUFDaEQsMEJBQWtCLENBQUMsT0FBTyxFQUMxQiwwQkFBa0IsQ0FBQyxPQUFPLENBQzNCLENBQUM7QUFFRixzREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3hCLDZCQUFxQixHQUFHLElBQUksZUFBSSxDQUMzQyx1QkFBdUIsRUFDdkI7SUFDRSxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxnQkFBZ0I7QUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFH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QUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUscUJBQXFCO0FBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMscUJBQXFCO0NBQ3hDLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsMkJBQTJCO0FBQ2QsdUNBQStCLEdBQUcsSUFBSSxlQUFJLENBQ3JELDBCQUEwQixFQUMxQjtJQUNFLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6Qyx5QkFBeUI7SUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLG9CQUFvQjtBQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLG9CQUFvQjtDQUNwQyxDQUFDO0FBRUYsa0RBQWtEO0FBQ3JDLG1DQUEyQixHQUFH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LEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFRix1QkFBdUI7QUFDVixtQkFBVyxHQUFHLElBQUksZUFBSSxDQUNqQyxhQUFhLEVBQ2I7SUFDRSxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsMEJBQTBCO0lBQzFCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxvQkFBWSxHQUFHLElBQUksZUFBSSxDQUNsQyxhQUFhLEVBQUUsbURBQW1EO0FBQ2xFO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXRDLHVCQUF1QjtJQUN2QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRUYsMENBQTBDO0FBQzdCLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxrQkFBa0IsRUFDbEI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsOENBQThDO0FBQ2xFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENB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LEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztDQUN0RCxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTO0NBQ3BELEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVywrQkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDN0MseUJBQXlCLEVBQ3pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLDRCQUE0QjtJQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHdCQUF3QixFQUN4QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2Qyw0QkFBNEI7SUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXRDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxtQ0FBMkIsR0FBRyxJQUFJLG9CQUFTLENBQ3RELHdCQUF3QixFQUN4QixDQUFDLDhCQUFzQixFQUFFLCtCQUF1QixDQUFDLEVBQ2pELDhCQUFzQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQ3ZDLENBQUM7QUFFRix1Q0FBdUM7QUFDMUIsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUVyQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsaUNBQWlDO0lBQ2pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFVyw0QkFBb0IsR0FBRyxJQUFJLGVBQUksQ0FDMUMsc0JBQXNCLEVBQ3RCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxvQ0FBNEIsR0FBRyxJQUFJLGVBQUksQ0FDbEQsOEJBQThCLEVBQzlCO0lBQ0UsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBQ0YsSUFBSTtBQUVTLCtDQUF1QyxHQUFHLElBQUksZUFBSSxDQUM3RCx5Q0FBeUMsRUFDekM7SUFDRSxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsV0FBRyxHQUFHLElBQUksZUFBSSxDQUN6QixLQUFLLEVBQ0w7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN0QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXJDLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFDRiwrREFBK0Q7QUFDL0QsaUJBQWlCO0FBQ2pCLG9FQUFvRTtBQUNwRSxtQ0FBbUM7QUFDdEIsOEJBQXNCLEdBQUc7SUFDcEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDbkIsQ0FBQztBQUNGLDJCQUEyQjtBQUMzQix1QkFBdUI7QUFDdkIsaUNBQWlDO0FBQ3BCLDZCQUFxQixHQUE0QjtJQUM1RCxVQUFVLEVBQUUsQ0FBQztJQUNiLFVBQVUsRUFBRSxDQUFDO0lBQ2IsVUFBVSxFQUFFLENBQUM7SUFDYixhQUFhLEVBQUUsQ0FBQztJQUNoQixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsWUFBWSxFQUFFLENBQUM7SUFDZixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsV0FBVyxFQUFFLENBQUMsRUFBRSw4QkFBOEI7Q0FDL0MsQ0FBQztBQUVGLGlCQUFpQjtBQUNKLGdCQUFRLEdBQUcsSUFBSSxlQUFJLENBQzlCLFVBQVUsRUFDVjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyx5QkFBeUI7SUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsU0FBUztJQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FD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QUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztBQUM5QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRVcsNEJBQW9CLEdBQUc7SUFDbEMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNsQyxDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHlCQUF5QixFQUN6QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVTtBQUM5QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFNBQVM7SUFDVCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUztBQUM3QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsZ0JBQWdCO0FBQ0gsbUJBQVcsR0FBRyxJQUFJLGVBQUksQ0FDakMsYUFBYSxFQUNiO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsMkNBQTJDO0lBQzNDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBRXBDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtDQUNyQyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVB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QUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLGlCQUFTLEdBQUcsSUFBSSxlQUFJLENBQy9CLFdBQVcsRUFDWDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLHFCQUFxQjtBQUNSLFVBQUUsR0FBRyxJQUFJLGVBQUksQ0FDeEIsSUFBSSxFQUNKO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsdUJBQXVCO0FBQ1YsWUFBSSxHQUFHLElBQUksZUFBSSxDQUMxQixNQUFNLEVBQ047SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxhQUFLLEdBQUcsSUFBSSxlQUFJLENBQzNCLE1BQU0sRUFDTjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLGdEQUFnRDtBQUNuQyxxQkFBYSxHQUFHLElBQUksZUFBSSxDQUNuQyxlQUFlLEVBQ2Y7SUFDRSxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsU0FBUztJQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVE7QUFDM0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLHlCQUF5QjtBQUNaLCtCQUF1QixHQUFHLElBQUksZUFBSSxDQUM3Qyx5QkFBeUIsRUFDekI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsOEJBQThCO0lBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0M7QUFDRCx1Q0FBdUM7QUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxtQ0FBbUM7QUFDdEIsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZO0FBQ2hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRix5QkFBeUI7QUFDWixlQUFPLEdBQUcsSUFBSSxlQUFJLENBQzdCLFNBQVMsRUFDVDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjO0FBQ2xDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxnQkFBUSxHQUFHLElBQUksZUFBSSxDQUM5QixVQUFVLEVBQ1Y7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6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QUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7QUFDOUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLElBQU0sb0JBQW9CLEdBQUc7SUFDM0IsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNsQyxDQUFDO0FBRUYsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDdEMseUJBQXlCLEVBQ3pCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVO0FBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixJQUFNLHdCQUF3QixHQUFHLElBQUksZUFBSSxDQUN2QywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMs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RSxDQUFDO0lBQ2IsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUNwQixDQUFDO0FBTkQsb0JBTUM7QUFLQSxNQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUM3QixNQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL1Jlcm91dGVyL2Rpc3Qvc3JjL3Jlcm91dGVyLmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvc2NyZWVuLmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvc3RydWN0LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9jaGFyZW5jL2NoYXJlbmMuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9jcnlwdC9jcnlwdC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL21kNS9tZDUuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvY29uZmlnLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9ldmVudFNlbmRlci50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3Jlcm91dGVyLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9zZXNzaW9uLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9zdGF0ZS50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3BhZ2VzLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvdGFza3MvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy90YXNrcy93ZWVrbHlNaXNzaW9uLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vdGVzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXN0Ly4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmVyc2lvbiA9IHZvaWQgMDtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvc2NyZWVuXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvcmVyb3V0ZXJcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9zdHJ1Y3RcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy91dGlsc1wiKSwgZXhwb3J0cyk7XG5leHBvcnRzLnZlcnNpb24gPSAxO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXJvdXRlciA9IGV4cG9ydHMuUmVyb3V0ZXIgPSB2b2lkIDA7XG52YXIgc3RydWN0XzEgPSByZXF1aXJlKFwiLi9zdHJ1Y3RcIik7XG52YXIgc2NyZWVuXzEgPSByZXF1aXJlKFwiLi9zY3JlZW5cIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIFJlcm91dGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlcm91dGVyKCkge1xuICAgICAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0Q29uZmlnID0gc3RydWN0XzEuRGVmYXVsdENvbmZpZ1ZhbHVlO1xuICAgICAgICB0aGlzLnJlcm91dGVyQ29uZmlnID0gc3RydWN0XzEuRGVmYXVsdFJlcm91dGVyQ29uZmlnO1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZyA9IHN0cnVjdF8xLkRlZmF1bHRTY3JlZW5Db25maWc7XG4gICAgICAgIHRoaXMuc2NyZWVuID0gbmV3IHNjcmVlbl8xLlNjcmVlbih0aGlzLnNjcmVlbkNvbmZpZyk7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJvdXRlcyA9IFtdO1xuICAgICAgICB0aGlzLnRhc2tzID0gW107XG4gICAgICAgIHRoaXMucm91dGVDb250ZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy51bmtub3duUm91dGVBY3Rpb24gPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWNhbGN1bGF0ZSBzb21lIHZhbHVlIGxpa2UgZGV2aWNlIHdpZHRoIG9yIGhlaWdodCBpbiBzY3JlZW5Db25maWdcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gc29ydCByb3V0ZXMgYnkgcHJpb3JpdHlcbiAgICAgICAgdGhpcy5yb3V0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7IH0pO1xuICAgICAgICAvLyBjaGVjayBhbmQgY2FsY3VsYXRlIHNjcmVlbiBjb25maWdcbiAgICAgICAgdmFyIGRldmljZVdIID0gZ2V0U2NyZWVuU2l6ZSgpO1xuICAgICAgICB2YXIgbWF4ID0gTWF0aC5tYXgoZGV2aWNlV0gud2lkdGgsIGRldmljZVdILmhlaWdodCk7XG4gICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihkZXZpY2VXSC53aWR0aCwgZGV2aWNlV0guaGVpZ2h0KTtcbiAgICAgICAgdmFyIGRXaWR0aCA9IHRoaXMuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBtYXggOiBtaW47XG4gICAgICAgIHZhciBkSGVpZ2h0ID0gdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBtYXggOiBtaW47XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZVdpZHRoID0gdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlV2lkdGggfHwgZFdpZHRoO1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VIZWlnaHQgPSB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VIZWlnaHQgfHwgZEhlaWdodDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuV2lkdGggPSB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCB8fCBkV2lkdGg7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbkhlaWdodCA9IHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbkhlaWdodCB8fCBkSGVpZ2h0O1xuICAgICAgICB0aGlzLmxvZyhcInNjcmVlbldpZHRoOiBcIi5jb25jYXQodGhpcy5zY3JlZW5Db25maWcuc2NyZWVuV2lkdGgsIFwiLCBzY3JlZW5IZWlnaHQ6IFwiKS5jb25jYXQodGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0KSk7XG4gICAgICAgIC8vIG5ldyBzY3JlZW4gaWYgc2NyZWVuIGNvbmZpZyBjaGFuZ2VkXG4gICAgICAgIHRoaXMuc2NyZWVuID0gbmV3IHNjcmVlbl8xLlNjcmVlbih0aGlzLnNjcmVlbkNvbmZpZyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgUm91dGVDb25maWcgdG8gUmVyb3V0ZXIgcm91dGVzLCBhZnRlciBzdGFydGluZyBSZXJvdXRlciB3aWxsIHJ1biBvdmVyIGFsbCBSb3V0ZUNvbmZpZ3MgdG8gbWF0Y2ggc2NyZWVuIGFuZCBkbyBhY3Rpb25cbiAgICAgKiBAcGFyYW0gY29uZmlnIGluZm9ybWF0aW9uIGFib3V0IGhvdyByb3V0ZSBtYXRjaCBhbmQgcm91dGUgYWN0aW9uXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICB0aGlzLnJvdXRlcy5wdXNoKHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQoY29uZmlnKSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUZWxsIFJlcm91dGVyIHdoYXQgdG8gZG8gaWYgbm90IG1hdGNoaW5nIGFueSByb3V0ZVxuICAgICAqIEBwYXJhbSBhY3Rpb24gZnVuY3Rpb24gdG8gZG8gaWYgbm90IG1hdGNoaW5nXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFVua25vd25BY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMudW5rbm93blJvdXRlQWN0aW9uID0gYWN0aW9uO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIFRhc2tDb25maWcgdG8gUmVyb3V0ZXIgdGFza3MsIGFmdGVyIHN0YXJ0aW5nIFJlcm91dGVyIHdpbGwgcnVuIG92ZXIgYWxsIFRhc2tzIGJ5IHRhc2sgY29uZGl0aW9uXG4gICAgICogQHBhcmFtIGNvbmZpZyBpbmZvcm1hdGlvbiBhYm91dCBob3cgdGFzayB3b3Jrc1xuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5hZGRUYXNrID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICB0aGlzLnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICAgICAgICBjb25maWc6IHRoaXMud3JhcFRhc2tDb25maWdXaXRoRGVmYXVsdChjb25maWcpLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAwLFxuICAgICAgICAgICAgbGFzdFJ1blRpbWU6IDAsXG4gICAgICAgICAgICBydW5UaW1lczogMCxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBzdGFydCBSZXJvdXRlciB0byBydW4gb3ZlciB0YXNrcyBhbmQgcm91dGVzXG4gICAgICogQHBhcmFtIHBhY2thZ2VOYW1lXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKHBhY2thZ2VOYW1lKSB7XG4gICAgICAgIHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUgPSBwYWNrYWdlTmFtZTtcbiAgICAgICAgLy8gY2hlY2sgdGFza3NcbiAgICAgICAgaWYgKHRoaXMudGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0YXJ0IGZhaWxlZCwgbm8gdGFza3MgLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0YXJ0ZWQgLi4uXCIpO1xuICAgICAgICAvLyB0YXNrIGNvbnRyb2xsZXJcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydFRhc2tMb29wKCk7XG4gICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RvcHBlZCAuLi5cIik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBzdG9wIFJlcm91dGVyXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RvcCBjYWxsZWQsIHRyeWluZyB0byBzdG9wIHRhc2sgbG9vcFwiKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnJvdXRlQ29udGV4dCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQuc2NyaXB0UnVubmluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuY2hlY2tJbkFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhY2thZ2VOYW1lID0gdXRpbHNfMS5VdGlscy5nZXRDdXJyZW50QXBwKClbMF07XG4gICAgICAgIGlmIChwYWNrYWdlTmFtZSA9PT0gdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuVXRpbHMuaXNBcHBPblRvcCh0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5jaGVja0FuZFN0YXJ0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tJbkFwcCgpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIkFwcElzTm90U3RhcnRlZCwgc3RhcnRBcHAgXCIuY29uY2F0KHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRBcHAoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdGFydEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0YXJ0IGFwcCBmYWlsZWQsIG5vIHBhY2thZ2VOYW1lIC4uLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1dGlsc18xLlV0aWxzLnN0YXJ0QXBwKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHRoaXMucmVyb3V0ZXJDb25maWcuc3RhcnRBcHBEZWxheSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RvcEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmxvZyhcIlJlcm91dGVyIHN0b3AgYXBwIGZhaWxlZCwgbm8gcGFja2FnZU5hbWUgLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc3RvcEFwcCh0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKTtcbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCgxMDAwKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5yZXN0YXJ0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0b3BBcHAoKTtcbiAgICAgICAgdGhpcy5zdGFydEFwcCgpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdvTmV4dCA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmIChwYWdlLm5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKHBhZ2UubmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocGFnZS5uYW1lLCBcIiBhY3Rpb24gPT0gZ29OZXh0LCBidXQgbm8gbmV4dCB4eVwiKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nb0JhY2sgPSBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICBpZiAocGFnZS5iYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2NyZWVuLnRhcChwYWdlLmJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiXCIuY29uY2F0KHBhZ2UubmFtZSwgXCIgYWN0aW9uID09IGdvQmFjaywgYnV0IG5vIGJhY2sgeHlcIikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNQYWdlTWF0Y2ggPSBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBpc01hdGNoID0gdGhpcy5pc1BhZ2VNYXRjaEltYWdlKHBhZ2UsIGltYWdlKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIGlzTWF0Y2g7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNQYWdlTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChwYWdlLCBpbWFnZSkge1xuICAgICAgICBpZiAodHlwZW9mIHBhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShwYWdlKTtcbiAgICAgICAgICAgIGlmIChwID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiaXNQYWdlTWF0Y2hJbWFnZSBcIi5jb25jYXQocGFnZSwgXCIgbm90IGV4aXN0XCIpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYWdlID0gcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFnZSBpbnN0YW5jZW9mIHN0cnVjdF8xLlBhZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgcGFnZSwgdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aGlzLmRlZmF1bHRDb25maWcuR3JvdXBQYWdlVGhyZXMsIHRoaXMuZGVidWcpO1xuICAgICAgICAgICAgcmV0dXJuIHBhZ2VzLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRQYWdlc01hdGNoID0gZnVuY3Rpb24gKGdyb3VwUGFnZSkge1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBtYXRjaCA9IHRoaXMuZ2V0UGFnZXNNYXRjaEltYWdlKGdyb3VwUGFnZSwgaW1hZ2UsIHRoaXMuZGVmYXVsdENvbmZpZy5Hcm91cFBhZ2VUaHJlcyk7XG4gICAgICAgIHJlbGVhc2VJbWFnZShpbWFnZSk7XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRQYWdlc01hdGNoSW1hZ2UgPSBmdW5jdGlvbiAoZ3JvdXBQYWdlLCBpbWFnZSwgcGFyZW50VGhyZXMsIGRlYnVnKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHZhciBwYWdlcyA9IFtdO1xuICAgICAgICB2YXIgdGhyZXMgPSAoX2IgPSAoX2EgPSBncm91cFBhZ2UudGhyZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHBhcmVudFRocmVzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB0aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwUGFnZS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSBncm91cFBhZ2UucGFnZXNbaV07XG4gICAgICAgICAgICB2YXIgaXNQYWdlTWF0Y2ggPSB0aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgcGFnZSwgdGhyZXMsIHRoaXMuZGVidWcpO1xuICAgICAgICAgICAgaWYgKGlzUGFnZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud2FpdFNjcmVlbkZvck1hdGNoaW5nUGFnZSA9IGZ1bmN0aW9uIChwYWdlLCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAobWF0Y2hUaW1lcyA9PT0gdm9pZCAwKSB7IG1hdGNoVGltZXMgPSAxOyB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PT0gdm9pZCAwKSB7IGludGVydmFsID0gNjAwOyB9XG4gICAgICAgIHJldHVybiB1dGlsc18xLlV0aWxzLndhaXRGb3JBY3Rpb24oZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuaXNQYWdlTWF0Y2gocGFnZSk7IH0sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1JvdXRlTWF0Y2ggPSBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgaXNNYXRjaCA9IHRoaXMuaXNSb3V0ZU1hdGNoSW1hZ2Uocm91dGUsIGltYWdlKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIGlzTWF0Y2g7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNSb3V0ZU1hdGNoSW1hZ2UgPSBmdW5jdGlvbiAocm91dGUsIGltYWdlKSB7XG4gICAgICAgIHZhciByb3V0ZUNvbmZpZyA9IHRoaXMuZ2V0Um91dGVDb25maWcocm91dGUpO1xuICAgICAgICBpZiAocm91dGVDb25maWcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZyhcImlzUm91dGVNYXRjaEltYWdlIFwiLmNvbmNhdChyb3V0ZSwgXCIgbm90IGV4aXN0XCIpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmlsbGVkUm91dGVDb25maWcgPSB0aGlzLndyYXBSb3V0ZUNvbmZpZ1dpdGhEZWZhdWx0KHJvdXRlQ29uZmlnKTtcbiAgICAgICAgdmFyIHJvdGF0aW9uID0gdGhpcy5zY3JlZW4uZ2V0SW1hZ2VSb3RhdGlvbihpbWFnZSk7XG4gICAgICAgIHZhciBpc01hdGNoZWQgPSB0aGlzLmlzTWF0Y2hSb3V0ZUltcGwoaW1hZ2UsIHJvdGF0aW9uLCBmaWxsZWRSb3V0ZUNvbmZpZywgJ3dhaXRTY3JlZW5Gb3JNYXRjaGluZ1JvdXRlJykuaXNNYXRjaGVkO1xuICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud2FpdFNjcmVlbkZvck1hdGNoaW5nUm91dGUgPSBmdW5jdGlvbiAocm91dGUsIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuVXRpbHMud2FpdEZvckFjdGlvbihmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5pc1JvdXRlTWF0Y2gocm91dGUpOyB9LCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0UGFnZUJ5TmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYiA9IHRoaXMucm91dGVzOyBfaSA8IF9iLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdXRlID0gX2JbX2ldO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICgoX2EgPSByb3V0ZS5tYXRjaCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlLm1hdGNoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFJvdXRlQ29uZmlnQnlQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucm91dGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdXRlID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKHBhdGggPT09IHJvdXRlLnBhdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0Q3VycmVudE1hdGNoTmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIG1hdGNoZWROYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLnJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gcm91dGUubWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSAmJiBfdGhpcy5pc01hdGNoUGFnZUltcGwoaW1hZ2UsIG1hdGNoLCBfdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgX3RoaXMuZGVidWcpKSB8fFxuICAgICAgICAgICAgICAgIChtYXRjaCBpbnN0YW5jZW9mIHN0cnVjdF8xLkdyb3VwUGFnZSAmJiBfdGhpcy5pc01hdGNoR3JvdXBQYWdlSW1wbChpbWFnZSwgbWF0Y2gsIF90aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCBfdGhpcy5kZWJ1ZykubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkTmFtZXMucHVzaChtYXRjaC5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubG9nKFwiY3VycmVudCBtYXRjaDogXCIsIG1hdGNoZWROYW1lcyk7XG4gICAgICAgIHJldHVybiBtYXRjaGVkTmFtZXM7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0Um91dGVDb25maWcgPSBmdW5jdGlvbiAocikge1xuICAgICAgICB2YXIgcm91dGU7XG4gICAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJvdXRlID0gdGhpcy5nZXRSb3V0ZUNvbmZpZ0J5UGF0aChyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvdXRlID0gcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm91dGU7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZywgX2gsIF9qO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGF0aDogY29uZmlnLnBhdGgsXG4gICAgICAgICAgICBhY3Rpb246IGNvbmZpZy5hY3Rpb24sXG4gICAgICAgICAgICBtYXRjaDogKF9hID0gY29uZmlnLm1hdGNoKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsLFxuICAgICAgICAgICAgY3VzdG9tTWF0Y2g6IChfYiA9IGNvbmZpZy5jdXN0b21NYXRjaCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbCxcbiAgICAgICAgICAgIHJvdGF0aW9uOiAoX2MgPSBjb25maWcucm90YXRpb24pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHRoaXMuc2NyZWVuQ29uZmlnLnJvdGF0aW9uLFxuICAgICAgICAgICAgc2hvdWxkTWF0Y2hUaW1lczogKF9kID0gY29uZmlnLnNob3VsZE1hdGNoVGltZXMpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoVGltZXMsXG4gICAgICAgICAgICBzaG91bGRNYXRjaER1cmluZzogKF9lID0gY29uZmlnLnNob3VsZE1hdGNoRHVyaW5nKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdTaG91bGRNYXRjaER1cmluZyxcbiAgICAgICAgICAgIGJlZm9yZUFjdGlvbkRlbGF5OiAoX2YgPSBjb25maWcuYmVmb3JlQWN0aW9uRGVsYXkpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ0JlZm9yZUFjdGlvbkRlbGF5LFxuICAgICAgICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogKF9nID0gY29uZmlnLmFmdGVyQWN0aW9uRGVsYXkpICE9PSBudWxsICYmIF9nICE9PSB2b2lkIDAgPyBfZyA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ0FmdGVyQWN0aW9uRGVsYXksXG4gICAgICAgICAgICBwcmlvcml0eTogKF9oID0gY29uZmlnLnByaW9yaXR5KSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiB0aGlzLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdQcmlvcml0eSxcbiAgICAgICAgICAgIGRlYnVnOiAoX2ogPSBjb25maWcuZGVidWcpICE9PSBudWxsICYmIF9qICE9PSB2b2lkIDAgPyBfaiA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ0RlYnVnLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndyYXBUYXNrQ29uZmlnV2l0aERlZmF1bHQgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgICAgICAgbWF4VGFza1J1blRpbWVzOiAoX2EgPSBjb25maWcubWF4VGFza1J1blRpbWVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ01heFRhc2tSdW5UaW1lcyxcbiAgICAgICAgICAgIG1heFRhc2tEdXJpbmc6IChfYiA9IGNvbmZpZy5tYXhUYXNrRHVyaW5nKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ01heFRhc2tEdXJpbmcsXG4gICAgICAgICAgICBtaW5Sb3VuZEludGVydmFsOiAoX2MgPSBjb25maWcubWluUm91bmRJbnRlcnZhbCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdGhpcy5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdNaW5Sb3VuZEludGVydmFsLFxuICAgICAgICAgICAgZm9yY2VTdG9wOiAoX2QgPSBjb25maWcuZm9yY2VTdG9wKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0F1dG9TdG9wLFxuICAgICAgICAgICAgZmluZFJvdXRlRGVsYXk6IChfZSA9IGNvbmZpZy5maW5kUm91dGVEZWxheSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogdGhpcy5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdGaW5kUm91dGVEZWxheSxcbiAgICAgICAgICAgIGJlZm9yZVJvdXRlOiAoX2YgPSBjb25maWcuYmVmb3JlUm91dGUpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IG51bGwsXG4gICAgICAgICAgICBhZnRlclJvdXRlOiAoX2cgPSBjb25maWcuYWZ0ZXJSb3V0ZSkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogbnVsbCxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdGFydFRhc2tMb29wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGFza0lkeCA9IDA7XG4gICAgICAgIHdoaWxlICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGhpcy50YXNrc1t0YXNrSWR4ICUgdGhpcy50YXNrcy5sZW5ndGhdO1xuICAgICAgICAgICAgdGFza0lkeCsrO1xuICAgICAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB2YXIgaXNUYXNrUnVuRmlyc3RUaW1lID0gdGFzay5sYXN0UnVuVGltZSA9PT0gMDtcbiAgICAgICAgICAgIGlmIChub3cgLSB0YXNrLmxhc3RSdW5UaW1lIDw9IHRhc2suY29uZmlnLm1pblJvdW5kSW50ZXJ2YWwgJiYgIWlzVGFza1J1bkZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgZHVyaW5nOiBcIikuY29uY2F0KG5vdyAtIHRhc2subGFzdFJ1blRpbWUsIFwiIDw9IG1pblJvdW5kSW50ZXJ2YWwsIHNraXBcIikpO1xuICAgICAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy50YXNrRGVsYXkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzay5zdGFydFRpbWUgPSBub3c7XG4gICAgICAgICAgICB0YXNrLnJ1blRpbWVzID0gMDtcbiAgICAgICAgICAgIHZhciBleGl0VGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXNrLmNvbmZpZy5tYXhUYXNrUnVuVGltZXMgJiYgdGhpcy5ydW5uaW5nICYmICFleGl0VGFzazsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzKSk7XG4gICAgICAgICAgICAgICAgdmFyIHNraXBSb3V0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5iZWZvcmVSb3V0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMsIFwiIGRvIGJlZm9yZVJvdXRlKClcIikpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5jb25maWcuYmVmb3JlUm91dGUodGFzaykgPT09ICdza2lwUm91dGVMb29wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2tpcFJvdXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2tpcFJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcywgXCIgc2tpcFJvdXRlTG9vcFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBleGl0VGFzayA9IHRoaXMuc3RhcnRSb3V0ZUxvb3AodGFzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5hZnRlclJvdXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcywgXCIgZG8gYWZ0ZXJSb3V0ZSgpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5jb25maWcuYWZ0ZXJSb3V0ZSh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFzay5ydW5UaW1lcysrO1xuICAgICAgICAgICAgICAgIHRhc2subGFzdFJ1blRpbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgdmFyIGR1cmluZyA9IG5vdyAtIHRhc2suc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nID4gMCAmJiBkdXJpbmcgPj0gdGFzay5jb25maWcubWF4VGFza0R1cmluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHRhc2tEdXJpbmc6IFwiKS5jb25jYXQoZHVyaW5nLCBcIi9cIikuY29uY2F0KHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcsIFwiIHJlYWNoZWQsIHN0b3BcIikpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHRoaXMucmVyb3V0ZXJDb25maWcudGFza0RlbGF5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0Um91dGVMb29wID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHRoaXMucm91dGVDb250ZXh0ID0ge1xuICAgICAgICAgICAgdGFzazogdGFzayxcbiAgICAgICAgICAgIHNjcmVlbjogdGhpcy5zY3JlZW4sXG4gICAgICAgICAgICBzY3JpcHRSdW5uaW5nOiB0aGlzLnJ1bm5pbmcsXG4gICAgICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgICAgIGxhc3RNYXRjaGVkUGF0aDogKF9iID0gKF9hID0gdGhpcy5yb3V0ZUNvbnRleHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sYXN0TWF0Y2hlZFBhdGgpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICcnLFxuICAgICAgICAgICAgbWF0Y2hUaW1lczogMCxcbiAgICAgICAgICAgIG1hdGNoU3RhcnRUUzogMCxcbiAgICAgICAgICAgIG1hdGNoRHVyaW5nOiAwLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgcm91dGVMb29wID0gdHJ1ZTtcbiAgICAgICAgdmFyIGV4aXRUYXNrUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHZhciBmaW5pc2hSb3VuZEZ1bmMgPSBmdW5jdGlvbiAoZXhpdFRhc2spIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGlmIChleGl0VGFzayA9PT0gdm9pZCAwKSB7IGV4aXRUYXNrID0gZmFsc2U7IH1cbiAgICAgICAgICAgIHJvdXRlTG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgZXhpdFRhc2tSZXN1bHQgPSBleGl0VGFzaztcbiAgICAgICAgICAgIF90aGlzLmxvZyhcImZpbmlzaCByb3VuZDogXCIuY29uY2F0KChfYSA9IF90aGlzLnJvdXRlQ29udGV4dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhc2submFtZSwgXCI7IGV4aXRUYXNrOiBcIikuY29uY2F0KGV4aXRUYXNrKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIHBvaW50ZXIgZm9yIHNob3J0IGNvZGVcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLnJvdXRlQ29udGV4dDtcbiAgICAgICAgd2hpbGUgKHJvdXRlTG9vcCAmJiB0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgLy8gY2hlY2sgdGFzay5hdXRvU3RvcFxuICAgICAgICAgICAgdmFyIHRhc2tSdW5EdXJpbmcgPSBub3cgLSB0YXNrLnN0YXJ0VGltZTtcbiAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5mb3JjZVN0b3AgJiYgdGFza1J1bkR1cmluZyA+IHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2sgXCIuY29uY2F0KHRhc2submFtZSwgXCIgQXV0b1N0b3AsIGV4Y2VlZCB0YXNrUnVuRHVyaW5nXCIpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNoZWNrIGlzQXBwT24gb3IgYXV0byBsYXVuY2ggaXRcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcm91dGVyQ29uZmlnLmF1dG9MYXVuY2hBcHApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0FuZFN0YXJ0QXBwKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJvdGF0aW9uID0gdGhpcy5zY3JlZW4uZ2V0Um90YXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgICAgIHZhciBfZCA9IHRoaXMuZmluZE1hdGNoZWRSb3V0ZUltcGwodGFzay5uYW1lLCBpbWFnZSwgcm90YXRpb24pLCBtYXRjaGVkUm91dGUgPSBfZC5tYXRjaGVkUm91dGUsIG1hdGNoZWRQYWdlcyA9IF9kLm1hdGNoZWRQYWdlcztcbiAgICAgICAgICAgIC8vIGNvbnRleHQubWF0Y2hTdGFydFRTID0gMCBpZiBpbml0IHJ1blxuICAgICAgICAgICAgY29udGV4dC5tYXRjaFN0YXJ0VFMgPSBjb250ZXh0Lm1hdGNoU3RhcnRUUyB8fCBub3c7XG4gICAgICAgICAgICBjb250ZXh0LnBhdGggPSAoX2MgPSBtYXRjaGVkUm91dGUgPT09IG51bGwgfHwgbWF0Y2hlZFJvdXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtYXRjaGVkUm91dGUucGF0aCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogJyc7XG4gICAgICAgICAgICAvLyBmaXJzdCBtYXRjaFxuICAgICAgICAgICAgaWYgKGNvbnRleHQucGF0aCAhPT0gY29udGV4dC5sYXN0TWF0Y2hlZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1hdGNoVGltZXMgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubWF0Y2hTdGFydFRTID0gbm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5tYXRjaER1cmluZyA9IG5vdyAtIGNvbnRleHQubWF0Y2hTdGFydFRTO1xuICAgICAgICAgICAgY29udGV4dC5tYXRjaFRpbWVzKys7XG4gICAgICAgICAgICBpZiAobWF0Y2hlZFJvdXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudW5rbm93blJvdXRlQWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5rbm93blJvdXRlQWN0aW9uKGNvbnRleHQsIGltYWdlLCBmaW5pc2hSb3VuZEZ1bmMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9BY3Rpb25Gb3JSb3V0ZShjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZFJvdXRlLCBtYXRjaGVkUGFnZXMsIGZpbmlzaFJvdW5kRnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgbGFzdE1hdGNoZWRQYXRoIGFmdGVyIGFjdGlvbiBkb25lXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgdGhlIGxhc3RNYXRjaGVkUGF0aCB3aWxsIGJlIGN1cnJlbnQgcGF0aCB3aGVuIGRvaW5nIGFjdGlvblxuICAgICAgICAgICAgY29udGV4dC5sYXN0TWF0Y2hlZFBhdGggPSBjb250ZXh0LnBhdGg7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0YXNrLmNvbmZpZy5maW5kUm91dGVEZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4aXRUYXNrUmVzdWx0O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmRvQWN0aW9uRm9yUm91dGUgPSBmdW5jdGlvbiAoY29udGV4dCwgaW1hZ2UsIHJvdXRlLCBtYXRjaGVkUGFnZXMsIGZpbmlzaFJvdW5kKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJoYW5kbGVNYXRjaGVkUm91dGU6IFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiwgdGltZXM6IFwiKS5jb25jYXQoY29udGV4dC5tYXRjaFRpbWVzLCBcIiwgZHVyaW5nOiBcIikuY29uY2F0KGNvbnRleHQubWF0Y2hEdXJpbmcpKTtcbiAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA8IHJvdXRlLnNob3VsZE1hdGNoVGltZXMgfHwgY29udGV4dC5tYXRjaER1cmluZyA8IHJvdXRlLnNob3VsZE1hdGNoRHVyaW5nKSB7XG4gICAgICAgICAgICAvLyBzaG91bGQgc3RpbGwgd2FpdCBmb3IgbWF0Y2hpbmcgY29uZGl0aW9uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5leHRYWSA9IChfYSA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5leHQ7XG4gICAgICAgIHZhciBiYWNrWFkgPSAoX2IgPSBtYXRjaGVkUGFnZXNbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5iYWNrO1xuICAgICAgICAvLyBtYXRjaGVkIGFuZCBmaXQgY29uZGl0aW9uLCBkbyBhY3Rpb25cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcChyb3V0ZS5iZWZvcmVBY3Rpb25EZWxheSk7XG4gICAgICAgIGlmIChyb3V0ZS5hY3Rpb24gPT09ICdnb05leHQnKSB7XG4gICAgICAgICAgICBpZiAobmV4dFhZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAobmV4dFhZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBhY3Rpb24gPT0gZ29OZXh0LCBidXQgbm8gbmV4dCB4eVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocm91dGUuYWN0aW9uID09PSAnZ29CYWNrJykge1xuICAgICAgICAgICAgaWYgKGJhY2tYWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKGJhY2tYWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocm91dGUucGF0aCwgXCIgYWN0aW9uID09IGdvQmFjaywgYnV0IG5vIGJhY2sgeHlcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJvdXRlLmFjdGlvbiA9PT0gJ2tleWNvZGVCYWNrJykge1xuICAgICAgICAgICAga2V5Y29kZSgnQkFDSycsIHRoaXMuc2NyZWVuQ29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByb3V0ZS5hY3Rpb24oY29udGV4dCwgaW1hZ2UsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmQpO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAocm91dGUuYWZ0ZXJBY3Rpb25EZWxheSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZmluZE1hdGNoZWRSb3V0ZUltcGwgPSBmdW5jdGlvbiAodGFza05hbWUsIGltYWdlLCByb3RhdGlvbikge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYVtfaV07XG4gICAgICAgICAgICB2YXIgX2IgPSB0aGlzLmlzTWF0Y2hSb3V0ZUltcGwoaW1hZ2UsIHJvdGF0aW9uLCByb3V0ZSwgdGFza05hbWUpLCBpc01hdGNoZWQgPSBfYi5pc01hdGNoZWQsIG1hdGNoZWRQYWdlcyA9IF9iLm1hdGNoZWRQYWdlcztcbiAgICAgICAgICAgIGlmIChpc01hdGNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsICdjdXJyZW50IG1hdGNoOicsIG1hdGNoZWRQYWdlcy5tYXAoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAubmFtZTsgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IG1hdGNoZWRSb3V0ZTogcm91dGUsIG1hdGNoZWRQYWdlczogbWF0Y2hlZFBhZ2VzIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZFJvdXRlOiBudWxsLCBtYXRjaGVkUGFnZXM6IFtdIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNNYXRjaFJvdXRlSW1wbCA9IGZ1bmN0aW9uIChpbWFnZSwgcm90YXRpb24sIHJvdXRlLCB0YXNrTmFtZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIC8vIGNoZWNrIHJvdGF0aW9uXG4gICAgICAgIGlmIChyb3V0ZS5yb3RhdGlvbiAhPT0gcm90YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJmaW5kTWF0Y2hlZFJvdXRlIFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBub3QgbWF0Y2ggcm90YXRpb24sIHNraXBcIikpO1xuICAgICAgICAgICAgcmV0dXJuIHsgaXNNYXRjaGVkOiBmYWxzZSwgbWF0Y2hlZFBhZ2VzOiBbXSB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBpc01hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIG1hdGNoZWRQYWdlcyA9IFtdO1xuICAgICAgICAvLyBjaGVjayByb3V0ZS5tYXRjaFxuICAgICAgICBpZiAocm91dGUubWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyb3V0ZS5tYXRjaCBpbnN0YW5jZW9mIHN0cnVjdF8xLlBhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgcm91dGUubWF0Y2gsIHRoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIHJvdXRlLmRlYnVnKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNNYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFBhZ2VzLnB1c2gocm91dGUubWF0Y2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHJvdXRlLm1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuR3JvdXBQYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5pc01hdGNoR3JvdXBQYWdlSW1wbChpbWFnZSwgcm91dGUubWF0Y2gsIHRoaXMuZGVmYXVsdENvbmZpZy5Hcm91cFBhZ2VUaHJlcywgcm91dGUuZGVidWcpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXNNYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFBhZ2VzLnB1c2guYXBwbHkobWF0Y2hlZFBhZ2VzLCBtYXRjaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIHJvdXRlLmlzTWF0Y2ggZnVuY3Rpb25cbiAgICAgICAgaWYgKCFpc01hdGNoZWQgJiYgcm91dGUuY3VzdG9tTWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlzTWF0Y2hlZCA9IHJvdXRlLmN1c3RvbU1hdGNoKHRhc2tOYW1lLCBpbWFnZSk7XG4gICAgICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiZmluZE1hdGNoZWRSb3V0ZSBcIi5jb25jYXQocm91dGUucGF0aCwgXCIgaXNNYXRjaCgpID0+IFwiKS5jb25jYXQoaXNNYXRjaGVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImZpbmRNYXRjaGVkUm91dGUgXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIG1hdGNoOiBcIikuY29uY2F0KGlzTWF0Y2hlZCwgXCIsIGZpcnN0UGFnZTogXCIpLmNvbmNhdCgoX2EgPSBtYXRjaGVkUGFnZXNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc01hdGNoZWQ6IGlzTWF0Y2hlZCxcbiAgICAgICAgICAgIG1hdGNoZWRQYWdlczogbWF0Y2hlZFBhZ2VzLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzTWF0Y2hQYWdlSW1wbCA9IGZ1bmN0aW9uIChpbWFnZSwgcGFnZSwgcGFyZW50VGhyZXMsIGRlYnVnKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIHRocmVzID0gKF9hID0gcGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXM7XG4gICAgICAgIHZhciBpc1NhbWUgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwiY2hlY2tNYXRjaFBhZ2VbXCIuY29uY2F0KHBhZ2UubmFtZSwgXCJdXCIpKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gcGFnZS5wb2ludHNbaV07XG4gICAgICAgICAgICB2YXIgY29sb3IgPSBnZXRJbWFnZUNvbG9yKGltYWdlLCBwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIHZhciBzY29yZSA9IHV0aWxzXzEuVXRpbHMuaWRlbnRpdHlDb2xvcihwb2ludCwgY29sb3IpO1xuICAgICAgICAgICAgdmFyIGlzUG9pbnRDb2xvck1hdGNoID0gc2NvcmUgPj0gdGhyZXM7XG4gICAgICAgICAgICBpZiAoIWlzUG9pbnRDb2xvck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaXNTYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcInBvaW50W1wiLmNvbmNhdChpLCBcIl0gbWF0Y2ggZmFsc2U6IHNjb3JlOiBcIikuY29uY2F0KHNjb3JlLCBcIiwgdGhyZXM6IFwiKS5jb25jYXQodGhyZXMsIFwiXFxuXCIpLCBcImV4cGVjdDogXCIuY29uY2F0KHV0aWxzXzEuVXRpbHMuZm9ybWF0WFlSR0IocG9pbnQpLCBcIlxcblwiKSwgXCIgICBnZXQ6IFwiLmNvbmNhdCh1dGlsc18xLlV0aWxzLmZvcm1hdFhZUkdCKF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb2xvciksIHsgeDogcG9pbnQueCwgeTogcG9pbnQueSB9KSkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwiY2hlY2tNYXRjaFBhZ2VbXCIuY29uY2F0KHBhZ2UubmFtZSwgXCJdW21hdGNoOiBcIikuY29uY2F0KGlzU2FtZSwgXCJdXCIpKTtcbiAgICAgICAgcmV0dXJuIGlzU2FtZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc01hdGNoR3JvdXBQYWdlSW1wbCA9IGZ1bmN0aW9uIChpbWFnZSwgZ3JvdXBQYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgdGhyZXMgPSAoX2EgPSBncm91cFBhZ2UudGhyZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHBhcmVudFRocmVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwUGFnZS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSBncm91cFBhZ2UucGFnZXNbaV07XG4gICAgICAgICAgICB2YXIgaXNQYWdlTWF0Y2ggPSB0aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgcGFnZSwgdGhyZXMsIGRlYnVnKTtcbiAgICAgICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoR3JvdXBQYWdlOiBcIi5jb25jYXQoZ3JvdXBQYWdlLm5hbWUsIFwiLCBwYWdlW1wiKS5jb25jYXQoaSwgXCJdOiBcIikuY29uY2F0KHBhZ2UubmFtZSwgXCIgbWF0Y2g6IFwiKS5jb25jYXQoaXNQYWdlTWF0Y2gpKTtcbiAgICAgICAgICAgIGlmIChncm91cFBhZ2UubWF0Y2hPUCA9PT0gJ3x8JyAmJiBpc1BhZ2VNYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbcGFnZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JvdXBQYWdlLm1hdGNoT1AgPT09ICcmJicgJiYgIWlzUGFnZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncm91cFBhZ2UubWF0Y2hPUCA9PT0gJyYmJyA/IGdyb3VwUGFnZS5wYWdlcyA6IFtdO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwuYXBwbHkodGhpcywgX19zcHJlYWRBcnJheShbdGhpcy5kZWJ1Z10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUubG9nSW1wbCA9IGZ1bmN0aW9uIChkZWJ1Zykge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlYnVnIHx8ICF0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25seSBsb2cgd2hlbiBkZWJ1ZyArIHRoaXMuZGVidWcgaXMgdHJ1ZVxuICAgICAgICB1dGlsc18xLlV0aWxzLmxvZy5hcHBseSh1dGlsc18xLlV0aWxzLCBfX3NwcmVhZEFycmF5KFsnW1Jlcm91dGVyXVtkZWJ1Z10nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMubG9nLmFwcGx5KHV0aWxzXzEuVXRpbHMsIF9fc3ByZWFkQXJyYXkoWydbUmVyb3V0ZXJdW3dhcm5pbmddJ10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVyb3V0ZXI7XG59KCkpO1xuZXhwb3J0cy5SZXJvdXRlciA9IFJlcm91dGVyO1xuZXhwb3J0cy5yZXJvdXRlciA9IG5ldyBSZXJvdXRlcigpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVyb3V0ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNjcmVlbiA9IHZvaWQgMDtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgU2NyZWVuID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNjcmVlbihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIFNjcmVlbi5wcm90b3R5cGUuY2FsY3VsYXRlRGV2aWNlT2Zmc2V0ID0gZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBmdW5jKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCA9IHJlc3VsdHMuc2NyZWVuV2lkdGg7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCA9IHJlc3VsdHMuc2NyZWVuSGVpZ2h0O1xuICAgICAgICB0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYID0gcmVzdWx0cy5zY3JlZW5PZmZzZXRYO1xuICAgICAgICB0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRZID0gcmVzdWx0cy5zY3JlZW5PZmZzZXRZO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5YID0gZnVuY3Rpb24gKGRldlgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WCArIChkZXZYICogdGhpcy5jb25maWcuc2NyZWVuV2lkdGgpIC8gdGhpcy5jb25maWcuZGV2V2lkdGgpIHx8IDA7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblkgPSBmdW5jdGlvbiAoZGV2WSkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRZICsgKGRldlkgKiB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQpIC8gdGhpcy5jb25maWcuZGV2SGVpZ2h0KSB8fCAwO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5YWSA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICByZXR1cm4geyB4OiB4LCB5OiB5IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICByZXR1cm4geyB4OiB4LCB5OiB5IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnZXRTY3JlZW5YWSB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnRhcCA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICB0YXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHRhcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnRhcERvd24gPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgdGFwRG93bih4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgdGFwRG93bih4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLm1vdmVUbyA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICBtb3ZlVG8oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIG1vdmVUbyh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnRhcFVwID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHRhcFVwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICB0YXBVcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlbkNvbG9yID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIGltZyA9IHRoaXMuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICAgICAgdmFyIHJnYiA9IGdldEltYWdlQ29sb3IoaW1nLCBwMS54LCBwMS55KTtcbiAgICAgICAgICAgIHJlbGVhc2VJbWFnZShpbWcpO1xuICAgICAgICAgICAgcmV0dXJuIHJnYjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciBpbWcgPSB0aGlzLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgICAgIHZhciByZ2IgPSBnZXRJbWFnZUNvbG9yKGltZywgcDEsIHAyKTtcbiAgICAgICAgICAgIHJlbGVhc2VJbWFnZShpbWcpO1xuICAgICAgICAgICAgcmV0dXJuIHJnYjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5maW5kSW1hZ2UgPSBmdW5jdGlvbiAoZGV2SW1nKSB7XG4gICAgICAgIHZhciBpbWcgPSB0aGlzLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZpbmRJbWFnZShpbWcsIGRldkltZyk7XG4gICAgICAgIHJlbGVhc2VJbWFnZShpbWcpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXBJbWFnZSA9IGZ1bmN0aW9uIChkZXZJbWcpIHtcbiAgICAgICAgdmFyIHh5ID0gdGhpcy5maW5kSW1hZ2UoZGV2SW1nKTtcbiAgICAgICAgdGhpcy50YXAoeHkpO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5pc1NhbWVDb2xvciA9IGZ1bmN0aW9uIChkZXZDb2xvclBvaW50LCB0aHJlcykge1xuICAgICAgICBpZiAodGhyZXMgPT09IHZvaWQgMCkgeyB0aHJlcyA9IDAuOTsgfVxuICAgICAgICB2YXIgcmdiID0gdGhpcy5nZXRTY3JlZW5Db2xvcihkZXZDb2xvclBvaW50KTtcbiAgICAgICAgdmFyIHNjb3JlID0gdXRpbHNfMS5VdGlscy5pZGVudGl0eUNvbG9yKHJnYiwgZGV2Q29sb3JQb2ludCk7XG4gICAgICAgIGlmIChzY29yZSA+IHRocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvLyBjdXJyZW50bHkgcmVhbCBkZXZpY2Ugc2NyZWVuc2hvdFxuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0RGV2aWNlU2NyZWVuc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFNjcmVlbnNob3QoKTtcbiAgICB9O1xuICAgIC8vIGN1cnJlbnRseSBkZXZpY2Ugc2NyZWVuc2hvdCBjdXQgYnkgb2Zmc2V0XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5TY3JlZW5zaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdE1vZGlmeSh0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYLCB0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRZLCB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCwgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0LCB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCwgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0LCAxMDApO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRDdnREZXZTY3JlZW5zaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdE1vZGlmeSh0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYLCB0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRZLCB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCwgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0LCB0aGlzLmNvbmZpZy5kZXZXaWR0aCwgdGhpcy5jb25maWcuZGV2SGVpZ2h0LCAxMDApO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hID0gZ2V0U2NyZWVuU2l6ZSgpLCB3aWR0aCA9IF9hLndpZHRoLCBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0SW1hZ2VSb3RhdGlvbiA9IGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICB2YXIgX2EgPSBnZXRJbWFnZVNpemUoaW1hZ2UpLCB3aWR0aCA9IF9hLndpZHRoLCBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuc2V0QWN0aW9uRHVyaW5nID0gZnVuY3Rpb24gKGR1cmluZykge1xuICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcgPSBkdXJpbmc7XG4gICAgfTtcbiAgICBTY3JlZW4uZGVidWcgPSBmYWxzZTtcbiAgICByZXR1cm4gU2NyZWVuO1xufSgpKTtcbmV4cG9ydHMuU2NyZWVuID0gU2NyZWVuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NyZWVuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5EZWZhdWx0U2NyZWVuQ29uZmlnID0gZXhwb3J0cy5EZWZhdWx0UmVyb3V0ZXJDb25maWcgPSBleHBvcnRzLkRlZmF1bHRDb25maWdWYWx1ZSA9IGV4cG9ydHMuR3JvdXBQYWdlID0gZXhwb3J0cy5QYWdlID0gdm9pZCAwO1xudmFyIFBhZ2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFnZShuYW1lLCBkZXZQb2ludHMsIG5leHQsIGJhY2ssIHRocmVzKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSB2b2lkIDApIHsgbmV4dCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAoYmFjayA9PT0gdm9pZCAwKSB7IGJhY2sgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBkZXZQb2ludHM7XG4gICAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gICAgICAgIHRoaXMuYmFjayA9IGJhY2s7XG4gICAgICAgIHRoaXMudGhyZXMgPSB0aHJlcztcbiAgICB9XG4gICAgcmV0dXJuIFBhZ2U7XG59KCkpO1xuZXhwb3J0cy5QYWdlID0gUGFnZTtcbnZhciBHcm91cFBhZ2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR3JvdXBQYWdlKG5hbWUsIHBhZ2VzLCBuZXh0LCBiYWNrLCB0aHJlcywgbWF0Y2hPUCkge1xuICAgICAgICBpZiAobmV4dCA9PT0gdm9pZCAwKSB7IG5leHQgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKGJhY2sgPT09IHZvaWQgMCkgeyBiYWNrID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0aHJlcyA9PT0gdm9pZCAwKSB7IHRocmVzID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmIChtYXRjaE9QID09PSB2b2lkIDApIHsgbWF0Y2hPUCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnBhZ2VzID0gcGFnZXM7XG4gICAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gICAgICAgIHRoaXMuYmFjayA9IGJhY2s7XG4gICAgICAgIHRoaXMudGhyZXMgPSB0aHJlcztcbiAgICAgICAgdGhpcy5tYXRjaE9QID0gbWF0Y2hPUCB8fCAnfHwnO1xuICAgIH1cbiAgICByZXR1cm4gR3JvdXBQYWdlO1xufSgpKTtcbmV4cG9ydHMuR3JvdXBQYWdlID0gR3JvdXBQYWdlO1xuZXhwb3J0cy5EZWZhdWx0Q29uZmlnVmFsdWUgPSB7XG4gICAgWFlSR0JUaHJlczogMC45LFxuICAgIFBhZ2VUaHJlczogMC45LFxuICAgIEdyb3VwUGFnZVRocmVzOiAwLjksXG4gICAgR3JvdXBQYWdlTWF0Y2hPUDogJ3x8JyxcbiAgICBSb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoVGltZXM6IDEsXG4gICAgUm91dGVDb25maWdTaG91bGRNYXRjaER1cmluZzogMCxcbiAgICBSb3V0ZUNvbmZpZ0JlZm9yZUFjdGlvbkRlbGF5OiAyNTAsXG4gICAgUm91dGVDb25maWdBZnRlckFjdGlvbkRlbGF5OiAyNTAsXG4gICAgUm91dGVDb25maWdQcmlvcml0eTogMSxcbiAgICBSb3V0ZUNvbmZpZ0RlYnVnOiBmYWxzZSxcbiAgICBUYXNrQ29uZmlnTWF4VGFza1J1blRpbWVzOiAxLFxuICAgIFRhc2tDb25maWdNYXhUYXNrRHVyaW5nOiAwLFxuICAgIFRhc2tDb25maWdNaW5Sb3VuZEludGVydmFsOiAwLFxuICAgIFRhc2tDb25maWdBdXRvU3RvcDogZmFsc2UsXG4gICAgVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5OiAyMDAwLFxufTtcbmV4cG9ydHMuRGVmYXVsdFJlcm91dGVyQ29uZmlnID0ge1xuICAgIHBhY2thZ2VOYW1lOiAnJyxcbiAgICB0YXNrRGVsYXk6IDIwMDAsXG4gICAgc3RhcnRBcHBEZWxheTogNjAwMCxcbiAgICBhdXRvTGF1bmNoQXBwOiB0cnVlLFxuICAgIHRlc3RpbmdTY3JlZW5zaG90UGF0aDogJy4vc2NyZWVuc2hvdCcsXG59O1xuZXhwb3J0cy5EZWZhdWx0U2NyZWVuQ29uZmlnID0ge1xuICAgIGRldldpZHRoOiA2NDAsXG4gICAgZGV2SGVpZ2h0OiAzNjAsXG4gICAgZGV2aWNlV2lkdGg6IDAsXG4gICAgZGV2aWNlSGVpZ2h0OiAwLFxuICAgIHNjcmVlbldpZHRoOiAwLFxuICAgIHNjcmVlbkhlaWdodDogMCxcbiAgICBzY3JlZW5PZmZzZXRYOiAwLFxuICAgIHNjcmVlbk9mZnNldFk6IDAsXG4gICAgYWN0aW9uRHVyaW5nOiAxODAsXG4gICAgcm90YXRpb246ICdob3Jpem9udGFsJyxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJ1Y3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlV0aWxzID0gZXhwb3J0cy5sb2cgPSB2b2lkIDA7XG5mdW5jdGlvbiBsb2coKSB7XG4gICAgdmFyIG1zZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBtc2dzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7XG4gICAgICAgIHRpbWVab25lOiAnQXNpYS9UYWlwZWknLFxuICAgIH0pO1xuICAgIHZhciBtZXNzYWdlID0gXCJbXCIuY29uY2F0KGRhdGUsIFwiXSBcIik7XG4gICAgZm9yICh2YXIgX2EgPSAwLCBtc2dzXzEgPSBtc2dzOyBfYSA8IG1zZ3NfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgdmFyIG1zZyA9IG1zZ3NfMVtfYV07XG4gICAgICAgIGlmICh0eXBlb2YgbXNnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlwiLmNvbmNhdChKU09OLnN0cmluZ2lmeShtc2cpLCBcIiBcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiXCIuY29uY2F0KG1zZywgXCIgXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2Uuc3Vic3RyKDAsIG1lc3NhZ2UubGVuZ3RoIC0gMSkpO1xufVxuZXhwb3J0cy5sb2cgPSBsb2c7XG52YXIgVXRpbHMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXRpbHMoKSB7XG4gICAgfVxuICAgIFV0aWxzLmlkZW50aXR5Q29sb3IgPSBmdW5jdGlvbiAoZTEsIGUyKSB7XG4gICAgICAgIHZhciBtZWFuID0gKGUxLnIgKyBlMi5yKSAvIDI7XG4gICAgICAgIHZhciByID0gZTEuciAtIGUyLnI7XG4gICAgICAgIHZhciBnID0gZTEuZyAtIGUyLmc7XG4gICAgICAgIHZhciBiID0gZTEuYiAtIGUyLmI7XG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KCgoKDUxMiArIG1lYW4pICogciAqIHIpID4+IDgpICsgNCAqIGcgKiBnICsgKCgoNzY3IC0gbWVhbikgKiBiICogYikgPj4gOCkpIC8gNzY4O1xuICAgIH07XG4gICAgVXRpbHMuZm9ybWF0WFlSR0IgPSBmdW5jdGlvbiAoeHlyZ2IpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh4eXJnYik7XG4gICAgICAgIHZhciBmb3JtYXRPYmogPSB7fTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrZXlzXzEgPSBrZXlzOyBfaSA8IGtleXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c18xW19pXTtcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIlwiLmNvbmNhdCh4eXJnYltrXSk7XG4gICAgICAgICAgICB3aGlsZSAoc3RyLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnICcgKyBzdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3JtYXRPYmpba10gPSBzdHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHggPSBmb3JtYXRPYmoueCwgeSA9IGZvcm1hdE9iai55LCByID0gZm9ybWF0T2JqLnIsIGcgPSBmb3JtYXRPYmouZywgYiA9IGZvcm1hdE9iai5iO1xuICAgICAgICByZXR1cm4gXCJ7IHg6IFwiLmNvbmNhdCh4LCBcIiwgeTogXCIpLmNvbmNhdCh5LCBcIiwgcjogXCIpLmNvbmNhdChyLCBcIiwgZzogXCIpLmNvbmNhdChnLCBcIiwgYjogXCIpLmNvbmNhdChiLCBcIiB9XCIpO1xuICAgIH07XG4gICAgVXRpbHMuc29ydFN0cmluZ051bWJlck1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1hcCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsga2V5OiBrZXksIGNvdW50OiBtYXBba2V5XSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGIuY291bnQgLSBhLmNvdW50OyB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcbiAgICBVdGlscy5zbGVlcCA9IGZ1bmN0aW9uIChkdXJpbmcpIHtcbiAgICAgICAgd2hpbGUgKGR1cmluZyA+IDIwMCkge1xuICAgICAgICAgICAgZHVyaW5nIC09IDIwMDtcbiAgICAgICAgICAgIHNsZWVwKDIwMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR1cmluZyA+IDApIHtcbiAgICAgICAgICAgIHNsZWVwKGR1cmluZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLmdldFRhaXdhblRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdygpICsgOCAqIDYwICogNjAgKiAxMDAwO1xuICAgIH07XG4gICAgVXRpbHMubG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBhcmdzW2ldID0gSlNPTi5zdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKFV0aWxzLmdldFRhaXdhblRpbWUoKSk7XG4gICAgICAgIHZhciBkYXRlU3RyaW5nID0gXCJbXCIuY29uY2F0KGRhdGUuZ2V0TW9udGgoKSArIDEsIFwiLVwiKS5jb25jYXQoZGF0ZS5nZXREYXRlKCksIFwiVFwiKS5jb25jYXQoZGF0ZS5nZXRIb3VycygpLCBcIjpcIikuY29uY2F0KGRhdGUuZ2V0TWludXRlcygpLCBcIjpcIikuY29uY2F0KGRhdGUuZ2V0U2Vjb25kcygpLCBcIl1cIik7XG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIF9fc3ByZWFkQXJyYXkoW2RhdGVTdHJpbmddLCBhcmdzLCBmYWxzZSkpO1xuICAgIH07XG4gICAgVXRpbHMubm90aWZ5RXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGNvbnRlbnQpIHtcbiAgICAgICAgaWYgKHNlbmRFdmVudCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFV0aWxzLmxvZygnc2VuZEV2ZW50JywgZXZlbnQsIGNvbnRlbnQpO1xuICAgICAgICAgICAgc2VuZEV2ZW50KCcnICsgZXZlbnQsICcnICsgY29udGVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFV0aWxzLnN0YXJ0QXBwID0gZnVuY3Rpb24gKHBhY2thZ2VOYW1lKSB7XG4gICAgICAgIGV4ZWN1dGUoXCJCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvbnNjcnlwdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb2todHRwLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWp1bml0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9ib3VuY3ljYXN0bGUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsyLmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvbW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYW5kcm9pZC5wb2xpY3kuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3NlcnZpY2VzLmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay93ZWJ2aWV3Y2hyb21pdW0uamFyIGFtIHN0YXJ0IC1uIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgICAgICBleGVjdXRlKFwiQU5EUk9JRF9EQVRBPS9kYXRhIEJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1vai5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1saWJhcnQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvbnNjcnlwdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb2todHRwLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWp1bml0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9ib3VuY3ljYXN0bGUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvbW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYW5kcm9pZC5wb2xpY3kuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29yZy5hcGFjaGUuaHR0cC5sZWdhY3kuYm9vdC5qYXIgYW0gc3RhcnQgLW4gXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgICAgIGV4ZWN1dGUoXCJBTkRST0lEX0RBVEE9L2RhdGEgbW9ua2V5IC0tcGN0LXN5c2tleXMgMCAtcCBcIi5jb25jYXQocGFja2FnZU5hbWUsIFwiIC1jIGFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSIDFcIikpO1xuICAgICAgICBleGVjdXRlKCdBTkRST0lEX0JPT1RMT0dPPTEgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9ST09UPS9zeXN0ZW0gJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9BU1NFVFM9L3N5c3RlbS9hcHAgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9EQVRBPS9kYXRhICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfU1RPUkFHRT0vc3RvcmFnZSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0FSVF9ST09UPS9hcGV4L2NvbS5hbmRyb2lkLmFydCAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0kxOE5fUk9PVD0vYXBleC9jb20uYW5kcm9pZC5pMThuICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfVFpEQVRBX1JPT1Q9L2FwZXgvY29tLmFuZHJvaWQudHpkYXRhICcgK1xuICAgICAgICAgICAgJ0VYVEVSTkFMX1NUT1JBR0U9L3NkY2FyZCAnICtcbiAgICAgICAgICAgICdBU0VDX01PVU5UUE9JTlQ9L21udC9hc2VjICcgK1xuICAgICAgICAgICAgJ0JPT1RDTEFTU1BBVEg9L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1vai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1saWJhcnQuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtaWN1NGouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL29raHR0cC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYm91bmN5Y2FzdGxlLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay1hdGItYmFja3dhcmQtY29tcGF0aWJpbGl0eS5qYXI6L2FwZXgvY29tLmFuZHJvaWQuY29uc2NyeXB0L2phdmFsaWIvY29uc2NyeXB0LmphcjovYXBleC9jb20uYW5kcm9pZC5tZWRpYS9qYXZhbGliL3VwZGF0YWJsZS1tZWRpYS5qYXI6L2FwZXgvY29tLmFuZHJvaWQubWVkaWFwcm92aWRlci9qYXZhbGliL2ZyYW1ld29yay1tZWRpYXByb3ZpZGVyLmphcjovYXBleC9jb20uYW5kcm9pZC5vcy5zdGF0c2QvamF2YWxpYi9mcmFtZXdvcmstc3RhdHNkLmphcjovYXBleC9jb20uYW5kcm9pZC5wZXJtaXNzaW9uL2phdmFsaWIvZnJhbWV3b3JrLXBlcm1pc3Npb24uamFyOi9hcGV4L2NvbS5hbmRyb2lkLnNka2V4dC9qYXZhbGliL2ZyYW1ld29yay1zZGtleHRlbnNpb25zLmphcjovYXBleC9jb20uYW5kcm9pZC53aWZpL2phdmFsaWIvZnJhbWV3b3JrLXdpZmkuamFyOi9hcGV4L2NvbS5hbmRyb2lkLnRldGhlcmluZy9qYXZhbGliL2ZyYW1ld29yay10ZXRoZXJpbmcuamFyICcgK1xuICAgICAgICAgICAgJ0RFWDJPQVRCT09UQ0xBU1NQQVRIPS9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtb2ouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtbGliYXJ0LmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWljdTRqLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9va2h0dHAuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2JvdW5jeWNhc3RsZS5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmstYXRiLWJhY2t3YXJkLWNvbXBhdGliaWxpdHkuamFyICcgK1xuICAgICAgICAgICAgJ1NZU1RFTVNFUlZFUkNMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb20uYW5kcm9pZC5sb2NhdGlvbi5wcm92aWRlci5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvc2VydmljZXMuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V0aGVybmV0LXNlcnZpY2UuamFyOi9hcGV4L2NvbS5hbmRyb2lkLnBlcm1pc3Npb24vamF2YWxpYi9zZXJ2aWNlLXBlcm1pc3Npb24uamFyOi9hcGV4L2NvbS5hbmRyb2lkLmlwc2VjL2phdmFsaWIvYW5kcm9pZC5uZXQuaXBzZWMuaWtlLmphciAnICtcbiAgICAgICAgICAgIFwibW9ua2V5IC0tcGN0LXN5c2tleXMgMCAtcCBcIi5jb25jYXQocGFja2FnZU5hbWUsIFwiIC1jIGFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSIDFcIikpO1xuICAgIH07XG4gICAgVXRpbHMuc3RvcEFwcCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICBleGVjdXRlKFwiQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrMi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9zZXJ2aWNlcy5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvd2Vidmlld2Nocm9taXVtLmphciBhbSBmb3JjZS1zdG9wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgICAgICBleGVjdXRlKFwiQU5EUk9JRF9EQVRBPS9kYXRhIEJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1vai5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1saWJhcnQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvbnNjcnlwdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb2todHRwLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWp1bml0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9ib3VuY3ljYXN0bGUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvbW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYW5kcm9pZC5wb2xpY3kuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29yZy5hcGFjaGUuaHR0cC5sZWdhY3kuYm9vdC5qYXIgYW0gZm9yY2Utc3RvcCBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICB9O1xuICAgIFV0aWxzLmdldEN1cnJlbnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBleGVjdXRlKCdkdW1wc3lzIHdpbmRvdyB3aW5kb3dzJykuc3BsaXQoJ21DdXJyZW50Rm9jdXMnKTtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gWycnLCAnJ107XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0WzFdLnNwbGl0KCcgJyk7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgcmV0dXJuIFsnJywgJyddO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdFsyXSA9IHJlc3VsdFsyXS5yZXBsYWNlKCd9JywgJycpO1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbMl0uc3BsaXQoJy8nKTtcbiAgICAgICAgdmFyIHBhY2thZ2VOYW1lID0gJyc7XG4gICAgICAgIHZhciBhY3Rpdml0eU5hbWUgPSAnJztcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcGFja2FnZU5hbWUgPSByZXN1bHRbMF0udHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZSA9IHJlc3VsdFswXS50cmltKCk7XG4gICAgICAgICAgICBhY3Rpdml0eU5hbWUgPSByZXN1bHRbMV0udHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGFja2FnZU5hbWUsIGFjdGl2aXR5TmFtZV07XG4gICAgfTtcbiAgICBVdGlscy5pc0FwcE9uVG9wID0gZnVuY3Rpb24gKHBhY2thZ2VOYW1lKSB7XG4gICAgICAgIHZhciB0b3BJbmZvID0gZXhlY3V0ZSgnZHVtcHN5cyBhY3Rpdml0eSBhY3Rpdml0aWVzIHwgZ3JlcCBtUmVzdW1lZEFjdGl2aXR5Jyk7XG4gICAgICAgIHJldHVybiB0b3BJbmZvLmluZGV4T2YocGFja2FnZU5hbWUpICE9PSAtMTtcbiAgICB9O1xuICAgIFV0aWxzLnNlbmRTbGFja01lc3NhZ2UgPSBmdW5jdGlvbiAodXJsLCB0aXRsZSwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgYm9keSA9IHtcbiAgICAgICAgICAgIGJsb2NrczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICcqJyArIHRpdGxlICsgJyonLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGl2aWRlcicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgICAgICBodHRwQ2xpZW50KCdQT1NUJywgdXJsLCBKU09OLnN0cmluZ2lmeShib2R5KSwge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBVdGlscy53YWl0Rm9yQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbiwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpIHtcbiAgICAgICAgaWYgKG1hdGNoVGltZXMgPT09IHZvaWQgMCkgeyBtYXRjaFRpbWVzID0gMTsgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IHZvaWQgMCkgeyBpbnRlcnZhbCA9IDYwMDsgfVxuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdmFyIG1hdGNocyA9IDA7XG4gICAgICAgIHdoaWxlIChEYXRlLm5vdygpIC0gbm93IDwgdGltZW91dCkge1xuICAgICAgICAgICAgaWYgKGFjdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hzID49IG1hdGNoVGltZXMpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFV0aWxzLnNsZWVwKGludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hzID49IG1hdGNoVGltZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBVdGlscztcbn0oKSk7XG5leHBvcnRzLlV0aWxzID0gVXRpbHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5qcy5tYXAiLCJ2YXIgY2hhcmVuYyA9IHtcbiAgLy8gVVRGLTggZW5jb2RpbmdcbiAgdXRmODoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gY2hhcmVuYy5iaW4uc3RyaW5nVG9CeXRlcyh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShjaGFyZW5jLmJpbi5ieXRlc1RvU3RyaW5nKGJ5dGVzKSkpO1xuICAgIH1cbiAgfSxcblxuICAvLyBCaW5hcnkgZW5jb2RpbmdcbiAgYmluOiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgICAgICBieXRlcy5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHN0ciA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICBzdHIucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKSk7XG4gICAgICByZXR1cm4gc3RyLmpvaW4oJycpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFyZW5jO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgYmFzZTY0bWFwXG4gICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJyxcblxuICBjcnlwdCA9IHtcbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiBsZWZ0XG4gICAgcm90bDogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8IGIpIHwgKG4gPj4+ICgzMiAtIGIpKTtcbiAgICB9LFxuXG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gcmlnaHRcbiAgICByb3RyOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgKDMyIC0gYikpIHwgKG4gPj4+IGIpO1xuICAgIH0sXG5cbiAgICAvLyBTd2FwIGJpZy1lbmRpYW4gdG8gbGl0dGxlLWVuZGlhbiBhbmQgdmljZSB2ZXJzYVxuICAgIGVuZGlhbjogZnVuY3Rpb24obikge1xuICAgICAgLy8gSWYgbnVtYmVyIGdpdmVuLCBzd2FwIGVuZGlhblxuICAgICAgaWYgKG4uY29uc3RydWN0b3IgPT0gTnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdC5yb3RsKG4sIDgpICYgMHgwMEZGMDBGRiB8IGNyeXB0LnJvdGwobiwgMjQpICYgMHhGRjAwRkYwMDtcbiAgICAgIH1cblxuICAgICAgLy8gRWxzZSwgYXNzdW1lIGFycmF5IGFuZCBzd2FwIGFsbCBpdGVtc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuLmxlbmd0aDsgaSsrKVxuICAgICAgICBuW2ldID0gY3J5cHQuZW5kaWFuKG5baV0pO1xuICAgICAgcmV0dXJuIG47XG4gICAgfSxcblxuICAgIC8vIEdlbmVyYXRlIGFuIGFycmF5IG9mIGFueSBsZW5ndGggb2YgcmFuZG9tIGJ5dGVzXG4gICAgcmFuZG9tQnl0ZXM6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW107IG4gPiAwOyBuLS0pXG4gICAgICAgIGJ5dGVzLnB1c2goTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGJpZy1lbmRpYW4gMzItYml0IHdvcmRzXG4gICAgYnl0ZXNUb1dvcmRzOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgd29yZHMgPSBbXSwgaSA9IDAsIGIgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyssIGIgKz0gOClcbiAgICAgICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKTtcbiAgICAgIHJldHVybiB3b3JkcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBiaWctZW5kaWFuIDMyLWJpdCB3b3JkcyB0byBhIGJ5dGUgYXJyYXlcbiAgICB3b3Jkc1RvQnl0ZXM6IGZ1bmN0aW9uKHdvcmRzKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBiID0gMDsgYiA8IHdvcmRzLmxlbmd0aCAqIDMyOyBiICs9IDgpXG4gICAgICAgIGJ5dGVzLnB1c2goKHdvcmRzW2IgPj4+IDVdID4+PiAoMjQgLSBiICUgMzIpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGhleCBzdHJpbmdcbiAgICBieXRlc1RvSGV4OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgaGV4ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldID4+PiA0KS50b1N0cmluZygxNikpO1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gJiAweEYpLnRvU3RyaW5nKDE2KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgaGV4IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBoZXhUb0J5dGVzOiBmdW5jdGlvbihoZXgpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGMgPSAwOyBjIDwgaGV4Lmxlbmd0aDsgYyArPSAyKVxuICAgICAgICBieXRlcy5wdXNoKHBhcnNlSW50KGhleC5zdWJzdHIoYywgMiksIDE2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgYmFzZS02NCBzdHJpbmdcbiAgICBieXRlc1RvQmFzZTY0OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgYmFzZTY0ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgdmFyIHRyaXBsZXQgPSAoYnl0ZXNbaV0gPDwgMTYpIHwgKGJ5dGVzW2kgKyAxXSA8PCA4KSB8IGJ5dGVzW2kgKyAyXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA0OyBqKyspXG4gICAgICAgICAgaWYgKGkgKiA4ICsgaiAqIDYgPD0gYnl0ZXMubGVuZ3RoICogOClcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKGJhc2U2NG1hcC5jaGFyQXQoKHRyaXBsZXQgPj4+IDYgKiAoMyAtIGopKSAmIDB4M0YpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBiYXNlNjQucHVzaCgnPScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2U2NC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJhc2UtNjQgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGJhc2U2NFRvQnl0ZXM6IGZ1bmN0aW9uKGJhc2U2NCkge1xuICAgICAgLy8gUmVtb3ZlIG5vbi1iYXNlLTY0IGNoYXJhY3RlcnNcbiAgICAgIGJhc2U2NCA9IGJhc2U2NC5yZXBsYWNlKC9bXkEtWjAtOStcXC9dL2lnLCAnJyk7XG5cbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwLCBpbW9kNCA9IDA7IGkgPCBiYXNlNjQubGVuZ3RoO1xuICAgICAgICAgIGltb2Q0ID0gKytpICUgNCkge1xuICAgICAgICBpZiAoaW1vZDQgPT0gMCkgY29udGludWU7XG4gICAgICAgIGJ5dGVzLnB1c2goKChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkgLSAxKSlcbiAgICAgICAgICAgICYgKE1hdGgucG93KDIsIC0yICogaW1vZDQgKyA4KSAtIDEpKSA8PCAoaW1vZDQgKiAyKSlcbiAgICAgICAgICAgIHwgKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSkpID4+PiAoNiAtIGltb2Q0ICogMikpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBjcnlwdDtcbn0pKCk7XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBjcnlwdCA9IHJlcXVpcmUoJ2NyeXB0JyksXHJcbiAgICAgIHV0ZjggPSByZXF1aXJlKCdjaGFyZW5jJykudXRmOCxcclxuICAgICAgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKSxcclxuICAgICAgYmluID0gcmVxdWlyZSgnY2hhcmVuYycpLmJpbixcclxuXHJcbiAgLy8gVGhlIGNvcmVcclxuICBtZDUgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgLy8gQ29udmVydCB0byBieXRlIGFycmF5XHJcbiAgICBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcpXHJcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZW5jb2RpbmcgPT09ICdiaW5hcnknKVxyXG4gICAgICAgIG1lc3NhZ2UgPSBiaW4uc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG1lc3NhZ2UgPSB1dGY4LnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICBlbHNlIGlmIChpc0J1ZmZlcihtZXNzYWdlKSlcclxuICAgICAgbWVzc2FnZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1lc3NhZ2UsIDApO1xyXG4gICAgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZSkgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciAhPT0gVWludDhBcnJheSlcclxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UudG9TdHJpbmcoKTtcclxuICAgIC8vIGVsc2UsIGFzc3VtZSBieXRlIGFycmF5IGFscmVhZHlcclxuXHJcbiAgICB2YXIgbSA9IGNyeXB0LmJ5dGVzVG9Xb3JkcyhtZXNzYWdlKSxcclxuICAgICAgICBsID0gbWVzc2FnZS5sZW5ndGggKiA4LFxyXG4gICAgICAgIGEgPSAgMTczMjU4NDE5MyxcclxuICAgICAgICBiID0gLTI3MTczMzg3OSxcclxuICAgICAgICBjID0gLTE3MzI1ODQxOTQsXHJcbiAgICAgICAgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gICAgLy8gU3dhcCBlbmRpYW5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtW2ldID0gKChtW2ldIDw8ICA4KSB8IChtW2ldID4+PiAyNCkpICYgMHgwMEZGMDBGRiB8XHJcbiAgICAgICAgICAgICAoKG1baV0gPDwgMjQpIHwgKG1baV0gPj4+ICA4KSkgJiAweEZGMDBGRjAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhZGRpbmdcclxuICAgIG1bbCA+Pj4gNV0gfD0gMHg4MCA8PCAobCAlIDMyKTtcclxuICAgIG1bKCgobCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsO1xyXG5cclxuICAgIC8vIE1ldGhvZCBzaG9ydGN1dHNcclxuICAgIHZhciBGRiA9IG1kNS5fZmYsXHJcbiAgICAgICAgR0cgPSBtZDUuX2dnLFxyXG4gICAgICAgIEhIID0gbWQ1Ll9oaCxcclxuICAgICAgICBJSSA9IG1kNS5faWk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xyXG5cclxuICAgICAgdmFyIGFhID0gYSxcclxuICAgICAgICAgIGJiID0gYixcclxuICAgICAgICAgIGNjID0gYyxcclxuICAgICAgICAgIGRkID0gZDtcclxuXHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDBdLCAgNywgLTY4MDg3NjkzNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDcsIC0xNzY0MTg4OTcpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgOF0sICA3LCAgMTc3MDAzNTQxNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTcsIC00MjA2Myk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDcsICAxODA0NjAzNjgyKTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsxM10sIDEyLCAtNDAzNDExMDEpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyAxXSwgIDUsIC0xNjU3OTY1MTApO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyA2XSwgIDksIC0xMDY5NTAxNjMyKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgMF0sIDIwLCAtMzczODk3MzAyKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgNV0sICA1LCAtNzAxNTU4NjkxKTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsxMF0sICA5LCAgMzgwMTYwODMpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA5XSwgIDUsICA1Njg0NDY0MzgpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzE0XSwgIDksIC0xMDE5ODAzNjkwKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krMTNdLCAgNSwgLTE0NDQ2ODE0NjcpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyAyXSwgIDksIC01MTQwMzc4NCk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDVdLCAgNCwgLTM3ODU1OCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyAxXSwgIDQsIC0xNTMwOTkyMDYwKTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKzEzXSwgIDQsICA2ODEyNzkxNzQpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDldLCAgNCwgLTY0MDM2NDQ4Nyk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyAwXSwgIDYsIC0xOTg2MzA4NDQpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsxMl0sICA2LCAgMTcwMDQ4NTU3MSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDhdLCAgNiwgIDE4NzMzMTMzNTkpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgNF0sICA2LCAtMTQ1NTIzMDcwKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgICBhID0gKGEgKyBhYSkgPj4+IDA7XHJcbiAgICAgIGIgPSAoYiArIGJiKSA+Pj4gMDtcclxuICAgICAgYyA9IChjICsgY2MpID4+PiAwO1xyXG4gICAgICBkID0gKGQgKyBkZCkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNyeXB0LmVuZGlhbihbYSwgYiwgYywgZF0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEF1eGlsaWFyeSBmdW5jdGlvbnNcclxuICBtZDUuX2ZmICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGMgfCB+YiAmIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2dnICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGQgfCBjICYgfmQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2hoICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiBeIGMgXiBkKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9paSAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGMgXiAoYiB8IH5kKSkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG5cclxuICAvLyBQYWNrYWdlIHByaXZhdGUgYmxvY2tzaXplXHJcbiAgbWQ1Ll9ibG9ja3NpemUgPSAxNjtcclxuICBtZDUuX2RpZ2VzdHNpemUgPSAxNjtcclxuXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG1lc3NhZ2UgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSBudWxsKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgYXJndW1lbnQgJyArIG1lc3NhZ2UpO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlTmFtZTogc3RyaW5nID0gJ2NvbS5jb20ydXMubmluZXBiM2Qubm9ybWFsLmZyZWVmdWxsLmdvb2dsZS5nbG9iYWwuYW5kcm9pZC5jb21tb24nO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlWWVhck1pbjogbnVtYmVyID0gMjAyMztcbmV4cG9ydCBjb25zdCBzbGVlcFNob3J0OiBudW1iZXIgPSAxNTAwO1xuZXhwb3J0IGNvbnN0IHNsZWVwTWVkaXVtOiBudW1iZXIgPSAzMDAwO1xuZXhwb3J0IGNvbnN0IHNsZWVwTG9uZzogbnVtYmVyID0gNDAwMDtcbmV4cG9ydCBjb25zdCBzbGVlcFdhaXRQYWdlTG9uZzogbnVtYmVyID0gMjQgKiAxMDAwO1xuZXhwb3J0IGNvbnN0IHNsZWVwRm9yQWQ6IG51bWJlciA9IDMwICogMTAwMDtcbmV4cG9ydCBjb25zdCBtaW51dGVJbk1zOiBudW1iZXIgPSA2MCAqIDEwMDA7XG5leHBvcnQgY29uc3QgaG91ckluTXM6IG51bWJlciA9IG1pbnV0ZUluTXMgKiA2MDtcbmV4cG9ydCBjb25zdCBkYXlJbk1zOiBudW1iZXIgPSBob3VySW5NcyAqIDI0O1xuZXhwb3J0IGNvbnN0IGR1cmluZ01heEFkUmV0cnk6IG51bWJlciA9IDIgKiBtaW51dGVJbk1zO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoV2FpdGluZ0xvZ2luUGFnZXNJbnRlcnZhbDogbnVtYmVyID0gMzAgKiBtaW51dGVJbk1zO1xuZXhwb3J0IGNvbnN0IHNlbmRSdW5uaW5nRXZlbnRJbnRlcnZhbDogbnVtYmVyID0gNSAqIG1pbnV0ZUluTXM7XG5leHBvcnQgY29uc3Qgc2VuZFdhaXRJbnB1dEV2ZW50SW50ZXJ2YWw6IG51bWJlciA9IDUgKiBtaW51dGVJbk1zO1xuZXhwb3J0IGNvbnN0IHVwbG9hZFNlc3Npb25JbnRlcnZhbDogbnVtYmVyID0gMSAqIGhvdXJJbk1zO1xuIiwiaW1wb3J0IHsgVXRpbHMsIFJvdXRlQ29uZmlnIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0IHsgcmVyb3V0ZXIsIENvbmZpZywgc3RhdGUgfSBmcm9tICcuL21vZHVsZXMnO1xuaW1wb3J0IHsgVEFTSywgd2Vla2x5TWlzc2lvbiB9IGZyb20gJy4vdGFza3MnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4vY29uc3RhbnRzJztcblxuaW1wb3J0ICogYXMgUEFHRSBmcm9tICcuL3BhZ2VzJztcbmltcG9ydCB7IGlzU2FtZUNvbG9yLCBnZXRDb2xvckNvdW50SW5SYW5nZSwgaXNTYW1lQ29sb3JDb3VudCwgYXJyYXlGaW5kLCBTYXZlUGFnZVJlZmVyZW5jZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBWRVJTSU9OX0NPREU6IG51bWJlciA9IDE1LjM0O1xuXG5leHBvcnQgY2xhc3MgTUxCOUkge1xuICBwdWJsaWMgc3RhdGljIHBhY2thZ2VOYW1lOiBzdHJpbmcgPSAnY29tLmNvbTJ1cy5uaW5lcGIzZC5ub3JtYWwuZnJlZWZ1bGwuZ29vZ2xlLmdsb2JhbC5hbmRyb2lkLmNvbW1vbic7XG5cbiAgY29uc3RydWN0b3IoanNvbkNvbmZpZzogYW55KSB7XG4gICAgY29uc29sZS5sb2coJyMjIyMjIyMjIyMjIyBuZXcgTUxCOUkgIyMjIyMjIyMjIyMjJyk7XG4gICAgY29uc29sZS5sb2coYHNjcmlwdCB2ZXJzaW9uICR7VkVSU0lPTl9DT0RFfWApO1xuICAgIHN0YXRlLmluaXQoanNvbkNvbmZpZyk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnQoKSB7XG4gICAgaWYgKENvbmZpZy5jb25maWcuaXNMb2NhbFBhaWQpIHtcbiAgICAgIHZhciBwbGFuID0gZ2V0VXNlclBsYW4oKTtcbiAgICAgIGlmIChwbGFuICE9ICd1c2VyX3BsYW5fbWxiOWknKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1c2VyIHBsYW4gaWQ6ICcsIEpTT04uc3RyaW5naWZ5KHBsYW4pKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsZWFzZSBzdWJzY3JpYmUgcHJlbWl1bSBwbGFuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZXNBbmRUYXNrcygpO1xuICAgIHJlcm91dGVyLnN0YXJ0KE1MQjlJLnBhY2thZ2VOYW1lKTtcbiAgfVxuICBwdWJsaWMgc3RvcCgpIHtcbiAgICByZXJvdXRlci5zdG9wKCk7XG4gICAgc3RhdGUuZW5kKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzQW5kVGFza3MoKSB7XG4gICAgdGhpcy5hZGRSb3V0ZXMoKTtcbiAgICB0aGlzLmhhbmRsZVVua25vd24oKTtcbiAgICAvLyByZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpO1xuXG4gICAgaWYgKENvbmZpZy5jb25maWcuaXNMb2NhbFBhaWQgfHwgQ29uZmlnLmNvbmZpZy5pc0Rldikge1xuICAgICAgdGhpcy5hZGRQcmVtaXVtVGFza3MoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICAgIHRoaXMuYWRkQmFzaWNUYXNrcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIUNvbmZpZy5jb25maWcubGljZW5zZUlkKSB7XG4gICAgICBjb25zb2xlLmxvZygnbm8gbGljZW5zZSBpZCcpO1xuICAgICAgdGhpcy5hZGRTdGF5SW5Mb2dpblRhc2tzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hZGRQcmVtaXVtVGFza3MoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRCYXNpY1Rhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5wbGF5TGVhZ3VlR2FtZSxcbiAgICAgIC8vIG1heFRhc2tSdW5UaW1lczogMixcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLmhvdXJJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRQcmVtaXVtVGFza3MoKSB7XG4gICAgLy8gb25seSBydW4gb25jZVxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5zZXR0aW5nRGVmYXVsdCxcbiAgICAgIC8vIG1heFRhc2tSdW5UaW1lczogMSxcbiAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgICBmb3JjZVN0b3A6IHRydWUsXG4gICAgfSk7XG4gICAgLy8gRklYTUU6IHRoaXMgc2hvdWxkIG9ubHkgcnVuIHdoZW4gbmVlZGVkXG4gICAgcmVyb3V0ZXIuYWRkVGFzayh7XG4gICAgICBuYW1lOiBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzLFxuICAgICAgbWluUm91bmRJbnRlcnZhbDogMSAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgbWF4VGFza0R1cmluZzogMTAgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICAgIGJlZm9yZVJvdXRlOiB0YXNrID0+IHtcbiAgICAgICAgaWYgKCFzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzKSB7XG4gICAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5wbGF5TGVhZ3VlR2FtZSxcbiAgICAgIC8vIG1heFRhc2tSdW5UaW1lczogMixcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLmhvdXJJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgQ29uZmlnLmNvbmZpZy5pc1J1blBsYXlCYXR0bGVHYW1lICYmXG4gICAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgICAgbmFtZTogVEFTSy5wbGF5QmF0dGxlR2FtZSxcbiAgICAgICAgbWluUm91bmRJbnRlcnZhbDogQ09OU1RBTlRTLmhvdXJJbk1zLFxuICAgICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICB3ZWVrbHlNaXNzaW9uLmFkZFRhc2soKTtcbiAgICBDb25maWcuY29uZmlnLmlzUnVuQWRSZXdhcmQgJiZcbiAgICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgICBuYW1lOiBUQVNLLmFkUmV3YXJkLFxuICAgICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5taW51dGVJbk1zICogMzAsXG4gICAgICAgIGZpbmRSb3V0ZURlbGF5OiBDT05TVEFOVFMuc2xlZXBNZWRpdW0sXG5cbiAgICAgICAgbWF4VGFza0R1cmluZzogQ09OU1RBTlRTLnNsZWVwRm9yQWQgKyBDT05TVEFOVFMuZHVyaW5nTWF4QWRSZXRyeSxcbiAgICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0sucmVzdGFydEFwcFBlckRheSxcbiAgICAgIC8vIG1heFRhc2tSdW5UaW1lczogMSxcbiAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5kYXlJbk1zLFxuICAgICAgYmVmb3JlUm91dGU6IHRhc2sgPT4ge1xuICAgICAgICBpZiAodGFzay5sYXN0UnVuVGltZSAhPT0gMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXN0YXJ0IGFwcCB0YXNrJyk7XG4gICAgICAgICAgcmVyb3V0ZXIucmVzdGFydEFwcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnc2tpcFJvdXRlTG9vcCc7XG4gICAgICB9LFxuICAgICAgbWF4VGFza0R1cmluZzogMzAgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgYWRkU3RheUluTG9naW5UYXNrcygpIHtcbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0suc3RheUluTG9naW4sXG4gICAgICBmb3JjZVN0b3A6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFJvdXRlcygpIHtcbiAgICAvLyAqKiBsYXVuY2hpbmcgcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sb2dvLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxvZ28sXG4gICAgICBhY3Rpb246IGNvbnRleHQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnd2FpdCBhcHAgbG9hZGluZyAuLi4nKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgaWYgKCFDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLm9uTGF1bmNoaW5nKCk7XG5cbiAgICAgICAgLy8gcmVvcGVuIGlmIHN0dWNrXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmIChub3cgLSBjb250ZXh0Lm1hdGNoU3RhcnRUUyA+IDUgKiBDT05TVEFOVFMubWludXRlSW5Ncykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHVjayBpbiBsYXVuY2ggcGFnZSB0b28gbG9uZywgcmVzdGFydCBhcHAnKTtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGFuZGluZ0xvYWRpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGFuZGluZ0xvYWRpbmcsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKF8gPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbGFuZGluZyBsb2FkaW5nLi4uJyk7XG4gICAgICAgIHN0YXRlLm9uTGF1bmNoaW5nKCk7XG4gICAgICB9KSxcbiAgICAgIGFmdGVyQWN0aW9uRGVsYXk6IENPTlNUQU5UUy5zbGVlcE1lZGl1bSxcbiAgICB9KTtcbiAgICBbUEFHRS5kb3dubG9hZERhdGEsIFBBR0UucHJvZ3Jlc3NCYXJSdW5uaW5nXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwTG9uZyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFtQQUdFLlRPUywgUEFHRS5UT1M5MCwgUEFHRS5UT1M5MHYyXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gKiogbG9naW4gcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sYW5kaW5nLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxhbmRpbmcsXG4gICAgICBhY3Rpb246IGNvbnRleHQgPT4ge1xuICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaXNDbG91ZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF5IGluIGxvZ2luJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUub25Mb2dpblBhZ2UoKTtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLnN0YXlJbkxvZ2luKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICBpZiAoY29udGV4dC5tYXRjaER1cmluZyA8IENPTlNUQU5UUy5zd2l0Y2hXYWl0aW5nTG9naW5QYWdlc0ludGVydmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayBoaXZlIGxvZ2luIGZvciBhdm9pZCBhcHAgY3J1c2gnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxhbmRpbmcpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFtQQUdFLmxvZ0luLCBQQUdFLmxvZ0luOTBdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgICAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF5IGluIGxvZ2luJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbmVlZFVzZXJJbnB1dCA9IGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnN0YXlJbkxvZ2luO1xuICAgICAgICAgIHN0YXRlLm9uTG9naW5QYWdlKG5lZWRVc2VySW5wdXQpO1xuXG4gICAgICAgICAgaWYgKCFuZWVkVXNlcklucHV0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgICAga2V5Y29kZSgnQkFDSycsIDEwMCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygna2V5Y29kZSBiYWNrJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hEdXJpbmcgPCBDT05TVEFOVFMuc3dpdGNoV2FpdGluZ0xvZ2luUGFnZXNJbnRlcnZhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2sgYmFjayBmb3IgYXZvaWQgc2Vzc2lvbiBleHBpcmVkJyk7XG4gICAgICAgICAga2V5Y29kZSgnQkFDSycsIDEwMCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2tleWNvZGUgYmFjaycpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgW1BBR0UuZmJMb2dJbjkwLCBQQUdFLmdvb2dsZUxvZ0luOTBdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogJ2tleWNvZGVCYWNrJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gKiogbWFpblxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm1haW4ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubWFpbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zdCB0YXNrID0gY29udGV4dC50YXNrLm5hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhc2spO1xuXG4gICAgICAgIHN3aXRjaCAodGFzaykge1xuICAgICAgICAgIGNhc2UgVEFTSy5zdGF5SW5Mb2dpbjpcbiAgICAgICAgICAgIC8vIHNob3VsZCBiZSBpbmFjY2Vzc2libGUgdW5sZXNzIGNsZWFyIHNlc3Npb24gaXMgZmFpbGVkXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICBjYXNlIFRBU0suc2V0dGluZ0RlZmF1bHQ6XG4gICAgICAgICAgY2FzZSBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLnNldHRpbmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLm1haW5CdG5zLmxlYWd1ZU1vZGUpO1xuICAgICAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UubWFpbkJ0bnMuYmF0dGxlTW9kZSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgVEFTSy5hZFJld2FyZDpcbiAgICAgICAgICAgIC8vIHNvbWV0aW1lcyB3b24ndCB0cmlnZ2VyIGFueXRoaW5nIGlmIHN0aWxsIG9uIGNkXG4gICAgICAgICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzID4gMikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWQgaXMgc3RpbGwgb24gY2QnKTtcbiAgICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UubWFpbkJ0bnMuYWRUYWIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBUQVNLLndlZWtseU1pc3Npb246XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UubWFpbkJ0bnMuYWNoaWV2ZW1lbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUub25Mb2dpblN1Y2Nlc3MoKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gKiogZ2FtZSBzZXR0aW5nXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2V0dGluZ3MubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2V0dGluZ3MsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc3QgaW5hY3RpdmVUYWJDb2xvciA9IHsgcjogNTgsIGc6IDY1LCBiOiA3NCB9O1xuICAgICAgICBjb25zdCB0YWIgPSBhcnJheUZpbmQoT2JqZWN0LmtleXMoUEFHRS5zZXR0aW5nc1RhYnMpLCB0ID0+IHtcbiAgICAgICAgICBjb25zdCB7IHgsIHkgfSA9IFBBR0Uuc2V0dGluZ3NUYWJzW3QgYXMga2V5b2YgdHlwZW9mIFBBR0Uuc2V0dGluZ3NUYWJzXTtcbiAgICAgICAgICByZXR1cm4gIWlzU2FtZUNvbG9yKGltYWdlLCB7IHgsIHksIC4uLmluYWN0aXZlVGFiQ29sb3IgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0suc2V0dGluZ0RlZmF1bHQ6XG4gICAgICAgICAgICBpZiAodGFiID09PSAnZ3JhcGhpY1RhYicpIHtcbiAgICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNldHRpbmdzR3JhcGhUYWJCdG5zLnBvd2VyU2F2ZU9uKTtcbiAgICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBnbyB0byBncmFwaGljVGFiXG4gICAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZXR0aW5nc1RhYnMuZ3JhcGhpY1RhYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFRBU0suc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3M6XG4gICAgICAgICAgICBpZiAoIXN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZ28gdG8gbGVhZ3VlUmVzZXREaWFsb2dcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZXR0aW5nc0J0bnMubGVhZ3VlUmVzZXQpO1xuICAgICAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0Uuc2V0dGluZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gKiogYWQgcmV3YXJkXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYWRSZXdhcmQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYWRSZXdhcmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKGNvbnRleHQgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0suYWRSZXdhcmQpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5hZFJld2FyZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3dhdGNoIGFkJyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmFkUmV3YXJkKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwRm9yQWQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYWRSZXdhcmRSZWRlZW0ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYWRSZXdhcmRSZWRlZW0sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkIHJld2FyZCBnZXQnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuYWRSZXdhcmRSZWRlZW0pO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSA9PT0gVEFTSy5hZFJld2FyZCkge1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hZFJld2FyZE9uQ0QubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYWRSZXdhcmRPbkNELFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhZCBpcyBzdGlsbCBjZCcpO1xuICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5hZFJld2FyZE9uQ0QpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSA9PT0gVEFTSy5hZFJld2FyZCkge1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vICoqIHdlZWtseSBtaXNzaW9uXG4gICAgd2Vla2x5TWlzc2lvbi5hZGRSb3V0ZXMoKTtcblxuICAgIC8vICoqIHBsYXlCYXR0bGVHYW1lXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYmF0dGxlTW9kZVBhbmVsLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmJhdHRsZU1vZGVQYW5lbCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5iYXR0bGVNb2RlUGFuZWwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBjaGVjayBpZiBwbGF5IG90aGVyIG1vZGUgdG9vXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5iYXR0bGVNb2RlUGFuZWxCdG5zLnJhbmtlZEJhdHRsZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwbGF5IHJhbmtlZCBiYXR0bGUnKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZVBhbmVsLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZVBhbmVsLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnJhbmtlZEJhdHRsZVBhbmVsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYW5ub3QgcGxheVxuICAgICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzID4gNSkge1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGlmIHBsYXkgaXMgYXZhaWxhYmxlXG4gICAgICAgIGNvbnN0IGlzUGxheURpc2FibGVkID0gaXNTYW1lQ29sb3IoaW1hZ2UsIFBBR0UucmFua2VkQmF0dGxlUGFuZWxCdG5zLmRpc2FibGVkUGxheUJ0bik7XG4gICAgICAgIGlmIChpc1BsYXlEaXNhYmxlZCkge1xuICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyYW5rZWQgYmF0dGxlIHBsYXkgZGlzYWJsZWQnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5yYW5rZWRCYXR0bGVQYW5lbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwbGF5IHJhbmtlZCBiYXR0bGUgKHNpbmdsZSknKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5yYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZVdhaXRUb1JlZnJlc2gsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgcmFuayBnYW1lIGRpc2FibGVkJyk7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UucmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mby5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZVJlc3VsdC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVSZXN1bHQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hdXRvR2FtZUNvbmZpcm0ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYXV0b0dhbWVDb25maXJtLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmF1dG9HYW1lQ29uZmlybSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmF1dG9HYW1lQ29uZmlybSk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hdXRvR2FtZUNvbmZpcm1FbmQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYXV0b0dhbWVDb25maXJtRW5kLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmF1dG9HYW1lQ29uZmlybUVuZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmF1dG9HYW1lQ29uZmlybUVuZCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mby5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVHYW1lSW5mbyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIFtQQUdFLnJlY2hhcmdlQmFsbFJhbmtNb2RlLCBQQUdFLnJlY2hhcmdlQmFsbExlYWd1ZU1vZGVdLmZvckVhY2gocCA9PlxuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY29udGludWU6IHJlY2hhcmdlIGJhbGwgbmVlZGVkJyk7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhwKTtcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyAqKiBwbGF5TGVhZ3VlTW9kZVxuICAgIC8vIGVudGVyIGdhbWUgaW5mb1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVQYW5lbC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVNb2RlUGFuZWwsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlTW9kZVBhbmVsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYW4gcGxheSBsZWFndWUgbW9kZVxuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMrKztcblxuICAgICAgICAvLyBhdm9pZCB0byBjbGljayBidG4gdG9vIG1hbnkgdGltZSBmb3IgdHJpZ2dlciBuZXh0IHBhZ2UgaW1tZWRpYXRlbHlcbiAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA8IDIpIHtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVNb2RlUGFuZWwpO1xuICAgICAgICB9XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVHYW1lSW5mby5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVNb2RlR2FtZUluZm8sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlTW9kZUdhbWVJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2sgZW5lcmd5Jyk7XG4gICAgICAgIGNvbnN0IGVtcHR5RW5lcmd5ID0geyB4OiA1NTEsIHk6IDI4MSwgcjogMywgZzogMTI0LCBiOiAyMTMgfTtcbiAgICAgICAgY29uc3QgaGFzRW5lcmd5MCA9IGlzU2FtZUNvbG9yKGltYWdlLCBlbXB0eUVuZXJneSwgMC45KTtcbiAgICAgICAgaWYgKGhhc0VuZXJneTApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZW5lcmd5Jyk7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlnaXQxID0geyB4OiA1NjEsIHk6IDI3OCwgcjogMTY5LCBnOiAxNzIsIGI6IDE3OSB9O1xuICAgICAgICBjb25zdCBoYXNFbmVyZ3kxMCA9IGlzU2FtZUNvbG9yKGltYWdlLCBkaWdpdDEpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGFzMTBFbmVyZ3k6JywgaGFzRW5lcmd5MTApO1xuXG4gICAgICAgIC8vIHVzZSBxdWljayBwbGF5IHdoZW4gaGFzIDEwKyBlbmVyZ3ksXG4gICAgICAgIC8vIGFuZCBzbG93IHBsYXkgd2hlbiBoYXMgMTAtIGVuZXJneVxuICAgICAgICBjb25zdCBxdWlja1BsYXlPbkJ0biA9IHsgeDogMzcsIHk6IDI4NCwgcjogMzMsIGc6IDI1NSwgYjogMTQwIH07XG4gICAgICAgIGNvbnN0IGlzUXVpY2tQbGF5T24gPSBpc1NhbWVDb2xvcihpbWFnZSwgcXVpY2tQbGF5T25CdG4pO1xuXG4gICAgICAgIGlmIChoYXNFbmVyZ3kxMCAmJiAhaXNRdWlja1BsYXlPbikge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAocXVpY2tQbGF5T25CdG4pOyAvLyBzZWxlY3QgcXVpY2sgcGxheVxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9uIHF1aWNrIHBsYXknKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc0VuZXJneTEwICYmIGlzUXVpY2tQbGF5T24pIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHF1aWNrUGxheU9uQnRuKTsgLy8gY2FuY2VsIHF1aWNrIHBsYXlcbiAgICAgICAgICBjb25zb2xlLmxvZygndHVybiBvZmYgcXVpY2sgcGxheScpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlTW9kZUdhbWVJbmZvKTsgLy8gcGxheSBiYWxsXG4gICAgICAgIGNvbnNvbGUubG9nKCdwbGF5IGxlYWd1ZSBtb2RlIGdhbWUnKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCB0aGluZ3NcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RQbGF5Um9sZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RQbGF5Um9sZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCBwbGF5IHJvbGUnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0UGxheVJvbGUpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0WWVhci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RZZWFyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IHllYXIgcGFnZScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3RZZWFyKTtcblxuICAgICAgICAvLyBnbyB0byB0aGUgbWluIHllYXJcbiAgICAgICAgY29uc3QgYWN0aXZlQnV0dG9uID0ge1xuICAgICAgICAgIHg6IFBBR0Uuc2VsZWN0WWVhckJ0bnMucHJldlllYXIueCxcbiAgICAgICAgICB5OiBQQUdFLnNlbGVjdFllYXJCdG5zLnByZXZZZWFyLnksXG4gICAgICAgICAgcjogNDksXG4gICAgICAgICAgZzogODUsXG4gICAgICAgICAgYjogMTIzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBpc05vdE1pblllYXIgPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3IoYWN0aXZlQnV0dG9uKTtcbiAgICAgICAgZm9yIChsZXQgcmVtYWluQ2xpY2sgPSAxMjsgcmVtYWluQ2xpY2sgPiAwICYmIGlzTm90TWluWWVhcjsgcmVtYWluQ2xpY2stLSkge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RZZWFyQnRucy5wcmV2WWVhcik7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgIGlzTm90TWluWWVhciA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihhY3RpdmVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdGhlIGRpZmYsIHJldHVybiB0byBwcmV2IHllYXJcbiAgICAgICAgZm9yICh2YXIgeWVhckRpZmYgPSBDb25maWcuY29uZmlnLmxlYWd1ZVllYXIgLSBDT05TVEFOVFMubGVhZ3VlWWVhck1pbjsgeWVhckRpZmYgPiAwOyB5ZWFyRGlmZi0tKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdFllYXJCdG5zLm5leHRZZWFyKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdWJtaXQgY2hhbmdlc1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0WWVhckJ0bnMuc3VibWl0KTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0U2Vhc29uTW9kZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RTZWFzb25Nb2RlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IHNlYXNvbiBwYWdlJyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdFNlYXNvbk1vZGUpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY4LCB5OiAzMzMgfSk7IC8vIG5vcm1hbCBtb2RlXG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgLy8gVE9ETyBzcGxpdCBwYWdlXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAzMzIsIHk6IDMwMSB9KTsgLy8gbmV4dCBzZWFzb25cbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RMZWFndWVHYW1lQW1vdW50Lm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3QgbGVhZ3VlIGdhbWUgYW1vdW50IHBhZ2UnKTtcbiAgICAgICAgLy8gdXNlIGNvbmZpZyB1c2VyIHNldHRlZCB0byBzZWxlY3Qgd2hpY2ggdGhleSB3YW50IHRvIHBsYXlcbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBoYWxmLCBxdWFydGVyLCBmdWxsIGhhcyAyIG5leHQgcGFnZVxuICAgICAgICBzd2l0Y2ggKENvbmZpZy5jb25maWcubGVhZ3VlU2Vhc29uTW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2Z1bGwnOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCBmdWxsIGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLmZ1bGwpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdoYWxmJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgMS8yIGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLmhhbGYpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICAvLyA/IHdpbGwgZ28gdG8gb2sgLyBuZXh0IHBhZ2VzXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgMS80IGxlYWd1ZScpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLnF1YXJ0ZXIpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgICAgICAvLyA/IHdpbGwgZ28gdG8gb2sgLyBuZXh0IHBhZ2VzXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwb3N0U2Vhc29uJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgcG9zdFNlYXNvbicpO1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zLnBvc3QpO1xuICAgICAgICAgICAgLy8gPyB3aWxsIGdvIHRvIG9rIC8gbmV4dCBwYWdlc1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDU2NCwgeTogMzI4IH0pOyAvLyBnbyBuZXh0XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBzZWFzb24gbmV3LyBlbmRcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5uZXdTZWFzb24ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubmV3U2Vhc29uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZW5kU2Vhc29uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmVuZFNlYXNvbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmVuZFNlYXNvblByb2NlZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZW5kU2Vhc29uUHJvY2VlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIGVuZCBzZWFzb24gcHJvY2VlZCcpO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMTgyLCB5OiAxNzggfSk7IC8vIHRhcCBuZXcgc2Vhc29uIG9mIGxlZnRcbiAgICAgICAgLy8gd2lsbCBnbyB0byBlbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWRcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmVuZFNlYXNvblByb2NlZWRTZWxlY3RlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5lbmRTZWFzb25Qcm9jZWVkU2VsZWN0ZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3Qgbm9ybWFsIC8gbWFzdGVyIG1vZGUnKTtcblxuICAgICAgICAvLyBpZiBjYW5ub3Qgc2VsZWN0IG1hc3RlciBtb2RlLCBhdCBsZWFzdCBzZWxlY3Qgbm9ybWFsIG1vZGVcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVCdG5zLm5vcm1hbCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVCdG5zLm1hc3Rlcik7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgLy8gd2hldGhlciBjaG9vc2UgYW55IG1vZGUsIHdpbGwganVtcCB0byBwcm9jZWVkIHBhZ2VcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZSk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmVzZXREaWFsb2dZTixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHJlc2V0IGxlYWd1ZSBkaWFsb2cgd2l0aCB5ZXMvbm8nKTtcblxuICAgICAgICAvLyBUT0RPOiBsZXQgdXNlciBjaG9vc2UgaW4gY29uZmlnXG4gICAgICAgIGlmIChjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCA9PT0gYC8ke1BBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQubmFtZX1gKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Jlc2V0IGxlYWd1ZSBtb2RlJyk7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlUmVzZXREaWFsb2dZTik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90IHJlc2V0XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nWU4pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXNldERpYWxvZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVSZXNldERpYWxvZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0suc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAvLyBjYW5jZWxcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVSZXNldERpYWxvZyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgcmVzZXQgbGVhZ3VlIGRpYWxvZycpO1xuICAgICAgICAvLyBUT0RPOiBsZXQgdXNlciBjYW4gc2VsZWN0IHNwZWNpZmljIG1vZGUgYW5kIHllYXIgdG8gcGxheVxuICAgICAgICAvLyByZXNldFxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVSZXNldERpYWxvZyk7XG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvcixcbiAgICAgIGFjdGlvbjogKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGNvbnRleHQudGFzay5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgaWYgKCFDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc29tZXRpbWVzIHNvbWUgdW5rbm93biByZWFzb24gY2Fubm90IGVudGVyIGdhbWVcbiAgICAgICAgICAgIGNvbnN0IHsgdHJ5RW50ZXJHYW1lQ250cyB9ID0gc3RhdGUubGVhZ3VlR2FtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cnkgZW50ZXIgZ2FtZSBjbnRzJywgdHJ5RW50ZXJHYW1lQ250cyk7XG4gICAgICAgICAgICBpZiAodHJ5RW50ZXJHYW1lQ250cyA9PT0gMykge1xuICAgICAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ5RW50ZXJHYW1lQ250cyA+IDMpIHtcbiAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgcmVzb2x2ZWQgYnkgcmVzZXR0aW5nIGxlYWd1ZSBtb2RlIHByb2dyZXNzXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGVSZXNldExlYWd1ZU1vZGVQcm9ncmVzcycpO1xuXG4gICAgICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIG90aGVyXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZUxpbmVVcC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lTGluZVVwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucGxheWVyR3Jvd3RoQ29tcGxldGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucGxheWVyR3Jvd3RoQ29tcGxldGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5waXRjaGVyT2ZUaGVNb250aC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5waXRjaGVyT2ZUaGVNb250aCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm12cC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5tdnAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZU12cFBhZ2UnKTtcbiAgICAgICAgY29uc3Qgb2tCdG4gPSB7IHg6IDU2OCwgeTogMzIwLCByOiA1MiwgZzogMTIwLCBiOiAyMTAgfTtcbiAgICAgICAgbGV0IGlzT2tCdG5PblNjcmVlbiA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihva0J0bik7XG5cbiAgICAgICAgLy8gb2sgYnV0dG9uIHN0aWxsIG9uIHRoZSBzY3JlZW5cbiAgICAgICAgZm9yICh2YXIgbWF4T2tCdXR0b25SZW1haW4gPSAxMDsgaXNPa0J0bk9uU2NyZWVuICYmIG1heE9rQnV0dG9uUmVtYWluID4gMDsgbWF4T2tCdXR0b25SZW1haW4tLSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLm12cCk7IC8vIG9rXG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgICBpc09rQnRuT25TY3JlZW4gPSByZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3Iob2tCdG4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV3YXJkIGJvbnVzIHBsYXllciBwb3B1cFxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMzIyLCB5OiAzMDkgfSk7IC8vIGNsaWNrIG5leHRcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gZ2FtZSBvdmVyXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0LFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbXBsZXRlIGEgZ2FtZScpO1xuICAgICAgICAgICAgZmluaXNoUm91bmQoKTtcbiAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmdhbWVSZXN1bHQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdEFxdWlyZWQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJlc3VsdEFxdWlyZWQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmVzdWx0V29ybGRDaGFtcGlvbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0V29ybGRDaGFtcGlvbixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXN1bHRPdGhlci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0T3RoZXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXAnKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gZ2FtZSByZXdhcmQgcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmV3YXJkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXdhcmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlQm9udXNQbGF5ZXIubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYmVzdFBvc2l0aW9uQXdhcmRCb251c0dyb3VwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmJlc3RQb3NpdGlvbkF3YXJkQm9udXNHcm91cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmJvbnVzR3JhbnRlZEJ5VGVhbVJlY29yZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5ib251c0dyYW50ZWRCeVRlYW1SZWNvcmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5wb3N0U2Vhc29uQXdhcmRCb251cy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5wb3N0U2Vhc29uQXdhcmRCb251cyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdFJld2FyZFBsYXllci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZVNlbGVjdFJld2FyZFBsYXllcicpO1xuICAgICAgICBsZXQgYmVzdENhcmRSYW5rID0gLTE7XG4gICAgICAgIGxldCBiZXN0Q2FyZFBvcyA9IFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyQnRuc1swXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBvcyBvZiBQQUdFLnNlbGVjdFJld2FyZFBsYXllckJ0bnMpIHtcbiAgICAgICAgICBjb25zdCByZ2IgPSBnZXRJbWFnZUNvbG9yKGltYWdlLCBwb3MueCwgcG9zLnkpO1xuICAgICAgICAgIGNvbnN0IGsgPSByZ2IuciArICctJyArIHJnYi5nICsgJy0nICsgcmdiLmI7XG4gICAgICAgICAgY29uc29sZS5sb2cocG9zLngsIHBvcy55LCBrKTtcbiAgICAgICAgICAvLyBzZWxlY3QgaWYgbm90IGluIGJhc2ljIHR5cGVcbiAgICAgICAgICBjb25zdCByYW5rID0gUEFHRS5wbGF5ZXJDYXJkQ29sb3JUb1Jhbmtba10gPz8gNTtcbiAgICAgICAgICBpZiAocmFuayA+IGJlc3RDYXJkUmFuaykge1xuICAgICAgICAgICAgYmVzdENhcmRSYW5rID0gcmFuaztcbiAgICAgICAgICAgIGJlc3RDYXJkUG9zID0gcG9zO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoYmVzdENhcmRQb3MpO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0JywgYmVzdENhcmRQb3MueCwgYmVzdENhcmRQb3MueSk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gb24gcGxheSBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUXVpY2tQbGF5R3JvdXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uub25RdWlja1BsYXlHcm91cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnb24gcXVpY2sgcGxheWluZycpO1xuXG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSA9PT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIHN1Y2Nlc3MgZW50ZXIgZ2FtZVxuICAgICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUub25SdW5uaW5nKHRydWUpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5vblF1aWNrUGxheUdyb3VwKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUXVpY2tQbGF5UGF1c2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uub25RdWlja1BsYXlQYXVzZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm9uUGxheVBvd2VyU2F2ZU9uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm9uUGxheVBvd2VyU2F2ZU9uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIC8vIHRoaXMgaXMgc2hhcmUgYmV0d2VlbiBhbGwgbW9kZVxuICAgICAgICBsZXQgaXNPblBsYXlUYXNrID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUJhdHRsZUdhbWU6XG4gICAgICAgICAgY2FzZSBUQVNLLnBsYXlMZWFndWVHYW1lOlxuICAgICAgICAgICAgaXNPblBsYXlUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSB8fCAhaXNPblBsYXlUYXNrIHx8IHJlcm91dGVyLmlzUGFnZU1hdGNoKFBBR0UucG93ZXJTYXZpbmcpKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVQb3dlclNhdmluZ1BhZ2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCB7IGxhc3RDaGVja1Bvd2VyU2F2ZUF0OiBsYXN0Q2hlY2tUaW1lQXQsIHBvd2VyU2F2ZUNvbG9yQ291bnQ6IGNvbG9yQ291bnQgfSA9IHN0YXRlLmxlYWd1ZUdhbWU7XG4gICAgICAgIGlmIChub3cgLSBsYXN0Q2hlY2tUaW1lQXQgPCBDT05TVEFOVFMuc2VuZFJ1bm5pbmdFdmVudEludGVydmFsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXNlIHRpbWUgdG8gY2hlY2sgd2hldGhlciBnYW1lIGlzIHN0aWxsIHBsYXlpbmdcbiAgICAgICAgY29uc3QgY29sb3JDbnROb3cgPSBnZXRDb2xvckNvdW50SW5SYW5nZShpbWFnZSwgeyB4OiAzMzEsIHk6IDMxMCB9LCB7IHg6IDQwMywgeTogMzExIH0pO1xuICAgICAgICBjb25zdCBpc1NhbWUgPSBpc1NhbWVDb2xvckNvdW50KGNvbG9yQ250Tm93LCBjb2xvckNvdW50KTtcblxuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLmxhc3RDaGVja1Bvd2VyU2F2ZUF0ID0gbm93O1xuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnBvd2VyU2F2ZUNvbG9yQ291bnQgPSBjb2xvckNudE5vdztcblxuICAgICAgICBpZiAoIWlzU2FtZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGlzIHN0aWxsIHBsYXlpbmcgd2l0aCBwb3dlciBzYXZlIG9uJyk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2dhbWUgaXMgc3R1Y2snKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3Vwcy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZHcm91cHMsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgLy8gcGFnZSB3aWxsIGJlIHN0b3BwZWQgaGVyZSBpbiBhbnkgdGFza3NcbiAgICAgICAgLy8gbmVlZCB0byBoYW5kbGUgaW1tZWRpYXRlbHkgaWYgbWF0Y2hcbiAgICAgICAgZm9yIChjb25zdCBwYWdlT3JHcm91cCBvZiBtYXRjaGVkKSB7XG4gICAgICAgICAgaWYgKHBhZ2VPckdyb3VwLm5hbWUgPT09IFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmU3RvcHBlZC5uYW1lKSB7XG4gICAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIHR1cm4gb2ZmIGF1dG9wbGF5IHRvIHJldHVyblxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZik7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdWNjZXNzIGVudGVyIGdhbWVcbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzID0gMDtcblxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgcXVpY2sgc3dpdGNoIHRvIGF1dG8gcGxheSBvZmYgaWYgd2FzIHN0b3BwZWRcbiAgICAgICAgaWYgKENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygndHVybiBvbiBwb3dlciBzYXZlIHBsYXknKTtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmYpO1xuICAgICAgICB9XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFwJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5TGVhZ3VlR2FtZSkge1xuICAgICAgICAgIC8vIG9wZW4gcGF1c2UgcGFuZWxcbiAgICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICAgIC8vIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9uIGF1dG8gcGxheScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXApO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlT25QbGF5UGF1c2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlT25QbGF5UGF1c2UsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgLy8gb3BlbiBwYXVzZSBwYW5lbFxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZU9uUGxheVBhdXNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29udGludWUgcGxheVxuICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICBjb25zb2xlLmxvZygndGFwIGJhY2sgdG8gc3RheSBpbiBnYW1lJyk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVDb250aW51ZVBsYXlpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlQ29udGludWVQbGF5aW5nLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG5cbiAgICAvLyAqKiBnZW5lcmFsIHBhZ2VzXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucG93ZXJTYXZpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucG93ZXJTYXZpbmcsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb3dlclNhdmluZ1BhZ2UoKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIFtQQUdFLmVycm9yTmV3VXBkYXRlQXZhaWxhYmxlLCBQQUdFLmFwcElzTm90UmVzcG9uZGluZ10uZm9yRWFjaChwID0+IHtcbiAgICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgICAgcGF0aDogYC8ke3AubmFtZX1gLFxuICAgICAgICBtYXRjaDogcCxcbiAgICAgICAgYWN0aW9uOiAnZ29OZXh0JyxcbiAgICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwV2FpdFBhZ2VMb25nLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBbXG4gICAgICBQQUdFLnVuZXhwZWN0ZWRFcnJvcixcbiAgICAgIFBBR0UucmV2aWV3QXBwLFxuICAgICAgUEFHRS5wcm9tb3Rpb24xLFxuICAgICAgUEFHRS5wcm9tb3Rpb24yLFxuICAgICAgUEFHRS5wcm9tb3Rpb24zLFxuICAgICAgUEFHRS5yZWNoYXJnZVByb21vdGlvbixcbiAgICAgIFBBR0UudGVhbVN1cHBvcnRQYWNrYWdlUHJvbW90aW9uLFxuICAgICAgUEFHRS5lbnRlckdhbWVQcm9tb3Rpb24sXG4gICAgICBQQUdFLmV2ZW50LFxuICAgICAgUEFHRS5vayxcbiAgICAgIFBBR0UubmV4dCxcbiAgICAgIFBBR0UuY29uZmlybVdpdGhZUyxcbiAgICAgIFBBR0UucXVpdEFwcCxcbiAgICAgIFBBR0UucXVpdEFwcDEsXG4gICAgXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVVua25vd24oKSB7XG4gICAgcmVyb3V0ZXIuYWRkVW5rbm93bkFjdGlvbigoY29udGV4dCwgaW1hZ2UsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAvLyByZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpO1xuICAgICAgVXRpbHMubG9nKGB1bmtub3duIGNvdW50ICR7Y29udGV4dC5tYXRjaFRpbWVzfSwgZHVyaW5nICR7Y29udGV4dC5tYXRjaER1cmluZ30sIGxhc3QgbWF0Y2hlZDogJHtjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aH1gKTtcbiAgICAgIGNvbnN0IGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gICAgICBpZiAoIWlzSW5BcHApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25vdCBpbiBhcHAnKTtcbiAgICAgICAgaWYgKENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGNvbnRleHQubGFzdE1hdGNoZWRQYXRoLnN1YnN0cmluZygxKSkge1xuICAgICAgICBjYXNlIFBBR0UuYWRSZXdhcmQubmFtZTpcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDbG9zZUFkKCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUuaXNXYWl0aW5nTG9naW4pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3dhaXQgdXNlciBpbnB1dCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgY29uc29sZS5sb2coJ3RhcCcpO1xuXG4gICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzICUgMTEgPT09IDApIHtcbiAgICAgICAga2V5Y29kZSgnS0VZQ09ERV9CQUNLJywgMTAwKTtcbiAgICAgICAgVXRpbHMubG9nKCdrZXljb2RlIGJhY2sgZm9yIHVua25vd24nKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nID4gQ09OU1RBTlRTLm1pbnV0ZUluTXMgKiAzMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3R1Y2sgaW4gdW5rbm93biBwYWdlIG1vcmUgdGhhbiAzMCBtaW4nKTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSAmJiByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQ2xvc2VBZCgpIHtcbiAgICBjb25zb2xlLmxvZygndHJ5IGNsb3NlIGFkJyk7XG4gICAga2V5Y29kZSgnQkFDSycsIDEwMCk7XG4gICAgY29uc29sZS5sb2coJ2tleSBjb2RlIGJhY2snKTtcbiAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgIGlmIChyZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRyeSB0YXAgY2xvc2UgYnRuXG4gICAgZm9yIChjb25zdCBjbG9zZUJ0biBvZiBbXG4gICAgICAvLyByaWdodFxuICAgICAgeyB4OiA2MjIsIHk6IDE5IH0sXG5cbiAgICAgIC8vIGxlZnRcbiAgICAgIHsgeDogOCwgeTogMTUgfSxcbiAgICBdKSB7XG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKGNsb3NlQnRuKTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGhhbmRsZVBvd2VyU2F2aW5nUGFnZSgpIHtcbiAgICBjb25zb2xlLmxvZygnaGFuZGxlUG93ZXJTYXZpbmdQYWdlJyk7XG4gICAgcmVyb3V0ZXIuc2NyZWVuLnRhcERvd24oeyB4OiAxMDAsIHk6IDE4MCB9KTtcbiAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgIHJlcm91dGVyLnNjcmVlbi5tb3ZlVG8oeyB4OiA1MDAsIHk6IDE4MCB9KTtcbiAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgIHJlcm91dGVyLnNjcmVlbi50YXBVcCh7IHg6IDUwMCwgeTogMTgwIH0pO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gIH1cblxuICBwdWJsaWMgd3JhcFJvdXRlQWN0aW9uKGFjdGlvbjogUm91dGVDb25maWdbJ2FjdGlvbiddKTogUm91dGVDb25maWdbJ2FjdGlvbiddIHtcbiAgICBpZiAoIUNvbmZpZy5jb25maWcuaXNDbG91ZCkge1xuICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3dyYXBSb3V0ZUFjdGlvbicsIGNvbnRleHQudGFzay5uYW1lLCBtYXRjaGVkWzBdLm5hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYWN0aW9uKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCk7XG4gICAgICB9XG4gICAgICBpZiAoYWN0aW9uID09PSAnZ29OZXh0Jykge1xuICAgICAgICByZXJvdXRlci5nb05leHQobWF0Y2hlZFswXSk7XG4gICAgICB9XG4gICAgICBpZiAoYWN0aW9uID09PSAnZ29CYWNrJykge1xuICAgICAgICByZXJvdXRlci5nb0JhY2sobWF0Y2hlZFswXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwbG9hZCBzZXNzaW9uIGlmIG5lZWRlZFxuICAgICAgc3RhdGUuY2hlY2tVcGxvYWRTZXNzaW9uKCk7XG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NyaXB0Q29uZmlnIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbGVhZ3VlWWVhck1pbiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCBjb25maWc6IFNjcmlwdENvbmZpZyA9IHtcbiAgbGVhZ3VlU2Vhc29uTW9kZTogJ2Z1bGwnLFxuICBsZWFndWVZZWFyOiBsZWFndWVZZWFyTWluLFxuICBpc1J1bkFkUmV3YXJkOiB0cnVlLFxuICBpc1J1blBsYXlCYXR0bGVHYW1lOiB0cnVlLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldChqc29uQ29uZmlnOiBhbnkpIHtcbiAgaWYgKHR5cGVvZiBqc29uQ29uZmlnICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGMgPSBKU09OLnBhcnNlKGpzb25Db25maWcpO1xuICBjb25maWcubGVhZ3VlU2Vhc29uTW9kZSA9IGMubGVhZ3VlU2Vhc29uTW9kZSA/PyBjb25maWcubGVhZ3VlU2Vhc29uTW9kZTtcbiAgY29uZmlnLmxlYWd1ZVllYXIgPSBjLmxlYWd1ZVllYXIgPz8gY29uZmlnLmxlYWd1ZVllYXI7XG5cbiAgY29uZmlnLnhyb2JvdG1vblMzS2V5ID0gYy54cm9ib3Rtb25TM0tleSA/PyBjb25maWcueHJvYm90bW9uUzNLZXk7XG4gIGNvbmZpZy54cm9ib3Rtb25TM1Rva2VuID0gYy54cm9ib3Rtb25TM1Rva2VuID8/IGNvbmZpZy54cm9ib3Rtb25TM1Rva2VuO1xuICBjb25maWcuYW1hem9uYXdzUzNLZXkgPSBjLmFtYXpvbmF3c1MzS2V5ID8/IGNvbmZpZy5hbWF6b25hd3NTM0tleTtcbiAgY29uZmlnLmFtYXpvbmF3c1MzVG9rZW4gPSBjLmFtYXpvbmF3c1MzVG9rZW4gPz8gY29uZmlnLmFtYXpvbmF3c1MzVG9rZW47XG4gIGNvbmZpZy5saWNlbnNlSWQgPSBjLmxpY2Vuc2VJZCA/PyBjb25maWcubGljZW5zZUlkO1xuXG4gIGNvbmZpZy5pc0Nsb3VkID0gYy5pc0Nsb3VkID8/IHRydWU7XG4gIGNvbmZpZy5pc0xvY2FsUGFpZCA9IGMuaXNMb2NhbFBhaWQgPz8gZmFsc2U7XG4gIGNvbmZpZy5oYXNDb29sRmVhdHVyZSA9IGNvbmZpZy5pc0Nsb3VkIHx8IGNvbmZpZy5pc0xvY2FsUGFpZCB8fCBjLmlzRGV2IHx8IGZhbHNlO1xuXG4gIGNvbmZpZy5pc1J1bkFkUmV3YXJkID0gY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIChjLmlzUnVuQWRSZXdhcmQgPz8gY29uZmlnLmlzUnVuQWRSZXdhcmQpO1xuICBjb25maWcuaXNSdW5QbGF5QmF0dGxlR2FtZSA9IGNvbmZpZy5oYXNDb29sRmVhdHVyZSAmJiAoYy5pc1J1blBsYXlCYXR0bGVHYW1lID8/IGNvbmZpZy5pc1J1blBsYXlCYXR0bGVHYW1lKTtcbn1cbiIsImltcG9ydCB7IFV0aWxzIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmxldCBsYXN0UnVubmluZ0V2ZW50OiBudW1iZXIgPSAwO1xubGV0IGxhc3RTZW5kR2FtZVN0YXR1c0V2ZW50QXQ6IG51bWJlciA9IDA7XG5sZXQgY250ID0gMDtcbmVudW0gRXZlbnROYW1lIHtcbiAgUlVOTklORyA9ICdydW5uaW5nJyxcbiAgR0FNRV9TVEFUVVMgPSAnZ2FtZVN0YXR1cycsXG59XG5lbnVtIEdhbWVTdGF0dXNDb250ZW50IHtcbiAgV0FJVF9GT1JfTE9HSU5fSU5QVVQgPSAnd2FpdC1mb3ItaW5wdXQnLFxuICBMT0dJTl9TVUNDRUVERUQgPSAnbG9naW4tc3VjY2VlZGVkJyxcbiAgTEFVTkNISU5HID0gJ2xhdW5jaGluZycsXG4gIFBMQVlJTkcgPSAncGxheWluZycsXG59XG5jb25zdCBwcmVmaXggPSAnW0V2ZW50XSc7XG5cbmV4cG9ydCBsZXQgbGFzdEdhbWVTdGF0dXNFdmVudDogc3RyaW5nID0gJyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpbklucHV0aW5nKCkge1xuICBjbnQrKztcbiAgY29uc29sZS5sb2coYGxvZ2luSW5wdXRpbmc6ICR7Y250fWApO1xuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuV0FJVF9GT1JfTE9HSU5fSU5QVVQ7XG4gIHJldHVybiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5TdWNjZXNzKCkge1xuICBpZiAobGFzdEdhbWVTdGF0dXNFdmVudCAhPT0gR2FtZVN0YXR1c0NvbnRlbnQuV0FJVF9GT1JfTE9HSU5fSU5QVVQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgY29udGVudCA9IEdhbWVTdGF0dXNDb250ZW50LkxPR0lOX1NVQ0NFRURFRDtcbiAgcmV0dXJuIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hpbmcoKSB7XG4gIC8vIHNldCB0byBkZWZhdWx0IG9uY2UgYXBwIGlzIGxhdW5jaGVkIChmaXJzdCBhbmQgYWdhaW4pXG4gIGxhc3RSdW5uaW5nRXZlbnQgPSAwO1xuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuTEFVTkNISU5HO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXlpbmcoKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSBHYW1lU3RhdHVzQ29udGVudC5QTEFZSU5HO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bm5pbmcodXNlSW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSkge1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBpZiAodXNlSW50ZXJ2YWwgJiYgbm93IC0gbGFzdFJ1bm5pbmdFdmVudCA8IENPTlNUQU5UUy5zZW5kUnVubmluZ0V2ZW50SW50ZXJ2YWwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGFzdFJ1bm5pbmdFdmVudCA9IG5vdztcbiAgc2VuZEV2ZW50KEV2ZW50TmFtZS5SVU5OSU5HLCAnJyk7XG4gIGNvbnNvbGUubG9nKGAke3ByZWZpeH0gcnVubmluZ2ApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAobGFzdEdhbWVTdGF0dXNFdmVudCA9PT0gY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHNsZWVwIGZvciBzZW5kIDErIGV2ZW50cyBpbiBhIHNob3J0IHRpbWVcbiAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBsYXN0U2VuZEdhbWVTdGF0dXNFdmVudEF0O1xuICBpZiAoZGlmZiA8IENPTlNUQU5UUy5zbGVlcE1lZGl1bSkge1xuICAgIFV0aWxzLnNsZWVwKGRpZmYpO1xuICB9XG5cbiAgbGFzdEdhbWVTdGF0dXNFdmVudCA9IGNvbnRlbnQ7XG4gIHNlbmRFdmVudChFdmVudE5hbWUuR0FNRV9TVEFUVVMsIGNvbnRlbnQpO1xuICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9ICR7Y29udGVudH1gKTtcbiAgbGFzdFNlbmRHYW1lU3RhdHVzRXZlbnRBdCA9IERhdGUubm93KCk7XG4gIHJldHVybiB0cnVlO1xufVxuIiwiZXhwb3J0IHsgcmVyb3V0ZXIgfSBmcm9tICcuL3Jlcm91dGVyJztcbmV4cG9ydCAqIGFzIENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5leHBvcnQgKiBhcyBzdGF0ZSBmcm9tICcuL3N0YXRlJztcbiIsImltcG9ydCB7IHJlcm91dGVyIGFzIHIgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuci5kZWZhdWx0Q29uZmlnLlRhc2tDb25maWdBdXRvU3RvcCA9IHRydWU7XG5yLmRlZmF1bHRDb25maWcuUm91dGVDb25maWdEZWJ1ZyA9IGZhbHNlO1xuXG4vLyBpZiBub3Qgc2V0IHBhY2thZ2VOYW1lIGZpcnN0LCBjYW5ub3QgaGFuZGxlIHN0YXJ0LyBzdG9wIGFwcFxuci5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSA9IENPTlNUQU5UUy5wYWNrYWdlTmFtZTtcbnIucmVyb3V0ZXJDb25maWcuc3RhcnRBcHBEZWxheSA9IDEwICogMTAwMDtcblxuci5zY3JlZW5Db25maWcucm90YXRpb24gPSAnaG9yaXpvbnRhbCc7XG5yLnNjcmVlbkNvbmZpZy5kZXZIZWlnaHQgPSAzNjA7XG5yLnNjcmVlbkNvbmZpZy5kZXZXaWR0aCA9IDY0MDtcblxuci5kZWJ1ZyA9IHRydWU7XG5leHBvcnQgbGV0IHJlcm91dGVyID0gcjtcbiIsImltcG9ydCB7IGRlZmF1bHQgYXMgTUQ1IH0gZnJvbSAnbWQ1JztcbmltcG9ydCB7IGV4ZWN1dGVDb21tYW5kcyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHJlcm91dGVyIH0gZnJvbSAnLi9yZXJvdXRlcic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLy8gYXBwIG9yaWdpbiBpbmZvXG5jb25zdCBhcHBTZXNzaW9uUm9vdCA9IGBkYXRhL2RhdGEvJHtDT05TVEFOVFMucGFja2FnZU5hbWV9YDtcbmNvbnN0IGFwcFJlY29yZFJvb3QgPSBgL3NkY2FyZC9BbmRyb2lkL2RhdGEvJHtDT05TVEFOVFMucGFja2FnZU5hbWV9L2ZpbGVzYDtcblxuLy8gY2FjaGUgaW5mb1xuY29uc3QgbGljZW5zZUZpbGVQYXRoOiBzdHJpbmcgPSAnL3NkY2FyZC9Sb2JvdG1vbi9saWNlbnNlLnR4dCc7XG5jb25zdCBzY3JpcHRDYWNoZVJvb3QgPSAnL3NkY2FyZC9Sb2JvdG1vbi9sb2dpbkNhY2hlJztcbmNvbnN0IGFuZHJvaWRJZEZpbGVQYXRoID0gYCR7c2NyaXB0Q2FjaGVSb290fS9hbmRyb2lkX2lkLnR4dGA7XG5jb25zdCBnYW1lUmVjb3JkQ2FjaGVSb290ID0gYCR7c2NyaXB0Q2FjaGVSb290fS9nYW1lUmVjb3JkYDtcblxuLy8gY2xvdWQgaW5mb1xuY29uc3QgZW5kcG9pbnQgPSAnczMucm9ib3Rtb24uYXBwOjkwMDAnO1xuY29uc3QgYnVja2V0ID0gJ21sYi1yZWNvcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNlc3Npb24oKSB7XG4gIGlmICghY29uZmlnLmlzQ2xvdWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHsgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcbiAgY29uc3QgbGFzdExpY2Vuc2VJZCA9IHJlYWRGaWxlKGxpY2Vuc2VGaWxlUGF0aCkgfHwgJyc7XG4gIHdyaXRlRmlsZShsaWNlbnNlRmlsZVBhdGgsIGxpY2Vuc2VJZCk7XG4gIGNvbnNvbGUubG9nKGBsYXN0TGljZW5zZUlkOiAke2xhc3RMaWNlbnNlSWR9LCBjdXJyZW50TGljZW5zZUlkOiAke2xpY2Vuc2VJZH1gKTtcblxuICAvLyBhY3Rpb25zIGJhc2VkIG9uIGxhc3QgYW5kIGN1cnJlbnQgbGljZW5zZUlkXG4gIHN3aXRjaCAobGljZW5zZUlkKSB7XG4gICAgLy8gZW1wdHkgbGljZW5zZUlkXG4gICAgY2FzZSAnJzpcbiAgICAgIGxvZ091dCgpO1xuICAgICAgc2xlZXAoMzAwMCk7XG4gICAgICBicmVhaztcblxuICAgIC8vIGhhcyBsaWNlbnNlSWRcbiAgICBkZWZhdWx0OlxuICAgICAgc3dpdGNoIChsYXN0TGljZW5zZUlkKSB7XG4gICAgICAgIC8vIGVtcHR5IGxhc3RMaWNlbnNlSWRcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyBzYW1lIGxpY2Vuc2VJZFxuICAgICAgICBjYXNlIGxpY2Vuc2VJZDpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyBkaWZmZXJlbnQgbGljZW5zZUlkXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbG9nT3V0KCk7XG4gICAgICAgICAgc2xlZXAoMzAwMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGhhc0Nsb3VkU2Vzc2lvbiA9IGZldGNoU2Vzc2lvbigpO1xuICAgICAgaWYgKGhhc0Nsb3VkU2Vzc2lvbikge1xuICAgICAgICBsb2dJbigpO1xuICAgICAgICBzbGVlcCgzMDAwKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gcmVzdGFydCBhcHAgaWYgbmVlZGVkXG4gIGxldCBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB3aGlsZSAoIWlzSW5BcHApIHtcbiAgICByZXJvdXRlci5zdGFydEFwcCgpO1xuICAgIHNsZWVwKDMwMDApO1xuICAgIGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIH1cbiAgc2xlZXAoMzAwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmRTZXNzaW9uKCkge1xuICBpZiAoIWNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB7IGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGlmIChsaWNlbnNlSWQpIHtcbiAgICBsb2dPdXQoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBjb25zb2xlLmxvZygnPT09PSBzdG9wIHNjcmlwdDogaGFzIGxpY2Vuc2VJZDsgY2xvc2UgYXBwIGFuZCBjbGVhciBzZXNzaW9uJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJz09PT0gc3RvcCBzY3JpcHQ6IG5vIGxpY2Vuc2VJZDsgbm90IHRvIGNsb3NlIGFwcCBmb3IgbGV0IG5ldyB1c2VyIGxvZ2luJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZFNlc3Npb24oKSB7XG4gIGlmICghY29uZmlnLmlzQ2xvdWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHsgeHJvYm90bW9uUzNLZXksIHhyb2JvdG1vblMzVG9rZW4sIGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG5cbiAgaWYgKCEoeHJvYm90bW9uUzNLZXkgJiYgeHJvYm90bW9uUzNUb2tlbiAmJiBsaWNlbnNlSWQpKSB7XG4gICAgY29uc29sZS5sb2coJ2ZhaWxlZCB1cGxvYWQ7IHJlcXVpcmVkIGtleSBpcyBlbXB0eScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGB1cGxvYWQgc2Vzc2lvbiAke2xpY2Vuc2VJZH0gc3RhcnRgKTtcbiAgZXhlY3V0ZUNvbW1hbmRzKFxuICAgIC8vIHJlbW92ZSB0bXAgZmlsZSByb290XG4gICAgYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH1gLFxuICAgIGBybSAtZiAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLFxuXG4gICAgLy8gY29weSBsb2NhbCBzZXNzaW9uIHRvIHRtcCBmaWxlIHJvb3RcbiAgICBgbWtkaXIgLXAgJHtzY3JpcHRDYWNoZVJvb3R9L2AsXG4gICAgYGNwIC1yICR7YXBwU2Vzc2lvblJvb3R9L2ZpbGVzICR7c2NyaXB0Q2FjaGVSb290fS9gLFxuICAgIGBjcCAtciAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnMgJHtzY3JpcHRDYWNoZVJvb3R9L2BcbiAgKTtcbiAgY29weUdhbWVSZWNvcmRUb0NhY2hlKCk7XG5cbiAgLy8gY29weSBjdXJyZW50IGFuZHJvaWQgaWQgdG8gdG1wIGZpbGUgcm9vdFxuICBjb25zdCBhbmRyb2lkSWQgPSBleGVjdXRlKCdBTkRST0lEX0RBVEE9L2RhdGEgc2V0dGluZ3MgZ2V0IHNlY3VyZSBhbmRyb2lkX2lkJyk7XG4gIGNvbnNvbGUubG9nKGB1cGxvYWQgYW5kcm9pZElkOiAke2FuZHJvaWRJZH1gKTtcbiAgd3JpdGVGaWxlKGFuZHJvaWRJZEZpbGVQYXRoLCBhbmRyb2lkSWQpO1xuXG4gIHRhcmd6KGAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLCBgJHtzY3JpcHRDYWNoZVJvb3R9YCk7XG5cbiAgLy8gdXBsb2FkIHNlc3Npb25cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgY29uc3Qgc2Vzc2lvbkZpbGVOYW1lID0gYGxvZ2luQ2FjaGUvJHtsaWNlbnNlSWR9Lmd6YDtcbiAgY29uc3Qgc2l6ZU9yRXJyb3IgPSBzM1VwbG9hZEZpbGUoXG4gICAgYCR7c2NyaXB0Q2FjaGVSb290fS5nemAsXG4gICAgc2Vzc2lvbkZpbGVOYW1lLFxuICAgICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgIGVuZHBvaW50LFxuICAgIGJ1Y2tldCxcbiAgICB4cm9ib3Rtb25TM0tleSxcbiAgICB4cm9ib3Rtb25TM1Rva2VuLFxuICAgICcnLFxuICAgIGZhbHNlXG4gICk7XG4gIGNvbnNvbGUubG9nKGB1cGxvYWQgc2Vzc2lvbiB0byAke2VuZHBvaW50fSBmaW5pc2guIHNpemVPckVycm9yICR7c2l6ZU9yRXJyb3J9OyB1c2VkVGltZSAke0RhdGUubm93KCkgLSBub3d9YCk7XG5cbiAgLy8gcmVtb3ZlIHRtcCBmaWxlIHJvb3RcbiAgZXhlY3V0ZUNvbW1hbmRzKGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCwgYHJtIC1mICR7c2NyaXB0Q2FjaGVSb290fS5nemApO1xufVxuXG5mdW5jdGlvbiBsb2dPdXQoKSB7XG4gIGNvbnNvbGUubG9nKGBkbyBsb2dvdXRgKTtcbiAgbGV0IGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIHdoaWxlIChpc0luQXBwKSB7XG4gICAgcmVyb3V0ZXIuc3RvcEFwcCgpO1xuICAgIHNsZWVwKDMwMDApO1xuICAgIGlzSW5BcHAgPSByZXJvdXRlci5jaGVja0luQXBwKCk7XG4gIH1cbiAgY29uc29sZS5sb2coJ2FwcCBpcyBzdG9wcGVkLCBjbGVhciBzZXNzaW9uIHN0YXJ0Jyk7XG4gIGNsZWFyU2Vzc2lvbigpO1xuICB3cml0ZUZpbGUobGljZW5zZUZpbGVQYXRoLCAnJyk7XG59XG5mdW5jdGlvbiBsb2dJbigpIHtcbiAgbGV0IHsgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcbiAgY29uc29sZS5sb2coYGRvIGxvZ2luYCk7XG4gIGxldCBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB3aGlsZSAoaXNJbkFwcCkge1xuICAgIHJlcm91dGVyLnN0b3BBcHAoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB9XG4gIGNvbnNvbGUubG9nKCdhcHAgaXMgc3RvcHBlZCwgc2V0IHNlc3Npb24gc3RhcnQnKTtcbiAgc2V0U2Vzc2lvbigpO1xuICB3cml0ZUZpbGUobGljZW5zZUZpbGVQYXRoLCBsaWNlbnNlSWQpO1xufVxuXG5mdW5jdGlvbiBmZXRjaFNlc3Npb24oKTogYm9vbGVhbiB7XG4gIGxldCB7IHhyb2JvdG1vblMzS2V5LCB4cm9ib3Rtb25TM1Rva2VuLCBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuICBpZiAoISh4cm9ib3Rtb25TM0tleSAmJiB4cm9ib3Rtb25TM1Rva2VuICYmIGxpY2Vuc2VJZCkpIHtcbiAgICBjb25zb2xlLmxvZygnZmV0Y2ggZmFpbGVkOiByZXF1aXJlZCBrZXkgaXMgZW1wdHknKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zb2xlLmxvZyhgZmV0Y2hTZXNzaW9uIHN0YXJ0ICR7bGljZW5zZUlkfWApO1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICAvLyByZW1vdmUgb2xkIGZpbGVzXG4gICAgYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH1gLFxuICAgIGBybSAtZiAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLFxuXG4gICAgLy8gY3JlYXRlIHRtcCBmaWxlIHJvb3RcbiAgICBgbWtkaXIgLXAgJHtzY3JpcHRDYWNoZVJvb3R9YFxuICApO1xuXG4gIGNvbnN0IHNlc3Npb25GaWxlTmFtZSA9IGBsb2dpbkNhY2hlLyR7bGljZW5zZUlkfS5nemA7XG4gIGNvbnN0IHJlc3VsdE9yRXJyb3IgPSBzM0Rvd25sb2FkRmlsZShgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCwgc2Vzc2lvbkZpbGVOYW1lLCBlbmRwb2ludCwgYnVja2V0LCB4cm9ib3Rtb25TM0tleSwgeHJvYm90bW9uUzNUb2tlbiwgJycsIGZhbHNlKTtcbiAgaWYgKHJlc3VsdE9yRXJyb3IgIT09IHRydWUpIHtcbiAgICBjb25zb2xlLmxvZyhgZmV0Y2hTZXNzaW9uIGZhaWxlZCAke3Jlc3VsdE9yRXJyb3J9YCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnNvbGUubG9nKGBEb3dubG9hZCBzZXNzaW9uIGZyb20gJHtlbmRwb2ludH0gZmluaXNoLiB1c2VkVGltZWAsIERhdGUubm93KCkgLSBub3csIGxpY2Vuc2VJZCwgcmVzdWx0T3JFcnJvcik7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzZXRTZXNzaW9uKCkge1xuICAvLyBjbGVhciBhcHAgc2Vzc2lvbiB0byBhdm9pZCBjYW5ub3Qgb3ZlcndyaXRlXG4gIGNvbnN0IGdhbWVSZWNvcmRGaWxlTmFtZSA9IGdldEdhbWVSZWNvcmRGaWxlTmFtZSgpIHx8ICdOT1RfRVhJU1RfUkVDT1JEJztcbiAgZXhlY3V0ZUNvbW1hbmRzKGBybSAtcmYgJHthcHBTZXNzaW9uUm9vdH0vZmlsZXNgLCBgcm0gLXJmICR7YXBwU2Vzc2lvblJvb3R9L3NoYXJlZF9wcmVmc2AsIGBybSAtcmYgJHthcHBSZWNvcmRSb290fS8ke2dhbWVSZWNvcmRGaWxlTmFtZX1gKTtcblxuICAvLyB1bnRhcmd6IGNsb3VkIHNlc3Npb24gYW5kIG92ZXJ3cml0ZSBhcHAgc2Vzc2lvblxuICBjb25zb2xlLmxvZyhgc2V0IHNlc3Npb24gc3RhcnRgKTtcbiAgdW50YXJneihgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCk7XG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICBgY3AgLXIgJHtzY3JpcHRDYWNoZVJvb3R9L2ZpbGVzICR7YXBwU2Vzc2lvblJvb3R9L2AsXG4gICAgYGNwIC1yICR7c2NyaXB0Q2FjaGVSb290fS9zaGFyZWRfcHJlZnMgJHthcHBTZXNzaW9uUm9vdH0vYCxcbiAgICBgY3AgLXIgJHtzY3JpcHRDYWNoZVJvb3R9L2dhbWVSZWNvcmQvKiAke2FwcFJlY29yZFJvb3R9L2AsXG5cbiAgICBgY2htb2QgLVIgNzc3ICR7YXBwU2Vzc2lvblJvb3R9L2ZpbGVzYCxcbiAgICBgY2htb2QgLVIgNzc3ICR7YXBwU2Vzc2lvblJvb3R9L3NoYXJlZF9wcmVmc2AsXG4gICAgYGNobW9kIC1SIDc3NyAke2FwcFJlY29yZFJvb3R9YFxuICApO1xuICBzZXRBbmRyb2lkSWQoJ2Nsb3VkJyk7XG4gIGNvbnNvbGUubG9nKCdzZXQgc2Vzc2lvbiBkb25lJyk7XG4gIHNsZWVwKDIwMDApO1xufVxuXG5mdW5jdGlvbiBjbGVhclNlc3Npb24oKSB7XG4gIHNldEFuZHJvaWRJZCgncmFuZG9tJyk7XG4gIGNvbnN0IGdhbWVSZWNvcmRGaWxlTmFtZSA9IGdldEdhbWVSZWNvcmRGaWxlTmFtZSgpIHx8ICdOT1RfRVhJU1RfUkVDT1JEJztcbiAgZXhlY3V0ZUNvbW1hbmRzKFxuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcbiAgICBgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fWAsXG5cbiAgICBgcm0gLXJmICR7YXBwU2Vzc2lvblJvb3R9L2ZpbGVzYCxcbiAgICBgcm0gLXJmICR7YXBwU2Vzc2lvblJvb3R9L3NoYXJlZF9wcmVmc2AsXG4gICAgYHJtIC1yZiAke2FwcFJlY29yZFJvb3R9LyR7Z2FtZVJlY29yZEZpbGVOYW1lfWBcbiAgKTtcbiAgY29uc29sZS5sb2coJ2NsZWFyIHNlc3Npb24gZG9uZScpO1xuICBzbGVlcCgyMDAwKTtcbn1cblxuZnVuY3Rpb24gc2V0QW5kcm9pZElkKHNvdXJjZTogJ3JhbmRvbScgfCAnY2xvdWQnKSB7XG4gIGxldCBbb3JpQW5kcm9pZElkXSA9IGV4ZWN1dGVDb21tYW5kcygnQU5EUk9JRF9EQVRBPS9kYXRhIHNldHRpbmdzIGdldCBzZWN1cmUgYW5kcm9pZF9pZCcpO1xuICBsZXQgYW5kcm9pZElkID0gTUQ1KGAke0RhdGUubm93KCl9JHtvcmlBbmRyb2lkSWR9YCkuc3Vic3RyaW5nKDAsIDE2KTtcbiAgaWYgKHNvdXJjZSA9PT0gJ2Nsb3VkJykge1xuICAgIGFuZHJvaWRJZCA9IHJlYWRGaWxlKGFuZHJvaWRJZEZpbGVQYXRoKSB8fCBhbmRyb2lkSWQ7XG4gIH1cbiAgZXhlY3V0ZUNvbW1hbmRzKCdBTkRST0lEX0RBVEE9L2RhdGEgc2V0dGluZ3MgcHV0IHNlY3VyZSBhbmRyb2lkX2lkICcgKyBhbmRyb2lkSWQpO1xuICBjb25zb2xlLmxvZygnb3JpQW5kcm9pZElkJywgb3JpQW5kcm9pZElkKTtcbiAgY29uc29sZS5sb2coJ3NldEFuZHJvaWRJZCcsIGFuZHJvaWRJZCk7XG59XG5cbmZ1bmN0aW9uIGNvcHlHYW1lUmVjb3JkVG9DYWNoZSgpIHtcbiAgY29uc3QgZmlsZU5hbWUgPSBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKTtcbiAgaWYgKCFmaWxlTmFtZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBleGVjdXRlQ29tbWFuZHMoYG1rZGlyIC1wICR7Z2FtZVJlY29yZENhY2hlUm9vdH1gLCBgY3AgLXIgJHthcHBSZWNvcmRSb290fS8ke2ZpbGVOYW1lfSAke2dhbWVSZWNvcmRDYWNoZVJvb3R9LyR7ZmlsZU5hbWV9L2ApO1xufVxuXG5mdW5jdGlvbiBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKSB7XG4gIGNvbnN0IGZpbGVzID0gZXhlY3V0ZUNvbW1hbmRzKGBscyAke2FwcFJlY29yZFJvb3R9YClbMF0uc3BsaXQoJ1xcbicpO1xuICBmb3IgKGxldCBmaWxlTmFtZSBvZiBmaWxlcykge1xuICAgIGlmIChmaWxlTmFtZS5sZW5ndGggPT09IDMyKSB7XG4gICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnRyaW0oKTtcbiAgICAgIGNvbnNvbGUubG9nKGBnYW1lIHJlY29yZCAke2ZpbGVOYW1lfWApO1xuICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJyc7XG59XG4iLCJpbXBvcnQgeyByZXJvdXRlciB9IGZyb20gJy4vcmVyb3V0ZXInO1xuaW1wb3J0ICogYXMgRXZlbnRTZW5kZXIgZnJvbSAnLi9ldmVudFNlbmRlcic7XG5pbXBvcnQgKiBhcyBTZXNzaW9uIGZyb20gJy4vc2Vzc2lvbic7XG5pbXBvcnQgKiBhcyBDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7IGV4ZWN1dGVDb21tYW5kcyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZUdhbWUgPSB7XG4gIHRyeUVudGVyR2FtZUNudHM6IDAsXG4gIG5lZWRSZXNldFByb2dyZXNzOiBmYWxzZSxcbiAgbGFzdENoZWNrUG93ZXJTYXZlQXQ6IDAsXG4gIHBvd2VyU2F2ZUNvbG9yQ291bnQ6IHt9LFxufTtcbmV4cG9ydCBsZXQgaXNXYWl0aW5nTG9naW4gPSBmYWxzZTtcbmxldCBsYXN0VXBsb2FkU2Vzc2lvbkF0ID0gMDtcbmxldCBoYXNTZXNzaW9uID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KGpzb25Db25maWc6IGFueSkge1xuICBDb25maWcuc2V0KGpzb25Db25maWcpO1xuICByZXJvdXRlci5yZXJvdXRlckNvbmZpZy5hdXRvTGF1bmNoQXBwID0gQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSB8fCBmYWxzZTtcbiAgaWYgKENvbmZpZy5jb25maWcuaXNDbG91ZCkge1xuICAgIFNlc3Npb24uaW5pdFNlc3Npb24oKTtcbiAgICBleGVjdXRlQ29tbWFuZHMoJ3BtIGRpc2FibGUtdXNlciBjb20uYW5kcm9pZC5pbnB1dG1ldGhvZC5sYXRpbicpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmQoKSB7XG4gIGlmIChDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICBTZXNzaW9uLmVuZFNlc3Npb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb25SdW5uaW5nKHVzZUludGVydmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgRXZlbnRTZW5kZXIucnVubmluZyh1c2VJbnRlcnZhbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvZ2luUGFnZShuZWVkVXNlcklucHV0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgaGFzU2Vzc2lvbiA9IGZhbHNlO1xuICBpc1dhaXRpbmdMb2dpbiA9IHRydWU7XG4gIC8vIHVzZSBpbnRlcnZhbCBpbiBydW5uaW5nXG4gIEV2ZW50U2VuZGVyLnJ1bm5pbmcodHJ1ZSk7XG5cbiAgaWYgKG5lZWRVc2VySW5wdXQpIHtcbiAgICBFdmVudFNlbmRlci5sb2dpbklucHV0aW5nKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9naW5TdWNjZXNzKCkge1xuICBoYXNTZXNzaW9uID0gdHJ1ZTtcbiAgaXNXYWl0aW5nTG9naW4gPSBmYWxzZTtcbiAgRXZlbnRTZW5kZXIubG9naW5TdWNjZXNzKCk7XG4gIEV2ZW50U2VuZGVyLnBsYXlpbmcoKTtcbiAgRXZlbnRTZW5kZXIucnVubmluZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25MYXVuY2hpbmcoKSB7XG4gIGhhc1Nlc3Npb24gPSBmYWxzZTtcbiAgbGFzdFVwbG9hZFNlc3Npb25BdCA9IDA7XG4gIGxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cyA9IGxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cztcbiAgbGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IGZhbHNlO1xuICBsZWFndWVHYW1lLmxhc3RDaGVja1Bvd2VyU2F2ZUF0ID0gMDtcbiAgbGVhZ3VlR2FtZS5wb3dlclNhdmVDb2xvckNvdW50ID0ge307XG4gIEV2ZW50U2VuZGVyLmxhdW5jaGluZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tVcGxvYWRTZXNzaW9uKCkge1xuICAvLyBvbmx5IHVwbG9hZCBzZXNzaW9uIHdoZW4gaXMgcGxheWluZ1xuICBpZiAoIUNvbmZpZy5jb25maWcuaXNDbG91ZCB8fCAhaGFzU2Vzc2lvbikge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBpZiAobm93IC0gbGFzdFVwbG9hZFNlc3Npb25BdCA8IENPTlNUQU5UUy51cGxvYWRTZXNzaW9uSW50ZXJ2YWwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGFzdFVwbG9hZFNlc3Npb25BdCA9IG5vdztcbiAgY29uc29sZS5sb2coJ3VwbG9hZCBzZXNzaW9uJyk7XG4gIFNlc3Npb24udXBsb2FkU2Vzc2lvbigpO1xufVxuIiwiaW1wb3J0IHsgR3JvdXBQYWdlLCBQYWdlIH0gZnJvbSAnUmVyb3V0ZXInO1xuXG5leHBvcnQgY29uc3QgbG9nbyA9IG5ldyBQYWdlKFxuICAnbG9nbycsXG4gIFtcbiAgICB7IHg6IDIyNywgeTogMTg0LCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiAyNTgsIHk6IDE4NywgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogMjc4LCB5OiAxOTAsIHI6IDIzMiwgZzogNDgsIGI6IDcyIH0sXG4gICAgeyB4OiAyODUsIHk6IDE4MywgcjogMjU0LCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogMzAxLCB5OiAxNzIsIHI6IDIyOSwgZzogMTksIGI6IDQ2IH0sXG4gICAgeyB4OiAzMTYsIHk6IDE4NywgcjogMjU0LCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogMzM1LCB5OiAxODgsIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDM3MiwgeTogMTg4LCByOiAyNTIsIGc6IDIzMywgYjogMjM1IH0sXG4gICAgeyB4OiAzNzUsIHk6IDE2OSwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogMzk1LCB5OiAxODQsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDM5OCwgeTogMTcwLCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDMsIHk6IDE4NiwgcjogMjU0LCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogMTE3LCB5OiAxMTQsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcblxuICAgIC8vIGxvYWRpbmcgb24gbGVmdCB0b3AgaWYgc3R1Y2tcbiAgICAvLyB7IHg6IDIsIHk6IDUsIHI6IDE0MiwgZzogMjA4LCBiOiAyMDIgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG4vLyB0ZXJtIG9mIHNlcnZpY2VcbmV4cG9ydCBjb25zdCBUT1MgPSBuZXcgUGFnZShcbiAgJ1RPUycsXG4gIFtcbiAgICAvLyBsb2dvXG4gICAgeyB4OiAyODksIHk6IDQwLCByOiAyMzIsIGc6IDUyLCBiOiA3NCB9LFxuICAgIHsgeDogMjkzLCB5OiAzNCwgcjogMjI5LCBnOiAyMSwgYjogNDYgfSxcbiAgICB7IHg6IDI5OSwgeTogMzgsIHI6IDIyNywgZzogNiwgYjogMzMgfSxcbiAgICB7IHg6IDMwOCwgeTogMzcsIHI6IDI0OCwgZzogMTkyLCBiOiAxOTkgfSxcbiAgICB7IHg6IDMxMywgeTogMzksIHI6IDI0OCwgZzogMTkyLCBiOiAxOTkgfSxcbiAgICB7IHg6IDMyMSwgeTogMzcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyNSwgeTogNDIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMywgeTogMzMsIHI6IDI1MiwgZzogMjIzLCBiOiAyMjcgfSxcbiAgICB7IHg6IDMzOCwgeTogMzgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM0MiwgeTogMzgsIHI6IDI0NiwgZzogMTc2LCBiOiAxODUgfSxcbiAgICB7IHg6IDM0NCwgeTogMzcsIHI6IDI0NiwgZzogMTc3LCBiOiAxODUgfSxcbiAgICB7IHg6IDM0NiwgeTogMzYsIHI6IDIzNCwgZzogNjgsIGI6IDg5IH0sXG4gICAgeyB4OiAzMzUsIHk6IDM0LCByOiAyMzQsIGc6IDY3LCBiOiA4NyB9LFxuICAgIHsgeDogMzM1LCB5OiAzNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzQ0LCB5OiAzNSwgcjogMjI3LCBnOiA2LCBiOiAzMyB9LFxuXG4gICAgLy8gY29weXJpZ2h0XG4gICAgeyB4OiAyODksIHk6IDMzNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzAwLCB5OiAzMzYsIHI6IDE5NCwgZzogMTk3LCBiOiAxOTUgfSxcbiAgICB7IHg6IDMwMSwgeTogMzM2LCByOiAxODcsIGc6IDE5MiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMDcsIHk6IDMzNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzEwLCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMCwgeTogMzM1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjMsIHk6IDMzNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMyLCB5OiAzMzYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODMgfSxcbiAgICB7IHg6IDM0MCwgeTogMzM2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBhZ3JlZSBidG4gYmdcbiAgICB7IHg6IDE3LCB5OiAyOTMsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDU0LCB5OiAzMDUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYyLCB5OiAzMTcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDExMSwgeTogMzE2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyNDMsIHk6IDI5NywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogMjU1LCB5OiAyOTEsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDU5OSwgeTogMzA0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MTMsIHk6IDI5NSwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNjAzLCB5OiAzMTYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQyMSwgeTogMzIyLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG5cbiAgICAvLyBiZyBjb3JuZXIgb3V0c2lkZVxuICAgIHsgeDogNzIsIHk6IDMyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1MTEsIHk6IDQwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1ODYsIHk6IDM5LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxNCwgeTogMzQwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MTksIHk6IDM0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gYmcgY29ybmVyIGluc2lkZVxuICAgIHsgeDogMjIsIHk6IDc3LCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiAxMDAsIHk6IDc3LCByOiAxOTcsIGc6IDE5NywgYjogMTk3IH0sXG4gICAgeyB4OiAxOCwgeTogMjUzLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA2MTMsIHk6IDI4NiwgcjogMjE2LCBnOiAyMTYsIGI6IDIxNiB9LFxuICAgIHsgeDogNjEzLCB5OiA4MCwgcjogMjE1LCBnOiAyMTUsIGI6IDIxNSB9LFxuICAgIHsgeDogNjA5LCB5OiA3MywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogMzA1LCB5OiA3NiwgcjogMTgzLCBnOiAxODMsIGI6IDE4MyB9LFxuICAgIHsgeDogMzA0LCB5OiAyOTEsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgXSxcbiAgeyB4OiAzMjAsIHk6IDMwNiB9LFxuICB7IHg6IDMyMCwgeTogMzA2IH1cbik7XG5cbi8vIHRlcm0gb2Ygc2VydmljZSwgc3VpdCBkZ2k5MFxuZXhwb3J0IGNvbnN0IFRPUzkwID0gbmV3IFBhZ2UoXG4gICdUT1M5MCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMzIsIHk6IDI4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxMCwgeTogMzQyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MjIsIHk6IDM0MywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjIxLCB5OiAzMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gbG9nb1xuICAgIHsgeDogMjg4LCB5OiAyNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzAxLCB5OiAyNywgcjogMjQ2LCBnOiAxNzcsIGI6IDE4NSB9LFxuICAgIHsgeDogMzIxLCB5OiAyNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAyOCwgcjogMjQ1LCBnOiAxNjEsIGI6IDE3MSB9LFxuICAgIHsgeDogMzMwLCB5OiAyOCwgcjogMjMwLCBnOiAzNiwgYjogNjAgfSxcbiAgICB7IHg6IDM0NCwgeTogMjgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9LFxuICB7IHg6IDMyMSwgeTogMzIxIH1cbik7XG5cbi8vIGZvciBkZ2k5MCBhbmQgbmF2aSBiYXIgaXMgc21hbGxlclxuZXhwb3J0IGNvbnN0IFRPUzkwdjIgPSBuZXcgUGFnZShcbiAgJ1RPUzkwdjInLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDIsIHk6IDIzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxLCB5OiA0MiwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogMSwgeTogMzI1LCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA3LCB5OiAzNDgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYzMSwgeTogMzUwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MjgsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjMzLCB5OiAyOTIsIHI6IDIxMywgZzogMjEzLCBiOiAyMTMgfSxcbiAgICB7IHg6IDYzMCwgeTogNDAsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDYyOCwgeTogMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGxvZ29cbiAgICB7IHg6IDI5NiwgeTogMjEsIHI6IDI0OCwgZzogMTkyLCBiOiAxOTkgfSxcbiAgICB7IHg6IDMxNiwgeTogMjQsIHI6IDIyNywgZzogNiwgYjogMzMgfSxcbiAgICB7IHg6IDM0MCwgeTogMjIsIHI6IDIzOSwgZzogMTE1LCBiOiAxMzAgfSxcbiAgXSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9LFxuICB7IHg6IDMyMSwgeTogMzIxIH1cbik7XG5cbi8vIGxpa2UgbGFuZGluZyBidXQgaGFzIHByb2dyZXNzIGJhclxuZXhwb3J0IGNvbnN0IGxhbmRpbmdMb2FkaW5nID0gbmV3IFBhZ2UoXG4gICdsYW5kaW5nTG9hZGluZycsXG4gIFtcbiAgICAvLyBsb2dvIGluIGNlbnRlclxuICAgIC8vIDlpbm5pbmdzXG4gICAgeyB4OiAyOTUsIHk6IDI0MiwgcjogMzAsIGc6IDUwLCBiOiA4MiB9LFxuICAgIHsgeDogMjgzLCB5OiAyMjAsIHI6IDYwLCBnOiA2OSwgYjogOTQgfSxcbiAgICB7IHg6IDI5MiwgeTogMjIwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMDAsIHk6IDIxNSwgcjogMjM0LCBnOiAyMzUsIGI6IDIzNyB9LFxuICAgIHsgeDogMzUwLCB5OiAyMjAsIHI6IDI0NCwgZzogMjM1LCBiOiAyMzcgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbGFuZGluZyA9IG5ldyBQYWdlKFxuICAnbGFuZGluZycsXG4gIFtcbiAgICAvLyBsb2dvIGluIGNlbnRlclxuICAgIHsgeDogMjk3LCB5OiAyNDYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI4MSwgeTogMjQ0LCByOiA4LCBnOiAyOCwgYjogNjYgfSxcbiAgICB7IHg6IDMwMywgeTogMjQzLCByOiAyMTksIGc6IDE0OSwgYjogMTY0IH0sXG5cbiAgICAvLyA5aW5uaW5nc1xuICAgIHsgeDogMjE4LCB5OiAyNjksIHI6IDg4LCBnOiA5OSwgYjogMTMwIH0sXG4gICAgeyB4OiAyMzksIHk6IDI3NywgcjogMjYsIGc6IDQ1LCBiOiA2NSB9LFxuICAgIHsgeDogMjc0LCB5OiAyNzQsIHI6IDI1LCBnOiA0MSwgYjogNzQgfSxcbiAgICB7IHg6IDMxMywgeTogMjc4LCByOiAxMzQsIGc6IDE0MywgYjogMTYwIH0sXG4gICAgeyB4OiAzMjcsIHk6IDI4MiwgcjogOTksIGc6IDEwNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzNTAsIHk6IDI2OSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDI1NCwgeTogMjAwIH0sIC8vIGhpdmUgbG9naW5cbiAgeyB4OiAyNTQsIHk6IDIwMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbG9nSW4gPSBuZXcgUGFnZShcbiAgJ2xvZ0luJyxcbiAgW1xuICAgIHsgeDogMjI2LCB5OiA3NiwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogMzIyLCB5OiA3OCwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogNTM1LCB5OiA0MiwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogNjI0LCB5OiA0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjYsIHk6IDMzMywgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNDQsIHk6IDIzNSwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogMTM2LCB5OiAyMzYsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDI1OCwgeTogMjMyLCByOiAxNDMsIGc6IDE4NiwgYjogMjI3IH0sXG4gICAgeyB4OiA1NDgsIHk6IDE2OSwgcjogNDMsIGc6IDEzMiwgYjogMjE2IH0sXG4gICAgeyB4OiA1ODMsIHk6IDE5NSwgcjogNDMsIGc6IDEzMiwgYjogMjE2IH0sXG4gICAgeyB4OiA0MywgeTogMTQyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0MywgeTogMTk1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTU0LCB5OiAxNzcgfSwgLy8gbG9naW5cbiAgeyB4OiA1NzQsIHk6IDQwIH0gLy8gYmFjayB0byBnYW1lXG4pO1xuXG4vLyBzdWl0IGZvciBkcGkgOTBcbmV4cG9ydCBjb25zdCBsb2dJbjkwID0gbmV3IFBhZ2UoXG4gICdsb2dJbjkwJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxOSwgeTogMzAsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDYsIHk6IDEzMiwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNjMwLCB5OiAyNSwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogNjMxLCB5OiAzMzksIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDE0LCB5OiAzNDUsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDgwLCB5OiAzNDAsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDI4MiwgeTogMzQwLCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiA0MjAsIHk6IDMzNiwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNTY3LCB5OiAzMzgsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcblxuICAgIC8vIGlucHV0XG4gICAgeyB4OiA0NzgsIHk6IDEzMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDc4LCB5OiAxODgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGxvZ2luIGJ0blxuICAgIHsgeDogNTAwLCB5OiAxMzAsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTAwLCB5OiAxNTUsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNDk5LCB5OiAxODQsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTk1LCB5OiAxMjksIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTk3LCB5OiAxNTUsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTk4LCB5OiAxODgsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTQ4LCB5OiAxMjQsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICBdLFxuICB7IHg6IDU1NCwgeTogMTc3IH0sIC8vIGxvZ2luXG4gIHsgeDogNTc0LCB5OiA0MCB9IC8vIGJhY2sgdG8gZ2FtZVxuKTtcblxuZXhwb3J0IGNvbnN0IGZiTG9nSW45MCA9IG5ldyBQYWdlKCdmYkxvZ0luOTAnLCBbXG4gIC8vIGZiIGxvZ29cbiAgeyB4OiAzMDQsIHk6IDE0LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMTYsIHk6IDE3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzA5LCB5OiAzMSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzI1LCB5OiAzMiwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzMxLCB5OiAxNSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzI0LCB5OiAxMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDM0NSwgeTogMTEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMjMsIHk6IDE5LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiAzMzAsIHk6IDIzLCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcblxuICAvLyBiZ1xuICB7IHg6IDczLCB5OiAxMDIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1MiwgeTogMjYxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzEyLCB5OiAzMTUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1OTEsIHk6IDE5NywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDQ5MiwgeTogNjIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMTgsIHk6IDg2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgLy8gbG9naW4gYnRuIGJnXG4gIHsgeDogMjAzLCB5OiAxOTQsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDQzMywgeTogMTk3LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ29vZ2xlTG9nSW45MCA9IG5ldyBQYWdlKCdnb29nbGVMb2dJbjkwJywgW1xuICAvLyBnb29nbGUgbG9nb1xuICB7IHg6IDI5NSwgeTogNjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzMDYsIHk6IDY3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzE4LCB5OiA2OCwgcjogMjUxLCBnOiAxODgsIGI6IDUgfSxcbiAgeyB4OiAzMjEsIHk6IDY4LCByOiAyNTMsIGc6IDIyMSwgYjogMTMwIH0sXG4gIHsgeDogMzI5LCB5OiA2OCwgcjogNjYsIGc6IDEzMywgYjogMjQ0IH0sXG4gIHsgeDogMzM1LCB5OiA2OCwgcjogMjM0LCBnOiA2NywgYjogNTMgfSxcblxuICAvLyBiZ1xuICB7IHg6IDk0LCB5OiAzMywgcjogNzUsIGc6IDEyOSwgYjogMjE4IH0sXG4gIHsgeDogNjcsIHk6IDIyNywgcjogNzksIGc6IDEzMiwgYjogMjIxIH0sXG4gIHsgeDogMTQyLCB5OiAzMjksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA1NTksIHk6IDMzOCwgcjogNjEsIGc6IDExNCwgYjogMjAzIH0sXG4gIHsgeDogNTM5LCB5OiA4MCwgcjogNjMsIGc6IDExNywgYjogMjA1IH0sXG4gIHsgeDogMzUwLCB5OiAzMzQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAvLyBsb2dpbiBidG4gYmdcbiAgeyB4OiA0NzgsIHk6IDIyNCwgcjogMjYsIGc6IDExNSwgYjogMjMyIH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGRvd25sb2FkRGF0YSA9IG5ldyBQYWdlKFxuICAnZG93bmxvYWREYXRhJyxcbiAgW1xuICAgIHsgeDogMTAzLCB5OiA0MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTY3LCB5OiA1OSwgcjogMjIsIGc6IDMwLCBiOiAzMSB9LFxuICAgIHsgeDogMTg4LCB5OiA1OCwgcjogMzksIGc6IDQ3LCBiOiA0NyB9LFxuICAgIHsgeDogMjAwLCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjA5LCB5OiA2MiwgcjogODQsIGc6IDg4LCBiOiA5MiB9LFxuICAgIHsgeDogMjM2LCB5OiA1OCwgcjogNTAsIGc6IDU2LCBiOiA1OCB9LFxuICAgIHsgeDogMjQzLCB5OiA1OCwgcjogMTQ0LCBnOiAxNTAsIGI6IDE1MiB9LFxuICAgIHsgeDogMjkwLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzE3LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzU1LCB5OiA1NCwgcjogOTcsIGc6IDEwMSwgYjogMTA1IH0sXG4gICAgeyB4OiA0MDcsIHk6IDYwLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA1MTMsIHk6IDQ4LCByOiAxODEsIGc6IDE4MiwgYjogMTg4IH0sXG4gICAgeyB4OiA1MjcsIHk6IDU0LCByOiAxNzcsIGc6IDE3NSwgYjogMTc3IH0sXG4gICAgeyB4OiA1MTksIHk6IDYwLCByOiAxODEsIGc6IDE4NSwgYjogMTg5IH0sXG4gICAgeyB4OiAxNjgsIHk6IDI5OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjI0LCB5OiAyOTYsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAyNDksIHk6IDI5OCwgcjogMTAyLCBnOiAxMzMsIGI6IDE3MSB9LFxuICAgIHsgeDogMzkxLCB5OiAyOTksIHI6IDE5NSwgZzogMjIxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ2MSwgeTogMzAyLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0MjMsIHk6IDMwMywgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUyNiwgeTogMzE4LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNDIxLCB5OiAyOTMgfSxcbiAgeyB4OiA0MjEsIHk6IDI5MyB9XG4pO1xuZXhwb3J0IGNvbnN0IHByb2dyZXNzQmFyUnVubmluZyA9IG5ldyBQYWdlKFxuICAncHJvZ3Jlc3NCYXJSdW5uaW5nJyxcbiAgW1xuICAgIC8vIHByb2dyZXNzIGJhclxuICAgIHsgeDogMjA3LCB5OiAzMTYsIHI6IDAsIGc6IDE1MCwgYjogMjU1IH0sXG4gICAgeyB4OiAxOSwgeTogMzIwLCByOiA4LCBnOiAxMiwgYjogMTYgfSxcbiAgICB7IHg6IDYyOCwgeTogMzIwLCByOiA4LCBnOiAxMiwgYjogMTYgfSxcbiAgICB7IHg6IDE5NSwgeTogMzI5LCByOiAyNTUsIGc6IDIwMiwgYjogMCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBtYWluID0gbmV3IFBhZ2UoXG4gICdtYWluJyxcbiAgW1xuICAgIC8vIG5hdmkgYmFyIHJpZ2h0XG4gICAgeyB4OiA2MjIsIHk6IDksIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDU5OCwgeTogMTEsIHI6IDIxNCwgZzogMjI2LCBiOiAyMzggfSxcbiAgICB7IHg6IDU5MiwgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgeyB4OiA0OTQsIHk6IDE1LCByOiAyMzksIGc6IDE3OSwgYjogMjggfSxcbiAgICB7IHg6IDUwMywgeTogMTcsIHI6IDc0LCBnOiA4NCwgYjogOTAgfSxcbiAgICB7IHg6IDM4OSwgeTogMTIsIHI6IDE5NywgZzogMjAyLCBiOiAxOTcgfSxcbiAgICB7IHg6IDMxMywgeTogMTEsIHI6IDE3NCwgZzogMTc4LCBiOiAxNzkgfSxcbiAgICB7IHg6IDI5NywgeTogMTUsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcblxuICAgIC8vIGJ0biBsZWZ0LCB3aXRoIHNldHRpbmdzXG4gICAgeyB4OiAzMSwgeTogMzI2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA4NywgeTogMzI2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxMzcsIHk6IDMyNiwgcjogMTA4LCBnOiAxMTQsIGI6IDEwMCB9LFxuICAgIHsgeDogMTg5LCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI0MywgeTogMzI4LCByOiAxMjYsIGc6IDEyOSwgYjogMTI2IH0sXG4gICAgeyB4OiAyOTksIHk6IDMyOCwgcjogMTAzLCBnOiAxMDcsIGI6IDk5IH0sXG5cbiAgICAvLyBidG4gcmlnaHRcbiAgICB7IHg6IDQyMCwgeTogMzMwLCByOiAxOTgsIGc6IDE4MSwgYjogMzQgfSxcbiAgICB7IHg6IDQ3MywgeTogMzMzLCByOiA1OCwgZzogMzQsIGI6IDUgfSxcbiAgICB7IHg6IDUyOSwgeTogMzMzLCByOiAzMywgZzogODEsIGI6IDE0OSB9LFxuICAgIHsgeDogNTg5LCB5OiAzMzYsIHI6IDEwMCwgZzogMjcsIGI6IDI3IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG1haW5CdG5zID0ge1xuICBsZWFndWVNb2RlOiB7IHg6IDIwNCwgeTogMTU0IH0sXG4gIGJhdHRsZU1vZGU6IHsgeDogMzUwLCB5OiAxNDUgfSxcbiAgc3BlY2lhbE1vZGU6IHsgeDogNDM4LCB5OiAxNDUgfSxcbiAgY2x1Yk1vZGU6IHsgeDogNTU2LCB5OiAxNDUgfSxcbiAgc2V0dGluZ3M6IHsgeDogMjk4LCB5OiAzMjcgfSxcbiAgYWRUYWI6IHsgeDogNTkwLCB5OiA3NyB9LFxuICBhY2hpZXZlbWVudDogeyB4OiAxMzksIHk6IDMyMCB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncycsXG4gIFtcbiAgICAvLyBuYXZpIGluIHJpZ2h0XG4gICAgLy8geyB4OiA2MjUsIHk6IDcsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICAvLyB7IHg6IDU5MywgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgLy8geyB4OiA1OTAsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIC8vIHsgeDogNDg3LCB5OiAxNSwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIC8vIHsgeDogNDgxLCB5OiAxNSwgcjogNzcsIGc6IDg2LCBiOiA5MyB9LFxuICAgIC8vIHsgeDogMzkxLCB5OiAxMSwgcjogNzksIGc6IDgwLCBiOiA3OSB9LFxuICAgIC8vIHsgeDogMzc4LCB5OiAxNiwgcjogMTMzLCBnOiAxNTAsIGI6IDE2OSB9LFxuICAgIC8vIHsgeDogMzEzLCB5OiAxMSwgcjogMTc4LCBnOiAxNzgsIGI6IDE3OSB9LFxuXG4gICAgLy8gYmcgb2YgcmlnaHQgc2VjdGlvblxuICAgIHsgeDogNDc4LCB5OiAxMTksIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ3NiwgeTogMTc1LCByOiAzNiwgZzogNDAsIGI6IDQ0IH0sXG4gICAgeyB4OiA0NzYsIHk6IDIyOCwgcjogMTA3LCBnOiA5NywgYjogOTAgfSxcbiAgICB7IHg6IDQ3NCwgeTogMjgzLCByOiA2NiwgZzogNzcsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI5MywgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYwNSwgeTogMTc4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDgsIHk6IDEyMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuXG4gICAgLy8gZ29vZ2xlIHBsYXkgZ2FtZSBpY29uIGluIHJpZ2h0IHNlY3Rpb25cbiAgICB7IHg6IDQ5MCwgeTogMTE1LCByOiAzNSwgZzogMzgsIGI6IDUxIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNSwgeTogMzEyLCByOiAxOTMsIGc6IDE5OCwgYjogMTkxIH0sXG4gICAgeyB4OiAzOSwgeTogMzIyLCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1RhYnMgPSB7XG4gIHNvdW5kQW5kTGFuVGFiOiB7IHg6IDIyLCB5OiA1NSB9LFxuICBncmFwaGljVGFiOiB7IHg6IDExMSwgeTogNTUgfSxcbn07XG5leHBvcnQgY29uc3Qgc2V0dGluZ3NCdG5zID0ge1xuICBsZWFndWVSZXNldDogeyB4OiA1NjIsIHk6IDIxNyB9LFxufTtcblxuLy8gRklYTUU6IGFkZCBsYW4gY2hhbmdlIHBhZ2VzXG5leHBvcnQgY29uc3Qgc2V0dGluZ3NTb3VuZFRhYiA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3Mvc291bmQnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogNjIxLCB5OiA4LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEwLCByOiA3NCwgZzogOTcsIGI6IDEzMSB9LFxuICAgIHsgeDogNTAzLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogMzkyLCB5OiAxMiwgcjogMTc2LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogMzE1LCB5OiA4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE3LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvLyBoaWdobGlnaHRlZCBzb3VuZCB0YWJcbiAgICB7IHg6IDE5LCB5OiA2MCwgcjogMCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDIwLCB5OiA3MSwgcjogMCwgZzogODksIGI6IDIyMiB9LFxuICAgIHsgeDogOTUsIHk6IDY5LCByOiAwLCBnOiA5MiwgYjogMjMwIH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAxMTcsIHk6IDU2LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAyMDUsIHk6IDU0LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzMDAsIHk6IDUyLCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzOTQsIHk6IDU1LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG5cbiAgICAvLyBiZyB0YWJsZVxuICAgIHsgeDogMjAsIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAyMCwgeTogMjkyLCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA0NTksIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NjAsIHk6IDI4OSwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuXG4gICAgLy8gcmlnaHQgc2lkZWJhciBiZ1xuICAgIHsgeDogNDgwLCB5OiAxMjAsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ4MywgeTogMTc5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0ODUsIHk6IDIzMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNDg2LCB5OiAyODYsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMiwgeTogMTE5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTAsIHk6IDE4MCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMCwgeTogMjg3LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiQnRucyA9IHtcbiAgbGFuZzogeyB4OiA0MDEsIHk6IDE5MCB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0ID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncy9zb3VuZC9sYW5TZWxlY3QnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDI5MywgeTogMTgsIHI6IDI1LCBnOiAyMCwgYjogMjUgfSxcbiAgICB7IHg6IDQzLCB5OiAzNDMsIHI6IDgsIGc6IDQsIGI6IDAgfSxcbiAgICB7IHg6IDYyMiwgeTogMzQ1LCByOiA4LCBnOiA4LCBiOiA4IH0sXG5cbiAgICAvLyBsYW5nIGVuZ2xpc2ggYnRuXG4gICAgeyB4OiAxNjAsIHk6IDEyNywgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE5MCwgeTogMTMyLCByOiA1OCwgZzogOTIsIGI6IDEyOSB9LFxuICAgIHsgeDogMjEzLCB5OiAxMzMsIHI6IDgwLCBnOiAxMTMsIGI6IDE1MSB9LFxuICAgIHsgeDogMjI5LCB5OiAxMzMsIHI6IDE2NiwgZzogMTg5LCBiOiAyMTggfSxcbiAgICB7IHg6IDI0MSwgeTogMTMzLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjY2LCB5OiAxNDIsIHI6IDQ5LCBnOiA4MSwgYjogMTE1IH0sXG4gICAgeyB4OiAyODIsIHk6IDEyOSwgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE2NiwgeTogMTQ1LCByOiA0MSwgZzogNzcsIGI6IDExNSB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjYsIHk6IDMxNiwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogNDMsIHk6IDMyMSwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogMzQsIHk6IDMyOSwgcjogMjAxLCBnOiAyMDYsIGI6IDIwMSB9LFxuICBdLFxuICB7IHg6IDIwMCwgeTogMTMxIH0sIC8vIGVuZ2xpc2ggYnRuXG4gIHsgeDogMjAwLCB5OiAxMzEgfSAvLyBlbmdsaXNoIGJ0blxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0UHJvY2VlZEJ0bnMgPSB7XG4gIHllczogeyB4OiA0MDcsIHk6IDMwNyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWIgPSBuZXcgUGFnZShcbiAgJ3NldHRpbmdzL2dyYXBoJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDYyMSwgeTogOCwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTk1LCB5OiAxMCwgcjogNzQsIGc6IDk3LCBiOiAxMzEgfSxcbiAgICB7IHg6IDUwMywgeTogMTUsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDM5MiwgeTogMTIsIHI6IDE3NiwgZzogMTczLCBiOiAxNzYgfSxcbiAgICB7IHg6IDMxNSwgeTogOCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMzAyLCB5OiAxNywgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuXG4gICAgLy8gaGlnaGxpZ2h0ZWQgZ3JhcGggdGFiXG4gICAgeyB4OiAxMjMsIHk6IDU5LCByOiAwLCBnOiAxMDEsIGI6IDI1NCB9LFxuICAgIHsgeDogMTQ5LCB5OiA1OSwgcjogMjgsIGc6IDExOSwgYjogMjU0IH0sXG4gICAgeyB4OiAxNzcsIHk6IDY0LCByOiAwLCBnOiA5NywgYjogMjM4IH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAzNywgeTogNjMsIHI6IDU4LCBnOiA2NSwgYjogNzQgfSxcbiAgICB7IHg6IDYyLCB5OiA2MiwgcjogMTM0LCBnOiAxNDMsIGI6IDE1OCB9LFxuICAgIHsgeDogMjMyLCB5OiA1NywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogMjY3LCB5OiA2MywgcjogMTU2LCBnOiAxNjcsIGI6IDE4MCB9LFxuICAgIHsgeDogMzIyLCB5OiA2MywgcjogMTYwLCBnOiAxNjUsIGI6IDE4MCB9LFxuICAgIHsgeDogMzUzLCB5OiA2MywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogNDAxLCB5OiA2NCwgcjogMTcxLCBnOiAxNzksIGI6IDE5MiB9LFxuICAgIHsgeDogNDQwLCB5OiA2MSwgcjogMTU1LCBnOiAxNTksIGI6IDE3NyB9LFxuXG4gICAgLy8gYmcgdGFibGVcbiAgICB7IHg6IDE5LCB5OiA5MCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogMjMsIHk6IDI5MSwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU5LCB5OiA4NCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU4LCB5OiAyODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWJCdG5zID0ge1xuICBxdWFsaXR5Tm9ybWFsOiB7IHg6IDIxMiwgeTogMTIwIH0sXG4gIG1heEZQUzMwOiB7IHg6IDgzLCB5OiAxNzUgfSxcbiAgcG93ZXJTYXZlT246IHsgeDogMjIyLCB5OiAyMjIgfSxcbiAgYmlnSGVhZE1vZGVPZmY6IHsgeDogODYsIHk6IDI4MyB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcblxuLy8gdGVsbCB1c2VyIHRoZSBzZWFzb24gc3RhcnRcbmV4cG9ydCBjb25zdCBuZXdTZWFzb24gPSBuZXcgUGFnZShcbiAgJ25ld1NlYXNvbicsXG4gIFtcbiAgICAvLyBiZyBib3R0b21cbiAgICB7IHg6IDUzLCB5OiAzMzQsIHI6IDE2LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNjEzLCB5OiAzMzQsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIG5leHQgb3Igb2sgYnRuIGJnXG4gICAgeyB4OiAyNTQsIHk6IDI5MiwgcjogMCwgZzogMTE3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI1NSwgeTogMzExLCByOiA4LCBnOiAxMDIsIGI6IDI0NyB9LFxuICAgIHsgeDogMzc2LCB5OiAyOTIsIHI6IDAsIGc6IDExNywgYjogMjQ3IH0sXG4gICAgeyB4OiAzNzYsIHk6IDMxMywgcjogMTYsIGc6IDEwMSwgYjogMjU0IH0sXG5cbiAgICAvLyBsb2dvIGluIGNlbnRlciByaWdodFxuICAgIHsgeDogMzU0LCB5OiAxNDcsIHI6IDAsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzc0LCB5OiAxNTgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4NiwgeTogMTQ5LCByOiAxOTIsIGc6IDIwLCBiOiA2NSB9LFxuICBdLFxuICB7IHg6IDMyNCwgeTogMzA1IH0sXG4gIHsgeDogMzI0LCB5OiAzMDUgfVxuKTtcblxuLy8gY2hlY2sgdGhlcmUgbWlnaHQgYmUgbWFueSBkaWZmIHRpdGxlcyBmb3IgZW5kIHNlYXNvblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvbiA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uJyxcbiAgW1xuICAgIC8vIHhcbiAgICB7IHg6IDUxOCwgeTogNDcsIHI6IDcxLCBnOiA3MywgYjogNzIgfSxcblxuICAgIC8vIGxvZ28gb24gY2VudGVyIHJpZ2h0XG4gICAgeyB4OiAzNTcsIHk6IDE0NCwgcjogMCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzNjksIHk6IDE1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzg1LCB5OiAxNDAsIHI6IDE4OSwgZzogMTQsIGI6IDU4IH0sXG5cbiAgICAvLyBuZXh0XG4gICAgeyB4OiAyODAsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxMiwgeTogMjk5LCByOiAxNiwgZzogMTE1LCBiOiAyNDIgfSxcbiAgICB7IHg6IDMzOSwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzY4LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG4vLyBhZnRlciBlbmRTZWFzb24sIHh4IHNlYXNvbiBpcyBvdmVyXG5leHBvcnQgY29uc3QgZW5kU2Vhc29uUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZCcsXG4gIFtcbiAgICAvLyBob3cgd291bGQgeW91IGxpa2UgdG8gcHJvY2VlZCB3aXRoIG5leHQgc2Vhc29uID9cbiAgICB7IHg6IDQ1MiwgeTogMzgsIHI6IDE5NSwgZzogMjEzLCBiOiAyMjkgfSxcbiAgICB7IHg6IDUwOCwgeTogMzYsIHI6IDgsIGc6IDg1LCBiOiAxNDggfSxcbiAgICB7IHg6IDU0NSwgeTogMzQsIHI6IDI1MywgZzogMjUzLCBiOiAyNTQgfSxcbiAgICB7IHg6IDU2NiwgeTogMzQsIHI6IDQzLCBnOiAxMDcsIGI6IDE2NyB9LFxuICAgIHsgeDogMjc3LCB5OiAzNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTY4LCB5OiAzMSwgcjogMjE5LCBnOiAyMzIsIGI6IDIzNyB9LFxuICAgIHsgeDogNTY4LCB5OiAzOCwgcjogNDUsIGc6IDEwNywgYjogMTY1IH0sXG4gICAgeyB4OiA1NTMsIHk6IDM4LCByOiAzMCwgZzogOTgsIGI6IDE2MCB9LFxuXG4gICAgLy8gYmcgY29ybmVyXG4gICAgeyB4OiA4LCB5OiAxMywgcjogMCwgZzogOTcsIGI6IDE4MSB9LFxuICAgIHsgeDogOCwgeTogMzQzLCByOiAxNiwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyNSwgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYyOCwgeTogMzUwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTM5LCB5OiAzMjUsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiA1NTgsIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTcxLCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNiwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvblByb2NlZWRTZWxlY3RlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkJyxcbiAgW1xuICAgIC8vIGJnIGNvcm5lclxuICAgIHsgeDogOCwgeTogMTMsIHI6IDAsIGc6IDk3LCBiOiAxODEgfSxcbiAgICB7IHg6IDgsIHk6IDM0MywgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA2MjUsIHk6IDIyLCByOiAwLCBnOiA4OSwgYjogMTY0IH0sXG4gICAgeyB4OiA2MjgsIHk6IDM1MCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDUzOSwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogNTU4LCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3MSwgeTogMzI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDYsIHk6IDMyNSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNiwgeTogMTksIHI6IDAsIGc6IDkzLCBiOiAxNzMgfSxcbiAgICB7IHg6IDE5LCB5OiAzMzcsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDYyMywgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYxOSwgeTogMjMyLCByOiAxNiwgZzogMjQsIGI6IDE2IH0sXG5cbiAgICAvLyBOT1JNQUwgTEVBR1VFXG4gICAgeyB4OiAxMjUsIHk6IDE2NCwgcjogMjE0LCBnOiAyMjAsIGI6IDIyMSB9LFxuICAgIHsgeDogMTQzLCB5OiAxNjUsIHI6IDQxLCBnOiAxMDUsIGI6IDI4IH0sXG5cbiAgICAvLyBtb2RlIGJnXG4gICAgeyB4OiA0NiwgeTogODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDQ3LCB5OiAyODgsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDMzNywgeTogNzksIHI6IDU4LCBnOiA1NywgYjogNjYgfSxcbiAgICB7IHg6IDM0MiwgeTogMjg0LCByOiA1OCwgZzogNTcsIGI6IDY2IH0sXG5cbiAgICAvLyByZXdhcmQgaW5mbyBpbiBib3RoXG4gICAgeyB4OiAxMzgsIHk6IDI3MCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEwNiwgeTogMjcyLCByOiA2NSwgZzogMTQ3LCBiOiAyNDkgfSxcbiAgICB7IHg6IDM5NSwgeTogMjczLCByOiAxOTUsIGc6IDIyMSwgYjogMjUzIH0sXG4gICAgeyB4OiA0MjEsIHk6IDI3NiwgcjogOCwgZzogMTAyLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlQnRucyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgeDogMTcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbiAgbWFzdGVyOiB7XG4gICAgeDogNDcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE2LCB5OiAxOSwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMTksIHk6IDMzNywgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNjIzLCB5OiAyMiwgcjogMCwgZzogODksIGI6IDE2NCB9LFxuICAgIHsgeDogNjE5LCB5OiAyMzIsIHI6IDE2LCBnOiAyNCwgYjogMTYgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzUsIHk6IDMyNiwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDU3MCwgeTogMzMwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyOCwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbi8vIGEgZGlhbG9nIHRvIGNvbmZpcm0gbGVhZ3VlIHJlc2V0XG5leHBvcnQgY29uc3QgbGVhZ3VlUmVzZXREaWFsb2dZTiA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmVzZXREaWFsb2dZTicsXG4gIFtcbiAgICB7IHg6IDExNSwgeTogNTQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwOCwgeTogMzA1LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MDgsIHk6IDMwOCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiA1MCwgcjogMTgxLCBnOiAxODIsIGI6IDE4MSB9LFxuICAgIHsgeDogNTMxLCB5OiA0OCwgcjogMTY3LCBnOiAxNzIsIGI6IDE3NCB9LFxuICAgIHsgeDogMjYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzE5LCB5OiA2MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzQ3LCB5OiA2MiwgcjogMTI3LCBnOiAxMzMsIGI6IDEzNyB9LFxuICAgIHsgeDogMzc0LCB5OiA2MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjIwLCB5OiAzMDIsIHI6IDQxLCBnOiA3MywgYjogMTIzIH0sXG4gICAgeyB4OiAzOTksIHk6IDMwNiwgcjogMTU1LCBnOiAxOTUsIGI6IDI1MSB9LFxuICAgIHsgeDogNDQzLCB5OiAzMDUsIHI6IDgsIGc6IDEwNSwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMTkzLCB5OiAzMDAgfSwgLy8gbm8sIGNhbmNlbFxuICB7IHg6IDM3MSwgeTogMzAwIH0gLy8geWVzLCByZXNldFxuKTtcblxuLy8gYSBkaWFsb2cgdG8gc2VsZWN0IHllYXIsIG5vcm1hbCBvciBtYXN0ZXIgbGVhZ3VlXG4vLyBUT0RPOiBsZXQgdXNlciBjYW4gc2VsZWN0IHNwZWNpZmljIG1vZGUgYW5kIHllYXIgdG8gcGxheVxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJlc2V0RGlhbG9nID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXNldERpYWxvZycsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjcwLCB5OiA0MCwgcjogNDAsIGc6IDQ0LCBiOiA0OSB9LFxuICAgIHsgeDogMjkzLCB5OiA0NCwgcjogMTQ2LCBnOiAxNDgsIGI6IDE1NSB9LFxuICAgIHsgeDogMzI2LCB5OiA0NSwgcjogMTkzLCBnOiAxOTcsIGI6IDIwNiB9LFxuICAgIHsgeDogMzUxLCB5OiA0MiwgcjogMjEsIGc6IDI2LCBiOiAzMCB9LFxuICAgIHsgeDogMzY0LCB5OiA0MiwgcjogMTg4LCBnOiAxOTIsIGI6IDE5OCB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDEyMSwgeTogMjUsIHI6IDE5MSwgZzogMTk5LCBiOiAyMDYgfSxcbiAgICB7IHg6IDExNiwgeTogMjg4LCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG4gICAgeyB4OiA1MTgsIHk6IDM1LCByOiA3MiwgZzogNzUsIGI6IDgwIH0sXG4gICAgeyB4OiA1MTcsIHk6IDI5MiwgcjogMjM5LCBnOiAyNDIsIGI6IDIzOSB9LFxuXG4gICAgLy8gY2FuY2VsIGJ0biBiZ1xuICAgIHsgeDogMTg1LCB5OiAyODIsIHI6IDQxLCBnOiA3NSwgYjogMTE4IH0sXG5cbiAgICAvLyByZXNldCB0byB5ZWFyIFhYIGJ0biBiZ1xuICAgIHsgeDogMzI3LCB5OiAyOTcsIHI6IDMsIGc6IDc5LCBiOiAyMzUgfSxcbiAgXSxcbiAgeyB4OiAzNzEsIHk6IDMwMCB9LCAvLyByZXNldCB0byB5ZWFyIFhYXG4gIHsgeDogMTkzLCB5OiAzMDAgfSAvLyBjYW5jZWxcbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVSZXNldERpYWxvZ0J0bnMgPSB7XG4gIG5vcm1hbDogeyB4OiAyMTgsIHk6IDEwNSB9LFxuICBtYXN0ZXI6IHsgeDogNDAyLCB5OiAxMDUgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RTZWFzb25Nb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RTZWFzb25Nb2RlJyxcbiAgW1xuICAgIHsgeDogMTA0LCB5OiAxNiwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMjM1LCB5OiAzNywgcjogMTQzLCBnOiAxODEsIGI6IDIwNyB9LFxuICAgIHsgeDogMzA5LCB5OiAzNiwgcjogMTQ1LCBnOiAxODIsIGI6IDIwOSB9LFxuICAgIHsgeDogMzM3LCB5OiAzOCwgcjogMTAzLCBnOiAxNDksIGI6IDE5MSB9LFxuICAgIHsgeDogMzc2LCB5OiAzMiwgcjogMjQ1LCBnOiAyNDcsIGI6IDI1MyB9LFxuICAgIHsgeDogNDIyLCB5OiAzNiwgcjogMTQ1LCBnOiAxNzcsIGI6IDIwOSB9LFxuICAgIHsgeDogNDAsIHk6IDc1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTQsIHk6IDE4MywgcjogMzMsIGc6IDM2LCBiOiAzMyB9LFxuICAgIHsgeDogMzQxLCB5OiA5MywgcjogNDEsIGc6IDQ4LCBiOiA0OSB9LFxuICAgIHsgeDogNTM5LCB5OiAzMjMsIHI6IDAsIGc6IDY5LCBiOiAxNDkgfSxcbiAgICB7IHg6IDU1MywgeTogMzI4LCByOiAwLCBnOiA2NSwgYjogMTQ4IH0sXG4gIF0sXG4gIHsgeDogMTc4LCB5OiAxODMgfSxcbiAgeyB4OiAxNzgsIHk6IDE4MyB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCcsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMTc5LCB5OiA2MCwgcjogOCwgZzogNjUsIGI6IDExNSB9LFxuICAgIHsgeDogMTk1LCB5OiA1OSwgcjogNTIsIGc6IDk5LCBiOiAxNDEgfSxcbiAgICB7IHg6IDI0NSwgeTogNTYsIHI6IDE3NywgZzogMTk4LCBiOiAyMTIgfSxcbiAgICB7IHg6IDM2MSwgeTogNTcsIHI6IDUsIGc6IDY2LCBiOiAxMTUgfSxcbiAgICB7IHg6IDQzOSwgeTogNTYsIHI6IDE5NCwgZzogMjA4LCBiOiAyMjEgfSxcbiAgICB7IHg6IDQ4MywgeTogNTYsIHI6IDAsIGc6IDY1LCBiOiAxMTUgfSxcblxuICAgIC8vIGFtb3VudCB0aXRsZSBiZ1xuICAgIHsgeDogMzAsIHk6IDEwNCwgcjogMjMwLCBnOiAyMjcsIGI6IDIzMCB9LFxuICAgIHsgeDogNzAsIHk6IDEwMCwgcjogMjI4LCBnOiAyMjgsIGI6IDIyOCB9LFxuICAgIHsgeDogMTE2LCB5OiAxMDAsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcbiAgICB7IHg6IDIwOSwgeTogMTAyLCByOiA0MSwgZzogNDksIGI6IDU4IH0sXG4gICAgeyB4OiAyNDQsIHk6IDEwMiwgcjogMTE0LCBnOiAxMjEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjc2LCB5OiAxMDIsIHI6IDQ0LCBnOiA1NCwgYjogNjYgfSxcbiAgICB7IHg6IDM2MSwgeTogOTgsIHI6IDU0LCBnOiA2MCwgYjogNzAgfSxcbiAgICB7IHg6IDQwOSwgeTogMTAyLCByOiA3NCwgZzogNzksIGI6IDg3IH0sXG4gICAgeyB4OiA0NTYsIHk6IDk5LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA0OTYsIHk6IDk3LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA1MzcsIHk6IDEwMSwgcjogOTIsIGc6IDk4LCBiOiAxMDYgfSxcbiAgICB7IHg6IDU4MiwgeTogOTksIHI6IDIwMCwgZzogMjA0LCBiOiAyMDcgfSxcbiAgICB7IHg6IDU5OCwgeTogOTksIHI6IDIzMCwgZzogMjMxLCBiOiAyMzAgfSxcbiAgXSxcbiAgeyB4OiAzOSwgeTogMzE0IH0sXG4gIHsgeDogMzksIHk6IDMxNCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zID0ge1xuICBmdWxsOiB7IHg6IDI1LCB5OiAyODUgfSxcbiAgaGFsZjogeyB4OiAyNDUsIHk6IDI4NSB9LFxuICBxdWFydGVyOiB7IHg6IDQwMCwgeTogMTEyIH0sXG4gIHBvc3Q6IHsgeDogNjAwLCB5OiAxMTIgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RZZWFyID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RZZWFyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMDMsIHk6IDI0LCByOiAyMDEsIGc6IDIwMSwgYjogMjA1IH0sXG4gICAgeyB4OiAxMDQsIHk6IDI4OSwgcjogMjQwLCBnOiAyNDAsIGI6IDI0MCB9LFxuICAgIHsgeDogNTE5LCB5OiAzNCwgcjogNzQsIGc6IDcxLCBiOiA3NCB9LFxuICAgIHsgeDogNTI4LCB5OiAyOTUsIHI6IDI0NCwgZzogMjQyLCBiOiAyNDQgfSxcblxuICAgIC8vIHRpdGxlIHNlbGVjdCB5ZWFyXG4gICAgeyB4OiAyNzcsIHk6IDM4LCByOiAxODIsIGc6IDE4NywgYjogMTkxIH0sXG4gICAgeyB4OiAzMTEsIHk6IDM0LCByOiAyMCwgZzogMjQsIGI6IDI5IH0sXG4gICAgeyB4OiAzNDIsIHk6IDQwLCByOiAyMSwgZzogMjUsIGI6IDMwIH0sXG4gICAgeyB4OiAzNTksIHk6IDQwLCByOiAxNiwgZzogMjYsIGI6IDMzIH0sXG5cbiAgICAvLyB5ZWFyIGJnXG4gICAgeyB4OiAyMzAsIHk6IDEzNiwgcjogNzEsIGc6IDc4LCBiOiA5NCB9LFxuICAgIHsgeDogNDAzLCB5OiAxNTEsIHI6IDcyLCBnOiA3OSwgYjogOTQgfSxcblxuICAgIC8vIHJlc2V0IHllYXIgYnRuIGJnXG4gICAgeyB4OiAzMjgsIHk6IDI5NiwgcjogMSwgZzogODEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDM5MiwgeTogMzAyIH0sXG4gIHsgeDogNTIwLCB5OiA0OSB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0WWVhckJ0bnMgPSB7XG4gIHByZXZZZWFyOiB7IHg6IDE3OCwgeTogMTU2IH0sXG4gIG5leHRZZWFyOiB7IHg6IDQ1NSwgeTogMTU2IH0sXG4gIHN1Ym1pdDogeyB4OiAyODUsIHk6IDMwMyB9LFxufTtcblxuLy8gKiBCYXR0bGVNb2Rlc1xuZXhwb3J0IGNvbnN0IGJhdHRsZU1vZGVQYW5lbCA9IG5ldyBQYWdlKFxuICAnYmF0dGxlTW9kZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDMwMSwgeTogNSwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogMzEzLCB5OiAxMCwgcjogMjI5LCBnOiAyMjUsIGI6IDIyOSB9LFxuICAgIHsgeDogMzI0LCB5OiA3LCByOiA1OCwgZzogOTcsIGI6IDEzMiB9LFxuICAgIHsgeDogMzg4LCB5OiAxMCwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzk2LCB5OiA2LCByOiAyNDIsIGc6IDI0MCwgYjogMjQyIH0sXG4gICAgeyB4OiA0OTIsIHk6IDEwLCByOiAyNDYsIGc6IDIwOCwgYjogNDUgfSxcbiAgICB7IHg6IDQ4NiwgeTogNCwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogNTk4LCB5OiAxMywgcjogMTA0LCBnOiAxMjYsIGI6IDE1MyB9LFxuICAgIHsgeDogNjE2LCB5OiAxMiwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuXG4gICAgLy8gYmcgaW4gYm90dG9tICh0b3Agd2lsbCBzaGluZSlcbiAgICB7IHg6IDksIHk6IDM0NiwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogNjIzLCB5OiAzNDQsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDM5NywgeTogMzQyLCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVsbWV0IHRvIGRpZmYgZ1NlbGVjdExlYWd1ZUdhbWVBbW91bnRcbiAgICB7IHg6IDgsIHk6IDEyMSwgcjogMTE1LCBnOiA0NCwgYjogNDEgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI1LCB5OiAzMTMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDQyLCB5OiAzMjAsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxLCB5OiAzMzMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sIC8vIGJhY2tcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5leHBvcnQgY29uc3QgYmF0dGxlTW9kZVBhbmVsQnRucyA9IHtcbiAgcmFua2VkQmF0dGxlOiB7IHg6IDI4NywgeTogMTYwIH0sXG4gIGZyaWVuZEJhdHRsZTogeyB4OiAyODcsIHk6IDI0NSB9LFxuICBwb3dlclJhbmtpbmc6IHsgeDogNTI2LCB5OiAxNjAgfSwgLy8gdW5zdXJlIHdoYXQgaXNcbiAgcHZwOiB7IHg6IDUyNSwgeTogMjQ1IH0sXG59O1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlUGFuZWwgPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCBpY29uXG4gICAgLy8gc29tZXRpbWVzIG5hdiBiYXIgd2lsbCBkaXNhcHBlYXJcbiAgICAvLyB7IHg6IDMxMiwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIC8vIHsgeDogMzkwLCB5OiAxMiwgcjogMTI3LCBnOiAxMjgsIGI6IDEyNyB9LFxuICAgIC8vIHsgeDogNDkzLCB5OiAxMywgcjogMjA4LCBnOiAxODksIGI6IDUxIH0sXG4gICAgLy8geyB4OiA1OTcsIHk6IDEzLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuXG4gICAgLy8gYmcgaW4gbGVmdFxuICAgIC8vIHsgeDogMjIsIHk6IDY2LCByOiAxODksIGc6IDE5MCwgYjogMTg5IH0sXG4gICAgLy8geyB4OiAxNiwgeTogMTk0LCByOiAyMzAsIGc6IDIyNywgYjogMjMwIH0sXG4gICAgLy8geyB4OiAxOCwgeTogMjYwLCByOiAyNDcsIGc6IDI0MywgYjogMjQ3IH0sXG5cbiAgICAvLyB0ZWFtIHN1cHBvcnQgYmdcbiAgICB7IHg6IDQ4NywgeTogODYsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxNCwgeTogOTUsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcblxuICAgIC8vIGJnIG9mIHdpbi9sb3NlIHJhdGlvIGluIGJvdHRvbSBsZWZ0XG4gICAgeyB4OiAxNDQsIHk6IDI4NiwgcjogNjYsIGc6IDYxLCBiOiA2NiB9LFxuICAgIHsgeDogMzU0LCB5OiAyODYsIHI6IDY2LCBnOiA2OSwgYjogNjYgfSxcblxuICAgIC8vIGJnIG9mIGVxdWlwbWVudCBpbiByaWdodFxuICAgIHsgeDogNDg4LCB5OiAyNDksIHI6IDMzLCBnOiA4NSwgYjogMTU2IH0sXG4gICAgeyB4OiA1NjIsIHk6IDI1MCwgcjogMzMsIGc6IDg1LCBiOiAxNTYgfSxcblxuICAgIC8vIC8vIGVuZXJneSAoYmFsbCkgaW4gYm90dG9tXG4gICAgLy8geyB4OiA0MjQsIHk6IDMyNSwgcjogNTEsIGc6IDU4LCBiOiA1MSB9LFxuICAgIC8vIHsgeDogNDI4LCB5OiAzMjYsIHI6IDI1MywgZzogMjUxLCBiOiAyNTMgfSxcblxuICAgIC8vIGxpbmUgdXAgLCBwb3dlciByYW5raW5nLCBzdGF0cyBidG4gYmdcbiAgICB7IHg6IDgyLCB5OiAzMjgsIHI6IDI1LCBnOiA2OSwgYjogMTE2IH0sXG4gICAgeyB4OiAxNDYsIHk6IDMzMCwgcjogMjUsIGc6IDY1LCBiOiAxMTUgfSxcbiAgICB7IHg6IDI0OCwgeTogMzMwLCByOiAyNSwgZzogNjUsIGI6IDExNSB9LFxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDQyLCB5OiAzMjMsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1NTcsIHk6IDMzMiB9LCAvLyBwbGF5IGJhbGxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVQYW5lbEJ0bnMgPSB7XG4gIGF3YXlHYW1lOiB7IHg6IDE4NSwgeTogNjUgfSxcbiAgaG9tZUdhbWU6IHsgeDogMjkzLCB5OiA2NSB9LFxuICBkaXNhYmxlZFBsYXlCdG46IHsgeDogNTAyLCB5OiAzMTcsIHI6IDkwLCBnOiA3MywgYjogNDkgfSxcbn07XG5cbi8vIGNsaWNrIHJlZnJlc2ggYnRuIGluIHJhbmtlZEJhdHRsZVBhbmVsXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCcsXG4gIFtcbiAgICAvLyB0aXRsZSBhbmQgeFxuICAgIHsgeDogMjA3LCB5OiA1MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1MywgcjogMTI3LCBnOiAxMzEsIGI6IDEzNSB9LFxuICAgIHsgeDogMzYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzk2LCB5OiA1MSwgcjogMzYsIGc6IDQ0LCBiOiA1MiB9LFxuICAgIHsgeDogNTE4LCB5OiA1MCwgcjogMTQ1LCBnOiAxNDYsIGI6IDE0NSB9LFxuXG4gICAgLy8gY291bnQgZG93biBiZ1xuICAgIHsgeDogMTE0LCB5OiAxNTEsIHI6IDI1LCBnOiA4NSwgYjogODIgfSxcbiAgICB7IHg6IDUyMCwgeTogMTU1LCByOiAyNSwgZzogNTMsIGI6IDQ5IH0sXG5cbiAgICAvLyBvdGhlciBiZ1xuICAgIHsgeDogMTA2LCB5OiA5MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA2LCB5OiAzMTEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyNywgeTogMzAwLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MjgsIHk6IDI1NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIzLCB5OiA5OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICBdLFxuICB7IHg6IDUyMCwgeTogNTAgfSwgLy8geFxuICB7IHg6IDUyMCwgeTogNTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJhbmtlZEJhdHRsZVJlc3VsdCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlUmVzdWx0JyxcbiAgW1xuICAgIC8vIGJnIGluIG1pZFxuICAgIHsgeDogMTAsIHk6IDk0LCByOiA1OCwgZzogOTMsIGI6IDE0MCB9LFxuICAgIHsgeDogOCwgeTogMjQ4LCByOiAxNDAsIGc6IDE1OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MjQsIHk6IDk1LCByOiA1OCwgZzogOTQsIGI6IDE0MCB9LFxuICAgIHsgeDogNjIxLCB5OiAyNDYsIHI6IDE0MCwgZzogMTU4LCBiOiAxODEgfSxcbiAgICB7IHg6IDMzNiwgeTogOTgsIHI6IDU4LCBnOiA5NywgYjogMTQwIH0sXG4gICAgeyB4OiAzNDUsIHk6IDI1NSwgcjogMTQ4LCBnOiAxNjIsIGI6IDE4MSB9LFxuXG4gICAgLy8gdGllci8gc2NvcmUgLyByYW5rXG4gICAgeyB4OiA0OSwgeTogMTI3LCByOiAxOTgsIGc6IDIwMywgYjogMjE0IH0sXG4gICAgeyB4OiA1OSwgeTogMTMwLCByOiAxOTYsIGc6IDIwNSwgYjogMjEyIH0sXG4gICAgeyB4OiA3NCwgeTogMTMzLCByOiAyMTYsIGc6IDIyMSwgYjogMjI4IH0sXG4gICAgeyB4OiAxMDEsIHk6IDEzMCwgcjogODUsIGc6IDExNywgYjogMTUzIH0sXG4gICAgeyB4OiAxMjYsIHk6IDEyNiwgcjogMjA3LCBnOiAyMTYsIGI6IDIyNyB9LFxuICAgIHsgeDogMTY4LCB5OiAxMjksIHI6IDIzMywgZzogMjM1LCBiOiAyMzggfSxcbiAgICB7IHg6IDE4OCwgeTogMTMyLCByOiAyMjIsIGc6IDIyOSwgYjogMjMwIH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMjg0LCB5OiAyOTYsIHI6IDgsIGc6IDExOCwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzAsIHk6IDI5NywgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzA2LCByOiA4LCBnOiAxMDEsIGI6IDI0NyB9LFxuICAgIHsgeDogMzE3LCB5OiAyOTcsIHI6IDIyOSwgZzogMjM3LCBiOiAyNTAgfSxcbiAgXSxcbiAgeyB4OiAzMTYsIHk6IDMxMCB9LCAvLyBva1xuICB7IHg6IDMxNiwgeTogMzEwIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVHYW1lSW5mbyA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlR2FtZUluZm8nLFxuICBbXG4gICAgLy8gcmlnaHQgcGFydCBvZiBuYXYgYmFyXG4gICAgeyB4OiA2MTYsIHk6IDEwLCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEzLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNTg5LCB5OiAxNSwgcjogNzUsIGc6IDk0LCBiOiAxMjMgfSxcbiAgICB7IHg6IDU2NywgeTogMTQsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDU3MywgeTogMTUsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDQ3OCwgeTogMjAsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ3MSwgeTogMTEsIHI6IDIwNSwgZzogMjE4LCBiOiAyMzAgfSxcbiAgICB7IHg6IDQ3MywgeTogMTAsIHI6IDIwNiwgZzogMjE5LCBiOiAyMzAgfSxcbiAgICB7IHg6IDM5MywgeTogOCwgcjogMTI5LCBnOiAxMjcsIGI6IDEyOSB9LFxuICAgIHsgeDogMzE5LCB5OiAxNCwgcjogMTk3LCBnOiAxOTgsIGI6IDE5NyB9LFxuXG4gICAgLy8gZ2FtZSBpbmZvIHRpdGxlXG4gICAgeyB4OiAyODQsIHk6IDU4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAyOTgsIHk6IDYyLCByOiAxMTAsIGc6IDExMSwgYjogMTIxIH0sXG4gICAgeyB4OiAzMDcsIHk6IDYzLCByOiAxNjMsIGc6IDE2NiwgYjogMTcxIH0sXG4gICAgeyB4OiAzMjAsIHk6IDYyLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAzMzIsIHk6IDYzLCByOiAyMjEsIGc6IDIyMSwgYjogMjI1IH0sXG4gICAgeyB4OiAzNDgsIHk6IDYwLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAyMDUsIHk6IDYyLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0NzMsIHk6IDY2LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAxNDgsIHk6IDYxLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG5cbiAgICAvLyBwbGF5YmFsbC8gcGxheWluZyBidG5cbiAgICB7IHg6IDQ4NywgeTogMzI4LCByOiAyMTIsIGc6IDE4OCwgYjogMzIgfSxcbiAgICB7IHg6IDYxMCwgeTogMzI1LCByOiAyMTQsIGc6IDE3OSwgYjogMCB9LFxuICAgIHsgeDogNTUyLCB5OiAzMzksIHI6IDE4MSwgZzogMTQyLCBiOiAwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNiwgeTogMzE2LCByOiAyMTQsIGc6IDIxOCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MCwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMywgeTogMzI5LCByOiAyMTEsIGc6IDIxNSwgYjogMjEwIH0sXG5cbiAgICAvLyBiZyBiZXR3ZWVuIGJhY2sgYW5kIHBsYXlcbiAgICB7IHg6IDEzOCwgeTogMzI1LCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gICAgeyB4OiAyMDAsIHk6IDMyOSwgcjogNDksIGc6IDYxLCBiOiA0MSB9LFxuICAgIHsgeDogMjY1LCB5OiAzMzAsIHI6IDUyLCBnOiA2MiwgYjogNDQgfSxcbiAgICB7IHg6IDM0NSwgeTogMzMzLCByOiA2NiwgZzogNzUsIGI6IDU4IH0sXG4gICAgeyB4OiA0MDIsIHk6IDMzNCwgcjogNDksIGc6IDUzLCBiOiAzMyB9LFxuICBdLFxuICB7IHg6IDUxOCwgeTogMzI5IH0sXG4gIHsgeDogMjYsIHk6IDMxNiB9XG4pO1xuXG4vLyBhIHBhZ2UgdG8gc3RhcnQgYXV0byBnYW1lXG5leHBvcnQgY29uc3QgYXV0b0dhbWVDb25maXJtID0gbmV3IFBhZ2UoXG4gICdhdXRvR2FtZUNvbmZpcm0nLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI3NywgeTogNjAsIHI6IDE4MCwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI5NSwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMwOCwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMyOCwgeTogNTgsIHI6IDE3NywgZzogMTgzLCBiOiAxODUgfSxcbiAgICB7IHg6IDM1MywgeTogNjEsIHI6IDE3NywgZzogMTgyLCBiOiAxODUgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMDgsIHk6IDQ5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDcsIHk6IDMxNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE2LCB5OiAzMDIsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ5MSwgeTogMTcxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTAsIHk6IDQ4LCByOiAxNjgsIGc6IDE3MywgYjogMTc2IH0sXG4gICAgeyB4OiA1MTYsIHk6IDU1LCByOiAxMDMsIGc6IDEwNSwgYjogMTA5IH0sXG4gICAgeyB4OiA1MjQsIHk6IDQ4LCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBubyBhbmQgeWVzXG4gICAgeyB4OiAyMjMsIHk6IDI5OCwgcjogNDEsIGc6IDc3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI0OCwgeTogMjk4LCByOiAxNTgsIGc6IDE4MywgYjogMjE0IH0sXG4gICAgeyB4OiAzODgsIHk6IDI5OSwgcjogMTk2LCBnOiAyMjMsIGI6IDI1NSB9LFxuICAgIHsgeDogNDMwLCB5OiAzMDIsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG5cbiAgICAvLyBjb250ZW50IHRvIGRpZmYgd2l0aCBjb25maXJtIGVuZCAoeW91IHNlbGVjdGVkKVxuICAgIHsgeDogMjg2LCB5OiAxODAsIHI6IDgyLCBnOiA4NiwgYjogOTQgfSxcbiAgICB7IHg6IDMwNCwgeTogMTc4LCByOiAxMjAsIGc6IDEyOCwgYjogMTM2IH0sXG4gICAgeyB4OiAzMjQsIHk6IDE3OCwgcjogOTUsIGc6IDEwMywgYjogMTEyIH0sXG4gIF0sXG4gIHsgeDogMzkwLCB5OiAzMDQgfSwgLy8geWVzLCBzdGFydCBhdXRvIHBsYXlcbiAgeyB4OiAyMzcsIHk6IDMwNCB9IC8vIG5vLCBub3Qgc3RhcnQgYXV0byBwbGF5XG4pO1xuXG4vLyBhIHBhZ2UgdG8gZW5kIGF1dG8gZ2FtZVxuZXhwb3J0IGNvbnN0IGF1dG9HYW1lQ29uZmlybUVuZCA9IG5ldyBQYWdlKFxuICAnYXV0b0dhbWVDb25maXJtRW5kJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNzcsIHk6IDYwLCByOiAxODAsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyOTUsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMjgsIHk6IDU4LCByOiAxNzcsIGc6IDE4MywgYjogMTg1IH0sXG4gICAgeyB4OiAzNTMsIHk6IDYxLCByOiAxNzcsIGc6IDE4MiwgYjogMTg1IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTA4LCB5OiA0OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA3LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNiwgeTogMzAyLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0OTEsIHk6IDE3MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTEwLCB5OiA0OCwgcjogMTY4LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogNTE2LCB5OiA1NSwgcjogMTAzLCBnOiAxMDUsIGI6IDEwOSB9LFxuICAgIHsgeDogNTI0LCB5OiA0OCwgcjogNzEsIGc6IDcwLCBiOiA3MSB9LFxuXG4gICAgLy8gbm8gYW5kIHllc1xuICAgIHsgeDogMjIzLCB5OiAyOTgsIHI6IDQxLCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiAyNDgsIHk6IDI5OCwgcjogMTU4LCBnOiAxODMsIGI6IDIxNCB9LFxuICAgIHsgeDogMzg4LCB5OiAyOTksIHI6IDE5NiwgZzogMjIzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzMCwgeTogMzAyLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuXG4gICAgLy8gVE9ETzogdXNlIGVuZCBnYW1lIGNvbnRlbnRcbiAgXSxcbiAgeyB4OiAyMzcsIHk6IDMwNCB9LCAvLyBubywgY29udGludWUgYXV0byBwbGF5XG4gIHsgeDogMzkwLCB5OiAzMDQgfSAvLyB5ZXMsIGVuZCBhdXRvIHBsYXlcbik7XG5cbmV4cG9ydCBjb25zdCByZWNoYXJnZUJhbGxSYW5rTW9kZSA9IG5ldyBQYWdlKFxuICAncmVjaGFyZ2VCYWxsUmFua01vZGUnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDE5MiwgeTogNDksIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDI0MSwgeTogNDksIHI6IDE4MiwgZzogMTgyLCBiOiAxOTEgfSxcbiAgICB7IHg6IDMwMiwgeTogNTgsIHI6IDE2MCwgZzogMTYxLCBiOiAxNjggfSxcbiAgICB7IHg6IDM0NSwgeTogNTksIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDM2MiwgeTogNTksIHI6IDMyLCBnOiAzOCwgYjogNDYgfSxcbiAgICB7IHg6IDQxNSwgeTogNjAsIHI6IDY3LCBnOiA3MiwgYjogODAgfSxcbiAgICB7IHg6IDQzOCwgeTogNTgsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMTUsIHk6IDQ2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDksIHk6IDMwNiwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTIxLCB5OiAzMDUsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNSwgeTogNDQsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcbiAgXSxcbiAgeyB4OiA1MTgsIHk6IDQ5IH0sIC8vIGNhbmNlbFxuICB7IHg6IDUxOCwgeTogNDkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlY2hhcmdlQmFsbExlYWd1ZU1vZGUgPSBuZXcgUGFnZShcbiAgJ3JlY2hhcmdlQmFsbExlYWd1ZU1vZGUnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDIyNCwgeTogNTUsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDI2OCwgeTogNjAsIHI6IDI0LCBnOiAzMiwgYjogMzcgfSxcbiAgICB7IHg6IDMxNiwgeTogNjIsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDM2OCwgeTogNjEsIHI6IDIzLCBnOiAzMSwgYjogNDAgfSxcbiAgICB7IHg6IDQwMSwgeTogNTYsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQ0MCwgeTogNjAsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMTAsIHk6IDUzLCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAxMTQsIHk6IDI5OCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMzE1LCB5OiAzMDcsIHI6IDIzNCwgZzogMjQxLCBiOiAyMzQgfSxcbiAgICB7IHg6IDUyMSwgeTogMzA2LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiA1MTgsIHk6IDUxLCByOiAxOTcsIGc6IDE5OCwgYjogMTk4IH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiA0OSB9LCAvLyBjYW5jZWxcbiAgeyB4OiA1MTgsIHk6IDQ5IH1cbik7XG5cbi8vICogTGVhZ3VlTW9kZXNcbmV4cG9ydCBjb25zdCBsZWFndWVNb2RlUGFuZWwgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVQYW5lbCcsXG4gIFtcbiAgICAvLyBuYXZpIGJhclxuICAgIHsgeDogMzAwLCB5OiAxMiwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogMzE2LCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzMjAsIHk6IDE1LCByOiAxNDQsIGc6IDE0OCwgYjogMTQ5IH0sXG4gICAgeyB4OiAzODgsIHk6IDEwLCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzODUsIHk6IDksIHI6IDY0LCBnOiA2NywgYjogNzEgfSxcbiAgICB7IHg6IDQ5MywgeTogMTEsIHI6IDI0NCwgZzogMjA0LCBiOiAzOSB9LFxuICAgIHsgeDogNTcxLCB5OiAxNCwgcjogMTQ3LCBnOiAxNjEsIGI6IDE3MSB9LFxuICAgIHsgeDogNjA2LCB5OiAxNCwgcjogNzQsIGc6IDkzLCBiOiAxMjMgfSxcbiAgICB7IHg6IDYzMSwgeTogMTUsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcblxuICAgIC8vIGJ0biBpbiBib3R0b21cbiAgICB7IHg6IDg1LCB5OiAzMjYsIHI6IDIzNCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDExMiwgeTogMzI3LCByOiAyMTQsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAxNjMsIHk6IDMyNiwgcjogMjIyLCBnOiAyMjUsIGI6IDIyNyB9LFxuICAgIHsgeDogMTk4LCB5OiAzMjcsIHI6IDgwLCBnOiAxMTcsIGI6IDE1OSB9LFxuICAgIHsgeDogMjUxLCB5OiAzMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI3OCwgeTogMzMwLCByOiAxODksIGc6IDIwNiwgYjogMjE5IH0sXG4gIF0sXG4gIHsgeDogNjE2LCB5OiAzMzYgfSxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVNb2RlR2FtZUluZm8gPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVHYW1lSW5mbycsXG4gIFtcbiAgICB7IHg6IDI5MiwgeTogOSwgcjogMjE0LCBnOiAyMTMsIGI6IDIxNCB9LFxuICAgIHsgeDogMzE0LCB5OiA3LCByOiAyNTUsIGc6IDI1MSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNzksIHk6IDMsIHI6IDIxNCwgZzogMjE1LCBiOiAyMTQgfSxcbiAgICB7IHg6IDM4OSwgeTogMTAsIHI6IDIzOSwgZzogMjM2LCBiOiAyMzkgfSxcbiAgICB7IHg6IDQ4MiwgeTogMywgcjogMjE0LCBnOiAyMTgsIGI6IDIyMCB9LFxuICAgIHsgeDogNDkzLCB5OiA5LCByOiAyNTUsIGc6IDI0NiwgYjogMTkyIH0sXG4gICAgeyB4OiA1ODksIHk6IDExLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNTk2LCB5OiAxMSwgcjogODEsIGc6IDEwNCwgYjogMTMxIH0sXG4gICAgeyB4OiA2MjQsIHk6IDEyLCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG4gICAgeyB4OiAyNiwgeTogMzEyLCByOiAyMDksIGc6IDIxNCwgYjogMjA5IH0sXG4gICAgeyB4OiA2MzEsIHk6IDU2LCByOiAyMDYsIGc6IDIwNywgYjogMjE0IH0sXG4gICAgeyB4OiA2MzEsIHk6IDcwLCByOiAxNjgsIGc6IDE3NywgYjogMTkzIH0sXG4gICAgeyB4OiA2MjMsIHk6IDY0LCByOiAzMywgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI3MCwgeTogMTc5LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiAyNTYsIHk6IDIxNCwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogMjQyLCB5OiAyNDIsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDYxMiwgeTogMjgxLCByOiAyNCwgZzogMzYsIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNTQ2LCB5OiAzMjUgfSwgLy8gcGxheUJhbGxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbi8vIG5vcm1hbCBnYW1lIHBsYXkgc3RhcnRcbmV4cG9ydCBjb25zdCBzZWxlY3RQbGF5Um9sZUJ0bnMgPSB7XG4gIHBsYXlPZmZlbnNlT25seTogeyB4OiAxMjgsIHk6IDI3OSB9LFxuICBwbGF5QWxsOiB7IHg6IDMxNywgeTogMjgyIH0sXG4gIHBsYXlEZWZmZW5zZU9ubHk6IHsgeDogNTA2LCB5OiAyODEgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RQbGF5Um9sZSA9IG5ldyBQYWdlKFxuICAnc2VsZWN0UGxheVJvbGUnLFxuICBbXG4gICAgeyB4OiA5NywgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxNDUsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDk5LCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUzOSwgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NDMsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTYzLCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIHsgeDogOTAsIHk6IDExMCwgcjogMTk0LCBnOiA4MiwgYjogMjQgfSxcbiAgICB7IHg6IDU1MiwgeTogMTEyLCByOiA1NywgZzogMTIwLCBiOiAxOTcgfSxcbiAgXSxcbiAgLy8gVE9ETzogbWFrZSB3aGljaCByb2xlIGNhbiBiZSBzZWxlY3RlZCBpZiBuZWVkXG4gIHNlbGVjdFBsYXlSb2xlQnRucy5wbGF5QWxsLFxuICBzZWxlY3RQbGF5Um9sZUJ0bnMucGxheUFsbFxuKTtcblxuLy8gc29tZXRpbWVzIGhhcHBlbmVkIHdoZW4gcmVzdGFydGluZyBhIGNvbnRpbnVlZCBnYW1lXG4vLyBvciBjYW5jZWwgYXV0byBwbGF5IGR1cmluZyBwbGF5aW5nXG5leHBvcnQgY29uc3QgbGVhZ3VlQ29udGludWVQbGF5aW5nID0gbmV3IFBhZ2UoXG4gICdsZWFndWVDb250aW51ZVBsYXlpbmcnLFxuICBbXG4gICAgLy8gZmFzdCBwcm9ncmVzc2lvblxuICAgIHsgeDogNDUyLCB5OiAyNzksIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sXG4gICAgeyB4OiA0NzYsIHk6IDI3OSwgcjogMjUxLCBnOiAyNTIsIGI6IDI1NSB9LFxuICAgIHsgeDogNTAyLCB5OiAyNzUsIHI6IDE5MCwgZzogMjIwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDUzMCwgeTogMjc5LCByOiAyMTgsIGc6IDIzMywgYjogMjU1IH0sXG4gICAgeyB4OiA1NTIsIHk6IDI3MywgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2MywgeTogMjc2LCByOiAyMzQsIGc6IDI0NCwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzksIHk6IDI3OSwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU4NywgeTogMjczLCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIC8vIGNvbnRpbnVlXG4gICAgeyB4OiA0NTgsIHk6IDMyMCwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ4MCwgeTogMzI0LCByOiAxMjIsIGc6IDE2OCwgYjogMjQ3IH0sXG4gICAgeyB4OiA1MjAsIHk6IDMxNywgcjogODQsIGc6IDE1OSwgYjogMjUwIH0sXG4gICAgeyB4OiA1NDQsIHk6IDMyNCwgcjogMjI2LCBnOiAyMzQsIGI6IDI1MiB9LFxuICAgIHsgeDogNTcyLCB5OiAzMTksIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gICAgeyB4OiA1OTEsIHk6IDMyNSwgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDQ1OCwgeTogMzIwIH0sIC8vIGNvbnRpbnVlIGdhbWVcbiAgeyB4OiA0NTgsIHk6IDMyMCB9IC8vIGNvbnRpbnVlIGdhbWVcbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlBdXRvT2ZmID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlBdXRvT2ZmJyxcbiAgW1xuICAgIC8vIGF1dG9cbiAgICB7IHg6IDUxNCwgeTogMjAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUyNSwgeTogMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICAvLyBjYW1lcmFcbiAgICB7IHg6IDU1NiwgeTogMjEsIHI6IDE4MywgZzogMTg1LCBiOiAxODYgfSxcbiAgICB7IHg6IDU2MCwgeTogMjMsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcbiAgICB7IHg6IDU2OSwgeTogMjEsIHI6IDIwNiwgZzogMjA3LCBiOiAyMDYgfSxcbiAgXSxcbiAgeyB4OiA1MTEsIHk6IDIwIH0sIC8vIHN3aXRjaCB0byBhdXRvIG1vZGVcbiAgeyB4OiA2MTEsIHk6IDIwIH0gLy8gcGF1c2UgYnV0dG9uXG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5QXV0b09mZjEgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheUF1dG9PZmYnLFxuICAvLyBoYXMgc3dpbmcgYnV0dG9uXG4gIFtcbiAgICB7IHg6IDUyMSwgeTogMjYzLCByOiAyNCwgZzogMjksIGI6IDE2IH0sXG4gICAgeyB4OiA1MjAsIHk6IDI1NSwgcjogMjEzLCBnOiAyMTMsIGI6IDIxMiB9LFxuICAgIHsgeDogNTMzLCB5OiAyNTUsIHI6IDIyMywgZzogMjIxLCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNCwgeTogMjQ0LCByOiAxNiwgZzogMjgsIGI6IDE2IH0sXG4gIF0sXG4gIHsgeDogNTExLCB5OiAyMCB9LCAvLyBzd2l0Y2ggdG8gYXV0byBtb2RlXG4gIHsgeDogNjExLCB5OiAyMCB9IC8vIHBhdXNlIGJ1dHRvblxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCA9IG5ldyBHcm91cFBhZ2UoXG4gICdsZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAnLFxuICBbbGVhZ3VlT25QbGF5QXV0b09mZiwgbGVhZ3VlT25QbGF5QXV0b09mZjFdLFxuICBsZWFndWVPblBsYXlBdXRvT2ZmLm5leHQgLyogbmV4dCAqLyxcbiAgbGVhZ3VlT25QbGF5QXV0b09mZi5iYWNrIC8qIGJhY2sgKi9cbik7XG5cbi8vIGF1dG8gcGxheSBvbiwgcG93ZXIgc2F2ZSBvZmZcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmYgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0OTIsIHk6IDE2LCByOiAxMDEsIGc6IDEwMywgYjogMTAxIH0sXG4gICAgeyB4OiA0ODgsIHk6IDIyLCByOiAyMTAsIGc6IDIwOCwgYjogMjEwIH0sXG4gICAgeyB4OiA0ODEsIHk6IDI3LCByOiAxMDIsIGc6IDEwMSwgYjogMTAxIH0sXG4gICAgeyB4OiA0ODksIHk6IDI5LCByOiAxOTcsIGc6IDE5NywgYjogMTk3IH0sXG4gIF0sXG4gIHsgeDogNDg1LCB5OiAyMSB9LCAvLyB0dXJuIG9uIHBvd2VyIHNhdmVcbiAgeyB4OiA1NTIsIHk6IDIxIH0gLy8gdHVybiBvZmYgYXV0byBwbGF5XG4pO1xuXG4vLyBzYW1lIGFzIGdMZWFndWVPblBsYXlQb3dlclNhdmVPZmYsIGJ1dCBpcyBzdG9wcGVkXG4vLyBuZWVkIHRvIHR1cm4gb24gYXV0b3BsYXlcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQb3dlclNhdmVPZmYnLFxuICBbXG4gICAgLy8gYmF0dGVyeVxuICAgIHsgeDogNDg2LCB5OiAxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDkyLCB5OiAxNiwgcjogMTAxLCBnOiAxMDMsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg4LCB5OiAyMiwgcjogMjEwLCBnOiAyMDgsIGI6IDIxMCB9LFxuICAgIHsgeDogNDgxLCB5OiAyNywgcjogMTAyLCBnOiAxMDEsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg5LCB5OiAyOSwgcjogMTk3LCBnOiAxOTcsIGI6IDE5NyB9LFxuXG4gICAgLy8gZGlzYWJsZWQgYXV0b3BsYXkgdGV4dFxuICAgIHsgeDogNTI0LCB5OiAyMywgcjogOTEsIGc6IDExMCwgYjogMTU4IH0sXG4gICAgeyB4OiA1MzAsIHk6IDIwLCByOiAxNDAsIGc6IDE0NiwgYjogMTUyIH0sXG4gICAgeyB4OiA1MzMsIHk6IDI0LCByOiA5MywgZzogMTA2LCBiOiAxNDMgfSxcbiAgICB7IHg6IDU1MCwgeTogMjUsIHI6IDg1LCBnOiAxMDUsIGI6IDE1MyB9LFxuICAgIHsgeDogNTUyLCB5OiAyMSwgcjogMTQ3LCBnOiAxNTMsIGI6IDE1NiB9LFxuICAgIHsgeDogNTU3LCB5OiAyMCwgcjogMTQ4LCBnOiAxNTQsIGI6IDE1NiB9LFxuICAgIHsgeDogNTY2LCB5OiAyNCwgcjogOTksIGc6IDEyMSwgYjogMTczIH0sXG4gICAgeyB4OiA1NzUsIHk6IDE4LCByOiAxMDcsIGc6IDEyMSwgYjogMTczIH0sXG4gICAgeyB4OiA1ODQsIHk6IDE5LCByOiA5NywgZzogMTIyLCBiOiAxNjkgfSxcbiAgICB7IHg6IDU4OSwgeTogMjIsIHI6IDExOCwgZzogMTI3LCBiOiAxNDkgfSxcbiAgICB7IHg6IDU5NSwgeTogMTgsIHI6IDE0MSwgZzogMTUwLCBiOiAxNTYgfSxcbiAgICB7IHg6IDYwNiwgeTogMjMsIHI6IDc0LCBnOiA5MywgYjogMTMyIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LCAvLyB0dXJuIG9uIGF1dG8gcGxheVxuICB7IHg6IDAsIHk6IDAgfSAvLyB0dXJuIG9uIGF1dG8gcGxheVxuKTtcblxuLy8gZG9uJ3QgZG8gYW55IHRoaW5nLCBqdXN0IGF2b2lkIHRvIGVudGVyIHVua25vd25cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZNaWQgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBkaWFsb2cgb25cbiAgICB7IHg6IDYwNCwgeTogNDcsIHI6IDE3MCwgZzogMTcxLCBiOiAxNzAgfSxcbiAgICB7IHg6IDYwNywgeTogNDksIHI6IDI0NiwgZzogMjQ2LCBiOiAyNDYgfSxcbiAgICB7IHg6IDYxMSwgeTogNTQsIHI6IDIxMywgZzogMjEwLCBiOiAyMTMgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZDEgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBkaWFsb2cgb2ZmXG4gICAgeyB4OiA2MDUsIHk6IDUwLCByOiA5NSwgZzogOTksIGI6IDk3IH0sXG4gICAgeyB4OiA2MDIsIHk6IDUxLCByOiAxMDksIGc6IDExNCwgYjogMTE2IH0sXG4gICAgeyB4OiA2MDMsIHk6IDQ5LCByOiAxMzEsIGc6IDEzMywgYjogMTMxIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3VwcyA9IG5ldyBHcm91cFBhZ2UoJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3VwJywgW1xuICBsZWFndWVPblBsYXlQb3dlclNhdmVPZmYsXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZlN0b3BwZWQsXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZCxcbiAgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmTWlkMSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgb25QbGF5UG93ZXJTYXZlT24gPSBuZXcgUGFnZShcbiAgJ29uUGxheVBvd2VyU2F2ZU9uJyxcbiAgW1xuICAgIHsgeDogMzA0LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDYsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA3LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwOCwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG5cbiAgICB7IHg6IDMwMSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDIsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzAzLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNCwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzYsIHk6IDI2LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiAzNiwgeTogMzI2LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA2MTMsIHk6IDMzMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjE4LCB5OiAxMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjAyLCB5OiAyNywgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogMTc0LCB5OiAxNjIsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDQ3NiwgeTogMTU4LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgLy8gc2NvcmUgYmdcbiAgICB7IHg6IDQ5NywgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA0OTgsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNDk5LCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMCwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA1MDEsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNTAyLCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMywgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuLy8gRklYTUU6IGNoYW5nZSBjb2xvcnNcbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheSA9IG5ldyBQYWdlKFxuICAnb25RdWlja1BsYXknLFxuICBbXG4gICAgLy8gYmcgcmlnaHQgcGFuZWxcbiAgICB7IHg6IDQ1NiwgeTogMTEsIHI6IDU4LCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiA2MjMsIHk6IDEwLCByOiA1OCwgZzogNzMsIGI6IDExNSB9LFxuICAgIHsgeDogNDU3LCB5OiAzNDgsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcbiAgICB7IHg6IDYzMiwgeTogMzUwLCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG5cbiAgICAvLyBibHVlIGJ0bjogcGxheSBtYW51YWxseVxuICAgIHsgeDogMjk4LCB5OiAzMjEsIHI6IDMzLCBnOiAxMzEsIGI6IDI1NSB9LFxuICAgIHsgeDogMzExLCB5OiAzMzUsIHI6IDE1OCwgZzogMTkxLCBiOiAyMzUgfSxcbiAgICB7IHg6IDQzMywgeTogMzM0LCByOiA4LCBnOiA1NywgYjogMTIzIH0sXG4gICAgeyB4OiA0MzMsIHk6IDM0OSwgcjogMCwgZzogODEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheTEgPSBuZXcgUGFnZShcbiAgJ29uUXVpY2tQbGF5JywgLy8gc2FtZSBiZWhhdmlvdXIsIHdpdGhvdXQgYmx1ZSBidG4gb24gcmlnaHQgYm90dG9tXG4gIFtcbiAgICAvLyBiZyByaWdodCBwYW5lbFxuICAgIHsgeDogNDU0LCB5OiA4LCByOiA1OCwgZzogNzcsIGI6IDEyMyB9LFxuICAgIHsgeDogNDU1LCB5OiAzNTEsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcbiAgICB7IHg6IDYyOCwgeTogMzQ4LCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG4gICAgeyB4OiA2MjcsIHk6IDksIHI6IDU4LCBnOiA3MywgYjogMTE1IH0sXG5cbiAgICAvLyBkaWZmIGZyb20gb3RoZXIgcGFnZVxuICAgIHsgeDogNDMzLCB5OiAzMjQsIHI6IDg1LCBnOiAxMDcsIGI6IDY4IH0sXG4gICAgeyB4OiA0MzMsIHk6IDMyMCwgcjogODMsIGc6IDEwOSwgYjogNjYgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG4vLyBzb21ldGltZXMgdGhlIHF1aWNrIHBsYXkgd2lsbCBiZSBwYXVzZWRcbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheVBhdXNlID0gbmV3IFBhZ2UoXG4gICdvblF1aWNrUGxheVBhdXNlJyxcbiAgW1xuICAgIHsgeDogNDU2LCB5OiAxMSwgcjogNDksIGc6IDczLCBiOiAxMjMgfSxcbiAgICB7IHg6IDQ3MiwgeTogMjIsIHI6IDIwMSwgZzogMjA3LCBiOiAyMTggfSxcbiAgICB7IHg6IDUzMiwgeTogMjIsIHI6IDgxLCBnOiAxMDAsIGI6IDEyOCB9LFxuICAgIHsgeDogNDUzLCB5OiAzNDcsIHI6IDI0LCBnOiAzNiwgYjogNTcgfSxcbiAgICB7IHg6IDMwNiwgeTogMjc2LCByOiA4LCBnOiAxMTgsIGI6IDI1NSB9LFxuICAgIHsgeDogNDIxLCB5OiAyODMsIHI6IDIsIGc6IDEwNSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzMjUsIHk6IDMzNywgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICAgIHsgeDogNDMwLCB5OiAzMzYsIHI6IDAsIGc6IDk3LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzNzYsIHk6IDMyOSB9LCAvLyBwbGF5IGJhbGwgLy8gVE9ETzogbWlnaHQgbmVlZCB0byBzZXQgaW5uaW5nXG4gIHsgeDogMzc2LCB5OiAzMjkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG9uUXVpY2tQbGF5R3JvdXAgPSBuZXcgR3JvdXBQYWdlKCdvblF1aWNrUGxheScsIFtvblF1aWNrUGxheSwgb25RdWlja1BsYXkxXSwgb25RdWlja1BsYXkubmV4dCAvKiBuZXh0ICovKTtcblxuLy8gd2hlbiBwbGF5aW5nLCBwcmVzcyBiYWNrXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UGF1c2UgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBhdXNlJyxcbiAgW1xuICAgIC8vIGNvbnRpbnVlIGJ1dHRvblxuICAgIHsgeDogODksIHk6IDE0OCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogOTksIHk6IDEzOCwgcjogODIsIGc6IDg5LCBiOiA5OSB9LFxuICAgIC8vIGxlYXZlIGJ1dHRvblxuICAgIHsgeDogNTI3LCB5OiAxNjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU1NSwgeTogMTUzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgLy8gbWxiIGxvZ29cbiAgICB7IHg6IDU1NCwgeTogMjkxLCByOiAwLCBnOiAyOCwgYjogNTcgfSxcbiAgICB7IHg6IDU2MywgeTogMjk0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NjUsIHk6IDI5MCwgcjogMzAsIGc6IDU0LCBiOiA4OCB9LFxuICBdLFxuICB7IHg6IDg5LCB5OiAxNDggfSwgLy8gY29udGludWUgZ2FtZVxuICB7IHg6IDUyNywgeTogMTY1IH0gLy8gbGVhdmVcbik7XG5cbi8vIGNhbm5vdCBnbyB0byBsZWFndWUgbW9kZSBkdWUgdG8gdW5leHBlY3RlZCBlcnJvclxuZXhwb3J0IGNvbnN0IGxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3InLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI3MiwgeTogNjIsIHI6IDE5MywgZzogMTk4LCBiOiAyMDIgfSxcbiAgICB7IHg6IDMxMSwgeTogNTksIHI6IDE2LCBnOiAyMywgYjogMzIgfSxcbiAgICB7IHg6IDMzOCwgeTogNjAsIHI6IDcxLCBnOiA3MiwgYjogODAgfSxcbiAgICB7IHg6IDM5NiwgeTogNjAsIHI6IDE5MiwgZzogMTk4LCBiOiAyMDMgfSxcblxuICAgIC8vIGNvbnRlbnRcbiAgICB7IHg6IDIwNiwgeTogMTM3LCByOiA1OCwgZzogNjcsIGI6IDc4IH0sXG4gICAgeyB4OiAzMzMsIHk6IDE4MCwgcjogMTAwLCBnOiAxMDksIGI6IDExOCB9LFxuICAgIHsgeDogMzY4LCB5OiAyMDMsIHI6IDEzOSwgZzogMTQ1LCBiOiAxNTQgfSxcblxuICAgIC8vIG9rICYgYmdcbiAgICB7IHg6IDMxOSwgeTogMzAxLCByOiAyNCwgZzogMTE3LCBiOiAyMzggfSxcbiAgICB7IHg6IDE2NCwgeTogMzA0LCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG4gICAgeyB4OiA0ODcsIHk6IDMwMywgcjogMjQxLCBnOiAyNDAsIGI6IDI0MSB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXN1bHQgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHQnLFxuICBbXG4gICAgeyB4OiA0NTgsIHk6IDI0LCByOiA0MSwgZzogNDQsIGI6IDQ5IH0sIC8vIHRpdGxlXG4gICAgeyB4OiAxMjYsIHk6IDMzMywgcjogNDksIGc6IDgxLCBiOiAxMjMgfSwgLy8gdmlldyBhbGwgYnRuXG4gICAgeyB4OiAyNDcsIHk6IDMzNSwgcjogNDEsIGc6IDgxLCBiOiAxMTUgfSwgLy8gYm94IHNjb3JlIGJ0blxuICAgIHsgeDogNjA5LCB5OiAzMzUsIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sIC8vIG5leHQgYnRuXG4gIF0sXG4gIHsgeDogNjA5LCB5OiAzMzUgfSxcbiAgeyB4OiA2MDksIHk6IDMzNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdEFxdWlyZWQgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRBcXVpcmVkJyxcbiAgW1xuICAgIHsgeDogNDQ5LCB5OiAyMywgcjogNDEsIGc6IDQ0LCBiOiA0OSB9LCAvLyB0aXRsZVxuICAgIHsgeDogMzksIHk6IDMyOSwgcjogMjEzLCBnOiAyMTgsIGI6IDIxMyB9LCAvLyBiYWNrIGJ0blxuICAgIHsgeDogMTU4LCB5OiAyODcsIHI6IDI0NywgZzogMTI2LCBiOiA1MSB9LCAvLyBwbGF5ZXIgcGFjayBidG5cbiAgICB7IHg6IDYxMiwgeTogMzI4LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LCAvLyBvayBidG5cbiAgXSxcbiAgeyB4OiA2MTIsIHk6IDMyOCB9LFxuICB7IHg6IDYxMiwgeTogMzI4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmVzdWx0T3RoZXIgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRPdGhlcicsXG4gIFtcbiAgICB7IHg6IDcxLCB5OiAyOSwgcjogMCwgZzogODUsIGI6IDE1NiB9LFxuICAgIHsgeDogNTU2LCB5OiAxNSwgcjogMjEyLCBnOiAyMjgsIGI6IDI0MSB9LFxuICAgIHsgeDogNTk1LCB5OiAxMywgcjogMCwgZzogOTMsIGI6IDE4MSB9LFxuICAgIHsgeDogNjEwLCB5OiAxMywgcjogMCwgZzogMjgsIGI6IDU3IH0sXG4gICAgeyB4OiA2MTgsIHk6IDEzLCByOiAxNywgZzogMjYsIGI6IDU4IH0sXG4gICAgeyB4OiA2MjQsIHk6IDgsIHI6IDI0MywgZzogMjQ0LCBiOiAyNDUgfSxcbiAgICB7IHg6IDYyNywgeTogMjQsIHI6IDE2NSwgZzogMTg2LCBiOiAyMDIgfSxcbiAgICB7IHg6IDU3OCwgeTogMjMsIHI6IDcwLCBnOiAxMzIsIGI6IDE4MiB9LFxuICAgIHsgeDogMjQ5LCB5OiA1NiwgcjogODQsIGc6IDEyMSwgYjogMTYxIH0sXG4gICAgeyB4OiAyNjcsIHk6IDU2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTksIHk6IDYwLCByOiAxNjgsIGc6IDE5MSwgYjogMjA4IH0sXG4gICAgeyB4OiAzNzcsIHk6IDU4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyOSwgeTogOTMsIHI6IDAsIGc6IDM2LCBiOiA2NiB9LFxuICAgIHsgeDogNjE3LCB5OiAzMTQsIHI6IDE2LCBnOiAyNCwgYjogMTcgfSxcbiAgICB7IHg6IDEwOCwgeTogMzIyLCByOiA4LCBnOiAyMCwgYjogMTYgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdFdvcmxkQ2hhbXBpb24gPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRXb3JsZENoYW1waW9uJyxcbiAgW1xuICAgIHsgeDogMjUyLCB5OiAyMiwgcjogNTcsIGc6IDY3LCBiOiA3NCB9LFxuICAgIHsgeDogMzIzLCB5OiA0MiwgcjogMTE2LCBnOiAxMDksIGI6IDgzIH0sXG4gICAgeyB4OiAzNTAsIHk6IDczLCByOiA2NiwgZzogOTEsIGI6IDk2IH0sXG4gICAgeyB4OiA0OSwgeTogMzMxLCByOiAxNiwgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAyMDksIHk6IDMyMiwgcjogOCwgZzogMjAsIGI6IDI0IH0sXG4gICAgeyB4OiAyOTQsIHk6IDMyNiwgcjogMjA4LCBnOiAyMDgsIGI6IDIxMiB9LFxuICAgIHsgeDogNDAwLCB5OiAzMjMsIHI6IDE5MiwgZzogMTkwLCBiOiAxOTIgfSxcbiAgICB7IHg6IDQzOSwgeTogMzIzLCByOiA4NSwgZzogOTgsIGI6IDEwMCB9LFxuICAgIHsgeDogNTc4LCB5OiAxOTUsIHI6IDE2LCBnOiAzNiwgYjogNDEgfSxcbiAgICB7IHg6IDMxNiwgeTogMTY3LCByOiAyMTIsIGc6IDIxMCwgYjogMjEyIH0sXG4gICAgeyB4OiAzMzgsIHk6IDE3MywgcjogNjUsIGc6IDcxLCBiOiA3MSB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmV3YXJkID0gbmV3IFBhZ2UoXG4gICdnYW1lUmV3YXJkJyxcbiAgW1xuICAgIHsgeDogMjQsIHk6IDMzNiwgcjogMTYsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogNTc3LCB5OiAyNiwgcjogMCwgZzogNCwgYjogMCB9LFxuICAgIHsgeDogNjAxLCB5OiAzMzUsIHI6IDE2LCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDQxMSwgeTogMjY4LCByOiA4LCBnOiAxMTQsIGI6IDI1NSB9LFxuICAgIHsgeDogNDM0LCB5OiAyNzAsIHI6IDY2LCBnOiAxNDQsIGI6IDI1MiB9LFxuICAgIHsgeDogNDg3LCB5OiAyNzQsIHI6IDAsIGc6IDEwMiwgYjogMjQ3IH0sXG4gICAgeyB4OiA0OTcsIHk6IDEyMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDYxLCB5OiAxOTMsIHI6IDQyLCBnOiA1OCwgYjogNTggfSxcbiAgXSxcbiAgeyB4OiA0MTIsIHk6IDI3MSB9LFxuICB7IHg6IDQxMiwgeTogMjcxIH1cbik7XG5cbmV4cG9ydCBjb25zdCBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzID0gbmV3IFBhZ2UoXG4gICdiZXN0UG9zaXRpb25Bd2FyZEJvbnVzJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNDEsIHk6IDIxLCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI2LCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiAyNiwgeTogMzM1LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA2MjYsIHk6IDMzOSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNCwgeTogMTQ4LCByOiA4LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDYyOCwgeTogMTQwLCByOiAxNiwgZzogMzIsIGI6IDQ5IH0sXG5cbiAgICAvLyB0ZWFtIDEgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDE3MywgeTogMTgsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAxNzYsIHk6IDMwLCByOiAxNTgsIGc6IDE3MywgYjogMTk5IH0sXG4gICAgeyB4OiAxODQsIHk6IDM2LCByOiA4LCBnOiAxMDUsIGI6IDI1NSB9LFxuXG4gICAgLy8gdGVhbSAyIG5vdCBiZWluZyBzZWxlY3RlZFxuICAgIHsgeDogMzI4LCB5OiAyNywgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDMzNywgeTogMzEsIHI6IDE2LCBnOiA0OCwgYjogODIgfSxcbiAgICB7IHg6IDM0MywgeTogMzcsIHI6IDQxLCBnOiA3NywgYjogMTE1IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYmVzdFBvc2l0aW9uQXdhcmRCb251czIgPSBuZXcgUGFnZShcbiAgJ2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE0MSwgeTogMjEsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDYwOSwgeTogMjYsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDI2LCB5OiAzMzUsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDYyNiwgeTogMzM5LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA0LCB5OiAxNDgsIHI6IDgsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogNjI4LCB5OiAxNDAsIHI6IDE2LCBnOiAzMiwgYjogNDkgfSxcblxuICAgIC8vIHRlYW0gMSBub3QgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDE4OSwgeTogMjIsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAxNzgsIHk6IDM0LCByOiA4LCBnOiA0OCwgYjogODIgfSxcbiAgICB7IHg6IDE2OSwgeTogMzksIHI6IDQxLCBnOiA3NywgYjogMTE1IH0sXG5cbiAgICAvLyB0ZWFtIDIgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDM0MywgeTogMjEsIHI6IDIsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzMzcsIHk6IDMxLCByOiAxNjMsIGc6IDE3MCwgYjogMTk3IH0sXG4gICAgeyB4OiAzMzEsIHk6IDQwLCByOiA4LCBnOiA5NywgYjogMjU1IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYmVzdFBvc2l0aW9uQXdhcmRCb251c0dyb3VwID0gbmV3IEdyb3VwUGFnZShcbiAgJ2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMnLFxuICBbYmVzdFBvc2l0aW9uQXdhcmRCb251cywgYmVzdFBvc2l0aW9uQXdhcmRCb251czJdLFxuICBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzLm5leHQgLyogbmV4dCAqL1xuKTtcblxuLy8gbmV4dCBwYWdlIG9mIGdCZXN0UG9zaXRpb25Bd2FyZEJvbnVzXG5leHBvcnQgY29uc3QgYm9udXNHcmFudGVkQnlUZWFtUmVjb3JkID0gbmV3IFBhZ2UoXG4gICdib251c0dyYW50ZWRCeVRlYW1SZWNvcmQnLFxuICBbXG4gICAgLy8gdGFibGUgYmdcbiAgICB7IHg6IDM4LCB5OiA3NSwgcjogNDksIGc6IDY5LCBiOiAxMDcgfSxcbiAgICB7IHg6IDYwMCwgeTogNzMsIHI6IDQ5LCBnOiA2OSwgYjogMTA3IH0sXG4gICAgeyB4OiA2MDEsIHk6IDI4OSwgcjogMCwgZzogOCwgYjogMTYgfSxcbiAgICB7IHg6IDI4LCB5OiAyODUsIHI6IDgsIGc6IDEyLCBiOiAxNiB9LFxuXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDE3NiwgeTogNzYsIHI6IDQ5LCBnOiA2OCwgYjogMTA3IH0sXG4gICAgeyB4OiAyMTcsIHk6IDc3LCByOiAxMjgsIGc6IDEzNiwgYjogMTU5IH0sXG4gICAgeyB4OiAyNTUsIHk6IDc2LCByOiAxMzEsIGc6IDEzNywgYjogMTU3IH0sXG4gICAgeyB4OiAyNzgsIHk6IDc2LCByOiA3OCwgZzogOTUsIGI6IDEyOCB9LFxuICAgIHsgeDogMzI0LCB5OiA3NywgcjogMTEzLCBnOiAxMjIsIGI6IDE1MCB9LFxuICAgIHsgeDogMzYyLCB5OiA3NSwgcjogNDYsIGc6IDY2LCBiOiAxMDQgfSxcbiAgICB7IHg6IDQwNSwgeTogNzcsIHI6IDE3OCwgZzogMTg1LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQyNSwgeTogNzIsIHI6IDE4NCwgZzogMTg3LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQzOSwgeTogNzcsIHI6IDUzLCBnOiA3MCwgYjogMTEwIH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgcG9zdFNlYXNvbkF3YXJkQm9udXMgPSBuZXcgUGFnZShcbiAgJ3Bvc3RTZWFzb25Bd2FyZEJvbnVzJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAzOSwgeTogMjQsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDMyMCwgeTogMTUsIHI6IDAsIGc6IDg1LCBiOiAxNjUgfSxcbiAgICB7IHg6IDYxNSwgeTogMjMsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDExLCB5OiAyNjgsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDYyMSwgeTogMjU4LCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjQsIHk6IDM1MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMTcsIHk6IDMzOCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzE2LCB5OiAzNDIsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzEsIHk6IDMxOCwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2NCwgeTogMzIzLCByOiAyMTgsIGc6IDIzNCwgYjogMjU0IH0sXG4gICAgeyB4OiA1NzcsIHk6IDMyMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjA4LCB5OiAzMTgsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiA2MDYsIHk6IDMzMSwgcjogOCwgZzogMTA1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lTGluZVVwID0gbmV3IFBhZ2UoXG4gICdnYW1lTGluZVVwJyxcbiAgW1xuICAgIC8vIGNvbnRlbnQgdG9wIGJnXG4gICAgeyB4OiA1OTEsIHk6IDU5LCByOiA0OSwgZzogNzMsIGI6IDEwNyB9LFxuICAgIC8vIHByb2dyZXNzIGJnXG4gICAgeyB4OiAxOSwgeTogMjExLCByOiAyNCwgZzogMzIsIGI6IDQ5IH0sXG4gICAgLy8gYmF0dGxlIGxpbmV1cCBidXR0b24gaW4gYm90dG9tXG4gICAgeyB4OiA1MzYsIHk6IDMyMiwgcjogNDEsIGc6IDgxLCBiOiAxMzcgfSxcbiAgICB7IHg6IDU1MywgeTogMzIyLCByOiAxODgsIGc6IDIwOSwgYjogMjI0IH0sXG4gICAgeyB4OiA1NjgsIHk6IDMyMiwgcjogMjA0LCBnOiAyMjAsIGI6IDIzNCB9LFxuICAgIHsgeDogNTg1LCB5OiAzMjQsIHI6IDEwNywgZzogMTM5LCBiOiAxNzcgfSxcbiAgICB7IHg6IDYwNCwgeTogMzI0LCByOiAyNSwgZzogNzMsIGI6IDEzMiB9LFxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI2LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQzLCB5OiAzMjEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDM2LCB5OiAzMjksIHI6IDIxMSwgZzogMjE2LCBiOiAyMTAgfSxcbiAgXSxcbiAgeyB4OiA0MCwgeTogMzI0IH0sXG4gIHsgeDogNDAsIHk6IDMyNCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcGxheWVyR3Jvd3RoQ29tcGxldGUgPSBuZXcgUGFnZShcbiAgJ3BsYXllckdyb3d0aENvbXBsZXRlJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTUsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTQsIHk6IDMwMCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiAzMDEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyMiwgeTogNzQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExMCwgeTogMTY5LCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiAxMTAsIHk6IDIzMCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIyLCB5OiAxNTYsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDUxMywgeTogMjMwLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyBjb250aW51ZVxuICAgIHsgeDogMjQwLCB5OiAzMDAsIHI6IDgsIGc6IDExNCwgYjogMjQ4IH0sXG4gICAgeyB4OiAzMTIsIHk6IDMwMSwgcjogMjIzLCBnOiAyMzMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzM3LCB5OiAzMDYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM5OSwgeTogMzAyLCByOiA4LCBnOiAxMTAsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDMyNSwgeTogMzA0IH0sXG4gIHsgeDogMzI1LCB5OiAzMDQgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUnLFxuICBbXG4gICAgLy8gdGl0bGUgYmcgJiB4XG4gICAgeyB4OiAyMCwgeTogMzQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDIwLCB5OiA2MywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNjAwLCB5OiAzNiwgcjogMjEyLCBnOiAyMDksIGI6IDIxMiB9LFxuICAgIHsgeDogNjExLCB5OiA1NiwgcjogMjIyLCBnOiAyMTgsIGI6IDIyMiB9LFxuICAgIHsgeDogNDQyLCB5OiA2NywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuXG4gICAgLy8gcHJvZ3Jlc3MgYmFyIGJnXG4gICAgeyB4OiAxNiwgeTogNzksIHI6IDAsIGc6IDQ5LCBiOiA5MCB9LFxuICAgIHsgeDogMTgsIHk6IDE5MywgcjogMCwgZzogNDksIGI6IDkwIH0sXG4gICAgeyB4OiA2MTYsIHk6IDE5OSwgcjogMTYsIGc6IDY1LCBiOiAxMTUgfSxcblxuICAgIC8vIGJnIGluIGJvdHRvbVxuICAgIHsgeDogNjE4LCB5OiAyMTUsIHI6IDMzLCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDYxMywgeTogMzI2LCByOiA0MSwgZzogNDUsIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNjAwLCB5OiA0NSB9LFxuICB7IHg6IDYwMCwgeTogNDUgfVxuKTtcbi8vIHJcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGVCb251c1BsYXllciA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyJyxcbiAgW1xuICAgIC8vIHRpdGxlIGFuZCB4XG4gICAgeyB4OiAxNzMsIHk6IDU4LCByOiAxNDcsIGc6IDE1MywgYjogMTU2IH0sXG4gICAgeyB4OiAyMjksIHk6IDU4LCByOiA3OSwgZzogODIsIGI6IDgyIH0sXG4gICAgeyB4OiAzMjAsIHk6IDYwLCByOiAxNjAsIGc6IDE2MywgYjogMTY0IH0sXG4gICAgeyB4OiAzNzMsIHk6IDU1LCByOiAxNzcsIGc6IDE4NCwgYjogMTg1IH0sXG4gICAgeyB4OiA0NDMsIHk6IDYwLCByOiAxMDEsIGc6IDEwNSwgYjogMTEwIH0sXG4gICAgeyB4OiA1MjEsIHk6IDUxLCByOiA2NiwgZzogNjksIGI6IDY2IH0sXG5cbiAgICAvLyBsb2dvIG9uIGNlbnRlclxuICAgIHsgeDogMjkwLCB5OiAxMzIsIHI6IDgsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzI1LCB5OiAxNTAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM1NywgeTogMTMzLCByOiAxODksIGc6IDAsIGI6IDMzIH0sXG5cbiAgICAvLyBuZXh0XG4gICAgeyB4OiAyODEsIHk6IDI5OCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMywgeTogMjk5LCByOiAyMjAsIGc6IDIzNCwgYjogMjUwIH0sXG4gICAgeyB4OiAzNjUsIHk6IDMwNywgcjogOCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMwNywgeTogMzAxLCByOiAyNTAsIGc6IDI1MiwgYjogMjU0IH0sXG4gICAgeyB4OiAzMjksIHk6IDI5NywgcjogMjUyLCBnOiAyNTMsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHBpdGNoZXJPZlRoZU1vbnRoID0gbmV3IFBhZ2UoXG4gICdwaXRjaGVyT2ZUaGVNb250aCcsXG4gIFtcbiAgICB7IHg6IDI3LCB5OiAzOCwgcjogMTgxLCBnOiAxODYsIGI6IDE5OCB9LFxuICAgIHsgeDogNjAyLCB5OiA0NiwgcjogMTU0LCBnOiAxNTIsIGI6IDE1NSB9LFxuICAgIHsgeDogNTM1LCB5OiAzMDksIHI6IDEzOSwgZzogMTg4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNSwgeTogMzE2LCByOiAwLCBnOiA5NywgYjogMjQ3IH0sXG4gICAgeyB4OiAzOTEsIHk6IDMwOSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDU0NSwgeTogMzEwIH0sXG4gIHsgeDogNTQ1LCB5OiAzMTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG12cCA9IG5ldyBQYWdlKFxuICAnbXZwJyxcbiAgW1xuICAgIHsgeDogMjczLCB5OiAyMywgcjogMCwgZzogODksIGI6IDE2NSB9LFxuICAgIHsgeDogMjk3LCB5OiAyNSwgcjogOTAsIGc6IDE0NSwgYjogMjAwIH0sXG4gICAgeyB4OiAzMjAsIHk6IDI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzIsIHk6IDI5LCByOiAxMjYsIGc6IDE2OSwgYjogMjA0IH0sXG4gICAgeyB4OiAzODAsIHk6IDUzLCByOiAwLCBnOiA2NSwgYjogMTIyIH0sXG4gICAgeyB4OiA0OTMsIHk6IDMyMiwgcjogMTYsIGc6IDIwLCBiOiA4IH0sXG4gICAgeyB4OiA1NjgsIHk6IDMyMCwgcjogMzgsIGc6IDEyMCwgYjogMjE4IH0sXG4gICAgeyB4OiA2MzUsIHk6IDM0MSwgcjogOCwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyMCwgeTogMTY0LCByOiAwLCBnOiA4LCBiOiA4IH0sXG4gICAgeyB4OiA5LCB5OiAxNzYsIHI6IDEyLCBnOiAyNCwgYjogMjQgfSxcbiAgXSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9LFxuICB7IHg6IDU2OCwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RSZXdhcmRQbGF5ZXIgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdFJld2FyZFBsYXllcicsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogNCwgeTogNiwgcjogMCwgZzogOTcsIGI6IDE4OSB9LFxuICAgIHsgeDogMTEsIHk6IDM0NiwgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA3LCB5OiAzNTAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIGZvcm0gYmcgaW4gYm90dG9tXG4gICAgeyB4OiA2NSwgeTogMzAxLCByOiA2NiwgZzogNzcsIGI6IDY2IH0sXG4gICAgeyB4OiA2NSwgeTogMzI2LCByOiA0MCwgZzogNDUsIGI6IDMzIH0sXG4gICAgeyB4OiAxNzUsIHk6IDMwMywgcjogNjYsIGc6IDc3LCBiOiA1OCB9LFxuICAgIHsgeDogMTc0LCB5OiAzMjgsIHI6IDQxLCBnOiA0NSwgYjogMzMgfSxcbiAgICB7IHg6IDI3NSwgeTogMzA0LCByOiA2NiwgZzogNzMsIGI6IDU4IH0sXG4gICAgeyB4OiAyNzUsIHk6IDMyNCwgcjogNDEsIGc6IDQ4LCBiOiAzMyB9LFxuICAgIHsgeDogMzg0LCB5OiAzMDEsIHI6IDY2LCBnOiA3MywgYjogNTggfSxcbiAgICB7IHg6IDM4NCwgeTogMzIxLCByOiA0MSwgZzogNDUsIGI6IDMzIH0sXG4gIF0sXG4gIHsgeDogNTY4LCB5OiAzMjAgfSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9XG4pO1xuLy8gVE9ETzogY2hlY2sgdGhlIHBvc2l0aW9uLCBtdXN0IGJlIGJnIG9mICdkaWFtb25kJywgJ29sZCcgLi4uXG4vLyBiZyBvZiB0aGUgd29yZFxuLy8gcmVmOiBodHRwczovL3d3dy5mYWNlYm9vay5jb20vbWxiOWlubmluZ3MvcGhvdG9zLzEzNjY1OTYxMDM3NDg1NzBcbi8vIGxlZnQsIG1pZCBhbmQgcmlnaHQgcmVzcGVjdGl2ZWx5XG5leHBvcnQgY29uc3Qgc2VsZWN0UmV3YXJkUGxheWVyQnRucyA9IFtcbiAgeyB4OiA2NiwgeTogMjE3IH0sXG4gIHsgeDogMjIxLCB5OiAyMTcgfSxcbiAgeyB4OiAzNzcsIHk6IDIxNyB9LFxuXTtcbi8vIG9ubHkgaW5jbHVkZSBiYXNpYyB0eXBlc1xuLy8ge3J9LXtnfS17Yn06IHByb3JpdHlcbi8vIHRyeSB4IDIzLCB5IDI2MCBpbiBwbGF5ZXIgaW5mb1xuZXhwb3J0IGNvbnN0IHBsYXllckNhcmRDb2xvclRvUmFuazogeyBbazogc3RyaW5nXTogbnVtYmVyIH0gPSB7XG4gICc2Ni03NC03NCc6IDEsIC8vIG5vcm1hbCBUT0RPOiB1bmtub3duIGNvbG9yXG4gICc5OS02NS00MSc6IDIsIC8vIGJyb3duXG4gICc5OS02NS00OSc6IDIsIC8vIGJyb3duXG4gICcxMzItMTI5LTE0OCc6IDMsIC8vIHNpbHZlclxuICAnMTg5LTE2Ni00OSc6IDQsIC8vIGdvbGRcbiAgJzE4OS0xNjYtNTgnOiA0LCAvLyBnb2xkXG4gICcxOTgtMTcwLTU3JzogNCwgLy8gZ29sZFxuICAnMTQ4LTEwMS0yNSc6IDQsIC8vIGdvbGRcbiAgJzE2NS0xNjYtOTAnOiA0LCAvLyBnb2xkXG4gICc0MS02OS0xMDcnOiA1LCAvLyBkaWFtb25kIFRPRE86IHVua25vd24gY29sb3Jcbn07XG5cbi8vIGFkUmV3YXJkIHBhZ2VzXG5leHBvcnQgY29uc3QgYWRSZXdhcmQgPSBuZXcgUGFnZShcbiAgJ2FkUmV3YXJkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAyOCwgeTogNDUsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDM2LCB5OiAyNjcsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDMyLCB5OiAzMDcsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDYwNSwgeTogNTIsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDYxMSwgeTogMjQ0LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MDcsIHk6IDMxOSwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuXG4gICAgLy8gd2F0Y2ggYWQgaWNvbiAmIGJ0biBiZ1xuICAgIHsgeDogMzQ0LCB5OiAzMDAsIHI6IDQ5LCBnOiAxNjIsIGI6IDkwIH0sXG4gICAgeyB4OiA0OTAsIHk6IDMxOCwgcjogNDEsIGc6IDE0MiwgYjogODIgfSxcbiAgICB7IHg6IDM2MSwgeTogMzA4LCByOiAwLCBnOiAxNDcsIGI6IDE0MSB9LFxuICAgIHsgeDogMzc1LCB5OiAzMTYsIHI6IDAsIGc6IDExMCwgYjogMTA3IH0sXG5cbiAgICAvLyBjYW5jZWxcbiAgICB7IHg6IDE5MCwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMjA0LCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyMTksIHk6IDMxMCwgcjogMjQyLCBnOiAyNDYsIGI6IDI1MyB9LFxuICAgIHsgeDogMjMyLCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyNDcsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI1OCwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDQwNCwgeTogMzEwIH0sXG4gIHsgeDogMTE3LCB5OiAzMDggfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkUmV3YXJkUmVkZWVtID0gbmV3IFBhZ2UoXG4gICdhZFJld2FyZFJlZGVlbScsXG4gIFtcbiAgICAvLyBhZCByZXdhcmQgdGl0bGVcbiAgICB7IHg6IDI3NCwgeTogNTEsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDMwMiwgeTogNDksIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMzNCwgeTogNTEsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDM1NiwgeTogNTIsIHI6IDkwLCBnOiA5NCwgYjogMTAyIH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMjUsIHk6IDQ2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzNiwgeTogMzA3LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiA2MDEsIHk6IDQyLCByOiAxMjMsIGc6IDExOCwgYjogMTIzIH0sXG4gICAgeyB4OiA1OTEsIHk6IDMxOCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMjEsIHk6IDI3MywgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogMTgsIHk6IDgxLCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MTYsIHk6IDg1LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MDgsIHk6IDI2OSwgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDMwMSwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMzE5LCB5OiAzMDcsIHI6IDE5LCBnOiAxMTcsIGI6IDI0NCB9LFxuICAgIHsgeDogMzQ5LCB5OiAzMDcsIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzAzLCB5OiAzMDQgfSxcbiAgeyB4OiAzMDMsIHk6IDMwNCB9XG4pO1xuXG5leHBvcnQgY29uc3QgYWRSZXdhcmRPbkNEID0gbmV3IFBhZ2UoXG4gICdhZFJld2FyZE9uQ0QnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI0OSwgeTogNTMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI3MCwgeTogNjUsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDMyOSwgeTogNjMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDM2NywgeTogNTYsIHI6IDc5LCBnOiA4NCwgYjogODcgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxNiwgeTogNDgsIHI6IDE0MiwgZzogMTQwLCBiOiAxNDMgfSxcbiAgICB7IHg6IDUyMiwgeTogNTcsIHI6IDE4NiwgZzogMTg1LCBiOiAxODggfSxcbiAgICB7IHg6IDUyMiwgeTogNDUsIHI6IDE4OCwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODIsIHk6IDI5OSwgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNywgeTogMjk3LCByOiAxMTUsIGc6IDE3OCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MTMsIHk6IDMwMywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDUsIHI6IDEsIGc6IDEwNSwgYjogMjQ4IH0sXG4gIF0sXG4gIHsgeDogNTE2LCB5OiA0OCB9LFxuICB7IHg6IDUxNiwgeTogNDggfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkR3JvdXAgPSBuZXcgR3JvdXBQYWdlKCdhZFBhZ2VzJywgW2FkUmV3YXJkLCBhZFJld2FyZFJlZGVlbSwgYWRSZXdhcmRPbkNEXSk7XG5cbi8vIHdlZWtseSBtaXNzaW9uIHBhZ2VzXG5leHBvcnQgY29uc3QgYWNoaXZlbWVudE1pc3Npb24gPSBuZXcgUGFnZShcbiAgJ2FjaGl2ZW1lbnRNaXNzaW9uJyxcbiAgW1xuICAgIC8vIHRvZGF5IG1pc3Npb24gYmdcbiAgICB7IHg6IDIzNSwgeTogNTUsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDIzMSwgeTogNzEsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDU4OCwgeTogNzIsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcblxuICAgIC8vIGxlZnQgc2VjdGlvbiB3b3JsZCByZWNvcmQgYmcgbGVmdCBib3R0b21cbiAgICB7IHg6IDE2LCB5OiAyOTMsIHI6IDI1LCBnOiA0MCwgYjogNzQgfSxcblxuICAgIC8vIHBsYXllciBoZWFkXG4gICAgeyB4OiA3NSwgeTogODgsIHI6IDY2LCBnOiA1OSwgYjogOTAgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDMxLCB5OiAzMTYsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1ODAsIHk6IDI3OCB9LCAvLyBjb21wbGV0ZSB3ZWVrbHkgbWlzc2lvbiBib3hcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94ID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94JyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCAocCwgc3RhciAuLi4pXG4gICAgeyB4OiAyOTksIHk6IDEzLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTgsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMxMywgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzkyLCB5OiA5LCByOiAyMzIsIGc6IDIyOSwgYjogMjMyIH0sXG4gICAgeyB4OiAzODUsIHk6IDIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ5NiwgeTogMTMsIHI6IDIzOCwgZzogMTY2LCBiOiAxNiB9LFxuICAgIHsgeDogNDgzLCB5OiA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE2IH0sXG4gICAgeyB4OiA1OTcsIHk6IDEwLCByOiAyMTMsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0LCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG5cbiAgICAvLyBiZyBvZiB0YWJsZVxuICAgIHsgeDogMTQsIHk6IDgyLCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAxNiwgeTogMjg4LCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTUsIHk6IDEwMCwgcjogMzMsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAyODMsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvb3RlclxuICAgIHsgeDogODAsIHk6IDMwNywgcjogMjAyLCBnOiAyMDEsIGI6IDE5NiB9LFxuICAgIHsgeDogODksIHk6IDMxNSwgcjogNDksIGc6IDYxLCBiOiAzNCB9LFxuICAgIHsgeDogMTAzLCB5OiAzMTksIHI6IDczLCBnOiA4MywgYjogNjYgfSxcbiAgICB7IHg6IDE3MiwgeTogMzM1LCByOiA3OCwgZzogODQsIGI6IDcyIH0sXG4gICAgeyB4OiAyNTAsIHk6IDMzOCwgcjogMTAxLCBnOiAxMDYsIGI6IDkzIH0sXG4gICAgeyB4OiAyNzMsIHk6IDMwNywgcjogMTU5LCBnOiAxNTksIGI6IDE0OSB9LFxuICAgIHsgeDogMjg0LCB5OiAzMDksIHI6IDU2LCBnOiA2MSwgYjogNDAgfSxcblxuICAgIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAyNCwgeTogMzE0LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MiwgeTogMzE3LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMSwgeTogMzMxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LCAvLyBiYWNrIGJ0blxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3hCdG5zID0ge1xuICBvcGVuQm94OiB7IHg6IDQxOCwgeTogMzI1IH0sXG4gIHJlY2VpdmVSZXdhcmQ6IHsgeDogNTYxLCB5OiAzMjYgfSxcbn07XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94Q29uZmlybSA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveENvbmZpcm0nLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMSwgeTogNDIsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNywgeTogMzA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTUsIHk6IDMwMCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE5LCB5OiAxNzcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNDAsIHk6IDU4LCByOiAxNTUsIGc6IDE2MCwgYjogMTYzIH0sXG4gICAgeyB4OiAyNjcsIHk6IDU4LCByOiAxNDEsIGc6IDE0NywgYjogMTQ5IH0sXG4gICAgeyB4OiAzMjUsIHk6IDU5LCByOiAxNjEsIGc6IDE2NywgYjogMTcwIH0sXG4gICAgeyB4OiAzODMsIHk6IDU5LCByOiAxNzEsIGc6IDE3OSwgYjogMTc5IH0sXG4gICAgeyB4OiA0MDcsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTUsIHk6IDQ5LCByOiAxODcsIGc6IDE4NSwgYjogMTg4IH0sXG4gICAgeyB4OiA1MTksIHk6IDU1LCByOiA5MSwgZzogOTEsIGI6IDkyIH0sXG5cbiAgICAvLyBubyAmIHllcyBidG5cbiAgICB7IHg6IDIxMCwgeTogMjkzLCByOiA0MSwgZzogODEsIGI6IDEyMyB9LFxuICAgIHsgeDogMjM4LCB5OiAyOTYsIHI6IDQ1LCBnOiA4MSwgYjogMTI4IH0sXG4gICAgeyB4OiAyODQsIHk6IDI5NCwgcjogNDEsIGc6IDc4LCBiOiAxMjMgfSxcblxuICAgIHsgeDogMzk3LCB5OiAyOTksIHI6IDQwLCBnOiAxMzQsIGI6IDI1MyB9LFxuICAgIHsgeDogNDMzLCB5OiAzMDcsIHI6IDgsIGc6IDk4LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzODcsIHk6IDMwMCB9LCAvLyB5ZXMgYnRuXG4gIHsgeDogMzg3LCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTMsIHk6IDUzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNywgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDk2LCB5OiAyOTksIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMTcsIHk6IDU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyNTksIHk6IDU1LCByOiAxNzcsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiAyOTgsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDEsIHk6IDYwLCByOiAxMjAsIGc6IDEyNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTIsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTgyIH0sXG4gICAgeyB4OiA1MTksIHk6IDUzLCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBvayBidG5cbiAgICB7IHg6IDI4OCwgeTogMjk3LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMDAsIHI6IDEzNiwgZzogMTkwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzAxLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sIC8vIG9rIGJ0blxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG5cbi8vIGdlbmVyYWwgcGFnZXNcbmV4cG9ydCBjb25zdCBwb3dlclNhdmluZyA9IG5ldyBQYWdlKFxuICAncG93ZXJTYXZpbmcnLFxuICBbXG4gICAgeyB4OiAzMDQsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA1LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNiwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDcsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA4LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcblxuICAgIHsgeDogMzAxLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwMiwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDMsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA0LCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAxMzcsIHk6IDE1NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTIxLCB5OiAxNjAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDI5OCwgeTogNTAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDYxOCwgeTogMTAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICAvLyB0byBkaWZmIGZyb20gcG93ZXIgc2F2aW5nIGR1cmluZyBwbGF5aW5nXG4gICAgeyB4OiA0OTcsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNDk4LCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDQ5OSwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDAsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTAxLCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUwMiwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDMsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTU1LCB5OiAyODIsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1NSwgeTogMjkyLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDUsIHk6IDI5MSwgcjogMCwgZzogMCwgYjogMCB9LFxuXG4gICAgLy8gc2NvcmVcbiAgICB7IHg6IDUyMCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjUsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTMwLCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzNSwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDAsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQ1LCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1MCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTI1LCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzMCwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MzUsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQwLCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0NSwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NTAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9tb3Rpb24xID0gbmV3IFBhZ2UoXG4gICdwcm9tb3Rpb24xJyxcbiAgW1xuICAgIHsgeDogNjAzLCB5OiAyNywgcjogMTI0LCBnOiAxMzAsIGI6IDEzMiB9LFxuICAgIHsgeDogNjEyLCB5OiAzMywgcjogNjAsIGc6IDYwLCBiOiA2MCB9LFxuICAgIHsgeDogNjA1LCB5OiA0MCwgcjogMTc0LCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjA1LCB5OiAzNSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjEyLCB5OiAzOSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjE2LCB5OiAzOSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjE1LCB5OiAyOSwgcjogMTQyLCBnOiAxNDQsIGI6IDE0MiB9LFxuICBdLFxuICB7IHg6IDYxMSwgeTogMzYgfSxcbiAgeyB4OiA2MTEsIHk6IDM2IH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9tb3Rpb24yID0gbmV3IFBhZ2UoXG4gICdwcm9tb3Rpb24yJyxcbiAgW1xuICAgIHsgeDogNDMsIHk6IDMxLCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiAzMDYsIHk6IDI5LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiA1NDYsIHk6IDMyLCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiA1NzYsIHk6IDM2LCByOiAxNzMsIGc6IDE3NCwgYjogMTgwIH0sXG4gICAgeyB4OiA1ODAsIHk6IDQwLCByOiAxNzQsIGc6IDE3MiwgYjogMTc1IH0sXG4gICAgeyB4OiA1ODcsIHk6IDM2LCByOiAyMDYsIGc6IDIwNywgYjogMjEzIH0sXG4gICAgeyB4OiA1NzYsIHk6IDQ2LCByOiAyMTMsIGc6IDIxMSwgYjogMjE1IH0sXG4gICAgeyB4OiA1ODQsIHk6IDQ1LCByOiAyMTIsIGc6IDIxMCwgYjogMjEzIH0sXG4gICAgeyB4OiA1OTUsIHk6IDU1LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTc4LCB5OiAzOSB9LFxuICB7IHg6IDU3OCwgeTogMzkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHByb21vdGlvbjMgPSBuZXcgUGFnZShcbiAgJ3Byb21vdGlvbjMnLFxuICBbXG4gICAgeyB4OiA1OTgsIHk6IDM3LCByOiAxMDEsIGc6IDEwMywgYjogMTAyIH0sXG4gICAgeyB4OiA2MDQsIHk6IDQ1LCByOiA3MSwgZzogNzMsIGI6IDcxIH0sXG4gICAgeyB4OiA2MTIsIHk6IDUzLCByOiAxNzQsIGc6IDE3NSwgYjogMTc2IH0sXG4gICAgeyB4OiA2MTcsIHk6IDMzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gIF0sXG4gIHsgeDogNjAxLCB5OiA0MyB9LFxuICB7IHg6IDYwMSwgeTogNDMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlY2hhcmdlUHJvbW90aW9uID0gbmV3IFBhZ2UoXG4gICdyZWNoYXJnZVByb21vdGlvbicsXG4gIFtcbiAgICB7IHg6IDExNCwgeTogNDUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDIyOSwgeTogNTksIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDI4MCwgeTogNjAsIHI6IDM1LCBnOiA0MywgYjogNDggfSxcbiAgICB7IHg6IDM0MCwgeTogNTgsIHI6IDE3NiwgZzogMTgxLCBiOiAxODUgfSxcbiAgICB7IHg6IDQwNywgeTogNjYsIHI6IDM4LCBnOiA0NSwgYjogNDcgfSxcbiAgICB7IHg6IDQ1NiwgeTogODksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyMCwgeTogNTAsIHI6IDY3LCBnOiA2OCwgYjogNjggfSxcbiAgICB7IHg6IDUyNCwgeTogNTgsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyOSwgeTogNDMsIHI6IDE1MSwgZzogMTU1LCBiOiAxNTYgfSxcbiAgICB7IHg6IDE4MCwgeTogMzAyLCByOiA3NSwgZzogMTQ5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE0NCwgeTogMjg5LCByOiA0MSwgZzogMTQyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDExMCwgeTogMzAwLCByOiAyMjIsIGc6IDIyMywgYjogMjIyIH0sXG4gICAgeyB4OiAzMzcsIHk6IDI4OCwgcjogNDEsIGc6IDE0MiwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjYsIHk6IDMwMiwgcjogMjUyLCBnOiAyNTMsIGI6IDI1NCB9LFxuICAgIHsgeDogNDM4LCB5OiAzMDIsIHI6IDI1NSwgZzogMjI2LCBiOiAxMjUgfSxcbiAgICB7IHg6IDUyMiwgeTogMzExLCByOiAyMjIsIGc6IDIyMywgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiA1MyB9LFxuICB7IHg6IDUxOCwgeTogNTMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHRlYW1TdXBwb3J0UGFja2FnZVByb21vdGlvbiA9IG5ldyBQYWdlKFxuICAndGVhbVN1cHBvcnRQYWNrYWdlUHJvbW90aW9uJyxcbiAgW1xuICAgIC8vIGhlYWRlciBiZyBhbmQgeFxuICAgIHsgeDogNTU4LCB5OiAzNywgcjogOTAsIGc6IDE5MCwgYjogMTQ4IH0sXG4gICAgeyB4OiA1NzYsIHk6IDQyLCByOiAxNDgsIGc6IDIwMywgYjogMTczIH0sXG4gICAgeyB4OiA1OTAsIHk6IDQ1LCByOiAxNDUsIGc6IDIwMywgYjogMTcxIH0sXG5cbiAgICAvLyBwdXJjaGFzZSBidXR0b25cbiAgICB7IHg6IDU3NiwgeTogMjc3LCByOiAyNTUsIGc6IDIyMywgYjogMCB9LFxuICAgIHsgeDogNDgwLCB5OiAyNzgsIHI6IDI1NSwgZzogMjEwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDYsIHk6IDI3OCwgcjogMTIwLCBnOiA3NiwgYjogOCB9LFxuICAgIHsgeDogNTIyLCB5OiAyNzQsIHI6IDI0OSwgZzogMjQ1LCBiOiAwIH0sXG4gICAgeyB4OiA1MzgsIHk6IDI3NywgcjogMTI4LCBnOiA4MSwgYjogNyB9LFxuICBdLFxuICB7IHg6IDU4MywgeTogNDUgfSxcbiAgeyB4OiA1ODMsIHk6IDQ1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBlbnRlckdhbWVQcm9tb3Rpb24gPSBuZXcgUGFnZShcbiAgJ2VudGVyR2FtZVByb21vdGlvbicsXG4gIFtcbiAgICAvLyB4XG4gICAgeyB4OiAyNzcsIHk6IDI4MCwgcjogMTEzLCBnOiAxMjQsIGI6IDE0NyB9LFxuXG4gICAgLy8gZG9udCBzaG93IHRoaXMgYWdhaW4gdG9kYXlcbiAgICB7IHg6IDI0MCwgeTogMjgwLCByOiAxMCwgZzogNywgYjogMyB9LFxuICAgIHsgeDogMjA3LCB5OiAyODEsIHI6IDM2LCBnOiAzOSwgYjogNDcgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAyNzksIHk6IDM2LCByOiAzLCBnOiAzLCBiOiAzIH0sXG4gICAgeyB4OiA3NiwgeTogMTY5LCByOiAwLCBnOiAyLCBiOiA1IH0sXG4gICAgeyB4OiAzMjYsIHk6IDMzNywgcjogMywgZzogMywgYjogMiB9LFxuICAgIHsgeDogNTcxLCB5OiAyMTEsIHI6IDIsIGc6IDIsIGI6IDUgfSxcbiAgXSxcbiAgeyB4OiA0ODUsIHk6IDI4MSB9LFxuICB7IHg6IDQ4NSwgeTogMjgxIH1cbik7XG5cbi8vIFRPRE86IGFkZCB0aGlzIHBhZ2Vcbi8vIGV4cG9ydCBjb25zdCBlbnRlckdhbWVQcm9tb3Rpb24gPSBuZXcgUGFnZShcbi8vICAgJ2VudGVyR2FtZVByb21vdGlvbicsXG4vLyAgIFtcblxuLy8gICBdLFxuLy8gICB7IHg6IDU4MywgeTogNDUgfSxcbi8vICAgeyB4OiA1ODMsIHk6IDQ1IH1cbi8vICk7XG5cbi8vIGEgcGFnZSB3aXRoIGEgY2xvc2UgYnRuIGJ1dCB0YWxsZXIgdGhhbiBwcm9tb3Rpb24gcGFnZVxuZXhwb3J0IGNvbnN0IGV2ZW50ID0gbmV3IFBhZ2UoXG4gICdldmVudCcsXG4gIFtcbiAgICB7IHg6IDIwLCB5OiAyMSwgcjogMjUzLCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogNDcsIHk6IDMyLCByOiAxMzIsIGc6IDEzNCwgYjogMTQwIH0sXG4gICAgeyB4OiA0OCwgeTogMjMsIHI6IDI0NiwgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDYwMywgeTogMTksIHI6IDEyNCwgZzogMTMwLCBiOiAxMzIgfSxcbiAgICB7IHg6IDYxMiwgeTogMjIsIHI6IDQ5LCBnOiA1MiwgYjogNDkgfSxcbiAgICB7IHg6IDYyMiwgeTogMjYsIHI6IDE4MSwgZzogMTc4LCBiOiAxODEgfSxcbiAgXSxcbiAgeyB4OiA2MTEsIHk6IDIzIH0sXG4gIHsgeDogNjExLCB5OiAyMyB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmV2aWV3QXBwID0gbmV3IFBhZ2UoXG4gICdyZXZpZXdBcHAnLFxuICBbXG4gICAgeyB4OiAxMDYsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTYsIHk6IDU4LCByOiA4NCwgZzogOTAsIGI6IDkzIH0sXG4gICAgeyB4OiA1MTAsIHk6IDQzLCByOiAxNjgsIGc6IDE3NiwgYjogMTc2IH0sXG4gICAgeyB4OiA1MjUsIHk6IDU3LCByOiAxNDMsIGc6IDE0NCwgYjogMTQ0IH0sXG4gICAgeyB4OiAzMDUsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzMzgsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAxMTQsIHk6IDMwMSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMTUzLCB5OiAyOTcsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAxNzgsIHk6IDI5OSwgcjogMTY4LCBnOiAxOTAsIGI6IDIyNCB9LFxuICAgIHsgeDogMjQxLCB5OiAyOTgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDI4NSwgeTogMzA1LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMzA4LCB5OiAzMDIsIHI6IDc5LCBnOiAxMDgsIGI6IDE0NSB9LFxuICAgIHsgeDogMzY1LCB5OiAzMDIsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQyMSwgeTogMjk5LCByOiA4LCBnOiAxMTQsIGI6IDI1NSB9LFxuICAgIHsgeDogNDM4LCB5OiAyOTksIHI6IDQ3LCBnOiAxMzgsIGI6IDI1NCB9LFxuICAgIHsgeDogNDg5LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gICAgeyB4OiA1MjgsIHk6IDMwNSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDE2MSwgeTogMjkyIH0sXG4gIHsgeDogMTYxLCB5OiAyOTIgfVxuKTtcblxuLy8gcGFnZSBoYXMgb2sgYnV0dG9uXG5leHBvcnQgY29uc3Qgb2sgPSBuZXcgUGFnZShcbiAgJ29rJyxcbiAgW1xuICAgIHsgeDogMjc5LCB5OiAzMDAsIHI6IDAsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiAzMTAsIHk6IDMwMSwgcjogMTM2LCBnOiAxODgsIGI6IDI1NCB9LFxuICAgIHsgeDogMzI2LCB5OiAzMDEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2MiwgeTogMzAwLCByOiAwLCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzY5LCB5OiAzMTIsIHI6IDgsIGc6IDEwMSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzE5LCB5OiAzMDMgfSxcbiAgeyB4OiAzMTksIHk6IDMwMyB9XG4pO1xuXG4vLyBwYWdlIGhhcyBuZXh0IGJ1dHRvblxuZXhwb3J0IGNvbnN0IG5leHQgPSBuZXcgUGFnZShcbiAgJ25leHQnLFxuICBbXG4gICAgeyB4OiAyNzMsIHk6IDMwNCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwNSwgeTogMzA3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTQsIHk6IDMxNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIxLCB5OiAzMDUsIHI6IDIyNCwgZzogMjM2LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyOCwgeTogMzEwLCByOiAxLCBnOiAxMDYsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMzLCB5OiAyOTksIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNzQsIHk6IDMwNSwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4MCwgeTogMzE5LCByOiAwLCBnOiA4OSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyNjUsIHk6IDMxOCwgcjogMCwgZzogODksIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDM0NiwgeTogMzA3IH0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG5leHQyID0gbmV3IFBhZ2UoXG4gICduZXh0JyxcbiAgW1xuICAgIHsgeDogMjI2LCB5OiAyOTYsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDI3NSwgeTogMjk2LCByOiA4LCBnOiAxMjEsIGI6IDI1NSB9LFxuICAgIHsgeDogMzA2LCB5OiAyOTksIHI6IDI1NCwgZzogMjU0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNCwgeTogMzAzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjEsIHk6IDI5OSwgcjogMjAxLCBnOiAyMjMsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMxLCB5OiAyOTksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzEwLCByOiAwLCBnOiA5NCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfSxcbiAgeyB4OiAzNDYsIHk6IDMwNyB9XG4pO1xuXG4vLyBub24tc3BlY2lmaWMgY29uZmlybSBwYWdlIHdpdGggbm8gYW5kIHllcyBidG5cbmV4cG9ydCBjb25zdCBjb25maXJtV2l0aFlTID0gbmV3IFBhZ2UoXG4gICdjb25maXJtV2l0aFlTJyxcbiAgW1xuICAgIC8vIHggb24gcmlnaHQgdG9wXG4gICAgeyB4OiA1MTMsIHk6IDQ2LCByOiAxODIsIGc6IDE4NiwgYjogMTg4IH0sXG4gICAgeyB4OiA1MjAsIHk6IDUyLCByOiA3MCwgZzogNjksIGI6IDcwIH0sXG4gICAgeyB4OiA1MjcsIHk6IDQ1LCByOiA2NywgZzogNjgsIGI6IDcwIH0sXG4gICAgeyB4OiA1MzEsIHk6IDU0LCByOiAxNzQsIGc6IDE3NSwgYjogMTc2IH0sXG4gICAgeyB4OiA1MTEsIHk6IDUxLCByOiAxNzgsIGc6IDE4MCwgYjogMTg2IH0sXG5cbiAgICAvLyBubyBidG5cbiAgICB7IHg6IDIxMiwgeTogMzAxLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjQ5LCB5OiAzMDAsIHI6IDEyNSwgZzogMTUyLCBiOiAxODggfSxcbiAgICB7IHg6IDI3OCwgeTogMzA3LCByOiA0OSwgZzogODEsIGI6IDEyMyB9LFxuXG4gICAgLy8geWVzIGJ0blxuICAgIHsgeDogMzYzLCB5OiAyOTQsIHI6IDgsIGc6IDEyMiwgYjogMjU1IH0sXG4gICAgeyB4OiAzODQsIHk6IDI5NywgcjogMjQ0LCBnOiAyNDgsIGI6IDI1NSB9LFxuICAgIHsgeDogNDE5LCB5OiAzMDcsIHI6IDAsIGc6IDEwMSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzOTUsIHk6IDI5NCwgcjogOCwgZzogMTIyLCBiOiAyNTUgfSxcblxuICAgIC8vIGZvb3RlciBiZ1xuICAgIHsgeDogMTQyLCB5OiAzMDQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUzMCwgeTogMjk2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTIwLCB5OiA1NiB9LCAvLyB4IGJ0blxuICB7IHg6IDUyMCwgeTogNTYgfVxuKTtcblxuLy8gbmVlZCB0byB1cGRhdGUgYXBrIHZlclxuZXhwb3J0IGNvbnN0IGVycm9yTmV3VXBkYXRlQXZhaWxhYmxlID0gbmV3IFBhZ2UoXG4gICdlcnJvck5ld1VwZGF0ZUF2YWlsYWJsZScsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjA4LCB5OiA0NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjM2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMjYwLCB5OiA1OCwgcjogMTI1LCBnOiAxMjksIGI6IDEzMyB9LFxuICAgIHsgeDogMjcyLCB5OiA1NywgcjogMTI4LCBnOiAxMzYsIGI6IDE0MCB9LFxuICAgIHsgeDogMzEzLCB5OiA1NiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzM1LCB5OiA1NiwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzYzLCB5OiA2MCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzgxLCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzg4LCB5OiA2MywgcjogMTI2LCBnOiAxMzEsIGI6IDEzNCB9LFxuICAgIHsgeDogMzk3LCB5OiA2MywgcjogNTcsIGc6IDY0LCBiOiA3MCB9LFxuICAgIHsgeDogNDA3LCB5OiA1NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNDE5LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIC8vIG5ldyB1cGRhdGUgaW4gY29udGVudCAoMTA0KVxuICAgIHsgeDogMjI3LCB5OiAxMzksIHI6IDE3NiwgZzogMTc4LCBiOiAxODQgfSxcbiAgICB7IHg6IDI4OSwgeTogMTQ0LCByOiAxMTcsIGc6IDEyMSwgYjogMTIxIH0sXG4gICAgeyB4OiAyNjAsIHk6IDE0NCwgcjogMTA4LCBnOiAxMTAsIGI6IDEwOCB9LFxuICAgIHsgeDogMzA5LCB5OiAxNDQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMyNiwgeTogMTQyLCByOiA4NywgZzogOTEsIGI6IDkwIH0sXG4gICAgeyB4OiAzNDMsIHk6IDE0MywgcjogODMsIGc6IDg4LCBiOiA4OCB9LFxuICAgIHsgeDogMzc2LCB5OiAxNDQsIHI6IDY5LCBnOiA3MSwgYjogNjkgfSxcbiAgICB7IHg6IDM5NSwgeTogMTQ0LCByOiA2OCwgZzogNzIsIGI6IDcxIH0sXG4gICAgeyB4OiA0MDksIHk6IDE0NCwgcjogMTIyLCBnOiAxMjMsIGI6IDEyNSB9LFxuICAgIHsgeDogNDIxLCB5OiAxNDQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODUsIHk6IDI5NywgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxMiwgeTogMjk0LCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAyOTksIHI6IDEzNSwgZzogMTg4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzA3LCByOiAwLCBnOiAxMDIsIGI6IDI0NyB9LFxuXG4gICAgLy8gcG9wdXAgYmcgYW5kIHhcbiAgICB7IHg6IDExNywgeTogNDYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUxMiwgeTogNDYsIHI6IDE4OCwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyNCwgeTogNTcsIHI6IDE4OSwgZzogMTg5LCBiOiAxODkgfSxcbiAgICB7IHg6IDE1NywgeTogMjMyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMDksIHk6IDI5NiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDIzLCB5OiAzMDQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ0MywgeTogMjI3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gIF0sXG4gIC8vIFRPRE86IGNoZWNrIHdoZXRoZXIgbmVlZCB0byBwcmVzcyBva1xuICB7IHg6IDMxNCwgeTogMjk5IH0sXG4gIHsgeDogMzE0LCB5OiAyOTkgfVxuKTtcblxuLy8gZm9yIHNvbWUgc2l0dWF0aW9uLCB1bmV4cGVjdGVkRXJyb3IgaGFwcGVuc1xuLy8gdGhpcyBhbHNvIGluY2x1ZGVzIG5ldHdvcmsgZXJyb3JcbmV4cG9ydCBjb25zdCB1bmV4cGVjdGVkRXJyb3IgPSBuZXcgUGFnZShcbiAgJ3VuZXhwZWN0ZWRFcnJvcicsXG4gIFtcbiAgICB7IHg6IDMyMywgeTogMzksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUxNCwgeTogNDQsIHI6IDgwLCBnOiA4MSwgYjogODEgfSxcbiAgICB7IHg6IDUyNCwgeTogNDgsIHI6IDY0LCBnOiA3MCwgYjogNzEgfSxcbiAgICB7IHg6IDUxOCwgeTogNTQsIHI6IDY1LCBnOiA3MSwgYjogNzEgfSxcbiAgICB7IHg6IDMxNSwgeTogMjY5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTUsIHk6IDI5MywgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNiwgeTogMjk5LCByOiAyNDEsIGc6IDI0NywgYjogMjU1IH0sXG4gICAgeyB4OiAzMTcsIHk6IDMxMCwgcjogMCwgZzogOTIsIGI6IDI0NSB9LFxuICAgIHsgeDogMzE3LCB5OiAzMTMsIHI6IDAsIGc6IDg1LCBiOiAyNDAgfSxcbiAgICB7IHg6IDMxNywgeTogMzIzLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogMzE0LCB5OiAyOTkgfSxcbiAgeyB4OiAzMTQsIHk6IDI5OSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYXBwSXNOb3RSZXNwb25kaW5nID0gbmV3IFBhZ2UoXG4gICdhcHBJc05vdFJlc3BvbmRpbmcnLFxuICBbXG4gICAgeyB4OiAxNjQsIHk6IDE1NCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTg5LCB5OiAxNTcsIHI6IDIwMywgZzogMjAzLCBiOiAyMDMgfSxcbiAgICB7IHg6IDIyMywgeTogMTU4LCByOiAxNzEsIGc6IDE3MSwgYjogMTcxIH0sXG4gICAgeyB4OiAyNTQsIHk6IDE1OCwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogMjczLCB5OiAxNTcsIHI6IDk2LCBnOiA5NiwgYjogOTYgfSxcbiAgICB7IHg6IDMwMiwgeTogMTU3LCByOiA1NCwgZzogNTQsIGI6IDU0IH0sXG4gICAgeyB4OiAxNjgsIHk6IDE4NSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjA1LCB5OiAxOTAsIHI6IDExOSwgZzogMTE5LCBiOiAxMTkgfSxcbiAgICB7IHg6IDIxOCwgeTogMTg0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyMzAsIHk6IDE4NiwgcjogODUsIGc6IDg1LCBiOiA4NSB9LFxuICAgIHsgeDogMTcwLCB5OiAyMTEsIHI6IDEyNywgZzogMjAyLCBiOiAxOTUgfSxcbiAgICB7IHg6IDIxMCwgeTogMjEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxOTksIHk6IDIxMywgcjogMTExLCBnOiAxMTEsIGI6IDExMSB9LFxuICAgIHsgeDogNDY2LCB5OiAxNjYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ2OSwgeTogMjE4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMjIwLCB5OiAxODYgfSwgLy8gY2xvc2UgYXBwXG4gIHsgeDogMjIwLCB5OiAxODYgfVxuKTtcblxuLy8gd2l0aCBtb3JlIGdhbWVzIGJ1dHRvblxuZXhwb3J0IGNvbnN0IHF1aXRBcHAgPSBuZXcgUGFnZShcbiAgJ3F1aXRBcHAnLFxuICBbXG4gICAgeyB4OiAyNzksIHk6IDU0LCByOiAxNzAsIGc6IDE3MywgYjogMTc4IH0sXG4gICAgeyB4OiAzMjQsIHk6IDYwLCByOiAyMCwgZzogMjcsIGI6IDI4IH0sXG4gICAgeyB4OiA1MTQsIHk6IDUwLCByOiAxODEsIGc6IDE4MiwgYjogMTgyIH0sXG4gICAgeyB4OiA0NjYsIHk6IDI5NSwgcjogOCwgZzogMTIxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQxNCwgeTogMjk4LCByOiA5NCwgZzogMTU3LCBiOiAyMzMgfSxcbiAgICB7IHg6IDQ5NiwgeTogMzEyLCByOiAwLCBnOiA5MCwgYjogMjQ3IH0sXG4gICAgeyB4OiA1MjMsIHk6IDMwOSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMTExLCB5OiAyOTcsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDMwNywgeTogNjAsIHI6IDEzMywgZzogMTM3LCBiOiAxNDEgfSxcbiAgICB7IHg6IDMxNSwgeTogNjEsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMyNCwgeTogNjEsIHI6IDUyLCBnOiA1NiwgYjogNjEgfSxcbiAgXSxcbiAgeyB4OiAzMDAsIHk6IDMwMyB9LCAvLyBub3QgdG8gcXVpdFxuICB7IHg6IDMwMCwgeTogMzAzIH1cbik7XG5cbmV4cG9ydCBjb25zdCBxdWl0QXBwMSA9IG5ldyBQYWdlKFxuICAncXVpdEFwcDEnLFxuICBbXG4gICAgeyB4OiAyNjIsIHk6IDU2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMDAsIHk6IDU0LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzMjMsIHk6IDU1LCByOiAyNCwgZzogMzAsIGI6IDMyIH0sXG4gICAgeyB4OiA1MTEsIHk6IDUwLCByOiAxNzgsIGc6IDE4MCwgYjogMTg2IH0sXG4gICAgeyB4OiA1MjIsIHk6IDU0LCByOiAxNDEsIGc6IDEzOSwgYjogMTQxIH0sXG4gICAgeyB4OiA1MjIsIHk6IDU0LCByOiAxNDEsIGc6IDEzOSwgYjogMTQxIH0sXG4gICAgeyB4OiAxNjcsIHk6IDI5OSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjQzLCB5OiAyOTUsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAzMTgsIHk6IDI5OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzgyLCB5OiAyOTcsIHI6IDgzLCBnOiAxNTgsIGI6IDI1NSB9LFxuICAgIHsgeDogNTAzLCB5OiAzMDEsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQzMywgeTogMzEwLCByOiAwLCBnOiA5NCwgYjogMjQ3IH0sXG4gICAgeyB4OiA0MDQsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDIxMywgeTogMzA3LCByOiA0OSwgZzogODEsIGI6IDEyMyB9LFxuICBdLFxuICB7IHg6IDIxMywgeTogMzA3IH0sIC8vIG5vdCB0byBxdWl0XG4gIHsgeDogMjEzLCB5OiAzMDcgfVxuKTtcbiIsImV4cG9ydCBlbnVtIFRBU0sge1xuICByZXN0YXJ0QXBwUGVyRGF5ID0gJ3Jlc3RhcnRBcHBQZXJEYXknLFxuICBzZXR0aW5nRGVmYXVsdCA9ICdzZXR0aW5nRGVmYXVsdCcsXG4gIHNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzID0gJ3NldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzJyxcbiAgcGxheUxlYWd1ZUdhbWUgPSAncGxheUxlYWd1ZUdhbWUnLFxuICBwbGF5QmF0dGxlR2FtZSA9ICdwbGF5QmF0dGxlR2FtZScsXG4gIGFkUmV3YXJkID0gJ2FkUmV3YXJkJyxcbiAgd2Vla2x5TWlzc2lvbiA9ICd3ZWVrbHlNaXNzaW9uJyxcbiAgcmVjaWV2ZUluYm94ID0gJ3JlY2lldmVJbmJveCcsXG4gIHN0YXlJbkxvZ2luID0gJ3N0YXlJbkxvZ2luJyxcbiAgdXBsb2FkQ2FjaGUgPSAndXBsb2FkQ2FjaGUnLFxuICBzZW5kQWxpdmVFdmVudCA9ICdzZW5kQWxpdmVFdmVudCcsXG4gIHNlbmRXYWl0RXZlbnQgPSAnc2VuZFdhaXRFdmVudCcsXG59XG5cbmV4cG9ydCAqIGFzIHdlZWtseU1pc3Npb24gZnJvbSAnLi93ZWVrbHlNaXNzaW9uJztcbiIsImltcG9ydCB7IFV0aWxzLCBQYWdlIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0IHsgc3RhdGUsIHJlcm91dGVyIH0gZnJvbSAnLi4vbW9kdWxlcyc7XG5cbmltcG9ydCB7IFRBU0sgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNTYW1lQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYXNrKCkge1xuICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICBuYW1lOiBUQVNLLndlZWtseU1pc3Npb24sXG4gICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5kYXlJbk1zLFxuICAgIG1heFRhc2tEdXJpbmc6IDMwICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgZm9yY2VTdG9wOiB0cnVlLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJvdXRlcygpIHtcbiAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgIHBhdGg6IGAvJHthY2hpZXZlbWVudE1pc3Npb24ubmFtZX1gLFxuICAgIG1hdGNoOiBhY2hpZXZlbWVudE1pc3Npb24sXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UpID0+IHtcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLndlZWtseU1pc3Npb24pIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGNvbGxlY3QgZGFpbHkgb25lIGlmIGF2YWlsYWJsZVxuICAgICAgY29uc3QgeCA9IDYxMztcbiAgICAgIGNvbnN0IGNhbkNvbGxlY3RDb2xvciA9IHsgcjogOCwgZzogMTI1LCBiOiAyNTUgfTtcbiAgICAgIGZvciAobGV0IHkgPSAxMjg7IHkgPCAyNjA7IHkgKz0gNDQpIHtcbiAgICAgICAgY29uc3QgY2FuQ29sbGVjdCA9IGlzU2FtZUNvbG9yKGltYWdlLCB7IHgsIHksIC4uLmNhbkNvbGxlY3RDb2xvciB9KTtcbiAgICAgICAgaWYgKGNhbkNvbGxlY3QpIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeCwgeSB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY29sbGVjdCcpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVyb3V0ZXIuZ29OZXh0KGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgfSxcbiAgfSk7XG4gIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICBwYXRoOiBgLyR7d2Vla2x5TWlzc2lvbkJveC5uYW1lfWAsXG4gICAgbWF0Y2g6IHdlZWtseU1pc3Npb25Cb3gsXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICBzdGF0ZS5jaGVja1VwbG9hZFNlc3Npb24oKTtcbiAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy53ZWVrbHlNaXNzaW9uKSB7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayh3ZWVrbHlNaXNzaW9uQm94KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW5Db2xsZWN0Q29sb3IgPSB7IHI6IDE4OSwgZzogMTk0LCBiOiAxOTcgfTtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFsyNywgMTE1XTtcbiAgICAgIGNvbnN0IFt3LCBoXSA9IFsxOTgsIDc1XTtcbiAgICAgIC8vIGNsaWNrIG9wZW5Cb3ggb25seSB3aGVuIGFsbCBtaXNzaW9uIGlzIGNvbXBsZXRlXG4gICAgICAvLyBiYyBpdCBpcyBhYmxlZCBvbmNlIGEgd2Vla1xuICAgICAgZm9yICh2YXIgZHggPSAwOyBkeCA8IDMgKiB3OyBkeCArPSB3KSB7XG4gICAgICAgIGZvciAodmFyIGR5ID0gMDsgZHkgPCAzICogaDsgZHkgKz0gaCkge1xuICAgICAgICAgIGNvbnN0IGNhbkNvbGxlY3QgPSBpc1NhbWVDb2xvcihpbWFnZSwgeyB4OiB4ICsgZHgsIHk6IHkgKyBkeSwgLi4uY2FuQ29sbGVjdENvbG9yIH0pO1xuICAgICAgICAgIGlmICghY2FuQ29sbGVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhaXQgYWxsIHdlZWtseSBtaXNzaW9uIGNvbXBsZXRlJyk7XG4gICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnY2xpY2sgb3BlbicpO1xuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh3ZWVrbHlNaXNzaW9uQm94QnRucy5vcGVuQm94KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIC8vIFRPRE86IGxldCB1c2VyIHNlbGVjdCB0aGUgaXRlbSB0aGV5IHdhbnQgaW4gdGhlIGZ1dHVyZVxuICAgICAgLy8gc2VsZWN0IHRoZSBsZWZ0IGJvdHRvbSBvbmVcbiAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgcmlnaHQgYm90dG9tIGl0ZW0nKTtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiB4ICsgMiAqIHcsIHk6IHkgKyAyICogaCB9KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlIHJpZ2h0IGJvdHRvbSBpdGVtJyk7XG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKHdlZWtseU1pc3Npb25Cb3hCdG5zLnJlY2VpdmVSZXdhcmQpO1xuXG4gICAgICAvLyBlbnRlciByZWNlaXZlIGNvbmZpcm0gcGFnZVxuICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICB9LFxuICB9KTtcblxuICBbd2Vla2x5TWlzc2lvbkJveENvbmZpcm0sIHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZF0uZm9yRWFjaChwID0+IHtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICBtYXRjaDogcCxcbiAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgfSk7XG4gIH0pO1xufVxuXG5jb25zdCBhY2hpZXZlbWVudE1pc3Npb24gPSBuZXcgUGFnZShcbiAgJ2FjaGlldmVtZW50TWlzc2lvbicsXG4gIFtcbiAgICAvLyB0b2RheSBtaXNzaW9uIGJnXG4gICAgeyB4OiAyMzUsIHk6IDU1LCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiAyMzEsIHk6IDcxLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiA1ODgsIHk6IDcyLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG5cbiAgICAvLyBsZWZ0IHNlY3Rpb24gd29ybGQgcmVjb3JkIGJnIGxlZnQgYm90dG9tXG4gICAgeyB4OiAxNiwgeTogMjkzLCByOiAyNSwgZzogNDAsIGI6IDc0IH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVhZFxuICAgIHsgeDogNzUsIHk6IDg4LCByOiA2NiwgZzogNTksIGI6IDkwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAzMSwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNTgwLCB5OiAyNzggfSwgLy8gY29tcGxldGUgd2Vla2x5IG1pc3Npb24gYm94XG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5jb25zdCB3ZWVrbHlNaXNzaW9uQm94ID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94JyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCAocCwgc3RhciAuLi4pXG4gICAgeyB4OiAyOTksIHk6IDEzLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTgsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMxMywgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzkyLCB5OiA5LCByOiAyMzIsIGc6IDIyOSwgYjogMjMyIH0sXG4gICAgeyB4OiAzODUsIHk6IDIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ5NiwgeTogMTMsIHI6IDIzOCwgZzogMTY2LCBiOiAxNiB9LFxuICAgIHsgeDogNDgzLCB5OiA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE2IH0sXG4gICAgeyB4OiA1OTcsIHk6IDEwLCByOiAyMTMsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0LCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG5cbiAgICAvLyBiZyBvZiB0YWJsZVxuICAgIHsgeDogMTQsIHk6IDgyLCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAxNiwgeTogMjg4LCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTUsIHk6IDEwMCwgcjogMzMsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAyODMsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvb3RlclxuICAgIHsgeDogODAsIHk6IDMwNywgcjogMjAyLCBnOiAyMDEsIGI6IDE5NiB9LFxuICAgIHsgeDogODksIHk6IDMxNSwgcjogNDksIGc6IDYxLCBiOiAzNCB9LFxuICAgIHsgeDogMTAzLCB5OiAzMTksIHI6IDczLCBnOiA4MywgYjogNjYgfSxcbiAgICB7IHg6IDE3MiwgeTogMzM1LCByOiA3OCwgZzogODQsIGI6IDcyIH0sXG4gICAgeyB4OiAyNTAsIHk6IDMzOCwgcjogMTAxLCBnOiAxMDYsIGI6IDkzIH0sXG4gICAgeyB4OiAyNzMsIHk6IDMwNywgcjogMTU5LCBnOiAxNTksIGI6IDE0OSB9LFxuICAgIHsgeDogMjg0LCB5OiAzMDksIHI6IDU2LCBnOiA2MSwgYjogNDAgfSxcblxuICAgIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAyNCwgeTogMzE0LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MiwgeTogMzE3LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMSwgeTogMzMxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LCAvLyBiYWNrIGJ0blxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveEJ0bnMgPSB7XG4gIG9wZW5Cb3g6IHsgeDogNDE4LCB5OiAzMjUgfSxcbiAgcmVjZWl2ZVJld2FyZDogeyB4OiA1NjEsIHk6IDMyNiB9LFxufTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveENvbmZpcm0gPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3hDb25maXJtJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTEsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE1LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxOSwgeTogMTc3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjQwLCB5OiA1OCwgcjogMTU1LCBnOiAxNjAsIGI6IDE2MyB9LFxuICAgIHsgeDogMjY3LCB5OiA1OCwgcjogMTQxLCBnOiAxNDcsIGI6IDE0OSB9LFxuICAgIHsgeDogMzI1LCB5OiA1OSwgcjogMTYxLCBnOiAxNjcsIGI6IDE3MCB9LFxuICAgIHsgeDogMzgzLCB5OiA1OSwgcjogMTcxLCBnOiAxNzksIGI6IDE3OSB9LFxuICAgIHsgeDogNDA3LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTE1LCB5OiA0OSwgcjogMTg3LCBnOiAxODUsIGI6IDE4OCB9LFxuICAgIHsgeDogNTE5LCB5OiA1NSwgcjogOTEsIGc6IDkxLCBiOiA5MiB9LFxuXG4gICAgLy8gbm8gJiB5ZXMgYnRuXG4gICAgeyB4OiAyMTAsIHk6IDI5MywgcjogNDEsIGc6IDgxLCBiOiAxMjMgfSxcbiAgICB7IHg6IDIzOCwgeTogMjk2LCByOiA0NSwgZzogODEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjg0LCB5OiAyOTQsIHI6IDQxLCBnOiA3OCwgYjogMTIzIH0sXG5cbiAgICB7IHg6IDM5NywgeTogMjk5LCByOiA0MCwgZzogMTM0LCBiOiAyNTMgfSxcbiAgICB7IHg6IDQzMywgeTogMzA3LCByOiA4LCBnOiA5OCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzg3LCB5OiAzMDAgfSwgLy8geWVzIGJ0blxuICB7IHg6IDM4NywgeTogMzAwIH1cbik7XG5cbmNvbnN0IHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTMsIHk6IDUzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNywgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDk2LCB5OiAyOTksIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMTcsIHk6IDU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyNTksIHk6IDU1LCByOiAxNzcsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiAyOTgsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDEsIHk6IDYwLCByOiAxMjAsIGc6IDEyNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTIsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTgyIH0sXG4gICAgeyB4OiA1MTksIHk6IDUzLCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBvayBidG5cbiAgICB7IHg6IDI4OCwgeTogMjk3LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMDAsIHI6IDEzNiwgZzogMTkwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzAxLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sIC8vIG9rIGJ0blxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG4iLCJpbXBvcnQgeyBVdGlscywgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNhdmVQYWdlUmVmZXJlbmNlKGltZzogSW1hZ2UsIHBhZ2U6IFBhZ2UpIHtcbiAgY29uc3QgeyBuYW1lLCBwb2ludHMgfSA9IHBhZ2U7XG4gIGNvbnN0IHJhZGl1cyA9IDM7XG4gIGNvbnN0IHJnYmE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzI1NSwgMjAsIDE0NywgMF07XG4gIGZvciAoY29uc3QgeyB4LCB5IH0gb2YgcG9pbnRzKSB7XG4gICAgZHJhd0NpcmNsZShpbWcsIHgsIHksIHJhZGl1cywgLi4ucmdiYSk7XG4gIH1cbiAgc2F2ZUltYWdlKGltZywgYC9zZGNhcmQvUGljdHVyZXMvU2NyZWVuc2hvdHMvcm9ib3Rtb24vbWxiLyR7bmFtZX0ucG5nYCk7XG4gIGNvbnNvbGUubG9nKGBbU2F2ZVBhZ2VSZWZlcmVuY2VdOiAke25hbWV9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlQ29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCByZXN1bHRzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgY29tbWFuZHMpIHtcbiAgICBjb25zdCByZXMgPSBleGVjdXRlKGNvbW1hbmQpO1xuICAgIGlmIChlbmRzV2l0aChyZXMsICdleGl0IHN0YXR1cyAxJykpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbRXJyb3JdOiAke2NvbW1hbmR9IDpcXG4gJHtyZXN9XFxuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBbT2tdOiAke2NvbW1hbmR9IDpcXG4gJHtyZXN9XFxuYCk7XG4gICAgICBjb25zb2xlLmxvZyhgW09rXTogJHtjb21tYW5kfWApO1xuICAgIH1cbiAgICByZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZHNXaXRoKHN0cjogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlGaW5kPFQ+KGFycjogVFtdLCBjb25kaXRpb246IChlbDogVCkgPT4gYm9vbGVhbik6IFQgfCB1bmRlZmluZWQge1xuICBmb3IgKGNvbnN0IGVsIG9mIGFycikge1xuICAgIGlmIChjb25kaXRpb24oZWwpKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVDb2xvcihpbWFnZTogSW1hZ2UgfCBSR0IsIHRhcmdldDogWFlSR0IgfCBSR0IsIHRocmVzOiBudW1iZXIgPSAwLjgpOiBib29sZWFuIHtcbiAgbGV0IGltYWdlUkdCOiBSR0IgfCB1bmRlZmluZWQ7XG4gIGlmICgncicgaW4gaW1hZ2UpIHtcbiAgICAvLyBpbWFnZSBpcyBSR0JcbiAgICBpbWFnZVJHQiA9IGltYWdlO1xuICB9IGVsc2UgaWYgKCd4JyBpbiB0YXJnZXQpIHtcbiAgICAvLyBpbWFnZSBpcyBJbWFnZSwgdGFyZ2V0IGlzIFhZUkdCXG4gICAgaW1hZ2VSR0IgPSBnZXRJbWFnZUNvbG9yKGltYWdlLCB0YXJnZXQueCwgdGFyZ2V0LnkpO1xuICB9XG5cbiAgaWYgKGltYWdlUkdCID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBpcyBub3QgWFlSR0InKTtcbiAgfVxuXG4gIGNvbnN0IHNjb3JlID0gVXRpbHMuaWRlbnRpdHlDb2xvcihpbWFnZVJHQiwgdGFyZ2V0KTtcbiAgcmV0dXJuIHNjb3JlID4gdGhyZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xvckNvdW50SW5SYW5nZShpbWFnZTogSW1hZ2UsIGxlZnRUb3A6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgcmlnaHRCb3R0b206IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSk6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSB7XG4gIGNvbnN0IGNudDogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gIGNvbnN0IHsgeDogeDEsIHk6IHkxIH0gPSBsZWZ0VG9wO1xuICBjb25zdCB7IHg6IHgyLCB5OiB5MiB9ID0gcmlnaHRCb3R0b207XG4gIGZvciAobGV0IHggPSB4MTsgeCA8PSB4MjsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IHkxOyB5IDw9IHkyOyB5KyspIHtcbiAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gZ2V0SW1hZ2VDb2xvcihpbWFnZSwgeCwgeSk7XG4gICAgICBjb25zdCBjb2xvciA9IGAke3J9LSR7Z30tJHtifWA7XG4gICAgICBpZiAoY250W2NvbG9yXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNudFtjb2xvcl0gPSAwO1xuICAgICAgfVxuICAgICAgY250W2NvbG9yXSsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY250O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lQ29sb3JDb3VudChjbnQxOiB7IFtjb2xvcjogc3RyaW5nXTogbnVtYmVyIH0sIGNudDI6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xuICBjb25zdCBrZXlzMSA9IE9iamVjdC5rZXlzKGNudDEpO1xuICBjb25zdCBrZXlzMiA9IE9iamVjdC5rZXlzKGNudDIpO1xuICBpZiAoa2V5czEubGVuZ3RoICE9PSBrZXlzMi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5czEpIHtcbiAgICBpZiAoY250MVtrZXldICE9PSBjbnQyW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgTUxCOUkgfSBmcm9tICcuL3NyYyc7XG5cbmxldCBtbGI5aTogTUxCOUkgfCB1bmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoanNvbkNvbmZpZzogYW55KSB7XG4gIG1sYjlpID0gbmV3IE1MQjlJKGpzb25Db25maWcpO1xuICBtbGI5aS5zdGFydCgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHN0b3AoKSB7XG4gIGlmIChtbGI5aSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG1sYjlpLnN0b3AoKTtcbiAgbWxiOWkgPSB1bmRlZmluZWQ7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7fVxufVxuKHdpbmRvdyBhcyBhbnkpLnN0YXJ0ID0gc3RhcnQ7XG4od2luZG93IGFzIGFueSkuc3RvcCA9IHN0b3A7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
function start(jsonConfig){window.start(jsonConfig);}
function stop(){window.stop();}

