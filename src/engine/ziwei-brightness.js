// ============================================================================
//  紫微 星曜庙旺平陷 — ĐỘ SÁNG SAO (庙旺得利平闲陷) trong từng cung
//  "Sao này ở cung đó MẠNH hay YẾU?" — Ý nghĩa sao ĐỔI HẲN theo độ sáng cung.
//  * Cấp độ (từ mạnh→yếu): 庙(miếu, mạnh nhất, ưu điểm phóng đại) > 旺(vượng) >
//    得(đắc) > 利(lợi) > 平(bình) > 闲(nhàn, yếu, hưu tiếu) > 陷(hãm, ưu điểm
//    khó phát, có thể đảo nghịch nghĩa — "nhập miếu bất tất cát, thất hãm bất tất hung").
//  * Cốt lõi: cùng 1 sao, ở miếu = quý, ở hãm = suy; cát tinh hãm thì cát giảm,
//    hung tinh miếu thì hung thành uy. Đặc biệt 太阳/太阴phụ thuộc sáng-tối
//    (ban ngày vs ban đêm) — Thái Dương hãm = như Thái Âm, Thái Âm miếu = như Thái Dương.
//  * Khác ziwei.js (đặt sao): module này = ĐỘ SÁNG (lực) của sao tại cung đó.
//  Nguồn: 令东来 星曜庙旺平陷表 (xuanmen.com.cn, 14 chính diệu).
// ============================================================================
import { STARS_14 } from './ziwei-stars.js';

// 14 chính diệu × 12 chi (cột: 子丑寅卯辰巳午未申酉戌亥). [cycle 56] verify toàn bảng theo
//   《紫微斗数全书》 terse lines (令东来表 chép sai ~50 ô). 4 sao VÔ HÃM (紫微/武曲/七杀/天府)
//   tuyệt đối không có 陷 — guard ở selftest. Nguồn: 全书 卷三 + cross-check 令东来/取象派.
export const BRIGHTNESS = {
  紫微: ['平', '庙', '旺', '旺', '平', '旺', '庙', '庙', '旺', '旺', '平', '旺'], // 庙丑未午·旺寅申卯酉巳亥·平子·无陷
  天机: ['庙', '陷', '平', '旺', '庙', '平', '庙', '陷', '平', '旺', '庙', '平'], // 庙子午辰戌·旺卯酉·陷丑未
  太阳: ['陷', '陷', '旺', '庙', '庙', '庙', '庙', '旺', '平', '平', '陷', '陷'], // 庙卯辰巳午·寅旺·陷子丑戌亥
  武曲: ['旺', '庙', '平', '平', '庙', '平', '旺', '庙', '平', '平', '庙', '平'], // 庙辰戌丑未·旺子午·平巳亥·无陷
  天同: ['旺', '平', '平', '平', '平', '庙', '陷', '平', '旺', '平', '平', '庙'], // 庙巳亥·旺子申·陷午
  廉贞: ['平', '利', '庙', '平', '利', '陷', '平', '利', '庙', '平', '利', '陷'], // 庙寅申·利辰戌丑未·陷巳亥
  天府: ['庙', '庙', '庙', '地', '庙', '地', '旺', '庙', '地', '旺', '庙', '地'], // 庙子丑未寅辰戌·旺午酉·地卯巳申亥·无陷
  太阴: ['庙', '庙', '陷', '陷', '陷', '陷', '陷', '旺', '旺', '庙', '庙', '庙'], // 庙酉戌亥子丑·旺申未·陷卯辰巳午
  贪狼: ['旺', '庙', '平', '平', '庙', '陷', '旺', '庙', '平', '平', '庙', '陷'], // 庙辰戌丑未·旺子午·陷巳亥
  巨门: ['旺', '平', '庙', '庙', '陷', '旺', '旺', '平', '庙', '庙', '陷', '旺'], // 庙寅申卯酉·旺子午巳亥·陷辰戌
  天相: ['庙', '庙', '庙', '陷', '地', '地', '庙', '地', '庙', '陷', '地', '地'], // 庙子午丑寅申·地辰戌巳亥未·陷卯酉
  天梁: ['庙', '旺', '庙', '地', '庙', '陷', '庙', '旺', '陷', '平', '地', '陷'], // 庙子午寅辰·旺丑未·地卯戌·陷巳亥申
  七杀: ['旺', '庙', '庙', '旺', '庙', '平', '旺', '庙', '庙', '旺', '庙', '平'], // 庙辰戌丑未寅申·旺子午卯酉·平巳亥·无陷
  破军: ['庙', '旺', '平', '陷', '旺', '平', '庙', '旺', '平', '陷', '旺', '平'], // 庙子午·旺辰戌丑未·陷卯酉
};

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const SCORE = { 庙: 3, 旺: 2, 得: 1.5, 利: 1, 平: 0, 闲: -0.5, 陷: -1.5 };
const STATE_VI = { 庙: 'Miếu', 旺: 'Vượng', 得: 'Đắc', 利: 'Lợi', 平: 'Bình', 闲: 'Nhàn', 陷: 'Hãm' };
const STATE_NOTE = {
  庙: 'mạnh nhất — ưu điểm phóng đại, khuyết điểm giảm, địa vị xã hội cao',
  旺: 'mạnh — sức sao phát huy tốt',
  得: 'khá mạnh — lực bình thường tốt',
  利: 'trung bình khá',
  平: 'trung bình — đặc tính sao không nổi',
  闲: 'yếu — lực không mạnh, ích kỷ hưu tiếu, ít tiến thủ',
  陷: 'hãm — ưu điểm khó phát, KHÔNG nhất thiết hung nhưng dễ đảo nghịch',
};

/** Trạng thái sáng + điểm của 1 sao tại 1 chi. */
export function starBrightness(star, zhi) {
  const row = BRIGHTNESS[star];
  if (!row) return { state: '?', score: 0, vi: '?', note: '' };
  const idx = ZHI_ORDER.indexOf(zhi);
  if (idx < 0) return { state: '?', score: 0, vi: '?', note: '' };
  const state = row[idx];
  return { state, score: SCORE[state] ?? 0, vi: STATE_VI[state] || state, note: STATE_NOTE[state] || '' };
}

/**
 * Độ sáng toàn bộ chính diệu trong mệnh bàn.
 * @returns {{ items:[{star,zhi,palaceVi,state,vi,score,note}], strong:[], weak[], summary }}
 */
export function analyzeZiweiBrightness(zr) {
  const items = [];
  for (const p of zr.palaces) {
    for (const star of (p.stars || [])) {
      if (!BRIGHTNESS[star]) continue;
      const b = starBrightness(star, p.zhi);
      items.push({ star, starVi: STARS_14[star]?.vi || star, zhi: p.zhi, palaceVi: p.vi, ...b });
    }
  }
  const strong = items.filter((i) => i.state === '庙' || i.state === '旺').sort((a, b) => b.score - a.score);
  const weak = items.filter((i) => i.state === '陷' || i.state === '闲').sort((a, b) => a.score - b.score);
  // sao MỆNH cung quan trọng nhất
  const ming = zr.palaces.find((p) => p.isMing);
  const mingStars = items.filter((i) => i.palaceVi === ming?.vi);

  let summary;
  if (!items.length) {
    summary = '(không có chính diệu để xét độ sáng)';
  } else {
    summary = `Chính diệu: ${strong.length} sao miếu/vượng (mạnh: ${strong.slice(0, 3).map((s) => s.star + '@' + s.vi).join(', ') || 'không'})` +
      `${weak.length ? '; ' + weak.length + ' sao hãm/nhàn (yếu: ' + weak.slice(0, 3).map((s) => s.star + '@' + s.vi).join(', ') + ')' : ''}. `;
    if (mingStars.length) summary += `Mệnh cung (${ming.vi}): ${mingStars.map((s) => s.star + '=' + s.vi).join(', ')} → ${mingStars[0].score >= 1.5 ? 'sao MỆNH SÁNG → bản mệnh vững, hiển đạt' : mingStars[0].score <= -1 ? 'sao mệnh hãm → bản mệnh gian nan, cần cát tinh/phụ trợ' : 'sao mệnh trung bình'}.`;
  }
  return { items, strong, weak, mingStars, summary };
}
