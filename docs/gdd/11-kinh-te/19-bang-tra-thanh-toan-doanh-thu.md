# 11 · Phần 19 — Bảng tra trạng thái thanh toán và mô hình doanh thu

> Hai thứ người vận hành cần tra hằng ngày: (1) mỗi mã trạng thái / thông báo của từng kênh thanh toán dẫn tới hành động nào ở Két (phần 10) và lời nào cho người chơi (phần 15); (2) mô hình doanh thu – chi phí theo ba kịch bản quy mô, để biết kinh tế «có đạo đức» này có tự nuôi được không, và nhạy với những biến số nào.
>
> Mã trạng thái của nhà cung cấp ghi theo tài liệu tích hợp công khai tới khi viết; **phải đối chiếu tài liệu hiện hành** khi ký hợp đồng merchant — nhà cung cấp có thể thêm / đổi mã.

---

## 1. VNPay — `vnp_ResponseCode` (IPN và trang trả về)

| Mã | Nghĩa (tóm tắt) | Đơn | Két | Lời cho người chơi |
|---|---|---|---|---|
| `00` | giao dịch thành công | `paid` → `granted` | cấp quyền lợi (chỉ khi `vnp_TransactionStatus = 00` và chữ ký đúng) | «Đã nhận <N> Ngọc.» |
| `07` | trừ tiền thành công, giao dịch bị nghi ngờ | `pending` | **không** cấp; đưa vào hàng chờ xét; truy vấn lại sau 30 phút | «Ví đang xác minh giao dịch. Ngọc sẽ vào khi xác minh xong.» |
| `09` | thẻ / tài khoản chưa đăng ký Internet Banking | `failed` | — | «Thẻ chưa bật thanh toán trực tuyến. Bạn không bị trừ tiền.» |
| `10` | xác thực thông tin thẻ sai quá 3 lần | `failed` | — | «Xác thực không thành công. Bạn không bị trừ tiền.» |
| `11` | hết hạn chờ thanh toán | `expired` | — | «Đơn đã hết hạn và không bị trừ tiền.» |
| `12` | thẻ / tài khoản bị khóa | `failed` | — | «Thẻ đang bị khóa. Bạn không bị trừ tiền.» |
| `13` | nhập sai OTP | `failed` | — | «Mã OTP chưa đúng. Bạn không bị trừ tiền.» |
| `24` | khách hủy giao dịch | `canceled` | — | «Bạn đã hủy thanh toán.» |
| `51` | không đủ số dư | `failed` | — | «Tài khoản không đủ số dư.» |
| `65` | vượt hạn mức giao dịch trong ngày | `failed` | — | «Vượt hạn mức trong ngày của ngân hàng.» |
| `75` | ngân hàng đang bảo trì | `failed` | — | «Ngân hàng đang bảo trì, thử lại sau.» |
| `79` | nhập sai mật khẩu thanh toán quá số lần | `failed` | — | «Xác thực không thành công.» |
| `99` | lỗi khác | `failed` | ghi cảnh báo; truy vấn `querydr` | «Giao dịch không thành công. Nếu bị trừ tiền, liên hệ quán kèm mã đơn.» |

Mã trả lời IPN của quán cho VNPay: `00` xác nhận, `01` không tìm thấy đơn, `02` đơn đã xác nhận, `04` sai số tiền, `97` sai chữ ký, `99` lỗi khác (phần 10 §5.2).

---

## 2. MoMo — `resultCode`

| Mã | Nghĩa (tóm tắt) | Đơn | Két | Lời |
|---|---|---|---|---|
| `0` | thành công | `granted` | cấp | «Đã nhận <N> Ngọc.» |
| `9000` | giao dịch đã được xác nhận (với luồng thanh toán hai bước) | `pending` | chưa cấp tới khi `0` (quán dùng luồng `captureWallet` một bước — mã này không kỳ vọng xuất hiện) | «Đang xác nhận.» |
| `1000` | đã khởi tạo, chờ người dùng xác nhận | `pending` | — | «Đang chờ bạn xác nhận trên MoMo.» |
| `1001` | không đủ số dư | `failed` | — | «Ví MoMo không đủ số dư.» |
| `1002` | bị từ chối bởi nhà phát hành | `failed` | — | «Giao dịch bị từ chối.» |
| `1003` | đã hủy | `canceled` | — | «Bạn đã hủy thanh toán.» |
| `1004` | vượt hạn mức | `failed` | — | «Vượt hạn mức thanh toán.» |
| `1005` | liên kết / mã QR hết hạn | `expired` | — | «Mã thanh toán đã hết hạn.» |
| `1006` | người dùng từ chối xác nhận | `canceled` | — | «Bạn đã từ chối thanh toán.» |
| khác | lỗi | `failed` | ghi cảnh báo, truy vấn trạng thái | «Giao dịch không thành công, bạn không bị trừ tiền.» |

---

## 3. ZaloPay

| Giai đoạn | Giá trị | Ý nghĩa | Két |
|---|---|---|---|
| Callback `type` | 1 | thanh toán đơn hàng | xử lý |
| Callback hợp lệ | — | `mac = HMAC-SHA256(key2, data)` khớp | cấp; trả `return_code: 1` |
| Callback lặp | — | đơn đã `granted` | trả `return_code: 2`, không cấp lại |
| Callback lỗi | — | MAC sai, dữ liệu hỏng | trả `return_code` ≤ 0; ZaloPay gửi lại theo chính sách của họ |
| Truy vấn trạng thái | `return_code = 1` | thành công | cấp nếu chưa |
| | `return_code = 2` | thất bại | `failed` |
| | `return_code = 3` | đang xử lý | giữ `pending`, truy vấn lại sau 5 phút, tối đa 6 lần |

---

## 4. Stripe — sự kiện webhook

| Sự kiện | Két | Ghi chú |
|---|---|---|
| `checkout.session.completed` (`mode=payment`, `payment_status=paid`) | cấp | khóa `(stripe, payment_intent)` |
| `checkout.session.completed` (`payment_status=unpaid`, phương thức chậm) | `pending` | chờ `checkout.session.async_payment_succeeded` |
| `checkout.session.async_payment_succeeded` | cấp | — |
| `checkout.session.async_payment_failed` | `failed` | — |
| `checkout.session.completed` (`mode=subscription`) | tạo bản ghi thuê bao, cấp kỳ đầu | — |
| `invoice.paid` | gia hạn `vip.until` = `period_end` | — |
| `invoice.payment_failed` | thuê bao → `grace` (7 ngày) | email nhắc cập nhật thẻ, **một** lần |
| `customer.subscription.updated` | cập nhật `autoRenew` (`cancel_at_period_end`), gói | — |
| `customer.subscription.deleted` | → `expired` | — |
| `charge.refunded` | phần 10 §8.2 | — |
| `charge.dispute.created` | phần 13 §3.2 | — |
| `charge.dispute.closed` | `won` / `lost` | — |

---

## 5. Apple — App Store Server Notifications V2

| `notificationType` (· `subtype`) | Ý nghĩa | Két |
|---|---|---|
| `SUBSCRIBED` · `INITIAL_BUY` | mua thuê bao lần đầu | `active`, `vip.until = expiresDate` |
| `SUBSCRIBED` · `RESUBSCRIBE` | mua lại sau khi hết | `active` |
| `DID_RENEW` | gia hạn thành công | kéo `vip.until` |
| `DID_RENEW` · `BILLING_RECOVERY` | gia hạn được sau lần lỗi | `active` |
| `DID_CHANGE_RENEWAL_STATUS` · `AUTO_RENEW_DISABLED` | người dùng tắt tự gia hạn | `active_canceled` |
| `DID_CHANGE_RENEWAL_STATUS` · `AUTO_RENEW_ENABLED` | bật lại | `active` |
| `DID_CHANGE_RENEWAL_PREF` | đổi gói (tháng ↔ năm) cho kỳ sau | ghi gói kỳ sau |
| `DID_FAIL_TO_RENEW` · `GRACE_PERIOD` | lỗi gia hạn, đang trong grace | `grace`, quyền lợi giữ |
| `DID_FAIL_TO_RENEW` (không subtype) | lỗi, không grace | `expired` khi tới hạn |
| `GRACE_PERIOD_EXPIRED` | hết grace | `expired` |
| `EXPIRED` · `VOLUNTARY` / `BILLING_RETRY` | hết hạn | `expired` |
| `REFUND` | Apple hoàn tiền | phần 10 §8.2 |
| `REFUND_REVERSED` | Apple đảo ngược hoàn tiền | khôi phục quyền lợi, bù lại Ngọc đã trừ |
| `REFUND_DECLINED` | Apple từ chối yêu cầu hoàn | ghi nhận |
| `REVOKE` | quyền lợi bị thu hồi (Family Sharing) | quán **không** bật Family Sharing cho thuê bao (phần 14) — kỳ vọng không xuất hiện |
| `CONSUMPTION_REQUEST` | Apple hỏi thông tin tiêu dùng consumable | gửi thông tin trung thực trong hạn (phần 10 §6.2) |
| `TEST` | thông báo thử | trả 200 |

---

## 6. Google Play — RTDN

### 6.1 `subscriptionNotification.notificationType`

| Mã | Tên | Két (sau khi gọi `subscriptionsv2.get` lấy trạng thái thật) |
|---|---|---|
| 1 | `SUBSCRIPTION_RECOVERED` | `active` (khỏi account hold) |
| 2 | `SUBSCRIPTION_RENEWED` | kéo `vip.until` |
| 3 | `SUBSCRIPTION_CANCELED` | `active_canceled` |
| 4 | `SUBSCRIPTION_PURCHASED` | `active`; `acknowledge` |
| 5 | `SUBSCRIPTION_ON_HOLD` | `on_hold` (quyền lợi dừng) |
| 6 | `SUBSCRIPTION_IN_GRACE_PERIOD` | `grace` |
| 7 | `SUBSCRIPTION_RESTARTED` | `active` (người dùng khôi phục trước khi hết) |
| 9 | `SUBSCRIPTION_DEFERRED` | kéo hạn theo `expiryTime` mới |
| 10 | `SUBSCRIPTION_PAUSED` | `paused` |
| 11 | `SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED` | ghi lịch tạm dừng |
| 12 | `SUBSCRIPTION_REVOKED` | `revoked` |
| 13 | `SUBSCRIPTION_EXPIRED` | `expired` |
| 20 | `SUBSCRIPTION_PENDING_PURCHASE_CANCELED` | hủy đơn chờ |

### 6.2 `oneTimeProductNotification.notificationType`

| Mã | Tên | Két |
|---|---|---|
| 1 | `ONE_TIME_PRODUCT_PURCHASED` | gọi `purchases.products.get`; `purchaseState = 0` → cấp → `consume` |
| 2 | `ONE_TIME_PRODUCT_CANCELED` | đơn chờ (`PENDING`) bị hủy → `canceled` |

### 6.3 `voidedPurchaseNotification`

Hoàn tiền / hủy giao dịch → phần 10 §8.2. Quét thêm Voided Purchases API mỗi ngày để không sót.

---

## 7. Mô hình doanh thu – chi phí

### 7.1 Giả định

| Biến | Giá trị | Nguồn / ghi chú |
|---|---|---|
| DAU / MAU | 25% | phần 12 §4.1 |
| Cơ cấu kênh doanh thu gộp | web 40% · iOS 25% · Android 35% | giả định — web có lợi thế giá ở VN |
| Thuế giá trị gia tăng | giá niêm yết đã gồm 10% → doanh thu trước thuế = gộp / 1,1 | phần 11 §6 (K) |
| Phí kênh web (ví VN) | ~2% | **ước tính, cần báo giá merchant** |
| Phí Apple | 15% | chương trình nhà phát triển nhỏ (doanh thu < 1 triệu USD / năm) |
| Phí Google | 15% | 1 triệu USD đầu mỗi năm; thuê bao 15% |
| Hệ số còn lại sau thuế + phí | web 0,891 · app 0,773 · bình quân **0,82** | 0,4 × 0,891 + 0,6 × 0,773 |
| Lượt AI / người hoạt động / ngày | 2 (bình quân, dưới trần 10) | giả định |
| Chi phí một lượt AI | 50đ | **tham số** — phụ thuộc mô hình và nhà cung cấp mà `worker/index.js` đang định tuyến; đo thật trước khi chốt |

### 7.2 Ba kịch bản (một tháng)

| | S · Nhỏ | M · Vừa | L · Lớn |
|---|---|---|---|
| MAU | 20.000 | 60.000 | 200.000 |
| DAU | 5.000 | 15.000 | 50.000 |
| Tỷ lệ trả phí | 3% | 4% | 5% |
| ARPPU | 150.000đ | 200.000đ | 200.000đ |
| **Doanh thu gộp** | **90 tr** | **480 tr** | **2.000 tr** |
| ARPDAU | 600đ | 1.067đ | 1.333đ |
| Doanh thu ròng (× 0,82) | 73,8 tr | 393,6 tr | 1.640 tr |
| Chi AI (DAU × 2 × 30 × 50đ) | 15 tr | 45 tr | 150 tr |
| Hạ tầng (Workers, Durable Objects, D1, KV, lưu trữ) | 2 tr | 6 tr | 25 tr |
| Sản xuất món (phần 18 §4.3: ~1.500 giờ / năm × 250.000đ) | 31 tr | 31 tr | 60 tr (thêm món) |
| Quỹ cố vấn truyền thống | 20 tr | 20 tr | 30 tr |
| Hỗ trợ khách hàng | 10 tr | 15 tr | 45 tr |
| Pháp lý, kế toán, hóa đơn | 12 tr | 12 tr | 20 tr |
| **Tổng chi (kinh tế + nội dung món)** | **90 tr** | **129 tr** | **330 tr** |
| **Chênh lệch** | **−16 tr** | **+265 tr** | **+1.310 tr** |

«tr» = triệu đồng. Chưa gồm lương đội phát triển chính (engine, thế giới, cốt truyện) — đó là chi phí của toàn dự án, không riêng kinh tế.

### 7.3 Điểm hòa vốn

Với giả định kịch bản S: doanh thu ròng / MAU = 73,8 tr / 20.000 = **3.690đ**; chi biến đổi / MAU (AI + hạ tầng) = 17 tr / 20.000 = **850đ**; chi cố định ≈ 73 tr.

> MAU hòa vốn ≈ 73 tr / (3.690 − 850) ≈ **25.700 MAU**.

### 7.4 Độ nhạy

| Biến đổi 1 biến (kịch bản M) | Chênh lệch tháng | So gốc (+265 tr) |
|---|---|---|
| Chi phí AI gấp 4 (200đ / lượt) | +130 tr | −51% |
| Chi phí AI bằng 0 (AI tắt) | +310 tr | +17% |
| Tỷ lệ trả phí 3% thay 4% | +167 tr | −37% |
| Cơ cấu web 20% / app 80% | +254 tr | −4% |
| ARPPU 150.000đ | +167 tr | −37% |
| Bỏ hoàn toàn `SKU-P-05` (giả định mất 8% doanh thu gộp) | +233 tr | −12% |
| Trần lượt AI miễn phí 5 thay 10 (lượt TB 1,2) | +283 tr | +7% |

**Đọc:** biến nhạy nhất là **tỷ lệ trả phí** và **chi phí AI**. Hai hệ quả thiết kế:

1. Không bù tỷ lệ trả phí thấp bằng đòn bẩy phi đạo đức (gacha, FOMO) — bù bằng **danh mục đẹp hơn** và **giữ chân** (người chơi ở lâu mới mua).
2. AI là chi phí biến đổi lớn nhất của game «văn tu» này. Lượt AI miễn phí giữ 10 / ngày (sơ đồ tổng §6.5), cache 24 giờ theo (persona, câu hỏi chuẩn hóa, băm lá số); nếu chi phí AI vượt 15% doanh thu ròng hai tháng liền, kéo cần gạt `eco.ai.purchase.off` **không** giúp (vì chi phí từ lượt miễn phí) — phải tối ưu cache và mô hình (tài liệu 13), **không** giảm lượt miễn phí cho người lá số thấp hay nhóm nào riêng.

### 7.5 Tỷ trọng doanh thu mục tiêu theo sản phẩm (kịch bản M)

| Nhóm | Tỷ trọng | Tháng | Ghi chú |
|---|---|---|---|
| Ngọc tiêu vào món thẩm mỹ (gói `SKU-P`, `SKU-B`) | 45% | 216 tr | — |
| VIP (`SKU-V`) | 25% | 120 tr | ≈ 1.200 thuê bao tương đương tháng ≈ 2% MAU |
| Đạo Lộ (`SKU-DL`) | 20% | 96 tr | ≈ 880 Kim Thư / tháng ≈ 2.640 / chương ≈ 4,4% MAU — dưới mục tiêu gắn 6–10% (phần 12 §4.2); nếu đạt 8% thì nhóm này ≈ 175 tr / tháng |
| Tiện ích | ≤ 5% | ≤ 24 tr | — |
| Lượt AI | ≤ 3% | ≤ 14 tr | — |
| Ủng hộ (`SKU-V-05`, `SKU-B-12`) | 2% | 10 tr | 20% vào quỹ cố vấn |

---

## 8. Checklist nghiệm thu phần 19

- [ ] Bảng §1–§6 được đối chiếu với tài liệu hiện hành của từng nhà cung cấp khi ký hợp đồng; mã lạ chưa có trong bảng → `failed` + cảnh báo, không bao giờ cấp.
- [ ] Mỗi mã có lời cho người chơi trong bộ lời phần 15.
- [ ] Mô hình §7 được cập nhật bằng số thật sau 3 tháng mở bán; chi phí AI đo thật.
- [ ] Phí merchant ví VN có báo giá bằng văn bản.
