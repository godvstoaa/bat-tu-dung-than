# 10 · Phần 12 — Hạ tầng máy chủ: SectHall, EventHub, D1, lưu trữ, co giãn, lạm dụng

> Căn cứ code thật: `worker/quan-room.js` (`TownShard extends DurableObject`, `ctx.acceptWebSocket`, `serializeAttachment` / `deserializeAttachment`, `ctx.getWebSockets()`, báo cáo trong `ctx.storage`), `worker/index.js` (route `/ws/quan`, `env.QUAN.idFromName('town-' + room)`, kiểm Origin, giới hạn AI 30 lần/phút/IP), `wrangler.jsonc` (`durable_objects.bindings: [{ name: 'QUAN', class_name: 'TownShard' }]`, `migrations: [{ tag: 'quan-v1', new_sqlite_classes: ['TownShard'] }]`, `kv_namespaces: ADMIN_KV`), `scripts/dev-mmo.mjs` (junction ASCII vì workerd trên Windows sập khi đường dẫn có dấu), `scripts/test-quan-mmo.mjs` (10 test tích hợp WebSocket thật), `scripts/test-quan-protocol.mjs`.
>
> Bản sơ đồ §13.2: «Môn phái, sư đồ — máy chủ: Durable Object mới `SectHall` (P2)»; §13.4 M6: «Môn phái, sư đồ, mùa đầu tiên — tải 60 người / phòng (đã có test)».

## 12.0 Kiến trúc tổng

```
                       ┌────────────────────────── Cloudflare Worker (worker/index.js) ──────────────────────────┐
 Client (web / iOS)    │  /ws/quan?room=N   → TownShard  «town-N»        (đã có; ≤ 60 người; N < 50)             │
  net.js               │  /ws/sect?h=HID    → SectHall   «sect-HID»      (mới; ≤ 30 người trong đạo tràng)        │
  net-sect.js (mới)    │  /api/quan/*       → HTTP: danh tính, đạo hữu, thư, bảng, quan hệ, riêng tư, xuất dữ liệu │
                       │  Cron Trigger      → tính bảng, chốt kỳ, giờ Tý (Phần 07 §7.7), dọn dữ liệu hết hạn       │
                       └───────────┬──────────────────────┬───────────────────────┬──────────────────────────────┘
                                   │ RPC                  │ RPC                   │ SQL
                         ┌─────────▼────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
                         │ EventHub «ev-ID» │   │ SectHall «sect-*» │   │ D1  QUAN_DB       │
                         │ (mới; 1/sự kiện) │◄──┤ (SQLite trong DO) │──►│ hồ sơ, quan hệ,   │
                         └─────────┬────────┘   └───────────────────┘   │ sổ ĐH, bảng, báo  │
                                   │ RPC fan-out (≤ 50 phòng)            │ cáo, nhật ký      │
                         ┌─────────▼────────┐                            └───────────────────┘
                         │ TownShard ×50    │── RPC notify(uid, msg) ◄── HTTP API (đẩy lời mời, thư mới)
                         └──────────────────┘
```

| Thành phần | Kiểu | Số lượng | Nguồn sự thật cho |
|---|---|---|---|
| `TownShard` | Durable Object (đã có) | ≤ `MAX_ROOMS` = 50 | vị trí, phòng, nhóm đồng hành, đồng tu, lễ tiết trong phòng, kiểm vị trí cho sự kiện |
| `SectHall` | Durable Object mới (SQLite) | 1 / chi đường | thành viên, cấp bậc, chức sự, kho, nghị sự, công trình, lễ đường, việc tuần, bảng tin |
| `EventHub` | Durable Object mới (SQLite) | 1 / sự kiện máy chủ đang chạy (`EV-TMB-xx` (xx = số thứ tự mùa), `EV-CAU`, `EV-DL-*`) | tiến độ chung, trần công / người / ngày, pha |
| D1 `QUAN_DB` | cơ sở dữ liệu SQL | 1 | tài khoản, hồ sơ, quan hệ, thư, quà, sổ Đạo Hạnh, bảng, báo cáo, kiểm duyệt, danh bạ chi đường |
| `ADMIN_KV` | KV (đã có) | 1 | cờ tính năng `feats`, danh sách đen tên, cấu hình lễ ⚠ |

**Vì sao chi đường là DO riêng chứ không phải bảng D1:** chi đường cần **thời gian thực** (30 người cùng làm lễ, vác vật liệu, bỏ phiếu thấy ngay) và **tuần tự hóa** (hai người cùng rút kho không được vượt hạn mức). DO đơn luồng cho tuần tự hóa tự nhiên; D1 chỉ nhận bản sao để tìm kiếm và xếp hạng.

---

## 12.1 Lược đồ D1 `QUAN_DB`

```sql
-- Danh tính ------------------------------------------------------------------
CREATE TABLE account (
  uid        TEXT PRIMARY KEY,              -- 12 ký tự base32, máy chủ cấp
  ab         TEXT NOT NULL CHECK (ab IN ('T','A')),
  created_at INTEGER NOT NULL,
  status     TEXT NOT NULL DEFAULT 'ok',    -- ok | mmo_banned | deleted
  apple_sub  TEXT UNIQUE                    -- Sign in with Apple (tùy chọn)
);
CREATE TABLE device (
  uid        TEXT NOT NULL REFERENCES account(uid),
  pid_hash   TEXT NOT NULL,                 -- SHA-256(pepper + pid)
  sk_hash    TEXT NOT NULL,                 -- SHA-256(pepper + sk)
  created_at INTEGER NOT NULL,
  last_at    INTEGER,
  PRIMARY KEY (uid, pid_hash)
);
CREATE INDEX device_pid ON device(pid_hash);

-- Hồ sơ công khai (KHÔNG có ngày sinh, KHÔNG có Tiên Thiên) ------------------
CREATE TABLE profile (
  uid      TEXT PRIMARY KEY REFERENCES account(uid),
  name     TEXT NOT NULL,                   -- đã qua cleanName
  tu       TEXT,                            -- tên tu ghép từ danh sách
  mon      TEXT,                            -- 'CN'…'NH' | NULL
  kiem     TEXT,                            -- tông kiêm tu, JSON mảng ≤ 2
  realm    INTEGER NOT NULL DEFAULT 1,      -- cảnh giới 1–6
  phai     TEXT,                            -- học phái (PHAI) cho Giải Tiết Khí
  sect_hid TEXT,                            -- chi đường hiện tại
  regions  TEXT,                            -- JSON vùng đã mở (kiểm slot {vung})
  priv     TEXT NOT NULL DEFAULT '{}',      -- cài đặt riêng tư (Phần 11 §11.4.6)
  updated_at INTEGER
);

CREATE TABLE presence (                      -- cập nhật khi vào/rời phòng + nhịp 60 s
  uid TEXT PRIMARY KEY, room INTEGER, sect_hid TEXT, vung TEXT, at INTEGER
);

-- Quan hệ --------------------------------------------------------------------
CREATE TABLE friend (
  a TEXT NOT NULL, b TEXT NOT NULL, since INTEGER NOT NULL, via TEXT,   -- via: room|code|party
  PRIMARY KEY (a, b)                          -- lưu hai chiều (a,b) và (b,a)
);
CREATE TABLE friend_req (from_uid TEXT, to_uid TEXT, at INTEGER, via TEXT, PRIMARY KEY (from_uid, to_uid));
CREATE TABLE friend_code (uid TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, rotated_at INTEGER);
CREATE TABLE block (uid TEXT NOT NULL, target TEXT NOT NULL, at INTEGER, PRIMARY KEY (uid, target));

CREATE TABLE mentor (
  sid TEXT PRIMARY KEY, master TEXT NOT NULL, disciple TEXT NOT NULL,
  started INTEGER, ended INTEGER, state TEXT,             -- active|away|graduated|ended
  vow_m INTEGER, vow_d INTEGER
);
CREATE TABLE mentor_merit (sid TEXT, week TEXT, cong INTEGER, PRIMARY KEY (sid, week));  -- trần 60/tuần

CREATE TABLE kimlan (kid TEXT PRIMARY KEY, name TEXT UNIQUE, oath INTEGER, formed INTEGER, dissolved INTEGER);
CREATE TABLE kimlan_member (kid TEXT, uid TEXT, ord INTEGER, xung TEXT, PRIMARY KEY (kid, uid));

CREATE TABLE partner (                        -- KHÔNG lưu thẻ hợp hôn, KHÔNG lưu điểm
  did TEXT PRIMARY KEY, a TEXT, b TEXT, mode TEXT, vow_a INTEGER, vow_b INTEGER,
  formed INTEGER, ended INTEGER
);

CREATE TABLE share (                          -- công khai căn cốt
  owner TEXT, viewer TEXT, lvl INTEGER, data TEXT, exp INTEGER,
  PRIMARY KEY (owner, viewer)                 -- viewer: uid | 'friends' | 'sect' | 'room'
);

-- Thư, quà -------------------------------------------------------------------
CREATE TABLE mail (
  mid TEXT PRIMARY KEY, to_uid TEXT NOT NULL, from_uid TEXT NOT NULL,
  h TEXT NOT NULL, b TEXT NOT NULL,           -- mã cụm từ (JSON), không văn bản tự do
  gift TEXT, at INTEGER NOT NULL, read INTEGER DEFAULT 0
);
CREATE INDEX mail_to ON mail(to_uid, at DESC);
CREATE TABLE gift_log (from_uid TEXT, to_uid TEXT, item TEXT, at INTEGER, ctx TEXT);
CREATE INDEX gift_from ON gift_log(from_uid, at);
CREATE INDEX gift_to   ON gift_log(to_uid, at);

-- Đạo Hạnh, bảng ------------------------------------------------------------
CREATE TABLE dh_ledger (
  uid TEXT NOT NULL, src TEXT NOT NULL, amount REAL NOT NULL, verified INTEGER NOT NULL,
  ref TEXT, season TEXT NOT NULL, at INTEGER NOT NULL
);
CREATE INDEX dh_season ON dh_ledger(season, uid);
CREATE TABLE case_score (uid TEXT, term TEXT, slot INTEGER, date TEXT, points REAL, ms INTEGER, phai TEXT,
  PRIMARY KEY (uid, date, slot));
CREATE TABLE lb_snapshot (board TEXT, period TEXT, rank INTEGER, uid TEXT, value REAL, at INTEGER,
  PRIMARY KEY (board, period, rank));
CREATE TABLE lb_flag (uid TEXT, board TEXT, period TEXT, rule TEXT, decision TEXT, by TEXT, at INTEGER);

-- Chi đường (bản sao từ SectHall để tìm kiếm / xếp hạng) ---------------------
CREATE TABLE sect (
  hid TEXT PRIMARY KEY, tong TEXT NOT NULL, name TEXT NOT NULL, tier INTEGER, members INTEGER,
  open INTEGER, min_realm INTEGER, min_age INTEGER, has_teen INTEGER,
  dv_month REAL, dv_season REAL, state TEXT, updated_at INTEGER,
  UNIQUE (tong, name)
);
CREATE TABLE sect_member (hid TEXT, uid TEXT, rank INTEGER, joined INTEGER, PRIMARY KEY (hid, uid));

-- Sự kiện --------------------------------------------------------------------
CREATE TABLE event (id TEXT PRIMARY KEY, kind TEXT, season TEXT, phase TEXT, target REAL, done REAL,
  starts INTEGER, ends INTEGER, meta TEXT);
CREATE TABLE event_contrib (id TEXT, uid TEXT, day TEXT, cong REAL, PRIMARY KEY (id, uid, day));
CREATE TABLE road_segment (seg TEXT PRIMARY KEY, road TEXT, hu REAL, updated_at INTEGER);  -- 156 đoạn (Phần 08 §8.2.1)

-- An toàn --------------------------------------------------------------------
CREATE TABLE report (
  rid TEXT PRIMARY KEY, by_uid TEXT, target TEXT, why TEXT, ctx TEXT, evidence TEXT,
  weight REAL, at INTEGER, state TEXT DEFAULT 'open', priority TEXT
);
CREATE INDEX report_open ON report(state, priority, at);
CREATE TABLE mod_action (aid TEXT PRIMARY KEY, target TEXT, level INTEGER, why TEXT, until INTEGER,
  by TEXT, rid TEXT, at INTEGER);
CREATE TABLE appeal (pid TEXT PRIMARY KEY, uid TEXT, aid TEXT, reason TEXT, state TEXT, at INTEGER);
```

**Rà riêng tư bằng test tĩnh:** không cột nào tên chứa `birth`, `sinh`, `dob`, `hour`, `pillars` ngoài `share.data` (mức L4 người chơi tự chia sẻ cho người cụ thể, có hạn).

### 12.1.1 Ước lượng dung lượng (10.000 người chơi hoạt động)

| Bảng | Dòng | Kích thước ước |
|---|---|---|
| `account`, `device`, `profile`, `presence` | ~30.000 mỗi bảng (tính cả tài khoản không hoạt động) | < 30 MB |
| `friend` | 10.000 × 40 × 2 = 800.000 | ~60 MB |
| `mail` (giữ 30 ngày) | ~300.000 | ~40 MB |
| `gift_log` (90 ngày) | ~2.700.000 | ~200 MB |
| `dh_ledger` (mùa) | 10.000 × 6 lần / ngày × 365 ≈ 22.000.000 | **~1,5 GB** → gộp theo ngày (§12.1.2) |
| `report` | ~200 / ngày × 180 ngày = 36.000 | ~50 MB (bằng chứng JSON) |

### 12.1.2 Gộp sổ Đạo Hạnh

`dh_ledger` ghi từng lần trong **ngày hiện tại**; giờ Tý, Cron gộp ngày hôm qua thành một dòng / `(uid, src, verified, day)` → giảm ~6 lần. Dòng chi tiết giữ 7 ngày để điều tra gian lận, sau đó xóa.

---

## 12.2 Danh tính và xác thực (thực thi)

| Bước | Chi tiết |
|---|---|
| Cấp | `POST /api/quan/id {pid, ab}` → sinh `uid` (12 ký tự base32 ngẫu nhiên), `sk` (32 byte), lưu `sk_hash = SHA-256(QUAN_PEPPER + sk)`; trả `sk` **một lần** |
| Lưu ở client | `localStorage huyenquan:sk` + `huyenquan:uid`; iOS: Keychain qua Capacitor (an toàn hơn `localStorage`) |
| Ký kết nối | `tok` (Phần 11 §11.1.2); máy chủ cần `sk` thô để kiểm HMAC → **lưu `sk` mã hóa** bằng khóa trong secret `QUAN_SK_KEY` (AES-GCM), không lưu thô; `sk_hash` dùng tra nhanh khi khôi phục |
| Thiết bị | ≤ 3 thiết bị / `uid`; thêm thiết bị bằng **mã ghép** (6 chữ số, 10 phút) hiện trên thiết bị cũ |
| Khôi phục | Sign in with Apple (`apple_sub`) — bắt buộc trên iOS nếu có đăng nhập bên thứ ba (Guideline 4.8); web: email khôi phục (tùy chọn, **câu hỏi mở**) |
| Thu hồi | xóa dòng `device`; mọi `tok` của thiết bị đó hết hiệu lực ngay ở lần kiểm sau |
| Tài khoản bị khóa MMO | `status = 'mmo_banned'` → TownShard đóng `CLOSE_BANNED` (4006); chơi đơn không ảnh hưởng |

Secret mới trong `wrangler` (không ghi vào `wrangler.jsonc`): `QUAN_PEPPER`, `QUAN_SK_KEY`.

---

## 12.3 `SectHall` — Durable Object chi đường

### 12.3.1 Định danh

`env.SECT.get(env.SECT.idFromName('sect-' + hid))`. `hid` = 10 ký tự base32 cấp khi lập chi đường (qua HTTP `POST /api/quan/sect/create` → Worker kiểm điều kiện Phần 01 §1.5.1 trên D1 → gọi `SectHall.init()` qua RPC).

### 12.3.2 Lược đồ SQLite trong DO

```sql
CREATE TABLE meta      (k TEXT PRIMARY KEY, v TEXT);   -- hid, tong, name, tier, dv, dv_month, aam_chat, huong_hoa, state, created_at, open, min_realm, min_age
CREATE TABLE member    (uid TEXT PRIMARY KEY, name TEXT, tu TEXT, rank INTEGER, joined INTEGER,
                        last INTEGER, rites INTEGER, ab TEXT, contrib TEXT);    -- contrib: JSON công lao bạ
CREATE TABLE role      (uid TEXT, role TEXT, since INTEGER, PRIMARY KEY (uid, role));
CREATE TABLE kho       (k TEXT PRIMARY KEY, v REAL);    -- phuc, go, da, ngoi, son, giay, muc, dong, tram
CREATE TABLE kho_log   (seq INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER, by TEXT, kind TEXT,
                        item TEXT, amt REAL, purpose TEXT, nid TEXT, rq TEXT UNIQUE);   -- append-only
CREATE TABLE give_day  (uid TEXT, day TEXT, phuc REAL, mat REAL, PRIMARY KEY (uid, day));
CREATE TABLE proposal  (nid TEXT PRIMARY KEY, tpl TEXT, args TEXT, by TEXT, opens INTEGER, closes INTEGER,
                        state TEXT, res TEXT, tally TEXT);
CREATE TABLE vote      (nid TEXT, uid TEXT, v INTEGER, at INTEGER, PRIMARY KEY (nid, uid));
CREATE TABLE plea      (nid TEXT, uid TEXT, k TEXT, PRIMARY KEY (nid, uid));
CREATE TABLE building  (bld TEXT PRIMARY KEY, variant TEXT, state TEXT, done_at INTEGER);
CREATE TABLE site      (ct TEXT PRIMARY KEY, bld TEXT, wave INTEGER, cong REAL, need REAL, timer_end INTEGER, nid TEXT);
CREATE TABLE carry_day (uid TEXT, day TEXT, n INTEGER, PRIMARY KEY (uid, day));
CREATE TABLE rite      (rid TEXT PRIMARY KEY, kind TEXT, at INTEGER, phase TEXT, variant TEXT, zheri INTEGER,
                        q REAL, n INTEGER, hoi TEXT, counted INTEGER);
CREATE TABLE rite_part (rid TEXT, uid TEXT, spot INTEGER, score REAL, full INTEGER, role TEXT, PRIMARY KEY (rid, uid));
CREATE TABLE weekly    (week TEXT, q TEXT, pct REAL, PRIMARY KEY (week, q));
CREATE TABLE weekly_by (week TEXT, q TEXT, uid TEXT, v REAL, PRIMARY KEY (week, q, uid));
CREATE TABLE board     (seq INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER, by TEXT, k TEXT, p TEXT);
CREATE TABLE ally      (hid TEXT PRIMARY KEY, since INTEGER);
CREATE TABLE sect_log  (seq INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER, by TEXT, act TEXT, detail TEXT);  -- «Sổ Đường»
```

`kho_log`, `sect_log` là **append-only** — không có câu lệnh `UPDATE` / `DELETE` nào trong mã SectHall chạm hai bảng này (test tĩnh).

### 12.3.3 Vòng đời và báo thức (alarm)

DO chỉ có **một** alarm tại một thời điểm. SectHall giữ một hàng đợi hẹn giờ trong bảng `meta` (`timers` JSON) và đặt alarm cho mốc gần nhất:

| Mốc | Việc khi alarm chạy |
|---|---|
| Pha lễ kế tiếp | phát `rite_phase`; khi `end`: tính `q`, `n`, Đạo Vọng, Hương Hỏa, ghi Đạo Hạnh (RPC tới Worker → D1 `dh_ledger`) |
| Nghị sự đóng | đếm phiếu, áp kết quả (vd `NS-07` → mời ra; `NS-12` → hẹn hưu đường sau 7 ngày), phát `ns_close` |
| Đợt công trường xong đồng hồ | mở đợt kế; đợt 8 → `ct_done` |
| Thứ Hai 05:00 (giờ Việt Nam) | `vt_offer`; 24 giờ sau tự chọn nếu chưa chọn |
| Hằng đêm 00:30 | nâng R0 → R1, R1 → R2 khi đủ điều kiện; kiểm vắng mặt Chủ Trì (7/14/21 ngày); kiểm «ngủ» (30 ngày) / hưu đường (75 ngày); đẩy bản sao `sect`, `sect_member` sang D1 |
| Lập Xuân (± 7 ngày) | mở bầu Chủ Trì (Phần 01 §1.7.3) |

Khi DO bị đánh thức bởi WebSocket hay RPC, nó đọc lại `timers` và đặt lại alarm nếu cần (bảo đảm không mất mốc sau khi tiến trình khởi động lại).

### 12.3.4 RPC nội bộ

```js
export class SectHall extends DurableObject {
  // gọi từ Worker HTTP khi lập chi đường
  async init({ hid, tong, name, founder, cofounders }) { /* tạo meta, member, kho = 0 */ }
  // gọi từ TownShard / EventHub / Worker khi thành viên làm việc ngoài đạo tràng → tiến độ việc tuần
  async credit({ uid, kind, amount, ref }) { /* kiểm uid là thành viên; cộng weekly_by; idempotent theo ref */ }
  // gọi từ Worker khi tài khoản bị xóa / bị khóa
  async memberGone({ uid, reason }) { /* chuyển giao chức, ẩn tên trong log bằng «một người tu» khi xóa */ }
  // gọi từ Worker HTTP cho Lầu Danh Bộ / tìm kiếm
  async summary() { return { hid, tong, name, tier, members, open, nextRite }; }
}
```

`credit` là cách duy nhất để tiến độ việc tuần tăng từ hoạt động ngoài đạo tràng — client không bao giờ tự báo số.

### 12.3.5 WebSocket trong SectHall

- Giống TownShard: `ctx.acceptWebSocket(server)`, trạng thái người trong attachment (`{uid, rank, roles, x, y, spot, rid}`), hibernation khi im lặng.
- Trần **30 socket** (`SECT_CAP`); người thứ 31 nhận `full` (giống `CLOSE_FULL`) — hiếm, vì chi đường ≤ 30 thành viên; khách có thể đẩy quá 30 khi lễ đông → khách vào «sân ngoài» (chỉ xem, không vị trí lễ).
- **Vị trí trong đạo tràng** dùng hệ tọa độ **cục bộ 0–64 m** của phiên bản (Phần 01 §1.8.2), kiểm bằng hằng `COMPOUND = { w: 64, d: 64 }` — **không** dùng `WORLD_TILES`.

### 12.3.6 Đồng bộ sang D1

- Ghi bản sao (`sect`, `sect_member`) **sau khi** thay đổi trong DO đã cam kết: hàng đợi trong `meta.d1_queue`; alarm hằng đêm + mỗi lần có thay đổi lớn (thành viên vào/ra) thì đẩy; lỗi thì giữ hàng đợi, thử lại lùi dần.
- D1 là bản **có thể chậm**; mọi quyết định quyền / kho đọc DO, không đọc D1.

---

## 12.4 Thay đổi trong `TownShard`

### 12.4.1 Danh sách việc

| # | Việc | Ghi chú |
|---|---|---|
| 1 | Kiểm `tok`, gắn `uid`, `ab` vào attachment | Phần 11 §11.1.2 |
| 2 | Xử lý `inv / inv_ok / inv_no / coop_*` | đã khai báo P3, **chưa xử lý** |
| 3 | Xử lý `solve` → `graded` (dựng NPC, chấm bằng engine) | P3, **chưa xử lý** |
| 4 | `sit {g}` nhóm chỗ; đồng tu | §12.4.2 |
| 5 | `say` slot, `emo` 46, vùng im lặng, cử chỉ nhóm | Phần 11 §11.2 |
| 6 | Bảng vùng tương tác (điện, mép nước, rẻ quạt, đoạn đường, bồ đoàn) | §12.4.3 |
| 7 | Chuyển tiếp `ev_act` → EventHub (gom 10 giây) | §12.5 |
| 8 | `notify(uid, msg)` RPC để Worker đẩy lời mời, thư mới tới người đang online | — |
| 9 | Báo cáo → D1 (thay storage DO) + bằng chứng 60 giây | Phần 05 §5.3.3; giữ bộ đệm vòng 60 giây gói của mỗi người trong bộ nhớ (mất khi ngủ — chấp nhận: phòng ngủ khi im lặng, không có gì để làm bằng chứng) |
| 10 | Gom `mv` thành `mvb` | §12.8.2 |
| 11 | Sửa `WORLD_TILES` cho Thái Tuế Điện | §12.4.4 |

### 12.4.2 Đồng tu không cần phát nhịp liên tục

Phần 11 §11.4.1 khai báo `cotu_beat` 1 Hz. Khi triển khai, dùng **pha tất định theo giờ máy chủ** để khỏi đánh thức DO mỗi giây:

```
pha_chuẩn(t) = ((t − EPOCH_COTU) mod 8000) / 8000        // vòng thở 8 giây, t = giờ máy chủ (ms)
client biết độ lệch đồng hồ từ welcome.now → tự tính pha chuẩn, tự vẽ vòng thở chung
client gửi cotu_ph {g, ph, hold} 1 lần / 2 giây
máy chủ so ph với pha_chuẩn(lúc nhận) → tính lệch; gửi cotu_beat {g, n, sync} CHỈ KHI n hoặc sync đổi
```

Hệ quả: một nhóm 9 người tĩnh tọa 20 phút chỉ sinh ~5.400 gói vào (9 × 600) và vài chục gói ra, thay vì 1.200 gói ra phát định kỳ.

### 12.4.3 Bảng vùng tương tác

Máy chủ cần biết «người này có đang đứng ở mép nước / trong điện / ở rẻ quạt Tý không» mà không chạy lại toàn bộ `collide.js`. Dữ liệu tĩnh `zones.js` **(chưa có — cần làm)**, sinh từ `court.js`, `world.js › ROOMS` và dữ liệu vùng (tài liệu 07/08):

```js
export const ZONES = [
  { id: 'dien:thaitue', kind: 'temple', rect: [x0, y0, x1, y1] },          // ô (tile), như WORLD_TILES
  { id: 'water:hosen',  kind: 'water',  poly: [[…], …] },
  { id: 'tmb:子',       kind: 'shan',   arc: { cx, cy, r0, r1, deg0: 352.5, deg1: 7.5 } },
  { id: 'cau:13/04',    kind: 'road',   seg: [[x0, y0], [x1, y1]], w: 3 },
  { id: 'seat:tra',     kind: 'seats',  pts: SEATS },
  { id: 'quiet:hoayen', kind: 'quiet',  rect: […] },
];
export function zonesAt(x, y) { /* trả danh sách id; lưới băm 16 ô để tra O(1) */ }
```

Test: mọi `ZONES` nằm trong `WORLD_TILES` (sau §12.4.4); mỗi station / điện có ít nhất một vùng.

### 12.4.4 Lỗi phát hiện khi rà: Thái Tuế Điện nằm ngoài `WORLD_TILES`

- `protocol.js › WORLD_TILES.maxX = 10 + 1200 = 1210` ô. Chú thích: «mở rộng phía Đông tới 1200 ô cho các điện thờ (`world.js › ROOMS`, x ≈ 1500–1800 m)».
- `world.js › ROOMS` hiện có `thaitue` với `origin.x = 2000`, `w = 28` → phần trong điện ở x = 1.986–2.014 m → ô `x = X / 1,6 + 10` = **1.251–1.269** > 1.210.
- Hệ quả: khi người chơi ở trong Thái Tuế Điện, `parseClient` **từ chối** gói `mv` (ngoài khung) → người khác không thấy họ đi lại trong điện (vị trí đứng yên ở chỗ cuối cùng hợp lệ — cửa điện bên ngoài). Vận Mệnh Các (`origin.x = 1900`, `w = 20` → tối đa 1.910 m → ô 1.203,75) vẫn trong khung, sát biên.
- **Sửa:** tăng `WORLD_TILES.maxX` lên `10 + 1400` (đủ tới 2.224 m) hoặc tính `maxX` từ `ROOMS` (lấy `max(origin.x + w/2)` + biên) để không lặp lỗi khi thêm điện. Thêm test: mọi điểm trong mọi `ROOMS` đi qua `parseClient` được.
- Đạo tràng chi đường **không** đặt ở tọa độ thế giới (dùng tọa độ cục bộ SectHall — §12.3.5), nên không làm khung lớn thêm.

---

## 12.5 `EventHub` — sự kiện máy chủ

### 12.5.1 Trách nhiệm

- Giữ **tiến độ chung** của một sự kiện (`EV-TMB-xx` (xx = số thứ tự mùa): 24 phần; `EV-CAU`: 156 đoạn; `EV-DL-*`: một thanh).
- Giữ **trần công / người / ngày** (nguồn sự thật — TownShard chỉ ước lượng).
- Đặt **pha** bằng alarm; tính lại mục tiêu hằng ngày (Phần 08 §8.6.3).
- Phát trạng thái tới mọi TownShard.

### 12.5.2 Dòng dữ liệu

```
client ──ev_act──► TownShard (kiểm vị trí, tốc độ, loại việc; ước trần) ──gom 10 s──► EventHub.contribute(batch)
                                                                                           │
   batch = { shard: 'town-7', seq: 1842, items: [{ uid, part, act, cong, rq }] }           │ idempotent theo (shard, seq)
                                                                                           ▼
                                                     kiểm trần ngày từng uid (bảng day_cap trong SQLite DO)
                                                     cộng tiến độ từng part; ghi event_contrib (D1, gom mỗi phút)
                                                     trả về { accepted: [rq…], capped: [rq…] }
TownShard ◄── kết quả ── gửi ev_ack cho client (công thật được ghi)
EventHub ──mỗi 30 s (nếu đổi)──► RPC fan-out tới ≤ 50 TownShard: pushState({id, phase, pct, parts})
                                  TownShard phát ev_state cho client trong phòng
```

- **Chi phí fan-out:** 50 RPC / 30 giây / sự kiện — không đáng kể.
- **Nếu EventHub chậm / lỗi:** TownShard giữ batch, thử lại lùi dần (2 s → 60 s); client vẫn thấy `ev_ack` «đang ghi» (công dự kiến), xác nhận sau.
- **`EV-CAU` đoạn đường:** EventHub cũng cập nhật `road_segment.hu` (D1) giờ Tý mỗi ngày (công thức Phần 08 §8.2.2) và phát độ hư mới cho TownShard (client dùng để vẽ vũng nước, giảm tốc).

### 12.5.3 Lược đồ SQLite trong EventHub

```sql
CREATE TABLE ev      (k TEXT PRIMARY KEY, v TEXT);          -- id, phase, target, starts, ends, reductions
CREATE TABLE part    (part TEXT PRIMARY KEY, need REAL, done REAL, kind TEXT);   -- 24 sơn / 156 đoạn
CREATE TABLE day_cap (uid TEXT, day TEXT, cong REAL, PRIMARY KEY (uid, day));
CREATE TABLE seen    (shard TEXT PRIMARY KEY, seq INTEGER);  -- idempotency
CREATE TABLE thresh  (uid TEXT PRIMARY KEY, total REAL, kinds TEXT);   -- ngưỡng thưởng Phần 08 §8.1.7
```

### 12.5.4 Đại lễ đồng bộ

- Pha đại lễ đặt bằng alarm EventHub; trước mỗi pha 30 giây, `pushState` kèm `ev_phase {at}`.
- Mỗi TownShard tự chạy pha theo `at` (không cần EventHub lúc pha bắt đầu).
- Kết quả từng phòng (vd tỷ lệ Đồng tâm Đông Chí) gửi về EventHub trong batch; EventHub tính trung bình có trọng số số người.

---

## 12.6 Phiên bản đạo tràng — dựng ở client

- Đạo tràng không có trong `WORLD_TILES`; client dựng **một** phiên bản tại gốc cục bộ (mặc định đặt ở (2.400 m, 0) trong cảnh 3D để không đè lên ROOMS) khi người chơi bước qua cổng.
- Bố cục khung theo bậc (6 khuôn cố định / tông × 9 tông = 54 khuôn), biến thể mô-đun theo `building.variant`.
- Va chạm: khuôn khung tính sẵn lưới va chạm (`collide.js`) lúc build tài sản; biến thể mô-đun chỉ đổi nội thất **trong** ô cho phép (tài liệu 08), không đổi lối đi → A* luôn thông (test ở build).
- Người khác trong đạo tràng: vị trí từ `s_mv` (SectHall), vẽ như `render3d.js` vẽ người khác hiện nay (~1–2 draw call / người).

---

## 12.7 Thực thi riêng tư ở hạ tầng

| Quy tắc | Cách thực thi | Kiểm |
|---|---|---|
| Không lưu thẻ hợp hôn | TownShard xử lý `hh_card` trong một hàm, biến cục bộ; không `serializeAttachment`, không `storage.put`, không `console.log` gói `hh_card` | test: gửi `hh_card`, sau đó đọc toàn bộ storage + D1 + log observability (bật `observability.enabled` — đã bật trong `wrangler.jsonc`) không thấy giá trị thẻ |
| Log không chứa dữ liệu lá số | bộ lọc log: bỏ mọi trường `card`, `data` (share), `pillars` trước khi ghi | test tĩnh + test chạy |
| `share.data` hết hạn | Cron xóa dòng `exp < now` mỗi giờ | test |
| Xóa tài khoản | Worker: xóa `device`, `share`, `friend*`, `mail`, `block`; `profile.name/tu` → «một người tu»; RPC `memberGone` tới SectHall; `lb_snapshot` thay tên khi hiển thị (giữ `uid` đã xóa → hiển thị «một người tu») | test |
| Xuất dữ liệu | `GET /api/quan/export` gom mọi bảng có `uid` + phần dữ liệu SectHall của người đó | test đủ bảng |
| Nhóm tuổi | mọi lời gọi tạo quan hệ / gửi thư / quà / mời / ghép đọc `ab` của **cả hai** phía từ `account` | ma trận test Phần 05 §5.6.2 |

---

## 12.8 Co giãn

### 12.8.1 Con số gốc

| Đại lượng | Giá trị | Nguồn |
|---|---|---|
| Người / phòng | 60 | `ROOM_CAP` |
| Phòng | 50 | `MAX_ROOMS` → trần đồng thời **3.000** người ở thế giới chung |
| Tần số vị trí | ≤ 8 Hz / người, chỉ khi đổi | `MOVE_HZ`, `net.js › tick` |
| Người / đạo tràng | 30 | `SECT_CAP` |

### 12.8.2 Gom gói vị trí (`mvb`)

Hiện `TownShard.webSocketMessage` **phát lại mỗi gói `mv` ngay lập tức** cho mọi người khác. Phòng đầy 60 người đều đi lại: vào 60 × 8 = 480 gói/giây, ra 480 × 59 ≈ **28.300 lần gửi/giây** — nặng cho một DO đơn luồng và tốn phí tin nhắn WebSocket.

Kế hoạch P1 đã ghi «tick 8 Hz gom gói» nhưng mã hiện tại chưa gom. Đề xuất:

```
mỗi 125 ms (alarm ngắn khi phòng có người di chuyển, tắt khi im):
  gom các mv mới nhất của từng người kể từ lần trước → mvb { at, p: [[id, x, y, h, s, a], …] }
  gửi một mvb cho mỗi client (bỏ chính họ khỏi mảng)
→ ra = 60 × 8 = 480 lần gửi/giây (giảm ~59 lần); mỗi gói lớn hơn (≤ 60 bộ × ~30 byte ≈ 1,8 KB)
```

Client v1 không hiểu `mvb` → máy chủ vẫn gửi `mv` lẻ cho client có `v < 2` (Phần 11 §11.7).

### 12.8.3 Vượt 3.000 người đồng thời

- Tăng `MAX_ROOMS` (chỉ là hằng số; mỗi phòng là một DO độc lập) — ví dụ 200 phòng → 12.000 người.
- Phòng đông theo **vùng**: hiện mọi người cùng phòng thấy nhau ở mọi vùng. Khi đông, có thể tách phòng theo **vùng lớn** (`town-<vùng>-N`) — người chơi chuyển phòng khi đi qua ranh vùng. **Không làm ở M6** (đủ với 50 phòng) — ghi vào câu hỏi mở.
- SectHall, EventHub không bị trần này (mỗi chi đường một DO; sự kiện gom theo batch).

### 12.8.4 Ước lượng tải ở 10.000 người hoạt động / ngày, 1.500 đồng thời giờ cao điểm

| Thành phần | Tải |
|---|---|
| TownShard | 25 phòng đầy; với `mvb`: ~12.000 lần gửi/giây tổng; vào ~12.000 gói/giây |
| SectHall | ~400 chi đường hoạt động; lúc lễ cao điểm (Chủ nhật giờ Tuất) ~150 lễ đồng thời × ≤ 30 người |
| EventHub | 1–3 DO; ~1.500 người × 1 `ev_act` / 10 giây = 150 / giây vào TownShard → ~25 batch / giây vào EventHub |
| D1 | đọc: hồ sơ khi kết nối, danh sách đạo hữu, thư, bảng (cache 60 s); ghi: sổ Đạo Hạnh (gộp), quà, thư, báo cáo — ước ≤ 50 ghi/giây cao điểm |
| Cron | 10 phút / lần tính bảng trực tiếp; giờ Tý chốt kỳ, gộp sổ, cập nhật đường |

Chi phí cụ thể phụ thuộc bảng giá Cloudflare lúc triển khai — **câu hỏi mở cho chủ dự án** (kế hoạch MMO đã nêu: gói Workers Paid $5/tháng nếu vượt free).

---

## 12.9 Ca lạm dụng ở tầng máy chủ (tổng hợp)

| # | Ca | Tầng chặn | Test |
|---|---|---|---|
| 1 | Gửi `mv` dịch chuyển tức thời để «đi bộ» nhanh | TownShard: tốc độ ≤ 6 m/s, nhảy > 4 ô không tính quãng | T-AB-01 |
| 2 | Giả `tok` / phát lại `tok` cũ | HMAC + `|now − ts| ≤ 300 s` + gắn `room` trong chữ ký | T-AB-02 |
| 3 | Dùng `uid` người khác trong gói | `uid` lấy từ attachment đã xác thực, **không** đọc từ gói | T-AB-03 |
| 4 | Gửi `kho_spend` với mục đích lạ | danh sách đóng trong `parseSect` | T-AB-04 |
| 5 | Hai lệnh rút kho cùng lúc vượt hạn mức | DO đơn luồng, kiểm hạn mức trong cùng giao dịch SQLite | T-AB-05 |
| 6 | Bỏ phiếu hai lần bằng hai thiết bị cùng `uid` | khóa chính `(nid, uid)` | T-AB-06 |
| 7 | Bỏ phiếu bằng tài khoản phụ R2 | điều kiện R2 (28 ngày + 4 lễ) + cụm thiết bị: cùng `pid_hash` nhiều `uid` → chỉ một phiếu | T-AB-07 |
| 8 | Vác vật liệu bằng bot | thời gian ≥ 4 s / lượt, quãng Khố Phòng → công trường thật trong `s_mv`, 40 / ngày | T-AB-08 |
| 9 | Gửi `rite_act` nhịp hoàn hảo | chấm ở máy chủ; nhịp độ lệch chuẩn quá thấp → không tính phần thưởng vượt mức `q` 1,0 | T-AB-09 |
| 10 | Spam lời mời chi đường | 20 / ngày / Tri Khách; người nhận chặn lời mời từ chi đường | T-AB-10 |
| 11 | Tạo chi đường hàng loạt để giữ tên | lệ phí 2.000 Phúc Khí (hồ sơ máy chủ), danh tính bền, 1 chi đường / người khởi lập / 30 ngày | T-AB-11 |
| 12 | Gửi `ev_act` ở rẻ quạt mình không đứng | vùng từ `mv` cuối (`zonesAt`) | T-AB-12 |
| 13 | Gửi lại batch sự kiện (TownShard lỗi rồi gửi lại) | idempotent `(shard, seq)` | T-AB-13 |
| 14 | Vượt trần công bằng cách đổi phòng | trần ở EventHub theo `uid`, không theo phòng | T-AB-14 |
| 15 | Gửi `hh_card` giả để dò lá số người khác | thẻ chỉ dùng để tính cặp đã đồng ý; người kia chỉ nhận kết quả theo chế độ của **chính họ**; chế độ Giản lược chỉ lộ 4 mức | T-AB-15 |
| 16 | Dùng `share_get` dò dữ liệu người không chia sẻ | trả `E_PERM` giống hệt khi người đó không tồn tại (không lộ có/không) | T-AB-16 |
| 17 | Dò tài khoản nhóm T qua bảng | nhóm T mặc định ẩn khỏi bảng; không hiện chi đường | T-AB-17 |
| 18 | Người lớn tìm cách kết đạo hữu với nhóm T không qua mã | máy chủ từ chối `fr_add` theo `ab` cả hai phía | T-AB-18 |
| 19 | Gửi thư hàng loạt | 20 / ngày; chỉ tới đạo hữu / quan hệ | T-AB-19 |
| 20 | Gửi quà để «nuôi» tài khoản | trần nhận 20 / ngày; giá trị ≤ 5 Phúc Khí; cờ `GIFT_FAN_IN` | T-AB-20 |
| 21 | Báo cáo dồn để hạ người vô tội | trọng số tin cậy; tự động chỉ tạm thời; khóa dài chỉ do người | T-AB-21 |
| 22 | Mạo danh nhân viên game bằng tên | lọc tên mạo danh | T-AB-22 |
| 23 | Làm sập SectHall bằng gói lớn | ≤ 2.048 ký tự; `rateGate` đóng 4002 | T-AB-23 |
| 24 | Đọc Sổ Kho của chi đường khác | quyền R1+ **của chính chi đường đó** | T-AB-24 |
| 25 | Chủ Trì đuổi người vừa báo cáo mình | khiếu nại `guild`; mẫu hành vi «đuổi trong 24 giờ sau báo cáo» gắn cờ | T-AB-25 |
| 26 | Treo nhiều tài khoản đồng tu để tăng `n` | người không thao tác 2 vòng không tính vào `n`; cùng cụm thiết bị chỉ tính 1 | T-AB-26 |
| 27 | Client sửa `robe` thành màu Dụng thần người khác để «giả mệnh» | vô hại (chỉ màu áo); không ảnh hưởng tính năng nào | — |

## 12.10 Cấu hình triển khai

`wrangler.jsonc` (bổ sung — **chưa làm**, cần chủ dự án duyệt vì tạo tài nguyên mới):

```jsonc
"durable_objects": { "bindings": [
  { "name": "QUAN",  "class_name": "TownShard" },
  { "name": "SECT",  "class_name": "SectHall" },
  { "name": "EVHUB", "class_name": "EventHub" }
] },
"migrations": [
  { "tag": "quan-v1", "new_sqlite_classes": ["TownShard"] },
  { "tag": "quan-v2", "new_sqlite_classes": ["SectHall", "EventHub"] }
],
"d1_databases": [{ "binding": "QUAN_DB", "database_name": "huyenquan", "database_id": "<cấp khi tạo>" }],
"triggers": { "crons": ["*/10 * * * *", "0 17 * * *"] }    // 17:00 UTC = 00:00 giờ Việt Nam (giờ Tý)
```

`worker/index.js` thêm route `/ws/sect` (kiểm Origin như `/ws/quan`) và `/api/quan/*` (CORS như các API hiện có — `corsOrigin`).

Chạy cục bộ: `npm run dev:mmo` (script hiện có tạo junction ASCII cho workerd trên Windows) — cần thêm D1 cục bộ (`wrangler d1 execute --local`) vào script.

## 12.11 Checklist nghiệm thu Phần 12

- [ ] Lược đồ D1 tạo được bằng migration; test tĩnh không có cột dữ liệu sinh.
- [ ] SectHall: `kho_log`, `sect_log` không có `UPDATE/DELETE`; alarm khôi phục sau khởi động lại (test: giết DO giữa lễ, lễ vẫn kết thúc đúng).
- [ ] EventHub: idempotent `(shard, seq)`; trần theo `uid`; fan-out tới 50 phòng.
- [ ] TownShard: `inv/coop`, `solve` chạy; `mvb` giảm gửi ≥ 50 lần ở phòng 60 người (đo bằng script tải).
- [ ] `WORLD_TILES` bao mọi `ROOMS` (test mọi điểm trong mọi điện đi qua `parseClient`).
- [ ] `hh_card` không để lại dấu vết ở storage, D1, log.
- [ ] 26 ca lạm dụng §12.9 có test T-AB-01…26 (Phần 13).
