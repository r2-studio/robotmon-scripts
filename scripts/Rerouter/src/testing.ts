import fs from 'fs';
import cv from '@techstark/opencv-js';
import Jimp from 'jimp';
import { GroupPage, Page, RouteConfig, XYRGB, DefaultConfigValue } from './struct';
import { Utils } from './utils';

const waitForOpencvPromise = new Promise<void>(resolve => {
  cv.onRuntimeInitialized = resolve;
});

export class Testing {
  private screenshotPath: string;

  public constructor(screenshotPath: string) {
    this.screenshotPath = screenshotPath;
  }

  public async init() {
    await waitForOpencvPromise;
  }

  private async loadImage(path: string): Promise<cv.Mat> {
    const jimpSrc = await Jimp.read(path);
    const src = cv.matFromImageData(jimpSrc.bitmap);
    return src;
  }

  public async checkImageMatchDuplicatePages(routes: RouteConfig[]) {
    console.log(`=====> Rerouter Testing: checkImageMatchDuplicatePages Starting`);
    const pages: { [pageName: string]: Page } = {};
    for (const route of routes) {
      if (route.match instanceof Page) {
        if (pages[route.match.name] !== undefined) {
          console.log(`[Warning][DuplicatePage] ${route.path}/${route.match.name}`);
        }
        pages[route.match.name] = route.match;
      } else if (route.match instanceof GroupPage) {
        for (const page of route.match.pages) {
          if (pages[page.name] !== undefined) {
            console.log(`[Warning][DuplicatePage] ${route.path}/${route.match.name}/${page.name}`);
          }
          pages[page.name] = page;
        }
      }
    }

    const files = fs.readdirSync(this.screenshotPath);
    for (const file of files) {
      if (file === '.' || file === '..') {
        continue;
      }
      if (!file.includes('.png') && !file.includes('.jpg')) {
        continue;
      }

      const imagePath = `${this.screenshotPath}/${file}`;
      try {
        const mat = await this.loadImage(imagePath);
        const matches: Page[] = [];
        for (const pageName in pages) {
          const page = pages[pageName];
          const match = this.isImageMatchPage(mat, page, DefaultConfigValue.GroupPageThres);
          if (match) {
            matches.push(page);
          }
        }
        mat.delete();

        if (matches.length > 1) {
          for (let i = 0; i < matches.length; i++) {
            const page = matches[i];
            console.log(`[Warning][DuplicatePageMatched] Filename ${file} matched ${i + 1}: ${page.name}`);
          }
        }
      } catch (e) {
        console.log(`[Error][checkImageMatchMultiplePages] ${(e as Error).message}`);
      }
    }

    console.log(`=====> Rerouter Testing: checkImageMatchDuplicatePages Finished`);
  }

  private isImageMatchPage(mat: cv.Mat, page: Page, parentThres: number): boolean {
    const thres = page.thres ?? parentThres;
    let isSame = true;
    for (let i = 0; i < page.points.length; i++) {
      const point = page.points[i];
      const color = Testing.getImageColor(mat, point.x, point.y);
      const score = Utils.identityColor(point, color);
      if (score < thres) {
        isSame = false;
        break;
      }
    }
    return isSame;
  }

  public async checkRoutesMatchImages(routes: RouteConfig[]) {
    console.log(`=====> Rerouter Testing: checkRoutesMatchImages Starting`);
    for (const route of routes) {
      try {
        await this.checkRoute(route);
      } catch (e) {
        console.log(`[Error][CheckRoute][${route.path}] [${(e as Error).message}]`);
      }
    }
    console.log(`=====> Rerouter Testing: checkRoutesMatchImages Finished`);
  }

  private async checkPage(page: Page, thres: number): Promise<boolean> {
    const threshold = page.thres ?? thres;
    let imagePath = `${this.screenshotPath}/${page.name}.png`;
    if (!fs.existsSync(imagePath)) {
      imagePath = `${this.screenshotPath}/${page.name}.jpg`;
      if (!fs.existsSync(imagePath)) {
        console.log(`[Warning][Page][${page.name}] NotExist`);
        return false;
      }
    }
    let match = true;
    const mat = await this.loadImage(imagePath);
    for (let i = 0; i < page.points.length; i++) {
      const point = page.points[i];
      const imgRGB = Testing.getImageColor(mat, point.x, point.y);
      const score = Utils.identityColor(point, imgRGB);
      if (score < threshold) {
        console.log(`[Failed][Page][${page.name}][Points][${i}] Score ${score} < Thres ${threshold}`);
        console.log(`[${page.name}] points[${i}] Should: ${Testing.XYRGBToString(point)}`);
        console.log(`[${page.name}] image[${i}] But Get: ${Testing.XYRGBToString(imgRGB)}`);
        match = false;
      }
    }
    mat.delete();
    if (match) {
      console.log(`[Passed][Page][${page.name}][Points][${page.points.length}]`);
    } else {
      console.log(`[Failed][Page][${page.name}][Points][${page.points.length}]`);
    }
    return match;
  }

  private async checkGroupPage(groupPage: GroupPage, thres: number): Promise<boolean> {
    const threshold = groupPage.thres ?? thres;
    let match = groupPage.matchOP === '&&' ? true : false;
    for (const page of groupPage.pages) {
      const ok = await this.checkPage(page, threshold);
      if (groupPage.matchOP === '&&' && !ok) {
        match = false;
      } else if (groupPage.matchOP === '||' && ok) {
        match = true;
      }
    }
    if (match) {
      console.log(`[Passed][GroupPage][${groupPage.name}][Pages][${groupPage.pages.length}]`);
    } else {
      console.log(`[Failed][GroupPage][${groupPage.name}][Pages][${groupPage.pages.length}]`);
    }
    return match;
  }

  private async checkRoute(route: RouteConfig): Promise<void> {
    let match = false;
    if (route.match instanceof Page) {
      match = await this.checkPage(route.match, DefaultConfigValue.PageThres);
    } else if (route.match instanceof GroupPage) {
      match = await this.checkGroupPage(route.match, DefaultConfigValue.GroupPageThres);
    } else {
      console.log(`[Skip][Route][${route.path}] NoMatch`);
      return;
    }
    if (match) {
      console.log(`[Passed][Route][${route.path}]`);
    } else {
      console.log(`[Failed][Route][${route.path}]`);
    }
  }

  public static XYRGBToString(rgb: XYRGB): string {
    return `{ x: ${rgb.x}, y: ${rgb.y},  r: ${rgb.r}, g: ${rgb.g}, y: ${rgb.b} }`;
  }

  public static getImageColor(mat: cv.Mat, x: number, y: number): XYRGB {
    const rgb: Int8Array = mat.ucharPtr(x, y);
    return { x, y, r: rgb[0], g: rgb[1], b: rgb[2] };
  }
}
