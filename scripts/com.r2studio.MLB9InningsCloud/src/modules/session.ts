import { default as MD5 } from 'md5';
import { executeCommands } from '../utils';
import { rerouter } from './rerouter';
import { config } from './config';
import * as CONSTANTS from '../constants';

// app origin info
const appSessionRoot = `data/data/${CONSTANTS.packageName}`;
const appRecordRoot = `/sdcard/Android/data/${CONSTANTS.packageName}/files`;

// cache info
const licenseFilePath: string = '/sdcard/Robotmon/license.txt';
const scriptCacheRoot = '/sdcard/Robotmon/loginCache';
const androidIdFilePath = `${scriptCacheRoot}/android_id.txt`;
const gameRecordCacheRoot = `${scriptCacheRoot}/gameRecord`;

// cloud info
const endpoint = 's3.robotmon.app:9000';
const bucket = 'mlb-record';

export function initSession() {
  let { licenseId } = config;
  licenseId = licenseId || '';
  const lastLicenseId = readFile(licenseFilePath) || '';
  writeFile(licenseFilePath, licenseId);
  console.log(`lastLicenseId: ${lastLicenseId}, currentLicenseId: ${licenseId}`);

  // lastLicenseId === '' means already logout
  if (lastLicenseId !== '' && licenseId !== lastLicenseId) {
    logOut();
    sleep(3000);
  }

  const hasCloudSession = fetchSession();
  if (hasCloudSession) {
    logIn();
    sleep(3000);
  }

  // restart app
  let isInApp = rerouter.checkInApp();
  while (!isInApp) {
    rerouter.startApp();
    sleep(3000);
    isInApp = rerouter.checkInApp();
  }
  sleep(3000);
}

export function endSession() {
  let { licenseId } = config;
  licenseId = licenseId || '';
  if (licenseId) {
    logOut();
    sleep(3000);
    console.log('==== stop script: has licenseId; close app and clear session');
  } else {
    console.log('==== stop script: no licenseId; not to close app for let new user login');
  }
}

export function uploadSession() {
  let { xrobotmonS3Key, xrobotmonS3Token, licenseId } = config;
  licenseId = licenseId || '';

  if (!(xrobotmonS3Key && xrobotmonS3Token && licenseId)) {
    console.log('failed upload; required key is empty');
    return false;
  }

  console.log(`upload session ${licenseId} start`);
  executeCommands(
    // remove tmp file root
    `rm -rf ${scriptCacheRoot}`,
    `rm -f ${scriptCacheRoot}.gz`,

    // copy local session to tmp file root
    `mkdir -p ${scriptCacheRoot}/`,
    `cp -r ${appSessionRoot}/files ${scriptCacheRoot}/`,
    `cp -r ${appSessionRoot}/shared_prefs ${scriptCacheRoot}/`
  );
  copyGameRecordToCache();

  // copy current android id to tmp file root
  const androidId = execute('ANDROID_DATA=/data settings get secure android_id');
  console.log(`upload androidId: ${androidId}`);
  writeFile(androidIdFilePath, androidId);

  targz(`${scriptCacheRoot}.gz`, `${scriptCacheRoot}`);

  // upload session
  const now = Date.now();
  const sessionFileName = `loginCache/${licenseId}.gz`;
  const sizeOrError = s3UploadFile(
    `${scriptCacheRoot}.gz`,
    sessionFileName,
    'application/octet-stream',
    endpoint,
    bucket,
    xrobotmonS3Key,
    xrobotmonS3Token,
    '',
    false
  );
  console.log(`upload session to ${endpoint} finish. sizeOrError ${sizeOrError}; usedTime ${Date.now() - now}`);

  // remove tmp file root
  executeCommands(`rm -rf ${scriptCacheRoot}`, `rm -f ${scriptCacheRoot}.gz`);
}

function logOut() {
  console.log(`do logout`);
  let isInApp = rerouter.checkInApp();
  while (isInApp) {
    rerouter.stopApp();
    sleep(3000);
    isInApp = rerouter.checkInApp();
  }
  console.log('app is stopped, clear session start');
  clearSession();
  writeFile(licenseFilePath, '');
}
function logIn() {
  let { licenseId } = config;
  licenseId = licenseId || '';
  console.log(`do login`);
  let isInApp = rerouter.checkInApp();
  while (isInApp) {
    rerouter.stopApp();
    sleep(3000);
    isInApp = rerouter.checkInApp();
  }
  console.log('app is stopped, set session start');
  setSession();
  writeFile(licenseFilePath, licenseId);
}

function fetchSession(): boolean {
  let { xrobotmonS3Key, xrobotmonS3Token, licenseId } = config;
  licenseId = licenseId || '';
  if (!(xrobotmonS3Key && xrobotmonS3Token && licenseId)) {
    console.log('fetch failed: required key is empty');
    return false;
  }

  console.log(`fetchSession start ${licenseId}`);
  const now = Date.now();

  executeCommands(
    // remove old files
    `rm -rf ${scriptCacheRoot}`,
    `rm -f ${scriptCacheRoot}.gz`,

    // create tmp file root
    `mkdir -p ${scriptCacheRoot}`
  );

  const sessionFileName = `loginCache/${licenseId}.gz`;
  const resultOrError = s3DownloadFile(`${scriptCacheRoot}.gz`, sessionFileName, endpoint, bucket, xrobotmonS3Key, xrobotmonS3Token, '', false);
  if (resultOrError !== true) {
    console.log(`fetchSession failed ${resultOrError}`);
    return false;
  }
  console.log(`Download session from ${endpoint} finish. usedTime`, Date.now() - now, licenseId, resultOrError);
  return true;
}

function setSession() {
  // clear app session to avoid cannot overwrite
  const gameRecordFileName = getGameRecordFileName() || 'NOT_EXIST_RECORD';
  executeCommands(`rm -rf ${appSessionRoot}/files`, `rm -rf ${appSessionRoot}/shared_prefs`, `rm -rf ${appRecordRoot}/${gameRecordFileName}`);

  // untargz cloud session and overwrite app session
  console.log(`set session start`);
  untargz(`${scriptCacheRoot}.gz`);
  executeCommands(
    `cp -r ${scriptCacheRoot}/files ${appSessionRoot}/`,
    `cp -r ${scriptCacheRoot}/shared_prefs ${appSessionRoot}/`,
    `cp -r ${scriptCacheRoot}/gameRecord/* ${appRecordRoot}/`,

    `chmod -R 777 ${appSessionRoot}/files`,
    `chmod -R 777 ${appSessionRoot}/shared_prefs`,
    `chmod -R 777 ${appRecordRoot}`
  );
  setAndroidId('cloud');
  console.log('set session done');
  sleep(2000);
}

function clearSession() {
  setAndroidId('random');
  const gameRecordFileName = getGameRecordFileName() || 'NOT_EXIST_RECORD';
  executeCommands(
    `rm -rf ${scriptCacheRoot}.gz`,
    `rm -rf ${scriptCacheRoot}`,

    `rm -rf ${appSessionRoot}/files`,
    `rm -rf ${appSessionRoot}/shared_prefs`,
    `rm -rf ${appRecordRoot}/${gameRecordFileName}`
  );
  console.log('clear session done');
  sleep(2000);
}

function setAndroidId(source: 'random' | 'cloud') {
  let [oriAndroidId] = executeCommands('ANDROID_DATA=/data settings get secure android_id');
  let androidId = MD5(`${Date.now()}${oriAndroidId}`).substring(0, 16);
  if (source === 'cloud') {
    androidId = readFile(androidIdFilePath) || androidId;
  }
  executeCommands('ANDROID_DATA=/data settings put secure android_id ' + androidId);
  console.log('oriAndroidId', oriAndroidId);
  console.log('setAndroidId', androidId);
}

function copyGameRecordToCache() {
  const fileName = getGameRecordFileName();
  if (!fileName) {
    return;
  }
  executeCommands(`mkdir -p ${gameRecordCacheRoot}`, `cp -r ${appRecordRoot}/${fileName} ${gameRecordCacheRoot}/${fileName}/`);
}

function getGameRecordFileName() {
  const files = executeCommands(`ls ${appRecordRoot}`)[0].split('\n');
  for (let fileName of files) {
    if (fileName.length === 32) {
      fileName = fileName.trim();
      console.log(`game record ${fileName}`);
      return fileName;
    }
  }
  return '';
}
