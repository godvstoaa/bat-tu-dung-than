# 13.04 · Sổ Công Quá và Thiên Bảng (dịch vụ công đức)

> Canon §6: Sổ Công Quá = `remedy-fate › CONG_QUA` + `meritLedger`; mốc Liễu Phàm trong game **300 / 600 / 1.000 công** (thang chia 10); Nợ Âm công khai; Quy nhất cần Sổ Công Quá dương. Bản sơ đồ tổng §4.7: Thiên Bảng hai cột «Tiên Thiên» và «Đạo Hạnh», bảng chính xếp theo Đạo Hạnh. Tài liệu 05 định **bảng việc** (`DEED-xxx`, điểm từng việc); tài liệu này định **cách ghi, cộng, đồng bộ, chống gian lận và xếp hạng**.

## 1. Tách bạch ba sổ

| Sổ | Ghi gì | Ở đâu | Ảnh hưởng game |
|---|---|---|---|
| **Sổ Công Quá trong game** | việc thiện/ác do máy nhiệm vụ ghi (DEED-xxx) | `state.ledger` + máy chủ (khi có tài khoản) | mốc Liễu Phàm, Quy nhất, điều kiện nhiệm vụ, Đạo Hạnh (gián tiếp qua nhiệm vụ) |
| **Nợ Âm** | hệ quả của Tà Lộ | `state.ledger.amNo` | nhiệm vụ Tà Lộ, Phong Đô, danh hiệu «Hồi Đầu» |
| **Sổ đời thực** (tùy chọn, mặc định tắt) | người chơi tự ghi việc thiện ngoài đời theo danh mục `CONG_QUA` | `state.lifeLog` — **chỉ trên máy**, không đồng bộ, không phân tích | **không** thưởng chỉ số; chỉ biểu đồ cá nhân + câu nhắc của Vân Cốc (bản sơ đồ tổng §5.3) |

Sổ đời thực dùng **nguyên** hàm `meritLedger(logged)` của engine (đầu vào `[{ type: 'thien'|'ac', action, count }]` khớp chuỗi `CONG_QUA[].a`). Sổ trong game **không** dùng `meritLedger` để tính điểm vì hàm đó tra điểm bằng so khớp chuỗi (`includes`) và lời nhận xét dùng ngưỡng `net ≥ 10` (thang đời thực); game dùng bảng việc có mã và thang 300/600/1.000.

## 2. SCHEMA-DEED-TABLE

Tệp `src/game/data/deeds.json`, nội dung do tài liệu 05 viết:

```jsonc
{
  "v": 1,
  "scale": 10,                             // thang game: 1 điểm game = 10 «công» Liễu Phàm
  "milestones": [300, 600, 1000],          // canon §6
  "deeds": [
    {
      "id": "DEED-xxx",                    // mã tài liệu 05
      "kind": "thien",                     // 'thien' | 'ac'
      "points": 3,                         // int 1–3 (dương; dấu do kind quyết định)
      "congQua": "Cứu người nguy cấp",     // chuỗi khớp đúng một mục remedy-fate › CONG_QUA (để «Vì sao?» trích nguồn)
      "sources": ["quest", "station"],     // nơi được phép ghi: 'quest'|'station'|'case'|'mmo'|'event'|'server'
      "trust": "server-able",              // 'local' | 'server-able' (máy chủ tái hiện được, §6.2)
      "dailyCap": 3,                       // số lần tối đa/ngày được tính điểm (lần vượt vẫn ghi, điểm 0)
      "ios": true,
      "desc": "t:DEED-xxx.desc"
    }
  ]
}
```

Luật kiểm (thêm vào validator nội dung, phần 03 §13):

| Mã | Luật |
|---|---|
| L1 | `congQua` khớp **đúng một** chuỗi trong `CONG_QUA.thien` (khi `kind: 'thien'`) hoặc `CONG_QUA.ac` |
| L2 | `points` bằng điểm của mục `CONG_QUA` tương ứng, **trừ khi** có `"override": { "points": n, "why": "…" }` do tài liệu 05 ghi lý do |
| L3 | Không việc nào có nguồn `purchase` hoặc gắn với Ngọc/VIP |
| L4 | `kind: 'ac'` chỉ được ghi qua `logFault` từ phương án người chơi tự chọn (phần 03 §7) |

**Mâu thuẫn cần tài liệu 05 chốt** (ghi vào câu hỏi mở): bản sơ đồ tổng §5.3 cho «phóng sinh» +1 và «bố thí» +1…+2, trong khi `CONG_QUA` của engine ghi «Phóng sinh (cứu mạng)» = 3 và «Bố thí tiền/của» = 2. Luật L2 buộc ghi rõ `override` nếu game chọn khác engine.

## 3. SCHEMA-LEDGER-ENTRY

```jsonc
{
  "id": "01JC9X3T7Z8M4Q2V6N0B1R5K7D",      // str — ULID (thời gian + ngẫu nhiên), duy nhất toàn cục
  "deed": "DEED-xxx",
  "kind": "thien",                         // sao chép từ bảng lúc ghi (bảng đổi sau không làm đổi lịch sử)
  "pts": 3,                                // int có dấu: thien dương, ac âm; 0 nếu vượt dailyCap
  "n": 1,                                  // số lần
  "at": 1762300800000,                     // ms (đồng hồ client)
  "src": { "t": "quest", "q": "MQ-1-03", "node": "n3", "aid": "MQ-1-03@1:n3:done:0" },
  "trust": "local",                        // 'local' | 'receipt' (có biên nhận máy chủ) | 'server' (máy chủ tự ghi)
  "rcpt": null,                            // biên nhận máy chủ (§6.3) khi trust = 'receipt'
  "dev": "a91f…"                           // 8 hex đầu băm deviceId — để gộp nhiều thiết bị
}
```

Mục gộp tháng (khi vượt 2.000 mục, phần 02 §8.5):

```jsonc
{ "id": "rollup-2026-11", "kind": "rollup", "month": "2026-11", "thien": 412, "ac": -9, "net": 403, "count": 188, "trusted": 120 }
```

## 4. Client — `src/game/ledger.js`

```js
export function createLedger({ state, deeds, clock = () => Date.now(), deviceHash }) {
  return {
    log(deedId, { n = 1, src }) → Entry | null,     // null nếu deed không hợp lệ cho nguồn src
    fault(deedId, { cause, src }) → Entry,          // chỉ gọi từ hiệu ứng logFault của máy nhiệm vụ
    net() → int,                                    // tổng thang game
    milestone() → { reached: int[], next: int|null, toNext: int },
    amNo(delta?, { src }) → int,                    // đọc/ghi Nợ Âm (chỉ nhiệm vụ kind 'tl')
    explain(entryId) → { deed, congQua, points, src },  // «Vì sao?» cho từng dòng
    pending() → Entry[],                            // mục chưa đồng bộ
    merge(serverEntries) → { added, dup },          // hợp nhất (§5)
    rollup(),                                       // gộp tháng cũ khi vượt trần
  };
}
```

### 4.1 Ghi một việc

```
log(deedId, { n, src }):
  d = deeds[deedId]; if !d or src.t ∉ d.sources → return null (dev: cảnh báo)
  today = todayStr(clock()); used = countToday(deedId, today)
  pts = d.points × min(n, max(0, d.dailyCap − used)) × (d.kind == 'ac' ? −1 : 1)
  e = { id: ulid(clock()), deed: deedId, kind: d.kind, pts, n, at: clock(), src, trust: 'local', dev: deviceHash }
  state.ledger.entries.push(e); state.ledger.net += pts; thien/ac += …
  checkMilestones(prevNet, newNet) → phát sự kiện 'meritMilestone' { m } cho từng mốc vượt qua lần đầu
  emit 'deedLogged' { deed, count: n, entryId: e.id }
  return e
```

- `countToday` duyệt ngược `entries` tới khi gặp mục khác ngày (O(số mục hôm nay)).
- Mốc chỉ phát **lần đầu** vượt (lưu `milestones[m] = at`); net giảm rồi tăng lại không phát lại.
- **Đạo Hạnh không cộng ở đây.** Nhiệm vụ cấp Đạo Hạnh qua `grantDaoHanh`; Sổ Công Quá là chỉ số riêng. Như vậy mỗi việc thiện có hai hệ quả tách bạch, dễ cân bằng (tài liệu 05/09).

### 4.2 Hiển thị

- Sổ Công Quá: danh sách theo ngày, cột «Việc», «Công/Quá», «Nguồn» (nhiệm vụ/NPC), «Vì sao?» (trích `CONG_QUA` và lời dẫn Liễu Phàm từ `LIAOFAN_STORY`).
- Thanh mốc 300 / 600 / 1.000; tại mỗi mốc mở một «đại nguyện» (nội dung tài liệu 05).
- Nợ Âm hiện **riêng một ô đỏ**, không gộp vào net (người chơi thấy rõ cái giá, bản sơ đồ tổng §5.5).

## 5. Đồng bộ (khi có tài khoản, phần 08)

### 5.1 Tính chất dữ liệu

Sổ là **tập chỉ thêm** các mục có `id` duy nhất. Hợp nhất hai bản sao = **hợp tập** (grow-only set): giao hoán, kết hợp, lũy đẳng. Không có xung đột ghi, nên không cần khóa hay đồng hồ vector. Hai thiết bị chơi offline rồi đồng bộ cho cùng kết quả bất kể thứ tự.

Ngoại lệ: `dailyCap` tính theo ngày **trên từng thiết bị** lúc ghi. Khi hợp nhất, máy chủ tính lại trần ngày trên tập hợp (§6.4) và đánh dấu mục vượt là `pts_server = 0`. Client hiển thị `pts_server` khi có.

### 5.2 Giao thức HTTP

`POST /api/hq/ledger/sync` (Worker → Durable Object `PlayerVault` của tài khoản, phần 08):

```jsonc
// yêu cầu
{ "since": 57, "entries": [ /* Entry[] mới từ lần đồng bộ trước, ≤ 200 mục */ ], "contentV": "q:2026.11.3" }
// trả lời
{
  "rev": 63,                               // phiên bản sổ máy chủ
  "ack": ["01JC9X…", "…"],                 // id đã nhận (kể cả đã có từ trước)
  "add": [ /* Entry[] máy chủ có mà client chưa có (ghi từ thiết bị khác hoặc trust 'server') */ ],
  "adj": [ { "id": "01JC…", "ptsServer": 0, "why": "dailyCap" } ],
  "net": { "all": 412, "trusted": 287 },
  "amNo": 0
}
```

- Gửi theo lô ≤ 200 mục; còn thì gửi tiếp. Thất bại mạng → giữ `pending()`, thử lại theo nhịp của `net.js` (lũy thừa, trần 30 s) và ở `pagehide` dùng `navigator.sendBeacon` (≤ 64 KB).
- Máy chủ từ chối mục có `at` lệch > 48 giờ so với giờ máy chủ lúc nhận **mà** `trust = 'local'` và tài khoản đang online liên tục (chống chỉnh đồng hồ để vượt trần ngày). Mục bị từ chối vẫn giữ ở client, đánh `rejected: 'clock'`, hiện trong sổ với ghi chú.

## 6. Mô hình tin cậy và chống gian lận

### 6.1 Thực tế

Game chạy logic ở client (offline-first). Người chơi chỉnh được `localStorage`. Mục tiêu **không** phải chặn mọi gian lận cá nhân (vô nghĩa với game một người chơi), mà là:

1. **Thiên Bảng công bằng**: xếp hạng chỉ dùng điểm đáng tin hoặc điểm khai báo có trần;
2. **Không ảnh hưởng người khác**: điểm khai báo không mở được gì cho người khác (môn phái, sư đồ cần biên nhận);
3. **Minh bạch**: người chơi thấy cột «đáng tin» của mình.

### 6.2 Ba hạng tin cậy

| Hạng | Nguồn | Ví dụ | Tính vào Thiên Bảng |
|---|---|---|---|
| `server` | máy chủ tự ghi | lễ tập thể Mùng 1/Rằm do `TownShard`/`SectHall` xác nhận có mặt; đồng tu trong phòng MMO; sư phụ xác nhận đệ tử xong Mệnh Đồ | đủ |
| `receipt` | client ghi, máy chủ **tái hiện** được và cấp biên nhận | án NPC: máy chủ sinh lại khách từ hạt giống `ngày:khe:pid` (`npc.js › makeNpc`, thuần JS), chạy `cases.js` để chấm đáp án → biên nhận; mini-game có đáp án tất định | đủ |
| `local` | client tự ghi | đa số việc trong nhiệm vụ | có trần: tối đa `LOCAL_CAP_PER_DAY` điểm/ngày (đề xuất 12 công/ngày ≈ 4 việc +3) |

Đạo Hạnh trên Thiên Bảng theo cùng nguyên tắc: phần đến từ nhiệm vụ có biên nhận tính đủ, phần khai báo chịu trần `DH_LOCAL_CAP_PER_DAY` (đề xuất bằng trần ngày của phần 02 §6.2 × 0,5).

### 6.3 Biên nhận — SCHEMA-RECEIPT

```jsonc
{
  "k": "case",                             // loại việc tái hiện: 'case' | 'mg' | 'presence' | 'mentor'
  "acc": "acc_7Hk2…",                      // tài khoản
  "ref": "2026-11-05:1",                   // khóa tái hiện (ngày:khe với án NPC)
  "score": 0.83,
  "pts": 3,                                // điểm công đức công nhận
  "dh": 12,                                // Đạo Hạnh công nhận (nếu có)
  "iat": 1762300800,                       // giây
  "sig": "b64url(HMAC-SHA256(RECEIPT_KEY, k|acc|ref|score|pts|dh|iat))"
}
```

- Khóa `RECEIPT_KEY` là secret Worker. Client lưu biên nhận vào `entry.rcpt`; khi đồng bộ, máy chủ kiểm chữ ký thay vì tính lại.
- Biên nhận dùng một lần cho mỗi `ref` (DO `PlayerVault` lưu tập `ref` đã dùng 400 ngày).

### 6.4 Thuật toán điểm Thiên Bảng (máy chủ)

```
onSync(acc, newEntries):
  for e in newEntries (sắp theo at):
    if e.id ∈ seen: continue
    if e.trust == 'receipt' && !verify(e.rcpt): e.trust = 'local'        // biên nhận giả → hạ hạng
    day = serverDay(e.at, acc.tz)                                         // múi giờ khai báo của tài khoản, mặc định +07
    if e.kind == 'thien':
      if e.trust == 'local': allowed = max(0, LOCAL_CAP_PER_DAY − localUsed[day]); credit = min(e.pts, allowed); localUsed[day] += credit
      else credit = e.pts
    else credit = e.pts                                                   // quá (âm) luôn tính đủ
    capDeed = recount dailyCap trên tập hợp của mọi thiết bị
    store(e, credit, capDeed)
  trusted = Σ credit
  ThienBang.submit(acc, { merit: trusted, daoHanh: dhTrusted, … })        // đẩy cập nhật
```

Độ phức tạp O(k log k) với k = số mục mới (sắp theo thời gian). Bộ nhớ DO: chỉ mục `id` (26 ký tự) × số mục; 10.000 mục ≈ 400 KB trong SQLite — trong giới hạn của một DO.

## 7. Thiên Bảng — Durable Object `ThienBang`

### 7.1 Phân mảnh

- Một DO cho mỗi **mùa** (`tb:<mùa>`); mùa = năm can chi theo Lập Xuân (`thaitue.js › suiYear`), id hiển thị `SEASON-xx` do tài liệu 11 cấp.
- Mỗi tài khoản gửi tối đa 1 cập nhật/5 phút (gộp phía `PlayerVault`) → với 10.000 người chơi hoạt động ≈ 33 lần ghi/giây giờ cao điểm (suy luận: 10.000 × 12 lần/giờ ÷ 3.600). Một DO SQLite đủ sức; nếu vượt 200 ghi/giây thì chia theo băm tài khoản thành 8 phân mảnh và gộp top bằng DO điều phối.

### 7.2 SCHEMA-TB-ROW

```jsonc
{
  "acc": "acc_7Hk2…",
  "name": "Mây Thong Thả",                 // cleanName, có thể đổi
  "realm": 3, "school": "zhengyi",          // đạo thống chính (nếu có)
  "dh": 640,                               // Đạo Hạnh đáng tin (cột chính)
  "merit": 287,                            // công đức đáng tin
  "tt": null,                              // Tiềm Lực — chỉ có khi consent.publicCanCot = true
  "title": "Hồi Đầu",
  "upd": 1762300800
}
```

### 7.3 Truy vấn

| Endpoint | Trả | Bộ đệm |
|---|---|---|
| `GET /api/hq/tb/top?by=dh&n=100` | 100 dòng đầu theo Đạo Hạnh | Cache API 60 s |
| `GET /api/hq/tb/top?by=tt` | 100 dòng đầu theo Tiềm Lực (**chỉ** người đã bật công khai căn cốt) | 300 s |
| `GET /api/hq/tb/me` | hạng của tôi, 5 người trên/dưới | không đệm |
| `GET /api/hq/tb/school` | tổng Đạo Hạnh theo đạo thống | 300 s |

SQL (bảng `rows`, chỉ mục `(dh DESC, upd ASC)`):

```sql
SELECT acc, name, realm, school, dh, merit, title FROM rows ORDER BY dh DESC, upd ASC LIMIT ?1;
SELECT COUNT(*) + 1 AS rank FROM rows WHERE dh > ?1 OR (dh = ?1 AND upd < ?2);
```

### 7.4 Chốt kỳ

- Mỗi Mùng 1 và Rằm âm lịch (canon/bản sơ đồ tổng §9.2): DO `alarm()` chụp top 100 vào bảng `snapshots(kỳ, json)`; NPC Thiên Bảng trong game đọc ảnh chụp kỳ gần nhất.
- Hết mùa: DO mùa cũ chuyển chỉ đọc; danh hiệu mùa ghi vào `PlayerVault` của người đạt.

### 7.5 Ràng buộc đạo đức

- Bảng chính theo Đạo Hạnh (Hậu Thiên), không theo Tiên Thiên (trụ cột T2).
- Cột Tiên Thiên tách riêng, ẩn mặc định; chỉ người tự bật mới xuất hiện.
- VIP, Ngọc, đồ mua **không** có trường nào trên bảng (bản sơ đồ tổng §11: không ưu tiên Thiên Bảng).

## 8. Nợ Âm

- Ghi bằng hiệu ứng `amNo` (chỉ nhiệm vụ `kind: 'tl'`), lưu `ledger.amNo` (int ≥ 0).
- Mỗi lần dùng «Âm Bài» (tài liệu 03/05 định) → `amNo += k`. Trả nợ bằng việc thiện ở Bút Tháp/Phong Đô: hiệu ứng `amNo` âm trong nhiệm vụ trả nghiệp.
- **Hiển thị:** luôn hiện trong Sổ Mệnh của chính người chơi. Trên thẻ công khai MMO: mặc định **không** hiện (câu hỏi mở Q6: canon ghi «công khai» — nghĩa là công khai với người chơi, hay với cả máy chủ?).
- Danh hiệu «Hồi Đầu»: khi `amNo` về 0 sau khi từng ≥ ngưỡng (tài liệu 05) **và** hoàn thành chuỗi Phong Đô → `setTitle`.

## 9. Liên kết với các hệ khác

| Hệ | Đọc gì từ sổ | Ghi gì vào sổ |
|---|---|---|
| Máy nhiệm vụ | `merit`, `amNo` trong điều kiện | `logDeed`, `logFault`, `amNo` |
| Mệnh Đồ (gaimenh) | tầng 6 «Tích âm đức» đổi màu theo mốc | — |
| Persona AI (phần 05) | `gameContext` gồm net, mốc kế tiếp, 3 việc gần nhất | không bao giờ |
| Môn phái (phần 08) | tổng công đức đáng tin của thành viên → sổ công đức chung | biên nhận `presence` khi dự lễ |
| Phân tích (phần 08) | đếm việc theo loại, **không** gửi nội dung sổ đời thực | — |

## 10. Chế độ lỗi

| Lỗi | Xử lý |
|---|---|
| Bảng việc đổi điểm sau khi người chơi đã ghi | lịch sử giữ `pts` lúc ghi; tổng không tính lại (công bằng với người chơi cũ); ghi chú trong sổ |
| Hai thiết bị cùng ghi một việc của cùng một `aid` nhiệm vụ | `aid` giống nhau → máy chủ chỉ tính một mục (khử trùng theo `src.aid` ngoài `id`) |
| Sổ quá lớn | gộp tháng (phần 02); máy chủ giữ đầy đủ |
| Đồng hồ client sai | §5.2 |
| Biên nhận giả | hạ hạng `local`, không phạt (lỗi có thể do bản cũ) |
| DO `ThienBang` lỗi | đọc ảnh chụp kỳ trước; ghi xếp hàng trong `PlayerVault` (thử lại khi DO phục hồi) |

## 11. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-ledger.mjs` | ghi việc thiện/ác; `dailyCap`; mốc 300/600/1.000 phát một lần; net giảm rồi tăng không phát lại; gộp tháng giữ tổng; `explain` trích đúng `CONG_QUA`; `fault` từ nguồn không phải `choice` bị từ chối |
| `test-ledger-merge.mjs` | hợp nhất hai thiết bị theo mọi thứ tự (hoán vị 3 lô) cho cùng tập; khử trùng `aid`; trần ngày tính lại trên tập hợp |
| `test-deeds-table.mjs` | luật L1–L4 trên `deeds.json` |
| `test-receipt.mjs` (Worker, `wrangler dev`) | ký/kiểm biên nhận; dùng lại `ref` bị chặn; án NPC: máy chủ sinh lại khách đúng hạt giống và chấm khớp client (so với `test-game-cases`) |
| `test-thienbang.mjs` (Worker) | top N đúng thứ tự, hòa điểm theo `upd`; cột `tt` ẩn khi không consent; chốt kỳ bằng `alarm` giả lập |

## 12. Ví dụ tính điểm đáng tin một ngày

Tham số: `LOCAL_CAP_PER_DAY = 12` công; hai thiết bị A (điện thoại), B (máy tính) cùng tài khoản; ngày 2026-11-05 (+07).

| Mục | Thiết bị | Việc | `pts` client | Hạng | Tính ở máy chủ | Lý do |
|---|---|---|---|---|---|---|
| 1 | A | án NPC khe 0 (điểm 0,83) | +3 | receipt | +3 | biên nhận hợp lệ |
| 2 | A | việc thiện trong nhiệm vụ | +3 | local | +3 (dùng 3/12) | |
| 3 | A | việc thiện trong nhiệm vụ | +2 | local | +2 (5/12) | |
| 4 | B | việc thiện trong nhiệm vụ | +3 | local | +3 (8/12) | |
| 5 | B | lễ chuông sớm giờ Mão | +1 | server | +1 | `TownShard` xác nhận có mặt |
| 6 | B | việc thiện trong nhiệm vụ | +3 | local | +3 (11/12) | |
| 7 | A | việc thiện trong nhiệm vụ | +3 | local | +1 (12/12) | chạm trần khai báo |
| 8 | A | việc thiện cùng loại lần 4 trong ngày | 0 | local | 0 | `dailyCap` 3 tính trên tập hợp hai thiết bị |
| 9 | A | lựa chọn nói dối (quá) | −2 | local | −2 | quá luôn tính đủ |

Kết quả: `net.all` (hiển thị cho người chơi) = 3 + 3 + 2 + 3 + 1 + 3 + 3 + 0 − 2 = **16**; `net.trusted` (Thiên Bảng) = 3 + 3 + 2 + 3 + 1 + 3 + 1 + 0 − 2 = **14**. Sổ của người chơi hiện mục 7 với ghi chú «đã đủ phần tính bảng hôm nay» và mục 8 «quá số lần trong ngày».
