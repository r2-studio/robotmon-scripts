var GameBubbleConfig = {
  minRadius: 16,
  maxRadius: 30,
  minDist: 30,
  param1: 20,
  param2: 26,

  // Chain length that earns a pop, and a cap so a frame full of false circles
  // cannot turn into a long burst of taps mid-chain.
  minChainForPop: 4,
  maxTaps: 3,
  tapDuring: 10
};
