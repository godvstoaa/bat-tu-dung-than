// ============================================================================
//  大運十二長生運 — TIMELINE 12 TRƯỜNG SINH của Nhật Chủ qua từng đại vận
//  «运逢长生如苗逢春, 运逢帝旺如日中天, 运逢墓绝如秋冬» (滴天髓).
//  Mỗi đại vận → Nhật Chủ ở giai đoạn nào của vòng 12長生 → đo SINH KHÍ vận:
//    長生/冠帶/臨官/帝旺 = vận KHỞI/THỊNH (dương khí lên → thuận tiến);
//    衰/病/死/墓/絕    = vận SUY/TRẦM (dương khí xuống → thủ/bảo toàn);
//    沐浴/胎/養        = vận CHUYỂN (dao động/ươm mầm).
//  * Dương can thuận hành, âm can nghịch hành (core.js changSheng đã xử lý).
//  * Đây là CHIỀU CỔ PHÁP song song ngũ hành Dụng: đại vận Dụng cát NHƯNG nếu
//    rơi vào 死/墓/絝 → sinh khí vận kém, Dụng khó phát huy («运好不如运旺»).
//  Nguồn: 滴天髓 论运, 渊海子平 十二长生, 三命通会 卷二.
// ============================================================================
import { changSheng } from './core.js';
import { CHANGSHENG_VI } from './constants.js';

// Giai đoạn → tone + diễn giải. Tone: cat (dương khí lên) / hung (xuống) / neutral (chuyển).
const STAGE = {
  '長生': { vi: 'Trường Sinh', tone: 'cat', desc: 'vận khởi — như mầm mọc, sinh khí dồi dào, khởi sự/khai mới thuận («运逢长生如苗逢春»)' },
  '沐浴': { vi: 'Mộc Dục', tone: 'neutral', desc: 'thanh tẩy — dễ dao động, đào hoa/thị phi nhẹ, cẩn thận cám dỗ («桃花运» nhẹ)' },
  '冠帶': { vi: 'Quan Đới', tone: 'cat', desc: 'trưởng thành — danh vọng phát triển, vận tiến, «加官进爵»' },
  '臨官': { vi: 'Lâm Quan', tone: 'cat', desc: 'đỉnh sự nghiệp — thịnh vượng, quyền lực (建祿 vị, «日禄归时»)' },
  '帝旺': { vi: 'Đế Vượng', tone: 'cat', desc: 'vượng cực — đỉnh cao nhất, thịnh đến cực (cần khiêm nhường, quá vượng dễ kiêu tú)' },
  '衰': { vi: 'Suy', tone: 'hung', desc: 'bắt đầu suy — vận giảm dần, nên thủ không tiến, tiết kiệm năng lượng' },
  '病': { vi: 'Bệnh', tone: 'hung', desc: 'trở ngại — sức khoẻ/sự nghiệp có «bệnh», cẩn thận, tránh liều' },
  '死': { vi: 'Tử', tone: 'hung', desc: 'đình trệ — vận tĩnh, khó tiến, nên bảo toàn, chờ thời' },
  '墓': { vi: 'Mộ', tone: 'hung', desc: 'nhập mộ — tích trữ/ẩn mình, vận trầm («mộ» = kho, thu nạp được thì không xấu)' },
  '絕': { vi: 'Tuyệt', tone: 'hung', desc: 'tuyệt — sinh khí hết sạch, thấp nhất («tuyệt xử phùng sinh» có chuyển cơ, sắp lên)' },
  '胎': { vi: 'Thai', tone: 'neutral', desc: 'ươm mầm — vận ươm hạt giống mới, chuẩn bị, tiềm năng' },
  '養': { vi: 'Dưỡng', tone: 'neutral', desc: 'dưỡng — nuôi dưỡng, hồi phục, tích lũy cho vận tới' },
};

const TONE_VI = { cat: 'THỊNH (dương khí lên)', hung: 'SUY/TRẦM (dương khí xuống)', neutral: 'CHUYỂN (dao động/ươm)' };

// [loop 78] helper chung: stage + info cho 1 chi.
function stageInfo(dayGan, zhi) {
  const stage = changSheng(dayGan, zhi);
  const info = STAGE[stage] || { vi: CHANGSHENG_VI[stage] || stage, tone: 'neutral', desc: '' };
  return { stage, stageVi: info.vi, tone: info.tone, toneVi: TONE_VI[info.tone], desc: info.desc };
}

// Phân loại + summary dùng chung.
function _classify(items) {
  const peak = items.filter((i) => i.stage === '臨官' || i.stage === '帝旺');
  const rising = items.filter((i) => i.stage === '長生' || i.stage === '冠帶');
  const low = items.filter((i) => i.stage === '死' || i.stage === '墓' || i.stage === '絕');
  return { peak, rising, low };
}
function _summary(items, unit) {
  const { peak, rising, low } = _classify(items);
  const fmt = (arr) => arr.map((p) => `${p.label}(${p.ganZhi}/${p.stageVi})`).join(', ');
  let s;
  if (peak.length) s = `ĐỈNH (Lâm Quan/Đế Vượng — thịnh nhất) rơi vào ${unit} ${fmt(peak)}.`;
  else if (rising.length) s = `${unit === 'đại vận' ? 'Vận' : 'Năm'} ĐANG LÊN (Trường Sinh/Quan Đới): ${fmt(rising)}.`;
  else s = `${unit} trải: ${items.map((i) => i.stageVi).join(' → ')}.`;
  if (rising.length && peak.length) s += ` Khởi: ${fmt(rising)}.`;
  if (low.length) s += ` SUY/TRẦM (Tử/Mộ/Tuyệt — thủ/bảo toàn): ${fmt(low)}.`;
  return s;
}

/**
 * Timeline 12 trường sinh qua các ĐẠI VẬN (loop 77).
 */
export function dayunChangSheng(dayGan, dayun) {
  const items = (dayun || []).map((d) => {
    if (!d || !d.zhi) return null;
    const si = stageInfo(dayGan, d.zhi);
    return { ganZhi: d.ganZhi, zhi: d.zhi, startAge: d.startAge, startYear: d.startYear, label: `${d.startAge}t`, ...si };
  }).filter(Boolean);
  const { peak, rising, low } = _classify(items);
  return { items, peak, rising, low, summary: _summary(items, 'đại vận') + ` «运好不如运旺».` };
}

/**
 * [loop 78] Timeline 12 trường sinh qua các LƯU NIÊN (10 năm của đại vận đang hành).
 *   «年逢长生如春起, 年逢帝旺如日中天, 年逢墓绝如秋冬» — sinh khí TỪNG NĂM.
 *   Tổ hợp với đại vận: «年长生 + 运帝旺» = năm khởi + vận đỉnh = cực thuận;
 *   «年绝 + 运死» = năm + vận đều suy = cần thủ.
 * @param {string} dayGan
 * @param {array}  liunian — R.liunian (mỗi entry có ganZhi, zhi, year, age, ...)
 * @returns {{ items, peak, rising, low, nowStage, summary }}
 */
export function liunianChangSheng(dayGan, liunian) {
  const items = (liunian || []).map((d) => {
    if (!d || !d.zhi) return null;
    const si = stageInfo(dayGan, d.zhi);
    return { ganZhi: d.ganZhi, zhi: d.zhi, year: d.year, age: d.age, isNow: !!d.isNow, label: `${d.year}`, ...si };
  }).filter(Boolean);
  const { peak, rising, low } = _classify(items);
  const nowStage = items.find((i) => i.isNow) || null;
  let summary = _summary(items, 'năm');
  if (nowStage) summary += ` Năm nay (${nowStage.year}): ${nowStage.stageVi} (${nowStage.toneVi}).`;
  return { items, peak, rising, low, nowStage, summary };
}

export { STAGE, TONE_VI };
