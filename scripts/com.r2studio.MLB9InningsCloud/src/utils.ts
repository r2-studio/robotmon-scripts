import { Utils } from 'rerouter';

export function executeCommands(...commands: string[]): string[] {
  const results: string[] = [];
  for (const command of commands) {
    const res = execute(command);
    if (endsWith(res, 'exit status 1')) {
      console.log(`[Error]: ${command} :\n ${res}\n`);
    } else {
      console.log(`[Ok]: ${command} :\n ${res}\n`);
    }
    results.push(res);
  }
  return results;
}

export function endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function isSameColor(image: Image, xyrgb: XYRGB, thres: number = 0.8): boolean {
  const rgb = getImageColor(image, xyrgb.x, xyrgb.y);
  const score = Utils.identityColor(rgb, xyrgb);
  return score > thres;
}
