# Changelog

All notable changes to the TsumBeta script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v74] - tba

### Fixed
- JP Tsum Tsum update broke "Receive All Hearts". As there are now more features, "Receive All Hearts" now respects the "Skip Ruby" option. 


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
