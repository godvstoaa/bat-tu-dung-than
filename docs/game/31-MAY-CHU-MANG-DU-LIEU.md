# 31 · Máy chủ, mạng, dữ liệu

> **Trạng thái:** `[ĐÃ CÓ]`; `[MỘT PHẦN]` ở chỗ ví tiền và chỉ số sinh tồn còn trên máy người chơi
> **Bộ phận chủ trì:** Backend
> **Nguồn sự thật trong mã:** `worker/index.js`, `worker/quan-room.js`, `worker/accounts.js`, `worker/auth.js`, `worker/estate.js`, `worker/guild.js`, `worker/economy.js`, `worker/npc-chat.js`, `worker/llm.js`, `src/game/protocol.js`, `src/game/net.js`, `src/game/auth-core.js`, `src/game/account.js`, `src/game/econ-core.js`, `src/game/guild-core.js`, `src/game/estate-core.js`, `wrangler.jsonc`; danh sách gói, route, hằng số ở [A4](phu-luc/A4-giao-thuc.md)
> **Test:** `scripts/test-quan-protocol.mjs`, `scripts/test-game-auth.mjs`; cần máy chủ dev: `scripts/test-quan-mmo.mjs`, `scripts/test-quan-auth.mjs`, `scripts/test-econ-accounts.mjs`
> **Thay thế:** `GAME-MMO-PROMPT-PLAN`, `GAME-SINH-TON-KINH-TE-DAC-TA` §1, §9, §19, §25, §31; cấu hình bản thật vẫn ở `TAI-KHOAN-CAI-DAT`
> **Kiểm với mã ngày:** 2026-11-16

## 31.0 Mục đích, phạm vi, tóm tắt

Máy chủ có ba việc: cho người chơi thấy nhau, giữ những sổ không được để người chơi tự sửa, và giữ tài khoản. Chương này nêu kiến trúc đang chạy, rồi các đặc tả gốc đã được đánh số lại. Không gồm: kiểm thử và phát hành (§32), luật nghiệp vụ của từng sổ (chương hệ thống).

```
trình duyệt ──HTTP──▶ Worker (worker/index.js)
     │                  ├─ tệp tĩnh của app và game
     │                  ├─ /api/auth/*, /api/save ─▶ Accounts   (tài khoản, phiên, bản lưu mây)
     │                  ├─ /api/npc/chat ─────────▶ mô hình ngôn ngữ (qua cấu hình AI của app) + Economy (trí nhớ, hạn mức)
     │                  └─ quản trị, đo lường, cổng AI của app
     └──WebSocket /ws/quan──▶ TownShard «phòng» (mỗi phòng một bản)
                                 ├─▶ Estate   (sổ nhà, một bản toàn cục)
                                 ├─▶ Guild    (sổ việc làm, một bản toàn cục)
                                 └─▶ Economy  (sổ kinh tế, một bản toàn cục)
```

## 31.1 Kiến trúc đang chạy

`[ĐÃ CÓ]` Bảng Durable Object, migration, route: [A4](phu-luc/A4-giao-thuc.md) §A4.4, §A4.5.

| Thành phần | Phạm vi | Giữ gì |
|---|---|---|
| `TownShard` | mỗi phòng một bản; có sức chứa tối đa và số phòng tối đa | người trong phòng, ghế Trà Thất, hương đang cháy, công trình đang bị phá; chuyển tiếp gói sang ba sổ |
| `Estate` | toàn cục | ai sở hữu căn nào, bố cục, lượt khen |
| `Guild` | toàn cục | chỗ làm, ca, hồ sơ nghề, sổ tiền công; Dụng thần đã khai |
| `Economy` | toàn cục | ví chợ, kho và độ tươi, ruộng, chợ, Thương hội, mặt bằng, hộ tịch, thầy mệnh lý, két giữ, trí nhớ NPC |
| `Accounts` | toàn cục | tài khoản, cách đăng nhập, phiên, mã một lần, bản lưu mây |
| Kho khoá-giá trị | toàn cục | cấu hình AI, công tắc tắt AI, số liệu quản trị |

**Nguyên tắc** (LN-02): luật của mỗi sổ nằm trong một **mô-đun thuần dùng chung** (`guild-core`, `econ-core`, `estate-core`, `auth-core`, `protocol`). Máy chủ, client ngoại tuyến và test chạy cùng một mã luật.

### 31.1.1 Giao thức WebSocket

`[ĐÃ CÓ]` Danh sách đầy đủ sinh từ mã: [A4](phu-luc/A4-giao-thuc.md) §A4.1, §A4.2.

- **Chào:** client gửi lời chào kèm mã khách hoặc vé tài khoản, tên, màu áo, trang bị, danh hiệu, nơi xuất hiện. Máy chủ trả lời chào kèm người trong phòng, ghế, hương, công trình đang bị phá.
- **Vị trí:** gói vị trí có trần tần suất; mang vị trí, độ cao tương đối, **độ cao tuyệt đối** (cho hai vùng trời), trạng thái nước, loại thuyền, trạng thái bay. Máy chủ kiểm biên, kiểm bước nhảy quá xa; phát theo vùng quanh người chơi, người xa nhận thưa.
- **Nhóm gói:** xã giao (cử chỉ, cụm từ, ngồi, hương, báo cáo, cúng); trang bị; nhà (`est_*`); việc làm (`job_*`); phá công trình; kinh tế (`ec` với tên thao tác có kiểm).
- **Mọi gói đều qua bộ lọc** trong `protocol.js`: sai dạng thì bỏ; tên và danh hiệu qua bộ lọc từ; trang bị qua danh mục. Có trần số gói mỗi giây; vượt thì đóng kết nối với mã riêng.
- **Thêm một gói:** viết bộ lọc trong `protocol.js`, xử lý trong `quan-room.js`, thêm ca vào `test-quan-protocol`; gói tự xuất hiện ở A4 sau khi sinh lại phụ lục.

## 31.2 Tài khoản & lưu trữ

> **Trạng thái:** `[ĐÃ CÓ]` (P0): Google và mã email đang chạy; số điện thoại có mã nhưng tắt; Apple chưa có. Hằng số ở [A4](phu-luc/A4-giao-thuc.md) §A4.3. Cấu hình bản thật: [TAI-KHOAN-CAI-DAT](../TAI-KHOAN-CAI-DAT.md).

### 31.2.1 Phương thức đăng nhập

| Cách | Luồng | Ghi chú |
|---|---|---|
| **Google** | OAuth 2.0 / OpenID Connect, Authorization Code + PKCE. Worker đổi code lấy `id_token`, kiểm chữ ký (JWKS của Google), `aud`, `iss`, `exp`. Định danh là `sub`. | Cần tạo **OAuth Client ID** trong Google Cloud Console, khai báo domain và redirect URI. Người dùng phải tự tạo (mình không đăng nhập hộ). |
| **Email** | Nhập email → gửi mã 6 số (hết hạn 10 phút, sai tối đa 5 lần) → nhập mã → xong. Không dùng mật khẩu. | Cần dịch vụ gửi mail, ví dụ Resend hoặc Amazon SES, kèm khóa API (secret của Worker) và bản ghi SPF/DKIM cho domain. |
| **Số điện thoại** | Nhập số (chuẩn hóa E.164, +84) → SMS mã 6 số → nhập mã. | **Tốn phí theo từng SMS.** Cần nhà cung cấp (Twilio, Vonage hoặc nhà mạng VN qua eSMS hay SpeedSMS) và đăng ký brandname. Bắt buộc chống spam (§31.2.4). Đề xuất làm sau Google và email. |
| **Apple** | Sign in with Apple. | **Bắt buộc khi lên iOS** nếu có đăng nhập Google (App Store Guideline 4.8). Cờ iOS hiện đang tắt, nên làm khi bật iOS. |
| **Khách** | Như hiện nay: `pid` trong localStorage, chơi offline. | Mở **Liên kết tài khoản** bất cứ lúc nào; save khách được chuyển lên tài khoản. |

### 31.2.2 Mô hình dữ liệu (máy chủ)

Lưu trong Durable Object `Accounts` (SQLite backend, một bản toàn cục, như `Estate`) hoặc D1. Đề xuất DO để khớp kiến trúc hiện có.

```
account   { uid (ULID), created, name, status, flags, deleteAt? }
identity  { kind: google|email|phone|apple, key (sub | email đã hạ chữ thường | E.164), uid, verifiedAt }   UNIQUE(kind,key)
session   { sid (ngẫu nhiên 32 byte), uid, created, lastSeen, ua, ipHash }   → cookie httpOnly, Secure, SameSite=Lax, 30 ngày, xoay vòng
otp       { kind, key, codeHash (SHA-256 + muối), expires, tries }   xóa sau khi dùng hoặc khi hết hạn
save      { uid, rev, body (JSON nén), updated }   (state đã lọc §31.2.3)
```

**Kết nối WebSocket:**
- `hello` gửi `tok` (JWT HMAC ngắn hạn 15 phút, Worker cấp qua `/api/auth/ws-token` từ cookie) thay cho `pid`.
- TownShard kiểm token. `u = stableId(uid)`.
- Khách vẫn dùng `pid` nhưng **không tham gia kinh tế máy chủ** (chơi thử với ví riêng trên máy, không giao dịch).

### 31.2.3 Ngày giờ sinh không lên mây (ràng buộc cố định)

- `save.body` = state bỏ các trường `profiles[].year/month/day/hour/minute` và `player.year/...`.
- Chỉ giữ **kết quả suy ra**: `yong {primary, accent, ji}`, ngũ hành phẩm phục, can ngày (Nhật chủ), địa chi năm. Kinh tế và luật cần các trường này, và từ chúng không suy ngược lại được ngày sinh.
- **Sang máy mới:** đăng nhập xong thì hỏi lại ngày giờ sinh (bảng nhập có sẵn). Nếu Dụng thần mới khác bản trên mây (nhập sai) thì cho chọn bản đúng. Mỗi tài khoản đổi tối đa 1 lần mỗi 30 ngày, để không «đổi mệnh» lấy lợi kinh tế.
- **Tùy chọn sau này (opt-in):** «két mã hóa» — ngày sinh được mã hóa ngay trên máy bằng cụm mật khẩu riêng (PBKDF2 + AES-GCM), máy chủ chỉ giữ bản mã. Mặc định tắt.
- LLM của NPC **không bao giờ** nhận ngày sinh hay tứ trụ (§21.3.4).
- **Ngoại lệ duy nhất (đã chốt, Quyết định 7):** khi khách tự đặt một lượt xem với thầy mệnh lý (§12.6), client gửi **tứ trụ 8 chữ** kèm hồ sơ rút gọn cho lượt đó. Vẫn **không** gửi ngày, tháng, năm, giờ dạng lịch hay nơi sinh; tứ trụ không nằm trong `save.body`; phần hồ sơ bị xóa 30 ngày sau khi lượt xem chốt.
  - Tứ trụ gần như suy ngược được ngày sinh, nên đây là dữ liệu nhạy cảm: chính sách quyền riêng tư và nhãn quyền riêng tư trên kho ứng dụng phải ghi rõ trước khi bật P13.

### 31.2.4 An toàn

- **Giới hạn OTP:** mỗi email hoặc số 3 lần / 15 phút và 10 lần / ngày; mỗi IP 20 lần / giờ. Chặn đầu số quốc tế lạ theo mặc định (chỉ +84 lúc đầu). Có Turnstile (Cloudflare) trước khi gửi SMS.
- Mã OTP chỉ lưu bản băm, so sánh thời gian hằng.
- **Không có mật khẩu**, nên không phải lưu hay băm mật khẩu.
- **Xóa tài khoản** trong game (Sổ Mệnh › Cài đặt): xóa vĩnh viễn sau 7 ngày (Apple 5.1.1(v)). Có **xuất dữ liệu** dạng JSON.
- **Gộp tài khoản:** một tài khoản có thể gắn nhiều cách đăng nhập (Google + điện thoại). Gắn thêm cách mới phải xác minh cả hai phía.
- Đổi tên: lọc qua `cleanName` như hiện nay.

### 31.2.5 Giao diện

- Ở cổng có nút **«Đăng nhập / Lưu tài khoản»**, mở bảng gồm: Google · Email · Số điện thoại · (Apple trên iOS) · «Chơi khách».
- Trên HUD có dấu ☁ (đã đồng bộ) hoặc ⚠ (chưa lưu đám mây).

### 31.2.6 API Worker

```
POST /api/auth/google/start     → URL ủy quyền (state + PKCE lưu cookie tạm)
GET  /api/auth/google/callback  → đổi code, tạo / gắn identity, đặt cookie phiên, chuyển về /game.html
POST /api/auth/otp/send         {kind: email|phone, key, turnstile}
POST /api/auth/otp/verify       {kind, key, code}
POST /api/auth/link             (đang đăng nhập) gắn thêm identity
POST /api/auth/logout · GET /api/auth/me · POST /api/auth/delete · GET /api/auth/export
GET  /api/auth/ws-token         → JWT 15 phút cho hello
GET/PUT /api/save               {rev, body}   (PUT kiểm rev — chống ghi đè hai máy)
```

## 31.3 Máy chủ giữ sổ (chống gian)

> **Trạng thái:** `[MỘT PHẦN]`: sổ việc làm, nhà, kinh tế đã ở máy chủ; ví tiền và chỉ số sinh tồn còn ở máy người chơi (`VC-013`).

- Sổ **tiền, chỉ số sinh tồn, nghề, chỗ làm, nhà, xe, nợ, án** nằm trong DO theo tài khoản (`Player`) hoặc trong `Accounts`.
- Client chỉ gửi **hành động** (ăn món X ở tiệm Y, xong việc với điểm Z, ngủ ở phòng R). Máy chủ tính kết quả.
- **Bằng chứng việc làm:** điểm mini-game kèm thời gian bắt đầu và kết thúc, cùng hạt giống mini-game do máy chủ cấp. Máy chủ kiểm khoảng thời gian hợp lý, điểm phân phối tự nhiên, vị trí người chơi (từ gói `mv`) có ở chỗ làm hay không.
- Chỉ số sinh tồn: máy chủ tính theo thời điểm (`lastTick`). Client chỉ hiển thị dự đoán.
- **Khách (pid):** ví thử trên máy, không giao dịch, không lên bảng xếp hạng. Liên kết tài khoản thì bắt đầu lại ví tiền (không mang tiền khách sang), giữ tay nghề.
- Phần II mở rộng sổ này: DO `Player` / `Market` / `Venue` / `Civil` / `Divination` / `Risk`, sổ cái tiền dùng chung và chuyển tiền hai pha có khóa idempotency (§31.4.1–§31.4.2).

## 31.4 Yêu cầu kỹ thuật cho đội phát triển

> **Trạng thái:** `[ĐÃ CÓ]` về luật; **bố trí khác đặc tả**: sáu Durable Object dưới đây được gộp thành một `Economy` (QĐ-19), bảng SQL được thay bằng cấu trúc trong `econ-core.js`. Mục này giữ làm thiết kế đích khi cần tách ra. Mọi cột tiền tính bằng xu.

### 31.4.1 Bố trí Durable Object

Bản gốc đưa lược đồ PostgreSQL (UUID, DECIMAL, TIMESTAMP). Ở đây chuyển sang **SQLite trong Durable Object**, khớp hạ tầng đang chạy (`Accounts`, `Estate`, `QuanRoom`):

| DO | Khóa | Giữ | Ghi chú |
|---|---|---|---|
| `Accounts` (có) | toàn cục | danh tính, phiên, save đám mây | không đổi |
| **`Player`** (mới) | `idFromName(uid)` | **ví tiền, kho đồ (độ tươi), chỉ số sinh tồn, tay nghề, công thức bí truyền, sổ cái cá nhân** | nguồn sự thật cho §13.2–§14.1 và §17.2–§17.3; client P1 chuyển lên đây |
| **`Guild`** (§14.2.3) | mỗi shard | chỗ làm, ca | đã có trong kế hoạch P2 |
| **`Market`** (mới) | mỗi shard | lệnh ký gửi, giá khớp, giá tham chiếu, cầu NPC theo vùng, hợp đồng sỉ | alarm mỗi giờ tính cầu vùng |
| **`Venue`** (mới) | `idFromName('venue:'+id)` | một mặt bằng: ví tiệm, kho, nhân sự, sổ lãi lỗ, giấy phép, danh tiếng | alarm mỗi giờ (khách NPC) và giờ Tý (chốt sổ, phá sản) |
| **`Civil`** (mới, Nha Môn) | toàn cục | hôn thú, giấy phép, thửa ruộng, chủ mặt bằng, đấu giá, điều luật kinh tế | lưu lượng thấp, một bản đủ |
| **`Divination`** (mới) | toàn cục | thầy mệnh lý, lượt xem, két giữ, kết quả trọng tài, hàng đợi duyệt | gọi LLM qua gateway `/zai` có sẵn |
| **`Risk`** (mới) | toàn cục | đồ thị quan hệ (`relgraph`), cờ nghi vấn, ngưỡng tích lũy | mọi DO khác báo sự kiện chuyển tiền vào đây |

**Chuyển tiền giữa hai DO** (ví dụ người chơi A mua hàng ký gửi của B ở `Market`):
- Dùng **giao dịch hai pha có khóa idempotency** `xfer_id`:
  1. `Player(A).hold(xfer_id, amt)`;
  2. `Market.settle(xfer_id)`;
  3. `Player(B).credit(xfer_id, amt)`;
  4. `Player(A).commit(xfer_id)`.
- Lỗi giữa chừng thì `release(xfer_id)`. Gọi lại cùng `xfer_id` không trừ hai lần.
- Mỗi bước ghi vào sổ cái của DO đó.

### 31.4.2 Sổ cái tiền (mọi DO có ví)

```sql
-- mọi biến động tiền đều có một dòng; số dư = SUM theo tài khoản; không có UPDATE số dư "chay"
CREATE TABLE ledger (
  id        TEXT PRIMARY KEY,           -- ULID
  xfer_id   TEXT NOT NULL,              -- khóa idempotency, chung cho hai đầu một giao dịch
  acct      TEXT NOT NULL,              -- 'u:<uid>' | 'venue:<id>' | 'escrow:<id>' | 'sink:<lý do>' | 'npc:<vùng>'
  delta     INTEGER NOT NULL,           -- xu, âm = chi
  reason    TEXT NOT NULL,              -- 'job','food','rent','tax','wedding','divorce','bazi_fee','bazi_tax','market','b2b','wage','share','fine','auction'…
  ref       TEXT,                       -- id đối tượng liên quan (hôn thú, lượt xem, lệnh chợ…)
  peer      TEXT,                       -- tài khoản phía bên kia (cho đồ thị quan hệ)
  at        INTEGER NOT NULL            -- ms
);
CREATE UNIQUE INDEX ledger_once ON ledger(xfer_id, acct);
```

### 31.4.3 Lược đồ SQLite theo DO

**`Civil` — hôn nhân** (thay bảng `marriages` của bản gốc):

```sql
CREATE TABLE marriage (
  id           TEXT PRIMARY KEY,                      -- ULID
  a_uid        TEXT NOT NULL, b_uid TEXT NOT NULL,    -- a_uid < b_uid (chuẩn hóa thứ tự)
  status       TEXT NOT NULL CHECK (status IN ('BETROTHED','REGISTERED','DIVORCING','DIVORCED','DISSOLVED')),
  tier         TEXT NOT NULL CHECK (tier IN ('DESTITUTE','MIDDLE','LUXURY')),
  fee_paid     INTEGER NOT NULL DEFAULT 0,            -- xu
  joint_spend  INTEGER NOT NULL DEFAULT 0,            -- 0/1 chi tiêu chung
  proposed_at  INTEGER NOT NULL, registered_at INTEGER, divorce_filed_at INTEGER, divorced_at INTEGER,
  divorce_kind TEXT CHECK (divorce_kind IN ('MUTUAL','UNILATERAL')),
  filed_by     TEXT
);
-- một vợ một chồng: mỗi uid có tối đa 1 hôn thú đang hiệu lực
CREATE TABLE spouse_lock (uid TEXT PRIMARY KEY, marriage_id TEXT NOT NULL);
CREATE TABLE joint_asset (
  marriage_id TEXT NOT NULL, asset_kind TEXT NOT NULL,   -- 'house','vehicle','venue','chest_item'
  asset_id    TEXT NOT NULL, a_share INTEGER NOT NULL,   -- phần nghìn góp của a (0–1000)
  added_at    INTEGER NOT NULL, PRIMARY KEY (marriage_id, asset_kind, asset_id)
);
CREATE TABLE remarry_cooldown (uid TEXT PRIMARY KEY, until INTEGER NOT NULL, count_365 INTEGER NOT NULL);
```

**`Divination` — dịch vụ mệnh lý** (thay bảng `bazi_consultations`):

```sql
CREATE TABLE practitioner (
  uid TEXT PRIMARY KEY, rank TEXT NOT NULL CHECK (rank IN ('SO','TRUNG','CAO')),
  bond INTEGER NOT NULL, rep INTEGER NOT NULL DEFAULT 50, price INTEGER NOT NULL,
  strikes_30d INTEGER NOT NULL DEFAULT 0, suspended_until INTEGER
);
CREATE TABLE consultation (
  id            TEXT PRIMARY KEY,
  practitioner  TEXT NOT NULL, client TEXT NOT NULL,
  query         TEXT NOT NULL,                     -- ≤ 500 ký tự
  profile_json  TEXT,                              -- hồ sơ rút gọn + tứ trụ (§12.6.3); XÓA (NULL) 30 ngày sau khi chốt hoặc khi xóa tài khoản
  consent_at    INTEGER NOT NULL,                  -- lúc khách bấm đồng ý chia sẻ tứ trụ (Quyết định 7)
  analysis      TEXT,                              -- lời luận; giữ 30 ngày rồi chỉ giữ băm MinHash
  minhash       BLOB,
  fee           INTEGER NOT NULL, tax_rate INTEGER NOT NULL,   -- phần trăm
  client_verdict TEXT CHECK (client_verdict IN ('OK','BAD','SILENT')),
  l0_flags      TEXT,                              -- 'COPY,FACT_MISMATCH,…'
  ai_score      INTEGER,                           -- logic 1–10
  ai_json       TEXT,                              -- đầu ra đầy đủ của trọng tài
  status        TEXT NOT NULL CHECK (status IN ('ESCROW','AWAIT_ANALYSIS','AWAIT_VERDICT','REVIEW','PAID','PARTIAL','REFUNDED','REJECTED_FRAUD')),
  created_at INTEGER NOT NULL, answered_at INTEGER, settled_at INTEGER
);
CREATE INDEX consult_pair ON consultation(client, practitioner, created_at);   -- luật 1 lượt / 7 ngày
```

**`Player` — kho đồ, công thức:**

```sql
CREATE TABLE item_def (            -- nạp tĩnh từ mã (items-food.js…), không do người chơi tạo
  code TEXT PRIMARY KEY, kind TEXT NOT NULL,     -- 'raw','dish','tool','cloth','fertilizer','ice'
  tier INTEGER, decay_h INTEGER, base_price INTEGER NOT NULL,
  full INTEGER, wake INTEGER, hp INTEGER, buff TEXT, origin_zone TEXT, element TEXT
);
CREATE TABLE inv (
  id TEXT PRIMARY KEY, code TEXT NOT NULL, qty INTEGER NOT NULL,
  place TEXT NOT NULL,              -- 'bag' | 'home' | 'cold:<id>'
  fresh_used REAL NOT NULL DEFAULT 0,  -- phần tươi đã tiêu tới mốc settled_at (0–1)
  settled_at INTEGER NOT NULL,         -- tính lười §17.5.1
  quality REAL, chef_u TEXT,           -- món: chất lượng, ấn ký
  durability INTEGER                   -- đồ nghề
);
CREATE TABLE player_recipe (        -- công thức bí truyền: khóa theo tài khoản, không có vật phẩm tương ứng
  recipe TEXT PRIMARY KEY, master TEXT NOT NULL, unlocked_at INTEGER NOT NULL, cooked INTEGER NOT NULL DEFAULT 0
);
```

**Định nghĩa công thức** (tĩnh trong mã, `recipes.js`, thay bảng `recipes` + `recipe_ingredients`):

```js
// recipe: { id, name, tier 1–3, element, minAptitude (Thực căn), soulbound, master?, out: code món,
//           full, wake, decayH, ingredients: [{ code, qty }], station: 'stall'|'diner'|'fine' }
```

Công thức là dữ liệu thiết kế nên để trong mã (có test, có review), không để trong cơ sở dữ liệu sửa tay. Chỉ trạng thái mở khóa của người chơi mới nằm trong DO.

**`Venue` — mặt bằng** (thay bảng `commercial_restaurants`):

```sql
CREATE TABLE venue (
  id TEXT PRIMARY KEY, zone TEXT NOT NULL,            -- 'song','noido','thonda','mo'
  tier TEXT NOT NULL CHECK (tier IN ('STALL','DINER','FINE')),
  owner_uid TEXT, tenure TEXT CHECK (tenure IN ('RENT','OWN')),
  rent_daily INTEGER NOT NULL, cold_daily INTEGER NOT NULL, upkeep_daily INTEGER NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,                 -- ví tiệm (văn) — bản tóm tắt của ledger
  capacity INTEGER NOT NULL, reputation INTEGER NOT NULL DEFAULT 30,
  license_until INTEGER, last_inspect INTEGER, open INTEGER NOT NULL DEFAULT 0,
  neg_days INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL DEFAULT 'OK' CHECK (state IN ('OK','WARN','SEALED','AUCTION'))
);
CREATE TABLE venue_menu  (code TEXT PRIMARY KEY, price INTEGER NOT NULL, on_sale INTEGER NOT NULL DEFAULT 1);
CREATE TABLE venue_staff (uid TEXT PRIMARY KEY, role TEXT NOT NULL, pay_rule TEXT NOT NULL, share_pct INTEGER, until INTEGER);
CREATE TABLE venue_day   (day TEXT PRIMARY KEY, revenue INTEGER, fixed INTEGER, variable INTEGER, tax INTEGER, npc_guests INTEGER, pc_guests INTEGER, waste INTEGER);
```

**`Market` và `Risk`** (rút gọn):

```sql
CREATE TABLE listing (id TEXT PRIMARY KEY, seller TEXT, code TEXT, qty INTEGER, price INTEGER, market TEXT, inv_snapshot TEXT, at INTEGER, state TEXT);
CREATE TABLE trade   (id TEXT PRIMARY KEY, listing TEXT, buyer TEXT, qty INTEGER, price INTEGER, ref_price INTEGER, held INTEGER, at INTEGER);
CREATE TABLE ref_price (code TEXT PRIMARY KEY, median7 INTEGER, updated INTEGER);
CREATE TABLE b2b (id TEXT PRIMARY KEY, seller TEXT, buyer TEXT, code TEXT, qty_day INTEGER, price INTEGER, deposit INTEGER, start INTEGER, days INTEGER, state TEXT);
-- Risk
CREATE TABLE edge (a TEXT, b TEXT, kind TEXT, n30 INTEGER, sum30 INTEGER, last INTEGER, PRIMARY KEY (a, b, kind));   -- a < b
CREATE TABLE flag (id TEXT PRIMARY KEY, subject TEXT, reason TEXT, ref TEXT, state TEXT, at INTEGER);
CREATE TABLE block_pair (a TEXT, b TEXT, scope TEXT, PRIMARY KEY (a, b, scope));
```

### 31.4.4 Gói mạng & API mới

**WebSocket** (`protocol.js`, kiểm dạng như các gói hiện có):
- `inv_get`, `inv_move {id, place}`, `eat {id}`, `cook {recipe, inputs[], perf, proof}`
- `mkt_list {code, qty, price}`, `mkt_buy {listing, qty}`, `mkt_cancel`, `b2b_offer`, `b2b_accept`
- `venue_open`, `venue_close`, `venue_menu {code, price}`, `venue_hire {uid, role, rule}`, `venue_withdraw {amt}`
- `farm_sow {plot, crop}`, `farm_water {plot}`, `farm_harvest {plot}`, `pen_feed {pen}`, `slaughter {animal}`
- `propose {to}` (cụm từ soạn sẵn), `propose_ok`, `wed_invite {to[]}`

**HTTP** (Worker, cần đăng nhập, theo mẫu `/api/auth/*`):

```
POST /api/civil/marry · /api/civil/divorce · /api/civil/divorce/respond · GET /api/civil/me
POST /api/civil/license · /api/civil/plot · GET /api/civil/auctions · POST /api/civil/bid
GET  /api/bazi/masters · POST /api/bazi/book · POST /api/bazi/answer · POST /api/bazi/verdict · GET /api/bazi/mine
GET  /api/admin/risk/flags · POST /api/admin/risk/resolve · GET /api/admin/bazi/review · POST /api/admin/bazi/decide
```

## 31.5 Dữ liệu, gói mạng, phân công

> **Trạng thái:** `[ĐÃ CÓ]` (P14–P17).

### 31.5.1 Bố trí dữ liệu (thay lược đồ PostgreSQL của bản gốc)

- **Danh mục phép di chuyển và vật cưỡi:** tĩnh trong mã, như `cosmetics.js`.
  - Thêm `src/game/movement.js`: `{ id, type: 'WATER_WALK'|'FLIGHT', source: 'SKILL'|'VIP_ITEM'|'QUEST_ITEM'|'MOUNT', pose, motion, vfx, sound, staminaPerSec, unlock }`.
  - Cột `unique_rig_identifier` / `animation_bundle_path` / `custom_vfx_particle_path` của bản gốc thành khóa tới gói tư thế / hàm chuyển động / hiệu ứng trong mã. Không còn đường dẫn file rời.
- **Sở hữu:** vật cưỡi đã nằm trong tủ đồ (`wardrobe`). Phép thân pháp đã học lưu trong hồ sơ người chơi. Lên máy chủ cùng Player DO (P8).
- **Âm Đức:** máy chủ giữ, vì nó chạm tới rủi ro việc làm. Trước P8 lưu trong hồ sơ nghề ở Guild DO (`c:<u>`), P8 chuyển sang Player DO.

```sql
-- Player DO (SQLite) — thay player_daily_blessing của bản gốc
CREATE TABLE blessing (
  u            TEXT PRIMARY KEY,
  score        INTEGER NOT NULL DEFAULT 0,      -- Âm Đức (có thể âm)
  streak       INTEGER NOT NULL DEFAULT 0,      -- chuỗi ngày điều độ
  paused       INTEGER NOT NULL DEFAULT 0,      -- 1 = vừa đứt, chờ 2 ngày điều độ để bật lại
  tier         INTEGER NOT NULL DEFAULT 0 CHECK (tier BETWEEN 0 AND 4),
  last_day     TEXT,                            -- ngày giờ Việt Nam (YYYY-MM-DD)
  day_minutes  INTEGER NOT NULL DEFAULT 0, day_meals INTEGER NOT NULL DEFAULT 0, day_slept INTEGER NOT NULL DEFAULT 0,
  save_ready   INTEGER NOT NULL DEFAULT 0       -- cấp 4: còn lượt thoát chết
);
CREATE TABLE blessing_log (id TEXT PRIMARY KEY, u TEXT NOT NULL, delta INTEGER NOT NULL, reason TEXT NOT NULL, at INTEGER NOT NULL);
CREATE TABLE skill (u TEXT NOT NULL, id TEXT NOT NULL, learned_at INTEGER NOT NULL, PRIMARY KEY (u, id)); -- thân pháp đã học
```

### 31.5.2 Gói mạng

- `mv` thêm:
  - `w` — trạng thái nước: 0 cạn · 1 lội · 2 bơi · 3 đạp nước · 4 trên thuyền.
  - `fx` — kiểu dấu chân.
  - `fs` — trạng thái bay 0–5.
- `bless_day {q}` (vào ngày: quẻ + tiến độ điều độ) · `bless_tick {q, minutes, meal?, slept?}` → `bless_res {score, streak, tier, saveReady}`.
- `bless_save {q, cause}`: xin dùng lượt thoát chết. Máy chủ kiểm cấp 4 và lượt còn, rồi trừ.

## 31.6 Dữ liệu, chuyển đổi, lộ trình

> **Trạng thái:** `[ĐÃ CÓ]` (P18–P21); lưu trữ hiện ở máy người chơi, chưa lên `Player`.

### 31.6.1 Lưu trữ (máy chủ quyết — Player DO, P8; trước P8 lưu tạm trên máy như ví «văn» của P1)

```sql
-- tiền: mọi cột tiền ở §31.4.3 đổi đơn vị sang XU (số nguyên); ledger.delta tính bằng xu
CREATE TABLE huyenhoc (
  u            TEXT PRIMARY KEY,
  phuc         INTEGER NOT NULL DEFAULT 0,   -- Phúc Khí đang có (tiêu được)
  phuc_life    INTEGER NOT NULL DEFAULT 0,   -- Phúc Khí tích lũy (mọi kiếp) → cảnh giới
  phuc_kiep    INTEGER NOT NULL DEFAULT 0,   -- tích lũy kiếp này (đem cân)
  amduc        REAL    NOT NULL DEFAULT 0,   -- Âm Đức
  nghiep       REAL    NOT NULL DEFAULT 0,   -- Nghiệp Lực
  realm        INTEGER NOT NULL DEFAULT 0,   -- cảnh giới đã đột phá (0 Phàm Nhân … 6 Đắc Đạo)
  kiep         INTEGER NOT NULL DEFAULT 1,   -- kiếp thứ mấy
  state        TEXT    NOT NULL DEFAULT 'alive' CHECK (state IN ('alive','underworld','beast','ghost','hell','ascended')),
  state_until  INTEGER,                      -- hết đoạn chơi cõi dưới
  hex_ward     INTEGER                       -- giải hạn tới thời điểm (ms)
);
CREATE TABLE karma_log (id TEXT PRIMARY KEY, u TEXT NOT NULL, phuc INTEGER, amduc REAL, nghiep REAL, reason TEXT NOT NULL, ref TEXT, at INTEGER NOT NULL);
CREATE TABLE life (                           -- Sổ Luân Hồi
  u TEXT NOT NULL, kiep INTEGER NOT NULL, name TEXT, pillars TEXT,     -- lá số HƯ CẤU của nhân vật kiếp đó
  realm INTEGER, born INTEGER, died INTEGER, cause TEXT, path TEXT,    -- path: thien | asura | nhan | sucsinh | ngaquy | diaguc
  deeds TEXT, PRIMARY KEY (u, kiep)
);
CREATE TABLE skill_tier (u TEXT NOT NULL, id TEXT NOT NULL, tier INTEGER NOT NULL, PRIMARY KEY (u, id));
CREATE TABLE estate_will (u TEXT PRIMARY KEY, coins INTEGER NOT NULL, items TEXT, house INTEGER, ready_at INTEGER);  -- di sản chờ nhận
```

### 31.6.2 Chuyển đổi người chơi đang có

- **Phúc Khí đang có** giữ nguyên làm Phúc Khí Huyền học (học pháp môn, giải hạn). Cấp / xp giữ, đặt tên cảnh giới theo bảng §18.4.1. Ai đã quá ranh giới cảnh giới coi như đã đột phá (không bắt làm lại).
- **Đồ, y phục, nhà đã mua** giữ nguyên.
- **Ví «văn» của P1** đổi sang xu: × 100, phần lẻ `vanFrac` thành xu.
- **Bồi hoàn một lần:** Phúc Khí không còn mua sắm được, nên mỗi người nhận «lộc đổi chế độ» = 10% Phúc Khí đang có, quy ra đồng (× 4), trần 2 lượng bạc. Phúc Khí không bị trừ.
- **Ngọc miễn phí bỏ ngay:** người đang dở chuỗi điểm danh nhận nốt quà hôm nay rồi chuyển sang quẻ đầu ngày.

## 31.7 Phần đang chạy thêm hoặc khác đặc tả

`[ĐÃ CÓ]` (nhật ký 10–14/11)

| Điểm | Đang chạy |
|---|---|
| **Vé WebSocket** | dùng một lần, sống rất ngắn; phòng đổi vé lấy tài khoản; khách vẫn dùng mã khách |
| **Liên kết khách → tài khoản** | căn nhà mua bằng mã khách chuyển sang tài khoản |
| **Lưu mây** | lọc mọi ngày giờ sinh ở client, máy chủ lọc lại và từ chối nếu còn sót; có số phiên bản chống ghi đè; chia mảnh; có trần dung lượng; gom mỗi 20 giây |
| **Tuổi tài khoản** | `Economy` hỏi `Accounts` ngày tạo để mở nghề thầy mệnh lý và kết hôn (QĐ-21) |
| **Tua đồng hồ để kiểm két** | chỉ có hiệu lực trên máy dev (`AUTH_DEV`); bản thật không có biến này |
| **Khoá Dụng thần** | 30 ngày, ở `Guild` |
| **Đổi bố cục thành** | `Guild` bỏ chỗ giữ theo khoá cũ một lần khi phiên bản bố cục tăng |
| **Bảng quản trị kinh tế** | dòng tiền bơm và hút theo ngày, giá tham chiếu, quán mở và niêm phong, hàng đợi duyệt lời luận |
| **Chặn máy tự động** | Worker chặn một số trình duyệt không đầu; test trên bản thật phải dùng chuỗi nhận dạng thường |

## 31.8 Bảo mật và riêng tư

`[ĐÃ CÓ]`; lỗ còn mở ghi rõ.

- **Đã có:** không mật khẩu; mã một lần chỉ lưu băm; giới hạn tần suất theo địa chỉ và theo IP; cookie phiên chỉ máy chủ đọc; chặn yêu cầu ghi từ nguồn lạ; lọc tên; lọc ngày sinh hai lớp; xoá tài khoản sau bảy ngày, xuất dữ liệu; chỉ dùng băm IP, không lấy vân tay thiết bị.
- **Còn mở:** trạng thái người chơi nằm ở bộ nhớ trình duyệt nên sửa được (ví, chỉ số sinh tồn, Phúc Khí) → `VC-013`; khách không xác thực vẫn giữ được chỗ làm trong một số trường hợp (§14.2.4); bí mật bản thật do chủ dự án cấu hình tay.

## 31.9 Liên kết, kiểm thử, việc mở

| Hệ | Sổ | Chương |
|---|---|---|
| Xã hội | phòng, gói xã giao | §20 |
| Nhà | `Estate` | §15.2.2 |
| Việc làm | `Guild` | §14.2 |
| Kinh tế, hôn nhân, thầy mệnh lý, trí nhớ NPC | `Economy` | §17, §20.2, §12.6, §21.3 |
| Tài khoản | `Accounts` | §31.2 |

- `test-quan-protocol` (15) và `test-game-auth` (8) chạy thuần. Ba bộ còn lại cần `npm run dev:mmo` (§32).
- Việc mở: `VC-013`, `VC-014`, `VC-015`, `VC-016`, `VC-021`.
