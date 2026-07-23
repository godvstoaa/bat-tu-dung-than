// Generic append: insert validated entries from a *_clean.json into DAOZANG_RAW.
// Usage: node scripts/daozang-append.mjs docs/_fragments/grok-batch14-clean.json ['batch14 · Grok-4.5']
import { readFileSync, writeFileSync } from 'node:fs';

const cleanPath = process.argv[2];
const provenance = process.argv[3] || 'Grok-4.5 web-search';
const FILE = 'src/engine/daozang-data.js';
if (!cleanPath) { console.error('usage: daozang-append.mjs <clean.json> [provenance]'); process.exit(1); }

let src = readFileSync(FILE, 'utf8');
const entries = JSON.parse(readFileSync(cleanPath, 'utf8'));

const decl = src.indexOf('DAOZANG_RAW');
const mapIdx = src.indexOf('.map(', decl);
const closeIdx = src.lastIndexOf(']', mapIdx);
if (closeIdx < 0 || mapIdx < 0) { console.error('anchor not found'); process.exit(1); }

const jsStr = (s) => "'" + String(s == null ? '' : s)
  .replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  .replace(/\r?\n/g, ' ').replace(/`/g, '') + "'";

const block = entries.map((e) => {
  const dz = e.dz ? jsStr(e.dz) : 'null';
  const srcs = (e.sources || []).map(jsStr).join(', ');
  return [
    `  { dz: ${dz}, name_han: ${jsStr(e.name_han)}, name_vi: ${jsStr(e.name_vi)}, bu: ${jsStr(e.bu)}, author: ${jsStr(e.author || '')}, era: ${jsStr(e.era || '')}, topic: ${jsStr(e.topic || '')},`,
    `    essence: ${jsStr(e.essence)},`,
    `    key_text: ${jsStr(e.key_text || '')}, use: ${jsStr(e.use || '')},`,
    `    sources: [${srcs}],`,
    `    textual_certainty: ${jsStr(e.textual_certainty || 'partial')}, notes: ${jsStr(provenance)} },`,
  ].join('\n');
}).join('\n');

src = src.slice(0, closeIdx) + '\n' + block + '\n' + src.slice(closeIdx);
writeFileSync(FILE, src, 'utf8');
console.log(`appended ${entries.length} entries (provenance: ${provenance})`);
