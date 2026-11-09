# 13.18 · Phụ lục C — Giao diện module đích và điểm nối với code hiện có

> Phụ lục này là «bản vẽ lắp ráp» cho kỹ sư: cây thư mục đích, chữ ký xuất của từng module mới (JSDoc rút gọn), các thay đổi chữ ký ở module cũ, luật phụ thuộc và chia chunk. Đặc tả hành vi nằm ở phần 02–08; ở đây chỉ hợp đồng.

## C.1 Cây thư mục đích

```
src/game/
  (đã có — giữ) mount.js markup.js main.js state.js features.js progress.js cosmetics.js wardrobe-ui.js
                accessories.js effects.js characters.js models.js textures.js assets.js terrain.js world3d.js
                landmarks.js court.js sect.js world.js obstacles.js collide.js lights.js interior.js render3d.js
                render.js stations.js cases.js case-ui.js halls.js dz-case.js zheri-case.js npc.js master-ui.js
                que-ui.js vanmenh.js thaitue.js vanmenh-ui.js net.js protocol.js audio.js haptics.js names.js
  coords.js            MỚI  ô ↔ mét, một nguồn (TASK-017)
  save2.js             MỚI  lưu v2: createState2, migrate1to2, hydrate2, saveSoon (TASK-018, TASK-019)
  menhban.js           MỚI  Mệnh Bàn (TASK-007 … TASK-011)
  realm.js             MỚI  cảnh giới, Đạo Hạnh (TASK-023)
  text.js              MỚI  chuỗi t:… (TASK-066)
  quests/
    cond.js            MỚI  evalCond (TASK-025)
    runtime.js         MỚI  createQuestRuntime (TASK-026 … TASK-027, TASK-087, TASK-088)
    dialogue.js        MỚI  trình chạy thoại thuần (TASK-028)
    events.js          MỚI  bus sự kiện game (TASK-032)
  ledger.js            MỚI  Sổ Công Quá client (TASK-091)
  persona.js           MỚI  buildGameContext, postFilter, crisisGate (TASK-037 … TASK-039)
  ui/
    menhban-ui.js      MỚI  màn Mệnh Bàn (TASK-021, TASK-022)
    dialogue-ui.js     MỚI  hộp thoại (TASK-028)
    npc-chat-ui.js     MỚI  trò chuyện persona (TASK-042)
    journal-ui.js      MỚI  sổ nhiệm vụ (TASK-031)
    ledger-ui.js       MỚI  Sổ Công Quá (TASK-092)
    menhdo-ui.js       MỚI  Mệnh Đồ (TASK-093)
    consent-ui.js      MỚI  đồng ý (TASK-059)
    realm-ui.js        MỚI  cảnh giới (TASK-176)
  world/
    collide-core.js    MỚI  cắt lát/raster thuần (TASK-074)
    place.js           MỚI  placeTransform thuần (TASK-074)
    cells.js           MỚI  ô cổng (TASK-077 … TASK-080)
    buildings.js       MỚI  nạp SCHEMA-BUILDING, dựng nội thất (TASK-081, TASK-082)
    colgrid.js         MỚI  lưới bit theo ô streaming (TASK-138)
    stream.js          MỚI  streamer (TASK-132)
    terrain-worker.js  MỚI  Web Worker địa hình (TASK-134)
    nav.js             MỚI  đồ thị đường, findPathLong (TASK-140)
  perf/
    hud.js             MỚI  ?perf=1 (TASK-045)
    quality-ctl.js     MỚI  điều chỉnh thích ứng (TASK-151)
  net/
    account.js         MỚI  token thiết bị (TASK-095)
    cloud.js           MỚI  lưu đám mây (TASK-099)
    config.js          MỚI  cấu hình từ xa (TASK-097)
    analytics.js       MỚI  lô sự kiện (TASK-118)
  data/                MỚI  quests/ dialogue/ text/ personas/ buildings/ interiors/ kits/ regions/ deeds.json perks.json
                            mau-charts.json brief-sections.json crisis-patterns.json crisis-resources.json skus.json
worker/
  index.js             SỬA  thêm nhánh /api/hq/*; miễn giới hạn KV cho tài sản tĩnh
  quan-room.js         SỬA  v2: AOI, mvb, START dùng chung
  hq/
    router.js auth.js vault.js tb.js sect.js ai.js ev.js config.js receipt.js
    pay/apple.js pay/stripe.js pay/vnpay.js
scripts/
  tests/               MỚI  test node:test
  lib/mini-schema.mjs  MỚI
  lint-tengod.mjs gen-mau-charts.mjs dialogue-from-md.mjs validate-content.mjs validate-ids.mjs validate-assets.mjs
  validate-buildings.mjs bake-collision.mjs interior-fit.mjs build-stream.mjs build-nav.mjs build-skyline.mjs
  bench-scenes.mjs check-bundle.mjs load-quan.mjs sim-quests.mjs sim-economy.mjs fuzz-protocol.mjs
  credits-report.mjs asset-sheet.mjs e2e-game.mjs verify-ios-game.mjs
```

## C.2 Luật phụ thuộc

| # | Luật | Kiểm |
|---|---|---|
| L1 | Module thuần (`coords`, `save2`, `menhban`, `realm`, `quests/*`, `ledger`, `persona` (trừ UI), `world/collide-core`, `world/place`, `world/colgrid`, `world/nav`, `perf/quality-ctl`, `protocol`, `cosmetics`, `state`, `progress`, `terrain`, `court`, `world`, `obstacles`) **không** import THREE, DOM, `import.meta.env` trực tiếp (cờ nền tảng nhận qua tham số hoặc `features.js`) | script `scripts/lint-pure.mjs`: phân tích import tĩnh, CI fail khi vi phạm |
| L2 | Chỉ `menhban.js`, `stations.js`, `cases.js`, `halls.js`, `dz-case.js`, `zheri-case.js`, `vanmenh.js`, `thaitue.js`, `interior.js`, `que-ui.js`, `master-ui.js`, `persona.js`, `ui/menhdo-ui.js` được import `src/engine/*` | `lint-pure` |
| L3 | Module UI (`ui/*`) không ghi `state` trực tiếp; gọi API runtime (`quests.choose`, `ledger.log`…) | review |
| L4 | `worker/**` chỉ import từ `src/game` các module thuần (hiện có `protocol.js`, `cosmetics.js`; thêm `court.js`, `coords.js`, `npc.js`, `cases.js`) | `lint-pure` + build Worker |
| L5 | Không vòng import | `madge`-tương đương tự viết trong `lint-pure` |

## C.3 Chữ ký module thuần

### C.3.1 `coords.js`

```js
/** @typedef {{x:number, y:number}} Tile  @typedef {{x:number, z:number}} Meter */
export const U = 1.6;                              // m/ô
export const ORIGIN = { x: 10, y: 7 };             // ô của mét (0,0)
/** @returns {Tile} */  export function toTile(X, Z)
/** @returns {Meter} */ export function toWorld(x, y)
export const cellOf = (v) => Math.floor(v / 0.5);  // ô va chạm (dùng lại trong obstacles)
```

### C.3.2 `save2.js`

```js
export const KEY2 = 'huyenquan:v2';
/** @returns {SaveV2} */ export function createState2(now = new Date())
/** @param {object} s1 kết quả state.js › hydrate (v1) @returns {SaveV2} */ export function migrate1to2(s1, now)
/** @throws Error('bad state') */ export function hydrate2(raw, now)
/** @returns {SaveV2} */ export function loadState2(storage, now)
/** @returns {boolean} */ export function save2(s, storage)
export function createSaver(storage, { delayMs = 800 } = {}) // → { soon(s), now(s), flush() }
export function checkInvariants(s)                // ném lỗi mô tả bất biến vi phạm
export function mergeSaves(local, remote)         // phần 08 §4.2 — thuần, giao hoán ở khối hợp tập
```

`state.js` giữ nguyên các hàm hiện có (`grantDaily`, `recordCase`…), nhận đối tượng v2 vì v2 là siêu tập của v1.

### C.3.3 `menhban.js`, `realm.js`

Như phần 02 §2, §6. Bổ sung:

```js
export function diffMenhBan(a, b)                 // → [{ path, from, to }] chỉ trường Tiên Thiên
export function shortCard(mb)                     // → chuỗi ≤ 800 ký tự (Mệnh Bàn rút gọn, phần 05 §5.2)
// realm.js
export const REALM_CUTS = [0, 100, 400, 1000, 2200, 4500];
export const REALM_NAMES = { dao: [...], phat: [...], nho: [...] };  // canon §5
export function realmOf(T, D) → 1..6
export function realmShown(T, D, realmMax) → { tier, short: number }   // short = Đạo Hạnh còn thiếu để về realmMax
export function daoHanhGain(opts) → int
export function applyDaoHanh(s, gain, { now, cap }) → { added, capped }  // ghi dao.today, dao.daoHanh, realmMax
```

### C.3.4 `quests/*`

```js
// cond.js
/** @param {Cond} c @param {CondCtx} ctx @returns {boolean} */ export function evalCond(c, ctx)
/** @returns {{label:string, ok:boolean}[]} */ export function explainCond(c, ctx)
/** @typedef {{ mb, dao, ledger, flags, vars, quests, level, phucKhi, streak, region, visited, now, features, consent, perks, rand }} CondCtx */
export function makeCtx({ state, mb, region, now, features, questId, pid }) → CondCtx

// runtime.js — phần 03 §10.1
export function createQuestRuntime(deps) → QuestRuntime
/** @typedef {{ load, dispatch, tick, available, start, choose, explainBlocked, journal, markers, debug }} QuestRuntime */

// dialogue.js
export function createDialogueRunner({ dialogue, ctx, onEffects }) → {
  scene(id) → { place, time, weather, lines },
  next() → Line | Choice | { end: true },
  pick(optionId) → void,                          // kiểm guard, áp effects qua onEffects (aid theo cảnh/phương án)
}

// events.js
export function createBus() → { on(type, fn), off(type, fn), emit(ev) }   // đồng bộ; không await
```

### C.3.5 `ledger.js`, `persona.js`

Như phần 04 §4 và phần 05 §5–6. Chữ ký `persona.js`:

```js
export function buildGameContext({ state, mb, quests, ledger, region, persona, now }) → { text, allow }
export function postFilter(answer, { persona, allow, briefSent, terms }) → { text, removed: number, neo }
export function crisisGate(text, patterns) → { hit: boolean, category?: string }
export function noteFromSession(question, npc, now) → string | null   // ghi nhớ persona bằng luật
export function buildTermDictionary(engineMods) → Set<string>         // thuật ngữ cổ pháp không bị gỡ
```

### C.3.6 `world/*`

```js
// place.js
/** @returns {{ scale:number, position:{x,y,z}, ry:number }} */
export function placeTransform(bbox /* {min:{x,y,z}, max:{x,y,z}} */, fit, at)
// collide-core.js
export function sliceTriangles(positions /*Float32Array*/, indices /*Uint32Array|null*/, matrix /*number[16]*/, y0, y1, mark)
export function rasterPoly(poly, mark)            // như collide.js hiện tại, không THREE
// cells.js (không thuần — cần camera) — phần 06 §4.1
// buildings.js
export function loadBuilding(def, { scene, cells, assets, obstacles }) → Promise<BuildingHandle>
/** @typedef {{ id, dispose(), visibleCells:Set<string>, setDoorOpen(id, bool) }} BuildingHandle */
// colgrid.js
export function createColGrid() → { setRasters(cellKey, rasters[]), solidAt(x, z, layer), surfaceAt(x, z, nearY), stats() }
// stream.js — phần 07 §4.1;  nav.js
export function loadNavPiece(json) ; export function findPathLong(from, to, { findPath, graph }) → Point[]
```

### C.3.7 `perf/quality-ctl.js`

```js
export const KNOBS = ['bloom', 'pixelRatio', 'shadowSize', 'shadows', 'treesNear', 'nearRing', 'particles'];
export function createQualityCtl({ budgetMs, userCap, apply, now = () => performance.now() }) → {
  sample(frameMs),          // gọi mỗi khung
  level,                    // 0..7
  forceLevel(n),
}
```

### C.3.8 `net/*`

```js
// account.js
export function createAccount({ fetchImpl = fetch, storage }) → { token(): Promise<string|null>, acc, recover(code), forget(), onChange(fn) }
// cloud.js
export function createCloudSync({ account, saver, mergeSaves, intervalMs = 300000 }) → { start(), stop(), syncNow(), status }
// config.js
export function createRemoteConfig({ fetchImpl, local = FEATURES }) → { get(), refresh(), isOn(feature), questOff(id), personaOff(id) }
// analytics.js
export function createAnalytics({ consent, fetchImpl, platform, av, cv, quality }) → { track(n, k, v), flush(beacon = false) }
```

## C.4 Thay đổi ở module hiện có

| Module | Thay đổi | Tương thích ngược |
|---|---|---|
| `main.js › startGame` | tạo `bus`, `quests`, `ledger`, `menh`, `account`, `cloud`, `config`, `analytics`; `api` thêm `emit(ev)`, `result(obj)`, `quests`, `ledger`, `mb()`, `openUi(id, args)`; `after()` phát sự kiện; theo dõi `regionAt`/`cellAt` mỗi 0,5 s | `api` cũ giữ mọi trường; gian cũ không gọi `result` vẫn chạy |
| `main.js › step` | `blockedAt(x, y, from, layer)`; cập nhật `player.layer` theo `surfaceAt` | `layer` mặc định 0 |
| `main.js › showBirth/ceremony` | sau «Mặc phẩm phục»: `menh.build(R)`, `quests.start('MQ-P-…')` | người chơi cũ có `birth` nhận nhiệm vụ mở đầu rút gọn |
| `state.js` | không đổi API; `loadState/saveState` chuyển sang `save2.js` qua lớp bọc | test cũ dùng `state.js` vẫn xanh (v2 là siêu tập) |
| `world.js` | `blockedAt` thêm `layer`; `findPath` nhận `layer`; `ROOMS.origin` dời (TASK-071); `STATIONS` nhận trạm từ `buildings` | |
| `obstacles.js` | khóa có lớp, chủ sở hữu (phần 06 §5.1); sau M2 ủy quyền cho `colgrid.js` | các hàm cũ là trường hợp `layer = 0` |
| `collide.js` | gọi `collide-core.js`; `addFootprint` thêm `{ layer, owner }` | |
| `assets.js` | `acquire/release`, `modelUrl` tra `models/index.json`, chọn biến thể KTX2 | `loadModel` giữ chữ ký |
| `world3d.js` | địa hình macro + worker; `groundY(x, z, nearY)` | `nearY` tùy chọn |
| `landmarks.js` | thành nguồn «spots» cho streamer; bỏ tập `done` | |
| `render3d.js › create3D` | nhận `{ cells, stream, quality }`; `S` thêm `layer`, `playerCell`; `lowQuality` thay bằng `quality-ctl`; nhân vật dùng uniform màu | hợp đồng `{ resize, frame, yaw, rotate, celebrate, mode }` giữ |
| `interior.js` | còn dùng cho phòng túi (Âm ty, mạn-đà-la); điện thật chuyển sang `buildings.js` | |
| `lights.js` | `addLight({ cell })`; `room` thành bí danh | |
| `characters.js › tintMaterial` | màu qua uniform, `customProgramCacheKey` cố định | hình ảnh giữ nguyên |
| `net.js` | v2: `tok`, `region`, `cv`, `mvb`; tách phòng theo vùng | client v1 bị yêu cầu tải lại |
| `protocol.js` | `VERSION = 2`, biên mới, gói mới, giới hạn theo loại | `parseClient` v1 giữ cho test lịch sử |
| `stations.js › chartOf` | LRU + `refYear` | chữ ký thêm tham số tùy chọn |
| `master-ui.js` | Thầy Tử Bình chuyển sang `npc-chat-ui` với persona `thay_tubinh` | nút «Nhờ Thầy luận thêm» giữ |
| `features.js` | thêm `FEATURES.persona`, `FEATURES.thoiVan`, `FEATURES.tl` | |
| `engine/ai.js › askAI` | tham số mới (phần 05 §3) | `persona = null` giống từng byte |
| `engine/core.js` | `normGod`, `godsOf` | thêm, không đổi hàm cũ |

## C.5 Chia chunk Vite

Thêm vào `vite.config.js › manualChunks`:

| Mẫu đường dẫn | Chunk | Lý do |
|---|---|---|
| `/src/game/quests/`, `menhban.js`, `realm.js`, `ledger.js`, `save2.js`, `text.js` | `game` (mặc định cùng `main.js`) | cần ngay khi vào |
| `/src/game/persona.js`, `/src/game/ui/npc-chat-ui.js` | `engine-ai` | đi cùng `ai.js` (nạp lười) |
| `/src/game/world/`, `/src/game/perf/` | `render3d` | đi cùng cảnh 3D |
| `/src/game/net/` | `game` | nhỏ |
| `/src/game/data/quests/mq-2…` trở đi, `dialogue/` theo hồi | tệp JSON tĩnh trong `public/data/` thay vì import | nạp lười theo hồi, không phình chunk |

Ngân sách: chunk `game` ≤ 250 KB, `render3d` ≤ 900 KB (phần 09 §6.2).

## C.6 Trình tự khởi động đích

```
mountGame(host)
 └─ startGame()
     ├─ save2.loadState2(storage)                         // di trú v1 nếu cần
     ├─ config = createRemoteConfig(); config.refresh()   // không chặn; dùng bản đệm
     ├─ account = createAccount()                         // không chặn
     ├─ bus = createBus(); ledger = createLedger(); quests = createQuestRuntime({ … })
     ├─ showGate()
     │    └─ có birth → R = chartOf(birth); mb = buildMenhBan(R); kiểm diff engine
     └─ enter()
          ├─ renderer = create3D(canvas, { cells, stream, quality })   // 2D nếu thất bại
          ├─ stream.update(START) → chờ ô (9,9) vòng N có va chạm (≤ 3 s, quá thì vào với va chạm nướng)
          ├─ quests.load(index) ; quests.tick(now)
          ├─ net.start() ; cloud.start() ; analytics.track('session_start')
          └─ loop()
```

Thời gian mục tiêu từ bấm «Bước qua cổng» tới khung hình đầu: ≤ 3 s trên mid với bộ đệm ấm; ≤ 8 s lần đầu (phần 09 §2.1).
