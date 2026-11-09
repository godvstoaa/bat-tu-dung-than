# 07-13 · HUYỀN THÀNH + HUYỀN QUÁN SƠN MÔN — CHƯƠNG MỞ RỘNG (`thanh`)

> **Tâm vùng** (0, 0) · **Vai trò** trung tâm (hub), nơi bắt đầu và kết thúc mọi vòng chơi · **NPC chính** `thay_tubinh`, `gac_cong` (Lão Tùng), `tho_may` (Bà Tư), `khong_tiensinh` (bậc Sơn Môn), `van_coc` (đêm Nghịch Thiên) · **Mốc** M1 (thật hóa nội thất), M2 (công trình mới) · **Bản sơ đồ tổng** §7.12, §8.4.
>
> Khác các phần khác: vùng này **đã có trong code**. Mọi tọa độ, mã model dưới đây đọc từ `court.js`, `sect.js`, `landmarks.js`, `world.js`, `render3d.js` (bản hiện tại). Chương này làm ba việc: (1) **thật hóa** mọi công trình đang có thành «đi vào được, có nội thất, có tương tác» (§8 bản sơ đồ tổng); (2) thêm các công trình mới của §7.12; (3) nối Huyền Thành với 12 thánh địa.

---

## 1. Nghiên cứu nguyên mẫu

### 1.1 Huyền Thành là hư cấu — ba nguồn tham chiếu

| Nguồn | Lấy gì | Đã / sẽ dùng ở |
|---|---|---|
| **Thư viện cổ** (học quán) kiểu Nhạc Lộc thư viện 嶽麓書院: cổng → giảng đường → ngự thư lâu (lầu tàng sách) trên một trục, hai bên trai xá | Sơn Môn là **học quán** dạy Tử Bình, không phải chùa hay đạo quán: trục «cổng → sân học → bàn thầy → Chính Đường (tầng 2 tàng kinh)» | Chính Đường, Bàn Thầy, Thiên Bảng |
| **Cung quán phương Bắc**: sân lát đá, nền đá hai tầng có lan can, ngự đạo chạm rồng giữa bậc, lầu chuông Đông – lầu trống Tây («thần chung mộ cổ» — chuông sớm trống chiều), bảo tháp góc | khung không gian của Sơn Môn (đã dựng ở `sect.js`) | nền L1 / L2, lầu chuông – trống, bảo tháp |
| **Phố cổ có chợ dọc trục Nam** (Hội An, Bình Dao): nhà mặt phố hẹp, chợ hai bên, cổng chào giữa phố, cửa thành có lầu | đại lộ Nam từ Sơn Môn ra cửa thành (đã dựng ở `landmarks.js`) | đại lộ, nhà dân, nhà trọ |

### 1.2 Bảng phong cách hiện hành (đọc từ code)

- `manifest.json › style`: «Stylized East Asian xianxia fantasy, **Vietnamese lacquer-art palette**: cinnabar red, black lacquer, gold-leaf trim, eggshell white, jade teal accents». Huyền Thành là **vùng duy nhất** dùng phong cách sơn mài này làm chuẩn — đây là «màu nhà» của game; các thánh địa khác đều lệch khỏi nó có chủ đích.
- `sect.js › mats()`: tường bao son (`lacquerTex('#9b2a1f')`), sân đá `#8f877a`, gờ vàng `#d4a63c` (kim loại), đá tối `#2b2622`, cẩm thạch lan can `#cbc3b2`, đèn đá ấm `#ffd9a0`.
- `landmarks.js`: tường thành tròn bán kính **158 m**, thân đá, mũ `#3a2a26`; cửa Nam ở (0, 158) model `city_gate`.

### 1.3 Trục và lớp không gian (hiện trạng)

```
Cửa thành Nam (0,158) → đại lộ chợ (z 80–150, cổng chào z 104) → Sơn Môn (z 67)
→ sân lớn: hồ sen đôi (z 50), Đại Đỉnh (z 27,5), Lư Hương (z 34), cánh Tây / Đông
→ bậc lên nền L1 (z 8, cao 2 m): lầu chuông / trống, điện phụ
→ bậc lên nền L2 (z −6, cao 4 m): Bàn Thầy (z −11) trước Chính Đường (z −31)
→ Hậu Môn (z −67) → Hậu Sơn (z −116, cliff_palace = Chính Điện Tam Thanh)
```

---

## 2. Thông số khóa

### 2.1 Bảng màu khóa (rút từ code — `sect.js › mats()`)

| Mã | Tên | Nguồn code | Dùng ở |
|---|---|---|---|
| `#9B2A1F` | son tường | `plaster` (lacquerTex) | tường bao, cột, cửa (≥ 25%) |
| `#8F877A` | đá sân | `pave` | sân, đường, nền (≥ 35%) |
| `#D4A63C` | vàng thếp | `gold` | gờ, viền, đỉnh mái, đồ đồng |
| `#2B2622` | sơn đen | `dark` | khung, cột đèn, mái phụ |
| `#CBC3B2` | cẩm thạch | `marble` | lan can, bậc, đèn đá |

Ánh sáng nhấn: đèn đá / đèn lồng `#FFB050` – `#FFA04A` (đã có trong `lights.js`).

### 2.2 Bộ mái (giữ hiện trạng)

| Model | Kiểu mái | Ở đâu |
|---|---|---|
| `palace_grand` | vũ điện trùng diêm, ngói sẫm, nóc vàng | Chính Đường |
| `hall_main` | hai tầng mái cong, ngói đen | hai điện phụ |
| `gate_sect` | mái cong nhiều lớp trên bài phường | Sơn Môn, Hậu Môn |
| `city_gate` | lầu hai tầng mái cong trên cửa vòm | cửa thành Nam |
| `lib_pavilion2` | đình hai tầng | lầu chuông / trống, đình Tây Bắc |
| `lib_pagoda5`, `lib_pagoda_red` | tháp nhiều tầng mái | bảo tháp góc, tháp Đông Bắc |
| `lib_courtyard` | nhà vườn tứ hợp mái ngói | nhà dân |
| `cliff_palace` | quần thể mái cong ngói đen | Hậu Sơn |

Công trình **mới** dùng: yết sơn ngói đen viền vàng (Bát Đạo Đình là bát giác toản tiêm), nhất quán với `hall_main`.

### 2.3 Chuỗi phong cách vùng

Dùng nguyên `manifest.json › style` (không cần `style: false`). Công trình mới thêm cụm: «stone-paved courtyard, cinnabar walls, black lacquer and gold trim».

### 2.4 Địa hình

Giữ nguyên `REGIONS.thanh` (`kind: 'city'`, r 180, h 0). Thêm **lỗ tường** cho Bắc Ngách Môn ở (30, −155): bỏ một đoạn trong `wallRing` (đoạn i có góc ≈ −79°) — xem BLD-thanh-24.

---

## 3. Bản đồ vùng

### 3.1 Sơ đồ ASCII (tọa độ thế giới = cục bộ; Bắc trên; 1 ký tự ≈ 4 m, 1 dòng ≈ 8 m)

```
  z\x   -160      -120      -80       -40        0        40        80       120       160
 -260   .                                    [AM VAN COC]  (07-12)                          .
 -160   .            o  o  o  tuong thanh  o  o (24)BAC NGACH MON(30,-155) o  o              .
 -116   .   (26)Thuyet Thu Lau(-112,-96)  [(19)HAU SON cliff_palace]   (25)Van Phong Thap(112,-96)
  -96   .                                                                                   .
  -67   .    (23)nha dan          +======(18)HAU MON======+          (23)nha dan             .
  -58   .                         |(17)thap          thap(17)|                                .
  -36   .  (31)Y QUAN(-97,-16)    |(15)VAN MENH CAC  (16)THAI TUE|                            .
  -31   .                         |      (14)CHINH DUONG (L2)    |                            .
  -11   .                         |        (13)ban thay          |                            .
   -9   .  ===pho Dong-Tay===     |(11)Co Lau   [L1]  (10)Chung Lau|   ===pho Dong-Tay===     .
    2   .                         |   (12)Thien Bang  Thien Bang  |                            .
    8   .                         |(8)Hop Hon                    |                            .
   24   .                         |(4)Tra That   (3)Dai Dinh  La Ban(5)|                      .
   40   .                         |(6)Xam (7)Tang Y  Lu Huong  (6)Lich |                      .
   50   .                         |  (2)ho sen  |  |  ho sen(2)  |                            .
   58   .  (29)PHUONG TAN CU      |(17)thap                thap(17)|                          .
   67   .                         +========(1)SON MON============+                            .
  104   .     (23)nha dan   (22)cho ===(22)cong chao===  cho  (30)quay DMH (10.5,113) (23)    .
  128   .  (21)NHA TRO DU PHUONG(-60,128)        (22)cho                                     .
  158   .  o  o  o  o  o  o  o  o  (20)THANH MON NAM  o  o  o  o  o  o  o  o                 .
  182   .                                 (28)Dich tram (10,182)                              .
  196   .                              (27)BAT DAO DINH (0,196)                               .
  205   .     <== roadPath toa ra 12 thanh dia + 7 sanh nghe (vong cung R 205) ==>          .
```

Ký hiệu: `(n)` = `BLD-thanh-n`; `o` tường thành tròn r 158; khung `+===+` là tường bao Sơn Môn (x −60…60, z −66…66).

### 3.2 Phân khu

| Khu | Phạm vi | Cao độ | Công trình |
|---|---|---|---|
| K1 · Sân trước Sơn Môn | x −60…60, z 10…66 | 0 | 01–09 |
| K2 · Nền L1 | x −36…36, z −56…8 | 2 | 10, 11, 12 (+ điện phụ ở mép ngoài L1) |
| K3 · Nền L2 | x −28…28, z −50…−6 | 4 | 13, 14 |
| K4 · Hai cánh điện phụ, góc tháp | x ±40…60 | 0 | 15, 16, 17 |
| K5 · Hậu | z −66…−160 | 0 → 10 | 18, 19, 24 |
| K6 · Đại lộ Nam và phố | x −30…30, z 66…158 | 0 | 22, 30 |
| K7 · Phố Đông – Tây, phố phụ, vành Bắc | vành 66…158 | 0 | 23, 25, 26, 29, 31 |
| K8 · Ngoài cửa Nam | z 158…210 | 0 | 20, 27, 28 |
| K9 · Nhà trọ | (−60, 128) | 0 | 21 |

### 3.3 Đường (hiện có + mới)

| Đường | Mô tả | Hiện trạng |
|---|---|---|
| Thần đạo Sơn Môn | z 13 → 66, rộng 8 m, đèn đá hai bên mỗi 8 m | có (`sect.js`) |
| Bậc L1 / L2 / sau | `court.js › STAIRS` (3 bộ) | có |
| Đại lộ Nam | x ≈ 0, z 66 → 166, quầy chợ x ±10,5 | có (`landmarks.js`) |
| Phố Đông – Tây | z ≈ 0, x ±66 → ±158 | có (nhà hai bên z ±16) |
| Lối men Hậu Sơn → Bắc Ngách Môn | Hậu Môn (0, −67) → x ≈ 52 → (30, −155) | **mới** |
| Vành đai `roadPath` | cung R 205 ngoài cửa Nam | có |

---

## 4. Bảng tổng công trình

| Mã | Tên | Hạng | Tâm (x, z) | Model hiện có / mới | Lịch cửa | Trạng thái |
|---|---|---|---|---|---|---|
| BLD-thanh-01 | Sơn Môn (cổng chính + 2 phòng gác) | B | 0, 67 | `gate_sect` (rộng 30) + phòng gác mới | S4 / gác S1 | thật hóa |
| BLD-thanh-02 | Hồ Sen đôi + bến thả đèn | D | ±21, 50 | thủ tục (`MD.pond`) | S4 | giữ, thêm bến |
| BLD-thanh-03 | Đại Đỉnh + Lư Hương | D | 0, 27,5 / 0, 34 | `cauldron` + gian `huong` | S4 | giữ |
| BLD-thanh-04 | Trà Thất | B | −40, 24 | `models.js › teaPavilion` | S2 | mở rộng nội thất |
| BLD-thanh-05 | La Bàn Đài | D | 40, 22 | gian `compass` | S4 | giữ |
| BLD-thanh-06 | Ống Xăm + Bảng Lịch Ngày | D | −40, 40 / 40, 40 | gian `xam`, `lich` | S4 | giữ (xăm: web) |
| BLD-thanh-07 | Tàng Y Các | C | −22, 37 | `lib_wood_pavilion` + phòng thử mới | S3 | thật hóa |
| BLD-thanh-08 | Hợp Hôn Đình | D | −48, 8 | bàn sảnh + `lib_wood_pavilion` | S4 | nâng cấp |
| BLD-thanh-09 | Ba ghế khách hỏi việc | D | −16, 22 / 16, 22 / 26, 30 | gian `an0–2` | S4 | giữ |
| BLD-thanh-10 | Chung Lâu (lầu chuông, Đông) | B | 47, −9 | `lib_pavilion2` | S2 + giờ Mão | thật hóa |
| BLD-thanh-11 | Cổ Lâu (lầu trống, Tây) | B | −47, −9 | `lib_pavilion2` | S2 + giờ Dậu | thật hóa |
| BLD-thanh-12 | Thiên Bảng (đôi bảng đồng) | D | ±18, 2 (trên L1) | mới `thanh_thienbang` | S4 | **mới** |
| BLD-thanh-13 | Bàn Thầy Tử Bình | D | 0, −11 (y 4) | `models.js › masterDais` | S4 (thầy theo giờ) | giữ |
| BLD-thanh-14 | Chính Đường | **A** | 0, −31 (y 4) | `palace_grand` (rộng 44) | S1 | thật hóa 2 tầng |
| BLD-thanh-15 | Vận Mệnh Các (điện phụ Tây) | B | −47, −36 | `hall_main` (rộng 22) | S1 | thật hóa (đang ở `ROOMS`) |
| BLD-thanh-16 | Thái Tuế Điện (điện phụ Đông) | B | 47, −36 | `hall_main` | S1 | thật hóa (đang ở `ROOMS`) |
| BLD-thanh-17 | Bốn bảo tháp góc | D/B | ±53, −58 / ±53, 58 | `lib_pagoda5`, `lib_pagoda_red` | S4 | thật hóa |
| BLD-thanh-18 | Hậu Môn | E/B | 0, −67 | `gate_sect` (rộng 20) | S4 | giữ + phòng gác |
| BLD-thanh-19 | Hậu Sơn — Chính Điện Tam Thanh | **A** | 0, −116 | `cliff_palace` (palaceComplex 0,6) | S1 | thật hóa (đang ở `ROOMS.chinhdien`) |
| BLD-thanh-20 | Thành Môn Nam | B | 0, 158 | `city_gate` (rộng 64) | S4 / lầu S2 | thật hóa lầu |
| BLD-thanh-21 | Nhà trọ du phương | C | −60, 128 | mới `thanh_nhatro` | S3 (mở cả đêm) | **mới** |
| BLD-thanh-22 | Đại lộ chợ + cổng chào | C/D | 0, 80…150; cổng 0, 104 | `lib_stall_timber`, `lib_paifang` | S3 | nâng cấp |
| BLD-thanh-23 | Nhà vườn dân (30 nhà) | C | dải phố (`streetHouses`) | `lib_courtyard` | S3 | thật hóa |
| BLD-thanh-24 | Bắc Ngách Môn | E | 30, −155 | mới `thanh_ngachmon` | S6 | **mới** |
| BLD-thanh-25 | Văn Phong Tháp (tháp đỏ Đông Bắc) | B | 112, −96 | `lib_pagoda_red` (cao 46) | S2 | thật hóa |
| BLD-thanh-26 | Thuyết Thư Lâu (đình hai tầng Tây Bắc) | B | −112, −96 | `lib_pavilion2` (rộng 24) | S3 | thật hóa |
| BLD-thanh-27 | Bát Đạo Đình (Đình Truyền Đạo) | B | 0, 196 | mới `thanh_batdao` | S4 | **mới** |
| BLD-thanh-28 | Dịch trạm cửa Nam | E/C | 10, 182 | `lib_cart`, `lib_horse` + nhà trạm mới | S3 | nâng cấp |
| BLD-thanh-29 | Phường Tân Cư (nhà riêng người chơi) | C | −84…−130, 52…64 | `lib_courtyard` (6 nhà phố phụ Tây) | S6 | **mới** |
| BLD-thanh-30 | Quầy «Đổi Mệnh» của Định Mệnh Hội | D | 10,5, 113 | `lib_stall_timber` biến thể | S6 | **mới** |
| BLD-thanh-31 | Y Quán Hạnh Lâm | C | −97, −16 | `lib_courtyard` (1 nhà phố Đông – Tây) | S3 | **mới** (dùng nhà sẵn) |

Tổng: 31 mục (2 A · 9 B · 5 C · 10 D · 3 E + 2 E/B, E/C). **Model mới chỉ 5** (`thanh_thienbang`, `thanh_nhatro`, `thanh_ngachmon`, `thanh_batdao`, nhà trạm) — phần lớn công việc là **nội thất trong vỏ có sẵn**.

---

## 5. Chi tiết công trình

### BLD-thanh-01 · Sơn Môn 山門

| Hạng | B | Vị trí | (0, 67), cổng chính tường Nam Sơn Môn, quay Nam ra đại lộ |
|---|---|---|---|
| Nền | `gate_sect` rộng 30 m; lối giữa `keep: |x| > 3,4`; **mới**: hai phòng gác 6 × 5 m sau hai trụ biên (x ±9…±14, z 64…69) | Tầng | 1 |
| Mái | theo `gate_sect` | Model | `gate_sect` (có) + `thanh_phonggac` (mới, nhỏ) |

- **Công năng:** cổng nhập môn (Mở đầu 0.1). `COURT.gateS = 5` (lối 10 m giữa tường).
- **Nội thất phòng gác (mới, §8.4):**
  - **Phòng gác Tây — «Nhập Môn Phòng»:** bàn gỗ, sổ ghi danh, nghiên mực, **form bát tự** dạng tờ giấy (giao diện form có sẵn); ghế khách; đèn lồng. Nơi **Lão Tùng** hỏi «ngày giờ con sinh?».
  - **Phòng gác Đông — «Khách Lạ Phòng»:** chỗ ngồi chờ, giá treo áo mưa; bảng gỗ «đọc lá số khách lạ» — người chơi đã nhập môn có thể ngồi thay Lão Tùng **đọc lá số cho người chơi mới** (sư huynh tình nguyện, MMO, chỉ đọc phần chung — không hiện ngày sinh người mới).
- **Tương tác:** nhập môn (`analyze()`); dẫn đường người mới; bậc Sơn Môn phía ngoài là chỗ **Khổng tiên sinh** ngồi (cảnh 0.4, rồi đi các chợ — canon §4).
- **NPC:** `gac_cong` (Lão Tùng, giờ Mão → Tuất; đêm: «sư huynh trực» là NPC phụ `NPC-thanh-trucdem` TBD-06); `khong_tiensinh` (bậc ngoài, chỉ Mở đầu và các lần ghé).
- **Ngày / đêm:** S4 lối đi; phòng gác S1.
- **Va chạm:** giữ `keep` hiện có; phòng gác cửa 1,6 m mở vào lối giữa.
- **Ngân sách:** phòng gác 2 × 8k; nội thất 15k.
- **Meshy (phòng gác):** `A small square gatekeeper's lodge tucked behind a pillar of a grand sect gateway, cinnabar lacquered walls, black lacquer frame with gold trim, small curved dark tile roof, one lattice window, open front doorway, stone-paved courtyard, no text`

### BLD-thanh-02 · Hồ Sen đôi + bến thả đèn

| Hạng | D | Vị trí | hồ Đông (21, 50) = gian `sen`; hồ Tây (−21, 50); mỗi hồ 24 × 8 m |
|---|---|---|---|
| Nền | `court.js › PONDS`; lan can cẩm thạch, khe hở ở mép Nam hồ Đông (x 12…18) | Tầng | — |
| Mái | — | Model | thủ tục (`MD.pond`) |

- **Hiện có:** gian `sen` (thả đèn hoa đăng) ở mép Nam hồ Đông, chỗ đứng (15, 55,4).
- **Thêm:** **bến thả đèn bằng đá** (bậc xuống sát mặt nước, 3 × 1,6 m) ở chỗ khe lan can; hồ Tây thêm **cầu đá nhỏ** (lib_stone_bridge thu 0,15) nối hai bờ dọc — đi được giữa hồ.
- **Tương tác:** thả đèn (web; **iOS tắt** — `features.js › IOS_OFF` có `sen`, iOS hiển thị hồ thuần cảnh); lễ Vu Lan / Trung Nguyên nhận đèn từ Báo Ân điện Phong Đô; đứng trên cầu hồ Tây ngắm cá.
- **Va chạm:** hồ đặc (hiện có); bến `addPlatform` y −0,3; cầu `addPlatform`.

### BLD-thanh-03 · Đại Đỉnh 大鼎 + Lư Hương 爐香

| Hạng | D | Vị trí | Đại Đỉnh (0, 27,5) trong vòng vàng r 8; Lư Hương gian `huong` (0, 34) |
|---|---|---|---|
| Nền | `cauldron` cao 5,5 m; đế lư 3,2 × 1,6 | Tầng | — |
| Mái | — | Model | `cauldron` (có) |

- **Tương tác:** thắp một tuần nhang (gian `huong`; iOS đổi tên «Lò Trầm» — `features.js › TEXT`); quanh Đại Đỉnh: **khắc tên ngày** — mỗi ngày can chi mới, mặt đỉnh hiện can chi ngày (đồng bộ Thiên Bàn).
- **Va chạm:** giữ hiện có.

### BLD-thanh-04 · Trà Thất 茶室

| Hạng | B | Vị trí | gian `tra` dời tới (−40, 24); khối (−44,4…−36,4, 20,75…23,95) |
|---|---|---|---|
| Nền | đình trà thủ công (`models.js › teaPavilion`) ~8 × 3,2 m + **mới**: gian sau 8 × 4 m (bếp trà) | Tầng | 1 |
| Mái | theo model; gian sau mái ngói đen một mái | Model | có + `thanh_traththat_sau` (nhỏ) |

- **Hiện có:** ba bồ đoàn MMO (`TEA_SEATS`), tĩnh tọa nhịp thở, uống trà.
- **Nội thất thêm:** gian sau — bếp trà (lò than, ấm đồng, chum nước mưa, kệ hũ trà theo ngũ hành có nhãn), một bàn trà cho 4 người.
- **Tương tác thêm:** pha trà theo Dụng thần (`tea-therapy › teaTherapy`); **đồng tu** 3 người ngồi bồ đoàn nhận ổn định tĩnh tọa (đã có định hướng §10).
- **Ngày / đêm:** S2 cho gian sau; bồ đoàn ngoài S4.
- **Va chạm:** cửa gian sau 1,6 m; lối giữa bồ đoàn giữ như cũ.

### BLD-thanh-05 · La Bàn Đài 羅盤臺

| Hạng | D | Vị trí | gian `compass` (40, 22) |
|---|---|---|---|
| Nền | đài la bàn thủ công | Tầng | — |
| Mái | — | Model | `models.js` (có); thay dần bằng `luopan_stand` |

- **Tương tác:** xem hướng nhà (đã có) → **thêm** liên kết nhà riêng (BLD-thanh-29): xoay la bàn đo hướng nhà của chính người chơi (`zhai`, `xuankong`).
- **Va chạm:** giữ.

### BLD-thanh-06 · Ống Xăm 籤筒 + Bảng Lịch Ngày 日曆榜

| Hạng | D | Vị trí | Ống Xăm (−40, 40) gian `xam`; Bảng Lịch (40, 40) gian `lich` |
|---|---|---|---|
| Nền | hai quầy nhỏ 3,2 × 3,2 m | Tầng | — |
| Mái | theo model | Model | `models.js` (có) |

| Quầy | Hiện có | Thêm | iOS |
|---|---|---|---|
| Ống Xăm | xin một quẻ xăm | ghế đá cho người xin xăm ngồi đọc; lời nhắc «xăm là gợi ý để nghĩ, không phải lời phán» | **tắt** (`IOS_OFF: xam`) — iOS hiện quầy trống làm cảnh |
| Bảng Lịch | xem lịch hôm nay | thêm **giờ tốt hôm nay** (`huangdao`), ngày lễ các thánh địa sắp tới (lịch Thụ lục Long Hổ, khoa thi Văn Miếu…) | bật (lịch tiết khí là «học») |

### BLD-thanh-07 · Tàng Y Các 藏衣閣

| Hạng | C | Vị trí | quầy (−22, 37) (`TANGY`); model quầy ở (−22, 35,6) |
|---|---|---|---|
| Nền | quầy `lib_wood_pavilion` rộng 6,2 m + hai giá áo + 3 ma-nơ-canh (có) + **mới**: phòng thử 5 × 4 m phía sau (x −25…−19, z 30…34) | Tầng | 1 |
| Mái | mái gỗ của quầy; phòng thử mái ngói đen | Model | có + `thanh_phongthu` |

- **Hiện có:** Thợ May Tiên Y (`tho_may` — Bà Tư), 51 món / 8 ô / 5 bộ ngũ hành (`cosmetics.js`), quầy, giá áo, ma-nơ-canh xoay.
- **Nội thất thêm (phòng thử):** gương đồng lớn, bình phong, đèn; ghế; **ánh sáng chọn được** (sáng / chiều / đêm) để xem áo dưới các giờ.
- **Tương tác thêm:** thử đồ trong phòng thử (xem trước, không mua); Bà Tư **không bao giờ** nói về cải mệnh (§6.4 quy tắc 1 — chiều ngược lại cũng đúng: NPC đạo không nhắc tiệm).
- **Ngày / đêm:** S3.
- **Va chạm:** giữ khối quầy hiện có (`addSolidRectLocal`); phòng thử cửa 1,6 m.

### BLD-thanh-08 · Hợp Hôn Đình 合婚亭

| Hạng | D | Vị trí | (−48, 8) — `HALLS.hophon` (sảnh duy nhất trong Sơn Môn) |
|---|---|---|---|
| Nền | án thư + đình gỗ sau lưng + bonsai + 2 cột đèn (đặt bởi vòng `HALLS` trong `landmarks.js`) | Tầng | — |
| Mái | `lib_wood_pavilion` | Model | có |

- **Hiện có:** Bàn Hợp Hôn (án chung `hehun`).
- **Nâng cấp:** thêm hai **ghế song tọa** đối diện án (cho hai người chơi), cây **dây tơ hồng** (đạo cụ trang trí trên đình); tương tác **kết nghĩa kim lan** (hai người chơi so lá số thật — `hehun`, `nayin-relation`, §10 bản sơ đồ tổng). Chỉ hiện kết quả **chung** cho cả hai; không lộ ngày sinh của người kia.
- **Va chạm:** ghế đặc thấp; lối 1,6 m quanh án.

### BLD-thanh-09 · Ba ghế khách hỏi việc

| Hạng | D | Vị trí | `an0` (−16, 22), `an1` (16, 22), `an2` (26, 30) |
|---|---|---|---|
| Nền | ba bộ ghế + bàn nhỏ (theo `models.js`) | Tầng | — |
| Mái | — | Model | có |

- **Hiện có:** khách NPC tới hỏi việc, giải án 6 bước (`cases.js`).
- **Thêm:** mỗi ghế có **ô che** (lọng giấy) và một **bình trà** — khách ngồi chờ có hoạt ảnh uống trà; khi giải xong, khách để lại **một vật nhỏ** (lá thư cảm ơn) trên bàn (kỷ niệm trong Sổ Mệnh).
- **Va chạm:** giữ.

### BLD-thanh-10 · Chung Lâu 鐘樓 (lầu chuông, phía Đông)

| Hạng | B | Vị trí | (47, −9), quay vào trục (ry = −π/2) |
|---|---|---|---|
| Nền | `lib_pavilion2` rộng 12 m | Tầng | 2 |
| Mái | đình hai tầng | Model | có |

- **Quy ước:** «thần chung mộ cổ» — **chuông Đông, trống Tây** (đặt theo lệ cung quán phương Bắc). `sect.js` hiện dựng hai lầu giống nhau ở ±47; tập này **chốt** lầu x = +47 là chuông.
- **Nội thất (§8.4):** tầng 1: cầu thang gỗ, bia ghi lịch đánh chuông; tầng 2: **chuông đồng** cao 1,8 m treo xà, chày gỗ treo dây ngang.
- **Tương tác:** **đánh chuông sớm giờ Mão** → Phúc Khí (§8.4); MMO: **cả máy chủ nghe** tiếng chuông (âm thanh toàn bản đồ, nhỏ dần theo khoảng cách); mỗi ngày chỉ người đầu tiên đánh hồi chính (108 tiếng rút gọn thành 18), người sau đánh hồi phụ.
- **Ngày / đêm:** S2 + giờ Mão (mở từ giờ Dần cuối để người chơi kịp lên).
- **Va chạm:** cửa 2,0 m (khoét `keep` trên model); cầu thang `addPlatform` 10 bậc; chuông đặc.
- **Ngân sách:** nội thất 20k.

### BLD-thanh-11 · Cổ Lâu 鼓樓 (lầu trống, phía Tây)

| Hạng | B | Vị trí | (−47, −9), quay vào trục |
|---|---|---|---|
| Nền | `lib_pavilion2` rộng 12 m | Tầng | 2 |
| Mái | đình hai tầng | Model | có |

- **Nội thất:** tầng 1 giá dùi trống, bảng giờ can chi; tầng 2: **trống lớn** Ø 1,6 m trên giá gỗ sơn son.
- **Tương tác:** **đánh trống chiều giờ Dậu** (§8.4) → Phúc Khí; đồng bộ MMO như chuông; nhịp trống là mini-game nhịp đơn giản (TBD-09).
- **Ngày / đêm:** S2 + giờ Dậu.
- **Va chạm, ngân sách:** như BLD-thanh-10.

### BLD-thanh-12 · Thiên Bảng 天榜 (đôi bảng đồng)

| Hạng | D | Vị trí | hai bảng ở (−18, 2) và (18, 2), trên nền L1 (y 2), quay Nam đón người lên bậc |
|---|---|---|---|
| Nền | mỗi bảng 6 × 0,6 m, cao 4 m, trên bệ cẩm thạch 0,6 m | Tầng | — |
| Mái | mũ bảng mái ngói nhỏ, viền vàng | Model | `thanh_thienbang` (mới) |

- **Công năng (§7.12):** xếp hạng **tiềm lực ban đầu và tiềm lực đã cải** — đặt cạnh nhau để thấy **khoảng cách người ta đã đi**:
  - **Bảng Tây — «Tiên Thiên»:** chỉ hiện **phân bố** (biểu đồ cột Phẩm căn của máy chủ, ẩn danh) — **không** xếp tên theo căn cốt.
  - **Bảng Đông — «Hậu Thiên»:** xếp tên theo **Đạo Hạnh** tháng này, cột phụ «quãng đường» = Đạo Hạnh × hệ số Nghịch Thiên — người lá số thấp được nêu tên vì đi xa.
- **Lý do thiết kế:** trụ cột T2 và chỉ số thành công §13.5 (giữ chân người lá số thấp). Bảng xếp tên theo căn cốt bị **cấm** (§14 bản sơ đồ tổng).
- **Tương tác:** đọc bảng; bấm tên bạn bè; tắt hiện tên (riêng tư). Thiên Bảng cuối cùng ở Côn Lôn (`BLD-conlon-13`).
- **Va chạm:** bảng + bệ đặc; không chắn bậc 2 (x −7…7) — bảng ở x ±15…±21.
- **Ngân sách:** 6k mỗi bảng + chữ động.
- **Meshy:** `A tall bronze notice board on a white marble pedestal, rectangular face with a raised gold border divided into blank rows, a small curved dark tile roof cap with gold ridge, cinnabar lacquered posts at both sides, standing on a stone terrace, no text`

### BLD-thanh-13 · Bàn Thầy Tử Bình

| Hạng | D | Vị trí | `DAIS` (0, −11), y 4, bệ gỗ cao 0,25 m (10,4 × 6,8) |
|---|---|---|---|
| Nền | án thư + chỗ thầy ngồi (`masterDais`) | Tầng | — |
| Mái | không (ngoài trời trước Chính Đường) | Model | có |

- **Hiện có:** `thay_tubinh`, giải lá số, Thầy AI (`master-ui.js`; iOS tắt AI).
- **Thay đổi theo §8.4:** ban ngày thầy vẫn ngồi **bệ ngoài** tiếp khách; giờ Dậu trở đi và khi mưa thầy **vào trong Chính Đường** (Tổ Sư đường, BLD-thanh-14) — bàn trong điện là bàn thứ hai cùng chức năng.
- **Va chạm:** giữ `addPlatform` bệ.

### BLD-thanh-14 · Chính Đường 正堂

| Hạng | **A** | Vị trí | `MAIN_HALL` (0, −31), y 4 (nền L2), mặt tiền lùi tới z ≤ −16 (logic hiện có trong `sect.js`) |
|---|---|---|---|
| Nền | `palace_grand` rộng 44 m; khung va chạm `addSolidRect(−20, −46, 20, −17)` | Tầng | 2 (ngoại thất trùng diêm → nội thất 2 tầng, §8.1) |
| Mái | vũ điện trùng diêm | Model | `palace_grand` (có) |

- **Việc phải làm (§8.4):** **khoét cửa giữa** (thay khối đặc `addSolidRect` bằng vỏ + `keep` lối 3,2 m ở x −1,6…1,6) và dựng nội thất 2 tầng **trong vỏ**.
- **Nội thất (từng phòng):**
  - **Tầng 1 — Tổ Sư Đường:**
    - Gian giữa: **bài vị các đời tổ sư Huyền Quán** (hư cấu) trên bàn thờ nhiều bậc sơn son thếp vàng; hương án; **Sổ Môn Phái** lớn mở trên giá (danh sách đệ tử chính thức — người chơi Thuận Thiên được ghi tên ở Hồi I).
    - Gian Đông: **bàn thầy trong điện** (bàn thứ hai của Thầy Tử Bình — dùng buổi tối và ngày mưa), ghế khách, giá sách lá số mẫu.
    - Gian Tây: phòng **giảng** — 12 án thư thấp, bảng đen gỗ (dạy 6 bước luận án — ACT luyện tập của `cases.js`).
    - Hậu cung: cầu thang gỗ hai bên lên tầng 2.
  - **Tầng 2 — Tàng Kinh:**
    - Kệ sách gỗ đen chạy quanh, chia theo 8 lớp `library-data › LAYERS` (Đạo Tạng, phù, chú, nghi, công pháp, phương thuật, bí truyền, kinh điển Bát Tự);
    - bàn đọc dài giữa sàn, đèn lồng giấy;
    - **tủ khóa «Bí truyền»** (lớp `bitruyen`): có `bitruyen-data` với ghi chú «cấm thực hành» — người chơi đọc được **tóm tắt và cảnh báo**, không đọc được phương pháp (đúng app);
    - hiên tầng 2: nhìn xuống sân và lên Thiên Bàn (Thiên Bàn treo ở (0, y 78, −80), `render3d.js`).
- **Tương tác / trạm (≥ 3):**
  1. **Ghi tên Sổ Môn Phái** (nhánh Thuận Thiên, Hồi I, TBD-03) — với nhánh Nghịch Thiên, sổ để **trống một dòng** chờ (khi người chơi quay lại sau Mệnh Đồ, tên được ghi — «muộn nhưng không thiếu»);
  2. **Bàn thầy trong điện** (như bệ ngoài);
  3. **Phòng giảng** — luyện 6 bước luận với khách mẫu (`cases.js`);
  4. **Tàng Kinh** — tra cổ thư `library-data` (Thư Lâu Lâm là thư viện lớn; ở đây là bản tóm tắt, ACT TBD-09).
- **NPC:** `thay_tubinh`; `NPC-thanh-thuthu` (đạo đồng giữ sách, TBD-06).
- **Ngày / đêm:** S1.
- **Va chạm:** cửa giữa 3,2 m `keep`; cầu thang `addPlatform` 2 × 12 bậc (y 4 → 9); lan can hiên tầng 2 1,1 m.
- **Ngân sách:** shell giữ `palace_grand`; nội thất 150k; tầng 2 chỉ vẽ khi người chơi ở tầng 2.

### BLD-thanh-15 · Vận Mệnh Các 運命閣 (điện phụ Tây)

| Hạng | B (nội dung cỡ A) | Vị trí | (−47, −36), cửa ở (−38,6, −40) (`ROOMS.vanmenh.door`) |
|---|---|---|---|
| Nền | vỏ `hall_main` rộng 22 m | Tầng | 1 |
| Mái | hai tầng mái cong | Model | có |

- **Hiện trạng:** nội thất ở **phòng ngoài bản đồ** `ROOMS.vanmenh` (origin (1900, 0), 20 × 72 m): bia tổng quan ở lối vào + **9 cổng đại vận** dọc lối giữa (`VAN_GATE_Z(i) = 25 − 6i`), `vanmenh.js`.
- **Việc phải làm:** vỏ `hall_main` rộng 22 m **không chứa nổi** hành lang 72 m. Đề xuất: **giữ hành lang 9 cổng như «không gian trong điện» bằng phép phối cảnh**: điện thật dài 22 m gồm sảnh + 3 cổng đầu; cuối điện là **cửa vòm sáng** dẫn vào hành lang 9 cổng (giữ cơ chế phòng ngoài bản đồ, coi như «cảnh đặc biệt» — ngoại lệ cho phép ở §8.2 mục 1). Ghi rõ là ngoại lệ có chủ đích: đại vận là «đi qua thời gian», không phải không gian thật.
- **Nội thất phần thật (trong vỏ):** sảnh vào: **Bia Vận Mệnh** (`VAN_STELE`, giờ đặt trong vỏ thật ở (−42, −30)); hai bên là 10 cột gỗ khắc **thập can**; cuối sảnh cửa vòm.
- **Tương tác:** như hiện có (đọc bia quỹ tích đời, bước vào từng thập kỷ — `vanmenh.js`, `analyze().dayun`); I.3 «Mười năm này».
- **iOS:** **tắt** (`IOS_OFF` có `vanbia`, `van0–8`, `door_vanmenh`) — iOS: cửa điện khép, biển «Đang tu sửa» **không dùng** (nói dối); dùng biển «Điện này mở trong bản web» — hoặc tập 13 chọn thay nội dung «học về đại vận» không cá nhân hóa.
- **Va chạm:** khoét cửa 2,4 m ở mặt Đông vỏ; `keep`.

### BLD-thanh-16 · Thái Tuế Điện 太歲殿 (điện phụ Đông)

| Hạng | B | Vị trí | (47, −36), cửa (38,6, −40) (`ROOMS.thaitue.door`) |
|---|---|---|---|
| Nền | vỏ `hall_main` rộng 22 m; phòng hiện tại 28 × 24 m | Tầng | 1 |
| Mái | hai tầng mái cong | Model | có |

- **Hiện trạng:** `ROOMS.thaitue` (origin (2000, 0)); **Bàn Lễ Thái Tuế** ở tâm −2,2; `thaitue.js`.
- **Việc phải làm:** thật hóa **trong vỏ** (vừa kích thước nếu thu bàn lễ và hai dãy đèn): gian giữa **tượng niên chủ Thái Tuế** năm hiện tại (đổi mỗi Lập Xuân — nối Dần Lâu Côn Lôn); hai dãy kệ **đèn Thái Tuế** (mỗi người chơi thắp một đèn mang tên nhân vật); bàn lễ.
- **Tương tác:** xem Thái Tuế năm nay (`taisui › personalTaSui`, `thaitue.js`), thắp đèn (I.4); Định Mệnh Hội thường dọa người «phạm Thái Tuế phải cúng 10 lượng» — điện này là nơi **đối chiếu sự thật** (MQ-2 án mẫu §3 bản sơ đồ tổng).
- **iOS:** **tắt** (`thaitue`, `door_thaitue`) — như BLD-15.
- **Va chạm:** cửa 2,4 m mặt Tây; bàn lễ đặc; lối 1,6 m giữa kệ đèn.

### BLD-thanh-17 · Bốn bảo tháp góc

| Hạng | D/B | Vị trí | Bắc: `lib_pagoda5` cao 26 m ở (±53, −58); Nam: `lib_pagoda_red` cao 20 m ở (±53, 58) |
|---|---|---|---|
| Nền | Ø ~7–8 m | Tầng | 5 / 3 |
| Mái | theo model | Model | có |

- **Việc phải làm (§8.4):** đi vào tầng trệt; cầu thang lên tầng ngắm; **tầng đỉnh có chuông gió theo hành** của người chơi.

| Tháp | Tầng trệt | Tầng đỉnh | Gắn với |
|---|---|---|---|
| Tây Bắc (−53, −58) | bia «Mộc» — chuyện người sáng lập quán | chuông gió **ống tre** | hành Mộc |
| Đông Bắc (53, −58) | bia «Kim» — luật quán | chuông **đồng** | hành Kim |
| Tây Nam (−53, 58) | bia «Thủy» — chuyện Thiên Bàn | chuông **thủy tinh lam** | hành Thủy |
| Đông Nam (53, 58) | bia «Hỏa» — lễ hội của quán | chuông **gốm đỏ** | hành Hỏa |
| (giữa sân — Đại Đỉnh) | hành **Thổ** | — | — |

- **Tương tác:** leo tháp của **hành Dụng thần** mình (`yong.primary`) → treo chuông gió riêng (một lần; nối Lương Phong Đài ở Côn Lôn); tầng ngắm nhìn toàn Sơn Môn.
- **Va chạm:** khoét cửa 1,6 m tầng trệt; cầu thang xoắn `addPlatform`; lan can tầng ngắm 1,1 m.
- **Ngân sách:** nội thất 12k mỗi tháp.

### BLD-thanh-18 · Hậu Môn 後門

| Hạng | E/B | Vị trí | (0, −67), `gate_sect` rộng 20 m, quay Bắc (ry = π); `COURT.gateN = 3,5` |
|---|---|---|---|
| Nền | lối giữa `keep: |x| > 2,3`; **mới** một phòng gác nhỏ 5 × 4 m phía Đông | Tầng | 1 |
| Mái | theo `gate_sect` | Model | có + `thanh_phonggac` |

- **Tương tác:** phòng gác: **đạo đồng giữ Hậu Môn** (`NPC-thanh-giuhau`, TBD-06) — người hỏi đường lên Hậu Sơn, và là người **từ chối** đưa người chơi lên Vân Cốc trước I.5 («sau núi chỉ có một ông sư già…»).
- **Va chạm:** giữ `keep`; phòng gác cửa 1,6 m.

### BLD-thanh-19 · Hậu Sơn — Chính Điện Tam Thanh 三清正殿

| Hạng | **A** | Vị trí | `palaceComplex` tâm (0, −116), ry 0, scale 0,6 (nền 90 × 72, 3 tầng × 1,92 m, bậc stepD 0,9); chính điện `cliff_palace` rộng ~55 m ở (0, −124,6) |
|---|---|---|---|
| Nền | nền + chính điện + 2 điện phụ `hall_main` (±32, −107) + 2 tháp (±38, −143) | Tầng | 1 (điện chính) |
| Mái | theo `cliff_palace` | Model | có |

- **Hiện trạng:** nội thất ở **phòng ngoài bản đồ** `ROOMS.chinhdien` (origin (1500, 0) — **trùng vùng Long Hổ**, README §5 #2), cửa ở (0, −84); tượng `deity_lingbao` (−6,5), `deity_yuanshi` (0), `deity_daode` (6,5); **Thầy Giải Quẻ** (gian `que`, web).
- **Việc phải làm (§8.4):** phá phòng ngoài bản đồ, **dựng nội thất tại chỗ** trong `cliff_palace`; giải phóng tọa độ (1500, 0) cho Long Hổ.
- **Nội thất:**
  - Chính điện: ba khám **Tam Thanh** (tái dùng 3 tượng đã có, cùng thứ tự); hương án dài; hai dãy cột; trần tảo tỉnh.
  - Điện phụ Đông: **Thầy Giải Quẻ** (`que-ui.js`, 5 phép — web); iOS: điện phụ Đông thành **phòng học Kinh Dịch** (đọc quẻ như văn bản, không gieo cho bản thân).
  - Điện phụ Tây: **phòng khách hành hương** — bản đồ 12 thánh địa vẽ trên vách, mỗi thánh địa đã tới sáng lên.
  - Hai tháp sau: tầng trệt trưng **phù hư cấu** mẫu của 5 phái (đọc cấu trúc), không bán.
- **Tương tác / trạm:** thắp hương Tam Thanh; gieo quẻ (web); bản đồ hành hương; lối men cạnh Đông nền ra **Bắc Ngách Môn** (BLD-24).
- **Ngày / đêm:** S1.
- **Va chạm:** khoét cửa chính 3,2 m trong `cliff_palace`; bậc nền stepD 0,9 (độ cao 1,92 / tầng → 5 bậc 0,384 m mỗi tầng — đúng `STEP`).

### BLD-thanh-20 · Thành Môn Nam 南城門

| Hạng | B | Vị trí | (0, 158), `city_gate` rộng 64 m, `keep: corridor(0, 158, 0, 5)` (lối 10 m) |
|---|---|---|---|
| Nền | cửa vòm + lầu hai tầng trên tường | Tầng | lầu 2 |
| Mái | theo model | Model | có |

- **Việc phải làm:** thêm **bậc lên tường** trong thân thành (hai cầu thang đá kẹp vòm, 36 bậc × 0,4 m lên mặt tường y 14) và **nội thất lầu**.
- **Nội thất lầu:** tầng 1: phòng lính canh (bàn, giá giáo gỗ nghi lễ, chiêng báo giờ); tầng 2: phòng **Thành Thủ** — bản đồ thành, sổ người ra vào; hiên quanh lầu nhìn ra vành đai `roadPath` và 12 hướng đường.
- **Tương tác:** đi trên mặt tường (vòng một đoạn ±40 m mỗi bên — đi bộ ngắm thành); chiêng báo giờ Tý (đêm) — ai đánh cũng được, nghe toàn thành; chỉ đường từ hiên (bấm hướng → tia sáng chạy dọc đường tới thánh địa).
- **NPC:** `NPC-thanh-thanhthu` (Thành Thủ họ Lạc, TBD-06), lính canh (đám đông).
- **Ngày / đêm:** S4 cửa vòm (không đóng — thành của game không cấm đêm); lầu S2.
- **Va chạm:** giữ `keep`; cầu thang `addPlatform`; mặt tường `addPlatform` y 14, lan can (lỗ châu mai) đặc.

### BLD-thanh-21 · Nhà trọ du phương 遊方客棧

| Hạng | C | Vị trí | (−60, 128), quay Đông ra đại lộ (lùi sau dãy nhà x −17) |
|---|---|---|---|
| Nền | 20 × 14 m quanh thiên tỉnh nhỏ | Tầng | 2 |
| Mái | ngói đen, viền son | Model | `thanh_nhatro` (mới) |

- **Công năng (§7.12):** **ghép đội** (bảng tìm bạn đồng hành theo thánh địa); nơi người chơi **Nghịch Thiên** nghỉ tạm khi Sơn Môn «chưa nhận» (Hồi I) — và **đêm đó Vân Cốc tới tìm** (cảnh BR-NT, TBD-03), rồi dẫn lên am qua Bắc Ngách Môn.
- **Nội thất:**
  - Tầng 1: sảnh ăn 10 bàn, quầy chủ trọ, **bảng ghép đội** (12 cột = 12 thánh địa + cột «Hồi IV: đi cứu bạn»), lò sưởi; thiên tỉnh có giếng và cây lựu.
  - Tầng 2: 10 phòng trọ (giường, bàn, đèn dầu, cửa sổ); **phòng số 7** — phòng mặc định của người chơi Nghịch Thiên: cửa sổ nhìn thấy sợi khói bếp Vân Cốc phía Bắc (POI-vancoc-03).
- **Tương tác:** nghỉ / lưu; ghép đội (GUILD / nhóm, TBD-10); cảnh Vân Cốc gõ cửa (đêm, nhánh Nghịch Thiên).
- **NPC:** `NPC-thanh-chutro` (bà chủ trọ Mạc thị, TBD-06); `van_coc` (chỉ cảnh BR-NT).
- **Ngày / đêm:** S3 ngoại lệ: **mở cả đêm**.
- **Va chạm:** cửa 2,4 m; cầu thang 12 bậc; hành lang tầng 2 lan can 1,1 m.
- **Ngân sách:** 15k / 2,5k; nội thất 35k.
- **Meshy:** `A two-storey traditional travelers' inn around a small courtyard, cinnabar lacquered pillars, black lacquer lattice windows with gold trim, curved dark tile roofs, an upper gallery with railings, red lanterns at the entrance, wooden sign board blank, open front doorway, no text`

### BLD-thanh-22 · Đại lộ chợ + cổng chào

| Hạng | C/D | Vị trí | quầy `lib_stall_timber` ở x ±10,5, z 80…132 mỗi 22 m; cổng chào `lib_paifang` rộng 26 m ở (0, 104), `keep` lối 8 m; cột đèn mỗi 12 m |
|---|---|---|---|
| Nền | quầy 5,5 m | Tầng | — |
| Mái | theo model | Model | có |

- **Nâng cấp:** mỗi quầy **một nghề, một chủ có lá số**:

| Quầy | Vị trí | Nghề | Tương tác |
|---|---|---|---|
| Q1 | (−10,5, 80) | bánh trái, chè | ăn (hồi sức) |
| Q2 | (10,5, 91) | giấy bút, sổ tay | mua sổ ghi chép (đạo cụ) |
| Q3 | (−10,5, 102) | thuốc nam (của Y Quán) | dẫn tới BLD-31 |
| Q4 | (10,5, 113) | **quầy Định Mệnh Hội** — xem BLD-30 | — |
| Q5 | (−10,5, 124) | đồ gốm ngũ hành | trang trí nhà riêng (BLD-29) |
| Q6 | (10,5, 135) | sách cũ, tranh | mua sách đọc (lore) |
| Q7 | (−10,5, 146) | hoa, hương, nến | dâng hương các điện |

- **Ngày / đêm:** S3; chợ đông giờ Thìn – Ngọ; đêm quầy đóng, đèn lồng sáng.
- **Va chạm:** giữ (quầy chặn theo hình khối; đại lộ chừa giữa x −6…6).

### BLD-thanh-23 · Nhà vườn dân (30 nhà)

| Hạng | C | Vị trí | `streetHouses()`: đại lộ x ±17, z 84…135 (mỗi 17 m); trục Đông – Tây x ±80…±131, z ±16; phố phụ x ±84 / ±106 / ±128, z 52…64; + 6 nhà vành Bắc (`lib_courtyard` ở (±110, −40), (±90, −70), (±125, 30)) |
|---|---|---|---|
| Nền | `lib_courtyard` (tỷ lệ 8–10,5 × 1,25) | Tầng | 1 (tứ hợp viện) |
| Mái | ngói | Model | `lib_courtyard` (instanced LOD) |

- **Việc phải làm (§8.4):** mỗi nhà là **một gia đình NPC có lá số** (`npc.js › makeNpc`), có **án phong thủy tại chính nhà họ** dùng **hướng nhà thật** của bản sao (`ry` trong `streetHouses`) cho `zhai` / `xuankong`.
- **Nội thất (mô-đun tứ hợp viện, 3 biến thể bố trí):** nhà trên (phòng khách + bàn thờ gia tiên), hai nhà bên (phòng ngủ, bếp), sân giữa (giếng, cây); đồ đạc theo nghề chủ nhà (bảng nghề sinh từ `five-dim-radar` của lá số NPC: Thương → hàng hóa, Trị → sổ sách, Học → sách, Nghệ → đồ nghề, Đồng → bàn trà tiếp khách).
- **Tương tác:** gõ cửa (S3); án nhà (SQ-thanh-?? ×30, TBD-03); việc thiện nhỏ (mang rau từ Vân Cốc, đọc thư cho cụ già…); **«nhìn mệnh thiên hạ»** từ Vọng Thành Đình (Vân Cốc) đánh dấu nhà đang có chuyện.
- **Hiệu năng:** nội thất chỉ nạp cho **nhà người chơi đang đứng trước cửa ≤ 20 m** (30 nhà × nội thất là quá nặng cho điện thoại); vỏ vẫn instanced như hiện tại.
- **Va chạm:** vỏ đã `solidHouses`; khoét cổng 1,6 m theo hướng `ry` từng nhà.

### BLD-thanh-24 · Bắc Ngách Môn 北角門

| Hạng | E | Vị trí | (30, −155) trên tường thành tròn r 158 (đoạn góc ≈ −79°), quay Bắc |
|---|---|---|---|
| Nền | cổng vòm nhỏ trong thân tường: thông thủy 2,4 × 3,2 m; cánh cửa gỗ đóng đinh | Tầng | — |
| Mái | mái ngói nhỏ trên vòm (mặt trong thành) | Model | `thanh_ngachmon` (mới) |

- **Công năng:** lối duy nhất từ thành lên **Am Vân Cốc** (`07-12`).
- **Việc kỹ thuật:** bỏ một đoạn `wallRing` (một trong 64 đoạn), đặt model cổng, `keep` lối 2,4 m; lối men cạnh Đông nền Hậu Sơn từ Hậu Môn tới cổng (đất nện 1,6 m, x ≈ 52, kiểm va chạm với tháp `tower_nine` của palaceComplex ở (38, −143)).
- **Lịch cửa (S6):** **khép** cho tới khi mở MQ-1-?? «Gương Liễu Phàm» (I.5) — trước đó đạo đồng Hậu Môn không cho qua; sau đó **luôn mở**.
- **Tương tác:** chạm cửa khép (trước I.5): «Cửa này mở từ phía bên kia.» (gợi ý); sau I.5: POI-vancoc-12.
- **Ngân sách:** 6k.
- **Meshy:** `A small arched postern gate set into a thick round stone city wall, heavy wooden doors with iron studs standing open, a tiny curved dark tile roof over the inner side of the arch, moss on the stones, a narrow dirt path leading up a hill beyond, open archway, no text`

### BLD-thanh-25 · Văn Phong Tháp 文峰塔 (tháp đỏ Đông Bắc)

| Hạng | B | Vị trí | (112, −96), `lib_pagoda_red` cao 46 m |
|---|---|---|---|
| Nền | Ø ~12 m | Tầng | 7 (vào được 4 tầng: 1, 3, 5, 7) |
| Mái | theo model | Model | có |

- **Nguyên mẫu ý tưởng:** **tháp Văn Phong** — tháp phong thủy nhiều thành thị cổ dựng ở góc Đông / Đông Nam để «trợ văn vận». Huyền Thành đặt ở Đông Bắc (cung Cấn — «núi», tượng học vấn tích lũy).
- **Công năng:** **tháp ngắm cao nhất trong thành** + **phòng trưng bày lịch sử Huyền Thành** (LORE / HIS, tập 02).
- **Nội thất:** tầng 1: mô hình thành bằng gỗ; tầng 3: tranh «Thiên Mệnh Bàn nứt» (biến cố khởi đầu); tầng 5: tranh 12 thánh địa; tầng 7: hiên ngắm — thấy Côn Lôn (Bắc), Phong Đô sương (Tây), Long Hổ (Đông).
- **Tương tác:** leo tháp (cầu thang xoắn); đọc lịch sử; **điểm ngắm** toàn thành.
- **Ngày / đêm:** S2.
- **Va chạm:** khoét cửa 2,0 m; cầu thang xoắn `addPlatform`; lan can tầng 7 1,1 m.
- **Ngân sách:** nội thất 30k (chỉ 4 tầng có đồ).

### BLD-thanh-26 · Thuyết Thư Lâu 說書樓 (đình hai tầng Tây Bắc)

| Hạng | B | Vị trí | (−112, −96), `lib_pavilion2` rộng 24 m |
|---|---|---|---|
| Nền | 24 × 16 m | Tầng | 2 |
| Mái | đình hai tầng | Model | có |

- **Công năng:** **lầu kể chuyện** — người kể chuyện NPC kể truyện các thánh địa (Long Hổ rồng hổ, Trấn Yêu tỉnh, Liễu Phàm, Mục Liên…), mỗi ngày một truyện; tầng 2 là **sân khấu nhỏ** cho người chơi tụ họp (sự kiện, đọc thơ).
- **Nội thất:** tầng 1: bục kể chuyện, bàn gõ (thước gỗ «kinh đường mộc»), 20 ghế dài, quầy trà; tầng 2: sân khấu gỗ, chiếu ngồi, đèn lồng.
- **Tương tác:** nghe truyện (mở mục LORE trong codex, TBD-02); MMO: sự kiện người chơi (đăng ký giờ, TBD-10).
- **NPC:** `NPC-thanh-thuyetthu` (ông kể chuyện họ Đào, TBD-06).
- **Ngày / đêm:** S3; buổi kể chính giờ Tuất (người chơi tối).
- **Va chạm:** cửa 2,4 m; ghế dài đặc, lối 1,6 m; cầu thang 12 bậc.

### BLD-thanh-27 · Bát Đạo Đình 八道亭 (Đình Truyền Đạo)

| Hạng | B | Vị trí | (0, 196), ngoài cửa Nam, giữa điểm toả của `roadPath` (cung R 205) |
|---|---|---|---|
| Nền | đình bát giác Ø 18 m trên nền đá 3 bậc; **8 cổng trụ** nhỏ quanh vòng Ø 40 m, mỗi cổng quay về một hướng đường | Tầng | 1 |
| Mái | toản tiêm bát giác ngói đen viền vàng, đầu đao vừa | Model | `thanh_batdao` (đình) + `thanh_cottru` (cổng nhỏ, ×8) |

- **Công năng (§7.12):** «8 cổng dẫn đường, có sứ giả mỗi đạo thống đứng mời». Game có **9 đạo thống** (§5.6) và 12 thánh địa → 8 cổng theo **8 hướng bát quái**, mỗi cổng gom các thánh địa ở hướng đó:

| Cổng | Hướng | Thánh địa / sảnh theo hướng | Sứ giả (NPC phụ, TBD-06) |
|---|---|---|---|
| Khảm | Bắc | Vân Cốc, Thư Lâu, Côn Lôn, Võ Đang | sứ Thanh Vi (Võ Đang) |
| Cấn | Đông Bắc | Manh Phái Cốc, Chung Nam | sứ Toàn Chân |
| Chấn | Đông | Lịch Đường, Long Hổ | sứ Chính Nhất |
| Tốn | Đông Nam | Cùng Thông Hồ, Mao Sơn | sứ Thượng Thanh |
| Ly | Nam | Bút Tháp, Văn Miếu, Yên Tử | sứ Tịnh Độ + sứ Nho (đứng chung) |
| Khôn | Tây Nam | Trích Thiên Đỉnh, Miêu Cương | vu y trẻ (bàng môn — chỉ y dược) |
| Đoài | Tây | Phong Thủy Viên, Phong Đô | sứ Bắc Đế |
| Càn | Tây Bắc | Tử Bình Phong, Tạng Địa | sứ Thiền (Trúc Lâm) + lạt-ma trẻ (khi Tạng Địa mở) |

- **Nội thất đình:** giữa đình là **bàn đá bát quái** với la bàn đồng lớn (dữ liệu hướng thật từ tọa độ vùng); 8 ghế đá theo 8 cạnh; trần vẽ bản đồ Huyền Giới.
- **Tương tác:** nói chuyện với sứ giả (giới thiệu đạo thống, **không ép**, không «chiêu mộ» — câu mở: «Nếu con muốn biết…»); chọn đích → tia sáng chạy theo `roadPath`; xem đạo thống **hợp Dụng thần** (`daozang-data › suggestDaozangChartAware` — lưu ý lỗi `R.yong.god` ở Phụ lục B bản sơ đồ tổng, cần sửa trước); hệ số +10% chỉ là gợi ý, người chơi tự chọn (§5.6).
- **Ngày / đêm:** S4; sứ giả có mặt giờ Mão → Dậu, đêm có bảng gỗ ghi lời mời từng đạo thống.
- **Va chạm:** đình mở 8 cạnh (8 cột); 8 cổng trụ thông thủy 3,2 m (không chặn đường).
- **Ngân sách:** đình 30k / 5k; cổng 4k × 8; nội thất 20k.
- **Meshy (đình):** `A large octagonal open pavilion on a three-step stone platform at a crossroads outside a city gate, eight cinnabar lacquered columns with gold bands, octagonal pyramidal dark tile roof with moderately upturned corners and a gold finial, a round stone table with a bronze compass in the center, open on all sides, no text`

### BLD-thanh-28 · Dịch trạm cửa Nam

| Hạng | E/C | Vị trí | (10, 182) (xe `lib_cart` ở (10, 180), ngựa `lib_horse` ở (10, 184,5) — có) + nhà trạm mới (22, 182) 12 × 8 m |
|---|---|---|---|
| Nền | nhà trạm 12 × 8 m, chuồng ngựa mở | Tầng | 1 |
| Mái | ngói đen | Model | xe, ngựa có + `thanh_dichtram` (mới) |

- **Công năng:** **trung tâm đi nhanh**: liệt kê mọi trạm đã mở ở 7 sảnh nghề + 12 thánh địa (xe ngựa, bè, đò, hạc — mỗi loại một biểu tượng).
- **Nội thất:** quầy trạm, bản đồ lớn trên vách (trạm đã mở sáng), ghế chờ, máng cỏ.
- **Tương tác:** đi nhanh; bảng thời gian «xe kế tiếp» chỉ là trang trí (đi ngay).
- **NPC:** `NPC-thanh-tramtruong` (TBD-06).
- **Ngày / đêm:** S3; đi nhanh 24 giờ.
- **Va chạm:** cửa 2,4 m.
- **Ngân sách:** 15k / 2,5k; nội thất 20k.

### BLD-thanh-29 · Phường Tân Cư 新居坊 (nhà riêng người chơi)

| Hạng | C | Vị trí | phố phụ Tây: 6 nhà `lib_courtyard` ở x −84 / −106 / −128, z 52…64 (theo `streetHouses`) — mỗi nhà là **cổng vào khu nhà riêng** |
|---|---|---|---|
| Nền | vỏ `lib_courtyard` | Tầng | 1 |
| Mái | ngói | Model | có |

- **Công năng (§9.3 «Sửa nhà»):** mỗi người chơi có **một nhà riêng**. MMO hàng nghìn người không thể có nghìn vỏ nhà trên bản đồ → **6 cổng phường** dẫn vào **nội thất riêng theo phiên** (instanced interior — ngoại lệ «phòng ngoài bản đồ» được §8.2 cho phép cho cảnh đặc biệt). Hướng nhà của nội thất = hướng thật của vỏ cổng phường người chơi chọn lúc nhận nhà (6 hướng khác nhau → 6 bài toán bát trạch khác nhau).
- **Nội thất mặc định:** tứ hợp viện trống: nhà trên (bàn thờ trống, bàn khách), phòng ngủ (giường, tủ), bếp, sân (giếng). Đồ đạc mua bằng Phúc Khí ở chợ (Q5) hoặc từ Tàng Y Các (trang trí — bán được theo §11).
- **Tương tác:** **đặt giường, bàn, cửa theo bát trạch / huyền không** (`zhai`, `xuankong`), **hóa sát** (`fs-cure › findCure`); tầng Mệnh Đồ «KHÔNG GIAN» (Hồi II) làm tại đây; mời bạn bè tới (theo lời mời); La Bàn Đài (BLD-05) đo hướng.
- **Ngày / đêm (S6):** nhà riêng luôn vào được; ánh sáng theo giờ thật.
- **Riêng tư:** khách chỉ thấy đồ đạc, không thấy lá số chủ nhà.
- **Va chạm (nội thất):** lưới mô-đun 3,2 m; đồ đạc đặt theo ô 0,8 m (khớp A*).

### BLD-thanh-30 · Quầy «Đổi Mệnh» của Định Mệnh Hội

| Hạng | D | Vị trí | (10,5, 113) — thay quầy Q4 trên đại lộ (lệch khỏi cổng chào 9 m) |
|---|---|---|---|
| Nền | `lib_stall_timber` 5,5 m + màn vải đen thêu sao, bàn trải lụa đỏ, ống thẻ, la bàn giả mạ vàng | Tầng | — |
| Mái | theo quầy | Model | `lib_stall_timber` + đạo cụ |

- **Công năng:** quầy mẫu của phe phản diện (canon §4: «quầy đổi mệnh ở mọi vùng»). Ở Huyền Thành, quầy là **án đầu tiên** người chơi vạch mặt (MQ-2, TBD-03): thầy giả nói NPC «phạm Thái Tuế, phải cúng 10 lượng vàng» → người chơi đối chiếu ở Thái Tuế Điện (BLD-16) bằng engine (`taisui › personalTaSui`) thấy tuổi đó **không phạm**; dùng `anti-manipulation-data` (dấu hiệu lừa đảo) làm «sách giáo khoa».
- **Chi tiết:** mọi đồ trên quầy **trông sang mà rỗng**: la bàn mạ vàng nhưng kim không quay; thẻ xăm in sẵn cùng một câu; «bùa đổi mệnh» là giấy in hàng loạt (ký tự hư cấu, lỗi in).
- **Tương tác:** quan sát (soi đồ thấy giả); hỏi chuyện; vạch mặt; sau khi vạch mặt quầy **dời đi vùng khác** (thông báo «Định Mệnh Hội đã chuyển quầy tới Long Hổ…» — móc nối chuỗi các vùng).
- **NPC:** `dinh_menh_hoi` (thầy «Thiết Khẩu», TBD-06).
- **Lịch (S6):** có mặt từ MQ-2 tới khi bị vạch mặt; giờ Thìn → Thân.
- **Va chạm:** quầy đặc như các quầy khác.

### BLD-thanh-31 · Y Quán Hạnh Lâm 杏林醫館

| Hạng | C | Vị trí | (−97, −16), dùng một nhà `lib_courtyard` dãy trục Đông – Tây (dãy Bắc phố, quay Nam ra phố) |
|---|---|---|---|
| Nền | vỏ có sẵn | Tầng | 1 |
| Mái | ngói | Model | `lib_courtyard` |

- **Tên:** «Hạnh Lâm» (rừng mơ) — điển tích chỉ nghề y (lương y Đổng Phụng chữa bệnh không lấy tiền, chỉ xin người khỏi bệnh trồng cây mơ).
- **Công năng:** **điểm chuyển hướng y tế** của cả game: mọi NPC «trúng tà» ở các vùng đều có bước khuyên đi thầy thuốc; ở Huyền Thành, thầy thuốc là đây. Cũng là nơi học **y lý ngũ hành** (`tcm › WUX_ZANG`, `seasonalHealth`, `MERIDIAN_CLOCK`) ở mức **kiến thức**, không chẩn bệnh người chơi.
- **Nội thất:** nhà trên: bàn bắt mạch, tủ thuốc trăm ngăn (nhãn vị thuốc hư cấu theo ngũ hành), cân đồng, cối giã; nhà bên: giường bệnh hai chiếc (NPC nằm), ấm sắc thuốc; sân: giàn phơi thảo dược, **cây mơ** (cây hạnh) ở giữa.
- **Tương tác:**
  1. **Đưa người tới khám** (đích của các nhiệm vụ cứu người: «Đã đưa tới Y Quán» là một bước hoàn thành hợp lệ — dạy rằng tìm thầy thuốc **là** việc đúng);
  2. **Đồng hồ kinh lạc** (`tcm › MERIDIAN_CLOCK`): bảng 12 giờ can chi – 12 kinh (kiến thức);
  3. Giúp phơi thuốc (DQ, việc thiện).
- **Lời nhắc bắt buộc** (UI cố định ở cửa): «Đây là trò chơi. Nếu bạn có triệu chứng thật, hãy gặp bác sĩ.»
- **NPC:** `NPC-thanh-luongy` (lương y họ Đổng — hư cấu, TBD-06).
- **Ngày / đêm:** S3; người bệnh NPC ở lại đêm.
- **Va chạm:** cổng 1,6 m; tủ thuốc đặc; giàn phơi đặc thấp.

---

## 6. Điểm đáng chú ý (POI)

| Mã | Tên | Vị trí (x, z) | Loại | Nội dung / tương tác |
|---|---|---|---|---|
| POI-thanh-01 | Điểm đứng đầu tiên | `START_M` (3, 43) | khoảnh khắc | camera nhìn thẳng lên Chính Đường và Thiên Bàn — ảnh mở đầu game; giữ nguyên |
| POI-thanh-02 | Ngự đạo chạm rồng | giữa bậc 1 (0, 10,5), dải 3,2 m | chi tiết | dải đá dốc chạm rồng (`sect.js`) — **không đi lên được** (đúng lệ: ngự đạo chỉ để ngắm); hai bên là bậc |
| POI-thanh-03 | Thiên Bàn | (0, y 78, −80) | cảnh | la bàn khổng lồ trên trời, vòng trong hiện can chi thật; ngước nhìn (camera có sẵn) |
| POI-thanh-04 | Bậc Khổng tiên sinh | (−4, 70) ngoài Sơn Môn | chỗ ngồi | bậc đá ông hay ngồi; khi ông đi chợ vùng khác, trên bậc để lại **chiếc quạt giấy** (dấu hiệu) |
| POI-thanh-05 | Vòng vàng Đại Đỉnh | (0, 27,5) r 6,6 / 8 | chi tiết | hai vòng vàng khảm nền; đứng giữa vòng: tiếng vọng nhẹ |
| POI-thanh-06 | Cờ ngũ hành | 8 cột trên mép L1 (x ±12…±30, z 6,6) | chi tiết | cờ theo màu ngũ hành (`WX_FLAG`); cờ của hành Dụng thần người chơi bay mạnh hơn (hiệu ứng riêng client) |
| POI-thanh-07 | Hiên tầng 2 Chính Đường | (0, −18, y 9) | ngắm cảnh | nhìn xuống toàn sân Sơn Môn và đại lộ, lên Thiên Bàn |
| POI-thanh-08 | Mặt tường thành cửa Nam | (±40, 158, y 14) | lối đi | đi trên tường ngắm vành đai đường toả 12 hướng |
| POI-thanh-09 | Cây đào cổng chào | (±26, 100) | cây | đào nở theo mùa thật (`tree_peach`); mùa Tết có câu đối đỏ treo (văn mới) |
| POI-thanh-10 | Bàn đá bát quái | (0, 196) | chi tiết | la bàn đồng giữa Bát Đạo Đình; kim chỉ về thánh địa người chơi chọn |
| POI-thanh-11 | Cầu đá hồ Tây | (−21, 50) | điểm ảnh | đứng giữa cầu nhìn Chính Đường soi bóng hồ |
| POI-thanh-12 | Tầng 7 Văn Phong Tháp | (112, −96, y ~40) | ngắm cảnh | điểm cao nhất thành: thấy Côn Lôn, sương Phong Đô, vách đỏ Long Hổ |
| POI-thanh-13 | Cửa sổ phòng số 7 nhà trọ | (−60, 128, y 5) | khoảnh khắc | thấy khói bếp Vân Cốc phía Bắc — dấu hiệu cho người chơi Nghịch Thiên |
| POI-thanh-14 | Bia ở tháp Tây Nam | (−53, 58) | bia (văn mới) | «Thiên Bàn quay, người dưới đất cũng đi. Bàn không đợi ai; người cũng không phải đợi bàn.» |

---

## 7. Đời sống, âm thanh, thời tiết

### 7.1 Đời sống

| Nhóm | Số lượng (ngày / đêm) | Hành vi |
|---|---|---|
| Đệ tử Sơn Môn (áo theo ngũ hành) | 12 / 3 | quét sân giờ Mão, học ở phòng giảng, ngồi trà |
| Khách hỏi việc | 3 (ba ghế) + 4 hàng chờ | tới theo lượt (`cases.js`) |
| Dân phố, người mua bán | 30 / 6 | chợ đại lộ, gánh hàng, trẻ con chạy |
| Lính canh thành | 4 / 4 | cửa Nam, mặt tường |
| Khách hành hương đi các thánh địa | 6–10 | tụ ở Bát Đạo Đình, Dịch trạm, nhà trọ |
| Người chơi (MMO) | theo phòng (≤ 60 / phòng, đã có test tải) | — |
| Chim sẻ, bồ câu | 30 | sân, mái; bay khi chuông Mão |
| Mèo phố | 3 | nằm trên quầy chợ, mái nhà |
| Cá chép | 20 | hai hồ sen |

### 7.2 Âm thanh

- **Nhạc nhà** (chủ đề chính của game) ở Sơn Môn; nhạc phố (sáo, tiếng rao) ở đại lộ; ngoài cửa Nam nhạc nhỏ dần thành gió đồng.
- **Chuông Mão** (Chung Lâu) và **trống Dậu** (Cổ Lâu) — nghe toàn máy chủ (§8.4); **chiêng giờ Tý** ở thành môn; tiếng **chuông am Vân Cốc** rất khẽ từ phía Bắc giờ Mão / Dậu (gợi tò mò).
- Tiếng bàn tính, tiếng bút, tiếng trà rót ở Trà Thất; tiếng gió lật trang sách ở Tàng Kinh.

### 7.3 Thời tiết và mùa

| Mùa / thời tiết | Biến đổi |
|---|---|
| Tết / Lập Xuân | câu đối đỏ trên mọi cửa, đèn lồng gấp đôi, an Thái Tuế toàn máy chủ ở Thái Tuế Điện (§10) |
| Xuân | đào nở trong thành (`tree_peach`, `lib_blossom`) |
| Hạ | mưa rào chiều: thầy Tử Bình vào bàn trong điện; mặt sân phản chiếu |
| Thu | Trung Thu: đèn lồng trăng dọc đại lộ, Thuyết Thư Lâu kể chuyện đêm |
| Đông | sân phủ sương muối mỏng; khói Trà Thất |
| Rằm / mùng 1 | sự kiện chung (dâng hương, phóng sinh tập thể — đi Bút Tháp) |

---

## 8. Hoạt động của vùng và liên kết

| Hoạt động | Nơi | Engine / code | Liên kết (tập) |
|---|---|---|---|
| Nhập môn, lễ lật trụ | BLD-01 | `analyze()`, form bát tự (có) | MQ-P-?? (0.1–0.2, TBD-03) |
| Lời phán Khổng tiên sinh | bậc Sơn Môn (POI-04) | `synthesis`, `dayun`, `liunian` | MQ-P-?? (0.4) |
| Giải án khách | BLD-09 | `cases.js` | MQ-1-?? (I.1) |
| Vận Mệnh Các | BLD-15 | `vanmenh.js`, `dayun` (web) | MQ-1-?? (I.3) |
| Thái Tuế, đèn | BLD-16 | `thaitue.js`, `taisui` (web) | MQ-1-?? (I.4); EV Tết (TBD-10) |
| Ghi tên Sổ Môn Phái | BLD-14 | cờ Mệnh Cách | BR-TT / BR-NT (TBD-03) |
| Thiên Bảng | BLD-12 | Đạo Hạnh, hệ số Nghịch Thiên | tập 04, 10 |
| Đánh chuông / trống | BLD-10, 11 | giờ can chi | DQ-?? (TBD-03) |
| Chuông gió theo hành | BLD-17 | `yong.primary` | ACT (TBD-09) |
| Vạch mặt quầy Đổi Mệnh | BLD-30 → 16 | `taisui › personalTaSui`, `anti-manipulation-data` | MQ-2-?? (TBD-03) |
| Ghép đội, đêm Vân Cốc | BLD-21 | — | BR-NT-?? (TBD-03), tập 10 |
| Chọn đạo thống | BLD-27 | `daozang-data › suggestDaozangChartAware` (sửa lỗi Phụ lục B) | tập 05 |
| Nhà riêng, sửa nhà | BLD-29, 05 | `zhai`, `xuankong`, `fs-cure › findCure` | Mệnh Đồ tầng KHÔNG GIAN (TBD-03); SKU trang trí (TBD-11) |
| Án nhà dân | BLD-23 | `npc.js › makeNpc`, `zhai`, `xuankong` | SQ-thanh-?? ×30 (TBD-03) |
| Y quán, chuyển hướng y tế | BLD-31 | `tcm › WUX_ZANG`, `MERIDIAN_CLOCK` | mọi chuỗi cứu người (TBD-03/05) |
| Kể chuyện | BLD-26 | — | LORE (TBD-02) |
| Kết nghĩa kim lan | BLD-08 | `hehun`, `nayin-relation` | tập 10 |
| Gieo quẻ (web) | BLD-19 | `que-ui.js` | — |

---

## 9. Lưu ý tôn trọng văn hóa

1. **Bảng theo căn cốt bị cấm.** Thiên Bảng Tây chỉ hiện phân bố ẩn danh; mọi danh sách tên dùng Đạo Hạnh (§14 bản sơ đồ tổng, trụ cột T2).
2. **iOS:** những gian bói cá nhân (xăm, hoa đăng, quẻ, Vận Mệnh Các, Thái Tuế Điện) tắt theo `features.js` — công trình **vẫn vào được** (không có «điện khóa vô lý»), nội dung đổi sang học; không dùng biển báo nói dối.
3. **Tam Thanh, bài vị tổ sư:** đặt trang nghiêm, không tương tác thân thể. Bài vị tổ sư Huyền Quán là hư cấu.
4. **Y Quán** là nơi chuyển hướng y tế: không có thuốc thật, không công thức thật, không chẩn bệnh người chơi.
5. **Định Mệnh Hội** đại diện cho **thói định mệnh luận và lừa đảo**, không đại diện cho người làm nghề xem tuổi nói chung; thoại của Thầy Tử Bình phải nói rõ điều này.
6. **Nhà riêng và kết nghĩa:** không lộ ngày sinh, không lộ lá số cho khách (§14 dữ liệu cá nhân).

---

## 10. Mã mới và câu hỏi mở

### 10.1 Mã mới của vùng

- `BLD-thanh-01` … `BLD-thanh-31` (§4).
- `POI-thanh-01` … `POI-thanh-14` (§6).
- Model mới (7): `thanh_phonggac`, `thanh_traththat_sau`, `thanh_phongthu`, `thanh_thienbang`, `thanh_nhatro`, `thanh_ngachmon`, `thanh_batdao`, `thanh_cottru`, `thanh_dichtram` (một số rất nhỏ). Còn lại tái dùng model có sẵn.
- NPC đề xuất (TBD-06): `NPC-thanh-trucdem`, `-thuthu`, `-giuhau`, `-thanhthu`, `-chutro`, `-tramtruong`, `-thuyetthu`, `-luongy`, 8 sứ giả Bát Đạo Đình (`NPC-thanh-su-<quẻ>`).
- Việc kỹ thuật (TBD-13): khoét cửa Chính Đường; thật hóa `ROOMS.chinhdien` và `ROOMS.thaitue` trong vỏ; giữ `ROOMS.vanmenh` như cảnh đặc biệt; bỏ một đoạn `wallRing` cho Bắc Ngách Môn; nội thất instanced cho Phường Tân Cư.

### 10.2 Câu hỏi mở

1. **Vận Mệnh Các:** chấp nhận ngoại lệ «hành lang 9 cổng là không gian đặc biệt» (§8.2 cho phép) hay mở rộng vỏ điện Tây (cần đổi `hall_main` thành model dài hơn)?
2. **Chung Lâu / Cổ Lâu:** `sect.js` dựng hai lầu giống hệt; tập này chốt chuông Đông – trống Tây. Cần đổi model một lầu cho khác dáng (lầu chuông thường có tầng trên mở thoáng)?
3. **Nhà riêng instanced** (BLD-29) có làm vỡ cảm giác «thế giới thật» không? Phương án khác: khu nhà riêng ngoài thành theo phường MMO (mỗi phòng 60 người có 60 lô).
4. **Bát Đạo Đình** dựng ở (0, 196) nằm trên vành `roadPath` (cung R 205 bắt đầu từ (0, 166)): kiểm để đường không xuyên đình — có thể phải nới cung R lên 215.
5. Các công trình thật hóa trong Sơn Môn đều là **M1** — đây là khối việc lớn nhất trước M2; tập 13 cần ước lượng lại (tập này đếm ~ 15 nội thất cần dựng).
