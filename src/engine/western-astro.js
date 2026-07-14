// ============================================================================
//  WESTERN ASTROLOGY — bản đồ sao phương Tây (natal chart)
//  Tính từ ngày/giờ/địa điểm sinh dùng astronomy-engine (geocentric tropical).
//  Cho phép app Bát Tự đối chiếu với chiêm tinh phương Tây.
//
//  Độ chính xác: astronomy-engine chính xác tới arcsecond cho hành tinh; Moon
//  nhạy giờ sinh (~13°/ngày). Ascendant dùng công thức Meeus/RadixPro chuẩn:
//    tan(Asc) = cos(RAMC) / -(sin(ε)·tan(φ) + cos(ε)·sin(RAMC))
//  Hệ cung: Whole Sign (cổ, Hellene — Asc sign = cung 1). Aspects: 5 major.
// ============================================================================
import * as A from 'astronomy-engine';
import { renderInterpretation } from './western-interpretation.js';

// === 12 CUNG HOÀNG ĐẠO (tropical) ===
export const SIGNS = [
  { vi: 'Bạch Dương', en: 'Aries',       element: 'Hỏa', modality: 'Khởi đầu', ruler: 'Sao Hỏa',     symbol: '♈' },
  { vi: 'Kim Ngưu',   en: 'Taurus',      element: 'Thổ', modality: 'Cố định',  ruler: 'Sao Kim',     symbol: '♉' },
  { vi: 'Song Tử',    en: 'Gemini',      element: 'Khí', modality: 'Biến đổi', ruler: 'Sao Thủy',    symbol: '♊' },
  { vi: 'Cự Giải',    en: 'Cancer',      element: 'Thủy',modality: 'Khởi đầu', ruler: 'Mặt Trăng',   symbol: '♋' },
  { vi: 'Sư Tử',      en: 'Leo',         element: 'Hỏa', modality: 'Cố định',  ruler: 'Mặt Trời',   symbol: '♌' },
  { vi: 'Xử Nữ',      en: 'Virgo',       element: 'Thổ', modality: 'Biến đổi', ruler: 'Sao Thủy',    symbol: '♍' },
  { vi: 'Thiên Bình', en: 'Libra',       element: 'Khí', modality: 'Khởi đầu', ruler: 'Sao Kim',     symbol: '♎' },
  { vi: 'Thiên Yết',  en: 'Scorpio',     element: 'Thủy',modality: 'Cố định',  ruler: 'Sao Diêm Vương/Hỏa', symbol: '♏' },
  { vi: 'Nhân Mã',    en: 'Sagittarius', element: 'Hỏa', modality: 'Biến đổi', ruler: 'Sao Mộc',     symbol: '♐' },
  { vi: 'Ma Kết',     en: 'Capricorn',   element: 'Thổ', modality: 'Khởi đầu', ruler: 'Sao Thổ',     symbol: '♑' },
  { vi: 'Bảo Bình',   en: 'Aquarius',    element: 'Khí', modality: 'Cố định',  ruler: 'Sao Thiên Vương/Thổ', symbol: '♒' },
  { vi: 'Song Ngư',   en: 'Pisces',      element: 'Thủy',modality: 'Biến đổi', ruler: 'Sao Hải Vương/Mộc', symbol: '♓' },
];

// === 10 HÀNH TINH ===
export const PLANETS = [
  { key: 'Sun',     vi: 'Mặt Trời',    body: null,            personal: true },
  { key: 'Moon',    vi: 'Mặt Trăng',   body: null,            personal: true },
  { key: 'Mercury', vi: 'Sao Thủy',    body: 'Mercury',       personal: true },
  { key: 'Venus',   vi: 'Sao Kim',     body: 'Venus',         personal: true },
  { key: 'Mars',    vi: 'Sao Hỏa',     body: 'Mars',          personal: true },
  { key: 'Jupiter', vi: 'Sao Mộc',     body: 'Jupiter',       personal: false },
  { key: 'Saturn',  vi: 'Sao Thổ',     body: 'Saturn',        personal: false },
  { key: 'Uranus',  vi: 'Sao Thiên Vương', body: 'Uranus',    personal: false },
  { key: 'Neptune', vi: 'Sao Hải Vương',  body: 'Neptune',    personal: false },
  { key: 'Pluto',   vi: 'Sao Diêm Vương', body: 'Pluto',      personal: false },
];

const OBLIQUITY = 23.4392911 * Math.PI / 180; // mean obliquity of ecliptic (deg→rad)

function norm360(x) { return ((x % 360) + 360) % 360; }
function signIdx(lon) { return Math.floor(norm360(lon) / 30); }
function rad(x) { return x * Math.PI / 180; }
function deg(x) { return x * 180 / Math.PI; }

/**
 * Kinh độ hoàng đạo TROPICAL (geocentric, 0..360) của một thiên thể.
 * Sun = SunPosition.elon; Moon = EclipticGeoMoon.lon; planets = GeoVector (geocentric EQJ)
 * → RotateVector(Rotation_EQJ_ECT) → atan2 (hoàng đạo thật của ngày). [tham chiếu qizheng.js]
 */
export function planetLongitude(name, date) {
  const t = date instanceof A.AstroTime ? date : new A.AstroTime(date);
  if (name === 'Sun') return norm360(A.SunPosition(t).elon);
  if (name === 'Moon') return norm360(A.EclipticGeoMoon(t).lon);
  const body = A.Body[name];
  const geoEqj = A.GeoVector(body, t, true); // true = aberration (geocentric)
  const geoEct = A.RotateVector(A.Rotation_EQJ_ECT(t), geoEqj);
  return norm360(deg(Math.atan2(geoEct.y, geoEct.x)));
}

/**
 * Ascendant (điểm đông phương — rising sign). Công thức Meeus/RadixPro chuẩn.
 * @param date Date (UT)
 * @param lat vĩ độ (độ, +Bắc)
 * @param lng kinh độ (độ, +Đông)
 */
export function ascendant(date, lat, lng) {
  const t = date instanceof A.AstroTime ? date : new A.AstroTime(date);
  const gmst = A.SiderealTime(t); // giờ (GMST)
  const lst = gmst + lng / 15;     // LST giờ
  const ramc = ((lst % 24) + 24) % 24 * 15; // RAMC độ
  const r = rad(ramc), phi = rad(lat);
  // tan(Asc) = cos(RAMC) / -(sin(ε)·tan(φ) + cos(ε)·sin(RAMC)); atan2 xử lý quadrant
  const asc = deg(Math.atan2(Math.cos(r), -(Math.sin(OBLIQUITY) * Math.tan(phi) + Math.cos(OBLIQUITY) * Math.sin(r))));
  return { lon: norm360(asc), ramc };
}

/**
 * Midheaven (MC — đỉnh thiên đỉnh) ecliptic longitude.
 * λ_MC = atan2(sin(RAMC), cos(RAMC)·cos(ε))
 */
export function midheaven(ramc) {
  const r = rad(ramc);
  const mc = deg(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(OBLIQUITY)));
  return norm360(mc);
}

/**
 * Retrograde: so sánh kinh độ hiện tại vs 1 ngày sau (planet đi lùi nếu lon giảm).
 */
function isRetrograde(name, date) {
  if (name === 'Sun' || name === 'Moon') return false; // luôn thuận
  const now = planetLongitude(name, date);
  const next = planetLongitude(name, new Date(date.getTime() + 86400000));
  let d = next - now;
  if (d > 180) d -= 360; if (d < -180) d += 360;
  return d < 0;
}

const ASPECT_DEFS = [
  { name: 'hợp nhất',  vi: 'Conjunction', angle: 0,   orb: 8, tone: 'trung tính' },
  { name: 'đối xung',  vi: 'Opposition',  angle: 180, orb: 8, tone: 'căng thẳng' },
  { name: 'tam hợp',   vi: 'Trine',       angle: 120, orb: 8, tone: 'cát/hài hòa' },
  { name: 'vuông góc', vi: 'Square',      angle: 90,  orb: 7, tone: 'căng thẳng' },
  { name: 'lục hợp',   vi: 'Sextile',     angle: 60,  orb: 6, tone: 'cát nhẹ' },
  { name: 'bán lục hợp',vi:'Quincunx',    angle: 150, orb: 3, tone: 'khó hòa' },
];

/**
 * Tính aspects giữa các cặp hành tinh.
 */
export function computeAspects(positions) {
  const keys = Object.keys(positions);
  const out = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = positions[keys[i]].lon, b = positions[keys[j]].lon;
      let d = Math.abs(a - b); if (d > 180) d = 360 - d;
      for (const def of ASPECT_DEFS) {
        const diff = Math.abs(d - def.angle);
        if (diff <= def.orb) {
          out.push({ a: keys[i], b: keys[j], aspect: def.name, aspectVi: def.vi, angle: def.angle, orb: +diff.toFixed(1), tone: def.tone });
          break;
        }
      }
    }
  }
  return out;
}

/**
 * Tính BẢN ĐỒ SAO PHƯƠNG TÂY đầy đủ.
 * @param {Date|string} date — ngày giờ sinh (UT nếu string ISO 'Z')
 * @param {number} lat — vĩ độ (độ, +Bắc)
 * @param {number} lng — kinh độ (độ, +Đông)
 * @returns natal chart object
 */
export function computeWesternChart(date, lat = 21.03, lng = 105.85) {
  const d = date instanceof Date ? date : new Date(date);
  const t = new A.AstroTime(d);
  // Vị trí 10 hành tinh
  const positions = {};
  for (const p of PLANETS) {
    const lon = planetLongitude(p.key, t);
    const s = SIGNS[signIdx(lon)];
    positions[p.key] = {
      vi: p.vi, key: p.key, lon: +lon.toFixed(4),
      signIdx: signIdx(lon), signVi: s.vi, signEn: s.en, signSymbol: s.symbol,
      degree: +(lon % 30).toFixed(2), retrograde: isRetrograde(p.key, d), personal: p.personal,
    };
  }
  // Ascendant + MC
  const asc = ascendant(t, lat, lng);
  const mcLon = midheaven(asc.ramc);
  const ascSignObj = SIGNS[signIdx(asc.lon)];
  const mcSignObj = SIGNS[signIdx(mcLon)];
  // Whole Sign houses (cung Asc = 1st house)
  const ascSignI = signIdx(asc.lon);
  const houses = [];
  const HOUSE_THEMES = [
    'Bản thân/ngoại hình', 'Tiền bạc/giá trị', 'Giao tiếp/anh em', 'Gia đình/cha mẹ',
    'Sáng tạo/con cái', 'Công việc/sức khỏe', 'Hôn nhân/đối tác', 'Cải biến/kế thừa',
    'Triết lý/du học', 'Sự nghiệp/danh vọng', 'Bạn bè/lý tưởng', 'Vô thức/yếu tiềm ẩn',
  ];
  for (let i = 0; i < 12; i++) {
    const s = SIGNS[(ascSignI + i) % 12];
    houses.push({ num: i + 1, signVi: s.vi, signSymbol: s.symbol, theme: HOUSE_THEMES[i] });
  }
  // Planet house (Whole Sign: house = (planet sign − asc sign) mod 12 + 1)
  for (const k of Object.keys(positions)) {
    positions[k].house = ((positions[k].signIdx - ascSignI + 12) % 12) + 1;
  }
  // Aspects
  const aspects = computeAspects(positions);
  // Element balance (cung của 10 hành tinh + Asc)
  const allPoints = [...Object.values(positions), { lon: asc.lon }];
  const elemCount = { Hỏa: 0, Thổ: 0, Khí: 0, Thủy: 0 };
  for (const p of [...Object.values(positions)]) elemCount[SIGNS[p.signIdx].element]++;
  // Sun/Moon/Rising "big three"
  return {
    input: { date: d.toISOString(), lat, lng, tz: +(lng / 15).toFixed(1) },
    sun: positions.Sun,
    moon: positions.Moon,
    mercury: positions.Mercury,
    venus: positions.Venus,
    mars: positions.Mars,
    jupiter: positions.Jupiter,
    saturn: positions.Saturn,
    uranus: positions.Uranus,
    neptune: positions.Neptune,
    pluto: positions.Pluto,
    ascendant: { lon: +asc.lon.toFixed(4), signVi: ascSignObj.vi, signSymbol: ascSignObj.symbol, degree: +(asc.lon % 30).toFixed(2) },
    midheaven: { lon: +mcLon.toFixed(4), signVi: mcSignObj.vi, degree: +(mcLon % 30).toFixed(2) },
    houses,
    aspects,
    elementBalance: elemCount,
    summary: {
      sunSign: positions.Sun.signVi,
      moonSign: positions.Moon.signVi,
      risingSign: ascSignObj.vi,
      mcSign: mcSignObj.vi,
      bigThree: `${positions.Sun.signVi} / ${positions.Moon.signVi} / ${ascSignObj.vi}`,
    },
  };
}

/**
 * Text tóm tắt ngắn cho AI brief (1 đoạn).
 */
export function westernSummary(chart) {
  if (!chart) return '';
  const c = chart;
  const lines = [];
  lines.push(`BẢN ĐỒ SAO PHƯƠNG TÂY (tropical): Mặt Trời ${c.sun.signVi} (${c.sun.degree}°), Mặt Trăng ${c.moon.signVi} (${c.moon.degree}°), Ascendant ${c.ascendant.signVi} (Rising ${c.ascendant.degree}°), MC ${c.midheaven.signVi}.`);
  lines.push(`Sao Thủy ${c.mercury.signVi}${c.mercury.retrograde?' ℞':''}, Sao Kim ${c.venus.signVi}, Sao Hỏa ${c.mars.signVi}${c.mars.retrograde?' ℞':''}, Sao Mộc ${c.jupiter.signVi}, Sao Thổ ${c.saturn.signVi}${c.saturn.retrograde?' ℞':''}.`);
  lines.push(`Ngoại hành tinh: Thiên Vương ${c.uranus.signVi}, Hải Vương ${c.neptune.signVi}, Diêm Vương ${c.pluto.signVi}.`);
  const majors = c.aspects.filter(a => /tam hợp|đối xung|vuông góc|lục hợp|hợp nhất/.test(a.aspect)).slice(0, 8);
  if (majors.length) lines.push(`Aspects nổi bật: ${majors.map(a => `${a.a} ${a.aspectVi} ${a.b}`).join(', ')}.`);
  lines.push(`Cân bằng nguyên tố (theo cung 10 hành tinh): Hỏa ${c.elementBalance.Hỏa}, Thổ ${c.elementBalance.Thổ}, Khí ${c.elementBalance.Khí}, Thủy ${c.elementBalance.Thủy}.`);
  return lines.join('\n');
}

// === UI: HTML card renderer (dùng KB interpretations) ===
import { SUN_IN_SIGN, MOON_IN_SIGN, ASCENDANT_MEANING, WESTERN_PLANETS } from './western-kb.js';

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/**
 * Render HTML card cho bản đồ sao phương Tây (dùng trong #western).
 */
export function renderWesternCard(chart) {
  if (!chart) return '<p class="hint">Không tính được bản đồ sao.</p>';
  const c = chart;
  const planetRow = (p) => `<tr><td>${esc(p.vi)}${p.retrograde ? ' <span style="color:#e8c870">℞</span>' : ''}</td><td>${esc(p.signSymbol)} ${esc(p.signVi)}</td><td>${esc(p.degree)}°</td><td style="color:#9a8040;font-size:.85em">cung ${p.house}</td></tr>`;
  const planetRows = [c.sun, c.moon, c.mercury, c.venus, c.mars, c.jupiter, c.saturn, c.uranus, c.neptune, c.pluto].map(planetRow).join('');
  const majorAspects = c.aspects.filter(a => /tam hợp|đối xung|vuông góc|hợp nhất|lục hợp/.test(a.aspect)).slice(0, 10);
  const aspectHtml = majorAspects.length
    ? majorAspects.map(a => `<span class="ln-rate ${a.tone.includes('cát') ? 'rate-cat' : a.tone.includes('căng') ? 'rate-bad' : 'rate-mid'}" style="margin:2px;display:inline-block">${esc(a.a)} ${esc(a.aspectVi)} ${esc(a.b)}</span>`).join(' ')
    : '<span class="hint">(không có aspect chính trong orb)</span>';
  const elemColor = { Hỏa: '#e85a3a', Thổ: '#c8954a', Khí: '#6abf8a', Thủy: '#4a8ad4' };
  const elemBars = Object.entries(c.elementBalance).map(([k, v]) => `<span style="display:inline-block;margin-right:10px;color:${elemColor[k] || '#999'}">${k} ${v}</span>`).join('');
  return `
    <div class="western-chart">
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <div style="flex:1;min-width:120px;background:rgba(212,175,55,0.08);padding:8px;border-radius:6px"><div class="hint-inline">☀ Mặt Trời (Sun)</div><b style="font-size:1.05em">${esc(c.sun.signSymbol)} ${esc(c.sun.signVi)}</b> <span class="hint-inline">${esc(c.sun.degree)}°</span></div>
        <div style="flex:1;min-width:120px;background:rgba(200,200,230,0.08);padding:8px;border-radius:6px"><div class="hint-inline">☾ Mặt Trăng (Moon)</div><b style="font-size:1.05em">${esc(c.moon.signSymbol)} ${esc(c.moon.signVi)}</b> <span class="hint-inline">${esc(c.moon.degree)}°</span></div>
        <div style="flex:1;min-width:120px;background:rgba(212,175,55,0.08);padding:8px;border-radius:6px"><div class="hint-inline">↑ Ascendant (Rising)</div><b style="font-size:1.05em">${esc(c.ascendant.signSymbol)} ${esc(c.ascendant.signVi)}</b> <span class="hint-inline">${esc(c.ascendant.degree)}°</span></div>
      </div>
      <details open><summary class="card-title" style="cursor:pointer;font-size:.95em">📖 Luận giải lá số phương Tây (natal reading)</summary>
        ${renderInterpretation(c)}</details>
      <details><summary class="card-title" style="cursor:pointer;font-size:.95em">🪐 10 hành tinh + cung chiếm đóng</summary>
        <table style="width:100%;font-size:.9em;margin-top:6px;border-collapse:collapse">${planetRows}</table></details>
      <details><summary class="card-title" style="cursor:pointer;font-size:.95em">⚡ Aspects (góc hành tinh)</summary>
        <div style="margin-top:6px">${aspectHtml}</div></details>
      <details><summary class="card-title" style="cursor:pointer;font-size:.95em">⚖ Cân bằng nguyên tố</summary>
        <div style="margin-top:6px">${elemBars}<div class="hint-inline" style="margin-top:4px">(Ngũ hành Bát Tự ≠ 4 nguyên tố Western — đối chiếu tham khảo)</div></div></details>
      <p class="hint-inline" style="margin-top:8px;display:block">📊 MC ${esc(c.midheaven.signVi)} · Big Three: <b>${esc(c.summary.bigThree)}</b> · Hỏa/th tuổi sinh ảo — <b>hỏi AI «đối chiếu Bát Tự vs phương Tây»</b> để luận sâu.</p>
      <p class="hint-inline" style="margin-top:4px;display:block;color:#7a6a40">⚠ Chiêm tinh phương Tây là hệ biểu tượng văn hóa, không có validate khoa học (như Bát Tự) — dùng tham khảo/đối chiếu.</p>
    </div>`;
}
