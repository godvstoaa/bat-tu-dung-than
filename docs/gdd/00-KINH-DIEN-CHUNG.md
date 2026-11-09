# 00 · KINH ĐIỂN CHUNG (Canon) — Huyền Giới · Mệnh Do Ta Tạo

> Bắt buộc đọc trước khi viết bất kỳ tài liệu nào trong `docs/gdd/`. Mọi mã định danh, tên gọi, con số dưới đây là **chuẩn duy nhất**. Tài liệu nào cần mã mới thì tự mở **trong không gian tên của mình** (ghi ở mục 9) và liệt kê trong phần «Mã định danh mới» của tài liệu đó.
>
> Bản sơ đồ tổng: `docs/GAME-AAA-THIET-KE.md` (14 phần). Mỗi phần nở thành một tài liệu chi tiết trong `docs/gdd/<số>-<tên>/`.

## 1. Quy ước trình bày

- Tiếng Việt **có dấu đầy đủ**. Thuật ngữ Hán: chữ Hán + Hán Việt + nghĩa ở lần đầu (vd «格局 Cách cục (khung lá số)»), sau đó dùng Hán Việt.
- Dẫn engine của app: `` `tên-file › tênHàm/trường` `` (vd `` `remedy-fate › CONG_QUA` ``). Chỉ dẫn những gì **có thật** trong `src/engine/` hoặc `src/game/`. Thứ chưa có thì ghi rõ «**(chưa có — cần làm)**».
- Mỗi tài liệu là **một thư mục** gồm:
  - `README.md`: mục lục, phạm vi, tóm tắt, danh sách mã mới;
  - các phần `NN-<tên-phần>.md`, mỗi phần ≤ 1.200 dòng.
- **Độ dài mục tiêu: ≈ 10.000 dòng mỗi tài liệu**, bằng **nội dung thật**:
  - kịch bản từng cảnh và từng câu thoại;
  - bảng cho từng thực thể;
  - spec từng cơ chế, công thức, ca biên;
  - checklist nghiệm thu.

  **Cấm độn**: không lặp đoạn, không sinh danh sách vô nghĩa, không viết cùng một ý hai lần.
- Bảng dùng Markdown. Kịch bản thoại dùng dạng:
  ```
  [CẢNH MQ-1-03.2 · Am Vân Cốc · đêm, giờ Hợi · mưa nhỏ]
  VÂN CỐC: (rót trà) Con ngồi đi.
  > Lựa chọn: ① «…» → [MQ-1-03.3a]  ② «…» → [MQ-1-03.3b]
  ```

## 2. Trụ cột (không được vi phạm)

1. **T1 · Lá số là nhân vật.** Mọi chỉ số từ `chart.js › analyze()`, không bịa công thức bói.
2. **T2 · Mệnh do ta tạo.** Không phán «mệnh đã định»; lá số thấp có lợi thế tu (hệ số Nghịch Thiên).
3. **T3 · Văn tu, không sát phạt.** Không có quái để giết; thử thách là tâm, trí, đức, nghề.
4. **T4 · Thế giới thật.** Mọi công trình trong tầm đi bộ đều đi vào được, có công năng.
5. **T5 · Đúng cổ pháp.** Game nói đúng như trang chính; AI không bịa dữ kiện (`checkNeo`).
6. **T6 · Tôn trọng và an toàn.**
   - Không hướng dẫn nghi thức thật có hại; không bán cải mệnh; không chẩn bệnh.
   - Âm tà theo `amta-data › ETHICS` (tự nguyện bật).
   - Phù chỉ dùng **ký tự hư cấu của game** (app cố ý để phù «không vẽ được»).

## 3. Vùng (region id)

**Vùng đã có** (`terrain.js › REGIONS`, tọa độ mét):

| id | Tên | Tâm | Sảnh nghề (đã có) |
|---|---|---|---|
| `thanh` | Huyền Thành (+ Huyền Quán Sơn Môn) | 0, 0 | Hợp Hôn (−48, 8) |
| `tubinh` | Tử Bình Phong | −620, −560 | Cách Cục |
| `manh` | Manh Phái Cốc | 640, −520 | Tượng Pháp |
| `trichthien` | Trích Thiên Đỉnh | −600, 600 | Tử Vi |
| `cungthong` | Cùng Thông Hồ | 620, 620 | Điều Hậu |
| `thulau` | Thư Lâu Lâm | 0, −700 | Thư Lâu |
| `phongthuy` | Phong Thủy Viên | −820, 0 | Dương Trạch |
| `lichduong` | Lịch Đường | 820, 0 | Trạch Nhật |

**Thánh địa mới** (bản đồ mở rộng ra ±2.000 m; tọa độ tâm chuẩn):

| id | Tên | Đạo thống | Tâm (x, z) | Nguyên mẫu kiến trúc |
|---|---|---|---|---|
| `longho` | Long Hổ Sơn · Tự Hán Thiên Sư Phủ | Chính Nhất (+ Thần Tiêu) | 1500, −200 | Thiên Sư Phủ, Thượng Thanh cung (Giang Tây) |
| `vodang` | Võ Đang Huyền Nhạc | Thanh Vi + Đan Đỉnh | 0, −1500 | cung quán Võ Đang đời Minh |
| `chungnam` | Chung Nam Toàn Chân | Toàn Chân + Linh Bảo | 1400, −1300 | Bạch Vân Quán, Trùng Dương Cung |
| `maoshan` | Mao Sơn Thượng Thanh | Thượng Thanh + Lư Sơn | 1500, 1300 | Cửu Tiêu Vạn Phúc Cung |
| `yentu` | Yên Tử Trúc Lâm | Thiền (Trúc Lâm) | −400, 1500 | Yên Tử: Giải Oan, Hoa Yên, Huệ Quang, Chùa Đồng |
| `buttap` | Bút Tháp Tịnh Độ | Tịnh Độ + sám hối | 500, 1500 | chùa Bút Tháp, Tây Phương |
| `tangdia` | Tạng Địa Tuyết Vực | Mật (Chuẩn Đề; Tạng truyền **chờ tham vấn**) | −1500, −1300 | Potala, Samye, Jokhang |
| `vanmieu` | Văn Miếu Quốc Tử Giám | Nho + Tịnh Minh | 0, 1900 | Văn Miếu – Quốc Tử Giám Hà Nội |
| `phongdo` | Phong Đô Quỷ Thành | Bắc Đế + Động Uyên + Địa Tạng | −1500, 0 | Phong Đô (Trùng Khánh) |
| `mieucuong` | Miêu Cương Cổ Trại | bàng môn (hư cấu mới) | −1400, 1300 | Phượng Hoàng cổ thành, trại Tây Giang |
| `conlon` | Côn Lôn Thiên Trì | quy nhất (end-game) | 0, −900, cao 260 m (đảo trời) | Dao Trì (truyền thuyết) |
| `vancoc` | Am Vân Cốc | Liễu Phàm (cải mệnh) | 0, −260 (núi sau Hậu Sơn) | am tranh trên vách đá |

## 4. NPC chính (npc id)

| id | Tên | Ở | Vai |
|---|---|---|---|
| `thay_tubinh` | Thầy Tử Bình | Bàn Thầy, Sơn Môn | thầy chính, giải lá số (đã có) |
| `khong_tiensinh` | Khổng tiên sinh | bậc Sơn Môn → chợ các vùng | «định mệnh luận», đoán đúng mọi điều (phản đề) |
| `van_coc` | Vân Cốc thiền sư | Am Vân Cốc | người dẫn cải mệnh (Liễu Phàm) |
| `truong_thiensu` | Trương Thiên Sư | Long Hổ | Chính Nhất: phù lục, thụ lục, bái Đẩu |
| `huyen_hu` | Huyền Hư chân nhân | Võ Đang | nội đan, tĩnh tọa, Thái Cực |
| `khau_daotruong` | Khâu đạo trưởng | Chung Nam | giới luật, khoa nghi, Đạo Tạng |
| `maoshan_daonhan` | Mao Sơn đạo nhân (Mao Tiểu Tùng) | Mao Sơn | trừ tà chính tông, chẩn đoán đời thực |
| `truclam_thiensu` | Thiền sư Trúc Lâm (Pháp Không) | Yên Tử | thiền, công án |
| `dieu_am` | Ni sư Diệu Âm | Bút Tháp | niệm Phật, sám hối, phóng sinh |
| `lama_dakiet` | Lạt-ma Đa Kiệt | Tạng Địa | quán tưởng, vô thường (chờ tham vấn) |
| `te_tuu` | Tế tửu Văn Miếu (Chu Văn Trinh) | Văn Miếu | Nho, khoa cử, công quá cách |
| `phan_quan` | Phán quan Thôi | Phong Đô | đọc sổ nghiệp |
| `diatang_su` | Địa Tạng sứ giả | Phong Đô | dẫn người ra |
| `vu_y_amau` | Vu y bà A Mậu | Miêu Cương | y dược theo ngũ hành, chuyện xưa |
| `lo_ban_su` | Yểm sư Lỗ Ban (Công Thâu Nghiệt) | lang thang; hang dưới Miêu Cương | **phản diện chính**, thủ lĩnh ngầm Định Mệnh Hội |
| `dinh_menh_hoi` | (phe) Định Mệnh Hội | quầy «đổi mệnh» ở mọi vùng | phe phản diện: định mệnh luận + lừa đảo tâm linh |
| `gac_cong` | Lão Tùng (người gác cổng Sơn Môn) | Sơn Môn | nhập môn, tutorial |
| `tho_may` | Thợ May Tiên Y (Bà Tư) | quầy Tàng Y Các | trang phục (đã có) |
| `dan_dinh` | Đan Đỉnh chân nhân (Cát Huyền) | Võ Đang (lò đan) | dẫn lộ «Đắc Cứu» (hái vị thuốc) |
| `phuong_si` | Phương sĩ Vô Danh | lang thang | dẫn lộ «Dị Cách» |

## 5. Chỉ số nhân vật (tên cố định — tài liệu 04 là chuẩn chi tiết)

| Tên trong game | Nguồn engine |
|---|---|
| **Tiềm Lực** (Tiên Thiên, 0–100) | `synthesis.score` |
| **Phẩm căn** (10 bậc: Phàm Căn, Ngũ Linh Căn, Tứ Linh Căn, Tứ Linh Căn thuận, Tam Linh Căn, Tam Linh Căn thượng, Song Linh Căn, Song Linh Căn thượng, Dị Linh Căn, Thiên Linh Căn) | `synthesis.gradeVi` (ngưỡng 28/36/43/50/58/66/73/80/86) |
| **Phúc phận** (6 bậc) | `synthesis.fortune` |
| **Ngũ Hành Lực**: Sinh Cơ (Mộc), Nhiệt Tâm (Hỏa), Định Lực (Thổ), Tuệ Kiếm (Kim), Linh Tuệ (Thủy) | `wx.pct` |
| **Thân Lực** (0–100) | `strength.effRatio × 100`, `strength.level` |
| **Thiên Mệnh Hành / Hỷ / Kỵ / Cừu** | `yong.primary/xi/ji/chou` |
| **Ngũ Duy**: Thương đạo (Tài), Trị đạo (Quan), Học đạo (Ấn), Nghệ đạo (Thực), Đồng đạo (Tỷ) | `five-dim-radar › fiveDimRadar` |
| **Mệnh Cách**: Thuận Thiên (成格) · Đắc Cứu (有救) · Nghịch Thiên (败格) · Dị Cách (特殊) | `patternQuality.quality` |
| **Mệnh Cấp** (极品 / 贵格 / 富格 / 清贵 / 常格 / 下格) | `chart-level › classifyChartLevel` |
| **Nguyên Khí** (0–100) | `vitality › analyzeVitality.baseVitality` |
| **Đặc Tính** | `shensha` (~31 sao) + `noble-stars` |
| **Túc Nghiệp** + 3 tâm ma (Tham, Sân, Si) | `liudao › computeLiuDao` |
| **Tính Khí** | `personality-profile` + `nayin-personality` |
| **Thời Vận** | `dayun[current]`, `liunian[isNow]` |
| **Đạo Hạnh** (Hậu Thiên) | điểm tu tích lũy (mới) |
| **Hệ số Nghịch Thiên** | `clamp(1 + (60 − Tiềm Lực)/100, 1.0, 1.5)` |
| **Cảnh giới** | `Tiềm Lực × 0,4 + Đạo Hạnh` cho bậc 1–3; bậc ≥ 4 chỉ tính Đạo Hạnh |

**Cảnh giới** (6 bậc; tên theo đạo):

| Bậc | Đạo | Phật | Nho | Ngưỡng |
|---|---|---|---|---|
| 1 | Phàm Nhân | Tín Tâm | Học Trò | 0 |
| 2 | Nhập Môn | Quy Y | Sĩ | 100 |
| 3 | Luyện Tinh Hóa Khí | Trì Giới | Quân Tử | 400 |
| 4 | Luyện Khí Hóa Thần | Định | Hiền Nhân | 1.000 |
| 5 | Luyện Thần Hoàn Hư | Tuệ | Đại Nho | 2.200 |
| 6 | Luyện Hư Hợp Đạo | Giải Thoát | Thánh Hiền | 4.500 |

## 6. Hệ cải mệnh (tài liệu 05 là chuẩn chi tiết)

- **Ba tầng** (`remedy-fate › GAI_LEVELS`): Cải Vận (nông) · Cải Tâm + Cải Hành (giữa) · Cải Mệnh (sâu).
- **Mệnh Đồ** = `gaimenh › gaimenhPlan(R)`, 6 tầng cố định: Không gian → Tên → Thời → Thái Tuế → Làm công → Tích âm đức.
- **Sổ Công Quá** = `remedy-fate › CONG_QUA` + `meritLedger`. Mốc Liễu Phàm trong game: **300 / 600 / 1.000 công** (thang /10).
- **Nghiệp**: 10 ác nghiệp (`YEGUO`); sám hối (`CHAN_HUI`, 5 pháp); kinh theo việc (`JING_ZHOU`, 7).
- **Tà Lộ**: Âm Bài (×2 Hậu Thiên 7 ngày) + **Nợ Âm** (công khai) → Phong Đô → danh hiệu **Hồi Đầu**.
- **Quy nhất** = tu ≥ 3 đạo thống + Sổ Công Quá dương → mở Côn Lôn.

## 7. Tiền tệ, vật phẩm (đã có trong code)

- **Phúc Khí** (`state.phucKhi`, cày được; tiêu không giảm cấp; `state.xp` = tích lũy đời).
- **Ngọc** (`wardrobe.ngoc`): điểm danh (10 / 15 / 20 / 25 / 30 / 40 / 80), VIP +30 / ngày, +20 / cấp.
- **Tàng Y Các**: 51 món / 8 ô / 5 bộ ngũ hành (`cosmetics.js`). **Không bán Đạo Hạnh, cảnh giới, công đức.**

## 8. Cốt truyện (mã nhiệm vụ)

| Mã | Phạm vi |
|---|---|
| `MQ-P-xx` | Mở đầu «Nhập Môn» |
| `MQ-1-xx` | Hồi I «Bản Mệnh» |
| `MQ-2-xx` | Hồi II «Vạn Đạo» |
| `MQ-3-xx` | Hồi III «Năm Hạn» |
| `MQ-4-xx` | Hồi IV «Âm Dương» |
| `MQ-E-xx` | Vĩ thanh «Côn Lôn Thiên Trì» |
| `BR-<cách>-xx` | nhánh theo Mệnh Cách: `TT` Thuận Thiên, `DC` Đắc Cứu, `NT` Nghịch Thiên, `DK` Dị Cách |
| `SQ-<region>-xx` | nhiệm vụ phụ theo vùng |
| `TL-xx` | chuỗi Tà Lộ |
| `DQ-xx` | việc hằng ngày |
| `EV-<lễ>-xx` | sự kiện lễ tiết |
| `CQ-xx` | nhiệm vụ đạo thống (chuỗi tu của từng đạo) — tài liệu 05 / 09 cấp số |

## 9. Không gian tên cho mã mới

| Tài liệu | Được tạo mã |
|---|---|
| 02 Thế giới | `LORE-xxx` (mục codex), `FAC-xxx` (phe), `HIS-xxx` (sự kiện lịch sử) |
| 03 Cốt truyện | `MQ-*`, `BR-*`, `TL-*`, `CUT-xxx` (cảnh cắt) |
| 04 Chỉ số | `PERK-<sao>`, `STAT-*` |
| 05 Cải mệnh | `CQ-<đạo>-xx`, `DEED-xxx` (việc thiện / ác trong game), `KARMA-*` |
| 06 NPC · AI | `NPC-*` (NPC phụ mới), `PERSONA-<npc>`, `BARK-*` |
| 07 Thánh địa | `BLD-<region>-xx` (công trình), `POI-<region>-xx` |
| 08 Công trình | `MOD-<bộ>-xx` (mô-đun nội thất), `INT-<bld>` |
| 09 Tu luyện | `MG-xx` (mini-game), `ACT-xx` (hoạt động) |
| 10 Xã hội | `GUILD-*`, `EV-*` |
| 11 Kinh tế | `SKU-*`, `SEASON-xx` |
| 12 Trình bày | `UI-xx`, `SFX-*`, `BGM-*` |
| 13 Kỹ thuật | `TASK-xxx`, `SCHEMA-*` |
| 14 Rủi ro | `RISK-xx` |

## 10. Code đã có (để tài liệu không mâu thuẫn)

| Thư mục / tệp | Nội dung |
|---|---|
| `src/game/` | Three.js, Sơn Môn (`court.js`, `sect.js`), va chạm theo hình khối (`collide.js`), A* (`world.js`), điện vào được qua phòng ngoài bản đồ (`interior.js`), Vận Mệnh Các + Thái Tuế Điện, Tàng Y Các, gia trì nguyên tố, ngự kiếm, MMO (`net.js`, `worker/quan-room.js`), Thầy AI (`master-ui.js`), giải án 6 bước (`cases.js`), 8 sảnh nghề (`halls.js`), giải quẻ 5 phép (`que-ui.js`, web) |
| `src/engine/` | 249 module của app (xem phụ lục A bản sơ đồ tổng) |
| `features.js` | Bản iOS tắt: xăm, sen, quẻ, Vận Mệnh Các, Thái Tuế Điện, Thầy AI |

## 11. Lá số mẫu dùng chung trong mọi tài liệu (để ví dụ khớp nhau)

| Mã | Ngày giờ | Ghi chú (đã chạy engine thật) |
|---|---|---|
| `MAU-A` | 1990-05-15 08:30, nam | Canh Kim tháng Tỵ (月柱 辛巳 — 15/5 sau Lập Hạ, trước Mang Chủng), Thân quá vượng, Dụng Thủy / Hỷ Kim, điểm 41 (TRUNG ĐẲNG · Cân bằng → **Tứ Linh Căn**), 七殺格, Kim 55%, Thủy 2%. Đại vận đang đi 甲申 (28–37 tuổi). Tuổi Ngọ phạm Trị + Hình Thái Tuế năm 2026 丙午 |
| `MAU-B` | 1995-06-15 08:30, nam | Dụng Thủy (test A4 của game) |
| `MAU-C` … | | tài liệu 04 tự chạy thêm ≥ 6 lá số phủ đủ: điểm < 28, 28–35, 50–57, ≥ 73, cách 有救, cách 特殊. Ghi rõ ngày giờ để người khác chạy lại |

## 12. Đính chính sau khi viết 14 tập (2026-11-05)

Các điểm dưới đây được ít nhất hai tập độc lập phát hiện khi chạy engine thật; từ nay chúng **thay thế** chỗ mâu thuẫn trong bản sơ đồ tổng `GAME-AAA-THIET-KE.md`.

| # | Đính chính | Nguồn phát hiện |
|---|---|---|
| Đ1 | `MAU-A` sinh tháng **Tỵ** (月柱 辛巳), không phải tháng Ngọ | 03, 06 |
| Đ2 | Điểm công/quá của việc thiện **theo engine `CONG_QUA`** (vd. phóng sinh +3, không phải +1). «Sửa cầu đường» không có trong engine: tập 05 cấp `DEED-*` riêng, ghi rõ là việc do game thêm | 01, 03, 05, 13 |
| Đ3 | Nhánh **Dị Cách** kích hoạt khi `pattern.type === 'special'`; giá trị `特殊` của `quality` gần như không còn xuất hiện (0/4.000 lá số) | 03, 04, 05 |
| Đ4 | Khoảng **51 %** người chơi rơi nhánh Nghịch Thiên (败格); Thuận Thiên ≈ 1,9 %. Nghịch Thiên là đường chính, mở đầu «Sơn Môn từ chối» phải viết cho số đông | 04 |
| Đ5 | Luôn truyền năm hiện tại vào `gaimenhPlan` (mặc định đang tính Vận 8) | 03 |
| Đ6 | Năm âm lịch / lễ hội: `lunar-javascript` dùng UTC+8; lịch Việt Nam là UTC+7, phải đối chiếu từng năm | 09, 10 |
| Đ7 | Các phòng «ngoài bản đồ» (x 1.500–2.000) trùng vùng Long Hổ Sơn và vượt `maxX` của server → chuyển vào công trình thật theo tập 08 | 07, 08, 10, 13 |
| Đ8 | Không gian tên bổ sung: tập 01 dùng `KT/VD/AL/PS/GL/KPI` (nội bộ tài liệu 01); camera và hiệu ứng dùng khoá cấu hình `cam.*`, `fx.*` (tập 12) | 01, 12 |
