import { GroupPage, MessageWindow, Page } from 'rerouter';

export const unfinishedBattleMessageScreen: MessageWindow = {
  name: 'unfinishedBattleMessageScreen',
  x: 240,
  y: 160,
  width: 160,
  height: 6,

  targetY: 4,
  lookingForColor: { r: 247, g: 235, b: 222 },
  targetColorCount: 128,
  targetColorThreashold: 5,
};

export const termOfServiceMessage: MessageWindow = {
  name: 'termOfServiceMessage',
  x: 168,
  y: 127,
  width: 140,
  height: 6,

  targetY: 4,
  lookingForColor: { r: 37, g: 37, b: 37 },
  targetColorCount: 32,
  targetColorThreashold: 5,
};

export const facebookRefreshTokenExpiredLogout: MessageWindow = {
  name: 'facebookRefreshTokenExpiredLogout',
  x: 220,
  y: 135,
  width: 196,
  height: 14,

  targetY: 4,
  lookingForColor: { r: 140, g: 135, b: 128 },
  targetColorCount: 16,
  targetColorThreashold: 5,
};

export const anErrorHasOccuredMessageScreen: MessageWindow = {
  name: 'anErrorHasOccuredMessageScreen',
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 83,
  targetColorThreashold: 5,
};

export const theNetworkIsUnstableMessageScreen: MessageWindow = {
  name: 'theNetworkIsUnstableMessageScreen',
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 51,
  targetColorThreashold: 5,
};

export const anUnknownErrorHasOccurMessageScreen: MessageWindow = {
  name: 'anUnknownErrorHasOccurMessageScreen',
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 79,
  targetColorThreashold: 3,
};

export const theReloginIntoAnotherDeviceMessageScreen: MessageWindow = {
  name: 'theReloginIntoAnotherDeviceMessageScreen',
  x: 222,
  y: 160,
  width: 198,
  height: 25,

  targetY: 4,
  lookingForColor: { r: 80, g: 80, b: 80 },
  targetColorCount: 74,
  targetColorThreashold: 1,
};

export const messageNotifyQuit: MessageWindow = {
  name: 'messageNotifyQuit',
  x: 220,
  y: 162,
  width: 196,
  height: 12,

  targetY: 4,
  lookingForColor: { r: 95, g: 95, b: 95 },
  targetColorCount: 42,
  targetColorThreashold: 8,
};

export const messageNotifyQuit2: MessageWindow = {
  name: 'messageNotifyQuit2',
  x: 234,
  y: 184,
  width: 180,
  height: 12,

  targetY: 4,
  lookingForColor: { r: 95, g: 95, b: 95 },
  targetColorCount: 33,
  targetColorThreashold: 10,
};

export const incorrectEmailFormat: MessageWindow = {
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
export const needRegisterDevPlayAccount: MessageWindow = {
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
export const registerWithSocialPlatformMessageScreen: MessageWindow = {
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
export const wrongPasswordMessageScreen: MessageWindow = {
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
export const wrongPasswordMessageScreenWithLongId: MessageWindow = {
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
export const passwordTooShortMessageScreen: MessageWindow = {
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

export const messageTeamDontMatchToSCRow1: MessageWindow = {
  name: 'messageTeamDontMatchToSCRow1',
  x: 234,
  y: 160,
  width: 140,
  height: 12,

  targetY: 6,
  lookingForColor: { r: 95, g: 95, b: 95 },
  targetColorCount: 37,
  targetColorThreashold: 8,
};
export const messageTeamDontMatchToSCRow2: MessageWindow = {
  name: 'messageTeamDontMatchToSCRow2',
  x: 240,
  y: 173,
  width: 160,
  height: 12,

  targetY: 6,
  lookingForColor: { r: 95, g: 95, b: 95 },
  targetColorCount: 38,
  targetColorThreashold: 8,
};

export const unfinishedPVPBattleMessageScreen: MessageWindow = {
  name: 'unfinishedPVPBattleMessageScreen',
  x: 240,
  y: 160,
  width: 160,
  height: 6,

  targetY: 4,
  lookingForColor: { r: 247, g: 235, b: 222 },
  targetColorCount: 128,
  targetColorThreashold: 5,
};
export const unfinishedSuperMayhemBattleMessageScreen = {
  name: 'unfinishedSuperMayhemBattleMessageScreen',
  x: 240,
  y: 166,
  width: 160,
  height: 12,

  targetY: 6,
  lookingForColor: { r: 227, g: 218, b: 209 },
  targetColorCount: 84,
  targetColorThreashold: 5,
};
