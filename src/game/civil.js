// ============================================================================
//  HỘ TỊCH — HÔN NHÂN & LY HÔN (P12 — thuần). Đặc tả §12.
//  · Một vợ một chồng (máy chủ giữ ràng buộc), chỉ tài khoản đăng nhập. Cầu hôn bằng cụm từ soạn sẵn + thẻ xác nhận.
//  · Ba hạng lễ: Hàn vi 60 đồng · Trung lưu 600 + thuê sảnh 2 lượng · Thượng lưu 5 lượng + 0,5% tài sản hai bên + thuyền hoa 30 lượng.
//    Không có cơ chế mừng tiền (kênh chuyển tiền khó kiểm).
//  · Quỹ chung (Trung lưu trở lên): mỗi khoản góp ghi tên người góp → ly hôn chia theo TỈ LỆ GÓP, không 50/50.
//    Thượng lưu: phí hôn sản 20 đồng / ngày khi quỹ có tiền.
//  · Ly hôn: thuận tình 2% quỹ (tối thiểu 200 đồng), chờ 72 giờ; đơn phương 4% (tối thiểu 400), chờ 7 ngày — người nộp trả.
//  · Tái hôn: chờ 30 ngày sau ly hôn; tối đa 3 lần kết hôn / 365 ngày. Đang ly hôn dở thì không cưới được.
// ============================================================================
export const H = 3600000, D = 86400000;
export const TIERS = {
  hanvi: { name: 'Hàn vi', fee: 60, extra: 0, assetPct: 0, fund: false, buffDays: 0, upkeep: 0, text: 'Hôn thư; hai người tự ăn chung một bữa ở quầy cơm.' },
  trungluu: { name: 'Trung lưu', fee: 600, extra: 2000, assetPct: 0, fund: true, buffDays: 7, upkeep: 0, text: 'Tiệc sảnh tửu lâu · «Hỷ khí» 7 ngày (ngủ hồi Tỉnh +10%, làm việc đỡ hao 5%) · quỹ chung.' },
  thuongluu: { name: 'Thượng lưu', fee: 5000, extra: 30000, assetPct: 0.005, fund: true, buffDays: 7, upkeep: 20, title: 'Phu thê', text: 'Thuyền hoa hồ Cùng Thông · danh hiệu «Phu thê» · danh vọng kinh doanh +10 · quỹ chung (phí hôn sản 20 đồng / ngày).' },
};
export const PHRASES = ['Nguyện cùng nhau đi hết đường đời — người có bằng lòng không?', 'Trăng Huyền Thành chứng giám, ta muốn kết tóc se duyên cùng người.', 'Một đời một kiếp, xin người nhận lấy tấm lòng này.'];
export const WAIT_REMARRY = 30 * D, MAX_YEAR = 3, PROPOSAL_MS = 3 * D;

export const civOf = (p) => (p.civ = p.civ || { mid: null, last: 0, wed: [] });
/** chi phí đăng ký + tổ chức theo hạng (đồng) — assets = tổng tài sản hai bên (đồng) */
export const cost = (tier, assets = 0) => { const T = TIERS[tier]; return T ? Math.round(T.fee + T.extra + T.assetPct * Math.max(0, assets)) : null; };

/** có thể kết hôn không — trả lý do (string) hoặc null */
export function blocker(p, now = Date.now()) {
  const c = civOf(p);
  if (c.mid) return 'đang có hôn thú (hoặc đang ly hôn dở)';
  if (c.last && now - c.last < WAIT_REMARRY) return `vừa ly hôn — chờ thêm ${Math.ceil((WAIT_REMARRY - (now - c.last)) / D)} ngày`;
  if ((c.wed || []).filter((t) => now - t < 365 * D).length >= MAX_YEAR) return 'đã kết hôn 3 lần trong 365 ngày';
  return null;
}
export function newMarriage(id, a, b, tier, now = Date.now()) {
  return { id, a, b, tier, since: now, fund: 0, by: { [a]: 0, [b]: 0 }, status: 'REGISTERED', div: null, upkeepDay: null };
}
/** góp vào quỹ chung (xu) */
export function contribute(m, u, xu) {
  if (!TIERS[m.tier].fund) return { ok: false, err: 'Hạng Hàn vi không có quỹ chung (nâng hạng lễ để mở).' };
  if (m.status !== 'REGISTERED') return { ok: false, err: 'Hôn thú không còn hiệu lực.' };
  m.fund += xu; m.by[u] = (m.by[u] || 0) + xu; return { ok: true, fund: m.fund };
}
/** rút từ quỹ chung: trừ theo tỉ lệ góp (để khi chia vẫn đúng tỉ lệ) */
export function withdraw(m, xu) {
  if (xu > m.fund) return { ok: false, err: 'Quỹ chung không đủ.' };
  const tot = Object.values(m.by).reduce((a, b) => a + b, 0) || 1;
  for (const k of Object.keys(m.by)) m.by[k] = Math.max(0, m.by[k] - Math.round((xu * m.by[k]) / tot));
  m.fund -= xu; return { ok: true, fund: m.fund };
}
/** phí hôn sản Thượng lưu: 20 đồng / ngày khi quỹ có tiền — trừ thẳng quỹ (theo tỉ lệ góp) */
export function upkeep(m, day) {
  const T = TIERS[m.tier]; if (!T.upkeep || !m.fund || m.upkeepDay === day) return 0;
  const k = m.upkeepDay ? Math.max(1, Math.round((Date.parse(day) - Date.parse(m.upkeepDay)) / D)) : 1;
  const fee = Math.min(m.fund, T.upkeep * 100 * k); withdraw(m, fee); m.upkeepDay = day; return fee;
}
/** nộp đơn ly hôn — mutual = bên kia đã đồng ý; trả án phí (xu) người nộp phải trả */
export function fileDivorce(m, by, mutual, now = Date.now()) {
  if (m.status !== 'REGISTERED') return { ok: false, err: 'Không có hôn thú để ly hôn.' };
  const pct = mutual ? 0.02 : 0.04, min = mutual ? 200 : 400;
  const fee = Math.max(min * 100, Math.round(m.fund * pct));
  m.status = 'DIVORCING'; m.div = { by, mutual, at: now, until: now + (mutual ? 72 * H : 7 * D), fee };
  return { ok: true, fee, until: m.div.until };
}
export function withdrawDivorce(m, u) {
  if (m.status !== 'DIVORCING' || m.div.by !== u) return { ok: false, err: 'Không có đơn của bạn để rút.' };
  m.status = 'REGISTERED'; m.div = null; return { ok: true };
}
/** chia quỹ theo tỉ lệ góp khi hết thời gian chờ → { [u]: xu } */
export function finalize(m, now = Date.now()) {
  if (m.status !== 'DIVORCING' || now < m.div.until) return null;
  const tot = Object.values(m.by).reduce((a, b) => a + b, 0), out = {};
  for (const u of [m.a, m.b]) out[u] = tot ? Math.floor((m.fund * (m.by[u] || 0)) / tot) : Math.floor(m.fund / 2);
  m.fund = 0; m.status = 'DISSOLVED'; m.ended = now;
  return out;
}
/** «xem hợp tuổi vui» bằng hành Dụng thần hai người (không dùng ngày sinh) */
export function funMatch(wa, wb) {
  const SINH = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  if (!wa || !wb) return 'Bà mai cười: «Chưa biết hành của hai người, cứ thương nhau là được.»';
  if (wa === wb) return 'Đồng hành tương trợ — hai người hiểu nhau không cần nói nhiều.';
  if (SINH[wa] === wb || SINH[wb] === wa) return 'Tương sinh — người này nâng đỡ người kia, duyên thuận.';
  return 'Tương khắc nhẹ — hay tranh luận, nhưng có tranh mới có tiến. (Chỉ là trò vui, đừng tin quá!)';
}
