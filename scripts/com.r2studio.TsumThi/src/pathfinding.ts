// Utils for Tsum

function usingTimeString(startTime) {
  return Date.now() - startTime;
}

function getDistance(t1, t2) {
  //return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));
  return (t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y);
}

function buildTsumNeighbors(tsums, maxDistSq) {
  const neighbors = [];
  for (let i = 0; i < tsums.length; i++) {
    neighbors.push([]);
  }
  for (let i = 0; i < tsums.length; i++) {
    for (let j = i + 1; j < tsums.length; j++) {
      if (getDistance(tsums[i], tsums[j]) <= maxDistSq) {
        neighbors[i].push(j);
        neighbors[j].push(i);
      }
    }
  }
  return neighbors;
}

function findTsumComponents(neighbors) {
  const n = neighbors.length;
  const seen = new Array(n);
  for (let i = 0; i < n; i++) { seen[i] = false; }
  const components = [];
  for (let s = 0; s < n; s++) {
    if (seen[s]) { continue; }
    const comp = [];
    const stack = [s];
    seen[s] = true;
    while (stack.length > 0) {
      const v = stack.pop();
      comp.push(v);
      const nbrs = neighbors[v];
      for (let k = 0; k < nbrs.length; k++) {
        if (!seen[nbrs[k]]) {
          seen[nbrs[k]] = true;
          stack.push(nbrs[k]);
        }
      }
    }
    components.push(comp);
  }
  return components;
}

// Bounded DFS backtracking — searches for the longest simple path inside one
// connected component. Each starting node gets its own step budget so a
// dead-end branch can't starve the rest of the search. After picking the best
// chain, a second pass tries to extend it from both endpoints into the
// remaining unvisited subgraph, which rescues cases where the initial DFS
// began in the middle of a longer chain and could only walk one direction.
function findLongestTsumPath(neighbors, comp, budgetPerStart) {
  const n = neighbors.length;
  const visited = new Array(n);
  const path = [];
  const state = { steps: 0, budget: 0, bestLen: 0, best: null };

  // Order each adjacency list by ascending degree so the search tries the most
  // constrained branches first — dead ends prune quickly and leaves get
  // consumed before they become unreachable.
  const sortedNbrs = new Array(n);
  for (let i = 0; i < n; i++) {
    const arr = neighbors[i].slice();
    arr.sort(function(a, b) { return neighbors[a].length - neighbors[b].length; });
    sortedNbrs[i] = arr;
  }

  function dfs(idx) {
    state.steps++;
    visited[idx] = true;
    path.push(idx);
    if (path.length > state.bestLen) {
      state.bestLen = path.length;
      state.best = path.slice();
    }
    if (state.steps < state.budget) {
      const nbrs = sortedNbrs[idx];
      for (let k = 0; k < nbrs.length; k++) {
        if (!visited[nbrs[k]]) {
          dfs(nbrs[k]);
          if (state.steps >= state.budget) { break; }
        }
      }
    }
    visited[idx] = false;
    path.pop();
  }

  function runDfs(startIdx, prefilled) {
    for (let i = 0; i < n; i++) { visited[i] = prefilled ? prefilled[i] : false; }
    visited[startIdx] = false;
    path.length = 0;
    state.steps = 0;
    state.budget = budgetPerStart;
    state.bestLen = 0;
    state.best = null;
    dfs(startIdx);
    return state.best || [];
  }

  // Sort component nodes by ascending degree — true endpoints (degree 1) lie
  // on long paths and make the best DFS starts.
  const starts = comp.slice();
  starts.sort(function(a, b) { return neighbors[a].length - neighbors[b].length; });

  let globalBest = [];
  const maxStarts = Math.min(starts.length, 6);
  for (let s = 0; s < maxStarts; s++) {
    const candidate = runDfs(starts[s], null);
    if (candidate.length > globalBest.length) {
      globalBest = candidate;
    }
    if (globalBest.length >= comp.length) { break; }
  }

  // Bidirectional extension: if the chain doesn't cover the component, try to
  // extend from each endpoint into the remaining nodes. Recovers chains when
  // DFS started from a node that wasn't a true endpoint.
  if (globalBest.length > 0 && globalBest.length < comp.length) {
    const inChain = new Array(n);
    for (let i = 0; i < n; i++) { inChain[i] = false; }
    for (let i = 0; i < globalBest.length; i++) { inChain[globalBest[i]] = true; }

    for (let e = 0; e < 2; e++) {
      const ep = (e === 0) ? globalBest[0] : globalBest[globalBest.length - 1];
      const extension = runDfs(ep, inChain);
      if (extension.length > 1) {
        const extra = extension.slice(1);
        if (e === 0) {
          extra.reverse();
          globalBest = extra.concat(globalBest);
        } else {
          globalBest = globalBest.concat(extra);
        }
        for (let i = 0; i < extra.length; i++) { inChain[extra[i]] = true; }
      }
    }
  }

  return globalBest;
}

function calculatePaths(board, logs, myTsumIdx, prioritizeMyTsum) {
  const startTime = Date.now();
  const groups = {};
  for (const t in board) {
    const tsum = board[t];
    if (groups[tsum.tsumIdx] === undefined) {
      groups[tsum.tsumIdx] = [];
    }
    groups[tsum.tsumIdx].push(tsum);
  }

  const threshold = Config.tsumWidth * 2.8;
  const maxDistSq = threshold * threshold;
  const paths: TsumPath[] = [];

  for (const tsumIdx in groups) {
    const group = groups[tsumIdx];
    if (group.length < 3) { continue; }

    const neighbors = buildTsumNeighbors(group, maxDistSq);
    const components = findTsumComponents(neighbors);

    for (let c = 0; c < components.length; c++) {
      const comp = components[c];
      if (comp.length < 3) { continue; }
      // Per-start budget — multiplied across up to 6 starts + 2 extensions.
      const budgetPerStart = Math.min(1500, 100 + comp.length * comp.length * 6);
      const bestIndices = findLongestTsumPath(neighbors, comp, budgetPerStart);
      if (bestIndices.length >= 3) {
        const pathPoints: TsumPath = [];
        for (let p = 0; p < bestIndices.length; p++) {
          pathPoints.push(group[bestIndices[p]]);
        }
        pathPoints.tsumIdx = +tsumIdx;
        paths.push(pathPoints);
      }
    }
  }

  // In 5>4 mode, MyTsum chains play first (longest first), then other colors by
  // length. Otherwise, just take the longest available chain regardless of color
  // so anything connectable goes out as soon as possible.
  paths.sort(function(a, b) {
    if (prioritizeMyTsum) {
      const aMy = (myTsumIdx >= 0 && a.tsumIdx === myTsumIdx);
      const bMy = (myTsumIdx >= 0 && b.tsumIdx === myTsumIdx);
      if (aMy !== bMy) { return aMy ? -1 : 1; }
    }
    if (a.length < b.length) { return 1; }
    return -1;
  });
  debug(logs.calculatedPath, paths.length, '(' + (Date.now() - startTime) + 'ms)');
  return paths;
}

function convertTo2DArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i = i + size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Game bubbles are circles too, just a good deal bigger than a tsum, so they
// come out of the same grayscale Hough pass at a larger radius. Runs on the
// board capture the scan already holds, so locating them costs no screenshot --
// which is the point: the taps have to land while the chain is still going off.
function findGameBubbles(img) {
  const cfg = GameBubbleConfig;
  let grayImg = null;
  try {
    const tmpImg = clone(img);
    grayImg = bgrToGray(tmpImg);
    releaseImage(tmpImg);
    smooth(grayImg, 2, 9);
    // houghCircles returns centres, unlike the board points findTsums feeds the
    // pathfinder (those are shifted to a tsum's top-left corner).
    const found = houghCircles(grayImg, 3, 1, cfg.minDist, cfg.param1, cfg.param2,
                               cfg.minRadius, cfg.maxRadius);
    const out = [];
    for (const k in found) {
      out.push({x: found[k].x, y: found[k].y, r: found[k].r});
    }
    return out;
  } finally {
    if (grayImg != null) { releaseImage(grayImg); }
  }
}

function findTsums(img) {
  // Every native image allocated here must be released even when a native
  // call throws mid-scan: the task controller swallows task errors and
  // retries, so a leak on this hot path would silently recur on every scan.
  const hsvImg = clone(img);
  let grayImg = null;
  let debugImg = null;
  try {
    // Circle detection runs on a plain grayscale copy, NOT a colour mask. The
    // old HSV outRange masks filtered blue tsums out before detection, so their
    // circles were never found and blue chains went unplayed. Grayscale is
    // colour-agnostic: it detects every tsum, and colour is then sampled from
    // the HSV image and clustered separately in classifyTsums.
    const tmpImg = clone(img);
    grayImg = bgrToGray(tmpImg);
    releaseImage(tmpImg);
    smooth(grayImg, 2, 9);
    convertColor(hsvImg, 40);

    // Circle geometry is expressed against the screenResize base (200px) via a
    // scale factor so it can be retuned in one place if that base ever changes.
    const scale = 1;
    const dp = 1;                            // accumulator resolution (lower = finer)
    const minDist = Math.round(22 * scale);  // min gap between circle centers
    const param1 = 20;                       // Canny high threshold
    const param2 = Math.round(10 * scale);   // accumulator vote threshold
    const minRadius = Math.round(8 * scale);
    const maxRadius = Math.round(14 * scale);

    const points = houghCircles(grayImg, 3, dp, minDist, param1, param2, minRadius, maxRadius);
    releaseImage(grayImg);
    grayImg = null;

    if (ts.debug) {
      debugImg = clone(img);
      for (const dk in points) {
        const pt = points[dk];
        drawCircle(debugImg, pt.x, pt.y, minRadius, 255, 0, 0, 1);
      }
      saveImage(debugImg, ts.storagePath + "/tmp/" + ts.runTimes + "-detectedHoughCircles.jpg");
      releaseImage(debugImg);
      debugImg = null;
    }

    // Heavy blur to smear out face features, then a 5-pixel cross average at
    // the circle center.
    smooth(hsvImg, 1, 22);
    const results = [];
    for (const k in points) {
      const p = points[k];
      let hsv1, hsv2, hsv3, hsv4, hsv5;
      hsv5 = hsv4 = hsv3 = hsv2 = hsv1 = getImageColor(hsvImg, p.x, p.y);
      if (p.x - 1 >= 0) { hsv2 = getImageColor(hsvImg, p.x - 1, p.y); }
      if (p.x + 1 < Config.screenResize) { hsv3 = getImageColor(hsvImg, p.x + 1, p.y); }
      if (p.y - 1 >= 0) { hsv4 = getImageColor(hsvImg, p.x, p.y - 1); }
      if (p.y + 1 < Config.screenResize) { hsv5 = getImageColor(hsvImg, p.x, p.y + 1); }
      const avgb = (hsv1.b + hsv2.b + hsv3.b + hsv4.b + hsv5.b) / 5;
      const avgg = (hsv1.g + hsv2.g + hsv3.g + hsv4.g + hsv5.g) / 5;
      const avgr = (hsv1.r + hsv2.r + hsv3.r + hsv4.r + hsv5.r) / 5;
      results.push({x: p.x, y: p.y, z: p.r, b: avgb, g: avgg, r: avgr});
    }

    if (ts.debug) {
      saveImage(hsvImg, ts.storagePath + "/tmp/" + ts.runTimes + "-hsvImg.jpg");
    }

    return results;
  } finally {
    if (grayImg != null) { releaseImage(grayImg); }
    if (debugImg != null) { releaseImage(debugImg); }
    releaseImage(hsvImg);
  }
}

// Distance between two sampled tsum colors. The image is HSV at this point,
// so b/g/r hold H/S/V.
function distance3D(p1, p2) {
  let d0 = Math.sqrt((p1.b-p2.b)*(p1.b-p2.b) + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
  if (Math.abs(p1.b - p2.b) < 20) { d0 -= 10; }
  if (Math.abs(p1.g - p2.g) < 20) { d0 -= 10; }
  if (p1.r < 120 && p2.r < 120) { d0 -= 20; }
  return d0;
}

// Greedy single pass against a drifting running mean, fixed merge threshold,
// unbounded cluster count. Each point joins the CLOSEST cluster within the
// threshold rather than the first one found: when two clusters both fall inside
// the merge distance (common once blue variants are detected), first-match
// could bleed a point into the wrong colour and drift both means; nearest-match
// keeps the assignment stable.
function classifyTsums(points) {
  const threshold = 15;
  if (!Array.isArray(points) || points.length === 0) {
    return [];
  }

  const clusters = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    let bestCluster = null;
    let minDistance = Infinity;

    // Find the closest existing cluster within threshold.
    for (let j = 0; j < clusters.length; j++) {
      const cluster = clusters[j];
      const d = distance3D(cluster, p);
      if (d < threshold && d < minDistance) {
        minDistance = d;
        bestCluster = cluster;
      }
    }

    if (bestCluster) {
      // Add to the nearest cluster and update its running mean colour.
      bestCluster.points.push(p);
      const count = bestCluster.points.length;
      bestCluster.sumb += p.b; bestCluster.sumg += p.g; bestCluster.sumr += p.r;
      bestCluster.b = bestCluster.sumb / count;
      bestCluster.g = bestCluster.sumg / count;
      bestCluster.r = bestCluster.sumr / count;
    } else {
      clusters.push({ sumb: p.b, sumg: p.g, sumr: p.r, b: p.b, g: p.g, r: p.r, points: [p] });
    }
  }

  return clusters;
}

function detectOffsetYInGame() {
  const img = getScreenshot();
  // var img = openImage('/sdcard/img2.jpg');
  try {
    const size = getImageSize(img);
    console.log('deviceW', size.width, 'deviceH', size.height);
    const centerY = Math.floor(size.height / 2);

    // find top black
    let topBlackY = 0;
    let y: number;
    let color: Color;
    for (y = centerY; y >= 0; y--) {
      color = getImageColor(img, size.width*0.9, y);
      if (isSameColor({r: 0, g: 0, b: 0}, color, 6)) {
        // black color found
        topBlackY = y;
        break;
      }
    }
    console.log('topBlackY', topBlackY);

    let bottomBlackY = size.height;
    for (y = centerY; y < size.height; y++) {
      color = getImageColor(img, size.width*0.9, y);
      if (isSameColor({r: 0, g: 0, b: 0}, color, 6)) {
        // black color found
        bottomBlackY = y;
        break;
      }
    }
    console.log('bottomBlackY', bottomBlackY);
    console.log('screenHeight', bottomBlackY - topBlackY + 1);
    return -topBlackY;
  } finally {
    releaseImage(img);
  }
}

// Tsum struct

