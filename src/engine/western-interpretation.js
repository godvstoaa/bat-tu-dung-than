// western-interpretation.js — Luận giải bản đồ sao phương Tây
// Dùng data từ western-interpretation-data.js (research via grok CLI) + SUN/MOON/ASC từ western-kb.js.
// interpretWestern(chart) → structured natal reading cho renderWesternCard.
import {
  MERCURY_IN_SIGN, VENUS_IN_SIGN, MARS_IN_SIGN, JUPITER_IN_SIGN, SATURN_IN_SIGN,
  URANUS_IN_SIGN, NEPTUNE_IN_SIGN, PLUTO_IN_SIGN,
  SUN_IN_HOUSE, MOON_IN_HOUSE, VENUS_IN_HOUSE, MARS_IN_HOUSE,
  ASPECT_MEANINGS, ASPECT_PAIRS, ELEMENT_BALANCE,
} from './western-interpretation-data.js';
import { SUN_IN_SIGN, MOON_IN_SIGN, ASCENDANT_MEANING } from './western-kb.js';

// planet key → {signKB, houseKB, label, icon}
const PLANET_MAP = {
  sun:     { label: 'Mặt Trời (Sun)',     icon: '☀', signKB: SUN_IN_SIGN,     houseKB: SUN_IN_HOUSE,    vi: 'bản ngã' },
  moon:    { label: 'Mặt Trăng (Moon)',   icon: '☾', signKB: MOON_IN_SIGN,    houseKB: MOON_IN_HOUSE,   vi: 'cảm xúc' },
  mercury: { label: 'Sao Thủy (Mercury)', icon: '☿', signKB: MERCURY_IN_SIGN, houseKB: null,            vi: 'tư duy' },
  venus:   { label: 'Sao Kim (Venus)',    icon: '♀', signKB: VENUS_IN_SIGN,   houseKB: VENUS_IN_HOUSE,  vi: 'tình yêu' },
  mars:    { label: 'Sao Hỏa (Mars)',     icon: '♂', signKB: MARS_IN_SIGN,    houseKB: MARS_IN_HOUSE,   vi: 'hành động' },
  jupiter: { label: 'Sao Mộc (Jupiter)',  icon: '♃', signKB: JUPITER_IN_SIGN, houseKB: null,            vi: 'mở rộng' },
  saturn:  { label: 'Sao Thổ (Saturn)',   icon: '♄', signKB: SATURN_IN_SIGN,  houseKB: null,            vi: 'kỷ luật' },
  uranus:  { label: 'Sao Thiên Vương',    icon: '♅', signKB: URANUS_IN_SIGN,  houseKB: null,            vi: 'đột biến' },
  neptune: { label: 'Sao Hải Vương',      icon: '♆', signKB: NEPTUNE_IN_SIGN, houseKB: null,            vi: 'mơ mộng' },
  pluto:   { label: 'Sao Diêm Vương',     icon: '♇', signKB: PLUTO_IN_SIGN,   houseKB: null,            vi: 'cải biến' },
};

const ASPECT_VI_MAP = { 'hợp nhất': 'Hợp nhất', 'đối': 'Đối xung', 'đối xung': 'Đối xung', 'tam hợp': 'Tam hợp', 'vuông': 'Vuông góc', 'vuông góc': 'Vuông góc', 'lục hợp': 'Lục hợp' };
// chart.aspect là VIETNAMESE dạng ngắn (hợp nhất/đối/tam hợp/vuông/lục hợp) → map key VN đầy đủ
const MAJOR_ASPECT_VI = ['hợp nhất', 'đối', 'tam hợp', 'vuông', 'lục hợp'];
const PAIR_KEYS = ['Sun-Moon', 'Sun-Venus', 'Sun-Mars', 'Sun-Saturn', 'Moon-Venus', 'Venus-Mars', 'Venus-Saturn', 'Mars-Saturn'];
const PLANET_EN = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' };

/**
 * interpretWestern(chart) — full natal reading từ computeWesternChart output.
 * @returns { bigThree, planets, aspects, element, summary }
 */
export function interpretWestern(chart) {
  if (!chart || !chart.sun) return null;
  const out = { bigThree: [], planets: [], aspects: [], element: '', summary: '' };

  // Big Three (Sun/Moon/Asc)
  out.bigThree.push({ icon: '☀', label: `Mặt Trời ${chart.sun.signVi}`, text: SUN_IN_SIGN[chart.sun.signVi] || '' });
  out.bigThree.push({ icon: '☾', label: `Mặt Trăng ${chart.moon.signVi}`, text: MOON_IN_SIGN[chart.moon.signVi] || '' });
  if (chart.ascendant?.signVi) out.bigThree.push({ icon: '↑', label: `Cung mọc ${chart.ascendant.signVi}`, text: ASCENDANT_MEANING[chart.ascendant.signVi] || '' });

  // Each planet: sign reading + house reading (if available)
  for (const [key, pm] of Object.entries(PLANET_MAP)) {
    const p = chart[key];
    if (!p || !p.signVi) continue;
    const signReading = pm.signKB?.[p.signVi] || '';
    const houseReading = (pm.houseKB && p.house) ? pm.houseKB[String(p.house)] || '' : '';
    out.planets.push({
      key, icon: pm.icon, label: pm.label, vi: pm.vi,
      signVi: p.signVi, house: p.house || null,
      signReading, houseReading,
      retrograde: !!p.retrograde,
    });
  }

  // Aspects: chart.aspect là VI ngắn → map key VN đầy đủ của ASPECT_MEANINGS + pairs
  const majorAspects = (chart.aspects || []).filter(a => MAJOR_ASPECT_VI.includes(a.aspect));
  const seen = new Set();
  for (const a of majorAspects.slice(0, 12)) {
    const viKey = ASPECT_VI_MAP[a.aspect] || a.aspect;
    const meaning = ASPECT_MEANINGS[viKey] || '';
    const pairName = pairKey(a.a, a.b);
    const pairReading = pairName ? (ASPECT_PAIRS[pairName] || '') : '';
    const dedupeKey = [a.a, a.b, a.aspect].sort().join('|');
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.aspects.push({ a: a.a, b: a.b, aspectVi: viKey, meaning, pairReading });
  }

  // Element balance: dominant + lacking
  const eb = chart.elementBalance || {};
  const sorted = Object.entries(eb).sort(([, x], [, y]) => y - x);
  const dominant = sorted[0]?.[0];
  const lacking = sorted.find(([k]) => (eb[k] || 0) === 0)?.[0];
  let elText = '';
  if (dominant && ELEMENT_BALANCE[dominant + ' trội']) elText += ELEMENT_BALANCE[dominant + ' trội'] + ' ';
  if (lacking && ELEMENT_BALANCE['Thiếu ' + lacking]) elText += '⚠ ' + ELEMENT_BALANCE['Thiếu ' + lacking];
  out.element = elText.trim();

  // Summary one-liner
  out.summary = `Big Three ${chart.summary?.bigThree || ''}. Nguyên tố trội: ${dominant || '?'}${lacking ? ` · thiếu ${lacking}` : ''}.`;

  return out;
}

function pairKey(a, b) {
  // normalize Vietnamese planet names → Sun/Moon/Venus/Mars/Saturn
  const N = { 'Mặt Trời': 'Sun', Sun: 'Sun', 'Mặt Trăng': 'Moon', Moon: 'Moon', 'Sao Kim': 'Venus', Venus: 'Venus', 'Sao Hỏa': 'Mars', Mars: 'Mars', 'Sao Thổ': 'Saturn', Saturn: 'Saturn' };
  const na = N[a] || a, nb = N[b] || b;
  const pair = [na, nb].sort();
  const k = pair.join('-');
  return PAIR_KEYS.includes(k) ? k : null;
}

/**
 * renderInterpretation(chart) — HTML cho section «Luận giải lá số phương Tây».
 */
export function renderInterpretation(chart) {
  const interp = interpretWestern(chart);
  if (!interp) return '<p class="hint">Không luận giải được.</p>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bigThreeHtml = interp.bigThree.map(b => `<div class="wi-b3"><span class="wi-icon">${b.icon}</span><div><b>${esc(b.label)}</b><div class="wi-text">${esc(b.text)}</div></div></div>`).join('');
  // planets: personal (sun-mars) detailed, social/outer (jupiter-pluto) compact
  const PERSONAL = ['sun', 'moon', 'mercury', 'venus', 'mars'];
  const personal = interp.planets.filter(p => PERSONAL.includes(p.key)).map(p => planetRow(p, esc)).join('');
  const outer = interp.planets.filter(p => !PERSONAL.includes(p.key)).map(p => `<span class="wi-outer"><b>${p.icon} ${esc(p.signVi)}</b> ${esc(p.signReading)}</span>`).join(' ');
  const aspectHtml = interp.aspects.length
    ? interp.aspects.map(a => `<div class="wi-asp"><b>${esc(a.a)} ${esc(a.aspectVi)} ${esc(a.b)}</b>${a.pairReading ? ` — <span class="wi-text">${esc(a.pairReading)}</span>` : a.meaning ? ` — <span class="wi-text">${esc(a.meaning)}</span>` : ''}</div>`).join('')
    : '<p class="hint">(không có aspect chính trong orb)</p>';
  return `
    <div class="western-interp">
      <details open><summary class="card-title" style="cursor:pointer;font-size:.95em">🌟 Big Three — bản chất cốt lõi</summary>
        <div class="wi-b3grid">${bigThreeHtml}</div></details>
      <details open><summary class="card-title" style="cursor:pointer;font-size:.95em">🪐 Luận giải hành tinh (cá nhân)</summary>
        <div class="wi-planets">${personal}</div></details>
      <details><summary class="card-title" style="cursor:pointer;font-size:.95em">♄ Hành tinh xã hội & thế hệ (Jupiter→Pluto)</summary>
        <div class="wi-outers">${outer}</div></details>
      <details><summary class="card-title" style="cursor:pointer;font-size:.95em">⚡ Aspects — góc hành tinh (luận giải)</summary>
        <div class="wi-aspects">${aspectHtml}</div></details>
      ${interp.element ? `<details><summary class="card-title" style="cursor:pointer;font-size:.95em">⚖ Cân bằng nguyên tố (luận giải)</summary><p class="wi-text">${esc(interp.element)}</p></details>` : ''}
      <p class="hint-inline" style="margin-top:8px;display:block">${esc(interp.summary)} · Chiêm tinh phương Tây là hệ biểu tượng văn hóa, không validate khoa học — tham khảo/đối chiếu.</p>
    </div>`;
}

function planetRow(p, esc) {
  return `<div class="wi-planet">
    <span class="wi-phead"><b>${p.icon} ${esc(p.label)}</b> <span class="hint-inline">${esc(p.signVi)}${p.house ? ' · cung ' + p.house : ''}${p.retrograde ? ' ℞' : ''}</span></span>
    <div class="wi-text">${esc(p.signReading)}</div>
    ${p.houseReading ? `<div class="wi-text wi-house">🏠 ${esc(p.houseReading)}</div>` : ''}
  </div>`;
}
