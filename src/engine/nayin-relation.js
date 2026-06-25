// ============================================================================
//  NẠP ÂM QUAN HỆ 納音關係 (4 trụ nạp âm tương quan — 納音派 cổ pháp)
//  So sánh nạp âm ngũ hành của Nhật trụ vs các trụ khác → luận ảnh hưởng:
//  生/克/同/被生/被克 → tổ nghiệp/cha mẹ/con cái đến bản mệnh thế nào.
//  Nguồn: 三命通会, 納音五行論.
// ============================================================================
import { SHENG, KE } from './constants.js';
import { nayinInfo } from './nayin.js';

const PILLAR_VI = { year: 'Trụ Năm (ổ tổ)', month: 'Trụ Tháng (cha mẹ)', day: 'Trụ Ngày (bản mệnh)', time: 'Trụ Giờ (con cái/vãn niên)' };
const REL_VI = {
  same: 'tỷ hòa (đồng hành)',
  sheng: 'sinh ra (bản mệnh nuôi dưỡng)',
  ke: 'khắc (bản mệnh kiểm soát)',
  shengBy: 'được sinh (được nuôi dưỡng)',
  keBy: 'bị khắc (bị kiểm soát)',
};
const REL_NOTE = {
  same: 'cùng bản tính → hài hoà tự nhiên',
  sheng: 'bản mệnh hao tốn cho bên kia → hao nhưng tốt cho người được sinh',
  ke: 'bản mệnh kiểm soát bên kia → chủ động nhưng dễ mệt mỏi',
  shengBy: 'được bên kia nuôi dưỡng → nhận được hỗ trợ, ấm no',
  keBy: 'bị bên kia kiểm soát → áp lực, cần nỗ lực vượt qua',
};

function relOf(a, b) {
  if (a === b) return 'same';
  if (SHENG[a] === b) return 'sheng';
  if (KE[a] === b) return 'ke';
  if (SHENG[b] === a) return 'shengBy';
  if (KE[b] === a) return 'keBy';
  return '';
}

/**
 * @returns {{ dayNayin, dayWx, pairs:[day-centric], pairsAll:[6 cặp lục thân], summary }}
 */
export function nayinRelations(chart) {
  // Lấy nạp âm ngũ hành của từng trụ
  const wxOf = (pillar) => {
    const ni = nayinInfo(pillar.nayin);
    return ni?.wx || (pillar.nayin || '').slice(-1); // fallback: ký tự cuối = hành
  };
  const dayWx = wxOf(chart.pillars.day);
  // [loop 106 elevate] helper chung cho 1 cặp trụ bất kỳ
  const pair = (a, b) => {
    const aWx = wxOf(chart.pillars[a]), bWx = wxOf(chart.pillars[b]);
    const rel = relOf(aWx, bWx);
    if (!rel) return null;
    return {
      from: a, to: b, fromVi: PILLAR_VI[a], toVi: PILLAR_VI[b],
      rel, relVi: REL_VI[rel], note: REL_NOTE[rel],
      fromNayin: chart.pillars[a].nayin, toNayin: chart.pillars[b].nayin,
      fromWx: aWx, toWx: bWx,
    };
  };
  // day-centric (backward compat)
  const pairs = ['year', 'month', 'time'].map((k) => pair('day', k)).filter(Boolean);
  // [loop 106] ALL 6 cặp lục thân (tổ×cha mẹ, tổ×bản, tổ×con, cha mẹ×bản, cha mẹ×con, bản×con)
  const KEYS = ['year', 'month', 'day', 'time'];
  const pairsAll = [];
  for (let i = 0; i < KEYS.length; i++) for (let j = i + 1; j < KEYS.length; j++) {
    const p = pair(KEYS[i], KEYS[j]);
    if (p) pairsAll.push(p);
  }
  // summary: nhóm theo loại quan hệ (sinh/khắc/đồng) → bức tranh nạp âm toàn cục
  const cnt = { same: 0, sheng: 0, ke: 0, shengBy: 0, keBy: 0 };
  pairsAll.forEach((p) => { cnt[p.rel] = (cnt[p.rel] || 0) + 1; });
  const summary = `Nạp âm 4 trụ (${pairsAll.length} cặp): ` +
    (cnt.same ? `${cnt.same} tỷ hòa (hài hoà), ` : '') +
    (cnt.sheng + cnt.shengBy ? `${cnt.sheng + cnt.shengBy} tương sinh (nuôi dưỡng), ` : '') +
    (cnt.ke + cnt.keBy ? `${cnt.ke + cnt.keBy} tương khắc (xung đột), ` : '') +
    `${pairsAll.filter((p) => p.rel === 'ke' || p.rel === 'keBy').map((p) => `${p.fromVi.split('(')[0]}×${p.toVi.split('(')[0]}`).join('; ') || 'không khắc'}.`;
  return { dayNayin: chart.pillars.day.nayin, dayWx, pairs, pairsAll, summary };
}

export { REL_VI, REL_NOTE };
