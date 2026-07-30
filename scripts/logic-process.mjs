// Process logic batch results → merge logic fields into daozang-deep.js entries
// Usage: node scripts/logic-process.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const FRAG = 'docs/_fragments';
const DEEP_FILE = 'src/engine/daozang-deep.js';

let deepSrc = readFileSync(DEEP_FILE, 'utf8');

const batchFiles = readdirSync(FRAG).filter(f => /^_logic-b\d+\.json$/.test(f));
console.log(`Found ${batchFiles.length} logic batch files`);

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
      if (!e.logic_thesis || e.logic_thesis.length < 30) continue;
      const key = e.name_han.replace(/['\\]/g, '').replace(/（.*）/, '').slice(0, 20);
      // Check if this key already exists in DAOZANG_DEEP
      const keyPattern = `'${key}': {`;
      const keyPos = deepSrc.indexOf(keyPattern);
      if (keyPos > 0) {
        // Entry exists — add logic fields
        const entryEnd = deepSrc.indexOf('},', keyPos);
        if (entryEnd > 0) {
          const logicAdd = `, logic_thesis: '${(e.logic_thesis||'').replace(/'/g,"\\'").replace(/\n/g,' ')}', logic_chain: '${(e.logic_chain||'').replace(/'/g,"\\'").replace(/\n/g,' ')}', logic_practice: '${(e.logic_practice||'').replace(/'/g,"\\'").replace(/\n/g,' ')}', logic_compare: '${(e.logic_compare||'').replace(/'/g,"\\'").replace(/\n/g,' ')}'`;
          // Check if logic already added
          if (!deepSrc.slice(keyPos, entryEnd).includes('logic_thesis')) {
            deepSrc = deepSrc.slice(0, entryEnd) + logicAdd + deepSrc.slice(entryEnd);
            added++;
          }
        }
      } else {
        // New entry — create with logic fields only
        const lt = (e.logic_thesis||'').replace(/'/g,"\\'").replace(/\n/g,' ');
        const lc = (e.logic_chain||'').replace(/'/g,"\\'").replace(/\n/g,' ');
        const lp = (e.logic_practice||'').replace(/'/g,"\\'").replace(/\n/g,' ');
        const lcmp = (e.logic_compare||'').replace(/'/g,"\\'").replace(/\n/g,' ');
        const entry = `  '${key}': { logic_thesis: '${lt}', logic_chain: '${lc}', logic_practice: '${lp}', logic_compare: '${lcmp}' },\n`;
        const insertPos = deepSrc.indexOf('\n};', deepSrc.indexOf('DAOZANG_DEEP'));
        if (insertPos > 0) {
          deepSrc = deepSrc.slice(0, insertPos) + '\n' + entry + deepSrc.slice(insertPos);
          added++;
        }
      }
    }
  } catch (e) { console.log(`  skip ${file}: ${e.message.slice(0, 60)}`); }
}

writeFileSync(DEEP_FILE, deepSrc, 'utf8');
console.log(`Added logic to ${added} entries`);
