import { Utils } from 'rerouter';

export function executeCommands(...commands: string[]): string[] {
  const results: string[] = [];
  for (const command of commands) {
    const res = execute(command);
    if (endsWith(res, 'exit status 1')) {
      console.log(`[Error]: ${command} :\n ${res}\n`);
    } else {
      // console.log(`[Ok]: ${command} :\n ${res}\n`);
      console.log(`[Ok]: ${command}`);
    }
    results.push(res);
  }
  return results;
}

export function endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function arrayFind<T>(arr: T[], condition: (el: T) => boolean): T | undefined {
  for (const el of arr) {
    if (condition(el)) {
      return el;
    }
  }
  return undefined;
}

export function isSameColor(image: Image | RGB, target: XYRGB | RGB, thres: number = 0.8): boolean {
  let imageRGB: RGB | undefined;
  if ('r' in image) {
    // image is RGB
    imageRGB = image;
  } else if ('x' in target) {
    // image is Image, target is XYRGB
    imageRGB = getImageColor(image, target.x, target.y);
  }

  if (imageRGB === undefined) {
    throw new Error('target is not XYRGB');
  }

  const score = Utils.identityColor(imageRGB, target);
  return score > thres;
}

export function getColorCountInRange(image: Image, leftTop: { x: number; y: number }, rightBottom: { x: number; y: number }): { [color: string]: number } {
  const cnt: { [color: string]: number } = {};
  const { x: x1, y: y1 } = leftTop;
  const { x: x2, y: y2 } = rightBottom;
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      const { r, g, b } = getImageColor(image, x, y);
      const color = `${r}-${g}-${b}`;
      if (cnt[color] === undefined) {
        cnt[color] = 0;
      }
      cnt[color]++;
    }
  }
  return cnt;
}

export function isSameColorCount(cnt1: { [color: string]: number }, cnt2: { [color: string]: number }): boolean {
  const keys1 = Object.keys(cnt1);
  const keys2 = Object.keys(cnt2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (cnt1[key] !== cnt2[key]) {
      return false;
    }
  }
  return true;
}
