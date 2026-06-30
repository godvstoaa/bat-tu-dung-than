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
import { CHANGSHENG_VI, WX_VI, ZHI } from './constants.js';

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
 * Timeline 12 trường sinh qua các LƯU NIÊN (10 năm của đại vận đang hành).
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

// [loop 83 — TÍNH NĂNG MỚI] Dương can đại diện mỗi ngũ hành (cho 用神 + Hỷ thần 长生).
const YANG_STEM_OF_WX = { 木: '甲', 火: '丙', 土: '戊', 金: '庚', 水: '壬' };

/**
 * [loop 83] DỤNG THẦN thập nhị trường sinh — sinh khí của DỤNG HÀNH qua đại vận.
 *   Khác loop 77 (Nhật Chủ = «thân»): đây là sinh khí của «DỤNG» (hành giúp mệnh).
 *   «用神在长生/临官/帝旺 = Dụng vượng → phát huy tốt; 在死/墓/绝 = Dụng suy → khó phát».
 *   Tổ hợp với 日主 12 trường sinh: 日主ĐếVượng + DụngTrườngSinh = vận ĐỈNH (thân + dụng đều mạnh).
 * @param {string} yongWx — hành Dụng Thần (R.yong.primary)
 * @param {string} xiWx  — hành Hỷ Thần (R.yong.xi, tuỳ chọn)
 * @param {array}  dayun — R.dayun
 * @returns {{ yongWx, items, dungStrong, dungWeak, summary }}
 */
export function dayunYongChangSheng(yongWx, xiWx, dayun) {
  const stem = YANG_STEM_OF_WX[yongWx] || '甲';
  const items = (dayun || []).map((d) => {
    if (!d || !d.zhi) return null;
    const si = stageInfo(stem, d.zhi);
    return { ganZhi: d.ganZhi, zhi: d.zhi, startAge: d.startAge, label: `${d.startAge}t`, ...si };
  }).filter(Boolean);
  // Dụng mạnh: 長生/冠帶/臨官/帝旺 (dương khí Dụng lên). Dụng suy: 死/墓/絕.
  const dungStrong = items.filter((i) => ['長生', '冠帶', '臨官', '帝旺'].includes(i.stage));
  const dungWeak = items.filter((i) => ['死', '墓', '絕'].includes(i.stage));
  const fmt = (arr) => arr.map((p) => `${p.label}(${p.ganZhi}/${p.stageVi})`).join(', ');
  let summary = `Dụng Thần (${yongWx ? WX_VI[yongWx] : '?'}) sinh khí qua đại vận: `;
  if (dungStrong.length) summary += `DỤNG VƯỢNG (Trường Sinh/Quan Đới/Lâm Quan/Đế Vượng — Dụng phát huy tốt) ở ${fmt(dungStrong)}. `;
  if (dungWeak.length) summary += `Dụng SUY (Tử/Mộ/Tuyệt — Dụng khó phát, cần nỗ lực/bù ngoài) ở ${fmt(dungWeak)}. `;
  summary += `Nguyên lý: «用神旺相, 其福必厚» — đại vận Dụng vượng = vận thật sự tốt (dù Nhật Chủ có thể không đỉnh).`;
  return { yongWx, xiWx, items, dungStrong, dungWeak, summary };
}

export { STAGE, TONE_VI };

// [loop 1080] CANONICAL 十二長生 SINH KHÍ weights — «运好不如运旺»: vận/năm Dụng cát
//   NHƯNG rơi 死/墓/绝 → sinh khí kém, Dụng khó phát huy; 帝旺/臨官 → khuếch đại.
//   Dùng chung cho rankDayun (đại vận) LẪN analyzeLiunianDeep (lưu niên) — 1 nguồn.
//   Nguồn: 滴天髓 «运逢长生如苗逢春, 运逢帝旺如日中天, 运逢墓绝如秋冬».
//   Cân đối: 帝旺=đỉnh nhưng quá vượng dễ kiêu → +8; 墓=kho thu nạp → nhẹ hơn 死/绝.
export const STAGE_WEIGHT = {
  '帝旺': 8, '臨官': 8, '長生': 6, '冠帶': 5,
  '衰': -3, '病': -5, '死': -6, '墓': -4, '絕': -7,
  '沐浴': 0, '胎': 0, '養': 0,
};
export const STAGE_VI = {
  '長生': 'Trường Sinh', '沐浴': 'Mộc Dục', '冠帶': 'Quan Đới', '臨官': 'Lâm Quan',
  '帝旺': 'Đế Vượng', '衰': 'Suy', '病': 'Bệnh', '死': 'Tử', '墓': 'Mộ',
  '絕': 'Tuyệt', '胎': 'Thai', '養': 'Dưỡng',
};

// [loop 87 — TÍNH NĂNG MỚI] LƯU NGUYỆT thập nhị trường sinh — tháng nào trong năm
//   Nhật Chủ mạnh (长生/帝旺) vs yếu (死/绝). Đây là NHỊP NĂNG LƯỢNG THÁNG cố định
//   (12 chi tiết khí = 12 tháng: 寅=T1立春...丑=T12小寒), mỗi chi → 1 stage.
//   Hoàn thiện bộ 12 trường sinh 4 cấp: 大运(77)/流年(78)/用神(83)/流月(87).
//   Khác 得令 (chỉ tháng sinh): đây là CẢ 12 tháng — «lịch năng lượng cá nhân».
const MONTH_ZH_LY = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
export function liuyueChangSheng(dayGan) {
  const items = MONTH_ZH_LY.map((zhi, i) => {
    const si = stageInfo(dayGan, zhi);
    return { m: i, mLabel: `T${i + 1}`, zhi, zhiVi: ZHI[zhi]?.vi || zhi, label: `T${i + 1}(${ZHI[zhi]?.vi || zhi})`, ...si };
  });
  const { peak, rising, low } = _classify(items);
  const fmt = (arr) => arr.map((p) => p.label.split('(')[0]).join(', ');
  let summary = `Nhịp năng lượng 12 tháng của Nhật Chủ: `;
  summary += peak.length ? `tháng MẠNH (Lâm Quan/Đế Vượng) = ${fmt(peak)}` : `không có tháng Đế Vượng/Lâm Quan`;
  if (rising.length) summary += `; tháng ĐANG LÊN (Trường Sinh/Quan Đới) = ${fmt(rising)}`;
  if (low.length) summary += `; tháng YẾU (Tử/Mộ/Tuyệt) = ${fmt(low)}`;
  summary += `. Đây là «lịch năng lượng cá nhân» — tháng mạnh nên tiến thủ, tháng yếu nên thủ/bồi bổ.`;
  return { items, peak, rising, low, summary };
}
