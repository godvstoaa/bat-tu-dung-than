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
 * @returns {{ dayNayin, pairs:[{from, to, fromVi, toVi, rel, relVi, note, fromNayin, toNayin }] }}
 */
export function nayinRelations(chart) {
  // Lấy nạp âm ngũ hành của từng trụ
  const wxOf = (pillar) => {
    const ni = nayinInfo(pillar.nayin);
    return ni?.wx || (pillar.nayin || '').slice(-1); // fallback: ký tự cuối = hành
  };
  const dayWx = wxOf(chart.pillars.day);
  const out = [];
  for (const key of ['year', 'month', 'time']) {
    const otherWx = wxOf(chart.pillars[key]);
    const rel = relOf(dayWx, otherWx);
    if (rel) {
      out.push({
        from: 'day', to: key,
        fromVi: PILLAR_VI.day, toVi: PILLAR_VI[key],
        rel, relVi: REL_VI[rel], note: REL_NOTE[rel],
        fromNayin: chart.pillars.day.nayin, toNayin: chart.pillars[key].nayin,
        fromWx: dayWx, toWx: otherWx,
      });
    }
  }
  return { dayNayin: chart.pillars.day.nayin, dayWx, pairs: out };
}

export { REL_VI, REL_NOTE };
