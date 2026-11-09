# 10 · Phần 09 — Lịch lễ tiết (I): máy lịch, quy tắc chung, cuối năm cũ → tháng Tư âm lịch

> Căn cứ: canon §8 (`EV-<lễ>-xx`); bản sơ đồ §10 (bảng lễ tiết theo lịch âm thật), §9.2, §11, §14; code thật: `lunar-javascript` đã dùng trong `src/game/stations.js` (`Solar.fromYmdHms(...).getLunar()`, `getPrevJieQi()`), `thaitue.js › suiYear` (năm theo Lập Xuân), `zheri-case.js` (`getYearZhiByLiChun`), `src/engine/month-calendar.js`; `features.js` (iOS tắt gian bói); `state.js › lightLamp`, `addLantern`, `lightIncense`.
>
> Ngày dương lịch ví dụ trong phần này **đã chạy thật** bằng `lunar-javascript` cho chu kỳ năm âm **Đinh Mùi 2027** và **Mậu Thân 2028**.

## 9.0 Máy lịch lễ tiết

### 9.0.1 Mô-đun

`src/game/festivals.js` **(chưa có — cần làm)** — thuần dữ liệu + logic, không DOM (như `cosmetics.js`, `protocol.js`), dùng chung client, máy chủ, test.

```
FESTIVALS: [{ id, name, han, rule, window, region[], tong[], ios, priority, ... }]
festivalsOn(date, tz)          → [{ id, phase: 'tien'|'chinh'|'hau', day }]
upcoming(date, n, tz)          → n lễ sắp tới (ngày dương, đếm ngược)
occurrence(id, lunarYear, tz)  → { start, main, end } (Date)
```

### 9.0.2 Bảy kiểu quy tắc ngày

| `rule.type` | Ý nghĩa | Ví dụ |
|---|---|---|
| `lunar` | ngày âm `{m, d}`; `leap: 'skip'` (mặc định: tháng nhuận không lặp lễ) | Đoan Ngọ `{m:5, d:5}` — năm 2028 nhuận tháng 5: lễ chỉ ở tháng 5 chính (2028-05-28), không lặp ở tháng 5 nhuận (`Lunar.fromYmd(2028,-5,5)` = 2028-06-27) |
| `lunarLast` | ngày cuối tháng âm `{m}` (29 hoặc 30) | Trừ tịch `{m:12}`; vía Địa Tạng 30/7 → tháng thiếu thì 29/7 |
| `lunarRange` | từ `{m,d}` tới `{m,d}` | Tuần Phật Đản 8/4 → 15/4; Cửu Hoàng 1/9 → 9/9 |
| `term` | giờ giao một tiết khí (`getJieQiTable()[tên]`) | Lập Xuân, Thanh Minh, Đông Chí |
| `termSpan` | từ một tiết khí kéo dài N ngày | Cửu Cửu Tiêu Hàn: Đông Chí + 81 ngày (`Lunar.getShuJiu()` — đã chạy: 2027-12-22 = «一九第1天») |
| `solar` | ngày dương `{m, d}` | Ngày Nhà giáo Việt Nam 20/11 |
| `monthly` | các ngày âm trong mọi tháng | Sóc – Vọng `{days:[1,15]}` |

### 9.0.3 Múi giờ: lịch Việt khác lịch Trung Hoa

- `lunar-javascript` tính theo lịch Trung Hoa (UTC+8). Âm lịch Việt Nam tính theo UTC+7. Phần lớn các năm trùng nhau, nhưng **có năm lệch một ngày** đầu tháng (khi thời điểm sóc rơi vào khoảng 23:00–24:00 giờ Việt Nam). Ví dụ đã biết: Tết Đinh Hợi — Việt Nam 2007-02-17, Trung Hoa 2007-02-18 (thư viện trả 2007-02-18).
- Tiết khí cũng vậy: giờ giao tiết là một **thời điểm**; khi nó rơi vào 23:00–24:00 giờ Việt Nam thì «ngày tiết khí» theo giờ Việt sớm hơn một ngày so với giờ Bắc Kinh.
- **Việc cần làm:** module `lich-viet.js` **(chưa có — cần làm)** tính điểm sóc theo UTC+7 (thuật toán thiên văn chuẩn dùng cho âm lịch Việt) để dựng tháng âm Việt; tiết khí dùng thời điểm của `lunar-javascript` (`toYmdHms`) rồi đổi sang `Asia/Ho_Chi_Minh`. Cho tới khi có module: dùng `lunar-javascript` và một **bảng ngoại lệ** các năm lệch (kiểm bằng test so với lịch Việt chính thức).
- **Máy chủ MMO dùng giờ Việt Nam** (`Asia/Ho_Chi_Minh`) cho mọi cửa sổ lễ chung; client chơi đơn dùng múi giờ máy, nhưng lễ «âm lịch Việt» vẫn tính theo UTC+7 (lễ của người Việt), trừ khi người chơi chọn «lịch theo múi giờ nơi tôi ở» trong cài đặt.
- **Năm tính theo Lập Xuân** cho Thái Tuế và mùa (khớp `thaitue.js`), **năm âm theo mùng 1 Tết** cho lễ tiết. Hai mốc này lệch nhau vài ngày mỗi năm (Phần 07 §7.2.1): 2027 Lập Xuân 2027-02-04 trước Tết 2027-02-06; 2028 Tết 2028-01-26 trước Lập Xuân 2028-02-04.

### 9.0.4 Cửa sổ lễ

Mỗi lễ có ba pha (tùy lễ có hay không):

| Pha | Mặc định | Dùng cho |
|---|---|---|
| **Tiền lễ** | 3–7 ngày trước | chuẩn bị: hái lá, làm đèn, dọn nhà, gói bánh |
| **Chính lễ** | ngày chính (00:00 → 23:59 giờ Việt Nam) | nghi lễ, đại lễ máy chủ |
| **Hậu lễ** | 1–3 ngày sau | nhận thưởng còn sót, xem lại, dọn dẹp |

### 9.0.5 Trùng lễ

Nhiều lễ có thể rơi cùng ngày (vd 3/3 âm: Huyền Thiên Thượng Đế, Hàn Thực, Hội Bàn Đào; 2028: Ngọc Hoàng 9/1 và khai hội Yên Tử 10/1 rơi vào 2028-02-03 và 2028-02-04 = đúng Lập Xuân).

Luật:

1. Lễ ở **vùng khác nhau** chạy song song; người chơi chọn đi đâu.
2. Thẻ «Hôm nay» trong Sổ Mệnh hiện **tối đa 3 lễ**, xếp theo `priority`: (1) lễ chung toàn máy chủ (Tết, Trung Thu, Vu Lan, Thượng Nguyên, Đông Chí, Lập Xuân); (2) lễ của **chính tông** người chơi; (3) lễ tông khác; (4) vía khác.
3. Đại lễ máy chủ (`EV-DL-*`) **không bao giờ** đặt trùng giờ với nhau.
4. Thưởng các lễ **độc lập** (dự hai lễ cùng ngày nhận cả hai).

### 9.0.6 Quy tắc thưởng và vật phẩm lễ

| Được | Không bao giờ |
|---|---|
| Đồ Tàng Y Các **theo mùa lễ** nhận **miễn phí** khi tham gia (khung tên, vệt bước, đồ cầm tay) | bán vật phẩm hàm ý **may mắn / đổi vận** («bùa may đầu năm», «lộc Thần Tài», «đèn cầu duyên») |
| Bán **trang phục lễ hội chung chung** (áo dài Tết, áo tứ thân hội làng) bằng Ngọc — như mọi đồ Tàng Y Các, chỉ thẩm mỹ | bán vật mang **hình tượng tôn giáo** (tượng, tràng hạt, phù, bài vị) |
| Đồ bày nhà riêng / đạo tràng theo lễ | thưởng Đạo Hạnh, công đức, Ngọc **cho việc đi lễ** (đi lễ không phải «cày») |
| Phúc Khí nhỏ (≤ 50 / lễ) | thưởng theo **xếp hạng** ai đi lễ nhiều |

Công đức chỉ ghi khi trong lễ có **việc thiện thật** theo `CONG_QUA` (phóng sinh đúng cách, bố thí, sửa đường…), không ghi cho việc «có mặt».

### 9.0.7 Quy tắc miêu tả tôn trọng (áp dụng mọi lễ)

1. Lễ có thật được miêu tả **đúng ý nghĩa**, có mục Codex giải thích (nguồn: cố vấn, tài liệu 02 cấp `LORE-*`).
2. Không cho người chơi **nhại** nghi lễ thật bằng cử chỉ hài (Phần 06 §6.22.3).
3. Lễ liên quan **người đã khuất** (Thanh Minh, Vu Lan, Hàn Thực): thông tin người thân thật **chỉ ở chế độ riêng tư**, lưu trên máy, không lên mạng (Phần 05 §5.2).
4. Không có cảnh «xin xăm đầu năm», «cầu tài» theo nghĩa **bói cho bản thân** trên iOS (`FEATURES.divination = false`); trên web, xin xăm vẫn là station `xam` đã có, không gắn thêm «may mắn tăng vì lễ».
5. Lễ có **ngày còn tranh luận** giữa các truyền thống được đánh dấu ⚠ và chờ cố vấn xác nhận trước khi phát hành.
6. Lễ của **dân tộc / tôn giáo có thật** không bị «game hóa» thành cuộc thi điểm.

### 9.0.8 Bảng tổng (Phần 09)

| # | Mã | Lễ | Quy tắc | 2027 (Đinh Mùi) | 2028 (Mậu Thân) | Vùng chính |
|---|---|---|---|---|---|---|
| 1 | `EV-TAOQUAN-01` | Ông Công ông Táo | âm 23/12 (năm trước) | 2027-01-30 | 2028-01-19 | Huyền Thành, nhà riêng |
| 2 | `EV-TATAITUE-01` | Tạ Thái Tuế | âm 24/12 → Trừ tịch | 2027-01-31 → | 2028-01-20 → 2028-01-25 | Thái Tuế Điện |
| 3 | `EV-TRUTICH-01` | Trừ tịch – Giao thừa | `lunarLast` 12 | 2027-02-05 | 2028-01-25 | Huyền Thành |
| 4 | `EV-TET-01` | Tết Nguyên Đán | âm 1–3/1 | 2027-02-06 | 2028-01-26 | toàn thế giới |
| 5 | `EV-LAPXUAN-01` | Lập Xuân – đổi niên chủ | tiết Lập Xuân | 2027-02-04 | 2028-02-04 | Thái Tuế Điện, Thiên Mệnh Bàn |
| 6 | `EV-NGOCHOANG-01` | Vía Ngọc Hoàng | âm 9/1 | 2027-02-14 | 2028-02-03 | Long Hổ, Chính Điện Tam Thanh |
| 7 | `EV-YENTU-01` | Khai hội Yên Tử | âm 10/1 | 2027-02-15 | 2028-02-04 | Yên Tử |
| 8 | `EV-THUONGNGUYEN-01` | Thượng Nguyên – Nguyên Tiêu | âm 15/1 | 2027-02-20 | 2028-02-09 | toàn thế giới |
| 9 | `EV-YENCUU-01` | Yến Cửu tiết | âm 19/1 | 2027-02-24 | 2028-02-13 | Chung Nam |
| 10 | `EV-THODIA-01` | Vía Thổ Địa | âm 2/2 | 2027-03-09 | 2028-02-26 | Huyền Thành, các trạm nghỉ |
| 11 | `EV-VANXUONG-01` | Vía Văn Xương | âm 3/2 | 2027-03-10 | 2028-02-27 | Văn Xương Các (Thư Lâu) |
| 12 | `EV-LAOQUAN-01` | Vía Thái Thượng Lão Quân | âm 15/2 | 2027-03-22 | 2028-03-10 | Lão Quân Điện (Tử Bình Phong) |
| 13 | `EV-QUANAM-01` | Vía Quán Thế Âm (đản sinh) | âm 19/2 | 2027-03-26 | 2028-03-14 | Bút Tháp |
| 14 | `EV-XUANPHAN-01` | Xuân Phân – Âm dương bình | tiết Xuân Phân | 2027-03-21 | 2028-03-20 | Võ Đang |
| 15 | `EV-HUYENVU-01` | Vía Huyền Thiên Thượng Đế | âm 3/3 | 2027-04-09 | 2028-03-28 | Võ Đang, Phong Đô |
| 16 | `EV-HANTHUC-01` | Tết Hàn Thực | âm 3/3 | 2027-04-09 | 2028-03-28 | Huyền Thành |
| 17 | `EV-BANDAO-01` | Hội Bàn Đào | âm 3/3 | 2027-04-09 | 2028-03-28 | Côn Lôn |
| 18 | `EV-THANHMINH-01` | Thanh Minh | tiết Thanh Minh | 2027-04-05 | 2028-04-04 | mọi thánh địa (Tổ Sư Tháp), nhà riêng |
| 19 | `EV-HUNGVUONG-01` | Ngày Nhớ Cội (Giỗ Tổ Hùng Vương) | âm 10/3 | 2027-04-16 | 2028-04-04 | Huyền Thành, Văn Miếu |
| 20 | `EV-CHUANDE-01` | Vía Chuẩn Đề | âm 16/3 | 2027-04-22 | 2028-04-10 | Bút Tháp (tạm) / Tạng Địa |
| 21 | `EV-MAOSON-01` | Hội Mao Sơn ⚠ | âm 18/3 | 2027-04-24 | 2028-04-12 | Mao Sơn |
| 22 | `EV-COCVU-01` | Cốc Vũ – Lễ tạ chữ | tiết Cốc Vũ | 2027-04-20 | 2028-04-19 | Thư Lâu Lâm |
| 23 | `EV-PHATDAN-01` | Tuần Phật Đản | âm 8/4 → 15/4 | 2027-05-13 → 05-20 | 2028-05-02 → 05-09 | Bút Tháp, Yên Tử |
| 24 | `EV-TTP-01` | Vía Trương Tam Phong ⚠ | âm 9/4 | 2027-05-14 | 2028-05-03 | Võ Đang |
| 25 | `EV-LUTO-01` | Vía Lữ Tổ | âm 14/4 | 2027-05-19 | 2028-05-08 | Võ Đang, Chung Nam |

*(Chu kỳ «2027» = năm âm Đinh Mùi; các lễ tháng Chạp của chu kỳ đó rơi vào tháng 1/2028 — xem Phần 10. Hàng 1–3 ở đây là tháng Chạp **của năm âm trước**, mở đầu chu kỳ.)*

---

## 9.1 Cuối năm cũ

### `EV-TAOQUAN-01` · Ông Công ông Táo (灶君)

| Quy tắc | âm 23/12 | Cửa sổ | tiền lễ 20–22/12 (dọn bếp); chính lễ 23/12 đến giờ Ngọ |
|---|---|---|---|
| **Vùng** | Huyền Thành (bếp các nhà NPC), nhà riêng người chơi, Trai Đường chi đường | **iOS** | có (văn hóa, không bói) |

**Ý nghĩa.** Tục Việt: Táo Quân về trời báo việc nhà trong năm. Lễ nhắc người ta nhìn lại một năm trong nhà mình.

**Hoạt động:**
- **Dọn bếp** (tiền lễ): trong nhà riêng và Trai Đường chi đường, nhặt 5 «vết bụi năm cũ» (điểm sáng nhỏ) — mỗi vết là một **câu nhìn lại** chọn từ danh sách («Năm nay mình đã giúp ai?», «Năm nay mình làm ai buồn?»…). Câu chỉ mình thấy.
- **Thả cá chép** ở Hồ Sen Sơn Môn / hồ Cùng Thông: cá chép **mua của làng nuôi cá** (không phải cá bắt tự nhiên), thả xuống hồ có nước sạch — **không** thả cá vào sông bẩn, **không** vứt túi nilon (Lão Tùng nhắc). Việc này **không** ghi công đức «phóng sinh» (vì là tục cúng, không phải cứu mạng) — ghi rõ để không mâu thuẫn Phần 03 §3.2.4.
- **«Sổ Táo Quân»**: tự động tổng kết năm của người chơi (số án đã giải, số việc thiện, cảnh giới đã lên) — một trang đẹp có thể lưu ảnh. Câu cuối của Thầy Tử Bình: «Táo Quân báo gì thì báo. Sổ này con tự viết.»

**Thưởng:** đồ bày «Bếp lửa ba ông đầu rau» cho nhà riêng; 20 Phúc Khí.

**Tôn trọng:** không mô tả Táo Quân như nhân vật hài; không chế giễu tục cúng.

```
[CẢNH EV-TAOQUAN-01 · bến Hồ Sen Sơn Môn · sáng 23 tháng Chạp]
LÃO TÙNG: (xách chậu cá) Cá chép làng bên nuôi. Thả chỗ nước trong ấy.
LÃO TÙNG: Ngày xưa người ta thả cả túi xuống sông. Cá chết, sông bẩn. Ông Táo chắc cũng không vui.
(người chơi thả cá)
LÃO TÙNG: Ừ. Năm nay ông Táo lên trời báo gì về con, con đoán được không?
> ① «Báo con chăm.» ② «Báo con còn lười.» ③ «Con không biết.»
LÃO TÙNG: (bất kể chọn gì) Ông báo gì không quan trọng bằng con biết mình. Đi dọn bếp đi.
```

### `EV-TATAITUE-01` · Tạ Thái Tuế (謝太歲)

| Quy tắc | âm 24/12 → Trừ tịch | Vùng | Thái Tuế Điện (Huyền Thành, đã có: `world.js › ROOMS` id `thaitue`) | iOS | **tắt** (Thái Tuế Điện thuộc `IOS_OFF`) |
|---|---|---|---|---|---|

**Ý nghĩa.** Tục dân gian «tạ Thái Tuế» cuối năm: cảm tạ vị Thái Tuế trị năm sắp hết, tắt đèn an Thái Tuế đã thắp đầu năm.

**Hoạt động:**
- Người đã thắp đèn năm nay (`state.js › lightLamp(s, year)`) đến **tắt đèn** (thao tác: hạ bấc, chắp tay `palm`). Đèn chuyển thành **«đèn đã tạ»** trong Sổ Mệnh — kỷ niệm năm.
- Bàn Lễ Thái Tuế (station `thaitue`) hiện **tóm tắt năm** theo `thaitue.js › thaiTue()`: năm này người chơi phạm gì (nếu có), đã làm 7 pháp hóa nào — **không** phán «năm sau thế nào» trong lễ này (để dành cho `EV-LAPXUAN-01`).

**Thưởng:** 10 Phúc Khí (`LAMP_REWARD` có sẵn cho thắp đèn; tạ đèn thêm một lần nhỏ).

### `EV-TRUTICH-01` · Trừ tịch – Giao thừa (除夕)

| Quy tắc | `lunarLast` tháng 12 (29 hoặc 30) | Cửa sổ | cả ngày; cao điểm giờ Tý (23:00–01:00) chuyển sang mùng 1 | Vùng | Huyền Thành | iOS | có |
|---|---|---|---|---|---|---|---|

**Hoạt động:**
- **Gói bánh chưng** (Trai Đường chi đường, bếp Huyền Thành): mini-game xếp lá dong – gạo – đậu – thịt (hoặc **nhân chay**), buộc lạt; bánh luộc «qua đêm» (đồng hồ thật 30 phút trong game). Bánh làm xong là **quà nhỏ** (Phần 05 §5.1.3) tặng được trong Tết.
- **Giao thừa ở Huyền Thành:** quảng trường; đếm ngược theo giờ máy chủ (giờ Việt Nam); khi sang giờ Tý mùng 1, trời nổ **pháo hoa** (hiệu ứng, có tùy chọn «giảm chuyển động / âm thanh» — `reduced`, bản sơ đồ §12).
- **Hái lộc đầu năm** (sau giao thừa): bẻ một nhành lộc ở cây đa Huyền Thành — **chỉ là cành non mang về cắm bàn thờ nhà riêng**, không gắn «may mắn», không có kết quả ngẫu nhiên.

**Thưởng:** cành lộc (đồ bày nhà riêng); khung tên «Giao thừa {năm can chi}» cho người có mặt lúc giao thừa.

---

## 9.2 Tết và tháng Giêng

### `EV-TET-01` · Tết Nguyên Đán (春節)

| Quy tắc | âm 1/1 → 3/1 | Tiền lễ | 23/12 → Trừ tịch (gộp với các lễ trên) | Hậu lễ | 4/1 → 7/1 (khai hạ) | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Lễ lớn nhất năm. Trong game: sum họp, chúc nhau, xông đất, lì xì, đi chùa, đi lễ đầu năm.

**Hoạt động:**
1. **Xông đất** (mùng 1, giờ Tý → giờ Tỵ): người chơi đầu tiên bước vào **đạo tràng một chi đường** (không phải thành viên) hoặc **nhà riêng của một đạo hữu** (người kia mở cửa đón khách) trong mùng 1 là «người xông đất». Chủ nhà chọn lời đón (cụm từ `tet.*`), khách chọn lời chúc. Cả hai nhận một **dấu xông đất** (sưu tầm: xông đất được bao nhiêu nhà). Game **không** chấm «tuổi xông đất hợp hay không» (đó là xem tuổi — tránh lộ năm sinh, tránh bói).
2. **Lì xì Lộc Xuân** (Phần 05 §5.1.4): 8 bao / ngày, chỉ có tác dụng khi tặng; xác suất công khai.
3. **Chúc Tết NPC:** đi khắp Huyền Thành chúc Tết 12 gia đình NPC (chuỗi hiếu đạo, tài liệu 05/06) — mỗi nhà một câu chuyện năm mới ngắn.
4. **Đi lễ đầu năm** ở thánh địa chính tông: tông lễ đặc biệt «Khai Xuân» thay tông lễ tuần đầu năm (mỗi tông một biến thể, dùng nghi của Phần 02–03 với trang trí Tết).
5. **Câu đối đỏ:** chọn một cặp câu đối Tết (bộ viết mới) treo cửa nhà riêng / đạo tràng.

**Thưởng:** áo dài Tết «Xuân Phong» (miễn phí, một mùa), khung tên «Xuân {năm can chi}», 30 Phúc Khí ngày mùng 1.

**Tôn trọng:** không có «quẻ đầu năm» kiểu phán vận; Xin xăm (web) giữ nguyên như ngày thường, không thêm thông điệp «năm nay bạn sẽ…».

```
[CẢNH EV-TET-01.XONGDAT · cổng đạo tràng «Thanh Vân Pháp Đàn» · mùng 1, giờ Dần]
(khách là người chơi A — không thuộc chi đường; chủ đường là người chơi B đang trong đạo tràng)
HỆ THỐNG (B): Có khách đầu năm đứng trước cổng. Mở cửa đón?
(B mở cửa)
A: (chọn) «Chúc mừng năm mới!» + «Năm mới tu tiến nhé.»
B: (chọn) «An khang thịnh vượng.» + cử chỉ `chuc_tet`
HỆ THỐNG: {A} là người xông đất Thanh Vân Pháp Đàn năm Đinh Mùi.
(trên Đàn Môn hiện một tấm giấy đỏ nhỏ ghi tên tu của A — ở đó tới hết tháng Giêng)
```

### `EV-LAPXUAN-01` · Lập Xuân — đổi niên chủ Thái Tuế (立春)

| Quy tắc | tiết Lập Xuân (giờ giao tiết) | Vùng | Thái Tuế Điện, Thiên Mệnh Bàn | iOS | Thái Tuế Điện tắt; Thiên Mệnh Bàn bản «học phong thủy năm» có |
|---|---|---|---|---|---|

**Ý nghĩa.** Năm can chi mới bắt đầu từ Lập Xuân (`thaitue.js › suiYear`). Bản sơ đồ §10: «an Thái Tuế toàn máy chủ; tượng niên chủ mới ở Thái Tuế Điện».

**Hoạt động:**
- **Đổi niên chủ:** tượng Thái Tuế năm mới (theo `taisui-general › TAISUI_60`, vd năm Đinh Mùi 2027, Mậu Thân 2028) hiện ở Thái Tuế Điện; cảnh đổi tượng có nghi «nghênh Thái Tuế».
- **An Thái Tuế:** thắp đèn năm mới (`lightLamp(s, year)` — mỗi năm một ngọn). Bàn Lễ hiện người chơi có phạm Thái Tuế năm nay không (`thaitue.js › thaiTue(birthYearZhi, birthYear)` → `me`: Trị / Xung / Hình / Hại / Phá) và **7 pháp hóa** (`TAISUI_REMEDY`) — tất cả **trên máy**, không gửi lên máy chủ.
  - Ví dụ chuẩn: lá số `MAU-A` (tuổi Ngọ) — năm 2026 Bính Ngọ phạm Trị + Hình (canon §11).
- **Mở mùa:** `EV-TMB` (Phần 08 §8.1) bắt đầu; Thiên Bảng sang mùa mới (Phần 07 §7.2).

**Thưởng:** khung tên «Niên chủ {năm can chi}»; vệt bước theo hành nạp âm của năm.

**Tôn trọng:** câu dẫn bắt buộc khi người chơi phạm Thái Tuế: «Phạm Thái Tuế là lời nhắc thận trọng, không phải án. Năm nay đi chậm, nghĩ kỹ, làm việc thiện.» (cùng tinh thần cảnh vạch quầy Định Mệnh Hội, Phần 02 §2.1.4).

### `EV-NGOCHOANG-01` · Vía Ngọc Hoàng (玉皇誕)

| Quy tắc | âm 9/1 | Vùng | Long Hổ (Chính Nhất), Chính Điện Tam Thanh (Huyền Thành — `ROOMS` id `chinhdien`) | Tông | `GUILD-CN` (chính), mọi tông Đạo giáo | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày vía Ngọc Hoàng Thượng Đế trong tín ngưỡng Đạo giáo và dân gian.

**Hoạt động:** tông lễ đặc biệt của `GUILD-CN` «Kính Thiên» (biến thể Tiểu Tiếu Đàn: sớ dâng cầu cho **cả thế giới Huyền Giới**, không cầu cho cá nhân); người chơi các tông Đạo giáo khác có thể dự như khách (thưởng khách × 1,0 trong ngày này).

**Thưởng:** cờ hiệu đỏ vàng cho đạo tràng `GUILD-CN` dự lễ; 15 Phúc Khí.

**Ghi chú:** năm 2028 vía rơi vào 2028-02-03 — một ngày trước Lập Xuân (2028-02-04): lễ vẫn thuộc **mùa cũ** (Đinh Mùi). Không ảnh hưởng gì ngoài nhãn mùa của phần thưởng.

### `EV-YENTU-01` · Khai hội Yên Tử

| Quy tắc | âm 10/1, hội kéo dài tới hết tháng 3 âm (`lunarRange` 10/1 → 30/3) | Vùng | Yên Tử | Tông | `GUILD-TH` chính; mọi người | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Mùa hành hương Yên Tử bắt đầu từ mùng 10 tháng Giêng (lễ hội có thật ở Quảng Ninh).

**Hoạt động:**
- **Đoàn hành hương** (Phần 04 §4.5 — đoàn ≤ 12): đi bộ từ chân núi lên Chùa Đồng; mỗi điểm dừng (Giải Oan, Hoa Yên, Huệ Quang — nguyên mẫu) có NPC kể chuyện ngắn về Trúc Lâm (Codex).
- Dự án Hội Thiện tháng Giêng tự chọn đường `EV-CAU-13` (Trích Thiên ↔ Yên Tử) (Phần 08 §8.2.6).
- **Không có cáp treo** trong game: tinh thần đi bộ; người chơi có khó khăn vận động thật vẫn đi được (nhân vật đi bộ — không đòi hỏi thao tác khó; chế độ «tự đi theo đoàn»).

**Thưởng:** gậy trúc hành hương (đồ cầm tay, mùa), huy hiệu «Lên Chùa Đồng {năm}».

**Tôn trọng:** không dựng cảnh chen lấn, rải tiền lẻ, đặt tiền vào tay tượng (hành vi bị khuyến cáo ngoài đời); NPC Pháp Không nói một câu về «đi hội trong lặng».

### `EV-THUONGNGUYEN-01` · Thượng Nguyên – Nguyên Tiêu (上元)

| Quy tắc | âm 15/1 | Vùng | toàn thế giới; Huyền Thành chính | Đại lễ | `EV-DL-02` Vạn Đăng Thượng Nguyên (Phần 08 §8.3.3) | iOS | có (đèn không kèm điều ước cho bản thân) |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Tam Nguyên: Thượng Nguyên Thiên quan tứ phúc (bản sơ đồ §10). Rằm tháng Giêng — ở Việt Nam «lễ quanh năm không bằng rằm tháng Giêng».

**Hoạt động:**
- **Thắp đèn** (đại lễ máy chủ) — mỗi người một ngọn, chọn **lời cầu cho người khác** (cha mẹ, thầy, bạn, người lạ đi đường).
- **Đố đèn** (灯谜): đèn lồng treo câu đố — câu đố về **chữ Hán – Hán Việt** và **thuật ngữ cổ pháp** (vd «Ngày dài nhất năm là tiết gì?» → Hạ Chí); giải đúng nhận một dải lụa màu. Biên tập viên viết 120 câu đố mới.
- **Chè trôi nước, bánh trôi** ở Trai Đường.

**Thưởng:** đèn lồng cầm tay «Thượng Nguyên» (`hand`, miễn phí), dải lụa đố đèn (sưu tầm 12 màu).

### `EV-YENCUU-01` · Yến Cửu tiết (燕九節)

| Quy tắc | âm 19/1 | Vùng | Chung Nam (`GUILD-TC`) | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Ngày gắn với Khâu Xứ Cơ (Trường Xuân chân nhân, Toàn Chân); ở Bạch Vân Quán (Bắc Kinh) có hội «Yến Cửu» lâu đời. Trong game: **ngày tổ** của tông Toàn Chân.

**Hoạt động:**
- **Vân thủy tập thể:** mọi Đạo Am mở Khách Đường cả ngày (lệ thập phương nâng gấp đôi: thưởng khách × 1,5).
- **Chuyện Khâu tổ:** NPC Khâu đạo trưởng kể (Codex) chuyến đi xa của Khâu Xứ Cơ — chỉ chuyện có ghi chép, ngắn, tránh huyền thoại hóa quá mức.
- **Tam quan sờ khỉ đá** ⚠: tục dân gian ở Bạch Vân Quán (sờ hình khỉ đá khắc ở cổng). Game **không làm** (tránh biến tục cầu may thành cơ chế) — chỉ nhắc trong Codex.

**Thưởng:** nón vân thủy (đồ đội đầu, mùa) cho người đi ≥ 3 km trong ngày.

### `EV-THODIA-01` · Vía Thổ Địa (土地公)

| Quy tắc | âm 2/2 | Vùng | Huyền Thành, mọi trạm nghỉ (Phần 08 §8.2.5) | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Thổ Địa — thần giữ đất làng trong tín ngưỡng dân gian.

**Hoạt động:** **«Tạ đất»** = **sửa đường**: mọi công `EV-CAU` trong ngày × 1,5 (trong trần ngày); ở mỗi trạm nghỉ có miếu Thổ Địa nhỏ (đi vào được — một gian thờ nhỏ có mái), người chơi quét dọn và thắp một nén hương (`incense`).

**Thưởng:** 10 Phúc Khí cho người góp ≥ 10 công trong ngày.

### `EV-VANXUONG-01` · Vía Văn Xương (文昌帝君)

| Quy tắc | âm 3/2 | Vùng | Văn Xương Các (`ROOMS` id `vanxuong`, cửa ở Thư Lâu Lâm (0, −652)) | Tông | `GUILD-NH` | iOS | có (lễ chăm học, không cầu đỗ) |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Văn Xương Đế Quân — vị thần văn học trong tín ngưỡng Đạo giáo / dân gian, được học trò kính.

**Hoạt động:**
- **Lễ chăm học:** người chơi đặt **một quyển sách mình đã đọc** (trong game) lên án thư ở Văn Xương Các, chọn một câu tâm đắc (từ `library-data`).
- **Hương thí sớm:** mở một vòng thi thử khoa cử (không tính `GUILD-LB-05`).
- **Không có** vật phẩm «bùa thi đỗ», không có cơ chế «đến Văn Xương thì điểm thi cao hơn» (Phần 03 §3.4.9).

**Thưởng:** bút lông «Văn Xương» (`hand`, mùa).

### `EV-LAOQUAN-01` · Vía Thái Thượng Lão Quân (太上老君)

| Quy tắc | âm 15/2 | Vùng | Lão Quân Điện (`ROOMS` id `laoquan`, cửa ở Tử Bình Phong (−564, −510)) | Tông | mọi tông Đạo giáo | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày vía Thái Thượng Lão Quân (Lão Tử được tôn trong Đạo giáo). Cùng ngày 15/2 âm, Phật giáo kỷ niệm **Phật nhập Niết Bàn** — hai lễ ở **hai vùng khác nhau** (Lão Quân Điện / Bút Tháp), không trộn.

**Hoạt động:**
- **Đọc Đạo Đức Kinh:** Lão Quân Điện bày 81 «thẻ chương»; mỗi người đọc một chương (bản Hán + lời giảng nghĩa ngắn viết mới; Đạo Đức Kinh là văn bản cổ, nhưng **bản dịch hiện đại có bản quyền** — dùng bản giảng nghĩa do biên tập viên viết).
- **Một câu hỏi ngược:** NPC hỏi một câu theo tinh thần «vô vi»; không đúng sai.

**Thưởng:** quạt giấy «Đạo» (đã có `quat_giay` viết chữ «道» — lễ cấp **phiên bản viền vàng**, miễn phí).

**Ghi chú Niết Bàn:** Bút Tháp tổ chức **lễ tưởng niệm lặng** (vùng im lặng cả ngày trong Chánh Điện) — mã phụ `EV-NIETBAN-01`.

### `EV-QUANAM-01` · Vía Quán Thế Âm — đản sinh (觀音誕)

| Quy tắc | âm 19/2 | Vùng | Bút Tháp | Tông | `GUILD-TD` (chính), mọi người | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày vía Bồ Tát Quán Thế Âm (một trong ba ngày vía trong năm: 19/2, 19/6, 19/9).

**Hoạt động:**
- **Lắng nghe:** Quán Thế Âm là «người lắng nghe tiếng kêu của đời». Hoạt động chính là **nghe**: Huyền Thành có 30 NPC có «chuyện muốn kể»; người chơi ngồi nghe trọn một chuyện (không chọn lựa, chỉ nghe và gật đầu `nod` / `listen`), cuối chuyện chọn một **lời an ủi** (nhóm `kl.*`). Mỗi lần nghe trọn → ghi «Giúp người khó khăn» (+2, tối đa 1 lần / ngày lễ).
- **Liên Đăng Niệm** đặc biệt ở Bút Tháp (tông lễ `GUILD-RITE-TD-01`, quy mô máy chủ).

**Thưởng:** cành dương liễu (`hand`, mùa).

**Tôn trọng:** không đặt lời thoại vào miệng Bồ Tát; không có «tượng Quán Âm» là vật phẩm.

---

## 9.3 Tháng Hai – tháng Ba

### `EV-XUANPHAN-01` · Xuân Phân — âm dương bình (春分)

| Quy tắc | tiết Xuân Phân | Vùng | Võ Đang | Tông | `GUILD-TV` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày và đêm dài bằng nhau.

**Hoạt động:** **Thái Cực Hội** quy mô máy chủ (biến thể `GUILD-RITE-TV-01`): hai nửa Âm – Dương **toàn máy chủ** (mỗi phòng một Thái Cực đồ); chỉ số «cân bằng» = độ chênh số người hai nửa toàn máy chủ (càng gần 50/50 càng sáng). Người vào sau tự được mời đứng nửa ít người hơn.

**Thưởng:** vệt bước «Âm Dương» (đen trắng xen kẽ), một mùa.

**Cặp đôi:** `EV-THUPHAN-01` (Phần 10) là lễ đối xứng mùa thu.

### `EV-HUYENVU-01` · Vía Huyền Thiên Thượng Đế (玄天上帝)

| Quy tắc | âm 3/3 | Vùng | Võ Đang (Huyền Vũ — chủ thần Võ Đang), Phong Đô (Bắc Đế) | Tông | `GUILD-TV`, `GUILD-BD` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Huyền Thiên Thượng Đế (Chân Võ, Bắc Đế) — thần trấn phương Bắc, được thờ chính ở Võ Đang.

**Hoạt động:**
- **Võ Đang:** đoàn lên Kim Đỉnh bằng bậc đá (đi bộ, không bay) — 1 lần / người; trên đỉnh có lễ Thái Cực nhỏ.
- **Phong Đô:** Đăng Kiều đặc biệt (`GUILD-RITE-BD-01`) mở cho **mọi cảnh giới** (chỉ phần đặt đèn, không phần nhiệm vụ cảnh giới 5) — dịp để người chưa đủ cảnh giới thấy Phong Đô theo cách nhẹ nhàng.

**Thưởng:** dải lụa đen viền bạc (`back`, mùa).

### `EV-HANTHUC-01` · Tết Hàn Thực (寒食)

| Quy tắc | âm 3/3 (theo phong tục Việt) | Vùng | Huyền Thành | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Ở Việt Nam, ngày 3/3 âm là Tết Hàn Thực với bánh trôi, bánh chay. Gốc tích gắn với chuyện Giới Tử Thôi (văn hóa Trung Hoa); người Việt đã biến thành ngày làm bánh cúng tổ tiên.

**Hoạt động:**
- **Nặn bánh trôi:** mini-game nặn viên, cho đường phèn, luộc; bánh nổi lên là chín. Bánh là quà nhỏ.
- **Codex:** chuyện Giới Tử Thôi — kể ngắn, nhấn **lòng trung và sự khiêm** (không phải chuyện «đốt núi»).
- **Không dùng lửa** trong nhà riêng hôm đó (chi tiết vui: bếp nhà riêng tắt, chỉ ăn đồ nguội) — thuần không khí, không ảnh hưởng chơi.

**Thưởng:** đồ bày «đĩa bánh trôi bánh chay».

### `EV-BANDAO-01` · Hội Bàn Đào (蟠桃會)

| Quy tắc | âm 3/3 | Vùng | Côn Lôn Thiên Trì (end-game) | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Truyền thuyết Tây Vương Mẫu mở hội bàn đào ở Dao Trì (Côn Lôn — canon `conlon`, nguyên mẫu «Dao Trì (truyền thuyết)»).

**Hoạt động:**
- Chỉ người **đã mở Côn Lôn** (Quy nhất) lên được đảo; họ dự hội: ngồi quanh Thiên Trì, mỗi người **mang theo một câu chuyện** về một người khác đã giúp mình trên đường tu (chọn từ nhật ký: thầy, kim lan, đồng môn — chỉ hiện tên tu nếu người đó đồng ý hiện).
- Người chưa mở Côn Lôn: thấy đảo trời phát sáng hồng từ dưới mặt đất; ở Huyền Thành có chợ «đào tiên» (quả đào thường) chia cho mọi người.

**Thưởng:** người dự trên đảo: trâm hoa đào tiên (`head`, vĩnh viễn); người dưới đất: 1 quả đào (quà nhỏ).

**Tôn trọng:** truyền thuyết, không gắn «trường sinh», không có «ăn đào để tăng tuổi thọ / chỉ số».

### `EV-THANHMINH-01` · Thanh Minh (清明)

| Quy tắc | tiết Thanh Minh; cửa sổ cả tiết (≈ 15 ngày) | Vùng | Tổ Sư Tháp mỗi thánh địa; nhà riêng | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** «Thanh minh trong tiết tháng Ba»: tảo mộ, nhớ người đã khuất.

**Hoạt động — hai lớp tách bạch:**

1. **Công cộng — Tổ Sư Tháp:** mỗi thánh địa có khu **tháp tổ sư hư cấu** (không phải mộ có thật). Người chơi quét dọn, nhổ cỏ, thắp hương, cắm hoa. Đây là việc chung (tiến độ «sạch tháp» của mỗi thánh địa).
2. **Riêng tư — Bàn thờ gia tiên ở nhà riêng:** người chơi **có thể** đặt một bàn thờ nhỏ; **không cần** nhập tên; nếu muốn ghi tên người thân, ghi chú lưu **trên máy** (không lên mạng, không đồng bộ — Phần 05 §5.2, quy tắc §9.0.7.3). Khách đến nhà riêng **không thấy** ghi chú này, chỉ thấy bàn thờ.

**Thưởng:** không có thưởng vật phẩm cho lớp riêng tư (việc nhớ người thân không phải để nhận quà). Lớp công cộng: 10 Phúc Khí / tháp sạch.

**Tôn trọng:** không có cảnh ma quỷ, không «gọi hồn», không «xin âm dương».

```
[CẢNH EV-THANHMINH-01 · Tổ Sư Tháp, Chung Nam · sáng, mưa bụi]
KHÂU ĐẠO TRƯỞNG: (nhổ cỏ quanh chân tháp) Người nằm đây không ai nhớ tên nữa. Vẫn phải nhổ cỏ.
> ① «Sao phải nhổ cỏ cho người không ai nhớ ạ?»  ② (im lặng nhổ cỏ cùng)
(①) KHÂU ĐẠO TRƯỞNG: Vì mai kia mình cũng thế. Nhổ cỏ cho người là nhổ cỏ cho mình.
(②) KHÂU ĐẠO TRƯỞNG: (sau một lúc) Ừ. Thế là đủ.
```

### `EV-HUNGVUONG-01` · Ngày Nhớ Cội (Giỗ Tổ Hùng Vương)

| Quy tắc | âm 10/3 | Vùng | Huyền Thành, Văn Miếu | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Ngày giỗ Tổ Hùng Vương — ngày lễ quốc gia của Việt Nam, nhớ về cội nguồn dân tộc.

**Cách đưa vào thế giới hư cấu.** Huyền Giới là thế giới hư cấu pha nhiều truyền thống. Để không «thần thoại hóa lẫn lộn» một ngày lễ quốc gia, game gọi là **«Ngày Nhớ Cội»** và chỉ có:
- **Codex** (nguồn truyền thuyết dân gian, đã thuộc phạm vi công cộng): Lạc Long Quân – Âu Cơ, Lang Liêu và bánh chưng bánh giầy;
- **Làm bánh giầy** ở Trai Đường (nối với bánh chưng ngày Trừ tịch: hai bánh của Lang Liêu);
- câu của Tế tửu: «Ai cũng có cội. Nhớ cội thì đi xa mấy cũng không lạc.»

Không có thưởng điểm, không có vật phẩm có hình tượng Vua Hùng, không có «đền Hùng» dựng trong game.

**Thưởng:** đồ bày «mâm bánh chưng bánh giầy».

### `EV-CHUANDE-01` · Vía Chuẩn Đề (準提菩薩)

| Quy tắc | âm 16/3 | Vùng | khi `GUILD-MT` chưa mở: Bút Tháp (Tàng Kinh); khi mở: Tạng Địa | Tông | `GUILD-MT` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Ngày vía Chuẩn Đề Bồ Tát (có trong Phật giáo Hán – Việt; `remedy-fate › ZHUNTI`).

**Hoạt động:** đọc giới thiệu `ZHUNTI` (không hiện toàn văn chú); **mạn-đà-la cát nhỏ** một người (bản giới thiệu của `GUILD-Q-MT-00.1`) mở cho mọi người trong ngày.

**Thưởng:** không vật phẩm; dấu «Đã học Chuẩn Đề» trong Codex.

### `EV-MAOSON-01` · Hội Mao Sơn ⚠

| Quy tắc | âm 18/3 ⚠ (ngày hội truyền thống ở Mao Sơn; **cần cố vấn xác nhận**) | Vùng | Mao Sơn | Tông | `GUILD-TT` | iOS | có (không phần Âm tà) |
|---|---|---|---|---|---|---|---|

**Hoạt động:** chợ phiên Mao Sơn (bán đồ thủ công thường — không có «bùa»); Tồn Tư Đàn mở rộng; chuỗi «Nhà sáng đèn» (`GUILD-Q-TT-03`) × 2 công trong ngày.

**Thưởng:** đèn lồng bạc (`hand`, mùa).

### `EV-COCVU-01` · Cốc Vũ — Lễ tạ chữ (穀雨)

| Quy tắc | tiết Cốc Vũ | Vùng | Thư Lâu Lâm | iOS | có |
|---|---|---|---|---|---|

**Ý nghĩa.** Truyền thuyết kể Thương Hiệt tạo chữ, trời đổ mưa thóc — ngày Cốc Vũ gắn với lễ nhớ Thương Hiệt ở một số nơi. Trong game: **ngày quý chữ**.

**Hoạt động:**
- **Tích tự** (惜字): nhặt «giấy có chữ» rơi rải rác ở Thư Lâu Lâm (giấy cũ, câu đối rách), mang về **lò tích tự** (một lò đá nhỏ đi vào được) — tục xưa quý giấy có chữ, không vứt bừa.
- **Đối câu chữ Hán:** ghép chữ Hán từ bộ thủ (mini-game: 214 bộ thủ, ghép thành chữ thường gặp trong cổ pháp: 木, 林, 森; 日, 明; 水, 泉…), mỗi chữ có Hán Việt + nghĩa (trợ năng §12 bản sơ đồ).

**Thưởng:** nghiên mực «Cốc Vũ» (đồ bày).

---

## 9.4 Tháng Tư

### `EV-PHATDAN-01` · Tuần Phật Đản (佛誕)

| Quy tắc | `lunarRange` 8/4 → 15/4 (chính lễ **15/4** — ngày Giáo hội Phật giáo Việt Nam chọn; 8/4 theo truyền thống Bắc tông) | Vùng | Bút Tháp, Yên Tử, Chánh Điện các chi đường Phật giáo | Tông | `GUILD-TH`, `GUILD-TD`, `GUILD-MT` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Kỷ niệm ngày Đức Phật đản sinh.

**Hoạt động:**
- **Tắm Phật** (浴佛): ở sân chùa Bút Tháp có tượng Phật sơ sinh **cố định** trong chậu; người chơi múc nước thơm (gáo) rưới lên — **một lần / người / ngày**, cử chỉ trang nghiêm (không phải mini-game điểm).
- **Kết đèn hoa sen:** gấp đèn hoa sen giấy (mini-game gấp 8 cánh), treo dọc đường Bút Tháp; đèn của mọi người tạo thành đường hoa sen sáng toàn máy chủ.
- **Bố thí chay:** Trai Đường các Liên Xã nấu cơm chay; mang xuống làng (`GUILD-RITE-TD-03` × 2 công).

**Thưởng:** đèn hoa sen cầm tay (`hand`, mùa); vệt bước «Liên Hoa Bộ» (đã có `trail_sen` — trong tuần lễ, ai chưa có được **mượn miễn phí** 7 ngày).

**Tôn trọng:** tượng Phật sơ sinh không là vật phẩm; không có «tắm Phật để được phước» — câu của Ni sư Diệu Âm: «Tắm tượng là nhắc mình tắm lòng. Lòng sạch thì nước nào cũng thơm.»

### `EV-TTP-01` · Vía Trương Tam Phong ⚠

| Quy tắc | âm 9/4 ⚠ (cần cố vấn xác nhận) | Vùng | Võ Đang | Tông | `GUILD-TV` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Trương Tam Phong — nhân vật được Võ Đang tôn là tổ sư (nửa lịch sử nửa truyền thuyết). **Ngày tổ của tông Thanh Vi Đan Đỉnh** trong game.

**Hoạt động:**
- Thái Cực Hội đặc biệt giờ Mão (bình minh) ở Kim Đỉnh Đình các Đan Viện (`GUILD-DT-TV-11`).
- Codex: tách rõ **lịch sử** (những gì có ghi chép) và **truyền thuyết** (Thái Cực quyền do ai sáng tạo — còn tranh luận).

**Thưởng:** áo «Võ Đang Thanh Bào» (một mùa, miễn phí, chỉ cho thành viên `GUILD-TV` dự lễ).

### `EV-LUTO-01` · Vía Lữ Tổ (呂祖)

| Quy tắc | âm 14/4 | Vùng | Võ Đang (Đan Đỉnh), Chung Nam (Toàn Chân tôn Lữ Động Tân là một trong Ngũ Tổ) | Tông | `GUILD-TV`, `GUILD-TC` | iOS | có |
|---|---|---|---|---|---|---|---|

**Ý nghĩa.** Lữ Động Tân (Lã Động Tân) — nhân vật bát tiên, được Toàn Chân và nội đan tôn kính.

**Hoạt động:**
- **«Hoàng lương mộng»** (giấc mộng kê vàng — truyện cổ thuộc phạm vi công cộng): một **cảnh mộng** ngắn chơi một mình — người chơi sống «một đời giàu sang» trong 3 phút rồi tỉnh dậy, nồi kê chưa chín. Bài học: vinh hoa như mộng. Cảnh này nói về **vô thường**, không phán về đời người chơi.
- Hai tông `GUILD-TV` và `GUILD-TC` có thể làm **Đàn Tràng Liên Tông** (Phần 01 §1.13.4) với thưởng × 1,2 trong ngày.

**Thưởng:** kiếm gỗ «Thuần Dương» (`back`, mùa).

```
[CẢNH EV-LUTO-01.MONG · quán trọ bên đường Chung Nam · trưa]
ÔNG GIÀ (NPC): Nồi kê sắp chín. Cậu (cô) chợp mắt đi, tôi gọi.
(màn mộng: 4 «đời» lướt nhanh — đỗ đạt, làm quan, giàu có, già yếu; mỗi đời người chơi chọn một quyết định nhỏ)
(tỉnh dậy)
ÔNG GIÀ: Kê chưa chín đâu.
> ① «Con mơ thấy cả một đời.» ② «Con ngủ có một lúc mà.»
ÔNG GIÀ: (cười) Một đời hay một lúc, cũng là nồi kê này thôi. Ăn đi rồi đi tiếp.
```

---

## 9.5 Checklist nghiệm thu Phần 09

- [ ] `festivals.js`: 7 kiểu quy tắc; test ngày 2027 và 2028 khớp bảng §9.0.8 (sinh bằng `lunar-javascript`).
- [ ] Tháng nhuận không lặp lễ (test Đoan Ngọ 2028 chỉ ở 2028-05-28).
- [ ] `lunarLast` đúng tháng thiếu/đủ (Trừ tịch 2028-01-25 — tháng Chạp năm Đinh Mùi có 29 ngày).
- [ ] Bảng ngoại lệ lịch Việt: test Tết 2007 (VN 2007-02-17) cho kết quả lịch Việt đúng khi bật lịch Việt.
- [ ] Trùng lễ 3/3: ba lễ ở ba vùng chạy song song; thẻ «Hôm nay» hiện ≤ 3 theo `priority`.
- [ ] iOS: `EV-TATAITUE-01` ẩn; `EV-LAPXUAN-01` chỉ còn phần Thiên Mệnh Bàn; không lễ nào có «xin xăm / quẻ đầu năm».
- [ ] Thanh Minh: ghi chú tên người thân chỉ trong `localStorage`, không có trong gói mạng nào.
- [ ] Không vật phẩm lễ nào bán được bằng Ngọc nếu mang hình tượng tôn giáo hoặc hàm ý may mắn (rà danh mục).
- [ ] Mọi lễ ⚠ có cờ `verify: true` và không phát hành khi cờ còn bật.
