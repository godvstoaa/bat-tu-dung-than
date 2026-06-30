// ============================================================================
//  ZÉ RÌ 择日 — CHỌN NGÀY LÀNH (thực dụng nhất khi người ta tìm phong thủy)
//  Đánh giá một ngày dương lịch cho một việc cụ thể + theo tuổi người làm.
//  Cơ sở: 建除十二神 (12 trực), 黄道/黑道, 生肖冲煞 (tránh ngày xung tuổi),
//  通胜宜忌 theo từng việc (嫁娶/开市/入宅/动土/出行). Nguồn: 通胜, 协纪辨方.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI, ZHI_ORDER } from './constants.js';

// 12 trực (建除十二神) theo thứ tự
const ZHI_OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_VI = { 建:'Kiến', 除:'Trừ', 满:'Mãn', 平:'Bình', 定:'Định', 执:'Chấp', 破:'Phá', 危:'Nguy', 成:'Thành', 收:'Thu', 开:'Khai', 闭:'Bế' };
// Phân loại trực: cát / hung theo thông quyết 通胜 chuẩn «建满平收黑, 除危定执黄, 成开皆可用,
//   破闭不相当» [loop 22 sửa]. Trước đây 建/满='cát', 执/危/收='bình' — lệch cổ quyết.
//   黄道(cát): 除 危 定 执 成 开 | 黑道(hung): 建 满 平 破 收 闭.
const OFFICER_TONE = { 建:'hung', 除:'cát', 满:'hung', 平:'hung', 定:'cát', 执:'cát', 破:'hung', 危:'cát', 成:'cát', 收:'hung', 开:'cát', 闭:'hung' };
// 六冲
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 326] 六害 + 三刑 — 择日 cũng kỵ ngày hại/hình tuổi (trước đây chỉ check 冲 → có thể suggest ngày «cát» mà thực ra hại/hình người dùng)
const HAI = { 子:'未', 未:'子', 丑:'午', 午:'丑', 寅:'巳', 巳:'寅', 卯:'辰', 辰:'卯', 申:'亥', 亥:'申', 酉:'戌', 戌:'酉' };
const XING = { 子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑', 辰:'辰', 午:'午', 酉:'酉', 亥:'亥' };
// [loop 1014 FIX] 六合 — ngày chi LỤC HỢP tuổi = rất cát (岁合日). Trước đây zheri chỉ
//   phạt 冲/害/刑 mà KHÔNG thưởng 合 → mất cân bằng (best-hour/daily đã có reward từ loop 1006,
//   zheri bị sót). Cùng bug-class, giờ đóng.
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
// [loop 1019] 三合 (bán-hợp) — ngày chi + chi tuổi cùng cụm 三合 (申子辰/亥卯未/寅午戌/巳酉丑)
//   = «半合» cùng cục, thuận (yếu hơn 六 hợp). Hoàn thiện layer 合.
const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];

// Việc lớn → các trực CÁT (宜) và HUNG (忌) tương ứng
const ACTIVITY = {
  marry: { label: 'Cưới hỏi (嫁娶)', yi: ['成', '定', '开', '建', '除'], ji: ['破', '平', '闭', '危'] },
  business: { label: 'Khai trương / mở cửa hàng (开市)', yi: ['开', '成', '建', '满'], ji: ['破', '闭', '平'] },
  move: { label: 'Dọn nhà / nhập trạch (入宅·移徙)', yi: ['成', '定', '开', '满', '除'], ji: ['破', '闭', '平'] },
  build: { label: 'Động thổ / xây cất (动土)', yi: ['成', '定', '开'], ji: ['破', '闭'] },
  travel: { label: 'Xuất hành xa (出行)', yi: ['开', '建', '除', '满'], ji: ['破', '闭', '平'] },
  sign: { label: 'Ký hợp đồng / giao dịch (立券)', yi: ['成', '定', '开'], ji: ['破', '闭', '危'] },
};
// [loop 724 FIX] alias map — user/AI dùng «khai-truong» «dong-tho» thay vì «business» «build»
const ACTIVITY_ALIAS = {
  'khai-truong': 'business', 'khai-truong': 'business', 'khaitruong': 'business', 'khai-trương': 'business',
  'dong-tho': 'build', 'dong-thổ': 'build', 'dongtho': 'build', 'xay-dung': 'build', 'xay-cất': 'build',
  'don-nha': 'move', 'nhap-trach': 'move', 'dọn-nhà': 'move', 'move-house': 'move',
  'cuoi-hoi': 'marry', 'cưới-hỏi': 'marry', 'hon-le': 'marry', 'hôn-lễ': 'marry',
  'ky-hop-dong': 'sign', 'ký-hợp-đồng': 'sign', 'ky-ket': 'sign', 'sign-contract': 'sign',
  'xuat-hanh': 'travel', 'đi-xa': 'travel', 'travel-far': 'travel',
};

/**
 * Đánh giá một ngày cho một việc + tuổi (địa chi năm sinh) người hỏi.
 * @returns {{ solar, lunar, dayGanZhi, officer, officerVi, tone, chongZhi, clashYou, yi, ji, score, rating, advice }}
 */
export function evaluateDate(year, month, day, activityId, userZhi) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const monthZhi = lunar.getMonthZhi();

  // 12 trực: index = (dayZhi - monthZhi) mod 12
  const oIdx = ((ZHI_ORDER.indexOf(dayZhi) - ZHI_ORDER.indexOf(monthZhi)) + 12) % 12;
  const officer = ZHI_OFFICERS[oIdx];
  const officerVi = OFFICER_VI[officer];
  const tone = OFFICER_TONE[officer];

  // 生肖冲: ngày nay chi xung với chi tuổi?
  const chongZhi = CHONG[dayZhi];
  const clashYou = userZhi ? (dayZhi === CHONG[userZhi] || chongZhi === userZhi) : false;

  const act = ACTIVITY[activityId] || ACTIVITY[ACTIVITY_ALIAS[activityId]] || ACTIVITY.marry;
  const yi = act.yi.includes(officer);
  const ji = act.ji.includes(officer);

  // Chấm điểm
  let score = 50;
  const reasons = [];
  if (tone === 'cát') { score += 18; reasons.push(`Trực ${officerVi} (${officer}) là trực CÁT (黄道), nền tốt.`); }
  else if (tone === 'hung') { score -= 18; reasons.push(`Trực ${officerVi} (${officer}) là trực HUNG (黑道).`); }
  else { reasons.push(`Trực ${officerVi} (${officer}) ở mức bình.`); }

  if (yi) { score += 22; reasons.push(`Trực ${officerVi} thuộc nhóm "宜 ${act.label}" → rất hợp việc.`); }
  else if (ji) { score -= 22; reasons.push(`Trực ${officerVi} thuộc nhóm "忌 ${act.label}" → kỵ việc này.`); }
  else { reasons.push(`Trực ${officerVi} không nằm trong 宜/忌 chính của việc "${act.label}".`); }

  if (clashYou) { score -= 25; reasons.push(`⚠ Ngày chi ${dayZhi} (${ZHI[dayZhi].vi}) XUNG trực tiếp tuổi ${ZHI[userZhi].vi} (${userZhi}) — "日冲岁" rất kỵ với cá nhân.`); }
  else if (userZhi) { reasons.push(`Ngày không xung tuổi ${ZHI[userZhi].vi}.`); }
  // [loop 326] 日害岁 / 日刑岁 — nhẹ hơn 冲 nhưng vẫn giảm (tránh suggest ngày «cát» mà hại/hình tuổi)
  if (!clashYou && userZhi && HAI[dayZhi] === userZhi) { score -= 10; reasons.push(`• Ngày chi ${dayZhi} (${ZHI[dayZhi].vi}) HẠI tuổi ${ZHI[userZhi].vi} — "日害岁" tiểu nhân/trệ, giảm cát.`); }
  if (!clashYou && userZhi && XING[dayZhi] === userZhi && dayZhi !== userZhi) { score -= 12; reasons.push(`• Ngày chi ${dayZhi} (${ZHI[dayZhi].vi}) HÌNH tuổi ${ZHI[userZhi].vi} — "日刑岁" quanphi/thị phi, nên tránh việc lớn.`); }
  // [loop 1014] 六合 thưởng — ngày chi lục hợp tuổi → «日合岁» rất cát (đối xứng 冲罚).
  if (!clashYou && userZhi && LIUHE[dayZhi] === userZhi) { score += 15; reasons.push(`💕 Ngày chi ${dayZhi} (${ZHI[dayZhi].vi}) LỤC HỢP tuổi ${ZHI[userZhi].vi} (${userZhi}) — "日合岁" thuận hoà, quý nhân phù, tăng cát.`); }
  // [loop 1019] 三合 bán-hợp — ngày chi + chi tuổi cùng cụm 三合 (nếu chưa 六 hợp) → «半合» thuận.
  else if (!clashYou && userZhi && dayZhi !== userZhi && SANHE.some((g) => g.includes(dayZhi) && g.includes(userZhi))) {
    score += 8; reasons.push(`🔗 Ngày chi ${dayZhi} (${ZHI[dayZhi].vi}) BÁN HỢP (三合) tuổi ${ZHI[userZhi].vi} (${userZhi}) — cùng cục, tăng cát (yếu hơn lục hợp).`);
  }

  score = Math.max(5, Math.min(98, Math.round(score)));
  let rating = 'Bình';
  if (score >= 80) rating = 'Đại cát';
  else if (score >= 65) rating = 'Cát';
  else if (score >= 45) rating = 'Bình';
  else if (score >= 30) rating = 'Hơi kỵ';
  else rating = 'Kỵ';

  const advice = score >= 65
    ? `Ngày ${rating} cho việc "${act.label}" — nên tiến hành.`
    : score >= 45
      ? `Ngày trung bình — tiến hành được nếu gấp, nhưng nên tìm ngày trực 成/开/định không xung tuổi sẽ tốt hơn.`
      : `Ngày ${rating} cho việc này${clashYou ? ' + xung tuổi' : ''} — nên tránh, chọn ngày khác.`;

  return {
    solar: solar.toYmd(), lunar: `${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`,
    dayGanZhi: dayGan + dayZhi, dayGan, dayZhi, officer, officerVi, tone,
    chongZhi, clashYou, yi, ji, score, rating, reasons, advice, activity: act.label,
  };
}

// Tìm N ngày tốt nhất trong khoảng (cho một việc + tuổi) — quét window
export function findGoodDates(startYear, startMonth, startDay, days, activityId, userZhi, topN = 5) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = Solar.fromYmdHms(startYear, startMonth, startDay, 12, 0, 0).next(i);
    try {
      const ev = evaluateDate(d.getYear(), d.getMonth(), d.getDay(), activityId, userZhi);
      out.push(ev);
    } catch (e) { /* bỏ ngày lỗi */ }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topN);
}

export { ACTIVITY, ZHI_OFFICERS, OFFICER_VI };
