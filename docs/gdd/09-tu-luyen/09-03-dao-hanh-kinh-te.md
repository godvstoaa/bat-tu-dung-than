# 09-03 · Đạo Hạnh — kinh tế tu luyện, hệ số, trần và khung chung mini-game

> Phần này **chốt mọi con số** mà các phần khác của tài liệu 09 dùng: đơn vị điểm, công thức quy đổi, hệ số Nghịch Thiên, hợp Dụng, trần ngày, bảng chủ của 24 mini-game, Đạo Hạnh cho các hoạt động đã có trong code, nguồn một lần, mất Đạo Hạnh và khung spec chung cho mọi `MG-xx`.
> Nếu số ở phần khác lệch với phần này thì **phần này đúng**.
> Kết quả mô phỏng nhịp lên cảnh giới nằm ở `09-10-bang-tinh-mo-phong.md`; công thức Nguyên Khí nằm ở `09-09-vong-choi.md` §5.

---

## 1. Nguyên tắc kinh tế (không được vi phạm)

| # | Nguyên tắc | Lý do (trụ cột) | Hệ quả thiết kế |
|---|---|---|---|
| E1 | Đạo Hạnh **không mua được**, không quy đổi từ Ngọc, không từ VIP | T6, canon §7, `anti-manipulation-data` RB5 | VIP chỉ mở sớm gia trì thẩm mỹ; mọi hệ số ĐH bỏ qua cờ `vip` |
| E2 | Lá số thấp tu nhanh hơn (hệ số Nghịch Thiên), lá số cao đi trước một đoạn ngắn (Tiềm Lực × 0,4 ở bậc 1–3) | T2 | Bảng Thiên Bảng Đạo Hạnh nghiêng về người chăm, không về người «sinh ra đã tốt» |
| E3 | **Bói không sinh Đạo Hạnh.** Xin xăm, gieo quẻ, xem Vận Mệnh Các, xem vận hạn bản thân chỉ cho Phúc Khí như hiện tại | T2 «mệnh do ta tạo»; đồng thời bản iOS (tắt bói) không thiệt Đạo Hạnh | Không có hoạt động bói nào trong bảng §6 – §7 cho ĐH |
| E4 | Trần ngày tính trên **điểm thô** (trước hệ số), nên hệ số Nghịch Thiên luôn có nghĩa kể cả khi chạm trần | T2 | Người TL 20 chạm trần vẫn nhận ×1,4 |
| E5 | Không phạt nặng khi nghỉ chơi: cảnh giới không bao giờ tụt; chuỗi ngày là «chuỗi mềm» | sức khỏe người chơi, chống FOMO | §10 mất ĐH chỉ do hành vi (phạm giới), không do vắng mặt |
| E6 | Trợ năng (accessibility) **không làm giảm** Đạo Hạnh | công bằng | Trợ năng chỉ đổi huy hiệu «Không trợ lực» thuần thẩm mỹ |
| E7 | Mọi điểm chấm do **logic thuần dùng chung client + máy chủ** (như `cases.js › gradeAnswers`) | T5, chống gian | Mỗi MG có module chấm thuần, test bằng node |
| E8 | Đạo Hạnh tăng cảnh giới, **không tăng sức mạnh chiến đấu** (không có chiến đấu) | T3 | Cảnh giới mở nơi chốn, khả năng đi lại, nghi lễ, thẩm mỹ, quyền dạy đệ tử |

---

## 2. Đơn vị và công thức gốc

### 2.1 Bốn đơn vị

| Đơn vị | Ký hiệu | Lưu ở | Ý nghĩa | Hiện cho người chơi? |
|---|---|---|---|---|
| Điểm tu thô | **thô** | tạm trong lượt chơi | điểm của một lượt hoạt động **trước** mọi hệ số người chơi | có, trong bảng kết quả lượt («Tu được 6,3 điểm») |
| Đạo Hạnh | **ĐH** | `state.tu.daoHanh` (chưa có — cần làm), máy chủ giữ bản gốc | Hậu Thiên tích lũy; quyết định cảnh giới bậc ≥ 4 và Thiên Bảng | có, số nguyên |
| Phúc Khí | — | `state.phucKhi`, `state.xp` (đã có) | tiền tiêu trong game + cấp hoạt động (`progress.js › levelOf`) | có |
| Công | — | Sổ Công Quá (tài liệu 05, `remedy-fate › CONG_QUA`) | công đức; mốc Liễu Phàm 300 / 600 / 1.000 | có |

### 2.2 Công thức một lượt

```
thô   = B × f(s) × K_lặp × K_hư
nhận  = min(thô, TRẦN_NGÀY(bậc) − đãDùngTrần)        (chỉ với hoạt động «trong trần»)
ĐH    = nhận × NT × K_dụng × K_sung
PhúcKhí += round(thô × 0,5)                             (cộng vào state.xp như mọi Phúc Khí)
```

| Ký hiệu | Định nghĩa | Miền |
|---|---|---|
| `B` | điểm thô tối đa của một lượt (bảng §6) | 1 – 40 |
| `s` | điểm chấm lượt chơi do module chấm thuần trả về | 0 – 1 |
| `f(s)` | `0,3 + 0,7·s` nếu `s ≥ s_min`; `0,15` nếu dưới ngưỡng (vẫn có công tập luyện) | 0,15 – 1 |
| `s_min` | ngưỡng đạt của từng MG (mặc định 0,4; MG khai báo riêng) | 0 – 1 |
| `K_lặp` | lượt thứ 1–3 của **cùng MG trong ngày**: 1,0 · lượt 4–5: 0,5 · lượt ≥ 6: 0,1 | 0,1 – 1 |
| `K_hư` | theo Nguyên Khí lúc bắt đầu lượt: ≥ 30 → 1,0 · 10–29 → 0,8 · không đủ chi phí NK → 0,25 | 0,25 – 1 |
| `TRẦN_NGÀY` | trần điểm thô trong ngày, theo bậc cảnh giới (§5) | 25 – 40 |
| `NT` | hệ số Nghịch Thiên `clamp(1 + (60 − TL)/100, 1,0, 1,5)` (canon) | 1,0 – 1,5 |
| `K_dụng` | 1,10 nếu đạo thống của nơi chơi có hành = Dụng thần (`yong.primary`); 1,05 nếu = Hỷ thần (`yong.xi`); còn lại 1,0 | 1,0 – 1,1 |
| `K_sung` | 1,10 nếu Nguyên Khí lúc bắt đầu lượt ≥ 70 («Sung Mãn»), còn lại 1,0 | 1,0 – 1,1 |

**Làm tròn.** Máy chủ lưu ĐH dạng số nguyên ×10 (một chữ số thập phân), hiện cho người chơi phần nguyên. Thô hiện một chữ số thập phân. Phúc Khí làm tròn nửa lên.

**Hoạt động ngoài trần** (Nhật Khóa, việc tuần, Sóc Vọng, lễ tiết, cốt truyện, chuỗi đạo thống, độ kiếp, công): `nhận = thô` (không trừ trần), vẫn nhân `NT`, `K_dụng` (nếu có đạo thống), `K_sung` (chỉ với lượt có chơi thật).

### 2.3 Ví dụ tính tay

**Ví dụ 1 — `MAU-A` tĩnh tọa ở Võ Đang.** `MAU-A`: Tiềm Lực 41 → `NT = 1 + 19/100 = 1,19`. Dụng Thủy; Võ Đang thuộc Thanh Vi · Đan Đỉnh, hành Thủy (§4) → `K_dụng = 1,10`. Nguyên Khí đầu lượt 74 → `K_sung = 1,10`.
Lượt `MG-01` 10 phút, `B = 10`, điểm `s = 0,82` → `f = 0,3 + 0,574 = 0,874`. Lượt đầu trong ngày → `K_lặp = 1`; NK 74 → `K_hư = 1`.
`thô = 10 × 0,874 = 8,74`. Trần bậc 2 là 30, đã dùng 12 → nhận đủ 8,74.
`ĐH = 8,74 × 1,19 × 1,10 × 1,10 = 12,58` → lưu 125,8 (×10), hiện +12.
Phúc Khí `round(8,74 × 0,5) = 4`.

**Ví dụ 2 — cùng lượt, người TL 85 không hợp Dụng, NK 50.** `NT = 1`, `K_dụng = 1`, `K_sung = 1` → `ĐH = 8,74`. Người `MAU-A` nhận gấp 1,44 lần cho cùng một lượt chơi.

**Ví dụ 3 — lượt thứ 6 trong ngày khi kiệt sức.** `MG-04` Thái Cực, `B = 5`, `s = 0,9` → `f = 0,93`; `K_lặp = 0,1`; NK 3 < chi phí 6 → `K_hư = 0,25`.
`thô = 5 × 0,93 × 0,1 × 0,25 = 0,116`. Gần như không có ĐH; giao diện nhắc: «Khí đã cạn, ngồi một chén trà rồi tập tiếp sẽ đều tay hơn.»

**Ví dụ 4 — trần chặn giữa lượt.** Trần còn 2,4; lượt kết phù được thô 5,8 → nhận 2,4; 3,4 điểm còn lại **không mất trắng** mà ghi vào «Dư Hương» (§5.3).

---

## 3. Hệ số Nghịch Thiên (NT) và lợi thế khởi điểm

### 3.1 Bảng NT theo Tiềm Lực

| Tiềm Lực (TL) | NT | Khởi điểm bậc 1–3 (0,4 × TL) | Phẩm căn (`synthesis.gradeVi`) |
|---|---|---|---|
| 0 – 10 | 1,50 | 0 – 4 | Phàm Căn |
| 15 | 1,45 | 6 | Phàm Căn |
| 20 | 1,40 | 8 | Phàm Căn |
| 25 | 1,35 | 10 | Phàm Căn |
| 28 | 1,32 | 11,2 | Ngũ Linh Căn (ngưỡng) |
| 30 | 1,30 | 12 | Ngũ Linh Căn |
| 36 | 1,24 | 14,4 | Tứ Linh Căn (ngưỡng) |
| 40 | 1,20 | 16 | Tứ Linh Căn |
| 41 (`MAU-A`) | 1,19 | 16,4 | Tứ Linh Căn |
| 43 | 1,17 | 17,2 | Tứ Linh Căn thuận |
| 50 | 1,10 | 20 | Tam Linh Căn |
| 58 | 1,02 | 23,2 | Tam Linh Căn thượng |
| 60 | 1,00 | 24 | Tam Linh Căn thượng |
| 66 – 79 | 1,00 | 26,4 – 31,6 | Song Linh Căn (thượng) |
| 80 – 85 | 1,00 | 32 – 34 | Dị Linh Căn |
| 86 – 100 | 1,00 | 34,4 – 40 | Thiên Linh Căn |

### 3.2 Điểm thô cần để chạm từng ngưỡng (chưa tính thưởng độ kiếp)

Bậc 2–3 so `0,4·TL + ĐH` với ngưỡng; bậc ≥ 4 chỉ so ĐH. Thô cần = ĐH cần ÷ NT (bỏ qua `K_dụng`, `K_sung`).

| TL | NT | Thô cần bậc 2 (ĐCG 100) | Thô cần bậc 3 (ĐCG 400) | Thô cần bậc 4 (ĐH 1.000) | Thô cần bậc 5 (ĐH 2.200) | Thô cần bậc 6 (ĐH 4.500) |
|---|---|---|---|---|---|---|
| 20 | 1,40 | 66 | 280 | 714 | 1.571 | 3.214 |
| 40 | 1,20 | 70 | 320 | 833 | 1.833 | 3.750 |
| 60 | 1,00 | 76 | 376 | 1.000 | 2.200 | 4.500 |
| 85 | 1,00 | 66 | 366 | 1.000 | 2.200 | 4.500 |

**Đọc bảng.** Ở bậc 2, người TL 20 và TL 85 cần **đúng cùng 66 điểm thô** — «điểm xuất phát công bằng» là một sự trùng hợp có chủ đích của canon (0,4 và hệ số 1/100). Từ bậc 3 trở đi người lá số thấp đi trước; tới bậc 6, người TL 20 cần ít hơn người TL 60 khoảng 29% công sức thô. Thời gian thực tế xem `09-10` §2 (nhịp bị hãm bởi trần ngày và «ngày củng cố» nên chênh lệch theo lịch nhỏ hơn chênh lệch công sức).

### 3.3 Câu dẫn bắt buộc khi hiện NT

Màn hình Sổ Tu (UI do tài liệu 12 vẽ) hiện NT kèm một câu, chọn theo khoảng:

| NT | Câu |
|---|---|
| ≥ 1,30 | «Hạt giống nhỏ thì người làm vườn phải cúi xuống nhiều hơn. Mỗi lần cúi, đất đáp lại gấp bội.» |
| 1,10 – 1,29 | «Gốc vừa phải. Đạo không hỏi gốc, chỉ hỏi người có tưới hay không.» |
| 1,01 – 1,09 | «Gốc đã tốt. Giữ cho tốt còn khó hơn làm cho tốt.» |
| 1,00 | «Trời cho nhiều thì đòi nhiều. Đi trước một bước, nhưng đường còn dài như nhau.» |

Câu chung (canon §4.7) luôn hiện lần đầu: «Lá số là hạt giống, không phải cái cây…».

---

## 4. Hợp Dụng — hành của từng đạo thống

Canon: đạo thống hợp Dụng thần được +10%, theo tinh thần `daozang-data › _YONG2CULT` (hành → pháp tu). `_YONG2CULT` ánh xạ **hành → pháp tu**, chưa ánh xạ **hành → đạo thống**; tài liệu này chốt ánh xạ dưới đây, mỗi hành đúng hai đạo thống để không hành nào thiệt.

| Đạo thống | Mã trong tài liệu 09 | Thánh địa / phân đàn | Hành | Căn cứ từ `_YONG2CULT` và cổ pháp |
|---|---|---|---|---|
| Chính Nhất (+ Thần Tiêu) | `CN` | `longho` | **Hỏa** | Hỏa: «thần chú, kim quang, tồn thần»; phù lục và lôi pháp là pháp «quang minh» |
| Thanh Vi · Đan Đỉnh | `TV` | `vodang` | **Thủy** | Thủy: «tĩnh tọa, thai tức, tàng tinh»; Võ Đang thờ Huyền Vũ — thần phương Bắc, hành Thủy |
| Toàn Chân · Linh Bảo | `TC` | `chungnam`; phân đàn: Huyền Quán Sơn Môn | **Thổ** | Thổ: «nội đan trung cung, tĩnh tọa, tín thực (信)»; giới luật là chữ Tín |
| Thượng Thanh · Lư Sơn | `TT` | `maoshan`; phân đàn: Trích Thiên Đỉnh | **Kim** | Kim: «điều tức, nội quán, nghĩa khí (义)»; tồn tư nội quán, trừ tà chính tông là việc nghĩa |
| Bắc Đế · Động Uyên | `BD` | `phongdo`; phân đàn: Thái Tuế Điện (web) / Thư Lâu Đạo Tạng các (iOS) | **Thủy** | Bắc Đế là thần phương Bắc; Thủy «tàng» |
| Thiền (Trúc Lâm) | `TH` | `yentu` | **Mộc** | Mộc: «thiền hành tẩu, nhân từ (仁)»; rừng trúc Yên Tử |
| Tịnh Độ · sám hối | `TD` | `buttap`; phân đàn: Cùng Thông Hồ | **Kim** | Tây phương Cực Lạc; Kim = Tây |
| Mật (Chuẩn Đề) | `MT` | `tangdia`; phân đàn: Am Vân Cốc | **Thổ** | mạn-đà-la là «trung tâm», đất cát; Thổ = trung cung |
| Nho · Tịnh Minh | `NH` | `vanmieu`; phân đàn: Thư Lâu Lâm | **Mộc** | Mộc = Nhân (仁); sao Văn Xương Tứ Lục thuộc Mộc (`xuankong › STAR[4]`) |
| Bàng môn (Vu y) | — | `mieucuong` | không | không phải đạo thống chính; không có thang cảnh giới riêng (§4.2) |

**Ví dụ `MAU-A`** (Dụng Thủy, Hỷ Kim): hợp Dụng ×1,10 khi tu ở Võ Đang (`TV`) và Phong Đô / Thái Tuế Điện (`BD`); hợp Hỷ ×1,05 ở Mao Sơn (`TT`) và Bút Tháp (`TD`).

### 4.1 Hành của hoạt động đa nơi

Hoạt động chơi được ở nhiều nơi (vd tụng kinh) lấy **đạo thống của nơi chơi**. Hoạt động ở nơi trung lập (Huyền Thành, Lịch Đường, Phong Thủy Viên…) không có `K_dụng`.

### 4.2 Bàng môn

Bàng môn là đối trọng (Tà Lộ / Vu y) chứ không phải con đường cảnh giới. Hoạt động y dược ở Miêu Cương cho ĐH như hoạt động trung lập, không tính vào «Tu độ đạo thống», không chọn làm đạo thống chính. Lý do: canon §5.6 ghi «Tăng chỉ số: —» cho Bàng môn và «9 con đường».

---

## 5. Trần ngày, dư hương và nguồn ngoài trần

### 5.1 Trần ngày theo bậc

| Bậc | Tên Đạo / Phật / Nho | `TRẦN_NGÀY` (thô) | Ghi chú |
|---|---|---|---|
| 1 | Phàm Nhân / Tín Tâm / Học Trò | 25 | đủ cho ≈ 30 phút hoạt động |
| 2 | Nhập Môn / Quy Y / Sĩ | 30 | |
| 3 | Luyện Tinh Hóa Khí / Trì Giới / Quân Tử | 32 | |
| 4 | Luyện Khí Hóa Thần / Định / Hiền Nhân | 35 | |
| 5 | Luyện Thần Hoàn Hư / Tuệ / Đại Nho | 38 | |
| 6 | Luyện Hư Hợp Đạo / Giải Thoát / Thánh Hiền | 40 | |

Ngày tính theo **giờ địa phương của người chơi, đổi ngày lúc 00:00** như `state.js › rollDay`. Máy chủ giữ ngày của tài khoản theo múi giờ khai báo lần đầu; đổi múi giờ quá 1 lần / 30 ngày thì giữ múi cũ (chống nhảy múi để lấy hai trần).

### 5.2 Vì sao trần thấp như vậy

- Người chơi «đều đặn» (≈ 32 phút mini-game / ngày) chạm khoảng 80% trần — trần chỉ chặn người cày dài.
- Phần lớn Đạo Hạnh của người chơi lâu năm đến từ **ngoài trần** (Nhật Khóa, việc tuần, lễ, cốt truyện) → khuyến khích đều đặn hơn là cày.
- Bậc cao tăng trần ít (25 → 40) trong khi khoảng cách ngưỡng tăng mạnh (100 → 2.300) → bậc 5–6 là chuyện **tháng**, không phải ngày (xem `09-10`).

### 5.3 Dư Hương (phần vượt trần)

Thô vượt trần **không mất**: đổ vào bình «Dư Hương» (tối đa 20 thô). Mỗi sáng lúc đổi ngày, `min(Dư Hương, 10)` được chuyển thành thô **ngoài trần** của ngày mới, phần còn lại giữ. Người chơi thấy một làn hương nhỏ bay lên từ lư hương ở nhà riêng khi Dư Hương được nhận.

Công thức:
```
sáng ngày N:  chuyển = min(DuHuong, 10);  DuHuong -= chuyển;  ngoaiTran += chuyển
trong ngày:   DuHuong = min(20, DuHuong + max(0, thô − trầnCònLại))
```
Ý nghĩa: hôm nay chơi dài không vô ích, nhưng lợi ích bị trải ra — người bận hôm sau vẫn có chút tiến bộ.

### 5.4 Nguồn ngoài trần (định kỳ)

| Nguồn | Thô | Nhịp | Điều kiện | Chi tiết ở |
|---|---|---|---|---|
| Nhật Khóa (3 việc thuộc 3 nhóm pháp môn khác nhau) | 6 + `min(4, ⌊chuỗi/7⌋)` | ngày | bậc ≥ 1 | `09-09` §3 |
| Dư Hương chuyển sang | ≤ 10 | ngày | có Dư Hương | §5.3 |
| Lễ tuần đạo tràng (`ACT-041` …) | 15 | tuần | đã vào môn phái | `09-08` |
| Hội thí (`MG-03`) | ≤ 20 | tuần | bậc ≥ 3 | `09-04` MG-03 |
| Chương Mệnh Đồ tuần | 20 | tuần | tài liệu 05 chốt | tài liệu 05 |
| Đồng tu tuần (5 người cùng tĩnh tọa ≥ 10 phút) | 5 | tuần | MMO | `09-08` |
| Sóc (mùng 1 âm lịch) | 15 | tháng âm | | `09-09` §4 |
| Vọng (Rằm) | 15 | tháng âm | | `09-09` §4 |
| Đình thí (`MG-03`) | ≤ 40 | tháng âm | bậc ≥ 4 | `09-04` MG-03 |
| Lễ tiết lớn (`EV-*`, tài liệu 10) | ≈ 30 / lễ, ≈ 240 / năm | năm | | tài liệu 10 |

**Trần tuần ngoài trần ngày:** tổng nguồn «tuần» ≤ 60 thô / tuần lịch (thứ Hai 00:00 → Chủ nhật 23:59).

---

## 6. Bảng chủ 24 mini-game

Cột: **Nhóm** = nhóm pháp môn để tính Nhật Khóa (Tĩnh · Thân · Học · Nghệ · Lễ · Hạnh). **Đạo** = đạo thống quyết định `K_dụng` (theo nơi chơi). **B** = thô tối đa / lượt. **NK** = Nguyên Khí tiêu (số âm = hồi). **Mở** = bậc cảnh giới tối thiểu (có thể sớm hơn nếu là đạo thống chính — `09-01` §6.3). **iOS**: ✓ có · ✎ có, đổi nội dung · ✗ tắt.

| Mã | Tên | Nhóm | Đạo (nơi chơi) | Mở | Phút | B | NK | `s_min` | Engine dạy / chấm | iOS |
|---|---|---|---|---|---|---|---|---|---|---|
| `MG-01` | Tĩnh Tọa Hồi Tức (vòng hơi thở) | Tĩnh | TV (Võ Đang), TC (Trà Thất Sơn Môn), TH (Yên Tử) | 1 | 3–15 | 1 / phút, ≤ 15 | −2 / phút (hồi) | 0,4 | `cultivation-data › GONG_TUNA, GONG_CUNXIANG`, `remedy-fate › DAO_JIA[2]` | ✓ |
| `MG-02` | Kết Phù Ngũ Bộ | Nghệ | CN (Long Hổ), TT (Mao Sơn) | 2 | 4 | 6 | 8 | 0,5 | `talisman-data` (`structure.head/body/belly/core/foot`), ký tự hư cấu | ✎ |
| `MG-03` | Khoa Cử Tam Trường | Học | NH (Thư Lâu → Văn Miếu) | 1 | 8 / 12 / 20 | 8 · 20 · 40 | 10 / 15 / 20 | 0,5 | `library-data › LIBRARY`, `kb › DITIANSUI_MAXIMS`, `cases.js`, `halls.js` | ✓ |
| `MG-04` | Thái Cực Vân Thủ (nhịp) | Thân | TV (Võ Đang), TC (sân Sơn Môn) | 1 | 4 | 5 | 6 | 0,4 | `cultivation-data › GONG_DAOYIN` | ✓ |
| `MG-05` | Mạn-đà-la Cát (dựng rồi xóa) | Lễ | MT (Am Vân Cốc khay nhỏ; Tạng Địa đàn lớn) | 3 | 10 | 10 | 10 | 0,5 | (mới), `remedy-fate › ZHUNTI` để giảng | ✓ |
| `MG-06` | Tụng Kinh · Lạy Nhịp | Lễ | TD (Bút Tháp), TC (Chung Nam), TH (Yên Tử), Sơn Môn chính điện (TC) | 1 | 5 | 6 | 5 | 0,4 | `remedy-fate › CHAN_HUI, JING_ZHOU, DAO_JIA[0]` | ✓ |
| `MG-07` | Bốc Thuốc Ngũ Hành | Học | TV (dược phòng Võ Đang); trung lập (Huyền Thành, Miêu Cương) | 1 | 6 | 7 | 6 | 0,5 | `tcm › WUX_ZANG, DIET, bodyConstitution` | ✓ |
| `MG-08` | Bố Trí Dương Trạch (sửa nhà) | Nghệ | trung lập (nhà riêng, Phong Thủy Viên) | 1 | 8 | 8 | 8 | 0,5 | `zhai › computeZhai`, `xuankong › yearFlyingStar`, `fs-cure › SHA_LIST`, `dz-case.js` | ✓ |
| `MG-09` | Trạch Nhật Khai Đàn (chọn ngày lễ) | Học | trung lập (Lịch Đường); CN khi chọn ngày bái Đẩu | 1 | 5 | 6 | 5 | 0,5 | `zheri › evaluateDate, findGoodDates`, `zheri-case.js` | ✓ |
| `MG-10` | Đặt Đạo Hiệu | Học | NH (Thư Lâu, Văn Miếu) | 2 | 6 | 6 | 5 | 0,5 | `naming › analyzeName, fiveGrid, STROKES_81` | ✓ |
| `MG-11` | Công Án Vấn Đáp (AI dẫn) | Tĩnh | TH (Yên Tử) | 2 | 5–15 | 8 | 4 | — (không chấm đúng sai) | persona `truclam_thiensu`, `checkNeo` | ✎ (không AI) |
| `MG-12` | Thư Pháp Lâm Thiếp | Nghệ | NH (Văn Miếu, Thư Lâu), TC (thư phòng Sơn Môn) | 1 | 4 | 5 | 5 | 0,4 | `remedy-fate › REMEDY_QUOTES, TEN_THIEN`, `kb › DITIANSUI_MAXIMS` | ✓ |
| `MG-13` | Hái Thuốc Tứ Thời | Thân | theo vùng hái (TV ở Võ Đang, trung lập nơi khác) | 1 | tự do | 1 / cây, ≤ 6 cây / ngày | 1 / cây | — | `tcm › WUX_ZANG[].season, seasonalHealth, MERIDIAN_CLOCK` | ✓ |
| `MG-14` | Pha Trà Thất Bộ | Tĩnh | TC (Trà Thất Sơn Môn), TH (trà thất Yên Tử) | 1 | 3 | 4 | −10 (hồi) | 0,3 | `state.js › TEAS, addTeaMinutes` (đã có) | ✓ |
| `MG-15` | Luyện Đan Cửu Chuyển (hư cấu) | Nghệ | TV (lò đan Võ Đang) | 3 | 10 | 9 | 12 | 0,5 | `cultivation-data › DAN_CANTONG_QI` (giảng ý «Càn Khôn đỉnh lô, Khảm Ly dược vật»), dược liệu hư cấu | ✓ |
| `MG-16` | Thả Đèn Hoa Đăng | Lễ | TD (Cùng Thông Hồ), trung lập (Hồ Sen Sơn Môn) | 1 | 2 | 2 | 0 | — | `state.js › addLantern` (đã có) | ✗ |
| `MG-17` | Thần Chung Mộ Cổ (chuông giờ) | Lễ | TC (lầu chuông Sơn Môn), TH (Chùa Đồng Yên Tử) | 1 | 3 | 3 | 3 | 0,4 | `tcm › MERIDIAN_CLOCK` (canh giờ), tập tục «sớm chuông chiều trống» | ✓ |
| `MG-18` | Họa Luân Mạn-đà-la (vẽ đối xứng) | Nghệ | MT (Am Vân Cốc, Tạng Địa); trung lập (Huyền Thành) | 1 | 5–10 | 5 | 4 | — (sáng tác, chấm hoàn thành) | `progress.js › WX_GIATRI` (bảng màu ngũ hành) | ✓ |
| `MG-19` | Bái Đẩu Thất Tinh Đăng | Lễ | CN (Long Hổ), BD (Thái Tuế Điện) | 2 | 5 | 6 | 5 | 0,5 | `talisman-data › FU_ZHENGYI_BEIDOU` (giảng ý nghĩa, không vẽ phù) | ✎ |
| `MG-20` | Kinh Hành Bậc Đá (thiền hành) | Thân | TH (đường lên Chùa Đồng), TC (bậc Sơn Môn) | 1 | 5–12 | 0,8 / phút, ≤ 10 | 4 | 0,4 | `remedy-fate › GAI_XIN` (5 bước giác–đình–chuyển–tịnh–hóa) | ✓ |
| `MG-21` | Phóng Sinh Đúng Pháp | Hạnh | TD (ao Bút Tháp, Cùng Thông Hồ) | 2 | 4 | 5 (+ công) | 3 | 0,6 | `remedy-fate › CONG_QUA.thien[0], REMEDY_METHODS[2]` | ✓ |
| `MG-22` | Đối Chất Định Mệnh Hội | Hạnh | trung lập (quầy «đổi mệnh» mọi vùng) | 2 | 6 | 8 (+ công) | 8 | 0,5 | `chart › analyze`, `thaitue.js`, `anti-manipulation-data` | ✓ (chỉ lá số NPC) |
| `MG-23` | Sổ Nghiệp Giải Oan | Hạnh | BD (Phong Đô) | 4\* | 8 | 8 | 8 | 0,5 | `remedy-fate › YEGUO, CHAN_HUI, JING_ZHOU, CHANHUI_PRINCIPLE` | ✓ |
| `MG-24` | Tam Chẩn Cứu Người | Hạnh | TT (Mao Sơn, làng quanh vùng) | 4\* | 10 | 12 | 12 | 0,5 | `tcm › analyzeHealth`, `fs-cure › findCure`, `amta-data` (bật tự nguyện) | ✎ (bỏ lớp âm tà) |

\* `MG-23` mở bậc 5 với người chơi chung, bậc 4 với người chọn `BD` làm đạo thống chính; `MG-24` mở bậc 4, bậc 3 với người chọn `TT`.

**Nhịp tham chiếu:** mọi MG được cân để **≈ 1 thô / phút** khi chơi tốt (`s ≈ 0,8`, `f ≈ 0,86`). Hai ngoại lệ có chủ đích: `MG-13` hái thuốc (đi lại tốn thời gian, 1 thô / cây) và `MG-14` pha trà (thô thấp nhưng hồi Nguyên Khí).

### 6.1 Phân bố nhóm pháp môn (để Nhật Khóa luôn chọn được 3 nhóm ở bậc 1)

| Nhóm | Mini-game mở từ bậc 1 | Mini-game mở bậc 2–4 |
|---|---|---|
| Tĩnh | `MG-01`, `MG-14` | `MG-11` |
| Thân | `MG-04`, `MG-13`, `MG-20` | — |
| Học | `MG-03`, `MG-07`, `MG-09` | `MG-10` |
| Nghệ | `MG-08`, `MG-12`, `MG-18` | `MG-02`, `MG-15` |
| Lễ | `MG-06`, `MG-16`, `MG-17` | `MG-05`, `MG-19` |
| Hạnh | (giải án khách — §7) | `MG-21`, `MG-22`, `MG-23`, `MG-24` |

Bậc 1 có đủ 6 nhóm (Hạnh dùng giải án khách — giúp người khác hiểu lá số là việc thiện trong game).

---

## 7. Đạo Hạnh cho hoạt động đã có trong code

Không đổi số Phúc Khí đang có (`state.js › REWARD, CASE_REWARD, DESK_REWARD, LAMP_REWARD`), chỉ **thêm** thô.

| Hoạt động (code) | Phúc Khí hiện có | Thô thêm | Trong trần? | Nhóm | Ghi chú |
|---|---|---|---|---|---|
| Giải án khách `recordCase({kind:'npc'})`, ≤ 3 / ngày | `15 × total` | `B = 5`, `s = total` | có | Hạnh | lượt 1–3 không bị `K_lặp` vì đã giới hạn 3 khách |
| Sảnh nghề `recordCase({kind:'desk'})`, 1 / sảnh / ngày, 8 sảnh | `15 × total` | `B = 4`, `s = total` | có | Học | 8 sảnh × 4 = 32 > trần → người chơi phải chọn |
| Án Cổ (`classical`) lần đầu đạt ≥ 60% | 25 | 5 (một lần / án) | ngoài trần | Học | ≈ 38 án × 5 = 190 thô suốt đời |
| Thắp nhang `lightIncense` | 5 / ngày | 1 | có | Lễ | |
| Đèn an Thái Tuế `lightLamp` | 10 lần đầu, 3 / ngày | 1 / ngày | có | Lễ | web; iOS tắt (Thái Tuế Điện) |
| Ngồi trà `addTeaMinutes` | ≤ 15 / ngày | thuộc `MG-14` (pha) + `MG-01` (ngồi có hơi thở); ngồi không thao tác: 0 thô | — | Tĩnh | ngồi trà thụ động chỉ hồi Nguyên Khí |
| Thả đèn `addLantern` | 3 / ngày | thuộc `MG-16` (2 thô) | có | Lễ | web |
| Xem lịch `grantDaily('lich')` | 2 | 0 | — | — | thông tin, không phải tu |
| La bàn `grantDaily('compass')` | 5 | 0 | — | — | |
| Xin xăm `recordStick` | 3 | 0 (E3) | — | — | bói không sinh ĐH |
| Gieo quẻ (`que-ui.js`) | — | 0 (E3) | — | — | |
| Vận Mệnh Các, Thái Tuế (xem hạn) | — | 0 (E3) | — | — | |
| Ba việc trong ngày `settleTasks` | 5 | 0 (thay bằng Nhật Khóa, xem `09-09` §3) | — | — | giữ nguyên để không phá thói quen cũ |
| Lập lá số `grantChart` | 10 / hồ sơ | 0 | — | — | |

---

## 8. Nguồn một lần (ngân sách đề xuất cho tài liệu 03 và 05)

| Nguồn | Tổng thô | Phân bổ đề xuất | Chủ sở hữu số cuối cùng |
|---|---|---|---|
| Cốt truyện chính `MQ-*` | **700** | Mở đầu 40 · Hồi I 160 · Hồi II 220 · Hồi III 140 · Hồi IV 100 · Vĩ thanh 40 | tài liệu 03 |
| Nhánh Mệnh Cách `BR-*` | 120 | 4 nhánh × 30 (mỗi người chỉ đi 1 nhánh) | tài liệu 03 |
| Chuỗi đạo thống `CQ-<đạo>-xx` | **250 / đạo thống** | 5 chương × 50; chương 1 mở ở bậc 2, chương 5 cần bậc 4 | tài liệu 05 |
| Độ kiếp (`ACT-K*`) | 50 / bậc | bậc 2…6 = 250 suốt đời | tài liệu 09 (`09-02`) |
| Án Cổ lần đầu ≥ 60% | 5 / án | ≈ 190 | `09-03` §7 |
| Thủ khoa Đình thí lần đầu | 30 | một lần | `MG-03` |
| Nhiệm vụ phụ vùng `SQ-<region>-xx` | 10 – 25 / nhiệm vụ | ≈ 20 nhiệm vụ / vùng × 20 vùng; **trần 1.200 suốt đời** | tài liệu 03 / 07 |

**Vì sao có trần SQ:** 20 vùng × 20 nhiệm vụ × 15 = 6.000 thô sẽ phá nhịp (một mình SQ đủ lên bậc 6). Trần 1.200 thô: SQ vượt trần vẫn trả Phúc Khí, công, đồ thẩm mỹ.

---

## 9. Công đức (Sổ Công Quá) và Đạo Hạnh

| Quy tắc | Giá trị | Ghi chú |
|---|---|---|
| Mỗi **công** thiện ghi vào Sổ Công Quá trong game | +1 thô ngoài trần | DEED do tài liệu 05 định nghĩa (`DEED-xxx`), điểm theo `CONG_QUA.thien[].p` |
| Mỗi **quá** (ác) | trừ thẳng **1 ĐH × điểm quá** (`CONG_QUA.ac[].p`), **không** nhân NT | phạt không được khuếch đại bởi NT để lá số thấp không bị phạt nặng hơn |
| Điều kiện công để **độ kiếp** | bậc 4: công ròng ≥ 20 · bậc 5: ≥ 60 · bậc 6: ≥ 150 | ngưỡng thấp có chủ đích: chỉ chặn người không làm việc thiện nào |
| Mốc Liễu Phàm (canon) | 300 · 600 · 1.000 công | không chặn cảnh giới; mở danh hiệu và vật phẩm thẩm mỹ (`09-01` §7) |

Kiểm tra không bị chặn sai: mô phỏng `09-10` §2.1 cho thấy người «thong thả» (≈ 1,4 công / ngày lịch) đạt 150 công ở ngày ≈ 105, sớm hơn ngày ĐH đủ bậc 6 (d136–d197) → điều kiện công **không** là cổ chai với người làm việc thiện đều. Nhân đôi điều kiện công thì nó **thành** cổ chai và xóa hệ số Nghịch Thiên (`09-10` §5.5) — tài liệu 05 phải giữ tốc độ công tương thích.

---

## 10. Mất Đạo Hạnh, bất ổn cảnh giới và sám hối

### 10.1 Nguyên tắc

- **Cảnh giới là mốc cao nhất từng đạt**, không bao giờ tụt (canon §5: «Không — chỉ tăng»).
- **Đạo Hạnh có thể giảm** do phạm giới (canon §5: «Giảm nếu phạm giới, có cách sám hối»).
- Khi `ĐH < ngưỡng bậc hiện tại` → trạng thái **«Cảnh giới bất ổn»**: hiệu ứng gia trì mờ 50%, không được thử độ kiếp bậc kế, không nhận đệ tử mới. Không mất nơi chốn, không mất khả năng bay.

### 10.2 Bảng phạm giới trong phạm vi tài liệu 09

(Tài liệu 05 sở hữu danh sách `DEED-*` và `KARMA-*`; đây là các phạm giới phát sinh **trong hoạt động tu**.)

| Hành vi | Phát hiện bởi | Trừ ĐH | Có sám hối? |
|---|---|---|---|
| Trong giải án, chọn lời khuyên «hù dọa để bán bùa» (lựa chọn có gắn cờ `deceptive` trong kịch bản) | kịch bản án | −5 | có |
| Bán phù cho NPC với lời hứa «đổi vận» (lựa chọn trong `MG-02` / quầy) | lựa chọn | −8 | có |
| Thả loài ngoại lai vào hồ (`MG-21`) **sau khi** đã được giảng | `MG-21` | −3 | có |
| Nhận Âm Bài (Tà Lộ) | tài liệu 05 | 0 ngay, nhưng sinh **Nợ Âm** (§10.3) | qua Phong Đô |
| Bỏ ngang lễ tập thể khi đã nhận vai chủ lễ (MMO) | máy chủ | −2 | có |
| Gian lận bị xác nhận (§12) | máy chủ | hủy toàn bộ ĐH gian lận + −10% ĐH của tuần | không qua sám hối; khiếu nại qua hỗ trợ |

### 10.3 Âm Bài và Nợ Âm (giao diện với tài liệu 05)

Canon: Âm Bài cho «×2 Hậu Thiên 7 ngày» rồi phát sinh Nợ Âm công khai.

```
trong 7 ngày Âm Bài:   ĐH_lượt = (công thức §2.2) × 2;   NợÂm += ĐH_lượt / 2
sau 7 ngày:            K_âm = 1;  NợÂm hiện công khai cạnh tên
khi NợÂm > 0:          không được độ kiếp; mỗi ĐH kiếm được trả 50% vào NợÂm
trả hết:               qua chuỗi Phong Đô (TL-xx) → danh hiệu «Hồi Đầu» (canon)
```

Ví dụ: 7 ngày Âm Bài người chơi kiếm 400 ĐH (thay vì 200) → Nợ Âm 200. Sau đó kiếm 50 ĐH / ngày thì 25 vào Nợ → 8 ngày trả xong nếu không đi Phong Đô; đi Phong Đô và sám hối (`MG-23`) thì mỗi lượt sám hối trả thêm 10 Nợ.

### 10.4 Sám hối khôi phục ĐH bị trừ

| Pháp sám (`CHAN_HUI`) | Hoạt động trong game | Khôi phục |
|---|---|---|
| 八十八佛大忏悔文 (sám chung) | `MG-06` ở Bút Tháp, chế độ «sám hối» | 50% ĐH bị trừ của 1 lỗi gần nhất |
| 三十五佛忏悔 (sám từng nghiệp) | `MG-23` chọn đúng nghiệp đã phạm | 100% của lỗi đó |
| 金刚萨埵百字明 | `MG-05` mạn-đà-la, chế độ «tịnh hóa» (chờ tham vấn Tạng truyền) | 50% |
| Tụng Thanh Tĩnh Kinh (`DAO_JIA[0]`) | `MG-06` ở Chung Nam | 50% |
| Nho: tự tỉnh «Công quá cách» | `ACT-071` viết nhật ký tự tỉnh | 30% (không cần đến chùa / quán) |

Chỉ khôi phục ĐH bị **trừ do phạm giới**, không khôi phục ĐH tiêu vào Nợ Âm (Nợ Âm có đường riêng). Mỗi lỗi chỉ sám một lần.

---

## 11. Thiên Bảng và tu độ đạo thống

### 11.1 Thiên Bảng (bảng xếp hạng)

| Bảng | Xếp theo | Chốt | Ghi chú |
|---|---|---|---|
| Thiên Bảng Đạo Hạnh (chính) | ĐH tích lũy đời | liên tục; ảnh chụp mỗi Sóc | canon: bảng chính xếp theo Đạo Hạnh |
| Thiên Bảng mùa | ĐH kiếm được trong năm can chi hiện tại | Lập Xuân | công bằng cho người vào sau |
| Bảng Tiên Thiên | Tiềm Lực | không đổi | cột tham khảo, không xếp hạng thi đua |
| Bảng môn phái | tổng ĐH tuần của thành viên ÷ √(số thành viên) | thứ Hai | chia căn để môn phái nhỏ không thiệt (tài liệu 10 sở hữu) |

Chống vô nghĩa: người có `Nợ Âm > 0` vẫn ở bảng nhưng tên kèm dấu «Nợ Âm» (canon: công khai).

### 11.2 Tu độ đạo thống

Mỗi đạo thống có **Tu độ** = tổng thô (trước hệ số) kiếm từ hoạt động của đạo thống đó + chuỗi `CQ` của nó.

| Mức | Thô tích lũy | Ý nghĩa |
|---|---|---|
| Sơ Học | 50 | được nhận danh xưng môn hạ đầu tiên |
| Nhập Thất | 250 | tính vào điều kiện **Quy nhất** |
| Thâm Nhập | 800 | mở chế độ nâng cao của MG thuộc đạo đó |
| Viên Thông | 2.000 | danh hiệu «Viên Thông <đạo>», trang phục môn phái bậc cao |

**Quy nhất** (canon: «tu ≥ 3 đạo thống + Sổ Công Quá dương»): ≥ 3 đạo thống ở mức **Nhập Thất** + công ròng > 0. Đây là điều kiện bắt buộc của độ kiếp bậc 6.

---

## 12. Chống gian cấp kinh tế

| Lớp | Biện pháp |
|---|---|
| Hạt giống | mọi câu đố MG sinh từ `seed = hashSeed(userId:ngày:mgId:lượt)` (`npc.js › hashSeed` đã có); máy chủ sinh lại cùng câu đố |
| Chấm lại | client gửi **nhật ký thao tác** (thời điểm, giá trị), máy chủ chạy lại module chấm thuần; lệch > 2% → lấy điểm máy chủ |
| Hợp lý sinh học | MG nhịp: phản xạ < 80 ms liên tục ≥ 10 lần, hoặc độ lệch thời điểm < 5 ms trên 20 nhịp → cờ «nghi máy» |
| Trần | trần ngày, trần tuần, `K_lặp` đều do máy chủ tính; client chỉ hiển thị |
| Ngoại tuyến | chơi ngoại tuyến được; ĐH ghi «tạm» (mờ) tới khi đồng bộ; đồng bộ sau > 72 giờ thì chỉ nhận theo trần của **ngày đồng bộ** |
| Nhiều thiết bị | một tài khoản một phiên MG tại một thời điểm; phiên thứ hai thay phiên thứ nhất |
| Đồng tu (MMO) | thưởng đồng tu cần 5 tài khoản khác nhau, mỗi tài khoản có ≥ 3 ngày tu trong 14 ngày gần nhất (chống tài khoản rác) |
| Mức phạt | lần 1: cảnh báo + hủy ĐH lượt nghi; lần 2: hủy ĐH tuần; lần 3: khóa Thiên Bảng 30 ngày. Không xóa tài khoản vì MG |

---

## 13. Khung chung cho spec mini-game (mọi `MG-xx` dùng)

### 13.1 Mẫu mục bắt buộc

Mỗi MG trong `09-04` … `09-07` có đủ các mục (đánh số cố định để dễ tra):

1. **Mục đích** (vì sao có trong game, trụ cột nào)
2. **Engine dạy** (dẫn `file › hàm` thật; phần nào hư cấu)
3. **Luật chơi**
4. **Điều khiển** (bảng chạm / bàn phím / chuột)
5. **Bố cục giao diện** (sơ đồ khung chữ)
6. **Đường cong độ khó** (bảng theo bậc / mức)
7. **Chấm điểm** (công thức ra `s`)
8. **Phần thưởng** (B, thô, Phúc Khí, vật phẩm, công nếu có)
9. **Trạng thái thất bại** (và lời NPC)
10. **Trợ năng**
11. **Chống gian**
12. **Đo lường** (sự kiện riêng ngoài bộ chung §13.5)
13. **iOS** (nếu khác)
14. **Nghiệm thu** (checklist)

### 13.2 Quy ước điều khiển chung

| Ý nghĩa | Chạm | Bàn phím | Chuột | Tay cầm (sau này) |
|---|---|---|---|---|
| Hành động chính (giữ / thả / gõ nhịp) | chạm hoặc giữ vùng lớn giữa màn hình | `Space` | nút trái | `A` |
| Chọn trong danh sách | chạm thẻ | `1`–`9`, hoặc `←→↑↓` + `Enter` | nhấp | D-pad + `A` |
| Kéo / đặt vật | kéo một ngón | chọn bằng phím số rồi `←→↑↓` di chuyển, `Enter` đặt, `Q`/`E` xoay | kéo thả, bánh xe xoay | cần trái di, `LB`/`RB` xoay |
| Hủy / trở lại | nút «Thôi» góc trên trái | `Esc` | nút «Thôi» | `B` |
| Tạm dừng | nút «Dừng» | `P` | nút «Dừng» | `Start` |
| Gợi ý | nút «Hỏi thầy» | `H` | nút | `Y` |
| Xem lại luật | nút «?» | `F1` hoặc `?` | nút | `Select` |

Không dùng thao tác hai ngón trừ phóng to tùy chọn. Vùng chạm tối thiểu 44 × 44 pt (khớp quy tắc giao diện app hiện có).

### 13.3 Trợ năng chung (mọi MG phải có)

| Hạng mục | Yêu cầu | Ảnh hưởng điểm |
|---|---|---|
| Dung sai thời gian | thanh trượt ×1,0 / ×1,5 / ×2,0 cho mọi cửa sổ nhịp | không (E6) |
| Chế độ «không thời hạn» | MG có đồng hồ cho phép tắt đồng hồ | không; chỉ mất huy hiệu «Không trợ lực» |
| Màu ngũ hành | luôn kèm **chữ Hán + ký hiệu hình** (木 ▲ lá · 火 ◆ lửa · 土 ■ vuông · 金 ● tròn · 水 〰 sóng) | — |
| Âm thanh | mọi tín hiệu âm có phụ đề / chớp viền; mọi tín hiệu hình có âm hoặc rung tùy chọn (`haptics.js › buzz` đã có) | — |
| Giảm chuyển động | tắt rung camera, hạt, nhòe; vòng hơi thở đổi từ phình–co sang thanh tiến độ | — |
| Đọc màn hình | mọi nút có `aria-label` tiếng Việt; trạng thái nhịp đọc bằng `aria-live="polite"` khi bật «chế độ đọc» | — |
| Một tay | mọi MG chơi được chỉ bằng một tay trên điện thoại dọc | — |
| Cỡ chữ | theo cài đặt app (100–200%); chữ Hán trong MG ≥ 20 px | — |
| Tạm dừng an toàn | rời app / mất mạng → tự tạm dừng, giữ lượt 10 phút | — |
| Nhắc nghỉ | chơi liên tục 45 phút → Lão Tùng mời uống trà (tắt được) | — |

### 13.4 Chống gian chung

Áp dụng §12. Mỗi MG ghi thêm điểm yếu riêng (vd tĩnh tọa: treo máy; công án: dán văn bản dài).

### 13.5 Đo lường chung (mọi MG phát)

| Sự kiện | Khi nào | Trường |
|---|---|---|
| `mg_start` | bắt đầu lượt | `mg_id, run_id, tier, tl_bucket, nk_before, k_lap, region, tradition, platform, assists[]` |
| `mg_step` | xong một bước / một đợt | `mg_id, run_id, step, step_score, step_ms` |
| `mg_end` | kết thúc lượt | `mg_id, run_id, s, tho, dh, phuc, cap_hit(bool), du_huong_add, duration_ms, fail_reason?` |
| `mg_abandon` | thoát giữa chừng | `mg_id, run_id, step, elapsed_ms, reason (user / net / bg)` |
| `mg_assist` | đổi trợ năng | `mg_id, assist, value` |
| `mg_hint` | dùng gợi ý | `mg_id, run_id, step, hint_no` |
| `mg_flag` | máy chủ gắn cờ nghi gian | `mg_id, run_id, rule` |

**Riêng tư:** không gửi ngày giờ sinh, tên hồ sơ, nội dung điều ước, nội dung trả lời công án. `tl_bucket` = Tiềm Lực làm tròn xuống bội số 10. Đo lường tắt được trong Cài đặt (mặc định bật ẩn danh).

### 13.6 Trạng thái kết thúc chung

| Kết quả | Điều kiện | Lời mặc định (NPC của nơi chơi nói) |
|---|---|---|
| Viên mãn | `s ≥ 0,9` | «Hôm nay khí đều. Giữ lấy cái đều ấy.» |
| Đạt | `s_min ≤ s < 0,9` | «Được. Chỗ còn vấp, mai ta xem lại.» |
| Chưa đạt | `s < s_min` | «Chưa đạt không phải là hỏng. Ngồi lại đó cũng đã là tu.» |
| Bỏ dở | người chơi thoát | không trách; lượt không tính `K_lặp` nếu chưa quá 30 giây |

Không MG nào có màn hình «THUA» hay âm thanh chế giễu (T3, T6).

---

## 14. Bảng tra nhanh hằng số (dùng cho lập trình)

```js
// đề xuất module src/game/tu.js (chưa có — cần làm); thuần logic, test bằng node
export const TIER_TH = [0, 100, 400, 1000, 2200, 4500];
export const DAILY_CAP = [25, 30, 32, 35, 38, 40];          // theo bậc 1..6
export const KIEP_GATE = { cong: [0, 0, 0, 20, 60, 150], dwell: [0, 0, 3, 10, 20, 30] }; // index = bậc đích − 1 … xem 09-01 §4
export const REPEAT_K = (n) => (n <= 3 ? 1 : n <= 5 ? 0.5 : 0.1); // n = lượt thứ n trong ngày
export const HU_K = (nk, cost) => (nk < cost ? 0.25 : nk < 30 ? 0.8 : 1);
export const SUNG_K = (nk) => (nk >= 70 ? 1.1 : 1);
export const NT = (tl) => Math.min(1.5, Math.max(1, 1 + (60 - tl) / 100));
export const F = (s, smin = 0.4) => (s >= smin ? 0.3 + 0.7 * s : 0.15);
export const TRAD_WX = { CN: '火', TV: '水', TC: '土', TT: '金', BD: '水', TH: '木', TD: '金', MT: '土', NH: '木' };
export const DUNG_K = (trad, yong) => (!trad ? 1 : TRAD_WX[trad] === yong.primary ? 1.1 : TRAD_WX[trad] === yong.xi ? 1.05 : 1);
export const DU_HUONG = { max: 20, perMorning: 10 };
export const NHAT_KHOA = (streak) => 6 + Math.min(4, Math.floor(streak / 7));
```

Chú thích `KIEP_GATE`: phần tử thứ `k` là điều kiện để **lên bậc k + 1** (vd `cong[3] = 20` → lên bậc 4 cần 20 công). `dwell` tính bằng **ngày tu** (ngày có ≥ 10 thô), xem `09-01` §4.2.

---

## 15. Mã định danh dùng trong phần này

Chỉ tham chiếu: `MG-01` … `MG-24` (định nghĩa ở `09-04` … `09-07`), `ACT-041`, `ACT-071` (định nghĩa ở `09-08`), `ACT-K*` (định nghĩa ở `09-02`). Không tạo mã ngoài không gian `MG-*`, `ACT-*`.
