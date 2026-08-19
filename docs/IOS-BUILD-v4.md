# Lữ Đăng — iOS Build Runbook (v4)

## Lệnh
```bash
npm run build:ios
npm run verify:ios
npm run verify:ios-path
npm run preview:ios   # http://127.0.0.1:5174/
npm run cap:ios       # Mac: sync Xcode
```

## Output
`dist-ios/` ~18–20 MB, corpus 1523 entries, đã prune `review/`, `kinh/`, `downloads/`.

## Preview
Browser: cold open = **một bản in 四柱 教材** (干支 trên thẻ, không ngày dương lịch). Notch/font Apple thật cần TestFlight/simulator.

## Xcode
- Bundle: `shop.god8.battu` (cùng listing App Store — không đổi bundle / không app thứ hai)
- Display Name: `Lữ Đăng`
- Kéo `resources/ios/PrivacyInfo.xcprivacy`
- `ITSAppUsesNonExemptEncryption = NO`
- Icons: `resources/ios-icons/` nếu có

## Review path
Launch → một 四柱 教材 (không Tạo án trống trên first paint) → Đối Thi 12 地支 → khóa → hiệu khảo + 应期 → chạm cite → đoạn kinh.

Marketing URL (web, not in the IPA): `https://battu.god8.shop/review/ios.html`  
Paste pack: `docs/CONNECT-PASTE-v5.md`. Do not submit until IPA + shots + copy + that URL match.

## Git
Mỗi sprint đã commit+push. Đừng chỉ giữ local.
