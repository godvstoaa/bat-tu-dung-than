// Unified post-parse validation + dedup for a *_clean.json:
//  1. cross-layer name-dup (vs full LIBRARY, char-form-sensitive)
//  2. intra-batch name-han collision (enrich commentary with author)
//  3. DZ#-dedup vs existing corpus (catches trad/simpl & variant dups — STRONGEST signal)
// Overwrites the <clean>.json in place with the survivors. Usage:
//   node scripts/daozang-validate.mjs docs/_fragments/grok-batchN-clean.json
import { LIBRARY } from '../src/engine/library-data.js';
import { readFileSync, writeFileSync } from 'node:fs';

const cleanPath = process.argv[2];
if (!cleanPath) { console.error('usage: daozang-validate.mjs <clean.json>'); process.exit(1); }
let arr = JSON.parse(readFileSync(cleanPath, 'utf8'));

// trad→simpl normalization for name-dup (Daoist titles leak trad/simpl dups).
// Focused map of high-frequency variant chars in 道藏/藏外 titles.
const T2S = { '經':'经','書':'书','寶':'宝','寳':'宝','萬':'万','顯':'显','鑑':'鉴','鉴':'鉴','顯':'显','華':'华','冊':'册','圖':'图','錄':'录','紀':'纪','歷':'历','濟':'济','靈':'灵','煉':'炼','師':'师','歡':'欢','醫':'医','學':'学','網':'网','籤':'签','應':'应','準':'准','開':'开','間':'间','會':'会','業':'业','報':'报','實':'实','廣':'广','聖':'圣','真':true,'傳':'传','記':'记','義':'义','解':true,'註':'注','訣':'诀','祕':'秘','機':'机','體':'体','總':'总','薦':'荐','壇':'坛','壽':'寿','園':'园','龍':'龙','虎':true,'神':true,'仙':true,'陽':'阳','陰':'阴','氣':'气','韻':'韵','聲':'声','樂':'乐','藥':'药','術':'术','數':'数','占':true,'蔔':'卜','運':'运','動':'动','靜':'静','觀':'观','覺':'觉','論':'论','語':'语','話':'话','讀':'读','講':'讲','試':'试','詩':'诗','詞':'词','賦':'赋','頌':'颂','銘':'铭','箴':'箴','誥':'诰','呪':'咒','咒':true,'曜':'曜','緯':'纬','織':'织','綱':'纲','網':'网','綸':'纶','經':true };
function normName(s) {
  return String(s || '').replace(/[（(].*$/, '').split('').map(c => T2S[c] && T2S[c] !== true ? T2S[c] : c).join('');
}

// existing DZ# set from source
const src = readFileSync('src/engine/daozang-data.js', 'utf8');
const closeIdx = src.lastIndexOf(']', src.indexOf('.map(', src.indexOf('DAOZANG_RAW')));
const rawSection = src.slice(0, closeIdx);
const existingDz = new Set();
for (const m of rawSection.matchAll(/dz:\s*['"]?(DZ0*\d+)/gi)) existingDz.add('DZ' + parseInt(m[1].replace(/^DZ/i, '')));

const libNames = new Set(LIBRARY.map((e) => normName(e.name_han)));

// intra-batch collision: enrich with author surname (use normalized for grouping too)
const cnt = {}; for (const e of arr) { const k = normName(e.name_han); cnt[k] = (cnt[k] || 0) + 1; }

const kept = [];
const dropped = [];
for (const e of arr) {
  const name = normName(e.name_han);
  const reason = [];
  if (libNames.has(name)) reason.push('name-dup(LIBRARY)');
  // DZ# dedup
  const dm = (e.dz || '').match(/DZ0*(\d+)/i);
  if (dm && existingDz.has('DZ' + parseInt(dm[1]))) reason.push('DZ#-dup');
  if (reason.length) { dropped.push(`${reason.join('+')}: ${e.dz || '-'} ${e.name_han}`); continue; }
  // enrich intra-batch collision (by normalized name)
  if (cnt[name] > 1 && e.author) e.name_han = e.name_han + '（' + e.author.split('（')[0].trim() + '）';
  kept.push(e);
}
writeFileSync(cleanPath, JSON.stringify(kept, null, 1));
console.log(`valid: in=${arr.length} kept=${kept.length} dropped=${dropped.length}`);
for (const d of dropped) console.log('  drop', d);
if (kept.length) console.log('  keep:', kept.map((e) => e.name_han).join(' · '));
