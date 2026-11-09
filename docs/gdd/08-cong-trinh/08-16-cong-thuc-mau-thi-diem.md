# 08-16 · Công thức mẫu cho đợt thí điểm (P1): Thái Tuế Điện · Vận Mệnh Các · Lầu chuông · nhà vườn kiểu T2

> Dữ liệu công thức **đủ để lập trình viên dán vào** `src/game/int/` khi P0 xong (chưa có — cần làm). Tọa độ **cục bộ** công trình (gốc = tâm khung bao chân vỏ, +Z = mặt tiền, Y tính từ đáy vỏ); `buildings.js` đổi ra thế giới bằng `at` + `ry`. Số đo theo 08-02 §5.2 và 08-07; mọi con số «đo lại» ở bước `bld-void` chính thức sẽ cập nhật **tại đây** trước khi dựng.
>
> Quy ước khóa: `cell` dạng `<tiền tố>.l<tầng>.<tên>`; trạm dùng id trong `features.js` nếu đã có. Mảng `pieces`: `[mã, [x, y, z], { ry, cell, n, step, color, scaleY }]`.

---

## 1. Hằng số và hàm dùng chung

```js
// src/game/int/_shared.js (chưa có — cần làm)
export const BAY = 3.2, SUB = 0.4;
export const HALL_MAIN_CUT = { model: 'hall_main', cut: 'bld/_shared/hall_main-cut/shell' };
// hall_main ở fit width 22 — số đo cục bộ (08-02 §5.2)
export const HM22 = {
  core:  { x0: -9.0, x1: 9.0, z0: -6.1, z1: 1.4 },   // sảnh
  porch: { z0: 1.4, z1: 4.5 },                       // hiên
  loft:  { x0: -7.5, x1: 7.5, z0: -4.6, z1: 3.4 },   // gác
  lv0: { floorY: 0.60, ceilY: 6.60 }, lv1: { floorY: 10.00, ceilY: 12.60 },
  door: { x: 0, z: 1.4, w: 2.4, h: 3.2 },
};
// cầu thang chữ U trong gian thang (x 5,8…9): hai đợt 0,25 / 0,25, chiếu nghỉ ở cuối gian
export function uStair(id, { x0, zFront, zBack, y0, y1, width = 1.4, gap = 0.2 }) {
  const rise = (y1 - y0) / 2, n = Math.round(rise / 0.25), run = n * 0.25;
  const xa = x0, xb = x0 + width + gap;                       // đợt 1 (lên về phía sau), đợt 2 (quay ra trước)
  const steps = [];
  for (let k = 0; k < n; k++) steps.push({ x: xa + width / 2, z: zFront - (k + 0.5) * 0.25, w: width, d: 0.3, ry: 0, top: y0 + (k + 1) * 0.25, seg: k });
  steps.push({ x: x0 + (2 * width + gap) / 2, z: zFront - run - 0.8, w: 2 * width + gap, d: 1.6, ry: 0, top: y0 + rise, seg: n });   // chiếu nghỉ
  for (let k = 0; k < n; k++) steps.push({ x: xb + width / 2, z: zFront - run + (k + 0.5) * 0.25, w: width, d: 0.3, ry: 0, top: y0 + rise + (k + 1) * 0.25, seg: n + 1 + k });
  return { id, from: 0, to: 1, steps, switchY: y0 + rise + 0.1, railing: true, mod: ['MOD-KT-15', 'MOD-KT-16', 'MOD-KT-20'] };
}
```

Kiểm nhanh `uStair` cho Điện phụ: `y0 0,6 → y1 10,0`, mỗi đợt 4,7 m = 19 bậc × 0,25 m (chạy 4,75 m), chiếu nghỉ 1,6 m → tổng sâu 6,35 m, vừa gian thang sâu 7,5 m (z 1,0 → −5,35).

---

## 2. INT-SM-DIENDONG — Thái Tuế Điện

```js
// src/game/int/sm-diendong.js (chưa có — cần làm)
import { HALL_MAIN_CUT, HM22, uStair } from './_shared.js';

export default {
  id: 'INT-SM-DIENDONG', slug: 'sm-diendong', cls: 'B', region: 'thanh',
  shell: { ...HALL_MAIN_CUT, fit: { width: 22 }, at: { x: 47, y: 0, z: -36, ry: -Math.PI / 2 } },
  kit: ['BAC', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, ...HM22.lv0 }, { lv: 1, ...HM22.lv1 } ],

  cells: [
    { id: 'tt.l0.dien',     lv: 0, name: 'Chính điện Thái Tuế', box: [-9.0, 0.6, -6.1, 5.8, 6.6, 1.4],
      sealed: false, ambient: 0.30, exposure: 0.25, reverb: 'dien_vua', bed: 'tung_xa_mo',
      camera: { mode: 'trong', maxDist: 3.5, pitch: [0.12, 0.7], fovAdd: 6 }, fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 3 },
    { id: 'tt.l0.thang',    lv: 0, name: 'Gian thang', box: [5.8, 0.6, -6.1, 9.0, 6.6, 1.4],
      ambient: 0.28, reverb: 'dien_vua', camera: { mode: 'bodoc' }, fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 1 },
    { id: 'tt.l1.nienbieu', lv: 1, name: 'Gác Niên Biểu', box: [-7.5, 10.0, -4.6, 7.5, 12.6, 3.4],
      ambient: 0.35, reverb: 'lau_go', bed: 'go_gio', camera: { mode: 'bodoc' }, fade: ['roof_L1'], lightsMax: 2 },
  ],

  portals: [
    { id: 'tt.p.cua',   a: 'out', b: 'tt.l0.dien', kind: 'door', door: 'tt.d.chinh',
      quad: [[-1.2, 0.6, 1.4], [1.2, 0.6, 1.4], [1.2, 3.8, 1.4], [-1.2, 3.8, 1.4]] },
    { id: 'tt.p.thang', a: 'tt.l0.dien', b: 'tt.l0.thang', kind: 'open',
      quad: [[5.8, 0.6, -0.4], [5.8, 0.6, 1.2], [5.8, 3.4, 1.2], [5.8, 3.4, -0.4]] },
    { id: 'tt.p.mieng', a: 'tt.l0.thang', b: 'tt.l1.nienbieu', kind: 'stair',
      quad: [[5.8, 10.0, 1.0], [7.2, 10.0, 1.0], [7.2, 10.0, -3.8], [5.8, 10.0, -3.8]] },
    // 12 ô cửa sổ gác (6 mỗi mặt dài) — cửa nhìn ra ngoài
    ...[-6.25, -3.75, -1.25, 1.25, 3.75, 6.25].flatMap((x, i) => [
      { id: `tt.p.ws${i}`, a: 'tt.l1.nienbieu', b: 'out', kind: 'window', quad: [[x - 0.6, 10.6, 3.4], [x + 0.6, 10.6, 3.4], [x + 0.6, 11.8, 3.4], [x - 0.6, 11.8, 3.4]] },
      { id: `tt.p.wn${i}`, a: 'tt.l1.nienbieu', b: 'out', kind: 'window', quad: [[x - 0.6, 10.6, -4.6], [x + 0.6, 10.6, -4.6], [x + 0.6, 11.8, -4.6], [x - 0.6, 11.8, -4.6]] },
    ]),
  ],

  doors: [
    { id: 'tt.d.chinh', portal: 'tt.p.cua', kind: 'canh2', lv: 0, mod: 'MOD-BAC-20',
      leaves: [ { hinge: [-1.2, 0.6, 1.4], w: 1.2, h: 3.2, open: 1.75, dir: -1 }, { hinge: [1.2, 0.6, 1.4], w: 1.2, h: 3.2, open: 1.75, dir: +1 } ],
      schedule: 'dien_phu', carve: [-1.2, 0.9, 1.2, 1.9], sound: 'go_nang' },
  ],

  stairs: [ uStair('tt.s.gac', { x0: 5.9, zFront: 1.0, zBack: -5.4, y0: 0.6, y1: 10.0 }) ],

  pieces: [
    // sàn, tường lót, trần
    ['MOD-BAC-01', [-9.0, 0.6, -6.1], { cell: 'tt.l0.dien', n: 5, step: [3.2, 0, 0], rows: 3, rowStep: [0, 0, 2.5] }],
    ['MOD-BAC-03', [-9.0, 0.6, -6.1], { cell: 'tt.l0.dien', n: 5, step: [3.2, 0, 0], scaleY: 6.0 }],          // tường sau
    ['MOD-BAC-04', [-9.0, 0.6, -6.1], { cell: 'tt.l0.dien', ry: Math.PI / 2, n: 5, step: [0, 0, 1.5], scaleY: 6.0 }], // hồi Nam
    ['MOD-BAC-14', [-9.0, 6.6, -6.1], { cell: 'tt.l0.dien', n: 5, step: [3.2, 0, 0], rows: 3, rowStep: [0, 0, 2.5] }],
    ['MOD-BAC-12', [-9.0, 6.0, -3.6], { cell: 'tt.l0.dien', n: 5, step: [3.2, 0, 0] }],
    // bậc khám 60 bài vị: 3 tầng gỗ dọc tường sau (12,6 m) + hồi Nam (3 × 3) + vách gian thang (3 × 3)
    ['TT-KHAM-SAU',  [-6.3, 0.6, -5.7], { cell: 'tt.l0.dien', special: 'thaitue.wall', slots: 42, cols: 14, tiers: [1.6, 3.2, 4.8] }],
    ['TT-KHAM-NAM',  [-8.7, 0.6, -3.3], { cell: 'tt.l0.dien', ry: Math.PI / 2, special: 'thaitue.wall', slots: 9, cols: 3, tiers: [1.6, 3.2, 4.8], from: 42 }],
    ['TT-KHAM-THANG',[5.5, 0.6, -3.3],  { cell: 'tt.l0.dien', ry: -Math.PI / 2, special: 'thaitue.wall', slots: 9, cols: 3, tiers: [1.6, 3.2, 4.8], from: 51 }],
    // bệ + bài vị trị niên + bàn lễ + đèn dầu
    ['MOD-BAC-29', [0, 0.6, -4.8], { cell: 'tt.l0.dien', widthTo: 4.8 }],
    ['TT-BAIVI',   [0, 1.95, -4.8], { cell: 'tt.l0.dien', special: 'thaitue.tablet' }],
    ['MOD-BAC-30', [0, 0.6, -2.2], { cell: 'tt.l0.dien' }],
    ['MOD-BAC-32', [0, 1.5, -2.2], { cell: 'tt.l0.dien' }],
    ['TT-DEN9',    [0, 1.5, -1.6], { cell: 'tt.l0.dien', special: 'thaitue.lamps', n: 9, spacing: 0.46 }],
    ['MOD-BAC-35', [-1.6, 0.6, -0.6], { cell: 'tt.l0.dien', n: 3, step: [1.6, 0, 0] }],
    ['MOD-BAC-45', [-6.0, 4.2, -1.0], { cell: 'tt.l0.dien', n: 4, step: [4.0, 0, 0] }],
    ['MOD-BAC-46', [0, 4.6, 1.2], { cell: 'tt.l0.dien', label: { han: '太歲殿', hv: 'Thái Tuế Điện', nghia: 'điện thờ vị thần trị năm' } }],
    // gác niên biểu
    ['MOD-BAC-02', [-7.5, 10.0, -4.6], { cell: 'tt.l1.nienbieu', n: 5, step: [3.0, 0, 0], rows: 3, rowStep: [0, 0, 2.67] }],
    ['TT-NIENBIEU',[0, 10.6, 0], { cell: 'tt.l1.nienbieu', special: 'thaitue.years', windows: 12 }],
    ['MOD-BAC-42', [0, 10.0, -0.6], { cell: 'tt.l1.nienbieu' }],
    ['MOD-KT-20',  [5.8, 10.0, -3.8], { cell: 'tt.l1.nienbieu' }],
  ],

  special: ['thaitue'],              // interior.js › buildThaiTue (viết lại theo bậc khám, 08-07 §4.3)

  stations: [
    { id: 'thaitue', kind: 'van', cell: 'tt.l0.dien', lv: 0, name: 'Bàn Lễ Thái Tuế', verb: 'Xem Thái Tuế năm nay',
      at: [0, 0.6, -2.2], spot: [0, 0.6, -0.9], label: [0, 3.0, -2.2], engine: 'thaitue › thaiTue' },
    { id: 'tt_vach', kind: 'van', cell: 'tt.l0.dien', lv: 0, name: 'Vách Lục Thập Hoa Giáp', verb: 'Tìm Thái Tuế năm sinh',
      at: [-3.2, 0.6, -5.2], spot: [-3.2, 0.6, -3.6], label: [-3.2, 5.6, -5.6], engine: 'taisui-general › TAISUI_60' },
    { id: 'tt_nienbieu', kind: 'van', cell: 'tt.l1.nienbieu', lv: 1, name: 'Niên Biểu', verb: 'Mười hai năm tới',
      at: [0, 10.0, -0.6], spot: [0, 10.0, 0.6], label: [0, 12.0, -0.6], engine: 'taisui › personalTaSui' },
  ],

  npcs: [
    { npc: 'role:thudien_thaitue', cell: 'tt.l0.dien', lv: 0, model: 'npc_villager', pose: 'stand',
      schedule: [['Mão', 'Dậu', 'NP__thudien'], ['Tuất', 'Dần', 'nghi']], anchor: [4.2, 0.6, -2.6] },
  ],

  lights: [
    { cell: 'tt.l0.dien', kind: 'nen', at: [-1.0, 1.9, -4.6], color: '#ffb35c', power: 1.0 },
    { cell: 'tt.l0.dien', kind: 'nen', at: [ 1.0, 1.9, -4.6], color: '#ffb35c', power: 1.0 },
    { cell: 'tt.l0.dien', kind: 'dendau', at: [0, 1.8, -1.6], color: '#ffb35c', power: 0, special: 'thaitue.lampLight' },
    { cell: 'tt.l0.dien', kind: 'troi', at: [0, 3.0, -0.2], color: '#fff2d8', power: 1.4 },
    { cell: 'tt.l0.thang', kind: 'dendau', at: [7.4, 4.6, -5.0], power: 0.7 },
    { cell: 'tt.l1.nienbieu', kind: 'dendau', at: [-4.0, 11.6, -0.6], power: 0.8, sched: 'dien_phu' },
    { cell: 'tt.l1.nienbieu', kind: 'dendau', at: [ 4.0, 11.6, -0.6], power: 0.8, sched: 'dien_phu' },
  ],

  audio: { emitters: [ { cell: 'tt.l0.dien', at: [0, 1.6, -2.2], bed: 'nen_lach_tach', gain: 0.03 } ], muyu: { gio: ['Mão', 'Dậu'] } },

  ios: {                                                        // Trai Đường (08-07 §4.7)
    hide: ['thaitue', 'tt_vach', 'tt_nienbieu', 'TT-KHAM-*', 'TT-BAIVI', 'TT-DEN9', 'TT-NIENBIEU'],
    pieces: [ ['MOD-DAN-15', [-4.8, 0.6, -2.0], { cell: 'tt.l0.dien', n: 4, step: [3.2, 0, 0] }],
              ['TT-TIETKHI', [0, 2.4, -5.8], { cell: 'tt.l0.dien', special: 'calendar.24' }] ],
    stations: [ { id: 'tt_trai', kind: 'desk', cell: 'tt.l0.dien', lv: 0, name: 'Trai Đường', verb: 'Dùng bữa chay theo tiết',
                  at: [0, 0.6, -2.0], spot: [0, 0.6, -0.8], engine: 'seasonal-advice' } ],
  },

  legacy: { room: 'thaitue', origin: { x: 2000, z: 0 }, w: 28, d: 24 },   // migrateLegacyPos
  stream: { load: 60, unload: 100 },
  col: 'bld/sm-diendong.col.json',
  shots: [
    { id: 'ngoai-tay',  pos: [30, 8, -36], look: [47, 6, -36], hour: 10 },
    { id: 'trong-baivi', pos: [41.2, 2.4, -36], look: [52.5, 3.2, -36], hour: 10 },
    { id: 'trong-dem',  pos: [41.2, 2.4, -36], look: [52.5, 3.2, -36], hour: 0 },
    { id: 'gac',        pos: [47, 16, -28], look: [47, 10.5, -36], hour: 10, cutaway: true },
  ],
};
```

Điểm cần kiểm khi dán:

| Kiểm | Giá trị mong đợi |
|---|---|
| Cửa (cục bộ (0, 1,4)) → thế giới | x = 47 − 1,4 = **45,6**, z = −36 + 0 = **−36** (cửa giữa mặt tiền, khác cửa cũ (38,6, −40) của phòng ngoài bản đồ) |
| Lối tới cửa | bậc hiên (cục bộ z 4,5…7) xuống tới x thế giới ≈ 40; mép nền L1 (cao 2 m) ở x 36 → trước cửa chỉ còn hành lang đất 4 m chạy dọc Bắc – Nam, cửa điện **nhìn thẳng vào vách nền**. Thêm **bậc phụ** từ L1 xuống sân điện, đối diện cửa: `court.js › STAIRS` thêm `{ x0: 36, x1: 40, z: −38…−34, y 2 → 0 }` (quay theo trục X — cần mở rộng `STAIRS` cho bậc ngang) ở cả hai bên Đông / Tây; kiểm T-07 từ Bệ Thầy |
| Bậc khám tường sau (cục bộ z −5,7) → thế giới | x = 47 + 5,7 = 52,7 — sát tường sau vỏ (x 53,1) |

---

## 3. INT-SM-DIENTAY — Vận Mệnh Các

Chỉ ghi phần khác Thái Tuế Điện (vỏ, cao độ, gian thang, gác dùng chung `HM22`).

```js
// src/game/int/sm-dientay.js (chưa có — cần làm)
import { HALL_MAIN_CUT, HM22, uStair } from './_shared.js';

// chín cổng «Vòng Đời» — 08-07 §3.4 (x, z cục bộ; rot = góc quay khung cổng)
export const VAN_RING = [
  { slot: 0, x: -2.2, z: -0.1, rot: Math.PI / 2 },  { slot: 1, x: -5.6, z: -0.1, rot: Math.PI / 2 },
  { slot: 2, x: -7.6, z: -2.3, rot: 0 },            { slot: 3, x: -4.6, z: -4.6, rot: Math.PI / 2 },
  { slot: 4, x: -1.0, z: -4.6, rot: Math.PI / 2 },  { slot: 5, x:  2.6, z: -4.6, rot: Math.PI / 2 },
  { slot: 6, x:  4.6, z: -2.3, rot: 0 },            { slot: 7, x:  3.6, z: -0.1, rot: Math.PI / 2 },
  { slot: 8, x:  1.6, z: -0.1, rot: Math.PI / 2 },
];
export const VAN_STELE_LOCAL = { x: -3.0, z: 3.0 };             // hiên — thay world.js › VAN_STELE

export default {
  id: 'INT-SM-DIENTAY', slug: 'sm-dientay', cls: 'B', region: 'thanh',
  shell: { ...HALL_MAIN_CUT, fit: { width: 22 }, at: { x: -47, y: 0, z: -36, ry: Math.PI / 2 } },
  kit: ['BAC', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, ...HM22.lv0 }, { lv: 1, ...HM22.lv1 } ],

  cells: [
    { id: 'vm.l0.vong', lv: 0, name: 'Lối Vòng Đời', box: [-9.0, 0.6, -6.1, 5.8, 6.6, 1.4],
      ambient: 0.26, exposure: 0.3, reverb: 'dien_vua', bed: 'nen_lach_tach',
      camera: { mode: 'trong', maxDist: 3.2, pitch: [0.12, 0.65], fovAdd: 8 }, fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 4 },
    { id: 'vm.l0.thang', lv: 0, name: 'Gian thang', box: [5.8, 0.6, -6.1, 9.0, 6.6, 1.4], camera: { mode: 'bodoc' }, reverb: 'dien_vua', lightsMax: 1 },
    { id: 'vm.l1.luunien', lv: 1, name: 'Gác Lưu Niên', box: [-7.5, 10.0, -4.6, 7.5, 12.6, 3.4], camera: { mode: 'bodoc' }, reverb: 'lau_go', lightsMax: 2 },
  ],

  portals: [
    { id: 'vm.p.cua', a: 'out', b: 'vm.l0.vong', kind: 'door', door: 'vm.d.chinh',
      quad: [[-1.2, 0.6, 1.4], [1.2, 0.6, 1.4], [1.2, 3.8, 1.4], [-1.2, 3.8, 1.4]] },
    { id: 'vm.p.thang', a: 'vm.l0.vong', b: 'vm.l0.thang', kind: 'open', quad: [[5.8, 0.6, -0.4], [5.8, 0.6, 1.2], [5.8, 3.4, 1.2], [5.8, 3.4, -0.4]] },
    { id: 'vm.p.mieng', a: 'vm.l0.thang', b: 'vm.l1.luunien', kind: 'stair', quad: [[5.8, 10.0, 1.0], [7.2, 10.0, 1.0], [7.2, 10.0, -3.8], [5.8, 10.0, -3.8]] },
    // 10 cửa sổ tròn gác: 5 mỗi mặt dài (mười năm của đại vận đang đi)
    ...[-6.0, -3.0, 0, 3.0, 6.0].flatMap((x, i) => [
      { id: `vm.p.ws${i}`, a: 'vm.l1.luunien', b: 'out', kind: 'window', quad: [[x - 0.8, 10.4, 3.4], [x + 0.8, 10.4, 3.4], [x + 0.8, 12.0, 3.4], [x - 0.8, 12.0, 3.4]] },
      { id: `vm.p.wn${i}`, a: 'vm.l1.luunien', b: 'out', kind: 'window', quad: [[x - 0.8, 10.4, -4.6], [x + 0.8, 10.4, -4.6], [x + 0.8, 12.0, -4.6], [x - 0.8, 12.0, -4.6]] },
    ]),
  ],

  doors: [ { id: 'vm.d.chinh', portal: 'vm.p.cua', kind: 'canh2', lv: 0, mod: 'MOD-BAC-20',
             leaves: [ { hinge: [-1.2, 0.6, 1.4], w: 1.2, h: 3.2, open: 1.75, dir: -1 }, { hinge: [1.2, 0.6, 1.4], w: 1.2, h: 3.2, open: 1.75, dir: +1 } ],
             schedule: 'dien_phu', carve: [-1.2, 0.9, 1.2, 1.9], sound: 'go_nang' } ],

  stairs: [ uStair('vm.s.gac', { x0: 5.9, zFront: 1.0, zBack: -5.4, y0: 0.6, y1: 10.0 }) ],

  pieces: [
    ['MOD-BAC-01', [-9.0, 0.6, -6.1], { cell: 'vm.l0.vong', n: 5, step: [3.2, 0, 0], rows: 3, rowStep: [0, 0, 2.5] }],
    ['VM-LOI',     [0, 0.62, 0],       { cell: 'vm.l0.vong', special: 'vanmenh.path', ring: 'VAN_RING', width: 2.0 }],     // lối đá sáng theo vòng
    ['MOD-BAC-52', [-5.8, 0.6, -3.0],  { cell: 'vm.l0.vong', n: 3, step: [2.93, 0, 0], widthTo: 2.93 }],                   // bình phong Mệnh
    ['VM-TOMTAT',  [-1.4, 1.0, -3.0],  { cell: 'vm.l0.vong', special: 'vanmenh.backpanels', n: 9, side: 'back' }],         // 9 tấm tóm tắt thập kỷ
    ['MOD-BAC-30', [0, 0.6, -1.3],     { cell: 'vm.l0.vong' }],
    ['VM-MENH',    [0, 2.6, -1.58],    { cell: 'vm.l0.vong', special: 'vanmenh.ming', size: 1.6 }],                        // chữ 命 trên bình phong
    ['MOD-BAC-33', [-0.9, 1.5, -1.3],  { cell: 'vm.l0.vong', n: 2, step: [1.8, 0, 0] }],
    ['VM-CONG',    [0, 0.6, 0],        { cell: 'vm.l0.vong', special: 'vanmenh.gates', ring: 'VAN_RING', post: 0.3, span: 2.6, beam: 4.2, plaque: [1.8, 0.9] }],
    ['MOD-BAC-53', [-3.0, 0.6, 3.0],   { cell: null, ry: 0, special: 'vanmenh.stele' }],                                   // bia ở hiên (ngoài trời)
    ['MOD-BAC-02', [-7.5, 10.0, -4.6], { cell: 'vm.l1.luunien', n: 5, step: [3.0, 0, 0], rows: 3, rowStep: [0, 0, 2.67] }],
    ['MOD-BAC-24', [-6.0, 10.4, 3.4],  { cell: 'vm.l1.luunien', n: 5, step: [3.0, 0, 0] }],
    ['MOD-BAC-24', [-6.0, 10.4, -4.6], { cell: 'vm.l1.luunien', n: 5, step: [3.0, 0, 0] }],
    ['VM-LUUNIEN', [0, 10.4, 0],       { cell: 'vm.l1.luunien', special: 'vanmenh.years', windows: 10 }],
    ['MOD-BAC-42', [0, 10.0, -0.6],    { cell: 'vm.l1.luunien' }],
  ],

  special: ['vanmenh'],                // interior.js › buildVanMenh viết lại theo VAN_RING

  stations: [
    { id: 'vanbia', kind: 'van', cell: null, lv: 0, name: 'Bia Vận Mệnh', verb: 'Đọc bia quỹ tích đời',
      at: [-3.0, 0.6, 3.0], spot: [-1.6, 0.6, 3.4], engine: 'vanmenh › vanMenh' },
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `van${i}`, kind: 'van', slot: i, cell: 'vm.l0.vong', lv: 0, name: `Cổng Đại Vận ${i + 1}`, verb: 'Bước vào thập kỷ này',
      at: [VAN_RING[i].x, 0.6, VAN_RING[i].z], spot: 'ring+0.9', engine: 'vanmenh › vanMenh' })),       // spot: lệch 0,9 m theo chiều đi tới
    { id: 'vm_menh', kind: 'van', cell: 'vm.l0.vong', lv: 0, name: 'Bàn Lễ Bản Mệnh', verb: 'Xem Mệnh Đồ',
      at: [0, 0.6, -1.3], spot: [0, 0.6, -0.1], engine: 'gaimenh › gaimenhPlan' },
    { id: 'vm_luunien', kind: 'van', cell: 'vm.l1.luunien', lv: 1, name: 'Cửa Sổ Lưu Niên', verb: 'Mười năm của thập kỷ này',
      at: [0, 10.0, -0.6], spot: [0, 10.0, 0.6], engine: 'liunian-pro › analyzeLiunianDeep' },
  ],

  npcs: [ { npc: 'role:thucac_vanmenh', cell: null, lv: 0, model: 'npc_villager', pose: 'stand',
            schedule: [['Thìn', 'Thân', 'hien:[−4.4, 0.6, 3.0]'], ['Dậu', 'Dần', 'nghi']] } ],

  lights: [
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ cell: 'vm.l0.vong', kind: 'denlong', ring: i, y: 3.6, power: 0.7, special: 'vanmenh.gateLight' })),
    { cell: 'vm.l0.vong', kind: 'nen', at: [-0.9, 2.0, -1.3], power: 1.0 },
    { cell: 'vm.l0.vong', kind: 'nen', at: [ 0.9, 2.0, -1.3], power: 1.0 },
    { cell: 'vm.l0.vong', kind: 'troi', at: [0, 3.0, -0.2], power: 1.2 },
    { cell: 'vm.l1.luunien', kind: 'dendau', at: [-3.0, 11.6, -0.6], power: 0.8 },
    { cell: 'vm.l1.luunien', kind: 'dendau', at: [ 3.0, 11.6, -0.6], power: 0.8 },
  ],

  audio: { gateChime: { freq: 523, vol: 0.08, when: 'current' } },

  ios: {                                                        // Tàng Thư Các (08-07 §3.8)
    hide: ['vanbia', 'van*', 'vm_menh', 'vm_luunien', 'VM-*'],
    pieces: [ ['MOD-NHO-17', [0, 0.6, 0], { cell: 'vm.l0.vong', ring: 'VAN_RING', special: 'shelves.byLayer' }],
              ['MOD-NHO-46', [0, 0.6, -1.3], { cell: 'vm.l0.vong' }] ],
    stations: [ { id: 'vm_ios_doc', kind: 'desk', cell: 'vm.l0.vong', lv: 0, name: 'Án Đọc', verb: 'Đọc một trang cổ thư',
                  at: [0, 0.6, -1.3], spot: [0, 0.6, -0.1], engine: 'library-data › LIBRARY' } ],
  },

  legacy: { room: 'vanmenh', origin: { x: 1900, z: 0 }, w: 20, d: 72 },
  col: 'bld/sm-dientay.col.json',
  shots: [
    { id: 'ngoai-dong', pos: [-30, 8, -36], look: [-47, 6, -36], hour: 10 },
    { id: 'vong-1',     pos: [-45.2, 2.2, -38], look: [-46.0, 2.6, -33], hour: 10 },
    { id: 'menh',       pos: [-45.0, 2.2, -36], look: [-48.8, 2.6, -36], hour: 20 },
  ],
};
```

### 3.1 Bảng thế giới của chín cổng (để test và để đổi `world.js`)

Đổi: x_tg = −47 + z_cb, z_tg = −36 − x_cb.

| Cổng | Cục bộ (x, z) | Thế giới (x, z) |
|---|---|---|
| `van0` | (−2,2, −0,1) | (−47,1, −33,8) |
| `van1` | (−5,6, −0,1) | (−47,1, −30,4) |
| `van2` | (−7,6, −2,3) | (−49,3, −28,4) |
| `van3` | (−4,6, −4,6) | (−51,6, −31,4) |
| `van4` | (−1,0, −4,6) | (−51,6, −35,0) |
| `van5` | (2,6, −4,6) | (−51,6, −38,6) |
| `van6` | (4,6, −2,3) | (−49,3, −40,6) |
| `van7` | (3,6, −0,1) | (−47,1, −39,6) |
| `van8` | (1,6, −0,1) | (−47,1, −37,6) |
| bàn 命 | (0, −1,3) | (−48,3, −36,0) |
| bia (hiên) | (−3,0, 3,0) | (−44,0, −33,0) |
| cửa | (0, 1,4) | (−45,6, −36,0) |

Lối trước (z_cb −1,6…1,4) rộng 3,0 m; khung cổng 2,6 m; trụ Ø 0,3 → hai bên cổng còn 0,05–0,2 m tới mép lối: cổng **chiếm trọn bề ngang lối** — đúng ý «phải đi qua cổng». Test T-09 bảo đảm không có lối vòng qua cổng (nếu có thì «bỏ qua thập kỷ» — không cho phép).

---

## 4. INT-SM-LAUCHUONG — Lầu chuông

```js
// src/game/int/sm-lauchuong.js (chưa có — cần làm)
export const PAV12 = {                                   // lib_pavilion2 ở fit width 12 (08-02 §5.2)
  ground: { x0: -3.0, x1: 3.0, z0: -3.0, z1: 3.0 }, gallery: { x0: -4.0, x1: 4.0, z0: -4.0, z1: 4.0 },
  room: { x0: -2.5, x1: 2.5, z0: -2.5, z1: 2.5 },
  lv0: { floorY: 0.40, ceilY: 3.60 }, lv1: { floorY: 4.00, ceilY: 7.60 },
};

export default {
  id: 'INT-SM-LAUCHUONG', slug: 'sm-lauchuong', cls: 'B', region: 'thanh',
  shell: { model: 'lib_pavilion2', cut: 'bld/_shared/pavilion2-cut/shell', fit: { width: 12 }, hd: false, at: { x: 47, y: 0, z: -9, ry: -Math.PI / 2 } },
  kit: ['BAC', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, ...PAV12.lv0 }, { lv: 1, ...PAV12.lv1 } ],

  cells: [
    { id: 'lc.l0.phong', lv: 0, name: 'Phòng giữ chuông', box: [-3.0, 0.4, -3.0, 3.0, 3.6, 3.0], camera: { mode: 'bodoc' }, reverb: 'lau_go', lightsMax: 2, fade: ['roof_L0', 'roof_L1', 'upper_L1'] },
    { id: 'lc.l1.chuong', lv: 1, name: 'Phòng chuông', box: [-2.5, 4.0, -2.5, 2.5, 7.6, 2.5], camera: { mode: 'bodoc' }, reverb: 'lau_go', bed: 'go_gio', lightsMax: 1, fade: ['roof_L1'] },
  ],
  outdoorDecks: [ { id: 'lc.l1.hien', lv: 1, top: 4.0, box: [-4.0, -4.0, 4.0, 4.0], hole: [-2.5, -2.5, 2.5, 2.5], railing: 'MOD-BAC-50', roofZone: 7.2 } ],

  portals: [
    { id: 'lc.p.cua', a: 'out', b: 'lc.l0.phong', kind: 'door', door: 'lc.d.tret', quad: [[-0.9, 0.4, 3.0], [0.9, 0.4, 3.0], [0.9, 3.0, 3.0], [-0.9, 3.0, 3.0]] },
    { id: 'lc.p.mieng', a: 'lc.l0.phong', b: 'lc.l1.chuong', kind: 'stair', quad: [[2.0, 4.0, -1.4], [3.0, 4.0, -1.4], [3.0, 4.0, 2.6], [2.0, 4.0, 2.6]] },
    { id: 'lc.p.ocua', a: 'lc.l1.chuong', b: 'out', kind: 'open', quad: [[-0.8, 4.0, 2.5], [0.8, 4.0, 2.5], [0.8, 6.4, 2.5], [-0.8, 6.4, 2.5]] },
    ...[[2.5, 'x'], [-2.5, 'x'], [-2.5, 'z']].map(([p, ax], i) => ({ id: `lc.p.w${i}`, a: 'lc.l1.chuong', b: 'out', kind: 'lattice',
      quad: ax === 'x' ? [[p, 4.6, -1.2], [p, 4.6, 1.2], [p, 6.6, 1.2], [p, 6.6, -1.2]] : [[-1.2, 4.6, p], [1.2, 4.6, p], [1.2, 6.6, p], [-1.2, 6.6, p]] })),
  ],

  doors: [ { id: 'lc.d.tret', portal: 'lc.p.cua', kind: 'canh2', lv: 0, mod: 'MOD-BAC-20',
             leaves: [ { hinge: [-0.9, 0.4, 3.0], w: 0.9, h: 2.6, open: 1.75, dir: -1 }, { hinge: [0.9, 0.4, 3.0], w: 0.9, h: 2.6, open: 1.75, dir: +1 } ],
             schedule: 'dien_phu', carve: [-0.9, 2.5, 0.9, 3.5] } ],

  // thang thẳng 16 bậc cao 0,225 sâu 0,25 dọc tường x 2,0…3,0 (rộng 1,0 — dưới chuẩn 1,2: ngoại lệ lầu nhỏ, ghi vào phiếu DoD), z 2,6 → −1,4
  stairs: [ { id: 'lc.s.lau', from: 0, to: 1, switchY: 2.3, railing: true, mod: ['MOD-KT-15', 'MOD-KT-20'],
              steps: Array.from({ length: 16 }, (_, k) => ({ x: 2.5, z: 2.6 - (k + 0.5) * 0.25, w: 1.0, d: 0.3, ry: 0, top: 0.4 + (k + 1) * 0.225, seg: k })) } ],

  pieces: [
    ['MOD-BAC-01', [-3.0, 0.4, -3.0], { cell: 'lc.l0.phong', n: 2, step: [3.0, 0, 0], rows: 2, rowStep: [0, 0, 3.0] }],
    ['MOD-BAC-03', [-3.0, 0.4, -3.0], { cell: 'lc.l0.phong', n: 2, step: [3.0, 0, 0], scaleY: 3.2 }],
    ['MOD-BAC-46', [-2.9, 1.6, 0], { cell: 'lc.l0.phong', ry: Math.PI / 2, special: 'board.huangdao' }],                // bảng giờ hoàng đạo
    ['MOD-BAC-42', [-1.2, 0.4, -2.0], { cell: 'lc.l0.phong' }],
    ['MOD-BAC-43', [-1.2, 0.4, -2.9], { cell: 'lc.l0.phong' }],
    ['MOD-BAC-02', [-4.0, 4.0, -4.0], { cell: 'lc.l1.chuong', n: 3, step: [2.67, 0, 0], rows: 3, rowStep: [0, 0, 2.67] }],
    ['MOD-BAC-16', [-1.6, 6.6, 0], { cell: 'lc.l1.chuong', widthTo: 3.2 }],                                              // khung treo
    ['prop_bell_bronze', [0, 4.9, 0], { cell: 'lc.l1.chuong', fit: { height: 1.6 }, hook: 'bell', fadeable: true, ix: 'sm.chuong' }],
    ['PR-CHAY', [-1.3, 5.6, 0], { cell: 'lc.l1.chuong', hook: 'striker', anim: 'swing' }],
    ['MOD-BAC-50', [-4.0, 4.0, -4.0], { cell: null, ring: [-4.0, -4.0, 4.0, 4.0], gapAt: 'stairTop' }],
  ],

  stations: [
    { id: 'lc_danh', kind: 'desk', cell: 'lc.l1.chuong', lv: 1, name: 'Chuông Sớm', verb: 'Đánh chuông', at: [0, 4.0, 0], spot: [0, 4.0, 1.6], ix: 'sm.chuong', daily: { key: 'lc_danh', gio: ['Mão'] }, engine: 'protocol › ix' },
    { id: 'lc_hoangdao', kind: 'desk', cell: 'lc.l0.phong', lv: 0, name: 'Bảng Giờ Hoàng Đạo', verb: 'Xem giờ tốt hôm nay', at: [-2.9, 0.4, 0], spot: [-1.6, 0.4, 0.4], engine: 'huangdao › huangdao12' },
    { id: 'lc_so', kind: 'desk', cell: 'lc.l0.phong', lv: 0, name: 'Sổ Chuông', verb: 'Xem số tiếng chuông của phòng', at: [-1.2, 0.4, -2.0], spot: [-1.2, 0.4, -0.8], quest: 'DQ-chuong' },
  ],

  npcs: [ { npc: 'role:chungdau', model: 'npc_villager',
            schedule: [['Dần', 'Mão', 'lc.l1.chuong:[−1.6, 4.0, 0.8]'], ['Thìn', 'Thân', 'lc.l0.phong:SE__ghe'], ['Dậu', 'Sửu', 'nghi']],
            event: { gio: 'Mão', script: 'khoa_chuong_som', strikes: [18, 18, 18, 18, 18, 18], tempo: ['nhanh', 'cham', 'vua', 'nhanh', 'cham', 'vua'] } } ],

  lights: [
    { cell: 'lc.l0.phong', kind: 'dendau', at: [-1.2, 1.4, -2.0], power: 0.7 },
    { cell: 'lc.l0.phong', kind: 'troi', at: [0, 2.0, 2.0], power: 1.0 },
    { cell: 'lc.l1.chuong', kind: 'denlong', at: [0, 7.0, 2.0], power: 0.8, sched: 'dem' },
    { cell: 'lc.l1.chuong', kind: 'troi', at: [0, 5.6, 1.6], power: 1.2 },
  ],

  stream: { load: 60, unload: 100 },
  col: 'bld/sm-lauchuong.col.json',
};
```

Ghi chú: thang lầu chuông rộng **1,0 m** — dưới chuẩn 1,2 (08-01 §9.2) vì phòng trệt chỉ 6 × 6 m. Hai cách: (a) chấp nhận ngoại lệ có ghi phiếu DoD (A* trong nhà bước 0,4 m vẫn đi được khe 1,0 m tự do 0,4 m); (b) thang xoắn quanh trụ góc (bán kính 0,4–1,6 m, rộng 1,2). **Đề xuất (b)** khi làm thật; công thức trên giữ (a) để thí điểm nhanh, đổi trước khi bật cờ.

---

## 5. Nhà vườn kiểu T2 — bộ sinh công thức

Nhà dân không viết tay 36 tệp: **một hàm** sinh công thức từ bảng nhà (08-09 §3.2) + quy tắc gia đình (08-09 §3.4).

```js
// src/game/int/ht-nha.js (chưa có — cần làm)
import { makeNpc, hashSeed, rng } from '../npc.js';
import { analyze } from '../../engine/chart.js';
import { fiveDimRadar } from '../../engine/five-dim-radar.js';

// bảng 36 nhà: dựng từ landmarks.js › streetHouses (rng 77) + 6 nhà vành (rng 91) — xuất chung để test so khớp (T-02)
export { HOUSES } from '../landmarks-data.js';               // [{ n, x, z, ry, s, street }] (chưa có — tách khỏi landmarks.js)

const TRADE = { tai: 'buon', quan: 'thulai', an: 'thaydo', thuc: 'thucong', ty: 'vo' };   // Ngũ Duy mạnh nhất → nghề (08-06 §5.3)
const ALTAR2 = { buon: 'thantai', thaydo: 'vanxuong', thucong: 'taoquan', vo: 'quancong', thulai: null };
const typeOf = (h) => (h.street.startsWith('Đại lộ') ? 'T4' : h.s < 10.5 ? 'T1' : h.s < 12 ? 'T2' : 'T3');

export function family(h, year = new Date().getFullYear()) {
  const key = `INT-HT-NHA-${String(h.n).padStart(2, '0')}`;
  const r = rng(hashSeed(key));
  const head = makeNpc(key, year);
  const members = [head];
  const want = 1 + Math.floor(r() * 4);
  for (let k = 1, tries = 0; members.length <= want && tries < 8 * want; tries++) {
    const m = makeNpc(`${key}:${k}`, year);
    const ok = k === 1 ? m.gender !== head.gender && Math.abs(m.year - head.year) <= 6
      : k <= 3 ? m.year - head.year >= 20 && m.year - head.year <= 40
      : head.year - m.year >= 22 && head.year - m.year <= 35;
    if (ok) { members.push({ ...m, role: k === 1 ? 'vochong' : k <= 3 ? 'con' : 'chame' }); k++; }
  }
  const R = analyze(head.year, head.month, head.day, head.hour, head.minute, head.gender, year);
  const dims = fiveDimRadar(R);                               // tên trường thật theo five-dim-radar (tài liệu 04)
  const best = Object.entries(dims.scores ?? dims).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  return { key, head, members, R, trade: TRADE[best[0]] ?? 'thucong', trade2: TRADE[best[1]], accent: R.yong?.xi, rng: r };
}

export function houseRecipe(h, neighbours = []) {
  const T = typeOf(h), k = h.s / 11.5;                        // tỉ lệ so với cỡ đo chuẩn
  const fam = family(h);
  if (neighbours.some((o) => family(o).trade === fam.trade)) fam.trade = fam.trade2;          // T-23
  const W = 8.6 * k, D = 4.5 * k, x0 = -W / 2, z0 = -2.9 * k, bay = W / 3;
  const cells = [
    { id: 'n.l0.giua', lv: 0, name: 'Gian giữa', box: [x0 + bay, 1.6, z0, x0 + 2 * bay, 1.6 + 3.6 * k, z0 + D], camera: { mode: 'bodoc' }, reverb: 'nha_dan', lightsMax: 2 },
    { id: 'n.l0.trai', lv: 0, name: T === 'T1' ? 'Buồng ngủ' : 'Buồng chủ', box: [x0, 1.6, z0, x0 + bay, 1.6 + 3.2 * k, z0 + D], camera: { mode: 'bodoc' }, reverb: 'nha_dan', lightsMax: 1 },
    { id: 'n.l0.phai', lv: 0, name: T === 'T1' ? 'Gian bếp – kho' : T === 'T4' ? 'Gian bếp' : 'Buồng con', box: [x0 + 2 * bay, 1.6, z0, x0 + W, 1.6 + 3.2 * k, z0 + D], camera: { mode: 'bodoc' }, reverb: 'nha_dan', lightsMax: 1 },
  ];
  const pieces = [
    ['MOD-DAN-13', [0, 1.6, z0 + 0.35], { cell: 'n.l0.giua', color: fam.accent }],                 // bàn thờ gia tiên đối cửa
    ['MOD-DAN-14', [0, 2.5, z0 + 0.35], { cell: 'n.l0.giua' }],
    ['MOD-DAN-16', [-bay * 0.25, 1.6, z0 + D * 0.55], { cell: 'n.l0.giua' }],
    ['MOD-DAN-05', [x0 + bay, 1.6, z0], { cell: 'n.l0.giua', ry: Math.PI / 2, scaleX: D / 3.2 }],
    ['MOD-DAN-05', [x0 + 2 * bay, 1.6, z0], { cell: 'n.l0.giua', ry: Math.PI / 2, scaleX: D / 3.2 }],
    ['MOD-DAN-17', [x0 + bay / 2, 1.6, z0 + 1.0], { cell: 'n.l0.trai' }],
    ['MOD-DAN-18', [x0 + 0.3, 1.6, z0 + D - 0.6], { cell: 'n.l0.trai', ry: Math.PI / 2 }],
    ...(T === 'T1' || T === 'T4'
      ? [['MOD-DAN-21', [x0 + W - 0.5, 1.6, z0 + 0.8], { cell: 'n.l0.phai', ry: -Math.PI / 2, chimney: true }], ['MOD-DAN-20', [x0 + W - 0.3, 1.6, z0 + D - 0.8], { cell: 'n.l0.phai', ry: -Math.PI / 2 }]]
      : [['MOD-DAN-17', [x0 + 2.5 * bay, 1.6, z0 + 1.0], { cell: 'n.l0.phai' }], ['MOD-DAN-19', [x0 + W - 0.6, 1.6, z0 + D - 0.6], { cell: 'n.l0.phai' }]]),
    ...(T === 'T4' ? [['MOD-DAN-35', [0, 1.6, z0 + D - 1.2], { cell: 'n.l0.giua' }], ['MOD-DAN-36', [bay * 0.3, 1.6, z0 + 0.9], { cell: 'n.l0.giua' }], ['MOD-DAN-50', [0, 3.6 * k, z0 + D + 0.1], { cell: null, label: { trade: fam.trade } }]] : []),
    ...TRADE_PIECES[fam.trade](T, { x0, z0, W, D, bay }),                                           // đồ theo nghề (chái nghề ở T3)
  ];
  return {
    id: fam.key, slug: fam.key.toLowerCase().replace('int-', ''), cls: 'C', region: 'thanh', type: T,
    shell: { model: 'lib_courtyard', cut: 'bld/_shared/courtyard-cut/shell', instanced: true, fit: { max: h.s }, at: { x: h.x, y: 0, z: h.z, ry: h.ry } },
    kit: ['DAN', 'KT'], palette: 'huyenthanh',
    levels: [ { lv: 0, floorY: 1.6, ceilY: 1.6 + 3.6 * k } ],
    cells, pieces,
    portals: [ { id: 'n.p.cua', a: 'out', b: 'n.l0.giua', kind: 'door', door: 'n.d.chinh', quad: [[-0.9, 1.6, z0 + D], [0.9, 1.6, z0 + D], [0.9, 4.0, z0 + D], [-0.9, 4.0, z0 + D]] },
               { id: 'n.p.trai', a: 'n.l0.giua', b: 'n.l0.trai', kind: 'door', door: 'n.d.trai', quad: 'vach-trai' },
               { id: 'n.p.phai', a: 'n.l0.giua', b: 'n.l0.phai', kind: 'door', door: 'n.d.phai', quad: 'vach-phai' } ],
    doors: [ { id: 'n.d.chinh', kind: T === 'T4' ? 'truot' : 'canh2', schedule: T === 'T4' ? 'cho' : 'nha_dan', knock: true, mod: T === 'T4' ? 'MOD-DAN-11' : 'MOD-DAN-10' },
             { id: 'n.d.trai', kind: 'canh1', schedule: 'luon_mo', mod: 'MOD-DAN-09' },
             { id: 'n.d.phai', kind: 'canh1', schedule: 'luon_mo', mod: 'MOD-DAN-09' } ],
    steps: { front: { n: 4, rise: 0.4, width: 2.4 } },                                                // bậc bệ 1,6 m
    npcs: fam.members.map((m, i) => ({ npc: `${fam.key}:${i}`, data: m, schedule: 'nha_dan', role: m.role ?? 'chuho' })),
    stations: [
      { id: `${fam.key}:an`, kind: 'case', cell: 'n.l0.giua', lv: 0, name: `Nhà ${fam.head.fullName}`, verb: 'Nghe gia chủ hỏi việc', engine: 'cases › buildCase', weekly: true },
      { id: `${fam.key}:dz`, kind: 'grid9', cell: 'n.l0.giua', lv: 0, name: 'Án dương trạch tại nhà', verb: 'Xem cách kê nhà', engine: 'xuankong › xuankongPan', facingDeg: facingDeg(h.ry) },
    ],
    stream: { load: 40, unload: 70 },
  };
}
export const facingDeg = (ry) => ((Math.atan2(Math.sin(ry), -Math.cos(ry)) * 180) / Math.PI + 360) % 360;   // Bắc 0°, Đông 90°
```

`TRADE_PIECES` (bảng hàm đặt đồ theo nghề) theo 08-06 §5.3; chái T2 / T3 sinh bằng `annex(h, side)` (mô-đun có ngoại thất, 08-09 §3.3). Kiểm `facingDeg`: nhà 01 (ry π/2) → 90° (Mão); nhà 09 (ry 0) → 180° (Ngọ); nhà 32 (ry 0,910) → 128° (Tốn) — khớp bảng 08-09 §3.2.

---

## 6. Thứ tự dán và kiểm (P1)

| Bước | Việc | Test phải xanh |
|---|---|---|
| 1 | `_shared.js` + `uStair` | T-10 với thang giả lập |
| 2 | `sm-lauchuong.js` (cờ tắt) | T-01, T-07, T-08, T-09, T-15, T-16 |
| 3 | `sm-diendong.js` (cờ tắt) | như trên + T-21 (iOS), T-22 (`thaitue`) |
| 4 | `sm-dientay.js` (cờ tắt) | như trên + kiểm «không vòng qua cổng» |
| 5 | bật cờ lần lượt: lầu chuông → Thái Tuế → Vận Mệnh | thử tay 08-12 §4 mỗi lần |
| 6 | `ht-nha.js` (chưa bật — chờ P4) | T-23, T-24 |
