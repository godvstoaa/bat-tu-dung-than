# 10 · Phần 04 — Quan hệ giữa người với người: sư đồ, đồng tu, kim lan, đạo lữ, đồng hành, đạo hữu

> Căn cứ: bản sơ đồ §10 («Sư đồ: cảnh giới ≥ 4 nhận đệ tử; đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công đức», «Đồng tu: ngồi thiền cùng nhau (đã có bồ đoàn MMO ở Trà Thất)», «Hợp hôn / kết nghĩa: Bàn Hợp Hôn (đã có) mở rộng: hai người chơi so lá số thật, kết nghĩa kim lan (`hehun`, `nayin-relation`)»); §14 «Dữ liệu cá nhân»; code thật: `protocol.js › SEATS, COOP_MAX, inv/coop`, `worker/quan-room.js` (bồ đoàn, báo cáo), `src/engine/hehun.js › computeHehun`, `partner-match.js › matchBusinessPartners`, `nayin-relation.js › nayinRelations`, `marriage-timing.js`.
>
> Riêng tư, chống RMT, an toàn trẻ em: **Phần 05** (Phần này chỉ dẫn chiếu).

## 4.0 Bảng các loại quan hệ

| Mã | Quan hệ | Số người | Bền / tạm | Tuổi tối thiểu | Cần danh tính bền | Engine lá số |
|---|---|---|---|---|---|---|
| `GUILD-REL-SD` | Sư đồ | 1 thầy – ≤ 5 trò | bền | cùng nhóm tuổi (§4.1.2) | có | không |
| `GUILD-REL-DT` | Đồng tu | 2–30 | tạm (một buổi ngồi) | không | không | không |
| `GUILD-REL-KL` | Kim lan | 2–5 | bền | cùng nhóm tuổi | có | tùy chọn (`partner-match`) |
| `GUILD-REL-DL` | Đạo lữ (hợp hôn) | 2 | bền | **18** | có | tùy chọn (`hehun`) |
| `GUILD-REL-DH` | Đạo hữu (bạn) | ≤ 200 / người | bền | không (giới hạn theo nhóm tuổi, Phần 05 §5.6) | không | không |
| `GUILD-REL-DH2` | Đồng hành (nhóm đi cùng) | 2–4 (đoàn: ≤ 12) | tạm | không | không | không |

«Danh tính bền» = tài khoản có khóa thiết bị ký HMAC hoặc Sign in with Apple (Phần 12 §12.2). Hiện `net.js › pid()` chỉ là UUID trong `localStorage` — đủ cho «ẩn người này», **không đủ** cho quan hệ bền (xóa trình duyệt là mất; giả được).

---

## 4.1 Sư đồ (`GUILD-REL-SD`)

### 4.1.1 Mục đích thiết kế

Người mới cần một người dẫn; người đi trước cần lý do quay lại. Sư đồ trong Huyền Giới là **truyền đạo bằng việc làm**: thầy không cho trò điểm, không làm thay trò, chỉ chỉ chỗ. Khớp lời canon của Đan Đỉnh chân nhân: «Thầy chỉ chỗ, con tự đi hái.»

### 4.1.2 Điều kiện

| | Sư phụ | Đệ tử |
|---|---|---|
| Cảnh giới | ≥ 4 (bản sơ đồ §10) | ≤ 2 khi bái sư |
| Tuổi tài khoản | ≥ 30 ngày | không |
| Danh tính bền | có | có |
| Nhóm tuổi | cùng nhóm với đệ tử: **người lớn (≥ 18)** với người lớn; **thiếu niên (13–17)** với thiếu niên | — |
| Tông | không bắt buộc cùng tông | — |
| Số đệ tử đang theo | 3 (cảnh giới 4); 4 (cảnh giới 5); 5 (cảnh giới 6) | 1 sư phụ tại một thời điểm |

**Vì sao chặn sư đồ khác nhóm tuổi.** Quan hệ một thầy – một trò lâu dài giữa người lớn lạ và trẻ vị thành niên là mô hình rủi ro dụ dỗ (grooming) đã biết trên nền tảng trực tuyến. Người dưới 18 vẫn được dạy, nhưng qua **lớp học nhóm** ở Giảng Đường (Giáo Tập, Phần 01 §1.6.2) — luôn có ≥ 3 người, trong không gian chung, không kênh riêng.

### 4.1.3 Cách bái sư

1. Đệ tử tìm thầy ở **Bảng Tìm Thầy** (Lầu Danh Bộ mỗi thánh địa, và trong bảng Giao Lưu). Thầy tự đăng «thẻ nhận đệ tử»: tông, các mảng giỏi (chọn từ: Tử Bình, Tử Vi, Phong thủy, Trạch nhật, Hợp hôn, Khoa cử, Kết phù, Tĩnh tọa, Hành hương), giờ hay online (khung giờ địa chi).
2. Đệ tử gửi **lời xin** (mẫu: «Đệ tử xin được theo thầy học {mảng}.»).
3. Thầy chấp nhận → hai người hẹn gặp ở một **nơi bái sư**: chính điện thánh địa của tông thầy, hoặc Giảng Đường của chi đường thầy, hoặc Trà Thất Sơn Môn.
4. **Lễ bái sư** (2 phút): đệ tử dâng trà (dùng cử chỉ `tea` có sẵn trong `protocol.js › EMOTES`), thầy nhận, cả hai chọn một **lời ước** từ danh sách.

```
[CẢNH GUILD-REL-SD.BAI · Trà Thất Sơn Môn · giờ bất kỳ]
(đệ tử ngồi bồ đoàn, thầy ngồi bồ đoàn đối diện — dùng 2 trong 3 chỗ `SEATS`)
HỆ THỐNG: Đệ tử dâng trà.
(đệ tử chọn emote `tea` nhắm tới thầy)
HỆ THỐNG: Thầy chọn lời nhận.
> Thầy chọn một:
  ① «Học thì hỏi, không hiểu thì hỏi lại.»
  ② «Thầy chỉ chỗ, con tự đi.»
  ③ «Đi chậm cũng được, đừng dừng.»
HỆ THỐNG: Đệ tử chọn lời hứa.
> Đệ tử chọn một:
  ① «Con sẽ tự làm, không nhờ làm thay.»
  ② «Con sẽ hỏi khi không hiểu.»
  ③ «Con sẽ dạy lại người sau.»
(cả hai thấy dòng: «Từ nay {thầy} và {trò} là thầy trò. Ghi vào Sổ Mệnh.»)
```

Lời nhận và lời hứa hiện trong Sổ Mệnh của cả hai, nhắc lại khi một trong hai mở bảng Sư đồ.

### 4.1.4 Việc của thầy (công cụ)

| Công cụ | Làm gì | Giới hạn |
|---|---|---|
| **Chỉ điểm** | khi trò đang giải án (`cases.js` 6 bước) hoặc làm việc ở sảnh nghề, thầy (nếu online, cùng phòng hoặc ở chế độ «theo dõi từ xa») gửi một **gợi ý soạn sẵn** theo bước: «Nhìn lại tháng sinh», «Đếm lại hành Thổ», «Xét đắc lệnh trước»… (Phần 06 nhóm «Chỉ điểm») | không bao giờ gửi được **đáp án**; mỗi án ≤ 3 gợi ý; gợi ý của thầy **không** trừ điểm như gợi ý hệ thống (`cases.js` −15%) nhưng **giảm** điểm thưởng thầy nhận ở án đó |
| **Giao bài** | chọn 1 việc trong Mệnh Đồ của trò (trò thấy các nút Mệnh Đồ của chính mình; thầy **không** thấy chẩn đoán `diagnosis` của trò — chỉ thấy tên tầng và trạng thái) để «đánh dấu tuần này nên làm» | 1 bài / tuần |
| **Dẫn đi** | tạo nhóm đồng hành 2 người (§4.5) với cờ «thầy dẫn»: trò đi theo thầy, cả hai nhận +10% Phúc Khí cho việc làm cùng | — |
| **Thư thầy** | gửi thư mẫu (Phần 06 nhóm «Thư»): khen, nhắc, hẹn | 3 thư / tuần |

**Thầy thấy gì về trò:** tên, tông, cảnh giới, các mốc Mệnh Đồ đã qua (tên tầng, không chi tiết), số án đã giải, thời gian online gần nhất (nếu trò cho phép). **Không** thấy lá số, ngày sinh, Tiên Thiên, điểm Tiềm Lực, Phẩm căn — trừ khi trò bật «công khai căn cốt» với riêng thầy (Phần 05 §5.2).

### 4.1.5 Việc của trò

- Tự làm mọi việc. Không có cơ chế «thầy làm hộ».
- Mỗi tuần dự ít nhất một hoạt động có thầy (đồng tu, dẫn đi, lớp học) thì quan hệ «đang theo»; quá 21 ngày không hoạt động chung → «tạm xa» (không mất gì, không thưởng thầy); quá 60 ngày → hệ thống hỏi cả hai có muốn kết thúc không.

### 4.1.6 Công đức của thầy

Bản sơ đồ: «Đệ tử hoàn thành Mệnh Đồ thì sư phụ nhận công đức.» Cách tính không vi phạm nguyên tắc «công đức chỉ ghi cho người thật làm» (Phần 01 §1.10.1): thầy nhận công đức cho **việc dạy** của chính thầy, được xác nhận bằng tiến bộ của trò.

| Mốc của trò | Thầy được ghi | Thang app `CONG_QUA` | Trong game (×10, canon thang /10) |
|---|---|---|---|
| Hoàn thành 1 tầng Mệnh Đồ (6 tầng `gaimenh › layers`) khi đang theo thầy | «Khuyên người làm thiện» | +1 | +10 công |
| Lên một cảnh giới | «Khuyên người làm thiện» | +1 | +10 công |
| Hoàn thành **cả 6 tầng** Mệnh Đồ | «Giúp người khó khăn» | +2 | +20 công |
| Trò **xuất sư** (§4.1.7) | «Làm thiện ẩn (âm chất)» — chỉ ghi nếu thầy chọn không công khai | +2 | +20 công |

**Trần:** công đức từ sư đồ ≤ **60 công / tuần** cho mỗi thầy và ≤ **25%** tổng công đức của thầy trong mùa. Lý do: dạy là việc thiện, nhưng không được trở thành nguồn công đức chính để «nuôi trò lấy điểm».

**Phúc Khí:** thầy nhận Phúc Khí bằng 10% Phúc Khí trò kiếm được từ án/sảnh nghề trong thời gian «đang theo», trần 50 / ngày, **không trừ** của trò (hệ thống phát thêm).

### 4.1.7 Xuất sư và kết thúc

| Cách | Điều kiện | Kết quả |
|---|---|---|
| **Xuất sư** | trò đạt cảnh giới 4 **hoặc** hoàn thành 6 tầng Mệnh Đồ | lễ ở nơi bái sư (trò dâng trà lần nữa, thầy chọn câu tiễn); trò nhận danh hiệu phụ «Môn hạ {tên tu của thầy}»; quan hệ chuyển thành «thầy cũ» (vẫn hiện, không còn công cụ) |
| **Thôi theo** (trò) | bất kỳ lúc | không lý do bắt buộc; thầy nhận thông báo trung tính «{trò} đã thôi theo học» |
| **Thôi dạy** (thầy) | bất kỳ lúc | như trên |
| **Hệ thống kết thúc** | một bên bị chặn/báo cáo được xác nhận, hoặc tài khoản đổi nhóm tuổi | không thông báo lý do cho bên kia |

Không có hình phạt «phản sư», «bỏ trò». Thời gian chờ sau khi thôi: trò chờ 72 giờ mới bái thầy mới; thầy chờ 72 giờ mới nhận trò vào chỗ trống.

### 4.1.8 Chống lạm dụng sư đồ

| Rủi ro | Biện pháp |
|---|---|
| Tài khoản ảo làm trò để thầy cày công đức | trò phải có danh tính bền + cảnh giới tăng bằng hoạt động thật (máy chủ có nhật ký án/sảnh); trần 60 công/tuần; tín hiệu cùng thiết bị → không ghi công |
| Thầy làm hộ (dùng tài khoản trò) | không ngăn tuyệt đối; thưởng thầy giảm khi gợi ý nhiều; hành vi đăng nhập cùng thiết bị liên tiếp bị gắn cờ |
| Thầy đòi trò «đóng học phí» | game không có kênh chuyển tài sản giữa người chơi (Phần 05 §5.1); câu cố định trong bảng Sư đồ: «Học ở Huyền Giới không mất phí. Ai đòi phí, hãy báo cáo.» |
| Thầy dùng quan hệ để tiếp cận riêng | không có chat tự do; thư chỉ từ mẫu; nhóm tuổi tách biệt; báo cáo lý do «Hành vi không phù hợp với người nhỏ tuổi» ưu tiên cao (Phần 05 §5.3) |
| Một người làm thầy quá nhiều trò ở nhiều tài khoản | danh tính bền + trần trò theo cảnh giới |

---

## 4.2 Đồng tu (`GUILD-REL-DT`)

### 4.2.1 Hiện trạng code

- `protocol.js › SEATS` = 3 bồ đoàn ở Trà Thất, tọa độ ô `(-16.5, 22.72)`, `(-15, 22.72)`, `(-13.5, 22.72)`; máy chủ `TownShard` giữ khóa từng chỗ (`sit` → `seat {i}`, `seats {taken[]}`), offline thì cho chỗ giữa.
- Chưa có cơ chế thưởng đồng tu.

### 4.2.2 Nơi đồng tu

| Nơi | Số chỗ | Ghi chú |
|---|---|---|
| Trà Thất Sơn Môn | 3 (đã có) | giữ nguyên |
| Đình đồng tu ở mỗi thánh địa (tài liệu 07 đặt) | 9 | vòng tròn bồ đoàn |
| Giảng Đường / Pháp Đàn chi đường (bậc 4) | 16 | — |
| Thiền Đường Vạn Tùng (`GUILD-DT-TH-11`) | 30 | vùng im lặng |
| Kim Đỉnh Đình (`GUILD-DT-TV-11`) | 9 | — |
| Bếp lửa Y Lư | 8 | — |

Mỗi nơi là một **nhóm chỗ** (`seatGroup`) có id riêng; giao thức tổng quát hóa `sit {g}` (Phần 11).

### 4.2.3 Cơ chế

Tĩnh tọa là mini-game của tài liệu 09 (vòng thở giữ – thả; tạp niệm trôi qua). Đồng tu thêm hai thứ:

1. **Hiện diện:** mỗi người khác **đang tĩnh tọa** trong cùng nhóm chỗ (hoặc trong bán kính 6 m nếu nơi không có bồ đoàn) làm tăng **độ vững**: vòng thở rộng hơn một chút (dễ giữ hơn).
2. **Đồng tâm:** máy chủ phát **nhịp chung** cho nhóm chỗ 1 lần/giây (pha 0–1 của vòng thở chuẩn 8 giây). Client của mỗi người báo pha thở của mình 1 lần/2 giây. Nếu ≥ 2/3 số người trong nhóm lệch pha chuẩn < 0,15 vòng trong 3 vòng liên tiếp → trạng thái **Đồng tâm**: ánh sáng nối các bồ đoàn.

**Công thức hệ số** (áp lên Đạo Hạnh của chính hoạt động tĩnh tọa, tài liệu 09 cấp gốc):

```
n       = số người đang tĩnh tọa trong nhóm (kể cả mình)
pres    = min(0,30, 0,08 × (n − 1))                 // hiện diện: +8%/người, trần +30%
sync    = 0,10 nếu đang Đồng tâm, ngược lại 0        // đồng tâm: +10%
venue   = 0,05 nếu nơi ngồi là Thiền Đường Vạn Tùng hoặc Kim Đỉnh Đình, ngược lại 0
hệ_số   = 1 + pres + sync + venue                    // tối đa 1,45
```

- **Không bao giờ phạt** người ngồi một mình (hệ số 1).
- Đạo Hạnh từ đồng tu chỉ là **Hậu Thiên** (canon §5). Không ảnh hưởng Tiên Thiên.
- **Trần ngày:** phần **thêm** do đồng tu (`hệ_số − 1`) cộng dồn ≤ 15 Đạo Hạnh / ngày / người.
- Hệ số Nghịch Thiên (canon `clamp(1 + (60 − Tiềm Lực)/100, 1,0, 1,5)`) áp **sau** hệ số đồng tu, như mọi nguồn Đạo Hạnh.

### 4.2.4 Ví dụ

| Tình huống | n | Đồng tâm | Nơi | Hệ số |
|---|---|---|---|---|
| Ngồi một mình ở Trà Thất | 1 | — | Trà Thất | 1,00 |
| 3 người ở Trà Thất | 3 | không | Trà Thất | 1,16 |
| 3 người, Đồng tâm | 3 | có | Trà Thất | 1,26 |
| 9 người ở Kim Đỉnh Đình, Đồng tâm | 9 | có | Kim Đỉnh | 1,45 (trần: 0,30 + 0,10 + 0,05) |
| 30 người ở Vạn Tùng, không Đồng tâm | 30 | không | Vạn Tùng | 1,35 |

### 4.2.5 Ca biên

- Người đứng dậy giữa chừng: rời khỏi `n` ngay; Đồng tâm của nhóm tính lại ở vòng kế.
- Người treo máy (không thao tác): mini-game tĩnh tọa tự dừng sau 2 vòng không giữ – thả → người đó **không** được tính vào `n` của người khác (tránh «xác treo» làm buff).
- Mất mạng: client chuyển chế độ đơn, hệ số về 1; khi nối lại, phải ngồi lại.
- Người bị mình **ẩn** (block): vẫn được máy chủ tính vào `n` (công bằng cho người khác) nhưng mình không thấy họ; nếu muốn tránh hoàn toàn thì chọn nhóm chỗ khác.

---

## 4.3 Kết nghĩa kim lan (`GUILD-REL-KL`)

### 4.3.1 Mục đích

Một nhóm bạn nhỏ, gắn bó hơn đạo hữu, không cần chung tông. Lấy cảm hứng tình bằng hữu «kim lan» (金蘭 — «đồng tâm chi ngôn, kỳ xú như lan»), kết nghĩa vườn đào trong truyện xưa.

### 4.3.2 Điều kiện

- 2–5 người, đều có danh tính bền, **cùng nhóm tuổi**, đều là đạo hữu của nhau ≥ 7 ngày.
- Mỗi người tối đa **1 nhóm kim lan** cùng lúc.
- Lễ kết nghĩa ở **Đình Kim Lan** (một công trình đi vào được ở Huyền Thành gần Bàn Hợp Hôn; mã công trình do tài liệu 07 cấp) — mọi người phải **có mặt cùng lúc**.

### 4.3.3 Thứ tự anh – chị – em

Kết nghĩa ngoài đời xếp thứ tự theo tuổi thật. Game **không dùng tuổi thật** (riêng tư — Phần 05 §5.2). Thứ tự xếp theo **tuổi đạo**: số ngày kể từ khi tài khoản qua lễ nhập môn (`MQ-P-*`). Ai vào Huyền Giới trước làm anh/chị cả. Nếu bằng nhau, xếp theo thứ tự bấm «đồng ý» trong lễ.

Xưng hô: mỗi người chọn **danh xưng của mình** trong nhóm: «Huynh / Tỷ / Đệ / Muội / Bằng hữu» (không ép theo giới tính). Thứ tự chỉ quyết định **số thứ tự** (Nhất, Nhị, Tam, Tứ, Ngũ), không quyết định quyền gì.

### 4.3.4 Lễ kết nghĩa

```
[CẢNH GUILD-REL-KL.KET · Đình Kim Lan, Huyền Thành · mọi người đứng quanh hương án nhỏ]
HỆ THỐNG: Các vị đã đủ mặt. Xin chọn lời thề chung.
> Nhóm chọn một (người đứng đầu theo tuổi đạo bấm, những người khác bấm «đồng ý»):
  ① «Không cầu cùng ngày sinh, chỉ cầu cùng lòng giúp nhau.»
  ② «Ai vấp thì người khác đỡ, ai đi nhanh thì chờ người đi chậm.»
  ③ «Có việc tốt cùng làm, có lỗi cùng nhận.»
(mỗi người dùng emote `bow` về phía hương án; khi đủ, hương án sáng)
HỆ THỐNG: Kim lan {tên nhóm} thành. {Nhất}: …, {Nhị}: …
```

**Tên nhóm kim lan:** ghép từ bảng A + bảng B của Phần 01 §1.5.2 + hậu tố «Kim Lan» (vd «Tùng Mai Kim Lan»), duy nhất toàn máy chủ.

### 4.3.5 Quyền lợi

| Quyền lợi | Mô tả |
|---|---|
| Danh xưng phụ | «Kim Lan {tên nhóm} · {thứ tự}» chọn hiện thay danh xưng thường |
| **Nghĩa cử** (việc tuần nhỏ) | mỗi tuần một việc chung chỉ làm được khi ≥ 2 người kim lan cùng có mặt: giúp một NPC dọn nhà, sửa một đoạn đường, đưa một NPC già lên chùa… → mỗi người ghi việc thiện của chính mình; nhóm được +1 «nghĩa» (đếm) |
| Biết nhau đang ở đâu | trạng thái online + **vùng** (không tọa độ) luôn hiện cho nhau (trừ khi một người bật «ẩn mình» — Phần 05 §5.2) |
| Đi tới nhau | «Tìm huynh đệ»: dẫn đường A* tới vùng người kia đang ở (không dịch chuyển tức thời) |
| Tái kết | lễ `EV-NGHIA-01` (Phần 10, 24/6 âm) — đọc lại lời thề, nhận đồ bày kỷ niệm |

Không có hệ số chỉ số nào (không cộng Đạo Hạnh) — kim lan là quan hệ tình cảm, không phải buff.

### 4.3.6 «So duyên kim lan» (tùy chọn)

Nhóm có thể bấm **«Xem chỗ bổ trợ»** — dùng `partner-match › matchBusinessPartners(R1, R2)` (hợp tác, phi giới tính) cho **từng cặp** trong nhóm, nhưng chỉ khi **mọi người** trong cặp đã bật «công khai căn cốt» mức «Thẻ hợp» với nhau (Phần 05 §5.2).

`partner-match › ROLE_MAP` có sáu vai (CEO, CFO, CTO, COO, CMO, HR) với thập thần tương ứng. Game đổi tên vai cho hợp thế giới và **dùng cả cho gợi ý chức sự chi đường**:

| `ROLE_MAP` | Thập thần (engine) | Vai trong game | Gợi ý chức sự (Phần 01 §1.6.2) |
|---|---|---|---|
| CEO | 七殺, 正官, 比肩 | Người cầm lái | Chủ Trì / Phó Trì |
| CFO | 正財, 偏財 | Người giữ của | Tri Khố |
| CTO | 偏印, 食神, 傷官 | Người bày việc mới | Giám Viện |
| COO | 正印, 正官 | Người giữ nếp | Chủ Lễ |
| CMO | 傷官, 偏財, 食神 | Người giao tiếp | Tri Khách |
| HR | 正印, 比肩 | Người chăm người | Giáo Tập |

Kết quả chỉ hiện: **vai mạnh của mỗi người** và **một câu bổ trợ** («A giữ nếp, B bày việc mới — hợp để cùng làm một việc dài»). **Không hiện điểm số** cho kim lan (tránh nhóm bạn bị chia rẽ bởi một con số). Ghi chú cố định: «Tham khảo cho vui. Bạn bè hợp nhau vì cùng làm việc tốt, không vì lá số.»

### 4.3.7 Rời nhóm, giải nhóm

- Một người rời: nhóm còn ≥ 2 thì tiếp tục; thứ tự xếp lại.
- Còn 1 người: nhóm giải, tên được giữ 30 ngày cho người đó (kết lại được).
- Thời gian chờ kết nhóm mới: 14 ngày (giữ ý nghĩa của lời thề).
- Không có thông báo công khai; chỉ những người trong nhóm biết.

---

## 4.4 Đạo lữ — hợp hôn giữa người chơi (`GUILD-REL-DL`)

### 4.4.1 Phạm vi và giới hạn

- **Chỉ người ≥ 18 tuổi** (theo khai báo tuổi khi tạo tài khoản và, với iOS, theo Age Rating của app). Người dưới 18 **không thấy** tính năng.
- Hai người, cả hai danh tính bền, là đạo hữu ≥ 14 ngày.
- Không phân biệt giới tính của hai người. Engine đã xử lý: `computeHehun` bỏ yếu tố «sao phối ngẫu» cho cặp cùng giới và ghi rõ «Cặp cùng giới — tương hợp luận ngũ hành/ngày chi (gender-neutral)».
- Mỗi người tối đa 1 đạo lữ.
- **Không** có cơ chế «kết hôn ép», «cầu hôn công khai» trước đám đông (tránh áp lực, tránh quấy rối).

### 4.4.2 Bàn Hợp Hôn (đã có) mở rộng

Hiện tại: station `hophon` ở Huyền Thành (−48, 8), «Xem hợp hôn (án chung)» — giải án hợp hôn cho cặp NPC (`halls.js` dùng `computeHehun`). Mở rộng: bàn có thêm mục **«Hai người chơi»** chỉ hiện khi cả hai đứng trong 4 m quanh bàn và đã gửi – nhận lời mời so.

### 4.4.3 Ba chế độ so

| Chế độ | Hai bên gửi gì | Hai bên thấy gì | Riêng tư |
|---|---|---|---|
| **Không so** | không gì | không có kết quả; chỉ làm lễ | tuyệt đối |
| **Giản lược** | «Thẻ Hợp Hôn» (§4.4.4) tới **máy chủ**, không tới người kia | **chỉ** mức xếp loại (`rating`: Đại hợp / Hợp / Trung / Khắc) và một câu từ `verdict` đã bọc thông điệp T2 (§4.4.6) | người kia không nhận dữ liệu lá số; máy chủ tính xong **xóa ngay** thẻ (không lưu) |
| **Đầy đủ** | Thẻ Hợp Hôn tới máy chủ | điểm, xếp loại, **toàn bộ `factors[]`** | `factors[]` nêu chi năm, nhật can, nhật chi, nạp âm, nhóm mệnh quái của **cả hai** → người kia suy ra được nhiều thông tin ngày sinh (§4.4.5); bắt buộc cảnh báo và xác nhận hai lần |

Chế độ thực hiện = chế độ **thấp hơn** trong hai lựa chọn của hai người. Ví dụ A chọn Đầy đủ, B chọn Giản lược → Giản lược.

### 4.4.4 Thẻ Hợp Hôn (dữ liệu tối thiểu)

`computeHehun(R1, R2)` đọc (đã rà mã nguồn `src/engine/hehun.js`):

| Trường engine đọc | Dùng cho | Đưa vào thẻ |
|---|---|---|
| `R.chart.pillars.year.zhi` | tam hợp / lục hợp / xung / hại / hình chi năm | `yz` |
| `R.chart.dayGan` | ngũ hợp / sinh / khắc / tỷ hòa nhật can; thập thần phối ngẫu | `dg` |
| `R.chart.pillars.day.zhi` | cung phu thê; nạp âm ngày (`ganZhiNayin(dayGan + dayZhi)`) | `dz` |
| `R.wx.score`, `R.wx.total` | ngũ hành tương bổ | `wx` (5 số, làm tròn 1 chữ số thập phân) |
| `R.yong.primary`, `R.yong.avoid` | tương bổ, tổn dụng | `yp`, `ya[]` |
| `R.chart.input.gender` / `genderNorm` | sao phối ngẫu (chỉ cặp khác giới) | `g` |
| `R.chart.input.year` (**năm sinh**) | `computeZhai(year, gender)` → nhóm mệnh quái Đông/Tây | **không gửi năm**: gửi kết quả `zg` ('Đông' / 'Tây') và `gua` (tên quái) |

**Việc cần làm ở engine (chưa có — cần làm):** `computeHehun` gọi thẳng `computeZhai(a.input.year, a.input.gender)`. Cần thêm tham số tùy chọn `computeHehun(R1, R2, { zhai: [za, zb] })` để nhận nhóm mệnh quái đã tính sẵn, và một hàm `hehunFromCards(c1, c2)` dựng `R` giả tối thiểu từ hai thẻ. Test: với 20 cặp lá số mẫu, `hehunFromCards(card(R1), card(R2))` phải cho **cùng `score`, `rating`, `factors`** như `computeHehun(R1, R2)`.

Thẻ **không có**: ngày, giờ, tháng sinh dương/âm, trụ tháng, trụ giờ, Tiềm Lực, Phẩm căn, tên thật.

### 4.4.5 Thẻ lộ ra được bao nhiêu? (phân tích bắt buộc trong màn cảnh báo)

- `yz` (chi năm, chu kỳ 12) + `gua` (mệnh quái phụ thuộc năm sinh và giới tính, chu kỳ 9) → kết hợp xác định **năm sinh theo chu kỳ 36 năm**; với tuổi người chơi hợp lý, gần như **lộ đúng năm sinh**.
- `dg` + `dz` (trụ ngày, chu kỳ 60 ngày) → trong một năm còn khoảng **6 ngày** khả dĩ.
- Vì vậy chế độ **Đầy đủ** coi như cho người kia biết **năm sinh và ngày sinh trong khoảng 6 khả năng**.

Màn cảnh báo (cố định):

> «So đầy đủ sẽ cho {tên} thấy các yếu tố lá số của bạn (chi năm, can chi ngày, nhóm mệnh quái). Từ đó có thể đoán ra năm sinh và gần đúng ngày sinh của bạn. Chỉ chọn nếu bạn tin người này ngoài đời. Bạn có thể chọn «Giản lược» để chỉ xem kết luận.»
> [Chọn Giản lược] [Tôi hiểu, so Đầy đủ]

Bấm «Tôi hiểu» lần hai (sau 5 giây) mới gửi.

Ở chế độ **Giản lược**, người kia chỉ nhận một trong 4 xếp loại — lộ rất ít (≤ 2 bit). Máy chủ không trả `score`.

### 4.4.6 Bọc thông điệp T2 cho kết quả

`computeHehun` trả `verdict` theo ngưỡng điểm (≥ 78 Đại hợp, ≥ 62 Hợp, ≥ 45 Trung, < 45 Khắc). Một số câu của engine có thể làm người chơi buồn (vd «Khó hợp — … hoặc chỉ hợp tác kinh doanh»). Game **giữ nguyên lời engine** (trụ cột T5: nói đúng như trang chính) nhưng luôn đặt **trước** nó một câu dẫn theo mức:

| Xếp loại | Câu dẫn (cố định) |
|---|---|
| Đại hợp | «Lá số thuận nhau. Thuận thì dễ, nhưng vẫn phải vun.» |
| Hợp | «Có chỗ bổ cho nhau. Chỗ thiếu thì bù bằng thương.» |
| Trung | «Hợp một mặt, khác một mặt. Phần lớn là do hai người làm.» |
| Khắc | «Lá số khác nhau nhiều. Cổ nhân nói «cần cố ý hóa giải» — tức là cần cố gắng, không phải không được. Mệnh do ta tạo.» |

Và **sau** kết quả, luôn có dòng: «Để tham khảo và chiêm nghiệm. Không xếp loại nào ngăn được hai người kết đạo lữ.» (khớp nguyên tắc «Mọi luận giải có câu "Để tham khảo và chiêm nghiệm"» của `GAME-MMO-PROMPT-PLAN.md`).

### 4.4.7 Chọn ngày kết đạo lữ

Tùy chọn: cặp mở **Lịch Đường** (`lichduong`, Sảnh Trạch Nhật) để chọn ngày lễ. Có hai cách:

- **Không dùng lá số:** chọn ngày hoàng đạo chung (`huangdao`, `zheri`) — ai cũng dùng được.
- **Dùng lá số (chỉ khi cả hai đã so Đầy đủ):** hai bước, đều chạy **trên máy mỗi người** với lá số của chính họ:
  1. `marriage-timing.js › scanMarriageTiming(R, fromYear, count)` quét **năm** thuận duyên (Hồng Loan, Thiên Hỷ, Đào Hoa… — `HONGLUAN`, `TIANXI`, `TAOHUA`) trong 12 năm tới; mỗi người đánh dấu năm «thuận với mình», lịch chung chỉ hiện **giao** của hai bộ năm (thường là năm hiện tại hoặc kế tiếp — nếu không có giao thì hiện câu «Năm nào cũng được, chọn ngày cho lành là đủ»);
  2. trong năm đã chọn, `zheri` / `huangdao` gợi ý **ngày** lành chung (không cần lá số).
  Lịch chung không lộ lý do của từng người (không hiện sao nào, của ai).

### 4.4.8 Lễ kết đạo lữ

```
[CẢNH GUILD-REL-DL.LE · Bàn Hợp Hôn, Huyền Thành · ngày đã chọn (hoặc ngày bất kỳ)]
(hai người đứng hai bên bàn; khách mời — tối đa 30 đạo hữu chung — đứng quanh)
NPC CHỦ BÀN (tài liệu 06 cấp mã): Hai người tự nguyện chứ?
(mỗi người bấm «Tự nguyện» riêng; không ai thấy người kia bấm trước hay sau)
NPC CHỦ BÀN: Mời hai người chọn lời hẹn.
> Mỗi người chọn một (không cần giống nhau):
  ① «Đi đường dài thì đi chậm, đi cùng.»
  ② «Có chuyện thì nói, nói xong thì thôi giận.»
  ③ «Mệnh do ta tạo — tạo cùng nhau.»
  ④ «Giữ nhau bằng việc tốt mỗi ngày.»
NPC CHỦ BÀN: Lễ thành. Khách mời chúc mừng.
(khách dùng cụm từ nhóm «Chúc mừng» — Phần 06; hiệu ứng đèn lồng đỏ, cánh hoa)
```

### 4.4.9 Quyền lợi đạo lữ

| Quyền lợi | Mô tả |
|---|---|
| Danh xưng | «Đạo lữ của {tên}» (tùy chọn hiện) |
| Đồ đôi | bộ đồ Tàng Y Các **miễn phí** «Đồng Tâm» (khung tên đôi + vệt bước song song) — cấp khi kết, không bán |
| Nhà chung (tùy chọn) | gộp hai nhà riêng ở Huyền Thành thành một (cả hai đều quản), hoặc giữ hai nhà |
| Đồng tu đôi | khi chỉ có hai người ngồi cạnh nhau, «Đồng tâm» dễ đạt hơn (ngưỡng lệch pha 0,2 thay 0,15) |
| Lễ Thất Tịch | `EV-THATTICH-01` (Phần 10) có hoạt động riêng cho đạo lữ: cùng bắc cầu Ô Thước |

Không cộng Đạo Hạnh, không cộng công đức, không thưởng Ngọc.

### 4.4.10 Giải đạo lữ

- Một người bấm «Giải duyên» là đủ (không cần người kia đồng ý — không ai bị giữ trong quan hệ).
- Người kia nhận thông báo riêng, lời trung tính: «{tên} đã kết thúc quan hệ đạo lữ. Chúc bạn bình an.»
- Đồ đôi chuyển thành đồ đơn (giữ lại). Nhà chung: mỗi người được một nhà riêng như trước khi gộp (dữ liệu bố trí được giữ bản sao).
- Thời gian chờ kết đạo lữ mới: 7 ngày.
- Không có thông báo công khai, không có «lịch sử hôn nhân» hiện cho người khác.

### 4.4.11 iOS

Bản iOS tắt gian bói cho bản thân (`features.js › FEATURES.divination = false`). So lá số của chính mình với người khác là một dạng «xem cho bản thân». Vì vậy trên iOS:

- chỉ có chế độ **Không so**;
- vẫn có lễ, danh xưng, đồ đôi;
- Bàn Hợp Hôn vẫn giải án cho cặp NPC (đã có, là «học»).

---

## 4.5 Đồng hành — nhóm đi cùng (`GUILD-REL-DH2`)

### 4.5.1 Hiện trạng

`protocol.js` đã khai báo P3: `inv {to}`, `inv_ok {coop}`, `inv_no {coop}`, `coop_start`, `coop_leave`, `coop_ans {step, ans, hints}`; máy chủ trả `inv {from, name, coop}`, `coop {id, host, members[], started, key?}`, `coop_step`, `coop_done`, `coop_end`. `COOP_MAX = 4`. **`worker/quan-room.js` chưa xử lý các gói này** (switch chỉ có `mv`, `cos`, `emo`, `say`, `sit`, `stand`, `report`) — **(chưa có — cần làm)**, Phần 11 chuẩn hóa.

### 4.5.2 Hai cỡ nhóm

| | **Nhóm đồng hành** | **Đoàn** |
|---|---|---|
| Số người | 2–4 (`COOP_MAX`) | 5–12 |
| Dùng cho | giải án hợp tác (CaseRoom), đi đường, việc tuần, sảnh nghề | hành hương (Yên Tử, Long Hổ), sự kiện máy chủ, lễ tiết lớn |
| Người lập | bất kỳ | cảnh giới ≥ 2 |
| Thời gian sống | tới khi mọi người rời / 4 giờ không hoạt động | tới khi sự kiện kết thúc / 6 giờ |

### 4.5.3 Luật nhóm

- **Mời:** người trong nhóm mời người cùng phòng TownShard (chạm vào người → «Mời đi cùng») hoặc đạo hữu đang online (bất kỳ phòng nào — người được mời sẽ được chuyển phòng nếu phòng nhóm còn chỗ).
- **Trưởng nhóm:** người lập; chuyển được. Trưởng nhóm có thể **mời ra** một người (một lần/ 10 phút), người bị mời ra không bị gắn cờ gì.
- **Rời:** bất kỳ lúc nào, không mất gì đã nhận.
- **Đi theo:** bấm «Theo trưởng nhóm» → nhân vật tự tìm đường A* tới chỗ trưởng nhóm đứng (cách làm như `walkTo` hiện có), dừng cách 2 m.
- **Chia thưởng:** việc tuần, việc thiện tính **cho từng người làm** (không chia đều). Riêng giải án hợp tác: điểm án chia theo bước mỗi người giữ (cơ chế CaseRoom: mỗi người giữ một trong 6 bước `STEPS`).
- **Nhóm không có kho**, không có «chia đồ» — vì không có đồ rơi (game không có quái).

### 4.5.4 Thưởng đi cùng

| Hoạt động | Thưởng thêm cho mỗi người khi làm cùng nhóm |
|---|---|
| Giải án hợp tác | điểm án theo bước + 10% Phúc Khí |
| Đi bộ hành hương ≥ 1 km cùng nhau (mọi người trong bán kính 15 m suốt quãng) | +1 «bước hành hương» cho việc tuần của mọi tông có việc đi bộ |
| Sự kiện máy chủ | đóng góp mỗi người được tính riêng; nhóm hoàn thành một «phần việc nhóm» được thêm 10% công sức (Phần 08) |

### 4.5.5 Chống phá nhóm

| Hành vi | Biện pháp |
|---|---|
| Vào nhóm rồi đứng im (ăn thưởng) | thưởng đi cùng tính theo **hành động của chính mình**; đứng im không có gì |
| Mời spam | ≤ 10 lời mời / 10 phút; người nhận bật «không nhận lời mời từ người lạ» |
| Trưởng nhóm đuổi người liên tục | 1 lần / 10 phút; đuổi ≥ 5 người / ngày → trưởng nhóm bị gắn cờ xem xét |
| Dẫn người mới vào chỗ hẹp rồi bỏ (troll) | không có sát thương, không có vực chết; «Về Sơn Môn» luôn có |

---

## 4.6 Đạo hữu — danh sách bạn (`GUILD-REL-DH`)

### 4.6.1 Kết đạo hữu

| Cách | Điều kiện |
|---|---|
| **Gặp mặt** | đang cùng phòng TownShard, chạm vào người → «Kết đạo hữu»; người kia đồng ý |
| **Sau khi đi cùng** | cuối một nhóm đồng hành/đoàn, bảng tổng kết có nút «Kết đạo hữu với …» |
| **Mã đạo hữu** | mỗi người có một mã 8 ký tự (chữ + số, không chứa thông tin cá nhân) để chia sẻ ngoài game với bạn thật; nhập mã → gửi lời mời |

Danh sách tối đa **200** đạo hữu. Lời mời chờ tối đa 7 ngày. Một người gửi tối đa 30 lời mời đạo hữu / ngày.

### 4.6.2 Đạo hữu thấy gì của nhau

| Thông tin | Mặc định | Có thể đổi |
|---|---|---|
| Tên, tên tu, tông, chi đường | hiện | không ẩn được (là thông tin công khai trong phòng) |
| Cảnh giới | hiện | ẩn được |
| Online / offline | hiện | ẩn được («ẩn mình») |
| Đang ở **vùng** nào | hiện | ẩn được; không bao giờ hiện tọa độ |
| Hoạt động gần nhất («vừa giải án ở Sảnh Tử Vi») | ẩn | bật được |
| Lá số / ngày sinh / Tiên Thiên | **không bao giờ** — trừ «công khai căn cốt» (Phần 05 §5.2) | — |

### 4.6.3 Thư (không chat tự do)

Đạo hữu gửi nhau **thư mẫu**: một tiêu đề chọn từ danh sách + thân thư ghép từ 1–3 câu trong thư viện cụm từ (Phần 06 nhóm «Thư») + một **vật đính kèm tùy chọn** thuộc nhóm «quà nhỏ» (Phần 05 §5.1). Ví dụ:

> Tiêu đề: «Hẹn đi hành hương»
> Thân: «Cuối tuần này lên Yên Tử không?» + «Mình đi bộ, không bay.» + «Giờ Thìn gặp ở chân núi nhé.»

Hộp thư giữ 100 thư; thư cũ hơn 30 ngày tự xóa. Mỗi người gửi ≤ 20 thư / ngày.

### 4.6.4 Ghi chú riêng

Mỗi người có thể ghi **ghi chú riêng** về đạo hữu (chọn nhãn từ danh sách: «bạn cùng giải án», «gặp ở Yên Tử», «đồng môn», «bạn ngoài đời», «thầy cũ»…). Nhãn chỉ mình thấy, lưu trên máy.

### 4.6.5 Xóa đạo hữu

Xóa im lặng: người kia không nhận thông báo; chỉ thấy mình biến khỏi danh sách của họ ở lần mở sau. Xóa không ảnh hưởng chi đường, kim lan (kim lan cần đạo hữu khi **kết**, không cần duy trì — nhưng nếu muốn tách thì rời kim lan riêng).

---

## 4.7 Tìm bạn đồng hành

### 4.7.1 Bảng tìm bạn

Ở **Đình Nghỉ Chân** mỗi thánh địa (Phần 01 §1.8.1) và trong bảng Giao Lưu có **Bảng Tìm Bạn**. Người chơi treo một **thẻ** gồm:

| Trường | Giá trị (chọn từ danh sách) |
|---|---|
| Muốn làm gì | giải án hợp tác · Án Cổ · hành hương · việc tuần tông · sự kiện máy chủ · đồng tu · khoa cử · tìm chi đường · tìm thầy · tìm đệ tử |
| Ở đâu | vùng / thánh địa |
| Khi nào | ngay bây giờ · trong giờ này (địa chi) · tối nay · cuối tuần |
| Phong cách | im lặng · trò chuyện (cụm từ) · người mới · đã quen |
| Ngôn ngữ | Tiếng Việt · English (cụm từ có bản dịch) |

Thẻ tự gỡ sau 2 giờ (hoặc khi đủ người).

### 4.7.2 Ghép tự động

Khi người chơi bấm «Tìm ngay» với một hoạt động, máy ghép ưu tiên theo thứ tự:

1. **Cùng nhóm tuổi** (bắt buộc — không bao giờ ghép người < 18 với người lớn lạ; Phần 05 §5.6).
2. Đạo hữu đang online, đang tìm cùng hoạt động.
3. Cùng chi đường / tông.
4. Cùng phòng TownShard.
5. Chênh cảnh giới ≤ 2 bậc (với giải án: chênh độ thạo `state.mastery` (trung bình ~20 án gần nhất) ≤ 25 điểm).
6. Thời gian chờ: sau 60 giây nới điều kiện 3–5.

Không ghép với người mình đã **ẩn** hoặc người đã **ẩn** mình (máy chủ biết danh sách ẩn khi người chơi đồng bộ lên — Phần 05 §5.3).

---

## 4.8 Dữ liệu quan hệ — lưu ở đâu

| Dữ liệu | Nơi lưu | Ghi chú |
|---|---|---|
| Danh sách đạo hữu, lời mời | D1 bảng `friend` (Phần 12) | theo `uid` bền |
| Ghi chú riêng về đạo hữu | máy người chơi (`localStorage`) | không lên máy chủ |
| Sư đồ (cặp, mốc, công đức đã ghi) | D1 bảng `mentor` | nhật ký mốc để kiểm trần tuần |
| Kim lan (nhóm, thứ tự, lời thề) | D1 bảng `kimlan` | — |
| Đạo lữ (cặp, ngày, lời hẹn, chế độ so đã dùng) | D1 bảng `partner` | **không** lưu thẻ hợp hôn, **không** lưu điểm |
| Thẻ hợp hôn | bộ nhớ của lời gọi tính (ephemeral) | xóa ngay sau khi tính (Phần 12 §12.7) |
| Nhóm đồng hành | bộ nhớ TownShard / CaseRoom | mất khi nhóm tan |
| Đồng tu (ai đang ngồi) | attachment của WebSocket trong TownShard / SectHall | như `seat` hiện có |

## 4.9 Checklist nghiệm thu Phần 04

- [ ] Sư đồ: chặn khác nhóm tuổi (test 4 tổ hợp); trần 60 công/tuần và 25% mùa; thầy không xem được lá số trò khi trò chưa bật căn cốt.
- [ ] Đồng tu: công thức §4.2.3 có test cho 5 ví dụ §4.2.4; người treo máy không vào `n`.
- [ ] Kim lan: thứ tự theo tuổi đạo, không đọc ngày sinh; «So duyên» không hiện điểm.
- [ ] Đạo lữ: ẩn hoàn toàn với tài khoản < 18; ba chế độ so; `hehunFromCards` khớp `computeHehun` trên 20 cặp; máy chủ không lưu thẻ (test: sau khi tính, storage/D1 không có trường nào của thẻ).
- [ ] Câu dẫn T2 luôn đứng trước `verdict`; dòng «Để tham khảo và chiêm nghiệm» luôn có.
- [ ] iOS: Bàn Hợp Hôn hai người chỉ có chế độ Không so.
- [ ] `inv/coop` được TownShard xử lý; nhóm 4 người, đoàn 12 người; đi theo trưởng nhóm bằng A*.
- [ ] Đạo hữu: 200 trần; ẩn mình ẩn được online + vùng; không bao giờ có tọa độ.
- [ ] Ghép tự động không bao giờ ghép khác nhóm tuổi (test ngẫu nhiên 10.000 lần ghép).
