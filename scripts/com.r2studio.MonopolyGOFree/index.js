var window = window || {};

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/Rerouter/dist/index.js":
/*!*********************************************!*\
  !*** ./node_modules/Rerouter/dist/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var writeFileTmp = writeFile;
// @ts-ignore
writeFile = function (path, content) {
    var rtn = writeFileTmp(path, content);
    execute("chmod 777 ".concat(path));
    return rtn;
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/rerouter.js":
/*!****************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/rerouter.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
__webpack_require__(/*! core-js/es/object/assign */ "./node_modules/core-js/es/object/assign.js");
__webpack_require__(/*! core-js/es/array/find-index */ "./node_modules/core-js/es/array/find-index.js");
var Rerouter = /** @class */ (function () {
    function Rerouter() {
        this.debug = true;
        this.defaultConfig = struct_1.DefaultConfigValue;
        this.rerouterConfig = struct_1.DefaultRerouterConfig;
        this.screenConfig = struct_1.DefaultScreenConfig;
        this.screen = new screen_1.Screen(this.screenConfig);
        this.running = false;
        this.routeConflictRecord = [];
        this.routes = [];
        this.tasks = [];
        this.routeContext = null;
        this.unknownRouteAction = null;
        this.startAppRouteAction = null;
    }
    Rerouter.prototype.reset = function () {
        // NOTE: this is an another way that resets Rerouter, just leaving here for memory
        // rerouterContainer.instance = new Rerouter();
        // @ts-ignore included 'core-js/es/object/assign'
        Object.assign(this, new Rerouter());
    };
    /**
     * Recalculate some value like device width or height in screenConfig
     */
    Rerouter.prototype.init = function () {
        var _a;
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
        this.screenConfig.logScreenshotFolder = utils_1.Utils.joinPaths(this.rerouterConfig.saveImageRoot, this.rerouterConfig.deviceId);
        if ((_a = this.rerouterConfig.savePageReference) === null || _a === void 0 ? void 0 : _a.enable) {
            var folderPath = this.rerouterConfig.savePageReference.folderPath || utils_1.Utils.joinPaths(this.rerouterConfig.saveImageRoot, 'pageReference');
            this.rerouterConfig.savePageReference.folderPath = folderPath;
            execute("mkdir -p ".concat(folderPath));
        }
        // new screen if screen config changed
        this.screen = new screen_1.Screen(this.screenConfig);
    };
    /**
     * Add RouteConfig to Rerouter routes, after starting Rerouter will run over all RouteConfigs to match screen and do action
     * @param config information about how route match and route action
     */
    Rerouter.prototype.addRoute = function (config) {
        // @ts-ignore included 'core-js/es/array/find-index'
        var existingRouteIndex = this.routes.findIndex(function (route) { return route.path === config.path; });
        // If it exists, log a warning and decide what to do next
        if (existingRouteIndex !== -1) {
            this.warning("A route with the path '".concat(config.path, "' already exists. Duplicate route will not be added."));
            // Option 1: Update the existing route with the new configuration
            // this.routes[existingRouteIndex] = this.wrapRouteConfigWithDefault(config);
            // Option 2: Simply return and don't add the new route
            return;
        }
        // If it doesn't exist, push the new route
        this.routes.push(this.wrapRouteConfigWithDefault(config));
    };
    /**
     * Tell Rerouter what to do if not matching any route
     * @param action function to do if not matching
     */
    Rerouter.prototype.addUnknownAction = function (action) {
        this.unknownRouteAction = action;
    };
    Rerouter.prototype.addStartAppAction = function (action) {
        this.startAppRouteAction = action;
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
        releaseImage(image);
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
        var _a, _b, _c, _d, _e;
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
                    if (this.startAppRouteAction !== null) {
                        this.startAppRouteAction(context, finishRoundFunc);
                    }
                    continue;
                }
            }
            var rotation = this.screen.getRotation();
            var image = this.screen.getCvtDevScreenshot();
            var matches = this.findMatchedRouteImpl(task.name, image, rotation);
            var matchedRoute = (_c = matches[0]) === null || _c === void 0 ? void 0 : _c.matchedRoute;
            var matchedPages = (_d = matches[0]) === null || _d === void 0 ? void 0 : _d.matchedPages;
            // context.matchStartTS = 0 if init run
            context.matchStartTS = context.matchStartTS || now;
            context.path = (_e = matchedRoute === null || matchedRoute === void 0 ? void 0 : matchedRoute.path) !== null && _e !== void 0 ? _e : '';
            // first match
            if (context.path !== context.lastMatchedPath) {
                context.matchTimes = 0;
                context.matchStartTS = now;
            }
            context.matchDuring = now - context.matchStartTS;
            context.matchTimes++;
            switch (matches.length) {
                case 0:
                    // no match
                    if (this.unknownRouteAction !== null) {
                        this.unknownRouteAction(context, image, finishRoundFunc);
                    }
                    break;
                case 1:
                    // perfect match 1
                    this.doActionForRoute(context, image, matchedRoute, matchedPages, finishRoundFunc);
                    break;
                default:
                    // conflict
                    var error = this.handleConflictRoutes(task.name, image, matches, finishRoundFunc);
                    if (error) {
                        releaseImage(image);
                        throw error;
                    }
                    break;
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
        this.savePageReferenceImage(image, matchedPages);
        utils_1.Utils.sleep(route.afterActionDelay);
    };
    Rerouter.prototype.findMatchedRouteImpl = function (taskName, image, rotation) {
        var matches = [];
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            var _b = this.isMatchRouteImpl(image, rotation, route, taskName), isMatched = _b.isMatched, matchedPages = _b.matchedPages;
            if (isMatched) {
                this.logImpl(route.debug, 'current match:', matchedPages.map(function (p) { return p.name; }));
                matches.push({ matchedRoute: route, matchedPages: matchedPages });
            }
        }
        return matches;
    };
    Rerouter.prototype.handleConflictRoutes = function (taskName, image, matches, finishRound) {
        var matchDetails = matches
            .map(function (item) {
            var _a;
            var path = ((_a = item.matchedRoute) === null || _a === void 0 ? void 0 : _a.path) || 'emptyRoutePath';
            var pages = item.matchedPages.map(function (p) { return p.name; });
            return "".concat(path, ": (").concat(pages.join(', '), ")");
        })
            .join('\n');
        var warningMsg = "a route conflict when in Task: \"".concat(taskName, "\", details: \n").concat(matchDetails);
        this.warning(warningMsg);
        if (this.rerouterConfig.strictMode) {
            // TODO: save image rather than take another screenshot
            utils_1.Utils.saveScreenshotToDisk(this.rerouterConfig.saveImageRoot, "".concat(struct_1.DefaultRerouterConfig.deviceId, "_conflictedRoutes"));
            if (this.rerouterConfig.debugSlackUrl !== '') {
                utils_1.Utils.sendSlackMessage(this.rerouterConfig.debugSlackUrl, 'Conflict Routes Report', "".concat(struct_1.DefaultRerouterConfig.deviceId, " just logged ").concat(warningMsg));
            }
            return new Error("Intentional crash due to multiple route applied to current screen: ".concat(matchDetails));
        }
        // default handle conflict routes in non-strict mode
        this.log("try handle conflict");
        finishRound(true);
        var now = Date.now();
        this.routeConflictRecord.push(now);
        var duringLimit = 60 * 1000;
        var countsLimit = 5;
        while (this.routeConflictRecord.length > 0 && now - this.routeConflictRecord[0] > duringLimit) {
            this.routeConflictRecord.shift();
        }
        if (this.routeConflictRecord.length >= countsLimit) {
            this.routeConflictRecord = [now];
            this.restartApp();
            return;
        }
        keycode('BACK', this.screenConfig.actionDuring);
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
    Rerouter.prototype.savePageReferenceImage = function (image, matchedPages) {
        var _a = this.rerouterConfig.savePageReference || {}, enable = _a.enable, folderPath = _a.folderPath, rgba = _a.rgba;
        if (!enable || !folderPath || matchedPages.length === 0) {
            return;
        }
        matchedPages.forEach(function (page) {
            utils_1.Utils.savePointsMarkedImage({
                image: image,
                name: page.name,
                points: page.points,
                folderPath: folderPath,
                rgba: rgba,
            });
        });
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
// NOTE: this is an another way that resets Rerouter, just leaving here for memory
// const rerouterContainer = {
//   instance: new Rerouter(),
// };
// import 'proxy-polyfill';
// export const rerouter: Rerouter = new Proxy(rerouterContainer, {
//   get: (target, prop: keyof Rerouter) => {
//     return target.instance[prop];
//   },
//   set: (target, prop: keyof Rerouter, value: any) => {
//     target.instance[prop] = value;
//     return true;
//   },
// }) as any as Rerouter;
exports.rerouter = new Rerouter();
//# sourceMappingURL=rerouter.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/screen.js":
/*!**************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/screen.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
    Screen.prototype.isSameColorImage = function (devColorPoint, image, thres) {
        if (thres === void 0) { thres = 0.9; }
        var rgb = getImageColor(image, devColorPoint.x, devColorPoint.y);
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
    Screen.prototype.checkAndSaveScreenshots = function () {
        if (this.config.logScreenshotFolder !== '' && Date.now() - this.config.logScreenshotLastTime > this.config.logScreenshotMinIntervalInSec * 1000) {
            this.config.logScreenshotLastTime = Date.now();
            utils_1.Utils.saveScreenshotToDisk(this.config.logScreenshotFolder, 'log');
            utils_1.Utils.removeOldestFilesIfExceedsLimit(this.config.logScreenshotFolder, this.config.logScreenshotMaxFiles);
        }
    };
    Screen.prototype.getCvtDevScreenshot = function () {
        this.checkAndSaveScreenshots();
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
    deviceId: '',
    strictMode: false,
    debugSlackUrl: '',
    saveImageRoot: '/sdcard/Pictures/Screenshots/robotmon',
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
    logScreenshotLastTime: 0,
    logScreenshotMinIntervalInSec: 10,
    logScreenshotMaxFiles: 100,
    logScreenshotFolder: '',
};
//# sourceMappingURL=struct.js.map

/***/ }),

/***/ "./node_modules/Rerouter/dist/src/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/Rerouter/dist/src/utils.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
    Utils.padZero = function (num) {
        return num < 10 ? "0".concat(num) : "".concat(num);
    };
    Utils.saveScreenshotToDisk = function (folderPath, saveReason) {
        var _this = this;
        saveReason = saveReason === undefined ? 'crash-img' : saveReason;
        var date = new Date(Utils.getTaiwanTime());
        var _a = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].map(function (item) { return _this.padZero(item); }), YYYY = _a[0], MM = _a[1], dd = _a[2], hh = _a[3], mm = _a[4], ss = _a[5];
        var filename = "".concat(YYYY, "-").concat(MM, "-").concat(dd, "T").concat(hh, ".").concat(mm, ".").concat(ss, "_").concat(saveReason, ".png");
        var img = getScreenshot();
        saveImage(img, "".concat(folderPath, "/").concat(filename));
        Utils.log("Write to file: ".concat(folderPath, "/").concat(filename));
        releaseImage(img);
    };
    Utils.removeOldestFilesIfExceedsLimit = function (folderPath, maxFiles) {
        if (maxFiles === void 0) { maxFiles = 100; }
        var fileList = execute("ls -l ".concat(folderPath)).split('\n');
        // Some OS return first line total 8 (Mac, redroid), some not (Memu)
        if (fileList[0] && fileList[0].indexOf('total') === 0) {
            fileList.shift();
        }
        var filesWithDates = fileList.map(function (line) {
            var parts = line.trim().split(' ');
            var filename = parts[parts.length - 1]; // 2023-09-02T15.08.17_log.png
            var dateObj = new Date(parts[parts.length - 3].split('_')[0]);
            return {
                date: dateObj,
                filename: filename,
            };
        });
        filesWithDates.sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
        // If there are more than ${maxFiles} files, remove the oldest
        while (filesWithDates.length > maxFiles) {
            var oldestFile = filesWithDates.shift();
            if (oldestFile) {
                execute("rm ".concat(folderPath, "/").concat(oldestFile.filename));
                Utils.log("rm: ".concat(folderPath, "/").concat(oldestFile.filename));
            }
        }
    };
    Utils.joinPaths = function (path1, path2) {
        if (path2 === '') {
            return path1;
        }
        if (path1.charAt(path1.length - 1) === '/') {
            return path1 + path2;
        }
        else {
            return path1 + '/' + path2;
        }
    };
    Utils.savePointsMarkedImage = function (_a) {
        var image = _a.image, name = _a.name, points = _a.points, folderPath = _a.folderPath, rgba = _a.rgba;
        var filepath = "".concat(folderPath, "/").concat(name, ".png");
        // if file exists, skip
        var res = execute("test -e ".concat(filepath, " && echo 1"));
        if (res === '1') {
            return;
        }
        var clonedImg = clone(image);
        var _b = rgba || { r: 255, g: 0, b: 0, a: 255 }, r = _b.r, g = _b.g, b = _b.b, a = _b.a;
        var radius = 3;
        for (var i in points) {
            var _c = points[i], x = _c.x, y = _c.y;
            drawCircle(clonedImg, x, y, radius, r, g, b, a);
        }
        saveImage(clonedImg, filepath);
        releaseImage(clonedImg);
        console.log("[savePointsMarkedImage]: ".concat(name));
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/core-js/es/array/find-index.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/es/array/find-index.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


__webpack_require__(/*! ../../modules/es.array.find-index */ "./node_modules/core-js/modules/es.array.find-index.js");
var entryUnbind = __webpack_require__(/*! ../../internals/entry-unbind */ "./node_modules/core-js/internals/entry-unbind.js");

module.exports = entryUnbind('Array', 'findIndex');


/***/ }),

/***/ "./node_modules/core-js/es/object/assign.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/es/object/assign.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


__webpack_require__(/*! ../../modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js/internals/path.js");

module.exports = path.Object.assign;


/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ (function(module) {


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/document-all.js ***!
  \********************************************************/
/***/ (function(module) {


var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ (function(module) {


module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/entry-unbind.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/entry-unbind.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (CONSTRUCTOR, METHOD) {
  return uncurryThis(global[CONSTRUCTOR].prototype[METHOD]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ (function(module) {


// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ (function(module) {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || this || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ (function(module) {


module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ (function(module) {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ (function(module) {


module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ (function(module) {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-assign.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol('assign detection');
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = global;


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.32.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.32.2/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ (function(module) {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.find-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.find-index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $findIndex = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").findIndex);
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-findindex -- testing
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.assign.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js/internals/object-assign.js");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Helloworld = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
var pages_1 = __webpack_require__(/*! ./pages */ "./src/pages.ts");
var VERSION_CODE = 1.0;
var Helloworld = /** @class */ (function () {
    function Helloworld(jsonConfig) {
        Rerouter_1.rerouter.reset();
        Rerouter_1.rerouter.screenConfig.devWidth = 360;
        Rerouter_1.rerouter.screenConfig.devHeight = 640;
        Rerouter_1.rerouter.screenConfig.deviceWidth = 360;
        Rerouter_1.rerouter.screenConfig.deviceHeight = 640;
        Rerouter_1.rerouter.screenConfig.screenWidth = 360;
        Rerouter_1.rerouter.screenConfig.screenHeight = 640;
        Rerouter_1.rerouter.screenConfig.screenOffsetX = 0;
        Rerouter_1.rerouter.screenConfig.screenOffsetY = 0;
        Rerouter_1.rerouter.screenConfig.rotation = 'vertical';
        Rerouter_1.rerouter.screenConfig.actionDuring = 300;
        console.log('############ new Helloworld ############');
        console.log("script version ".concat(VERSION_CODE));
        this.addRoutesAndTasks();
    }
    Helloworld.prototype.start = function () {
        // console.log(rerouter.getCurrentMatchNames());
        // console.log(findUnmatchInPage(dice1TimePage));
        // return;
        Rerouter_1.rerouter.start(Helloworld.packageName);
    };
    Helloworld.prototype.stop = function () {
        Rerouter_1.rerouter.stop();
    };
    Helloworld.prototype.addRoutesAndTasks = function () {
        this.addTasks();
        this.addRoutes();
        this.handleUnknown();
    };
    Helloworld.prototype.addTasks = function () {
        Rerouter_1.rerouter.addTask({
            name: 'run',
            beforeRoute: function () { },
        });
    };
    Helloworld.prototype.addRoutes = function () {
        // mainPage
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.mainPage.name),
            match: pages_1.mainPage,
            action: function (context, image, matched, finishRound) {
                console.log("Route ".concat(pages_1.mainPage.name));
                // check if can build house
                var hasBuildHouseHint = Rerouter_1.rerouter.isPageMatchImage(pages_1.buildHouseHintPage, image);
                console.log('hasBuildHouseHint', hasBuildHouseHint);
                if (hasBuildHouseHint) {
                    Rerouter_1.rerouter.screen.tap(84, 595);
                    return;
                }
                var isDiceMaxBefore7Steps = true;
                var isDice1Time = Rerouter_1.rerouter.isPageMatchImage(pages_1.dice1TimePage, image);
                var isDiceMaxTime = Rerouter_1.rerouter.isPageMatchImage(pages_1.isDiceMaxTimePage, image);
                var isMatchBefore7Steps = Rerouter_1.rerouter.isPageMatchImage(pages_1.diceBefore7Steps, image);
                console.log('isMatchBefore7Steps', isMatchBefore7Steps);
                console.log('isDiceMaxTime', isDiceMaxTime);
                console.log('isDice1Time', isDice1Time);
                if (isDiceMaxBefore7Steps) {
                    // console.log('dice7Left', rerouter.isPageMatchImage(dice7Left, image));
                    // console.log('dice7Top', rerouter.isPageMatchImage(dice7Top, image));
                    // console.log('dice7Right', rerouter.isPageMatchImage(dice7Right, image));
                    // console.log('dice7Down', rerouter.isPageMatchImage(dice7Down, image));
                    if (isMatchBefore7Steps) {
                        // before 7 steps
                        if (isDiceMaxTime) {
                            // press go button
                            Rerouter_1.rerouter.screen.tap(177, 515);
                        }
                        else {
                            // press dice power button
                            Rerouter_1.rerouter.screen.tap(240, 470);
                        }
                    }
                    else {
                        // not before 7 steps
                        if (isDice1Time) {
                            // press go button
                            Rerouter_1.rerouter.screen.tap(177, 515);
                        }
                        else {
                            // press dice power button
                            Rerouter_1.rerouter.screen.tap(240, 470);
                        }
                    }
                    return;
                }
                else {
                    // if go button is up, press it
                    if (Rerouter_1.rerouter.screen.isSameColor({ x: 120, y: 537, r: 175, g: 48, b: 0 }) && isDice1Time) {
                        Rerouter_1.rerouter.screen.tapDown(177, 515);
                        Rerouter_1.Utils.sleep(2000);
                        Rerouter_1.rerouter.screen.tapUp(177, 515);
                        return;
                    }
                    // press dice power button
                    Rerouter_1.rerouter.screen.tapDown(240, 470);
                    Rerouter_1.Utils.sleep(100);
                    Rerouter_1.rerouter.screen.tapUp(240, 470);
                    // it is auto playing, do nothing
                }
            },
        });
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.attackPage.name),
            match: pages_1.attackPage,
            action: function (context, image, matched, finishRound) {
                console.log("Route ".concat(pages_1.attackPage.name));
                for (var i = 0; i < 5; i++) {
                    // Generate random x and y coordinates within the specified range
                    var x = Math.floor(Math.random() * (270 - 90 + 1)) + 90;
                    var y = Math.floor(Math.random() * (480 - 160 + 1)) + 160;
                    console.log("tap ".concat(x, ", ").concat(y));
                    Rerouter_1.rerouter.screen.tap(x, y);
                    Rerouter_1.Utils.sleep(200);
                }
            },
        });
        // rollDoublesPage
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.rollDoublesPage.name),
            match: pages_1.rollDoublesPage,
            action: 'goNext',
        });
        // generalCollectPage
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.generalCollectPage.name),
            match: pages_1.generalCollectPage,
            action: 'goNext',
        });
        // collectPage
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.collectPage.name),
            match: pages_1.collectPage,
            action: 'goNext',
        });
        // generalReturnPage
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.generalReturnPage.name),
            match: pages_1.generalReturnPage,
            action: 'goNext',
        });
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.closePage.name),
            match: pages_1.closePage,
            action: 'goNext',
        });
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.bankPages.name),
            match: pages_1.bankPages,
            action: function (context, image, matched, finishRound) {
                console.log("Route ".concat(pages_1.bankPages.name));
                var points = [
                    { x: 217, y: 358, r: 229, g: 198, b: 163 },
                    { x: 223, y: 454, r: 255, g: 215, b: 35 },
                    { x: 143, y: 458, r: 255, g: 198, b: 8 },
                    { x: 142, y: 354, r: 194, g: 163, b: 120 },
                    { x: 71, y: 357, r: 206, g: 172, b: 128 },
                    { x: 69, y: 445, r: 241, g: 222, b: 192 },
                    { x: 63, y: 564, r: 255, g: 203, b: 8 },
                    { x: 152, y: 562, r: 253, g: 239, b: 214 },
                    { x: 230, y: 561, r: 255, g: 204, b: 9 },
                    { x: 304, y: 558, r: 239, g: 220, b: 192 },
                    { x: 307, y: 451, r: 255, g: 216, b: 37 },
                    { x: 304, y: 366, r: 241, g: 222, b: 192 },
                ];
                for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                    var point = points_1[_i];
                    console.log("tap ".concat(point.x, ", ").concat(point.y));
                    Rerouter_1.rerouter.screen.tap(point.x, point.y);
                    Rerouter_1.Utils.sleep(500);
                }
            },
        });
        Rerouter_1.rerouter.addRoute({
            path: "/".concat(pages_1.buildHousePage.name),
            match: pages_1.buildHousePage,
            action: function (context, image, matched) {
                console.log("Route ".concat(pages_1.buildHousePage.name));
                // randomly tap a house
                var randomInt = Math.floor(Math.random() * 5) + 1;
                console.log("randomInt ".concat(randomInt));
                var houses = [38, 108, 178, 248, 321];
                Rerouter_1.rerouter.screen.tap(houses[randomInt - 1], 496);
                // leave page
                Rerouter_1.rerouter.screen.tap(179, 619);
            },
        });
    };
    Helloworld.prototype.handleUnknown = function () {
        Rerouter_1.rerouter.addUnknownAction(function (context, image, finishRound) {
            var lastMatchedPath = context.lastMatchedPath.substring(1);
            Rerouter_1.Utils.log("unknown count ".concat(context.matchTimes, ", during ").concat(context.matchDuring, ", last matched: ").concat(lastMatchedPath));
            if (context.matchTimes % 5 === 0) {
                keycode('KEYCODE_BACK', 100);
                Rerouter_1.Utils.log('keycode back for unknown');
            }
            else {
                Rerouter_1.rerouter.screen.tap({ x: 1, y: 1 });
                Rerouter_1.Utils.log('tap { x: 1, y: 1 }');
            }
        });
    };
    Helloworld.packageName = 'com.scopely.monopolygo';
    return Helloworld;
}());
exports.Helloworld = Helloworld;


/***/ }),

/***/ "./src/pages.ts":
/*!**********************!*\
  !*** ./src/pages.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildHousePage = exports.buildHouseHintPage = exports.diceBefore7Steps = exports.dice7Down = exports.dice7Right = exports.dice7Top = exports.dice7Left = exports.isDiceMaxTimePage = exports.closePage = exports.bankPages = exports.bankPage2 = exports.bankPage1 = exports.generalReturnPage = exports.collectPage = exports.generalCollectPage = exports.attackPage = exports.dice1TimePage = exports.rollDoublesPage = exports.mainPage = void 0;
var Rerouter_1 = __webpack_require__(/*! Rerouter */ "./node_modules/Rerouter/dist/index.js");
exports.mainPage = new Rerouter_1.Page('mainPage', [
    { x: 29, y: 27, r: 232, g: 208, b: 0 },
    { x: 102, y: 29, r: 181, g: 234, b: 119 },
    { x: 275, y: 601, r: 199, g: 183, b: 104 },
    { x: 326, y: 601, r: 255, g: 255, b: 255 },
]);
exports.rollDoublesPage = new Rerouter_1.Page('rollDoublesPage', [
    { x: 97, y: 219, r: 245, g: 242, b: 226 },
    { x: 253, y: 219, r: 239, g: 236, b: 221 },
    { x: 180, y: 484, r: 166, g: 117, b: 200 },
    { x: 165, y: 556, r: 134, g: 116, b: 190 },
    { x: 221, y: 535, r: 138, g: 119, b: 192 },
], { x: 180, y: 528 });
exports.dice1TimePage = new Rerouter_1.Page('dice1TimePage', [
    { x: 244, y: 458, r: 252, g: 181, b: 55 },
    { x: 246, y: 463, r: 252, g: 182, b: 51 },
    { x: 256, y: 463, r: 252, g: 182, b: 51 },
    { x: 254, y: 467, r: 252, g: 182, b: 48 },
    { x: 254, y: 472, r: 252, g: 181, b: 44 },
    { x: 254, y: 477, r: 252, g: 178, b: 39 },
    { x: 247, y: 477, r: 252, g: 178, b: 39 },
    { x: 246, y: 472, r: 252, g: 181, b: 44 },
    { x: 240, y: 471, r: 255, g: 255, b: 255 },
    { x: 234, y: 471, r: 252, g: 181, b: 45 },
    { x: 250, y: 468, r: 255, g: 255, b: 255 },
    { x: 250, y: 472, r: 255, g: 255, b: 255 },
    { x: 247, y: 480, r: 252, g: 176, b: 36 },
]);
exports.attackPage = new Rerouter_1.Page('attackPage', [
    { x: 274, y: 62, r: 219, g: 197, b: 133 },
    { x: 21, y: 614, r: 233, g: 230, b: 219 },
    { x: 95, y: 615, r: 205, g: 190, b: 112 },
    { x: 263, y: 614, r: 203, g: 188, b: 111 },
    { x: 341, y: 615, r: 233, g: 230, b: 219 },
]);
exports.generalCollectPage = new Rerouter_1.Page('generalCollectPage', [
    { x: 115, y: 589, r: 103, g: 205, b: 20 },
    { x: 70, y: 610, r: 236, g: 232, b: 212 },
    { x: 228, y: 611, r: 55, g: 148, b: 1 },
    { x: 304, y: 617, r: 238, g: 233, b: 213 },
], { x: 188, y: 585 });
exports.collectPage = new Rerouter_1.Page('collectPage', [
    { x: 63, y: 542, r: 245, g: 242, b: 226 },
    { x: 86, y: 557, r: 171, g: 169, b: 158 },
    { x: 113, y: 599, r: 102, g: 205, b: 19 },
    { x: 59, y: 623, r: 240, g: 235, b: 215 },
    { x: 324, y: 622, r: 238, g: 233, b: 214 },
    { x: 304, y: 542, r: 242, g: 239, b: 223 },
], { x: 180, y: 600 });
exports.generalReturnPage = new Rerouter_1.Page('generalReturnPage', [
    { x: 111, y: 554, r: 108, g: 208, b: 24 },
    { x: 55, y: 568, r: 241, g: 222, b: 159 },
    { x: 175, y: 620, r: 235, g: 230, b: 211 },
    { x: 254, y: 579, r: 99, g: 203, b: 14 },
    { x: 220, y: 594, r: 59, g: 147, b: 1 },
], { x: 186, y: 580 });
exports.bankPage1 = new Rerouter_1.Page('bankPage', [
    { x: 47, y: 46, r: 252, g: 233, b: 230 },
    { x: 308, y: 47, r: 252, g: 233, b: 230 },
    { x: 281, y: 144, r: 35, g: 158, b: 206 },
    { x: 79, y: 144, r: 35, g: 158, b: 206 },
    { x: 180, y: 627, r: 30, g: 136, b: 188 },
], { x: 180, y: 600 });
exports.bankPage2 = new Rerouter_1.Page('bankPage2', [
    { x: 81, y: 70, r: 223, g: 201, b: 190 },
    { x: 295, y: 81, r: 223, g: 201, b: 190 },
    { x: 290, y: 146, r: 198, g: 63, b: 52 },
    { x: 70, y: 146, r: 197, g: 63, b: 52 },
    { x: 313, y: 263, r: 202, g: 65, b: 54 },
], { x: 180, y: 600 });
exports.bankPages = new Rerouter_1.GroupPage('bankPages', [exports.bankPage1, exports.bankPage2]);
exports.closePage = new Rerouter_1.Page('closePage', [
    { x: 331, y: 89, r: 252, g: 77, b: 1 },
    { x: 326, y: 82, r: 255, g: 88, b: 0 },
    { x: 322, y: 90, r: 251, g: 74, b: 1 },
    { x: 326, y: 98, r: 237, g: 52, b: 1 },
    { x: 326, y: 92, r: 255, g: 255, b: 255 },
], { x: 324, y: 92 });
exports.isDiceMaxTimePage = new Rerouter_1.Page('isDiceMaxTime', [
    { x: 237, y: 459, r: 219, g: 126, b: 220 },
    { x: 249, y: 459, r: 219, g: 126, b: 220 },
    { x: 238, y: 483, r: 209, g: 111, b: 212 },
    { x: 251, y: 483, r: 209, g: 111, b: 212 },
]);
exports.dice7Left = new Rerouter_1.Page('dice7Left', [
    { x: 260, y: 198, r: 253, g: 237, b: 158 },
    { x: 250, y: 208, r: 255, g: 244, b: 160 },
    { x: 256, y: 440, r: 238, g: 209, b: 96 },
    { x: 270, y: 452, r: 241, g: 217, b: 98 },
]);
exports.dice7Top = new Rerouter_1.Page('dice7Top', [
    { x: 8, y: 386, r: 253, g: 236, b: 158 },
    { x: 2, y: 394, r: 255, g: 244, b: 160 },
    { x: 346, y: 386, r: 253, g: 238, b: 158 },
    { x: 356, y: 394, r: 255, g: 244, b: 160 },
]);
exports.dice7Right = new Rerouter_1.Page('dice7Right', [
    { x: 106, y: 230, r: 254, g: 240, b: 159 },
    { x: 118, y: 240, r: 255, g: 244, b: 160 },
    { x: 110, y: 478, r: 253, g: 235, b: 157 },
    { x: 94, y: 488, r: 255, g: 243, b: 160 },
]);
exports.dice7Down = new Rerouter_1.Page('dice7Down', [
    { x: 4, y: 266, r: 240, g: 216, b: 98 },
    { x: 16, y: 274, r: 241, g: 219, b: 113 },
    { x: 352, y: 254, r: 252, g: 234, b: 157 },
    { x: 358, y: 256, r: 254, g: 243, b: 159 },
]);
exports.diceBefore7Steps = new Rerouter_1.GroupPage('diceBefore7Steps', [exports.dice7Left, exports.dice7Top, exports.dice7Right, exports.dice7Down], undefined, undefined, 0.95);
exports.buildHouseHintPage = new Rerouter_1.Page('buildHouseHintPage', [
    { x: 96, y: 578, r: 255, g: 0, b: 0 },
    { x: 108, y: 577, r: 255, g: 0, b: 0 },
    { x: 102, y: 570, r: 255, g: 0, b: 0 },
    { x: 82, y: 592, r: 202, g: 187, b: 100 },
]);
exports.buildHousePage = new Rerouter_1.Page('buildHousePage', [
    { x: 36, y: 608, r: 236, g: 231, b: 212 },
    { x: 302, y: 605, r: 237, g: 232, b: 213 },
    { x: 263, y: 30, r: 46, g: 163, b: 29 },
    { x: 106, y: 30, r: 225, g: 206, b: 124 },
    { x: 150, y: 279, r: 155, g: 141, b: 112 },
]);


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
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
var exports = __webpack_exports__;
/*!******************!*\
  !*** ./index.ts ***!
  \******************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stop = exports.start = void 0;
var src_1 = __webpack_require__(/*! ./src */ "./src/index.ts");
// This is a sample showing how to use rerouter
// It should open Google Play app, and tap 'Signin' button
var helloworld;
function start(jsonConfig) {
    helloworld = new src_1.Helloworld(jsonConfig);
    helloworld.start();
}
exports.start = start;
function stop() {
    if (helloworld === undefined) {
        return;
    }
    helloworld.stop();
    helloworld = undefined;
}
exports.stop = stop;
window.start = start;
window.stop = stop;

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9DQUFvQztBQUNuRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZixhQUFhLG1CQUFPLENBQUMsZ0VBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLG9FQUFnQjtBQUNyQyxhQUFhLG1CQUFPLENBQUMsZ0VBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLDhEQUFhO0FBQ2xDLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0JhO0FBQ2I7QUFDQTtBQUNBLGlEQUFpRCxPQUFPO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RSxPQUFPO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixHQUFHLGdCQUFnQjtBQUNuQyxlQUFlLG1CQUFPLENBQUMsNERBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLDREQUFVO0FBQ2pDLGNBQWMsbUJBQU8sQ0FBQywwREFBUztBQUMvQixtQkFBTyxDQUFDLDRFQUEwQjtBQUNsQyxtQkFBTyxDQUFDLGtGQUE2QjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsaUNBQWlDO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsb0NBQW9DO0FBQzlHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsQ0FBQyxDQUFDO0FBRVUsdUJBQWUsR0FBRyxJQUFJLGVBQUksQ0FDckMsaUJBQWlCLEVBQ2pCO0lBQ0UsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsRUFDRCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUNuQixDQUFDO0FBRVcscUJBQWEsR0FBRyxJQUFJLGVBQUksQ0FBQyxlQUFlLEVBQUU7SUFDckQsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDMUMsQ0FBQyxDQUFDO0FBRVUsa0JBQVUsR0FBRyxJQUFJLGVBQUksQ0FBQyxZQUFZLEVBQUU7SUFDL0MsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7Q0FDM0MsQ0FBQyxDQUFDO0FBRVUsMEJBQWtCLEdBQUcsSUFBSSxlQUFJLENBQ3hDLG9CQUFvQixFQUNwQjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLG1CQUFXLEdBQUcsSUFBSSxlQUFJLENBQ2pDLGFBQWEsRUFDYjtJQUNFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FDbkIsQ0FBQztBQUVXLHlCQUFpQixHQUFHLElBQUksZUFBSSxDQUN2QyxtQkFBbUIsRUFDbkI7SUFDRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtDQUN4QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUMvQixVQUFVLEVBQ1Y7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUMvQixXQUFXLEVBQ1g7SUFDRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN6QyxFQUNELEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ25CLENBQUM7QUFFVyxpQkFBUyxHQUFHLElBQUksb0JBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxpQkFBUyxFQUFFLGlCQUFTLENBQUMsQ0FBQyxDQUFDO0FBRS9ELGlCQUFTLEdBQUcsSUFBSSxlQUFJLENBQy9CLFdBQVcsRUFDWDtJQUNFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzFDLEVBQ0QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDbEIsQ0FBQztBQUVXLHlCQUFpQixHQUFHLElBQUksZUFBSSxDQUFDLGVBQWUsRUFBRTtJQUN6RCxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxDQUFDLENBQUM7QUFFVSxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUFDLFdBQVcsRUFBRTtJQUM3QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxnQkFBUSxHQUFHLElBQUksZUFBSSxDQUFDLFVBQVUsRUFBRTtJQUMzQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN4QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxDQUFDLENBQUM7QUFFVSxrQkFBVSxHQUFHLElBQUksZUFBSSxDQUFDLFlBQVksRUFBRTtJQUMvQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxpQkFBUyxHQUFHLElBQUksZUFBSSxDQUFDLFdBQVcsRUFBRTtJQUM3QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUN2QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMzQyxDQUFDLENBQUM7QUFFVSx3QkFBZ0IsR0FBRyxJQUFJLG9CQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxpQkFBUyxFQUFFLGdCQUFRLEVBQUUsa0JBQVUsRUFBRSxpQkFBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvSCwwQkFBa0IsR0FBRyxJQUFJLGVBQUksQ0FBQyxvQkFBb0IsRUFBRTtJQUMvRCxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNyQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUN0QyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtDQUMxQyxDQUFDLENBQUM7QUFFVSxzQkFBYyxHQUFHLElBQUksZUFBSSxDQUFDLGdCQUFnQixFQUFFO0lBQ3ZELEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3ZDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO0NBQzNDLENBQUMsQ0FBQzs7Ozs7OztVQ3pLSDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwrREFBbUM7QUFFbkMsK0NBQStDO0FBQy9DLDBEQUEwRDtBQUUxRCxJQUFJLFVBQWtDLENBQUM7QUFDdkMsU0FBZ0IsS0FBSyxDQUFDLFVBQWU7SUFDbkMsVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsQ0FBQztBQUhELHNCQUdDO0FBQ0QsU0FBZ0IsSUFBSTtJQUNsQixJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDNUIsT0FBTztLQUNSO0lBQ0QsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xCLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDekIsQ0FBQztBQU5ELG9CQU1DO0FBS0EsTUFBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDN0IsTUFBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL1Jlcm91dGVyL2Rpc3Qvc3JjL3Jlcm91dGVyLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL1Jlcm91dGVyL2Rpc3Qvc3JjL3NjcmVlbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9SZXJvdXRlci9kaXN0L3NyYy9zdHJ1Y3QuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvUmVyb3V0ZXIvZGlzdC9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9lcy9hcnJheS9maW5kLWluZGV4LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvZXMvb2JqZWN0L2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLWNhbGxhYmxlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcy5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Rlc2NyaXB0b3JzLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWFsbC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnRyeS11bmJpbmQuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9leHBvcnQuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1jb250ZXh0LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZnVuY3Rpb24tbmFtZS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMtY2xhdXNlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcy5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtYnVpbHQtaW4uanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9odG1sLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWNhbGxhYmxlLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWNvbnN0cnVjdG9yLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWZvcmNlZC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1udWxsLW9yLXVuZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtcHVyZS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1zeW1ib2wuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWFrZS1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9tYXRoLXRydW5jLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWlzLXByb3RvdHlwZS1vZi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3duLWtleXMuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLWtleS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tb2JqZWN0LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXkuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0LmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RyeS10by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vbW9ub3BvbHktZ28vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnLmpzIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlYWstbWFwLWJhc2ljLWRldGVjdGlvbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZmluZC1pbmRleC5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMub2JqZWN0LmFzc2lnbi5qcyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby8uL3NyYy9wYWdlcy50cyIsIndlYnBhY2s6Ly9tb25vcG9seS1nby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb25vcG9seS1nby93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL21vbm9wb2x5LWdvLy4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmVyc2lvbiA9IHZvaWQgMDtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvc2NyZWVuXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zcmMvcmVyb3V0ZXJcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy9zdHJ1Y3RcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NyYy91dGlsc1wiKSwgZXhwb3J0cyk7XG5leHBvcnRzLnZlcnNpb24gPSAxO1xudmFyIHdyaXRlRmlsZVRtcCA9IHdyaXRlRmlsZTtcbi8vIEB0cy1pZ25vcmVcbndyaXRlRmlsZSA9IGZ1bmN0aW9uIChwYXRoLCBjb250ZW50KSB7XG4gICAgdmFyIHJ0biA9IHdyaXRlRmlsZVRtcChwYXRoLCBjb250ZW50KTtcbiAgICBleGVjdXRlKFwiY2htb2QgNzc3IFwiLmNvbmNhdChwYXRoKSk7XG4gICAgcmV0dXJuIHJ0bjtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlcm91dGVyID0gZXhwb3J0cy5SZXJvdXRlciA9IHZvaWQgMDtcbnZhciBzdHJ1Y3RfMSA9IHJlcXVpcmUoXCIuL3N0cnVjdFwiKTtcbnZhciBzY3JlZW5fMSA9IHJlcXVpcmUoXCIuL3NjcmVlblwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5yZXF1aXJlKFwiY29yZS1qcy9lcy9vYmplY3QvYXNzaWduXCIpO1xucmVxdWlyZShcImNvcmUtanMvZXMvYXJyYXkvZmluZC1pbmRleFwiKTtcbnZhciBSZXJvdXRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZXJvdXRlcigpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHN0cnVjdF8xLkRlZmF1bHRDb25maWdWYWx1ZTtcbiAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZyA9IHN0cnVjdF8xLkRlZmF1bHRSZXJvdXRlckNvbmZpZztcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcgPSBzdHJ1Y3RfMS5EZWZhdWx0U2NyZWVuQ29uZmlnO1xuICAgICAgICB0aGlzLnNjcmVlbiA9IG5ldyBzY3JlZW5fMS5TY3JlZW4odGhpcy5zY3JlZW5Db25maWcpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yb3V0ZUNvbmZsaWN0UmVjb3JkID0gW107XG4gICAgICAgIHRoaXMucm91dGVzID0gW107XG4gICAgICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICAgICAgdGhpcy5yb3V0ZUNvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLnVua25vd25Sb3V0ZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhcnRBcHBSb3V0ZUFjdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIFJlcm91dGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gTk9URTogdGhpcyBpcyBhbiBhbm90aGVyIHdheSB0aGF0IHJlc2V0cyBSZXJvdXRlciwganVzdCBsZWF2aW5nIGhlcmUgZm9yIG1lbW9yeVxuICAgICAgICAvLyByZXJvdXRlckNvbnRhaW5lci5pbnN0YW5jZSA9IG5ldyBSZXJvdXRlcigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlIGluY2x1ZGVkICdjb3JlLWpzL2VzL29iamVjdC9hc3NpZ24nXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgbmV3IFJlcm91dGVyKCkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVjYWxjdWxhdGUgc29tZSB2YWx1ZSBsaWtlIGRldmljZSB3aWR0aCBvciBoZWlnaHQgaW4gc2NyZWVuQ29uZmlnXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gc29ydCByb3V0ZXMgYnkgcHJpb3JpdHlcbiAgICAgICAgdGhpcy5yb3V0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7IH0pO1xuICAgICAgICAvLyBjaGVjayBhbmQgY2FsY3VsYXRlIHNjcmVlbiBjb25maWdcbiAgICAgICAgdmFyIGRldmljZVdIID0gZ2V0U2NyZWVuU2l6ZSgpO1xuICAgICAgICB2YXIgbWF4ID0gTWF0aC5tYXgoZGV2aWNlV0gud2lkdGgsIGRldmljZVdILmhlaWdodCk7XG4gICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihkZXZpY2VXSC53aWR0aCwgZGV2aWNlV0guaGVpZ2h0KTtcbiAgICAgICAgdmFyIGRXaWR0aCA9IHRoaXMuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBtYXggOiBtaW47XG4gICAgICAgIHZhciBkSGVpZ2h0ID0gdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBtYXggOiBtaW47XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLmRldmljZVdpZHRoID0gdGhpcy5zY3JlZW5Db25maWcuZGV2aWNlV2lkdGggfHwgZFdpZHRoO1xuICAgICAgICB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VIZWlnaHQgPSB0aGlzLnNjcmVlbkNvbmZpZy5kZXZpY2VIZWlnaHQgfHwgZEhlaWdodDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db25maWcuc2NyZWVuV2lkdGggPSB0aGlzLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCB8fCBkV2lkdGg7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbkhlaWdodCA9IHRoaXMuc2NyZWVuQ29uZmlnLnNjcmVlbkhlaWdodCB8fCBkSGVpZ2h0O1xuICAgICAgICB0aGlzLmxvZyhcInNjcmVlbldpZHRoOiBcIi5jb25jYXQodGhpcy5zY3JlZW5Db25maWcuc2NyZWVuV2lkdGgsIFwiLCBzY3JlZW5IZWlnaHQ6IFwiKS5jb25jYXQodGhpcy5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0KSk7XG4gICAgICAgIHRoaXMuc2NyZWVuQ29uZmlnLmxvZ1NjcmVlbnNob3RGb2xkZXIgPSB1dGlsc18xLlV0aWxzLmpvaW5QYXRocyh0aGlzLnJlcm91dGVyQ29uZmlnLnNhdmVJbWFnZVJvb3QsIHRoaXMucmVyb3V0ZXJDb25maWcuZGV2aWNlSWQpO1xuICAgICAgICBpZiAoKF9hID0gdGhpcy5yZXJvdXRlckNvbmZpZy5zYXZlUGFnZVJlZmVyZW5jZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVuYWJsZSkge1xuICAgICAgICAgICAgdmFyIGZvbGRlclBhdGggPSB0aGlzLnJlcm91dGVyQ29uZmlnLnNhdmVQYWdlUmVmZXJlbmNlLmZvbGRlclBhdGggfHwgdXRpbHNfMS5VdGlscy5qb2luUGF0aHModGhpcy5yZXJvdXRlckNvbmZpZy5zYXZlSW1hZ2VSb290LCAncGFnZVJlZmVyZW5jZScpO1xuICAgICAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZy5zYXZlUGFnZVJlZmVyZW5jZS5mb2xkZXJQYXRoID0gZm9sZGVyUGF0aDtcbiAgICAgICAgICAgIGV4ZWN1dGUoXCJta2RpciAtcCBcIi5jb25jYXQoZm9sZGVyUGF0aCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5ldyBzY3JlZW4gaWYgc2NyZWVuIGNvbmZpZyBjaGFuZ2VkXG4gICAgICAgIHRoaXMuc2NyZWVuID0gbmV3IHNjcmVlbl8xLlNjcmVlbih0aGlzLnNjcmVlbkNvbmZpZyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgUm91dGVDb25maWcgdG8gUmVyb3V0ZXIgcm91dGVzLCBhZnRlciBzdGFydGluZyBSZXJvdXRlciB3aWxsIHJ1biBvdmVyIGFsbCBSb3V0ZUNvbmZpZ3MgdG8gbWF0Y2ggc2NyZWVuIGFuZCBkbyBhY3Rpb25cbiAgICAgKiBAcGFyYW0gY29uZmlnIGluZm9ybWF0aW9uIGFib3V0IGhvdyByb3V0ZSBtYXRjaCBhbmQgcm91dGUgYWN0aW9uXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAvLyBAdHMtaWdub3JlIGluY2x1ZGVkICdjb3JlLWpzL2VzL2FycmF5L2ZpbmQtaW5kZXgnXG4gICAgICAgIHZhciBleGlzdGluZ1JvdXRlSW5kZXggPSB0aGlzLnJvdXRlcy5maW5kSW5kZXgoZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZS5wYXRoID09PSBjb25maWcucGF0aDsgfSk7XG4gICAgICAgIC8vIElmIGl0IGV4aXN0cywgbG9nIGEgd2FybmluZyBhbmQgZGVjaWRlIHdoYXQgdG8gZG8gbmV4dFxuICAgICAgICBpZiAoZXhpc3RpbmdSb3V0ZUluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiQSByb3V0ZSB3aXRoIHRoZSBwYXRoICdcIi5jb25jYXQoY29uZmlnLnBhdGgsIFwiJyBhbHJlYWR5IGV4aXN0cy4gRHVwbGljYXRlIHJvdXRlIHdpbGwgbm90IGJlIGFkZGVkLlwiKSk7XG4gICAgICAgICAgICAvLyBPcHRpb24gMTogVXBkYXRlIHRoZSBleGlzdGluZyByb3V0ZSB3aXRoIHRoZSBuZXcgY29uZmlndXJhdGlvblxuICAgICAgICAgICAgLy8gdGhpcy5yb3V0ZXNbZXhpc3RpbmdSb3V0ZUluZGV4XSA9IHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQoY29uZmlnKTtcbiAgICAgICAgICAgIC8vIE9wdGlvbiAyOiBTaW1wbHkgcmV0dXJuIGFuZCBkb24ndCBhZGQgdGhlIG5ldyByb3V0ZVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGl0IGRvZXNuJ3QgZXhpc3QsIHB1c2ggdGhlIG5ldyByb3V0ZVxuICAgICAgICB0aGlzLnJvdXRlcy5wdXNoKHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQoY29uZmlnKSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUZWxsIFJlcm91dGVyIHdoYXQgdG8gZG8gaWYgbm90IG1hdGNoaW5nIGFueSByb3V0ZVxuICAgICAqIEBwYXJhbSBhY3Rpb24gZnVuY3Rpb24gdG8gZG8gaWYgbm90IG1hdGNoaW5nXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFVua25vd25BY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMudW5rbm93blJvdXRlQWN0aW9uID0gYWN0aW9uO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFN0YXJ0QXBwQWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICB0aGlzLnN0YXJ0QXBwUm91dGVBY3Rpb24gPSBhY3Rpb247XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgVGFza0NvbmZpZyB0byBSZXJvdXRlciB0YXNrcywgYWZ0ZXIgc3RhcnRpbmcgUmVyb3V0ZXIgd2lsbCBydW4gb3ZlciBhbGwgVGFza3MgYnkgdGFzayBjb25kaXRpb25cbiAgICAgKiBAcGFyYW0gY29uZmlnIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0YXNrIHdvcmtzXG4gICAgICovXG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmFkZFRhc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHRoaXMudGFza3MucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy53cmFwVGFza0NvbmZpZ1dpdGhEZWZhdWx0KGNvbmZpZyksXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBsYXN0UnVuVGltZTogMCxcbiAgICAgICAgICAgIHJ1blRpbWVzOiAwLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0YXJ0IFJlcm91dGVyIHRvIHJ1biBvdmVyIHRhc2tzIGFuZCByb3V0ZXNcbiAgICAgKiBAcGFyYW0gcGFja2FnZU5hbWVcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgdGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSA9IHBhY2thZ2VOYW1lO1xuICAgICAgICAvLyBjaGVjayB0YXNrc1xuICAgICAgICBpZiAodGhpcy50YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgZmFpbGVkLCBubyB0YXNrcyAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnRlZCAuLi5cIik7XG4gICAgICAgIC8vIHRhc2sgY29udHJvbGxlclxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0VGFza0xvb3AoKTtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wcGVkIC4uLlwiKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIHN0b3AgUmVyb3V0ZXJcbiAgICAgKi9cbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sb2coXCJSZXJvdXRlciBzdG9wIGNhbGxlZCwgdHJ5aW5nIHRvIHN0b3AgdGFzayBsb29wXCIpO1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMucm91dGVDb250ZXh0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlQ29udGV4dC5zY3JpcHRSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5jaGVja0luQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSB1dGlsc18xLlV0aWxzLmdldEN1cnJlbnRBcHAoKVswXTtcbiAgICAgICAgaWYgKHBhY2thZ2VOYW1lID09PSB0aGlzLnJlcm91dGVyQ29uZmlnLnBhY2thZ2VOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy5pc0FwcE9uVG9wKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmNoZWNrQW5kU3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jaGVja0luQXBwKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiQXBwSXNOb3RTdGFydGVkLCBzdGFydEFwcCBcIi5jb25jYXQodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydEFwcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RhcnQgYXBwIGZhaWxlZCwgbm8gcGFja2FnZU5hbWUgLi4uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc3RhcnRBcHAodGhpcy5yZXJvdXRlckNvbmZpZy5wYWNrYWdlTmFtZSk7XG4gICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy5zdGFydEFwcERlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5zdG9wQXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nKFwiUmVyb3V0ZXIgc3RvcCBhcHAgZmFpbGVkLCBubyBwYWNrYWdlTmFtZSAuLi5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zdG9wQXBwKHRoaXMucmVyb3V0ZXJDb25maWcucGFja2FnZU5hbWUpO1xuICAgICAgICB1dGlsc18xLlV0aWxzLnNsZWVwKDEwMDApO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnJlc3RhcnRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RvcEFwcCgpO1xuICAgICAgICB0aGlzLnN0YXJ0QXBwKCk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ29OZXh0ID0gZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgaWYgKHBhZ2UubmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAocGFnZS5uZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChwYWdlLm5hbWUsIFwiIGFjdGlvbiA9PSBnb05leHQsIGJ1dCBubyBuZXh0IHh5XCIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdvQmFjayA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmIChwYWdlLmJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKHBhZ2UuYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocGFnZS5uYW1lLCBcIiBhY3Rpb24gPT0gZ29CYWNrLCBidXQgbm8gYmFjayB4eVwiKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaCA9IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIGlzTWF0Y2ggPSB0aGlzLmlzUGFnZU1hdGNoSW1hZ2UocGFnZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1BhZ2VNYXRjaEltYWdlID0gZnVuY3Rpb24gKHBhZ2UsIGltYWdlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRQYWdlQnlOYW1lKHBhZ2UpO1xuICAgICAgICAgICAgaWYgKHAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJpc1BhZ2VNYXRjaEltYWdlIFwiLmNvbmNhdChwYWdlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhZ2UgPSBwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWdlIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMuaXNNYXRjaEdyb3VwUGFnZUltcGwoaW1hZ2UsIHBhZ2UsIHRoaXMuZGVmYXVsdENvbmZpZy5Hcm91cFBhZ2VUaHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICByZXR1cm4gcGFnZXMubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2ggPSBmdW5jdGlvbiAoZ3JvdXBQYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZSA9IHRoaXMuc2NyZWVuLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgdmFyIG1hdGNoID0gdGhpcy5nZXRQYWdlc01hdGNoSW1hZ2UoZ3JvdXBQYWdlLCBpbWFnZSwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmdldFBhZ2VzTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChncm91cFBhZ2UsIGltYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgIHZhciB0aHJlcyA9IChfYiA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgICBpZiAoaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdQYWdlID0gZnVuY3Rpb24gKHBhZ2UsIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuVXRpbHMud2FpdEZvckFjdGlvbihmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5pc1BhZ2VNYXRjaChwYWdlKTsgfSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzUm91dGVNYXRjaCA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciBpc01hdGNoID0gdGhpcy5pc1JvdXRlTWF0Y2hJbWFnZShyb3V0ZSwgaW1hZ2UpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaXNNYXRjaDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc1JvdXRlTWF0Y2hJbWFnZSA9IGZ1bmN0aW9uIChyb3V0ZSwgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHJvdXRlQ29uZmlnID0gdGhpcy5nZXRSb3V0ZUNvbmZpZyhyb3V0ZSk7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nKFwiaXNSb3V0ZU1hdGNoSW1hZ2UgXCIuY29uY2F0KHJvdXRlLCBcIiBub3QgZXhpc3RcIikpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmaWxsZWRSb3V0ZUNvbmZpZyA9IHRoaXMud3JhcFJvdXRlQ29uZmlnV2l0aERlZmF1bHQocm91dGVDb25maWcpO1xuICAgICAgICB2YXIgcm90YXRpb24gPSB0aGlzLnNjcmVlbi5nZXRJbWFnZVJvdGF0aW9uKGltYWdlKTtcbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIGZpbGxlZFJvdXRlQ29uZmlnLCAnd2FpdFNjcmVlbkZvck1hdGNoaW5nUm91dGUnKS5pc01hdGNoZWQ7XG4gICAgICAgIGlmIChpc01hdGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YWl0U2NyZWVuRm9yTWF0Y2hpbmdSb3V0ZSA9IGZ1bmN0aW9uIChyb3V0ZSwgdGltZW91dCwgbWF0Y2hUaW1lcywgaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1hdGNoVGltZXMgPT09IHZvaWQgMCkgeyBtYXRjaFRpbWVzID0gMTsgfVxuICAgICAgICBpZiAoaW50ZXJ2YWwgPT09IHZvaWQgMCkgeyBpbnRlcnZhbCA9IDYwMDsgfVxuICAgICAgICByZXR1cm4gdXRpbHNfMS5VdGlscy53YWl0Rm9yQWN0aW9uKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmlzUm91dGVNYXRjaChyb3V0ZSk7IH0sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRQYWdlQnlOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2IubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYltfaV07XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gKChfYSA9IHJvdXRlLm1hdGNoKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGUubWF0Y2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuZ2V0Um91dGVDb25maWdCeVBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5yb3V0ZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAocGF0aCA9PT0gcm91dGUucGF0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRDdXJyZW50TWF0Y2hOYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGltYWdlID0gdGhpcy5zY3JlZW4uZ2V0Q3Z0RGV2U2NyZWVuc2hvdCgpO1xuICAgICAgICB2YXIgbWF0Y2hlZE5hbWVzID0gW107XG4gICAgICAgIHRoaXMucm91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSByb3V0ZS5tYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5QYWdlICYmIF90aGlzLmlzTWF0Y2hQYWdlSW1wbChpbWFnZSwgbWF0Y2gsIF90aGlzLmRlZmF1bHRDb25maWcuUGFnZVRocmVzLCBfdGhpcy5kZWJ1ZykpIHx8XG4gICAgICAgICAgICAgICAgKG1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuR3JvdXBQYWdlICYmIF90aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCBtYXRjaCwgX3RoaXMuZGVmYXVsdENvbmZpZy5QYWdlVGhyZXMsIF90aGlzLmRlYnVnKS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoZWROYW1lcy5wdXNoKG1hdGNoLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2coXCJjdXJyZW50IG1hdGNoOiBcIiwgbWF0Y2hlZE5hbWVzKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWROYW1lcztcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5nZXRSb3V0ZUNvbmZpZyA9IGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHZhciByb3V0ZTtcbiAgICAgICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcm91dGUgPSB0aGlzLmdldFJvdXRlQ29uZmlnQnlQYXRoKHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcm91dGUgPSByO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53cmFwUm91dGVDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBjb25maWcucGF0aCxcbiAgICAgICAgICAgIGFjdGlvbjogY29uZmlnLmFjdGlvbixcbiAgICAgICAgICAgIG1hdGNoOiAoX2EgPSBjb25maWcubWF0Y2gpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGwsXG4gICAgICAgICAgICBjdXN0b21NYXRjaDogKF9iID0gY29uZmlnLmN1c3RvbU1hdGNoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBudWxsLFxuICAgICAgICAgICAgcm90YXRpb246IChfYyA9IGNvbmZpZy5yb3RhdGlvbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdGhpcy5zY3JlZW5Db25maWcucm90YXRpb24sXG4gICAgICAgICAgICBzaG91bGRNYXRjaFRpbWVzOiAoX2QgPSBjb25maWcuc2hvdWxkTWF0Y2hUaW1lcykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnU2hvdWxkTWF0Y2hUaW1lcyxcbiAgICAgICAgICAgIHNob3VsZE1hdGNoRHVyaW5nOiAoX2UgPSBjb25maWcuc2hvdWxkTWF0Y2hEdXJpbmcpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoRHVyaW5nLFxuICAgICAgICAgICAgYmVmb3JlQWN0aW9uRGVsYXk6IChfZiA9IGNvbmZpZy5iZWZvcmVBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQmVmb3JlQWN0aW9uRGVsYXksXG4gICAgICAgICAgICBhZnRlckFjdGlvbkRlbGF5OiAoX2cgPSBjb25maWcuYWZ0ZXJBY3Rpb25EZWxheSkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnQWZ0ZXJBY3Rpb25EZWxheSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAoX2ggPSBjb25maWcucHJpb3JpdHkpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IHRoaXMuZGVmYXVsdENvbmZpZy5Sb3V0ZUNvbmZpZ1ByaW9yaXR5LFxuICAgICAgICAgICAgZGVidWc6IChfaiA9IGNvbmZpZy5kZWJ1ZykgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogdGhpcy5kZWZhdWx0Q29uZmlnLlJvdXRlQ29uZmlnRGVidWcsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUud3JhcFRhc2tDb25maWdXaXRoRGVmYXVsdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICAgICAgICBtYXhUYXNrUnVuVGltZXM6IChfYSA9IGNvbmZpZy5tYXhUYXNrUnVuVGltZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza1J1blRpbWVzLFxuICAgICAgICAgICAgbWF4VGFza0R1cmluZzogKF9iID0gY29uZmlnLm1heFRhc2tEdXJpbmcpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnTWF4VGFza0R1cmluZyxcbiAgICAgICAgICAgIG1pblJvdW5kSW50ZXJ2YWw6IChfYyA9IGNvbmZpZy5taW5Sb3VuZEludGVydmFsKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ01pblJvdW5kSW50ZXJ2YWwsXG4gICAgICAgICAgICBmb3JjZVN0b3A6IChfZCA9IGNvbmZpZy5mb3JjZVN0b3ApICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHRoaXMuZGVmYXVsdENvbmZpZy5UYXNrQ29uZmlnQXV0b1N0b3AsXG4gICAgICAgICAgICBmaW5kUm91dGVEZWxheTogKF9lID0gY29uZmlnLmZpbmRSb3V0ZURlbGF5KSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiB0aGlzLmRlZmF1bHRDb25maWcuVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5LFxuICAgICAgICAgICAgYmVmb3JlUm91dGU6IChfZiA9IGNvbmZpZy5iZWZvcmVSb3V0ZSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogbnVsbCxcbiAgICAgICAgICAgIGFmdGVyUm91dGU6IChfZyA9IGNvbmZpZy5hZnRlclJvdXRlKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBudWxsLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLnN0YXJ0VGFza0xvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YXNrSWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0aGlzLnRhc2tzW3Rhc2tJZHggJSB0aGlzLnRhc2tzLmxlbmd0aF07XG4gICAgICAgICAgICB0YXNrSWR4Kys7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHZhciBpc1Rhc2tSdW5GaXJzdFRpbWUgPSB0YXNrLmxhc3RSdW5UaW1lID09PSAwO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHRhc2subGFzdFJ1blRpbWUgPD0gdGFzay5jb25maWcubWluUm91bmRJbnRlcnZhbCAmJiAhaXNUYXNrUnVuRmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBkdXJpbmc6IFwiKS5jb25jYXQobm93IC0gdGFzay5sYXN0UnVuVGltZSwgXCIgPD0gbWluUm91bmRJbnRlcnZhbCwgc2tpcFwiKSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0aGlzLnJlcm91dGVyQ29uZmlnLnRhc2tEZWxheSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXNrLnN0YXJ0VGltZSA9IG5vdztcbiAgICAgICAgICAgIHRhc2sucnVuVGltZXMgPSAwO1xuICAgICAgICAgICAgdmFyIGV4aXRUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2suY29uZmlnLm1heFRhc2tSdW5UaW1lcyAmJiB0aGlzLnJ1bm5pbmcgJiYgIWV4aXRUYXNrOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhcIlRhc2s6IFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIHJ1biBcIikuY29uY2F0KHRhc2sucnVuVGltZXMpKTtcbiAgICAgICAgICAgICAgICB2YXIgc2tpcFJvdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmJlZm9yZVJvdXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgcnVuIFwiKS5jb25jYXQodGFzay5ydW5UaW1lcywgXCIgZG8gYmVmb3JlUm91dGUoKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLmNvbmZpZy5iZWZvcmVSb3V0ZSh0YXNrKSA9PT0gJ3NraXBSb3V0ZUxvb3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBza2lwUm91dGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChza2lwUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBza2lwUm91dGVMb29wXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXRUYXNrID0gdGhpcy5zdGFydFJvdXRlTG9vcCh0YXNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLmFmdGVyUm91dGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrOiBcIi5jb25jYXQodGFzay5uYW1lLCBcIiBydW4gXCIpLmNvbmNhdCh0YXNrLnJ1blRpbWVzLCBcIiBkbyBhZnRlclJvdXRlKClcIikpO1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmNvbmZpZy5hZnRlclJvdXRlKHRhc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXNrLnJ1blRpbWVzKys7XG4gICAgICAgICAgICAgICAgdGFzay5sYXN0UnVuVGltZSA9IG5vdztcbiAgICAgICAgICAgICAgICB2YXIgZHVyaW5nID0gbm93IC0gdGFzay5zdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2suY29uZmlnLm1heFRhc2tEdXJpbmcgPiAwICYmIGR1cmluZyA+PSB0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nKFwiVGFzazogXCIuY29uY2F0KHRhc2submFtZSwgXCIgdGFza0R1cmluZzogXCIpLmNvbmNhdChkdXJpbmcsIFwiL1wiKS5jb25jYXQodGFzay5jb25maWcubWF4VGFza0R1cmluZywgXCIgcmVhY2hlZCwgc3RvcFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2xlZXAodGhpcy5yZXJvdXRlckNvbmZpZy50YXNrRGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc3RhcnRSb3V0ZUxvb3AgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xuICAgICAgICB0aGlzLnJvdXRlQ29udGV4dCA9IHtcbiAgICAgICAgICAgIHRhc2s6IHRhc2ssXG4gICAgICAgICAgICBzY3JlZW46IHRoaXMuc2NyZWVuLFxuICAgICAgICAgICAgc2NyaXB0UnVubmluZzogdGhpcy5ydW5uaW5nLFxuICAgICAgICAgICAgcGF0aDogJycsXG4gICAgICAgICAgICBsYXN0TWF0Y2hlZFBhdGg6IChfYiA9IChfYSA9IHRoaXMucm91dGVDb250ZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGFzdE1hdGNoZWRQYXRoKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAnJyxcbiAgICAgICAgICAgIG1hdGNoVGltZXM6IDAsXG4gICAgICAgICAgICBtYXRjaFN0YXJ0VFM6IDAsXG4gICAgICAgICAgICBtYXRjaER1cmluZzogMCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJvdXRlTG9vcCA9IHRydWU7XG4gICAgICAgIHZhciBleGl0VGFza1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICB2YXIgZmluaXNoUm91bmRGdW5jID0gZnVuY3Rpb24gKGV4aXRUYXNrKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoZXhpdFRhc2sgPT09IHZvaWQgMCkgeyBleGl0VGFzayA9IGZhbHNlOyB9XG4gICAgICAgICAgICByb3V0ZUxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIGV4aXRUYXNrUmVzdWx0ID0gZXhpdFRhc2s7XG4gICAgICAgICAgICBfdGhpcy5sb2coXCJmaW5pc2ggcm91bmQ6IFwiLmNvbmNhdCgoX2EgPSBfdGhpcy5yb3V0ZUNvbnRleHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50YXNrLm5hbWUsIFwiOyBleGl0VGFzazogXCIpLmNvbmNhdChleGl0VGFzaykpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBwb2ludGVyIGZvciBzaG9ydCBjb2RlXG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5yb3V0ZUNvbnRleHQ7XG4gICAgICAgIHdoaWxlIChyb3V0ZUxvb3AgJiYgdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIC8vIGNoZWNrIHRhc2suYXV0b1N0b3BcbiAgICAgICAgICAgIHZhciB0YXNrUnVuRHVyaW5nID0gbm93IC0gdGFzay5zdGFydFRpbWU7XG4gICAgICAgICAgICBpZiAodGFzay5jb25maWcuZm9yY2VTdG9wICYmIHRhc2tSdW5EdXJpbmcgPiB0YXNrLmNvbmZpZy5tYXhUYXNrRHVyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coXCJUYXNrIFwiLmNvbmNhdCh0YXNrLm5hbWUsIFwiIEF1dG9TdG9wLCBleGNlZWQgdGFza1J1bkR1cmluZ1wiKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjaGVjayBpc0FwcE9uIG9yIGF1dG8gbGF1bmNoIGl0XG4gICAgICAgICAgICBpZiAodGhpcy5yZXJvdXRlckNvbmZpZy5hdXRvTGF1bmNoQXBwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tBbmRTdGFydEFwcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0QXBwUm91dGVBY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBcHBSb3V0ZUFjdGlvbihjb250ZXh0LCBmaW5pc2hSb3VuZEZ1bmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByb3RhdGlvbiA9IHRoaXMuc2NyZWVuLmdldFJvdGF0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLnNjcmVlbi5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHRoaXMuZmluZE1hdGNoZWRSb3V0ZUltcGwodGFzay5uYW1lLCBpbWFnZSwgcm90YXRpb24pO1xuICAgICAgICAgICAgdmFyIG1hdGNoZWRSb3V0ZSA9IChfYyA9IG1hdGNoZXNbMF0pID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5tYXRjaGVkUm91dGU7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlZFBhZ2VzID0gKF9kID0gbWF0Y2hlc1swXSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLm1hdGNoZWRQYWdlcztcbiAgICAgICAgICAgIC8vIGNvbnRleHQubWF0Y2hTdGFydFRTID0gMCBpZiBpbml0IHJ1blxuICAgICAgICAgICAgY29udGV4dC5tYXRjaFN0YXJ0VFMgPSBjb250ZXh0Lm1hdGNoU3RhcnRUUyB8fCBub3c7XG4gICAgICAgICAgICBjb250ZXh0LnBhdGggPSAoX2UgPSBtYXRjaGVkUm91dGUgPT09IG51bGwgfHwgbWF0Y2hlZFJvdXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtYXRjaGVkUm91dGUucGF0aCkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogJyc7XG4gICAgICAgICAgICAvLyBmaXJzdCBtYXRjaFxuICAgICAgICAgICAgaWYgKGNvbnRleHQucGF0aCAhPT0gY29udGV4dC5sYXN0TWF0Y2hlZFBhdGgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1hdGNoVGltZXMgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubWF0Y2hTdGFydFRTID0gbm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5tYXRjaER1cmluZyA9IG5vdyAtIGNvbnRleHQubWF0Y2hTdGFydFRTO1xuICAgICAgICAgICAgY29udGV4dC5tYXRjaFRpbWVzKys7XG4gICAgICAgICAgICBzd2l0Y2ggKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAvLyBubyBtYXRjaFxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51bmtub3duUm91dGVBY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5rbm93blJvdXRlQWN0aW9uKGNvbnRleHQsIGltYWdlLCBmaW5pc2hSb3VuZEZ1bmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyZmVjdCBtYXRjaCAxXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9BY3Rpb25Gb3JSb3V0ZShjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZFJvdXRlLCBtYXRjaGVkUGFnZXMsIGZpbmlzaFJvdW5kRnVuYyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbmZsaWN0XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuaGFuZGxlQ29uZmxpY3RSb3V0ZXModGFzay5uYW1lLCBpbWFnZSwgbWF0Y2hlcywgZmluaXNoUm91bmRGdW5jKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgbGFzdE1hdGNoZWRQYXRoIGFmdGVyIGFjdGlvbiBkb25lXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgdGhlIGxhc3RNYXRjaGVkUGF0aCB3aWxsIGJlIGN1cnJlbnQgcGF0aCB3aGVuIGRvaW5nIGFjdGlvblxuICAgICAgICAgICAgY29udGV4dC5sYXN0TWF0Y2hlZFBhdGggPSBjb250ZXh0LnBhdGg7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1hZ2UpO1xuICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcCh0YXNrLmNvbmZpZy5maW5kUm91dGVEZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4aXRUYXNrUmVzdWx0O1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmRvQWN0aW9uRm9yUm91dGUgPSBmdW5jdGlvbiAoY29udGV4dCwgaW1hZ2UsIHJvdXRlLCBtYXRjaGVkUGFnZXMsIGZpbmlzaFJvdW5kKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJoYW5kbGVNYXRjaGVkUm91dGU6IFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiwgdGltZXM6IFwiKS5jb25jYXQoY29udGV4dC5tYXRjaFRpbWVzLCBcIiwgZHVyaW5nOiBcIikuY29uY2F0KGNvbnRleHQubWF0Y2hEdXJpbmcpKTtcbiAgICAgICAgaWYgKGNvbnRleHQubWF0Y2hUaW1lcyA8IHJvdXRlLnNob3VsZE1hdGNoVGltZXMgfHwgY29udGV4dC5tYXRjaER1cmluZyA8IHJvdXRlLnNob3VsZE1hdGNoRHVyaW5nKSB7XG4gICAgICAgICAgICAvLyBzaG91bGQgc3RpbGwgd2FpdCBmb3IgbWF0Y2hpbmcgY29uZGl0aW9uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5leHRYWSA9IChfYSA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5leHQ7XG4gICAgICAgIHZhciBiYWNrWFkgPSAoX2IgPSBtYXRjaGVkUGFnZXNbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5iYWNrO1xuICAgICAgICAvLyBtYXRjaGVkIGFuZCBmaXQgY29uZGl0aW9uLCBkbyBhY3Rpb25cbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcChyb3V0ZS5iZWZvcmVBY3Rpb25EZWxheSk7XG4gICAgICAgIGlmIChyb3V0ZS5hY3Rpb24gPT09ICdnb05leHQnKSB7XG4gICAgICAgICAgICBpZiAobmV4dFhZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbi50YXAobmV4dFhZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZyhcIlwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBhY3Rpb24gPT0gZ29OZXh0LCBidXQgbm8gbmV4dCB4eVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocm91dGUuYWN0aW9uID09PSAnZ29CYWNrJykge1xuICAgICAgICAgICAgaWYgKGJhY2tYWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW4udGFwKGJhY2tYWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoXCJcIi5jb25jYXQocm91dGUucGF0aCwgXCIgYWN0aW9uID09IGdvQmFjaywgYnV0IG5vIGJhY2sgeHlcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJvdXRlLmFjdGlvbiA9PT0gJ2tleWNvZGVCYWNrJykge1xuICAgICAgICAgICAga2V5Y29kZSgnQkFDSycsIHRoaXMuc2NyZWVuQ29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByb3V0ZS5hY3Rpb24oY29udGV4dCwgaW1hZ2UsIG1hdGNoZWRQYWdlcywgZmluaXNoUm91bmQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZVBhZ2VSZWZlcmVuY2VJbWFnZShpbWFnZSwgbWF0Y2hlZFBhZ2VzKTtcbiAgICAgICAgdXRpbHNfMS5VdGlscy5zbGVlcChyb3V0ZS5hZnRlckFjdGlvbkRlbGF5KTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5maW5kTWF0Y2hlZFJvdXRlSW1wbCA9IGZ1bmN0aW9uICh0YXNrTmFtZSwgaW1hZ2UsIHJvdGF0aW9uKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnJvdXRlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IF9hW19pXTtcbiAgICAgICAgICAgIHZhciBfYiA9IHRoaXMuaXNNYXRjaFJvdXRlSW1wbChpbWFnZSwgcm90YXRpb24sIHJvdXRlLCB0YXNrTmFtZSksIGlzTWF0Y2hlZCA9IF9iLmlzTWF0Y2hlZCwgbWF0Y2hlZFBhZ2VzID0gX2IubWF0Y2hlZFBhZ2VzO1xuICAgICAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgJ2N1cnJlbnQgbWF0Y2g6JywgbWF0Y2hlZFBhZ2VzLm1hcChmdW5jdGlvbiAocCkgeyByZXR1cm4gcC5uYW1lOyB9KSk7XG4gICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHsgbWF0Y2hlZFJvdXRlOiByb3V0ZSwgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaGFuZGxlQ29uZmxpY3RSb3V0ZXMgPSBmdW5jdGlvbiAodGFza05hbWUsIGltYWdlLCBtYXRjaGVzLCBmaW5pc2hSb3VuZCkge1xuICAgICAgICB2YXIgbWF0Y2hEZXRhaWxzID0gbWF0Y2hlc1xuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIHBhdGggPSAoKF9hID0gaXRlbS5tYXRjaGVkUm91dGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXRoKSB8fCAnZW1wdHlSb3V0ZVBhdGgnO1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gaXRlbS5tYXRjaGVkUGFnZXMubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLm5hbWU7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIFwiXCIuY29uY2F0KHBhdGgsIFwiOiAoXCIpLmNvbmNhdChwYWdlcy5qb2luKCcsICcpLCBcIilcIik7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICAgIHZhciB3YXJuaW5nTXNnID0gXCJhIHJvdXRlIGNvbmZsaWN0IHdoZW4gaW4gVGFzazogXFxcIlwiLmNvbmNhdCh0YXNrTmFtZSwgXCJcXFwiLCBkZXRhaWxzOiBcXG5cIikuY29uY2F0KG1hdGNoRGV0YWlscyk7XG4gICAgICAgIHRoaXMud2FybmluZyh3YXJuaW5nTXNnKTtcbiAgICAgICAgaWYgKHRoaXMucmVyb3V0ZXJDb25maWcuc3RyaWN0TW9kZSkge1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSBpbWFnZSByYXRoZXIgdGhhbiB0YWtlIGFub3RoZXIgc2NyZWVuc2hvdFxuICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5zYXZlU2NyZWVuc2hvdFRvRGlzayh0aGlzLnJlcm91dGVyQ29uZmlnLnNhdmVJbWFnZVJvb3QsIFwiXCIuY29uY2F0KHN0cnVjdF8xLkRlZmF1bHRSZXJvdXRlckNvbmZpZy5kZXZpY2VJZCwgXCJfY29uZmxpY3RlZFJvdXRlc1wiKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXJvdXRlckNvbmZpZy5kZWJ1Z1NsYWNrVXJsICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2VuZFNsYWNrTWVzc2FnZSh0aGlzLnJlcm91dGVyQ29uZmlnLmRlYnVnU2xhY2tVcmwsICdDb25mbGljdCBSb3V0ZXMgUmVwb3J0JywgXCJcIi5jb25jYXQoc3RydWN0XzEuRGVmYXVsdFJlcm91dGVyQ29uZmlnLmRldmljZUlkLCBcIiBqdXN0IGxvZ2dlZCBcIikuY29uY2F0KHdhcm5pbmdNc2cpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJJbnRlbnRpb25hbCBjcmFzaCBkdWUgdG8gbXVsdGlwbGUgcm91dGUgYXBwbGllZCB0byBjdXJyZW50IHNjcmVlbjogXCIuY29uY2F0KG1hdGNoRGV0YWlscykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmF1bHQgaGFuZGxlIGNvbmZsaWN0IHJvdXRlcyBpbiBub24tc3RyaWN0IG1vZGVcbiAgICAgICAgdGhpcy5sb2coXCJ0cnkgaGFuZGxlIGNvbmZsaWN0XCIpO1xuICAgICAgICBmaW5pc2hSb3VuZCh0cnVlKTtcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMucm91dGVDb25mbGljdFJlY29yZC5wdXNoKG5vdyk7XG4gICAgICAgIHZhciBkdXJpbmdMaW1pdCA9IDYwICogMTAwMDtcbiAgICAgICAgdmFyIGNvdW50c0xpbWl0ID0gNTtcbiAgICAgICAgd2hpbGUgKHRoaXMucm91dGVDb25mbGljdFJlY29yZC5sZW5ndGggPiAwICYmIG5vdyAtIHRoaXMucm91dGVDb25mbGljdFJlY29yZFswXSA+IGR1cmluZ0xpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlQ29uZmxpY3RSZWNvcmQuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yb3V0ZUNvbmZsaWN0UmVjb3JkLmxlbmd0aCA+PSBjb3VudHNMaW1pdCkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZUNvbmZsaWN0UmVjb3JkID0gW25vd107XG4gICAgICAgICAgICB0aGlzLnJlc3RhcnRBcHAoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBrZXljb2RlKCdCQUNLJywgdGhpcy5zY3JlZW5Db25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS5pc01hdGNoUm91dGVJbXBsID0gZnVuY3Rpb24gKGltYWdlLCByb3RhdGlvbiwgcm91dGUsIHRhc2tOYW1lKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gY2hlY2sgcm90YXRpb25cbiAgICAgICAgaWYgKHJvdXRlLnJvdGF0aW9uICE9PSByb3RhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKHJvdXRlLmRlYnVnLCBcImZpbmRNYXRjaGVkUm91dGUgXCIuY29uY2F0KHJvdXRlLnBhdGgsIFwiIG5vdCBtYXRjaCByb3RhdGlvbiwgc2tpcFwiKSk7XG4gICAgICAgICAgICByZXR1cm4geyBpc01hdGNoZWQ6IGZhbHNlLCBtYXRjaGVkUGFnZXM6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzTWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgbWF0Y2hlZFBhZ2VzID0gW107XG4gICAgICAgIC8vIGNoZWNrIHJvdXRlLm1hdGNoXG4gICAgICAgIGlmIChyb3V0ZS5tYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJvdXRlLm1hdGNoIGluc3RhbmNlb2Ygc3RydWN0XzEuUGFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLlBhZ2VUaHJlcywgcm91dGUuZGVidWcpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaChyb3V0ZS5tYXRjaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocm91dGUubWF0Y2ggaW5zdGFuY2VvZiBzdHJ1Y3RfMS5Hcm91cFBhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0aGlzLmlzTWF0Y2hHcm91cFBhZ2VJbXBsKGltYWdlLCByb3V0ZS5tYXRjaCwgdGhpcy5kZWZhdWx0Q29uZmlnLkdyb3VwUGFnZVRocmVzLCByb3V0ZS5kZWJ1Zyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUGFnZXMucHVzaC5hcHBseShtYXRjaGVkUGFnZXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgcm91dGUuaXNNYXRjaCBmdW5jdGlvblxuICAgICAgICBpZiAoIWlzTWF0Y2hlZCAmJiByb3V0ZS5jdXN0b21NYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaXNNYXRjaGVkID0gcm91dGUuY3VzdG9tTWF0Y2godGFza05hbWUsIGltYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9nSW1wbChyb3V0ZS5kZWJ1ZywgXCJmaW5kTWF0Y2hlZFJvdXRlIFwiLmNvbmNhdChyb3V0ZS5wYXRoLCBcIiBpc01hdGNoKCkgPT4gXCIpLmNvbmNhdChpc01hdGNoZWQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwocm91dGUuZGVidWcsIFwiZmluZE1hdGNoZWRSb3V0ZSBcIi5jb25jYXQocm91dGUucGF0aCwgXCIgbWF0Y2g6IFwiKS5jb25jYXQoaXNNYXRjaGVkLCBcIiwgZmlyc3RQYWdlOiBcIikuY29uY2F0KChfYSA9IG1hdGNoZWRQYWdlc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzTWF0Y2hlZDogaXNNYXRjaGVkLFxuICAgICAgICAgICAgbWF0Y2hlZFBhZ2VzOiBtYXRjaGVkUGFnZXMsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuaXNNYXRjaFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBwYWdlLCBwYXJlbnRUaHJlcywgZGVidWcpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgdGhyZXMgPSAoX2EgPSBwYWdlLnRocmVzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwYXJlbnRUaHJlcztcbiAgICAgICAgdmFyIGlzU2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1cIikpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBwYWdlLnBvaW50c1tpXTtcbiAgICAgICAgICAgIHZhciBjb2xvciA9IGdldEltYWdlQ29sb3IoaW1hZ2UsIHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgdmFyIHNjb3JlID0gdXRpbHNfMS5VdGlscy5pZGVudGl0eUNvbG9yKHBvaW50LCBjb2xvcik7XG4gICAgICAgICAgICB2YXIgaXNQb2ludENvbG9yTWF0Y2ggPSBzY29yZSA+PSB0aHJlcztcbiAgICAgICAgICAgIGlmICghaXNQb2ludENvbG9yTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpc1NhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0ltcGwoZGVidWcsIFwicG9pbnRbXCIuY29uY2F0KGksIFwiXSBtYXRjaCBmYWxzZTogc2NvcmU6IFwiKS5jb25jYXQoc2NvcmUsIFwiLCB0aHJlczogXCIpLmNvbmNhdCh0aHJlcywgXCJcXG5cIiksIFwiZXhwZWN0OiBcIi5jb25jYXQodXRpbHNfMS5VdGlscy5mb3JtYXRYWVJHQihwb2ludCksIFwiXFxuXCIpLCBcIiAgIGdldDogXCIuY29uY2F0KHV0aWxzXzEuVXRpbHMuZm9ybWF0WFlSR0IoX19hc3NpZ24oX19hc3NpZ24oe30sIGNvbG9yKSwgeyB4OiBwb2ludC54LCB5OiBwb2ludC55IH0pKSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW1wbChkZWJ1ZywgXCJjaGVja01hdGNoUGFnZVtcIi5jb25jYXQocGFnZS5uYW1lLCBcIl1bbWF0Y2g6IFwiKS5jb25jYXQoaXNTYW1lLCBcIl1cIikpO1xuICAgICAgICByZXR1cm4gaXNTYW1lO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmlzTWF0Y2hHcm91cFBhZ2VJbXBsID0gZnVuY3Rpb24gKGltYWdlLCBncm91cFBhZ2UsIHBhcmVudFRocmVzLCBkZWJ1Zykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciB0aHJlcyA9IChfYSA9IGdyb3VwUGFnZS50aHJlcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyZW50VGhyZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBQYWdlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGdyb3VwUGFnZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHZhciBpc1BhZ2VNYXRjaCA9IHRoaXMuaXNNYXRjaFBhZ2VJbXBsKGltYWdlLCBwYWdlLCB0aHJlcywgZGVidWcpO1xuICAgICAgICAgICAgdGhpcy5sb2dJbXBsKGRlYnVnLCBcImNoZWNrTWF0Y2hHcm91cFBhZ2U6IFwiLmNvbmNhdChncm91cFBhZ2UubmFtZSwgXCIsIHBhZ2VbXCIpLmNvbmNhdChpLCBcIl06IFwiKS5jb25jYXQocGFnZS5uYW1lLCBcIiBtYXRjaDogXCIpLmNvbmNhdChpc1BhZ2VNYXRjaCkpO1xuICAgICAgICAgICAgaWYgKGdyb3VwUGFnZS5tYXRjaE9QID09PSAnfHwnICYmIGlzUGFnZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwYWdlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncm91cFBhZ2UubWF0Y2hPUCA9PT0gJyYmJyAmJiAhaXNQYWdlTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwUGFnZS5tYXRjaE9QID09PSAnJiYnID8gZ3JvdXBQYWdlLnBhZ2VzIDogW107XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUuc2F2ZVBhZ2VSZWZlcmVuY2VJbWFnZSA9IGZ1bmN0aW9uIChpbWFnZSwgbWF0Y2hlZFBhZ2VzKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMucmVyb3V0ZXJDb25maWcuc2F2ZVBhZ2VSZWZlcmVuY2UgfHwge30sIGVuYWJsZSA9IF9hLmVuYWJsZSwgZm9sZGVyUGF0aCA9IF9hLmZvbGRlclBhdGgsIHJnYmEgPSBfYS5yZ2JhO1xuICAgICAgICBpZiAoIWVuYWJsZSB8fCAhZm9sZGVyUGF0aCB8fCBtYXRjaGVkUGFnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbWF0Y2hlZFBhZ2VzLmZvckVhY2goZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2F2ZVBvaW50c01hcmtlZEltYWdlKHtcbiAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2UsXG4gICAgICAgICAgICAgICAgbmFtZTogcGFnZS5uYW1lLFxuICAgICAgICAgICAgICAgIHBvaW50czogcGFnZS5wb2ludHMsXG4gICAgICAgICAgICAgICAgZm9sZGVyUGF0aDogZm9sZGVyUGF0aCxcbiAgICAgICAgICAgICAgICByZ2JhOiByZ2JhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVyb3V0ZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0ltcGwuYXBwbHkodGhpcywgX19zcHJlYWRBcnJheShbdGhpcy5kZWJ1Z10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICBSZXJvdXRlci5wcm90b3R5cGUubG9nSW1wbCA9IGZ1bmN0aW9uIChkZWJ1Zykge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlYnVnIHx8ICF0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25seSBsb2cgd2hlbiBkZWJ1ZyArIHRoaXMuZGVidWcgaXMgdHJ1ZVxuICAgICAgICB1dGlsc18xLlV0aWxzLmxvZy5hcHBseSh1dGlsc18xLlV0aWxzLCBfX3NwcmVhZEFycmF5KFsnW1Jlcm91dGVyXVtkZWJ1Z10nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFJlcm91dGVyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHV0aWxzXzEuVXRpbHMubG9nLmFwcGx5KHV0aWxzXzEuVXRpbHMsIF9fc3ByZWFkQXJyYXkoWydbUmVyb3V0ZXJdW3dhcm5pbmddJ10sIGFyZ3MsIGZhbHNlKSk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVyb3V0ZXI7XG59KCkpO1xuZXhwb3J0cy5SZXJvdXRlciA9IFJlcm91dGVyO1xuLy8gTk9URTogdGhpcyBpcyBhbiBhbm90aGVyIHdheSB0aGF0IHJlc2V0cyBSZXJvdXRlciwganVzdCBsZWF2aW5nIGhlcmUgZm9yIG1lbW9yeVxuLy8gY29uc3QgcmVyb3V0ZXJDb250YWluZXIgPSB7XG4vLyAgIGluc3RhbmNlOiBuZXcgUmVyb3V0ZXIoKSxcbi8vIH07XG4vLyBpbXBvcnQgJ3Byb3h5LXBvbHlmaWxsJztcbi8vIGV4cG9ydCBjb25zdCByZXJvdXRlcjogUmVyb3V0ZXIgPSBuZXcgUHJveHkocmVyb3V0ZXJDb250YWluZXIsIHtcbi8vICAgZ2V0OiAodGFyZ2V0LCBwcm9wOiBrZXlvZiBSZXJvdXRlcikgPT4ge1xuLy8gICAgIHJldHVybiB0YXJnZXQuaW5zdGFuY2VbcHJvcF07XG4vLyAgIH0sXG4vLyAgIHNldDogKHRhcmdldCwgcHJvcDoga2V5b2YgUmVyb3V0ZXIsIHZhbHVlOiBhbnkpID0+IHtcbi8vICAgICB0YXJnZXQuaW5zdGFuY2VbcHJvcF0gPSB2YWx1ZTtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfSxcbi8vIH0pIGFzIGFueSBhcyBSZXJvdXRlcjtcbmV4cG9ydHMucmVyb3V0ZXIgPSBuZXcgUmVyb3V0ZXIoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcm91dGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TY3JlZW4gPSB2b2lkIDA7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIFNjcmVlbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTY3JlZW4oY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cbiAgICBTY3JlZW4ucHJvdG90eXBlLmNhbGN1bGF0ZURldmljZU9mZnNldCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gZnVuYyh0aGlzKTtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuV2lkdGggPSByZXN1bHRzLnNjcmVlbldpZHRoO1xuICAgICAgICB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQgPSByZXN1bHRzLnNjcmVlbkhlaWdodDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WCA9IHJlc3VsdHMuc2NyZWVuT2Zmc2V0WDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSA9IHJlc3VsdHMuc2NyZWVuT2Zmc2V0WTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWCA9IGZ1bmN0aW9uIChkZXZYKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFggKyAoZGV2WCAqIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoKSAvIHRoaXMuY29uZmlnLmRldldpZHRoKSB8fCAwO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5ZID0gZnVuY3Rpb24gKGRldlkpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5jb25maWcuc2NyZWVuT2Zmc2V0WSArIChkZXZZICogdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0KSAvIHRoaXMuY29uZmlnLmRldkhlaWdodCkgfHwgMDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0U2NyZWVuWFkgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0U2NyZWVuWFkgd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXAgPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgdGFwKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICB0YXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXBEb3duID0gZnVuY3Rpb24gKHAxLCBwMikge1xuICAgICAgICBpZiAocDIgPT09IHZvaWQgMCkgeyBwMiA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAodHlwZW9mIHAxID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEueCk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMS55KTtcbiAgICAgICAgICAgIHRhcERvd24oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcDEgPT09ICdudW1iZXInICYmIHR5cGVvZiBwMiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxKTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAyKTtcbiAgICAgICAgICAgIHRhcERvd24oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5tb3ZlVG8gPSBmdW5jdGlvbiAocDEsIHAyKSB7XG4gICAgICAgIGlmIChwMiA9PT0gdm9pZCAwKSB7IHAyID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0eXBlb2YgcDEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMS54KTtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JlZW5ZKHAxLnkpO1xuICAgICAgICAgICAgbW92ZVRvKHgsIHksIHRoaXMuY29uZmlnLmFjdGlvbkR1cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuZ2V0U2NyZWVuWChwMSk7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuZ2V0U2NyZWVuWShwMik7XG4gICAgICAgICAgICBtb3ZlVG8oeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS50YXBVcCA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy5nZXRTY3JlZW5YKHAxLngpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDEueSk7XG4gICAgICAgICAgICB0YXBVcCh4LCB5LCB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwMSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHAyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmdldFNjcmVlblgocDEpO1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcmVlblkocDIpO1xuICAgICAgICAgICAgdGFwVXAoeCwgeSwgdGhpcy5jb25maWcuYWN0aW9uRHVyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhcERvd24gd3JvbmcgcGFyYW1zIFwiLmNvbmNhdChwMSwgXCIsIFwiKS5jb25jYXQocDIpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRTY3JlZW5Db2xvciA9IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICAgICAgaWYgKHAyID09PSB2b2lkIDApIHsgcDIgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwMSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciBpbWcgPSB0aGlzLmdldEN2dERldlNjcmVlbnNob3QoKTtcbiAgICAgICAgICAgIHZhciByZ2IgPSBnZXRJbWFnZUNvbG9yKGltZywgcDEueCwgcDEueSk7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgICAgIHJldHVybiByZ2I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHAxID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgcDIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgICAgICB2YXIgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWcsIHAxLCBwMik7XG4gICAgICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgICAgIHJldHVybiByZ2I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0YXBEb3duIHdyb25nIHBhcmFtcyBcIi5jb25jYXQocDEsIFwiLCBcIikuY29uY2F0KHAyKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZmluZEltYWdlID0gZnVuY3Rpb24gKGRldkltZykge1xuICAgICAgICB2YXIgaW1nID0gdGhpcy5nZXRDdnREZXZTY3JlZW5zaG90KCk7XG4gICAgICAgIHZhciByZXN1bHQgPSBmaW5kSW1hZ2UoaW1nLCBkZXZJbWcpO1xuICAgICAgICByZWxlYXNlSW1hZ2UoaW1nKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUudGFwSW1hZ2UgPSBmdW5jdGlvbiAoZGV2SW1nKSB7XG4gICAgICAgIHZhciB4eSA9IHRoaXMuZmluZEltYWdlKGRldkltZyk7XG4gICAgICAgIHRoaXMudGFwKHh5KTtcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuaXNTYW1lQ29sb3IgPSBmdW5jdGlvbiAoZGV2Q29sb3JQb2ludCwgdGhyZXMpIHtcbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSAwLjk7IH1cbiAgICAgICAgdmFyIHJnYiA9IHRoaXMuZ2V0U2NyZWVuQ29sb3IoZGV2Q29sb3JQb2ludCk7XG4gICAgICAgIHZhciBzY29yZSA9IHV0aWxzXzEuVXRpbHMuaWRlbnRpdHlDb2xvcihyZ2IsIGRldkNvbG9yUG9pbnQpO1xuICAgICAgICBpZiAoc2NvcmUgPiB0aHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5pc1NhbWVDb2xvckltYWdlID0gZnVuY3Rpb24gKGRldkNvbG9yUG9pbnQsIGltYWdlLCB0aHJlcykge1xuICAgICAgICBpZiAodGhyZXMgPT09IHZvaWQgMCkgeyB0aHJlcyA9IDAuOTsgfVxuICAgICAgICB2YXIgcmdiID0gZ2V0SW1hZ2VDb2xvcihpbWFnZSwgZGV2Q29sb3JQb2ludC54LCBkZXZDb2xvclBvaW50LnkpO1xuICAgICAgICB2YXIgc2NvcmUgPSB1dGlsc18xLlV0aWxzLmlkZW50aXR5Q29sb3IocmdiLCBkZXZDb2xvclBvaW50KTtcbiAgICAgICAgaWYgKHNjb3JlID4gdGhyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8vIGN1cnJlbnRseSByZWFsIGRldmljZSBzY3JlZW5zaG90XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXREZXZpY2VTY3JlZW5zaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdCgpO1xuICAgIH07XG4gICAgLy8gY3VycmVudGx5IGRldmljZSBzY3JlZW5zaG90IGN1dCBieSBvZmZzZXRcbiAgICBTY3JlZW4ucHJvdG90eXBlLmdldFNjcmVlblNjcmVlbnNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JlZW5zaG90TW9kaWZ5KHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFgsIHRoaXMuY29uZmlnLnNjcmVlbk9mZnNldFksIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIHRoaXMuY29uZmlnLnNjcmVlbldpZHRoLCB0aGlzLmNvbmZpZy5zY3JlZW5IZWlnaHQsIDEwMCk7XG4gICAgfTtcbiAgICBTY3JlZW4ucHJvdG90eXBlLmNoZWNrQW5kU2F2ZVNjcmVlbnNob3RzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcubG9nU2NyZWVuc2hvdEZvbGRlciAhPT0gJycgJiYgRGF0ZS5ub3coKSAtIHRoaXMuY29uZmlnLmxvZ1NjcmVlbnNob3RMYXN0VGltZSA+IHRoaXMuY29uZmlnLmxvZ1NjcmVlbnNob3RNaW5JbnRlcnZhbEluU2VjICogMTAwMCkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcubG9nU2NyZWVuc2hvdExhc3RUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHV0aWxzXzEuVXRpbHMuc2F2ZVNjcmVlbnNob3RUb0Rpc2sodGhpcy5jb25maWcubG9nU2NyZWVuc2hvdEZvbGRlciwgJ2xvZycpO1xuICAgICAgICAgICAgdXRpbHNfMS5VdGlscy5yZW1vdmVPbGRlc3RGaWxlc0lmRXhjZWVkc0xpbWl0KHRoaXMuY29uZmlnLmxvZ1NjcmVlbnNob3RGb2xkZXIsIHRoaXMuY29uZmlnLmxvZ1NjcmVlbnNob3RNYXhGaWxlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0Q3Z0RGV2U2NyZWVuc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja0FuZFNhdmVTY3JlZW5zaG90cygpO1xuICAgICAgICByZXR1cm4gZ2V0U2NyZWVuc2hvdE1vZGlmeSh0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRYLCB0aGlzLmNvbmZpZy5zY3JlZW5PZmZzZXRZLCB0aGlzLmNvbmZpZy5zY3JlZW5XaWR0aCwgdGhpcy5jb25maWcuc2NyZWVuSGVpZ2h0LCB0aGlzLmNvbmZpZy5kZXZXaWR0aCwgdGhpcy5jb25maWcuZGV2SGVpZ2h0LCAxMDApO1xuICAgIH07XG4gICAgU2NyZWVuLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hID0gZ2V0U2NyZWVuU2l6ZSgpLCB3aWR0aCA9IF9hLndpZHRoLCBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuZ2V0SW1hZ2VSb3RhdGlvbiA9IGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICB2YXIgX2EgPSBnZXRJbWFnZVNpemUoaW1hZ2UpLCB3aWR0aCA9IF9hLndpZHRoLCBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdob3Jpem9udGFsJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9O1xuICAgIFNjcmVlbi5wcm90b3R5cGUuc2V0QWN0aW9uRHVyaW5nID0gZnVuY3Rpb24gKGR1cmluZykge1xuICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25EdXJpbmcgPSBkdXJpbmc7XG4gICAgfTtcbiAgICBTY3JlZW4uZGVidWcgPSBmYWxzZTtcbiAgICByZXR1cm4gU2NyZWVuO1xufSgpKTtcbmV4cG9ydHMuU2NyZWVuID0gU2NyZWVuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NyZWVuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5EZWZhdWx0U2NyZWVuQ29uZmlnID0gZXhwb3J0cy5EZWZhdWx0UmVyb3V0ZXJDb25maWcgPSBleHBvcnRzLkRlZmF1bHRDb25maWdWYWx1ZSA9IGV4cG9ydHMuR3JvdXBQYWdlID0gZXhwb3J0cy5QYWdlID0gdm9pZCAwO1xudmFyIFBhZ2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFnZShuYW1lLCBkZXZQb2ludHMsIG5leHQsIGJhY2ssIHRocmVzKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSB2b2lkIDApIHsgbmV4dCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICBpZiAoYmFjayA9PT0gdm9pZCAwKSB7IGJhY2sgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKHRocmVzID09PSB2b2lkIDApIHsgdGhyZXMgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBkZXZQb2ludHM7XG4gICAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gICAgICAgIHRoaXMuYmFjayA9IGJhY2s7XG4gICAgICAgIHRoaXMudGhyZXMgPSB0aHJlcztcbiAgICB9XG4gICAgcmV0dXJuIFBhZ2U7XG59KCkpO1xuZXhwb3J0cy5QYWdlID0gUGFnZTtcbnZhciBHcm91cFBhZ2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR3JvdXBQYWdlKG5hbWUsIHBhZ2VzLCBuZXh0LCBiYWNrLCB0aHJlcywgbWF0Y2hPUCkge1xuICAgICAgICBpZiAobmV4dCA9PT0gdm9pZCAwKSB7IG5leHQgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgaWYgKGJhY2sgPT09IHZvaWQgMCkgeyBiYWNrID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmICh0aHJlcyA9PT0gdm9pZCAwKSB7IHRocmVzID0gdW5kZWZpbmVkOyB9XG4gICAgICAgIGlmIChtYXRjaE9QID09PSB2b2lkIDApIHsgbWF0Y2hPUCA9IHVuZGVmaW5lZDsgfVxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnBhZ2VzID0gcGFnZXM7XG4gICAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG4gICAgICAgIHRoaXMuYmFjayA9IGJhY2s7XG4gICAgICAgIHRoaXMudGhyZXMgPSB0aHJlcztcbiAgICAgICAgdGhpcy5tYXRjaE9QID0gbWF0Y2hPUCB8fCAnfHwnO1xuICAgIH1cbiAgICByZXR1cm4gR3JvdXBQYWdlO1xufSgpKTtcbmV4cG9ydHMuR3JvdXBQYWdlID0gR3JvdXBQYWdlO1xuZXhwb3J0cy5EZWZhdWx0Q29uZmlnVmFsdWUgPSB7XG4gICAgWFlSR0JUaHJlczogMC45LFxuICAgIFBhZ2VUaHJlczogMC45LFxuICAgIEdyb3VwUGFnZVRocmVzOiAwLjksXG4gICAgR3JvdXBQYWdlTWF0Y2hPUDogJ3x8JyxcbiAgICBSb3V0ZUNvbmZpZ1Nob3VsZE1hdGNoVGltZXM6IDEsXG4gICAgUm91dGVDb25maWdTaG91bGRNYXRjaER1cmluZzogMCxcbiAgICBSb3V0ZUNvbmZpZ0JlZm9yZUFjdGlvbkRlbGF5OiAyNTAsXG4gICAgUm91dGVDb25maWdBZnRlckFjdGlvbkRlbGF5OiAyNTAsXG4gICAgUm91dGVDb25maWdQcmlvcml0eTogMSxcbiAgICBSb3V0ZUNvbmZpZ0RlYnVnOiBmYWxzZSxcbiAgICBUYXNrQ29uZmlnTWF4VGFza1J1blRpbWVzOiAxLFxuICAgIFRhc2tDb25maWdNYXhUYXNrRHVyaW5nOiAwLFxuICAgIFRhc2tDb25maWdNaW5Sb3VuZEludGVydmFsOiAwLFxuICAgIFRhc2tDb25maWdBdXRvU3RvcDogZmFsc2UsXG4gICAgVGFza0NvbmZpZ0ZpbmRSb3V0ZURlbGF5OiAyMDAwLFxufTtcbmV4cG9ydHMuRGVmYXVsdFJlcm91dGVyQ29uZmlnID0ge1xuICAgIHBhY2thZ2VOYW1lOiAnJyxcbiAgICB0YXNrRGVsYXk6IDIwMDAsXG4gICAgc3RhcnRBcHBEZWxheTogNjAwMCxcbiAgICBhdXRvTGF1bmNoQXBwOiB0cnVlLFxuICAgIHRlc3RpbmdTY3JlZW5zaG90UGF0aDogJy4vc2NyZWVuc2hvdCcsXG4gICAgZGV2aWNlSWQ6ICcnLFxuICAgIHN0cmljdE1vZGU6IGZhbHNlLFxuICAgIGRlYnVnU2xhY2tVcmw6ICcnLFxuICAgIHNhdmVJbWFnZVJvb3Q6ICcvc2RjYXJkL1BpY3R1cmVzL1NjcmVlbnNob3RzL3JvYm90bW9uJyxcbn07XG5leHBvcnRzLkRlZmF1bHRTY3JlZW5Db25maWcgPSB7XG4gICAgZGV2V2lkdGg6IDY0MCxcbiAgICBkZXZIZWlnaHQ6IDM2MCxcbiAgICBkZXZpY2VXaWR0aDogMCxcbiAgICBkZXZpY2VIZWlnaHQ6IDAsXG4gICAgc2NyZWVuV2lkdGg6IDAsXG4gICAgc2NyZWVuSGVpZ2h0OiAwLFxuICAgIHNjcmVlbk9mZnNldFg6IDAsXG4gICAgc2NyZWVuT2Zmc2V0WTogMCxcbiAgICBhY3Rpb25EdXJpbmc6IDE4MCxcbiAgICByb3RhdGlvbjogJ2hvcml6b250YWwnLFxuICAgIGxvZ1NjcmVlbnNob3RMYXN0VGltZTogMCxcbiAgICBsb2dTY3JlZW5zaG90TWluSW50ZXJ2YWxJblNlYzogMTAsXG4gICAgbG9nU2NyZWVuc2hvdE1heEZpbGVzOiAxMDAsXG4gICAgbG9nU2NyZWVuc2hvdEZvbGRlcjogJycsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RydWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5VdGlscyA9IGV4cG9ydHMubG9nID0gdm9pZCAwO1xuZnVuY3Rpb24gbG9nKCkge1xuICAgIHZhciBtc2dzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgbXNnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywge1xuICAgICAgICB0aW1lWm9uZTogJ0FzaWEvVGFpcGVpJyxcbiAgICB9KTtcbiAgICB2YXIgbWVzc2FnZSA9IFwiW1wiLmNvbmNhdChkYXRlLCBcIl0gXCIpO1xuICAgIGZvciAodmFyIF9hID0gMCwgbXNnc18xID0gbXNnczsgX2EgPCBtc2dzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgIHZhciBtc2cgPSBtc2dzXzFbX2FdO1xuICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJcIi5jb25jYXQoSlNPTi5zdHJpbmdpZnkobXNnKSwgXCIgXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIlwiLmNvbmNhdChtc2csIFwiIFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlLnN1YnN0cigwLCBtZXNzYWdlLmxlbmd0aCAtIDEpKTtcbn1cbmV4cG9ydHMubG9nID0gbG9nO1xudmFyIFV0aWxzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFV0aWxzKCkge1xuICAgIH1cbiAgICBVdGlscy5pZGVudGl0eUNvbG9yID0gZnVuY3Rpb24gKGUxLCBlMikge1xuICAgICAgICB2YXIgbWVhbiA9IChlMS5yICsgZTIucikgLyAyO1xuICAgICAgICB2YXIgciA9IGUxLnIgLSBlMi5yO1xuICAgICAgICB2YXIgZyA9IGUxLmcgLSBlMi5nO1xuICAgICAgICB2YXIgYiA9IGUxLmIgLSBlMi5iO1xuICAgICAgICByZXR1cm4gMSAtIE1hdGguc3FydCgoKCg1MTIgKyBtZWFuKSAqIHIgKiByKSA+PiA4KSArIDQgKiBnICogZyArICgoKDc2NyAtIG1lYW4pICogYiAqIGIpID4+IDgpKSAvIDc2ODtcbiAgICB9O1xuICAgIFV0aWxzLmZvcm1hdFhZUkdCID0gZnVuY3Rpb24gKHh5cmdiKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoeHlyZ2IpO1xuICAgICAgICB2YXIgZm9ybWF0T2JqID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICB2YXIgc3RyID0gXCJcIi5jb25jYXQoeHlyZ2Jba10pO1xuICAgICAgICAgICAgd2hpbGUgKHN0ci5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJyAnICsgc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9ybWF0T2JqW2tdID0gc3RyO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4ID0gZm9ybWF0T2JqLngsIHkgPSBmb3JtYXRPYmoueSwgciA9IGZvcm1hdE9iai5yLCBnID0gZm9ybWF0T2JqLmcsIGIgPSBmb3JtYXRPYmouYjtcbiAgICAgICAgcmV0dXJuIFwieyB4OiBcIi5jb25jYXQoeCwgXCIsIHk6IFwiKS5jb25jYXQoeSwgXCIsIHI6IFwiKS5jb25jYXQociwgXCIsIGc6IFwiKS5jb25jYXQoZywgXCIsIGI6IFwiKS5jb25jYXQoYiwgXCIgfVwiKTtcbiAgICB9O1xuICAgIFV0aWxzLnNvcnRTdHJpbmdOdW1iZXJNYXAgPSBmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtYXApIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7IGtleToga2V5LCBjb3VudDogbWFwW2tleV0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiLmNvdW50IC0gYS5jb3VudDsgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG4gICAgVXRpbHMuc2xlZXAgPSBmdW5jdGlvbiAoZHVyaW5nKSB7XG4gICAgICAgIHdoaWxlIChkdXJpbmcgPiAyMDApIHtcbiAgICAgICAgICAgIGR1cmluZyAtPSAyMDA7XG4gICAgICAgICAgICBzbGVlcCgyMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkdXJpbmcgPiAwKSB7XG4gICAgICAgICAgICBzbGVlcChkdXJpbmcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5nZXRUYWl3YW5UaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSArIDggKiA2MCAqIDYwICogMTAwMDtcbiAgICB9O1xuICAgIFV0aWxzLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tpXSA9IEpTT04uc3RyaW5naWZ5KGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShVdGlscy5nZXRUYWl3YW5UaW1lKCkpO1xuICAgICAgICB2YXIgZGF0ZVN0cmluZyA9IFwiW1wiLmNvbmNhdChkYXRlLmdldE1vbnRoKCkgKyAxLCBcIi1cIikuY29uY2F0KGRhdGUuZ2V0RGF0ZSgpLCBcIlRcIikuY29uY2F0KGRhdGUuZ2V0SG91cnMoKSwgXCI6XCIpLmNvbmNhdChkYXRlLmdldE1pbnV0ZXMoKSwgXCI6XCIpLmNvbmNhdChkYXRlLmdldFNlY29uZHMoKSwgXCJdXCIpO1xuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBfX3NwcmVhZEFycmF5KFtkYXRlU3RyaW5nXSwgYXJncywgZmFsc2UpKTtcbiAgICB9O1xuICAgIFV0aWxzLm5vdGlmeUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBjb250ZW50KSB7XG4gICAgICAgIGlmIChzZW5kRXZlbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBVdGlscy5sb2coJ3NlbmRFdmVudCcsIGV2ZW50LCBjb250ZW50KTtcbiAgICAgICAgICAgIHNlbmRFdmVudCgnJyArIGV2ZW50LCAnJyArIGNvbnRlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zdGFydEFwcCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICBleGVjdXRlKFwiQk9PVENMQVNTUEFUSD0vc3lzdGVtL2ZyYW1ld29yay9jb3JlLmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrMi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9zZXJ2aWNlcy5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvd2Vidmlld2Nocm9taXVtLmphciBhbSBzdGFydCAtbiBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtb2ouamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtbGliYXJ0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9vcmcuYXBhY2hlLmh0dHAubGVnYWN5LmJvb3QuamFyIGFtIHN0YXJ0IC1uIFwiLmNvbmNhdChwYWNrYWdlTmFtZSkpO1xuICAgICAgICBleGVjdXRlKFwiQU5EUk9JRF9EQVRBPS9kYXRhIG1vbmtleSAtLXBjdC1zeXNrZXlzIDAgLXAgXCIuY29uY2F0KHBhY2thZ2VOYW1lLCBcIiAtYyBhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUiAxXCIpKTtcbiAgICAgICAgZXhlY3V0ZSgnQU5EUk9JRF9CT09UTE9HTz0xICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfUk9PVD0vc3lzdGVtICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfQVNTRVRTPS9zeXN0ZW0vYXBwICcgK1xuICAgICAgICAgICAgJ0FORFJPSURfREFUQT0vZGF0YSAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1NUT1JBR0U9L3N0b3JhZ2UgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9BUlRfUk9PVD0vYXBleC9jb20uYW5kcm9pZC5hcnQgJyArXG4gICAgICAgICAgICAnQU5EUk9JRF9JMThOX1JPT1Q9L2FwZXgvY29tLmFuZHJvaWQuaTE4biAnICtcbiAgICAgICAgICAgICdBTkRST0lEX1RaREFUQV9ST09UPS9hcGV4L2NvbS5hbmRyb2lkLnR6ZGF0YSAnICtcbiAgICAgICAgICAgICdFWFRFUk5BTF9TVE9SQUdFPS9zZGNhcmQgJyArXG4gICAgICAgICAgICAnQVNFQ19NT1VOVFBPSU5UPS9tbnQvYXNlYyAnICtcbiAgICAgICAgICAgICdCT09UQ0xBU1NQQVRIPS9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtb2ouamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2NvcmUtbGliYXJ0LmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWljdTRqLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9va2h0dHAuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2JvdW5jeWNhc3RsZS5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvYXBhY2hlLXhtbC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9pbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmstYXRiLWJhY2t3YXJkLWNvbXBhdGliaWxpdHkuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmNvbnNjcnlwdC9qYXZhbGliL2NvbnNjcnlwdC5qYXI6L2FwZXgvY29tLmFuZHJvaWQubWVkaWEvamF2YWxpYi91cGRhdGFibGUtbWVkaWEuamFyOi9hcGV4L2NvbS5hbmRyb2lkLm1lZGlhcHJvdmlkZXIvamF2YWxpYi9mcmFtZXdvcmstbWVkaWFwcm92aWRlci5qYXI6L2FwZXgvY29tLmFuZHJvaWQub3Muc3RhdHNkL2phdmFsaWIvZnJhbWV3b3JrLXN0YXRzZC5qYXI6L2FwZXgvY29tLmFuZHJvaWQucGVybWlzc2lvbi9qYXZhbGliL2ZyYW1ld29yay1wZXJtaXNzaW9uLmphcjovYXBleC9jb20uYW5kcm9pZC5zZGtleHQvamF2YWxpYi9mcmFtZXdvcmstc2RrZXh0ZW5zaW9ucy5qYXI6L2FwZXgvY29tLmFuZHJvaWQud2lmaS9qYXZhbGliL2ZyYW1ld29yay13aWZpLmphcjovYXBleC9jb20uYW5kcm9pZC50ZXRoZXJpbmcvamF2YWxpYi9mcmFtZXdvcmstdGV0aGVyaW5nLmphciAnICtcbiAgICAgICAgICAgICdERVgyT0FUQk9PVENMQVNTUEFUSD0vYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLW9qLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9jb3JlLWxpYmFydC5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvY29yZS1pY3U0ai5qYXI6L2FwZXgvY29tLmFuZHJvaWQuYXJ0L2phdmFsaWIvb2todHRwLmphcjovYXBleC9jb20uYW5kcm9pZC5hcnQvamF2YWxpYi9ib3VuY3ljYXN0bGUuamFyOi9hcGV4L2NvbS5hbmRyb2lkLmFydC9qYXZhbGliL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay90ZWxlcGhvbnktY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay92b2lwLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvaW1zLWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZnJhbWV3b3JrLWF0Yi1iYWNrd2FyZC1jb21wYXRpYmlsaXR5LmphciAnICtcbiAgICAgICAgICAgICdTWVNURU1TRVJWRVJDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29tLmFuZHJvaWQubG9jYXRpb24ucHJvdmlkZXIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3NlcnZpY2VzLmphcjovc3lzdGVtL2ZyYW1ld29yay9ldGhlcm5ldC1zZXJ2aWNlLmphcjovYXBleC9jb20uYW5kcm9pZC5wZXJtaXNzaW9uL2phdmFsaWIvc2VydmljZS1wZXJtaXNzaW9uLmphcjovYXBleC9jb20uYW5kcm9pZC5pcHNlYy9qYXZhbGliL2FuZHJvaWQubmV0Lmlwc2VjLmlrZS5qYXIgJyArXG4gICAgICAgICAgICBcIm1vbmtleSAtLXBjdC1zeXNrZXlzIDAgLXAgXCIuY29uY2F0KHBhY2thZ2VOYW1lLCBcIiAtYyBhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUiAxXCIpKTtcbiAgICB9O1xuICAgIFV0aWxzLnN0b3BBcHAgPSBmdW5jdGlvbiAocGFja2FnZU5hbWUpIHtcbiAgICAgICAgZXhlY3V0ZShcIkJPT1RDTEFTU1BBVEg9L3N5c3RlbS9mcmFtZXdvcmsvY29yZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29uc2NyeXB0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9va2h0dHAuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtanVuaXQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2JvdW5jeWNhc3RsZS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvZXh0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9mcmFtZXdvcmsuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yazIuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3RlbGVwaG9ueS1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3ZvaXAtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9tbXMtY29tbW9uLmphcjovc3lzdGVtL2ZyYW1ld29yay9hbmRyb2lkLnBvbGljeS5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvc2VydmljZXMuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FwYWNoZS14bWwuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL3dlYnZpZXdjaHJvbWl1bS5qYXIgYW0gZm9yY2Utc3RvcCBcIi5jb25jYXQocGFja2FnZU5hbWUpKTtcbiAgICAgICAgZXhlY3V0ZShcIkFORFJPSURfREFUQT0vZGF0YSBCT09UQ0xBU1NQQVRIPS9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtb2ouamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2NvcmUtbGliYXJ0Lmphcjovc3lzdGVtL2ZyYW1ld29yay9jb25zY3J5cHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL29raHR0cC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvY29yZS1qdW5pdC5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvYm91bmN5Y2FzdGxlLmphcjovc3lzdGVtL2ZyYW1ld29yay9leHQuamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ZyYW1ld29yay5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdGVsZXBob255LWNvbW1vbi5qYXI6L3N5c3RlbS9mcmFtZXdvcmsvdm9pcC1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2ltcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL21tcy1jb21tb24uamFyOi9zeXN0ZW0vZnJhbWV3b3JrL2FuZHJvaWQucG9saWN5Lmphcjovc3lzdGVtL2ZyYW1ld29yay9hcGFjaGUteG1sLmphcjovc3lzdGVtL2ZyYW1ld29yay9vcmcuYXBhY2hlLmh0dHAubGVnYWN5LmJvb3QuamFyIGFtIGZvcmNlLXN0b3AgXCIuY29uY2F0KHBhY2thZ2VOYW1lKSk7XG4gICAgfTtcbiAgICBVdGlscy5nZXRDdXJyZW50QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZXhlY3V0ZSgnZHVtcHN5cyB3aW5kb3cgd2luZG93cycpLnNwbGl0KCdtQ3VycmVudEZvY3VzJyk7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuIFsnJywgJyddO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFsxXS5zcGxpdCgnICcpO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIHJldHVybiBbJycsICcnXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRbMl0gPSByZXN1bHRbMl0ucmVwbGFjZSgnfScsICcnKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0WzJdLnNwbGl0KCcvJyk7XG4gICAgICAgIHZhciBwYWNrYWdlTmFtZSA9ICcnO1xuICAgICAgICB2YXIgYWN0aXZpdHlOYW1lID0gJyc7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lID0gcmVzdWx0WzBdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcGFja2FnZU5hbWUgPSByZXN1bHRbMF0udHJpbSgpO1xuICAgICAgICAgICAgYWN0aXZpdHlOYW1lID0gcmVzdWx0WzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BhY2thZ2VOYW1lLCBhY3Rpdml0eU5hbWVdO1xuICAgIH07XG4gICAgVXRpbHMuaXNBcHBPblRvcCA9IGZ1bmN0aW9uIChwYWNrYWdlTmFtZSkge1xuICAgICAgICB2YXIgdG9wSW5mbyA9IGV4ZWN1dGUoJ2R1bXBzeXMgYWN0aXZpdHkgYWN0aXZpdGllcyB8IGdyZXAgbVJlc3VtZWRBY3Rpdml0eScpO1xuICAgICAgICByZXR1cm4gdG9wSW5mby5pbmRleE9mKHBhY2thZ2VOYW1lKSAhPT0gLTE7XG4gICAgfTtcbiAgICBVdGlscy5zZW5kU2xhY2tNZXNzYWdlID0gZnVuY3Rpb24gKHVybCwgdGl0bGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGJvZHkgPSB7XG4gICAgICAgICAgICBibG9ja3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnKicgKyB0aXRsZSArICcqJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RpdmlkZXInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgICAgaHR0cENsaWVudCgnUE9TVCcsIHVybCwgSlNPTi5zdHJpbmdpZnkoYm9keSksIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVXRpbHMud2FpdEZvckFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24sIHRpbWVvdXQsIG1hdGNoVGltZXMsIGludGVydmFsKSB7XG4gICAgICAgIGlmIChtYXRjaFRpbWVzID09PSB2b2lkIDApIHsgbWF0Y2hUaW1lcyA9IDE7IH1cbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSA2MDA7IH1cbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBtYXRjaHMgPSAwO1xuICAgICAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIG5vdyA8IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb24oKSkge1xuICAgICAgICAgICAgICAgIG1hdGNocysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNocyA+PSBtYXRjaFRpbWVzKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBVdGlscy5zbGVlcChpbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNocyA+PSBtYXRjaFRpbWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBVdGlscy5wYWRaZXJvID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gbnVtIDwgMTAgPyBcIjBcIi5jb25jYXQobnVtKSA6IFwiXCIuY29uY2F0KG51bSk7XG4gICAgfTtcbiAgICBVdGlscy5zYXZlU2NyZWVuc2hvdFRvRGlzayA9IGZ1bmN0aW9uIChmb2xkZXJQYXRoLCBzYXZlUmVhc29uKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHNhdmVSZWFzb24gPSBzYXZlUmVhc29uID09PSB1bmRlZmluZWQgPyAnY3Jhc2gtaW1nJyA6IHNhdmVSZWFzb247XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoVXRpbHMuZ2V0VGFpd2FuVGltZSgpKTtcbiAgICAgICAgdmFyIF9hID0gW2RhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSwgZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIF90aGlzLnBhZFplcm8oaXRlbSk7IH0pLCBZWVlZID0gX2FbMF0sIE1NID0gX2FbMV0sIGRkID0gX2FbMl0sIGhoID0gX2FbM10sIG1tID0gX2FbNF0sIHNzID0gX2FbNV07XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFwiXCIuY29uY2F0KFlZWVksIFwiLVwiKS5jb25jYXQoTU0sIFwiLVwiKS5jb25jYXQoZGQsIFwiVFwiKS5jb25jYXQoaGgsIFwiLlwiKS5jb25jYXQobW0sIFwiLlwiKS5jb25jYXQoc3MsIFwiX1wiKS5jb25jYXQoc2F2ZVJlYXNvbiwgXCIucG5nXCIpO1xuICAgICAgICB2YXIgaW1nID0gZ2V0U2NyZWVuc2hvdCgpO1xuICAgICAgICBzYXZlSW1hZ2UoaW1nLCBcIlwiLmNvbmNhdChmb2xkZXJQYXRoLCBcIi9cIikuY29uY2F0KGZpbGVuYW1lKSk7XG4gICAgICAgIFV0aWxzLmxvZyhcIldyaXRlIHRvIGZpbGU6IFwiLmNvbmNhdChmb2xkZXJQYXRoLCBcIi9cIikuY29uY2F0KGZpbGVuYW1lKSk7XG4gICAgICAgIHJlbGVhc2VJbWFnZShpbWcpO1xuICAgIH07XG4gICAgVXRpbHMucmVtb3ZlT2xkZXN0RmlsZXNJZkV4Y2VlZHNMaW1pdCA9IGZ1bmN0aW9uIChmb2xkZXJQYXRoLCBtYXhGaWxlcykge1xuICAgICAgICBpZiAobWF4RmlsZXMgPT09IHZvaWQgMCkgeyBtYXhGaWxlcyA9IDEwMDsgfVxuICAgICAgICB2YXIgZmlsZUxpc3QgPSBleGVjdXRlKFwibHMgLWwgXCIuY29uY2F0KGZvbGRlclBhdGgpKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIC8vIFNvbWUgT1MgcmV0dXJuIGZpcnN0IGxpbmUgdG90YWwgOCAoTWFjLCByZWRyb2lkKSwgc29tZSBub3QgKE1lbXUpXG4gICAgICAgIGlmIChmaWxlTGlzdFswXSAmJiBmaWxlTGlzdFswXS5pbmRleE9mKCd0b3RhbCcpID09PSAwKSB7XG4gICAgICAgICAgICBmaWxlTGlzdC5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmaWxlc1dpdGhEYXRlcyA9IGZpbGVMaXN0Lm1hcChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gbGluZS50cmltKCkuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdOyAvLyAyMDIzLTA5LTAyVDE1LjA4LjE3X2xvZy5wbmdcbiAgICAgICAgICAgIHZhciBkYXRlT2JqID0gbmV3IERhdGUocGFydHNbcGFydHMubGVuZ3RoIC0gM10uc3BsaXQoJ18nKVswXSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRhdGU6IGRhdGVPYmosXG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbGVzV2l0aERhdGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuZGF0ZS5nZXRUaW1lKCkgLSBiLmRhdGUuZ2V0VGltZSgpOyB9KTtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAke21heEZpbGVzfSBmaWxlcywgcmVtb3ZlIHRoZSBvbGRlc3RcbiAgICAgICAgd2hpbGUgKGZpbGVzV2l0aERhdGVzLmxlbmd0aCA+IG1heEZpbGVzKSB7XG4gICAgICAgICAgICB2YXIgb2xkZXN0RmlsZSA9IGZpbGVzV2l0aERhdGVzLnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAob2xkZXN0RmlsZSkge1xuICAgICAgICAgICAgICAgIGV4ZWN1dGUoXCJybSBcIi5jb25jYXQoZm9sZGVyUGF0aCwgXCIvXCIpLmNvbmNhdChvbGRlc3RGaWxlLmZpbGVuYW1lKSk7XG4gICAgICAgICAgICAgICAgVXRpbHMubG9nKFwicm06IFwiLmNvbmNhdChmb2xkZXJQYXRoLCBcIi9cIikuY29uY2F0KG9sZGVzdEZpbGUuZmlsZW5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgVXRpbHMuam9pblBhdGhzID0gZnVuY3Rpb24gKHBhdGgxLCBwYXRoMikge1xuICAgICAgICBpZiAocGF0aDIgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgxLmNoYXJBdChwYXRoMS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDEgKyBwYXRoMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoMSArICcvJyArIHBhdGgyO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBVdGlscy5zYXZlUG9pbnRzTWFya2VkSW1hZ2UgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGltYWdlID0gX2EuaW1hZ2UsIG5hbWUgPSBfYS5uYW1lLCBwb2ludHMgPSBfYS5wb2ludHMsIGZvbGRlclBhdGggPSBfYS5mb2xkZXJQYXRoLCByZ2JhID0gX2EucmdiYTtcbiAgICAgICAgdmFyIGZpbGVwYXRoID0gXCJcIi5jb25jYXQoZm9sZGVyUGF0aCwgXCIvXCIpLmNvbmNhdChuYW1lLCBcIi5wbmdcIik7XG4gICAgICAgIC8vIGlmIGZpbGUgZXhpc3RzLCBza2lwXG4gICAgICAgIHZhciByZXMgPSBleGVjdXRlKFwidGVzdCAtZSBcIi5jb25jYXQoZmlsZXBhdGgsIFwiICYmIGVjaG8gMVwiKSk7XG4gICAgICAgIGlmIChyZXMgPT09ICcxJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjbG9uZWRJbWcgPSBjbG9uZShpbWFnZSk7XG4gICAgICAgIHZhciBfYiA9IHJnYmEgfHwgeyByOiAyNTUsIGc6IDAsIGI6IDAsIGE6IDI1NSB9LCByID0gX2IuciwgZyA9IF9iLmcsIGIgPSBfYi5iLCBhID0gX2IuYTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IDM7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcG9pbnRzKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSBwb2ludHNbaV0sIHggPSBfYy54LCB5ID0gX2MueTtcbiAgICAgICAgICAgIGRyYXdDaXJjbGUoY2xvbmVkSW1nLCB4LCB5LCByYWRpdXMsIHIsIGcsIGIsIGEpO1xuICAgICAgICB9XG4gICAgICAgIHNhdmVJbWFnZShjbG9uZWRJbWcsIGZpbGVwYXRoKTtcbiAgICAgICAgcmVsZWFzZUltYWdlKGNsb25lZEltZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW3NhdmVQb2ludHNNYXJrZWRJbWFnZV06IFwiLmNvbmNhdChuYW1lKSk7XG4gICAgfTtcbiAgICByZXR1cm4gVXRpbHM7XG59KCkpO1xuZXhwb3J0cy5VdGlscyA9IFV0aWxzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lcy5hcnJheS5maW5kLWluZGV4Jyk7XG52YXIgZW50cnlVbmJpbmQgPSByZXF1aXJlKCcuLi8uLi9pbnRlcm5hbHMvZW50cnktdW5iaW5kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZW50cnlVbmJpbmQoJ0FycmF5JywgJ2ZpbmRJbmRleCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lcy5vYmplY3QuYXNzaWduJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJy4uLy4uL2ludGVybmFscy9wYXRoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0aC5PYmplY3QuYXNzaWduO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0cnlUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90cnktdG8tc3RyaW5nJyk7XG5cbnZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuXG4vLyBgQXNzZXJ0OiBJc0NhbGxhYmxlKGFyZ3VtZW50KSBpcyB0cnVlYFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzQ2FsbGFibGUoYXJndW1lbnQpKSByZXR1cm4gYXJndW1lbnQ7XG4gIHRocm93ICRUeXBlRXJyb3IodHJ5VG9TdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xuXG52YXIgVU5TQ09QQUJMRVMgPSB3ZWxsS25vd25TeW1ib2woJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGU7XG5cbi8vIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuaWYgKEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXSA9PT0gdW5kZWZpbmVkKSB7XG4gIGRlZmluZVByb3BlcnR5KEFycmF5UHJvdG90eXBlLCBVTlNDT1BBQkxFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogY3JlYXRlKG51bGwpXG4gIH0pO1xufVxuXG4vLyBhZGQgYSBrZXkgdG8gQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgQXJyYXlQcm90b3R5cGVbVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyICRTdHJpbmcgPSBTdHJpbmc7XG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYEFzc2VydDogVHlwZShhcmd1bWVudCkgaXMgT2JqZWN0YFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzT2JqZWN0KGFyZ3VtZW50KSkgcmV0dXJuIGFyZ3VtZW50O1xuICB0aHJvdyAkVHlwZUVycm9yKCRTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIGxlbmd0aE9mQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IGxlbmd0aE9mQXJyYXlMaWtlKE8pO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICAgIGlmICh2YWx1ZSAhPT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIGlmICgoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykgJiYgT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBjcmVhdGVNZXRob2QodHJ1ZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2ZcbiAgaW5kZXhPZjogY3JlYXRlTWV0aG9kKGZhbHNlKVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xuXG52YXIgcHVzaCA9IHVuY3VycnlUaGlzKFtdLnB1c2gpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgZm9yRWFjaCwgbWFwLCBmaWx0ZXIsIHNvbWUsIGV2ZXJ5LCBmaW5kLCBmaW5kSW5kZXgsIGZpbHRlclJlamVjdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PT0gNjtcbiAgdmFyIElTX0ZJTFRFUl9SRUpFQ1QgPSBUWVBFID09PSA3O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQsIHNwZWNpZmljQ3JlYXRlKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJbmRleGVkT2JqZWN0KE8pO1xuICAgIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZChjYWxsYmFja2ZuLCB0aGF0KTtcbiAgICB2YXIgbGVuZ3RoID0gbGVuZ3RoT2ZBcnJheUxpa2Uoc2VsZik7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3JlYXRlID0gc3BlY2lmaWNDcmVhdGUgfHwgYXJyYXlTcGVjaWVzQ3JlYXRlO1xuICAgIHZhciB0YXJnZXQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgfHwgSVNfRklMVEVSX1JFSkVDVCA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbHVlLCByZXN1bHQ7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWx1ZSA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzdWx0ID0gYm91bmRGdW5jdGlvbih2YWx1ZSwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgdGFyZ2V0W2luZGV4XSA9IHJlc3VsdDsgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdCkgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWx1ZTsgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHB1c2godGFyZ2V0LCB2YWx1ZSk7ICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmYWxzZTsgICAgICAgICAgICAgLy8gZXZlcnlcbiAgICAgICAgICBjYXNlIDc6IHB1c2godGFyZ2V0LCB2YWx1ZSk7ICAgICAgLy8gZmlsdGVyUmVqZWN0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHRhcmdldDtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4gIGZvckVhY2g6IGNyZWF0ZU1ldGhvZCgwKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5tYXBgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5tYXBcbiAgbWFwOiBjcmVhdGVNZXRob2QoMSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmlsdGVyXG4gIGZpbHRlcjogY3JlYXRlTWV0aG9kKDIpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLnNvbWVgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zb21lXG4gIHNvbWU6IGNyZWF0ZU1ldGhvZCgzKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5ldmVyeWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmV2ZXJ5XG4gIGV2ZXJ5OiBjcmVhdGVNZXRob2QoNCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRcbiAgZmluZDogY3JlYXRlTWV0aG9kKDUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRJbmRleFxuICBmaW5kSW5kZXg6IGNyZWF0ZU1ldGhvZCg2KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZWplY3RgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1hcnJheS1maWx0ZXJpbmdcbiAgZmlsdGVyUmVqZWN0OiBjcmVhdGVNZXRob2QoNylcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1hcnJheScpO1xudmFyIGlzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY29uc3RydWN0b3InKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcbnZhciAkQXJyYXkgPSBBcnJheTtcblxuLy8gYSBwYXJ0IG9mIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheXNwZWNpZXNjcmVhdGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsQXJyYXkpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAoaXNDb25zdHJ1Y3RvcihDKSAmJiAoQyA9PT0gJEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBlbHNlIGlmIChpc09iamVjdChDKSkge1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZiAoQyA9PT0gbnVsbCkgQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/ICRBcnJheSA6IEM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFycmF5U3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxuLy8gYEFycmF5U3BlY2llc0NyZWF0ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5c3BlY2llc2NyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWxBcnJheSwgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgKGFycmF5U3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsQXJyYXkpKShsZW5ndGggPT09IDAgPyAwIDogbGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbnZhciB0b1N0cmluZyA9IHVuY3VycnlUaGlzKHt9LnRvU3RyaW5nKTtcbnZhciBzdHJpbmdTbGljZSA9IHVuY3VycnlUaGlzKCcnLnNsaWNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHN0cmluZ1NsaWNlKHRvU3RyaW5nKGl0KSwgOCwgLTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2ZSYXcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgJE9iamVjdCA9IE9iamVjdDtcblxuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBDT1JSRUNUX0FSR1VNRU5UUyA9IGNsYXNzb2ZSYXcoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG4vLyBnZXR0aW5nIHRhZyBmcm9tIEVTNisgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IGNsYXNzb2ZSYXcgOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIHRhZywgcmVzdWx0O1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAodGFnID0gdHJ5R2V0KE8gPSAkT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRykpID09ICdzdHJpbmcnID8gdGFnXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBDT1JSRUNUX0FSR1VNRU5UUyA/IGNsYXNzb2ZSYXcoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAocmVzdWx0ID0gY2xhc3NvZlJhdyhPKSkgPT09ICdPYmplY3QnICYmIGlzQ2FsbGFibGUoTy5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgb3duS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vd24ta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgZXhjZXB0aW9ucykge1xuICB2YXIga2V5cyA9IG93bktleXMoc291cmNlKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcbiAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZS5mO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBpZiAoIWhhc093bih0YXJnZXQsIGtleSkgJiYgIShleGNlcHRpb25zICYmIGhhc093bihleGNlcHRpb25zLCBrZXkpKSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgbWFrZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbWFrZS1idWlsdC1pbicpO1xudmFyIGRlZmluZUdsb2JhbFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1nbG9iYWwtcHJvcGVydHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMuZW51bWVyYWJsZTtcbiAgdmFyIG5hbWUgPSBvcHRpb25zLm5hbWUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubmFtZSA6IGtleTtcbiAgaWYgKGlzQ2FsbGFibGUodmFsdWUpKSBtYWtlQnVpbHRJbih2YWx1ZSwgbmFtZSwgb3B0aW9ucyk7XG4gIGlmIChvcHRpb25zLmdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2UgZGVmaW5lR2xvYmFsUHJvcGVydHkoa2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghb3B0aW9ucy51bnNhZmUpIGRlbGV0ZSBPW2tleV07XG4gICAgICBlbHNlIGlmIChPW2tleV0pIHNpbXBsZSA9IHRydWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2UgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihPLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiAhb3B0aW9ucy5ub25Db25maWd1cmFibGUsXG4gICAgICB3cml0YWJsZTogIW9wdGlvbnMubm9uV3JpdGFibGVcbiAgICB9KTtcbiAgfSByZXR1cm4gTztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0cnkge1xuICAgIGRlZmluZVByb3BlcnR5KGdsb2JhbCwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gRGV0ZWN0IElFOCdzIGluY29tcGxldGUgZGVmaW5lUHJvcGVydHkgaW1wbGVtZW50YXRpb25cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAxLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KVsxXSAhPT0gNztcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRvY3VtZW50QWxsID0gdHlwZW9mIGRvY3VtZW50ID09ICdvYmplY3QnICYmIGRvY3VtZW50LmFsbDtcblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1Jc0hUTUxEREEtaW50ZXJuYWwtc2xvdFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vbm8tdHlwZW9mLXVuZGVmaW5lZCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xudmFyIElTX0hUTUxEREEgPSB0eXBlb2YgZG9jdW1lbnRBbGwgPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRBbGwgIT09IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFsbDogZG9jdW1lbnRBbGwsXG4gIElTX0hUTUxEREE6IElTX0hUTUxEREFcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBFWElTVFMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBFWElTVFMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJyAmJiBTdHJpbmcobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgJyc7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIERlbm8gPSBnbG9iYWwuRGVubztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyB8fCBEZW5vICYmIERlbm8udmVyc2lvbjtcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4O1xudmFyIG1hdGNoLCB2ZXJzaW9uO1xuXG5pZiAodjgpIHtcbiAgbWF0Y2ggPSB2OC5zcGxpdCgnLicpO1xuICAvLyBpbiBvbGQgQ2hyb21lLCB2ZXJzaW9ucyBvZiBWOCBpc24ndCBWOCA9IENocm9tZSAvIDEwXG4gIC8vIGJ1dCB0aGVpciBjb3JyZWN0IHZlcnNpb25zIGFyZSBub3QgaW50ZXJlc3RpbmcgZm9yIHVzXG4gIHZlcnNpb24gPSBtYXRjaFswXSA+IDAgJiYgbWF0Y2hbMF0gPCA0ID8gMSA6ICsobWF0Y2hbMF0gKyBtYXRjaFsxXSk7XG59XG5cbi8vIEJyb3dzZXJGUyBOb2RlSlMgYHByb2Nlc3NgIHBvbHlmaWxsIGluY29ycmVjdGx5IHNldCBgLnY4YCB0byBgMC4wYFxuLy8gc28gY2hlY2sgYHVzZXJBZ2VudGAgZXZlbiBpZiBgLnY4YCBleGlzdHMsIGJ1dCAwXG5pZiAoIXZlcnNpb24gJiYgdXNlckFnZW50KSB7XG4gIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLyk7XG4gIGlmICghbWF0Y2ggfHwgbWF0Y2hbMV0gPj0gNzQpIHtcbiAgICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvQ2hyb21lXFwvKFxcZCspLyk7XG4gICAgaWYgKG1hdGNoKSB2ZXJzaW9uID0gK21hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SLCBNRVRIT0QpIHtcbiAgcmV0dXJuIHVuY3VycnlUaGlzKGdsb2JhbFtDT05TVFJVQ1RPUl0ucHJvdG90eXBlW01FVEhPRF0pO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGRlZmluZUJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lR2xvYmFsUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWdsb2JhbC1wcm9wZXJ0eScpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAgICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMuZG9udENhbGxHZXRTZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4gIG9wdGlvbnMubmFtZSAgICAgICAgICAgLSB0aGUgLm5hbWUgb2YgdGhlIGZ1bmN0aW9uIGlmIGl0IGRvZXMgbm90IG1hdGNoIHRoZSBrZXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcbiAgdmFyIFRBUkdFVCA9IG9wdGlvbnMudGFyZ2V0O1xuICB2YXIgR0xPQkFMID0gb3B0aW9ucy5nbG9iYWw7XG4gIHZhciBTVEFUSUMgPSBvcHRpb25zLnN0YXQ7XG4gIHZhciBGT1JDRUQsIHRhcmdldCwga2V5LCB0YXJnZXRQcm9wZXJ0eSwgc291cmNlUHJvcGVydHksIGRlc2NyaXB0b3I7XG4gIGlmIChHTE9CQUwpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAoU1RBVElDKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsW1RBUkdFVF0gfHwgZGVmaW5lR2xvYmFsUHJvcGVydHkoVEFSR0VULCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gKGdsb2JhbFtUQVJHRVRdIHx8IHt9KS5wcm90b3R5cGU7XG4gIH1cbiAgaWYgKHRhcmdldCkgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgc291cmNlUHJvcGVydHkgPSBzb3VyY2Vba2V5XTtcbiAgICBpZiAob3B0aW9ucy5kb250Q2FsbEdldFNldCkge1xuICAgICAgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICB0YXJnZXRQcm9wZXJ0eSA9IGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9IGVsc2UgdGFyZ2V0UHJvcGVydHkgPSB0YXJnZXRba2V5XTtcbiAgICBGT1JDRUQgPSBpc0ZvcmNlZChHTE9CQUwgPyBrZXkgOiBUQVJHRVQgKyAoU1RBVElDID8gJy4nIDogJyMnKSArIGtleSwgb3B0aW9ucy5mb3JjZWQpO1xuICAgIC8vIGNvbnRhaW5lZCBpbiB0YXJnZXRcbiAgICBpZiAoIUZPUkNFRCAmJiB0YXJnZXRQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHNvdXJjZVByb3BlcnR5ID09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICBkZWZpbmVCdWlsdEluKHRhcmdldCwga2V5LCBzb3VyY2VQcm9wZXJ0eSwgb3B0aW9ucyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcy1jbGF1c2UnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIE5BVElWRV9CSU5EID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlJyk7XG5cbnZhciBiaW5kID0gdW5jdXJyeVRoaXModW5jdXJyeVRoaXMuYmluZCk7XG5cbi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQpIHtcbiAgYUNhbGxhYmxlKGZuKTtcbiAgcmV0dXJuIHRoYXQgPT09IHVuZGVmaW5lZCA/IGZuIDogTkFUSVZFX0JJTkQgPyBiaW5kKGZuLCB0aGF0KSA6IGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWZ1bmN0aW9uLXByb3RvdHlwZS1iaW5kIC0tIHNhZmVcbiAgdmFyIHRlc3QgPSAoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9KS5iaW5kKCk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgLS0gc2FmZVxuICByZXR1cm4gdHlwZW9mIHRlc3QgIT0gJ2Z1bmN0aW9uJyB8fCB0ZXN0Lmhhc093blByb3BlcnR5KCdwcm90b3R5cGUnKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIE5BVElWRV9CSU5EID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlJyk7XG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX0JJTkQgPyBjYWxsLmJpbmQoY2FsbCkgOiBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjYWxsLmFwcGx5KGNhbGwsIGFyZ3VtZW50cyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldERlc2NyaXB0b3IgPSBERVNDUklQVE9SUyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG52YXIgRVhJU1RTID0gaGFzT3duKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpO1xuLy8gYWRkaXRpb25hbCBwcm90ZWN0aW9uIGZyb20gbWluaWZpZWQgLyBtYW5nbGVkIC8gZHJvcHBlZCBmdW5jdGlvbiBuYW1lc1xudmFyIFBST1BFUiA9IEVYSVNUUyAmJiAoZnVuY3Rpb24gc29tZXRoaW5nKCkgeyAvKiBlbXB0eSAqLyB9KS5uYW1lID09PSAnc29tZXRoaW5nJztcbnZhciBDT05GSUdVUkFCTEUgPSBFWElTVFMgJiYgKCFERVNDUklQVE9SUyB8fCAoREVTQ1JJUFRPUlMgJiYgZ2V0RGVzY3JpcHRvcihGdW5jdGlvblByb3RvdHlwZSwgJ25hbWUnKS5jb25maWd1cmFibGUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVYSVNUUzogRVhJU1RTLFxuICBQUk9QRVI6IFBST1BFUixcbiAgQ09ORklHVVJBQkxFOiBDT05GSUdVUkFCTEVcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2xhc3NvZlJhdyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbikge1xuICAvLyBOYXNob3JuIGJ1ZzpcbiAgLy8gICBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTEyOFxuICAvLyAgIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xMTMwXG4gIGlmIChjbGFzc29mUmF3KGZuKSA9PT0gJ0Z1bmN0aW9uJykgcmV0dXJuIHVuY3VycnlUaGlzKGZuKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyIGNhbGwgPSBGdW5jdGlvblByb3RvdHlwZS5jYWxsO1xudmFyIHVuY3VycnlUaGlzV2l0aEJpbmQgPSBOQVRJVkVfQklORCAmJiBGdW5jdGlvblByb3RvdHlwZS5iaW5kLmJpbmQoY2FsbCwgY2FsbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX0JJTkQgPyB1bmN1cnJ5VGhpc1dpdGhCaW5kIDogZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGwuYXBwbHkoZm4sIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoYXJndW1lbnQpID8gYXJndW1lbnQgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pIDogZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcbnZhciBpc051bGxPclVuZGVmaW5lZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1udWxsLW9yLXVuZGVmaW5lZCcpO1xuXG4vLyBgR2V0TWV0aG9kYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0bWV0aG9kXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChWLCBQKSB7XG4gIHZhciBmdW5jID0gVltQXTtcbiAgcmV0dXJuIGlzTnVsbE9yVW5kZWZpbmVkKGZ1bmMpID8gdW5kZWZpbmVkIDogYUNhbGxhYmxlKGZ1bmMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgJiYgaXQuTWF0aCA9PT0gTWF0aCAmJiBpdDtcbn07XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG5tb2R1bGUuZXhwb3J0cyA9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1nbG9iYWwtdGhpcyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBnbG9iYWxUaGlzID09ICdvYmplY3QnICYmIGdsb2JhbFRoaXMpIHx8XG4gIGNoZWNrKHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93KSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzIC0tIHNhZmVcbiAgY2hlY2sodHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZikgfHxcbiAgY2hlY2sodHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuYyAtLSBmYWxsYmFja1xuICAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSkoKSB8fCB0aGlzIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IHVuY3VycnlUaGlzKHt9Lmhhc093blByb3BlcnR5KTtcblxuLy8gYEhhc093blByb3BlcnR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaGFzb3ducHJvcGVydHlcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtaGFzb3duIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0Lmhhc093biB8fCBmdW5jdGlvbiBoYXNPd24oaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkodG9PYmplY3QoaXQpLCBrZXkpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0ge307XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdkb2N1bWVudCcsICdkb2N1bWVudEVsZW1lbnQnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xuXG4vLyBUaGFua3MgdG8gSUU4IGZvciBpdHMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT09IDc7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG52YXIgc3BsaXQgPSB1bmN1cnJ5VGhpcygnJy5zcGxpdCk7XG5cbi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG5tb2R1bGUuZXhwb3J0cyA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gdGhyb3dzIGFuIGVycm9yIGluIHJoaW5vLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvcmhpbm8vaXNzdWVzLzM0NlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIC0tIHNhZmVcbiAgcmV0dXJuICEkT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCk7XG59KSA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY2xhc3NvZihpdCkgPT09ICdTdHJpbmcnID8gc3BsaXQoaXQsICcnKSA6ICRPYmplY3QoaXQpO1xufSA6ICRPYmplY3Q7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IHVuY3VycnlUaGlzKEZ1bmN0aW9uLnRvU3RyaW5nKTtcblxuLy8gdGhpcyBoZWxwZXIgYnJva2VuIGluIGBjb3JlLWpzQDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKCFpc0NhbGxhYmxlKHN0b3JlLmluc3BlY3RTb3VyY2UpKSB7XG4gIHN0b3JlLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25Ub1N0cmluZyhpdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmUuaW5zcGVjdFNvdXJjZTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2Vhay1tYXAtYmFzaWMtZGV0ZWN0aW9uJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEID0gJ09iamVjdCBhbHJlYWR5IGluaXRpYWxpemVkJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcbnZhciBzZXQsIGdldCwgaGFzO1xuXG52YXIgZW5mb3JjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaGFzKGl0KSA/IGdldChpdCkgOiBzZXQoaXQsIHt9KTtcbn07XG5cbnZhciBnZXR0ZXJGb3IgPSBmdW5jdGlvbiAoVFlQRSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICghaXNPYmplY3QoaXQpIHx8IChzdGF0ZSA9IGdldChpdCkpLnR5cGUgIT09IFRZUEUpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQnKTtcbiAgICB9IHJldHVybiBzdGF0ZTtcbiAgfTtcbn07XG5cbmlmIChOQVRJVkVfV0VBS19NQVAgfHwgc2hhcmVkLnN0YXRlKSB7XG4gIHZhciBzdG9yZSA9IHNoYXJlZC5zdGF0ZSB8fCAoc2hhcmVkLnN0YXRlID0gbmV3IFdlYWtNYXAoKSk7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlbGYtYXNzaWduIC0tIHByb3RvdHlwZSBtZXRob2RzIHByb3RlY3Rpb24gKi9cbiAgc3RvcmUuZ2V0ID0gc3RvcmUuZ2V0O1xuICBzdG9yZS5oYXMgPSBzdG9yZS5oYXM7XG4gIHN0b3JlLnNldCA9IHN0b3JlLnNldDtcbiAgLyogZXNsaW50LWVuYWJsZSBuby1zZWxmLWFzc2lnbiAtLSBwcm90b3R5cGUgbWV0aG9kcyBwcm90ZWN0aW9uICovXG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICBpZiAoc3RvcmUuaGFzKGl0KSkgdGhyb3cgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBzdG9yZS5zZXQoaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBzdG9yZS5nZXQoaXQpIHx8IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gc3RvcmUuaGFzKGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKGhhc093bihpdCwgU1RBVEUpKSB0aHJvdyBUeXBlRXJyb3IoT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQpO1xuICAgIG1ldGFkYXRhLmZhY2FkZSA9IGl0O1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShpdCwgU1RBVEUsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBoYXNPd24oaXQsIFNUQVRFKSA/IGl0W1NUQVRFXSA6IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNhcnJheVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWFycmF5LWlzYXJyYXkgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoYXJndW1lbnQpID09PSAnQXJyYXknO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZG9jdW1lbnRBbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtYWxsJyk7XG5cbnZhciBkb2N1bWVudEFsbCA9ICRkb2N1bWVudEFsbC5hbGw7XG5cbi8vIGBJc0NhbGxhYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxubW9kdWxlLmV4cG9ydHMgPSAkZG9jdW1lbnRBbGwuSVNfSFRNTEREQSA/IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09ICdmdW5jdGlvbicgfHwgYXJndW1lbnQgPT09IGRvY3VtZW50QWxsO1xufSA6IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09ICdmdW5jdGlvbic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZicpO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBlbXB0eSA9IFtdO1xudmFyIGNvbnN0cnVjdCA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnY29uc3RydWN0Jyk7XG52YXIgY29uc3RydWN0b3JSZWdFeHAgPSAvXlxccyooPzpjbGFzc3xmdW5jdGlvbilcXGIvO1xudmFyIGV4ZWMgPSB1bmN1cnJ5VGhpcyhjb25zdHJ1Y3RvclJlZ0V4cC5leGVjKTtcbnZhciBJTkNPUlJFQ1RfVE9fU1RSSU5HID0gIWNvbnN0cnVjdG9yUmVnRXhwLmV4ZWMobm9vcCk7XG5cbnZhciBpc0NvbnN0cnVjdG9yTW9kZXJuID0gZnVuY3Rpb24gaXNDb25zdHJ1Y3Rvcihhcmd1bWVudCkge1xuICBpZiAoIWlzQ2FsbGFibGUoYXJndW1lbnQpKSByZXR1cm4gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3RydWN0KG5vb3AsIGVtcHR5LCBhcmd1bWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG52YXIgaXNDb25zdHJ1Y3RvckxlZ2FjeSA9IGZ1bmN0aW9uIGlzQ29uc3RydWN0b3IoYXJndW1lbnQpIHtcbiAgaWYgKCFpc0NhbGxhYmxlKGFyZ3VtZW50KSkgcmV0dXJuIGZhbHNlO1xuICBzd2l0Y2ggKGNsYXNzb2YoYXJndW1lbnQpKSB7XG4gICAgY2FzZSAnQXN5bmNGdW5jdGlvbic6XG4gICAgY2FzZSAnR2VuZXJhdG9yRnVuY3Rpb24nOlxuICAgIGNhc2UgJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nOiByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyB3ZSBjYW4ndCBjaGVjayAucHJvdG90eXBlIHNpbmNlIGNvbnN0cnVjdG9ycyBwcm9kdWNlZCBieSAuYmluZCBoYXZlbid0IGl0XG4gICAgLy8gYEZ1bmN0aW9uI3RvU3RyaW5nYCB0aHJvd3Mgb24gc29tZSBidWlsdC1pdCBmdW5jdGlvbiBpbiBzb21lIGxlZ2FjeSBlbmdpbmVzXG4gICAgLy8gKGZvciBleGFtcGxlLCBgRE9NUXVhZGAgYW5kIHNpbWlsYXIgaW4gRkY0MS0pXG4gICAgcmV0dXJuIElOQ09SUkVDVF9UT19TVFJJTkcgfHwgISFleGVjKGNvbnN0cnVjdG9yUmVnRXhwLCBpbnNwZWN0U291cmNlKGFyZ3VtZW50KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmlzQ29uc3RydWN0b3JMZWdhY3kuc2hhbSA9IHRydWU7XG5cbi8vIGBJc0NvbnN0cnVjdG9yYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSAhY29uc3RydWN0IHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbGxlZDtcbiAgcmV0dXJuIGlzQ29uc3RydWN0b3JNb2Rlcm4oaXNDb25zdHJ1Y3Rvck1vZGVybi5jYWxsKVxuICAgIHx8ICFpc0NvbnN0cnVjdG9yTW9kZXJuKE9iamVjdClcbiAgICB8fCAhaXNDb25zdHJ1Y3Rvck1vZGVybihmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWU7IH0pXG4gICAgfHwgY2FsbGVkO1xufSkgPyBpc0NvbnN0cnVjdG9yTGVnYWN5IDogaXNDb25zdHJ1Y3Rvck1vZGVybjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIHJlcGxhY2VtZW50ID0gLyN8XFwucHJvdG90eXBlXFwuLztcblxudmFyIGlzRm9yY2VkID0gZnVuY3Rpb24gKGZlYXR1cmUsIGRldGVjdGlvbikge1xuICB2YXIgdmFsdWUgPSBkYXRhW25vcm1hbGl6ZShmZWF0dXJlKV07XG4gIHJldHVybiB2YWx1ZSA9PT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IGlzQ2FsbGFibGUoZGV0ZWN0aW9uKSA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gd2UgY2FuJ3QgdXNlIGp1c3QgYGl0ID09IG51bGxgIHNpbmNlIG9mIGBkb2N1bWVudC5hbGxgIHNwZWNpYWwgY2FzZVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1Jc0hUTUxEREEtaW50ZXJuYWwtc2xvdC1hZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gbnVsbCB8fCBpdCA9PT0gdW5kZWZpbmVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgJGRvY3VtZW50QWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWFsbCcpO1xuXG52YXIgZG9jdW1lbnRBbGwgPSAkZG9jdW1lbnRBbGwuYWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICRkb2N1bWVudEFsbC5JU19IVE1MRERBID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IGlzQ2FsbGFibGUoaXQpIHx8IGl0ID09PSBkb2N1bWVudEFsbDtcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogaXNDYWxsYWJsZShpdCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc1Byb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgJE9iamVjdCA9IE9iamVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgJFN5bWJvbCA9IGdldEJ1aWx0SW4oJ1N5bWJvbCcpO1xuICByZXR1cm4gaXNDYWxsYWJsZSgkU3ltYm9sKSAmJiBpc1Byb3RvdHlwZU9mKCRTeW1ib2wucHJvdG90eXBlLCAkT2JqZWN0KGl0KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xuXG4vLyBgTGVuZ3RoT2ZBcnJheUxpa2VgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1sZW5ndGhvZmFycmF5bGlrZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b0xlbmd0aChvYmoubGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIENPTkZJR1VSQUJMRV9GVU5DVElPTl9OQU1FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUnKS5DT05GSUdVUkFCTEU7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcblxudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciAkU3RyaW5nID0gU3RyaW5nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgc3RyaW5nU2xpY2UgPSB1bmN1cnJ5VGhpcygnJy5zbGljZSk7XG52YXIgcmVwbGFjZSA9IHVuY3VycnlUaGlzKCcnLnJlcGxhY2UpO1xudmFyIGpvaW4gPSB1bmN1cnJ5VGhpcyhbXS5qb2luKTtcblxudmFyIENPTkZJR1VSQUJMRV9MRU5HVEggPSBERVNDUklQVE9SUyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAnbGVuZ3RoJywgeyB2YWx1ZTogOCB9KS5sZW5ndGggIT09IDg7XG59KTtcblxudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG52YXIgbWFrZUJ1aWx0SW4gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSwgb3B0aW9ucykge1xuICBpZiAoc3RyaW5nU2xpY2UoJFN0cmluZyhuYW1lKSwgMCwgNykgPT09ICdTeW1ib2woJykge1xuICAgIG5hbWUgPSAnWycgKyByZXBsYWNlKCRTdHJpbmcobmFtZSksIC9eU3ltYm9sXFwoKFteKV0qKVxcKS8sICckMScpICsgJ10nO1xuICB9XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2V0dGVyKSBuYW1lID0gJ2dldCAnICsgbmFtZTtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zZXR0ZXIpIG5hbWUgPSAnc2V0ICcgKyBuYW1lO1xuICBpZiAoIWhhc093bih2YWx1ZSwgJ25hbWUnKSB8fCAoQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUgJiYgdmFsdWUubmFtZSAhPT0gbmFtZSkpIHtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRlZmluZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIHsgdmFsdWU6IG5hbWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICBlbHNlIHZhbHVlLm5hbWUgPSBuYW1lO1xuICB9XG4gIGlmIChDT05GSUdVUkFCTEVfTEVOR1RIICYmIG9wdGlvbnMgJiYgaGFzT3duKG9wdGlvbnMsICdhcml0eScpICYmIHZhbHVlLmxlbmd0aCAhPT0gb3B0aW9ucy5hcml0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KHZhbHVlLCAnbGVuZ3RoJywgeyB2YWx1ZTogb3B0aW9ucy5hcml0eSB9KTtcbiAgfVxuICB0cnkge1xuICAgIGlmIChvcHRpb25zICYmIGhhc093bihvcHRpb25zLCAnY29uc3RydWN0b3InKSAmJiBvcHRpb25zLmNvbnN0cnVjdG9yKSB7XG4gICAgICBpZiAoREVTQ1JJUFRPUlMpIGRlZmluZVByb3BlcnR5KHZhbHVlLCAncHJvdG90eXBlJywgeyB3cml0YWJsZTogZmFsc2UgfSk7XG4gICAgLy8gaW4gVjggfiBDaHJvbWUgNTMsIHByb3RvdHlwZXMgb2Ygc29tZSBtZXRob2RzLCBsaWtlIGBBcnJheS5wcm90b3R5cGUudmFsdWVzYCwgYXJlIG5vbi13cml0YWJsZVxuICAgIH0gZWxzZSBpZiAodmFsdWUucHJvdG90eXBlKSB2YWx1ZS5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgdmFyIHN0YXRlID0gZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpO1xuICBpZiAoIWhhc093bihzdGF0ZSwgJ3NvdXJjZScpKSB7XG4gICAgc3RhdGUuc291cmNlID0gam9pbihURU1QTEFURSwgdHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgPyBuYW1lIDogJycpO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dGVuZC1uYXRpdmUgLS0gcmVxdWlyZWRcbkZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IG1ha2VCdWlsdEluKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gaXNDYWxsYWJsZSh0aGlzKSAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSwgJ3RvU3RyaW5nJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBNYXRoLnRydW5jYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWF0aC50cnVuY1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW1hdGgtdHJ1bmMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBNYXRoLnRydW5jIHx8IGZ1bmN0aW9uIHRydW5jKHgpIHtcbiAgdmFyIG4gPSAreDtcbiAgcmV0dXJuIChuID4gMCA/IGZsb29yIDogY2VpbCkobik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMnKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1hc3NpZ24gLS0gc2FmZVxudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGNvbmNhdCA9IHVuY3VycnlUaGlzKFtdLmNvbmNhdCk7XG5cbi8vIGBPYmplY3QuYXNzaWduYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHNob3VsZCBoYXZlIGNvcnJlY3Qgb3JkZXIgb2Ygb3BlcmF0aW9ucyAoRWRnZSBidWcpXG4gIGlmIChERVNDUklQVE9SUyAmJiAkYXNzaWduKHsgYjogMSB9LCAkYXNzaWduKGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgJ2InLCB7XG4gICAgICAgIHZhbHVlOiAzLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9KSwgeyBiOiAyIH0pKS5iICE9PSAxKSByZXR1cm4gdHJ1ZTtcbiAgLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1zeW1ib2wgLS0gc2FmZVxuICB2YXIgc3ltYm9sID0gU3ltYm9sKCdhc3NpZ24gZGV0ZWN0aW9uJyk7XG4gIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbc3ltYm9sXSA9IDc7XG4gIGFscGhhYmV0LnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaHIpIHsgQltjaHJdID0gY2hyOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW3N5bWJvbF0gIT09IDcgfHwgb2JqZWN0S2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT09IGFscGhhYmV0O1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFycyAtLSByZXF1aXJlZCBmb3IgYC5sZW5ndGhgXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFyZ3VtZW50c0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgdmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZjtcbiAgd2hpbGUgKGFyZ3VtZW50c0xlbmd0aCA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJbmRleGVkT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBjb25jYXQob2JqZWN0S2V5cyhTKSwgZ2V0T3duUHJvcGVydHlTeW1ib2xzKFMpKSA6IG9iamVjdEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IGNhbGwocHJvcGVydHlJc0VudW1lcmFibGUsIFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBBY3RpdmVYT2JqZWN0IC0tIG9sZCBJRSwgV1NIICovXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgZGVmaW5lUHJvcGVydGllc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaHRtbCcpO1xudmFyIGRvY3VtZW50Q3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG5cbnZhciBHVCA9ICc+JztcbnZhciBMVCA9ICc8JztcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBTQ1JJUFQgPSAnc2NyaXB0JztcbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcblxudmFyIEVtcHR5Q29uc3RydWN0b3IgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG5cbnZhciBzY3JpcHRUYWcgPSBmdW5jdGlvbiAoY29udGVudCkge1xuICByZXR1cm4gTFQgKyBTQ1JJUFQgKyBHVCArIGNvbnRlbnQgKyBMVCArICcvJyArIFNDUklQVCArIEdUO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIEFjdGl2ZVggT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBOdWxsUHJvdG9PYmplY3RWaWFBY3RpdmVYID0gZnVuY3Rpb24gKGFjdGl2ZVhEb2N1bWVudCkge1xuICBhY3RpdmVYRG9jdW1lbnQud3JpdGUoc2NyaXB0VGFnKCcnKSk7XG4gIGFjdGl2ZVhEb2N1bWVudC5jbG9zZSgpO1xuICB2YXIgdGVtcCA9IGFjdGl2ZVhEb2N1bWVudC5wYXJlbnRXaW5kb3cuT2JqZWN0O1xuICBhY3RpdmVYRG9jdW1lbnQgPSBudWxsOyAvLyBhdm9pZCBtZW1vcnkgbGVha1xuICByZXR1cm4gdGVtcDtcbn07XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBOdWxsUHJvdG9PYmplY3RWaWFJRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSBkb2N1bWVudENyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICB2YXIgSlMgPSAnamF2YScgKyBTQ1JJUFQgKyAnOic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGh0bWwuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzQ3NVxuICBpZnJhbWUuc3JjID0gU3RyaW5nKEpTKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJ2RvY3VtZW50LkY9T2JqZWN0JykpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICByZXR1cm4gaWZyYW1lRG9jdW1lbnQuRjtcbn07XG5cbi8vIENoZWNrIGZvciBkb2N1bWVudC5kb21haW4gYW5kIGFjdGl2ZSB4IHN1cHBvcnRcbi8vIE5vIG5lZWQgdG8gdXNlIGFjdGl2ZSB4IGFwcHJvYWNoIHdoZW4gZG9jdW1lbnQuZG9tYWluIGlzIG5vdCBzZXRcbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuLy8gdmFyaWF0aW9uIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9raXRjYW1icmlkZ2UvZXM1LXNoaW0vY29tbWl0LzRmNzM4YWMwNjYzNDZcbi8vIGF2b2lkIElFIEdDIGJ1Z1xudmFyIGFjdGl2ZVhEb2N1bWVudDtcbnZhciBOdWxsUHJvdG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgYWN0aXZlWERvY3VtZW50ID0gbmV3IEFjdGl2ZVhPYmplY3QoJ2h0bWxmaWxlJyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGlnbm9yZSAqLyB9XG4gIE51bGxQcm90b09iamVjdCA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJ1xuICAgID8gZG9jdW1lbnQuZG9tYWluICYmIGFjdGl2ZVhEb2N1bWVudFxuICAgICAgPyBOdWxsUHJvdG9PYmplY3RWaWFBY3RpdmVYKGFjdGl2ZVhEb2N1bWVudCkgLy8gb2xkIElFXG4gICAgICA6IE51bGxQcm90b09iamVjdFZpYUlGcmFtZSgpXG4gICAgOiBOdWxsUHJvdG9PYmplY3RWaWFBY3RpdmVYKGFjdGl2ZVhEb2N1bWVudCk7IC8vIFdTSFxuICB2YXIgbGVuZ3RoID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIGRlbGV0ZSBOdWxsUHJvdG9PYmplY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tsZW5ndGhdXTtcbiAgcmV0dXJuIE51bGxQcm90b09iamVjdCgpO1xufTtcblxuaGlkZGVuS2V5c1tJRV9QUk9UT10gPSB0cnVlO1xuXG4vLyBgT2JqZWN0LmNyZWF0ZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5jcmVhdGVcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtY3JlYXRlIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eUNvbnN0cnVjdG9yKCk7XG4gICAgRW1wdHlDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBOdWxsUHJvdG9PYmplY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXNNb2R1bGUuZihyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIFY4X1BST1RPVFlQRV9ERUZJTkVfQlVHID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydGllcyAtLSBzYWZlXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyAmJiAhVjhfUFJPVE9UWVBFX0RFRklORV9CVUcgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIHByb3BzID0gdG9JbmRleGVkT2JqZWN0KFByb3BlcnRpZXMpO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKE8sIGtleSA9IGtleXNbaW5kZXgrK10sIHByb3BzW2tleV0pO1xuICByZXR1cm4gTztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZScpO1xudmFyIFY4X1BST1RPVFlQRV9ERUZJTkVfQlVHID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Y4LXByb3RvdHlwZS1kZWZpbmUtYnVnJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgRU5VTUVSQUJMRSA9ICdlbnVtZXJhYmxlJztcbnZhciBDT05GSUdVUkFCTEUgPSAnY29uZmlndXJhYmxlJztcbnZhciBXUklUQUJMRSA9ICd3cml0YWJsZSc7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gVjhfUFJPVE9UWVBFX0RFRklORV9CVUcgPyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmICh0eXBlb2YgTyA9PT0gJ2Z1bmN0aW9uJyAmJiBQID09PSAncHJvdG90eXBlJyAmJiAndmFsdWUnIGluIEF0dHJpYnV0ZXMgJiYgV1JJVEFCTEUgaW4gQXR0cmlidXRlcyAmJiAhQXR0cmlidXRlc1tXUklUQUJMRV0pIHtcbiAgICB2YXIgY3VycmVudCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudFtXUklUQUJMRV0pIHtcbiAgICAgIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICAgICAgQXR0cmlidXRlcyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBDT05GSUdVUkFCTEUgaW4gQXR0cmlidXRlcyA/IEF0dHJpYnV0ZXNbQ09ORklHVVJBQkxFXSA6IGN1cnJlbnRbQ09ORklHVVJBQkxFXSxcbiAgICAgICAgZW51bWVyYWJsZTogRU5VTUVSQUJMRSBpbiBBdHRyaWJ1dGVzID8gQXR0cmlidXRlc1tFTlVNRVJBQkxFXSA6IGN1cnJlbnRbRU5VTUVSQUJMRV0sXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gIH0gcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbn0gOiAkZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93ICRUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWNhbGwnKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvUHJvcGVydHlLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5Jyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5ZGVzY3JpcHRvclxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSW5kZXhlZE9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzT3duKE8sIFApKSByZXR1cm4gY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKCFjYWxsKHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmYsIE8sIFApLCBPW1BdKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG52YXIgaGlkZGVuS2V5cyA9IGVudW1CdWdLZXlzLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eW5hbWVzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gaW50ZXJuYWxPYmplY3RLZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlzeW1ib2xzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdW5jdXJyeVRoaXMoe30uaXNQcm90b3R5cGVPZik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciBpbmRleE9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzJykuaW5kZXhPZjtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBwdXNoID0gdW5jdXJyeVRoaXMoW10ucHVzaCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pICFoYXNPd24oaGlkZGVuS2V5cywga2V5KSAmJiBoYXNPd24oTywga2V5KSAmJiBwdXNoKHJlc3VsdCwga2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhc093bihPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5pbmRleE9mKHJlc3VsdCwga2V5KSB8fCBwdXNoKHJlc3VsdCwga2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5rZXlzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWtleXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYE9yZGluYXJ5VG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKHByZWYgPT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChpc0NhbGxhYmxlKGZuID0gaW5wdXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChwcmVmICE9PSAnc3RyaW5nJyAmJiBpc0NhbGxhYmxlKGZuID0gaW5wdXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBjYWxsKGZuLCBpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyAkVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG52YXIgY29uY2F0ID0gdW5jdXJyeVRoaXMoW10uY29uY2F0KTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGNvbmNhdChrZXlzLCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaXNOdWxsT3JVbmRlZmluZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtbnVsbC1vci11bmRlZmluZWQnKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG5cbi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGl0KSkgdGhyb3cgJFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBkZWZpbmVHbG9iYWxQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtZ2xvYmFsLXByb3BlcnR5Jyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IGRlZmluZUdsb2JhbFByb3BlcnR5KFNIQVJFRCwge30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogJzMuMzIuMicsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxNC0yMDIzIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJyxcbiAgbGljZW5zZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2Jsb2IvdjMuMzIuMi9MSUNFTlNFJyxcbiAgc291cmNlOiAnaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMnXG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxudmFyICRTdHJpbmcgPSBnbG9iYWwuU3RyaW5nO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgnc3ltYm9sIGRldGVjdGlvbicpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIC8vIG5iOiBEbyBub3QgY2FsbCBgU3RyaW5nYCBkaXJlY3RseSB0byBhdm9pZCB0aGlzIGJlaW5nIG9wdGltaXplZCBvdXQgdG8gYHN5bWJvbCsnJ2Agd2hpY2ggd2lsbCxcbiAgLy8gb2YgY291cnNlLCBmYWlsLlxuICByZXR1cm4gISRTdHJpbmcoc3ltYm9sKSB8fCAhKE9iamVjdChzeW1ib2wpIGluc3RhbmNlb2YgU3ltYm9sKSB8fFxuICAgIC8vIENocm9tZSAzOC00MCBzeW1ib2xzIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gRE9NIGNvbGxlY3Rpb25zIHByb3RvdHlwZXMgdG8gaW5zdGFuY2VzXG4gICAgIVN5bWJvbC5zaGFtICYmIFY4X1ZFUlNJT04gJiYgVjhfVkVSU0lPTiA8IDQxO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICByZXR1cm4gaW50ZWdlciA8IDAgPyBtYXgoaW50ZWdlciArIGxlbmd0aCwgMCkgOiBtaW4oaW50ZWdlciwgbGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSW5kZXhlZE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGl0KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRydW5jID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL21hdGgtdHJ1bmMnKTtcblxuLy8gYFRvSW50ZWdlck9ySW5maW5pdHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIgbnVtYmVyID0gK2FyZ3VtZW50O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICByZXR1cm4gbnVtYmVyICE9PSBudW1iZXIgfHwgbnVtYmVyID09PSAwID8gMCA6IHRydW5jKG51bWJlcik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIGBUb0xlbmd0aGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gYXJndW1lbnQgPiAwID8gbWluKHRvSW50ZWdlck9ySW5maW5pdHkoYXJndW1lbnQpLCAweDFGRkZGRkZGRkZGRkZGKSA6IDA7IC8vIDIgKiogNTMgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvb2JqZWN0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gJE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tY2FsbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXN5bWJvbCcpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgb3JkaW5hcnlUb1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG52YXIgVE9fUFJJTUlUSVZFID0gd2VsbEtub3duU3ltYm9sKCd0b1ByaW1pdGl2ZScpO1xuXG4vLyBgVG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b3ByaW1pdGl2ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIHByZWYpIHtcbiAgaWYgKCFpc09iamVjdChpbnB1dCkgfHwgaXNTeW1ib2woaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG4gIHZhciBleG90aWNUb1ByaW0gPSBnZXRNZXRob2QoaW5wdXQsIFRPX1BSSU1JVElWRSk7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChleG90aWNUb1ByaW0pIHtcbiAgICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ2RlZmF1bHQnO1xuICAgIHJlc3VsdCA9IGNhbGwoZXhvdGljVG9QcmltLCBpbnB1dCwgcHJlZik7XG4gICAgaWYgKCFpc09iamVjdChyZXN1bHQpIHx8IGlzU3ltYm9sKHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbiAgfVxuICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ251bWJlcic7XG4gIHJldHVybiBvcmRpbmFyeVRvUHJpbWl0aXZlKGlucHV0LCBwcmVmKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG5cbi8vIGBUb1Byb3BlcnR5S2V5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcm9wZXJ0eWtleVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCAnc3RyaW5nJyk7XG4gIHJldHVybiBpc1N5bWJvbChrZXkpID8ga2V5IDoga2V5ICsgJyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciB0ZXN0ID0ge307XG5cbnRlc3RbVE9fU1RSSU5HX1RBR10gPSAneic7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RyaW5nKHRlc3QpID09PSAnW29iamVjdCB6XSc7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJFN0cmluZyA9IFN0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gJFN0cmluZyhhcmd1bWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG52YXIgaWQgPSAwO1xudmFyIHBvc3RmaXggPSBNYXRoLnJhbmRvbSgpO1xudmFyIHRvU3RyaW5nID0gdW5jdXJyeVRoaXMoMS4wLnRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyAoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgdG9TdHJpbmcoKytpZCArIHBvc3RmaXgsIDM2KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBlcy9uby1zeW1ib2wgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmcgKi9cbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfU1lNQk9MXG4gICYmICFTeW1ib2wuc2hhbVxuICAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gVjggfiBDaHJvbWUgMzYtXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMzM0XG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSwgJ3Byb3RvdHlwZScsIHtcbiAgICB2YWx1ZTogNDIsXG4gICAgd3JpdGFibGU6IGZhbHNlXG4gIH0pLnByb3RvdHlwZSAhPT0gNDI7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KFN0cmluZyhXZWFrTWFwKSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N5bWJvbC1jb25zdHJ1Y3Rvci1kZXRlY3Rpb24nKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sWydmb3InXSB8fCBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzT3duKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkpIHtcbiAgICBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBOQVRJVkVfU1lNQk9MICYmIGhhc093bihTeW1ib2wsIG5hbWUpXG4gICAgICA/IFN5bWJvbFtuYW1lXVxuICAgICAgOiBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkZmluZEluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZpbmRJbmRleDtcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcycpO1xuXG52YXIgRklORF9JTkRFWCA9ICdmaW5kSW5kZXgnO1xudmFyIFNLSVBTX0hPTEVTID0gdHJ1ZTtcblxuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1hcnJheS1wcm90b3R5cGUtZmluZGluZGV4IC0tIHRlc3RpbmdcbmlmIChGSU5EX0lOREVYIGluIFtdKSBBcnJheSgxKVtGSU5EX0lOREVYXShmdW5jdGlvbiAoKSB7IFNLSVBTX0hPTEVTID0gZmFsc2U7IH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kaW5kZXhcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IFNLSVBTX0hPTEVTIH0sIHtcbiAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgoY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICByZXR1cm4gJGZpbmRJbmRleCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS1AQHVuc2NvcGFibGVzXG5hZGRUb1Vuc2NvcGFibGVzKEZJTkRfSU5ERVgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1hc3NpZ24nKTtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWFzc2lnbiAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGFyaXR5OiAyLCBmb3JjZWQ6IE9iamVjdC5hc3NpZ24gIT09IGFzc2lnbiB9LCB7XG4gIGFzc2lnbjogYXNzaWduXG59KTtcbiIsImltcG9ydCB7IFV0aWxzLCBSb3V0ZUNvbmZpZywgcmVyb3V0ZXIgfSBmcm9tICdSZXJvdXRlcic7XG5pbXBvcnQge1xuICBtYWluUGFnZSxcbiAgZGljZTFUaW1lUGFnZSxcbiAgYXR0YWNrUGFnZSxcbiAgZ2VuZXJhbENvbGxlY3RQYWdlLFxuICBjb2xsZWN0UGFnZSxcbiAgZ2VuZXJhbFJldHVyblBhZ2UsXG4gIGJhbmtQYWdlcyxcbiAgY2xvc2VQYWdlLFxuICBkaWNlQmVmb3JlN1N0ZXBzLFxuICBkaWNlN0xlZnQsXG4gIGRpY2U3VG9wLFxuICBkaWNlN1JpZ2h0LFxuICBkaWNlN0Rvd24sXG4gIGlzRGljZU1heFRpbWVQYWdlLFxuICByb2xsRG91Ymxlc1BhZ2UsXG4gIGJ1aWxkSG91c2VIaW50UGFnZSxcbiAgYnVpbGRIb3VzZVBhZ2UsXG59IGZyb20gJy4vcGFnZXMnO1xuaW1wb3J0IHsgZmluZFVubWF0Y2hJblBhZ2UgfSBmcm9tICcuL3V0aWxzJztcbmNvbnN0IFZFUlNJT05fQ09ERTogbnVtYmVyID0gMS4wO1xuXG5leHBvcnQgY2xhc3MgSGVsbG93b3JsZCB7XG4gIHB1YmxpYyBzdGF0aWMgcGFja2FnZU5hbWU6IHN0cmluZyA9ICdjb20uc2NvcGVseS5tb25vcG9seWdvJztcblxuICBjb25zdHJ1Y3Rvcihqc29uQ29uZmlnOiBhbnkpIHtcbiAgICByZXJvdXRlci5yZXNldCgpO1xuICAgIHJlcm91dGVyLnNjcmVlbkNvbmZpZy5kZXZXaWR0aCA9IDM2MDtcbiAgICByZXJvdXRlci5zY3JlZW5Db25maWcuZGV2SGVpZ2h0ID0gNjQwO1xuICAgIHJlcm91dGVyLnNjcmVlbkNvbmZpZy5kZXZpY2VXaWR0aCA9IDM2MDtcbiAgICByZXJvdXRlci5zY3JlZW5Db25maWcuZGV2aWNlSGVpZ2h0ID0gNjQwO1xuICAgIHJlcm91dGVyLnNjcmVlbkNvbmZpZy5zY3JlZW5XaWR0aCA9IDM2MDtcbiAgICByZXJvdXRlci5zY3JlZW5Db25maWcuc2NyZWVuSGVpZ2h0ID0gNjQwO1xuICAgIHJlcm91dGVyLnNjcmVlbkNvbmZpZy5zY3JlZW5PZmZzZXRYID0gMDtcbiAgICByZXJvdXRlci5zY3JlZW5Db25maWcuc2NyZWVuT2Zmc2V0WSA9IDA7XG4gICAgcmVyb3V0ZXIuc2NyZWVuQ29uZmlnLnJvdGF0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICByZXJvdXRlci5zY3JlZW5Db25maWcuYWN0aW9uRHVyaW5nID0gMzAwO1xuICAgIGNvbnNvbGUubG9nKCcjIyMjIyMjIyMjIyMgbmV3IEhlbGxvd29ybGQgIyMjIyMjIyMjIyMjJyk7XG4gICAgY29uc29sZS5sb2coYHNjcmlwdCB2ZXJzaW9uICR7VkVSU0lPTl9DT0RFfWApO1xuICAgIHRoaXMuYWRkUm91dGVzQW5kVGFza3MoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhyZXJvdXRlci5nZXRDdXJyZW50TWF0Y2hOYW1lcygpKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5kVW5tYXRjaEluUGFnZShkaWNlMVRpbWVQYWdlKSk7XG4gICAgLy8gcmV0dXJuO1xuICAgIHJlcm91dGVyLnN0YXJ0KEhlbGxvd29ybGQucGFja2FnZU5hbWUpO1xuICB9XG4gIHB1YmxpYyBzdG9wKCkge1xuICAgIHJlcm91dGVyLnN0b3AoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRSb3V0ZXNBbmRUYXNrcygpIHtcbiAgICB0aGlzLmFkZFRhc2tzKCk7XG5cbiAgICB0aGlzLmFkZFJvdXRlcygpO1xuICAgIHRoaXMuaGFuZGxlVW5rbm93bigpO1xuICB9XG5cbiAgcHVibGljIGFkZFRhc2tzKCkge1xuICAgIHJlcm91dGVyLmFkZFRhc2soe1xuICAgICAgbmFtZTogJ3J1bicsXG4gICAgICBiZWZvcmVSb3V0ZTogKCkgPT4ge30sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUm91dGVzKCkge1xuICAgIC8vIG1haW5QYWdlXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke21haW5QYWdlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBtYWluUGFnZSxcbiAgICAgIGFjdGlvbjogKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgUm91dGUgJHttYWluUGFnZS5uYW1lfWApO1xuICAgICAgICAvLyBjaGVjayBpZiBjYW4gYnVpbGQgaG91c2VcbiAgICAgICAgY29uc3QgaGFzQnVpbGRIb3VzZUhpbnQgPSByZXJvdXRlci5pc1BhZ2VNYXRjaEltYWdlKGJ1aWxkSG91c2VIaW50UGFnZSwgaW1hZ2UpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGFzQnVpbGRIb3VzZUhpbnQnLCBoYXNCdWlsZEhvdXNlSGludCk7XG4gICAgICAgIGlmIChoYXNCdWlsZEhvdXNlSGludCkge1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoODQsIDU5NSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNEaWNlTWF4QmVmb3JlN1N0ZXBzID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgaXNEaWNlMVRpbWUgPSByZXJvdXRlci5pc1BhZ2VNYXRjaEltYWdlKGRpY2UxVGltZVBhZ2UsIGltYWdlKTtcbiAgICAgICAgY29uc3QgaXNEaWNlTWF4VGltZSA9IHJlcm91dGVyLmlzUGFnZU1hdGNoSW1hZ2UoaXNEaWNlTWF4VGltZVBhZ2UsIGltYWdlKTtcbiAgICAgICAgY29uc3QgaXNNYXRjaEJlZm9yZTdTdGVwcyA9IHJlcm91dGVyLmlzUGFnZU1hdGNoSW1hZ2UoZGljZUJlZm9yZTdTdGVwcywgaW1hZ2UpO1xuICAgICAgICBjb25zb2xlLmxvZygnaXNNYXRjaEJlZm9yZTdTdGVwcycsIGlzTWF0Y2hCZWZvcmU3U3RlcHMpO1xuICAgICAgICBjb25zb2xlLmxvZygnaXNEaWNlTWF4VGltZScsIGlzRGljZU1heFRpbWUpO1xuICAgICAgICBjb25zb2xlLmxvZygnaXNEaWNlMVRpbWUnLCBpc0RpY2UxVGltZSk7XG5cbiAgICAgICAgaWYgKGlzRGljZU1heEJlZm9yZTdTdGVwcykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkaWNlN0xlZnQnLCByZXJvdXRlci5pc1BhZ2VNYXRjaEltYWdlKGRpY2U3TGVmdCwgaW1hZ2UpKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZGljZTdUb3AnLCByZXJvdXRlci5pc1BhZ2VNYXRjaEltYWdlKGRpY2U3VG9wLCBpbWFnZSkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkaWNlN1JpZ2h0JywgcmVyb3V0ZXIuaXNQYWdlTWF0Y2hJbWFnZShkaWNlN1JpZ2h0LCBpbWFnZSkpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkaWNlN0Rvd24nLCByZXJvdXRlci5pc1BhZ2VNYXRjaEltYWdlKGRpY2U3RG93biwgaW1hZ2UpKTtcblxuICAgICAgICAgIGlmIChpc01hdGNoQmVmb3JlN1N0ZXBzKSB7XG4gICAgICAgICAgICAvLyBiZWZvcmUgNyBzdGVwc1xuICAgICAgICAgICAgaWYgKGlzRGljZU1heFRpbWUpIHtcbiAgICAgICAgICAgICAgLy8gcHJlc3MgZ28gYnV0dG9uXG4gICAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoMTc3LCA1MTUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gcHJlc3MgZGljZSBwb3dlciBidXR0b25cbiAgICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCgyNDAsIDQ3MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG5vdCBiZWZvcmUgNyBzdGVwc1xuICAgICAgICAgICAgaWYgKGlzRGljZTFUaW1lKSB7XG4gICAgICAgICAgICAgIC8vIHByZXNzIGdvIGJ1dHRvblxuICAgICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKDE3NywgNTE1KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIHByZXNzIGRpY2UgcG93ZXIgYnV0dG9uXG4gICAgICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoMjQwLCA0NzApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgZ28gYnV0dG9uIGlzIHVwLCBwcmVzcyBpdFxuICAgICAgICAgIGlmIChyZXJvdXRlci5zY3JlZW4uaXNTYW1lQ29sb3IoeyB4OiAxMjAsIHk6IDUzNywgcjogMTc1LCBnOiA0OCwgYjogMCB9KSAmJiBpc0RpY2UxVGltZSkge1xuICAgICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcERvd24oMTc3LCA1MTUpO1xuICAgICAgICAgICAgVXRpbHMuc2xlZXAoMjAwMCk7XG4gICAgICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwVXAoMTc3LCA1MTUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBwcmVzcyBkaWNlIHBvd2VyIGJ1dHRvblxuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXBEb3duKDI0MCwgNDcwKTtcbiAgICAgICAgICBVdGlscy5zbGVlcCgxMDApO1xuICAgICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXBVcCgyNDAsIDQ3MCk7XG4gICAgICAgICAgLy8gaXQgaXMgYXV0byBwbGF5aW5nLCBkbyBub3RoaW5nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7YXR0YWNrUGFnZS5uYW1lfWAsXG4gICAgICBtYXRjaDogYXR0YWNrUGFnZSxcbiAgICAgIGFjdGlvbjogKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgUm91dGUgJHthdHRhY2tQYWdlLm5hbWV9YCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAvLyBHZW5lcmF0ZSByYW5kb20geCBhbmQgeSBjb29yZGluYXRlcyB3aXRoaW4gdGhlIHNwZWNpZmllZCByYW5nZVxuICAgICAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDI3MCAtIDkwICsgMSkpICsgOTA7XG4gICAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNDgwIC0gMTYwICsgMSkpICsgMTYwO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coYHRhcCAke3h9LCAke3l9YCk7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcCh4LCB5KTtcbiAgICAgICAgICBVdGlscy5zbGVlcCgyMDApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gcm9sbERvdWJsZXNQYWdlXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke3JvbGxEb3VibGVzUGFnZS5uYW1lfWAsXG4gICAgICBtYXRjaDogcm9sbERvdWJsZXNQYWdlLFxuICAgICAgYWN0aW9uOiAnZ29OZXh0JyxcbiAgICB9KTtcblxuICAgIC8vIGdlbmVyYWxDb2xsZWN0UGFnZVxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtnZW5lcmFsQ29sbGVjdFBhZ2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IGdlbmVyYWxDb2xsZWN0UGFnZSxcbiAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgfSk7XG5cbiAgICAvLyBjb2xsZWN0UGFnZVxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtjb2xsZWN0UGFnZS5uYW1lfWAsXG4gICAgICBtYXRjaDogY29sbGVjdFBhZ2UsXG4gICAgICBhY3Rpb246ICdnb05leHQnLFxuICAgIH0pO1xuXG4gICAgLy8gZ2VuZXJhbFJldHVyblBhZ2VcbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7Z2VuZXJhbFJldHVyblBhZ2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IGdlbmVyYWxSZXR1cm5QYWdlLFxuICAgICAgYWN0aW9uOiAnZ29OZXh0JyxcbiAgICB9KTtcblxuICAgIHJlcm91dGVyLmFkZFJvdXRlKHtcbiAgICAgIHBhdGg6IGAvJHtjbG9zZVBhZ2UubmFtZX1gLFxuICAgICAgbWF0Y2g6IGNsb3NlUGFnZSxcbiAgICAgIGFjdGlvbjogJ2dvTmV4dCcsXG4gICAgfSk7XG5cbiAgICByZXJvdXRlci5hZGRSb3V0ZSh7XG4gICAgICBwYXRoOiBgLyR7YmFua1BhZ2VzLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBiYW5rUGFnZXMsXG4gICAgICBhY3Rpb246IChjb250ZXh0LCBpbWFnZSwgbWF0Y2hlZCwgZmluaXNoUm91bmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYFJvdXRlICR7YmFua1BhZ2VzLm5hbWV9YCk7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtcbiAgICAgICAgICB7IHg6IDIxNywgeTogMzU4LCByOiAyMjksIGc6IDE5OCwgYjogMTYzIH0sXG4gICAgICAgICAgeyB4OiAyMjMsIHk6IDQ1NCwgcjogMjU1LCBnOiAyMTUsIGI6IDM1IH0sXG4gICAgICAgICAgeyB4OiAxNDMsIHk6IDQ1OCwgcjogMjU1LCBnOiAxOTgsIGI6IDggfSxcbiAgICAgICAgICB7IHg6IDE0MiwgeTogMzU0LCByOiAxOTQsIGc6IDE2MywgYjogMTIwIH0sXG4gICAgICAgICAgeyB4OiA3MSwgeTogMzU3LCByOiAyMDYsIGc6IDE3MiwgYjogMTI4IH0sXG4gICAgICAgICAgeyB4OiA2OSwgeTogNDQ1LCByOiAyNDEsIGc6IDIyMiwgYjogMTkyIH0sXG4gICAgICAgICAgeyB4OiA2MywgeTogNTY0LCByOiAyNTUsIGc6IDIwMywgYjogOCB9LFxuICAgICAgICAgIHsgeDogMTUyLCB5OiA1NjIsIHI6IDI1MywgZzogMjM5LCBiOiAyMTQgfSxcbiAgICAgICAgICB7IHg6IDIzMCwgeTogNTYxLCByOiAyNTUsIGc6IDIwNCwgYjogOSB9LFxuICAgICAgICAgIHsgeDogMzA0LCB5OiA1NTgsIHI6IDIzOSwgZzogMjIwLCBiOiAxOTIgfSxcbiAgICAgICAgICB7IHg6IDMwNywgeTogNDUxLCByOiAyNTUsIGc6IDIxNiwgYjogMzcgfSxcbiAgICAgICAgICB7IHg6IDMwNCwgeTogMzY2LCByOiAyNDEsIGc6IDIyMiwgYjogMTkyIH0sXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHRhcCAke3BvaW50Lnh9LCAke3BvaW50Lnl9YCk7XG4gICAgICAgICAgcmVyb3V0ZXIuc2NyZWVuLnRhcChwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICBVdGlscy5zbGVlcCg1MDApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmVyb3V0ZXIuYWRkUm91dGUoe1xuICAgICAgcGF0aDogYC8ke2J1aWxkSG91c2VQYWdlLm5hbWV9YCxcbiAgICAgIG1hdGNoOiBidWlsZEhvdXNlUGFnZSxcbiAgICAgIGFjdGlvbjogKGNvbnRleHQsIGltYWdlLCBtYXRjaGVkKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBSb3V0ZSAke2J1aWxkSG91c2VQYWdlLm5hbWV9YCk7XG4gICAgICAgIC8vIHJhbmRvbWx5IHRhcCBhIGhvdXNlXG4gICAgICAgIGNvbnN0IHJhbmRvbUludCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpICsgMTtcbiAgICAgICAgY29uc29sZS5sb2coYHJhbmRvbUludCAke3JhbmRvbUludH1gKTtcbiAgICAgICAgY29uc3QgaG91c2VzID0gWzM4LCAxMDgsIDE3OCwgMjQ4LCAzMjFdO1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKGhvdXNlc1tyYW5kb21JbnQgLSAxXSwgNDk2KTtcblxuICAgICAgICAvLyBsZWF2ZSBwYWdlXG4gICAgICAgIHJlcm91dGVyLnNjcmVlbi50YXAoMTc5LCA2MTkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVVbmtub3duKCkge1xuICAgIHJlcm91dGVyLmFkZFVua25vd25BY3Rpb24oKGNvbnRleHQsIGltYWdlLCBmaW5pc2hSb3VuZCkgPT4ge1xuICAgICAgY29uc3QgbGFzdE1hdGNoZWRQYXRoID0gY29udGV4dC5sYXN0TWF0Y2hlZFBhdGguc3Vic3RyaW5nKDEpO1xuICAgICAgVXRpbHMubG9nKGB1bmtub3duIGNvdW50ICR7Y29udGV4dC5tYXRjaFRpbWVzfSwgZHVyaW5nICR7Y29udGV4dC5tYXRjaER1cmluZ30sIGxhc3QgbWF0Y2hlZDogJHtsYXN0TWF0Y2hlZFBhdGh9YCk7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1hdGNoVGltZXMgJSA1ID09PSAwKSB7XG4gICAgICAgIGtleWNvZGUoJ0tFWUNPREVfQkFDSycsIDEwMCk7XG4gICAgICAgIFV0aWxzLmxvZygna2V5Y29kZSBiYWNrIGZvciB1bmtub3duJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXJvdXRlci5zY3JlZW4udGFwKHsgeDogMSwgeTogMSB9KTtcbiAgICAgICAgVXRpbHMubG9nKCd0YXAgeyB4OiAxLCB5OiAxIH0nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgR3JvdXBQYWdlLCBQYWdlIH0gZnJvbSAnUmVyb3V0ZXInO1xuXG5leHBvcnQgY29uc3QgbWFpblBhZ2UgPSBuZXcgUGFnZSgnbWFpblBhZ2UnLCBbXG4gIHsgeDogMjksIHk6IDI3LCByOiAyMzIsIGc6IDIwOCwgYjogMCB9LFxuICB7IHg6IDEwMiwgeTogMjksIHI6IDE4MSwgZzogMjM0LCBiOiAxMTkgfSxcbiAgeyB4OiAyNzUsIHk6IDYwMSwgcjogMTk5LCBnOiAxODMsIGI6IDEwNCB9LFxuICB7IHg6IDMyNiwgeTogNjAxLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IHJvbGxEb3VibGVzUGFnZSA9IG5ldyBQYWdlKFxuICAncm9sbERvdWJsZXNQYWdlJyxcbiAgW1xuICAgIHsgeDogOTcsIHk6IDIxOSwgcjogMjQ1LCBnOiAyNDIsIGI6IDIyNiB9LFxuICAgIHsgeDogMjUzLCB5OiAyMTksIHI6IDIzOSwgZzogMjM2LCBiOiAyMjEgfSxcbiAgICB7IHg6IDE4MCwgeTogNDg0LCByOiAxNjYsIGc6IDExNywgYjogMjAwIH0sXG4gICAgeyB4OiAxNjUsIHk6IDU1NiwgcjogMTM0LCBnOiAxMTYsIGI6IDE5MCB9LFxuICAgIHsgeDogMjIxLCB5OiA1MzUsIHI6IDEzOCwgZzogMTE5LCBiOiAxOTIgfSxcbiAgXSxcbiAgeyB4OiAxODAsIHk6IDUyOCB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGljZTFUaW1lUGFnZSA9IG5ldyBQYWdlKCdkaWNlMVRpbWVQYWdlJywgW1xuICB7IHg6IDI0NCwgeTogNDU4LCByOiAyNTIsIGc6IDE4MSwgYjogNTUgfSxcbiAgeyB4OiAyNDYsIHk6IDQ2MywgcjogMjUyLCBnOiAxODIsIGI6IDUxIH0sXG4gIHsgeDogMjU2LCB5OiA0NjMsIHI6IDI1MiwgZzogMTgyLCBiOiA1MSB9LFxuICB7IHg6IDI1NCwgeTogNDY3LCByOiAyNTIsIGc6IDE4MiwgYjogNDggfSxcbiAgeyB4OiAyNTQsIHk6IDQ3MiwgcjogMjUyLCBnOiAxODEsIGI6IDQ0IH0sXG4gIHsgeDogMjU0LCB5OiA0NzcsIHI6IDI1MiwgZzogMTc4LCBiOiAzOSB9LFxuICB7IHg6IDI0NywgeTogNDc3LCByOiAyNTIsIGc6IDE3OCwgYjogMzkgfSxcbiAgeyB4OiAyNDYsIHk6IDQ3MiwgcjogMjUyLCBnOiAxODEsIGI6IDQ0IH0sXG4gIHsgeDogMjQwLCB5OiA0NzEsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAyMzQsIHk6IDQ3MSwgcjogMjUyLCBnOiAxODEsIGI6IDQ1IH0sXG4gIHsgeDogMjUwLCB5OiA0NjgsIHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfSxcbiAgeyB4OiAyNTAsIHk6IDQ3MiwgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9LFxuICB7IHg6IDI0NywgeTogNDgwLCByOiAyNTIsIGc6IDE3NiwgYjogMzYgfSxcbl0pO1xuXG5leHBvcnQgY29uc3QgYXR0YWNrUGFnZSA9IG5ldyBQYWdlKCdhdHRhY2tQYWdlJywgW1xuICB7IHg6IDI3NCwgeTogNjIsIHI6IDIxOSwgZzogMTk3LCBiOiAxMzMgfSxcbiAgeyB4OiAyMSwgeTogNjE0LCByOiAyMzMsIGc6IDIzMCwgYjogMjE5IH0sXG4gIHsgeDogOTUsIHk6IDYxNSwgcjogMjA1LCBnOiAxOTAsIGI6IDExMiB9LFxuICB7IHg6IDI2MywgeTogNjE0LCByOiAyMDMsIGc6IDE4OCwgYjogMTExIH0sXG4gIHsgeDogMzQxLCB5OiA2MTUsIHI6IDIzMywgZzogMjMwLCBiOiAyMTkgfSxcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhbENvbGxlY3RQYWdlID0gbmV3IFBhZ2UoXG4gICdnZW5lcmFsQ29sbGVjdFBhZ2UnLFxuICBbXG4gICAgeyB4OiAxMTUsIHk6IDU4OSwgcjogMTAzLCBnOiAyMDUsIGI6IDIwIH0sXG4gICAgeyB4OiA3MCwgeTogNjEwLCByOiAyMzYsIGc6IDIzMiwgYjogMjEyIH0sXG4gICAgeyB4OiAyMjgsIHk6IDYxMSwgcjogNTUsIGc6IDE0OCwgYjogMSB9LFxuICAgIHsgeDogMzA0LCB5OiA2MTcsIHI6IDIzOCwgZzogMjMzLCBiOiAyMTMgfSxcbiAgXSxcbiAgeyB4OiAxODgsIHk6IDU4NSB9XG4pO1xuXG5leHBvcnQgY29uc3QgY29sbGVjdFBhZ2UgPSBuZXcgUGFnZShcbiAgJ2NvbGxlY3RQYWdlJyxcbiAgW1xuICAgIHsgeDogNjMsIHk6IDU0MiwgcjogMjQ1LCBnOiAyNDIsIGI6IDIyNiB9LFxuICAgIHsgeDogODYsIHk6IDU1NywgcjogMTcxLCBnOiAxNjksIGI6IDE1OCB9LFxuICAgIHsgeDogMTEzLCB5OiA1OTksIHI6IDEwMiwgZzogMjA1LCBiOiAxOSB9LFxuICAgIHsgeDogNTksIHk6IDYyMywgcjogMjQwLCBnOiAyMzUsIGI6IDIxNSB9LFxuICAgIHsgeDogMzI0LCB5OiA2MjIsIHI6IDIzOCwgZzogMjMzLCBiOiAyMTQgfSxcbiAgICB7IHg6IDMwNCwgeTogNTQyLCByOiAyNDIsIGc6IDIzOSwgYjogMjIzIH0sXG4gIF0sXG4gIHsgeDogMTgwLCB5OiA2MDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdlbmVyYWxSZXR1cm5QYWdlID0gbmV3IFBhZ2UoXG4gICdnZW5lcmFsUmV0dXJuUGFnZScsXG4gIFtcbiAgICB7IHg6IDExMSwgeTogNTU0LCByOiAxMDgsIGc6IDIwOCwgYjogMjQgfSxcbiAgICB7IHg6IDU1LCB5OiA1NjgsIHI6IDI0MSwgZzogMjIyLCBiOiAxNTkgfSxcbiAgICB7IHg6IDE3NSwgeTogNjIwLCByOiAyMzUsIGc6IDIzMCwgYjogMjExIH0sXG4gICAgeyB4OiAyNTQsIHk6IDU3OSwgcjogOTksIGc6IDIwMywgYjogMTQgfSxcbiAgICB7IHg6IDIyMCwgeTogNTk0LCByOiA1OSwgZzogMTQ3LCBiOiAxIH0sXG4gIF0sXG4gIHsgeDogMTg2LCB5OiA1ODAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGJhbmtQYWdlMSA9IG5ldyBQYWdlKFxuICAnYmFua1BhZ2UnLFxuICBbXG4gICAgeyB4OiA0NywgeTogNDYsIHI6IDI1MiwgZzogMjMzLCBiOiAyMzAgfSxcbiAgICB7IHg6IDMwOCwgeTogNDcsIHI6IDI1MiwgZzogMjMzLCBiOiAyMzAgfSxcbiAgICB7IHg6IDI4MSwgeTogMTQ0LCByOiAzNSwgZzogMTU4LCBiOiAyMDYgfSxcbiAgICB7IHg6IDc5LCB5OiAxNDQsIHI6IDM1LCBnOiAxNTgsIGI6IDIwNiB9LFxuICAgIHsgeDogMTgwLCB5OiA2MjcsIHI6IDMwLCBnOiAxMzYsIGI6IDE4OCB9LFxuICBdLFxuICB7IHg6IDE4MCwgeTogNjAwIH1cbik7XG5cbmV4cG9ydCBjb25zdCBiYW5rUGFnZTIgPSBuZXcgUGFnZShcbiAgJ2JhbmtQYWdlMicsXG4gIFtcbiAgICB7IHg6IDgxLCB5OiA3MCwgcjogMjIzLCBnOiAyMDEsIGI6IDE5MCB9LFxuICAgIHsgeDogMjk1LCB5OiA4MSwgcjogMjIzLCBnOiAyMDEsIGI6IDE5MCB9LFxuICAgIHsgeDogMjkwLCB5OiAxNDYsIHI6IDE5OCwgZzogNjMsIGI6IDUyIH0sXG4gICAgeyB4OiA3MCwgeTogMTQ2LCByOiAxOTcsIGc6IDYzLCBiOiA1MiB9LFxuICAgIHsgeDogMzEzLCB5OiAyNjMsIHI6IDIwMiwgZzogNjUsIGI6IDU0IH0sXG4gIF0sXG4gIHsgeDogMTgwLCB5OiA2MDAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGJhbmtQYWdlcyA9IG5ldyBHcm91cFBhZ2UoJ2JhbmtQYWdlcycsIFtiYW5rUGFnZTEsIGJhbmtQYWdlMl0pO1xuXG5leHBvcnQgY29uc3QgY2xvc2VQYWdlID0gbmV3IFBhZ2UoXG4gICdjbG9zZVBhZ2UnLFxuICBbXG4gICAgeyB4OiAzMzEsIHk6IDg5LCByOiAyNTIsIGc6IDc3LCBiOiAxIH0sXG4gICAgeyB4OiAzMjYsIHk6IDgyLCByOiAyNTUsIGc6IDg4LCBiOiAwIH0sXG4gICAgeyB4OiAzMjIsIHk6IDkwLCByOiAyNTEsIGc6IDc0LCBiOiAxIH0sXG4gICAgeyB4OiAzMjYsIHk6IDk4LCByOiAyMzcsIGc6IDUyLCBiOiAxIH0sXG4gICAgeyB4OiAzMjYsIHk6IDkyLCByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sXG4gIF0sXG4gIHsgeDogMzI0LCB5OiA5MiB9XG4pO1xuXG5leHBvcnQgY29uc3QgaXNEaWNlTWF4VGltZVBhZ2UgPSBuZXcgUGFnZSgnaXNEaWNlTWF4VGltZScsIFtcbiAgeyB4OiAyMzcsIHk6IDQ1OSwgcjogMjE5LCBnOiAxMjYsIGI6IDIyMCB9LFxuICB7IHg6IDI0OSwgeTogNDU5LCByOiAyMTksIGc6IDEyNiwgYjogMjIwIH0sXG4gIHsgeDogMjM4LCB5OiA0ODMsIHI6IDIwOSwgZzogMTExLCBiOiAyMTIgfSxcbiAgeyB4OiAyNTEsIHk6IDQ4MywgcjogMjA5LCBnOiAxMTEsIGI6IDIxMiB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBkaWNlN0xlZnQgPSBuZXcgUGFnZSgnZGljZTdMZWZ0JywgW1xuICB7IHg6IDI2MCwgeTogMTk4LCByOiAyNTMsIGc6IDIzNywgYjogMTU4IH0sXG4gIHsgeDogMjUwLCB5OiAyMDgsIHI6IDI1NSwgZzogMjQ0LCBiOiAxNjAgfSxcbiAgeyB4OiAyNTYsIHk6IDQ0MCwgcjogMjM4LCBnOiAyMDksIGI6IDk2IH0sXG4gIHsgeDogMjcwLCB5OiA0NTIsIHI6IDI0MSwgZzogMjE3LCBiOiA5OCB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBkaWNlN1RvcCA9IG5ldyBQYWdlKCdkaWNlN1RvcCcsIFtcbiAgeyB4OiA4LCB5OiAzODYsIHI6IDI1MywgZzogMjM2LCBiOiAxNTggfSxcbiAgeyB4OiAyLCB5OiAzOTQsIHI6IDI1NSwgZzogMjQ0LCBiOiAxNjAgfSxcbiAgeyB4OiAzNDYsIHk6IDM4NiwgcjogMjUzLCBnOiAyMzgsIGI6IDE1OCB9LFxuICB7IHg6IDM1NiwgeTogMzk0LCByOiAyNTUsIGc6IDI0NCwgYjogMTYwIH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGRpY2U3UmlnaHQgPSBuZXcgUGFnZSgnZGljZTdSaWdodCcsIFtcbiAgeyB4OiAxMDYsIHk6IDIzMCwgcjogMjU0LCBnOiAyNDAsIGI6IDE1OSB9LFxuICB7IHg6IDExOCwgeTogMjQwLCByOiAyNTUsIGc6IDI0NCwgYjogMTYwIH0sXG4gIHsgeDogMTEwLCB5OiA0NzgsIHI6IDI1MywgZzogMjM1LCBiOiAxNTcgfSxcbiAgeyB4OiA5NCwgeTogNDg4LCByOiAyNTUsIGc6IDI0MywgYjogMTYwIH0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGRpY2U3RG93biA9IG5ldyBQYWdlKCdkaWNlN0Rvd24nLCBbXG4gIHsgeDogNCwgeTogMjY2LCByOiAyNDAsIGc6IDIxNiwgYjogOTggfSxcbiAgeyB4OiAxNiwgeTogMjc0LCByOiAyNDEsIGc6IDIxOSwgYjogMTEzIH0sXG4gIHsgeDogMzUyLCB5OiAyNTQsIHI6IDI1MiwgZzogMjM0LCBiOiAxNTcgfSxcbiAgeyB4OiAzNTgsIHk6IDI1NiwgcjogMjU0LCBnOiAyNDMsIGI6IDE1OSB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBkaWNlQmVmb3JlN1N0ZXBzID0gbmV3IEdyb3VwUGFnZSgnZGljZUJlZm9yZTdTdGVwcycsIFtkaWNlN0xlZnQsIGRpY2U3VG9wLCBkaWNlN1JpZ2h0LCBkaWNlN0Rvd25dLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMC45NSk7XG5cbmV4cG9ydCBjb25zdCBidWlsZEhvdXNlSGludFBhZ2UgPSBuZXcgUGFnZSgnYnVpbGRIb3VzZUhpbnRQYWdlJywgW1xuICB7IHg6IDk2LCB5OiA1NzgsIHI6IDI1NSwgZzogMCwgYjogMCB9LFxuICB7IHg6IDEwOCwgeTogNTc3LCByOiAyNTUsIGc6IDAsIGI6IDAgfSxcbiAgeyB4OiAxMDIsIHk6IDU3MCwgcjogMjU1LCBnOiAwLCBiOiAwIH0sXG4gIHsgeDogODIsIHk6IDU5MiwgcjogMjAyLCBnOiAxODcsIGI6IDEwMCB9LFxuXSk7XG5cbmV4cG9ydCBjb25zdCBidWlsZEhvdXNlUGFnZSA9IG5ldyBQYWdlKCdidWlsZEhvdXNlUGFnZScsIFtcbiAgeyB4OiAzNiwgeTogNjA4LCByOiAyMzYsIGc6IDIzMSwgYjogMjEyIH0sXG4gIHsgeDogMzAyLCB5OiA2MDUsIHI6IDIzNywgZzogMjMyLCBiOiAyMTMgfSxcbiAgeyB4OiAyNjMsIHk6IDMwLCByOiA0NiwgZzogMTYzLCBiOiAyOSB9LFxuICB7IHg6IDEwNiwgeTogMzAsIHI6IDIyNSwgZzogMjA2LCBiOiAxMjQgfSxcbiAgeyB4OiAxNTAsIHk6IDI3OSwgcjogMTU1LCBnOiAxNDEsIGI6IDExMiB9LFxuXSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJpbXBvcnQgeyBIZWxsb3dvcmxkIH0gZnJvbSAnLi9zcmMnO1xuXG4vLyBUaGlzIGlzIGEgc2FtcGxlIHNob3dpbmcgaG93IHRvIHVzZSByZXJvdXRlclxuLy8gSXQgc2hvdWxkIG9wZW4gR29vZ2xlIFBsYXkgYXBwLCBhbmQgdGFwICdTaWduaW4nIGJ1dHRvblxuXG5sZXQgaGVsbG93b3JsZDogSGVsbG93b3JsZCB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydChqc29uQ29uZmlnOiBhbnkpIHtcbiAgaGVsbG93b3JsZCA9IG5ldyBIZWxsb3dvcmxkKGpzb25Db25maWcpO1xuICBoZWxsb3dvcmxkLnN0YXJ0KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RvcCgpIHtcbiAgaWYgKGhlbGxvd29ybGQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBoZWxsb3dvcmxkLnN0b3AoKTtcbiAgaGVsbG93b3JsZCA9IHVuZGVmaW5lZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHt9XG59XG4od2luZG93IGFzIGFueSkuc3RhcnQgPSBzdGFydDtcbih3aW5kb3cgYXMgYW55KS5zdG9wID0gc3RvcDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
function start(jsonConfig){window.start(jsonConfig);}
function stop(){window.stop();}

