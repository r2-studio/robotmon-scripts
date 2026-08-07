param (
    [switch]$ADB,
    [string]$Device
)

Write-Host "Parsed ADB: $ADB, Device: $Device"

# Clear and create dist + build directories
Write-Host "Removing old dist and build directories (if they exist) and creating fresh ones..."
Remove-Item -Recurse -Force .\dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\build -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path .\dist | Out-Null
New-Item -ItemType Directory -Path .\build | Out-Null

# Compile the game script (split files bundled via outFile -> .\build\index.js)
Write-Host "Compiling TypeScript (game bundle)..."
npx tsc
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript compilation failed (exit $LASTEXITCODE)."
    exit $LASTEXITCODE
}

# Compile the settings UI script separately -> .\build\settings.js
Write-Host "Compiling TypeScript (settings UI)..."
npx tsc -p tsconfig.settings.json
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript compilation failed (exit $LASTEXITCODE)."
    exit $LASTEXITCODE
}

# Stage the static assets next to the compiled JS so html-inline-external can
# resolve `<script src="settings.js">` and `<link href="index.css">` references.
Write-Host "Staging index.html and index.css into .\build..."
Copy-Item .\src\index.html -Destination .\build\
Copy-Item .\src\index.css -Destination .\build\

# Set the build date
Write-Host "Setting build date..."
$BuildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
Write-Host "Build date: $BuildDate"

# Inline external HTML
Write-Host "Running html-inline-external..."
npx html-inline-external --src .\build\index.html --dest .\dist\index.inlined.html

# Replace build date in HTML file
Write-Host "Replacing build date in index.html..."
(Get-Content .\dist\index.inlined.html) | ForEach-Object { $_ -replace '\$BUILD_DATE', $BuildDate } | Set-Content .\dist\index.html

# Remove the inlined HTML file
Write-Host "Removing inlined HTML file..."
Remove-Item .\dist\index.inlined.html

# Copy compiled JavaScript file
Write-Host "Copying build\index.js to dist directory..."
Copy-Item .\build\index.js -Destination .\dist\

# Create a ZIP file (use -Force to overwrite if exists)
Write-Host "Creating a ZIP file for dist directory..."
Compress-Archive -Path .\dist\* -DestinationPath .\index.zip -Force

# Push files to device via adb if ADB flag is set
if ($ADB -and $Device) {
    Write-Host "Pushing files to device $Device..."

    # Push index.js to the device
    Write-Host "Pushing index.js..."
    adb -s $Device push .\dist\index.js "sdcard\Download\Robotmon\scripts\com.r2studio.Tsum\"
    if ($?) {
        Write-Host "index.js successfully pushed."
    } else {
        Write-Host "Failed to push index.js."
    }

    # Push index.html to the device
    Write-Host "Pushing index.html..."
    adb -s $Device push .\dist\index.html "sdcard\Download\Robotmon\scripts\com.r2studio.Tsum\"
    if ($?) {
        Write-Host "index.html successfully pushed."
    } else {
        Write-Host "Failed to push index.html."
    }
} else {
    Write-Host "ADB flag not set or device not specified. Skipping push."
}
