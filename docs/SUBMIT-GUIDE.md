# 🚀 SUBMIT GUIDE — Lữ Đăng iOS (A→Z) · [RESTORE 2026-08-18]

> Dùng kèm: **APP-STORE-SUBMISSION-v3.md** (nội dung điền) · **APPSTORE-KHAI-BAO.md** (khai báo).
> Windows → mọi bước Xcode trên **Mac/cloud Mac** (MacinCloud ~$20/th, GitHub Actions macOS free).

## GIAI ĐOẠN 0 — Trước build (Windows, 5 phút)
1. [developer.apple.com](https://developer.apple.com) → Identifiers → ＋ App ID `shop.god8.lvdang`
2. [App Store Connect](https://appstoreconnect.apple.com) → My Apps → ＋ New App: iOS · `Lữ Đăng — Bát Tự Cổ Pháp` · Vietnamese · Bundle `shop.god8.lvdang` · SKU `lvdang-ios-001`
3. Confirm sẵn: `capacitor.config.json` (appId lvdang ✓) · `resources/ios-icons/` (12 icon) · `resources/ios/PrivacyInfo.xcprivacy`

## GIAI ĐOẠN 1 — Build web (Windows)
```bash
npm run build          # dist/ = bản ĐẦY ĐỦ bói toán (iOS dùng bản này)
```
Check: `dist/index.html` + `dist/kinh/` ~1523 file.

## GIAI ĐOẠN 2 — Project iOS (Mac)
```bash
npm ci
npx cap add ios        # lần đầu — appId mới từ config
npx cap sync ios
npx cap open ios       # Xcode
```

## GIAI ĐOẠN 3 — Xcode (8 mục)
| # | Việc |
|---|------|
| 3.1 | Signing & Capabilities → Team + Bundle `shop.god8.lvdang` |
| 3.2 | Display Name = `Lữ Đăng` |
| 3.3 | App Icons — kéo 12 icon từ `resources/ios-icons/` |
| 3.4 | Info tab: `ITSAppUsesNonExemptEncryption` = NO (Boolean) |
| 3.5 | Kéo `resources/ios/PrivacyInfo.xcprivacy` vào target App (Copy items) |
| 3.6 | Version 1.0 · Build 1 |
| 3.7 | Orientation: Portrait only |
| 3.8 | ⌘R chạy thử: lập lá số → thấy «🏛 Chuỗi Lập Luận» → hỏi AI → thấy «🎯 Neo» → mở /kinh/ offline |

## GIAI ĐOẠN 4 — TestFlight
Product → Archive → Distribute App → App Store Connect → Upload.
Internal test ngay; external 5-10 người 2-3 ngày (test Airplane Mode thư viện).

## GIAI ĐOẠN 5 — Điền form ASC
Theo bảng trong `APPSTORE-KHAI-BAO.md` (mục 1-6). Screenshots chụp simulator 6.9" (1320×2868) đúng 5 flow v3.

## GIAI ĐOẠN 6 — Submit & theo dõi
1. Checklist 11 mục (KHAI-BAO mục 8)
2. Add for Review → Submit (thứ 2-4 sáng VN)
3. Approved → Manual release → bấm Release
4. Reject 4.3(b) → KHÔNG resubmit → paste reply kịch bản (v3 mục 5) xin phone call

## Phụ lục — Native features đã có (dùng khi reply Apple)
| Tính năng | Mô tả |
|---|---|
| Haptics | Rung khi Luận giải + kết quả Neo (success/warning) — `@capacitor/haptics` |
| Status Bar dark native | `#0a0913` — `@capacitor/status-bar` |
| Splash native | fade 150/300ms |
| Keyboard native | resize body + DARK |
| Self-contained | 1519 trang kinh bundle — offline Airplane Mode (chống 4.2 «repackaged website») |
| Network chỉ cho | AI proxy + analytics tự host — không load UI từ web |

## Phụ lục — Rollback
Web full luôn live tại **battu.god8.shop** — PWA Add to Home Screen là phương án song song.
