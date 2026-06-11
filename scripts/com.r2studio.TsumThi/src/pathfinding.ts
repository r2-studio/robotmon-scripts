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

  const results = [];
  if (!Config.experimentalConnections) {
    // Original sampling: heavy blur to smear out face features, then a
    // 5-pixel cross average at the circle center.
    smooth(hsvImg, 1, 22);
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
  } else {
    // Experimental sampling: light blur only — the ring-median below is what
    // rejects face features and overlap contamination. The 22px smear above
    // covers more than a whole tsum (~16px here) and bleeds neighboring
    // tsums' colors into every center sample.
    smooth(hsvImg, 1, Config.colorSampleSmooth);
    // Sample the center plus an 8-point ring inside the tsum body:
    // per-channel medians ignore eyes/highlights and stray neighbor pixels as
    // long as most samples land on body color. Each getImageColor is a
    // JS<->native bridge call on the scan's critical path (combo timer is
    // running), so the ring is kept as small as the median can afford — 9
    // samples tolerate 4 outliers.
    const ringR = Math.max(2, Math.round(Config.tsumWidth * 0.3));
    const ringDiag = Math.max(1, Math.round(ringR * 0.7071));
    const ringOffsets = [
      [ringR, 0], [ringDiag, ringDiag], [0, ringR], [-ringDiag, ringDiag],
      [-ringR, 0], [-ringDiag, -ringDiag], [0, -ringR], [ringDiag, -ringDiag]
    ];
    for (const k in points) {
      const p = points[k];
      const hs = [], ss = [], vs = [];
      const c0 = getImageColor(hsvImg, p.x, p.y);
      hs.push(c0.b); ss.push(c0.g); vs.push(c0.r);
      for (let a = 0; a < ringOffsets.length; a++) {
        const sx = Math.min(Math.max(p.x + ringOffsets[a][0], 0), Config.screenResize - 1);
        const sy = Math.min(Math.max(p.y + ringOffsets[a][1], 0), Config.screenResize - 1);
        const c = getImageColor(hsvImg, sx, sy);
        hs.push(c.b); ss.push(c.g); vs.push(c.r);
      }
      results.push({x: p.x, y: p.y, z: p.r, b: median(hs), g: median(ss), r: median(vs)});
    }
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
// so b/g/r hold H/S/V.
//
// The experimental variant treats hue as the discriminator between tsum
// types — two fully-saturated tsums a hue-step apart (e.g. green alien vs
// orange car) are different tsums even though their S/V nearly match — so the
// hue diff is weighted up before the similarity discounts apply. It also
// handles OpenCV hue being circular (0 and 180 are both red) and scales the
// hue term by saturation, since the hue of a desaturated color (white/gray/
// black tsums) is noise.
function distance3D(p1, p2) {
  if (!Config.experimentalConnections) {
    let d0 = Math.sqrt((p1.b-p2.b)*(p1.b-p2.b) + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
    if (Math.abs(p1.b - p2.b) < 20) { d0 -= 10; }
    if (Math.abs(p1.g - p2.g) < 20) { d0 -= 10; }
    if (p1.r < 120 && p2.r < 120) { d0 -= 20; }
    return d0;
  }
  let dhRaw = Math.abs(p1.b - p2.b);
  if (dhRaw > 90) { dhRaw = 180 - dhRaw; }
  const dh = dhRaw * (Config.colorHueWeightX10 / 10) * (Math.min(p1.g, p2.g) / 255);
  let d = Math.sqrt(dh*dh + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
  if (dhRaw < 20) { d -= Config.colorHueBonus; }
  if (Math.abs(p1.g - p2.g) < 20) { d -= Config.colorSatBonus; }
  if (p1.r < 120 && p2.r < 120) { d -= 20; }
  return d;
}

// Circular mean of OpenCV hue values accumulated as unit vectors (hue h maps
// to angle h * 2 degrees, so 0 and 180 are both red).
function hueFromVec(sumSin, sumCos) {
  let h = Math.atan2(sumSin, sumCos) * 90 / Math.PI;
  if (h < 0) { h += 180; }
  return h;
}

// Original clustering: greedy single pass against a drifting running mean,
// fixed merge threshold, unbounded cluster count.
function classifyTsumsLegacy(points) {
  const tcs = [];
  if (points.length === 0) {
    return tcs;
  }
  let p = points[0];
  tcs.push({ sumb: p.b, sumg: p.g, sumr: p.r, b: p.b, g: p.g, r: p.r, points: [p] });
  for (let i = 1; i < points.length; i++) {
    p = points[i];
    let isSame = false;
    for(const j in tcs) {
      const tc = tcs[j];
      const d = distance3D(tc, p);
      if (d < 15) {
        const count = tc.points.length + 1;
        isSame = true;
        tc.sumb += p.b; tc.sumg += p.g; tc.sumr += p.r;
        tc.b = tc.sumb/count; tc.g = tc.sumg/count; tc.r = tc.sumr/count;
        tc.points.push(p);
        break;
      }
    }
    if(!isSame) {
      tcs.push({ sumb: p.b, sumg: p.g, sumr: p.r, b: p.b, g: p.g, r: p.r, points: [p]});
    }
  }
  return tcs;
}

// Experimental clustering ("Experimental Tsum Connections" setting): cluster
// sampled tsum colors into at most k groups (the number of tsum types known
// to be on the board). Two passes:
//
// 1. Greedy threshold clustering discovers candidate centers by mass: real
//    tsum types collect many points while noise detections (coins, score
//    bubbles, glow effects — Hough finds them all as circles) end up in tiny
//    clusters. The k largest greedy clusters become the seeds, making seeding
//    robust to outliers. (Farthest-point seeding was tried and latched onto
//    exactly those outliers, starving real types of cluster slots.)
// 2. A few k-means iterations undo the greedy pass's order dependence — its
//    running means drift with detection order — and settle the centers.
//
// If the greedy pass finds fewer than k groups, fewer clusters are returned;
// forcing k would only split a real type. Points farther than
// Config.colorMergeDist from every final center are dropped as noise.
function classifyTsums(points, k) {
  if (!Config.experimentalConnections) { return classifyTsumsLegacy(points); }
  if (points.length === 0) { return []; }
  k = Math.max(k || 5, 1);

  // Pass 1: greedy clustering by mass (circular-hue running mean).
  const greedy = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const ang = p.b * Math.PI / 90;
    let joined = false;
    for (let j = 0; j < greedy.length; j++) {
      const gc = greedy[j];
      if (distance3D(gc, p) < Config.colorMergeDist) {
        gc.sumSin += Math.sin(ang); gc.sumCos += Math.cos(ang);
        gc.sumG += p.g; gc.sumR += p.r;
        gc.n++;
        gc.b = hueFromVec(gc.sumSin, gc.sumCos);
        gc.g = gc.sumG / gc.n; gc.r = gc.sumR / gc.n;
        joined = true;
        break;
      }
    }
    if (!joined) {
      greedy.push({
        b: p.b, g: p.g, r: p.r,
        sumSin: Math.sin(ang), sumCos: Math.cos(ang), sumG: p.g, sumR: p.r, n: 1
      });
    }
  }
  greedy.sort(function(a, b) { return b.n - a.n; });
  const centers = [];
  for (let c = 0; c < greedy.length && c < k; c++) {
    centers.push({ b: greedy[c].b, g: greedy[c].g, r: greedy[c].r });
  }

  // Pass 2: k-means refinement from the mass-based seeds.
  const assign = new Array(points.length);
  for (let iter = 0; iter < 4; iter++) {
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

    for (let c = 0; c < centers.length; c++) {
      let sumSin = 0, sumCos = 0, sumG = 0, sumR = 0, n = 0;
      for (let i = 0; i < points.length; i++) {
        if (assign[i] !== c) { continue; }
        const ang = points[i].b * Math.PI / 90;
        sumSin += Math.sin(ang); sumCos += Math.cos(ang);
        sumG += points[i].g; sumR += points[i].r;
        n++;
      }
      if (n > 0) {
        centers[c] = { b: hueFromVec(sumSin, sumCos), g: sumG / n, r: sumR / n };
      }
    }
  }

  // Build clusters from the final centers, discarding noise points. The
  // membership cutoff is looser than the formation threshold: a marginal but
  // real tsum is a lost chain candidate if dropped, while true noise sits far
  // from every center.
  const noiseCutoff = Config.colorMergeDist * 1.5;
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
    if (bestD <= noiseCutoff) {
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

