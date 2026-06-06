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

; Ctrl+Alt+X -> read the file back so you can confirm what's there
^!x:: {
    global PAUSE_FILE
    val := FileExist(PAUSE_FILE) ? Trim(FileRead(PAUSE_FILE), " `t`r`n") : "(missing)"
    ShowTip("tsum_pause = [" val "]", 4000)
}

#HotIf
