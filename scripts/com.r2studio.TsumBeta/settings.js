"use strict";

var VERSION = 58;
var ASC = true;
var VERSIONS = {
    58: {resetSettings: true}
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
            title: 'Build date: $BUILD_DATE',
            title_zh_TW: '建造日期: $BUILD_DATE'
        }
    ],
    [
        {
            title: 'Language',
            title_zh_TW: '語言',
            buttons: [
                {
                    title: 'En',
                    onclick: 'saveLocale("en-US")'
                },
                {
                    title: '中文',
                    onclick: 'saveLocale("zh-TW")'
                }
            ]
        },
        {title: 'Japan Version?', title_zh_TW: '日本版?', default: false},
        {
            title: 'Special Screen Ratio(Long Screen)(Should start in game)',
            title_zh_TW: '特殊螢幕比例(長螢幕)(遊戲中啟動)',
            default: false
        },
        {title: 'Auto Launch Tsum App', title_zh_TW: '自動開啟 Tsum App', default: false}
    ],
    [
        {title: 'Auto Play Game', title_zh_TW: '自動玩遊戲', default: true},
        {title: 'Pause When Calculating', title_zh_TW: '計算時暫停', default: false},
        {title: 'Clear Bubbles', title_zh_TW: '自動清除泡泡', default: false},
        {title: 'Use Fan?', title_zh_TW: '使用風扇', default: false},
        {title: '5>4', title_zh_TW: '道具五變四', default: false},
        {title: '+Coin', title_zh_TW: '道具Coin', default: false},
        {title: '+Bubble', title_zh_TW: '道具Bubble', default: false},
        {title: 'All Bonus Items', title_zh_TW: '開/關全部道具', default: false},
        {
            title: 'Skill Waiting time (sec)',
            title_zh_TW: '技能等待時間(秒)',
            default: 3,
            step: 1,
            max: 15,
            min: 1
        },
        {
            title: 'Skill Level',
            title_zh_TW: '技能等級',
            default: 3,
            step: 1,
            max: 6,
            min: 1
        },
        {
            title: 'Skill Type',
            title_zh_TW: '技能類型',
            default: 'burst',
            dropdown: [
                {key: 'burst', title: 'Burst', title_zh_TW: '消除系'},
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
                {key: 'block_woody2_s', title: 'Sheriff Woody', title_zh_TW: '警長胡迪'}
            ]
        }
    ],
    [
        {title: 'Receive All Hearts', title_zh_TW: '收全部愛心', default: true},
        {
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 25,
            step: 5,
            max: 60,
            min: 5
        }
    ],
    [
        {title: 'Receive Hearts One By One', title_zh_TW: '一顆一顆收愛心', default: false},
        {title: 'Skip first person(disable record)', title_zh_TW: '跳過一個使用者(無法紀錄收心)', default: false},
        {title: 'Skip Ruby', title_zh_TW: '保留鑽石', default: false},
        {
            title: 'Max Times to Open Mailbox',
            title_zh_TW: '重複檢查上限次數',
            default: 5,
            step: 1,
            max: 20,
            min: 1
        },
        {
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 5,
            step: 2,
            max: 60,
            min: 1
        },
        {title: 'Record Sender', title_zh_TW: '記錄送心者', default: false},
        {title: 'Enlarge Sender\'s Image (Emulator)', title_zh_TW: '放大送心者圖片(模擬器)', default: false}
    ],
    [
        {title: 'Auto Send Hearts', title_zh_TW: '自動送愛心', default: false},
        {title: 'Send to 0 score', title_zh_TW: '送心給 0 分', default: false},
        {
            title: 'Max run time(min) [Start from the first place if time is 0]',
            title_zh_TW: '執行時間上限(分) [0 將從第一名開始送]',
            default: 0,
            step: 5,
            max: 80,
            min: 0
        },
        {
            title: 'Waiting time (min) before repeat',
            title_zh_TW: '完成後休息時間(分)',
            default: 26,
            step: 5,
            max: 60,
            min: 1
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
    function isResetSettingsRequired(startVersion, endVersion) {
        // check for version jumps that require fallback to default settings
        for (var i = startVersion + 1; i <= endVersion; i++) {
            var v = VERSIONS[i];
            if (v != null && v.resetSettings) {
                return true;
            }
        }
        return false;
    }

    if (localStorage === undefined) {
        return;
    }
    var settingsJSON = localStorage.getItem('tsumtsumsettings');
    if (!settingsJSON) {
        return;
    }
    var version = +localStorage.getItem('tsumtsumversion');
    if (!version
        || version < VERSION && isResetSettingsRequired(version, VERSION)       // version updated
        || version > VERSION && isResetSettingsRequired(VERSION, version)) {    // version downgraded
        return;
    }
    var recordSettings = JSON.parse(settingsJSON);
    if (!recordSettings) {
        return;
    }
    for (var i in settings) {
        for (var g in settings[i]) {
            var id = i + '_' + g;
            var setting = settings[i][g];
            if (recordSettings[id] !== undefined) {
                setting.default = recordSettings[id];
            }
        }
    }

    // This is so we send the locale for logging.... we should do this better but good enough for now.
    var lang = localStorage.getItem('tsumtsumlanguage');
    if (lang === 'zh-TW') {
        log('讀取設定');
    } else {
        log('Load settings');
    }
}

function saveSettings(settings) {
    if (localStorage !== undefined) {
        var recordSettings = {};
        for (var i in settings) {
            for (var g in settings[i]) {
                var id = i + '_' + g;
                var setting = settings[i][g];
                if (typeof setting.default === 'boolean') {
                    recordSettings[id] = $('#setting_value_' + id).is(':checked');
                } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                    recordSettings[id] = setting.default;
                } else if (typeof setting.default === 'number') {
                    recordSettings[id] = +$('#setting_value_' + id).val();
                } else if (typeof setting.default === 'string') {
                    recordSettings[id] = $('#setting_value_' + id).val();
                }
            }
        }
        localStorage.setItem('tsumtsumversion', '' + VERSION);
        localStorage.setItem('tsumtsumsettings', JSON.stringify(recordSettings));

        var lang = localStorage.getItem('tsumtsumlanguage');
        if (lang === 'zh-TW') {
            log('儲存設定');
        } else {
            log('Save settings');
        }
    }
}

function genStartCommand(settings) {
    var command = 'start(';
    for (var i in settings) {
        for (var g in settings[i]) {
            var id = i + '_' + g;
            var setting = settings[i][g];
            if (typeof setting.default === 'boolean') {
                command += $('#setting_value_' + id).is(':checked') + ', ';
            } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                command += '"' + setting.default + '", ';
            } else if (typeof setting.default === 'number') {
                command += $('#setting_value_' + id).val() + ', ';
            } else if (typeof setting.default === 'string') {
                command += '"' + $('#setting_value_' + id).val() + '", ';
            }
        }
    }

    // This is so we send the locale to the start function
    var lang = localStorage.getItem('tsumtsumlanguage');
    if (lang === 'zh-TW') {
        command += 'true);';
        log('啟動命令: ' + command);
    } else {
        command += 'false);';
        log('Start command: ' + command);
    }
    return command;
}

/**
 * @returns {string}
 */
function getTitle(setting) {
    if (localStorage && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
        return setting.title_zh_TW;
    }
    return setting.title;
}

function appendTitle(jSetting, title) {
    jSetting.append('<div class="col-xs-6">' + title + '</div>');
}

function appendCol(jSetting, jContent) {
    var jDiv = $('<div class="pull-right"></div>');
    var jCol = $('<div class="col-xs-6"></div>');
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

function getSwitchButton(id, checked) {
    var jLabel = $('<label class="switch pull-right"></label>');
    var jInput = $('<input id="setting_value_' + id + '" class="setting_input_value" type="checkbox" ' + (checked ? 'checked' : '') + '/>');
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
            var id = i + '_' + g;
            var setting = settings[i][g];
            var title = getTitle(setting);
            var jGroupItem = $('<div id="setting_' + id + '" class="list-group-item"></div>');
            var jSetting = $('<div class="row"></div>');
            if (typeof setting.default === 'boolean') {
                appendTitle(jSetting, title);
                appendCol(jSetting, getSwitchButton(id, setting.default));
            } else if (typeof setting.default === 'string' && setting.dropdown !== undefined) {
                var jDiv = $('<div class="dropdown"></div>');
                var jDropdownBtn = $('<button id="setting_value_' + id + '" class="dropbtn"></button>');
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
                var step = setting.step;
                var max = setting.max;
                var min = setting.min;
                var jBtns = [];
                var jInput = $('<input id="setting_value_' + id + '" class="setting_input_value" type="number" value="' + setting.default + '" readonly/>');
                var jBtnP = $('<button id="setting_value_p_' + id + '" class="btn btn-danger">+' + step + '</button>');
                var jBtnM = $('<button id="setting_value_m_' + id + '" class="btn btn-danger">-' + step + '</button>');
                jBtnP.on('click', (function (jInput, min, max, step) {
                    return function () {
                        var newValue = (+jInput.val()) + step;
                        if (newValue <= max) {
                            jInput.val(newValue);
                        }
                        saveSettings(settings);
                    }
                })(jInput, min, max, step));
                jBtnM.on('click', (function (jInput, min, max, step) {
                    return function () {
                        var newValue = (+jInput.val()) - step;
                        if (newValue >= min) {
                            jInput.val(newValue);
                        }
                        saveSettings(settings);
                    }
                })(jInput, min, max, step));
                jBtns.push(jInput);
                jBtns.push(jBtnP);
                jBtns.push(jBtnM);
                jInput.on('change', function () {
                    saveSettings(settings);
                });
                appendTitle(jSetting, title);
                appendCol(jSetting, jBtns);
            } else if (typeof setting.default === 'string') {
                var jInput = $('<input id="setting_value_' + id + '" class="setting_input_value" type="text" value="' + setting.default + '"/>');
                jInput.on('change', function () {
                    saveSettings(settings);
                });
                appendTitle(jSetting, title);
                appendCol(jSetting, jInput);
            } else if (setting.buttons !== undefined) {
                var jBtns = [];
                for (var j in setting.buttons) {
                    var jBtn = $('<button id="setting_value_b_' + id + '" onclick=' + setting.buttons[j].onclick + '>' + setting.buttons[j].title + '</button>').addClass('btn btn-plus');
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
        var startCommand = genStartCommand(settings);
        JavaScriptInterface.runScript(startCommand);
    } else if (eventType === 'OnPauseClick') {
        JavaScriptInterface.runScript('stop();');
    } else if (eventType === 'OnSettingClick') {
        // refreshRecord();
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
    JavaScriptInterface.runScript('console.log(\'' + params + '\')');
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

function exportHTML() {
    if (localStorage !== undefined && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
        $('#exportRecordLegacy').text('輸出中');
    } else {
        $('#exportRecordLegacy').text('Exporting');
    }
    var html = $('#record').html();
    html = html.replace(/\n/g, '');
    var script = 'writeFile(getStoragePath() + "/tsum_record/' + getRecordFilename() + '", \'<body>' + html + '</body>\');';
    JavaScriptInterface.runScriptCallback(script, 'exportSuccess');
}

function exportSuccess() {
    if (localStorage !== undefined && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
        $('#exportRecordLegacy').text('輸出 HTML(舊版)');
    } else {
        $('#exportRecordLegacy').text('Export HTML(Legacy)');
    }
}

// render settings page
$(function () {
    $('#version').html('Tsum Tsum v' + VERSION);

    loadSettings(settings);
    genSettings($('#settings'), settings);

    $('#updateRecordASC').on('click', function () {
        ASC = true;
        refreshRecord();
    });
    $('#updateRecordDESC').on('click', function () {
        ASC = false;
        refreshRecord();
    });
    $('#goToTop').on('click', function () {
        window.scrollTo(0, 0);
    });
    $('#goToBottom').on('click', function () {
        window.scrollTo(0, document.body.scrollHeight);
    });
    var protect = true;
    $('#resetRecord').on('click', function () {
        if (protect) {
            protect = false;
            if (localStorage !== undefined && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
                $('#resetRecord').text('確定要清除紀錄嗎？');
            } else {
                $('#resetRecord').text('Are you sure?');
            }
        } else {
            protect = true;
            if (localStorage !== undefined && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
                $('#resetRecord').text('清除紀錄');
            } else {
                $('#resetRecord').text('Reset Record');
            }
            JavaScriptInterface.runScript('execute("rm -r " + getStoragePath() + "/tsum_record");');
            $('#record').html('');
        }
    });
    $('#exportRecordLegacy').on('click', function () {
        exportHTML();
    });
    $('#exportRecordExcel').on('click', function () {
        $("#genTableResult").html("Please wait...");
        JavaScriptInterface.runScriptCallback('genRecordTable();', 'genRecordTable');
    });

    if (localStorage !== undefined && localStorage.getItem('tsumtsumlanguage') === 'zh-TW') {
        $('#senders').text('誰送你心');
        $('#updateRecordASC').text('更新(遞增)');
        $('#updateRecordDESC').text('更新(遞減)');
        $('#resetRecord').text('清除紀錄');
        $('#goToTop').text('回頁面頂端');
        $('#goToBottom').text('回頁面底端');
        $('#exportInfo').text('輸出 HTML(舊版) 請先點選更新後等待圖片的讀取，完成後再點選輸出 HTML(舊版)');
        $('#exportRecordLegacy').text('輸出 HTML(舊版)');
        $('#exportRecordExcel').text('輸出 HTML(Excel)');
    } else {
        $('#senders').text('List of Heart Counts');
        $('#updateRecordASC').text('Update(ASC)');
        $('#updateRecordDESC').text('Update(DESC)');
        $('#resetRecord').text('Reset Record');
        $('#goToTop').text('Go to Top');
        $('#goToBottom').text('Go to Bottom');
        $('#exportInfo').text('Legacy exporting has to click Update and wait for loading all images first before click Export HTML(Legacy)');
        $('#exportRecordLegacy').text('Export HTML(Legacy)');
        $('#exportRecordExcel').text('Export HTML(Excel)');
    }
})($);
