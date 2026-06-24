// ============================================================================
//  SỨC KHOẺ LƯU NIÊN CẢNH BÁO 健康流年预警
//  "Năm nào sức khoẻ yếu? Phòng bệnh gì? Khi nào khám?"
//  Quét 10 năm → cờ đỏ sức khoẻ dựa trên: 12 thần + Bạch Hổ/病符/死符 +
//  Dụng Thần yếu kích hoạt + đại vận khắc +五行 mất cân năm đó.
//  Nguồn: 黄帝内经 治未病, 滴天髓 疾病应期.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { liunian12Shen } from './liunian-shen.js';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { SHENG, KE } from './constants.js';

const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

// Tạng phủ theo ngũ hành
const ORGAN = {
  木: 'Gan–Mật (thần kinh, gân, mắt)',
  火: 'Tim–Ruột non (huyết mạch)',
  土: 'Tỳ–Vị (tiêu hoá)',
  金: 'Phổi–Đại tràng (hô hấp)',
  水: 'Thận–Bàng quang (sinh dục – tủy)',
};

/**
 * @returns {{ alerts:[{year, risk, level, reasons[], advice}], safeYears:[], summary }}
 */
export function healthAlertScan(R, scanYears = 10) {
  const { chart, wx, yong, dayun } = R;
  const dmWx = chart.dayMaster.wx;
  const weakestWx = Object.entries(wx.score).sort((a, b) => a[1] - b[1])[0][0];
  const weakestOrgan = ORGAN[weakestWx];
  const birthZhi = chart.pillars.year.zhi;
  const dayZhi = chart.pillars.day.zhi;
  const curYear = new Date().getFullYear();

  // Đại vận đang hành
  const age = curYear - chart.input.year;
  const activeDy = (dayun || []).find(d => age >= d.startAge && age < d.startAge + 10) || (dayun || [])[0];

  const alerts = [];
  const safeYears = [];

  for (let i = 0; i < scanYears; i++) {
    const year = curYear + i;
    let riskScore = 0;
    const reasons = [];

    // 1. 12 thần: Bạch Hổ/病符/死符/太岁 → năm bất lợi sức khoẻ
    const yZhi = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar().getYearZhi();
    const s12 = liunian12Shen(birthZhi, yZhi);
    const healthGods = ['太岁', '白虎', '病符', '死符'];
    if (healthGods.includes(s12.god.zh)) {
      riskScore += 2;
      reasons.push(`${s12.god.zh} (${s12.god.vi}): ${s12.god.meaning.slice(0, 50)}`);
    }

    // 2. Lưu niên 6 phái: score thấp + Kỵ Thần vượng
    const ln = analyzeLiunianDeep(R, year);
    if (ln.score < 40) {
      riskScore += 1;
      reasons.push(`Vận năm ${ln.rating} (${ln.score}/100) — tổng thể bất lợi.`);
    }
    // Lưu niên can = Kỵ/Thù Thần
    const lnGanWx = GAN[ln.ganZhi[0]]?.wx;
    if (lnGanWx === yong.ji || lnGanWx === yong.chou) {
      riskScore += 1;
      reasons.push(`Can năm ${ln.ganZhi[0]} (${WX_VI[lnGanWx]}) = Kỵ/Thù Thần → hành ${WX_VI[lnGanWx]} vượng tổn tạng.`);
    }
    // Lưu niên chi xung Nhật Chi → tổn bản thân
    if (CHONG[ln.ganZhi[1]] === dayZhi || ln.ganZhi[1] === CHONG[dayZhi]) {
      riskScore += 1;
      reasons.push(`Chi năm ${ln.ganZhi[1]} xung Nhật Chi ${dayZhi} → tổn bản thân/sức khoẻ.`);
    }

    // 3. Đại vận interaction: nếu đại vận can = Kỵ
    if (activeDy) {
      const dyGanWx = GAN[activeDy.gan]?.wx;
      if (dyGanWx === yong.ji) {
        riskScore += 1;
        reasons.push(`Đại vận ${activeDy.ganZhi} mang Kỵ Thần (${WX_Vy(dyGanWx)}) → nền sức khoẻ yếu cả thập niên.`);
      }
    }

    // 4. Hành yếu nhất bị khắc trong năm
    const lnZhiWx = ZHI[ln.ganZhi[1]]?.wx;
    if (KE[lnZhiWx] === weakestWx) {
      riskScore += 1;
      reasons.push(`Chi năm ${ln.ganZhi[1]} (${WX_VI[lnZhiWx]}) khắc ${WX_VI[weakestWx]} (yếu nhất) → ${weakestOrgan} suy.`);
    }

    // Level
    let level;
    if (riskScore >= 4) level = '🔴 CAO';
    else if (riskScore >= 2) level = '🟡 TRUNG';
    else if (riskScore >= 1) level = '🟢 THẤP';
    else level = '⚪ AN TOÀN';

    const yearAlert = {
      year, ganZhi: ln.ganZhi, riskScore, level, reasons,
      shen12: s12.god.zh,
    };

    if (riskScore >= 2) {
      yearAlert.advice = riskScore >= 4
        ? `⚠ NĂM RỦI RO CAO — khám sức khoẻ định kỳ, giảm cường độ, dưỡng sinh ${WX_VI[yong.primary]}, tránh thức khách.`
        : `Năm cần chú ý sức khoẻ — duy trì dưỡng sinh, khám ${weakestOrgan.split(' ')[0]}.`;
      alerts.push(yearAlert);
    } else {
      safeYears.push({ year, ganZhi: ln.ganZhi, level, note: 'Sức khoẻ ổn.' });
    }
  }

  alerts.sort((a, b) => b.riskScore - a.riskScore);

  const summary = alerts.length
    ? `${alerts.length}/${scanYears} năm có rủi ro sức khoẻ. CAO nhất: ${alerts[0].year} (${alerts[0].level}). Phòng: ${weakestOrgan}. Dưỡng: ${WX_VI[yong.primary]}.`
    : `${scanYears} năm tới sức khoẻ tương đối ổn — duy trì dưỡng sinh.`;

  return { alerts, safeYears, weakestOrgan, weakestWx, summary };
}

function WX_Vy(w) { return WX_VI[w] || w; }
