import { Utils } from '../utils/utils';

export class Task {
  public name: string = '';
  public runTimes: number = 1; // 0 = no limited
  public maxRunningDuring: number = 0; // 0 = no limit
  public minIntervalDuring: number = 0; // 0 = no limit
  public lastRunDoneTime: number = 0;
  public run: () => void = () => {};
}

export class TaskManager {
  public isRunning: boolean = false;
  public runIdx: number = 0;
  public tasks: Task[] = [];

  public addTask(name: string, run: () => void, runTimes: number = 1, maxRunningDuring: number = 0, minIntervalDuring: number = 0) {
    const task = new Task();
    task.name = name;
    task.run = run;
    task.runTimes = runTimes;
    task.maxRunningDuring = maxRunningDuring;
    task.minIntervalDuring = minIntervalDuring;
    this.tasks.push(task);
  }

  public start() {
    if (this.tasks.length === 0) {
      throw new Error(`TaskManager: No tasks to run`);
    }
    console.log(`TaskManager start`);
    this.isRunning = true;

    while (this.isRunning) {
      const now = Date.now();
      const task = this.tasks[this.runIdx % this.tasks.length];
      this.runIdx++;

      if (now - task.lastRunDoneTime < task.minIntervalDuring) {
        continue;
      }
      console.log(`RunTask ${this.runIdx} ${task.name}, times ${task.runTimes}, maxDuring ${task.maxRunningDuring}`);

      let thisTaskRunTimes = 0;
      while (this.isRunning) {
        console.log(`TaskRunning ${task.name}, times ${thisTaskRunTimes}/${task.runTimes}`);
        task.run();
        task.lastRunDoneTime = Date.now();
        thisTaskRunTimes++;
        if (task.runTimes !== 0 && thisTaskRunTimes >= task.runTimes) {
          break;
        }
        if (Date.now() - now > task.maxRunningDuring) {
          break;
        }
        sleep(100);
      }
    }
  }

  public stop() {
    this.isRunning = false;
    Utils.sleep(1000);
    console.log(`TaskManager stop`);
  }
}
