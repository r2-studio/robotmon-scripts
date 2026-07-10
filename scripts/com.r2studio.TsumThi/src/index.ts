function start(settings) {
  ts = new Tsum(settings['jpVersion'], settings['specialScreenRatio'], settings['langTaiwan'] ? LogsTW : Logs);
  ts.settings = settings
  log(ts.logs.start);
  ts.debug = settings['debugGame'];
  ts.bonus5to4 = !!settings['bonus5to4'];
  if (ts.bonus5to4) {
    ts.tsumCount = 4;
  }
  ts.autoLaunch = settings['autoLaunchApp'];
  ts.scoreItem = settings['bonusScore'];
  ts.coinItem = settings['bonusCoin'];
  ts.expItem = settings['bonusExp'];
  ts.timeItem = settings['bonusTime'];
  ts.bubbleItem = settings['bonusBubble'];
  ts.comboItem = settings['bonusCombo'];
  ts.isPause = settings['pauseWhenCalc'];
  ts.receiveOneItem = settings['receiveHeartsOneByOne'];
  ts.receiveSecondItem = settings['receiveHeartsSkipFirst'] || false;
  ts.recordReceive = settings['recordSender'];
  ts.sentToZero = settings['sendHeartsToZeroScore'];
  ts.receiveCheckLimit = settings['mailOpenMax'];
  ts.clearBubbles = settings['clearBubbles'];
  ts.skillInterval = settings['skillWaitingTime'] * 1000;
  ts.skillLevel = settings['skillLevel'];
  ts.skillType = settings['skillType'];
  ts.skillAutoTap = !!settings['skillAutoTap'];
  ts.unlockLevelHoursWait = settings["unlockLevelHoursWait"];
  ts.sendHearts = settings['sendHeartsAuto'];
  ts.showHeartLog = true;
  ts.keepRuby = settings['receiveHeartsSkipRuby'];
  ts.sendHeartMaxDuring = settings['sendHeartsMaxRuntime'] * 60 * 1000;
  ts.useFan = settings['useFan'];
  if (typeof settings['maxChainsPerScan'] === 'number' && settings['maxChainsPerScan'] >= 1) {
    ts.maxChainsPerScan = settings['maxChainsPerScan'];
  }
  if (settings['recordSenderEnlarge']) {
    ts.resizeRatio = 1;
  }
  const yOffset = ts.receiveSecondItem ? 202 : 0;
  Button.outReceiveOne.y = Button.outReceiveOneBase.y + yOffset;
  Button.outReceiveOneRuby.y = Button.outReceiveOneRubyBase.y + yOffset;
  Button.outReceiveOneAd.y = Button.outReceiveOneAdBase.y + yOffset;
  Button.outReceiveNameFrom.y = Button.outReceiveNameFromBase.y + yOffset;
  Button.outReceiveNameTo.y = Button.outReceiveNameToBase.y + yOffset;

  if (ts.recordReceive) {
    ts.readRecord();
  }
  if (ts.record['hearts_count'] === undefined) {
    ts.record['hearts_count'] = {
      receivedCount: 0,
      sentCount: 0
    };
  }

  Config.debugLogs = settings['debugLogs'];
  ts.autobuyBoxes = settings['autobuyBoxes'];
  ts.noSkillLastFeverSec = settings['noSkillLastFeverSec'];
  ts.claimAllWithoutCoins = settings['claimAllWithoutCoins'];
  ts.tsumMonitorUrl = settings['tsumMonitorUrl'] || "";
  ts.tsumAppRestartFrequency = settings['tsumAppRestartFrequency'];

  if (!checkFunction(TsumTaskController)) {
    console.log("File lose...");
    return;
  }

  gTaskController = new TsumTaskController();
  if (ts.tsumMonitorUrl.length > 0) {
    gTaskController.newTask('requestTsumMonitor', ts.taskRequestTsumMonitor.bind(ts), 30 * 1000, 0);
  }
  gTaskController.newTask('taskAutoBuyBoxes', ts.taskAutoBuyBoxes.bind(ts), 60 * 1000, 0);
  if (settings['receiveHeartsOneByOne']) {
    gTaskController.newTask('receiveOneItem', ts.taskReceiveOneItem.bind(ts), settings['mailMinWait'] * 60 * 1000, 0);
  }
  if (settings['receiveAllHearts']) {
    gTaskController.newTask('receiveItems', ts.taskReceiveAllItems.bind(ts), settings['receiveAllHeartsMinWait'] * 60 * 1000, 0);
  }
  if (settings['sendHeartsAuto']) {
    gTaskController.newTask('sendHearts', ts.taskSendHearts.bind(ts), settings['sendHeartsMinWait'] * 60 * 1000, 0);
  }
  if (settings['autoLaunchApp'] && settings['tsumAppRestartFrequency'] > 0) {
    gTaskController.newTask('taskTsumAppRestart', ts.taskTsumAppRestart.bind(ts), settings['tsumAppRestartFrequency'] * 60 * 60 * 1000, 0, true);
  }
  // Layer 2: stuck watchdog. Restarts the game app if no progress for stuckTimeoutMs.
  // gTaskController.newTask('taskWatchdog', ts.taskWatchdog.bind(ts), 10 * 1000, 0);
  if (checkFunction(outRange)) {
    if (settings['autoPlayGame']) {
      if (settings['unlockLevelHoursWait'] > 0) {
        gTaskController.newTask('autoUnlockLevel', ts.taskAutoUnlockLevel.bind(ts), settings['unlockLevelHoursWait'] * 60 * 60 * 1000, 0);
      }
      gTaskController.newTask('taskPlayGameQuick', ts.taskPlayGameQuick.bind(ts), 3 * 1000, 0);
    }
  }
  sleep(500);
  gTaskController.start();
  log(ts.logs.TaskControllerStop);
}

function stop() {
  if (ts != null) {
    log(ts.logs.stop);
    sleep(500);
    ts.isRunning = false;
    sleep(2000);
    // loop stop here...
    if (ts.recordReceive) {
      ts.releaseRecord();
    }
  }
  if (gTaskController !== undefined) gTaskController.removeAllTasks();
  if (gTaskController !== undefined) gTaskController.stop();
  ts = undefined;
}

function genRecordTable() {
  console.log("Generate Record...");
  const recordFile = getStoragePath() + "/tsum_record/record.txt";
  const txt = readFile(recordFile);
  let record = {};
  if (txt !== undefined && txt !== "") {
    try {
      record = JSON.parse(txt);
    } catch(e) {
      return "Can not parse record.txt " + JSON.stringify(e);
    }
  } else {
    return "Can not read record.txt";
  }

  // enhance records with total and average hearts per filename
  const dayMapCount = {};
  const renderRecords = [];
  // Reused across the sibling loops below (previously function-scoped vars).
  let filename: string, dayTime: string, j: number;
  for (filename in record) {
    (function (filename) {
      if (filename !== "hearts_count") {
        let totalDay = 0;
        let totalCount = 0;
        const recordElement = record[filename];
        for (const dayTime in recordElement.receiveCounts) {
          const dayCount = recordElement.receiveCounts[dayTime];

          if (dayMapCount[+dayTime] === undefined) {
            dayMapCount[+dayTime] = 0;
          }
          dayMapCount[+dayTime] += dayCount;

          totalDay++;
          totalCount += dayCount;
        }
        let avg: string | number = 0;
        if (totalDay !== 0) {
          avg = (totalCount / totalDay).toFixed(1);
        }
        recordElement.all = totalCount;
        recordElement.avg = avg;
        recordElement.filename = filename;
        renderRecords.push(recordElement);
      }
    })(filename);
  }

  // sort records descending by total
  renderRecords.sort(function (a, b) {
    return b.all - a.all;
  });

  // create sorted dayTime array
  const dayTimesSorted = [];
  for (dayTime in dayMapCount) {
    if (dayMapCount.hasOwnProperty(dayTime)) {
      dayTimesSorted.push(dayTime);
    }
  }
  dayTimesSorted.sort(function (a, b) {
    return a - b;
  });

  // render records
  let html = "<html><body><style>table { border-collapse: collapse; } th, td { border: solid 1px black; text-align: right; padding: 4px 10px 4px 10px; } .records td:nth-child(2n+5), .records th:nth-child(2n+5) { background-color: lightgray; } .all { background-color: darkseagreen; } .avg { background-color: lightsteelblue; border-right-width: 5px; }</style>";
  html += "<table class='records'>";
  html += "<tr><th>UserImage</th><th class='all'>All</th><th class='avg'>Avg</th>";
  for (j = 0; j < dayTimesSorted.length ; j++) {
    dayTime = dayTimesSorted[j];
    html += '<th>' + getDayTimeString(new Date(+dayTime * (24 * 60 * 60 * 1000))) + '</th>';
  }
  html += "</tr>";
  for (let i = 0; i < renderRecords.length; i += 1) {
    const renderRecord = renderRecords[i];
    filename = renderRecord.filename;
    html += "<tr>";
    // user image
    const filePath = getStoragePath()+"/tsum_record/" + filename;
    const tmpImg = openImage(filePath);
    let base64;
    try {
      base64 = getBase64FromImage(tmpImg);
    } finally {
      releaseImage(tmpImg);
    }
    html += "<td><img src='data:image/png;base64," + base64 + "' /></td>";

    let totalDay = 0;
    let totalCount = 0;
    let tmpHtml = "";
    for (j = 0; j < dayTimesSorted.length ; j++) {
      dayTime = dayTimesSorted[j];
      const dayCount = parseInt(renderRecord.receiveCounts[dayTime]) || 0;
      tmpHtml += '<td>' + dayCount + '</td>';

      totalDay++;
      totalCount += dayCount;
    }
    let avg: string | number = 0;
    if (totalDay !== 0) {
      avg = (totalCount/totalDay).toFixed(1);
    }
    html += "<td class='all'>" + totalCount + "</td>";
    html += "<td class='avg'>" + avg + "</td>";
    html += tmpHtml;
    html += "</tr>";
  }
  html += "</table>";
  html += "<br /> <br />";
  // day count
  html += "<table>";
  html += "<tr><th>Date</th><th>Hearts</th></tr>";
  for (j = 0; j < dayTimesSorted.length ; j++) {
    dayTime = dayTimesSorted[j];
    const date = new Date(+dayTime * (24 * 60 * 60 * 1000));
    html += "<tr>";
    html += "<td>" + getDayTimeString(date) + "</td>";
    html += "<td>" + dayMapCount[dayTime] + "</td>";
    html += "</tr>";
  }
  html += "</table>";
  html += "</body></html>";
  const recordName = getRecordFilename();
  const oPath = getStoragePath() + "/tsum_record/" + recordName;
  writeFile(oPath, html);
  return "Download: " + getStoragePath()+"/tsum_record to PC" + "<br />Open: " + recordName;
}

function getDayTimeString(d) {
  return (d.getMonth()+1) + '/' + d.getDate();
}

function getRecordFilename() {
  const d = new Date();
  return 'recordTable_' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '.html';
}

// input: rgb in [0,255], out: h in [0,360) and s,v in [0,100]
function rgb2hsv(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return {h: 60 * (h < 0 ? h + 6 : h), s: Math.round(v && c / v * 100), v: Math.round(v * 100)};
}
