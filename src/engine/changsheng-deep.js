// ============================================================================
//  THẬP NHỊ TRƯỜNG SINH 十二长生 — ý nghĩa sâu từng giai đoạn cho 4 trụ
//  Mỗi trụ → trường sinh của Nhật Chủ tại chi đó → năng lượng trụ đó.
//  Vd: 日主 tại 月支 = 帝旺 → "đắc lệnh" cực vượng; tại 绝 → "tuyệt địa" cực nhược.
//  Nguồn: 滴天髓, 三命通会 (trường sinh luận).
// ============================================================================
import { TEN_GOD_VI } from './constants.js';

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
