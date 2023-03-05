export function log(...msgs: any[]) {
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Taipei',
  });
  let message = `[${date}] `;
  for (const msg of msgs) {
    if (typeof msg === 'object') {
      message += `${JSON.stringify(msg)} `;
    } else {
      message += `${msg} `;
    }
  }

  console.log(message.substr(0, message.length - 1));
}

export class Utils {
  public static sortStringNumberMap(map: { [key: string]: number }): { key: string; count: number }[] {
    const results: { key: string; count: number }[] = [];
    for (const key in map) {
      results.push({ key, count: map[key] });
    }
    results.sort((a, b) => b.count - a.count);
    return results;
  }

  public static sleep(during: number) {
    while (during > 200) {
      during -= 200;
      sleep(200);
    }
    if (during > 0) {
      sleep(during);
    }
  }

  public static getTaiwanTime(): number {
    return Date.now() + 8 * 60 * 60 * 1000;
  }

  public static log(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg === 'object') {
        args[i] = JSON.stringify(arg);
      }
    }
    const date = new Date(Utils.getTaiwanTime());
    const dateString = `[${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    console.log(dateString, ...args);
  }

  public static notifyEvent(event: string, content: string) {
    if (sendEvent != undefined) {
      Utils.log('sendEvent', event, content);
      sendEvent('' + event, '' + content);
    }
  }

  public static startApp(packageName: string) {
    execute(
      `BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am start -n ${packageName}`
    );
    execute(
      `ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am start -n ${packageName}`
    );
  }

  public static stopApp(packageName: string) {
    execute(
      `BOOTCLASSPATH=/system/framework/core.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/framework2.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/services.jar:/system/framework/apache-xml.jar:/system/framework/webviewchromium.jar am force-stop ${packageName}`
    );
    execute(
      `ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop ${packageName}`
    );
  }

  public static getCurrentApp(): [string, string] {
    const result = execute('dumpsys activity top');
    const lines = result.split('\n');
    let app = '';
    let activity = '';
    for (const line of lines) {
      const p = line.indexOf('ACTIVITY');
      if (p !== -1) {
        app = '';
        activity = '';
        let isApp = true;
        for (let i = p + 9; i < line.length; i++) {
          const c = line[i];
          if (c === ' ') {
            break;
          } else if (c === '/') {
            isApp = false;
          } else if (isApp) {
            app += c;
          } else {
            activity += c;
          }
        }
      }
    }
    return [app, activity];
  }

  public static sendSlackMessage(url: string, title: string, message: string) {
    const body = {
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
  }
}
