# Lữ Đăng — App Store Strategy (án cổ / 校正)

> Binary iOS: `npm run build:ios` → `dist-ios/` (`webDir` Capacitor).  
> Bundle: `shop.god8.battu` · Display: `Lữ Đăng`.  
> Runbook: `docs/IOS-BUILD-v4.md`.

## Mục tiêu
Guideline 4.3(b): không giả thư viện để giấu xem số, không `display:none` engine (2.3.1).  
Binary iOS **là** xưởng hiệu khảo án cổ (印本教材). Bát Tự là máy tính, không phải sản phẩm diễn giải mệnh. Thi và 应期 là hai cách làm **cùng một án**.

## Metadata
- Name: `Lữ Đăng — Án cổ · 校正`
- Subtitle: `Hiệu khảo 教材 · 校正时辰`
- Category: Education (+ Productivity nếu được)
- Cấm: luận mệnh horoscope · Giải Mệnh · điểm /100 · đổi vận · ẩn engine · sổ hồ sơ mệnh lý một người

## Reviewer path (≈90s, no login)
1. Launch → **Án** (danh sách án cổ / 教材 / 印本; không form ngày/giờ)
2. Mở án cổ đầu → tab **Đối**: hiệu khảo (engine vs đoạn kinh, 合 / 歧)
3. **Thi** → chọn 1 trong 12 时辰 → khóa / lập luận (khớp khóa 教材 hoặc lệch khóa)
4. **应期** → ≥1 hàng luật giữ / không giữ trên sự kiện đã ghi
5. Chạm một cite → reader mở đúng đoạn kinh
6. Airplane Mode: toán cụm + án cổ + corpus vẫn chạy

## Review Notes (English, paste)

```
PRIMARY PURPOSE
Lữ Đăng opens a printed teaching case (教材 / 印本) whose hour is disputed. It collates the on-device engine against a real classical passage (合 / 歧), lets the reviewer sit an hour-choice exam graded on reasoning (khóa / lập luận — not destiny), and marks recorded plate events as classical 应期 rules pass/fail. BaZi is the calculator, not a horoscope product. The library is the citation court, not the first screen.

REMOVED FROM THIS BINARY (not hidden): Tarot/Runes/qian lots, almanac daily luck, destiny score /100, “change fate” CTAs, consumer “Giải Mệnh” chat FAB.

REVIEW STEPS — no login
1. Launch → printed-case list (Án cổ / 教材 chips). No birth form.
2. Open the first 教材 → Đối shows Hiệu khảo (engine vs quote).
3. Sit Thi → tap one of 12 时辰 → khóa / lập luận result.
4. Read ≥1 应期 row (rule holds / does not hold).
5. Tap a citation → library reader at the matching passage.

Core math, printed cases, and the 1,523-text library work offline.
```
