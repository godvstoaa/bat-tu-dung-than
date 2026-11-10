// ============================================================================
//  TU LUYỆN — cảnh giới + đột phá + pháp môn (P20 — thuần JS, test Node). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §29.
//  · Cấp vẫn tính từ Phúc Khí tích lũy cả đời (progress.js). Mỗi cảnh giới có trần cấp: đủ cấp mà chưa ĐỘT PHÁ thì dừng ở
//    đỉnh cảnh giới cũ (Phúc Khí vẫn tích, không mở thêm). Đột phá cần mức Âm Đức / Nghiệp + thử thách (tĩnh tọa,
//    luận lá số, thiên kiếp). Nghiệp nặng → TÂM MA: đột phá thất bại, mất 10% Phúc Khí đang có.
//  · Người chơi cũ đã vượt cấp: giữ nguyên cảnh giới tương ứng (không lấy lại quyền đã có).
//  · Pháp môn: 11 môn × 3 tầng, học bằng Phúc Khí (tầng sau gấp đôi), hợp mệnh rẻ 50%. Không môn nào sinh ra tiền.
// ============================================================================
import { adLevel, ngLevel } from './huyenhoc.js';

export const REALMS = [
  { id: 'phamnhan', name: 'Phàm Nhân', min: 1, max: 4 },
  { id: 'luyenkhi', name: 'Luyện Khí', min: 5, max: 9, need: { ad: 1 } },
  { id: 'trucco', name: 'Trúc Cơ', min: 10, max: 14, need: { ad: 2, ng: 1, meditate: 60 } },
  { id: 'kimdan', name: 'Kim Đan', min: 15, max: 19, need: { ad: 2, ng: 1, meditate: 60, reading: true } },
  { id: 'nguyenanh', name: 'Nguyên Anh', min: 20, max: 29, need: { ad: 3, ng: 1, meditate: 90 } },
  { id: 'hoathan', name: 'Hóa Thần', min: 30, max: 39, need: { ad: 3, ng: 0, meditate: 120 } },
  { id: 'dacdao', name: 'Đắc Đạo', min: 40, max: Infinity, need: { ad: 4, ng: 0, meditate: 180, kiep: true } },
];
export function realmState(s, rawLevel) {
  if (!s.realm || typeof s.realm !== 'object') {
    // người chơi cũ: giữ cảnh giới ứng với cấp đang có (không tước quyền đã mở)
    let idx = 0; REALMS.forEach((r, i) => { if (rawLevel >= r.min) idx = i; });
    s.realm = { idx, tries: 0, last: null };
  }
  return s.realm;
}
/** cấp hiệu lực = cấp thô kẹp ở trần cảnh giới đã đột phá */
export function effectiveLevel(s, rawLevel) { const R = realmState(s, rawLevel); return Math.min(rawLevel, REALMS[R.idx].max); }
export const realmOf = (s, rawLevel) => REALMS[realmState(s, rawLevel).idx];
/** có thể thử đột phá lên cảnh giới kế không: { ok, next, missing: [lý do] } */
export function canBreak(s, L, rawLevel, ctx = {}) {
  const R = realmState(s, rawLevel), next = REALMS[R.idx + 1];
  if (!next) return { ok: false, missing: ['Đã đắc đạo.'] };
  const miss = [];
  if (rawLevel < next.min) miss.push(`cần cấp ${next.min} (đang ${rawLevel})`);
  const n = next.need || {};
  if (n.ad != null && adLevel(L) < n.ad) miss.push(`Âm Đức phải từ mức «${['Bạc Phúc', 'Bình Thường', 'Có Phúc', 'Phúc Dày', 'Đại Phúc Đức'][n.ad]}»`);
  if (n.ng != null && ngLevel(L) > n.ng) miss.push(`Nghiệp phải nhẹ hơn («${['Trong Sạch', 'Vướng Bận'][n.ng]}»)`);
  if (n.reading && !ctx.reading) miss.push('luận đúng một lá số cho khách hôm nay (giải án)');
  return { ok: !miss.length, next, missing: miss, meditate: n.meditate || 0, kiep: !!n.kiep };
}
/**
 * Đột phá (sau khi tĩnh tọa đủ giây). Nghiệp từ «Nặng Nợ» → tâm ma: thất bại, mất 10% Phúc Khí đang có.
 * Trả { ok, realm, tamma, lost }.
 */
export function breakthrough(s, L, rawLevel, ctx = {}) {
  const c = canBreak(s, L, rawLevel, ctx), R = realmState(s, rawLevel);
  const heavy = c.next?.need?.ng != null && ngLevel(L) > c.next.need.ng; // nghiệp nặng: vẫn cho thử nhưng gặp tâm ma
  const other = c.missing.filter((m) => !/^Nghiệp/.test(m));
  if (other.length) return { ok: false, missing: other };
  if ((ctx.meditated || 0) < c.meditate) return { ok: false, missing: [`tĩnh tọa đủ ${c.meditate} giây`] };
  R.tries += 1; R.last = Date.now();
  if (heavy) { const lost = Math.floor((s.phucKhi || 0) * 0.1); s.phucKhi -= lost; return { ok: false, tamma: true, lost }; }
  R.idx += 1;
  return { ok: true, realm: REALMS[R.idx] };
}

// --- pháp môn -----------------------------------------------------------------------------------------------
export const PHAP = [
  { id: 'khinhcong', branch: 'Thân pháp', name: 'Khinh Công', cost: 40, realm: 1, eff: [0.1, 0.2, 0.3], text: 'hao thể lực khi chạy −10% → −30%' },
  { id: 'ngutphong', branch: 'Thân pháp', name: 'Ngự Phong', cost: 80, realm: 2, wx: ['木', '金'], eff: [0.05, 0.1, 0.15], text: 'bay nhanh +5% → +15% (trần chung +35%)' },
  { id: 'thuythuong', branch: 'Thân pháp', name: 'Thủy Thượng Phiêu', cost: 120, realm: 2, wx: ['水'], eff: [0.15, 0.3, 0.45], text: 'đạp nước tốn thể lực giảm 15% → 45%' },
  { id: 'tichcoc', branch: 'Dưỡng sinh', name: 'Tích Cốc', cost: 50, realm: 1, wx: ['土'], eff: [0.05, 0.1, 0.15], text: 'No tụt chậm 5% → 15%' },
  { id: 'kimcuong', branch: 'Dưỡng sinh', name: 'Kim Cương Thân', cost: 60, realm: 1, eff: [0.1, 0.2, 0.3], text: 'kháng bệnh 10% → 30%' },
  { id: 'anthan', branch: 'Dưỡng sinh', name: 'An Thần', cost: 50, realm: 1, wx: ['水'], eff: [0.1, 0.2, 0.3], text: 'ngủ hồi Tỉnh +10% → +30%' },
  { id: 'thiennhan', branch: 'Mệnh thuật', name: 'Thiên Nhãn', cost: 70, realm: 2, eff: [1, 2, 3], text: 'luận quẻ / lá số sâu hơn ở các gian' },
  { id: 'vongkhi', branch: 'Mệnh thuật', name: 'Vọng Khí', cost: 70, realm: 2, wx: ['火'], eff: [1, 2, 3], text: 'thấy mức Âm Đức / Nghiệp, thấy trước sự kiện dữ' },
  { id: 'bachnghe', branch: 'Nghề', name: 'Bách Nghệ', cost: 60, realm: 1, eff: [0.1, 0.2, 0.3], text: 'tay nghề nghề hợp Dụng / Hỷ +10% → +30%' },
  { id: 'thuongdao', branch: 'Nghề', name: 'Thương Đạo', cost: 60, realm: 2, wx: ['金'], eff: [0.01, 0.02, 0.03], text: 'phí ký gửi ở chợ −1% → −3% (khi có chợ — P9)' },
  { id: 'trachphap', branch: 'Phong thủy', name: 'Trạch Pháp', cost: 50, realm: 1, eff: [5, 10, 15], text: 'điểm phong thủy nhà +5 → +15' },
];
export const PHAP_BY = Object.fromEntries(PHAP.map((p) => [p.id, p]));
export function phapState(s) { if (!s.phap || typeof s.phap !== 'object') s.phap = {}; return s.phap; }
export const phapTier = (s, id) => phapState(s)[id] | 0;
/** giá học tầng kế (Phúc Khí): gấp đôi mỗi tầng; hợp Dụng thần rẻ 50% */
export function phapCost(s, id, yongWx) { const P = PHAP_BY[id], t = phapTier(s, id); if (!P || t >= 3) return null; return Math.round(P.cost * 2 ** t * (P.wx?.includes(yongWx) ? 0.5 : 1)); }
export function learn(s, id, { yongWx, realmIdx }) {
  const P = PHAP_BY[id]; if (!P) return { ok: false, reason: 'Không có pháp môn này.' };
  if (phapTier(s, id) >= 3) return { ok: false, reason: 'Đã đạt tầng cao nhất.' };
  if ((realmIdx | 0) < P.realm) return { ok: false, reason: `Cần cảnh giới ${REALMS[P.realm].name}.` };
  const c = phapCost(s, id, yongWx);
  if ((s.phucKhi || 0) < c) return { ok: false, reason: `Cần ${c} Phúc Khí.` };
  s.phucKhi -= c; phapState(s)[id] = phapTier(s, id) + 1;
  return { ok: true, tier: phapState(s)[id], cost: c };
}
/** tác dụng hiện có của pháp môn (0 nếu chưa học) */
export const phapEff = (s, id) => { const t = phapTier(s, id); return t ? PHAP_BY[id].eff[t - 1] : 0; };
/** bay nhanh thêm từ Ngự Phong + Nguyên Anh (cộng vật cưỡi, flight.speedMul kẹp trần +35%) */
export const flyExtra = (s) => phapEff(s, 'ngutphong') + ((s.realm?.idx | 0) >= 4 ? 0.1 : 0);
