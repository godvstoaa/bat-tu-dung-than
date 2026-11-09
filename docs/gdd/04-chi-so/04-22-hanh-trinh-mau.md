# 04-22 · Hành trình mẫu 120 ngày — bốn người chơi, lịch thật

## 0. Mục đích và giả định

Cho 03 (nhịp cốt truyện), 09 (nhịp hoạt động) và 12 (nhịp thông báo) một bức tranh **cụ thể theo ngày** về việc các chỉ số của 04 «xảy ra» thế nào trong ba tháng đầu, với lịch can chi **thật** (người chơi bắt đầu ngày **2026-11-05**).

| Giả định | Giá trị |
|---|---|
| Nhịp chơi | «Đều»: 40 công tu/ngày, mỗi ngày đều chơi |
| R1 (năng khiếu) | 0 — để bảng bảo thủ; R1 thật sẽ làm mọi mốc **sớm hơn** |
| R2 (thiên thời) | chỉ tính **mùa** (+2% khi mùa = Dụng) và **Thời Vận** thật của từng người; không tính vùng / giờ |
| R3 (thử thách) | 0 — người chơi mẫu không cố ý chọn việc Kỵ |
| Lịch | mùa theo tiết khí thật: 07/11 Lập Đông (Hợi, Thủy) · 07/12 Đại Tuyết (Tý, Thủy) · 05/01/2027 Tiểu Hàn (Sửu, Thổ) · 04/02/2027 Lập Xuân (Dần, Mộc; năm 丁未) |
| Thời Vận | đọc từ engine với `refYear` 2026 trước Lập Xuân, 2027 sau Lập Xuân |

## 1. Lịch sự kiện chung (120 ngày đầu)

Tính bằng `lunar-javascript`. Ngày thứ N = 2026-11-05 + (N − 1).

| Ngày | Dương lịch | Can chi ngày | Sự kiện lịch | Tác động hệ 04 |
|---|---|---|---|---|
| 3 | 07/11/2026 | 乙酉 | tiết **Lập Đông** | mùa sang Thủy (R2 +2% cho Dụng Thủy) · `PERK-luShen/Q1` «Bát cơm đầu mùa» |
| 5 | 09/11 | 丁亥 | mùng 1 tháng Mười | sự kiện chung (10) |
| 18 | 22/11 | 庚子 | tiết Tiểu Tuyết | — |
| 19 | 23/11 | 辛丑 | **rằm** tháng Mười | `PERK-yueDe/Q1` «Rằm của người khác» (nếu đã cảnh giới 2) |
| 33 | 07/12 | 乙卯 | tiết Đại Tuyết | nguyệt chi Tý (vẫn Thủy) |
| 35 | 09/12 | 丁巳 | mùng 1 tháng Một | — |
| 48 | 22/12 | 庚午 | Đông Chí | — |
| 49 | 23/12 | 辛未 | rằm tháng Một | — |
| 62 | 05/01/2027 | 甲申 | tiết **Tiểu Hàn** | mùa sang Thổ (tháng Sửu, tứ quý) |
| 65 | 08/01 | 丁亥 | mùng 1 tháng Chạp | — |
| 77 | 20/01 | 己亥 | Đại Hàn | — |
| 79 | 22/01 | 辛丑 | rằm tháng Chạp | — |
| 92 | 04/02/2027 | 甲寅 | tiết **Lập Xuân** — năm 丁未 bắt đầu | Thời Vận đọc lại (cảnh `STAT-CANH-TV-05`); mùa Mộc; `PERK-luShen/Q1` lần 2 |
| 94 | 06/02 | 丙辰 | **Tết** Đinh Mùi (mùng 1 tháng Giêng) | cảnh Tết (10); ghi chú «năm can chi đã đổi từ Lập Xuân» |
| 107 | 19/02 | 己巳 | Vũ Thủy | — |
| 108 | 20/02 | 庚午 | rằm tháng Giêng | — |

Lưu ý: không có ngày Thiên Xá (戊寅 xuân / 甲子 đông) rơi trong cửa sổ trừ khi mùa khớp; Thái Tuế Điện báo trước ba ngày khi có.

## 2. Bốn người chơi

| | `MAU-C` | `MAU-A` | `MAU-J` | `MAU-L` |
|---|---|---|---|---|
| Tiềm Lực / Phẩm căn | 23 · Phàm Căn | 41 · Tứ Linh Căn | 76 · Song Linh Căn thượng | 86 · Thiên Linh Căn |
| NT | ×1,37 | ×1,19 | ×1,00 | ×1,00 |
| Dụng | Mộc | Thủy | Mộc | Hỏa |
| Mệnh Cách | Nghịch Thiên | Đắc Cứu | Dị Cách (Chuyên Thủy) | Thuận Thiên |
| Thời Vận 2026 (DV · LN) | Cát · Bình → R2 +4% | Bình hòa · Đại hung → R2 0, R3 +15% | Hơi nghịch · Hơi kỵ → R2 0, R3 +5% / +5% | Hơi thuận · Bình → R2 +2% |
| Thời Vận 2027 (sau Lập Xuân) | Cát · **Cát** → R2 +6% | **乙酉 mới (Bình hòa)** · Cát → R2 +2% | Hơi nghịch · Bình → R2 0 | Hơi thuận · **Đại cát** → R2 +6% |
| Mùa hợp Dụng trong 120 ngày | từ ngày 92 (Mộc) | ngày 3–61 (Thủy) | từ ngày 92 | không có (Hỏa vào hạ) |

## 3. Mốc cảnh giới (ngày đạt)

| Bậc | `MAU-C` | `MAU-A` | `MAU-J` | `MAU-L` |
|---|---|---|---|---|
| 2 | ngày 2 (06/11) | 2 (06/11) | 2 (06/11) | 2 (06/11) |
| 3 | **7** (11/11) | 8 (12/11) | 10 (14/11) | 9 (13/11) |
| 4 | **18** (22/11) | 21 (25/11) | 25 (29/11) | 25 (29/11) |
| 5 | **39** (13/12) | 46 (20/12) | 55 (29/12) | 54 (28/12) |
| 6* | **79** (22/01/2027) | 94 (06/02, đúng Tết) | 113 (25/02) | 110 (22/02) |
| Đạo Hạnh ngày 120 | 6.962 | 5.844 | 4.864 | 4.985 |

\* Bậc 6 còn cần «Quy nhất» (≥ 3 đạo thống + Sổ Công Quá dương). Ngày ghi là ngày **đủ Đạo Hạnh**.

So với bảng chuẩn 04-08 §4.2 (không thiên thời): `MAU-L` nhanh hơn 3 ngày nhờ Đại cát 2027 + Hơi thuận; `MAU-C` nhanh hơn 4 ngày nhờ đại vận Cát. Thiên thời thật dịch mốc vài ngày — đúng tinh thần «ảnh hưởng nhỏ».

## 4. Dòng thời gian từng người

### 4.1 `MAU-C` — Phàm Căn, Nghịch Thiên

| Ngày | Sự kiện hệ 04 |
|---|---|
| 1 | Cổng: Lão Tùng mở cổng phụ (`STAT-LOI-01`); gieo hạt đào (Khổ tận cam lai chặng 1). Mệnh Bàn: câu dẫn gốc. Cảnh `MB-NT` — từ chối, chỉ đường Am Vân Cốc. Túc Nghiệp: «Địa Ngục Hồi Quang» (đêm 1). |
| 2 | Bậc 2 → Khổ tận cam lai chặng 2 (Vân Cốc kể Liễu Phàm, mở Sổ Công Quá). Chuỗi ẩn «Khởi Sắc Muộn» chặng 1 (hạc giấy). Bổ Khuyết chương 1 (Thương đạo, Tài 31). |
| 3 | Lập Đông — «Bát cơm đầu mùa» không mở (không có Lộc Thần). |
| 3–9 | Hạc giấy 7 sáng liền → thư ở Thư Lâu Lâm. Chuỗi Bổ Dụng Mộc (vườn ươm Lịch Đường, 7 sáng). |
| 7 | Bậc 3 → chặng 3 (tặng hoa đào cho 3 NPC). Ải tâm ma Sân (57 → 3 tầng) bắt đầu khả dụng. |
| 10 | Bổ Dụng Mộc xong: Sinh Cơ 6 → 11 (tầng 1, chưa lên tầng 2 — cần 12). |
| 14 | Thêm 1 điểm Bổ Hành tuần → Sinh Cơ 12 → **tầng 2** (thông báo tầng). |
| 18 | **Bậc 4** — cảnh `CG4-01` + đoạn cây đào ra hoa; danh hiệu «Khổ Tận Cam Lai». Tiên Thiên thôi tính. |
| 19 | Rằm tháng Mười — không có Nguyệt Đức. |
| 30–40 | Kiếp số: không có sao hung → không ải kiếp. Đặc Tính Thiên Xá: chờ ngày 甲子 mùa đông (ngày Thiên Xá gần nhất — Thái Tuế Điện báo). |
| 39 | **Bậc 5** — Khổ tận cam lai chặng 5 (quả đào, áo vải bạc màu). |
| 79 | Đủ Đạo Hạnh bậc 6 — **sớm nhất** bốn người. |
| 92 | Lập Xuân: mùa Mộc (Dụng) +2%; lưu niên 2027 Cát. |

### 4.2 `MAU-A` — Tứ Linh Căn, Đắc Cứu

| Ngày | Sự kiện hệ 04 |
|---|---|
| 1 | Cảnh `MB-DC` — Tờ phương mệnh: 2 vị (Tú Linh Quả — Thủy; Kim Tiền Thảo — Mộc). Đoạn phụ: Dụng Khuyết (`STAT-LOI-06`), kiếp số Lưu Hà (có Đức → 2 chặng). Túc Nghiệp: «Nhân Gian Tái Thế». |
| 2 | Bậc 2. Bổ Khuyết chương 1 (Nghệ đạo, Thực 15). |
| 3 | Lập Đông: **mùa Thủy = Dụng** → R2 +2% suốt tới ngày 61. |
| 3–9 | Bổ Dụng Thủy (Thư Lâu Lâm, 3 đêm + kể đoạn mất). Võ Đang: Đan Đỉnh đọc phương. |
| 8 | Bậc 3. |
| 10–20 | Hái Tú Linh Quả (Võ Đang) — trùng mạch Bổ Thủy; việc Thủy ở vùng Thủy, mùa Thủy: thiên thời cao nhất trong năm của người này. |
| 2026 cả năm | Lưu niên 丙午 Đại hung → «Năm Hạn» mở sớm (cảnh `STAT-CANH-TV-02`, đèn Thái Tuế); việc thử thách +15% — người chơi mẫu không tận dụng, bảng §3 chưa tính. |
| 21 | Bậc 4. |
| 30–45 | Hái Kim Tiền Thảo (chợ Huyền Thành) → thuốc thành (`DC-99`) — «Bại mà có thành». |
| 46 | Bậc 5. |
| 62 | Tiểu Hàn: mùa Thổ = **Kỵ** → việc Thổ là cửa thử thách; không còn +2% mùa. |
| 92 | **Lập Xuân 2027 = bước qua cổng đại vận 乙酉** (cảnh `STAT-CANH-TV-01`) cùng lúc lưu niên đổi sang Cát. Hai sự kiện trùng ngày → gộp thành một cảnh dài (thông báo «Vận mới» + «Năm mới» dồn một). |
| 94 | Đủ Đạo Hạnh bậc 6 — trùng Tết. |

### 4.3 `MAU-J` — Song Linh Căn thượng, Dị Cách (Chuyên Lộ · Thủy)

| Ngày | Sự kiện hệ 04 |
|---|---|
| 1 | Cảnh `MB-DK` → Phương sĩ ở quán trà khi trời đổi gió (sự kiện thời tiết đầu tiên, có thể ngày 1–3). Chuông Sơn Môn ngân 1 tiếng (PC8). Túc Nghiệp: «Nhân Gian Tái Thế». |
| 2 | Bậc 2. Bổ Khuyết chương 1 (Trị đạo, Quan 12). |
| 3–61 | Mùa Thủy — không phải Dụng (Dụng Mộc). Người chơi Chuyên Thủy được Phương sĩ dặn «tìm khe mà chảy»: việc Mộc (tiết tú). |
| 10 | Bậc 3. |
| 2026 | Đại vận 庚戌 «Hơi nghịch» (chi 戌 Thổ = Quan Sát với nhật chủ Thủy — chính bệnh tiềm ẩn `latent-guan`): cổng vận hiện «Thế Ẩn Họa». R3 thử thách +5% (đại vận) +5% (lưu niên Hơi kỵ). |
| 25 | Bậc 4. Nguyên Khí «Mùa dưỡng sức» (`currentVitality` 38) suốt 120 ngày: trà và giấc ngủ hồi thêm 25%. |
| 55 | Bậc 5. |
| 92 | Lập Xuân: mùa Mộc = Dụng (+2%); lưu niên 2027 «Bình» (R3 năm về 0, đại vận vẫn +5%). |
| 113 | Đủ Đạo Hạnh bậc 6. |

### 4.4 `MAU-L` — Thiên Linh Căn, Thuận Thiên

| Ngày | Sự kiện hệ 04 |
|---|---|
| 1 | Chuông ngân 3 tiếng. Cảnh `MB-TT` — vào thẳng nội môn. Đoạn phụ PC8–10 (`STAT-LOI-20`). Túc Nghiệp: «Nhân Gian Tái Thế». |
| 2 | Bậc 2. Ải giữ cách theo `R.dayun` thật: hai đại vận cách-nghịch **庚午 (30–39 tuổi, `gejuDelta` −2)** và **辛未 (40–49, −2)** → hai ải giữ cách ở Vận Mệnh Các; ải đầu gần nhất (người chơi 27 tuổi năm 2026, cổng 庚午 bắt đầu khoảng 2028–2029 — đọc `startYear` thật). Cổng 壬申, 癸酉 (+2) sáng «cách-thuận». |
| 9 | Bậc 3. |
| 25 | Bậc 4 — cùng ngày với `MAU-J` dù Tiềm Lực cao hơn 10 điểm (cả hai NT 1,00). |
| 54 | Bậc 5. |
| 92 | Lập Xuân 2027: lưu niên 丁未 **Đại cát** (điểm 89) → R2 +6% (gồm Hơi thuận đại vận) — «Năm đỉnh». |
| 110 | Đủ Đạo Hạnh bậc 6 — muộn hơn `MAU-C` 31 ngày. Ải Mạn đầy đủ (5 nhường) chờ ở Côn Lôn. |

## 5. Bài học cho các tài liệu khác

| Cho | Bài học |
|---|---|
| 03 | Bậc 2 đến ngày thứ 2 với mọi người → các cảnh «nhập môn» của mọi nhánh phải xong trong 2 phiên. Bậc 4 rơi vào ngày 18–25: Hồi I nên kết thúc quanh đó (khi Tiên Thiên thôi tính — cảnh `CG4-01` là một cao trào tự nhiên). |
| 03 | Người Nghịch Thiên điểm thấp lên bậc 6 trước Tết (ngày 79), người điểm cao sau Tết — có thể làm một sự kiện Tết «người đi trước chờ người đi sau» ở Côn Lôn. |
| 09 | 40 công tu/ngày là ~1 phiên 25–30 phút. Nếu 09 định nhịp nhanh hơn, bảng §3 co lại tương ứng (04-08 §4.3). |
| 10 | Lập Xuân và Tết cách nhau 2 ngày năm 2027 — gộp sự kiện, nhưng hiện đúng câu «năm can chi đổi từ Lập Xuân». |
| 12 | Ngày 92 của `MAU-A` có hai thông báo lớn trùng (vận mới + năm mới) — cần hàng đợi thông báo gộp. |

## 6. Checklist nghiệm thu phần 04-22

- [ ] Lịch §1 tái tạo bằng `lunar-javascript`.
- [ ] Mốc §3 tái tạo bằng công thức 04-08 với R2 theo mùa và Thời Vận thật.
- [ ] Thông báo trùng ngày được gộp.
