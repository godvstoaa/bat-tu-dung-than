// ============================================================================
//  TÀNG Y CÁC — trang phục, phụ kiện, hiệu ứng (docs/GAME-V2-THIET-KE.md §S13).
//  Ô trang bị: phẩm phục · mũ/trâm · sau lưng · cầm tay · hào quang · vệt bước · ngự vật · khung tên.
//  Bậc hiếm: Phàm · Linh · Huyền · Tiên · Thần. Tiền: Phúc Khí (cày) và Ngọc (điểm danh, VIP, lên cấp).
//  5 bộ ngũ hành (4 món): mặc đủ bộ → hiệu ứng bộ; bộ hợp Dụng thần người chơi → «Hợp mệnh» +10% Phúc Khí
//  khi giải án / sảnh nghề (state.js › recordCase đọc s.wardrobe.bonus).
//  Thuần dữ liệu + logic, không DOM, không phụ thuộc → client, máy chủ MMO (protocol.js) và test dùng chung.
// ============================================================================

export const SLOTS = [
  { id: 'robe', name: 'Phẩm phục', icon: '👘' },
  { id: 'head', name: 'Mũ · trâm', icon: '👑' },
  { id: 'back', name: 'Sau lưng', icon: '🗡️' },
  { id: 'hand', name: 'Cầm tay', icon: '🪭' },
  { id: 'aura', name: 'Hào quang', icon: '✨' },
  { id: 'trail', name: 'Vệt bước', icon: '👣' },
  { id: 'mount', name: 'Ngự vật', icon: '☁️' },
  { id: 'frame', name: 'Khung tên', icon: '🏷️' },
];
export const RARITY = [
  null,
  { name: 'Phàm', color: '#b9b2a4' },
  { name: 'Linh', color: '#6fd48a' },
  { name: 'Huyền', color: '#5aa8ff' },
  { name: 'Tiên', color: '#c58bff' },
  { name: 'Thần', color: '#ffc44a' },
];

// HSV phẩm phục (áo ngoài, đai) — characters.js › tintMaterial nhận mảng [h, s, v]
const P = (h, s, v) => [h, s, v];

/** Danh mục. price: { phuc } hoặc { ngoc }; unlock: { level, vip, streak }. set: id bộ ngũ hành. */
export const ITEMS = [
  // --- phẩm phục
  { id: 'y_menh', slot: 'robe', name: 'Bản Mệnh Y', rarity: 1, free: true, desc: 'Áo theo Dụng thần, đai theo Hỷ thần — phẩm phục nhập môn.' },
  { id: 'y_bach', slot: 'robe', name: 'Bạch Y Thư Sinh', rarity: 2, price: { phuc: 240 }, look: { pri: P(0.12, 0.06, 0.96), acc: P(0.58, 0.35, 0.6) }, desc: 'Áo trắng đai lam, nhã như thư sinh lên kinh.' },
  { id: 'y_tu', slot: 'robe', name: 'Tử Y Chân Nhân', rarity: 4, price: { ngoc: 380 }, unlock: { vip: true }, look: { pri: P(0.78, 0.6, 0.55), acc: P(0.12, 0.7, 0.9) }, desc: 'Tử khí đông lai — chỉ dành cho Chân nhân (VIP).' },
  { id: 'y_moc', slot: 'robe', set: 'moc', name: 'Thanh Mộc Tiên Y', rarity: 3, price: { ngoc: 160 }, look: { pri: P(0.36, 0.6, 0.6), acc: P(0.12, 0.7, 0.85) }, desc: 'Lục tùng thêu lá liễu, đai vàng.' },
  { id: 'y_hoa', slot: 'robe', set: 'hoa', name: 'Ly Hỏa Chân Bào', rarity: 3, price: { ngoc: 160 }, look: { pri: P(0.99, 0.82, 0.8), acc: P(0.1, 0.85, 0.95) }, desc: 'Đỏ son như lửa luyện đan.' },
  { id: 'y_tho', slot: 'robe', set: 'tho', name: 'Hậu Thổ Đạo Bào', rarity: 3, price: { ngoc: 160 }, look: { pri: P(0.1, 0.7, 0.78), acc: P(0.06, 0.6, 0.45) }, desc: 'Hoàng bào đạo sĩ, vững như núi.' },
  { id: 'y_kim', slot: 'robe', set: 'kim', name: 'Canh Kim Kiếm Bào', rarity: 3, price: { ngoc: 160 }, look: { pri: P(0.12, 0.08, 0.95), acc: P(0.12, 0.25, 0.75) }, desc: 'Bạch kim ánh bạc của kiếm tu.' },
  { id: 'y_thuy', slot: 'robe', set: 'thuy', name: 'Huyền Thủy Long Bào', rarity: 3, price: { ngoc: 160 }, look: { pri: P(0.62, 0.65, 0.4), acc: P(0.52, 0.55, 0.8) }, desc: 'Lam huyền thăm thẳm như vực rồng.' },
  // --- mũ · trâm
  { id: 'tram_go', slot: 'head', name: 'Trâm Gỗ Đào', rarity: 1, price: { phuc: 60 }, desc: 'Trâm gỗ đào cài búi tóc — trừ tà, giữ tâm.' },
  { id: 'dao_quan', slot: 'head', set: 'kim', name: 'Ngân Đạo Quan', rarity: 3, price: { ngoc: 120 }, desc: 'Đạo quan bạc cài búi, đạo sĩ chính tông.' },
  { id: 'quan_la', slot: 'head', set: 'moc', name: 'Liễu Diệp Quan', rarity: 3, price: { ngoc: 120 }, desc: 'Vòng lá liễu xanh quanh búi tóc.' },
  { id: 'kim_quan', slot: 'head', set: 'hoa', name: 'Tử Kim Quan · Lông Trĩ', rarity: 4, price: { ngoc: 220 }, desc: 'Kim quan cắm đôi lông trĩ dài — phong thái tướng quân.' },
  { id: 'dau_lap', slot: 'head', set: 'tho', name: 'Đấu Lạp Mạng Sa', rarity: 3, price: { ngoc: 120 }, desc: 'Nón lá rộng vành buông mạng — giang hồ ẩn sĩ.' },
  { id: 'tram_ngoc', slot: 'head', set: 'thuy', name: 'Bích Ngọc Trâm', rarity: 3, price: { ngoc: 120 }, desc: 'Trâm ngọc lam rủ tua châu.' },
  { id: 'quan_sen', slot: 'head', name: 'Mũ Sen Vàng', rarity: 5, price: { ngoc: 680 }, unlock: { vip: true, level: 10 }, desc: 'Mũ sen vàng rực rỡ — VIP · cấp 10.' },
  // --- sau lưng
  { id: 'kiem_go', slot: 'back', name: 'Kiếm Gỗ Đào', rarity: 1, price: { phuc: 120 }, desc: 'Thanh kiếm gỗ đào đeo chéo lưng.' },
  { id: 'kiem_moc', slot: 'back', set: 'moc', name: 'Thanh Trúc Kiếm', rarity: 3, price: { ngoc: 140 }, desc: 'Kiếm bao trúc xanh.' },
  { id: 'ho_lo', slot: 'back', set: 'tho', name: 'Tử Kim Hồ Lô', rarity: 3, price: { ngoc: 140 }, desc: 'Hồ lô đựng đan dược, đeo bên hông lưng.' },
  { id: 'kiem_bao', slot: 'back', set: 'kim', name: 'Song Kiếm Hàn Quang', rarity: 4, price: { ngoc: 240 }, desc: 'Đôi kiếm bạc bắt chéo sau lưng.' },
  { id: 'o_giay', slot: 'back', set: 'thuy', name: 'Ô Giấy Dầu Vẽ Sen', rarity: 3, price: { ngoc: 140 }, desc: 'Ô giấy dầu xếp gọn đeo lưng.' },
  { id: 'canh_phuong', slot: 'back', set: 'hoa', name: 'Phượng Hỏa Dực', rarity: 4, price: { ngoc: 320 }, desc: 'Đôi cánh lửa phượng hoàng khẽ đập.' },
  { id: 'canh_hac', slot: 'back', name: 'Tiên Hạc Dực', rarity: 4, price: { ngoc: 320 }, desc: 'Đôi cánh hạc trắng viền đen.' },
  { id: 'phap_luan', slot: 'back', name: 'Bát Quái Hộ Thân Phù', rarity: 5, price: { ngoc: 720 }, unlock: { vip: true }, desc: 'Vòng bát quái vàng xoay sau lưng — VIP.' },
  // --- cầm tay
  { id: 'quat_giay', slot: 'hand', name: 'Quạt Giấy Thư Pháp', rarity: 1, price: { phuc: 90 }, desc: 'Quạt giấy viết chữ «道».' },
  { id: 'phat_tran', slot: 'hand', name: 'Phất Trần Bạch Vĩ', rarity: 2, price: { phuc: 260 }, desc: 'Phất trần lông trắng của đạo sĩ.' },
  { id: 'den_long_tay', slot: 'hand', name: 'Đăng Lung Dạ Hành', rarity: 2, price: { phuc: 260 }, desc: 'Đèn lồng cầm tay, sáng thật khi đêm.' },
  { id: 'la_ban_tay', slot: 'hand', name: 'La Bàn Tam Hợp', rarity: 3, price: { ngoc: 130 }, desc: 'La bàn đồng cầm tay của thầy địa lý.' },
  { id: 'quat_long', slot: 'hand', name: 'Vũ Phiến Gia Cát', rarity: 4, price: { ngoc: 260 }, desc: 'Quạt lông trắng của quân sư.' },
  // --- hào quang (hiện kể cả chưa đủ cấp gia trì)
  { id: 'aura_menh', slot: 'aura', name: 'Gia Trì Bản Mệnh', rarity: 1, free: true, desc: 'Hào quang theo hành Dụng thần (mở theo cấp).' },
  { id: 'aura_dao', slot: 'aura', set: 'moc', name: 'Đào Hoa Phi Vũ', rarity: 3, price: { ngoc: 150 }, desc: 'Cánh đào bay quanh người.' },
  { id: 'aura_lua', slot: 'aura', set: 'hoa', name: 'Tam Muội Chân Hỏa', rarity: 4, price: { ngoc: 260 }, desc: 'Lửa tam muội bốc dưới chân.' },
  { id: 'aura_batquai', slot: 'aura', set: 'tho', name: 'Bát Quái Trận', rarity: 4, price: { ngoc: 260 }, desc: 'Trận bát quái vàng xoay dưới chân.' },
  { id: 'aura_set', slot: 'aura', set: 'kim', name: 'Cửu Thiên Lôi Quang', rarity: 4, price: { ngoc: 260 }, desc: 'Tia sét tím lách tách quanh thân.' },
  { id: 'aura_tuyet', slot: 'aura', set: 'thuy', name: 'Hàn Tuyết Phiêu', rarity: 3, price: { ngoc: 150 }, desc: 'Tuyết bay lả tả quanh người.' },
  { id: 'aura_sen', slot: 'aura', name: 'Bộ Bộ Sinh Liên', rarity: 5, price: { ngoc: 640 }, unlock: { level: 8 }, desc: 'Sen vàng nở dưới chân — cấp 8.' },
  // --- vệt bước
  { id: 'trail_menh', slot: 'trail', name: 'Bộ Pháp Bản Mệnh', rarity: 1, free: true, desc: 'Vệt sáng theo hành (mở ở cấp 6).' },
  { id: 'trail_may', slot: 'trail', name: 'Đằng Vân Bộ', rarity: 2, price: { phuc: 300 }, desc: 'Mây trắng cuộn theo bước chân.' },
  { id: 'trail_sen', slot: 'trail', name: 'Liên Hoa Bộ', rarity: 3, price: { ngoc: 120 }, desc: 'Cánh sen hồng rơi theo bước.' },
  { id: 'trail_lua', slot: 'trail', name: 'Hỏa Vân Bộ', rarity: 3, price: { ngoc: 120 }, desc: 'Đốm lửa bám gót.' },
  { id: 'trail_bang', slot: 'trail', name: 'Băng Phách Bộ', rarity: 3, price: { ngoc: 120 }, desc: 'Tinh thể băng lấp lánh.' },
  { id: 'trail_sao', slot: 'trail', name: 'Tinh Hà Bộ', rarity: 4, price: { ngoc: 220 }, desc: 'Bụi sao vàng lấp lánh như dải ngân hà.' },
  // --- ngự vật (hình khi bay; bay mở theo cấp 8 / VIP)
  { id: 'kiem', slot: 'mount', name: 'Ngự Kiếm', rarity: 1, free: true, desc: 'Thanh kiếm bay dưới chân.' },
  { id: 'may', slot: 'mount', name: 'Cân Đẩu Vân', rarity: 3, price: { ngoc: 200 }, desc: 'Cưỡi mây cân đẩu.' },
  { id: 'ho_lo_bay', slot: 'mount', name: 'Hồ Lô Phi Hành', rarity: 3, price: { ngoc: 200 }, desc: 'Cưỡi hồ lô tím vàng.' },
  { id: 'dai_sen', slot: 'mount', name: 'Liên Hoa Đài', rarity: 4, price: { ngoc: 360 }, desc: 'Đứng trên đài sen vàng.' },
  { id: 'hac', slot: 'mount', name: 'Tiên Hạc', rarity: 5, price: { ngoc: 780 }, unlock: { vip: true }, desc: 'Cưỡi hạc trắng sải cánh — VIP.' },
  // --- khung tên
  { id: 'khung_tron', slot: 'frame', name: 'Khung Mộc', rarity: 1, free: true, desc: 'Khung tên mặc định.' },
  { id: 'khung_may', slot: 'frame', name: 'Tường Vân', rarity: 2, price: { phuc: 180 }, desc: 'Viền mây lành.' },
  { id: 'khung_sen', slot: 'frame', name: 'Liên Đài', rarity: 3, price: { ngoc: 90 }, desc: 'Viền sen hồng.' },
  { id: 'khung_ngoc', slot: 'frame', name: 'Bích Ngọc', rarity: 3, price: { ngoc: 90 }, desc: 'Viền ngọc bích.' },
  { id: 'khung_long', slot: 'frame', name: 'Kim Long', rarity: 5, price: { ngoc: 480 }, unlock: { streak: 7 }, desc: 'Viền rồng vàng — điểm danh 7 ngày liền.' },
];
export const ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
const FREE = ITEMS.filter((it) => it.free).map((it) => it.id);
export const DEFAULT_EQUIP = { robe: 'y_menh', aura: 'aura_menh', trail: 'trail_menh', mount: 'kiem', frame: 'khung_tron' };

export const SETS = [
  { id: 'moc', wx: '木', name: 'Thanh Mộc Tiên Tông', pieces: ['y_moc', 'quan_la', 'kiem_moc', 'aura_dao'] },
  { id: 'hoa', wx: '火', name: 'Ly Hỏa Chân Tông', pieces: ['y_hoa', 'kim_quan', 'canh_phuong', 'aura_lua'] },
  { id: 'tho', wx: '土', name: 'Hậu Thổ Đạo Tông', pieces: ['y_tho', 'dau_lap', 'ho_lo', 'aura_batquai'] },
  { id: 'kim', wx: '金', name: 'Canh Kim Kiếm Tông', pieces: ['y_kim', 'dao_quan', 'kiem_bao', 'aura_set'] },
  { id: 'thuy', wx: '水', name: 'Huyền Thủy Long Tông', pieces: ['y_thuy', 'tram_ngoc', 'o_giay', 'aura_tuyet'] },
];
export const SET_BONUS = 0.1; // Hợp mệnh: +10% Phúc Khí giải án / sảnh nghề

// Điểm danh 7 ngày (vòng lặp) · VIP mỗi ngày · quà lên cấp
export const CHECKIN = [10, 15, 20, 25, 30, 40, 80];
export const VIP_DAILY = 30;
export const LEVEL_GIFT = 20;

// ---------------------------------------------------------------------------
const dayStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const prevStr = (s) => { const [y, m, d] = s.split('-').map(Number); return dayStr(new Date(y, m - 1, d - 1)); };

/** Tủ đồ (tạo nếu chưa có). */
export function wardrobe(s) {
  if (!s.wardrobe || typeof s.wardrobe !== 'object') s.wardrobe = {};
  const w = s.wardrobe;
  w.owned = Array.isArray(w.owned) ? w.owned.filter((id) => ITEM[id]) : [];
  for (const id of FREE) if (!w.owned.includes(id)) w.owned.push(id);
  w.equipped = { ...DEFAULT_EQUIP, ...(w.equipped || {}) };
  for (const [slot, id] of Object.entries(w.equipped)) if (!ITEM[id] || ITEM[id].slot !== slot || !w.owned.includes(id)) delete w.equipped[slot];
  w.ngoc = Math.max(0, Math.floor(w.ngoc || 0));
  w.checkin = w.checkin || { last: null, streak: 0, bestStreak: 0 };
  // save cũ chưa có bestStreak → chuỗi hiện tại coi như kỷ lục (đạt mốc cũ không mất quyền mua)
  if (typeof w.checkin.bestStreak !== 'number') w.checkin.bestStreak = w.checkin.streak || 0;
  w.levelGift = w.levelGift || 1;
  w.vipDay = w.vipDay || null;
  return w;
}

/** Có được mua chưa: { ok, reason }. ctx: { level, vip } */
export function canBuy(s, id, ctx = {}) {
  const it = ITEM[id];
  if (!it) return { ok: false, reason: 'Không có món này.' };
  const w = wardrobe(s);
  if (w.owned.includes(id)) return { ok: false, reason: 'Đã có trong tủ.' };
  if (it.free || !it.price) return { ok: false, reason: 'Món này không bán.' };
  const u = it.unlock || {};
  if (u.vip && !ctx.vip) return { ok: false, reason: 'Chỉ dành cho VIP.' };
  if (u.level && (ctx.level || 1) < u.level) return { ok: false, reason: `Cần cấp ${u.level}.` };
  if (u.streak && (w.checkin.bestStreak || 0) < u.streak) return { ok: false, reason: `Cần điểm danh ${u.streak} ngày liền.` };
  if (it.price.phuc && (s.phucKhi || 0) < it.price.phuc) return { ok: false, reason: `Thiếu Phúc Khí (cần ${it.price.phuc}).` };
  if (it.price.ngoc && w.ngoc < it.price.ngoc) return { ok: false, reason: `Thiếu Ngọc (cần ${it.price.ngoc}).` };
  return { ok: true };
}

/** Mua → trừ tiền, cho vào tủ. Phúc Khí tiêu không làm giảm cấp (xp giữ nguyên). */
export function buy(s, id, ctx = {}) {
  const c = canBuy(s, id, ctx);
  if (!c.ok) return c;
  const it = ITEM[id], w = wardrobe(s);
  if (it.price.phuc) s.phucKhi -= it.price.phuc;
  if (it.price.ngoc) w.ngoc -= it.price.ngoc;
  w.owned.push(id);
  return { ok: true };
}

/** Mặc / tháo. Tính lại thưởng bộ. yongWx: hành Dụng thần người chơi. */
export function equip(s, id, yongWx = null) {
  const it = ITEM[id], w = wardrobe(s);
  if (!it || !w.owned.includes(id)) return false;
  w.equipped[it.slot] = id;
  w.bonus = setBonus(s, yongWx).bonus;
  return true;
}
export function unequip(s, slot, yongWx = null) {
  const w = wardrobe(s);
  if (DEFAULT_EQUIP[slot]) w.equipped[slot] = DEFAULT_EQUIP[slot]; else delete w.equipped[slot];
  w.bonus = setBonus(s, yongWx).bonus;
}

/** Bộ đang mặc đủ: { set, matched, bonus } — matched = bộ hợp Dụng thần. */
export function setBonus(s, yongWx = null) {
  const eq = Object.values(wardrobe(s).equipped);
  const set = SETS.find((st) => st.pieces.every((p) => eq.includes(p))) || null;
  const matched = !!(set && yongWx && set.wx === yongWx);
  return { set, matched, bonus: matched ? SET_BONUS : 0, count: (st) => st.pieces.filter((p) => eq.includes(p)).length };
}

/** Điểm danh hôm nay: { ok, day (1..7), ngoc, streak } — mỗi ngày một lần; đứt chuỗi thì về ngày 1. */
export function checkin(s, now = new Date()) {
  const w = wardrobe(s), t = dayStr(now);
  if (w.checkin.last === t) return { ok: false, streak: w.checkin.streak };
  const streak = w.checkin.last === prevStr(t) ? w.checkin.streak + 1 : 1;
  const bestStreak = Math.max(w.checkin.bestStreak || 0, streak);
  const day = ((streak - 1) % CHECKIN.length) + 1;
  const ngoc = CHECKIN[day - 1];
  w.checkin = { last: t, streak, bestStreak };
  w.ngoc += ngoc;
  return { ok: true, day, ngoc, streak };
}
export const checkedIn = (s, now = new Date()) => wardrobe(s).checkin.last === dayStr(now);

/** VIP nhận Ngọc mỗi ngày. */
export function vipDaily(s, vip, now = new Date()) {
  const w = wardrobe(s), t = dayStr(now);
  if (!vip || w.vipDay === t) return 0;
  w.vipDay = t; w.ngoc += VIP_DAILY;
  return VIP_DAILY;
}

/** Quà lên cấp: mỗi cấp mới +LEVEL_GIFT Ngọc (nhận dồn). */
export function levelGifts(s, level) {
  const w = wardrobe(s);
  const n = Math.max(0, level - w.levelGift);
  if (!n) return 0;
  w.levelGift = level; w.ngoc += n * LEVEL_GIFT;
  return n * LEVEL_GIFT;
}

// ---------------------------------------------------------------------------
// Đồng bộ MMO: chuỗi gọn «ô:món,…» — máy chủ chỉ nhận món có trong danh mục, đúng ô
// ---------------------------------------------------------------------------
const SLOT_KEY = { robe: 'r', head: 'h', back: 'b', hand: 'n', aura: 'a', trail: 't', mount: 'm', frame: 'f' };
const KEY_SLOT = Object.fromEntries(Object.entries(SLOT_KEY).map(([a, b]) => [b, a]));
export function encodeCos(equipped = {}) {
  return Object.entries(equipped).filter(([slot, id]) => SLOT_KEY[slot] && ITEM[id] && !ITEM[id].free).map(([slot, id]) => `${SLOT_KEY[slot]}:${id}`).join(',');
}
export function decodeCos(str) {
  const out = {};
  if (typeof str !== 'string' || str.length > 240) return out;
  for (const part of str.split(',')) {
    const [k, id] = part.split(':');
    const slot = KEY_SLOT[k];
    if (slot && ITEM[id] && ITEM[id].slot === slot) out[slot] = id;
  }
  return out;
}
/** Chuỗi đã lọc (máy chủ phát lại đúng chuỗi này). */
export const cleanCos = (str) => encodeCos(decodeCos(str));
