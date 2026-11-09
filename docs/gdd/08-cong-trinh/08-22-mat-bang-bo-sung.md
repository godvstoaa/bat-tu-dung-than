# 08-22 · Mặt bằng bổ sung — các công trình chưa có bản vẽ khoang ở phần spec

> 08-07 … 08-11 đã có mặt bằng cho công trình chính; phần này vẽ nốt **mọi công trình còn lại** (theo yêu cầu «mặt bằng từng phòng cho mọi công trình đang có»), cùng danh sách đồ và vị trí trạm. Tọa độ cục bộ (gốc tâm vỏ, +Z mặt tiền) trừ khi ghi «thế giới». Kích thước là thiết kế từ số đo 08-18; chạy `bld-void` chính thức rồi chỉnh.

Ký hiệu: `█` thang · `▲▼` lên / xuống · `○` chỗ ngồi · `◎` vật chính · `[…]` đồ đạc · `▒` khoang khóa · `‖` cửa đi.

---

## 1. Sơn Môn — bổ sung

### 1.1 Hậu Môn (INT-SM-HAUMON, phóng 24 m) — tầng trệt

```
 x: −12      −9,6            −2      2            9,6       12
    ┌─────────┬───────────────┐ ║LỐI║ ┌───────────┬──────────┐   z −2 (phía sân sau Hậu Sơn)
    │(thân    │ PHÒNG CANH    │ ║ 4 ║ │ PHÒNG NGHỈ│ (thân    │
    │ cổng)   │ [phản DAN-16] │‖║ m ║‖│ ĐẠO ĐỒNG  │  cổng)   │
    │         │ [sổ ra vào ◎] │ ║   ║ │ [giường×2]│          │
    │         │ █ thang chòi  │ ║   ║ │ [ấm trà]  │          │
    └─────────┴───────────────┘ ║   ║ └───────────┴──────────┘   z 2 (phía sân Sơn Môn)
```

| Khoang | Kích thước | Trạm / tương tác |
|---|---|---|
| `hm.l0.tay` | 7,6 × 4,0 | `hm_so` (◎) |
| `hm.l0.dong` | 7,6 × 4,0 | tương tác nhỏ: nghe đạo đồng kể |
| `hm.l1.tay` / `.dong` | 3,2 × 4,0 | chòi canh: điểm ngắm |
| `hm.l1.lau` | 9,6 × 2,8 | hành lang nối hai chòi qua lối giữa |

### 1.2 Bảo tháp Nam — địa cung (INT-SM-THAP-TN / -DN)

```
  mặt cắt Bắc – Nam (cục bộ)                     mặt bằng địa cung (y −1,2)
        ┌─ thân tháp đặc ─┐                      ┌──────── 4,0 ────────┐
        │   khám mù ×4    │                      │  [bia nhỏ]          │
  ══ sân đế y 2,0 (lan can) ══                   │  ◎ hộp xá lợi       │  4,5
  ▲ bậc ngoài Bắc  ┌───────┐                     │    trên bệ đá       │
  ▲                │ đế    │                     │  [đèn dầu × 2]      │
  ═══ sân y 0 ═════│ ‖     │════                 │ █ 6 bậc lên cửa Bắc │
                   │ ▼6 bậc│                     └────────‖────────────┘
            y −1,2 └─địa cung─┘
```

### 1.3 Đình sảnh nghề (8 nơi) — mặt bằng chung

```
                 (phía Huyền Thành)
   [cột đèn]  ○ ghế khách  ○      [cột đèn]
              ┌──────────────┐
              │ ◎ ÁN THƯ     │  scholar_desk 3,2
              └──────────────┘
        ┌────────────────────────────┐
        │ ĐÌNH (bệ 1,2–1,4 m)        │  lib_wood_pavilion 7 × 5,3
        │ [khám tổ nghề]  [bảng chỉ  │  bậc 3–4 × 0,35 phía trước
        │                  đường A]  │
        └────────────────────────────┘
   [bonsai]                              (xe kiệu + ngựa ở (−9, 6…10,5) — sảnh ngoài thành)
```

---

## 2. Hậu Sơn — bổ sung

### 2.1 Tĩnh Thất (INT-HS-DIENDONG) — sảnh (cục bộ, 16,7 × 7,0)

```
 x: −8,3                                       5,4     8,3
 z −5,7 ┌──────────────────────────────────────┬───────┐
        │  ○ ○ ○        ◎ KHÁNH (BAC-37)       │ █ U   │
        │  ○ ○ ○        [hương trầm]           │ thang │
        │  ○ ○ ○  (9 bồ đoàn 3 × 3)            │ gác   │
        │  mành tre che cửa sổ (ánh sáng dịu)  │       │
 z  1,3 └──────────────‖───────────────────────┴───────┘
                    cửa (lịch Mão → Hợi)
 GÁC TỊNH (y +9,3): ▒ phòng đạo trưởng 4,4 × 7,4 │ phòng thiền 2 │ phòng thiền 3
```

### 2.2 Giảng Đường (INT-HS-DIENTAY) — sảnh

```
 z −5,7 ┌──────────────────────────────────────┬───────┐
        │ [NHO-21 bảng giảng (canvas bài học)] │ █ U   │
        │        ◎ [NHO-14 án thầy] [ghế]      │ thang │
        │  [án][án][án][án][án]  ← NHO-13 × 5  │       │
        │  [án][án][án][án][án]  ← hàng 2      │       │
 z  1,3 └──────────────‖───────────────────────┴───────┘
 GÁC SÁCH GIẢNG (y +9,3): NHO-17 × 4 dọc tường sau, án đọc giữa
```

### 2.3 Bắc Đẩu Lâu / Án Lục Lâu (INT-HS-THAPDONG / -THAPTAY) — một tầng điển hình

```
        ┌────── 6 × 6,5 (trệt) / 8 × 8 (tầng trên) ──────┐
        │   [khám sao / kệ hồ sơ]                        │
        │          ┌─────┐                               │
        │   ⟲ thang│trụ  │ xoắn 17 bậc / tầng            │
        │          └─────┘                               │
        │   [bàn đọc]                                    │
        └──────────── ô cửa ra ban công ‖ ───────────────┘   ban công vòng có lan can mỗi tầng
```

---

## 3. Tử Bình Phong — bổ sung

### 3.1 Chính Điện — hai khoang đầu Tây (cục bộ x −81,5…−41,5)

```
 x: −81,5                    −61,5                     −41,5
    ┌──────────────────────────┬──────────────────────────┐
    │ LÃO QUÂN ĐIỆN            │ THƯ KHỐ CỔ ÁN            │
    │  [bệ 3 cấp] ◎ deity_daode│  [kệ NHO-17 × 8 dọc vách] │
    │  [bàn lễ · nến · lư]     │  ◎ [bàn đọc cổ án × 3]   │
    │   ○ ○ ○  bồ đoàn         │  [đèn chân đồng × 4]     │
    │  [đèn lồng × 4]          │                          │
    └──────‖───────────────────┴───────‖──────────────────┘
       cửa riêng (thay door `laoquan`)    cửa ra lối dọc trước Bát Cách Lang
```

Khoang `tb.laoquan` 20 × 40 → chia hai: **điện** 20 × 22 (phía sau) + **tiền sảnh** 20 × 18 (phía trước, chờ / đọc «Đạo Đức Kinh» trích trên vách). Khoang `tb.thukho` tương tự.

### 3.2 Cách Cục Đường và tĩnh thất (cục bộ x 58,5…81,5)

```
    ┌──────────────────────────┐
    │ ▒ TĨNH THẤT ĐẠO TRƯỞNG   │  (phía sau, 23 × 16) — khoang khóa, nhìn qua song
    ├──────────‖───────────────┤
    │ CÁCH CỤC ĐƯỜNG           │  (phía trước, 23 × 24)
    │  ◎ [án trưởng sảnh]      │
    │  [bàn án khó × 3]        │
    │  [bảng «tám cách đã học»]│
    └──────────‖───────────────┘
```

### 3.3 Cửu Cung Lâu / Cửu Vận Lâu — một tầng (thân dựng lại, 13 × 14, cao 8 m)

```
   ┌──────────────── 13 ────────────────┐
   │ GÁC LỬNG (y +4,0): lan can, kệ     │
   │ ┌──────────────────────────────┐   │
   │ │ SÀN CHÍNH (y +0): ◎ bàn sao  │   │
   │ │  cung / mô hình nhà vận      │   │
   │ └──────────────────────────────┘   │
   │  █ thang U quanh lõi (2 × 4 m)     │
   └──────── cửa sổ chính quay đúng phương của cung ────┘
```

---

## 4. Manh Phái Cốc — bổ sung

### 4.1 Tượng Pháp Đường (INT-MP-DAIDIEN) — tầng trệt (31,4 × 16,5)

```
 ┌──────────────────────────────── 31,4 ────────────────────────────────┐
 │ ◇ ◇ ◇ ◇ ◇ ◇  ← 6 phù điêu tượng (vách sau)                           │
 │                                                                      │
 │ ◇                ◎ GHẾ THẦY MANH PHÁI                            ◇   │  ← phù điêu vách hồi (3 + 3)
 │ ◇            ○ ○ ○ ○ (ghế khách, vòng cung quanh thầy)           ◇   │
 │ ◇                                                                ◇   │
 │  ··· đèn chân tường (dải sáng thấp dọc 4 vách) ···                   │
 │ █ thang lên thư phòng (góc Đông)                                     │
 └──────────────────────────────‖‖──────────────────────────────────────┘
```

12 phù điêu = 12 «tượng» (`mangpai` trả tượng của lá số; phù điêu nào khớp thì ấm — 08-15 §3.9).

### 4.2 Thính Âm Đường / Xúc Tượng Đường (hall_main 25,5: sảnh 20,9 × 8,7)

```
 THÍNH ÂM:  ┌──────────────── 20,9 ────────────────┐
            │ ◎宮  ◎商  ◎角  ◎徵  ◎羽  (5 khánh treo) │
            │   ○    ○    ○    ○    ○               │
            └─────────────────‖────────────────────┘
 XÚC TƯỢNG: ┌──────────────── 20,9 ────────────────┐
            │  ◎ SA BÀN NỔI 10 can · 12 chi (6 × 3) │
            │   ○ ○ ○ quanh sa bàn                 │
            └─────────────────‖────────────────────┘
```

### 4.3 Đại Đỉnh Manh Cốc (INT-MP-DAIDINH)

```
 mặt cắt                         mặt bằng
   ┌── sàn ngắm y +20 ──┐          ○ ○  sàn ngắm 3,2 × 4,8 sát miệng đỉnh
   │█                   │          █ giàn bậc gỗ (5 đợt × 4 m, chiếu nghỉ mỗi đợt)
   │█ giàn gỗ   (ĐỈNH)  │          ◎ lòng đỉnh: tro, khói
   │█                   │
 ══╧════ mặt đất ═══════╧══
```

---

## 5. Trích Thiên — bổ sung

### 5.1 Cửu Diệu Lâu (INT-TT-CUUTANG) — một tầng (thân dựng lại ~18 × 19, cao 11)

```
   ┌─────────────── 18 ───────────────┐
   │ GÁC LỬNG y +6,4: kệ, lan can     │
   │       ◎ cầu đồng diệu (treo giữa)│
   │   quỹ đạo vẽ trần                 │
   │ [bảng vị trí diệu hôm nay]       │
   │ █ thang U (2 đợt × 5,5 m)        │
   └──────── cửa sổ hướng diệu (nếu trên chân trời) ───────┘
```

### 5.2 Ngũ Tinh Tháp (INT-TT-NGUTANG, lib_pagoda5 52 m)

Như tháp Bắc Sơn Môn (08-08 §1.4) **phóng × 2**: trệt 18 × 18 có trụ tâm (dọn vách chữ thập rác, 08-18 §3), tầng 2 phòng 14 × 15, tầng 3 phòng 14 × 13, tầng 4 (đỉnh) 8 × 8; thang xoắn bán kính 1,2–5,2 m. Mỗi tầng một hành tinh: ◎ quả cầu hành tinh, bảng vị trí (`qizheng › getLuminaries`).

---

## 6. Cùng Thông Hồ — bổ sung

### 6.1 Trà lâu — lầu kín (y 8,4; bát giác ~23 m, 08-18 §8)

```
            ┌───── cạnh hướng hồ ─────┐
       ╱  [bàn trà riêng × 3 cạnh hồ]  ╲
      │  ○○ ○○ ○○                      │
      │        ◎ BÌNH PHONG «lời tháng»│   ← `kb.js › QIONGTONG_TIAOHOU` tháng hiện tại
      │  [kệ trà GNA-35]   █ thang gác │
       ╲  [cửa sổ chống GNA-18 × 8]    ╱
            └───── cạnh hướng bờ ─────┘
 GÁC TRÀ SƯ (y 12,0; 16,5 × 15): ▒ buồng trà sư (khóa, nhìn qua song) · [kho trà] · [bàn thử trà]
```

### 6.2 Thủy tạ Điều Hậu (bát giác Ø 11)

```
          ╱‾‾‾‾‾‾‾‾‾╲
        ╱ [bình phong ╲        bốn bình phong ở bốn cạnh chéo: xuân · hạ · thu · đông
       │   xuân]       │
       │  ◎ lò than    │
       │  ◎ chậu nước  │       ○ ○ ghế quanh
       │   [đông]      │
        ╲             ╱
          ╲___‖_____╱   ← lối vào có bậc phía mặt nước
```

---

## 7. Thư Lâu Lâm — Tàng Thư Các (INT-TL-TANGTHU-*, 38,4 × 36 × 36,7 sau sửa)

```
 TẦNG 1 (y +0,4)                              TẦNG 2 (y +9,4)
 ┌──────────── ~32 × 33 ────────────┐          ┌──────────── ~32 × 33 ────────────┐
 │ ▓ kệ hai mức dọc 4 vách ▓▓▓▓▓▓▓▓ │          │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
 │ ▓                              ▓ │          │ ▓  khố thứ hai (Sử / Tập)      ▓ │
 │ ▓  4 dãy kệ đứng giữa (lối 1,6) ▓ │          │ ▓  4 dãy kệ                    ▓ │
 │ ▓  ◎ bàn thủ thư · 8 án đọc    ▓ │          │ ▓  ◎ bàn đọc dài × 2           ▓ │
 │ █ thang U                      ▓ │          │ █                              ▓ │
 └─────────────‖────────────────────┘          └──────────────────────────────────┘
   (Đông: khố Kinh / Tây: khố Tử)                (Đông: khố Sử / Tây: khố Tập)
```

---

## 8. Phong Thủy Viên và Lịch Đường — bổ sung

### 8.1 Dương Trạch Đường (INT-PT-DAIDIEN) — sảnh lõi 25 × 13,2

```
 ┌─────────┬─────────┬─────────┐   lưới 9 cung kẻ sàn (mỗi ô 8,3 × 4,4)
 │ 4 Tốn   │ 9 Ly    │ 2 Khôn  │   đồ di chuyển được: [giường] [bếp] [bàn làm việc]
 │         │         │         │   [cửa giả] [bể cá] — 5 món
 ├─────────┼─────────┼─────────┤
 │ 3 Chấn  │ 5 Trung │ 7 Đoài  │   la bàn treo trần chỉ tọa hướng thật của điện
 │         │  ◎      │         │
 ├─────────┼─────────┼─────────┤
 │ 8 Cấn   │ 1 Khảm  │ 6 Càn   │
 └─────────┴────‖────┴─────────┘
```

Bố trí cung theo **hướng thật** của điện (`ry` vùng); bảng trên vẽ khi cửa quay Nam — khi khác, xoay lưới để «1 Khảm» luôn ở phương Bắc thật.

### 8.2 Loan Đầu Đường / Âm Trạch Đường (hall_main 20,4)

```
 ┌──────────────── 16,7 ────────────────┐
 │  ◎ SA BÀN núi – sông 6 × 3 (đắp nổi) │   Loan Đầu: đặt «nhà» lên sa bàn
 │   ○ ○ ○ quanh                        │   Âm Trạch: sa bàn + la bàn 24 sơn trên khung
 └────────────────‖─────────────────────┘
```

### 8.3 Thời Thần Đường / Niên Kỵ Đường (Lịch Đường)

```
 THỜI THẦN: 12 khám giờ quanh 3 vách (4 + 4 + 4), khám giờ hiện tại sáng, ◎ bàn «giờ tốt hôm nay» giữa
 NIÊN KỴ:   sàn la bàn tròn Ø 6 khắc 24 sơn; cờ đỏ cắm ở phương kỵ năm nay (Tam Sát, Thái Tuế, Ngũ Hoàng)
```

### 8.4 Nhật Quỹ Lâu / Lậu Khắc Lâu — đỉnh tháp

```
 NHẬT QUỸ (đỉnh, ngoài trời):  ◎ mặt nhật quỹ đá Ø 3 nghiêng theo vĩ độ game, kim đồng; vòng 12 giờ can chi
 LẬU KHẮC (mỗi tầng): ◎ bình nước đồng; ống dẫn xuống tầng dưới; đỉnh: phao khắc vạch
```

---

## 9. Lưng Chừng Quán — sảnh và phòng

```
 SẢNH QUÁN (y +2,0; 28 × 17)                         LẦU PHÒNG (y +5,8)
 ┌──────────────────── 28 ────────────────────┐       ┌─────┬─────┬─────┬─────┬─────┐
 │ [bếp lớn × 2] [chạn]   ◎ [quầy chủ quán]   │       │ P1  │ P2  │ P3  │ P4  │ P5  │
 │                                            │       ├─‖───┴─‖───┴─‖───┴─‖───┴─‖───┤
 │  ▣ ▣ ▣  bàn × 6        ◇ giếng trời (GNA-13)│       │      hành lang (lan can     │
 │  ▣ ▣ ▣                                     │       │      nhìn xuống giếng trời) │
 │ █ thang lên phòng                          │       └─────────────────────────────┘
 └──────────────────‖─────────────────────────┘        mỗi phòng: giường, rương, đèn dầu
   sân trên bệ: bàn đá, giếng, chuồng ngựa thồ
```

---

## 10. Cổng tông môn (INT-CONG-*) — tầng trệt (cục bộ, 70 m)

```
 x: −33              −8   −8          8   8               33
    ┌─────────────────┐   ║            ║   ┌─────────────────┐
    │ TIẾP KHÁCH ĐƯỜNG│   ║   VÒM      ║   │ PHÒNG GÁC + KHO │
    │ ◎ bàn ghi danh  │‖  ║   16 m     ║  ‖│ [bảng nhiệm vụ  │
    │ [sứ giả phái]   │   ║  cánh cổng ║   │  vùng] ◎        │
    │ ○○○○ trà        │   ║  + ngách   ║   │ [phản lính × 4] │
    │ █ thang U lên lầu│  ║            ║   │ █ thang U        │
    └─────────────────┘   ║            ║   └─────────────────┘
 LẦU CỔNG (y +7,2): hành lang 64 m; đầu Tây «sảnh phái» (bài vị tổ sư phái, hư cấu)
 GÁC (y +14,4): điểm ngắm vùng
```

---

## 11. Huyền Thành — bổ sung

### 11.1 Thành lâu (INT-HT-THANHMON) — tầng 1 và 2 (24 × 8)

```
 LẦU VỌNG (y 24,4)                                LẦU TRỐNG CANH (y 32,4)
 ┌──────────────── 24 ────────────────┐            ┌──────────────── 24 ────────────────┐
 │ ◎ BẢN ĐỒ TOÀN CẢNH (bàn 6 × 3)    │            │        ◎ TRỐNG CANH (giá đỏ)       │
 │ [ống nhòm đứng × 2 ở cửa sổ Nam]  │            │  hiên lan can bốn mặt              │
 │ █ thang lên (góc Đông)            │            │  ○ chỗ lính ngồi canh              │
 └──────────‖─────────────────────────┘            └────────────────────────────────────┘
   cửa ra mặt thành đài (2 bậc)
```

### 11.2 Văn Phong Tháp — điện trong đế (14 × 11) và tầng tháp 1 (25 × 22)

```
 ĐIỆN TRONG ĐẾ (y 2,4)                          TẦNG THÁP 1 (y 14,2)
 ┌──────────── 14 ────────────┐                 ┌──────────── 25 ────────────┐
 │ ◎ BẢNG CỬU TINH (vách Bắc) │                 │  ◎ ĐÈN VĂN XƯƠNG (giữa)    │
 │ [bàn tháp chủ khi mưa]     │                 │  ○ ○ ○ ○ bồ đoàn quanh     │
 │ █ thang lên sân đế          │                 │  ⟲ thang xoắn lõi          │
 └──────────‖─────────────────┘                 └────── 4 ô cửa nhìn thành ───┘
```

### 11.3 Du Phương Lâu — tầng trệt (sảnh 13 × 12,5 trong hiên 21 × 21)

```
 ┌──────────────────── hiên vòng 21 × 21 (lan can) ────────────────────┐
 │   ┌──────────────── SẢNH TRỌ 13 × 12,5 ────────────────┐            │
 │   │ ◎ [quầy chưởng quỹ]           [bảng ghép đội ◎]    │            │
 │   │  ▣ ▣ ▣  bàn ăn × 6                                 │            │
 │   │  ▣ ▣ ▣                       █ thang lên lầu        │            │
 │   └─────────────────────‖ (khoét theo khe sẵn, 08-18 §7)┘            │
 └───────────────────────────────────────────────────────────────────────┘
```

### 11.4 Nhà kiểu T3 — chái nghề (ví dụ nghề thuốc)

```
 ┌──────────┬───────────┬──────────┐┌────────┐
 │ BUỒNG    │ GIAN GIỮA │ BUỒNG    ││ CHÁI   │  chái 3,2 × 3,2 sát hồi phải
 │ CHỦ      │ [bàn thờ] │ CON      ││ NGHỀ   │  [DAN-39 giá thuốc] [DAN-38 án
 │          │ [phản]    │          ││ ◎      │   bắt mạch] cửa riêng ra sân
 └──────────┴────‖──────┴──────────┘└───‖────┘
 ┌────────┐
 │ CHÁI   │ (hồi trái) bếp — như T2
 │ BẾP    │
 └───‖────┘
```

---

## 12. Danh sách đồ còn thiếu trong các mặt bằng trên (để TA lập kế hoạch)

| Đồ | Dùng ở | Có trong bộ? |
|---|---|---|
| Phù điêu «tượng» sờ được | Tượng Pháp Đường | **chưa** — thêm MOD-NHO-49 (khung) + canvas nổi (normal map vẽ theo dữ liệu) |
| Sa bàn núi sông | Loan Đầu, Âm Trạch | **chưa** — đạo cụ riêng (`interior.glb` của công trình) |
| Nhật quỹ đá | Nhật Quỹ Lâu | **chưa** — đạo cụ riêng |
| Bình lậu khắc | Lậu Khắc Lâu | **chưa** — đạo cụ riêng |
| Bản đồ toàn cảnh (bàn) | Lầu Vọng | **chưa** — mô hình thu nhỏ sinh từ `terrain.js › heightAt` (lưới 64², 1 draw call) |
| Ống nhòm đứng | Lầu Vọng | **chưa** — đạo cụ riêng nhỏ |
| Cầu đồng diệu / hành tinh | Cửu Diệu Lâu, Ngũ Tinh Tháp | **chưa** — hình cầu thủ tục + vật liệu kim loại |
| Trống canh | Lầu Trống Canh | dùng `prop_drum_great` thu nhỏ |
