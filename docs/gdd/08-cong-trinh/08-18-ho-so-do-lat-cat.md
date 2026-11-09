# 08-18 · Hồ sơ đo lát cắt các vỏ đang dùng

> Bản đồ lát cắt thật, sinh bằng **nguyên mẫu `bld-void`** (thuật toán 08-02 §5.2, dùng đúng phép cắt lát của `collide.js`) chạy trên GLB trong `public/models` ngày 2026-11-05, ở **đúng tỉ lệ đặt trong game**. Đây là đầu vào của mọi mặt bằng ở 08-07 … 08-11; khi `scripts/bld-void.mjs` chính thức có, chạy lại và thay phần này.
>
> **Đọc bản đồ**: `#` ô đặc (có mặt vỏ trong dải cao đó) · `.` ô trống thông ra ngoài · `o` ô trống **bị bao kín** (lòng nhà). Hàng trên cùng = **phía sau** (−Z cục bộ), hàng dưới = **mặt tiền** (+Z cục bộ), cột trái = −X. Mỗi ký tự = 1 m (vỏ nhỏ) hoặc 2 m (vỏ lớn) — ghi ở đầu mỗi bản. Dải cao tính từ **đáy vỏ**. Đã cắt bớt hàng / cột trống ở mép.
>
> **Lưu ý cách hiểu**: mặt **nằm ngang** rơi vào dải (sàn, trần, mặt bệ, mặt mái thoải) được tô kín như vật đặc — nên «đặc» không luôn nghĩa là khối đặc; có thể là một mặt sàn / mái. Kết luận mỗi bản ghi ngay dưới.

---

## 1. `hall_main` · fit width 22 — Điện phụ Sơn Môn (và tỉ lệ 0,927 cho Hậu Sơn, 1,159 cho Manh Cốc)

**Dải 0,4–2,0 m** (1 ký tự = 1 m; lòng kín 83 m², khung x −9…8,5, z −6,1…0,9)

```
####################
#ooooooooooooooo#oo#
#ooooooooooooooo####
#ooooooooooooooo####
#oo#oooooooooooo####
####oooooooooooo####
#######ooooooooo####
########oo##oooo####
####################
####################
####################
  ##############
      ##########
       #
      ####
      ####            ← bậc trước mặt tiền
      ####
```

**Dải 10–12 m** (lòng kín 67 m², khung x −7,5…7,5, z −4,6…3,4)

```
  ###           ###
  ################
#.###################
#####################
###oooo######ooooo###
###ooooooooooooooo###
###ooooooooooooooo###
###ooooooooooooooo###
###ooooo####oooooo###
#####################
#################o###
#.###################
   #####.....######
  ##            ##
```

**Kết luận**: sảnh kín ~17,5 × 7 m (mép phải có góc đặc — trụ góc / hồi dày hơn); dải trước sảnh (z 1…4,5) là **hiên + bệ** (tô kín vì mặt bệ nằm ngang trong dải); bậc mặt tiền lệch trái tâm 2 m (khi khoét cửa giữa phải **làm lại bậc thẳng tâm** — đã ghi vào công thức `HM22.door` x 0). Gác ở dải 10–12 m 15 × 8 m, có hai «cột» đặc ở giữa (trụ chống mái tầng trên) → gác chia hai nửa nối nhau qua lối 1,5 m quanh trụ — cập nhật bố trí 10 / 12 cửa sổ hai gác (08-16) để không đặt bàn đọc vào vị trí trụ (x −0,5…1,5 cục bộ).

---

## 2. `lib_pavilion2` · fit width 12 — Lầu chuông / lầu trống

**Dải 0,4–2,0 m** (1 m; lòng 36 m²)

```
    #   #
############
############
############
###oooooo###
###oooooo###
###oooooo###
###oooooo###
###oooooo###
###oooooo###
############
############
############
```

**Dải 3,6–5,2 m** (lòng 41 m² — lan can hành lang lầu)

```
 ##########
 ##########
 ##oooooo##
 ##oooooo##
  ooooooo##       ← khe hở lan can mặt Tây (cục bộ −X): miệng thang ngoài?
 #ooooooo##
 #ooooooo##
 #ooooooo##
 #o########
 ##########
```

**Dải 5,2–6,8 m** (lòng 11 m² — phòng chuông chỉ còn rãnh trống, phần lớn đặc)

```
############
############
############
####ooooo###
########o###
########o###
########o###
####o###o###
############
############
```

**Kết luận**: tầng trệt kín 6 × 6 m, tường dày ~3 m mỗi bên (thân lầu xây đặc — đúng kiểu lầu chuông đế gạch); tầng lầu là sàn có lan can; **phòng lầu ở 5,2–6,8 m gần như đặc** → «phòng chuông» thực chất là **khung mở có mái** (đặc do mái lầu thấp và khung treo chạm). Hệ quả: phòng chuông dựng như **đình mở trên lầu** (khoang `lc.l1.chuong` để camera BỔ DỌC, cửa nhìn bốn phía kiểu `lattice` / `open` — đúng như 08-16 §4); khe hở lan can mặt Tây ở dải 3,6–5,2 là vị trí tự nhiên của **thang ngoài**: cân nhắc chuyển thang lầu chuông ra ngoài thân (thang gỗ dựa tường Tây, rộng 1,2) thay vì thang trong phòng trệt 6 × 6 (gỡ ngoại lệ rộng 1,0 m ở 08-16 §4).

---

## 3. `lib_pagoda5` · fit height 26 — Bảo tháp Bắc Sơn Môn (× 2 cho Ngũ Tinh Tháp)

**Dải 0,4–2,0 m** (1 m; lòng 52 m², có trụ tâm)

```
    #
    ###.#
    #ooo##
   #ooooo##
#.#oooo#oo###
 #oooo##ooo#
 #oo#ooo#oo#
 #oo##oo##o#
 #oooo##oo##
#.#ooooooo###
   ##oooo##
    ######
    #....#
```

**Dải 8,4–10 m** (lòng 41 m² — phòng tầng 2)

```
     ###.#
  #
 #..#......#
#....####...#
    #ooo##
 #.#ooooo##.#
  #ooooooo#
#..#ooooooo#
#..#ooooooo#
#..##oooooo##..#
#...##oooo##.##
    ##oo##
 #...#..#...#
```

**Dải 17,6–19,2 m** (lòng 13 m² — phòng đỉnh)

```
    ##..##
   ########
  #########
 ############
##############
#####ooo#####
 ####oooo####
 ####oooo####
#####ooo#####
##############
 ############
   ########
   #######
    #...##
```

**Kết luận**: thân tháp **bát giác**; tầng trệt có **trụ tâm và vách chữ thập** (các `#` giữa lòng) — thang xoắn quanh trụ phải né vách chữ thập: hoặc dọn vách (08-02 §5.4), hoặc đổi sang thang **chạy vòng dọc tường bát giác** (bán kính 3,2–4,4 m) — đề xuất dọn vách vì vách chỉ là mặt trong rác (V4). Tầng 2 có hành lang ngoài (các `#` rời ở mép = lan can và cột hiên). Phòng đỉnh 4 × 4 m xác nhận **đủ chỗ** cho chuông gió và một người đứng.

---

## 4. `gate_sect` · fit width 30 — Sơn Môn

**Dải 0,4–2,0 m** (1 m; lòng 83 m²)

```
          ##      ##
         ###      ####
 #######oooo#     #ooo####.###
#ooooooooooo#     #oooooo#ooo#
#ooooooooooo#     #oooooooooo#
#ooooooooooo#     #oooooooooo#
########oooo#     #ooo########
 ###.######o      ########.###
          ##      ##
           #      ##
```

**Dải 8,4–10 m** (lòng 42 m² — lầu cổng)

```
          #         #
      ##  ###########.##
       #################
       ################
       ##oooooooooooo##
       ##oooooooooooo##
       ##oooooooooooo##
       ################
       #################
      ###.##############
          ##      ###
```

**Kết luận**: lối giữa thông rộng ~5 m (cột trống ở giữa bản đồ dải thấp); hai phòng gác kín **không đối xứng tuyệt đối** (phòng Đông có vách ngăn trong, phòng Tây liền) → phòng Đông chia hai: phòng khách thập phương (trước) + kho nhỏ (sau, có thể làm khoang khóa «kho lão Tùng» — dưới 20 % diện tích). Lầu cổng 12 × 3 m kín bốn mặt — **cần khoét** ô cửa ra hai hiên (trước / sau) khi làm 08-08 §3.

---

## 5. `lib_courtyard` · fit width 11,5 — Nhà vườn Huyền Thành

**Dải 0,4–2,0 m** (1 m)

```
############
############
############
############
############
############
############
###########
```

**Dải 2,0–3,6 m** (lòng 38 m²)

```
############
##oooooooo##
##oooooooo##
##oooooooo##
##oooooooo##
 #ooooo#oo#
###########
###########
```

**Kết luận**: bệ **đặc hoàn toàn** ở dải thấp (mặt bệ nằm ngang ở ~1,6 m tô kín cả nền) — xác nhận «nhà trên bệ», sàn nhà ~1,6 m; lòng nhà một khối 8,6 × 4,5 m có **một vách ngăn** ở gần mép trước bên phải (cột 8 hàng 6) — vách gian; hàng dưới cùng đặc dày 2 m = **hiên trước có mái thấp + bậc** (mặt hiên ngang). Bố cục 3 gian ở 08-09 §4 khớp: vách gian tự nhiên của vỏ nằm ở x ≈ +1,7 (gần ranh gian giữa / gian phải ở 1,45 — lệch 0,25 m, chấp nhận; lớp lót che).

---

## 6. `cliff_palace` · fit width 55,2 — Chính Điện Tam Thanh, Hậu Sơn

**Dải 0,4–2,0 m** (2 m mỗi ký tự; lòng 476 m², khung x −26,1…26,9, z −7…7)

```
##########################
 ooooooooooooooooooooooooo#
#oooooooooooooooooooooooooo
#ooooooooooooooooooooooooo#
#oooooooooooooooooooooo#o#
##.#o####o##oooo##oooo..o#
...############...##
......###..#
```

**Dải 4,4–6,0 m** (lòng 172 m²)

```
##########################
 ###ooooo##########oo#####
 ###oooooo####oooo######o##
 ####ooooo####oooo########
 #####oooo##o##oo########
     ####o##..#####o#...#
                 ###
```

**Dải 8,6–10,4 m** (lòng 123 m²)

```
 ######################
    ooooo###########o
 ##.oooooo####oooo###
 ##...#ooo####oooo#
      ####..o########
      #####........###
         #
```

**Kết luận**: sảnh trệt **liền một khối** 52 × 13 m — đúng cho chính điện dài. Từ 4,4 m trở lên, lòng **chia ngăn**: các ô trống ở x ≈ −22…−12 và −2…+6 (đơn vị cục bộ), còn lại là mặt vỏ (mái tầng dưới, sàn tầng trên). Hệ quả cho 08-10 §1.3: **thông tầng 9 m ở gian giữa không có sẵn** — phải dọn lòng hoặc dùng phương án dự phòng trần 4,2 m (đã ghi cảnh báo trong 08-10). Hai «túi» trống ở 8,6–10,4 m trùng vị trí **gác hai cánh** đề xuất — dùng làm Gác Bát Quái (túi Tây) và Gác Công Quá (túi giữa – Đông), đổi tên khoang theo vị trí đo khi chạy bản chính thức.

---

## 7. `lib_pavilion2` · fit width 24 — Du Phương Lâu

**Dải 0,4–2,0 m** (2 m; lòng 424 m²)

```
   #   #
   #####
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
ooooooooooo
###########
   #####
```

**Dải 2,0–3,6 m** (lòng 163 m²)

```
###########
###########
##ooooooo##
##ooooooo##
##ooooooo##
##ooooooo##
##ooooooo##
##ooooooo##
###########
###########
####...####
```

**Dải 8,4–10 m** (lòng 215 m²)

```
##########
 o##o####o
 ooooooo#o
 ooooooo#o
 ooooooo#o
 ooooooo#o
 ooooooooo
 ooooooo#o
 o##o####o
##########
```

**Kết luận**: ở 24 m, vành ngoài trệt (21 × 21) là **hiên có lan can** quanh sảnh kín 13 × 12,5; tầng lầu 17 × 17,5 có **một vách dọc** (cột `#` thứ 8) — chia lầu thành dãy phòng lớn + hành lang ngoài một bên: hợp với **6 phòng trọ** xếp 2 dãy (08-09 §8.2) nếu đặt hành lang giữa trùng vách đo được (dời hành lang lệch Đông 2 m so với bản vẽ cũ). Cửa trệt mặt tiền đã có sẵn khe 3 ô (`....` ở hàng dưới dải 2,0–3,6) → **khoét theo đúng khe đó**.

---

## 8. `tea_pavilion` · fit width 34 — Trà lâu Cùng Thông

**Dải 3,6–5,2 m** (2 m; lòng 352 m²)

```
   ######
  #oooooo
  ooooooo#
 #oooooooo#
#oooooooooo
oooooooooooo
oooooooooooo#
#oooooooooo#
 #oooooooo#
  oooooooo
  #oooooo#
   ######
```

**Dải 8,4–10 m** (lòng 312 m²)

```
    ########
    ########
   ##ooooo###
  ###oooooo##
  ##oooooooo##
 ##ooooooooo###
###oooooooooo###
###oooooooooo###
 ##ooooooooo###
 ###oooooooo##
  ##ooooooo###
   ##oooooo##
   #########
    ########
```

**Kết luận**: mặt bằng **bát giác** (hai dải đều hình tám cạnh) — trà lâu là lầu bát giác trên cột, không phải hình chữ nhật như bản vẽ mặt bằng ở 08-11 §1.2. Sửa: sàn trà bát giác cạnh ~10 m, bàn trà xếp **vòng quanh** lò / chậu ở tâm (6 bàn ở 6 cạnh hướng hồ, 2 cạnh hướng bờ là bậc lên và thang); lầu trên bát giác 23 m, vách kín có nhiều ô cửa sổ (đo lại ở khoét). Khoang vẫn là hộp bao (08-03 §2.2) nhưng lớp lót dò theo biên bát giác (thuật toán dò biên 08-02 §5.6 xử lý được — biên bậc thang 45° làm thẳng thành cạnh xiên).

---

## 9. `lib_garden_pav` · fit width 16 — Thủy tạ Điều Hậu

**Dải 2,0–3,6 m** (1 m; lòng 94 m²)

```
   ######
  #oooooo#
 #oooooooo#
#oooooooooo#
#ooooooooooo
#ooooooooooo
#ooooooooooo
#ooooooooooo
#oooooooooo#
 #oooooooo#
  #ooooooo#
   #######
```

**Kết luận**: cũng **bát giác** (đình tròn tám mái), đường kính lòng ~11 m; mép phải hở ở hàng 5–8 (`o` chạm mép) = lối vào có bậc phía mặt nước. Bốn bình phong bốn mùa (08-11 §1.3) đặt ở **bốn cạnh chéo**, lò than – chậu nước ở tâm, lối vào giữ thông.

---

## 10. Bảng tổng hợp thay đổi do đo

| Phần | Giả định trước | Kết quả đo | Sửa |
|---|---|---|---|
| 08-07 §3 / §4 (điện phụ) | bậc mặt tiền ở tâm | bậc lệch trái 2 m | dựng lại bậc thẳng tâm cửa khoét |
| 08-16 §2 / §3 (gác điện phụ) | gác liền 15 × 8 | có 2 trụ giữa | không đặt bàn ở x_cb −0,5…1,5 |
| 08-07 §5 (lầu chuông) | phòng chuông kín 5 × 5 | phòng chuông là khung mở có mái | khoang mở, cửa nhìn `lattice` / `open`; xét thang ngoài tường Tây |
| 08-08 §1 (tháp Bắc) | trệt trống quanh trụ | có vách chữ thập (rác) | dọn vách trước khi dựng thang xoắn |
| 08-08 §3 (Sơn Môn) | hai phòng gác đối xứng | phòng Đông có vách | chia phòng Đông: khách + kho |
| 08-10 §1.3 (Tam Thanh) | thông tầng 9 m | mặt vỏ cắt ngang ở 4,4–6 m | dọn lòng hoặc trần 4,2 m (dự phòng) |
| 08-09 §8 (Du Phương Lâu) | hành lang lầu ở giữa | vách dọc lệch Đông | dời hành lang theo vách |
| 08-11 §1.2 (trà lâu) | sàn chữ nhật | bát giác | bàn xếp vòng |
| 08-11 §1.3 (thủy tạ) | phòng chữ nhật | bát giác | bình phong ở cạnh chéo |
