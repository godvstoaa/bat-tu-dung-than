// Process translation batches → add full_vn to daozang-deep.js entries
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const FRAG = 'docs/_fragments';
const DEEP_FILE = 'src/engine/daozang-deep.js';
let deepSrc = readFileSync(DEEP_FILE, 'utf8');

const batchFiles = readdirSync(FRAG).filter(f => /^_trans-b\d+\.json$/.test(f));
console.log(`Found ${batchFiles.length} translation batch files`);

let added = 0;
for (const file of batchFiles) {
  try {
    const env = JSON.parse(readFileSync(`${FRAG}/${file}`, 'utf8'));
    let entries = env.structuredOutput?.entries;
    if (!entries) {
      try { entries = JSON.parse(env.text).entries; }
      catch (e) { const o = JSON.parse(env.text.slice(env.text.indexOf('{'), env.text.lastIndexOf('}') + 1)); entries = o.entries; }
    }
    for (const e of entries) {
      if (!e.full_vn || e.full_vn.length < 100) continue;
      const key = e.name_han.replace(/['\\]/g, '').replace(/（.*）/, '').slice(0, 20);
      const fv = e.full_vn.replace(/'/g, "\\'").replace(/\n/g, ' ');
      const keyPattern = `'${key}': {`;
      const keyPos = deepSrc.indexOf(keyPattern);
      if (keyPos > 0) {
        const entryEnd = deepSrc.indexOf('},', keyPos);
        if (entryEnd > 0 && !deepSrc.slice(keyPos, entryEnd).includes('full_vn')) {
          deepSrc = deepSrc.slice(0, entryEnd) + `, full_vn: '${fv}'` + deepSrc.slice(entryEnd);
          added++;
        }
      } else {
        const entry = `  '${key}': { full_vn: '${fv}' },\n`;
        const insertPos = deepSrc.indexOf('\n};', deepSrc.indexOf('DAOZANG_DEEP'));
        if (insertPos > 0) { deepSrc = deepSrc.slice(0, insertPos) + '\n' + entry + deepSrc.slice(insertPos); added++; }
      }
    }
  } catch (e) { console.log(`  skip ${file}: ${e.message.slice(0, 60)}`); }
}

writeFileSync(DEEP_FILE, deepSrc, 'utf8');
console.log(`Added full_vn to ${added} entries`);
