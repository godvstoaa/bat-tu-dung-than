// ============================================================================
//  ĐẶC TẢ THỰC VẬT TIÊN PHỦ (thuần JS — plan.js, test Node đọc được) — docs/TIEN-PHU-THUCVAT-MANIFEST.md §4
//  BIG: loài cổ thụ → cao thật (nghiên cứu 10-thuc-vat.md §11.2), bán kính thân r, tỉ lệ tán w (đường kính tán / cao).
//  FLORA: mỗi phủ một «chữ ký»: loài theo vai trò (hàng tường, rừng, cặp trước điện, cây đơn điểm nhấn, hàng lối / kênh),
//  khoảng cách, vùng không cây, màu nền đất.
// ============================================================================
export const BIG = {
  // Trung Hoa (Cung Vương phủ / Ngự Hoa Viên)
  bachqua: { m: 'bachqua', H: [26, 32], r: 0.8, w: 0.55 }, hoe: { m: 'hoe', H: [17, 20], r: 0.6, w: 0.95 }, baichcn: { m: 'buxu', H: [10, 14], r: 0.4, w: 0.55 }, thongcn: { m: 'thongcn', H: [12, 15], r: 0.4, w: 0.95 },
  // Nhật (Himeji / Nijō)
  longnao: { m: 'soi', H: [24, 29], r: 1.0, w: 0.95 }, kuromatsu: { m: 'kuromatsu', H: [9, 14], r: 0.35, w: 0.9 }, sakura: { m: 'sakura', H: [9, 12], r: 0.4, w: 1.25 }, keyaki: { m: 'keyaki', H: [22, 27], r: 0.7, w: 0.8 },
  // Tây Tạng (thấp, mập — 3.650 m)
  lieutang: { m: 'lieutang', H: [11, 15], r: 0.8, w: 1.0 }, duonglhasa: { m: 'duonglhasa', H: [17, 22], r: 0.45, w: 0.45 }, buxu: { m: 'buxu', H: [8, 12], r: 0.35, w: 0.5 },
  // Gothic Anh
  soi: { m: 'soi', H: [23, 28], r: 0.8, w: 0.9 }, tanbi: { m: 'tanbi', H: [24, 29], r: 0.6, w: 0.65 }, thuytung: { proc: 'thuytung', H: [11, 15], r: 0.7, w: 0.9 },
  // Art Deco
  degai: { m: 'degai', H: [24, 30], r: 0.6, w: 0.7 },
  // Tân cổ điển
  doan: { m: 'doan', H: [20, 25], r: 0.5, w: 0.6 }, dengua: { m: 'degai', H: [25, 30], r: 0.6, w: 0.7 }, topiary: { m: 'topiary', H: [4.5, 6], r: 0.9, w: 0.35, solid: true }, camchau: { m: 'camchau', H: [2.8, 3.3], r: 0.7, w: 0.6, keep: true, solid: true },
  // Huế
  thongnhua: { proc: 'thongba', H: [24, 28], r: 0.45, w: 0.45 }, da: { m: 'da', H: [18, 22], r: 1.1, w: 1.3 }, dai: { m: 'dai', H: [7, 9], r: 0.3, w: 1.0 },
  // Thái
  muamy: { m: 'muamy', H: [20, 24], r: 0.9, w: 1.45 }, me: { m: 'hoe', H: [17, 20], r: 0.6, w: 0.8 }, bode: { m: 'da', H: [21, 25], r: 1.0, w: 1.0 }, dua: { m: 'dua', H: [15, 20], r: 0.2, w: 0.45 },
  // Mughal
  bachy: { m: 'bachy', H: [10, 14], r: 0.25, w: 0.14 }, xoai: { m: 'xoai', H: [17, 22], r: 0.7, w: 0.85 }, ashoka: { proc: 'ashoka', H: [17, 21], r: 0.3, w: 0.18 },
};
/** cao thật của một cây trong plan (s ∈ [0,85; 1,15] → nội suy khoảng loài) */
export const bigHeight = (t) => { const b = BIG[t.kind]; const k = Math.min(1, Math.max(0, ((t.s || 1) - 0.85) / 0.3)); return b.H[0] + (b.H[1] - b.H[0]) * k; };
/** bán kính tán (m) */
export const crownR = (t) => (bigHeight(t) * BIG[t.kind].w) / 2;
/** va chạm: trụ thân bán kính r (theo cỡ), cao 2,4 m; cây xén / chậu: trụ cả khối */
export function bigProxy(t) { const b = BIG[t.kind], h = bigHeight(t), r = b.r * (h / ((b.H[0] + b.H[1]) / 2)); return b.solid ? { r, h: Math.min(h, 3) } : { r: Math.max(0.2, r), h: 2.4 }; }

// vai trò: border (hàng trong tường: [loài], gap m, inset m) · grove (rừng: [[loài, tỉ lệ]], k: hệ số số cây so với bản vẽ, gap: hệ số khoảng cách tán)
// pair (cặp trước nhà chính / mọi sảnh lớn) · spec (cây đơn điểm nhấn: loài, số) · rows (hàng dọc lối dài / kênh nước: loài, nhịp, chỉ lối dài ≥ len)
// clear: vành không cây quanh tường (m) · axis: nửa bề rộng trục chính không cây · yardsOk: sân (yards) được trồng (id) · ground: màu thảm nền
export const FLORA = {
  trunghoa: { border: { kinds: ['baichcn', 'thongcn'], gap: 15, inset: 8 }, grove: { mix: [['baichcn', 0.35], ['thongcn', 0.2], ['hoe', 0.3], ['bachqua', 0.15]], k: 0.55, gap: 0.62 },
    pair: { kinds: ['hoe'], main: true }, spec: { kind: 'hoe', n: 6 }, axis: 22, yardsOk: ['garden'], ground: '#8f9468' },
  nhatban: { border: { kinds: ['kuromatsu'], gap: 14, inset: 8 }, grove: { mix: [['sakura', 0.4], ['kuromatsu', 0.35], ['longnao', 0.15], ['keyaki', 0.1]], k: 0.6, gap: 0.55 },
    spec: { kind: 'longnao', n: 7 }, axis: 14, yardsOk: ['garden'], ground: '#728a4c' },
  taytang: { border: { kinds: ['duonglhasa'], gap: 9, inset: 9 }, grove: { mix: [['lieutang', 0.45], ['duonglhasa', 0.35], ['buxu', 0.2]], k: 0.55, gap: 0.55 },
    spec: { kind: 'lieutang', n: 12 }, axis: 20, yardsOk: ['garden'], ground: '#a39b68' },
  gothic: { border: null, grove: { mix: [['soi', 0.4], ['tanbi', 0.35], ['thuytung', 0.25]], k: 0.4, gap: 0.6 }, spec: { kind: 'soi', n: 8 }, clear: 26, axis: 16, yardsOk: ['garden', 'tilt'], ground: '#6c9346' },
  artdeco: { border: { kinds: ['degai'], gap: 13, inset: 10 }, grove: { mix: [['degai', 0.6], ['doan', 0.25], ['tanbi', 0.15]], k: 0.45, gap: 0.55 }, axis: 20, yardsOk: ['garden'], ground: '#6fa04a' },
  tancodien: { border: { kinds: ['dengua'], gap: 8, inset: 8 }, grove: { mix: [['doan', 0.7], ['dengua', 0.3]], k: 0.7, gap: 0.5, grid: 7 },
    rows: { kind: 'dengua', gap: 8, len: 70 }, topiary: { kind: 'topiary', gap: 10 }, tubs: { kind: 'camchau', gap: 6 }, axis: 18, yardsOk: ['bosquet', 'parterre'], ground: '#a7ad74' },
  hue: { border: { kinds: ['thongnhua'], gap: 12, inset: 8 }, grove: { mix: [['thongnhua', 0.55], ['longnao', 0.2], ['dai', 0.15], ['da', 0.1]], k: 0.33, gap: 0.7 },
    pair: { kinds: ['da', 'dai'], main: false }, spec: { kind: 'da', n: 4 }, axis: 24, yardsOk: ['nguuyen'], ground: '#7f9c50' },
  thai: { border: { kinds: ['me'], gap: 6, inset: 7, double: 4 }, grove: { mix: [['me', 0.35], ['muamy', 0.2], ['dua', 0.25], ['dai', 0.1], ['bode', 0.1]], k: 0.5, gap: 0.55 },
    spec: { kind: 'muamy', n: 4 }, axis: 20, yardsOk: ['siwalai'], ground: '#7aa64c' },
  mughal: { border: { kinds: ['ashoka'], gap: 6, inset: 7 }, grove: { mix: [['xoai', 0.55], ['bachy', 0.25], ['ashoka', 0.2]], k: 0.4, gap: 0.6, grid: 11 },
    canal: { kind: 'bachy', gap: 3.5, off: 2.2 }, axis: 12, yardsOk: [], ground: '#86a85a' },
};
