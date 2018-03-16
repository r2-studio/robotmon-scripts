/*
    Example code: Line: Jungle Pang Auto Play
*/

function isSameColor(c1, c2, diff) {
    if (diff == undefined) {
      diff = 20;
    }
    if (Math.abs(c1.r - c2.r) > diff) {
      return false;
    }
    if (Math.abs(c1.g - c2.g) > diff) {
      return false;
    }
    if (Math.abs(c1.b - c2.b) > diff) {
      return false;
    }
    return true;
  }
  
  var leftBtnColor = {r: 82, g: 186, b: 149};
  function getCardColor() {
      var rs = [];
      var img = getScreenshotModify(860, 576, 1, 1500, 1, 1500, 90);
      for (var i = 0; i < 6; i++) {
        // 1192
        var c = getImageColor(img, 0, i * 239);
        var t = isSameColor(c, leftBtnColor, 20);
        console.log(i *239 + 576 );
        rs.push(t);
      }
      releaseImage(img);
      return rs;
  }
  
  var flag = false;
  
  function start() {  
      console.log('[Jungle] START');
      flag = true;
      tap(750, 2350, 30);
      sleep(4000);
      var count = 0;
      console.log('GO');
      var t = Date.now();
      while(flag && Date.now() - t < 40000) {
          var rs = getCardColor();
          for (var i = 5; i >= 1 && flag; i--) {
            console.log(rs[i]);
            if (rs[i]) {
              tap(430, 2350, 20);
            } else {
              tap(1020, 2350, 20);
            }
             count++;
          }
          sleep(400);
      }
      console.log('[Jungle] STOP');
  }
    
  function stop() {
      flag = false;
  }