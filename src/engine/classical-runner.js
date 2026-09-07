// ============================================================================
//  CLASSICAL RUNNER — phân tích TỰ TIÊU TỨ TRỤ (không cần ngày sinh dương lịch)
//  Mục đích: 回归 fixture 命例 cổ điển (三命通会 / 滴天髓阐微 / 千里命稿 /
//  造化元钥…) thường CHỈ lưu tứ trụ 汉字, KHÔNG có datetime mặt trời.
//  → dựng chart object cùng cấu trúc với buildChart() (chart.js), rồi đi
//    CÙNG CHUỖI pipeline như analyze() (chart.js ~line 665):
//      scoreWuXing → 空亡 → analyzeStrength → detectInteractions →
//      computeShensha → computePattern → findYongShen → patternQuality
//      → 病药 enrichment/promotion (loop 37 + loop 41).
//  KHÔNG đụng vào chart.js/pattern.js/… — chỉ tái dụng export có sẵn.
//  Quy ước xác định (deterministic): không có 节气 thời gian thật →
//  analyzeStrength qiPhase về mặc định '旺气' (chart.input thiếu y/m/d).
// ============================================================================
import {
  GAN, HIDDEN, HIDDEN_WEIGHT, WUXING, SHENG, KE, KE_BY, SHENG_BY,
} from './constants.js';
import { tenGod, changSheng, parseGender, normalizeGender } from './core.js';
import { scoreWuXing, analyzeStrength, findYongShen } from './chart.js';
import { analyzeKongwang } from './kongwang.js';
import { detectInteractions } from './interactions.js';
import { computeShensha } from './shensha.js';
import { computePattern } from './pattern.js';
import { patternQuality } from './pattern-quality.js';

const PILLAR_RE = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const PILLAR_KEYS = ['year', 'month', 'day', 'time'];

/** '庚午' → {gan:'庚', zhi:'午'} — có kiểm tra chữ hợp lệ. */
export function parsePillar(s, label = '') {
  const str = String(s || '').trim();
  if (!PILLAR_RE.test(str)) {
    throw new Error(`Trụ ${label} không hợp lệ («${s}» — cần dạng CanChi như 庚午).`);
  }
  return { gan: str[0], zhi: str[1] };
}

/**
 * Dựng chart object GIỐNG CẤU TRÚC output của buildChart() (chart.js)
 * nhưng từ 4 trụ 汉字 truyền trực tiếp (không qua lunar-javascript).
 * Field đãn đủ cho scoreWuXing / analyzeStrength / tongGen / kongwang /
 * interactions / shensha / pattern / yong / pattern-quality.
 */
export function buildChartFromPillars(pillars, gender = 'male') {
  const parts = {};
  for (const key of PILLAR_KEYS) {
    parts[key] = parsePillar(pillars[key], key);
  }
  const dayGan = parts.day.gan;
  const pillarsOut = {};
  for (const key of PILLAR_KEYS) {
    const p = parts[key];
    pillarsOut[key] = {
      gan: p.gan,
      zhi: p.zhi,
      ganGod: key === 'day' ? '日主' : tenGod(dayGan, p.gan),
      changSheng: changSheng(dayGan, p.zhi),
      hidden: HIDDEN[p.zhi].map((h, i) => ({
        gan: h,
        god: tenGod(dayGan, h),
        weight: HIDDEN_WEIGHT[HIDDEN[p.zhi].length][i],
      })),
    };
  }
  return {
    input: { gender, genderNorm: normalizeGender(gender) },
    pillars: pillarsOut,
    dayGan,
    dayZhi: parts.day.zhi,
    dayMaster: { gan: dayGan, ...GAN[dayGan] },
    monthGan: parts.month.gan,
    monthZhi: parts.month.zhi,
    yearGan: parts.year.gan,
    yearZhi: parts.year.zhi,
    hourGan: parts.time.gan,
    hourZhi: parts.time.zhi,
  };
}

/**
 * Phân tích tứ trụ trực tiếp — CHUỖI GIỐNG analyze() của chart.js
 * (scoreWuXing → kongwang weaken → strength → interactions → shensha →
 *  pattern → yong → patternQuality → 病药 rescue/promotion).
 * Trả về R rút gọn: { chart, wx, strength, interactions, shensha, pattern,
 *                      yong, kongwang, patternQuality }
 */
export function analyzePillars(pillars, gender = 'male') {
  parseGender(gender);
  const chart = buildChartFromPillars(pillars, gender);
  const wx = scoreWuXing(chart);

  // [chart.js loop 148] 空亡 — tàng can trụ void giảm 50% (trước strength)
  let kongwang = null;
  try {
    kongwang = analyzeKongwang(chart);
    if (kongwang && kongwang.affected && kongwang.affected.length) {
      const voidPillars = new Set(kongwang.affected.map((a) => a.pos));
      for (const d of wx.detail) {
        if (d.src && d.src.startsWith('Tàng') && voidPillars.has(d.src.replace('Tàng ', ''))) {
          const old = d.pts;
          d.pts = +(old * 0.5).toFixed(3);
          wx.score[d.wx] = +(wx.score[d.wx] - old + d.pts).toFixed(3);
          d.kong = true;
        }
      }
      const kwTotal = Object.values(wx.score).reduce((a, b) => a + b, 0);
      wx.total = +kwTotal.toFixed(3);
      for (const w of WUXING) wx.pct[w] = +((wx.score[w] / kwTotal) * 100).toFixed(1);
    }
  } catch (e) { /* kongwang optional */ }
  if (kongwang && kongwang.affected) {
    chart._kongwangPillars = kongwang.affected.map((a) => a.pos);
  }

  const strength = analyzeStrength(chart, wx);
  const interactions = detectInteractions(chart.pillars);
  const shensha = computeShensha(chart);
  const pattern = computePattern(chart, wx, strength, interactions);
  const yong = findYongShen(chart, wx, strength, pattern, interactions);
  let patternQualityResult = null;
  try { patternQualityResult = patternQuality({ chart, pattern, strength, interactions }); } catch (e) { patternQualityResult = null; }

  // ===== [chart.js loop 1384] kỵ-thân authoritative (Phù Ức) =====
  const dmWx = chart.dayMaster.wx;
  const _strengthKỵ = strength.strong
    ? [dmWx, SHENG_BY[dmWx]]
    : strength.strong === false
      ? [KE[dmWx], KE_BY[dmWx], SHENG[dmWx]]
      : [];

  // ===== [chart.js loop 37] 病药 rescue (pattern-quality) → secondary =====
  try {
    if (patternQualityResult && patternQualityResult.rescues && patternQualityResult.rescues.length) {
      const GROUP_WX = { ti: dmWx, yin: SHENG_BY[dmWx], shi: SHENG[dmWx], cai: KE[dmWx], guan: KE_BY[dmWx] };
      for (const r of patternQualityResult.rescues) {
        const drugGroups = r.drug || [];
        if (!drugGroups.length) continue;
        const drugWx = GROUP_WX[drugGroups[0]];
        if (drugWx && drugWx !== yong.primary && drugWx !== yong.secondary && !_strengthKỵ.includes(drugWx)) {
          yong.secondary = drugWx;
          yong.reasons.push(`💊 Bệnh Dược (病药 từ pattern-quality): «${(r.diseaseNote || r.note || '').slice(0, 60)}» → thuốc nhóm ${drugGroups[0]} (hành ${drugWx}) → ưu tiên làm Dụng thứ cấp.`);
          if (!yong.method.includes('Bệnh Dược (病药)')) yong.method.push('Bệnh Dược (病药)');
          if (drugWx !== yong.ji && drugWx !== yong.chou) {
            yong.avoid = yong.avoid.filter((w) => w !== drugWx);
          }
        }
      }
    }
  } catch (e) { /* enrichment optional */ }

  // ===== [chart.js loop 41] 病药 → PRIMARY (败中有救) =====
  try {
    if (patternQualityResult && patternQualityResult.quality === '有救'
        && !(yong.tiaohou?.override) && patternQualityResult.rescues?.length) {
      const GROUP_WX = { ti: dmWx, yin: SHENG_BY[dmWx], shi: SHENG[dmWx], cai: KE[dmWx], guan: KE_BY[dmWx] };
      const firstRescue = patternQualityResult.rescues[0];
      const drugWx = firstRescue.drug?.length ? GROUP_WX[firstRescue.drug[0]] : null;
      if (drugWx && drugWx !== yong.primary && !_strengthKỵ.includes(drugWx)) {
        const oldPrimary = yong.primary;
        yong.primary = drugWx;
        yong.secondary = oldPrimary;
        yong.xi = SHENG_BY[drugWx];
        yong.ji = KE_BY[drugWx];
        yong.chou = SHENG_BY[yong.ji];
        yong.xian = SHENG[drugWx];
        yong.avoid = yong.avoid.filter((w) => w !== drugWx && w !== yong.xi && w !== yong.secondary);
        for (const w of [yong.ji, yong.chou]) if (w && !yong.avoid.includes(w)) yong.avoid.push(w);
        yong.reasons.push(`★ Bệnh Dược LÀM CHỦ (败中有成): mệnh «${patternQualityResult.quality}» → Dụng Thần CHÍNH = ${drugWx} («有病方为贵»). Phù Ức cũ (${oldPrimary}) giáng secondary.`);
      }
    }
  } catch (e) { /* promotion optional */ }
  if (yong.secondary && yong.avoid.includes(yong.secondary)) yong.secondary = '';

  return { chart, wx, strength, interactions, shensha, pattern, yong, kongwang, patternQuality: patternQualityResult };
}

/** Bản tóm tắt phẳng tiện cho runner/regression: xuất các field chấm điểm. */
export function analyzeSummary(pillars, gender = 'male') {
  const R = analyzePillars(pillars, gender);
  return {
    strengthLevel: R.strength.level,           // 'Thân vượng' / 'Thân nhược' / ...
    strengthStrong: R.strength.strong,         // true/false
    strengthEffRatio: R.strength.effRatio,
    patternName: R.pattern.name,               // 汉字: '七殺格' / '從財格' / ...
    patternVi: R.pattern.vi,                   // Việt: 'Thất Sát cách' / ...
    patternType: R.pattern.type,               // 'normal' | 'luyue' | 'special'
    yongPrimary: R.yong.primary,               // '木' | '火' | ...
    yongSecondary: R.yong.secondary || null,
    patternQualityQuality: R.patternQuality?.quality ?? null,
  };
}
