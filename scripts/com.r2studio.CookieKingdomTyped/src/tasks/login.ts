import { GroupPage, Page, Utils, rerouter } from 'Rerouter';
import { logs } from '../utils';
import { config } from '../scriptConfig';
import * as CONSTANTS from '../constants';
import { TASKS } from '../tasks';
import { checkScreenMessage, passiveAddRoute } from '../helper';
import { cookieKingdom } from '../..';

const rfpageAnnouncement = new Page(
  'rfpageAnnouncement',
  [
    { x: 610, y: 19, r: 56, g: 167, b: 231 },
    { x: 619, y: 19, r: 255, g: 255, b: 255 },
    { x: 628, y: 18, r: 56, g: 167, b: 231 },
    { x: 59, y: 219, r: 54, g: 64, b: 87 },
    { x: 71, y: 317, r: 54, g: 64, b: 87 },
    { x: 19, y: 114, r: 63, g: 0, b: 9 },
    { x: 25, y: 321, r: 75, g: 75, b: 75 },
  ],
  { x: 610, y: 19 }
);

// Check for gears in login page via pixel matching
const rfpageInLoginPageWithGearAndVideo = new Page('rfpageInLoginPageWithGearAndVideo', [
  { x: 621, y: 13, r: 233, g: 233, b: 235 },
  { x: 622, y: 16, r: 3, g: 4, b: 9 },
  { x: 597, y: 16, r: 233, g: 235, b: 239 },
  { x: 593, y: 16, r: 4, g: 6, b: 11 },
  { x: 590, y: 17, r: 233, g: 235, b: 239 },
  { x: 594, y: 23, r: 14, g: 14, b: 25 },
]);

const rfpageInputAge = new Page(
  'rfpageInputAge',
  [
    { x: 366, y: 278, r: 254, g: 94, b: 0 },
    { x: 320, y: 154, r: 50, g: 50, b: 50 },
    { x: 319, y: 161, r: 255, g: 255, b: 255 },
    { x: 287, y: 69, r: 60, g: 60, b: 60 },
    { x: 335, y: 66, r: 99, g: 99, b: 99 },
    { x: 253, y: 213, r: 254, g: 94, b: 0 },
    { x: 252, y: 231, r: 255, g: 255, b: 255 },
  ],
  { x: 366, y: 278 }
);
const rfpageChooseLoginMethod = new Page(
  'rfpageChooseLoginMethod',
  [
    { x: 139, y: 233, r: 255, g: 95, b: 0 },
    { x: 165, y: 197, r: 0, g: 0, b: 0 },
    { x: 148, y: 153, r: 244, g: 154, b: 25 },
    { x: 347, y: 166, r: 177, g: 204, b: 58 },
    { x: 356, y: 196, r: 59, g: 89, b: 152 },
    { x: 126, y: 234, r: 255, g: 255, b: 255 },
  ],
  { x: 139, y: 233 }
);
// Smaller icons (Android 7), not updated for 5 options
export const rfpageChooseLoginMethod2 = new Page(
  'rfpageChooseLoginMethod2',
  [
    { x: 138, y: 229, r: 255, g: 95, b: 0 },
    { x: 138, y: 198, r: 0, g: 0, b: 0 },
    { x: 138, y: 155, r: 234, g: 89, b: 77 },
    { x: 347, y: 162, r: 177, g: 204, b: 58 },
    { x: 342, y: 195, r: 59, g: 89, b: 152 },
  ],
  { x: 138, y: 229 }
);
const rfpageEnterEmail = new Page(
  'rfpageEnterEmail',
  [
    { x: 298, y: 53, r: 60, g: 60, b: 60 },
    { x: 320, y: 53, r: 223, g: 223, b: 223 },
    { x: 322, y: 99, r: 245, g: 245, b: 245 },
    { x: 357, y: 97, r: 70, g: 70, b: 70 },
    { x: 362, y: 98, r: 255, g: 255, b: 255 },
    { x: 368, y: 98, r: 255, g: 255, b: 255 },
    { x: 391, y: 124, r: 255, g: 255, b: 255 },
  ],
  { x: 298, y: 53 }
);
const rfpageTermsOfServices2 = new Page(
  'rfpageTermsOfServices2',
  [
    { x: 447, y: 230, r: 255, g: 255, b: 255 },
    { x: 43, y: 257, r: 96, g: 24, b: 22 },
    { x: 181, y: 257, r: 95, g: 24, b: 22 },
    { x: 31, y: 289, r: 92, g: 67, b: 18 },
    { x: 203, y: 285, r: 90, g: 65, b: 16 },
    { x: 161, y: 329, r: 37, g: 8, b: 13 },
    { x: 246, y: 230, r: 255, g: 255, b: 255 },
    { x: 179, y: 132, r: 255, g: 255, b: 255 },
  ],
  { x: 447, y: 230 }
);
// TOS page will change when login page change
// Nox: cookie v1.15
export const rfpageTermsOfServiceWindow = new Page(
  'rfpageTermsOfServiceWindow',
  [
    { x: 448, y: 230, r: 171, g: 220, b: 216 },
    { x: 469, y: 240, r: 255, g: 255, b: 255 },
    { x: 159, y: 116, r: 255, g: 255, b: 255 },
    { x: 471, y: 116, r: 255, g: 255, b: 255 },
    { x: 158, y: 243, r: 255, g: 255, b: 255 },
  ],
  { x: 448, y: 230 }
);
// Memu: cookie v1.16
const rfpageTermsOfServicesMemu = new Page(
  'rfpageTermsOfServicesMemu',
  [
    { x: 479, y: 238, r: 66, g: 66, b: 66 },
    { x: 482, y: 238, r: 107, g: 158, b: 153 },
    { x: 484, y: 222, r: 66, g: 66, b: 66 },
    { x: 486, y: 110, r: 66, g: 66, b: 66 },
    { x: 148, y: 123, r: 66, g: 66, b: 66 },
    { x: 171, y: 117, r: 255, g: 255, b: 255 },
    { x: 172, y: 205, r: 66, g: 66, b: 66 },
    { x: 229, y: 206, r: 254, g: 254, b: 254 },
  ],
  { x: 479, y: 238 }
);
const rfpageTermsOfServicesHitBack = new Page(
  'rfpageTermsOfServicesHitBack',
  [
    { x: 305, y: 218, r: 255, g: 255, b: 255 },
    { x: 320, y: 218, r: 255, g: 255, b: 255 },
    { x: 334, y: 217, r: 254, g: 94, b: 0 },
    { x: 350, y: 163, r: 255, g: 255, b: 255 },
    { x: 356, y: 163, r: 255, g: 255, b: 255 },
    { x: 148, y: 123, r: 26, g: 26, b: 26 },
  ],
  { x: 305, y: 218 }
);
const rfpageCannotFindLoginInfo = new Page(
  'rfpageCannotFindLoginInfo',
  [
    { x: 316, y: 243, r: 82, g: 136, b: 5 },
    { x: 323, y: 242, r: 254, g: 254, b: 254 },
    { x: 332, y: 243, r: 123, g: 207, b: 8 },
    { x: 305, y: 242, r: 123, g: 207, b: 8 },
    { x: 300, y: 242, r: 123, g: 207, b: 8 },
    { x: 343, y: 243, r: 123, g: 207, b: 8 },
    { x: 201, y: 106, r: 57, g: 69, b: 107 },
    { x: 422, y: 95, r: 57, g: 69, b: 107 },
    { x: 438, y: 106, r: 57, g: 69, b: 107 },
    { x: 383, y: 177, r: 215, g: 205, b: 195 },
    { x: 377, y: 178, r: 231, g: 220, b: 209 },
    { x: 371, y: 178, r: 231, g: 220, b: 209 },
    { x: 243, y: 180, r: 80, g: 80, b: 80 },
  ],
  { x: 316, y: 243 }
);
// v1.15
const rfpageCanDownloadResources = new Page(
  'rfpageCanDownloadResources',
  [
    { x: 346, y: 240, r: 121, g: 207, b: 12 },
    { x: 420, y: 237, r: 219, g: 207, b: 199 },
    { x: 418, y: 172, r: 243, g: 233, b: 223 },
    { x: 412, y: 103, r: 60, g: 70, b: 105 },
    { x: 219, y: 98, r: 60, g: 70, b: 105 },
    { x: 221, y: 250, r: 219, g: 207, b: 199 },
    { x: 380, y: 100, r: 57, g: 69, b: 107 },
    { x: 319, y: 102, r: 57, g: 69, b: 107 },
    { x: 292, y: 108, r: 57, g: 69, b: 107 },
  ],
  { x: 346, y: 240 }
);
// v2.0.1
const rfpageDownloadDataAndVoiceOver = new Page(
  'rfpageDownloadDataAndVoiceOver',
  [
    { x: 207, y: 192, r: 39, g: 204, b: 0 },
    { x: 372, y: 216, r: 12, g: 167, b: 223 },
    { x: 445, y: 218, r: 12, g: 167, b: 223 },
    { x: 430, y: 81, r: 60, g: 70, b: 105 },
    { x: 214, y: 195, r: 255, g: 255, b: 255 },
  ],
  { x: 207, y: 192 }
);
const rfpageDownloadDataAndVoiceOverUnchecked = new Page(
  'rfpageDownloadDataAndVoiceOverUnchecked',
  [
    { x: 207, y: 192, r: 255, g: 255, b: 255 },
    { x: 372, y: 216, r: 12, g: 167, b: 223 },
    { x: 445, y: 218, r: 12, g: 167, b: 223 },
    { x: 430, y: 81, r: 60, g: 70, b: 105 },
    { x: 214, y: 195, r: 255, g: 255, b: 255 },
  ],
  { x: 207, y: 192 }
);
// v2.0.1 has 'New data pak is available'
const rfpageDownloadNewDataPakIsAvailable = new Page(
  'rfpageDownloadNewDataPakIsAvailable',
  [
    { x: 368, y: 254, r: 123, g: 207, b: 8 },
    { x: 441, y: 99, r: 57, g: 69, b: 107 },
    { x: 346, y: 251, r: 255, g: 255, b: 255 },
  ],
  { x: 368, y: 254 }
);
const rfpageServerSelection = new Page(
  'rfpageServerSelection',
  [
    { x: 351, y: 260, r: 121, g: 207, b: 12 },
    { x: 428, y: 261, r: 12, g: 167, b: 223 },
    { x: 442, y: 242, r: 60, g: 70, b: 105 },
    { x: 422, y: 234, r: 44, g: 47, b: 62 },
    { x: 324, y: 54, r: 101, g: 137, b: 231 },
    { x: 302, y: 64, r: 117, g: 186, b: 100 },
    { x: 278, y: 81, r: 254, g: 254, b: 254 },
  ],
  { x: 351, y: 260 }
);

const rfpageEnterTwoPasswords = new Page(
  'rfpageEnterTwoPasswords',
  [
    { x: 243, y: 307, r: 255, g: 255, b: 255 },
    { x: 377, y: 229, r: 200, g: 200, b: 200 },
    { x: 367, y: 176, r: 255, g: 255, b: 255 },
    { x: 371, y: 50, r: 60, g: 60, b: 60 },
    { x: 319, y: 53, r: 230, g: 230, b: 230 },
    { x: 236, y: 149, r: 195, g: 195, b: 195 },
    { x: 236, y: 183, r: 194, g: 194, b: 194 },
    { x: 243, y: 303, r: 200, g: 200, b: 200 },
  ],
  { x: 243, y: 307 }
);
const rfpageEnterpassword = new Page(
  'rfpageEnterpassword',
  [
    { x: 370, y: 150, r: 255, g: 255, b: 255 },
    { x: 227, y: 112, r: 125, g: 125, b: 125 },
    { x: 235, y: 112, r: 84, g: 84, b: 84 },
    { x: 239, y: 114, r: 255, g: 255, b: 255 },
    { x: 368, y: 110, r: 84, g: 84, b: 84 },
    { x: 404, y: 188, r: 200, g: 200, b: 200 },
    { x: 227, y: 170, r: 255, g: 255, b: 255 },
  ],
  { x: 370, y: 150 }
);
const rfpageEnterPasswordLongId = new Page(
  'rfpageEnterPasswordLongId',
  [
    { x: 370, y: 161, r: 255, g: 255, b: 255 },
    { x: 227, y: 127, r: 125, g: 125, b: 125 },
    { x: 234, y: 124, r: 207, g: 207, b: 207 },
    { x: 229, y: 110, r: 255, g: 255, b: 255 },
    { x: 230, y: 110, r: 120, g: 120, b: 120 },
    { x: 227, y: 183, r: 255, g: 255, b: 255 },
  ],
  { x: 370, y: 161 }
);
const groupPageEnterPassword = new GroupPage('groupPageEnterPassword', [rfpageEnterpassword, rfpageEnterPasswordLongId], rfpageEnterPasswordLongId.next);

// Check if wrong password set. Any red string in this area means wrong password
const pageEnteredPassword = [
  { x: 370, y: 155, r: 255, g: 255, b: 255 },
  { x: 301, y: 115, r: 255, g: 255, b: 255 },
  { x: 387, y: 53, r: 60, g: 60, b: 60 },
  { x: 298, y: 53, r: 60, g: 60, b: 60 },
  { x: 322, y: 52, r: 60, g: 60, b: 60 },
];

let loginTaskStatus = {
  loginRetryCount: 0,
};

export function addLoginRoutes() {
  rerouter.addRoute({
    path: `/${rfpageInputAge.name}`,
    match: rfpageInputAge,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, 'input rfpageInputAge');

      rerouter.screen.tap({ x: 285 + Math.random() * 35, y: 213 });
      Utils.sleep(config.sleep);
      rerouter.goNext(rfpageInputAge);
      Utils.sleep(config.sleep);

      rerouter.screen.tap({ x: 370, y: 150 });
      Utils.sleep(CONSTANTS.sleepAnimate);
    },
  });
  rerouter.addRoute({
    path: `/${rfpageChooseLoginMethod.name}`,
    match: rfpageChooseLoginMethod,
    action: (context, image, matched, finishRound) => {
      if (context.task.name === TASKS.maintainanceMode) {
        logs(context.task.name, 'maintainanceMode, do nothing and sleep 60s');
        Utils.sleep(60000);
        return;
      }

      logs(context.task.name, 'input rfpageChooseLoginMethod');
      rerouter.goNext(rfpageChooseLoginMethod);
      Utils.sleep(CONSTANTS.sleepAnimate);
    },
  });
  rerouter.addRoute({
    path: `/${rfpageEnterEmail.name}`,
    match: rfpageEnterEmail,
    action: (context, image, matched, finishRound) => {
      if (context.task.name === TASKS.maintainanceMode) {
        logs(context.task.name, 'maintainanceMode, do nothing and sleep 60s');
        Utils.sleep(60000);
        return;
      }

      logs(context.task.name, 'input email');

      rerouter.screen.tap({ x: 370, y: 150 });
      Utils.sleep(CONSTANTS.sleepAnimate);
      logs(context.task.name, `typing email ${config.account}`);

      typing(config.account, 1000);
      Utils.sleep(4000); // sleep must equal to typing
      typing('\n', 500);
      Utils.sleep(1000);

      const incorrectEmailFormat = {
        name: 'incorrectEmailFormat',
        x: 222,
        y: 166,
        width: 172,
        height: 12,
        targetY: 6,
        lookingForColor: { r: 226, g: 86, b: 86 },
        targetColorCount: 44,
        targetColorThreashold: 3,
      };
      const needRegisterDevPlayAccount = {
        name: 'needRegisterDevPlayAccount',
        x: 222,
        y: 166,
        width: 172,
        height: 12,
        targetY: 6,
        lookingForColor: { r: 226, g: 86, b: 86 },
        targetColorCount: 34,
        targetColorThreashold: 3,
      };
      const registerWithSocialPlatformMessageScreen = {
        name: 'registerWithSocialPlatformMessageScreen',
        x: 225,
        y: 162,
        width: 75,
        height: 13,
        targetY: 8,
        lookingForColor: { r: 244, g: 191, b: 191 },
        targetColorCount: 21,
        targetColorThreashold: 3,
      };
      if (checkScreenMessage(incorrectEmailFormat, rfpageEnterEmail, image)) {
        logs(context.task.name, 'reported incorrectEmailFormat so handle it');
        checkLoginFailedMaxReached();
      } else if (checkScreenMessage(needRegisterDevPlayAccount, rfpageEnterEmail, image)) {
        logs(context.task.name, 'reported needRegisterDevPlayAccount so handle it');
        checkLoginFailedMaxReached();
      } else if (checkScreenMessage(registerWithSocialPlatformMessageScreen, rfpageEnterEmail, image)) {
        logs(context.task.name, 'reported registerWithSocialPlatformMessageScreen so handle it');
        checkLoginFailedMaxReached();
      }
    },
  });
  rerouter.addRoute({
    path: `/${groupPageEnterPassword.name}`,
    match: groupPageEnterPassword,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, 'input password');

      rerouter.goNext(rfpageEnterPasswordLongId);
      Utils.sleep(CONSTANTS.sleepAnimate);
      typing(config.password, 1000);
      Utils.sleep(CONSTANTS.sleepAnimate);
      typing('\n', 500);
      Utils.sleep(CONSTANTS.sleepAnimate);
      rerouter.screen.tap({ x: 370, y: 190 });

      const wrongPasswordMessageScreen = {
        name: 'wrongPasswordMessageScreen',
        x: 225,
        y: 162,
        width: 75,
        height: 13,
        targetY: 6,
        lookingForColor: { r: 230, g: 100, b: 100 },
        targetColorCount: 17,
        targetColorThreashold: 2,
      };
      const wrongPasswordMessageScreenWithLongId = {
        name: 'wrongPasswordMessageScreenWithLongId',
        x: 225,
        y: 175,
        width: 75,
        height: 13,
        targetY: 6,
        lookingForColor: { r: 244, g: 100, b: 100 },
        targetColorCount: 25,
        targetColorThreashold: 2,
      };
      const passwordTooShortMessageScreen = {
        name: 'passwordTooShortMessageScreen',
        x: 225,
        y: 162,
        width: 75,
        height: 13,
        targetY: 4,
        lookingForColor: { r: 244, g: 191, b: 191 },
        targetColorCount: 2,
        targetColorThreashold: 0,
      };
      if (checkScreenMessage(wrongPasswordMessageScreen, rfpageEnterpassword, image)) {
        logs(context.task.name, 'reported wrongPasswordMessageScreen so handle it');
        checkLoginFailedMaxReached();
      }
      if (checkScreenMessage(wrongPasswordMessageScreenWithLongId, rfpageEnterPasswordLongId, image)) {
        logs(context.task.name, 'reported wrongPasswordMessageScreenWithLongId so handle it');
        checkLoginFailedMaxReached();
      }
      if (checkScreenMessage(passwordTooShortMessageScreen, rfpageEnterpassword, image)) {
        logs(context.task.name, 'reported passwordTooShortMessageScreen so handle it');
        checkLoginFailedMaxReached();
      }
    },
  });
  rerouter.addRoute({
    path: `/${rfpageInLoginPageWithGearAndVideo.name}`,
    match: rfpageInLoginPageWithGearAndVideo,
    action: (context, image, matched, finishRound) => {
      logs(context.task.name, 'tapping (575, 22) until the game start every 3 secs');

      rerouter.screen.tap({ x: 575, y: 22 });
      Utils.sleep(3000);
    },
  });
  rerouter.addRoute({
    path: `/${rfpageAnnouncement.name}`,
    match: rfpageAnnouncement,
    action: (context, image, matched, finishRound) => {
      if (config.needToSendLoginSuccess) {
        logs(context.task.name, 'have not send login-success, send it');
        sendEvent('gameStatus', 'login-succeeded');
        config.needToSendLoginSuccess = false;
      }
      if (config.needToSendPlaying) {
        Utils.sleep(3000);
        logs(context.task.name, 'have not send needToSendPlaying, send it');
        sendEvent('gameStatus', 'login-succeeded');
        config.needToSendPlaying = false;
      }

      rerouter.goNext(rfpageAnnouncement);
    },
  });

  passiveAddRoute([
    rfpageTermsOfServices2,
    rfpageTermsOfServiceWindow,
    rfpageTermsOfServicesMemu,
    rfpageTermsOfServicesHitBack,
    rfpageCannotFindLoginInfo,
    rfpageCanDownloadResources,
    rfpageDownloadDataAndVoiceOver,
    rfpageDownloadDataAndVoiceOverUnchecked,
    rfpageDownloadNewDataPakIsAvailable,
    rfpageServerSelection,
  ]);
}

export function checkLoginFailedMaxReached() {
  if (loginTaskStatus.loginRetryCount > config.loginRetryMaxTimes) {
    cookieKingdom!.stop();
    sendEvent('gameStatus', 'login-failed');
    logs('checkLoginFailedMaxReached', `Max retry count reached, login failed`);
    return true;
  } else {
    loginTaskStatus.loginRetryCount++;
    logs('checkLoginFailedMaxReached', `Restart game as not inputing login info correctly: ${loginTaskStatus.loginRetryCount}`);
    var rtn = execute('am force-stop com.devsisters.ck');
    if (rtn == 'signal: aborted') {
      // MEmu
      execute(
        'ANDROID_DATA=/data BOOTCLASSPATH=/system/framework/core-oj.jar:/system/framework/core-libart.jar:/system/framework/conscrypt.jar:/system/framework/okhttp.jar:/system/framework/core-junit.jar:/system/framework/bouncycastle.jar:/system/framework/ext.jar:/system/framework/framework.jar:/system/framework/telephony-common.jar:/system/framework/voip-common.jar:/system/framework/ims-common.jar:/system/framework/mms-common.jar:/system/framework/android.policy.jar:/system/framework/apache-xml.jar:/system/framework/org.apache.http.legacy.boot.jar am force-stop com.devsisters.ck'
      );
    }
    sleep(15000);
    return false;
  }
}
