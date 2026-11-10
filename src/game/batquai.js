// ============================================================================
//  BÁT QUÁI THÀNH — bố cục Huyền Thành theo Hậu Thiên Bát Quái (Văn Vương).
//  Thuần JS (không three.js / DOM) — một nguồn cho: tường bát giác + 8 cổng (Bát Môn Kỳ Môn),
//  đường vành Bát Quái, 8 khu (cung) theo quẻ, NPC dân thành. landmarks.js dựng 3D, roads.js vẽ
//  đường, citizens.js (render3d) dựng NPC, test Node đọc trực tiếp.
//
//  Quy ước hướng (mét thế giới): +X = Đông, −X = Tây, −Z = Bắc, +Z = Nam. Sơn Môn (court.js) ở
//  Trung Cung (tâm), Hậu Sơn (quần thể điện z ≈ −116) là cung Khảm.
//
//  Khung cục bộ mỗi khu: u = khoảng cách theo trục khu (từ tâm ra cổng), v = lệch ngang (dương =
//  bên phải khi đứng ở tâm nhìn ra cổng). Vành tường ở u = OCT_A, đường vành ở u = RING_A —
//  tường và đường vành đều là bát giác đều nên mỗi khu nhận đúng một cạnh, đối xứng hoàn toàn.
// ============================================================================

export const OCT_A = 158;            // trung đoạn (apothem) tường bát giác — cổng ở giữa mỗi cạnh
export const TAN8 = Math.tan(Math.PI / 8); // tan 22,5°
export const OCT_SIDE = 2 * OCT_A * TAN8;  // cạnh tường ≈ 130,9 m
export const OCT_V = OCT_A / Math.cos(Math.PI / 8); // bán kính đỉnh ≈ 171 m
export const WALL_T = 5, WALL_H = 14;
export const RING_A = 100;           // đường vành Bát Quái (bát giác, rộng 6 m)
export const RING_W = 6;
export const AVE_W = 7;              // đại lộ mỗi khu (Nam: 9, Đông/Tây: 8 — đã có sẵn)
export const EMBLEM_U = 128;         // đĩa quẻ khảm đá trên đại lộ, trước cổng

// Hậu Thiên Bát Quái: hướng (dx, dz), hào từ dưới lên (1 = dương liền, 0 = âm đứt),
// hành, Bát Môn (Kỳ Môn Độn Giáp — cung cố định), khu.
const S2 = Math.SQRT1_2;
export const GUA = [
  { id: 'li', name: 'Ly', sym: '☲', lines: [1, 0, 1], wx: '火', dir: [0, 1], gate: 'Cảnh Môn', district: 'Ly Hỏa Phường', theme: 'Chợ phiên, lò luyện đan, tửu lâu', color: '#d8452e' },
  { id: 'kun', name: 'Khôn', sym: '☷', lines: [0, 0, 0], wx: '土', dir: [-S2, S2], gate: 'Tử Môn', district: 'Khôn Nguyên Điền', theme: 'Linh điền, kho lương, nông gia', color: '#c99a3e' },
  { id: 'dui', name: 'Đoài', sym: '☱', lines: [1, 1, 0], wx: '金', dir: [-1, 0], gate: 'Kinh Môn', district: 'Đoài Trạch Lâu', theme: 'Hồ trạch, trà lâu, cầm ca', color: '#e7e1d2' },
  { id: 'qian', name: 'Càn', sym: '☰', lines: [1, 1, 1], wx: '金', dir: [-S2, -S2], gate: 'Khai Môn', district: 'Càn Kiếm Các', theme: 'Kiếm tu, luyện võ trường', color: '#f1ead8' },
  { id: 'kan', name: 'Khảm', sym: '☵', lines: [0, 1, 0], wx: '水', dir: [0, -1], gate: 'Hưu Môn', district: 'Khảm Thủy Hậu Sơn', theme: 'Hậu Sơn, giếng linh tuyền', color: '#3b6fa0' },
  { id: 'gen', name: 'Cấn', sym: '☶', lines: [0, 0, 1], wx: '土', dir: [S2, -S2], gate: 'Sinh Môn', district: 'Cấn Sơn Trận Các', theme: 'Trấn sơn tháp, trận pháp sư', color: '#9b8a6a' },
  { id: 'zhen', name: 'Chấn', sym: '☳', lines: [1, 0, 0], wx: '木', dir: [1, 0], gate: 'Thương Môn', district: 'Chấn Lôi Đài', theme: 'Lôi đài đấu pháp, Lôi Âm Điện', color: '#4f9a5a' },
  { id: 'xun', name: 'Tốn', sym: '☴', lines: [0, 1, 1], wx: '木', dir: [S2, S2], gate: 'Đỗ Môn', district: 'Tốn Phong Lâm', theme: 'Dược viên, Tàng Phong Lâu', color: '#6fb08a' },
];
export const guaById = (id) => GUA.find((g) => g.id === id);

// --- khung cục bộ khu ↔ thế giới
// phải (v > 0) = quay hướng trục 90° theo chiều kim đồng hồ khi nhìn từ trên (trục Nam (0,1) → phải là Tây (−1,0))
export function toWorld(g, u, v) { const [dx, dz] = g.dir; return { x: dx * u - dz * v, z: dz * u + dx * v }; }
export function toLocal(g, x, z) { const [dx, dz] = g.dir; return { u: x * dx + z * dz, v: -x * dz + z * dx }; }
/** góc quay ry (three.js, mặt trước +Z cục bộ) để vật thể nhìn theo vector (dx, dz) */
export const faceDir = (dx, dz) => Math.atan2(dx, dz);
/** ry để vật đặt tại (u, v) nhìn về đại lộ khu (−v) — v = 0 thì nhìn về tâm */
export function faceAvenue(g, v) { const [dx, dz] = g.dir; const s = v > 0 ? -1 : 1; return v === 0 ? faceDir(-dx, -dz) : faceDir(-dz * s, dx * s); }
/** ry nhìn theo trục khu (ra cổng = out) */
export const faceAxis = (g, out = true) => faceDir(g.dir[0] * (out ? 1 : -1), g.dir[1] * (out ? 1 : -1));

// --- tường bát giác
/** 8 đỉnh tường (thứ tự quanh vòng), đỉnh nằm giữa hai cổng kề nhau */
export function octVertices(a = OCT_A) {
  const R = a / Math.cos(Math.PI / 8), out = [];
  for (let k = 0; k < 8; k++) { const ang = Math.PI / 2 + Math.PI / 8 + k * Math.PI / 4; out.push({ x: Math.cos(ang) * R, z: Math.sin(ang) * R }); }
  return out;
}
/** Trong lòng bát giác trung đoạn a? (lòng thành) */
export function insideOct(x, z, a = OCT_A) {
  for (const g of GUA) if (x * g.dir[0] + z * g.dir[1] > a) return false;
  return true;
}
// cổng: nửa bề rộng ô trống trên tường (cổng Nam rộng như thành môn cũ 64 m)
export const gateHalf = (g) => (g.id === 'li' ? 31 : g.id === 'kan' ? 13 : 19);
export const gateWidth = (g) => (g.id === 'li' ? 64 : g.id === 'kan' ? 27 : 40);

/** Đoạn tường (thẳng) quanh vòng, đã chừa ô cổng: [{ a:{x,z}, b:{x,z}, g }] — g: khu có cạnh này */
export function wallSegments(a = OCT_A) {
  const out = [];
  for (const g of GUA) {
    const L = a * TAN8, h = gateHalf(g);
    for (const [v0, v1] of [[-L, -h], [h, L]]) out.push({ a: toWorld(g, a, v0), b: toWorld(g, a, v1), g });
  }
  return out;
}
/** Khối chặn tròn dọc tường (bước ≤ 4,5 m, r 3,4 → khít), kể cả góc đỉnh; chừa ô cổng (cổng do model chặn) */
export function octWallBlocks(a = OCT_A) {
  const out = [];
  for (const s of wallSegments(a)) {
    const L = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), n = Math.max(1, Math.ceil(L / 4.5));
    for (let i = 0; i <= n; i++) { const t = i / n; out.push({ x: s.a.x + (s.b.x - s.a.x) * t, z: s.a.z + (s.b.z - s.a.z) * t, r: 3.4 }); }
  }
  return out;
}

// --- đường: đường vành bát giác (vòng trước nền Hậu Sơn ở cung Khảm) + đại lộ 4 khu chéo
/** Đường vành: polyline khép kín. Cạnh Khảm (z = −100) xuyên nền Hậu Sơn (|x| ≤ 45, z −152…−80)
 *  → vòng qua trước nền ở z −71 (giữa tường sau Sơn Môn z −67,4 và bậc dưới cùng của điện z ≈ −73,7). */
export function ringRoad() {
  const v = octVertices(RING_A); // v[k] = đỉnh giữa khu GUA[k] và GUA[k+1]
  const D = RING_A * Math.SQRT2; // cạnh chéo Càn/Cấn: |x| + |z| = 141,4
  const zq = (x) => -(D - Math.abs(x));
  const pts = [[-58, zq(-58)], [-49, -71], [49, -71], [58, zq(58)]];
  for (const k of [5, 6, 7, 0, 1, 2]) pts.push([v[k].x, v[k].z]);
  pts.push([-58, zq(-58)]);
  return pts;
}
/** Đại lộ các khu chéo (từ góc Sơn Môn ra cổng) */
export function diagonalAvenues() {
  return GUA.filter((g) => g.dir[0] && g.dir[1]).map((g) => { const p0 = toWorld(g, 92, 0), p1 = toWorld(g, OCT_A - 4, 0); return { pts: [[p0.x, p0.z], [p1.x, p1.z]], w: AVE_W }; });
}

// ---------------------------------------------------------------------------
// BỐ CỤC KHU (u, v cục bộ). Mỗi mục: model (danh sách ưu tiên — mục đầu có file thì dùng),
// fit, chỗ đặt, hướng (face: 'avenue' nhìn ra đại lộ | 'center' nhìn về tâm | 'axis' nhìn ra cổng),
// foot = [dọc u, ngang v] (m) — khung chiếm đất: lấy MAX của model Meshy (bq_*) và model dự phòng, test dùng để kiểm không đè
// nhau / không lấn đại lộ, đường vành, Sơn Môn, Hậu Sơn, cổng.
// Cung Ly (Nam) giữ phố chợ sẵn có (quầy, cổng chào, đèn) — chỉ bổ sung. Cung Khảm = Hậu Sơn.
// Khu chéo giáp Khảm (Càn, Cấn): phía giáp Hậu Sơn chỉ đặt công trình nhỏ (nền điện |x| ≤ 45).
// ---------------------------------------------------------------------------
const B = (model, fit, u, v, foot, extra = {}) => ({ model: [].concat(model), fit, u, v, foot, face: 'avenue', ...extra });
export const HOUSE_S = 12; // nhà vườn tứ hợp (lib_courtyard, max 12 m → 12 × 8)
export const DISTRICTS = {
  li: {
    buildings: [
      B(['bq_alchemy_hall', 'hall_main'], { width: 22 }, 120, 30, [22, 20.2], { name: 'Đan Dược Các' }),
      B(['bq_tavern', 'tea_pavilion'], { width: 20 }, 120, -30, [20, 21.7], { name: 'Hỏa Vân Tửu Lâu' }),
      B(['bq_furnace', 'cauldron'], { height: 6 }, 136, 18, [6.1, 6.1], { name: 'Cửu Chuyển Đan Lô' }),
    ],
    houses: [[84, 26], [84, -26]],
    trees: [],
  },
  kun: {
    buildings: [
      B(['bq_granary', 'lib_mtn_house'], { width: 22 }, 120, -27, [22, 22], { name: 'Khôn Nguyên Thương' }),
      B(['bq_farmhouse', 'lib_wood_pavilion'], { width: 14 }, 118, 24, [14, 10.6], { name: 'Nông Gia Đình' }),
      B('lib_cart', { width: 4.2 }, 137, 13, [4.2, 4.2], { face: 'axis' }),
    ],
    fields: [{ u: 140, v: 30, w: 16, d: 12 }, { u: 140, v: -28, w: 12, d: 12 }],
    houses: [[146, 42], [146, -42]],
    trees: [[108, 14], [128, -10]],
  },
  dui: {
    buildings: [
      B(['bq_teahouse', 'tea_pavilion'], { width: 24 }, 124, -27, [24, 22.2], { name: 'Đoài Duyệt Trà Lâu' }),
      B(['bq_music_pav', 'lib_garden_pav'], { width: 14 }, 80, 24, [14, 14.7], { name: 'Cầm Âm Thủy Tạ', over: 'ao', board: [90, 12.4] }),
      B(['bq_stage', 'lib_wood_pavilion'], { width: 12 }, 120, 25, [12, 12], { name: 'Ca Đài' }),
    ],
    pond: { u: 80, v: 24, w: 28, d: 20 },
    houses: [[144, 36], [144, -36], [80, -26]],
    trees: [[70, -12], [108, 12], [108, -10]],
    treeModel: 'lib_willow',
  },
  qian: {
    buildings: [
      B(['bq_sword_tower', 'library_tower'], { width: 20 }, 124, -27, [20, 20], { name: 'Càn Nguyên Kiếm Các' }),
      B(['bq_sword_pav', 'lib_pavilion2'], { height: 18 }, 118, 26, [18, 20], { name: 'Vấn Kiếm Đình' }),
    ],
    yard: { u: 138, v: 26, w: 16, d: 14 }, // luyện võ trường: sân cát + giá binh khí + cọc gỗ
    houses: [[146, -36]],
    trees: [[108, -12]],
  },
  kan: {
    buildings: [], // Hậu Sơn (landmarks.palaceComplex) — chỉ thêm giếng linh tuyền trước nền điện
    well: { x: -56, z: -72.5 }, stele: { x: -60, z: -76 }, emblem: { x: 22, z: -71 },
    houses: [],
    trees: [],
  },
  gen: {
    buildings: [
      B(['bq_pagoda', 'lib_pagoda_red'], { width: 26 }, 126, 27, [32, 34.7], { name: 'Trấn Sơn Bảo Tháp', face: 'center' }),
      B(['bq_array_hall', 'observatory'], { width: 20 }, 122, -26, [20, 20], { name: 'Bát Môn Trận Đường' }),
      B('luopan_stand', { height: 5 }, 142, -14, [2.5, 4.6], { face: 'center' }),
    ],
    rocks: [[144, -30, 6], [108, -12, 5]],
    houses: [[146, -40]],
    trees: [],
  },
  zhen: {
    buildings: [
      B(['bq_thunder_hall', 'hall_main'], { width: 24 }, 124, -28, [24, 24], { name: 'Lôi Âm Điện' }),
      B(['bq_drum_tower', 'lib_wood_pavilion'], { width: 12 }, 120, 26, [12, 10.1], { name: 'Lôi Cổ Lầu' }),
    ],
    arena: { u: 80, v: -24, r: 9.5 }, // lôi đài bát giác (thủ công): đài đá cao 1,2 m, 8 cột cờ
    houses: [[80, 26], [144, 38], [144, -38]],
    trees: [[108, 14]],
  },
  xun: {
    buildings: [
      B(['bq_library_pagoda', 'lib_pagoda5'], { height: 32 }, 126, -27, [24.9, 23.2], { name: 'Tàng Phong Lâu', face: 'center' }),
      B(['bq_herb_pav', 'lib_garden_pav'], { height: 14 }, 120, 26, [15, 14.7], { name: 'Bách Thảo Đình' }),
    ],
    fields: [{ u: 142, v: 26, w: 14, d: 10, herb: true }],
    houses: [[146, -38]],
    trees: [[108, -12], [128, -9]],
    treeModel: 'lib_blossom',
  },
};
/** Biển tên trước cửa công trình có tên: góc trước gần tâm, lùi ra 1,5 m — { u, v, face } */
export function boardSpot(b) {
  if (!b.name) return null;
  if (b.board) return { u: b.board[0], v: b.board[1], face: 'avenue' };
  const sv = Math.sign(b.v) || 1;
  if (b.face === 'center') return { u: b.u - b.foot[0] / 2 - 1.5, v: b.v - sv * (b.foot[1] / 2 - 2.5), face: 'center' };
  return { u: b.u - b.foot[0] / 2 + 2.5, v: b.v - sv * (b.foot[1] / 2 + 1.5), face: 'avenue' };
}
// Mọi khu (trừ Ly — phố chợ đã có đèn — và Khảm): đèn lồng dọc đại lộ, đĩa quẻ khảm đá, bia quẻ
export const POST_U = [112, 124, 136], POST_V = 5;
// sư tử đá canh hai bên lối vào mỗi cổng (phía trong thành); Khảm bỏ — cổng nhỏ sát nền Hậu Sơn
export const LION = { v: 9.5, h: 2 };
export const lionU = (g) => (g.id === 'li' ? 140.2 : 145);
export const STELE = { u: 106, v: -6 };

// ---------------------------------------------------------------------------
// NPC DÂN THÀNH — mỗi khu một nhóm: vai, dáng (rig Meshy sẵn có), màu áo theo hành của quẻ,
// chỗ đứng (u, v) hoặc lộ trình đi lại (path), câu nói (bark) khi người chơi lại gần.
// Lộ trình chỉ chạy trên đại lộ / đường vành / sân — đã chừa trống (test kiểm không vướng va chạm).
// ---------------------------------------------------------------------------
const N = (id, name, role, look, at, lines, extra = {}) => ({ id, name, role, look, at, lines, ...extra });
export const CITIZENS = {
  li: [
    N('li_dan', 'Đan Sư Viêm Hà', 'Luyện đan sư', 'master', [140, 13], ['Lửa văn lửa võ, sai một khắc là thành tro.', 'Cửu Chuyển Đan Lô hôm nay đỏ rực — khí Ly đang vượng.', 'Muốn đan thành, trước hết tâm phải tĩnh.']),
    N('li_tuu', 'Chưởng Quỹ Hồng', 'Chủ tửu lâu', 'npc_merchant', [118, -18], ['Rượu Hỏa Vân ba năm, khách quan thử một chén?', 'Tu tiên cũng phải ăn, phải không?', 'Trên lầu còn bàn nhìn ra Cảnh Môn.']),
    N('li_ban', 'Tiểu Thương Lý Nhị', 'Bán linh thảo', 'npc_villager', [95, 7], ['Linh thảo mới hái sáng nay!', 'Cỏ Chu Tước, hoa Liệt Diễm — đủ cả.', 'Mua nhiều có bớt nha khách.']),
    N('li_ve', 'Vệ Binh Cảnh Môn', 'Thủ thành', 'hero_m', [140, -6], ['Cảnh Môn chủ văn thư, lễ nghi — vào thành xin giữ phép.', 'Đêm xuống, đèn lồng Ly phường sáng tới tận cổng.']),
    N('li_khach', 'Khách Phương Xa', 'Lữ khách', 'hero_f', null, ['Nghe nói thành này xây theo Bát Quái, đi lạc là vòng mãi.', 'Tám cổng, tám cung — lạ thật.'], { path: [[96, -3], [140, -3]] }),
  ],
  kun: [
    N('kun_nong', 'Lão Nông Thổ Căn', 'Nông gia linh điền', 'npc_villager', [136, 21], ['Đất Khôn dày, nuôi vạn vật.', 'Linh mễ năm nay trổ bông sớm.', 'Tưới bằng nước giếng Khảm, lúa mới thơm.']),
    N('kun_kho', 'Quản Kho Điền Thị', 'Quản kho lương', 'npc_merchant', [124, -13], ['Kho Khôn Nguyên đủ lương cho cả thành ba năm.', 'Tử Môn chủ tĩnh — người ra kẻ vào ít thôi.']),
    N('kun_be', 'Bé Hòa', 'Con nhà nông', 'hero_f', null, ['Ông ơi chờ cháu với!', 'Cháu bắt được con dế lửa nè!'], { path: [[100, 2], [146, 2]], height: 1.25 }),
    N('kun_ve', 'Vệ Binh Tử Môn', 'Thủ thành', 'hero_m', [140, -6], ['Tử Môn hướng Tây Nam, cung Khôn — đất mẹ.']),
  ],
  dui: [
    N('dui_tra', 'Trà Nương Thu Thủy', 'Chủ trà lâu', 'hero_f', [124, -13], ['Trà Đoài Duyệt pha bằng sương sớm mặt hồ.', 'Đoài là vui — khách ngồi xuống đã rồi hẵng tu.', 'Nghe tiếng đàn bên thủy tạ chưa?']),
    N('dui_cam', 'Cầm Sư Bạch Vân', 'Cầm sư', 'master', [97, 20], ['Cung thương giốc chủy vũ — ngũ âm hợp ngũ hành.', 'Tiếng đàn trong là tâm trong.']),
    N('dui_ca', 'Ca Kỹ Liên Hoa', 'Ca kỹ', 'hero_f', [120, 17], ['Đêm nay hát khúc «Trạch Thượng Hữu Phong».', 'Khách muốn nghe bài gì?']),
    N('dui_ve', 'Vệ Binh Kinh Môn', 'Thủ thành', 'hero_m', [140, 6], ['Kinh Môn chủ kinh hãi, kiện tụng — vào ra cẩn trọng.']),
    N('dui_dao', 'Đạo Sĩ Dạo Hồ', 'Tán tu', 'npc_villager', null, ['Mặt hồ phẳng như gương — soi được tâm mình.'], { path: [[96, -2], [140, -2]] }),
  ],
  qian: [
    N('qian_kiem', 'Kiếm Tôn Lăng Tiêu', 'Trưởng lão kiếm các', 'master', [118, -14], ['Càn vi thiên, vi kim — kiếm là ý trời.', 'Một kiếm phá vạn pháp, nhưng phải phá được chính mình trước.']),
    N('qian_de', 'Đệ Tử Mộ Dung', 'Kiếm đệ tử', 'hero_m', [136, 23], ['Một ngàn lần vung kiếm mỗi sáng.', 'Sư phụ bảo kiếm ý của ta còn non.'], { pose: 'hold' }),
    N('qian_nu', 'Nữ Kiếm Tu Tô Nguyệt', 'Kiếm tu', 'hero_f', [142, 30], ['Khai Môn — cửa mở đầu mọi việc lớn.', 'Đấu một trận không? Đùa thôi.']),
    N('qian_ve', 'Vệ Binh Khai Môn', 'Thủ thành', 'hero_m', [140, -6], ['Khai Môn hướng Tây Bắc, đại cát cho xuất hành.']),
  ],
  kan: [
    N('kan_tinh', 'Bà Giữ Giếng', 'Giữ linh tuyền', 'npc_villager', { x: -53, z: -74.5 }, ['Giếng Khảm thông mạch nước dưới Hậu Sơn.', 'Nước linh tuyền — uống một ngụm, mát tới đan điền.', 'Khảm là hiểm, nhưng nước luôn tìm được đường.']),
    N('kan_dong', 'Tiểu Đạo Đồng', 'Đạo đồng Hậu Sơn', 'hero_m', null, ['Sư phụ sai con xuống lấy nước giếng.'], { path: [[-40, -71], [40, -71]], world: true, height: 1.35 }),
  ],
  gen: [
    N('gen_tran', 'Trận Pháp Sư Mặc Thạch', 'Trận pháp sư', 'master', [136, -12], ['Cấn là núi, là dừng — trận pháp cũng vậy, biết dừng mới giữ được.', 'Bát Môn: Hưu, Sinh, Thương, Đỗ, Cảnh, Tử, Kinh, Khai.', 'Sinh Môn ở Đông Bắc — đi cửa này làm ăn thuận.']),
    N('gen_su', 'Tăng Nhân Giữ Tháp', 'Giữ tháp', 'npc_villager', [118, 6], ['Bảo tháp trấn long mạch phía Đông Bắc.', 'Đếm bậc tháp là một cách tu tâm.']),
    N('gen_hoc', 'Học Đồ Trận Pháp', 'Học đồ', 'hero_f', null, ['Ba trăm sáu mươi lăm bước một vòng thành…'], { path: [[96, -2], [140, -2]] }),
    N('gen_ve', 'Vệ Binh Sinh Môn', 'Thủ thành', 'hero_m', [140, -6], ['Sinh Môn cát, chủ sinh sôi, tài lộc.']),
  ],
  zhen: [
    N('zhen_loi', 'Lôi Tôn Chấn Hoàng', 'Chủ lôi đài', 'master', [80, -11], ['Chấn là sấm — động thì phải động cho ra động!', 'Ai muốn lên lôi đài? Ba chiêu thôi.']),
    N('zhen_vo', 'Võ Sĩ Thiết Ngưu', 'Đấu sĩ', 'hero_m', [93, -22], ['Hôm qua thua một trận, hôm nay đòi lại.'], { pose: 'hold' }),
    N('zhen_co', 'Cổ Sư Lôi Minh', 'Đánh trống', 'npc_villager', [118, 18], ['Mỗi giờ Thìn ba hồi trống — thức cả thành.']),
    N('zhen_ve', 'Vệ Binh Thương Môn', 'Thủ thành', 'hero_m', [140, 6], ['Thương Môn hướng Đông — chủ thương tổn, săn bắt.']),
    N('zhen_kh', 'Khán Giả Hóng Chuyện', 'Dân thành', 'npc_merchant', null, ['Trận chiều nay chắc chắn đông người xem!'], { path: [[66, 2], [140, 2]] }),
  ],
  xun: [
    N('xun_duoc', 'Dược Sư Thanh Phong', 'Dược sư', 'master', [134, 16], ['Tốn là gió, là cây — dược thảo theo gió mà lớn.', 'Bách Thảo Đình có ba trăm loại linh thảo.']),
    N('xun_thu', 'Thủ Thư Tàng Phong', 'Giữ lầu sách', 'npc_villager', [120, -12], ['Tàng Phong Lâu giữ kinh thư phong thủy cổ.', 'Đọc sách cũng như đón gió — mở cửa sổ lòng.']),
    N('xun_hai', 'Thiếu Nữ Hái Thuốc', 'Hái thuốc', 'hero_f', [142, 33], ['Lá này phải hái lúc còn đọng sương.']),
    N('xun_ve', 'Vệ Binh Đỗ Môn', 'Thủ thành', 'hero_m', [140, -6], ['Đỗ Môn chủ ẩn tàng — người tu muốn lánh đời thường qua đây.']),
  ],
};

/** Danh sách NPC đã đổi ra toạ độ thế giới: { …, x, z, path: [{x,z}…] | null, gua } */
export function citizenList() {
  const out = [];
  for (const g of GUA) {
    for (const c of CITIZENS[g.id] || []) {
      const w = (p) => (c.world ? { x: p[0], z: p[1] } : toWorld(g, p[0], p[1]));
      const at = c.at && !Array.isArray(c.at) ? c.at : c.at ? toWorld(g, c.at[0], c.at[1]) : null;
      const path = c.path ? c.path.map(w) : null;
      const p0 = at || path[0];
      out.push({ ...c, gua: g.id, wx: g.wx, x: p0.x, z: p0.z, path });
    }
  }
  return out;
}
