// ============================================================================
//  TÀI LỘC LƯU NGUYỆT CẢNH BÁO 财禄流月预警
//  "Tháng nào kiếm tiền tốt? Tháng nào cẩn thận phá tài?" — quét 12 tháng.
//  Khác liuyue.js (general): tập trung TÀI LỘC cụ thể + cảnh báo Kiếp Tài.
//  Nguồn: 渊海子平 财月, 滴天髓 财运应期.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

const MONTH_ZH = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
// [loop 313 sửa bug] tên tháng theo mZhi THẬT (tiết khí), không phải index Dương lịch (sai 1 tháng).
const ZHI_MONTH = { '寅':'正','卯':'二','辰':'三','巳':'四','午':'五','未':'六','申':'七','酉':'八','戌':'九','亥':'十','子':'冬','丑':'腊' };

// Thập thần → độ倾斜 tài lộc
const GOD_WEALTH = {
  正財: { d: 8, vi: 'Chính Tài — tiến tài đều, nên nhận/giữ', tone: 'cat' },
  偏財: { d: 5, vi: 'Thiên Tài — tài lớn bất ngờ HOẶC hao lớn', tone: 'volatile' },
  食神: { d: 6, vi: 'Thực Thần — tài hoa sinh tài, kiếm bằng kỹ năng', tone: 'cat' },
  傷官: { d: -3, vi: 'Thương Quan — hao tiền, khẩu thiệp, biến động', tone: 'hung' },
  比肩: { d: -2, vi: 'Tỷ Kiên — cạnh tranh, hao nhẹ', tone: 'slight-hung' },
  劫財: { d: -8, vi: 'Kiếp Tài — ⚠ 破财! Tránh cho vay/đầu cơ/đầu tư lớn', tone: 'hung' },
  正官: { d: 3, vi: 'Chính Quan — danh vọng, thăng chức, lương tăng', tone: 'cat' },
  七殺: { d: -4, vi: 'Thất Sát — áp lực tài, tiểu nhân, rủi ro tài', tone: 'hung' },
  正印: { d: 2, vi: 'Chính Ấn — quý nhân, ấm no, nhận hỗ trợ', tone: 'cat' },
  偏印: { d: -1, vi: 'Thiên Ấn — hao tài nguyên nhẹ, hay nghĩ', tone: 'slight-hung' },
};

/**
 * @returns {{ months:[{m, mVi, ganZhi, god, godVi, score, tone, advice}],
 *            bestMonth, worstMonth, summary }}
 */
export function wealthMonthlyAlert(R, scanYear) {
  const dayGan = R.chart.dayGan;
  const yong = R.yong;
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou]);

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
    const gInfo = GOD_WEALTH[god] || { d: 0, vi: '', tone: 'mid' };

    // Ngũ hành Dụng thần
    const mgWx = GAN[mGan].wx, mzWx = ZHI[mZhi].wx;
    let wxScore = 0;
    if (fav.has(mgWx)) wxScore += 4;
    if (avoid.has(mgWx)) wxScore -= 5;
    if (fav.has(mzWx)) wxScore += 3;
    if (avoid.has(mzWx)) wxScore -= 4;

    const totalScore = Math.max(5, Math.min(98, 50 + gInfo.d + wxScore));

    let tone, advice;
    if (totalScore >= 65) { tone = 'cat'; advice = `✓ Tháng ${ZHI_MONTH[mZhi] || "?"}: TÀI LỘC TỐT — nên tiến thủ, ký kết, đầu tư, mở rộng.`; }
    else if (totalScore >= 48) { tone = 'mid'; advice = `Tháng ${ZHI_MONTH[mZhi] || "?"}: tài lộc trung — duy trì, không mạo hiểm.`; }
    else if (totalScore >= 35) { tone = 'slight-hung'; advice = `⚠ Tháng ${ZHI_MONTH[mZhi] || "?"}: tài lộc bất lợi — giữ chặt, tránh đầu tư lớn.`; }
    else { tone = 'hung'; advice = `🚨 Tháng ${ZHI_MONTH[mZhi] || "?"}: ⚠⚠ PHÁ TÀI RỦI RO — TRÁNH đầu tư/cho vay/đầu cơ. Tiết kiệm chặt.`; }

    months.push({
      m: i, mVi: `T${i + 1} (${ZHI_MONTH[mZhi] || "?"}月)`, ganZhi: mGan + mZhi,
      god, godVi: TEN_GOD_VI[god] || god,
      score: totalScore, tone, advice, gInfo: gInfo.vi,
    });
  }

  if (!months.length) {
    const summary = `Năm ${scanYear}: không tính được tháng nào (lỗi dữ liệu tiết khí).`;
    return { months, bestMonth: null, worstMonth: null, summary };
  }

  // Giữ nguyên phần tử đầu làm hạt giống (months đã được bảo đảm không rỗng ở guard trên).
  // KHÔNG dùng seed {score:0} cho worst — mọi month đều ≥5 nên worst sẽ kẹt ở seed → undefined.
  const best = months.reduce((a, b) => (b.score > a.score ? b : a));
  const worst = months.reduce((a, b) => (b.score < a.score ? b : a));

  const summary = `Năm ${scanYear}: tháng TỐT NHẤT tài = ${best.mVi} (${best.godVi}, ${best.score}/100). ` +
    `Tháng XẤU NHẤT = ${worst.mVi} (${worst.godVi}, ${worst.score}/100). ` +
    `${months.filter(m => m.tone === 'cat').length} tháng tốt, ${months.filter(m => m.tone === 'hung').length} tháng xấu.`;

  return { months, bestMonth: best, worstMonth: worst, summary };
}
