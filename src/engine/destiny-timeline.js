// ============================================================================
//  NHÂN SINH THỜI GIAN TRỤC 人生时间轴 — LIFE TIMELINE DATA
//  Tổng hợp 8 module (vitality + dayun-god + dayun-rank + event-predict +
//  golden-year + forecast5 + spouse/wealth timing) → 1 timeline mạch lạc.
//  Nguồn: tổng hợp.
// ============================================================================
import { analyzeVitality } from './vitality.js';
import { dayunGodMeaning } from './dayun-god.js';
import { rankDayun } from './dayun-rank.js';
import { scanBranchYingqi } from './yingqi-branch.js';

/**
 * @returns {{ decades:[{range, ganZhi, godVi, godCat, theme, vitalityScore,
 *            vitalityPhase, rank, wealthHint, careerHint, lifePhase, summary }],
 *            peakDecade, challengeDecade, goldenYears, summary }}
 */
export function lifeTimeline(R) {
  const vit = analyzeVitality(R);
  const dg = dayunGodMeaning(R.chart, R.dayun);
  const rk = rankDayun(R);

  // Map theo ganZhi để tra chéo
  const vitMap = {};
  for (const t of vit.trajectory) vitMap[t.ganZhi] = t;
  const rkMap = {};
  for (const r of rk.ranked) rkMap[r.ganZhi] = r;
  const dgMap = {};
  for (const d of dg.items) dgMap[d.ganZhi] = d;
  // [loop 1002] 应期 dayun activation theo thập kỷ — «cửa mở 10 năm» cho sao ẩn (989-1000)
  const yqMap = {};
  try {
    const yqActs = scanBranchYingqi(R, 2026, 1).dayunActivations || [];
    for (const a of yqActs) {
      if (!yqMap[a.ganZhi]) yqMap[a.ganZhi] = [];
      yqMap[a.ganZhi].push(a);
    }
  } catch (e) {}

  const decades = (R.dayun || []).map((d) => {
    const gz = d.ganZhi;
    const v = vitMap[gz] || {};
    const r = rkMap[gz] || {};
    const g = dgMap[gz] || {};

    // Wealth hint: Chính Tài/Thiên Tài → tài vận
    let wealthHint = '';
    if (g.godVi === 'Chính Tài') wealthHint = '💰 Tài lộc ổn định — nên tích luỹ';
    else if (g.godVi === 'Thiên Tài') wealthHint = '💰 Tài biến động — cơ hội lớn nhưng rủi ro';
    else if (g.godVi === 'Kiếp Tài') wealthHint = '⚠ Hao tiền — giữ chặt, tránh đầu cơ';

    // Career hint
    let careerHint = '';
    if (g.godVi === 'Chính Quan') careerHint = '💼 Thăng tiến, danh vọng';
    else if (g.godVi === 'Thất Sát') careerHint = '💼 Áp lực nhưng có quyền';
    else if (g.godVi === 'Chính Ấn') careerHint = '📚 Học vấn/quý nhân';

    // Life phase
    const fromAge = d.startAge;
    let lifePhase;
    if (fromAge < 15) lifePhase = '👶 Thiếu thời';
    else if (fromAge < 25) lifePhase = '🎓 Thanh xuân';
    else if (fromAge < 40) lifePhase = '💪 Tráng niên';
    else if (fromAge < 55) lifePhase = '🏔 Trung niên';
    else if (fromAge < 70) lifePhase = '🌅 Vãn niên';
    else lifePhase = '🍂 Mộ niên';

    const score = v.score || 50;
    const tone = score >= 65 ? '🟢' : score >= 45 ? '🟡' : '🔴';
    // [loop 1002] 应期 activation cho thập kỷ này (nếu có)
    const yqActs = yqMap[gz] || [];
    const yingqiHint = yqActs.length
      ? yqActs.map((a) => `${a.type === 'xung mở kho' ? '★MởKho' : a.type === 'tam hợp thành cục' ? '≡TamHợp' : a.type === 'hợp dẫn' ? '∼Hợp' : '×Xung'}${a.branch}→${a.groups.map((g2) => g2.vi).join('+')}${a.tone === 'cat' ? '(Dụng)' : a.tone === 'hung' ? '(Kỵ)' : ''}`).join(' ')
      : '';

    return {
      range: `${fromAge}-${fromAge + 9}t`,
      ganZhi: gz, rank: r.rank || '?', totalScore: r.totalScore || 0,
      godVi: g.godVi || '?', godCat: g.cat || '?', godTheme: g.theme || '',
      vitalityScore: score, vitalityPhase: v.phase || '',
      lifePhase, tone,
      wealthHint, careerHint,
      yingqiActivations: yqActs,
      summary: `${lifePhase} ${tone} ${gz} [${g.godVi}] rank #${r.rank || '?'} vit=${score}${wealthHint ? ' ' + wealthHint : ''}${careerHint ? ' ' + careerHint : ''}${yingqiHint ? ' 🔓' + yingqiHint : ''}`,
    };
  });

  // [loop 31 sửa] empty dayun → KHÔNG render "undefined" trong summary
  if (!decades.length) return { decades: [], peakDecade: null, challengeDecade: null, goldenYears: [], summary: 'Không có dữ liệu đại vận.' };

  // Peak & challenge
  const peak = decades.reduce((a, b) => (b.vitalityScore > a.vitalityScore ? b : a), decades[0]);
  const challenge = decades.reduce((a, b) => (b.vitalityScore < a.vitalityScore ? b : a), decades[0]);

  // Golden years (vitality >= 65 AND rank <= 3) — [loop 31 sửa] code dùng <=4 mâu thuẫn comment <=3
  const golden = decades.filter(d => d.vitalityScore >= 65 && (d.rank || 99) <= 3);

  const summary = `Timeline ${decades.length} thập niên: Đỉnh ${peak.range} (${peak.ganZhi}, vit=${peak.vitalityScore}), Thách thức ${challenge.range} (${challenge.ganZhi}, vit=${challenge.vitalityScore}). ${golden.length ? `Khu vàng: ${golden.map(g => g.range).join(', ')}.` : 'Không có khu vàng rõ.'}`;

  return { decades, peakDecade: peak, challengeDecade: challenge, goldenYears: golden, summary };
}
