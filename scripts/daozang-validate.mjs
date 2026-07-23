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

// existing DZ# set from source
const src = readFileSync('src/engine/daozang-data.js', 'utf8');
const closeIdx = src.lastIndexOf(']', src.indexOf('.map(', src.indexOf('DAOZANG_RAW')));
const rawSection = src.slice(0, closeIdx);
const existingDz = new Set();
for (const m of rawSection.matchAll(/dz:\s*['"]?(DZ0*\d+)/gi)) existingDz.add('DZ' + parseInt(m[1].replace(/^DZ/i, '')));

const libNames = new Set(LIBRARY.map((e) => (e.name_han || '').replace(/[（(].*$/, '')));

// intra-batch collision: enrich with author surname
const cnt = {}; for (const e of arr) cnt[e.name_han] = (cnt[e.name_han] || 0) + 1;

const kept = [];
const dropped = [];
for (const e of arr) {
  const name = (e.name_han || '').replace(/[（(].*$/, '');
  const reason = [];
  if (libNames.has(name)) reason.push('name-dup(LIBRARY)');
  // DZ# dedup
  const dm = (e.dz || '').match(/DZ0*(\d+)/i);
  if (dm && existingDz.has('DZ' + parseInt(dm[1]))) reason.push('DZ#-dup');
  if (reason.length) { dropped.push(`${reason.join('+')}: ${e.dz || '-'} ${e.name_han}`); continue; }
  // enrich intra-batch collision
  if (cnt[e.name_han] > 1 && e.author) e.name_han = e.name_han + '（' + e.author.split('（')[0].trim() + '）';
  kept.push(e);
}
writeFileSync(cleanPath, JSON.stringify(kept, null, 1));
console.log(`valid: in=${arr.length} kept=${kept.length} dropped=${dropped.length}`);
for (const d of dropped) console.log('  drop', d);
if (kept.length) console.log('  keep:', kept.map((e) => e.name_han).join(' · '));
