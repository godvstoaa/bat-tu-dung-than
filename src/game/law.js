// ============================================================================
//  HUYỀN THÀNH LUẬT (thuần JS — client, test Node; máy chủ chỉ đồng bộ công trình bị phá).
//  Bộ luật toàn game dựng trên bát tự + phong thủy:
//   · Trong tường thành có Bát Quái hộ thành đại trận — công trình KHÔNG phá được.
//   · Ngoài thành phá được, nhưng là TỘI «phá hoại địa khí». Điểm tội = cỡ công trình × hệ số BÁT MÔN (phá ở hướng
//     cát môn Hưu – Sinh – Khai: phá cát khí, nặng ×1,6; Cảnh, Đỗ ×1,2; hung môn Tử, Kinh, Thương ×0,8)
//     × hệ số NGÀY (ngày can chi xung tuổi người phạm ×1,5 — «phạm Thái Tuế») × NGŨ HÀNH (công trình mang hành
//     sinh trợ Dụng thần của mình: tự phá phúc mình ×1,3; hành Kỵ thần ×0,7) × TÁI PHẠM (1 + 0,5 × số tiền án).
//   · Khung hình phạt theo điểm: PHẠT TIỀN (tiền kim loại — P18) → GIAM THIÊN LAO (phút thật) → ĐÀY KHOÁNG SƠN khổ sai (đào đủ
//     số quặng mới được tha) → tái phạm từ lần thứ 7: KHỔ SAI VĨNH VIỄN (chỉ thoát bằng Đại Xá: nộp Ngọc).
//   · Thiếu tiền nộp phạt thì chuyển sang giam; vượt ngục / bỏ trốn khỏi mỏ: án tăng gấp đôi.
// ============================================================================
import { GUA } from './batquai.js';
import { fmt as fmtCoin } from './coins.js';
import { walletXu, spendXu } from './life.js';
export const FINE_XU = 400; // xu cho mỗi «điểm phạt» cũ (Phúc Khí × 4 đồng — P18)

export const GATE_FACTOR = { 'Hưu Môn': 1.6, 'Sinh Môn': 1.6, 'Khai Môn': 1.6, 'Cảnh Môn': 1.2, 'Đỗ Môn': 1.2, 'Tử Môn': 0.8, 'Kinh Môn': 0.8, 'Thương Môn': 0.8 };
export const PERMA_AT = 7;
export const RESPAWN_MS = 20 * 60000;     // công trình bị phá tự dựng lại sau 20 phút
export const ARTICLES = [
  ['Điều 1 · Hộ thành đại trận', 'Trong tường Bát Quái Thành, mọi công trình được đại trận che chở — không ai phá nổi.'],
  ['Điều 2 · Phá hoại địa khí', 'Phá công trình ngoài thành là tội phá hoại địa khí; điểm tội tính theo cỡ công trình.'],
  ['Điều 3 · Bát Môn', 'Phá ở hướng cát môn (Hưu, Sinh, Khai) là phá cát khí: tội nặng gấp 1,6. Cảnh, Đỗ: 1,2. Hung môn (Tử, Kinh, Thương): 0,8.'],
  ['Điều 4 · Phạm Thái Tuế', 'Phạm tội vào ngày địa chi xung tuổi mình: tội nặng gấp 1,5.'],
  ['Điều 5 · Ngũ hành', 'Công trình mang hành sinh trợ Dụng thần của người phạm: tự phá phúc mình, tội ×1,3. Mang hành Kỵ thần: ×0,7.'],
  ['Điều 6 · Tái phạm', 'Mỗi tiền án làm tội nặng thêm 50%. Tái phạm lần thứ 7 trở đi: khổ sai vĩnh viễn tại Khoáng Sơn.'],
  ['Điều 7 · Khung hình phạt', 'Dưới 20 điểm: phạt Phúc Khí. 20–60: giam Thiên Lao. Trên 60: đày Khoáng Sơn khổ sai, đào đủ quặng mới được tha.'],
  ['Điều 8 · Nộp phạt', 'Không đủ Phúc Khí nộp phạt thì chuyển sang giam Thiên Lao.'],
  ['Điều 9 · Vượt ngục', 'Rời Thiên Lao hay bỏ trốn khỏi Khoáng Sơn khi chưa mãn hạn: án tăng gấp đôi.'],
  ['Điều 10 · Đại Xá', 'Khổ sai vĩnh viễn chỉ được tha khi nộp Đại Xá (Ngọc) tại Khoáng Sơn.'],
  ['Điều 11 · Chuộc tội', 'Người bị giam Thiên Lao được nộp Phúc Khí chuộc phần hạn còn lại (30 Phúc Khí mỗi phút). Khổ sai không được chuộc bằng Phúc Khí.'],
];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CHI_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const chiIdx = (s) => { s = String(s || ''); const k = s.slice(-1), i = CHI_HAN.indexOf(k); return i >= 0 ? i : CHI.findIndex((c) => s.endsWith(c)); };
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };

/** trạng thái luật trong state (hydrate chỉ giữ khoá có trong createState) */
export function lawState(s) {
  if (!s.law || typeof s.law !== 'object') s.law = {};
  const L = s.law;
  if (!Array.isArray(L.record)) L.record = [];
  if (L.sentence === undefined) L.sentence = null;
  return L;
}
/** cung (Bát Môn) chứa điểm (x, z) theo hướng từ tâm thành */
export function guaAt(x, z) { return GUA.reduce((b, g) => (g.dir[0] * x + g.dir[1] * z > b.dir[0] * x + b.dir[1] * z ? g : b), GUA[0]); }
/** địa chi ngày có xung địa chi năm sinh không (Tý–Ngọ, Sửu–Mùi, …) — nhận chữ Hán (甲子) hoặc Việt (Giáp Tý) */
export function clash(dayGZ, birthChi) {
  const d = chiIdx(dayGZ), b = chiIdx(birthChi);
  return d >= 0 && b >= 0 && (d + 6) % 12 === b;
}
/** HP công trình theo khối (m³ tương đối) */
export const hpOf = (rec) => Math.round(Math.min(600, Math.max(30, (rec.w * rec.d * Math.max(2, rec.h)) / 60)));

/**
 * Định tội cho một lần phá: { points, factors: [[tên, hệ số]], gate }.
 * ctx: { x, z, size (HP), wx (hành công trình), yong: { primary, ji }, dayGZ, birthChi, priors }
 */
export function assess(ctx) {
  const g = guaAt(ctx.x, ctx.z), gf = GATE_FACTOR[g.gate] || 1;
  const df = clash(ctx.dayGZ, ctx.birthChi) ? 1.5 : 1;
  let wf = 1;
  if (ctx.yong?.primary && ctx.wx) { if (ctx.wx === ctx.yong.primary || SHENG[ctx.wx] === ctx.yong.primary) wf = 1.3; else if (ctx.wx === ctx.yong.ji) wf = 0.7; }
  const rf = 1 + 0.5 * (ctx.priors || 0);
  const base = Math.max(4, ctx.size / 8);
  const points = Math.round(base * gf * df * wf * rf);
  return { points, gate: g.gate, gua: g.id, factors: [['Cỡ công trình', +base.toFixed(1)], [`Bát Môn · ${g.gate}`, gf], ['Ngày phạm Thái Tuế', df], ['Ngũ hành với Dụng thần', wf], ['Tái phạm', rf]] };
}
/** Bản án từ điểm tội + số tiền án: { kind: 'fine'|'jail'|'mine'|'perma', fine?, minutes?, quota? } */
export function sentenceFor(points, priors = 0) {
  if (priors + 1 >= PERMA_AT) return { kind: 'perma', quota: Infinity, label: 'Khổ sai vĩnh viễn tại Khoáng Sơn' };
  if (points < 20) return { kind: 'fine', fine: points * 25 * FINE_XU, label: `Phạt ${fmtCoin(points * 25 * FINE_XU)}` };
  if (points <= 60) return { kind: 'jail', minutes: Math.round(points / 4), label: `Giam Thiên Lao ${Math.round(points / 4)} phút` };
  return { kind: 'mine', quota: Math.round(points / 3), label: `Đày Khoáng Sơn — đào ${Math.round(points / 3)} quặng` };
}
/** Thi hành: ghi tiền án, trừ tiền hoặc lập án giam / khổ sai. Trả bản án đã áp. now: ms */
export function convict(s, crime, now = Date.now()) {
  const L = lawState(s), priors = L.record.length;
  let sen = sentenceFor(crime.points, priors);
  if (sen.kind === 'fine') {
    if (walletXu(s) >= sen.fine) spendXu(s, sen.fine);
    else sen = { kind: 'jail', minutes: Math.max(5, Math.round(crime.points / 3)), label: `Không đủ tiền nộp phạt — giam Thiên Lao ${Math.max(5, Math.round(crime.points / 3))} phút` };
  }
  L.record.push({ at: now, points: crime.points, gate: crime.gate, kind: sen.kind });
  if (L.record.length > 50) L.record.shift();
  if (sen.kind === 'jail') L.sentence = { kind: 'jail', until: now + sen.minutes * 60000, label: sen.label };
  else if (sen.kind === 'mine' || sen.kind === 'perma') L.sentence = { kind: sen.kind, quota: sen.kind === 'perma' ? -1 : sen.quota, mined: 0, label: sen.label };
  return sen;
}
/** Án còn hiệu lực không (giam hết giờ thì tự mãn hạn) */
export function serving(s, now = Date.now()) {
  const L = lawState(s), S = L.sentence; if (!S) return null;
  if (S.kind === 'jail' && now >= S.until) { L.sentence = null; return null; }
  if (S.kind === 'mine' && S.mined >= S.quota) { L.sentence = null; return null; }
  return S;
}
/** Điều 12 (P3): nợ quá hạn → khổ sai trừ nợ ở Khoáng Sơn, mỗi quặng trừ oreDong đồng; không ghi tiền án */
export function debtSentence(s, debtDong, oreDong = 15) {
  const quota = Math.max(1, Math.ceil(debtDong / oreDong));
  lawState(s).sentence = { kind: 'mine', quota, mined: 0, debt: true, oreDong, label: `Khổ sai trừ nợ — đào ${quota} quặng (mỗi quặng trừ ${oreDong} đồng)` };
  return lawState(s).sentence;
}
/** đào một quặng ở Khoáng Sơn; trả true nếu mãn hạn */
export function mineOre(s) {
  const S = lawState(s).sentence; if (!S || (S.kind !== 'mine' && S.kind !== 'perma')) return false;
  S.mined = (S.mined || 0) + 1;
  if (S.debt && s.life) { s.life.debt = Math.max(0, (s.life.debt || 0) - (S.oreDong || 15)); if (s.life.med && !s.life.debt) { s.life.med.debtSince = 0; s.life.med.debtBase = 0; } }
  if (S.kind === 'mine' && S.mined >= S.quota) { lawState(s).sentence = null; return true; }
  return false;
}
/** vượt ngục / bỏ trốn: án gấp đôi */
export function escaped(s, now = Date.now()) {
  const S = lawState(s).sentence; if (!S) return;
  if (S.kind === 'jail') S.until = now + (S.until - now) * 2;
  else if (S.kind === 'mine') S.quota = (S.quota - S.mined) * 2 + S.mined;
}
export const BAIL_PER_MIN = 30 * FINE_XU; // xu / phút (120 đồng)
/** tiền chuộc phần hạn giam còn lại (xu) — null nếu không phải án giam */
export function bailCost(s, now = Date.now()) { const S = serving(s, now); return S?.kind === 'jail' ? Math.ceil((S.until - now) / 60000) * BAIL_PER_MIN : null; }
export function bail(s, now = Date.now()) {
  const c = bailCost(s, now); if (c == null || walletXu(s) < c) return false;
  spendXu(s, c); lawState(s).sentence = null; return true;
}
export const PARDON_NGOC = 300;
/** Đại Xá: nộp Ngọc thoát khổ sai vĩnh viễn (và xoá một nửa tiền án) */
export function pardon(s, wallet) {
  const L = lawState(s); if (L.sentence?.kind !== 'perma' || (wallet.ngoc || 0) < PARDON_NGOC) return false;
  wallet.ngoc -= PARDON_NGOC; L.sentence = null; L.record = L.record.slice(Math.ceil(L.record.length / 2)); return true;
}
/** id ổn định cho một công trình theo vị trí (mọi máy cùng id) */
export const structId = (x, z) => `s${Math.round(x)}:${Math.round(z)}`;
