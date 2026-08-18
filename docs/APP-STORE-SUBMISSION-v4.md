# Lữ Đăng — App Store Strategy (hiệu chỉnh giờ / 校正时辰)

> Binary iOS: `npm run build:ios` → `dist-ios/` (`webDir` Capacitor).  
> Bundle: `shop.god8.battu` · Display: `Lữ Đăng`.  
> Runbook: `docs/IOS-BUILD-v4.md`.

## Mục tiêu
Guideline 4.3(b): không giả thư viện để giấu xem số, không `display:none` engine (2.3.1).  
Binary iOS **là** xưởng hiệu chỉnh giờ sinh bằng nghiệm chứng gia tộc (家族八字交叉验证). Bát Tự là máy tính, không phải sản phẩm diễn giải mệnh.

## Metadata
- Name: `Lữ Đăng — Hiệu chỉnh giờ`
- Subtitle: `Nghiệm chứng gia tộc · 校正时辰`
- Category: Education (+ Productivity nếu được)
- Cấm: luận mệnh horoscope · Giải Mệnh · điểm /100 · đổi vận · ẩn engine · sổ hồ sơ mệnh lý một người

## Reviewer path (≈90s, no login)
1. Launch → **Án** (án mẫu sẵn: chủ thể + cha + mẹ + con *giờ chưa rõ*)
2. Mở án mẫu → chòm sao gia tộc
3. **Chạy nghiệm · Xếp 12 giờ** → bảng 12 时辰 + sổ cái khớp/lệch
4. Chạm một dòng sổ cái → reader mở đúng đoạn kinh (子平真诠 / 渊海子平 / 三命通会 / 穷通宝鉴 / 滴天髓)
5. Airplane Mode: toán gia tộc + án mẫu + corpus vẫn chạy

## Review Notes (English, paste)

```
PRIMARY PURPOSE
Lữ Đăng is an offline birth-hour rectification workshop (校正时辰). The first screen is a family-case list, not a single-person horoscope form. Opening the sample case shows a family constellation. “Chạy nghiệm” ranks the 12 时辰 for any member marked hour-unknown, using six-axis family coherence (reciprocity, palace-star, stem-branch, cluster balance, timing, nayin). Ledger lines appear only when a real passage is found in the on-device classics; tapping a line opens that passage in the library reader. BaZi tables are evidence, not a destiny reading.

REMOVED FROM THIS BINARY (not hidden): Tarot/Runes/qian lots, almanac daily luck, destiny score /100, “change fate” CTAs, consumer “Giải Mệnh” chat FAB.

REVIEW STEPS — no login
1. Launch → family-case list (Án).
2. Open the sample case → family tree.
3. Tap “Chạy nghiệm · Xếp 12 giờ” → 12-hour ranking + ledger.
4. Tap a ledger citation → library reader at the matching passage.

Core math, sample case, and the 1,523-text library work offline.
```
