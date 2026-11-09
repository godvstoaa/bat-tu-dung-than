# 08-08 · Thật hóa Sơn Môn (2): bốn bảo tháp · Sơn Môn · Hậu Môn · Tàng Y Các · bệ và trạm sân · hạ tầng

> Tiếp 08-07. Cùng quy ước tọa độ (thế giới, Bắc = −Z) và cùng cấu trúc spec. Phần này cũng ghi **các xung đột bố cục hiện có** phát hiện khi đo (công trình lấn tường), kèm cách sửa.

---

## 1. INT-SM-THAP-TB / INT-SM-THAP-DB — Bảo tháp Bắc (hạng B)

### 1.1 Vỏ và xung đột hiện có

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_pagoda5` (năm tầng mái), `hd: false` |
| Đặt hiện tại | `fit: { height: 26 }, at: { x: ±53, y: 0, z: −58, ry: 0 }` |
| Kích thước | 17,2 × 26 × 17,3 m → khung bao x ±(44,4…61,6), z −66,65…−49,35 |
| **Xung đột** | lấn **tường Đông / Tây** (mép trong x ±60, mặt ngoài ±61,4) 1,6 m và **tường Bắc** (mép trong z −66) 0,65 m — người chơi thấy tháp cắm vào tường |
| **Sửa** | dời tâm về **(±51, 0, −56)** → khung x ±(42,4…59,6), z −64,65…−47,35: cách tường trong 0,4 m (Đông/Tây) và 1,35 m (Bắc) |
| Hệ quả dời | cây tùng `(±44, −61)` rơi vào chân tháp → bỏ hai cây đó khỏi danh sách `pines` trong `sect.js` |
| Lòng đo được | tầng trệt 9 × 9 m có **trụ tâm**; tầng 2: hành lang có lan can 11 × 11 ở dải 6,8–8,4, phòng 7 × 7,5 ở 8,4–10; tầng 3: hành lang 10 × 10,5 ở 12–14, phòng 7 × 6,5 ở 14–16; tầng 4: hành lang 10 × 10 ở 16–17,6, **phòng đỉnh 4 × 4** ở 17,6–19,2; trên 19,2 là chóp đặc |
| Cao độ thiết kế | sàn trệt 0,40 · tầng 2: 6,80 · tầng 3: 12,00 · tầng 4 (đỉnh): 16,20 |

### 1.2 Công năng

| Tháp | Tên | Tầng trệt | Tầng 2 | Tầng 3 | Tầng đỉnh |
|---|---|---|---|---|---|
| Tây Bắc | **Tổ Tháp** (tháp tưởng niệm tổ sư) | bia tháp ghi hành trạng tổ sư (hư cấu, tài liệu 02 cấp `LORE-*`), khám xá lợi | phòng thờ nhỏ + hành lang ngắm Hậu Sơn | hành lang ngắm Huyền Thành | **chuông gió theo hành** của người chơi |
| Đông Bắc | **Tri Tuệ Tháp** (tên trung tính, không mượn danh hiệu Phật giáo vào Đạo quán) | bia «Tích Thiện» (trích `kb.js › JISHAN_PIAN`) | phòng đọc kinh ngắn | hành lang ngắm | chuông gió theo hành |

### 1.3 Khoang (mỗi tháp; tọa độ cục bộ quanh tâm tháp)

| Khoang | Hộp cục bộ (x · y · z) | Camera | Âm |
|---|---|---|---|
| `th.l0` | −4,5…4,5 · 0,4…6,4 · −4,5…4,5 (trừ trụ tâm Ø 1,2) | BỔ DỌC | `thap_da` |
| `th.l1.phong` | −3,5…3,5 · 6,8…11,6 · −3,7…3,7 | BỔ DỌC | `thap_da` |
| `th.l1.hien` | vành ngoài 11 × 11 có lan can | ngoài trời có mái | gió |
| `th.l2.phong` | −3,5…3,5 · 12,0…15,8 · −3,2…3,2 | BỔ DỌC | `thap_da` |
| `th.l2.hien` | vành 10 × 10,5 | ngoài trời | gió |
| `th.l3.dinh` | −2…2 · 16,2…19,2 · −2…2 | BỔ DỌC | `go_gio` |

### 1.4 Mặt cắt đứng (cục bộ, nhìn từ Nam)

```
 y 19,2 ┌──┐  chóp đặc
        │◉ │  phòng đỉnh 4 × 4: CHUÔNG GIÓ (5 chuông ngũ hành treo diềm)       tầng 4 (lv 3)
 y 16,2 ├──┴──┐ ─ hành lang 10 × 10 ─
        │  ⟲  │  phòng 7 × 6,5: thang xoắn quanh trụ (19 bậc, 1,2 vòng)          tầng 3 (lv 2)
 y 12,0 ├─────┴──┐ ─ hành lang 10 × 10,5 ─
        │   ⟲    │  phòng 7 × 7,5: thờ nhỏ / đọc kinh + thang xoắn (24 bậc)       tầng 2 (lv 1)
 y  6,8 ├────────┴──┐ ─ hành lang 11 × 11 ─
        │    ⟲ ▓    │  trệt 9 × 9: bia tháp, khám, thang xoắn quanh TRỤ TÂM ▓    trệt (lv 0)
 y  0,4 └───[cửa]───┘   (29 bậc 0,22 m, 1,8 vòng, bán kính 0,6–2,6)
```

### 1.5 Thang xoắn

| Đoạn | Từ → tới | Cao | Bậc (0,22 m) | Vòng | `seg` |
|---|---|---|---|---|---|
| S1 | trệt 0,40 → tầng 2 6,80 | 6,40 | 29 | 1,8 | 0–28 |
| S2 | tầng 2 6,80 → tầng 3 12,00 | 5,20 | 24 | 1,5 | 0–23 |
| S3 | tầng 3 12,00 → đỉnh 16,20 | 4,20 | 19 | 1,2 | 0–18 |

Mỗi bậc MOD-KT-17 (rẻ quạt 22,5°), trụ MOD-KT-18; dùng «con trỏ bậc» (08-04 §2.4). Ở mỗi tầng, miệng thang có lan can KT-20; lối ra hành lang ngoài là ô cửa `open` 1,6 × 2,4 cắt ở mặt Nam mỗi tầng (cắt boolean, khung MOD-BAC-23).

### 1.6 Đồ đạc chính

| Tầng | Mảnh |
|---|---|
| Trệt | MOD-BAC-01 sàn; MOD-BAC-53 bia tháp (đặt sát tường Bắc, đọc được); MOD-BAC-28 khám nhỏ; 2 MOD-BAC-33 nến; MOD-BAC-49 đèn |
| Tầng 2 | MOD-BAC-02 sàn; Tổ Tháp: MOD-BAC-28 + MOD-BAC-30 nhỏ; Tri Tuệ Tháp: MOD-NHO-13 × 2 + MOD-NHO-17 × 1 |
| Tầng 3 | MOD-BAC-02; MOD-BAC-35 × 2 (ngồi ngắm qua ô cửa) |
| Đỉnh | 5 chuông gió treo diềm 4 mặt + 1 ở giữa (hook `windchime`) |
| Hành lang | MOD-BAC-50 lan can (giữ lan can Meshy nếu đo đủ cao ≥ 0,9 m, nếu không thì lót thêm) |

### 1.7 Tương tác và trạm

| Id | Tầng | Tên | Nối |
|---|---|---|---|
| `th_tb_bia` / `th_db_bia` | trệt | Bia Tháp · «Đọc bia» | Tổ Tháp: lore (`LORE-*`); Tri Tuệ: `kb.js › JISHAN_PIAN` |
| `th_tb_chuonggio` / `th_db_chuonggio` | đỉnh | Chuông Gió · «Treo chuông gió hành của mình» | Hỷ / Dụng thần người chơi (`yong.primary`, `yong.xi` — tài liệu 04 «Thiên Mệnh Hành»): chuông chất liệu theo hành (Kim: đồng; Thủy: thủy tinh xanh; Mộc: tre; Hỏa: gốm đỏ; Thổ: sành) treo thêm vào diềm, **người khác cũng thấy** (vật dùng chung `ix` loại `sm.chuonggio.<tháp>`, giới hạn 1 / người / ngày, tối đa 24 chuông, cũ nhất rơi khỏi danh sách) | 

Chuông gió kêu theo gió (âm tổng hợp sin 1,2–3 kHz ngẫu nhiên, tần theo chất liệu). Phúc Khí: `grantDaily(s, 'th_chuonggio')` một lần / ngày cho cả hai tháp.

### 1.8 Việc thật hóa (hai tháp)

Dời tháp + bỏ 2 cây (0,5 ngày) · khoét cửa trệt + 3 ô cửa hành lang × 2 tháp (1,5) · thang xoắn + con trỏ bậc (dùng chung mọi tháp; 3) · công thức hai tháp (2) · chuông gió dùng chung (2) · test (1). **≈ 10 ngày** (trong đó 3 ngày thang xoắn dùng lại cho mọi tháp `tower_nine`).

---

## 2. INT-SM-THAP-TN / INT-SM-THAP-DN — Bảo tháp Nam (hạng B)

### 2.1 Vỏ và xung đột

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_pagoda_red`, `hd: false` |
| Đặt hiện tại | `fit: { height: 20 }, at: { x: ±53, y: 0, z: 58, ry: 0 }` |
| Kích thước | 20,1 × 20 × 17,3 → khung x ±(42,95…63,05), z 49,35…66,65 |
| **Xung đột** | lấn tường Đông / Tây 3,05 m (xuyên ra ngoài tường) và tường Nam 0,65 m |
| **Sửa** | dời tâm về **(±49, 0, 56)** → khung x ±(38,95…59,05), z 47,35…64,65 |
| Hệ quả | cây tùng `(±57, 48)` rơi vào chân tháp → bỏ; trạm Lịch `(40, 40)` khối x 38,4…41,6 z 38,4…41,6 — không chạm (tháp bắt đầu z 47,35) |
| Lòng đo được | **đế đặc** với buồng nhỏ 4 × 4,5 ở dải 0,4–2 (tâm); sân đế có lan can 14 × 12 ở dải 2–3,6 (mặt đế ~2,0 m); thân trên **đặc**, túi rỗng ≤ 3 × 2,5 m |
| Kết luận | tháp đặc (08-01 §1.4) phía trên; **địa cung** dưới đế và **sân đế** đi được |

### 2.2 Thiết kế

- **Địa cung** (buồng dưới đế): hạ sàn xuống **y −1,20** (dưới mặt sân — sân quán phẳng y 0, `world3d.js › groundY` trong sân trả `platformTop ?? 0` nên nền −1,2 hợp lệ), trần y 1,80, rộng 4 × 4,5 m. Vào bằng cửa nhỏ ở mặt Bắc đế (quay vào sân, không ra phía tường) + 6 bậc xuống trong lòng đế (bậc nằm trong đế, không phải khoét mặt sân). Trong: hộp xá lợi đá trên bệ, bia nhỏ, đèn dầu. Cửa `canh1` lịch `dien_phu`.
- **Sân đế** (y 2,0): hai đợt bậc đá ngoài (MOD-BAC-26 nối dài, bậc 0,4 m) ở mặt Bắc lên sân đế 14 × 12; lan can đá quanh; **bốn khám mù** trên thân tháp (mỗi mặt một hốc sâu 0,5 m, tượng nhỏ hư cấu hoặc bài vị + đèn dầu).
- **Chuông gió diềm thấp**: chuông gió đồng treo diềm tầng 1, tương tác «nghe gió» (tương tác nhỏ).

### 2.3 Khoang

| Khoang | Hộp cục bộ | Camera | Âm |
|---|---|---|---|
| `tn.diacung` | −2…2 · −1,2…1,8 · −2,25…2,25 | BỔ DỌC | `hang_da` · `giot_nuoc` (khẽ) |

Sân đế là ngoài trời (nền `addPlatform` y 2,0, lan can chặn mép).

### 2.4 Tương tác

| Id | Tên | Nối |
|---|---|---|
| `th_tn_xaloi` / `th_dn_xaloi` | Địa Cung · «Kính lễ hộp xá lợi tổ» | Sổ Công Quá (`remedy-fate › CONG_QUA`) — một dòng công «kính tổ» (chung khóa ngày với `cd_tosu`) |
| khám mù × 4 | đọc biển dưới khám | tương tác nhỏ |

### 2.5 Phương án thay (nếu cần đủ yêu cầu tài liệu tổng §8.4 «tầng đỉnh có chuông gió»)

Thay mô hình hai tháp Nam bằng `lib_pagoda5` cao 24 m (đối xứng với Bắc, lòng đủ đi). Ưu: đủ bốn tháp có tầng. Nhược: mất nhịp hai kiểu tháp (Bắc năm tầng / Nam đỏ). **Đề xuất giữ tháp đỏ đặc** — chuông gió theo hành đã có ở hai tháp Bắc. Ghi vào câu hỏi mở (README).

### 2.6 Việc thật hóa

Dời + bỏ 2 cây (0,5) · khoét cửa địa cung + khoét lòng đế (V3, 08-02 §5.4) (2) · bậc ngoài + nền sân đế + lan can (1) · khám mù × 4 × 2 (1,5) · test (0,5). **≈ 5,5 ngày.**

---

## 3. INT-SM-SONMON — Sơn Môn (hạng B)

### 3.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `gate_sect` |
| Đặt | `fit: { width: 30 }, at: { x: 0, y: 0, z: 67,2, ry: 0 }`; va chạm hiện tại khoét `keep: (x) => Math.abs(x) > 3.4` |
| Kích thước | 30 × 17,4 × 10,9 → x −15…15, z 61,75…72,65 (vắt qua tường Nam z 66…67,4) |
| Lòng đo được | **lối giữa thông 5 m** (x −2,5…2,5); **hai phòng gác kín** x ±(3…13), z 64,3…70,3 (≈ 10 × 6 m); dải 5,2–6,8: hai phòng trên x ±(3…7), 4 × 6; dải 6,8–12: **lầu cổng** x −6,5…6,5, z 65,2…69,7 (13 × 4,5) trên lối giữa |
| Cao độ | phòng gác sàn 0,40, trần 5,00; tầng lầu (phòng trên + lầu cổng) sàn **6,40**, trần 10,40 |

### 3.2 Khoang

| Khoang | Tên | Hộp thế giới | Camera | Âm |
|---|---|---|---|---|
| `sm.l0.tay` | Phòng Nhập Môn (Lão Tùng) | x −13…−3, y 0,4…5,0, z 64,3…70,3 | TRONG, `maxDist` 2,8 | `phong_nho` |
| `sm.l0.dong` | Phòng Khách Thập Phương | x 3…13, cùng y, z | TRONG, `maxDist` 2,8 | `phong_nho` |
| `sm.l1.tay` | Phòng trống trên (Tây) | x −7…−3, y 6,4…10,4, z 64,3…70,3 | BỔ DỌC | `lau_go` |
| `sm.l1.dong` | Phòng trống trên (Đông) | x 3…7, cùng y, z | BỔ DỌC | `lau_go` |
| `sm.l1.lau` | Lầu Nghênh Khách | x −6,5…6,5, y 6,4…10,4, z 65,2…69,7 | BỔ DỌC | `lau_go` · `go_gio` |

### 3.3 Mặt bằng (thế giới)

```
                       PHÍA SÂN (Bắc, z 61,75)
 x: −15        −13           −3   −2,5      2,5   3            13        15
    ┌───────────┬─────────────┐   ║  LỐI GIỮA  ║   ┌─────────────┬──────────┐
    │           │ █ thang     │   ║  5 m thông ║   │  thang █    │          │
    │  (tường   │ █ lên lầu   │   ║            ║   │  lên lầu █  │ (tường   │
    │   thân    │ PHÒNG NHẬP  │◁ô║  cánh cổng  ║ô▷ │ PHÒNG KHÁCH │  thân    │
    │   cổng)   │ MÔN         │ cửa  congnang  cửa │ THẬP PHƯƠNG │  cổng)   │
    │           │ [án] [ghế   │   ║  + ngách   ║   │ [bảng việc  │          │
    │           │  Lão Tùng]  │   ║  trên cánh ║   │  ngày][ghế] │          │
    │           │ [giá hồ sơ] │   ║  Tây       ║   │ [Sổ Khách]  │          │
    └───────────┴─────────────┘   ║            ║   └─────────────┴──────────┘
                       PHÍA NGOÀI (Nam, z 72,65)    START (3, 43) ở trong sân
```

Cửa phòng gác: mỗi phòng một cửa `canh1` 1,2 × 2,4 mở **vào lối giữa** (khoét ở vách lối x ±3); cửa sổ song nhỏ nhìn ra ngoài (Nam) và vào sân (Bắc).

### 3.4 Đồ đạc

| Khoang | Mảnh |
|---|---|
| Phòng Nhập Môn | MOD-DAN-01 sàn; MOD-BAC-42 án + MOD-BAC-43 ghế (Lão Tùng); MOD-DAN-18 giá hồ sơ «sổ nhập môn»; MOD-DAN-27 đèn dầu; MOD-BAC-35 bồ đoàn cho khách; MOD-KT-15 thang lên `sm.l1.tay` dọc vách Tây |
| Phòng Khách Thập Phương | MOD-NHO-34 bảng yết thị (việc ngày); MOD-DAN-16 phản gỗ; MOD-DAN-26 ấm trà; «Sổ Khách» trên án; MOD-KT-15 thang lên `sm.l1.dong` |
| Phòng trên Tây / Đông | kho đèn lồng dự phòng (MOD-BAC-48 × 6 xếp), kho cờ ngũ hành — **mở** (không khóa), nhìn qua song xuống lối giữa |
| Lầu Nghênh Khách | MOD-BAC-02 sàn; MOD-BAC-50 lan can mặt Nam + Bắc; MOD-BAC-43 ghế (Khổng tiên sinh giờ Dậu – Tuất); MOD-GNA-28 bàn + trà |
| Cổng | 2 cánh `congnang` 2,5 × 4,6 mỗi cánh (đinh đồng 9 × 9), **ngách** 0,9 × 2,0 trổ trên cánh Tây |

### 3.5 Trạm

| Id | Khoang | Tên | Nối |
|---|---|---|---|
| `sm_nhapmon` | Phòng Nhập Môn | Lão Tùng · «Trình lá số nhập môn» | bước «nhập bát tự ở cổng» (giao diện cổng hiện có trong `main.js`) + `chart.js › analyze` + chuỗi `MQ-P-*` (tài liệu 03) |
| `sm_viecngay` | Phòng Khách | Bảng Việc Ngày · «Xem việc hôm nay» | `state.js › settleTasks` (nhiệm vụ ngày + chuỗi) — việc `DQ-*` tài liệu 03 / 09 |
| `sm_sokhach` | Phòng Khách | Sổ Khách · «Ai đã ghé hôm nay» | gói `lb` (bảng xếp hạng phòng) đang có trong giao thức |
| `sm_lau` | Lầu Nghênh Khách | Khổng tiên sinh (giờ Dậu – Tuất) · «Nghe tiên sinh luận mệnh» | thoại phản đề «định mệnh luận» (persona tài liệu 06) |

### 3.6 Lịch và cửa

- Cánh cổng: lịch `son_mon` (mở Dần → Hợi, khóa Tý – Sửu). **Ngách luôn mở** (luật không nhốt, 08-03 §6.3).
- Lão Tùng: Dần → Tuất ở phòng; giờ Hợi thắp đèn cổng rồi về phòng ngủ (rời cảnh); nhập môn ban đêm: bảng tự phục vụ trên án (vẫn trình lá số được — không chặn người mới vào lúc khuya).
- Khổng tiên sinh: Thìn – Thân ngồi bậc ngoài Sơn Môn (canon «bậc Sơn Môn»), Dậu – Tuất lên lầu.

### 3.7 Việc thật hóa

Khoét 2 cửa phòng gác + 4 cửa sổ + 2 lỗ thang (2) · cánh cổng + ngách đạo cụ (1,5) · công thức 5 khoang (2) · trạm `sm_nhapmon` nối giao diện cổng (1) · trạm khác (1,5) · lịch NPC (1) · test (0,5). **≈ 9,5 ngày.**

---

## 4. INT-SM-HAUMON — Hậu Môn (hạng B)

### 4.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Đặt hiện tại | `gate_sect`, `fit: { width: 20 }, at: { x: 0, y: 0, z: −67,2, ry: π }`, khoét `|x| > 2,3` |
| Lòng đo được ở 20 m | lối giữa 3,3 m; 2 phòng 6,3 × 3,3; tầng trên < 3 m (không đi được) |
| **Đề xuất** | phóng **20 → 24 m**: lối 4 m, phòng 7,6 × 4,0, phòng trên 3,2 × 4,0 (vừa ngưỡng), lầu cổng 9,6 × 2,8; khung z −71,5…−62,9, vẫn cách nền L1 (z −56) và đỉnh bậc Bắc (z −61) — chân bậc Bắc ở z −61 cách mép trong cổng 1,9 m: đủ khoảng trước cửa (08-01 §9.2 yêu cầu 2,4 m tính từ **cửa phòng gác**, không phải lối giữa) |
| Khoét lối giữa | đổi `keep` thành `|x| > 2,8` |

### 4.2 Khoang và công năng

| Khoang | Tên | Đồ | Tương tác |
|---|---|---|---|
| `hm.l0.tay` | Phòng canh Hậu Môn | MOD-DAN-16 phản, MOD-DAN-27 đèn, sổ ra vào Hậu Sơn | `hm_so` · «Ghi tên lên Hậu Sơn» — mở chuỗi nhiệm vụ Hậu Sơn (cờ `MQ-1-*`) |
| `hm.l0.dong` | Phòng nghỉ đạo đồng | MOD-DAN-17 giường × 2, MOD-DAN-26 ấm trà, chổi | tương tác nhỏ: nghe đạo đồng kể chuyện (thoại `BARK-*`) |
| `hm.l1.*` | Chòi canh trên (2 phòng + lầu) | MOD-BAC-50 lan can, ghế | điểm ngắm Hậu Sơn |

Cửa cổng: lịch `son_mon` + ngách. **≈ 6 ngày.**

---

## 5. INT-SM-TANGY — Tàng Y Các (hạng C)

### 5.1 Hiện trạng

- Quầy Thợ May Tiên Y: `lib_wood_pavilion` `fit: { width: 6,2 }` tại (−22, 0, 35,6), quay Nam; hai giá phẩm phục ngũ hành (x −26,2 / −17,8), ba ma-nơ-canh xoay, hai đèn đá nhỏ (`sect.js`).
- Đo lòng: **bệ đặc** 5 × 3 m (dải 0,4–2), trên bệ một khám kín 2,5 × 1 m — đình mở trên bệ, **không có phòng**.
- Va chạm tay: `addSolidRectLocal(TANGY.x − 2.4, TANGY.z − 0.2, TANGY.x + 2.4, TANGY.z + 0.6)` + khối trạm `tangy` (x −24,8…−19,2, z 35,4…37,9).
- Hạng C đòi phòng + phòng phụ → **thêm buồng may phía sau** (công trình phụ dựng bằng mô-đun, có ngoại thất thật).

### 5.2 Thiết kế

```
 Bắc (z 27,6)
   ┌──────────── 6,4 ─────────────┐
   │ BUỒNG MAY (dựng mới)         │  khung tường DAN-03 (mặt ngoài vữa vàng),
   │ [DAN-32 khung dệt] [bàn cắt] │  mái `models.js › roof(7.2, 5.6, 1.6)` ngói xám,
   │ [giá vải × 2]  [gương thử]   │  1 cửa sổ Đông, 1 cửa sổ Tây
   │ [rương vải]  ◯ đèn dầu        │
   │        [cửa 1,8 × 2,6]        │
 z 32,4 └────────────┬──────────────┘
                     │ lối 1,6 m có mái (MOD-GNA-45 rút gọn)
 z 33,25 ┌───────────┴──────────────┐
         │ ĐÌNH QUẦY (lib_wood_pav.)│ bệ ~1,4 m: thêm 3 bậc mặt Nam + nền đi được
         │  quầy Bà Tư (DAN-35)     │
 z 37,95 └──────────────────────────┘
   giá áo Tây (−26,2)     ma-nơ-canh × 3      giá áo Đông (−17,8)
 Nam (sân)
```

| Hạng mục | Thông số |
|---|---|
| Buồng may | khung x −25,2…−18,8, z 27,6…32,4 (6,4 × 4,8), sàn y 0,1, trần 3,2; tường mô-đun 2 mặt (ngoài vữa vàng DAN-03, trong DAN-03); mái thủ tục `models.js › roof`; **kiểm chỗ trống**: Khách hỏi việc `an0` khối x −16,8…−15,2 (cách 2 m), Trà Thất khối x −44,4…−36,4 (xa) — không chạm |
| Bệ đình | `addPlatform(−22, 35,6, 5,0, 3,0, 0, 1,4)` + 3 bậc 0,47 m… vượt ngưỡng 0,41 → **4 bậc 0,35 m** (MOD-BAC-26 cắt) ở mặt Nam; khối chặn tay cũ của quầy thu lại thành đúng thân quầy |
| Lối nối | cắt cửa sau khám (2,5 × 1 → mở lưng khám thành cửa 1,2 × 2,2) xuống 4 bậc phía Bắc rồi lối có mái 1,6 m tới buồng may |

### 5.3 Khoang, trạm, NPC

| Khoang / trạm | Nội dung | Nối |
|---|---|---|
| `ty.dinh` (đình quầy, ngoài trời có mái — tính như «phòng khách» của tiệm theo luật C) | quầy Bà Tư | trạm `tangy` (đang có): `wardrobe-ui.js`, `cosmetics.js` (51 món / 8 ô / 5 bộ) |
| `ty.buong` | buồng may: khung dệt, giá vải theo ngũ hành, **gương thử** | trạm mới `ty_thu` · «Mặc thử trước gương» → `wardrobe-ui.js` chế độ xem toàn thân + đổi màu theo Hỷ thần (`acc` đã gửi qua `hello`) |
| NPC | Bà Tư (`tho_may`): Thìn → Dậu ở quầy; Ngọ ở buồng may (dệt — hoạt cảnh); Tuất – Mão rời cảnh, quầy để biển «Mai mở» nhưng gương thử vẫn dùng được |

Đèn: buồng 1 `dendau` + 1 `troi`; đình 2 đèn đá nhỏ (đang có). Cửa buồng `canh1` lịch `cho` (Thìn → Thân); ngoài giờ cửa buồng khóa (khoang khóa hợp lệ, nhìn được qua cửa sổ) và trạm `ty_thu` chuyển ra quầy (cùng giao diện). **≈ 6 ngày.**

---

## 6. INT-SM-BANTHAY — Bệ Thầy Tử Bình (hạng D)

| Thông số | Giá trị |
|---|---|
| Đối tượng | `models.js › masterDais` đặt tại `DAIS` (0, 4, −11), sàn bệ y 4,25 (`addPlatform(DAIS.x, DAIS.z, 10.4, 6.8, 0, DAIS.y + 0.25)`), mái che, 7 đèn lồng nhỏ, 2 đèn lồng góc |
| Trạm | `thay` (đang có) — giữ nguyên |
| Việc thật hóa | (1) khai `roofZone` cho camera dưới mái (08-03 §8.5): diềm mái ~ y 4,25 + 3,3; (2) Thầy ban đêm vào Tĩnh thất Chính Đường (08-07 §2.6) — bệ giờ Tuất có biển «Thầy ở Tĩnh thất, mời vào trong» chỉ hướng ngách; (3) không đổi va chạm |
| Ước lượng | 1 ngày |

### 6.1 INT-SM-THIENBANG — Thiên Bảng (hạng D, công trình mới theo tài liệu tổng §7.12)

| Thông số | Giá trị |
|---|---|
| Vị trí | nền L2, **(12, 4, −13)**, quay Nam (người đứng ở z −10 đọc) — cạnh Đông bệ Thầy, không chắn trục ngự đạo |
| Hình | bảng gỗ son 4,8 × 3,2 trên hai trụ đá + mái nhỏ; mặt bảng canvas động |
| Nội dung | xếp hạng **tiềm lực ban đầu** và **tiềm lực đã cải** (tài liệu tổng §7.12) — dữ liệu từ máy chủ (gói `lb` mở rộng, tài liệu 10 / 13 định) |
| Va chạm | 2 trụ `addBlock` r 0,4; bảng cao 1,2 m trở lên (đi dưới được) |
| Tương tác | trạm `thienbang` · «Xem Thiên Bảng» |

---

## 7. Trạm sân (hạng D)

Mọi trạm sân đang có giữ id, vị trí (`court.js › PLACE`) và mô hình thủ tục (`models.js`). Việc chung: kiểm luật D (đi quanh / đứng dưới được, ≥ 1 tương tác), camera dưới mái, nền đứng lên được nếu có bệ.

| INT | Trạm (id) | Mô hình | Hiện trạng va chạm | Việc thật hóa | Ước lượng |
|---|---|---|---|---|---|
| INT-SM-TRATHAT | `tra` | `teaPavilion` dời tới (−40, 24) | khối `addSolidRect(block)` x −44,4…−36,4, z 21,25…24,45 — **đặc cả đình**, ba ghế ngồi (`TEA_SEATS`) nằm ngoài khối | đổi khối đặc thành: nền đình `addPlatform` + 4 cột `addBlock` + bàn trà khối nhỏ → người chơi **bước vào trong đình** ngồi bồ đoàn; giữ `TEA_SEATS` (test hiện có ràng buộc `protocol.js › SEATS`) | 1,5 ngày |
| INT-SM-LABAN | `compass` | `compassTerrace` (40, 22) | khối đặc x 38,4…43,2, z 20,4…23,6 | thành **đài đứng lên được** (`addPlatform` cao 0,3) + la bàn ở tâm `addBlock` r 0,8; người chơi đứng cạnh kim la bàn | 1 ngày |
| INT-SM-XAM | `xam` | `xamAltar` (−40, 40) | khối đặc 3,2 × 3,2 | giữ (bàn thờ có ống xăm là vật đặc hợp lý); thêm bái điếm MOD-BAC-36 trước bàn (ngồi quỳ khi xin) | 0,5 ngày |
| INT-SM-HUONG | `huong` | `incenseBurner` (0, 34) | khối đặc 3,2 × 1,6 | giữ; khói hương (MOD-KT-30) theo `incenseState` (`state.js`) | 0,5 ngày |
| INT-SM-LICH | `lich` | `calendarBoard` (40, 40) | khối đặc 3,2 × 3,2 | thu khối về **hai trụ bảng** (`addBlock` × 2) — đi sát đọc được | 0,5 ngày |
| INT-SM-KHACH | `an0`, `an1`, `an2` | bàn án thủ công | khối 1,6 × 1,6 mỗi bàn | giữ; thêm ghế cho NPC khách (`seat:npc`) | 0,5 ngày |
| INT-SM-DAIDINH | — (**chưa có trạm**) | `cauldron` cao 5,5 tại (0, 27,5) | cắt lát hình khối | **thiếu tương tác (vi phạm D)** → thêm tương tác nhỏ «Đọc minh văn Đại Đỉnh» (minh văn ngũ hành khắc quanh thân, chữ do tài liệu 02 cấp) + khói hương từ miệng đỉnh | 0,5 ngày |
| INT-SM-HOSEN | `sen` (hồ Đông) | `models.js › pond` × 2 | `addSolidRect` mặt nước; lan can đá | hồ Tây **thiếu tương tác** → thêm tương tác nhỏ «Cho cá ăn» (hoạt cảnh cá chép tụ lại); hồ Đông giữ trạm `sen` (iOS tắt) | 0,5 ngày |

---

## 8. Hạ tầng Sơn Môn (hạng E)

### 8.1 INT-SM-NEN — Hai tầng nền, ba dãy bậc, ngự đạo

| Thành phần | Hiện có (`court.js`) | Đạt E? | Việc |
|---|---|---|---|
| Nền L1 | `addPlatform` 72 × 64 cao 2; vách mép dải 0,5 m `addSolidRect` | đạt | — |
| Nền L2 | 56 × 44 cao 4 | đạt | — |
| Bậc Nam (sân → L1) | 5 bậc 0,4 m, rộng 16 m, lan can hai bên đặc | đạt (test «bậc lên dần» đang có) | — |
| Bậc L1 → L2 | 5 bậc, rộng 14 m | đạt | — |
| Bậc Bắc (L1 → sân sau) | 5 bậc, rộng 12 m | đạt | — |
| Ngự đạo chạm rồng | dải đá dốc giữa bậc chính (trang trí) | đạt — nằm trong dải bậc, đi trên được như bậc | — |
| Lan can đá | `balustrade` mỗi 2 m, chừa khe bậc | đạt | kiểm lan can chặn đúng mép L1 tại 4 góc (lỗi tiềm ẩn: góc lan can là trụ rời) |
| Nền dưới công trình trên L1 | điện phụ và lầu đặt y 0 **ngoài** L1 (x ±40…57) | đạt | — |

### 8.2 INT-SM-TUONG — Tường bao

Tường thủ tục (`sect.js › wall`) dày 1,4, cao 6,5, khối tay `court.js` — đạt. Việc duy nhất: sau khi dời bốn tháp (§1, §2) chạy lại test «tường chặn» (`test-game-state › Sơn Môn`) và thêm điểm kiểm tại chân tháp mới.

### 8.3 Đạo cụ sân (không phân hạng)

Đèn đá (`stoneLantern`, 20 cái), cờ ngũ hành (8 cột), giá phẩm phục, ma-nơ-canh — đều đã có va chạm theo hình khối và đèn đăng ký. Không đổi.

---

## 9. Tổng hợp Sơn Môn

| INT | Hạng | Ngày người |
|---|---|---|
| INT-SM-CHINHDUONG | A | 10,5 |
| INT-SM-DIENTAY | B | 10 |
| INT-SM-DIENDONG | B | 8 |
| INT-SM-LAUCHUONG | B | 7,5 |
| INT-SM-LAUTRONG | B | 4 |
| INT-SM-THAP-TB, -DB | B | 10 |
| INT-SM-THAP-TN, -DN | B | 5,5 |
| INT-SM-SONMON | B | 9,5 |
| INT-SM-HAUMON | B | 6 |
| INT-SM-TANGY | C | 6 |
| INT-SM-BANTHAY + THIENBANG | D | 3 |
| Trạm sân (8 hạng mục) | D | 6 |
| Hạ tầng | E | 1 |
| **Cộng Sơn Môn** | | **≈ 87 ngày người** (đã gồm phần dùng chung: thang xoắn, vỏ `hall_main` khoét chung, gói `ix`) |
