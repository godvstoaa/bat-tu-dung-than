// ============================================================================
//  9 PHONG CÁCH TIÊN PHỦ (thuần dữ liệu — docs/TIEN-PHU-MANIFEST.md §1, §3). Mỗi phong cách:
//   · hall: biến thể archkit-style (fam/roof) cho sảnh một tầng trong phủ
//   · tower: mặt bằng (n cạnh: 4 vuông · 8 bát giác · 16 tròn), nửa cạnh (apothem) từng tầng a[0..9], thềm, hành lang
//     (gal: chỉ số tầng có hành lang ngoài · bd: bề rộng), mái tầng (eave), đỉnh (crown), tháp góc…
//   · water: kiểu hồ hậu hoa viên · trees: cây theo phong cách · gate: kiểu cổng chính
//  Số đo lấy theo nguồn trong manifest (Himeji, Potala, Chrysler, Pantheon, Phước Duyên, Qutb Minar…).
// ============================================================================
const R = (n, f) => Array.from({ length: n }, (_, k) => +f(k).toFixed(3));
const ALL = R(10, (k) => k);

export const TP_STYLES = [
  { // 0 — Quân Thiên (trung ương, Thổ): Tử Cấm Thành · Hoàng Hạc Lâu · Phật Hương Các
    id: 'trunghoa', name: 'Cung Đình Trung Hoa', fam: 'asian', roof: 'curved',
    roofCol: '#e8b828', wall: '#a8231c', trim: '#2e6b4f', stone: '#edebe4', floorCol: '#8a5a34', accent: '#d9a441',
    hall: { fam: 'asian', roof: 'curved', plinth: 2.4 }, gate: 'paifang', fence: 'redwall', wallH: 8,
    tower: { n: 8, a: R(10, (k) => 15.5 * 0.962 ** k), podium: 4.5, podiumKind: 'terrace3', gal: ALL, bd: 2.6, eave: 'curved', eaveCol: '#e8b828', column: '#a8231c', crown: 'doubleHip', win: 'lattice' },
    water: 'lake', trees: ['pine', 'ginkgo', 'peach', 'willow', 'plum', 'osmanthus'], lamp: 'palace', statue: 'bq_lion',
  },
  { // 1 — Thương Thiên (Đông, Mộc): thành Himeji
    id: 'nhatban', name: 'Thành Quách Nhật Bản', fam: 'asian', roof: 'irimoya',
    roofCol: '#8e9196', wall: '#f4f3ee', trim: '#3b2a1e', stone: '#9a9488', floorCol: '#b08a5a', accent: '#c9a24a',
    hall: { fam: 'asian', roof: 'irimoya', plinth: 1.2 }, gate: 'torii', fence: 'whitewall', wallH: 6,
    tower: { n: 4, a: [21.3, 19.7, 19.0, 18.6, 18.3, 15.2, 15.2, 12.9, 12.9, 10.0], podium: 3, podiumKind: 'ishigaki', gal: [], bd: 0, eave: 'skirt', eaveCol: '#8e9196', column: '#3b2a1e', crown: 'irimoya', chidori: true, win: 'grille' },
    water: 'stroll', trees: ['sakura', 'maple', 'pine', 'bamboo', 'wisteria'], lamp: 'toro', statue: null,
  },
  { // 2 — Biến Thiên (Đông Bắc, Cấn — núi): Potala
    id: 'taytang', name: 'Cung Điện Tây Tạng', fam: 'asian', roof: 'flat',
    roofCol: '#c9a43a', wall: '#f2efe6', trim: '#5a2620', stone: '#8a7f6e', floorCol: '#7a4a2a', accent: '#8b1e1a',
    hall: { fam: 'western', roof: 'flat', plinth: 1.2 }, gate: 'tibet', fence: 'stone', wallH: 7,
    tower: { n: 4, a: [19.5, 19, 18.5, 18, 17.5, 17, 16.5, 16, 15.5, 15], podium: 10, podiumKind: 'battered', gal: [], bd: 0, eave: 'flat', batter: 10, red: [7, 8, 9], pema: true, crown: 'goldCanopy', win: 'trapezoid' },
    water: 'lake', trees: ['pine', 'birch', 'cypress', 'camellia'], lamp: 'butter', statue: null, flags: true,
  },
  { // 3 — Huyền Thiên (Bắc, Thủy): Neuschwanstein · Cologne
    id: 'gothic', name: 'Lâu Đài Gothic', fam: 'western', roof: 'gable',
    roofCol: '#4a5560', wall: '#e6dfcf', trim: '#6e665a', stone: '#c9c1b0', floorCol: '#6b5a48', accent: '#2e3a58',
    hall: { fam: 'western', roof: 'gable', plinth: 0.8 }, gate: 'gatehouse', fence: 'stone', wallH: 9,
    tower: { n: 8, a: [14, 14, 14, 12.8, 12.8, 12.8, 11.8, 11.8, 11.8, 11], podium: 2.5, podiumKind: 'plain', gal: [3, 6, 9], bd: 2.0, eave: 'string', turrets: 3.5, crown: 'spire', win: 'pointed', crenel: true },
    water: 'mirror', trees: ['cypress', 'birch', 'hedge', 'maple', 'pine'], lamp: 'iron', statue: null,
  },
  { // 4 — U Thiên (Tây Bắc, Càn — kim khí): Chrysler · Empire State
    id: 'artdeco', name: 'Art Deco', fam: 'modern', roof: 'flat',
    roofCol: '#c8ccd0', wall: '#d9d2c2', trim: '#1e1e22', stone: '#bdb6a6', floorCol: '#3a3a40', accent: '#c8a050',
    hall: { fam: 'modern', roof: 'flat', plinth: 0.6 }, gate: 'deco', fence: 'modern', wallH: 6,
    tower: { n: 4, a: [17, 17, 17, 13.5, 13.5, 13.5, 10, 10, 10, 10], podium: 1.5, podiumKind: 'plain', gal: [3, 6], bd: 0, setback: true, eave: 'deco', crown: 'sunburst', win: 'deco' },
    water: 'mirror', trees: ['hedge', 'cypress', 'birch', 'olive'], lamp: 'deco', statue: null,
  },
  { // 5 — Hạo Thiên (Tây, Đoài — kim trắng): Pantheon · Villa Rotonda
    id: 'tancodien', name: 'Tân Cổ Điển Hy – La', fam: 'western', roof: 'hip',
    roofCol: '#8c8f8e', wall: '#eee9df', trim: '#ffffff', stone: '#e4ded2', floorCol: '#d8d0c0', accent: '#b89a5a',
    hall: { fam: 'western', roof: 'hip', plinth: 1.2, portico: true }, gate: 'triumph', fence: 'iron', wallH: 6,
    tower: { n: 16, a: [16.0, 14.0, 14.0, 13.3, 13.3, 11.0, 11.0, 11.0, 11.0, 11.0], podium: 2.4, podiumKind: 'steps', gal: [1, 3, 5, 7, 9], bd: 2.6, colonnade: true, eave: 'cornice', crown: 'dome', portico: 6, win: 'arched' },
    water: 'mirror', trees: ['cypress', 'olive', 'magnolia', 'hedge', 'birch'], lamp: 'classic', statue: null,
  },
  { // 6 — Chu Thiên (Tây Nam, Khôn): Hoàng thành Huế · Phước Duyên · Hiển Lâm Các · Ngọ Môn
    id: 'hue', name: 'Cung Đình Huế', fam: 'asian', roof: 'vn',
    roofCol: '#d8a02a', wall: '#9e1b1b', trim: '#c8a040', stone: '#cfc6b4', floorCol: '#7a3a22', accent: '#e3b12e',
    hall: { fam: 'asian', roof: 'vn', plinth: 1.6 }, gate: 'ngomon', fence: 'brick', wallH: 6,
    tower: { n: 4, a: [15.6, 14.8, 13.2, 12.6, 12.0, 11.2, 10.8, 10.4, 10.0, 10.0], podium: 4.6, podiumKind: 'terrace', gal: ALL, bd: 2.0, eave: 'vn', eaveCol: '#d8a02a', topCol: '#e3b12e', column: '#9e1b1b', crown: 'gourd', win: 'lattice' },
    water: 'lake', trees: ['palm', 'frangi', 'banyan', 'plum', 'bamboo'], lamp: 'palace', statue: null,
  },
  { // 7 — Viêm Thiên (Nam, Ly — lửa): Wat Arun · Angkor Wat
    id: 'thai', name: 'Cung Điện Thái – Khmer', fam: 'asian', roof: 'thai',
    roofCol: '#c4472a', wall: '#f3eee2', trim: '#d4a72c', stone: '#8a8274', floorCol: '#8a5a2a', accent: '#2f7a4a',
    hall: { fam: 'asian', roof: 'thai', plinth: 1.6 }, gate: 'gopura', fence: 'whitewall', wallH: 6,
    tower: { n: 4, a: [17, 17, 17, 17, 13, 13, 13, 10, 10, 10], podium: 2.85, podiumKind: 'angkor', gal: [0, 4, 7, 9], setback: true, bd: 2.4, eave: 'thai', eaveCol: '#c4472a', borderCol: '#2f7a4a', column: '#d4a72c', crown: 'prang', win: 'gold' },
    water: 'moat', trees: ['palm', 'frangi', 'banyan', 'jacaranda', 'camellia'], lamp: 'thai', statue: null,
  },
  { // 8 — Dương Thiên (Đông Nam, Tốn — gió): Taj Mahal · Qutb Minar · charbagh
    id: 'mughal', name: 'Cung Điện Mughal – Ba Tư', fam: 'mughal', roof: 'onion',
    roofCol: '#f3efe6', wall: '#f3efe6', trim: '#a4553a', stone: '#a4553a', floorCol: '#e8e0d0', accent: '#2f6b8a',
    hall: { fam: 'mughal', roof: 'onion', plinth: 1.8 }, gate: 'iwan', fence: 'redstone', wallH: 7,
    tower: { n: 8, a: [50.3, 22.5, 22.5, 22.5, 22.5, 22.5, 11, 11, 11, 11], podium: 1.5, podiumKind: 'plinthTaj', gal: [1, 6], setback: true, bd: 2.2, eave: 'corbel', fluted: true, lowerCol: '#a4553a', crown: 'chhatri', win: 'jali' },
    water: 'charbagh', trees: ['cypress', 'palm', 'jacaranda', 'camellia', 'osmanthus'], lamp: 'mughal', statue: null,
  },
];
/** phong cách của tiên phủ thứ i (thứ tự TIEN_PLAN: quan, thuong, bien, huyen, u, hao, chu, viem, duong) */
export const tpStyle = (i) => TP_STYLES[i] || TP_STYLES[0];

/** 10 chủ đề tầng (chủ phủ đổi được) — mặc định theo thứ tự này */
export const FLOOR_THEMES = [
  { id: 'daisanh', name: 'Đại Sảnh' }, { id: 'trathat', name: 'Trà Thất' }, { id: 'thulau', name: 'Thư Lâu' },
  { id: 'yensanh', name: 'Yến Sảnh' }, { id: 'tamcung', name: 'Tẩm Cung' }, { id: 'thienphong', name: 'Thiền Phòng' },
  { id: 'danphong', name: 'Đan Phòng' }, { id: 'baokho', name: 'Bảo Khố' }, { id: 'nhaccac', name: 'Nhạc Các' },
  { id: 'vongnguyet', name: 'Vọng Nguyệt Đường' },
];
