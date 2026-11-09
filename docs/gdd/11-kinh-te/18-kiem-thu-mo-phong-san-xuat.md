# 11 · Phần 18 — Kiểm thử kinh tế, mô phỏng, phân tích độ nhạy, đặc tả sản xuất món

> Bộ ca kiểm thử cho mọi luật kinh tế trong tài liệu 11; đặc tả công cụ mô phỏng (để phần 03 §5 chạy lại được); phân tích độ nhạy của các hằng số quan trọng; ngân sách sản xuất và hiệu năng cho món thẩm mỹ.
>
> Mã công việc và tên tệp test cuối cùng do tài liệu 13 cấp; ở đây ghi tệp test **đã có** khi ca kiểm bổ sung vào đó (`scripts/test-game-state.mjs`, `scripts/test-game-cosmetics.mjs`, `scripts/test-game-progress.mjs`, `scripts/test-quan-mmo.mjs`, `scripts/test-quan-protocol.mjs`), và «mới» khi cần tệp mới.

---

## 1. Ca kiểm thử

Ký hiệu «K-nn» là số thứ tự trong phần này. Cột «Loại»: Đ = đơn vị (node, không DOM — đúng phong cách `state.js` «Thuần logic … test được bằng node»), T = tích hợp máy chủ, G = giao diện.

### 1.1 Phúc Khí (`state.js`)

| # | Loại | Ca | Kỳ vọng | Tệp |
|---|---|---|---|---|
| K-01 | Đ | `grantDaily(s, 'compass')` hai lần cùng ngày | lần 1: 5; lần 2: 0 | test-game-state |
| K-02 | Đ | `grantDaily` sang ngày mới (`now` + 1 ngày) | nhận lại 5 | test-game-state |
| K-03 | Đ | `addTeaMinutes(s, 20)` | nhận 15 (trần `CAPS.teaPerDay`), `daily.teaMin = 20` | test-game-state |
| K-04 | Đ | `recordStick` 4 thẻ thuận trong ngày | 3 + 3 + 3 + 0 | test-game-state |
| K-05 | Đ | `recordStick` thẻ không thuận (`accepted: false`) | 0, không tăng `daily.sticks` | test-game-state |
| K-06 | Đ | `recordStick` thẻ Thượng Thượng và Hạ Hạ | **cùng** 3 (thưởng không phụ thuộc thẻ — phần 01 §3.2) | test-game-state |
| K-07 | Đ | `recordCase` kind `npc` điểm 1,0, không bộ | 15 | test-game-state |
| K-08 | Đ | `recordCase` kind `npc` điểm 1,0, `wardrobe.bonus = 0.1` | **17** (làm tròn kép — phần 02 §2.1) | test-game-state |
| K-09 | Đ | `recordCase` kind `npc` khách thứ 4 trong ngày | 0 | test-game-state |
| K-10 | Đ | `recordCase` kind `classical` lần đầu 0,55 rồi 0,62 | 0 rồi 25 | test-game-state |
| K-11 | Đ | `recordCase` kind `classical` đã ≥ 0,6, giải lại 0,9 | 0 | test-game-state |
| K-12 | Đ | `recordCase` kind `desk` cùng sảnh hai lần / ngày | lần 2: 0 | test-game-state |
| K-13 | Đ | `lightLamp` năm mới, rồi cùng ngày, rồi ngày sau | 10, 0, 3 | test-game-state |
| K-14 | Đ | `settleTasks` khi đủ 3 việc | 5, chuỗi + 1 | test-game-state |
| K-15 | Đ | **(sau sửa PK-1)** mua món 260 PK khi `phucKhi` 520, `xp` 520 | danh xưng vẫn «Tri Âm Huyền Quán» | test-game-state |
| K-16 | Đ | **(sau sửa PK-1)** trà Shan Tuyết mở theo `xp` ≥ 250 dù `phucKhi` < 250 | mở | test-game-state |
| K-17 | Đ | **(sau sửa PK-2)** thêm lá số A → xóa → thêm lại A | lần 2: 0 | test-game-state |
| K-18 | Đ | **(sau sửa PK-2)** thêm 11 lá số khác nhau | 10 lá đầu: 10 mỗi lá; lá 11: 0 | test-game-state |
| K-19 | Đ | `addPhuc` âm (nếu có nguồn trừ) | `xp` không giảm (`Math.max(0, n)`) | test-game-state |

### 1.2 Ngọc và tủ đồ (`cosmetics.js`)

| # | Loại | Ca | Kỳ vọng | Tệp |
|---|---|---|---|---|
| K-20 | Đ | `checkin` 7 ngày liền | 10, 15, 20, 25, 30, 40, 80 | test-game-cosmetics |
| K-21 | Đ | `checkin` ngày 1, 2, (bỏ 3), 4 — quy tắc cũ | 10, 15, 10 | test-game-cosmetics |
| K-22 | Đ | như K-21, quy tắc **tạm dừng** (phần 03 NG-1) | 10, 15, 20 | test-game-cosmetics |
| K-23 | Đ | `checkin` hai lần cùng ngày | lần 2 `ok: false` | test-game-cosmetics |
| K-24 | Đ | `vipDaily(s, true)` hai lần cùng ngày | 30, 0 | test-game-cosmetics |
| K-25 | Đ | `vipDaily(s, false)` | 0 | test-game-cosmetics |
| K-26 | Đ | `levelGifts(s, 5)` khi `levelGift = 1` | 80; lần 2 cùng cấp: 0 | test-game-cosmetics |
| K-27 | Đ | `canBuy` món VIP khi không VIP | `ok: false`, «Chỉ dành cho VIP.» | test-game-cosmetics |
| K-28 | Đ | `canBuy` `khung_long` chuỗi 6 | khóa; chuỗi 7: mở (quy tắc mới: 7 lần trong 9 ngày) | test-game-cosmetics |
| K-29 | Đ | `buy` món Ngọc khi thiếu 1 Ngọc | `ok: false`; số dư không đổi | test-game-cosmetics |
| K-30 | Đ | `buy` thành công | số dư trừ đúng; `owned` thêm; `xp` **không** đổi khi mua bằng PK | test-game-cosmetics |
| K-31 | Đ | `setBonus` đủ 4 món bộ Mộc, `yongWx = '木'` | `matched: true`, `bonus: 0.1` | test-game-cosmetics |
| K-32 | Đ | `setBonus` đủ bộ Mộc, `yongWx = '火'` | `matched: false`, `bonus: 0` | test-game-cosmetics |
| K-33 | Đ | **(sau bình giá)** bộ Hỏa bằng thân bộ mới `hoa_quan`, `hoa_dai`, `aura_hoa` + `y_hoa` | `matched` khi Dụng Hỏa | test-game-cosmetics |
| K-34 | Đ | **(sau bình giá)** bộ Hỏa trộn thân bộ và tôn bộ (`kim_quan` thay `hoa_quan`) | vẫn tính bộ | test-game-cosmetics |
| K-35 | Đ | `decodeCos` chuỗi > 240 ký tự | `{}` | test-quan-protocol |
| K-36 | Đ | `cleanCos` với món sai ô | bỏ món đó | test-quan-protocol |
| K-37 | Đ | lint L1–L12 (phần 04 §9) | xanh | test-game-cosmetics |

### 1.3 Cấp (`progress.js`)

| # | Loại | Ca | Kỳ vọng | Tệp |
|---|---|---|---|---|
| K-38 | Đ | `levelOf(xpFor(L))` với L = 1…100 | = L | test-game-progress |
| K-39 | Đ | `levelOf(xpFor(L) − 1)` với L = 2…100 | = L − 1 | test-game-progress |
| K-40 | Đ | `unlocked(s, 'fly')` cấp 7, VIP | true (hiện tại); **sau tách Ngự Vân** (phần 01 §4.2): `ngu_van` true, `ngu_kiem` false cho tới cảnh giới 3 | test-game-progress |
| K-41 | Đ | `unlocked(s, 'halo')` VIP cấp 9 | false (pháp quang không mở sớm) | test-game-progress |

### 1.4 Máy chủ kinh tế (mới)

| # | Loại | Ca | Kỳ vọng |
|---|---|---|---|
| K-42 | T | hai lệnh `/api/eco/buy` đồng thời cùng tài khoản, số dư chỉ đủ một | đúng một thành công |
| K-43 | T | `/api/eco/buy` lặp cùng `idempotencyKey` | trả kết quả cũ, không trừ hai lần |
| K-44 | T | `/api/eco/reward` án khách thứ 4 | 0 |
| K-45 | T | đổi đồng hồ client + `/api/eco/checkin` | máy chủ từ chối nếu ngày kinh tế chưa đổi |
| K-46 | T | thứ tự tiêu: `ngoc_free` 100, `ngoc_paid` 300, mua 160 | free 0, paid 240 |
| K-47 | T | sổ cái: Σ delta = số dư sau 10.000 giao dịch ngẫu nhiên | bằng |
| K-48 | T | ngân sách ngày: nhận 300 thô từ nguồn chịu ngân sách | 250 + 25 = 275 |
| K-49 | T | Án Cổ (không chịu ngân sách) sau khi đã chạm 400 | đủ 25 |
| K-50 | T | di trú `localStorage` với `ngoc` 9.999 | nhận 3.000; lần 2: từ chối |
| K-51 | T | di trú có `state.vip.until` tương lai | VIP **không** được cấp |
| K-52 | T | phiếu trang bị MMO hết hạn | TownShard phát mặc định |
| K-53 | T | phiếu có món không sở hữu (giả mạo chữ ký) | TownShard từ chối |

### 1.5 Thanh toán (mới)

| # | Loại | Ca | Kỳ vọng |
|---|---|---|---|
| K-54 | T | VNPay IPN đúng chữ ký, đúng số tiền | `RspCode 00`, cấp đúng một lần |
| K-55 | T | VNPay IPN lặp 5 lần | cấp một lần; lần 2–5 `RspCode 02` |
| K-56 | T | VNPay IPN sai số tiền | `RspCode 04`, không cấp |
| K-57 | T | VNPay IPN sai chữ ký | `RspCode 97`, không cấp |
| K-58 | T | gọi `returnUrl` với `vnp_ResponseCode=00` giả | không cấp |
| K-59 | T | MoMo IPN chữ ký sai | không cấp; trả mã lỗi theo tài liệu MoMo (không trả 204 thành công); ghi cảnh báo |
| K-60 | T | ZaloPay callback `mac` sai | `return_code` ≤ 0 (mẫu tích hợp dùng −1 cho MAC sai), không cấp |
| K-61 | T | Stripe webhook quá 5 phút | từ chối |
| K-62 | T | Apple JWS `bundleId` khác | từ chối |
| K-63 | T | Apple JWS `appAccountToken` khác tài khoản | từ chối, đánh dấu |
| K-64 | T | Apple `REFUND` cho gói Ngọc đã tiêu một nửa | `ngoc_paid` âm; mua bằng Ngọc bị chặn; món giữ |
| K-65 | T | Google purchase chưa `acknowledge` sau 24 giờ | cảnh báo |
| K-66 | T | Google RTDN với token Pub/Sub sai audience | từ chối |
| K-67 | T | mua Kim Thư khi đã có Kim Thư chương này | `/api/pay/quote` → `owned` |
| K-68 | T | mua Kim Thư ở bậc 14 | nhận ngay thưởng Kim Thư bậc 1–14 |
| K-69 | T | hết chương, còn thưởng chưa nhận | tự nhận |

### 1.6 Đạo Lộ

| # | Loại | Ca | Kỳ vọng |
|---|---|---|---|
| K-70 | T | LĐ ngày vượt 600 | cắt 600 |
| K-71 | T | tuần kiếm 1.800 (< 2.400) | quỹ Lộ Dư + 600 |
| K-72 | T | quỹ Lộ Dư 600, kiếm 400 tuần sau | nhận 800, quỹ còn 200 |
| K-73 | T | quỹ Lộ Dư đầy 9.600, tuần thiếu tiếp | quỹ giữ 9.600 |
| K-74 | T | tuần lẻ 4 ngày | trần 2.290, ngưỡng Lộ Dư 1.370 |
| K-75 | T | xem Thái Tuế Điện, xin xăm, hỏi AI | 0 LĐ |
| K-76 | T | Lộ Thư hoàn thành 6 việc | chỉ 4 việc tính (800 LĐ) |

### 1.7 Rào chắn

| # | Loại | Ca | Kỳ vọng |
|---|---|---|---|
| K-77 | G | mở Y Các 3 phút sau Mệnh Bàn | mục «Đề cử» ẩn, giảm giá ẩn, danh mục trơn hiện |
| K-78 | G | mở Y Các 11 phút sau Mệnh Bàn | bình thường |
| K-79 | T | tài khoản 16–17 mua `SKU-P-05` | `/api/pay/quote` → `age` |
| K-80 | T | tài khoản 16–17 đã nạp 450.000đ, mua 109.000đ | `limit_minor` |
| K-81 | T | tự đặt trần 0, rồi nâng lên 1.000.000đ | trần mới hiệu lực sau 7 ngày |
| K-82 | T | tổng 30 ngày vượt 2.000.000đ | sự kiện `guard_spend_summary` một lần |
| K-83 | T | hỏi Thầy AI cùng câu chuẩn hóa lần thứ 3 trong 24 giờ | không tính lượt; `SKU-U-03` ẩn 24 giờ |
| K-84 | T | cờ khủng hoảng trong phiên | cửa hàng ẩn; khuyến mãi tắt 72 giờ |
| K-85 | G | lễ Vu Lan | thẻ 🏮 Lễ không có món bán; có quà bông hồng |
| K-86 | Đ | lint iOS (phần 14 §7) trên `dist-ios` | xanh |

---

## 2. Công cụ mô phỏng

### 2.1 Đặc tả

| Mục | Đặc tả |
|---|---|
| Vị trí đề xuất | `scripts/` (tài liệu 13 đặt tên, ví dụ một script mô phỏng kinh tế chạy bằng node) |
| Nguồn hằng số | **import trực tiếp** `src/game/state.js`, `cosmetics.js`, `progress.js` — không chép số, để mô phỏng luôn khớp code |
| Đầu vào | tệp cấu hình kiểu người chơi (JSON): ngày chơi trong tuần, việc mỗi ngày, điểm án trung bình, số Án Cổ / ngày, có VIP, có mua bộ, ngân sách bật / tắt, quy tắc chuỗi |
| Đầu ra | CSV theo ngày: `xp`, cấp, Phúc Khí, Ngọc (tặng / nạp), ngày có bộ, LĐ, bậc Đạo Lộ |
| Tiêu chí | chạy lại phần 03 §5.4 khớp ± 2% |
| Chạy | trong CI khi đổi `state.js` hoặc `cosmetics.js` (cảnh báo nếu kết quả lệch > 10% so với lần trước — thay đổi kinh tế phải có chủ ý) |

### 2.2 Kiểu người chơi chuẩn

| Mã | Ngày chơi | Việc nhỏ / ngày (PK) | Án + sảnh / ngày (PK, không bộ → có bộ) | Án Cổ / ngày | VIP |
|---|---|---|---|---|---|
| A | T2, T3, T5, T7 | 28 (lịch 2, nhang 5, La Bàn 5, 3 việc 5, trà 8, xăm 3) | 16 → 18 (1 án + 1 sảnh, điểm 0,55) | 0 | không |
| B | mỗi ngày | 47 (La Bàn 5, xăm 9, nhang 5, lịch 2, hoa đăng 3, 3 việc 5, trà 15, đèn 3) | 132 → 143 (3 án + 8 sảnh, điểm 0,82) | 2 (tới hết 38) | không |
| B-iOS | mỗi ngày | 32 (bỏ xăm, hoa đăng, đèn) | như B | 2 | không |
| C | mỗi ngày | 33 | 70 → 77 (3 án + 4 sảnh, điểm 0,65) | 0,5 | có |
| AAA | mỗi ngày | 47 + 253 nguồn dự kiến (phần 02 §3.3) | như B | 2 | không |

---

## 3. Phân tích độ nhạy (52 tuần)

Chạy mô phỏng §2 với quy tắc chuỗi tạm dừng, đổi từng hằng số một.

### 3.1 Ngọc miễn phí cuối năm (đã trừ 570 bộ)

| Thay đổi | A | B | C |
|---|---|---|---|
| Gốc | 6.330 | 12.050 | 22.690 |
| `CHECKIN` × 0,5 (5, 8, 10, 13, 15, 20, 40) | 3.120 (−51%) | 6.382 (−47%) | 17.022 (−25%) |
| `LEVEL_GIFT` = 0 | 5.910 (−7%) | 10.870 (−10%) | 21.790 (−4%) |
| `VIP_DAILY` = 20 | — | — | 19.050 (−16%) |
| Bộ giá 960 (bộ Hỏa cũ) | 5.940 | 11.660 | 22.300 |

**Đọc:** điểm danh là đòn bẩy lớn nhất của Ngọc miễn phí; quà cấp nhỏ. Muốn chỉnh tốc độ Ngọc của người chơi miễn phí thì chỉnh `CHECKIN` (thay đổi loại B nếu giảm — phần 16 §3.1).

### 3.2 Ngày có bộ Hợp mệnh

| Giá bộ | A | B | C |
|---|---|---|---|
| 570 (bình giá) | ngày 29 | ngày 13 | ngày 8 |
| 960 (bộ Hỏa trước bình giá) | **ngày 48** | **ngày 21** | ngày 14 |

**Đọc:** trước bình giá, người chơi Dụng Hỏa chơi thong thả chờ lâu hơn **19 ngày** (gần 3 tuần) để có cùng +10% — bằng chứng số cho phần 01 §4.1.

### 3.3 Ngân sách ngày Phúc Khí (bản AAA, kiểu AAA)

| Tuần | Không ngân sách: `xp` · cấp | Có ngân sách: `xp` · cấp | Giảm |
|---|---|---|---|
| 4 | 13.281 · 26 | 9.513 · 22 | −28% |
| 12 | 38.089 · 44 | 28.194 · 38 | −26% |
| 52 | 162.129 · 91 | 121.602 · 78 | −25% |

**Đọc:** không có ngân sách, người chơi chăm bản AAA lên cấp 91 năm đầu — đường cong cấp `20·(L−1)²` bị phá vì nguồn tăng gấp đôi. Ngân sách đưa về cấp 78; nếu muốn giữ «năm đầu ~cấp 60» như bản hiện tại, hạ ngưỡng thứ nhất từ 250 xuống ~200 (cần chạy lại khi các hoạt động dự kiến có số thật).

---

## 4. Đặc tả sản xuất và hiệu năng món

### 4.1 Ngân sách theo ô

| Ô | Cách làm (code hiện có) | Tam giác tối đa | Kết cấu | Hạt tối đa | Xương gắn | Chi phí khung hình (máy chuẩn) |
|---|---|---|---|---|---|---|
| robe | tô HSV `look.pri` / `look.acc` (`characters.js › tintMaterial`) + kết cấu họa tiết tùy chọn | 0 (dùng lưới nhân vật) | 512² họa tiết | — | — | ≤ 0,1 ms |
| head | dựng thủ công (`accessories.js`), bám Head | 800 | 256² | — | Head | ≤ 0,2 ms |
| back | thủ công, bám Spine02 | 1.500 (cánh 3.000) | 512² | — | Spine02 | ≤ 0,4 ms (cánh ≤ 0,8) |
| hand | thủ công, bám RightHand; ngồi trà thì cất (`characters.js › hold`) | 800 | 256² | — | RightHand | ≤ 0,2 ms |
| aura | skin hiệu ứng (`effects.js`) | — | 128² hạt | 120 | gốc nhân vật | ≤ 0,5 ms |
| trail | skin hiệu ứng | — | 128² | 80 | chân | ≤ 0,4 ms |
| mount | mô hình lớn + chuyển động (`accessories.js`) | 4.000 | 1024² | 60 | gốc khi bay | ≤ 1,0 ms |
| frame | CSS | — | — | — | — | không đáng kể |

Trong phòng MMO (tới 60 người — sơ đồ tổng §13.4 «tải 60 người / phòng»), hạt hào quang / vệt bước của người khác giảm còn 30% ở khoảng cách > 20 m, tắt ở > 60 m.

### 4.2 Bảng món hiện có (51 + 6)

| SKU | id | Cách làm | Ngân sách | Ghi chú sản xuất |
|---|---|---|---|---|
| `SKU-E-01` | `y_menh` | HSV theo Dụng / Hỷ | — | đã có |
| `SKU-E-02` | `y_bach` | HSV | — | đã có |
| `SKU-E-03` | `y_tu` | HSV | — | đã có; đổi mô tả |
| `SKU-E-04..08` | áo 5 hành | HSV | — | đã có; thêm câu bộ |
| `SKU-E-09` | `tram_go` | thủ công | 300 tam giác | đã có |
| `SKU-E-10` | `dao_quan` | thủ công | 500 | đổi mô tả |
| `SKU-E-11` | `quan_la` | thủ công | 600 | — |
| `SKU-E-12` | `kim_quan` | thủ công + lông trĩ lắc | 800 | tôn bộ |
| `SKU-E-13` | `dau_lap` | thủ công + mạng sa | 700 | — |
| `SKU-E-14` | `tram_ngoc` | thủ công | 400 | — |
| `SKU-E-15` | `quan_sen` | thủ công → **làm lại** thành cánh sen ánh sáng (phần 04 §5.2) | 600 + 40 hạt | chờ cố vấn |
| `SKU-E-16` | `kiem_go` | thủ công | 500 | — |
| `SKU-E-17` | `kiem_moc` | thủ công | 700 | — |
| `SKU-E-18` | `ho_lo` | thủ công | 600 | — |
| `SKU-E-19` | `kiem_bao` | thủ công, 2 kiếm | 1.200 | tôn bộ |
| `SKU-E-20` | `o_giay` | thủ công | 900 | — |
| `SKU-E-21` | `canh_phuong` | thủ công + rig đập | 2.800 | tôn bộ |
| `SKU-E-22` | `canh_hac` | thủ công + rig đập | 2.800 | — |
| `SKU-E-23` | `phap_luan` | thủ công xoay | 1.500 | đổi tên hiển thị; bỏ nan kiểu bánh xe Pháp nếu có |
| `SKU-E-24` | `quat_giay` | thủ công | 300 | — |
| `SKU-E-25` | `phat_tran` | thủ công | 500 | — |
| `SKU-E-26` | `den_long_tay` | thủ công + đèn điểm | 400 + 1 đèn | đèn điểm tắt ở máy yếu |
| `SKU-E-27` | `la_ban_tay` | thủ công | 500 | — |
| `SKU-E-28` | `quat_long` | thủ công | 600 | — |
| `SKU-E-29..35` | hào quang | `effects.js` | 60–120 hạt | `aura_lua`, `aura_set` kiểm nhấp nháy ≤ 3 lần / giây (phần 01 §8.3 câu 23) |
| `SKU-E-36..41` | vệt bước | `effects.js` | 40–80 hạt | — |
| `SKU-E-42..46` | ngự vật | `accessories.js` | 1.500–4.000 | `dai_sen` có biến thể lá sen (phần 04 §5.4) |
| `SKU-E-47..51` | khung | CSS | — | — |
| `SKU-K-01` | `hoa_quan` | thủ công | 500 | **mới** |
| `SKU-K-02` | `aura_hoa` | `effects.js` | 60 hạt | **mới** |
| `SKU-K-03` | `aura_tho` | `effects.js` | 60 hạt | **mới**; dùng lại mote Hậu Thổ của `WX_GIATRI` |
| `SKU-K-04` | `kim_kiem` | thủ công | 700 | **mới** |
| `SKU-K-05` | `aura_kim` | `effects.js` | 60 hạt | **mới** |
| `SKU-K-06` | `hoa_dai` | thủ công | 600 | **mới**; có thể dùng lại lưới `ho_lo` tô son |

### 4.3 Ước lượng giờ công danh mục dự kiến

| Nhóm | Số món | Giờ / món | Tổng giờ |
|---|---|---|---|
| Bình bộ `SKU-K` | 6 | 6 | 36 |
| Vùng `SKU-R` | 120 | 6 (trung bình: robe 4, phụ kiện 10, hiệu ứng 8, khung 2, ngự vật 30) | ≈ 720 |
| Lễ `SKU-F` | 30 | 6 | 180 |
| Nội thất `SKU-H` | 44 | 6 | 264 |
| Mùa `SKU-S` (12 mùa) | 476 | phần 09 §D: ≈ 430 giờ / mùa | ≈ 5.160 (12 năm) |
| **Năm đầu** (bình bộ + vùng + lễ + nội thất + SEASON-01) | — | — | ≈ 1.200 + 300 ≈ **1.500 giờ** (≈ 0,8 người / năm) |

---

## 5. Checklist nghiệm thu phần 18

- [ ] K-01 … K-41 có trong các tệp test đã có, chạy bằng `npm run test:game` / `npm run test:mmo`.
- [ ] K-42 … K-86 có trong bộ test máy chủ (tài liệu 13 đặt chỗ).
- [ ] Công cụ mô phỏng import hằng số từ code, chạy lại phần 03 §5.4 khớp ± 2%.
- [ ] Mọi món mới đi qua bảng ngân sách §4.1 trước khi duyệt (câu 22 phần 01 §8.3).
