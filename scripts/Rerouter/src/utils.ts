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
  public static identityColor(e1: RGB, e2: RGB) {
    const mean = (e1.r + e2.r) / 2;
    const r = e1.r - e2.r;
    const g = e1.g - e2.g;
    const b = e1.b - e2.b;
    return 1 - Math.sqrt((((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)) / 768;
  }

  public static formatXYRGB(xyrgb: XYRGB): string {
    const keys: (keyof XYRGB)[] = Object.keys(xyrgb) as (keyof XYRGB)[];
    const formatObj: { [k: string]: string } = {};
    for (const k of keys) {
      let str = `${xyrgb[k]}`;
      while (str.length < 3) {
        str = ' ' + str;
      }
      formatObj[k] = str;
    }
    const { x, y, r, g, b } = formatObj;
    return `{ x: ${x}, y: ${y}, r: ${r}, g: ${g}, b: ${b} }`;
  }

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
    execute(`ANDROID_DATA=/data monkey --pct-syskeys 0 -p ${packageName} -c android.intent.category.LAUNCHER 1`);
    execute(
      'ANDROID_BOOTLOGO=1 ' +
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
        `monkey --pct-syskeys 0 -p ${packageName} -c android.intent.category.LAUNCHER 1`
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
    let result = execute('dumpsys window windows').split('mCurrentFocus');
    if (result.length < 2) {
      return ['', ''];
    }
    result = result[1].split(' ');
    if (result.length < 3) {
      return ['', ''];
    }
    result[2] = result[2].replace('}', '');
    result = result[2].split('/');

    let packageName = '';
    let activityName = '';

    if (result.length == 1) {
      packageName = result[0].trim();
    } else if (result.length > 1) {
      packageName = result[0].trim();
      activityName = result[1].trim();
    }
    return [packageName, activityName];
  }

  public static isAppOnTop(packageName: string): boolean {
    const topInfo = execute('dumpsys activity activities | grep mResumedActivity');
    return topInfo.indexOf(packageName) !== -1;
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

  public static waitForAction(action: () => boolean, timeout: number, matchTimes: number = 1, interval = 600): boolean {
    const now = Date.now();
    let matchs = 0;
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
  }
}
