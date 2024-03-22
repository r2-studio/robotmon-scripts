# Changelog

All notable changes to the TsumBeta script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


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
