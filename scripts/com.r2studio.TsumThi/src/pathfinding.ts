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
  debug(logs.calculatedPath, paths.length);
  return paths;
}

function median(arr) {
  arr.sort(function(a, b) { return a - b; });
  return arr[Math.floor(arr.length / 2)];
}

function convertTo2DArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i = i + size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function findTsums(img) {
  const hsvImg = clone(img);
  smooth(hsvImg, 1, 7);
  convertColor(hsvImg, 40);
  const filter1 = outRange(hsvImg, 80, 160, 20, 0, 120, 255, 210, 255);
  const filter2 = outRange(filter1, 80, 100, 90, 0, 130, 170, 190, 255);
  const mask = bgrToGray(filter2);

  releaseImage(filter1);
  releaseImage(filter2);

  const points = houghCircles(mask, 3, 1, 22, 4, 7, 8, 14);

  // Light blur only — the ring-median sampling below is what rejects face
  // features and overlap contamination now. The old 22px smear covered more
  // than a whole tsum (~16px here) and bled neighboring tsums' colors into
  // every center sample.
  smooth(hsvImg, 1, Config.colorSampleSmooth);
  // Sample the center plus a ring inside the tsum body: per-channel medians
  // ignore eyes/highlights and stray neighbor pixels as long as most samples
  // land on body color.
  const ringR = Math.max(2, Math.round(Config.tsumWidth * 0.3));
  const results = [];
  for (const k in points) {
    const p = points[k];
    const hs = [], ss = [], vs = [];
    const c0 = getImageColor(hsvImg, p.x, p.y);
    hs.push(c0.b); ss.push(c0.g); vs.push(c0.r);
    for (let a = 0; a < 12; a++) {
      const ang = a * Math.PI / 6;
      const sx = Math.min(Math.max(Math.round(p.x + ringR * Math.cos(ang)), 0), Config.screenResize - 1);
      const sy = Math.min(Math.max(Math.round(p.y + ringR * Math.sin(ang)), 0), Config.screenResize - 1);
      const c = getImageColor(hsvImg, sx, sy);
      hs.push(c.b); ss.push(c.g); vs.push(c.r);
    }
    results.push({x: p.x, y: p.y, z: p.r, b: median(hs), g: median(ss), r: median(vs)});
  }

  if (ts.debug) {
    saveImage(mask, ts.storagePath + "/tmp/" + ts.runTimes + "-mask.jpg");
    saveImage(hsvImg, ts.storagePath + "/tmp/" + ts.runTimes + "-hsvImg.jpg");
  }

  releaseImage(mask);
  releaseImage(hsvImg);

  return results;
}

// Distance between two sampled tsum colors. The image is HSV at this point,
// so b/g/r hold H/S/V. Hue is the discriminator between tsum types — two
// fully-saturated tsums a hue-step apart (e.g. green alien vs orange car) are
// different tsums even though their S/V nearly match — so the hue diff is
// weighted up before the similarity discounts apply. Two caveats handled
// below: OpenCV hue is circular (0 and 180 are both red), and the hue of a
// desaturated color (white/gray/black tsums) is noise, so the hue term is
// scaled by saturation.
function distance3D(p1, p2) {
  let dhRaw = Math.abs(p1.b - p2.b);
  if (dhRaw > 90) { dhRaw = 180 - dhRaw; }
  const dh = dhRaw * (Config.colorHueWeightX10 / 10) * (Math.min(p1.g, p2.g) / 255);
  let d = Math.sqrt(dh*dh + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
  if (dhRaw < 20) { d -= Config.colorHueBonus; }
  if (Math.abs(p1.g - p2.g) < 20) { d -= Config.colorSatBonus; }
  if (p1.r < 120 && p2.r < 120) { d -= 20; }
  return d;
}

// Cluster sampled tsum colors into exactly k groups — the board always holds
// a known number of tsum types, which is a far stronger prior than any
// distance threshold. k-means with farthest-point seeding replaces the old
// greedy single-pass clustering, which was order-dependent (drifting running
// mean) and needed a hand-tuned merge distance to decide the cluster count.
// Config.colorMergeDist survives as a noise cutoff: points farther than it
// from every final center (bubbles, coins, glow effects) are dropped instead
// of being forced into a real cluster.
function classifyTsums(points, k) {
  if (points.length === 0) { return []; }
  k = Math.min(Math.max(k || 5, 1), points.length);

  // Farthest-point seeding. The first seed is the point farthest from
  // points[0] (so the result doesn't depend on detection order), each later
  // seed the point farthest from its nearest existing seed.
  const centers = [];
  let far = points[0], farD = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const d = distance3D(points[0], points[i]);
    if (d > farD) { farD = d; far = points[i]; }
  }
  centers.push({ b: far.b, g: far.g, r: far.r });
  while (centers.length < k) {
    far = null; farD = -Infinity;
    for (let i = 0; i < points.length; i++) {
      let nearest = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = distance3D(centers[c], points[i]);
        if (d < nearest) { nearest = d; }
      }
      if (nearest > farD) { farD = nearest; far = points[i]; }
    }
    centers.push({ b: far.b, g: far.g, r: far.r });
  }

  const assign = new Array(points.length);
  for (let iter = 0; iter < 8; iter++) {
    // Assignment pass.
    let changed = false;
    for (let i = 0; i < points.length; i++) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = distance3D(centers[c], points[i]);
        if (d < bestD) { bestD = d; best = c; }
      }
      if (assign[i] !== best) { assign[i] = best; changed = true; }
    }
    if (!changed) { break; }

    // Update pass. Hue is circular, so it is averaged as a unit vector
    // (OpenCV hue h maps to angle h * 2 degrees); S and V as plain means.
    for (let c = 0; c < centers.length; c++) {
      let sumSin = 0, sumCos = 0, sumG = 0, sumR = 0, n = 0;
      let farIdx = -1; farD = -Infinity;
      for (let i = 0; i < points.length; i++) {
        if (assign[i] !== c) {
          const d = distance3D(centers[assign[i]], points[i]);
          if (d > farD) { farD = d; farIdx = i; }
          continue;
        }
        const ang = points[i].b * Math.PI / 90;
        sumSin += Math.sin(ang); sumCos += Math.cos(ang);
        sumG += points[i].g; sumR += points[i].r;
        n++;
      }
      if (n === 0) {
        // Empty cluster: re-seed at the point that fits its current cluster
        // worst, so a real type can't silently vanish.
        if (farIdx >= 0) {
          centers[c] = { b: points[farIdx].b, g: points[farIdx].g, r: points[farIdx].r };
        }
        continue;
      }
      let h = Math.atan2(sumSin, sumCos) * 90 / Math.PI;
      if (h < 0) { h += 180; }
      centers[c] = { b: h, g: sumG / n, r: sumR / n };
    }
  }

  // Build clusters from the final centers, discarding noise points.
  const tcs = [];
  for (let c = 0; c < centers.length; c++) {
    tcs.push({ b: centers[c].b, g: centers[c].g, r: centers[c].r, points: [] });
  }
  for (let i = 0; i < points.length; i++) {
    let best = 0, bestD = Infinity;
    for (let c = 0; c < centers.length; c++) {
      const d = distance3D(centers[c], points[i]);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (bestD <= Config.colorMergeDist) {
      tcs[best].points.push(points[i]);
    }
  }
  return tcs.filter(function(tc) { return tc.points.length > 0; });
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

