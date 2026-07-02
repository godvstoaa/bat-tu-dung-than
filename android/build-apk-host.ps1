# Build the Bát Tự debug APK on the host (no Docker).
# Downloads JDK 17 + Android cmdline-tools + Gradle into android/.host-tools (cached).
# Output: android/out/batu-dungthan.apk
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # speed up Invoke-WebRequest

$here       = Split-Path -Parent $MyInvocation.MyCommand.Path   # android/
$root       = Split-Path -Parent $here                          # project root
$tools      = Join-Path $here '.host-tools'
$sdk        = Join-Path $tools 'android-sdk'
$jdkDir     = Join-Path $tools 'jdk-17'
$gradleDir  = Join-Path $tools 'gradle-8.7'
New-Item -ItemType Directory -Force -Path $tools | Out-Null

# ---------- JDK 17 (Temurin, portable) ----------
if (-not (Test-Path $jdkDir)) {
  Write-Host "[host] tai JDK 17 Temurin..."
  $url = 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.11%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.11_9.zip'
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile (Join-Path $tools 'jdk.zip')
  Expand-Archive -Path (Join-Path $tools 'jdk.zip') -DestinationPath (Join-Path $tools 'jdk-ex') -Force
  $sub = Get-ChildItem (Join-Path $tools 'jdk-ex') | Where-Object PSIsContainer | Select-Object -First 1
  Move-Item (Join-Path (Join-Path $tools 'jdk-ex') $sub.Name) $jdkDir
  Remove-Item -Recurse (Join-Path $tools 'jdk-ex'), (Join-Path $tools 'jdk.zip')
}
$env:JAVA_HOME = $jdkDir
$env:PATH      = "$jdkDir\bin;$env:PATH"
Write-Host "[host] JAVA_HOME = $jdkDir"
& java -version

# ---------- Android cmdline-tools ----------
$cli = Join-Path $sdk 'cmdline-tools\latest'
if (-not (Test-Path $cli)) {
  Write-Host "[host] tai Android cmdline-tools..."
  $url = 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip'
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile (Join-Path $tools 'cli.zip')
  Expand-Archive -Path (Join-Path $tools 'cli.zip') -DestinationPath (Join-Path $tools 'cli-ex') -Force
  New-Item -ItemType Directory -Force -Path (Join-Path $sdk 'cmdline-tools') | Out-Null
  Move-Item (Join-Path (Join-Path $tools 'cli-ex') 'cmdline-tools') $cli
  Remove-Item -Recurse (Join-Path $tools 'cli-ex'), (Join-Path $tools 'cli.zip')
}
$env:ANDROID_HOME    = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$sdkmgr = Join-Path $cli 'bin\sdkmanager.bat'
$ErrorActionPreference = 'Continue'   # native stderr (sdkmanager/gradle) phai khong fatal

Write-Host "[host] accept licenses + install platform-34 + build-tools-34..."
$yes = 1..30 | ForEach-Object { 'y' }
$yes | & $sdkmgr --licenses 2>$null | Out-Null
& $sdkmgr "platforms;android-34" "build-tools;34.0.0" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw "sdkmanager cai platform that bai (code $LASTEXITCODE)" }

# ---------- Gradle ----------
if (-not (Test-Path $gradleDir)) {
  Write-Host "[host] tai Gradle 8.7..."
  $url = 'https://services.gradle.org/distributions/gradle-8.7-bin.zip'
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile (Join-Path $tools 'gradle.zip')
  Expand-Archive -Path (Join-Path $tools 'gradle.zip') -DestinationPath $tools -Force
  Remove-Item (Join-Path $tools 'gradle.zip')
}

# ---------- Build ----------
Set-Location $here
Write-Host "[host] gradle assembleDebug (download AGP deps lan dau ~5 min)..."
& (Join-Path $gradleDir 'bin\gradle.bat') assembleDebug --no-daemon --console=plain
if ($LASTEXITCODE -ne 0) { throw "gradle assembleDebug that bai (code $LASTEXITCODE)" }

# ---------- Copy out ----------
$apk = Join-Path $here 'app\build\outputs\apk\debug\app-debug.apk'
$outDir = Join-Path $here 'out'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Copy-Item $apk (Join-Path $outDir 'batu-dungthan.apk') -Force
Write-Host ""
Write-Host "[host] ✅ APK san sang: $outDir\batu-dungthan.apk"
