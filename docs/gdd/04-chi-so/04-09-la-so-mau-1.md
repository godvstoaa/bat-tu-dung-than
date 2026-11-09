# 04-09 · Lá số mẫu (1/2): `MAU-A` … `MAU-H`

## 0. Cách đọc

- Mỗi mẫu chạy **engine thật** của repo (`analyze(y, m, d, h, mi, gender, 2026)`), không chỉnh tay. Bảng sinh tự động bằng bản tham chiếu `buildMenhBan` (04-01 §4); số thập phân in theo engine (dấu chấm).
- `refYear = 2026` cho Thời Vận và sinh lực hiện tại. Tiên Thiên không phụ thuộc năm này (04-01 N4).
- Cột «Lý do» của bảng «Vì sao?» là câu gốc engine cắt ở 140 ký tự; mặt chính của game dùng câu diễn giải ở 04-02 §3.2.
- Bậc Đặc Tính `[I]` / `[II]` theo 04-06 §2.1.
- Mục «Đọc trong game» là cách các hệ thống của tài liệu 04 dùng lá số này (gợi ý cho 03 / 06; kịch bản thật do 03 viết).

Bảng phủ yêu cầu canon §11:

| Mẫu | Tiềm Lực | Khoảng điểm | Mệnh Cách | Vai trò kiểm thử |
|---|---|---|---|---|
| `MAU-A` | 41 | 36–42 | Đắc Cứu (七殺格) | mẫu chung canon |
| `MAU-B` | 48 | 43–49 | Nghịch Thiên (正官格) | mẫu chung canon; ca làm tròn Thân Lực 62 |
| `MAU-C` | 23 | **< 28** | Nghịch Thiên (食神格) | Phàm Căn; Mệnh Cấp bị chặn theo điểm |
| `MAU-D` | 29 | **28–35** | Nghịch Thiên (偏印格) | Ngũ Linh Căn; Dụng Kim = 0% |
| `MAU-E` | 45 | 43–49 | **Đắc Cứu** (偏財格) | 2 vị thuốc cùng nhóm; Quý Khí vi bạc |
| `MAU-F` | 53 | **50–57** | Đắc Cứu (月劫格, luyue) | vị thuốc kép `ti+yin`; sinh 1957 |
| `MAU-G` | 63 | **58–65** | **Thuận Thiên** (傷官格) | Thuận Thiên hiếm; Mộc 0% |
| `MAU-H` | 70 | 66–72 | Thuận Thiên (正官格) | Thân trung hòa; kiếp số Tứ Phế |

---

## `MAU-A` · 1990-05-15 08:30, nam

Chạy lại: `analyze(1990, 5, 15, 8, 30, 'nam', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 庚午 | 辛巳 | 庚辰 | 庚辰 |
| Nạp âm | 路旁土 | 白蜡金 | 白蜡金 | 白蜡金 |
| Thập thần can | 比肩 | 劫財 | (Nhật chủ) | 比肩 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **41** (hơn 31% lá số) | `synthesis.score` / `percentile` |
| STAT-PHAMCAN | PC3 **Tứ Linh Căn** | `gradeVi`: TRUNG ĐẲNG |
| STAT-PHUCPHAN | khá no → Phúc Tiên Thiên +3% (bậc 1), Phúc Hậu Thiên +1,5%/bậc | `synthesis.fortune` |
| STAT-THANLUC | **77** · Thân quá vượng → tự lực +20%, nhận trợ ×1 | `strength.effRatio` = 0.77 |
| STAT-THIENMENH | Dụng **Thủy** · Hỷ Kim · Kỵ Thổ · Cừu Hỏa · Nhàn Mộc · Dụng phụ Mộc | `yong` |
| STAT-MENHCACH | **Đắc Cứu** (七殺格, 有救) | `pattern.type`=normal |
| STAT-MENHCAP | Thanh Quý (đạt 3/6) | `classifyChartLevel` |
| STAT-NGUYENKHI | nền 23 → NK tối đa **112**; vận hiện tại 58 | `analyzeVitality` |
| STAT-NGHICHTHIEN | ×1.19 | công thức canon |
| Căn Cơ (Tiềm Lực × 0,4) | 16.4 điểm cảnh giới | 04-08 |

**«Vì sao?» — dòng `synthesis.factors` (gốc 45)**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | +2 | 格局成败 (有救 — Có cứu ứng (bại trung hữu thành)): Thất Sát cách → Có cứu ứng. 格 thần 丙 (七殺): ẩn tàng, thông căn (巳) … |
| 2 | +4 | Thành chính cách (Thất Sát cách (Thiên Quan / Thiên Tướng)) — có cách rõ, +4. |
| 3 | -6 | Dụng Thần Thủy yếu (2%) — thiếu lực, −6. → Thủy: màu đen/Bắc补 mạnh. |
| 4 | +5 | Có Hỷ Thần Kim (55%) sinh trợ Dụng — hữu tình, +5. |
| 5 | -10 | Tổ hợp hung (Thương Quan Kiến Quan, Quan Sát Hỗn Tạp) làm trọc cục, -10. Hóa giải: Ấn chế Thương Quan. |
| 6 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Quan Ấn Tương Sinh) nâng tầng cách cục, +6. |
| 7 | +3 | Nhiều cát tinh (tianDe, yueDe, jiangXing) phù trợ, +3. |
| 8 | -4 | 源流 khí trệ (chỉ 1/5) — nguồn Kim vượng nhưng dòng tắc → tài năng khó phát huy, cần vận «mở dòng», −4. |
| 9 | -4 | 盖头截脚 (2/4 trụ can-chi khắc): 2 trụ 盖头/截脚 trúng DỤNG → Dụng bị khắc yếu (-4) → 补 Dụng → Thủy: màu đen/Bắc. |
| Σ | 41 | 45 + tổng Δ = 41 → kẹp 0–100 = **41** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 6.5 | ×1 | 7 | 1 Nhược |
| Hỏa | Nhiệt Tâm | 18.3 | ×1 | 18 | 2 Bình |
| Thổ | Định Lực | 17.9 | ×0.8 | 14 | 2 Bình |
| Kim | Tuệ Kiếm | 55.1 | ×1 | 55 | 5 Cực |
| Thủy | Linh Tuệ | 2.2 | ×1.3 | 3 | 0 Khuyết |

**Ngũ Duy**

| Trục | Điểm | Hệ số thiên phú | Ghi chú |
|---|---|---|---|
| Thương đạo (Tài) | 26 | ×1.05 | |
| Trị đạo (Quan) | 45 | ×1.09 | |
| Học đạo (Ấn) | 54 | ×1.11 | |
| Nghệ đạo (Thực) | 15 | ×1.03 | trục yếu → chuỗi Bổ Khuyết |
| Đồng đạo (Tỷ) | 100 | ×1.20 | trục trội → kỹ năng khởi đầu |

**Mệnh Cách chi tiết**

- Cách: Thất Sát cách (Thiên Quan / Thiên Tướng) (`七殺格`), chất lượng `有救`.
- Bệnh (`dang`): Tài đảng Sát (Tài sinh Sát) mà KHÔNG có Thực/Ấn chế → Sát vô chế, 败 (七煞逢财无制).
- Bệnh (`duo`): Thực thần chế Sát nhưng lại bị Kiêu (偏印) đoạt thực → mất chế.
- Thuốc (`shi`): Tài đảng Sát nhưng có Thực Thần chế Sát sinh Tài → cứu (食制杀以生财).
- Thuốc (`cai`): Kiêu đoạt thực (mất chế Sát) nhưng có Tài phá Kiêu → khôi phục thực.

**Đặc Tính**: `PERK-xueTang` Học Đường Tâm [I] · `PERK-jiangXing` Tướng Tinh [I] · `PERK-huaGai` Hoa Cái Nhập Mệnh [II] · `PERK-tianYiMed` Thiên Y Thủ [II] · `PERK-tianDe` Thiên Đức [I] · `PERK-yueDe` Nguyệt Đức [II] · `PERK-kuiGang` Khôi Cương [I] · `PERK-liuXia` Lưu Hà (kiếp số) [II] · `PERK-guoYin` Quốc Ấn [II]

**Quý Khí** (`noble-stars`): 贵气显赫 (7) — sao: Thiên Đức, Nguyệt Đức, Quốc Ấn, Khôi Cương.

**Túc Nghiệp**: Nhân Đạo (`人道`) · tâm ma Tham 29 / Sân 37 / Si 27 · thiện 26, định 30, bố 10.

**Tính Khí**: nhật chủ 庚 — Sắt thép dương — cương nghị, quả cảm, trọng nghĩa khí, hành động dứt khoát. · Nạp âm nhật trụ 白蜡金 (Kim Sáp Trắng).

**Tổ hợp (cờ cốt truyện)**: `STAT-FLAG-shaYin`, `STAT-FLAG-guanYin`, `STAT-FLAG-shangCai`, `STAT-FLAG-shangYin`, `STAT-FLAG-shangGuan` (hung, đã chế), `STAT-FLAG-caiGuan`, `STAT-FLAG-guanZha` (hung).

**Thời Vận 2026**: đại vận 甲申 (28–37 tuổi, từ 2017) điểm 0 → «Bình hòa»; lưu niên 丙午 điểm 6 → «Đại hung».

**Nhịp tu tham chiếu** (40 công tu/ngày → 47,6 Đạo Hạnh/ngày): bậc 2 sau 2 ngày · bậc 3: 9 · bậc 4: 22 · bậc 5: 47 · bậc 6: 95.

**Đọc trong game**

- Lá số khớp canon §11 từng chi tiết (Dụng Thủy / Hỷ Kim, 41 điểm, Tứ Linh Căn, 七殺格, Kim 55%, Thủy 2%, đại vận 甲申 28–37).
- Đắc Cứu với **2 vị thuốc**: `shi` (Tú Linh Quả, Võ Đang) và `cai` (Kim Tiền Thảo, Huyền Thành). Với nhật chủ Kim, nhóm `shi` (Thực Thương) là hành **Thủy** — đúng Dụng thần. Vị thuốc đầu tiên **trùng** Thiên Mệnh Hành → chuỗi «đi tìm Tú Linh Quả» và chuỗi «bổ Thủy» là một mạch.
- Thủy tầng 0 (Khuyết) và là Dụng → Hồi I mở đầu bằng câu của Thầy ở 04-03 §2.2.
- Thân quá vượng + Đồng đạo 100 → kiểu «Độc Hành» có Tiết Tú, cây khởi đầu Đồng đạo; Bổ Khuyết rơi vào Nghệ đạo (Thực 15) — cũng chính là nhóm của Dụng Thủy. Ba hệ thống (Thiên Mệnh, Mệnh Cách, Ngũ Duy) cùng chỉ một hướng: **tiết tú ra ngoài**.
- Năm 2026 lưu niên Đại hung → R3 thử thách +15%; Thái Tuế Điện mở lễ (tuổi Ngọ phạm Trị + Hình).
- Kiếp số Lưu Hà bậc II: ải «Ráng Chiều»; có Thiên Đức, Nguyệt Đức → ải bớt 1 chặng.

---

## `MAU-B` · 1995-06-15 08:30, nam

Chạy lại: `analyze(1995, 6, 15, 8, 30, 'nam', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 乙亥 | 壬午 | 丁丑 | 甲辰 |
| Nạp âm | 山头火 | 杨柳木 | 涧下水 | 覆灯火 |
| Thập thần can | 偏印 | 正官 | (Nhật chủ) | 正印 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **48** (hơn 53% lá số) | `synthesis.score` / `percentile` |
| STAT-PHAMCAN | PC4 **Tứ Linh Căn thuận** | `gradeVi`: TRUNG ĐẲNG THUẬN |
| STAT-PHUCPHAN | khá no → Phúc Tiên Thiên +3% (bậc 1), Phúc Hậu Thiên +1,5%/bậc | `synthesis.fortune` |
| STAT-THANLUC | **62** · Thân vượng → tự lực +10%, nhận trợ ×1 | `strength.effRatio` = 0.616 |
| STAT-THIENMENH | Dụng **Thủy** · Hỷ Kim · Kỵ Thổ · Cừu Hỏa · Nhàn Mộc · Dụng phụ Kim | `yong` |
| STAT-MENHCACH | **Nghịch Thiên** (正官格, 败格) | `pattern.type`=normal |
| STAT-MENHCAP | Thanh Quý (đạt 3/6) | `classifyChartLevel` |
| STAT-NGUYENKHI | nền 25 → NK tối đa **113**; vận hiện tại 44 | `analyzeVitality` |
| STAT-NGHICHTHIEN | ×1.12 | công thức canon |
| Căn Cơ | 19.2 | 04-08 |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | -7 | 格局成败 (败格 — Bại cách): Chính Quan cách → Bại cách. 格 thần 壬 (正官): thấu cán (month), thông căn (亥) … |
| 2 | +4 | Thành chính cách (Chính Quan cách) — có cách rõ, +4. |
| 3 | +6 | Dụng Thần Thủy có lực (24%) — có gốc, +6. |
| 4 | +3 | Dụng Thần thấu Thiên Can năm/tháng/giờ — vị trí hữu lực, +3. |
| 5 | -3 | Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3. |
| 6 | +3 | Lực Dụng ≥ lực Kỵ — thế cục chủ động, +3. |
| 7 | -15 | Tổ hợp hung (Thương Quan Kiến Quan, Kiêu Đoạt Thực, Quan Sát Hỗn Tạp) làm trọc cục, -15. Hóa giải: Ấn chế Thương Quan; Thực/Thương chế Sát … |
| 8 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Quan Ấn Tương Sinh) nâng tầng cách cục, +6. |
| 9 | +3 | Nhiều cát tinh (tianYi, tianDe) phù trợ, +3. |
| 10 | +2 | 源流 dòng khí thông 3/5, quy Thực/Thương → khía cạnh Thực/Thương hữu duyên, +2. |
| 11 | +1 | 盖头截脚 (2/4 trụ can-chi khắc): 1 trụ trúng KỴ → khắc được忌, lợi (+1). |
| Σ | 48 | 45 + tổng Δ = 48 → **48** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 29.2 | ×1 | 29 | 3 Vượng |
| Hỏa | Nhiệt Tâm | 25.4 | ×1 | 25 | 3 Vượng |
| Thổ | Định Lực | 20.2 | ×0.8 | 16 | 2 Bình |
| Kim | Tuệ Kiếm | 1.2 | ×1 | 1 | 0 Khuyết |
| Thủy | Linh Tuệ | 23.9 | ×1.3 | 31 | 4 Thịnh |

**Ngũ Duy**: Tài 13 (×1,03, Bổ Khuyết) · Quan 83 (×1,17) · Ấn **100** (×1,20, khởi đầu Học đạo) · Thực 62 (×1,12) · Tỷ 34 (×1,07).

**Mệnh Cách chi tiết**

- Cách: Chính Quan cách (`正官格`), chất lượng `败格`.
- Bệnh (`ke`): Thương Quan khắc phá Chính Quan → 败 (官逢伤克).
- Bệnh (`mix`): Thất Sát hỗn tạp với Chính Quan → 败 (官杀混杂).
- Bệnh (`chong`): Nguyệt chi (cung quan) bị hình/xung phá hại → quan bị tổn.
- Thuốc (`yin`): Quan bị Thương khắc, nhưng có Ấn chế Thương Quan → Quan được cứu (透印解伤).
- Thuốc (`ti`): Quan bị Sát hỗn, nhưng có Tỷ/Kiếp (hoặc Thương) hợp Sát → 清格 (合杀留官).

**Đặc Tính**: `PERK-tianYi` [I] · `PERK-luShen` [I] · `PERK-taoHua` [I] · `PERK-yiMa` [I] · `PERK-huaGai` [I] · `PERK-tianDe` [I] · `PERK-taiJi` [I] · `PERK-tianChu` [I]

**Quý Khí**: 贵气平平 (3) — Thiên Đức. **Túc Nghiệp**: Nhân Đạo · Tham 8 / Sân 40 / Si 27 · thiện 82, định 50, bố 25. **Tính Khí**: 丁 ngọn đèn; nạp âm 涧下水 (Giản Hạ Thủy).

**Cờ**: `shaYin`, `guanYin`, `shiSha`, `shiCai`, `shangCai`, `shangYin`, `shangGuan` (đã chế), `xiaoShi` (hung), `caiGuan`, `guanZha` (đã chế).

**Thời Vận 2026**: đại vận 己卯 (24–33, từ 2018) điểm −5 → «Đại hung»; lưu niên 丙午 điểm 9 → «Đại hung».

**Nhịp tu** (40/ngày → 44,8 ĐH/ngày): bậc 2: 2 · bậc 3: 9 · bậc 4: 23 · bậc 5: 50 · bậc 6: 101.

**Đọc trong game**

- **Ca làm tròn Thân Lực**: hiển thị 62 nhưng mức «Thân vượng» (effRatio 0,616 < 0,62). So với `MAU-C` (0,622 → 62, «quá vượng»). Kiểm thử bắt buộc (04-12 §9).
- Nghịch Thiên với **3 bệnh / 2 thuốc** → Mệnh Đồ có 1 nút thắt thật (bệnh `chong`, không thuốc) và 2 nút «có thuốc trong lá số» (đi như Đắc Cứu). Đây là dạng Nghịch Thiên «nửa cứu» phổ biến.
- Đại vận **và** lưu niên đều Đại hung → R3 thử thách chạm trần +30%. Người chơi này năm 2026 tu nhanh nhất nếu chọn việc Kỵ (Thổ). Thầy nói đúng một câu, không phán: «Mười năm này đất nặng. Con làm việc của đất thì đất nâng con.»
- Thiện 82 → giảm Si nhanh ×1,41 (04-07 §3.3).

---

## `MAU-C` · 1986-09-01 13:15, nữ

Chạy lại: `analyze(1986, 9, 1, 13, 15, 'nữ', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 丙寅 | 丙申 | 戊申 | 己未 |
| Nạp âm | 炉中火 | 山下火 | 大驿土 | 天上火 |
| Thập thần can | 偏印 | 偏印 | (Nhật chủ) | 劫財 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **23** (hơn 4% lá số) | `synthesis.score` / `percentile` |
| STAT-PHAMCAN | PC1 **Phàm Căn** | `gradeVi`: HẠ ĐẲNG |
| STAT-PHUCPHAN | tiềm năng ẩn → Phúc Tiên Thiên 0 (bậc 1), Phúc Hậu Thiên +3%/bậc | `synthesis.fortune` |
| STAT-THANLUC | **62** · Thân quá vượng → tự lực +20% | `strength.effRatio` = 0.622 |
| STAT-THIENMENH | Dụng **Mộc** · Hỷ Thủy · Kỵ Kim · Cừu Thổ · Nhàn Hỏa · Dụng phụ Thủy | `yong` |
| STAT-MENHCACH | **Nghịch Thiên** (食神格, 败格) | normal |
| STAT-MENHCAP | Thường Cách (đạt 2/6, bị chặn từ 3 vì Tiềm Lực < 31) | `classifyChartLevel` |
| STAT-NGUYENKHI | nền 16 → NK tối đa **108**; vận hiện tại 54 | `analyzeVitality` |
| STAT-NGHICHTHIEN | ×1.37 | |
| Căn Cơ | 9.2 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | -7 | 格局成败 (败格): Thực Thần cách → Bại cách. 格 thần 庚 (食神): ẩn tàng, thông căn (申,申). Bệnh: Kiêu Thần (Thiên Ấn) … |
| 2 | +4 | Thành chính cách (Thực Thần cách) — có cách rõ, +4. |
| 3 | -6 | Dụng Thần Mộc yếu (5%) — thiếu lực, −6. → Mộc: màu xanh/Đông补 mạnh. |
| 4 | -3 | Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3. |
| 5 | -10 | Tổ hợp hung (Kiêu Đoạt Thực, Quan Sát Hỗn Tạp) làm trọc cục, -10. Hóa giải: Tài chế Kiêu (Thiên Ấn); Thực/Thương chế Sát … |
| 6 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Quan Ấn Tương Sinh) nâng tầng cách cục, +6. |
| 7 | -5 | Xung/hình nhiều (2 xung, 2 hình) — phối hợp bất ổn, −5. |
| 8 | -3 | Nhật Chi (cung gốc) bị xung — 根基 bất ổn, −3. |
| 9 | +3 | Nhiều cát tinh (tianYi, wenChang, jinYu) phù trợ, +3. |
| 10 | -2 | Không vong (空亡): 1 trụ rơi 旬空 (year) → tàng can «treo», -2. |
| 11 | +1 | 盖头截脚 (1/4 trụ can-chi khắc): 1 trụ trúng KỴ → khắc được忌, lợi (+1). |
| Σ | 23 | 45 + tổng Δ = 23 → **23** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 4.6 | ×1.3 | 6 | 1 Nhược |
| Hỏa | Nhiệt Tâm | 28.3 | ×1 | 28 | 3 Vượng |
| Thổ | Định Lực | 33.9 | ×1 | 34 | 4 Thịnh |
| Kim | Tuệ Kiếm | 23.2 | ×0.8 | 19 | 2 Bình |
| Thủy | Linh Tuệ | 10 | ×1 | 10 | 1 Nhược |

**Ngũ Duy**: Tài 31 (×1,06, Bổ Khuyết) · Quan 34 · Ấn **100** (khởi đầu Học đạo) · Thực 52 · Tỷ 76.

**Mệnh Cách chi tiết**

- Cách: Thực Thần cách (`食神格`), chất lượng `败格`.
- Bệnh (`duo`): Kiêu Thần (Thiên Ấn/偏印) đoạt Thực (枭神夺食) → 败 nặng.
- Bệnh (`dang`): Thực sinh Tài nhưng lại lộ Sát → Tài quay dưỡng Sát (生财露杀) → 败.
- Thuốc (`cai`): Kiêu đoạt thực nhưng có Tài chế Kiêu → khôi phục Thực Thần.

**Đặc Tính**: `PERK-tianYi` [I] · `PERK-wenChang` [II] · `PERK-xueTang` [I] · `PERK-yiMa` [II] · `PERK-tianYiMed` [I] · `PERK-tianDeHe` [I] · `PERK-jinYu` [I] · `PERK-taiJi` [I] · `PERK-tianChu` [II] · `PERK-tianShe` [I]

**Quý Khí**: 贵气平平 (2) — Thái Cực. **Túc Nghiệp**: Địa Ngục Đạo · Tham 29 / Sân 57 / Si 27 · thiện 45, định 43, bố 20. **Tính Khí**: 戊 núi cao; nạp âm 大驿土 (Đại Dịch Thổ).

**Cờ**: `shaYin`, `guanYin`, `shiSha`, `shiCai`, `xiaoShi` (đã chế), `caiGuan`, `guanZha` (đã chế), `shiXie`.

**Thời Vận 2026**: đại vận 壬辰 (39–48, từ 2024) điểm 2 → «Cát»; lưu niên 丙午 điểm 38 → «Bình».

**Nhịp tu** (40/ngày → 54,8 ĐH/ngày): bậc 2: 2 · bậc 3: 8 · bậc 4: 19 · bậc 5: 41 · bậc 6: 83.

**Đọc trong game**

- **Phàm Căn**: Nghịch Thiên Lộ + chuỗi «Khổ tận cam lai» + chuỗi ẩn «Khởi Sắc Muộn» (Phúc phận tiềm năng ẩn). Đây là nhân vật có **nhiều nội dung riêng nhất** trong 15 mẫu.
- Có **Thiên Xá** (1,4% người chơi) — sao hiếm nhất, ở một lá số điểm thấp nhất. Dùng làm ví dụ cho 04-13: «lá số thấp không có nghĩa thiếu sao lành».
- Tới bậc 6 sớm nhất nhóm mẫu (ngày 83 ở nhịp 40/ngày) — sớm hơn `MAU-L` (Thiên Linh Căn) 30 ngày.
- Mệnh Cấp bị chặn theo điểm: «Vì sao?» hiện «đạt 3/6 tiêu chí; Thầy xếp Thường Cách vì điểm mệnh dưới 31». Mặt chính chỉ ghi «Thường Cách».
- Địa Ngục Đạo → mở đầu «Địa Ngục Hồi Quang»; Sân 57 → ải Sân 3 tầng (60 công tu × NT 1,37).

---

## `MAU-D` · 1999-03-05 07:15, nữ

Chạy lại: `analyze(1999, 3, 5, 7, 15, 'nữ', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 己卯 | 丙寅 | 丙辰 | 壬辰 |
| Nạp âm | 城头土 | 炉中火 | 沙中土 | 长流水 |
| Thập thần can | 傷官 | 比肩 | (Nhật chủ) | 七殺 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **29** (hơn 6% lá số) | `synthesis.score` / `percentile` |
| STAT-PHAMCAN | PC2 **Ngũ Linh Căn** | `gradeVi`: TRUNG HẠ |
| STAT-PHUCPHAN | tiềm năng ẩn → 0 (bậc 1), +3%/bậc | `synthesis.fortune` |
| STAT-THANLUC | **66** · Thân quá vượng → tự lực +20% | `strength.effRatio` = 0.661 |
| STAT-THIENMENH | Dụng **Kim** · Hỷ Thổ · Kỵ Hỏa · Cừu Mộc · Nhàn Thủy · Dụng phụ Thổ | `yong` |
| STAT-MENHCACH | **Nghịch Thiên** (偏印格, 败格) | normal |
| STAT-MENHCAP | Thường Cách (đạt 2/6) | |
| STAT-NGUYENKHI | nền 10 → NK tối đa **105**; vận hiện tại 51 | |
| STAT-NGHICHTHIEN | ×1.31 | |
| Căn Cơ | 11.6 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | -7 | 格局成败 (败格): Thiên Ấn cách (Kiêu Thần) → Bại cách. 格 thần 甲 (偏印): ẩn tàng, thông căn (寅). Bệnh: Kiêu đoạt Thực … |
| 2 | +4 | Thành chính cách (Thiên Ấn cách (Kiêu Thần)) — có cách rõ, +4. |
| 3 | -6 | Dụng Thần Kim yếu (0%) — thiếu lực, −6. → Kim: màu trắng/Tây补 mạnh. |
| 4 | +5 | Có Hỷ Thần Thổ (25%) sinh trợ Dụng — hữu tình, +5. |
| 5 | -6 | Kỵ Thần Hỏa thái quá (26%) — Dụng bị khắc nặng, −6. |
| 6 | -15 | Tổ hợp hung (Thương Quan Kiến Quan, Kiêu Đoạt Thực, Quan Sát Hỗn Tạp) làm trọc cục, -15. Hóa giải: Ấn chế Thương Quan; Thực/Thương chế Sát … |
| 7 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Quan Ấn Tương Sinh) nâng tầng cách cục, +6. |
| 8 | +3 | Nhiều cát tinh (yueDe, jiangXing) phù trợ, +3. |
| 9 | +2 | 源流 dòng khí thông 3/5, quy Thực/Thương → hữu duyên, +2. |
| 10 | -2 | 盖头截脚 (2/4 trụ can-chi khắc): 1 trụ trúng DỤNG → Dụng bị khắc yếu (-2). |
| Σ | 29 | **29** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 37.5 | ×1 | 38 | 4 Thịnh |
| Hỏa | Nhiệt Tâm | 25.6 | ×0.8 | 20 | 3 Vượng |
| Thổ | Định Lực | 24.6 | ×1 | 25 | 3 Vượng |
| Kim | Tuệ Kiếm | 0 | ×1.3 | 0 | 0 Khuyết |
| Thủy | Linh Tuệ | 12.2 | ×1 | 12 | 2 Bình |

**Ngũ Duy**: Tài **0** (khuyết hẳn, Bổ Khuyết) · Quan 57 · Ấn 96 · Thực **100** (khởi đầu Nghệ đạo) · Tỷ 61.

**Mệnh Cách chi tiết**: `偏印格`, `败格`; một bệnh `duo` (Kiêu đoạt Thực khi trong cục có Thực Thần → 败 nặng), **không** có thuốc.

**Đặc Tính**: `PERK-xueTang` [I] · `PERK-yiMa` [I] · `PERK-jiangXing` [I] · `PERK-huaGai` [II] · `PERK-yueDe` [II] · `PERK-tianDeHe` [I] · `PERK-hongYan` [I] · `PERK-taiJi` [II] · `PERK-shiLing` [I]

**Quý Khí**: 贵气中上 (4,5) — Nguyệt Đức, Thái Cực. **Túc Nghiệp**: Địa Ngục Đạo · Tham 0 / Sân 80 / Si 27 · thiện 45, định 37, bố 40. **Tính Khí**: 丙 mặt trời; nạp âm 沙中土 (Sa Trung Thổ).

**Cờ**: `shaYin`, `guanYin`, `shiSha`, `shangYin`, `shangGuan` (đã chế), `xiaoShi` (hung), `guanZha` (đã chế), `shiXie`.

**Thời Vận 2026**: đại vận 己巳 (21–30, từ 2019) điểm −2 → «Hung»; lưu niên 丙午 điểm 3 → «Đại hung».

**Nhịp tu** (40/ngày → 52,4 ĐH/ngày): bậc 2: 2 · bậc 3: 8 · bậc 4: 20 · bậc 5: 42 · bậc 6: 86.

**Đọc trong game**

- **Dụng thần 0%**: Kim không có một chút nào trong lá số. Bổ Dụng (+5) + Bổ Hành tuần (trần 20) đưa Tuệ Kiếm lên tầng 3. Hồi I của người này là hành trình «tìm thứ mình không có» — Tử Bình Phong, Phong Thủy Viên (vùng Kim) là nơi thiên thời.
- Kỵ Hỏa 26% và năm 2026 丙午 (Hỏa) Đại hung, đại vận Hung → thử thách +25%; việc Hỏa (luyện đan, lễ hội) là cửa thử thách ×1,3. Nhân vật «sống trong lửa mà cần kim»: câu chuyện rõ nét.
- Nghịch Thiên **không có thuốc** nào → Mệnh Đồ 1 nút thắt «Đoạt Thực». Vận cứu cách (`gejuRescue`) — xem Vận Mệnh Các của chính lá số.
- Thương đạo khuyết hẳn (Tài 0) → câu «học như người lạ học một thứ tiếng» (04-04 §4).
- Sân 80 → ải Sân 4 tầng; bố 40 → giảm Tham nhanh (Tham đã 0).

---

## `MAU-E` · 1989-04-14 22:00, nữ

Chạy lại: `analyze(1989, 4, 14, 22, 0, 'nữ', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 己巳 | 戊辰 | 甲辰 | 乙亥 |
| Nạp âm | 大林木 | 大林木 | 覆灯火 | 山头火 |
| Thập thần can | 正財 | 偏財 | (Nhật chủ) | 劫財 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **45** (hơn 43% lá số) | |
| STAT-PHAMCAN | PC4 **Tứ Linh Căn thuận** | TRUNG ĐẲNG THUẬN |
| STAT-PHUCPHAN | khá no → +3% (bậc 1), +1,5%/bậc | |
| STAT-THANLUC | **60** · Thân vượng → tự lực +10% | effRatio 0.599 |
| STAT-THIENMENH | Dụng **Hỏa** · Hỷ Mộc · Kỵ Thủy · Cừu Kim · Nhàn Thổ · (không Dụng phụ) | |
| STAT-MENHCACH | **Đắc Cứu** (偏財格, 有救) | normal |
| STAT-MENHCAP | Thường Cách (đạt 2/6) | |
| STAT-NGUYENKHI | nền 16 → NK tối đa **108**; vận hiện tại 42 (Dưỡng Sinh) | |
| STAT-NGHICHTHIEN | ×1.15 | |
| Căn Cơ | 18 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | +2 | 格局成败 (有救): Thiên Tài cách (Phi Tài) → Có cứu ứng. 格 thần 戊 (偏財): thấu cán (month) … |
| 2 | +4 | Thành chính cách (Thiên Tài cách (Phi Tài)) — có cách rõ, +4. |
| 3 | -6 | Dụng Thần Hỏa yếu (6%) — thiếu lực, −6. → Hỏa: màu đỏ/Nam补 mạnh. |
| 4 | +5 | Có Hỷ Thần Mộc (31%) sinh trợ Dụng — hữu tình, +5. |
| 5 | -10 | Tổ hợp hung (Kiêu Đoạt Thực, Quần Kiếp Tranh Tài) làm trọc cục, -10. Hóa giải: Tài chế Kiêu (Thiên Ấn). |
| 6 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Thực Chế Sát) nâng tầng cách cục, +6. |
| 7 | +3 | Nhiều cát tinh (wenChang, jinYu) phù trợ, +3. |
| 8 | -4 | 源流 khí trệ (chỉ 1/5) — nguồn Thổ vượng nhưng dòng tắc, −4. |
| Σ | 45 | **45** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 31.5 | ×1 | 32 | 4 Thịnh |
| Hỏa | Nhiệt Tâm | 6 | ×1.3 | 8 | 1 Nhược |
| Thổ | Định Lực | 38.1 | ×1 | 38 | 4 Thịnh |
| Kim | Tuệ Kiếm | 3 | ×1 | 3 | 0 Khuyết |
| Thủy | Linh Tuệ | 21.4 | ×0.8 | 17 | 2 Bình |

**Ngũ Duy**: Tài **100** (khởi đầu Thương đạo) · Quan 18 (Bổ Khuyết) · Ấn 35 · Thực 26 · Tỷ 62.

**Mệnh Cách chi tiết**

- Cách: Thiên Tài cách (`偏財格`), `有救`.
- Bệnh (`xoroot`): Tỷ/Kiếp đoạt Tài (财轻比重) → 败.
- Bệnh (`dang`): Tài lại sinh Sát (财透七杀) → Tài thành nuôi Sát, 败.
- Thuốc (`shi`): Tỷ Kiếp đoạt Tài nhưng có Thực Thần hóa Kiếp sinh Tài → cứu (透食以化之).
- Thuốc (`shi`): Tài đảng Sát nhưng có Thực chế Sát sinh Tài → cứu (食神制杀以生财).

**Đặc Tính**: `PERK-wenChang` [I] · `PERK-xueTang` [I] · `PERK-yiMa` [I] · `PERK-huaGai` [II] · `PERK-jinYu` [II] · `PERK-taiJi` [II] · `PERK-tianChu` [I] · `PERK-shiLing` [I]

**Quý Khí**: 贵气微薄 (0) — không sao nhóm cao cấp. **Túc Nghiệp**: Ngạ Quỷ Đạo · Tham 56 / Sân 23 / Si 27 · thiện 51, định 27, bố 10. **Tính Khí**: 甲 đại thụ; nạp âm 覆灯火 (Phúc Đăng Hỏa).

**Cờ**: `shaYin`, `shiSha`, `shiCai`, `xiaoShi` (đã chế), `caiGuan`, `qunJie` (hung), `shenRenCai`.

**Thời Vận 2026**: đại vận 壬申 (38–47, từ 2026) điểm −1 → «Hơi nghịch»; lưu niên 丙午 điểm 54 → «Bình».

**Nhịp tu** (40/ngày → 46,0 ĐH/ngày): bậc 2: 2 · bậc 3: 9 · bậc 4: 22 · bậc 5: 48 · bậc 6: 98.

**Đọc trong game**

- Hai bệnh, **hai thuốc cùng nhóm** `shi` → «phương thuốc» chỉ có **một vị** (Tú Linh Quả) nhưng phải hái **hai lần** (mỗi bệnh một lần). Quy tắc: số lần hái = `rescues.length`; số vị khác nhau = số nhóm khác nhau.
- Thuốc `shi` của nhật chủ Mộc = Hỏa = Dụng thần (engine đã thăng). Lại một lần ba hệ thống trùng một hướng.
- **Quý Khí vi bạc** → «Tự Tạo Quý Nhân»: mỗi NPC giúp được thành quý nhân. Rất hợp với Thương đạo 100 (buôn bán = gặp nhiều người).
- Ngạ Quỷ Đạo (Tham 56) → «Ngạ Quỷ Được Cơm», người đón là Ni sư Diệu Âm; đối trị bố thí — mà Thương đạo có nút `STAT-ND-TAI-09` «Bố Thí Đúng Chỗ». Khuynh hướng tham thành con đường «làm ra để cho đi».
- Đại vận đổi đúng năm 2026 (壬申 bắt đầu 2026) → Vận Mệnh Các có cảnh «bước qua cổng vận mới».

---

## `MAU-F` · 1957-02-22 17:30, nam

Chạy lại: `analyze(1957, 2, 22, 17, 30, 'nam', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 丁酉 | 壬寅 | 乙丑 | 乙酉 |
| Nạp âm | 山下火 | 金箔金 | 海中金 | 泉中水 |
| Thập thần can | 食神 | 正印 | (Nhật chủ) | 比肩 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **53** (hơn 68% lá số) | |
| STAT-PHAMCAN | PC5 **Tam Linh Căn** | TRUNG THƯỢNG |
| STAT-PHUCPHAN | tiểu phú quý → +6% (bậc 1), +1%/bậc | |
| STAT-THANLUC | **59** · Thân vượng → tự lực +10% | effRatio 0.59 |
| STAT-THIENMENH | Dụng **Kim** · Hỷ Thổ · Kỵ Hỏa · Cừu Mộc · Nhàn Thủy | |
| STAT-MENHCACH | **Đắc Cứu** (月劫格, 有救) | **luyue** |
| STAT-MENHCAP | Phú Cách (đạt 4/6) | |
| STAT-NGUYENKHI | nền 28 → NK tối đa **114**; vận hiện tại 49 | |
| STAT-NGHICHTHIEN | ×1.07 | |
| Căn Cơ | 21.2 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | +2 | 格局成败 (有救): Nguyệt Kiếp cách → Có cứu ứng. 格 thần 甲 (劫財): ẩn tàng … |
| 2 | 0 | Nguyệt lệnh là Tỷ Kiếp — Dụng phải lấy ở chỗ khác (kiến lộc/nguyệt kiếp). |
| 3 | +6 | Dụng Thần Kim có lực (23%) — có gốc, +6. |
| 4 | -3 | Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3. |
| 5 | +3 | Lực Dụng ≥ lực Kỵ — thế cục chủ động, +3. |
| 6 | -5 | Tổ hợp hung (Kiêu Đoạt Thực) làm trọc cục, -5. Hóa giải: Tài chế Kiêu (Thiên Ấn). |
| 7 | +6 | Tổ hợp cát (Sát Ấn Tương Sinh, Thực Chế Sát) nâng tầng cách cục, +6. |
| 8 | +3 | Nhiều cát tinh (tianDe, jiangXing) phù trợ, +3. |
| 9 | -4 | 盖头截脚 (3/4 trụ can-chi khắc): 2 trụ trúng DỤNG → Dụng bị khắc yếu (-4). |
| Σ | 53 | **53** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 36.5 | ×1 | 37 | 4 Thịnh |
| Hỏa | Nhiệt Tâm | 16.8 | ×0.8 | 13 | 2 Bình |
| Thổ | Định Lực | 9.2 | ×1 | 9 | 1 Nhược |
| Kim | Tuệ Kiếm | 23 | ×1.3 | 30 | 4 Thịnh |
| Thủy | Linh Tuệ | 14.5 | ×1 | 15 | 2 Bình |

**Ngũ Duy**: Tài 40 (Bổ Khuyết) · Quan **100** (khởi đầu Trị đạo) · Ấn 66 · Thực 66 · Tỷ 79.

**Mệnh Cách chi tiết**: `月劫格`, `有救`; bệnh `ke` (Dụng Quan nhưng Thương Quan khắc Quan → 败); thuốc `ti+yin` (Tỷ/Kiếp HỢP Thương hoặc Ấn chế Thương → Quan được cứu).

**Đặc Tính**: `PERK-jiangXing` [II] · `PERK-huaGai` [I] · `PERK-tianYiMed` [I] · `PERK-tianDe` [I] · `PERK-tianDeHe` [I] · `PERK-taiJi` [II] · `PERK-xueRen` (kiếp số) [I]

**Quý Khí**: 贵气平平 (3) — Thiên Đức. **Túc Nghiệp**: Địa Ngục Đạo · Tham 16 / Sân 77 / Si 0 · thiện 47, định 27, bố 25. **Tính Khí**: 乙 dây leo; nạp âm 海中金 (Hải Để Kim).

**Cờ**: `shaYin`, `shiSha`, `shiCai`, `shangCai`, `shangYin`, `xiaoShi` (đã chế), `caiGuan`, `shiXie`.

**Thời Vận 2026**: đại vận 乙未 (67–76, từ 2023) điểm 2 → «Cát»; lưu niên 丙午 điểm 5 → «Đại hung».

**Nhịp tu** (40/ngày → 42,8 ĐH/ngày): bậc 2: 2 · bậc 3: 9 · bậc 4: 24 · bậc 5: 52 · bậc 6: 106.

**Đọc trong game**

- Người chơi lớn tuổi (sinh 1957, 69 tuổi năm 2026). Đại vận thứ 7 — kiểm tra bảng 12 đại vận phủ đủ tuổi già (engine sửa `bugfix-dayun-elder`).
- `luyue` (Nguyệt Kiếp cách): «Vì sao?» có dòng Δ = 0 («Nguyệt lệnh là Tỷ Kiếp…») — UI phải hiện dòng 0 (không ẩn), ghi «không cộng, không trừ — chỉ cho biết Dụng lấy ở chỗ khác».
- **Vị thuốc kép** `ti+yin`: Đồng Tâm Thảo (Yên Tử) **hoặc** Văn Xương Chi (Thư Lâu Lâm) — người chơi chọn. Với Tính Khí 乙 (`nhu`, hợp Ni sư Diệu Âm), gợi ý Yên Tử.
- Kiếp số Huyết Nhận → ải «Thân Chắn» (cứu sách khỏi cháy); có Thiên Đức → 2 chặng.

---

## `MAU-G` · 1969-09-10 09:00, nam

Chạy lại: `analyze(1969, 9, 10, 9, 0, 'nam', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 己酉 | 癸酉 | 戊子 | 丁巳 |
| Nạp âm | 大驿土 | 剑锋金 | 霹雳火 | 沙中土 |
| Thập thần can | 劫財 | 正財 | (Nhật chủ) | 正印 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **63** (hơn 90% lá số) | |
| STAT-PHAMCAN | PC6 **Tam Linh Căn thượng** | TRUNG THƯỢNG CAO |
| STAT-PHUCPHAN | phú quý → +9% (bậc 1), +0,5%/bậc | |
| STAT-THANLUC | **42** · Thân nhược → nhận trợ ×1,5 | effRatio 0.416 |
| STAT-THIENMENH | Dụng **Hỏa** · Hỷ Mộc · Kỵ Thủy · Cừu Kim · Nhàn Thổ · Dụng phụ Thổ | |
| STAT-MENHCACH | **Thuận Thiên** (傷官格, 成格) | normal |
| STAT-MENHCAP | Thanh Quý (đạt 3/6) | |
| STAT-NGUYENKHI | nền 20 → NK tối đa **110**; vận hiện tại 78 (Khí Thịnh) | |
| STAT-NGHICHTHIEN | ×1.00 | |
| Căn Cơ | 25.2 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | +6 | 格局成败 (成格): Thương Quan cách → Thành cách. 格 thần 辛 (傷官): ẩn tàng, thông căn (酉,酉) … |
| 2 | +4 | Thành chính cách (Thương Quan cách) — có cách rõ, +4. |
| 3 | +6 | Dụng Thần Hỏa có lực (18%) — có gốc, +6. |
| 4 | +3 | Dụng Thần thấu Thiên Can năm/tháng/giờ — vị trí hữu lực, +3. |
| 5 | -3 | Hỷ Thần (nguồn sinh Dụng) mỏng — Dụng thiếu hậu thuẫn, −3. |
| 6 | -5 | Tổ hợp hung (Kiêu Đoạt Thực) làm trọc cục, -5. Hóa giải: Tài chế Kiêu (Thiên Ấn). |
| 7 | +6 | Tổ hợp cát (Thực Sinh Tài, Thương Sinh Tài) nâng tầng cách cục, +6. |
| 8 | +1 | 盖头截脚 (1/4 trụ can-chi khắc): 1 trụ trúng KỴ → khắc được忌, lợi (+1). |
| Σ | 63 | **63** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 0 | ×1 | 0 | 0 Khuyết |
| Hỏa | Nhiệt Tâm | 18 | ×1.3 | 23 | 3 Vượng |
| Thổ | Định Lực | 23.6 | ×1 | 24 | 3 Vượng |
| Kim | Tuệ Kiếm | 34.8 | ×1 | 35 | 4 Thịnh |
| Thủy | Linh Tuệ | 23.6 | ×0.8 | 19 | 2 Bình |

**Ngũ Duy**: Tài 88 · Quan **0** (khuyết hẳn, Bổ Khuyết) · Ấn 73 · Thực **100** (khởi đầu Nghệ đạo) · Tỷ 53.

**Mệnh Cách chi tiết**: `傷官格`, `成格`, không bệnh.

**Đặc Tính**: `PERK-luShen` [I] · `PERK-taoHua` [II] · `PERK-jiangXing` [II] · `PERK-tianChu` [II] · `PERK-liuXia` (kiếp số) [I]

**Quý Khí**: 贵气微薄 (0). **Túc Nghiệp**: Nhân Đạo · Tham 24 / Sân 27 / Si 27 · thiện 55, định 27, bố 20. **Tính Khí**: 戊 núi cao; nạp âm 霹雳火 (Tích Lịch Hỏa).

**Cờ**: `shiCai`, `shangCai`, `shangYin`, `xiaoShi` (đã chế), `shangJin` (1,1% — hiếm).

**Thời Vận 2026**: đại vận 丁卯 (52–61, từ 2020) điểm 7 → «Đại cát»; lưu niên 丙午 điểm 33 → «Hơi kỵ».

**Nhịp tu** (40/ngày → 40,0 ĐH/ngày): bậc 2: 2 · bậc 3: 10 · bậc 4: 25 · bậc 5: 55 · bậc 6: 113.

**Đọc trong game**

- **Thuận Thiên** (1,9% người chơi): Tổ Sư nhận ngay. Không bệnh → Vận Mệnh Các tìm vận `gejuDelta < 0` làm «ải giữ cách».
- Cờ `STAT-FLAG-shangJin` «Thương Quan Thương Tận» (Quan Sát vắng sạch, Quan = 0 ở Ngũ Duy): Phương sĩ nói «con không cần ai cho phép» — mà Mệnh Cách lại là Thuận Thiên (được nhận ngay). Mâu thuẫn hay: người không cần phép lại được mời vào. 03 có thể dùng làm xung đột nội tâm Hồi I.
- Đặc Tính ít nhất nhóm mẫu (5) và Quý Khí vi bạc — điểm cao không đi kèm nhiều sao. Ví dụ cho 04-13: các chỉ số độc lập nhau.
- Thân nhược + Tướng Tinh II: «Cầu Trợ» nhưng người khác dễ theo — kiểu lãnh đạo nhờ đội.
- Đại vận Đại cát → R2 +6%; `currentVitality` 78 → Khí Thịnh.

---

## `MAU-H` · 2003-08-10 06:45, nữ

Chạy lại: `analyze(2003, 8, 10, 6, 45, 'nữ', 2026)`

| Trụ | Năm | Tháng | Ngày | Giờ |
|---|---|---|---|---|
| Can chi | 癸未 | 庚申 | 乙卯 | 己卯 |
| Nạp âm | 杨柳木 | 石榴木 | 大溪水 | 城头土 |
| Thập thần can | 偏印 | 正官 | (Nhật chủ) | 偏財 |

**Lõi Tiên Thiên**

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| STAT-TIEMLUC | **70** (hơn 94% lá số) | |
| STAT-PHAMCAN | PC7 **Song Linh Căn** | THƯỢNG ĐẲNG |
| STAT-PHUCPHAN | phú quý → +9% (bậc 1), +0,5%/bậc | |
| STAT-THANLUC | **50** · Thân trung hòa → tự lực +5%, nhận trợ ×1,25 | effRatio 0.501 |
| STAT-THIENMENH | Dụng **Kim** · Hỷ Thổ · Kỵ Hỏa · Cừu Mộc · Nhàn Thủy | |
| STAT-MENHCACH | **Thuận Thiên** (正官格, 成格) | normal |
| STAT-MENHCAP | Phú Cách (đạt 4/6) | |
| STAT-NGUYENKHI | nền 25 → NK tối đa **113**; vận hiện tại 66 (Khí Thịnh) | |
| STAT-NGHICHTHIEN | ×1.00 | |
| Căn Cơ | 28 | |

**«Vì sao?»**

| # | Δ | Lý do (rút gọn từ engine) |
|---|---|---|
| 1 | +6 | 格局成败 (成格): Chính Quan cách → Thành cách. 格 thần 庚 (正官): thấu cán (month), thông căn (申) … |
| 2 | +4 | Thành chính cách (Chính Quan cách) — có cách rõ, +4. |
| 3 | +6 | Dụng Thần Kim có lực (21%) — có gốc, +6. |
| 4 | +3 | Dụng Thần thấu Thiên Can năm/tháng/giờ — vị trí hữu lực, +3. |
| 5 | +5 | Có Hỷ Thần Thổ (29%) sinh trợ Dụng — hữu tình, +5. |
| 6 | +3 | Lực Dụng ≥ lực Kỵ — thế cục chủ động, +3. |
| 7 | -5 | Tổ hợp hung (Kiêu Đoạt Thực) làm trọc cục, -5. Hóa giải: Tài chế Kiêu (Thiên Ấn). |
| 8 | +6 | Tổ hợp cát (Quan Ấn Tương Sinh, Thực Sinh Tài) nâng tầng cách cục, +6. |
| 9 | +3 | Nhiều cát tinh (tianYi, tianDe, jiangXing) phù trợ, +3. |
| 10 | -4 | 源流 khí trệ (chỉ 1/5) — nguồn Mộc vượng nhưng dòng tắc, −4. |
| 11 | -2 | 盖头截脚 (2/4 trụ can-chi khắc): 1 trụ trúng DỤNG → Dụng bị khắc yếu (-2). |
| Σ | 70 | **70** |

**Ngũ Hành Lực**

| Hành | Thuộc tính | wx.pct | Hệ số | Lực | Tầng |
|---|---|---|---|---|---|
| Mộc | Sinh Cơ | 31.8 | ×1 | 32 | 4 Thịnh |
| Hỏa | Nhiệt Tâm | 3 | ×0.8 | 2 | 0 Khuyết |
| Thổ | Định Lực | 29.3 | ×1 | 29 | 3 Vượng |
| Kim | Tuệ Kiếm | 20.7 | ×1.3 | 27 | 3 Vượng |
| Thủy | Linh Tuệ | 15.3 | ×1 | 15 | 2 Bình |

**Ngũ Duy**: Tài 83 · Quan 79 · Ấn 66 · Thực 23 (Bổ Khuyết) · Tỷ **100** (khởi đầu Đồng đạo).

**Mệnh Cách chi tiết**: `正官格`, `成格`, không bệnh.

**Đặc Tính**: `PERK-tianYi` [I] · `PERK-luShen` [II] · `PERK-jiangXing` [II] · `PERK-huaGai` [I] · `PERK-tianYiMed` [I] · `PERK-tianDe` [I] · `PERK-taiJi` [I] · `PERK-tianChu` [II] · `PERK-siFei` (kiếp số) [I]

**Quý Khí**: 贵气平平 (3) — Thiên Đức. **Túc Nghiệp**: Nhân Đạo · Tham 32 / Sân 0 / Si 27 · thiện 69, định 23, bố 10. **Tính Khí**: 乙 dây leo; nạp âm 大溪水 (Đại Khê Thủy).

**Cờ**: `guanYin`, `shiCai`, `xiaoShi` (đã chế), `caiGuan`.

**Thời Vận 2026**: đại vận 壬戌 (21–30, từ 2023) điểm 4 → «Cát»; lưu niên 丙午 điểm 24 → «Hơi kỵ».

**Nhịp tu** (40/ngày → 40,0 ĐH/ngày): bậc 2: 2 · bậc 3: 10 · bậc 4: 25 · bậc 5: 55 · bậc 6: 113.

**Đọc trong game**

- **Thân trung hòa** (4,4% người chơi): mức «Trung Dung» — tự lực +5%, nhận trợ ×1,25, thiền +5%. effRatio 0,501 → `strong: true` (engine giữ hướng Phù Ức theo ranh 0,50) nhưng nhãn là trung hòa. UI hiện nhãn engine.
- **Tứ Phế** ở lá số Song Linh Căn, Thuận Thiên → ải kiếp «Hồi Sinh» 4 mùa; Dụng Kim tầng 3 → còn 3 mùa; có Thiên Đức → bớt thêm 1 chặng trong mỗi mùa (2 chặng/mùa). Kiếp số không gắn với điểm thấp.
- Sân 0 → ải Sân 1 tầng; Tham 32 → 2 tầng.
- Sinh 2003: người chơi trẻ; đại vận 21–30 «Cát» — mốc tốt để kể «tuổi trẻ thuận vận, giữ được cách không?».

---

## Tổng hợp nhanh `MAU-A` … `MAU-H`

| Mẫu | TL | Phẩm căn | Phúc phận | Thân Lực | Dụng | Mệnh Cách | Mệnh Cấp | NK tối đa | Đặc Tính | Túc Nghiệp | DV 2026 | LN 2026 | NT |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | 41 | Tứ Linh Căn | khá no | 77 quá vượng | Thủy | Đắc Cứu | Thanh Quý | 112 | 9 | Nhân | Bình hòa | Đại hung | 1,19 |
| B | 48 | Tứ Linh Căn thuận | khá no | 62 vượng | Thủy | Nghịch Thiên | Thanh Quý | 113 | 8 | Nhân | Đại hung | Đại hung | 1,12 |
| C | 23 | Phàm Căn | tiềm năng ẩn | 62 quá vượng | Mộc | Nghịch Thiên | Thường Cách | 108 | 10 | Địa Ngục | Cát | Bình | 1,37 |
| D | 29 | Ngũ Linh Căn | tiềm năng ẩn | 66 quá vượng | Kim | Nghịch Thiên | Thường Cách | 105 | 9 | Địa Ngục | Hung | Đại hung | 1,31 |
| E | 45 | Tứ Linh Căn thuận | khá no | 60 vượng | Hỏa | Đắc Cứu | Thường Cách | 108 | 8 | Ngạ Quỷ | Hơi nghịch | Bình | 1,15 |
| F | 53 | Tam Linh Căn | tiểu phú quý | 59 vượng | Kim | Đắc Cứu | Phú Cách | 114 | 7 | Địa Ngục | Cát | Đại hung | 1,07 |
| G | 63 | Tam Linh Căn thượng | phú quý | 42 nhược | Hỏa | Thuận Thiên | Thanh Quý | 110 | 5 | Nhân | Đại cát | Hơi kỵ | 1,00 |
| H | 70 | Song Linh Căn | phú quý | 50 trung hòa | Kim | Thuận Thiên | Phú Cách | 113 | 9 | Nhân | Cát | Hơi kỵ | 1,00 |
