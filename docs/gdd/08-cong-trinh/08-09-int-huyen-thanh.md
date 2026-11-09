# 08-09 · Thật hóa Huyền Thành: thành môn · 36 nhà vườn · sạp chợ · bài phường · Văn Phong Tháp · Du Phương Lâu · tường thành

> Huyền Thành là hub: người chơi qua lại hằng ngày, nên «không công trình làm màu» ở đây có giá trị cao nhất. Phần này gồm cả **quy tắc sinh tất định** cho 36 gia đình (mỗi nhà là một lá số thật) và **bảng xung đột bố cục** phát hiện khi đo (sạp chợ chắn cửa nhà, sạp lấn bài phường).

---

## 1. Bối cảnh

### 1.1 Sơ đồ thành (theo `landmarks.js`)

```
                                     Bắc (−Z)
                    [Du Phương Lâu]            Hậu Sơn (0, −116)            [Văn Phong Tháp]
                     (−112, −96)            nền 90 × 72, z −152…−80            (112, −96)
          ⌂32 (−90,−70)                                                       ⌂34 (90,−70)
      ⌂31 (−110,−40)                   ┌────── SƠN MÔN ──────┐                  ⌂33 (110,−40)
                                       │  x −60…60, z −66…66 │
 ⌂21 ⌂17 ⌂13 ⌂09                       │                     │           ⌂11 ⌂15 ⌂19 ⌂23
 ════════ trục Đông–Tây z 0 ═══════    │                     │    ═══════ trục Đông–Tây ═══════
 ⌂22 ⌂18 ⌂14 ⌂10                       │                     │           ⌂12 ⌂16 ⌂20 ⌂24
  x −131 −114 −97 −80                  └─────────────────────┘           80  97  114  131
      ⌂35 (−125,30)                                                       ⌂36 (125,30)
        ⌂29 ⌂27 ⌂25 (phố phụ z 52–64)        ║ đại lộ Nam ║       ⌂26 ⌂28 ⌂30
                                    ⌂01 [sạp] ║  cột đèn   ║ [sạp] ⌂02      z 84
                                    ⌂03 [sạp] ║ BÀI PHƯỜNG ║ [sạp] ⌂04      z 101 (bài phường z 104)
                                    ⌂05 [sạp] ║            ║ [sạp] ⌂06      z 118
                                    ⌂07       ║            ║       ⌂08      z 135
              ── tường thành tròn R 158 ──  ╡ THÀNH MÔN (0, 158) ╞  ── tường thành ──
                                                ║ trạm xe kiệu (10, 180)
                                     Nam (+Z) — đường đá ra các vùng
```

### 1.2 Danh mục

| INT | Hạng | § |
|---|---|---|
| INT-HT-THANHMON | B | §2 |
| INT-HT-NHA-01 … 36 | C | §3–§4 |
| INT-HT-SAP-01 … 06 | D | §5 |
| INT-HT-PAIFANG | D | §6 |
| INT-HT-VANPHONG | B | §7 |
| INT-HT-DUPHUONG | B | §8 |
| INT-HT-TUONGTHANH | E | §9 |
| INT-HT-TRAMXE | D | §10 |

---

## 2. INT-HT-THANHMON — Thành môn Nam (hạng B)

### 2.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `city_gate` (công trình trùm, 3 bản) |
| Đặt | `place(g, ['city_gate', 'gate_sect'], { fit: { width: 64 }, at: { x: 0, y: H(0, 158) = 0,4, z: 158, ry: 0 }, keep: corridor(0, 158, 0, 5) })` |
| Kích thước | 64 × 49,2 × 30,1 → x −32…32, z 143…173 |
| Lòng đo được | thân **thành đài rỗng** (vỏ Meshy không lõi): hai nửa x ±(4…31), z 146,5…169,5, rỗng từ chân tới ~20 m; **vòm cổng** giữa ~7 m (x −3,5…3,5); mặt trên thành đài ~20–24 m; **thành lâu**: túi phòng ở 24–28 m, phòng 24 × 8 ở 32–36 m (x −12…12, z 153…161) |
| Va chạm hiện tại | cắt lát vỏ, khoét lối giữa `|x| > 5` — người chơi đi qua «lòng rỗng» của thành đài mà không thấy |
| Nguyên mẫu | thành môn đời Minh có **tàng binh động** (hang chứa quân xây trong thân thành đài, như Trung Hoa môn Nam Kinh) — lý do có thật để thân thành đài có phòng |

### 2.2 Cao độ và khoang

| Khoang | Tên | Hộp thế giới | Cao độ (sàn → trần) | Camera | Âm |
|---|---|---|---|---|---|
| `tm.vom` | Vòm cổng (lối đi) | x −3,5…3,5, z 143…173 | 0,4 → 10,0 | ngoài trời có trần | `hang_da` nhẹ |
| `tm.l0.tay` | Tàng binh động Tây — Doanh Phòng Tuần Thành | x −28…−6, z 147…169 | 0,4 → 6,8 | TRONG, `maxDist` 5 | `hang_da` |
| `tm.l0.dong` | Tàng binh động Đông — Trạm Hỏi Đường | x 6…28, z 147…169 | 0,4 → 6,8 | TRONG | `hang_da` |
| `tm.thang.tay` / `.dong` | Giếng thang trong thành đài | x ±(28…31), z 150…162 | 0,4 → 20,4 | BỔ DỌC | `thap_da` |
| `tm.mat` | Mặt thành đài (ngoài trời, lỗ châu mai) | x −31…31, z 145…171 trừ thành lâu | 20,4 | ngoài trời | gió |
| `tm.l1.lau` | Thành lâu tầng 1 — Lầu Vọng | x −12…12, z 153…161 | 24,4 → 31,6 | TRONG | `lau_go` |
| `tm.l2.trong` | Thành lâu tầng 2 — Lầu Trống Canh | x −12…12, z 153…161 | 32,4 → 36,6 | TRONG | `lau_go` · `go_gio` |

### 2.3 Mặt bằng tầng trệt (thế giới)

```
                         PHÍA TRONG THÀNH (Bắc, z 143)
 x: −32   −28                 −6  −3,5   3,5  6                    28   32
    ┌──┬────┬─────────────────┬────╥══════╥────┬──────────────────┬────┬──┐
    │  │ ▲  │ DOANH PHÒNG     │ cửa║ VÒM ║cửa │ TRẠM HỎI ĐƯỜNG    │ ▲  │  │
    │  │ █  │ TUẦN THÀNH      │ ◁  ║ CỔNG ║ ▷  │                  │ █  │  │
    │  │ █  │ [phản lính × 6] │    ║ 7 m  ║    │ [án đi nhanh]    │ █  │  │
    │  │ █  │ [giá binh khí   │    ║      ║    │ [bản đồ 8 vùng]  │ █  │  │
    │  │ █  │  gỗ × 2]        │    ║cánh  ║    │ [ghế chờ × 3]    │ █  │  │
    │  │ █  │ [bàn bản đồ     │    ║cổng  ║    │ [chum nước, trà] │ █  │  │
    │  │ █  │  thành]         │    ║+ngách║    │                  │ █  │  │
    │  │ thang 4 đợt × 20 bậc │    ║      ║    │ thang 4 đợt      │    │  │
    └──┴────┴─────────────────┴────╨══════╨────┴──────────────────┴────┴──┘
                         PHÍA NGOÀI (Nam, z 173) — đường ra các vùng
```

Mỗi tàng binh động: trần **vòm cuốn gạch** (MOD-BAC-55), tường lót gạch thành (MOD-BAC-03 với bảng màu gạch xám), cửa mở vào vòm cổng (cắt boolean ở vách vòm, x ±3,5, z 158), đèn đuốc tường (MOD-MIE-36 đổi bảng màu — đạo cụ đèn, không mang biểu tượng vùng).

### 2.4 Thang và tầng trên

- **Thang trong thành đài**: mỗi bên một giếng thang 3 × 12 m sát tường hồi (x ±28…±31): 4 đợt × 20 bậc (0,25 / 0,25, mỗi đợt cao 5 m), chiếu nghỉ đổi chiều — tổng 0,4 → 20,4. Ra **mặt thành đài** qua ô cửa trên mặt trên (lỗ sàn có lan can).
- **Mặt thành đài**: nền `addPlatform` y 20,4 (64 × 26 trừ chân thành lâu); lỗ châu mai (merlon trên vỏ) chặn mép; **không** nối xuống tường thành tròn (mặt tường thành 14 m thấp hơn 6,4 m — ghi câu hỏi mở về «đường tuần trên thành»).
- **Thành lâu tầng 1** (y 24,4): cửa vào từ mặt thành đài (mặt Bắc thành lâu), 2 bậc lên; sảnh 24 × 8. Thang gỗ KT-15 trong góc Đông lên tầng 2.
- **Thành lâu tầng 2** (y 32,4): sảnh 24 × 8, lan can hiên bốn mặt, trống canh.

### 2.5 Trạm

| Id | Khoang | Tên | Nối |
|---|---|---|---|
| `tm_tuan` | `tm.l0.tay` | Đội trưởng tuần thành · «Hỏi chuyện các vùng» | `terrain.js › REGIONS` (8 vùng đang có) + thánh địa mới (tài liệu 07) — thoại giới thiệu, nhắc nhiệm vụ phụ `SQ-*` |
| `tm_caothi` | `tm.vom` (vách trong, phía Bắc) | Bảng Cáo Thị · «Đọc cáo thị» | việc ngày `DQ-*`, sự kiện `EV-*` (tài liệu 10) |
| `tm_tram` | `tm.l0.dong` | Án Đi Nhanh · «Chọn nơi đến» | mở bảng đi nhanh hiện có (`main.js` nhóm «Sảnh nghề · đi trạm») |
| `tm_vong` | `tm.l1.lau` | Lầu Vọng · «Ngắm toàn Huyền Giới» | bản đồ toàn cảnh: đánh dấu vùng đã tới / chưa tới (mở «trạm đi nhanh» khi đã tới tận nơi — tài liệu tổng §7.0) |
| `tm_trong` | `tm.l2.trong` | Trống Canh · «Đánh trống canh» | vật dùng chung `ix` `ht.trongcanh` (08-04 §5.4); giờ Tuất lính đánh «trống thu không» báo đóng cổng |

### 2.6 Người, cửa, đèn

| Mục | Nội dung |
|---|---|
| NPC | Đội trưởng tuần thành (Mão → Tuất ở doanh phòng), 2 lính gác vòm cổng (đứng hai bên vòm ngoài, đổi ca giờ Ngọ và giờ Tý), 1 lính trên Lầu Trống Canh (Dậu → Dần), người giữ trạm đi nhanh (Thìn → Thân; ngoài giờ án tự phục vụ) |
| Cửa | Hai cánh cổng `congnang` 3,4 × 8 m mỗi cánh giữa vòm (z 158), lịch `thanh_mon` (mở Mão → Dậu); **ngách** 1,2 × 2,4 trổ trên cánh Tây `luon_mo`. Cửa tàng binh động `canh2` 2,4 × 3,2 `dien_phu`. |
| Đèn | Vòm: 4 đuốc tường (`bep`); mỗi tàng binh động 3 đuốc + 1 đèn dầu; thành lâu 4 `denlong`; mặt thành đài 8 đèn lồng cột (ngoài trời) |
| Âm | trống thu không giờ Tuất (3 hồi), tiếng hô canh (thoại ngắn) mỗi giờ từ Tuất tới Dần |

### 2.7 Việc thật hóa

Khoét 2 cửa tàng binh động + ô ra mặt thành đài + 2 cửa thành lâu (2) · lót lòng thành đài (V1: lót tường + trần vòm) (3) · thang 4 đợt × 2 (1,5) · mặt thành đài + thành lâu (2) · cánh cổng + ngách (1) · trạm × 5 (3) · NPC lịch (1,5) · test (1). **≈ 15 ngày.**

---

## 3. INT-HT-NHA-01 … 36 — Nhà vườn (hạng C)

### 3.1 Vỏ dùng chung

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_courtyard` (thư viện CC0; nhân bản tức thời `instanceModelLod(…, { fitKey: 'max' })`, gần < 90 m bản thường, xa bản `.lod`) |
| Cỡ | 30 nhà phố: `s = (8 + r·2,5) × 1,25` (hạt giống `rng(77)`) = 10,0–13,1 m; 6 nhà vành: `s = 9 + r·2` (`rng(91)`) = 9,1–10,9 m; sâu = 0,671 s; cao = 0,493 s |
| Lòng đo được (ở s = 11,5) | **bệ đặc** ~9,5 × 7 m dải 0,4–2; **sảnh** 8,6 × 4,5 m dải 2–3,6 (x −4,3…4,3, z −2,9…1,6); trên 3,6 m là mặt mái dốc (lòng dưới mái còn ở dải giữa) |
| Cao độ thiết kế (× s / 11,5) | bệ / sàn nhà **1,60**; thông thủy giữa nhà (dưới nóc) ~3,6; sát tường ~1,9 |
| Khoét | **vỏ khoét chung một lần** `bld/_shared/courtyard-cut`: cửa chính 1,8 × 2,4 giữa mặt tiền (+Z), 2 cửa sổ mặt tiền, 1 cửa sổ mỗi hồi; bậc bệ 4 × 0,4 m trước cửa |
| Giả định | mặt tiền model = +Z cục bộ (khớp cách `streetHouses` quay nhà về phía đường). Kiểm bằng ảnh M1; nếu ngược thì khoét mặt −Z và cộng π vào `ry` trong bảng |

Thông thủy sát tường thấp (mái dốc xuống): **lối đi** giữa nhà đạt ≥ 2,8 m (08-01 §9.2); đồ đạc (giường, chạn, rương) xếp sát tường dưới mái thấp — đúng cách nhà Bắc Bộ / Hoa Bắc kê đồ.

### 3.2 Bảng 36 nhà

Hướng tính từ vector mặt tiền `(sin ry, cos ry)` quy ra độ la bàn (Bắc = 0°, Đông = 90°); «24 sơn» theo bảng 15° (`fengshui-compass › shanFromDegree` sẽ là nguồn chuẩn khi chạy). Cửa = tâm mặt tiền.

| INT | Phố | Tâm (x, z) | ry | Rộng × sâu (m) | Kiểu | Cửa (x, z) | Hướng · 24 sơn |
|---|---|---|---|---|---|---|---|
| INT-HT-NHA-01 | Đại lộ Nam · Tây | (−17, 84) | 1,571 | 11,3 × 7,6 | T4 | (−13,2, 84,0) | 90° · hướng Mão / tọa Dậu |
| INT-HT-NHA-02 | Đại lộ Nam · Đông | (17, 84) | −1,571 | 10,1 × 6,8 | T4 | (13,6, 84,0) | 270° · hướng Dậu / tọa Mão |
| INT-HT-NHA-03 | Đại lộ Nam · Tây | (−17, 101) | 1,571 | 12,2 × 8,2 | T4 | (−12,9, 101,0) | 90° · Mão / Dậu |
| INT-HT-NHA-04 | Đại lộ Nam · Đông | (17, 101) | −1,571 | 11,5 × 7,7 | T4 | (13,1, 101,0) | 270° · Dậu / Mão |
| INT-HT-NHA-05 | Đại lộ Nam · Tây | (−17, 118) | 1,571 | 10,4 × 7,0 | T4 | (−13,5, 118,0) | 90° · Mão / Dậu |
| INT-HT-NHA-06 | Đại lộ Nam · Đông | (17, 118) | −1,571 | 12,6 × 8,4 | T4 | (12,8, 118,0) | 270° · Dậu / Mão |
| INT-HT-NHA-07 | Đại lộ Nam · Tây | (−17, 135) | 1,571 | 12,8 × 8,6 | T4 | (−12,7, 135,0) | 90° · Mão / Dậu |
| INT-HT-NHA-08 | Đại lộ Nam · Đông | (17, 135) | −1,571 | 12,4 × 8,4 | T4 | (12,8, 135,0) | 270° · Dậu / Mão |
| INT-HT-NHA-09 | Trục Đông–Tây · Bắc | (−80, −16) | 0 | 10,2 × 6,8 | T1 | (−80,0, −12,6) | 180° · hướng Ngọ / tọa Tý |
| INT-HT-NHA-10 | Trục Đông–Tây · Nam | (−80, 16) | π | 10,6 × 7,1 | T2 | (−80,0, 12,5) | 0° · hướng Tý / tọa Ngọ |
| INT-HT-NHA-11 | Trục Đông–Tây · Bắc | (80, −16) | 0 | 12,8 × 8,6 | T3 | (80,0, −11,7) | 180° · Ngọ / Tý |
| INT-HT-NHA-12 | Trục Đông–Tây · Nam | (80, 16) | π | 11,8 × 7,9 | T2 | (80,0, 12,0) | 0° · Tý / Ngọ |
| INT-HT-NHA-13 | Trục Đông–Tây · Bắc | (−97, −16) | 0 | 11,5 × 7,7 | T2 | (−97,0, −12,1) | 180° · Ngọ / Tý |
| INT-HT-NHA-14 | Trục Đông–Tây · Nam | (−97, 16) | π | 12,2 × 8,2 | T3 | (−97,0, 11,9) | 0° · Tý / Ngọ |
| INT-HT-NHA-15 | Trục Đông–Tây · Bắc | (97, −16) | 0 | 11,3 × 7,6 | T2 | (97,0, −12,2) | 180° · Ngọ / Tý |
| INT-HT-NHA-16 | Trục Đông–Tây · Nam | (97, 16) | π | 10,2 × 6,8 | T1 | (97,0, 12,6) | 0° · Tý / Ngọ |
| INT-HT-NHA-17 | Trục Đông–Tây · Bắc | (−114, −16) | 0 | 10,4 × 7,0 | T1 | (−114,0, −12,5) | 180° · Ngọ / Tý |
| INT-HT-NHA-18 | Trục Đông–Tây · Nam | (−114, 16) | π | 10,2 × 6,9 | T1 | (−114,0, 12,6) | 0° · Tý / Ngọ |
| INT-HT-NHA-19 | Trục Đông–Tây · Bắc | (114, −16) | 0 | 11,3 × 7,6 | T2 | (114,0, −12,2) | 180° · Ngọ / Tý |
| INT-HT-NHA-20 | Trục Đông–Tây · Nam | (114, 16) | π | 11,6 × 7,8 | T2 | (114,0, 12,1) | 0° · Tý / Ngọ |
| INT-HT-NHA-21 | Trục Đông–Tây · Bắc | (−131, −16) | 0 | 13,1 × 8,8 | T3 | (−131,0, −11,6) | 180° · Ngọ / Tý |
| INT-HT-NHA-22 | Trục Đông–Tây · Nam | (−131, 16) | π | 10,2 × 6,8 | T1 | (−131,0, 12,6) | 0° · Tý / Ngọ |
| INT-HT-NHA-23 | Trục Đông–Tây · Bắc | (131, −16) | 0 | 10,9 × 7,3 | T2 | (131,0, −12,3) | 180° · Ngọ / Tý |
| INT-HT-NHA-24 | Trục Đông–Tây · Nam | (131, 16) | π | 10,8 × 7,2 | T2 | (131,0, 12,4) | 0° · Tý / Ngọ |
| INT-HT-NHA-25 | Phố phụ | (−84, 52) | π | 10,4 × 7,0 | T1 | (−84,0, 48,5) | 0° · Tý / Ngọ |
| INT-HT-NHA-26 | Phố phụ | (84, 52) | π | 10,6 × 7,1 | T2 | (84,0, 48,4) | 0° · Tý / Ngọ |
| INT-HT-NHA-27 | Phố phụ | (−106, 58) | π | 10,7 × 7,2 | T2 | (−106,0, 54,4) | 0° · Tý / Ngọ |
| INT-HT-NHA-28 | Phố phụ | (106, 58) | π | 10,0 × 6,7 | T1 | (106,0, 54,6) | 0° · Tý / Ngọ |
| INT-HT-NHA-29 | Phố phụ | (−128, 64) | π | 12,5 × 8,4 | T3 | (−128,0, 59,8) | 0° · Tý / Ngọ |
| INT-HT-NHA-30 | Phố phụ | (128, 64) | π | 11,6 × 7,8 | T2 | (128,0, 60,1) | 0° · Tý / Ngọ |
| INT-HT-NHA-31 | Vành thành | (−110, −40) | 1,222 | 10,3 × 6,9 | T1 | (−106,7, −38,8) | 110° · hướng Ất / tọa Tân |
| INT-HT-NHA-32 | Vành thành | (−90, −70) | 0,910 | 9,1 × 6,1 | T1 | (−87,6, −68,1) | 128° · hướng Tốn / tọa Càn |
| INT-HT-NHA-33 | Vành thành | (110, −40) | −1,222 | 10,9 × 7,3 | T2 | (106,5, −38,7) | 250° · hướng Canh / tọa Giáp |
| INT-HT-NHA-34 | Vành thành | (90, −70) | −0,910 | 9,9 × 6,6 | T1 | (87,4, −68,0) | 232° · hướng Khôn / tọa Cấn |
| INT-HT-NHA-35 | Vành thành | (−125, 30) | 1,806 | 9,6 × 6,4 | T1 | (−121,9, 29,2) | 77° · hướng Giáp / tọa Canh |
| INT-HT-NHA-36 | Vành thành | (125, 30) | −1,806 | 10,6 × 7,1 | T2 | (121,6, 29,2) | 283° · hướng Tân / tọa Ất |

Phân bố hướng: 8 nhà Mão / Dậu, 22 nhà Tý / Ngọ, 6 nhà xiên — đủ đa dạng cho án phong thủy (Đông tứ trạch: tọa Tý, Mão, Ngọ… ; Tây tứ trạch: tọa Dậu, Càn, Cấn…).

### 3.3 Kiểu nhà

| Kiểu | Điều kiện | Sảnh (ở cỡ của nhà) | Bố trí 3 gian | Phòng phụ ngoài vỏ |
|---|---|---|---|---|
| **T1** · Nhà ba gian nhỏ | `s < 10,5` (11 nhà) | 6,8–7,8 × 3,6–4,1 m | gian giữa (khách + bàn thờ) · buồng ngủ · gian bếp – kho | — |
| **T2** · Nhà ba gian | `10,5 ≤ s < 12,0` (13 nhà, không ở đại lộ Nam) | 7,9–8,9 × 4,1–4,7 | gian giữa · buồng chủ · buồng con | bếp ngoài: **chái bếp** dựng mô-đun sát hồi trái (3,2 × 2,4 m, mái đơn) |
| **T3** · Nhà ba gian có chái | `s ≥ 12,0` (4 nhà, không ở đại lộ) | ≥ 9,0 × 4,7 | gian giữa · buồng chủ · buồng con | chái bếp + **chái nghề** sát hồi phải (xưởng theo nghề, 3,2 × 3,2) |
| **T4** · Nhà phố | 8 nhà đại lộ Nam (01–08), mọi cỡ | như T1 / T2 theo cỡ | **gian hàng** (gian giữa mở ra phố bằng cửa lùa DAN-11) · buồng · bếp | — (bếp trong) |

Chái (T2, T3) là **công trình mô-đun có ngoại thất thật** (tường DAN-03 hai mặt, mái `models.js › roof` một mái), nằm trên bệ mở rộng (`addPlatform` cùng cao 1,6) — không nằm trong vỏ Meshy. Kiểm chỗ: hai nhà liền nhau trên trục Đông–Tây cách tâm 17 m, rộng tối đa 13,1 → khe ≥ 3,9 m; chái 2,4 m (T2) hoặc 3,2 m (T3) chỉ đặt **một bên** khi khe ≥ chái + 1,2 m lối đi; không đủ thì chái quay ra sau nhà.

### 3.4 Quy tắc sinh gia đình (tất định)

| Bước | Quy tắc | Nguồn |
|---|---|---|
| 1. Hạt giống | `key = INT-HT-NHA-xx` (cố định), `r = rng(hashSeed(key))` | `npc.js › hashSeed`, `rng` |
| 2. Chủ hộ | `makeNpc(key)` (giới, năm – tháng – ngày – giờ sinh, tên, cách xưng hô) | `npc.js › makeNpc` |
| 3. Thành viên | 1 + ⌊r·4⌋ người nữa: vợ / chồng (`makeNpc(key + ':1')`, tuổi lệch ≤ 6, khác giới), con (`':2'`, `':3'`: sinh khi chủ hộ 20–40 tuổi), cha / mẹ già (`':4'`: hơn chủ hộ 22–35 tuổi) — sinh lại khi vi phạm ràng buộc, tối đa 8 lần | |
| 4. Lá số | `chart.js › analyze(...)` cho từng người, năm hiện tại | T1 «Lá số là nhân vật» |
| 5. Nghề nhà | Ngũ Duy mạnh nhất của chủ hộ (`five-dim-radar › fiveDimRadar`) → bảng nghề (08-06 §5.3); nhà phố T4 luôn có gian hàng (nghề buôn hoặc nghề thủ công bán tại chỗ) | |
| 6. Màu nhấn | Hỷ thần chủ hộ (`yong.xi`) → màu rèm, đệm, viền câu đối (bảng `huyenthanh` 08-06 §5.1) | |
| 7. Bàn thờ phụ | theo nghề: buôn → Thần Tài; thầy đồ → Văn Xương (bài vị); thợ / nấu ăn → Táo Quân (trên bếp); thư lại → không; võ → Quan Công (bài vị). Bàn thờ gia tiên luôn có | |
| 8. Vật nuôi, cây | `r` chọn 0–2 vật nuôi (mèo, chó, chim — DAN-40/42/43); cây theo `plant-fs › plantFengShui` với hành Dụng của chủ hộ | |
| 9. Câu hỏi của nhà | chủ hộ / một thành viên có một việc muốn hỏi: dùng `makeNpc(...).topic` + `question` (chuyển nhà, nghề nghiệp, hôn nhân…) | `npc.js › QUESTIONS` |
| 10. Kiểm trùng | hai nhà cạnh nhau không cùng nghề (nếu trùng thì nhà sau lấy Ngũ Duy mạnh thứ hai) | |

Kết quả lưu **không cần**: sinh lại mỗi lần nạp cho cùng kết quả. Năm đổi → tuổi đổi (đúng: dân thành cũng già đi theo năm thật).

### 3.5 Lịch sinh hoạt nhà dân

| Giờ | Người lớn | Trẻ con | Cửa (`nha_dan`) | Đèn |
|---|---|---|---|---|
| Mão | dậy, nấu cơm (khói bếp) | ngủ | khóa → mở cuối giờ | bếp sáng |
| Thìn – Tỵ | làm nghề (xưởng / gian hàng) hoặc ra chợ | chơi sân / học | mở | — |
| Ngọ | ăn trưa ở bàn | ăn | mở | bếp |
| Mùi – Thân | làm nghề | chơi | mở | — |
| Dậu | nấu cơm chiều; thắp hương gia tiên (rằm, mồng một) | về nhà | mở → khóa cuối giờ | bếp + đèn dầu |
| Tuất – Hợi | ngồi phản uống trà, chuyện | ngủ (Hợi) | khóa (gõ cửa → có người mở) | đèn dầu |
| Tý – Dần | ngủ | ngủ | khóa (gõ cửa: không ai mở, trừ nhiệm vụ) | tắt |

### 3.6 Tương tác tại nhà

| Loại | Nội dung | Nối |
|---|---|---|
| **Án mệnh tại nhà** (bắt buộc ≥ 1 án / nhà) | người có câu hỏi (bước 9) nhờ người chơi giải; sáu bước như khách ở Sơn Môn | `cases.js › buildCase(npc)`, `STEP_ORDER` |
| **Án dương trạch tại nhà** | dùng **hướng thật** của nhà (bảng §3.2): Bát trạch theo năm sinh chủ hộ và tọa của nhà; Huyền Không phi tinh theo vận hiện tại và tọa hướng; người chơi chỉ ra cung tốt / xấu trên **lưới 9 cung phủ lên sảnh thật** (chia sảnh 3 × 3) rồi đề xuất chỗ kê bàn làm việc / giường — đồ đạc **di chuyển thật** trong nhà sau khi giải đúng | `zhai › computeZhai`, `xuankong › xuankongPan`, `sanyuan-jiuyun › currentYun`, `fengshui-compass › compassReading`; dạng chấm `grid9` của `halls.js › gradeStep` |
| Uống trà với chủ nhà | tương tác nhỏ (DAN-26) | — (giờ Tuất – Hợi: thoại `BARK-*`) |
| Đọc câu đối, lịch treo | tương tác nhỏ (DAN-29, DAN-30) | `month-calendar › monthCalendar` (lịch) |
| Vuốt mèo / cho chim ăn | tương tác nhỏ | — |
| Mua hàng (nhà phố) | gian hàng theo nghề | tài liệu 11 (`SKU-*`) quyết có / không bán |

Án tại nhà **một nhà một lúc một án**, làm mới theo tuần (hạt giống `key + tuần ISO`), để 36 nhà không dồn việc.

### 3.7 Ánh sáng, âm, camera, hiệu năng

- Đèn: 1 `dendau` gian giữa, 1 `bep` gian bếp / chái; thẻ cửa sổ đêm theo lịch.
- Âm: `nha_dan` + nền sinh hoạt theo giờ (nồi, gà, trẻ con).
- Camera: BỔ DỌC (mái + tường mặt tiền mờ; nhà nhân bản dùng bản rời khi vào — 08-03 §7.5).
- Nạp: ≤ 3 nhà nội thất cùng lúc (40 m); NPC gia đình **luôn** tồn tại khi nhà trong 90 m (đi lại trong sân, đứng cửa) dù nội thất chưa nạp.


### 3.8 Phân chái cho 36 nhà (tính từ khoảng hở thật giữa các nhà)

Khoảng hở hai hồi của mỗi nhà tính theo bảng §3.2 (khoảng tâm 17 m ở dãy Đông – Tây, 22 m ở phố phụ; mặt ngoài tường Sơn Môn x ±61,4 làm biên). Mỗi chái cần **bề rộng chái + 1,2 m lối đi**; khoảng hở dùng chung giữa hai nhà được chia theo thứ tự nhà trong dãy; không đủ chỗ thì chái quay **ra sau** nhà (phía sau mọi dãy đều trống ≥ 8 m). Nhà vành thành đứng riêng — hai hồi thoáng.

| INT | Kiểu | Rộng (m) | Chái → vị trí |
|---|---|---|---|
| INT-HT-NHA-01 | T4 | 11,3 | — (nhà phố) |
| INT-HT-NHA-02 | T4 | 10,1 | — (nhà phố) |
| INT-HT-NHA-03 | T4 | 12,2 | — (nhà phố) |
| INT-HT-NHA-04 | T4 | 11,5 | — (nhà phố) |
| INT-HT-NHA-05 | T4 | 10,4 | — (nhà phố) |
| INT-HT-NHA-06 | T4 | 12,6 | — (nhà phố) |
| INT-HT-NHA-07 | T4 | 12,8 | — (nhà phố) |
| INT-HT-NHA-08 | T4 | 12,4 | — (nhà phố) |
| INT-HT-NHA-09 | T1 | 10,2 | — |
| INT-HT-NHA-10 | T2 | 10,6 | bếp 3,6 m → Đông |
| INT-HT-NHA-11 | T3 | 12,8 | bếp 3,6 m + nghề 4,4 m → cùng hồi Tây (nghề trước, bếp sau) |
| INT-HT-NHA-12 | T2 | 11,8 | bếp 3,6 m → Tây |
| INT-HT-NHA-13 | T2 | 11,5 | bếp 3,6 m → Đông |
| INT-HT-NHA-14 | T3 | 12,2 | bếp 3,6 m → Tây · nghề 4,4 m → Đông |
| INT-HT-NHA-15 | T2 | 11,3 | bếp 3,6 m → Đông |
| INT-HT-NHA-16 | T1 | 10,2 | — |
| INT-HT-NHA-17 | T1 | 10,4 | — |
| INT-HT-NHA-18 | T1 | 10,2 | — |
| INT-HT-NHA-19 | T2 | 11,3 | bếp 3,6 m → Đông |
| INT-HT-NHA-20 | T2 | 11,6 | bếp 3,6 m → Tây |
| INT-HT-NHA-21 | T3 | 13,1 | bếp 3,6 m + nghề 4,4 m → cùng hồi Tây (nghề trước, bếp sau) |
| INT-HT-NHA-22 | T1 | 10,2 | — |
| INT-HT-NHA-23 | T2 | 10,9 | bếp 3,6 m → Đông |
| INT-HT-NHA-24 | T2 | 10,8 | bếp 3,6 m → Đông |
| INT-HT-NHA-25 | T1 | 10,4 | — |
| INT-HT-NHA-26 | T2 | 10,6 | bếp 3,6 m → Tây |
| INT-HT-NHA-27 | T2 | 10,7 | bếp 3,6 m → Đông |
| INT-HT-NHA-28 | T1 | 10,0 | — |
| INT-HT-NHA-29 | T3 | 12,5 | bếp 3,6 m + nghề 4,4 m → cùng hồi Tây (nghề trước, bếp sau) |
| INT-HT-NHA-30 | T2 | 11,6 | bếp 3,6 m → Đông |
| INT-HT-NHA-31 | T1 | 10,3 | — |
| INT-HT-NHA-32 | T1 | 9,1 | — |
| INT-HT-NHA-33 | T2 | 10,9 | bếp 3,6 m → bên (thoáng) |
| INT-HT-NHA-34 | T1 | 9,9 | — |
| INT-HT-NHA-35 | T1 | 9,6 | — |
| INT-HT-NHA-36 | T2 | 10,6 | bếp 3,6 m → bên (thoáng) |

Kết quả: 13 nhà T2 đều đặt được chái bếp bên hồi; 4 nhà T3 đặt được cả hai chái bên hồi (3 nhà dồn cùng hồi Tây giáp khoảng trống lớn, nghề trước bếp sau); không chái nào phải ra sau. Bảng là đầu vào cho hàm `annex(h, side)` (08-16 §5) và cho test T-03 (khung bao chái không giao nhà bên).

---

## 4. Mặt bằng các kiểu nhà (cục bộ, ở cỡ s = 11,5; nhân tỉ lệ s / 11,5)

### 4.1 T2 — Nhà ba gian

```
 x: −4,3       −1,45        1,45        4,3           (sau, −Z)
 z −2,9 ┌──────────┬───────────┬──────────┐
        │ BUỒNG    │ [DAN-13   │ BUỒNG    │
        │ CHỦ      │  bàn thờ  │ CON      │
        │ [DAN-17  │  gia tiên]│ [DAN-17  │
        │  giường] │ [DAN-16   │  giường] │
        │ [DAN-18] │  phản]    │ [DAN-19] │
        │          │ [DAN-15   │          │
        ├─[cửa]────┤  bàn ăn]  ├────[cửa]─┤  ← DAN-05 vách ván, cửa DAN-09
        │          │           │          │
 z  1,6 └───[cửa sổ]┴──[cửa chính 1,8]──┴──[cửa sổ]┘    (trước, +Z)
                   bậc bệ 4 × 0,4 m ↓ sân trước
```

Chái bếp (ngoài vỏ, sát hồi trái): DAN-21 bếp lò, DAN-20 chạn, DAN-22 chum, DAN-23 vại. Chái **không** thông vào buồng; bếp có cửa riêng ra sân (đúng nếp nhà, và tách khoang bếp khỏi khoang ngủ cho âm / đèn).

### 4.2 T1 — Nhà ba gian nhỏ

Như T2 nhưng buồng phải thành **gian bếp – kho**: DAN-21 bếp (ống khói KT-29 xuyên mái), DAN-20 chạn, DAN-24 nong, DAN-25 quang gánh. Một buồng ngủ chung (DAN-17 × 1, DAN-16 phản dùng làm giường cho người thứ ba).

### 4.3 T3 — Nhà ba gian có chái

Như T2 + **chái nghề** sát hồi phải theo nghề (08-06 §5.3): thầy thuốc → DAN-39 giá thuốc + DAN-38 án bắt mạch; thợ mộc → DAN-33; rèn → DAN-34 (lò sáng, khói); dệt → DAN-32; thầy đồ → NHO-13 × 4 + NHO-14 (lớp học tại gia — trẻ con hàng xóm đến học giờ Thìn – Tỵ).

### 4.4 T4 — Nhà phố (đại lộ Nam)

```
 (sau)  ┌──────────┬───────────┬──────────┐
        │ BUỒNG    │ GIAN GIỮA │ GIAN BẾP │
        │          │ [bàn thờ  │ [DAN-21] │
        │ [giường] │  + Thần   │ [chạn]   │
        │          │  Tài]     │          │
        ├─[cửa]────┤ [DAN-36   ├──[cửa]───┤
        │          │ kệ hàng]  │          │
        │          │ [DAN-35   │          │
        │          │ quầy]     │          │
 (phố)  └──────────┴[DAN-11 cửa lùa 3,2 m]┴──────────┘
                  [DAN-50 biển hiệu]
```

Cửa lùa mở theo lịch `cho` (Thìn → Thân): mở = sáu tấm ván tháo xếp nghiêng bên cửa (hoạt cảnh sáng giờ Thìn, tối giờ Thân). Ngoài giờ chợ vào bằng **cửa ngách hông** (DAN-09) — gõ cửa như nhà thường.

---

## 5. INT-HT-SAP-01 … 06 — Sạp chợ đại lộ Nam (hạng D)

### 5.1 Hiện trạng và đo

- `lib_stall_timber` `fit: { width: 5,5 }` → 5,5 × 7,5 × 4,7 m; vòng lặp `for (z = 80; z <= 132; z += 22) for (sx of [-1, 1])` đặt tại `(sx·10,5, z + (sx > 0 ? 11 : 0))`, quay mặt ra đường.
- Thứ tự: SAP-01 (−10,5, 80) · SAP-02 (10,5, 91) · SAP-03 (−10,5, 102) · SAP-04 (10,5, 113) · SAP-05 (−10,5, 124) · SAP-06 (10,5, 135).
- Đo: **thân sạp đặc** 5 × 4,5 m ở mọi dải tới 8,4 m — không đứng dưới mái được, không có chỗ người bán.

### 5.2 Xung đột bố cục

Sạp (quay ±π/2) chiếm x ±(8,15…12,85), z (tâm ± 2,75). Cửa nhà đại lộ ở x ±(12,7…13,6). Bài phường (`lib_paifang` 26 m tại z 104) có **đế đặc** x −10…10, z ≈ 95…112.

| Sạp | Khung z | Xung đột | Mức |
|---|---|---|---|
| SAP-01 (−10,5, 80) | 77,25…82,75 | sát khoảng trước cửa NHA-01 (cửa z 84, khoảng trước cửa z 82,8…85,2) | sát (0,05 m) |
| SAP-02 (10,5, 91) | 88,25…93,75 | — | ổn |
| SAP-03 (−10,5, 102) | 99,25…104,75 | **chắn thẳng cửa NHA-03** (z 101) **và chồng đế bài phường** (x −10…−8,15) | **nặng** |
| SAP-04 (10,5, 113) | 110,25…115,75 | **chồng đế bài phường** (z 110,25…112) | **nặng** |
| SAP-05 (−10,5, 124) | 121,25…126,75 | — (cửa NHA-05 z 118) | ổn |
| SAP-06 (10,5, 135) | 132,25…137,75 | **chắn thẳng cửa NHA-08** (z 135) | **nặng** |

### 5.3 Bố trí mới (đề xuất)

Đặt sạp ở các khe **giữa cửa nhà**, tránh đế bài phường (z 95…112): z **79,5 · 89 · 127,5** hai bên (x ±10,5).

| Sạp mới | Tâm | Kiểm |
|---|---|---|
| SAP-01 | (−10,5, 79,5) | khung 76,75…82,25 — cách khoảng trước cửa NHA-01 0,55 m |
| SAP-02 | (10,5, 79,5) | cửa NHA-02 z 84 — cách 0,55 m |
| SAP-03 | (−10,5, 89) | 86,25…91,75 — giữa cửa 84 và 101; cách đế bài phường (z 95) 3,25 m |
| SAP-04 | (10,5, 89) | như trên |
| SAP-05 | (−10,5, 127,5) | 124,75…130,25 — giữa cửa 118 và 135 |
| SAP-06 | (10,5, 127,5) | như trên |

Mã thay: thay vòng lặp bằng mảng vị trí cố định trong `landmarks.js` (chưa có — cần làm). Cột đèn (x ±6,5, mỗi 12 m từ z 74) không chạm sạp (sạp bắt đầu x ±8,15).

### 5.4 Thật hóa thân sạp (V3)

- Cắt bỏ **nửa sau thân sạp** (phía vách nhà), giữ quầy trước cao 1,0 m và mái; người bán đứng sau quầy (khoảng 1,6 × 4 m).
- Người chơi đứng **dưới mái hiên** trước quầy: `roofZone` (08-03 §8.5); va chạm chỉ còn quầy (H) + 4 cột (T 0,15).
- Nếu cắt không đẹp (thân sạp là khối chạm liền): bỏ vỏ Meshy phần thân, dựng quầy bằng DAN-35 + DAN-36, giữ mái Meshy (08-02 §5.7).

### 5.5 Hàng của từng sạp

| Sạp | Hàng | Người bán | Tương tác | Nối |
|---|---|---|---|---|
| SAP-01 | Trà và trà cụ | bà bán trà | «Thử trà hợp mệnh» (gợi ý trà theo hành Dụng) | `tea-therapy › teaTherapy` |
| SAP-02 | Hương liệu, trầm | ông hàng hương | «Ngửi trầm» | `aroma-fs.js` |
| SAP-03 | Cây cảnh, hạt giống | cô bán cây | «Hỏi cây hợp nhà» | `plant-fs › plantFengShui` |
| SAP-04 | Sách cũ, tranh, giấy bút | ông đồ | «Lật sách cũ» | `library-data › LIBRARY` (bản ngắn) |
| SAP-05 | Đèn lồng, đèn hoa đăng, giấy | thợ đèn | «Xem đèn lễ» | `EV-*` (tài liệu 10) |
| SAP-06 | **Quầy «đổi mệnh» của Định Mệnh Hội** | người của Định Mệnh Hội (`dinh_menh_hoi`) | «Nghe họ chào mời» → người chơi **vạch mánh lừa** (nhận diện dấu hiệu thao túng) | `anti-manipulation-data`; tuyến phản diện (tài liệu 03); không bán gì thật — luật «không bán cải mệnh» |

Lịch: `cho` (Thìn → Thân); ngoài giờ sạp phủ bạt (đạo cụ đổi trạng thái), quầy Định Mệnh Hội **vẫn sáng đèn ban đêm** (chi tiết kể chuyện).

**≈ 6 ngày** (dời 6 sạp 0,5 · cắt thân 2 · quầy / người bán / hàng 2,5 · test 1).

---

## 6. INT-HT-PAIFANG — Bài phường đại lộ Nam (hạng D)

| Thông số | Giá trị |
|---|---|
| Đặt | `lib_paifang` `fit: { width: 26 }, at: (0, 0, 104), ry: 0`, khoét `corridor(0, 104, 0, 4)` (lối 8 m) |
| Kích thước | 26 × 11,4 × 17,2 |
| Đo | **đế đặc** 20 × 17 m (x −10…10, z 95…112) dải 0,4–2 → người chơi chỉ qua được khe 8 m, hai khối đế 6 × 17 m chặn hai bên đại lộ |
| Vấn đề | khối đế dày 17 m là bậc thềm / sân đá của bài phường (mô hình có nền rộng). Hiện bị coi như **tường** — «chặn vô lý» theo luật D |
| Sửa | thay va chạm cắt lát phần đế bằng **nền đi được**: `addPlatform` cho mặt đế (đo cao mặt đế bằng tia; dự kiến 0,4–0,8 m) + bậc ở 4 mặt; chỉ **4 trụ đá chính** và **2 sư tử đá** (nếu có trong mô hình) là vật chặn (cắt lát dải 0,8–2,4 m trên mặt đế) |
| Tương tác nhỏ | đọc **hoành phi** và **hai cặp câu đối** trên bài phường (chữ do tài liệu 02 / 12 cấp, `LB__` chạm đọc) |
| Ước lượng | 1,5 ngày |

---

## 7. INT-HT-VANPHONG — Văn Phong Tháp (hạng B)

### 7.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_pagoda_red` `fit: { height: 46 }` tại (112, 0, −96), ry 0 |
| Kích thước | 46,2 × 46 × 39,7 → x 88,9…135,1, z −115,85…−76,15 |
| Lòng đo được | đế đặc với túi rỗng (0,4–2); **lòng đế** 14 × 11 ở 2–6,8 m; **sân đế** có lan can 33 × 28 ở 6,8–10; túi 17,5 × 17 ở 12–14; **tầng tháp** 25 × 22 ở 14–18; 12 × 10,5 ở 18–20; tầng trên nhỏ dần (đo lại tới 46 m) |
| Vì sao «Văn Phong» | tháp văn phong (文峰塔) là tháp phong thủy dựng ở phương Cấn (Đông Bắc) để «vượng văn» cho cả thành — tháp ở đúng góc Đông Bắc thành (112, −96): hợp lý và là bài học phong thủy cho người chơi |

### 7.2 Khoang

| Khoang | Tên | Cao độ | Kích thước | Camera |
|---|---|---|---|---|
| `vp.de` | Điện trong đế | sàn 2,4 → trần 6,6 | 14 × 11 | TRONG |
| `vp.san` | Sân đế (ngoài trời, lan can) | 6,8 | 33 × 28 | ngoài trời |
| `vp.l1` | Tầng tháp 1 | 14,2 → 17,8 | 25 × 22 | TRONG |
| `vp.l2` | Tầng tháp 2 | 18,2 → 20,8 | 12 × 10,5 | BỔ DỌC |
| `vp.l3+` | Các tầng trên | đo lại | tầng nào lòng ≥ 3,2 × 3,2 thì đi được; nhỏ hơn: tháp đặc có khám | BỔ DỌC |

Lối: cửa đế mặt Nam (cắt) + 6 bậc lên sàn 2,4; thang trong đế lên sân đế (6,8); thang xoắn trong lõi tháp từ sân đế lên các tầng (MOD-KT-17, thang dùng chung với tháp Sơn Môn).

### 7.3 Trạm

| Id | Khoang | Tên | Nối |
|---|---|---|---|
| `vp_cuutinh` | `vp.de` | Bảng Cửu Tinh · «Sao năm nay ở phương Cấn» | `xuankong › yearFlyingStar` + `sanyuan-jiuyun › currentYun` |
| `vp_laban` | `vp.san` | La bàn đá trên sân đế · «Đo hướng các cửa thành» | `fengshui-compass › compassReading` (đo tọa hướng thành môn, Sơn Môn, chính mình đứng) |
| `vp_vanxuong` | `vp.l1` | Đèn Văn Xương · «Thắp đèn cầu học» | việc thiện «khích lệ học» ghi Sổ Công Quá (`remedy-fate › CONG_QUA`); không hứa đỗ đạt (trụ cột T2) |
| `vp_vong` | tầng cao nhất đi được | Điểm ngắm · «Nhìn thế thành» | tương tác nhỏ + thoại tháp chủ về «long mạch» Huyền Thành (lore) |

NPC: **tháp chủ** (thầy phong thủy già, NPC phụ) Thìn → Thân ở sân đế. Đèn: đế 4 `dendau`, tầng 1 đèn Văn Xương (`nen` lớn) + 2 `denlong`. **≈ 9 ngày.**

---

## 8. INT-HT-DUPHUONG — Du Phương Lâu (hạng B)

### 8.1 Vỏ

| Thông số | Giá trị |
|---|---|
| Mô hình | `lib_pavilion2` `fit: { width: 24 }` tại (−112, 0, −96), ry 0 |
| Kích thước | 24 × 26,8 × 26,6 → x −124…−100, z −109,3…−82,7 |
| Lòng đo được | trệt 21 × 21 (gồm hiên có lan can) ở 0,4–2; **sảnh** 13 × 12,5 ở 2–8,4; **lầu** 17 × 17,5 ở 8,4–10; **gác** 11–12 × 11,5 ở 14–16 |
| Công năng | **Nhà trọ du phương** (tài liệu tổng §7.12: «nhà trọ du phương để ghép đội») |

### 8.2 Khoang và mặt bằng

| Khoang | Tên | Cao độ | Kích thước | Camera |
|---|---|---|---|---|
| `dp.hien` | Hiên vòng (ngoài trời có mái) | 0,6 | vành 21 × 21 | ngoài trời |
| `dp.l0` | Sảnh trọ | 0,6 → 8,0 | 13 × 12,5 | TRONG |
| `dp.l1.*` | Lầu: 6 phòng trọ quanh hành lang giữa | 8,6 → 13,4 | 17 × 17,5 (phòng 4,2 × 4,0) | BỔ DỌC |
| `dp.l2` | Gác Du Phương | 14,2 → 16,6 | 11,5 × 11,5 | BỔ DỌC |

```
 LẦU (y 8,6) — 17 × 17,5
 ┌──────┬──────┬──────┐
 │ Phòng│ Phòng│ Phòng│   phòng trọ: DAN-17 giường, DAN-19 rương, DAN-27 đèn, cửa sổ
 │  1   │  2   │  3   │
 ├──[ ]─┴──[ ]─┴──[ ]─┤
 │   hành lang giữa   │ ▲ thang lên gác (KT-15)
 │   [bàn trà chung]  │ ▼ thang xuống sảnh
 ├──[ ]─┬──[ ]─┬──[ ]─┤
 │ Phòng│ Phòng│ Phòng│
 │  4   │  5   │  6   │
 └──────┴──────┴──────┘
```

### 8.3 Trạm (nối tính năng MMO đang có)

| Id | Khoang | Tên | Nối |
|---|---|---|---|
| `dp_quay` | `dp.l0` | Quầy chưởng quỹ · «Thuê phòng — đổi phòng (kênh)» | phòng máy chủ: `protocol.js › ROOM_CAP` 60 người / `MAX_ROOMS` 50 phòng (`net.room`) — chọn «phòng trọ» số nào = chuyển sang shard đó |
| `dp_ghepdoi` | `dp.l0` | Bảng ghép đội · «Rủ người cùng giải án» | gói `inv`, `inv_ok`, `coop_start` (giải án chung tối đa `COOP_MAX` 4 người) đang có |
| `dp_nghi` | `dp.l1.*` (phòng 1–6) | Giường trọ · «Nghỉ chân» | lưu điểm hồi sinh (`s.int.last`, 08-04 §5.1) |
| `dp_gac` | `dp.l2` | Gác Du Phương · «Đọc thư du phương» | bảng tin người chơi để lại (câu chọn sẵn `PHRASES`, không gõ tự do — giữ chuẩn an toàn MMO hiện có) |

NPC: chưởng quỹ (Mão → Hợi), tiểu nhị (Thìn → Tuất, bưng trà), 2–3 khách du phương NPC (khi phòng ít người thật). Đèn: sảnh 6 `denlong`, mỗi phòng 1 `dendau`. Âm: `lau_go` + tiếng chuyện trò khẽ (`cho_xa` gain 0,02). **≈ 10 ngày.**

---

## 9. INT-HT-TUONGTHANH — Tường thành tròn (hạng E)

| Thông số | Giá trị |
|---|---|
| Hình | `wallRing`: 64 đoạn, bán kính 158, cao 14, dày 5, nắp 1,4; răng cưa (merlon) mỗi đoạn chẵn; chừa cổng Nam (`sin(am) > 0,985`) |
| Va chạm | mỗi đoạn `addBlock(cx, cz, 3,4)` (vòng tròn) — đạt E |
| Lời hứa | răng cưa gợi «có đường tuần trên thành»; không có thang nhìn thấy từ dưới → lời hứa yếu. Đề xuất (tùy chọn): nối mặt thành đài thành môn (y 20,4) xuống mặt tường (y 14,4) bằng hai đợt thang trong thành lâu, mở **đường tuần trên thành** dài ~990 m (`addPlatform` từng đoạn, lan can = răng cưa) — người chơi đi một vòng thành ngắm toàn cảnh (ghi câu hỏi mở) |
| Việc tối thiểu | không (đạt E) |

---

## 10. INT-HT-TRAMXE — Trạm xe kiệu ngoài cửa thành (hạng D)

`lib_cart` (rộng 4,2) + `lib_horse` (cao 2,2) tại (10, —, 180) và (10, —, 184,5). Thêm: biển trạm (MOD-NHO-34), người đánh xe (NPC phụ, Mão → Dậu), tương tác «Lên xe» = mở bảng đi nhanh (cùng trạm `tm_tram` trong thành môn). Va chạm: xe và ngựa cắt lát (đang có). **0,5 ngày.**

---

## 11. Tổng hợp Huyền Thành

| Hạng mục | Ngày người |
|---|---|
| Thành môn | 15 |
| Vỏ nhà khoét chung + 4 công thức kiểu nhà + chái mô-đun | 9 |
| Bộ sinh gia đình (quy tắc §3.4, lịch §3.5) | 6 |
| Án tại nhà (mệnh + dương trạch theo hướng thật, lưới 9 cung trên sảnh thật) | 8 |
| Bản rời nhà nhân bản khi vào (08-03 §7.5) | 3 |
| Sạp chợ (dời + cắt + hàng) | 6 |
| Bài phường | 1,5 |
| Văn Phong Tháp | 9 |
| Du Phương Lâu | 10 |
| Trạm xe | 0,5 |
| Test 36 nhà + art | 4 |
| **Cộng** | **≈ 72 ngày người** |
