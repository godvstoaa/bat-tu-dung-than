# 10 · Phần 10 — Lịch lễ tiết (II): tháng Năm → tháng Chạp, lễ dương lịch, sóc vọng, tổng kết lịch

> Tiếp Phần 09 (máy lịch §9.0, quy tắc thưởng §9.0.6, quy tắc tôn trọng §9.0.7). Ngày ví dụ chạy thật bằng `lunar-javascript` cho chu kỳ năm âm Đinh Mùi (2027) và Mậu Thân (2028; **nhuận tháng 5**).

## 10.0 Bảng tổng (Phần 10)

| # | Mã | Lễ | Quy tắc | 2027 (Đinh Mùi) | 2028 (Mậu Thân) | Vùng chính |
|---|---|---|---|---|---|---|
| 26 | `EV-DOANNGO-01` | Tết Đoan Ngọ | âm 5/5 (`leap: 'skip'`) | 2027-06-09 | 2028-05-28 | Huyền Thành, Cùng Thông Hồ, Miêu Cương |
| 27 | `EV-THIENSU-01` | Vía Trương Thiên Sư ⚠ | âm 18/5 | 2027-06-22 | 2028-06-10 | Long Hổ |
| 28 | `EV-HACHI-01` | Hạ Chí – Linh Bảo | tiết Hạ Chí | 2027-06-21 | 2028-06-21 | Chung Nam |
| 29 | `EV-QUANAM-02` | Vía Quán Thế Âm (thành đạo) | âm 19/6 | 2027-07-22 | 2028-08-09 | Bút Tháp |
| 30 | `EV-NGHIA-01` | Tiết Nghĩa (Quan Thánh) | âm 24/6 | 2027-07-27 | 2028-08-14 | Đình Kim Lan, Huyền Thành |
| 31 | `EV-THATTICH-01` | Thất Tịch | âm 7/7 | 2027-08-08 | 2028-08-26 | Huyền Thành, Cùng Thông Hồ |
| 32 | `EV-VULAN-01` | Vu Lan – Trung Nguyên | âm 15/7 (tiền lễ từ 1/7) | 2027-08-16 | 2028-09-03 | toàn thế giới; Phong Đô |
| 33 | `EV-DIATANG-01` | Vía Địa Tạng | `lunarLast` 7 (30 hoặc 29) | 2027-08-31 | 2028-09-18 | Phong Đô, Bút Tháp |
| 34 | `EV-TRUNGTHU-01` | Tết Trung Thu | âm 15/8 | 2027-09-15 | 2028-10-03 | toàn thế giới |
| 35 | `EV-THUPHAN-01` | Thu Phân – Đình thí | tiết Thu Phân | 2027-09-23 | 2028-09-22 | Võ Đang, Văn Miếu |
| 36 | `EV-KHONGTU-01` | Khổng Tử đản | âm 27/8 | 2027-09-27 | 2028-10-15 | Văn Miếu |
| 37 | `EV-CUUHOANG-01` | Cửu Hoàng hội | âm 1/9 → 9/9 | 2027-09-30 → 10-08 | 2028-10-18 → 10-26 | Đẩu Mẫu Điện, Long Hổ, Phong Đô |
| 38 | `EV-TRUNGCUU-01` | Trùng Cửu | âm 9/9 | 2027-10-08 | 2028-10-26 | Đẩu Mẫu Điện (Trích Thiên Đỉnh), mọi đỉnh núi |
| 39 | `EV-QUANAM-03` | Vía Quán Thế Âm (xuất gia) | âm 19/9 | 2027-10-18 | 2028-11-05 | Bút Tháp |
| 40 | `EV-TRUNGTHAP-01` | Tết Trùng Thập – Cơm mới | âm 10/10 | 2027-11-07 | 2028-11-25 | Huyền Thành, Y Lư |
| 41 | `EV-HANGUYEN-01` | Hạ Nguyên | âm 15/10 (ban ngày) | 2027-11-12 | 2028-11-30 | Cùng Thông Hồ |
| 42 | `EV-KHENTRANG-01` | Hội Khèn Trăng (hư cấu) | âm 15/10 (giờ Dậu → Hợi) | 2027-11-12 | 2028-11-30 | Miêu Cương |
| 43 | `EV-TONGKHACHBA-01` | Hội đèn tháng Mười ⚠ chờ tham vấn | âm 25/10 (tạm; lịch Tạng khác) | 2027-11-22 | 2028-12-10 | Tạng Địa |
| 44 | `EV-NHAGIAO-01` | Ngày Nhà giáo Việt Nam | dương 20/11 | 2027-11-20 | 2028-11-20 | Văn Miếu, mọi Giảng Đường |
| 45 | `EV-TRUCLAM-01` | Giỗ Tổ Trúc Lâm | âm 1/11 | 2027-11-28 | 2028-12-16 | Yên Tử |
| 46 | `EV-DIDA-01` | Vía A Di Đà | âm 17/11 | 2027-12-14 | 2029-01-01 | Bút Tháp |
| 47 | `EV-DONGCHI-01` | Đông Chí – Cửu Cửu Tiêu Hàn | tiết Đông Chí, `termSpan` 81 ngày | 2027-12-22 → 2028-03-11 | 2028-12-21 → 2029-03-10 | Huyền Thành, Chung Nam, Long Hổ |
| 48 | `EV-CHUVANAN-01` | Giỗ Chu Văn An ⚠ | âm 26/11 | 2027-12-23 | 2029-01-10 | Văn Miếu |
| 49 | `EV-LAPBAT-01` | Phật thành đạo – Lạp Bát | âm 8/12 | 2028-01-04 | 2029-01-22 | Bút Tháp, Yên Tử |
| 50 | `EV-TRUNGDUONG-01` | Vía Vương Trùng Dương ⚠ | âm 22/12 | 2028-01-18 | 2029-02-05 | Chung Nam |
| 51 | `EV-SOCVONG-01` | Sóc – Vọng hằng tháng | `monthly` 1, 15 | 12–13 lần / năm | 13 lần (nhuận) | toàn thế giới |

Ghi chú năm 2028: vì **nhuận tháng 5**, mọi lễ từ tháng 6 âm trở đi rơi muộn hơn năm 2027 khoảng 2–4 tuần theo dương lịch (Quán Âm 19/6: 2027-07-22 so với 2028-08-09). Máy lịch không cần xử lý gì đặc biệt ngoài `leap: 'skip'`.

---

## 10.1 Tháng Năm – tháng Sáu

### `EV-DOANNGO-01` · Tết Đoan Ngọ (端午)

| Quy tắc | âm 5/5, tháng 5 chính | Tiền lễ | 1/5 → 4/5 (hái, phơi lá) | Vùng | Huyền Thành, Cùng Thông Hồ, Miêu Cương (Y Lư), Hậu Viên các đạo tràng | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ở Việt Nam là «Tết diệt sâu bọ» (ăn rượu nếp, hoa quả sáng sớm); tục hái lá thuốc giờ Ngọ ngày mùng 5. Ở Trung Hoa gắn với Khuất Nguyên, đua thuyền rồng.

**Hoạt động:**
1. **Hái lá giờ Ngọ** (11:00–13:00 giờ Việt Nam — cửa sổ thật): ngải cứu, xương bồ, lá mơ… ở Vườn Hương Thảo (`GUILD-DT-TT-09`), Dược Phố (`GUILD-DT-TV-09`), rừng Miêu Cương (Y Lư). Cử chỉ `hai_la` chỉ dùng được trong giờ Ngọ. Lá phơi khô thành **túi thơm** (quà nhỏ).
   - Câu cố định của bà A Mậu: «Lá để treo cửa, để tắm cho thơm. Có bệnh thì đi thầy thuốc.»
2. **Đua thuyền rồng** ở Cùng Thông Hồ: thuyền 8 người, chèo theo **nhịp trống chung** (mini-game nhịp: cả thuyền chèo đều thì nhanh). **Không xếp hạng toàn máy chủ**: mỗi lượt đua 3–4 thuyền trong một phòng; thuyền về đích đều được dải lụa, thuyền đều nhịp nhất được cờ đuôi nheo.
3. **Diệt sâu bọ** (cho người chơi nhỏ tuổi): ở vườn rau các Đạo Am / Trai Đường, bắt sâu trên lá (sâu bỏ sang vườn hoang chứ không giết — game không có sát sinh; gọi là «dời sâu»).
4. **Codex Khuất Nguyên** — kể ngắn, nhấn **lòng ngay thẳng**.

**Thưởng:** túi thơm Đoan Ngọ (`hand`, mùa); cờ đuôi nheo cho thuyền đều nhịp.

**Tôn trọng:** không khuyến khích uống rượu (rượu nếp trong game là «cơm rượu» món ăn, không có hiệu ứng say; nhóm tuổi T không thấy món này).

### `EV-THIENSU-01` · Vía Trương Thiên Sư ⚠

| Quy tắc | âm 18/5 ⚠ (cần cố vấn Chính Nhất xác nhận) | Vùng | Long Hổ Sơn | Tông | `GUILD-CN` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày tổ của tông Chính Nhất (Trương Đạo Lăng, `schools-data › zhengyi.founder`: «张道陵 (东汉…)»).

**Hoạt động:**
- **Tiểu Tiếu Đàn mở rộng** (`GUILD-RITE-CN-01`), phần dâng sớ có thêm ô «cầu cho người đi đường» → Hương Hỏa của buổi lễ cộng vào `EV-CAU-09` (đường Lịch Đường ↔ Long Hổ).
- **Phù Lâm** (Thiên Sư Lầu, `GUILD-DT-CN-11`) của mọi Pháp Đàn mở cho khách xem trong ngày.
- Codex: phân biệt **lịch sử** (Ngũ Đấu Mễ Đạo thời Đông Hán, theo ghi chép) và **truyền thuyết**.

**Thưởng:** khung tên «Long Hổ {năm can chi}» cho người dự.

### `EV-HACHI-01` · Hạ Chí — Linh Bảo (夏至)

| Quy tắc | tiết Hạ Chí | Vùng | Chung Nam | Tông | `GUILD-TC` (Linh Bảo) | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày dài nhất năm, «nhất âm sinh». Trong tín ngưỡng Đạo giáo, Hạ Chí gắn với Linh Bảo Thiên Tôn (một trong Tam Thanh); Đông Chí gắn với Nguyên Thủy Thiên Tôn.

**Hoạt động:**
- **Vãn Khóa biến thể Độ Nhân** cả ngày (Phần 02 §2.3.5) — Hương Hỏa cộng vào dự án công cộng đang mở.
- **Đo bóng mặt trời** (Thư Lâu Lâm và Chung Nam có **khuê biểu** — cột đo bóng, công trình đi vào được — hoạt động học thiên văn cổ): đúng giờ Ngọ, bóng ngắn nhất năm; người chơi đánh dấu; giảng về cách người xưa định tiết khí.
- Kết nối **Hội thí** khoa cử (Phần 07 §7.1.6): mở trong Hạ Chí ± 7 ngày.

**Thưởng:** quạt lá cọ (`hand`, mùa).

### `EV-QUANAM-02` · Vía Quán Thế Âm — thành đạo

| Quy tắc | âm 19/6 | Vùng | Bút Tháp | iOS | có |
|---|---|---|---|---|---|

**Hoạt động:** như `EV-QUANAM-01` (lắng nghe NPC) nhưng chủ đề chuyện là **người đã vượt qua khó khăn** (NPC kể chuyện đã qua — nghe để học); và **«Một ngày không nói lời làm tổn thương»**: người chơi tự nhận một thử thách nhỏ trong ngày (trong hội thoại có lựa chọn, tránh mọi lựa chọn «nói lời tổn thương» — `CONG_QUA › ac › «Nói lời tổn thương»`). Giữ được → dấu trong Sổ Mệnh.

**Thưởng:** chuỗi tràng hạt gỗ (vật bày nhà riêng, **không** phải đồ đeo bán được).

### `EV-NGHIA-01` · Tiết Nghĩa (Quan Thánh)

| Quy tắc | âm 24/6 (ngày vía Quan Thánh Đế Quân theo tục nhiều nơi ở Việt Nam) | Vùng | Đình Kim Lan (Huyền Thành, Phần 04 §4.3.2) | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Quan Vũ (Quan Công) được dân gian và Đạo giáo tôn là biểu tượng **trung nghĩa**. Trong game, ngày này là **ngày của tình bằng hữu**: tái kết kim lan.

**Hoạt động:**
- **Tái kết kim lan** (Phần 04 §4.3.5): nhóm kim lan đủ mặt ở Đình Kim Lan đọc lại lời thề; nhận đồ bày kỷ niệm năm.
- **Kết kim lan trong ngày Tiết Nghĩa:** thời gian chờ kết nhóm mới (14 ngày) **không** được miễn (giữ ý nghĩa lời thề) — nhưng ai đủ điều kiện thì lễ kết trong ngày có hiệu ứng đèn đỏ đặc biệt.
- **Codex «Đào viên kết nghĩa»** (truyện Tam Quốc diễn nghĩa — tác phẩm cổ, phạm vi công cộng): kể ngắn; nhấn **giữ lời**, không nhấn chiến trận.
- **Không** có tượng Quan Công làm vật phẩm, không có «lễ cầu tài Quan Công».

**Thưởng:** đồ bày «Đào viên» cho nhà riêng của mỗi thành viên kim lan dự lễ.

### `EV-THATTICH-01` · Thất Tịch (七夕)

| Quy tắc | âm 7/7 | Vùng | Huyền Thành (cầu Ô Thước dựng tạm qua Hồ Sen), Cùng Thông Hồ | iOS | có (không có phần so lá số) |
|---|---|---|---|---|---|

**Ý nghĩa.** Truyện Ngưu Lang – Chức Nữ (cổ tích, phạm vi công cộng); quạ đen bắc cầu Ô Thước. Ở Việt Nam có mưa ngâu tháng Bảy.

**Hoạt động:**
1. **Bắc cầu Ô Thước** (sự kiện máy chủ nhỏ, cơ chế như `EV-CAU`): mỗi người góp «một con quạ» (vác một tấm ván nhẹ đặt lên cầu); cầu toàn máy chủ đủ ván trước giờ Tuất thì đêm đó có cảnh Ngưu Lang – Chức Nữ gặp nhau trên bầu trời. Mục tiêu `0,2 × N7` ván.
2. **Mưa ngâu:** trời Huyền Giới mưa nhẹ suốt ngày (hiệu ứng), cảnh buồn đẹp.
3. **Đạo lữ** (nhóm A, Phần 04 §4.4.9): cùng đi qua cầu Ô Thước, nhận ảnh kỷ niệm. Không có «xem duyên» trong lễ này.
4. **Người không có đạo lữ:** lễ không «nhắc» họ cô đơn; hoạt động chính (bắc cầu) dành cho mọi người. Câu của Thầy Tử Bình: «Cầu này ai bắc cũng được. Bắc cho người khác đi qua.»

**Thưởng:** vệt bước «Ngân Hà» (`trail`, mùa) cho người góp ≥ 3 ván.

### `EV-VULAN-01` · Vu Lan — Trung Nguyên (盂蘭 · 中元)

| Quy tắc | âm 15/7; tiền lễ 1/7 → 14/7 | Vùng | toàn thế giới; Phong Đô, Bút Tháp chính | Đại lễ | `EV-DL-03` Vạn Đăng Vu Lan (Phần 08 §8.3.4) | iOS | có (biến thể «Thắp Đèn Báo Hiếu») |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Phật giáo: Vu Lan báo hiếu (truyện Mục Kiền Liên cứu mẹ). Đạo giáo: Trung Nguyên, Địa quan xá tội (bản sơ đồ §10: «Phong Đô mở lối cứu người; thả đèn hoa đăng (Hồ Sen đã có)»).

**Hoạt động:**
1. **Báo hiếu** (cả tiền lễ): chuỗi gia đình NPC ở Huyền Thành có các việc «con cái giúp cha mẹ» (mỗi ngày một việc nhỏ); người chơi làm thay **người con đi xa** của NPC và viết thư (mẫu) gửi người con. Ghi «Hiếu thuận cha mẹ» (+2) — đây là **việc trong game** cho NPC, không phải đánh giá đời thật của người chơi.
2. **Cài hoa** (`cai_hoa`, Phần 06 §6.22.2): riêng tư — người chơi chọn hoa đỏ hoặc trắng, **người khác chỉ thấy hoa hồng nhạt chung**. Màn chọn có một câu duy nhất: «Hoa này cho mình. Không ai cần biết màu gì.»
3. **Phong Đô mở lối:** trong ngày 15/7, mọi người (kể cả cảnh giới < 5) vào được **Độ Nhân Kiều** của thánh địa (không phải đạo tràng) để **xem**; người cảnh giới ≥ 5 có chuỗi «dẫn người lạc» mở rộng (`GUILD-Q-BD-03` × 2).
4. **Thả hoa đăng** (đại lễ `EV-DL-03`).
5. **Bố thí thay cho «cúng cô hồn»:** tục cúng cô hồn tháng Bảy do **NPC** làm (cảnh nền ở làng); người chơi **không** làm nghi cúng; việc người chơi làm là **bố thí cho người nghèo NPC** (gạo, cháo) — ghi «Bố thí» (+2).

**Tôn trọng:**
- Không có không khí hù dọa «tháng cô hồn» (không ma nhảy ra, không cảnh báo «đừng ra đường đêm»).
- Câu chuyện Mục Kiền Liên kể bằng lời biên tập viên (không chép bản kinh).
- Nhắc trên màn chọn hoa: lễ có thể chạm vào nỗi đau người mất cha mẹ — hoạt động cài hoa **bỏ qua được** (nút «Bỏ qua»), không có thưởng gắn với nó.

**Thưởng:** đèn hoa đăng cầm tay (`hand`, mùa); không thưởng cho cài hoa.

```
[CẢNH EV-VULAN-01 · nhà bà Tư (Thợ May Tiên Y, `tho_may`) · chiều 14 tháng Bảy]
BÀ TƯ: (khâu áo) Thằng con tôi làm ăn xa, ba năm chưa về.
BÀ TƯ: Cháu viết hộ tôi mấy chữ được không? Tôi không biết chữ.
> Chọn thân thư (mẫu): ① «Mẹ khỏe, con đừng lo.» ② «Mẹ nhớ con.» ③ «Rằm này mẹ thắp hương cho bà nội rồi.»
(người chơi chọn 1–3 câu)
BÀ TƯ: (nghe đọc lại, gật đầu) Thế là đủ. Nó đọc là nó hiểu.
→ ghi «Hiếu thuận cha mẹ» (+2) — việc trong game cho NPC
→ ngày Rằm: thư hồi âm của người con đến nhà bà Tư (bà kể lại cho người chơi)
```

### `EV-DIATANG-01` · Vía Địa Tạng (地藏)

| Quy tắc | `lunarLast` tháng 7 (30, tháng thiếu thì 29) | Vùng | Phong Đô, Bút Tháp | Tông | `GUILD-BD`, `GUILD-TD` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Bồ Tát Địa Tạng với đại nguyện «địa ngục chưa trống, thề không thành Phật» — trong game là tinh thần của Phong Đô: **không bỏ ai lại**.

**Hoạt động:**
- **«Gánh Cùng» mở rộng** (`GUILD-RITE-BD-03`): người đang ở Tà Lộ (có Nợ Âm) có thể **mời bất kỳ đạo hữu nào** (không chỉ đồng môn Độ Đàn) làm các bước «làm cùng» trong ngày.
- **Kinh theo việc:** Tàng Kinh Bút Tháp giới thiệu Kinh Địa Tạng (`JING_ZHOU` — «Địa Tạng cho nghiệp nặng»), không in toàn văn.
- Danh hiệu **Hồi Đầu** (canon): người đạt danh hiệu trong vòng một năm trước ngày lễ được mời (riêng, không công khai) đặt một ngọn đèn ở Bia Hồi Đầu.

**Thưởng:** không vật phẩm; dấu «Không bỏ ai lại» trong Sổ Mệnh cho người làm ≥ 1 bước «làm cùng».

---

## 10.2 Tháng Tám – tháng Chín

### `EV-TRUNGTHU-01` · Tết Trung Thu (中秋)

| Quy tắc | âm 15/8; tiền lễ 8/8 → 14/8 | Vùng | toàn thế giới; Huyền Thành chính | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Tết đoàn viên; ở Việt Nam là **Tết thiếu nhi**: rước đèn, phá cỗ, múa lân, chuyện chị Hằng – chú Cuội.

**Hoạt động:**
1. **Làm đèn** (tiền lễ): đèn ông sao (dán giấy bóng kính 5 cánh), đèn kéo quân (xếp hình bóng xoay), đèn cá chép. Mini-game thủ công; đèn làm xong cầm được (`ruoc_den`).
2. **Rước đèn** (đêm 15): đoàn rước đi vòng Huyền Thành theo đường định sẵn; trống ếch, múa lân (`mua_lan` — cử chỉ 2 người).
3. **Bày cỗ, phá cỗ:** mỗi chi đường bày mâm cỗ ở Chính Đường (bánh nướng, bánh dẻo, bưởi, hồng… và **con vật bằng xôi / bột** do thành viên nặn); giờ Hợi phá cỗ — chia bánh cho khách.
4. **Ngắm trăng:** trăng tròn thật (pha âm lịch), cử chỉ `ngam_trang`.
5. **Codex chị Hằng – chú Cuội – cây đa** (cổ tích Việt, phạm vi công cộng).
6. **Ưu tiên thiếu niên:** người nhóm T có hoạt động riêng «Đội rước đèn» (chỉ nhóm T với nhau).

**Thưởng:** đèn ông sao (`hand`, vĩnh viễn — mỗi năm một màu), mặt nạ giấy (`head`, mùa); bánh trung thu (quà nhỏ, `banh_trung_thu`).

### `EV-THUPHAN-01` · Thu Phân — Đình thí

| Quy tắc | tiết Thu Phân; Đình thí mở Thu Phân ± 7 ngày (Phần 07 §7.1.6) | Vùng | Võ Đang (Thái Cực), Văn Miếu (Đình thí) | iOS | có |
|---|---|---|---|---|---|

**Hoạt động:**
- Cặp đối xứng với `EV-XUANPHAN-01`: Thái Cực Hội toàn máy chủ; năm nay chỉ số cân bằng có so với Xuân Phân (cùng mùa) — «Xuân lệch Dương, Thu lệch Âm?» (vui, không thưởng).
- **Đình thí** (khoa cao nhất mùa) ở Văn Miếu; danh sách đỗ lên Bảng Vàng Giấy (`GUILD-LB-05`).

**Thưởng:** Tam khôi: mũ «Hoa Quan» (một mùa); người đỗ: danh xưng khoa (kèm «danh hiệu trò chơi»).

### `EV-KHONGTU-01` · Khổng Tử đản (先師誕)

| Quy tắc | âm 27/8 (theo truyền thống âm lịch) | Vùng | Văn Miếu | Tông | `GUILD-NH` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày sinh Khổng Tử theo truyền thống — ngày tôn sư.

**Hoạt động:**
- **Thích Điện Tiểu Lễ** (`GUILD-RITE-NH-01`) quy mô thánh địa: sáu khay lễ do người chơi đảm nhận theo đăng ký (mỗi khay 1 người / suất; 6 suất trong ngày).
- **Hội Văn mở:** đối câu toàn máy chủ — mỗi phòng một bàn đối; bộ 30 vế mới của mùa.
- **Tôn sư:** mọi đệ tử (Phần 04 §4.1) được gợi ý gửi thư `thu.10` cho thầy.

**Thưởng:** bút lông «Tiên Sư» (`hand`, mùa) cho người dự Thích Điện.

### `EV-CUUHOANG-01` · Cửu Hoàng hội (九皇會)

| Quy tắc | âm 1/9 → 9/9 | Vùng | Đẩu Mẫu Điện (`ROOMS` id `daumau`, cửa ở Trích Thiên Đỉnh (−566, 566)), Long Hổ (Đẩu Điện), Phong Đô | Tông | `GUILD-CN`, `GUILD-BD` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Chín ngày đầu tháng Chín gắn với tín ngưỡng Bắc Đẩu Cửu Hoàng (chín vị sao Bắc Đẩu) trong Đạo giáo; có tục ăn chay chín ngày ở một số cộng đồng.

**Hoạt động:**
- **Chín đêm thắp chín đèn:** mỗi đêm một ngọn trên mô hình Bắc Đẩu (7 sao + 2 sao phụ theo truyền thống «cửu hoàng»); thắp đủ 9 đêm → bức «Bắc Đẩu sáng» trong nhà riêng.
- **Chay tùy nguyện:** người chơi có thể tự nhận «chay 9 ngày» trong game (nhân vật chỉ ăn món chay ở Trai Đường); **không** gợi ý người chơi nhịn ăn ngoài đời; không có thưởng chỉ số cho việc này — chỉ dấu «giữ chay» (ghi `CONG_QUA › «Ăn chay 1 ngày» +1` cho mỗi ngày giữ trong game, tối đa 9).

**Thưởng:** đồ bày «Bắc Đẩu đăng» (9 đêm đủ).

### `EV-TRUNGCUU-01` · Trùng Cửu (重九)

| Quy tắc | âm 9/9 | Vùng | Đẩu Mẫu Điện (bản sơ đồ §10: «bái Đẩu ở Đẩu Mẫu Điện (đã có)»), mọi đỉnh núi | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Tiết Trùng Dương: lên cao (登高), ngắm cúc, kính lão; bái Đẩu Mẫu.

**Hoạt động:**
1. **Đăng cao:** lên bất kỳ «đỉnh» nào (Kim Đỉnh Võ Đang, Chùa Đồng Yên Tử, đỉnh Trích Thiên…) **bằng chân**; trên đỉnh dùng `dang_cao`.
2. **Bái Đẩu ở Đẩu Mẫu Điện:** dâng đèn (`incense`), nghe Codex về Đẩu Mẫu.
3. **Kính lão:** chuỗi gia đình NPC — đưa ông bà NPC lên đồi ngắm cúc (đi chậm, đồng hành NPC). Ghi «Hiếu thuận / kính lão» (+2) tối đa 1 lần.
4. **Ngắm cúc** (`ngam_cuc`) ở vườn cúc Huyền Thành.

**Thưởng:** cành cúc vàng (`hand`, mùa); khung tên «Đăng Cao {năm}».

### `EV-QUANAM-03` · Vía Quán Thế Âm — xuất gia

| Quy tắc | âm 19/9 | Vùng | Bút Tháp | iOS | có |
|---|---|---|---|---|---|

**Hoạt động:** **«Buông một thứ»** — người chơi chọn tặng đi một **quà nhỏ** mình đang giữ (Phần 05 §5.1.3) cho một người lạ trong phòng hoặc một NPC (giữ ý «xuất gia» = buông bỏ); và lắng nghe NPC (như `EV-QUANAM-01`).

**Thưởng:** không vật phẩm; dấu «Buông» trong Sổ Mệnh.

---

## 10.3 Tháng Mười – tháng Chạp

### `EV-TRUNGTHAP-01` · Tết Trùng Thập — Cơm mới (重十)

| Quy tắc | âm 10/10 | Vùng | Huyền Thành, Y Lư Miêu Cương, ruộng các vùng | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Tục Việt: Tết cơm mới, Tết thường tân — mừng lúa mùa; giới thuốc Nam cũng coi trọng ngày này.

**Hoạt động:**
- **Gặt và giã cốm** (mini-game nhịp chày) ở ruộng Huyền Thành.
- **Y Lư:** bà A Mậu dạy phơi hạt, quả theo mùa (`tcm` theo hành).
- **Mâm cơm mới** ở Trai Đường chi đường: mời khách (thưởng khách × 1,0 cả ngày).

**Thưởng:** đồ bày «thúng cốm mới».

### `EV-HANGUYEN-01` · Hạ Nguyên — Thủy quan giải ách (下元)

| Quy tắc | âm 15/10, **ban ngày** (giờ Mão → giờ Thân) | Vùng | Cùng Thông Hồ (bản sơ đồ §10: «lễ ở Cùng Thông Hồ») | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Tam Nguyên: Hạ Nguyên Thủy quan giải ách.

**Hoạt động:**
- **Thả đèn nước ban ngày** — đèn hoa sen nhỏ (`tha_den`), mỗi đèn kèm một **lời giải tỏa** chọn từ danh sách («Thôi giận người ấy», «Bỏ một thói quen xấu», «Tha thứ cho mình»).
- **Dọn hồ:** vớt rác Cùng Thông Hồ (`GUILD-Q-TD-07` × 1,5 công).
- **Sảnh Điều Hậu** (station `dieuhau` ở Cùng Thông Hồ (480, 420)): khách NPC hôm nay đều có lá số «hàn thấp cần Hỏa» hoặc «táo cần Thủy» — giải án chủ đề điều hậu (`han-nuan`).

**Thưởng:** vệt bước «Thủy Văn» (`trail`, mùa).

### `EV-KHENTRANG-01` · Hội Khèn Trăng (lễ hư cấu của Miêu Cương)

| Quy tắc | âm 15/10, **giờ Dậu → Hợi** (17:00–23:00) | Vùng | Miêu Cương Cổ Trại | iOS | có |
|---|---|---|---|---|---|

**Vì sao hư cấu.** Phần 03 §3.5.3: lễ Miêu Cương không mượn tên lễ thật của một dân tộc có thật. Hội Khèn Trăng là lễ **của thế giới Huyền Giới**: dân trại mừng mùa thu hoạch xong, cảm ơn những người chữa bệnh (Y Lư), và nhớ ngày trại thoát khỏi yểm thuật của Lỗ Ban (tài liệu 03 cấp mốc cốt truyện).

**Hoạt động:**
- **Vòng xòe quanh lửa** (cử chỉ nhóm: nắm tay vòng tròn **không có đích cá nhân** — mọi người cùng bấm «vào vòng» là đứng vào vòng; Phần 06 cấm tiếp xúc có đích cá nhân, vòng xòe là cử chỉ tập thể).
- **Khèn:** người chơi có `thoi_sao` thổi theo nhịp khèn NPC.
- **Tạ Y Lư:** mang thảo dược đã hái cả mùa về Y Lư; bà A Mậu kể chuyện mùa.
- **Kịch bóng:** cảnh kể lại (tài liệu 03) ngày trại thoát yểm thuật.

**Thưởng:** vòng cổ bạc chạm hoa văn hư cấu (`head`, mùa; mẫu hoa văn do mỹ thuật thiết kế mới, có cố vấn văn hóa duyệt).

**Tôn trọng:** cố vấn văn hóa duyệt trang phục, nhạc cụ, điệu múa trước phát hành (Phần 03 §3.5.3).

### `EV-TONGKHACHBA-01` · Hội đèn tháng Mười ⚠ chờ tham vấn

| Quy tắc | **tạm** âm 25/10 (lễ thật theo **lịch Tạng**, có thể lệch lịch âm Trung Hoa — cần cố vấn) | Vùng | Tạng Địa | Tông | `GUILD-MT` | iOS | — |
|---|---|---|---|---|---|---|---|

**Trạng thái:** **cờ `enabled: false`** như `GUILD-MT`. Ý tưởng khung: đêm thắp đèn bơ trên mái (lễ tưởng niệm Tông Khách Ba ở truyền thống Tạng). Không phát hành nội dung Tạng truyền khi chưa có cố vấn (canon §3).

### `EV-NHAGIAO-01` · Ngày Nhà giáo Việt Nam (20/11 dương lịch)

| Quy tắc | `solar` 20/11 | Vùng | Văn Miếu, mọi Giảng Đường chi đường | Tông | mọi tông | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày tôn vinh thầy cô ở Việt Nam. Trong game: **ngày của sư đồ** (Phần 04 §4.1).

**Hoạt động:**
- **Tạ Thầy** (`GUILD-RITE-NH-04`) ở mọi Giảng Đường: đệ tử (hoặc học trò của lớp Giáo Tập) dâng trà (`dang_tra`) thầy.
- Đệ tử gửi thư `thu.10` kèm quà nhỏ (không giới hạn trần quà ngày này cho cặp sư đồ — vẫn là quà nhỏ).
- **Thầy cũ** (đã xuất sư) cũng nhận được lời chúc (Phần 04 §4.1.7).
- NPC thầy trong game (Thầy Tử Bình, Tế tửu, Vân Cốc…) nhận lời cảm ơn của người chơi; mỗi NPC đáp một câu riêng.

**Thưởng:** người làm thầy nhận khung tên «Tôn Sư {năm}» nếu có ≥ 1 đệ tử gửi lời cảm ơn; đệ tử nhận cành hoa giấy (`hand`, mùa).

```
[CẢNH EV-NHAGIAO-01 · Bàn Thầy Tử Bình, Sơn Môn · sáng 20/11]
NGƯỜI CHƠI: (chọn) «Mừng ngày nhà giáo, cảm ơn thầy.» (`le2.17`)
THẦY TỬ BÌNH: (đặt bút xuống) Cảm ơn con. Thầy chỉ chỉ chỗ. Đường con tự đi.
THẦY TỬ BÌNH: Hôm nay con có ai để cảm ơn ngoài đời không? Thầy không cần biết là ai. Con nhớ là được.
```

### `EV-TRUCLAM-01` · Giỗ Tổ Trúc Lâm

| Quy tắc | âm 1/11 (ngày Trần Nhân Tông nhập diệt năm Mậu Thân 1308 theo sử liệu Phật giáo Việt Nam — cố vấn xác nhận cách tính) | Vùng | Yên Tử | Tông | `GUILD-TH` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Tưởng niệm Phật hoàng Trần Nhân Tông, người sáng lập Thiền phái Trúc Lâm. **Ngày tổ của tông Thiền** trong game.

**Hoạt động:**
- **Thiền Thất Tuần** cả ngày ở Thiền Đường Vạn Tùng các Thiền Am (vùng im lặng).
- **Codex:** cuộc đời Trần Nhân Tông (vua – thiền sư), tách lịch sử và truyền thuyết; giới thiệu tác phẩm bằng **tên** (không chép bản dịch hiện đại).
- **Lên Ngọa Vân** ⚠: nơi Ngài nhập diệt — dựng nguyên mẫu kiến trúc (tài liệu 07), không dựng «tháp mộ» cho người chơi tương tác.

**Thưởng:** không vật phẩm; dấu «Giỗ Tổ Trúc Lâm {năm}» trong Codex.

### `EV-DIDA-01` · Vía A Di Đà (彌陀誕)

| Quy tắc | âm 17/11 | Vùng | Bút Tháp | Tông | `GUILD-TD` | iOS | có |
|---|---|---|---|---|---|---|---|

**Hoạt động:**
- **Niệm Phật thất một ngày** (Liên Đăng Niệm mở rộng): Cửu Phẩm Liên Đăng của thánh địa sáng theo **tổng nhịp đúng toàn máy chủ** trong ngày.
- **Hồi hướng:** mọi Hương Hỏa ngày này mặc định hồi hướng cho dự án công cộng (người chơi đổi được).

**Thưởng:** đèn sen chín cánh (đồ bày).

### `EV-DONGCHI-01` · Đông Chí — Cửu Cửu Tiêu Hàn (冬至 · 九九消寒)

| Quy tắc | tiết Đông Chí; `termSpan` 81 ngày («Tam cửu» `Lunar.getShuJiu()`) | Vùng | Huyền Thành (đại lễ), Chung Nam, Long Hổ | Đại lễ | `EV-DL-04` Vạn Nhân Đồng Tu (Phần 08 §8.3.5) | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** «Đông chí nhất dương sinh»: đêm dài nhất, dương khí bắt đầu trở lại. Trong Đạo giáo gắn với Nguyên Thủy Thiên Tôn. Tục «Cửu Cửu Tiêu Hàn đồ»: vẽ cành mai 81 cánh, mỗi ngày tô một cánh, hết 81 ngày là xuân về.

**Hoạt động:**
1. **Vạn Nhân Đồng Tu** (đại lễ máy chủ) ngày Đông Chí.
2. **Cửu Cửu Tiêu Hàn đồ** — hoạt động 81 ngày:
   - Mỗi người nhận một bức mai 81 cánh (9 bông × 9 cánh) treo nhà riêng.
   - Mỗi ngày tô **một** cánh — màu cánh theo **thời tiết trong game ngày đó** (nắng: đỏ; mây: lam; mưa: xanh; tuyết: trắng; gió: lục) — đúng tục xưa ghi thời tiết lên cánh mai.
   - Ngày thứ mấy lấy từ `Lunar.getShuJiu()` (đã chạy: 2027-12-22 = «一九第1天»; 2028-03-11 = «九九第9天» — ngày thứ 81).
   - **Không có hình phạt bỏ ngày:** cánh bỏ trống thì để trống; bức tranh có cánh trống vẫn là bức tranh thật của mùa đông người đó. Tô bù **không** được (tranh là nhật ký, không phải nhiệm vụ).
3. **Chè trôi / sủi cảo** ở Trai Đường; nhắc về «Đông chí ăn…» theo tục từng vùng (Codex).

**Thưởng:** bức Cửu Cửu Tiêu Hàn (đồ bày, mỗi năm một bức, giữ vĩnh viễn — sưu tập các mùa đông); hết 81 ngày có ≥ 60 cánh: khung tên «Tiêu Hàn {năm}».

```
[CẢNH EV-DONGCHI-01 · nhà riêng người chơi · ngày thứ 81]
(cánh cuối cùng được tô; bức mai đầy màu)
VÂN CỐC (thư gửi đến): Tám mươi mốt ngày. Có ngày con quên, cánh để trắng. Cũng đẹp. Xuân tới rồi đó.
```

### `EV-CHUVANAN-01` · Giỗ Chu Văn An ⚠

| Quy tắc | âm 26/11 ⚠ (cần cố vấn xác nhận) | Vùng | Văn Miếu | Tông | `GUILD-NH` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Chu Văn An (thế kỷ 14) — nhà giáo tiêu biểu của Việt Nam, được thờ ở Văn Miếu. **Ngày tổ thứ hai** của tông Nho trong game (cùng `EV-KHONGTU-01`).

**Hoạt động:**
- **Thất trảm sớ** — Codex: chuyện dâng sớ xin chém bảy nịnh thần rồi từ quan về dạy học (tinh thần **chính trực**, nói rõ là sử liệu, không bình phẩm chính trị hiện đại).
- **Dạy một người:** mọi người cảnh giới ≥ 3 được gợi ý dạy một lớp Giáo Tập hoặc kèm một người mới trong ngày (`GUILD-Q-NH-09` × 2).

**Thưởng:** nghiên mực «Tiều Ẩn» (đồ bày; Tiều Ẩn là hiệu của Chu Văn An — dùng như tên vật kỷ niệm, không phải tên hiệu người chơi được chọn: danh sách đen §3.4.3 Phần 03).

### `EV-LAPBAT-01` · Phật thành đạo — Lạp Bát (臘八)

| Quy tắc | âm 8/12 | Vùng | Bút Tháp, Yên Tử | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Kỷ niệm Đức Phật thành đạo; tục nấu cháo Lạp Bát.

**Hoạt động:**
- **Nấu cháo Lạp Bát** (tám thứ hạt) ở Trai Đường; mang phát cho người nghèo NPC (ghi «Bố thí» +2, tối đa 1 lần).
- **Ngồi dưới cây** (tưởng niệm Bồ Đề): tĩnh tọa ở gốc cây bồ đề sân Bút Tháp — đồng tu.

**Thưởng:** bát cháo Lạp Bát (quà nhỏ).

### `EV-TRUNGDUONG-01` · Vía Vương Trùng Dương ⚠

| Quy tắc | âm 22/12 ⚠ (cần cố vấn Toàn Chân xác nhận) | Vùng | Chung Nam | Tông | `GUILD-TC` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Vương Trùng Dương — tổ sư khai sáng Toàn Chân; **ngày tổ** của `GUILD-TC` (cùng `EV-YENCUU-01`).

**Hoạt động:** Vãn Khóa tổ (`GUILD-RITE-TC-01` biến thể); Codex «Hoạt tử nhân mộ» (chuyện Vương Trùng Dương tu trong mộ đào — kể ngắn, có ghi chép); **giữ giới tự nguyện** đợt cuối năm (7 ngày tới Trừ tịch).

**Thưởng:** áo «Toàn Chân Thanh Bào» (một mùa, chỉ thành viên `GUILD-TC` dự lễ).

### `EV-SOCVONG-01` · Sóc – Vọng hằng tháng (朔望)

| Quy tắc | `monthly` mùng 1 và rằm (kể cả tháng nhuận) | Vùng | toàn thế giới | iOS | có (Lư Hương → Lò Trầm) |
|---|---|---|---|---|---|

**Hoạt động:** việc chung máy chủ (Phần 08 §8.4): mùng 1 dâng hương (station `huong`), rằm phóng sinh đúng cách; Sám Hối Đầu Tháng của Liên Xã (`GUILD-RITE-TD-04`); chi đường có thể đặt đường lễ vào sóc – vọng (lễ vượng nếu hợp can ngày).

**Gộp lễ:** rằm tháng Giêng, rằm tháng Bảy, rằm tháng Tám, rằm tháng Mười đã có lễ lớn riêng → `EV-SOCVONG-01` ngày đó **không** hiện riêng, phần việc chung gộp vào lễ lớn.

**Thưởng:** khói hương / đàn cá vàng (Phần 08 §8.4); không vật phẩm cá nhân.

---

## 10.4 Lịch các ngày tổ của chín tông

| Tông | Ngày tổ (lễ) | Ghi chú |
|---|---|---|
| `GUILD-CN` | `EV-THIENSU-01` (18/5 ⚠) · phụ: `EV-NGOCHOANG-01` (9/1) | — |
| `GUILD-TV` | `EV-TTP-01` (9/4 ⚠) · phụ: `EV-HUYENVU-01` (3/3), `EV-LUTO-01` (14/4) | — |
| `GUILD-TC` | `EV-TRUNGDUONG-01` (22/12 ⚠) · `EV-YENCUU-01` (19/1) · phụ: `EV-HACHI-01` (Linh Bảo) | hai ngày tổ |
| `GUILD-TT` | `EV-MAOSON-01` (18/3 ⚠) | — |
| `GUILD-BD` | `EV-HUYENVU-01` (3/3) · `EV-DIATANG-01` (cuối tháng 7) | — |
| `GUILD-TH` | `EV-TRUCLAM-01` (1/11) | — |
| `GUILD-TD` | `EV-DIDA-01` (17/11) · phụ: ba vía Quán Âm | — |
| `GUILD-MT` | `EV-CHUANDE-01` (16/3) · `EV-TONGKHACHBA-01` ⚠ | chờ tham vấn |
| `GUILD-NH` | `EV-KHONGTU-01` (27/8) · `EV-CHUVANAN-01` (26/11 ⚠) · phụ: `EV-VANXUONG-01` (3/2) | — |

Trong ngày tổ của chính tông: tông lễ đặc biệt thay tông lễ tuần (nếu trùng tuần), Đạo Vọng đường lễ × 1,2, và cổng mọi chi đường của tông treo cờ tổ.

## 10.5 Tổng kết lịch một năm (chu kỳ Đinh Mùi 2027, theo dương lịch)

| Tháng dương | Lễ |
|---|---|
| 01/2027 | 30 Táo Quân · 31 Tạ Thái Tuế (→ 05/02) |
| 02/2027 | 04 **Lập Xuân** (mở mùa, `EV-TMB` Khai) · 05 Trừ tịch · 06–08 **Tết** · 14 Ngọc Hoàng · 15 khai hội Yên Tử · 20 **Thượng Nguyên** (`EV-DL-02`) · 24 Yến Cửu |
| 03/2027 | 09 Thổ Địa · 10 Văn Xương · 21 Xuân Phân · 22 Lão Quân (+ Niết Bàn) · 26 Quán Âm (đản) |
| 04/2027 | 05 **Thanh Minh** (`EV-DL-01` khánh thành Bàn trước hoặc vào ngày này) · 09 Huyền Vũ + Hàn Thực + Bàn Đào · 16 Nhớ Cội · 20 Cốc Vũ · 22 Chuẩn Đề · 24 Mao Sơn ⚠ |
| 05/2027 | 13 → 20 **Tuần Phật Đản** · 14 Trương Tam Phong ⚠ · 19 Lữ Tổ |
| 06/2027 | 09 **Đoan Ngọ** · 21 Hạ Chí (Hội thí) · 22 Thiên Sư ⚠ |
| 07/2027 | 22 Quán Âm (thành đạo) · 27 Tiết Nghĩa |
| 08/2027 | 08 Thất Tịch · 16 **Vu Lan** (`EV-DL-03`) · 31 Địa Tạng |
| 09/2027 | 15 **Trung Thu** · 23 Thu Phân (Đình thí) · 27 Khổng Tử · 30 Cửu Hoàng (→ 08/10) |
| 10/2027 | 08 Trùng Cửu · 18 Quán Âm (xuất gia) |
| 11/2027 | 07 Trùng Thập (cũng là Lập Đông) · 12 Hạ Nguyên + Khèn Trăng · 20 Nhà giáo · 22 Hội đèn ⚠ · 28 Trúc Lâm |
| 12/2027 | 14 A Di Đà · 22 **Đông Chí** (`EV-DL-04`, Cửu Cửu → 11/03/2028) · 23 Chu Văn An ⚠ |
| 01/2028 | 04 Lạp Bát · 18 Trùng Dương ⚠ · 19 Táo Quân (chu kỳ mới) · 20 Đại Hàn (`EV-DL-05` Đại Hội Quy Nhất) |

Cộng `EV-SOCVONG-01` 24 lần (trừ các rằm đã gộp). **Tổng: 51 mã lễ `EV-*`** (Phần 09: 25 · Phần 10: 26) + 5 đại lễ `EV-DL-*` + `EV-TMB`, `EV-CAU-01…19` + mã phụ `EV-NIETBAN-01`.

Mật độ: trung bình ~4 lễ / tháng dương — đủ để thế giới luôn có việc, không dày đến mức người chơi thấy «bị đuổi». Tháng thưa nhất (tháng 7 dương: 2 lễ nhỏ) là chủ ý — mùa hè nghỉ ngơi.

## 10.6 Checklist nghiệm thu Phần 10

- [ ] Mọi ngày trong §10.0 và §10.5 khớp `festivals.js` (test 2027, 2028).
- [ ] `EV-DIATANG-01` chọn đúng 30 hay 29 theo số ngày tháng 7 (2027, 2028 đều 30 ngày; thêm ca thử năm tháng 7 thiếu).
- [ ] `EV-DONGCHI-01`: ngày thứ n lấy từ `getShuJiu()`; không cho tô bù.
- [ ] `EV-VULAN-01`: `cai_hoa` riêng tư; nút «Bỏ qua»; iOS dùng «Thắp Đèn Báo Hiếu».
- [ ] `EV-THATTICH-01`: không có so lá số; người không có đạo lữ tham gia đầy đủ.
- [ ] `EV-KHENTRANG-01`: tài sản mỹ thuật có biên bản duyệt của cố vấn văn hóa.
- [ ] `EV-TONGKHACHBA-01` ẩn khi `GUILD-MT` tắt.
- [ ] Nhóm tuổi T không thấy món «cơm rượu» Đoan Ngọ và có «Đội rước đèn» riêng Trung Thu.
- [ ] Các lễ ⚠ (Thiên Sư, Trương Tam Phong, Mao Sơn, Chu Văn An, Trùng Dương, Hội đèn tháng Mười) có biên bản xác nhận ngày trước khi bật.
