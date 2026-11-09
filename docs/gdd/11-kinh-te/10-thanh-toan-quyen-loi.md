# 11 · Phần 10 — Thanh toán và quyền lợi phía máy chủ

> Kế hoạch tích hợp: VNPay, MoMo, ZaloPay, Stripe cho web; Apple In-App Purchase cho iOS; Google Play Billing cho Android. Kiểm biên lai trong Cloudflare Worker, lưu quyền lợi (entitlement) phía máy chủ, sổ cái Ngọc, hoàn tiền, di trú từ `localStorage`.
>
> Phần này là **đặc tả nghiệp vụ**. Mã công việc (`TASK-*`) và lược đồ dữ liệu (`SCHEMA-*`) thuộc không gian tên của tài liệu 13 — ở đây mô tả bảng và luồng bằng tên thường, tài liệu 13 cấp mã khi lập kế hoạch.

---

## 1. Hiện trạng

| Thứ | Hiện tại | Hệ quả |
|---|---|---|
| Trạng thái người chơi | `localStorage`, khóa `huyenquan:v1` (`state.js › KEY`) | Phúc Khí, Ngọc, tủ đồ, VIP đều sửa được bằng công cụ trình duyệt |
| Thanh toán | không có; `worker/index.js` ghi đã gỡ hệ VIP redeem / PLANS «cho App Store (app free)» | — |
| Máy chủ | Worker `battu` (`wrangler.jsonc`): tài sản tĩnh, `ADMIN_KV`, Durable Object `TownShard` (`QUAN`) cho MMO | chưa có cơ sở dữ liệu quan hệ (không có D1) |
| MMO | `protocol.js` lọc trang bị bằng `cleanCos` (chỉ kiểm món **có trong danh mục**, đúng ô) | người không mua vẫn hiện được món VIP / món đắt trong phòng MMO — trước khi bán thì vô hại, sau khi bán thì làm mất giá trị món của người mua |
| Định danh ứng dụng | iOS `shop.god8.lvdang` («Lữ Đăng», `capacitor.config.json`); Android `com.battu.dungthan` (`android/app/build.gradle`) | dùng làm tiền tố mã sản phẩm |

**Nguyên tắc chuyển đổi:** trước khi bán bất kỳ thứ gì bằng tiền thật, ba thứ phải có trên máy chủ: **tài khoản**, **sổ cái ví**, **quyền lợi**. Phúc Khí cũng lên máy chủ cùng đợt (phần 02 §7), vì Phúc Khí mua được món mà người khác trả tiền để có.

---

## 2. Sản phẩm trên từng nền tảng

### 2.1 Loại sản phẩm

| SKU | Web (VNPay / MoMo / ZaloPay) | Web (Stripe) | Apple IAP | Google Play |
|---|---|---|---|---|
| `SKU-P-01..05` gói Ngọc | thanh toán một lần | Checkout `mode=payment` | **Consumable** | one-time product, **consumable** (consume sau khi cấp) |
| `SKU-V-01..03`, `-05` VIP tự gia hạn | **không** (ví VN không dùng cho thuê bao; bán dạng thẻ không tự gia hạn) | Checkout `mode=subscription` (Stripe Billing) | **Auto-Renewable Subscription**, một nhóm thuê bao «Thượng Khách» gồm 4 sản phẩm | subscription, một sản phẩm với base plan tháng / quý / năm; Hộ Quán là sản phẩm riêng |
| `SKU-V-04` thẻ 30 ngày | thanh toán một lần | `mode=payment` | **Non-Renewing Subscription** | one-time product, consumable (máy chủ cộng 30 ngày) |
| `SKU-DL-*` Kim Thư chương / năm | một lần | `mode=payment` | **Consumable** + quyền lợi máy chủ (không dùng Non-Consumable cho từng chương — xem §2.3) | one-time, consumable |
| `SKU-B-*` gói tiền thật | một lần | `mode=payment` | Consumable | one-time, consumable |
| Món Y Các, tiện ích, gói Ngọc | **không phải sản phẩm nền tảng** — mua trong game bằng Ngọc | | | |

### 2.2 Mã sản phẩm

| SKU | Apple product ID | Google product ID | Stripe Price lookup key |
|---|---|---|---|
| `SKU-P-01` | `shop.god8.lvdang.ngoc.60` | `ngoc_60` | `ngoc_60` |
| `SKU-P-02` | `shop.god8.lvdang.ngoc.330` | `ngoc_330` | `ngoc_330` |
| `SKU-P-03` | `shop.god8.lvdang.ngoc.700` | `ngoc_700` | `ngoc_700` |
| `SKU-P-04` | `shop.god8.lvdang.ngoc.1600` | `ngoc_1600` | `ngoc_1600` |
| `SKU-P-05` | `shop.god8.lvdang.ngoc.4200` | `ngoc_4200` | `ngoc_4200` |
| `SKU-V-01` | `shop.god8.lvdang.vip.month` | `vip` · base plan `month` | `vip_month` |
| `SKU-V-02` | `shop.god8.lvdang.vip.quarter` | `vip` · base plan `quarter` | `vip_quarter` |
| `SKU-V-03` | `shop.god8.lvdang.vip.year` | `vip` · base plan `year` | `vip_year` |
| `SKU-V-04` | `shop.god8.lvdang.vip.pass30` | `vip_pass_30` | `vip_pass_30` |
| `SKU-V-05` | `shop.god8.lvdang.patron.month` | `patron` · base plan `month` | `patron_month` |
| `SKU-DL-*-<chương>` | `shop.god8.lvdang.daolo.chapter` (**một** sản phẩm dùng lại mọi chương) | `daolo_chapter` | `daolo_chapter` |
| `SKU-DL-*-NIEN` | `shop.god8.lvdang.daolo.year` | `daolo_year` | `daolo_year` |
| `SKU-DL-*-TANG` | `shop.god8.lvdang.daolo.gift` | `daolo_gift` | `daolo_gift` |
| `SKU-B-01` | `shop.god8.lvdang.bundle.start` | `bundle_start` | `bundle_start` |
| `SKU-B-06` | `shop.god8.lvdang.bundle.tet` | `bundle_tet` | `bundle_tet` |
| `SKU-B-07` | `shop.god8.lvdang.bundle.trungthu` | `bundle_trungthu` | `bundle_trungthu` |
| `SKU-B-08` | `shop.god8.lvdang.bundle.gift` | `bundle_gift` | `bundle_gift` |
| `SKU-B-12` | `shop.god8.lvdang.bundle.advisor` | `bundle_advisor` | `bundle_advisor` |

Mã Android trong bảng là đề xuất; nếu ứng dụng Android đổi `applicationId`, mã sản phẩm Play không phụ thuộc tiền tố nên không đổi.

### 2.3 Vì sao Đạo Lộ dùng một sản phẩm nền tảng dùng lại

- Mỗi chương là một quyền lợi khác nhau, nhưng nếu tạo một sản phẩm IAP cho mỗi chương thì sau 12 mùa có 48 sản phẩm Non-Consumable không xóa được; người chơi còn có thể «khôi phục giao dịch» một chương cũ và kích hoạt lại.
- Thay vào đó: sản phẩm `daolo.chapter` là **Consumable**; khi máy chủ nhận giao dịch, nó cấp quyền lợi **cho chương đang chạy** (theo thời điểm giao dịch được Apple / Google ký, không theo đồng hồ máy) và ghi `chapterId` vào quyền lợi.
- Máy chủ chặn mua khi tài khoản đã có Kim Thư chương hiện tại (kiểm trước khi mở bảng thanh toán — §4.2).
- Khôi phục mua hàng (bắt buộc với iOS) khôi phục quyền lợi từ **máy chủ**, không từ lịch sử consumable.

---

## 3. Tài khoản

### 3.1 Tạo và liên kết

| Bước | Mô tả |
|---|---|
| 1 | Lần đầu mở game: tạo **tài khoản ẩn danh** trên máy chủ, nhận `accountId` (UUID v4) và token phiên; lưu token trong bộ nhớ an toàn của nền tảng (iOS Keychain qua plugin; web: cookie `HttpOnly; Secure; SameSite=Lax`) |
| 2 | Trước **lần mua đầu tiên** bằng tiền thật: bắt buộc liên kết danh tính bền: Đăng nhập với Apple (trên iOS, đáp ứng Hướng dẫn 4.8 khi có đăng nhập bên thứ ba), Google, hoặc email (mã một lần) |
| 3 | Khai báo năm sinh (phục vụ phần 11 §5 — **không** dùng ngày sinh lá số) |
| 4 | Tài khoản dưới 16 tuổi: cần email cha mẹ xác nhận trước khi mua (phần 11 §5.3) |

### 3.2 Dữ liệu tối thiểu

| Dữ liệu | Lưu ở máy chủ? | Ghi chú |
|---|---|---|
| `accountId`, phương thức đăng nhập, email (nếu dùng email) | có | — |
| Năm sinh khai báo (tuổi chủ tài khoản) | có | chỉ năm |
| Ngày giờ sinh **lá số** | **không** | vẫn chỉ ở máy (`00-KINH-DIEN-CHUNG.md` §14 sơ đồ tổng: «Ngày sinh chỉ lưu trên máy») |
| Băm lá số cho chống in Phúc Khí (phần 02 PK-2) | có, **băm có muối riêng mỗi tài khoản** (HMAC-SHA256 với khóa theo tài khoản) | không đảo ngược được, không so khớp được giữa tài khoản |
| Dụng thần (`yong.primary`) cho Hợp mệnh | **không** gửi lên; client tính `setBonus` và gửi cờ «Hợp mệnh: có / không» kèm mỗi lần ghi án; máy chủ chấp nhận vì thưởng tối đa +10% và có trần ngày | chấp nhận được rủi ro gian lận nhỏ để không phải giữ dữ liệu lá số |
| Đạo thống đã chọn | có (game cần) | là lựa chọn **trong game**; analytics không gắn nhãn «tôn giáo» cho người dùng (phần 11 §4.2) |

---

## 4. Kiến trúc máy chủ

### 4.1 Thành phần

```
Client (web / iOS / Android)
   │  HTTPS JSON                     │ StoreKit 2 / Play Billing / Stripe.js / redirect ví VN
   ▼                                 ▼
Worker «battu» ──▶ định tuyến /api/eco/* , /api/pay/*
   │
   ├─▶ Durable Object «Két» (một thực thể / tài khoản)  ← ví, quyền lợi, sổ cái — tuần tự, không chi trùng
   ├─▶ D1 (bản sao báo cáo): đơn hàng, giao dịch nhà cung cấp, bản ghi đối soát, analytics tổng hợp
   ├─▶ KV: cấu hình danh mục, giá theo khu vực, cờ tính năng (đã có ADMIN_KV)
   ├─▶ Webhook vào: VNPay IPN, MoMo IPN, ZaloPay callback, Stripe, Apple ASN v2, Google RTDN (Pub/Sub push)
   └─▶ TownShard (MMO, đã có) ── nhận «phiếu trang bị» ký bởi Két (§9)
```

- **Vì sao một Durable Object mỗi tài khoản cho ví:** Durable Object xử lý yêu cầu tuần tự trên một thực thể, nên hai lệnh mua đồng thời từ hai máy không thể cùng tiêu một số dư. Mọi thay đổi số dư đi qua Két.
- **D1** giữ bản sao để truy vấn báo cáo, đối soát, hỗ trợ khách hàng; không phải nguồn sự thật số dư.
- Tên «Két» là tên làm việc trong tài liệu này; tài liệu 13 đặt tên lớp và mã.

### 4.2 Điểm cuối (API)

| Phương thức | Đường dẫn | Mô tả | Xác thực |
|---|---|---|---|
| POST | `/api/eco/session` | tạo / làm mới tài khoản ẩn danh | — |
| POST | `/api/eco/link` | liên kết Apple / Google / email | token phiên |
| GET | `/api/eco/me` | số dư (Phúc Khí, Ngọc tổng), quyền lợi, VIP, Đạo Lộ, trần chi tiêu | token |
| POST | `/api/eco/reward` | ghi hành động có thưởng (án, sảnh, trà…) — máy chủ tính thưởng theo bảng phần 02 | token + chống lặp `idempotencyKey` |
| POST | `/api/eco/checkin` | điểm danh theo ngày kinh tế máy chủ | token |
| POST | `/api/eco/buy` | mua món / tiện ích / Kim Thư bằng Ngọc hoặc Phúc Khí | token + `idempotencyKey` |
| POST | `/api/eco/undo` | đổi ý trong 10 phút (§14.4) | token |
| POST | `/api/eco/equip` | đổi trang bị; trả về phiếu trang bị ký (§9) | token |
| POST | `/api/pay/quote` | kiểm điều kiện trước khi mở thanh toán (tuổi, trần, đã có Kim Thư chương?) → trả `quoteId` 10 phút | token |
| POST | `/api/pay/web/create` | tạo đơn web cho VNPay / MoMo / ZaloPay / Stripe → URL thanh toán | token + `quoteId` |
| GET | `/api/pay/vnpay/ipn` | IPN VNPay | chữ ký VNPay |
| POST | `/api/pay/momo/ipn` | IPN MoMo | chữ ký MoMo |
| POST | `/api/pay/zalopay/callback` | callback ZaloPay | MAC ZaloPay |
| POST | `/api/pay/stripe/webhook` | webhook Stripe | chữ ký Stripe |
| POST | `/api/pay/apple/verify` | client gửi giao dịch StoreKit 2 (JWS) | token |
| POST | `/api/pay/apple/notify` | App Store Server Notifications V2 | JWS Apple |
| POST | `/api/pay/google/verify` | client gửi `purchaseToken` | token |
| POST | `/api/pay/google/rtdn` | Real-time Developer Notifications qua Pub/Sub push | JWT của Pub/Sub |
| POST | `/api/pay/restore` | khôi phục quyền lợi (iOS bắt buộc có nút) | token |
| GET | `/api/pay/orders` | lịch sử giao dịch của tài khoản (phần 11 §3 — quyền người tiêu dùng xem lịch sử) | token |
| POST | `/api/pay/limits` | đặt trần chi tiêu tự chọn (phần 01 §9.3) | token |

### 4.3 Bảng dữ liệu (mô tả)

| Bảng | Khóa | Trường chính | Ghi chú |
|---|---|---|---|
| tài khoản | `accountId` | `createdAt`, `linkedProviders[]`, `birthYear`, `ageBand` (`<16`, `16-17`, `18+`, `unknown`), `region`, `econTz`, `status` (`ok`, `restricted`, `banned`) | — |
| đơn hàng | `orderId` | `accountId`, `sku`, `channel` (`vnpay`, `momo`, `zalopay`, `stripe`, `apple`, `google`), `amount`, `currency`, `status` (`created`, `pending`, `paid`, `granted`, `failed`, `expired`, `refunded`, `chargeback`), `providerTxnId`, `createdAt`, `paidAt` | `providerTxnId` **duy nhất** theo `channel` |
| giao dịch nhà cung cấp | `(channel, providerTxnId)` | bản thô đã kiểm (JWS Apple, JSON Google, tham số IPN) | lưu để đối soát, xóa trường cá nhân không cần |
| sổ cái ví | `(accountId, seq)` | `wallet` (`ngoc_free`, `ngoc_paid`, `phuc`), `delta`, `reason` (`checkin`, `vip_daily`, `level_gift`, `event`, `purchase`, `spend_item`, `refund_revoke`, `compensation`, `migration`), `ref` (orderId / sku / eventId), `at` | **chỉ thêm, không sửa**; số dư = tổng `delta` |
| quyền lợi | `(accountId, entitlementId)` | `type` (`item`, `utility`, `vip_period`, `pass_chapter`), `ref` (id món / chương), `source` (`ngoc`, `phuc`, `iap`, `gift`, `reward`, `migration`), `start`, `end`, `revokedAt` | món thẩm mỹ: `end = null` (vĩnh viễn) |
| thuê bao | `(accountId, channel, originalTxnId)` | `productId`, `state` (phần 07 §4.1), `periodEnd`, `autoRenew` | — |
| trần chi tiêu | `accountId` | `selfLimit30d`, `selfLimitPendingUntil`, `spent30d` (tính lại từ đơn hàng) | — |
| khóa chống lặp | `(accountId, idempotencyKey)` | kết quả đã trả | giữ 7 ngày |

### 4.4 Bất biến

| # | Bất biến | Kiểm |
|---|---|---|
| I1 | `số dư(wallet) = Σ delta` của sổ cái | đối soát mỗi đêm |
| I2 | `ngoc_paid ≤ 20.000` (phần 03 §6.3), trừ khi đang âm sau hoàn tiền | chặn khi cấp |
| I3 | Mỗi `(channel, providerTxnId)` cấp quyền lợi **đúng một lần** | khóa duy nhất |
| I4 | Không quyền lợi nào có `type` ngoài 4 loại trên — không có loại «đạo hạnh», «công đức» | lược đồ |
| I5 | `Phúc Khí` và `Ngọc` không bao giờ có dòng sổ cái chuyển đổi lẫn nhau | lint lý do |
| I6 | Thứ tự tiêu Ngọc: `ngoc_free` trước `ngoc_paid` (phần 03 §2) | logic Két |

---

## 5. Luồng thanh toán web Việt Nam

### 5.1 Chung cho ba ví

```
Client                Worker                    Két (DO)            Ví (VNPay/MoMo/ZaloPay)
  │ POST /pay/quote ──▶│ kiểm tuổi, trần, SKU ──▶│ đọc trạng thái      │
  │◀── quoteId ────────│                         │                     │
  │ POST /pay/web/create (quoteId, channel)      │                     │
  │                    │ tạo đơn status=created  │                     │
  │                    │ ký yêu cầu, gọi ví ─────────────────────────▶│
  │◀── payUrl ─────────│                                               │
  │ ── chuyển hướng / mở app ví ────────────────────────────────────▶│
  │                    │◀──────────────── IPN / callback (server→server)│
  │                    │ kiểm chữ ký, số tiền, đơn │                    │
  │                    │ đơn → paid ──────────────▶│ cấp quyền lợi      │
  │                    │                           │ đơn → granted      │
  │                    │── trả lời đúng định dạng ví ─────────────────▶│
  │◀── trang kết quả (returnUrl) chỉ ĐỌC trạng thái đơn, KHÔNG cấp ──│
```

**Luật cứng:** chỉ cấp quyền lợi từ **IPN / callback** đã kiểm chữ ký. `returnUrl` (người dùng bị chuyển về) không bao giờ cấp, vì người dùng sửa được tham số trên URL.

### 5.2 VNPay

| Mục | Đặc tả |
|---|---|
| Tạo URL | tham số `vnp_Version`, `vnp_Command=pay`, `vnp_TmnCode`, `vnp_Amount` (= số tiền × 100), `vnp_CurrCode=VND`, `vnp_TxnRef` (= `orderId`, duy nhất trong ngày), `vnp_OrderInfo` (không dấu, không dữ liệu cá nhân — ví dụ `Huyen Quan ngoc 330`), `vnp_OrderType`, `vnp_Locale=vn`, `vnp_ReturnUrl`, `vnp_IpAddr`, `vnp_CreateDate`, `vnp_ExpireDate` (+15 phút) |
| Chữ ký | sắp xếp tham số theo tên, nối `key=value` mã hóa URL bằng `&`, HMAC-SHA512 với `vnp_HashSecret` → `vnp_SecureHash` |
| IPN | VNPay gọi `GET /api/pay/vnpay/ipn?...`; Worker bỏ `vnp_SecureHash`, `vnp_SecureHashType`, tính lại HMAC, so sánh **thời gian hằng** |
| Kiểm | (1) chữ ký; (2) `vnp_TxnRef` tồn tại; (3) `vnp_Amount` = số tiền đơn × 100; (4) đơn chưa `paid`; (5) `vnp_ResponseCode = 00` và `vnp_TransactionStatus = 00` → thành công |
| Trả lời IPN | JSON `{"RspCode":"00","Message":"Confirm Success"}`; đơn không tồn tại `01`; đã xác nhận `02`; sai số tiền `04`; sai chữ ký `97`; lỗi khác `99` (theo tài liệu tích hợp VNPay — đối chiếu bản hiện hành khi ký hợp đồng) |
| Chống giả mạo thêm | giới hạn IPN theo dải IP VNPay công bố cho merchant (cấu hình trong KV) |
| Truy vấn | khi đơn `pending` quá 20 phút mà chưa có IPN: gọi API truy vấn giao dịch (`querydr`) để chốt |

### 5.3 MoMo

| Mục | Đặc tả |
|---|---|
| Tạo | POST tới API tạo thanh toán của MoMo với `partnerCode`, `requestId`, `orderId`, `amount`, `orderInfo`, `redirectUrl`, `ipnUrl`, `requestType` (ví dụ `captureWallet`), `extraData` (base64, rỗng hoặc mã tham chiếu không chứa dữ liệu cá nhân), `lang` |
| Chữ ký | chuỗi thô các trường theo **đúng thứ tự** tài liệu MoMo quy định, HMAC-SHA256 với `secretKey` |
| IPN | POST JSON tới `ipnUrl`; Worker dựng lại chuỗi thô từ các trường nhận được, tính HMAC-SHA256, so sánh |
| Kiểm | chữ ký; `orderId` tồn tại; `amount` khớp; `resultCode = 0` là thành công |
| Trả lời | HTTP 204 (không nội dung) theo tài liệu MoMo; xử lý lặp IPN bằng khóa duy nhất |

### 5.4 ZaloPay

| Mục | Đặc tả |
|---|---|
| Tạo | POST `app_id`, `app_trans_id` (định dạng `yymmdd_<mã>` theo giờ VN), `app_user` (= `accountId` rút gọn, không email), `app_time`, `amount`, `item` (JSON), `embed_data` (JSON có `redirecturl`), `description`, `bank_code`, `callback_url`, `mac` |
| `mac` khi tạo | HMAC-SHA256 với **key1** trên chuỗi `app_id|app_trans_id|app_user|amount|app_time|embed_data|item` |
| Callback | POST `{ data, mac, type }`; kiểm `mac = HMAC-SHA256(key2, data)` |
| Kiểm | chữ ký; giải `data` JSON; `app_trans_id` khớp đơn; `amount` khớp |
| Trả lời | `{ "return_code": 1, "return_message": "success" }`; đã xử lý trước đó → `return_code: 2`; lỗi (kể cả MAC sai) → giá trị ≤ 0 (mẫu tích hợp dùng −1 cho MAC sai) — đối chiếu tài liệu ZaloPay khi ký hợp đồng |
| Truy vấn | khi không nhận callback sau 15 phút: gọi API truy vấn trạng thái đơn |

### 5.5 Stripe (thẻ quốc tế, thuê bao web)

| Mục | Đặc tả |
|---|---|
| Thanh toán một lần | Checkout Session `mode=payment`, `client_reference_id = orderId`, `metadata.accountId`; trang thanh toán do Stripe lưu trữ → dự án **không chạm dữ liệu thẻ** (phạm vi PCI tối thiểu) |
| Thuê bao | Checkout Session `mode=subscription` với Price của `SKU-V-01..03`, `-05`; Customer gắn `accountId`; Customer Portal để hủy (một màn hình — phần 07 §4.4) |
| Webhook | `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed` |
| Chữ ký | header `Stripe-Signature` (`t=…,v1=…`), HMAC-SHA256 trên `t.payload` với signing secret, dung sai thời gian 5 phút; trong Worker dùng hàm kiểm bất đồng bộ của thư viện Stripe với Web Crypto |
| Tiền tệ | VND (Stripe coi VND là đơn vị không có phần thập phân) cho khách VN; USD cho khách quốc tế |
| Thuế | bật tính thuế tự động nếu dùng cho khách ngoài VN (phần 11 §2) |

---

## 6. Apple In-App Purchase

### 6.1 Phía app

| Mục | Đặc tả |
|---|---|
| Thư viện | StoreKit 2 qua một plugin Capacitor tự viết (Swift) — ứng dụng hiện dùng Capacitor 8 (`package.json`), chưa có plugin mua hàng |
| Gắn tài khoản | khi gọi `purchase`, truyền `appAccountToken` = UUID ổn định của `accountId` → Apple ký vào giao dịch, máy chủ đối chiếu |
| Sau khi mua | app gửi `jwsRepresentation` của `Transaction` tới `/api/pay/apple/verify`; **chỉ gọi `finish()`** sau khi máy chủ trả «đã cấp» |
| Giao dịch treo | lắng nghe `Transaction.updates` khi khởi động; gửi lại máy chủ mọi giao dịch chưa `finish` |
| Khôi phục | nút «Khôi phục giao dịch» gọi `AppStore.sync()` rồi `/api/pay/restore` |
| Quản lý thuê bao | nút mở `showManageSubscriptions` |
| Không có | không nhắc giá web, không liên kết tới thanh toán ngoài (phần 14 §3) |

### 6.2 Phía máy chủ

| Bước | Đặc tả |
|---|---|
| Kiểm JWS | tách header `x5c`, kiểm chuỗi chứng chỉ về **Apple Root CA – G3**, kiểm chữ ký ES256 của payload; hoặc gọi App Store Server API «Get Transaction Info» bằng `transactionId` (JWT ES256 ký bằng khóa In-App Purchase của nhà phát triển) — làm **cả hai** khi số tiền lớn (`SKU-P-04`, `-05`) |
| Đối chiếu | `bundleId = shop.god8.lvdang`; `productId` thuộc danh sách §2.2; `appAccountToken` = tài khoản gọi; `environment` (`Sandbox` chỉ chấp nhận ở máy chủ thử) |
| Cấp | theo `productId` (§2.1); khóa duy nhất `(apple, transactionId)` |
| Thuê bao | lưu `originalTransactionId`; `expiresDate` → `vip.until` |
| Thông báo máy chủ (ASN V2) | `signedPayload` JWS; xử lý `SUBSCRIBED`, `DID_RENEW`, `DID_CHANGE_RENEWAL_STATUS`, `DID_FAIL_TO_RENEW` (subtype `GRACE_PERIOD`), `GRACE_PERIOD_EXPIRED`, `EXPIRED`, `REFUND`, `REFUND_REVERSED`, `REVOKE`, `CONSUMPTION_REQUEST` |
| `CONSUMPTION_REQUEST` | khi khách yêu cầu Apple hoàn tiền consumable, Apple hỏi thông tin tiêu dùng; máy chủ gửi «Send Consumption Information» trong hạn Apple quy định với dữ liệu trung thực: đã tiêu bao nhiêu Ngọc từ giao dịch, thời gian chơi. **Không** gửi gì nhằm cản hoàn tiền một cách không trung thực |
| Ngân sách | App Store Server API có giới hạn tần suất — gom yêu cầu, dùng JWS cục bộ là chính |

---

## 7. Google Play Billing

### 7.1 Phía app

| Mục | Đặc tả |
|---|---|
| Thư viện | Play Billing Library (bản hiện hành tại thời điểm làm, tối thiểu bản mà Google Play yêu cầu cho ứng dụng mới) qua plugin Capacitor tự viết (Kotlin) |
| Gắn tài khoản | `setObfuscatedAccountId(hash(accountId))` khi tạo `BillingFlowParams` |
| Sau khi mua | gửi `purchaseToken` + `productId` tới `/api/pay/google/verify`; **không** tự consume / acknowledge ở client |
| Giao dịch treo | `queryPurchasesAsync` khi khởi động, gửi lại máy chủ |
| `PENDING` (thanh toán tiền mặt / chậm) | hiện «đang chờ»; chỉ cấp khi máy chủ thấy `PURCHASED` |

### 7.2 Phía máy chủ

| Bước | Đặc tả |
|---|---|
| Xác thực | tài khoản dịch vụ Google Cloud; JWT RS256 đổi lấy token OAuth (phạm vi `androidpublisher`) — ký bằng Web Crypto trong Worker |
| Kiểm một lần | `purchases.products.get(packageName, productId, token)` → `purchaseState = 0` (đã mua), `obfuscatedExternalAccountId` khớp, `orderId` |
| Kiểm thuê bao | `purchases.subscriptionsv2.get(packageName, token)` → `subscriptionState`, `lineItems[].expiryTime`, `linkedPurchaseToken` (khi nâng / hạ gói) |
| Hoàn tất | consumable: `purchases.products.consume` sau khi cấp; thuê bao: `purchases.subscriptions.acknowledge`. Phải xác nhận trong **3 ngày**, quá hạn Google tự hoàn tiền |
| RTDN | Pub/Sub push tới `/api/pay/google/rtdn`; kiểm token OIDC trong header `Authorization` (audience là URL điểm cuối, email tài khoản dịch vụ push); giải `message.data` (base64) → `subscriptionNotification` / `oneTimeProductNotification` / `voidedPurchaseNotification` → gọi API lấy trạng thái thật (không tin nội dung thông báo một mình) |
| Hoàn tiền | Voided Purchases API quét hằng ngày + thông báo voided |

---

## 8. Hoàn tiền và thu hồi

### 8.1 Chính sách theo kênh

| Kênh | Ai quyết định | Chính sách của quán |
|---|---|---|
| Apple | Apple | xử lý `REFUND` theo §8.2; trả lời `CONSUMPTION_REQUEST` trung thực |
| Google | Google, hoặc quán chủ động qua API | quán chủ động hoàn trong các ca §8.3 |
| Web (ví VN, Stripe) | quán | §8.3 |

### 8.2 Khi một giao dịch bị hoàn

| Thứ bị hoàn | Thu hồi |
|---|---|
| Gói Ngọc | trừ số Ngọc của gói khỏi `ngoc_paid`; nếu không đủ → `ngoc_paid` **âm**; khi âm: không mua được bằng Ngọc cho tới khi bù (Ngọc Tặng mới nhận **không** tự bù vào chỗ âm — tránh tước Ngọc Tặng của người chơi; người chơi bù bằng nạp hoặc chờ) |
| Món đã mua bằng Ngọc đó | **giữ** (không tước đồ khỏi tủ — tránh tranh chấp, và người hoàn tiền vì lý do chính đáng không bị phạt) |
| VIP | `revoked`, quyền lợi dừng ngay |
| Kim Thư | quyền Kim Thư dừng; món đã nhận giữ |
| Gói có món | món giữ; Ngọc của gói trừ như gói Ngọc |
| Lặp lại | ≥ 3 lần hoàn tiền trong 90 ngày → tài khoản `restricted`: chỉ mua bằng web với xác minh thêm; ghi ở phần 13 |

### 8.3 Hoàn tiền chủ động (web, Google)

| Ca | Hoàn |
|---|---|
| Thanh toán thành công mà không nhận quyền lợi sau 24 giờ (lỗi của quán) | hoàn đủ, hoặc cấp lại theo lựa chọn khách |
| Mua trùng do lỗi mạng (hai đơn cùng SKU trong 2 phút) | hoàn đơn thứ hai |
| Gói Ngọc chưa tiêu đồng nào, trong 7 ngày | hoàn đủ |
| VIP lần đầu, trong 48 giờ, chưa nhận Ngọc VIP nào | hoàn đủ |
| Kim Thư chưa nhận thưởng Kim Thư nào, trong 7 ngày | hoàn đủ |
| Tài khoản dưới 18 tuổi, cha mẹ yêu cầu, có bằng chứng giao dịch không được phép | hoàn đủ (phần 11 §5.5) |
| Món lỗi hiển thị nghiêm trọng (không mặc được) quá 7 ngày chưa sửa | hoàn Ngọc của món về `ngoc_paid` / `ngoc_free` theo nguồn |

---

## 9. Phiếu trang bị cho MMO

Hiện `TownShard` phát lại trang bị sau `cleanCos` mà không biết người chơi có sở hữu món hay không.

| Bước | Đặc tả |
|---|---|
| 1 | Khi đổi trang bị, client gọi `/api/eco/equip`; Két kiểm quyền sở hữu từng món |
| 2 | Két trả **phiếu**: `{ accountId, cos: "<chuỗi encodeCos>", exp: now + 12h }` ký HMAC-SHA256 bằng khóa dùng chung giữa Worker và `TownShard` |
| 3 | Client gửi phiếu trong `hello` / `cos` thay vì chuỗi trần |
| 4 | `TownShard` kiểm chữ ký, hạn, khớp `pid`; sai → phát lại trang bị mặc định |
| 5 | Ngoại tuyến / máy chủ ví lỗi: client vẫn chơi đơn được; vào MMO thì mặc định |

Không thay đổi `protocol.js › cleanCos` (vẫn lọc danh mục), chỉ thêm lớp kiểm sở hữu.

---

## 10. Di trú từ `localStorage`

### 10.1 Một lần duy nhất

| Dữ liệu cục bộ | Nhận lên máy chủ | Trần |
|---|---|---|
| `phucKhi` | có | 50.000 |
| `xp` | có | 200.000 (cấp ~100) |
| `wardrobe.ngoc` | có → `ngoc_free` | 3.000 |
| `wardrobe.owned` | có, chỉ món có trong danh mục, **trừ** món `unlock.vip` (vì VIP chưa từng bán thật) | — |
| `wardrobe.checkin.streak` | có | 30 |
| `vip` | **không** (VIP chưa từng bán; mọi `state.vip` cục bộ là dữ liệu thử) | — |
| `profiles` | **không** (dữ liệu lá số ở lại máy) | — |
| `flags.chartRewarded` | đổi thành băm lá số theo tài khoản | — |
| `classical`, `mastery`, `deskLog`, `caseLog` | có (tiến độ học, không phải tiền) | — |

### 10.2 Sau di trú

- Khóa cờ `migratedAt` trên tài khoản; máy khác cùng tài khoản không di trú lần hai.
- Máy chưa liên kết tài khoản vẫn chơi được cục bộ, nhưng **không** mua được bằng tiền và **không** vào MMO với món trả phí.

---

## 11. Bảo mật

| Mối đe dọa | Biện pháp |
|---|---|
| Giả IPN / webhook | kiểm chữ ký từng kênh; so sánh thời gian hằng; dải IP (VNPay) |
| Phát lại IPN cũ | khóa duy nhất `(channel, providerTxnId)`; dấu thời gian (Stripe) |
| Sửa số tiền trên URL | so số tiền IPN với số tiền đơn |
| Lộ khóa bí mật | `wrangler secret`; không bao giờ ở client; xoay khóa mỗi 12 tháng hoặc khi nghi lộ |
| Chi trùng số dư | Két tuần tự (§4.1) |
| Client sửa thưởng | máy chủ tính thưởng (`/api/eco/reward`) theo bảng; client chỉ gửi kết quả hành động; kiểm tốc độ bất thường (phần 13) |
| Dữ liệu thẻ | không chạm (Stripe hosted, ví VN hosted) |
| Ghi log | không ghi email, số điện thoại, ngày sinh vào log; ghi `accountId` và `orderId` |

---

## 12. Đối soát

| Tần suất | Việc |
|---|---|
| Mỗi giờ | đơn `pending` > 20 phút → truy vấn nhà cung cấp |
| Mỗi đêm | I1 cho mọi ví có thay đổi; so tổng tiền đơn `granted` theo kênh với báo cáo nhà cung cấp (VNPay, MoMo, ZaloPay có báo cáo đối soát; Stripe balance transactions; Apple Sales and Trends / Financial reports; Google Play earnings) |
| Mỗi tháng | đối soát doanh thu chưa thực hiện (Ngọc Nạp chưa tiêu) cho kế toán (phần 11 §3.3) |

---

## 13. Thông báo lỗi cho người chơi

| Tình huống | Lời hiện |
|---|---|
| Đang chờ ví xác nhận | «Quán đang chờ ví xác nhận. Bạn có thể tiếp tục chơi — Ngọc sẽ vào tủ khi xác nhận xong.» |
| Hết hạn đơn (15 phút) | «Đơn đã hết hạn và **không** bị trừ tiền. Bạn có thể tạo đơn mới.» |
| Ví báo thất bại | «Giao dịch không thành công, bạn không bị trừ tiền. Nếu tài khoản ngân hàng đã bị trừ, tiền sẽ được ngân hàng hoàn theo quy định của ví; liên hệ quán kèm mã đơn <orderId>.» |
| Vượt trần chi tiêu | «Bạn đã đặt trần <X>đ / 30 ngày và đã dùng <Y>đ. Trần sẽ mở lại vào <ngày>.» |
| Tài khoản dưới 18, sản phẩm không bán | «Sản phẩm này dành cho người từ 18 tuổi.» |
| Đã có Kim Thư chương này | «Bạn đã có Kim Thư chương này rồi.» |
| Đã cấp xong | «Đã nhận <N> Ngọc. Cảm ơn bạn đã ủng hộ quán.» — không thêm lời mời mua tiếp |

---

## 14. Luồng phụ

### 14.1 Mua tặng

```
Người tặng                  Worker / Két (người tặng)        Két (người nhận)
  │ chọn món / Kim Thư, chọn bạn
  │ POST /api/pay/quote {sku, giftTo}
  │                         kiểm: người tặng ≥ 18; trần 5 món / tuần;
  │                         bạn ≥ 7 ngày; người nhận chưa có món / Kim Thư chương này;
  │                         người nhận không bị chặn nhận quà (cài đặt riêng tư)
  │◀── quoteId
  │ trả bằng Ngọc (POST /api/eco/buy) hoặc tiền (luồng §5 / §6 / §7)
  │                         sau khi thanh toán thành công ──────▶ cấp quyền lợi source='gift'
  │                                                               hộp thư: «<tên> tặng bạn <món>»
```

- Người nhận có thể **từ chối** quà trong 7 ngày → hoàn cho người tặng đúng hình thức đã trả (Ngọc về ví, tiền thật hoàn theo kênh). Sau 7 ngày quà tự nhận.
- Quà không chuyển tiếp được (người nhận không tặng lại).
- Hoàn tiền giao dịch tặng: thu hồi quyền lợi của **người nhận** chỉ khi món chưa từng được mặc; nếu đã mặc thì giữ, ghi Ngọc Nạp âm ở người tặng (§8.2).

### 14.2 Phụ huynh duyệt (tài khoản < 16)

```
Trẻ                    Worker                         Phụ huynh (email / Bảng Phụ Huynh)
 │ chọn mua ──────────▶ tạo yêu cầu duyệt (hạn 24 giờ)
 │                       gửi email + thông báo ──────▶ [Duyệt] / [Từ chối]
 │                                                     │
 │◀── «Đang chờ bố mẹ duyệt»                           │
 │                       ◀────────────── Duyệt ────────┘
 │◀── mở bảng thanh toán (web: phương thức của phụ huynh nhập; iOS / Android: Ask to Buy / kiểm soát của nền tảng)
```

- Duyệt chỉ cho đúng sản phẩm, đúng giá; đổi sản phẩm phải xin lại.
- Quá 24 giờ: yêu cầu hết hạn, không trừ tiền.
- Mọi giao dịch của tài khoản < 16 hiện trong Bảng Phụ Huynh, kể cả mua bằng Ngọc Tặng (để phụ huynh biết con dùng game thế nào).

### 14.3 Khôi phục giao dịch (iOS / Android)

| Bước | Việc |
|---|---|
| 1 | người chơi bấm «Khôi phục giao dịch» |
| 2 | iOS: `AppStore.sync()`, duyệt `Transaction.currentEntitlements` (thuê bao) và `Transaction.all` (để tìm consumable chưa `finish`); Android: `queryPurchasesAsync` |
| 3 | gửi từng giao dịch lên `/api/pay/apple/verify` / `/api/pay/google/verify` — máy chủ đã cấp thì trả «đã có», chưa cấp thì cấp |
| 4 | gọi `/api/pay/restore` để tải lại toàn bộ quyền lợi từ máy chủ (kể cả quyền lợi mua ở web) |
| 5 | thông báo: «Đã khôi phục <n> quyền lợi.» hoặc «Không có gì cần khôi phục — mọi thứ đã có trong tủ.» |

### 14.4 Đổi ý trong 10 phút (phần 15 §1.4)

| Bước | Việc |
|---|---|
| 1 | client gọi `/api/eco/undo {entitlementId}` |
| 2 | Két kiểm: quyền lợi mua bằng tiền ảo (không phải IAP / tặng), tạo < 10 phút, chưa mặc ra cảnh quá 10 phút, chưa quá 3 lần / ngày |
| 3 | thu quyền lợi, ghi sổ cái hai dòng hoàn đúng ví (`ngoc_free` / `ngoc_paid` / `phuc`) theo dòng chi gốc |
| 4 | gỡ món khỏi trang bị, tính lại `setBonus` |

---

## 15. Checklist nghiệm thu phần 10

- [ ] Không cấp quyền lợi nào từ `returnUrl` (test: gọi `returnUrl` giả có `vnp_ResponseCode=00` → không cấp).
- [ ] IPN lặp 5 lần → cấp một lần (test).
- [ ] Sai số tiền → không cấp, trả mã lỗi đúng định dạng ví.
- [ ] StoreKit `finish()` chỉ sau khi máy chủ trả «đã cấp».
- [ ] Google `acknowledge` / `consume` trong 3 ngày (cảnh báo nếu > 24 giờ).
- [ ] Hoàn tiền làm `ngoc_paid` âm thì chặn mua bằng Ngọc, không tước món.
- [ ] Phiếu trang bị MMO: món không sở hữu không hiện cho người khác.
- [ ] Di trú chạy một lần, đúng trần.
- [ ] Đối soát đêm báo chênh lệch = 0 trên dữ liệu thử.
