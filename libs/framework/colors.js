function Colors() {}

Colors.isSameColor = function (c1, c2, d) {
  d = d || 25;
  if (Math.abs(c1.r - c2.r) < d && Math.abs(c1.g - c2.g) < d && Math.abs(c1.b - c2.b) < d) {
    return true;
  }
  return false;
}