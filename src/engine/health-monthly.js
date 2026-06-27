// ============================================================================
//  SỨC KHOẺ LƯU NGUYỆT CẢNH BÁO 健康流月预警
//  "Tháng nào sức khoẻ yếu? Phòng bệnh gì?" — quét 12 tháng.
//  Khác wealth-alert (tài) + health-alert (năm): TẠNG PHỦ + dưỡng sinh theo tháng.
//  Nguồn: 黄帝内经 五运六气, 治未病 + 五虎遁 lưu nguyệt.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, HIDDEN, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

const MONTH_ZH = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
// [loop 313 sửa bug] tên tháng phải theo mZhi THẬT (tiết khí), không phải index Dương lịch.
//   Trước đây i=0 (tháng 1 Dương=丑月/腊) bị gán nhãn «正» → sai 1 tháng so với ganZhi.
//   寅=正, 卯=二, … 丑=腊 (lịch âm bắt đầu 立春/tháng Dần).
const ZHI_MONTH = { '寅':'正','卯':'二','辰':'三','巳':'四','午':'五','未':'六','申':'七','酉':'八','戌':'九','亥':'十','子':'冬','丑':'腊' };

const ORGAN = {
  木: { vi: 'Mộc', organs: 'Gan – Mật, thần kinh, gân, mắt', risk: 'gan nóng, căng thẳng, đau mắt, tức giận' },
  火: { vi: 'Hỏa', organs: 'Tim – Ruột non, huyết mạch', risk: 'tim mạch, huyết áp, mất ngủ, lo âu' },
  土: { vi: 'Thổ', organs: 'Tỳ – Vị, tiêu hoá, cơ nhục', risk: 'tiêu hoá, dạ dày, đường huyết' },
  金: { vi: 'Kim', organs: 'Phổi – Đại tràng, hô hấp, da', risk: 'hô hấp, cảm cúm, da, dị ứng' },
  水: { vi: 'Thủy', organs: 'Thận – Bàng quang, sinh dục – tủy', risk: 'thận, tiết niệu, xương khớp, sinh dục' },
};

// Thập thần lưu nguyệt → độ sức khoẻ
const GOD_HEALTH = {
  正印: { d: 5, vi: 'Chính Ấn — bảo vệ, dưỡng sinh tốt', tone: 'cat' },
  食神: { d: 4, vi: 'Thực Thần — phúc lộc, miệng tốt, vui vẻ', tone: 'cat' },
  正官: { d: 2, vi: 'Chính Quan — ổn định, quy củ', tone: 'cat' },
  比肩: { d: 0, vi: 'Tỷ Kiên — trung tính', tone: 'mid' },
  偏財: { d: -1, vi: 'Thiên Tài — hao nhẹ', tone: 'slight-hung' },
  正財: { d: -2, vi: 'Chính Tài — bận rộn, hao tạng', tone: 'slight-hung' },
  偏印: { d: -3, vi: 'Thiên Ấn — suy nhược thần kinh, hay nghĩ', tone: 'hung' },
  傷官: { d: -4, vi: 'Thương Quan — hao sức, khẩu thiệp, cãi', tone: 'hung' },
  七殺: { d: -6, vi: 'Thất Sát — áp lực, bệnh, rủi ro', tone: 'hung' },
  劫財: { d: -5, vi: 'Kiếp Tài — hao kiệt, stress', tone: 'hung' },
};

const SEASON = { 寅:'xuân', 卯:'xuân', 辰:'quý xuân', 巳:'hạ', 午:'hạ', 未:'quý hạ', 申:'thu', 酉:'thu', 戌:'quý thu', 亥:'đông', 子:'đông', 丑:'quý đông' };

/**
 * @returns {{ months:[{m, mVi, ganZhi, god, godVi, score, tone, organFocus, advice}],
 *            bestMonth, worstMonth, summary }}
 */
export function healthMonthlyAlert(R, scanYear) {
  const dayGan = R.chart.dayGan;
  const yong = R.yong || {}; // [loop 566 FIX] guard yong undefined → crash TypeError
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou].filter(Boolean));
  const dmWx = R.chart.dayMaster.wx;

  // Hành yếu nhất = cần phòng tạng đó
  const weakest = Object.entries(R.wx?.score || {}).sort((a, b) => a[1] - b[1])[0]?.[0] || '土';

  const months = [];
  for (let i = 0; i < 12; i++) {
    const solarMonth = i + 1;
    let mGan = '', mZhi = '';
    try {
      const s = Solar.fromYmdHms(scanYear, solarMonth, 15, 12, 0, 0);
      const l = s.getLunar();
      mGan = l.getMonthGan();
      mZhi = l.getMonthZhi();
    } catch (e) { continue; }

    const god = tenGod(dayGan, mGan);
    const gInfo = GOD_HEALTH[god] || { d: 0, vi: '', tone: 'mid' };

    // Ngũ hành Dụng Thần
    const mgWx = GAN[mGan].wx, mzWx = ZHI[mZhi].wx;
    let wxScore = 0;
    if (fav.has(mgWx)) wxScore += 3;
    if (avoid.has(mgWx)) wxScore -= 4;
    if (fav.has(mzWx)) wxScore += 2;
    if (avoid.has(mzWx)) wxScore -= 3;

    // Mùa: hành yếu nhất bị khắc → nguy cơ
    // Tính hành của tháng theo tàng can chính khí của 月支 (bản khí).
    const season = SEASON[mZhi] || '?';
    const mZhiMainGan = HIDDEN[mZhi][0];          // bản khí tàng can của 月支
    const mZhiWx = GAN[mZhiMainGan].wx;            // hành chính của tháng
    const seasonRisk = (KE[mZhiWx] === weakest) ? -3 : 0;

    const totalScore = Math.max(10, Math.min(95, 50 + gInfo.d + wxScore + seasonRisk));

    let tone, advice, organFocus;
    if (totalScore >= 65) { tone = 'cat'; advice = `✓ Tháng ${ZHI_MONTH[mZhi] || "?"}: sức khoẻ TỐT — duy trì dưỡng sinh.`; organFocus = ORGAN[yong.primary]; }
    else if (totalScore >= 48) { tone = 'mid'; advice = `Tháng ${ZHI_MONTH[mZhi] || "?"}: sức khoẻ trung — duy trì.`; organFocus = ORGAN[dmWx]; }
    else if (totalScore >= 35) { tone = 'slight-hung'; advice = `⚠ Tháng ${ZHI_MONTH[mZhi] || "?"}: sức khoẻ bất lợi — chú ý ${ORGAN[weakest].risk}.`; organFocus = ORGAN[weakest]; }
    else { tone = 'hung'; advice = `🚨 Tháng ${ZHI_MONTH[mZhi] || "?"}: RỦI RO CAO — khám ${ORGAN[weakest].organs.split(' ')[0]}, giảm cường độ, dưỡng Dụng ${WX_VI[yong.primary]}.`; organFocus = ORGAN[weakest]; }

    months.push({
      m: i, mVi: `T${i + 1} (${ZHI_MONTH[mZhi] || '?'}月/${season})`, ganZhi: mGan + mZhi,
      god, godVi: TEN_GOD_VI[god] || god,
      score: totalScore, tone, organFocus, advice,
    });
  }

  const best = months.reduce((a, b) => b.score > a.score ? b : a);
  const worst = months.reduce((a, b) => b.score < a.score ? b : a);

  const summary = `Năm ${scanYear}: sức khoẻ tháng TỐT = ${best.mVi} (${best.score}). Tháng YẾU = ${worst.mVi} (${worst.score}, ${worst.organFocus.organs.split(' ')[0]}). Phòng: ${ORGAN[weakest].organs}. Dưỡng: ${WX_VI[yong.primary]}.`;

  return { months, bestMonth: best, worstMonth: worst, weakestOrgan: ORGAN[weakest], summary };
}

const KE = { 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' };
