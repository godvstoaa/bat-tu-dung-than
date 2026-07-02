#!/usr/bin/env bash
# Build the debug APK via Docker (no host Android tooling needed).
# Output: android/out/batu-dungthan.apk
set -e
cd "$(dirname "$0")"

echo "==> docker build (first run downloads ~1GB Android SDK, ~10 min)..."
docker build -t battu-dungthan-apk .

mkdir -p out
echo "==> copy APK out..."
docker run --rm -v "$PWD/out:/out" battu-dungthan-apk \
  sh -c "cp app/build/outputs/apk/debug/app-debug.apk /out/batu-dungthan.apk"

echo ""
echo "✅ APK ready: $(pwd)/out/batu-dungthan.apk"
echo "   Copy to your Android phone and install (enable 'Install unknown apps')."
