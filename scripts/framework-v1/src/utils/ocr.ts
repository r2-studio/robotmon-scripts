import { findImages, getImageSize, Image } from "../robotmonRawAPI";

export class OCR {
  public words: { char: string; img: Image }[];

  public constructor(words: { char: string; img: Image }[]) {
    this.words = words;
  }

  public recognize(devImg: Image, maxLength: number, thres: number, overlapRatio: number = 0.8) {
    let maxWordWidth = 0;
    const allResults: { char: string; x: number; y: number; score: number; w: number }[] = [];
    for (var w = 0; w < this.words.length; w++) {
      var word = this.words[w];
      var wh = getImageSize(word.img);
      maxWordWidth = Math.max(maxWordWidth, wh.width);
      var results = findImages(devImg, word.img, thres, maxLength, true);
      for (var idx in results) {
        var result = results[idx];
        allResults.push({ char: word.char, x: result.x, y: result.y, score: result.score, w: wh.width });
      }
    }

    allResults.sort(function (a, b) {
      return a.x - b.x;
    });

    let str = '';
    let rBound = 0;
    let maxScore = 0;
    for (var i = 0; i < allResults.length; i++) {
      const word = allResults[i];
      // console.log('word', word.char, rBound, 'x', word.x, word.score);
      if (word.x > rBound) {
        maxScore = word.score;
        str += word.char;
        rBound = Math.floor(word.x + word.w * overlapRatio);
      } else if (word.x <= rBound && word.score > maxScore && word.char !== ' ') {
        // overlap
        maxScore = word.score;
        str = str.substr(0, str.length - 1) + word.char;
        rBound = Math.floor(word.x + word.w * overlapRatio);
      }
    }
    return str;
  }
}
