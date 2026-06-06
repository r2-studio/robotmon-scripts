// Converted from index.js - TypeScript port.
"use strict";

// Named `TsumTaskController` rather than `TaskController` to avoid colliding
// with the DOM lib's built-in `TaskController` (Prioritized Task Scheduling
// API) that ships in lib.dom.d.ts.
class TsumTaskController {
  tasks: { [name: string]: Task };
  isRunning: boolean;
  interval: number;
  errorCount: number;

  constructor() {
    this.tasks = {};
    this.isRunning = false;
    this.interval = 200;
    this.errorCount = 0;
  }

  // Pick the highest-priority task that is due to run again. Among due tasks,
  // lower `priority` wins; ties break toward the larger interval, then the
  // least-recently-run task. Returns "" when nothing is due.
  getFirstPriorityTaskName(): string {
    let best: Task | null = null;
    const now = Date.now();
    for (const name in this.tasks) {
      const task = this.tasks[name];
      if (now - task.lastRunTime < task.interval) {
        continue;
      }
      if (best !== null) {
        if (task.priority < best.priority) {
          best = task;
        } else if (task.interval > best.interval) {
          best = task;
        } else if (task.lastRunTime < best.lastRunTime) {
          best = task;
        }
      } else {
        best = task;
      }
    }
    return best === null ? "" : best.name;
  }

  loop(): void {
    console.log("loop start");
    gPause.reset();
    while (this.isRunning) {
      gPause.gate();          // blocks here while paused (between tasks)
      if (!this.isRunning) break;
      const name = this.getFirstPriorityTaskName();
      const task = this.tasks[name];
      if (task !== undefined) {
        // Layer 1: swallow uncaught errors so one bad task can't kill the whole
        // controller. A run of consecutive errors bounces the game app.
        try {
          task.run();
          this.errorCount = 0;
        } catch (e) {
          this.errorCount++;
          log("[Watchdog] task '" + name + "' threw (" + this.errorCount + "): " + e);
          if (this.errorCount >= 5) {
            log("[Watchdog] 5 consecutive errors, restarting Tsum app");
            try { ts.taskTsumAppRestart(); } catch (e2) { log("[Watchdog] restart failed: " + e2); }
            this.errorCount = 0;
          }
        }
        task.lastRunTime = Date.now();
        task.runTimes--;
        if (task.runTimes === 0) {
          delete this.tasks[name];
        }
      }
      sleep(this.interval);
    }
    this.isRunning = false;
    console.log("loop stop");
  }

  updateRunInterval(interval: number): void {
    if (interval < this.interval && interval >= 50) {
      this.interval = interval;
    }
  }

  newTaskObject(name: string, run: () => void, interval: number | undefined, runTimes: number | undefined, priority: number): Task {
    return {
      name: name,
      run: run,
      interval: interval || 1000,
      runTimes: runTimes || 0,
      priority: priority,
      lastRunTime: 0,
      status: 0
    };
  }

  newTask(name: string, run: () => void, interval?: number, runTimes?: number, runOnce?: boolean): Task | undefined {
    if (runOnce === undefined) {
      runOnce = false;
    }
    if (typeof run === "function") {
      const task = this.newTaskObject(name, run, interval, runTimes, 0);
      if (runOnce) {
        task.lastRunTime = Date.now();
      }
      this.updateRunInterval(task.interval);
      const systemName = "system_newTask_" + name;
      const self = this;
      const systemTask = this.newTaskObject(systemName, function () { self.tasks[name] = task; }, 0, 1, -20);
      this.tasks[systemName] = systemTask;
      return task;
    }
    console.log("Error not a function", name, run);
    return undefined;
  }

  removeTask(name: string): void {
    const systemName = "system_removeTask_" + Date.now().toString();
    const self = this;
    const systemTask = this.newTaskObject(systemName, function () { delete self.tasks[name]; }, 0, 1, -20);
    this.tasks[systemName] = systemTask;
  }

  removeAllTasks(): void {
    const systemName = "system_removeAllTask_" + Date.now().toString();
    const self = this;
    const systemTask = this.newTaskObject(systemName, function () {
      for (const key in self.tasks) {
        delete self.tasks[key];
      }
    }, 0, 1, -20);
    this.tasks[systemName] = systemTask;
  }

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      console.log("wait loop stop...");
    }
  }
}


