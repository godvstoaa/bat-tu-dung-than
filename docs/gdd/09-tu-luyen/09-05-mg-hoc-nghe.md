# 09-05 · Mini-game II — Học và Nghề (MG-07 … MG-12)

> Sáu mini-game biến tri thức «học» của app thành tay nghề trong game: y dược ngũ hành, bố trí nhà, chọn ngày, đặt đạo hiệu, tham công án, viết chữ. Mọi đáp án do **engine thật** tính, không do người viết tay.
> Mỗi MG theo đúng khung 14 mục của `09-03` §13.1. Những gì dùng chung — công thức §2.2, trần ngày §5, điều khiển §13.2, trợ năng §13.3, chống gian §12, đo lường §13.5, trạng thái kết thúc §13.6 — **không nhắc lại**, chỉ ghi phần riêng.
> Số B, NK, `s_min`, bậc mở, nơi chơi, ký hiệu iOS lấy từ bảng chủ `09-03` §6.

**Mục lục**

| Mã | Tên | Nhóm | Nơi chơi | Mở | B | NK | `s_min` | iOS |
|---|---|---|---|---|---|---|---|---|
| [`MG-07`](#mg-07--bốc-thuốc-ngũ-hành) | Bốc Thuốc Ngũ Hành | Học | dược phòng Võ Đang (TV); hiệu thuốc Huyền Thành, nhà A Mậu ở Miêu Cương (trung lập) | 1 | 7 | 6 | 0,5 | ✓ |
| [`MG-08`](#mg-08--bố-trí-dương-trạch) | Bố Trí Dương Trạch | Nghệ | nhà riêng Huyền Thành, Phong Thủy Viên (trung lập) | 1 | 8 | 8 | 0,5 | ✓ |
| [`MG-09`](#mg-09--trạch-nhật-khai-đàn) | Trạch Nhật Khai Đàn | Học | Lịch Đường (trung lập); Long Hổ khi chọn ngày bái Đẩu (CN) | 1 | 6 | 5 | 0,5 | ✓ |
| [`MG-10`](#mg-10--đặt-đạo-hiệu) | Đặt Đạo Hiệu | Học | Thư Lâu Lâm, Văn Miếu (NH) | 2 | 6 | 5 | 0,5 | ✓ |
| [`MG-11`](#mg-11--công-án-vấn-đáp) | Công Án Vấn Đáp | Tĩnh | chùa Hoa Yên, Yên Tử (TH) | 2 | 8 | 4 | — | ✎ |
| [`MG-12`](#mg-12--thư-pháp-lâm-thiếp) | Thư Pháp Lâm Thiếp | Nghệ | Văn Miếu, Thư Lâu (NH); thư phòng Sơn Môn (TC) | 1 | 5 | 5 | 0,4 | ✓ |

**Lá số dùng trong ví dụ:** `MAU-A` (1990-05-15 08:30, nam): Tiềm Lực 41 → `NT = 1,19`; Dụng Thủy, Hỷ Kim. Chi năm **Ngọ** (Canh Ngọ). Mệnh quái tính bằng `zhai › computeZhai(1990, 'nam')`: `digitRoot(1990) = 1` → `(11 − 1) mod 9 = 1` → **Khảm (坎), Đông Tứ Mệnh**; cát: Sinh Khí Đông Nam · Thiên Y Đông · Diên Niên Nam · Phục Vị Bắc; hung: Tuyệt Mệnh Tây Nam · Ngũ Quỷ Đông Bắc · Lục Sát Tây Bắc · Họa Hại Tây (đã chạy engine). Phi tinh năm 2026 (`xuankong › yearFlyingStar(2026)`): trung cung Nhất Bạch; **Ngũ Hoàng ở Chính Nam, Nhị Hắc ở Tây Bắc** (đã chạy engine).

**Mức thông thạo dùng trong bảng độ khó:** theo Tu độ đạo thống (`09-03` §11.2) với MG có đạo thống, hoặc theo số lượt «Đạt» tích lũy với MG trung lập: Sơ (0–9 lượt đạt) · Trung (10–39) · Thâm (40–119) · Viên Thông (≥ 120).

---

## MG-07 · Bốc Thuốc Ngũ Hành

### 1. Mục đích

Dạy mối nối **ngũ hành ↔ tạng phủ ↔ ngũ vị ↔ ngũ sắc** của Hoàng Đế Nội Kinh — phần app đã có trong `tcm.js` — bằng việc giúp dân làng bồi dưỡng **bằng ăn uống**. Trụ cột: T5 (đúng cổ pháp), T6 (không chẩn bệnh, luôn khuyên đi khám). Đây cũng là nơi tiêu dược liệu hái được ở `MG-13`.

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Tạng – phủ – vị – sắc – chí – mùa theo hành | `tcm › WUX_ZANG` (`zang, fu, wei, se, zhi, season`) |
| Lời kể triệu chứng (đã giản lược) | `tcm › WUX_ZANG[hành].xu[]` (hư), `.shi[]` (thực) |
| Món dưỡng | `tcm › WUX_ZANG[hành].nourish`, `tcm › DIET[hành]` (`flavor, color, note`) |
| Mẹ – con (bổ mẹ để dưỡng con) | quan hệ `SHENG` trong `tcm.js` (nội bộ; mở `export` — **chưa có — cần làm**) |
| Chế độ nâng cao: thể chất khách | `tcm › bodyConstitution(R)` (9 thể chất Vương Kỳ) chạy trên lá số NPC |
| Giờ kinh lạc cho lời dặn sinh hoạt | `tcm › MERIDIAN_CLOCK` |

**Bộ lọc nội dung (bắt buộc):** chỉ dùng câu triệu chứng thông thường (mệt, ngủ, ăn, đau đầu, mỏi lưng, ho…). Loại hẳn các vế liên quan sinh dục, kinh nguyệt chi tiết, tâm thần, «cao huyết áp», «đái dắt»… có trong `xu/shi`. Danh sách loại là hằng số `TCM_SAFE_SKIP` trong module chấm (**chưa có — cần làm**). Không tên thuốc tây, không liều lượng, không «phụ tử» (dù có trong `CONSTITUTION_TYPES.yangxu.advice`).

### 3. Luật chơi

Một lượt = một khách, năm bước:

1. **Nghe kể.** Khách (NPC sinh từ `npc.js › makeNpc`) kể 3 câu đời thường lấy từ một vế `xu` hoặc `shi` của một hành, ví dụ vế `肝火旺` thành: «Dạo này tôi hay cáu, mắt đỏ, sáng dậy miệng đắng, đêm khó ngủ.»
2. **Định tạng.** Chọn 1 trong 5 thẻ tạng (Can · Tâm · Tỳ · Phế · Thận, mỗi thẻ in hành + sắc + vị).
3. **Hư hay thực.** Chọn «thiếu cần bồi» (hư) hay «dư cần tiết» (thực).
4. **Chọn món.** Từ 8 thẻ, chọn đúng 3: món / vị thuốc ăn được. Thẻ đến từ túi dược liệu của người chơi (`MG-13`) + thẻ thực phẩm chợ (luôn có). Thẻ thiếu trong túi hiện mờ, vẫn chọn được nhưng phải «mua ở chợ» (tốn 5 Phúc Khí, không ảnh hưởng điểm).
5. **Lời dặn.** Kéo các thẻ lời dặn vào túi giấy thuốc. Thẻ **«Mời khách đi khám thầy thuốc»** phải có trong mọi đáp án đúng. Có thêm 1 thẻ giờ sinh hoạt từ `MERIDIAN_CLOCK` (vd «ngủ trước giờ Tý» cho tạng Can).

**Đáp án hư:** món mang vị và sắc của chính hành đó (`DIET[h]`) + món trong `nourish`. **Đáp án thực:** «tiết chế» — thẻ giảm vị của hành đó theo `DIET[h].note` («chua liễm can, quá nhiều thương can») + món của hành **con** (tả con để bớt mẹ) chỉ ở mức Thâm; ở mức Sơ/Trung, thực chỉ cần thẻ tiết chế + thẻ giờ.

**Chế độ Thâm và Viên Thông:** khách mang lá số; người chơi xem thanh ngũ hành của khách (`R.wx.pct`), suy thể chất (`bodyConstitution`) và chọn món theo cả lời kể lẫn thể chất. Ví dụ thể chất `tanshi` (Đàm Thấp) cộng lời kể «nặng người, buồn ngủ» → món kiện tỳ hóa thấp (ý dĩ, sơn dược, trần bì).

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Nghe lại lời kể | chạm bong bóng thoại | `R` | nhấp bong bóng |
| Chọn tạng / hư-thực | chạm thẻ | `1`–`5` / `1`–`2`, `Enter` | nhấp |
| Chọn món | chạm thẻ để bật / tắt (tối đa 3) | `1`–`8` bật tắt, `Enter` xong | nhấp |
| Bỏ lời dặn vào túi | kéo thẻ vào túi giấy, hoặc chạm thẻ rồi chạm túi | `Q`–`Y` chọn thẻ, `Space` bỏ vào | kéo thả |
| Gói thuốc (nộp) | chạm «Gói thuốc» | `Enter` | nhấp |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Thôi        HIỆU THUỐC HUYỀN THÀNH      NK 64 ▮▮▮▮▮▯  ?  ⏸ │
├──────────────────────────────────────────────────────────────┤
│  [chân dung khách]  «Dạo này tôi hay cáu, mắt đỏ, sáng dậy   │
│   Bác Tư · 58 tuổi    miệng đắng, đêm khó ngủ.»   (▶ nghe lại) │
├──────────────────────────────────────────────────────────────┤
│ ① TẠNG:  [木 Can ▲ xanh·chua] [火 Tâm ◆] [土 Tỳ ■] [金 Phế ●] [水 Thận 〰] │
│ ② [ Thiếu — cần bồi ]   [ Dư — cần tiết ]                    │
├──────────────────────────────────────────────────────────────┤
│ ③ MÓN (chọn 3):  [kỷ tử] [táo đỏ] [rau má] [sen tâm·mờ]       │
│                  [gừng] [đậu đen] [giấm·tiết chế] [ý dĩ]      │
├──────────────────────────────────────────────────────────────┤
│ ④ LỜI DẶN:  [Mời đi khám thầy thuốc] [Ngủ trước giờ Tý]       │
│             [Bớt rượu cay] [Uống nước ấm giờ Mão]   ┌──────┐  │
│                                                     │ túi  │  │
│                                    [ Gói thuốc ]    │ giấy │  │
└─────────────────────────────────────────────────────└──────┘──┘
```

Dải chân trang luôn hiện một dòng nhỏ: «Trò chơi dạy dưỡng sinh theo cổ thư, không thay thầy thuốc.»

### 6. Đường cong độ khó

| Mức | Bậc gợi ý | Lời kể | Số thẻ món | Hư / thực | Lá số khách | Gợi ý miễn phí |
|---|---|---|---|---|---|---|
| Sơ | 1 | 3 câu, đúng một vế `xu` | 8, 2 thẻ nhiễu khác hành rõ rệt | chỉ hư | không | 2 |
| Trung | 1–2 | 3 câu, vế `xu` hoặc `shi` | 8, nhiễu là hành tương khắc | hư hoặc thực | không | 1 |
| Thâm | 3+ | 2 câu + 1 câu «nhiễu» thuộc hành mẹ | 8, nhiễu là hành mẹ / con | cả hai, có «mẹ con» | có, xem thanh ngũ hành | 1 |
| Viên Thông | 4+ | 2 câu; khách hai tạng cùng hư (mẹ – con) | 10, chọn 4 | cả hai | có + `bodyConstitution` | 0 |

Ở Võ Đang (TV), thẻ «Hỏi Đan Đỉnh chân nhân» thay gợi ý: Cát Huyền nói câu dẫn chứ không lộ đáp án.

### 7. Chấm điểm

```
s = 0,30·Tạng + 0,20·HưThực + 0,30·Món + 0,20·LờiDặn
Tạng     = 1 nếu đúng; 0,4 nếu chọn tạng mẹ hoặc con của đáp án; 0 còn lại
HưThực   = 1 / 0
Món      = |chọn ∩ đúng| / |chọn ∪ đúng|            (Jaccard, như halls.js › gradeStep 'many')
LờiDặn   = 0,5·[có thẻ khám] + 0,5·[thẻ giờ đúng tạng] − 0,25·[mỗi thẻ sai], kẹp 0..1
Nếu KHÔNG có thẻ «Mời đi khám thầy thuốc»:  s = min(s, 0,49)   → luôn dưới s_min 0,5
Gợi ý:  trừ 0,05 / lần ở mức Trung trở lên (Sơ miễn)
```

**Ví dụ.** `MAU-A` ở dược phòng Võ Đang (TV hành Thủy = Dụng → `K_dụng = 1,10`), NK 55 (`K_sung = 1`). Khách kể vế `肾阴虚` («mỏi lưng gối, tai ù, nóng trong về chiều»). Người chơi chọn đúng Thận, đúng «thiếu», chọn món {đậu đen, vừng đen, gừng} trong khi đáp án {đậu đen, vừng đen, kỷ tử} → Jaccard 2/4 = 0,5; có thẻ khám + thẻ giờ Dậu đúng → LờiDặn 1.
`s = 0,30 + 0,20 + 0,15 + 0,20 = 0,85` → `f = 0,3 + 0,7·0,85 = 0,895` → `thô = 7 × 0,895 = 6,27` → `ĐH = 6,27 × 1,19 × 1,10 × 1 = 8,2` → Phúc Khí `round(3,13) = 3`.

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi lượt | thô theo công thức (`B = 7`), Phúc Khí `round(thô × 0,5)` |
| Lượt đầu mỗi ngày đạt | khách tặng 1 «Phiếu tạ» (đổi ở chợ lấy hạt giống cho vườn thuốc nhà riêng — tài liệu 08) |
| 30 lượt «Viên mãn» | danh hiệu «Lương Y Trong Làng» (thuần thẩm mỹ) |
| Ở nhà A Mậu (Miêu Cương) | sau lượt, A Mậu kể một chuyện xưa về cây thuốc (chuỗi 12 chuyện, thoại do tài liệu 06 viết) |

Không có công (`CONG_QUA`) cho MG này: giúp ăn uống là «khuyên», không phải «cứu người nguy cấp». Cứu người là `MG-24`.

### 9. Trạng thái thất bại

| Trường hợp | Kết quả | Lời |
|---|---|---|
| Thiếu thẻ khám | `s ≤ 0,49`, chưa đạt | xem cảnh dưới |
| Chọn tạng khắc (vd Thận khi khách nói Can hỏa) | Tạng 0 | lời giảng từ `WUX_ZANG` của tạng đúng |
| Hết giờ (chỉ khi bật đồng hồ ở Viên Thông) | nộp phần đã chọn | — |

```
[CẢNH MG-07.F1 · Hiệu thuốc Huyền Thành · giờ Mùi]
BÀ HAI (chủ hiệu): (gấp giấy lại, chưa đưa) Gói này ngon miệng đấy. Nhưng con quên dặn khách cái quan trọng nhất.
BÀ HAI: Mắt đỏ, đêm không ngủ — người ta cần thầy thuốc xem tận nơi. Mình bày cách ăn, thầy thuốc mới xem bệnh.
> Lựa chọn: ① «Con bỏ thêm thẻ đi khám.» → (sửa, chấm lại, trừ 0,05)  ② «Con hiểu rồi, để khách sau.» → [kết thúc lượt]
```

```
[CẢNH MG-07.F2 · Dược phòng Võ Đang · giờ Thìn]
CÁT HUYỀN: Con bốc toàn vị cay ấm cho người đang nóng trong. Lửa thêm củi. (cười) Không sao. Hỏa với Thủy, con thử nhìn lại xem ai đang thiếu.
```

### 10. Trợ năng

- Thẻ tạng in đủ chữ Hán, tên Việt, sắc, vị, ký hiệu hình (`09-03` §13.3).
- Lời kể có phụ đề và đọc to (TTS) tùy chọn.
- Chế độ «Thẻ tra cứu»: mở bảng `WUX_ZANG` rút gọn bên cạnh, **không trừ điểm** ở mọi mức (học là mục đích); chỉ mất huy hiệu «Không trợ lực».
- Kéo thả có đường thay thế bằng chạm – chạm và bàn phím.

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Thuộc lòng đáp án theo câu kể | 3 câu kể chọn ngẫu nhiên từ ≥ 4 cách diễn đạt mỗi vế, xáo thứ tự; seed máy chủ |
| Dò bằng gợi ý | gợi ý giới hạn theo mức; lượt sau cùng khách → không thưởng (`K_lặp` tính theo khách chứ không chỉ theo MG) |
| Gian lận túi dược | số lượng dược liệu do máy chủ giữ; client không tự thêm |

### 12. Đo lường riêng

| Sự kiện | Trường |
|---|---|
| `mg07_answer` | `organ_key, organ_pick, xushi_ok, jaccard, has_doctor_card(bool), meridian_ok` |
| `mg07_market_buy` | `herb_id, cost_phuc` |
| `mg07_lookup_open` | `mode` (bảng tra) |

Chỉ số theo dõi: tỉ lệ quên thẻ khám (mục tiêu < 10% sau 20 lượt — nếu cao, tăng nhắc ở mức Sơ).

### 13. iOS

Giữ nguyên (✓). Không có yếu tố bói. Chuỗi lời đổi «Huyền Quán» → «Học Quán» theo `features.js › TEXT`.

### 14. Nghiệm thu

- [ ] Module chấm thuần `mg07Grade(case, answer)` chạy được bằng node; test ≥ 30 ca gồm ca thiếu thẻ khám luôn `s < 0,5`.
- [ ] Mọi câu kể đi qua `TCM_SAFE_SKIP`; test quét không còn từ cấm.
- [ ] Đáp án món lấy từ `WUX_ZANG[].nourish` / `DIET`, không có món bịa ngoài bảng (test so khớp từ khóa).
- [ ] Chân trang «không thay thầy thuốc» hiện ở mọi màn hình MG.
- [ ] Chế độ Thâm gọi `bodyConstitution` trên lá số NPC thật; ca `R.wx.pct` thiếu → MG lùi về mức Trung, không lỗi.
- [ ] `K_dụng` chỉ áp ở dược phòng Võ Đang.

---

## MG-08 · Bố Trí Dương Trạch

### 1. Mục đích

Dạy **Bát Trạch** (mệnh quái → 4 cát 4 hung) và **phi tinh năm** bằng việc kê đồ trong nhà; tập con mắt nhận **sát** và hóa giải theo đạo «sửa bố cục trước, mua vật phẩm sau». Đây là lớp **Cải Vận** nông nhất (canon §5: «hướng nhà… thưởng ngắn hạn»). Trụ cột T1 (mệnh quái của chính chủ nhà), T5, T6 (không bán vật phẩm «đổi vận»).

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Mệnh quái, 4 cát, 4 hung | `zhai › computeZhai(birthYear, gender)`, `zhai › AUSPICIOUS`, `GUA` |
| Sao Bát Trạch của một cung | `dz-case.js › starOf`, `isCat` |
| Điểm chỗ kê giường | `dz-case.js › bedScore(R, palace, year)` (gọi `fengshui-compass › compassReading`) |
| Phi tinh năm (Ngũ Hoàng, Nhị Hắc) | `xuankong › yearFlyingStar(year)`, `STAR` |
| Sát và cách hóa | `fs-cure › SHA_LIST` (id: `luchong`, `jianjiao`, `tianzhan`, `bigiao`, `fangong`, `hengliang`, `jingzi`, `kaimenjianding`, `kaimenjiandao`, `kaimenjianjing`, `chishen`, `dengzhu`, `guashu`, `caise`), `findCure` |
| Bếp «tọa hung hướng cát» | `computeZhai().advice[2]` |
| Mô-đun nội thất 3D | tài liệu 08 (`MOD-*`), nhà riêng `INT-*` |

### 3. Luật chơi

Mặt bằng nhìn từ trên, chia **cửu cung** Lạc Thư (8 cung + trung cung). Hai chế độ:

- **Khách:** NPC nhờ xem nhà mới (giống án `dz-case.js` nhưng làm bằng tay trên mặt bằng). Cửa chính cố định; người chơi kê đồ.
- **Nhà riêng:** mặt bằng nhà của người chơi ở Huyền Thành, chủ nhà là hồ sơ «Bản thân» trong Sổ Mệnh. Kê đồ ở đây **lưu lại** vào nhà thật (tài liệu 08). Mỗi ngày một «phòng» được chấm.

Các bước trong một lượt:

1. **Mệnh quái chủ nhà** — chọn 1 trong 8 quẻ (bỏ qua nếu đã đúng 3 lần với cùng chủ nhà).
2. **Giường** — kéo giường vào một cung; ưu tiên Thiên Y / Phục Vị.
3. **Bàn học / làm việc** — đặt và xoay hướng ngồi về Sinh Khí hoặc Thiên Y.
4. **Bếp** — đặt ở cung hung, xoay miệng bếp về cung cát.
5. **Năm nay** — gắn cờ cung Ngũ Hoàng và Nhị Hắc; không đặt giường, bếp, cửa phụ mới vào hai cung đó.
6. **Tìm sát** — mỗi mặt bằng có 1–3 sát cài sẵn (xà ngang trên giường `hengliang`, gương đối giường `jingzi`, mở cửa thấy bếp `kaimenjiandao`, mở cửa thấy vệ sinh `kaimenjianjing`, cửa xuyên cửa `chishen`, ngoài cửa: đường đâm thẳng `luchong`, góc nhọn `jianjiao`). Người chơi chạm vào chỗ có sát, rồi chọn cách hóa.

**Thang cách hóa (đạo đức của MG):**

| Loại cách hóa | Ví dụ | Điểm cách hóa |
|---|---|---|
| Dời bố cục | dời giường khỏi dưới xà, xoay gương, dời bếp | 1,0 |
| Che chắn bằng kết cấu rẻ | bình phong, rèm, kệ sách, cây xanh | 0,8 |
| Vật phẩm | gương Bát Quái, thạch anh, chuông đồng | 0,5 |
| Không hóa / hóa sai loại | — | 0 |

Vật phẩm trong MG chỉ là **đạo cụ học**, không bán ở Tàng Y Các, không có hiệu ứng ngoài MG (E1, T6).

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn đồ vật | chạm biểu tượng ở khay đồ | `1`–`6` | nhấp |
| Di chuyển | kéo một ngón | `←→↑↓` theo ô | kéo thả |
| Xoay | nút ⟲ ⟳ cạnh vật | `Q` / `E` (45°) | bánh xe |
| Đặt | nhấc tay | `Enter` | thả |
| Bật la bàn chồng lên mặt bằng | nút «La bàn» | `C` | nút |
| Đánh dấu sát | chạm giữ 0,5 giây vào chỗ nghi | `X` khi con trỏ ở ô | nhấp phải |
| Chọn cách hóa | chạm thẻ | `1`–`4` | nhấp |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Thôi   NHÀ ÔNG BA THÀNH · Khảm (Đông Tứ)    NK 70   ?  ⏸   │
├───────────────────────────────────────┬──────────────────────┤
│        Tây Bắc │    Bắc    │ Đông Bắc   │ KHAY ĐỒ              │
│        Lục Sát │ Phục Vị   │ Ngũ Quỷ    │ [giường] [bàn]       │
│        ⚠ 2 Nhị Hắc │       │            │ [bếp] [bàn thờ]      │
│   ─────────────┼───────────┼──────────  │ [bình phong] [rèm]   │
│        Tây     │ trung cung│ Đông       │                      │
│        Họa Hại │  1 Nhất Bạch│ Thiên Y   │ BƯỚC: ③ bàn làm việc │
│   ─────────────┼───────────┼──────────  │ ▸ ngồi nhìn hướng?   │
│        Tây Nam │   Nam     │ Đông Nam   │                      │
│        Tuyệt M.│ Diên Niên │ Sinh Khí   │ [La bàn] [Hỏi thầy]  │
│                │ ⚠ 5 Ngũ Hoàng│         │                      │
│                ▲ cửa chính (Nam)        │      [ Xong bước ]   │
└───────────────────────────────────────┴──────────────────────┘
```

Lớp sao Bát Trạch và lớp phi tinh năm là hai lớp phủ bật tắt riêng; ở mức Sơ cả hai bật sẵn, ở Thâm phải tự bật (bật không trừ điểm, chỉ hiện chậm 2 giây để khuyến khích nhớ).

### 6. Đường cong độ khó

| Mức | Bậc gợi ý | Bước có mặt | Số sát | Lớp phủ | Ghi chú |
|---|---|---|---|---|---|
| Sơ | 1 | 1, 2, 5 | 1 (rõ: xà ngang) | bật sẵn | không có bếp |
| Trung | 1–2 | 1–5 | 1–2 | Bát Trạch bật sẵn, phi tinh tự bật | |
| Thâm | 3+ | 1–6 | 2 | tự bật | xuất hiện trường hợp **cát Bát Trạch trùng Ngũ Hoàng** |
| Viên Thông | 4+ | 1–6 + mặt bằng 2 tầng | 3, có sát ngoài cửa | tự bật | khách hai người khác nhóm Đông/Tây Tứ → phải chọn cho người ở phòng đó |

### 7. Chấm điểm

```
s = 0,25·Giường + 0,15·Bàn + 0,15·Bếp + 0,15·Năm + 0,30·Sát   (+ 0,10·MệnhQuái khi bước 1 có mặt, rồi chuẩn hóa tổng trọng số về 1)
Giường   = như dz-case.js › gradeDz('giuong'): 1 nếu cung có bedScore cao nhất; 0,8·(b − min)/(max − min) còn lại
Bàn      = 0,6·[cung cát] + 0,4·[hướng ngồi = Sinh Khí hoặc Thiên Y]
Bếp      = 0,5·[đặt ở cung hung] + 0,5·[miệng bếp quay về cung cát]
Năm      = 1 nếu không vật nặng / bếp / giường nào ở cung Ngũ Hoàng và Nhị Hắc; −0,5 mỗi vi phạm, kẹp 0..1
Sát      = trung bình ( [tìm thấy] × điểm cách hóa ) trên các sát cài; đánh dấu nhầm chỗ không sát: −0,1 mỗi lần
MệnhQuái = như gradeDz('menh'): 1 đúng · 0,3 đúng nhóm sai quẻ · 0
```

Các bước không có mặt ở mức hiện tại bị bỏ khỏi tổng và trọng số chia lại.

**Ví dụ — `MAU-A` sửa nhà riêng năm 2026, mức Thâm.** Khảm: cát Đông Nam / Đông / Nam / Bắc. Năm 2026 Ngũ Hoàng đóng **Chính Nam** — đúng cung Diên Niên của `MAU-A`. Người chơi kê giường ở Nam (cát Bát Trạch) → bước Năm vi phạm 1 → Năm 0,5; `bedScore` của Nam bị lớp «phi tinh năm» kéo xuống nên Giường chỉ đạt 0,6 (giả định cung Đông cao nhất, số cụ thể do `bedScore` tính lúc chạy). Bàn ở Đông Nam ngồi nhìn Đông Nam → 1. Bếp ở Tây Nam (Tuyệt Mệnh) miệng quay Đông → 1. Hai sát: xà ngang (dời giường → 1,0) và gương đối giường (treo rèm → 0,8) → Sát 0,9. Bước mệnh quái đã bỏ qua.
`s = 0,25·0,6 + 0,15·1 + 0,15·1 + 0,15·0,5 + 0,30·0,9 = 0,15 + 0,15 + 0,15 + 0,075 + 0,27 = 0,795`
`f = 0,3 + 0,7·0,795 = 0,857` → `thô = 8 × 0,857 = 6,85`. Nhà riêng là nơi trung lập → `K_dụng = 1`. NK 72 → `K_sung = 1,10`.
`ĐH = 6,85 × 1,19 × 1 × 1,10 = 8,97`; Phúc Khí 3. Lời giảng cuối lượt nêu rõ: «Nam là Diên Niên của con, nhưng năm Bính Ngọ này Ngũ Hoàng bay tới. Năm nay để yên phương Nam.»

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi lượt | thô (`B = 8`), Phúc Khí |
| Nhà riêng đạt `s ≥ 0,8` | trạng thái «Trạch Khí an hòa» 7 ngày: +5% Phúc Khí (chỉ Phúc Khí — E1; tài liệu 05 chốt con số lớp Cải Vận) |
| Mỗi đầu năm can chi (Lập Xuân) | nhắc «Phi tinh đã đổi chỗ» + một lượt nhà riêng miễn `K_lặp` |
| Hóa đủ 14 loại sát khác nhau trong `SHA_LIST` | danh hiệu «Thợ Sửa Khí» |

### 9. Trạng thái thất bại

| Trường hợp | Xử lý |
|---|---|
| Đặt đồ chồng lên cửa / chặn lối đi | không cho thả, viền đỏ, câu «Lối đi phải thông» |
| Chỉ mua vật phẩm cho mọi sát | vẫn đạt nếu `s ≥ 0,5`, nhưng NPC nói câu nhắc đạo |
| `s < 0,5` | chưa đạt; mặt bằng giữ nguyên để làm lại (lượt mới, `K_lặp` tính) |

```
[CẢNH MG-08.F1 · Phong Thủy Viên · chiều]
THẦY ĐỊA LÝ (Phong Thủy Viên): Ba cái sát, con treo ba cái gương. Nhà người ta thành tiệm gương mất rồi.
THẦY ĐỊA LÝ: Cái giường dời đi hai bước là hết xà đè. Không tốn đồng nào. Cái gì dời được thì dời, cái gì không dời được mới che, che không được mới đến lượt đồ vật.
> Lựa chọn: ① «Con dời lại.» → (bắt đầu lại bước Sát)  ② «Dạ, lần sau con nhớ.» → [kết thúc lượt]
```

### 10. Trợ năng

- Mỗi cung ngoài màu còn in **tên cung + tên sao** bằng chữ; cung bị phi tinh hung có hoa văn sọc chéo, không chỉ đỏ.
- Chế độ lưới: mọi thao tác kéo có thể thay bằng chọn ô bằng bàn phím.
- Đọc màn hình: «Giường đang ở cung Đông, sao Thiên Y, cát. Năm nay cung Đông không có Ngũ Hoàng.»
- La bàn chồng lớp có thể khóa hướng Bắc lên trên để không phải xoay đầu.

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Thử đặt mọi cung để dò điểm | điểm chỉ tính lúc «Xong bước»; mỗi bước tối đa 3 lần «Xong» (lần 2, 3 nhân 0,8 / 0,6) |
| Sửa nhà riêng lặp vô hạn | nhà riêng chỉ chấm 1 phòng / ngày; sửa thêm không thô |
| Gửi bố cục giả | máy chủ dựng lại mặt bằng từ seed + nhật ký kéo thả, chạy lại chấm |

### 12. Đo lường riêng

| Sự kiện | Trường |
|---|---|
| `mg08_place` | `item, palace, star, year_star, rotation` |
| `mg08_sha` | `sha_id, found(bool), cure_tier (move / cover / object / none)` |
| `mg08_overlay` | `layer (bazhai / feixing), on(bool)` |

Chỉ số: tỉ lệ `cure_tier = object` (mục tiêu < 30% ở mức Thâm — nếu cao, tăng lời dẫn của thầy).

### 13. iOS

Giữ nguyên (✓). App iOS vẫn có La Bàn Đài và sảnh Dương Trạch (`features.js` không tắt `compass`, `duongtrach`). Bố trí nhà là thiết kế không gian, không phải đoán vận.

### 14. Nghiệm thu

- [ ] Mệnh quái mọi chủ nhà gọi `computeZhai`; test `MAU-A` → Khảm, cát Đông Nam / Đông / Nam / Bắc.
- [ ] Cung Ngũ Hoàng / Nhị Hắc lấy từ `yearFlyingStar(năm hiện tại)`; test 2026 → Chính Nam / Tây Bắc.
- [ ] Điểm giường dùng `bedScore`, cùng kết quả với án `dz-case.js` cho cùng NPC.
- [ ] Mỗi sát cài có ít nhất một cách hóa loại «dời bố cục» hoặc «che chắn» hợp lý trong `SHA_LIST.cures`; sát ngoài cửa (`luchong`, `jianjiao`) cho phép «che chắn» làm mức cao nhất.
- [ ] Không vật phẩm hóa sát nào xuất hiện trong Tàng Y Các.
- [ ] Bố cục nhà riêng lưu bền, đồng bộ với tài liệu 08.

---

## MG-09 · Trạch Nhật Khai Đàn

### 1. Mục đích

Dạy **12 trực (建除十二神)**, Hoàng đạo / Hắc đạo và **tránh ngày xung – hại – hình tuổi** bằng việc chọn ngày cho các **lễ thật trong game**: ngày mở đạo tràng của môn phái, lễ nhập môn của đệ tử, chuyến hành hương. Ngày người chơi chọn **được dùng thật** (lễ diễn ra hôm ấy trên máy chủ). Trụ cột T1, T5; nối vòng chơi xã hội (tài liệu 10).

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Đánh giá một ngày cho một việc + tuổi | `zheri › evaluateDate(y, m, d, activityId, userZhi)` (đã có xung `CHONG`, hại `HAI`, hình `XING`, lục hợp `LIUHE`, tam hợp `SANHE`) |
| Việc và trực nên / kỵ | `zheri › ACTIVITY` (`marry`, `business`, `move`, `build`, `travel`, `sign`) |
| Tìm ngày tốt nhất | `zheri › findGoodDates` |
| Bước án và cách chấm | `zheri-case.js › buildZheriCase, gradeZheri, zheriTotal, officerTable, CHONG` |
| Chi năm sinh theo Lập Xuân | `zheri-case.js › birthZhi` |
| Âm lịch, can chi ngày | thư viện `lunar-javascript` (`Solar`, `getLunar`) |
| Việc «tế tự / cầu phúc» (bái Đẩu) | **chưa có — cần làm**: thêm `ACTIVITY.pray` (祭祀 / 祈福) theo Thông Thắng; tới lúc đó lễ bái Đẩu tạm dùng `sign` |

**Bảng việc trong game → `ACTIVITY`:**

| Lễ trong game | `activityId` | Chủ lễ (tuổi dùng để lọc) |
|---|---|---|
| Khánh thành / mở đạo tràng môn phái | `business` (mở cửa) | chưởng môn |
| Động thổ công trình đạo tràng (tài liệu 10 / 08) | `build` | chưởng môn |
| Lễ nhập môn đệ tử, kết nghĩa kim lan | `sign` | người nhập môn / hai người kết nghĩa (lọc cả hai tuổi) |
| Chuyến hành hương nhóm | `travel` | trưởng đoàn |
| Dọn về nhà riêng mới | `move` | chủ nhà |
| Hôn lễ trong game | `marry` | cả hai người |
| Bái Đẩu tập thể (Long Hổ) | `pray` (chưa có) → tạm `sign` | chủ đàn |

### 3. Luật chơi

Cửa sổ **30 ngày âm dương thật** bắt đầu sau 3 ngày (chuẩn bị). Từ 30 ngày, MG trình **7 ngày ứng viên** theo cách của `buildZheriCase` (ngày tốt nhất + ≥ 1 ngày xung tuổi + ngày khác ngẫu nhiên, mở rộng từ 5 lên 7). Các bước:

1. **Đọc việc** — chọn `activityId` đúng cho lễ (bảng trên).
2. **Lọc xung** — đánh dấu mọi ngày có chi xung chi tuổi chủ lễ (bước `xung` của `gradeZheri`).
3. **Lọc hại – hình** (từ mức Trung) — đánh dấu ngày hại / hình tuổi.
4. **Nhận trực Hoàng đạo** — dùng bảng `officerTable(chi tháng)`, đánh dấu ngày trực cát (bước `truc`).
5. **Chọn ngày** — chọn 1 ngày (bước `pick`). Ngày này đẩy vào lịch sự kiện của môn phái nếu người chơi có quyền.

Lễ hai người (kết nghĩa, hôn lễ): bước 2–3 phải lọc theo **cả hai** tuổi.

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn việc | chạm thẻ | `1`–`6` | nhấp |
| Đánh dấu / bỏ dấu ngày | chạm ô ngày | `←→` di chuyển, `Space` đánh dấu | nhấp |
| Mở bảng 12 trực | nút «Bảng trực» | `T` | nút |
| Xem can chi, âm lịch một ngày | chạm giữ ô | `I` | rê chuột |
| Xong bước | nút | `Enter` | nút |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Thôi   LỊCH ĐƯỜNG · Chọn ngày khánh thành đạo tràng   ?  ⏸ │
│ Chủ lễ: chưởng môn Vân Sơn · tuổi Ngọ (午) · việc: [mở cửa ▾] │
├──────────────────────────────────────────────────────────────┤
│  T4 11/11   T6 13/11   CN 15/11   T3 17/11   T5 19/11 …       │
│  22/9 âm    24/9 âm    26/9 âm    28/9 âm    1/10 âm           │
│  甲子 Tý    丙寅 Dần   戊辰 Thìn  庚午 Ngọ   壬申 Thân          │
│  [ ✗ xung ] [      ] [      ]   [ hình ]   [ ✓ Hoàng ]        │
├──────────────────────────────────────────────────────────────┤
│ Bước ② Lọc ngày xung tuổi Ngọ — đánh dấu mọi ngày phải loại  │
│ [Bảng trực]  [Hỏi thầy]                         [ Xong bước ] │
└──────────────────────────────────────────────────────────────┘
```

(Ngày và can chi trong khung là minh họa bố cục; số thật lấy từ `lunar-javascript` lúc chạy.)

### 6. Đường cong độ khó

| Mức | Bậc gợi ý | Bước | Ứng viên | Bảng trực | Chủ lễ |
|---|---|---|---|---|---|
| Sơ | 1 | 1, 2, 4, 5 | 5 | in sẵn chi ngày cạnh trực | 1 người |
| Trung | 1–2 | 1–5 | 7 | phải mở bảng | 1 người |
| Thâm | 3+ | 1–5 | 7 | không in tên trực trên ô | 2 người (kết nghĩa) |
| Viên Thông | 4+ | 1–5 + chọn **giờ** tốt trong ngày (`best-hour.js`, có sẵn trong engine) | 9 | không | 2 người + ngày rơi vào tháng nhuận / đổi tiết |

### 7. Chấm điểm

```
s = 0,10·Việc + 0,25·Xung + 0,15·HạiHình + 0,20·Trực + 0,30·Chọn
Việc     = 1 nếu đúng activityId; 0,5 nếu cùng nhóm (move↔build; business↔sign); 0
Xung     = gradeZheri(cs,'xung') (Jaccard; tập rỗng đúng = 1)
HạiHình  = Jaccard trên tập ngày evaluateDate báo hại hoặc hình tuổi (bước vắng ở mức Sơ → bỏ, chia lại trọng số)
Trực     = gradeZheri(cs,'truc')
Chọn     = gradeZheri(cs,'pick'): 1 ngày cao nhất; 0,8·(d − min)/(max − min); chọn ngày xung tuổi → 0 bất kể điểm
```

**Ví dụ.** `MAU-A` (tuổi Ngọ) làm chủ lễ kết nghĩa với một bạn tuổi Mão, mức Thâm, ở Lịch Đường (trung lập, `K_dụng = 1`), NK 40 (`K_sung = 1`). Tuổi Ngọ xung Tý, hại Sửu, tự hình Ngọ; tuổi Mão xung Dậu, hại Thìn, hình Tý. Người chơi lọc đúng hết ngày xung (Xung 1), bỏ sót một ngày hình (HạiHình 2/3 = 0,67), trực đúng 3/4 (Jaccard 0,75), chọn ngày điểm nhì (`0,8·(9 − 3)/(11 − 3) = 0,6`), việc đúng `sign`.
`s = 0,10 + 0,25 + 0,10 + 0,15 + 0,18 = 0,78` → `f = 0,846` → `thô = 6 × 0,846 = 5,08` → `ĐH = 5,08 × 1,19 = 6,04`; Phúc Khí 3.

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi lượt | thô (`B = 6`), Phúc Khí |
| Ngày chọn được dùng cho lễ thật của môn phái | người chọn được ghi tên «Trạch nhật» trên bảng lễ; khi lễ diễn ra nhận thêm 2 thô ngoài trần (một lần / lễ) |
| Chọn ngày bái Đẩu ở Long Hổ | lượt mang đạo `CN` (hành Hỏa) → `K_dụng` theo lá số |
| 100 ngày đã chấm | danh hiệu «Người Giữ Lịch» |

### 9. Trạng thái thất bại

| Trường hợp | Xử lý |
|---|---|
| Chọn ngày xung tuổi chủ lễ | Chọn = 0; nếu là lễ thật, máy chủ **không nhận** ngày đó, yêu cầu chọn lại (không phạt thêm) |
| `s < 0,5` | chưa đạt; lễ thật vẫn chờ một lượt đạt trước hạn chót |
| Hết 30 ngày cửa sổ mà môn phái chưa chốt | máy chủ dùng `findGoodDates` chọn ngày tốt nhất, ghi «chọn tự động» |

```
[CẢNH MG-09.F1 · Lịch Đường · sáng, giờ Tỵ]
ÔNG ĐỒ LỊCH ĐƯỜNG: (gõ nhẹ vào ô ngày Tý) Chưởng môn tuổi Ngọ, con chọn ngày Tý. Tý Ngọ đối xung, như hai người ngồi hai đầu bập bênh.
ÔNG ĐỒ LỊCH ĐƯỜNG: Ngày ấy có tốt cho người khác, cũng không tốt cho người đứng ra làm lễ. Lọc người trước, rồi mới xem ngày.
```

### 10. Trợ năng

- Ô ngày có ba lớp thông tin bằng chữ (dương, âm, can chi); dấu «xung», «hại», «hình», «Hoàng đạo» là chữ + ký hiệu (✗ △ ◇ ✓), không chỉ màu.
- Bảng 12 trực mở dạng danh sách đọc được bằng trình đọc màn hình: «Tháng Tuất: Kiến ngày Tuất, Trừ ngày Hợi…».
- Không có đồng hồ ở mọi mức.

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Tra app chính để lấy đáp án | chấp nhận — đây là học, không phải thi; điểm thô thấp (`B = 6`) và trần ngày giữ cân bằng |
| Nhiều thành viên cùng chọn ngày lễ để dồn thưởng | thưởng «lễ thật» chỉ cho người có ngày được chưởng môn chốt |
| Sửa ngày ứng viên ở client | ứng viên sinh từ seed `môn phái:lễ:ngày tạo`, máy chủ dựng lại |

### 12. Đo lường riêng

| Sự kiện | Trường |
|---|---|
| `mg09_step` | `step (viec/xung/haihinh/truc/pick), jaccard, picked_clash(bool)` |
| `mg09_event_bind` | `event_kind, activity_id, auto_picked(bool)` |
| `mg09_table_open` | `month_zhi` |

### 13. iOS

Giữ nguyên (✓). Ngày chọn cho lễ của NPC và môn phái trong game, không xem vận hạn của bản thân người chơi. Lọc theo tuổi của **nhân vật chủ lễ trong game**, lấy từ hồ sơ đã khai — giống sảnh Trạch Nhật đang chạy trên iOS.

### 14. Nghiệm thu

- [ ] Mọi ứng viên đi qua `evaluateDate`; test ngày Tý với tuổi Ngọ luôn `clashYou = true`.
- [ ] Bước Xung / Trực / Chọn trả **đúng** kết quả `gradeZheri` cho cùng dữ liệu (test so sánh).
- [ ] Lễ hai người lọc cả hai tuổi; test kết nghĩa Ngọ – Mão loại cả ngày Tý và ngày Dậu.
- [ ] Ngày được chốt ghi vào lịch sự kiện môn phái qua API tài liệu 10; ngày xung tuổi chủ lễ bị máy chủ từ chối.
- [ ] Tháng nhuận hiện đúng «nhuận» như `buildZheriCase` đang làm.
- [ ] Ticket `ACTIVITY.pray` ghi vào backlog engine.

---

## MG-10 · Đặt Đạo Hiệu

### 1. Mục đích

Khi nhập đạo, người ta nhận một **đạo hiệu (道號)**. MG này dạy **Ngũ Cách tính nét (五格)** và quan hệ ngũ hành của **Tam Tài (三才)** bằng hai việc: một **lễ đặt đạo hiệu cho chính mình** (một lần, đổi được mỗi mùa) và việc thường ngày **đặt đạo hiệu cho người mới nhập môn** (NPC). Trụ cột T1 (hợp Dụng thần của người mang tên), T5, T6 (không hứa «tên đổi vận»).

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Bảng 81 số và cát / hung | `naming › STROKES_81` (vd 5 Cát · 7 Cát · 9 Hung · 11 Cát · 12 Hung · 14 Hung · 17 Cát · 21 Cát · 24 Cát) |
| Ngũ Cách cho họ + tên | `naming › fiveGrid(name)` (天 = họ + 1; 人 = họ + chữ đầu tên; 地 = tổng tên + 1; 外; 總) |
| Số nét Khang Hy | `naming.js › VN_SURNAME` (21 họ), `GIVEN_CHAR` (≈ 39 chữ, khóa Quốc ngữ → chữ Hán + số nét) — **nội bộ, chưa `export`** |
| Thần số học chữ cái (tham khảo, không chấm) | `naming › letterName` (`expression, soulUrge, personality`) |
| Hành của từng **chữ** (theo bộ thủ / nghĩa) | **chưa có — cần làm** (naming.js không có dữ liệu hành chữ) |
| Hành của một **cách số** | quy tắc Tam Tài theo chữ số cuối: 1–2 Mộc · 3–4 Hỏa · 5–6 Thổ · 7–8 Kim · 9–0 Thủy (**chưa có trong code — cần làm**, hàm thuần vài dòng) |
| Ngũ Cách cho tên **2 chữ không họ** (đạo hiệu) | **chưa có — cần làm**: `fiveGridPair(s1, s2)` — chữ lót đứng vị trí «họ»: 天 = s1 + 1, 人 = s1 + s2, 地 = s2 + 1, 總 = s1 + s2, 外 = 2 cố định |

**Lưu ý dữ liệu:** `GIVEN_CHAR` ghi một số chữ theo nét giản lược thay vì Khang Hy (vd 海 ghi 10, Khang Hy 11; 河 ghi 8, Khang Hy 9). Trước khi MG ra mắt cần rà bảng nét (ticket engine). Ví dụ dưới đây dùng **số đang có trong code**.

### 3. Luật chơi

**Đạo hiệu = chữ lót môn phái + một chữ chọn.** Chữ lót (tự bối hư cấu của game) do đạo thống cố định, mỗi «đời» đệ tử một chữ. Game **không chép dãy tự bối thật** của các phái (vd bài phái thi Long Môn); trùng lẻ một chữ là chấp nhận được. Bảng khởi đầu, chỉ dùng chữ đã có trong `GIVEN_CHAR`:

| Đạo thống | Chữ lót đời đầu (nét) | Ghi chú |
|---|---|---|
| CN | Quang 光 (6) | |
| TV | Nhất 一 (1) | |
| TC | Thành 成 (6) | |
| TT | Sơn 山 (3) | |
| BD | Hải 海 (10) | |
| TH | Tâm 心 (4) | danh xưng Phật gia gọi là **pháp danh** |
| TD | Thiện 善 (12) | pháp danh |
| MT | Bảo 寶 (20) | pháp danh |
| NH | Trí 智 (12) | Nho gia gọi là **tự / hiệu** |

Bảng chữ mở rộng (≥ 300 chữ có nét Khang Hy và hành theo bộ thủ) là **chưa có — cần làm**.

**Chế độ «Khách nhập môn» (hằng ngày):** NPC nói nguyện vọng (vd «mong hiền hòa», «mong vững chí») + cho lá số (Dụng thần). Người chơi chọn 1 chữ từ 8 chữ gợi ý cho vị trí thứ hai.

**Chế độ «Lễ đạo hiệu» (của mình):** mở ngay sau độ kiếp bậc 2 (`ACT-K2-*`, xem `09-02`); chọn từ toàn bảng chữ; sư phụ của đạo thống chính đọc đạo hiệu trong nghi lễ. Đổi được **một lần mỗi mùa** (năm can chi), mỗi lần đổi là một lễ mới (không mất ĐH, không tốn Ngọc). Đạo hiệu hiện cạnh tên nhân vật nếu người chơi bật.

Các bước một lượt:

1. **Đếm nét** — nhập số nét của chữ lót và chữ chọn (mức Sơ: in sẵn).
2. **Tính cách** — điền Nhân cách, Địa cách, Tổng cách.
3. **Xét cát hung** — đánh dấu cát / hung từng cách (tra `STROKES_81`).
4. **Tam Tài** — cho biết hành của Nhân cách, nối với Dụng thần người mang tên.
5. **Chọn** — chọn chữ cuối cùng, kèm một câu giải nghĩa (chọn từ 3 câu gợi ý theo nghĩa chữ).

Thiên cách do chữ lót quyết định (như họ) nên **không chấm cát hung** (đúng lý thuyết Ngũ Cách: thiên cách là phần tổ tiên); Ngoại cách của tên 2 chữ cố định = 2 nên cũng không chấm.

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Chọn chữ | chạm thẻ chữ | `1`–`8` | nhấp |
| Nhập số | bàn phím số trên màn hình | phím số, `Tab` sang ô sau | nhấp ô + gõ |
| Đánh dấu cát / hung | chạm vòng tròn đỏ / xám cạnh cách | `C` cát · `H` hung | nhấp |
| Nối hành Tam Tài | chạm hành Nhân cách rồi chạm hành Dụng | `1`–`5` hai lần | nhấp hai lần |
| Đọc thử đạo hiệu | nút loa | `Space` | nút |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Thôi   THƯ LÂU · Đặt đạo hiệu cho người nhập môn   ?  ⏸    │
│ Khách: cô Lý · nguyện «vững chí» · Dụng: 金 Kim ●             │
├──────────────────────────────────────────────────────────────┤
│        ┌────┐ ┌────┐        CHỮ GỢI Ý                         │
│        │ 一 │ │  ? │        [成 thành] [明 minh] [龍 long]    │
│        │Nhất│ │    │        [心 tâm]  [智 trí]  [寶 bảo]      │
│        └────┘ └────┘        [海 hải]  [福 phúc]               │
│  nét:   [ 1]   [  ]                                           │
├──────────────────────────────────────────────────────────────┤
│  Thiên [ 2] (không xét) · Nhân [  ] ○cát ○hung · Địa [  ] …   │
│  Tổng  [  ] ○cát ○hung      Tam Tài: Nhân [ ] → Dụng 金        │
├──────────────────────────────────────────────────────────────┤
│  Giải nghĩa: ( ) «thành tựu điều đã nguyện»  ( ) …   [ Đặt ]  │
└──────────────────────────────────────────────────────────────┘
```

### 6. Đường cong độ khó

| Mức | Bậc gợi ý | Nét | Cách phải tính | Tam Tài | Chữ gợi ý |
|---|---|---|---|---|---|
| Sơ | 2 | in sẵn | Nhân, Tổng | in sẵn hành | 6, có ≥ 2 chữ đạt |
| Trung | 2–3 | tự nhập | Nhân, Địa, Tổng | tự nối | 8 |
| Thâm | 3+ | tự nhập | như Trung + tên ba chữ (chữ lót + 2 chữ, dùng `fiveGrid` với chữ lót ở vị trí họ) | tự nối + quan hệ Thiên–Nhân–Địa | 8, chỉ 1 chữ đạt trọn |
| Viên Thông | 4+ | tự nhập | như Thâm | như Thâm + khách hai nguyện vọng mâu thuẫn | 10 |

### 7. Chấm điểm

```
s = 0,30·Nhân + 0,15·Địa + 0,25·Tổng + 0,20·TamTài + 0,10·Nghĩa
Nhân, Địa, Tổng = 1 nếu cách đó Cát theo STROKES_81 VÀ người chơi tính + đánh dấu đúng;
                  0,5 nếu cách Cát nhưng người chơi tính sai số (chọn chữ đúng nhờ may);
                  0 nếu cách Hung
TamTài   = theo hành Nhân cách so với Dụng thần người mang tên:
           = Dụng 1,0 · sinh Dụng 0,9 · = Hỷ thần 0,8 · không liên quan 0,5 · khắc Dụng 0,1
Nghĩa    = 1 nếu câu giải nghĩa khớp nguyện vọng (nhãn nghĩa của chữ), 0
```

**Ví dụ — lễ đạo hiệu của `MAU-A`, chủ tu Thanh Vi (chữ lót Nhất 一, 1 nét), mức Trung.** Dụng Thủy, Hỷ Kim.
- Chọn **Thành 成 (6)**: Nhân = 1 + 6 = **7 Cát**, hành Kim (chữ số cuối 7); Địa = 6 + 1 = **7 Cát**; Tổng = 7 Cát. Kim sinh Thủy → TamTài 0,9. Nghĩa «thành tựu điều đã nguyện» khớp. `s = 0,30 + 0,15 + 0,25 + 0,18 + 0,10 = 0,98`.
- So sánh **Minh 明 (8)**: Nhân = 9 **Hung** → Nhân 0; Tổng 9 Hung → 0. `s ≤ 0,45` — chưa đạt dù chữ đẹp.
- So sánh **Long 龍 (16)**: Nhân 17 Cát (Kim), Địa 17 Cát, Tổng 17 Cát → cũng đạt cao; game cho người chơi tự chọn giữa hai chữ đạt.

Lượt «Nhất Thành» ở Thư Lâu (NH hành Mộc ≠ Thủy / Kim → `K_dụng = 1`), NK 60: `f = 0,3 + 0,686 = 0,986` → `thô = 6 × 0,986 = 5,92` → `ĐH = 5,92 × 1,19 = 7,04`; Phúc Khí 3. Đạo hiệu «Nhất Thành chân nhân» được lưu.

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi lượt khách | thô (`B = 6`), Phúc Khí |
| Lễ đạo hiệu của mình | thô như một lượt + khung tên «Đạo hiệu» (thẩm mỹ) + sư phụ trao một tờ «điệp» ghi đạo hiệu (vật kỷ niệm trong Sổ Tu) |
| Đặt hiệu cho 50 khách | danh hiệu «Người Đặt Tên» |
| Đệ tử của người chơi (sư đồ, bậc ≥ 4) | sư phụ có thể dùng MG này để đặt đạo hiệu cho đệ tử là người chơi thật; đệ tử phải đồng ý, có quyền từ chối và tự đặt |

### 9. Trạng thái thất bại

| Trường hợp | Xử lý |
|---|---|
| Nhân hoặc Tổng cách Hung | chưa đạt; NPC giảng từ `STROKES_81[n].text` |
| Chữ có nghĩa xấu / không hợp đạo hiệu | bảng chữ đã lọc, không xuất hiện |
| Người chơi tự gõ đạo hiệu ngoài bảng (lễ của mình) | cho phép (quyền tự do), nhưng lượt đó **không** chấm điểm và không thô; lọc từ ngữ thô tục |

```
[CẢNH MG-10.F1 · Thư Lâu Lâm · đèn dầu, giờ Tuất]
THỦ THƯ: «Nhất Minh» — sáng và đẹp. (lật sổ) Nhưng một với tám là chín. Chín trong bảng tám mươi mốt số là số hung.
THỦ THƯ: Chữ đẹp chưa chắc tên đã đẹp. Ta thử chữ khác, giữ cái ý «sáng» lại cho câu giải nghĩa xem.
> Lựa chọn: ① «Con thử chữ Thành.» → (chọn lại, trừ 0,05)  ② «Con giữ chữ Minh, vì con thích nó.» → [đặt, không chấm]
```

Lựa chọn ② tôn trọng quyền của người chơi: đạo hiệu vẫn được đặt, chỉ lượt đó không tính thô. NPC đáp: «Tên là để mình sống cho xứng. Con thích thì giữ.»

### 10. Trợ năng

- Chữ Hán ≥ 32 px, kèm Quốc ngữ và số nét; có nút phóng to từng chữ.
- Đọc màn hình đọc cả âm Hán Việt và nghĩa.
- Bàn phím số trên màn hình to; không yêu cầu gõ chữ Hán.
- Chế độ «Máy tính nét»: tự cộng Nhân / Địa / Tổng sau khi nhập nét — không trừ điểm (E6).

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Thuộc sẵn «chữ nào cũng đạt» | mỗi khách có Dụng thần, nguyện vọng và chữ lót khác nhau; 8 chữ gợi ý xáo theo seed |
| Đổi đạo hiệu liên tục để lấy thô | lễ của mình chỉ 1 lần / mùa; đổi lại giữa mùa = không thô |
| Đặt hiệu xúc phạm cho đệ tử người chơi | đệ tử phải chấp thuận; có báo cáo |

### 12. Đo lường riêng

| Sự kiện | Trường |
|---|---|
| `mg10_calc` | `ren_ok, di_ok, tong_ok, sancai_score` |
| `mg10_pick` | `char_key, lineage, meaning_ok, own_ceremony(bool)` |
| `mg10_freeform` | `own_ceremony(bool)` (không gửi nội dung tên) |

### 13. iOS

Giữ nguyên (✓). Đặt tên là học Ngũ Cách; lời giảng không nói «tên này sẽ làm bạn giàu». Mọi câu giải dùng «hợp ý», «hợp hành», không dùng «vận mệnh sẽ…».

### 14. Nghiệm thu

- [ ] Hàm `fiveGridPair` thuần có test: (1, 6) → 人 7, 地 7, 總 7; (1, 8) → 人 9.
- [ ] Hàm `wxOfNumber(n)` theo chữ số cuối có test 10 chữ số.
- [ ] Ba chế độ tên (2 chữ, 3 chữ với chữ lót ở vị trí họ) cho cùng kết quả với `fiveGrid` khi đổi sang dạng chuỗi.
- [ ] `VN_SURNAME`, `GIVEN_CHAR` được `export` (hoặc có hàm tra) — không sao chép bảng vào `src/game/`.
- [ ] Tự bối của 9 đạo thống được rà để không trùng dãy tự bối thật.
- [ ] Lễ của mình giới hạn 1 lần / mùa; đạo hiệu hiển thị tùy chọn.

---

## MG-11 · Công Án Vấn Đáp

### 1. Mục đích

Thiền tông dùng **công án (公案)** để phá lối nghĩ quen; không có đáp án đúng. MG này là chỗ duy nhất trong tài liệu 09 **không chấm đúng sai**: chấm **sự kiên trì và thành thật** khi tham — đúng tinh thần canon §9.3 («chấm bằng sự kiên trì, số lần quay lại»). Nó còn là cửa vào Thiền Trúc Lâm của người Việt. Trụ cột T3 (thử thách là tâm), T6 (an toàn hội thoại).

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Persona Thiền sư Pháp Không | `truclam_thiensu` (canon §4; thẻ persona tài liệu 06 `PERSONA-truclam_thiensu`) |
| Gọi AI, công tắc tắt AI | `engine/ai.js` (`askAI`; `isAiEnabled` phía máy chủ — canon §6.5) |
| Chống bịa | `neo-checker › checkNeo(response, brief)` khi câu trả lời của AI nhắc tới lá số người chơi (can chi, % ngũ hành); với trích dẫn kinh điển: danh sách trích dẫn hợp lệ `KOAN_BANK` (**chưa có — cần làm**) — câu AI trích ngoài bank bị cắt |
| Pháp chuyển tâm để AI dẫn | `remedy-fate › GAI_XIN` (5 bước 觉 → 停 → 转 → 净 → 化) |
| An toàn hội thoại | canon §6.4 (bốn quy tắc), `anti-manipulation-data` |
| Nguồn công án | biên soạn mới (canon §7.5: «Cần biên soạn mới: Thiền Trúc Lâm») |

**Ngân hàng công án khởi đầu** (văn bản cổ, đã quá hạn bản quyền; mỗi mục ghi nguồn):

| Mã nội bộ | Công án / câu tham | Nguồn |
|---|---|---|
| K1 | «Cư trần lạc đạo thả tùy duyên… Đối cảnh vô tâm mạc vấn thiền» — *ở đời vui đạo, gặp cảnh mà không động tâm thì đừng hỏi thiền nữa*: «Thế nào là đối cảnh vô tâm khi cảnh là một lời mắng?» | Trần Nhân Tông, kệ cuối *Cư trần lạc đạo phú* |
| K2 | «Phản quang tự kỷ bản phận sự, bất tùng tha đắc» — *soi lại mình là việc bổn phận, không từ người khác mà được*: «Việc bổn phận của con hôm nay là gì?» | lời Tuệ Trung Thượng Sĩ dạy Trần Nhân Tông (*Tam tổ thực lục*) |
| K3 | 狗子還有佛性也無？趙州云：無 — «Con chó có Phật tính không? — Không.» | *Vô Môn Quan*, tắc 1 |
| K4 | 如何是祖師西來意？庭前柏樹子 — «Ý Tổ sư từ Tây sang? — Cây bách trước sân.» | *Vô Môn Quan*, tắc 37 |
| K5 | 不思善不思惡，正與麼時，那箇是明上座本來面目 — «Không nghĩ thiện, không nghĩ ác, ngay lúc ấy đâu là mặt mũi xưa nay?» | *Lục Tổ Đàn Kinh*, phẩm Hành Do |
| K6 | 吃粥了也未？洗缽盂去 — «Ăn cháo xong chưa? — Đi rửa bát đi.» | *Vô Môn Quan*, tắc 7 |
| K7 | «Phật tại tâm, tâm tại đâu?» (câu tham soạn theo ý *Khóa hư lục*) | Trần Thái Tông, *Khóa hư lục* (ý, không trích nguyên văn) |

Câu chữ Hán trong bảng cần rà nguyên văn trước khi phát hành (theo quy ước `textual_certainty` của app).

### 3. Luật chơi

1. Người chơi ngồi trước Thiền sư Pháp Không ở chùa Hoa Yên. Mỗi người **tham một công án trong 7 ngày** (đổi sớm được bằng cách «buông» — không phạt).
2. **Lượt chơi** = 1 phiên vấn đáp: Thiền sư nêu công án (ngày 1) hoặc hỏi lại chỗ hôm trước người chơi dừng (ngày 2+). Người chơi trả lời bằng chữ (≤ 400 ký tự / lần) hoặc chọn «Im lặng ngồi» (một nén nhang 60 giây, tính là một lượt trả lời hợp lệ).
3. Thiền sư (AI) **không bao giờ** nói «đúng» hay «sai». Ông hỏi vặn, kể chuyện, hoặc bảo «ngồi thêm». Kết phiên sau 3–6 lượt trao đổi hoặc khi người chơi đứng dậy.
4. Cuối phiên, người chơi chọn một thẻ **tự soi**: «Hôm nay tôi thấy mình bám vào …» (thẻ: lời khen · đúng sai · sự sợ · sự vội · không biết) — thẻ này chỉ cho người chơi, không ai chấm đúng sai.
5. Sau 7 ngày (hoặc khi buông), công án vào **Sổ Tham** cùng các câu trả lời (lưu trên máy người chơi, không lên Thiên Bảng).

**Thiền sư được dặn (system prompt tài liệu 06):** không cho đáp án «chuẩn» trên mạng, không khen văn hay, không đoán tính cách từ lá số, không nhắc phần thưởng (canon §6.4 quy tắc 1, 4); nếu người chơi trích đáp án sách vở thì hỏi «Đó là lời của Triệu Châu. Lời của con đâu?».

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Gõ trả lời | ô nhập + bàn phím hệ thống | gõ, `Enter` gửi, `Shift+Enter` xuống dòng | nhấp ô |
| Im lặng ngồi | nút «Ngồi một nén nhang» | `S` | nút |
| Chọn thẻ tự soi | chạm thẻ | `1`–`5` | nhấp |
| Buông công án | nút «Buông» trong menu | `B` | nút |
| Đứng dậy | nút «Đứng dậy» | `Esc` | nút |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Đứng dậy   CHÙA HOA YÊN · tham ngày 3/7   NK 52      ⏸     │
├──────────────────────────────────────────────────────────────┤
│                 (Thiền sư Pháp Không ngồi, cây đại sau lưng) │
│  PHÁP KHÔNG: «Hôm qua con nói gặp lời mắng thì tức. Tức ấy   │
│  ở đâu trước khi người ta mắng?»                             │
│                                                              │
│  BẠN: …                                                      │
├──────────────────────────────────────────────────────────────┤
│ [ ô trả lời — tối đa 400 ký tự                     ] (Gửi)   │
│ [ Ngồi một nén nhang ]                       178 / 400       │
└──────────────────────────────────────────────────────────────┘
```

Không có thanh điểm, không có đồng hồ đếm ngược, không hiện thô trong phiên; kết quả chỉ hiện khi đứng dậy.

### 6. Đường cong độ khó

«Độ khó» ở đây là **độ sâu dẫn dắt**, không phải độ khó chấm:

| Mức | Bậc gợi ý | Công án | Cách Thiền sư dẫn |
|---|---|---|---|
| Sơ | 2 | K1, K2, K6 (gần đời sống) | hỏi về việc cụ thể hôm nay; nhắc bước «giác – đình» của `GAI_XIN` |
| Trung | 2–3 | thêm K4, K7 | hỏi vặn câu trả lời quen; dùng im lặng |
| Thâm | 3+ | thêm K3, K5 | phá lối trả lời «khái niệm»; yêu cầu nói bằng việc làm |
| Viên Thông | 4+ | công án do người chơi tự nêu từ việc đời mình (AI giúp mài câu hỏi) | ít lời nhất; nhiều phiên chỉ «ngồi» |

### 7. Chấm điểm

Không chấm nội dung đúng sai. `s` đo **sự có mặt, sự quay lại và sự thành thật**:

```
s = 0,25·CóMặt + 0,25·QuayLại + 0,30·TựSoi + 0,20·ThànhThật
CóMặt     = min(1, số lượt trao đổi hợp lệ / 3)        (Im lặng ngồi tính 1 lượt)
QuayLại   = min(1, số ngày đã tham công án này / 3)
TựSoi     = AI phân loại theo thang 4 mức, KHÔNG dựa độ dài (>400 ký tự bị cắt; độ dài không vào thang):
            0,25 chỉ nhắc lại công án · 0,5 nêu ý kiến chung · 0,75 nêu một việc cụ thể trong đời mình
            · 1,0 nhận ra phản ứng của chính mình ngay trong phiên («tôi đang muốn được khen»)
ThànhThật = 1, trừ: dán văn bản (sự kiện paste > 40 ký tự) −0,5; trùng ≥ 80% câu trong KOAN_BANK
            hoặc câu đã gửi trước đó −0,5; kẹp 0..1
```

Thang TựSoi chạy bằng một lời gọi AI phân loại riêng (không phải lời Thiền sư), trả về một con số; nếu AI tắt → TựSoi = 0,5 cố định.

**Ví dụ.** `MAU-A` tham K1 ngày thứ 2, ở Yên Tử (TH hành Mộc ≠ Thủy / Kim → `K_dụng = 1`), NK 52 (`K_sung = 1`). 4 lượt trao đổi (CóMặt 1), ngày 2 (QuayLại 0,67), có nêu việc cụ thể «hôm qua bị sếp nói trước mặt mọi người, tôi im nhưng đêm không ngủ» (TựSoi 0,75), không dán (ThànhThật 1).
`s = 0,25 + 0,167 + 0,225 + 0,20 = 0,842` → `f = 0,889` → `thô = 8 × 0,889 = 7,11` → `ĐH = 7,11 × 1,19 = 8,46`; Phúc Khí 4.

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi phiên (tối đa **2 phiên có thô / ngày**) | thô (`B = 8`), Phúc Khí |
| Tham trọn 7 ngày một công án | ghi vào Sổ Tham; ngày 7 Thiền sư tặng một câu kệ (chọn từ bank, không AI sinh) |
| Tham trọn 7 công án | danh hiệu «Người Ngồi Dưới Cây Đại»; Tu độ TH +20 (một lần) |
| Không có | Thiên Bảng riêng, xếp hạng câu trả lời, chia sẻ câu trả lời công khai (để không biến công án thành cuộc thi văn) |

### 9. Trạng thái thất bại

Không có «chưa đạt». Các trường hợp đặc biệt:

| Trường hợp | Xử lý |
|---|---|
| Người chơi bày tỏ khủng hoảng thật (tự hại, tuyệt vọng, bệnh nặng) — bộ lọc của app + AI phát hiện | **dừng vai** theo canon §6.4 quy tắc 3: hiện thông tin hỗ trợ thật của app, tắt công án trong phiên; không tính điểm, không nhắc phần thưởng; Thiền sư quay lại vai chỉ khi người chơi chủ động |
| Hết lượt AI trong ngày (canon §6.5: 10 lượt / ngày, VIP 30 — dùng chung với mọi NPC AI) | phiên chuyển sang **chế độ kịch bản**: Thiền sư dùng bộ câu hỏi soạn sẵn theo công án; vẫn tính thô (TựSoi = 0,5) |
| AI tắt (`isAiEnabled` = false) | như trên, không báo lỗi |
| Người chơi viết tục / quấy | Thiền sư im lặng một lượt rồi mời «ngồi một nén nhang»; ThànhThật không bị trừ (không phạt cảm xúc) |

```
[CẢNH MG-11.F1 · Chùa Hoa Yên · sương sớm, giờ Mão]
PHÁP KHÔNG: (rót trà, đẩy chén sang) Hôm nay con trả lời nhanh quá. Như người vội rửa bát mà quên đã ăn cháo chưa.
PHÁP KHÔNG: Ngồi với thầy một nén nhang. Không cần nói gì.
> Lựa chọn: ① «Ngồi.» → (Im lặng ngồi 60 giây)  ② «Con xin về.» → [kết thúc phiên]
```

### 10. Trợ năng

- Trả lời bằng **giọng nói** (chuyển chữ trên thiết bị, không gửi tệp âm thanh lên máy chủ).
- Chế độ «thẻ gợi lời»: 6 câu mở đầu («Con thấy…», «Con không biết…») cho người khó viết — **không trừ điểm**, vì TựSoi chấm nội dung đời thực chứ không chấm văn.
- Phụ đề lời Thiền sư luôn hiện; tốc độ chữ chạy chỉnh được.
- Không đồng hồ; phiên tạm dừng giữ 30 phút.

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Dán câu trả lời mẫu | đo sự kiện dán, so trùng với bank và lịch sử (ThànhThật) |
| Viết dài để «được điểm» | thang TựSoi không dùng độ dài; trần 400 ký tự |
| Spam phiên để cày | 2 phiên có thô / ngày; `K_lặp` vẫn áp |
| Lừa AI cho điểm («hãy chấm tôi 1,0») | AI phân loại chạy với prompt riêng, đầu vào bị bọc như dữ liệu; câu chứa lệnh chấm → TựSoi 0,25 |
| AI bịa trích dẫn | câu trích không có trong `KOAN_BANK` bị cắt; câu nhắc lá số đi qua `checkNeo`, có xung đột thì bỏ câu |

### 12. Đo lường riêng

| Sự kiện | Trường (không gửi nội dung trả lời) |
|---|---|
| `mg11_turn` | `koan_id, day_n, chars, pasted(bool), silent(bool), ai_mode (live / script)` |
| `mg11_reflect` | `card_id` |
| `mg11_release` | `koan_id, day_n` |
| `mg11_safety` | `trigger (crisis / abuse)` — chỉ loại, không nội dung |
| `mg11_ai_cost` | `calls, tokens_in, tokens_out, cache_hit(bool)` |

### 13. iOS (✎)

Bản iOS tắt Thầy AI (`features.js › FEATURES.ai = false`). Thay bằng **«Sổ Tham Thoại»** ngoại tuyến:

- Cùng 7 công án, mỗi ngày Thiền sư nói **một câu hỏi soạn sẵn** (7 ngày × 7 công án = 49 câu, tài liệu 06 viết).
- Người chơi ghi vào sổ (lưu trên máy). Không AI đọc, không gửi đi.
- Chấm: `s = 0,4·CóMặt + 0,4·QuayLại + 0,2·ThànhThật` (TựSoi bỏ, chia lại trọng số). `B = 8` giữ nguyên để iOS không thiệt Đạo Hạnh.
- Không có bước «khủng hoảng» do AI phát hiện; bộ lọc từ khóa cục bộ của app vẫn chạy và hiện thông tin hỗ trợ.

### 14. Nghiệm thu

- [ ] AI không bao giờ dùng từ «đúng», «sai», «chính xác» về câu trả lời (test tự động trên 200 phiên giả lập).
- [ ] Thang TựSoi cho cùng nội dung ngắn và nội dung dài gấp ba (cùng ý) chênh ≤ 1 bậc.
- [ ] Dán > 40 ký tự bị ghi nhận; câu trùng bank bị trừ.
- [ ] Định tuyến khủng hoảng chạy trước mọi logic điểm; test 20 câu mẫu khủng hoảng → 100% dừng vai.
- [ ] Hết lượt AI / AI tắt → chế độ kịch bản, không hiện lỗi.
- [ ] Trích dẫn ngoài `KOAN_BANK` bị cắt; nguyên văn bank đã được rà.
- [ ] Bản iOS không gọi mạng trong MG này.

---

## MG-12 · Thư Pháp Lâm Thiếp

### 1. Mục đích

**Lâm thiếp (臨帖)** — chép theo bản mẫu — là cách người xưa vừa luyện chữ vừa thấm lời. MG dạy **thứ tự nét** và dáng chữ của những câu cốt lõi của app: «命由我作» (mệnh do ta tạo), «謙受益», mười điều thiện của Liễu Phàm, các câu Trích Thiên Tủy. Một MG «Nghệ» yên tĩnh, ngắn, dùng chung cho Nho (Văn Miếu, Thư Lâu) và thư phòng Sơn Môn. Trụ cột T2 (câu «mệnh do ta tạo» được viết bằng tay mình), T5.

**Ranh giới với phù:** thư pháp dùng **chữ Hán thật** trong kinh điển; phù lục trong game chỉ dùng ký tự hư cấu (`MG-02`, canon T6). Hai MG không bao giờ trộn nhau.

### 2. Engine dạy

| Phần | Nguồn |
|---|---|
| Câu mẫu | `remedy-fate › REMEDY_QUOTES` (命由我作，福自己求 · 禍福無門，惟人自召 · 滿招損，謙受益 …), `remedy-fate › TEN_THIEN` (與人為善, 愛敬存心, 成人之美 …), `kb › DITIANSUI_MAXIMS` (vd 寒甚暖至，燥甚濕至) |
| Dạng chữ | code lưu một số câu ở dạng giản thể (vd `TEN_THIEN.han: '与人为善'`); MG hiển thị **phồn thể** (與人為善) — bảng quy đổi giản → phồn **chưa có — cần làm** |
| Dữ liệu nét (thứ tự, hướng, khung) | **chưa có — cần làm**. Có bộ dữ liệu mở (vd Make Me a Hanzi) nhưng phải **kiểm tra giấy phép** (bản quyền phông nguồn) trước khi dùng; phương án dự phòng: tự số hóa ≈ 120 chữ cần cho bank câu |
| Chấm nét tự động | **chưa có — cần làm** (so khớp đường vẽ với trung tuyến nét mẫu) |

### 3. Luật chơi

Khung giấy có **cửu cung cách (九宮格)**. Một lượt = một câu 4 chữ (hoặc 2 chữ ở mức Sơ). Ba kiểu viết theo mức:

- **Lâm (tô):** chữ mẫu mờ dưới giấy; tô từng nét đúng thứ tự.
- **Mô (nhìn mẫu):** chữ mẫu đặt bên cạnh; viết vào ô trống.
- **Bối (viết thuộc):** chỉ có âm Hán Việt và nghĩa; viết từ trí nhớ.

Mỗi nét: đặt bút ở đầu nét → kéo theo hướng → nhấc bút. Nét sai thứ tự hoặc sai hướng hiện vệt mờ đỏ nhạt 1 giây rồi biến mất; người chơi viết tiếp (không bắt viết lại cả chữ). Viết xong câu, NPC đóng dấu son và đọc nghĩa.

**Chế độ «Thư pháp chữ Việt»** (Quốc ngữ, mở ngay từ bậc 1, cùng `B`): viết theo lối thư pháp chữ Việt các chữ «Tâm», «Nhẫn», «An», «Mệnh do ta tạo»… Không có thứ tự nét chuẩn quốc tế nên chấm theo **dáng và độ liền mạch**, không chấm thứ tự (xem §7).

### 4. Điều khiển

| Việc | Chạm | Bàn phím | Chuột |
|---|---|---|---|
| Viết nét | kéo một ngón (bút cảm ứng: lực nhấn ăn vào độ đậm) | — (xem trợ năng: chế độ chọn nét) | giữ nút trái và kéo |
| Hoàn tác nét | nút ↶ | `Ctrl+Z` hoặc `Backspace` | nút |
| Xem nét kế (gợi ý) | nút «Nét kế» | `H` | nút |
| Đổi kích cỡ bút | nút cỡ bút | `[` / `]` | bánh xe |
| Xong chữ | tự nhận khi đủ nét; hoặc nút «Xong» | `Enter` | nút |

### 5. Bố cục giao diện

```
┌──────────────────────────────────────────────────────────────┐
│ ← Thôi   VĂN MIẾU · Lâm thiếp «命由我作»   chữ 2/4   ?  ⏸     │
├──────────────────────────────────────────────────────────────┤
│   ┌─────┬─────┬─────┐        BẢN MẪU (kiểu Mô)               │
│   │  ·  │  ·  │  ·  │           命 由 我 作                   │
│   ├─────┼─────┼─────┤        Mệnh do ngã tác                  │
│   │  ·  │ 由? │  ·  │        «Mệnh do ta làm nên»             │
│   ├─────┼─────┼─────┤        — Liễu Phàm Tứ Huấn              │
│   │  ·  │  ·  │  ·  │                                         │
│   └─────┴─────┴─────┘        Nét: 3/5   [Nét kế] [↶]          │
├──────────────────────────────────────────────────────────────┤
│  mực ▮▮▮▮▯   bút: lông sói vừa                    [ Xong ]   │
└──────────────────────────────────────────────────────────────┘
```

### 6. Đường cong độ khó

| Mức | Bậc gợi ý | Kiểu | Độ dài | Chữ | Dung sai hình |
|---|---|---|---|---|---|
| Sơ | 1 | Lâm | 2 chữ (vd 謙益, 善心) | ≤ 8 nét | rộng (khoảng lệch cho phép 18% khung) |
| Trung | 1–2 | Lâm → Mô | 4 chữ (命由我作) | ≤ 12 nét | 14% |
| Thâm | 3+ | Mô | 4 chữ (與人為善, 寒甚暖至) | ≤ 16 nét | 10% |
| Viên Thông | 4+ | Bối | 8 chữ (cả câu đối «命由我作，福自己求») | không giới hạn | 8%; chấm thêm bố cục cả câu |

### 7. Chấm điểm

```
s = 0,35·ThứTự + 0,20·Hướng + 0,25·TỉLệ + 0,20·LựcBút
ThứTự   = số nét viết đúng thứ tự / tổng nét
Hướng   = số nét đi đúng chiều (đầu → cuối) / tổng nét
TỉLệ    = 1 − (độ lệch trung bình giữa nét vẽ và trung tuyến nét mẫu ÷ dung sai), kẹp 0..1
LựcBút  = bút cảm ứng có lực nhấn: độ khớp đậm – nhạt với mẫu (đầu nét nặng, cuối nét nhẹ);
          ngón tay / chuột: dùng tốc độ làm đại diện (chậm ở đầu và chỗ gãy nét, nhanh ở thân nét);
          điểm hai cách được chuẩn hóa cùng thang để thiết bị không quyết định điểm
Gợi ý «Nét kế»: trừ 0,03 / lần ở mức Trung trở lên
```

**Chế độ chữ Việt:** `s = 0,45·TỉLệ + 0,30·LiềnMạch + 0,25·LựcBút`; `LiềnMạch` = tỉ lệ nét viết không nhấc bút ở các chỗ mẫu viết liền.

**Ví dụ.** `MAU-A` viết «命由我作» kiểu Mô, mức Trung, ở thư phòng Sơn Môn (TC hành Thổ — không phải Dụng Thủy hay Hỷ Kim → `K_dụng = 1`), NK 80 (`K_sung = 1,10`). Tổng 26 nét: 24 nét đúng thứ tự (ThứTự 0,923), 25 nét đúng chiều (Hướng 0,962), TỉLệ 0,70, LựcBút 0,60, dùng 1 gợi ý.
`s = 0,323 + 0,192 + 0,175 + 0,12 − 0,03 = 0,78` → `f = 0,846` → `thô = 5 × 0,846 = 4,23` → `ĐH = 4,23 × 1,19 × 1 × 1,10 = 5,54`; Phúc Khí 2.

### 8. Phần thưởng

| Hạng | Thưởng |
|---|---|
| Mỗi lượt | thô (`B = 5`), Phúc Khí |
| Lượt `s ≥ 0,85` | bức chữ được **treo trong nhà riêng** (tối đa 6 bức, thay cũ bằng mới; tài liệu 08 bố trí khung treo) |
| Viết đủ 10 câu trong bank | danh hiệu «Lâm Trì» (gợi tích Trương Chi luyện chữ ao mực đen) |
| Bức chữ đẹp nhất tuần của môn phái (bình chọn thành viên) | treo ở đạo tràng chung một tuần; không có thô thêm |

### 9. Trạng thái thất bại

| Trường hợp | Xử lý |
|---|---|
| `s < 0,4` | chưa đạt; tờ giấy vẫn giữ trong Sổ Tu để người chơi so lần sau |
| Viết nguệch ngoạc ngoài khung (> 60% mực ra ngoài cửu cung) | lượt kết thúc sớm, không thô, không tính `K_lặp` (§13.6 «bỏ dở») |
| Thiết bị không có cảm ứng / chuột | chế độ chọn nét (trợ năng) |

```
[CẢNH MG-12.F1 · Văn Miếu · Khuê Văn Các, chiều muộn]
TẾ TỬU CHU VĂN TRINH: Chữ «我» con viết cái móc trước, cái phẩy sau. Chữ vẫn thành chữ, nhưng tay chưa thành tay.
TẾ TỬU CHU VĂN TRINH: Người xưa nói mệnh do ta làm nên. Viết bốn chữ ấy mà vội, thì làm sao làm nên cái gì. Mài mực thêm chút nữa đi.
```

### 10. Trợ năng

- **Chế độ chọn nét** (không cần vẽ tay): mỗi bước hiện 3 nét ứng viên; chọn nét đúng thứ tự bằng chạm / phím `1`–`3`. Chấm ThứTự và Hướng như thường, TỉLệ và LựcBút cho 0,75 cố định — vẫn đạt, không bị thiệt so với `s_min`.
- Phóng to khung giấy tới 200%; nét mẫu dày gấp đôi khi bật tương phản cao.
- Thuận tay trái: đảo vị trí khay mẫu và nút.
- Đọc màn hình đọc tên nét theo thứ tự («chấm», «ngang», «sổ», «phẩy», «mác», «móc»).

### 11. Chống gian

| Điểm yếu | Biện pháp |
|---|---|
| Phát lại đường vẽ ghi sẵn (bot) | dao động vi mô tự nhiên của nét tay; đường vẽ khớp mẫu > 99% trên mọi nét → cờ «nghi máy» (`09-03` §12) |
| Gửi điểm giả | client gửi tọa độ nét (đã nén); máy chủ chấm lại |
| Cày câu ngắn | câu chọn theo mức, `K_lặp` áp dụng |

### 12. Đo lường riêng

| Sự kiện | Trường |
|---|---|
| `mg12_stroke` | `char, stroke_no, order_ok, dir_ok, dev_ratio, input (pen / touch / mouse / pick)` |
| `mg12_char_done` | `char, strokes, ms` |
| `mg12_hang` | `quote_id` (treo vào nhà riêng) |
| `mg12_viet_mode` | `word` (chế độ chữ Việt) |

Chỉ số theo dõi: tỉ lệ dùng «chế độ chọn nét»; chênh lệch điểm trung bình giữa `pen` và `touch` (mục tiêu < 0,05 — nếu lớn hơn, chỉnh chuẩn hóa LựcBút).

### 13. iOS

Giữ nguyên (✓). Câu mẫu là văn học cổ và lời răn đạo đức, không phải lời bói.

### 14. Nghiệm thu

- [ ] Giấy phép bộ dữ liệu nét được pháp lý duyệt, hoặc có bộ tự số hóa cho đủ chữ trong bank.
- [ ] Mọi câu mẫu trích từ `REMEDY_QUOTES`, `TEN_THIEN`, `DITIANSUI_MAXIMS`, hiện đúng nguồn dưới bản mẫu.
- [ ] Quy đổi giản → phồn cho mọi chữ trong bank có test.
- [ ] Chế độ chọn nét đạt được `s ≥ 0,4` khi chọn đúng mọi nét.
- [ ] Chênh điểm `pen` / `touch` / `mouse` trên bộ 50 bài mẫu ≤ 0,05.
- [ ] Không chữ nào trong bank trùng với ký tự phù hư cấu của `MG-02`.

---

## Phụ lục · Việc engine phát sinh từ phần này

| Việc | MG | Loại |
|---|---|---|
| Export `SHENG` (tương sinh) từ `tcm.js`; thêm `TCM_SAFE_SKIP` | `MG-07` | hằng số |
| Mẫu câu kể triệu chứng (≥ 4 cách diễn đạt / vế) | `MG-07` | nội dung (tài liệu 06) |
| Module chấm `mg08Grade` dùng lại `bedScore`, `starOf` | `MG-08` | logic thuần |
| `ACTIVITY.pray` (祭祀 / 祈福) trong `zheri.js` | `MG-09` | engine |
| Export `VN_SURNAME`, `GIVEN_CHAR`; `fiveGridPair`; `wxOfNumber`; rà nét Khang Hy; bảng chữ mở rộng có hành theo bộ thủ | `MG-10` | engine + dữ liệu |
| `KOAN_BANK` (nguyên văn đã rà + nguồn), bộ câu kịch bản 49 câu cho iOS | `MG-11` | nội dung |
| Dữ liệu nét chữ Hán (giấy phép), quy đổi giản → phồn, bộ chấm nét | `MG-12` | dữ liệu + logic |
