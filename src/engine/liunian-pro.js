// ============================================================================
//  LUẬN LƯU NIÊN ĐA TRƯỜNG PHÁI (流年综合論)
//  Kết hợp 6 trường phái để phán vận MỘT NĂM cho cá nhân — sửa lỗi "chỉ xem
//  hành Dụng" (thiếu 十神 năm/太岁/神煞 năm/天克地冲) khiến phán ngược thực tế.
//  Phái: (1) 五行用神 (2) 十神 năm (3) 太岁 (4) 流年神煞 (5) 天克地冲 (6) 大运互动.
//  Nguồn: 渊海子平, 三命通会, 滴天髓.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, BRANCH_GROUP, SHENSHA_INFO } from './shensha.js';

const wxVi = (w) => WX_VI[w];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const HAI = { 子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉' };
// Tam hình (pair)
const XING = { 子: '卯', 卯: '子', 寅: '巳', 巳: '申', 申: '寅', 丑: '戌', 戌: '未', 未: '丑' };
// Phá thái tuế
const PO = { 子: '酉', 酉: '子', 丑: '辰', 辰: '丑', 寅: '亥', 亥: '寅', 卯: '午', 午: '卯', 巳: '申', 申: '巳', 戌: '未', 未: '戌' };

// Thập thần năm → hệ số + diễn giải
const GOD_YEAR_EFFECT = {
  比肩: { d: -6, vi: 'Tỷ Kiên năm: cạnh tranh, bạn bè, dễ đoạt tài/hao tiền, chủ tự lập.' },
  劫財: { d: -14, vi: 'Kiếp Tài năm: 破财 lớn, đầu tư thất bại, tranh giành, hôn nhân biến — PHẢI giữ tiền chặt.' },
  食神: { d: +10, vi: 'Thực Thần năm: phúc lộc, tài hoa sinh tài, bình順, có tài nguyên.' },
  傷官: { d: -16, vi: 'Thương Quan năm: 破财, 是非口舌, 变动, 感情波折 (nữ khắc phu, nam khẩu舌), tối kỵ "thương quan kiến quan".' },
  偏財: { d: +5, vi: 'Thiên Tài năm: tài lớn bất ngờ (hoặc phá lớn), biến động tài chính, nam đào hoa.' },
  正財: { d: +6, vi: 'Chính Tài năm: tiến tài đều (thân vượng) / hao tài (thân nhược).' },
  七殺: { d: -13, vi: 'Thất Sát năm: áp lực, tiểu nhân, bệnh, rủi ro, quyền lực nếu có chế — cẩn thận.' },
  正官: { d: +8, vi: 'Chính Quan năm: thăng tiến, danh vọng, quý nhân (kỵ Thương Quan同年 kiến).' },
  偏印: { d: -8, vi: 'Thiên Ấn năm: cô độc, "kiêu đoạt thực" phá tài nguyên, học vấn, biến怪.' },
  正印: { d: +9, vi: 'Chính Ấn năm: quý nhân, học/văn, bất động sản, mẹ, ấm no.' },
};

/**
 * Luận lưu niên đa trường phái cho 1 năm.
 * @returns {{ year, ganZhi, ganGod, elementSchool, taiSui, shensha, tianKe, score, rating, schools, advice }}
 */
export function analyzeLiunianDeep(R, solarYear) {
  const c = R.chart;
  const dayGan = c.dayGan, dayZhi = c.pillars.day.zhi;
  const yearBirthZhi = c.pillars.year.zhi;
  const yong = R.yong;

  // Lấy can chi năm (dùng giữa năm để đúng năm can chi theo lập xuân)
  const ys = Solar.fromYmdHms(solarYear, 6, 15, 12, 0, 0);
  const yl = ys.getLunar();
  const yGan = yl.getYearGan(), yZhi = yl.getYearZhi();
  const ganGod = tenGod(dayGan, yGan);
  const ganWx = GAN[yGan].wx, zhiWx = ZHI[yZhi].wx;

  const schools = [];
  let score = 50;

  // (1) Ngũ hành / Dụng thần học
  let elementNote = `Can ${yGan}(${wxVi(ganWx)}) + Chi ${yZhi}(${wxVi(zhiWx)}). `;
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoidSet = new Set([yong.ji, yong.chou]);
  let elD = 0;
  if (favSet.has(ganWx)) { elD += 8; elementNote += `Can hành ${wxVi(ganWx)} là Dụng/Hỷ → thuận. `; }
  if (avoidSet.has(ganWx)) { elD -= 10; elementNote += `Can hành ${wxVi(ganWx)} là Kỵ/Thù → nghịch. `; }
  if (favSet.has(zhiWx)) { elD += 6; elementNote += `Chi hành ${wxVi(zhiWx)} là Dụng/Hỷ → thuận. `; }
  if (avoidSet.has(zhiWx)) { elD -= 8; elementNote += `Chi hành ${wxVi(zhiWx)} là Kỵ/Thù → nghịch. `; }
  score += elD;
  schools.push({ phai: 'Ngũ Hành / Dụng Thần', note: elementNote, d: elD });

  // (2) Thập thần năm
  const gEff = GOD_YEAR_EFFECT[ganGod];
  if (gEff) { score += gEff.d; schools.push({ phai: 'Thập Thần năm', note: `${ganGod} (${ganGod === '傷官' ? 'Thương Quan' : ganGod}): ${gEff.vi}`, d: gEff.d }); }

  // (3) Thái tuế (chi năm vs chi năm sinh + chi ngày)
  const taiSuiNotes = [];
  if (yZhi === yearBirthZhi) { score -= 10; taiSuiNotes.push('值太岁 (tự thái tuế) — năm biến động, dễ惹事.'); }
  if (CHONG[yearBirthZhi] === yZhi) { score -= 16; taiSuiNotes.push('⚡冲太岁 (xung) — Đại biến động, hung, năm "tuổi xung".'); }
  if (XING[yearBirthZhi] === yZhi) { score -= 12; taiSuiNotes.push('刑太岁 — quan phi, thị phi.'); }
  if (PO[yearBirthZhi] === yZhi) { score -= 8; taiSuiNotes.push('破太岁 — phá tài.'); }
  if (HAI[yearBirthZhi] === yZhi) { score -= 8; taiSuiNotes.push('害太岁 — tiểu nhân, hao tốn ngầm.'); }
  // Tuế vs chi NGÀY (日破)
  if (CHONG[dayZhi] === yZhi) { score -= 14; taiSuiNotes.push('⚡日支冲太岁 — tổn bản thân/sức khoẻ, năm "ngày xung".'); }
  if (taiSuiNotes.length) schools.push({ phai: 'Thái Tuế', note: taiSuiNotes.join(' '), d: -1 });

  // (4) Thần sát năm (đào hoa / hồng diễm / dương nhận / dịch mã)
  const grp = BRANCH_GROUP[yearBirthZhi];
  const ssNotes = [];
  if (TAO_HUA[grp] === yZhi || TAO_HUA[BRANCH_GROUP[dayZhi]] === yZhi) { score -= 8; ssNotes.push('🌸 Đào Hoa năm — biến động tình cảm, 桃花劫/桃花破财 (cẩn thận烂桃花 hao tiền hao tình).'); }
  if (HONG_YAN[dayGan] === yZhi) { score -= 6; ssNotes.push('💋 Hồng Diễm năm — sắc duyên mạnh, dễ lệch lạc tình cảm.'); }
  if (YANG_REN[dayGan] === yZhi) { score -= 10; ssNotes.push('⚔️ Dương Nhận năm — sát khí, dễ tổn thương/xa lánh, kỵ đầu tư liều.'); }
  if (YI_MA[grp] === yZhi || YI_MA[BRANCH_GROUP[dayZhi]] === yZhi) { score += 3; ssNotes.push('🐎 Dịch Mã năm — di chuyển/đổi việc (cát nếu Dụng, hao nếu không).'); }
  if (ssNotes.length) schools.push({ phai: 'Lưu Niên Thần Sát', note: ssNotes.join(' '), d: -1 });

  // (5) Thiên khắc địa xung (can năm khắc can ngày + chi năm xung chi ngày)
  // can năm là Quan/Sát của Nhật Can = khắc thân; + chi xung
  const ganClash = ganGod === '七殺' || ganGod === '正官';
  const zhiClash = CHONG[dayZhi] === yZhi;
  if (ganClash && zhiClash) { score -= 18; schools.push({ phai: 'Thiên Khắc Địa Xung', note: '⚡ Năm can khắc Nhật Can + chi xung Nhật Chi = "thiên khắc địa xung" — năm ĐẠI HUNG, biến loạn lớn.', d: -18 }); }
  else if (zhiClash) { score -= 10; schools.push({ phai: 'Địa Xung', note: 'Chi năm xung Nhật Chi — biến động bản thân/gia đạo.', d: -10 }); }

  // Tổng
  score = Math.max(2, Math.min(98, Math.round(score)));
  let rating;
  if (score >= 78) rating = 'Đại cát';
  else if (score >= 62) rating = 'Cát';
  else if (score >= 46) rating = 'Bình';
  else if (score >= 32) rating = 'Hơi kỵ';
  else if (score >= 20) rating = 'Hung';
  else rating = 'Đại hung';

  const advice = score >= 62
    ? `Năm ${solarYear} (${rating}) — nên tiến thủ, nắm cơ hội; vẫn giữ Dụng ${wxVi(yong.primary)}.`
    : score >= 46
      ? `Năm ${solarYear} (${rating}) — giữ ổn định, thuận tự nhiên, tránh quyết định lớn nếu chưa rõ.`
      : `Năm ${solarYear} (${rating}) — NĂM BẤT LỢI. Thủ không tiến: giữ tiền, tránh đầu tư/đi xa/liều, bao dung tình cảm, tích đức hoá giải, đợi năm mang Dụng ${wxVi(yong.primary)}/Hỷ ${wxVi(yong.xi)} sẽ khá hơn.`;

  return { year: solarYear, ganZhi: yGan + yZhi, ganGod, ganWx, zhiWx, score, rating, schools, advice };
}
