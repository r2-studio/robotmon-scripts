#Requires AutoHotkey v2.0
; ---------------------------------------------------------------------------
; Tsum Tsum script pause/resume hotkey (PC side of "Option 2").
;
;   Ctrl+Alt+Z  -> toggle PAUSE / RESUME
;   Ctrl+Alt+X  -> show what the file currently contains (debug)
;
; This writes "1" (pause) or "0" (resume) into the sentinel file via MuMu's
; shared folder on the host filesystem -- no adb involved. MuMu mirrors the
; shared folder into the emulator, where the running script polls the file and
; pauses between link cycles.
;
; Setup:
;   1. Install AutoHotkey v2 (https://www.autohotkey.com/).
;   2. Make sure the host PAUSE_FILE below maps to the device path the script
;      logs on start: "[Pause] keypress-pause watching file: <PATH>"
;      (host ...\MuMuSharedFolder\Download\Robotmon  <->  device /sdcard/Download/Robotmon)
;   3. Double-click this file to run it, then press Ctrl+Alt+Z.
; ---------------------------------------------------------------------------

; ==== Config =================================================================
PAUSE_DIR  := EnvGet("USERPROFILE") "\OneDrive\Documents\MuMuSharedFolder\Download\Robotmon"
PAUSE_FILE := PAUSE_DIR "\tsum_pause"
; ============================================================================

; ==== Tilt (gyroscope) config ===============================================
; MuMu Player 12 can't receive a tilt via ADB or the in-guest script -- the only
; channel in is MuMu's built-in *gyroscope* keymap. In MuMu's keymap editor add
; a Gyroscope/Tilt control and bind its four directions to the keys below. The
; Ctrl+Alt+T hotkey then holds the right key(s) for TiltAngle, so the device
; "tilts" while toggled on (e.g. to herd tsums into a corner for Jedi Luke).
;
; TiltAngle is a compass-style heading in degrees, clockwise from "up":
;   0 = up, 90 = right, 180 = down, 270 = left, 45 = up-right, ...
; It snaps to the nearest 45 deg; diagonals hold two keys at once.
;   Ctrl+Alt+T          -> toggle tilt on/off
;   Ctrl+Alt+[  /  +]   -> rotate the angle by -45 / +45 (live)
;   Ctrl+Alt+R          -> panic-release (always works, even if MuMu lost focus)
global TiltAngle    := 225          ; default: down-left
global TiltKeyUp    := "Up"         ; must match the keys you bind in MuMu's
global TiltKeyDown  := "Down"       ; gyroscope keymap (arrow keys by default)
global TiltKeyLeft  := "Left"
global TiltKeyRight := "Right"
; If MuMu ignores synthetic keys (the same Qt5 issue that blocks Send clicks),
; try "Event" or "Play"; if none register, MuMu needs real hardware keys.
global TiltSendMode := "Input"      ; "Input" | "Event" | "Play"

global TiltOn := false
global TiltHeldKeys := []
; ============================================================================

Paused := false

WriteVal(val) {
    global PAUSE_DIR, PAUSE_FILE
    if !DirExist(PAUSE_DIR)
        DirCreate(PAUSE_DIR)
    f := FileOpen(PAUSE_FILE, "w")          ; truncate + write
    if !IsObject(f)
        throw Error("Could not open " PAUSE_FILE)
    f.Write(val)
    f.Close()
}

ShowTip(msg, ms := 2000) {
    ToolTip(msg)
    SetTimer(() => ToolTip(), -ms)
}

TogglePause() {
    global Paused
    Paused := !Paused
    val := Paused ? "1" : "0"
    try {
        WriteVal(val)
        ShowTip(Paused ? "Tsum: PAUSED" : "Tsum: RESUMED")
    } catch as e {
        ShowTip("WRITE FAILED:`n" e.Message, 5000)
    }
}

; ----- Tilt (gyroscope) helpers ---------------------------------------------
; Map a compass angle (snapped to 45 deg) to the gyro key(s) to hold.
TiltKeysForAngle(angle) {
    global TiltKeyUp, TiltKeyDown, TiltKeyLeft, TiltKeyRight
    snapped := Mod(Round(angle / 45) * 45 + 360, 360)
    keys := []
    if (snapped = 315 || snapped = 0 || snapped = 45)
        keys.Push(TiltKeyUp)
    if (snapped = 135 || snapped = 180 || snapped = 225)
        keys.Push(TiltKeyDown)
    if (snapped = 225 || snapped = 270 || snapped = 315)
        keys.Push(TiltKeyLeft)
    if (snapped = 45 || snapped = 90 || snapped = 135)
        keys.Push(TiltKeyRight)
    return keys
}

TiltSend(spec) {
    global TiltSendMode
    switch TiltSendMode {
        case "Event": SendEvent(spec)
        case "Play":  SendPlay(spec)
        default:      SendInput(spec)
    }
}

; Release whatever is held, then press and hold the keys for the current angle.
ApplyTilt() {
    global TiltAngle, TiltHeldKeys
    ReleaseTilt()
    TiltHeldKeys := TiltKeysForAngle(TiltAngle)
    for _, k in TiltHeldKeys
        TiltSend("{" k " down}")
}

ReleaseTilt() {
    global TiltHeldKeys
    for _, k in TiltHeldKeys
        TiltSend("{" k " up}")
    TiltHeldKeys := []
}

ToggleTilt() {
    global TiltOn, TiltAngle
    TiltOn := !TiltOn
    if (TiltOn) {
        ApplyTilt()
        ShowTip("Tilt ON @ " TiltAngle " deg")
    } else {
        ReleaseTilt()
        ShowTip("Tilt OFF")
    }
}

; Only enable the hotkeys while the MuMuPlayer emulator window is the active
; window. Match on the process exe (MuMuNxDevice.exe) since the window title
; is just "Android Device".
#HotIf WinActive("ahk_exe MuMuNxDevice.exe")

; Ctrl+Alt+Z -> toggle pause
^!z:: {
    global Paused
    Paused := !Paused
    val := Paused ? "1" : "0"
    try {
        WriteVal(val)
        ShowTip(Paused ? "Tsum: PAUSED" : "Tsum: RESUMED")
    } catch as e {
        ShowTip("WRITE FAILED:`n" e.Message, 5000)
    }
}

~^LButton:: {
    global Paused
    if (Paused == "0") {
        TogglePause()
        Sleep(800)
        TogglePause()
    }

}

; Ctrl+Alt+X -> read the file back so you can confirm what's there
^!x:: {
    global PAUSE_FILE
    val := FileExist(PAUSE_FILE) ? Trim(FileRead(PAUSE_FILE), " `t`r`n") : "(missing)"
    ShowTip("tsum_pause = [" val "]", 4000)
}

; Ctrl+Alt+T -> toggle gyroscope tilt (holds MuMu's gyro keymap keys)
^!t:: ToggleTilt()

; Ctrl+Alt+[ / Ctrl+Alt+] -> rotate the tilt angle by -45 / +45 (live)
^![:: {
    global TiltAngle, TiltOn
    TiltAngle := Mod(TiltAngle - 45 + 360, 360)
    if (TiltOn)
        ApplyTilt()
    ShowTip("Tilt angle: " TiltAngle " deg")
}
^!]:: {
    global TiltAngle, TiltOn
    TiltAngle := Mod(TiltAngle + 45, 360)
    if (TiltOn)
        ApplyTilt()
    ShowTip("Tilt angle: " TiltAngle " deg")
}


#HotIf

; Ctrl+Alt+R -> panic-release all held tilt keys. Global (no #HotIf) so it works
; even if MuMu lost focus while a tilt was held, preventing stuck keys.
^!r:: {
    global TiltOn
    ReleaseTilt()
    TiltOn := false
    ShowTip("Tilt released")
}
