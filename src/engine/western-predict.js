// ============================================================================
//  WESTERN PREDICTIVE ASTROLOGY — dự báo tương lai (timing)
//  Đối ứng phần «dự báo» của Bát Tự (Đại vận/Lưu niên) bằng phương pháp Western:
//  Annual Profections + Transits (Saturn/Jupiter/outer) + Returns + Progressions + Solar Return.
//
//  Tất cả tính từ planetLongitude(name, date) (astronomy-engine) — re-use western-astro.
//  KHÔNG có validate khoa học — hệ biểu tượng timing, tham khảo/đối chiếu.
//
//  Mapping (theo docs/FUTURE-PREDICTION-RESEARCH.md):
//    大运 10-năm  ↔ Zodiacal Releasing L1 (chapter) — ở đây dùng Profection chu kỳ 12 + Saturn transit
//    流年 annual  ↔ Annual Profection (ruler of year) + Solar Return + Jupiter transit
//    太岁         ↔ Saturn transit (chức năng) / Jupiter (tên «Grand Duke Jupiter»)
//    黄金年       ↔ Jupiter return (~12 năm)
//    流月/流日    ↔ Moon transit (~2.5 ngày/cung)
//    起运         ↔ (BaZi độc quyền — no Western)
// ============================================================================
import { planetLongitude, SIGNS } from './western-astro.js';
import { WESTERN_HOUSES } from './western-kb.js';

const norm360 = (x) => ((x % 360) + 360) % 360;
const aspectDiff = (a, b) => { let d = Math.abs(a - b); if (d > 180) d = 360 - d; return d; };

const OUTER_PLANETS = [
  { key: 'Jupiter', vi: 'Sao Mộc', cycleYears: 11.86, nature: 'cát (mở rộng, may mắn)' },
  { key: 'Saturn',  vi: 'Sao Thổ', cycleYears: 29.46, nature: 'nặng (kỷ luật, thử thách, kết cấu)' },
  { key: 'Uranus',  vi: 'Sao Thiên Vương', cycleYears: 84.0, nature: 'đột biến (cải cách, phá vỡ)' },
  { key: 'Neptune', vi: 'Sao Hải Vương', cycleYears: 164.8, nature: 'mơ mộng (tâm linh, ảo tưởng)' },
  { key: 'Pluto',   vi: 'Sao Diêm Vương', cycleYears: 247.9, nature: 'cải biến (sinh tử, quyền lực)' },
];

const MAJOR_ASPECTS = [
  { name: 'Conjunction', vi: 'hợp', angle: 0, orb: 2.5, tone: 'cat' },
  { name: 'Opposition', vi: 'đối', angle: 180, orb: 2.5, tone: 'hung' },
  { name: 'Square', vi: 'vuông', angle: 90, orb: 2.0, tone: 'hung' },
  { name: 'Trine', vi: 'tam hợp', angle: 120, orb: 2.5, tone: 'cat' },
  { name: 'Sextile', vi: 'lục hợp', angle: 60, orb: 1.5, tone: 'cat' },
];

/**
 * Annual Profection — mỗi tuổi dịch 1 cung từ Ascendant (Whole Sign).
 * Cung profection năm đó = (AscSignIdx + age) mod 12. Ruler of year = ruler cung đó.
 * Tương ứng Lưu Niên BaZi (chủ đề năm).
 */
export function annualProfection(natalAscSignIdx, age) {
  const idx = ((natalAscSignIdx % 12) + 12) % 12;
  const profIdx = (idx + (((age % 12) + 12) % 12)) % 12;
  const sign = SIGNS[profIdx];
  const house = WESTERN_HOUSES[(age % 12 + 12) % 12];
  return {
    age,
    profectionSignIdx: profIdx,
    profectionSignVi: sign.vi,
    profectionHouseNum: ((age % 12) + 12) % 12 + 1,
    rulerOfYear: sign.ruler,
    element: sign.element,
    theme: house ? house.theme : '',
    note: `Profection năm ${age}: cung ${house ? house.num : '?'} (${sign.vi}) — ${house ? house.theme : ''}. Sao chủ năm = ${sign.ruler}.`,
  };
}

/**
 * Trạng thái transit của các ngoại hành tinh tới các điểm gốc quan trọng
 * (Sun/Moon/Asc/MC + natal position của chính hành tinh đó = return) tại một ngày cho trước.
 */
export function transitsAtDate(natalPoints, date) {
  // natalPoints: { Sun:{lon}, Moon:{lon}, Asc:{lon}, MC:{lon}, Jupiter:{lon}, Saturn:{lon}, ... }
  const targets = [];
  for (const [k, v] of Object.entries(natalPoints)) {
    if (v && typeof v.lon === 'number') targets.push({ key: k, lon: v.lon });
  }
  const hits = [];
  for (const p of OUTER_PLANETS) {
    let pl;
    try { pl = planetLongitude(p.key, date); } catch (_) { continue; }
    // return: transit planet === natal position of SAME planet
    const natalSame = natalPoints[p.key];
    if (natalSame && typeof natalSame.lon === 'number') {
      const d = aspectDiff(pl, natalSame.lon);
      if (d < 3) hits.push({ planet: p.key, planetVi: p.vi, type: `${p.vi} return`, aspect: 'Conjunction', to: '(natal ' + p.vi + ')', tone: p.key === 'Jupiter' ? 'cat' : 'neutral', orb: +d.toFixed(1), nature: p.nature });
    }
    // aspects to other natal points
    for (const t of targets) {
      if (t.key === p.key) continue;
      const d = aspectDiff(pl, t.lon);
      for (const asp of MAJOR_ASPECTS) {
        const diff = Math.abs(d - asp.angle);
        if (diff <= asp.orb) {
          hits.push({ planet: p.key, planetVi: p.vi, type: `${p.vi} ${asp.vi} ${t.key}`, aspect: asp.name, to: t.key, tone: asp.tone, orb: +diff.toFixed(1), nature: p.nature });
          break;
        }
      }
    }
  }
  return hits;
}

/**
 * Tìm Jupiter/Saturn return year (năm mà hành tinh quay lại vị trí sinh).
 * Jupiter ~12 năm, Saturn ~29.5 năm.
 */
export function findReturnYears(natalPositions, birthDate, fromAge, toAge) {
  const out = [];
  for (const p of [{ key: 'Jupiter', vi: 'Sao Mộc', nature: 'mở rộng/may mắn' }, { key: 'Saturn', vi: 'Sao Thổ', nature: 'kỷ luật/thử thách/kết cấu' }]) {
    const natalLon = natalPositions[p.key]?.lon;
    if (typeof natalLon !== 'number') continue;
    for (let age = Math.max(fromAge, 1); age <= toAge; age++) {
      const d = new Date(birthDate.getTime() + age * 365.25 * 86400000);
      let pl; try { pl = planetLongitude(p.key, d); } catch (_) { continue; }
      const diff = aspectDiff(pl, natalLon);
      if (diff < 4) out.push({ age, year: d.getUTCFullYear(), planet: p.key, planetVi: p.vi, orb: +diff.toFixed(1), nature: p.nature, note: `${p.vi} return @${age}t — chu kỳ ${p.key === 'Jupiter' ? '~12 năm' : '~29.5 năm'}: ${p.nature}.` });
    }
  }
  // Giữ 1 hit gần nhất mỗi (planet, return-event) — tránh trùng
  return out.filter((h, i, a) => a.findIndex(x => x.planet === h.planet && x.age === h.age) === i);
}

/**
 * Secondary Progressions — 1 ngày sau sinh = 1 năm đời. Progressed Sun/Moon/Mercury/Venus.
 */
export function progressions(birthDate, age) {
  const progDate = new Date(birthDate.getTime() + age * 86400000);
  const out = { age, progDate: progDate.toISOString() };
  for (const k of ['Sun', 'Moon', 'Mercury', 'Venus']) {
    try { out[k] = planetLongitude(k, progDate); } catch (_) {}
  }
  return out;
}

/**
 * Solar Return — ngày Mặt Trời quay lại vị trí sinh (gần sinh nhật). Bisection.
 * Trả Date gần nhất (trong khoảng ±6 tháng từ birthday năm đó).
 */
export function solarReturnDate(natalSunLon, birthDate, age) {
  const approx = new Date(Date.UTC(birthDate.getUTCFullYear() + age, birthDate.getUTCMonth(), birthDate.getUTCDate()));
  let lo = new Date(approx.getTime() - 200 * 86400000);
  let hi = new Date(approx.getTime() + 200 * 86400000);
  for (let i = 0; i < 40; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    const lonLo = planetLongitude('Sun', lo);
    const lonMid = planetLongitude('Sun', mid);
    // khoảng cách đi qua natalSunLon
    const before = Math.sign(((lonLo - natalSunLon + 540) % 360) - 180);
    const at = Math.sign(((lonMid - natalSunLon + 540) % 360) - 180);
    if (before !== at) hi = mid; else lo = mid;
  }
  return new Date((lo.getTime() + hi.getTime()) / 2);
}

/**
 * MASTER: dự báo Western cho N năm tới (từ currentYear).
 * @param natal — computeWesternChart result (có positions + ascendant + midheaven + summary)
 * @param birthDate — Date UT
 * @param currentYear — năm hiện tại
 * @param spanYears — số năm dự báo (default 10)
 */
export function computeWesternForecast(natal, birthDate, currentYear, spanYears = 10) {
  const birthYearUT = birthDate.getUTCFullYear();
  const ageNow = currentYear - birthYearUT;
  const natalPoints = {
    Sun: natal.sun, Moon: natal.moon, Asc: natal.ascendant, MC: natal.midheaven,
    Jupiter: natal.jupiter, Saturn: natal.saturn, Uranus: natal.uranus, Neptune: natal.neptune, Pluto: natal.pluto,
  };
  // Lấy AscSignIdx từ natal
  const ascSignIdx = SIGNS.findIndex(s => s.vi === natal.ascendant.signVi);
  const years = [];
  for (let i = 0; i < spanYears; i++) {
    const year = currentYear + i;
    const age = ageNow + i;
    // Ngày đại diện: sinh nhật năm đó (Sun trở lại vị trí sinh ~ ổn định cho transits năm)
    const repDate = solarReturnDate(natal.sun.lon, birthDate, age);
    const transits = transitsAtDate(natalPoints, repDate);
    const prof = annualProfection(ascSignIdx < 0 ? 0 : ascSignIdx, age);
    // tone năm: đếm cat/hung từ transits
    const catN = transits.filter(t => t.tone === 'cat').length;
    const hungN = transits.filter(t => t.tone === 'hung').length;
    const returnsThisYear = transits.filter(t => /return/.test(t.type));
    const tone = returnsThisYear.some(r => r.planet === 'Saturn') || hungN >= 2 ? 'hung'
      : catN >= 2 || returnsThisYear.some(r => r.planet === 'Jupiter') ? 'cat'
      : 'trung';
    years.push({
      year, age,
      profection: { signVi: prof.profectionSignVi, ruler: prof.rulerOfYear, house: prof.profectionHouseNum, theme: prof.theme },
      topTransits: transits.filter(t => /Conjunction|Opposition|Square|Trine/.test(t.aspect) || /return/.test(t.type)).slice(0, 4),
      returns: returnsThisYear,
      tone, catCount: catN, hungCount: hungN,
    });
  }
  // Returns đặc biệt (Jupiter ~12t, Saturn ~29.5t) — báo trong khoảng span
  const returns = findReturnYears(natalPoints, birthDate, ageNow, ageNow + spanYears);
  return {
    input: { birthYearUT, currentYear, spanYears, ageNow },
    years,
    notableReturns: returns,
    profectionNote: 'Annual Profection: mỗi tuổi dịch 1 cung (Whole Sign) từ Ascendant — sao chủ cung đó = «ruler of year», kích hoạt chủ đề cung đó cả năm (≈ Lưu Niên BaZi).',
    transitNote: 'Transits: vị trí THẬT của ngoại hành tinh (Saturn/Jupiter/Uranus/Neptune/Pluto) trên trời năm đó đi qua điểm gốc của bạn (Sun/Moon/Asc/MC/natal planet) → tác động thực tế.',
    returnNote: 'Jupiter return ~12 năm (mở rộng), Saturn return ~29.5 năm (kỷ luật/kết cấu lại đời) — cột mốc tuổi.',
    caveat: 'Cả Western prediction LẪN Bát Tự đều KHÔNG có validate khoa học — hệ biểu tượng timing, tham khảo.',
  };
}

/**
 * Text tóm tắt cho AI brief / tool.
 */
export function forecastSummary(forecast) {
  if (!forecast || !forecast.years?.length) return '';
  const lines = [`WESTERN FORECAST (${forecast.input.currentYear}+${forecast.input.spanYears} năm):`];
  for (const y of forecast.years) {
    const tone = y.tone === 'cat' ? 'CÁT' : y.tone === 'hung' ? 'HUNG' : 'TRUNG';
    const prof = `Profection ${y.profection.signVi} (cung ${y.profection.house}, ruler ${y.profection.ruler})`;
    const tr = y.topTransits.map(t => t.type).join(', ') || '(không transit lớn)';
    const ret = y.returns.length ? ` · ${y.returns.map(r => r.type).join(', ')}` : '';
    lines.push(`  ${y.year} (${y.age}t) ${tone}: ${prof}. Transit: ${tr}${ret}`);
  }
  if (forecast.notableReturns?.length) lines.push(`  Cột mốc return: ${forecast.notableReturns.map(r => `${r.planetVi}@${r.age}t`).join(', ')}`);
  return lines.join('\n');
}
