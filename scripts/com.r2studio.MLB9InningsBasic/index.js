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
var VERSION_CODE = 15.33;
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
            this.addBasicTasks();
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
        this.addBasicTasks();
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
        tasks_1.weeklyMission.addTask();
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.adReward,
            // maxTaskRunTimes: 1,
            minRoundInterval: CONSTANTS.minuteInMs * 30,
            findRouteDelay: CONSTANTS.sleepMedium,
            maxTaskDuring: CONSTANTS.sleepForAd + CONSTANTS.duringMaxAdRetry,
            forceStop: true,
        });
        modules_1.rerouter.addTask({
            name: tasks_1.TASK.playBattleGame,
            minRoundInterval: CONSTANTS.hourInMs,
            maxTaskDuring: 10 * CONSTANTS.hourInMs,
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
};
function set(jsonConfig) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
    //btns in left bottom
    { x: 29, y: 324, r: 255, g: 255, b: 255 },
    { x: 63, y: 322, r: 58, g: 69, b: 50 },
    { x: 91, y: 322, r: 255, g: 255, b: 255 },
    { x: 134, y: 322, r: 213, g: 213, b: 210 },
    { x: 186, y: 321, r: 255, g: 255, b: 255 },
    { x: 237, y: 324, r: 255, g: 255, b: 255 },
    { x: 218, y: 322, r: 66, g: 73, b: 58 },
    // btns in right bottom
    { x: 493, y: 323, r: 58, g: 69, b: 49 },
    { x: 516, y: 324, r: 225, g: 213, b: 213 },
    { x: 525, y: 318, r: 155, g: 47, b: 57 },
    { x: 566, y: 322, r: 16, g: 114, b: 124 },
    { x: 586, y: 320, r: 255, g: 255, b: 255 },
    { x: 601, y: 325, r: 16, g: 109, b: 123 },
], { x: 0, y: 0 }, { x: 0, y: 0 });
exports.mainBtns = {
    leagueMode: { x: 204, y: 154 },
    battleMode: { x: 350, y: 145 },
    specialMode: { x: 438, y: 145 },
    clubMode: { x: 556, y: 145 },
    settings: { x: 243, y: 323 },
    adTab: { x: 590, y: 77 },
    achievement: { x: 141, y: 323 },
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
    var filepath = "/sdcard/Pictures/Screenshots/robotmon/mlb/".concat(name, ".png");
    var res = execute("test -e ".concat(filepath, " && echo 1"));
    console.log(res);
    if (res === '1') {
        return;
    }
    var radius = 3;
    var rgba = [255, 20, 147, 0];
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var _a = points_1[_i], x = _a.x, y = _a.y;
        drawCircle.apply(void 0, __spreadArray([img, x, y, radius], rgba, false));
    }
    saveImage(img, filepath);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw4REFBOEQ7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLDhIQUE4SDtBQUM5SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLCtCQUErQjtJQUMvQiwwQ0FBMEM7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLFdBQUcsR0FBRyxJQUFJLGVBQUksQ0FDekIsS0FBSyxFQUNMO0lBQ0UsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRiw4QkFBOEI7QUFDakIsYUFBSyxHQUFHLElBQUksZUFBSSxDQUMzQixPQUFPLEVBQ1A7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsT0FBTztJQUNQLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLG9DQUFvQztBQUN2QixlQUFPLEdBQUcsSUFBSSxlQUFJLENBQzdCLFNBQVMsRUFDVDtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsb0NBQW9DO0FBQ3ZCLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLGlCQUFpQjtJQUNqQixXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsYUFBYTtBQUNqQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsYUFBSyxHQUFHLElBQUksZUFBSSxDQUMzQixPQUFPLEVBQ1A7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUTtBQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGVBQWU7Q0FDbEMsQ0FBQztBQUVGLGtCQUFrQjtBQUNMLGVBQU8sR0FBRyxJQUFJLGVBQUksQ0FDN0IsU0FBUyxFQUNUO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVE7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ2xDLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUFDLFdBQVcsRUFBRTtJQUM3QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxxQkFBYSxHQUFHLElBQUksZUFBSSxDQUFDLGVBQWUsRUFBRTtJQUNyRCxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxvQkFBWSxHQUFHLElBQUksZUFBSSxDQUNsQyxjQUFjLEVBQ2Q7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFDVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxZQUFJLEdBQUcsSUFBSSxlQUFJLENBQzFCLE1BQU0sRUFDTjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxxQkFBcUI7SUFDckIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsdUJBQXVCO0lBQ3ZCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxnQkFBUSxHQUFHO0lBQ3RCLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM5QixVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDOUIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQy9CLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hCLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNoQyxDQUFDO0FBRVcsZ0JBQVEsR0FBRyxJQUFJLGVBQUksQ0FDOUIsVUFBVSxFQUNWO0lBQ0UsZ0JBQWdCO0lBQ2hCLDRDQUE0QztJQUM1QywyQ0FBMkM7SUFDM0MsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3QywwQ0FBMEM7SUFDMUMsMENBQTBDO0lBQzFDLDZDQUE2QztJQUM3Qyw2Q0FBNkM7SUFFN0Msc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFF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Q0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXJDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLDRCQUFvQixHQUFHO0lBQ2xDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QixnQ0FBZ0M7Q0FDakMsQ0FBQztBQUNXLGlDQUF5QixHQUFHLElBQUksZUFBSSxDQUMvQywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFFcEMsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsY0FBYztBQUNsQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGNBQWM7Q0FDbEMsQ0FBQztBQUNXLDRDQUFvQyxHQUFHO0lBQ2xELEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QixDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQ3RDLGdCQUFnQixFQUNoQjtJQUNFLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6Qyx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsYUFBYTtJQUNiLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUs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O0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLFlBQVk7SUFDWixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsb0NBQTRCLEdBQUcsSUFBSSxlQUFJLENBQ2xELDhCQUE4QixFQUM5QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFeEMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxD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LEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsYUFBYTtBQUNqQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWE7Q0FDakMsQ0FBQztBQUVGLG1EQUFtRDtBQUNuRCwyREFBMkQ7QUFDOUMseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLDBCQUEwQjtJQUMxQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsbUJBQW1CO0FBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUztDQUM3QixDQUFDO0FBRVcsNkJBQXFCLEdBQUc7SUFDbkMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQixDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxlQUFJLENBQ3RDLGtCQUFrQixFQUNsQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdEMsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUNXLGtDQUEwQixHQUFHO0lBQ3hDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxVQUFVO0lBQ1YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsb0JBQW9CO0lBQ3BCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLHNCQUFjLEdBQUc7SUFDNUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzVCLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUM1QixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0IsQ0FBQztBQUVGLGdCQUFnQjtBQUNILHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLGdCQUFnQjtJQUNoQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsZ0RBQWdEO0lBQ2hELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTztBQUMxQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBQ1csMkJBQW1CLEdBQUc7SUFDakMsWUFBWSxFQUFFLEVB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LEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJO0FBQ3ZCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsWUFBWTtJQUNaLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUs7QUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLHdCQUF3QjtJQUN4QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUV4QyxPQUFPO0lBQ1AsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsMkJBQTJCO0lBQzNCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLDRCQUE0QjtBQUNmLHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxrREFBa0Q7SUFDbEQsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLHVCQUF1QjtBQUMzQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLDBCQUEwQjtDQUM5QyxDQUFDO0FBRUYsMEJBQTBCO0FBQ2IsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGFBQWE7SUFDYixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4Qyw2QkFBNkI7Q0FDOUIsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLHlCQUF5QjtBQUM3QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHFCQUFxQjtDQUN6QyxDQUFDO0FBRVcsNEJBQW9CLEdBQUcsSUFBSSxlQUFJLENBQzFDLHNCQUFzQixFQUN0QjtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVM7QUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTO0FBQzVCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2xCLENBQUM7QUFFRixnQkFBZ0I7QUFDSCx1QkFBZSxHQUFHLElBQUksZUFBSSxDQUNyQyxpQkFBaUIsRUFDakI7SUFDRSxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUksZUFBSSxDQUN4QyxvQkFBb0IsRUFDcEI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztBQUMvQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRUYseUJBQXlCO0FBQ1osMEJBQWtCLEdBQUc7SUFDaEMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMzQixnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNyQyxDQUFDO0FBRVcsc0JBQWMsR0FBRyxJQUFJLGVBQUksQ0FDcEMsZ0JBQWdCLEVBQ2hCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUM7QUFDRCxnREFBZ0Q7QUFDaEQsMEJBQWtCLENBQUMsT0FBTyxFQUMxQiwwQkFBa0IsQ0FBQyxPQUFPLENBQzNCLENBQUM7QUFFRixzREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3hCLDZCQUFxQixHQUFHLElBQUksZUFBSSxDQUMzQyx1QkFBdUIsRUFDdkI7SUFDRSxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxnQkFBZ0I7QUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0I7Q0FDcEMsQ0FBQztBQUVXLDJCQUFtQixHQUFHLElBQUks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QUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUscUJBQXFCO0FBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMscUJBQXFCO0NBQ3hDLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsMkJBQTJCO0FBQ2QsdUNBQStCLEdBQUcsSUFBSSxlQUFJLENBQ3JELDBCQUEwQixFQUMxQjtJQUNFLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6Qyx5QkFBeUI7SUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFB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LEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsV0FBVztJQUNYLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFRix1QkFBdUI7QUFDVixtQkFBVyxHQUFHLElBQUksZUFBSSxDQUNqQyxhQUFhLEVBQ2I7SUFDRSxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsMEJBQTBCO0lBQzFCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVyxvQkFBWSxHQUFHLElBQUksZUFBSSxDQUNsQyxhQUFhLEVBQUUsbURBQW1EO0FBQ2xFO0lBQ0UsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXRDLHVCQUF1QjtJQUN2QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRUYsMENBQTBDO0FBQzdCLHdCQUFnQixHQUFHLElBQUksZUFBSSxDQUN0QyxrQkFBa0IsRUFDbEI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsOENBQThDO0FBQ2xFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx3QkFBZ0IsR0FBRyxJQUFJLG9CQUFTLENBQUMsYUFBYSxFQUFFLENBQUMs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RUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsVUFBVTtJQUNWLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztDQUN0RCxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTO0NBQ3BELEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHVCQUFlLEdBQUcsSUFBSSxlQUFJLENBQ3JDLGlCQUFpQixFQUNqQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFDZCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUNmLENBQUM7QUFFVywrQkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDN0MseUJBQXlCLEVBQ3pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUNkLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQ2YsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDhCQUFzQixHQUFHLElBQUksZUFBSSxDQUM1Qyx3QkFBd0IsRUFDeEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXZDLDRCQUE0QjtJQUM1QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHdCQUF3QixFQUN4QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2Qyw0QkFBNEI7SUFDNUIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXRDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxtQ0FBMkIsR0FBRyxJQUFJLG9CQUFTLENBQ3RELHdCQUF3QixFQUN4QixDQUFDLDhCQUFzQixFQUFFLCtCQUF1QixDQUFDLEVBQ2pELDhCQUFzQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQ3ZDLENBQUM7QUFFRix1Q0FBdUM7QUFDMUIsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUVyQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLDRCQUFvQixHQUFHLElBQUksZUFBSSxDQUMxQyxzQkFBc0IsRUFDdEI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLGtCQUFVLEdBQUcsSUFBSSxlQUFJLENBQ2hDLFlBQVksRUFDWjtJQUNFLGlCQUFpQjtJQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsaUNBQWlDO0lBQ2pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2pCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ2xCLENBQUM7QUFFVyw0QkFBb0IsR0FBRyxJQUFJLGVBQUksQ0FDMUMsc0JBQXNCLEVBQ3RCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxvQ0FBNEIsR0FBRyxJQUFJLGVBQUksQ0FDbEQsOEJBQThCLEVBQzlCO0lBQ0UsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxlQUFlO0lBQ2YsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDeEMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBQ0YsSUFBSTtBQUVTLCtDQUF1QyxHQUFHLElBQUksZUFBSSxDQUM3RCx5Q0FBeUMsRUFDekM7SUFDRSxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsaUJBQWlCO0lBQ2pCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLE9BQU87SUFDUCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyx5QkFBaUIsR0FBRyxJQUFJLGVBQUksQ0FDdkMsbUJBQW1CLEVBQ25CO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsV0FBRyxHQUFHLElBQUksZUFBSSxDQUN6QixLQUFLLEVBQ0w7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN0QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVywwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FDeEMsb0JBQW9CLEVBQ3BCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ25DLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXJDLG9CQUFvQjtJQUNwQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFDRiwrREFBK0Q7QUFDL0QsaUJBQWlCO0FBQ2pCLG9FQUFvRTtBQUNwRSxtQ0FBbUM7QUFDdEIsOEJBQXNCLEdBQUc7SUFDcEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDbkIsQ0FBQztBQUNGLDJCQUEyQjtBQUMzQix1QkFBdUI7QUFDdkIsaUNBQWlDO0FBQ3BCLDZCQUFxQixHQUE0QjtJQUM1RCxVQUFVLEVBQUUsQ0FBQztJQUNiLFVBQVUsRUFBRSxDQUFDO0lBQ2IsVUFBVSxFQUFFLENBQUM7SUFDYixhQUFhLEVBQUUsQ0FBQztJQUNoQixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsWUFBWSxFQUFFLENBQUM7SUFDZixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsV0FBVyxFQUFFLENBQUMsRUFBRSw4QkFBOEI7Q0FDL0MsQ0FBQztBQUVGLGlCQUFpQjtBQUNKLGdCQUFRLEdBQUcsSUFBSSxlQUFJLENBQzlCLFVBQVUsRUFDVjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyx5QkFBeUI7SUFDekIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFeEMsU0FBUztJQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHNCQUFjLEdBQUcsSUFBSSxlQUFJLENBQ3BDLGdCQUFnQixFQUNoQjtJQUNFLGtCQUFrQjtJQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV2QyxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3pDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLG9CQUFZLEdBQUcsSUFBSSxlQUFJLENBQ2xDLGNBQWMsRUFDZDtJQUNFLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFD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RyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxjQUFjO0lBQ2QsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDckMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdkMscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLFdBQVc7SUFDWCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsV0FBVztBQUM5QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNsQixDQUFDO0FBRVcsNEJBQW9CLEdBQUc7SUFDbEMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNsQyxDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxlQUFJLENBQzdDLHlCQUF5QixFQUN6QjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLGVBQWU7SUFDZixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVTtBQUM5QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsZ0NBQXdCLEdBQUcsSUFBSSxlQUFJLENBQzlDLDBCQUEwQixFQUMxQjtJQUNFLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUUxQyxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsSUFBSTtJQUNKLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXRDLFNBQVM7SUFDVCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUztBQUM3QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsZ0JBQWdCO0FBQ0gsbUJBQVcsR0FBRyxJQUFJLGVBQUksQ0FDakMsYUFBYSxFQUNiO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDcEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDbkMsMkNBQTJDO0lBQzNDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3BDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBRXBDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNwQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtDQUNyQyxFQUNELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQ2QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDZixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FDaEMsWUFBWSxFQUNaO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNsQixDQUFDO0FBRVcseUJBQWlCLEdBQUcsSUFBSSxlQUFJLENBQ3ZDLG1CQUFtQixFQUNuQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENB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RSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLGlCQUFTLEdBQUcsSUFBSSxlQUFJLENBQy9CLFdBQVcsRUFDWDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLHFCQUFxQjtBQUNSLFVBQUUsR0FBRyxJQUFJLGVBQUksQ0FDeEIsSUFBSSxFQUNKO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDekMsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRUYsdUJBQXVCO0FBQ1YsWUFBSSxHQUFHLElBQUksZUFBSSxDQUMxQixNQUFNLEVBQ047SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQ2xCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxhQUFLLEdBQUcsSUFBSSxlQUFJLENBQzNCLE1BQU0sRUFDTjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLGdEQUFnRDtBQUNuQyxxQkFBYSxHQUFHLElBQUksZUFBSSxDQUNuQyxlQUFlLEVBQ2Y7SUFDRSxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsU0FBUztJQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLFVBQVU7SUFDVixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxZQUFZO0lBQ1osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVE7QUFDM0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLHlCQUF5QjtBQUNaLCtCQUF1QixHQUFHLElBQUksZUFBSSxDQUM3Qyx5QkFBeUIsRUFDekI7SUFDRSxRQUFRO0lBQ1IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsOEJBQThCO0lBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLEtBQUs7SUFDTCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV4QyxpQkFBaUI7SUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0M7QUFDRCx1Q0FBdUM7QUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFDbEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVGLDhDQUE4QztBQUM5QyxtQ0FBbUM7QUFDdEIsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUNsQixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZO0FBQ2hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRix5QkFBeUI7QUFDWixlQUFPLEdBQUcsSUFBSSxlQUFJLENBQzdCLFNBQVMsRUFDVDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjO0FBQ2xDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxnQkFBUSxHQUFHLElBQUksZUFBSSxDQUM5QixVQUFVLEVBQ1Y7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFF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QUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFekMsY0FBYztJQUNkLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBRXZDLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV2QyxXQUFXO0lBQ1gsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDMUMsRUFDRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFdBQVc7QUFDOUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbEIsQ0FBQztBQUVGLElBQU0sb0JBQW9CLEdBQUc7SUFDM0IsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzNCLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUNsQyxDQUFDO0FBRUYsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLGVBQUksQ0FDdEMseUJBQXlCLEVBQ3pCO0lBQ0UsS0FBSztJQUNMLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRTFDLFFBQVE7SUFDUixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUV6QyxJQUFJO0lBQ0osRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFFdEMsZUFBZTtJQUNmLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXhDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQ3hDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVO0FBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFRixJQUFNLHdCQUF3QixHQUFHLElBQUksZUFBSSxDQUN2QywwQkFBMEIsRUFDMUI7SUFDRSxLQUFLO0lBQ0wsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFFMUMsUUFBUTtJQUNSLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBRXpDLElBQUk7SUFDSixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUV0QyxTQUFTO0lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxF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QyxLQUFLLEVBQUUsQ0FBQztBQUNoQixDQUFDO0FBSEQsc0JBR0M7QUFDRCxTQUFnQixJQUFJO0lBQ2xCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPO0tBQ1I7SUFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3BCLENBQUM7QUFORCxvQkFNQztBQUtBLE1BQWMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzdCLE1BQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvcmVyb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy9zY3JlZW4uanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy9zdHJ1Y3QuanMiLCJ3ZWJwYWNrOi8vdGVzdC8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2NoYXJlbmMvY2hhcmVuYy5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vbm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL3Rlc3QvLi9ub2RlX21vZHVsZXMvbWQ1L21kNS5qcyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL2V2ZW50U2VuZGVyLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvbW9kdWxlcy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL21vZHVsZXMvcmVyb3V0ZXIudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3Nlc3Npb24udHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy9tb2R1bGVzL3N0YXRlLnRzIiwid2VicGFjazovL3Rlc3QvLi9zcmMvcGFnZXMudHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy90YXNrcy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXN0Ly4vc3JjL3Rhc2tzL3dlZWtseU1pc3Npb24udHMiLCJ3ZWJwYWNrOi8vdGVzdC8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly90ZXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Rlc3QvLi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy52ZXJzaW9uID0gdm9pZCAwO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9zY3JlZW5cIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9yZXJvdXRlclwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3N0cnVjdFwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL3V0aWxzXCIpLCBleHBvcnRzKTtcbmV4cG9ydHMudmVyc2lvbiA9IDE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlcm91dGVyID0gZXhwb3J0cy5SZXJvdXRlciA9IHZvaWQgMDtcbnZhciBzdHJ1Y3RfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdFwiKTtcbnZhciBzY3JlZW5fMSA9IHJlcXVpcmUoXCIuL3NjcmVlblwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgUmVyb3V0ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVyb3V0ZXIoKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0Q29uZmlnVmFsdWU7XG4gICAgICAgIHRoaXMucmVyb3V0ZXJDb25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0UmVyb3V0ZXJDb25maWc7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnID0gc3RydWN0XzEuRGVmYXVsdFNjcmVlbkNvbmZpZztcbiAgICAgICAgdGhpcy5zY3JlZW4gPSBuZXcgc2NyZWVuXzEuU2NyZWVuKHRoaXMuc2NyZWVuQ29uZmlnKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucm91dGVzID0gW107XG4gICAgICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLnVua25vd25Sb3V0ZUFjdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlY2FsY3VsYXRlIHNvbWUgdmFsdWUgbGlrZSBkZXZpY2Ugd2lkdGggb3IgaGVpZ2h0IGluIHNjcmVlbkNvbmZpZ1xuICAgICAqL1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBzb3J0IHJvdXRlcyBieSBwcmlvcml0eVxuICAgICAgICB0aGlzLnJvdXRlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eTsgfSk7XG4gICAgICAgIC8vIGNoZWNrIGFuZCBjYWxjdWxhdGUgc2NyZWVuIGNvbmZpZ1xuICAgICAgICB2YXIgZGV2aWNlV0ggPSBnZXRTY3JlZW5TaXplKCk7XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heChkZXZpY2VXSC53aWR0aCwgZGV2aWNlV0guaGVpZ2h0KTtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluKGRldmljZVdILndpZHRoLCBkZXZpY2VXSC5oZWlnaHQpO1xuICAgICAgICB2YXIgZFdpZHRoID0gdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24gPT09ICdob3Jpem9udGFsJyA/IG1heCA6IG1pbjtcbiAgICAgICAgdmFyIGRIZWlnaHQgPSB0aGlzLnNjcmVlbkNvbmZpZy5yb3RhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IG1heCA6IG1pbjtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlV2lkdGggPSB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VXaWR0aCB8fCBkV2lkdGg7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZUhlaWdodCA9IHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZUhlaWdodCB8fCBkSGVpZ2h0O1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCA9IHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbldpZHRoIHx8IGRXaWR0aDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0ID0gdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0IHx8IGRIZWlnaHQ7XG4gICAgICAgIHRoaXMubG9nKFwic2NyZWVuV2lkdGg6IFwiLmNvbmNhdCh0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCwgXCIsIHNjcmVlbkhlaWdodDogXCIpLmNvbmNhdCh0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5IZWlnaHQpKTtcbiAgICAgICAgLy8gbmV3IHNjcmVlbiBpZiBzY3JlZW4gY29uZmlnIGNoYW5nZWRcbiAgICAgICAgdGhpcy5zY3JlZW4gPSBuZXcgc2NyZWVuXzEuU2NyZWVuKHRoaXMuc2NyZWVuQ29uZmlnKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBSb3V0ZUNvbmZpZyB0byBSZXJvdXRlciByb3V0ZXMsIGFmdGVyIHN0YXJ0aW5nIFJlcm91dGVyIHdpbGwgcnVuIG92ZXIgYWxsIFJvdXRlQ29uZmlncyB0byBtYXRjaCBzY3JlZW4gYW5kIGRvIGFjdGlvblxuICAgICAqIEBwYXJhbSBjb25maWcgaW5mb3JtYXRpb24gYWJvdXQgaG93IHJvdXRlIG1hdGNoIGFuZCByb3V0ZSBhY3Rpb25cbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMucm91dGVzLnB1c2godGhpcy53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdChjb25maWcpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRlbGwgUmVyb3V0ZXIgd2hhdCB0byBkbyBpZiBub3QgbWF0Y2hpbmcgYW55IHJvdXRlXG4gICAgICogQHBhcmFtIGFjdGlvbiBmdW5jdGlvbiB0byBkbyBpZiBub3QgbWF0Y2hpbmdcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuYWRkVW5rbm93bkFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy51bmtub3duUm91dGVBY3Rpb24gPSBhY3Rpb247XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgVGFza0NvbmZpZyB0byBSZXJvdXRlciB0YXNrcywgYWZ0ZXIgc3RhcnRpbmcgUmVyb3V0ZXIgd2lsbCBydW4gb3ZlciBhbGwgVGFza3MgYnkgdGFzayBjb25kaXRpb25cbiAgICAgKiBAcGFyYW0gY29uZmlnIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0YXNrIHdvcmtzXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFRhc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMudGFza3MucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy53cmFwVGFza0NvbmZpZ1dpdGhEZWZhdWx0KGNvbmZpZyksXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBsYXN0UnVuVGltZTogMCxcbiAgICAgICAgICAgIHJ1blRpbWVzOiAwLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0YXJ0IFJlcm91dGVyIHRvIHJ1biBvdmVyIHRhc2tzIGFuZCByb3V0ZXNcbiAgICAgKiBAcGFyYW0gcGFja2FnZU5hbWVcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSA9IHBhY2thZ2VOYW1lO1xuICAgICAgICAvLyBjaGVjayB0YXNrc1xuICAgICAgICBpZiAodGhpcy50YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgZmFpbGVkLCBubyB0YXNrcyAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnRlZCAuLi5cIik7XG4gICAgICAgIC8vIHRhc2sgY29udHJvbGxlclxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0VGFza0xvb3AoKTtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wcGVkIC4uLlwiKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0b3AgUmVyb3V0ZXJcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wIGNhbGxlZCwgdHJ5aW5nIHRvIHN0b3AgdGFzayBsb29wXCIpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMucm91dGVDb250ZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlQ29udGV4dC5zY3JpcHRSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5jaGVja0luQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSB1dGlsc18xLlV0aWxzLmdldEN1cnJlbnRBcHAoKVswXTtcbiAgICAgICAgaWYgKHBhY2thZ2VOYW1lID09PSB0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy5pc0FwcE9uVG9wKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmNoZWNrQW5kU3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja0luQXBwKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQXBwSXNOb3RTdGFydGVkLCBzdGFydEFwcCBcIi5jb25jYXQodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEFwcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgYXBwIGZhaWxlZCwgbm8gcGFja2FnZU5hbWUgLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc3RhcnRBcHAodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSk7XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy5zdGFydEFwcERlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdG9wQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RvcCBhcHAgZmFpbGVkLCBubyBwYWNrYWdlTmFtZSAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zdG9wQXBwKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKDEwMDApO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnJlc3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcEFwcCgpO1xuICAgICAgICB0aGlzLnN0YXJ0QXBwKCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ29OZXh0ID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgaWYgKHBhZ2UubmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAocGFnZS5uZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChwYWdlLm5hbWUsIFwiIGFjdGlvbiA9PSBnb05leHQsIGJ1dCBubyBuZXh0IHh5XCIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdvQmFjayA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmIChwYWdlLmJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKHBhZ2UuYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocGFnZS5uYW1lLCBcIiBhY3Rpb24gPT0gZ29CYWNrLCBidXQgbm8gYmFjayB4eVwiKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaCA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIGlzTWF0Y2ggPSB0aGlzLmlzUGFnZU1hdGNoSW1hZ2UocGFnZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaEltYWdlID0gZnVuY3Rpb24gKHBhZ2UsIGltYWdlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRQYWdlQnlOYW1lKHBhZ2UpO1xuICAgICAgICAgICAgaWYgKHAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJpc1BhZ2VNYXRjaEltYWdlIFwiLmNvbmNhdChwYWdlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhZ2UgPSBwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWdlIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMuaXNNYXRjaEdyb3VwUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRoaXMuZGVmYXVsdENvbmZpZy5Hcm91cFBhZ2VUaHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICByZXR1cm4gcGFnZXMubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2ggPSBmdW5jdGlvbiAoZ3JvdXBQYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5nZXRQYWdlc01hdGNoSW1hZ2UoZ3JvdXBQYWdlLCBpbWFnZSwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChncm91cFBhZ2UsIGltYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgIHZhciB0aHJlcyA9IChfYiA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICBpZiAoaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdQYWdlID0gZnVuY3Rpb24gKHBhZ2UsIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuVXRpbHMud2FpdEZvckFjdGlvbihmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5pc1BhZ2VNYXRjaChwYWdlKTsgfSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUm91dGVNYXRjaCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBpc01hdGNoID0gdGhpcy5pc1JvdXRlTWF0Y2hJbWFnZShyb3V0ZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1JvdXRlTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChyb3V0ZSwgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHJvdXRlQ29uZmlnID0gdGhpcy5nZXRSb3V0ZUNvbmZpZyhyb3V0ZSk7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiaXNSb3V0ZU1hdGNoSW1hZ2UgXCIuY29uY2F0KHJvdXRlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmaWxsZWRSb3V0ZUNvbmZpZyA9IHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQocm91dGVDb25maWcpO1xuICAgICAgICB2YXIgcm90YXRpb24gPSB0aGlzLnNjcmVlbi5nZXRJbWFnZVJvdGF0aW9uKGltYWdlKTtcbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIGZpbGxlZFJvdXRlQ29uZmlnLCAnd2FpdFNjcmVlbkZvck1hdGNoaW5nUm91dGUnKS5pc01hdGNoZWQ7XG4gICAgICAgIGlmIChpc01hdGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdSb3V0ZSA9IGZ1bmN0aW9uIChyb3V0ZSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1hdGNoVGltZXMgPT09IHZvaWQgMCkgeyBtYXRjaFRpbWVzID0gMTsgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IHZvaWQgMCkgeyBpbnRlcnZhbCA9IDYwMDsgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy53YWl0Rm9yQWN0aW9uKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlzUm91dGVNYXRjaChyb3V0ZSk7IH0sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRQYWdlQnlOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2IubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYltfaV07XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gKChfYSA9IHJvdXRlLm1hdGNoKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGUubWF0Y2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0Um91dGVDb25maWdCeVBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAocGF0aCA9PT0gcm91dGUucGF0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRDdXJyZW50TWF0Y2hOYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgbWF0Y2hlZE5hbWVzID0gW107XG4gICAgICAgIHRoaXMucm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSByb3V0ZS5tYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5QYWdlICYmIF90aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgbWF0Y2gsIF90aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCBfdGhpcy5kZWJ1ZykpIHx8XG4gICAgICAgICAgICAgICAgKG1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuR3JvdXBQYWdlICYmIF90aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCBtYXRjaCwgX3RoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIF90aGlzLmRlYnVnKS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoZWROYW1lcy5wdXNoKG1hdGNoLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2coXCJjdXJyZW50IG1hdGNoOiBcIiwgbWF0Y2hlZE5hbWVzKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWROYW1lcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRSb3V0ZUNvbmZpZyA9IGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHZhciByb3V0ZTtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcm91dGUgPSB0aGlzLmdldFJvdXRlQ29uZmlnQnlQYXRoKHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcm91dGUgPSByO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBjb25maWcucGF0aCxcbiAgICAgICAgICAgIGFjdGlvbjogY29uZmlnLmFjdGlvbixcbiAgICAgICAgICAgIG1hdGNoOiAoX2EgPSBjb25maWcubWF0Y2gpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGwsXG4gICAgICAgICAgICBjdXN0b21NYXRjaDogKF9iID0gY29uZmlnLmN1c3RvbU1hdGNoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBudWxsLFxuICAgICAgICAgICAgcm90YXRpb246IChfYyA9IGNvbmZpZy5yb3RhdGlvbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24sXG4gICAgICAgICAgICBzaG91bGRNYXRjaFRpbWVzOiAoX2QgPSBjb25maWcuc2hvdWxkTWF0Y2hUaW1lcykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hUaW1lcyxcbiAgICAgICAgICAgIHNob3VsZE1hdGNoRHVyaW5nOiAoX2UgPSBjb25maWcuc2hvdWxkTWF0Y2hEdXJpbmcpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoRHVyaW5nLFxuICAgICAgICAgICAgYmVmb3JlQWN0aW9uRGVsYXk6IChfZiA9IGNvbmZpZy5iZWZvcmVBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQmVmb3JlQWN0aW9uRGVsYXksXG4gICAgICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiAoX2cgPSBjb25maWcuYWZ0ZXJBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQWZ0ZXJBY3Rpb25EZWxheSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAoX2ggPSBjb25maWcucHJpb3JpdHkpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1ByaW9yaXR5LFxuICAgICAgICAgICAgZGVidWc6IChfaiA9IGNvbmZpZy5kZWJ1ZykgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnRGVidWcsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud3JhcFRhc2tDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICAgICAgICBtYXhUYXNrUnVuVGltZXM6IChfYSA9IGNvbmZpZy5tYXhUYXNrUnVuVGltZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza1J1blRpbWVzLFxuICAgICAgICAgICAgbWF4VGFza0R1cmluZzogKF9iID0gY29uZmlnLm1heFRhc2tEdXJpbmcpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza0R1cmluZyxcbiAgICAgICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IChfYyA9IGNvbmZpZy5taW5Sb3VuZEludGVydmFsKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ01pblJvdW5kSW50ZXJ2YWwsXG4gICAgICAgICAgICBmb3JjZVN0b3A6IChfZCA9IGNvbmZpZy5mb3JjZVN0b3ApICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnQXV0b1N0b3AsXG4gICAgICAgICAgICBmaW5kUm91dGVEZWxheTogKF9lID0gY29uZmlnLmZpbmRSb3V0ZURlbGF5KSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5LFxuICAgICAgICAgICAgYmVmb3JlUm91dGU6IChfZiA9IGNvbmZpZy5iZWZvcmVSb3V0ZSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogbnVsbCxcbiAgICAgICAgICAgIGFmdGVyUm91dGU6IChfZyA9IGNvbmZpZy5hZnRlclJvdXRlKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBudWxsLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0VGFza0xvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YXNrSWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0aGlzLnRhc2tzW3Rhc2tJZHggJSB0aGlzLnRhc2tzLmxlbmd0aF07XG4gICAgICAgICAgICB0YXNrSWR4Kys7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHZhciBpc1Rhc2tSdW5GaXJzdFRpbWUgPSB0YXNrLmxhc3RSdW5UaW1lID09PSAwO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHRhc2subGFzdFJ1blRpbWUgPD0gdGFzay5jb25maWcubWluUm91bmRJbnRlcnZhbCAmJiAhaXNUYXNrUnVuRmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBkdXJpbmc6IFwiKS5jb25jYXQobm93IC0gdGFzay5sYXN0UnVuVGltZSwgXCIgPD0gbWluUm91bmRJbnRlcnZhbCwgc2tpcFwiKSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0aGlzLnJlcm91dGVyQ29uZmlnLnRhc2tEZWxheSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLnN0YXJ0VGltZSA9IG5vdztcbiAgICAgICAgICAgIHRhc2sucnVuVGltZXMgPSAwO1xuICAgICAgICAgICAgdmFyIGV4aXRUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2suY29uZmlnLm1heFRhc2tSdW5UaW1lcyAmJiB0aGlzLnJ1bm5pbmcgJiYgIWV4aXRUYXNrOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMpKTtcbiAgICAgICAgICAgICAgICB2YXIgc2tpcFJvdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmJlZm9yZVJvdXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcywgXCIgZG8gYmVmb3JlUm91dGUoKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5iZWZvcmVSb3V0ZSh0YXNrKSA9PT0gJ3NraXBSb3V0ZUxvb3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBza2lwUm91dGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChza2lwUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBza2lwUm91dGVMb29wXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXRUYXNrID0gdGhpcy5zdGFydFJvdXRlTG9vcCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmFmdGVyUm91dGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBkbyBhZnRlclJvdXRlKClcIikpO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmNvbmZpZy5hZnRlclJvdXRlKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnJ1blRpbWVzKys7XG4gICAgICAgICAgICAgICAgdGFzay5sYXN0UnVuVGltZSA9IG5vdztcbiAgICAgICAgICAgICAgICB2YXIgZHVyaW5nID0gbm93IC0gdGFzay5zdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcgPiAwICYmIGR1cmluZyA+PSB0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgdGFza0R1cmluZzogXCIpLmNvbmNhdChkdXJpbmcsIFwiL1wiKS5jb25jYXQodGFzay5jb25maWcubWF4VGFza0R1cmluZywgXCIgcmVhY2hlZCwgc3RvcFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy50YXNrRGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnRSb3V0ZUxvb3AgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQgPSB7XG4gICAgICAgICAgICB0YXNrOiB0YXNrLFxuICAgICAgICAgICAgc2NyZWVuOiB0aGlzLnNjcmVlbixcbiAgICAgICAgICAgIHNjcmlwdFJ1bm5pbmc6IHRoaXMucnVubmluZyxcbiAgICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgICAgbGFzdE1hdGNoZWRQYXRoOiAoX2IgPSAoX2EgPSB0aGlzLnJvdXRlQ29udGV4dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxhc3RNYXRjaGVkUGF0aCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogJycsXG4gICAgICAgICAgICBtYXRjaFRpbWVzOiAwLFxuICAgICAgICAgICAgbWF0Y2hTdGFydFRTOiAwLFxuICAgICAgICAgICAgbWF0Y2hEdXJpbmc6IDAsXG4gICAgICAgIH07XG4gICAgICAgIHZhciByb3V0ZUxvb3AgPSB0cnVlO1xuICAgICAgICB2YXIgZXhpdFRhc2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZpbmlzaFJvdW5kRnVuYyA9IGZ1bmN0aW9uIChleGl0VGFzaykge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgaWYgKGV4aXRUYXNrID09PSB2b2lkIDApIHsgZXhpdFRhc2sgPSBmYWxzZTsgfVxuICAgICAgICAgICAgcm91dGVMb29wID0gZmFsc2U7XG4gICAgICAgICAgICBleGl0VGFza1Jlc3VsdCA9IGV4aXRUYXNrO1xuICAgICAgICAgICAgX3RoaXMubG9nKFwiZmluaXNoIHJvdW5kOiBcIi5jb25jYXQoKF9hID0gX3RoaXMucm91dGVDb250ZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudGFzay5uYW1lLCBcIjsgZXhpdFRhc2s6IFwiKS5jb25jYXQoZXhpdFRhc2spKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcG9pbnRlciBmb3Igc2hvcnQgY29kZVxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMucm91dGVDb250ZXh0O1xuICAgICAgICB3aGlsZSAocm91dGVMb29wICYmIHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAvLyBjaGVjayB0YXNrLmF1dG9TdG9wXG4gICAgICAgICAgICB2YXIgdGFza1J1bkR1cmluZyA9IG5vdyAtIHRhc2suc3RhcnRUaW1lO1xuICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmZvcmNlU3RvcCAmJiB0YXNrUnVuRHVyaW5nID4gdGFzay5jb25maWcubWF4VGFza0R1cmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzayBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBBdXRvU3RvcCwgZXhjZWVkIHRhc2tSdW5EdXJpbmdcIikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2hlY2sgaXNBcHBPbiBvciBhdXRvIGxhdW5jaCBpdFxuICAgICAgICAgICAgaWYgKHRoaXMucmVyb3V0ZXJDb25maWcuYXV0b0xhdW5jaEFwcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrQW5kU3RhcnRBcHAoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcm90YXRpb24gPSB0aGlzLnNjcmVlbi5nZXRSb3RhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICAgICAgdmFyIF9kID0gdGhpcy5maW5kTWF0Y2hlZFJvdXRlSW1wbCh0YXNrLm5hbWUsIGltYWdlLCByb3RhdGlvbiksIG1hdGNoZWRSb3V0ZSA9IF9kLm1hdGNoZWRSb3V0ZSwgbWF0Y2hlZFBhZ2VzID0gX2QubWF0Y2hlZFBhZ2VzO1xuICAgICAgICAgICAgLy8gY29udGV4dC5tYXRjaFN0YXJ0VFMgPSAwIGlmIGluaXQgcnVuXG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoU3RhcnRUUyA9IGNvbnRleHQubWF0Y2hTdGFydFRTIHx8IG5vdztcbiAgICAgICAgICAgIGNvbnRleHQucGF0aCA9IChfYyA9IG1hdGNoZWRSb3V0ZSA9PT0gbnVsbCB8fCBtYXRjaGVkUm91dGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hdGNoZWRSb3V0ZS5wYXRoKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAnJztcbiAgICAgICAgICAgIC8vIGZpcnN0IG1hdGNoXG4gICAgICAgICAgICBpZiAoY29udGV4dC5wYXRoICE9PSBjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQubWF0Y2hUaW1lcyA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tYXRjaFN0YXJ0VFMgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoRHVyaW5nID0gbm93IC0gY29udGV4dC5tYXRjaFN0YXJ0VFM7XG4gICAgICAgICAgICBjb250ZXh0Lm1hdGNoVGltZXMrKztcbiAgICAgICAgICAgIGlmIChtYXRjaGVkUm91dGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51bmtub3duUm91dGVBY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bmtub3duUm91dGVBY3Rpb24oY29udGV4dCwgaW1hZ2UsIGZpbmlzaFJvdW5kRnVuYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb0FjdGlvbkZvclJvdXRlKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkUm91dGUsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmRGdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBsYXN0TWF0Y2hlZFBhdGggYWZ0ZXIgYWN0aW9uIGRvbmVcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSB0aGUgbGFzdE1hdGNoZWRQYXRoIHdpbGwgYmUgY3VycmVudCBwYXRoIHdoZW4gZG9pbmcgYWN0aW9uXG4gICAgICAgICAgICBjb250ZXh0Lmxhc3RNYXRjaGVkUGF0aCA9IGNvbnRleHQucGF0aDtcbiAgICAgICAgICAgIHJlbGVhc2VJbWFnZShpbWFnZSk7XG4gICAgICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHRhc2suY29uZmlnLmZpbmRSb3V0ZURlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhpdFRhc2tSZXN1bHQ7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZG9BY3Rpb25Gb3JSb3V0ZSA9IGZ1bmN0aW9uIChjb250ZXh0LCBpbWFnZSwgcm91dGUsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImhhbmRsZU1hdGNoZWRSb3V0ZTogXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiLCB0aW1lczogXCIpLmNvbmNhdChjb250ZXh0Lm1hdGNoVGltZXMsIFwiLCBkdXJpbmc6IFwiKS5jb25jYXQoY29udGV4dC5tYXRjaER1cmluZykpO1xuICAgICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzIDwgcm91dGUuc2hvdWxkTWF0Y2hUaW1lcyB8fCBjb250ZXh0Lm1hdGNoRHVyaW5nIDwgcm91dGUuc2hvdWxkTWF0Y2hEdXJpbmcpIHtcbiAgICAgICAgICAgIC8vIHNob3VsZCBzdGlsbCB3YWl0IGZvciBtYXRjaGluZyBjb25kaXRpb25cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV4dFhZID0gKF9hID0gbWF0Y2hlZFBhZ2VzWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmV4dDtcbiAgICAgICAgdmFyIGJhY2tYWSA9IChfYiA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmJhY2s7XG4gICAgICAgIC8vIG1hdGNoZWQgYW5kIGZpdCBjb25kaXRpb24sIGRvIGFjdGlvblxuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKHJvdXRlLmJlZm9yZUFjdGlvbkRlbGF5KTtcbiAgICAgICAgaWYgKHJvdXRlLmFjdGlvbiA9PT0gJ2dvTmV4dCcpIHtcbiAgICAgICAgICAgIGlmIChuZXh0WFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuLnRhcChuZXh0WFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIGFjdGlvbiA9PSBnb05leHQsIGJ1dCBubyBuZXh0IHh5XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3V0ZS5hY3Rpb24gPT09ICdnb0JhY2snKSB7XG4gICAgICAgICAgICBpZiAoYmFja1hZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAoYmFja1hZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBhY3Rpb24gPT0gZ29CYWNrLCBidXQgbm8gYmFjayB4eVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocm91dGUuYWN0aW9uID09PSAna2V5Y29kZUJhY2snKSB7XG4gICAgICAgICAgICBrZXljb2RlKCdCQUNLJywgdGhpcy5zY3JlZW5Db25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvdXRlLmFjdGlvbihjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZFBhZ2VzLCBmaW5pc2hSb3VuZCk7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcChyb3V0ZS5hZnRlckFjdGlvbkRlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5maW5kTWF0Y2hlZFJvdXRlSW1wbCA9IGZ1bmN0aW9uICh0YXNrTmFtZSwgaW1hZ2UsIHJvdGF0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnJvdXRlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IF9hW19pXTtcbiAgICAgICAgICAgIHZhciBfYiA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIHJvdXRlLCB0YXNrTmFtZSksIGlzTWF0Y2hlZCA9IF9iLmlzTWF0Y2hlZCwgbWF0Y2hlZFBhZ2VzID0gX2IubWF0Y2hlZFBhZ2VzO1xuICAgICAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgJ2N1cnJlbnQgbWF0Y2g6JywgbWF0Y2hlZFBhZ2VzLm1hcChmdW5jdGlvbiAocCkgeyByZXR1cm4gcC5uYW1lOyB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZFJvdXRlOiByb3V0ZSwgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBtYXRjaGVkUm91dGU6IG51bGwsIG1hdGNoZWRQYWdlczogW10gfTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc01hdGNoUm91dGVJbXBsID0gZnVuY3Rpb24gKGltYWdlLCByb3RhdGlvbiwgcm91dGUsIHRhc2tOYW1lKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gY2hlY2sgcm90YXRpb25cbiAgICAgICAgaWYgKHJvdXRlLnJvdGF0aW9uICE9PSByb3RhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImZpbmRNYXRjaGVkUm91dGUgXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIG5vdCBtYXRjaCByb3RhdGlvbiwgc2tpcFwiKSk7XG4gICAgICAgICAgICByZXR1cm4geyBpc01hdGNoZWQ6IGZhbHNlLCBtYXRjaGVkUGFnZXM6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgbWF0Y2hlZFBhZ2VzID0gW107XG4gICAgICAgIC8vIGNoZWNrIHJvdXRlLm1hdGNoXG4gICAgICAgIGlmIChyb3V0ZS5tYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJvdXRlLm1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgcm91dGUuZGVidWcpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaChyb3V0ZS5tYXRjaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocm91dGUubWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5Hcm91cFBhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzLCByb3V0ZS5kZWJ1Zyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaC5hcHBseShtYXRjaGVkUGFnZXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgcm91dGUuaXNNYXRjaCBmdW5jdGlvblxuICAgICAgICBpZiAoIWlzTWF0Y2hlZCAmJiByb3V0ZS5jdXN0b21NYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaXNNYXRjaGVkID0gcm91dGUuY3VzdG9tTWF0Y2godGFza05hbWUsIGltYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJmaW5kTWF0Y2hlZFJvdXRlIFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBpc01hdGNoKCkgPT4gXCIpLmNvbmNhdChpc01hdGNoZWQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiZmluZE1hdGNoZWRSb3V0ZSBcIi5jb25jYXQocm91dGUucGF0aCwgXCIgbWF0Y2g6IFwiKS5jb25jYXQoaXNNYXRjaGVkLCBcIiwgZmlyc3RQYWdlOiBcIikuY29uY2F0KChfYSA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzTWF0Y2hlZDogaXNNYXRjaGVkLFxuICAgICAgICAgICAgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNNYXRjaFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBwYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgdGhyZXMgPSAoX2EgPSBwYWdlLnRocmVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwYXJlbnRUaHJlcztcbiAgICAgICAgdmFyIGlzU2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1cIikpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBwYWdlLnBvaW50c1tpXTtcbiAgICAgICAgICAgIHZhciBjb2xvciA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgdmFyIHNjb3JlID0gdXRpbHNfMS5VdGlscy5pZGVudGl0eUNvbG9yKHBvaW50LCBjb2xvcik7XG4gICAgICAgICAgICB2YXIgaXNQb2ludENvbG9yTWF0Y2ggPSBzY29yZSA+PSB0aHJlcztcbiAgICAgICAgICAgIGlmICghaXNQb2ludENvbG9yTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpc1NhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwicG9pbnRbXCIuY29uY2F0KGksIFwiXSBtYXRjaCBmYWxzZTogc2NvcmU6IFwiKS5jb25jYXQoc2NvcmUsIFwiLCB0aHJlczogXCIpLmNvbmNhdCh0aHJlcywgXCJcXG5cIiksIFwiZXhwZWN0OiBcIi5jb25jYXQodXRpbHNfMS5VdGlscy5mb3JtYXRYWVJHQihwb2ludCksIFwiXFxuXCIpLCBcIiAgIGdldDogXCIuY29uY2F0KHV0aWxzXzEuVXRpbHMuZm9ybWF0WFlSR0IoX19hc3NpZ24oX19hc3NpZ24oe30sIGNvbG9yKSwgeyB4OiBwb2ludC54LCB5OiBwb2ludC55IH0pKSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1bbWF0Y2g6IFwiKS5jb25jYXQoaXNTYW1lLCBcIl1cIikpO1xuICAgICAgICByZXR1cm4gaXNTYW1lO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzTWF0Y2hHcm91cFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBncm91cFBhZ2UsIHBhcmVudFRocmVzLCBkZWJ1Zykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciB0aHJlcyA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgZGVidWcpO1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcImNoZWNrTWF0Y2hHcm91cFBhZ2U6IFwiLmNvbmNhdChncm91cFBhZ2UubmFtZSwgXCIsIHBhZ2VbXCIpLmNvbmNhdChpLCBcIl06IFwiKS5jb25jYXQocGFnZS5uYW1lLCBcIiBtYXRjaDogXCIpLmNvbmNhdChpc1BhZ2VNYXRjaCkpO1xuICAgICAgICAgICAgaWYgKGdyb3VwUGFnZS5tYXRjaE9QID09PSAnfHwnICYmIGlzUGFnZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwYWdlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncm91cFBhZ2UubWF0Y2hPUCA9PT0gJyYmJyAmJiAhaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwUGFnZS5tYXRjaE9QID09PSAnJiYnID8gZ3JvdXBQYWdlLnBhZ2VzIDogW107XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbC5hcHBseSh0aGlzLCBfX3NwcmVhZEFycmF5KFt0aGlzLmRlYnVnXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5sb2dJbXBsID0gZnVuY3Rpb24gKGRlYnVnKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVidWcgfHwgIXRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbmx5IGxvZyB3aGVuIGRlYnVnICsgdGhpcy5kZWJ1ZyBpcyB0cnVlXG4gICAgICAgIHV0aWxzXzEuVXRpbHMubG9nLmFwcGx5KHV0aWxzXzEuVXRpbHMsIF9fc3ByZWFkQXJyYXkoWydbUmVyb3V0ZXJdW2RlYnVnXSddLCBhcmdzLCBmYWxzZSkpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5sb2cuYXBwbHkodXRpbHNfMS5VdGlscywgX19zcHJlYWRBcnJheShbJ1tSZXJvdXRlcl1bd2FybmluZ10nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIHJldHVybiBSZXJvdXRlcjtcbn0oKSk7XG5leHBvcnRzLlJlcm91dGVyID0gUmVyb3V0ZXI7XG5leHBvcnRzLnJlcm91dGVyID0gbmV3IFJlcm91dGVyKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXJvdXRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2NyZWVuID0gdm9pZCAwO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBTY3JlZW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2NyZWVuKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgU2NyZWVuLnByb3RvdHlwZS5jYWxjdWxhdGVEZXZpY2VPZmZzZXQgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGZ1bmModGhpcyk7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoID0gcmVzdWx0cy5zY3JlZW5XaWR0aDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0ID0gcmVzdWx0cy5zY3JlZW5IZWlnaHQ7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFggPSByZXN1bHRzLnNjcmVlbk9mZnNldFg7XG4gICAgICAgIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFkgPSByZXN1bHRzLnNjcmVlbk9mZnNldFk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblggPSBmdW5jdGlvbiAoZGV2WCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYICsgKGRldlggKiB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCkgLyB0aGlzLmNvbmZpZy5kZXZXaWR0aCkgfHwgMDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWSA9IGZ1bmN0aW9uIChkZXZZKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFkgKyAoZGV2WSAqIHRoaXMuY29uZmlnLnNjcmVlbkhlaWdodCkgLyB0aGlzLmNvbmZpZy5kZXZIZWlnaHQpIHx8IDA7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblhZID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldFNjcmVlblhZIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHRhcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgdGFwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwRG93biA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICB0YXBEb3duKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICB0YXBEb3duKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUubW92ZVRvID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIG1vdmVUbyh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgbW92ZVRvKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwVXAgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgdGFwVXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHRhcFVwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuQ29sb3IgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWcsIHAxLngsIHAxLnkpO1xuICAgICAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGltZyA9IHRoaXMuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICAgICAgdmFyIHJnYiA9IGdldEltYWdlQ29sb3IoaW1nLCBwMSwgcDIpO1xuICAgICAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFwRG93biB3cm9uZyBwYXJhbXMgXCIuY29uY2F0KHAxLCBcIiwgXCIpLmNvbmNhdChwMikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmZpbmRJbWFnZSA9IGZ1bmN0aW9uIChkZXZJbWcpIHtcbiAgICAgICAgdmFyIGltZyA9IHRoaXMuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZmluZEltYWdlKGltZywgZGV2SW1nKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltZyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLnRhcEltYWdlID0gZnVuY3Rpb24gKGRldkltZykge1xuICAgICAgICB2YXIgeHkgPSB0aGlzLmZpbmRJbWFnZShkZXZJbWcpO1xuICAgICAgICB0aGlzLnRhcCh4eSk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmlzU2FtZUNvbG9yID0gZnVuY3Rpb24gKGRldkNvbG9yUG9pbnQsIHRocmVzKSB7XG4gICAgICAgIGlmICh0aHJlcyA9PT0gdm9pZCAwKSB7IHRocmVzID0gMC45OyB9XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLmdldFNjcmVlbkNvbG9yKGRldkNvbG9yUG9pbnQpO1xuICAgICAgICB2YXIgc2NvcmUgPSB1dGlsc18xLlV0aWxzLmlkZW50aXR5Q29sb3IocmdiLCBkZXZDb2xvclBvaW50KTtcbiAgICAgICAgaWYgKHNjb3JlID4gdGhyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8vIGN1cnJlbnRseSByZWFsIGRldmljZSBzY3JlZW5zaG90XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXREZXZpY2VTY3JlZW5zaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdCgpO1xuICAgIH07XG4gICAgLy8gY3VycmVudGx5IGRldmljZSBzY3JlZW5zaG90IGN1dCBieSBvZmZzZXRcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90TW9kaWZ5KHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFgsIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFksIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIDEwMCk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldEN2dERldlNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90TW9kaWZ5KHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFgsIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFksIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIHRoaXMuY29uZmlnLmRldldpZHRoLCB0aGlzLmNvbmZpZy5kZXZIZWlnaHQsIDEwMCk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EgPSBnZXRTY3JlZW5TaXplKCksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRJbWFnZVJvdGF0aW9uID0gZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgIHZhciBfYSA9IGdldEltYWdlU2l6ZShpbWFnZSksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5zZXRBY3Rpb25EdXJpbmcgPSBmdW5jdGlvbiAoZHVyaW5nKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyA9IGR1cmluZztcbiAgICB9O1xuICAgIFNjcmVlbi5kZWJ1ZyA9IGZhbHNlO1xuICAgIHJldHVybiBTY3JlZW47XG59KCkpO1xuZXhwb3J0cy5TY3JlZW4gPSBTY3JlZW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY3JlZW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY3JlZW5Db25maWcgPSBleHBvcnRzLkRlZmF1bHRSZXJvdXRlckNvbmZpZyA9IGV4cG9ydHMuRGVmYXVsdENvbmZpZ1ZhbHVlID0gZXhwb3J0cy5Hcm91cFBhZ2UgPSBleHBvcnRzLlBhZ2UgPSB2b2lkIDA7XG52YXIgUGFnZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYWdlKG5hbWUsIGRldlBvaW50cywgbmV4dCwgYmFjaywgdGhyZXMpIHtcbiAgICAgICAgaWYgKG5leHQgPT09IHZvaWQgMCkgeyBuZXh0ID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmIChiYWNrID09PSB2b2lkIDApIHsgYmFjayA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodGhyZXMgPT09IHZvaWQgMCkgeyB0aHJlcyA9IHVuZGVmaW5lZDsgfVxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnBvaW50cyA9IGRldlBvaW50cztcbiAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgdGhpcy5iYWNrID0gYmFjaztcbiAgICAgICAgdGhpcy50aHJlcyA9IHRocmVzO1xuICAgIH1cbiAgICByZXR1cm4gUGFnZTtcbn0oKSk7XG5leHBvcnRzLlBhZ2UgPSBQYWdlO1xudmFyIEdyb3VwUGFnZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHcm91cFBhZ2UobmFtZSwgcGFnZXMsIG5leHQsIGJhY2ssIHRocmVzLCBtYXRjaE9QKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSB2b2lkIDApIHsgbmV4dCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAoYmFjayA9PT0gdm9pZCAwKSB7IGJhY2sgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKG1hdGNoT1AgPT09IHZvaWQgMCkgeyBtYXRjaE9QID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucGFnZXMgPSBwYWdlcztcbiAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgdGhpcy5iYWNrID0gYmFjaztcbiAgICAgICAgdGhpcy50aHJlcyA9IHRocmVzO1xuICAgICAgICB0aGlzLm1hdGNoT1AgPSBtYXRjaE9QIHx8ICd8fCc7XG4gICAgfVxuICAgIHJldHVybiBHcm91cFBhZ2U7XG59KCkpO1xuZXhwb3J0cy5Hcm91cFBhZ2UgPSBHcm91cFBhZ2U7XG5leHBvcnRzLkRlZmF1bHRDb25maWdWYWx1ZSA9IHtcbiAgICBYWVJHQlRocmVzOiAwLjksXG4gICAgUGFnZVRocmVzOiAwLjksXG4gICAgR3JvdXBQYWdlVGhyZXM6IDAuOSxcbiAgICBHcm91cFBhZ2VNYXRjaE9QOiAnfHwnLFxuICAgIFJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hUaW1lczogMSxcbiAgICBSb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoRHVyaW5nOiAwLFxuICAgIFJvdXRlQ29uZmlnQmVmb3JlQWN0aW9uRGVsYXk6IDI1MCxcbiAgICBSb3V0ZUNvbmZpZ0FmdGVyQWN0aW9uRGVsYXk6IDI1MCxcbiAgICBSb3V0ZUNvbmZpZ1ByaW9yaXR5OiAxLFxuICAgIFJvdXRlQ29uZmlnRGVidWc6IGZhbHNlLFxuICAgIFRhc2tDb25maWdNYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgVGFza0NvbmZpZ01heFRhc2tEdXJpbmc6IDAsXG4gICAgVGFza0NvbmZpZ01pblJvdW5kSW50ZXJ2YWw6IDAsXG4gICAgVGFza0NvbmZpZ0F1dG9TdG9wOiBmYWxzZSxcbiAgICBUYXNrQ29uZmlnRmluZFJvdXRlRGVsYXk6IDIwMDAsXG59O1xuZXhwb3J0cy5EZWZhdWx0UmVyb3V0ZXJDb25maWcgPSB7XG4gICAgcGFja2FnZU5hbWU6ICcnLFxuICAgIHRhc2tEZWxheTogMjAwMCxcbiAgICBzdGFydEFwcERlbGF5OiA2MDAwLFxuICAgIGF1dG9MYXVuY2hBcHA6IHRydWUsXG4gICAgdGVzdGluZ1NjcmVlbnNob3RQYXRoOiAnLi9zY3JlZW5zaG90Jyxcbn07XG5leHBvcnRzLkRlZmF1bHRTY3JlZW5Db25maWcgPSB7XG4gICAgZGV2V2lkdGg6IDY0MCxcbiAgICBkZXZIZWlnaHQ6IDM2MCxcbiAgICBkZXZpY2VXaWR0aDogMCxcbiAgICBkZXZpY2VIZWlnaHQ6IDAsXG4gICAgc2NyZWVuV2lkdGg6IDAsXG4gICAgc2NyZWVuSGVpZ2h0OiAwLFxuICAgIHNjcmVlbk9mZnNldFg6IDAsXG4gICAgc2NyZWVuT2Zmc2V0WTogMCxcbiAgICBhY3Rpb25EdXJpbmc6IDE4MCxcbiAgICByb3RhdGlvbjogJ2hvcml6b250YWwnLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cnVjdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVXRpbHMgPSBleHBvcnRzLmxvZyA9IHZvaWQgMDtcbmZ1bmN0aW9uIGxvZygpIHtcbiAgICB2YXIgbXNncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG1zZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHtcbiAgICAgICAgdGltZVpvbmU6ICdBc2lhL1RhaXBlaScsXG4gICAgfSk7XG4gICAgdmFyIG1lc3NhZ2UgPSBcIltcIi5jb25jYXQoZGF0ZSwgXCJdIFwiKTtcbiAgICBmb3IgKHZhciBfYSA9IDAsIG1zZ3NfMSA9IG1zZ3M7IF9hIDwgbXNnc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICB2YXIgbXNnID0gbXNnc18xW19hXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiXCIuY29uY2F0KEpTT04uc3RyaW5naWZ5KG1zZyksIFwiIFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJcIi5jb25jYXQobXNnLCBcIiBcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2cobWVzc2FnZS5zdWJzdHIoMCwgbWVzc2FnZS5sZW5ndGggLSAxKSk7XG59XG5leHBvcnRzLmxvZyA9IGxvZztcbnZhciBVdGlscyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVdGlscygpIHtcbiAgICB9XG4gICAgVXRpbHMuaWRlbnRpdHlDb2xvciA9IGZ1bmN0aW9uIChlMSwgZTIpIHtcbiAgICAgICAgdmFyIG1lYW4gPSAoZTEuciArIGUyLnIpIC8gMjtcbiAgICAgICAgdmFyIHIgPSBlMS5yIC0gZTIucjtcbiAgICAgICAgdmFyIGcgPSBlMS5nIC0gZTIuZztcbiAgICAgICAgdmFyIGIgPSBlMS5iIC0gZTIuYjtcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnNxcnQoKCgoNTEyICsgbWVhbikgKiByICogcikgPj4gOCkgKyA0ICogZyAqIGcgKyAoKCg3NjcgLSBtZWFuKSAqIGIgKiBiKSA+PiA4KSkgLyA3Njg7XG4gICAgfTtcbiAgICBVdGlscy5mb3JtYXRYWVJHQiA9IGZ1bmN0aW9uICh4eXJnYikge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHh5cmdiKTtcbiAgICAgICAgdmFyIGZvcm1hdE9iaiA9IHt9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzXzFbX2ldO1xuICAgICAgICAgICAgdmFyIHN0ciA9IFwiXCIuY29uY2F0KHh5cmdiW2tdKTtcbiAgICAgICAgICAgIHdoaWxlIChzdHIubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgIHN0ciA9ICcgJyArIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcm1hdE9ialtrXSA9IHN0cjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeCA9IGZvcm1hdE9iai54LCB5ID0gZm9ybWF0T2JqLnksIHIgPSBmb3JtYXRPYmouciwgZyA9IGZvcm1hdE9iai5nLCBiID0gZm9ybWF0T2JqLmI7XG4gICAgICAgIHJldHVybiBcInsgeDogXCIuY29uY2F0KHgsIFwiLCB5OiBcIikuY29uY2F0KHksIFwiLCByOiBcIikuY29uY2F0KHIsIFwiLCBnOiBcIikuY29uY2F0KGcsIFwiLCBiOiBcIikuY29uY2F0KGIsIFwiIH1cIik7XG4gICAgfTtcbiAgICBVdGlscy5zb3J0U3RyaW5nTnVtYmVyTWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBrZXk6IGtleSwgY291bnQ6IG1hcFtrZXldIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5jb3VudCAtIGEuY291bnQ7IH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuICAgIFV0aWxzLnNsZWVwID0gZnVuY3Rpb24gKGR1cmluZykge1xuICAgICAgICB3aGlsZSAoZHVyaW5nID4gMjAwKSB7XG4gICAgICAgICAgICBkdXJpbmcgLT0gMjAwO1xuICAgICAgICAgICAgc2xlZXAoMjAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHVyaW5nID4gMCkge1xuICAgICAgICAgICAgc2xlZXAoZHVyaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuZ2V0VGFpd2FuVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93KCkgKyA4ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfTtcbiAgICBVdGlscy5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJnc1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBKU09OLnN0cmluZ2lmeShhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoVXRpbHMuZ2V0VGFpd2FuVGltZSgpKTtcbiAgICAgICAgdmFyIGRhdGVTdHJpbmcgPSBcIltcIi5jb25jYXQoZGF0ZS5nZXRNb250aCgpICsgMSwgXCItXCIpLmNvbmNhdChkYXRlLmdldERhdGUoKSwgXCJUXCIpLmNvbmNhdChkYXRlLmdldEhvdXJzKCksIFwiOlwiKS5jb25jYXQoZGF0ZS5nZXRNaW51dGVzKCksIFwiOlwiKS5jb25jYXQoZGF0ZS5nZXRTZWNvbmRzKCksIFwiXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgX19zcHJlYWRBcnJheShbZGF0ZVN0cmluZ10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICBVdGlscy5ub3RpZnlFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgY29udGVudCkge1xuICAgICAgICBpZiAoc2VuZEV2ZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgVXRpbHMubG9nKCdzZW5kRXZlbnQnLCBldmVudCwgY29udGVudCk7XG4gICAgICAgICAgICBzZW5kRXZlbnQoJycgKyBldmVudCwgJycgKyBjb250ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuc3RhcnRBcHAgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgZXhlY3V0ZShcIkJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yazIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvc2VydmljZXMuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3dlYnZpZXdjaHJvbWl1bS5qYXIgYW0gc3RhcnQgLW4gXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgICAgIGV4ZWN1dGUoXCJBTkRST0lEX0RBVEE9L2RhdGEgQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLW9qLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWxpYmFydC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb3JnLmFwYWNoZS5odHRwLmxlZ2FjeS5ib290LmphciBhbSBzdGFydCAtbiBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBtb25rZXkgLS1wY3Qtc3lza2V5cyAwIC1wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSwgXCIgLWMgYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuTEFVTkNIRVIgMVwiKSk7XG4gICAgICAgIGV4ZWN1dGUoJ0FORFJPSURfQk9PVExPR089MSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1JPT1Q9L3N5c3RlbSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0FTU0VUUz0vc3lzdGVtL2FwcCAnICtcbiAgICAgICAgICAgICdBTkRST0lEX0RBVEE9L2RhdGEgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9TVE9SQUdFPS9zdG9yYWdlICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfQVJUX1JPT1Q9L2FwZXgvY29tLmFuZHJvaWQuYXJ0ICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfSTE4Tl9ST09UPS9hcGV4L2NvbS5hbmRyb2lkLmkxOG4gJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9UWkRBVEFfUk9PVD0vYXBleC9jb20uYW5kcm9pZC50emRhdGEgJyArXG4gICAgICAgICAgICAnRVhURVJOQUxfU1RPUkFHRT0vc2RjYXJkICcgK1xuICAgICAgICAgICAgJ0FTRUNfTU9VTlRQT0lOVD0vbW50L2FzZWMgJyArXG4gICAgICAgICAgICAnQk9PVENMQVNTUEFUSD0vYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLW9qLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWxpYmFydC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1pY3U0ai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvb2todHRwLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9ib3VuY3ljYXN0bGUuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLWF0Yi1iYWNrd2FyZC1jb21wYXRpYmlsaXR5LmphcjovYXBleC9jb20uYW5kcm9pZC5jb25zY3J5cHQvamF2YWxpYi9jb25zY3J5cHQuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm1lZGlhL2phdmFsaWIvdXBkYXRhYmxlLW1lZGlhLmphcjovYXBleC9jb20uYW5kcm9pZC5tZWRpYXByb3ZpZGVyL2phdmFsaWIvZnJhbWV3b3JrLW1lZGlhcHJvdmlkZXIuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm9zLnN0YXRzZC9qYXZhbGliL2ZyYW1ld29yay1zdGF0c2QuamFyOi9hcGV4L2NvbS5hbmRyb2lkLnBlcm1pc3Npb24vamF2YWxpYi9mcmFtZXdvcmstcGVybWlzc2lvbi5qYXI6L2FwZXgvY29tLmFuZHJvaWQuc2RrZXh0L2phdmFsaWIvZnJhbWV3b3JrLXNka2V4dGVuc2lvbnMuamFyOi9hcGV4L2NvbS5hbmRyb2lkLndpZmkvamF2YWxpYi9mcmFtZXdvcmstd2lmaS5qYXI6L2FwZXgvY29tLmFuZHJvaWQudGV0aGVyaW5nL2phdmFsaWIvZnJhbWV3b3JrLXRldGhlcmluZy5qYXIgJyArXG4gICAgICAgICAgICAnREVYMk9BVEJPT1RDTEFTU1BBVEg9L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1vai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1saWJhcnQuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtaWN1NGouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL29raHR0cC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYm91bmN5Y2FzdGxlLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay1hdGItYmFja3dhcmQtY29tcGF0aWJpbGl0eS5qYXIgJyArXG4gICAgICAgICAgICAnU1lTVEVNU0VSVkVSQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvbS5hbmRyb2lkLmxvY2F0aW9uLnByb3ZpZGVyLmphcjovc3lzdGVtL2ZyYW1ld29yay9zZXJ2aWNlcy5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXRoZXJuZXQtc2VydmljZS5qYXI6L2FwZXgvY29tLmFuZHJvaWQucGVybWlzc2lvbi9qYXZhbGliL3NlcnZpY2UtcGVybWlzc2lvbi5qYXI6L2FwZXgvY29tLmFuZHJvaWQuaXBzZWMvamF2YWxpYi9hbmRyb2lkLm5ldC5pcHNlYy5pa2UuamFyICcgK1xuICAgICAgICAgICAgXCJtb25rZXkgLS1wY3Qtc3lza2V5cyAwIC1wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSwgXCIgLWMgYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuTEFVTkNIRVIgMVwiKSk7XG4gICAgfTtcbiAgICBVdGlscy5zdG9wQXBwID0gZnVuY3Rpb24gKHBhY2thZ2VOYW1lKSB7XG4gICAgICAgIGV4ZWN1dGUoXCJCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvbnNjcnlwdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb2todHRwLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWp1bml0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9ib3VuY3ljYXN0bGUuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2V4dC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsyLmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvbW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYW5kcm9pZC5wb2xpY3kuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3NlcnZpY2VzLmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay93ZWJ2aWV3Y2hyb21pdW0uamFyIGFtIGZvcmNlLXN0b3AgXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgICAgIGV4ZWN1dGUoXCJBTkRST0lEX0RBVEE9L2RhdGEgQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLW9qLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb3JlLWxpYmFydC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvb3JnLmFwYWNoZS5odHRwLmxlZ2FjeS5ib290LmphciBhbSBmb3JjZS1zdG9wIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgIH07XG4gICAgVXRpbHMuZ2V0Q3VycmVudEFwcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGV4ZWN1dGUoJ2R1bXBzeXMgd2luZG93IHdpbmRvd3MnKS5zcGxpdCgnbUN1cnJlbnRGb2N1cycpO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSByZXN1bHRbMV0uc3BsaXQoJyAnKTtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICByZXR1cm4gWycnLCAnJ107XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0WzJdID0gcmVzdWx0WzJdLnJlcGxhY2UoJ30nLCAnJyk7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFsyXS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSAnJztcbiAgICAgICAgdmFyIGFjdGl2aXR5TmFtZSA9ICcnO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBwYWNrYWdlTmFtZSA9IHJlc3VsdFswXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lID0gcmVzdWx0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgIGFjdGl2aXR5TmFtZSA9IHJlc3VsdFsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwYWNrYWdlTmFtZSwgYWN0aXZpdHlOYW1lXTtcbiAgICB9O1xuICAgIFV0aWxzLmlzQXBwT25Ub3AgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgdmFyIHRvcEluZm8gPSBleGVjdXRlKCdkdW1wc3lzIGFjdGl2aXR5IGFjdGl2aXRpZXMgfCBncmVwIG1SZXN1bWVkQWN0aXZpdHknKTtcbiAgICAgICAgcmV0dXJuIHRvcEluZm8uaW5kZXhPZihwYWNrYWdlTmFtZSkgIT09IC0xO1xuICAgIH07XG4gICAgVXRpbHMuc2VuZFNsYWNrTWVzc2FnZSA9IGZ1bmN0aW9uICh1cmwsIHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBib2R5ID0ge1xuICAgICAgICAgICAgYmxvY2tzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyonICsgdGl0bGUgKyAnKicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkaXZpZGVyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICAgIGh0dHBDbGllbnQoJ1BPU1QnLCB1cmwsIEpTT04uc3RyaW5naWZ5KGJvZHkpLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFV0aWxzLndhaXRGb3JBY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uLCB0aW1lb3V0LCBtYXRjaFRpbWVzLCBpbnRlcnZhbCkge1xuICAgICAgICBpZiAobWF0Y2hUaW1lcyA9PT0gdm9pZCAwKSB7IG1hdGNoVGltZXMgPSAxOyB9XG4gICAgICAgIGlmIChpbnRlcnZhbCA9PT0gdm9pZCAwKSB7IGludGVydmFsID0gNjAwOyB9XG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICB2YXIgbWF0Y2hzID0gMDtcbiAgICAgICAgd2hpbGUgKERhdGUubm93KCkgLSBub3cgPCB0aW1lb3V0KSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICBtYXRjaHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaHMgPj0gbWF0Y2hUaW1lcykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVXRpbHMuc2xlZXAoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaHMgPj0gbWF0Y2hUaW1lcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIFV0aWxzO1xufSgpKTtcbmV4cG9ydHMuVXRpbHMgPSBVdGlscztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsInZhciBjaGFyZW5jID0ge1xuICAvLyBVVEYtOCBlbmNvZGluZ1xuICB1dGY4OiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBjaGFyZW5jLmJpbi5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNoYXJlbmMuYmluLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEJpbmFyeSBlbmNvZGluZ1xuICBiaW46IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgc3RyID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHN0ci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pKTtcbiAgICAgIHJldHVybiBzdHIuam9pbignJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJlbmM7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBiYXNlNjRtYXBcbiAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuXG4gIGNyeXB0ID0ge1xuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIGxlZnRcbiAgICByb3RsOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgYikgfCAobiA+Pj4gKDMyIC0gYikpO1xuICAgIH0sXG5cbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiByaWdodFxuICAgIHJvdHI6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCAoMzIgLSBiKSkgfCAobiA+Pj4gYik7XG4gICAgfSxcblxuICAgIC8vIFN3YXAgYmlnLWVuZGlhbiB0byBsaXR0bGUtZW5kaWFuIGFuZCB2aWNlIHZlcnNhXG4gICAgZW5kaWFuOiBmdW5jdGlvbihuKSB7XG4gICAgICAvLyBJZiBudW1iZXIgZ2l2ZW4sIHN3YXAgZW5kaWFuXG4gICAgICBpZiAobi5jb25zdHJ1Y3RvciA9PSBOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0LnJvdGwobiwgOCkgJiAweDAwRkYwMEZGIHwgY3J5cHQucm90bChuLCAyNCkgJiAweEZGMDBGRjAwO1xuICAgICAgfVxuXG4gICAgICAvLyBFbHNlLCBhc3N1bWUgYXJyYXkgYW5kIHN3YXAgYWxsIGl0ZW1zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpKyspXG4gICAgICAgIG5baV0gPSBjcnlwdC5lbmRpYW4obltpXSk7XG4gICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYW4gYXJyYXkgb2YgYW55IGxlbmd0aCBvZiByYW5kb20gYnl0ZXNcbiAgICByYW5kb21CeXRlczogZnVuY3Rpb24obikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXTsgbiA+IDA7IG4tLSlcbiAgICAgICAgYnl0ZXMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYmlnLWVuZGlhbiAzMi1iaXQgd29yZHNcbiAgICBieXRlc1RvV29yZHM6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciB3b3JkcyA9IFtdLCBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KVxuICAgICAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpO1xuICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGJpZy1lbmRpYW4gMzItYml0IHdvcmRzIHRvIGEgYnl0ZSBhcnJheVxuICAgIHdvcmRzVG9CeXRlczogZnVuY3Rpb24od29yZHMpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOClcbiAgICAgICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xuICAgIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBoZXggPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4RikudG9TdHJpbmcoMTYpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgIGJ5dGVzVG9CYXNlNjQ6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBiYXNlNjQgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICB2YXIgdHJpcGxldCA9IChieXRlc1tpXSA8PCAxNikgfCAoYnl0ZXNbaSArIDFdIDw8IDgpIHwgYnl0ZXNbaSArIDJdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKylcbiAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA8PSBieXRlcy5sZW5ndGggKiA4KVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goYmFzZTY0bWFwLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRikpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKCc9Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYmFzZS02NCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgYmFzZTY0VG9CeXRlczogZnVuY3Rpb24oYmFzZTY0KSB7XG4gICAgICAvLyBSZW1vdmUgbm9uLWJhc2UtNjQgY2hhcmFjdGVyc1xuICAgICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL1teQS1aMC05K1xcL10vaWcsICcnKTtcblxuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDAsIGltb2Q0ID0gMDsgaSA8IGJhc2U2NC5sZW5ndGg7XG4gICAgICAgICAgaW1vZDQgPSArK2kgJSA0KSB7XG4gICAgICAgIGlmIChpbW9kNCA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgYnl0ZXMucHVzaCgoKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgJiAoTWF0aC5wb3coMiwgLTIgKiBpbW9kNCArIDgpIC0gMSkpIDw8IChpbW9kNCAqIDIpKVxuICAgICAgICAgICAgfCAoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpKSkgPj4+ICg2IC0gaW1vZDQgKiAyKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNyeXB0O1xufSkoKTtcbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNyeXB0ID0gcmVxdWlyZSgnY3J5cHQnKSxcclxuICAgICAgdXRmOCA9IHJlcXVpcmUoJ2NoYXJlbmMnKS51dGY4LFxyXG4gICAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpLFxyXG4gICAgICBiaW4gPSByZXF1aXJlKCdjaGFyZW5jJykuYmluLFxyXG5cclxuICAvLyBUaGUgY29yZVxyXG4gIG1kNSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICAvLyBDb252ZXJ0IHRvIGJ5dGUgYXJyYXlcclxuICAgIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09IFN0cmluZylcclxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGluZyA9PT0gJ2JpbmFyeScpXHJcbiAgICAgICAgbWVzc2FnZSA9IGJpbi5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbWVzc2FnZSA9IHV0Zjguc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgIGVsc2UgaWYgKGlzQnVmZmVyKG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWVzc2FnZSwgMCk7XHJcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlKSAmJiBtZXNzYWdlLmNvbnN0cnVjdG9yICE9PSBVaW50OEFycmF5KVxyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS50b1N0cmluZygpO1xyXG4gICAgLy8gZWxzZSwgYXNzdW1lIGJ5dGUgYXJyYXkgYWxyZWFkeVxyXG5cclxuICAgIHZhciBtID0gY3J5cHQuYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpLFxyXG4gICAgICAgIGwgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXHJcbiAgICAgICAgYSA9ICAxNzMyNTg0MTkzLFxyXG4gICAgICAgIGIgPSAtMjcxNzMzODc5LFxyXG4gICAgICAgIGMgPSAtMTczMjU4NDE5NCxcclxuICAgICAgICBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgICAvLyBTd2FwIGVuZGlhblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSAoKG1baV0gPDwgIDgpIHwgKG1baV0gPj4+IDI0KSkgJiAweDAwRkYwMEZGIHxcclxuICAgICAgICAgICAgICgobVtpXSA8PCAyNCkgfCAobVtpXSA+Pj4gIDgpKSAmIDB4RkYwMEZGMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFkZGluZ1xyXG4gICAgbVtsID4+PiA1XSB8PSAweDgwIDw8IChsICUgMzIpO1xyXG4gICAgbVsoKChsICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGw7XHJcblxyXG4gICAgLy8gTWV0aG9kIHNob3J0Y3V0c1xyXG4gICAgdmFyIEZGID0gbWQ1Ll9mZixcclxuICAgICAgICBHRyA9IG1kNS5fZ2csXHJcbiAgICAgICAgSEggPSBtZDUuX2hoLFxyXG4gICAgICAgIElJID0gbWQ1Ll9paTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XHJcblxyXG4gICAgICB2YXIgYWEgPSBhLFxyXG4gICAgICAgICAgYmIgPSBiLFxyXG4gICAgICAgICAgY2MgPSBjLFxyXG4gICAgICAgICAgZGQgPSBkO1xyXG5cclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgMF0sICA3LCAtNjgwODc2OTM2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDRdLCAgNywgLTE3NjQxODg5Nyk7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDcsICAxNzcwMDM1NDE2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krMTJdLCAgNywgIDE4MDQ2MDM2ODIpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDFdLCAgNSwgLTE2NTc5NjUxMCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDZdLCAgOSwgLTEwNjk1MDE2MzIpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA1XSwgIDUsIC03MDE1NTg2OTEpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzEwXSwgIDksICAzODAxNjA4Myk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDldLCAgNSwgIDU2ODQ0NjQzOCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTRdLCAgOSwgLTEwMTk4MDM2OTApO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsxM10sICA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDJdLCAgOSwgLTUxNDAzNzg0KTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgNV0sICA0LCAtMzc4NTU4KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDFdLCAgNCwgLTE1MzA5OTIwNjApO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krMTNdLCAgNCwgIDY4MTI3OTE3NCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgOV0sICA0LCAtNjQwMzY0NDg3KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDBdLCAgNiwgLTE5ODYzMDg0NCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDYsICAxNzAwNDg1NTcxKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgOF0sICA2LCAgMTg3MzMxMzM1OSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDYsIC0xNDU1MjMwNzApO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICAgIGEgPSAoYSArIGFhKSA+Pj4gMDtcclxuICAgICAgYiA9IChiICsgYmIpID4+PiAwO1xyXG4gICAgICBjID0gKGMgKyBjYykgPj4+IDA7XHJcbiAgICAgIGQgPSAoZCArIGRkKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3J5cHQuZW5kaWFuKFthLCBiLCBjLCBkXSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG4gIG1kNS5fZmYgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgYyB8IH5iICYgZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5fZ2cgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgZCB8IGMgJiB+ZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faGggID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2lpICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYyBeIChiIHwgfmQpKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcblxyXG4gIC8vIFBhY2thZ2UgcHJpdmF0ZSBibG9ja3NpemVcclxuICBtZDUuX2Jsb2Nrc2l6ZSA9IDE2O1xyXG4gIG1kNS5fZGlnZXN0c2l6ZSA9IDE2O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IG51bGwpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBhcmd1bWVudCAnICsgbWVzc2FnZSk7XHJcblxyXG4gICAgdmFyIGRpZ2VzdGJ5dGVzID0gY3J5cHQud29yZHNUb0J5dGVzKG1kNShtZXNzYWdlLCBvcHRpb25zKSk7XHJcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmFzQnl0ZXMgPyBkaWdlc3RieXRlcyA6XHJcbiAgICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLmFzU3RyaW5nID8gYmluLmJ5dGVzVG9TdHJpbmcoZGlnZXN0Ynl0ZXMpIDpcclxuICAgICAgICBjcnlwdC5ieXRlc1RvSGV4KGRpZ2VzdGJ5dGVzKTtcclxuICB9O1xyXG5cclxufSkoKTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhY2thZ2VOYW1lOiBzdHJpbmcgPSAnY29tLmNvbTJ1cy5uaW5lcGIzZC5ub3JtYWwuZnJlZWZ1bGwuZ29vZ2xlLmdsb2JhbC5hbmRyb2lkLmNvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVZZWFyTWluOiBudW1iZXIgPSAyMDIzO1xuZXhwb3J0IGNvbnN0IHNsZWVwU2hvcnQ6IG51bWJlciA9IDE1MDA7XG5leHBvcnQgY29uc3Qgc2xlZXBNZWRpdW06IG51bWJlciA9IDMwMDA7XG5leHBvcnQgY29uc3Qgc2xlZXBMb25nOiBudW1iZXIgPSA0MDAwO1xuZXhwb3J0IGNvbnN0IHNsZWVwV2FpdFBhZ2VMb25nOiBudW1iZXIgPSAyNCAqIDEwMDA7XG5leHBvcnQgY29uc3Qgc2xlZXBGb3JBZDogbnVtYmVyID0gMzAgKiAxMDAwO1xuZXhwb3J0IGNvbnN0IG1pbnV0ZUluTXM6IG51bWJlciA9IDYwICogMTAwMDtcbmV4cG9ydCBjb25zdCBob3VySW5NczogbnVtYmVyID0gbWludXRlSW5NcyAqIDYwO1xuZXhwb3J0IGNvbnN0IGRheUluTXM6IG51bWJlciA9IGhvdXJJbk1zICogMjQ7XG5leHBvcnQgY29uc3QgZHVyaW5nTWF4QWRSZXRyeTogbnVtYmVyID0gMiAqIG1pbnV0ZUluTXM7XG5cbmV4cG9ydCBjb25zdCBzd2l0Y2hXYWl0aW5nTG9naW5QYWdlc0ludGVydmFsOiBudW1iZXIgPSAzMCAqIG1pbnV0ZUluTXM7XG5leHBvcnQgY29uc3Qgc2VuZFJ1bm5pbmdFdmVudEludGVydmFsOiBudW1iZXIgPSA1ICogbWludXRlSW5NcztcbmV4cG9ydCBjb25zdCBzZW5kV2FpdElucHV0RXZlbnRJbnRlcnZhbDogbnVtYmVyID0gNSAqIG1pbnV0ZUluTXM7XG5leHBvcnQgY29uc3QgdXBsb2FkU2Vzc2lvbkludGVydmFsOiBudW1iZXIgPSAxICogaG91ckluTXM7XG4iLCJpbXBvcnQgeyBVdGlscywgUm91dGVDb25maWcgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQgeyByZXJvdXRlciwgQ29uZmlnLCBzdGF0ZSB9IGZyb20gJy4vbW9kdWxlcyc7XG5pbXBvcnQgeyBUQVNLLCB3ZWVrbHlNaXNzaW9uIH0gZnJvbSAnLi90YXNrcyc7XG5pbXBvcnQgKiBhcyBDT05TVEFOVFMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgKiBhcyBQQUdFIGZyb20gJy4vcGFnZXMnO1xuaW1wb3J0IHsgaXNTYW1lQ29sb3IsIGdldENvbG9yQ291bnRJblJhbmdlLCBpc1NhbWVDb2xvckNvdW50LCBhcnJheUZpbmQsIFNhdmVQYWdlUmVmZXJlbmNlIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IFZFUlNJT05fQ09ERTogbnVtYmVyID0gMTUuMzM7XG5cbmV4cG9ydCBjbGFzcyBNTEI5SSB7XG4gIHB1YmxpYyBzdGF0aWMgcGFja2FnZU5hbWU6IHN0cmluZyA9ICdjb20uY29tMnVzLm5pbmVwYjNkLm5vcm1hbC5mcmVlZnVsbC5nb29nbGUuZ2xvYmFsLmFuZHJvaWQuY29tbW9uJztcblxuICBjb25zdHJ1Y3Rvcihqc29uQ29uZmlnOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZygnIyMjIyMjIyMjIyMjIG5ldyBNTEI5SSAjIyMjIyMjIyMjIyMnKTtcbiAgICBjb25zb2xlLmxvZyhgc2NyaXB0IHZlcnNpb24gJHtWRVJTSU9OX0NPREV9YCk7XG4gICAgc3RhdGUuaW5pdChqc29uQ29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpIHtcbiAgICBpZiAoQ29uZmlnLmNvbmZpZy5pc0xvY2FsUGFpZCkge1xuICAgICAgdmFyIHBsYW4gPSBnZXRVc2VyUGxhbigpO1xuICAgICAgaWYgKHBsYW4gIT0gJ3VzZXJfcGxhbl9tbGI5aScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VzZXIgcGxhbiBpZDogJywgSlNPTi5zdHJpbmdpZnkocGxhbikpO1xuICAgICAgICBjb25zb2xlLmxvZygncGxlYXNlIHN1YnNjcmliZSBwcmVtaXVtIHBsYW4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlc0FuZFRhc2tzKCk7XG4gICAgcmVyb3V0ZXIuc3RhcnQoTUxCOUkucGFja2FnZU5hbWUpO1xuICB9XG4gIHB1YmxpYyBzdG9wKCkge1xuICAgIHJlcm91dGVyLnN0b3AoKTtcbiAgICBzdGF0ZS5lbmQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRSb3V0ZXNBbmRUYXNrcygpIHtcbiAgICB0aGlzLmFkZFJvdXRlcygpO1xuICAgIHRoaXMuaGFuZGxlVW5rbm93bigpO1xuICAgIC8vIHJlcm91dGVyLmdldEN1cnJlbnRNYXRjaE5hbWVzKCk7XG5cbiAgICBpZiAoQ29uZmlnLmNvbmZpZy5pc0xvY2FsUGFpZCB8fCBDb25maWcuY29uZmlnLmlzRGV2KSB7XG4gICAgICB0aGlzLmFkZFByZW1pdW1UYXNrcygpO1xuICAgICAgdGhpcy5hZGRCYXNpY1Rhc2tzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICB0aGlzLmFkZEJhc2ljVGFza3MoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFDb25maWcuY29uZmlnLmxpY2Vuc2VJZCkge1xuICAgICAgY29uc29sZS5sb2coJ25vIGxpY2Vuc2UgaWQnKTtcbiAgICAgIHRoaXMuYWRkU3RheUluTG9naW5UYXNrcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWRkUHJlbWl1bVRhc2tzKCk7XG4gICAgdGhpcy5hZGRCYXNpY1Rhc2tzKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkQmFzaWNUYXNrcygpIHtcbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0sucGxheUxlYWd1ZUdhbWUsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDIsXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgYWRkUHJlbWl1bVRhc2tzKCkge1xuICAgIC8vIG9ubHkgcnVuIG9uY2VcbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0suc2V0dGluZ0RlZmF1bHQsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgICBtaW5Sb3VuZEludGVydmFsOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICBtYXhUYXNrRHVyaW5nOiAxMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gRklYTUU6IHRoaXMgc2hvdWxkIG9ubHkgcnVuIHdoZW4gbmVlZGVkXG4gICAgcmVyb3V0ZXIuYWRkVGFzayh7XG4gICAgICBuYW1lOiBUQVNLLnNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzLFxuICAgICAgbWluUm91bmRJbnRlcnZhbDogMSAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgbWF4VGFza0R1cmluZzogMTAgKiBDT05TVEFOVFMubWludXRlSW5NcyxcbiAgICAgIGJlZm9yZVJvdXRlOiB0YXNrID0+IHtcbiAgICAgICAgaWYgKCFzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzKSB7XG4gICAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5yZXN0YXJ0QXBwUGVyRGF5LFxuICAgICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgICAgbWluUm91bmRJbnRlcnZhbDogQ09OU1RBTlRTLmRheUluTXMsXG4gICAgICBiZWZvcmVSb3V0ZTogdGFzayA9PiB7XG4gICAgICAgIGlmICh0YXNrLmxhc3RSdW5UaW1lICE9PSAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3RhcnQgYXBwIHRhc2snKTtcbiAgICAgICAgICByZXJvdXRlci5yZXN0YXJ0QXBwKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdza2lwUm91dGVMb29wJztcbiAgICAgIH0sXG4gICAgICBtYXhUYXNrRHVyaW5nOiAzMCAqIENPTlNUQU5UUy5taW51dGVJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgd2Vla2x5TWlzc2lvbi5hZGRUYXNrKCk7XG5cbiAgICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICAgIG5hbWU6IFRBU0suYWRSZXdhcmQsXG4gICAgICAvLyBtYXhUYXNrUnVuVGltZXM6IDEsXG4gICAgICBtaW5Sb3VuZEludGVydmFsOiBDT05TVEFOVFMubWludXRlSW5NcyAqIDMwLFxuICAgICAgZmluZFJvdXRlRGVsYXk6IENPTlNUQU5UUy5zbGVlcE1lZGl1bSxcblxuICAgICAgbWF4VGFza0R1cmluZzogQ09OU1RBTlRTLnNsZWVwRm9yQWQgKyBDT05TVEFOVFMuZHVyaW5nTWF4QWRSZXRyeSxcbiAgICAgIGZvcmNlU3RvcDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5wbGF5QmF0dGxlR2FtZSxcbiAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5ob3VySW5NcyxcbiAgICAgIG1heFRhc2tEdXJpbmc6IDEwICogQ09OU1RBTlRTLmhvdXJJbk1zLFxuICAgICAgZm9yY2VTdG9wOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRTdGF5SW5Mb2dpblRhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogVEFTSy5zdGF5SW5Mb2dpbixcbiAgICAgIGZvcmNlU3RvcDogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzKCkge1xuICAgIC8vICoqIGxhdW5jaGluZyBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxvZ28ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubG9nbyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3YWl0IGFwcCBsb2FkaW5nIC4uLicpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcblxuICAgICAgICAvLyByZW9wZW4gaWYgc3R1Y2tcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKG5vdyAtIGNvbnRleHQubWF0Y2hTdGFydFRTID4gNSAqIENPTlNUQU5UUy5taW51dGVJbk1zKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0dWNrIGluIGxhdW5jaCBwYWdlIHRvbyBsb25nLCByZXN0YXJ0IGFwcCcpO1xuICAgICAgICAgIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sYW5kaW5nTG9hZGluZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sYW5kaW5nTG9hZGluZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oXyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsYW5kaW5nIGxvYWRpbmcuLi4nKTtcbiAgICAgICAgc3RhdGUub25MYXVuY2hpbmcoKTtcbiAgICAgIH0pLFxuICAgICAgYWZ0ZXJBY3Rpb25EZWxheTogQ09OU1RBTlRTLnNsZWVwTWVkaXVtLFxuICAgIH0pO1xuICAgIFtQQUdFLmRvd25sb2FkRGF0YSwgUEFHRS5wcm9ncmVzc0JhclJ1bm5pbmddLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiBDT05TVEFOVFMuc2xlZXBMb25nLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgW1BBR0UuVE9TLCBQQUdFLlRPUzkwLCBQQUdFLlRPUzkwdjJdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAqKiBsb2dpbiBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxhbmRpbmcubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGFuZGluZyxcbiAgICAgIGFjdGlvbjogY29udGV4dCA9PiB7XG4gICAgICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5vbkxvZ2luUGFnZSgpO1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0suc3RheUluTG9naW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnc3RheSBpbiBsb2dpbicpO1xuICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoRHVyaW5nIDwgQ09OU1RBTlRTLnN3aXRjaFdhaXRpbmdMb2dpblBhZ2VzSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIGhpdmUgbG9naW4gZm9yIGF2b2lkIGFwcCBjcnVzaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGFuZGluZyk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgW1BBR0UubG9nSW4sIFBBR0UubG9nSW45MF0uZm9yRWFjaChwID0+IHtcbiAgICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgICAgcGF0aDogYC8ke3AubmFtZX1gLFxuICAgICAgICBtYXRjaDogcCxcbiAgICAgICAgYWN0aW9uOiBjb250ZXh0ID0+IHtcbiAgICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaXNDbG91ZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0YXkgaW4gbG9naW4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBuZWVkVXNlcklucHV0ID0gY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0suc3RheUluTG9naW47XG4gICAgICAgICAgc3RhdGUub25Mb2dpblBhZ2UobmVlZFVzZXJJbnB1dCk7XG5cbiAgICAgICAgICBpZiAoIW5lZWRVc2VySW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF5IGluIGxvZ2luJyk7XG4gICAgICAgICAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdrZXljb2RlIGJhY2snKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tYXRjaER1cmluZyA8IENPTlNUQU5UUy5zd2l0Y2hXYWl0aW5nTG9naW5QYWdlc0ludGVydmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayBiYWNrIGZvciBhdm9pZCBzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygna2V5Y29kZSBiYWNrJyk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBbUEFHRS5mYkxvZ0luOTAsIFBBR0UuZ29vZ2xlTG9nSW45MF0uZm9yRWFjaChwID0+IHtcbiAgICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgICAgcGF0aDogYC8ke3AubmFtZX1gLFxuICAgICAgICBtYXRjaDogcCxcbiAgICAgICAgYWN0aW9uOiAna2V5Y29kZUJhY2snLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAqKiBtYWluXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubWFpbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5tYWluLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhc2sgPSBjb250ZXh0LnRhc2submFtZTtcbiAgICAgICAgY29uc29sZS5sb2codGFzayk7XG5cbiAgICAgICAgc3dpdGNoICh0YXNrKSB7XG4gICAgICAgICAgY2FzZSBUQVNLLnN0YXlJbkxvZ2luOlxuICAgICAgICAgICAgLy8gc2hvdWxkIGJlIGluYWNjZXNzaWJsZSB1bmxlc3MgY2xlYXIgc2Vzc2lvbiBpcyBmYWlsZWRcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgIGNhc2UgVEFTSy5zZXR0aW5nRGVmYXVsdDpcbiAgICAgICAgICBjYXNlIFRBU0suc2V0dGluZ1Jlc2V0TGVhZ3VlUHJvZ3Jlc3M6XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UubWFpbkJ0bnMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0UubWFpbkJ0bnMubGVhZ3VlTW9kZSk7XG4gICAgICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5QmF0dGxlR2FtZTpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5iYXR0bGVNb2RlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBUQVNLLmFkUmV3YXJkOlxuICAgICAgICAgICAgLy8gc29tZXRpbWVzIHdvbid0IHRyaWdnZXIgYW55dGhpbmcgaWYgc3RpbGwgb24gY2RcbiAgICAgICAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgPiAyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZCBpcyBzdGlsbCBvbiBjZCcpO1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5hZFRhYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFRBU0sud2Vla2x5TWlzc2lvbjpcbiAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5tYWluQnRucy5hY2hpZXZlbWVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5vbkxvZ2luU3VjY2VzcygpO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyAqKiBnYW1lIHNldHRpbmdcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZXR0aW5ncy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5zZXR0aW5ncyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zdCBpbmFjdGl2ZVRhYkNvbG9yID0geyByOiA1OCwgZzogNjUsIGI6IDc0IH07XG4gICAgICAgIGNvbnN0IHRhYiA9IGFycmF5RmluZChPYmplY3Qua2V5cyhQQUdFLnNldHRpbmdzVGFicyksIHQgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gUEFHRS5zZXR0aW5nc1RhYnNbdCBhcyBrZXlvZiB0eXBlb2YgUEFHRS5zZXR0aW5nc1RhYnNdO1xuICAgICAgICAgIHJldHVybiAhaXNTYW1lQ29sb3IoaW1hZ2UsIHsgeCwgeSwgLi4uaW5hY3RpdmVUYWJDb2xvciB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICAgIGNhc2UgVEFTSy5zZXR0aW5nRGVmYXVsdDpcbiAgICAgICAgICAgIGlmICh0YWIgPT09ICdncmFwaGljVGFiJykge1xuICAgICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2V0dGluZ3NHcmFwaFRhYkJ0bnMucG93ZXJTYXZlT24pO1xuICAgICAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGdvIHRvIGdyYXBoaWNUYWJcbiAgICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNldHRpbmdzVGFicy5ncmFwaGljVGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzczpcbiAgICAgICAgICAgIGlmICghc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcykge1xuICAgICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnbyB0byBsZWFndWVSZXNldERpYWxvZ1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNldHRpbmdzQnRucy5sZWFndWVSZXNldCk7XG4gICAgICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLm5lZWRSZXNldFByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5zZXR0aW5ncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyAqKiBhZCByZXdhcmRcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hZFJld2FyZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oY29udGV4dCA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5hZFJld2FyZCkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmFkUmV3YXJkKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnd2F0Y2ggYWQnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuYWRSZXdhcmQpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBGb3JBZCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5hZFJld2FyZFJlZGVlbS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZFJlZGVlbSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnYWQgcmV3YXJkIGdldCcpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5hZFJld2FyZFJlZGVlbSk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLmFkUmV3YXJkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmFkUmV3YXJkT25DRC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hZFJld2FyZE9uQ0QsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkIGlzIHN0aWxsIGNkJyk7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmFkUmV3YXJkT25DRCk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLmFkUmV3YXJkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gKiogd2Vla2x5IG1pc3Npb25cbiAgICB3ZWVrbHlNaXNzaW9uLmFkZFJvdXRlcygpO1xuXG4gICAgLy8gKiogcGxheUJhdHRsZUdhbWVcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5iYXR0bGVNb2RlUGFuZWwubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYmF0dGxlTW9kZVBhbmVsLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmJhdHRsZU1vZGVQYW5lbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHBsYXkgb3RoZXIgbW9kZSB0b29cbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLmJhdHRsZU1vZGVQYW5lbEJ0bnMucmFua2VkQmF0dGxlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgcmFua2VkIGJhdHRsZScpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlUGFuZWwubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlUGFuZWwsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UucmFua2VkQmF0dGxlUGFuZWwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhbm5vdCBwbGF5XG4gICAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgPiA1KSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgcGxheSBpcyBhdmFpbGFibGVcbiAgICAgICAgY29uc3QgaXNQbGF5RGlzYWJsZWQgPSBpc1NhbWVDb2xvcihpbWFnZSwgUEFHRS5yYW5rZWRCYXR0bGVQYW5lbEJ0bnMuZGlzYWJsZWRQbGF5QnRuKTtcbiAgICAgICAgaWYgKGlzUGxheURpc2FibGVkKSB7XG4gICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JhbmtlZCBiYXR0bGUgcGxheSBkaXNhYmxlZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnJhbmtlZEJhdHRsZVBhbmVsKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgcmFua2VkIGJhdHRsZSAoc2luZ2xlKScpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZVdhaXRUb1JlZnJlc2gubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UucmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgPT09IFRBU0sucGxheUJhdHRsZUdhbWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncGxheSByYW5rIGdhbWUgZGlzYWJsZWQnKTtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5yYW5rZWRCYXR0bGVXYWl0VG9SZWZyZXNoKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8pO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UucmFua2VkQmF0dGxlUmVzdWx0Lm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZVJlc3VsdCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmF1dG9HYW1lQ29uZmlybS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hdXRvR2FtZUNvbmZpcm0sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UuYXV0b0dhbWVDb25maXJtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuYXV0b0dhbWVDb25maXJtKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmF1dG9HYW1lQ29uZmlybUVuZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5hdXRvR2FtZUNvbmZpcm1FbmQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlCYXR0bGVHYW1lKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UuYXV0b0dhbWVDb25maXJtRW5kKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuYXV0b0dhbWVDb25maXJtRW5kKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5wbGF5QmF0dGxlR2FtZSkge1xuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLnJhbmtlZEJhdHRsZUdhbWVJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UucmFua2VkQmF0dGxlR2FtZUluZm8pO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgW1BBR0UucmVjaGFyZ2VCYWxsUmFua01vZGUsIFBBR0UucmVjaGFyZ2VCYWxsTGVhZ3VlTW9kZV0uZm9yRWFjaChwID0+XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgVEFTSy5wbGF5QmF0dGxlR2FtZTpcbiAgICAgICAgICAgIGNhc2UgVEFTSy5wbGF5TGVhZ3VlR2FtZTpcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nhbm5vdCBjb250aW51ZTogcmVjaGFyZ2UgYmFsbCBuZWVkZWQnKTtcbiAgICAgICAgICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKHApO1xuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vICoqIHBsYXlMZWFndWVNb2RlXG4gICAgLy8gZW50ZXIgZ2FtZSBpbmZvXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlTW9kZVBhbmVsLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU1vZGVQYW5lbCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVNb2RlUGFuZWwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhbiBwbGF5IGxlYWd1ZSBtb2RlXG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUudHJ5RW50ZXJHYW1lQ250cysrO1xuXG4gICAgICAgIC8vIGF2b2lkIHRvIGNsaWNrIGJ0biB0b28gbWFueSB0aW1lIGZvciB0cmlnZ2VyIG5leHQgcGFnZSBpbW1lZGlhdGVseVxuICAgICAgICBpZiAoY29udGV4dC5tYXRjaFRpbWVzIDwgMikge1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU1vZGVQYW5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlTW9kZUdhbWVJbmZvLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU1vZGVHYW1lSW5mbyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICByZXJvdXRlci5nb0JhY2soUEFHRS5sZWFndWVNb2RlR2FtZUluZm8pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGVjayBlbmVyZ3knKTtcbiAgICAgICAgY29uc3QgZW1wdHlFbmVyZ3kgPSB7IHg6IDU1MSwgeTogMjgxLCByOiAzLCBnOiAxMjQsIGI6IDIxMyB9O1xuICAgICAgICBjb25zdCBoYXNFbmVyZ3kwID0gaXNTYW1lQ29sb3IoaW1hZ2UsIGVtcHR5RW5lcmd5LCAwLjkpO1xuICAgICAgICBpZiAoaGFzRW5lcmd5MCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBlbmVyZ3knKTtcbiAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaWdpdDEgPSB7IHg6IDU2MSwgeTogMjc4LCByOiAxNjksIGc6IDE3MiwgYjogMTc5IH07XG4gICAgICAgIGNvbnN0IGhhc0VuZXJneTEwID0gaXNTYW1lQ29sb3IoaW1hZ2UsIGRpZ2l0MSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYXMxMEVuZXJneTonLCBoYXNFbmVyZ3kxMCk7XG5cbiAgICAgICAgLy8gdXNlIHF1aWNrIHBsYXkgd2hlbiBoYXMgMTArIGVuZXJneSxcbiAgICAgICAgLy8gYW5kIHNsb3cgcGxheSB3aGVuIGhhcyAxMC0gZW5lcmd5XG4gICAgICAgIGNvbnN0IHF1aWNrUGxheU9uQnRuID0geyB4OiAzNywgeTogMjg0LCByOiAzMywgZzogMjU1LCBiOiAxNDAgfTtcbiAgICAgICAgY29uc3QgaXNRdWlja1BsYXlPbiA9IGlzU2FtZUNvbG9yKGltYWdlLCBxdWlja1BsYXlPbkJ0bik7XG5cbiAgICAgICAgaWYgKGhhc0VuZXJneTEwICYmICFpc1F1aWNrUGxheU9uKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChxdWlja1BsYXlPbkJ0bik7IC8vIHNlbGVjdCBxdWljayBwbGF5XG4gICAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gb24gcXVpY2sgcGxheScpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcExvbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzRW5lcmd5MTAgJiYgaXNRdWlja1BsYXlPbikge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAocXVpY2tQbGF5T25CdG4pOyAvLyBjYW5jZWwgcXVpY2sgcGxheVxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9mZiBxdWljayBwbGF5Jyk7XG4gICAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVNb2RlR2FtZUluZm8pOyAvLyBwbGF5IGJhbGxcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXkgbGVhZ3VlIG1vZGUgZ2FtZScpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IHRoaW5nc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdFBsYXlSb2xlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdFBsYXlSb2xlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgc2VsZWN0IHBsYXkgcm9sZScpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3RQbGF5Um9sZSk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RZZWFyLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdFllYXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3QgeWVhciBwYWdlJyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLnNlbGVjdFllYXIpO1xuXG4gICAgICAgIC8vIGdvIHRvIHRoZSBtaW4geWVhclxuICAgICAgICBjb25zdCBhY3RpdmVCdXR0b24gPSB7XG4gICAgICAgICAgeDogUEFHRS5zZWxlY3RZZWFyQnRucy5wcmV2WWVhci54LFxuICAgICAgICAgIHk6IFBBR0Uuc2VsZWN0WWVhckJ0bnMucHJldlllYXIueSxcbiAgICAgICAgICByOiA0OSxcbiAgICAgICAgICBnOiA4NSxcbiAgICAgICAgICBiOiAxMjMsXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGlzTm90TWluWWVhciA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihhY3RpdmVCdXR0b24pO1xuICAgICAgICBmb3IgKGxldCByZW1haW5DbGljayA9IDEyOyByZW1haW5DbGljayA+IDAgJiYgaXNOb3RNaW5ZZWFyOyByZW1haW5DbGljay0tKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChQQUdFLnNlbGVjdFllYXJCdG5zLnByZXZZZWFyKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgICAgaXNOb3RNaW5ZZWFyID0gcmVyb3V0ZXIuc2NyZWVuLmlzU2FtZUNvbG9yKGFjdGl2ZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayB0aGUgZGlmZiwgcmV0dXJuIHRvIHByZXYgeWVhclxuICAgICAgICBmb3IgKHZhciB5ZWFyRGlmZiA9IENvbmZpZy5jb25maWcubGVhZ3VlWWVhciAtIENPTlNUQU5UUy5sZWFndWVZZWFyTWluOyB5ZWFyRGlmZiA+IDA7IHllYXJEaWZmLS0pIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0WWVhckJ0bnMubmV4dFllYXIpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcFNob3J0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1Ym1pdCBjaGFuZ2VzXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoUEFHRS5zZWxlY3RZZWFyQnRucy5zdWJtaXQpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5zZWxlY3RTZWFzb25Nb2RlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdFNlYXNvbk1vZGUsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBzZWxlY3Qgc2Vhc29uIHBhZ2UnKTtcbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0Uuc2VsZWN0U2Vhc29uTW9kZSk7XG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiA1NjgsIHk6IDMzMyB9KTsgLy8gbm9ybWFsIG1vZGVcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAvLyBUT0RPIHNwbGl0IHBhZ2VcbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDMzMiwgeTogMzAxIH0pOyAvLyBuZXh0IHNlYXNvblxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBMb25nKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdExlYWd1ZUdhbWVBbW91bnQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCBsZWFndWUgZ2FtZSBhbW91bnQgcGFnZScpO1xuICAgICAgICAvLyB1c2UgY29uZmlnIHVzZXIgc2V0dGVkIHRvIHNlbGVjdCB3aGljaCB0aGV5IHdhbnQgdG8gcGxheVxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgdGhlIGhhbGYsIHF1YXJ0ZXIsIGZ1bGwgaGFzIDIgbmV4dCBwYWdlXG4gICAgICAgIHN3aXRjaCAoQ29uZmlnLmNvbmZpZy5sZWFndWVTZWFzb25Nb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZnVsbCc6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0IGZ1bGwgbGVhZ3VlJyk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudEJ0bnMuZnVsbCk7XG4gICAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY0LCB5OiAzMjggfSk7IC8vIGdvIG5leHRcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2hhbGYnOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCAxLzIgbGVhZ3VlJyk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudEJ0bnMuaGFsZik7XG4gICAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY0LCB5OiAzMjggfSk7IC8vIGdvIG5leHRcbiAgICAgICAgICAgIC8vID8gd2lsbCBnbyB0byBvayAvIG5leHQgcGFnZXNcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCAxLzQgbGVhZ3VlJyk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudEJ0bnMucXVhcnRlcik7XG4gICAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBTaG9ydCk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY0LCB5OiAzMjggfSk7IC8vIGdvIG5leHRcbiAgICAgICAgICAgIC8vID8gd2lsbCBnbyB0byBvayAvIG5leHQgcGFnZXNcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3Bvc3RTZWFzb24nOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCBwb3N0U2Vhc29uJyk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0TGVhZ3VlR2FtZUFtb3VudEJ0bnMucG9zdCk7XG4gICAgICAgICAgICAvLyA/IHdpbGwgZ28gdG8gb2sgLyBuZXh0IHBhZ2VzXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogNTY0LCB5OiAzMjggfSk7IC8vIGdvIG5leHRcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTG9uZyk7XG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIHNlYXNvbiBuZXcvIGVuZFxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLm5ld1NlYXNvbi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5uZXdTZWFzb24sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5lbmRTZWFzb24ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZW5kU2Vhc29uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZW5kU2Vhc29uUHJvY2VlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5lbmRTZWFzb25Qcm9jZWVkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgZW5kIHNlYXNvbiBwcm9jZWVkJyk7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAxODIsIHk6IDE3OCB9KTsgLy8gdGFwIG5ldyBzZWFzb24gb2YgbGVmdFxuICAgICAgICAvLyB3aWxsIGdvIHRvIGVuZFNlYXNvblByb2NlZWRTZWxlY3RlZFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmVuZFNlYXNvblByb2NlZWRTZWxlY3RlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlIHNlbGVjdCBub3JtYWwgLyBtYXN0ZXIgbW9kZScpO1xuXG4gICAgICAgIC8vIGlmIGNhbm5vdCBzZWxlY3QgbWFzdGVyIG1vZGUsIGF0IGxlYXN0IHNlbGVjdCBub3JtYWwgbW9kZVxuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZUJ0bnMubm9ybWFsKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKFBBR0Uuc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZUJ0bnMubWFzdGVyKTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICAvLyB3aGV0aGVyIGNob29zZSBhbnkgbW9kZSwgd2lsbCBqdW1wIHRvIHByb2NlZWQgcGFnZVxuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVQcm9jZWVkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdE5vcm1hbE1hc3RlckxlYWd1ZU1vZGVQcm9jZWVkLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlUmVzZXREaWFsb2dZTi5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVSZXNldERpYWxvZ1lOLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgcmVzZXQgbGVhZ3VlIGRpYWxvZyB3aXRoIHllcy9ubycpO1xuXG4gICAgICAgIC8vIFRPRE86IGxldCB1c2VyIGNob29zZSBpbiBjb25maWdcbiAgICAgICAgaWYgKGNvbnRleHQubGFzdE1hdGNoZWRQYXRoID09PSBgLyR7UEFHRS5zZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZC5uYW1lfWApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVzZXQgbGVhZ3VlIG1vZGUnKTtcbiAgICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5sZWFndWVSZXNldERpYWxvZ1lOKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3QgcmVzZXRcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlUmVzZXREaWFsb2dZTik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy5zZXR0aW5nUmVzZXRMZWFndWVQcm9ncmVzcykge1xuICAgICAgICAgIC8vIGNhbmNlbFxuICAgICAgICAgIHJlcm91dGVyLmdvQmFjayhQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSByZXNldCBsZWFndWUgZGlhbG9nJyk7XG4gICAgICAgIC8vIFRPRE86IGxldCB1c2VyIGNhbiBzZWxlY3Qgc3BlY2lmaWMgbW9kZSBhbmQgeWVhciB0byBwbGF5XG4gICAgICAgIC8vIHJlc2V0XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZVJlc2V0RGlhbG9nKTtcbiAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVNb2RlVW5leHBlY3RlZEVycm9yLFxuICAgICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoY29udGV4dC50YXNrLm5hbWUpIHtcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICBpZiAoIUNvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzb21ldGltZXMgc29tZSB1bmtub3duIHJlYXNvbiBjYW5ub3QgZW50ZXIgZ2FtZVxuICAgICAgICAgICAgY29uc3QgeyB0cnlFbnRlckdhbWVDbnRzIH0gPSBzdGF0ZS5sZWFndWVHYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyeSBlbnRlciBnYW1lIGNudHMnLCB0cnlFbnRlckdhbWVDbnRzKTtcbiAgICAgICAgICAgIGlmICh0cnlFbnRlckdhbWVDbnRzID09PSAzKSB7XG4gICAgICAgICAgICAgIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnlFbnRlckdhbWVDbnRzID4gMykge1xuICAgICAgICAgICAgICAvLyBjYW4gb25seSByZXNvbHZlZCBieSByZXNldHRpbmcgbGVhZ3VlIG1vZGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZVJlc2V0TGVhZ3VlTW9kZVByb2dyZXNzJyk7XG5cbiAgICAgICAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS5uZWVkUmVzZXRQcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgIGZpbmlzaFJvdW5kKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubGVhZ3VlTW9kZVVuZXhwZWN0ZWRFcnJvcik7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gb3RoZXJcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lTGluZVVwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVMaW5lVXAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5wbGF5ZXJHcm93dGhDb21wbGV0ZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5wbGF5ZXJHcm93dGhDb21wbGV0ZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnBpdGNoZXJPZlRoZU1vbnRoLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnBpdGNoZXJPZlRoZU1vbnRoLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubXZwLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLm12cCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlTXZwUGFnZScpO1xuICAgICAgICBjb25zdCBva0J0biA9IHsgeDogNTY4LCB5OiAzMjAsIHI6IDUyLCBnOiAxMjAsIGI6IDIxMCB9O1xuICAgICAgICBsZXQgaXNPa0J0bk9uU2NyZWVuID0gcmVyb3V0ZXIuc2NyZWVuLmlzU2FtZUNvbG9yKG9rQnRuKTtcblxuICAgICAgICAvLyBvayBidXR0b24gc3RpbGwgb24gdGhlIHNjcmVlblxuICAgICAgICBmb3IgKHZhciBtYXhPa0J1dHRvblJlbWFpbiA9IDEwOyBpc09rQnRuT25TY3JlZW4gJiYgbWF4T2tCdXR0b25SZW1haW4gPiAwOyBtYXhPa0J1dHRvblJlbWFpbi0tKSB7XG4gICAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UubXZwKTsgLy8gb2tcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICAgIGlzT2tCdG5PblNjcmVlbiA9IHJlcm91dGVyLnNjcmVlbi5pc1NhbWVDb2xvcihva0J0bik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXdhcmQgYm9udXMgcGxheWVyIHBvcHVwXG4gICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiAzMjIsIHk6IDMwOSB9KTsgLy8gY2xpY2sgbmV4dFxuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBnYW1lIG92ZXJcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmVzdWx0Lm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXN1bHQsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5QmF0dGxlR2FtZTpcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY29tcGxldGUgYSBnYW1lJyk7XG4gICAgICAgICAgICBmaW5pc2hSb3VuZCgpO1xuICAgICAgICAgICAgc3RhdGUub25SdW5uaW5nKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuZ29OZXh0KFBBR0UuZ2FtZVJlc3VsdCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5nYW1lUmVzdWx0QXF1aXJlZC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5nYW1lUmVzdWx0QXF1aXJlZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXN1bHRXb3JsZENoYW1waW9uLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXN1bHRXb3JsZENoYW1waW9uLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuZ2FtZVJlc3VsdE90aGVyLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmdhbWVSZXN1bHRPdGhlcixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMCwgeTogMCB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcCcpO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBnYW1lIHJld2FyZCBwYWdlc1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmdhbWVSZXdhcmQubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuZ2FtZVJld2FyZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UubGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGVCb251c1BsYXllci5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVSZXdhcmRBY2hpZXZlbWVudEdyYWRlQm9udXNQbGF5ZXIsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5iZXN0UG9zaXRpb25Bd2FyZEJvbnVzR3JvdXAubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0UuYmVzdFBvc2l0aW9uQXdhcmRCb251c0dyb3VwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UuYm9udXNHcmFudGVkQnlUZWFtUmVjb3JkLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmJvbnVzR3JhbnRlZEJ5VGVhbVJlY29yZCxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLnBvc3RTZWFzb25Bd2FyZEJvbnVzLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnBvc3RTZWFzb25Bd2FyZEJvbnVzLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uuc2VsZWN0UmV3YXJkUGxheWVyLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLnNlbGVjdFJld2FyZFBsYXllcixcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlU2VsZWN0UmV3YXJkUGxheWVyJyk7XG4gICAgICAgIGxldCBiZXN0Q2FyZFJhbmsgPSAtMTtcbiAgICAgICAgbGV0IGJlc3RDYXJkUG9zID0gUEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXJCdG5zWzBdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcG9zIG9mIFBBR0Uuc2VsZWN0UmV3YXJkUGxheWVyQnRucykge1xuICAgICAgICAgIGNvbnN0IHJnYiA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHBvcy54LCBwb3MueSk7XG4gICAgICAgICAgY29uc3QgayA9IHJnYi5yICsgJy0nICsgcmdiLmcgKyAnLScgKyByZ2IuYjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhwb3MueCwgcG9zLnksIGspO1xuICAgICAgICAgIC8vIHNlbGVjdCBpZiBub3QgaW4gYmFzaWMgdHlwZVxuICAgICAgICAgIGNvbnN0IHJhbmsgPSBQQUdFLnBsYXllckNhcmRDb2xvclRvUmFua1trXSA/PyA1O1xuICAgICAgICAgIGlmIChyYW5rID4gYmVzdENhcmRSYW5rKSB7XG4gICAgICAgICAgICBiZXN0Q2FyZFJhbmsgPSByYW5rO1xuICAgICAgICAgICAgYmVzdENhcmRQb3MgPSBwb3M7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChiZXN0Q2FyZFBvcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QnLCBiZXN0Q2FyZFBvcy54LCBiZXN0Q2FyZFBvcy55KTtcbiAgICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgICAgICByZXJvdXRlci5nb05leHQoUEFHRS5zZWxlY3RSZXdhcmRQbGF5ZXIpO1xuICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBvbiBwbGF5IHBhZ2VzXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uub25RdWlja1BsYXlHcm91cC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5vblF1aWNrUGxheUdyb3VwLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbigoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbiBxdWljayBwbGF5aW5nJyk7XG5cbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lID09PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgLy8gc3VjY2VzcyBlbnRlciBnYW1lXG4gICAgICAgICAgc3RhdGUubGVhZ3VlR2FtZS50cnlFbnRlckdhbWVDbnRzID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5vblJ1bm5pbmcodHJ1ZSk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLm9uUXVpY2tQbGF5R3JvdXApO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uub25RdWlja1BsYXlQYXVzZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5vblF1aWNrUGxheVBhdXNlLFxuICAgICAgYWN0aW9uOiB0aGlzLndyYXBSb3V0ZUFjdGlvbignZ29OZXh0JyksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0Uub25QbGF5UG93ZXJTYXZlT24ubmFtZX1gLFxuICAgICAgbWF0Y2g6IFBBR0Uub25QbGF5UG93ZXJTYXZlT24sXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgLy8gdGhpcyBpcyBzaGFyZSBiZXR3ZWVuIGFsbCBtb2RlXG4gICAgICAgIGxldCBpc09uUGxheVRhc2sgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChjb250ZXh0LnRhc2submFtZSkge1xuICAgICAgICAgIGNhc2UgVEFTSy5wbGF5QmF0dGxlR2FtZTpcbiAgICAgICAgICBjYXNlIFRBU0sucGxheUxlYWd1ZUdhbWU6XG4gICAgICAgICAgICBpc09uUGxheVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlIHx8ICFpc09uUGxheVRhc2sgfHwgcmVyb3V0ZXIuaXNQYWdlTWF0Y2goUEFHRS5wb3dlclNhdmluZykpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVBvd2VyU2F2aW5nUGFnZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IHsgbGFzdENoZWNrUG93ZXJTYXZlQXQ6IGxhc3RDaGVja1RpbWVBdCwgcG93ZXJTYXZlQ29sb3JDb3VudDogY29sb3JDb3VudCB9ID0gc3RhdGUubGVhZ3VlR2FtZTtcbiAgICAgICAgaWYgKG5vdyAtIGxhc3RDaGVja1RpbWVBdCA8IENPTlNUQU5UUy5zZW5kUnVubmluZ0V2ZW50SW50ZXJ2YWwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1c2UgdGltZSB0byBjaGVjayB3aGV0aGVyIGdhbWUgaXMgc3RpbGwgcGxheWluZ1xuICAgICAgICBjb25zdCBjb2xvckNudE5vdyA9IGdldENvbG9yQ291bnRJblJhbmdlKGltYWdlLCB7IHg6IDMzMSwgeTogMzEwIH0sIHsgeDogNDAzLCB5OiAzMTEgfSk7XG4gICAgICAgIGNvbnN0IGlzU2FtZSA9IGlzU2FtZUNvbG9yQ291bnQoY29sb3JDbnROb3csIGNvbG9yQ291bnQpO1xuXG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUubGFzdENoZWNrUG93ZXJTYXZlQXQgPSBub3c7XG4gICAgICAgIHN0YXRlLmxlYWd1ZUdhbWUucG93ZXJTYXZlQ29sb3JDb3VudCA9IGNvbG9yQ250Tm93O1xuXG4gICAgICAgIGlmICghaXNTYW1lKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2dhbWUgaXMgc3RpbGwgcGxheWluZyB3aXRoIHBvd2VyIHNhdmUgb24nKTtcbiAgICAgICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnZ2FtZSBpcyBzdHVjaycpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke1BBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmR3JvdXBzLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3VwcyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICAvLyBwYWdlIHdpbGwgYmUgc3RvcHBlZCBoZXJlIGluIGFueSB0YXNrc1xuICAgICAgICAvLyBuZWVkIHRvIGhhbmRsZSBpbW1lZGlhdGVseSBpZiBtYXRjaFxuICAgICAgICBmb3IgKGNvbnN0IHBhZ2VPckdyb3VwIG9mIG1hdGNoZWQpIHtcbiAgICAgICAgICBpZiAocGFnZU9yR3JvdXAubmFtZSA9PT0gUEFHRS5sZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkLm5hbWUpIHtcbiAgICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZlN0b3BwZWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgLy8gdHVybiBvZmYgYXV0b3BsYXkgdG8gcmV0dXJuXG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmKTtcbiAgICAgICAgICBVdGlscy5zbGVlcChDT05TVEFOVFMuc2xlZXBNZWRpdW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1Y2Nlc3MgZW50ZXIgZ2FtZVxuICAgICAgICBzdGF0ZS5sZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMgPSAwO1xuXG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBxdWljayBzd2l0Y2ggdG8gYXV0byBwbGF5IG9mZiBpZiB3YXMgc3RvcHBlZFxuICAgICAgICBpZiAoQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0dXJuIG9uIHBvd2VyIHNhdmUgcGxheScpO1xuICAgICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZik7XG4gICAgICAgIH1cbiAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXAnKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cC5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLnBsYXlMZWFndWVHYW1lKSB7XG4gICAgICAgICAgLy8gb3BlbiBwYXVzZSBwYW5lbFxuICAgICAgICAgIGtleWNvZGUoJ0tFWUNPREVfQkFDSycsIDEwMCk7XG4gICAgICAgICAgLy8gcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlT25QbGF5QXV0b09mZkdyb3VwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gb24gYXV0byBwbGF5Jyk7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChQQUdFLmxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCk7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5sZWFndWVPblBsYXlQYXVzZS5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVPblBsYXlQYXVzZSxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBpZiAoY29udGV4dC50YXNrLm5hbWUgIT09IFRBU0sucGxheUxlYWd1ZUdhbWUpIHtcbiAgICAgICAgICAvLyBvcGVuIHBhdXNlIHBhbmVsXG4gICAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKFBBR0UubGVhZ3VlT25QbGF5UGF1c2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb250aW51ZSBwbGF5XG4gICAgICAgIGtleWNvZGUoJ0tFWUNPREVfQkFDSycsIDEwMCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXAgYmFjayB0byBzdGF5IGluIGdhbWUnKTtcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtQQUdFLmxlYWd1ZUNvbnRpbnVlUGxheWluZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5sZWFndWVDb250aW51ZVBsYXlpbmcsXG4gICAgICBhY3Rpb246IHRoaXMud3JhcFJvdXRlQWN0aW9uKCdnb05leHQnKSxcbiAgICB9KTtcblxuICAgIC8vICoqIGdlbmVyYWwgcGFnZXNcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7UEFHRS5wb3dlclNhdmluZy5uYW1lfWAsXG4gICAgICBtYXRjaDogUEFHRS5wb3dlclNhdmluZyxcbiAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZVBvd2VyU2F2aW5nUGFnZSgpO1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgW1BBR0UuZXJyb3JOZXdVcGRhdGVBdmFpbGFibGUsIFBBR0UuYXBwSXNOb3RSZXNwb25kaW5nXS5mb3JFYWNoKHAgPT4ge1xuICAgICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICAgIG1hdGNoOiBwLFxuICAgICAgICBhY3Rpb246ICdnb05leHQnLFxuICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiBDT05TVEFOVFMuc2xlZXBXYWl0UGFnZUxvbmcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIFtcbiAgICAgIFBBR0UudW5leHBlY3RlZEVycm9yLFxuICAgICAgUEFHRS5yZXZpZXdBcHAsXG4gICAgICBQQUdFLnByb21vdGlvbjEsXG4gICAgICBQQUdFLnByb21vdGlvbjIsXG4gICAgICBQQUdFLnByb21vdGlvbjMsXG4gICAgICBQQUdFLnJlY2hhcmdlUHJvbW90aW9uLFxuICAgICAgUEFHRS50ZWFtU3VwcG9ydFBhY2thZ2VQcm9tb3Rpb24sXG4gICAgICBQQUdFLmVudGVyR2FtZVByb21vdGlvbixcbiAgICAgIFBBR0UuZXZlbnQsXG4gICAgICBQQUdFLm9rLFxuICAgICAgUEFHRS5uZXh0LFxuICAgICAgUEFHRS5jb25maXJtV2l0aFlTLFxuICAgICAgUEFHRS5xdWl0QXBwLFxuICAgICAgUEFHRS5xdWl0QXBwMSxcbiAgICBdLmZvckVhY2gocCA9PiB7XG4gICAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICAgIHBhdGg6IGAvJHtwLm5hbWV9YCxcbiAgICAgICAgbWF0Y2g6IHAsXG4gICAgICAgIGFjdGlvbjogdGhpcy53cmFwUm91dGVBY3Rpb24oJ2dvTmV4dCcpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlVW5rbm93bigpIHtcbiAgICByZXJvdXRlci5hZGRVbmtub3duQWN0aW9uKChjb250ZXh0LCBpbWFnZSwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgIC8vIHJlcm91dGVyLmdldEN1cnJlbnRNYXRjaE5hbWVzKCk7XG4gICAgICBVdGlscy5sb2coYHVua25vd24gY291bnQgJHtjb250ZXh0Lm1hdGNoVGltZXN9LCBkdXJpbmcgJHtjb250ZXh0Lm1hdGNoRHVyaW5nfSwgbGFzdCBtYXRjaGVkOiAke2NvbnRleHQubGFzdE1hdGNoZWRQYXRofWApO1xuICAgICAgY29uc3QgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgICAgIGlmICghaXNJbkFwcCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbm90IGluIGFwcCcpO1xuICAgICAgICBpZiAoQ29uZmlnLmNvbmZpZy5oYXNDb29sRmVhdHVyZSkge1xuICAgICAgICAgIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoY29udGV4dC5sYXN0TWF0Y2hlZFBhdGguc3Vic3RyaW5nKDEpKSB7XG4gICAgICAgIGNhc2UgUEFHRS5hZFJld2FyZC5uYW1lOlxuICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNsb3NlQWQoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ZS5pc1dhaXRpbmdMb2dpbikge1xuICAgICAgICBjb25zb2xlLmxvZygnd2FpdCB1c2VyIGlucHV0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICBjb25zb2xlLmxvZygndGFwJyk7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgJSAxMSA9PT0gMCkge1xuICAgICAgICBrZXljb2RlKCdLRVlDT0RFX0JBQ0snLCAxMDApO1xuICAgICAgICBVdGlscy5sb2coJ2tleWNvZGUgYmFjayBmb3IgdW5rbm93bicpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRleHQubWF0Y2hEdXJpbmcgPiBDT05TVEFOVFMubWludXRlSW5NcyAqIDMwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdHVjayBpbiB1bmtub3duIHBhZ2UgbW9yZSB0aGFuIDMwIG1pbicpO1xuICAgICAgICBDb25maWcuY29uZmlnLmhhc0Nvb2xGZWF0dXJlICYmIHJlcm91dGVyLnJlc3RhcnRBcHAoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVDbG9zZUFkKCkge1xuICAgIGNvbnNvbGUubG9nKCd0cnkgY2xvc2UgYWQnKTtcbiAgICBrZXljb2RlKCdCQUNLJywgMTAwKTtcbiAgICBjb25zb2xlLmxvZygna2V5IGNvZGUgYmFjaycpO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgaWYgKHJlcm91dGVyLmdldEN1cnJlbnRNYXRjaE5hbWVzKCkubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdHJ5IHRhcCBjbG9zZSBidG5cbiAgICBmb3IgKGNvbnN0IGNsb3NlQnRuIG9mIFtcbiAgICAgIC8vIHJpZ2h0XG4gICAgICB7IHg6IDYyMiwgeTogMTkgfSxcblxuICAgICAgLy8gbGVmdFxuICAgICAgeyB4OiA4LCB5OiAxNSB9LFxuICAgIF0pIHtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoY2xvc2VCdG4pO1xuICAgICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwU2hvcnQpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgaGFuZGxlUG93ZXJTYXZpbmdQYWdlKCkge1xuICAgIGNvbnNvbGUubG9nKCdoYW5kbGVQb3dlclNhdmluZ1BhZ2UnKTtcbiAgICByZXJvdXRlci5zY3JlZW4udGFwRG93bih7IHg6IDEwMCwgeTogMTgwIH0pO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgcmVyb3V0ZXIuc2NyZWVuLm1vdmVUbyh7IHg6IDUwMCwgeTogMTgwIH0pO1xuICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgcmVyb3V0ZXIuc2NyZWVuLnRhcFVwKHsgeDogNTAwLCB5OiAxODAgfSk7XG4gICAgVXRpbHMuc2xlZXAoQ09OU1RBTlRTLnNsZWVwTWVkaXVtKTtcbiAgfVxuXG4gIHB1YmxpYyB3cmFwUm91dGVBY3Rpb24oYWN0aW9uOiBSb3V0ZUNvbmZpZ1snYWN0aW9uJ10pOiBSb3V0ZUNvbmZpZ1snYWN0aW9uJ10ge1xuICAgIGlmICghQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnd3JhcFJvdXRlQWN0aW9uJywgY29udGV4dC50YXNrLm5hbWUsIG1hdGNoZWRbMF0ubmFtZSk7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhY3Rpb24oY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT09ICdnb05leHQnKSB7XG4gICAgICAgIHJlcm91dGVyLmdvTmV4dChtYXRjaGVkWzBdKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT09ICdnb0JhY2snKSB7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayhtYXRjaGVkWzBdKTtcbiAgICAgIH1cblxuICAgICAgLy8gdXBsb2FkIHNlc3Npb24gaWYgbmVlZGVkXG4gICAgICBzdGF0ZS5jaGVja1VwbG9hZFNlc3Npb24oKTtcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY3JpcHRDb25maWcgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBsZWFndWVZZWFyTWluIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogU2NyaXB0Q29uZmlnID0ge1xuICBsZWFndWVTZWFzb25Nb2RlOiAnZnVsbCcsXG4gIGxlYWd1ZVllYXI6IGxlYWd1ZVllYXJNaW4sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0KGpzb25Db25maWc6IGFueSkge1xuICBpZiAodHlwZW9mIGpzb25Db25maWcgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYyA9IEpTT04ucGFyc2UoanNvbkNvbmZpZyk7XG4gIGNvbmZpZy5sZWFndWVTZWFzb25Nb2RlID0gYy5sZWFndWVTZWFzb25Nb2RlID8/IGNvbmZpZy5sZWFndWVTZWFzb25Nb2RlO1xuICBjb25maWcubGVhZ3VlWWVhciA9IGMubGVhZ3VlWWVhciA/PyBjb25maWcubGVhZ3VlWWVhcjtcblxuICBjb25maWcueHJvYm90bW9uUzNLZXkgPSBjLnhyb2JvdG1vblMzS2V5ID8/IGNvbmZpZy54cm9ib3Rtb25TM0tleTtcbiAgY29uZmlnLnhyb2JvdG1vblMzVG9rZW4gPSBjLnhyb2JvdG1vblMzVG9rZW4gPz8gY29uZmlnLnhyb2JvdG1vblMzVG9rZW47XG4gIGNvbmZpZy5hbWF6b25hd3NTM0tleSA9IGMuYW1hem9uYXdzUzNLZXkgPz8gY29uZmlnLmFtYXpvbmF3c1MzS2V5O1xuICBjb25maWcuYW1hem9uYXdzUzNUb2tlbiA9IGMuYW1hem9uYXdzUzNUb2tlbiA/PyBjb25maWcuYW1hem9uYXdzUzNUb2tlbjtcbiAgY29uZmlnLmxpY2Vuc2VJZCA9IGMubGljZW5zZUlkID8/IGNvbmZpZy5saWNlbnNlSWQ7XG5cbiAgY29uZmlnLmlzQ2xvdWQgPSBjLmlzQ2xvdWQgPz8gdHJ1ZTtcbiAgY29uZmlnLmlzTG9jYWxQYWlkID0gYy5pc0xvY2FsUGFpZCA/PyBmYWxzZTtcbiAgY29uZmlnLmhhc0Nvb2xGZWF0dXJlID0gY29uZmlnLmlzQ2xvdWQgfHwgY29uZmlnLmlzTG9jYWxQYWlkIHx8IGMuaXNEZXYgfHwgZmFsc2U7XG59XG4iLCJpbXBvcnQgeyBVdGlscyB9IGZyb20gJ1Jlcm91dGVyJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5sZXQgbGFzdFJ1bm5pbmdFdmVudDogbnVtYmVyID0gMDtcbmxldCBsYXN0U2VuZEdhbWVTdGF0dXNFdmVudEF0OiBudW1iZXIgPSAwO1xubGV0IGNudCA9IDA7XG5lbnVtIEV2ZW50TmFtZSB7XG4gIFJVTk5JTkcgPSAncnVubmluZycsXG4gIEdBTUVfU1RBVFVTID0gJ2dhbWVTdGF0dXMnLFxufVxuZW51bSBHYW1lU3RhdHVzQ29udGVudCB7XG4gIFdBSVRfRk9SX0xPR0lOX0lOUFVUID0gJ3dhaXQtZm9yLWlucHV0JyxcbiAgTE9HSU5fU1VDQ0VFREVEID0gJ2xvZ2luLXN1Y2NlZWRlZCcsXG4gIExBVU5DSElORyA9ICdsYXVuY2hpbmcnLFxuICBQTEFZSU5HID0gJ3BsYXlpbmcnLFxufVxuY29uc3QgcHJlZml4ID0gJ1tFdmVudF0nO1xuXG5leHBvcnQgbGV0IGxhc3RHYW1lU3RhdHVzRXZlbnQ6IHN0cmluZyA9ICcnO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5JbnB1dGluZygpIHtcbiAgY250Kys7XG4gIGNvbnNvbGUubG9nKGBsb2dpbklucHV0aW5nOiAke2NudH1gKTtcbiAgY29uc3QgY29udGVudCA9IEdhbWVTdGF0dXNDb250ZW50LldBSVRfRk9SX0xPR0lOX0lOUFVUO1xuICByZXR1cm4gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luU3VjY2VzcygpIHtcbiAgaWYgKGxhc3RHYW1lU3RhdHVzRXZlbnQgIT09IEdhbWVTdGF0dXNDb250ZW50LldBSVRfRk9SX0xPR0lOX0lOUFVUKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGNvbnRlbnQgPSBHYW1lU3RhdHVzQ29udGVudC5MT0dJTl9TVUNDRUVERUQ7XG4gIHJldHVybiBoYW5kbGVTZW5kR2FtZVN0YXR1c0V2ZW50KGNvbnRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoaW5nKCkge1xuICAvLyBzZXQgdG8gZGVmYXVsdCBvbmNlIGFwcCBpcyBsYXVuY2hlZCAoZmlyc3QgYW5kIGFnYWluKVxuICBsYXN0UnVubmluZ0V2ZW50ID0gMDtcbiAgY29uc3QgY29udGVudCA9IEdhbWVTdGF0dXNDb250ZW50LkxBVU5DSElORztcbiAgcmV0dXJuIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5aW5nKCkge1xuICBjb25zdCBjb250ZW50ID0gR2FtZVN0YXR1c0NvbnRlbnQuUExBWUlORztcbiAgcmV0dXJuIGhhbmRsZVNlbmRHYW1lU3RhdHVzRXZlbnQoY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5uaW5nKHVzZUludGVydmFsOiBib29sZWFuID0gZmFsc2UpIHtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgaWYgKHVzZUludGVydmFsICYmIG5vdyAtIGxhc3RSdW5uaW5nRXZlbnQgPCBDT05TVEFOVFMuc2VuZFJ1bm5pbmdFdmVudEludGVydmFsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxhc3RSdW5uaW5nRXZlbnQgPSBub3c7XG4gIHNlbmRFdmVudChFdmVudE5hbWUuUlVOTklORywgJycpO1xuICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9IHJ1bm5pbmdgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2VuZEdhbWVTdGF0dXNFdmVudChjb250ZW50OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKGxhc3RHYW1lU3RhdHVzRXZlbnQgPT09IGNvbnRlbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBzbGVlcCBmb3Igc2VuZCAxKyBldmVudHMgaW4gYSBzaG9ydCB0aW1lXG4gIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gbGFzdFNlbmRHYW1lU3RhdHVzRXZlbnRBdDtcbiAgaWYgKGRpZmYgPCBDT05TVEFOVFMuc2xlZXBNZWRpdW0pIHtcbiAgICBVdGlscy5zbGVlcChkaWZmKTtcbiAgfVxuXG4gIGxhc3RHYW1lU3RhdHVzRXZlbnQgPSBjb250ZW50O1xuICBzZW5kRXZlbnQoRXZlbnROYW1lLkdBTUVfU1RBVFVTLCBjb250ZW50KTtcbiAgY29uc29sZS5sb2coYCR7cHJlZml4fSAke2NvbnRlbnR9YCk7XG4gIGxhc3RTZW5kR2FtZVN0YXR1c0V2ZW50QXQgPSBEYXRlLm5vdygpO1xuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImV4cG9ydCB7IHJlcm91dGVyIH0gZnJvbSAnLi9yZXJvdXRlcic7XG5leHBvcnQgKiBhcyBDb25maWcgZnJvbSAnLi9jb25maWcnO1xuZXhwb3J0ICogYXMgc3RhdGUgZnJvbSAnLi9zdGF0ZSc7XG4iLCJpbXBvcnQgeyByZXJvdXRlciBhcyByIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnIuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnQXV0b1N0b3AgPSB0cnVlO1xuci5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnRGVidWcgPSBmYWxzZTtcblxuLy8gaWYgbm90IHNldCBwYWNrYWdlTmFtZSBmaXJzdCwgY2Fubm90IGhhbmRsZSBzdGFydC8gc3RvcCBhcHBcbnIucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUgPSBDT05TVEFOVFMucGFja2FnZU5hbWU7XG5yLnJlcm91dGVyQ29uZmlnLnN0YXJ0QXBwRGVsYXkgPSAxMCAqIDEwMDA7XG5cbnIuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID0gJ2hvcml6b250YWwnO1xuci5zY3JlZW5Db25maWcuZGV2SGVpZ2h0ID0gMzYwO1xuci5zY3JlZW5Db25maWcuZGV2V2lkdGggPSA2NDA7XG5cbnIuZGVidWcgPSB0cnVlO1xuZXhwb3J0IGxldCByZXJvdXRlciA9IHI7XG4iLCJpbXBvcnQgeyBkZWZhdWx0IGFzIE1ENSB9IGZyb20gJ21kNSc7XG5pbXBvcnQgeyBleGVjdXRlQ29tbWFuZHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyByZXJvdXRlciB9IGZyb20gJy4vcmVyb3V0ZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vIGFwcCBvcmlnaW4gaW5mb1xuY29uc3QgYXBwU2Vzc2lvblJvb3QgPSBgZGF0YS9kYXRhLyR7Q09OU1RBTlRTLnBhY2thZ2VOYW1lfWA7XG5jb25zdCBhcHBSZWNvcmRSb290ID0gYC9zZGNhcmQvQW5kcm9pZC9kYXRhLyR7Q09OU1RBTlRTLnBhY2thZ2VOYW1lfS9maWxlc2A7XG5cbi8vIGNhY2hlIGluZm9cbmNvbnN0IGxpY2Vuc2VGaWxlUGF0aDogc3RyaW5nID0gJy9zZGNhcmQvUm9ib3Rtb24vbGljZW5zZS50eHQnO1xuY29uc3Qgc2NyaXB0Q2FjaGVSb290ID0gJy9zZGNhcmQvUm9ib3Rtb24vbG9naW5DYWNoZSc7XG5jb25zdCBhbmRyb2lkSWRGaWxlUGF0aCA9IGAke3NjcmlwdENhY2hlUm9vdH0vYW5kcm9pZF9pZC50eHRgO1xuY29uc3QgZ2FtZVJlY29yZENhY2hlUm9vdCA9IGAke3NjcmlwdENhY2hlUm9vdH0vZ2FtZVJlY29yZGA7XG5cbi8vIGNsb3VkIGluZm9cbmNvbnN0IGVuZHBvaW50ID0gJ3MzLnJvYm90bW9uLmFwcDo5MDAwJztcbmNvbnN0IGJ1Y2tldCA9ICdtbGItcmVjb3JkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRTZXNzaW9uKCkge1xuICBpZiAoIWNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB7IGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGNvbnN0IGxhc3RMaWNlbnNlSWQgPSByZWFkRmlsZShsaWNlbnNlRmlsZVBhdGgpIHx8ICcnO1xuICB3cml0ZUZpbGUobGljZW5zZUZpbGVQYXRoLCBsaWNlbnNlSWQpO1xuICBjb25zb2xlLmxvZyhgbGFzdExpY2Vuc2VJZDogJHtsYXN0TGljZW5zZUlkfSwgY3VycmVudExpY2Vuc2VJZDogJHtsaWNlbnNlSWR9YCk7XG5cbiAgLy8gYWN0aW9ucyBiYXNlZCBvbiBsYXN0IGFuZCBjdXJyZW50IGxpY2Vuc2VJZFxuICBzd2l0Y2ggKGxpY2Vuc2VJZCkge1xuICAgIC8vIGVtcHR5IGxpY2Vuc2VJZFxuICAgIGNhc2UgJyc6XG4gICAgICBsb2dPdXQoKTtcbiAgICAgIHNsZWVwKDMwMDApO1xuICAgICAgYnJlYWs7XG5cbiAgICAvLyBoYXMgbGljZW5zZUlkXG4gICAgZGVmYXVsdDpcbiAgICAgIHN3aXRjaCAobGFzdExpY2Vuc2VJZCkge1xuICAgICAgICAvLyBlbXB0eSBsYXN0TGljZW5zZUlkXG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gc2FtZSBsaWNlbnNlSWRcbiAgICAgICAgY2FzZSBsaWNlbnNlSWQ6XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gZGlmZmVyZW50IGxpY2Vuc2VJZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGxvZ091dCgpO1xuICAgICAgICAgIHNsZWVwKDMwMDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNDbG91ZFNlc3Npb24gPSBmZXRjaFNlc3Npb24oKTtcbiAgICAgIGlmIChoYXNDbG91ZFNlc3Npb24pIHtcbiAgICAgICAgbG9nSW4oKTtcbiAgICAgICAgc2xlZXAoMzAwMCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIHJlc3RhcnQgYXBwIGlmIG5lZWRlZFxuICBsZXQgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgd2hpbGUgKCFpc0luQXBwKSB7XG4gICAgcmVyb3V0ZXIuc3RhcnRBcHAoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB9XG4gIHNsZWVwKDMwMDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kU2Vzc2lvbigpIHtcbiAgaWYgKCFjb25maWcuaXNDbG91ZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgeyBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuICBpZiAobGljZW5zZUlkKSB7XG4gICAgbG9nT3V0KCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgY29uc29sZS5sb2coJz09PT0gc3RvcCBzY3JpcHQ6IGhhcyBsaWNlbnNlSWQ7IGNsb3NlIGFwcCBhbmQgY2xlYXIgc2Vzc2lvbicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCc9PT09IHN0b3Agc2NyaXB0OiBubyBsaWNlbnNlSWQ7IG5vdCB0byBjbG9zZSBhcHAgZm9yIGxldCBuZXcgdXNlciBsb2dpbicpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRTZXNzaW9uKCkge1xuICBpZiAoIWNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB7IHhyb2JvdG1vblMzS2V5LCB4cm9ib3Rtb25TM1Rva2VuLCBsaWNlbnNlSWQgfSA9IGNvbmZpZztcbiAgbGljZW5zZUlkID0gbGljZW5zZUlkIHx8ICcnO1xuXG4gIGlmICghKHhyb2JvdG1vblMzS2V5ICYmIHhyb2JvdG1vblMzVG9rZW4gJiYgbGljZW5zZUlkKSkge1xuICAgIGNvbnNvbGUubG9nKCdmYWlsZWQgdXBsb2FkOyByZXF1aXJlZCBrZXkgaXMgZW1wdHknKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zb2xlLmxvZyhgdXBsb2FkIHNlc3Npb24gJHtsaWNlbnNlSWR9IHN0YXJ0YCk7XG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICAvLyByZW1vdmUgdG1wIGZpbGUgcm9vdFxuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCxcbiAgICBgcm0gLWYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcblxuICAgIC8vIGNvcHkgbG9jYWwgc2Vzc2lvbiB0byB0bXAgZmlsZSByb290XG4gICAgYG1rZGlyIC1wICR7c2NyaXB0Q2FjaGVSb290fS9gLFxuICAgIGBjcCAtciAke2FwcFNlc3Npb25Sb290fS9maWxlcyAke3NjcmlwdENhY2hlUm9vdH0vYCxcbiAgICBgY3AgLXIgJHthcHBTZXNzaW9uUm9vdH0vc2hhcmVkX3ByZWZzICR7c2NyaXB0Q2FjaGVSb290fS9gXG4gICk7XG4gIGNvcHlHYW1lUmVjb3JkVG9DYWNoZSgpO1xuXG4gIC8vIGNvcHkgY3VycmVudCBhbmRyb2lkIGlkIHRvIHRtcCBmaWxlIHJvb3RcbiAgY29uc3QgYW5kcm9pZElkID0gZXhlY3V0ZSgnQU5EUk9JRF9EQVRBPS9kYXRhIHNldHRpbmdzIGdldCBzZWN1cmUgYW5kcm9pZF9pZCcpO1xuICBjb25zb2xlLmxvZyhgdXBsb2FkIGFuZHJvaWRJZDogJHthbmRyb2lkSWR9YCk7XG4gIHdyaXRlRmlsZShhbmRyb2lkSWRGaWxlUGF0aCwgYW5kcm9pZElkKTtcblxuICB0YXJneihgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCwgYCR7c2NyaXB0Q2FjaGVSb290fWApO1xuXG4gIC8vIHVwbG9hZCBzZXNzaW9uXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGNvbnN0IHNlc3Npb25GaWxlTmFtZSA9IGBsb2dpbkNhY2hlLyR7bGljZW5zZUlkfS5nemA7XG4gIGNvbnN0IHNpemVPckVycm9yID0gczNVcGxvYWRGaWxlKFxuICAgIGAke3NjcmlwdENhY2hlUm9vdH0uZ3pgLFxuICAgIHNlc3Npb25GaWxlTmFtZSxcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICBlbmRwb2ludCxcbiAgICBidWNrZXQsXG4gICAgeHJvYm90bW9uUzNLZXksXG4gICAgeHJvYm90bW9uUzNUb2tlbixcbiAgICAnJyxcbiAgICBmYWxzZVxuICApO1xuICBjb25zb2xlLmxvZyhgdXBsb2FkIHNlc3Npb24gdG8gJHtlbmRwb2ludH0gZmluaXNoLiBzaXplT3JFcnJvciAke3NpemVPckVycm9yfTsgdXNlZFRpbWUgJHtEYXRlLm5vdygpIC0gbm93fWApO1xuXG4gIC8vIHJlbW92ZSB0bXAgZmlsZSByb290XG4gIGV4ZWN1dGVDb21tYW5kcyhgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fWAsIGBybSAtZiAke3NjcmlwdENhY2hlUm9vdH0uZ3pgKTtcbn1cblxuZnVuY3Rpb24gbG9nT3V0KCkge1xuICBjb25zb2xlLmxvZyhgZG8gbG9nb3V0YCk7XG4gIGxldCBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB3aGlsZSAoaXNJbkFwcCkge1xuICAgIHJlcm91dGVyLnN0b3BBcHAoKTtcbiAgICBzbGVlcCgzMDAwKTtcbiAgICBpc0luQXBwID0gcmVyb3V0ZXIuY2hlY2tJbkFwcCgpO1xuICB9XG4gIGNvbnNvbGUubG9nKCdhcHAgaXMgc3RvcHBlZCwgY2xlYXIgc2Vzc2lvbiBzdGFydCcpO1xuICBjbGVhclNlc3Npb24oKTtcbiAgd3JpdGVGaWxlKGxpY2Vuc2VGaWxlUGF0aCwgJycpO1xufVxuZnVuY3Rpb24gbG9nSW4oKSB7XG4gIGxldCB7IGxpY2Vuc2VJZCB9ID0gY29uZmlnO1xuICBsaWNlbnNlSWQgPSBsaWNlbnNlSWQgfHwgJyc7XG4gIGNvbnNvbGUubG9nKGBkbyBsb2dpbmApO1xuICBsZXQgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgd2hpbGUgKGlzSW5BcHApIHtcbiAgICByZXJvdXRlci5zdG9wQXBwKCk7XG4gICAgc2xlZXAoMzAwMCk7XG4gICAgaXNJbkFwcCA9IHJlcm91dGVyLmNoZWNrSW5BcHAoKTtcbiAgfVxuICBjb25zb2xlLmxvZygnYXBwIGlzIHN0b3BwZWQsIHNldCBzZXNzaW9uIHN0YXJ0Jyk7XG4gIHNldFNlc3Npb24oKTtcbiAgd3JpdGVGaWxlKGxpY2Vuc2VGaWxlUGF0aCwgbGljZW5zZUlkKTtcbn1cblxuZnVuY3Rpb24gZmV0Y2hTZXNzaW9uKCk6IGJvb2xlYW4ge1xuICBsZXQgeyB4cm9ib3Rtb25TM0tleSwgeHJvYm90bW9uUzNUb2tlbiwgbGljZW5zZUlkIH0gPSBjb25maWc7XG4gIGxpY2Vuc2VJZCA9IGxpY2Vuc2VJZCB8fCAnJztcbiAgaWYgKCEoeHJvYm90bW9uUzNLZXkgJiYgeHJvYm90bW9uUzNUb2tlbiAmJiBsaWNlbnNlSWQpKSB7XG4gICAgY29uc29sZS5sb2coJ2ZldGNoIGZhaWxlZDogcmVxdWlyZWQga2V5IGlzIGVtcHR5Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc29sZS5sb2coYGZldGNoU2Vzc2lvbiBzdGFydCAke2xpY2Vuc2VJZH1gKTtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgLy8gcmVtb3ZlIG9sZCBmaWxlc1xuICAgIGBybSAtcmYgJHtzY3JpcHRDYWNoZVJvb3R9YCxcbiAgICBgcm0gLWYgJHtzY3JpcHRDYWNoZVJvb3R9Lmd6YCxcblxuICAgIC8vIGNyZWF0ZSB0bXAgZmlsZSByb290XG4gICAgYG1rZGlyIC1wICR7c2NyaXB0Q2FjaGVSb290fWBcbiAgKTtcblxuICBjb25zdCBzZXNzaW9uRmlsZU5hbWUgPSBgbG9naW5DYWNoZS8ke2xpY2Vuc2VJZH0uZ3pgO1xuICBjb25zdCByZXN1bHRPckVycm9yID0gczNEb3dubG9hZEZpbGUoYCR7c2NyaXB0Q2FjaGVSb290fS5nemAsIHNlc3Npb25GaWxlTmFtZSwgZW5kcG9pbnQsIGJ1Y2tldCwgeHJvYm90bW9uUzNLZXksIHhyb2JvdG1vblMzVG9rZW4sICcnLCBmYWxzZSk7XG4gIGlmIChyZXN1bHRPckVycm9yICE9PSB0cnVlKSB7XG4gICAgY29uc29sZS5sb2coYGZldGNoU2Vzc2lvbiBmYWlsZWQgJHtyZXN1bHRPckVycm9yfWApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zb2xlLmxvZyhgRG93bmxvYWQgc2Vzc2lvbiBmcm9tICR7ZW5kcG9pbnR9IGZpbmlzaC4gdXNlZFRpbWVgLCBEYXRlLm5vdygpIC0gbm93LCBsaWNlbnNlSWQsIHJlc3VsdE9yRXJyb3IpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2V0U2Vzc2lvbigpIHtcbiAgLy8gY2xlYXIgYXBwIHNlc3Npb24gdG8gYXZvaWQgY2Fubm90IG92ZXJ3cml0ZVxuICBjb25zdCBnYW1lUmVjb3JkRmlsZU5hbWUgPSBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKSB8fCAnTk9UX0VYSVNUX1JFQ09SRCc7XG4gIGV4ZWN1dGVDb21tYW5kcyhgcm0gLXJmICR7YXBwU2Vzc2lvblJvb3R9L2ZpbGVzYCwgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLCBgcm0gLXJmICR7YXBwUmVjb3JkUm9vdH0vJHtnYW1lUmVjb3JkRmlsZU5hbWV9YCk7XG5cbiAgLy8gdW50YXJneiBjbG91ZCBzZXNzaW9uIGFuZCBvdmVyd3JpdGUgYXBwIHNlc3Npb25cbiAgY29uc29sZS5sb2coYHNldCBzZXNzaW9uIHN0YXJ0YCk7XG4gIHVudGFyZ3ooYCR7c2NyaXB0Q2FjaGVSb290fS5nemApO1xuICBleGVjdXRlQ29tbWFuZHMoXG4gICAgYGNwIC1yICR7c2NyaXB0Q2FjaGVSb290fS9maWxlcyAke2FwcFNlc3Npb25Sb290fS9gLFxuICAgIGBjcCAtciAke3NjcmlwdENhY2hlUm9vdH0vc2hhcmVkX3ByZWZzICR7YXBwU2Vzc2lvblJvb3R9L2AsXG4gICAgYGNwIC1yICR7c2NyaXB0Q2FjaGVSb290fS9nYW1lUmVjb3JkLyogJHthcHBSZWNvcmRSb290fS9gLFxuXG4gICAgYGNobW9kIC1SIDc3NyAke2FwcFNlc3Npb25Sb290fS9maWxlc2AsXG4gICAgYGNobW9kIC1SIDc3NyAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLFxuICAgIGBjaG1vZCAtUiA3NzcgJHthcHBSZWNvcmRSb290fWBcbiAgKTtcbiAgc2V0QW5kcm9pZElkKCdjbG91ZCcpO1xuICBjb25zb2xlLmxvZygnc2V0IHNlc3Npb24gZG9uZScpO1xuICBzbGVlcCgyMDAwKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJTZXNzaW9uKCkge1xuICBzZXRBbmRyb2lkSWQoJ3JhbmRvbScpO1xuICBjb25zdCBnYW1lUmVjb3JkRmlsZU5hbWUgPSBnZXRHYW1lUmVjb3JkRmlsZU5hbWUoKSB8fCAnTk9UX0VYSVNUX1JFQ09SRCc7XG4gIGV4ZWN1dGVDb21tYW5kcyhcbiAgICBgcm0gLXJmICR7c2NyaXB0Q2FjaGVSb290fS5nemAsXG4gICAgYHJtIC1yZiAke3NjcmlwdENhY2hlUm9vdH1gLFxuXG4gICAgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9maWxlc2AsXG4gICAgYHJtIC1yZiAke2FwcFNlc3Npb25Sb290fS9zaGFyZWRfcHJlZnNgLFxuICAgIGBybSAtcmYgJHthcHBSZWNvcmRSb290fS8ke2dhbWVSZWNvcmRGaWxlTmFtZX1gXG4gICk7XG4gIGNvbnNvbGUubG9nKCdjbGVhciBzZXNzaW9uIGRvbmUnKTtcbiAgc2xlZXAoMjAwMCk7XG59XG5cbmZ1bmN0aW9uIHNldEFuZHJvaWRJZChzb3VyY2U6ICdyYW5kb20nIHwgJ2Nsb3VkJykge1xuICBsZXQgW29yaUFuZHJvaWRJZF0gPSBleGVjdXRlQ29tbWFuZHMoJ0FORFJPSURfREFUQT0vZGF0YSBzZXR0aW5ncyBnZXQgc2VjdXJlIGFuZHJvaWRfaWQnKTtcbiAgbGV0IGFuZHJvaWRJZCA9IE1ENShgJHtEYXRlLm5vdygpfSR7b3JpQW5kcm9pZElkfWApLnN1YnN0cmluZygwLCAxNik7XG4gIGlmIChzb3VyY2UgPT09ICdjbG91ZCcpIHtcbiAgICBhbmRyb2lkSWQgPSByZWFkRmlsZShhbmRyb2lkSWRGaWxlUGF0aCkgfHwgYW5kcm9pZElkO1xuICB9XG4gIGV4ZWN1dGVDb21tYW5kcygnQU5EUk9JRF9EQVRBPS9kYXRhIHNldHRpbmdzIHB1dCBzZWN1cmUgYW5kcm9pZF9pZCAnICsgYW5kcm9pZElkKTtcbiAgY29uc29sZS5sb2coJ29yaUFuZHJvaWRJZCcsIG9yaUFuZHJvaWRJZCk7XG4gIGNvbnNvbGUubG9nKCdzZXRBbmRyb2lkSWQnLCBhbmRyb2lkSWQpO1xufVxuXG5mdW5jdGlvbiBjb3B5R2FtZVJlY29yZFRvQ2FjaGUoKSB7XG4gIGNvbnN0IGZpbGVOYW1lID0gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCk7XG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZXhlY3V0ZUNvbW1hbmRzKGBta2RpciAtcCAke2dhbWVSZWNvcmRDYWNoZVJvb3R9YCwgYGNwIC1yICR7YXBwUmVjb3JkUm9vdH0vJHtmaWxlTmFtZX0gJHtnYW1lUmVjb3JkQ2FjaGVSb290fS8ke2ZpbGVOYW1lfS9gKTtcbn1cblxuZnVuY3Rpb24gZ2V0R2FtZVJlY29yZEZpbGVOYW1lKCkge1xuICBjb25zdCBmaWxlcyA9IGV4ZWN1dGVDb21tYW5kcyhgbHMgJHthcHBSZWNvcmRSb290fWApWzBdLnNwbGl0KCdcXG4nKTtcbiAgZm9yIChsZXQgZmlsZU5hbWUgb2YgZmlsZXMpIHtcbiAgICBpZiAoZmlsZU5hbWUubGVuZ3RoID09PSAzMikge1xuICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS50cmltKCk7XG4gICAgICBjb25zb2xlLmxvZyhgZ2FtZSByZWNvcmQgJHtmaWxlTmFtZX1gKTtcbiAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuIiwiaW1wb3J0IHsgcmVyb3V0ZXIgfSBmcm9tICcuL3Jlcm91dGVyJztcbmltcG9ydCAqIGFzIEV2ZW50U2VuZGVyIGZyb20gJy4vZXZlbnRTZW5kZXInO1xuaW1wb3J0ICogYXMgU2Vzc2lvbiBmcm9tICcuL3Nlc3Npb24nO1xuaW1wb3J0ICogYXMgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBleGVjdXRlQ29tbWFuZHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVHYW1lID0ge1xuICB0cnlFbnRlckdhbWVDbnRzOiAwLFxuICBuZWVkUmVzZXRQcm9ncmVzczogZmFsc2UsXG4gIGxhc3RDaGVja1Bvd2VyU2F2ZUF0OiAwLFxuICBwb3dlclNhdmVDb2xvckNvdW50OiB7fSxcbn07XG5leHBvcnQgbGV0IGlzV2FpdGluZ0xvZ2luID0gZmFsc2U7XG5sZXQgbGFzdFVwbG9hZFNlc3Npb25BdCA9IDA7XG5sZXQgaGFzU2Vzc2lvbiA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdChqc29uQ29uZmlnOiBhbnkpIHtcbiAgQ29uZmlnLnNldChqc29uQ29uZmlnKTtcbiAgcmVyb3V0ZXIucmVyb3V0ZXJDb25maWcuYXV0b0xhdW5jaEFwcCA9IENvbmZpZy5jb25maWcuaGFzQ29vbEZlYXR1cmUgfHwgZmFsc2U7XG4gIGlmIChDb25maWcuY29uZmlnLmlzQ2xvdWQpIHtcbiAgICBTZXNzaW9uLmluaXRTZXNzaW9uKCk7XG4gICAgZXhlY3V0ZUNvbW1hbmRzKCdwbSBkaXNhYmxlLXVzZXIgY29tLmFuZHJvaWQuaW5wdXRtZXRob2QubGF0aW4nKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kKCkge1xuICBpZiAoQ29uZmlnLmNvbmZpZy5pc0Nsb3VkKSB7XG4gICAgU2Vzc2lvbi5lbmRTZXNzaW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uUnVubmluZyh1c2VJbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIEV2ZW50U2VuZGVyLnJ1bm5pbmcodXNlSW50ZXJ2YWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25Mb2dpblBhZ2UobmVlZFVzZXJJbnB1dDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIGhhc1Nlc3Npb24gPSBmYWxzZTtcbiAgaXNXYWl0aW5nTG9naW4gPSB0cnVlO1xuICAvLyB1c2UgaW50ZXJ2YWwgaW4gcnVubmluZ1xuICBFdmVudFNlbmRlci5ydW5uaW5nKHRydWUpO1xuXG4gIGlmIChuZWVkVXNlcklucHV0KSB7XG4gICAgRXZlbnRTZW5kZXIubG9naW5JbnB1dGluZygpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkxvZ2luU3VjY2VzcygpIHtcbiAgaGFzU2Vzc2lvbiA9IHRydWU7XG4gIGlzV2FpdGluZ0xvZ2luID0gZmFsc2U7XG4gIEV2ZW50U2VuZGVyLmxvZ2luU3VjY2VzcygpO1xuICBFdmVudFNlbmRlci5wbGF5aW5nKCk7XG4gIEV2ZW50U2VuZGVyLnJ1bm5pbmcoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uTGF1bmNoaW5nKCkge1xuICBoYXNTZXNzaW9uID0gZmFsc2U7XG4gIGxhc3RVcGxvYWRTZXNzaW9uQXQgPSAwO1xuICBsZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHMgPSBsZWFndWVHYW1lLnRyeUVudGVyR2FtZUNudHM7XG4gIGxlYWd1ZUdhbWUubmVlZFJlc2V0UHJvZ3Jlc3MgPSBmYWxzZTtcbiAgbGVhZ3VlR2FtZS5sYXN0Q2hlY2tQb3dlclNhdmVBdCA9IDA7XG4gIGxlYWd1ZUdhbWUucG93ZXJTYXZlQ29sb3JDb3VudCA9IHt9O1xuICBFdmVudFNlbmRlci5sYXVuY2hpbmcoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVXBsb2FkU2Vzc2lvbigpIHtcbiAgLy8gb25seSB1cGxvYWQgc2Vzc2lvbiB3aGVuIGlzIHBsYXlpbmdcbiAgaWYgKCFDb25maWcuY29uZmlnLmlzQ2xvdWQgfHwgIWhhc1Nlc3Npb24pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgaWYgKG5vdyAtIGxhc3RVcGxvYWRTZXNzaW9uQXQgPCBDT05TVEFOVFMudXBsb2FkU2Vzc2lvbkludGVydmFsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxhc3RVcGxvYWRTZXNzaW9uQXQgPSBub3c7XG4gIGNvbnNvbGUubG9nKCd1cGxvYWQgc2Vzc2lvbicpO1xuICBTZXNzaW9uLnVwbG9hZFNlc3Npb24oKTtcbn1cbiIsImltcG9ydCB7IEdyb3VwUGFnZSwgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcblxuZXhwb3J0IGNvbnN0IGxvZ28gPSBuZXcgUGFnZShcbiAgJ2xvZ28nLFxuICBbXG4gICAgeyB4OiAyMjcsIHk6IDE4NCwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogMjU4LCB5OiAxODcsIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDI3OCwgeTogMTkwLCByOiAyMzIsIGc6IDQ4LCBiOiA3MiB9LFxuICAgIHsgeDogMjg1LCB5OiAxODMsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDMwMSwgeTogMTcyLCByOiAyMjksIGc6IDE5LCBiOiA0NiB9LFxuICAgIHsgeDogMzE2LCB5OiAxODcsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDMzNSwgeTogMTg4LCByOiAyMjgsIGc6IDQsIGI6IDMzIH0sXG4gICAgeyB4OiAzNzIsIHk6IDE4OCwgcjogMjUyLCBnOiAyMzMsIGI6IDIzNSB9LFxuICAgIHsgeDogMzc1LCB5OiAxNjksIHI6IDIyOCwgZzogNCwgYjogMzMgfSxcbiAgICB7IHg6IDM5NSwgeTogMTg0LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG4gICAgeyB4OiAzOTgsIHk6IDE3MCwgcjogMjI4LCBnOiA0LCBiOiAzMyB9LFxuICAgIHsgeDogNDAzLCB5OiAxODYsIHI6IDI1NCwgZzogMjU0LCBiOiAyNTQgfSxcbiAgICB7IHg6IDExNywgeTogMTE0LCByOiAyNTQsIGc6IDI1NCwgYjogMjU0IH0sXG5cbiAgICAvLyBsb2FkaW5nIG9uIGxlZnQgdG9wIGlmIHN0dWNrXG4gICAgLy8geyB4OiAyLCB5OiA1LCByOiAxNDIsIGc6IDIwOCwgYjogMjAyIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuLy8gdGVybSBvZiBzZXJ2aWNlXG5leHBvcnQgY29uc3QgVE9TID0gbmV3IFBhZ2UoXG4gICdUT1MnLFxuICBbXG4gICAgLy8gbG9nb1xuICAgIHsgeDogMjg5LCB5OiA0MCwgcjogMjMyLCBnOiA1MiwgYjogNzQgfSxcbiAgICB7IHg6IDI5MywgeTogMzQsIHI6IDIyOSwgZzogMjEsIGI6IDQ2IH0sXG4gICAgeyB4OiAyOTksIHk6IDM4LCByOiAyMjcsIGc6IDYsIGI6IDMzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDM3LCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMTMsIHk6IDM5LCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMjEsIHk6IDM3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjUsIHk6IDQyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzMsIHk6IDMzLCByOiAyNTIsIGc6IDIyMywgYjogMjI3IH0sXG4gICAgeyB4OiAzMzgsIHk6IDM4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNDIsIHk6IDM4LCByOiAyNDYsIGc6IDE3NiwgYjogMTg1IH0sXG4gICAgeyB4OiAzNDQsIHk6IDM3LCByOiAyNDYsIGc6IDE3NywgYjogMTg1IH0sXG4gICAgeyB4OiAzNDYsIHk6IDM2LCByOiAyMzQsIGc6IDY4LCBiOiA4OSB9LFxuICAgIHsgeDogMzM1LCB5OiAzNCwgcjogMjM0LCBnOiA2NywgYjogODcgfSxcbiAgICB7IHg6IDMzNSwgeTogMzcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM0NCwgeTogMzUsIHI6IDIyNywgZzogNiwgYjogMzMgfSxcblxuICAgIC8vIGNvcHlyaWdodFxuICAgIHsgeDogMjg5LCB5OiAzMzUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwMCwgeTogMzM2LCByOiAxOTQsIGc6IDE5NywgYjogMTk1IH0sXG4gICAgeyB4OiAzMDEsIHk6IDMzNiwgcjogMTg3LCBnOiAxOTIsIGI6IDE4OSB9LFxuICAgIHsgeDogMzA3LCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxMCwgeTogMzM2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjAsIHk6IDMzNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIzLCB5OiAzMzYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMzMiwgeTogMzM2LCByOiAxODEsIGc6IDE4NiwgYjogMTgzIH0sXG4gICAgeyB4OiAzNDAsIHk6IDMzNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gICAgLy8gYWdyZWUgYnRuIGJnXG4gICAgeyB4OiAxNywgeTogMjkzLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA1NCwgeTogMzA1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MiwgeTogMzE3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxMTEsIHk6IDMxNiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjQzLCB5OiAyOTcsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDI1NSwgeTogMjkxLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA1OTksIHk6IDMwNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjEzLCB5OiAyOTUsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDYwMywgeTogMzE2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0MjEsIHk6IDMyMiwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuXG4gICAgLy8gYmcgY29ybmVyIG91dHNpZGVcbiAgICB7IHg6IDcyLCB5OiAzMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTExLCB5OiA0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTg2LCB5OiAzOSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTQsIHk6IDM0MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjE5LCB5OiAzNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGJnIGNvcm5lciBpbnNpZGVcbiAgICB7IHg6IDIyLCB5OiA3NywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogMTAwLCB5OiA3NywgcjogMTk3LCBnOiAxOTcsIGI6IDE5NyB9LFxuICAgIHsgeDogMTgsIHk6IDI1MywgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNjEzLCB5OiAyODYsIHI6IDIxNiwgZzogMjE2LCBiOiAyMTYgfSxcbiAgICB7IHg6IDYxMywgeTogODAsIHI6IDIxNSwgZzogMjE1LCBiOiAyMTUgfSxcbiAgICB7IHg6IDYwOSwgeTogNzMsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDMwNSwgeTogNzYsIHI6IDE4MywgZzogMTgzLCBiOiAxODMgfSxcbiAgICB7IHg6IDMwNCwgeTogMjkxLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDYgfSxcbiAgeyB4OiAzMjAsIHk6IDMwNiB9XG4pO1xuXG4vLyB0ZXJtIG9mIHNlcnZpY2UsIHN1aXQgZGdpOTBcbmV4cG9ydCBjb25zdCBUT1M5MCA9IG5ldyBQYWdlKFxuICAnVE9TOTAnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDMyLCB5OiAyOCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTAsIHk6IDM0MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjIyLCB5OiAzNDMsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYyMSwgeTogMzIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIC8vIGxvZ29cbiAgICB7IHg6IDI4OCwgeTogMjcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwMSwgeTogMjcsIHI6IDI0NiwgZzogMTc3LCBiOiAxODUgfSxcbiAgICB7IHg6IDMyMSwgeTogMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMCwgeTogMjgsIHI6IDI0NSwgZzogMTYxLCBiOiAxNzEgfSxcbiAgICB7IHg6IDMzMCwgeTogMjgsIHI6IDIzMCwgZzogMzYsIGI6IDYwIH0sXG4gICAgeyB4OiAzNDQsIHk6IDI4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9XG4pO1xuXG4vLyBmb3IgZGdpOTAgYW5kIG5hdmkgYmFyIGlzIHNtYWxsZXJcbmV4cG9ydCBjb25zdCBUT1M5MHYyID0gbmV3IFBhZ2UoXG4gICdUT1M5MHYyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAyLCB5OiAyMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMSwgeTogNDIsIHI6IDIzMiwgZzogMjMyLCBiOiAyMzIgfSxcbiAgICB7IHg6IDEsIHk6IDMyNSwgcjogMjMyLCBnOiAyMzIsIGI6IDIzMiB9LFxuICAgIHsgeDogNywgeTogMzQ4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MzEsIHk6IDM1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjI4LCB5OiAzMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYzMywgeTogMjkyLCByOiAyMTMsIGc6IDIxMywgYjogMjEzIH0sXG4gICAgeyB4OiA2MzAsIHk6IDQwLCByOiAyMzIsIGc6IDIzMiwgYjogMjMyIH0sXG4gICAgeyB4OiA2MjgsIHk6IDIxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBsb2dvXG4gICAgeyB4OiAyOTYsIHk6IDIxLCByOiAyNDgsIGc6IDE5MiwgYjogMTk5IH0sXG4gICAgeyB4OiAzMTYsIHk6IDI0LCByOiAyMjcsIGc6IDYsIGI6IDMzIH0sXG4gICAgeyB4OiAzNDAsIHk6IDIyLCByOiAyMzksIGc6IDExNSwgYjogMTMwIH0sXG4gIF0sXG4gIHsgeDogMzIxLCB5OiAzMjEgfSxcbiAgeyB4OiAzMjEsIHk6IDMyMSB9XG4pO1xuXG4vLyBsaWtlIGxhbmRpbmcgYnV0IGhhcyBwcm9ncmVzcyBiYXJcbmV4cG9ydCBjb25zdCBsYW5kaW5nTG9hZGluZyA9IG5ldyBQYWdlKFxuICAnbGFuZGluZ0xvYWRpbmcnLFxuICBbXG4gICAgLy8gbG9nbyBpbiBjZW50ZXJcbiAgICAvLyA5aW5uaW5nc1xuICAgIHsgeDogMjk1LCB5OiAyNDIsIHI6IDMwLCBnOiA1MCwgYjogODIgfSxcbiAgICB7IHg6IDI4MywgeTogMjIwLCByOiA2MCwgZzogNjksIGI6IDk0IH0sXG4gICAgeyB4OiAyOTIsIHk6IDIyMCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzAwLCB5OiAyMTUsIHI6IDIzNCwgZzogMjM1LCBiOiAyMzcgfSxcbiAgICB7IHg6IDM1MCwgeTogMjIwLCByOiAyNDQsIGc6IDIzNSwgYjogMjM3IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxhbmRpbmcgPSBuZXcgUGFnZShcbiAgJ2xhbmRpbmcnLFxuICBbXG4gICAgLy8gbG9nbyBpbiBjZW50ZXJcbiAgICB7IHg6IDI5NywgeTogMjQ2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyODEsIHk6IDI0NCwgcjogOCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzMDMsIHk6IDI0MywgcjogMjE5LCBnOiAxNDksIGI6IDE2NCB9LFxuXG4gICAgLy8gOWlubmluZ3NcbiAgICB7IHg6IDIxOCwgeTogMjY5LCByOiA4OCwgZzogOTksIGI6IDEzMCB9LFxuICAgIHsgeDogMjM5LCB5OiAyNzcsIHI6IDI2LCBnOiA0NSwgYjogNjUgfSxcbiAgICB7IHg6IDI3NCwgeTogMjc0LCByOiAyNSwgZzogNDEsIGI6IDc0IH0sXG4gICAgeyB4OiAzMTMsIHk6IDI3OCwgcjogMTM0LCBnOiAxNDMsIGI6IDE2MCB9LFxuICAgIHsgeDogMzI3LCB5OiAyODIsIHI6IDk5LCBnOiAxMDQsIGI6IDEyOCB9LFxuICAgIHsgeDogMzUwLCB5OiAyNjksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiAyNTQsIHk6IDIwMCB9LCAvLyBoaXZlIGxvZ2luXG4gIHsgeDogMjU0LCB5OiAyMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxvZ0luID0gbmV3IFBhZ2UoXG4gICdsb2dJbicsXG4gIFtcbiAgICB7IHg6IDIyNiwgeTogNzYsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDMyMiwgeTogNzgsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDUzNSwgeTogNDIsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDYyNCwgeTogNDAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDY2LCB5OiAzMzMsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDQ0LCB5OiAyMzUsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDEzNiwgeTogMjM2LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAyNTgsIHk6IDIzMiwgcjogMTQzLCBnOiAxODYsIGI6IDIyNyB9LFxuICAgIHsgeDogNTQ4LCB5OiAxNjksIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNTgzLCB5OiAxOTUsIHI6IDQzLCBnOiAxMzIsIGI6IDIxNiB9LFxuICAgIHsgeDogNDMsIHk6IDE0MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDMsIHk6IDE5NSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDU1NCwgeTogMTc3IH0sIC8vIGxvZ2luXG4gIHsgeDogNTc0LCB5OiA0MCB9IC8vIGJhY2sgdG8gZ2FtZVxuKTtcblxuLy8gc3VpdCBmb3IgZHBpIDkwXG5leHBvcnQgY29uc3QgbG9nSW45MCA9IG5ldyBQYWdlKFxuICAnbG9nSW45MCcsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogMTksIHk6IDMwLCByOiA0OCwgZzogNDgsIGI6IDQ4IH0sXG4gICAgeyB4OiA2LCB5OiAxMzIsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDYzMCwgeTogMjUsIHI6IDQ4LCBnOiA0OCwgYjogNDggfSxcbiAgICB7IHg6IDYzMSwgeTogMzM5LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAxNCwgeTogMzQ1LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiA4MCwgeTogMzQwLCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG4gICAgeyB4OiAyODIsIHk6IDM0MCwgcjogMjM4LCBnOiAyMzgsIGI6IDIzOCB9LFxuICAgIHsgeDogNDIwLCB5OiAzMzYsIHI6IDIzOCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDU2NywgeTogMzM4LCByOiAyMzgsIGc6IDIzOCwgYjogMjM4IH0sXG5cbiAgICAvLyBpbnB1dFxuICAgIHsgeDogNDc4LCB5OiAxMzEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ3OCwgeTogMTg4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBsb2dpbiBidG5cbiAgICB7IHg6IDUwMCwgeTogMTMwLCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDUwMCwgeTogMTU1LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDQ5OSwgeTogMTg0LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU5NSwgeTogMTI5LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU5NywgeTogMTU1LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU5OCwgeTogMTg4LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgICB7IHg6IDU0OCwgeTogMTI0LCByOiA0MywgZzogMTMyLCBiOiAyMTYgfSxcbiAgXSxcbiAgeyB4OiA1NTQsIHk6IDE3NyB9LCAvLyBsb2dpblxuICB7IHg6IDU3NCwgeTogNDAgfSAvLyBiYWNrIHRvIGdhbWVcbik7XG5cbmV4cG9ydCBjb25zdCBmYkxvZ0luOTAgPSBuZXcgUGFnZSgnZmJMb2dJbjkwJywgW1xuICAvLyBmYiBsb2dvXG4gIHsgeDogMzA0LCB5OiAxNCwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzE2LCB5OiAxNywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMwOSwgeTogMzEsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDMyNSwgeTogMzIsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDMzMSwgeTogMTUsIHI6IDI0LCBnOiAxMTksIGI6IDI0MiB9LFxuICB7IHg6IDMyNCwgeTogMTIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAzNDUsIHk6IDExLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzIzLCB5OiAxOSwgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG4gIHsgeDogMzMwLCB5OiAyMywgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG5cbiAgLy8gYmdcbiAgeyB4OiA3MywgeTogMTAyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogNTIsIHk6IDI2MSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMxMiwgeTogMzE1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogNTkxLCB5OiAxOTcsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiA0OTIsIHk6IDYyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzE4LCB5OiA4NiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuXG4gIC8vIGxvZ2luIGJ0biBiZ1xuICB7IHg6IDIwMywgeTogMTk0LCByOiAyNCwgZzogMTE5LCBiOiAyNDIgfSxcbiAgeyB4OiA0MzMsIHk6IDE5NywgcjogMjQsIGc6IDExOSwgYjogMjQyIH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGdvb2dsZUxvZ0luOTAgPSBuZXcgUGFnZSgnZ29vZ2xlTG9nSW45MCcsIFtcbiAgLy8gZ29vZ2xlIGxvZ29cbiAgeyB4OiAyOTUsIHk6IDY0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogMzA2LCB5OiA2NywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDMxOCwgeTogNjgsIHI6IDI1MSwgZzogMTg4LCBiOiA1IH0sXG4gIHsgeDogMzIxLCB5OiA2OCwgcjogMjUzLCBnOiAyMjEsIGI6IDEzMCB9LFxuICB7IHg6IDMyOSwgeTogNjgsIHI6IDY2LCBnOiAxMzMsIGI6IDI0NCB9LFxuICB7IHg6IDMzNSwgeTogNjgsIHI6IDIzNCwgZzogNjcsIGI6IDUzIH0sXG5cbiAgLy8gYmdcbiAgeyB4OiA5NCwgeTogMzMsIHI6IDc1LCBnOiAxMjksIGI6IDIxOCB9LFxuICB7IHg6IDY3LCB5OiAyMjcsIHI6IDc5LCBnOiAxMzIsIGI6IDIyMSB9LFxuICB7IHg6IDE0MiwgeTogMzI5LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIHsgeDogNTU5LCB5OiAzMzgsIHI6IDYxLCBnOiAxMTQsIGI6IDIwMyB9LFxuICB7IHg6IDUzOSwgeTogODAsIHI6IDYzLCBnOiAxMTcsIGI6IDIwNSB9LFxuICB7IHg6IDM1MCwgeTogMzM0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgLy8gbG9naW4gYnRuIGJnXG4gIHsgeDogNDc4LCB5OiAyMjQsIHI6IDI2LCBnOiAxMTUsIGI6IDIzMiB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBkb3dubG9hZERhdGEgPSBuZXcgUGFnZShcbiAgJ2Rvd25sb2FkRGF0YScsXG4gIFtcbiAgICB7IHg6IDEwMywgeTogNDEsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDE2NywgeTogNTksIHI6IDIyLCBnOiAzMCwgYjogMzEgfSxcbiAgICB7IHg6IDE4OCwgeTogNTgsIHI6IDM5LCBnOiA0NywgYjogNDcgfSxcbiAgICB7IHg6IDIwMCwgeTogNTksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDIwOSwgeTogNjIsIHI6IDg0LCBnOiA4OCwgYjogOTIgfSxcbiAgICB7IHg6IDIzNiwgeTogNTgsIHI6IDUwLCBnOiA1NiwgYjogNTggfSxcbiAgICB7IHg6IDI0MywgeTogNTgsIHI6IDE0NCwgZzogMTUwLCBiOiAxNTIgfSxcbiAgICB7IHg6IDI5MCwgeTogNTcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMxNywgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDM1NSwgeTogNTQsIHI6IDk3LCBnOiAxMDEsIGI6IDEwNSB9LFxuICAgIHsgeDogNDA3LCB5OiA2MCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNTEzLCB5OiA0OCwgcjogMTgxLCBnOiAxODIsIGI6IDE4OCB9LFxuICAgIHsgeDogNTI3LCB5OiA1NCwgcjogMTc3LCBnOiAxNzUsIGI6IDE3NyB9LFxuICAgIHsgeDogNTE5LCB5OiA2MCwgcjogMTgxLCBnOiAxODUsIGI6IDE4OSB9LFxuICAgIHsgeDogMTY4LCB5OiAyOTgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDIyNCwgeTogMjk2LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjQ5LCB5OiAyOTgsIHI6IDEwMiwgZzogMTMzLCBiOiAxNzEgfSxcbiAgICB7IHg6IDM5MSwgeTogMjk5LCByOiAxOTUsIGc6IDIyMSwgYjogMjU1IH0sXG4gICAgeyB4OiA0NjEsIHk6IDMwMiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDIzLCB5OiAzMDMsIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sXG4gICAgeyB4OiA1MjYsIHk6IDMxOCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDQyMSwgeTogMjkzIH0sXG4gIHsgeDogNDIxLCB5OiAyOTMgfVxuKTtcbmV4cG9ydCBjb25zdCBwcm9ncmVzc0JhclJ1bm5pbmcgPSBuZXcgUGFnZShcbiAgJ3Byb2dyZXNzQmFyUnVubmluZycsXG4gIFtcbiAgICAvLyBwcm9ncmVzcyBiYXJcbiAgICB7IHg6IDIwNywgeTogMzE2LCByOiAwLCBnOiAxNTAsIGI6IDI1NSB9LFxuICAgIHsgeDogMTksIHk6IDMyMCwgcjogOCwgZzogMTIsIGI6IDE2IH0sXG4gICAgeyB4OiA2MjgsIHk6IDMyMCwgcjogOCwgZzogMTIsIGI6IDE2IH0sXG4gICAgeyB4OiAxOTUsIHk6IDMyOSwgcjogMjU1LCBnOiAyMDIsIGI6IDAgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgbWFpbiA9IG5ldyBQYWdlKFxuICAnbWFpbicsXG4gIFtcbiAgICAvLyBuYXZpIGJhciByaWdodFxuICAgIHsgeDogNjIyLCB5OiA5LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTgsIHk6IDExLCByOiAyMTQsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA1OTIsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNDk0LCB5OiAxNSwgcjogMjM5LCBnOiAxNzksIGI6IDI4IH0sXG4gICAgeyB4OiA1MDMsIHk6IDE3LCByOiA3NCwgZzogODQsIGI6IDkwIH0sXG4gICAgeyB4OiAzODksIHk6IDEyLCByOiAxOTcsIGc6IDIwMiwgYjogMTk3IH0sXG4gICAgeyB4OiAzMTMsIHk6IDExLCByOiAxNzQsIGc6IDE3OCwgYjogMTc5IH0sXG4gICAgeyB4OiAyOTcsIHk6IDE1LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvL2J0bnMgaW4gbGVmdCBib3R0b21cbiAgICB7IHg6IDI5LCB5OiAzMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYzLCB5OiAzMjIsIHI6IDU4LCBnOiA2OSwgYjogNTAgfSxcbiAgICB7IHg6IDkxLCB5OiAzMjIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEzNCwgeTogMzIyLCByOiAyMTMsIGc6IDIxMywgYjogMjEwIH0sXG4gICAgeyB4OiAxODYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjM3LCB5OiAzMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDIxOCwgeTogMzIyLCByOiA2NiwgZzogNzMsIGI6IDU4IH0sXG5cbiAgICAvLyBidG5zIGluIHJpZ2h0IGJvdHRvbVxuICAgIHsgeDogNDkzLCB5OiAzMjMsIHI6IDU4LCBnOiA2OSwgYjogNDkgfSxcbiAgICB7IHg6IDUxNiwgeTogMzI0LCByOiAyMjUsIGc6IDIxMywgYjogMjEzIH0sXG4gICAgeyB4OiA1MjUsIHk6IDMxOCwgcjogMTU1LCBnOiA0NywgYjogNTcgfSxcbiAgICB7IHg6IDU2NiwgeTogMzIyLCByOiAxNiwgZzogMTE0LCBiOiAxMjQgfSxcbiAgICB7IHg6IDU4NiwgeTogMzIwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDEsIHk6IDMyNSwgcjogMTYsIGc6IDEwOSwgYjogMTIzIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG1haW5CdG5zID0ge1xuICBsZWFndWVNb2RlOiB7IHg6IDIwNCwgeTogMTU0IH0sXG4gIGJhdHRsZU1vZGU6IHsgeDogMzUwLCB5OiAxNDUgfSxcbiAgc3BlY2lhbE1vZGU6IHsgeDogNDM4LCB5OiAxNDUgfSxcbiAgY2x1Yk1vZGU6IHsgeDogNTU2LCB5OiAxNDUgfSxcbiAgc2V0dGluZ3M6IHsgeDogMjQzLCB5OiAzMjMgfSxcbiAgYWRUYWI6IHsgeDogNTkwLCB5OiA3NyB9LFxuICBhY2hpZXZlbWVudDogeyB4OiAxNDEsIHk6IDMyMyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncycsXG4gIFtcbiAgICAvLyBuYXZpIGluIHJpZ2h0XG4gICAgLy8geyB4OiA2MjUsIHk6IDcsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICAvLyB7IHg6IDU5MywgeTogMTQsIHI6IDc0LCBnOiA5MywgYjogMTIzIH0sXG4gICAgLy8geyB4OiA1OTAsIHk6IDE0LCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIC8vIHsgeDogNDg3LCB5OiAxNSwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIC8vIHsgeDogNDgxLCB5OiAxNSwgcjogNzcsIGc6IDg2LCBiOiA5MyB9LFxuICAgIC8vIHsgeDogMzkxLCB5OiAxMSwgcjogNzksIGc6IDgwLCBiOiA3OSB9LFxuICAgIC8vIHsgeDogMzc4LCB5OiAxNiwgcjogMTMzLCBnOiAxNTAsIGI6IDE2OSB9LFxuICAgIC8vIHsgeDogMzEzLCB5OiAxMSwgcjogMTc4LCBnOiAxNzgsIGI6IDE3OSB9LFxuXG4gICAgLy8gYmcgb2YgcmlnaHQgc2VjdGlvblxuICAgIHsgeDogNDc4LCB5OiAxMTksIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ3NiwgeTogMTc1LCByOiAzNiwgZzogNDAsIGI6IDQ0IH0sXG4gICAgeyB4OiA0NzYsIHk6IDIyOCwgcjogMTA3LCBnOiA5NywgYjogOTAgfSxcbiAgICB7IHg6IDQ3NCwgeTogMjgzLCByOiA2NiwgZzogNzcsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI5MywgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYwNSwgeTogMTc4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MDgsIHk6IDEyMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuXG4gICAgLy8gZ29vZ2xlIHBsYXkgZ2FtZSBpY29uIGluIHJpZ2h0IHNlY3Rpb25cbiAgICB7IHg6IDQ5MCwgeTogMTE1LCByOiAzNSwgZzogMzgsIGI6IDUxIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNSwgeTogMzEyLCByOiAxOTMsIGc6IDE5OCwgYjogMTkxIH0sXG4gICAgeyB4OiAzOSwgeTogMzIyLCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1RhYnMgPSB7XG4gIHNvdW5kQW5kTGFuVGFiOiB7IHg6IDIyLCB5OiA1NSB9LFxuICBncmFwaGljVGFiOiB7IHg6IDExMSwgeTogNTUgfSxcbn07XG5leHBvcnQgY29uc3Qgc2V0dGluZ3NCdG5zID0ge1xuICBsZWFndWVSZXNldDogeyB4OiA1NjIsIHk6IDIxNyB9LFxufTtcblxuLy8gRklYTUU6IGFkZCBsYW4gY2hhbmdlIHBhZ2VzXG5leHBvcnQgY29uc3Qgc2V0dGluZ3NTb3VuZFRhYiA9IG5ldyBQYWdlKFxuICAnc2V0dGluZ3Mvc291bmQnLFxuICBbXG4gICAgLy8gbmF2IGJhciByaWdodFxuICAgIHsgeDogNjIxLCB5OiA4LCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEwLCByOiA3NCwgZzogOTcsIGI6IDEzMSB9LFxuICAgIHsgeDogNTAzLCB5OiAxNSwgcjogNzQsIGc6IDg1LCBiOiA5MCB9LFxuICAgIHsgeDogMzkyLCB5OiAxMiwgcjogMTc2LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogMzE1LCB5OiA4LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiAzMDIsIHk6IDE3LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG5cbiAgICAvLyBoaWdobGlnaHRlZCBzb3VuZCB0YWJcbiAgICB7IHg6IDE5LCB5OiA2MCwgcjogMCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDIwLCB5OiA3MSwgcjogMCwgZzogODksIGI6IDIyMiB9LFxuICAgIHsgeDogOTUsIHk6IDY5LCByOiAwLCBnOiA5MiwgYjogMjMwIH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAxMTcsIHk6IDU2LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAyMDUsIHk6IDU0LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzMDAsIHk6IDUyLCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG4gICAgeyB4OiAzOTQsIHk6IDU1LCByOiA1OCwgZzogNjUsIGI6IDc0IH0sXG5cbiAgICAvLyBiZyB0YWJsZVxuICAgIHsgeDogMjAsIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAyMCwgeTogMjkyLCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA0NTksIHk6IDg1LCByOiAyMzAsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiA0NjAsIHk6IDI4OSwgcjogMjA2LCBnOiAyMTAsIGI6IDIxNCB9LFxuXG4gICAgLy8gcmlnaHQgc2lkZWJhciBiZ1xuICAgIHsgeDogNDgwLCB5OiAxMjAsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDQ4MywgeTogMTc5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0ODUsIHk6IDIzMiwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNDg2LCB5OiAyODYsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMiwgeTogMTE5LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTAsIHk6IDE4MCwgcjogNDEsIGc6IDQ1LCBiOiA1OCB9LFxuICAgIHsgeDogNjA4LCB5OiAyMzQsIHI6IDQxLCBnOiA0NSwgYjogNTggfSxcbiAgICB7IHg6IDYxMCwgeTogMjg3LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LFxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiQnRucyA9IHtcbiAgbGFuZzogeyB4OiA0MDEsIHk6IDE5MCB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0ID0gbmV3IFBhZ2UoXG4gICdzZXR0aW5ncy9zb3VuZC9sYW5TZWxlY3QnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDI5MywgeTogMTgsIHI6IDI1LCBnOiAyMCwgYjogMjUgfSxcbiAgICB7IHg6IDQzLCB5OiAzNDMsIHI6IDgsIGc6IDQsIGI6IDAgfSxcbiAgICB7IHg6IDYyMiwgeTogMzQ1LCByOiA4LCBnOiA4LCBiOiA4IH0sXG5cbiAgICAvLyBsYW5nIGVuZ2xpc2ggYnRuXG4gICAgeyB4OiAxNjAsIHk6IDEyNywgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE5MCwgeTogMTMyLCByOiA1OCwgZzogOTIsIGI6IDEyOSB9LFxuICAgIHsgeDogMjEzLCB5OiAxMzMsIHI6IDgwLCBnOiAxMTMsIGI6IDE1MSB9LFxuICAgIHsgeDogMjI5LCB5OiAxMzMsIHI6IDE2NiwgZzogMTg5LCBiOiAyMTggfSxcbiAgICB7IHg6IDI0MSwgeTogMTMzLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjY2LCB5OiAxNDIsIHI6IDQ5LCBnOiA4MSwgYjogMTE1IH0sXG4gICAgeyB4OiAyODIsIHk6IDEyOSwgcjogNDksIGc6IDg5LCBiOiAxMjMgfSxcbiAgICB7IHg6IDE2NiwgeTogMTQ1LCByOiA0MSwgZzogNzcsIGI6IDExNSB9LFxuXG4gICAgLy8gYmFja1xuICAgIHsgeDogMjYsIHk6IDMxNiwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogNDMsIHk6IDMyMSwgcjogMjA2LCBnOiAyMTAsIGI6IDIwNiB9LFxuICAgIHsgeDogMzQsIHk6IDMyOSwgcjogMjAxLCBnOiAyMDYsIGI6IDIwMSB9LFxuICBdLFxuICB7IHg6IDIwMCwgeTogMTMxIH0sIC8vIGVuZ2xpc2ggYnRuXG4gIHsgeDogMjAwLCB5OiAxMzEgfSAvLyBlbmdsaXNoIGJ0blxuKTtcbmV4cG9ydCBjb25zdCBzZXR0aW5nc1NvdW5kVGFiTGFuU2VsZWN0UHJvY2VlZEJ0bnMgPSB7XG4gIHllczogeyB4OiA0MDcsIHk6IDMwNyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWIgPSBuZXcgUGFnZShcbiAgJ3NldHRpbmdzL2dyYXBoJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDYyMSwgeTogOCwgcjogMjE0LCBnOiAyMTAsIGI6IDIxNCB9LFxuICAgIHsgeDogNTk1LCB5OiAxMCwgcjogNzQsIGc6IDk3LCBiOiAxMzEgfSxcbiAgICB7IHg6IDUwMywgeTogMTUsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDM5MiwgeTogMTIsIHI6IDE3NiwgZzogMTczLCBiOiAxNzYgfSxcbiAgICB7IHg6IDMxNSwgeTogOCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMzAyLCB5OiAxNywgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuXG4gICAgLy8gaGlnaGxpZ2h0ZWQgZ3JhcGggdGFiXG4gICAgeyB4OiAxMjMsIHk6IDU5LCByOiAwLCBnOiAxMDEsIGI6IDI1NCB9LFxuICAgIHsgeDogMTQ5LCB5OiA1OSwgcjogMjgsIGc6IDExOSwgYjogMjU0IH0sXG4gICAgeyB4OiAxNzcsIHk6IDY0LCByOiAwLCBnOiA5NywgYjogMjM4IH0sXG5cbiAgICAvLyBvdGhlciB0YWJzXG4gICAgeyB4OiAzNywgeTogNjMsIHI6IDU4LCBnOiA2NSwgYjogNzQgfSxcbiAgICB7IHg6IDYyLCB5OiA2MiwgcjogMTM0LCBnOiAxNDMsIGI6IDE1OCB9LFxuICAgIHsgeDogMjMyLCB5OiA1NywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogMjY3LCB5OiA2MywgcjogMTU2LCBnOiAxNjcsIGI6IDE4MCB9LFxuICAgIHsgeDogMzIyLCB5OiA2MywgcjogMTYwLCBnOiAxNjUsIGI6IDE4MCB9LFxuICAgIHsgeDogMzUzLCB5OiA2MywgcjogNTgsIGc6IDY1LCBiOiA3NCB9LFxuICAgIHsgeDogNDAxLCB5OiA2NCwgcjogMTcxLCBnOiAxNzksIGI6IDE5MiB9LFxuICAgIHsgeDogNDQwLCB5OiA2MSwgcjogMTU1LCBnOiAxNTksIGI6IDE3NyB9LFxuXG4gICAgLy8gYmcgdGFibGVcbiAgICB7IHg6IDE5LCB5OiA5MCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogMjMsIHk6IDI5MSwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU5LCB5OiA4NCwgcjogMjMwLCBnOiAyMzEsIGI6IDIzOCB9LFxuICAgIHsgeDogNDU4LCB5OiAyODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sXG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzR3JhcGhUYWJCdG5zID0ge1xuICBxdWFsaXR5Tm9ybWFsOiB7IHg6IDIxMiwgeTogMTIwIH0sXG4gIG1heEZQUzMwOiB7IHg6IDgzLCB5OiAxNzUgfSxcbiAgcG93ZXJTYXZlT246IHsgeDogMjIyLCB5OiAyMjIgfSxcbiAgYmlnSGVhZE1vZGVPZmY6IHsgeDogODYsIHk6IDI4MyB9LFxuICAvLyBhZGQgbW9yZSBpZiBuZWVkIG1vcmUgc2V0dGluZ1xufTtcblxuLy8gdGVsbCB1c2VyIHRoZSBzZWFzb24gc3RhcnRcbmV4cG9ydCBjb25zdCBuZXdTZWFzb24gPSBuZXcgUGFnZShcbiAgJ25ld1NlYXNvbicsXG4gIFtcbiAgICAvLyBiZyBib3R0b21cbiAgICB7IHg6IDUzLCB5OiAzMzQsIHI6IDE2LCBnOiAxNiwgYjogOCB9LFxuICAgIHsgeDogNjEzLCB5OiAzMzQsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIG5leHQgb3Igb2sgYnRuIGJnXG4gICAgeyB4OiAyNTQsIHk6IDI5MiwgcjogMCwgZzogMTE3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI1NSwgeTogMzExLCByOiA4LCBnOiAxMDIsIGI6IDI0NyB9LFxuICAgIHsgeDogMzc2LCB5OiAyOTIsIHI6IDAsIGc6IDExNywgYjogMjQ3IH0sXG4gICAgeyB4OiAzNzYsIHk6IDMxMywgcjogMTYsIGc6IDEwMSwgYjogMjU0IH0sXG5cbiAgICAvLyBsb2dvIGluIGNlbnRlciByaWdodFxuICAgIHsgeDogMzU0LCB5OiAxNDcsIHI6IDAsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzc0LCB5OiAxNTgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4NiwgeTogMTQ5LCByOiAxOTIsIGc6IDIwLCBiOiA2NSB9LFxuICBdLFxuICB7IHg6IDMyNCwgeTogMzA1IH0sXG4gIHsgeDogMzI0LCB5OiAzMDUgfVxuKTtcblxuLy8gY2hlY2sgdGhlcmUgbWlnaHQgYmUgbWFueSBkaWZmIHRpdGxlcyBmb3IgZW5kIHNlYXNvblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvbiA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uJyxcbiAgW1xuICAgIC8vIHhcbiAgICB7IHg6IDUxOCwgeTogNDcsIHI6IDcxLCBnOiA3MywgYjogNzIgfSxcblxuICAgIC8vIGxvZ28gb24gY2VudGVyIHJpZ2h0XG4gICAgeyB4OiAzNTcsIHk6IDE0NCwgcjogMCwgZzogMjgsIGI6IDY2IH0sXG4gICAgeyB4OiAzNjksIHk6IDE1MCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzg1LCB5OiAxNDAsIHI6IDE4OSwgZzogMTQsIGI6IDU4IH0sXG5cbiAgICAvLyBuZXh0XG4gICAgeyB4OiAyODAsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMxMiwgeTogMjk5LCByOiAxNiwgZzogMTE1LCBiOiAyNDIgfSxcbiAgICB7IHg6IDMzOSwgeTogMzAxLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzY4LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfSxcbiAgeyB4OiAzMjAsIHk6IDMwMCB9XG4pO1xuXG4vLyBhZnRlciBlbmRTZWFzb24sIHh4IHNlYXNvbiBpcyBvdmVyXG5leHBvcnQgY29uc3QgZW5kU2Vhc29uUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZCcsXG4gIFtcbiAgICAvLyBob3cgd291bGQgeW91IGxpa2UgdG8gcHJvY2VlZCB3aXRoIG5leHQgc2Vhc29uID9cbiAgICB7IHg6IDQ1MiwgeTogMzgsIHI6IDE5NSwgZzogMjEzLCBiOiAyMjkgfSxcbiAgICB7IHg6IDUwOCwgeTogMzYsIHI6IDgsIGc6IDg1LCBiOiAxNDggfSxcbiAgICB7IHg6IDU0NSwgeTogMzQsIHI6IDI1MywgZzogMjUzLCBiOiAyNTQgfSxcbiAgICB7IHg6IDU2NiwgeTogMzQsIHI6IDQzLCBnOiAxMDcsIGI6IDE2NyB9LFxuICAgIHsgeDogMjc3LCB5OiAzNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTY4LCB5OiAzMSwgcjogMjE5LCBnOiAyMzIsIGI6IDIzNyB9LFxuICAgIHsgeDogNTY4LCB5OiAzOCwgcjogNDUsIGc6IDEwNywgYjogMTY1IH0sXG4gICAgeyB4OiA1NTMsIHk6IDM4LCByOiAzMCwgZzogOTgsIGI6IDE2MCB9LFxuXG4gICAgLy8gYmcgY29ybmVyXG4gICAgeyB4OiA4LCB5OiAxMywgcjogMCwgZzogOTcsIGI6IDE4MSB9LFxuICAgIHsgeDogOCwgeTogMzQzLCByOiAxNiwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyNSwgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYyOCwgeTogMzUwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTM5LCB5OiAzMjUsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiA1NTgsIHk6IDMyNSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTcxLCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNiwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDU3MCwgeTogMzI1IH0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGVuZFNlYXNvblByb2NlZWRTZWxlY3RlZCA9IG5ldyBQYWdlKFxuICAnZW5kU2Vhc29uUHJvY2VlZFNlbGVjdGVkJyxcbiAgW1xuICAgIC8vIGJnIGNvcm5lclxuICAgIHsgeDogOCwgeTogMTMsIHI6IDAsIGc6IDk3LCBiOiAxODEgfSxcbiAgICB7IHg6IDgsIHk6IDM0MywgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA2MjUsIHk6IDIyLCByOiAwLCBnOiA4OSwgYjogMTY0IH0sXG4gICAgeyB4OiA2MjgsIHk6IDM1MCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDUzOSwgeTogMzI1LCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogNTU4LCB5OiAzMjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU3MSwgeTogMzI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDYsIHk6IDMyNSwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNiwgeTogMTksIHI6IDAsIGc6IDkzLCBiOiAxNzMgfSxcbiAgICB7IHg6IDE5LCB5OiAzMzcsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDYyMywgeTogMjIsIHI6IDAsIGc6IDg5LCBiOiAxNjQgfSxcbiAgICB7IHg6IDYxOSwgeTogMjMyLCByOiAxNiwgZzogMjQsIGI6IDE2IH0sXG5cbiAgICAvLyBOT1JNQUwgTEVBR1VFXG4gICAgeyB4OiAxMjUsIHk6IDE2NCwgcjogMjE0LCBnOiAyMjAsIGI6IDIyMSB9LFxuICAgIHsgeDogMTQzLCB5OiAxNjUsIHI6IDQxLCBnOiAxMDUsIGI6IDI4IH0sXG5cbiAgICAvLyBtb2RlIGJnXG4gICAgeyB4OiA0NiwgeTogODcsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDQ3LCB5OiAyODgsIHI6IDIzMCwgZzogMjMxLCBiOiAyMzggfSxcbiAgICB7IHg6IDMzNywgeTogNzksIHI6IDU4LCBnOiA1NywgYjogNjYgfSxcbiAgICB7IHg6IDM0MiwgeTogMjg0LCByOiA1OCwgZzogNTcsIGI6IDY2IH0sXG5cbiAgICAvLyByZXdhcmQgaW5mbyBpbiBib3RoXG4gICAgeyB4OiAxMzgsIHk6IDI3MCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDEwNiwgeTogMjcyLCByOiA2NSwgZzogMTQ3LCBiOiAyNDkgfSxcbiAgICB7IHg6IDM5NSwgeTogMjczLCByOiAxOTUsIGc6IDIyMSwgYjogMjUzIH0sXG4gICAgeyB4OiA0MjEsIHk6IDI3NiwgcjogOCwgZzogMTAyLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlQnRucyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgeDogMTcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbiAgbWFzdGVyOiB7XG4gICAgeDogNDcwLFxuICAgIHk6IDE2MCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROb3JtYWxNYXN0ZXJMZWFndWVNb2RlUHJvY2VlZCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0Tm9ybWFsTWFzdGVyTGVhZ3VlTW9kZVByb2NlZWQnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE2LCB5OiAxOSwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMTksIHk6IDMzNywgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNjIzLCB5OiAyMiwgcjogMCwgZzogODksIGI6IDE2NCB9LFxuICAgIHsgeDogNjE5LCB5OiAyMzIsIHI6IDE2LCBnOiAyNCwgYjogMTYgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzUsIHk6IDMyNiwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDU3MCwgeTogMzMwLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA2MDUsIHk6IDMyOCwgcjogOCwgZzogMTEzLCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiA1NjUsIHk6IDMyOCB9LFxuICB7IHg6IDU2NSwgeTogMzI4IH1cbik7XG5cbi8vIGEgZGlhbG9nIHRvIGNvbmZpcm0gbGVhZ3VlIHJlc2V0XG5leHBvcnQgY29uc3QgbGVhZ3VlUmVzZXREaWFsb2dZTiA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmVzZXREaWFsb2dZTicsXG4gIFtcbiAgICB7IHg6IDExNSwgeTogNTQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDEwOCwgeTogMzA1LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MDgsIHk6IDMwOCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiA1MCwgcjogMTgxLCBnOiAxODIsIGI6IDE4MSB9LFxuICAgIHsgeDogNTMxLCB5OiA0OCwgcjogMTY3LCBnOiAxNzIsIGI6IDE3NCB9LFxuICAgIHsgeDogMjYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogMzE5LCB5OiA2MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzQ3LCB5OiA2MiwgcjogMTI3LCBnOiAxMzMsIGI6IDEzNyB9LFxuICAgIHsgeDogMzc0LCB5OiA2MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjIwLCB5OiAzMDIsIHI6IDQxLCBnOiA3MywgYjogMTIzIH0sXG4gICAgeyB4OiAzOTksIHk6IDMwNiwgcjogMTU1LCBnOiAxOTUsIGI6IDI1MSB9LFxuICAgIHsgeDogNDQzLCB5OiAzMDUsIHI6IDgsIGc6IDEwNSwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMTkzLCB5OiAzMDAgfSwgLy8gbm8sIGNhbmNlbFxuICB7IHg6IDM3MSwgeTogMzAwIH0gLy8geWVzLCByZXNldFxuKTtcblxuLy8gYSBkaWFsb2cgdG8gc2VsZWN0IHllYXIsIG5vcm1hbCBvciBtYXN0ZXIgbGVhZ3VlXG4vLyBUT0RPOiBsZXQgdXNlciBjYW4gc2VsZWN0IHNwZWNpZmljIG1vZGUgYW5kIHllYXIgdG8gcGxheVxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJlc2V0RGlhbG9nID0gbmV3IFBhZ2UoXG4gICdsZWFndWVSZXNldERpYWxvZycsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjcwLCB5OiA0MCwgcjogNDAsIGc6IDQ0LCBiOiA0OSB9LFxuICAgIHsgeDogMjkzLCB5OiA0NCwgcjogMTQ2LCBnOiAxNDgsIGI6IDE1NSB9LFxuICAgIHsgeDogMzI2LCB5OiA0NSwgcjogMTkzLCBnOiAxOTcsIGI6IDIwNiB9LFxuICAgIHsgeDogMzUxLCB5OiA0MiwgcjogMjEsIGc6IDI2LCBiOiAzMCB9LFxuICAgIHsgeDogMzY0LCB5OiA0MiwgcjogMTg4LCBnOiAxOTIsIGI6IDE5OCB9LFxuXG4gICAgLy8gYmdcbiAgICB7IHg6IDEyMSwgeTogMjUsIHI6IDE5MSwgZzogMTk5LCBiOiAyMDYgfSxcbiAgICB7IHg6IDExNiwgeTogMjg4LCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG4gICAgeyB4OiA1MTgsIHk6IDM1LCByOiA3MiwgZzogNzUsIGI6IDgwIH0sXG4gICAgeyB4OiA1MTcsIHk6IDI5MiwgcjogMjM5LCBnOiAyNDIsIGI6IDIzOSB9LFxuXG4gICAgLy8gY2FuY2VsIGJ0biBiZ1xuICAgIHsgeDogMTg1LCB5OiAyODIsIHI6IDQxLCBnOiA3NSwgYjogMTE4IH0sXG5cbiAgICAvLyByZXNldCB0byB5ZWFyIFhYIGJ0biBiZ1xuICAgIHsgeDogMzI3LCB5OiAyOTcsIHI6IDMsIGc6IDc5LCBiOiAyMzUgfSxcbiAgXSxcbiAgeyB4OiAzNzEsIHk6IDMwMCB9LCAvLyByZXNldCB0byB5ZWFyIFhYXG4gIHsgeDogMTkzLCB5OiAzMDAgfSAvLyBjYW5jZWxcbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVSZXNldERpYWxvZ0J0bnMgPSB7XG4gIG5vcm1hbDogeyB4OiAyMTgsIHk6IDEwNSB9LFxuICBtYXN0ZXI6IHsgeDogNDAyLCB5OiAxMDUgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RTZWFzb25Nb2RlID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RTZWFzb25Nb2RlJyxcbiAgW1xuICAgIHsgeDogMTA0LCB5OiAxNiwgcjogMCwgZzogOTMsIGI6IDE3MyB9LFxuICAgIHsgeDogMjM1LCB5OiAzNywgcjogMTQzLCBnOiAxODEsIGI6IDIwNyB9LFxuICAgIHsgeDogMzA5LCB5OiAzNiwgcjogMTQ1LCBnOiAxODIsIGI6IDIwOSB9LFxuICAgIHsgeDogMzM3LCB5OiAzOCwgcjogMTAzLCBnOiAxNDksIGI6IDE5MSB9LFxuICAgIHsgeDogMzc2LCB5OiAzMiwgcjogMjQ1LCBnOiAyNDcsIGI6IDI1MyB9LFxuICAgIHsgeDogNDIyLCB5OiAzNiwgcjogMTQ1LCBnOiAxNzcsIGI6IDIwOSB9LFxuICAgIHsgeDogNDAsIHk6IDc1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTQsIHk6IDE4MywgcjogMzMsIGc6IDM2LCBiOiAzMyB9LFxuICAgIHsgeDogMzQxLCB5OiA5MywgcjogNDEsIGc6IDQ4LCBiOiA0OSB9LFxuICAgIHsgeDogNTM5LCB5OiAzMjMsIHI6IDAsIGc6IDY5LCBiOiAxNDkgfSxcbiAgICB7IHg6IDU1MywgeTogMzI4LCByOiAwLCBnOiA2NSwgYjogMTQ4IH0sXG4gIF0sXG4gIHsgeDogMTc4LCB5OiAxODMgfSxcbiAgeyB4OiAxNzgsIHk6IDE4MyB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCA9IG5ldyBQYWdlKFxuICAnc2VsZWN0TGVhZ3VlR2FtZUFtb3VudCcsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMTc5LCB5OiA2MCwgcjogOCwgZzogNjUsIGI6IDExNSB9LFxuICAgIHsgeDogMTk1LCB5OiA1OSwgcjogNTIsIGc6IDk5LCBiOiAxNDEgfSxcbiAgICB7IHg6IDI0NSwgeTogNTYsIHI6IDE3NywgZzogMTk4LCBiOiAyMTIgfSxcbiAgICB7IHg6IDM2MSwgeTogNTcsIHI6IDUsIGc6IDY2LCBiOiAxMTUgfSxcbiAgICB7IHg6IDQzOSwgeTogNTYsIHI6IDE5NCwgZzogMjA4LCBiOiAyMjEgfSxcbiAgICB7IHg6IDQ4MywgeTogNTYsIHI6IDAsIGc6IDY1LCBiOiAxMTUgfSxcblxuICAgIC8vIGFtb3VudCB0aXRsZSBiZ1xuICAgIHsgeDogMzAsIHk6IDEwNCwgcjogMjMwLCBnOiAyMjcsIGI6IDIzMCB9LFxuICAgIHsgeDogNzAsIHk6IDEwMCwgcjogMjI4LCBnOiAyMjgsIGI6IDIyOCB9LFxuICAgIHsgeDogMTE2LCB5OiAxMDAsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcbiAgICB7IHg6IDIwOSwgeTogMTAyLCByOiA0MSwgZzogNDksIGI6IDU4IH0sXG4gICAgeyB4OiAyNDQsIHk6IDEwMiwgcjogMTE0LCBnOiAxMjEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjc2LCB5OiAxMDIsIHI6IDQ0LCBnOiA1NCwgYjogNjYgfSxcbiAgICB7IHg6IDM2MSwgeTogOTgsIHI6IDU0LCBnOiA2MCwgYjogNzAgfSxcbiAgICB7IHg6IDQwOSwgeTogMTAyLCByOiA3NCwgZzogNzksIGI6IDg3IH0sXG4gICAgeyB4OiA0NTYsIHk6IDk5LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA0OTYsIHk6IDk3LCByOiAyMzAsIGc6IDIzMSwgYjogMjMwIH0sXG4gICAgeyB4OiA1MzcsIHk6IDEwMSwgcjogOTIsIGc6IDk4LCBiOiAxMDYgfSxcbiAgICB7IHg6IDU4MiwgeTogOTksIHI6IDIwMCwgZzogMjA0LCBiOiAyMDcgfSxcbiAgICB7IHg6IDU5OCwgeTogOTksIHI6IDIzMCwgZzogMjMxLCBiOiAyMzAgfSxcbiAgXSxcbiAgeyB4OiAzOSwgeTogMzE0IH0sXG4gIHsgeDogMzksIHk6IDMxNCB9XG4pO1xuZXhwb3J0IGNvbnN0IHNlbGVjdExlYWd1ZUdhbWVBbW91bnRCdG5zID0ge1xuICBmdWxsOiB7IHg6IDI1LCB5OiAyODUgfSxcbiAgaGFsZjogeyB4OiAyNDUsIHk6IDI4NSB9LFxuICBxdWFydGVyOiB7IHg6IDQwMCwgeTogMTEyIH0sXG4gIHBvc3Q6IHsgeDogNjAwLCB5OiAxMTIgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RZZWFyID0gbmV3IFBhZ2UoXG4gICdzZWxlY3RZZWFyJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMDMsIHk6IDI0LCByOiAyMDEsIGc6IDIwMSwgYjogMjA1IH0sXG4gICAgeyB4OiAxMDQsIHk6IDI4OSwgcjogMjQwLCBnOiAyNDAsIGI6IDI0MCB9LFxuICAgIHsgeDogNTE5LCB5OiAzNCwgcjogNzQsIGc6IDcxLCBiOiA3NCB9LFxuICAgIHsgeDogNTI4LCB5OiAyOTUsIHI6IDI0NCwgZzogMjQyLCBiOiAyNDQgfSxcblxuICAgIC8vIHRpdGxlIHNlbGVjdCB5ZWFyXG4gICAgeyB4OiAyNzcsIHk6IDM4LCByOiAxODIsIGc6IDE4NywgYjogMTkxIH0sXG4gICAgeyB4OiAzMTEsIHk6IDM0LCByOiAyMCwgZzogMjQsIGI6IDI5IH0sXG4gICAgeyB4OiAzNDIsIHk6IDQwLCByOiAyMSwgZzogMjUsIGI6IDMwIH0sXG4gICAgeyB4OiAzNTksIHk6IDQwLCByOiAxNiwgZzogMjYsIGI6IDMzIH0sXG5cbiAgICAvLyB5ZWFyIGJnXG4gICAgeyB4OiAyMzAsIHk6IDEzNiwgcjogNzEsIGc6IDc4LCBiOiA5NCB9LFxuICAgIHsgeDogNDAzLCB5OiAxNTEsIHI6IDcyLCBnOiA3OSwgYjogOTQgfSxcblxuICAgIC8vIHJlc2V0IHllYXIgYnRuIGJnXG4gICAgeyB4OiAzMjgsIHk6IDI5NiwgcjogMSwgZzogODEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDM5MiwgeTogMzAyIH0sXG4gIHsgeDogNTIwLCB5OiA0OSB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0WWVhckJ0bnMgPSB7XG4gIHByZXZZZWFyOiB7IHg6IDE3OCwgeTogMTU2IH0sXG4gIG5leHRZZWFyOiB7IHg6IDQ1NSwgeTogMTU2IH0sXG4gIHN1Ym1pdDogeyB4OiAyODUsIHk6IDMwMyB9LFxufTtcblxuLy8gKiBCYXR0bGVNb2Rlc1xuZXhwb3J0IGNvbnN0IGJhdHRsZU1vZGVQYW5lbCA9IG5ldyBQYWdlKFxuICAnYmF0dGxlTW9kZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHRcbiAgICB7IHg6IDMwMSwgeTogNSwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogMzEzLCB5OiAxMCwgcjogMjI5LCBnOiAyMjUsIGI6IDIyOSB9LFxuICAgIHsgeDogMzI0LCB5OiA3LCByOiA1OCwgZzogOTcsIGI6IDEzMiB9LFxuICAgIHsgeDogMzg4LCB5OiAxMCwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzk2LCB5OiA2LCByOiAyNDIsIGc6IDI0MCwgYjogMjQyIH0sXG4gICAgeyB4OiA0OTIsIHk6IDEwLCByOiAyNDYsIGc6IDIwOCwgYjogNDUgfSxcbiAgICB7IHg6IDQ4NiwgeTogNCwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuICAgIHsgeDogNTk4LCB5OiAxMywgcjogMTA0LCBnOiAxMjYsIGI6IDE1MyB9LFxuICAgIHsgeDogNjE2LCB5OiAxMiwgcjogMjA2LCBnOiAyMTQsIGI6IDIyMiB9LFxuXG4gICAgLy8gYmcgaW4gYm90dG9tICh0b3Agd2lsbCBzaGluZSlcbiAgICB7IHg6IDksIHk6IDM0NiwgcjogMTYsIGc6IDI4LCBiOiAzMyB9LFxuICAgIHsgeDogNjIzLCB5OiAzNDQsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDM5NywgeTogMzQyLCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVsbWV0IHRvIGRpZmYgZ1NlbGVjdExlYWd1ZUdhbWVBbW91bnRcbiAgICB7IHg6IDgsIHk6IDEyMSwgcjogMTE1LCBnOiA0NCwgYjogNDEgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI1LCB5OiAzMTMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDQyLCB5OiAzMjAsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDMxLCB5OiAzMzMsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA0MSwgeTogMzIwIH0sIC8vIGJhY2tcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5leHBvcnQgY29uc3QgYmF0dGxlTW9kZVBhbmVsQnRucyA9IHtcbiAgcmFua2VkQmF0dGxlOiB7IHg6IDI4NywgeTogMTYwIH0sXG4gIGZyaWVuZEJhdHRsZTogeyB4OiAyODcsIHk6IDI0NSB9LFxuICBwb3dlclJhbmtpbmc6IHsgeDogNTI2LCB5OiAxNjAgfSwgLy8gdW5zdXJlIHdoYXQgaXNcbiAgcHZwOiB7IHg6IDUyNSwgeTogMjQ1IH0sXG59O1xuXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlUGFuZWwgPSBuZXcgUGFnZShcbiAgJ3JhbmtlZEJhdHRsZVBhbmVsJyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCBpY29uXG4gICAgLy8gc29tZXRpbWVzIG5hdiBiYXIgd2lsbCBkaXNhcHBlYXJcbiAgICAvLyB7IHg6IDMxMiwgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIC8vIHsgeDogMzkwLCB5OiAxMiwgcjogMTI3LCBnOiAxMjgsIGI6IDEyNyB9LFxuICAgIC8vIHsgeDogNDkzLCB5OiAxMywgcjogMjA4LCBnOiAxODksIGI6IDUxIH0sXG4gICAgLy8geyB4OiA1OTcsIHk6IDEzLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuXG4gICAgLy8gYmcgaW4gbGVmdFxuICAgIC8vIHsgeDogMjIsIHk6IDY2LCByOiAxODksIGc6IDE5MCwgYjogMTg5IH0sXG4gICAgLy8geyB4OiAxNiwgeTogMTk0LCByOiAyMzAsIGc6IDIyNywgYjogMjMwIH0sXG4gICAgLy8geyB4OiAxOCwgeTogMjYwLCByOiAyNDcsIGc6IDI0MywgYjogMjQ3IH0sXG5cbiAgICAvLyB0ZWFtIHN1cHBvcnQgYmdcbiAgICB7IHg6IDQ4NywgeTogODYsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcbiAgICB7IHg6IDYxNCwgeTogOTUsIHI6IDI0NywgZzogMjQzLCBiOiAyNDcgfSxcblxuICAgIC8vIGJnIG9mIHdpbi9sb3NlIHJhdGlvIGluIGJvdHRvbSBsZWZ0XG4gICAgeyB4OiAxNDQsIHk6IDI4NiwgcjogNjYsIGc6IDYxLCBiOiA2NiB9LFxuICAgIHsgeDogMzU0LCB5OiAyODYsIHI6IDY2LCBnOiA2OSwgYjogNjYgfSxcblxuICAgIC8vIGJnIG9mIGVxdWlwbWVudCBpbiByaWdodFxuICAgIHsgeDogNDg4LCB5OiAyNDksIHI6IDMzLCBnOiA4NSwgYjogMTU2IH0sXG4gICAgeyB4OiA1NjIsIHk6IDI1MCwgcjogMzMsIGc6IDg1LCBiOiAxNTYgfSxcblxuICAgIC8vIC8vIGVuZXJneSAoYmFsbCkgaW4gYm90dG9tXG4gICAgLy8geyB4OiA0MjQsIHk6IDMyNSwgcjogNTEsIGc6IDU4LCBiOiA1MSB9LFxuICAgIC8vIHsgeDogNDI4LCB5OiAzMjYsIHI6IDI1MywgZzogMjUxLCBiOiAyNTMgfSxcblxuICAgIC8vIGxpbmUgdXAgLCBwb3dlciByYW5raW5nLCBzdGF0cyBidG4gYmdcbiAgICB7IHg6IDgyLCB5OiAzMjgsIHI6IDI1LCBnOiA2OSwgYjogMTE2IH0sXG4gICAgeyB4OiAxNDYsIHk6IDMzMCwgcjogMjUsIGc6IDY1LCBiOiAxMTUgfSxcbiAgICB7IHg6IDI0OCwgeTogMzMwLCByOiAyNSwgZzogNjUsIGI6IDExNSB9LFxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDQyLCB5OiAzMjMsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1NTcsIHk6IDMzMiB9LCAvLyBwbGF5IGJhbGxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVQYW5lbEJ0bnMgPSB7XG4gIGF3YXlHYW1lOiB7IHg6IDE4NSwgeTogNjUgfSxcbiAgaG9tZUdhbWU6IHsgeDogMjkzLCB5OiA2NSB9LFxuICBkaXNhYmxlZFBsYXlCdG46IHsgeDogNTAyLCB5OiAzMTcsIHI6IDkwLCBnOiA3MywgYjogNDkgfSxcbn07XG5cbi8vIGNsaWNrIHJlZnJlc2ggYnRuIGluIHJhbmtlZEJhdHRsZVBhbmVsXG5leHBvcnQgY29uc3QgcmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlV2FpdFRvUmVmcmVzaCcsXG4gIFtcbiAgICAvLyB0aXRsZSBhbmQgeFxuICAgIHsgeDogMjA3LCB5OiA1MiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjg2LCB5OiA1MywgcjogMTI3LCBnOiAxMzEsIGI6IDEzNSB9LFxuICAgIHsgeDogMzYyLCB5OiA1NywgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzk2LCB5OiA1MSwgcjogMzYsIGc6IDQ0LCBiOiA1MiB9LFxuICAgIHsgeDogNTE4LCB5OiA1MCwgcjogMTQ1LCBnOiAxNDYsIGI6IDE0NSB9LFxuXG4gICAgLy8gY291bnQgZG93biBiZ1xuICAgIHsgeDogMTE0LCB5OiAxNTEsIHI6IDI1LCBnOiA4NSwgYjogODIgfSxcbiAgICB7IHg6IDUyMCwgeTogMTU1LCByOiAyNSwgZzogNTMsIGI6IDQ5IH0sXG5cbiAgICAvLyBvdGhlciBiZ1xuICAgIHsgeDogMTA2LCB5OiA5MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA2LCB5OiAzMTEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyNywgeTogMzAwLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MjgsIHk6IDI1NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIzLCB5OiA5OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICBdLFxuICB7IHg6IDUyMCwgeTogNTAgfSwgLy8geFxuICB7IHg6IDUyMCwgeTogNTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJhbmtlZEJhdHRsZVJlc3VsdCA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlUmVzdWx0JyxcbiAgW1xuICAgIC8vIGJnIGluIG1pZFxuICAgIHsgeDogMTAsIHk6IDk0LCByOiA1OCwgZzogOTMsIGI6IDE0MCB9LFxuICAgIHsgeDogOCwgeTogMjQ4LCByOiAxNDAsIGc6IDE1OCwgYjogMTgxIH0sXG4gICAgeyB4OiA2MjQsIHk6IDk1LCByOiA1OCwgZzogOTQsIGI6IDE0MCB9LFxuICAgIHsgeDogNjIxLCB5OiAyNDYsIHI6IDE0MCwgZzogMTU4LCBiOiAxODEgfSxcbiAgICB7IHg6IDMzNiwgeTogOTgsIHI6IDU4LCBnOiA5NywgYjogMTQwIH0sXG4gICAgeyB4OiAzNDUsIHk6IDI1NSwgcjogMTQ4LCBnOiAxNjIsIGI6IDE4MSB9LFxuXG4gICAgLy8gdGllci8gc2NvcmUgLyByYW5rXG4gICAgeyB4OiA0OSwgeTogMTI3LCByOiAxOTgsIGc6IDIwMywgYjogMjE0IH0sXG4gICAgeyB4OiA1OSwgeTogMTMwLCByOiAxOTYsIGc6IDIwNSwgYjogMjEyIH0sXG4gICAgeyB4OiA3NCwgeTogMTMzLCByOiAyMTYsIGc6IDIyMSwgYjogMjI4IH0sXG4gICAgeyB4OiAxMDEsIHk6IDEzMCwgcjogODUsIGc6IDExNywgYjogMTUzIH0sXG4gICAgeyB4OiAxMjYsIHk6IDEyNiwgcjogMjA3LCBnOiAyMTYsIGI6IDIyNyB9LFxuICAgIHsgeDogMTY4LCB5OiAxMjksIHI6IDIzMywgZzogMjM1LCBiOiAyMzggfSxcbiAgICB7IHg6IDE4OCwgeTogMTMyLCByOiAyMjIsIGc6IDIyOSwgYjogMjMwIH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogMjg0LCB5OiAyOTYsIHI6IDgsIGc6IDExOCwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzAsIHk6IDI5NywgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzA2LCByOiA4LCBnOiAxMDEsIGI6IDI0NyB9LFxuICAgIHsgeDogMzE3LCB5OiAyOTcsIHI6IDIyOSwgZzogMjM3LCBiOiAyNTAgfSxcbiAgXSxcbiAgeyB4OiAzMTYsIHk6IDMxMCB9LCAvLyBva1xuICB7IHg6IDMxNiwgeTogMzEwIH1cbik7XG5cbmV4cG9ydCBjb25zdCByYW5rZWRCYXR0bGVHYW1lSW5mbyA9IG5ldyBQYWdlKFxuICAncmFua2VkQmF0dGxlR2FtZUluZm8nLFxuICBbXG4gICAgLy8gcmlnaHQgcGFydCBvZiBuYXYgYmFyXG4gICAgeyB4OiA2MTYsIHk6IDEwLCByOiAyMTQsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiA1OTUsIHk6IDEzLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNTg5LCB5OiAxNSwgcjogNzUsIGc6IDk0LCBiOiAxMjMgfSxcbiAgICB7IHg6IDU2NywgeTogMTQsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDU3MywgeTogMTUsIHI6IDc0LCBnOiA4NSwgYjogOTAgfSxcbiAgICB7IHg6IDQ3OCwgeTogMjAsIHI6IDIxNCwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ3MSwgeTogMTEsIHI6IDIwNSwgZzogMjE4LCBiOiAyMzAgfSxcbiAgICB7IHg6IDQ3MywgeTogMTAsIHI6IDIwNiwgZzogMjE5LCBiOiAyMzAgfSxcbiAgICB7IHg6IDM5MywgeTogOCwgcjogMTI5LCBnOiAxMjcsIGI6IDEyOSB9LFxuICAgIHsgeDogMzE5LCB5OiAxNCwgcjogMTk3LCBnOiAxOTgsIGI6IDE5NyB9LFxuXG4gICAgLy8gZ2FtZSBpbmZvIHRpdGxlXG4gICAgeyB4OiAyODQsIHk6IDU4LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAyOTgsIHk6IDYyLCByOiAxMTAsIGc6IDExMSwgYjogMTIxIH0sXG4gICAgeyB4OiAzMDcsIHk6IDYzLCByOiAxNjMsIGc6IDE2NiwgYjogMTcxIH0sXG4gICAgeyB4OiAzMjAsIHk6IDYyLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAzMzIsIHk6IDYzLCByOiAyMjEsIGc6IDIyMSwgYjogMjI1IH0sXG4gICAgeyB4OiAzNDgsIHk6IDYwLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAyMDUsIHk6IDYyLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiA0NzMsIHk6IDY2LCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG4gICAgeyB4OiAxNDgsIHk6IDYxLCByOiA0MSwgZzogNDUsIGI6IDU4IH0sXG5cbiAgICAvLyBwbGF5YmFsbC8gcGxheWluZyBidG5cbiAgICB7IHg6IDQ4NywgeTogMzI4LCByOiAyMTIsIGc6IDE4OCwgYjogMzIgfSxcbiAgICB7IHg6IDYxMCwgeTogMzI1LCByOiAyMTQsIGc6IDE3OSwgYjogMCB9LFxuICAgIHsgeDogNTUyLCB5OiAzMzksIHI6IDE4MSwgZzogMTQyLCBiOiAwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAyNiwgeTogMzE2LCByOiAyMTQsIGc6IDIxOCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MCwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMywgeTogMzI5LCByOiAyMTEsIGc6IDIxNSwgYjogMjEwIH0sXG5cbiAgICAvLyBiZyBiZXR3ZWVuIGJhY2sgYW5kIHBsYXlcbiAgICB7IHg6IDEzOCwgeTogMzI1LCByOiA1OCwgZzogNjksIGI6IDQ5IH0sXG4gICAgeyB4OiAyMDAsIHk6IDMyOSwgcjogNDksIGc6IDYxLCBiOiA0MSB9LFxuICAgIHsgeDogMjY1LCB5OiAzMzAsIHI6IDUyLCBnOiA2MiwgYjogNDQgfSxcbiAgICB7IHg6IDM0NSwgeTogMzMzLCByOiA2NiwgZzogNzUsIGI6IDU4IH0sXG4gICAgeyB4OiA0MDIsIHk6IDMzNCwgcjogNDksIGc6IDUzLCBiOiAzMyB9LFxuICBdLFxuICB7IHg6IDUxOCwgeTogMzI5IH0sXG4gIHsgeDogMjYsIHk6IDMxNiB9XG4pO1xuXG4vLyBhIHBhZ2UgdG8gc3RhcnQgYXV0byBnYW1lXG5leHBvcnQgY29uc3QgYXV0b0dhbWVDb25maXJtID0gbmV3IFBhZ2UoXG4gICdhdXRvR2FtZUNvbmZpcm0nLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI3NywgeTogNjAsIHI6IDE4MCwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI5NSwgeTogNTgsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMwOCwgeTogNjEsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMyOCwgeTogNTgsIHI6IDE3NywgZzogMTgzLCBiOiAxODUgfSxcbiAgICB7IHg6IDM1MywgeTogNjEsIHI6IDE3NywgZzogMTgyLCBiOiAxODUgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMDgsIHk6IDQ5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDcsIHk6IDMxNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE2LCB5OiAzMDIsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ5MSwgeTogMTcxLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTAsIHk6IDQ4LCByOiAxNjgsIGc6IDE3MywgYjogMTc2IH0sXG4gICAgeyB4OiA1MTYsIHk6IDU1LCByOiAxMDMsIGc6IDEwNSwgYjogMTA5IH0sXG4gICAgeyB4OiA1MjQsIHk6IDQ4LCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBubyBhbmQgeWVzXG4gICAgeyB4OiAyMjMsIHk6IDI5OCwgcjogNDEsIGc6IDc3LCBiOiAxMjMgfSxcbiAgICB7IHg6IDI0OCwgeTogMjk4LCByOiAxNTgsIGc6IDE4MywgYjogMjE0IH0sXG4gICAgeyB4OiAzODgsIHk6IDI5OSwgcjogMTk2LCBnOiAyMjMsIGI6IDI1NSB9LFxuICAgIHsgeDogNDMwLCB5OiAzMDIsIHI6IDgsIGc6IDExMywgYjogMjQ3IH0sXG5cbiAgICAvLyBjb250ZW50IHRvIGRpZmYgd2l0aCBjb25maXJtIGVuZCAoeW91IHNlbGVjdGVkKVxuICAgIHsgeDogMjg2LCB5OiAxODAsIHI6IDgyLCBnOiA4NiwgYjogOTQgfSxcbiAgICB7IHg6IDMwNCwgeTogMTc4LCByOiAxMjAsIGc6IDEyOCwgYjogMTM2IH0sXG4gICAgeyB4OiAzMjQsIHk6IDE3OCwgcjogOTUsIGc6IDEwMywgYjogMTEyIH0sXG4gIF0sXG4gIHsgeDogMzkwLCB5OiAzMDQgfSwgLy8geWVzLCBzdGFydCBhdXRvIHBsYXlcbiAgeyB4OiAyMzcsIHk6IDMwNCB9IC8vIG5vLCBub3Qgc3RhcnQgYXV0byBwbGF5XG4pO1xuXG4vLyBhIHBhZ2UgdG8gZW5kIGF1dG8gZ2FtZVxuZXhwb3J0IGNvbnN0IGF1dG9HYW1lQ29uZmlybUVuZCA9IG5ldyBQYWdlKFxuICAnYXV0b0dhbWVDb25maXJtRW5kJyxcbiAgW1xuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNzcsIHk6IDYwLCByOiAxODAsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyOTUsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMDgsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiAzMjgsIHk6IDU4LCByOiAxNzcsIGc6IDE4MywgYjogMTg1IH0sXG4gICAgeyB4OiAzNTMsIHk6IDYxLCByOiAxNzcsIGc6IDE4MiwgYjogMTg1IH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMTA4LCB5OiA0OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMTA3LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNiwgeTogMzAyLCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA0OTEsIHk6IDE3MSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTEwLCB5OiA0OCwgcjogMTY4LCBnOiAxNzMsIGI6IDE3NiB9LFxuICAgIHsgeDogNTE2LCB5OiA1NSwgcjogMTAzLCBnOiAxMDUsIGI6IDEwOSB9LFxuICAgIHsgeDogNTI0LCB5OiA0OCwgcjogNzEsIGc6IDcwLCBiOiA3MSB9LFxuXG4gICAgLy8gbm8gYW5kIHllc1xuICAgIHsgeDogMjIzLCB5OiAyOTgsIHI6IDQxLCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiAyNDgsIHk6IDI5OCwgcjogMTU4LCBnOiAxODMsIGI6IDIxNCB9LFxuICAgIHsgeDogMzg4LCB5OiAyOTksIHI6IDE5NiwgZzogMjIzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQzMCwgeTogMzAyLCByOiA4LCBnOiAxMTMsIGI6IDI0NyB9LFxuXG4gICAgLy8gVE9ETzogdXNlIGVuZCBnYW1lIGNvbnRlbnRcbiAgXSxcbiAgeyB4OiAyMzcsIHk6IDMwNCB9LCAvLyBubywgY29udGludWUgYXV0byBwbGF5XG4gIHsgeDogMzkwLCB5OiAzMDQgfSAvLyB5ZXMsIGVuZCBhdXRvIHBsYXlcbik7XG5cbmV4cG9ydCBjb25zdCByZWNoYXJnZUJhbGxSYW5rTW9kZSA9IG5ldyBQYWdlKFxuICAncmVjaGFyZ2VCYWxsUmFua01vZGUnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDE5MiwgeTogNDksIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDI0MSwgeTogNDksIHI6IDE4MiwgZzogMTgyLCBiOiAxOTEgfSxcbiAgICB7IHg6IDMwMiwgeTogNTgsIHI6IDE2MCwgZzogMTYxLCBiOiAxNjggfSxcbiAgICB7IHg6IDM0NSwgeTogNTksIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDM2MiwgeTogNTksIHI6IDMyLCBnOiAzOCwgYjogNDYgfSxcbiAgICB7IHg6IDQxNSwgeTogNjAsIHI6IDY3LCBnOiA3MiwgYjogODAgfSxcbiAgICB7IHg6IDQzOCwgeTogNTgsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMTUsIHk6IDQ2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMDksIHk6IDMwNiwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTIxLCB5OiAzMDUsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNSwgeTogNDQsIHI6IDcxLCBnOiA3MCwgYjogNzEgfSxcbiAgXSxcbiAgeyB4OiA1MTgsIHk6IDQ5IH0sIC8vIGNhbmNlbFxuICB7IHg6IDUxOCwgeTogNDkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlY2hhcmdlQmFsbExlYWd1ZU1vZGUgPSBuZXcgUGFnZShcbiAgJ3JlY2hhcmdlQmFsbExlYWd1ZU1vZGUnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDIyNCwgeTogNTUsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDI2OCwgeTogNjAsIHI6IDI0LCBnOiAzMiwgYjogMzcgfSxcbiAgICB7IHg6IDMxNiwgeTogNjIsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDM2OCwgeTogNjEsIHI6IDIzLCBnOiAzMSwgYjogNDAgfSxcbiAgICB7IHg6IDQwMSwgeTogNTYsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQ0MCwgeTogNjAsIHI6IDE5NywgZzogMTk4LCBiOiAyMDYgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAxMTAsIHk6IDUzLCByOiAxOTcsIGc6IDE5OCwgYjogMjA2IH0sXG4gICAgeyB4OiAxMTQsIHk6IDI5OCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMzE1LCB5OiAzMDcsIHI6IDIzNCwgZzogMjQxLCBiOiAyMzQgfSxcbiAgICB7IHg6IDUyMSwgeTogMzA2LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiA1MTgsIHk6IDUxLCByOiAxOTcsIGc6IDE5OCwgYjogMTk4IH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiA0OSB9LCAvLyBjYW5jZWxcbiAgeyB4OiA1MTgsIHk6IDQ5IH1cbik7XG5cbi8vICogTGVhZ3VlTW9kZXNcbmV4cG9ydCBjb25zdCBsZWFndWVNb2RlUGFuZWwgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVQYW5lbCcsXG4gIFtcbiAgICAvLyBuYXZpIGJhclxuICAgIHsgeDogMzAwLCB5OiAxMiwgcjogMjE0LCBnOiAyMTQsIGI6IDIxNCB9LFxuICAgIHsgeDogMzE2LCB5OiA5LCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzMjAsIHk6IDE1LCByOiAxNDQsIGc6IDE0OCwgYjogMTQ5IH0sXG4gICAgeyB4OiAzODgsIHk6IDEwLCByOiAyMzgsIGc6IDIzNCwgYjogMjM4IH0sXG4gICAgeyB4OiAzODUsIHk6IDksIHI6IDY0LCBnOiA2NywgYjogNzEgfSxcbiAgICB7IHg6IDQ5MywgeTogMTEsIHI6IDI0NCwgZzogMjA0LCBiOiAzOSB9LFxuICAgIHsgeDogNTcxLCB5OiAxNCwgcjogMTQ3LCBnOiAxNjEsIGI6IDE3MSB9LFxuICAgIHsgeDogNjA2LCB5OiAxNCwgcjogNzQsIGc6IDkzLCBiOiAxMjMgfSxcbiAgICB7IHg6IDYzMSwgeTogMTUsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcblxuICAgIC8vIGJ0biBpbiBib3R0b21cbiAgICB7IHg6IDg1LCB5OiAzMjYsIHI6IDIzNCwgZzogMjM4LCBiOiAyMzggfSxcbiAgICB7IHg6IDExMiwgeTogMzI3LCByOiAyMTQsIGc6IDIzMSwgYjogMjM4IH0sXG4gICAgeyB4OiAxNjMsIHk6IDMyNiwgcjogMjIyLCBnOiAyMjUsIGI6IDIyNyB9LFxuICAgIHsgeDogMTk4LCB5OiAzMjcsIHI6IDgwLCBnOiAxMTcsIGI6IDE1OSB9LFxuICAgIHsgeDogMjUxLCB5OiAzMjQsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI3OCwgeTogMzMwLCByOiAxODksIGc6IDIwNiwgYjogMjE5IH0sXG4gIF0sXG4gIHsgeDogNjE2LCB5OiAzMzYgfSxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVNb2RlR2FtZUluZm8gPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVHYW1lSW5mbycsXG4gIFtcbiAgICB7IHg6IDI5MiwgeTogOSwgcjogMjE0LCBnOiAyMTMsIGI6IDIxNCB9LFxuICAgIHsgeDogMzE0LCB5OiA3LCByOiAyNTUsIGc6IDI1MSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNzksIHk6IDMsIHI6IDIxNCwgZzogMjE1LCBiOiAyMTQgfSxcbiAgICB7IHg6IDM4OSwgeTogMTAsIHI6IDIzOSwgZzogMjM2LCBiOiAyMzkgfSxcbiAgICB7IHg6IDQ4MiwgeTogMywgcjogMjE0LCBnOiAyMTgsIGI6IDIyMCB9LFxuICAgIHsgeDogNDkzLCB5OiA5LCByOiAyNTUsIGc6IDI0NiwgYjogMTkyIH0sXG4gICAgeyB4OiA1ODksIHk6IDExLCByOiA3NCwgZzogOTMsIGI6IDEyMyB9LFxuICAgIHsgeDogNTk2LCB5OiAxMSwgcjogODEsIGc6IDEwNCwgYjogMTMxIH0sXG4gICAgeyB4OiA2MjQsIHk6IDEyLCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG4gICAgeyB4OiAyNiwgeTogMzEyLCByOiAyMDksIGc6IDIxNCwgYjogMjA5IH0sXG4gICAgeyB4OiA2MzEsIHk6IDU2LCByOiAyMDYsIGc6IDIwNywgYjogMjE0IH0sXG4gICAgeyB4OiA2MzEsIHk6IDcwLCByOiAxNjgsIGc6IDE3NywgYjogMTkzIH0sXG4gICAgeyB4OiA2MjMsIHk6IDY0LCByOiAzMywgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDI3MCwgeTogMTc5LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiAyNTYsIHk6IDIxNCwgcjogMjA2LCBnOiAyMTEsIGI6IDIyMiB9LFxuICAgIHsgeDogMjQyLCB5OiAyNDIsIHI6IDIwNiwgZzogMjExLCBiOiAyMjIgfSxcbiAgICB7IHg6IDYxMiwgeTogMjgxLCByOiAyNCwgZzogMzYsIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNTQ2LCB5OiAzMjUgfSwgLy8gcGxheUJhbGxcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbi8vIG5vcm1hbCBnYW1lIHBsYXkgc3RhcnRcbmV4cG9ydCBjb25zdCBzZWxlY3RQbGF5Um9sZUJ0bnMgPSB7XG4gIHBsYXlPZmZlbnNlT25seTogeyB4OiAxMjgsIHk6IDI3OSB9LFxuICBwbGF5QWxsOiB7IHg6IDMxNywgeTogMjgyIH0sXG4gIHBsYXlEZWZmZW5zZU9ubHk6IHsgeDogNTA2LCB5OiAyODEgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RQbGF5Um9sZSA9IG5ldyBQYWdlKFxuICAnc2VsZWN0UGxheVJvbGUnLFxuICBbXG4gICAgeyB4OiA5NywgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxNDUsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDk5LCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUzOSwgeTogMjgyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NDMsIHk6IDI4MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTYzLCB5OiAyODIsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcblxuICAgIHsgeDogOTAsIHk6IDExMCwgcjogMTk0LCBnOiA4MiwgYjogMjQgfSxcbiAgICB7IHg6IDU1MiwgeTogMTEyLCByOiA1NywgZzogMTIwLCBiOiAxOTcgfSxcbiAgXSxcbiAgLy8gVE9ETzogbWFrZSB3aGljaCByb2xlIGNhbiBiZSBzZWxlY3RlZCBpZiBuZWVkXG4gIHNlbGVjdFBsYXlSb2xlQnRucy5wbGF5QWxsLFxuICBzZWxlY3RQbGF5Um9sZUJ0bnMucGxheUFsbFxuKTtcblxuLy8gc29tZXRpbWVzIGhhcHBlbmVkIHdoZW4gcmVzdGFydGluZyBhIGNvbnRpbnVlZCBnYW1lXG4vLyBvciBjYW5jZWwgYXV0byBwbGF5IGR1cmluZyBwbGF5aW5nXG5leHBvcnQgY29uc3QgbGVhZ3VlQ29udGludWVQbGF5aW5nID0gbmV3IFBhZ2UoXG4gICdsZWFndWVDb250aW51ZVBsYXlpbmcnLFxuICBbXG4gICAgLy8gZmFzdCBwcm9ncmVzc2lvblxuICAgIHsgeDogNDUyLCB5OiAyNzksIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sXG4gICAgeyB4OiA0NzYsIHk6IDI3OSwgcjogMjUxLCBnOiAyNTIsIGI6IDI1NSB9LFxuICAgIHsgeDogNTAyLCB5OiAyNzUsIHI6IDE5MCwgZzogMjIwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDUzMCwgeTogMjc5LCByOiAyMTgsIGc6IDIzMywgYjogMjU1IH0sXG4gICAgeyB4OiA1NTIsIHk6IDI3MywgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2MywgeTogMjc2LCByOiAyMzQsIGc6IDI0NCwgYjogMjU1IH0sXG4gICAgeyB4OiA1NzksIHk6IDI3OSwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU4NywgeTogMjczLCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIC8vIGNvbnRpbnVlXG4gICAgeyB4OiA0NTgsIHk6IDMyMCwgcjogOCwgZzogMTA5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ4MCwgeTogMzI0LCByOiAxMjIsIGc6IDE2OCwgYjogMjQ3IH0sXG4gICAgeyB4OiA1MjAsIHk6IDMxNywgcjogODQsIGc6IDE1OSwgYjogMjUwIH0sXG4gICAgeyB4OiA1NDQsIHk6IDMyNCwgcjogMjI2LCBnOiAyMzQsIGI6IDI1MiB9LFxuICAgIHsgeDogNTcyLCB5OiAzMTksIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gICAgeyB4OiA1OTEsIHk6IDMyNSwgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDQ1OCwgeTogMzIwIH0sIC8vIGNvbnRpbnVlIGdhbWVcbiAgeyB4OiA0NTgsIHk6IDMyMCB9IC8vIGNvbnRpbnVlIGdhbWVcbik7XG5cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlBdXRvT2ZmID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlBdXRvT2ZmJyxcbiAgW1xuICAgIC8vIGF1dG9cbiAgICB7IHg6IDUxNCwgeTogMjAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDUyNSwgeTogMjEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICAvLyBjYW1lcmFcbiAgICB7IHg6IDU1NiwgeTogMjEsIHI6IDE4MywgZzogMTg1LCBiOiAxODYgfSxcbiAgICB7IHg6IDU2MCwgeTogMjMsIHI6IDE5NywgZzogMTk4LCBiOiAxOTcgfSxcbiAgICB7IHg6IDU2OSwgeTogMjEsIHI6IDIwNiwgZzogMjA3LCBiOiAyMDYgfSxcbiAgXSxcbiAgeyB4OiA1MTEsIHk6IDIwIH0sIC8vIHN3aXRjaCB0byBhdXRvIG1vZGVcbiAgeyB4OiA2MTEsIHk6IDIwIH0gLy8gcGF1c2UgYnV0dG9uXG4pO1xuXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5QXV0b09mZjEgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheUF1dG9PZmYnLFxuICAvLyBoYXMgc3dpbmcgYnV0dG9uXG4gIFtcbiAgICB7IHg6IDUyMSwgeTogMjYzLCByOiAyNCwgZzogMjksIGI6IDE2IH0sXG4gICAgeyB4OiA1MjAsIHk6IDI1NSwgcjogMjEzLCBnOiAyMTMsIGI6IDIxMiB9LFxuICAgIHsgeDogNTMzLCB5OiAyNTUsIHI6IDIyMywgZzogMjIxLCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxNCwgeTogMjQ0LCByOiAxNiwgZzogMjgsIGI6IDE2IH0sXG4gIF0sXG4gIHsgeDogNTExLCB5OiAyMCB9LCAvLyBzd2l0Y2ggdG8gYXV0byBtb2RlXG4gIHsgeDogNjExLCB5OiAyMCB9IC8vIHBhdXNlIGJ1dHRvblxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheUF1dG9PZmZHcm91cCA9IG5ldyBHcm91cFBhZ2UoXG4gICdsZWFndWVPblBsYXlBdXRvT2ZmR3JvdXAnLFxuICBbbGVhZ3VlT25QbGF5QXV0b09mZiwgbGVhZ3VlT25QbGF5QXV0b09mZjFdLFxuICBsZWFndWVPblBsYXlBdXRvT2ZmLm5leHQgLyogbmV4dCAqLyxcbiAgbGVhZ3VlT25QbGF5QXV0b09mZi5iYWNrIC8qIGJhY2sgKi9cbik7XG5cbi8vIGF1dG8gcGxheSBvbiwgcG93ZXIgc2F2ZSBvZmZcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmYgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA0OTIsIHk6IDE2LCByOiAxMDEsIGc6IDEwMywgYjogMTAxIH0sXG4gICAgeyB4OiA0ODgsIHk6IDIyLCByOiAyMTAsIGc6IDIwOCwgYjogMjEwIH0sXG4gICAgeyB4OiA0ODEsIHk6IDI3LCByOiAxMDIsIGc6IDEwMSwgYjogMTAxIH0sXG4gICAgeyB4OiA0ODksIHk6IDI5LCByOiAxOTcsIGc6IDE5NywgYjogMTk3IH0sXG4gIF0sXG4gIHsgeDogNDg1LCB5OiAyMSB9LCAvLyB0dXJuIG9uIHBvd2VyIHNhdmVcbiAgeyB4OiA1NTIsIHk6IDIxIH0gLy8gdHVybiBvZmYgYXV0byBwbGF5XG4pO1xuXG4vLyBzYW1lIGFzIGdMZWFndWVPblBsYXlQb3dlclNhdmVPZmYsIGJ1dCBpcyBzdG9wcGVkXG4vLyBuZWVkIHRvIHR1cm4gb24gYXV0b3BsYXlcbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZTdG9wcGVkID0gbmV3IFBhZ2UoXG4gICdsZWFndWVPblBsYXlQb3dlclNhdmVPZmYnLFxuICBbXG4gICAgLy8gYmF0dGVyeVxuICAgIHsgeDogNDg2LCB5OiAxMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDkyLCB5OiAxNiwgcjogMTAxLCBnOiAxMDMsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg4LCB5OiAyMiwgcjogMjEwLCBnOiAyMDgsIGI6IDIxMCB9LFxuICAgIHsgeDogNDgxLCB5OiAyNywgcjogMTAyLCBnOiAxMDEsIGI6IDEwMSB9LFxuICAgIHsgeDogNDg5LCB5OiAyOSwgcjogMTk3LCBnOiAxOTcsIGI6IDE5NyB9LFxuXG4gICAgLy8gZGlzYWJsZWQgYXV0b3BsYXkgdGV4dFxuICAgIHsgeDogNTI0LCB5OiAyMywgcjogOTEsIGc6IDExMCwgYjogMTU4IH0sXG4gICAgeyB4OiA1MzAsIHk6IDIwLCByOiAxNDAsIGc6IDE0NiwgYjogMTUyIH0sXG4gICAgeyB4OiA1MzMsIHk6IDI0LCByOiA5MywgZzogMTA2LCBiOiAxNDMgfSxcbiAgICB7IHg6IDU1MCwgeTogMjUsIHI6IDg1LCBnOiAxMDUsIGI6IDE1MyB9LFxuICAgIHsgeDogNTUyLCB5OiAyMSwgcjogMTQ3LCBnOiAxNTMsIGI6IDE1NiB9LFxuICAgIHsgeDogNTU3LCB5OiAyMCwgcjogMTQ4LCBnOiAxNTQsIGI6IDE1NiB9LFxuICAgIHsgeDogNTY2LCB5OiAyNCwgcjogOTksIGc6IDEyMSwgYjogMTczIH0sXG4gICAgeyB4OiA1NzUsIHk6IDE4LCByOiAxMDcsIGc6IDEyMSwgYjogMTczIH0sXG4gICAgeyB4OiA1ODQsIHk6IDE5LCByOiA5NywgZzogMTIyLCBiOiAxNjkgfSxcbiAgICB7IHg6IDU4OSwgeTogMjIsIHI6IDExOCwgZzogMTI3LCBiOiAxNDkgfSxcbiAgICB7IHg6IDU5NSwgeTogMTgsIHI6IDE0MSwgZzogMTUwLCBiOiAxNTYgfSxcbiAgICB7IHg6IDYwNiwgeTogMjMsIHI6IDc0LCBnOiA5MywgYjogMTMyIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LCAvLyB0dXJuIG9uIGF1dG8gcGxheVxuICB7IHg6IDAsIHk6IDAgfSAvLyB0dXJuIG9uIGF1dG8gcGxheVxuKTtcblxuLy8gZG9uJ3QgZG8gYW55IHRoaW5nLCBqdXN0IGF2b2lkIHRvIGVudGVyIHVua25vd25cbmV4cG9ydCBjb25zdCBsZWFndWVPblBsYXlQb3dlclNhdmVPZmZNaWQgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBkaWFsb2cgb25cbiAgICB7IHg6IDYwNCwgeTogNDcsIHI6IDE3MCwgZzogMTcxLCBiOiAxNzAgfSxcbiAgICB7IHg6IDYwNywgeTogNDksIHI6IDI0NiwgZzogMjQ2LCBiOiAyNDYgfSxcbiAgICB7IHg6IDYxMSwgeTogNTQsIHI6IDIxMywgZzogMjEwLCBiOiAyMTMgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZDEgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZicsXG4gIFtcbiAgICAvLyBiYXR0ZXJ5XG4gICAgeyB4OiA0ODYsIHk6IDEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5cbiAgICAvLyBkaWFsb2cgb2ZmXG4gICAgeyB4OiA2MDUsIHk6IDUwLCByOiA5NSwgZzogOTksIGI6IDk3IH0sXG4gICAgeyB4OiA2MDIsIHk6IDUxLCByOiAxMDksIGc6IDExNCwgYjogMTE2IH0sXG4gICAgeyB4OiA2MDMsIHk6IDQ5LCByOiAxMzEsIGc6IDEzMywgYjogMTMxIH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3VwcyA9IG5ldyBHcm91cFBhZ2UoJ2xlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZkdyb3VwJywgW1xuICBsZWFndWVPblBsYXlQb3dlclNhdmVPZmYsXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZlN0b3BwZWQsXG4gIGxlYWd1ZU9uUGxheVBvd2VyU2F2ZU9mZk1pZCxcbiAgbGVhZ3VlT25QbGF5UG93ZXJTYXZlT2ZmTWlkMSxcbl0pO1xuXG5leHBvcnQgY29uc3Qgb25QbGF5UG93ZXJTYXZlT24gPSBuZXcgUGFnZShcbiAgJ29uUGxheVBvd2VyU2F2ZU9uJyxcbiAgW1xuICAgIHsgeDogMzA0LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDYsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA3LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwOCwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG5cbiAgICB7IHg6IDMwMSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDIsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzAzLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNCwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDUsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzYsIHk6IDI2LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiAzNiwgeTogMzI2LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA2MTMsIHk6IDMzMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjE4LCB5OiAxMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNjAyLCB5OiAyNywgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogMTc0LCB5OiAxNjIsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDQ3NiwgeTogMTU4LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgLy8gc2NvcmUgYmdcbiAgICB7IHg6IDQ5NywgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA0OTgsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNDk5LCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMCwgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gICAgeyB4OiA1MDEsIHk6IDMwMCwgcjogMTYsIGc6IDIwLCBiOiAxNiB9LFxuICAgIHsgeDogNTAyLCB5OiAzMDAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcbiAgICB7IHg6IDUwMywgeTogMzAwLCByOiAxNiwgZzogMjAsIGI6IDE2IH0sXG4gIF0sXG4gIHsgeDogMCwgeTogMCB9LFxuICB7IHg6IDAsIHk6IDAgfVxuKTtcblxuLy8gRklYTUU6IGNoYW5nZSBjb2xvcnNcbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheSA9IG5ldyBQYWdlKFxuICAnb25RdWlja1BsYXknLFxuICBbXG4gICAgLy8gYmcgcmlnaHQgcGFuZWxcbiAgICB7IHg6IDQ1NiwgeTogMTEsIHI6IDU4LCBnOiA3NywgYjogMTIzIH0sXG4gICAgeyB4OiA2MjMsIHk6IDEwLCByOiA1OCwgZzogNzMsIGI6IDExNSB9LFxuICAgIHsgeDogNDU3LCB5OiAzNDgsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcbiAgICB7IHg6IDYzMiwgeTogMzUwLCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG5cbiAgICAvLyBibHVlIGJ0bjogcGxheSBtYW51YWxseVxuICAgIHsgeDogMjk4LCB5OiAzMjEsIHI6IDMzLCBnOiAxMzEsIGI6IDI1NSB9LFxuICAgIHsgeDogMzExLCB5OiAzMzUsIHI6IDE1OCwgZzogMTkxLCBiOiAyMzUgfSxcbiAgICB7IHg6IDQzMywgeTogMzM0LCByOiA4LCBnOiA1NywgYjogMTIzIH0sXG4gICAgeyB4OiA0MzMsIHk6IDM0OSwgcjogMCwgZzogODEsIGI6IDIzOCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheTEgPSBuZXcgUGFnZShcbiAgJ29uUXVpY2tQbGF5JywgLy8gc2FtZSBiZWhhdmlvdXIsIHdpdGhvdXQgYmx1ZSBidG4gb24gcmlnaHQgYm90dG9tXG4gIFtcbiAgICAvLyBiZyByaWdodCBwYW5lbFxuICAgIHsgeDogNDU0LCB5OiA4LCByOiA1OCwgZzogNzcsIGI6IDEyMyB9LFxuICAgIHsgeDogNDU1LCB5OiAzNTEsIHI6IDMzLCBnOiA0MCwgYjogNTggfSxcbiAgICB7IHg6IDYyOCwgeTogMzQ4LCByOiAzMywgZzogNDAsIGI6IDU4IH0sXG4gICAgeyB4OiA2MjcsIHk6IDksIHI6IDU4LCBnOiA3MywgYjogMTE1IH0sXG5cbiAgICAvLyBkaWZmIGZyb20gb3RoZXIgcGFnZVxuICAgIHsgeDogNDMzLCB5OiAzMjQsIHI6IDg1LCBnOiAxMDcsIGI6IDY4IH0sXG4gICAgeyB4OiA0MzMsIHk6IDMyMCwgcjogODMsIGc6IDEwOSwgYjogNjYgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG4vLyBzb21ldGltZXMgdGhlIHF1aWNrIHBsYXkgd2lsbCBiZSBwYXVzZWRcbmV4cG9ydCBjb25zdCBvblF1aWNrUGxheVBhdXNlID0gbmV3IFBhZ2UoXG4gICdvblF1aWNrUGxheVBhdXNlJyxcbiAgW1xuICAgIHsgeDogNDU2LCB5OiAxMSwgcjogNDksIGc6IDczLCBiOiAxMjMgfSxcbiAgICB7IHg6IDQ3MiwgeTogMjIsIHI6IDIwMSwgZzogMjA3LCBiOiAyMTggfSxcbiAgICB7IHg6IDUzMiwgeTogMjIsIHI6IDgxLCBnOiAxMDAsIGI6IDEyOCB9LFxuICAgIHsgeDogNDUzLCB5OiAzNDcsIHI6IDI0LCBnOiAzNiwgYjogNTcgfSxcbiAgICB7IHg6IDMwNiwgeTogMjc2LCByOiA4LCBnOiAxMTgsIGI6IDI1NSB9LFxuICAgIHsgeDogNDIxLCB5OiAyODMsIHI6IDIsIGc6IDEwNSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzMjUsIHk6IDMzNywgcjogMCwgZzogOTcsIGI6IDI0NyB9LFxuICAgIHsgeDogNDMwLCB5OiAzMzYsIHI6IDAsIGc6IDk3LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzNzYsIHk6IDMyOSB9LCAvLyBwbGF5IGJhbGwgLy8gVE9ETzogbWlnaHQgbmVlZCB0byBzZXQgaW5uaW5nXG4gIHsgeDogMzc2LCB5OiAzMjkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG9uUXVpY2tQbGF5R3JvdXAgPSBuZXcgR3JvdXBQYWdlKCdvblF1aWNrUGxheScsIFtvblF1aWNrUGxheSwgb25RdWlja1BsYXkxXSwgb25RdWlja1BsYXkubmV4dCAvKiBuZXh0ICovKTtcblxuLy8gd2hlbiBwbGF5aW5nLCBwcmVzcyBiYWNrXG5leHBvcnQgY29uc3QgbGVhZ3VlT25QbGF5UGF1c2UgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU9uUGxheVBhdXNlJyxcbiAgW1xuICAgIC8vIGNvbnRpbnVlIGJ1dHRvblxuICAgIHsgeDogODksIHk6IDE0OCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogOTksIHk6IDEzOCwgcjogODIsIGc6IDg5LCBiOiA5OSB9LFxuICAgIC8vIGxlYXZlIGJ1dHRvblxuICAgIHsgeDogNTI3LCB5OiAxNjUsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU1NSwgeTogMTUzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgLy8gbWxiIGxvZ29cbiAgICB7IHg6IDU1NCwgeTogMjkxLCByOiAwLCBnOiAyOCwgYjogNTcgfSxcbiAgICB7IHg6IDU2MywgeTogMjk0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiA1NjUsIHk6IDI5MCwgcjogMzAsIGc6IDU0LCBiOiA4OCB9LFxuICBdLFxuICB7IHg6IDg5LCB5OiAxNDggfSwgLy8gY29udGludWUgZ2FtZVxuICB7IHg6IDUyNywgeTogMTY1IH0gLy8gbGVhdmVcbik7XG5cbi8vIGNhbm5vdCBnbyB0byBsZWFndWUgbW9kZSBkdWUgdG8gdW5leHBlY3RlZCBlcnJvclxuZXhwb3J0IGNvbnN0IGxlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3IgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZU1vZGVVbmV4cGVjdGVkRXJyb3InLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI3MiwgeTogNjIsIHI6IDE5MywgZzogMTk4LCBiOiAyMDIgfSxcbiAgICB7IHg6IDMxMSwgeTogNTksIHI6IDE2LCBnOiAyMywgYjogMzIgfSxcbiAgICB7IHg6IDMzOCwgeTogNjAsIHI6IDcxLCBnOiA3MiwgYjogODAgfSxcbiAgICB7IHg6IDM5NiwgeTogNjAsIHI6IDE5MiwgZzogMTk4LCBiOiAyMDMgfSxcblxuICAgIC8vIGNvbnRlbnRcbiAgICB7IHg6IDIwNiwgeTogMTM3LCByOiA1OCwgZzogNjcsIGI6IDc4IH0sXG4gICAgeyB4OiAzMzMsIHk6IDE4MCwgcjogMTAwLCBnOiAxMDksIGI6IDExOCB9LFxuICAgIHsgeDogMzY4LCB5OiAyMDMsIHI6IDEzOSwgZzogMTQ1LCBiOiAxNTQgfSxcblxuICAgIC8vIG9rICYgYmdcbiAgICB7IHg6IDMxOSwgeTogMzAxLCByOiAyNCwgZzogMTE3LCBiOiAyMzggfSxcbiAgICB7IHg6IDE2NCwgeTogMzA0LCByOiAyMzksIGc6IDI0MiwgYjogMjM5IH0sXG4gICAgeyB4OiA0ODcsIHk6IDMwMywgcjogMjQxLCBnOiAyNDAsIGI6IDI0MSB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdhbWVSZXN1bHQgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHQnLFxuICBbXG4gICAgeyB4OiA0NTgsIHk6IDI0LCByOiA0MSwgZzogNDQsIGI6IDQ5IH0sIC8vIHRpdGxlXG4gICAgeyB4OiAxMjYsIHk6IDMzMywgcjogNDksIGc6IDgxLCBiOiAxMjMgfSwgLy8gdmlldyBhbGwgYnRuXG4gICAgeyB4OiAyNDcsIHk6IDMzNSwgcjogNDEsIGc6IDgxLCBiOiAxMTUgfSwgLy8gYm94IHNjb3JlIGJ0blxuICAgIHsgeDogNjA5LCB5OiAzMzUsIHI6IDgsIGc6IDEwOSwgYjogMjU1IH0sIC8vIG5leHQgYnRuXG4gIF0sXG4gIHsgeDogNjA5LCB5OiAzMzUgfSxcbiAgeyB4OiA2MDksIHk6IDMzNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdEFxdWlyZWQgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRBcXVpcmVkJyxcbiAgW1xuICAgIHsgeDogNDQ5LCB5OiAyMywgcjogNDEsIGc6IDQ0LCBiOiA0OSB9LCAvLyB0aXRsZVxuICAgIHsgeDogMzksIHk6IDMyOSwgcjogMjEzLCBnOiAyMTgsIGI6IDIxMyB9LCAvLyBiYWNrIGJ0blxuICAgIHsgeDogMTU4LCB5OiAyODcsIHI6IDI0NywgZzogMTI2LCBiOiA1MSB9LCAvLyBwbGF5ZXIgcGFjayBidG5cbiAgICB7IHg6IDYxMiwgeTogMzI4LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LCAvLyBvayBidG5cbiAgXSxcbiAgeyB4OiA2MTIsIHk6IDMyOCB9LFxuICB7IHg6IDYxMiwgeTogMzI4IH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmVzdWx0T3RoZXIgPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRPdGhlcicsXG4gIFtcbiAgICB7IHg6IDcxLCB5OiAyOSwgcjogMCwgZzogODUsIGI6IDE1NiB9LFxuICAgIHsgeDogNTU2LCB5OiAxNSwgcjogMjEyLCBnOiAyMjgsIGI6IDI0MSB9LFxuICAgIHsgeDogNTk1LCB5OiAxMywgcjogMCwgZzogOTMsIGI6IDE4MSB9LFxuICAgIHsgeDogNjEwLCB5OiAxMywgcjogMCwgZzogMjgsIGI6IDU3IH0sXG4gICAgeyB4OiA2MTgsIHk6IDEzLCByOiAxNywgZzogMjYsIGI6IDU4IH0sXG4gICAgeyB4OiA2MjQsIHk6IDgsIHI6IDI0MywgZzogMjQ0LCBiOiAyNDUgfSxcbiAgICB7IHg6IDYyNywgeTogMjQsIHI6IDE2NSwgZzogMTg2LCBiOiAyMDIgfSxcbiAgICB7IHg6IDU3OCwgeTogMjMsIHI6IDcwLCBnOiAxMzIsIGI6IDE4MiB9LFxuICAgIHsgeDogMjQ5LCB5OiA1NiwgcjogODQsIGc6IDEyMSwgYjogMTYxIH0sXG4gICAgeyB4OiAyNjcsIHk6IDU2LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTksIHk6IDYwLCByOiAxNjgsIGc6IDE5MSwgYjogMjA4IH0sXG4gICAgeyB4OiAzNzcsIHk6IDU4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyOSwgeTogOTMsIHI6IDAsIGc6IDM2LCBiOiA2NiB9LFxuICAgIHsgeDogNjE3LCB5OiAzMTQsIHI6IDE2LCBnOiAyNCwgYjogMTcgfSxcbiAgICB7IHg6IDEwOCwgeTogMzIyLCByOiA4LCBnOiAyMCwgYjogMTYgfSxcbiAgXSxcbiAgeyB4OiAwLCB5OiAwIH0sXG4gIHsgeDogMCwgeTogMCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZ2FtZVJlc3VsdFdvcmxkQ2hhbXBpb24gPSBuZXcgUGFnZShcbiAgJ2dhbWVSZXN1bHRXb3JsZENoYW1waW9uJyxcbiAgW1xuICAgIHsgeDogMjUyLCB5OiAyMiwgcjogNTcsIGc6IDY3LCBiOiA3NCB9LFxuICAgIHsgeDogMzIzLCB5OiA0MiwgcjogMTE2LCBnOiAxMDksIGI6IDgzIH0sXG4gICAgeyB4OiAzNTAsIHk6IDczLCByOiA2NiwgZzogOTEsIGI6IDk2IH0sXG4gICAgeyB4OiA0OSwgeTogMzMxLCByOiAxNiwgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAyMDksIHk6IDMyMiwgcjogOCwgZzogMjAsIGI6IDI0IH0sXG4gICAgeyB4OiAyOTQsIHk6IDMyNiwgcjogMjA4LCBnOiAyMDgsIGI6IDIxMiB9LFxuICAgIHsgeDogNDAwLCB5OiAzMjMsIHI6IDE5MiwgZzogMTkwLCBiOiAxOTIgfSxcbiAgICB7IHg6IDQzOSwgeTogMzIzLCByOiA4NSwgZzogOTgsIGI6IDEwMCB9LFxuICAgIHsgeDogNTc4LCB5OiAxOTUsIHI6IDE2LCBnOiAzNiwgYjogNDEgfSxcbiAgICB7IHg6IDMxNiwgeTogMTY3LCByOiAyMTIsIGc6IDIxMCwgYjogMjEyIH0sXG4gICAgeyB4OiAzMzgsIHk6IDE3MywgcjogNjUsIGc6IDcxLCBiOiA3MSB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lUmV3YXJkID0gbmV3IFBhZ2UoXG4gICdnYW1lUmV3YXJkJyxcbiAgW1xuICAgIHsgeDogMjQsIHk6IDMzNiwgcjogMTYsIGc6IDMyLCBiOiA0MSB9LFxuICAgIHsgeDogNTc3LCB5OiAyNiwgcjogMCwgZzogNCwgYjogMCB9LFxuICAgIHsgeDogNjAxLCB5OiAzMzUsIHI6IDE2LCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDQxMSwgeTogMjY4LCByOiA4LCBnOiAxMTQsIGI6IDI1NSB9LFxuICAgIHsgeDogNDM0LCB5OiAyNzAsIHI6IDY2LCBnOiAxNDQsIGI6IDI1MiB9LFxuICAgIHsgeDogNDg3LCB5OiAyNzQsIHI6IDAsIGc6IDEwMiwgYjogMjQ3IH0sXG4gICAgeyB4OiA0OTcsIHk6IDEyMiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNDYxLCB5OiAxOTMsIHI6IDQyLCBnOiA1OCwgYjogNTggfSxcbiAgXSxcbiAgeyB4OiA0MTIsIHk6IDI3MSB9LFxuICB7IHg6IDQxMiwgeTogMjcxIH1cbik7XG5cbmV4cG9ydCBjb25zdCBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzID0gbmV3IFBhZ2UoXG4gICdiZXN0UG9zaXRpb25Bd2FyZEJvbnVzJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxNDEsIHk6IDIxLCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiA2MDksIHk6IDI2LCByOiAwLCBnOiA4MSwgYjogMTQ4IH0sXG4gICAgeyB4OiAyNiwgeTogMzM1LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA2MjYsIHk6IDMzOSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogNCwgeTogMTQ4LCByOiA4LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDYyOCwgeTogMTQwLCByOiAxNiwgZzogMzIsIGI6IDQ5IH0sXG5cbiAgICAvLyB0ZWFtIDEgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDE3MywgeTogMTgsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAxNzYsIHk6IDMwLCByOiAxNTgsIGc6IDE3MywgYjogMTk5IH0sXG4gICAgeyB4OiAxODQsIHk6IDM2LCByOiA4LCBnOiAxMDUsIGI6IDI1NSB9LFxuXG4gICAgLy8gdGVhbSAyIG5vdCBiZWluZyBzZWxlY3RlZFxuICAgIHsgeDogMzI4LCB5OiAyNywgcjogNDksIGc6IDg1LCBiOiAxMjMgfSxcbiAgICB7IHg6IDMzNywgeTogMzEsIHI6IDE2LCBnOiA0OCwgYjogODIgfSxcbiAgICB7IHg6IDM0MywgeTogMzcsIHI6IDQxLCBnOiA3NywgYjogMTE1IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYmVzdFBvc2l0aW9uQXdhcmRCb251czIgPSBuZXcgUGFnZShcbiAgJ2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMnLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDE0MSwgeTogMjEsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDYwOSwgeTogMjYsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDI2LCB5OiAzMzUsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDYyNiwgeTogMzM5LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiA0LCB5OiAxNDgsIHI6IDgsIGc6IDI0LCBiOiAzMyB9LFxuICAgIHsgeDogNjI4LCB5OiAxNDAsIHI6IDE2LCBnOiAzMiwgYjogNDkgfSxcblxuICAgIC8vIHRlYW0gMSBub3QgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDE4OSwgeTogMjIsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAxNzgsIHk6IDM0LCByOiA4LCBnOiA0OCwgYjogODIgfSxcbiAgICB7IHg6IDE2OSwgeTogMzksIHI6IDQxLCBnOiA3NywgYjogMTE1IH0sXG5cbiAgICAvLyB0ZWFtIDIgYmVpbmcgc2VsZWN0ZWRcbiAgICB7IHg6IDM0MywgeTogMjEsIHI6IDIsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiAzMzcsIHk6IDMxLCByOiAxNjMsIGc6IDE3MCwgYjogMTk3IH0sXG4gICAgeyB4OiAzMzEsIHk6IDQwLCByOiA4LCBnOiA5NywgYjogMjU1IH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYmVzdFBvc2l0aW9uQXdhcmRCb251c0dyb3VwID0gbmV3IEdyb3VwUGFnZShcbiAgJ2Jlc3RQb3NpdGlvbkF3YXJkQm9udXMnLFxuICBbYmVzdFBvc2l0aW9uQXdhcmRCb251cywgYmVzdFBvc2l0aW9uQXdhcmRCb251czJdLFxuICBiZXN0UG9zaXRpb25Bd2FyZEJvbnVzLm5leHQgLyogbmV4dCAqL1xuKTtcblxuLy8gbmV4dCBwYWdlIG9mIGdCZXN0UG9zaXRpb25Bd2FyZEJvbnVzXG5leHBvcnQgY29uc3QgYm9udXNHcmFudGVkQnlUZWFtUmVjb3JkID0gbmV3IFBhZ2UoXG4gICdib251c0dyYW50ZWRCeVRlYW1SZWNvcmQnLFxuICBbXG4gICAgLy8gdGFibGUgYmdcbiAgICB7IHg6IDM4LCB5OiA3NSwgcjogNDksIGc6IDY5LCBiOiAxMDcgfSxcbiAgICB7IHg6IDYwMCwgeTogNzMsIHI6IDQ5LCBnOiA2OSwgYjogMTA3IH0sXG4gICAgeyB4OiA2MDEsIHk6IDI4OSwgcjogMCwgZzogOCwgYjogMTYgfSxcbiAgICB7IHg6IDI4LCB5OiAyODUsIHI6IDgsIGc6IDEyLCBiOiAxNiB9LFxuXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDE3NiwgeTogNzYsIHI6IDQ5LCBnOiA2OCwgYjogMTA3IH0sXG4gICAgeyB4OiAyMTcsIHk6IDc3LCByOiAxMjgsIGc6IDEzNiwgYjogMTU5IH0sXG4gICAgeyB4OiAyNTUsIHk6IDc2LCByOiAxMzEsIGc6IDEzNywgYjogMTU3IH0sXG4gICAgeyB4OiAyNzgsIHk6IDc2LCByOiA3OCwgZzogOTUsIGI6IDEyOCB9LFxuICAgIHsgeDogMzI0LCB5OiA3NywgcjogMTEzLCBnOiAxMjIsIGI6IDE1MCB9LFxuICAgIHsgeDogMzYyLCB5OiA3NSwgcjogNDYsIGc6IDY2LCBiOiAxMDQgfSxcbiAgICB7IHg6IDQwNSwgeTogNzcsIHI6IDE3OCwgZzogMTg1LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQyNSwgeTogNzIsIHI6IDE4NCwgZzogMTg3LCBiOiAyMDYgfSxcbiAgICB7IHg6IDQzOSwgeTogNzcsIHI6IDUzLCBnOiA3MCwgYjogMTEwIH0sXG5cbiAgICAvLyBva1xuICAgIHsgeDogNTQ3LCB5OiAzMjAsIHI6IDAsIGc6IDExMywgYjogMjQ4IH0sXG4gICAgeyB4OiA1NjYsIHk6IDMyMSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNTc3LCB5OiAzMjQsIHI6IDIyOCwgZzogMjM5LCBiOiAyNDggfSxcbiAgICB7IHg6IDYwNSwgeTogMzI1LCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogNjExLCB5OiAzMTYsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogNTcwLCB5OiAzMjUgfSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9XG4pO1xuXG5leHBvcnQgY29uc3QgcG9zdFNlYXNvbkF3YXJkQm9udXMgPSBuZXcgUGFnZShcbiAgJ3Bvc3RTZWFzb25Bd2FyZEJvbnVzJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAzOSwgeTogMjQsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDMyMCwgeTogMTUsIHI6IDAsIGc6IDg1LCBiOiAxNjUgfSxcbiAgICB7IHg6IDYxNSwgeTogMjMsIHI6IDAsIGc6IDgxLCBiOiAxNDggfSxcbiAgICB7IHg6IDExLCB5OiAyNjgsIHI6IDE2LCBnOiAyOCwgYjogMzMgfSxcbiAgICB7IHg6IDYyMSwgeTogMjU4LCByOiAxNiwgZzogMjgsIGI6IDMzIH0sXG4gICAgeyB4OiA2MjQsIHk6IDM1MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMTcsIHk6IDMzOCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzE2LCB5OiAzNDIsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiA1MzEsIHk6IDMxOCwgcjogMCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDU2NCwgeTogMzIzLCByOiAyMTgsIGc6IDIzNCwgYjogMjU0IH0sXG4gICAgeyB4OiA1NzcsIHk6IDMyMywgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogNjA4LCB5OiAzMTgsIHI6IDAsIGc6IDExNywgYjogMjU1IH0sXG4gICAgeyB4OiA2MDYsIHk6IDMzMSwgcjogOCwgZzogMTA1LCBiOiAyNTUgfSxcbiAgXSxcbiAgeyB4OiA1NzAsIHk6IDMyNSB9LFxuICB7IHg6IDU3MCwgeTogMzI1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBnYW1lTGluZVVwID0gbmV3IFBhZ2UoXG4gICdnYW1lTGluZVVwJyxcbiAgW1xuICAgIC8vIGNvbnRlbnQgdG9wIGJnXG4gICAgeyB4OiA1OTEsIHk6IDU5LCByOiA0OSwgZzogNzMsIGI6IDEwNyB9LFxuICAgIC8vIHByb2dyZXNzIGJnXG4gICAgeyB4OiAxOSwgeTogMjExLCByOiAyNCwgZzogMzIsIGI6IDQ5IH0sXG4gICAgLy8gYmF0dGxlIGxpbmV1cCBidXR0b24gaW4gYm90dG9tXG4gICAgeyB4OiA1MzYsIHk6IDMyMiwgcjogNDEsIGc6IDgxLCBiOiAxMzcgfSxcbiAgICB7IHg6IDU1MywgeTogMzIyLCByOiAxODgsIGc6IDIwOSwgYjogMjI0IH0sXG4gICAgeyB4OiA1NjgsIHk6IDMyMiwgcjogMjA0LCBnOiAyMjAsIGI6IDIzNCB9LFxuICAgIHsgeDogNTg1LCB5OiAzMjQsIHI6IDEwNywgZzogMTM5LCBiOiAxNzcgfSxcbiAgICB7IHg6IDYwNCwgeTogMzI0LCByOiAyNSwgZzogNzMsIGI6IDEzMiB9LFxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDI2LCB5OiAzMTQsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQzLCB5OiAzMjEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgICB7IHg6IDM2LCB5OiAzMjksIHI6IDIxMSwgZzogMjE2LCBiOiAyMTAgfSxcbiAgXSxcbiAgeyB4OiA0MCwgeTogMzI0IH0sXG4gIHsgeDogNDAsIHk6IDMyNCB9XG4pO1xuXG5leHBvcnQgY29uc3QgcGxheWVyR3Jvd3RoQ29tcGxldGUgPSBuZXcgUGFnZShcbiAgJ3BsYXllckdyb3d0aENvbXBsZXRlJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTUsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTQsIHk6IDMwMCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE0LCB5OiAzMDEsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUyMiwgeTogNzQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExMCwgeTogMTY5LCByOiAyMDYsIGc6IDIxMCwgYjogMjE0IH0sXG4gICAgeyB4OiAxMTAsIHk6IDIzMCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNTIyLCB5OiAxNTYsIHI6IDIwNiwgZzogMjEwLCBiOiAyMTQgfSxcbiAgICB7IHg6IDUxMywgeTogMjMwLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyBjb250aW51ZVxuICAgIHsgeDogMjQwLCB5OiAzMDAsIHI6IDgsIGc6IDExNCwgYjogMjQ4IH0sXG4gICAgeyB4OiAzMTIsIHk6IDMwMSwgcjogMjIzLCBnOiAyMzMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzM3LCB5OiAzMDYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM5OSwgeTogMzAyLCByOiA4LCBnOiAxMTAsIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDMyNSwgeTogMzA0IH0sXG4gIHsgeDogMzI1LCB5OiAzMDQgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUgPSBuZXcgUGFnZShcbiAgJ2xlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGUnLFxuICBbXG4gICAgLy8gdGl0bGUgYmcgJiB4XG4gICAgeyB4OiAyMCwgeTogMzQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDIwLCB5OiA2MywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNjAwLCB5OiAzNiwgcjogMjEyLCBnOiAyMDksIGI6IDIxMiB9LFxuICAgIHsgeDogNjExLCB5OiA1NiwgcjogMjIyLCBnOiAyMTgsIGI6IDIyMiB9LFxuICAgIHsgeDogNDQyLCB5OiA2NywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuXG4gICAgLy8gcHJvZ3Jlc3MgYmFyIGJnXG4gICAgeyB4OiAxNiwgeTogNzksIHI6IDAsIGc6IDQ5LCBiOiA5MCB9LFxuICAgIHsgeDogMTgsIHk6IDE5MywgcjogMCwgZzogNDksIGI6IDkwIH0sXG4gICAgeyB4OiA2MTYsIHk6IDE5OSwgcjogMTYsIGc6IDY1LCBiOiAxMTUgfSxcblxuICAgIC8vIGJnIGluIGJvdHRvbVxuICAgIHsgeDogNjE4LCB5OiAyMTUsIHI6IDMzLCBnOiAzMiwgYjogNDEgfSxcbiAgICB7IHg6IDYxMywgeTogMzI2LCByOiA0MSwgZzogNDUsIGI6IDQ5IH0sXG4gIF0sXG4gIHsgeDogNjAwLCB5OiA0NSB9LFxuICB7IHg6IDYwMCwgeTogNDUgfVxuKTtcbi8vIHJcblxuZXhwb3J0IGNvbnN0IGxlYWd1ZVJld2FyZEFjaGlldmVtZW50R3JhZGVCb251c1BsYXllciA9IG5ldyBQYWdlKFxuICAnbGVhZ3VlUmV3YXJkQWNoaWV2ZW1lbnRHcmFkZUJvbnVzUGxheWVyJyxcbiAgW1xuICAgIC8vIHRpdGxlIGFuZCB4XG4gICAgeyB4OiAxNzMsIHk6IDU4LCByOiAxNDcsIGc6IDE1MywgYjogMTU2IH0sXG4gICAgeyB4OiAyMjksIHk6IDU4LCByOiA3OSwgZzogODIsIGI6IDgyIH0sXG4gICAgeyB4OiAzMjAsIHk6IDYwLCByOiAxNjAsIGc6IDE2MywgYjogMTY0IH0sXG4gICAgeyB4OiAzNzMsIHk6IDU1LCByOiAxNzcsIGc6IDE4NCwgYjogMTg1IH0sXG4gICAgeyB4OiA0NDMsIHk6IDYwLCByOiAxMDEsIGc6IDEwNSwgYjogMTEwIH0sXG4gICAgeyB4OiA1MjEsIHk6IDUxLCByOiA2NiwgZzogNjksIGI6IDY2IH0sXG5cbiAgICAvLyBsb2dvIG9uIGNlbnRlclxuICAgIHsgeDogMjkwLCB5OiAxMzIsIHI6IDgsIGc6IDI4LCBiOiA2NiB9LFxuICAgIHsgeDogMzI1LCB5OiAxNTAsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM1NywgeTogMTMzLCByOiAxODksIGc6IDAsIGI6IDMzIH0sXG5cbiAgICAvLyBuZXh0XG4gICAgeyB4OiAyODEsIHk6IDI5OCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyMywgeTogMjk5LCByOiAyMjAsIGc6IDIzNCwgYjogMjUwIH0sXG4gICAgeyB4OiAzNjUsIHk6IDMwNywgcjogOCwgZzogMTAxLCBiOiAyNDcgfSxcbiAgICB7IHg6IDMwNywgeTogMzAxLCByOiAyNTAsIGc6IDI1MiwgYjogMjU0IH0sXG4gICAgeyB4OiAzMjksIHk6IDI5NywgcjogMjUyLCBnOiAyNTMsIGI6IDI1NSB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sXG4gIHsgeDogMzIwLCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHBpdGNoZXJPZlRoZU1vbnRoID0gbmV3IFBhZ2UoXG4gICdwaXRjaGVyT2ZUaGVNb250aCcsXG4gIFtcbiAgICB7IHg6IDI3LCB5OiAzOCwgcjogMTgxLCBnOiAxODYsIGI6IDE5OCB9LFxuICAgIHsgeDogNjAyLCB5OiA0NiwgcjogMTU0LCBnOiAxNTIsIGI6IDE1NSB9LFxuICAgIHsgeDogNTM1LCB5OiAzMDksIHI6IDEzOSwgZzogMTg4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDYwNSwgeTogMzE2LCByOiAwLCBnOiA5NywgYjogMjQ3IH0sXG4gICAgeyB4OiAzOTEsIHk6IDMwOSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDU0NSwgeTogMzEwIH0sXG4gIHsgeDogNTQ1LCB5OiAzMTAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG12cCA9IG5ldyBQYWdlKFxuICAnbXZwJyxcbiAgW1xuICAgIHsgeDogMjczLCB5OiAyMywgcjogMCwgZzogODksIGI6IDE2NSB9LFxuICAgIHsgeDogMjk3LCB5OiAyNSwgcjogOTAsIGc6IDE0NSwgYjogMjAwIH0sXG4gICAgeyB4OiAzMjAsIHk6IDI1LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMzIsIHk6IDI5LCByOiAxMjYsIGc6IDE2OSwgYjogMjA0IH0sXG4gICAgeyB4OiAzODAsIHk6IDUzLCByOiAwLCBnOiA2NSwgYjogMTIyIH0sXG4gICAgeyB4OiA0OTMsIHk6IDMyMiwgcjogMTYsIGc6IDIwLCBiOiA4IH0sXG4gICAgeyB4OiA1NjgsIHk6IDMyMCwgcjogMzgsIGc6IDEyMCwgYjogMjE4IH0sXG4gICAgeyB4OiA2MzUsIHk6IDM0MSwgcjogOCwgZzogMTYsIGI6IDggfSxcbiAgICB7IHg6IDYyMCwgeTogMTY0LCByOiAwLCBnOiA4LCBiOiA4IH0sXG4gICAgeyB4OiA5LCB5OiAxNzYsIHI6IDEyLCBnOiAyNCwgYjogMjQgfSxcbiAgXSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9LFxuICB7IHg6IDU2OCwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RSZXdhcmRQbGF5ZXIgPSBuZXcgUGFnZShcbiAgJ3NlbGVjdFJld2FyZFBsYXllcicsXG4gIFtcbiAgICAvLyBiZ1xuICAgIHsgeDogNCwgeTogNiwgcjogMCwgZzogOTcsIGI6IDE4OSB9LFxuICAgIHsgeDogMTEsIHk6IDM0NiwgcjogMTYsIGc6IDE2LCBiOiA4IH0sXG4gICAgeyB4OiA3LCB5OiAzNTAsIHI6IDE2LCBnOiAyMCwgYjogMTYgfSxcblxuICAgIC8vIGZvcm0gYmcgaW4gYm90dG9tXG4gICAgeyB4OiA2NSwgeTogMzAxLCByOiA2NiwgZzogNzcsIGI6IDY2IH0sXG4gICAgeyB4OiA2NSwgeTogMzI2LCByOiA0MCwgZzogNDUsIGI6IDMzIH0sXG4gICAgeyB4OiAxNzUsIHk6IDMwMywgcjogNjYsIGc6IDc3LCBiOiA1OCB9LFxuICAgIHsgeDogMTc0LCB5OiAzMjgsIHI6IDQxLCBnOiA0NSwgYjogMzMgfSxcbiAgICB7IHg6IDI3NSwgeTogMzA0LCByOiA2NiwgZzogNzMsIGI6IDU4IH0sXG4gICAgeyB4OiAyNzUsIHk6IDMyNCwgcjogNDEsIGc6IDQ4LCBiOiAzMyB9LFxuICAgIHsgeDogMzg0LCB5OiAzMDEsIHI6IDY2LCBnOiA3MywgYjogNTggfSxcbiAgICB7IHg6IDM4NCwgeTogMzIxLCByOiA0MSwgZzogNDUsIGI6IDMzIH0sXG4gIF0sXG4gIHsgeDogNTY4LCB5OiAzMjAgfSxcbiAgeyB4OiA1NjgsIHk6IDMyMCB9XG4pO1xuLy8gVE9ETzogY2hlY2sgdGhlIHBvc2l0aW9uLCBtdXN0IGJlIGJnIG9mICdkaWFtb25kJywgJ29sZCcgLi4uXG4vLyBiZyBvZiB0aGUgd29yZFxuLy8gcmVmOiBodHRwczovL3d3dy5mYWNlYm9vay5jb20vbWxiOWlubmluZ3MvcGhvdG9zLzEzNjY1OTYxMDM3NDg1NzBcbi8vIGxlZnQsIG1pZCBhbmQgcmlnaHQgcmVzcGVjdGl2ZWx5XG5leHBvcnQgY29uc3Qgc2VsZWN0UmV3YXJkUGxheWVyQnRucyA9IFtcbiAgeyB4OiA2NiwgeTogMjE3IH0sXG4gIHsgeDogMjIxLCB5OiAyMTcgfSxcbiAgeyB4OiAzNzcsIHk6IDIxNyB9LFxuXTtcbi8vIG9ubHkgaW5jbHVkZSBiYXNpYyB0eXBlc1xuLy8ge3J9LXtnfS17Yn06IHByb3JpdHlcbi8vIHRyeSB4IDIzLCB5IDI2MCBpbiBwbGF5ZXIgaW5mb1xuZXhwb3J0IGNvbnN0IHBsYXllckNhcmRDb2xvclRvUmFuazogeyBbazogc3RyaW5nXTogbnVtYmVyIH0gPSB7XG4gICc2Ni03NC03NCc6IDEsIC8vIG5vcm1hbCBUT0RPOiB1bmtub3duIGNvbG9yXG4gICc5OS02NS00MSc6IDIsIC8vIGJyb3duXG4gICc5OS02NS00OSc6IDIsIC8vIGJyb3duXG4gICcxMzItMTI5LTE0OCc6IDMsIC8vIHNpbHZlclxuICAnMTg5LTE2Ni00OSc6IDQsIC8vIGdvbGRcbiAgJzE4OS0xNjYtNTgnOiA0LCAvLyBnb2xkXG4gICcxOTgtMTcwLTU3JzogNCwgLy8gZ29sZFxuICAnMTQ4LTEwMS0yNSc6IDQsIC8vIGdvbGRcbiAgJzE2NS0xNjYtOTAnOiA0LCAvLyBnb2xkXG4gICc0MS02OS0xMDcnOiA1LCAvLyBkaWFtb25kIFRPRE86IHVua25vd24gY29sb3Jcbn07XG5cbi8vIGFkUmV3YXJkIHBhZ2VzXG5leHBvcnQgY29uc3QgYWRSZXdhcmQgPSBuZXcgUGFnZShcbiAgJ2FkUmV3YXJkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAyOCwgeTogNDUsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDM2LCB5OiAyNjcsIHI6IDE4MSwgZzogMTg2LCBiOiAxOTcgfSxcbiAgICB7IHg6IDMyLCB5OiAzMDcsIHI6IDIzOCwgZzogMjQzLCBiOiAyMzggfSxcbiAgICB7IHg6IDYwNSwgeTogNTIsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDYxMSwgeTogMjQ0LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MDcsIHk6IDMxOSwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuXG4gICAgLy8gd2F0Y2ggYWQgaWNvbiAmIGJ0biBiZ1xuICAgIHsgeDogMzQ0LCB5OiAzMDAsIHI6IDQ5LCBnOiAxNjIsIGI6IDkwIH0sXG4gICAgeyB4OiA0OTAsIHk6IDMxOCwgcjogNDEsIGc6IDE0MiwgYjogODIgfSxcbiAgICB7IHg6IDM2MSwgeTogMzA4LCByOiAwLCBnOiAxNDcsIGI6IDE0MSB9LFxuICAgIHsgeDogMzc1LCB5OiAzMTYsIHI6IDAsIGc6IDExMCwgYjogMTA3IH0sXG5cbiAgICAvLyBjYW5jZWxcbiAgICB7IHg6IDE5MCwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMjA0LCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyMTksIHk6IDMxMCwgcjogMjQyLCBnOiAyNDYsIGI6IDI1MyB9LFxuICAgIHsgeDogMjMyLCB5OiAzMTAsIHI6IDgsIGc6IDEwOSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyNDcsIHk6IDMxMCwgcjogOCwgZzogMTA5LCBiOiAyNDcgfSxcbiAgICB7IHg6IDI1OCwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDQwNCwgeTogMzEwIH0sXG4gIHsgeDogMTE3LCB5OiAzMDggfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkUmV3YXJkUmVkZWVtID0gbmV3IFBhZ2UoXG4gICdhZFJld2FyZFJlZGVlbScsXG4gIFtcbiAgICAvLyBhZCByZXdhcmQgdGl0bGVcbiAgICB7IHg6IDI3NCwgeTogNTEsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDMwMiwgeTogNDksIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDMzNCwgeTogNTEsIHI6IDE2LCBnOiAyNCwgYjogMzMgfSxcbiAgICB7IHg6IDM1NiwgeTogNTIsIHI6IDkwLCBnOiA5NCwgYjogMTAyIH0sXG5cbiAgICAvLyBiZ1xuICAgIHsgeDogMjUsIHk6IDQ2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiAzNiwgeTogMzA3LCByOiAyMzgsIGc6IDI0MywgYjogMjM4IH0sXG4gICAgeyB4OiA2MDEsIHk6IDQyLCByOiAxMjMsIGc6IDExOCwgYjogMTIzIH0sXG4gICAgeyB4OiA1OTEsIHk6IDMxOCwgcjogMjM4LCBnOiAyNDMsIGI6IDIzOCB9LFxuICAgIHsgeDogMjEsIHk6IDI3MywgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuICAgIHsgeDogMTgsIHk6IDgxLCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MTYsIHk6IDg1LCByOiAxODEsIGc6IDE4NiwgYjogMTk3IH0sXG4gICAgeyB4OiA2MDgsIHk6IDI2OSwgcjogMTgxLCBnOiAxODYsIGI6IDE5NyB9LFxuXG4gICAgLy8gb2tcbiAgICB7IHg6IDMwMSwgeTogMzEwLCByOiA4LCBnOiAxMDksIGI6IDI0NyB9LFxuICAgIHsgeDogMzE5LCB5OiAzMDcsIHI6IDE5LCBnOiAxMTcsIGI6IDI0NCB9LFxuICAgIHsgeDogMzQ5LCB5OiAzMDcsIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzAzLCB5OiAzMDQgfSxcbiAgeyB4OiAzMDMsIHk6IDMwNCB9XG4pO1xuXG5leHBvcnQgY29uc3QgYWRSZXdhcmRPbkNEID0gbmV3IFBhZ2UoXG4gICdhZFJld2FyZE9uQ0QnLFxuICBbXG4gICAgLy8gdGl0bGVcbiAgICB7IHg6IDI0OSwgeTogNTMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDI3MCwgeTogNjUsIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDMyOSwgeTogNjMsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDM2NywgeTogNTYsIHI6IDc5LCBnOiA4NCwgYjogODcgfSxcblxuICAgIC8vIHhcbiAgICB7IHg6IDUxNiwgeTogNDgsIHI6IDE0MiwgZzogMTQwLCBiOiAxNDMgfSxcbiAgICB7IHg6IDUyMiwgeTogNTcsIHI6IDE4NiwgZzogMTg1LCBiOiAxODggfSxcbiAgICB7IHg6IDUyMiwgeTogNDUsIHI6IDE4OCwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODIsIHk6IDI5OSwgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNywgeTogMjk3LCByOiAxMTUsIGc6IDE3OCwgYjogMjU1IH0sXG4gICAgeyB4OiA0MTMsIHk6IDMwMywgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzY0LCB5OiAzMDUsIHI6IDEsIGc6IDEwNSwgYjogMjQ4IH0sXG4gIF0sXG4gIHsgeDogNTE2LCB5OiA0OCB9LFxuICB7IHg6IDUxNiwgeTogNDggfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkR3JvdXAgPSBuZXcgR3JvdXBQYWdlKCdhZFBhZ2VzJywgW2FkUmV3YXJkLCBhZFJld2FyZFJlZGVlbSwgYWRSZXdhcmRPbkNEXSk7XG5cbi8vIHdlZWtseSBtaXNzaW9uIHBhZ2VzXG5leHBvcnQgY29uc3QgYWNoaXZlbWVudE1pc3Npb24gPSBuZXcgUGFnZShcbiAgJ2FjaGl2ZW1lbnRNaXNzaW9uJyxcbiAgW1xuICAgIC8vIHRvZGF5IG1pc3Npb24gYmdcbiAgICB7IHg6IDIzNSwgeTogNTUsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDIzMSwgeTogNzEsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDU4OCwgeTogNzIsIHI6IDI0NywgZzogMjQ3LCBiOiAyNDcgfSxcblxuICAgIC8vIGxlZnQgc2VjdGlvbiB3b3JsZCByZWNvcmQgYmcgbGVmdCBib3R0b21cbiAgICB7IHg6IDE2LCB5OiAyOTMsIHI6IDI1LCBnOiA0MCwgYjogNzQgfSxcblxuICAgIC8vIHBsYXllciBoZWFkXG4gICAgeyB4OiA3NSwgeTogODgsIHI6IDY2LCBnOiA1OSwgYjogOTAgfSxcblxuICAgIC8vIGJhY2tcbiAgICB7IHg6IDMxLCB5OiAzMTYsIHI6IDIxNCwgZzogMjE5LCBiOiAyMTQgfSxcbiAgXSxcbiAgeyB4OiA1ODAsIHk6IDI3OCB9LCAvLyBjb21wbGV0ZSB3ZWVrbHkgbWlzc2lvbiBib3hcbiAgeyB4OiA0MSwgeTogMzIwIH1cbik7XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94ID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94JyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCAocCwgc3RhciAuLi4pXG4gICAgeyB4OiAyOTksIHk6IDEzLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTgsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMxMywgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzkyLCB5OiA5LCByOiAyMzIsIGc6IDIyOSwgYjogMjMyIH0sXG4gICAgeyB4OiAzODUsIHk6IDIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ5NiwgeTogMTMsIHI6IDIzOCwgZzogMTY2LCBiOiAxNiB9LFxuICAgIHsgeDogNDgzLCB5OiA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE2IH0sXG4gICAgeyB4OiA1OTcsIHk6IDEwLCByOiAyMTMsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0LCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG5cbiAgICAvLyBiZyBvZiB0YWJsZVxuICAgIHsgeDogMTQsIHk6IDgyLCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAxNiwgeTogMjg4LCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTUsIHk6IDEwMCwgcjogMzMsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAyODMsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvb3RlclxuICAgIHsgeDogODAsIHk6IDMwNywgcjogMjAyLCBnOiAyMDEsIGI6IDE5NiB9LFxuICAgIHsgeDogODksIHk6IDMxNSwgcjogNDksIGc6IDYxLCBiOiAzNCB9LFxuICAgIHsgeDogMTAzLCB5OiAzMTksIHI6IDczLCBnOiA4MywgYjogNjYgfSxcbiAgICB7IHg6IDE3MiwgeTogMzM1LCByOiA3OCwgZzogODQsIGI6IDcyIH0sXG4gICAgeyB4OiAyNTAsIHk6IDMzOCwgcjogMTAxLCBnOiAxMDYsIGI6IDkzIH0sXG4gICAgeyB4OiAyNzMsIHk6IDMwNywgcjogMTU5LCBnOiAxNTksIGI6IDE0OSB9LFxuICAgIHsgeDogMjg0LCB5OiAzMDksIHI6IDU2LCBnOiA2MSwgYjogNDAgfSxcblxuICAgIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAyNCwgeTogMzE0LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MiwgeTogMzE3LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMSwgeTogMzMxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LCAvLyBiYWNrIGJ0blxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3hCdG5zID0ge1xuICBvcGVuQm94OiB7IHg6IDQxOCwgeTogMzI1IH0sXG4gIHJlY2VpdmVSZXdhcmQ6IHsgeDogNTYxLCB5OiAzMjYgfSxcbn07XG5cbmV4cG9ydCBjb25zdCB3ZWVrbHlNaXNzaW9uQm94Q29uZmlybSA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveENvbmZpcm0nLFxuICBbXG4gICAgLy8gYmdcbiAgICB7IHg6IDExMSwgeTogNDIsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDExNywgeTogMzA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjIyIH0sXG4gICAgeyB4OiA1MTUsIHk6IDMwMCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE5LCB5OiAxNzcsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyNDAsIHk6IDU4LCByOiAxNTUsIGc6IDE2MCwgYjogMTYzIH0sXG4gICAgeyB4OiAyNjcsIHk6IDU4LCByOiAxNDEsIGc6IDE0NywgYjogMTQ5IH0sXG4gICAgeyB4OiAzMjUsIHk6IDU5LCByOiAxNjEsIGc6IDE2NywgYjogMTcwIH0sXG4gICAgeyB4OiAzODMsIHk6IDU5LCByOiAxNzEsIGc6IDE3OSwgYjogMTc5IH0sXG4gICAgeyB4OiA0MDcsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTUsIHk6IDQ5LCByOiAxODcsIGc6IDE4NSwgYjogMTg4IH0sXG4gICAgeyB4OiA1MTksIHk6IDU1LCByOiA5MSwgZzogOTEsIGI6IDkyIH0sXG5cbiAgICAvLyBubyAmIHllcyBidG5cbiAgICB7IHg6IDIxMCwgeTogMjkzLCByOiA0MSwgZzogODEsIGI6IDEyMyB9LFxuICAgIHsgeDogMjM4LCB5OiAyOTYsIHI6IDQ1LCBnOiA4MSwgYjogMTI4IH0sXG4gICAgeyB4OiAyODQsIHk6IDI5NCwgcjogNDEsIGc6IDc4LCBiOiAxMjMgfSxcblxuICAgIHsgeDogMzk3LCB5OiAyOTksIHI6IDQwLCBnOiAxMzQsIGI6IDI1MyB9LFxuICAgIHsgeDogNDMzLCB5OiAzMDcsIHI6IDgsIGc6IDk4LCBiOiAyNDcgfSxcbiAgXSxcbiAgeyB4OiAzODcsIHk6IDMwMCB9LCAvLyB5ZXMgYnRuXG4gIHsgeDogMzg3LCB5OiAzMDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTMsIHk6IDUzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNywgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDk2LCB5OiAyOTksIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMTcsIHk6IDU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyNTksIHk6IDU1LCByOiAxNzcsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiAyOTgsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDEsIHk6IDYwLCByOiAxMjAsIGc6IDEyNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTIsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTgyIH0sXG4gICAgeyB4OiA1MTksIHk6IDUzLCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBvayBidG5cbiAgICB7IHg6IDI4OCwgeTogMjk3LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMDAsIHI6IDEzNiwgZzogMTkwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzAxLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sIC8vIG9rIGJ0blxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG5cbi8vIGdlbmVyYWwgcGFnZXNcbmV4cG9ydCBjb25zdCBwb3dlclNhdmluZyA9IG5ldyBQYWdlKFxuICAncG93ZXJTYXZpbmcnLFxuICBbXG4gICAgeyB4OiAzMDQsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA1LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNiwgeTogMTM2LCByOiAxNTYsIGc6IDE2MCwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDcsIHk6IDEzNiwgcjogMTU2LCBnOiAxNjAsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA4LCB5OiAxMzYsIHI6IDE1NiwgZzogMTYwLCBiOiAxNjUgfSxcblxuICAgIHsgeDogMzAxLCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwMiwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAzMDMsIHk6IDEzMywgcjogMTY1LCBnOiAxNjIsIGI6IDE2NSB9LFxuICAgIHsgeDogMzA0LCB5OiAxMzMsIHI6IDE2NSwgZzogMTYyLCBiOiAxNjUgfSxcbiAgICB7IHg6IDMwNSwgeTogMTMzLCByOiAxNjUsIGc6IDE2MiwgYjogMTY1IH0sXG4gICAgeyB4OiAxMzcsIHk6IDE1NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTIxLCB5OiAxNjAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDI5OCwgeTogNTAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDYxOCwgeTogMTAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICAvLyB0byBkaWZmIGZyb20gcG93ZXIgc2F2aW5nIGR1cmluZyBwbGF5aW5nXG4gICAgeyB4OiA0OTcsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNDk4LCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDQ5OSwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDAsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTAxLCB5OiAzMDAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUwMiwgeTogMzAwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDMsIHk6IDMwMCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTU1LCB5OiAyODIsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1NSwgeTogMjkyLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDUsIHk6IDI5MSwgcjogMCwgZzogMCwgYjogMCB9LFxuXG4gICAgLy8gc2NvcmVcbiAgICB7IHg6IDUyMCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjUsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTMwLCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzNSwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NDAsIHk6IDI4MCwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQ1LCB5OiAyODAsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU1MCwgeTogMjgwLCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MjAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTI1LCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDUzMCwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1MzUsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICAgIHsgeDogNTQwLCB5OiAyOTUsIHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICB7IHg6IDU0NSwgeTogMjk1LCByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgeyB4OiA1NTAsIHk6IDI5NSwgcjogMCwgZzogMCwgYjogMCB9LFxuICBdLFxuICB7IHg6IDAsIHk6IDAgfSxcbiAgeyB4OiAwLCB5OiAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9tb3Rpb24xID0gbmV3IFBhZ2UoXG4gICdwcm9tb3Rpb24xJyxcbiAgW1xuICAgIHsgeDogNjAzLCB5OiAyNywgcjogMTI0LCBnOiAxMzAsIGI6IDEzMiB9LFxuICAgIHsgeDogNjEyLCB5OiAzMywgcjogNjAsIGc6IDYwLCBiOiA2MCB9LFxuICAgIHsgeDogNjA1LCB5OiA0MCwgcjogMTc0LCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjA1LCB5OiAzNSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjEyLCB5OiAzOSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjE2LCB5OiAzOSwgcjogMTgxLCBnOiAxNzgsIGI6IDE4MSB9LFxuICAgIHsgeDogNjE1LCB5OiAyOSwgcjogMTQyLCBnOiAxNDQsIGI6IDE0MiB9LFxuICBdLFxuICB7IHg6IDYxMSwgeTogMzYgfSxcbiAgeyB4OiA2MTEsIHk6IDM2IH1cbik7XG5cbmV4cG9ydCBjb25zdCBwcm9tb3Rpb24yID0gbmV3IFBhZ2UoXG4gICdwcm9tb3Rpb24yJyxcbiAgW1xuICAgIHsgeDogNDMsIHk6IDMxLCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiAzMDYsIHk6IDI5LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiA1NDYsIHk6IDMyLCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gICAgeyB4OiA1NzYsIHk6IDM2LCByOiAxNzMsIGc6IDE3NCwgYjogMTgwIH0sXG4gICAgeyB4OiA1ODAsIHk6IDQwLCByOiAxNzQsIGc6IDE3MiwgYjogMTc1IH0sXG4gICAgeyB4OiA1ODcsIHk6IDM2LCByOiAyMDYsIGc6IDIwNywgYjogMjEzIH0sXG4gICAgeyB4OiA1NzYsIHk6IDQ2LCByOiAyMTMsIGc6IDIxMSwgYjogMjE1IH0sXG4gICAgeyB4OiA1ODQsIHk6IDQ1LCByOiAyMTIsIGc6IDIxMCwgYjogMjEzIH0sXG4gICAgeyB4OiA1OTUsIHk6IDU1LCByOiAyMDYsIGc6IDIxMSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTc4LCB5OiAzOSB9LFxuICB7IHg6IDU3OCwgeTogMzkgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHByb21vdGlvbjMgPSBuZXcgUGFnZShcbiAgJ3Byb21vdGlvbjMnLFxuICBbXG4gICAgeyB4OiA1OTgsIHk6IDM3LCByOiAxMDEsIGc6IDEwMywgYjogMTAyIH0sXG4gICAgeyB4OiA2MDQsIHk6IDQ1LCByOiA3MSwgZzogNzMsIGI6IDcxIH0sXG4gICAgeyB4OiA2MTIsIHk6IDUzLCByOiAxNzQsIGc6IDE3NSwgYjogMTc2IH0sXG4gICAgeyB4OiA2MTcsIHk6IDMzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gIF0sXG4gIHsgeDogNjAxLCB5OiA0MyB9LFxuICB7IHg6IDYwMSwgeTogNDMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlY2hhcmdlUHJvbW90aW9uID0gbmV3IFBhZ2UoXG4gICdyZWNoYXJnZVByb21vdGlvbicsXG4gIFtcbiAgICB7IHg6IDExNCwgeTogNDUsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDIyOSwgeTogNTksIHI6IDE2LCBnOiAyNCwgYjogMjQgfSxcbiAgICB7IHg6IDI4MCwgeTogNjAsIHI6IDM1LCBnOiA0MywgYjogNDggfSxcbiAgICB7IHg6IDM0MCwgeTogNTgsIHI6IDE3NiwgZzogMTgxLCBiOiAxODUgfSxcbiAgICB7IHg6IDQwNywgeTogNjYsIHI6IDM4LCBnOiA0NSwgYjogNDcgfSxcbiAgICB7IHg6IDQ1NiwgeTogODksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyMCwgeTogNTAsIHI6IDY3LCBnOiA2OCwgYjogNjggfSxcbiAgICB7IHg6IDUyNCwgeTogNTgsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyOSwgeTogNDMsIHI6IDE1MSwgZzogMTU1LCBiOiAxNTYgfSxcbiAgICB7IHg6IDE4MCwgeTogMzAyLCByOiA3NSwgZzogMTQ5LCBiOiAyNTUgfSxcbiAgICB7IHg6IDE0NCwgeTogMjg5LCByOiA0MSwgZzogMTQyLCBiOiAyNTUgfSxcbiAgICB7IHg6IDExMCwgeTogMzAwLCByOiAyMjIsIGc6IDIyMywgYjogMjIyIH0sXG4gICAgeyB4OiAzMzcsIHk6IDI4OCwgcjogNDEsIGc6IDE0MiwgYjogMjU1IH0sXG4gICAgeyB4OiAzNjYsIHk6IDMwMiwgcjogMjUyLCBnOiAyNTMsIGI6IDI1NCB9LFxuICAgIHsgeDogNDM4LCB5OiAzMDIsIHI6IDI1NSwgZzogMjI2LCBiOiAxMjUgfSxcbiAgICB7IHg6IDUyMiwgeTogMzExLCByOiAyMjIsIGc6IDIyMywgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTE4LCB5OiA1MyB9LFxuICB7IHg6IDUxOCwgeTogNTMgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHRlYW1TdXBwb3J0UGFja2FnZVByb21vdGlvbiA9IG5ldyBQYWdlKFxuICAndGVhbVN1cHBvcnRQYWNrYWdlUHJvbW90aW9uJyxcbiAgW1xuICAgIC8vIGhlYWRlciBiZyBhbmQgeFxuICAgIHsgeDogNTU4LCB5OiAzNywgcjogOTAsIGc6IDE5MCwgYjogMTQ4IH0sXG4gICAgeyB4OiA1NzYsIHk6IDQyLCByOiAxNDgsIGc6IDIwMywgYjogMTczIH0sXG4gICAgeyB4OiA1OTAsIHk6IDQ1LCByOiAxNDUsIGc6IDIwMywgYjogMTcxIH0sXG5cbiAgICAvLyBwdXJjaGFzZSBidXR0b25cbiAgICB7IHg6IDU3NiwgeTogMjc3LCByOiAyNTUsIGc6IDIyMywgYjogMCB9LFxuICAgIHsgeDogNDgwLCB5OiAyNzgsIHI6IDI1NSwgZzogMjEwLCBiOiAwIH0sXG4gICAgeyB4OiA1MDYsIHk6IDI3OCwgcjogMTIwLCBnOiA3NiwgYjogOCB9LFxuICAgIHsgeDogNTIyLCB5OiAyNzQsIHI6IDI0OSwgZzogMjQ1LCBiOiAwIH0sXG4gICAgeyB4OiA1MzgsIHk6IDI3NywgcjogMTI4LCBnOiA4MSwgYjogNyB9LFxuICBdLFxuICB7IHg6IDU4MywgeTogNDUgfSxcbiAgeyB4OiA1ODMsIHk6IDQ1IH1cbik7XG5cbmV4cG9ydCBjb25zdCBlbnRlckdhbWVQcm9tb3Rpb24gPSBuZXcgUGFnZShcbiAgJ2VudGVyR2FtZVByb21vdGlvbicsXG4gIFtcbiAgICAvLyB4XG4gICAgeyB4OiAyNzcsIHk6IDI4MCwgcjogMTEzLCBnOiAxMjQsIGI6IDE0NyB9LFxuXG4gICAgLy8gZG9udCBzaG93IHRoaXMgYWdhaW4gdG9kYXlcbiAgICB7IHg6IDI0MCwgeTogMjgwLCByOiAxMCwgZzogNywgYjogMyB9LFxuICAgIHsgeDogMjA3LCB5OiAyODEsIHI6IDM2LCBnOiAzOSwgYjogNDcgfSxcblxuICAgIC8vIGJnXG4gICAgeyB4OiAyNzksIHk6IDM2LCByOiAzLCBnOiAzLCBiOiAzIH0sXG4gICAgeyB4OiA3NiwgeTogMTY5LCByOiAwLCBnOiAyLCBiOiA1IH0sXG4gICAgeyB4OiAzMjYsIHk6IDMzNywgcjogMywgZzogMywgYjogMiB9LFxuICAgIHsgeDogNTcxLCB5OiAyMTEsIHI6IDIsIGc6IDIsIGI6IDUgfSxcbiAgXSxcbiAgeyB4OiA0ODUsIHk6IDI4MSB9LFxuICB7IHg6IDQ4NSwgeTogMjgxIH1cbik7XG5cbi8vIFRPRE86IGFkZCB0aGlzIHBhZ2Vcbi8vIGV4cG9ydCBjb25zdCBlbnRlckdhbWVQcm9tb3Rpb24gPSBuZXcgUGFnZShcbi8vICAgJ2VudGVyR2FtZVByb21vdGlvbicsXG4vLyAgIFtcblxuLy8gICBdLFxuLy8gICB7IHg6IDU4MywgeTogNDUgfSxcbi8vICAgeyB4OiA1ODMsIHk6IDQ1IH1cbi8vICk7XG5cbi8vIGEgcGFnZSB3aXRoIGEgY2xvc2UgYnRuIGJ1dCB0YWxsZXIgdGhhbiBwcm9tb3Rpb24gcGFnZVxuZXhwb3J0IGNvbnN0IGV2ZW50ID0gbmV3IFBhZ2UoXG4gICdldmVudCcsXG4gIFtcbiAgICB7IHg6IDIwLCB5OiAyMSwgcjogMjUzLCBnOiAyNTQsIGI6IDI1NCB9LFxuICAgIHsgeDogNDcsIHk6IDMyLCByOiAxMzIsIGc6IDEzNCwgYjogMTQwIH0sXG4gICAgeyB4OiA0OCwgeTogMjMsIHI6IDI0NiwgZzogMjQ3LCBiOiAyNDcgfSxcbiAgICB7IHg6IDYwMywgeTogMTksIHI6IDEyNCwgZzogMTMwLCBiOiAxMzIgfSxcbiAgICB7IHg6IDYxMiwgeTogMjIsIHI6IDQ5LCBnOiA1MiwgYjogNDkgfSxcbiAgICB7IHg6IDYyMiwgeTogMjYsIHI6IDE4MSwgZzogMTc4LCBiOiAxODEgfSxcbiAgXSxcbiAgeyB4OiA2MTEsIHk6IDIzIH0sXG4gIHsgeDogNjExLCB5OiAyMyB9XG4pO1xuXG5leHBvcnQgY29uc3QgcmV2aWV3QXBwID0gbmV3IFBhZ2UoXG4gICdyZXZpZXdBcHAnLFxuICBbXG4gICAgeyB4OiAxMDYsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTYsIHk6IDU4LCByOiA4NCwgZzogOTAsIGI6IDkzIH0sXG4gICAgeyB4OiA1MTAsIHk6IDQzLCByOiAxNjgsIGc6IDE3NiwgYjogMTc2IH0sXG4gICAgeyB4OiA1MjUsIHk6IDU3LCByOiAxNDMsIGc6IDE0NCwgYjogMTQ0IH0sXG4gICAgeyB4OiAzMDUsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzMzgsIHk6IDYxLCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAxMTQsIHk6IDMwMSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMTUzLCB5OiAyOTcsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAxNzgsIHk6IDI5OSwgcjogMTY4LCBnOiAxOTAsIGI6IDIyNCB9LFxuICAgIHsgeDogMjQxLCB5OiAyOTgsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDI4NSwgeTogMzA1LCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMzA4LCB5OiAzMDIsIHI6IDc5LCBnOiAxMDgsIGI6IDE0NSB9LFxuICAgIHsgeDogMzY1LCB5OiAzMDIsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQyMSwgeTogMjk5LCByOiA4LCBnOiAxMTQsIGI6IDI1NSB9LFxuICAgIHsgeDogNDM4LCB5OiAyOTksIHI6IDQ3LCBnOiAxMzgsIGI6IDI1NCB9LFxuICAgIHsgeDogNDg5LCB5OiAzMDEsIHI6IDgsIGc6IDExMywgYjogMjU1IH0sXG4gICAgeyB4OiA1MjgsIHk6IDMwNSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICBdLFxuICB7IHg6IDE2MSwgeTogMjkyIH0sXG4gIHsgeDogMTYxLCB5OiAyOTIgfVxuKTtcblxuLy8gcGFnZSBoYXMgb2sgYnV0dG9uXG5leHBvcnQgY29uc3Qgb2sgPSBuZXcgUGFnZShcbiAgJ29rJyxcbiAgW1xuICAgIHsgeDogMjc5LCB5OiAzMDAsIHI6IDAsIGc6IDExMywgYjogMjQ3IH0sXG4gICAgeyB4OiAzMTAsIHk6IDMwMSwgcjogMTM2LCBnOiAxODgsIGI6IDI1NCB9LFxuICAgIHsgeDogMzI2LCB5OiAzMDEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2MiwgeTogMzAwLCByOiAwLCBnOiAxMTMsIGI6IDI0NyB9LFxuICAgIHsgeDogMzY5LCB5OiAzMTIsIHI6IDgsIGc6IDEwMSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzE5LCB5OiAzMDMgfSxcbiAgeyB4OiAzMTksIHk6IDMwMyB9XG4pO1xuXG4vLyBwYWdlIGhhcyBuZXh0IGJ1dHRvblxuZXhwb3J0IGNvbnN0IG5leHQgPSBuZXcgUGFnZShcbiAgJ25leHQnLFxuICBbXG4gICAgeyB4OiAyNzMsIHk6IDMwNCwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMwNSwgeTogMzA3LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMTQsIHk6IDMxNCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIxLCB5OiAzMDUsIHI6IDIyNCwgZzogMjM2LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMyOCwgeTogMzEwLCByOiAxLCBnOiAxMDYsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMzLCB5OiAyOTksIHI6IDgsIGc6IDEyNSwgYjogMjU1IH0sXG4gICAgeyB4OiAzNzQsIHk6IDMwNSwgcjogOCwgZzogMTE3LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM4MCwgeTogMzE5LCByOiAwLCBnOiA4OSwgYjogMjQ3IH0sXG4gICAgeyB4OiAyNjUsIHk6IDMxOCwgcjogMCwgZzogODksIGI6IDI0NyB9LFxuICBdLFxuICB7IHg6IDM0NiwgeTogMzA3IH0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfVxuKTtcblxuZXhwb3J0IGNvbnN0IG5leHQyID0gbmV3IFBhZ2UoXG4gICduZXh0JyxcbiAgW1xuICAgIHsgeDogMjI2LCB5OiAyOTYsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDI3NSwgeTogMjk2LCByOiA4LCBnOiAxMjEsIGI6IDI1NSB9LFxuICAgIHsgeDogMzA2LCB5OiAyOTksIHI6IDI1NCwgZzogMjU0LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNCwgeTogMzAzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAzMjEsIHk6IDI5OSwgcjogMjAxLCBnOiAyMjMsIGI6IDI1NSB9LFxuICAgIHsgeDogMzMxLCB5OiAyOTksIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzEwLCByOiAwLCBnOiA5NCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzQ2LCB5OiAzMDcgfSxcbiAgeyB4OiAzNDYsIHk6IDMwNyB9XG4pO1xuXG4vLyBub24tc3BlY2lmaWMgY29uZmlybSBwYWdlIHdpdGggbm8gYW5kIHllcyBidG5cbmV4cG9ydCBjb25zdCBjb25maXJtV2l0aFlTID0gbmV3IFBhZ2UoXG4gICdjb25maXJtV2l0aFlTJyxcbiAgW1xuICAgIC8vIHggb24gcmlnaHQgdG9wXG4gICAgeyB4OiA1MTMsIHk6IDQ2LCByOiAxODIsIGc6IDE4NiwgYjogMTg4IH0sXG4gICAgeyB4OiA1MjAsIHk6IDUyLCByOiA3MCwgZzogNjksIGI6IDcwIH0sXG4gICAgeyB4OiA1MjcsIHk6IDQ1LCByOiA2NywgZzogNjgsIGI6IDcwIH0sXG4gICAgeyB4OiA1MzEsIHk6IDU0LCByOiAxNzQsIGc6IDE3NSwgYjogMTc2IH0sXG4gICAgeyB4OiA1MTEsIHk6IDUxLCByOiAxNzgsIGc6IDE4MCwgYjogMTg2IH0sXG5cbiAgICAvLyBubyBidG5cbiAgICB7IHg6IDIxMiwgeTogMzAxLCByOiA0OSwgZzogODUsIGI6IDEyMyB9LFxuICAgIHsgeDogMjQ5LCB5OiAzMDAsIHI6IDEyNSwgZzogMTUyLCBiOiAxODggfSxcbiAgICB7IHg6IDI3OCwgeTogMzA3LCByOiA0OSwgZzogODEsIGI6IDEyMyB9LFxuXG4gICAgLy8geWVzIGJ0blxuICAgIHsgeDogMzYzLCB5OiAyOTQsIHI6IDgsIGc6IDEyMiwgYjogMjU1IH0sXG4gICAgeyB4OiAzODQsIHk6IDI5NywgcjogMjQ0LCBnOiAyNDgsIGI6IDI1NSB9LFxuICAgIHsgeDogNDE5LCB5OiAzMDcsIHI6IDAsIGc6IDEwMSwgYjogMjQ3IH0sXG4gICAgeyB4OiAzOTUsIHk6IDI5NCwgcjogOCwgZzogMTIyLCBiOiAyNTUgfSxcblxuICAgIC8vIGZvb3RlciBiZ1xuICAgIHsgeDogMTQyLCB5OiAzMDQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUzMCwgeTogMjk2LCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogNTIwLCB5OiA1NiB9LCAvLyB4IGJ0blxuICB7IHg6IDUyMCwgeTogNTYgfVxuKTtcblxuLy8gbmVlZCB0byB1cGRhdGUgYXBrIHZlclxuZXhwb3J0IGNvbnN0IGVycm9yTmV3VXBkYXRlQXZhaWxhYmxlID0gbmV3IFBhZ2UoXG4gICdlcnJvck5ld1VwZGF0ZUF2YWlsYWJsZScsXG4gIFtcbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjA4LCB5OiA0NSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMjM2LCB5OiA1OCwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMjYwLCB5OiA1OCwgcjogMTI1LCBnOiAxMjksIGI6IDEzMyB9LFxuICAgIHsgeDogMjcyLCB5OiA1NywgcjogMTI4LCBnOiAxMzYsIGI6IDE0MCB9LFxuICAgIHsgeDogMzEzLCB5OiA1NiwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzM1LCB5OiA1NiwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzYzLCB5OiA2MCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogMzgxLCB5OiA2MSwgcjogMTYsIGc6IDI0LCBiOiAyNCB9LFxuICAgIHsgeDogMzg4LCB5OiA2MywgcjogMTI2LCBnOiAxMzEsIGI6IDEzNCB9LFxuICAgIHsgeDogMzk3LCB5OiA2MywgcjogNTcsIGc6IDY0LCBiOiA3MCB9LFxuICAgIHsgeDogNDA3LCB5OiA1NCwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIHsgeDogNDE5LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuICAgIC8vIG5ldyB1cGRhdGUgaW4gY29udGVudCAoMTA0KVxuICAgIHsgeDogMjI3LCB5OiAxMzksIHI6IDE3NiwgZzogMTc4LCBiOiAxODQgfSxcbiAgICB7IHg6IDI4OSwgeTogMTQ0LCByOiAxMTcsIGc6IDEyMSwgYjogMTIxIH0sXG4gICAgeyB4OiAyNjAsIHk6IDE0NCwgcjogMTA4LCBnOiAxMTAsIGI6IDEwOCB9LFxuICAgIHsgeDogMzA5LCB5OiAxNDQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMyNiwgeTogMTQyLCByOiA4NywgZzogOTEsIGI6IDkwIH0sXG4gICAgeyB4OiAzNDMsIHk6IDE0MywgcjogODMsIGc6IDg4LCBiOiA4OCB9LFxuICAgIHsgeDogMzc2LCB5OiAxNDQsIHI6IDY5LCBnOiA3MSwgYjogNjkgfSxcbiAgICB7IHg6IDM5NSwgeTogMTQ0LCByOiA2OCwgZzogNzIsIGI6IDcxIH0sXG4gICAgeyB4OiA0MDksIHk6IDE0NCwgcjogMTIyLCBnOiAxMjMsIGI6IDEyNSB9LFxuICAgIHsgeDogNDIxLCB5OiAxNDQsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcblxuICAgIC8vIG9rXG4gICAgeyB4OiAyODUsIHk6IDI5NywgcjogOCwgZzogMTE4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxMiwgeTogMjk0LCByOiA4LCBnOiAxMjUsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAyOTksIHI6IDEzNSwgZzogMTg4LCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzA3LCByOiAwLCBnOiAxMDIsIGI6IDI0NyB9LFxuXG4gICAgLy8gcG9wdXAgYmcgYW5kIHhcbiAgICB7IHg6IDExNywgeTogNDYsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUxMiwgeTogNDYsIHI6IDE4OCwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUyNCwgeTogNTcsIHI6IDE4OSwgZzogMTg5LCBiOiAxODkgfSxcbiAgICB7IHg6IDE1NywgeTogMjMyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyMDksIHk6IDI5NiwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDIzLCB5OiAzMDQsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQ0MywgeTogMjI3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gIF0sXG4gIC8vIFRPRE86IGNoZWNrIHdoZXRoZXIgbmVlZCB0byBwcmVzcyBva1xuICB7IHg6IDMxNCwgeTogMjk5IH0sXG4gIHsgeDogMzE0LCB5OiAyOTkgfVxuKTtcblxuLy8gZm9yIHNvbWUgc2l0dWF0aW9uLCB1bmV4cGVjdGVkRXJyb3IgaGFwcGVuc1xuLy8gdGhpcyBhbHNvIGluY2x1ZGVzIG5ldHdvcmsgZXJyb3JcbmV4cG9ydCBjb25zdCB1bmV4cGVjdGVkRXJyb3IgPSBuZXcgUGFnZShcbiAgJ3VuZXhwZWN0ZWRFcnJvcicsXG4gIFtcbiAgICB7IHg6IDMyMywgeTogMzksIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDUxNCwgeTogNDQsIHI6IDgwLCBnOiA4MSwgYjogODEgfSxcbiAgICB7IHg6IDUyNCwgeTogNDgsIHI6IDY0LCBnOiA3MCwgYjogNzEgfSxcbiAgICB7IHg6IDUxOCwgeTogNTQsIHI6IDY1LCBnOiA3MSwgYjogNzEgfSxcbiAgICB7IHg6IDMxNSwgeTogMjY5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMTUsIHk6IDI5MywgcjogOCwgZzogMTI1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDMxNiwgeTogMjk5LCByOiAyNDEsIGc6IDI0NywgYjogMjU1IH0sXG4gICAgeyB4OiAzMTcsIHk6IDMxMCwgcjogMCwgZzogOTIsIGI6IDI0NSB9LFxuICAgIHsgeDogMzE3LCB5OiAzMTMsIHI6IDAsIGc6IDg1LCBiOiAyNDAgfSxcbiAgICB7IHg6IDMxNywgeTogMzIzLCByOiAyMjIsIGc6IDIxOSwgYjogMjIyIH0sXG4gIF0sXG4gIHsgeDogMzE0LCB5OiAyOTkgfSxcbiAgeyB4OiAzMTQsIHk6IDI5OSB9XG4pO1xuXG5leHBvcnQgY29uc3QgYXBwSXNOb3RSZXNwb25kaW5nID0gbmV3IFBhZ2UoXG4gICdhcHBJc05vdFJlc3BvbmRpbmcnLFxuICBbXG4gICAgeyB4OiAxNjQsIHk6IDE1NCwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMTg5LCB5OiAxNTcsIHI6IDIwMywgZzogMjAzLCBiOiAyMDMgfSxcbiAgICB7IHg6IDIyMywgeTogMTU4LCByOiAxNzEsIGc6IDE3MSwgYjogMTcxIH0sXG4gICAgeyB4OiAyNTQsIHk6IDE1OCwgcjogNDgsIGc6IDQ4LCBiOiA0OCB9LFxuICAgIHsgeDogMjczLCB5OiAxNTcsIHI6IDk2LCBnOiA5NiwgYjogOTYgfSxcbiAgICB7IHg6IDMwMiwgeTogMTU3LCByOiA1NCwgZzogNTQsIGI6IDU0IH0sXG4gICAgeyB4OiAxNjgsIHk6IDE4NSwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICAgIHsgeDogMjA1LCB5OiAxOTAsIHI6IDExOSwgZzogMTE5LCBiOiAxMTkgfSxcbiAgICB7IHg6IDIxOCwgeTogMTg0LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAyMzAsIHk6IDE4NiwgcjogODUsIGc6IDg1LCBiOiA4NSB9LFxuICAgIHsgeDogMTcwLCB5OiAyMTEsIHI6IDEyNywgZzogMjAyLCBiOiAxOTUgfSxcbiAgICB7IHg6IDIxMCwgeTogMjEzLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gICAgeyB4OiAxOTksIHk6IDIxMywgcjogMTExLCBnOiAxMTEsIGI6IDExMSB9LFxuICAgIHsgeDogNDY2LCB5OiAxNjYsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgICB7IHg6IDQ2OSwgeTogMjE4LCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMjIwLCB5OiAxODYgfSwgLy8gY2xvc2UgYXBwXG4gIHsgeDogMjIwLCB5OiAxODYgfVxuKTtcblxuLy8gd2l0aCBtb3JlIGdhbWVzIGJ1dHRvblxuZXhwb3J0IGNvbnN0IHF1aXRBcHAgPSBuZXcgUGFnZShcbiAgJ3F1aXRBcHAnLFxuICBbXG4gICAgeyB4OiAyNzksIHk6IDU0LCByOiAxNzAsIGc6IDE3MywgYjogMTc4IH0sXG4gICAgeyB4OiAzMjQsIHk6IDYwLCByOiAyMCwgZzogMjcsIGI6IDI4IH0sXG4gICAgeyB4OiA1MTQsIHk6IDUwLCByOiAxODEsIGc6IDE4MiwgYjogMTgyIH0sXG4gICAgeyB4OiA0NjYsIHk6IDI5NSwgcjogOCwgZzogMTIxLCBiOiAyNTUgfSxcbiAgICB7IHg6IDQxNCwgeTogMjk4LCByOiA5NCwgZzogMTU3LCBiOiAyMzMgfSxcbiAgICB7IHg6IDQ5NiwgeTogMzEyLCByOiAwLCBnOiA5MCwgYjogMjQ3IH0sXG4gICAgeyB4OiA1MjMsIHk6IDMwOSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMTExLCB5OiAyOTcsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDMwNywgeTogNjAsIHI6IDEzMywgZzogMTM3LCBiOiAxNDEgfSxcbiAgICB7IHg6IDMxNSwgeTogNjEsIHI6IDE4MSwgZzogMTg2LCBiOiAxODkgfSxcbiAgICB7IHg6IDMyNCwgeTogNjEsIHI6IDUyLCBnOiA1NiwgYjogNjEgfSxcbiAgXSxcbiAgeyB4OiAzMDAsIHk6IDMwMyB9LCAvLyBub3QgdG8gcXVpdFxuICB7IHg6IDMwMCwgeTogMzAzIH1cbik7XG5cbmV4cG9ydCBjb25zdCBxdWl0QXBwMSA9IG5ldyBQYWdlKFxuICAncXVpdEFwcDEnLFxuICBbXG4gICAgeyB4OiAyNjIsIHk6IDU2LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzMDAsIHk6IDU0LCByOiAxNiwgZzogMjQsIGI6IDI0IH0sXG4gICAgeyB4OiAzMjMsIHk6IDU1LCByOiAyNCwgZzogMzAsIGI6IDMyIH0sXG4gICAgeyB4OiA1MTEsIHk6IDUwLCByOiAxNzgsIGc6IDE4MCwgYjogMTg2IH0sXG4gICAgeyB4OiA1MjIsIHk6IDU0LCByOiAxNDEsIGc6IDEzOSwgYjogMTQxIH0sXG4gICAgeyB4OiA1MjIsIHk6IDU0LCByOiAxNDEsIGc6IDEzOSwgYjogMTQxIH0sXG4gICAgeyB4OiAxNjcsIHk6IDI5OSwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMjQzLCB5OiAyOTUsIHI6IDQ5LCBnOiA4NSwgYjogMTIzIH0sXG4gICAgeyB4OiAzMTgsIHk6IDI5OCwgcjogMjIyLCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogMzgyLCB5OiAyOTcsIHI6IDgzLCBnOiAxNTgsIGI6IDI1NSB9LFxuICAgIHsgeDogNTAzLCB5OiAzMDEsIHI6IDIyMiwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDQzMywgeTogMzEwLCByOiAwLCBnOiA5NCwgYjogMjQ3IH0sXG4gICAgeyB4OiA0MDQsIHk6IDMwMSwgcjogOCwgZzogMTEzLCBiOiAyNTUgfSxcbiAgICB7IHg6IDIxMywgeTogMzA3LCByOiA0OSwgZzogODEsIGI6IDEyMyB9LFxuICBdLFxuICB7IHg6IDIxMywgeTogMzA3IH0sIC8vIG5vdCB0byBxdWl0XG4gIHsgeDogMjEzLCB5OiAzMDcgfVxuKTtcbiIsImV4cG9ydCBlbnVtIFRBU0sge1xuICByZXN0YXJ0QXBwUGVyRGF5ID0gJ3Jlc3RhcnRBcHBQZXJEYXknLFxuICBzZXR0aW5nRGVmYXVsdCA9ICdzZXR0aW5nRGVmYXVsdCcsXG4gIHNldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzID0gJ3NldHRpbmdSZXNldExlYWd1ZVByb2dyZXNzJyxcbiAgcGxheUxlYWd1ZUdhbWUgPSAncGxheUxlYWd1ZUdhbWUnLFxuICBwbGF5QmF0dGxlR2FtZSA9ICdwbGF5QmF0dGxlR2FtZScsXG4gIGFkUmV3YXJkID0gJ2FkUmV3YXJkJyxcbiAgd2Vla2x5TWlzc2lvbiA9ICd3ZWVrbHlNaXNzaW9uJyxcbiAgcmVjaWV2ZUluYm94ID0gJ3JlY2lldmVJbmJveCcsXG4gIHN0YXlJbkxvZ2luID0gJ3N0YXlJbkxvZ2luJyxcbiAgdXBsb2FkQ2FjaGUgPSAndXBsb2FkQ2FjaGUnLFxuICBzZW5kQWxpdmVFdmVudCA9ICdzZW5kQWxpdmVFdmVudCcsXG4gIHNlbmRXYWl0RXZlbnQgPSAnc2VuZFdhaXRFdmVudCcsXG59XG5cbmV4cG9ydCAqIGFzIHdlZWtseU1pc3Npb24gZnJvbSAnLi93ZWVrbHlNaXNzaW9uJztcbiIsImltcG9ydCB7IFV0aWxzLCBQYWdlIH0gZnJvbSAnUmVyb3V0ZXInO1xuaW1wb3J0IHsgc3RhdGUsIHJlcm91dGVyIH0gZnJvbSAnLi4vbW9kdWxlcyc7XG5cbmltcG9ydCB7IFRBU0sgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNTYW1lQ29sb3IgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYXNrKCkge1xuICByZXJvdXRlci5hZGRUYXNrKHtcbiAgICBuYW1lOiBUQVNLLndlZWtseU1pc3Npb24sXG4gICAgLy8gbWF4VGFza1J1blRpbWVzOiAxLFxuICAgIG1pblJvdW5kSW50ZXJ2YWw6IENPTlNUQU5UUy5kYXlJbk1zLFxuICAgIG1heFRhc2tEdXJpbmc6IDMwICogQ09OU1RBTlRTLm1pbnV0ZUluTXMsXG4gICAgZm9yY2VTdG9wOiB0cnVlLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJvdXRlcygpIHtcbiAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgIHBhdGg6IGAvJHthY2hpZXZlbWVudE1pc3Npb24ubmFtZX1gLFxuICAgIG1hdGNoOiBhY2hpZXZlbWVudE1pc3Npb24sXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UpID0+IHtcbiAgICAgIHN0YXRlLmNoZWNrVXBsb2FkU2Vzc2lvbigpO1xuICAgICAgaWYgKGNvbnRleHQudGFzay5uYW1lICE9PSBUQVNLLndlZWtseU1pc3Npb24pIHtcbiAgICAgICAgcmVyb3V0ZXIuZ29CYWNrKGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGNvbGxlY3QgZGFpbHkgb25lIGlmIGF2YWlsYWJsZVxuICAgICAgY29uc3QgeCA9IDYxMztcbiAgICAgIGNvbnN0IGNhbkNvbGxlY3RDb2xvciA9IHsgcjogOCwgZzogMTI1LCBiOiAyNTUgfTtcbiAgICAgIGZvciAobGV0IHkgPSAxMjg7IHkgPCAyNjA7IHkgKz0gNDQpIHtcbiAgICAgICAgY29uc3QgY2FuQ29sbGVjdCA9IGlzU2FtZUNvbG9yKGltYWdlLCB7IHgsIHksIC4uLmNhbkNvbGxlY3RDb2xvciB9KTtcbiAgICAgICAgaWYgKGNhbkNvbGxlY3QpIHtcbiAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeCwgeSB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY29sbGVjdCcpO1xuICAgICAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVyb3V0ZXIuZ29OZXh0KGFjaGlldmVtZW50TWlzc2lvbik7XG4gICAgfSxcbiAgfSk7XG4gIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICBwYXRoOiBgLyR7d2Vla2x5TWlzc2lvbkJveC5uYW1lfWAsXG4gICAgbWF0Y2g6IHdlZWtseU1pc3Npb25Cb3gsXG4gICAgYWN0aW9uOiAoY29udGV4dCwgaW1hZ2UsIG1hdGNoZWQsIGZpbmlzaFJvdW5kKSA9PiB7XG4gICAgICBzdGF0ZS5jaGVja1VwbG9hZFNlc3Npb24oKTtcbiAgICAgIGlmIChjb250ZXh0LnRhc2submFtZSAhPT0gVEFTSy53ZWVrbHlNaXNzaW9uKSB7XG4gICAgICAgIHJlcm91dGVyLmdvQmFjayh3ZWVrbHlNaXNzaW9uQm94KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW5Db2xsZWN0Q29sb3IgPSB7IHI6IDE4OSwgZzogMTk0LCBiOiAxOTcgfTtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IFsyNywgMTE1XTtcbiAgICAgIGNvbnN0IFt3LCBoXSA9IFsxOTgsIDc1XTtcbiAgICAgIC8vIGNsaWNrIG9wZW5Cb3ggb25seSB3aGVuIGFsbCBtaXNzaW9uIGlzIGNvbXBsZXRlXG4gICAgICAvLyBiYyBpdCBpcyBhYmxlZCBvbmNlIGEgd2Vla1xuICAgICAgZm9yICh2YXIgZHggPSAwOyBkeCA8IDMgKiB3OyBkeCArPSB3KSB7XG4gICAgICAgIGZvciAodmFyIGR5ID0gMDsgZHkgPCAzICogaDsgZHkgKz0gaCkge1xuICAgICAgICAgIGNvbnN0IGNhbkNvbGxlY3QgPSBpc1NhbWVDb2xvcihpbWFnZSwgeyB4OiB4ICsgZHgsIHk6IHkgKyBkeSwgLi4uY2FuQ29sbGVjdENvbG9yIH0pO1xuICAgICAgICAgIGlmICghY2FuQ29sbGVjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhaXQgYWxsIHdlZWtseSBtaXNzaW9uIGNvbXBsZXRlJyk7XG4gICAgICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgICAgIHN0YXRlLm9uUnVubmluZygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnY2xpY2sgb3BlbicpO1xuICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh3ZWVrbHlNaXNzaW9uQm94QnRucy5vcGVuQm94KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIC8vIFRPRE86IGxldCB1c2VyIHNlbGVjdCB0aGUgaXRlbSB0aGV5IHdhbnQgaW4gdGhlIGZ1dHVyZVxuICAgICAgLy8gc2VsZWN0IHRoZSBsZWZ0IGJvdHRvbSBvbmVcbiAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3QgcmlnaHQgYm90dG9tIGl0ZW0nKTtcbiAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoeyB4OiB4ICsgMiAqIHcsIHk6IHkgKyAyICogaCB9KTtcbiAgICAgIFV0aWxzLnNsZWVwKENPTlNUQU5UUy5zbGVlcE1lZGl1bSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlIHJpZ2h0IGJvdHRvbSBpdGVtJyk7XG4gICAgICByZXJvdXRlci5zY3JlZW4udGFwKHdlZWtseU1pc3Npb25Cb3hCdG5zLnJlY2VpdmVSZXdhcmQpO1xuXG4gICAgICAvLyBlbnRlciByZWNlaXZlIGNvbmZpcm0gcGFnZVxuICAgICAgZmluaXNoUm91bmQodHJ1ZSk7XG4gICAgICBzdGF0ZS5vblJ1bm5pbmcoKTtcbiAgICB9LFxuICB9KTtcblxuICBbd2Vla2x5TWlzc2lvbkJveENvbmZpcm0sIHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZF0uZm9yRWFjaChwID0+IHtcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7cC5uYW1lfWAsXG4gICAgICBtYXRjaDogcCxcbiAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgfSk7XG4gIH0pO1xufVxuXG5jb25zdCBhY2hpZXZlbWVudE1pc3Npb24gPSBuZXcgUGFnZShcbiAgJ2FjaGlldmVtZW50TWlzc2lvbicsXG4gIFtcbiAgICAvLyB0b2RheSBtaXNzaW9uIGJnXG4gICAgeyB4OiAyMzUsIHk6IDU1LCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiAyMzEsIHk6IDcxLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG4gICAgeyB4OiA1ODgsIHk6IDcyLCByOiAyNDcsIGc6IDI0NywgYjogMjQ3IH0sXG5cbiAgICAvLyBsZWZ0IHNlY3Rpb24gd29ybGQgcmVjb3JkIGJnIGxlZnQgYm90dG9tXG4gICAgeyB4OiAxNiwgeTogMjkzLCByOiAyNSwgZzogNDAsIGI6IDc0IH0sXG5cbiAgICAvLyBwbGF5ZXIgaGVhZFxuICAgIHsgeDogNzUsIHk6IDg4LCByOiA2NiwgZzogNTksIGI6IDkwIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgeyB4OiAzMSwgeTogMzE2LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNTgwLCB5OiAyNzggfSwgLy8gY29tcGxldGUgd2Vla2x5IG1pc3Npb24gYm94XG4gIHsgeDogNDEsIHk6IDMyMCB9XG4pO1xuXG5jb25zdCB3ZWVrbHlNaXNzaW9uQm94ID0gbmV3IFBhZ2UoXG4gICd3ZWVrbHlNaXNzaW9uQm94JyxcbiAgW1xuICAgIC8vIG5hdiBiYXIgcmlnaHQgcGFydCAocCwgc3RhciAuLi4pXG4gICAgeyB4OiAyOTksIHk6IDEzLCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiAzMTgsIHk6IDksIHI6IDIzOCwgZzogMjM0LCBiOiAyMzggfSxcbiAgICB7IHg6IDMxMywgeTogOSwgcjogMjM4LCBnOiAyMzQsIGI6IDIzOCB9LFxuICAgIHsgeDogMzkyLCB5OiA5LCByOiAyMzIsIGc6IDIyOSwgYjogMjMyIH0sXG4gICAgeyB4OiAzODUsIHk6IDIsIHI6IDIxNCwgZzogMjE0LCBiOiAyMTQgfSxcbiAgICB7IHg6IDQ5NiwgeTogMTMsIHI6IDIzOCwgZzogMTY2LCBiOiAxNiB9LFxuICAgIHsgeDogNDgzLCB5OiA0LCByOiAyMTQsIGc6IDIxOSwgYjogMjE2IH0sXG4gICAgeyB4OiA1OTcsIHk6IDEwLCByOiAyMTMsIGc6IDIyNiwgYjogMjM4IH0sXG4gICAgeyB4OiA2MjgsIHk6IDE0LCByOiAyMTQsIGc6IDIxMSwgYjogMjE0IH0sXG5cbiAgICAvLyBiZyBvZiB0YWJsZVxuICAgIHsgeDogMTQsIHk6IDgyLCByOiAzMywgZzogMzIsIGI6IDQxIH0sXG4gICAgeyB4OiAxNiwgeTogMjg4LCByOiAzMywgZzogNDQsIGI6IDU4IH0sXG4gICAgeyB4OiA2MTUsIHk6IDEwMCwgcjogMzMsIGc6IDM2LCBiOiA0MSB9LFxuICAgIHsgeDogNjEzLCB5OiAyODMsIHI6IDMzLCBnOiA0NCwgYjogNTggfSxcblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvb3RlclxuICAgIHsgeDogODAsIHk6IDMwNywgcjogMjAyLCBnOiAyMDEsIGI6IDE5NiB9LFxuICAgIHsgeDogODksIHk6IDMxNSwgcjogNDksIGc6IDYxLCBiOiAzNCB9LFxuICAgIHsgeDogMTAzLCB5OiAzMTksIHI6IDczLCBnOiA4MywgYjogNjYgfSxcbiAgICB7IHg6IDE3MiwgeTogMzM1LCByOiA3OCwgZzogODQsIGI6IDcyIH0sXG4gICAgeyB4OiAyNTAsIHk6IDMzOCwgcjogMTAxLCBnOiAxMDYsIGI6IDkzIH0sXG4gICAgeyB4OiAyNzMsIHk6IDMwNywgcjogMTU5LCBnOiAxNTksIGI6IDE0OSB9LFxuICAgIHsgeDogMjg0LCB5OiAzMDksIHI6IDU2LCBnOiA2MSwgYjogNDAgfSxcblxuICAgIC8vIGJhY2sgYnRuXG4gICAgeyB4OiAyNCwgeTogMzE0LCByOiAyMTQsIGc6IDIxNCwgYjogMjE0IH0sXG4gICAgeyB4OiA0MiwgeTogMzE3LCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gICAgeyB4OiAzMSwgeTogMzMxLCByOiAyMTQsIGc6IDIxOSwgYjogMjE0IH0sXG4gIF0sXG4gIHsgeDogNDEsIHk6IDMyMCB9LCAvLyBiYWNrIGJ0blxuICB7IHg6IDQxLCB5OiAzMjAgfVxuKTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveEJ0bnMgPSB7XG4gIG9wZW5Cb3g6IHsgeDogNDE4LCB5OiAzMjUgfSxcbiAgcmVjZWl2ZVJld2FyZDogeyB4OiA1NjEsIHk6IDMyNiB9LFxufTtcblxuY29uc3Qgd2Vla2x5TWlzc2lvbkJveENvbmZpcm0gPSBuZXcgUGFnZShcbiAgJ3dlZWtseU1pc3Npb25Cb3hDb25maXJtJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTEsIHk6IDQyLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNCwgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNTE1LCB5OiAzMDAsIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcbiAgICB7IHg6IDUxOSwgeTogMTc3LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB0aXRsZVxuICAgIHsgeDogMjQwLCB5OiA1OCwgcjogMTU1LCBnOiAxNjAsIGI6IDE2MyB9LFxuICAgIHsgeDogMjY3LCB5OiA1OCwgcjogMTQxLCBnOiAxNDcsIGI6IDE0OSB9LFxuICAgIHsgeDogMzI1LCB5OiA1OSwgcjogMTYxLCBnOiAxNjcsIGI6IDE3MCB9LFxuICAgIHsgeDogMzgzLCB5OiA1OSwgcjogMTcxLCBnOiAxNzksIGI6IDE3OSB9LFxuICAgIHsgeDogNDA3LCB5OiA1OSwgcjogMTgxLCBnOiAxODYsIGI6IDE4OSB9LFxuXG4gICAgLy8geFxuICAgIHsgeDogNTE1LCB5OiA0OSwgcjogMTg3LCBnOiAxODUsIGI6IDE4OCB9LFxuICAgIHsgeDogNTE5LCB5OiA1NSwgcjogOTEsIGc6IDkxLCBiOiA5MiB9LFxuXG4gICAgLy8gbm8gJiB5ZXMgYnRuXG4gICAgeyB4OiAyMTAsIHk6IDI5MywgcjogNDEsIGc6IDgxLCBiOiAxMjMgfSxcbiAgICB7IHg6IDIzOCwgeTogMjk2LCByOiA0NSwgZzogODEsIGI6IDEyOCB9LFxuICAgIHsgeDogMjg0LCB5OiAyOTQsIHI6IDQxLCBnOiA3OCwgYjogMTIzIH0sXG5cbiAgICB7IHg6IDM5NywgeTogMjk5LCByOiA0MCwgZzogMTM0LCBiOiAyNTMgfSxcbiAgICB7IHg6IDQzMywgeTogMzA3LCByOiA4LCBnOiA5OCwgYjogMjQ3IH0sXG4gIF0sXG4gIHsgeDogMzg3LCB5OiAzMDAgfSwgLy8geWVzIGJ0blxuICB7IHg6IDM4NywgeTogMzAwIH1cbik7XG5cbmNvbnN0IHdlZWtseU1pc3Npb25Cb3hSZWNlaXZlZCA9IG5ldyBQYWdlKFxuICAnd2Vla2x5TWlzc2lvbkJveFJlY2VpdmVkJyxcbiAgW1xuICAgIC8vIGJnXG4gICAgeyB4OiAxMTMsIHk6IDUzLCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAxMTcsIHk6IDMwNywgcjogMjE0LCBnOiAyMTksIGI6IDIyMiB9LFxuICAgIHsgeDogNDk2LCB5OiAyOTksIHI6IDIxNCwgZzogMjE5LCBiOiAyMjIgfSxcblxuICAgIC8vIHRpdGxlXG4gICAgeyB4OiAyMTcsIHk6IDU1LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAyNTksIHk6IDU1LCByOiAxNzcsIGc6IDE4MSwgYjogMTg1IH0sXG4gICAgeyB4OiAyOTgsIHk6IDU5LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG4gICAgeyB4OiAzNDEsIHk6IDYwLCByOiAxMjAsIGc6IDEyNCwgYjogMTI4IH0sXG4gICAgeyB4OiAzODYsIHk6IDU4LCByOiAxNiwgZzogMjQsIGI6IDMzIH0sXG4gICAgeyB4OiA0MDcsIHk6IDU4LCByOiAxODEsIGc6IDE4NiwgYjogMTg5IH0sXG5cbiAgICAvLyB4XG4gICAgeyB4OiA1MTIsIHk6IDQ3LCByOiAxODEsIGc6IDE4NiwgYjogMTgyIH0sXG4gICAgeyB4OiA1MTksIHk6IDUzLCByOiA3MSwgZzogNzAsIGI6IDcxIH0sXG5cbiAgICAvLyBvayBidG5cbiAgICB7IHg6IDI4OCwgeTogMjk3LCByOiA4LCBnOiAxMjIsIGI6IDI1NSB9LFxuICAgIHsgeDogMzIwLCB5OiAzMDAsIHI6IDEzNiwgZzogMTkwLCBiOiAyNTUgfSxcbiAgICB7IHg6IDM2NCwgeTogMzAxLCByOiA4LCBnOiAxMTQsIGI6IDI0OCB9LFxuICBdLFxuICB7IHg6IDMyMCwgeTogMzAwIH0sIC8vIG9rIGJ0blxuICB7IHg6IDMyMCwgeTogMzAwIH1cbik7XG4iLCJpbXBvcnQgeyBVdGlscywgUGFnZSB9IGZyb20gJ1Jlcm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNhdmVQYWdlUmVmZXJlbmNlKGltZzogSW1hZ2UsIHBhZ2U6IFBhZ2UpIHtcbiAgY29uc3QgeyBuYW1lLCBwb2ludHMgfSA9IHBhZ2U7XG4gIGNvbnN0IGZpbGVwYXRoID0gYC9zZGNhcmQvUGljdHVyZXMvU2NyZWVuc2hvdHMvcm9ib3Rtb24vbWxiLyR7bmFtZX0ucG5nYDtcblxuICBjb25zdCByZXMgPSBleGVjdXRlKGB0ZXN0IC1lICR7ZmlsZXBhdGh9ICYmIGVjaG8gMWApO1xuICBjb25zb2xlLmxvZyhyZXMpO1xuICBpZiAocmVzID09PSAnMScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByYWRpdXMgPSAzO1xuICBjb25zdCByZ2JhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyNTUsIDIwLCAxNDcsIDBdO1xuICBmb3IgKGNvbnN0IHsgeCwgeSB9IG9mIHBvaW50cykge1xuICAgIGRyYXdDaXJjbGUoaW1nLCB4LCB5LCByYWRpdXMsIC4uLnJnYmEpO1xuICB9XG4gIHNhdmVJbWFnZShpbWcsIGZpbGVwYXRoKTtcbiAgY29uc29sZS5sb2coYFtTYXZlUGFnZVJlZmVyZW5jZV06ICR7bmFtZX1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgY29tbWFuZCBvZiBjb21tYW5kcykge1xuICAgIGNvbnN0IHJlcyA9IGV4ZWN1dGUoY29tbWFuZCk7XG4gICAgaWYgKGVuZHNXaXRoKHJlcywgJ2V4aXQgc3RhdHVzIDEnKSkge1xuICAgICAgY29uc29sZS5sb2coYFtFcnJvcl06ICR7Y29tbWFuZH0gOlxcbiAke3Jlc31cXG5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5sb2coYFtPa106ICR7Y29tbWFuZH0gOlxcbiAke3Jlc31cXG5gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBbT2tdOiAke2NvbW1hbmR9YCk7XG4gICAgfVxuICAgIHJlc3VsdHMucHVzaChyZXMpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kc1dpdGgoc3RyOiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBzdHIuaW5kZXhPZihzdWZmaXgsIHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUZpbmQ8VD4oYXJyOiBUW10sIGNvbmRpdGlvbjogKGVsOiBUKSA9PiBib29sZWFuKTogVCB8IHVuZGVmaW5lZCB7XG4gIGZvciAoY29uc3QgZWwgb2YgYXJyKSB7XG4gICAgaWYgKGNvbmRpdGlvbihlbCkpIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2FtZUNvbG9yKGltYWdlOiBJbWFnZSB8IFJHQiwgdGFyZ2V0OiBYWVJHQiB8IFJHQiwgdGhyZXM6IG51bWJlciA9IDAuOCk6IGJvb2xlYW4ge1xuICBsZXQgaW1hZ2VSR0I6IFJHQiB8IHVuZGVmaW5lZDtcbiAgaWYgKCdyJyBpbiBpbWFnZSkge1xuICAgIC8vIGltYWdlIGlzIFJHQlxuICAgIGltYWdlUkdCID0gaW1hZ2U7XG4gIH0gZWxzZSBpZiAoJ3gnIGluIHRhcmdldCkge1xuICAgIC8vIGltYWdlIGlzIEltYWdlLCB0YXJnZXQgaXMgWFlSR0JcbiAgICBpbWFnZVJHQiA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHRhcmdldC54LCB0YXJnZXQueSk7XG4gIH1cblxuICBpZiAoaW1hZ2VSR0IgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGFyZ2V0IGlzIG5vdCBYWVJHQicpO1xuICB9XG5cbiAgY29uc3Qgc2NvcmUgPSBVdGlscy5pZGVudGl0eUNvbG9yKGltYWdlUkdCLCB0YXJnZXQpO1xuICByZXR1cm4gc2NvcmUgPiB0aHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbG9yQ291bnRJblJhbmdlKGltYWdlOiBJbWFnZSwgbGVmdFRvcDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCByaWdodEJvdHRvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KTogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9IHtcbiAgY29uc3QgY250OiB7IFtjb2xvcjogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgY29uc3QgeyB4OiB4MSwgeTogeTEgfSA9IGxlZnRUb3A7XG4gIGNvbnN0IHsgeDogeDIsIHk6IHkyIH0gPSByaWdodEJvdHRvbTtcbiAgZm9yIChsZXQgeCA9IHgxOyB4IDw9IHgyOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xuICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBnZXRJbWFnZUNvbG9yKGltYWdlLCB4LCB5KTtcbiAgICAgIGNvbnN0IGNvbG9yID0gYCR7cn0tJHtnfS0ke2J9YDtcbiAgICAgIGlmIChjbnRbY29sb3JdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY250W2NvbG9yXSA9IDA7XG4gICAgICB9XG4gICAgICBjbnRbY29sb3JdKys7XG4gICAgfVxuICB9XG4gIHJldHVybiBjbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVDb2xvckNvdW50KGNudDE6IHsgW2NvbG9yOiBzdHJpbmddOiBudW1iZXIgfSwgY250MjogeyBbY29sb3I6IHN0cmluZ106IG51bWJlciB9KTogYm9vbGVhbiB7XG4gIGNvbnN0IGtleXMxID0gT2JqZWN0LmtleXMoY250MSk7XG4gIGNvbnN0IGtleXMyID0gT2JqZWN0LmtleXMoY250Mik7XG4gIGlmIChrZXlzMS5sZW5ndGggIT09IGtleXMyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzMSkge1xuICAgIGlmIChjbnQxW2tleV0gIT09IGNudDJba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTEI5SSB9IGZyb20gJy4vc3JjJztcblxubGV0IG1sYjlpOiBNTEI5SSB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydChqc29uQ29uZmlnOiBhbnkpIHtcbiAgbWxiOWkgPSBuZXcgTUxCOUkoanNvbkNvbmZpZyk7XG4gIG1sYjlpLnN0YXJ0KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RvcCgpIHtcbiAgaWYgKG1sYjlpID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbWxiOWkuc3RvcCgpO1xuICBtbGI5aSA9IHVuZGVmaW5lZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHt9XG59XG4od2luZG93IGFzIGFueSkuc3RhcnQgPSBzdGFydDtcbih3aW5kb3cgYXMgYW55KS5zdG9wID0gc3RvcDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
function start(jsonConfig){window.start(jsonConfig);}
function stop(){window.stop();}

