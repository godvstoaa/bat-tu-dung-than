// Process deep batch results → append to daozang-deep.js
// Usage: node scripts/deep-process.mjs docs/_fragments/_deep2-b1.json
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: deep-process.mjs <deep-batch.json>'); process.exit(1); }

const env = JSON.parse(readFileSync(file, 'utf8'));
let entries = env.structuredOutput?.entries;
if (!entries) {
  try { entries = JSON.parse(env.text).entries; }
  catch (e) {
    const o = JSON.parse(env.text.slice(env.text.indexOf('{'), env.text.lastIndexOf('}') + 1));
    entries = o.entries;
  }
}

// Read current daozang-deep.js
const deepFile = 'src/engine/daozang-deep.js';
let deepSrc = readFileSync(deepFile, 'utf8');

// Generate JS entries
const newEntries = entries.filter(e => e.deep_essence && e.deep_essence.length > 100).map(e => {
  const key = e.name_han.replace(/['\\]/g, '').replace(/（.*）/, '').slice(0, 20);
  const de = (e.deep_essence || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  const kp = (e.key_passages || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  const ap = (e.application || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  const rl = (e.related || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  return `  '${key}': { deep_essence: '${de}', key_passages: '${kp}', application: '${ap}', related: '${rl}' },`;
}).join('\n');

// Insert before closing }
const insertPos = deepSrc.indexOf('\n};', deepSrc.indexOf('DAOZANG_DEEP'));
if (insertPos > 0) {
  deepSrc = deepSrc.slice(0, insertPos) + '\n' + newEntries + '\n' + deepSrc.slice(insertPos);
  writeFileSync(deepFile, deepSrc, 'utf8');
  console.log(`Added ${entries.filter(e => e.deep_essence && e.deep_essence.length > 100).length}/${entries.length} deep entries to daozang-deep.js`);
  console.log(`avg deep_essence: ${Math.round(entries.reduce((s, e) => s + (e.deep_essence || '').length, 0) / entries.length)} chars`);
} else {
  console.error('Could not find insertion point in daozang-deep.js');
}
