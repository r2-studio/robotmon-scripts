#Requires AutoHotkey v2.0
; ---------------------------------------------------------------------------
; Tsum Tsum script pause/resume hotkey (PC side of "Option 2").
;
; Press Ctrl+Alt+P to toggle the script between PAUSED and RESUMED. It works by
; writing "1" (pause) or "0" (resume) into a sentinel file on the device over
; adb; the running script polls that file ~2x/second and pauses between tasks.
;
; Setup:
;   1. Install AutoHotkey v2 (https://www.autohotkey.com/).
;   2. Make sure `adb devices` lists your emulator/phone.
;   3. Set PAUSE_FILE below to the exact path the script logs on start:
;        "[Pause] keypress-pause watching file: <PATH>"
;   4. Double-click this file to run it, then use Ctrl+Alt+P.
; ---------------------------------------------------------------------------

; ==== Config =================================================================
ADB        := "adb"     ; full path to adb.exe if it isn't on your PATH
SERIAL     := ""        ; e.g. "emulator-5554" to target one device; "" = default
PAUSE_FILE := "/sdcard/Download/Robotmon/tsum_pause"  ; <-- match the logged path
HOTKEY_TIP := true      ; show a brief on-screen PAUSED/RESUMED tooltip
; ============================================================================

Paused := false

RunAdb(args) {
    global ADB, SERIAL
    sel := SERIAL ? "-s " SERIAL " " : ""
    RunWait(A_ComSpec ' /c ' ADB ' ' sel args, , "Hide")
}

; Ctrl+Alt+P -> toggle pause
^!p:: {
    global Paused, PAUSE_FILE, HOTKEY_TIP
    Paused := !Paused
    val := Paused ? "1" : "0"
    RunAdb('shell "echo ' val ' > ' PAUSE_FILE '"')
    if (HOTKEY_TIP) {
        ToolTip(Paused ? "Tsum: PAUSED" : "Tsum: RESUMED")
        SetTimer(() => ToolTip(), -1000)
    }
}
