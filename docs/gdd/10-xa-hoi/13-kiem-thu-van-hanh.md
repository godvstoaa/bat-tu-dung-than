# 10 · Phần 13 — Kiểm thử, vận hành trực tiếp, lộ trình, chỉ số

> Căn cứ: thước đo «xong» của `GAME-MMO-PROMPT-PLAN.md` («Mỗi tính năng có test tự động (node) cho luật chơi + kiểm tay trên khung 390×844; `npm run build` và `npm run build:ios` đều xanh; `verify:ios` + `verify:ios-path` xanh; 60 fps mục tiêu / ≥ 30 fps tối thiểu trên iPhone 12»); kịch bản test hiện có (`scripts/test-quan-protocol.mjs`, `scripts/test-quan-mmo.mjs` — 10 test WebSocket thật, chạy bằng `npm run test:mmo` khi `npm run dev:mmo` đang chạy, cổng 8788; `scripts/test-game-cosmetics.mjs`, `scripts/test-game-vanmenh.mjs` mới trong cây làm việc); bản sơ đồ §13.4 (M6: «Môn phái, sư đồ, mùa đầu tiên — tải 60 người / phòng (đã có test)»), §13.5 (chỉ số thành công), §14.

## 13.0 Các lớp kiểm thử

| Lớp | Công cụ | Chạy khi | Ví dụ hiện có |
|---|---|---|---|
| **Đơn vị (U)** | `node` + `node:assert/strict`, không mạng, không DOM | mỗi lần commit (`npm test` / script riêng) | `test-quan-protocol.mjs` |
| **Tích hợp (I)** | `node` mở WebSocket thật tới `wrangler dev` (`dev:mmo`) | trước khi gộp nhánh MMO | `test-quan-mmo.mjs` (welcome, join, mv, emo, say, bồ đoàn, tên xấu, báo cáo, rời, spam, phòng đầy 60) |
| **Lạm dụng (AB)** | như I, kịch bản tấn công | trước mỗi bản phát hành | — |
| **Tải (L)** | script node nhiều socket (không cần công cụ ngoài) | trước mốc S3, S5 | test «phòng đầy 60» trong `test-quan-mmo.mjs` là mầm |
| **Hỗn loạn (C)** | giết DO / làm chậm D1 trong `wrangler dev` | trước S5 | — |
| **Riêng tư (P)** | test tĩnh (rà mã) + test chạy (rà gói, storage, log) | mỗi commit (tĩnh), trước phát hành (chạy) | — |
| **Tay (M)** | trình duyệt 390 × 844, iPhone thật, 2–4 thiết bị | mỗi mốc | kiểm tay P1/P2 trong kế hoạch MMO |
| **Nội dung (N)** | biên bản duyệt của cố vấn | trước bật từng tông / lễ | — |

Đặt tên tệp: `scripts/test-social-<mảng>.mjs` (U), `scripts/test-social-ws.mjs` (I/AB), `scripts/load-social.mjs` (L).

---

## 13.1 Kiểm thử đơn vị (T-U)

### 13.1.1 Dữ liệu môn phái — `guild-data.js`

| Mã | Kiểm |
|---|---|
| T-U-01 | 9 tông đủ trường (Phần 01 §1.2); `MT.enabled === false`; không có tông `BM` mở |
| T-U-02 | mỗi tông 60 chữ tên tu (30 + 30) hoặc 3 + 40 (Phật giáo) hoặc 40 + 40 (Nho); không trùng trong danh sách |
| T-U-03 | 1.600 tổ hợp tên chi đường × 9 loại; tổ hợp trùng chữ bị loại; danh sách đen chặn đúng |
| T-U-04 | mỗi tông: `GUILD-Q-*-00…10`, `GUILD-RITE-*-01…04`, `GUILD-DT-*-01…11` tồn tại và mã duy nhất toàn bộ |
| T-U-05 | hành lễ đúng bảng Phần 02 §2.0.1; biến thể lễ theo can ngày cho 10 ngày mẫu (tính can bằng `lunar-javascript`) |
| T-U-06 | ma trận quyền Phần 01 §1.6.4: 15 hàng × 7 cấp = 105 ô, mỗi ô một khẳng định |

### 13.1.2 Luật môn phái

| Mã | Kiểm |
|---|---|
| T-U-10 | nghị sự: túc số 40% cử tri hoạt động; đa số; 2/3; phiếu trắng tính túc số; hết hạn không đủ túc số → `quorum` |
| T-U-11 | người bị nêu tên trong `NS-07/08` không bỏ phiếu được |
| T-U-12 | tối đa 5 nghị sự mở; 2 / tuần / người |
| T-U-13 | hạn mức chi theo vai; vượt cần `nid` `pass` |
| T-U-14 | trần góp 200 / ngày, 800 / tuần; R0 ≤ 50 |
| T-U-15 | Đạo Vọng: công thức đường lễ `(10 + 2 × min(n, 30)) × q × d` cho 6 bộ số; trần 2 lễ / tuần |
| T-U-16 | việc tuần: trần 40% / người; co giãn mục tiêu `clamp(n/20, 0,5, 1,5)` |
| T-U-17 | công trường: 8 đợt; 1,5 công khi ≥ 3 người trong 8 m; 40 lượt / ngày |
| T-U-18 | vắng mặt Chủ Trì 7/14/21 ngày; ngủ 30 ngày; hưu đường 75 ngày; kho đổ ra Quỹ Cầu Đường |
| T-U-19 | Ký Danh 7 ngày → R1 khi đã dự ≥ 1 lễ; R2 khi đủ 28 ngày + 4 lễ + cảnh giới 2 |

### 13.1.3 Quan hệ

| Mã | Kiểm |
|---|---|
| T-U-20 | sư đồ: chặn khác nhóm tuổi (4 tổ hợp); số trò theo cảnh giới 3/4/5 |
| T-U-21 | công đức thầy: +10/+10/+20/+20 theo mốc; trần 60 / tuần; trần 25% mùa |
| T-U-22 | đồng tu: công thức Phần 04 §4.2.3 cho 5 ví dụ §4.2.4; trần phần thêm 15 / ngày |
| T-U-23 | kim lan: thứ tự theo tuổi đạo; hòa thì theo thứ tự đồng ý |
| T-U-24 | `hehunFromCards(card(R1), card(R2))` = `computeHehun(R1, R2)` (score, rating, factors) trên 20 cặp, gồm `MAU-A`, `MAU-B`, các `MAU-C…` của tài liệu 04, cặp cùng giới, cặp khác nhóm mệnh quái |
| T-U-25 | chế độ so: lấy mức thấp hơn của hai bên (9 tổ hợp) |
| T-U-26 | câu dẫn T2 đúng theo `rating` (4 mức) |

### 13.1.4 Giao tiếp

| Mã | Kiểm |
|---|---|
| T-U-30 | `phrases.js`: 276 khóa; 8 khóa cũ y nguyên chữ; mọi khóa có VI + EN; ≤ 48 ký tự |
| T-U-31 | slot: số ô đúng khai báo; giá trị trong `SLOT_VALUES` |
| T-U-32 | không câu nhóm `an.*` / `chi.*` chứa tên hành, can, chi đơn lẻ có thể là đáp án (rà bằng biểu thức) |
| T-U-33 | `emotes.js`: 46 cử chỉ; 6 cũ y nguyên; cờ `target`, `zone`, `window` hợp lệ |
| T-U-34 | `cai_hoa`: gói phát ra không có trường màu |

### 13.1.5 Thiên Bảng

| Mã | Kiểm |
|---|---|
| T-U-40 | `ĐH_mùa` = Σ xác thực + min(offline + bán xác thực vượt trần, 0,3 × tổng) cho 8 bộ số |
| T-U-41 | Tinh Tiến: mẫu số `max(ĐH_mùa_trước, 200)`; lọc `ĐH ≥ 300` |
| T-U-42 | Đạo Vọng chuẩn `/ √max(n, 8)` |
| T-U-43 | mùa mở đúng giờ Lập Xuân 2027 và 2028; tháng nhuận 2028 tạo kỳ riêng |
| T-U-44 | Công Đức Bia: mặc định ẩn; dòng «và N người» đếm đúng |

### 13.1.6 Sự kiện máy chủ

| Mã | Kiểm |
|---|---|
| T-U-50 | độ hỏng 24 sơn từ `annualTabooOverview(2027)`, `(2028)` khớp Phần 08 §8.1.3 |
| T-U-51 | ánh xạ loại sát → loại việc (Phần 08 §8.1.4); rẻ quạt Ngũ Hoàng / Tam Sát / Tuế Phá không nhận việc «đào» |
| T-U-52 | `W` và `W_sơn` đúng ví dụ Phần 08 §8.6.2 (1.338.750; 141.990) |
| T-U-53 | giảm mục tiêu giữa chừng ≤ 2 lần; không tăng khi sớm |
| T-U-54 | độ hư đường: `mưa(tiết)` theo tiết khí; hệ quả theo ngưỡng; luôn có lối qua |
| T-U-55 | A* trên đồ thị đường: mọi vùng tới được khi mọi đoạn hư 100 |

### 13.1.7 Lễ tiết — `festivals.js`

| Mã | Kiểm |
|---|---|
| T-U-60 | 51 lễ; ngày 2027 và 2028 khớp bảng Phần 09 §9.0.8 và Phần 10 §10.0 |
| T-U-61 | `leap: 'skip'` (Đoan Ngọ 2028) |
| T-U-62 | `lunarLast` (Trừ tịch, Địa Tạng) với tháng 29 / 30 ngày |
| T-U-63 | `termSpan` Cửu Cửu: ngày 1 = Đông Chí, ngày 81 = `getShuJiu()` «九九第9天» |
| T-U-64 | thẻ «Hôm nay» ≤ 3 lễ theo `priority` (ngày 3/3) |
| T-U-65 | cờ `ios: false` lọc đúng (Tạ Thái Tuế, phần Thái Tuế của Lập Xuân) |
| T-U-66 | lễ ⚠ có `verify: true`; bộ dựng bản phát hành **từ chối** khi còn `verify: true` mà `enabled: true` |
| T-U-67 | bảng ngoại lệ lịch Việt: Tết 2007 = 2007-02-17 khi bật lịch Việt |

### 13.1.8 Riêng tư (tĩnh)

| Mã | Kiểm |
|---|---|
| T-P-01 | rà `net.js`, `net-sect.js`, mọi `send(` / `fetch(`: không tham chiếu `state.profiles`, `birth`, `input.year`, `input.month`, `input.day`, `input.hour` |
| T-P-02 | rà mô-đun giao thức: không khóa / hằng chứa `birth`, `ngaysinh`, `gio_sinh` |
| T-P-03 | rà lược đồ D1 và SQLite DO: không cột dữ liệu sinh ngoài `share.data` |
| T-P-04 | rà SectHall: không `UPDATE`/`DELETE` trên `kho_log`, `sect_log` |
| T-P-05 | rà `protocol-sect.js`: không `purpose` có đích `uid` |

---

## 13.2 Kiểm thử tích hợp (T-I) — WebSocket thật

Khung như `test-quan-mmo.mjs`: mỗi lần chạy dùng dải phòng ngẫu nhiên (`R0 = 30 + rand(15)`) để không đụng dữ liệu cũ; mỗi bước `step(name, fn)`; chờ gói bằng `wait(c, pred)`.

| Mã | Kịch bản | Khẳng định |
|---|---|---|
| T-I-01 | 2 client có `tok`; `welcome` có `uid`, `now`, `feats` | `now` lệch < 2 s so với đồng hồ máy chạy test |
| T-I-02 | client v1 (không `v`) và client v2 cùng phòng; v2 gửi `say` khóa mới | v1 nhận `say` với `tx` (không lỗi); v2 nhận `k` + `p` |
| T-I-03 | `say` khóa `chi.*` từ người không phải thầy | bị bỏ / `err E_PERM` |
| T-I-04 | lập chi đường (6 tài khoản) → `s_hello` → 6 người trong `here[]` | — |
| T-I-05 | đường lễ 5 người: 4 pha, 1 người không thao tác pha Tịnh | người đó không «dự đủ»; `n = 4` |
| T-I-06 | nghị sự `NS-07` mời ra R2: 6 cử tri, 4 thuận, 1 chống | 4/5 ≥ 2/3 → thông qua; người bị mời ra nhận thông báo kèm lý do |
| T-I-07 | hai client cùng gửi `kho_spend` 200 Phúc Khí khi hạn mức còn 300 | một thành công, một `E_LIMIT` |
| T-I-08 | công trường: 3 client vác trong 8 m | mỗi lượt 1,5 công; client vác < 4 s / lượt bị từ chối |
| T-I-09 | `ev_act` từ hai phòng khác nhau cùng `uid` | trần ngày tính chung |
| T-I-10 | TownShard gửi lại batch cũ (giả lập lỗi mạng) | EventHub không cộng hai lần |
| T-I-11 | đại lễ: 3 phòng nhận `ev_phase` cùng `at` | — |
| T-I-12 | `report` lý do `minor` | dòng D1 `priority = 'urgent'`; đối tượng bị khóa tương tác với nhóm T ngay |
| T-I-13 | `fr_add` người A → người T không qua mã | `E_AGE` |
| T-I-14 | `hh_card` chế độ `brief` | người kia chỉ nhận `rating`, `lead`, `verdict`; không `score`, `factors` |
| T-I-15 | `gift` khi đứng cách 6 m | `E_STATE` |
| T-I-16 | `emo incense` ngoài vùng điện | bị bỏ |
| T-I-17 | `mv` trong Thái Tuế Điện (ô x ≈ 1.260) | **sau khi sửa** `WORLD_TILES`: phát cho người khác (hiện tại: bị bỏ — test này phải đỏ trước khi sửa) |
| T-I-18 | `mvb`: phòng 10 client đi lại | mỗi client nhận ≤ 8 `mvb` / giây; không nhận `mv` lẻ (client v2) |
| T-I-19 | `lb {}` cũ | nhận `season`, `top`, `phai` như trước + trường mới |
| T-I-20 | xóa tài khoản | tên trong `here[]`, `s_roster`, `lb` thành «một người tu» |

---

## 13.3 Kiểm thử lạm dụng (T-AB)

26 ca của Phần 12 §12.9 — mỗi ca một kịch bản trong `test-social-ws.mjs` nhóm «AB». Ba ví dụ chi tiết:

**T-AB-01 dịch chuyển tức thời:**
```
client gửi mv (100, 100) rồi 125 ms sau mv (140, 100)   // 40 ô = 64 m trong 0,125 s
khẳng định: quãng hành hương không tăng; việc tuần «đi bộ» không tăng; không ev_act nào ở đoạn đường giữa được chấp nhận
```

**T-AB-05 rút kho đồng thời:** hai socket cùng `uid` Tri Khố (hai thiết bị) gửi `kho_spend` cùng mili-giây → tổng chi ≤ hạn mức; `kho_log` có đúng một dòng.

**T-AB-15 dò lá số qua hợp hôn:** tài khoản A gửi 20 `hh_card` giả khác nhau với cùng người B (mỗi lần mở lại `dl_req`) → máy chủ giới hạn `dl_req` cùng cặp 1 lần / 24 giờ; B ở chế độ `brief` → A chỉ thấy 4 mức; với 20 lần A không suy ra được gì hơn (khẳng định: tập phản hồi khác nhau ≤ 4).

---

## 13.4 Kiểm thử tải (T-L)

`scripts/load-social.mjs` — bot node, mỗi bot là một client v2 tối giản (gửi `mv` ngẫu nhiên theo đường đi bộ, thỉnh thoảng `say` / `emo`).

| Mã | Kịch bản | Ngưỡng đạt |
|---|---|---|
| T-L-01 | 1 phòng × 60 bot đi liên tục, có `mvb` | độ trễ `mv` → `mvb` p95 < 150 ms; DO không lỗi CPU; số lần gửi ra ≤ 500 / giây |
| T-L-02 | 50 phòng × 60 bot (3.000) | như trên cho mọi phòng; Worker không lỗi 5xx |
| T-L-03 | 150 SectHall × 20 bot làm đường lễ cùng giờ | `rite_end` đến trong ≤ 5 s sau pha cuối ở 100% đạo tràng |
| T-L-04 | EventHub nhận 30 batch / giây (mỗi batch 50 mục) trong 10 phút | không mất batch; độ trễ `ev_ack` p95 < 2 s |
| T-L-05 | 3.000 bot kết nối lại cùng lúc (giả lập mất mạng diện rộng) | `net.js` lùi dần ngẫu nhiên (thêm jitter ±30% — **cần làm**, hiện là `1500 × 2^(retry−1)` không jitter) ; 95% kết nối lại trong 60 s |
| T-L-06 | Cron tính bảng với 1.000.000 dòng `dh_ledger` | < 30 s / lần |

---

## 13.5 Kiểm thử hỗn loạn (T-C)

| Mã | Sự cố giả lập | Kỳ vọng |
|---|---|---|
| T-C-01 | SectHall khởi động lại giữa pha Hành | client tự kết nối lại; pha tiếp tục theo `at`; lễ kết thúc đúng; không mất Đạo Vọng |
| T-C-02 | EventHub không trả lời 5 phút | TownShard giữ batch, thử lại; sau khi hồi, tổng công đúng |
| T-C-03 | D1 chậm 3 s mỗi truy vấn | vào phòng vẫn được (hồ sơ dùng bộ đệm cũ); thư, bảng hiện «đang tải» |
| T-C-04 | Worker triển khai bản mới giữa giờ lễ | socket cũ đóng, client nối lại; lễ không hỏng (trạng thái trong DO) |
| T-C-05 | Đồng hồ client lệch 10 phút | đếm ngược đại lễ vẫn đúng (theo `welcome.now`); lễ tiết theo giờ máy chủ |

---

## 13.6 Kiểm thử riêng tư khi chạy (T-P, tiếp)

| Mã | Kiểm |
|---|---|
| T-P-10 | ghi toàn bộ gói client gửi trong 30 phút chơi đủ tính năng (proxy cục bộ) → không gói nào chứa ngày/giờ sinh, trụ tháng, trụ giờ, Tiềm Lực, Phẩm căn khi mức chia sẻ = 0 |
| T-P-11 | bật mức 1 với «phòng» → gói chỉ thêm `grade`, `cach` |
| T-P-12 | `hh_card` → rà storage TownShard, D1, log: không có giá trị thẻ |
| T-P-13 | «Ẩn màu bản mệnh» → người khác nhận `robe: 'trung'` |
| T-P-14 | nhóm T: không xuất hiện trong `lb` của người khác khi chưa bật |
| T-P-15 | xuất dữ liệu đủ bảng; xóa tài khoản xóa đủ bảng |

---

## 13.7 Duyệt nội dung (T-N)

| Mã | Nội dung | Người duyệt | Chặn phát hành gì |
|---|---|---|---|
| T-N-01 | Chính Nhất: lễ, danh xưng, «Lục Huyền Giới», ngày Thiên Sư ⚠ | cố vấn Đạo giáo Chính Nhất | `GUILD-CN` lễ tổ |
| T-N-02 | Võ Đang: Thái Cực trong lễ, ngày Trương Tam Phong ⚠ | cố vấn Võ Đang / Đạo giáo | `EV-TTP-01` |
| T-N-03 | Toàn Chân: khóa tụng (tên đoạn), ngày Trùng Dương ⚠ | cố vấn Toàn Chân | `EV-TRUNGDUONG-01` |
| T-N-04 | Mao Sơn: Âm tà (cổng), ngày hội ⚠ | cố vấn Đạo giáo + chuyên gia sức khỏe tâm thần (lời chuyển hướng) | `GUILD-TT` phần Âm tà, `EV-MAOSON-01` |
| T-N-05 | Phong Đô: hình ảnh âm phủ, Đăng Kiều | cố vấn Đạo giáo + Phật giáo | `GUILD-BD` |
| T-N-06 | Trúc Lâm: lễ, công án, ngày giỗ Tổ | cố vấn Phật giáo Việt Nam (Trúc Lâm) | `GUILD-TH`, `EV-TRUCLAM-01` |
| T-N-07 | Tịnh Độ: phóng sinh, niệm, Liên Đài | cố vấn Phật giáo Việt Nam | `GUILD-TD` |
| T-N-08 | Chuẩn Đề / Tạng | cố vấn Mật tông / Tạng truyền | **toàn bộ `GUILD-MT`, `EV-TONGKHACHBA-01`** |
| T-N-09 | Văn Miếu: Thích Điện, câu đối, ngày Chu Văn An ⚠ | cố vấn Hán Nôm / di sản | `GUILD-NH` lễ, `EV-CHUVANAN-01` |
| T-N-10 | Miêu Cương: Y Lư, Hội Khèn Trăng | cố vấn văn hóa dân tộc | `EV-KHENTRANG-01` |
| T-N-11 | Lễ quốc gia: Ngày Nhớ Cội, Tết, Vu Lan, Trung Thu | biên tập văn hóa Việt | các lễ tương ứng |
| T-N-12 | Thư viện 276 cụm từ, 46 cử chỉ | biên tập + kiểm tra an toàn (thử dùng để quấy rối) | Phần 06 |

Mẫu biên bản duyệt: mã mục · phiên bản nội dung · người duyệt · ngày · kết luận (đạt / sửa / không dùng) · ghi chú. Lưu trong `docs/gdd/` thư mục duyệt của tài liệu 14 (rủi ro).

---

## 13.8 Lộ trình triển khai

Bản sơ đồ đặt môn phái, sư đồ, mùa đầu tiên ở **M6** (sau M5). Lộ trình xã hội chia nhỏ để có thể bật dần (mỗi bước có cờ trong `feats`):

| Bước | Nội dung | Phụ thuộc | Điều kiện ra |
|---|---|---|---|
| **S0** · nền | danh tính bền (`/api/quan/id`, `tok`); D1 `account/device/profile/presence`; sửa `WORLD_TILES`; `mvb`; jitter kết nối lại; báo cáo → D1 | `npm run deploy` lần đầu (cần chủ dự án duyệt — kế hoạch MMO: «Khi nào deploy server thật») | T-U-30…34, T-I-01…02, 17…19; T-L-01 |
| **S1** · giao tiếp | 276 cụm từ, 46 cử chỉ, bánh xe nhanh, vùng im lặng, 10 lý do báo cáo, lọc tên mở rộng, `title` enum, «Ẩn màu bản mệnh» | S0 | T-U-30…34; T-N-12; T-P-13 |
| **S2** · bạn bè | đạo hữu, thư mẫu, quà nhỏ, nhóm tuổi, ẩn đồng bộ, nhóm đồng hành + đoàn, `inv/coop` xử lý, `solve/graded` | S1 | T-I-12…15; T-AB-18…20 |
| **S3** · tông môn | 9 tông (MT tắt), nhập tông, đạo hiệu, tông lễ tuần (NPC), Lầu Danh Bộ | S2; vùng thánh địa tương ứng đã có (M2–M5) | T-U-01…05; T-N-01…07, 09 |
| **S4** · chi đường | SectHall: lập, cấp bậc, chức sự, nghị sự, kho, công trường, đường lễ, việc tuần, đạo tràng bậc 1–3 | S3 | T-U-06, 10…19; T-I-04…08; T-AB-04…11, 23…25; T-L-03; T-C-01 |
| **S5** · sự kiện & mùa | EventHub, `EV-TMB` mùa đầu tiên, `EV-CAU`, Thiên Bảng (12 bảng), lễ tiết (lễ đã duyệt) | S4 | T-U-40…67; T-I-09…11; T-L-02, 04…06; T-C-02…05 |
| **S6** · quan hệ sâu | sư đồ, kim lan, đạo lữ (hợp hôn), công khai căn cốt, đạo tràng bậc 4–6, Hội Thiện, Luận Đạo Hội, Đàn Tràng Liên Tông | S5 | T-U-20…26; T-P-10…15; T-AB-15…17 |

Mùa đầu tiên nên mở đúng một **Lập Xuân** (vd Lập Xuân 2027-02-04 hoặc 2028-02-04) để `EV-TMB`, Thiên Bảng và lễ Tết khớp nhau. Nếu S5 xong giữa năm can chi, chạy «mùa thử» không thưởng tới Lập Xuân kế.

---

## 13.9 Cờ tính năng và công tắc khẩn

Lưu trong `ADMIN_KV` (đã có binding), đọc mỗi 60 giây, gửi cho client trong `welcome.feats`.

| Cờ | Tắt thì |
|---|---|
| `social.phrases_v2` | quay về 8 cụm từ cũ |
| `social.friends` | ẩn đạo hữu, thư |
| `social.gifts` | **khẩn:** chặn mọi `gift`, `lixi` (vd phát hiện lỗi nhân quà) |
| `social.mail` | chặn `mail_send` |
| `social.mentor`, `social.kimlan`, `social.partner` | ẩn từng quan hệ (giữ dữ liệu) |
| `sect.enabled` | đóng `/ws/sect` (đạo tràng hiện «đang tu sửa») |
| `sect.treasury_freeze` | **khẩn:** SectHall từ chối mọi `kho_spend` (vẫn nhận `kho_give`) |
| `events.<id>` | tạm dừng một sự kiện (tiến độ đóng băng, không mất) |
| `lb.publish` | dừng công bố bảng (vẫn tính) |
| `fest.<id>` | tắt một lễ (vd phát hiện sai ngày) |
| `guild.MT` | bật tông Chuẩn Đề sau tham vấn |
| `age.u13_mmo` | (mặc định tắt) — chỉ bật khi có luồng phụ huynh được pháp chế duyệt |

---

## 13.10 Vận hành trực tiếp

### 13.10.1 Lịch vận hành theo lễ

| Khi | Việc | Ai |
|---|---|---|
| 60 ngày trước mỗi lễ ⚠ | xác nhận ngày với cố vấn; cập nhật `verify` | biên tập văn hóa |
| 30 ngày trước Lập Xuân | chạy `annualTabooOverview(năm mới)` + `yearFlyingStar` → xem trước bản đồ hỏng Thiên Mệnh Bàn; viết lời Thầy Tử Bình cho năm (đọc danh sách cung kỵ) | thiết kế + biên tập |
| 7 ngày trước mỗi lễ lớn | kiểm cửa sổ lễ trên máy chủ thử (giả lập giờ) | QA |
| Ngày lễ | trực kiểm duyệt tăng cường (lễ đông → báo cáo tăng) | kiểm duyệt |
| Sau lễ | xem số liệu tham gia (§13.11), ghi bài học | thiết kế |

### 13.10.2 Việc hằng tuần

- Duyệt hàng báo cáo (thường ≤ 72 giờ; khẩn ≤ 2 giờ — Phần 05 §5.4.5).
- Duyệt cờ bất thường Thiên Bảng (Phần 07 §7.4.3) trước giờ Tý chốt.
- Xem «sức khỏe chi đường» (§13.11.2): chi đường có dấu hiệu bắt nạt (đuổi nhiều, khiếu nại).
- Cập nhật danh sách đen tên.

### 13.10.3 Sổ tay sự cố (runbook)

| Sự cố | Dấu hiệu | Xử lý ngay | Sau đó |
|---|---|---|---|
| Lỗi nhân quà / Phúc Khí | Phúc Khí trung bình nhảy > 3× trong 1 giờ | bật `social.gifts` = tắt; khóa tạm tài khoản liên quan | sửa, tính lại, **không** trừ người chơi vô tình hưởng (chỉ trừ người khai thác có chủ đích) |
| Sai ngày lễ | người chơi báo, biên tập xác nhận | tắt `fest.<id>`; thông báo xin lỗi trong game | sửa dữ liệu, bật lại; phát thưởng bù cho người đã dự |
| Kho chi đường bị rút bất thường | cờ `DONATE_SPIKE` hoặc báo cáo `guild` | `sect.treasury_freeze` cho chi đường đó (cờ theo `hid`) | điều tra Sổ Kho (append-only) |
| Làn sóng báo cáo `minor` | ≥ 5 / giờ | gọi người trực khẩn; tạm khóa tương tác A↔T của đối tượng | điều tra; báo cơ quan chức năng nếu có dấu hiệu tội phạm (theo luật — câu hỏi mở pháp chế) |
| DO lỗi hàng loạt | 5xx tăng | tắt `sect.enabled` / `events.*` theo phạm vi | xem log observability |
| Đại lễ không đồng bộ | phòng báo pha lệch | kéo dài pha 2 phút bằng cờ | sửa đồng bộ đồng hồ |

---

## 13.11 Chỉ số

### 13.11.1 Chỉ số trụ cột (nối bản sơ đồ §13.5)

| Chỉ số | Mục tiêu | Ghi chú |
|---|---|---|
| Giữ chân D7 nhóm **lá số thấp** (< 36 điểm) so với nhóm điểm cao | **không thấp hơn** | bản sơ đồ §13.5; đo **trên máy** rồi gửi chỉ **nhóm điểm** (3 nhóm: < 36, 36–57, ≥ 58) kèm sự kiện giữ chân — không gửi điểm, không gửi lá số |
| Tỷ lệ người lá số thấp vào **chi đường** so với nhóm cao | không thấp hơn 0,9 lần | nếu thấp → kiểm xem chi đường có lọc ngầm (không thể lọc theo lá số — chỉ cảnh giới / tuổi tài khoản) |
| Tỷ lệ người lá số thấp trong **top 100 Thiên Bảng** | ≥ tỷ lệ của họ trong dân số người chơi hoạt động | kiểm hệ số Nghịch Thiên có tác dụng |

### 13.11.2 Sức khỏe xã hội

| Chỉ số | Định nghĩa | Ngưỡng cảnh báo |
|---|---|---|
| Tỷ lệ có ≥ 1 đạo hữu sau 7 ngày | — | < 40% |
| Tỷ lệ trong chi đường (người cảnh giới ≥ 2) | — | < 25% sau mùa đầu |
| Phân bố đóng góp trong chi đường | hệ số Gini công vác + góp kho | > 0,7 (một vài người gánh) |
| Tỷ lệ đuổi người / chi đường / tháng | — | > 20% thành viên |
| Báo cáo / 1.000 phiên | — | tăng > 50% tuần qua tuần |
| Báo cáo `minor` / 10.000 phiên | — | bất kỳ tăng đột biến |
| Tỷ lệ báo cáo bị bác | — | > 60% (công cụ bị lạm dụng) |
| Tham gia lễ tuần | người dự / người trong tông | < 15% |
| Tham gia sự kiện máy chủ | người góp ≥ 1 công / `N7` | < 20% |
| Tham gia lễ tiết lớn | người dự / người online ngày lễ | < 30% |

### 13.11.3 Dữ liệu đo không được chứa

- Ngày/giờ sinh, trụ, Tiềm Lực, Phẩm căn dưới mọi dạng (chỉ **nhóm điểm 3 mức** cho chỉ số trụ cột, gửi từ máy, không gắn `uid` trong bảng phân tích — gắn mã phân tích riêng xoay vòng 90 ngày).
- Nội dung «Sổ đời thực» (canon §6 — sổ việc thiện ngoài đời, mặc định tắt) — **không bao giờ** gửi.
- Lựa chọn trong vùng riêng tư (cài hoa Vu Lan, ghi chú Thanh Minh, câu nhìn lại Táo Quân, câu trả lời Quán Tâm Động).

## 13.12 Checklist nghiệm thu Phần 13

- [ ] Mọi mã test T-U, T-I, T-AB, T-L, T-C, T-P, T-N có tệp / biên bản tương ứng trước bước S liên quan.
- [ ] `npm run test:mmo` mở rộng chạy được trên Windows qua `dev:mmo` (junction ASCII).
- [ ] T-I-17 đỏ trước khi sửa `WORLD_TILES`, xanh sau khi sửa.
- [ ] Cờ khẩn `social.gifts`, `sect.treasury_freeze` có hiệu lực trong ≤ 60 giây (test).
- [ ] Bảng chỉ số §13.11 có dashboard; không trường nào vi phạm §13.11.3.
