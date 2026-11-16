# 13 · Đời sống: tiền, sinh tồn, bệnh, thuế, nợ

> **Trạng thái:** `[ĐÃ CÓ]`; ngoại lệ ghi ở §13.5
> **Bộ phận chủ trì:** Thiết kế game (cân bằng) · Backend (sổ tiền)
> **Nguồn sự thật trong mã:** `src/game/coins.js`, `src/game/life.js`, `src/game/illness.js`, `src/game/life-ui.js`, `src/game/lifeplaces.js`; số liệu ở [A3](phu-luc/A3-so-lieu.md) mục 13
> **Test:** `scripts/test-game-life.mjs`, `scripts/test-game-illness.mjs`
> **Thay thế:** `GAME-SINH-TON-KINH-TE-DAC-TA` §2, §3, §26
> **Kiểm với mã ngày:** 2026-11-16

## 13.0 Mục đích, phạm vi, tóm tắt

Chương này định nghĩa áp lực sống: người chơi phải ăn, ngủ, giữ sức và kiếm tiền bằng lao động. Đây là nền của trụ cột TC-4. Không gồm: cách kiếm tiền (§14), nhà và xe (§15), hàng hoá có độ tươi (§17), chết và luân hồi (§18.5).

| Phần | Một dòng | Mục |
|---|---|---|
| Tiền | Năm đơn vị kim loại, lưu bằng xu; chỉ sinh từ lao động và buôn bán | §13.1 |
| Sinh tồn | No, Tỉnh, Khí huyết tụt theo giờ chơi; xuống thấp thì chậm, ngất | §13.2 |
| Bệnh | Sáu bệnh nghiêng theo hành yếu của lá số; chữa đắt | §13.2.3 |
| Kinh tế khắt khe | Một ngày sống tối thiểu 80 đồng ≈ hai ca làm trung bình | §13.3 |
| Tiền Trang, ngất, nợ | Phần đang chạy khác hoặc thêm so với đặc tả | §13.4 |

**Mốc cân bằng là luật** (test `life` bảo vệ): ngày sống tối thiểu 80 đồng; học việc, mệnh trung tính, làm trung bình hai ca được 80–85 đồng; Tiểu Xá mua được sau 15 ngày (nghề hợp Dụng thần) tới 58 ngày (làm ẩu); nghề phạm Kỵ thần không để dành nổi.

## 13.1 Tiền kim loại

> **Trạng thái:** `[ĐÃ CÓ]` (P18). Tiền Trang đã làm ngày 11/11, xem §13.4.

### 13.1.1 Đơn vị

| Đơn vị | Bằng | Vật thật trong thành | Dùng cho |
|---|---|---|---|
| **Xu** | đơn vị gốc (lưu số nguyên) | đồng xu đồng mỏng | tiền công lẻ (một chuyến gánh nước ≈ 36 xu) |
| **Hào** | 10 xu | đồng hào lỗ vuông | bánh bao, chén nước vối |
| **Đồng** (văn) | 10 hào = 100 xu | tiền đồng Huyền Thành Thông Bảo | bữa cơm 15 đồng, giường trọ 30 đồng |
| **Lượng bạc** | 1.000 đồng | nén bạc | tiền công tuần, đồ bài trí, thuê nhà |
| **Lượng vàng** | 10 lượng bạc = 10.000 đồng | thỏi vàng | nhà cửa, biệt phủ, tửu lâu |

- **Lưu trữ:** số nguyên **xu** ở mọi nơi (ví, sổ cái §31.4.2, giá). Số nguyên JS an toàn tới 9·10¹⁵ xu.
- **Hiển thị:** theo đơn vị lớn nhất có nghĩa, tối đa 2 bậc. Ví dụ: «3 lượng vàng 4 lượng bạc», «15 đồng 5 hào», «36 xu». Ô nhập giá có bộ chọn đơn vị.
- **Đổi tên:** mọi «văn» ở Phần I–II đọc là «đồng». Con số giữ nguyên: giỏ sống tối thiểu 80 đồng / ngày, lương ca, thuế thân, giá món ăn.
- Phần lẻ dưới 1 đồng từng nằm ở `life.vanFrac`; nay thành xu thật (`life.xu`), không còn số thực. `L.van` vẫn đọc / ghi bằng đồng cho mã cũ.
- **Nguồn tiền** giữ nguyên tinh thần «chỉ từ làm việc và buôn bán» (§13.1):
  - Không đổi từ Phúc Khí / Âm Đức / Ngọc.
  - **Không có nguồn Ngọc miễn phí nào** (quyết định 13: bỏ điểm danh Ngọc, Ngọc VIP hằng ngày, quà Ngọc lên cấp).
- **Tiền Trang** (Càn cung — §14.1.2, nghề Kim) đổi bạc ↔ đồng mất 0,5% phí; tiện cho mua lớn, và là hố hút tiền nhỏ.

### 13.1.2 Đổi giá những thứ đang bán bằng Phúc Khí

| Nhóm | Hiện tại | Quy tắc mới | Ví dụ |
|---|---|---|---|
| Đồ dùng tiêu hao (hương, trà, thuốc — `items.js` kind use) | 3–25 Phúc Khí | × 4 → đồng | Hương thường 3 → **12 đồng**; Thanh Tâm Đan 25 → **100 đồng** |
| Đồ bài trí (`items.js` kind decor) | 20–400 Phúc Khí | × 6 → đồng, làm tròn | Ghế Thái Sư 40 → **240 đồng**; Đèn Lồng Đỏ 25 → **150 đồng** |
| Y phục / phụ kiện (`cosmetics.js` giá phuc) | 60–300 Phúc Khí | × 6 → đồng | Bạch Y Thư Sinh 240 → **1 lượng bạc 440 đồng** |
| Nhà riêng (`estate-core.js` TIERS) | 600–25.000 Phúc Khí | theo §15.1 (thành quả kinh tế) | Tiểu Xá **2 lượng bạc** · Nhà Phố 5 · Tứ Hợp 12 (hoặc 300 Ngọc) · Biệt Thự **50 lượng bạc** (hoặc 480 Ngọc) · Biệt Phủ **3 lượng bạc / 100 m²** (120–300 lượng, hoặc 2.000 Ngọc) |
| Phạt luật (`law.js` phạt tiền, chuộc tù) | Phúc Khí | đồng (cùng con số × 4) + **Nghiệp Lực** (§18.1, P19) | phạt 10 điểm = **1 lượng bạc**; chuộc tù **120 đồng / phút** |
| Món Ngọc (thời trang quý, VIP) | Ngọc | giữ Ngọc (web; ẩn nạp trên iOS) | |

- Đổi giá xong chạy **mô phỏng** (test cân bằng P1): người làm 2 ca / ngày mua được đồ tiêu hao hằng ngày, đồ bài trí sau vài ngày, Tiểu Xá sau khoảng 1 tháng chơi đều.
  - **Kết quả (P18, `test-game-life` «cân bằng tiền kim loại»):** bản nháp × 12 / × 15 và Tiểu Xá 5 lượng quá đắt (người trung bình mất 77–108 ngày mới đủ Tiểu Xá). Đã hạ còn × 6 và giá nhà như bảng trên.
  - Tiểu Xá: Dụng thần 2 ca ≈ 15 ngày · Hỷ thần ≈ 25 · 3 ca ≈ 21 · bình thường làm khá ≈ 38 · làm ẩu ≈ 58. Nghề phạm Kỵ thần không để dành nổi (luật P1, cố ý để người chơi đổi nghề).
  - Đồ tiêu hao (hương 12 đồng) mua được ngay từ ngày đầu; đèn lồng sau ≤ 12 ngày.
- **Người chơi cũ:** ví cũ tính bằng «văn» đổi sang xu (1 văn = 100 xu, phần lẻ thành xu thật); Phúc Khí giữ nguyên làm điểm Huyền học, và nhận một lần **lộc đổi chế độ** = 10% Phúc Khí đang có × 4 đồng (tối đa 2 lượng bạc). Nhà đã mua bằng Phúc Khí bán lại vẫn trả Phúc Khí.
- **Hiển thị theo ngưỡng Phúc Khí đang có** (`main.js`: hào quang vàng ≥ 500, lồng đèn ≥ 100, đào nở ≥ 250, hạc ≥ 500) và **danh hiệu** (`state.TITLES`): chuyển sang **cảnh giới** (§18.4). P18 tạm chuyển sang **Phúc Khí tích lũy cả đời** (`state.xp`, không giảm khi tiêu); P20 đổi hẳn sang cảnh giới.
  - Không còn thưởng theo số dư của một thứ có thể tiêu.

## 13.2 Chỉ số sinh tồn

> **Trạng thái:** `[ĐÃ CÓ]` — ba chỉ số và ăn ngủ (P1), bệnh và Y Quán (P3). Phần đang chạy khác đặc tả: §13.4.

### 13.2.1 Ba chỉ số (0–100)

| Chỉ số | Tên trong game | Giảm khi | Hồi khi |
|---|---|---|---|
| **No** (Hunger) | Bụng | −10/giờ chơi lúc đứng; ×1,5 khi chạy hoặc bơi; ×(hệ số mệt của nghề) khi làm việc | Ăn: cơm bình dân +35, bữa tửu lâu +60, bánh bao +15, linh thực +80 kèm buff |
| **Tỉnh** (Stamina/Sleep) | Tinh thần | −7/giờ chơi; làm việc theo nghề (§14.1.4); thức trắng từ giờ Tý đến giờ Dần ×2 | Ngủ (§15.1): tốc độ theo cấp chỗ ngủ; trà +8 (tối đa 2 lần / 6 giờ) |
| **Khí huyết** (Health/Immunity) | Khí huyết | −4/giờ khi No < 20; −4/giờ khi Tỉnh < 20 (cộng dồn); dầm mưa hoặc bơi đêm −2/giờ; ngã từ trên 6 m −(độ cao − 6) × 4 | +2/giờ khi No > 50 và Tỉnh > 50; thuốc; ngủ chỗ tốt |

- **Thể lực** (thanh chạy / leo / lượn trong `motion.js`) có **trần** = 40 + 0,6 × Tỉnh. Mệt thì chạy nhanh và leo trèo kém đi.
- Dưới 20 thì có cảnh báo HUD (biểu tượng nhấp nháy) và NPC gần đó nhắc qua bark («Trông huynh xanh xao quá…»).
- **Khí huyết = 0:** **ngất**. Được khiêng tới Y Quán gần nhất, viện phí cấp cứu 300 đồng, không đủ thì ghi nợ (§13.3.6). **Không có chết vĩnh viễn.**

### 13.2.2 Thời gian & offline

- Đồng hồ game là **giờ thật** (như hiện nay: ngày đêm, giờ hoàng đạo, can chi ngày).
- Chỉ số giảm **theo giờ chơi** (online). Khi offline giảm với 25% tốc độ, có sàn: No không dưới 30 và Khí huyết không dưới 40. Mục đích là người quay lại sau vài ngày không bị «chết đói» oan.
- **Thoát game trong chỗ trọ đã trả tiền** thì coi như ngủ: Tỉnh hồi theo cấp phòng, tối đa 8 giờ.
- **Thoát giữa đường** là ngủ bờ bụi: Tỉnh chỉ hồi 50%, 15% bị cảm phong hàn, 5% bị móc túi (mất 10% số tiền mang theo).

### 13.2.3 Bệnh tật

Có 6 trạng thái. Loại bệnh nghiêng theo **ngũ hành yếu nhất** trong lá số, theo tạng phủ Đông y: Mộc–Can, Hỏa–Tâm, Thổ–Tỳ, Kim–Phế, Thủy–Thận.

| Bệnh | Phát sinh | Hành dễ mắc |
|---|---|---|
| **Phong hàn (cảm sốt)** | ngủ ngoài trời, dầm mưa, bơi đêm, Khí huyết < 40 | Kim yếu (Phế) |
| **Suy nhược** | No < 20 hoặc Tỉnh < 20 kéo dài quá 1 giờ chơi | Thổ yếu (Tỳ) |
| **Chấn thương** | tai nạn lao động (§14.1.3), ngã cao, phá công trình bị sập đè (5%) | — |
| **Ngộ độc** | ăn đồ ôi (hết độ tươi, §17.5.1), hoặc độc tích cao do ăn đồ hạng 1 liên tục (§17.2.3) | Thổ yếu |
| **Tâm hỏa (mất ngủ)** | thức trắng 2 đêm liền, làm nghề Kỵ thần quá 3 ca / ngày | Hỏa yếu (Tâm) |
| **Hàn thấp (đau xương)** | làm nghề Thủy hoặc khai mỏ liên tục, ngủ phòng ẩm (giường chung) | Thủy yếu (Thận) |

**Hậu quả** (theo GDD):
- Tốc độ đi giảm 50%.
- Hiệu suất làm việc giảm 70%.
- Ba chỉ số giảm nhanh gấp đôi.
- Không tự khỏi. Riêng phong hàn nhẹ tự khỏi sau 6 giờ chơi nếu ngủ đủ, nhưng 30% chuyển nặng.

**Điều trị:**

| Nơi | Chữa | Giá (tiền) | Ghi chú |
|---|---|---|---|
| **Dược Phòng** (4 tiệm `duoc` có sẵn) | phong hàn nhẹ, ngộ độc nhẹ: thang thuốc | 120–180 | Mặc cả được (§21.3): tối đa −15% nếu NPC có thiện cảm |
| **Y Quán** (mới, mỗi Trung Thành có 1, ở Tốn và Khôn) | mọi bệnh, chấn thương, cấp cứu | khám 80 + thuốc 250–1.200 | **Thầy thuốc bắt mạch theo ngũ hành:** đơn thuốc hợp Dụng thần thì khỏi nhanh gấp đôi, giá −20% |
| **Đan dược** (luyện đan, hiếm) | khỏi ngay, kèm miễn dịch 1 ngày | 2.000+ | phần thưởng nhiệm vụ mệnh, hoặc mua ở Ngoại Thành |

Chi phí cố ý **rất cao** (GDD §13.2): một trận chấn thương ≈ 6–15 ngày lương phổ thông. Đây là áp lực chính.

**Phòng bệnh** để người chơi cẩn thận có lối thoát:
- Ăn đủ 3 bữa trong ngày thì miễn dịch +10.
- Ngủ phòng từ cấp 1b trở lên.
- Mặc phẩm phục đúng hành Dụng thần: −30% tỉ lệ mắc bệnh. Gắn với Tàng Y Các có sẵn.

## 13.3 Kinh tế khắt khe

> **Trạng thái:** `[ĐÃ CÓ]` (P1, P3, P18). Mục 13.3.1 cũ (bảng tiền tệ cũ: «văn» · Phúc Khí · Ngọc) đã bị §13.1 thay hẳn nên không chép lại.

### 13.3.2 Giỏ chi phí tối thiểu mỗi ngày (mốc cân bằng)

| Khoản | Giá |
|---|---|
| 3 bữa cơm bình dân (15 đồng × 3) | 45 |
| Nước / trà | 5 |
| Giường chung nhà trọ | 30 |
| **Tổng «ngày sống tối thiểu»** | **80 đồng** |

**Bẫy thu nhập (GDD §13.3):**
- Nghề phổ thông, mệnh trung tính, hiệu suất trung bình (1,0), làm 2 ca (≈ 60 phút chơi) được ≈ 80–85 đồng.
- Tỉnh tụt khoảng 40 điểm, nên muốn làm thêm ca thứ 3 thì phải trả giá bằng sức khỏe và nguy cơ bệnh. Dôi dư gần như bằng 0.

### 13.3.3 Lương theo sản phẩm (không lương cứng)

```
tiền một việc = giá_việc × hiệu_suất × hệ_số_mệnh × hệ_số_cấp × hệ_số_giờ × (1 − phạt_bệnh) × chỉ_số_giá_shard
  hiệu_suất    0,3 – 1,5   (kết quả mini-game / chất lượng, §14.1.5)
  hệ_số_mệnh   Dụng ×2,0 (tay nghề ≥ Thợ cả: ×2,5; nhiệm vụ mệnh: ×3,0) · Hỷ ×1,3 · trung tính ×1,0 · Kỵ ×0,5
  hệ_số_cấp    Học việc 0,8 · Thợ 1,0 · Thợ cả 1,25 · Quản sự 1,5 (kèm % doanh thu tiệm) · Chủ tiệm (lợi nhuận)
  hệ_số_giờ    giờ hoàng đạo hợp nghề ×1,15 · giờ hắc đạo ×0,9 (lấy từ stations.todayInfo có sẵn)
  phạt_bệnh    0,7 khi đang bệnh
```

Tiền được trả ngay sau mỗi việc. Máy chủ ghi sổ và kiểm (§31.3).

### 13.3.4 Chi phí sinh hoạt động (chống lạm phát / hút tiền)

- **Bậc giàu** = tổng tài sản (tiền + giá trị nhà, xe) theo bậc. B0 dưới 1 lượng · B1 1–10 lượng · B2 10–100 lượng · B3 100–1.000 lượng · B4 trên 1.000 lượng.
- **Thuế thân hằng ngày:** B0 0 · B1 5 · B2 30 · B3 200 · B4 0,4% tài sản. Thu tự động lúc giờ Tý. Không đủ tiền thì ghi nợ thuế.
- **Bảo trì tài sản:** nhà 0,2% giá/ngày (biệt phủ 0,3%); xe, ngựa: cỏ và chuồng (§15.3).
- **Giá dịch vụ theo bậc** cho những nơi có hạng: tửu lâu hạng sang, khách điếm thượng phòng, Y Quán đặc phòng. Người giàu không bị ép, nhưng đồ rẻ ít buff.
- **Chỉ số giá shard** = f(tổng tiền đang lưu hành / số người hoạt động). Máy chủ chỉnh ±2% mỗi ngày, có trần, áp cho giá đồ ăn, thuốc và trọ.
- **Hố hút tiền:** thuế, bảo trì, viện phí, đồ ăn tiêu hao, phạt luật, phí sửa đồ nghề, sửa công trình (công trình bị phá dựng lại bằng tiền của **người phá**: «bồi thường» thêm vào án của Huyền Thành Luật).

### 13.3.5 Đồ ăn & chợ

- Tiệm bán: tửu lâu (`tuu`, 4), trà lâu (`tralau`, 3), hàng rong NPC dọc phố, chợ phiên Ly cung.
- Đồ ăn có **hạn dùng** 1 ngày thật. *(Phần II thay bằng độ tươi theo từng món và 3 hạng — §17.2.1, §17.5.1.)* Có tủ (nhà từ cấp 2 trở lên) thì giữ được 3 ngày, mua sỉ rẻ hơn 30% (GDD: «tủ lạnh»).
- Tự nấu ở nhà có bếp: nguyên liệu (chợ) + kỹ năng Đầu bếp. Đồ ăn rẻ hơn 40%, là nghề Hỏa.

### 13.3.6 Nợ & luật

- Nợ viện phí, nợ thuế, nợ tiền trọ: lãi 2%/ngày, trần bằng 3 lần gốc.
- Nợ trên 1 lượng quá 7 ngày bị **Nha Môn** xử theo Huyền Thành Luật. Điều 12 mới: trước tiên **khổ sai trừ nợ** ở Khoáng Sơn, mỗi quặng trừ 15 đồng. Hệ khổ sai đã có sẵn.
- Nhân sự bỏ ca, trộm hàng của tiệm: tội mới, phạt và ghi vào **lý lịch nghề**. NPC chủ tiệm nhớ (§21.3.3).

## 13.4 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` Các điểm dưới đây lấy từ nhật ký thi công ngày 10–11/11 và hằng số trong mã; khi lệch với §13.1–§13.3 thì mục này và [A3](phu-luc/A3-so-lieu.md) thắng.

| Điểm | Đang chạy | Hằng số |
|---|---|---|
| **Tiền Trang** | Gửi và rút mất phí 0,5 % (tối thiểu 1 đồng), không lãi. Tiền gửi không bị móc túi khi ngủ bờ bụi, không mất khi ngất; thuế thân và bậc giàu tính cả tiền gửi. Quầy ở tám Dịch Trạm và Nha Môn. Không cần đổi bạc ↔ đồng vì ví là một số xu | `life.BANK_FEE` |
| **Ngất** | Khí huyết về 0 vì kiệt sức, đuối nước, tai nạn: về nơi an toàn, trả phí cấp cứu cố định; thiếu tiền thì ghi nợ viện phí | `life.FAINT_FEE` |
| **Nợ** | Lãi 2 % mỗi ngày, trần gấp ba gốc. Nợ trên một lượng bạc quá bảy ngày thì Nha Môn xử khổ sai trừ nợ, mỗi quặng trừ một khoản cố định (§19) | `illness.DEBT_RATE`, `DEBT_CAP`, `DEBT_DAYS`, `ORE_DONG` |
| **Rủi ro bệnh** | Tính theo hành Dụng thần, áo hợp mệnh, số bữa ăn, cấp vận khí (§18.2) | `illness.riskMul` |
| **Ví** | Vẫn lưu trên máy người chơi; tiền dùng để giao dịch với người khác phải gửi lên ví chợ (§17.7) | VC-013 |
| **Tên hằng số** | Mã còn giữ tên cũ `START_VAN`, `van`; đơn vị thật là đồng | — |

## 13.5 Chưa có trong mã `[MỘT PHẦN]`

- **Chỉ số giá theo phòng** (§13.3.4, dòng cuối): chưa thấy trong mã → `VC-031`.
- **Sổ chỉ số sinh tồn trên máy chủ** (§31.3): đang tính trên máy người chơi.

## 13.6 Liên kết với hệ khác

| Hệ | Trao đổi | Chương |
|---|---|---|
| Việc làm | lương cộng vào ví; làm việc hao Tỉnh và No; bệnh giảm hiệu suất | §14.1.3 |
| Di chuyển | trần thể lực = 40 + 0,6 × Tỉnh; đói mệt đi chậm; Tỉnh thấp không chạy nhanh | §16.1 |
| Nhà ở | chỗ ngủ quyết định tốc độ hồi Tỉnh | §15.1 |
| Huyền học | sống điều độ sinh Âm Đức; vận số ngày gây bệnh vặt, móc túi | §18.2, §18.3 |
| Luật | nợ quá hạn → khổ sai; phạt trả bằng tiền | §19 |
| Luân hồi | Khí huyết về 0 vì đói hoặc bệnh nặng → chết | §18.5.1 |

## 13.7 Kiểm thử và nghiệm thu

- `test-game-life` (15 ca): tốc độ tụt, ngưỡng, ăn ngủ, thuế, Tiền Trang, **mô phỏng cân bằng tiền kim loại**.
- `test-game-illness` (8 ca): xác suất bệnh, chi phí, nợ, khổ sai trừ nợ.
- Đổi bất kỳ giá hoặc tốc độ nào: chạy lại hai bộ trên; mốc cân bằng ở §13.0 không được lệch.

## 13.8 Việc còn mở

`VC-013` (ví lên máy chủ) · `VC-031` (chỉ số giá) · `VC-032` (rà chuỗi hiển thị về bệnh).
