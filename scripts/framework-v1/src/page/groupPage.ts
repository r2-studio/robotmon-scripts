import { Page } from './page';
import { Screen } from '../screen/screen';

export class GroupPage {
  public static debug = false;

  public name: string;
  public pages: Page[];

  public constructor(name: string, pages: Page[]) {
    this.name = name;
    this.pages = pages;
  }

  public isMatchImage(img: Image, thres: number = 0.9): string[] {
    const matchs: string[] = [];
    for (const page of this.pages) {
      if (page.isMatchImage(img, thres)) {
        matchs.push(page.name);
      }
    }
    return matchs;
  }

  public isMatchScreen(screen: Screen, thres: number = 0.9): string[] {
    const img = screen.getCvtDevScreenshot();
    const matchs = this.isMatchImage(img, thres);
    releaseImage(img);
    return matchs;
  }

  public waitScreenForMatchingOne(screen: Screen, timeout: number, matchTimes: number = 1, interval = 600, thres: number = 0.9): string {
    if (GroupPage.debug) {
      console.log(`GroupPage.waitScreenForMatchingOne ${this.name}: ${this.pages.map(p => p.name).join(',')}`);
    }
    const now = Date.now();
    let matchName = '';
    let matchs = 0;
    while (Date.now() - now < timeout) {
      const img = screen.getCvtDevScreenshot();
      for (const page of this.pages) {
        if (page.isMatchImage(img, thres)) {
          if (matchName !== page.name) {
            matchName = page.name;
            matchs = 0;
          }
          matchs++;
          break;
        }
      }
      releaseImage(img);
      if (matchName !== '' && matchs >= matchTimes) {
        break;
      }
      sleep(interval);
    }
    if (GroupPage.debug) {
      console.log(`GroupPage.waitScreenForMatchingOne ${this.name}: matched: ${matchName}, usedTime ${Date.now() - now}`);
    }
    return matchName;
  }
}
