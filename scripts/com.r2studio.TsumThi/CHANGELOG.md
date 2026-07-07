# Changelog

All notable changes to the TsumBeta script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


## [Unreleased]

### Added
- "Auto-tap skill when ready" setting (off by default): polls the skill button every 0.5s — including between chains while linking — and fires the skill the moment the gauge is ready, instead of only checking at the end of each board-scan cycle. Fixes skills sitting ready for several seconds before being tapped. Uses the normal activation path, so every skill type's choreography is handled as usual.

### Changed
- "Tsum app restart frequency (hours)" now adjustable in 1-hour steps (was 6). The Tsum Tsum app itself leaks over long sessions — FPS sinks as skills are used and only an app restart restores it — so restarting every 1-2 hours is the effective mitigation, which the 6-hour granularity couldn't express.

### Fixed
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
