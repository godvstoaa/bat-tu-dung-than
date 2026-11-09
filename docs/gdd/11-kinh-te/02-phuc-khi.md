# 11 · Phần 02 — Phúc Khí: nguồn, chỗ tiêu, cân bằng

> Phúc Khí là tiền tệ **cày được** của game: thưởng cho việc đến quán, giải án, ngồi trà, làm nghề. Phần này liệt kê mọi nguồn có thật trong `src/game/state.js` với con số đúng code, mọi nguồn dự kiến của bản AAA, mọi chỗ tiêu (sink) hiện có và dự kiến, rồi đặt cơ chế chống lạm phát.
>
> Phúc Khí **không** mua được bằng tiền, **không** đổi ra Ngọc, **không** đổi ra Đạo Hạnh hay công đức (phần 01 §5).

---

## 1. Định nghĩa trong code

| Trường | Ý nghĩa | Đặt ở | Ghi chú |
|---|---|---|---|
| `state.phucKhi` | **số dư** hiện tại | `state.js › createState` | giảm khi mua món (`cosmetics.js › buy`) |
| `state.xp` | Phúc Khí **tích lũy cả đời** | `state.js › addPhuc` cộng `max(0, n)` | quyết định **cấp** (`progress.js › levelOf`) |
| `state.daily` | bộ đếm trong ngày: `got{}`, `teaMin`, `sticks`, `cases[]`, `desks[]` | `state.js › freshDaily`, `rollDay` | đổi ngày theo **ngày lịch máy người chơi** (`todayStr`) |
| `TEXT.point` | tên hiển thị | `features.js` | web: «Phúc Khí»; iOS: «Điểm Tu Học» |

Công thức cấp (`progress.js`): `xpFor(L) = 20·(L−1)²`, `levelOf(xp) = ⌊√(xp/20)⌋ + 1`.

### 1.1 Hai lỗi kinh tế phát hiện khi rà code

**Lỗi PK-1 — danh xưng và trà theo số dư, không theo đời.**

- `main.js` gọi `S.titleFor(state.phucKhi)` để hiện danh xưng (Khách Vãng Lai → Tri Âm Huyền Quán, ngưỡng 0 / 30 / 100 / 250 / 500) và gửi danh xưng lên MMO (`profile().title`).
- `stations.js` mở trà theo `state.phucKhi >= t.min` (Trà Lài 30, Ô Long 100, Shan Tuyết 250).
- Hệ quả: người chơi có 520 Phúc Khí là «Tri Âm Huyền Quán»; mua Phất Trần (260) còn 260 → tụt xuống «Đệ Tử» trước mặt cả phòng MMO, và có thể mất trà. **Tiêu tiền bị phạt bằng danh dự**, người chơi sẽ tích trữ thay vì tiêu → chỗ tiêu Phúc Khí vô dụng.
- **Sửa:** `titleFor` và mở trà đọc `state.xp`. Ngưỡng giữ nguyên (theo đời thì người chơi chăm đạt Tri Âm sau ~3 ngày; có thể nâng ngưỡng — tài liệu 04 quyết định, kinh tế chỉ yêu cầu dùng `xp`).

**Lỗi PK-2 — vòng in Phúc Khí qua hồ sơ.**

- `grantChart(s, profileId)` thưởng `REWARD.chart = 10` cho mỗi `profileId` chưa thưởng. `addProfile` tạo id mới ngẫu nhiên mỗi lần. `removeProfile` không xóa cờ.
- Hệ quả: xóa rồi thêm lại cùng một lá số → +10 mỗi lần, không giới hạn. Vượt mọi nguồn khác (1 phút làm được ~6 vòng = 60 Phúc Khí).
- **Sửa:** khóa theo `hash(ngày giờ sinh chuẩn hóa + giới tính)`; tối đa 1 lần đời mỗi lá số; tối đa 10 lá số được thưởng (50 → 100 Phúc Khí đời). Trên máy chủ (phần 09 §5) khóa này lưu cùng tài khoản.

**Lỗi PK-3 — đổi ngày theo đồng hồ máy.**

- `todayStr()` dùng giờ máy. Chỉnh đồng hồ máy sang ngày mai → nhận lại mọi phần thưởng ngày, và điểm danh Ngọc (`cosmetics.js › checkin` cũng dùng `dayStr(now)`).
- **Sửa:** từ khi có máy chủ (phần 09 §5), «ngày kinh tế» do máy chủ cấp: đổi ngày lúc **00:00 giờ Việt Nam (UTC+7)** cho mọi người chơi khu vực VN; khu vực khác theo múi giờ khai báo khi tạo tài khoản, đổi múi giờ tối đa 1 lần / 30 ngày. Khi ngoại tuyến, thưởng ghi tạm và được máy chủ đối soát khi kết nối lại (phần 10 §8.4).

---

## 2. Nguồn hiện có — đúng code

### 2.1 Bảng nguồn

| # | Nguồn | Hàm | Giá trị | Giới hạn | Web | iOS |
|---|---|---|---|---|---|---|
| N1 | Lập lá số (mỗi hồ sơ) | `grantChart` | `REWARD.chart` = **10** | 1 lần / hồ sơ (lỗi PK-2); `CAPS.maxProfiles` = 5 | có | có |
| N2 | Xem La Bàn Đài | `grantDaily('compass')` | `REWARD.compass` = **5** | 1 / ngày | có | có |
| N3 | Xin xăm (thẻ được keo thuận) | `recordStick` | `REWARD.stick` = **3** | `CAPS.sticksPerDay` = 3 thẻ / ngày | có | **không** (`xam` tắt) |
| N4 | Thắp nhang / đốt trầm | `lightIncense → grantDaily('huong')` | `REWARD.huong` = **5** | 1 / ngày; nhang cháy `INCENSE_MS` = 3 phút | có | có (Lò Trầm) |
| N5 | Xem Bảng Lịch | `grantDaily('lich')` | `REWARD.lich` = **2** | 1 / ngày | có | có |
| N6 | Thả đèn hoa đăng | `addLantern → grantDaily('lantern')` | `REWARD.lantern` = **3** | 1 / ngày | có | **không** (`sen` tắt) |
| N7 | Xong 3 việc trong ngày | `settleTasks` | `REWARD.tasks` = **5** | 1 / ngày; cần lich + huong + 1 án | có | có |
| N8 | Ngồi trà | `addTeaMinutes` | **1 / phút** | `CAPS.teaPerDay` = 15 phút / ngày | có | có |
| N9 | Giải án khách (NPC) | `recordCase(kind 'npc')` | `round(CASE_REWARD.npcMax × điểm)` = **0–15** | `CASES_PER_DAY` = 3 khách / ngày | có | có |
| N10 | Án Cổ (lá số kinh điển) | `recordCase(kind 'classical')` | `CASE_REWARD.classical` = **25** | 1 lần đời / án, khi lần đầu đạt ≥ 60%; 38 án (`cases.js` lọc `CLASSICAL_CASES` có `known`) | có | có |
| N11 | Sảnh nghề | `recordCase(kind 'desk')` | `round(DESK_REWARD × điểm)` = **0–15** | 1 khách / sảnh / ngày; 8 sảnh: `trach`, `duongtrach`, `dieuhau`, `thuvien`, `hophon`, `tuvi`, `tuongphap`, `cachcuc` | có | có (trừ khi sảnh dùng chức năng tắt) |
| N12 | Thắp đèn an Thái Tuế | `lightLamp` | `LAMP_REWARD.first` = **10**, `daily` = **3** | đèn mới mỗi năm can chi; thêm dầu 1 / ngày | có | **không** (`thaitue` tắt) |
| N13 | Hợp mệnh | `recordCase` nhân `1 + wardrobe.bonus` | **×1,1** cho N9, N10, N11 | mặc đủ bộ trùng Dụng thần | có | có |

**Ghi chú làm tròn N13:** `recordCase` làm tròn hai lần: `round(15 × 1,0) = 15` rồi `round(15 × 1,1) = round(16,5) = 17`. Một án hoàn hảo có Hợp mệnh được 17 (không phải 16,5). Án Cổ: `round(25 × 1,1) = round(27,5) = 28`.

### 2.2 Trần ngày lý thuyết (điểm 100% mọi án)

| Nguồn | Web | Web + Hợp mệnh | iOS | iOS + Hợp mệnh |
|---|---|---|---|---|
| La Bàn | 5 | 5 | 5 | 5 |
| Xăm | 9 | 9 | — | — |
| Nhang / trầm | 5 | 5 | 5 | 5 |
| Lịch | 2 | 2 | 2 | 2 |
| Hoa đăng | 3 | 3 | — | — |
| 3 việc | 5 | 5 | 5 | 5 |
| Trà | 15 | 15 | 15 | 15 |
| Án khách (3) | 45 | 51 | 45 | 51 |
| Sảnh nghề (8) | 120 | 136 | 120 | 136 |
| Đèn Thái Tuế | 3 | 3 | — | — |
| **Tổng / ngày** | **212** | **234** | **197** | **219** |

Một lần đời: lập lá số tối đa 50 (sau sửa PK-2: 100); Án Cổ 38 × 25 = **950** (Hợp mệnh: 38 × 28 = 1.064); đèn Thái Tuế đầu năm 10 / năm.

### 2.3 Phân bố điểm án thực tế

Điểm án (`total` 0–1) là tổng có trọng số 6 bước (`cases.js › STEP_WEIGHTS`: lập trụ 0,2 · ngũ hành 0,1 · vượng nhược 0,2 · Dụng thần 0,25 · năm thuận 0,1 · lời khuyên 0,15). Giả định để mô phỏng (cần đo thật sau khi mở analytics — phần 10):

| Nhóm người chơi | Điểm án trung bình | Phúc Khí / án |
|---|---|---|
| Mới (tuần 1) | 0,45 | 7 |
| Đang học (tuần 2–6) | 0,65 | 10 |
| Thạo (tuần 7+) | 0,82 | 12 |
| Rất thạo | 0,93 | 14 |

Thiết kế cố ý: người giỏi nghề hơn được nhiều Phúc Khí hơn, nhưng chênh lệch giữa «đang học» và «rất thạo» chỉ ~40%. Không ai bị bỏ quá xa.

### 2.4 Bảng cấp theo `xp`

| Cấp | `xp` cần | Mở (hiện tại, `GIATRI`) |
|---|---|---|
| 2 | 20 | Hào quang hộ thể |
| 3 | 80 | — |
| 4 | 180 | Linh khí quanh thân |
| 5 | 320 | — |
| 6 | 500 | Vệt sáng bộ pháp |
| 7 | 720 | — |
| 8 | 980 | Ngự kiếm (phần 01 §4.2 đề xuất tách Ngự Vân Thường) · `aura_sen` mua được |
| 9 | 1.280 | — |
| 10 | 1.620 | Pháp quang · `quan_sen` mua được (kèm VIP) |
| 12 | 2.420 | — |
| 15 | 3.920 | — |
| 20 | 7.220 | — |
| 25 | 11.520 | — |
| 30 | 16.820 | — |
| 40 | 30.420 | — |
| 50 | 48.020 | — |
| 60 | 69.620 | — |
| 80 | 124.820 | — |
| 100 | 196.020 | — |

Khoảng cách giữa hai cấp liền: `xpFor(L+1) − xpFor(L) = 40L − 20`. Cấp 10 → 11 cần 380; cấp 50 → 51 cần 1.980.

---

## 3. Nguồn dự kiến của bản AAA

### 3.1 Nguyên tắc cấp Phúc Khí cho hoạt động mới

1. **Hai bảng riêng.** Mỗi hoạt động có một con số Đạo Hạnh (tài liệu 04 / 05 / 09 quyết định) và một con số Phúc Khí (tài liệu này quyết định). Hai số **không suy ra nhau**.
2. **Phúc Khí thưởng việc lặp lại hằng ngày**, Đạo Hạnh thưởng **tiến bộ** (lần đầu đạt mốc, độ khó tăng).
3. **Không thưởng tốc độ** ở hoạt động tu tâm (thiền công án, tĩnh tọa): thưởng theo hoàn thành, không theo nhanh.
4. **Không thưởng theo vận** (thẻ xăm, quẻ tốt xấu, năm thuận nghịch): giữ quy tắc của `recordStick`.
5. Mỗi hoạt động mới có **trần ngày riêng**, và có **ngân sách ngày chung** §5.

### 3.2 Bảng nguồn dự kiến

Mã hoạt động (`MG-xx`, `ACT-xx`) do tài liệu 09 cấp; ở đây gọi theo tên trong sơ đồ tổng §9.3.

| # | Hoạt động | Phúc Khí đề xuất | Trần ngày | Ghi chú cân bằng |
|---|---|---|---|---|
| D1 | Tĩnh tọa (nhịp thở) | 1 / phút | 20 phút / ngày | giống trà; tĩnh tọa và trà **cộng chung** trần 30 phút để không ép ngồi 35 phút / ngày |
| D2 | Kết phù (ghép 5 phần) | 8 / lá đúng hành | 3 lá / ngày | lá sai hành 0, không phạt |
| D3 | Khoa cử — hương thí | 20 / kỳ đậu | 1 / ngày | thi lại được, chỉ thưởng 1 lần / ngày |
| D4 | Khoa cử — hội thí | 40 / kỳ đậu | 1 / tuần | — |
| D5 | Khoa cử — đình thí | 80 / kỳ đậu | 1 / tháng âm | danh hiệu do tài liệu 09 |
| D6 | Đặt tên / đạo hiệu cho NPC | 10 / tên đạt | 2 / ngày | `naming.js › analyzeName` |
| D7 | Sửa nhà (bài phong thủy cho NPC) | 15 / bài đạt | 1 / ngày | `zhai`, `xuankong` |
| D8 | Chọn ngày lễ cho NPC | 10 / ngày chọn đạt | 2 / ngày | `zheri`, `huangdao` |
| D9 | Thiền công án | 10 / buổi hoàn thành | 1 / ngày | không chấm đúng sai |
| D10 | Mạn-đà-la cát | 10 / bức hoàn thành | 1 / ngày | chỉ sau tham vấn Tạng Địa |
| D11 | Vạch mặt Định Mệnh Hội (đối chiếu lời phán) | 15 / vụ | 2 / ngày | — |
| D12 | Cứu người trúng yểm | 25 / người | 1 / ngày | — |
| D13 | Y dược (hái thảo, sắc thuốc NPC) | 3 / vị thảo; 12 / thang đúng | 10 vị + 2 thang / ngày | `tcm` |
| D14 | Việc trong ngày ở thánh địa (`DQ-xx`) | 10 / việc | 3 / ngày | thay thế dần «3 việc» hiện có ở cấp cao |
| D15 | Nhiệm vụ chính (`MQ-*`) | 30 – 150 / chương | một lần | cố định theo chương, tài liệu 03 ghi số |
| D16 | Nhiệm vụ phụ (`SQ-*`) | 20 – 60 / nhiệm vụ | một lần | — |
| D17 | Lễ tiết (`EV-*`) | 20 – 80 / hoạt động lễ | theo lễ | — |
| D18 | Đồng tu (thiền cùng người khác) | +20% trên D1 khi có ≥ 2 người | trong trần D1 | không vượt trần, chỉ tiến nhanh hơn |
| D19 | Sư đồ: đệ tử xong một tầng Mệnh Đồ | sư phụ +30 Phúc Khí | 1 / đệ tử / tầng | công đức cho sư phụ do tài liệu 05; ở đây chỉ Phúc Khí |
| D20 | Môn phái: việc chung tuần | 50 / tuần | 1 / tuần | — |
| D21 | Đạo Lộ: bậc nhánh miễn phí có Phúc Khí | 50 – 200 / bậc có thưởng | theo bậc | phần 07 |
| D22 | Thành tựu (`achievements`) | 0 | — | thành tựu không thưởng Phúc Khí, để không thành nguồn in tiền khi thêm thành tựu |

### 3.3 Ngày chơi chăm của bản AAA (ước tính)

| Nhóm | Hiện có | Dự kiến thêm | Tổng thô |
|---|---|---|---|
| Thưởng nhỏ hằng ngày (N2–N8, N12) | 43 | — | 43 |
| Án + sảnh (N9, N11, điểm 0,82) | 135 | — | 135 |
| Tĩnh tọa + trà (chung trần 30 phút) | 15 | +15 | 30 |
| Kết phù, đặt tên, chọn ngày, sửa nhà | — | 24 + 20 + 20 + 15 | 79 |
| Khoa cử hương thí | — | 20 | 20 |
| Việc thánh địa D14 | — | 30 | 30 |
| Định Mệnh Hội, cứu người, y dược | — | 30 + 25 + 54 | 109 |
| **Tổng thô** | 193 | 253 | **446** |

446 Phúc Khí / ngày gấp đôi hiện tại → cần ngân sách ngày §5 để giữ tốc độ cấp và giá trị món.

---

## 4. Chỗ tiêu (sink)

### 4.1 Sink hiện có

8 món bán bằng Phúc Khí trong `cosmetics.js`, tổng **1.510**:

| Món | Ô | Bậc | Giá |
|---|---|---|---|
| `tram_go` Trâm Gỗ Đào | head | Phàm | 60 |
| `quat_giay` Quạt Giấy Thư Pháp | hand | Phàm | 90 |
| `kiem_go` Kiếm Gỗ Đào | back | Phàm | 120 |
| `khung_may` Tường Vân | frame | Linh | 180 |
| `y_bach` Bạch Y Thư Sinh | robe | Linh | 240 |
| `phat_tran` Phất Trần Bạch Vĩ | hand | Linh | 260 |
| `den_long_tay` Đăng Lung Dạ Hành | hand | Linh | 260 |
| `trail_may` Đằng Vân Bộ | trail | Linh | 300 |

**Chẩn đoán:** người chơi chăm (≈ 1.200 Phúc Khí / tuần, phần 03 §2) mua hết sau **9 ngày**. Sau đó Phúc Khí chỉ tăng, không có chỗ tiêu. Với lỗi PK-1, người chơi còn có lý do **không** tiêu. Đây là lỗi thiết kế lớn nhất của kinh tế hiện tại: Phúc Khí đang là **điểm số** chứ không phải **tiền**.

### 4.2 Sink dự kiến — tổng quan

| Nhóm sink | Mô tả | Mức tiêu / tháng (người chơi chăm) | Phần chi tiết |
|---|---|---|---|
| S1 · Món thẩm mỹ giá Phúc Khí | ≈ 35% món mới có giá Phúc Khí (hoặc giá kép Phúc Khí / Ngọc) | 1.500 – 3.000 | phần 05, 06 |
| S2 · Thân bộ ngũ hành bằng Phúc Khí | 4 món × 600 = 2.400 / bộ | một lần mỗi bộ | phần 01 §4.1, phần 04 §6 |
| S3 · Nhuộm màu | đổi màu phẩm phục, phụ kiện | 200 – 600 | §4.4 |
| S4 · Trà quý, điểm tâm ở Trà Thất | tiêu hao, chỉ hương vị và cảnh | 150 – 300 | §4.5 |
| S5 · Nhà riêng ở Huyền Thành | đất, xây, mở phòng, nội thất | 2.000 – 6.000 trong 3 tháng đầu, sau đó 500 – 1.500 | §4.6, phần 06 §6 |
| S6 · Xe trạm (đi nhanh giữa vùng) | phí đi xe khi chưa bay được | 100 – 400 | §4.7 |
| S7 · Trùng tu công trình chung | góp vật liệu cho mục tiêu toàn máy chủ | tùy người; trung bình 300 | §4.8 |
| S8 · Môn phái: góp vật liệu đạo tràng | đổi lấy «Cống Hiến» môn phái | 300 – 1.000 | §4.9 |
| S9 · Sao chép sách ở Thư Lâu | in bản chép tay đẹp của bài đã học (vật trang trí nhà) | 50 – 200 | §4.10 |
| S10 · Đèn, thuyền hoa đăng da (web) | da thẩm mỹ cho đèn thả, thưởng không đổi | 50 – 150 | phần 06 §3 |

Mục tiêu: người chơi chăm tiêu **70–90%** Phúc Khí kiếm được trong 30 ngày (chỉ số `PK_SINK_RATIO`, phần 10 §4).

### 4.3 Giá Phúc Khí của món thẩm mỹ

Quy đổi «công sức tương đương» giữa hai tiền **chỉ để định giá**, không phải tỷ giá trao đổi (không có trao đổi — phần 01 §5):

- Người chơi chăm kiếm ≈ 170 Phúc Khí / ngày (hiện tại) và ≈ 31 Ngọc / ngày miễn phí (220 / tuần từ điểm danh).
- Tỷ lệ công sức ≈ **5,5 Phúc Khí : 1 Ngọc**. Làm tròn và nghiêng về phía Phúc Khí để món Ngọc vẫn có lý do mua bằng tiền: **định giá kép = Ngọc × 7,5**, làm tròn tới 50.

| Giá Ngọc | Giá Phúc Khí kép | Ngày chơi chăm (170 / ngày) |
|---|---|---|
| 90 | 700 | 4,1 |
| 120 | 900 | 5,3 |
| 140 | 1.050 | 6,2 |
| 150 | 1.150 | 6,8 |
| 160 | 1.200 | 7,1 |
| 200 | 1.500 | 8,8 |
| 260 | 1.950 | 11,5 |
| 360 | 2.700 | 15,9 |

Không phải món nào cũng có giá kép. Quy tắc:

| Nhóm món | Giá kép? |
|---|---|
| Thân bộ ngũ hành | **bắt buộc** (Hợp mệnh phải có đường miễn phí) — giá thân bộ Phúc Khí cố định 600 / món, cả bộ 2.400 (rẻ hơn công thức 7,5× vì đây là quyền lợi gắn lá số) |
| Phàm, Linh | chỉ Phúc Khí (như hiện tại) |
| Huyền thường (không bộ) | 50% số món có giá kép |
| Tiên | 20% số món có giá kép |
| Thần | không (Thần luôn có điều kiện riêng: VIP, cấp, chuỗi, thành tựu) |
| Món mùa (Đạo Lộ) | không (nhận qua Đạo Lộ) |
| Món vùng (thánh địa) | ≥ 1 món Phúc Khí ở mỗi vùng, để người chưa trả tiền vẫn có kỷ niệm vùng |

### 4.4 Nhuộm màu (S3)

Phẩm phục đã có HSV `look.pri`, `look.acc` (`characters.js › tintMaterial`). Nhuộm cho phép đổi `acc` (đai, viền) trên mọi phẩm phục đã sở hữu, và đổi `pri` trên phẩm phục bậc ≤ Huyền.

| Việc | Giá | Ghi chú |
|---|---|---|
| Đổi màu đai (acc), chọn trong 24 màu chuẩn | 40 Phúc Khí | — |
| Đổi màu áo (pri), 24 màu chuẩn | 120 Phúc Khí | chỉ bậc ≤ Huyền; Tiên, Thần giữ màu gốc (nhận diện) |
| Màu «theo hành» (5 màu ngũ hành của `WX_GIATRI`) | 60 Phúc Khí | — |
| Trả về màu gốc | miễn phí | — |
| Bảng màu lễ (Tết đỏ, Vu Lan lam) | mở theo lễ, giá như trên | — |

Nhuộm **không** đổi bộ, không đổi Hợp mệnh. Nhuộm không bán bằng Ngọc (để giữ là sink Phúc Khí thuần).

### 4.5 Trà quý (S4)

`state.js › TEAS` có 4 trà mở theo ngưỡng. Thêm trà **tiêu hao**: mua một ấm, ngồi được một buổi, có hương vị riêng (chữ mô tả, màu nước, hơi bốc).

| Trà | Giá / ấm | Mở |
|---|---|---|
| Trà Sen, Lài, Ô Long, Shan Tuyết | miễn phí (giữ như hiện tại) | theo `xp` (sau sửa PK-1) |
| Trà Ướp Sen Tây Hồ | 30 | lễ Vu Lan |
| Phổ Nhĩ lâu năm | 40 | cấp 15 |
| Bạch Trà Phúc Đỉnh | 40 | cấp 15 |
| Long Tỉnh Tây Hồ | 50 | cấp 20 |
| Trà Đinh Tân Cương | 25 | — |
| Điểm tâm: bánh đậu xanh, bánh phu thê, chè kho | 10 – 20 / đĩa | — |

Trà quý **không** tăng Phúc Khí / phút (giữ 1 / phút), **không** tăng trần. Lý do mua: thẩm mỹ, mời bạn cùng bàn trong MMO (bạn cùng bàn thấy ấm và nhận một chén, không tốn gì).

### 4.6 Nhà riêng (S5)

Nhà riêng ở Huyền Thành (sơ đồ tổng §9.3) là sink lớn nhất và lâu dài nhất. Chi tiết SKU nội thất ở phần 06 §6. Phần Phúc Khí:

| Hạng mục | Giá Phúc Khí | Mở |
|---|---|---|
| Thuê gian nhà nhỏ (1 phòng) | miễn phí | MQ-1 (tài liệu 03 quyết định chương) |
| Mua đất nền phố Đông (nhà 3 gian) | 3.000 | cấp 15 |
| Xây nhà 3 gian | 2.500 | sau mua đất |
| Thêm gian (tối đa 5) | 1.500 / gian | — |
| Sân trước, sân sau | 1.200 mỗi sân | — |
| Ao nhỏ, hòn non bộ | 800 | — |
| Gác xép thư phòng | 2.000 | cấp 25 |
| Nội thất cơ bản (bộ bàn ghế, giường, kệ) | 80 – 300 / món | — |

Toàn bộ nhà đầy đủ ≈ 18.000 Phúc Khí ≈ 15 tuần của người chơi chăm sau khi trừ các tiêu khác. Nhà là **không gian riêng**, không có công năng tu (phần 01 §4.6 — điểm phong thủy chỉ phụ thuộc vị trí, không phụ thuộc món mua).

### 4.7 Xe trạm (S6)

Trước khi bay được (cấp 8 / VIP Ngự Vân, hoặc cảnh giới 3 cho Ngự Kiếm), người chơi đi bộ giữa vùng cách nhau 600–2.000 m. Xe trạm là tiện ích đi nhanh.

| Chặng | Giá |
|---|---|
| Huyền Thành ↔ 7 vùng sảnh nghề (`tubinh`, `manh`, …) | 10 |
| Huyền Thành ↔ thánh địa gần (Long Hổ, Võ Đang, Bút Tháp) | 25 |
| Huyền Thành ↔ thánh địa xa | 40 |
| Chặng có thánh địa khóa cảnh giới | không bán vé — phải đủ cảnh giới |

Khi người chơi đã bay được, xe trạm vẫn còn cho người thích ngắm cảnh, giá giữ nguyên. Xe trạm **không** có bản trả bằng Ngọc.

### 4.8 Trùng tu công trình chung (S7)

Mục tiêu toàn máy chủ: «Trùng tu cầu đá Huyền Thành», «Đào lại giếng làng Tử Bình». Người chơi góp **vật liệu** (mua bằng Phúc Khí ở chợ) và góp **sức** (hoạt động khuân đá, tài liệu 09).

| Cách góp | Được gì | Không được gì |
|---|---|---|
| Góp vật liệu (Phúc Khí) | tên trong bia ghi danh (tùy chọn), khung «Trùng Tu» khi mục tiêu xong | **không** công đức (phần 01 M3) |
| Góp sức (hoạt động) | công đức theo tài liệu 05 (`DEED-*`) | — |

Lý do tách: trong `remedy-fate › CONG_QUA`, làm cầu, đào giếng là việc công đức. Game giữ ý Liễu Phàm: **công đức đến từ việc làm**, không từ của cải đổi ra. Lời văn bia: «Bia ghi danh người góp vật liệu» — không dùng «công đức» trên bia.

### 4.9 Môn phái (S8)

Góp vật liệu xây đạo tràng (sơ đồ tổng §10) → điểm **Cống Hiến** của môn phái (tài liệu 10 định nghĩa). Kinh tế đặt luật: Cống Hiến từ Phúc Khí tối đa 50% tổng Cống Hiến một người trong tuần; 50% còn lại phải từ việc chung (D20). Lý do: không để người cày Phúc Khí (hoặc người có Hợp mệnh) mua vị trí trong môn phái.

### 4.10 Sao chép sách (S9)

Ở Thư Lâu Lâm, người chơi đã đọc một bài (Đạo Tạng, cổ thư — `daozang-data`, `library-data`) có thể đặt chép một bản tay để trưng ở nhà. 50 Phúc Khí / bản thường, 200 / bản đóng hộp gỗ. Bản chép **chỉ có tên bài, không chứa toàn văn kinh** (tránh T2); mở ra đọc thì dẫn về Tàng kinh các như bình thường.

---

## 5. Ngân sách ngày và chống lạm phát

### 5.1 Ngân sách ngày «Phúc mãn»

Khi nguồn dự kiến (§3) được bật, mỗi người chơi có **ngân sách Phúc Khí ngày**:

| Phần kiếm trong ngày | Hệ số |
|---|---|
| 0 – 250 | ×1,0 |
| 251 – 400 | ×0,5 |
| > 400 | ×0,2 |

- Tên trong game: «Phúc mãn tắc tổn» (phúc đầy thì vơi) — lời Thầy giải thích khi lần đầu chạm ngưỡng: «Hôm nay con đã nhận đủ. Việc làm tiếp vẫn có ý nghĩa của nó.» Đạo Hạnh (tài liệu 05) **không** bị ngân sách này giảm.
- Ngân sách **không** áp cho: nhiệm vụ chính / phụ một lần (D15, D16), Án Cổ (N10), thưởng Đạo Lộ (D21), lễ tiết (D17). Đây là thưởng một lần, không phải vòng lặp.
- Hợp mệnh nhân **trước** khi áp ngân sách.

Với người chơi chăm bản AAA (446 thô): 250 + 150 × 0,5 + 46 × 0,2 = **334 / ngày**.

### 5.2 Đo lạm phát

| Chỉ số | Cách tính | Ngưỡng báo động |
|---|---|---|
| `PK_SINK_RATIO_30D` | Phúc Khí tiêu / Phúc Khí kiếm, 30 ngày, trung vị người chơi hoạt động ≥ 20 ngày | < 0,5 |
| `PK_BALANCE_P90` | số dư bách phân vị 90 | > 30 ngày kiếm của nhóm đó |
| `PK_UNSPENT_CATALOG` | % người chơi đã mua hết mọi món Phúc Khí đang bán | > 25% |
| `PK_TIME_TO_SET` | trung vị số ngày từ cấp 5 tới khi có đủ thân bộ Hợp mệnh bằng Phúc Khí | < 10 hoặc > 35 |

### 5.3 Van điều chỉnh (theo thứ tự ưu tiên)

1. **Thêm sink thẩm mỹ** (món mới, nhuộm mùa) — luôn ưu tiên.
2. **Mở thêm nhà / sân** — sink lớn.
3. **Mục tiêu trùng tu toàn máy chủ** — sink tập thể, tạo sự kiện.
4. **Chỉnh ngân sách ngày** (§5.1) — chỉ chỉnh ngưỡng, báo trước 14 ngày, ghi «Sổ Quán».
5. **Không bao giờ:** giảm thưởng hiện có của người chơi đang chơi mà không báo; thu hồi Phúc Khí; áp «thuế» số dư; cho Phúc Khí hết hạn.

### 5.4 Giảm phát — có thể xảy ra không?

Nếu sink quá mạnh (nhà, trùng tu), người mới thấy giá cao và nản. Chặn bằng:

- giá món Phúc Khí **không** tăng theo thời gian (không có «lạm phát giá»);
- món cơ bản Phàm / Linh luôn có ở mức 60–300;
- nhà riêng có bản thuê miễn phí;
- trùng tu tự nguyện, không bắt buộc cho bất kỳ nhiệm vụ nào.

---

## 6. Ca biên

| Ca | Hành vi đúng |
|---|---|
| Người chơi đổi máy, chưa có tài khoản máy chủ | Phúc Khí ở `localStorage` (`KEY = 'huyenquan:v1'`); khi liên kết tài khoản lần đầu, máy chủ nhận số dư cục bộ **một lần**, tối đa trần di trú (phần 09 §5.6) |
| Hai máy cùng tài khoản cùng nhận thưởng ngày | máy chủ là nguồn sự thật; thưởng ngày khóa theo `(account, economyDay, key)` |
| Đổi ngày giữa phiên (23:59 → 00:00) | `rollDay` chạy trước mỗi hành động (đúng code); máy chủ dùng thời điểm **ghi nhận** của máy chủ |
| Người chơi đi du lịch đổi múi giờ | ngày kinh tế theo múi giờ tài khoản (§1.1 PK-3), không theo máy |
| `state` hỏng (`hydrate` ném lỗi) | code giữ bản hỏng ở `KEY + ':corrupt'` và tạo mới — mất Phúc Khí cục bộ. Khi có máy chủ: khôi phục từ máy chủ |
| Phúc Khí âm | không thể qua `buy` (kiểm `s.phucKhi < price`); máy chủ từ chối giao dịch làm số dư âm |
| Hợp mệnh bật giữa ngày | áp cho án **sau** khi mặc đủ bộ; không truy thu án trước |
| Người chơi tháo bộ ngay sau khi nhận thưởng | hợp lệ — thưởng tính tại thời điểm ghi án |
| Dụng thần thay đổi khi sửa ngày giờ sinh | `setBonus` đọc `yong.primary` mới; bộ cũ hết Hợp mệnh, không hoàn tiền (thông báo rõ trước khi xác nhận sửa ngày giờ sinh) |
| iOS không có xăm, hoa đăng, đèn Thái Tuế | trần ngày thấp hơn 15 (§2.2); bù bằng nguồn dự kiến D1–D9 (đều chạy được trên iOS) |

---

## 7. Lộ trình kỹ thuật cho Phúc Khí (đề nghị cho tài liệu 13)

| Bước | Việc | Phụ thuộc |
|---|---|---|
| 1 | Sửa PK-1: `titleFor` và trà đọc `xp` | không |
| 2 | Sửa PK-2: khóa `grantChart` theo băm lá số | không |
| 3 | Thêm giá Phúc Khí cho thân bộ, bình giá bộ (phần 04 §6) | `cosmetics.js` |
| 4 | Thêm nhuộm, trà tiêu hao | `characters.js › tintMaterial`, `stations.js` |
| 5 | Sổ cái Phúc Khí trên máy chủ (cùng sổ Ngọc, phần 09 §5) | tài khoản |
| 6 | Ngân sách ngày §5.1 | bước 5 (phải tính trên máy chủ) |
| 7 | Nhà riêng, xe trạm, trùng tu, môn phái | tài liệu 06, 08, 10 |

---

## 8. Checklist nghiệm thu phần 02

- [ ] Bảng §2.1 khớp `state.js` (test so `REWARD`, `CAPS`, `CASE_REWARD`, `DESK_REWARD`, `LAMP_REWARD` với tài liệu — đổi code thì đổi tài liệu).
- [ ] Danh xưng, trà dùng `xp`; mua món không làm đổi danh xưng (test).
- [ ] Xóa / thêm lại cùng lá số không nhận thêm Phúc Khí (test).
- [ ] Đổi đồng hồ máy không nhận lại thưởng ngày khi đã có máy chủ (test tích hợp).
- [ ] `PK_SINK_RATIO_30D` được ghi trong bảng điều khiển phần 10.
- [ ] Mọi thân bộ có giá Phúc Khí 600.
- [ ] Không nguồn Phúc Khí nào phụ thuộc kết quả bói tốt / xấu.
- [ ] Không chỗ tiêu Phúc Khí nào cho công đức hoặc Đạo Hạnh.
