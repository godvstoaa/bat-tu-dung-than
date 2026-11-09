# 08-24 · Công thức mẫu đợt P2: Chính Đường · Sơn Môn · bảo tháp Bắc

> Tiếp 08-16 (cùng quy ước, cùng `_shared.js`). Ba công thức khó nhất của Sơn Môn: nhà **hai tầng** có thang dài (Chính Đường), **cổng có phòng và lầu** + cánh cổng nặng (Sơn Môn), và **tháp thang xoắn** bốn tầng (bảo tháp Bắc). Số đo theo 08-02 §5.2 và 08-18; chỉnh theo `bld-void` chính thức trước khi dán.

---

## 1. INT-SM-CHINHDUONG — Chính Đường

```js
// src/game/int/sm-chinhduong.js (chưa có — cần làm)
// palace_grand fit width 44, đáy vỏ ở y 4 (nền L2). Cục bộ: lõi x −10…10, z −9,6…0,9; tầng trên x −9,5…9,5, z −8,6…4,4.
const Y0 = 0.45, Y1 = 9.65;                                  // sàn tầng 1 / tầng 2 (cục bộ, cộng at.y = 4)
const stairLau = (id, x, dir) => ({                          // thang lầu dốc 37 bậc 0,25 / 0,25 dọc tường hồi, chân ở sau
  id, from: 0, to: 1, switchY: 4 + (Y0 + Y1) / 2, railing: true, mod: ['MOD-KT-15', 'MOD-KT-20'],
  steps: Array.from({ length: 37 }, (_, k) => ({ x, z: -9.0 + (k + 0.5) * 0.25, w: 1.4, d: 0.3, ry: 0, top: 4 + Y0 + (k + 1) * 0.2486, seg: k })),
  side: dir,                                                 // 'len' (Tây) / 'xuong' (Đông) — chỉ là nhãn hiển thị; cả hai đi hai chiều
});

export default {
  id: 'INT-SM-CHINHDUONG', slug: 'sm-chinhduong', cls: 'A', region: 'thanh',
  shell: { model: 'palace_grand', cut: 'bld/sm-chinhduong/shell', fit: { width: 44 }, at: { x: 0, y: 4, z: -31, ry: 0 } },
  kit: ['BAC', 'NHO', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, floorY: Y0, ceilY: 6.40 }, { lv: 1, floorY: Y1, ceilY: 12.80 } ],

  cells: [
    { id: 'cd.l0.chinh',  lv: 0, name: 'Tổ Sư đường',      box: [-4.8, Y0, -9.6, 4.8, 6.4, 0.9], sealed: false, ambient: 0.28, exposure: 0.3,
      reverb: 'dai_dien', bed: 'tung_xa_mo', camera: { mode: 'trong', maxDist: 4.6, pitch: [0.12, 0.75], fovAdd: 6 },
      fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 4 },
    { id: 'cd.l0.tay',    lv: 0, name: 'Tĩnh thất Thầy',   box: [-10.0, Y0, -9.6, -4.8, 6.4, 0.9], reverb: 'dien_vua', bed: 'nen_lach_tach',
      camera: { mode: 'trong', maxDist: 3.0 }, fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 2 },
    { id: 'cd.l0.dong',   lv: 0, name: 'Phòng Sổ Môn Phái', box: [4.8, Y0, -9.6, 10.0, 6.4, 0.9], reverb: 'dien_vua', bed: 'trang_sach',
      camera: { mode: 'trong', maxDist: 3.0 }, fade: ['roof_L0', 'roof_L1', 'upper_L1'], lightsMax: 2 },
    { id: 'cd.l1.kinh',   lv: 1, name: 'Tàng Kinh',        box: [-9.5, Y1, -8.6, 9.5, 12.8, 0.4], reverb: 'dien_vua', bed: 'trang_sach',
      camera: { mode: 'trong', maxDist: 4.0 }, fade: ['roof_L1'], lightsMax: 3 },
    { id: 'cd.l1.loggia', lv: 1, name: 'Lô gia Vọng Môn',  box: [-9.5, Y1, 0.4, 9.5, 12.8, 4.4], reverb: 'lau_go', bed: 'go_gio',
      camera: { mode: 'bodoc' }, fade: ['roof_L1'], lightsMax: 2 },
  ],

  portals: [
    { id: 'cd.p.giua',   a: 'out', b: 'cd.l0.chinh', kind: 'door', door: 'cd.d.giua',
      quad: [[-1.6, Y0, 0.9], [1.6, Y0, 0.9], [1.6, Y0 + 3.75, 0.9], [-1.6, Y0 + 3.75, 0.9]] },
    { id: 'cd.p.ngach',  a: 'out', b: 'cd.l0.tay', kind: 'door', door: 'cd.d.ngach',
      quad: [[-10.0, Y0, -1.6], [-10.0, Y0, -0.4], [-10.0, Y0 + 2.4, -0.4], [-10.0, Y0 + 2.4, -1.6]] },
    { id: 'cd.p.thongtay', a: 'cd.l0.chinh', b: 'cd.l0.tay', kind: 'open',
      quad: [[-4.8, Y0, -0.7], [-4.8, Y0, 0.9], [-4.8, Y0 + 3.2, 0.9], [-4.8, Y0 + 3.2, -0.7]] },
    { id: 'cd.p.thongdong', a: 'cd.l0.chinh', b: 'cd.l0.dong', kind: 'open',
      quad: [[4.8, Y0, -0.7], [4.8, Y0, 0.9], [4.8, Y0 + 3.2, 0.9], [4.8, Y0 + 3.2, -0.7]] },
    { id: 'cd.p.thangtay', a: 'cd.l0.tay', b: 'cd.l1.kinh', kind: 'stair',
      quad: [[-9.4, Y1, -3.0], [-8.0, Y1, -3.0], [-8.0, Y1, 0.3], [-9.4, Y1, 0.3]] },
    { id: 'cd.p.thangdong', a: 'cd.l0.dong', b: 'cd.l1.kinh', kind: 'stair',
      quad: [[8.0, Y1, -3.0], [9.4, Y1, -3.0], [9.4, Y1, 0.3], [8.0, Y1, 0.3]] },
    { id: 'cd.p.loggia', a: 'cd.l1.kinh', b: 'cd.l1.loggia', kind: 'open',
      quad: [[-1.2, Y1, 0.4], [1.2, Y1, 0.4], [1.2, Y1 + 2.8, 0.4], [-1.2, Y1 + 2.8, 0.4]] },
    ...[-7.6, -3.8, 0, 3.8, 7.6].map((x, i) => ({ id: `cd.p.lw${i}`, a: 'cd.l1.loggia', b: 'out', kind: 'window',
      quad: [[x - 0.8, Y1 + 0.6, 4.4], [x + 0.8, Y1 + 0.6, 4.4], [x + 0.8, Y1 + 2.2, 4.4], [x - 0.8, Y1 + 2.2, 4.4]] })),
    ...[['-9.5', -1], ['9.5', 1]].map(([x], i) => ({ id: `cd.p.tron${i}`, a: 'cd.l1.kinh', b: 'out', kind: 'window',
      quad: [[+x, Y1 + 0.8, -5.0], [+x, Y1 + 0.8, -3.4], [+x, Y1 + 2.4, -3.4], [+x, Y1 + 2.4, -5.0]] })),
  ],

  doors: [
    { id: 'cd.d.giua', portal: 'cd.p.giua', kind: 'canh2', lv: 0, mod: 'MOD-BAC-20', frame: 'MOD-BAC-21',
      leaves: [ { hinge: [-1.6, Y0, 0.9], w: 1.6, h: 3.75, open: 1.75, dir: -1 }, { hinge: [1.6, Y0, 0.9], w: 1.6, h: 3.75, open: 1.75, dir: +1 } ],
      schedule: 'dien_chinh', carve: [-1.6, 0.6, 1.6, 1.2], sound: 'go_nang' },
    { id: 'cd.d.ngach', portal: 'cd.p.ngach', kind: 'canh1', lv: 0, mod: 'MOD-BAC-22', frame: 'MOD-BAC-23',
      leaves: [ { hinge: [-10.0, Y0, -1.6], w: 1.2, h: 2.4, open: 1.6, dir: +1 } ], schedule: 'luon_mo', carve: [-10.3, -1.6, -9.7, -0.4] },
  ],

  stairs: [ stairLau('cd.s.tay', -8.7, 'len'), stairLau('cd.s.dong', 8.7, 'xuong') ],

  pieces: [
    // tầng 1
    ['MOD-BAC-01', [-10.0, Y0, -9.6], { cell: 'auto', n: 6, step: [3.2, 0, 0], rows: 4, rowStep: [0, 0, 2.625] }],
    ['MOD-BAC-07', [-2.4, Y0, -6.0],  { cell: 'cd.l0.chinh', n: 2, step: [4.8, 0, 0], rows: 2, rowStep: [0, 0, 3.4], scaleY: 5.95 }],
    ['MOD-BAC-09', [-2.4, Y0, -6.0],  { cell: 'cd.l0.chinh', n: 2, step: [4.8, 0, 0], rows: 2, rowStep: [0, 0, 3.4] }],
    ['MOD-BAC-06', [-4.8, Y0, -9.6],  { cell: 'cd.l0.chinh', ry: Math.PI / 2, n: 3, step: [0, 0, 2.97], mirrorX: true }],      // vách hai bên, chừa ô thông
    ['MOD-BAC-27', [0, Y0, -8.4],     { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-29', [0, Y0, -8.0],     { cell: 'cd.l0.chinh', widthTo: 6.4 }],
    ['deity_tosu', [0, Y0 + 1.35, -8.6], { cell: 'cd.l0.chinh', fit: { height: 3.2 }, review: 'noi-dung' }],
    ['MOD-BAC-28', [-2.4, Y0 + 1.35, -9.0], { cell: 'cd.l0.chinh', n: 9, step: [0.6, 0, 0], scale: 0.5, special: 'baivi.tosu' }],
    ['MOD-BAC-15', [0, 6.4, -6.5],    { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-14', [-4.8, 6.4, -9.6], { cell: 'cd.l0.chinh', n: 3, step: [3.2, 0, 0], rows: 4, rowStep: [0, 0, 2.625], skip: 'tao-tinh' }],
    ['MOD-BAC-30', [0, Y0, -4.4],     { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-31', [0, Y0, -4.4],     { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-32', [0, Y0 + 1.0, -4.4], { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-33', [-1.3, Y0 + 1.0, -4.4], { cell: 'cd.l0.chinh', n: 2, step: [2.6, 0, 0] }],
    ['MOD-BAC-35', [-1.6, Y0, -2.6],  { cell: 'cd.l0.chinh', n: 3, step: [1.6, 0, 0] }],
    ['MOD-BAC-37', [3.4, Y0, -4.0],   { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-52', [0, Y0, -0.4],     { cell: 'cd.l0.chinh' }],
    ['MOD-BAC-45', [-2.4, 3.0, -5.4], { cell: 'cd.l0.chinh', n: 2, step: [4.8, 0, 0], rows: 2, rowStep: [0, 0, 3.4] }],
    ['MOD-BAC-48', [-1.6, 5.4, -5.5], { cell: 'cd.l0.chinh', n: 2, step: [3.2, 0, 0], rows: 2, rowStep: [0, 0, 4.0] }],
    ['MOD-BAC-46', [0, 5.0, -9.4],    { cell: 'cd.l0.chinh', label: { han: '玄館', hv: 'Huyền Quán', nghia: 'quán của đạo huyền' } }],
    ['MOD-BAC-47', [-2.4, 1.2, -2.6], { cell: 'cd.l0.chinh', n: 2, step: [4.8, 0, 0], special: 'caudoi.chinhduong' }],
    // tĩnh thất Thầy
    ['MOD-BAC-42', [-7.4, Y0, -4.8],  { cell: 'cd.l0.tay' }],
    ['MOD-BAC-43', [-7.4, Y0, -5.7],  { cell: 'cd.l0.tay', seat: 'SE__thay_ghe' }],
    ['MOD-BAC-35', [-7.4, Y0, -3.6],  { cell: 'cd.l0.tay', seat: 'SE__khach' }],
    ['MOD-BAC-40', [-9.6, Y0, -6.0],  { cell: 'cd.l0.tay', ry: Math.PI / 2 }],
    ['MOD-BAC-49', [-6.0, Y0, -6.2],  { cell: 'cd.l0.tay' }],
    // phòng Sổ Môn Phái
    ['MOD-BAC-40', [9.6, Y0, -6.0],   { cell: 'cd.l0.dong', ry: -Math.PI / 2, n: 2, step: [0, 0, 3.2] }],
    ['MOD-BAC-42', [6.8, Y0, -4.8],   { cell: 'cd.l0.dong', special: 'so.monphai' }],
    ['MOD-BAC-41', [6.2, Y0, -1.4],   { cell: 'cd.l0.dong' }],
    // tầng 2
    ['MOD-BAC-02', [-9.5, Y1, -8.6],  { cell: 'auto', n: 6, step: [3.17, 0, 0], rows: 4, rowStep: [0, 0, 3.25] }],
    ['MOD-NHO-17', [-8.0, Y1, -8.3],  { cell: 'cd.l1.kinh', n: 5, step: [3.2, 0, 0] }],
    ['MOD-NHO-45', [3.2, Y1, -4.2],   { cell: 'cd.l1.kinh' }],
    ['MOD-NHO-46', [-3.2, Y1, -4.2],  { cell: 'cd.l1.kinh' }],
    ['MOD-NHO-13', [-7.2, Y1, -2.0],  { cell: 'cd.l1.kinh', n: 2, step: [1.6, 0, 0], rows: 2, rowStep: [0, 0, 1.0] }],
    ['MOD-NHO-16', [-6.4, Y1, -1.5],  { cell: 'cd.l1.kinh' }],
    ['MOD-BAC-42', [6.0, Y1, -2.0],   { cell: 'cd.l1.kinh', special: 'chepkinh' }],
    ['MOD-NHO-20', [6.0, Y1 + 0.9, -2.0], { cell: 'cd.l1.kinh' }],
    ['MOD-BAC-43', [5.0, Y1, -6.4],   { cell: 'cd.l1.kinh', seat: 'SE__thukinh' }],
    ['MOD-BAC-16', [-9.5, 12.8, -4.0],{ cell: 'cd.l1.kinh', n: 2, step: [9.5, 0, 0] }],
    ['MOD-BAC-24', [-9.5, Y1 + 0.8, -4.2], { cell: 'cd.l1.kinh', ry: Math.PI / 2, n: 2, step: [19.0, 0, 0] }],
    ['MOD-KT-20',  [-9.4, Y1, -3.0],  { cell: 'cd.l1.kinh', n: 2, step: [17.4, 0, 0] }],
    ['MOD-BAC-50', [-9.5, Y1, 4.3],   { cell: 'cd.l1.loggia', n: 6, step: [3.17, 0, 0] }],
    ['MOD-BAC-25', [-7.6, Y1 + 0.6, 4.4], { cell: 'cd.l1.loggia', n: 5, step: [3.8, 0, 0] }],
    ['MOD-BAC-35', [-3.0, Y1, 2.4],   { cell: 'cd.l1.loggia', n: 2, step: [6.0, 0, 0] }],
  ],

  stations: [
    { id: 'cd_tosu',      kind: 'van',  cell: 'cd.l0.chinh',  lv: 0, name: 'Bài Vị Tổ Sư', verb: 'Dâng hương tổ sư',
      at: [0, Y0, -4.4], spot: [0, Y0, -3.2], label: [0, 4.4, -8.6], engine: 'remedy-fate › meritLedger', daily: 'cd_tosu' },
    { id: 'cd_khoale',    kind: 'van',  cell: 'cd.l0.chinh',  lv: 0, name: 'Khóa lễ', verb: 'Ngồi dự khóa lễ',
      at: [0, Y0, -2.6], spot: [0, Y0, -2.0], gio: ['Mão', 'Dậu'], engine: 'remedy-fate › DAO_JIA', daily: 'cd_khoale' },
    { id: 'cd_somonphai', kind: 'desk', cell: 'cd.l0.dong',   lv: 0, name: 'Sổ Môn Phái', verb: 'Xem / ghi tên vào sổ',
      at: [6.8, Y0, -4.8], spot: [6.8, Y0, -3.6], quest: 'MQ-P-xx' },
    { id: 'cd_thaydem',   kind: 'desk', cell: 'cd.l0.tay',    lv: 0, name: 'Thầy Tử Bình (đêm)', verb: 'Thưa chuyện với Thầy',
      at: [-7.4, Y0, -4.8], spot: [-7.4, Y0, -3.6], gio: ['Tuất'], engine: 'ai › askAI', ios: 'baigiang' },
    { id: 'cd_kinh',      kind: 'desk', cell: 'cd.l1.kinh',   lv: 1, name: 'Tàng Kinh', verb: 'Mượn cổ thư',
      at: [-3.2, Y1, -4.2], spot: [-3.2, Y1, -3.0], engine: 'library-data › LIBRARY', daily: 'cd_kinh' },
    { id: 'cd_chepkinh',  kind: 'desk', cell: 'cd.l1.kinh',   lv: 1, name: 'Bàn chép kinh', verb: 'Chép một đoạn Tích Thiện Thiên',
      at: [6.0, Y1, -2.0], spot: [6.0, Y1, -0.9], engine: 'kb › JISHAN_PIAN', daily: 'cd_chepkinh' },
    { id: 'cd_vongmon',   kind: 'view', cell: 'cd.l1.loggia', lv: 1, name: 'Lô gia Vọng Môn', verb: 'Ngắm toàn sân',
      at: [0, Y1, 3.6], spot: [0, Y1, 2.8], quest: 'ACT-ngamsao' },
  ],

  npcs: [
    { npc: 'thay_tubinh', schedule: 'xem 08-21 B1', anchor: { Tuat: 'cd.l0.tay:SE__thay_ghe' } },
    { npc: 'role:daodong', schedule: [['Mão', 'Mão', 'cd.l0.chinh:[−1.3, 0.45, −3.8]', 'event:thaynen'], ['Dậu', 'Dậu', 'cd.l0.chinh:[1.3, 0.45, −3.8]', 'event:thaynen']] },
    { npc: 'role:thukinh', schedule: [['Thìn', 'Thân', 'cd.l1.kinh:SE__thukinh'], ['Dậu', 'Mão', 'nghi']] },
  ],

  lights: [
    { cell: 'cd.l0.chinh', kind: 'nen', at: [-1.3, Y0 + 1.9, -4.4] }, { cell: 'cd.l0.chinh', kind: 'nen', at: [1.3, Y0 + 1.9, -4.4] },
    { cell: 'cd.l0.chinh', kind: 'denlong', at: [-1.6, 5.0, -5.5], sched: 'dem' }, { cell: 'cd.l0.chinh', kind: 'denlong', at: [1.6, 5.0, -5.5], sched: 'dem' },
    { cell: 'cd.l0.chinh', kind: 'denlong', at: [-1.6, 5.0, -1.5], sched: 'dem' }, { cell: 'cd.l0.chinh', kind: 'denlong', at: [1.6, 5.0, -1.5], sched: 'dem' },
    { cell: 'cd.l0.chinh', kind: 'troi', at: [0, 3.0, -0.6] },
    { cell: 'cd.l0.tay', kind: 'dendau', at: [-7.4, Y0 + 1.2, -4.8], sched: (g) => g === 'Tuất' || g === 'Hợi' },
    { cell: 'cd.l0.dong', kind: 'dendau', at: [7.4, Y0 + 1.2, -4.8], sched: 'dien_chinh' },
    ...[-6, 0, 6].map((x) => ({ cell: 'cd.l1.kinh', kind: 'dendau', at: [x, Y1 + 1.4, -6.0], sched: (g) => !['Tý', 'Sửu', 'Dần'].includes(g) })),
    { cell: 'cd.l1.loggia', kind: 'denlong', at: [-4.0, Y1 + 2.6, 3.8], sched: 'dem' }, { cell: 'cd.l1.loggia', kind: 'denlong', at: [4.0, Y1 + 2.6, 3.8], sched: 'dem' },
  ],

  ios: { replace: { cd_thaydem: { verb: 'Nghe Thầy giảng một bài', engine: 'lá số mẫu (MAU-A)' } } },
  stream: { load: 80, unload: 120 },
  col: 'bld/sm-chinhduong.col.json',
  shots: [
    { id: 'ngoai-nam', pos: [0, 12, 2], look: [0, 10, -31], hour: 10 },
    { id: 'ngoai-dem', pos: [0, 12, 2], look: [0, 10, -31], hour: 0 },
    { id: 'trong-tosu', pos: [0, 6.2, -31.4], look: [0, 7.5, -39], hour: 10 },
    { id: 'tinhthat', pos: [-6.0, 6.0, -31.5], look: [-7.4, 5.0, -36], hour: 20 },
    { id: 'tangkinh', pos: [6.0, 15.2, -31.0], look: [-3.0, 14.0, -37], hour: 14 },
    { id: 'bodoc', pos: [6, 26, -22], look: [0, 6, -35], hour: 10, cutaway: true },
  ],
};
```

Kiểm khi dán:

| Kiểm | Kỳ vọng |
|---|---|
| Thang: 37 bậc, chạy z −9,0 → 0,25 (cục bộ) | 9,25 m trong lõi sâu 10,5 m; đỉnh thang ở z 0,25 nằm trong tầng 2 (z ≤ 0,4) — vừa mép vách ngăn tầng 2 → miệng thang 1,4 × 3,3 nằm hoàn toàn trong `cd.l1.kinh` |
| `switchY` | 4 + (0,45 + 9,65)/2 = 9,05 (thế giới) |
| Bậc chênh | 9,2 / 37 = 0,2486 m < 0,41 |
| Hai thang nằm trong hai phòng cánh | x ±8,7 ± 0,7 ⊂ cánh x ±(4,8…10) |
| Trục nhìn cửa giữa (08-21 A1) | bình phong BAC-52 cao 2,4 ở z −0,4; tượng tổ sư trên bệ: đỉnh y ≈ 0,45 + 1,35 + 3,2 = 5,0 → thấy nửa trên tượng qua đầu bình phong khi đứng ngưỡng |

---

## 2. INT-SM-SONMON — Sơn Môn

```js
// src/game/int/sm-sonmon.js (chưa có — cần làm)
// gate_sect fit width 30 tại (0, 0, 67,2), ry 0. Cục bộ: lối giữa x −2,5…2,5; phòng gác x ±(3…13), z −2,9…3,1.
const LV1 = 6.4;
export default {
  id: 'INT-SM-SONMON', slug: 'sm-sonmon', cls: 'B', region: 'thanh',
  shell: { model: 'gate_sect', cut: 'bld/sm-sonmon/shell', fit: { width: 30 }, at: { x: 0, y: 0, z: 67.2, ry: 0 } },
  kit: ['BAC', 'DAN', 'KT'], palette: 'huyenquan',
  levels: [ { lv: 0, floorY: 0.4, ceilY: 5.0 }, { lv: 1, floorY: LV1, ceilY: 10.4 } ],
  keepCorridor: { x0: -2.5, x1: 2.5 },                         // thay `keep: (x) => |x| > 3,4` hiện có — khoét đúng bằng lối thật

  cells: [
    { id: 'sm.l0.tay',  lv: 0, name: 'Phòng Nhập Môn',          box: [-13, 0.4, -2.9, -3, 5.0, 3.1], reverb: 'phong_nho', camera: { mode: 'trong', maxDist: 2.8 }, lightsMax: 2 },
    { id: 'sm.l0.dong', lv: 0, name: 'Phòng Khách Thập Phương', box: [3, 0.4, -2.9, 13, 5.0, 3.1],  reverb: 'phong_nho', camera: { mode: 'trong', maxDist: 2.8 }, lightsMax: 2,
      split: { at: 'z', value: -0.6, back: { id: 'sm.l0.kho', name: 'Kho lão Tùng', locked: { reason: 'đồ riêng người gác', unlock: 'flag:sm.lao_tung.tin' } } } },   // vách đo được (08-18 §4)
    { id: 'sm.l1.tay',  lv: 1, name: 'Phòng trên Tây', box: [-7, LV1, -2.9, -3, 10.4, 3.1], camera: { mode: 'bodoc' }, reverb: 'lau_go', lightsMax: 1 },
    { id: 'sm.l1.dong', lv: 1, name: 'Phòng trên Đông', box: [3, LV1, -2.9, 7, 10.4, 3.1], camera: { mode: 'bodoc' }, reverb: 'lau_go', lightsMax: 1 },
    { id: 'sm.l1.lau',  lv: 1, name: 'Lầu Nghênh Khách', box: [-6.5, LV1, -2.0, 6.5, 10.4, 2.5], camera: { mode: 'bodoc' }, reverb: 'lau_go', bed: 'go_gio', lightsMax: 2 },
  ],

  portals: [
    { id: 'sm.p.tay',  a: 'out', b: 'sm.l0.tay',  kind: 'door', door: 'sm.d.tay',  quad: [[-3, 0.4, -0.6], [-3, 0.4, 0.6], [-3, 2.8, 0.6], [-3, 2.8, -0.6]] },
    { id: 'sm.p.dong', a: 'out', b: 'sm.l0.dong', kind: 'door', door: 'sm.d.dong', quad: [[3, 0.4, 0.6], [3, 0.4, -0.6], [3, 2.8, -0.6], [3, 2.8, 0.6]] },
    { id: 'sm.p.tthang', a: 'sm.l0.tay', b: 'sm.l1.tay', kind: 'stair', quad: 'thang-tay' },
    { id: 'sm.p.dthang', a: 'sm.l0.dong', b: 'sm.l1.dong', kind: 'stair', quad: 'thang-dong' },
    { id: 'sm.p.lautay', a: 'sm.l1.tay', b: 'sm.l1.lau', kind: 'open', quad: [[-3, LV1, -1.0], [-3, LV1, 1.0], [-3, LV1 + 2.4, 1.0], [-3, LV1 + 2.4, -1.0]] },
    { id: 'sm.p.laudong', a: 'sm.l1.dong', b: 'sm.l1.lau', kind: 'open', quad: [[3, LV1, 1.0], [3, LV1, -1.0], [3, LV1 + 2.4, -1.0], [3, LV1 + 2.4, 1.0]] },
    { id: 'sm.p.hienBac', a: 'sm.l1.lau', b: 'out', kind: 'open', quad: [[-2, LV1, -2.0], [2, LV1, -2.0], [2, LV1 + 2.6, -2.0], [-2, LV1 + 2.6, -2.0]] },   // khoét mới (08-18 §4)
    { id: 'sm.p.hienNam', a: 'sm.l1.lau', b: 'out', kind: 'open', quad: [[2, LV1, 2.5], [-2, LV1, 2.5], [-2, LV1 + 2.6, 2.5], [2, LV1 + 2.6, 2.5]] },
    ...[-8, 8].flatMap((x, i) => [
      { id: `sm.p.wn${i}`, a: x < 0 ? 'sm.l0.tay' : 'sm.l0.dong', b: 'out', kind: 'window', quad: [[x - 0.6, 1.4, -2.9], [x + 0.6, 1.4, -2.9], [x + 0.6, 2.4, -2.9], [x - 0.6, 2.4, -2.9]] },
      { id: `sm.p.ws${i}`, a: x < 0 ? 'sm.l0.tay' : 'sm.l0.dong', b: 'out', kind: 'window', quad: [[x + 0.6, 1.4, 3.1], [x - 0.6, 1.4, 3.1], [x - 0.6, 2.4, 3.1], [x + 0.6, 2.4, 3.1]] } ]),
  ],

  doors: [
    { id: 'sm.d.cong', kind: 'congnang', lv: 0, portal: null,
      leaves: [ { hinge: [-2.5, 0, 0.2], w: 2.5, h: 4.6, open: 1.57, dir: -1 }, { hinge: [2.5, 0, 0.2], w: 2.5, h: 4.6, open: 1.57, dir: +1 } ],
      schedule: 'son_mon', connectsRegions: true, wicket: 'sm.d.ngach' },
    { id: 'sm.d.ngach', kind: 'ngach', lv: 0, onLeaf: 'sm.d.cong:0', w: 0.9, h: 2.0, schedule: 'luon_mo', near: 'sm.d.cong' },
    { id: 'sm.d.tay',  portal: 'sm.p.tay',  kind: 'canh1', lv: 0, leaves: [ { hinge: [-3, 0.4, -0.6], w: 1.2, h: 2.4, open: 1.6, dir: -1 } ], schedule: 'luon_mo', carve: [-3.3, -0.6, -2.7, 0.6] },
    { id: 'sm.d.dong', portal: 'sm.p.dong', kind: 'canh1', lv: 0, leaves: [ { hinge: [3, 0.4, 0.6], w: 1.2, h: 2.4, open: 1.6, dir: +1 } ], schedule: 'son_mon', carve: [2.7, -0.6, 3.3, 0.6] },
  ],

  stairs: [
    { id: 'sm.s.tay', from: 0, to: 1, switchY: 3.4, railing: true, mod: ['MOD-KT-15'],
      steps: Array.from({ length: 24 }, (_, k) => ({ x: -12.2, z: 2.4 - (k + 0.5) * 0.25, w: 1.2, d: 0.3, ry: 0, top: 0.4 + (k + 1) * 0.25, seg: k })) },
    { id: 'sm.s.dong', from: 0, to: 1, switchY: 3.4, railing: true, mod: ['MOD-KT-15'],
      steps: Array.from({ length: 24 }, (_, k) => ({ x: 12.2, z: 2.4 - (k + 0.5) * 0.25, w: 1.2, d: 0.3, ry: 0, top: 0.4 + (k + 1) * 0.25, seg: k })) },
  ],

  pieces: [
    ['MOD-DAN-01', [-13, 0.4, -2.9], { cell: 'sm.l0.tay', n: 3, step: [3.33, 0, 0], rows: 2, rowStep: [0, 0, 3.0] }],
    ['MOD-BAC-42', [-8.0, 0.4, -1.6], { cell: 'sm.l0.tay' }], ['MOD-BAC-43', [-8.0, 0.4, -2.5], { cell: 'sm.l0.tay', seat: 'SE__laotung' }],
    ['MOD-DAN-18', [-10.6, 0.4, -2.6], { cell: 'sm.l0.tay', special: 'so.nhapmon' }], ['MOD-DAN-27', [-8.6, 1.3, -1.6], { cell: 'sm.l0.tay' }],
    ['MOD-BAC-35', [-8.0, 0.4, -0.2], { cell: 'sm.l0.tay', seat: 'SE__khach' }],
    ['MOD-NHO-34', [6.0, 0.4, 0.8], { cell: 'sm.l0.dong', special: 'board.viecngay' }], ['MOD-DAN-16', [9.0, 0.4, 1.8], { cell: 'sm.l0.dong' }],
    ['MOD-DAN-26', [9.0, 0.9, 1.8], { cell: 'sm.l0.dong' }], ['MOD-BAC-42', [6.2, 0.4, 2.2], { cell: 'sm.l0.dong', special: 'so.khach' }],
    ['MOD-DAN-05', [3, 0.4, -0.6], { cell: 'sm.l0.dong', n: 4, step: [2.5, 0, 0], gapAt: [10.5, 12] }],                         // vách kho
    ['MOD-BAC-48', [-6.6, LV1, -2.4], { cell: 'sm.l1.tay', n: 6, step: [0.6, 0, 0], special: 'kho.denlong' }],
    ['MOD-BAC-02', [-6.5, LV1, -2.0], { cell: 'sm.l1.lau', n: 4, step: [3.25, 0, 0] }],
    ['MOD-BAC-50', [-6.5, LV1, 2.4], { cell: 'sm.l1.lau', n: 4, step: [3.25, 0, 0], gapAt: [-2, 2] }],
    ['MOD-BAC-43', [-1.6, LV1, 1.2], { cell: 'sm.l1.lau', seat: 'SE__khongtiensinh' }], ['MOD-GNA-28', [0, LV1, 1.0], { cell: 'sm.l1.lau' }],
  ],

  stations: [
    { id: 'sm_nhapmon', kind: 'desk', cell: 'sm.l0.tay', lv: 0, name: 'Lão Tùng', verb: 'Trình lá số nhập môn',
      at: [-8.0, 0.4, -1.6], spot: [-8.0, 0.4, -0.4], engine: 'chart › analyze', quest: 'MQ-P-xx', ui: 'gate-profile' },
    { id: 'sm_viecngay', kind: 'desk', cell: 'sm.l0.dong', lv: 0, name: 'Bảng Việc Ngày', verb: 'Xem việc hôm nay',
      at: [6.0, 0.4, 0.8], spot: [6.0, 0.4, 1.9], engine: 'state › settleTasks' },
    { id: 'sm_sokhach', kind: 'desk', cell: 'sm.l0.dong', lv: 0, name: 'Sổ Khách', verb: 'Ai đã ghé hôm nay',
      at: [6.2, 0.4, 2.2], spot: [7.2, 0.4, 2.4], engine: 'protocol › lb' },
    { id: 'sm_lau', kind: 'desk', cell: 'sm.l1.lau', lv: 1, name: 'Khổng tiên sinh', verb: 'Nghe tiên sinh luận mệnh',
      at: [-1.6, LV1, 1.2], spot: [-0.4, LV1, 1.6], gio: ['Dậu', 'Tuất'], quest: 'PERSONA-khong_tiensinh' },
  ],
  stream: { load: 60, unload: 100 },
  col: 'bld/sm-sonmon.col.json',
};
```

Kiểm: thang mỗi phòng gác 24 bậc × 0,25 = 6,0 m chạy z 2,4 → −3,6 — **vượt** mép sau phòng (−2,9) 0,7 m. Sửa khi dán: thang chữ L (12 bậc dọc tường Tây phòng, chiếu nghỉ góc, 12 bậc dọc tường sau) — giữ trong 10 × 6 m. Ghi lại để không ai dán nguyên.

---

## 3. INT-SM-THAP-TB / -DB — Bảo tháp Bắc

```js
// src/game/int/sm-thap-bac.js (chưa có — cần làm) — một tệp, hai bản (Tây / Đông) khác `at` và tên
import { spiralStair } from './_shared.js';                    // sinh bậc rẻ quạt + seg (08-19 §2.5)
const FLOORS = [0.40, 6.80, 12.00, 16.20];
const make = (side) => ({
  id: side < 0 ? 'INT-SM-THAP-TB' : 'INT-SM-THAP-DB', slug: side < 0 ? 'sm-thap-tb' : 'sm-thap-db', cls: 'B', region: 'thanh',
  shell: { model: 'lib_pagoda5', cut: 'bld/_shared/pagoda5-cut/shell', hd: false, fit: { height: 26 }, at: { x: side * 51, y: 0, z: -56, ry: 0 } },
  kit: ['BAC', 'KT'], palette: 'huyenquan',
  levels: FLOORS.map((floorY, lv) => ({ lv, floorY, ceilY: [6.4, 11.6, 15.8, 19.2][lv] })),
  cells: [
    { id: 'th.l0', lv: 0, box: [-4.5, 0.4, -4.5, 4.5, 6.4, 4.5], hollowCore: 0.6, reverb: 'thap_da', camera: { mode: 'bodoc' }, lightsMax: 2 },
    { id: 'th.l1.phong', lv: 1, box: [-3.5, 6.8, -3.7, 3.5, 11.6, 3.7], reverb: 'thap_da', camera: { mode: 'bodoc' }, lightsMax: 1 },
    { id: 'th.l2.phong', lv: 2, box: [-3.5, 12.0, -3.2, 3.5, 15.8, 3.2], reverb: 'thap_da', camera: { mode: 'bodoc' }, lightsMax: 1 },
    { id: 'th.l3.dinh',  lv: 3, box: [-2.0, 16.2, -2.0, 2.0, 19.2, 2.0], reverb: 'lau_go', bed: 'go_gio', camera: { mode: 'bodoc' }, lightsMax: 1 },
  ],
  decks: [ { lv: 1, ring: [-5.5, -5.5, 5.5, 5.5], hole: [-3.5, -3.7, 3.5, 3.7], top: 6.8 }, { lv: 2, ring: [-5.0, -5.2, 5.0, 5.2], hole: [-3.5, -3.2, 3.5, 3.2], top: 12.0 } ],
  stairs: [
    spiralStair('th.s1', { from: 0, to: 1, y0: 0.40, y1: 6.80, rIn: 0.6, rOut: 2.6, perTurn: 16, start: 0 }),        // 29 bậc
    spiralStair('th.s2', { from: 1, to: 2, y0: 6.80, y1: 12.00, rIn: 0.6, rOut: 2.4, perTurn: 16, start: Math.PI }), // 24 bậc
    spiralStair('th.s3', { from: 2, to: 3, y0: 12.00, y1: 16.20, rIn: 0.6, rOut: 1.8, perTurn: 16, start: 0 }),     // 19 bậc
  ],
  prep: ['hollow:remove-cross-walls'],                          // dọn vách chữ thập rác ở trệt (08-18 §3)
  portals: [
    { id: 'th.p.cua', a: 'out', b: 'th.l0', kind: 'door', door: 'th.d.cua', quad: [[-0.9, 0.4, 4.5], [0.9, 0.4, 4.5], [0.9, 3.0, 4.5], [-0.9, 3.0, 4.5]] },
    { id: 'th.p.h1', a: 'th.l1.phong', b: 'out', kind: 'open', quad: [[-0.8, 6.8, 3.7], [0.8, 6.8, 3.7], [0.8, 9.2, 3.7], [-0.8, 9.2, 3.7]] },
    { id: 'th.p.h2', a: 'th.l2.phong', b: 'out', kind: 'open', quad: [[-0.8, 12.0, 3.2], [0.8, 12.0, 3.2], [0.8, 14.4, 3.2], [-0.8, 14.4, 3.2]] },
    { id: 'th.p.s1', a: 'th.l0', b: 'th.l1.phong', kind: 'stair', quad: 'spiral:th.s1' },
    { id: 'th.p.s2', a: 'th.l1.phong', b: 'th.l2.phong', kind: 'stair', quad: 'spiral:th.s2' },
    { id: 'th.p.s3', a: 'th.l2.phong', b: 'th.l3.dinh', kind: 'stair', quad: 'spiral:th.s3' },
  ],
  doors: [ { id: 'th.d.cua', portal: 'th.p.cua', kind: 'canh2', lv: 0, leaves: [ { hinge: [-0.9, 0.4, 4.5], w: 0.9, h: 2.6, open: 1.7, dir: -1 }, { hinge: [0.9, 0.4, 4.5], w: 0.9, h: 2.6, open: 1.7, dir: 1 } ], schedule: 'dien_phu', carve: [-0.9, 4.2, 0.9, 4.8] } ],
  pieces: [
    ['MOD-BAC-01', [-4.5, 0.4, -4.5], { cell: 'th.l0', n: 3, step: [3.0, 0, 0], rows: 3, rowStep: [0, 0, 3.0] }],
    ['MOD-KT-18', [0, 0.4, 0], { cell: 'th.l0', scaleY: 18.8 / 3.6 }],                                                // trụ tâm chạy suốt
    ['MOD-BAC-53', [0, 0.4, -4.0], { cell: 'th.l0', special: side < 0 ? 'bia.tothap' : 'bia.jishan' }],
    ['MOD-BAC-28', [-3.6, 0.4, -3.6], { cell: 'th.l0' }], ['MOD-BAC-33', [-3.6, 1.6, -3.0], { cell: 'th.l0', n: 2, step: [0.6, 0, 0] }],
    ['MOD-BAC-02', [-3.5, 6.8, -3.7], { cell: 'th.l1.phong', n: 2, step: [3.5, 0, 0], rows: 2, rowStep: [0, 0, 3.7] }],
    side < 0 ? ['MOD-BAC-28', [0, 6.8, -3.2], { cell: 'th.l1.phong' }] : ['MOD-NHO-13', [-1.0, 6.8, -2.6], { cell: 'th.l1.phong', n: 2, step: [2.0, 0, 0] }],
    ['MOD-BAC-35', [-1.0, 12.0, 2.4], { cell: 'th.l2.phong', n: 2, step: [2.0, 0, 0] }],
    ['TH-CHUONGGIO', [0, 18.6, 0], { cell: 'th.l3.dinh', special: 'windchime.ring', slots: 24, ix: side < 0 ? 'sm.chuonggio.tb' : 'sm.chuonggio.db' }],
  ],
  stations: [
    { id: side < 0 ? 'th_tb_bia' : 'th_db_bia', kind: 'read', cell: 'th.l0', lv: 0, name: 'Bia Tháp', verb: 'Đọc bia', at: [0, 0.4, -4.0], spot: [0, 0.4, -2.8],
      engine: side < 0 ? 'LORE (tài liệu 02)' : 'kb › JISHAN_PIAN' },
    { id: side < 0 ? 'th_tb_chuonggio' : 'th_db_chuonggio', kind: 'desk', cell: 'th.l3.dinh', lv: 3, name: 'Chuông Gió', verb: 'Treo chuông gió hành của mình',
      at: [0, 16.2, 0], spot: [0, 16.2, 1.2], engine: 'chart › analyze (yong.primary, yong.xi)', daily: 'th_chuonggio' },
  ],
  lights: [ { cell: 'th.l0', kind: 'nen', at: [-3.6, 2.0, -3.0] }, { cell: 'th.l0', kind: 'troi', at: [0, 2.6, 3.6] },
            { cell: 'th.l1.phong', kind: 'dendau', at: [2.6, 8.2, -2.6] }, { cell: 'th.l2.phong', kind: 'troi', at: [0, 13.6, 2.4] },
            { cell: 'th.l3.dinh', kind: 'denlong', at: [0, 18.8, 0], sched: 'dem' } ],
  stream: { load: 60, unload: 100 }, col: `bld/${side < 0 ? 'sm-thap-tb' : 'sm-thap-db'}.col.json`,
});
export const THAP_TB = make(-1), THAP_DB = make(1);
```

Kiểm: thang đoạn 1 bán kính ngoài 2,6 m quanh trụ — đường kính 5,2 vừa lòng trệt 9 × 9 sau khi dọn vách; đoạn 3 thu bán kính ngoài còn 1,8 để vừa phòng đỉnh 4 × 4 (miệng thang 1,2 × 1,2 cạnh trụ — người chơi bước ra vòng 0,6 m quanh miệng thang có lan can KT-20). `spiralStair` (chưa có) bổ sung vào `_shared.js` theo 08-19 §2.5.
