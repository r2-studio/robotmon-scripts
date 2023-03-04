import { moveTo, tapDown, tapUp } from 'framework-v1';
import { Test } from './src/test'

function start() {
  const arg: string = '123';
  const test = new Test();
  test.testStart(arg);
  try {
    test.throwError();
  } catch (e) {
    console.log((e as Error).stack)
  }
  tapDown(0, 0, 100);
  moveTo(20, 20, 100);
  tapUp(30, 30, 100);
}
start();