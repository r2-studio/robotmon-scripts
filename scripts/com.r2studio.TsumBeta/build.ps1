param (
    [switch]$ADB,
    [string]$Device
)

Write-Host "Parsed ADB: $ADB, Device: $Device"

# Clear and create dist directory
Write-Host "Removing old dist directory (if it exists) and creating a new one..."
Remove-Item -Recurse -Force .\dist -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path .\dist

# Set the build date
Write-Host "Setting build date..."
$BuildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
Write-Host "Build date: $BuildDate"

# Inline external HTML
Write-Host "Running html-inline-external..."
npx html-inline-external --src .\src\index.html --dest .\dist\index.inlined.html

# Replace build date in HTML file
Write-Host "Replacing build date in index.html..."
(Get-Content .\dist\index.inlined.html) | ForEach-Object { $_ -replace '\$BUILD_DATE', $BuildDate } | Set-Content .\dist\index.html

# Remove the inlined HTML file
Write-Host "Removing inlined HTML file..."
Remove-Item .\dist\index.inlined.html

# Copy JavaScript file
Write-Host "Copying index.js to dist directory..."
Copy-Item .\src\index.js -Destination .\dist\

# Create a ZIP file (use -Force to overwrite if exists)
Write-Host "Creating a ZIP file for dist directory..."
Compress-Archive -Path .\dist\* -DestinationPath .\index.zip -Force

# Push files to device via adb if ADB flag is set
if ($ADB -and $Device) {
    Write-Host "Pushing files to device $Device..."

    # Push index.js to the device
    Write-Host "Pushing index.js..."
    adb -s $Device push .\dist\index.js "sdcard\Download\Robotmon\scripts\com.r2studio.TsumBeta\"
    if ($?) {
        Write-Host "index.js successfully pushed."
    } else {
        Write-Host "Failed to push index.js."
    }

    # Push index.html to the device
    Write-Host "Pushing index.html..."
    adb -s $Device push .\dist\index.html "sdcard\Download\Robotmon\scripts\com.r2studio.TsumBeta\"
    if ($?) {
        Write-Host "index.html successfully pushed."
    } else {
        Write-Host "Failed to push index.html."
    }
} else {
    Write-Host "ADB flag not set or device not specified. Skipping push."
}
