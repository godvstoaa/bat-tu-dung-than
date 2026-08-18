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
Browser: cold open = sổ hồ sơ (không form luận giải, không thư viện giả). Notch/font Apple thật cần TestFlight/simulator.

## Xcode
- Bundle: `shop.god8.battu` (cùng listing App Store — không đổi bundle / không app thứ hai)
- Display Name: `Lữ Đăng`
- Kéo `resources/ios/PrivacyInfo.xcprivacy`
- `ITSAppUsesNonExemptEncryption = NO`
- Icons: `resources/ios-icons/` nếu có

## Git
Mỗi sprint đã commit+push. Đừng chỉ giữ local.
