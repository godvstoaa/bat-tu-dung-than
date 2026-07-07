// ============================================================================
//  TANG GIA 丧家 — ENGINE LUẬN TANG (ai mất / năm nào) CHO APP BÁT TỰ
//  [loop 1382] Phase upgrade — wire tang-data.js (5 vòng research, APPROVE) vào app.
//  ----------------------------------------------------------------------------
//  NGUYÊN LÝ (chốt verify nguyên văn 三命通会 卷三 + caveat «否则不验»):
//    · Tang = tổng hợp TIN HIỆU (thần sát tang + lục thân tinh + cung vị + timing).
//    · CHỐT CHỐNG BÁO GIẢ: đơn độc gặp 丧门/吊客 lưu niên = nhiễu, KHÔNG báo tang.
//      Phải có THÊM xung/hội/hình/hung-sát đồng lâm («吊客要见有煞忌星来冲会…否则不验»).
//      → Engine chỉ emit năm khi strength ≥ THRESHOLD (≥2 tín hiệu hoặc 1 cơ chế mạnh).
//    · Certainty luôn low/medium/high — KHÔNG BAO GIỜ «certain». Mọi output kèm
//      TANG_ETHICS.disclaimerVi (caveat mềm hoá, không dọa nạt, opt-in).
//  ----------------------------------------------------------------------------
//  OUTPUT: { ethics, natalStars, scanRange, years:[{year,age,ganZhi,strength,level,
//           signals:[{mech,relative,weight,detail}], caveat}], topRisk, summary }
//  Defensive: toàn bộ wrap try/catch — tang là tầng OPT-IN bonus, không được làm
//  crash app. Lỗi → trả safe default {} (caller check).
// ============================================================================
import { ZHI_ORDER, GAN, TEN_GOD_VI } from './constants.js';
import { ZHI_CHONG_MAP, ZHI_HAI_MAP, ZHI_XING_PAIRS, ZHI_XING_SELF } from './interactions.js';
import { YANG_REN } from './shensha.js';
import { tenGod } from './core.js';
import { bingLinInfo } from './suiyun.js'; // [loop 1382] DRY — framing 岁运并临 (Dụng/Kỵ)
import { Solar } from 'lunar-javascript';
import { TANG_DATA, RULES_LUC_THAN, PALACE_RULES, TIMING_RULES, TANG_ETHICS } from './tang-data.js';

// ---- helper index / quan hệ ----
const _idx = (z) => (ZHI_ORDER.includes(z) ? ZHI_ORDER.indexOf(z) : -1);
const _chong = (a, b) => !!(a && b && ZHI_CHONG_MAP[a + b]);
const _hai = (a, b) => !!(a && b && ZHI_HAI_MAP[a + b]); // 六害 = 穿 (mangpai trọng)
const _xing = (a, b) => {
  if (!a || !b) return false;
  if (a === b && ZHI_XING_SELF.includes(a)) return true; // tự hình
  return ZHI_XING_PAIRS.some((p) => (p.pair[0] === a && p.pair[1] === b) || (p.pair[0] === b && p.pair[1] === a));
};
const _wx = (g) => (g && GAN[g] ? GAN[g].wx : null);
// a khắc b (ngũ hành): wx(a) sinh ra wx bị khắc = wx(b)
const _ke = require_ke();
function require_ke() {
  // KE map: element → element nó khắc. Import lười để tránh phụ thuộc thứ tự.
  // Nguồn: constants.KE. Nếu không lấy được, fallback bảng ngũ hành khắc.
  const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
  return (a, b) => { const wa = _wx(a), wb = _wx(b); return !!(wa && wb && KE[wa] === wb); };
}
const _isFemale = (g) => !!(g && /nữ|nu|fem|^f$/i.test(String(g)));

// 柱 → cung lục thân (V3)
const PILLAR_RELATIVES = {
  year: ['ông bà / người lớn tuổi trong họ'],
  month: ['cha mẹ', 'anh chị em'],
  day: ['vợ / chồng (cung phối ngẫu)', 'bản thân'],
  time: ['con cái'],
};
// thập thần (gan) → người thân, theo giới (V2 子平, đồng bộ family.js:elementForRole)
function ganGodToRelative(god, isFemale) {
  if (!god) return null;
  if (isFemale) {
    if (god === '正官' || god === '七杀') return 'chồng';
    if (god === '食神' || god === '伤官') return 'con cái';
    if (god === '正财' || god === '偏财') return 'cha';
    if (god === '正印' || god === '偏印') return 'mẹ';
    if (god === '比肩' || god === '劫财') return 'anh chị em';
  } else {
    if (god === '偏财') return 'cha';
    if (god === '正财') return 'vợ';
    if (god === '正印') return 'mẹ';
    if (god === '偏印') return 'người mẹ thứ / dưỡng mẫu';
    if (god === '七杀' || god === '正官') return 'con cái';
    if (god === '食神' || god === '伤官') return 'con cái (nữ mạng đupe)'; // nam: do vợ sinh
    if (god === '比肩' || god === '劫财') return 'anh chị em';
  }
  return null;
}

// ---- THIẾT LẬP TRỌNG SỐ (theo PALACE/TIMING weights, chốt «否则不验») ----
const W = {
  spiritOnSubject: 0.25, // 丧门/白虎/吊客 đáo bản mệnh (lưu niên 12 thần) — nhẹ
  natalStarActivated: 0.45, // thần sát tang tọa thủ nguyên cục bị dy/ln xung/hại
  ganGodStarStressed: 0.5, // lục thân tinh (ganGod) bị dy/ln khắc
  palaceStressed: 0.45, // cung (chi trụ) bị dy/ln xung/hại/hình
  tianKeDiChong: 0.8, // 天克地冲 vs trụ (gan khắc + chi xung) — mạnh
  suiYunBingLin: 0.4, // 岁运并临 — kèm caveat tranh cãi
  yangRenXung: 0.55, // 羊刃 bị xung
  ruMuBonus: 0.3, // nhập mộ (辰戌丑未) bonus khi lục thân bị stressed
};
const THRESHOLD = 0.7; // strength ≥ 0.7 mới emit (chống báo giả)
const FOUR_MU = new Set(['辰', '戌', '丑', '未']);

// Lấy can-chi lưu niên của 1 năm dương lịch (lấy giữa năm để chắc thuộc năm âm tương ứng)
function lnGanZhi(year) {
  try {
    const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0).getLunar();
    return { gan: s.getYearGan(), zhi: s.getYearZhi(), ganZhi: s.getYearGan() + s.getYearZhi() };
  } catch (e) {
    return { gan: null, zhi: null, ganZhi: null };
  }
}

// Đại vận active tại 1 năm (theo startAge, fallback startYear)
function activeDayunFor(R, year, age) {
  const dy = (R && R.dayun) || [];
  const byAge = dy.find((d) => d && d.startAge != null && age >= d.startAge && age < d.startAge + 10);
  if (byAge) return byAge;
  return dy.find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10) || null;
}

/**
 * Luận tang cho 1 lá số, quét 1 khoảng năm.
 * @param {object} R — report object (R.chart, R.dayun, R.yong, R.chart.input)
 * @param {object} [opt] — { curYear, spanBefore, spanAfter }
 *   curYear mặc định = năm hiện tại; span quét curYear-spanBefore..curYear+spanAfter.
 */
export function analyzeTang(R, opt = {}) {
  try {
    if (!R || !R.chart || !R.chart.pillars) return _empty();
    const c = R.chart;
    const dayGan = c.dayGan;
    const birthYear = c.input && c.input.year;
    if (!dayGan || !birthYear) return _empty();
    const isFemale = _isFemale(c.input && c.input.gender);
    const curYear = opt.curYear || new Date().getFullYear();
    const before = opt.spanBefore != null ? opt.spanBefore : 2;
    const after = opt.spanAfter != null ? opt.spanAfter : 7;
    const fromY = curYear - before;
    const toY = curYear + after;

    const birthZhi = c.pillars.year.zhi;
    const birthZhiIdx = _idx(birthZhi);
    const pillars = ['year', 'month', 'day', 'time'].map((k) => ({ key: k, ...c.pillars[k] }));

    // ---- 1. Thần sát tang tọa thủ nguyên cục (V1, theo birth year chi) ----
    const natalStars = [];
    for (const [star, tbl] of [
      ['丧门 (Tang Môn)', TANG_DATA.TANG_MEN],
      ['吊客 (Điếu Khách)', TANG_DATA.DIAO_KE],
      ['披麻 (Pi Ma)', TANG_DATA.PI_MA],
      ['白虎 (Bạch Hổ)', TANG_DATA.BAI_HU_LIUNIAN],
    ]) {
      const pos = tbl && tbl[birthZhi];
      if (!pos) continue;
      const hit = pillars.find((p) => p.zhi === pos);
      if (hit) natalStars.push({ star, at: pos, pillar: hit.key, note: `${star} tọa ${PALACE_RULES.pillars[hit.key]?.relatives?.join('/') || hit.key} — dễ kích khi đại vận/lưu niên xung.` });
    }

    // ---- 2. Quét từng năm ----
    const years = [];
    const decadeMap = {}; // đại vận ganZhi → dyContext signals (bối cảnh thập niên, không pinpoint năm)
    for (let y = fromY; y <= toY; y++) {
      const ln = lnGanZhi(y);
      if (!ln.ganZhi) continue;
      const age = y - birthYear;
      const dy = activeDayunFor(R, y, age);
      const dyGan = dy && dy.gan;
      const dyZhi = dy && dy.zhi;
      const signals = [];
      const relSet = new Set();

      const dyContext = []; // tín hiệu do ĐẠI VẬN (cố định cả thập niên) — context, KHÔNG tự emit năm
      const lnHitPillar = new Set(); // các trụ bị LƯU NIÊN đụng (để gate emit)

      // 2A. Lưu niên 12 thần đáo bản mệnh: godIdx = (birthIdx - yearIdx) mod 12
      const lnZhiIdx = _idx(ln.zhi);
      if (birthZhiIdx >= 0 && lnZhiIdx >= 0) {
        const godIdx = ((birthZhiIdx - lnZhiIdx) % 12 + 12) % 12;
        const onSub = { 2: '丧门', 8: '白虎', 10: '吊客' }[godIdx];
        if (onSub) signals.push({ mech: `${onSub} đáo bản mệnh (lưu niên 12 thần)`, relative: 'bản thân / gia đình', weight: W.spiritOnSubject, lnDriven: true, detail: `${onSub} thuộc 12 thần lưu niên, TẦNG tin phụ — đơn độc chưa đủ, cần phối xung/hung sát.` });
      }

      // 2B. Thần sát tang (V1 natal) bị đại vận/lưu niên xung/hại → kích hoạt
      for (const ns of natalStars) {
        const posChi = ns.at;
        const byLn = _chong(ln.zhi, posChi) || _hai(ln.zhi, posChi);
        const byDy = dyZhi && (_chong(dyZhi, posChi) || _hai(dyZhi, posChi));
        if (byLn || byDy) {
          const rels = PALACE_RULES.pillars[ns.pillar]?.relatives || [];
          rels.forEach((r) => relSet.add(r));
          const tgt = `${ns.star} (tọa ${ns.pillar}) bị ${byLn ? 'lưu niên' : 'đại vận'} xung/hại → kích`;
          if (byLn) { signals.push({ mech: tgt, relative: rels.join('/'), weight: W.natalStarActivated, lnDriven: true, detail: 'Sao tang tọa thủ nguyên cục chỉ dormant; bị LƯU NIÊN xung/hại mới linh (pinpoint năm).' }); lnHitPillar.add(ns.pillar); }
          else dyContext.push({ mech: tgt, relative: rels.join('/'), weight: W.natalStarActivated * 0.6, detail: 'Kích bởi ĐẠI VẬN — bối cảnh thập niên, chưa pinpoint năm.' });
        }
      }

      // 2C+2D. Quét 4 trụ: tinh (ganGod) + cung (chi) bị thương / 天克地冲
      for (const p of pillars) {
        if (!p.gan || !p.zhi) continue;
        const palaceRels = PILLAR_RELATIVES[p.key] || [];
        const ageRange = PALACE_RULES.pillars[p.key]?.ageRange || '';
        // chi bị xung/hại/hình — tách ln vs dy
        const hit = (src) => { if (!src) return null; if (_chong(src, p.zhi)) return 'xung'; if (_hai(src, p.zhi)) return 'hại'; if (_xing(src, p.zhi)) return 'hình'; return null; };
        const lnHit = hit(ln.zhi), dyHit = dyZhi ? hit(dyZhi) : null;
        if (lnHit) {
          palaceRels.forEach((r) => relSet.add(r));
          let w = W.palaceStressed;
          const detail = `Trụ ${p.key.toUpperCase()} (${ageRange}) = cung ${palaceRels.join('/')}. Lưu niên ${ln.zhi} ${lnHit} ${p.zhi}.`;
          if (FOUR_MU.has(p.zhi)) w += W.ruMuBonus;
          signals.push({ mech: `Cung ${p.key} bị LƯU NIÊN ${lnHit}`, relative: palaceRels.join('/'), weight: w, lnDriven: true, detail: detail + (FOUR_MU.has(p.zhi) ? ' Chi tứ mộ → +入墓.' : '') });
          lnHitPillar.add(p.key);
        }
        if (dyHit) dyContext.push({ mech: `Cung ${p.key} bị đại vận ${dyHit} (bối cảnh thập niên)`, relative: palaceRels.join('/'), weight: W.palaceStressed * 0.55, detail: `Đại vận ${dyZhi} ${dyHit} ${p.zhi} — áp lực CẢ thập niên lên cung ${palaceRels.join('/')}.` });
        // gan bị khắc bởi ln gan → lục thân tinh stressed (ln-driven)
        if (ln.gan && _ke(ln.gan, p.gan)) {
          const god = p.ganGod;
          const rel = ganGodToRelative(god, isFemale);
          if (rel) {
            relSet.add(rel);
            signals.push({ mech: `Lục thân tinh ${god || '?'} (${TEN_GOD_VI[god] || ''} = ${rel}) bị lưu niên ${ln.gan} khắc`, relative: rel, weight: W.ganGodStarStressed, lnDriven: true, detail: `Trụ ${p.key.toUpperCase()} gan ${p.gan} (${god}) đại diện ${rel}; lưu niên ${ln.gan} khắc → tổn thương năm này.` });
            lnHitPillar.add(p.key);
          }
        }
        // 天克地冲 vs trụ (lnGan khắc p.gan AND lnZhi xung p.zhi) — mạnh nhất, ln-driven
        if (ln.gan && ln.zhi && _ke(ln.gan, p.gan) && _chong(ln.zhi, p.zhi)) {
          palaceRels.forEach((r) => relSet.add(r));
          signals.push({ mech: `天克地冲 → trụ ${p.key.toUpperCase()}`, relative: palaceRels.join('/'), weight: W.tianKeDiChong, lnDriven: true, detail: `Lưu niên ${ln.ganZhi}: ${ln.gan} khắc ${p.gan} + ${ln.zhi} xung ${p.zhi}. Trúng cung ${palaceRels.join('/')} → tín hiệu MẠNH, pinpoint năm.` });
          lnHitPillar.add(p.key);
        }
      }

      // 2E. 岁运并临 — lưu niên === đại vận → ln-driven, framing DRY qua bingLinInfo (Dụng/Kỵ sign).
      //   Logic [loop 1382]: 岁运并临 + Kỵ thần → tang-relevant CAO hơn (lực nghịch nhân đôi);
      //   + Dụng thần → cát, ít liên quan tang → weight thấp hơn.
      if (dy && dy.ganZhi) {
        const _bl = bingLinInfo(dy.ganZhi, ln.ganZhi, R.yong);
        if (_bl.binglin) {
          const _w = _bl.sign < 0 ? W.suiYunBingLin + 0.2 : _bl.sign > 0 ? W.suiYunBingLin - 0.15 : W.suiYunBingLin;
          signals.push({ mech: `岁运并临 (đại vận trùng lưu niên ${ln.ganZhi})${_bl.sign > 0 ? ' ★Dụng→cát' : _bl.sign < 0 ? ' ⚠Kỵ→hung' : ''}`, relative: 'bản thân / người thân', weight: _w, lnDriven: true, controversial: true, detail: _bl.note });
        }
      }

      // 2F. 羊刃 bị xung (V4) — YANG_REN[dayGan] vị bị ln/dy chi xung
      const yrPos = YANG_REN[dayGan];
      if (yrPos) {
        const byLn = _chong(ln.zhi, yrPos);
        const byDy = dyZhi && _chong(dyZhi, yrPos);
        if (byLn) signals.push({ mech: `羊刃 (${yrPos}) bị lưu niên xung`, relative: 'bản thân / phối ngẫu', weight: W.yangRenXung, lnDriven: true, detail: `Dương Nhận của ${dayGan} tại ${yrPos} bị lưu niên ${ln.zhi} xung → hung (huyết quang / tang phối ngẫu nếu phối «孤寡»).` });
        else if (byDy) dyContext.push({ mech: `羊刃 (${yrPos}) bị đại vận xung (bối cảnh)`, relative: 'bản thân / phối ngẫu', weight: W.yangRenXung * 0.6, detail: 'Kích bởi đại vận — áp lực thập niên.' });
      }

      // ---- tổng hợp strength (chỉ ln-driven signal mới góp vào emit) ----
      const strength = signals.reduce((s, x) => s + x.weight, 0);
      const hasLnDriven = signals.some((s) => s.lnDriven);
      // «否则不验»: phải (a) đủ strength VÀ (b) có trigger lưu niên-specific (pinpoint năm)
      if (strength < THRESHOLD || !hasLnDriven) {
        // năm không emit — nhưng nếu có dyContext đáng kể, ghi nhận vào decadeNote
        if (dyContext.length) _recordDecade(decadeMap, dy.ganZhi, dyContext);
        continue;
      }
      const level = strength >= 1.7 ? 'high' : strength >= 1.1 ? 'medium' : 'low';
      years.push({
        year: y,
        age,
        ganZhi: ln.ganZhi,
        activeDayun: dy ? dy.ganZhi : null,
        strength: +strength.toFixed(2),
        level,
        relatives: [...relSet],
        signals: signals.map((s) => ({ ...s, certainty: s.weight >= 0.8 ? 'high' : s.weight >= 0.5 ? 'medium' : 'low' })),
        caveat: TANG_ETHICS.disclaimerVi,
      });
    }

    // ---- 3. topRisk: top 5 năm mạnh nhất ----
    const topRisk = years
      .slice()
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 5)
      .map((y) => ({ year: y.year, age: y.age, ganZhi: y.ganZhi, level: y.level, relatives: y.relatives, mechs: y.signals.map((s) => s.mech) }));

    return { ethics: TANG_ETHICS, enabled: true, natalStars, scanRange: [fromY, toY], years, topRisk, decadeStress: _decadeStress(decadeMap), summary: _summary(years, natalStars, _decadeStress(decadeMap)) };
  } catch (e) {
    return _empty();
  }
}

function _summary(years, natalStars, decadeStress) {
  const ns = natalStars && natalStars.length ? `Nguyên cục ${natalStars.map((n) => `${n.star}@${n.pillar}`).join(', ')} (dormant unless kích). ` : '';
  const dec = decadeStress && decadeStress.length ? `Bối cảnh thập niên: ${decadeStress.map((d) => `${d.dayun} (${d.relatives.join('/')})`).join('; ')}. ` : '';
  if (!years || !years.length) return ns + dec + 'Không có năm nào đạt ngưỡng tang CÓ trigger lưu niên (chốt «吊客单见否则不验») trong khoảng quét. ' + TANG_ETHICS.disclaimerVi;
  const top = years.slice().sort((a, b) => b.strength - a.strength).slice(0, 3);
  const head = top.map((y) => `${y.year} (${y.ganZhi}, ${y.age}t, ${y.level}): ${[...new Set(y.relatives)].join('/') || 'bản thân/gia'} — ${y.signals.filter((s) => s.lnDriven).slice(0, 2).map((s) => s.mech).join('; ')}`).join(' | ');
  return ns + dec + head + '. ' + TANG_ETHICS.disclaimerVi;
}

// Gom dyContext theo đại vận ganZhi — bối cảnh thập niên (không pinpoint năm)
function _recordDecade(map, ganZhi, ctx) {
  if (!ganZhi || !ctx || !ctx.length) return;
  if (!map[ganZhi]) map[ganZhi] = { dayun: ganZhi, weight: 0, relatives: new Set(), mechs: [] };
  const e = map[ganZhi];
  for (const c of ctx) { e.weight += c.weight || 0; (c.relative || '').split('/').forEach((r) => r && e.relatives.add(r.trim())); e.mechs.push(c.mech); }
}
function _decadeStress(map) {
  return Object.values(map || {})
    .map((e) => ({ dayun: e.dayun, weight: +e.weight.toFixed(2), relatives: [...e.relatives], mechs: [...new Set(e.mechs)] }))
    .filter((e) => e.weight >= THRESHOLD)
    .sort((a, b) => b.weight - a.weight);
}

function _empty() {
  return { ethics: TANG_ETHICS, enabled: false, natalStars: [], scanRange: null, years: [], topRisk: [], summary: '(tang-analyze không khả dụng — thiếu dữ liệu lá số).' };
}

export default analyzeTang;
