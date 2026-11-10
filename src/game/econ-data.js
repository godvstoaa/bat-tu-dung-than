// ============================================================================
//  DỮ LIỆU KINH TẾ PHẦN II (thuần) — vật phẩm, vùng, công thức nấu, cây trồng, vật nuôi, mặt bằng.
//  Giá gốc tính bằng ĐỒNG (= văn cũ); kho / chợ lưu bằng XU (coins.js). Đặc tả: GAME-SINH-TON-KINH-TE-DAC-TA.md §13, §15–§18.
//  Trường vật phẩm: n tên · i biểu tượng · c nhóm · b giá gốc (đồng) · d hạn dùng (giờ, 0 = không hỏng)
//  · k hệ số bảo quản lạnh (mặc định 0,2) · r vùng gốc · raw (Thương hội bán) · fin (thành phẩm, Thương hội thu sàn)
//  · tier hạng món (1–3) · full / wake / hp hồi khi ăn · dur độ bền đồ nghề.
// ============================================================================

export const COLD = 0.2;

/** 5 vùng tiêu thụ (§15.2, §17.4) — pop = suất ăn NPC / ngày cả vùng; buy = sức mua; like = món hợp khẩu vị */
export const REGIONS = {
  noido: { name: 'Nội đô thượng lưu', wx: '金', pop: 520, buy: 2.5, like: ['bo_nuong_than', 'diem_tam', 'xa_xiu', 'suon_nuong', 'bo_lui'] },
  trung: { name: 'Trung Thành', wx: '火', pop: 1300, buy: 1.2, like: [] },
  song: { name: 'Sông nước', wx: '水', pop: 480, buy: 1.0, like: ['ca_chien', 'canh_rong', 'ca_kho_to', 'lau_ca', 'ca_hap_gung', 'tom_rang', 'canh_chua'] },
  thon: { name: 'Thôn dã & thung lũng', wx: '木', pop: 420, buy: 0.8, like: ['rau_xao', 'tra_dao', 'canh_sen', 'dau_hu_nam', 'chao_sen', 'rau_ngu_vi'], stale: 0.7 },
  mo: { name: 'Mỏ & xưởng', wx: '土', pop: 460, buy: 1.0, like: ['thit_xong', 'com_tho_mo', 'thit_muoi', 'ca_kho_tieu', 'banh_mo'] },
};
export const REGION_IDS = Object.keys(REGIONS);

// --- nguyên liệu, vật nuôi, đồ nghề, phế phẩm ---------------------------------------------------------------
const RAW = {
  lua: { n: 'Lúa thóc', i: '🌾', c: 'grain', b: 1.2, d: 0, r: 'thon' },
  gao: { n: 'Gạo', i: '🍚', c: 'grain', b: 3.8, d: 0, r: 'thon', raw: 1, fin: 1 },
  bot: { n: 'Bột mì', i: '🥣', c: 'grain', b: 2.2, d: 0, r: 'thon', raw: 1 },
  dau: { n: 'Đậu nành', i: '🫘', c: 'grain', b: 1.6, d: 0, r: 'thon', raw: 1 },
  rau: { n: 'Rau xanh', i: '🥬', c: 'veg', b: 1.5, d: 25, r: 'thon', raw: 1 },
  tra_la: { n: 'Chè búp', i: '🍃', c: 'veg', b: 3, d: 48, r: 'thon' },
  bong: { n: 'Bông', i: '☁', c: 'misc', b: 2, d: 0, r: 'thon' },
  thao_duoc: { n: 'Thảo dược', i: '🌿', c: 'veg', b: 5, d: 72, r: 'thon', raw: 1 },
  trung: { n: 'Trứng gà', i: '🥚', c: 'meat', b: 1, d: 72, r: 'thon', fin: 1 },
  ga: { n: 'Gà sống', i: '🐓', c: 'live', b: 26, d: 0, r: 'thon' },
  lon: { n: 'Lợn sống', i: '🐖', c: 'live', b: 150, d: 0, r: 'thon' },
  bo: { n: 'Bò sống', i: '🐂', c: 'live', b: 420, d: 0, r: 'thon' },
  thit_ga: { n: 'Thịt gà', i: '🍗', c: 'meat', b: 9, d: 25, r: 'thon', fin: 1 },
  thit_lon: { n: 'Thịt lợn', i: '🥩', c: 'meat', b: 10, d: 25, r: 'thon', fin: 1 },
  thit_bo: { n: 'Thịt bò', i: '🥩', c: 'meat', b: 15, d: 25, r: 'thon', fin: 1 },
  mo: { n: 'Mỡ', i: '🧈', c: 'meat', b: 3, d: 50, r: 'thon' },
  xuong: { n: 'Xương', i: '🦴', c: 'meat', b: 1.5, d: 25, r: 'thon' },
  da: { n: 'Da thuộc', i: '🟫', c: 'misc', b: 7, d: 0, r: 'thon', fin: 1 },
  long: { n: 'Lông gà', i: '🪶', c: 'misc', b: 0.5, d: 0, r: 'thon' },
  ca: { n: 'Cá tươi', i: '🐟', c: 'fish', b: 6, d: 6, r: 'song' },
  tom: { n: 'Tôm', i: '🦐', c: 'fish', b: 9, d: 6, r: 'song' },
  rong: { n: 'Rong', i: '🌱', c: 'veg', b: 2, d: 25, r: 'song' },
  ca_kho: { n: 'Cá khô', i: '🐠', c: 'fish', b: 10, d: 225, r: 'song', fin: 1 },
  tuong: { n: 'Tương lên men', i: '🫙', c: 'spice', b: 4, d: 500, r: 'song', raw: 1 },
  muoi: { n: 'Muối', i: '🧂', c: 'spice', b: 1, d: 0, r: 'song', raw: 1 },
  cam: { n: 'Cám chăn nuôi', i: '🌰', c: 'misc', b: 0.6, d: 0, r: 'thon', raw: 1 },
  vai: { n: 'Vải', i: '🧵', c: 'misc', b: 14, d: 0, r: 'trung', fin: 1 },
  bang: { n: 'Khối băng', i: '🧊', c: 'misc', b: 2, d: 0, r: 'song', raw: 1 },
  phan: { n: 'Phân bón', i: '💩', c: 'misc', b: 1, d: 0, r: 'thon' },
  oi: { n: 'Đồ ôi', i: '🪰', c: 'waste', b: 0.01, d: 0, r: 'thon' },
  cuoc: { n: 'Cuốc', i: '⛏', c: 'tool', b: 30, d: 0, r: 'mo', raw: 1, dur: 200 },
  dao: { n: 'Dao mổ', i: '🔪', c: 'tool', b: 25, d: 0, r: 'mo', raw: 1, dur: 300 },
  // giống / con non (Thương hội bán, gieo vào thửa)
  g_rau: { n: 'Hạt giống rau', i: '🌱', c: 'seed', b: 2, d: 0, r: 'thon', raw: 1 },
  g_lua: { n: 'Mạ lúa', i: '🌱', c: 'seed', b: 4, d: 0, r: 'thon', raw: 1 },
  g_bong: { n: 'Hạt bông', i: '🌱', c: 'seed', b: 4, d: 0, r: 'thon', raw: 1 },
  g_tra: { n: 'Cây chè giống', i: '🌱', c: 'seed', b: 6, d: 0, r: 'thon', raw: 1 },
  g_ga: { n: 'Gà con', i: '🐣', c: 'seed', b: 6, d: 0, r: 'thon', raw: 1 },
  g_lon: { n: 'Lợn con', i: '🐷', c: 'seed', b: 40, d: 0, r: 'thon', raw: 1 },
  g_bo: { n: 'Bê con', i: '🐮', c: 'seed', b: 120, d: 0, r: 'thon', raw: 1 },
};

// --- công thức: 24 thường + 12 bí truyền (4 bếp trưởng × 3) — §15.1, §16 ------------------------------------
// ing: { vật phẩm: số }, out: số suất, region: vùng đặc sản (null = món chung), salted: đồ muối (hạn ×3)
const R = (id, n, i, tier, ing, out, region = null, extra = {}) => ({ id, n, i, tier, ing, out, region, ...extra });
export const RECIPES = [
  // hạng 1 — thô / hàng rong
  R('com_nam', 'Cơm nắm', '🍙', 1, { gao: 1 }, 2),
  R('banh_dau', 'Bánh đậu', '🟨', 1, { dau: 2 }, 2),
  R('mi_xao', 'Mì xào vội', '🍝', 1, { bot: 1, rau: 1 }, 2),
  R('trung_luoc', 'Trứng luộc', '🥚', 1, { trung: 2 }, 2),
  R('ca_nuong_que', 'Cá nướng que', '🍢', 1, { ca: 1, muoi: 1 }, 2, 'song'),
  R('chao_rau', 'Cháo rau', '🥣', 1, { gao: 1, rau: 1 }, 3),
  // hạng 2 — bình dân
  R('thit_kho', 'Thịt kho', '🍖', 2, { thit_lon: 1, tuong: 1 }, 2),
  R('canh_rau', 'Canh rau xương', '🍲', 2, { rau: 2, xuong: 1 }, 3),
  R('ca_chien', 'Cá chiên', '🐟', 2, { ca: 1, mo: 1 }, 2, 'song'),
  R('mi_nong', 'Mì nóng', '🍜', 2, { bot: 1, xuong: 1, rau: 1 }, 2),
  R('com_ga', 'Cơm gà', '🍛', 2, { gao: 1, thit_ga: 1 }, 2),
  R('dau_phu_sot', 'Đậu phụ sốt tương', '🧆', 2, { dau: 2, tuong: 1 }, 3),
  R('canh_rong', 'Canh rong tôm', '🥘', 2, { rong: 1, tom: 1 }, 2, 'song'),
  R('thit_xong', 'Thịt xông khói', '🥓', 2, { thit_lon: 2, muoi: 1 }, 3, 'mo', { salted: 1 }),
  R('ca_kho_to', 'Cá kho tộ', '🍲', 2, { ca_kho: 1, tuong: 1 }, 2, 'song', { salted: 1 }),
  R('com_tho_mo', 'Suất cơm thợ mỏ', '🍱', 2, { gao: 2, thit_lon: 1, muoi: 1 }, 3, 'mo'),
  R('rau_xao', 'Rau xào mỡ tỏi', '🥗', 2, { rau: 2, mo: 1 }, 2, 'thon'),
  R('tra_dao', 'Trà đạo sơn cốc', '🍵', 2, { tra_la: 1 }, 3, 'thon', { drink: 1 }),
  // hạng 3 — cao lương / dưỡng sinh (bắt buộc tủ hàn ngọc)
  R('ga_ham', 'Gà hầm thảo dược', '🍲', 3, { thit_ga: 2, thao_duoc: 1 }, 2),
  R('bo_nuong_than', 'Bò nướng than hồng', '🔥', 3, { thit_bo: 2, muoi: 1 }, 2, 'noido'),
  R('yen_tiec', 'Yến tiệc liên hoa', '🪷', 3, { thit_bo: 1, thit_ga: 1, tom: 1, rau: 1 }, 3, 'noido'),
  R('lau_ca', 'Lẩu cá sông', '🫕', 3, { ca: 2, tom: 1, rau: 1 }, 3, 'song'),
  R('canh_sen', 'Canh sen hầm xương', '🥣', 3, { xuong: 2, thao_duoc: 1, rau: 1 }, 2, 'thon'),
  R('diem_tam', 'Điểm tâm tinh xảo', '🥟', 3, { bot: 2, tom: 1, thit_lon: 1 }, 3, 'noido'),
  // bí truyền
  R('xa_xiu', 'Xá xíu mật ong', '🍖', 3, { thit_lon: 2, tuong: 1, mo: 1 }, 3, 'noido', { secret: 'hoadau', step: 1 }),
  R('suon_nuong', 'Sườn nướng than tre', '🍖', 3, { thit_lon: 2, xuong: 1, muoi: 1 }, 3, 'noido', { secret: 'hoadau', step: 2 }),
  R('bo_lui', 'Bò lụi tiêu rừng', '🍢', 3, { thit_bo: 2, muoi: 1, thao_duoc: 1 }, 3, 'noido', { secret: 'hoadau', step: 3 }),
  R('ca_hap_gung', 'Cá hấp gừng sả', '🐟', 2, { ca: 2, thao_duoc: 1 }, 3, 'song', { secret: 'thamba', step: 1 }),
  R('tom_rang', 'Tôm rang muối', '🦐', 2, { tom: 2, muoi: 1 }, 3, 'song', { secret: 'thamba', step: 2 }),
  R('canh_chua', 'Canh chua cá đồng', '🍲', 3, { ca: 1, rau: 2, tuong: 1 }, 3, 'song', { secret: 'thamba', step: 3 }),
  R('dau_hu_nam', 'Đậu hũ non sốt nấm', '🍮', 2, { dau: 3, rau: 1 }, 3, 'thon', { secret: 'tinhtrai', step: 1 }),
  R('chao_sen', 'Cháo hạt sen dưỡng tâm', '🥣', 3, { gao: 1, thao_duoc: 1, rau: 1 }, 3, 'thon', { secret: 'tinhtrai', step: 2 }),
  R('rau_ngu_vi', 'Rau ngũ vị thanh trai', '🥗', 3, { rau: 3, tuong: 1 }, 3, 'thon', { secret: 'tinhtrai', step: 3 }),
  R('thit_muoi', 'Thịt muối chua', '🥓', 2, { thit_lon: 2, muoi: 2 }, 4, 'mo', { secret: 'daiho', step: 1, salted: 1 }),
  R('ca_kho_tieu', 'Cá khô kho tiêu', '🐠', 2, { ca_kho: 2, muoi: 1 }, 4, 'mo', { secret: 'daiho', step: 2, salted: 1 }),
  R('banh_mo', 'Bánh mỡ lò than', '🥮', 2, { bot: 2, mo: 1, muoi: 1 }, 4, 'mo', { secret: 'daiho', step: 3, salted: 1 }),
];
export const RECIPE_BY = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** 4 bếp trưởng (§16.2) — món thử thách: nấu đạt chất lượng ≥ 0,7, độ tươi nguyên liệu ≥ 0,8 */
export const CHEFS = {
  hoadau: { name: 'Lão Hỏa Đầu', where: 'Hỏa Vân Tửu Lâu', region: 'noido', trials: ['thit_kho', 'com_ga', 'bo_nuong_than'], bio: 'Bếp lửa ba mươi năm, ghét ai để than tắt giữa chừng.' },
  thamba: { name: 'Thẩm bà', where: 'bến Huyền Hà', region: 'song', trials: ['ca_nuong_que', 'ca_chien', 'lau_ca'], bio: 'Bà bán cá đầu bến, nếm một đũa biết cá câu từ giờ nào.' },
  tinhtrai: { name: 'Sư thầy Tịnh Trai', where: 'Manh Phái Cốc', region: 'thon', trials: ['chao_rau', 'rau_xao', 'canh_sen'], bio: 'Nấu chay cho cả cốc, dạy rằng vị thanh mới là vị khó.' },
  daiho: { name: 'Đại Hồ', where: 'bếp mỏ Khoáng Sơn', region: 'mo', trials: ['com_tho_mo', 'thit_xong', 'ca_kho_to'], bio: 'Bếp mỏ to tiếng, chỉ quý người nấu được cho trăm thợ ăn no.' },
};
export const CHEF_CAP = 20, TRIALS_NEED = 3, AFFINITY_NEED = 60;

// --- món ăn → vật phẩm (giá trị = nguyên liệu × hệ số hạng / số suất) ---------------------------------------
const TIER = {
  1: { d: 12, k: 0.5, mul: 1.5, full: 18, wake: 0, hp: 0, tox: 1.5 },
  2: { d: 24, k: 0.5, mul: 1.8, full: 30, wake: 6, hp: 2, tox: 0 },
  3: { d: 6, k: 0.125, mul: 2.4, full: 45, wake: 12, hp: 6, tox: 0, buff: 0.2 },
};
export const TIERS = TIER;
const ingCost = (ing) => Object.entries(ing).reduce((a, [id, n]) => a + RAW[id].b * n, 0);
const DISHES = {};
for (const r of RECIPES) {
  const T = TIER[r.tier], unit = (ingCost(r.ing) * T.mul) / r.out;
  DISHES[r.id] = { n: r.n, i: r.i, c: 'dish', b: Math.round(Math.max(3, unit) * 10) / 10, d: T.d * (r.salted ? 3 : 1), k: T.k, r: r.region || 'trung', tier: r.tier, full: r.drink ? 2 : T.full, wake: r.drink ? 14 : T.wake, hp: T.hp, tox: T.tox, buff: T.buff || 0, secret: r.secret || null };
}
export const ITEMS = { ...RAW, ...DISHES };
export const def = (id) => ITEMS[id] || null;
export const isFood = (id) => { const d = ITEMS[id]; return !!d && (d.c === 'dish' || d.c === 'veg' || d.c === 'meat' || d.c === 'fish' || d.c === 'grain'); };

// --- ruộng & chuồng (§13.3) — giờ thật, tưới mỗi 12 giờ ----------------------------------------------------
export const CROPS = {
  rau: { n: 'Rau', seed: 'g_rau', h: 8, out: { rau: 8 }, kind: 'ruong' },
  lua: { n: 'Lúa', seed: 'g_lua', h: 24, out: { lua: 12 }, kind: 'ruong' },
  bong: { n: 'Bông', seed: 'g_bong', h: 36, out: { bong: 6 }, kind: 'ruong' },
  tra: { n: 'Chè', seed: 'g_tra', h: 48, out: { tra_la: 6 }, kind: 'ruong' },
  ga: { n: 'Gà', seed: 'g_ga', h: 24, feed: 2, out: { ga: 1, trung: 4 }, kind: 'chuong' },
  lon: { n: 'Lợn', seed: 'g_lon', h: 72, feed: 6, out: { lon: 1 }, kind: 'chuong' },
  bo: { n: 'Bò', seed: 'g_bo', h: 168, feed: 15, out: { bo: 1 }, kind: 'chuong' },
};
export const PLOT = { max: 4, rentWeek: 50, waterH: 12, dryLoss: 0.3, jieqi: 0.2, fert: 0.1 };
/** lò mổ (§13.3) */
export const BUTCHER = { ga: { thit_ga: 2, xuong: 1, long: 1 }, lon: { thit_lon: 8, mo: 3, xuong: 3, da: 1 }, bo: { thit_bo: 20, mo: 4, xuong: 6, da: 2 } };
/** xay xát: 2 lúa → 1 gạo; phí 1 đồng / lượt */
export const MILL = { in: { lua: 2 }, out: { gao: 1 }, fee: 1 };
/** ngư phủ: trữ lượng hoang dã có hạn, hồi 10% / giờ (§13.3) */
export const WILD = { fish: { cap: 40, regen: 0.1, yield: { ca: [1, 3], tom: [0, 1] } } };

// --- mặt bằng (§17.1) — số đồng / ngày; cap = khách tối đa / ngày; tiers = hạng món được bán ---------------
export const VENUE_TIERS = {
  stall: { name: 'Quầy lề đường', slots: 24, rent: 20, license: 7, fixed: 0, cap: 60, tiers: [1, 2], deposit: 0, rainCut: 0.6 },
  diner: { name: 'Quán cơm bình dân', slots: 12, rent: 400, license: 10, fixed: 75, cap: 420, tiers: [1, 2, 3], deposit: 0 },
  fine: { name: 'Tửu lâu thượng hạng', slots: 4, rent: 1500, license: 170, fixed: 420, cap: 1400, tiers: [1, 2, 3], deposit: 30, tax: 0.005 },
};
/** đối thủ NPC trong vùng (4 tửu lâu NPC + quầy cơm Sơn Môn) — điểm cố định chia «chiếc bánh» */
export const NPC_RIVAL = { noido: 3, trung: 4, song: 1.5, thon: 1, mo: 1.5 };
