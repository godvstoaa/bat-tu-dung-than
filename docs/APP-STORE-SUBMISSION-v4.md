# Lữ Đăng — App Store Strategy v4 (research-first)

> Binary iOS: `npm run build:ios` → `dist-ios/` (`webDir` Capacitor).  
> Runbook: `docs/IOS-BUILD-v4.md`.

## Mục tiêu
Sau Guideline 4.3(b) 9/6/2026 (fortune telling nêu đích danh): app mở như **công cụ nghiên cứu cổ pháp offline**. Chart Lab là case-study phụ.

## Metadata
- Name: `Lữ Đăng — Cổ Pháp & Chart Lab`
- Subtitle: `Tra cứu cổ bản · Chart Lab`
- Category: Education (+ Reference nếu được)
- Số liệu (`src/ios/corpus-stats.json`): 1523 mục · ~125 bộ · 758 DZ# · 1516 chuỗi lập luận · 1313 bản dịch Việt đáng kể · 497 nguyên văn Hán đáng kể
- Cấm: largest / only app / độc quyền / 4 tầng mọi văn bản / đổi vận / mở đầu bằng «Bói»

## Reviewer path
1. Mở app → Thư viện  
2. Tìm `穷通宝鉴` → Nguồn (không link ngoài)  
3. Lưu trích dẫn → Ghi chú  
4. Học / Đối chiếu  
5. Chart Lab case mẫu `1990-06-15 10:00` → bảng Tứ Trụ `庚午 壬午 辛亥 癸巳` + trích 子平真诠 / 穷通宝鉴 (không lá số tiêu dùng, không điểm /100)  
6. Airplane Mode: thư viện + case mẫu vẫn chạy  

## Review Notes (English, paste)

```
PRIMARY PURPOSE
Lữ Đăng is an offline research tool for Vietnamese-Chinese classical metaphysics. Primary navigation is library search, source comparison, citation-based explanations, and saved notes. BaZi Chart Lab is secondary.

REVIEW STEPS — no login
1. Launch → Library.
2. Search 穷通宝鉴 or a DZ number.
3. Open a text → Sources tab (copy only, no outbound web links).
4. Save citation → Notes.
5. Chart Lab → preloaded sample, no birth form required first.

Library and core chart math work offline. Network is for optional AI and declared analytics. UI is Vietnamese.
```

## Resolution Center (if 4.3b)

```
Thank you for the review. This binary’s primary experience is a classical-text research tool (offline corpus, citations, compare, learning paths). BaZi is a secondary Chart Lab. Analytics on iOS does not send birth dates. We welcome an appeal/appointment if needed.
```

Do not ask “which apps duplicate our features?”.
