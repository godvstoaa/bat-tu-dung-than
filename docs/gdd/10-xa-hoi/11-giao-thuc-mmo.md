# 10 · Phần 11 — Giao thức MMO bổ sung: danh tính, gói tin, kiểm hợp lệ, giới hạn tốc độ

> Căn cứ code thật: `src/game/protocol.js` (`VERSION = 1`, `ROOM_CAP = 60`, `MAX_ROOMS = 50`, `MOVE_HZ = 8`, `MSG_PER_SEC = 20`, `WORLD_TILES`, `CLOSE_FULL/SPAM/BAD = 4001/4002/4003`, `SEATS`, `EMOTES`, `PHRASES`, `ROBES`, `PHAI`, `COOP_MAX = 4`, `STEPS`, `REPORT_REASONS`, `cleanName`, `parseClient` — gói ≤ 1.024 ký tự, `rateGate`, `approach`); `worker/quan-room.js` (`TownShard`, WebSocket Hibernation, attachment `{id, room, ready, seat, …}`, `pub()`, `stableId()`, báo cáo trong storage); `src/game/net.js` (offline-first, `pid` trong `localStorage`, ẩn theo `u`, kết nối lại lùi dần 1,5 s → 30 s); `worker/index.js` (route `/ws/quan?room=N`, kiểm Origin, binding `QUAN`); `wrangler.jsonc` (migration `quan-v1`, `new_sqlite_classes: ["TownShard"]`).
>
> Hạ tầng (Durable Object `SectHall`, `EventHub`, `SocialHub`, D1) ở **Phần 12**.

## 11.0 Nguyên tắc giao thức

1. **Một nguồn sự thật:** mọi gói, hằng số, hàm kiểm hợp lệ nằm trong mô-đun thuần JS dùng chung client – máy chủ – test (như `protocol.js` hiện nay). Mô-đun mới: `protocol-social.js`, `protocol-sect.js`, `phrases.js`, `emotes.js`, `festivals.js`, `guild-data.js` **(chưa có — cần làm)**; `protocol.js` import và tái xuất để không đổi chỗ import cũ.
2. **Máy chủ là nguồn sự thật** cho mọi thứ tính điểm, xếp hạng, kho, quyền (`GAME-MMO-PROMPT-PLAN.md`: «máy chủ là nguồn chân lý cho điểm xếp hạng; client dự đoán vị trí»).
3. **Không gói nào chứa ngày/giờ sinh**. Lá số chỉ đi dưới dạng mức «công khai căn cốt» người chơi chọn (Phần 05 §5.2.3) và thẻ hợp (Phần 04 §4.4.4).
4. **Tương thích ngược:** client cũ nhận gói lạ thì bỏ qua (`net.js › handle` có `default:`); máy chủ nhận gói lạ thì bỏ qua (`parseClient` trả `null`). Thêm trường thì chỉ **thêm**, không đổi nghĩa trường cũ.
5. **Kích thước:** gói client → TownShard ≤ 1.024 ký tự (giữ nguyên); client → SectHall ≤ 2.048 ký tự; mọi chuỗi trong gói đều có giới hạn độ dài riêng.
6. **Không chuỗi tự do** từ người chơi ngoài `name` (đã có lọc). Mọi «nội dung» là **mã** trong danh mục.

---

## 11.1 Danh tính

### 11.1.1 Ba loại mã

| Mã | Ở đâu | Bí mật? | Bền? | Dùng cho |
|---|---|---|---|---|
| `pid` | `localStorage huyenquan:pid` (UUID, đã có) | có (không phát lại) | theo trình duyệt | chơi ẩn danh, ẩn người (băm thành `u`) |
| `id` | attachment WebSocket (`rid()`, 10 ký tự) | không | một phiên kết nối | định danh trong phòng |
| `u` | `stableId(pid)` = 12 ký tự hex SHA-256 (đã có) | không | theo `pid` | ẩn người bền qua kết nối lại |
| **`uid`** (mới) | máy chủ cấp, lưu D1 | không | **bền** (theo tài khoản) | mọi quan hệ, chi đường, bảng |

### 11.1.2 Cấp danh tính bền

Kế hoạch P1 đã nêu: «Danh tính ẩn danh: `huyenquan:id` = UUID + secret ký HMAC phía server» — **chưa làm**. Thiết kế:

```
POST /api/quan/id          (HTTP, Worker)
  body: { pid, ab }                       // ab = nhóm tuổi 'T' | 'A' (client tính, U13 không gọi)
  → 200 { uid, sk, exp }                  // sk = bí mật thiết bị 32 byte base64url, chỉ trả một lần
       lưu D1: device { uid, pid_hash, sk_hash, ab, created_at }

Mỗi lần kết nối WebSocket:
  tok = base64url( uid "." ts "." HMAC_SHA256(sk, uid + "." + ts + "." + room) )
  hello { …, tok }
Máy chủ: tra sk_hash theo uid → không lưu sk thô; kiểm |now − ts| ≤ 300 s; kiểm HMAC.
```

- Mất `sk` (xóa trình duyệt) → tài khoản mất trừ khi đã gắn **Sign in with Apple** / email khôi phục (Phần 12 §12.2).
- `ab` có thể **nâng** T → A khi người chơi đủ tuổi (khai lại năm sinh; client tính); **không** hạ được A → T bằng tay (chống lách) — hạ chỉ qua hỗ trợ.
- Người chơi **không** có `uid` vẫn chơi MMO ở mức hiện tại (thấy nhau, cử chỉ, cụm từ, ẩn, báo cáo) nhưng **không** có tính năng cần danh tính bền (Phần 04 §4.0).

---

## 11.2 Thay đổi gói hiện có

### 11.2.1 `hello` (client → TownShard)

| Trường | Hiện có | Mới / đổi | Kiểm hợp lệ |
|---|---|---|---|
| `t` | `'hello'` | — | — |
| `name` | ✓ | — | `cleanName` + bộ lọc mở rộng (§11.3.4) |
| `robe` | `ROBES` 5 hành | thêm `'trung'` (ẩn màu bản mệnh — Phần 05 §5.2.2) | ∈ `ROBES` |
| `acc` | `ROBES` hoặc `''` | `''` khi ẩn màu | ∈ `ROBES ∪ {''}` |
| `title` | chuỗi tự do ≤ 24 | **đổi:** mã danh xưng `ti` ∈ `TITLE_IDS` | không thuộc → `ti` mặc định theo Phúc Khí; `title` chuỗi cũ **bỏ qua** khi có `ti` |
| `phai` | `PHAI` (4 học phái) | giữ nguyên — là **học phái** luận mệnh | ∈ `PHAI` |
| `mon` | — | **mới:** tông `'CN'…'NH'` hoặc `''` | ∈ `GUILD_IDS` đang bật; `'MT'` bị từ chối khi tắt |
| `monHide` | — | **mới:** `0/1` ẩn tông khỏi nhãn (Phần 05 §5.2.6) | bool |
| `look` | `hero_m/hero_f` | — | — |
| `cos` | `cleanCos` | — | — |
| `pid` | ✓ | — | regex hiện có |
| `v` | — | **mới:** phiên bản giao thức client | số nguyên; thiếu = 1 |
| `tok` | — | **mới:** §11.1.2 | base64url ≤ 200 ký tự |
| `ab` | — | **mới:** `'T'` / `'A'` | không có `tok` thì tin `ab` của client nhưng mọi tính năng cần danh tính bền vẫn tắt |

### 11.2.2 `welcome` (server → client)

Thêm: `now` (ms, giờ máy chủ — để đếm ngược đại lễ, Phần 08 §8.3.7), `v` (phiên bản máy chủ), `feats` (danh sách tính năng bật: `['social','sect','events',…]`), `uid` (nếu `tok` hợp lệ), `ev` (tóm tắt sự kiện máy chủ đang chạy: `[{id, phase, pct}]`).

### 11.2.3 `pub()` — thông tin phát lại về người khác

Thêm: `ti` (mã danh xưng), `mon` (trống nếu `monHide`), `tu` (tên tu — Phần 01 §1.4; trống nếu người đó không bật hiện), `ab` **không** phát (nhóm tuổi của người khác không lộ cho mọi người; máy chủ tự dùng để lọc tương tác).

### 11.2.4 `say` — cụm từ có ô chọn

```
client → server   say { k, p? }                 // p: mảng ≤ 2 phần tử, mỗi phần tử là mã slot
server → clients  say { id, u, k, p?, tx? }     // tx: câu tiếng Việt đã ghép (cho client cũ / trình đọc màn hình)
```

Kiểm: `k ∈ PHRASES` (276 khóa, Phần 06); số và kiểu `p` khớp khai báo slot của `k`; giá trị `{vung}` phải là vùng **người gửi đã mở** (máy chủ biết qua hồ sơ — nếu chưa có hồ sơ: chỉ 8 vùng gốc); `{nguoi}` phải là `id` đang ở cùng phòng/nhóm; khóa có điều kiện ngữ cảnh (`chi.*` chỉ thầy → trò; `dl.*` chỉ nhóm A; `le2.*` chỉ trong cửa sổ lễ; trong vùng im lặng chỉ `at.*`).

### 11.2.5 `emo` — 46 cử chỉ

```
client → server   emo { e, to? }
```

Kiểm: `e ∈ EMOTES` (46, Phần 06 §6.22); `to` chỉ khi cử chỉ «có đích»; ràng buộc nơi dùng (`incense`, `lay` chỉ trong vùng điện; `hai_la` chỉ giờ Ngọ ngày Đoan Ngọ; `tha_den` chỉ mép nước) — máy chủ kiểm bằng **vùng** của vị trí cuối (`mv`) theo bảng vùng tương tác (Phần 12 §12.4.3). Cử chỉ nhóm `mua_lan`: hai gói `emo {e:'mua_lan', to}` chéo nhau trong 3 giây → máy chủ phát `emo2 {a, b, e}`.

### 11.2.6 `sit` — nhóm chỗ ngồi

```
client → server   sit { g? }                    // g: mã nhóm chỗ (Phần 04 §4.2.2); thiếu g = 'tra' (Trà Thất, tương thích)
server → client   seat { g, i }                 // i = -1 nếu kín
server → clients  seats { g, taken[] }
```

Khóa chỗ như hiện tại; mỗi nhóm chỗ có `SEAT_GROUPS[g] = [{x, y}, …]`. `SEATS` cũ = `SEAT_GROUPS.tra`.

### 11.2.7 `report` — 10 lý do + ngữ cảnh

```
client → server   report { id, why, ctx? }      // why ∈ REPORT_REASONS (10, Phần 05 §5.3.2)
                                                // ctx ∈ {'room','sect','party','mail','gift'} — nơi xảy ra
server → client   reported { id }
```

TownShard **không** lưu báo cáo trong storage riêng nữa (bỏ giới hạn 500/phòng); chuyển báo cáo + bằng chứng 60 giây (§5.3.3) lên **D1** qua `SocialHub` (Phần 12). Giữ đường cũ khi D1 chưa bật.

### 11.2.8 `lb` — nhiều bảng

```
client → server   lb { b?, p?, s? }             // b: 'LB-01'…'LB-12' (mặc định 'LB-03'); p: kỳ; s: 'top'|'me'|'friends'|'sect'
server → client   lb { b, p, rows[{r, n, tu?, mon?, v, badge?}], me?{r, v}, tmp? }   // tmp=true trong 24 giờ giữ
```

Gói cũ `lb {}` → hiểu là `b: 'LB-03'` và trả thêm trường cũ `season`, `top`, `phai` để client cũ đọc được.

---

## 11.3 Hằng số mới

### 11.3.1 Bảng hằng số

| Hằng | Giá trị | Ghi chú |
|---|---|---|
| `VERSION` | 2 | máy chủ chấp nhận client 1 và 2 |
| `ROBES` | `['木','火','土','金','水','trung']` | `'trung'` = áo trung tính |
| `GUILD_IDS` | `['CN','TV','TC','TT','BD','TH','TD','MT','NH']` | `MT` mặc định tắt |
| `TITLE_IDS` | danh xưng theo Phúc Khí (`TITLES` 5 bậc trong `state.js`), cảnh giới (6 × 3 tên), danh xưng tông, sự kiện, kim lan, đạo lữ, khoa cử | ≈ 120 mã; dữ liệu trong `guild-data.js` |
| `PARTY_MAX` | 4 (= `COOP_MAX`) | nhóm đồng hành |
| `TROUPE_MAX` | 12 | đoàn |
| `SECT_CAP` | 30 | người trong một phiên đạo tràng |
| `FRIEND_CAP` | 200 | — |
| `MAIL_CAP` | 100 | hộp thư |
| `GIFT_SEND_DAY` / `GIFT_RECV_DAY` | 10 / 20 | Phần 05 §5.1.3 |
| `SLOT_VALUES` | `{vung: 20, gio: 12, viec: 16, so: 9}` | Phần 06 §6.20 |
| `REPORT_REASONS` | 10 lý do | Phần 05 §5.3.2 (3 lý do cũ giữ nguyên khóa) |
| `CLOSE_AUTH` | 4004 | `tok` sai/hết hạn |
| `CLOSE_OLD` | 4005 | client quá cũ (`v` < tối thiểu) |
| `CLOSE_BANNED` | 4006 | bị khóa MMO (Phần 05 §5.4.3 bậc 4–5) |
| `CLOSE_AGE` | 4007 | U13 cố kết nối |

### 11.3.2 Mã lỗi `err`

Hiện máy chủ có thể gửi `err {m}` (khai báo trong chú thích `protocol.js`). Chuẩn hóa:

```
server → client   err { c, m, rq? }             // c: mã lỗi; m: câu tiếng Việt cho người chơi; rq: mã yêu cầu nếu có
```

| `c` | Nghĩa | Câu hiển thị (mẫu) |
|---|---|---|
| `E_RATE` | quá nhanh (dưới ngưỡng đóng kết nối) | «Chậm lại một chút nhé.» |
| `E_PERM` | không đủ quyền | «Bạn chưa có quyền làm việc này.» |
| `E_AGE` | không hợp nhóm tuổi | «Tính năng này chưa mở cho bạn.» |
| `E_AUTH` | cần danh tính bền | «Cần liên kết tài khoản để dùng tính năng này.» |
| `E_STATE` | trạng thái không cho phép (vd lễ chưa mở) | «Chưa tới lúc.» |
| `E_LIMIT` | chạm trần (thành viên, đạo hữu, quà…) | «Đã đủ số lượng.» |
| `E_BLOCK` | người kia đã ẩn mình / mình đã ẩn người kia | «Không gửi được.» *(không tiết lộ ai ẩn ai)* |
| `E_GONE` | đối tượng không còn (rời phòng, chi đường hưu) | «Không còn ở đây.» |
| `E_DUP` | yêu cầu trùng (`rq` đã xử lý) | — (im lặng) |
| `E_BAD` | gói sai dạng | — (im lặng, như hiện tại trả `null`) |
| `E_OFF` | tính năng tắt (`feats`) | «Tính năng đang tạm đóng.» |

### 11.3.3 Mã yêu cầu `rq`

Gói có tác dụng ghi (góp kho, bỏ phiếu, tặng quà, gửi thư…) mang `rq` (chuỗi 8–16 ký tự `[a-z0-9]`, client sinh). Máy chủ lưu `rq` đã xử lý 10 phút theo `uid`; gặp lại → trả kết quả cũ / `E_DUP`. Chống bấm hai lần khi mạng chập chờn (`net.js` tự kết nối lại).

### 11.3.4 Lọc tên mở rộng

Bổ sung cho `cleanName` (Phần 05 §5.4.2), giữ thứ tự: (1) bỏ ký tự điều khiển, zero-width (đã có); (2) bỏ `<>&"'\`` (đã có); (3) **chuẩn hóa so khớp**: chữ thường, bỏ dấu tiếng Việt, đổi leetspeak, gộp ký tự lặp, bỏ dấu câu chèn giữa; (4) so với danh sách thô tục mở rộng + danh sách mạo danh + mẫu liên hệ ngoài (≥ 7 chữ số liền, `zalo`, `fb`, `.com`, `t.me`, `@`…); (5) trả `null` nếu dính → tên «Khách» + `renamed` (đã có).

---

## 11.4 Danh mục gói theo miền

Ký hiệu: **C→T** client → TownShard; **C→S** client → SectHall (`/ws/sect?h=<mã>`); **C→H** HTTP API Worker; **T→C**, **S→C** máy chủ → client. «Cần» = điều kiện (A: nhóm tuổi người lớn; U: danh tính bền `uid`).

### 11.4.1 Đồng tu

| Gói | Hướng | Trường | Kiểm | Tốc độ |
|---|---|---|---|---|
| `cotu_beat` | T→C | `g`, `ph` (pha 0–1, 2 chữ số), `n` (số người đang tu), `sync` (0/1) | — | 1 Hz / nhóm chỗ có người |
| `cotu_ph` | C→T | `g`, `ph` (pha thở của mình), `hold` (0/1 đang giữ) | đang ngồi ở `g`; `ph ∈ [0,1]` | ≤ 1 / 2 giây |
| `cotu_end` | C→T | `g` | — | — |

Máy chủ tính `n`, Đồng tâm (Phần 04 §4.2.3); Đạo Hạnh tính ở **máy chủ** (ghi `dh_ledger` nguồn `cotu`), client chỉ hiển thị.

### 11.4.2 Biên nhận hoạt động (cho Thiên Bảng)

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `act_open` | C→T | `act` (mã hoạt động có bản chấm máy chủ), `rq` | `act ∈ ACT_SERVER` |
| `act_seed` | T→C | `act`, `seed` (16 ký tự), `exp` | seed dùng một lần, hết hạn 2 giờ |
| `rcpt` | C→T | `act`, `seed`, `input` (≤ 600 ký tự JSON), `t0`, `t1`, `rq` | seed hợp lệ, chưa dùng; máy chủ chấm lại; `t1 − t0 ≥ min_time(act)` |
| `rcpt_ok` | T→C | `act`, `dh` (Đạo Hạnh xác thực ghi được), `rq` | — |
| `dh_sync` | C→T | `sum` (Đạo Hạnh offline từ lần đồng bộ trước), `since` | `sum ≤ trần_offline(since → now)` (trần theo thời gian thực đã trôi) |

`solve` / `graded` (P3, đã khai báo trong `protocol.js`) là trường hợp riêng của `rcpt` cho án khách: **TownShard hiện chưa xử lý** — cần làm: dựng NPC bằng `npc.js` theo hạt giống ngày · khe · `uid`, chấm bằng `cases.js` (engine thuần JS chạy trong worker).

### 11.4.3 Nhóm đồng hành và đoàn

| Gói | Hướng | Trường | Cần | Kiểm |
|---|---|---|---|---|
| `inv` | C→T | `to`, `kind` (`'party'`/`'coop'`/`'troupe'`) | — | `to` cùng phòng hoặc là đạo hữu online; không bị ẩn hai chiều; nhóm tuổi (Phần 05 §5.6.2) |
| `inv` | T→C | `from`, `name`, `kind`, `pid` (mã nhóm) | — | — |
| `inv_ok` / `inv_no` | C→T | `pid` | — | lời mời còn hạn (2 phút) |
| `party` | T→C | `pid`, `kind`, `host`, `members[{id, name}]`, `started` | — | phát cho thành viên khi đổi |
| `party_leave` | C→T | `pid` | — | — |
| `party_kick` | C→T | `pid`, `id` | trưởng nhóm | 1 / 10 phút |
| `party_host` | C→T | `pid`, `id` | trưởng nhóm | — |
| `follow` | C→T | `pid`, `on` | — | thành viên; máy chủ chỉ ghi trạng thái, client tự tìm đường |
| `coop_start`, `coop_leave`, `coop_ans`, `coop_step`, `coop_done`, `coop_end` | như P3 đã khai báo | | | `coop_ans.step ∈ [0, 5]` (đã có) |

Nhóm `troupe` (≤ 12) dùng cùng gói, `kind: 'troupe'`; người lập cần cảnh giới ≥ 2 (máy chủ đọc từ hồ sơ).

### 11.4.4 Đạo hữu, thư, quà

| Gói | Hướng | Trường | Cần | Kiểm / giới hạn |
|---|---|---|---|---|
| `fr_add` | C→H / C→T | `to` (id cùng phòng) **hoặc** `code` (mã đạo hữu 8 ký tự), `rq` | U | 30 / ngày; không bị ẩn; luật nhóm tuổi (mã đạo hữu cho phép A↔T có xác nhận lại 24 giờ) |
| `fr_req` | T→C | `from{uid, name, tu}` | — | — |
| `fr_ok` / `fr_no` | C→T | `uid` | U | — |
| `fr_del` | C→H | `uid` | U | im lặng |
| `fr_list` | C→H | — | U | trả `[{uid, name, tu, mon, on, vung?, act?}]` theo cài đặt riêng tư của từng người |
| `fr_code` | C→H | — | U | trả mã đạo hữu (đổi được 1 lần / 7 ngày) |
| `mail_send` | C→H | `to` (uid), `h` (tiêu đề ∈ `thu.*`), `b` (1–3 mã cụm từ + slot), `g?` (mã quà nhỏ), `rq` | U | 20 / ngày; `to` là đạo hữu (hoặc thầy/trò/kim lan/đạo lữ); nhóm tuổi |
| `mail_list` / `mail_read` / `mail_del` | C→H | — | U | hộp ≤ 100; tự xóa sau 30 ngày |
| `gift` | C→T | `to` (id ≤ 4 m), `item`, `rq` | U | Phần 05 §5.1.3: quan hệ hợp lệ; trần ngày; vật thuộc nhóm quà nhỏ; khoảng cách theo `mv` cuối |
| `gift` | T→C | `from`, `item` | — | người nhận chạm trần → «chuyển cho chùa» |

### 11.4.5 Sư đồ, kim lan, đạo lữ

| Gói | Hướng | Trường | Cần | Kiểm |
|---|---|---|---|---|
| `sd_post` | C→H | `mang[]` (≤ 4 mảng), `gio[]` (khung giờ địa chi) | U, cảnh giới ≥ 4 | thẻ nhận đệ tử |
| `sd_req` | C→H | `to` (uid thầy), `mang`, `rq` | U, cảnh giới ≤ 2, cùng nhóm tuổi | — |
| `sd_ok` / `sd_no` | C→H | `uid` | U | thầy còn chỗ |
| `sd_rite` | C→T | `sid` (mã cặp), `step` (`'tea'`/`'nhan'`/`'hua'`), `opt` (1–3) | U | hai người cùng ở nơi bái sư (vùng hợp lệ), trong 4 m |
| `sd_hint` | C→T | `to` (trò), `k` (∈ `chi.*`) | thầy của `to` | ≤ 3 / án |
| `sd_task` | C→H | `to`, `layer` (0–5, tầng Mệnh Đồ) | thầy | 1 / tuần |
| `sd_end` | C→H | `sid` | một bên | — |
| `kl_form` | C→T | `members[uid]` (2–5), `name` (cặp mã bảng A/B), `oath` (1–3), `rq` | U, cùng nhóm tuổi, đạo hữu ≥ 7 ngày, đều có mặt ở Đình Kim Lan | mỗi người bấm `kl_ok` trong 60 giây |
| `kl_ok` | C→T | `kid` | U | — |
| `kl_leave` | C→H | `kid` | U | — |
| `dl_req` | C→T | `to`, `rq` | U, A, đạo hữu ≥ 14 ngày, cả hai trong 4 m quanh Bàn Hợp Hôn | — |
| `dl_mode` | C→T | `did`, `mode` (`'none'`/`'brief'`/`'full'`), `confirm` (2 lần cho `full`) | U, A | lấy chế độ thấp hơn của hai bên |
| `hh_card` | C→T | `did`, `card` (Phần 04 §4.4.4: `{g, yz, dg, dz, wx[5], yp, ya[], zg, gua}`) | U, A, sau `dl_mode ≠ 'none'` | kiểm từng trường thuộc tập hợp hợp lệ (12 chi, 10 can, 5 hành, 8 quái…); `wx` 5 số ≥ 0 |
| `hh_res` | T→C | `did`, `mode`, `rating`, `lead` (câu dẫn T2), `verdict`, `score?`, `factors?` | — | `score`, `factors` chỉ khi `full` |
| `dl_vow` | C→T | `did`, `vow` (1–4) | — | lễ (Phần 04 §4.4.8) |
| `dl_end` | C→H | `did` | U | im lặng với bên kia trừ thông báo trung tính |

**`hh_card` không lưu:** TownShard tính `hehunFromCards` trong bộ nhớ, gửi `hh_res`, xóa thẻ ngay trong cùng lời gọi xử lý. Không ghi attachment, không ghi storage, không ghi log có trường thẻ (Phần 12 §12.7 kiểm).

### 11.4.6 Riêng tư

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `priv_set` | C→H | `{robeHide, monHide, showTu, showRealm, presence ('on'/'off'), showVung, showAct, lbShow}` | bool / enum |
| `share_set` | C→H | `to` (uid / `'friends'` / `'sect'` / `'room'`), `lvl` (0–4), `exp` (giờ) | `lvl` ≤ mức tối đa cho loại người xem (Phần 05 §5.2.3) |
| `share_data` | C→H | `lvl`, `data` | dữ liệu đúng mức: L1 `{grade, cach}`; L2 + `{wx[5], level, yong{p,x,j}}`; L4 + `{pillars[8]}` — máy chủ **từ chối** mọi trường thừa |
| `share_get` | C→H | `uid` | trả dữ liệu chỉ khi người kia đã chia sẻ cho mình và chưa hết hạn |
| `block_sync` | C→H | `add[] / del[]` (mảng `u` hoặc `uid`) | ≤ 500 mục / tài khoản |
| `data_export` | C→H | — | trả JSON (Phần 05 §5.2.7) |

### 11.4.7 Sự kiện máy chủ (qua TownShard, chuyển tiếp tới EventHub)

| Gói | Hướng | Trường | Ghi chú |
|---|---|---|---|
| `ev_state` | T→C | `id`, `phase`, `pct`, `parts[{k, pct}]` (vd 24 sơn), `ends` | khi vào phòng và mỗi 30 giây khi đổi |
| `ev_phase` | T→C | `id`, `phase`, `at` (giờ máy chủ tương lai) | đếm ngược đại lễ |
| `ev_act` | C→T | `id`, `part` (vd `'子'` hoặc mã đoạn đường `'CAU-13/04'`), `act` (`carry`/`slab`/`ditch`/`plant`/`bridge`/`bell`/`lamp`/`calm`/…), `rq` | máy chủ kiểm vị trí (`mv` cuối ở đúng rẻ quạt / đoạn), tốc độ chuyến, trần ngày, loại việc hợp sát của rẻ quạt |
| `ev_ack` | T→C | `id`, `part`, `cong` (công được ghi), `me` (tổng công của mình) | — |
| `slab_pair` | C→T | `id`, `part`, `with` (id bạn khiêng) | hai gói chéo trong 3 giây → bắt đầu khiêng; lệch > 4 m → `slab_drop` |

### 11.4.8 Lễ tiết

| Gói | Hướng | Trường | Ghi chú |
|---|---|---|---|
| `fest` | T→C | `today[{id, phase}]`, `next[{id, at}]` | khi vào phòng và khi đổi ngày (giờ Việt Nam) |
| `lixi` | C→T | `to`, `rq` | `EV-TET-01`; Phần 05 §5.1.4; máy chủ quay giá trị (xác suất công khai), ghi Phúc Khí cho người nhận |
| `lixi_open` | T→C | `from`, `v` | — |
| `xongdat` | C→S / C→H | `h` (mã chi đường) hoặc `home` (uid chủ nhà), `rq` | chỉ mùng 1; người đầu tiên được ghi |

### 11.4.9 Chi đường (SectHall — WebSocket riêng `/ws/sect?h=<hid>`)

Kết nối: client mở khi bước vào đạo tràng hoặc mở bảng chi đường; đóng khi ra (hibernation giữ chi phí thấp).

**Kết nối, trạng thái:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `s_hello` | C→S | `tok`, `v`, `as` (`'member'`/`'guest'`) | `tok` hợp lệ; khách chỉ khi đạo tràng mở cửa khách hoặc giao hảo |
| `s_welcome` | S→C | `hid`, `name`, `tong`, `tier`, `you{rank, roles[]}`, `here[]` (người đang trong đạo tràng), `board[]`, `rite?`, `site?`, `now` | — |
| `s_mv` | C→S | như `mv` (tọa độ **trong phiên bản đạo tràng**) | khung 64 × 64 m; 8 Hz |
| `s_say`, `s_emo` | C→S | như `say`, `emo` | luật cụm từ + vùng im lặng |
| `s_bye` | C→S | — | — |

**Thành viên:**

| Gói | Hướng | Trường | Quyền (Phần 01 §1.6.4) | Kiểm |
|---|---|---|---|---|
| `s_roster` | C→S / S→C | → `[{uid, name, tu, rank, roles[], last}]` | R0+ | `last` theo cài đặt hiện diện |
| `s_invite` | C→S | `to` (uid), `rq` | Tri Khách, R4+ | 20 / ngày; nhóm tuổi; không ẩn |
| `s_apply` | C→H | `hid`, `rq` | — | điều kiện đường (cảnh giới, tuổi tài khoản); 1 đơn mở / người |
| `s_decide` | C→S | `uid`, `ok` | Tri Khách, R4+ | — |
| `s_open` | C→S | `on`, `minRealm`, `minAge` | Tri Khách, R5+ | `NS-11` nếu đổi điều kiện (Phần 01 §1.7.1) |
| `s_role` | C→S | `uid`, `role` (`trikhach`/`trikho`/`chule`/`giamvien`/`thuky`/`giaotap`/`''`) | R6 | ≤ 6 chức sự; ghi Sổ Đường |
| `s_kick` | C→S | `uid`, `why` (mã lý do Phần 01 §1.5.5) | R5+ (R0–R1); R2+ chỉ qua `NS-07` | 2 / ngày |
| `s_leave` | C→S | `rq` | — | chờ 72 giờ |

**Nghị sự:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `ns_open` | C→S | `tpl` (`NS-01`…`NS-13`), `args` (theo mẫu), `rq` | quyền theo mẫu; ≤ 5 nghị sự mở; ≤ 2 / tuần / người; `args` đúng kiểu |
| `ns_list` | S→C | `[{nid, tpl, args, by, opens, closes, me?}]` | — |
| `ns_vote` | C→S | `nid`, `v` (`1` thuận / `-1` chống / `0` trắng), `rq` | R2+, hoạt động 14 ngày; không phải người bị nêu tên trong `NS-07/08`; sửa được tới khi đóng |
| `ns_plea` | C→S | `nid`, `k` (∈ `ns.*`) | người bị nêu tên; 1 lần |
| `ns_close` | S→C | `nid`, `res` (`pass`/`fail`/`quorum`), `tally{y, n, b}` | phát cho mọi thành viên |

**Kho:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `kho_give` | C→S | `phuc?`, `mat?{go, da, ngoi, son, giay, muc, dong, tram}`, `rq` | trần 200 Phúc Khí / ngày, 800 / tuần; R0 ≤ 50; vật liệu có thật trong túi (hồ sơ máy chủ) |
| `kho_spend` | C→S | `purpose` (danh sách đóng Phần 01 §1.9.3), `amt`, `nid?`, `rq` | hạn mức theo vai; vượt mức cần `nid` đã `pass` |
| `kho_log` | C→S → S→C | `from?`, `limit` → `[{at, by, kind, amt, purpose, nid?}]` | R1+ xem đầy đủ; R0 xem tổng |

**Không tồn tại** gói «chuyển từ kho cho người chơi». Test tĩnh: rà `protocol-sect.js` không có `purpose` nào có đích là `uid`.

**Công trường:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `ct_open` | C→S | `bld` (`GUILD-DT-*-NN`), `variant`, `nid`, `rq` | Giám Viện / R5+; nghị sự đã thông qua; đủ Đạo Vọng; đủ vật liệu đợt 1 |
| `ct_carry` | C→S | `ct`, `rq` | người đứng ở Khố Phòng rồi tới công trường (máy chủ theo dõi `s_mv`), ≥ 4 giây / lượt, 40 lượt / ngày (R0: 10) |
| `ct_state` | S→C | `ct`, `wave` (1–8), `cong`, `need`, `timer_end?`, `helpers` (số người trong 8 m) | — |
| `ct_done` | S→C | `ct`, `bld` | Đạo Vọng `50 × bậc` |

**Lễ:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `rite_sched` | C→S | `rite` (`GUILD-RITE-*`), `at`, `zheri?` (cờ «đã chọn bằng trạch nhật»), `rq` | Chủ Lễ / R4+; ≤ 2 đường lễ tính thưởng / tuần; máy chủ **tự kiểm** `zheri` cho ngày `at` (không tin cờ client) |
| `rite_phase` | S→C | `rid`, `phase` (`tu`/`tinh`/`hanh`/`hoi`/`end`), `at`, `variant` (vượng/thuận/hao/nghịch/chế) | — |
| `rite_spot` | C→S | `rid`, `spot` | giữ chỗ vòng sáng; nhả sau 2 phút không thao tác |
| `rite_act` | C→S | `rid`, `phase`, `data` (theo mini-game: nhịp `[t…]`, vị trí, lựa chọn) ≤ 600 ký tự | đúng pha; dữ liệu nhịp chấm ở máy chủ |
| `rite_hoi` | C→S | `rid`, `to` (`'sect'`/`'public:<ev>'`/`'all'`) | pha hồi hướng |
| `rite_end` | S→C | `rid`, `q`, `n`, `dv` (Đạo Vọng), `hh` (Hương Hỏa), `you{dh, phuc, mat?}` | Đạo Hạnh ghi `dh_ledger` nguồn `rite` |

**Việc tuần:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `vt_offer` | S→C | `[GUILD-Q-*]` 5 việc | thứ Hai giờ Mão |
| `vt_pick` | C→S | `[3 mã]`, `rq` | Chủ Trì / Chủ Lễ; trong 24 giờ |
| `vt_state` | S→C | `[{q, pct, mine}]` | khi đổi |

Tiến độ việc tuần **không** do client gửi số: SectHall nhận sự kiện từ nguồn tin cậy (TownShard báo «uid X vừa giải án ở Sảnh Tử Vi đạt 72%», EventHub báo «uid X góp 3 công đường CAU-13») qua RPC nội bộ (Phần 12 §12.3.4).

**Bảng tin:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `bd_post` | C→S | `k` (∈ `mp.*` hoặc mẫu thông báo), `p?` | Thư Ký / R4+; ≤ 10 / ngày |
| `bd_list` | S→C | `[{at, by, k, p}]` 50 mục | — |

**Giao hảo, Hội Thiện, Luận Đạo:**

| Gói | Hướng | Trường | Kiểm |
|---|---|---|---|
| `gh_req` | C→S | `to` (hid), `nid` (`NS-09` đã qua) | ≤ 5 giao hảo |
| `gh_ok` / `gh_end` | C→S | `hid` | — |
| `ht_join` | C→S | `proj` (mã dự án `EV-CAU-*` tháng), `with[]` (≤ 3 hid), `nid` | `NS-13` |
| `ld_join` | C→H | `event`, `team[uid]` (3–5) | đăng ký Luận Đạo Hội |

---

## 11.5 Giới hạn tốc độ

Hai lớp:

1. **Cửa tổng** `rateGate(MSG_PER_SEC = 20)` đã có: vượt → đóng 4002. Giữ nguyên cho TownShard và SectHall.
2. **Thùng token theo loại** (mới) — vượt thì trả `err E_RATE` và **bỏ gói**, không đóng kết nối:

| Loại | Dung lượng thùng | Hồi | Ghi chú |
|---|---|---|---|
| `mv`, `s_mv` | 10 | 8 / giây | khớp `MOVE_HZ = 8` |
| `say` | 4 | 10 / phút | + chống lặp (Phần 06 §6.23.3) |
| `emo` không đích | 4 | 12 / phút | — |
| `emo` có đích | 3 | 6 / phút; ≤ 3 / phút / người nhận | — |
| `at.*` (cụm an toàn) | — | không giới hạn ngoài cửa tổng | Phần 06 §6.17 |
| `inv` | 5 | 10 / 10 phút | — |
| `gift` | 3 | 10 / ngày | trần ngày đếm ở D1 |
| `report` | 5 | 10 / giờ | mỗi đối tượng 1 lần (đã có) |
| `ev_act` | 10 | theo trần công / ngày | kiểm thời gian tối thiểu mỗi chuyến |
| `ct_carry` | 2 | 1 / 4 giây | — |
| `rite_act` | 20 | 4 / giây | nhịp mini-game |
| `cotu_ph` | 2 | 1 / 2 giây | — |
| `ns_vote` | 5 | 20 / giờ | — |
| `kho_give`, `kho_spend` | 3 | 30 / giờ | — |
| HTTP `/api/quan/*` | 30 | 60 / phút / uid | như giới hạn AI hiện có của Worker (30 / phút / IP) |

Thùng token sống trong bộ nhớ DO (mất khi hibernation — chấp nhận như `gates` WeakMap hiện tại, vì DO chỉ ngủ khi im lặng).

---

## 11.6 Hàm kiểm hợp lệ — mẫu mở rộng `parseClient`

```js
// protocol-social.js (chưa có — cần làm) — mở rộng parseClient theo đúng phong cách hiện có
import { PHRASES, SLOTS } from './phrases.js';
import { EMOTES } from './emotes.js';
const id16 = (v) => typeof v === 'string' && /^[a-z0-9]{1,16}$/i.test(v);
const rq = (v) => typeof v === 'string' && /^[a-z0-9]{8,16}$/.test(v);

export function parseSocial(m) {
  switch (m.t) {
    case 'say': {
      const def = PHRASES[m.k]; if (!def) return null;
      const p = Array.isArray(m.p) ? m.p.slice(0, 2) : [];
      if (p.length !== (def.slots?.length || 0)) return null;
      if (!p.every((v, i) => SLOTS[def.slots[i]].has(v))) return null;   // {nguoi} kiểm sau ở DO (cần biết phòng)
      return { t: 'say', k: m.k, p };
    }
    case 'emo':
      if (!EMOTES[m.e]) return null;
      if (m.to !== undefined && (!EMOTES[m.e].target || !id16(m.to))) return null;
      return { t: 'emo', e: m.e, to: m.to };
    case 'gift':
      if (!id16(m.to) || typeof m.item !== 'string' || m.item.length > 24 || !rq(m.rq)) return null;
      return { t: 'gift', to: m.to, item: m.item, rq: m.rq };
    case 'hh_card': {
      const c = m.card || {};
      const ok = ['nam', 'nu'].includes(c.g) && ZHI.has(c.yz) && GAN.has(c.dg) && ZHI.has(c.dz)
        && Array.isArray(c.wx) && c.wx.length === 5 && c.wx.every((x) => Number.isFinite(x) && x >= 0 && x < 1000)
        && WX.has(c.yp) && Array.isArray(c.ya) && c.ya.length <= 4 && c.ya.every((x) => WX.has(x))
        && ['Đông', 'Tây'].includes(c.zg) && GUA.has(c.gua);
      return ok && id16(m.did) ? { t: 'hh_card', did: m.did, card: { g: c.g, yz: c.yz, dg: c.dg, dz: c.dz, wx: c.wx.map((x) => Math.round(x * 10) / 10), yp: c.yp, ya: c.ya, zg: c.zg, gua: c.gua } } : null;
    }
    // … các gói khác theo bảng §11.4
    default: return null;
  }
}
```

Quy ước: hàm **chỉ** kiểm dạng và tập giá trị (thuần, test bằng node như `test-quan-protocol.mjs`); kiểm **ngữ cảnh** (quyền, vị trí, quan hệ, trần ngày) nằm trong DO.

---

## 11.7 Ma trận tương thích

| Client \ Máy chủ | Máy chủ v1 (hiện tại) | Máy chủ v2 |
|---|---|---|
| **Client v1** (hiện tại) | như hiện nay | thấy người, cử chỉ 6 cũ, cụm từ 8 cũ (khóa mới bị client bỏ qua — máy chủ gửi kèm `tx` nhưng client v1 không đọc); không thấy chi đường, sự kiện; không bị lỗi |
| **Client v2** | máy chủ bỏ qua gói mới; client thấy `welcome.v` thiếu → tắt mọi tính năng v2, chạy như v1 | đầy đủ |

Bản iOS cần build lại khi máy chủ lên v2 (như ghi chú P1 trong `GAME-MMO-PROMPT-PLAN.md`: «Bản iOS cần build lại sau khi máy chủ chạy»). `CLOSE_OLD` (4005) chỉ dùng khi một thay đổi **bắt buộc** về an toàn (vd bỏ `title` tự do) cần chặn client quá cũ.

## 11.8 Danh sách test giao thức (node, không cần mạng)

Mở rộng `scripts/test-quan-protocol.mjs` (đã có trong `npm run test:mmo`):

| # | Test |
|---|---|
| 1 | `hello` cũ (không `v`, có `title` tự do) → `ti` mặc định, `title` chuỗi lạ bị bỏ |
| 2 | `hello.robe = 'trung'` hợp lệ; `robe = 'xyz'` → `'土'` (giữ hành vi cũ) |
| 3 | `hello.mon = 'MT'` khi `MT` tắt → `mon = ''` |
| 4 | `say` 8 khóa cũ y nguyên; 276 khóa mới hợp lệ; khóa lạ → `null` |
| 5 | `say` sai số slot / slot ngoài danh sách → `null` |
| 6 | `emo` 46 cử chỉ; `to` cho cử chỉ không đích → `null` |
| 7 | `report` 10 lý do; 3 lý do cũ giữ khóa |
| 8 | `hh_card` đủ trường hợp lệ; thiếu / thừa trường / giá trị ngoài tập → `null`; thẻ trả về **không** chứa trường lạ |
| 9 | `share_data` mức L1 có trường của L2 → bị cắt |
| 10 | `kho_spend` với `purpose` không thuộc danh sách → `null`; không tồn tại `purpose` nhận `uid` |
| 11 | `ns_vote.v` ∉ {−1, 0, 1} → `null` |
| 12 | `rq` sai dạng → `null` cho mọi gói ghi |
| 13 | Gói > 1.024 ký tự (TownShard) / > 2.048 (SectHall) → `null` |
| 14 | `rateGate` + thùng token: 11 `say` liên tiếp → 10 qua (trong phút), 11 bị `E_RATE` |
| 15 | Không có hằng/khóa nào chứa chữ «birth», «ngaysinh», «gio_sinh» trong mọi mô-đun giao thức (test tĩnh) |
