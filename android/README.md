# Bát Tự Dụng Thần — Android APK (WebView wrapper)

Thin Android app that loads **https://battu.god8.shop** in a WebView.

## Tại sao dạng này?
APK chỉ là «vỏ» load trang web. Khi engine/thiên lý/knowledge được update &
deploy lên battu.god8.shop → app **tự lấy nội dung mới khi reload**, **không cần
build/cài lại APK**. (Service worker `sw.js` của site giữ cache offline.)

## Build APK (cần Docker)

```bash
cd android
./build-apk.sh
# → android/out/batu-dungthan.apk
```

Lần đầu docker build tải ~1GB Android SDK (cmdline-tools + platform-34) → ~10 phút.
Các lần sau dùng cache → ~30 giây.

## Cài lên máy

1. Copy `out/batu-dungthan.apk` ra điện thoại.
2. Mở file (File Manager) → cho phép «Install unknown apps».
3. Mở app «Bát Tự Dụng Thần» → tự load battu.god8.shop.

## Cấu trúc

- `app/src/main/java/com/battu/dungthan/MainActivity.java` — WebView load URL,
  bật JS/DOM storage, xử lý nút Back.
- `AndroidManifest.xml` — permission INTERNET, icon, theme Material NoActionBar.
- `Dockerfile` — build env (Gradle 8.7 + JDK 17 + Android SDK 34).

## Đổi URL gốc

Sửa `HOME_URL` trong `MainActivity.java` (nếu sau này đổi domain).
