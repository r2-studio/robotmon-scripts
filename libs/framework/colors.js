function Colors() {}

Colors.isSameColor = function (c1, c2, d) {
  d = d || 25;
  if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
    return true;
  }
  return false;
}

Colors.mergeColor = function (c1, c2) {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2),
  };
}

Colors.diffColor = function (c, c1) {
  return Math.abs(c1.r - c.r) + Math.abs(c1.g - c.g) + Math.abs(c1.b - c.b);
}

Colors.distanceColor = function (c, c1) {
  return Math.sqrt((c1.r - c.r)*(c1.r - c.r) + (c1.g - c.g)*(c1.g - c.g) + (c1.b - c.b)*(c1.b - c.b));
}

Colors.identityScore = function(e1, e2) {
  var mean = (e1.r + e2.r) / 2;
  var r = e1.r - e2.r;
  var g = e1.g - e2.g;
  var b = e1.b - e2.b;
  return 1 - Math.sqrt((((512+mean)*r*r)>>8) + 4*g*g + (((767-mean)*b*b)>>8)) / 768;
}

Colors.minMaxDiff = function (c) {
  var max = Math.max(Math.max(c.r, c.g), c.b);
  var min = Math.min(Math.min(c.r, c.g), c.b);
  return max - min;
}
