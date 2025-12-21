"use strict";

var VERSION = '80';

/**
 * Returns the language parameter for the currently active locale.
 * @param msgZhTW {string} the message in zh-TW
 * @param msgEn {string} the message in en-US
 * @returns {string} msgZhTW if current locale is zh-TW, else msgEn
 */
function i18n(msgZhTW, msgEn) {
    if (localStorage && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
        return msgZhTW;
    }
    return msgEn;
}

var settings = [
    [
        {
            title: 'Thanks ttung for improve image recognition and send heart function',
            title_zh_TW: '感謝 ttung 提供改善辨識和送心功能'
        },
        {
            title: 'Thanks Chris Kwan\'s and Melissa Stinson\'s great help',
            title_zh_TW: '感謝 Chris Kwan 和 Melissa Stinson 的熱情幫忙'
        },
        {
            key: 'buildDate',
            title: 'Build date: $BUILD_DATE',
            title_zh_TW: '建造日期: $BUILD_DATE'
        },
        {
            key: 'debugLogs',
            title: 'Debug logs',
            title_zh_TW: '调试日志',
            default: false,
            dev_mode: true
        },
        {
            key: 'debugGame',
            title: 'Debug game',
            title_zh_TW: '调试游戏',
            default: false,
            dev_mode: true
        }
    ],
    [
        {
            title: 'Language',
            title_zh_TW: '語言',
            buttons: [
                {title: 'En', onclick: 'saveLocale("en-US")'},
                {title: '中文', onclick: 'saveLocale("zh-TW")'}
            ]
        },
        {
            key: 'jpVersion',
            title: 'Japan Version?',
            title_zh_TW: '日本版?',
            default: false
        },
        {
            key: 'specialScreenRatio',
            title: 'Special Screen Ratio(Long Screen)(Should start in game)',
            title_zh_TW: '特殊螢幕比例(長螢幕)(遊戲中啟動)',
            default: false
        },
        {
            key: 'autoLaunchApp',
            title: 'Auto Launch Tsum App',
            title_zh_TW: '自動開啟 Tsum App',
            default: false
        }
    ],
    [
        {
            transient: true,
            key: 'autobuyBoxes',
            title: 'Auto buy boxes',
            title_zh_TW: '自動抽盒（次）',
            default: 0,
            step: 10,
            max: 500,
            min: 0
        }
    ],
    [
        {
            key: 'autoPlayGame',
            title: 'Auto Play Game',
            title_zh_TW: '自動玩遊戲',
            default: true
        },
        {
            key: 'pauseWhenCalc',
            title: 'Pause When Calculating',
            title_zh_TW: '計算時暫停',
            default: false
        },
        {
            key: 'clearBubbles',
            title: 'Clear Bubbles',
            title_zh_TW: '自動清除泡泡',
            default: false
        },
        {
            key: 'useFan',
            title: 'Use Fan?',
            title_zh_TW: '使用風扇',
            default: false
        },
        {
            key: 'bonusScore',
            title: '+Score',
            title_zh_TW: '道具Score',
            default: false
        },
        {
            key: 'bonusCoin',
            title: '+Coin',
            title_zh_TW: '道具Coin',
            default: false
        },
        {
            key: 'bonusExp',
            title: '+Exp',
            title_zh_TW: '道具Exp',
            default: false
        },
        {
            key: 'bonusTime',
            title: '+Time',
            title_zh_TW: '道具Time',
            default: false
        },
        {
            key: 'bonusBubble',
            title: '+Bubble',
            title_zh_TW: '道具Bubble',
            default: false
        },
        {
            key: 'bonus5to4',
            title: '5>4',
            title_zh_TW: '道具五變四',
            default: false
        },
        {
            key: 'bonusCombo',
            title: '+Combo',
            title_zh_TW: '道具Combo',
            default: false
        },
        {
            key: 'skillWaitingTime',
            title: 'Skill Waiting time (sec)',
            title_zh_TW: '技能等待時間(秒)',
            default: 3,
            step: 1,
            max: 15,
            min: 1
        },
        {
            key: 'skillLevel',
            title: 'Skill Level',
            title_zh_TW: '技能等級',
            default: 3,
            step: 1,
            max: 6,
            min: 1
        },
        {
            key: 'skillType',
            title: 'Skill Type',
            title_zh_TW: '技能類型',
            default: 'burst',
            dropdown: [
                {key: 'burst', title: 'Burst', title_zh_TW: '消除系'},
                {key: 'burst_bubbles', title: 'Burst bubbles', title_zh_TW: '消除系2'},
                {key: 'block_donald_s', title: 'Donald', title_zh_TW: '唐老鴨'},
                {key: 'block_donaldx_s', title: 'Holiday Donald', title_zh_TW: '假日唐老鴨'},
                {key: 'block_lukej_s', title: 'Jedi Luke', title_zh_TW: '絕地路克'},
                {key: 'block_moana_s', title: 'Moana', title_zh_TW: '莫娜'},
                {key: 'block_marie_s', title: 'Marie', title_zh_TW: '瑪麗'},
                {key: 'block_missbunny_s', title: 'Miss Bunny', title_zh_TW: '小兔子'},
                {key: 'block_rabbit_s', title: 'Rabbit', title_zh_TW: '兔子'},
                {key: 'block_mickeyh2015_s', title: 'Horn Hat Mickey', title_zh_TW: '角帽米奇'},
                {key: 'block_snowwhite_s', title: 'Snow White', title_zh_TW: '白雪公主'},
                {key: 'block_cinderella_s', title: 'Cinderella', title_zh_TW: '仙度瑞拉'},
                {key: 'block_woody2_s', title: 'Sheriff Woody', title_zh_TW: '警長胡迪'},
                {key: 'block_cabbage_mickey_s', title: 'Cabbage Mickey', title_zh_TW: '高麗菜米奇'},
                {key: 'block_cpt_ly_s', title: 'Cpt. Lightyear', title_zh_TW: '光年隊長'},
                {key: 'block_lightning_mcqueen_plus_s', title: 'Lightning McQueen+', title_zh_TW: '閃電麥坤+'},
                {key: 'block_pair_tsum', title: 'Pair Tsum', title_zh_TW: '搭檔Tsum'},
                {key: 'no_skill', title: 'No Skill', title_zh_TW: '没有技能'}
            ]
        },
        {
            key: 'noSkillLastFeverSec',
            title: 'No skill last fever seconds',
            title_zh_TW: 'Fever尾段扣技能秒數',
            default: 0,
            step: 1,
            max: 10,
            min: 0
        },
        {
            key: 'unlockLevelHoursWait',
            title: 'Unlock Level every hours',
            title_zh_TW: '解鎖角色等級時間(時)',
            default: 0,
            min: 0,
            max: 24,
            step: 1
        }
    ],
    [
        {
            key: 'receiveAllHearts',
            title: 'Receive All Hearts',
            title_zh_TW: '收全部愛心',
            default: true
        },
        {
            key: 'receiveAllHeartsMinWait',
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 25,
            step: 5,
            max: 60,
            min: 5
        }
    ],
    [
        {
            key: 'receiveHeartsOneByOne',
            title: 'Receive Hearts One By One',
            title_zh_TW: '一顆一顆收愛心',
            default: false
        },
        {
            key: 'receiveHeartsSkipFirst',
            title: 'Skip first person',
            title_zh_TW: '從第二行開始接收',
            default: false
        },
        {
            key: 'receiveHeartsSkipRuby',
            title: 'Skip Ruby',
            title_zh_TW: '跳過紅寶石',
            default: false
        },
        {
            key: 'claimAllWithoutCoins',
            title: 'Claim All old mails',
            title_zh_TW: '領取過期郵件',
            default: false
        },
        {
            key: 'mailOpenMax',
            title: 'Max Times to Open Mailbox',
            title_zh_TW: '重複檢查上限次數',
            default: 5,
            step: 1,
            max: 20,
            min: 1
        },
        {
            key: 'mailMinWait',
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 5,
            step: 2,
            max: 60,
            min: 1
        },
        {
            key: 'recordSender',
            title: 'Record Sender',
            title_zh_TW: '記錄送心者',
            default: false
        },
        {
            key: 'recordSenderEnlarge',
            title: 'Enlarge Sender\'s Image (Emulator)',
            title_zh_TW: '放大送心者圖片(模擬器)',
            default: false
        }
    ],
    [
        {
            key: 'sendHeartsAuto',
            title: 'Auto Send Hearts',
            title_zh_TW: '自動送愛心',
            default: false
        },
        {
            key: 'sendHeartsToZeroScore',
            title: 'Send to 0 score',
            title_zh_TW: '送心給 0 分',
            default: false
        },
        {
            key: 'sendHeartsMaxRuntime',
            title: 'Max run time(min) [Start from the first place if time is 0]',
            title_zh_TW: '執行時間上限(分) [0 將從第一名開始送]',
            default: 0,
            step: 5,
            max: 80,
            min: 0
        },
        {
            key: 'sendHeartsMinWait',
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 26,
            step: 5,
            max: 60,
            min: 1
        }
    ],
    [
        {
            key: 'tsumMonitorUrl',
            title: 'URL to Tsum Monitor',
            title_zh_TW: 'Tsum監視器URL',
            default: ""
        }
    ],
    [
        {
            title: '<b style="color: red">Experimental features</b><br>Things may not work correctly in every scenario',
            title_zh_TW: '<b style="color: red">實驗性功能</b><br>無法保證所有功能正常運作'
        },
        {
            key: 'tsumAppRestartFrequency',
            title: 'Tsum app restart frequency (hours)',
            title_zh_TW: '定時重啟Tsum app（時）',
            min: 0,
            max: 120,
            step: 6,
            default: 0
        }
    ]
];

// noinspection JSUnusedGlobalSymbols
function saveLocale(locale) {
    if (localStorage !== undefined) {
        localStorage.setItem('tsumtsumlanguage', locale);
        location.reload();
    }
}

function loadSettings(settings) {
    if (localStorage === undefined) {
        return;
    }
    /** @type {Object.<string, boolean|number|string>} */
    var recordSettings;
    var settingsJSON = localStorage.getItem('tsumtsumsettings2');
    if (settingsJSON) {
        // new key based setting assignments
        recordSettings = JSON.parse(settingsJSON);
        if (!recordSettings) {
            return;
        }
        (function () {
            for (var k1 in settings) {
                for (var k2 in settings[k1]) {
                    var setting = settings[k1][k2];
                    if (setting.transient === true) {
                        continue;
                    }
                    var key = setting.key;
                    if (typeof key === 'string' && typeof recordSettings[key] === typeof setting.default) {
                        setting.default = recordSettings[key];
                    }
                }
            }
        })();
    } else {
        log(i18n('没有找到设置，使用默认设置', 'No settings found, using default ones'));
        return;
    }
    log(i18n('讀取設定', 'Load settings'));
}

function saveSettings(settings) {
    if (localStorage !== undefined) {
        var recordSettings = {};
        for (var i in settings) {
            for (var g in settings[i]) {
                var setting = settings[i][g];
                if (setting.transient === true) {
                    continue;
                }
                var key = setting.key;
                var selector = '.' + key;
                if (typeof setting.default === 'boolean') {
                    recordSettings[key] = $(selector).is(':checked');
                } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                    recordSettings[key] = setting.default;  // why here no retieval via jQuery?
                } else if (typeof setting.default === 'number') {
                    recordSettings[key] = +$(selector).val();
                } else if (typeof setting.default === 'string') {
                    recordSettings[key] = $(selector).val();
                }
            }
        }
        localStorage.setItem('tsumtsumsettings2', JSON.stringify(recordSettings));

        log(i18n('儲存設定', 'Save settings'));
    }
}

function resetSettings() {
    localStorage.removeItem('tsumtsumsettings2');
    $("#restartNowText")
      .text(i18n('立即重启TsumTsum脚本', 'Restart TsumTsum script now'))
      .show();
}

function genStartCommand(settings) {
    var commandSettings = {};
    for (var i in settings) {
        for (var g in settings[i]) {
            var setting = settings[i][g];
            var key = setting.key;
            var selector = "." + key;
            if (typeof setting.default === 'boolean') {
                commandSettings[key] = $(selector).is(':checked');
            } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                commandSettings[key] = setting.default; // why here no retieval via jQuery?
            } else if (typeof setting.default === 'number') {
                commandSettings[key] = +$(selector).val();
            } else if (typeof setting.default === 'string') {
                commandSettings[key] = $(selector).val();
            }
        }
    }

    // Additionally send Taiwan locale information to the start function
    var lang = localStorage.getItem('tsumtsumlanguage');
    commandSettings.langTaiwan = lang === 'zh-TW';
    // Create the start command
    var command = "start(" + JSON.stringify(commandSettings) + ");";
    log(i18n('啟動命令: ', 'Start command: ') + command);
    return command;
}

/**
 * @returns {string}
 */
function getTitle(setting) {
    return i18n(setting.title_zh_TW, setting.title);
}

function appendTitle(jSetting, title) {
    jSetting.append('<div class="col-xs-4">' + title + '</div>');
}

function appendCol(jSetting, jContent) {
    var jDiv = $('<div class="pull-right"></div>');
    var jCol = $('<div class="col-xs-8"></div>');
    if (Array.isArray(jContent)) {
        for (var j in jContent) {
            jDiv.append(jContent[j]);
        }
    } else {
        jDiv.append(jContent);
    }
    jCol.append(jDiv);
    jSetting.append(jCol);
}

function getSwitchButton(key, checked) {
    var jLabel = $('<label class="switch pull-right"></label>');
    var jInput = $('<input id="setting_value_' + key + '" class="setting_input_value" type="checkbox" ' + (checked ? 'checked' : '') + '/>').addClass(key);
    jInput.on('change', function () {
        saveSettings(settings);
    });
    jLabel.append(jInput);
    jLabel.append('<a class="slider round"></a>');
    return jLabel;
}

function genSettings(jContainer, settings) {
    for (var i in settings) {
        var jGroup = $('<div class="list-group"></div>');
        for (var g in settings[i]) {
            var setting = settings[i][g];
            var key = setting.key;
            var title = getTitle(setting);
            var jGroupItem = $('<div id="setting_' + key + '" class="list-group-item"></div>');
            if (setting.dev_mode) {
                jGroupItem.addClass("dev_mode");
                jGroupItem.hide();
            }
            var jSetting = $('<div class="row"></div>');
            if (typeof setting.default === 'boolean') {
                appendTitle(jSetting, title);
                appendCol(jSetting, getSwitchButton(key, setting.default));
            } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                var jDiv = $('<div class="dropdown"></div>');
                var jDropdownBtn = $('<button id="setting_value_' + key + '" class="dropbtn"></button>').addClass(key);
                var jDropdown = $('<div class="dropdown-content"></div>');
                jDropdownBtn.on('click', (function (jDropdown) {
                    return function () {
                        jDropdown.addClass('show');
                    }
                })(jDropdown));
                var items = setting.dropdown;
                for (var index = 0; index < items.length; index++) {
                    var item = items[index];
                    var itemTitle = getTitle(item);
                    if (item.key === setting.default) {
                        jDropdownBtn.text(itemTitle);
                    }
                    var jItem = $('<a href="#' + itemTitle + '" class="action-dropdown-item">' + itemTitle + '</a>');
                    jItem.on('click', (function (jDropdown, jDropdownBtn, itemTitle, setting, key) {
                        return function () {
                            setting.default = key;
                            jDropdownBtn.text(itemTitle);
                            jDropdown.removeClass('show');
                            saveSettings(settings);
                        }
                    })(jDropdown, jDropdownBtn, itemTitle, setting, item.key));
                    jDropdown.append(jItem);
                }
                jDiv.append(jDropdownBtn).append(jDropdown);
                appendTitle(jSetting, title);
                appendCol(jSetting, jDiv);
            } else if (typeof setting.default === 'number') {
                var step = setting.step || 1;
                var max = setting.max;
                var min = setting.min;

                // Check if the current step is already 1
                var hasIncrementBy1 = (step === 1);

                var jBtns = [];
                var jInput = $('<input id="setting_value_' + key + '" class="setting_input_value" type="number" value="' + setting.default + '" readonly/>').addClass(key);
                var jBtnP = $('<button id="setting_value_p_' + key + '" class="btn btn-danger">+' + step + '</button>');
                var jBtnM = $('<button id="setting_value_m_' + key + '" class="btn btn-danger">-' + step + '</button>');

                // Only create additional increment-by-1 buttons if step isn't already 1
                var jBtnP1, jBtnM1;
                if (!hasIncrementBy1) {
                    jBtnP1 = $('<button id="setting_value_p1_' + key + '" class="btn btn-danger">+1</button>');
                    jBtnM1 = $('<button id="setting_value_m1_' + key + '" class="btn btn-danger">-1</button>');
                } else {
                    // remove the assignment, or the following inputs will be changed, too
                    jBtnP1 = $([]);
                    jBtnM1 = $([]);
                }

                jBtnP.on('click', (function (jInput, min, max, step) {
                    return function () {
                        var newValue = (+jInput.val()) + step;
                        jInput.val(Math.min(newValue, max));
                        saveSettings(settings);
                    }
                })(jInput, min, max, step));
                jBtnM.on('click', (function (jInput, min, max, step) {
                    return function () {
                        var newValue = (+jInput.val()) - step;
                        jInput.val(Math.max(newValue, min));
                        saveSettings(settings);
                    }
                })(jInput, min, max, step));

                // Event handlers for single-step adjustment
                jBtnP1.on('click', (function (jInput, min, max) {
                    return function () {
                        var newValue = (+jInput.val()) + 1;
                        jInput.val(Math.min(newValue, max));
                        saveSettings(settings);
                    };
                })(jInput, min, max));

                jBtnM1.on('click', (function (jInput, min, max) {
                    return function () {
                        var newValue = (+jInput.val()) - 1;
                        jInput.val(Math.max(newValue, min));
                        saveSettings(settings);
                    };
                })(jInput, min, max));

                jBtns.push(jInput);
                jBtns.push(jBtnP);
                jBtns.push(jBtnM);

                if (!hasIncrementBy1) {
                    jBtns.push(jBtnP1); // Add new +1 button if needed
                    jBtns.push(jBtnM1); // Add new -1 button if needed
                }
            
                
                jInput.on('change', function () {
                    saveSettings(settings);
                });
                appendTitle(jSetting, title);
                appendCol(jSetting, jBtns);
            } else if (typeof setting.default === 'string') {
                var jInput = $('<input id="setting_value_' + key + '" class="setting_input_value" type="text" value="' + setting.default + '"/>').addClass(key);
                jInput.on('change', function () {
                    saveSettings(settings);
                });
                appendTitle(jSetting, title);
                appendCol(jSetting, jInput);
            } else if (setting.buttons !== undefined) {
                var jBtns = [];
                for (var j in setting.buttons) {
                    var jBtn = $('<button id="setting_value_b_' + key + '" onclick=' + setting.buttons[j].onclick + '>' + setting.buttons[j].title + '</button>').addClass('btn btn-plus');
                    jBtns.push(jBtn);
                }
                appendTitle(jSetting, title);
                appendCol(jSetting, jBtns);
            } else if (title !== undefined) {
                jSetting.append('<div class="col-xs-12">' + title + '</div>');
            }
            jGroupItem.append(jSetting);
            jGroup.append(jGroupItem);
        }
        jContainer.append(jGroup)
    }
}

// entry function called by Robotmon
// noinspection JSUnusedGlobalSymbols
function onEvent(eventType) {
    if (eventType === 'OnPlayClick') {
        // close settings by hiding and showing menu
        JavaScriptInterface.hideMenu();
        JavaScriptInterface.showMenu();
        var startCommand = genStartCommand(settings);
        JavaScriptInterface.runScript(startCommand);
    } else if (eventType === 'OnPauseClick') {
        JavaScriptInterface.runScript('stop();');
    } else if (eventType === 'OnSettingClick') {
        // stop script as it would now tap on the settings page
        JavaScriptInterface.runScript('stop();');
    }
}

// function called by Robotmon when writing logs
// noinspection JSUnusedGlobalSymbols
function onLog(message) {
    console.log(message);
}

function log() {
    var params = '[Settings] ';
    if (typeof arguments === 'object') {
        for (var k in arguments) {
            var arg = arguments[k];
            params += arg.replace(/'/g, '"') + ' ';
        }
    }
    if (typeof JavaScriptInterface !== "undefined" && typeof JavaScriptInterface.runScript === "function") {
        JavaScriptInterface.runScript('console.log(\'' + params + '\')');
    } else {
        console.log(params);
    }

}

function refreshRecord() {
    JavaScriptInterface.runScriptCallback('readFile(getStoragePath() + "/tsum_record/record.txt")', 'genRecord');
}

var imageQueue = [];
var isRunning = false;

function getBase64(id, filename) {
    var script = 'var __img_=openImage(getStoragePath()+"/tsum_record/' + filename + '");if(__img_ != 0){var __' + id + '_base64_="' + id + ',"+getBase64FromImage(__img_);releaseImage(__img_);};__' + id + '_base64_;';
    imageQueue.push(script);
    if (!isRunning) {
        isRunning = true;
        JavaScriptInterface.runScriptCallback(imageQueue.shift(), 'assignImage');
    }
}

function assignImage(results) {
    var rs = results.split(',');
    if (rs.length === 2) {
        $('#' + rs[0]).attr('src', 'data:image/png;base64,' + rs[1]);
    }
    if (imageQueue.length === 0) {
        isRunning = false;
    } else {
        JavaScriptInterface.runScriptCallback(imageQueue.shift(), 'assignImage');
    }
}

function getTimeString(d) {
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
}

function getDayTimeString(d) {
    return (d.getMonth() + 1) + '/' + d.getDate();
}

function getRecordFilename() {
    var d = new Date();
    return 'record_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '.html';
}

function genRecordTable(path) {
    $("#genTableResult").html(path);
}

var ASC = true;

function genRecord(record) {
    if (record === undefined || record === 'undefined' || record === '') {
        return;
    }
    var recordObjs = JSON.parse(record);
    record = [];
    var filename;
    for (filename in recordObjs) {
        if (filename === 'hearts_count') {
            continue;
        }
        var obj = recordObjs[filename];
        var totalCount = 0;
        for (var d in obj.receiveCounts) {
            totalCount += +obj.receiveCounts[d];
        }
        obj.totalCount = totalCount;
        obj.filename = filename;
        record.push(obj);
    }
    if (ASC) {
        record.sort(function (a, b) {
            return a.totalCount < b.totalCount ? -1 : 1;
        });
    } else {
        record.sort(function (a, b) {
            return a.totalCount >= b.totalCount ? -1 : 1;
        });
    }

    var html = '<ul>';
    for (var idx in record) {
        filename = record[idx].filename;
        var imgId = filename.split('.')[0];
        var lastTime = new Date(record[idx].lastReceiveTime);
        html += '<li>'
        html += '<div><img id="' + imgId + '" />' + getTimeString(lastTime) + '</div>';
        html += '<ul>';
        for (var day in record[idx].receiveCounts) {
            var dayTime = new Date(+day * 86400000);
            html += '<li>';
            html += getDayTimeString(dayTime) + ': get ' + record[idx].receiveCounts[day] + ' hearts';
            html += '</li>';
        }
        html += '</ul>';
        html += '</li>';
        getBase64(imgId, filename);
    }
    html += '</ul>';
    $('#record').html(html);
}

var $exportRecordLegacy = $('#exportRecordLegacy').on('click', function () {
    $(this).text(i18n('輸出中', 'Exporting'));
    var html = $('#record').html();
    html = html.replace(/\n/g, '');
    var script = 'writeFile(getStoragePath() + "/tsum_record/' + getRecordFilename() + '", \'<body>' + html + '</body>\');';
    JavaScriptInterface.runScriptCallback(script, 'exportSuccess');
});

function exportSuccess() {
    $exportRecordLegacy.text(i18n('輸出 HTML(舊版)', 'Export HTML(Legacy)'));
}

var buildDateClicks = 0;
// render settings page
$(function ($) {
    $('#version').html('Tsum Tsum v' + VERSION);

    loadSettings(settings);
    genSettings($('#settings'), settings);

    $("#setting_buildDate").on("click", function () {
        buildDateClicks++;
        log("Increased build date clicks to " + buildDateClicks);
        if (buildDateClicks >= 10) {
            $('#resetSettings').show();
            $('.dev_mode').show();
        }
    });

    $('#senders').text(i18n('誰送你心', 'List of Heart Counts'));
    $('#updateRecordASC').text(i18n('更新(遞增)', 'Update(ASC)')).on('click', function () {
        ASC = true;
        refreshRecord();
    });
    $('#updateRecordDESC').text(i18n('更新(遞減)', 'Update(DESC)')).on('click', function () {
        ASC = false;
        refreshRecord();
    });
    var protect = true;
    $('#resetRecord').text(i18n('清除紀錄', 'Reset Record')).on('click', function () {
        if (protect) {
            $(this).text(i18n('確定要清除紀錄嗎？', 'Are you sure?'));
        } else {
            $(this).text(i18n('清除紀錄', 'Reset Record'));
            JavaScriptInterface.runScript('execute("rm -r " + getStoragePath() + "/tsum_record");');
            $('#record').html('');
        }
        protect = !protect;
    });
    $('#goToTop').text(i18n('回頁面頂端', 'Go to Top')).on('click', function () {
        window.scrollTo(0, 0);
    });
    $('#goToBottom').text(i18n('回頁面底端', 'Go to Bottom')).on('click', function () {
        window.scrollTo(0, document.body.scrollHeight);
    });
    $('#exportInfo').text(i18n(
        '輸出 HTML(舊版) 請先點選更新後等待圖片的讀取，完成後再點選輸出 HTML(舊版)',
        'Legacy exporting has to click Update and wait for loading all images first before click Export HTML(Legacy)'));
    $exportRecordLegacy.text(i18n('輸出 HTML(舊版)', 'Export HTML(Legacy)'));
    $('#exportRecordExcel').text(i18n('輸出 HTML(Excel)', 'Export HTML(Excel)')).on('click', function () {
        $("#genTableResult").html(i18n("请稍等...", "Please wait..."));
        JavaScriptInterface.runScriptCallback('genRecordTable();', 'genRecordTable');
    });

    // convenience preparations of Robotmon control panel
    JavaScriptInterface.showMenu();
});
