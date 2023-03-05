export class Colors {
  public static getRangeColor(img: any, x: number, y: number, radius: number, dense: number = 5): RGB {
    let shouldRelease = false;
    if (img === undefined) {
      shouldRelease = true;
      img = getScreenshot();
    }
    const imageSize = getImageSize(img);
    const fx = Math.max(0, x - radius);
    const fy = Math.max(0, y - radius);
    const tx = Math.min(imageSize.width, x + radius);
    const ty = Math.min(imageSize.height, y + radius);
    // get dense^2 points
    const ix = Math.max(1, (tx - fx) / dense);
    const iy = Math.max(1, (ty - fy) / dense);
    let count = 0;
    const sumColor: RGB = { r: 0, g: 0, b: 0 };
    for (let x = fx; x < tx; x += ix) {
      for (let y = fy; y < ty; y += iy) {
        const color = getImageColor(img, Math.floor(x), Math.floor(y));
        sumColor.r += color.r;
        sumColor.g += color.g;
        sumColor.b += color.b;
        count++;
      }
    }
    if (shouldRelease) {
      releaseImage(img);
    }
    return {
      r: Math.floor(sumColor.r / count),
      g: Math.floor(sumColor.g / count),
      b: Math.floor(sumColor.b / count),
    };
  }

  public static color2hex(color: RGB) {
    return ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
  }

  public static hex2Color(hex: string): RGB {
    const r = parseInt(hex[0] + hex[1], 16);
    const g = parseInt(hex[2] + hex[3], 16);
    const b = parseInt(hex[4] + hex[5], 16);
    return { r, g, b };
  }

  public static identityColor(e1: RGB, e2: RGB) {
    const mean = (e1.r + e2.r) / 2;
    const r = e1.r - e2.r;
    const g = e1.g - e2.g;
    const b = e1.b - e2.b;
    return 1 - Math.sqrt((((512 + mean) * r * r) >> 8) + 4 * g * g + (((767 - mean) * b * b) >> 8)) / 768;
  }
}
