# 11 · Phần 15 — Giao diện cửa hàng, lời văn, thoại Thợ May Bà Tư

> Đặc tả màn hình kinh tế (Tàng Y Các, Nạp Ngọc, VIP, Đạo Lộ, chi tiêu, phụ huynh) ở mức **nội dung và trạng thái**: mỗi màn hình hiện gì, nút nào, lời nào, khi nào ẩn. Bố cục đồ họa, mã giao diện (`UI-xx`) và âm thanh thuộc tài liệu 12. Cuối phần là kịch bản thoại của Thợ May Tiên Y (Bà Tư, `tho_may`) ở quầy Tàng Y Các trong sân Sơn Môn (đã có quầy: `sect.js`, `court.js`).
>
> Mọi lời văn phải qua phần 01 §7.

---

## 1. Tàng Y Các — khung chung

### 1.1 Đầu bảng

Hiện có (`wardrobe-ui.js › head`): số dư Phúc Khí, Ngọc, trạng thái VIP; dải điểm danh 7 ngày; nút «Điểm danh», «Nạp Ngọc».

| Thành phần | Hiện tại | Đặc tả mới |
|---|---|---|
| Số dư | `✦ 520 Phúc Khí · 💎 340 Ngọc · 👑 Chân Nhân` | giữ; thêm dòng nhỏ dưới Ngọc khi bật quy đổi: «≈ 124.700đ theo gói nhỏ nhất» (phần 01 §6.3); chữ «Chân Nhân» theo quyết định tên VIP (phần 04 §5.5) |
| Dải điểm danh | N1…N7 với Ngọc mỗi ngày | thêm trạng thái **tạm dừng**: ô ngày kế tiếp có viền nét đứt và chú thích «Vòng đang dừng ở ngày 4 — điểm danh để đi tiếp» (phần 03 NG-1); **không** có chữ «sắp mất», «đứt chuỗi» |
| Nút Nạp Ngọc | web: mở thẻ VIP có bảng gói bị khóa | web: mở màn hình Nạp Ngọc (§3); iOS: mở màn hình IAP; ẩn khi tài khoản chưa khai năm sinh (thay bằng «Khai năm sinh để nạp») |
| Liên kết | — | «Về Tàng Y Các» (bốn câu thề), «Lịch sử giao dịch» |

### 1.2 Thẻ

| Thẻ | Nội dung | Hiện khi |
|---|---|---|
| 🀄 Bộ | 5 bộ ngũ hành, thân bộ và tôn bộ (phần 04 §6) | luôn |
| 8 ô | như hiện tại (`SLOTS`) | luôn |
| 🗺️ Vùng | món vùng đã ghé (phần 05 V1) | đã ghé ≥ 1 vùng ngoài Sơn Môn |
| 🏮 Lễ | món lễ đang mở bán | trong cửa sổ lễ (phần 06 §1) |
| 📜 Tàng Bảo Lục | món mùa đã quay lại | từ khi có món đầu tiên quay lại (Lập Xuân 2030) |
| 🏠 Nhà | nội thất | đã có nhà riêng |
| 🌿 Tu | danh mục **không bán** (`SKU-A-*`) — chỉ xem «nhận khi …» | luôn (để người chơi biết đường tu, và hiểu những thứ này không mua được) |
| 👑 VIP | §4 | luôn |

Mục «Đề cử» (hàng món nổi bật đầu thẻ ô) **ẩn** khi đang trong vùng im lặng (phần 01 §6.2).

### 1.3 Thẻ món — các trạng thái

| Trạng thái | Nút | Lời phụ |
|---|---|---|
| Chưa có, mua được | `[💎 160]` (hoặc `[✦ 240]`); giá kép: hai nút `[💎 160]` `[✦ 1.200]`; `[Thử 20s]` | — |
| Chưa có, khóa VIP | `[💎 380]` mờ, `[Thử 20s]` | «🔒 Dành cho Thượng Khách» |
| Chưa có, khóa cấp | như trên | «🔒 Cần cấp 8» |
| Chưa có, khóa chuỗi | như trên | «🔒 Điểm danh 7 lần trong 9 ngày (đã có 5)» |
| Chưa có, thiếu tiền | nút mờ | «Còn thiếu 40 Ngọc» — **không** kèm nút «Nạp ngay» trên thẻ |
| Đã có, đang mặc | «Đang mặc ✓», `[Tháo]` | — |
| Đã có, chưa mặc | `[Mặc]` | — |
| Món mùa | không nút mua | «Nhận ở Đạo Lộ · Thu Lộ bậc 20 (Kim Thư)» |
| Món vòng giữa (thẻ 🌿 Tu) | không nút | «Nhận khi quy y ở Bút Tháp» — không giá, không «sắp có» |
| Món có `consultPending` | không hiện | — |

Mỗi thẻ món thuộc bộ có thêm dòng chuẩn: «Bộ Thanh Mộc Tiên Tông · Hợp mệnh +10% Phúc Khí khi giải án và ở sảnh nghề. Không ảnh hưởng Đạo Hạnh, cảnh giới, công đức.»

### 1.4 Xác nhận mua bằng tiền ảo

Hiện tại `wardrobe-ui.js` mua ngay khi bấm nút giá, rồi tự mặc. Đặc tả mới:

| Giá | Hành vi |
|---|---|
| Phúc Khí < 100 | mua ngay (như hiện tại), toast «Đã thỉnh … · đang mặc» |
| Mọi giá khác | bảng xác nhận (§1.5) |

Sau khi mua: **Đổi ý trong 10 phút** — nếu món chưa được mặc ra ngoài cảnh quá 10 phút, người chơi bấm «Đổi ý» trong tủ đồ để trả món và nhận lại đúng số tiền ảo đã trả (đúng tỷ lệ Ngọc Tặng / Ngọc Nạp). Tối đa 3 lần đổi ý / ngày. Mục đích: chống bấm nhầm trên điện thoại, giảm hối tiếc.

### 1.5 Bảng xác nhận

```
┌──────────────────────────────────────────────┐
│  Thỉnh «Thanh Mộc Tiên Y»?                    │
│  Huyền · Phẩm phục · Bộ Thanh Mộc Tiên Tông   │
│                                              │
│  Giá: 💎 160 Ngọc  (≈ 58.700đ)               │
│  Sau khi thỉnh: 💎 180 Ngọc                   │
│                                              │
│  Hợp mệnh: +10% Phúc Khí khi giải án và ở    │
│  sảnh nghề khi mặc đủ 4 món bộ. Không ảnh    │
│  hưởng Đạo Hạnh, cảnh giới, công đức.        │
│                                              │
│  [ Thử 20 giây ]   [ Thôi ]   [ Thỉnh ]      │
└──────────────────────────────────────────────┘
```

- Nút «Thôi» và «Thỉnh» **cùng cỡ**, «Thôi» không mờ, không chữ mỉa (X7).
- Không có hộp «Đừng hỏi lại» cho giá ≥ 300 Ngọc.

### 1.6 Lời toast

| Sự kiện | Lời |
|---|---|
| Mua xong | «Đã thỉnh «<tên>» · đang mặc» (đã có trong code) |
| Đổi ý xong | «Đã trả «<tên>» · hoàn 💎 <n>» |
| Hết lượt đổi ý | «Hôm nay đã đổi ý 3 lần. Mai lại đổi được.» |
| Mặc đủ bộ hợp mệnh | «Đã mặc bộ <tên> · Hợp mệnh +10%» (đã có) |
| Đủ bộ nhưng không hợp | «Đã mặc bộ <tên>.» — **không** nói «tiếc là không hợp mệnh bạn» |

---

## 2. Thẻ Bộ

Hiện tại (`setsView`) có đoạn giải thích Hợp mệnh và đánh dấu bộ hợp Dụng thần. Giữ, cộng:

| Thêm | Lý do |
|---|---|
| Mỗi bộ hiện **hai giá**: «💎 570 hoặc ✦ 2.400» (thân bộ) | đường miễn phí (phần 01 §4.1) |
| Dòng «Mọi bộ cùng giá — giá không phụ thuộc lá số» | minh bạch về bình giá |
| Bộ hợp mệnh có nhãn «Hợp mệnh của bạn» (đã có) nhưng **không** đặt bộ đó lên đầu danh sách, **không** đổi màu nút mua | thông tin, không phải lời mời (X4) |
| Mục «Tôn bộ» thu gọn dưới mỗi bộ | món đẹp đắt không lấn thân bộ |

---

## 3. Nạp Ngọc

### 3.1 Web

| Phần | Nội dung |
|---|---|
| Tiêu đề | «Nạp Ngọc» |
| Dòng đầu | «Ngọc dùng để thỉnh trang phục, vé Đạo Lộ, tiện ích. Ngọc không đổi ra tiền và không chuyển cho người khác.» + liên kết «Chính sách Ngọc» |
| Danh sách gói | 5 gói `SKU-P-01..05`: số Ngọc, giá, **giá mỗi 100 Ngọc** (36.700đ, 33.000đ, 31.300đ, 28.100đ, 26.200đ) — không có nhãn «Phổ biến nhất», «Hời nhất» |
| Gói khởi đầu | `SKU-B-01` hiện riêng, nhỏ, trong 30 ngày đầu; ghi «một lần» |
| Chọn kênh | VNPay · MoMo · ZaloPay · Thẻ quốc tế (nếu có — phần 11 P4) |
| Trước nút trả tiền | «Bạn đang mua <gói> giá <x>đ (đã gồm thuế). Ngọc vào tủ khi ví xác nhận. Điều kiện hoàn tiền: <tóm tắt> · Xem chính sách.» |
| Đã chi 30 ngày | «30 ngày qua bạn đã nạp <y>đ.» luôn hiện (không chỉ khi vượt ngưỡng) |
| Trần | nếu gần trần: «Còn <z>đ trước trần bạn đặt.» |

### 3.2 iOS / Android

| Phần | Nội dung |
|---|---|
| Danh sách gói | lấy giá từ StoreKit / Play Billing (giá nền tảng, tiền tệ địa phương) |
| Dòng đầu | như web, bỏ mọi nhắc tới web / ví VN (phần 14 iOS-2) |
| Nút | gọi bảng thanh toán của nền tảng |
| Khôi phục | «Khôi phục giao dịch» ở cuối |

---

## 4. Thẻ VIP

### 4.1 Nội dung

```
👑 Thượng Khách (VIP)

Mỗi ngày bạn ghé quán:   💎 +30 Ngọc
Ngự Vân Thường:           bay thấp ngay (Ngự Kiếm cao vẫn theo cảnh giới)
Hiệu ứng ngũ hành:        mở sớm hào quang, linh khí, vệt sáng
Món riêng:                được thỉnh Tử Y, Kim Liên Quang Quan, Bát Quái Kim Luân, Tiên Hạc
Thầy AI:                  30 lượt mỗi ngày (web, Android)
Phối đồ:                  +3 ô
Hỗ trợ:                   trả lời trong 24 giờ

Không có trong VIP: Đạo Hạnh, cảnh giới, công đức, thứ hạng, kết quả luận giải.

Tháng 99.000đ · Quý 269.000đ · Năm 899.000đ · Thẻ 30 ngày 109.000đ (không tự gia hạn)
Tự gia hạn cho tới khi bạn hủy. Hủy bất cứ lúc nào, vẫn dùng tới hết kỳ.
Hết VIP: giữ mọi món đã thỉnh và Ngọc đã nhận.
```

### 4.2 Trạng thái

| Trạng thái (phần 07 §4.1) | Dòng hiện |
|---|---|
| `active` | «Bạn là Thượng Khách tới <ngày>, tự gia hạn.» + `[Quản lý]` |
| `active_canceled` | «Bạn là Thượng Khách tới <ngày>. Đã tắt tự gia hạn.» + `[Bật lại tự gia hạn]` |
| `grace` | «Lần gia hạn chưa thành công. Quyền lợi vẫn giữ tới <ngày>. Kiểm phương thức thanh toán.» |
| `on_hold` / `expired` | «Bạn chưa là Thượng Khách.» — không có lời nuối tiếc |
| `revoked` | «Quyền Thượng Khách đã dừng do giao dịch được hoàn tiền.» |
| Tài khoản < 18 | chỉ hiện thẻ 30 ngày; dòng «Thuê bao tự gia hạn dành cho người từ 18 tuổi.» |

### 4.3 Hủy (web)

```
Hủy tự gia hạn Thượng Khách?
Bạn vẫn là Thượng Khách tới <ngày>. Sau ngày đó, bạn giữ mọi món đã thỉnh.
[ Giữ tự gia hạn ]   [ Hủy tự gia hạn ]
(Tùy chọn) Cho quán biết lý do: [ ô chữ ]
```

Không có màn hình thứ hai, không đề nghị giảm giá.

---

## 5. Màn hình Đạo Lộ

| Vùng | Nội dung |
|---|---|
| Đầu | tên mùa, chương, ngày còn lại («Thu Lộ · còn 41 ngày»); thanh Lộ Điểm («Bậc 14 · 620 / 1.000») |
| Hai hàng thưởng | Thanh Lộ (trên), Kim Thư (dưới), 30 cột + Dư Lộ; món đã nhận có dấu ✓; món Kim Thư khi chưa mua hiện ổ khóa nhỏ, **không** làm mờ cả hàng |
| Lộ Dư | «Quỹ bù: 1.800 Lộ Điểm — điểm kiếm được đang nhân đôi» (khi quỹ > 0); giải thích một dòng |
| Lộ Thư | 6 việc tuần, đánh dấu 4 việc tính điểm; mỗi việc có phương án một mình ghi rõ |
| Trần tuần | «Tuần này: 2.300 / 4.000» |
| Mua Kim Thư | `[Kim Thư · 109.000đ]` (web), `[Kim Thư · 💎 1.000]`, (iOS / Android: giá nền tảng); dòng «Nhận ngay thưởng Kim Thư của các bậc đã đạt. Không bán bậc.» |
| Chương sắp hết, người chơi chưa đạt bậc 30 | «Còn 6 ngày. Bạn đang ở bậc 26 — với nhịp hiện tại bạn sẽ tới khoảng bậc 29.» — **không** bán bậc, không lời thúc |

---

## 6. Chi tiêu

### 6.1 Tổng kết chi tiêu (khi chạm ngưỡng phần 01 §9.3)

```
Tổng kết chi tiêu

30 ngày qua:   2.150.000đ
12 tháng qua:  5.430.000đ

Quán không giới hạn bạn ở mức này. Nếu muốn, bạn có thể đặt trần cho
chính mình — trần có hiệu lực ngay, nâng trần phải chờ 7 ngày.

[ Đặt trần ]   [ Đóng ]
```

### 6.2 Xác nhận lại giao dịch lớn (≥ 5.000.000đ / 30 ngày, giao dịch ≥ 400.000đ)

```
Bạn đã nạp 5.120.000đ trong 30 ngày.
Giao dịch này: 449.000đ.
[ Thôi ]   [ Tiếp tục ]
```

### 6.3 Đặt trần

| Thành phần | Nội dung |
|---|---|
| Ô số tiền | bước 100.000đ; có lựa chọn «0 — không nạp» |
| Giải thích | «Trần tính trên 30 ngày trượt. Hạ trần: ngay. Nâng trần: sau 7 ngày.» |
| Đang chờ nâng | «Trần mới 1.000.000đ có hiệu lực từ <ngày>. [Hủy yêu cầu nâng]» |

### 6.4 Lịch sử giao dịch

| Cột | Ví dụ |
|---|---|
| Ngày giờ | 09/08/2027 20:14 |
| Sản phẩm | Gói 330 Ngọc |
| Kênh | MoMo |
| Số tiền | 109.000đ |
| Trạng thái | Đã nhận · Đang chờ · Đã hoàn · Thất bại |
| Mã đơn | `HQ-2708-…` |
| Hành động | «Yêu cầu hỗ trợ» (web) |

Lọc theo tháng; xuất CSV (quyền người tiêu dùng và tiện cho kê khai cá nhân).

### 6.5 Yêu cầu hoàn tiền (web)

| Trường | Ghi chú |
|---|---|
| Đơn | chọn từ lịch sử |
| Lý do | chọn: «Mua nhầm» · «Không nhận được» · «Người dưới 18 tuổi mua» · «Khác» |
| Mô tả | tùy chọn |
| Hệ thống tự cho biết | «Đơn này **đủ** / **chưa đủ** điều kiện hoàn tự động theo chính sách vì …» trước khi gửi |

---

## 7. Bảng Phụ Huynh (web)

| Mục | Nội dung |
|---|---|
| Tài khoản con | tên nhân vật, nhóm tuổi, thời gian chơi trực tuyến 7 ngày (biểu đồ cột theo ngày) |
| Chi tiêu | tổng 30 ngày, danh sách giao dịch |
| Trần | đặt 0–200.000đ (< 16), mặc định 0 |
| Duyệt từng giao dịch | bật / tắt (mặc định bật) |
| Yêu cầu chờ duyệt | sản phẩm, giá, `[Duyệt]` `[Từ chối]`, tự hủy sau 24 giờ |
| Giới hạn giờ | hiện giới hạn pháp luật; cho phép đặt **thấp hơn** |
| Hoàn tiền | nút gửi yêu cầu |
| Lời đầu trang | «Huyền Quán là trò chơi về văn hóa phương Đông. Trò chơi không bán thứ gì làm thay đổi vận mệnh; mọi món mua chỉ là trang phục, tiện ích.» |

---

## 8. Trang «Về Tàng Y Các» (trong game)

```
Tàng Y Các bán áo, không bán mệnh.

· Không món nào ở đây làm thay đổi Đạo Hạnh, cảnh giới, công đức, nghiệp,
  hay lời Thầy nói về lá số của bạn.
· Không có hộp quà ngẫu nhiên. Bạn luôn thấy trước thứ mình nhận.
· Quán không mời bạn mua sau khi bạn vừa xem chuyện vận hạn.
· Những thứ gắn với tu tập thật — áo tràng, pháp y, chuỗi hạt —
  không bán. Chúng chỉ đến khi bạn tu.

Bộ Hợp mệnh cho thêm 10% Phúc Khí khi giải án — và đổi được bằng
Phúc Khí cày trong quán, không cần Ngọc.

Sổ Quán mùa này: [xem]
```

---

## 9. Trang «Sổ Quán» (báo cáo minh bạch mỗi mùa)

| Mục | Nội dung |
|---|---|
| Món mới | số món mới theo nhóm; số đề xuất bị loại ở duyệt và nhóm lý do (phần 01 §3) |
| Doanh thu theo nhóm | tỷ lệ % (không số tuyệt đối nếu chủ dự án không muốn công bố) |
| Rào chắn | `ETH_TOP1_SHARE`, `ETH_REFUND_RATE`, `ETH_MINOR_SPEND`, `ETH_LOW_CHART_CONVERSION` (phần 12 §4.3) |
| Thử nghiệm A/B | danh sách đã chạy, kết quả |
| Quỹ cố vấn | số đã chi cho cố vấn truyền thống từ `SKU-V-05`, `SKU-B-12` |
| Thay đổi kinh tế | hằng số đã đổi (phần 16 §2), lý do |

---

## 10. Trợ năng

| Mục | Yêu cầu |
|---|---|
| Màu bậc hiếm (`RARITY`) | luôn kèm **chữ** tên bậc (đã có `hq-yc-r`), không chỉ dựa vào màu |
| Tương phản | chữ trên thẻ ≥ 4,5 : 1 với nền tối của bảng |
| Đọc màn hình | nút giá có nhãn đầy đủ: «Thỉnh Thanh Mộc Tiên Y, 160 Ngọc» |
| Giảm chuyển động | khi bật `reduced` (đã có), xem thử hiện ảnh tĩnh thay hoạt cảnh; hào quang xem trước không nhấp nháy |
| Cỡ chữ | theo cài đặt cỡ chữ chung (sơ đồ tổng §12) |
| Âm thanh mua | không có tiếng «ting» mua hàng kiểu máy đánh bạc; tiếng giấy gói nhẹ, tắt được |

---

## 11. Thoại Thợ May Tiên Y — Bà Tư (`tho_may`)

**Persona ngắn.** Bà Tư là thợ may già ở quầy Tàng Y Các. Bà mê vải, mê đường kim. Bà **không** nói chuyện vận mệnh, không xem tướng, không khen ai «sang số». Bà không bao giờ giục mua. Khi người chơi hỏi chuyện mệnh, bà chỉ lên Bàn Thầy. Thoại AI của Bà Tư (nếu có) dùng persona này và quy tắc 1 §6.4 sơ đồ tổng — NPC khác không nhắc cửa hàng; riêng Bà Tư được nói về áo vì đây là nghề của bà, nhưng không nói về Ngọc, VIP, gói, giá khuyến mãi.

### 11.1 Gặp lần đầu

```
[CẢNH Tàng Y Các · quầy Thợ May · lần đầu ghé · ban ngày]
BÀ TƯ: (ngẩng lên khỏi khung thêu) À, người mới. Áo con đang mặc là áo Bản Mệnh — màu theo con, quán may sẵn cho mỗi người nhập môn.
BÀ TƯ: Muốn thay áo thì xem trên giá. Thử thoải mái, thử không mất gì.
> Lựa chọn: ① «Áo này có giúp gì cho con không ạ?» → [11.1a]  ② «Con xem thử ạ.» → [mở Y Các]  ③ «Để lúc khác ạ.» → [kết thúc]

[11.1a]
BÀ TƯ: Áo thì giúp con ấm, giúp con đẹp. Còn chuyện số phận thì ra Bàn Thầy mà hỏi — kim chỉ của bà không với tới đó.
BÀ TƯ: (cười) Có điều mặc đủ một bộ đúng hành của con thì làm việc nghề thấy hăng hơn chút. Quán tính thêm một phần mười Phúc Khí. Thế thôi.
```

### 11.2 Chào theo giờ (ngẫu nhiên một câu, theo giờ can chi trong game)

| Giờ | Câu |
|---|---|
| Mão (5–7) | «Sớm thế. Bà vừa là xong mẻ áo.» |
| Thìn – Tỵ (7–11) | «Nắng lên rồi, vải lụa phơi một lúc là thơm.» |
| Ngọ (11–13) | «Trưa rồi, ngồi đâu đó uống chén trà đã, áo không chạy mất đâu.» |
| Mùi – Thân (13–17) | «Chiều nay khách vắng, bà thêu nốt cái viền mây.» |
| Dậu – Tuất (17–21) | «Lên đèn rồi. Áo nhìn dưới đèn lồng khác ban ngày đấy, thử mà xem.» |
| Hợi – Tý (21–1) | «Khuya rồi còn đi đâu? Thôi xem nhanh rồi về nghỉ.» |
| Sửu – Dần (1–5) | «Giờ này bà cũng chỉ ngồi xâu kim. Con không ngủ được à?» |

Câu giờ Hợi – Dần không bao giờ kèm lời mời xem món (giờ khuya — phần 01 §6.4 tinh thần X11).

### 11.3 Người chơi vừa từ màn hình vận mệnh sang (vùng im lặng)

```
[CẢNH Tàng Y Các · người chơi vừa rời Thái Tuế Điện / Vận Mệnh Các / Mệnh Bàn < 10 phút]
BÀ TƯ: (đặt khung thêu xuống) Ngồi đây một lát. Bà có ấm trà gừng.
> Lựa chọn: ① «Con ngồi một lát.» → [ngồi trà — mở Trà Thất, không mở Y Các]  ② «Con xem áo thôi ạ.» → [mở Y Các ở chế độ danh mục trơn, không Đề cử]
```

Không có câu nào về «áo giải hạn», «màu kỵ năm nay».

### 11.4 Hỏi «Món nào hợp mệnh con?»

```
[CẢNH Tàng Y Các · người chơi hỏi về hợp mệnh]
BÀ TƯ: Bộ nào trùng hành Dụng thần của con thì quán ghi «Hợp mệnh» ở thẻ bộ. Của con là bộ <tên bộ theo yong.primary>.
BÀ TƯ: Nhưng con nghe bà: mặc cho vừa người, cho mình thích. Áo không đổi được số. Muốn đổi số thì làm việc tốt, học cho thấu — chuyện đó Vân Cốc thiền sư nói hay hơn bà.
```

(Câu cuối dẫn về Liễu Phàm — `van_coc` — đúng T2 và `RB5`. Bản iOS: thay «Dụng thần» bằng «hành bạn đang học bổ sung», bỏ câu về đổi số.)

### 11.5 Hỏi mua thứ thiêng

```
[CẢNH Tàng Y Các · người chơi hỏi «Bà có bán áo cà sa / áo tràng / pháp y không?»]
BÀ TƯ: Không, con. Áo của người tu không phải đồ để bán. Áo tràng thì chùa trao khi con quy y; pháp y thì thầy ban khi con thụ lục.
BÀ TƯ: Bà may được áo đi lễ cho con mặc lên chùa cho gọn gàng, kín đáo. Còn áo kia, con tu thì sẽ có.
> Lựa chọn: ① «Áo đi lễ thì xem ở đâu ạ?» → [mở Y Các › Vùng › Bút Tháp]  ② «Con hiểu rồi.» → [kết thúc]
```

### 11.6 Người chơi thiếu tiền ảo

```
[CẢNH Tàng Y Các · người chơi bấm vào món thiếu Ngọc lần thứ ba trong ngày]
BÀ TƯ: Món đó đẹp nhỉ. Không vội đâu — áo treo đây, không ai lấy mất. Mà món này còn đổi được bằng Phúc Khí đấy, con làm nghề vài hôm là đủ.
```

(Câu sau chỉ hiện nếu món có giá kép. Bà Tư **không** nói «nạp Ngọc», «gói».)

### 11.7 Người chơi mua nhiều trong ngày

```
[CẢNH Tàng Y Các · người chơi đã thỉnh ≥ 5 món trong ngày]
BÀ TƯ: Hôm nay nhiều áo mới quá. Mặc dần dần mà ngắm, mỗi hôm một bộ cho có cái vui.
```

Không trách, không khen chi tiêu. Câu này chỉ một lần mỗi ngày.

### 11.8 Lễ tiết

| Lễ | Câu |
|---|---|
| Tết | «Năm mới may áo mới, cũ người mới ta. Áo dài gấm đỏ bà treo bên trái đấy.» |
| Thượng Nguyên | «Rằm Giêng đi lễ thì mặc kín đáo thôi con.» |
| Đoan Ngọ | «Mùng năm buộc chỉ ngũ sắc cho vui, phong tục thôi, đừng tin nó chữa được gì.» |
| Thất Tịch | «Mưa ngâu dầm dề, bà may cái áo tơi cho ai đi đường xa.» |
| Vu Lan | «Tháng này quán không bày bán đồ lễ. Bông hồng cài áo thì quán tặng — con tự chọn màu.» |
| Trung Thu | «Đèn ông sao bà dán hôm qua, giấy bóng kính còn thơm hồ.» |
| Hạ Nguyên / Phật đản | «Hôm nay quán nghỉ bán. Con lên chùa thì đi đi, áo để hôm khác.» |
| Đông Chí | «Trời trở rét. Áo bông chần bà mới khâu.» |
| Ông Táo | «Chiều nay nhà nhà tiễn ông Táo. Bà có cái đèn cá chép, treo cho đẹp hiên.» |

### 11.9 Món mùa mới về

```
[CẢNH Tàng Y Các · ngày đầu chương mới · lần ghé đầu tiên trong chương]
BÀ TƯ: Mùa mới về mấy mẫu, bà treo ở góc Đạo Lộ. Những cái đó không bán ở quầy — con đi đường mùa này thì quán trao.
```

### 11.10 Người chơi hỏi về VIP / Ngọc

```
[CẢNH Tàng Y Các · người chơi hỏi «Bà ơi, VIP có gì? Ngọc mua ở đâu?»]
BÀ TƯ: Chuyện sổ sách là ông quản quán lo, có bảng trong Y Các đó con. Bà chỉ biết may.
```

(Bà Tư không giải thích VIP — tách vai «người thợ» khỏi «người bán gói».)

### 11.11 Phản hồi khi người chơi khen áo của người khác (MMO)

```
[CẢNH Tàng Y Các · có người chơi khác đứng gần mặc món hiếm · người chơi hỏi «Áo kia là áo gì?»]
BÀ TƯ: Áo <tên> đó, bậc <bậc hiếm>. Ai mặc gì là việc của người ta, con ạ. Muốn xem kiểu thì thử 20 giây, không mất gì.
```

Không nói người kia «giàu», «VIP», «sang».

### 11.12 Từ chối nói về vận

```
[CẢNH Tàng Y Các · người chơi hỏi «Năm nay con phạm Thái Tuế, mặc màu gì để giải?»]
BÀ TƯ: Bà không xem chuyện đó, con. Thái Tuế Điện ở sau chánh điện, đèn an Thái Tuế thắp không mất tiền. Ra Bàn Thầy hỏi thầy, thầy chỉ cho những việc con tự làm được.
```

(Đúng `RB5`: hóa giải là hành động miễn phí. Bản iOS: cảnh này không xuất hiện vì Thái Tuế Điện tắt.)

---

## 12. Checklist nghiệm thu phần 15

- [ ] Xác nhận mua cho mọi giá trừ Phúc Khí < 100; nút «Thôi» và «Thỉnh» cùng cỡ.
- [ ] «Đổi ý trong 10 phút» hoạt động, trả đúng ví.
- [ ] Mục «Đề cử» ẩn trong vùng im lặng.
- [ ] Bảng gói không có nhãn «Phổ biến nhất», «Hời nhất»; có giá mỗi 100 Ngọc.
- [ ] Hủy VIP web một màn hình.
- [ ] Bà Tư không có câu nào chứa «Ngọc», «VIP», «gói», «nạp», «may mắn», «giải hạn» (lint thoại).
- [ ] Thẻ 🌿 Tu hiện danh mục không bán, không có giá.
