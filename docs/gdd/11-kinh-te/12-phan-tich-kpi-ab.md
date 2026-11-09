# 11 · Phần 12 — Analytics, chỉ số (KPI), luật thử nghiệm A/B

> Đặt lược đồ sự kiện kinh tế, công thức và mục tiêu cho các chỉ số doanh thu, sức khỏe kinh tế và **chỉ số rào chắn đạo đức**; đặt luật cho thử nghiệm A/B để không thử nghiệm nào chạm cơ chế mệnh.
>
> Phạm vi: chỉ sự kiện kinh tế và cửa hàng. Sự kiện gameplay chung (nhiệm vụ, vùng) thuộc tài liệu 13.

---

## 1. Nguyên tắc thu thập

| # | Nguyên tắc |
|---|---|
| A1 | Analytics hành vi **chỉ khi người chơi đồng ý** (cài đặt «Góp số liệu ẩn danh để cải thiện quán», mặc định **tắt** ở VN cho tới khi pháp chế xác nhận cơ sở xử lý khác). Sự kiện giao dịch (đơn hàng, hoàn tiền) luôn ghi vì là chứng từ, nhưng ở kho giao dịch, không ở kho analytics |
| A2 | Tài khoản < 16 tuổi: chỉ sự kiện kỹ thuật (lỗi, hiệu năng). Không sự kiện cửa hàng, không sự kiện tiêu tiền |
| A3 | Không gửi dữ liệu lá số (ngày giờ sinh, Dụng thần, điểm, sao, hạn) trong bất kỳ sự kiện nào. Ngoại lệ duy nhất: **dải Tiềm Lực** (5 dải) cho chỉ số công bằng §4.4, **chỉ khi** người chơi bật thêm «Góp số liệu kiểm công bằng» |
| A4 | Không gắn đạo thống vào hồ sơ người chơi lâu dài (phần 11 §4.2) |
| A5 | Định danh trong kho analytics là `pseudoId = HMAC(accountId, khóa analytics)`; khóa xoay mỗi 12 tháng, sau xoay không nối được dữ liệu cũ với mới |
| A6 | Lưu sự kiện thô 25 tháng; sau đó chỉ giữ bảng tổng hợp |

---

## 2. Phong bì sự kiện

Mọi sự kiện có các trường chung:

| Trường | Kiểu | Ví dụ | Ghi chú |
|---|---|---|---|
| `ev` | chuỗi | `eco_ngoc_spend` | tên sự kiện |
| `evId` | UUID | — | chống trùng |
| `tsClient` | số (ms) | — | giờ máy, chỉ tham khảo |
| `tsServer` | số (ms) | — | giờ máy chủ, dùng để tính |
| `econDay` | `YYYY-MM-DD` | `2027-08-09` | ngày kinh tế (phần 02 PK-3) |
| `pseudoId` | chuỗi | — | A5 |
| `sessionId` | chuỗi | — | — |
| `platform` | `web` · `ios` · `android` | — | — |
| `appVersion` | chuỗi | `3.1.0` | `package.json › version` |
| `region` | `VN` · … | — | — |
| `ageBand` | `16-17` · `18+` · `unknown` | — | < 16 không có sự kiện hành vi |
| `vip` | bool | — | — |
| `season` | `SEASON-xx` | — | — |
| `chapter` | `X` · `H` · `T` · `D` | — | — |

---

## 3. Từ điển sự kiện

### 3.1 Tiền tệ

| Sự kiện | Khi nào | Trường riêng |
|---|---|---|
| `eco_phuc_earn` | nhận Phúc Khí | `source` (mã nguồn phần 02: `N1`…`N13`, `D1`…`D21`), `raw`, `afterBudget`, `hopMenh` (bool), `dayTotal` |
| `eco_phuc_spend` | tiêu Phúc Khí | `sink` (`S1`…`S10`), `sku` (nếu có), `amount`, `balanceAfter` |
| `eco_ngoc_grant` | nhận Ngọc | `wallet` (`free` · `paid`), `reason` (`checkin` · `vip_daily` · `level_gift` · `event` · `daolo` · `purchase` · `compensation` · `migration`), `amount`, `ref` |
| `eco_ngoc_spend` | tiêu Ngọc | `sku`, `fromFree`, `fromPaid`, `balanceAfter` |
| `eco_checkin` | điểm danh | `dayInCycle` (1–7), `streak`, `rule` (`pause` · `reset`), `ngoc` |
| `eco_level_up` | lên cấp | `from`, `to`, `ngocGift` |
| `eco_daily_budget_hit` | chạm ngưỡng ngân sách ngày (phần 02 §5.1) | `threshold` (250 · 400) |

### 3.2 Cửa hàng

| Sự kiện | Khi nào | Trường riêng |
|---|---|---|
| `store_open` | mở Y Các | `entry` (`hud` · `tailor` · `wardrobe_tab` · `daolo` · `deeplink`), `quietZone` (bool), `minsSinceFateScreen` (làm tròn 5 phút, tối đa 60) |
| `store_tab` | đổi thẻ | `tab` (`sets` · id ô · `vip` · `region` · `festival`) |
| `store_item_view` | xem thẻ món lâu ≥ 1 giây | `sku`, `rarity`, `priceType` (`phuc` · `ngoc` · `dual`), `locked` (lý do khóa nếu có) |
| `store_try_on` | bấm «Thử 20s» | `sku` |
| `store_buy` | mua bằng tiền ảo thành công | `sku`, `currency`, `price`, `triedFirst` (bool), `secsSinceView` |
| `store_buy_fail` | mua thất bại | `sku`, `reason` (`insufficient` · `locked_vip` · `locked_level` · `locked_streak` · `owned` · `limit`) |
| `store_bundle_view` | xem gói | `sku`, `ownedParts` |
| `store_equip` | mặc / tháo | `slot`, `sku`, `setComplete` (bool), `hopMenh` (bool) |

### 3.3 Thanh toán (kho giao dịch — luôn ghi; bản sao ẩn danh vào analytics nếu đồng ý)

| Sự kiện | Trường riêng |
|---|---|
| `pay_quote` | `sku`, `channel`, `result` (`ok` · `age` · `limit_self` · `limit_minor` · `limit_cap` · `owned` · `unavailable`) |
| `pay_start` | `orderId`, `sku`, `channel`, `amount`, `currency` |
| `pay_success` | `orderId`, `latencyMs` (từ `pay_start`) |
| `pay_fail` | `orderId`, `stage` (`create` · `provider` · `ipn` · `grant`), `code` |
| `pay_cancel` | `orderId` |
| `pay_pending_resolved` | `orderId`, `result`, `minutes` |
| `pay_refund` | `orderId`, `channel`, `initiator` (`user` · `store` · `platform` · `parent`), `reason` |
| `pay_chargeback` | `orderId`, `channel`, `stage` (`opened` · `won` · `lost`) |
| `sub_state` | `product`, `channel`, `from`, `to` (phần 07 §4.1) |

### 3.4 VIP và Đạo Lộ

| Sự kiện | Trường riêng |
|---|---|
| `vip_page_view` | `entry` |
| `vip_daily_claim` | `amount` |
| `vip_lapse_landing` | bay hạ cánh mềm khi hết VIP (phần 07 §3.4) — để kiểm lỗi |
| `dl_points` | `source` (`task` · `case` · `desk` · `tea` · `weekly`), `amount`, `doubled` (Lộ Dư), `weekTotal` |
| `dl_tier` | `tier`, `track` (`thanh` · `kim`) |
| `dl_claim` | `tier`, `track`, `rewardType` |
| `dl_buy` | `type` (`chapter` · `year` · `gift`), `currency` (`money` · `ngoc`), `tierAtBuy` |
| `dl_weekly_task` | `taskType`, `solo` (bool — phương án một mình) |
| `dl_chapter_end` | `tierReached`, `track`, `autoClaimed` |

### 3.5 Rào chắn đạo đức

| Sự kiện | Khi nào | Trường riêng |
|---|---|---|
| `guard_quiet_zone` | vào vùng im lặng thương mại (phần 01 §6.2) | `screen` (`menhban` · `vanmenh` · `thaitue` · `que` · `xam` · `menhdo` · `congqua` · `nghiep` · `crisis` · `ai_sensitive`) |
| `guard_crisis_mode` | bật chế độ hỗ trợ khủng hoảng | không trường nội dung |
| `guard_ai_repeat` | phát hiện hỏi lặp, ẩn cửa hàng lượt AI | `count` |
| `guard_spend_summary` | hiện «Tổng kết chi tiêu» | `threshold` (2 · 5 · 10 triệu) |
| `guard_spend_confirm` | hỏi xác nhận lại giao dịch lớn | `result` (`continue` · `cancel`) |
| `guard_limit_set` | người chơi tự đặt trần | `amount`, `direction` (`down` · `up`) |
| `guard_limit_hit` | chạm trần | `kind` (`self` · `minor` · `hard`) |
| `guard_parent` | phụ huynh duyệt / từ chối | `result` |

---

## 4. Chỉ số và mục tiêu

### 4.1 Hoạt động

| Chỉ số | Công thức | Mục tiêu năm đầu |
|---|---|---|
| DAU / MAU | người chơi hoạt động ngày / tháng | ≥ 25% |
| Giữ chân D1 / D7 / D30 | tỷ lệ còn chơi ngày 1 / 7 / 30 sau ngày tạo | 35% / 15% / 7% |
| Phiên / ngày / người | — | 1,5–2,5 (game «ghé quán», không phải cày) |
| Phút / ngày / người | — | 20–40 (trùng nhịp phần 03 §5.2) |

### 4.2 Doanh thu

| Chỉ số | Công thức | Mục tiêu năm đầu | Ghi chú |
|---|---|---|---|
| ARPDAU | doanh thu thuần ngày / DAU | **800–1.200đ** (≈ 0,03–0,05 USD) | thấp hơn game gacha có chủ đích |
| Tỷ lệ trả phí tháng | người trả ≥ 1 lần trong tháng / MAU | 3–5% | — |
| ARPPU tháng | doanh thu tháng / người trả | 150.000–250.000đ | — |
| ARPU tháng | doanh thu tháng / MAU | 6.000–10.000đ | — |
| Tỷ lệ VIP | thuê bao + thẻ VIP đang hiệu lực / MAU | ≥ 1,5% | — |
| Rời VIP tháng | VIP không gia hạn / VIP đầu tháng | ≤ 15% | — |
| Gắn Kim Thư | người mua Kim Thư / người hoạt động trong chương | 6–10% | — |
| Hoàn thành Kim Thư | người mua đạt bậc 30 / người mua | ≥ 70% | phần 07 §5.6 |
| Cơ cấu doanh thu | thẩm mỹ (Ngọc tiêu vào món) · VIP · Đạo Lộ · tiện ích · lượt AI | 45% · 25% · 20% · ≤ 5% · ≤ 3% | lượt AI > 3% là dấu hiệu xấu (phần 01 §4.3) |

### 4.3 Rào chắn đạo đức (bắt buộc theo dõi, công bố ở «Sổ Quán»)

| Chỉ số | Công thức | Ngưỡng | Vượt ngưỡng thì |
|---|---|---|---|
| `ETH_TOP1_SHARE` | doanh thu từ 1% người chi nhiều nhất (30 ngày) / tổng | ≤ 35% | ≥ 40%: hội đồng phần 01 §8.1 rà gói lớn, xem xét hạ trần |
| `ETH_REFUND_RATE` | số tiền hoàn / doanh thu gộp (30 ngày) | ≤ 2% | rà SKU có hoàn tiền cao |
| `ETH_CHARGEBACK_RATE` | số tranh chấp thẻ / số giao dịch thẻ (30 ngày) | ≤ 0,3% | phần 13 §3 |
| `ETH_FATE_ADJACENT_BUY` | giao dịch trong 10 phút sau màn hình vận mệnh / tổng giao dịch | ≤ 1% (vùng im lặng chỉ chặn đề cử, không chặn người tự mua) | > 2%: rà luồng giao diện |
| `ETH_MINOR_SPEND` | doanh thu từ tài khoản < 18 / tổng | ≤ 5% | > 8%: rà trần và quy trình phụ huynh |
| `ETH_SPEND_SUMMARY_CANCEL` | tỷ lệ «hủy» ở `guard_spend_confirm` | theo dõi, không mục tiêu | tăng mạnh → bước xác nhận đang bảo vệ đúng người |
| `ETH_AI_REPEAT` | `guard_ai_repeat` / người dùng AI | theo dõi | tăng → rà nội dung trả lời trấn an |
| `ETH_LOW_CHART_CONVERSION` | tỷ lệ trả phí dải Tiềm Lực < 36 ÷ tỷ lệ trả phí dải ≥ 50 (chỉ trên người bật kiểm công bằng) | 0,8–1,2 | > 1,2: người lá số thấp **trả nhiều hơn** — có thể game đang khai thác lo âu → điều tra |
| `ETH_LOW_CHART_RETENTION` | giữ chân D7 dải < 36 ÷ dải ≥ 50 | ≥ 1,0 (sơ đồ tổng §13.5) | < 0,9: báo tài liệu 04, 05 |

### 4.4 Sức khỏe kinh tế

| Chỉ số | Nguồn | Ngưỡng (phần) |
|---|---|---|
| `PK_SINK_RATIO_30D` | `eco_phuc_spend` / `eco_phuc_earn` | 0,7–0,9 (phần 02 §5.2) |
| `PK_BALANCE_P90` | số dư | ≤ 30 ngày kiếm |
| `PK_TIME_TO_SET` | ngày từ cấp 5 tới đủ thân bộ bằng PK | 10–35 |
| `NGOC_FREE_BALANCE_P50` | người chơi ≥ 90 ngày | ≤ 6.000 (phần 03 §6.2) |
| `NGOC_PAID_OUTSTANDING` | tổng Ngọc Nạp chưa tiêu | báo cáo kế toán (phần 11 §3.3) |
| `DL_PAID_COMPLETION` | §4.2 | ≥ 70% |
| `DL_FREE_COMPLETION_A` | người chơi kiểu A (4 ngày / tuần) đạt bậc 30 Thanh Lộ | ≥ 60% |
| `CHECKIN_STREAK_BREAK` | tỷ lệ chuỗi bị tạm dừng / tuần | theo dõi |
| `HOP_MENH_SHARE` | người mặc đủ bộ Hợp mệnh / người hoạt động cấp ≥ 10 | theo dõi; chênh giữa 5 hành ≤ 20% (nếu một hành thấp hẳn → món thân bộ hành đó kém đẹp hoặc khó kiếm) |

---

## 5. Bảng điều khiển

| Bảng | Người xem | Nội dung |
|---|---|---|
| Doanh thu ngày | vận hành | §4.2 theo kênh, theo SKU nhóm; đơn `pending` |
| Rào chắn | hội đồng phần 01 §8.1 | §4.3, cảnh báo đỏ khi vượt |
| Kinh tế | thiết kế kinh tế | §4.4, phân bố số dư |
| Đạo Lộ | thiết kế kinh tế + vận hành | tiến độ bậc theo tuần, Lộ Dư dùng bao nhiêu |
| Đối soát | kế toán | phần 10 §12 |

---

## 6. Luật thử nghiệm A/B

### 6.1 Danh sách **cấm thử nghiệm**

Không bao giờ chia nhóm người chơi để nhận khác nhau ở:

| # | Thứ | Lý do |
|---|---|---|
| AB-X1 | Mọi tính toán lá số (`chart.js › analyze()` và mọi module `src/engine/`) | T1, T5 |
| AB-X2 | Nội dung luận giải, lời Thầy, thoại NPC về vận mệnh | T5; người chơi so sánh với nhau sẽ thấy «hai thầy nói khác» |
| AB-X3 | Persona, câu lệnh hệ thống của Thầy AI (trừ bản sửa an toàn đã thử **ngoại tuyến** trên bộ đánh giá trước khi bật cho tất cả) | — |
| AB-X4 | Tốc độ Đạo Hạnh, công đức, cảnh giới, Nghiệp, Nợ Âm, Mệnh Đồ, Thiên Bảng | lõi |
| AB-X5 | Thưởng ở màn hình liên quan vận mệnh (xăm, quẻ, đèn Thái Tuế) | — |
| AB-X6 | Vùng im lặng, trần chi tiêu, quy trình phụ huynh, chế độ khủng hoảng | rào chắn |
| AB-X7 | Giá của **cùng một SKU** cùng thời điểm (giá cá nhân hóa) | luật người tiêu dùng; công bằng |
| AB-X8 | Nội dung của SKU (người A mua gói có 3 món, người B cùng giá có 2 món) | — |
| AB-X9 | Bất cứ thử nghiệm nào trên tài khoản < 18 | A2 |
| AB-X10 | Thông báo đẩy ngoài khung giờ cho phép hoặc ngoài loại người chơi đã bật | phần 01 §6.4 |
| AB-X11 | Lời mời mua dựa trên dữ liệu lá số, hạn, cảm xúc | X4 |

### 6.2 Được thử nghiệm

| Nhóm | Ví dụ |
|---|---|
| Bố cục cửa hàng | thứ tự thẻ, cỡ ảnh, có / không ô «Bộ» mở đầu |
| Lời văn (trong khuôn phần 01 §7) | «Thỉnh» hay «Mua» trên nút |
| Mặc thử | thử 20 giây hay 30 giây |
| Thành phần gói **cùng giá trị lẻ** | gói vùng A có món X thay vì món Y (tổng giá lẻ bằng nhau ± 5%) |
| Hướng dẫn | màn giới thiệu Ngọc / Phúc Khí lần đầu |
| Lộ Thư | trộn loại việc trong tuần (cùng tổng LĐ) |
| Thời điểm thông báo trong khung cho phép | 08:00 hay 19:00 cho người đã bật nhắc điểm danh |

### 6.3 Quy trình

| Bước | Việc |
|---|---|
| 1 | Đăng ký trước: giả thuyết, chỉ số chính, chỉ số rào chắn (bắt buộc gồm `ETH_REFUND_RATE`, `ETH_FATE_ADJACENT_BUY`, khiếu nại), cỡ mẫu, thời gian (≥ 14 ngày, phủ ít nhất hai cuối tuần) |
| 2 | Hội đồng phần 01 §8.1 duyệt — đặc biệt kiểm §6.1 |
| 3 | Chia nhóm theo `pseudoId` băm, chỉ người chơi đã bật analytics, ≥ 18 tuổi |
| 4 | Dừng sớm nếu chỉ số rào chắn xấu đi có ý nghĩa (ví dụ hoàn tiền tăng > 50% so với nhóm đối chứng) |
| 5 | Kết thúc: công bố tóm tắt trong «Sổ Quán» mùa (tên thử nghiệm, kết quả, đã áp dụng hay bỏ) |
| 6 | Biến thể thắng áp dụng cho **mọi người**; không giữ «nhóm đặc biệt» lâu dài |

### 6.4 Thay đổi giá

Không A/B giá. Khi cần đổi giá:

- đổi cho mọi người cùng khu vực, báo trước ≥ 7 ngày nếu **tăng** giá;
- người đã mua ở giá cũ trong 48 giờ trước khi **giảm** giá nhận hoàn chênh lệch bằng Ngọc Tặng (phần 03 §8);
- ghi vào «Sổ Quán».

---

## 7. Checklist nghiệm thu phần 12

- [ ] Sự kiện §3 có trong mã client / máy chủ với đúng trường; có test lược đồ.
- [ ] Không sự kiện nào chứa dữ liệu lá số (lint tên trường: không `birth`, `yong`, `score`, `pillar`, `dayun`, `liunian`, `shensha`).
- [ ] Tài khoản < 16 không phát sự kiện hành vi (test).
- [ ] Bảng rào chắn §4.3 có cảnh báo tự động.
- [ ] Sổ đăng ký A/B tồn tại; mọi thử nghiệm có phiếu duyệt; không thử nghiệm nào thuộc §6.1.
