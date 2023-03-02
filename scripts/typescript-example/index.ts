import { Test } from './src/test'

declare const debugLine: () => void;

function start() {
  const arg: string = '123';
  const test = new Test();
  test.testStart(arg);
  debugLine();
  try {
    test.throwError();
  } catch (e) {
    console.log((e as Error).stack)
  }
}
start();