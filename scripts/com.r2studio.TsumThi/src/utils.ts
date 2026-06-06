// Utils
function isSameColor(c1: ColorLike, c2: ColorLike, diff?: number): boolean {
  if (diff === undefined) {
    diff = 20;
  }
  return Math.abs(c1.r - c2.r) <= diff
      && Math.abs(c1.g - c2.g) <= diff
      && Math.abs(c1.b - c2.b) <= diff;
}

function absColor(c1: ColorLike, c2: ColorLike): number {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
}

function nowTime(): number {
  const offset = (new Date().getTimezoneOffset()) * 60 * 1000;
  return Date.now() + offset;
}

function debug() {
  if (Config.debugLogs) {
    const argsArray = Array.prototype.slice.call(arguments);
    const newArgs = ['*DEBUG*'].concat(argsArray);
    log.apply(null, newArgs);
  }
}

function log() {
  sleep(10);
  const args = [];
  if (ts !== undefined && ts.showHeartLog && ts.record && ts.record['hearts_count']) {
    let msg = "";
    msg += "R:"+ts.record['hearts_count'].receivedCount+" ";
    msg += "S:"+ts.record['hearts_count'].sentCount;
    if (gTaskController !== undefined && gTaskController.tasks !== undefined) {
      const sendTask = gTaskController.tasks["sendHearts"];
      if (sendTask !== undefined) {
        if (sendTask.lastRunTime === 0) {
          msg += "/0";
        } else {
          const next = (nowTime() - (sendTask.lastRunTime + sendTask.interval)) / 60000;
          msg += "/" + (+next.toFixed(0));
        }
      }
    }
    args.push("["+msg+"]");
  }
  for (let i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      arguments[i] = JSON.stringify(arguments[i], null, 2);
    } else if (typeof arguments[i] == 'function') {
      if (Config.debugLogs)
        arguments[i] = arguments[i]();
      else
        arguments[i] = "";
    }
    args.push(arguments[i]);
  }
  console.log.apply(console, args);
}

