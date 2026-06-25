// ============================================================================
//  寒暖燥湿 (HÀN – NOÃN – TÁO – THẤP) — CÂN BẰNG KHÍ HẬU MỆNH CỤC
//  «天道有寒暖, 地道有燥湿» (滴天髓) — 2 trục khí hậu song song ngũ hành:
//    * 寒↔暖 (cold↔warm): trục NHIỆT ĐỘ — Thủy hàn ↔ Hỏa noãn.
//    * 燥↔湿 (dry↔wet):   trục ĐỘ ẨM — Hỏa + 戊未戌 táo ↔ Thủy + 己辰丑 thấp.
//  Khi mệnh thiên lệch 1 trục → phải ĐIỀU HẬU (调候) DƯỚI ĐÂY, dẫn dắt Dụng Thần
//    (khác Phù Ức = cân vượng suy). Đây là CƠ SỞ định LÝ cho override 调候 ở chart.js.
//  * Điểm số:
//    - Tháng lệnh (令) mang khí hậu nền (亥子=hàn cực, 巳午=nhiệt cực; 丑/辰=thấp,
//      未/戌=táo — thổ 季月 táo/thấp phân minh).
//    - Hỏa lộ+tàng → +noãn & -ẩm; Thủy → -noãn & +ẩm.
//    - 戊(燥)/未戌 → táo; 己(湿)/辰丑 → thấp.
//  * Tóm tắt: nhiệt độ + độ ẩm → phân loại → nhu cầu bù → đối chiếu Dụng Thần.
//  Nguồn: 滴天髓 寒暖/燥湿 chương, 窮通寶鑑, 子平真诠 调候篇.
// ============================================================================
import { GAN, ZHI, HIDDEN, HIDDEN_WEIGHT, WX_VI } from './constants.js';

// Khí hậu nền theo nguyệt lệnh: temp (寒 -, 暖 +), humid (燥 -, 湿 +). 0 = trung hoà.
//   季月 (辰戌丑未) thổ vượng: 丑/辰 = 湿土 (hàm thủy), 未/戌 = 燥土 (hàm hỏa).
const MONTH_CLIMATE = {
  子: { temp: -2.0, humid: +0.6 }, // đông chính, hàn cực, thấp nhẹ
  丑: { temp: -1.4, humid: +1.0 }, // quý đông, hàn + thấp (湿土)
  寅: { temp: -0.2, humid:  0.0 }, // xuân sơ, ôn noãn nhẹ
  卯: { temp: +0.2, humid:  0.0 }, // xuân phân, ôn hoà
  辰: { temp:  0.0, humid: +0.8 }, // quý xuân, thấp (湿土)
  巳: { temp: +1.6, humid: -0.4 }, // hạ sơ, noãn nhiệt
  午: { temp: +2.0, humid: -0.6 }, // hạ chính, nhiệt cực, táo
  未: { temp: +1.4, humid: -1.0 }, // quý hạ, táo nhiệt (燥土)
  申: { temp: -0.4, humid:  0.0 }, // thu sơ, lương
  酉: { temp: -0.2, humid:  0.0 }, // thu phân, lương táo nhẹ
  戌: { temp:  0.0, humid: -0.8 }, // quý thu, táo (燥土)
  亥: { temp: -1.6, humid: +0.4 }, // đông sơ, hàn
};

// Trọng số trụ: nguyệt lệnh (令) mạnh nhất — đồng bộ tongGen/scoreWuXing.
const PILLAR_W = { year: 1.0, month: 1.8, day: 1.1, time: 1.0 };

function tally(chart) {
  let tempFromWx = 0, humidFromWx = 0;
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[k];
    if (!p) continue;
    const w = PILLAR_W[k];
    // Lộ can
    const gWx = GAN[p.gan].wx;
    if (gWx === '火')      { tempFromWx += 1.0 * w; humidFromWx -= 0.6 * w; }
    else if (gWx === '水') { tempFromWx -= 1.0 * w; humidFromWx += 0.6 * w; }
    else if (p.gan === '戊') { humidFromWx -= 0.4 * w; }      // 戊 = 旱土 (táo)
    else if (p.gan === '己') { humidFromWx += 0.4 * w; }      // 己 =田园土 (thấp)
    // Tàng can
    const hidden = HIDDEN[p.zhi] || [];
    hidden.forEach((stem, idx) => {
      const hw = HIDDEN_WEIGHT[hidden.length][idx];
      const sx = GAN[stem].wx;
      if (sx === '火')      { tempFromWx += 0.5 * hw * w; humidFromWx -= 0.4 * hw * w; }
      else if (sx === '水') { tempFromWx -= 0.5 * hw * w; humidFromWx += 0.4 * hw * w; }
    });
    // Bản thổ chi: 未戌 = 燥土 (-), 辰丑 = 湿土 (+) — bản khí thổ cấu thành táo/thấp
    if (p.zhi === '未' || p.zhi === '戌') humidFromWx -= 0.8 * w;
    else if (p.zhi === '辰' || p.zhi === '丑') humidFromWx += 0.8 * w;
  }
  return { tempFromWx: +tempFromWx.toFixed(2), humidFromWx: +humidFromWx.toFixed(2) };
}

const NEED_MAP = {
  fireCold:  { wx: '火', vi: 'Hỏa noãn (丙丁 / 巳午)', why: 'mệnh HÀN lạnh → cần Hỏa noãn (暖) cho vạn vật sinh phát («寒甚必用火暖»)' },
  waterHot:  { wx: '水', vi: 'Thủy thanh lương (壬癸 / 亥子)', why: 'mệnh NHIỆT quá → cần Thủy nhuận giáng ôn («燥甚必用水润»)' },
  waterDry:  { wx: '水', vi: 'Thủy / Quý nhuận (壬癸, 辰丑 thấp thổ)', why: 'mệnh TÁO → cần Thủy ngâm nuôi (润) + thấp thổ nhuận' },
  fireWet:   { wx: '火', vi: 'Hỏa / 丙 bốc noãn + 甲 Mộc thấu', why: 'mệnh THẤP trầm → cần Hỏa bốc khô (燥) + Mộc泄 thủy thông thổ' },
};

const REMEDY = {
  '火': 'đôngnoãn: hướng Nam, màu đỏ/tím, hoạt động trưa, thức ấm (gừng, quế, thịt đỏ vừa phải)',
  '水': 'mát nhuận: hướng Bắc, màu xanh đen, gần sông/biển, thức nhuận (rau xanh, trái thanh mát)',
  '木': 'thông tiết: hướng Đông, màu xanh lục, trồng cây, vận động ngoài trời',
};

/**
 * Phân tích cân bằng 寒暖燥湿 của lá số.
 * @returns {{ temperature, tempVi, tempScore, humidity, humidVi, humidScore,
 *            needs:[{wx,vi,why}], alignNote, remedy, summary }}
 */
export function analyzeHanNuan(R) {
  const chart = R.chart;
  const monthBase = MONTH_CLIMATE[chart.monthZhi] || { temp: 0, humid: 0 };
  const { tempFromWx, humidFromWx } = tally(chart);
  const temp = +(monthBase.temp + tempFromWx).toFixed(2);     // net nhiệt độ
  const humid = +(monthBase.humid + humidFromWx).toFixed(2);  // net độ ẩm

  const TEMP_T = 1.5;
  let temperature, tempVi;
  if (temp <= -TEMP_T) { temperature = '寒'; tempVi = 'HÀN lạnh'; }
  else if (temp >= TEMP_T) { temperature = '暖'; tempVi = 'NOÃN/NHIỆT'; }
  else { temperature = '平'; tempVi = 'ôn hoà (hàn–noãn cân)'; }

  const HUMID_T = 1.2;
  let humidity, humidVi;
  if (humid <= -HUMID_T) { humidity = '燥'; humidVi = 'TÁO khô'; }
  else if (humid >= HUMID_T) { humidity = '湿'; humidVi = 'THẤP ẩm'; }
  else { humidity = '平'; humidVi = 'thấp–táo cân'; }

  // Nhu cầu bù (theo trục thiên lệch)
  const needs = [];
  if (temperature === '寒') needs.push(NEED_MAP.fireCold);
  if (temperature === '暖') needs.push(NEED_MAP.waterHot);
  if (humidity === '燥') needs.push(NEED_MAP.waterDry);
  if (humidity === '湿') needs.push(NEED_MAP.fireWet);

  // Đối chiếu Dụng Thần: Dụng có phục vụ điều hậu khí hậu không?
  const dungWx = R.yong?.primary;
  let alignNote = '';
  if (needs.length && dungWx) {
    const needWxs = [...new Set(needs.map((n) => n.wx))];
    if (needWxs.includes(dungWx)) {
      alignNote = `✓ Dụng Thần (${WX_VI[dungWx]}) TRÙNG nhu cầu khí hậu (${needWxs.map((w) => WX_VI[w]).join('/')}) → Dụng phục vụ ĐIỀU HẬU, vững vàng («Dụng thật» cả cân bằng lẫn khí hậu).`;
    } else {
      alignNote = `⚠ Nhu cầu khí hậu cần ${needWxs.map((w) => WX_VI[w]).join('/')}, nhưng Dụng Thần = ${WX_VI[dungWx]}. Dụng ≠ nhu cầu khí hậu → khi luận phải PHỐI HỢP: Dụng chính (cân vượng suy) + hành noãn/nhuận phụ qua đại vận/lưu niên.`;
    }
  }

  const remedyWx = needs[0]?.wx;
  const remedy = remedyWx ? REMEDY[remedyWx] : 'khí hậu tương đối cân → giữ thói quen lành, không ép điều hậu';

  const summary = `Mệnh cục khí hậu: ${tempVi} (điểm ${temp}) + ${humidVi} (điểm ${humid}). ` +
    (needs.length
      ? `→ Cần bù: ${needs.map((n) => n.vi).join(' / ')}. ${alignNote} Khuyến nghị sinh hoạt: ${remedy}.`
      : `→ Hàn–noãn–táo–thấp TƯƠNG ĐỐI CÂN → mệnh thuận khí hậu, không cần điều hậu ép buộc; Dụng Thần tập trung cân bằng vượng suy.`);

  return {
    temperature, tempVi, tempScore: temp,
    humidity, humidVi, humidScore: humid,
    monthBase: { temp: monthBase.temp, humid: monthBase.humid },
    needs, alignNote, remedy, summary,
  };
}

export { MONTH_CLIMATE, NEED_MAP };
