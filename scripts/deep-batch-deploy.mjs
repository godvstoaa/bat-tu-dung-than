// Process ALL available deep batches → append to daozang-deep.js
// Usage: node scripts/deep-batch-deploy.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const FRAG = 'docs/_fragments';
const DEEP_FILE = 'src/engine/daozang-deep.js';

const batchFiles = readdirSync(FRAG).filter(f => /^_deep20-b\d+\.json$/.test(f)).sort((a, b) => {
  const na = parseInt(a.match(/\d+/)[0]); const nb = parseInt(b.match(/\d+/)[0]);
  return na - nb;
});

console.log(`Found ${batchFiles.length} batch files`);

let deepSrc = readFileSync(DEEP_FILE, 'utf8');
const existingKeys = new Set();
for (const m of deepSrc.matchAll(/'([^']+)': \{/g)) existingKeys.add(m[1]);
console.log(`Existing keys in DAOZANG_DEEP: ${existingKeys.size}`);

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
      if (!e.deep_essence || e.deep_essence.length < 80) continue;
      const key = e.name_han.replace(/['\\]/g, '').replace(/（.*）/, '').slice(0, 20);
      if (existingKeys.has(key)) continue;
      const de = (e.deep_essence || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
      const kp = (e.key_passages || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
      const ap = (e.application || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
      const rl = (e.related || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
      const entry = `  '${key}': { deep_essence: '${de}', key_passages: '${kp}', application: '${ap}', related: '${rl}' },\n`;
      const insertPos = deepSrc.indexOf('\n};', deepSrc.indexOf('DAOZANG_DEEP'));
      if (insertPos > 0) {
        deepSrc = deepSrc.slice(0, insertPos) + '\n' + entry + deepSrc.slice(insertPos);
        existingKeys.add(key);
        added++;
      }
    }
  } catch (e) { console.log(`  skip ${file}: ${e.message.slice(0, 50)}`); }
}

writeFileSync(DEEP_FILE, deepSrc, 'utf8');
console.log(`Added ${added} new deep entries (total: ${existingKeys.size})`);
