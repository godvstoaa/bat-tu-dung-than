# 11 · Phần 23 — Bảng dò mô phỏng (dữ liệu vàng cho kiểm thử) và đặc tả tính KPI

> Phần 03 §5 và phần 07 §5.6 đưa ra kết quả mô phỏng dạng tổng. Phần này in **từng ngày / từng tuần** của các kịch bản chính, để kiểm thử (phần 18 §2) so sánh từng dòng: công cụ mô phỏng và máy chủ kinh tế phải cho **đúng các con số này** với cùng giả định. Cuối phần là đặc tả tính các KPI của phần 12 trên bảng dữ liệu của phần 10 §4.3.

---

## 1. Bảng dò Phúc Khí và Ngọc theo ngày

### 1.1 Giả định

- Hằng số đúng code hiện tại (`state.js`, `cosmetics.js`, `progress.js`); quy tắc chuỗi **tạm dừng** (phần 03 NG-1).
- Việc nhỏ và án / sảnh theo bảng kiểu người chơi phần 18 §2.2: B = 47 PK việc nhỏ, 132 PK án + sảnh (143 khi có Hợp mệnh), 2 Án Cổ / ngày × 25 (28 khi có Hợp mệnh) cho tới hết 38 án; A = 28 PK việc nhỏ, 16 PK án + sảnh (18 khi có Hợp mệnh), không Án Cổ.
- Mua thân bộ Hợp mệnh 570 Ngọc ngay khi đủ, có hiệu lực từ **ngày hôm sau**.
- Ngày 1 là thứ Hai.

### 1.2 Đệ Tử Chăm (B) — 14 ngày đầu

| Ngày | Thứ | Điểm danh (Ngọc) | PK việc nhỏ | PK án + sảnh | PK Án Cổ | `xp` | Cấp | Quà cấp | Ngọc còn | Hợp mệnh |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | T2 | 10 | 47 | 132 | 50 | 229 | 4 | 60 | 70 | — |
| 2 | T3 | 15 | 47 | 132 | 50 | 458 | 5 | 20 | 105 | — |
| 3 | T4 | 20 | 47 | 132 | 50 | 687 | 6 | 20 | 145 | — |
| 4 | T5 | 25 | 47 | 132 | 50 | 916 | 7 | 20 | 190 | — |
| 5 | T6 | 30 | 47 | 132 | 50 | 1145 | 8 | 20 | 240 | — |
| 6 | T7 | 40 | 47 | 132 | 50 | 1374 | 9 | 20 | 300 | — |
| 7 | CN | 80 | 47 | 132 | 50 | 1603 | 9 | — | 380 | — |
| 8 | T2 | 10 | 47 | 132 | 50 | 1832 | 10 | 20 | 410 | — |
| 9 | T3 | 15 | 47 | 132 | 50 | 2061 | 11 | 20 | 445 | — |
| 10 | T4 | 20 | 47 | 132 | 50 | 2290 | 11 | — | 465 | — |
| 11 | T5 | 25 | 47 | 132 | 50 | 2519 | 12 | 20 | 510 | — |
| 12 | T6 | 30 | 47 | 132 | 50 | 2748 | 12 | — | 540 | — |
| 13 | T7 | 40 | 47 | 132 | 50 | 2977 | 13 | 20 | 30 (mua bộ −570) | có |
| 14 | CN | 80 | 47 | 143 | 56 | 3223 | 13 | — | 110 | có |

### 1.3 Khách Thong Thả (A) — 5 tuần đầu (T2, T3, T5, T7)

| Ngày | Thứ | Điểm danh (Ngọc) | PK việc nhỏ | PK án + sảnh | PK Án Cổ | `xp` | Cấp | Quà cấp | Ngọc còn | Hợp mệnh |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | T2 | 10 | 28 | 16 | 0 | 44 | 2 | 20 | 30 | — |
| 2 | T3 | 15 | 28 | 16 | 0 | 88 | 3 | 20 | 65 | — |
| 3 | T4 | nghỉ | — | — | — | 88 | 3 | — | 65 | — |
| 4 | T5 | 20 | 28 | 16 | 0 | 132 | 3 | — | 85 | — |
| 5 | T6 | nghỉ | — | — | — | 132 | 3 | — | 85 | — |
| 6 | T7 | 25 | 28 | 16 | 0 | 176 | 3 | — | 110 | — |
| 7 | CN | nghỉ | — | — | — | 176 | 3 | — | 110 | — |
| 8 | T2 | 30 | 28 | 16 | 0 | 220 | 4 | 20 | 160 | — |
| 9 | T3 | 40 | 28 | 16 | 0 | 264 | 4 | — | 200 | — |
| 10 | T4 | nghỉ | — | — | — | 264 | 4 | — | 200 | — |
| 11 | T5 | 80 | 28 | 16 | 0 | 308 | 4 | — | 280 | — |
| 12 | T6 | nghỉ | — | — | — | 308 | 4 | — | 280 | — |
| 13 | T7 | 10 | 28 | 16 | 0 | 352 | 5 | 20 | 310 | — |
| 14 | CN | nghỉ | — | — | — | 352 | 5 | — | 310 | — |
| 15 | T2 | 15 | 28 | 16 | 0 | 396 | 5 | — | 325 | — |
| 16 | T3 | 20 | 28 | 16 | 0 | 440 | 5 | — | 345 | — |
| 17 | T4 | nghỉ | — | — | — | 440 | 5 | — | 345 | — |
| 18 | T5 | 25 | 28 | 16 | 0 | 484 | 5 | — | 370 | — |
| 19 | T6 | nghỉ | — | — | — | 484 | 5 | — | 370 | — |
| 20 | T7 | 30 | 28 | 16 | 0 | 528 | 6 | 20 | 420 | — |
| 21 | CN | nghỉ | — | — | — | 528 | 6 | — | 420 | — |
| 22 | T2 | 40 | 28 | 16 | 0 | 572 | 6 | — | 460 | — |
| 23 | T3 | 80 | 28 | 16 | 0 | 616 | 6 | — | 540 | — |
| 24 | T4 | nghỉ | — | — | — | 616 | 6 | — | 540 | — |
| 25 | T5 | 10 | 28 | 16 | 0 | 660 | 6 | — | 550 | — |
| 26 | T6 | nghỉ | — | — | — | 660 | 6 | — | 550 | — |
| 27 | T7 | 15 | 28 | 16 | 0 | 704 | 6 | — | 565 | — |
| 28 | CN | nghỉ | — | — | — | 704 | 6 | — | 565 | — |
| 29 | T2 | 20 | 28 | 16 | 0 | 748 | 7 | 20 | 35 (mua bộ −570) | có |
| 30 | T3 | 25 | 28 | 18 | 0 | 794 | 7 | — | 60 | có |
| 31 | T4 | nghỉ | — | — | — | 794 | 7 | — | 60 | có |
| 32 | T5 | 30 | 28 | 18 | 0 | 840 | 7 | — | 90 | có |
| 33 | T6 | nghỉ | — | — | — | 840 | 7 | — | 90 | có |
| 34 | T7 | 40 | 28 | 18 | 0 | 886 | 7 | — | 130 | có |
| 35 | CN | nghỉ | — | — | — | 886 | 7 | — | 130 | có |

Đọc bảng B: quà cấp chiếm phần lớn Ngọc tuần đầu (cấp 9 sau ngày 7); bộ Hợp mệnh mua cuối ngày 13, có hiệu lực từ ngày 14; Án Cổ hết sau ngày 19 (ngoài bảng); bảng A: bộ mua ngày 29. Bảng A: chuỗi tạm dừng — mỗi ngày chơi đi tiếp một ô của vòng 7 ngày, nên A đi trọn vòng sau 7 ngày chơi (gần 2 tuần lịch), không quay về ô đầu khi nghỉ.

---

## 2. Bảng dò Lộ Điểm một chương (kiểu A)

Giả định: A kiếm 2.200 LĐ / tuần (4 ngày × 400 + 3 việc Lộ Thư × 200); trần tuần 4.000; ngưỡng Lộ Dư 2.400; quỹ tối đa 9.600; LĐ nhân đôi chỉ trong phần còn lại của trần tuần (phần 07 §5.5). Thiếu hụt tính trên LĐ **gốc**.

### 2.1 A chơi đều 13 tuần

| Tuần | LĐ kiếm (gốc) | LĐ nhân đôi từ Lộ Dư | LĐ tính | Quỹ Lộ Dư cuối tuần | Tổng | Bậc |
|---|---|---|---|---|---|---|
| 1 | 2200 | 0 | 2200 | 200 | 2200 | 2 |
| 2 | 2200 | 200 | 2400 | 200 | 4600 | 4 |
| 3 | 2200 | 200 | 2400 | 200 | 7000 | 7 |
| 4 | 2200 | 200 | 2400 | 200 | 9400 | 9 |
| 5 | 2200 | 200 | 2400 | 200 | 11800 | 11 |
| 6 | 2200 | 200 | 2400 | 200 | 14200 | 14 |
| 7 | 2200 | 200 | 2400 | 200 | 16600 | 16 |
| 8 | 2200 | 200 | 2400 | 200 | 19000 | 19 |
| 9 | 2200 | 200 | 2400 | 200 | 21400 | 21 |
| 10 | 2200 | 200 | 2400 | 200 | 23800 | 23 |
| 11 | 2200 | 200 | 2400 | 200 | 26200 | 26 |
| 12 | 2200 | 200 | 2400 | 200 | 28600 | 28 |
| 13 | 2200 | 200 | 2400 | 200 | 31000 | 30 |

### 2.2 A vắng tuần 5 và 6

| Tuần | LĐ kiếm (gốc) | LĐ nhân đôi từ Lộ Dư | LĐ tính | Quỹ Lộ Dư cuối tuần | Tổng | Bậc |
|---|---|---|---|---|---|---|
| 1 | 2200 | 0 | 2200 | 200 | 2200 | 2 |
| 2 | 2200 | 200 | 2400 | 200 | 4600 | 4 |
| 3 | 2200 | 200 | 2400 | 200 | 7000 | 7 |
| 4 | 2200 | 200 | 2400 | 200 | 9400 | 9 |
| 5 | 0 | 0 | 0 | 2600 | 9400 | 9 |
| 6 | 0 | 0 | 0 | 5000 | 9400 | 9 |
| 7 | 2200 | 1800 | 4000 | 3400 | 13400 | 13 |
| 8 | 2200 | 1800 | 4000 | 1800 | 17400 | 17 |
| 9 | 2200 | 1800 | 4000 | 200 | 21400 | 21 |
| 10 | 2200 | 200 | 2400 | 200 | 23800 | 23 |
| 11 | 2200 | 200 | 2400 | 200 | 26200 | 26 |
| 12 | 2200 | 200 | 2400 | 200 | 28600 | 28 |
| 13 | 2200 | 200 | 2400 | 200 | 31000 | 30 |

Đọc: A chơi đều đạt bậc 30 đúng tuần 13; A vắng hai tuần cũng đạt bậc 30 tuần 13 nhờ quỹ Lộ Dư (tuần 7–9 nhân đôi 1.800 LĐ / tuần, chạm trần 4.000). Đây là bằng chứng số cho cam kết «người bận không bị bỏ lại».

---

## 3. Đặc tả tính KPI

Bảng nguồn: đơn hàng, sổ cái ví, quyền lợi, thuê bao (phần 10 §4.3) — bản sao D1 — và kho analytics (phần 12). Viết dạng SQL (SQLite / D1) để không mơ hồ; tên bảng là tên làm việc, tài liệu 13 đặt tên thật.

### 3.1 Doanh thu gộp ngày theo kênh

```sql
SELECT date(paid_at/1000,'unixepoch','+7 hours') AS econ_day, channel,
       SUM(amount) AS gross
FROM orders
WHERE status IN ('granted')            -- không tính pending / failed
GROUP BY econ_day, channel;
```

Hoàn tiền trừ vào ngày hoàn (không sửa ngày gốc):

```sql
SELECT date(refunded_at/1000,'unixepoch','+7 hours') AS econ_day, channel, -SUM(amount)
FROM orders WHERE status IN ('refunded','chargeback') GROUP BY 1, 2;
```

### 3.2 ARPDAU, tỷ lệ trả phí, ARPPU

```sql
-- DAU: người có ít nhất một sự kiện phiên trong ngày kinh tế
WITH dau AS (SELECT econ_day, COUNT(DISTINCT pseudo_id) n FROM ev WHERE ev='session_start' GROUP BY econ_day),
rev AS (SELECT econ_day, SUM(gross) r FROM daily_revenue GROUP BY econ_day)
SELECT dau.econ_day, rev.r * 1.0 / dau.n AS arpdau FROM dau JOIN rev USING (econ_day);

-- Tỷ lệ trả phí tháng = người trả ≥ 1 đơn granted trong tháng / MAU
SELECT strftime('%Y-%m', paid_at/1000,'unixepoch','+7 hours') AS m,
       COUNT(DISTINCT account_id) AS payers
FROM orders WHERE status='granted' GROUP BY m;
```

Lưu ý: DAU lấy từ kho analytics (chỉ người đồng ý); doanh thu lấy từ kho giao dịch (mọi người). Để tỷ số không lệch, **ước lượng DAU toàn bộ** = DAU đồng ý ÷ tỷ lệ đồng ý (đo từ số tài khoản hoạt động trên máy chủ, không cần analytics).

### 3.3 `ETH_TOP1_SHARE`

```sql
WITH spend AS (
  SELECT account_id, SUM(amount) s FROM orders
  WHERE status='granted' AND paid_at >= :t30 GROUP BY account_id),
ranked AS (SELECT s, NTILE(100) OVER (ORDER BY s DESC) AS pct FROM spend)
SELECT SUM(CASE WHEN pct = 1 THEN s END) * 1.0 / SUM(s) FROM ranked;
```

### 3.4 `ETH_FATE_ADJACENT_BUY`

```sql
-- giao dịch tiền ảo hoặc tiền thật trong 10 phút sau khi vào vùng im lặng
SELECT COUNT(*) * 1.0 / (SELECT COUNT(*) FROM ev WHERE ev IN ('store_buy','pay_success') AND ts BETWEEN :a AND :b)
FROM ev b
WHERE b.ev IN ('store_buy','pay_success') AND b.ts BETWEEN :a AND :b
  AND EXISTS (SELECT 1 FROM ev q WHERE q.pseudo_id=b.pseudo_id AND q.ev='guard_quiet_zone'
              AND q.ts BETWEEN b.ts - 600000 AND b.ts);
```

### 3.5 `ETH_MINOR_SPEND`

```sql
SELECT SUM(CASE WHEN a.age_band IN ('<16','16-17') THEN o.amount END) * 1.0 / SUM(o.amount)
FROM orders o JOIN accounts a USING (account_id)
WHERE o.status='granted' AND o.paid_at >= :t30;
```

### 3.6 `PK_SINK_RATIO_30D`

```sql
WITH f AS (
  SELECT account_id,
         SUM(CASE WHEN delta > 0 AND reason NOT IN ('migration','refund_revoke') THEN delta END) earn,
         -SUM(CASE WHEN delta < 0 THEN delta END) spend,
         COUNT(DISTINCT date(at/1000,'unixepoch','+7 hours')) active_days
  FROM wallet_ledger WHERE wallet='phuc' AND at >= :t30 GROUP BY account_id)
SELECT spend * 1.0 / earn AS ratio FROM f WHERE active_days >= 20;   -- lấy trung vị ở tầng báo cáo
```

### 3.7 `NGOC_PAID_OUTSTANDING` (cho kế toán)

```sql
SELECT SUM(bal) FROM (
  SELECT account_id, SUM(delta) bal FROM wallet_ledger WHERE wallet='ngoc_paid' GROUP BY account_id)
WHERE bal > 0;
```

### 3.8 `DL_PAID_COMPLETION`

```sql
SELECT COUNT(DISTINCT CASE WHEN t.tier >= 30 THEN e.account_id END) * 1.0 / COUNT(DISTINCT e.account_id)
FROM entitlements e
LEFT JOIN daolo_progress t ON t.account_id=e.account_id AND t.chapter_id=e.ref
WHERE e.type='pass_chapter' AND e.ref=:chapter AND e.revoked_at IS NULL;
```

---

## 4. Checklist nghiệm thu phần 23

- [ ] Công cụ mô phỏng in lại §1.2, §1.3, §2.1, §2.2 khớp từng ô.
- [ ] Máy chủ kinh tế chạy kịch bản B 14 ngày (thời gian giả) khớp §1.2.
- [ ] Mỗi KPI phần 12 §4 có truy vấn đã duyệt; truy vấn rào chắn chạy tự động hằng ngày.
