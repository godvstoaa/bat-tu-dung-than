# 13.03 · Máy nhiệm vụ (quest engine)

> Bản sơ đồ tổng §13.2 xếp máy nhiệm vụ là P0: «đồ thị nhiệm vụ khai báo dữ liệu; điều kiện từ Mệnh Bàn / Mệnh Đồ / cờ cốt truyện». §6.1 ý 4 đặt luật: **AI không cấp thưởng, không đổi trạng thái game**; mọi phần thưởng, mở khóa, tiến độ do máy nhiệm vụ (tất định) quyết định. Phần này đặc tả máy đó. Nội dung nhiệm vụ (`MQ-*`, `BR-*`, `SQ-*`, `TL-*`, `DQ-*`, `EV-*`, `CQ-*`) do tài liệu 03, 05, 09, 10 viết; ở đây chỉ định dạng, thuật toán và luật kiểm.

## 1. Yêu cầu

| Mã | Yêu cầu | Lý do |
|---|---|---|
| R1 | Tất định: cùng trạng thái + cùng chuỗi sự kiện + cùng đồng hồ → cùng kết quả | test được bằng Node; máy chủ tái hiện được để chấm điểm đáng tin (phần 04) |
| R2 | Mọi nội dung là dữ liệu JSON; không có mã riêng cho từng nhiệm vụ | biên kịch nhập liệu, không cần lập trình viên |
| R3 | Thuần logic, không DOM | như `state.js` |
| R4 | Một máy cho mọi loại: chính tuyến, nhánh Mệnh Cách, phụ vùng, Tà Lộ, hằng ngày, lễ tiết, chuỗi đạo thống | tránh hai hệ song song |
| R5 | Bền với mất điện giữa chừng: hiệu ứng không bao giờ áp hai lần | Phúc Khí/Đạo Hạnh không nhân đôi khi tải lại |
| R6 | Bền với nội dung đổi phiên bản: nút bị xóa không làm kẹt người chơi | cập nhật nội dung hằng tuần |
| R7 | iOS: nhiệm vụ/nút dạng đoán vận phải có biến thể hoặc ẩn | Apple 4.3(b), `features.js` |
| R8 | Giải thích được «vì sao chưa làm được» | UX và chống cảm giác bị phán xét (T2) |
| R9 | Chi phí mỗi sự kiện O(số nút đang nghe loại sự kiện đó) | chạy mỗi khung khi đi vào vùng |
| R10 | Không dùng `eval`, không có biểu thức chuỗi tự do | an toàn, kiểm tĩnh được |

## 2. Khái niệm

| Khái niệm | Định nghĩa |
|---|---|
| **Nhiệm vụ** (Quest) | Một đồ thị có hướng gồm các **nút**; có điều kiện mở, nút bắt đầu, nút kết thúc |
| **Nút** (Node) | Một bước: nói chuyện, đi tới, làm ở gian, giải án, làm việc thiện, mini-game, chờ thời, lựa chọn, rẽ nhánh tự động, xem cảnh cắt, trò chuyện AI, kết thúc |
| **Cạnh** (Edge) | Chuyển từ nút này sang nút khác khi nút hoàn thành, có thể kèm điều kiện (`when`) |
| **Sự kiện** (GameEvent) | Điều xảy ra trong game do code phát (đến vùng, mở gian, chấm án…) |
| **Điều kiện** (Cond) | Cây logic JSON đọc trạng thái (Mệnh Bàn, Đạo Hạnh, cờ, thời gian…) |
| **Hiệu ứng** (Effect) | Thay đổi trạng thái có kiểm soát (cờ, thưởng, ghi việc thiện, mở vùng…) |
| **Biến nhiệm vụ** (vars) | Số/chuỗi riêng một nhiệm vụ (đếm số việc, lựa chọn đã chọn) |
| **Cờ** (flags) | Biến toàn cục cốt truyện (`flags.<tên>`), dùng xuyên nhiệm vụ |
| **Mốc lưu** (checkpoint) | Nút an toàn để quay về khi nội dung đổi |

## 3. Bố trí dữ liệu

```
src/game/data/
  quests/
    index.json                 danh mục: [{ id, file, kind, v }]
    mq-p.json                  MQ-P-xx (mở đầu)
    mq-1.json … mq-4.json      các hồi
    mq-e.json                  vĩ thanh
    br-tt.json br-dc.json br-nt.json br-dk.json
    sq-<region>.json           phụ theo vùng
    tl.json                    Tà Lộ
    dq.json                    hằng ngày
    ev-<lễ>.json               lễ tiết
    cq-<đạo>.json              chuỗi đạo thống
  dialogue/
    <questId>.json             SCHEMA-DIALOGUE, sinh từ kịch bản Markdown (§9)
  text/
    vi.json                    chuỗi hiển thị theo khóa (để sau dịch được)
```

- Nạp lười theo hồi/vùng: `index.json` (nhỏ) nạp lúc vào game; tệp nhiệm vụ nạp khi nhiệm vụ có thể mở (điều kiện `prereq` thỏa) hoặc khi người chơi vào vùng tương ứng.
- Mỗi tệp có `"v"` (phiên bản nội dung, int tăng dần) và được băm (`contentHash`) lúc build để máy chủ biết client đang chạy nội dung nào.

## 4. SCHEMA-QUEST

```jsonc
{
  "id": "MQ-1-03",                         // str — mã của tài liệu 03 (ví dụ minh họa theo canon §1)
  "v": 3,                                  // int — phiên bản nội dung của nhiệm vụ này
  "kind": "main",                          // 'main'|'branch'|'side'|'tl'|'daily'|'event'|'school'
  "title": "t:MQ-1-03.title",              // khóa chuỗi trong text/vi.json
  "summary": "t:MQ-1-03.summary",
  "giver": "van_coc",                      // npc id (canon §4) hoặc NPC-* của tài liệu 06
  "region": "vancoc",                      // region id (canon §3)
  "tags": ["lieu-phan", "intro"],
  "prereq": { "all": [ { "quest": { "id": "MQ-1-02", "is": "done" } }, { "realm": { "gte": 1 } } ] },   // SCHEMA-COND
  "window": null,                          // SCHEMA-WINDOW — chỉ mở trong khung thời gian (lễ tiết, giờ)
  "repeat": "none",                        // 'none'|'daily'|'weekly'|'lunarMonthly'|'yearly'
  "ios": "same",                           // 'same'|'alt'|'off' — 'alt': dùng iosNodes thay các nút divination
  "sensitive": null,                       // null | 'amta' | 'tl' — cần consent (canon T6, amta-data › ETHICS)
  "start": "n1",
  "nodes": { "n1": { … SCHEMA-QUEST-NODE … } },
  "iosNodes": { },                         // các nút thay thế cho iOS (cùng id với nút bị thay)
  "rewards": [ /* SCHEMA-EFFECT, áp khi tới nút end:success */ ],
  "migrate": { "n4_old": "n4" },           // nút cũ → nút mới khi đổi nội dung
  "checkpoints": ["n1", "n5"]              // nút an toàn
}
```

### 4.1 SCHEMA-WINDOW

```jsonc
{
  "solar": { "from": "MM-DD", "to": "MM-DD" },          // dương lịch, bao gồm hai đầu
  "lunar": { "month": 7, "dayFrom": 1, "dayTo": 15 },    // âm lịch (lunar-javascript), tháng nhuận tính như tháng thường
  "term": "立春",                                        // tiết khí: mở từ thời khắc tiết tới tiết kế tiếp
  "shichen": ["亥", "子"],                                // giờ can chi theo giờ địa phương (23–1 h là 子)
  "weekday": [6, 0]                                      // 0 = Chủ nhật
}
```

Các khóa trong cùng một `window` là **và**; muốn **hoặc** thì dùng `{ "any": [...] }` ở `prereq`.

## 5. SCHEMA-QUEST-NODE

Trường chung:

```jsonc
{
  "type": "talk",                          // một trong bảng §5.1
  "title": "t:MQ-1-03.n1",                 // dòng hiện trong sổ nhiệm vụ
  "guard": null,                           // SCHEMA-COND — nút chỉ hoàn thành khi guard đúng
  "onEnter": [],                           // SCHEMA-EFFECT[] — áp khi bước vào nút
  "onDone": [],                            // SCHEMA-EFFECT[] — áp khi hoàn thành nút
  "next": [ { "to": "n2", "when": null } ],// cạnh; lấy cạnh đầu tiên có when đúng
  "checkpoint": false,
  "divination": false,                     // true → nút dạng đoán vận (iOS phải có iosNodes thay)
  "marker": { "kind": "npc", "id": "van_coc" }   // dấu trên bản đồ/la bàn (UI)
}
```

### 5.1 Các loại nút

| `type` | Tham số riêng | Hoàn thành khi | Sự kiện lắng nghe |
|---|---|---|---|
| `talk` | `npc`, `dialogue` (id SCHEMA-DIALOGUE), `entry` (cảnh bắt đầu) | đoạn thoại chạy tới dòng có `end: true` | `dialogueEnd` |
| `goto` | `target`: `{ region }` / `{ poi }` / `{ bld }` / `{ cell }` / `{ station }` / `{ x, z, r }` | người chơi vào vùng đích | `arrive` |
| `station` | `station` (id `STATIONS`), `result` (SCHEMA-COND trên kết quả) | gian phát `stationDone` với kết quả thỏa | `stationDone` |
| `case` | `caseKind` (`npc`/`classical`/`desk`/`quest`), `caseId`, `minScore` (0–1) | `recordCase` báo điểm ≥ `minScore` | `caseGraded` |
| `deed` | `deed` (`DEED-xxx` của tài liệu 05), `count` | Sổ Công Quá ghi đủ số lần **trong lúc nút đang mở** | `deedLogged` |
| `minigame` | `mg` (`MG-xx` của tài liệu 09), `minGrade` | mini-game trả điểm ≥ ngưỡng | `minigameEnd` |
| `wait` | `ms` (thời gian thực) hoặc `until` (SCHEMA-WINDOW) | đồng hồ vượt mốc | `tick` |
| `choice` | `options: [{ id, label, guard, effects, to }]` | người chơi chọn một phương án hợp lệ | `choice` |
| `branch` | (dùng `next[].when`) | ngay khi vào nút (nút tự động) | — |
| `parallel` | `goals: [{ id, node }]`, `need: 'all' \| int` | đủ số mục tiêu con hoàn thành | các loại của mục tiêu con |
| `cutscene` | `cut` (`CUT-xxx` của tài liệu 03), `skippable` | cảnh cắt kết thúc hoặc bị bỏ qua | `cutsceneEnd` |
| `aiTalk` | `npc`, `persona` (`PERSONA-<npc>`), `minTurns`, `topic` | người chơi bấm «Con hiểu rồi» sau ≥ `minTurns` lượt **hoặc** bấm «Bỏ qua» (AI tắt/iOS: chuyển sang `fallbackDialogue`) | `aiTalkEnd` |
| `end` | `outcome`: `success` / `fail` / `abandon` | ngay khi vào nút | — |

Luật cứng cho `aiTalk`: nút không bao giờ tự hoàn thành vì nội dung câu trả lời AI. AI có thể **gợi ý** người chơi bấm, nhưng sự kiện `aiTalkEnd` chỉ do nút bấm của UI phát (trụ cột §6.1 ý 4).

## 6. SCHEMA-COND

Ngữ pháp (cây JSON, không chuỗi biểu thức):

```
Cond  := { "all": Cond[] } | { "any": Cond[] } | { "not": Cond }
       | { "stat":  { "path": StatPath, "op": Op, "v": number|string } }
       | { "flag":  string }                       // flags[name] truthy
       | { "var":   { "name": string, "op": Op, "v": number|string } }   // biến của nhiệm vụ hiện tại
       | { "quest": { "id": string, "is": "active"|"done"|"failed"|"none", "node"?: string } }
       | { "realm": { "gte"?: int, "lte"?: int } }
       | { "merit": { "gte"?: int, "lte"?: int } }  // ledger.net theo thang game (canon: mốc 300/600/1.000)
       | { "amNo":  { "gte"?: int, "lte"?: int } }  // Nợ Âm
       | { "school":{ "id": string, "is": "joined"|"none", "progressGte"?: int } }
       | { "schools": { "countGte": int } }
       | { "lop":   "TT"|"DC"|"NT"|"DK"|null }       // Mệnh Cách
       | { "perk":  string }                         // PERK-* có trong Mệnh Bàn
       | { "region":{ "in": string[] } }             // vùng người chơi đang đứng
       | { "visited": string }                       // đã từng tới vùng
       | { "time":  SCHEMA-WINDOW }
       | { "feature": "divination"|"ai"|"wishes" }   // FEATURES[...]
       | { "consent": "amta"|"tl"|"analytics"|"publicCanCot" }
       | { "rand":  { "p": number, "seed": "day"|"quest" } }   // ngẫu nhiên tất định
Op    := "<" | "<=" | "==" | "!=" | ">=" | ">" | "in"
StatPath (danh sách trắng):
  mb.tiemLuc · mb.phamCan.idx · mb.nguHanh.pct.<wx> · mb.nguHanh.eff.<wx> · mb.thanLuc · mb.thienMenh.dung|hy|ky|cuu
  mb.nguDuy.<cai|guan|yin|shi|ti> · mb.nguDuy.dominant · mb.nguDuy.weakest · mb.menhCap · mb.nguyenKhi
  mb.tucNghiep.realm · mb.tucNghiep.poisons.<tham|san|si> · mb.thoiVan.liunian.score · mb.thoiVan.dayun.score
  dao.daoHanh · ledger.net · ledger.thien · ledger.ac · level (progress.levelOf) · phucKhi · streak
```

Ngữ nghĩa:

- `stat` với đường dẫn ngoài danh sách trắng → **lỗi kiểm tĩnh** (validator), không phải `false` lúc chạy.
- Trường `null` (engine phụ lỗi) so với số → `false`; `not` của nó → `true`. Validator cảnh báo nếu một `prereq` của nhiệm vụ chính chỉ phụ thuộc trường có thể `null` mà không có nhánh `any` dự phòng.
- `rand` dùng `npc.js › rng(hashSeed(questId + ':' + dayStr + ':' + pid))` → cùng ngày cùng người chơi cho cùng kết quả (R1).
- Mỗi nút `Cond` có thể kèm `"label": "t:…"` để `explainBlocked` in câu giải thích (R8). Ví dụ `{ "realm": { "gte": 3 }, "label": "t:need.realm3" }` → «Cần cảnh giới Luyện Tinh Hóa Khí».

Ví dụ: người dẫn đạo nghịch thiên (bản sơ đồ tổng §5.2):

```json
{ "any": [
  { "stat": { "path": "mb.tiemLuc", "op": "<", "v": 46 } },
  { "lop": "NT" }
] }
```

## 7. SCHEMA-EFFECT

| `do` | Tham số | Ghi chú / giới hạn |
|---|---|---|
| `setFlag` / `clearFlag` | `name` | tên `[a-z0-9_.]{1,48}` |
| `setVar` / `incVar` | `name`, `v` | biến của nhiệm vụ hiện tại |
| `grantPhuc` | `n` | `n ≤ 200` mỗi hiệu ứng; đi qua `state.addPhuc` (cộng `xp`) |
| `grantDaoHanh` | `base`, `school?`, `ky?` | đi qua `daoHanhGain` (phần 02 §6.2) + trần ngày; **chỉ** hợp lệ trong `onDone` của nút hoặc `rewards` |
| `logDeed` | `deed` (`DEED-xxx`), `count?` | ghi Sổ Công Quá (phần 04); điểm lấy từ bảng việc, không đặt trong hiệu ứng |
| `logFault` | `deed`, `cause` | **chỉ** hợp lệ trong `options[].effects` của nút `choice` (luật «game không tự trừ khi người chơi không có lựa chọn», bản sơ đồ tổng §5.3) |
| `startQuest` / `failQuest` / `abandonQuest` | `id` | |
| `unlockRegion` | `region` | ghi `world.unlocked` |
| `unlockStation` | `station` | |
| `giveCosmetic` | `item` | chỉ món `free: true` hoặc món đánh dấu `questReward: true` trong `cosmetics.js`; **không** cấp Ngọc |
| `joinSchool` / `leaveSchool` | `school` | kiểm `maxSchools = 3` |
| `setTitle` | `title` | danh hiệu (vd «Hồi Đầu») |
| `notify` | `text` | toast |
| `openUi` | `ui` (`UI-xx` của tài liệu 12), `args` | mở màn hình (Mệnh Đồ, Sổ Công Quá…) |
| `playCut` | `cut` | |
| `personaMemo` | `npc`, `note` (khóa chuỗi) | ghi nhớ ngắn cho persona (phần 05) |
| `amNo` | `delta` | Nợ Âm Tà Lộ; chỉ hợp lệ trong nhiệm vụ `kind: 'tl'` |

Mỗi hiệu ứng có **khóa áp dụng** `aid = questId + '@' + v + ':' + nodeId + ':' + phase + ':' + index` (phase ∈ `enter`, `done`, `opt:<id>`, `reward`). Khóa đã áp được lưu trong `state.quests.active[id].applied` (và sau khi nhiệm vụ xong thì gộp vào `done[id].aid` dạng băm 32 bit). Áp lại cùng `aid` là no-op (R5).

## 8. SCHEMA-QUEST-STATE

```jsonc
"quests": {
  "active": {
    "MQ-1-03": {
      "v": 3,                              // phiên bản nội dung lúc bắt đầu
      "node": "n2",                        // nút hiện tại (nút parallel: id của nút cha)
      "goals": { "g1": true, "g2": false },// chỉ khi nút hiện tại là parallel
      "vars": { "deeds": 1 },
      "since": 1762300800000,              // ms lúc vào nút hiện tại (dùng cho wait.ms)
      "started": 1762290000000,
      "applied": ["MQ-1-03@3:n1:enter:0", "MQ-1-03@3:n1:done:0"],
      "hist": [["n1", 1762290000000]]      // ≤ 32 mục gần nhất, để gỡ lỗi và thoại hồi tưởng
    }
  },
  "done":   { "MQ-1-02": { "at": 1762200000000, "outcome": "success", "v": 2 } },
  "failed": { },
  "vars":   { },                           // biến toàn cục (khác flags: số)
  "orphan": { },                           // nhiệm vụ có trong save nhưng không có trong danh mục đã nạp
  "rev": 57                                // tăng mỗi lần đổi
}
```

## 9. Thoại — SCHEMA-DIALOGUE và chuyển từ kịch bản

### 9.1 Định dạng

```jsonc
{
  "id": "MQ-1-03",
  "scenes": {
    "MQ-1-03.2": {
      "place": "Am Vân Cốc", "time": "đêm, giờ Hợi", "weather": "mưa nhỏ",
      "lines": [
        { "who": "van_coc", "text": "t:MQ-1-03.2.l1", "stage": "rót trà" },
        { "who": "van_coc", "text": "t:MQ-1-03.2.l2", "bind": { "factors": "mb.explain.tiemLuc" } },
        { "choice": [
          { "id": "a", "text": "t:MQ-1-03.2.c1", "to": "MQ-1-03.3a" },
          { "id": "b", "text": "t:MQ-1-03.2.c2", "to": "MQ-1-03.3b", "guard": { "perk": "PERK-kuiGang" } },
          { "id": "c", "text": "t:MQ-1-03.2.c3", "to": "MQ-1-03.3c", "effects": [ { "do": "logFault", "deed": "DEED-xxx", "cause": "noi-doi" } ] }
        ] }
      ]
    },
    "MQ-1-03.3a": { "lines": [ { "who": "van_coc", "text": "t:…", "end": true, "effects": [ { "do": "openUi", "ui": "UI-xx" } ] } ] }
  }
}
```

- `bind` chèn dữ liệu Mệnh Bàn vào câu (vd đọc `synthesis.factors` như kịch bản mẫu §6.3 bản sơ đồ tổng). Chỉ cho phép đường dẫn trong danh sách trắng §6; giá trị là **nguyên văn engine** (T1, T5).
- `guard` ẩn phương án khi không thỏa (hoặc hiện mờ kèm `label` nếu `showLocked: true`).
- Thoại không đổi trạng thái ngoài `effects` khai báo, và hiệu ứng thoại theo cùng luật `aid` §7.

### 9.2 Chuyển kịch bản Markdown sang JSON

Canon §1 quy định kịch bản dạng:

```
[CẢNH MQ-1-03.2 · Am Vân Cốc · đêm, giờ Hợi · mưa nhỏ]
VÂN CỐC: (rót trà) Con ngồi đi.
> Lựa chọn: ① «…» → [MQ-1-03.3a]  ② «…» → [MQ-1-03.3b]
```

`scripts/dialogue-from-md.mjs <tệp.md> [--out src/game/data/dialogue]`:

| Mẫu | Quy tắc |
|---|---|
| `^\[CẢNH (?<id>[A-Z]{2}-[^ ]+) · (?<place>[^·]+) · (?<time>[^·]+)(?: · (?<weather>[^\]]+))?\]$` | mở cảnh mới |
| `^(?<who>[A-ZÀ-Ỹ .]+): (?:\((?<stage>[^)]*)\) )?(?<text>.+)$` | dòng thoại; `who` tra bảng tên → npc id (`VÂN CỐC` → `van_coc`) từ canon §4, thiếu thì lỗi |
| `^> Lựa chọn: (.+)$` | tách bằng `[①-⑨]`, mỗi mục `«text» → [id]` |
| `^> Hiệu ứng: (.+)$` (mở rộng) | danh sách hiệu ứng dạng `do(arg=…)`, ánh xạ sang SCHEMA-EFFECT; không khớp thì lỗi |
| `^> Kết$` | đánh `end: true` cho dòng trước |

- Chữ thoại đưa vào `text/vi.json` với khóa sinh tự động `<sceneId>.l<n>` / `.c<n>`; JSON thoại chỉ chứa khóa.
- Script in báo cáo: số cảnh, số dòng, phương án trỏ tới cảnh không tồn tại (lỗi), cảnh không ai trỏ tới (cảnh báo), tên nhân vật lạ (lỗi).

## 10. Thời gian chạy

### 10.1 API

```js
// src/game/quests.js — thuần logic
export function createQuestRuntime({ catalog, state, mb, clock = () => new Date(), features, emit = () => {} }) {
  return {
    load(questDefs),                       // thêm định nghĩa (nạp lười); kiểm schema ở chế độ dev
    dispatch(ev),                          // GameEvent → trả { changed: bool, effects: AppliedEffect[] }
    tick(now),                             // gọi mỗi phút (nhịp refreshDay) cho nút wait / window
    available(),                           // nhiệm vụ có thể nhận ngay: [{ id, giver, region }]
    start(id),                             // kiểm prereq + window + ios + sensitive; ném lỗi có mã nếu không được
    choose(id, nodeId, optionId),          // nút choice
    explainBlocked(id),                    // [{ label, ok }] — các điều kiện chưa thỏa
    journal(),                             // dữ liệu sổ nhiệm vụ cho UI
    markers(),                             // dấu bản đồ của các nút đang mở
    debug: { force(id, node), reset(id), trace: [] }   // chỉ khi ?debug=1
  };
}
```

`emit(appliedEffect)` để `main.js` phản hồi UI (toast, mở bảng, cập nhật HUD). Máy nhiệm vụ không gọi DOM.

### 10.2 SCHEMA-GAME-EVENT (bus nội bộ, khác sự kiện phân tích)

| `t` | Trường | Ai phát |
|---|---|---|
| `arrive` | `region`, `poi?`, `bld?`, `cell?`, `x`, `z` | `main.js` khi vùng/ô cổng đổi (đã có `regionAt`, thêm `cellAt` ở phần 06) |
| `talk` | `npc` | tương tác NPC |
| `dialogueEnd` | `dialogue`, `scene`, `choice?` | trình chạy thoại |
| `stationDone` | `station`, `result` (object do gian trả) | `openStation` khi bảng đóng với kết quả |
| `caseGraded` | `caseKind`, `caseId`, `score` | `state.recordCase` |
| `deedLogged` | `deed`, `count`, `entryId` | Sổ Công Quá (phần 04) |
| `minigameEnd` | `mg`, `grade` | mini-game |
| `cutsceneEnd` | `cut`, `skipped` | |
| `aiTalkEnd` | `npc`, `turns`, `skipped` | `master-ui` / UI persona |
| `choice` | `quest`, `node`, `option` | UI nhiệm vụ |
| `realm` | `tier` | khi `realmOf` đổi |
| `dayStart` | `date` | `rollDay` khi sang ngày |
| `tick` | `now` | mỗi phút |

### 10.3 Thuật toán `dispatch`

```
listeners: Map<eventType, Set<questId>>          // xây lại khi nhiệm vụ đổi nút

dispatch(ev):
  ids = listeners.get(ev.t) ∪ (ev.t == 'tick' ? waiters : ∅)
  changed = false; applied = []
  for id in sorted(ids):                          // thứ tự tất định theo id
    q = state.quests.active[id]; def = catalog[id]
    node = nodeOf(def, q)                         // iosNodes thay nếu IOS
    if !matches(node, ev, q): continue            // so tham số nút với sự kiện
    if node.guard && !evalCond(node.guard, ctx(q)): continue
    tx = begin(state)                             // bản sao nông các khối quests/ledger/dao/flags/world
    applyAll(node.onDone, 'done')                 // bỏ qua aid đã áp
    advance(q, node, steps = 0)
    commit(tx) → checkInvariants; lỗi → rollback(tx), ghi trace, báo dev
    changed = true
  if changed: rebuildListeners(); saveSoon()
  return { changed, effects: applied }

advance(q, node, steps):
  if steps > 32: throw LoopError(id)              // chặn vòng lặp branch → branch
  to = first(node.next, e => !e.when || evalCond(e.when, ctx(q))).to
  if !to: q.stuck = true; return                  // validator đảm bảo không xảy ra; runtime vẫn phòng
  q.node = to; q.since = now; q.hist.push(...)
  n2 = nodeOf(def, q); applyAll(n2.onEnter, 'enter')
  if n2.type in ['branch', 'end']: (end → finish(q, n2.outcome)) else if auto-complete: advance(q, n2, steps + 1)
```

- **Độ phức tạp:** `dispatch` O(L × C) với L = số nhiệm vụ đang nghe loại sự kiện, C = kích thước cây điều kiện của nút (thường < 20 phép so). Số nhiệm vụ đồng thời dự kiến ≤ 40 (chính + nhánh + phụ + hằng ngày + đạo thống) → dưới 0,1 ms mỗi sự kiện.
- **Sự kiện `arrive`** chỉ phát khi vùng/POI/ô cổng **đổi**, không phát mỗi khung.
- **Giao dịch:** `begin` sao chép nông các khối có thể đổi; `commit` kiểm bất biến (phần 02 §8.6) rồi mới gán vào `state`. Lỗi giữa chừng không để lại trạng thái nửa vời.

### 10.4 Kết thúc nhiệm vụ

```
finish(q, outcome):
  if outcome == 'success': applyAll(def.rewards, 'reward')
  move active[id] → done[id] (success) | failed[id] (fail) | xóa (abandon)
  if def.repeat != 'none': lịch mở lại theo repeat (lưu done[id].at, available() xét lại)
  emit({ do: 'questEnd', id, outcome })
```

## 11. Phiên bản nội dung và di trú

| Tình huống | Xử lý |
|---|---|
| Nhiệm vụ đang làm, `def.v` tăng, nút hiện tại vẫn còn | giữ nguyên `q.node`; `q.v` cập nhật; `aid` cũ vẫn chặn áp lại (khóa có `@v` cũ nhưng hiệu ứng mới có `@v` mới → **chỉ** nút đã qua mới có thể áp lại; vì vậy khi đổi `v` mà không đổi nội dung nút đã qua, nút đó phải có `"stableAid": true` để khóa không gồm `v`) |
| Nút hiện tại bị xóa, có trong `migrate` | chuyển sang nút đích |
| Nút hiện tại bị xóa, không có trong `migrate` | lùi về `checkpoints` gần nhất trong `hist`; không có thì về `start` |
| Nhiệm vụ bị xóa khỏi danh mục | chuyển vào `orphan`, ẩn khỏi sổ, không xóa |
| Nhiệm vụ đã xong được viết lại | không làm lại; phần thưởng mới (nếu có) chỉ cho người chưa xong |

Validator chặn phát hành nếu: một nút bị xóa so với bản trước mà không có trong `migrate` **và** không có checkpoint nào trước nó.

## 12. iOS và nội dung nhạy cảm

1. `def.ios = 'off'` → không bao giờ hiện trên iOS (`available()` lọc).
2. `def.ios = 'alt'` → mọi nút `divination: true` phải có bản thay trong `iosNodes` (validator V9). Ví dụ: nút «xin quẻ ở Chính Điện» thay bằng «đọc giải nghĩa quẻ trong Tàng kinh các» (học, không đoán).
3. `def.sensitive = 'amta' | 'tl'` → `start()` yêu cầu `consent.amta`/`consent.tl` (hỏi qua màn xác nhận tự nguyện, như app). Không có consent thì nhiệm vụ không hiện trong `available()` và NPC dẫn tới dùng thoại thay thế.
4. Nút `aiTalk` trên iOS (`FEATURES.ai = false`) luôn dùng `fallbackDialogue` (bắt buộc có, validator V10).

## 13. Luật kiểm nội dung (validator)

`scripts/validate-content.mjs` chạy trong CI và trước mỗi bản build:

| Mã | Luật | Mức |
|---|---|---|
| V1 | JSON khớp SCHEMA-QUEST / NODE / COND / EFFECT / DIALOGUE / WINDOW (kiểu, khóa bắt buộc, không khóa lạ) | lỗi |
| V2 | `id` nhiệm vụ duy nhất toàn cục và đúng mẫu không gian tên canon §8 (`MQ-P-\d{2}`, `MQ-[1-4E]-\d{2}`, `BR-(TT\|DC\|NT\|DK)-\d{2}`, `SQ-<region>-\d{2}`, `TL-\d{2}`, `DQ-\d{2}`, `EV-[a-z]+-\d{2}`, `CQ-[a-z]+-\d{2}`) | lỗi |
| V3 | `start` và mọi `next[].to`, `options[].to` trỏ nút có thật | lỗi |
| V4 | Mọi nút tới được từ `start` | cảnh báo |
| V5 | Từ mọi nút tới được một nút `end` | lỗi |
| V6 | Mọi nút không phải `end` có ít nhất một cạnh không điều kiện, **hoặc** các `when` phủ hết (kiểm bằng cách thử tất cả tổ hợp giá trị biên của các biến được nhắc; nếu không chứng minh được thì yêu cầu cạnh mặc định) | lỗi |
| V7 | Mọi tham chiếu ngoài tồn tại: npc (canon §4 + danh sách `NPC-*`), region (canon §3), station (`STATIONS`), `MG-xx`, `CUT-xxx`, `DEED-xxx`, `PERK-*`, `UI-xx`, `PERSONA-*`, `BLD-*`, `POI-*` (đọc từ chỉ mục nội dung, phần 11 §6) | lỗi |
| V8 | `grantDaoHanh` chỉ ở `onDone`/`rewards`; `logFault` chỉ ở `options[].effects`; `amNo` chỉ ở `kind: 'tl'` | lỗi |
| V9 | `ios: 'alt'` → mọi nút `divination` có `iosNodes` | lỗi |
| V10 | Nút `aiTalk` có `fallbackDialogue` tồn tại | lỗi |
| V11 | Mọi khóa chuỗi `t:` có trong `text/vi.json` | lỗi |
| V12 | `StatPath` trong danh sách trắng | lỗi |
| V13 | Không vòng lặp gồm toàn nút tự động (`branch`) | lỗi |
| V14 | Đổi phiên bản: nút bị xóa có `migrate` hoặc checkpoint trước nó | lỗi |
| V15 | Tổng `grantDaoHanh.base` của một nhiệm vụ `daily` ≤ trần ngày | cảnh báo |
| V16 | Nhiệm vụ chính (`kind: 'main'`) không có `prereq` phụ thuộc `lop`/`tiemLuc` **mà không có nhánh cho mọi lớp** (tránh người chơi một lớp bị kẹt tuyến chính, trụ cột T2) | lỗi |
| V17 | `sensitive` đặt đúng cho nhiệm vụ có nhắc `amta`/Tà Lộ (quét tag) | cảnh báo |
| V18 | Thoại: cảnh không ai trỏ tới | cảnh báo |
| V19 | Văn bản tiếng Việt: chuỗi không có dấu ở chỗ cần dấu (bộ lọc từ phổ biến «khong», «duoc», «nguoi» …) | cảnh báo |
| V20 | Danh sách câu cấm chung (phán chết, phán bệnh, «mệnh đã định», mời mua) trong chuỗi thoại | lỗi |

## 14. Tích hợp với code hiện có

| Điểm nối | Thay đổi |
|---|---|
| `main.js › after()` | sau khi thưởng: `quests.dispatch({ t: 'stationDone' … })` nếu có kết quả; cập nhật HUD từ `journal()` |
| `main.js › openStation()` | bảng đóng → gian trả `result` (thêm hợp đồng: `STATION_OPEN[id](api)` có thể gọi `api.result(obj)`) |
| `state.js › recordCase()` | phát `caseGraded` qua `api.emit` (state vẫn thuần: trả thêm thông tin, `main.js` phát) |
| `state.js › rollDay()` | `main.js` phát `dayStart` khi ngày đổi |
| `main.js › loop()` | theo dõi `regionAt` + `cellAt` mỗi 0,5 s, phát `arrive` khi đổi |
| `state.js › tasks()` (3 việc ngày) | giữ nguyên ở M1; M2 chuyển thành `DQ-01…03` trong `dq.json` (TASK-139) |
| Sổ Mệnh | thêm thẻ «Nhiệm vụ» từ `journal()` |

## 15. Chế độ lỗi

| Lỗi | Phát hiện | Hậu quả nếu không xử lý | Cách xử lý |
|---|---|---|---|
| Nội dung sai lọt vào bản build | validator | kẹt nhiệm vụ | CI chặn; runtime gặp `stuck` → hiện nút «Báo kẹt» (ghi trace vào clipboard) + tự lùi checkpoint |
| Vòng lặp nút tự động | đếm bước > 32 | treo khung | `LoopError`, hủy giao dịch |
| Hiệu ứng áp hai lần do tải lại giữa chừng | `aid` | thưởng kép | no-op |
| Engine phụ trả `null` làm điều kiện sai | V16 + nhánh `any` | người chơi không mở được tuyến | nhánh dự phòng bắt buộc |
| Đồng hồ máy người chơi sai/cố tình chỉnh | so `Date.now()` với giờ máy chủ khi online | mở lễ tiết sớm | nhiệm vụ `event` có thưởng ghi Thiên Bảng cần xác nhận thời gian máy chủ (phần 04 §6) |
| Người chơi chỉnh `localStorage` | không chặn được ở client | gian lận tiến trình cá nhân | chấp nhận ở đơn; điểm xếp hạng chỉ tính phần đáng tin (phần 04) |
| Danh mục chưa nạp xong mà sự kiện tới | hàng đợi sự kiện | bỏ lỡ `arrive` | `dispatch` xếp hàng sự kiện tới khi `load` xong tệp liên quan (tối đa 64 sự kiện) |

## 16. Kiểm thử

| Bộ | Ca |
|---|---|
| `test-quest-cond.mjs` | mọi toán tử, `null`, `rand` tất định theo ngày, `time` qua 23 h (giờ Tý), âm lịch tháng nhuận, tiết khí Lập Xuân trước/sau |
| `test-quest-runtime.mjs` | nhiệm vụ mẫu đủ 13 loại nút; `parallel` cần 2/3; `choice` có guard; `aid` không áp hai lần khi mô phỏng tải lại giữa `onDone`; giao dịch rollback khi bất biến sai; vòng lặp branch bị chặn; di trú `migrate` và checkpoint |
| `test-quest-ios.mjs` | chạy với `IOS = true`: nhiệm vụ `off` ẩn, `alt` dùng `iosNodes`, `aiTalk` dùng fallback |
| `test-quest-content.mjs` | gọi validator trên toàn bộ `src/game/data` (CI) |
| `test-dialogue-md.mjs` | chuyển các khối kịch bản mẫu của canon và tài liệu 03 sang JSON, so ảnh chụp kỳ vọng |
| Mô phỏng lớp (`sim-quests.mjs`) | 4 lá số đại diện 4 lớp (`MAU-*`) chơi tự động tuyến chính bằng bot chọn phương án đầu tiên hợp lệ: phải tới `MQ-E` không kẹt (chạy hằng đêm từ M3) |

## 17. Ví dụ đầy đủ (minh họa, số hiệu thật do tài liệu 03 cấp)

```json
{
  "id": "MQ-1-03", "v": 1, "kind": "main", "giver": "van_coc", "region": "vancoc",
  "title": "t:MQ-1-03.title", "summary": "t:MQ-1-03.summary",
  "prereq": { "quest": { "id": "MQ-1-02", "is": "done" } },
  "ios": "same", "start": "n1", "checkpoints": ["n1", "n3"],
  "nodes": {
    "n1": { "type": "goto", "title": "t:MQ-1-03.n1", "target": { "region": "vancoc" }, "next": [ { "to": "n2" } ] },
    "n2": { "type": "talk", "npc": "van_coc", "dialogue": "MQ-1-03", "entry": "MQ-1-03.2",
            "onDone": [ { "do": "openUi", "ui": "UI-xx", "args": { "tab": "menhdo" } } ], "next": [ { "to": "n3" } ] },
    "n3": { "type": "parallel", "title": "t:MQ-1-03.n3", "need": 3, "checkpoint": true,
            "goals": [ { "id": "g1", "node": { "type": "deed", "deed": "DEED-xxx", "count": 1 } },
                       { "id": "g2", "node": { "type": "deed", "deed": "DEED-yyy", "count": 1 } },
                       { "id": "g3", "node": { "type": "case", "caseKind": "npc", "minScore": 0.6 } } ],
            "next": [ { "to": "n4" } ] },
    "n4": { "type": "branch", "next": [
            { "to": "n5nt", "when": { "any": [ { "stat": { "path": "mb.tiemLuc", "op": "<", "v": 46 } }, { "lop": "NT" } ] } },
            { "to": "n5" } ] },
    "n5nt": { "type": "talk", "npc": "van_coc", "dialogue": "MQ-1-03", "entry": "MQ-1-03.6nt", "next": [ { "to": "end" } ] },
    "n5": { "type": "talk", "npc": "van_coc", "dialogue": "MQ-1-03", "entry": "MQ-1-03.6", "next": [ { "to": "end" } ] },
    "end": { "type": "end", "outcome": "success" }
  },
  "rewards": [ { "do": "grantDaoHanh", "base": 20 }, { "do": "setFlag", "name": "so_cong_qua" } ]
}
```

(`DEED-xxx`, `DEED-yyy`, `UI-xx` là chỗ giữ cho mã của tài liệu 05 và 12; validator V7 sẽ báo lỗi cho tới khi thay bằng mã thật.)

## 18. Vết chạy mẫu (`debug.trace`) của ví dụ §17 với `MAU-A`

`MAU-A`: Tiềm Lực 41, lớp DC. Đồng hồ giả bắt đầu 2026-11-05 20:00.

```
#  t (giả)   sự kiện                        nhiệm vụ.nút        hành động                                        trạng thái sau
1  20:00:00  start('MQ-1-03')               —                   prereq: quest MQ-1-02 done ✓                       active{node:n1}
2  20:03:10  arrive{region:'vancoc'}        MQ-1-03.n1 goto     khớp target.region; onDone[] rỗng; → n2            node:n2; onEnter n2 rỗng
3  20:03:15  talk{npc:'van_coc'}            MQ-1-03.n2 talk     mở thoại MQ-1-03 cảnh .2 (không hoàn thành nút)    node:n2
4  20:06:40  dialogueEnd{scene:'.3a'}       MQ-1-03.n2          onDone: openUi(UI-xx) aid=…:n2:done:0; → n3       node:n3 (parallel), goals{g1,g2,g3:false}; checkpoint
5  20:20:02  deedLogged{deed:DEED-xxx}      MQ-1-03.n3.g1       g1 = true (1/3)                                    goals{g1:true}
6  20:35:44  caseGraded{npc, 0.71}          MQ-1-03.n3.g3       0.71 ≥ 0.6 → g3 = true (2/3)                       goals{g1,g3}
7  21:02:13  deedLogged{deed:DEED-yyy}      MQ-1-03.n3.g2       g2 = true (3/3) → need đạt → n4 (branch)           —
8  21:02:13  (tự động)                      MQ-1-03.n4 branch   when any(tiemLuc<46 ✓, lop NT ✗) = true → n5nt     node:n5nt
9  21:05:30  dialogueEnd{scene:'.6nt'}      MQ-1-03.n5nt        → end (success)                                    —
10 21:05:30  (tự động)                      MQ-1-03.end         rewards: grantDaoHanh(base 20) → daoHanhGain       done{at, success}
                                                                 = round(20 × nghichThien(41)=1,19) = 24 (chưa trần ngày 120)
                                                                 setFlag so_cong_qua
```

Nếu tải lại trang giữa dòng 4 (sau khi `openUi` đã áp nhưng trước `commit`): giao dịch chưa ghi → khi tải lại, `dialogueEnd` được phát lại khi người chơi kết thúc cảnh; `aid …:n2:done:0` chưa có trong `applied` nên hiệu ứng áp một lần. Nếu tải lại **sau** `commit`: `node = n3`, sự kiện `dialogueEnd` không còn khớp nút nào — không áp lại.
