var ts;
var gTaskController;

// ----- Keypress pause/resume -------------------------------------------------
// A PC hotkey writes "1" (pause) / "0" (resume) into <storage>/tsum_pause over
// adb. Any long-running loop calls gPause.gate() at a safe boundary: it is cheap
// when not paused (file read throttled to ~2x/sec) and blocks in place until
// resumed when paused. This lets us pause mid-game, not only between tasks.
var gPause = {
  path: "",
  nextCheck: 0,
  paused: false,

  reset: function () {
    this.path = getStoragePath() + "/tsum_pause";
    this.paused = false;
    this.nextCheck = 0;
    try { writeFile(this.path, "0"); } catch (e) {}  // clear any stale flag
    log("[Pause] keypress-pause watching file: " + this.path);
  },

  _wantPause: function () {
    if (this.path === "") this.path = getStoragePath() + "/tsum_pause";
    var pf = "";
    try { pf = readFile(this.path); } catch (e) { return false; }
    return (pf !== undefined && ("" + pf).charAt(0) === "1");
  },

  gate: function () {
    var now = Date.now();
    if (!this.paused && now < this.nextCheck) return;  // throttle when running
    this.nextCheck = now + 500;
    if (!this._wantPause()) { this.paused = false; return; }
    this.paused = true;
    log("=== SCRIPT PAUSED ===");
    while (this._wantPause()) {
      if (gTaskController !== undefined && !gTaskController.isRunning) break;  // allow Stop while paused
      sleep(200);
    }
    this.paused = false;
    log("=== SCRIPT RESUMED ===");
  }
};

