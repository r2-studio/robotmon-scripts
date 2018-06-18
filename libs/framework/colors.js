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

Colors.minMaxDiff = function (c) {
  const max = Math.max(Math.max(c.r, c.g), c.b);
  const min = Math.min(Math.min(c.r, c.g), c.b);
  return max - min;
}
