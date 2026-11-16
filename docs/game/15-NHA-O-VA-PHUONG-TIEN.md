# 15 · Nhà ở, vật phẩm, phương tiện

> **Trạng thái:** `[ĐÃ CÓ]`
> **Bộ phận chủ trì:** Thiết kế game · Backend (sổ nhà) · Client/3D (dựng phòng)
> **Nguồn sự thật trong mã:** `src/game/estate-core.js`, `src/game/estate.js`, `src/game/estate-layout.js`, `src/game/home-edit.js`, `src/game/homefs.js`, `src/game/items.js`, `src/game/shop-ui.js`, `src/game/shop-data.js`, `src/game/vehicles.js`, `worker/estate.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 15
> **Test:** `scripts/test-game-estate.mjs`, `scripts/test-game-mansion.mjs`, `scripts/test-game-homes.mjs`, `scripts/test-game-items.mjs`, `scripts/test-game-vehicles.mjs`
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §6, §7; phần nhà trong nhật ký `GAME-V2-THIET-KE`; `NHA-DIADIEM-MANIFEST` §2 (phần mua bán) vẫn hiệu lực
> **Kiểm với mã ngày:** 2026-11-16

## 15.0 Mục đích, phạm vi, tóm tắt

Nhà là thành quả kinh tế lớn nhất của một kiếp và là nơi phong thủy theo lá số có tác dụng thật. Chương này gồm bậc chỗ ngủ, sáu hạng nhà mua được, bài trí, chấm phong thủy, vật phẩm và tiệm NPC, phương tiện. Không gồm: vị trí nhà trên bản đồ (§10), mặt bằng kinh doanh (§17.4), dựng hình phòng (§30).

| Phần | Một dòng | Mục |
|---|---|---|
| Bậc chỗ ngủ | bờ bụi → giường chung → phòng đơn → nhà riêng → phủ | §15.1 |
| Nhà riêng | 292 căn thuộc sáu hạng; mỗi người một căn; máy chủ giữ sổ | §15.2 |
| Bài trí và phong thủy | kéo thả trên lưới; điểm 0–100 theo lá số và Bát Trạch | §15.2.3, §15.2.4 |
| Vật phẩm, tiệm | 50 món; 16 loại tiệm (15 loại trên phố và Tiệm May Tàng Y); 17 dịch vụ tiệm | §15.2.5 |
| Phương tiện | năm bậc, có phí nuôi mỗi ngày | §15.3, §15.4 |

## 15.1 Nhà ở (chỗ ngủ)

> **Trạng thái:** `[ĐÃ CÓ]` (P1 cho bậc 0–1b; nhà riêng và phủ có từ trước; bảo trì và buff thức dậy ở P4). Giá nhà đã chuyển sang tiền theo §13.1.2; dòng «Đổi giá nhà riêng… cần người dùng chốt» ở cuối mục là lịch sử, đã chốt bằng QĐ-03 và QĐ-12.

| Cấp | Chỗ | Giá | Tỉnh hồi (/giờ ngủ) | Bệnh | Tiện ích |
|---|---|---|---|---|---|
| 0 | Ngủ bờ bụi (ghế đá, gầm cầu) | 0 | 6 | phong hàn 15% / đêm, móc túi 5% | — |
| 1 | **Giường chung nhà trọ** (mới, mỗi Trung Thành 2 cái) | 30 đồng/đêm | 9 | hàn thấp 5% | rương nhỏ 4 ô |
| 1b | Phòng đơn khách điếm | 80 đồng/đêm | 12 | — | rương 10 ô, tắm (+5 Khí huyết) |
| 2 | Thuê / mua **tiểu xá, nhà phố, tứ hợp** (có sẵn, 27 căn) | thuê 300–900 đồng/tuần, hoặc mua | 14 | — | **tủ đồ ăn** (giữ 3 ngày), bếp, bài trí (phong thủy `homefs`) |
| 3 | **Biệt thự, biệt phủ** (có sẵn: 240 + 16) | mua: 50–500 lượng + bảo trì | 16 | — | buff **«Thức dậy cát tường»** theo điểm phong thủy hợp bát tự: may mắn +5–15% cả ngày, Khí huyết +10; gia nhân NPC; thuê người làm vườn |

- **Ngủ:** bấm giường. Màn ngủ có thể tua: mỗi phút thật ngủ = 1 giờ ngủ, tối đa 8. Ngủ trong game không phải ngồi chờ.
- **Đổi giá nhà riêng:** nhà phố, biệt thự, biệt phủ hiện bán bằng Phúc Khí / Ngọc. Đề xuất **chuyển sang tiền (lượng bạc)** để nhà ở là thành quả kinh tế. Người đã mua bằng Phúc Khí / Ngọc giữ nguyên quyền sở hữu, miễn bảo trì 30 ngày. Cần người dùng chốt (chương 02).

## 15.2 Nhà riêng

`[ĐÃ CÓ]` Mục này viết từ mã và nhật ký; số chính xác ở [A3](phu-luc/A3-so-lieu.md) › `estate-core.js`.

### 15.2.1 Sáu hạng và chỉ số nhà

| Hạng | Số căn | Dải `h` | Ở đâu | Giá (luật thiết kế) |
|---|---|---|---|---|
| Biệt Phủ | 16 | 0–15 | hai phủ mỗi cung, Ngoại Thành | 3 lượng bạc cho mỗi 100 m², hoặc Ngọc |
| Biệt Thự | 240 | 16–255 | tám khu, mỗi khu 30 căn | 50 lượng bạc, hoặc Ngọc |
| Tiểu Xá · Nhà Phố · Tứ Hợp Viện | 27 | 256–282 | nhà rao bán trong phố | 2 · 5 · 12 lượng bạc (Tứ Hợp có giá Ngọc) |
| Tiên Phủ | 9 | 283–291 | Cửu Trọng Thiên | 1.000 lượng bạc; phủ giữa 2.000; hoặc Ngọc |

- **Chỉ số `h` không bao giờ đổi** (LN-12). Hạng mới chỉ được nối vào cuối sổ, như Tiên Phủ đã làm (QĐ-25). Thành đổi bố cục thì nhà dời chỗ nhưng giữ `h`, hạng và phòng trong.
- Mỗi người **một căn**. Căn đã bán thì người khác không mua được. Bán lại nhận một nửa giá (`SELL_BACK`); căn mua bằng Phúc Khí thời cũ bán lại vẫn trả Phúc Khí.
- **Sao hợp mệnh**: hành của phường so với Dụng, Hỷ, Kỵ thần của người mua (`estate.fitStars`).
- 16 biệt phủ mang 16 phong cách kiến trúc, tám khu biệt thự tám phong cách, chín tiên phủ theo chín phương (`estate-layout.js`).

### 15.2.2 Máy chủ giữ gì

`worker/estate.js` (Durable Object `Estate`, một bản toàn cục): ai sở hữu căn nào, bố cục đồ đạc, câu đối, lượt khen. Thao tác: xem sổ, lấy bố cục, mua, bán lại, lưu bố cục, khen. Chỉ chủ lưu được bố cục; mỗi người khen một căn một lần. Khi khách liên kết tài khoản, căn mua bằng mã khách chuyển sang tài khoản. **Tiền mua nhà vẫn trừ ở ví trên máy** (rủi ro đã chấp nhận, xem `VC-013`).

### 15.2.3 Bài trí

- Bản vẽ nhìn từ trên xuống trong bảng: kéo thả bắt lưới 0,25 m, xoay một phần tư vòng, cất về túi, đồ treo tường bám vách gần nhất, đổi câu đối.
- Luật đặt: không đè nhau, không ra ngoài phòng, không chặn lối cửa (`canPlace`); đồ có chức năng phải đi tới được (`unreachable`).
- Giới hạn: `MAX_ITEMS` món cho nhà thường, `MAX_ITEMS_PHU` cho phủ. Phủ và biệt thự bài trí theo **vùng** (gian và sân vườn, `estate-core.zonesOfH`); máy chủ kiểm từng vùng.
- Phòng trong = khung nhà ngoài trừ tường (`LISTING_ROOMS`), nên nhà nhìn ngoài bao nhiêu thì trong rộng bấy nhiêu.

### 15.2.4 Phong thủy nhà

`homefs.scoreHome` chấm 0–100 kèm lời giải:
1. hành của đồ đạc so với lá số chủ nhà;
2. Bát Trạch rút gọn theo phương vị thật, lấy cửa phòng làm hướng mặt tiền: bàn thờ tựa vách sau nhìn ra cửa, giường không đối cửa, án thư tựa tường, nước ở Bắc, Đông hoặc Đông Nam, cây phương Đông, đèn phương Nam, linh vật quay ra cửa, bình phong chắn cửa, Minh đường thoáng, không chật.

Tác dụng: thưởng Phúc Khí khi về nhà lần đầu mỗi ngày; từ P4 thêm buff thức dậy theo điểm phong thủy phòng ngủ. Mọi thưởng nhà đi qua `state.grantHome`, mỗi khoá một lần mỗi ngày, có trần ngày `HOME_DAILY_CAP` (LN-15).

### 15.2.5 Đồ có chức năng, vật phẩm, tiệm NPC

- **Đồ có chức năng** trong nhà (`shop-data.USE_VERB`): bàn thờ, bàn trà, giường (nghỉ lại, lần sau vào game thức dậy trong nhà), kệ sách, bể cá, cây, la bàn, án thư, đèn.
- **Vật phẩm** (`items.ITEMS`, 50 món): mua ở đúng loại tiệm; bán lại nửa giá; mỗi món tối đa 12 chiếc; hàng quý xoay theo ngày; mỗi ngày có món giảm giá.
- **Tiệm NPC** thuộc 16 loại (`items.SHOP_TYPES`): 15 loại có mặt trên lưới phố (§10.3) cộng Tiệm May Tàng Y; mỗi tiệm một phòng riêng dựng khi bước vào. Trong tiệm có chủ tiệm, hàng thật bày trên kệ, và **dịch vụ** (`shop-data.SVC`, 17 loại): tin đồn, thuyết thư, uống trà, thuê ngựa, sổ địa ốc, thầy xem nhà, tiệm may, Tiền Trang, thuốc, Y Quán, chợ, ruộng, mặt bằng, hộ tịch, bếp thuê, thầy mệnh lý…
- Nhà dân thường không vào được: gõ cửa thì có người đáp, đôi khi chỉ đường.

## 15.3 Phương tiện

> **Trạng thái:** `[ĐÃ CÓ]` (P4). Bảng dưới là thiết kế; giá và phí đang chạy ở [A3](phu-luc/A3-so-lieu.md) › `vehicles.js`.

| Bậc | Phương tiện | Giá | Hiệu ứng | Bảo trì |
|---|---|---|---|---|
| 0 | Đi bộ | — | — | — |
| 1 | Lừa | 3 lượng | hao No / Tỉnh khi di chuyển −20%; chở 1 thùng hàng | cỏ 5 đồng/ngày |
| 2 | Ngựa | 15 lượng | tốc độ ×1,6; mở việc giao hàng liên cung | cỏ + chuồng 20 đồng/ngày |
| 3 | Xe ngựa | 60 lượng | chở 6 thùng: nghề buôn, vận tải đường dài, áp tiêu | 50 đồng/ngày + sửa xe |
| 4 | Linh hạc (bay thấp) | 400 lượng | bay ngắn 60 giây, hồi 3 phút; nhận việc ở mọi nơi trong thế giới | linh thực 150 đồng/ngày |
| 5 | Phi kiếm thượng phẩm | 2.000 lượng | ngự kiếm (F, có sẵn) nhanh ×1,5, vệt sáng riêng, **biểu tượng địa vị** | 0,1% giá/ngày |

- Ngự kiếm cơ bản (cấp 8 hoặc VIP) vẫn giữ để không lấy lại quyền đã có.
- Ngự kiếm cơ bản **hao Tỉnh** 6/phút; phi kiếm thượng phẩm không hao.
- Bán kính nhận việc mở rộng theo phương tiện: bậc 0–1 chỉ trong thành; bậc 2+ cả 8 cung và ngoài thành; bậc 4+ cả thế giới.

## 15.4 Phần đang chạy thêm so với đặc tả

`[ĐÃ CÓ]` (P4, nhật ký 11/11)

- Phương tiện có **phí nuôi mỗi ngày**; ba ngày không trả thì bị siết (`vehicles.SEIZE_DAYS`). Cưỡi bằng phím H hoặc nút trên màn hình.
- **Bảo trì nhà** theo hạng, tính theo ngày (`vehicles.HOUSE_UPKEEP`).
- **Tủ đồ ăn** giữ đồ ba ngày (`PANTRY_MS`), số ô có hạn.
- **Ngự kiếm cơ bản** hao Tỉnh theo phút bay (`FLY_WAKE_PER_MIN`).
- **Xe ngựa nội thành** là dịch vụ đi lại, không phải phương tiện sở hữu: xem §16.5.

## 15.5 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Thế giới | vị trí từng căn, phường, hướng cửa | §10 |
| Mệnh | sao hợp mệnh, điểm phong thủy | §11 |
| Đời sống | chỗ ngủ → tốc độ hồi Tỉnh; bảo trì là hố hút tiền | §13 |
| Xã hội | thăm nhà, khen nhà; vợ chồng ở chung | §20 |
| Pháp môn | Trạch Pháp cộng điểm phong thủy | §18.4.2 |
| Luân hồi | nhà và tiền gửi thành di sản, trừ tang phí | §18.5.4 |
| Máy chủ | gói `est_*` | §31, [A4](phu-luc/A4-giao-thuc.md) |

## 15.6 Kiểm thử và nghiệm thu

- `test-game-estate` (10): sổ rao bán khớp lõi máy chủ, mã hoá bố cục, luật đặt, phong thủy đúng chiều, trần thưởng, giao thức.
- `test-game-mansion` (8), `test-game-homes` (10): khuôn viên đi bộ được; mọi cửa thông ra phố; vào đúng phòng, ra đúng cửa.
- `test-game-items` (8), `test-game-vehicles` (7).
- Thêm hạng nhà hoặc đổi số căn: `h` cũ không đổi; cả ba bộ đầu vẫn đạt.

## 15.7 Việc còn mở

`VC-018` (thu hồi nhà bỏ hoang) · `VC-013` · `VC-029` (đồng sở hữu).
