// gufa-engine.js — CO PHAP (古法) DEEP-LOGIC engine: phat hien cach cuc nhaps am (兰台妙选)
// + than đau loc + cuu menh trên LA SO THUC. Day la LOGIC TINH TOAN, khong chi tra cuu.
// Nguon: 珞琭子赋注 / 李虚中命书 / 兰台妙选 (Round 27-31 kb.js).
import { LANTAI_PATTERNS, SHENTOU_LU_NAYIN, GUFA_MODEL, JIUMING_SYSTEM } from './kb.js';

// trad → simp cho cac chu nhaps am (xu ly 2 dang chart)
const T2S = { '劍':'剑','鋒':'锋','燈':'灯','楊':'杨','頭':'头','蠟':'蜡','釵':'钗','釧':'钏','霹':'霹','靂':'雳','澗':'涧','長':'长','寶':'宝','馬':'马','龍':'龙','駒':'驹','鳳':'凤','闕':'阙','靈':'灵','淵':'渊','躍':'跃','門':'门','鑛':'矿','鑛':'矿','釱':'','鍾':'钟','鎮':'镇' };
const norm = (s) => (s || '').split('').map(c => T2S[c] || c).join('');
const WUXING_GEN = { '木':'火','火':'土','土':'金','金':'水','水':'木' }; // sinh
const WUXING_MOTHER = { '火':'木','土':'火','金':'土','水':'金','木':'水' }; // me (sinh ra X)
const SEASON = { spring:['寅','卯','辰'], summer:['巳','午','未'], autumn:['申','酉','戌'], winter:['亥','子','丑'] };

function pillarList(c) {
  const out = [];
  for (const pos of ['year', 'month', 'day', 'time']) {
    const p = c?.pillars?.[pos];
    if (p) out.push({ pos, gan: p.gan || '', zhi: p.zhi || '', gz: (p.gan || '') + (p.zhi || ''), nayin: norm(p.nayin || '') });
  }
  return out;
}
function wxOf(nayin) { // lay hanh tu ten nhaps am (kitu cuoi)
  const n = norm(nayin);
  for (const w of ['金','木','水','火','土']) if (n.endsWith(w)) return w;
  return '';
}
function countWx(pillars, w) { return pillars.filter(p => wxOf(p.nayin) === w).length; }

// interpret 1 dieu kien detect
function matchDetect(pillars, monthZhi, spec) {
  if (!spec) return true;
  if (spec.and) return spec.and.every(s => matchDetect(pillars, monthZhi, s));
  if (spec.nayin) return pillars.some(p => p.nayin.includes(norm(spec.nayin)));
  if (spec.nayinAny) return pillars.some(p => spec.nayinAny.some(f => p.nayin.includes(norm(f))));
  if (spec.ganzhi) return pillars.some(p => p.gz === spec.ganzhi);
  if (spec.ganzhiAny) return pillars.some(p => spec.ganzhiAny.includes(p.gz));
  if (spec.branch) return pillars.some(p => p.zhi === spec.branch);
  if (spec.branchesAll || spec.branches) { const b = spec.branchesAll || spec.branches; return b.every(x => pillars.some(p => p.zhi === x)); }
  if (spec.gan) return pillars.some(p => p.gan === spec.gan);
  if (spec.ganAny) return pillars.some(p => spec.ganAny.includes(p.gan));
  if (spec.month) return (SEASON[spec.month] || []).includes(monthZhi);
  if (spec.hasHuo) return countWx(pillars, '火') >= 1;
  if (spec.hasMoc) return countWx(pillars, '木') >= 1;
  if (spec.hasKim) return countWx(pillars, '金') >= 1;
  if (spec.hasThuy) return countWx(pillars, '水') >= 1;
  if (spec.hasTho) return countWx(pillars, '土') >= 1;
  if (spec.nayinWaterCount) return countWx(pillars, '水') >= spec.nayinWaterCount;
  if (spec.motherGenerates) {
    const dayWx = wxOf(c_dayNayin(pillars));
    if (!dayWx) return false;
    const mother = WUXING_MOTHER[dayWx];
    return pillars.some(p => wxOf(p.nayin) === mother);
  }
  return false;
}
let _dayNayinCache;
function c_dayNayin(pillars) { return pillars.find(p => p.pos === 'day')?.nayin || ''; }

// === PUBLIC: detect 兰台 patterns on a chart ===
export function detectLantai(chart) {
  const c = chart?.chart ? chart.chart : chart; // chap nhan R hoac c
  const pillars = pillarList(c);
  const monthZhi = c?.pillars?.month?.zhi || '';
  const matched = [];
  for (const pat of LANTAI_PATTERNS) {
    try {
      if (matchDetect(pillars, monthZhi, pat.detect)) matched.push({ id: pat.id, name: pat.name, vi: pat.vi, cat: pat.cat, judgment: pat.judgment });
    } catch (_) {}
  }
  return matched;
}

// === PUBLIC: than đau loc theo nhat tru (+ nien tru cho co phap) ===
export function shenTouLu(chart) {
  const c = chart?.chart ? chart.chart : chart;
  const out = {};
  for (const pos of ['year', 'day']) {
    const gz = (c?.pillars?.[pos]?.gan || '') + (c?.pillars?.[pos]?.zhi || '');
    if (SHENTOU_LU_NAYIN.examples[gz]) out[pos] = { ganzhi: gz, reading: SHENTOU_LU_NAYIN.examples[gz] };
  }
  return out;
}

// === PUBLIC: cuu menh (3 nguyen + 4 tru + loc ma) tong quat ===
export function assessJiuming(chart) {
  const c = chart?.chart ? chart.chart : chart;
  const pillars = pillarList(c);
  const wxCounts = {};
  for (const p of pillars) { const w = wxOf(p.nayin); if (w) wxCounts[w] = (wxCounts[w] || 0) + 1; }
  const dominant = Object.entries(wxCounts).sort((a, b) => b[1] - a[1])[0];
  const dayWx = wxOf(c_dayNayin(pillars));
  return {
    nayinWx: wxCounts,
    dominantNayinWx: dominant ? `${dominant[0]} (${dominant[1]}/4 tru)` : '?',
    dayNayinWx: dayWx || '?',
    note: '九命 = 3 nguyên (thien/đia/nhan = can/chi/nhaps-am) + 4 tru (thai/nguyet/nhat/thoi) + loc + ma. Day la tong quat nhaps-am hanh.',
  };
}

// === PUBLIC: assessGufa — tong hop CO PHAP phan doan (DEEP LOGIC) ===
export function assessGufa(R) {
  const chart = R?.chart || R;
  const lantai = detectLantai(chart);
  const stl = shenTouLu(chart);
  const jiuming = assessJiuming(chart);
  const nayinRel = nayinRelations(chart);
  const zunBei = zunXiongBeiJi(R);
  const cat = lantai.filter(p => p.cat === 'cat');
  const hung = lantai.filter(p => p.cat === 'hung');
  let verdict = 'CO PHAP (古法 nhaps am): ';
  if (cat.length >= 2) verdict += `Lá số đap ${cat.length} cac cuc nhaps am CAT (vd ${cat.slice(0,2).map(p=>p.vi).join(', ')}) → co dang quy/dai phu theo co phap. `;
  else if (cat.length === 1) verdict += `1 cach cuc nhaps am cat (${cat[0].vi}). `;
  else verdict += 'Khong gap cach cuc nhaps am cat đac biet. ';
  if (hung.length) verdict += `CAN THAN: ${hung.length} cach cuc HUNG (${hung.map(p=>p.vi).join(', ')}) → đe phong. `;
  if (nayinRel.yearMing) {
    const sup = (nayinRel.relations||[]).filter(r => r.rel === 'shengBy').length;
    const atk = (nayinRel.relations||[]).filter(r => r.rel === 'keBy').length;
    verdict += `Nien menh nhaps am (${nayinRel.yearMing}) ${sup?'DUOC '+sup+' tru sinh (đuoc giup)':'khong đuoc sinh'}${atk?', bi '+atk+' tru khac (bi che)':''}. `;
  }
  if (zunBei) verdict += zunBei + ' ';
  return { lantai: { cat, hung }, shenTouLu: stl, jiuming, nayinRelations: nayinRel, zunBei, verdict, model: GUFA_MODEL.note };
}

// === nhaps am sinhk giua cac tru (CO PHAP doc nien-menh nhaps am vs cac tru) ===
export function nayinRelations(chart) {
  const c = chart?.chart ? chart.chart : chart;
  const pillars = pillarList(c);
  const yearP = pillars.find(p => p.pos === 'year');
  if (!yearP || !yearP.nayin) return {};
  const yearWx = wxOf(yearP.nayin);
  if (!yearWx) return {};
  const rels = [];
  for (const p of pillars) {
    if (p.pos === 'year') continue;
    const w = wxOf(p.nayin); if (!w) continue;
    let rel = 'same';
    if (WUXING_GEN[w] === yearWx) rel = 'shengBy';
    else if (WUXING_GEN[yearWx] === w) rel = 'sheng';
    else if (isKe(w, yearWx)) rel = 'keBy';
    else if (isKe(yearWx, w)) rel = 'ke';
    if (w === yearWx) rel = 'same';
    rels.push({ pillar: p.pos, nayin: p.nayin, wx: w, rel });
  }
  return { yearMing: yearP.nayin + '(' + yearWx + ')', relations: rels };
}
function isKe(a, b) { const m = { '木':'土','土':'水','水':'火','火':'金','金':'木' }; return m[a] === b; }

// === 尊凶卑吉 (大運=ton, luu nien=by) — CO PHAP timing tu 珞琭子 ===
export function zunXiongBeiJi(R) {
  try {
    const dayun = (R?.dayun || []).find(d => d.isCurrent) || (R?.dayun || [])[0];
    if (!dayun) return '';
    const dung = dayun.yong === 'yong' || dayun.favor === true || dayun.useful === true;
    const ky = dayun.yong === 'ji' || dayun.unfavor === true;
    if (dung) return 'Đai van hien tai = DUNG (ton CAT) → 珞琭子「尊吉卑凶，逢災自愈»: đai van tot giup tu lanh bat ke luu nien.';
    if (ky) return 'Đai van hien tai = KY (ton HUNG) → 珞琭子「尊凶卑吉，救療無功»: luu nien tot cung kho cuu, đe phong.';
    return '';
  } catch (_) { return ''; }
}

