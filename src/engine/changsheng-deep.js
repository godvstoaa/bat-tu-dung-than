// ============================================================================
//  THẬP NHỊ TRƯỜNG SINH 十二长生 — ý nghĩa sâu từng giai đoạn cho 4 trụ
//  Mỗi trụ → trường sinh của Nhật Chủ tại chi đó → năng lượng trụ đó.
//  Vd: 日主 tại 月支 = 帝旺 → "đắc lệnh" cực vượng; tại 绝 → "tuyệt địa" cực nhược.
//  Nguồn: 滴天髓, 三命通会 (trường sinh luận).
// ============================================================================
import { TEN_GOD_VI } from './constants.js';
import { changSheng } from './core.js';

export const STAGE_MEANING = {
  長生: {
    vi: 'Trường Sinh', phase: 'sinh', luck: 'cát',
    meaning: 'Như trẻ sơ sinh — sức sống dồi dào, khởi đầu mới, tiềm năng lớn; phát triển, học hỏi, năng động. Trụ mang trường sinh = nền tảng vững, muộn phát bền.',
    area: 'phù hợp khởi sự, học tập, xây nền',
  },
  沐浴: {
    vi: 'Mộc Dục', phase: 'sắc', luck: 'volatile',
    meaning: 'Như tắm rửa — lãng mạn, hưởng thụ, đào hoa; cẩn thận sa ngã, tẩu hoa, dễ ảnh hưởng bởi sắc dục/tình cảm. Trụ mang mộc dục = duyên nhưng biến động tình cảm.',
    area: 'lưu ý tình cảm/đào hoa, tránh sa đọa',
  },
  冠帶: {
    vi: 'Quan Đới', phase: 'trưởng thành', luck: 'cát',
    meaning: 'Như đội mũ trưởng thành — bước vào xã hội, có địa vị/danh tiếng; tự tin, ngoại giao. Trụ mang quan đới = có thể diện, được công nhận.',
    area: 'xây dựng danh tiếng, ngoại giao, sự nghiệp',
  },
  臨官: {
    vi: 'Lâm Quan', phase: 'đỉnh đầu', luck: 'cát',
    meaning: 'Như đỗ đạt ra làm quan — tự chủ, độc lập, năng lực trưởng thành; Lâm Quan = Lộc (lương thực). Trụ mang lâm quan = tự lực, ổn định tài chính.',
    area: 'sự nghiệp độc lập, tài lộc ổn định',
  },
  帝旺: {
    vi: 'Đế Vượng', phase: 'cực đỉnh', luck: 'volatile',
    meaning: 'Như hoàng đế tại đỉnh — cực thịnh, quyền lực tối cao; nhưng thịnh cực t sản suy, dễ kiêu ngạo. Trụ mang đế vượng = cực vượng, cẩn thận thái quá.',
    area: 'đỉnh cao quyền lực nhưng kỵ kiêu ngạo — Dương Nhận ở đây',
  },
  衰: {
    vi: 'Suy', phase: 'bắt đầu suy', luck: 'bình',
    meaning: 'Như người bước vào tuổi già — suy giảm dần, cần bảo tồn; không mạnh không yếu, bình ổn giảm. Trụ mang suy = giai đoạn cần tiết chế.',
    area: 'giữ gìn, bảo tồn, đừng mở rộng quá',
  },
  病: {
    vi: 'Bệnh', phase: 'yếu', luck: 'hung nhẹ',
    meaning: 'Như người bệnh — suy yếu, cần chữa trị; cẩn thận sức khoẻ, tài chính. Trụ mang bệnh = giai đoạn yếu, cần nghỉ ngơi/phục hồi.',
    area: 'lưu ý sức khoẻ, tránh quá sức',
  },
  死: {
    vi: 'Tử', phase: 'kết thúc', luck: 'hung',
    meaning: 'Như sự kết thúc — đóng vòng, chuyển đổi; không hẳn xấu (chuyển hóa). Trụ mang tử = giai đoạn biến đổi lớn, kết thúc cũ/mở mới.',
    area: 'chấp nhận kết thúc, chuẩn bị chuyển đổi',
  },
  墓: {
    vi: 'Mộ', phase: 'tàng trữ', luck: 'bình',
    meaning: 'Như lăng mộ — cất giữ, ẩn náu, tích luỹ; vạn vật quy về mộ để bảo tồn. Trụ mang mộ = tàng trữ, kín đáo, cần khai quật (xung) mới phát.',
    area: 'tích luỹ, đầu tư dài hạn, kín đáo',
  },
  絕: {
    vi: 'Tuyệt', phase: 'đáy', luck: 'hung',
    meaning: 'Như tuyệt tự — đáy cùng, không còn; nhưng "tuyệt địa phùng sinh" — cực tắc thái. Trụ mang tuyệt = rất yếu nhưng tiềm năng phục hồi mạnh (phong hoàng tái sinh).',
    area: 'đáy cùng — chuẩn bị hồi phục, cực tắc thái',
  },
  胎: {
    vi: 'Thai', phase: 'thai nghén', luck: 'cát nhẹ',
    meaning: 'Như thai nhi — ấp ủ, chuẩn bị, tiềm năng chưa lộ; cảm nhận trực giác, sáng tạo ngầm. Trụ mang thai = giai đoạn ấp ủ, sáng tạo.',
    area: 'lên kế hoạch, sáng tạo, ấp ủ ý tưởng',
  },
  養: {
    vi: 'Dưỡng', phase: 'nuôi dưỡng', luck: 'cát nhẹ',
    meaning: 'Như nuôi dưỡng trẻ — chăm sóc, bồi bổ, chuẩn bị cho sinh; tích luỹ năng lượng. Trụ mang dưỡng = giai đoạn bồi bổ, chuẩn bị.',
    area: 'bồi bổ năng lượng, giáo dục, chuẩn bị',
  },
};

/**
 * Phân tích十二长生 cho 4 trụ.
 * @param {object} chart - buildChart output (có pillars.{key}.changSheng)
 * @returns [{ key, label, zhi, stage, stageVi, info }]
 */
export function analyzeChangsheng(chart) {
  const labels = { year: 'Trụ Năm', month: 'Trụ Tháng (月令)', day: 'Trụ Ngày (cung bản mệnh)', time: 'Trụ Giờ' };
  const out = [];
  for (const key of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[key];
    const stage = p.changSheng;
    const info = STAGE_MEANING[stage] || { vi: stage, meaning: '(chưa encode)', area: '' };
    out.push({ key, label: labels[key], zhi: p.zhi, stage, stageVi: info.vi, luck: info.luck, meaning: info.meaning, area: info.area });
  }
  // Đặc biệt: tháng = 月令 → thế lực của Nhật Chủ
  const monthStage = out[1];
  const isStrong = ['長生', '冠帶', '臨官', '帝旺'].includes(monthStage.stage);
  const isWeak = ['死', '絕', '病'].includes(monthStage.stage);
  const monthNote = isStrong
    ? `Nhật Chủ tại nguyệt lệnh = ${monthStage.stageVi} → ĐẮC LỆNH (thân vượng tại tháng sinh) → nền vượng.`
    : isWeak
      ? `Nhật Chủ tại nguyệt lệnh = ${monthStage.stageVi} → THẤT LỆNH (thân nhược tại tháng sinh) → nền suy.`
      : `Nhật Chủ tại nguyệt lệnh = ${monthStage.stageVi} → trung bình.`;
  return { stages: out, monthNote };
}

// [loop 20 — NEW FEATURE] 十二长生运 — phân nhóm giai đoạn
const RISE_STAGES = ['長生', '冠帶', '臨官', '帝旺'];   // trỗi dậy / vượng
const DECLINE_STAGES = ['衰', '病', '死', '墓', '絕'];   // thu lại / suy
export function stageCategory(stage) {
  if (RISE_STAGES.includes(stage)) return { cat: 'trỗi dậy', tone: 'cát' };
  if (DECLINE_STAGES.includes(stage)) return { cat: 'thu lại', tone: 'hung nhẹ' };
  return { cat: 'chuyển hóa / ấp ủ', tone: 'bình' };      // 沐浴/胎/养
}

/**
 * [loop 20 — NEW FEATURE] 十二长生运 cho ĐẠI VẬN.
 *   Mỗi đại vận = 1 giai đoạn 12 trường sinh của Nhật Chủ (tại đại vận chi).
 *   帝旺/临官/长生/冠带 → thập niên trỗi dậy, mạnh, sáng tạo; 墓/绝/死/病 → thu lại,
 *   bảo tồn, phục hồi. Cho user "đời đang ở giai đoạn nào" mỗi 10 năm.
 *   Nguồn: 滴天髓 运元, 三命通会 长生十二运 (lấy đại vận chi tra trường sinh).
 * @param {object} R analyze()
 * @returns {{ current, currentStage, stages:[{ganZhi,range,zhi,stage,stageVi,luck,meaning,area,cat,isNow}], note }}
 */
export function dayunChangsheng(R) {
  const dayGan = R.chart.dayGan;
  const stages = (R.dayun || []).map((d) => {
    const zhi = d.zhi || (d.ganZhi && d.ganZhi[1]);
    const stage = zhi ? changSheng(dayGan, zhi) : '';
    const info = STAGE_MEANING[stage] || { vi: stage, meaning: '', area: '', luck: '' };
    const { cat } = stageCategory(stage);
    const isNow = !!d.isNow;
    return { ganZhi: d.ganZhi, range: `${d.startAge}-${d.startAge + 9}t`, zhi, stage, stageVi: info.vi, luck: info.luck, meaning: info.meaning, area: info.area, cat, isNow };
  }).filter((s) => s.stage);
  const cur = stages.find((s) => s.isNow) || stages[0] || null;
  let note = '';
  if (cur) {
    note = `Đại vận hiện tại (${cur.ganZhi}, ${cur.range}): Nhật Chủ ở giai đoạn ${cur.stageVi} → thập niên ${cur.cat}.`;
    if (cur.area) note += ` Khuyên: ${cur.area}.`;
  }
  // Số thập niên "trỗi dậy" vs "thu lại" — cho thấy nhịp cả nửa đời
  const rise = stages.filter((s) => s.cat === 'trỗi dậy').length;
  const decline = stages.filter((s) => s.cat === 'thu lại').length;
  return { current: cur, currentStage: cur?.stage || null, stages, riseCount: rise, declineCount: decline, note };
}

/**
 * [loop 20 — NEW FEATURE] 十二长生运 cho LƯU NIÊN (1 năm).
 *   Tương tự dayunChangsheng nhưng cho 1 năm cụ thể — "năm này đời ở giai đoạn nào".
 * @param {object} R analyze()
 * @param {number} scanYear
 */
export function liunianChangsheng(R, scanYear) {
  const dayGan = R.chart.dayGan;
  const yr = scanYear || new Date().getFullYear();
  // can-chi năm (chu kỳ 60甲子)
  const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const gan = GAN_ORDER[((yr - 4) % 10 + 10) % 10];
  const zhi = ZHI_ORDER[((yr - 4) % 12 + 12) % 12];
  const stage = changSheng(dayGan, zhi);
  const info = STAGE_MEANING[stage] || { vi: stage, meaning: '', area: '', luck: '' };
  const { cat, tone } = stageCategory(stage);
  const ganZhi = gan + zhi;
  let note = `Năm ${yr} (${ganZhi}): Nhật Chủ ở giai đoạn ${info.vi} → năm ${cat} (${tone}).`;
  if (info.area) note += ` Khuyên: ${info.area}.`;
  return { year: yr, ganZhi, stage, stageVi: info.vi, luck: info.luck, meaning: info.meaning, area: info.area, cat, tone, note };
}
