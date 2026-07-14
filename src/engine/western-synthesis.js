// ============================================================================
//  WESTERN SYNTHESIS — sơ đồ tổng hợp Bát Tự ↔ Western Astrology
//  «Sơ Đồ Tổng Hợp»: 1 cái nhìn trực quan đối chiếu 2 trường phái cho cùng 1 người.
//
//  Phần A — DIMENSION-BRIDGE: từng chiều đời [BaZi chip] ⟷ [verdict] ⟷ [Western chip]
//    (theo docs/WESTERN-BAZI-MAPPING-RESEARCH.md 15-dim + SYNTHESIS-DIAGRAM-DESIGN.md)
//  Phần B — FUTURE TIMELINE: Đại vận/Lưu niên BaZi ↔ Profections/Transits Western (N năm tới)
//    (theo docs/FUTURE-PREDICTION-RESEARCH.md)
//
//  TRUNG THỰC: 2 hệ đều KHÔNG validate khoa học; không map 1:1 (5 hành ≠ 4 nguyên tố;
//  BaZi không có Ascendant/Dụng Thần; Western không có 起运). Verdict = «resonance» không = «đúng».
// ============================================================================
import { BAZI_WESTERN_MAP } from './western-kb.js';
import { computeWesternChart } from './western-astro.js';
import { computeWesternForecast } from './western-predict.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Thập thần → ngũ hành của sao (để map element)
const GOD_WX = { '正官':'Kim?(tùy ĐM)','七杀':'Kim?(tùy ĐM)','正印':'?','偏印':'?','食神':'?','伤官':'?','比肩':'?','劫财':'?','正财':'?','偏财':'?' };

/**
 * Part A — synthesis từng chiều đời.
 * @param R — BaZi analyze() result
 * @param W — computeWesternChart() result
 * @returns array of { dim, icon, bazi:{label,value}, western:{label,value}, verdict, note }
 */
export function synthesisDimensions(R, W) {
  const c = R.chart, y = R.yong, str = R.strength || {};
  const dmGan = c.dayMaster?.gan || '?';
  const dmVi = ({ '甲':'Giáp Mộc','乙':'Ất Mộc','丙':'Bính Hỏa','丁':'Đinh Hỏa','戊':'Mậu Thổ','己':'Kỷ Thổ','庚':'Canh Kim','辛':'Tân Kim','壬':'Nhâm Thủy','癸':'Quý Thủy' })[dmGan] || dmGan;
  // Lấy thập thần lộ + god chính
  const gods = ['year','month','time'].map(p => c.pillars?.[p]?.ganGod).filter(Boolean);
  const hasAn = gods.includes('正印') || gods.includes('偏印');
  const hasGuan = gods.includes('正官') || gods.includes('七杀');
  const hasSha = gods.includes('七杀');
  const hasTai = gods.includes('正财') || gods.includes('偏财');
  const hasShang = gods.includes('伤官') || gods.includes('食神');
  const dayZhi = c.pillars?.day?.zhi || '?';

  return [
    {
      dim: 'Bản ngã / cái tôi', icon: '☉',
      bazi: { label: 'Nhật Chủ', value: dmVi + (str.strong ? ' (vượng)' : ' (nhược)') },
      western: { label: 'Sun', value: W.sun.signVi + ' ' + W.sun.degree + '°' },
      verdict: 'resonance',
      note: 'Cốt lõi danh tính — 2 hệ cùng chỉ «con người thật».',
    },
    {
      dim: 'Cảm xúc / nội tâm', icon: '☾',
      bazi: { label: 'Ấn (Resource)', value: hasAn ? 'Ấn lộ (' + gods.filter(g => /印/.test(g)).join(',') + ')' : 'Ấn ẩn/tàng' },
      western: { label: 'Moon', value: W.moon.signVi + ' ' + W.moon.degree + '°' },
      verdict: 'approx',
      note: 'Ấn ≈ mẹ/sự nuôi dưỡng ≈ Moon — nhưng Ấn còn nghĩa quyền lực, không chính xác 1:1.',
    },
    {
      dim: 'Bề ngoài / ấn tượng đầu', icon: '↑',
      bazi: { label: '(Trụ Giờ —近似)', value: (c.pillars?.time?.ganZhi) + ' (không phải «mặt nạ»)' },
      western: { label: 'Ascendant', value: W.ascendant.signVi + ' ' + W.ascendant.degree + '°' },
      verdict: 'gap',
      note: 'Western có Rising «mặt nạ», BaZi KHÔNG có tương đương thật (trụ giờ = con cái/晚niên).',
    },
    {
      dim: 'Giao tiếp / trí tuệ', icon: '☿',
      bazi: { label: 'Thương/Thực', value: hasShang ? gods.filter(g => /伤官|食神/.test(g)).join(',') : '(khác)' },
      western: { label: 'Mercury', value: W.mercury.signVi + (W.mercury.retrograde ? ' ℞' : '') },
      verdict: 'approx',
      note: 'Thương Quan/Thực Thần = đầu ra/sáng tạo ≈ Mercury giao tiếp — khác góc.',
    },
    {
      dim: 'Tình cảm / hôn nhân', icon: '♀',
      bazi: { label: 'Chi ngày (Phu Thê)', value: dayZhi + ' cung vợ/chồng' },
      western: { label: 'Venus', value: W.venus.signVi },
      verdict: 'approx',
      note: 'BaZi chi ngày = cung配偶 (gendered: Tài=vợ nam, Quan=chồng nữ); Western Venus phổ quát.',
    },
    {
      dim: 'Drive / nghị lực', icon: '♂',
      bazi: { label: 'Thất Sát / Kiếp', value: hasSha ? 'Thất Sát lộ' : (hasGuan ? 'Chính Quan' : 'khác') },
      western: { label: 'Mars', value: W.mars.signVi + (W.mars.retrograde ? ' ℞' : '') },
      verdict: 'resonance',
      note: 'Thất Sát (uy quyền, dũng) ≈ Mars+Pluto — archetypal mạnh.',
    },
    {
      dim: 'Nguyên tố / khí chất', icon: '⚖',
      bazi: { label: 'Ngũ hành', value: 'Thủy ' + (R.wx?.pct?.水||0) + '% · Mộc ' + (R.wx?.pct?.木||0) + '% · Hỏa ' + (R.wx?.pct?.火||0) + '% · Thổ ' + (R.wx?.pct?.土||0) + '% · Kim ' + (R.wx?.pct?.金||0) + '%' },
      western: { label: '4 nguyên tố', value: 'Hỏa ' + W.elementBalance.Hỏa + ' · Thổ ' + W.elementBalance.Thổ + ' · Khí ' + W.elementBalance.Khí + ' · Thủy ' + W.elementBalance.Thủy },
      verdict: 'gap',
      note: '2 hệ KHÁC nhau: BaZi 5 pha (có Mộc/Kim), Western 4 chất (có Khí). KHÔNG map 1:1.',
    },
    {
      dim: 'Dụng Thần / điều chỉnh', icon: '◎',
      bazi: { label: 'Dụng Thần', value: y.primary + ' (Hỷ ' + (y.xi||'?') + ', Kỵ ' + (y.ji||'?') + ')' + (y.tiaohou?.override ? ' [调候 override]' : '') },
      western: { label: '(không có)', value: '— Western chỉ mô tả, không «kê đơn» hành bổ sung' },
      verdict: 'gap',
      note: 'Dụng Thần = BaZi ĐỘC QUYỀN (hành cần bổ sung). Western chỉ thấy cân bằng yếu tố, không «remedy».',
    },
  ];
}

/**
 * Part B — timeline dự báo tương lai (BaZi Đại vận/Lưu niên ↔ Western Profections/Transits).
 * @param R — BaZi result (R.dayun, R.liunian)
 * @param forecast — computeWesternForecast() result
 * @param currentYear
 * @returns array of years { year, age, bazi:{dayun, liunianTone, isGolden}, western:{profection, tone, topTransit}, convergence }
 */
export function synthesisTimeline(R, forecast, currentYear) {
  const dayun = R.dayun || [];
  const liunian = R.liunian || [];
  const goldenYears = new Set((R.remedy?.timing || []).filter(t => /Cát|Đại cát/.test(t.rating || '')).map(t => t.year));
  const out = [];
  for (const y of forecast.years) {
    // BaZi side
    const ln = liunian.find(l => l.year === y.year);
    const xusuiAge = y.age + 1;
    const dy = [...dayun].reverse().find(d => d.startAge <= xusuiAge) || dayun[0];
    const isGolden = goldenYears.has(y.year);
    const lnTone = ln?.rating ? (/Cát|Đại cát/i.test(ln.rating) ? 'cat' : /Hung|Kỵ|大凶/i.test(ln.rating) ? 'hung' : 'trung') : 'trung';
    // Western side
    const wTone = y.tone;
    // convergence: cả 2 cùng cat → 「THUẬN»; cùng hung → «CẨN THẬN»; khác → «TRUNG»
    let conv = 'trung', convVi = 'Trung hòa';
    if (lnTone === 'cat' && wTone === 'cat') { conv = 'cat'; convVi = '🌟 THUẬN — 2 hệ cùng cát'; }
    else if (lnTone === 'hung' && wTone === 'hung') { conv = 'hung'; convVi = '⚠ CẨN THẬN — 2 hệ cùng hung'; }
    else if (lnTone === 'cat' || wTone === 'cat') { conv = 'cat-light'; convVi = 'Hơi thuận'; }
    else if (lnTone === 'hung' || wTone === 'hung') { conv = 'hung-light'; convVi = 'Hơi cẩn thận'; }
    out.push({
      year: y.year, age: y.age,
      bazi: { dayun: dy?.ganZhi + ' (' + (dy?.rating || '?') + ')', liunian: ln ? ln.ganZhi + ' (' + (ln.rating || '?') + ')' : '?', liunianTone: lnTone, isGolden },
      western: { profection: y.profection.signVi + ' (cung ' + y.profection.house + ', ' + y.profection.ruler + ')', tone: wTone, topTransit: y.topTransits[0]?.type || '' },
      convergence: convVi, convKey: conv,
    });
  }
  return out;
}

const TONE_BADGE = { cat: '🟢', 'cat-light': '🟢', trung: '🟡', 'hung-light': '🟠', hung: '🔴', resonance: '🟢', approx: '🟡', gap: '⚫' };
const TONE_CLASS = { cat: 'rate-cat', 'cat-light': 'rate-cat', trung: 'rate-mid', 'hung-light': 'rate-bad', hung: 'rate-bad', resonance: 'rate-cat', approx: 'rate-mid', gap: 'rate-mid' };

/**
 * Render HTML card «Sơ Đồ Tổng Hợp».
 */
export function renderSynthesisCard(R, birthUT, lat = 21.03, lng = 105.85, currentYear) {
  try {
    const W = computeWesternChart(birthUT, lat, lng);
    const forecast = computeWesternForecast(W, birthUT, currentYear || new Date().getFullYear(), 10);
    const dims = synthesisDimensions(R, W);
    const timeline = synthesisTimeline(R, forecast, currentYear || new Date().getFullYear());
    const dimRows = dims.map(d => `
      <div class="syn-row">
        <div class="syn-side syn-bazi"><span class="syn-label">${esc(d.bazi.label)}</span><b>${esc(d.bazi.value)}</b></div>
        <div class="syn-mid"><span class="syn-badge ${TONE_CLASS[d.verdict] || 'rate-mid'}">${TONE_BADGE[d.verdict] || '🟡'} ${d.verdict === 'resonance' ? 'khớp' : d.verdict === 'approx' ? 'gần' : 'lech'}</span><span class="syn-dim">${esc(d.icon)} ${esc(d.dim)}</span><span class="syn-note">${esc(d.note)}</span></div>
        <div class="syn-side syn-west"><span class="syn-label">${esc(d.western.label)}</span><b>${esc(d.western.value)}</b></div>
      </div>`).join('');
    const tlRows = timeline.map(t => `
      <div class="syn-tl-row syn-conv-${t.convKey}">
        <div class="syn-tl-year">${t.year}<span class="hint-inline"> ${t.age}t</span>${t.bazi.isGolden ? ' ★vàng' : ''}</div>
        <div class="syn-tl-side"><span class="hint-inline">BaZi</span> ${esc(t.bazi.dayun)} · ${esc(t.bazi.liunian)}</div>
        <div class="syn-tl-side"><span class="hint-inline">Western</span> ${esc(t.western.profection)}${t.western.topTransit ? ' · ' + esc(t.western.topTransit) : ''}</div>
        <div class="syn-tl-conv">${esc(t.convergence)}</div>
      </div>`).join('');
    return `
      <div class="synthesis-diagram">
        <div class="syn-header">
          <div class="syn-crest"><span class="syn-title-bazi">八字 BÁT TỰ</span><span class="syn-vs">⟷</span><span class="syn-title-west">♉ WESTERN</span></div>
          <div class="hint-inline">Sơ đồ đối chiếu 2 trường phái cho cùng lá số — phần A: tính cách (8 chiều), phần B: dự báo tương lai (10 năm).</div>
        </div>
        <details open><summary class="card-title" style="cursor:pointer">🅰 Đối chiếu tính cách — Dimension Bridge</summary>
          <div class="syn-dims">${dimRows}</div>
          <p class="hint-inline" style="margin-top:6px;display:block">${esc(BAZI_WESTERN_MAP.COMPARISON_NOTES?.[0] || 'Cả 2 hệ đều tham khảo, không validate khoa học.')}</p>
        </details>
        <details open><summary class="card-title" style="cursor:pointer">🅱 Dự báo tương lai — Timeline 10 năm (Đại vận/Lưu niên ⟷ Profections/Transits)</summary>
          <div class="syn-tl">${tlRows}</div>
          <p class="hint-inline" style="margin-top:6px;display:block">${esc(forecast.caveat)}</p>
        </details>
        <details><summary class="card-title" style="cursor:pointer">📋 Ghi chú method &amp; ranh giới</summary>
          <div style="font-size:.85em;margin-top:6px;line-height:1.5">
            <p><b>BaZi:</b> ${esc(BAZI_WESTERN_MAP.timing)}</p>
            <p><b>Western:</b> ${esc(forecast.profectionNote)}</p>
            <p><b>Verdict:</b> ${esc((BAZI_WESTERN_MAP.COMPARISON_NOTES || []).join(' '))}</p>
          </div></details>
      </div>`;
  } catch (e) {
    return '<p class="hint">Không tính được sơ đồ tổng hợp: ' + esc(e.message) + '</p>';
  }
}
