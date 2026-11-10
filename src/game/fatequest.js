// ============================================================================
//  NHIỆM VỤ MỆNH ĐỘC QUYỀN (P5 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §4.6.
//  · Chỉ hiện khi người chơi đứng ĐÚNG CHỖ (cung hợp hành) vào ĐÚNG GIỜ (canh giờ hợp hành) của DỤNG THẦN mình.
//    Người khác đứng đó cũng không thấy (điểm chỉ dựng trên máy người đúng mệnh).
//  · Mỗi người 1 nhiệm vụ / ngày (giờ thật). Thưởng ×3–6 lương ngày sống tối thiểu (80 đồng) + quà theo hành.
//  · Chuỗi 7 ngày (ngày liền) → «đặc quyền» theo hành 7 ngày: Thủy thuê thuyền −50% · Hỏa ăn uống −20% ·
//    Mộc thuốc men −30% · Kim Tiền Trang miễn phí · Thổ bảo trì nhà −50%.
//  · Gợi ý cài vào lời NPC cùng hành (citizens.js) — phải hiểu bản mệnh mới đoán ra chỗ và giờ.
// ============================================================================
import * as BQ from './batquai.js';

/** canh giờ hợp hành: [giờ bắt đầu, giờ kết thúc) theo giờ địa phương (giờ Tý 23–1 …) */
export const HOURS = {
  水: [[21, 25]],                         // Hợi – Tý (21–1h)
  火: [[9, 13]],                          // Tỵ – Ngọ
  木: [[3, 7]],                           // Dần – Mão
  金: [[15, 19]],                         // Thân – Dậu
  土: [[7, 9], [19, 21], [1, 3], [13, 15]], // Thìn, Tuất, Sửu, Mùi
};
export const HOUR_TEXT = { 水: 'Hợi – Tý (21–1 giờ)', 火: 'Tỵ – Ngọ (9–13 giờ)', 木: 'Dần – Mão (3–7 giờ)', 金: 'Thân – Dậu (15–19 giờ)', 土: 'Thìn · Tuất · Sửu · Mùi' };
export function inHours(wx, hour) {
  for (const [a, b] of HOURS[wx] || []) { if (hour >= a && hour < b) return true; if (b > 24 && hour < b - 24) return true; }
  return false;
}
// 5 hành × 3 nhiệm vụ: gua = cung đặt điểm, u = khoảng bán kính trên đại lộ cung, mul = bội số lương ngày, gift = quà thêm
export const QUESTS = [
  { id: 'muoi', wx: '水', gua: 'kan', u: [230, 420], name: 'Lô muối đêm ở bến hào Khảm', task: 'Áp lô muối lên thuyền buôn đêm', mul: 4 },
  { id: 'calon', wx: '水', gua: 'kan', u: [440, 640], name: 'Cá lớn chợ cá ngoài thành', task: 'Mua lại mẻ cá lớn, bán gấp năm giá', mul: 5 },
  { id: 'thuyendem', wx: '水', gua: 'xun', u: [300, 560], name: 'Thuyền buôn đêm ở kênh Tốn', task: 'Dẫn lối thuyền buôn qua thủy môn', mul: 3 },
  { id: 'tieclon', wx: '火', gua: 'li', u: [220, 420], name: 'Tiệc lớn quảng trường Ly', task: 'Nhận đặt một cỗ tiệc trăm mâm', mul: 4 },
  { id: 'phaohoa', wx: '火', gua: 'li', u: [430, 640], name: 'Đơn pháo hoa lễ hội', task: 'Giao pháo hoa cho ban lễ', mul: 3 },
  { id: 'luyendan', wx: '火', gua: 'li', u: [300, 520], name: 'Canh lò luyện đan', task: 'Giữ lửa lò đan một tuần nhang', mul: 6, gift: 'immune' },
  { id: 'linhduoc', wx: '木', gua: 'xun', u: [420, 640], name: 'Linh dược rừng Tốn', task: 'Hái linh dược sương sớm', mul: 6, gift: 'immune' },
  { id: 'duocvien', wx: '木', gua: 'zhen', u: [250, 450], name: 'Dược viên Chấn cung', task: 'Ươm cây thuốc quý cho Y Quán', mul: 4 },
  { id: 'gotram', wx: '木', gua: 'zhen', u: [460, 640], name: 'Gỗ trầm lâu năm', task: 'Tìm khúc trầm trong vườn cổ', mul: 5 },
  { id: 'kimtinh', wx: '金', gua: 'qian', u: [300, 600], name: 'Mạch kim tinh Càn cung', task: 'Dò mạch kim tinh cho thợ rèn', mul: 5 },
  { id: 'hopdong', wx: '金', gua: 'dui', u: [230, 430], name: 'Hợp đồng Tiền Trang Đoài', task: 'Làm chứng một khế ước lớn', mul: 4 },
  { id: 'kiemcu', wx: '金', gua: 'dui', u: [440, 640], name: 'Kiếm cổ chôn dưới lầu', task: 'Thẩm định thanh kiếm cổ', mul: 3 },
  { id: 'thau', wx: '土', gua: 'kun', u: [230, 450], name: 'Thầu dựng lại công trình Khôn', task: 'Đo đạc nền móng cho thợ xây', mul: 5 },
  { id: 'moigioi', wx: '土', gua: 'gen', u: [230, 430], name: 'Môi giới biệt phủ Cấn', task: 'Dẫn khách xem phủ', mul: 4 },
  { id: 'dapde', wx: '土', gua: 'kun', u: [460, 640], name: 'Đắp đê ruộng Khôn', task: 'Đắp lại bờ ruộng sau mưa', mul: 3 },
];
export const PERK = {
  水: { name: 'Thủy vận', text: 'thuê thuyền −50%', boat: 0.5 },
  火: { name: 'Hỏa vận', text: 'ăn uống −20%', food: 0.8 },
  木: { name: 'Mộc vận', text: 'thuốc men −30%', med: 0.7 },
  金: { name: 'Kim vận', text: 'Tiền Trang miễn phí', bank: 0 },
  土: { name: 'Thổ vận', text: 'bảo trì nhà −50%', house: 0.5 },
};
export const DAY_MIN = 80; // đồng — giỏ sống tối thiểu một ngày (§3.2)
const h32 = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

/** nhiệm vụ hôm nay của người có Dụng thần wx (1 trong 3 của hành, tất định theo ngày + mã người) */
export function questFor(dateStr, wx, pid = '') {
  const list = QUESTS.filter((q) => q.wx === wx); if (!list.length) return null;
  return list[h32(`${dateStr}|${wx}|${pid}`) % list.length];
}
/** toạ độ điểm (m) của nhiệm vụ trong ngày: trên đại lộ cung (lệch khỏi lòng kênh Khảm / Tốn), tránh vật cản */
export function spotFor(q, dateStr, blocked = () => false) {
  const g = BQ.guaById(q.gua), r = h32(`${dateStr}|${q.id}`);
  const u0 = q.u[0] + (r % 1000) / 1000 * (q.u[1] - q.u[0]);
  const vs = q.gua === 'kan' || q.gua === 'xun' ? [16, -16, 21, -21] : [0, 4, -4, 9, -9];
  for (let du = 0; du < 60; du += 6) for (const v of vs) { const w = BQ.toWorld(g, u0 + du, v); if (!blocked(w.x, w.z)) return { x: w.x, z: w.z }; }
  const w = BQ.toWorld(g, u0, vs[0]); return { x: w.x, z: w.z };
}
export function fateState(L) {
  if (!L.fate || typeof L.fate !== 'object') L.fate = { day: '', done: '', streak: 0, last: '', perk: null };
  return L.fate;
}
/**
 * Điểm nhiệm vụ có hiện cho người này lúc này không: đúng Dụng thần + đúng canh giờ + đứng trong 60 m + chưa làm hôm nay.
 * Trả { q, spot } | null.
 */
export function visibleFor({ L, wx, pid, dateStr, hour, x, z, blocked }) {
  if (!wx) return null;
  const F = fateState(L); if (F.done === dateStr) return null;
  const q = questFor(dateStr, wx, pid); if (!q || !inHours(wx, hour)) return null;
  const spot = spotFor(q, dateStr, blocked);
  return Math.hypot(spot.x - x, spot.z - z) < 60 ? { q, spot } : null;
}
const prevDay = (d) => { const t = new Date(`${d}T12:00:00Z`); t.setUTCDate(t.getUTCDate() - 1); return t.toISOString().slice(0, 10); };
/** hoàn thành: thưởng (đồng), chuỗi ngày liền; đủ 7 ngày → đặc quyền theo hành 7 ngày. now: ms */
export function complete(L, q, dateStr, now = Date.now(), bonus = 1) {
  const F = fateState(L);
  if (F.done === dateStr) return { ok: false, reason: 'Hôm nay đã làm nhiệm vụ mệnh.' };
  F.streak = F.last === prevDay(dateStr) ? F.streak + 1 : 1;
  F.last = dateStr; F.done = dateStr;
  const reward = Math.round(DAY_MIN * q.mul * bonus); // bonus: Âm Đức cấp 3 +10% (P17)
  let perk = null;
  if (F.streak >= 7) { perk = { wx: q.wx, until: now + 7 * 86400000 }; F.perk = perk; F.streak = 0; F.everPerk = true; }
  return { ok: true, reward, gift: q.gift || null, streak: F.streak, perk };
}
/** hệ số đặc quyền đang có: kind 'boat' | 'food' | 'med' | 'bank' | 'house' → hệ số giá (1 = không có) */
export function perkMul(L, kind, now = Date.now()) {
  const P = L.fate?.perk; if (!P || now > P.until) return 1;
  const v = PERK[P.wx]?.[kind]; return v == null ? 1 : v;
}
/** câu gợi ý cho NPC (không nói thẳng — phải hiểu mệnh mới đoán ra) */
export function hint(q) {
  const g = BQ.guaById(q.gua);
  return `Nghe đồn ${HOUR_TEXT[q.wx].split(' (')[0].toLowerCase()} quanh đại lộ ${g.name} cung có việc «${q.name.toLowerCase()}» — chỉ người hợp hành ${({ 水: 'Thủy', 火: 'Hỏa', 木: 'Mộc', 金: 'Kim', 土: 'Thổ' })[q.wx]} mới gặp.`;
}
