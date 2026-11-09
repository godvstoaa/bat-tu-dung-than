# 09-16 · Tu cùng nhau — cơ chế tập thể của hệ tu (MMO)

> Game đã có MMO (`net.js`, `worker/quan-room.js`, bồ đoàn Trà Thất mỗi chỗ một người — `protocol.js`). Phần này đặc tả **các cơ chế tu tập thể** mà các phần khác chỉ nhắc tên: lễ tuần tập thể, đồng tu, chuông chung, hộ pháp, chủ lễ, sư đồ trong hệ tu. Môn phái, kết nghĩa, lễ tiết lớn thuộc tài liệu 10; ở đây chỉ phần **chơi** và **thưởng tu**.

---

## 1. Nguyên tắc

| # | Nguyên tắc | Hệ quả |
|---|---|---|
| G1 | **Tu tập thể không bắt buộc** | mọi phần thưởng tập thể có đường đơn lẻ tương đương hoặc gần bằng (lễ tuần chơi được một mình với NPC) |
| G2 | **Không ai làm thay ai** | hộ pháp chỉ nới dung sai; trong lễ, điểm của mỗi người tính riêng rồi mới tính điểm nhóm |
| G3 | **Người giỏi không bị kéo xuống bởi người mới** | điểm nhóm chỉ **cộng thêm**, không trừ điểm cá nhân |
| G4 | **Người mới được đón** | lễ có vai cho bậc 1–2; người bậc cao nhận công khi người mới hoàn thành |
| G5 | **Mạng chập chờn không phạt** | thao tác nhịp chấm theo đồng hồ của **máy khách** rồi máy chủ kiểm hợp lý (§7) |

---

## 2. Lễ tuần tập thể (`ACT-041`)

### 2.1 Phòng lễ

| Thuộc tính | Giá trị |
|---|---|
| Sức chứa | 30 người / phòng lễ; quá 30 → mở phòng song song (cùng giờ, cùng nơi, bản sao) |
| Mở cửa | 10 phút trước giờ lễ (giờ Dậu buổi chính, giờ Thìn hôm sau buổi lặp — `09-08` §5.1) |
| Ai vào được | người có đạo chính hoặc đạo phụ trùng đạo của lễ; người khác vào xem (không nhận thưởng tu) |
| Không đủ người | < 3 người lúc bắt đầu → NPC đệ tử của thánh địa lấp chỗ (tối đa 6 NPC); lễ vẫn diễn ra |

### 2.2 Vai trong lễ

| Vai | Số lượng | Bậc tối thiểu | Việc | Thưởng thêm |
|---|---|---|---|---|
| Chủ lễ | 1 | 5 (6 với đại lễ máy chủ) | mở lễ, đọc lời khai, chọn bài tụng, kết lễ | 1 công |
| Chung đầu | 1 | 3 | đánh chuông mở / đóng lễ (`MG-17`, 18 tiếng chậm) | 1 công |
| Duy na (giữ nhịp) | 1 | 3 | gõ mõ dẫn nhịp tụng (`MG-06` chế độ dẫn) | 1 công |
| Hương đăng | 2 | 2 | thắp hương, thay đèn | 1 công |
| Đại chúng | còn lại | 1 | tụng theo nhịp, làm MG đặc trưng của đạo | — |

Vai được nhận theo thứ tự đăng ký trước 10 phút; không ai nhận thì NPC giữ vai. Một người chỉ một vai.

### 2.3 Diễn tiến (≈ 15 phút)

| Pha | Thời lượng | Nội dung | Chấm cá nhân | Chấm nhóm |
|---|---|---|---|---|
| Tập trung | 2' | vào sân, đứng theo hàng (vị trí tự xếp theo bậc: bậc cao đứng sau — truyền thống tùng lâm, bậc thấp được đứng gần điện để nhìn) | — | — |
| Chuông mở | 1' | Chung đầu đánh 18 tiếng | Chung đầu: `MG-17` | — |
| Tụng chung | 5' | mọi người gõ theo nhịp Duy na | `MG-06` (chấm theo nhịp của Duy na, không theo nhịp chuẩn — xem §2.4) | **độ đồng đều** |
| MG đặc trưng | 5' | theo đạo (`09-14` §0): Thái Cực tập thể, bái Đẩu tập thể, tọa thiền im lặng, bình giảng… | MG tương ứng | độ đồng đều / tỉ lệ hoàn thành |
| Hồi hướng, chuông đóng | 2' | chọn câu hồi hướng chung (bỏ phiếu 3 câu) | — | — |

### 2.4 Chấm theo nhịp của người dẫn

Trong tụng chung, mốc nhịp chuẩn là **nhịp của Duy na** (người chơi). Người đại chúng gõ trùng nhịp Duy na thì đạt, kể cả khi Duy na lệch nhịp chuẩn vài phần trăm. Duy na tự được chấm theo nhịp chuẩn. Ý nghĩa: tụng chung là **theo nhau**, không phải mỗi người theo máy.

### 2.5 Điểm nhóm và thưởng

```
đồngĐều = 1 − độLệchChuẩn(thời điểm gõ của mọi người quanh mỗi nhịp) / dungSai      (cắt trong [0, 1])
hoànThành = số người đạt s_min ở MG đặc trưng / số người dự (không tính NPC)
điểmNhóm = 0,6 × đồngĐều + 0,4 × hoànThành
Thưởng mỗi người (ngoài trần, một lần / tuần): 15 thô (09-03 §5.4)  +  thưởng nhóm 0–5 thô = round(5 × điểmNhóm)
```

Thưởng nhóm 0–5 thô **nằm trong** trần tuần 60 (`09-03` §5.4). Người dự một mình với NPC: điểm nhóm tính như NPC luôn đúng nhịp → tối đa 5 (G1).

### 2.6 Lời mở và kết mẫu (Chủ lễ chọn, máy hiện cho mọi người)

```
[CẢNH ACT-041.MO · sân đạo tràng · giờ Dậu]
CHỦ LỄ (người chơi): (chọn 1 trong 3 lời khai)
  ① «Hôm nay đông người. Ta tụng chậm để người đến sau theo kịp.»
  ② «Tuần qua ai đã giúp được một người, hãy nghĩ tới người ấy khi gõ mõ.»
  ③ «Không ai ở đây hơn ai. Ta chỉ đứng trước để gõ chuông thôi.»
[CẢNH ACT-041.KET]
CHỦ LỄ: (chọn câu hồi hướng thắng phiếu — từ REMEDY_QUOTES hoặc TEN_THIEN)
```

Lời khai và hồi hướng **chọn từ danh sách** (không văn bản tự do) để tránh nội dung xấu trong không gian thờ tự.

---

## 3. Đồng tu (`ACT-042`)

| Mục | Quy định |
|---|---|
| Nơi | Trà Thất Sơn Môn (3 bồ đoàn hiện có — `protocol.js`) mở rộng thành 5 bồ đoàn; thiền đường mỗi thánh địa (9–12 bồ đoàn) |
| Điều kiện | 5 tài khoản khác nhau cùng ngồi `MG-01` ≥ 10 phút trong cùng phòng, thời gian ngồi chồng nhau ≥ 10 phút |
| Hiệu ứng khi đang đồng tu | dung sai nhịp `MG-01` ×1,15 cho mọi người (canon §10: «ngồi thiền cùng nhau giúp tĩnh tọa ổn định hơn») |
| Thưởng | 5 thô ngoài trần / tuần (lần đầu trong tuần) |
| Đồng bộ nhịp | tùy chọn «thở cùng nhau»: vòng hơi thở của mọi người chạy cùng pha (máy chủ phát mốc pha mỗi 14 giây); không bắt buộc |
| Chống lạm dụng | `09-03` §12: mỗi tài khoản cần ≥ 3 ngày tu trong 14 ngày; không tính tài khoản cùng thiết bị |

---

## 4. Chuông chung (`MG-17` trong MMO)

| Mục | Quy định |
|---|---|
| Số chuông | 1 chuông Sơn Môn + 1 chuông Chùa Đồng (Yên Tử) + chuông mỗi thánh địa có lầu chuông; mỗi phòng máy chủ một bản |
| Hàng chờ | tối đa 10 người; mỗi lượt 54 tiếng ≈ 3 phút; người thứ 10 chờ ≈ 27 phút → hiện thời gian chờ, cho rời hàng mà giữ chỗ 5 phút |
| Người nghe | mọi người trong bán kính 400 m nghe tiếng (âm không gian); đứng nghe ≥ 30 giây → +1 NK (`ACT-119`) |
| Ưu tiên | trong khung lễ (giờ Mão–Thìn, Dậu–Tuất), người chưa đánh hôm nay được xếp trước người đã đánh |
| Gián đoạn | người đánh mất mạng → lượt kết thúc ở tiếng hiện tại; người kế tiếp bắt đầu sau 10 giây im lặng |

---

## 5. Hộ pháp (`ACT-115`, `ACT-113`)

| Mục | Quy định |
|---|---|
| Kích hoạt | khi một người bắt đầu pha Nghệ của độ kiếp, máy chủ phát `tu.kiepStart` cho phòng; người trong 20 m thấy nút «Hộ pháp» |
| Điều kiện người hộ pháp | bậc ≥ 2; đứng yên (hoặc ngồi bồ đoàn gần đó) suốt pha; không đang chơi MG khác |
| Hiệu ứng | dung sai thời gian pha Nghệ ×1,1 mỗi người, tối đa ×1,2 (`09-02` §1.5) |
| Thưởng | 1 công / lần, ≤ 2 / ngày; không thô |
| Riêng tư | người độ kiếp có thể tắt «cho phép hộ pháp»; lựa chọn pha Tâm không ai thấy |
| Côn Lôn | `ACT-K6-QN`: người bậc 6 đứng bên Vân Kiều hộ pháp (`ACT-113`) |

---

## 6. Sư đồ trong hệ tu

Tài liệu 10 sở hữu luật sư đồ. Hệ tu thêm:

| Cơ chế | Quy định |
|---|---|
| Điều kiện sư phụ | bậc ≥ 4 (canon §10); ≤ 3 đệ tử đang theo |
| Điều kiện đệ tử | bậc ≤ sư phụ − 2 |
| Việc tuần | `ACT-118`: sư phụ chọn một việc cho đệ tử từ gợi ý theo tầng Mệnh Đồ chậm nhất |
| Dạy trực tiếp | `ACT-064` (Thái Cực), `ACT-076` (lớp chữ), chế độ «dẫn tập» / «viết cùng» của MG: sư phụ làm mẫu, đệ tử làm theo cùng lúc; đệ tử nhận thô MG bình thường; sư phụ nhận 1 công / buổi |
| Độ kiếp của đệ tử | sư phụ nhận thông báo; hộ pháp cho đệ tử được tính như hộ pháp thường |
| Khi đệ tử lên bậc | sư phụ nhận 2 công (một lần mỗi bậc của mỗi đệ tử) |
| Kết thúc | đệ tử lên ngang bậc sư phụ − 1 → «xuất sư» (thư cảm ơn, danh hiệu «Đã xuất sư dưới <đạo hiệu thầy>») |
| Chống lạm dụng | công từ sư đồ chỉ tính khi đệ tử là tài khoản ≥ 14 ngày tu; một thiết bị không thể vừa là thầy vừa là trò |

---

## 7. Đồng bộ thời gian và độ trễ

| Vấn đề | Giải pháp |
|---|---|
| Nhịp tụng / chuông cần chính xác tới 100–300 ms | máy khách ghi thời điểm thao tác theo **đồng hồ máy khách đã đồng bộ** (đo lệch đồng hồ với máy chủ đầu phiên, như thuật toán NTP đơn giản: 5 lần hỏi – đáp, lấy trung vị) |
| Độ trễ mạng thay đổi | điểm cá nhân chấm theo thời điểm đã hiệu chỉnh, không theo lúc gói tin tới máy chủ |
| Gian lận sửa đồng hồ | máy chủ so thời điểm khai báo với thời điểm nhận ± (RTT/2 + 500 ms); lệch hơn → bỏ thao tác đó, không phạt |
| Hiển thị người khác | nhân vật khác gõ mõ / lạy với độ trễ ≤ 300 ms (nội suy); không ảnh hưởng điểm |
| Mất mạng giữa lễ | người đó coi như rời lễ ở pha hiện tại; vẫn nhận 15 thô nếu đã dự ≥ 2 pha |

---

## 8. Đại lễ máy chủ (Sóc, Vọng, lễ tiết — `ACT-045`, `ACT-046`, `ACT-050`, `ACT-112`)

| Mục | Quy định |
|---|---|
| Nơi | quảng trường Sơn Môn (mọi đạo cùng dự) |
| Sức chứa | 200 người / phòng; quá → phòng song song, mỗi phòng một chủ lễ |
| Chủ lễ | người bậc 6 đăng ký trước 24 giờ; nhiều người đăng ký → luân phiên theo thứ tự ít chủ lễ nhất; không có → NPC Lão Tùng chủ lễ |
| Diễn tiến | chuông 18 tiếng → dâng hương (mỗi người một lần chạm) → tụng 3 phút → thả đèn (web) / dâng hương tưởng niệm (iOS) → hồi hướng |
| Thưởng | 15 thô ngoài trần (Sóc / Vọng); chủ lễ 5 công |
| Không bắt buộc giờ tập trung | ai không dự giờ tập trung vẫn làm phần lễ cá nhân trong ngày (`09-08` §5.2) |
| Hiệu năng | > 30 nhân vật trong tầm nhìn → hạ hiệu ứng (`09-01` §8.6); thao tác dâng hương gom theo lô 1 giây |

---

## 9. Đo lường riêng cho tu tập thể

| Sự kiện | Trường |
|---|---|
| `ritual_room` | `act_id, room_id, players, npcs, roles_filled[]` |
| `ritual_group_score` | `room_id, dong_deu, hoan_thanh, diem_nhom` |
| `dongtu_session` | `room_id, players, overlap_min, sync_breath (bool)` |
| `bell_queue` | `room, queue_len, wait_s, left_queue (bool)` |
| `hophap` | `kiep_id, helpers, effect` |
| `master_task` | `master_id_hash, task_act_id, done (bool)` |
| `clock_skew` | `skew_ms, rtt_ms` (để chỉnh dung sai) |

Chỉ tiêu: ≥ 40% lễ tuần có ≥ 3 người thật; thời gian chờ chuông trung vị ≤ 5 phút trong khung lễ; tỉ lệ thao tác nhịp bị bỏ do lệch đồng hồ < 1%.

---

## 10. Nghiệm thu

- [ ] Lễ tuần chạy được với 1 người thật + NPC, và với 30 người thật.
- [ ] Điểm nhóm chỉ cộng; không người nào mất điểm cá nhân vì người khác.
- [ ] Nhịp tụng chấm theo Duy na; Duy na chấm theo nhịp chuẩn.
- [ ] Đồng tu cần 5 tài khoản hợp lệ; dung sai ×1,15 chỉ khi đủ điều kiện.
- [ ] Hàng chờ chuông hiện thời gian chờ, giữ chỗ 5 phút.
- [ ] Hộ pháp tắt được; không lộ lựa chọn pha Tâm.
- [ ] Đồng bộ đồng hồ: test với RTT 50 / 200 / 600 ms, lệch đồng hồ ±2 s.
- [ ] Lời khai, hồi hướng chỉ chọn từ danh sách.
