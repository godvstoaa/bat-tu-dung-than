# Lữ Đăng — App Store Strategy (án cổ / 校正)

> **Do not submit until** new IPA + screenshots 01–04 + Connect copy + Marketing URL = `https://battu.god8.shop/review/ios.html`.  
> A third 4.3(b) on the same listing is worse than waiting.  
> Paste pack: `docs/CONNECT-PASTE-v5.md`.

> Binary iOS: `npm run build:ios` → `dist-ios/` (`webDir` Capacitor).  
> Bundle: `shop.god8.battu` · Display: `Lữ Đăng`.  
> Runbook: `docs/IOS-BUILD-v4.md`.  
> Web homepage stays a fortune product — do not disguise it; do not use it as Marketing URL.

## Mục tiêu
Guideline 4.3(b): không giả thư viện để giấu xem số, không `display:none` engine (2.3.1).  
Binary iOS **là** xưởng hiệu khảo án cổ (印本教材). Bát Tự là máy tính, không phải sản phẩm diễn giải mệnh. Thi và 应期 là hai cách làm **cùng một án**.

## Metadata
- Name: `Lữ Đăng — Án cổ · 校正`
- Subtitle: `Hiệu khảo 教材 · 校正时辰`
- Category: Education
- Marketing URL: `https://battu.god8.shop/review/ios.html`
- Cấm: luận mệnh · horoscope · giải mệnh · vận hôm nay · hợp tuổi · cải mệnh · lập lá số · /100 · sổ hồ sơ mệnh lý một người

## Reviewer path (≈90s, no login)
1. Launch → **một** bản in **四柱 教材** (干支 trên thẻ; **không** ngày dương lịch; **không** “Tạo án trống” trên first paint)
2. Mở plate → tab **Đối**: **Thi** 12 地支 ngay phía trên (chưa mở `#ios-solar-source`)
3. Chọn 1 时辰 → khóa / lập luận (khớp khóa 教材 hoặc lệch khóa)
4. **Hiệu khảo** (合 / 歧) + **应期** (luật giữ / không giữ) cùng scroll
5. Chạm một cite → reader mở đúng đoạn kinh
6. Airplane Mode: toán cụm + plate + corpus vẫn chạy

## Screenshot order
1. `ios-01-cases` — 四柱 教材 plate  
2. `ios-02-tree` — Thi 12 地支  
3. `ios-03-hours` — 应期 giữ / không giữ  
4. `ios-04-cite` — citation reader  

## Review Notes (English, paste)

```
PRIMARY PURPOSE
Lữ Đăng opens one printed 四柱 classroom plate (教材 / 印本) whose hour pillar is blank (时辰未记). The first screen shows stem-branch lines, not Gregorian birth dates. Opening the plate puts a 12-地支 exam (Thi) above collation (Hiệu khảo: engine vs a real classical passage) and recorded-event 应期 pass/fail. Scoring is khóa / lập luận, not destiny. BaZi is the calculator. The library is the citation court.

REMOVED FROM THIS BINARY (not hidden): Tarot/Runes/qian lots, almanac daily luck, destiny score, “change fate” CTAs, consumer “Giải Mệnh” chat FAB.

REVIEW STEPS — no login
1. Launch → one 四柱 教材 plate (干支 / 未记, no YYYY-MM-DD). No empty-case intake on first paint.
2. Open the plate → Đối leads with Thi (12 地支).
3. Tap one 时辰 → khóa / lập luận result.
4. Read ≥1 应期 row (rule holds / does not hold).
5. Tap a citation → library reader at the matching passage.

Marketing URL: https://battu.god8.shop/review/ios.html
Core math, printed plate, and the 1,523-text library work offline.
```
