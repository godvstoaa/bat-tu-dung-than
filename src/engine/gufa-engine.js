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
  if (spec.nayinFireCount) return countWx(pillars, '火') >= spec.nayinFireCount;
  if (spec.nayinEarthCount) return countWx(pillars, '土') >= spec.nayinEarthCount;
  if (spec.nayinMocCount) return countWx(pillars, '木') >= spec.nayinMocCount;
  if (spec.nayinKimCount) return countWx(pillars, '金') >= spec.nayinKimCount;
  if (spec.ganSetAny) { const gans = pillars.map(p => p.gan); return spec.ganSetAny.some(set => set.every(g => gans.includes(g))); }
  if (spec.allSameWx) { const wxs = pillars.map(p => wxOf(p.nayin)).filter(Boolean); return wxs.length >= 2 && wxs.every(w => w === wxs[0]); }
  if (spec.branchAny) return spec.branchAny.some(b => pillars.some(p => p.zhi === b));
  if (spec.tuotiHuashen) {
    // 脱体化神/超凡入圣: PHAI cung hanh — 1 tru nhaps am 'yeu' + 1 tru 'manh' CUNG HANH
    const SETS = {
      '金': { base: ['甲子','乙丑','壬寅','癸卯','庚辰','辛巳','甲午','乙未'], trans: ['壬申','癸酉','庚戌','辛亥'] },
      '木': { base: ['壬子','癸丑','壬午','癸未','庚申','辛酉','戊戌','己亥'], trans: ['庚寅','辛卯','戊辰','己巳'] },
      '土': { base: ['庚子','辛丑','丙辰','丁巳','庚午','辛未','戊申','己酉'], trans: ['丙戌','丁亥','戊寅','己卯'] },
      '火': { base: ['丙寅','丁卯','甲辰','乙巳','丙申','丁酉','甲戌','乙亥'], trans: ['戊子','己丑','戊午','己未'] },
      '水': { base: ['丙子','丁丑','甲寅','乙卯','壬辰','癸巳','壬戌','癸亥'], trans: ['丙午','丁未'] },
    };
    const gzs = pillars.map(p => p.gz);
    return Object.values(SETS).some(s => gzs.some(g => s.base.includes(g)) && gzs.some(g => s.trans.includes(g)));
  }
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
  const upDown = wuxingUpDown(chart);
  const imb = wuxingImbalance(chart);
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
  if (upDown.doc) verdict += 'NGU HANH HUONG: ' + upDown.doc + ' ';
  if (imb.notes.length && imb.notes[0] && !imb.notes[0].includes('can bang')) verdict += 'THAI QUA/BAT CAP: ' + imb.notes.join(' ') + ' ';
  return { lantai: { cat, hung }, shenTouLu: stl, jiuming, nayinRelations: nayinRel, zunBei, wuxingUpDown: upDown, wuxingImbalance: imb, verdict, model: GUFA_MODEL.note };
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
    let rel = 'same', guqi = '比';
    if (WUXING_GEN[w] === yearWx) { rel = 'shengBy'; guqi = '禄(印/me)'; }       // sinh nien menh = Loc
    else if (WUXING_GEN[yearWx] === w) { rel = 'sheng'; guqi = '库(子)'; }        // nien menh sinh = Kho
    else if (isKe(yearWx, w)) { rel = 'ke'; guqi = '财'; }                        // nien menh khac = Tai
    else if (isKe(w, yearWx)) { rel = 'keBy'; guqi = '思(官/quỷ)'; }              // khac nien menh = Tu
    if (w === yearWx) { rel = 'same'; guqi = '比'; }
    rels.push({ pillar: p.pos, nayin: p.nayin, wx: w, rel, guqi });
  }
  return { yearMing: yearP.nayin + '(' + yearWx + ')', relations: rels };
}
function isKe(a, b) { const m = { '木':'土','土':'水','水':'火','火':'金','金':'木' }; return m[a] === b; }

// === 尊凶卑吉 (大運=ton, luu nien=by) — CO PHAP timing tu 珞琭子 ===

export function zunXiongBeiJi(R) {
  try {
    const dy = R?.dayun || [];
    if (!dy.length) return '';
    const age = new Date().getFullYear() - (R?.input?.year || R?.chart?.input?.year || 1990);
    let cur = dy[0];
    for (const d of dy) { if ((d.startAge || 0) <= age) cur = d; }
    const yong = R?.yong?.primary || '';
    if (!yong) return '';
    const dwx = [cur.ganWx, cur.zhiWx].filter(Boolean);
    if (!dwx.length) return '';
    const isDung = dwx.some(w => w === yong || WUXING_GEN[w] === yong);
    const isKy = dwx.some(w => isKe(w, yong));
    const gz = cur.ganZhi || (cur.gan||'')+(cur.zhi||'');
    if (isDung && !isKy) return `Đai van hien tai ${gz} (can/chi ${dwx.join('/')}) la DUNG (hop ${yong}) → 珞琭子「尊吉卑凶逢災自愈」: đai van tot giup tu lanh bat ke luu nien.`;
    if (isKy) return `Đai van hien tai ${gz} (can/chi ${dwx.join('/')}) khac DUNG (${yong}) = KY → 珞琭子「尊凶卑吉救療無功」: luu nien tot cung kho cuu, đe phong.`;
    return `Đai van hien tai ${gz} (${dwx.join('/')}) trung tinh voi dung ${yong}.`;
  } catch (_) { return ''; }
}


// === 五行上下生克 (五行精纪 卷9) — pillar DIRECTION sinh/khac (year=top→time=bottom) ===
export function wuxingUpDown(chart) {
  const c = chart?.chart ? chart.chart : chart;
  const pillars = pillarList(c);
  if (pillars.length < 2) return {};
  const order = ['year', 'month', 'day', 'time']; // top → bottom
  const byPos = {}; order.forEach(p => { const pl = pillars.find(x => x.pos === p); if (pl) byPos[p] = wxOf(pl.nayin); });
  const res = { zhuqi: 0, daoqi: 0, chenzhi: 0, weishi: 0, pairs: [] };
  for (let i = 0; i < order.length - 1; i++) {
    const up = byPos[order[i]], lo = byPos[order[i + 1]];
    if (!up || !lo || up === lo) continue;
    let kind = '';
    if (WUXING_GEN[lo] === up) { kind = '助气'; res.zhuqi++; }       // duoi sinh tren = tro khi (tot)
    else if (WUXING_GEN[up] === lo) { kind = '盗气'; res.daoqi++; }   // tren sinh duoi = dao khi (hao)
    else if (isKe(lo, up)) { kind = '下克上'; res.chenzhi++; }        // duoi khac tren = tram tri
    else if (isKe(up, lo)) { kind = '上克下'; res.weishi++; }         // tren khac duoi = uy the
    if (kind) res.pairs.push(`${order[i]}(${up})→${order[i+1]}(${lo}):${kind}`);
  }
  let doc = '';
  if (res.zhuqi > res.daoqi + res.weishi) doc = 'Duoi SINH tren nhieu (助气) → "nhat huong huong phuc, đeu duoc giup". ';
  if (res.daoqi >= 2) doc += 'Tren SINH duoi nhieu (盗气) → "lam cho nguoi khac, phu on nguoi". ';
  if (res.chenzhi >= 2) doc += 'Duoi KHAC tren nhieu → "tram tri kho phat". ';
  if (res.weishi >= 2) doc += 'Tren KHAC duoi nhieu (威势) → "uy quyen nhung bat loi vo/con". ';
  res.doc = doc || 'Trung hoa (sinh/khac huong can bang).';
  return res;
}

// === 五行太过不及 (五行精纪 卷9) — nhaps am hanh DEM, phat hien 1-vs-3 / 4-cung-hanh ===
export function wuxingImbalance(chart) {
  const c = chart?.chart ? chart.chart : chart;
  const pillars = pillarList(c);
  const cnt = {};
  for (const p of pillars) { const w = wxOf(p.nayin); if (w) cnt[w] = (cnt[w] || 0) + 1; }
  const entries = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const notes = [];
  // 4 cung hanh
  if (entries.length === 1) notes.push('4 tru CUNG 1 hanh (nhat khi) → cuc manh, can trung hoa.');
  // 1-vs-3: hanh A(1) sinh hanh B(3) → A hut can (枯槁)
  for (const [a, ca] of entries) {
    if (ca !== 1) continue;
    for (const [b, cb] of entries) {
      if (cb >= 3 && WUXING_GEN[a] === b) notes.push(`1 ${a} sinh 3 ${b} → "${a} hut can/kho co" (qua tai, ton ${a}).`);
      if (cb >= 3 && WUXING_GEN[b] === a) notes.push(`3 ${b} sinh 1 ${a} → "${a} phuc thinh" (đuoc nuoi day).`);
      if (cb >= 3 && isKe(a, b)) notes.push(`1 ${a} khac 3 ${b} → "nho lot lon, tu tao hoa" (bat tuong).`);
    }
  }
  return { counts: cnt, notes: notes.length ? notes : ['Ngu hanh nhaps am phan bo tuong doi can bang, khong thai qua/bat cap.'] };
}
