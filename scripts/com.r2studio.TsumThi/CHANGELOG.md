# Changelog

All notable changes to the TsumBeta script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


## [Unreleased]

### Added
- Skill type "Tiara Minnie+". Her skill is a mini-game: Minnie appears with a present in a thought bubble, the bubble clears, and 2-6 presents drop onto the board — the one she was dreaming of has to be tapped. The bubble is shown once per activation, so each activation is a single pick; a correct one adds a present to the next activation's screen, up to six, and a wrong one puts it back to two. Both halves are read by cropping *fixed, known boxes* and comparing the pictures directly, because nothing here actually needs searching for: the bubble is drawn in the same place every time, and the presents land on the same centres for a given count.
  - **Where things are.** The five present layouts (2 through 6) are a table of logical centres, checked against the reference frames — detected blob centres agreed with the table within ~20px everywhere. The bubble's present is a single fixed crop at (252, 872); it measured (250-255, 870-875) on every frame where it could be isolated at all.
  - **How the pick is made.** Every centre from every layout is scored against the bubble crop and the best one is tapped. **The number of presents on screen is never determined** — which matters, because with 20 candidates scored together a miscount cannot send the tap anywhere, and two centres from different layouts sitting on the same present are both right answers. Offline this tapped the correct present in all 20 frame/design pairs, and kept doing so with every centre shifted by up to 10px in any direction.
  - **How two pictures are compared.** Each crop is reduced to a 12x12 grid of cells carrying a saturation-weighted hue vector (so the 179->0 wrap cannot average a red into a cyan), saturation and value. Cells are compared *only where the bubble's present is*, which drops the dark tsums behind a board present and the white cloud behind the bubble one alike. Each cell's difference is divided by a spread and clipped, so the score counts clearly-wrong cells instead of averaging small ones away — worth roughly triple the margin of a plain mean (0.095 to 0.278).
  - Direct comparison is what makes the colour-swapped designs separable: the set contains a teal bag with a pink bow and a pink box with a teal bow, which are identical in aggregate colour and differ only in *where* each colour sits. Comparing cell by cell, in place, that difference is the whole signal rather than an inconvenience.
  - **Telling the two screens apart.** The per-round signal is the cloud: the fraction of pale pixels around the bubble read 0.486-0.500 with a bubble up and 0.011-0.091 with presents up, so the threshold sits in a gap four times wider than either spread. That one test drives the whole loop — wait for a cloud, read the present, wait for the cloud to go, pick — and a bubble that never arrives is what says the mini-game is over.
  - **What stops a bad tap.** A tap needs the score to clear a floor *and* the winner to beat everything elsewhere by a margin. The score alone cannot do it: a green template scores 0.461 against ordinary green tsums, so a board with no presents on it would clear any floor low enough to keep the real matches. The margin does separate them, because a bare board has no standout winner — it reached 0.096 at best, where a real choice screen never scored under 0.278. Beyond about 20px of positional error both gates fail and the script declines to tap rather than tapping wrongly, which the log says.
  - The same centre also has to win twice running, and matching only starts once the cloud has gone plus a lead, so the hand-over frames are never scored. **The game clock is stopped while the presents are up**, which is what makes all of that affordable; the loop leaves the moment it is convinced.
  - Play resumes the moment the present is tapped. The bubble is only shown once per activation, so an activation is exactly one pick and there is nothing to wait for afterwards. Two things had been adding several seconds there:
    - The activation reported itself as having fired, and the play loop runs `while (useSkill())`. The gauge still reads active through the outro, so it went straight back in for another settle wait, lead-in and bubble wait — about six seconds of standing still before the missing bubble ended it. It now always reports "did not fire"; for a skill that takes seconds of choreography an immediate second go is never right, and a gauge that really is full is picked up by the next board-scan cycle.
    - The cloud check that those waits poll on ran at the matching resolution: a 420x420 grab plus a 7px blur per look, which made each poll slower than the interval it was polling on. It has its own 120x120 unblurred capture now — the test only asks whether a big pale blob is on screen, and it still separates 0.451 against 0.056.
  - Waits for the board to stop moving before activating. Tapping a present detonates an area of the board, and the play loop clears a chain (sometimes working the fan too) immediately before the skill fires — so at activation the tsums are nearly always mid-fall and the blast catches very few of them. How long settling takes depends on how much was cleared, so it is measured rather than guessed: a coarse brightness fingerprint of the board is taken repeatedly and compared, and the skill goes off once two readings running come back quiet. It fires anyway on timeout, since a late skill beats a skipped one, and logs the motion it was still seeing.
  - Level-independent, and indifferent to the 2->6 progression: the presents grow in number across activations as picks land, and since every layout is scored on every activation there is no streak state to track or to get out of step with the game.
  - The log names what it is looking for in colours rather than numbers — "pink bow / teal body" — plus where it tapped, the score, the margin, and which layout the winning centre came from. With "Debug game" on it also reports what it is waiting on while the presents land.
- Game bubbles are popped the moment a chain of 5+ lands, for Tiara Minnie+ — her bonus makes a bubble popped as a chain goes off clear a bigger area, and the play loop's existing bubble handling is a periodic ~50-tap blind sweep, far too slow to land inside a chain. Bubbles are circles like tsums, only much bigger, so they fall out of the same grayscale Hough pass `findTsums` already runs, at a larger radius, on the capture the board scan already holds. Positions are worked out at scan time and remembered, so popping one is taps only: no screenshot mid-batch, which would stall the link cadence and the combo timer with it. Bubbles are large and drift slowly, so a position a second old still lands, and a tap that misses costs nothing (a tap is not a drag, so it links nothing and the game ignores it). The tap count is capped so a frame full of false circles cannot become a burst of taps.
  - The circle radius range for this is **reasoned, not measured** — there is no saved frame with a bubble on the board to calibrate against, unlike everything else here. It wants a screenshot and a pass through the same offline treatment.
- `tools/tiara-calibrate.ps1`, which replays the matcher against saved screenshots. It mirrors the device path exactly — render the play square at capture size, box-blur, convert to HSV, point-sample each cell — so its scores are the scores the phone computes, and everything above was measured with it against `doc/screenshots/TiaraMinnie` (five choice frames holding 2-6 presents, six bubble frames, six distinct designs, each design appearing as both a template and a target):
  - Correct present tapped 20/20; worst winning margin 0.278; lowest true-match score 0.582 against 0.364 for the best match to a design that was not on screen.
  - Bubble detection: every bubble frame above 0.486, every choice frame below 0.091.
  - `-Jitter` re-runs with the centres shifted, which is how the "safe up to 10px, abstains past 20px" figures were established. `-Sweep` walks one setting at a time; grid resolution 10-24, capture width 270-720, saturation floor 40-100 and crop scale 0.85-1.1 all held at 20/20, so none of these sits on a knife edge.
  - Re-run it after a game update to confirm the layout table and thresholds still hold.
- "Auto-tap skill when ready" setting (off by default): polls the skill button every 0.5s — including between chains while linking — and fires the skill the moment the gauge is ready, instead of only checking at the end of each board-scan cycle. Fixes skills sitting ready for several seconds before being tapped. Uses the normal activation path, so every skill type's choreography is handled as usual.

### Changed
- "Tsum app restart frequency (hours)" now adjustable in 1-hour steps (was 6). The Tsum Tsum app itself leaks over long sessions — FPS sinks as skills are used and only an app restart restores it — so restarting every 1-2 hours is the effective mitigation, which the 6-hour granularity couldn't express.

### Fixed
- The fan could fire with the skill gauge already full, then fire again and again. Two fan sites exist in the play loop: the periodic one deliberately skips when the skill is ready ("useSkill() will fire it next, so the fan would just be wasted on tsums about to be cleared"), but the stuck-board one — six barren scans in a row — had no such guard. It shuffled the board and `useSkill()` ran immediately after, so the skill activated onto tsums still being tossed about. That matters most for Tiara Minnie+, whose pick detonates whatever is under it, but it wastes any skill. It also fed itself: a churning board scans as few paths, which is the very thing that increments the counter, so the fan kept re-triggering. Both sites now share one readiness check.
- That same counter never reset on a productive scan, so six barren scans spread anywhere across a game would eventually fire the fan on a board that was playing perfectly well. It now counts consecutive barren scans, which is what "the board is stuck" was meant to mean.
- Startup got stuck forever on the root-detection warning because "PERMIT" was rarely pressed. That dialog is a native Android AlertDialog, laid out in device pixels over the whole screen, while the `RootDetection*` fingerprints and their tap coordinates live in the game's logical 1080x1920 letterbox space — the two only agree on an exactly 9:16 display, and even there the recorded coordinates belong to one specific emulator and dpi, so a matching fingerprint could still put the tap next to the button. The dialog is now handled structurally instead: find the light panel floating over the dimmed background in device pixels, find its button row, and tap the rightmost label (Android orders the button bar `[negative][neutral][positive]`). Where `uiautomator` is available, the button's identity is read from Android (`android:id/button1`) as well, which also covers stacked button bars and non-English labels. Every attempt is verified by re-checking the screen, and the per-emulator coordinates are kept only as a last-resort hint. Nothing in the new path depends on resolution, dpi, emulator or game language.
- The endless part of that loop: an unrecognized screen went to `exitUnknownPage()`, whose blind `DPAD_DOWN` + `ENTER` can activate the dialog's *negative* button — "REFUSE" closes the game, "Auto launch app" starts it again, the dialog comes back. Native dialogs are now dismissed properly before those keycodes are ever sent, and the dpad path is only used as a last resort when the script is allowed to relaunch the game.
- The navigation loops (`goFriendPage`, `goGamePlayingPage`, `goTsumsPage`) could only exit by reaching their target page, so any screen they couldn't leave wedged the whole script: the play task never returns, which means the task controller never gets to run anything else either — including the app-restart task. They now escalate when the same screen keeps coming back: check for a native dialog after ~15s, restart the game app after ~40s (up to 3 times, only with "Auto launch app" on), then log and back off. A full-resolution screenshot of what the script couldn't read is saved to `<storage>/tmp/` (at most one per 5 minutes) for calibration.
- Blue tsums were often missed by the board scan, so blue chains went unplayed. `findTsums` used to detect tsum circles on an HSV colour mask, and the mask's `outRange` bounds filtered blue out before circle detection ever ran. Detection now runs on a plain grayscale copy (colour-agnostic, so every tsum is found), and colour is sampled from the HSV image and clustered separately as before. `classifyTsums` now assigns each point to the *closest* colour cluster within the merge threshold instead of the first match, which keeps near-identical blues from bleeding into the wrong cluster. (Ported from TsumBeta v82 "rewrite find tsum / fix blue tsum detection"; the pathfinding rewrite in that commit was not ported — TsumThi's graph/longest-path search already supersedes it.)
- False "Game Over" during long burst-skill animations (e.g. Dapper Hat Mickey): the play loop declared game over after ~5s of unrecognized screen, but the GamePlaying check reads HUD pixels on the pause/fan buttons, which a long skill animation covers while the game is still running — the script then stalled navigating an "unknown" screen mid-game. Game over now requires positive confirmation: the loop keeps polling until the HUD returns (resume playing) or a known out-of-game page appears (the score tally always lands on the results page), falling back to the old assumption only after a 20s grace window of unrecognized screen.
- Native-memory leaks that degraded emulator FPS over long sessions:
  - Sender portraits recorded by "Record sender" were all held in native memory for the whole session and reloaded in full on every start, growing without bound with each new friend on record. Now only the 200 most recently seen senders are kept in memory as match candidates (on-disk PNGs and record.txt stats are unaffected).
  - The board scan (`findTsums`) released its four working images without exception protection; because the task controller swallows task errors and retries, any recurring native error silently leaked two full board images per scan. All scan images are now released in `finally`.
  - `recognizeSender` and the record-table generator leaked their working image if a native call threw mid-recognition.


## [v82] - 2026-06-10

### Added
- "Experimental Tsum Connections" setting (off by default — still unreliable, kept for further development): reworked color recognition addressing boards where similar-colored tsums (e.g. green alien + orange car) were clustered as one type, producing mixed-color chains the game rejects. When enabled:
  - Hue differences are weighted 2x in the color distance, treated as circular (red boundary), and scaled by saturation so white/gray/black tsums aren't classified on hue noise.
  - Greedy clusters are refined with a k-means pass capped at the known number of tsum types on the board (5, or 4 with the 5>4 item); detections too far from every cluster (coins, score bubbles, glows) are rejected as noise.
  - Tsum colors are sampled as the median of 9 points (center + ring) inside the tsum body under a light 7px blur, instead of a 5-pixel average under a 22px blur.
  - Color sampling probes for the fastest pixel-read path the runtime supports and logs the result on the first scan: a native median filter (one center read per tsum), batched `getImageColors` reads (one native call per board), or per-pixel reads as the universal fallback.
  - A "Tsum color recognition tuning" group (hue weight, hue/saturation similarity bonuses, color match distance, color sample blur) fine-tunes the above.
- "Chains per board scan" setting (default 6, as before): each linked chain refreshes the combo timer, so linking more chains per scan leaves fewer scan gaps where the combo can drop — at the risk of late chains missing after the board shifts.
- With "Debug game" enabled, each board scan logs the HSV center, point count, and pairwise distances of every color cluster, plus the path calculation time.


## [v81] - 2026-05-13

### Fixed
- JP: Close "Today missions" if open


## [v80] - 2025-12-19

### Fixed
- Current JP's princess pickup capsule changed colors which broke the auto buy functionality.


## [v79] - 2025-12-10

### Fixed
- Additional -1 and +1 buttons had effect on following settings. 
- JP auto buy did not work correctly with high fps settings.

### Changed
- CLY respects chosen skill level and only shoots as many times as the skill level allows.

### Added
- When `Auto Launch Tsum App` is enabled, one can schedule a TsumTsum app restart at a specific interval.


## [v78] - 2025-11-01

### Fixed
- Fixed "Auto launch app" for Android 11+ (currently works with MuMu player).


## [v77] - 2025-09-25

### Fixed
- Auto buy did crash if loading of Tsum store page took more than 4 seconds. Now up to 10 seconds is allowed.

### Changed
- Immediately leave slow-mode on script start if game is in some well-known area.


## [v76] - 2025-07-06

### Fixed
- Auto buy counted wrong in new Tsum Tsum Store.
- Auto buy got stuck when all boxes were drawn but the counter was not down to zero.

### Added
- New "Bubble Burst" skill. This behaves like the "Burst" skill, but always clears bubbles after the skill in a slower way.
- New "Lightning McQueen+" skill.

### Changed
- "Auto buy" now uses the box selected by default. There might be an option to make it pre-select "the middle" box in a later version, but that logic already causes problems in the JP version when there were 4 (!) boxes to draw from. 


## [v75] - 2025-03-01

### Fixed
- NetworkTimeout page detection was too generic so it falsely categorized the Events Info screen from March 2025 as that which made the script stall.

### Changed
- Improved skill of Cinderella by changing the clearance pattern.
- Improved skill of Captain Lightyear by delaying bubble clearance after skill which effectively clears more Tsums.


## [v74] - 2025-01-23

### Fixed
- JP Tsum Tsum update broke "Receive All Hearts". As there are now more features, "Receive All Hearts" now respects the "Skip Ruby" option. 
- JP Tsum Tsum update broke "Auto buy Tsums".
- "Auto buy Tsums" sometimes missed some buys when counting down.

### Changed
- Reduced the amount of regular logging. Most of the logs like "Recognized Tsums" are not useful in non-debug mode and might increase resource demand.


## [v73] - 2024-12-19

### Fixed
- After a game crash, the script now slows down clicks until fully loaded as soon as the "root detected" screen is found. This should minimize problems when clicking away the news dialogs after a full game startup.
- Chinese descriptions were often created with Google Translate, which probably often gave bad results. The worst translations got now probably fixed.


## [v72] - 2024-12-04

### Added
- Added option to increment by 1 for more precise adjustments for settings that previously only supported increments by multiples of 2/5/10.


## [v71] - 2024-10-31

### Fixed
- Sending hearts crashed in TsumTsum Ver: 10.11.0.
- Unlocking Tsum levels did not work in JP after adding a new Tsum sort option.


## [v70] - 2024-08-16

### Added
- Skill: Captain Lightyear

### Changed
- First clicks on script start do now always have pauses until the friends page is reached. This should reduce the game ending in an infinite "Loading" dialog if event notifications get clicked away too fast. This attempt is not very solid, but a better implementation will need time, so this topic stays in the backlog.
- Mail processing speed increased. This was slowed down in v62 to improve stability, but time has shown that this does not improve the game stability.


## [v69] - 2024-07-27

### Fixed
- Monitor missed stuck sender in certain cases, so the script now checks that a running task had at least two relevant positive state changes before calling the external monitor.

### Added
- Detection of "Extra update" page.
- Recording hearts is now possible when "Skip first person" is active (in case you cannot or don't want to disable ingame ads).

### Changed
- The output file of "Export HTML (Excel)" has been redesigned to make it much easier to work with.


## [v68] - 2024-06-30

### Fixed
- "script error" when "auto play" was active and all "Wait time (min) before repeat" values were greater than 1


## [v67] - 2024-06-29

### Added
- Allow script to repeatedly call a configurable HTTP endpoint. This allows keeping track if the script is unhealthy for
  some time and for example react on that by restarting the virtual machine where the script runs in.

### Fixed
- After Int'l UI change, the new Ranking page could not be found anymore.
- Tsum Store now also works if ads are available.


## [v66] - 2024-02-27

### Fixed
- Auto-buying worked only when Tsum Store missions were active.
- Skill for Cabbage Mickey sometimes missed Mickey.
- Unlock level didn't detect 3rd lock icon on 480x800 screen resolution.
- Highscore page detection was incorrectly detected on new JP startup popup.

### Added
- Allow script to defer skill activation if fever is active and ends within X seconds 
  (X can be defined in the settings).
- "Claim All" when retrieved hearts do not contain coins anymore. When 3 hearts without coins were collected, the 
  mailbox will be refreshed and new mails will be retrieved until 3 hearts without coins were collected again.
  This will be repeated until 5 or fewer mails were opened before hearts without coins were received. Then "Claim All"
  will be pressed. Intended for when script did not run for more than an hour.
- Documentation of the script settings in the [README](README.md).
- Root detection on Samsung A20.

### Changed
- Robotmon control panel opens automatically when script is loaded.
- Opening the Robotmon script settings now stops script execution.
- Changed minimal screenshot resolution of pages to a width of 360px in order to make page navigation more safe.
- If script gets started while a game is already open in "pause" mode, the script will continue playing the game instead 
  of leaving it.


## [v65] - 2024-02-12

### Fixed

- v64 reintroduced that the sender got stuck on Bingo and Event cards. The fix was to again sharpen game
  detection. This time, the color matching was also tested with 480x800 screen resolution to not
  break auto gameplay again.
- Auto gameplay did sometimes quit while playing due to falsely matching "Root Screen" detection.
- Receiving an item set blocked further script processing due to another OK button position.
- Auto-buying pickup capsules didn't finished when capsule was cleared.

### Added

- New skill "Cabbage Mickey".
- New skill "No Skill" which just ignores any active skill buttons. Useful for Fever missions where no fever tsum 
  is allowed, so that skill activation can be timed exactly after fever time to immediately start a new fever time.


## [v64] - 2024-01-24

### Fixed

- Auto game play didn't work with screen resolution of 480x800px anymore (introduced with TsumBeta v62). 
  This _might_ reintroduce the bug that the game gets stopped short before the end.


## [v63] - 2024-01-09

### Added

- Experimental: Auto buy boxes

### Fixed

- Too early game end on last seconds (v62 didn't fix it completely, maybe this one)
- "Send hearts" sometimes broke after initial scroll up to the top
- Improved root detection screen on auto game start 


## [v62] - 2024-01-03

### Added

- "Root Detection" pages to allow full game start.

### Changed

- Tsum levels are auto unlocked only if autoplay is active, and then directly before the game starts.
- Added some more wait times while receiving hearts. These should not be notable, but make the script less aggressive. 

### Fixed

- Script can now start the Int'l version, not just the JP one. 
  Which version is started is based on the setting "Japan version?".
- Game start with Robotmon sometimes made the game stuck (permanent "loading" screen on 
  event notifications), so pauses between taps now take longer on startup to better handle daily event 
  notifications.
- Game was sometimes canceled in the last five seconds due to the "blue'ish" flickering.
- Most event cards now won't block script progress anymore.
