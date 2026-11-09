# 08-07 · Thật hóa Sơn Môn (1): Chính Đường · Vận Mệnh Các · Thái Tuế Điện · Lầu chuông · Lầu trống

> Spec từng công trình (`INT-*`): số đo vỏ (đo thật, 08-02 §5.2), danh sách khoang, mặt bằng có kích thước, đồ đạc theo mã `MOD-*`, trạm và engine nối tới, NPC và lịch, đèn, âm, cửa, camera, việc thật hóa, điểm test. Tọa độ: **thế giới** (mét, Bắc = −Z) trừ khi ghi «cục bộ». Cao độ y là thế giới.

---

## 1. Bối cảnh Sơn Môn

### 1.1 Sơ đồ sân (theo `court.js`, `sect.js`)

```
 z −66 ══════════════════════╡ HẬU MÔN 20 m ╞══════════════════════   tường Bắc (dày 1,4, cao 6,5)
        [Tháp TB lib_pagoda5]                       [Tháp ĐB lib_pagoda5]
 z −56 ┌──────────────────── nền L1 (cao 2 m, x −36…36, z −56…8) ─────────────────┐
       │        ┌──────────── nền L2 (cao 4 m, x −28…28, z −50…−6) ──────┐        │
[ĐIỆN TÂY]      │            ┌──── CHÍNH ĐƯỜNG palace_grand 44 × 26 ──┐  │   [ĐIỆN ĐÔNG]
 x −47          │            │   x −22…22, z −44,1…−17,9, đáy y 4    │  │    x 47
 z −36  Vận     │            └───────────────────────────────────────┘  │   Thái Tuế
 Mệnh Các       │                    Bệ Thầy (0, 4, −11)                 │   Điện
       │        └──────────────── bậc z −1…−6 (2 → 4 m) ─────────────────┘        │
[LẦU TRỐNG] x −47, z −9                                         [LẦU CHUÔNG] x 47, z −9
       └──────────────────────── bậc z 13…8 (0 → 2 m) ──────────────────────────────┘
  Hợp Hôn (−48, 8)      Khách (−16, 22)        Khách (16, 22)          La Bàn Đài (40, 22)
  Trà Thất (−40, 24)               Đại Đỉnh (0, 27,5)       Khách (26, 30)
  Ống Xăm (−40, 40)  Tàng Y Các (−22, 36)  Lư Hương (0, 34)              Lịch (40, 40)
        Hồ sen Tây (−21, 50)                         Hồ sen Đông «sen» (21, 50)
        [Tháp TN lib_pagoda_red]                     [Tháp ĐN lib_pagoda_red]
 z  66 ══════════════════════╡ SƠN MÔN 30 m ╞══════════════════════   tường Nam   START (3, 43)
```

### 1.2 Danh sách công trình Sơn Môn và nơi spec

| INT | Hạng | Spec |
|---|---|---|
| INT-SM-CHINHDUONG | A | §2 |
| INT-SM-DIENTAY (Vận Mệnh Các) | B | §3 |
| INT-SM-DIENDONG (Thái Tuế Điện) | B | §4 |
| INT-SM-LAUCHUONG | B | §5 |
| INT-SM-LAUTRONG | B | §6 |
| INT-SM-THAP-*, -SONMON, -HAUMON, -TANGY, các trạm sân, nền, tường | B / C / D / E | 08-08 |
| INT-SN-HOPHON (trong sân, cánh Tây) | D | 08-10 §6 |

### 1.3 Người trong Sơn Môn

| Người | Mã | Ở đâu (theo lịch §1.4) | Nguồn |
|---|---|---|---|
| Thầy Tử Bình | `thay_tubinh` | Bệ Thầy (ngày), Tĩnh thất Thầy trong Chính Đường (giờ Tuất) | canon |
| Lão Tùng, người gác cổng | `gac_cong` | phòng gác Tây Sơn Môn | canon |
| Bà Tư, thợ may | `tho_may` | Tàng Y Các | canon |
| Khổng tiên sinh | `khong_tiensinh` | bậc Sơn Môn (ngày) | canon |
| Đạo đồng hương đăng (thắp nến, quét điện) | NPC phụ — tài liệu 06 cấp `NPC-*` | Chính Đường, sân | mới |
| Thủ kinh (giữ Tàng Kinh) | NPC phụ | tầng 2 Chính Đường | mới |
| Thủ các Vận Mệnh Các | NPC phụ | Điện Tây | mới |
| Thủ điện Thái Tuế | NPC phụ | Điện Đông | mới |
| Chung đầu (giữ chuông) | NPC phụ | lầu chuông | mới |
| Cổ đầu (giữ trống) | NPC phụ | lầu trống | mới |
| Khách hành hương (2–4, sinh bằng `npc.js › makeNpc`) | NPC phụ | sân, Lư Hương, điện | mới |

### 1.4 Lịch một ngày của Sơn Môn (giờ can chi, 08-03 §6.3)

| Giờ | Sự kiện | Công trình | Người chơi làm được |
|---|---|---|---|
| Dần (3–5) | đạo đồng dậy quét sân; cổng Sơn Môn mở (`son_mon`) | sân | — |
| **Mão (5–7)** | **chuông sớm** 108 tiếng (chung đầu đánh); mở cửa mọi điện (`dien_chinh`, `dien_phu`); khóa lễ sáng ở Tổ Sư đường (tụng, mõ) | lầu chuông, Chính Đường | đánh chuông cùng (Phúc Khí giờ Mão); dự khóa lễ (ngồi bồ đoàn) |
| Thìn – Tỵ (7–11) | Thầy tiếp khách ở Bệ Thầy; khách hành hương thắp nhang | Bệ Thầy, Lư Hương | mọi trạm sân |
| Ngọ (11–13) | Thầy dùng trà | Trà Thất | ngồi uống trà cùng Thầy (thoại riêng) |
| Mùi – Thân (13–17) | Thầy về bệ; thủ kinh mở Tàng Kinh cho mượn đọc | Bệ, tầng 2 Chính Đường | đọc cổ thư |
| **Dậu (17–19)** | **trống chiều**; khóa lễ chiều; đạo đồng thắp đèn | lầu trống, Chính Đường | đánh trống cùng (Phúc Khí giờ Dậu) |
| Tuất (19–21) | Thầy vào Tĩnh thất trong Chính Đường; tiếp khách khuya | Chính Đường | giải lá số sâu với Thầy (web: Thầy AI) |
| Hợi (21–23) | đóng cửa điện (khóa), ngách mở | mọi điện | đi qua ngách; nhiệm vụ đêm |
| Tý – Sửu (23–3) | tĩnh; chỉ đèn trực; cổng khóa (ngách mở) | | ngắm sao trên lô gia tầng 2 (khi có nhiệm vụ) |

---

## 2. INT-SM-CHINHDUONG — Chính Đường (hạng A)

### 2.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `palace_grand` (công trình trùm: `.hd` / thường / `.lod`) |
| Đặt | `placeModel(root, 'palace_grand', { fit: { width: 44 }, at: { x: 0, y: 4, z: -31, ry: 0 } })` trong `sect.js` |
| Kích thước đặt | 44 × 31,2 × 26,2 m; khung bao x −22…22, z −44,1…−17,9 |
| Lòng đo được (cục bộ → thế giới) | Sảnh lõi x −10…10, z −9,6…0,9 → **thế giới z −40,6…−30,1** (20 × 10,5 m), hành lang cột hai bên x ±(10…19); dải 6,4–9,6 m đặc; tầng trên x −9,5…9,5, z −8,6…4,4 → **thế giới z −39,6…−26,6** (19 × 13 m), vách ngăn ở z ≈ −30,6 |
| Loại vỏ | V2 (08-02 §5.1) |
| Cao độ thiết kế | Tầng 1 sàn y **4,45** (bậc cửa 0,45 trên nền L2), trần y **10,40**; tầng 2 sàn y **13,65**, trần y **16,80** — kiểm lại bằng `bld-void` tia dọc |
| Khoét | 1 cửa giữa 3,2 × 3,75 (mặt Nam, z −30,1); 1 ngách 1,2 × 2,4 tường Tây (x −10, z −32,0); 2 cửa sổ tròn tầng 2 mỗi tường hồi; mở 5 ô cửa sổ lô gia tầng 2 (mặt Nam, z −26,6) |
| Kit | `BAC` (bảng `huyenquan`) + `KT` |

### 2.2 Khoang

| Khoang | Tên | Hộp thế giới (x0…x1 · y0…y1 · z0…z1) | Kích thước | Camera | Âm vang · nền | Đèn tối đa |
|---|---|---|---|---|---|---|
| `cd.l0.chinh` | Tổ Sư đường | −4,8…4,8 · 4,45…10,40 · −40,6…−30,1 | 9,6 × 5,95 × 10,5 | TRONG, `maxDist` 4,6 | `dai_dien` · `tung_xa_mo` | 4 |
| `cd.l0.tay` | Tĩnh thất Thầy | −10…−4,8 · 4,45…10,40 · −40,6…−30,1 | 5,2 × 5,95 × 10,5 | TRONG, `maxDist` 3,0 | `dien_vua` · `nen_lach_tach` | 2 |
| `cd.l0.dong` | Phòng Sổ Môn Phái | 4,8…10 · 4,45…10,40 · −40,6…−30,1 | 5,2 × 5,95 × 10,5 | TRONG, `maxDist` 3,0 | `dien_vua` · `trang_sach` | 2 |
| `cd.l1.kinh` | Tàng Kinh | −9,5…9,5 · 13,65…16,80 · −39,6…−30,6 | 19 × 3,15 × 9 | TRONG, `maxDist` 4,0 | `dien_vua` · `trang_sach` | 3 |
| `cd.l1.loggia` | Lô gia Vọng Môn | −9,5…9,5 · 13,65…16,80 · −30,6…−26,6 | 19 × 3,15 × 4 | BỔ DỌC | `lau_go` · `go_gio` | 2 |

Hành lang cột hai bên (x ±10…±19) và hiên trước (z −30,1…−25) là **ngoài trời có mái** (không là khoang): camera ngoài trời, luật «dưới mái» 08-03 §8.5.

### 2.3 Mặt bằng tầng 1 (y 4,45) — mỗi ô ký tự ≈ 0,8 m

```
 x:  −10        −4,8                    0                    4,8         10
 z −40,6 ┌────────┬──────────────────────────────────────────┬──────────┐
         │▲ thang │      [BAC-27 khám Tổ sư · BAC-29 bệ]     │ thang ▼  │
         │█ LÊN   │     bài vị lịch đại tổ sư (S-KHAM × 9)   │ XUỐNG █  │
         │█ 0,25/ │                                          │      █   │
         │█ 0,25  │          BAC-15 tảo tỉnh (trên đầu)      │      █   │
         │█ ×37   │      [BAC-30 bàn lễ] [BAC-31 hương án]   │      █   │
         │█       │       ○ ○ ○  BAC-35 bồ đoàn × 3          │      █   │
         │█ [án]  │                                          │ [kệ sổ]  │
         │  [ghế] │  ║ BAC-07 cột ║            ║ cột ║       │ [án Sổ]  │
         │ Tĩnh   │                                          │  Phòng   │
         │ thất   │                                          │  Sổ Môn  │
         ├──╴ ╶───┤            [BAC-52 bình phong]           ├───╴ ╶────┤ ← BAC-06 vách cách phiến, ô thông 1,6 m
 ngách ▷ │        │                                          │          │
 z −30,1 └────────┴───────────[ BAC-21 + BAC-20 cửa giữa 3,2 ]┴──────────┘
                    hiên trước có lan can (z −30,1…−25), bậc xuống nền L2 (y 4)
```

| Hạng mục | Vị trí (thế giới) | Mảnh | Ghi chú |
|---|---|---|---|
| Sàn | toàn tầng 1 | BAC-01 × 21 (6 × 3,5 gian, cắt mép) | `floor:da` |
| Tường lót | 4 tường lõi | BAC-03 / BAC-04, cao 5,95 | lùi 0,05 m khỏi mặt trong vỏ |
| Cột trong | x ±2,4, z −37,0 và −33,6 (4 cột) | BAC-07 Ø 0,5 cao 5,95 + BAC-09 | cột `fadeable` |
| Vách ngăn | x ±4,8, z −40,6…−31,7 | BAC-06 × 3 mỗi bên; chừa ô thông 1,6 m ở z −31,7…−30,1 | ô thông = cửa nhìn `open` |
| Khám Tổ sư | (0, 4,45, −39,4) | BAC-27 + BAC-29 (co ngang 6,4) | tượng tổ sư hư cấu `deity_tosu` (08-02 §10) trên `S-BAN` |
| Bài vị lịch đại | khám, 9 ô | BAC-28 × 9 nhỏ trong BAC-27 | bài vị chữ canvas (tên tổ sư hư cấu, tài liệu 02 cấp) |
| Tảo tỉnh | trần trên khám, tâm (0, 10,4, −37,5) | BAC-15 | |
| Trần | còn lại | BAC-14 | |
| Xà | mỗi 3,2 m theo z | BAC-12, BAC-13 | |
| Bàn lễ + hương án | (0, 4,45, −35,4) | BAC-30 + BAC-31 + BAC-32 + BAC-33 × 2 + BAC-34 | |
| Bồ đoàn | z −33,6, x −1,6 / 0 / 1,6 | BAC-35 × 3 | ngồi dự khóa lễ |
| Khánh | (3,4, 4,45, −35,0) | BAC-37 | chủ lễ gõ khi khai kinh |
| Bình phong | (0, 4,45, −31,4) | BAC-52 | chắn thẳng cửa — người vào đi vòng hai bên (đúng lệ) |
| Phướn | trước 4 cột | BAC-45 × 4 | |
| Đèn treo | lối giữa, z −36,5 / −32,5, x ±1,6 | BAC-48 × 4 | |
| Hoành phi | trên khám | BAC-46 | chữ «玄館» (khớp `TEXT.han`) |
| Câu đối | 2 cột giữa | BAC-47 × 2 | |
| **Tĩnh thất Thầy** | x −10…−4,8 | BAC-42 án thư (−7,4, −35,6) + BAC-43 ghế + BAC-49 đèn + BAC-35 bồ đoàn khách + BAC-40 kệ (tường Tây) | Thầy ngồi giờ Tuất |
| Thang Tây (lên) | x −9,4…−8,0, chân z −40,0 → đỉnh z −30,75 | KT-15 × 2 nối (37 bậc 0,25 / 0,25), tay vịn | lên `cd.l1.kinh` |
| **Phòng Sổ Môn Phái** | x 4,8…10 | BAC-40 kệ sổ × 2 + BAC-42 án đặt **Sổ Môn Phái** + BAC-41 rương | |
| Thang Đông (xuống) | x 8,0…9,4, đối xứng | KT-15 × 2 | xuống từ tầng 2 |
| Ngách | tường Tây, tâm (−10, —, −32,0) | BAC-22 + BAC-23 | `luon_mo` |

### 2.4 Mặt bằng tầng 2 (y 13,65)

```
 x:  −9,5                              0                               9,5
 z −39,6 ┌───────────────────────────────────────────────────────────────┐
         │ [NHO-17 kệ tre × 5 dọc tường Bắc ───────────────────────────] │
         │                                                               │
         │ ◯ BAC-24 cửa sổ tròn (tường hồi Tây)    (tường hồi Đông) ◯     │
         │        [NHO-46 bàn đọc đứng]     [NHO-45 kệ xoay 8 mặt]       │
         │  [NHO-13 ×4 án thấp + NHO-16 chiếu]   [BAC-42 bàn chép kinh]  │
         │  ▲ miệng thang Tây (lan can KT-20)    miệng thang Đông ▼      │
 z −30,6 ├──────────╴      ╶───── BAC-06 vách, ô cửa 2,4 ──╴      ╶──────┤
         │  Lô gia Vọng Môn: BAC-50 lan can mặt Nam, 5 ô cửa sổ BAC-25    │
 z −26,6 └───────────────────────────────────────────────────────────────┘
                     (nhìn xuống Bệ Thầy, Đại Đỉnh, Sơn Môn)
```

| Hạng mục | Vị trí | Mảnh | Ghi chú |
|---|---|---|---|
| Sàn | toàn tầng 2 | BAC-02 | `floor:go` |
| Lỗ thang | x −9,4…−8,0 và 8,0…9,4, z −33,2…−30,75 | lỗ sàn + KT-20 lan can miệng thang | 08-04 §2.3 |
| Kệ kinh | tường Bắc z −39,4 | NHO-17 × 5 (16 m) | `book` → `library-data › LIBRARY` |
| Kệ xoay | (3,2, 13,65, −35,2) | NHO-45 | quay xem các «tầng» (`library-data › LAYERS`) |
| Bàn đọc đứng | (−3,2, 13,65, −35,2) | NHO-46 | |
| Góc học | x −8…−4, z −33 | NHO-13 × 4 + NHO-16 | |
| Bàn chép kinh | (6,0, 13,65, −33,0) | BAC-42 + NHO-20 | |
| Trần | | BAC-16 vì kèo hở (mái trên đầu) | thông thủy 3,15 m tới đáy xà |
| Lô gia | z −30,6…−26,6 | BAC-50 lan can, BAC-25 × 5 cửa sổ, BAC-35 × 2 | điểm ngắm |

### 2.5 Trạm

| Id trạm | Khoang | Tên · động từ | Nối | Thưởng ngày |
|---|---|---|---|---|
| `cd_tosu` | `cd.l0.chinh` | Bài Vị Tổ Sư · «Dâng hương tổ sư» | ghi một dòng công «kính tổ» vào Sổ Công Quá: `remedy-fate › CONG_QUA` / `meritLedger` | `grantDaily(s, 'cd_tosu')` |
| `cd_khoale` | `cd.l0.chinh` | Khóa lễ · «Ngồi dự khóa lễ» (chỉ giờ Mão, Dậu) | tĩnh tọa theo nhịp tụng; nội dung tụng từ `remedy-fate › DAO_JIA` (清靜經) | `grantDaily(s, 'cd_khoale')` |
| `cd_somonphai` | `cd.l0.dong` | Sổ Môn Phái · «Xem / ghi tên vào sổ» | nhiệm vụ nhập môn `MQ-P-*` (tài liệu 03); trang người chơi hiện **Mệnh Bàn** (tài liệu 04: `synthesis`, `wx`, `strength`) | — |
| `cd_thaydem` | `cd.l0.tay` | Thầy Tử Bình (đêm) · «Thưa chuyện với Thầy» | web: Thầy AI (`master-ui.js`, `ai.js`); iOS: Thầy giảng bài học theo lá số mẫu (`FEATURES.ai = false`) | — |
| `cd_kinh` | `cd.l1.kinh` | Tàng Kinh · «Mượn cổ thư» | `library-data › LIBRARY`, `LAYERS`, `countByLayer` | `grantDaily(s, 'cd_kinh')` |
| `cd_chepkinh` | `cd.l1.kinh` | Bàn chép kinh · «Chép một đoạn Tích Thiện Thiên» | `kb.js › JISHAN_PIAN` (việc ngày `DQ-*`) | `grantDaily(s, 'cd_chepkinh')` |
| `cd_vongmon` | `cd.l1.loggia` | Lô gia Vọng Môn · «Ngắm toàn sân» | điểm ngắm; ban đêm có nhiệm vụ ngắm sao (`ershibaxiu.js`, 28 tú — tài liệu 09 cấp `ACT-*`) | — |

Đủ yêu cầu A (≥ 3 trạm nối engine / nhiệm vụ).

### 2.6 NPC và lịch

| NPC | Giờ | Chỗ (neo) | Việc |
|---|---|---|---|
| `thay_tubinh` | Mão – Tỵ, Mùi – Thân | Bệ Thầy ngoài trời (giữ như hiện nay) | tiếp khách ban ngày |
| | Ngọ | Trà Thất | dùng trà |
| | **Tuất** | `cd.l0.tay` `SE__thay_ghe` | tiếp khách đêm (`cd_thaydem`) |
| | Hợi – Dần | rời cảnh | |
| Đạo đồng hương đăng | Mão, Dậu | `cd.l0.chinh` (thay nến bàn lễ, hoạt cảnh 20 s) rồi Chính Đường → sân | thắp đèn, quét |
| Thủ kinh | Thìn – Thân | `cd.l1.kinh` `SE__thukinh` (BAC-43) | cho mượn sách; ngoài giờ Tàng Kinh vẫn vào được, sách vẫn đọc được |
| Khách hành hương | Thìn – Thân | sân → `cd.l0.chinh` (đứng trước bàn lễ 30 s) | khí sống |

### 2.7 Đèn

| Đèn | Vị trí | `kind` | Lịch |
|---|---|---|---|
| 2 nến bàn lễ | (±1,6, 5,7, −35,4) | `nen` | luôn |
| 4 đèn lồng lối giữa | (±1,6, 8,6, −36,5 / −32,5) | `denlong` | Dậu → Dần |
| Ánh trời cửa giữa | (0, 7,5, −31,6) | `troi` | ngày, theo độ mở cửa |
| Đèn Tĩnh thất | (−7,4, 5,6, −35,6) | `dendau` | Tuất – Hợi (khi Thầy ở) |
| Đèn Phòng Sổ | (7,4, 5,6, −35,6) | `dendau` | Thìn → Tuất |
| Tàng Kinh | 3 × NHO-47 | `dendau` | Mão → Hợi |
| Lô gia | 2 đèn lồng hiên | `denlong` | Dậu → Dần |

### 2.8 Cửa

| Cửa | Loại | Ô | Lịch | Ghi chú |
|---|---|---|---|---|
| `cd.d.giua` | `canh2` (BAC-20) | 3,2 × 3,75, z −30,1 | `dien_chinh` | |
| `cd.d.ngach` | `canh1` (BAC-22) | 1,2 × 2,4, x −10 | `luon_mo` | lối đêm vào Tĩnh thất Thầy qua hành lang cột Tây |
| Ô thông vách (×2) | `open` | 1,6 × 3,2 | — | |
| Cửa lô gia (×1) | `open` | 2,4 × 2,8 trong vách z −30,6 | — | |

### 2.9 Việc thật hóa

| # | Việc | Ước lượng |
|---|---|---|
| 1 | `bld-void` chính thức; chốt `levels` | 0,5 ngày |
| 2 | Khoét cửa giữa + ngách + cửa sổ (Blender, 08-02 §5.3) | 1,5 ngày |
| 3 | Tách nhóm vỏ `roof_L0`, `roof_L1`, `upper_L1`, `front` | 0,5 ngày |
| 4 | Công thức `src/game/int/sm-chinhduong.js`: khoang, cửa nhìn, cửa, thang, mảnh | 2 ngày |
| 5 | Đạo cụ anh hùng: tượng tổ sư, khánh | (credit Meshy) + 1 ngày duyệt |
| 6 | Trạm + nối engine (7 trạm) | 2 ngày |
| 7 | Lịch NPC (Thầy đêm, đạo đồng, thủ kinh) | 1,5 ngày |
| 8 | Nướng va chạm 2 tầng; test | 1 ngày |
| 9 | Duyệt art + ảnh nghiệm thu | 0,5 ngày |
| | **Cộng** | **≈ 10,5 ngày người** |

### 2.10 Điểm test (08-12)

- Từ `START` tới `door:out` cửa giữa → vào `cd.l0.chinh` → `cd_tosu` → lên thang Tây → `cd_kinh` → xuống thang Đông → ra ngách → về Bệ Thầy: không ô chặn, `lv` đổi đúng ở `switchY` 9,0.
- 0 giờ (giờ Tý): cửa giữa `KHOA`; đường tới `cd_thaydem` đi qua ngách vẫn có.
- `platformTop(0, −35, 0) = 4,45`; `platformTop(0, −35, 1) = 13,65`; đứng tầng 1 dưới lô gia không bị đặt lên 13,65.

---

## 3. INT-SM-DIENTAY — Vận Mệnh Các (hạng B)

### 3.1 Vỏ và hệ tọa độ

| Thông số | Giá trị |
|---|---|
| Mô hình | `hall_main` (vỏ dùng chung, khoét một lần: `bld/_shared/hall_main-cut`) |
| Đặt | `fit: { width: 22 }, at: { x: −47, y: 0, z: −36, ry: +π/2 }` (mặt tiền quay về trục, hướng Đông) |
| Đổi cục bộ → thế giới | **x_tg = −47 + z_cb, z_tg = −36 − x_cb** (cục bộ: +Z = mặt tiền, +X = phía Bắc thế giới) |
| Lòng đo được | sảnh x_cb −9…9, z_cb −6,1…1,4 (18 × 7,5 m) → **thế giới x −53,1…−45,6, z −45…−27**; hiên z_cb 1,4…4,5 → x −45,6…−42,5; gác x_cb −7,5…7,5, z_cb −4,6…3,4 (15 × 8 m) ở dải 10–12 m |
| Cao độ thiết kế | sảnh sàn y **0,60**, trần y **6,60**; gác sàn y **10,0**, trần y **12,6** |
| Thay cho | `world.js › ROOMS › vanmenh` (origin (1900, 0), 20 × 72 m, 9 cổng thẳng hàng cách 6 m) |

Phòng cũ dài 72 m; vỏ thật chỉ 18 × 7,5 m. Chín cổng xếp thẳng không vừa → **thiết kế lại thành «Vòng Đời»**: lối đi vòng quanh một bức bình phong giữa, chín cổng nối nhau, kết thúc lại đúng nơi bắt đầu, trước bàn lễ chữ 命. Ý: một đời người đi một vòng rồi trở về bản mệnh.

### 3.2 Khoang

| Khoang | Tên | Hộp cục bộ (x · y · z) | Kích thước | Camera | Âm |
|---|---|---|---|---|---|
| `vm.l0.vong` | Lối Vòng Đời | −9…5,8 · 0,6…6,6 · −6,1…1,4 | 14,8 × 6 × 7,5 | TRONG, `maxDist` 3,2 (lối hẹp) | `dien_vua` · `nen_lach_tach` |
| `vm.l0.thang` | Gian thang | 5,8…9 · 0,6…6,6 · −6,1…1,4 | 3,2 × 6 × 7,5 | BỔ DỌC | `dien_vua` |
| `vm.l1.luunien` | Gác Lưu Niên | −7,5…7,5 · 10,0…12,6 · −4,6…3,4 | 15 × 2,6 × 8 | BỔ DỌC | `lau_go` · `go_gio` |

Hiên (z_cb 1,4…4,5) ngoài trời có mái: đặt **bia tổng quan**.

### 3.3 Mặt bằng sảnh (cục bộ; mũi tên là chiều đi) — ô ký tự ≈ 0,6 m

```
            Nam thế giới ◀──────────────── x_cb ────────────────▶ Bắc thế giới
 x_cb:   −9          −6        −3         0          3        5,8        9
 z −6,1  ┌────────────────────────────────────────────────────┬──────────┐
         │ ↑ ③  ──▶ ④ ────────▶ ⑤ ────────▶ ⑥ ─────────▶ ⑦ ↓ │ thang U   │
 (lối    │ │   (lối sau, rộng 3,1 m)                         │ │ ▲ 0,25/  │
  sau)   │ │                                                  │ │ █ 0,25   │
 z −3,0  │ │  ┌──────────────────────────────────────────┐   │ │ █ 2 đợt  │
         │ │  │  BÌNH PHONG MỆNH (MOD-BAC-52 × 3 nối)    │   │ │ █ + chiếu│
         │ │  │  dài 8,8 × dày 1,4 · mặt trước: bàn lễ 命 │   │ │ █ nghỉ  │
 z −1,6  │ │  └────────────────[ 命 ]───────────────────┘   │ ↓ █       │
         │ ② ◀──── ① ◀──── VÀO ────▶ ⑨ ──▶ ⑧ ──────────────┘   (lên gác)│
 (lối    │      (lối trước, rộng 3,0 m)          (về lại 命)              │
  trước) │                                                                │
 z  1,4  └──────────────────────[ cửa 2,4 × 3,2 ]─────────────────────────┘
                     hiên: [BIA TỔNG QUAN] (x_cb −3, z_cb 3,0)
```

Chiều đi: VÀO ở x_cb 0 → rẽ trái (Nam thế giới) qua ① ② → góc Nam ③ → lối sau đi về Bắc qua ④ ⑤ ⑥ → góc Bắc ⑦ → lối trước đi về Nam qua ⑧ ⑨ → dừng trước **bàn lễ 命** ở x_cb 0 (đúng chỗ đã vào).

### 3.4 Vị trí chín cổng (thay `VAN_GATE_Z`)

`world.js › VAN_GATE_Z(i) = 25 − i·6` bị thay bằng bảng vị trí (cục bộ, hướng cổng = hướng người đi qua):

| Cổng (`van${i}`) | Thập kỷ | x_cb | z_cb | Hướng đi qua | Ghi chú |
|---|---|---|---|---|---|
| `van0` ① | 1 | −2,2 | −0,1 | → Nam | đầu lối trước |
| `van1` ② | 2 | −5,6 | −0,1 | → Nam | |
| `van2` ③ | 3 | −7,6 | −2,3 | → Bắc thế giới, rẽ góc | cổng xoay 90°, đặt giữa góc |
| `van3` ④ | 4 | −4,6 | −4,6 | → Bắc | lối sau |
| `van4` ⑤ | 5 | −1,0 | −4,6 | → Bắc | giữa đời, sau lưng bàn 命 |
| `van5` ⑥ | 6 | 2,6 | −4,6 | → Bắc | |
| `van6` ⑦ | 7 | 4,6 | −2,3 | → Nam, rẽ góc | |
| `van7` ⑧ | 8 | 3,6 | −0,1 | → Nam | lối trước nửa Bắc |
| `van8` ⑨ | 9 | 1,6 | −0,1 | → Nam | cổng cuối, ngay trước bàn 命 |

Khoảng cách theo lối đi giữa hai cổng liên tiếp: 3,4–4,2 m (đi bộ 2–3 s mỗi thập kỷ). Cổng thu nhỏ so với phòng cũ: trụ cách 2,6 m (thay 5,8), cao xà 4,2 m (thay 5,0), biển can chi 1,8 × 0,9 (thay 2,4 × 1,2); mái cổng `models.js › roof(5.4, 1.2, 0.6)`. Mã dựng giữ ở `interior.js › buildVanMenh` (đổi vòng lặp sang bảng trên), hook `HOOKS.van` giữ nguyên (đổ dữ liệu `vanmenh.js › vanMenh(R)`).

### 3.5 Đồ đạc

| Hạng mục | Vị trí cục bộ | Mảnh |
|---|---|---|
| Sàn | toàn sảnh | BAC-01; lối đi đá sáng (`stoneTex` seed 52 như hiện có) chạy theo vòng, rộng 2,0 m |
| Bình phong Mệnh | x_cb −5,8…3,0, z_cb −3,0…−1,6 | BAC-52 × 3 nối, mặt sau treo 9 tấm «tóm tắt thập kỷ» (canvas) |
| Bàn lễ 命 | (0, 0,6, −1,3), áp mặt trước bình phong | BAC-30 + chữ 命 canvas 1,6 × 1,6 trên bình phong (thay tấm 3 × 3 của phòng cũ) + BAC-33 × 2 |
| 9 cổng | §3.4 | thủ tục (`interior.js`), trụ BAC-07 mảnh Ø 0,3 |
| Đèn cổng | mỗi cổng 2 cầu đèn | như hiện có; màu theo vận (`TONE_COL`) |
| Bia tổng quan | hiên (−3, 0,6, 3,0) quay +z | BAC-53 (khung bia rùa) + canvas `drawStele` hiện có |
| Thang | gian thang | KT-15 × 2 (U), KT-16 chiếu nghỉ, lên gác |
| Gác Lưu Niên | tầng 1 (y 10) | BAC-02 sàn, BAC-24 cửa sổ tròn × 10 dọc hai mặt (5 + 5), BAC-50 lan can miệng thang, BAC-42 án đọc giữa |

### 3.6 Trạm

| Id | Khoang | Tên | Nối | Ghi chú |
|---|---|---|---|---|
| `vanbia` | hiên (ngoài trời) | Bia Vận Mệnh | `vanmenh.js › vanMenh` (foundation) | giữ id; vị trí mới |
| `van0`…`van8` | `vm.l0.vong` | Cổng Đại Vận 1–9 | `vanmenh.js` (`gates[i]`) | giữ id, `slot` |
| `vm_menh` | `vm.l0.vong` | Bàn Lễ Bản Mệnh · «Xem Mệnh Đồ» | `gaimenh › gaimenhPlan` (6 tầng Mệnh Đồ — tài liệu 05) | **mới** |
| `vm_luunien` | `vm.l1.luunien` | Cửa Sổ Lưu Niên · «Mười năm của thập kỷ này» | `dayun-active › getActiveDayun` + `liunian-pro › analyzeLiunianDeep` (10 năm của đại vận đang đi; mỗi cửa sổ một năm, cửa sổ năm nay sáng) | **mới (chưa có — cần làm)** |

### 3.7 Người, đèn, âm, cửa

- **Thủ các** (NPC phụ): giờ Thìn – Thân đứng hiên cạnh bia; giới thiệu «đi một vòng là đi một đời, cổng nào sáng là thập kỷ đang đi». Ngoài giờ: vắng, trạm vẫn dùng được.
- **Đèn**: 18 cầu đèn cổng (đèn khai báo 9, mỗi cổng 1 `denlong` — pool chỉ bật 3 đèn gần nhất), 2 `nen` bàn 命, 1 `troi` cửa, gác 2 `dendau`.
- **Âm**: `nen_lach_tach`; bước qua cổng thập kỷ đang đi → chuông nhỏ `bell(523, 0.08)`.
- **Cửa**: `vm.d.chinh` `canh2` 2,4 × 3,2 lịch `dien_phu`; không cần ngách (không phải lối nối vùng).

### 3.8 Công năng thay thế iOS

`features.js` tắt `vanbia`, `van0…8` và cửa điện trên iOS. Luật số 1 vẫn giữ → trên iOS Điện Tây là **Tàng Thư Các**: chín «cổng» thành chín **kệ sách** theo tầng `library-data › LAYERS` (đọc cổ thư — học, không xem vận bản thân); bàn 命 thành **Án Đọc** (`library-data › LIBRARY` ngẫu nhiên theo ngày); gác thành phòng đọc. Cùng khoang, cùng cửa, khác đồ đặt (`ios` trong công thức).

### 3.9 Việc thật hóa

| # | Việc | Ước lượng |
|---|---|---|
| 1 | Khoét `hall_main` dùng chung: cửa giữa 2,4 × 3,2 mặt tiền + 2 cửa sổ gác mỗi tường hồi | 1,5 ngày (một lần cho 9 nơi) |
| 2 | `bld-void` + chốt cao độ sảnh / gác | 0,5 ngày |
| 3 | Viết lại `buildVanMenh` theo bảng §3.4 (cổng nhỏ, góc xoay) | 1,5 ngày |
| 4 | Công thức `sm-dientay.js` + thang + gác | 1,5 ngày |
| 5 | Trạm mới `vm_menh`, `vm_luunien` (UI + engine) | 3 ngày |
| 6 | Bản iOS (đặt đồ thay thế) | 1 ngày |
| 7 | Gỡ `ROOMS › vanmenh`, chuyển lưu cũ (08-04 §5.2), test | 1 ngày |
| | **Cộng** | **≈ 10 ngày** |

---

## 4. INT-SM-DIENDONG — Thái Tuế Điện (hạng B)

### 4.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `hall_main` (vỏ dùng chung đã khoét) |
| Đặt | `fit: { width: 22 }, at: { x: 47, y: 0, z: −36, ry: −π/2 }` (mặt tiền hướng Tây, về trục) |
| Đổi cục bộ → thế giới | **x_tg = 47 − z_cb, z_tg = −36 + x_cb** |
| Lòng | sảnh 18 × 7,5 (thế giới x 45,6…53,1, z −45…−27); gác 15 × 8 |
| Cao độ | sảnh 0,60 / 6,60; gác 10,0 / 12,6 |
| Thay cho | `ROOMS › thaitue` (origin (2000, 0), 28 × 24 m) — đồng thời hết lỗi `WORLD_TILES.maxX` (08-04 §5.2) |

### 4.2 Khoang

| Khoang | Tên | Hộp cục bộ | Camera | Âm |
|---|---|---|---|---|
| `tt.l0.dien` | Chính điện Thái Tuế | −9…5,8 · 0,6…6,6 · −6,1…1,4 | TRONG, `maxDist` 3,5 | `dien_vua` · `tung_xa_mo` (nhỏ) |
| `tt.l0.thang` | Gian thang | 5,8…9 · 0,6…6,6 · −6,1…1,4 | BỔ DỌC | `dien_vua` |
| `tt.l1.nienbieu` | Gác Niên Biểu | −7,5…7,5 · 10,0…12,6 · −4,6…3,4 | BỔ DỌC | `lau_go` |

### 4.3 Mặt bằng chính điện (cục bộ)

```
 x_cb:  −9                  −1,6     0     1,6                   5,8      9
 z −6,1 ┌──────────────────────────────────────────────────────────┬──────┐
        │ ▓▓ BẬC KHÁM 3 TẦNG — 42 bài vị (14 × 3) tường sau ▓▓▓▓▓ │ thang│
        │ ▓                  ┌───────────────┐                  ▓ │  U   │
        │ ▓ 9 bài vị         │ BÀI VỊ TRỊ    │       9 bài vị   ▓ │      │
        │ ▓ (3 × 3) tường    │ NIÊN (BAC-28  │       (3 × 3)    ▓ │      │
        │ ▓ hồi Nam          │ lớn) trên bệ  │       tường hồi  ▓ │      │
 z −3,4 │                    └─[BAC-29 bệ]──┘        (vách thang)│      │
        │              [BAC-30 bàn lễ · 9 đèn dầu an Thái Tuế]     │      │
        │                  ○  ○  ○  bồ đoàn                        │      │
        │                                                          │      │
 z  1,4 └─────────────────────[ cửa 2,4 × 3,2 ]────────────────────┴──────┘
```

| Hạng mục | Vị trí cục bộ | Mảnh / mã | Ghi chú |
|---|---|---|---|
| Bậc khám 60 bài vị | tường sau z_cb −6,0 (42 tấm: 14 cột × 3 tầng, rộng 12,6 m) + tường hồi Nam x_cb −8,9 (9 tấm: 3 × 3) + vách gian thang x_cb 5,7 (9 tấm) | bậc gỗ ba cấp y 1,6 / 3,2 / 4,8; mỗi bài vị 0,7 × 1,4 | **một lưới gộp** 60 tấm, UV lấy từng ô của atlas `buildThaiTue › drawWall` hiện có (12 × 5 ô 96 × 192 px) — 1 draw call |
| Bài vị trị niên | (0, 0,6 + 1,35, −4,8) | BAC-29 bệ (co 4,8) + bài vị lớn 1,5 × 3,75 (giữ `drawTablet`) + mái nhỏ `roof(2.2, 0.9, 0.5)` | |
| Bàn lễ | (0, 0,6, −2,2) | BAC-30 + BAC-32 lư + 9 chén đèn dầu (giữ hoạt cảnh thắp từ giữa ra) | trạm `thaitue` |
| Bồ đoàn | z_cb −0,6, x_cb −1,6 / 0 / 1,6 | BAC-35 × 3 | |
| Trần | | BAC-14 | |
| Phướn | | BAC-45 × 4 | |

### 4.4 Gác Niên Biểu (y 10)

12 ô cửa sổ (6 mỗi mặt dài) — mỗi ô một năm tới (12 năm, 12 chi): tấm canvas sau ô ghi năm can chi, tên Thái Tuế năm đó (`TAISUI_60`), quan hệ với tuổi người chơi (trị / xung / hình / hại / phá — `taisui › personalTaSui`) và **phương Thái Tuế** năm đó (`taisui › taSuiDirection`) với lời nhắc phong thủy «năm này tránh động thổ hướng …». Ô năm nay sáng.

### 4.5 Trạm

| Id | Khoang | Tên | Nối | Ghi chú |
|---|---|---|---|---|
| `thaitue` | `tt.l0.dien` | Bàn Lễ Thái Tuế · «Xem Thái Tuế năm nay» | `thaitue.js › thaiTue` (đang có) | giữ id, giữ hook `HOOKS.thaitue` |
| `tt_vach` | `tt.l0.dien` | Vách Lục Thập Hoa Giáp · «Tìm Thái Tuế năm sinh» | `TAISUI_60` (đang dùng) — chạm một bài vị → tên tướng, năm | **mới** (nhỏ) |
| `tt_nienbieu` | `tt.l1.nienbieu` | Niên Biểu · «Mười hai năm tới» | `taisui › personalTaSui`, `taSuiDirection` | **mới** |

### 4.6 Người, đèn, âm, cửa

- **Thủ điện** (NPC phụ): giờ Mão – Dậu trong điện; châm dầu các chén đèn người chơi đã thắp (hoạt cảnh, không phải bán dịch vụ — luật «không bán cải mệnh», trụ cột T6).
- **Đèn**: 9 chén đèn dầu (một đèn khai báo, công suất theo số chén sáng — như `lampLight` hiện có), 2 `nen`, 1 `troi`; gác 2 `dendau`.
- **Âm**: tụng nhỏ giờ Mão / Dậu.
- **Cửa**: `canh2` lịch `dien_phu`.

### 4.7 Công năng thay thế iOS

Điện Đông trên iOS là **Trai Đường** (nhà ăn chay): bàn dài thay bàn lễ, bữa chay giờ Ngọ theo **tiết khí hiện tại** (`seasonal-advice` — lời khuyên theo mùa, không phải theo lá số cá nhân); vách 60 bài vị thay bằng **vách 24 tiết khí** (`month-calendar › monthCalendar`); gác là kho lương.

### 4.8 Việc thật hóa

| # | Việc | Ước lượng |
|---|---|---|
| 1 | Công thức `sm-diendong.js` (dùng vỏ đã khoét ở §3.9) | 1,5 ngày |
| 2 | Viết lại `buildThaiTue`: 60 bài vị trên bậc khám 3 tường (UV atlas), bài vị lớn, đèn | 2 ngày |
| 3 | Trạm `tt_vach`, `tt_nienbieu` | 2 ngày |
| 4 | Bản iOS Trai Đường | 1,5 ngày |
| 5 | Gỡ `ROOMS › thaitue`, chuyển lưu, test | 1 ngày |
| | **Cộng** | **≈ 8 ngày** |

---

## 5. INT-SM-LAUCHUONG — Lầu chuông (hạng B)

### 5.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_pavilion2` (thư viện CC0, 3 bản hd / thường / lod) |
| Đặt | `fit: { width: 12 }, at: { x: 47, y: 0, z: −9, ry: −π/2 }` (mặt tiền hướng Tây) |
| Đổi cục bộ → thế giới | x_tg = 47 − z_cb, z_tg = −9 + x_cb |
| Kích thước | 12 × 13,4 × 13,3 |
| Lòng | trệt 6 × 6 (cục bộ −3…3); lầu: hành lang có lan can 8 × 8 ở dải 3,6–5,2, phòng lầu 5 × 5 ở 5,2–6,8 |
| Cao độ | trệt sàn 0,40, trần 3,60; lầu sàn **4,00**, đỉnh phòng lầu ~7,6 |
| Vì sao Đông | lệ «Đông chung Tây cổ» (lầu chuông bên tả — phía Đông khi điện chính nhìn về Nam) |

### 5.2 Khoang

| Khoang | Tên | Hộp cục bộ | Camera | Âm |
|---|---|---|---|---|
| `lc.l0.phong` | Phòng giữ chuông | −3…3 · 0,4…3,6 · −3…3 | BỔ DỌC | `lau_go` |
| `lc.l1.chuong` | Phòng chuông | −2,5…2,5 · 4,0…7,6 · −2,5…2,5 | BỔ DỌC | `lau_go` · `go_gio` |
| `lc.l1.hien` | Hành lang lầu | vành −4…4 trừ phòng chuông | — (ngoài trời có mái) | gió |

### 5.3 Mặt bằng

```
 TRỆT (y 0,4) — cục bộ                 LẦU (y 4,0)
 ┌──────────── 6,0 ───────────┐        ┌──────────────── 8,0 (lan can BAC-50) ───────────┐
 │ █ thang KT-15 (16 bậc       │        │   hành lang lầu (ngoài, có mái)                 │
 │ █ 0,25/0,25, dọc tường Bắc) │        │   ┌──────────── 5,0 ────────────┐               │
 │ █                           │        │   │  KHUNG TREO (BAC-16 rút gọn)│               │
 │ [Bảng giờ hoàng đạo]  [giá] │        │   │      ◉ CHUÔNG ĐỒNG 1,6 m    │  ← chày gỗ   │
 │ [án sổ chuông] [ghế]  [chày]│        │   │  (prop_bell_bronze)         │    treo xích │
 │                             │        │   │  miệng thang ▲ (KT-20)      │               │
 └──────[ cửa 1,8 × 2,6 ]──────┘        │   └────[ ô cửa 1,6 ]────────────┘               │
                                        └─────────────────────────────────────────────────┘
```

| Hạng mục | Vị trí | Mảnh |
|---|---|---|
| Thang | trệt dọc tường Bắc cục bộ (x_cb 2,2…3), từ z_cb 2,6 lên tới −1,4 | KT-15 (16 bậc cao 0,225, sâu 0,25 = 3,6 m) |
| Bảng giờ hoàng đạo | tường Tây trệt | MOD-BAC-46 khung + canvas 12 giờ |
| Án sổ chuông | trệt | BAC-42 + BAC-43 |
| Giá chày dự phòng | trệt | GNA-23 biến thể (giá gỗ) |
| Khung treo chuông | lầu, tâm | BAC-16 rút gọn 3,2 nhịp |
| Chuông | lầu, tâm, đáy chuông y 4,9 | `prop_bell_bronze` (08-02 §10) — `fadeable` |
| Chày gỗ treo xích | cạnh chuông | đạo cụ `PR__chay` hoạt cảnh lắc khi đánh |
| Lan can lầu | 4 mặt | BAC-50 |

### 5.4 Trạm

| Id | Khoang | Tên | Nối | Thưởng |
|---|---|---|---|---|
| `lc_danh` | `lc.l1.chuong` | Chuông Sớm · «Đánh chuông» | đồng bộ máy chủ `ix` `sm.chuong` (08-04 §5.4); lúc nào cũng đánh được (giới hạn 10 s / người); **giờ Mão**: tính vào khóa chuông sớm | `grantDaily(s, 'lc_danh')` chỉ khi giờ Mão |
| `lc_hoangdao` | `lc.l0.phong` | Bảng Giờ Hoàng Đạo · «Xem giờ tốt hôm nay» | `huangdao › huangdao12` | `grantDaily(s, 'lc_hoangdao')` |
| `lc_so` | `lc.l0.phong` | Sổ Chuông · «Xem số tiếng chuông của phòng» | bộ đếm `n` từ máy chủ (`props['sm.chuong']`) | — |

Hoạt cảnh khóa chuông sớm: chung đầu đánh theo nhịp «18 nhanh – 18 chậm – 18 vừa», lặp hai lần (108 tiếng, ~6 phút). Người chơi đánh trong lúc này: tiếng chuông của họ hòa vào (không phá nhịp NPC). Mini-game nhịp (nếu có) do tài liệu 09 cấp `MG-*`.

### 5.5 Người, đèn, âm, cửa

- **Chung đầu** (NPC phụ): Dần → Mão ở lầu (đánh khóa sớm); Thìn – Thân ở phòng trệt (ghi sổ); ngoài giờ vắng.
- **Đèn**: lầu 1 `denlong` treo hiên; trệt 1 `dendau`; 2 `troi` (cửa trệt, ô cửa lầu).
- **Âm**: chuông theo 08-04 §4.7 (nghe toàn Sơn Môn và Huyền Thành); gió `go_gio` trên lầu.
- **Cửa**: trệt `canh2` 1,8 × 2,6 lịch `dien_phu`; ô cửa phòng chuông `open`.

### 5.6 Việc thật hóa

| # | Việc | Ước lượng |
|---|---|---|
| 1 | Khoét `lib_pavilion2` (dùng chung cho lầu trống + Du Phương Lâu ở tỉ lệ khác): cửa trệt, ô cửa phòng lầu | 1,5 ngày |
| 2 | Công thức + thang + lầu | 1,5 ngày |
| 3 | Chuông Meshy + hoạt cảnh chày | (credit) + 1 ngày |
| 4 | Gói `ix` máy chủ + khách (dùng chung với lầu trống) | 2 ngày |
| 5 | Khóa chuông sớm (NPC, nhịp) | 1,5 ngày |
| | **Cộng** | **≈ 7,5 ngày** |

---

## 6. INT-SM-LAUTRONG — Lầu trống (hạng B)

Đối xứng lầu chuông qua trục; chỉ ghi phần khác.

| Thông số | Giá trị |
|---|---|
| Đặt | `fit: { width: 12 }, at: { x: −47, y: 0, z: −9, ry: +π/2 }` (mặt tiền hướng Đông) |
| Đổi cục bộ → thế giới | x_tg = −47 + z_cb, z_tg = −9 − x_cb |
| Khoang | `lt.l0.phong` (Phòng giữ trống), `lt.l1.trong` (Phòng trống), `lt.l1.hien` |

| Hạng mục | Khác lầu chuông |
|---|---|
| Đạo cụ chính | `prop_drum_great` trống lớn trên giá sơn son, mặt trống quay ra ô cửa; đôi dùi đặt giá |
| Bảng ở trệt | **Bảng 24 Tiết Khí** — tiết khí hiện tại và kế tiếp (`month-calendar › monthCalendar`) |
| Khóa | **trống chiều giờ Dậu**: cổ đầu đánh 3 hồi (hồi 36 tiếng) |

| Id trạm | Tên | Nối | Thưởng |
|---|---|---|---|
| `lt_danh` | Trống Chiều · «Đánh trống» | `ix` `sm.trong` | `grantDaily(s, 'lt_danh')` chỉ giờ Dậu |
| `lt_tietkhi` | Bảng Tiết Khí · «Xem tiết khí» | `month-calendar › monthCalendar` | `grantDaily(s, 'lt_tietkhi')` |
| `lt_so` | Sổ Trống | bộ đếm máy chủ | — |

Âm trống: `thump` 60 Hz + nhiễu ngắn, nghe xa như chuông nhưng suy giảm nhanh hơn (tham chiếu 20 m). Việc thật hóa: **≈ 4 ngày** (dùng lại mọi thứ của lầu chuông, thay đạo cụ và bảng).
