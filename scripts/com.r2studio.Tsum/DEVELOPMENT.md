# Development Guide

Orientation for anyone touching the source. For what the script *does* and what
each setting means, see [README.md](README.md).

## The one thing to understand first

**There are no imports and no modules.** Every `.ts` file under `src/` is
concatenated, in the order listed in `tsconfig.json`, into a single
`build/index.js` that Robotmon loads and runs. All files therefore share one
global scope: a `function` or `var` declared in `data.ts` is simply visible in
`tsum.ts`, with no import statement anywhere.

Two consequences worth internalising:

- **Order in `tsconfig.json` matters.** Anything that *executes at load time*
  (top-level assignments like `var SkillHandlers = {}`, or the `registerSkill`
  calls in the skill files) must be listed after what it depends on. Function
  declarations hoist across the whole bundle, so *calls made at runtime* are
  order-independent — only load-time work is sensitive.
- **Name collisions are silent.** Two files declaring the same symbol will not
  error; the later one just wins. This has bitten the project before: a bad
  merge restored an old monolithic `index.ts` alongside the split files, and
  because `index.ts` is concatenated last, its duplicate definitions silently
  overwrote everything else.

## How it runs on a device

```
Robotmon loads the script folder
        │
        ├── index.html ──► settings.js   (the settings UI, a WebView page)
        │                      │
        │                      │  user taps ▶ Play
        │                      │  onEvent('OnPlayClick') builds a settings object
        │                      │  and calls JavaScriptInterface.runScript(...)
        │                      ▼
        │              start({ jpVersion: false, skillType: 'burst', ... })
        │
        └── index.js ──────► start() in index.ts
                                 │
                                 ├─ new Tsum(...)              the game-playing object
                                 ├─ new TsumTaskController()   the scheduler
                                 ├─ gTaskController.newTask(...) × N
                                 └─ gTaskController.start()    ──► blocking loop
```

The settings UI and the game script are **two separate JavaScript worlds**. They
never share memory; the only channel between them is
`JavaScriptInterface.runScript(<source string>)`. That is why `start()` receives
its whole configuration as one JSON-serialised argument rather than reading it
from anywhere.

Once `gTaskController.start()` is called, `loop()` runs until stopped: on each
tick it picks the highest-priority task that is due and runs it to completion.
Tasks are cooperative — a long one like `taskPlayGameQuick` blocks the loop for
the whole game, so nothing else runs meanwhile.

Tapping ⏸ Pause calls `stop()`, which clears `ts.isRunning` and drains the
controller. Because tasks are cooperative, that takes effect at the next task
boundary — a game already in progress plays on until its loop notices.

## File map

Listed in bundle order. Skills are covered in
[the skills section](#skills--srcskills) below.

| File | What lives in it |
|:--|:--|
| `globals.d.ts` | Types only, emits nothing. Ambient declarations for the Robotmon host API (`tap`, `getScreenshot`, `execute`, `readFile`, the OpenCV helpers), the shared value shapes (`Point`, `Color`, `PageDef`, `Task`, `TsumPath`), and the cross-file globals (`ts`, `gTaskController`, `Config`, `Button`, `Page`). Add a declaration here when the compiler complains it cannot find a host function. |
| `taskController.ts` | `TsumTaskController` — the cooperative scheduler. `newTask(name, fn, interval, runTimes)` registers work; `loop()` repeatedly runs the highest-priority *due* task. Ties break toward the longer interval, then the least-recently-run. Also holds the `errorCount` guard. |
| `state.ts` | The two script-wide globals `ts` (the live `Tsum`) and `gTaskController`. |
| `utils.ts` | Four small helpers used everywhere: `isSameColor` / `absColor` (colour comparison, the backbone of all detection), `nowTime`, and `log` / `debug`. `log` prefixes every line with the running heart counters and is throttled by a 10 ms sleep. |
| `data.ts` | **All tuning constants and coordinates — no logic.** `Config` (tsum width, resize sizes, debug flag), `Button` (~50 named screen coordinates, at a nominal 1080×1920), `Page` (colour fingerprints for every screen the script recognises), `TiaraLayouts` / `TiaraMinnieConfig`, and `GameBubbleConfig`. Most "the script taps the wrong spot" fixes are edits to this file alone. |
| `logs.ts` | `Logs` (English) and `LogsTW` (Traditional Chinese) — the user-visible message strings. `start()` picks one based on the language setting and hands it to the `Tsum` constructor, which stores it as `ts.logs`. |
| `messaging.ts` | Push-notification plumbing for the paid-plan integration: `checkCanSendMessage` / `canSendMessage` / `sendMessage`, rate-limited to one message per hour. Also `checkFunction`, used to feature-detect host APIs that may not exist on every Robotmon build. |
| `pathfinding.ts` | Board detection and chain planning, no tapping. `findTsums` and `findGameBubbles` locate circles via a grayscale Hough pass (grayscale deliberately, so no colour is filtered out before detection), `classifyTsums` then samples colour from an HSV copy and clusters it; `buildTsumNeighbors` / `findTsumComponents` / `findLongestTsumPath` build and search the connectivity graph, and `calculatePaths` ranks the results. `findChainAtTouch` is the Click Assist entry point. |
| `tsum.ts` | The `Tsum` object — the bulk of the script. Constructor and `init` (screen geometry, resolution detection), the low-level I/O wrappers (`screenshot`, `tap`, `linkTsums`, the coordinate-space converters), page navigation (`findPage`, `matchesPage`, `goFriendPage`, `goGamePlayingPage`, …), and the long-running **tasks**: `taskPlayGameQuick`, `taskReceiveOneItem`, `taskSendHearts`, `taskAutoUnlockLevel`, `taskAutoBuyBoxes`, `taskWatchdog`. Also the sender-portrait record keeping. |
| `skills/` | One file per skill plus the dispatcher — see [below](#skills--srcskills). |
| `clickAssist.ts` | The Click Assist mode: instead of playing on its own, the script reads the raw Linux touch event stream (`getevent` via `execute`) and draws the chain wherever the user taps. `findTouchDevice`, `pollTouchDown`, `taskClickAssist`. Mutually exclusive with auto-play. |
| `dialogs.ts` | Android *system* dialogs (root-detection warnings, permission prompts) — the ones that are not part of the game and can appear over it. Detects a dialog by its panel colours, finds its buttons, and falls back to parsing `uiautomator` XML when the colour pass is ambiguous. Also the `newStallGuard` / `checkStall` progress watchdog. |
| `index.ts` | The entry point, and *only* that: `start(settings)` maps every setting onto the `Tsum` instance and registers the task set, `stop()` tears it down, and `genRecordTable()` renders the heart-log HTML report. Keep it thin — this file being fat is what caused the merge accident described above. |
| `settings.ts` | **Compiled separately** (`tsconfig.settings.json` → `build/settings.js`); not part of the game bundle. The settings UI: the `settings` array declaring every option, the jQuery rendering, localStorage persistence, and `genStartCommand` which serialises the form into the `start({...})` call. Adding a setting means editing here *and* reading it in `index.ts`. |

Non-TypeScript files: `index.html` (the settings page shell, inlined at build
time), `index.css`, `build.sh` / `build.ps1`, `deploy.ps1`.

## Skills — `src/skills/`

`skillCore.ts` owns everything common to every skill: the gauge read
(`checkSkillReadiness`), the fever hold-off, the activation tap(s), and the
`useSkill` dispatcher. Each remaining file is one skill, registering a handler:

```ts
registerSkill({
  types: ['block_moana_s'],        // skillType values from the settings dropdown
  afterActivate: function(ts) {    // the choreography, after the button is tapped
    ts.clearAllBubbles(2500, 50);
  }
});
```

Handlers may also declare `beforeActivate` (work that must land *before* the
skill fires, e.g. waiting for the board to settle), `usesSecondButton` (Pair
Tsum's two halves) and `bareTapActivates` (burst skills, where a tap is the whole
activation — this is what lets the play loop fire them blind between chains).
Returning `false` from `afterActivate` reports "did not fire" to the caller.

Every skill file is a **leaf**: nothing outside `src/skills/` references its
symbols, and it is reached only through `SkillHandlers[skillType]` at runtime.
An unregistered `skillType` falls back to `skillRandomizeAndWait`; `no_skill`
short-circuits before dispatch.

**To add a skill:** create `src/skills/<name>.ts` with a `registerSkill` call,
add it to the `files` list in `tsconfig.json` (after `skillCore.ts`), and add the
matching dropdown entry in `settings.ts`.

## How the layers fit together

```
  index.ts            start() / stop()          entry point
      │
      ▼
  taskController.ts   schedules ──────────────► tsum.ts  task* methods
                                                   │
                        ┌──────────────────────────┼──────────────────────┐
                        ▼                          ▼                      ▼
                  pathfinding.ts             skills/                 dialogs.ts
                  what to link          which skill, how          system popups
                        │                          │                      │
                        └──────────────┬───────────┘──────────────────────┘
                                       ▼
                              data.ts  ·  logs.ts  ·  utils.ts
                          coordinates   strings    colour maths
                                       │
                                       ▼
                              Robotmon host API
                        (declared in globals.d.ts)
```

Dependencies point downward. `data.ts`, `logs.ts` and `utils.ts` are leaves that
know nothing about the rest; `tsum.ts` is the hub that everything above the
middle row goes through.

The couplings that are easy to miss:

- **`tsum.ts` → `skills/`** is not just `useSkill`. `link()` calls
  `skillBareTapActivates` to decide whether to fire blind after each chain, and
  the play loop calls `fanWouldBeWasted` and `maybeAutoTapSkill`. All four live
  in `skillCore.ts`, which is why it stays in the main bundle rather than being
  a leaf like the individual skills.
- **`data.ts` owns Tiara's tables, `skills/tiaraMinniePlus.ts` owns its logic.**
  Same for `logs.ts` and the Tiara log strings. Data and behaviour are split
  deliberately: tuning a threshold should not mean opening the skill file.
- **`settings.ts` ↔ `index.ts`** is a string contract. A setting key typed in one
  place and not the other fails silently at runtime, not at compile time.

## Building

```bash
npm run typecheck      # tsc --noEmit — the game bundle only, not settings.ts
npm run build          # → dist/index.js, dist/index.html, index.zip
npm run buildAndAdb    # build, then adb push to the device
npm run adb            # push an existing dist/ without rebuilding
```

`build.ps1` is the PowerShell equivalent of `build.sh`. To type check the
settings UI as well, run `npx tsc -p tsconfig.settings.json --noEmit`; the full
build does compile both.

**TypeScript is pinned to 6.x, deliberately.** TypeScript 7 removed `target:
ES5`, `outFile` and `module: none` — and this project needs all three: the
Robotmon runtime is [ES5-only](../../README.md), and the whole no-imports design
depends on `outFile` concatenation. The `"ignoreDeprecations": "6.0"` line in
both tsconfigs is what keeps those options legal. Moving to TS 7 would mean
replacing both the bundler and the downleveller (e.g. esbuild for bundle + ES5,
with tsc reduced to type checking) — a build-system migration, not a config edit.

## Where to start

| Task | Look at |
|:--|:--|
| Script taps the wrong place | `data.ts` → `Button` |
| Script does not recognise a screen | `data.ts` → `Page`, then `Tsum.matchesPage` in `tsum.ts` |
| Chains are poor / short | `pathfinding.ts` → `calculatePaths`, `findLongestTsumPath` |
| A skill misfires | `src/skills/<name>.ts`, then `useSkill` in `skillCore.ts` |
| Add a new skill | `src/skills/`, `tsconfig.json`, `settings.ts` dropdown |
| Add a setting | `settings.ts` (`settings` array) **and** `index.ts` (`start`) |
| Add a background job | `index.ts` → `gTaskController.newTask`, task body in `tsum.ts` |
| Script gets stuck on a popup | `dialogs.ts` |
| Wrong/missing log text | `logs.ts` (both `Logs` and `LogsTW`) |

## Debugging

- `Config.debugLogs` (the "Debug logs" setting) enables `debug()` output.
- `ts.debug` (the "Debug game" setting) additionally saves annotated screenshots
  to `<storage>/tmp/`.
- `adb logcat | grep Robotmon:` shows script output on the host.
- `tools/fps-memlog.ps1` samples emulator FPS and memory over time — the tool
  for investigating long-session slowdowns.
- Detector thresholds are best tuned offline against saved screenshots on the
  PC (turn on "Debug game" to collect them) rather than by trial and error on
  the device.
