var run = false;
var x = 0;
var y = 0;
var normal = true;

function loop() {
  console.log("Start Clicking...");
  var count = 0;
  while (run) {
    if (normal) {
      tap(x, y, 20);
      count++;
      sleep(160);
    } else {
      for (var i = 0; i < 5; i++) {
        tapDown(x + i * 50, y + i * 50, 1, i);
      }
      sleep(5);
      for (var i = 0; i < 5; i++) {
        tapUp(x + i * 50, y + i * 50, 1, i);
      }
      sleep(5);
      count++;
    }
    if (count % 50 === 0) {
      console.log("click", count, "* 5 times");
      sleep(1000);
    }
  }
}

function start(n) {
  var wh = getScreenSize();
  x = Math.floor(wh.width / 3) || 200;
  y = Math.floor(wh.height / 2) || 200;
  run = true;
  normal = n;
  loop();
}

function stop() {
  run = false;
}
