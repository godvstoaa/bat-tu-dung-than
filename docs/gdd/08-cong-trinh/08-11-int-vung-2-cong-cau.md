# 08-11 · Thật hóa vùng (2): Cùng Thông Hồ · Thư Lâu Lâm · Phong Thủy Viên · Lịch Đường · Lưng Chừng Quán · bốn cổng tông môn · cầu Huyền Hà

> Tiếp 08-10. Cùng quy ước. Mọi vùng dùng `palaceComplex` hưởng bản sửa chung ở 08-10 §1.2 (`tierShrink`, nền từng tầng, bậc 0,4 m, công trình phụ nằm trọn trong tầng trên).

---

## 1. Cùng Thông Hồ (`cungthong`)

### 1.1 Hiện trạng

```js
const p = R('cungthong');                                                // (620, 620), hồ, h −24
for (const [dx, dz] of [[-1, -1], [-1, 0.2], [0.2, -1]]) {               // ba điểm bờ
  const s = shore(p.x, p.z, dx, dz);                                     // điểm đầu tiên cao hơn mặt nước 0,8 m
  await placeModel(g, 'tea_pavilion', { fit: { width: 34 }, at: { x: s.x, y: H(s.x, s.z), z: s.z, ry: faceTo(s.x, s.z, p.x, p.z) } });
}
// 5 thuyền `boat` trên mặt hồ; đình vườn `lib_garden_pav` rộng 16 tại (462, —, 402); vòng liễu / đào quanh bờ
```

| Công trình | Kích thước | Lòng đo được |
|---|---|---|
| `tea_pavilion` 34 m | 34 × 20,6 × 31,5 | **trên cột** (dải 0–3,6 mở); sàn có lan can 24,5 × 23,5 ở 3,6–5,2; dải 5,2–8,4 gần như mở (sảnh không vách, chỉ cột); **lầu kín** 23 × 20,5 ở 8,4–10; gác 16,5 × 15 ở 10–16 |
| `lib_garden_pav` 16 m | 16 × 9,2 × 15,7 | phòng 11 × 10,5 ở 2–5,2 (trên bệ thấp); đèn lồng mái 4 × 3,5 ở 5,2–6,8 |

Đặt «nửa trên bờ nửa trên nước» (điểm bờ cao hơn mặt nước 0,8 m) — hợp kiểu nhà sàn ven hồ. Lỗi hiện có: **không có va chạm** cho trà lâu (`placeModel` gọi trực tiếp, không `addFootprint`) → người chơi đi xuyên cột và không lên được sàn.

### 1.2 Ba trà lâu theo Điều Hậu (hạng C)

Sảnh nghề Điều Hậu dạy **hàn / noãn / táo / thấp** của lá số (`han-nuan › analyzeHanNuan`). Ba trà lâu là ba «khí hậu» để người chơi **ngồi uống trà đúng khí** của lá số mình.

| INT | Hướng bờ | Tên | Khí | Trà và không gian | Màu nhấn |
|---|---|---|---|---|---|
| INT-CT-TRALAU-NOAN | (−1, −1) — Tây Bắc, gần đường từ thành | **Noãn Trà Lâu** | ấm | trà già, lò than đỏ giữa sàn, rèm dày, đèn vàng | đỏ son, vàng |
| INT-CT-TRALAU-HAN | (0,2, −1) — Bắc | **Hàn Trà Lâu** | mát | trà xanh, chậu nước sen, mành trúc mở thoáng, đèn trắng | lam, lục |
| INT-CT-TRALAU-TAOTHAP | (−1, 0,2) — Tây | **Táo Thấp Lâu** | cân táo – thấp | phòng nửa khô (sàn gỗ, than hút ẩm) nửa ẩm (bể nước, rêu) — hai nửa sàn | nâu, xám |

#### Khoang (mỗi trà lâu, cục bộ — +Z quay ra hồ)

| Khoang | Tên | Cao độ (trên đáy) | Kích thước | Camera |
|---|---|---|---|---|
| `ct.san` | Sàn trà (mở, lan can) | 3,6 | 24,5 × 23,5 | ngoài trời có mái (`roofZone`) |
| `ct.lau` | Lầu trà (kín) | 8,4 → 11,6 | 23 × 20,5 | TRONG |
| `ct.gac` | Gác trà sư | 12,0 → 15,6 | 16,5 × 15 | BỔ DỌC |

Lối: bậc gỗ từ bờ lên sàn (MOD-GNA-46, 9 bậc 0,4), thang gỗ trong góc sàn lên lầu (MOD-GNA-44 × 2 đợt), thang hẹp lên gác. Dưới sàn (0–3,6): cột chống (va chạm tròn từng cột) — đi dưới gầm phía bờ được, phía nước là mặt hồ.

#### Mặt bằng sàn trà (cục bộ)

```
                       HỒ (+Z)
 ┌───────────── 24,5 — lan can mỹ nhân kháo (MOD-GNA-19) ─────────────┐
 │  ▣ bàn   ▣ bàn   ▣ bàn        (bát tiên trác MOD-GNA-28 × 6,        │
 │                               ghế MOD-GNA-29 × 24)                  │
 │         ◎ LÒ THAN / CHẬU NƯỚC (đặc trưng khí của lâu)               │
 │  ▣ bàn   ▣ bàn   ▣ bàn                                              │
 │                                                    █ thang lên lầu   │
 │  [quầy trà sư · MOD-GNA-35 kệ trà · MOD-GNA-30]    █                 │
 └──────────────────────[ bậc lên từ bờ ]──────────────────────────────┘
                       BỜ (−Z)
```

#### Trạm

| Id | Khoang | Tên | Nối |
|---|---|---|---|
| `ct_hoikhi` | `ct.san` (trà lâu nào cũng có) | Trà sư · «Hỏi khí lá số» → chỉ trà lâu hợp khí | `han-nuan › analyzeHanNuan` (thiếu hàn → Hàn lâu …) |
| `ct_uong` | `ct.san` | Ngồi bàn · «Uống một ấm» | `tea-therapy › teaTherapy`; thời gian ngồi cộng như Trà Thất (`state.js › addTeaMinutes`, trần 15 Phúc Khí / ngày dùng chung) |
| `ct_lau` | `ct.lau` | Lầu trà · «Ngắm hồ theo mùa» | lời Cùng Thông Bảo Giám theo tháng (`kb.js › QIONGTONG_TIAOHOU`) hiện trên bình phong |

NPC: trà sư (Thìn → Hợi) mỗi lâu, tiểu đồng pha trà, 2–4 khách trà (NPC `makeNpc`). Đèn: sàn 6 đèn lồng giấy (GNA-36), lầu 4, gác 1; lò than là đèn `bep`. Âm: nước vỗ chân cột (nhiễu lọc 300 Hz điều biến), `lau_go`. Cửa: lầu `bucban` lịch `cho` kéo dài tới giờ Hợi (trà lâu mở tối). **Ước lượng**: va chạm cột + nền ba mức (dùng chung 3 lâu) 3 · công thức dùng chung + 3 biến thể khí 4 · trạm 3 · test 1 → **11 ngày** cho cả ba.

### 1.3 INT-CT-THUYTA — Điều Hậu Thủy Tạ (hạng C)

| Thông số | Giá trị |
|---|---|
| Vỏ | `lib_garden_pav` 16 tại (462, —, 402), quay về tâm hồ; cách bàn Sảnh Điều Hậu (480, 420) ~25 m |
| Lòng | phòng 11 × 10,5 sàn ~2,0 (trên bệ, 5 bậc 0,4); đèn lồng mái nhỏ (không đi) |
| Vai | **sảnh trong** của nghề Điều Hậu: án khó |
| Nội dung | 4 bình phong bốn mùa (MOD-GNA-32: xuân, hạ, thu, đông) xoay được; bàn giữa đặt **lò than** và **chậu nước** — người chơi điều chỉnh than / nước để «điều hậu» cho lá số mẫu (trò minh họa: nhiệt độ – độ ẩm của lá số theo `analyzeHanNuan`) |
| Trạm | `ct_ankho` · «Nhận án Điều Hậu khó» (`halls.js › buildDieuHau` nâng cấp); `ct_dieuhau` · «Điều than nước» (minh họa) |
| Cửa | `bucban` 4 mặt (mở hết ban ngày — thủy tạ thông gió), lịch `dien_phu` |
| Ước lượng | 5 ngày |

### 1.4 Thuyền

5 `boat` neo giữa hồ — **không có bến** → phương tiện, ngoại lệ (08-01 §11). Khi tài liệu 07 thêm bến đò, thuyền gần bến lên hạng D: boong đi được (`addPlatform` theo mặt boong), ghế ngồi, chèo (tương tác nhỏ).

---

## 2. Thư Lâu Lâm (`thulau`)

### 2.1 Hiện trạng

```js
const p = R('thulau'); const ry = faceTo(p.x, p.z, 0, 0);                   // (0, −700), ry 0
const top = terrace(g, { x: p.x, z: p.z, ry, w: 110, d: 110, levels: 3, rise: 3.5 });   // mặt ≈ 110 + 10,5
await place(g, ['tower_nine', 'library_tower'], { fit: { height: 112 }, at: { x: p.x, y: top, z: p.z, ry } });
for (const sx of [-1, 1]) { const s = local(p.x, p.z, ry, sx * 42, 30); await place(g, 'library_tower', { fit: { height: 48 }, at: { x: s.x, y: top, z: s.z, ry } }); }
```

| Công trình | Kích thước | Khung (thế giới) |
|---|---|---|
| Thư Lâu `tower_nine` 112 | 44,4 × 112 × 44,7 | x −22,2…22,2, z −722,35…−677,65 |
| Tàng Thư Các `library_tower` 48 × 2 | **51,2 × 48 × 48,9** | x ±(16,4…67,6), z −694,45…−645,55 |

### 2.2 Lỗi bố cục nặng

| Lỗi | Số đo |
|---|---|
| Hai Tàng Thư Các **chồng vào Thư Lâu** | phần chung x ±(16,4…22,2), z −694,45…−677,65 (5,8 × 16,8 m mỗi bên) — hai khối đặc cắt nhau |
| Tàng Thư Các chìa ra ngoài tầng trên (83,6 → ±41,8) | tới 25,8 m |
| Cửa `ROOMS › vanxuong` tại (0, −652) | nằm **giữa** hai Tàng Thư Các (z −652 thuộc khoảng z của chúng) |

**Sửa**: Tàng Thư Các thu `fit height 48 → 36` (38,4 × 36 × 36,7) và **xuống mặt đất ngoài nền**, tại cục bộ **(±78, 10)** → khung x ±(58,8…97,2): nền 110 m (mép ±55) cách 3,8 m; nối lên nền bằng cầu đá có mái ngắn (hạng D, mô-đun GNA-45 đổi bộ BAC). Thư Lâu giữ nguyên trên nền.

### 2.3 INT-TL-THULAU — Thư Lâu Cửu Tầng (hạng A)

| Thông số | Giá trị |
|---|---|
| Vỏ | `tower_nine` cao 112 trên nền (mặt nền y ≈ 120,5) |
| Lòng (suy × 3,01 từ đo ở 37,2) | phòng trệt ~18 × 19,5; tầng ~11 m |
| Cách làm | **dựng lại thân bằng mô-đun** (08-02 §5.7), giữ chín tầng mái Meshy; mỗi tầng 11 m chia **sàn chính** (cao 6,4) + **gác kệ** (4,6) — kệ sách hai mức kiểu thư lâu cổ |
| Thang | chữ U quanh lõi giữa (lõi chứa kệ xoay NHO-45 ở tầng trệt) |

| Tầng | Nội dung | Nối |
|---|---|---|
| Trệt | **Văn Xương Các** (chuyển `ROOMS › vanxuong`): tượng `deity_wenchang` trên bệ, bàn lễ; kệ xoay tám mặt giữa sảnh; **bàn đọc «tầng thư hôm nay»** | `halls.js › buildThuVien` (sảnh trong của nghề Thư Viện) |
| 2 | tầng **Kinh điển Bát Tự** (經典) | `library-data › LAYERS[classic]` |
| 3 | **Đạo Tạng** (chưng cất) (道藏) | `LAYERS[daozang]`, `daozang-data` |
| 4 | **Công pháp tu hành** (功法) | `LAYERS[cultivation]`, `cultivation-data` (kèm cảnh báo «không tự luyện ngoài đời») |
| 5 | **Nghi thức · Ấn** (科儀) | `LAYERS[ritual]` — chỉ đọc lịch sử, không hướng dẫn thực hành (T6) |
| 6 | **Phương thuật** (方術) | `LAYERS[phuongthuat]` |
| 7 | **Thần chú** (神咒) | `LAYERS[mantra]` — chỉ đọc văn bản / nghĩa |
| 8 | **Phù bùa** (符籙) | `LAYERS[fu]` — **không hiện hình phù thật**; minh họa bằng ký tự hư cấu của game |
| 9 (đỉnh) | **Bí truyền · Thất truyền** (秘傳) + đài ngắm toàn rừng | `LAYERS[bitruyen]`; tầng mở khi đọc đủ 7 tầng dưới (`library-data › countByLayer`) |

Mỗi tầng: NHO-17 kệ dọc tường hai mức, NHO-46 bàn đọc đứng, NHO-13 án thấp × 4, NHO-47 đèn; biển tầng (NHO-35). Trạm: `tl_tang_<layer>` (8 trạm) + `tl_vanxuong` (dâng hương Văn Xương — `remedy-fate › CONG_QUA` việc «khích lệ học») + `thuvien` (giữ id sảnh, đặt cạnh cửa vào).

**Văn Xương Các** thay `ROOMS › vanxuong` (cửa cũ (0, −652), origin (1600, 0)): trạm menu «Văn Xương Các» trỏ tới cửa Thư Lâu.

NPC: **thủ thư** (Mão → Hợi, tầng trệt), **mọt sách** (NPC khách, 1–2 người ngồi tầng ngẫu nhiên). Âm: `trang_sach`, `dien_vua`; tầng càng cao càng nghe gió.

**Ước lượng**: dựng lại thân 9 tầng (12) · 8 tầng thư + nối `library-data` (6) · Văn Xương Các chuyển (1,5) · test (2) → **21,5 ngày**.

### 2.4 INT-TL-TANGTHU-DONG, -TAY — Tàng Thư Các (hạng B)

| Thông số | Giá trị |
|---|---|
| Vỏ | `library_tower` `fit height 36` (38,4 × 36 × 36,7) tại cục bộ (±78, 10) sau sửa |
| Lòng (suy) | **rỗng toàn khối** ~32 × 33 tới 18 m (vỏ không lõi, V1) |
| Cách làm | lót + dựng **hai sàn** trong lòng (y +0,4 và +9,4), thang U |
| Nội dung | **Tứ khố**: Đông — tầng 1 **Kinh** (kinh điển), tầng 2 **Sử** (sử truyện); Tây — tầng 1 **Tử** (chư tử, y bốc, thuật số), tầng 2 **Tập** (thi văn) |
| Nối | `library-data › LIBRARY` lọc theo trường `school` / nội dung; `kb.js` (`DITIANSUI`, `WUYAN_DUBU`, `JISHAN_PIAN`) cho khố Tử |
| Trạm | `tl_kho_kinh`, `tl_kho_su`, `tl_kho_tu`, `tl_kho_tap` |
| Ước lượng | 7 ngày (cả hai) + dời và cầu nối 2 = **9 ngày** |

---

## 3. Phong Thủy Viên (`phongthuy`)

### 3.1 Hiện trạng

`palaceComplex(g, { x: −820, z: −40, ry: faceTo(…) ≈ 1,522, scale: 0,6 })` + `luopan_stand` cao 18 tại (−820, —, 50) quay về thành. Kích thước như Hậu Sơn nhưng chính điện là `palace_grand` 55,2 (không phải `cliff_palace`), có cổng `sect_gate_grand` 27,6. Áp sửa chung 08-10 §1.2.

### 3.2 INT-PT-DAIDIEN — Dương Trạch Đường (hạng A)

| Thông số | Giá trị |
|---|---|
| Vỏ | `palace_grand` 55,2 (55,2 × 39,1 × 32,9) |
| Lòng (× 1,2545 từ đo ở 44) | sảnh lõi **25 × 13,2**, thông thủy ~7,5; tầng trên 23,8 × 16,3 sàn ~12 trên đáy |
| Ý | **«Ngôi nhà mẫu»**: sàn sảnh kẻ **lưới 9 cung Lạc Thư** (mỗi ô 8,3 × 4,4 m) bằng gạch hai màu; đồ đạc (giường, bếp, bàn làm việc, cửa giả) **di chuyển được** — học Bát trạch và Huyền Không bằng cách kê đồ thật |

| Khoang | Nội dung | Trạm | Nối |
|---|---|---|---|
| `pt.l0.cuucung` | lưới 9 cung + bộ đồ di chuyển + la bàn treo trần chỉ hướng tọa thật của điện | `pt_kedo` · «Kê đồ theo cung» | `zhai › computeZhai` (Bát trạch, Đông / Tây tứ mệnh), `xuankong › xuankongPan` (vận hiện tại `sanyuan-jiuyun › currentYun`); chấm kiểu `grid9` |
| `pt.l0.ankho` (gian bên) | sảnh trong nghề Dương Trạch: án khó | `pt_ankho` | `dz-case.js` nâng cấp |
| `pt.l1.thuvien` | thư phòng phong thủy | `pt_sach` · «Đọc phép hóa sát» | `fs-cure › SHA_LIST` (tài liệu tổng §7.1 nhắc) |

**Ước lượng** 14 ngày.

### 3.3 Công trình còn lại của Phong Thủy Viên

| INT | Hạng | Tên · nội dung | Nối | Ngày |
|---|---|---|---|---|
| INT-PT-DIENDONG | B | **Loan Đầu Đường** — sa bàn núi sông (long, sa, thủy, huyệt) đắp nổi giữa sảnh; người chơi đặt «nhà» lên sa bàn | `space-fs › spaceFs`, `city-fs › cityRecommendation` | 5 |
| INT-PT-DIENTAY | B | **Âm Trạch Đường** — học tọa hướng mộ phần qua sa bàn (chỉ học lý, không hướng dẫn táng thật) | `yinzhai › sittingDirectionAnalysis`, `MOUNTAINS_24` | 5 |
| INT-PT-THAPDONG | B | **Thanh Long Lâu** — 9 tầng (thang xoắn dùng chung), đỉnh nhìn thế núi bên tả | tương tác nhỏ + thoại về tả Thanh Long | 4 |
| INT-PT-THAPTAY | B | **Bạch Hổ Lâu** — đối xứng, nhìn bên hữu | | 4 |
| INT-PT-SONMON | B | cổng có phòng gác + phòng đón khách (công thức cổng 08-11 §6 thu nhỏ) | | 3 |
| INT-PT-LABAN | D | **La Bàn Lớn** (`luopan_stand` cao 18): dựng **đài tròn** quanh chân (`addPlatform` cao 1,2, bậc 3) để đứng sát mặt la bàn; tương tác «Xoay la bàn đo hướng Huyền Thành» | `fengshui-compass › compassReading`, `bestDirection` | 2 |

---

## 4. Lịch Đường (`lichduong`)

Cùng bố cục `palaceComplex` scale 0,6 tại (820, −40) như Phong Thủy Viên (đối xứng qua trục Bắc – Nam). Chủ đề **thời gian**.

| INT | Hạng | Tên · nội dung | Trạm | Nối | Ngày |
|---|---|---|---|---|---|
| INT-LD-DAIDIEN | A | **Trạch Nhật Đường**: sảnh lõi 25 × 13,2 có **12 cột** mang 12 tháng, **24 phướn** 24 tiết khí treo xà, sàn khắc vòng 28 tú; bàn chọn ngày giữa; tầng trên là phòng soạn lịch (bàn chép lịch, ván khắc lịch) | `ld_chonngay` · «Chọn ngày cho việc» · `ld_ankho` (sảnh trong nghề Trạch Nhật) · `ld_soanlich` | `zheri › evaluateDate`, `findGoodDates`; `tianxing-zheri.js`; `huangdao › huangdao12`; `month-calendar › monthCalendar`; `zheri-case.js` nâng cấp | 14 |
| INT-LD-DIENDONG | B | **Thời Thần Đường**: 12 khám giờ (Tý → Hợi) quanh sảnh, khám giờ hiện tại sáng | `ld_gio` · «Giờ tốt hôm nay» | `lucky-hours › luckyHours`; web còn `best-hour › bestHourToday` theo lá số (iOS tắt phần theo lá số) | 5 |
| INT-LD-DIENTAY | B | **Niên Kỵ Đường**: bảng phương kỵ năm nay (Tam Sát, Thái Tuế, Ngũ Hoàng) trên sàn la bàn | `ld_nienky` · «Năm nay kỵ phương nào» | `annual-taboo › annualTabooOverview`, `checkAnnualTaboo` | 5 |
| INT-LD-THAPDONG | B | **Nhật Quỹ Lâu**: đỉnh tháp là **đồng hồ mặt trời** thật (bóng kim theo hướng mặt trời của `render3d` — trùng giờ thực) | `ld_nhatquy` (tương tác nhỏ có ý nghĩa: đọc giờ can chi bằng bóng) | `doors.js › gioOf` | 5 |
| INT-LD-THAPTAY | B | **Lậu Khắc Lâu**: mỗi tầng một bình nước của **đồng hồ nước** (lậu khắc) chảy tầng này xuống tầng kia; đỉnh có phao chỉ khắc | tương tác nhỏ | — | 5 |
| INT-LD-SONMON | B | cổng (công thức cổng thu nhỏ) | — | — | 3 |

---

## 5. INT-NUI-LUNGCHUNG — Lưng Chừng Quán (hạng C)

### 5.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình · đặt | `lib_mtn_house` `fit width 34` tại (−430, H, −330), quay về thành |
| Kích thước | 34 × 26,8 × 33,9 |
| Lòng đo được | **bệ đá đặc** toàn bộ dải 0,4–2; trên bệ: sân + nhà 31,5 × 29 ở 2–5,2; phòng 28 × 17–26 ở 5,2–10; tầng 25,5 × 27,5 ở 10–12; 17 × 8,5 ở 12–14; **lầu đỉnh** 13,5 × 18 ở 18–20 |
| Vị trí | đường núi lên Tử Bình Phong (đường đá `roadPath` tới sảnh Cách Cục đi gần) |
| Vai | quán trọ lưng núi — chỗ nghỉ giữa đường dài, kể chuyện vùng núi |

### 5.2 Khoang

| Khoang | Cao độ trên đáy | Kích thước | Nội dung | Kit |
|---|---|---|---|---|
| `lc.san` (sân trên bệ, ngoài trời) | 2,0 | ~31 × 8 phía trước | bàn đá, ghế, giếng (DAN-44), chuồng ngựa thồ | DAN |
| `lc.l0.quan` | 2,0 → 5,6 | 28 × 17 | sảnh quán: quầy, 6 bàn, bếp lớn (DAN-21 × 2), giếng trời (GNA-13) | GNA + DAN |
| `lc.l1.phong` | 5,8 → 9,8 | 28 × 17 | 5 phòng trọ quanh hành lang | DAN |
| `lc.l2.lau` | 10,2 → 13,6 | 25,5 × 27,5 | lầu ngắm, bàn trà | GNA |
| `lc.l3.dinh` | 18,2 → 20,8 | 13,5 × 18 | đình đỉnh (lan can 4 mặt) | GNA |

Tầng 12–18 (17 × 8,5 rồi hẹp hơn): mái chồng giữa lầu và đình đỉnh — thang gỗ lên **qua lòng mái** (GNA-44 × 2), không có phòng (kín mái, không cửa sổ — kiểm ảnh).

### 5.3 Trạm, NPC

| Id | Tên | Nối |
|---|---|---|
| `lc_chao` | Bát cháo theo tiết · «Ăn cháo nóng» | `seasonal-advice` (theo tiết khí, không theo lá số) |
| `lc_nghi` | Giường trọ · «Nghỉ chân» | lưu điểm hồi sinh (08-04 §5.1) |
| `lc_chuyen` | Bàn chủ quán · «Nghe chuyện núi» | lore Tử Bình Phong (`LORE-*` tài liệu 02), mách nhiệm vụ `SQ-tubinh-*` |
| `lc_dinh` | Đình đỉnh · «Ngắm Tử Bình Phong» | tương tác nhỏ |

NPC: chủ quán (Mão → Tý), con gái chủ quán bưng cháo, 1–3 khách đường xa (NPC). **Ước lượng 12 ngày** (bệ thành nền + 5 mức + thang 4).

---

## 6. INT-CONG-* — Bốn cổng tông môn trên đường (hạng B)

### 6.1 Hiện trạng

```js
for (const id of ['tubinh', 'manh', 'trichthien', 'cungthong']) {
  const p = R(id); const n = Math.hypot(p.x, p.z);
  const x = p.x - (p.x / n) * p.r * 1.05, z = p.z - (p.z / n) * p.r * 1.05;      // mép vùng, phía thành
  await place(g, ['sect_gate_grand', 'gate_sect'], { fit: { width: 70 }, at: { x, y: H(x, z), z, ry: faceTo(x, z, 0, 0) }, keep: corridor(x, z, faceTo(x, z, 0, 0), 8) });
}
```

| INT | Phái (`protocol.js › PHAI`) | Vị trí (xấp xỉ) |
|---|---|---|
| INT-CONG-TUBINH | Tử Bình | (−441, −398) |
| INT-CONG-MANH | Manh Phái | (453, −368) |
| INT-CONG-TRICHTHIEN | Trích Thiên | (−444, 444) |
| INT-CONG-CUNGTHONG | Cùng Thông | (434, 434) |

`sect_gate_grand` 70 m: 70 × 44,6 × 40,7; **thân rỗng** 69 × 40 (dải 0,4–2), 66 × 27 tới 14 m, 65 × 21 tới 20 m, 65 × 10,5 tới 24 m. Lối giữa khoét 16 m (`corridor` 8). Thân rỗng lớn → phải có phòng (08-01 §3 kéo hạng).

### 6.2 Công thức chung (một công thức, bốn biến thể bảng màu + biển)

| Khoang | Cục bộ (x · z) | Cao độ | Nội dung |
|---|---|---|---|
| `cg.vom` | −8…8 · −20…20 | 0,4 → 12 | lối đi, cánh cổng `congnang` 2 × 8 m + ngách (lịch `son_mon`) |
| `cg.tay` | −33…−8 · −13…13 | 0,4 → 6,8 | **Tiếp Khách Đường** của phái: sứ giả phái, bàn ghi danh, trà |
| `cg.dong` | 8…33 · −13…13 | 0,4 → 6,8 | **Phòng gác** + kho + bảng nhiệm vụ vùng |
| `cg.l1` | −32…32 · −10…10 | 7,2 → 13,6 | **Lầu cổng**: hành lang dài 64 m, cửa sổ nhìn hai phía; đầu Tây là «sảnh phái» trưng bày tổ sư phái (tượng / bài vị hư cấu) |
| `cg.l2` | −32…32 · −3…7 | 14,4 → 19,6 | gác trên: điểm ngắm vùng |

Thang: hai cầu thang U trong hai khoang trệt lên lầu; thang thẳng lên gác ở hai đầu.

### 6.3 Trạm

| Id | Tên | Nối |
|---|---|---|
| `cg_<phai>_ghidanh` | Bàn ghi danh · «Ghi danh vào phái …» | trường `phai` gửi trong gói `hello` (đang có — `PHAI` 4 phái); đổi phái có điều kiện (tài liệu 10 `GUILD-*`) |
| `cg_<phai>_suguia` | Sứ giả phái · «Nghe giới thiệu phái» | `schools-data › getSchool` không áp dụng (đây là phái **nghề bát tự**, không phải đạo thống) — thoại giới thiệu sách gốc của phái: Tử Bình → `kb.js` Tử Bình; Trích Thiên → `DITIANSUI`; Cùng Thông → `QIONGTONG_TIAOHOU`; Manh → `mangpai` |
| `cg_<phai>_nhiemvu` | Bảng nhiệm vụ vùng | `SQ-<region>-*` |

Bốn biến thể: bảng màu theo vùng (bảng ở 08-05 §3.1: `tubinh`, `manhcoc`, `trichthien`; Cùng Thông dùng bảng `cungthong` của GNA cho đồ, kết cấu vẫn BAC), biển chữ phái, đèn. **Ước lượng**: công thức chung 10 + mỗi biến thể 1,5 → **16 ngày**. Hai cổng nhỏ của Manh / Phong Thủy / Lịch Đường (`sect_gate_grand` 27,6–34,5 m) dùng **cùng công thức thu nhỏ** (bỏ gác trên khi lòng < 3,2 m).

---

## 7. INT-CAU-HUYENHA — Cầu đá Huyền Hà (hạng E)

### 7.1 Hiện trạng

```js
const [ax, az] = T.RIVER[2], [bx, bz] = T.RIVER[3];          // (−260, 230) → (−230, 60)
const x = (ax + bx) / 2, z = (az + bz) / 2;                  // (−245, 145)
await place(g, ['lib_stone_bridge', 'bridge_arch'], { solid: false, fit: { width: 46 }, at: { x, y: T.WATER + 0.3, z, ry: Math.atan2(bx - ax, bz - az) + Math.PI / 2 } });
```

`lib_stone_bridge` 46 × 8,3 × 8,7. **`solid: false`**: không va chạm, không mặt cầu → người chơi lội qua sông dưới gầm (nếu địa hình cho) hoặc không qua được; lan can không chặn. Cầu cách vòng đường đá (bán kính 205) ~80 m → thuộc tầm đi bộ (08-01 TĐ-2).

### 7.2 Sửa

| # | Việc |
|---|---|
| 1 | **Đo mặt cầu**: bắn tia dọc mỗi 0,5 m theo trục cầu (46 m) và 3 làn ngang → bảng cao độ mặt cầu |
| 2 | Mặt cầu thành chuỗi `addPlatform` (nền bậc mỗi 0,5 m, chênh ≤ 0,41 m — cầu vòm dốc thì thành bậc thật, đúng kiểu cầu vòm đá) |
| 3 | Lan can: cắt lát hình khối dải [mặt cầu + 0,4, + 2,0] **theo từng đoạn** (vì mặt cầu cong — một dải phẳng sẽ cắt sai): chia cầu 8 đoạn, mỗi đoạn một `base` |
| 4 | Hai đầu cầu nối đường: thêm đoạn đường đá nối vòng đường 205 m (tài liệu 07 duyệt tuyến) |
| 5 | Dưới gầm: mặt nước sông `WATER` — chặn lội (như mọi mặt nước) |
| 6 | Tương tác nhỏ (cho đủ D nếu muốn nâng): bia đầu cầu ghi tên cầu (lore) |

**Ước lượng 3 ngày.**

---

## 8. Ngoại lệ và trường hợp đặc biệt

| Đối tượng | Quyết định | Điều kiện đổi |
|---|---|---|
| Thiên Bàn Đảo `sky_palace` (0, 300, cao ~460–520) | cảnh nền xa | khi tài liệu 07 mở Côn Lôn và có lối lên: thật hóa **trước** khi mở (vỏ 240 m, ước lượng riêng ở tài liệu 07 với bộ mô-đun lưu ly — chưa có trong 7 bộ) |
| Đảo đá `rock_island` × 4 | không phải công trình | — |
| Núi chân trời | không phải công trình | — |
| Thuyền hồ | phương tiện | bến đò → D |
| `house_town` (mô hình nhà cũ, dự phòng khi `lib_courtyard` không nạp được) | **phải** dùng cùng công thức T1–T4 khi là dự phòng — vỏ `house_town` cũng được khoét (một lần) | luôn |
| `bridge_arch`, `gate_sect`, `palace_grand`, `hall_main` khi là **mô hình dự phòng** trong `firstAvailable` | công thức chỉ gắn với mô hình chính; khi rơi về dự phòng → **tải công thức dự phòng** (khoang thu gọn: 1 khoang + trạm chính) để không bao giờ thành vỏ rỗng | luôn |

---

## 9. Tổng hợp phần này

| Nhóm | Ngày người |
|---|---|
| Cùng Thông (3 trà lâu 11 + thủy tạ 5) | 16 |
| Thư Lâu (21,5 + 9) | 30,5 |
| Phong Thủy Viên (14 + 23) | 37 |
| Lịch Đường (14 + 23) | 37 |
| Lưng Chừng Quán | 12 |
| Cổng tông môn (4 lớn + 3 nhỏ dùng chung công thức) | 16 |
| Cầu Huyền Hà | 3 |
| **Cộng** | **≈ 151,5 ngày người** |
