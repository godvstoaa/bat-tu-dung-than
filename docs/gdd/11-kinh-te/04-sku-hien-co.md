# 11 · Phần 04 — Danh mục SKU hiện có: 51 món Tàng Y Các

> Mỗi món đang có trong `src/game/cosmetics.js › ITEMS` được gán một mã `SKU-E-NN` (E = existing), kèm lý do của giá và bậc hiếm, chỗ lời văn cần sửa, tên trên iOS, và đề xuất giá kép Phúc Khí. Phần cuối bình giá 5 bộ ngũ hành (phần 01 §4.1) bằng 6 món mới `SKU-K-01..06`.

---

## 1. Quy ước mã

| Mẫu mã | Nghĩa |
|---|---|
| `SKU-E-NN` | món đang có trong `cosmetics.js`, theo đúng thứ tự trong mảng `ITEMS` (01–51) |
| `SKU-K-NN` | món mới để bình giá thân bộ ngũ hành (phần này §6) |
| Cột «id» | khóa `id` trong code — **không đổi id** khi đổi tên hiển thị, để tủ đồ người chơi và chuỗi MMO (`encodeCos`) không vỡ |

Mã SKU là mã **sản phẩm** (dùng cho kế toán, analytics, duyệt). Khi bán trên App Store / Google Play, mỗi món **không** là một sản phẩm cửa hàng riêng — người chơi mua Ngọc rồi mua món trong game (phần 09 §2). Chỉ `SKU-P-*`, `SKU-V-*`, `SKU-DL-*`, `SKU-B-*` có mã sản phẩm trên nền tảng.

---

## 2. Thống kê danh mục hiện có

| Nhóm | Số món | Tổng giá |
|---|---|---|
| Miễn phí (`free: true`) | 5 | — |
| Bán bằng Phúc Khí | 8 | 1.510 Phúc Khí |
| Bán bằng Ngọc | 38 | 9.470 Ngọc |
| Trong đó chỉ cho VIP | 4 | 2.560 Ngọc |
| Thuộc 5 bộ ngũ hành | 20 | 3.560 Ngọc |
| **Tổng** | **51** | |

Theo ô:

| Ô | id ô | Số món | Miễn phí | Phúc Khí | Ngọc |
|---|---|---|---|---|---|
| Phẩm phục | `robe` | 8 | 1 | 1 | 6 |
| Mũ · trâm | `head` | 7 | 0 | 1 | 6 |
| Sau lưng | `back` | 8 | 0 | 1 | 7 |
| Cầm tay | `hand` | 5 | 0 | 3 | 2 |
| Hào quang | `aura` | 7 | 1 | 0 | 6 |
| Vệt bước | `trail` | 6 | 1 | 1 | 4 |
| Ngự vật | `mount` | 5 | 1 | 0 | 4 |
| Khung tên | `frame` | 5 | 1 | 1 | 3 |

Theo bậc hiếm (`RARITY`):

| Bậc | Tên | Màu | Số món | Dải giá thực tế |
|---|---|---|---|---|
| 1 | Phàm | `#b9b2a4` | 8 (5 miễn phí) | 60 – 120 Phúc Khí |
| 2 | Linh | `#6fd48a` | 5 | 180 – 300 Phúc Khí |
| 3 | Huyền | `#5aa8ff` | 22 | 90 – 200 Ngọc |
| 4 | Tiên | `#c58bff` | 11 | 220 – 380 Ngọc |
| 5 | Thần | `#ffc44a` | 5 | 480 – 780 Ngọc |

---

## 3. Dải giá chuẩn (dùng cho mọi món mới)

Giá hiện có tuân một quy luật ngầm: **giá = giá nền của bậc × hệ số ô**. Phần này viết quy luật ra để mọi món mới (phần 05, 06, 08) định giá nhất quán.

### 3.1 Giá nền theo bậc

| Bậc | Tiền | Giá nền | Ý nghĩa thiết kế |
|---|---|---|---|
| Phàm | Phúc Khí | 100 | món đầu tiên người mới mua trong 1–3 ngày |
| Linh | Phúc Khí | 250 | món của tuần đầu |
| Huyền | Ngọc | 150 | ~1 tuần điểm danh; món «đẹp rõ» |
| Tiên | Ngọc | 260 | ~1,2 tuần điểm danh; có chuyển động / hiệu ứng |
| Thần | Ngọc | 640 | ~3 tuần điểm danh; luôn có điều kiện mở thêm |

### 3.2 Hệ số ô

| Ô | Hệ số | Lý do |
|---|---|---|
| `frame` khung tên | 0,6 | chỉ là viền CSS, chi phí làm thấp, ít người thấy ngoài thẻ |
| `head` mũ · trâm | 0,8 | mô hình nhỏ, bám xương Head |
| `trail` vệt bước | 0,8 | hạt hiệu ứng, chỉ thấy khi chạy |
| `hand` cầm tay | 0,85 | mô hình nhỏ, hiện cả khi đứng (`characters.js › hold`) |
| `back` sau lưng | 0,9 | mô hình vừa; cánh lớn → +20% (chi phí rig chuyển động) |
| `aura` hào quang | 1,0 | luôn hiện, hiệu ứng liên tục |
| `robe` phẩm phục | 1,05 | thứ người khác thấy đầu tiên |
| `mount` ngự vật | 1,3 | chỉ thấy khi bay, nhưng là món «khoe» lớn nhất, mô hình lớn |

### 3.3 Bảng giá chuẩn (bậc × ô)

Làm tròn tới 10. Dung sai cho phép **±25%** (câu 15 phần 01 §8.3) — vượt phải giải trình.

| Ô \ Bậc | Phàm (PK) | Linh (PK) | Huyền (Ngọc) | Tiên (Ngọc) | Thần (Ngọc) |
|---|---|---|---|---|---|
| frame | 60 | 150 | 90 | 160 | 480* |
| head | 80 | 200 | 120 | 210 | 510 |
| trail | 80 | 200 | 120 | 210 | 510 |
| hand | 90 | 210 | 130 | 220 | 540 |
| back | 90 | 230 | 140 | 230 (cánh: 280–320) | 580 (vòng lớn: 720) |
| aura | 100 | 250 | 150 | 260 | 640 |
| robe | 110 | 260 | 160 | 270 | 670 |
| mount | 130 | 330 | 200 | 340 | 830 |

\* Khung Thần đặt sàn 480 vì khung là biểu tượng danh dự (điều kiện chuỗi); hệ số 0,6 cho 384 quá rẻ so với điều kiện.

### 3.4 Đối chiếu: các món hiện có nằm ngoài dải

| Món | Giá thực | Giá chuẩn | Lệch | Giải trình |
|---|---|---|---|---|
| `y_tu` Tử Y | 380 | 270 | +41% | món VIP độc quyền, nhuộm 2 lớp; **giữ**, ghi giải trình «VIP-only, hiếm hơn Tiên thường» |
| `canh_phuong` Phượng Hỏa Dực | 320 | 280–320 (cánh) | 0 | trong dải cánh |
| `canh_hac` Tiên Hạc Dực | 320 | 280–320 | 0 | — |
| `quat_long` Vũ Phiến | 260 | 220 | +18% | trong dung sai |
| `trail_may` Đằng Vân Bộ | 300 PK | 200 PK | +50% | mây cuộn tốn hạt hơn vệt thường; **đề xuất hạ còn 240** để không đắt hơn phẩm phục Linh |
| `hac` Tiên Hạc | 780 | 830 | −6% | trong dung sai |
| `phap_luan` | 720 | 720 (vòng lớn) | 0 | — |
| `quan_sen` | 680 | 510 | +33% | điều kiện kép VIP + cấp 10; xem §5 về rủi ro T4 |
| `kim_quan` | 220 | 210 | +5% | — |
| `kiem_go` Kiếm Gỗ Đào | 120 PK | 90 PK | +33% | kiếm dài đeo chéo lưng thấy rõ hơn trâm, quạt cùng bậc; **giữ**, ghi giải trình — vẫn là món Phàm rẻ thứ ba |
| `phat_tran`, `den_long_tay` | 260 PK | 210 PK | +24% | trong dung sai; đèn có điểm sáng thật (chi phí hiển thị) |
| `khung_may` | 180 PK | 150 PK | +20% | trong dung sai |
| `aura_sen` | 640 | 640 | 0 | — |

---

## 4. Bảng 51 món

Cột «Kép PK» là giá Phúc Khí đề xuất thêm theo phần 02 §4.3 (để trống = không có giá kép). Cột «Vai bộ»: **T** = thân bộ (tính Hợp mệnh, giá chuẩn), **Tô** = tôn bộ (đẹp hơn, cùng ô, tính bộ nhưng không bắt buộc), — = không thuộc bộ.

### 4.1 Phẩm phục (`robe`)

| SKU | id | Tên | Bậc | Giá | Mở | Vai bộ | Kép PK |
|---|---|---|---|---|---|---|---|
| `SKU-E-01` | `y_menh` | Bản Mệnh Y | Phàm | miễn phí | — | — | — |
| `SKU-E-02` | `y_bach` | Bạch Y Thư Sinh | Linh | 240 PK | — | — | — |
| `SKU-E-03` | `y_tu` | Tử Y Chân Nhân | Tiên | 380 Ngọc | VIP | — | — |
| `SKU-E-04` | `y_moc` | Thanh Mộc Tiên Y | Huyền | 160 Ngọc | — | T (Mộc) | 600 |
| `SKU-E-05` | `y_hoa` | Ly Hỏa Chân Bào | Huyền | 160 Ngọc | — | T (Hỏa) | 600 |
| `SKU-E-06` | `y_tho` | Hậu Thổ Đạo Bào | Huyền | 160 Ngọc | — | T (Thổ) | 600 |
| `SKU-E-07` | `y_kim` | Canh Kim Kiếm Bào | Huyền | 160 Ngọc | — | T (Kim) | 600 |
| `SKU-E-08` | `y_thuy` | Huyền Thủy Long Bào | Huyền | 160 Ngọc | — | T (Thủy) | 600 |

**Lý do giá và bậc:**

- **`y_menh` (miễn phí, Phàm).** Áo nhập môn tô theo Dụng thần (`look` lấy từ người chơi, không từ danh mục). Đây là «áo của lá số»: luôn miễn phí, vì T1 «lá số là nhân vật» — không ai phải trả tiền để mặc màu của chính mình.
- **`y_bach` (240 PK, Linh).** Áo trắng thư sinh, chỉ đổi HSV, không mô hình mới → chi phí làm thấp, đặt Linh. Là mục tiêu tiết kiệm đầu tiên của người mới (≈ 5 ngày của người chơi A, 1,5 ngày của B). Thấp hơn giá chuẩn robe Linh 260 một chút để là «phẩm phục rẻ nhất có thể mua».
- **`y_tu` (380 Ngọc, Tiên, VIP).** Món độc quyền VIP. Giá cao hơn dải vì là phần thưởng thẩm mỹ chính của VIP; nhưng **VIP vẫn phải trả Ngọc** — VIP mở quyền mua, không tặng. Lý do: nếu tặng, người hủy VIP có giữ áo không sẽ thành tranh chấp; mua bằng Ngọc thì món là của người chơi vĩnh viễn kể cả khi hết VIP (phần 07 §3.4).
- **5 áo bộ (160 Ngọc, Huyền).** Cùng giá, cùng bậc: thân bộ phải bình đẳng giữa các hành (phần 01 §4.1). Giá 160 = giá chuẩn robe Huyền.

### 4.2 Mũ · trâm (`head`)

| SKU | id | Tên | Bậc | Giá | Mở | Vai bộ | Kép PK |
|---|---|---|---|---|---|---|---|
| `SKU-E-09` | `tram_go` | Trâm Gỗ Đào | Phàm | 60 PK | — | — | — |
| `SKU-E-10` | `dao_quan` | Ngân Đạo Quan | Huyền | 120 Ngọc | — | T (Kim) | 600 |
| `SKU-E-11` | `quan_la` | Liễu Diệp Quan | Huyền | 120 Ngọc | — | T (Mộc) | 600 |
| `SKU-E-12` | `kim_quan` | Tử Kim Quan · Lông Trĩ | Tiên | 220 Ngọc | — | **Tô** (Hỏa) | — |
| `SKU-E-13` | `dau_lap` | Đấu Lạp Mạng Sa | Huyền | 120 Ngọc | — | T (Thổ) | 600 |
| `SKU-E-14` | `tram_ngoc` | Bích Ngọc Trâm | Huyền | 120 Ngọc | — | T (Thủy) | 600 |
| `SKU-E-15` | `quan_sen` | Liên Hoa Quan | Thần | 680 Ngọc | VIP + cấp 10 | — | — |

**Lý do:**

- **`tram_go` (60 PK).** Món rẻ nhất danh mục. Cố ý: lần mua đầu tiên của người chơi nên xảy ra trong ngày đầu (60 PK ≈ La Bàn + nhang + lịch + 1 án + trà ngày 1) để họ học cách cửa hàng hoạt động mà không tốn tiền.
- **4 mũ bộ Huyền 120.** Giá chuẩn head Huyền.
- **`kim_quan` (220, Tiên).** Mô hình kim quan cắm hai lông trĩ dài có chuyển động lắc → chi phí rig cao hơn; Tiên. Hiện là món bắt buộc của bộ Hỏa → gây bất công giá bộ. Chuyển thành **tôn bộ** và thêm `SKU-K-01` làm thân bộ.
- **`quan_sen` (680, Thần, VIP + cấp 10).** Điều kiện kép. Xem §5.2 về rủi ro y phục chức sắc.

### 4.3 Sau lưng (`back`)

| SKU | id | Tên | Bậc | Giá | Mở | Vai bộ | Kép PK |
|---|---|---|---|---|---|---|---|
| `SKU-E-16` | `kiem_go` | Kiếm Gỗ Đào | Phàm | 120 PK | — | — | — |
| `SKU-E-17` | `kiem_moc` | Thanh Trúc Kiếm | Huyền | 140 Ngọc | — | T (Mộc) | 600 |
| `SKU-E-18` | `ho_lo` | Tử Kim Hồ Lô | Huyền | 140 Ngọc | — | T (Thổ) | 600 |
| `SKU-E-19` | `kiem_bao` | Song Kiếm Hàn Quang | Tiên | 240 Ngọc | — | **Tô** (Kim) | — |
| `SKU-E-20` | `o_giay` | Ô Giấy Dầu Vẽ Sen | Huyền | 140 Ngọc | — | T (Thủy) | 600 |
| `SKU-E-21` | `canh_phuong` | Phượng Hỏa Dực | Tiên | 320 Ngọc | — | **Tô** (Hỏa) | — |
| `SKU-E-22` | `canh_hac` | Tiên Hạc Dực | Tiên | 320 Ngọc | — | — | — |
| `SKU-E-23` | `phap_luan` | Bát Quái Pháp Luân | Thần | 720 Ngọc | VIP | — | — |

**Lý do:**

- **`kiem_go` (120 PK).** Bản thế tục của kiếm gỗ đào. Bản **khai quang** (hiệu ứng, chữ «do … ban») thuộc vòng giữa, nhận ở chuỗi Mao Sơn (phần 01 §2.2). Mô tả bản bán không được hứa trừ tà.
- **`kiem_bao` (240, Tiên).** Hai kiếm bắt chéo = hai mô hình → Tiên. Chuyển **tôn bộ** Kim; thân bộ mới `SKU-K-04`.
- **`canh_phuong`, `canh_hac` (320, Tiên, cánh).** Cánh có rig đập → +20% so với back Tiên thường. Hai cánh cùng giá dù một cái thuộc bộ: cánh hạc không thuộc bộ nào nên không bị ép mua.
- **`phap_luan` (720, Thần, VIP).** Vòng lớn xoay sau lưng, chiếm khung nhìn. Xem §5.3: **đổi tên bắt buộc**.

### 4.4 Cầm tay (`hand`)

| SKU | id | Tên | Bậc | Giá | Mở | Kép PK |
|---|---|---|---|---|---|---|
| `SKU-E-24` | `quat_giay` | Quạt Giấy Thư Pháp | Phàm | 90 PK | — | — |
| `SKU-E-25` | `phat_tran` | Phất Trần Bạch Vĩ | Linh | 260 PK | — | — |
| `SKU-E-26` | `den_long_tay` | Đăng Lung Dạ Hành | Linh | 260 PK | — | — |
| `SKU-E-27` | `la_ban_tay` | La Bàn Tam Hợp | Huyền | 130 Ngọc | — | 1.000 |
| `SKU-E-28` | `quat_long` | Vũ Phiến Gia Cát | Tiên | 260 Ngọc | — | — |

**Lý do:**

- Cầm tay là ô **duy nhất không có món bộ** → ô tốt nhất để đặt món giá Phúc Khí (3 trên 5 món).
- **`den_long_tay`.** «Sáng thật khi đêm» là chức năng thị giác (đèn chiếu sáng quanh người ban đêm). Đây là **tiện ích nhìn**, không phải lợi thế (không có quái, không có hoạt động cần thấy trong tối mà người không có đèn không làm được). Giữ Linh / Phúc Khí để ai cũng có.
- **`la_ban_tay` (130, Huyền).** La bàn của thầy địa lý là dụng cụ nghề, không phải pháp khí nghi lễ → bán được. Đề xuất giá kép 1.000 PK vì người chơi nghề phong thủy (sảnh Dương Trạch) nên có đường kiếm bằng cày.
- **`quat_long` (260, Tiên).** Nhân vật lịch sử (Gia Cát Lượng) — được, không phải nhân vật thờ.

### 4.5 Hào quang (`aura`)

| SKU | id | Tên | Bậc | Giá | Mở | Vai bộ | Kép PK |
|---|---|---|---|---|---|---|---|
| `SKU-E-29` | `aura_menh` | Gia Trì Bản Mệnh | Phàm | miễn phí | theo cấp gia trì | — | — |
| `SKU-E-30` | `aura_dao` | Đào Hoa Phi Vũ | Huyền | 150 Ngọc | — | T (Mộc) | 600 |
| `SKU-E-31` | `aura_lua` | Tam Muội Chân Hỏa | Tiên | 260 Ngọc | — | **Tô** (Hỏa) | — |
| `SKU-E-32` | `aura_batquai` | Bát Quái Trận | Tiên | 260 Ngọc | — | **Tô** (Thổ) | — |
| `SKU-E-33` | `aura_set` | Cửu Thiên Lôi Quang | Tiên | 260 Ngọc | — | **Tô** (Kim) | — |
| `SKU-E-34` | `aura_tuyet` | Hàn Tuyết Phiêu | Huyền | 150 Ngọc | — | T (Thủy) | 600 |
| `SKU-E-35` | `aura_sen` | Bộ Bộ Sinh Liên | Thần | 640 Ngọc | cấp 8 | — | — |

**Lý do:**

- Hào quang là món **luôn nhìn thấy** → hệ số 1,0. Skin hào quang đã mua hiện cả khi chưa đủ cấp gia trì (`GAME-V2` §3.2): người mua thấy ngay giá trị.
- **Ba hào quang Tiên (lửa, bát quái, sét)** dùng nhiều hạt hơn → Tiên. Chuyển **tôn bộ** cho Hỏa, Thổ, Kim; thân bộ mới `SKU-K-02`, `SKU-K-03`, `SKU-K-05`.
- **`aura_sen` (640, Thần, cấp 8).** Không cần VIP, chỉ cần cấp 8 → người chơi miễn phí chăm có được sau ~3 tuần (B: cấp 8 ngày 6; 640 Ngọc ≈ tuần 3). Điển tích «bước bước sinh sen» (Phật đản) — sen **đỡ** chân, không có hình Phật; đạt phần 01 §7.4. Mô tả hiện «Sen vàng nở dưới chân — cấp 8.» đạt.

### 4.6 Vệt bước (`trail`)

| SKU | id | Tên | Bậc | Giá | Mở | Kép PK |
|---|---|---|---|---|---|---|
| `SKU-E-36` | `trail_menh` | Bộ Pháp Bản Mệnh | Phàm | miễn phí | cấp 6 | — |
| `SKU-E-37` | `trail_may` | Đằng Vân Bộ | Linh | 300 PK (đề xuất 240) | — | — |
| `SKU-E-38` | `trail_sen` | Liên Hoa Bộ | Huyền | 120 Ngọc | — | 900 |
| `SKU-E-39` | `trail_lua` | Hỏa Vân Bộ | Huyền | 120 Ngọc | — | 900 |
| `SKU-E-40` | `trail_bang` | Băng Phách Bộ | Huyền | 120 Ngọc | — | 900 |
| `SKU-E-41` | `trail_sao` | Tinh Hà Bộ | Tiên | 220 Ngọc | — | — |

**Lý do:**

- Vệt bước Huyền đều 120 = giá chuẩn. Ba vệt Huyền có giá kép vì vệt bước không thuộc bộ — ô tốt cho sink Phúc Khí.
- **`trail_sen`.** Cánh sen **rơi** theo bước (không phải in dấu sen dưới đế để người khác giẫm) → đạt §7.4 phần 01.
- **`trail_sao` (220, Tiên).** Hạt vàng nhiều lớp → Tiên.

### 4.7 Ngự vật (`mount`)

| SKU | id | Tên | Bậc | Giá | Mở | Kép PK |
|---|---|---|---|---|---|---|
| `SKU-E-42` | `kiem` | Ngự Kiếm | Phàm | miễn phí | bay mở theo cấp 8 / VIP | — |
| `SKU-E-43` | `may` | Cân Đẩu Vân | Huyền | 200 Ngọc | — | 1.500 |
| `SKU-E-44` | `ho_lo_bay` | Hồ Lô Phi Hành | Huyền | 200 Ngọc | — | — |
| `SKU-E-45` | `dai_sen` | Liên Hoa Đài | Tiên | 360 Ngọc | — | — |
| `SKU-E-46` | `hac` | Tiên Hạc | Thần | 780 Ngọc | VIP | — |

**Lý do:**

- Ngự vật **chỉ đổi hình** khi bay; quyền bay vẫn theo cấp / VIP / cảnh giới (`GAME-V2` §3.2 và phần 01 §4.2). Tốc độ, độ cao **giống hệt** giữa mọi ngự vật — điều kiện bắt buộc để ngự vật là thẩm mỹ.
- **`may` có giá kép 1.500 PK:** Cân Đẩu Vân là hình tượng phổ biến nhất, nên có đường cày.
- **`dai_sen` (360, Tiên).** Xem §5.4: rủi ro hình tượng tòa sen.
- **`hac` (780, Thần, VIP).** Món VIP đắt nhất. Hình tượng tiên nhân cưỡi hạc phổ biến trong văn hóa Đạo giáo dân gian, không phải tượng thờ cụ thể → đạt.

### 4.8 Khung tên (`frame`)

| SKU | id | Tên | Bậc | Giá | Mở | Kép PK |
|---|---|---|---|---|---|---|
| `SKU-E-47` | `khung_tron` | Khung Mộc | Phàm | miễn phí | — | — |
| `SKU-E-48` | `khung_may` | Tường Vân | Linh | 180 PK | — | — |
| `SKU-E-49` | `khung_sen` | Liên Đài | Huyền | 90 Ngọc | — | 700 |
| `SKU-E-50` | `khung_ngoc` | Bích Ngọc | Huyền | 90 Ngọc | — | 700 |
| `SKU-E-51` | `khung_long` | Kim Long | Thần | 480 Ngọc | điểm danh 7 ngày liền | — |

**Lý do:**

- Khung tên chỉ hiện ở thẻ người chơi và nhãn tên MMO; **không** hiện ở Thiên Bảng tu (phần 01 M9).
- **`khung_long` (480, Thần, chuỗi 7).** Điều kiện chuỗi biến khung thành «khung của người đều đặn». Với đề xuất NG-1 (phần 03) điều kiện đổi thành «7 lần điểm danh trong 9 ngày» để người bận một ngày không mất cơ hội.

---

## 5. Sửa lời văn và rủi ro thiêng

### 5.1 Bảng sửa mô tả

| SKU | id | Mô tả hiện tại | Vấn đề | Mô tả đề xuất |
|---|---|---|---|---|
| `SKU-E-09` | `tram_go` | «Trâm gỗ đào cài búi tóc — trừ tà, giữ tâm.» | «trừ tà» = hứa tác dụng (phần 01 §7.1) | «Trâm gỗ đào cài búi tóc. Tương truyền gỗ đào là gỗ của người giữ tâm.» |
| `SKU-E-10` | `dao_quan` | «Đạo quan bạc cài búi, đạo sĩ chính tông.» | «chính tông» ngầm nói về địa vị tu thật | «Đạo quan bạc nhỏ cài búi tóc, kiểu mũ thường ngày của người học đạo.» |
| `SKU-E-03` | `y_tu` | «Tử khí đông lai — chỉ dành cho Chân nhân (VIP).» | «Chân nhân» là danh hiệu tu; xem §5.5 | «Áo tím ánh vàng, «tử khí đông lai» — dành cho Thượng Khách (VIP).» |
| `SKU-E-15` | `quan_sen` | «Mũ hoa sen vàng của bậc đắc đạo — VIP · cấp 10.» | «bậc đắc đạo» = món bán tự nhận cảnh giới (M2) | «Mũ kết cánh sen vàng bằng ánh sáng, kiểu mũ tiên trong tranh cổ — VIP · cấp 10.» |
| `SKU-E-23` | `phap_luan` | «Vòng bát quái vàng xoay sau lưng — VIP.» | tên món, xem §5.3 | giữ mô tả, đổi tên |
| `SKU-E-16` | `kiem_go` | «Thanh kiếm gỗ đào đeo chéo lưng.» | đạt; thêm câu phân biệt bản khai quang | «Thanh kiếm gỗ đào đeo chéo lưng. (Bản khai quang chỉ có ở Mao Sơn.)» |
| bộ ngũ hành (20 món) | — | không có câu về Hợp mệnh | sơ đồ tổng §11 yêu cầu | thêm dòng chuẩn phần 01 §7.2 |

### 5.2 `quan_sen` — Liên Hoa Quan

Trong Đạo giáo Toàn Chân, mũ hoa sen (莲花冠) là mũ nghi lễ của đạo sĩ có địa vị (phương trượng, cao công khi làm khoa nghi). Bán một chiếc «Liên Hoa Quan» y hệt mũ nghi lễ là chạm **T4** (y phục chức sắc có cấp bậc thật).

**Đề xuất:** giữ id `quan_sen`, đổi **hình**: cánh sen bằng ánh sáng vàng lơ lửng quanh búi tóc (dạng tiên nữ, tiên đồng trong tranh), không phải mũ cứng nhiều cánh của khoa nghi. Đổi tên hiển thị «Kim Liên Quang Quan» (mũ ánh sen vàng). Mũ hoa sen **thật** của Toàn Chân, nếu có trong game, thuộc vòng giữa và chỉ cố vấn Chung Nam quyết định ai được nhận. **Cần cố vấn Chung Nam xác nhận trước khi mở bán lại.**

### 5.3 `phap_luan` — Bát Quái Pháp Luân

Hai vấn đề:

1. «Pháp luân» (法輪, bánh xe Pháp) là biểu tượng Phật giáo; ghép với bát quái Đạo giáo tạo hình tượng lai không thuộc truyền thống nào.
2. «Pháp Luân» trùng tên một phong trào bị cấm và nhạy cảm chính trị ở Trung Quốc, và là chủ đề nhạy cảm ở Việt Nam. Một món bán tên «Pháp Luân» xoay sau lưng nhân vật có rủi ro bị hiểu sai, bị báo cáo, và rủi ro với hồ sơ cấp phép G1 (phần 09 §8.1).

**Quyết định đề xuất (bắt buộc trước khi bật thanh toán):** đổi tên hiển thị thành **«Bát Quái Kim Luân»**, giữ id `phap_luan` trong code (không vỡ tủ đồ), giữ hình vòng bát quái vàng (bỏ mọi nan hoa 8 cánh kiểu bánh xe Pháp nếu mô hình có).

### 5.4 `dai_sen` — Liên Hoa Đài

Đứng trên tòa sen là tư thế của tượng Phật, Bồ Tát (Quan Âm đứng tòa sen). Người chơi bay trên tòa sen vàng qua chợ, qua Phong Đô dễ gây phản cảm với người theo Phật giáo.

**Đề xuất:** đổi hình thành **lá sen lớn** (một tàu lá sen xanh viền vàng, như truyện cổ «đạp lá sen qua sông»), tên «Liên Diệp Phi Chu». Người đã mua giữ được tùy chọn hình cũ (không tước của người đã trả tiền), nhưng hình tòa sen **tự đổi sang lá sen** khi bay vào Bút Tháp, Yên Tử, Tạng Địa. Cần cố vấn Bút Tháp / Yên Tử xác nhận.

### 5.5 Tên gọi VIP «Chân Nhân»

Canon (`00-KINH-DIEN-CHUNG.md` §7, sơ đồ tổng §11) và code (`wardrobe-ui.js`: «👑 Chân Nhân (VIP)», `main.js`: «👑 Chân Nhân · +30 Ngọc hôm nay») gọi VIP là **Chân Nhân**. Trong Đạo giáo, «chân nhân» (真人) là danh hiệu người tu đã đắc đạo hoặc được triều đình / Thiên Sư phong; chính game dùng danh hiệu này cho NPC tôn kính (`huyen_hu` Huyền Hư chân nhân, `dan_dinh` Đan Đỉnh chân nhân). Bán danh hiệu «Chân Nhân» bằng gói tháng là bán danh hiệu tu — trái tinh thần M2 và nhóm vòng giữa.

**Đề xuất cho chủ dự án (câu hỏi mở, README):** đổi tên hiển thị VIP thành **«Thượng Khách»** (khách quý của quán) — hợp với bối cảnh «quán», không mang nghĩa tu. Mã kỹ thuật (`state.vip`, `vipActive`, `VIP_DAILY`) giữ nguyên. Toàn bộ tài liệu này gọi VIP là **VIP Thượng Khách** từ phần 07, kèm chú thích tên cũ. Nếu chủ dự án giữ «Chân Nhân», cần cố vấn Long Hổ / Chung Nam đồng ý bằng văn bản.

---

## 6. Bình giá 5 bộ ngũ hành

### 6.1 Cấu trúc mới của bộ

Mỗi bộ có **4 ô thân** (robe, head, back, aura). Mỗi ô nhận **thân bộ** (giá chuẩn) **hoặc tôn bộ** (đẹp hơn, đắt hơn). Hợp mệnh tính khi mỗi ô có **một** trong hai.

Thay đổi code đề xuất cho `cosmetics.js › SETS`: `pieces` thành mảng các nhóm, ví dụ `pieces: [['y_hoa'], ['hoa_quan', 'kim_quan'], ['hoa_dai', 'canh_phuong'], ['aura_hoa', 'aura_lua']]`, và `setBonus` kiểm «mỗi nhóm có ít nhất một món đang mặc». `encodeCos` / `decodeCos` không đổi (vẫn theo ô).

### 6.2 Sáu món thân bộ mới

| SKU | id đề xuất | Bộ | Ô | Tên | Bậc | Giá | Kép PK | Hình |
|---|---|---|---|---|---|---|---|---|
| `SKU-K-01` | `hoa_quan` | Hỏa | head | Xích Đồng Quan | Huyền | 120 Ngọc | 600 | đạo quan đồng đỏ nhỏ, một chiếc trâm son |
| `SKU-K-02` | `aura_hoa` | Hỏa | aura | Đăng Hỏa Vi Quang | Huyền | 150 Ngọc | 600 | vòng đốm lửa nhỏ như đèn dầu quanh chân, dịu hơn Tam Muội |
| `SKU-K-03` | `aura_tho` | Thổ | aura | Hoàng Sa Toàn | Huyền | 150 Ngọc | 600 | bụi vàng xoáy chậm dưới chân (khớp mote Hậu Thổ của `WX_GIATRI`) |
| `SKU-K-04` | `kim_kiem` | Kim | back | Bạch Ngân Kiếm | Huyền | 140 Ngọc | 600 | một thanh kiếm vỏ bạc đeo chéo |
| `SKU-K-05` | `aura_kim` | Kim | aura | Kim Phong Ảnh | Huyền | 150 Ngọc | 600 | ánh kim mảnh như gió lướt quanh thân |
| `SKU-K-06` | `hoa_dai` | Hỏa | back | Chu Sa Hồ Lô | Huyền | 140 Ngọc | 600 | hồ lô sơn son đeo hông lưng |

### 6.3 Giá bộ sau bình giá

| Bộ | Thân bộ (4 món) | Tổng Ngọc | Tổng PK | Tôn bộ có sẵn |
|---|---|---|---|---|
| Mộc | y_moc · quan_la · kiem_moc · aura_dao | 570 | 2.400 | — (đề xuất thêm tôn bộ Mộc ở mùa đầu, phần 08) |
| Hỏa | y_hoa · **hoa_quan** · **hoa_dai** · **aura_hoa** | 570 | 2.400 | kim_quan 220, canh_phuong 320, aura_lua 260 |
| Thổ | y_tho · dau_lap · ho_lo · **aura_tho** | 570 | 2.400 | aura_batquai 260 |
| Kim | y_kim · dao_quan · **kim_kiem** · **aura_kim** | 570 | 2.400 | kiem_bao 240, aura_set 260 |
| Thủy | y_thuy · tram_ngoc · o_giay · aura_tuyet | 570 | 2.400 | — (đề xuất thêm ở mùa đầu) |

### 6.4 Người đã mua bộ đắt trước khi bình giá

Người có Dụng Hỏa đã trả 960 Ngọc cho bộ Hỏa cũ (chênh 390 so với 570). Khi bình giá:

- **Tặng tự động** các món thân bộ mới của bộ đó (họ đã có bộ đầy đủ, nay có thêm phương án rẻ).
- **Hoàn chênh lệch** bằng Ngọc Tặng: `tổng Ngọc đã trả cho 4 ô của bộ − 570`. Ví dụ bộ Hỏa: +390; Kim: +210; Thổ: +110.
- Thông báo trong game một lần, giải thích lý do («giá bộ phụ thuộc lá số là không công bằng; quán sửa và hoàn phần chênh»).

Chi phí ước tính: chỉ phát sinh với Ngọc trong thời gian thử nghiệm (chưa có thanh toán thật) → không có chi phí tiền. **Nên làm trước khi bật thanh toán.**

---

## 7. Tên trên iOS (Học Quán)

Bản iOS dùng `TEXT` trung tính (phần 11). Món mang chữ «mệnh», «vận» hoặc gắn chức năng bói đổi tên hiển thị trên build iOS (id không đổi).

| SKU | id | Tên web | Tên iOS |
|---|---|---|---|
| `SKU-E-01` | `y_menh` | Bản Mệnh Y | Y Phục Nhập Học |
| `SKU-E-29` | `aura_menh` | Gia Trì Bản Mệnh | Hào Quang Ngũ Hành |
| `SKU-E-36` | `trail_menh` | Bộ Pháp Bản Mệnh | Bộ Pháp Ngũ Hành |
| `SKU-E-03` | `y_tu` | Tử Y Chân Nhân → Tử Y Thượng Khách | Tử Y Thượng Khách |
| `SKU-E-27` | `la_ban_tay` | La Bàn Tam Hợp | La Bàn Tam Hợp (giữ — La Bàn Đài có trên iOS) |
| bộ ngũ hành | — | «Hợp mệnh» | «Hợp hành» (+10% Điểm Tu Học), tính theo hành Dụng thần như web; mô tả trên iOS: «bộ trùng hành bạn đang học bổ sung» |
| mọi món còn lại | — | giữ nguyên | giữ nguyên |

---

## 8. Món VIP độc quyền — lý do và giới hạn

| SKU | Món | Vì sao chỉ VIP | Giới hạn |
|---|---|---|---|
| `SKU-E-03` | Tử Y | phẩm phục nhận diện người ủng hộ | vẫn trả Ngọc; giữ vĩnh viễn |
| `SKU-E-15` | Liên Hoa Quan → Kim Liên Quang Quan | phần thưởng VIP lâu (kèm cấp 10) | §5.2 |
| `SKU-E-23` | Pháp Luân → Bát Quái Kim Luân | món «khoe» lưng | §5.3 |
| `SKU-E-46` | Tiên Hạc | ngự vật VIP | tốc độ như mọi ngự vật |

Quy tắc: **tỷ lệ món VIP độc quyền ≤ 8% danh mục Ngọc** (hiện 4 / 38 = 10,5% — sẽ về dưới 8% khi danh mục mở rộng ở phần 05, 06, vì món mới VIP-only tối đa 1 / chương). Không có món VIP độc quyền nào là **thân bộ** (Hợp mệnh không bao giờ cần VIP).

---

## 9. Lint danh mục — đặc tả test

Test thêm vào `scripts/test-game-cosmetics.mjs` (hoặc tệp test riêng do tài liệu 13 đặt):

| # | Khẳng định | Dữ liệu |
|---|---|---|
| L1 | Mọi món có `id` duy nhất, `slot ∈ SLOTS`, `rarity ∈ 1..5` | `ITEMS` |
| L2 | Khóa của món ⊂ {id, slot, set, name, rarity, free, price, unlock, look, desc, season, region, platforms, giftable, iosName, iosDesc, dual, sku, consultPending} | `ITEMS` |
| L3 | Không khóa nào khớp `/daoHanh|dao_hanh|merit|congduc|cong_duc|karma|nghiep|realm|canhgioi|menhdo|menh_do|tienthien/i` | `ITEMS`, `SETS` |
| L4 | Giá Ngọc chia hết cho 10; giá PK chia hết cho 10 | `price` |
| L5 | Giá nằm trong dải chuẩn §3.3 ±25%, trừ danh sách giải trình §3.4 | `price`, `slot`, `rarity` |
| L6 | Mỗi bộ: tổng giá **thân bộ** = 570 Ngọc và có giá kép 2.400 PK | `SETS` |
| L7 | Không món VIP-only nào là thân bộ | `SETS`, `unlock.vip` |
| L8 | `name` và `desc` không khớp regex từ cấm (phần 01 §7.1), so cả bản bỏ dấu | `name`, `desc` |
| L9 | `name` không chứa tên 60 vị Thái Tuế (phiên âm Hán Việt từ `TAISUI_60`), không chứa «Phật», «Bồ Tát», «Pháp Luân» | `name` |
| L10 | Món bộ có câu «Không ảnh hưởng Đạo Hạnh, cảnh giới, công đức» trong `desc` | món có `set` |
| L11 | Tỷ lệ món VIP-only ≤ 8% danh mục Ngọc (cảnh báo, không fail, cho tới hết SEASON-01) | `unlock.vip` |
| L12 | `encodeCos(decodeCos(s)) === cleanCos(s)` cho mọi món (đã có ý tương tự trong test MMO) | — |

---

## 10. Thẻ thiết kế từng món

Mỗi thẻ: hình (để họa sĩ làm lại / kiểm khi sửa), lý do bậc và giá (so dải chuẩn §3.3), người mua dự kiến, lưu ý. «Chuẩn» = giá dải chuẩn của ô × bậc.

### 10.1 Phẩm phục

**`SKU-E-01` · `y_menh` · Bản Mệnh Y** — robe · Phàm · miễn phí
- Hình: áo theo màu hành Dụng thần (`yong.primary`), đai theo Hỷ thần; mỗi người một màu.
- Vì sao miễn phí: áo của lá số; T1 — không ai trả tiền để mặc màu của mình.
- Người mua: mọi người chơi từ phút đầu.
- Lưu ý: trên iOS tên «Y Phục Nhập Học»; không bao giờ có bản trả phí «Bản Mệnh Y thượng hạng».

**`SKU-E-02` · `y_bach` · Bạch Y Thư Sinh** — robe · Linh · 240 PK (chuẩn 260, −8%)
- Hình: trắng ngà `P(0.12, 0.06, 0.96)`, đai lam xám `P(0.58, 0.35, 0.6)`.
- Vì sao: chỉ đổi HSV, chi phí làm thấp → Linh; hạ nhẹ dưới chuẩn để là phẩm phục rẻ nhất mua được.
- Người mua: người mới tuần đầu (A: ~5 ngày chơi; B: ~1,5 ngày).
- Lưu ý: áo trắng ở Phong Đô dễ gợi tang phục — không vấn đề vì áo trắng thư sinh là hình ảnh phổ biến; giữ.

**`SKU-E-03` · `y_tu` · Tử Y Chân Nhân** — robe · Tiên · 380 Ngọc (chuẩn 270, +41%) · VIP
- Hình: tím `P(0.78, 0.6, 0.55)`, viền vàng `P(0.12, 0.7, 0.9)`.
- Vì sao: món nhận diện VIP; vượt dải có giải trình (§3.4).
- Người mua: VIP muốn mặc áo riêng.
- Lưu ý: đổi tên / mô tả theo §5.5; áo tím từng là áo vua ban cho cao tăng, đạo sĩ — mô tả mới chỉ dùng thành ngữ «tử khí đông lai», không nói phẩm vị tu.

**`SKU-E-04` · `y_moc` · Thanh Mộc Tiên Y** — robe · Huyền · 160 Ngọc (chuẩn) · thân bộ Mộc
- Hình: lục tùng `P(0.36, 0.6, 0.6)`, thêu lá liễu, đai vàng.
- Vì sao: thân bộ phải đúng giá chuẩn và bằng các hành khác.
- Người mua: người Dụng Mộc (Hợp mệnh) và người thích màu xanh.
- Lưu ý: thêm giá kép 600 PK.

**`SKU-E-05` · `y_hoa` · Ly Hỏa Chân Bào** — robe · Huyền · 160 Ngọc · thân bộ Hỏa
- Hình: đỏ son `P(0.99, 0.82, 0.8)`, đai cam vàng.
- Vì sao: như trên.
- Người mua: người Dụng Hỏa; người mặc dịp Tết.
- Lưu ý: kiểm màu đỏ trên màn hình tối không chói (tương phản với chữ tên).

**`SKU-E-06` · `y_tho` · Hậu Thổ Đạo Bào** — robe · Huyền · 160 Ngọc · thân bộ Thổ
- Hình: vàng đất `P(0.1, 0.7, 0.78)`, đai nâu sẫm.
- Vì sao: như trên.
- Người mua: người Dụng Thổ.
- Lưu ý: «đạo bào» ở đây là áo thường của người học đạo, không có ký hiệu cấp bậc.

**`SKU-E-07` · `y_kim` · Canh Kim Kiếm Bào** — robe · Huyền · 160 Ngọc · thân bộ Kim
- Hình: trắng bạc `P(0.12, 0.08, 0.95)`, đai ánh bạc.
- Vì sao: như trên.
- Người mua: người Dụng Kim — ví dụ lá số mẫu `MAU-A` Dụng Thủy / Hỷ Kim **không** hợp bộ này (Hợp mệnh theo Dụng, không theo Hỷ).
- Lưu ý: gần màu `y_bach` — phân biệt bằng đai và hoa văn kiếm.

**`SKU-E-08` · `y_thuy` · Huyền Thủy Long Bào** — robe · Huyền · 160 Ngọc · thân bộ Thủy
- Hình: lam huyền `P(0.62, 0.65, 0.4)`, đai lam ngọc.
- Vì sao: như trên.
- Người mua: người Dụng Thủy (ví dụ `MAU-A`, `MAU-B`).
- Lưu ý: chữ «Long Bào» trong lịch sử là áo vua; ở đây nghĩa «áo vân rồng nước», mô tả nói rõ «lam huyền như vực rồng», không mang bổ tử.

### 10.2 Mũ · trâm

**`SKU-E-09` · `tram_go` · Trâm Gỗ Đào** — head · Phàm · 60 PK (chuẩn 80, −25%)
- Hình: trâm gỗ nâu đỏ cài búi.
- Vì sao: món rẻ nhất danh mục, cố ý — lần mua đầu ngày đầu.
- Người mua: người mới.
- Lưu ý: sửa mô tả bỏ «trừ tà» (§5.1).

**`SKU-E-10` · `dao_quan` · Ngân Đạo Quan** — head · Huyền · 120 Ngọc · thân bộ Kim
- Hình: đạo quan bạc nhỏ cài búi.
- Vì sao: chuẩn head Huyền.
- Người mua: người Dụng Kim, người thích phong cách đạo sĩ.
- Lưu ý: sửa mô tả bỏ «chính tông».

**`SKU-E-11` · `quan_la` · Liễu Diệp Quan** — head · Huyền · 120 Ngọc · thân bộ Mộc
- Hình: vòng lá liễu quanh búi.
- Vì sao: chuẩn.
- Người mua: người Dụng Mộc.
- Lưu ý: —

**`SKU-E-12` · `kim_quan` · Tử Kim Quan · Lông Trĩ** — head · Tiên · 220 Ngọc (chuẩn 210, +5%) · tôn bộ Hỏa
- Hình: kim quan cắm đôi lông trĩ dài lắc theo bước.
- Vì sao: rig lông lắc → Tiên.
- Người mua: người Dụng Hỏa muốn bộ đẹp hơn; người thích phong cách võ tướng.
- Lưu ý: sau bình giá không còn bắt buộc cho Hợp mệnh.

**`SKU-E-13` · `dau_lap` · Đấu Lạp Mạng Sa** — head · Huyền · 120 Ngọc · thân bộ Thổ
- Hình: nón lá rộng vành buông mạng.
- Vì sao: chuẩn.
- Người mua: người Dụng Thổ; người thích hình ảnh giang hồ ẩn sĩ.
- Lưu ý: mạng sa che mặt một phần — cho phép vén lên khi trò chuyện (biểu cảm).

**`SKU-E-14` · `tram_ngoc` · Bích Ngọc Trâm** — head · Huyền · 120 Ngọc · thân bộ Thủy
- Hình: trâm ngọc lam rủ tua châu.
- Vì sao: chuẩn.
- Người mua: người Dụng Thủy.
- Lưu ý: —

**`SKU-E-15` · `quan_sen` · Liên Hoa Quan** — head · Thần · 680 Ngọc (chuẩn 510, +33%) · VIP + cấp 10
- Hình hiện tại: mũ hoa sen vàng. Hình đề xuất: cánh sen ánh sáng lơ lửng (§5.2).
- Vì sao: điều kiện kép, phần thưởng VIP dài hạn.
- Người mua: VIP lâu năm.
- Lưu ý: rủi ro T4; chờ cố vấn Chung Nam.

### 10.3 Sau lưng

**`SKU-E-16` · `kiem_go` · Kiếm Gỗ Đào** — back · Phàm · 120 PK (chuẩn 90, +33%, có giải trình)
- Hình: kiếm gỗ đào đeo chéo.
- Vì sao: §3.4.
- Người mua: người mới thích kiếm.
- Lưu ý: tách bản khai quang (vòng giữa).

**`SKU-E-17` · `kiem_moc` · Thanh Trúc Kiếm** — back · Huyền · 140 Ngọc · thân bộ Mộc
- Hình: kiếm vỏ trúc xanh.
- Vì sao: chuẩn.
- Người mua: người Dụng Mộc.
- Lưu ý: —

**`SKU-E-18` · `ho_lo` · Tử Kim Hồ Lô** — back · Huyền · 140 Ngọc · thân bộ Thổ
- Hình: hồ lô tím vàng đeo hông lưng.
- Vì sao: chuẩn.
- Người mua: người Dụng Thổ.
- Lưu ý: mô tả «đựng đan dược» — giữ, đó là đạo cụ hình ảnh, không hứa tác dụng.

**`SKU-E-19` · `kiem_bao` · Song Kiếm Hàn Quang** — back · Tiên · 240 Ngọc (chuẩn 230, +4%) · tôn bộ Kim
- Hình: hai kiếm bạc bắt chéo.
- Vì sao: hai mô hình → Tiên.
- Người mua: người Dụng Kim muốn bộ đẹp hơn.
- Lưu ý: thân bộ mới `SKU-K-04`.

**`SKU-E-20` · `o_giay` · Ô Giấy Dầu Vẽ Sen** — back · Huyền · 140 Ngọc · thân bộ Thủy
- Hình: ô giấy dầu xếp đeo lưng.
- Vì sao: chuẩn.
- Người mua: người Dụng Thủy.
- Lưu ý: khi trời mưa trong game, ô có thể tự mở (hoạt cảnh, tùy tài liệu 12).

**`SKU-E-21` · `canh_phuong` · Phượng Hỏa Dực** — back · Tiên · 320 Ngọc (dải cánh) · tôn bộ Hỏa
- Hình: cánh lửa phượng hoàng khẽ đập.
- Vì sao: rig cánh → dải cánh 280–320.
- Người mua: người thích món «khoe».
- Lưu ý: thu nhỏ 50% trong nội thất (phần 01 §8.3 câu 24).

**`SKU-E-22` · `canh_hac` · Tiên Hạc Dực** — back · Tiên · 320 Ngọc
- Hình: cánh hạc trắng viền đen.
- Vì sao: như trên; không thuộc bộ nên không ép ai mua.
- Người mua: người thích hình tượng tiên hạc.
- Lưu ý: thu nhỏ trong nội thất.

**`SKU-E-23` · `phap_luan` · Bát Quái Pháp Luân → Bát Quái Kim Luân** — back · Thần · 720 Ngọc (dải vòng lớn) · VIP
- Hình: vòng bát quái vàng xoay sau lưng.
- Vì sao: vòng lớn chiếm khung nhìn → Thần.
- Người mua: VIP.
- Lưu ý: §5.3 — đổi tên bắt buộc.

### 10.4 Cầm tay

**`SKU-E-24` · `quat_giay` · Quạt Giấy Thư Pháp** — hand · Phàm · 90 PK (chuẩn)
- Hình: quạt giấy chữ «道».
- Vì sao: chuẩn.
- Người mua: người mới.
- Lưu ý: chữ «道» trên quạt được (phần 01 §7.4).

**`SKU-E-25` · `phat_tran` · Phất Trần Bạch Vĩ** — hand · Linh · 260 PK (chuẩn 210, +24%)
- Hình: phất trần lông trắng.
- Vì sao: lông có chuyển động.
- Người mua: người thích hình ảnh đạo sĩ.
- Lưu ý: phất trần là đồ dùng phổ biến, không phải pháp khí nghi lễ đặc thù — bán được.

**`SKU-E-26` · `den_long_tay` · Đăng Lung Dạ Hành** — hand · Linh · 260 PK (+24%)
- Hình: đèn lồng cầm tay, sáng thật khi đêm.
- Vì sao: đèn điểm có chi phí hiển thị.
- Người mua: người chơi ban đêm.
- Lưu ý: tiện ích nhìn, không lợi thế (§4.4).

**`SKU-E-27` · `la_ban_tay` · La Bàn Tam Hợp** — hand · Huyền · 130 Ngọc (chuẩn) · kép 1.000 PK
- Hình: la bàn đồng của thầy địa lý.
- Vì sao: chuẩn.
- Người mua: người làm sảnh Dương Trạch.
- Lưu ý: mặt la bàn chỉ có vạch, không có chữ quẻ đọc được (tránh thành «la bàn bói»).

**`SKU-E-28` · `quat_long` · Vũ Phiến Gia Cát** — hand · Tiên · 260 Ngọc (chuẩn 220, +18%)
- Hình: quạt lông trắng quân sư.
- Vì sao: lông nhiều lớp.
- Người mua: người thích nhân vật lịch sử.
- Lưu ý: —

### 10.5 Hào quang

**`SKU-E-29` · `aura_menh` · Gia Trì Bản Mệnh** — aura · Phàm · miễn phí
- Hình: hào quang theo hành Dụng thần (`WX_GIATRI`), mở theo cấp.
- Vì sao miễn phí: như `y_menh`.
- Lưu ý: iOS «Hào Quang Ngũ Hành».

**`SKU-E-30` · `aura_dao` · Đào Hoa Phi Vũ** — aura · Huyền · 150 Ngọc · thân bộ Mộc
- Hình: cánh đào bay quanh người.
- Lưu ý: «đào hoa» trong mệnh lý là sao tình duyên — mô tả chỉ nói cánh hoa đào, không nhắc «sao đào hoa».

**`SKU-E-31` · `aura_lua` · Tam Muội Chân Hỏa** — aura · Tiên · 260 Ngọc · tôn bộ Hỏa
- Hình: lửa dưới chân.
- Lưu ý: kiểm nhấp nháy ≤ 3 lần / giây; thân bộ mới `SKU-K-02`.

**`SKU-E-32` · `aura_batquai` · Bát Quái Trận** — aura · Tiên · 260 Ngọc · tôn bộ Thổ
- Hình: trận bát quái vàng xoay dưới chân (ánh sáng).
- Lưu ý: dạng ánh sáng — đạt phần 01 §7.4; thân bộ mới `SKU-K-03`.

**`SKU-E-33` · `aura_set` · Cửu Thiên Lôi Quang** — aura · Tiên · 260 Ngọc · tôn bộ Kim
- Hình: tia sét tím quanh thân.
- Lưu ý: rủi ro nhấp nháy cao nhất danh mục — giới hạn tần suất tia; chế độ giảm chuyển động thay bằng quầng tím tĩnh; thân bộ mới `SKU-K-05`.

**`SKU-E-34` · `aura_tuyet` · Hàn Tuyết Phiêu** — aura · Huyền · 150 Ngọc · thân bộ Thủy
- Hình: tuyết bay lả tả.

**`SKU-E-35` · `aura_sen` · Bộ Bộ Sinh Liên** — aura · Thần · 640 Ngọc · cấp 8
- Hình: sen vàng nở dưới chân.
- Vì sao: Thần không cần VIP — món Thần đầu tiên người chơi miễn phí chăm có được (~tuần 3).
- Lưu ý: tắt trong chánh điện chùa.

### 10.6 Vệt bước

**`SKU-E-36` · `trail_menh` · Bộ Pháp Bản Mệnh** — trail · Phàm · miễn phí (mở cấp 6)
**`SKU-E-37` · `trail_may` · Đằng Vân Bộ** — trail · Linh · 300 PK (đề xuất 240) — mây cuộn; hạ giá để không đắt hơn phẩm phục Linh.
**`SKU-E-38` · `trail_sen` · Liên Hoa Bộ** — trail · Huyền · 120 Ngọc · kép 900 PK — cánh sen **rơi**, không in dấu dưới đế.
**`SKU-E-39` · `trail_lua` · Hỏa Vân Bộ** — trail · Huyền · 120 Ngọc · kép 900 PK — đốm lửa bám gót.
**`SKU-E-40` · `trail_bang` · Băng Phách Bộ** — trail · Huyền · 120 Ngọc · kép 900 PK — tinh thể băng.
**`SKU-E-41` · `trail_sao` · Tinh Hà Bộ** — trail · Tiên · 220 Ngọc (chuẩn 210, +5%) — bụi sao vàng nhiều lớp.

Vệt bước không thuộc bộ → ô tốt nhất cho giá kép Phúc Khí; ba vệt Huyền đều có giá kép.

### 10.7 Ngự vật

**`SKU-E-42` · `kiem` · Ngự Kiếm** — mount · Phàm · miễn phí — kiếm bay dưới chân; sau tách Ngự Vân Thường (phần 01 §4.2), người bay thấp bằng VIP / cấp 8 thấy mây thấp mặc định, Ngự Kiếm hiện khi đạt cảnh giới 3.
**`SKU-E-43` · `may` · Cân Đẩu Vân** — mount · Huyền · 200 Ngọc · kép 1.500 PK — hình tượng phổ biến nhất, có đường cày.
**`SKU-E-44` · `ho_lo_bay` · Hồ Lô Phi Hành** — mount · Huyền · 200 Ngọc — hồ lô tím vàng.
**`SKU-E-45` · `dai_sen` · Liên Hoa Đài** — mount · Tiên · 360 Ngọc (chuẩn 340, +6%) — §5.4: biến thể lá sen, tự đổi khi vào vùng Phật giáo.
**`SKU-E-46` · `hac` · Tiên Hạc** — mount · Thần · 780 Ngọc (chuẩn 830, −6%) · VIP — hạc trắng sải cánh; tốc độ như mọi ngự vật.

### 10.8 Khung tên

**`SKU-E-47` · `khung_tron` · Khung Mộc** — frame · Phàm · miễn phí.
**`SKU-E-48` · `khung_may` · Tường Vân** — frame · Linh · 180 PK (chuẩn 150, +20%) — viền mây lành.
**`SKU-E-49` · `khung_sen` · Liên Đài** — frame · Huyền · 90 Ngọc · kép 700 PK — viền sen hồng; cũng là món trong `SKU-B-01`.
**`SKU-E-50` · `khung_ngoc` · Bích Ngọc** — frame · Huyền · 90 Ngọc · kép 700 PK — viền ngọc bích.
**`SKU-E-51` · `khung_long` · Kim Long** — frame · Thần · 480 Ngọc (sàn khung Thần) · chuỗi điểm danh — khung danh dự của người đều đặn; điều kiện đổi theo NG-1.

---

## 11. Checklist nghiệm thu phần 04

- [ ] 51 món có mã `SKU-E-01..51` trong dữ liệu danh mục (trường `sku`) hoặc bảng ánh xạ riêng.
- [ ] 6 mô tả §5.1 đã sửa.
- [ ] `phap_luan` hiển thị «Bát Quái Kim Luân» trước khi bật thanh toán.
- [ ] Quyết định về tên VIP (Thượng Khách / Chân Nhân) có chữ ký chủ dự án.
- [ ] `quan_sen`, `dai_sen` có ý kiến cố vấn.
- [ ] 6 món `SKU-K-01..06` có mô hình / hiệu ứng, bộ mới chạy `setBonus` theo nhóm.
- [ ] Hoàn chênh lệch bộ đắt (§6.4) chạy một lần.
- [ ] Bảng tên iOS §7 áp dụng ở build `--mode ios`.
- [ ] Lint L1–L12 chạy trong `npm run test:game`.
