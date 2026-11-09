# 05-15 · Dữ liệu kiểm thử — 13 lá số chạy engine thật và vector kiểm công thức

> Phần này là **bộ kiểm thử chuẩn** của tài liệu 05: (1) 13 lá số đã chạy `analyze()` + `gaimenhPlan()` + các hàm phụ ngày 2026-11-05 (năm tham chiếu 2026, chi năm 午), kèm **đầu ra game mong đợi** theo luật các phần 05-01 … 05-14; (2) vector kiểm từng công thức. Mọi test tự động của hệ cải mệnh (tài liệu 13 cấp mã) lấy dữ liệu từ đây.
> Cách chạy lại: `analyze(năm, tháng, ngày, giờ, phút, giới, 2026)` với giới `'male'` / `'female'`; `gaimenhPlan(R)`; `getYeguoForChart(R)`, `getRemedyForChart(R)` (`remedy-fate`); `computeLiuDao(R)`; `analyzeAmTa(R)`; `personalTaSui(R.chart.pillars.year.zhi, '午')`.
> Nếu engine được sửa (các lỗi ở README), **cập nhật bảng này cùng lúc** — test sẽ báo đỏ có chủ đích.

---

## 1. Mười ba lá số

| Mã | Ngày giờ sinh · giới | Vì sao chọn |
|---|---|---|
| MAU-A | 1990-05-15 08:30 · nam | lá số canon |
| MAU-B | 1995-06-15 08:30 · nam | lá số canon (test A4 của game) |
| V-01 | 1999-05-23 02:00 · nữ | Tiềm Lực < 28 (Phàm Căn), k chạm 1,41 |
| V-02 | 1990-05-24 07:00 · nam | 28–35; tuổi Ngọ phạm Trị + Hình |
| V-03 | 1988-02-03 23:10 · nữ | có Tài Đa Thân Nhược (tổ hợp); Dụng Hỏa |
| V-04 | 2001-11-20 04:00 · nữ | Dụng Mộc; không phạm Thái Tuế |
| V-05 | 1998-07-09 13:00 · nữ | 50–57; sân cao (liudao) |
| V-06 | 1975-08-08 14:00 · nam | (= MAU-C3 ở 05-02) không có D1 |
| V-07 | 1980-03-01 03:00 · nữ | 58–65; cách 成格 |
| V-08 | 2009-09-27 07:00 · nữ | ≥ 73; **D3 có sinh** (lưu niên −1); phạm Hại |
| V-09 | 1984-07-09 04:00 · nữ | phạm **Xung** Thái Tuế |
| V-10 | 2001-04-03 00:00 · nữ | có **D5 Tài đa thân nhược**; `mangpai` ≥ 78 |
| V-11 | 1975-12-08 16:00 · nam | **không có D2** (không tổ hợp hung); D3 có sinh |

---

## 2. Đầu ra engine (rút gọn)

### 2.1 Tổng luận, cách, Dụng

| Mã | Tiềm Lực | `gradeVi` (rút) | `patternQuality` | `pattern.name` | Thân | Dụng / Hỷ / Kỵ |
|---|---|---|---|---|---|---|
| MAU-A | 41 | TRUNG ĐẲNG | 有救 | 七殺格 | vượng | Thủy / Kim / Thổ |
| MAU-B | 48 | TRUNG ĐẲNG THUẬN | 败格 | 正官格 | vượng | Thủy / Kim / Thổ |
| V-01 | 19 | HẠ ĐẲNG | 败格 | 傷官格 | nhược | Thủy / Kim / Thổ |
| V-02 | 33 | TRUNG HẠ | 败格 | 傷官格 | vượng | Thủy / Kim / Thổ |
| V-03 | 46 | TRUNG ĐẲNG THUẬN | 有救 | 偏財格 | nhược | Hỏa / Mộc / Thủy |
| V-04 | 50 | TRUNG THƯỢNG | 败格 | 正官格 | nhược | Mộc / Thủy / Kim |
| V-05 | 53 | TRUNG THƯỢNG | 有救 | 食神格 | vượng | Kim / Thổ / Hỏa |
| V-06 | 56 | TRUNG THƯỢNG | 有救 | 偏財格 | vượng | Thổ / Hỏa / Mộc |
| V-07 | 65 | TRUNG THƯỢNG CAO | 成格 | 傷官格 | nhược | Kim / Thổ / Hỏa |
| V-08 | 80 | THƯỢNG ĐẲNG XUẤT CHÚNG | 成格 | 化金格 | nhược | Kim / Thổ / Hỏa |
| V-09 | 53 | TRUNG THƯỢNG | 有救 | 正財格 | nhược | Thủy / Kim / Thổ |
| V-10 | 46 | TRUNG ĐẲNG THUẬN | 败格 | 正印格 | nhược | Hỏa / Mộc / Thủy |
| V-11 | 58 | TRUNG THƯỢNG CAO | 败格 | 從財格 | nhược | Thủy / Kim / Thổ |

**Quan sát:** V-08 có cách hóa (化金格) nhưng `patternQuality` trả 成格, không phải 特殊; V-11 cách tòng (從財格) cũng không phải 特殊. Trong 4.000 lá số ngẫu nhiên thử thêm, không lá nào có 特殊 → nhánh Dị Cách hiếm tới mức cần lá số dựng tay để test (câu hỏi mở, README).

### 2.2 `gaimenhPlan` — chẩn đoán

| Mã | Chẩn đoán (thứ tự engine · sev) | Tổ hợp hung | `mangpai.score` · `fuguui` | Lưu niên 2026 |
|---|---|---|---|---|
| MAU-A | D1 cao · D2 cao · D4 trung | Thương Quan Kiến Quan; Quan Sát Hỗn Tạp | 52 · Phú Quý cân bằng | 6 · Đại hung |
| MAU-B | D1 cao · D2 cao | Thương Quan Kiến Quan; Kiêu Đoạt Thực; Quan Sát Hỗn Tạp | 75 · QUÝ | 9 · Đại hung |
| V-01 | D1 · D2 · D4 | TQKQ; Kiêu Đoạt Thực; QSHT; Tài Đa Thân Nhược | 49 · PHÚ | 10 · Hung |
| V-02 | D1 · D2 | Kiêu Đoạt Thực | 61 · PHÚ | 23 · Hơi kỵ |
| V-03 | D1 · D2 · D4 | Kiêu Đoạt Thực; QSHT; Tài Đa Thân Nhược | 52 · PHÚ | 63 · Cát |
| V-04 | D1 · D2 · D4 | TQKQ | 52 · QUÝ | 24 · Hơi kỵ |
| V-05 | D1 · D2 · D4 | Kiêu Đoạt Thực | 52 · PHÚ | 29 · Hơi kỵ |
| V-06 | D2 · D4 | Kiêu Đoạt Thực | 52 · PHÚ | 40 · Bình |
| V-07 | D2 · D4 | TQKQ | 44 · QUÝ | 33 · Hơi kỵ |
| V-08 | D2 · **D3** · D4 | QSHT | 44 · Phú Quý cân bằng | **−1** · Đại hung |
| V-09 | D1 · D2 | TQKQ | 57 · PHÚ | 25 · Hơi kỵ |
| V-10 | D1 · D2 · **D5** | QSHT; Tài Đa Thân Nhược | 79 · PHÚ | 42 · Bình |
| V-11 | **D3** · D4 | — | 47 · PHÚ | **−1** · Đại hung |

*(«Phú Quý cân bằng» không có chữ PHÚ/QUÝ đứng đầu; bảng ghi nguyên cụm.)*

### 2.3 Thái Tuế 2026, Lục Đạo, âm tà, nghiệp theo lá số, ba lớp thuốc

| Mã | Chi năm · phạm (`personalTaSui`) | `liudao.primary` · tham / sân / si | `analyzeAmTa` level · điểm | `getYeguoForChart` | `getRemedyForChart` (relevant · needLevel) | `rescues[].drug` |
|---|---|---|---|---|---|---|
| MAU-A | 午 · Trị + Hình · nặng | 人道 · 29 / 37 / 27 | high · 12 | (rỗng) | Nhật Chủ nhược + Cách bại · **thấp** (fallback) | shi, cai |
| MAU-B | 亥 · không | 人道 · 8 / 40 / 27 | low · 3 | Thâu đạo; nghiệp tổng (bại) | Cách bại · trung | yin, ti |
| V-01 | 卯 · Phá · nhẹ | 饿鬼道 · 75 / 17 / 27 | medium · 7 | Thâu đạo; nghiệp tổng | Nhật Chủ nhược + Cách bại · cao | yin |
| V-02 | 午 · Trị + Hình · nặng | 阿修罗道 · 29 / 30 / 27 | high · 12 | Thâu đạo; Ỷ ngữ; nghiệp tổng | Thương Quan kiến Quan + Cách bại · cao | — |
| V-03 | 卯 · Phá · nhẹ | 饿鬼道 · 67 / 23 / 27 | high · 14 | Thâu đạo | Nhật Chủ nhược · trung | shi, shi |
| V-04 | 巳 · không | 人道 · 24 / 53 / 27 | medium · 9 | Thâu đạo; nghiệp tổng | Nhật Chủ nhược + Cách bại · cao | yin |
| V-05 | 寅 · không | 阿修罗道 · 21 / 73 / 27 | high · 12 | Ỷ ngữ | Thương Quan kiến Quan · trung | cai |
| V-06 | 卯 · Phá · nhẹ | 天道 · 16 / 30 / 27 | low · 5 | Thâu đạo | Nhật Chủ nhược + Cách bại · **thấp** (fallback) | shi, shi |
| V-07 | 申 · không | 人道 · 16 / 53 / 27 | minimal · 0 | Thâu đạo; Ỷ ngữ | Nhật Chủ nhược + Thương Quan kiến Quan · cao | — |
| V-08 | 丑 · Hại · nhẹ | 饿鬼道 · 59 / 33 / 47 | medium · 11 | Thâu đạo | Nhật Chủ nhược · trung | — |
| V-09 | 子 · Xung · nặng | 人道 · 24 / 7 / 27 | high · 14 | Thâu đạo | Nhật Chủ nhược · trung | shi, shi |
| V-10 | 巳 · không | 饿鬼道 · 88 / 50 / 27 | high · 12 | Thâu đạo; nghiệp tổng | Nhật Chủ nhược + Cách bại · cao | ti |
| V-11 | 卯 · Phá · nhẹ | 人道 · 24 / 27 / 53 | medium · 9 | Thâu đạo; nghiệp tổng | Nhật Chủ nhược + Cách bại · cao | — |

**Quan sát kiểm lỗi engine (khớp README):**
- Thâu đạo xuất hiện ở 11 / 13 lá số → xác nhận nhánh quá rộng; game tắt cảnh báo này (05-05 §3.2).
- MAU-A can lộ có 劫財 nhưng không ra Sân → xác nhận lỗi giản / phồn thể.
- MAU-A, V-06 thân **vượng** nhưng `getRemedyForChart` trả «Nhật Chủ nhược» (fallback, needLevel thấp) → game không hiện fallback (05-01 §3.9).
- V-07 thân nhược, cách 成格 nhưng `relevant` có «Nhật Chủ nhược» thật (không phải fallback, vì needLevel cao) → hiện bình thường.

---

## 3. Đầu ra game mong đợi

### 3.1 Hệ số, ái lực, Vận

| Mã | k (05-01 §3.2) | `a` theo đạo (05-06 §4.3; hiện các đạo ≠ 0) | Trần vận · Nghịch Duyên (05-01 §2.5) |
|---|---|---|---|
| MAU-A | 1,19 | BD 10 · MT 10 · TH 5 · TT 5 · BM 5 | 10% · bật |
| MAU-B | 1,12 | BD 10 · MT 10 · TH 5 · TT 5 · BM 5 | 10% · bật |
| V-01 | 1,41 | như MAU-A | 10% · bật (Hung) |
| V-02 | 1,27 | như MAU-A | 10% · bật (Hơi kỵ) |
| V-03 | 1,14 | CN 10 · TT 10 · TV 5 · TD 5 · MT 5 · NH 5 · BM 5 | 15% · tắt (Cát) |
| V-04 | 1,10 | TV 10 · TD 10 · NH 10 · BD 5 · MT 5 · BM 10 | 10% · bật |
| V-05 | 1,07 | TH 10 · CN 5 · TC 5 · BD 5 | 10% · bật |
| V-06 | 1,04 | TC 10 · CN 5 · TV 5 · TT 5 · TD 5 | 12% · tắt (Bình) |
| V-07 | 1,00 | TH 10 · CN 5 · TC 5 · BD 5 | 10% · bật |
| V-08 | 1,00 | TH 10 · CN 5 · TC 5 · BD 5 | 10% · bật |
| V-09 | 1,07 | như MAU-A | 10% · bật |
| V-10 | 1,14 | như V-03 | 12% · tắt |
| V-11 | 1,02 | như MAU-A | 10% · bật |

*(BM có hành chính Mộc, phụ Thủy: Dụng Mộc → 10%; Dụng Thủy → 5%.)*

### 3.2 Mệnh Đồ — số đèn và thứ tự gợi ý (05-02 §3)

Giả định người chơi mới, **chưa có nhà riêng** (+0,5 cho nút Không Gian).

| Mã | Không Gian | Danh | Thời | Thái Tuế | Làm Công | Tích Âm Đức | Thứ tự gợi ý |
|---|---|---|---|---|---|---|---|
| MAU-A | 3 | 3 | 3 | **4** | 2 | 2 | Thái Tuế → Không Gian → Danh → Thời → Làm Công |
| MAU-B | 3 | 3 | 3 | 3 | 1 | 3 | Không Gian → Danh → Thời → Thái Tuế → Làm Công |
| V-01 | 3 | 3 | 3 | **4** | 2 | 3 | Thái Tuế → Không Gian → Danh → Thời → Làm Công |
| V-02 | 3 | 3 | 2 | **4** | 1 | 3 | Thái Tuế → Không Gian → Danh → Thời → Làm Công |
| V-03 | 3 | 3 | 2 | **4** | 2 | 2 | Thái Tuế → Không Gian → Danh → Thời → Làm Công |
| V-04 | 3 | 3 | 2 | 3 | 2 | 3 | Không Gian → Danh → Thái Tuế → Thời → Làm Công |
| V-05 | 3 | 3 | 2 | 3 | 2 | 2 | Không Gian → Danh → Thái Tuế → Thời → Làm Công |
| V-06 | 2 | 1 | 1 | **4** | 2 | 2 | Thái Tuế → Không Gian → Làm Công → Danh → Thời |
| V-07 | 2 | 1 | 1 | 3 | 2 | 2 | Thái Tuế → Không Gian → Làm Công → Danh → Thời |
| V-08 | 2 | 1 | 3 | **4** | 2 | 2 | Thái Tuế → Thời → Không Gian → Làm Công → Danh |
| V-09 | 3 | 3 | 2 | **4** | 1 | 2 | Thái Tuế → Không Gian → Danh → Thời → Làm Công |
| V-10 | 3 | 3 | 2 | 3 | 2 | **4** | Không Gian → Danh → Thái Tuế → Thời → Làm Công (Tích Âm Đức 4 đèn: hằng ngày) |
| V-11 | 2 | 1 | 3 | 2 | 2 | 2 | Thời → Không Gian → Thái Tuế → Làm Công → Danh |

**Tính tay hai dòng khó (để test viết đúng):**
- V-08: Thời = 1 + 1 (D3 chính, w trung = 1) + 1 (Đại hung) = 3. Thái Tuế = 1 + 2 (D2) + 0,5 (D3 phụ) + 0,5 (Hại nhẹ) = 4.
- V-10: Tích Âm Đức = 1 + 0,5 × 2 (D2 phụ) + 0,5 × 1 (D5 phụ) + 1 (败格) = 3,5 → `Math.round` = 4. Làm Công = 1 + 1 (D5 chính) = 2.

### 3.3 Mệnh Đồ — nhiệm vụ biến thể sinh ra

| Mã | Thời (CQ-MD-33x) | Thái Tuế (kiểu phạm) | Chuỗi tổ hợp hung | Làm Công (`level` → số bước; `fuguui`) | Đắc Cứu |
|---|---|---|---|---|---|
| MAU-A | 33c giữ | -41 Trị, -43 Hình | -53, -55 | trung → 4; cân bằng (chọn P/Q) | -92, -93 |
| MAU-B | 33c | -46 không phạm | -53, -54, -55 | trung thượng → 3; Q | — (bại cách: `rescues` không dùng) |
| V-01 | 33c | -44 Phá | -53, -54, -55, -56 | trung → 4; P | — |
| V-02 | 33c | -41, -43 | -54 | trung → 4; P | — |
| V-03 | 33a tiến | -44 | -54, -55, -56 | trung → 4; P | -92 |
| V-04 | 33c | -46 | -53 | trung → 4; Q | — |
| V-05 | 33c | -46 | -54 | trung → 4; P | -93 |
| V-06 | 33b ổn | -44 | -54 | trung → 4; P | -92 |
| V-07 | 33c | -46 | -53 | thường → 5; Q | — |
| V-08 | 33c | -45 Hại | -55 | thường → 5; cân bằng | — |
| V-09 | 33c | -42 Xung | -53 | trung → 4; P | -92 |
| V-10 | 33b | -46 | -55, -56 | cao → 2; P | — |
| V-11 | 33c | -44 | — | trung → 4; P | — |

### 3.4 Người dẫn đạo tìm tới (bản sơ đồ §5.2)

| Mã | Vân Cốc (score < 46) | Vân Cốc + Tế tửu (败格) | Đan Đỉnh (有救) | Diệu Âm (Lục Đạo dữ) | Mao Sơn (amta ≥ medium, **chỉ khi opt-in**) |
|---|---|---|---|---|---|
| MAU-A | ✓ | | ✓ | | ✓ |
| MAU-B | | ✓ | | | |
| V-01 | ✓ | ✓ | | ✓ (饿鬼) | ✓ |
| V-02 | ✓ | ✓ | | | ✓ |
| V-03 | | | ✓ | ✓ (饿鬼) | ✓ |
| V-04 | | ✓ | | | ✓ |
| V-05 | | | ✓ | | ✓ |
| V-06 | | | ✓ | | |
| V-07 | | | | | |
| V-08 | | | | ✓ (饿鬼) | ✓ |
| V-09 | | | ✓ | | ✓ |
| V-10 | | ✓ | | ✓ (饿鬼) | ✓ |
| V-11 | | ✓ | | | ✓ |

V-07 không có ai «tìm tới» — người chơi gặp NPC dẫn đạo theo cốt truyện thường (Hồi I nhánh Thuận Thiên). Đây là ca test «lá số tốt vẫn có Mệnh Đồ, vẫn có nút Tích Âm Đức».

### 3.5 Cảnh báo nghiệp theo lá số (05-05 §3.3)

| Mã | KARMA-SAT | KARMA-SAN | KARMA-AC / Y | KARMA-THAM | KARMA-SI | Thâu đạo |
|---|---|---|---|---|---|---|
| MAU-A | — | — | — | — | — | tắt |
| MAU-B | — | — | — | — | — | tắt |
| V-01 | — | — | — | ✓ (tham 75) | — | tắt |
| V-02 | — | — | ✓ (Thương Quan) | — | — | tắt |
| V-03 | — | — | — | ✓ (67) | — | tắt |
| V-04 | — | ✓ (sân 53) | — | — | — | tắt |
| V-05 | — | ✓ (73) | ✓ | — | — | — |
| V-06 | — | — | — | — | — | tắt |
| V-07 | — | ✓ (53) | ✓ | — | — | tắt |
| V-08 | — | — | — | ✓ (59) | — | tắt |
| V-09 | — | — | — | — | — | tắt |
| V-10 | — | ✓ (50) | — | ✓ (88) | — | tắt |
| V-11 | — | — | — | — | ✓ (si 53) | tắt |

*(MAU-A sẽ có cảnh báo Sân sau khi engine sửa nhánh Kiếp Tài; khi đó cập nhật dòng này.)*

### 3.6 Thẻ Tam Tầng Dược (05-01 §3.9)

| Mã | Hiện | Lý do |
|---|---|---|
| MAU-A, V-06 | chỉ lớp 心 của #7 («Khiêm là thuốc nhanh nhất»), nhãn «lời khuyên chung» | fallback (`needLevel` thấp, mâu thuẫn thân vượng / 有救) |
| MAU-B | #7 đủ 3 lớp | |
| V-01, V-04, V-10, V-11 | #1 + #7 đủ 3 lớp | |
| V-02 | #5 + #7 | |
| V-03, V-08, V-09 | #1 | |
| V-05 | #5 | |
| V-07 | #1 + #5 | |

---

## 4. Vector kiểm công thức

### 4.1 Hệ số Nghịch Thiên

| Tiềm Lực | k mong đợi |
|---|---|
| 0 | 1,50 |
| 10 | 1,50 |
| 11 | 1,49 |
| 19 | 1,41 |
| 41 | 1,19 |
| 59 | 1,01 |
| 60 | 1,00 |
| 100 | 1,00 |

### 4.2 Đạo Hạnh một lần nhận (05-01 §3.1)

| # | B | k | a | n | Đã dùng hôm nay (gốc) | ΔĐH mong đợi |
|---|---|---|---|---|---|---|
| 1 | 12 | 1,19 | 0,05 | 0,10 | 0 | 16 |
| 2 | 12 | 1,00 | 0 | 0 | 0 | 12 |
| 3 | 12 | 1,00 | 0 | 0 | 115 (5 trong hạn, 7 vượt hạn mềm) | 5 + round(7 × 0,25) = 5 + 2 = 7 |
| 4 | 12 | 1,00 | 0 | 0 | 200 | 0 |
| 5 | 10 | 1,41 | 0,10 | 0 | 0 | 16 |
| 6 | 8 (Ngũ Bộ) | 1,19 | 0 | 0,10 | 0 | 10 |

*(Ca 3: phần trong hạn và phần vượt hạn tính riêng rồi cộng; k, a, n nhân trên cả hai phần — ở đây bằng 1.)*

### 4.3 Vận Phù (05-01 §2.5)

| # | P₀ | Vận Phù áp dụng | Rating | P mong đợi |
|---|---|---|---|---|
| 1 | 15 | Hợp Mệnh 10 + Phương Vị 5 + Dưỡng 5 | Đại hung | 17 |
| 2 | 15 | như trên | Cát | 17 (15 × 1,15 = 17,25) |
| 3 | 15 | Hợp Mệnh 10 | Bình | 17 (16,5 → 17) |
| 4 | 15 | — | Cát | 15 |
| 5 | 3 | Hợp Mệnh 10 | Cát | 3 (3,3 → 3) |

### 4.4 Sổ Công Quá

| # | Dòng đưa vào `meritLedger` | `net` mong đợi | `verdict` |
|---|---|---|---|
| 1 | `{thien, 'Cứu người nguy cấp', 1}` | 3 | Tích tiểu thiện — tiếp tục |
| 2 | 1 + `{thien, 'Phóng sinh (cứu mạng)', 3}` | 12 | ★ Tích đức tốt |
| 3 | `{ac, 'Dối trá/lừa gạt', 1}` | −2 | ⚠ Quá nặng hơn công |
| 4 | (rỗng) | 0 | Cân bằng |
| 5 | `{thien, 'DEED-031', 1}` (**sai** — gửi mã thay vì chuỗi app) | 1 (p mặc định) | test phải **báo lỗi** ở tầng game trước khi gọi engine |

### 4.5 Nhật hạn công

| # | Công hữu hiệu đã có hôm nay | DEED mới | Hữu hiệu? |
|---|---|---|---|
| 1 | 14 | T-CN +3 | **không** — dòng chỉ hữu hiệu khi tổng sau cộng ≤ 15; vượt thì **cả dòng** không hữu hiệu (không cắt lẻ dòng) |
| 2 | 12 | T-CN +3 | có (15) |
| 3 | 0 | T-PS +3 lần thứ 3 trong ngày | không (trần nhóm T-PS 6) |
| 4 | 0 | giúp cùng NPC lần 2 trong 24 giờ | không (CC-3) |

*(Ca 1 chốt luật «không cắt lẻ dòng» — bổ sung cho 05-03 CC-1.)*

### 4.6 Phạm giới (05-01 §3.7)

| # | Bậc | ĐH hiện tại | Trừ mong đợi |
|---|---|---|---|
| 1 | 2 | 250 | 20 |
| 2 | 4 | 1.350 | 20 (1% = 13,5 → lên 14, nhưng tối thiểu 20) |
| 3 | 5 | 2.840 | 29 |
| 4 | 6 | 6.001 | 61 |

Hoàn: sám + sửa trong 7 ngày → 100%; ngày thứ 8 → 50% (làm tròn xuống).

### 4.7 Thanh nghiệp (05-05 §2.3, §2.5)

| # | Sự kiện | Thanh sau |
|---|---|---|
| 1 | DEED-212 (p 3) | KARMA-DAO 24 |
| 2 | 1 → việc sửa | 12 |
| 3 | 2 → Lễ Phát Lộ (30% × 24 = 7,2 → 7) | 5 |
| 4 | 3 → giữ giới 7 ngày (20% × 24 = 4,8 → 5) | 0 |
| 5 | thẻ `luong` 4 lần cùng ngày | KARMA-LUONG 12 (trần +12 / ngày) |

### 4.8 Nợ Âm (05-12 §3.2, §4)

| # | ΔĐH thêm | Nợ Âm cộng mong đợi |
|---|---|---|
| 1 | 0 | 0 (không tính lần dùng) |
| 2 | 1 | 5 + ceil(1,5) = 7 |
| 3 | 14 | 26 |
| 4 | 33 | 5 + ceil(49,5) = 55 |
| 5 | việc yểm | 80 |

Kiểm «tổng lợi âm»: với mọi k ∈ {1,00; 1,19; 1,50} và X ∈ {1 … 200}: `2k(5 + 1,5X)/3 − X > 0`.

### 4.9 Cảnh giới (05-01 §4.1)

| # | Tiềm Lực | ĐH | Điều kiện khác | Bậc mong đợi |
|---|---|---|---|---|
| 1 | 41 | 84 | đã nhận Sổ | 2 (84 + 16,4 = 100,4) |
| 2 | 88 | 365 | 1 đạo hạng II, 1 nút Mệnh Đồ | 3 (365 + 35,2 = 400,2) |
| 3 | 88 | 990 | đủ điều kiện bậc 4 | 3 (bậc 4 chỉ tính ĐH) |
| 4 | 20 | 2.300 | Nợ Âm 15 | 4 (bậc 5 chặn) |
| 5 | 50 | 5.000 | đủ mọi thứ trừ QN-5 (Mệnh Đồ thiếu nút Thời) | 5 |
