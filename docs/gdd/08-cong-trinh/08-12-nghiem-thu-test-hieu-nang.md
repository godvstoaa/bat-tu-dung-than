# 08-12 · Nghiệm thu: Definition of Done · test tự động · duyệt art · kế hoạch đo hiệu năng

> Một công trình chỉ được đánh dấu «xong» trong bảng đăng ký (08-01 §10) khi qua **cả bốn cửa**: (1) phiếu Definition of Done, (2) test tự động xanh, (3) duyệt art có chữ ký, (4) đo hiệu năng trong ngưỡng. Phần này định nghĩa từng cửa đủ chi tiết để người khác làm mà không phải hỏi lại.

---

## 1. Definition of Done — phiếu từng công trình

### 1.1 Phiếu (mỗi INT một bản, lưu `docs/art/<vùng>/<INT>.md`)

| # | Nhóm | Tiêu chí | Cách kiểm | A | B | C | D | E |
|---|---|---|---|---|---|---|---|---|
| D01 | Vỏ | Vỏ đặt đúng `shell.at` / `fit` của công thức (trùng lời gọi `placeModel` thật) | T-02 | ● | ● | ● | ● | ● |
| D02 | Vỏ | Mọi cửa đi nhìn thấy đã khoét thật, có khung che vết cắt | P6 + ảnh | ● | ● | ● | ○ | ○ |
| D03 | Vỏ | Không lấn tường / công trình khác (khung bao không giao) | T-03 | ● | ● | ● | ● | ● |
| D04 | Vỏ | Công trình phụ nằm trọn trong tầng nền đặt nó | T-04 | ● | ● | ● | ● | — |
| D05 | Khoang | Mọi lòng kín ≥ 9 m² (đo `bld-void`) là khoang đi được hoặc khoang khóa hợp lệ | T-05 | ● | ● | ● | — | — |
| D06 | Khoang | Mọi tầng có cửa sổ / lan can nhìn thấy đều tới được | T-08 | ● | ● | ● | — | — |
| D07 | Khoang | Khoang khóa ≤ 20 % diện tích sàn, có lý do, nhìn được vào, có điều kiện mở | T-06 + duyệt | ● | ● | ● | — | — |
| D08 | Đi lại | Từ đường chính tới cửa, vào mọi khoang, ra lại — không dịch chuyển | T-07, T-08 | ● | ● | ● | ● | ● |
| D09 | Đi lại | Không có ô trống bị cô lập trong công trình (không «kẹt») | T-09 | ● | ● | ● | ● | ● |
| D10 | Đi lại | Bậc chênh ≤ 0,41 m; tầng đổi đúng ở `switchY` | T-10 | ● | ● | ● | ● | ● |
| D11 | Đi lại | Cửa rộng hình học ≥ 2,4 m (A / B chính), ≥ 1,8 m (C); khoảng trống trước cửa ≥ 2,4 m | T-11 | ● | ● | ● | — | — |
| D12 | Cửa | Lịch cửa đúng; lối nối vùng có ngách đêm | T-12 | ● | ● | ● | — | ● |
| D13 | Cửa | Cánh cửa mở không quét vào vật cản (chừa ≥ 1,7 m sau bản lề) | T-13 | ● | ● | ● | — | ● |
| D14 | Tương tác | Đủ số trạm theo hạng; mỗi trạm có `engine` hoặc `quest` | T-14 | ● | ● | ● | ● | ● |
| D15 | Tương tác | Mọi trạm đứng được và tới được từ cửa | T-15 | ● | ● | ● | ● | — |
| D16 | Tương tác | Trạm tầng trên không bị `nearestStation` bắt khi đứng tầng dưới | T-16 | ● | ● | ● | — | — |
| D17 | NPC | NPC theo lịch: có mặt đúng giờ, neo đứng trên ô trống | T-17 | ● | ● | ● | ○ | — |
| D18 | Ánh sáng | Mỗi khoang ≥ 1 nguồn sáng thật; đèn cách tường ≥ 0,6 m; ≤ `lightsMax` | T-18 | ● | ● | ● | ○ | — |
| D19 | Ánh sáng | Ngày / đêm trong nhà đúng (ảnh 2 giờ: Ngọ và Tý) | ảnh `debugHour` | ● | ● | ● | ○ | — |
| D20 | Ánh sáng | Không lọt sáng qua tường sang khoang không thấy | thử tay | ● | ● | ● | — | — |
| D21 | Âm | Vang đúng kiểu, nền đúng giờ, che âm qua cửa đúng | nghe | ● | ● | ● | ○ | — |
| D22 | Camera | Không thấy xuyên tường / mặt sau vỏ trong vòng thử 08-03 §8.7 | thử tay | ● | ● | ● | ● | — |
| D23 | Camera | Mái / tầng trên mờ đúng luật; mái vẫn đổ bóng khi mờ | ảnh | ● | ● | ● | — | — |
| D24 | Hiệu năng | Trong ngưỡng 08-01 §12 ở khoang lớn nhất, máy `mid` | §5 | ● | ● | ● | ● | — |
| D25 | Hiệu năng | Nội thất ẩn khi không thấy (portal culling) | T-19 + đo draw call | ● | ● | ● | — | — |
| D26 | MMO | `mv` có `l`; avatar người khác hiện đúng tầng; vật dùng chung đồng bộ | `test:mmo` mở rộng | ● | ● | ○ | — | — |
| D27 | Lưu | Thoát giữa chừng trong nhà → mở lại đúng tầng, không kẹt | T-20 | ● | ● | ● | — | — |
| D28 | iOS | Công năng thay thế khi trạm bị `features.js` tắt; không vỏ rỗng | T-21 | ● | ● | ● | ● | — |
| D29 | Nội dung | Đồ thờ đúng tín ngưỡng, không trộn biểu tượng; chữ Hán có Hán Việt + nghĩa | duyệt §3 | ● | ● | ● | ● | — |
| D30 | Ảnh | Bộ ảnh nghiệm thu đủ theo hạng (08-01 §2) | `docs/art/<vùng>/` | ● | ● | ● | ● | ● |

● bắt buộc · ○ nếu có · — không áp dụng.

### 1.2 Mẫu phiếu

```markdown
# INT-SM-CHINHDUONG — phiếu nghiệm thu
- Phiên bản công thức: sm-chinhduong.js@<git sha> · col.json hash: sha1:…
- Người làm: … · Người duyệt art: … · Người duyệt nội dung: …
| # | Kết quả | Ghi chú / ảnh |
|---|---|---|
| D01 | ✅ | |
| D02 | ✅ | cut-front.png |
| …   |    | |
- Đo hiệu năng (máy mid · iPhone 12): khoang `cd.l0.chinh` p50 47 fps / p95 38 fps · 182 draw · 610k tam giác
- Kết luận: ĐẠT / CHƯA ĐẠT (lý do)
```

---

## 2. Test tự động — `scripts/test-game-buildings.mjs` (chưa có — cần làm)

### 2.1 Nguyên tắc

- Chạy bằng Node, cùng kiểu `scripts/test-game-state.mjs` (hàm `test(name, fn)`, `assert/strict`, đếm số test đạt).
- **Không cần trình duyệt**: đọc công thức (`src/game/int/index.js`), đọc va chạm nướng (`public/bld/*.col.json`) vào `obstacles.js` bằng `addBakedCells` (08-02 §6.5). Nhờ vậy test thấy **đúng** va chạm của mô hình như trình duyệt.
- Thêm vào `package.json › scripts.test:game` (nối sau `test-game-cosmetics.mjs`).
- Thời gian chạy mục tiêu ≤ 60 s cho toàn bộ công trình đang có (≈ 120 INT kể cả 36 nhà).

### 2.2 Danh sách test

| Mã | Tên | Kiểm gì | Ngưỡng |
|---|---|---|---|
| T-01 | Công thức hợp lệ | trường bắt buộc (08-03 §2.1), id duy nhất, khoang không chồng cùng `lv`, cửa nhìn trỏ khoang có thật | 100 % |
| T-02 | Vỏ khớp chỗ đặt thật | `shell.model / fit / at` trùng bảng chỗ đặt trích từ `sect.js`, `landmarks.js` (bảng `SHELL_PLACEMENTS` xuất ra từ hai tệp này, chưa có — cần làm) | 100 % |
| T-03 | Không giao khung bao | khung bao chân mọi vỏ (theo kích thước đo `size × scale`) không giao nhau và không giao tường quán / tường thành | 0 cặp giao (trừ danh sách ngoại lệ có lý do: cổng vắt qua tường) |
| T-04 | Nằm trong tầng nền | công trình đặt trên `terrace` nằm trọn trong mặt tầng đặt nó | 100 % |
| T-05 | Lòng nào cũng có khoang | so `void.json` với khoang: mỗi vùng lòng ≥ 9 m² phủ ≥ 80 % bởi khoang hoặc khoang khóa | 100 % |
| T-06 | Khoang khóa hợp lệ | ≤ 20 % sàn; có `lockReason`, `unlock`; không chứa trạm chuỗi chính | 100 % |
| T-07 | Vào được từ đường | `findPath3(start vùng, door:out)` khác rỗng và đi bộ mẫu 0,1 ô không cắt ô chặn | mọi cửa ra `out` |
| T-08 | Tới mọi khoang mọi tầng | từ `door:in` tới tâm mỗi khoang (cùng `lv`) | 100 % khoang không khóa |
| T-09 | Không ô cô lập | loang (flood fill) ô trống từng `lv` từ mọi `door:in` + chân / đỉnh thang: mọi ô trống trong khung khoang đều được chạm | 0 ô cô lập (trừ ô trong hộp đồ đạc `H`) |
| T-10 | Bậc và đổi tầng | đi theo dải bậc mỗi 0,25 m: chênh ≤ 0,41; `lv` đổi đúng một lần ở `switchY` | 100 % |
| T-11 | Bề rộng cửa | ô trống liên tiếp qua ngưỡng ≥ 3 ô (1,5 m) cho cửa C, ≥ 4 ô cho A / B; trống 2,4 m trước cửa | 100 % |
| T-12 | Lịch cửa và luật không nhốt | `doors.SCHEDULES` cho từng giờ (12 giờ can chi): lối nối vùng có đường lúc 0 giờ | 100 % |
| T-13 | Cánh cửa quét | cung quét cánh (bán kính = bề rộng cánh) không có ô chặn | 100 % |
| T-14 | Số trạm và nối engine | trạm ≥ theo hạng; trường `engine` trỏ tới module có thật trong `src/engine/` hoặc `src/game/` (kiểm tệp tồn tại + tên xuất tồn tại); `quest` khớp mẫu mã `MQ-*` / `SQ-*` / `CQ-*` / `DQ-*` | 100 % |
| T-15 | Trạm đứng được | `blockedAt(spot, lv) === false`; `findPath3(door:in → spot)` khác rỗng; cuối đường `nearestStation` đúng trạm | 100 % |
| T-16 | Trạm khác tầng | đứng ở mọi trạm `lv k`: `nearestStation` không trả trạm `lv ≠ k` | 100 % |
| T-17 | NPC theo lịch | mỗi giờ: mỗi neo NPC có mặt nằm trên ô trống cùng `lv`, không trùng `spot` trạm (cách ≥ 0,8 m) | 100 % |
| T-18 | Đèn | mỗi khoang không khóa ≥ 1 đèn; đèn cách mặt khoang ≥ 0,6 m; số đèn khai ≤ `lightsMax` × 2 | 100 % |
| T-19 | Cửa nhìn hình học | tứ giác cửa nhìn nằm trên mặt khoang (sai ≤ 0,05 m), pháp tuyến từ `a` sang `b` | 100 % |
| T-20 | Lưu / mở lại trong nhà | `s.int.last` trong mọi khoang → `loadState` + `migrateLegacyPos` trả điểm trống cùng `lv` | 100 % |
| T-21 | Bản iOS | với `IOS = true` giả lập: mọi công trình vẫn ≥ số trạm theo hạng (tính cả trạm thay thế `ios`) | 100 % |
| T-22 | Chuyển phòng cũ | sáu khung `ROOMS` cũ → `migrateLegacyPos` trả `door:in` đúng công trình | 6 / 6 |
| T-23 | Nhà dân tất định | sinh gia đình 36 nhà hai lần cùng năm → giống hệt; hai nhà kề không trùng nghề | 100 % |
| T-24 | Hướng nhà | hướng tính từ `ry` (bảng 08-09 §3.2) khớp `fengshui-compass › shanFromDegree` | 36 / 36 |
| T-25 | Va chạm nướng còn mới | `hash` trong `col.json` = hash (vỏ + công thức + phiên bản bộ) | 100 % |
| T-26 | Mảnh mô-đun có thật | mọi mã `MOD-*` trong công thức có trong danh mục bộ (xuất từ GLB bộ ra `kit/<bộ>.json`) | 100 % |
| T-27 | Giao thức tầng | `parseClient({ t: 'mv', …, l: 3 })` giữ `l`; `l` sai kiểu → 0 | — |
| T-28 | Vật dùng chung | `parseClient({ t: 'ix', o, a })`: chỉ nhận vật / hành động trong danh sách trắng | — |
| T-29 | Thang xoắn | `platformTop(x, z, lv, seg)` với bậc chồng theo XZ: chỉ trả bậc trong cửa sổ `seg ± 2` | — |
| T-30 | Không hồi quy | toàn bộ test cũ (`test-game-state.mjs` …) vẫn xanh | 100 % |

### 2.3 Khung mã

```js
// scripts/test-game-buildings.mjs (chưa có — cần làm)
// Kiểm «không có công trình làm màu»: vào được, không kẹt, trạm tới được, đúng tầng. Chạy: node scripts/test-game-buildings.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { BUILDINGS } from '../src/game/int/index.js';
import * as O from '../src/game/obstacles.js';
import { findPath3, blockedAt, nearestStation, STATIONS, worldToTile } from '../src/game/world.js';
import { buildingGraph, toWorld, cellsOf, migrateLegacyPos } from '../src/game/buildings.js';
import { SCHEDULES, GIO } from '../src/game/doors.js';
import { ROOMS_LEGACY } from '../src/game/buildings.js';     // bảng sáu phòng cũ (08-04 §5.2)

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };
const MIN_STATIONS = { A: 3, B: 1, C: 1, D: 1, E: 0 };

// nạp va chạm nướng cho mọi công trình (giống trình duyệt)
for (const b of BUILDINGS) {
  const f = new URL(`../public/${b.col}`, import.meta.url);
  if (existsSync(f)) O.addBakedCells(JSON.parse(readFileSync(f, 'utf8')));
}

// đi bộ theo đường, lấy mẫu 0,1 ô, kiểm không cắt ô chặn ở đúng tầng
function walk(path, from, lv) {
  let cur = from;
  for (const p of path) {
    const n = Math.max(1, Math.ceil(Math.hypot(p.x - cur.x, p.y - cur.y) / 0.1));
    for (let k = 1; k <= n; k++) {
      const q = { x: cur.x + (p.x - cur.x) * k / n, y: cur.y + (p.y - cur.y) * k / n };
      assert.equal(blockedAt(q.x, q.y, null, p.lv ?? lv), false, `cắt vật cản tại (${q.x.toFixed(1)}, ${q.y.toFixed(1)}) lv ${p.lv ?? lv}`);
    }
    cur = p; lv = p.lv ?? lv;
  }
}

for (const b of BUILDINGS) {
  const g = buildingGraph(b);                                // nút door:out / door:in / stair / spot (08-04 §3.3)

  test(`${b.id} · T-07 vào được từ đường`, () => {
    for (const d of g.outDoors) {
      const start = g.regionStart;                           // START cho Huyền Thành, trạm đi nhanh cho vùng
      const path = findPath3(start, d.outside);
      assert.ok(path.length, `không có đường tới cửa ${d.id}`);
      walk(path, start, 0);
    }
  });

  test(`${b.id} · T-08 tới mọi khoang`, () => {
    for (const c of cellsOf(b).filter((c) => !c.locked)) {
      const from = g.outDoors[0].inside;
      const path = findPath3(from, { ...c.anchor, lv: c.lv });
      assert.ok(path.length, `không tới được khoang ${c.id} (lv ${c.lv})`);
      walk(path, from, from.lv);
    }
  });

  test(`${b.id} · T-09 không ô cô lập`, () => {
    for (const lv of b.levels.map((l) => l.lv)) {
      const seeds = g.nodes.filter((n) => n.lv === lv).map((n) => n.cell);
      const free = O.freeCellsIn(cellsOf(b).filter((c) => c.lv === lv).map((c) => c.worldBox), lv);
      const seen = O.floodFill(seeds, lv);
      const lost = [...free].filter((k) => !seen.has(k) && !O.isFurnitureCell(k, lv));
      assert.equal(lost.length, 0, `lv ${lv}: ${lost.length} ô cô lập, ví dụ ${O.cellName(lost[0])}`);
    }
  });

  test(`${b.id} · T-10 bậc và đổi tầng`, () => {
    for (const s of b.stairs ?? []) {
      let prev = null, switches = 0, lv = s.from;
      for (const pt of O.sampleStair(s, 0.25)) {
        const top = O.platformTop(pt.x, pt.z, lv, pt.seg);
        assert.ok(top != null, `hụt bậc ${s.id}`);
        if (prev != null) assert.ok(Math.abs(top - prev) <= 0.41, `bậc ${s.id} chênh ${(top - prev).toFixed(2)} m`);
        const nlv = top >= s.switchY ? s.to : s.from;
        if (nlv !== lv) { switches++; lv = nlv; }
        prev = top;
      }
      assert.equal(switches, 1, `thang ${s.id} đổi tầng ${switches} lần`);
    }
  });

  test(`${b.id} · T-12 không nhốt lúc 0 giờ`, () => {
    for (const d of b.doors ?? []) if (d.connectsRegions) {
      const ok = SCHEDULES[d.schedule](GIO[0]) || (b.doors.some((n) => n.near === d.id && n.schedule === 'luon_mo'));
      assert.ok(ok, `cửa nối vùng ${d.id} khóa lúc giờ Tý mà không có ngách`);
    }
  });

  test(`${b.id} · T-14/T-15 trạm`, () => {
    const st = STATIONS.filter((s) => s.bld === b.id);
    assert.ok(st.length >= MIN_STATIONS[b.cls], `${st.length} trạm < ${MIN_STATIONS[b.cls]} (hạng ${b.cls})`);
    for (const s of st) {
      assert.ok(s.engine || s.quest, `trạm ${s.id} không nối engine / nhiệm vụ`);
      if (s.engine) {
        const [file, name] = s.engine.split(' › ');
        const src = ['src/engine', 'src/game'].map((d) => new URL(`../${d}/${file.replace(/\.js$/, '')}.js`, import.meta.url)).find(existsSync);
        assert.ok(src, `trạm ${s.id}: không có tệp ${file}`);
        if (name) assert.ok(new RegExp(`export[^\\n]*\\b${name.split('[')[0]}\\b`).test(readFileSync(src, 'utf8')), `trạm ${s.id}: ${file} không xuất ${name}`);
      }
      assert.equal(blockedAt(s.spot.x, s.spot.y, null, s.lv), false, `chỗ đứng trạm ${s.id} bị chặn`);
      const path = findPath3(g.outDoors[0].inside, { ...s.spot, lv: s.lv });
      assert.ok(path.length, `không tới được trạm ${s.id}`);
      assert.equal(nearestStation({ ...path.at(-1), lv: s.lv })?.id, s.id, `cuối đường không gần trạm ${s.id}`);
    }
  });

  test(`${b.id} · T-16 trạm khác tầng`, () => {
    for (const s of STATIONS.filter((x) => x.bld === b.id)) {
      const n = nearestStation({ ...s.spot, lv: s.lv }, 3);
      assert.ok(!n || n.lv === s.lv, `đứng ở ${s.id} (lv ${s.lv}) lại bắt ${n?.id} (lv ${n?.lv})`);
    }
  });
}

test('T-22 chuyển sáu phòng ngoài bản đồ', () => {
  for (const r of ROOMS_LEGACY) {
    const p = migrateLegacyPos(r.origin.x, r.origin.z);
    assert.equal(p.bld, r.to, `${r.id} → ${p.bld}, cần ${r.to}`);
    assert.equal(blockedAt(...Object.values(worldToTile(p.x, p.z)), null, p.lv), false, `${r.id}: điểm chuyển bị chặn`);
  }
});

console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
```

Hàm phụ trợ mới cần có trong `obstacles.js` để test: `freeCellsIn(boxes, lv)`, `floodFill(seeds, lv)`, `isFurnitureCell(k, lv)`, `cellName(k)`, `sampleStair(stair, step)`. Chúng thuần, không ảnh hưởng runtime.

### 2.4 Sửa test cũ khi giải thể `ROOMS`

| Test hiện có (`test-game-state.mjs`) | Đổi |
|---|---|
| «Bản đồ: mọi gian đứng được và đi tới được từ cổng» bỏ qua trạm có `room` | bỏ qua trạm có `bld` (đã có test riêng T-15) |
| «Điện thờ: cửa ↔ trong điện khớp nhau» | **xóa** khi `ROOMS` rỗng; thay bằng T-22 |
| «Sơn Môn: tường chặn, cổng thông…» | thêm điểm: chân bốn tháp mới (±51, −56), (±49, 56) phải chặn; khe giữa tháp và tường (x ±59,8) phải chặn (không lọt người) hoặc trống ≥ 0,6 m — chọn **chặn** (khe 0,4 m) |
| «Trà Thất: chỗ ngồi bồ đoàn…» | giữ — nền đình mới không được đổi `TEA_SEATS` |

### 2.5 Test giao thức (`scripts/test-quan-protocol.mjs`, `test-quan-mmo.mjs`)

- `mv` có `l`: gửi `l: 2` → máy chủ phát lại `l: 2`; gửi `l: 9` → 0.
- `ix`: vật ngoài danh sách → bỏ, tính vào `rateGate`; chuông 2 lần trong 4 s từ hai người → lần hai bị từ chối; gói chào có `props`.
- 60 người cùng phòng đứng trong Du Phương Lâu ba tầng: tải máy chủ như test 60 người hiện có (không thêm gói theo tầng).

---

## 3. Duyệt art

### 3.1 Bảng kiểm từng công trình

| # | Kiểm | Đạt khi |
|---|---|---|
| R01 | Bảng màu khóa | ảnh trong nhà đo bằng công cụ lấy màu: 5 màu chủ đạo nằm trong ΔE ≤ 12 của bảng khóa vùng / bảng bộ mô-đun |
| R02 | Không trộn phong cách | kết cấu trong một khoang chỉ một bộ; đồ đạc chức năng khác bộ phải ghi trong công thức (luật pha bộ 08-06 §2) |
| R03 | Lớp lót sạch | không thấy mặt trong vỏ Meshy (texture kéo, mặt lộn) từ mọi góc thử 08-03 §8.7 |
| R04 | Vết boolean | không thấy mép cắt; khung che phủ đủ |
| R05 | Tỉ lệ người | cửa, bậc, bàn, ghế đúng thang × 1,25 (08-01 §9.1): người chơi 1,8 m đứng cạnh cửa thấy cửa cao 2,6–3,75 m, bàn cao tới hông |
| R06 | Mật độ đồ | mỗi khoang chính có ≥ 1 điểm nhìn «kể chuyện» (đồ đặt có lý do: chén trà dở, sách mở) nhưng lối đi giữa trống ≥ 1,2 m |
| R07 | Ánh sáng kể chuyện | ánh sáng dẫn mắt tới trạm chính (bàn thờ, bàn đọc) — trạm chính là vùng sáng nhất khoang |
| R08 | Ban đêm từ ngoài | ô cửa sổ sáng đúng khoang có người; điện chính giờ Tý chỉ 1/3 ô sáng |
| R09 | Mái mờ | bổ dọc nhìn gọn: nắp đầu tường đủ, không lỗ đen |
| R10 | Chữ | mọi biển: chữ Hán đúng, có Hán Việt + nghĩa khi chạm; không dùng phù thật (ký tự hư cấu) |
| R11 | Đồ thờ | đúng đạo thống; tượng hư cấu khi cần; không biểu tượng tôn giáo lạc chỗ (vd biểu tượng Phật giáo trong Đạo quán phương Bắc) |
| R12 | Bản iOS | công năng thay thế nhìn tự nhiên, không lộ «chỗ trống» của trạm bị tắt |

### 3.2 Duyệt nội dung tín ngưỡng

Theo tài liệu tổng §14 và trụ cột T6: mọi công trình hạng A và mọi khoang có bàn thờ qua **người duyệt nội dung** (khác người làm). Hạng mục bắt buộc ghi chữ ký:

- tượng / bài vị: hư cấu hay có nguyên mẫu; nguyên mẫu có được phép mô phỏng;
- văn tụng / chú hiện trên màn: trích đúng nguồn trong app (`remedy-fate`, `daozang-data`), không bịa;
- bộ **TAN** (Tạng truyền): chờ tham vấn — không duyệt nội bộ;
- Âm ty: không máu me, không tra tấn; nghiệp và sám hối là trọng tâm.

### 3.3 Bộ ảnh nghiệm thu

`render3d.js` đã có `debugCam` (đặt vị trí / hướng camera) và `debugHour` (đặt giờ) — dùng để chụp lặp lại được. Mỗi công trình khai **danh sách góc chụp** trong công thức:

```js
shots: [
  { id: 'ngoai-nam',  pos: [0, 12, 2],   look: [0, 10, -31], hour: 10 },
  { id: 'ngoai-dem',  pos: [0, 12, 2],   look: [0, 10, -31], hour: 0 },
  { id: 'trong-tosu', pos: [0, 6.2, -31.4], look: [0, 7.5, -39], hour: 10 },
  { id: 'bo-doc',     pos: [6, 22, -24], look: [0, 4.5, -35], hour: 10, cutaway: true },
]
```

Script chụp (chưa có — cần làm): mở game với `?shots=INT-SM-CHINHDUONG`, lặp từng góc, chờ khoang `ready` + 2 s, `renderer.domElement.toBlob` → `docs/art/<vùng>/<INT>/<id>.png`. So ảnh giữa hai phiên bản (sai khác điểm ảnh > 8 % ở ảnh trong nhà → cần duyệt lại).

| Hạng | Ảnh bắt buộc |
|---|---|
| A | 4 ngoài (4 hướng, giờ Tỵ) + 1 ngoài đêm + mỗi khoang chính 1 ảnh trong + 1 bổ dọc |
| B | 4 ngoài + 2 trong + 1 đêm |
| C | mỗi kiểu nhà: 2 ngoài + 2 trong; 36 nhà: ảnh trong tự động 1 / nhà (kiểm đồ sinh hợp lý) |
| D | 2 |
| E | 1 |

---

## 4. Thử tay — phiếu một lượt

| Bước | Làm | Ghi |
|---|---|---|
| 1 | Đi bộ từ trạm đi nhanh gần nhất tới cửa; bấm vào **vỏ** công trình | có đi tới cửa không (không phải chân tường) |
| 2 | Vào trong; đứng ngưỡng 5 s | đèn / âm / camera đổi một lần, không nhấp nháy |
| 3 | Đi sát bốn tường mỗi khoang, xoay camera 360° | có thấy xuyên tường không |
| 4 | Lên mọi tầng, xuống lại; đứng giữa cầu thang xoay camera | camera có chui trần không |
| 5 | Dùng mọi trạm; ngồi mọi chỗ ngồi | |
| 6 | Nói chuyện mọi NPC; đổi `debugHour` qua 12 giờ | NPC có mặt đúng lịch, cửa đúng lịch |
| 7 | 0 giờ: đi từ ngoài vào khoang chính qua ngách | |
| 8 | Bật chế độ bổ dọc trong khoang lớn | mái mờ, bóng còn, nắp tường đủ |
| 9 | Thoát game giữa tầng 2, mở lại | đứng đúng chỗ |
| 10 | Hai máy cùng phòng: một người lên tầng trên | máy kia thấy đúng tầng, không xuyên trần |
| 11 | Bản iOS (build `MODE=ios`) | công năng thay thế, không vỏ rỗng |

---

## 5. Kế hoạch đo hiệu năng

### 5.1 Máy và mức

| Nhóm | Máy chuẩn | Mức chất lượng | Mục tiêu |
|---|---|---|---|
| Thấp | iPhone XR · Galaxy A33 · laptop Intel UHD 620 | `low` | ≥ 30 fps p50, ≥ 24 p95 |
| Trung (chuẩn nghiệm thu) | iPhone 12 · Galaxy A54 · laptop Iris Xe | `mid` | ≥ 30 fps **p95** |
| Cao | iPhone 15 Pro · RTX 3060 laptop | `high` | ≥ 55 fps p95 |

### 5.2 Kịch bản đo (đường camera cố định, chạy tự động bằng `debugCam` nội suy)

| Mã | Kịch bản | Thời lượng | Đo đặc biệt |
|---|---|---|---|
| S1 | Sân Sơn Môn → bậc → Chính Đường tầng 1 → thang → Tàng Kinh → lô gia | 90 s | khựng khi nạp nội thất (frame dài nhất) |
| S2 | Sơn Môn: Vận Mệnh Các đi trọn «Vòng Đời», lên gác | 60 s | 18 cầu đèn cổng: pool đèn |
| S3 | Huyền Thành: đại lộ Nam từ thành môn → vào 3 nhà liên tiếp (T4, T2, T3) | 120 s | bản rời nhà nhân bản; ≤ 3 nhà nạp |
| S4 | Thành môn: tàng binh động → thang 20 m → mặt thành đài → thành lâu | 90 s | ngoài trời rộng + trong nhà |
| S5 | Hậu Sơn: lên nền → Chính Điện Tam Thanh (thông tầng) → gác → Đạo Tạng | 90 s | 3 tượng 2048² trên `high` |
| S6 | Tử Bình: đi suốt Bát Cách Lang 100 m | 90 s | 10 khoang nối tiếp: portal culling |
| S7 | Trích Thiên: vòng 12 cung Quan Tinh Đài | 120 s | 16 ô, nhiều cửa nhìn `open` |
| S8 | MMO: 60 người giả lập trong Du Phương Lâu ba tầng | 120 s | avatar ẩn theo khoang |
| S9 | Ngự kiếm bay qua Huyền Thành ban đêm | 60 s | thẻ cửa sổ đêm 36 nhà |

### 5.3 Chỉ số và cách lấy

| Chỉ số | Nguồn | Ngưỡng `mid` |
|---|---|---|
| fps p50 / p95, khung dài nhất | `performance.now()` mỗi khung | p95 ≥ 30; khung dài nhất ≤ 120 ms (trừ lần nạp vùng đầu) |
| Draw call, tam giác | `renderer.info.render` (`render3d.js › info()`) | ≤ 350 / ≤ 900k (08-01 §12.2) |
| Bộ nhớ texture / hình học | `renderer.info.memory` | tăng khi vào công trình A ≤ 48 MB |
| JS heap | `performance.memory` (Chromium) | không tăng sau 5 lần vào / ra cùng công trình (rò rỉ) |
| Thời gian nạp nội thất | mốc `performance.mark` từ «bắt đầu nạp» tới `ready` | A ≤ 2,5 s, C ≤ 0,8 s trên `mid` |
| Chi phí runtime mới | bao `cells.update`, `doors.update`, `applyFade` | tổng ≤ 0,6 ms (08-03 §10) |

### 5.4 Cổng hồi quy

Mỗi PR chạm `src/game/int/`, `kit.js`, `cells.js`, `render3d.js`: chạy S1 + S3 trên máy CI có GPU (hoặc máy dev chuẩn) — so với lần đo gốc lưu ở `docs/perf/baseline.json`; p95 tụt > 10 % hoặc draw call tăng > 15 % → chặn gộp, phải giải thích.

---

## 6. Số liệu chạy thật (sau khi phát hành)

Gửi về (ẩn danh, theo cơ chế báo lỗi hiện có của MMO nếu có; không gửi lá số):

| Số liệu | Dùng để |
|---|---|
| Số lần **gỡ kẹt** (08-04 §3.6) theo INT + khoang + ô | tìm chỗ kẹt thật |
| Tỉ lệ người vào được công trình sau khi bấm vào vỏ (tới cửa / bỏ cuộc) | kiểm dẫn đường |
| Thời gian ở trong từng khoang | khoang nào «chết» (không ai ở) → xem lại tương tác |
| Lần dùng từng trạm trong nhà | trạm thừa / thiếu |
| fps p95 theo khoang | khoang nặng trên máy thật |
