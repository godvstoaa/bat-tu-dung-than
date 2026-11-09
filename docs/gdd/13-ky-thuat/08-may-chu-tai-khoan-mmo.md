# 13.08 · Máy chủ: tài khoản, quyền lợi, lưu đám mây, MMO v2, môn phái, phân tích

> Hiện tại máy chủ game chỉ có `TownShard` (phòng MMO không xác thực) và các route của app chính. Mọi tiến trình, tiền tệ, đồ mua nằm ở `localStorage` (phần 01 §9). Phần này đặc tả lớp máy chủ cho bản AAA: danh tính, kho người chơi, quyền lợi (entitlement) và thanh toán, đồng bộ lưu, giao thức MMO v2, Durable Object môn phái `SectHall`, và đường phân tích tôn trọng quyền riêng tư. Nội dung kinh tế (`SKU-*`, `SEASON-xx`) thuộc tài liệu 11; môn phái (`GUILD-*`) thuộc tài liệu 10.

## 1. Tổng quan thành phần

```
Client (web / iOS overlay)
  │ HTTPS /api/hq/*  (Authorization: Bearer <token>)          WSS /ws/quan?region=…&room=…
  ▼                                                            ▼
Worker «battu» (worker/index.js → worker/hq/*.js)            TownShard (DO, đã có, nâng cấp v2)
  ├─ auth.js       cấp/kiểm token                              │ biên nhận có mặt (presence)
  ├─ vault.js  ──▶ PlayerVault (DO mới, 1 / tài khoản)  ◀───────┘
  ├─ tb.js     ──▶ ThienBang (DO mới, 1 / mùa)              (phần 04)
  ├─ sect.js   ──▶ SectHall (DO mới, 1 / môn phái)
  ├─ ai.js     ──▶ PlayerVault.consumeAiTurn → backend LLM (phần 05)
  ├─ pay.js    ──▶ Apple / Stripe / VNPay (webhook) → PlayerVault.grant
  └─ ev.js     ──▶ Workers Analytics Engine (dataset HQ_EVENTS)
KV ADMIN_KV (đã có): công tắc AI, bộ đệm đọc (top Thiên Bảng, thông báo môn phái)
```

Tách mã máy chủ game vào `worker/hq/` để `worker/index.js` chỉ thêm một nhánh định tuyến `/api/hq/` (giữ tệp hiện có gọn, không đụng `admin.js`).

### 1.1 Thay đổi `wrangler.jsonc`

```jsonc
"durable_objects": { "bindings": [
  { "name": "QUAN",  "class_name": "TownShard" },
  { "name": "VAULT", "class_name": "PlayerVault" },
  { "name": "TB",    "class_name": "ThienBang" },
  { "name": "SECT",  "class_name": "SectHall" }
] },
"migrations": [
  { "tag": "quan-v1", "new_sqlite_classes": ["TownShard"] },
  { "tag": "hq-v2",   "new_sqlite_classes": ["PlayerVault", "ThienBang", "SectHall"] }
],
"analytics_engine_datasets": [ { "binding": "HQ_EVENTS", "dataset": "huyenquan_events" } ]
// secrets (wrangler secret put): HQ_TOKEN_KEY, HQ_RECEIPT_KEY, HQ_ANALYTICS_PEPPER,
//   APPLE_IAP_ISSUER_ID, APPLE_IAP_KEY_ID, APPLE_IAP_PRIVATE_KEY, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET,
//   VNPAY_TMN_CODE, VNPAY_HASH_SECRET
```

Mọi thay đổi `wrangler.jsonc` và secret đều cần chủ dự án duyệt trước khi triển khai (phần 15 §3).

## 2. Danh tính

### 2.1 Nguyên tắc

1. **Không bắt đăng nhập để chơi.** Mỗi thiết bị tự có tài khoản ẩn danh khi lần đầu cần máy chủ (AI, đồng bộ, Thiên Bảng).
2. **Không thu thông tin định danh** (email, số điện thoại) ở giai đoạn đầu. Khôi phục bằng **mã khôi phục** người chơi tự giữ.
3. Liên kết Apple chỉ khi bản iOS bán hàng (M6) và chỉ nếu thật cần (câu hỏi mở Q9).

### 2.2 Luồng

```
POST /api/hq/auth/device     { deviceId: <huyenquan:pid>, appV, platform }
  → nếu deviceId chưa gắn tài khoản: tạo acc_<26 ký tự Crockford base32>, tạo PlayerVault, sinh recoverySeed
  → trả { token, acc, recovery: "XXXX-XXXX-XXXX-XXXX" (chỉ lần đầu), expiresIn: 2592000 }
POST /api/hq/auth/refresh    { token } → token mới (gia hạn 30 ngày)
POST /api/hq/auth/recover    { recovery, deviceId } → gắn thiết bị mới vào tài khoản cũ, trả token
POST /api/hq/auth/rotate     (đã xác thực) → mã khôi phục mới, vô hiệu mã cũ
POST /api/hq/auth/forget     (đã xác thực) → xóa tài khoản: PlayerVault xóa dữ liệu, gỡ khỏi ThienBang/SectHall, giữ 30 ngày bản băm để chống lạm dụng rồi xóa
```

- `deviceId` là `huyenquan:pid` hiện có → mã ẩn người chơi trong MMO (`u = SHA-256('huyenquan:' + pid)`) vẫn tương thích.
- Mã khôi phục: 16 ký tự base32 (80 bit). Máy chủ chỉ lưu `scrypt`-tương đương bằng `PBKDF2-SHA256` 100.000 vòng (Web Crypto có sẵn trong Worker) của mã + muối riêng tài khoản.
- Giới hạn: `/auth/recover` 5 lần/giờ/IP và 10 lần/ngày/tài khoản.

### 2.3 SCHEMA-TOKEN

```jsonc
// header.payload.sig — base64url; sig = HMAC-SHA256(HQ_TOKEN_KEY, header.payload)
{ "alg": "HS256", "typ": "hq1" }
{ "sub": "acc_01JC…", "dev": "a91f3c2e", "iat": 1762300800, "exp": 1764892800, "scp": ["vault", "ai", "mmo", "tb", "sect"], "kv": 1 }
```

- `kv` = phiên bản khóa (xoay khóa: Worker chấp nhận `kv` hiện tại và trước đó trong 7 ngày).
- Token gửi qua header `Authorization`, **không** qua URL. Riêng WebSocket (trình duyệt không cho đặt header): gửi trong gói `hello` đầu tiên (`{ t: 'hello', tok }`), không đưa vào query string.

## 3. `PlayerVault` (Durable Object, một cho mỗi tài khoản)

### 3.1 Bảng SQLite

```sql
CREATE TABLE meta      (k TEXT PRIMARY KEY, v TEXT);                 -- acc, createdAt, tz, consent, recoveryHash, devices
CREATE TABLE save      (rev INTEGER PRIMARY KEY, at INTEGER, dev TEXT, bytes INTEGER, body BLOB);   -- giữ 5 bản gần nhất
CREATE TABLE ledger    (id TEXT PRIMARY KEY, deed TEXT, kind TEXT, pts INTEGER, pts_srv INTEGER, n INTEGER,
                        at INTEGER, trust TEXT, aid TEXT, dev TEXT, day TEXT);
CREATE INDEX ledger_day ON ledger(day);
CREATE TABLE receipts  (ref TEXT PRIMARY KEY, k TEXT, at INTEGER);  -- biên nhận đã dùng (phần 04 §6.3)
CREATE TABLE ent       (id TEXT PRIMARY KEY, sku TEXT, kind TEXT, src TEXT, tx TEXT UNIQUE, granted INTEGER,
                        expires INTEGER, revoked INTEGER DEFAULT 0, meta TEXT);
CREATE TABLE ngoc      (id TEXT PRIMARY KEY, op TEXT, amt INTEGER, reason TEXT, at INTEGER, ok INTEGER);
CREATE TABLE ai_quota  (day TEXT PRIMARY KEY, used INTEGER, cap INTEGER);
CREATE TABLE titles    (id TEXT PRIMARY KEY, at INTEGER, src TEXT);
```

Kích thước dự kiến mỗi tài khoản: lưu 5 × ≤ 256 KB + sổ 10.000 mục × ~120 byte ≈ 2,5 MB tối đa; phần lớn người chơi < 300 KB.

### 3.2 API (Worker gọi DO bằng RPC, client gọi Worker bằng HTTP)

| HTTP | Hàm DO | Mô tả |
|---|---|---|
| `GET /api/hq/vault` | `summary()` | `{ rev, savedAt, ngoc, ent[], titles[], ledger: { net, trusted }, aiLeft }` |
| `PUT /api/hq/vault/save` | `putSave(env)` | SCHEMA-CLOUDSAVE; xung đột → 409 kèm bản máy chủ (§4) |
| `GET /api/hq/vault/save` | `getSave()` | bản mới nhất |
| `POST /api/hq/ledger/sync` | `syncLedger()` | phần 04 §5.2 |
| `POST /api/hq/ngoc/ops` | `ngocOps(ops[])` | §5.3 |
| `POST /api/hq/receipt` | `issueReceipt(req)` | chấm lại việc tái hiện được, cấp biên nhận (phần 04 §6.3) |
| (nội bộ) | `consumeAiTurn(day)` / `refundAiTurn(day)` | phần 05 §7 |
| (nội bộ, webhook) | `grant(ent)` / `revoke(tx)` | §5 |
| `POST /api/hq/consent` | `setConsent(c)` | lưu đồng ý (phân tích, công khai căn cốt, lưu ngày sinh đám mây) |

## 4. Lưu đám mây

### 4.1 SCHEMA-CLOUDSAVE

```jsonc
{
  "v": 2,                                  // phiên bản SCHEMA-SAVE (phần 02)
  "rev": 418, "baseRev": 417,              // baseRev = rev máy chủ mà client đã thấy lần cuối
  "dev": "a91f3c2e",
  "savedAt": 1762300800000,
  "contentV": "q:2026.11.3",               // phiên bản nội dung nhiệm vụ
  "engineV": "2026.11.1",
  "birth": "excluded",                     // 'excluded' | 'included' (theo consent.cloudBirth)
  "data": { /* SCHEMA-SAVE đã lọc (§4.3) */ },
  "hash": "sha256 của data (chuỗi JSON chuẩn hóa)"
}
```

### 4.2 Gộp khi xung đột

Client gửi `baseRev`; máy chủ có `rev > baseRev` (thiết bị khác đã lưu) → trả 409 + bản máy chủ; client gộp theo bảng rồi gửi lại với `baseRev` mới:

| Khối | Quy tắc gộp | Lý do |
|---|---|---|
| `ledger.entries`, `achievements`, `quests.done`, `world.visited`, `world.unlocked`, `wardrobe.owned`, `incenseDays`, `stationsVisited` | hợp tập | chỉ tăng |
| `xp`, `dao.realmMax`, `streak.count` (cùng `lastDate`) | lấy lớn hơn | không bao giờ giảm |
| `dao.daoHanh` | lấy bản có `dao.rev` lớn hơn (khối Đạo Hạnh có bộ đếm riêng) | có thể giảm hợp lệ |
| `quests.active[id]` | lấy bản có `hist` dài hơn (tiến xa hơn); bằng nhau → `since` mới hơn | |
| `phucKhi` | lấy bản `savedAt` mới hơn | tiền tệ cày được, rủi ro thấp |
| `wardrobe.ngoc` | **máy chủ là nguồn đúng** (§5.3), bỏ giá trị client | có thể mua bằng tiền |
| `settings`, `player.name/look/robe` | bản `savedAt` mới hơn | |
| `profiles` | hợp theo `id`; khác nội dung → bản mới hơn | |
| `persona.mem` | theo NPC, bản mới hơn | |

Hàm gộp `mergeSaves(local, remote)` thuần JS, dùng chung client và test; tính chất kiểm: `merge(a, a) = a`, `merge(a, b)` và `merge(b, a)` giống nhau ở mọi khối hợp tập/lớn nhất.

### 4.3 Ngày sinh và đám mây

- `consent.cloudBirth = false` (mặc định): `data.player.birth` và các trường ngày giờ trong `profiles` bị **bỏ trước khi gửi**; `menh.key` cũng bị bỏ (băm ngày sinh có không gian nhỏ — khoảng 200 năm × 366 ngày × 1.440 phút ≈ 10⁸ khả năng — dò ngược được, nên không được coi là ẩn danh).
- Khôi phục trên thiết bị mới khi không có ngày sinh: game hỏi lại bát tự ở cổng; Mệnh Bàn tính mới; tiến trình (Đạo Hạnh, nhiệm vụ, sổ) giữ nguyên. Nếu người chơi nhập ngày khác trước → cảnh báo «Mệnh Bàn sẽ khác nhân vật cũ; các nhánh cốt truyện theo Mệnh Cách có thể không khớp».
- `consent.cloudBirth = true`: gửi đủ; màn đồng ý nêu rõ ngày sinh sẽ được lưu trên máy chủ, có nút thu hồi (thu hồi → máy chủ xóa trường đó khỏi mọi bản lưu).

### 4.4 Nhịp đồng bộ

- Tự động: khi vào game, mỗi 5 phút nếu `rev` cục bộ đổi, khi `pagehide`/`pause()`.
- Thủ công: nút trong Sổ Mệnh › Cài đặt.
- Không mạng: xếp hàng; thành công lần sau.

## 5. Quyền lợi (entitlement) và thanh toán

### 5.1 Nguyên tắc (bản sơ đồ tổng §11, trụ cột T6)

- Chỉ bán: trang phục, phụ kiện, hiệu ứng, ngự vật, khung tên, tiện ích (ô lưu lá số, lượt AI, trang trí nhà riêng), Đạo Lộ mùa (thẩm mỹ), VIP.
- **Không** bán: Đạo Hạnh, cảnh giới, công đức, Mệnh Đồ, kết quả luận giải, ưu tiên Thiên Bảng.
- Máy chủ là nguồn đúng cho mọi thứ mua bằng tiền thật và cho Ngọc.

### 5.2 SCHEMA-ENTITLEMENT và SCHEMA-SKU-SERVER

```jsonc
// SCHEMA-ENTITLEMENT — một dòng bảng ent
{ "id": "ent_01JC…", "sku": "SKU-xxx", "kind": "cosmetic",   // 'cosmetic'|'vip'|'utility'|'season'|'ngoc'
  "src": "apple", "tx": "2000000812345678", "granted": 1762300800, "expires": null, "revoked": 0,
  "meta": { "items": ["y_tu"], "ngoc": 0 } }

// SCHEMA-SKU-SERVER — src/game/data/skus.json (tài liệu 11 viết nội dung; máy chủ đọc bản đóng gói vào Worker)
{ "id": "SKU-xxx", "kind": "cosmetic", "price": { "vnd": 49000, "usd": 1.99 },
  "store": { "apple": "huyenquan.cos.ytu", "stripe": "price_…", "vnpay": true },
  "grants": { "items": ["y_tu"], "ngoc": 0, "vipDays": 0, "aiTurns": 0, "seasonPass": null } }
```

Kiểm tĩnh `test-skus.mjs`: khóa trong `grants` chỉ thuộc `{ items, ngoc, vipDays, aiTurns, profileSlots, seasonPass, homeDecor }`; mọi `items` là món có trong `cosmetics.js › ITEMS`; **không** có khóa nào chạm Đạo Hạnh, cảnh giới, công đức, nhiệm vụ.

### 5.3 Ngọc do máy chủ quản

- Thao tác Ngọc là nhật ký `ngoc(op, amt, reason)` với `id` duy nhất do client sinh (để gửi lại an toàn).
- Nguồn **cộng** máy chủ kiểm được: điểm danh (ngày theo giờ máy chủ + múi giờ tài khoản, chuỗi tính ở máy chủ, bảng `CHECKIN = [10, 15, 20, 25, 30, 40, 80]`), VIP mỗi ngày (+30, cần entitlement VIP còn hạn), quà lên cấp (+20/cấp, cấp lấy từ `xp` trong bản lưu đám mây — chấp nhận rủi ro thấp), mua (`SKU.grants.ngoc`).
- **Trừ** khi mua đồ trong Tàng Y Các: client ghi op `spend` ngay (chơi offline vẫn mua được), máy chủ đối soát khi đồng bộ: số dư âm → op bị từ chối (`ok = 0`), món tương ứng bị gỡ khỏi `owned` và người chơi nhận thông báo kèm lý do.
- Người chơi **không tài khoản** (chưa từng kết nối): Ngọc vẫn cục bộ như hiện nay; khi tạo tài khoản lần đầu, số dư cục bộ được nhận một lần với trần `NGOC_IMPORT_CAP` (đề xuất 2.000; tài liệu 11 chốt) để chặn số dư tự sửa.

### 5.4 Luồng thanh toán

| Kênh | Nền tảng | Xác minh | Hoàn tiền/thu hồi |
|---|---|---|---|
| Apple In-App Purchase | iOS | client gửi `signedTransactionInfo` (JWS) → Worker kiểm chữ ký chuỗi chứng chỉ Apple + `bundleId` (`shop.god8.lvdang`) + `productId` khớp SKU → `grant` | App Store Server Notifications V2 (`REFUND`, `REVOKE`) → `revoke(tx)` |
| Stripe Checkout | web | webhook `checkout.session.completed` (kiểm `Stripe-Signature`) → `grant` | `charge.refunded` → `revoke` |
| VNPay | web (VN) | IPN: kiểm `vnp_SecureHash` (HMAC-SHA512 với `VNPAY_HASH_SECRET`), `vnp_ResponseCode = '00'`, số tiền khớp SKU → `grant` | đối soát thủ công (VNPay không có webhook hoàn tiền chuẩn — câu hỏi mở Q10) |

- Mọi `grant` lũy đẳng theo `tx` (khóa `UNIQUE`).
- Thu hồi đồ thẩm mỹ: gỡ khỏi `owned`; nếu đang mặc thì về đồ mặc định. Ngọc đã tiêu từ giao dịch bị hoàn → số dư có thể âm; âm thì chặn mua mới tới khi dương.
- **Điều kiện tiên quyết** (canon §11, bản sơ đồ tổng §11): chủ dự án đăng ký merchant (Apple Developer Program có thỏa thuận Paid Apps, Stripe, VNPay). App hiện ghi chú «[REMOVED] VIP redeem… gỡ hệ thống payment cho App Store (app free)» trong `worker/index.js` → bật lại thanh toán trên iOS là quyết định kinh doanh và rủi ro duyệt App Store (Apple 4.3(b)) của chủ dự án.

## 6. MMO giao thức v2

### 6.1 Thay đổi so với v1

| # | Thay đổi | Lý do |
|---|---|---|
| 1 | `VERSION = 2`; `hello` thêm `tok` (tùy chọn), `region`, `cv` (phiên bản nội dung) | danh tính, phòng theo vùng |
| 2 | `welcome` thêm `now` (ms giờ máy chủ), `region`, `aoi: 120` | đồng hồ chuẩn cho sự kiện, biết bán kính quan tâm |
| 3 | **Quản lý vùng quan tâm (AOI):** chỉ gửi `mv`, `join`, `leave`, `cos`, `emo` cho người trong 120 m (vào), 140 m (ra) | giảm gói ra từ O(n²) |
| 4 | **Gộp gói vị trí:** máy chủ không phát lại từng `mv`; mỗi 125 ms (8 Hz) gửi mỗi người một gói `mvb` chứa vị trí mới của những ai trong AOI đã đổi | giảm số thông điệp WebSocket (tính phí theo thông điệp) |
| 5 | Phòng theo vùng: id DO `town-<region>-<n>`; `MAX_ROOMS` theo vùng | thế giới lớn |
| 6 | `START` lấy từ `court.js › START_M` qua `toTile` (import chung) thay hằng chép tay | D13 |
| 7 | Gói mới: `bell` (chuông sớm/trống chiều), `rite` (dự lễ), `inv`/`coop_*` (đồng tu, giải án chung — triển khai phần P3 đã khai báo) | hoạt động xã hội §10 bản sơ đồ tổng |
| 8 | Giới hạn tốc độ theo loại gói (bảng §6.3) thay một mức 20/s | |

Client v1 (bản game cũ trong bộ đệm) gửi `hello` không có `cv` → máy chủ trả `{ t: 'err', m: 'upgrade' }` và đóng 4003; client cũ hiện «Có bản mới, tải lại trang».

### 6.2 Thuật toán AOI

```
máy chủ giữ cho mỗi phòng: lưới băm ô 32 m → Set<socketId>
on mv(a): cập nhật a.x, a.y; nếu đổi ô → chuyển a giữa các tập ô; đánh dấu a.dirty
mỗi 125 ms (alarm hoặc setTimeout trong DO khi phòng có người):
  for mỗi người nhận r:
    cand = ∪ ô trong bán kính 140 m quanh r (tối đa 9×9 ô 32 m = 81 ô; thực tế 5×5 với 120 m → 9 ô… tính theo bán kính)
    vis_new = { p ∈ cand : dist(p, r) ≤ (p ∈ r.vis ? 140 : 120) }
    gửi join cho vis_new − r.vis; leave cho r.vis − vis_new
    batch = [p ∈ vis_new : p.dirty] → gửi { t: 'mvb', p: [[id, x, y, h, s, a], …] } nếu khác rỗng
    r.vis = vis_new
  xóa cờ dirty
```

- Độ phức tạp mỗi nhịp: O(n × k) với k = số người trong AOI (≪ n khi phòng rải rộng). Trường hợp xấu nhất (60 người cùng sân Sơn Môn): k = 59 → như v1 nhưng số **thông điệp** giảm từ ≈ 28.000/s (phát từng `mv`) xuống 60 × 8 = 480/s (mỗi người một gói gộp mỗi nhịp).
- Kích thước gói gộp xấu nhất: 59 × ~40 byte ≈ 2,4 KB × 8 Hz ≈ 19 KB/s xuống mỗi người — chấp nhận được trên 4G (suy luận).
- Hibernation: vòng nhịp chỉ chạy khi có `mv` trong 2 s gần nhất; phòng im lặng thì DO vẫn ngủ được.

### 6.3 Giới hạn theo loại gói

| Gói | Tối đa | Vượt |
|---|---|---|
| `mv` | 10/s | bỏ gói thừa (không ngắt) |
| `emo`, `say` | 1/2 s | bỏ |
| `cos` | 1/5 s | bỏ |
| `report` | 5/phút | bỏ |
| `inv`, `coop_*` | 2/s | bỏ |
| tổng | 30/s | đóng 4002 |

### 6.4 Biên nhận có mặt

- Lễ tập thể (Mùng 1, Rằm, chuông sớm giờ Mão, trống chiều giờ Dậu): `TownShard` ghi danh sách tài khoản (từ `tok` đã kiểm) có mặt trong vùng lễ ≥ 60 s trong khung giờ lễ.
- Hết lễ: DO gọi `PlayerVault.issueReceipt({ k: 'presence', ref: '<lễ>:<ngày>' })` cho từng người → mục sổ `trust: 'server'` (phần 04 §6.2).

### 6.5 Bài tải

`scripts/load-quan.mjs [ws://…] [--clients 60] [--rooms 1] [--duration 120]`:

- Tạo N client giả (`WebSocket` Node 22 có sẵn), đi ngẫu nhiên trong sân Sơn Môn ở 8 Hz, 10% gửi `emo` mỗi 10 s.
- Đo: độ trễ một chiều (đóng dấu `ts` trong gói `emo`), số thông điệp/s vào/ra, phần trăm gói `mvb` bị trễ > 250 ms, CPU DO (từ `wrangler tail` khi chạy trên môi trường thử).
- Ngưỡng đạt: p95 trễ < 150 ms ở `wrangler dev` cục bộ; 0 lần đóng ngoài ý muốn; khách thứ 61 nhận `full` (4001) và sang phòng kế.

## 7. Môn phái — `SectHall` (Durable Object, một cho mỗi môn phái)

### 7.1 Mô hình

- Bản sơ đồ tổng §10: **môn phái = đạo thống**; đạo tràng chung có công trình nâng cấp (mọi công trình vẫn phải đi vào được); sổ công đức chung; lễ riêng; sư đồ (cảnh giới ≥ 4 nhận đệ tử).
- id DO: `sect:<schoolId>` (9 đạo thống chính của bản sơ đồ tổng §5.6). Nếu tài liệu 10 thêm môn phái do người chơi lập (`GUILD-*`), id `guild:<ulid>` dùng cùng lớp.

### 7.2 Bảng SQLite

```sql
CREATE TABLE members (acc TEXT PRIMARY KEY, name TEXT, role TEXT, realm INTEGER, joined INTEGER, merit INTEGER DEFAULT 0, last INTEGER);
CREATE INDEX members_merit ON members(merit DESC);
CREATE TABLE pool    (week TEXT PRIMARY KEY, merit INTEGER, donors INTEGER);          -- sổ công đức chung theo tuần
CREATE TABLE hall    (bld TEXT PRIMARY KEY, level INTEGER, progress INTEGER, updated INTEGER);  -- công trình đạo tràng
CREATE TABLE mentor  (disciple TEXT PRIMARY KEY, master TEXT, since INTEGER, status TEXT, doneAt INTEGER);
CREATE TABLE rites   (id TEXT PRIMARY KEY, at INTEGER, kind TEXT, attendees INTEGER);
CREATE TABLE notices (id TEXT PRIMARY KEY, at INTEGER, text_key TEXT);                -- thông báo soạn sẵn, không văn bản tự do
```

### 7.3 API

| HTTP | Mô tả | Luật |
|---|---|---|
| `POST /api/hq/sect/join` `{ sect }` | gia nhập | tài khoản đã `joinSchool` cùng id trong bản lưu (kiểm qua `PlayerVault`); tối đa 3 đạo thống, chỉ **một** môn phái chính để tính sổ chung |
| `POST /api/hq/sect/leave` | rời | công đức đã góp ở lại sổ chung |
| `GET /api/hq/sect/info?sect=` | thông tin, top 20 thành viên theo công đức, cấp công trình | bộ đệm 60 s |
| `POST /api/hq/sect/contribute` | góp công đức đáng tin của tuần vào sổ chung | chỉ phần `trusted` (phần 04) |
| `POST /api/hq/sect/mentor/request` `{ master }` | xin làm đệ tử | sư phụ cảnh giới ≥ 4, tối đa 5 đệ tử đang học |
| `POST /api/hq/sect/mentor/accept` | sư phụ nhận | |
| (nội bộ) `mentorDone(disciple)` | đệ tử xong Mệnh Đồ → sư phụ nhận biên nhận `mentor` (phần 04) | xác nhận từ `PlayerVault` của đệ tử (cờ nhiệm vụ đáng tin) |

- Không có trò chuyện tự do trong môn phái (giữ chính sách «chỉ cụm từ soạn sẵn», Guideline 1.2 như `protocol.js`).
- Vai trò (`role`: đệ tử, chấp sự, trưởng lão) tự động theo cảnh giới và công đức; không có quyền đuổi người (tránh bắt nạt) — báo cáo đi qua kênh báo cáo hiện có.
- Quy mô: 100.000 thành viên một môn phái → bảng `members` ≈ 10 MB; truy vấn top dùng chỉ mục; ghi ≤ vài chục/giây (góp theo tuần).

## 8. Phân tích (analytics)

### 8.1 Nguyên tắc riêng tư

1. **Không** gửi ngày sinh, giờ sinh, tên, văn bản người chơi nhập, nội dung câu hỏi/trả lời AI, nội dung sổ đời thực.
2. **Không** dùng `POST /api/event` của app chính cho game (`admin.js › logEvent` ghi `dob/time/gender` vào KV `vprof:` — D19).
3. Mã định danh phân tích = `HMAC-SHA256(HQ_ANALYTICS_PEPPER, acc || deviceId)` rút 16 hex, tính **ở máy chủ** (client không biết pepper → không đối chiếu được với `pid`).
4. Chỉ ghi sự kiện có định danh khi `consent.analytics = true`. Không đồng ý → chỉ đếm tổng (định danh rỗng), không có tỉ lệ giữ chân cá nhân.
5. Thuộc tính nhạy cảm dẫn xuất từ lá số (dải Tiềm Lực, lớp Mệnh Cách) **chỉ** gửi khi đồng ý, ở dạng dải thô: `band ∈ {<28, 28–35, 36–45, 46–57, ≥58}`, `lop ∈ {TT, DC, NT, DK, ?}`. Cần cho chỉ số thành công §13.5 (giữ chân người lá số thấp).

### 8.2 SCHEMA-EVENT

Client gửi lô ≤ 50 sự kiện tới `POST /api/hq/ev` (gzip; ≤ 1 lần/30 s, và `sendBeacon` khi `pagehide`):

```jsonc
{ "s": "sess_7f3a",                         // id phiên ngẫu nhiên (client)
  "p": "web",                               // 'web' | 'ios'
  "av": "3.1.0+hq.42",                      // phiên bản app + game
  "cv": "q:2026.11.3",
  "q": "mid",                               // mức chất lượng
  "e": [ { "n": "quest_end", "t": 1762300800123, "k": { "id": "MQ-1-03", "o": "success" }, "v": [1840] } ] }
```

Worker ghi mỗi sự kiện bằng `HQ_EVENTS.writeDataPoint({ indexes: [aid], blobs: [n, p, av, cv, q, band, lop, region, k1, k2], doubles: [v0, v1, v2] })` (Workers Analytics Engine: tối đa 20 blob, 20 double, 1 index).

### 8.3 Danh mục sự kiện

| `n` | `k` (blob) | `v` (double) | Mục đích |
|---|---|---|---|
| `session_start` | `entry` (`gate`/`resume`) | — | DAU, phiên |
| `session_end` | — | `durSec` | độ dài phiên |
| `gate_done` | `band`, `lop` (nếu đồng ý) | `ms` hoàn tất cổng | phễu nhập môn |
| `quest_start` / `quest_end` | `id`, `outcome` | `sec` | tiến độ cốt truyện |
| `node_stuck` | `quest`, `node` | — | phát hiện kẹt |
| `deed` | `deed` | `pts` | phân bố việc thiện |
| `milestone` | `m` (300/600/1000) | — | |
| `realm_up` | `tier` | `daoHanh` | |
| `menhdo_layer` | `layer` (1–6) | — | chỉ số §13.5 (≥ 60% mở Mệnh Đồ, làm xong ≥ 1 tầng) |
| `ai_turn` | `persona`, `briefMode`, `src` (`ai`/`cache`/`fallback`) | `inTok`, `outTok`, `neo`, `filtered` | chi phí, chất lượng (chỉ số Neo ≥ 90) |
| `ai_quota` | `persona` | — | |
| `crisis_shown` | — | — | đếm, không nội dung |
| `case_graded` | `kind` | `score` | |
| `perf` | `gpuClass`, `region` | `fpsP50`, `fpsP95`, `drawCalls`, `tris`, `texMB` | phần 09 |
| `stream_stall` | `cell` | `ms` | phần 07 |
| `err` | `code`, `mod` | — | lỗi JS đã phân loại (không gửi stack có đường dẫn người dùng) |
| `purchase` | `sku`, `src` | `vnd` | doanh thu (đối soát với `ent`) |
| `consent` | `kind`, `on` | — | |
| `mmo` | `ev` (`connect`/`full`/`drop`) | `room` | |

### 8.4 Truy vấn chỉ số thành công

Ví dụ (SQL API của Analytics Engine):

```sql
-- giữ chân D7 theo dải Tiềm Lực (chỉ người đã đồng ý)
WITH first AS (
  SELECT index1 AS aid, blob6 AS band, min(timestamp) AS t0 FROM huyenquan_events
  WHERE blob1 = 'gate_done' AND blob6 != '' GROUP BY aid, band
)
SELECT band, count() AS n,
  countIf(aid IN (SELECT index1 FROM huyenquan_events WHERE blob1 = 'session_start'
                  AND timestamp BETWEEN first.t0 + INTERVAL '7' DAY AND first.t0 + INTERVAL '8' DAY)) / count() AS d7
FROM first GROUP BY band ORDER BY band;
```

(Cú pháp chính xác của SQL API phải kiểm lại theo tài liệu Cloudflare tại thời điểm làm — TASK-121.)

### 8.5 Lưu giữ

- Analytics Engine giữ dữ liệu theo chính sách nền tảng (khoảng 3 tháng — kiểm lại khi làm); báo cáo tổng hợp tuần xuất ra R2 dạng CSV đã gộp (không có `aid`).

## 9. Bảo mật máy chủ

| Mục | Biện pháp |
|---|---|
| CORS | dùng lại `ALLOWED_ORIGINS` của `worker/index.js`; `/api/hq/*` từ chối Origin lạ |
| Xác thực | token HMAC, hết hạn 30 ngày, xoay khóa `kv` |
| Giới hạn tốc độ | theo token (DO) cho thao tác ghi; theo IP cho `/auth/*`; **không** dùng bộ đếm KV toàn cục cho `/api/hq/*` (đỡ ghi KV) |
| Kích thước | thân yêu cầu ≤ 300 KB (lưu), ≤ 64 KB (khác) |
| Webhook | kiểm chữ ký từng kênh; lũy đẳng theo `tx` |
| Bí mật | chỉ ở `wrangler secret`; không bao giờ trong bundle client (giống `MESHY_API_KEY` trong `.env.meshy`) |
| Nhật ký kiểm toán | `PlayerVault.meta['audit']` giữ 100 thao tác nhạy cảm gần nhất (grant, revoke, recover, forget) |
| Xóa dữ liệu | `/auth/forget` xóa thật trong 30 ngày (Apple yêu cầu có xóa tài khoản trong app nếu có tạo tài khoản) |

## 10. Chế độ lỗi

| Lỗi | Hậu quả | Xử lý |
|---|---|---|
| Máy chủ không với tới | không đồng bộ, không AI | offline-first: chơi đơn, xếp hàng đồng bộ, thoại kịch bản |
| Token hết hạn khi đang chơi | 401 | `/auth/refresh` tự động một lần; thất bại → tiếp tục offline, hỏi khôi phục ở lần sau |
| Hai thiết bị cùng lưu | 409 | gộp §4.2 |
| Webhook đến trước khi client báo mua xong | không sao | `grant` lũy đẳng; client đọc `summary()` |
| DO `SectHall` quá tải | chậm | đọc qua bộ đệm 60 s; ghi xếp hàng ở `PlayerVault` |
| Pepper phân tích lộ | đối chiếu được aid với tài khoản | xoay pepper (mất liên tục số liệu giữ chân một kỳ) |

## 11. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-hq-auth.mjs` (Worker, `dev:mmo`) | cấp token; refresh; khôi phục bằng mã; mã sai bị giới hạn; forget xóa vault |
| `test-hq-save.mjs` | lưu/đọc; 409 và gộp; `cloudBirth = false` không có trường ngày sinh trong thân yêu cầu (kiểm bằng chặn `fetch`); thu hồi đồng ý xóa trường |
| `test-merge-saves.mjs` (thuần) | tính chất hợp tập/lớn nhất; giao hoán ở các khối đó; Ngọc luôn lấy máy chủ |
| `test-ngoc.mjs` | điểm danh hai lần một ngày bị từ chối; VIP hết hạn không nhận; chi vượt số dư bị đảo ngược |
| `test-pay-*.mjs` | Apple JWS mẫu (chứng chỉ thử của Apple), Stripe webhook ký bằng khóa thử, VNPay IPN với secret thử: grant đúng một lần, revoke gỡ món |
| `test-skus.mjs` | §5.2 |
| `test-quan-v2.mjs` | AOI vào/ra 120/140 m; `mvb` chỉ chứa người trong AOI đã đổi; client v1 bị yêu cầu cập nhật; START khớp `court.js` |
| `load-quan.mjs` | §6.5 |
| `test-sect.mjs` | gia nhập cần cờ đạo thống; một môn phái chính; góp chỉ phần đáng tin; sư đồ: điều kiện cảnh giới, tối đa 5 đệ tử, biên nhận khi xong Mệnh Đồ |
| `test-ev.mjs` | không đồng ý → `aid` rỗng và không có `band/lop`; danh sách trắng tên sự kiện; thân yêu cầu không chứa chuỗi ngày sinh (quét regex `\d{4}-\d{2}-\d{2}` trong blob) |

## 12. Tham chiếu API `/api/hq/*`

Quy ước chung: JSON UTF-8; lỗi trả `{ "error": { "code": "…", "message": "…" } }`; mọi route có `Access-Control-Allow-Origin` theo `ALLOWED_ORIGINS`; `Cache-Control: no-store` trừ khi ghi khác.

### 12.1 Bảng route

| Phương thức + đường | Xác thực | Thân yêu cầu | Trả 2xx | Giới hạn | Mốc |
|---|---|---|---|---|---|
| `GET /api/hq/health` | — | — | `{ ok, v, do: { quan, vault, tb, sect } }` | — | M1 |
| `GET /api/hq/config` | — | — | SCHEMA-REMOTE-CONFIG; `Cache-Control: max-age=60` | — | M1 |
| `POST /api/hq/auth/device` | — | `{ deviceId, appV, platform }` | `{ token, acc, recovery?, expiresIn }` | 20/giờ/IP | M1 |
| `POST /api/hq/auth/refresh` | token (có thể hết hạn ≤ 30 ngày) | `{}` | `{ token, expiresIn }` | 60/giờ/tài khoản | M1 |
| `POST /api/hq/auth/recover` | — | `{ recovery, deviceId }` | `{ token, acc }` | 5/giờ/IP, 10/ngày/tài khoản | M1 |
| `POST /api/hq/auth/rotate` | token | `{}` | `{ recovery }` | 3/ngày | M1 |
| `POST /api/hq/auth/forget` | token | `{ confirm: "XOA" }` | `{ scheduled: true, at }` | 1/ngày | M6 |
| `GET /api/hq/vault` | token | — | `summary()` | 60/phút | M1 |
| `GET /api/hq/vault/save` | token | — | SCHEMA-CLOUDSAVE \| 204 | 30/phút | M1 |
| `PUT /api/hq/vault/save` | token | SCHEMA-CLOUDSAVE | `{ rev }` \| 409 `{ server: SCHEMA-CLOUDSAVE }` | 12/phút, ≤ 300 KB | M1 |
| `POST /api/hq/consent` | token | `{ analytics?, publicCanCot?, cloudBirth? }` | `{ consent }` | 30/giờ | M1 |
| `POST /api/hq/ledger/sync` | token | phần 04 §5.2 | phần 04 §5.2 | 12/phút, ≤ 200 mục | M1 |
| `POST /api/hq/receipt` | token | `{ k, ref, payload }` | SCHEMA-RECEIPT | 60/giờ | M3 |
| `POST /api/hq/ai/chat` | token | thân OpenAI-compatible + `persona` | stream SSE như `/zai` | lượt/ngày (phần 05 §7) + 30/phút/IP | M1 |
| `GET /api/hq/tb/top` | — | `?by=dh\|tt&n≤100` | `{ season, rows: SCHEMA-TB-ROW[] }`; `max-age=60` | — | M3 |
| `GET /api/hq/tb/me` | token | — | `{ rank, around: [] }` | 60/phút | M3 |
| `GET /api/hq/tb/school` | — | — | `{ schools: [{ id, dh }] }`; `max-age=300` | — | M3 |
| `POST /api/hq/ngoc/ops` | token | `{ ops: [{ id, op, amt, reason }] }` (≤ 50) | `{ balance, results: [{ id, ok }] }` | 30/phút | M6 |
| `POST /api/hq/pay/apple` | token | `{ signedTransactionInfo }` | `{ ent }` | 30/giờ | M6 |
| `POST /api/hq/pay/apple/notify` | chữ ký Apple | thông báo V2 | 200 | — | M6 |
| `POST /api/hq/pay/stripe/session` | token | `{ sku }` | `{ url }` | 20/giờ | M6 |
| `POST /api/hq/pay/stripe/webhook` | `Stripe-Signature` | sự kiện Stripe | 200 | — | M6 |
| `POST /api/hq/pay/vnpay/url` | token | `{ sku }` | `{ url }` | 20/giờ | M6 |
| `GET /api/hq/pay/vnpay/ipn` | `vnp_SecureHash` | tham số query VNPay | `{ RspCode, Message }` (định dạng VNPay yêu cầu) | — | M6 |
| `POST /api/hq/sect/join` · `leave` · `contribute` · `mentor/request` · `mentor/accept` | token | §7.3 | `{ ok, sect }` | 10/phút | M6 |
| `GET /api/hq/sect/info` | — | `?sect=` | §7.3; `max-age=60` | — | M6 |
| `POST /api/hq/ev` | token tùy chọn | SCHEMA-EVENT | 204 | 1/30 s/phiên (gộp), ≤ 64 KB | M1 |

### 12.2 Mã lỗi

| HTTP | `code` | Khi | Client làm gì |
|---|---|---|---|
| 400 | `bad_request` | thân sai schema | báo dev; không thử lại |
| 401 | `auth` | thiếu/sai token | `/auth/refresh` một lần, rồi `/auth/device` |
| 401 | `expired` | token hết hạn | `/auth/refresh` |
| 403 | `origin` | Origin lạ | — |
| 403 | `consent` | thao tác cần đồng ý chưa có | mở màn đồng ý |
| 404 | `not_found` | vault/sect không có | tạo lại qua `/auth/device` |
| 409 | `conflict` | `baseRev` cũ | gộp (§4.2) rồi gửi lại |
| 413 | `too_large` | quá kích thước | gộp sổ/ bỏ trường thừa |
| 422 | `rule` | vi phạm luật nghiệp vụ (vd đạo thống thứ 4, chi Ngọc vượt số dư) | hiện lời giải thích |
| 429 | `quota` | hết lượt AI (`resetAt`) | thoại kịch bản |
| 429 | `rate` | vượt giới hạn tốc độ (`Retry-After`) | chờ |
| 503 | `disabled` | tính năng tắt qua cấu hình từ xa / `isAiEnabled` | chế độ dự phòng, không báo lỗi đỏ |
| 5xx | `internal` | lỗi máy chủ | thử lại lũy thừa (trần 30 s), dữ liệu giữ ở client |

### 12.3 Định tuyến trong `worker/index.js`

Thêm **trước** bước «0b chặn scraper» và **sau** bước kiểm IP bị chặn:

```js
if (url.pathname.startsWith('/api/hq/')) return (await import('./hq/router.js')).route(request, env, ctx);
```

- `/api/hq/*` không qua giới hạn tốc độ KV toàn cục (`grl:`) và không qua `handleAdminRoute` (tránh `logEvent`).
- Webhook thanh toán không kiểm `Origin` (gọi từ máy chủ nhà cung cấp) nhưng bắt buộc kiểm chữ ký.
- Nhập động `router.js` để mã game không làm chậm các route của app chính (Workers nạp module một lần mỗi isolate).

## 13. Môi trường staging trong `wrangler.jsonc`

```jsonc
"env": {
  "staging": {
    "name": "battu-staging",
    "assets": { "directory": "./dist", "binding": "ASSETS", "not_found_handling": "none", "run_worker_first": false, "html_handling": "none" },
    "kv_namespaces": [ { "binding": "ADMIN_KV", "id": "<id KV staging riêng>" } ],
    "durable_objects": { "bindings": [
      { "name": "QUAN",  "class_name": "TownShard" },
      { "name": "VAULT", "class_name": "PlayerVault" },
      { "name": "TB",    "class_name": "ThienBang" },
      { "name": "SECT",  "class_name": "SectHall" }
    ] },
    "analytics_engine_datasets": [ { "binding": "HQ_EVENTS", "dataset": "huyenquan_events_staging" } ],
    "vars": { "HQ_ENV": "staging", "ALLOW_V1": "true" }
  }
}
```

- Durable Object của môi trường `staging` là namespace riêng (Worker tên khác) → không chạm dữ liệu production.
- Secret đặt riêng: `wrangler secret put HQ_TOKEN_KEY --env staging` (khóa khác production).
- Client trỏ staging bằng `?server=wss://<miền staging>` (cơ chế `serverBase()` sẵn có của `net.js`) và cấu hình `/api/hq/*` theo cùng gốc trang.

## 14. Khung `PlayerVault`

```js
// worker/hq/vault.js
import { DurableObject } from 'cloudflare:workers';

export class PlayerVault extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const sql = ctx.storage.sql;
      sql.exec(`CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)`);
      sql.exec(`CREATE TABLE IF NOT EXISTS save (rev INTEGER PRIMARY KEY, at INTEGER, dev TEXT, bytes INTEGER, body BLOB)`);
      sql.exec(`CREATE TABLE IF NOT EXISTS ledger (id TEXT PRIMARY KEY, deed TEXT, kind TEXT, pts INTEGER, pts_srv INTEGER, n INTEGER,
                at INTEGER, trust TEXT, aid TEXT, dev TEXT, day TEXT)`);
      sql.exec(`CREATE INDEX IF NOT EXISTS ledger_day ON ledger(day)`);
      sql.exec(`CREATE UNIQUE INDEX IF NOT EXISTS ledger_aid ON ledger(aid) WHERE aid IS NOT NULL`);
      // … receipts, ent, ngoc, ai_quota, titles (phần 08 §3.1)
    });
  }
  async summary() { /* đọc meta, save mới nhất (rev, savedAt), số dư Ngọc, ent còn hiệu lực, titles, tổng sổ, lượt AI còn */ }
  async putSave(env /* SCHEMA-CLOUDSAVE */) { /* so baseRev → 409 hoặc INSERT; xóa bản cũ quá 5 */ }
  async getSave() { /* SELECT … ORDER BY rev DESC LIMIT 1 */ }
  async syncLedger(req) { /* phần 04 §5–6, phụ lục D.5 */ }
  async consumeAiTurn(day, cap) { /* UPSERT ai_quota; trả { ok, used, cap } — nguyên tử vì DO đơn luồng */ }
  async refundAiTurn(day) { /* used = max(0, used − 1) */ }
  async issueReceipt(req) { /* tái hiện → ký (receipt.js) → INSERT receipts(ref) */ }
  async grant(ent) { /* INSERT … ON CONFLICT(tx) DO NOTHING */ }
  async revoke(tx) { /* UPDATE ent SET revoked = 1 WHERE tx = ? */ }
  async setConsent(c) { /* meta['consent']; cloudBirth false → xóa trường ngày sinh trong mọi bản save */ }
  async forget() { /* xóa mọi bảng, ghi meta['deleted'] = now; alarm xóa hẳn sau 30 ngày */ }
}
```

- Worker gọi DO qua RPC: `env.VAULT.get(env.VAULT.idFromName(acc)).consumeAiTurn(day, cap)`.
- DO đơn luồng → đếm lượt, cấp biên nhận, cấp quyền lợi là nguyên tử mà không cần khóa.
- `blockConcurrencyWhile` trong constructor chỉ chạy tạo bảng (nhanh); mọi di trú bảng sau này thêm cột bằng `ALTER TABLE … ADD COLUMN` có kiểm tồn tại.
