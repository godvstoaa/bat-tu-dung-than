// ============================================================================
//  盖头截脚 + 进退交伏神 — CHẤT LƯỢNG TRỤ & TIẾN THOÁI THẦN
//  "Trụ này khí có thông không? Sao lại hay vấp?" — chiều sâu đọc trụ (滴天髓).
//  * 盖头 (gài đầu): CAN KHẮC CHI → "làm việc ngay từ đầu đã hỏng" (can đè chi).
//  * 截脚 (tiệt cước): CHI KHẮC CAN → "nửa chừng bị vấp ép" (chi chém chân can).
//    Nhiều trụ盖头/截脚 → khí KHÔNG THÔNG, đời nhiều trở ngại, 反复周折 (滴天髓阐微 岁运章).
//    Phân biệt: Dụng bị盖头/截脚 → Dụng bị tổn; 忌 bị盖头/截脚 → ngược lại tốt (khắc được忌).
//  * 进神/退神/交神/伏神 (4 nhóm × 4 trụ, 三命通会 卷二):
//    进 = phát tích hanh khoái; 退 = quan tư giáng trác; 交 = s庶 sự bất hài; 伏 = sở tác trệ lưu.
//  Khác chart.js (tính trụ): module này = ĐỌC Ý NGHĨA quan hệ can-chi trong từng trụ.
//  Nguồn: 滴天髓阐微 岁运章 (任铁樵), 三命通会 卷二 进退交伏神.
// ============================================================================
import { GAN, ZHI, WX_VI } from './constants.js';

const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const PILLAR_VI = { year: 'Niên', month: 'Nguyệt', day: 'Nhật', time: 'Thời' };

const JIN = ['甲子', '甲午', '己卯', '己酉'];   // 进神
const TUI = ['丁丑', '壬辰', '丁未', '壬戌'];   // 退神
const JIAO = ['丙子', '丙午', '辛卯', '辛酉'];  // 交神
const FU = ['戊寅', '癸巳', '戊申', '癸亥'];    // 伏神
export const SHEN_GROUPS = { 进神: JIN, 退神: TUI, 交神: JIAO, 伏神: FU };
const SHEN_VI = { 进神: 'Tiến Thần', 退神: 'Thoái Thần', 交神: 'Giao Thần', 伏神: 'Phục Thần' };
const SHEN_MEAN = {
  进神: 'phát tích hanh khoái — vận khí TIẾN, sự nghiệp lên nhanh, tích cực',
  退神: 'quan tư giáng trác — vận khí THOÁI, dễ mất chức/thoái lui, suy',
  交神: 's庶 sự bất hài — việc gì cũng trắc trở, bất hoà, khó thành',
  伏神: 'sở tác trệ lưu — làm gì cũng ĐÌNH TRỆ, kẹt, chậm',
};

/** Quan hệ can-chi của 1 trụ. */
export function pillarRelation(p) {
  const g = GAN[p.gan].wx, z = ZHI[p.zhi].wx;
  if (g === z) return { type: '比和', vi: 'Bỉ hoà (cùng hành)', flow: 1 };
  if (SHENG[g] === z) return { type: '干生支', vi: 'Can sinh Chi', flow: 1 };
  if (SHENG[z] === g) return { type: '支生干', vi: 'Chi sinh Can', flow: 1 };
  if (KE[g] === z) return { type: '盖头', vi: 'Cái Đầu (can khắc chi)', flow: -1 };
  if (KE[z] === g) return { type: '截脚', vi: 'Tiệt Cước (chi khắc can)', flow: -1 };
  return { type: '?', vi: '?', flow: 0 };
}

/** Trụ thuộc nhóm tiến/thoái/giao/phục thần nào (null nếu không). */
export function shenJinTui(ganZhi) {
  for (const [k, arr] of Object.entries(SHEN_GROUPS)) if (arr.includes(ganZhi)) return k;
  return null;
}

/**
 * Phân tích chất lượng trụ cho lá số.
 * @returns {{ perPillar, gaijieCount, flowOk, dayShen, summary }}
 */
export function analyzePillarQuality(R) {
  const dung = new Set([R.yong?.primary, R.yong?.xi].filter(Boolean));
  const ji = new Set([R.yong?.ji].filter(Boolean));
  const perPillar = {};
  let gaijieCount = 0, flowSum = 0, dungHits = 0, jiHits = 0;
  const damagedList = [];

  for (const k of ['year', 'month', 'day', 'time']) {
    const p = R.chart.pillars[k];
    const rel = pillarRelation(p);
    flowSum += rel.flow;
    const ganWx = GAN[p.gan].wx, zhiWx = ZHI[p.zhi].wx;
    const isDamaged = rel.type === '盖头' || rel.type === '截脚';
    if (isDamaged) {
      gaijieCount++;
      damagedList.push(`${PILLAR_VI[k]}(${p.gan}${p.zhi}=${rel.vi})`);
      // can/chi bị khắc có phải Dụng/忌?
      const 克gan = rel.type === '截脚';                       // chi khắc can
      const 克zhi = rel.type === '盖头';                       // can khắc chi
      const hit = [];
      if (克gan) { if (dung.has(ganWx)) { hit.push(`can ${WX_VI[ganWx]}=DỤNG bị khắc → Dụng tổn`); dungHits++; } if (ji.has(ganWx)) { hit.push(`can ${WX_VI[ganWx]}=KỴ bị khắc → tốt`); jiHits++; } }
      if (克zhi) { if (dung.has(zhiWx)) { hit.push(`chi ${WX_VI[zhiWx]}=DỤNG bị khắc → Dụng tổn`); dungHits++; } if (ji.has(zhiWx)) { hit.push(`chi ${WX_VI[zhiWx]}=KỴ bị khắc → tốt`); jiHits++; } }
      perPillar[k] = { ...rel, ganZhi: p.gan + p.zhi, damaged: true, impact: hit.join('; ') || 'không trúng Dụng/Kỵ trực tiếp' };
    } else {
      perPillar[k] = { ...rel, ganZhi: p.gan + p.zhi, damaged: false };
    }
  }

  const dayGz = R.chart.pillars.day.gan + R.chart.pillars.day.zhi;
  const dayShen = shenJinTui(dayGz);
  const yearShen = shenJinTui(R.chart.pillars.year.gan + R.chart.pillars.year.zhi);

  const flowOk = gaijieCount <= 1;
  let summary;
  if (!gaijieCount) {
    summary = `4 trụ KHÔNG bị盖头/截脚 → can-chi TƯƠNG SINH/Bỉ hoà, khí THÔNG, đời làm việc thuận, ít vấp. `;
  } else {
    summary = `${gaijieCount}/4 trụ bị盖头/截脚 (${damagedList.join(', ')}) → ${flowOk ? 'khí vẫn tương đối thông' : 'khí KHÔNG THÔNG, đời nhiều trở ngại, làm việc hay vấp/chưa xong đã hỏng'}. `;
    const impacts = Object.values(perPillar).filter((p) => p.impact).map((p) => p.impact);
    if (impacts.length) summary += `Lưu ý: ${impacts.join('; ')}. `;
  }
  if (dayShen) summary += `Nhật trụ ${dayGz} = ${SHEN_VI[dayShen]} (${SHEN_MEAN[dayShen]}) — tính chất cốt lõi bản mệnh mang hơi hướng này.`;
  else summary += `Nhật trụ ${dayGz} không thuộc nhóm tiến/thoái/giao/phục thần (trung tính).`;

  return { perPillar, gaijieCount, dungHits, jiHits, flowOk, dayShen, dayShenVi: dayShen ? SHEN_VI[dayShen] : null, yearShen, summary };
}

export { SHEN_VI, SHEN_MEAN };
