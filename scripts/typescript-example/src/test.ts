export class Test {
  public testStart(v: string) {
    console.log(v);
  }
  public throwError() {
    console.log('throwError');
    throw new Error('testerror');
  }
}