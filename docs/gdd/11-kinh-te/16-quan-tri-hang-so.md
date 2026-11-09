# 11 · Phần 16 — Quản trị kinh tế: sổ hằng số, quy trình thay đổi, cần gạt khẩn cấp

> Kinh tế là một tập **hằng số** (thưởng, trần, giá, ngưỡng). Phần này gom mọi hằng số — có trong code và dự kiến — vào một sổ, ghi ai được đổi, đổi theo quy trình nào, báo trước bao lâu; và đặt các cần gạt tắt / bật khi có sự cố.

---

## 1. Nơi hằng số sống

| Lớp | Hiện tại | Đề xuất |
|---|---|---|
| Hằng số trong mã client | `state.js`, `cosmetics.js`, `progress.js`, `wardrobe-ui.js` | giữ làm **giá trị mặc định** và cho chơi ngoại tuyến |
| Cấu hình máy chủ | chưa có | KV (`ADMIN_KV` đã có binding) khóa `eco:config:v<N>` — JSON có phiên bản; Két (phần 10) đọc khi tính thưởng, giá |
| Danh mục món | `cosmetics.js › ITEMS` | danh mục máy chủ `eco:catalog:v<N>`; client tải khi mở Y Các, so phiên bản; `cosmetics.js` giữ bản tối thiểu để chơi ngoại tuyến |
| Quy tắc | máy chủ là nguồn sự thật cho mọi thứ có giá trị; client chỉ hiển thị | — |

Khi hai nơi lệch (client cũ, máy chủ mới), **máy chủ thắng**; client hiện số do máy chủ trả sau hành động.

---

## 2. Sổ hằng số

Cột «Đổi trực tiếp?»: **có** = đổi bằng cấu hình máy chủ, không cần phát hành bản mới; **không** = cần bản client (vì hiển thị / logic chỉ ở client).

### 2.1 Phúc Khí — nguồn (đã có)

| Hằng số | Tệp › tên | Giá trị | Phần | Đổi trực tiếp? |
|---|---|---|---|---|
| Lập lá số / hồ sơ | `state.js › REWARD.chart` | 10 | 02 §2.1 N1 | có |
| La Bàn | `REWARD.compass` | 5 | N2 | có |
| Thẻ xăm | `REWARD.stick` | 3 | N3 | có |
| Nhang / trầm | `REWARD.huong` | 5 | N4 | có |
| Lịch | `REWARD.lich` | 2 | N5 | có |
| Hoa đăng | `REWARD.lantern` | 3 | N6 | có |
| Ba việc | `REWARD.tasks` | 5 | N7 | có |
| Trà / ngày | `CAPS.teaPerDay` | 15 phút | N8 | có |
| Thẻ xăm / ngày | `CAPS.sticksPerDay` | 3 | N3 | có |
| Ô hồ sơ | `CAPS.maxProfiles` | 5 | 06 `SKU-U-01` | có |
| Lưu thẻ xăm | `CAPS.keepSticks` | 30 | — | không |
| Lưu đèn | `CAPS.keepLanterns` | 50 | — | không |
| Thời gian nhang | `INCENSE_MS` | 180.000 ms | — | không |
| Khách / ngày | `CASES_PER_DAY` | 3 | N9 | có |
| Án khách tối đa | `CASE_REWARD.npcMax` | 15 | N9 | có |
| Án Cổ | `CASE_REWARD.classical` | 25 | N10 | có |
| Sảnh nghề | `DESK_REWARD` | 15 | N11 | có |
| Đèn Thái Tuế | `LAMP_REWARD.first`, `.daily` | 10, 3 | N12 | có |
| Hợp mệnh | `cosmetics.js › SET_BONUS` | 0,1 | N13 | có (máy chủ tính) |
| Sổ án | `caseLog.length` cắt | 40 | 06 `SKU-U-06` | không |

### 2.2 Cấp, danh xưng, trà

| Hằng số | Tệp › tên | Giá trị | Phần | Đổi trực tiếp? |
|---|---|---|---|---|
| Công thức cấp | `progress.js › xpFor` | `20·(L−1)²` | 02 §2.4 | **không bao giờ đổi** (đổi làm người chơi tụt / nhảy cấp) |
| Gia trì theo cấp | `GIATRI[].lv` | 2 / 4 / 6 / 8 / 10 | 01 §4.2 | không |
| Danh xưng | `state.js › TITLES[].min` | 0 / 30 / 100 / 250 / 500 (theo `xp` sau sửa PK-1) | 02 §1.1 | có (tài liệu 04 quyết định) |
| Trà mở | `TEAS[].min` | 0 / 30 / 100 / 250 (theo `xp`) | 02 §1.1 | có |

### 2.3 Ngọc

| Hằng số | Tệp › tên | Giá trị | Phần | Đổi trực tiếp? |
|---|---|---|---|---|
| Điểm danh | `cosmetics.js › CHECKIN` | 10, 15, 20, 25, 30, 40, 80 | 03 §1 | có |
| Quy tắc chuỗi | (mới) | `pause` | 03 NG-1 | có |
| VIP / ngày | `VIP_DAILY` | 30 | 07 §3.2 | có (báo trước nếu giảm — §3) |
| Quà cấp | `LEVEL_GIFT` | 20 | 03 §3.1 | có |
| Gói nạp | `wardrobe-ui.js` (60 / 330 / 700 / 1.600) + `SKU-P-05` 4.200 | — | 03 §3.4 | giá web: có; giá nền tảng: qua App Store Connect / Play Console |
| Trần Ngọc Nạp | (mới) | 20.000 | 03 §6.3 | có |
| Trần bồi thường | (mới) | 500 / tháng | 03 §6.3, 13 §7 | có |
| Quà lễ | (mới) | bảng phần 03 §3.2 | 03 | có |

### 2.4 Phúc Khí — dự kiến

| Hằng số | Giá trị | Phần |
|---|---|---|
| Ngân sách ngày — ngưỡng | 250 / 400 | 02 §5.1 |
| Ngân sách ngày — hệ số | ×1,0 / ×0,5 / ×0,2 | 02 §5.1 |
| Tĩnh tọa + trà chung trần | 30 phút | 02 D1 |
| Giá thân bộ PK | 600 / món | 02 §4.3 |
| Hệ số giá kép | Ngọc × 7,5, làm tròn 50 | 02 §4.3 |
| Nhuộm | 40 / 120 / 60 | 02 §4.4 |
| Xe trạm | 10 / 25 / 40 | 02 §4.7 |
| Nhà | bảng 02 §4.6 | 02 |
| Cống Hiến từ Phúc Khí | ≤ 50% / tuần | 02 §4.9 |

### 2.5 Đạo Lộ

| Hằng số | Giá trị | Phần |
|---|---|---|
| Bậc / chương | 30 (+10 Dư Lộ) | 07 §5.2 |
| LĐ / bậc | 1.000 (Dư Lộ 1.500) | 07 §5.2 |
| LĐ nguồn ngày | 80 / 40 / 40 / 10 mỗi phút | 07 §5.3 |
| Trần LĐ ngày | 600 | 07 §5.3 |
| Lộ Thư | 6 việc, tính 4, 200 LĐ / việc | 07 §5.4 |
| Trần LĐ tuần | 4.000 | 07 §5.5 |
| Ngưỡng Lộ Dư | 2.400 / tuần; quỹ tối đa 9.600 | 07 §5.5 |
| Giá Kim Thư | 109.000đ · 4,99 USD · 1.000 Ngọc | 07 §6.1 |
| Giá Niên Lộ | 349.000đ · 14,99 USD · 3.400 Ngọc | 07 §6.1 |
| Thưởng Ngọc Thanh Lộ / Kim Thư | 300 / 450 mỗi chương | 07 §7.1 |

### 2.6 Rào chắn

| Hằng số | Giá trị | Phần | Quy tắc đổi |
|---|---|---|---|
| Vùng im lặng | 10 phút | 01 §6.2 | chỉ **tăng** được không cần hội đồng |
| Tổng kết chi tiêu | 2.000.000đ / 30 ngày | 01 §9.3 | chỉ **giảm** ngưỡng được không cần hội đồng |
| Xác nhận lại | 5.000.000đ / 30 ngày, giao dịch ≥ 400.000đ | 01 §9.3 | như trên |
| Trần cứng mặc định | 10.000.000đ / 30 ngày | 01 §9.3 | như trên |
| Chờ nâng trần tự đặt | 7 ngày | 01 §9.3 | chỉ tăng |
| Trần < 16 / 16–17 | 200.000đ / 500.000đ | 11 §5.2 | chỉ giảm |
| Lượt AI tối đa | 60 / ngày | 01 §4.3 | chỉ giảm |
| Mua tặng | 5 / tuần; bạn ≥ 7 ngày | 01 §4.8 | chỉ thắt |
| Giảm giá | ≤ 30%, ≤ 4 đợt / năm / món | 01 §6.3 | chỉ thắt |
| Tiết kiệm gói | ≤ 40% (khởi đầu), ≤ 20% | 06 §4.1 | chỉ thắt |
| Món VIP-only | ≤ 8% danh mục Ngọc | 04 §8 | chỉ thắt |
| Đổi ý sau mua | 10 phút, 3 lần / ngày | 15 §1.4 | chỉ nới |

---

## 3. Quy trình thay đổi

### 3.1 Loại thay đổi

| Loại | Ví dụ | Duyệt | Báo người chơi | Ghi Sổ Quán |
|---|---|---|---|---|
| **A · Có lợi cho người chơi** | tăng thưởng, giảm giá cố định, thêm quà | Thiết kế kinh tế | không bắt buộc (có thể báo như tin vui) | có |
| **B · Bất lợi cho người chơi** | giảm thưởng, giảm `VIP_DAILY`, nâng LĐ / bậc, thu hẹp trần lượt AI cho người đã mua | hội đồng phần 01 §8.1 | **≥ 14 ngày trước**; với VIP / Kim Thư đang hiệu lực: áp từ **kỳ sau** | có, kèm lý do |
| **C · Giá tiền thật** | tăng / giảm giá gói, VIP, Kim Thư | hội đồng + pháp chế | tăng: ≥ 7 ngày; giảm: hoàn chênh lệch 48 giờ (phần 12 §6.4) | có |
| **D · Rào chắn** | §2.6 | chiều «thắt»: Thiết kế kinh tế; chiều «nới»: hội đồng đủ 4 vai | có | có |
| **E · Sửa lỗi kinh tế** | sửa PK-2, PK-3 | Thiết kế kinh tế | báo khi sửa lỗi khai thác; **không** thu hồi phần đã nhận trước khi công bố lỗi, trừ khai thác rõ ràng có chủ ý (phần 13 §5 mức 1) | có |
| **F · Món mới** | SKU mới | quy trình phần 01 §8 | — | đếm trong Sổ Quán |

### 3.2 Phiên bản cấu hình

- Mỗi thay đổi tạo phiên bản cấu hình mới `eco:config:v<N+1>`, ghi: người tạo, người duyệt, loại (§3.1), hiệu lực từ, lý do, liên kết phiếu.
- Két áp cấu hình theo **thời điểm hành động** (thưởng tính theo cấu hình có hiệu lực lúc đó).
- Có thể **quay lại** phiên bản trước trong 1 thao tác (cần gạt §4).

### 3.3 Nhịp rà soát

| Nhịp | Việc | Người |
|---|---|---|
| Hằng tuần | bảng rào chắn, doanh thu, Lộ Điểm theo tuần | Thiết kế kinh tế, vận hành |
| Mỗi chương (≈ 91 ngày) | `PK_SINK_RATIO`, `NGOC_FREE_BALANCE_P50`, hoàn thành Kim Thư; quyết định món chương sau | Thiết kế kinh tế |
| Mỗi mùa | Sổ Quán; xét lại bảng giá chuẩn; rà §2.6 | hội đồng |
| Khi có sự cố | §4 | trực ca |

---

## 4. Cần gạt khẩn cấp

| Cần gạt | Tác dụng | Ai kéo | Khi nào | Nhật ký |
|---|---|---|---|---|
| `eco.sales.off` | tắt mọi bán bằng tiền thật (nút nạp ẩn, `/api/pay/quote` trả `unavailable`) | trực ca + báo chủ dự án | IPN lỗi diện rộng, nghi giả mạo, sự cố pháp lý | có |
| `eco.sales.channel.<kênh>.off` | tắt một kênh (ví dụ MoMo) | trực ca | kênh lỗi | có |
| `eco.store.off` | tắt mua bằng Ngọc / Phúc Khí | trực ca | lỗi trừ tiền ảo | có |
| `eco.reward.<nguồn>.off` | tắt thưởng một nguồn (ví dụ `N1`) | Thiết kế kinh tế | phát hiện khai thác | có |
| `eco.config.rollback` | quay về phiên bản cấu hình trước | Thiết kế kinh tế | thay đổi gây lỗi | có |
| `eco.wallet.freeze.<accountId>` | đóng băng ví một tài khoản (không tiêu, không nhận) | hỗ trợ cấp 2 | chiếm tài khoản, tranh chấp đang xét | có, kèm phiếu |
| `eco.daolo.points.off` | tạm dừng Lộ Điểm (không mất LĐ đã có) | Thiết kế kinh tế | lỗi tính LĐ | có; sau sự cố bồi thường LĐ (phần 13 §7) |
| `eco.mmo.cosTicket.off` | MMO tạm bỏ kiểm phiếu trang bị (phần 10 §9), phát trang bị mặc định cho mọi người | trực ca | lỗi kiểm phiếu làm hỏng MMO | có |
| `eco.ai.purchase.off` | ẩn `SKU-U-03`, `SKU-U-04` | Thiết kế kinh tế | chi phí AI vượt ngân sách hoặc nghi lạm dụng | có |

Công tắc AI đã có ở máy chủ (`isAiEnabled`, sơ đồ tổng §6.5) — khi AI tắt, lượt AI đã mua **không mất**: kéo dài hạn `SKU-U-03` / `SKU-U-04` thêm đúng số ngày tắt.

---

## 5. Ma trận trách nhiệm

| Việc | Thiết kế kinh tế | Trải nghiệm | Pháp chế | Cố vấn truyền thống | Vận hành / trực ca | Kế toán | Chủ dự án |
|---|---|---|---|---|---|---|---|
| Hằng số loại A | quyết | được báo | — | — | thực hiện | — | được báo |
| Hằng số loại B | đề xuất | duyệt | duyệt | — | thực hiện | — | duyệt |
| Giá tiền thật (C) | đề xuất | duyệt | duyệt | — | thực hiện | được báo | quyết |
| Rào chắn nới (D) | đề xuất | duyệt | duyệt | ý kiến | — | — | quyết |
| SKU mới (F) | đề xuất | duyệt | duyệt | duyệt (khi liên quan truyền thống) | — | — | — |
| Cần gạt khẩn cấp | kéo / thả | được báo | được báo khi pháp lý | — | kéo | được báo khi tắt bán | được báo |
| Hoàn tiền ngoài chính sách | — | — | ý kiến | — | đề xuất | duyệt | quyết khi > 2.000.000đ |
| Sổ Quán | viết | duyệt | duyệt | đóng góp | — | số liệu | công bố |

---

## 6. Sổ tay xử lý sự cố kinh tế

Mỗi sổ tay: dấu hiệu → cần gạt (§4) → các bước → điều kiện đóng sự cố → bồi thường (phần 13 §7) → ghi «Sổ Quán» nếu người chơi bị ảnh hưởng.

### 6.1 IPN / webhook lỗi diện rộng (người chơi trả tiền, không nhận Ngọc)

| Bước | Việc |
|---|---|
| Dấu hiệu | `pay_success` tụt mạnh trong khi `pay_start` bình thường; đơn `pending` > 20 phút tăng; khiếu nại «đã trừ tiền» |
| 1 | kéo `eco.sales.channel.<kênh>.off` cho kênh lỗi (người mới không bị kẹt thêm) |
| 2 | kiểm nhật ký điểm cuối IPN: lỗi chữ ký (khóa bị xoay?), lỗi định dạng (nhà cung cấp đổi API?), lỗi Két (Durable Object quá tải?) |
| 3 | chạy truy vấn chủ động cho mọi đơn `pending` (`querydr` VNPay, truy vấn MoMo / ZaloPay) và cấp cho đơn thành công |
| 4 | gửi thông báo trong game cho người có đơn bị chậm: «Đơn <mã> đã được xác nhận, Ngọc đã vào tủ. Xin lỗi vì chậm trễ.» |
| Đóng khi | không còn đơn `pending` > 20 phút; đối soát đêm chênh lệch 0 |
| Bồi thường | người bị chậm > 2 giờ: +10% số Ngọc của đơn (Ngọc Tặng) |

### 6.2 Cấp trùng (một giao dịch cấp hai lần)

| Bước | Việc |
|---|---|
| Dấu hiệu | đối soát đêm: tổng Ngọc Nạp cấp > tổng Ngọc theo đơn; vi phạm bất biến I3 |
| 1 | tìm nguyên nhân (khóa duy nhất bị bỏ qua? hai đường cấp: verify + notify cùng chạy?) |
| 2 | sửa và triển khai |
| 3 | **không thu hồi** phần cấp trùng nếu người chơi đã tiêu; phần chưa tiêu: chuyển từ `ngoc_paid` sang `ngoc_free` (để kế toán đúng) — không trừ |
| Đóng khi | I3 xanh 7 ngày |
| Ghi | chi phí cấp trùng vào báo cáo; không công khai danh tính người được cấp trùng |

### 6.3 Cấu hình giá sai

| Ca | Xử lý |
|---|---|
| Món bán quá rẻ (thiếu một chữ số) | kéo `eco.config.rollback`; người đã mua **giữ** món (phần 13 §7) |
| Gói Ngọc bán quá rẻ trên web | kéo `eco.sales.off` web; người đã mua giữ Ngọc; xét nếu có người khai thác hàng loạt (≥ 10 đơn / tài khoản) — đơn vượt 3 được hoàn tiền và thu lại Ngọc chưa tiêu, có thông báo |
| Món / gói bán quá đắt | rollback; hoàn chênh lệch tự động |
| Giá trên App Store / Google Play sai bậc | sửa trong console; nền tảng xử lý giá; quán hoàn chênh lệch bằng Ngọc Tặng nếu người mua bị thiệt |

### 6.4 Lộ khóa bí mật

| Bước | Việc |
|---|---|
| 1 | xoay ngay khóa liên quan (`vnp_HashSecret`, MoMo `secretKey`, ZaloPay `key1/key2`, Stripe signing secret, khóa App Store Server API, tài khoản dịch vụ Google, khóa phiếu trang bị MMO) |
| 2 | kéo `eco.sales.channel.<kênh>.off` trong lúc xoay nếu khóa thanh toán bị lộ |
| 3 | rà mọi giao dịch từ thời điểm nghi lộ: IPN có chữ ký đúng nhưng **không có** giao dịch tương ứng ở báo cáo nhà cung cấp → thu hồi quyền lợi giả, khóa tài khoản liên quan (phần 13 §5 mức 3) |
| 4 | báo nhà cung cấp; nếu dữ liệu cá nhân có thể bị lộ → quy trình thông báo theo luật dữ liệu cá nhân (phần 11 §4) |

### 6.5 Khai thác thưởng mới phát hiện

| Bước | Việc |
|---|---|
| 1 | `eco.reward.<nguồn>.off` |
| 2 | ước lượng phạm vi bằng sổ cái (`reason`, tốc độ) |
| 3 | sửa |
| 4 | thu hồi chỉ phần **chưa tiêu** và chỉ với khai thác rõ ràng có chủ ý (phần 16 §3.1 loại E); người dính lỗi vô tình giữ nguyên |
| 5 | bật lại nguồn |

### 6.6 Sự cố MMO hiện món người chơi không sở hữu

| Bước | Việc |
|---|---|
| 1 | nếu phiếu trang bị lỗi khiến mọi người hiện mặc định: `eco.mmo.cosTicket.off` không giúp (sẽ hiện mọi món, kể cả món chưa sở hữu); chọn: tạm hiện mặc định cho tới khi sửa |
| 2 | kiểm khóa ký phiếu, đồng hồ máy chủ (hạn `exp`) |
| Đóng khi | K-52, K-53 xanh |

---

## 7. Checklist nghiệm thu phần 16

- [ ] Mọi hằng số §2 có trong cấu hình máy chủ có phiên bản (trừ những dòng «không»).
- [ ] Mỗi thay đổi cấu hình có loại, người duyệt, lý do.
- [ ] Rào chắn §2.6 có kiểm «chiều nới cần hội đồng» trong công cụ quản trị.
- [ ] Cần gạt §4 thử được ở môi trường thử, có nhật ký.
- [ ] Ma trận §5 được chủ dự án ký.
