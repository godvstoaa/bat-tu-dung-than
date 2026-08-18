# Lữ Đăng — App Store Strategy (bàn thầy / 命理 studio)

> Binary iOS: `npm run build:ios` → `dist-ios/` (`webDir` Capacitor).  
> Bundle: `shop.god8.battu` · Display: `Lữ Đăng`.  
> Runbook: `docs/IOS-BUILD-v4.md`.

## Mục tiêu
Guideline 4.3(b): không giả thư viện để giấu xem số, không `display:none` engine (2.3.1).  
Binary iOS **là** bàn thầy: sổ hồ sơ → bảng Tứ Trụ có trích dẫn Đạo Tạng.

## Metadata
- Name: `Lữ Đăng — Bàn thầy cổ pháp`
- Subtitle: `Sổ hồ sơ · Tứ Trụ · trích dẫn`
- Category: Education (+ Productivity nếu được)
- Cấm: luận mệnh horoscope · Giải Mệnh · điểm /100 · đổi vận · ẩn engine

## Reviewer path
1. Mở app → **Hồ sơ** (case mẫu A/B sẵn)
2. Mở Case mẫu A → bảng Tứ Trụ `庚午 壬午 辛亥 癸巳` + câu diễn giải mỗi câu một kinh (title · locator)
3. So sánh A/B = bảng hai cục, không CTA hợp tuổi
4. Thư viện → `穷通宝鉴` (kho trích dẫn, không phải first screen)
5. Airplane Mode: hồ sơ + bàn + corpus vẫn chạy

## Review Notes (English, paste)

```
PRIMARY PURPOSE
Lữ Đăng is an offline practitioner desk for classical BaZi (Four Pillars). The first screen is a client-case list. Opening a case shows calculation tables (pillars, ten gods, useful god, decades) and interpretive sentences only when each sentence cites a text from the on-device Daozang library (title + locator). Two-case compare is a side-by-side table, not a consumer compatibility score. The 1,523-text library is the citation backend and a reading tab — not a skin over a hidden horoscope form.

REMOVED FROM THIS BINARY (not hidden): Tarot/Runes/qian lots, almanac daily luck, destiny score /100, “change fate” CTAs, consumer “Giải Mệnh” chat FAB.

REVIEW STEPS — no login
1. Launch → case list.
2. Open the sample case → tables + citations.
3. Compare tab → two-case table.
4. Library tab → search 穷通宝鉴 → Sources (copy only).

Core math and library work offline.
```
