// ============================================================================
//  ÂM TÀ / VONG HỒN / TRỪ TÀ — ENGINE DETECT TÍN HIỆU (Bát Tự app)
//  [loop 1383] Phase upgrade — wire amta-data.js (10 vòng research, APPROVE) vào app.
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS BUỘC ĐỌC (xuất phát từ amta-data.js ETHICS) ⚠
//    · Engine CHỈ detect «TÍN HIỆU TƯỢNG» cổ pháp (thần煞 + cấu trúc trụ). Output
//      là TỔNG SYMBOLIC (tally strength), KHÔNG PHẢI chẩn đoán «bị ma / bị quỷ /
//      bị附身». Mọi kết luận = «theo cổ pháp, có thể…», KHÔNG chắc chắn.
//    · KHÔNG map cứng «indicator X → bạn bị vong Y». Chỉ REFERENCE spiritTypes +
//      remedies (tham khảo văn hoá-tôn giáo). Mapping chẩn đoán do AI/user trong
//      khung ETHICS, KHÔNG do engine đoán chắc.
//    · Opt-in bắt buộc (ETHICS.optInRequired). Luôn kèm disclaimerVi.
//    ·Với distress thật (mất ngủ/hoang tưởng/tự hại): redirect chuyên gia y tế.
//  ----------------------------------------------------------------------------
//  OUTPUT: { ethics, detected:[{id,indicator,meaning,strength,sources}],
//            susceptibility:{score,level,note}, referencedTypes, referencedRemedies,
//            summary }
//  Defensive: try/catch toàn bộ — tầng opt-in bonus, không được crash app.
// ============================================================================
import { GAN, ZHI_ORDER } from './constants.js';
import { HUA_GAI, BRANCH_GROUP } from './shensha.js';
import { TANG_MEN, DIAO_KE } from './tang-data.js';
import { taiYuan } from './taiyuan.js';
import { ETHICS, indicators, spiritTypes, remedies } from './amta-data.js';
import { Solar } from 'lunar-javascript';

// ---- lookup tables (chuẩn cổ pháp, [loop 1383] đã đối chiếu 孤辰寡宿 tam hội phương) ----
// 三会方 (seasonal) group cho 孤辰寡宿 — KHÔNG dùng tam hợp.
const SANCHUI = { 寅: 'spring', 卯: 'spring', 辰: 'spring', 巳: 'summer', 午: 'summer', 未: 'summer', 申: 'autumn', 酉: 'autumn', 戌: 'autumn', 亥: 'winter', 子: 'winter', 丑: 'winter' };
const GUCHEN_GUASU = {
  spring: { guchen: '巳', guasu: '丑' },
  summer: { guchen: '申', guasu: '辰' },
  autumn: { guchen: '亥', guasu: '未' },
  winter: { guchen: '寅', guasu: '戌' },
};
// 劫煞 + 亡神 (theo tam hợp cục BRANCH_GROUP): 劫煞=绝地, 亡神=临官
const JIESHA = { A: '巳', B: '亥', C: '寅', D: '申' }; // A=申子辰(水绝巳) B=寅午戌(火绝亥) C=巳酉丑(金绝寅) D=亥卯未(木绝申)
const WANGSHEN = { A: '亥', B: '巳', C: '申', D: '寅' }; // 临官位

// 四廢 (Tứ Phé) — ngày can-chi theo mùa (khí sức kiệt)
const SIFEI = {
  spring: ['庚申', '辛酉'],     // mùa xuân kim (被火克+休)
  summer: ['壬子', '癸亥'],     // mùa hạ thủy (被土克+囚)
  autumn: ['甲寅', '乙卯'],     // mùa thu mộc
  winter: ['丙午', '丁巳'],     // mùa đông hỏa
};
// 陰差陽錯 — 12 ngày phổ biến (淵海子平 verbatim «又看孤鸞之日、陽錯陰錯»)
const YINCHAYANGCUO = new Set(['丙子', '丁卯', '戊午', '己酉', '庚寅', '辛巳', '壬申', '癸亥', '乙丑', '戊辰', '辛未', '甲戌']);
// 四库 (tứ mộ)
const FOUR_MU = new Set(['辰', '戌', '丑', '未']);
// 太阴 (âm can — 丁己辛癸; 乙 cũng âm nhưng condition data liệt kê 4 cái)
const TAIYIN_GAN = new Set(['丁', '己', '辛', '癸']);
// KE_BY[dmWx] = hành khắc ta (= 官 sát hành). Import lười.
const KE_BY = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' };

const _idx = (z) => ZHI_ORDER.indexOf(z);

/**
 * Detect tín hiệu âm/tà trong lá số. TỔNG SYMBOLIC, KHÔNG chẩn đoán.
 * @param {object} R — report object (R.chart, R.strength, R.wx, R.yong)
 */
export function analyzeAmTa(R) {
  try {
    if (!R || !R.chart || !R.chart.pillars) return _empty();
    const c = R.chart;
    const dayGan = c.dayGan;
    const yearZhi = c.pillars.year.zhi;
    const monthZhi = c.monthZhi;
    const monthGan = c.pillars.month.gan;
    if (!dayGan || !yearZhi) return _empty();
    const dmWx = GAN[dayGan] ? GAN[dayGan].wx : null;
    const pillars = ['year', 'month', 'day', 'time'].map((k) => ({ key: k, ...c.pillars[k] }));
    const allZhi = pillars.map((p) => p.zhi).filter(Boolean);
    const dayGZ = c.pillars.day.gan + c.pillars.day.zhi;
    const detected = [];

    const push = (id) => { const it = indicators.find((x) => x.id === id); if (it) detected.push({ id: it.id, indicator: it.indicator, meaning: it.meaning, strength: it.strength, sources: it.sources }); };

    // 1. 華蓋 + 太陰 — Hoa Cái tọa + can âm
    const hgGroup = BRANCH_GROUP[yearZhi];
    const hgPos = hgGroup ? HUA_GAI[hgGroup] : null;
    if (hgPos && allZhi.includes(hgPos)) {
      const hasTaiyin = pillars.some((p) => p.gan && TAIYIN_GAN.has(p.gan));
      if (hasTaiyin) push('huagai-taiyin');
    }
    // 2. 孤辰寡宿 (tam hội phương theo năm chi)
    const season = SANCHUI[yearZhi];
    if (season) {
      const gg = GUCHEN_GUASU[season];
      if (gg && (allZhi.includes(gg.guchen) || allZhi.includes(gg.guasu))) push('guchen-guasu');
    }
    // 3. 弔客 / 喪門 tọa thủ nguyên cục (theo birth year chi — reuse tang-data)
    const tmPos = TANG_MEN[yearZhi], dkPos = DIAO_KE[yearZhi];
    if ((tmPos && allZhi.includes(tmPos)) || (dkPos && allZhi.includes(dkPos))) push('diaoke');
    // 4. 四廢 (day ganZhi theo mùa của monthZhi)
    const mSeason = SANCHUI[monthZhi];
    if (mSeason && SIFEI[mSeason].includes(dayGZ)) push('sifei');
    // 5. 陰差陽錯 (day ganZhi)
    if (YINCHAYANGCUO.has(dayGZ)) push('yinchayangcuo');
    // 6. 胎元 gặp 四库
    try {
      const ty = taiYuan(monthGan, monthZhi);
      const tyZhi = (ty && (ty.zhi || (ty.gz && ty.gz[1]))) || null;
      if (tyZhi && FOUR_MU.has(tyZhi)) push('taiyuan-meet-mo');
    } catch (_) {}
    // 7. 日主 nhược + 官殺 vượng
    const strong = R.strength && R.strength.strong;
    if (strong === false && dmWx && R.wx && R.wx.score) {
      const guanWx = KE_BY[dmWx];
      const guanScore = (R.wx.score[guanWx] || 0) / (R.wx.total || 1);
      if (guanScore >= 0.2) push('rizhuo-weak-guansha-strong');
    }
    // 8. 鬼月 (tháng 7 âm lịch hiện tại) — contextual, không phụ thuộc lá số
    let isGhostMonth = false;
    try { const lm = Solar.fromDate(new Date()).getLunar().getMonth(); isGhostMonth = (lm === 7); } catch (_) {}
    if (isGhostMonth) push('guiyue-7th-month');
    // 9. 劫煞 / 亡神 (tam hợp cục)
    const grp = BRANCH_GROUP[yearZhi];
    if (grp) {
      const js = JIESHA[grp], ws = WANGSHEN[grp];
      if ((js && allZhi.includes(js)) || (ws && allZhi.includes(ws))) push('jiesha-wangshen');
    }

    // ---- tổng symbolic (KHÔNG chẩn đoán) ----
    const score = detected.reduce((s, d) => s + (d.strength || 1), 0);
    const level = score >= 12 ? 'high' : score >= 7 ? 'medium' : score >= 3 ? 'low' : 'minimal';
    const note =
      level === 'minimal'
        ? 'Ít/ko có tín hiệu tượng nổi bật — theo cổ pháp, không có gì đáng lưu tâm âm-tà.'
        : `Tổng ${score} điểm tượng từ ${detected.length} indicator (mức ${level}). ĐÂY LÀ TỔNG SYMBOLIC cổ pháp — KHÔNG phải «độ bị ma», KHÔNG chẩn đoán. Chỉ là tư liệu tham khảo văn hoá-tôn giáo.`;

    // ---- REFERENCE spiritTypes + remedies (KHÔNG map chẩn đoán cứng) ----
    // Chỉ gợi ý reference khi có tín hiệu tang/hiếu (弔客) → 先靈/橫亡 ngữ cảnh 中元;
    // khi 鬼月 → 普度 cô hồn; khi nhiều indicator → remedies chung (淨宅/誦經) + caveat «do đạo sĩ».
    const referencedTypes = [];
    if (detected.some((d) => d.id === 'diaoke')) {
      referencedTypes.push(spiritTypes.find((t) => t.id === 'xianling-ancestors'));
      referencedTypes.push(spiritTypes.find((t) => t.id === 'hengwang-yuanling'));
    }
    if (isGhostMonth) referencedTypes.push(spiritTypes.find((t) => t.id === 'hengwang-yuanling'));
    const referencedRemedies = level === 'minimal' ? [] : [remedies.find((r) => r.id === 'remedy-jingzhai'), remedies.find((r) => r.id === 'remedy-fu')].filter(Boolean);

    return {
      ethics: ETHICS,
      enabled: true,
      detected,
      susceptibility: { score, level, note },
      referencedTypes: referencedTypes.filter(Boolean).map((t) => ({ id: t.id, type: t.type, signs: t.signs, distinctFrom: t.distinctFrom })),
      referencedRemedies: referencedRemedies.filter(Boolean).map((r) => ({ id: r.id, type: r.type, caveat: r.caveat })),
      summary: _summary(detected, level, score),
    };
  } catch (e) {
    return _empty();
  }
}

function _summary(detected, level, score) {
  if (!detected || !detected.length) return 'Không detect tín hiệu âm/tà tượng nào nổi bật trong lá số. ' + ETHICS.disclaimerVi;
  const list = detected.slice(0, 5).map((d) => `${d.indicator} (strength ${d.strength})`).join('; ');
  return `Tín hiệu tượng (mức ${level}, ${score}đ): ${list}. CHỈ là tài liệu tham khảo văn hoá-tôn giáo, KHÔNG phải chẩn đoán «bị ma/tà» — mọi tín hiệu là XÁC SUẤT/TƯỢNG theo cổ pháp. ${ETHICS.disclaimerVi}`;
}

function _empty() {
  return { ethics: ETHICS, enabled: false, detected: [], susceptibility: { score: 0, level: 'minimal', note: '(amta-analyze không khả dụng — thiếu dữ liệu lá số).' }, referencedTypes: [], referencedRemedies: [], summary: '(amta không khả dụng).' };
}

export default analyzeAmTa;
