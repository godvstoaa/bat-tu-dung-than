// ============================================================================
//  ĐỘNG CƠ LUẬN MỆNH BÁT TỰ (deterministic, nâng cấp toàn diện)
//  Pipeline: Tứ Trụ → Ngũ Hành → Thập Thần → Vượng Suy → Hội Hợp →
//            Cách Cục → Dụng Thần (Phù Ức + Thông Quan + Bệnh Dược + Điều Hậu)
//            → Đại Vận + Lưu Niên + Thần Sát.
// ============================================================================
import { Solar } from 'lunar-javascript';
import {
  GAN, ZHI, HIDDEN, HIDDEN_WEIGHT, WUXING, SHENG, KE, KE_BY, SHENG_BY,
  TIAOHOU, CLIMATE, WX_VI, TEN_GOD_VI,
} from './constants.js';
import { tenGod, changSheng } from './core.js';
import { detectInteractions } from './interactions.js';
import { computeShensha } from './shensha.js';
import { computePattern } from './pattern.js';
import { patternQuality, adjustDayunByGeju, adjustLiunianByGeju } from './pattern-quality.js';
import { synthesize } from './synthesis.js';
import { analyzeLiuqin } from './liuqin.js';
import { buildRemedy } from './remedy.js';
import { scoreLiunianYear } from './liunian-pro.js'; // [cycle 44] dùng chung score với analyzeLiunianDeep → không mâu thuẫn verdict
import { analyzeKongwang } from './kongwang.js'; // [loop 148] 空亡 effect on scoring
import { tongGen } from './tonggen.js'; // [loop 451] 得地 (thông căn) cho 三法 feedback vượng suy
import { analyzeYuanLiu } from './yuanliu.js'; // [loop 452] 源流 dòng khí ngũ hành (滴天髓源流篇)
import { analyzePillarQuality } from './pillar-quality.js'; // [loop 468] 盖头截脚 feed synthesis
export { synthesize };

export { tenGod, changSheng };

// Nhóm Thập Thần → hành tương ứng với Nhật Chủ
const GROUP_WX = (dmWx) => ({
  ti: dmWx,                 // Tỷ Kiếp
  yin: SHENG_BY[dmWx],      // Ấn (sinh thân)
  shi: SHENG[dmWx],         // Thực Thương (thân sinh)
  cai: KE[dmWx],            // Tài (thân khắc)
  guan: KE_BY[dmWx],        // Quan Sát (khắc thân)
});
const GROUP_VI = { ti: 'Tỷ Kiếp', yin: 'Ấn', shi: 'Thực Thương', cai: 'Tài', guan: 'Quan Sát' };

// ===========================================================================
//  1. TÍNH TỨ TRỤ
// ===========================================================================
// [loop 177] 子时换日 (zǐ-shí day-rollover) — cổ pháp 渊海子平/三命通会/滴天髓:
//   23:00+ (早子时) thuộc NGÀY HÔM SAU. lunar-javascript mặc định «00:00换日» (23:00=hiện tại),
//   nên phải roll. Map (D, 23:xx) → (D+1, 00:xx): giữ phút, giờ→0 (vị trí 晚子) để lưu-thời
//   can dùng ngũ-thử-độn TỪ ngày hôm sau (nếu giữ h=23, lunar-javascript lại lấy can ngày sau-nữa).
//   input (hiển thị) vẫn giữ giờ thật 23:xx; chỉ BÁT TỰ tính theo ngày_roll.
// [loop 178] export — 紫微 (computeZiwei) là lá số BẨM SINH cùng kiểu, phải dùng cùng quy ước.
export function ziShiRoll(year, month, day, hour, minute) {
  if (hour >= 23) {
    const dt = new Date(year, month - 1, day);
    dt.setDate(dt.getDate() + 1);
    return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 0, minute];
  }
  return [year, month, day, hour, minute];
}

export function buildChart(year, month, day, hour, minute, gender) {
  const [cy, cm, cd, ch, cmin] = ziShiRoll(year, month, day, hour, minute);
  const solar = Solar.fromYmdHms(cy, cm, cd, ch, cmin, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const pillars = {
    year:  { gan: ec.getYearGan(),  zhi: ec.getYearZhi(),  nayin: ec.getYearNaYin()  },
    month: { gan: ec.getMonthGan(), zhi: ec.getMonthZhi(), nayin: ec.getMonthNaYin() },
    day:   { gan: ec.getDayGan(),   zhi: ec.getDayZhi(),   nayin: ec.getDayNaYin()   },
    time:  { gan: ec.getTimeGan(),  zhi: ec.getTimeZhi(),  nayin: ec.getTimeNaYin()  },
  };
  const dayGan = pillars.day.gan;

  for (const key of ['year', 'month', 'day', 'time']) {
    const p = pillars[key];
    p.ganGod = key === 'day' ? '日主' : tenGod(dayGan, p.gan);
    p.changSheng = changSheng(dayGan, p.zhi);
    p.hidden = HIDDEN[p.zhi].map((h, i) => ({
      gan: h,
      god: tenGod(dayGan, h),
      weight: HIDDEN_WEIGHT[HIDDEN[p.zhi].length][i],
    }));
  }

  return {
    input: { year, month, day, hour, minute, gender },
    solar: solar.toYmdHms(),
    lunar: {
      text: lunar.toString(),
      year: lunar.getYearInChinese(),
      month: lunar.getMonthInChinese(),
      day: lunar.getDayInChinese(),
    },
    jieqi: {
      prev: { name: lunar.getPrevJieQi().getName(), time: lunar.getPrevJieQi().getSolar().toYmdHms() },
      next: { name: lunar.getNextJieQi().getName(), time: lunar.getNextJieQi().getSolar().toYmdHms() },
    },
    pillars,
    dayGan,
    dayMaster: { gan: dayGan, ...GAN[dayGan] },
    monthZhi: pillars.month.zhi,
  };
}

// ===========================================================================
//  2. CHO ĐIỂM NGŨ HÀNH (nguyệt lệnh nhân trọng số cao)
// ===========================================================================
export function scoreWuXing(chart) {
  const score = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const detail = [];
  const posWeightStem = { year: 1.0, month: 1.0, day: 1.0, time: 1.0 };
  const posWeightBranch = { year: 1.0, month: 1.8, day: 1.1, time: 1.0 };

  for (const key of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[key];
    const gwx = GAN[p.gan].wx;
    score[gwx] += posWeightStem[key];
    detail.push({ src: `Can ${key}`, gan: p.gan, wx: gwx, pts: posWeightStem[key] });
    for (const h of p.hidden) {
      const hwx = GAN[h.gan].wx;
      const hpts = +(posWeightBranch[key] * h.weight).toFixed(3);
      score[hwx] += hpts;
      detail.push({ src: `Tàng ${key}`, gan: h.gan, wx: hwx, pts: hpts });
    }
  }
  const total = Object.values(score).reduce((a, b) => a + b, 0);
  const pct = {};
  for (const w of WUXING) pct[w] = +((score[w] / total) * 100).toFixed(1);
  return { score, pct, total: +total.toFixed(3), detail };
}

// ===========================================================================
//  3. VƯỢNG SUY (身強/身弱)
// ===========================================================================
export function analyzeStrength(chart, wx) {
  const dmWx = chart.dayMaster.wx;
  const resourceWx = SHENG_BY[dmWx];
  const support = wx.score[dmWx] + wx.score[resourceWx];
  const oppose = wx.total - support;
  const ratio = support / wx.total;

  // [loop 551 FIX] guard monthZhi null/undefined — trước đây GAN[HIDDEN[undefined][0]] → TypeError crash.
  const _mz0 = chart.monthZhi && HIDDEN[chart.monthZhi] ? HIDDEN[chart.monthZhi][0] : null;
  const monthMainWx = _mz0 && GAN[_mz0] ? GAN[_mz0].wx : null;
  const deLenh = monthMainWx != null && (monthMainWx === dmWx || monthMainWx === resourceWx);
  // [loop 484] 进气/旺气/退气 — vị trí ngày sinh trong khoảng节气 (滴天髓 进气退气).
  //   Refinement 得令: mới vào节气 (初气) = 进气 «lệnh đang VÀO mạnh dần»; sắp转 (末气)
  //   = 退气 «lệnh RA suy»; giữa = 旺气 «đương lệnh đầy đủ». Cổ法 «进气 Ungасpending, 退气 waning».
  let qiPhase = '旺气';
  try {
    const inp = chart.input;
    if (inp && chart.jieqi) {
      const birth = new Date(inp.year, (inp.month || 1) - 1, inp.day || 1, inp.hour || 0, inp.minute || 0).getTime();
      const _pt = (s) => { const [d, tt] = String(s).split(' '); const [y, mo, da] = (d || '').split('-').map(Number); const [h, mi] = (tt || '0:0:0').split(':').map(Number); return new Date(y, (mo || 1) - 1, da || 1, h || 0, mi || 0).getTime(); };
      const prev = _pt(chart.jieqi.prev.time), next = _pt(chart.jieqi.next.time);
      const pos = (birth - prev) / ((next - prev) || 1);
      qiPhase = pos < 0.33 ? '进气' : pos > 0.67 ? '退气' : '旺气';
    }
  } catch (e) {}

  // [loop 451 ELEVATION] 三法 反馈 — 得令/得地 modulate ngưỡng vượng suy.
  //   Cổ法 «得令者旺, 失令者衰» (渊海子平): 月令 là yếu tố QUYẾT ĐỊNH vượng suy,
  //   đáng ~40% trọng số. Trước đây analyzeStrength chỉ dùng ratio (đã nạp 得令 MỘT PHẦN
  //   qua trọng số tháng 1.8×) nhưng bỏ qua tính chất QUYẾT ĐỊNH nhị phân của 得令/得地
  //   → các lá «đắc lệnh + thông căn» bản chất mạnh nhưng bị ratio mờ đánh nhược → sai
  //   Dụng Thần (lấy Ấn/Tỷ thay vì Tài/Quan). Nay 三 pháp feedback: 得令 +0.04, 得地 +0.03
  //   BỔ DƯƠNG vào ratio hiệu dụng. CHỈ cộng dương (không trừ) — tránh đè lên trường hợp
  //   «mạnh do Ấn» (mạnh qua sinh phù chứ không qua lệnh/địa, vẫn mạnh chính thống).
  //   得势 BỎ: đã nằm sẵn trong ratio (support side) → cộng lại sẽ double-count.
  const root = tongGen(chart, dmWx).total;       // 得地: tổng thông căn của Nhật Chủ
  const deDia = root >= 1.0;                       // có «rễ» đáng kể
  let sanFaBonus = 0;
  // [loop 486] 得令 FUNCTIONAL: 进气退气 modulate — 进气 (lệnh đang VÀO) mạnh hơn 退气 (RA suy).
  //   Cổ法 «进气 Ungасpending, 退气 waning»: 得令 đầu tháng mạnh hơn cuối tháng.
  if (deLenh) sanFaBonus += (qiPhase === '进气' ? 0.05 : qiPhase === '退气' ? 0.03 : 0.04);
  if (deDia) sanFaBonus += 0.03;                    // 得地 có căn (~30%)
  const effRatio = ratio + sanFaBonus;

  let level, strong;
  if (effRatio >= 0.62) { level = 'Thân quá vượng'; strong = true; }
  else if (effRatio >= 0.50) { level = 'Thân vượng'; strong = true; }
  else if (effRatio >= 0.38) { level = 'Thân nhược'; strong = false; }
  else { level = 'Thân quá nhược'; strong = false; }

  return { dmWx, resourceWx, support: +support.toFixed(3), oppose: +oppose.toFixed(3),
    ratio: +ratio.toFixed(3), effRatio: +effRatio.toFixed(3), deLenh, deDia, root: +root.toFixed(2),
    sanFaBonus: +sanFaBonus.toFixed(2), qiPhase, monthMainWx, level, strong };
}

// ===========================================================================
//  4. DỤNG THẦN — kết hợp Phù Ức + Thông Quan + Bệnh Dược + Điều Hậu + Cách Cục
// ===========================================================================

// 4a. Phù Ức (扶抑) — cơ sở (giữ nguyên logic đã đúng)
function computeFuYi(chart, wx, strength) {
  const dmWx = chart.dayMaster.wx;
  const G = GROUP_WX(dmWx);
  const reasons = [];
  let primary, secondary, avoid;

  if (strength.strong) {
    const yinScore = wx.score[G.yin];
    const tiScore = wx.score[G.ti];
    if (yinScore > tiScore) {
      primary = G.cai; secondary = G.guan;
      reasons.push(`Thân vượng chủ yếu do Ấn (${G.yin}) sinh phù quá mạnh → lấy Tài (${G.cai}) phá Ấn làm Dụng Thần.`);
    } else {
      primary = G.guan; secondary = G.shi;
      reasons.push(`Thân vượng do Tỷ Kiếp (${G.ti}) trùng điệp → lấy Quan Sát (${G.guan}) chế thân, Thực Thương (${G.shi}) tiết tú làm phụ.`);
    }
    avoid = [G.yin, G.ti];
    reasons.push(`Kỵ: Ấn (${G.yin}) và Tỷ Kiếp (${G.ti}) vì càng làm thân vượng.`);
  } else {
    const guanScore = wx.score[G.guan], shiScore = wx.score[G.shi], caiScore = wx.score[G.cai];
    const maxDrain = Math.max(guanScore, shiScore, caiScore);
    if (maxDrain === caiScore && caiScore > 0) {
      primary = G.ti; secondary = G.yin;
      reasons.push(`Thân nhược do Tài (${G.cai}) quá vượng hao thân (tài đa thân nhược) → lấy Tỷ Kiếp (${G.ti}) trợ thân kháng Tài.`);
    } else if (maxDrain === guanScore && guanScore > 0) {
      primary = G.yin; secondary = G.ti;
      reasons.push(`Thân nhược do Quan Sát (${G.guan}) khắc nặng → lấy Ấn (${G.yin}) hóa Sát sinh thân (thông quan).`);
    } else {
      primary = G.yin; secondary = G.ti;
      reasons.push(`Thân nhược do Thực Thương (${G.shi}) tiết khí quá nhiều → lấy Ấn (${G.yin}) sinh thân và chế Thực Thương.`);
    }
    avoid = [G.cai, G.guan, G.shi];
    reasons.push(`Kỵ: Tài (${G.cai}), Quan Sát (${G.guan}), Thực Thương (${G.shi}) vì làm thân thêm suy.`);
  }
  return { primary, secondary, avoid, reasons };
}

// 4b. Thông Quan (通关) — cầu nối giữa hai hành tương khắc đều mạnh
function computeTongGuan(chart, wx) {
  const entries = Object.entries(wx.score).sort((a, b) => b[1] - a[1]);
  const total = wx.total || 1;
  // Tìm cặp (A khắc B) mà cả hai đều vượng (> 25%) — [loop 575] nâng từ 18%→25%
  //   18% (gần bằng trung bình 20%) → 73% chart trigger (quá phổ biến, vô hiệu hoá tính chọn lọc).
  //   25% = trên trung bình rõ ràng → Thông Quan chỉ khi 2 hành THẬT SỰ vượng + gây tắc.
  for (const [a] of entries) {
    const b = KE[a]; // A khắc B
    if (wx.score[a] / total > 0.25 && wx.score[b] / total > 0.25) {
      const bridge = SHENG[a]; // A sinh bridge, bridge sinh B
      return { attacker: a, victim: b, bridge, note: `Hành ${a} khắc ${b} mà cả hai đều vượng, khíết阻滞 → dùng ${bridge} làm Thông Quan (A sinh ${bridge}, ${bridge} sinh B) cho ngũ hành lưu thông.` };
    }
  }
  return null;
}

// 4c. Bệnh Dược (病药) — tìm "bệnh" (hành thái quá) và "dược"
function computeBingYao(chart, wx, strength) {
  const dmWx = chart.dayMaster.wx;
  const entries = Object.entries(wx.score);
  const total = wx.total || 1;
  // Bệnh: hành vượng nhất thái quá
  const bing = entries.slice().sort((a, b) => b[1] - a[1])[0];
  if (bing[1] / total < 0.32) return null; // không có bệnh rõ
  // Dược: hành khắc/trị bệnh (nếu bệnh là Kỵ với thân thì dược = Dụng Thần phù ức)
  const bingWx = bing[0];
  let yao;
  if (strength.strong && (bingWx === dmWx || bingWx === SHENG_BY[dmWx])) {
    yao = SHENG[dmWx]; // tiết (Thực Thương)
  } else if (!strength.strong) {
    yao = SHENG_BY[dmWx]; // phù (Ấn)
  } else {
    yao = KE[bingWx]; // khắc bệnh
  }
  return { bingWx: bing[0], bingPct: +((bing[1] / total) * 100).toFixed(1), yao, note: `Bệnh của cục: hành ${bing[0]} thái quá (${((bing[1] / total) * 100).toFixed(1)}%). Dược: hành ${yao} để trị bệnh — "có bệnh phương hữu quý".` };
}

// 4d. Tổng hợp Dụng Thần
export function findYongShen(chart, wx, strength, pattern, interactions) {
  const dmWx = chart.dayMaster.wx;
  const G = GROUP_WX(dmWx);
  const reasons = [];
  let primary, secondary, avoid;
  let method = [];

  // --- Ưu tiên 0: CÁCH ĐẶC BIỆT (Tòng / Chuyên Vượng) áp đảo ---
  if (pattern && pattern.type === 'special') {
    const p = pattern.pref;
    const yongWx = [...new Set(p.yong.map((g) => G[g]))];
    const jiWx = [...new Set(p.ji.map((g) => G[g]))];
    primary = yongWx[0];
    secondary = yongWx[1] || null;
    avoid = jiWx;
    method.push('Cách cục đặc biệt');
    reasons.push(`📐 Cách cục đặc biệt — ${pattern.vi}. ${p.note}`);
    reasons.push(`Theo thế cục, Dụng Thần lấy nhóm ${p.yong.map((g) => GROUP_VI[g]).join('/')} → hành ${[primary, secondary].filter(Boolean).join(', ')}; kỵ nhóm ${p.ji.map((g) => GROUP_VI[g]).join('/')} → hành ${avoid.join(', ')}.`);
    return finalizeYong(primary, secondary, avoid, reasons, method, chart, G, interactions, strength, wx);
  }

  // --- Cơ sở: Phù Ức ---
  const fuYi = computeFuYi(chart, wx, strength);
  primary = fuYi.primary; secondary = fuYi.secondary; avoid = fuYi.avoid;
  reasons.push(...fuYi.reasons);
  method.push('Phù Ức (扶抑)');

  // --- Bổ sung: Bệnh Dược ---
  const bingYao = computeBingYao(chart, wx, strength);
  if (bingYao) {
    reasons.push(`💊 ${bingYao.note}`);
    method.push('Bệnh Dược (病药)');
    // Nếu dược trùng/khắc bệnh và khác primary → làm secondary
    if (bingYao.yao !== primary && !avoid.includes(bingYao.yao)) {
      secondary = bingYao.yao;
    }
  }

  // --- Bổ sung: Thông Quan (khi ngũ hành tương khắc trầm) ---
  const tongGuan = computeTongGuan(chart, wx);
  if (tongGuan) {
    reasons.push(`🌉 ${tongGuan.note}`);
    method.push('Thông Quan (通关)');
    if (tongGuan.bridge !== primary && !avoid.includes(tongGuan.bridge)) {
      secondary = tongGuan.bridge;
    }
  }

  // --- Hiệp đồng với Cách Cục (正 cách) ---
  if (pattern && pattern.type === 'normal') {
    const prefPrimary = G[pattern.pref.yong[0]];
    if (prefPrimary === primary || prefPrimary === secondary) {
      reasons.push(`🎯 Cách cục ${pattern.vi} (${pattern.shunNi}) cũng ưu tiên nhóm ${pattern.pref.yong.map((g) => GROUP_VI[g]).join('/')} → TRÙNG khớp với Dụng Thần Phù Ức, luận càng vững.`);
      method.push('Cách Cục (格局)');
    } else {
      reasons.push(`🎯 Lưu ý cách cục ${pattern.vi} truyền thống ưu tiên nhóm ${pattern.pref.yong.map((g) => GROUP_VI[g]).join('/')} (hành ${prefPrimary}). Xét vượng suy thì dùng ${primary} chủ đạo; hành ${prefPrimary} có thể phối hợp khi lưu niên/đại vận mang tới.`);
    }
  } else if (pattern && pattern.type === 'luyue') {
    reasons.push(`🎯 Nguyệt lệnh là Tỷ Kiếp (${pattern.vi}), bản thân vốn vượng → ${pattern.note}`);
  }

  return finalizeYong(primary, secondary, avoid, reasons, method, chart, G, interactions, strength, wx);
}

// Hoàn thiện: gắn Điều Hậu + 用喜忌仇 + relations + tiaohou note
// [loop 456] chức năng cổ pháp của từng thiên can 窮通寶鑑 调候 dụng thần. Cổ pháp phân biệt
//   rõ 丙 (sưởi ấm) ≠ 丁 (rèn), 癸 (nhuận) ≠ 壬 (làm mát) — cùng hành nhưng DỤNG khác. Trước
//   đây note chỉ hiện «丙癸 (hành Hỏa)» → MẤT chức năng cụ thể + SAI khi 2 can khác hành
//   (vd 甲 tháng Dần cần 丙[Hỏa]+癸[Thủy], ghi «hành Hỏa» che khuất 癸). Nay annotate từng can.
const TIAO_FUNC = {
  丙: 'sưởi ấm', 丁: 'rèn luyện', 癸: 'nhuận táo', 壬: 'làm mát',
  庚: 'tỉa mộc vượng', 辛: 'tỉa gọt tinh', 甲: 'sơ thông thổ cứng', 乙: 'nhu dưỡng nhẹ',
  戊: 'chắn nước', 己: 'bồi dưỡng',
};
const tiaoStemsVi = (raw) => raw.map((s) => `${s}(${GAN[s]?.wx || '?'}: ${TIAO_FUNC[s] || '?'})`).join(' + ');
function finalizeYong(primary, secondary, avoid, reasons, method, chart, G, interactions, strength, wx) {
  // --- Điều Hậu (调候) theo 窮通寶鑑 — tính TRƯỚC để có thể OVERRIDE Phù Ức ---
  const tiaoRaw = TIAOHOU[chart.dayGan]?.[chart.monthZhi] || [];
  const tiaoElems = [...new Set(tiaoRaw.map((g) => GAN[g].wx))];
  const tiaoPrimaryWx = tiaoRaw.length ? GAN[tiaoRaw[0]].wx : null;
  const clim = CLIMATE[chart.monthZhi];
  // [loop 34 ELEVATION] 调候 OVERRIDE: khí hậu THIÊN LỆCH (hàn 亥子丑 / nhiệt 巳午未) → 调候 LÀM CHỦ
  //   theo 窮通寶鑑 «寒甚必用火暖, 燥甚必用水润». Trước đây 调候 chỉ ghi note → sai 用神 cho mọi
  //   chart sinh mùa hàn/nóng (vd 甲木 tháng 子 cần 丁火 noãn, code cũ lấy Mộc/Thủy + cấm Hỏa).
  const EXTREME_COLD = ['亥', '子', '丑']; // đông hàn → cần Hỏa noãn
  const EXTREME_HOT = ['巳', '午', '未'];  // hạ nhiệt → cần Thủy nhuận
  const isExtreme = EXTREME_COLD.includes(chart.monthZhi) || EXTREME_HOT.includes(chart.monthZhi);
  // [loop 116 fix BUG CAO] 调候 override KHÔNG fire cho CÁCH ĐẶC BIỆT (从格/专旺).
  //   Từ cách «tòng/tracking thế» — đã theo thế cục thì 调候 không đè (cổ法: «从格
  //   不论调候»). Trước đây 调候 override CHẾT 从財格 用神 (火→Thủy) → Dụng SAI.
  const isSpecial = method.includes('Cách cục đặc biệt');
  let tiaoOverride = false;
  if (isExtreme && tiaoPrimaryWx && tiaoPrimaryWx !== primary && !isSpecial) {
    tiaoOverride = true;
    const fuyiPrimary = primary;
    primary = tiaoPrimaryWx;                                  // 调候 lên làm chủ
    if (fuyiPrimary !== primary && fuyiPrimary !== secondary) secondary = fuyiPrimary; // Phù Ức giáng secondary
    // [loop 72 sửa bug] recompute avoid cho primary MỚI. Trước đây chỉ filter bỏ tiaoPrimaryWx
    //   → avoid (group-based kỵ CŨ) mâu thuẫn ji/chou mới (tính dòng 301-302) → sai hehun/
    //   ideal-match/NLG (yong.avoid.includes) cho chart 调候 override. Nay: gỡ Dụng/Hỷ mới,
    //   thêm Kỵ/Thù mới (ji=克 Dụng, chou=sinh Kỵ) → avoid nhất quán với ji/chou.
    const _newXi = SHENG_BY[primary], _newJi = KE_BY[primary], _newChou = SHENG_BY[_newJi];
    avoid = avoid.filter((w) => w !== primary && w !== _newXi);   // gỡ Dụng + Hỷ mới khỏi Kỵ
    for (const w of [_newJi, _newChou]) if (w && !avoid.includes(w)) avoid.push(w); // thêm Kỵ + Thù mới
    method.push('Điều Hậu (调候) — khí hậu thiên lệch, LÀM CHỦ (override Phù Ức)');
    reasons.push(`🔥 Điều Hậu (调候) OVERRIDE: sinh tháng ${chart.monthZhi} (${clim ? clim.climate : 'khí hậu thiên lệch'}) — 窮通寶鑑 bắt buộc lấy ${tiaoStemsVi(tiaoRaw)} ${clim ? clim.need : ''} làm Dụng Thần CHÍNH, đè Phù Ức (${fuyiPrimary}). Mệnh hàn/nóng quá nặng thì điều hòa khí hậu ưu tiên hơn cân bằng vượng suy.`);
    // [loop 639 FIX] gỡ reason «Kỵ» CỦA PHÙ ỨC còn liệt kê primary MỚI (giờ là Dụng, KHÔNG còn Kỵ).
    //   Trước đây: Dụng=火 nhưng reasons vẫn «Kỵ: ... Quan Sát (火)» → AI nhận thông tin MÂU THUẪN.
    //   Nay override → lý do Kỵ mới được line 382 (recomputed Kỵ) cung cấp, reason cũ phải đi.
    for (let i = reasons.length - 1; i >= 0; i--) {
      if (/^Kỵ:/.test(reasons[i]) && reasons[i].includes(`(${primary})`)) reasons.splice(i, 1);
    }
  }

  // --- BỘ 用喜忌仇 (Dụng – Hỷ – Kỵ – Thù) — tính từ primary SAU override ---
  const xi = SHENG_BY[primary];                          // 喜神
  const ji = KE_BY[primary];                             // 忌神
  const chou = SHENG_BY[ji];                             // 仇神
  const xian = SHENG[primary];                           // 闲神
  reasons.push(`💝 Hỷ Thần (喜神): hành ${xi} (sinh trợ Dụng ${primary}) — gặp vận/năm hành ${xi} thì Dụng Thần thêm vững, là sức mạnh thứ hai sau Dụng.`);
  reasons.push(`😤 Kỵ Thần (忌神): hành ${ji} (khắc phá Dụng ${primary}); 仇 Thần (仇神): hành ${chou} (sinh nuôi Kỵ ${ji}, hại gián tiếp). Năm/vận mang ${chou} phải đề phòng vì nó làm Kỵ thêm mạnh.`);

  // --- climateNote (cho field tiaohou.note) ---
  let climateNote = '';
  const climatePrefix = clim
    ? `Sinh tháng ${chart.monthZhi} (${clim.season} — ${clim.climate}), cổ pháp Điều Hậu (${chart.dayGan}) `
    : '';
  if (tiaoPrimaryWx) {
    if (tiaoOverride) {
      climateNote = climatePrefix + `lấy ${tiaoStemsVi(tiaoRaw)} — ${clim ? clim.need : ''} làm DỤNG CHÍNH (override Phù Ức) vì khí hậu thiên lệch.`;
    } else {
      const agree = tiaoPrimaryWx === primary || tiaoPrimaryWx === secondary;
      const conflict = avoid.includes(tiaoPrimaryWx);
      let body;
      if (agree) {
        body = `lấy ${tiaoStemsVi(tiaoRaw)} — ${clim ? clim.need : ''}. Hành này TRÙNG Dụng Thần ⇒ Dụng càng vững (thoả mãn cả cân bằng lẫn khí hậu).`;
        method.push('Điều Hậu (调候)');
      } else if (conflict) {
        body = `cổ điển lấy ${tiaoStemsVi(tiaoRaw)} — ${clim ? clim.need : ''}; nhưng cân bằng vượng suy lấy Phù Ức (${primary}) làm chủ, Điều Hậu phối hợp khi thiên lệch.`;
      } else {
        body = `gợi ý ${tiaoStemsVi(tiaoRaw)} — ${clim ? clim.need : ''} để điều hòa hàn–noãn–táo–thấp; phối hợp cùng Dụng Thần.`;
      }
      climateNote = climatePrefix + body;
    }
  }

  // [loop 167-168→544] AVOID normalization — 用喜忌仇 consistency.
  //   • 忌(ji)/仇(chou) PHẢI ở avoid (hostile mọi method) — [loop 167]
  //   • Dụng(primary)/Hỷ(xi) KHÔNG ở avoid — [loop 168]: trước đây ~22% chart giữ
  //     avoid THÔ coarse Phù Ức (thân-relative: tránh Tài/Quan/Thực) kể cả sau khi
  //     chọn Dụng, nên Hỷ (cha sinh Dụng, VD Quan→Ấn) bị liệt «kỵ» sai → hehun/
  //     ideal-match phạt partner mang Dụng=Hỷ user (ngược: người đó BỔ Dụng user).
  //   • [loop 544 FIX] secondary (dụng thần phụ, từ 病药/通关/调候) cũng KHÔNG ở avoid —
  //     trước đây quên filter → 56% chart có secondary∈avoid → hehun phạt partner sai.
  avoid = avoid.filter((w) => w !== primary && w !== xi && w !== secondary);
  // [loop 550] ji/chou (KỴ/THÙ) luôn ∈ avoid — lập trường Phù Ức cổ pháp (regression test
  //   cố ý assert điều này). Khi hiếm secondary===ji/chou (đụng 调候/通关), kỵ/仇 vẫn ưu tiên
  //   trong avoid list. Bug 3 audit = tranh luận cổ pháp, KHÔNG đổi thiết kế này.
  for (const w of [ji, chou]) if (w && !avoid.includes(w)) avoid.push(w);

  return {
    primary, secondary, avoid,
    xi, ji, chou, xian,           // 用喜忌仇闲 (bộ 5 đầy đủ, tính từ primary cuối)
    reasons,
    method: [...new Set(method)],
    relations: { resourceWx: G.yin, sameWx: G.ti, outputWx: G.shi, wealthWx: G.cai, officerWx: G.guan },
    tiaohou: { raw: tiaoRaw, elems: tiaoElems, primaryWx: tiaoPrimaryWx, note: climateNote, override: tiaoOverride },
  };
}

// ===========================================================================
//  5. ĐẠI VẬN (大運)
// ===========================================================================
// [loop 454]统一 rating scale — thêm tầng Đại cát/Đại hung cho score cực (±5+).
//   Sau loop 451-453 (三法/源流/源流×大运), score 大运 mở rộng ±9 → tầng Cát/Hung
//   cũ nén thập kỷ +9 vào cùng bucket «Cát» với +2 → MẤT PHÂN BIỆT. Đại cát (≥5) =
//   «mọi tầng đồng phướng» (Dụng+格局+源流 mở dòng+không clash), Đại hung (≤−5) = ngược.
//   Dùng chung cho computeDaYun + 空亡 re-rate + 源流 re-rate (trước đây 3 chỗ duplicate).
function _dayunRating(score) {
  if (score >= 5) return 'Đại cát';
  if (score >= 2) return 'Cát';
  if (score >= 1) return 'Hơi thuận';
  if (score <= -5) return 'Đại hung';
  if (score <= -2) return 'Hung';
  if (score <= -1) return 'Hơi nghịch';
  return 'Bình hòa';
}
export function computeDaYun(year, month, day, hour, minute, gender, yong) {
  const [cy, cm, cd, ch, cmin] = ziShiRoll(year, month, day, hour, minute); // [loop 177] 子时换日 — đồng bộ buildChart
  const solar = Solar.fromYmdHms(cy, cm, cd, ch, cmin, 0);
  const ec = solar.getLunar().getEightChar();
  // Quy ước lunar-javascript getYun: 1 = nam (dương), 0 = nữ (âm).
  // Validate rõ ràng — mọi giá trị lạ (typo, null...) fallback về 0 (nữ) để không ném.
  const g = (gender === 'nam') ? 1 : (gender === 'nữ' || gender === 'nu') ? 0 : 0;
  const yun = ec.getYun(g);
  const list = yun.getDaYun();
  // [cycle 47 sửa C7] chuẩn hoá khung Dụng sang 用/喜/忌/仇 (giống scoreLiunianYear) → 大运 & 流年
  //   nhất quán về "hành có lợi". Trước đây dùng secondary/avoid (khung khác) → dayun & liunian
  //   chênh nhau cho lá số secondary≠xi.
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoidSet = new Set([yong.ji, yong.chou].filter(Boolean));
  const dGan = ec.getDayGan();
  const out = [];
  for (let i = 1; i < list.length && i <= 8; i++) {
    const dy = list[i];
    const gz = dy.getGanZhi();
    if (!gz) continue;
    const gan = gz[0], zhi = gz[1];
    const ganWx = GAN[gan].wx, zhiWx = ZHI[zhi].wx;
    // [loop 164 ELEVATION] 大运重地支，流年重天干 (子平 cổ quyết, verified).
    //   Chi mang 月令 vượng suy → chủ đạo基调 10 năm (±2); Can chỉ «động/biểu hiện» phụ (±1).
    //   Trước đây ngược (Can ±2, Chi ±1) → sai nguyên lý. Đảo trọng số.
    let score = 0;
    if (favSet.has(zhiWx)) score += 2;
    if (avoidSet.has(zhiWx)) score -= 2;
    if (favSet.has(ganWx)) score += 1;
    if (avoidSet.has(ganWx)) score -= 1;
    // [loop 423 elevate] 大运-vs-日柱 structural clash — cổ pháp: 天克地冲 = đại hung
    //   bất kể ngũ hành. Trước đây score CHỈ xét ngũ hành → 大运 天克地冲 vẫn «Cát» nếu
    //   hành Dụng → sai thực tế (thập kỷ biến loạn lớn dù hành tốt). Nay: trừ theo mức.
    const dgZhi = ec.getDayZhi();
    const _GC = { 甲:'庚',庚:'甲',乙:'辛',辛:'乙',丙:'壬',壬:'丙',丁:'癸',癸:'丁' };
    const _CH = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };
    if (_GC[dGan] === gan && _CH[dgZhi] === zhi) score -= 4; // 天克地冲 — severe
    else if (_CH[dgZhi] === zhi) score -= 2; // 地冲 only
    if (gan + zhi === dGan + dgZhi) score -= 1; // 伏吟 — trùng phức
    const rating = _dayunRating(score); // [loop 454] shared scale w/ Đại cát/Đại hung
    out.push({ ganZhi: gz, gan, zhi, ganWx, zhiWx,
      startAge: dy.getStartAge(), startYear: dy.getStartYear(),
      ganGod: tenGod(dGan, gan), zhiGod: tenGod(dGan, HIDDEN[zhi][0]), score, rating });
  }
  return out;
}

// ===========================================================================
//  6. LƯU NIÊN (流年) — 10 năm của đại vận đang hành + đánh dấu "hiện tại"
// ===========================================================================
export function computeLiuNian(year, month, day, hour, minute, gender, yong, refYear) {
  const [cy, cm, cd, ch, cmin] = ziShiRoll(year, month, day, hour, minute); // [loop 177] 子时换日 — đồng bộ buildChart
  const solar = Solar.fromYmdHms(cy, cm, cd, ch, cmin, 0);
  const ec = solar.getLunar().getEightChar();
  // Validate gender (xem computeDaYun). Fallback 0 (nữ) cho giá trị lạ.
  const g = (gender === 'nam') ? 1 : (gender === 'nữ' || gender === 'nu') ? 0 : 0;
  const yun = ec.getYun(g);
  const dayunList = yun.getDaYun();
  const dGan = ec.getDayGan();
  const cur = refYear || new Date().getFullYear();

  // Tìm đại vận đang hành (startAge <= tuổi hiện tại)
  const age = cur - year;
  let active = null;
  for (let i = 1; i < dayunList.length; i++) {
    const dy = dayunList[i];
    if (!dy.getGanZhi()) continue;
    if (dy.getStartAge() <= age && age < dy.getStartAge() + 10) { active = dy; break; }
    if (!active && i <= 8) active = dy; // dự phòng
  }
  if (!active) return [];

  const lnList = active.getLiuNian();
  // [loop 19] 4 trụ nguyên cục — truyền vào scoreLiunianYear để bật tầng 伏吟/反吟
  //   (năm biến cố), giữ thẻ "Lưu Niên" nhất quán với brief "Luận vận năm".
  const natalPillars = {
    year: { gan: ec.getYearGan(), zhi: ec.getYearZhi() },
    month: { gan: ec.getMonthGan(), zhi: ec.getMonthZhi() },
    day: { gan: ec.getDayGan(), zhi: ec.getDayZhi() },
    time: { gan: ec.getTimeGan(), zhi: ec.getTimeZhi() },
  };
  // [loop 161] Tính không vong tại chỗ — để thẻ "Lưu Niên" bắt được tầng 出空/冲空
  //   (scoreLiunianYear đọc kongwang?.kong). Trước đây tham chiếu kongwang chưa khai báo
  //   → ReferenceError → try/catch ở analyze() nuốt lỗi → thẻ trống. Sửa: tính cục bộ.
  let kongwang = null;
  try {
    kongwang = analyzeKongwang({
      dayGan: dGan,
      pillars: {
        year: { zhi: natalPillars.year.zhi, ganGod: tenGod(dGan, ec.getYearGan()) },
        month: { zhi: natalPillars.month.zhi, ganGod: tenGod(dGan, ec.getMonthGan()) },
        day: { zhi: natalPillars.day.zhi, ganGod: 'Nhật Chủ' },
        time: { zhi: natalPillars.time.zhi, ganGod: tenGod(dGan, ec.getTimeGan()) },
      },
    });
  } catch (e) { kongwang = null; }
  const out = [];
  for (const ln of lnList) {
    const gz = ln.getGanZhi();
    if (!gz) continue;
    const gan = gz[0], zhi = gz[1];
    const ganWx = GAN[gan].wx, zhiWx = ZHI[zhi].wx;
    // [cycle 44] Dùng scoreLiunianYear (chung với analyzeLiunianDeep) → thẻ "Lưu Niên"
    //   nhất quán với brief "Luận vận năm". Trước đây chỉ chấm ngũ hành → 2026 báo "Cát"
    //   trong khi deep (có Thương Quan −16 + Thái tuế) báo "Hơi kỵ" → mâu thuẫn.
    // [loop 207 fix BUG] truyền activeDayun → bật tầng 大运互动 (运年组合). Trước đây THIẾU
    //   activeDayun → scoreLiunianYear skip school 6 → thẻ «Lưu Niên» thiếu 1 phái, lệch
    //   deep (AI/brief) tới ~8 điểm (vd nam 2000 năm 2027: card 51 vs deep 43).
    const { score, rating } = scoreLiunianYear({
      dayGan: dGan, dayZhi: ec.getDayZhi(), yearBirthZhi: ec.getYearZhi(), yong, yGan: gan, yZhi: zhi,
      activeDayun: active.getGanZhi(), natalPillars, kongwang,
    });
    const lnYear = ln.getYear();
    out.push({ ganZhi: gz, gan, zhi, ganWx, zhiWx,
      year: lnYear, age: ln.getAge(),
      ganGod: tenGod(dGan, gan), zhiGod: tenGod(dGan, HIDDEN[zhi][0]),
      score, rating, isNow: lnYear === cur, dayunGanZhi: active.getGanZhi() });
  }
  return out;
}

// ===========================================================================
//  7. HÀM TỔNG: TRẢ VỀ TOÀN BỘ KẾT QUẢ LUẬN MỆNH
// ===========================================================================
export function analyze(year, month, day, hour, minute, gender, refYear) {
  // [loop 662] validate input VN — lunar-javascript throws English «wrong month 13»;
  //   validate trước để error tiếng Việt sạch (AI tool / form đều hưởng).
  const _n = (v) => Number.isFinite(Number(v));
  if (!_n(year)) throw new Error(`Năm sinh không hợp lệ («${year}»).`);
  if (!_n(month) || month < 1 || month > 12) throw new Error(`Tháng sinh không hợp lệ («${month}» — phải 1-12).`);
  if (!_n(day) || day < 1 || day > 31) throw new Error(`Ngày sinh không hợp lệ («${day}» — phải 1-31).`);
  const chart = buildChart(year, month, day, hour, minute, gender);
  const wx = scoreWuXing(chart);
  // [loop 148 ELEVATION] 空亡 hiệu ứng — giảm tàng can weight của trụ rơi không vong
  //   Cổ pháp «空则不实»: chi không vong → tàng can yếu (gốc không vững). Thiên can KHÔNG bị ảnh hưởng.
  //   Áp dụng SAU scoreWuXing (không đổi interface) → giảm ~50% tàng can đóng góp từ trụ void.
  let kongwang = null;
  try {
    kongwang = analyzeKongwang(chart);
    if (kongwang && kongwang.affected && kongwang.affected.length) {
      const voidPillars = new Set(kongwang.affected.map((a) => a.pos));
      for (const d of wx.detail) {
        if (d.src && d.src.startsWith('Tàng') && voidPillars.has(d.src.replace('Tàng ', ''))) {
          const old = d.pts;
          d.pts = +(old * 0.5).toFixed(3); // 空亡: tàng can giảm 50%
          wx.score[d.wx] = +(wx.score[d.wx] - old + d.pts).toFixed(3);
          d.kong = true;
        }
      }
      // recalculate pct
      const kwTotal = Object.values(wx.score).reduce((a, b) => a + b, 0);
      wx.total = +kwTotal.toFixed(3);
      for (const w of WUXING) wx.pct[w] = +((wx.score[w] / kwTotal) * 100).toFixed(1);
    }
  } catch (e) { /* kongwang optional */ }
  // [loop 151] pass kongwang void pillars to chart for tonggen
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
  // [loop 37] 病药 UNIFICATION — feed pattern-quality rescues vào yong (SAFE: enrich secondary +
  //   method, KHÔNG đổi primary). Đóng gap loop 34: 2 hệ 病药 (computeBingYi pct-based vs
  //   pattern-quality structural) giờ thống nhất — rescue structural ưu tiên secondary.
  try {
    if (patternQualityResult && patternQualityResult.rescues && patternQualityResult.rescues.length) {
      const dmWx = chart.dayMaster.wx;
      const GROUP_WX = { ti: dmWx, yin: SHENG_BY[dmWx], shi: SHENG[dmWx], cai: KE[dmWx], guan: KE_BY[dmWx] };
      for (const r of patternQualityResult.rescues) {
        const drugGroups = r.drug || [];
        if (!drugGroups.length) continue;
        const drugWx = GROUP_WX[drugGroups[0]];
        if (drugWx && drugWx !== yong.primary && drugWx !== yong.secondary) {
          yong.secondary = drugWx;
          yong.reasons.push(`💊 Bệnh Dược (病药 từ pattern-quality): «${(r.diseaseNote || r.note || '').slice(0, 60)}» → thuốc nhóm ${drugGroups[0]} (hành ${drugWx}) → ưu tiên làm Dụng thứ cấp (chữa bệnh cách cục).`);
          if (!yong.method.includes('Bệnh Dược (病药)')) yong.method.push('Bệnh Dược (病药)');
        }
      }
    }
  } catch (e) { /* 病药 enrichment không bắt buộc — fallback giữ yong nguyên */ }
  // [loop 41 ELEVATION] 病药 → PRIMARY (败中有成): quality='有救' + phi cực đoán → thuốc LÀM CHỦ.
  //   Cổ法 «有病方为贵, 败中有成» — mệnh bại cách nhưng CÓ CỨU → phần tử CỨU chính là Dụng Thần.
  //   Chỉ khi: (a) quality='有救', (b) KHÔNG 调候 override (调候 đã xử lý cực đoán), (c) thuốc ≠ primary.
  try {
    if (patternQualityResult && patternQualityResult.quality === '有救'
        && !(yong.tiaohou?.override) && patternQualityResult.rescues?.length) {
      const dmWx = chart.dayMaster.wx;
      const GROUP_WX = { ti: dmWx, yin: SHENG_BY[dmWx], shi: SHENG[dmWx], cai: KE[dmWx], guan: KE_BY[dmWx] };
      const firstRescue = patternQualityResult.rescues[0];
      const drugWx = firstRescue.drug?.length ? GROUP_WX[firstRescue.drug[0]] : null;
      if (drugWx && drugWx !== yong.primary) {
        const oldPrimary = yong.primary;
        yong.primary = drugWx;                                    // 药 → Dụng chính
        yong.secondary = oldPrimary;                              // Phù Ức cũ → secondary
        // recompute 用喜忌仇 from new primary
        yong.xi = SHENG_BY[drugWx];
        yong.ji = KE_BY[drugWx];
        yong.chou = SHENG_BY[yong.ji];
        yong.xian = SHENG[drugWx];
        yong.avoid = yong.avoid.filter((w) => w !== drugWx && w !== yong.xi);     // gỡ thuốc + Hỷ mới khỏi Kỵ
        // [loop 127 fix] thêm Kỵ/Thù mới từ new primary (ji=克 Dụng, chou=sinh Kỵ)
        for (const w of [yong.ji, yong.chou]) if (w && !yong.avoid.includes(w)) yong.avoid.push(w);
        yong.reasons.push(`★ Bệnh Dược LÀM CHỦ (败中有成): mệnh «${patternQualityResult.quality}» — bệnh «${(firstRescue.diseaseNote || '').slice(0, 50)}» CÓ CỨU bằng nhóm ${firstRescue.drug[0]} (hành ${drugWx}) → Dụng Thần CHÍNH = ${drugWx} («有病方为贵»). Phù Ức cũ (${oldPrimary}) giáng secondary.`);
        if (!yong.method.includes('Bệnh Dược (病药) — LÀM CHỦ (败中有成)')) yong.method.push('Bệnh Dược (病药) — LÀM CHỦ (败中有成)');
      }
    }
  } catch (e) { /* 病药 promotion không bắt buộc */ }
  let dayun = [], liunian = [];
  try { dayun = computeDaYun(year, month, day, hour, minute, gender, yong); } catch (e) { dayun = []; }
  try { liunian = computeLiuNian(year, month, day, hour, minute, gender, yong, refYear); } catch (e) { liunian = []; }
  // [loop 2 — 格局大运喜忌] Cộng tầng 格局 LÊN TRÊN tầng ngũ hành (子平真詮 ch.10-11).
  //   patternQuality đã tính xong ở trên → giờ mới điều chỉnh dayun (giải sequencing).
  try {
    if (patternQualityResult) dayun = adjustDayunByGeju(dayun, patternQualityResult, chart.dayGan);
  } catch (e) { /* fallback: giữ dayun tầng ngũ hành */ }
  // [loop 431 elevate] 大运 空亡 weakening — cổ pháp «空则不实»: 大运 chi rơi không vong →
  //   lực giảm (~30%). Trước đây 大运 full score dù trong 空亡 (lưu niên mới bắt «出空»).
  if (kongwang && kongwang.kong && kongwang.kong.length) {
    const voidSet = new Set(kongwang.kong);
    for (const d of dayun) {
      if (voidSet.has(d.zhi)) {
        d.score = Math.round(d.score * 0.7);
        // re-rate after weakening [loop 454] shared _dayunRating
        d.rating = _dayunRating(d.score);
        if (!d._kwNote) d._kwNote = `Chi ${d.zhi} = KHÔNG VONG → lực giảm («không thực»)`;
      }
    }
  }
  // [loop 453 elevate] 源流 × 大运 interaction — 滴天髓: vận đến CÓ MỞ dòng tắc
  //   (源流 gap) → CÁT lớn; KHẮC归宿 (harm aspect thịnh) → HUNG nhẹ; SINH nguồn → CÁT nhẹ.
  //   Connects 源流 tĩnh (loop 452) với đại vận động. 大运重地支 (loop 164) → xét chiWx.
  //   Trước đây 大运 score CHỈ xét 用神/clash/空亡, không biết dòng 源流 đang tắc ở đâu →
  //   vận bổ đúng hành «mở dòng» không được cộng thưởng. Nay 源流 feedback vào 大运.
  const yuanliu = (() => { try { return analyzeYuanLiu(wx, chart.dayMaster.wx); } catch (e) { return null; } })();
  if (yuanliu) {
    const _SG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
    const _KK = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
    for (const d of dayun) {
      const mods = [];
      if (yuanliu.gap && d.zhiWx === yuanliu.gap) { d.score += 2; mods.push(`vận ${d.zhi} (${d.zhiWx}) MỞ dòng tắc 源流 ${yuanliu.gap} → khí LƯU THÔNG`); }
      if (yuanliu.source && _SG[d.zhiWx] === yuanliu.source) { d.score += 1; mods.push(`vận ${d.zhi} SINH nguồn ${yuanliu.source} → khí PHÁT`); }
      if (yuanliu.endpoint && _KK[d.zhiWx] === yuanliu.endpoint) { d.score -= 1; mods.push(`vận ${d.zhi} KHẮC归宿 ${yuanliu.endpoint} (${yuanliu.aspectKey}) → ${yuanliu.aspectKey} TỔN`); }
      if (mods.length) { d.rating = _dayunRating(d.score); d._ylNote = mods.join(' · '); } // [loop 454] shared
    }
  }
  // [loop 3 — 格局流年喜忌] Cộng tầng 格局 LÊN TRÊN 5 trường phái của scoreLiunianYear
  //   (ngũ hành / thập thần năm / thái tuế / thần sát / thiên khắc địa xung). Cùng luật
  //   喜忌 với 大运 nhưng ±3 (năm tập trung hơn运 10 năm). sequencing giống loop 2.
  try {
    if (patternQualityResult) liunian = adjustLiunianByGeju(liunian, patternQualityResult, chart.dayGan);
  } catch (e) { /* fallback: giữ liunian tầng 5 trường phái */ }
  let synthesis = {};
  // [loop 468] 盖头截脚 — tính trước synthesis (cần {chart,yong}), feed vào tổng luận.
  const pillarQualResult = (() => { try { return analyzePillarQuality({ chart, yong }); } catch (e) { return null; } })();
  try { synthesis = synthesize({ chart, wx, strength, interactions, shensha, pattern, yong, patternQuality: patternQualityResult, dayun, yuanliu, kongwang, pillarQuality: pillarQualResult }); } catch (e) { synthesis = { paragraphs: [] }; }
  // [loop 466 FIX BUG CAO] truyền yuanliu + kongwang vào synthesize. Trước đây synthesize
  //   nhận object THIẾU 2 field này → 源流 factor (loop 457) VÀ 空亡 penalty (loop 150) là
  //   DEAD CODE trong production (R.yuanliu/R.kongwang undefined → if(yl)/if(kw) skip).
  //   Tổng luận bỏ qua dòng khí + trụ void-pillar suốt! Nay fix → 2 factor activate.
  const full = { chart, wx, strength, interactions, shensha, pattern, yong, dayun, liunian, synthesis, patternQuality: patternQualityResult, kongwang, pillarQuality: pillarQualResult };
  try { full.liuqin = analyzeLiuqin(full); } catch (e) { full.liuqin = []; }
  try { full.remedy = buildRemedy(full); } catch (e) { full.remedy = { twelveLaws: [] }; }
  // [loop 452] 源流 dòng khí ngũ hành — đọc độc lập từ wx (không cascade/đổi score).
  // [loop 453] tái dụng `yuanliu` đã tính ở tầng 大运 interaction (tránh tính 2 lần).
  full.yuanliu = yuanliu || (() => { try { return analyzeYuanLiu(wx, chart.dayMaster.wx); } catch (e) { return null; } })();
  return full;
}
