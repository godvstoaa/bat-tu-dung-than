# 11 · Phần 14 — Bản iOS (Học Quán) và bản Android: ràng buộc nền tảng

> Bản iOS của dự án (ứng dụng «Lữ Đăng», `shop.god8.lvdang`) đã từng bị từ chối theo **Hướng dẫn 4.3(b)** của App Store (nhóm ứng dụng bão hòa, có nêu «fortune telling»). Code đã có nhánh iOS: `features.js` tắt xin xăm, hoa đăng, gieo quẻ, Vận Mệnh Các, Thái Tuế Điện, Thầy AI và đổi từ ngữ sang «học» (`TEXT`: Học Quán, Sổ Tu Học, Điểm Tu Học, Lò Trầm). Phần này đặt kinh tế của bản iOS (chỉ IAP), bảng đổi tên, quy định App Store liên quan, và bản Android.

---

## 1. Hiện trạng nhánh iOS trong code

| Thứ | Code | Kinh tế bị ảnh hưởng |
|---|---|---|
| Build | `npm run build:ios` → `vite build --mode ios` → `IOS = import.meta.env.MODE === 'ios'` | — |
| Gian tắt | `IOS_OFF = ['xam', 'sen', 'que', ...VAN, cửa Vận Mệnh, cửa Thái Tuế]` | mất nguồn Phúc Khí N3 (xăm), N6 (hoa đăng), N12 (đèn Thái Tuế) — phần 02 §2.2: trần ngày iOS 197 so với web 212 |
| Thầy AI | `FEATURES.ai = !IOS` | không có `SKU-U-03`, `SKU-U-04` |
| Thành tựu bói | `DIVINATION_ACH` bị lọc | không có `SKU-A-26` (khung Thượng Thượng) |
| Nạp Ngọc | `wardrobe-ui.js`: `IOS ? '' : …` — ẩn nút và bảng gói | phải thay bằng màn hình IAP (§3) khi bật bán |
| Từ ngữ | `TEXT.point = 'Điểm Tu Học'` | tên tiền tệ Phúc Khí trên iOS |
| Kiểm | `npm run verify:ios`, `npm run verify:ios-path` (đường đi người duyệt Apple) | thêm kiểm kinh tế (§7) |

---

## 2. Quy định App Store liên quan đến kinh tế

Tóm tắt theo hiểu biết tới khi viết; người phụ trách nền tảng đối chiếu bản Hướng dẫn hiện hành trước mỗi lần nộp.

| Hướng dẫn | Nội dung | Áp vào |
|---|---|---|
| 4.3(b) Spam — nhóm bão hòa | ứng dụng thuộc nhóm bão hòa (có liệt kê bói toán) cần chất lượng và độc đáo vượt trội | bản iOS là **trò chơi học văn hóa** — không có chức năng đoán vận cho người dùng; kinh tế không được dùng từ «vận», «mệnh», «may mắn» (§4) |
| 3.1.1 Mua trong ứng dụng | nội dung số, tính năng, tiền ảo dùng trong app phải bán qua IAP; tiền ảo không hết hạn; có nút khôi phục cho sản phẩm khôi phục được | toàn bộ `SKU-P`, `SKU-V`, `SKU-DL`, `SKU-B` bán bằng IAP; Ngọc không hết hạn (phần 03 §6.2 đã cấm Ngọc hết hạn) |
| 3.1.1 Quà tặng | cho phép tặng vật phẩm đủ điều kiện IAP; quà chỉ hoàn cho người mua gốc, không đổi ra tiền | `SKU-DL-*-TANG`, `SKU-B-08` |
| 3.1.1 Hộp ngẫu nhiên | phải công bố tỷ lệ | không có (phần 01 nhóm R) |
| 3.1.2 Thuê bao tự gia hạn | phải cho giá trị liên tục; thời hạn tối thiểu 7 ngày; thông tin rõ trước khi mua (giá, kỳ, tự gia hạn, cách hủy) | VIP Thượng Khách: Ngọc mỗi ngày + thẩm mỹ + Ngự Vân Thường là giá trị liên tục; **không** có Thầy AI trên iOS nên quyền lợi «30 lượt AI» **không** được ghi trên màn hình VIP iOS |
| Dẫn ra ngoài | ở storefront Việt Nam, không được dẫn người dùng tới phương thức mua ngoài IAP, không được nhắc giá rẻ hơn ở web (quy định khác cho một số storefront như Mỹ — không áp dụng VN) | bản iOS không có liên kết tới trang nạp web, không nhắc VNPay / MoMo / ZaloPay |
| 4.8 Dịch vụ đăng nhập | nếu dùng đăng nhập bên thứ ba (Google…) để tạo / xác thực tài khoản chính, phải có một lựa chọn đăng nhập đáp ứng yêu cầu riêng tư của Apple (Đăng nhập với Apple đáp ứng) | iOS có Đăng nhập với Apple |
| 5.1.1(v) Xóa tài khoản | ứng dụng cho tạo tài khoản phải cho **xóa tài khoản trong ứng dụng** | §6 |
| 5.1.1 Thu thập dữ liệu | chỉ thu cái cần; nhãn quyền riêng tư đúng | §5 |
| 2.3 Siêu dữ liệu chính xác | ảnh, mô tả không nói chức năng không có | mô tả App Store không có «xem vận», «bói» |
| 1.3 / phân loại tuổi | khai đúng nội dung | phần 11 §7 |

---

## 3. Sản phẩm trên iOS

| SKU | Có trên iOS | Tên hiển thị iOS | Ghi chú |
|---|---|---|---|
| `SKU-P-01..05` | có | «Gói 60 / 330 / 700 / 1.600 / 4.200 Ngọc» | Ngọc giữ tên (Ngọc là đá quý, không mang nghĩa bói) |
| `SKU-V-01..03` | có | «Thượng Khách Học Quán · tháng / quý / năm» | quyền lợi trên iOS: Ngọc mỗi ngày, Ngự Vân Thường, mở sớm hiệu ứng ngũ hành, quyền mua món độc quyền, +3 ô phối đồ, thiệp, ưu tiên hỗ trợ |
| `SKU-V-04` | có | «Thẻ Thượng Khách 30 ngày» | Non-Renewing Subscription |
| `SKU-V-05` | có | «Hộ Quán · tháng» | — |
| `SKU-DL-*` | có | «Niên Lộ» (thay «Đạo Lộ»), chương «Xuân / Hạ / Thu / Đông Lộ», nhánh «Thanh Lộ» / «Kim Thư» giữ | không chữ «Thái Tuế» |
| `SKU-B-01`, `-06`, `-07`, `-08`, `-12` | có | giữ tên | — |
| `SKU-U-01`, `-02`, `-05`, `-06`, `-07`, `-08` | có (mua bằng Ngọc trong game) | giữ | — |
| `SKU-U-03`, `-04` (lượt AI) | **không** | — | Thầy AI tắt trên iOS |
| Món Y Các, vùng, lễ, mùa | có (mua bằng Ngọc / Điểm Tu Học) | theo bảng đổi tên §4 | món lễ của lễ «không bán» vẫn không bán |

---

## 4. Bảng đổi tên hiển thị trên iOS

### 4.1 Thuật ngữ kinh tế

| Web | iOS | Lý do |
|---|---|---|
| Phúc Khí | Điểm Tu Học | đã có trong `TEXT.point` |
| Hợp mệnh | **Hợp hành** | bỏ chữ «mệnh» |
| Đạo Lộ | Niên Lộ | «Đạo Lộ» không có nghĩa bói, nhưng gắn với Thái Tuế ở web; đổi để chủ đề mùa trên iOS là **văn hóa năm can chi** |
| Thái Tuế (mọi chỗ trong kinh tế) | không xuất hiện | Thái Tuế Điện tắt trên iOS |
| VIP Chân Nhân / Thượng Khách | Thượng Khách Học Quán | — |
| Sổ Mệnh | Sổ Tu Học | đã có (`TEXT.book`) |
| «Bản Mệnh Y», «Gia Trì Bản Mệnh», «Bộ Pháp Bản Mệnh» | «Y Phục Nhập Học», «Hào Quang Ngũ Hành», «Bộ Pháp Ngũ Hành» | phần 04 §7 |

### 4.2 Mô tả món

Lint iOS (chạy trên build `--mode ios`): tên và mô tả SKU không chứa (có dấu và không dấu) các từ: «mệnh», «vận», «bói», «xăm», «quẻ», «hạn», «Thái Tuế», «may mắn», «đổi vận», «giải hạn». Món nào vướng phải có trường `iosName` / `iosDesc` (phần 04 §9, L2 đã cho phép khóa `iosName`).

Ví dụ:

| SKU | Web | iOS |
|---|---|---|
| `SKU-E-04` mô tả bộ | «Bộ Thanh Mộc Tiên Tông (hành Mộc). Hợp mệnh: +10% Phúc Khí…» | «Bộ Thanh Mộc Tiên Tông (hành Mộc). Hợp hành: +10% Điểm Tu Học khi giải án và ở sảnh nghề.» |
| `SKU-R-trichthien-05` | «Mười Hai Cung — viền chia 12 ô như bàn Tử Vi» | «Mười Hai Ô — viền chia 12 ô như bàn sao cổ» |
| `SKU-R-lichduong-05` | «Hai Mươi Bốn Tiết» | giữ (tiết khí là thiên văn lịch pháp) |
| `SKU-F-tet-06` | «Câu Đối Đỏ» | giữ |

### 4.3 Mùa trên iOS

| Web | iOS |
|---|---|
| «SEASON-01 · Đinh Mùi · Thư Hương Thiên Hà», thẻ mùa có dòng nạp âm và đức tính năm | «Niên Lộ Đinh Mùi · Thư Hương Thiên Hà», thẻ mùa có dòng con giáp và nạp âm như **kiến thức lịch**, không có dòng đức tính vị trị niên |
| Sự kiện Lập Xuân «đổi niên chủ Thái Tuế» | «Tết Nguyên Đán · đón năm mới» |

---

## 5. Quyền riêng tư trên App Store

### 5.1 Nhãn dữ liệu (App Privacy)

| Loại dữ liệu | Thu? | Liên kết với người dùng | Dùng để theo dõi (tracking) |
|---|---|---|---|
| Mua hàng (Purchase History) | có | có | không |
| Định danh người dùng (User ID) | có | có | không |
| Email (nếu đăng nhập email) | có | có | không |
| Dữ liệu sử dụng (Product Interaction) | có, **chỉ khi đồng ý** | có (bí danh) | không |
| Chẩn đoán (Crash, Performance) | có | không | không |
| Ngày sinh lá số | **không** gửi khỏi máy | — | — |
| Vị trí, danh bạ, ảnh | không | — | — |

Không dùng App Tracking Transparency vì không theo dõi qua ứng dụng / website của bên khác; không có SDK quảng cáo.

### 5.2 Báo cáo chi tiêu

Apple có báo cáo chi tiêu riêng cho người dùng; game cộng thêm «Lịch sử giao dịch» trong Cài đặt (phần 11 §3).

---

## 6. Xóa tài khoản trong ứng dụng

| Bước | Màn hình / việc |
|---|---|
| 1 | Cài đặt › Tài khoản › «Xóa tài khoản» |
| 2 | Màn hình thông tin: «Xóa tài khoản sẽ xóa tủ đồ, Ngọc, Điểm Tu Học, tiến độ Niên Lộ. Không khôi phục được. Thuê bao Thượng Khách **không tự hủy** khi xóa tài khoản — bạn hủy trong Cài đặt Apple ID.» + nút «Quản lý thuê bao» |
| 3 | Xác nhận lại (đăng nhập lại với Apple) |
| 4 | Máy chủ: xóa dữ liệu cá nhân và tiến độ trong 30 ngày; giữ chứng từ giao dịch dạng tối thiểu theo luật kế toán (phần 11 §4.1), tách khỏi danh tính khi luật cho phép |
| 5 | Thu hồi token Đăng nhập với Apple qua API thu hồi của Apple |
| 6 | Ngọc Nạp chưa tiêu: không hoàn tự động khi người dùng tự xóa (ghi rõ ở bước 2); người dùng muốn hoàn gửi yêu cầu trước khi xóa |

Bản web và Android có cùng chức năng (Google Play cũng yêu cầu xóa tài khoản trong ứng dụng và có đường dẫn web).

---

## 7. Kiểm trước khi nộp App Store

| # | Kiểm | Công cụ |
|---|---|---|
| iOS-1 | Không chuỗi giao diện kinh tế nào chứa từ cấm §4.2 | lint trên `dist-ios` |
| iOS-2 | Không liên kết / chữ nhắc web, VNPay, MoMo, ZaloPay, Stripe | lint |
| iOS-3 | Màn hình VIP không nhắc Thầy AI | lint |
| iOS-4 | Có nút «Khôi phục giao dịch», «Quản lý thuê bao» | test giao diện |
| iOS-5 | Màn hình thuê bao hiện: tên, giá, kỳ, «tự gia hạn», cách hủy, liên kết Điều khoản và Chính sách riêng tư | test giao diện |
| iOS-6 | Xóa tài khoản trong ứng dụng hoạt động | test |
| iOS-7 | Sản phẩm IAP đã tạo trong App Store Connect, đủ ảnh duyệt và mô tả, ở trạng thái sẵn sàng nộp cùng bản build | thủ công |
| iOS-8 | Tài khoản thử sandbox cho người duyệt, ghi trong ghi chú duyệt | thủ công |
| iOS-9 | `npm run verify:ios-path` đi qua cửa hàng mà không gặp gian bị tắt | script có sẵn |
| iOS-10 | Ghi chú duyệt mô tả game là trò chơi học văn hóa, nêu rõ không có chức năng xem vận cho người dùng, kinh tế chỉ bán thẩm mỹ | thủ công |

---

## 8. Bản Android

### 8.1 Phạm vi tính năng

| Câu hỏi | Đề xuất |
|---|---|
| Android theo bản web hay bản iOS? | **Bản web** (đủ gian, có Thầy AI) — Google Play không có quy định bão hòa giống 4.3(b); vẫn phải đúng chính sách nội dung (không hứa hẹn kết quả thật, không lừa đảo) — câu hỏi mở cho chủ dự án vì bản Android hiện có (`com.battu.dungthan`) chưa rõ đang build chế độ nào |
| Thanh toán | **Google Play Billing** cho mọi nội dung số (chính sách Thanh toán của Google Play); không dùng VNPay / MoMo / ZaloPay **trong** ứng dụng Android trừ khi Google Play có chương trình thanh toán thay thế áp dụng cho Việt Nam (M — kiểm tại thời điểm làm) |
| Dẫn ra web | theo chính sách chống dẫn hướng của Google Play hiện hành cho khu vực (M) |

### 8.2 Chính sách Google Play liên quan

| Chính sách | Áp vào |
|---|---|
| Thanh toán (Payments) | Play Billing cho tiền ảo, thuê bao, vé mùa |
| Thuê bao | màn hình mua nêu rõ giá, kỳ, tự gia hạn, cách hủy; có đường tới trang quản lý thuê bao của Google Play |
| Gia đình (Families) | **không** đăng ký chương trình dành cho trẻ em (game 12+, không thiết kế cho trẻ em); nếu đối tượng mục tiêu gồm trẻ em thì phải đáp ứng toàn bộ chính sách Gia đình — không làm |
| An toàn dữ liệu (Data safety) | khai giống §5.1 |
| Xóa tài khoản | trong ứng dụng **và** đường dẫn web cho người đã gỡ ứng dụng |
| Hộp ngẫu nhiên | không có |
| Nội dung tài chính / cờ bạc | không có |

### 8.3 Kiểm trước khi nộp Google Play

| # | Kiểm |
|---|---|
| AND-1 | Sản phẩm trong Play Console khớp mã phần 10 §2.2 |
| AND-2 | `acknowledge` / `consume` từ máy chủ, cảnh báo nếu > 24 giờ |
| AND-3 | RTDN cấu hình Pub/Sub push tới `/api/pay/google/rtdn` |
| AND-4 | Thử trên tài khoản thử nghiệm giấy phép (license tester): mua, hoàn, hết hạn thuê bao, account hold, tạm dừng |
| AND-5 | Đường dẫn web xóa tài khoản trong Play Console |

---

## 9. Chênh lệch kinh tế giữa nền tảng

| Khía cạnh | Web | iOS | Android |
|---|---|---|---|
| Trần Phúc Khí / ngày (hiện có) | 212 | 197 | 212 (nếu theo web) |
| Nguồn bù cho iOS | — | hoạt động dự kiến D1–D9 (phần 02 §3.2) đều chạy trên iOS | — |
| Giá VND | 22.000 / 109.000 / … (phần 03 §3.4) | bậc giá App Store VN | bậc giá Google Play VN |
| Số Ngọc mỗi gói | như nhau | như nhau | như nhau |
| Lượt AI mua thêm | có | không | có |
| Đồng bộ tài khoản giữa nền tảng | có — một tài khoản, một ví (phần 10). Quyền lợi mua ở nền tảng nào dùng được ở mọi nền tảng, **trừ** thuê bao: VIP mua trên Apple vẫn có hiệu lực ở web / Android (quyền lợi máy chủ), nhưng **quản lý / hủy** phải làm ở Apple |

Lưu ý về Apple: cho phép dùng trên iOS quyền lợi đã mua ở nơi khác là được phép với nội dung tài khoản đa nền tảng, nhưng ứng dụng iOS **không được** khuyến khích hay dẫn người dùng đi mua ở nơi khác.

---

## 10. Bản thảo ghi chú duyệt và siêu dữ liệu App Store

### 10.1 Ghi chú cho người duyệt (App Review Notes — tiếng Anh, vì người duyệt đọc tiếng Anh)

```
Học Quán is a 3D exploration and learning game set in a stylized East Asian
mountain academy. Players walk through temples and libraries, solve study cases
about the traditional Chinese calendar (heavenly stems, five elements, solar
terms), sit for tea, and customize their character's clothing.

The iOS build contains NO fortune-telling features for the user: no stick
drawing, no divination, no personal yearly forecasts, no AI reading.
(These are disabled in the iOS build; see review path below.)

In-app purchases are cosmetic only:
- Ngọc (virtual gems) consumable packs — used to buy clothing, decorations,
  the seasonal "Niên Lộ" track and convenience items (extra profile slots,
  outfit slots). Ngọc never expires.
- "Thượng Khách" auto-renewable subscription — daily gems, low-altitude flight,
  early visual effects, access to a few exclusive outfits.
- Seasonal track "Niên Lộ · Kim Thư" — consumable, unlocks a premium cosmetic
  reward row for the current chapter. Levels cannot be purchased.
No random rewards, no loot boxes.

Test account (sandbox): {email} / {password set in App Store Connect}
Review path: Start → Lão Tùng at the gate → Tàng Y Các (wardrobe) button on the
HUD → "Nạp Ngọc" → product sheet. Restore Purchases and Manage Subscription are
at the bottom of the purchase sheet. Account deletion: Settings → Account →
Delete account.
```

### 10.2 Mô tả App Store (tiếng Việt)

```
Học Quán — đi bộ trong một học quán trên núi, học lịch pháp và ngũ hành cổ.

· Khám phá Sơn Môn, Thư Lâu, Trà Thất và các thánh địa kiến trúc cổ phương Đông.
· Giải án học tập: dựng tứ trụ, đếm ngũ hành, chọn năm thuận cho nhân vật trong truyện.
· Học 24 tiết khí, lịch can chi, la bàn tam hợp.
· Ngồi trà, đốt trầm, gặp người chơi khác trong sân.
· Phối trang phục từ hơn 50 món, mỗi mùa có Niên Lộ mới theo năm can chi.

Mua trong ứng dụng chỉ gồm trang phục, trang trí và tiện ích.
```

Từ khóa (keywords) **không** dùng: bói, tử vi, xem vận, phong thủy may mắn, horoscope, fortune. Dùng: lịch can chi, ngũ hành, tiết khí, kiến trúc cổ, học quán, trà đạo, trang phục cổ trang.

### 10.3 Ảnh chụp màn hình

| # | Nội dung | Không có |
|---|---|---|
| 1 | sân Sơn Môn buổi sáng, nhân vật mặc áo bộ Thanh Mộc | bất kỳ màn hình kết quả vận mệnh |
| 2 | giải án học tập — bước «Đếm ngũ hành» | chữ «Dụng thần quyết định vận» |
| 3 | Trà Thất nhiều người chơi | — |
| 4 | Tàng Y Các thẻ Bộ | giá tiền cụ thể (giá do App Store hiện) |
| 5 | Niên Lộ chương Xuân | chữ «Thái Tuế» |

---

## 11. Checklist nghiệm thu phần 14

- [ ] Build iOS: lint iOS-1 … iOS-3 xanh.
- [ ] Màn hình mua IAP thay chỗ bảng gói đang bị ẩn trong `wardrobe-ui.js`.
- [ ] Đăng nhập với Apple, khôi phục giao dịch, quản lý thuê bao, xóa tài khoản: có.
- [ ] Ghi chú duyệt Apple (iOS-10) được người phụ trách nền tảng viết và lưu cùng bản nộp.
- [ ] Quyết định bản Android theo web hay iOS có văn bản.
