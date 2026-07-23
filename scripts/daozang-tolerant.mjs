// Tolerant parse: grok sometimes returns structuredOutput=null and text with
// trailing junk / duplicated JSON. Extract the FIRST balanced {...} object and
// pull .entries, dup-filter, validate, save <in>-clean.json.
// Usage: node scripts/daozang-tolerant.mjs docs/_fragments/grok-batchN.json
import { readFileSync, writeFileSync } from 'node:fs';

const inPath = process.argv[2];
if (!inPath) { console.error('usage: daozang-tolerant.mjs <grok-batchN.json>'); process.exit(1); }
const outPath = inPath.replace(/\.json$/, '-clean.json');
const done = JSON.parse(readFileSync('docs/_fragments/_done-titles.json', 'utf8'));

const env = JSON.parse(readFileSync(inPath, 'utf8'));

function extractFirstObject(s) {
  const start = s.indexOf('{');
  if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) return s.slice(start, i + 1); }
    }
  }
  return null;
}

let entries = env.structuredOutput && env.structuredOutput.entries;
if (!entries) {
  const obj = extractFirstObject(env.text || '');
  if (!obj) { console.error('no JSON object found in text'); process.exit(2); }
  entries = JSON.parse(obj).entries;
}
entries = Array.isArray(entries) ? entries : [];

const valid = entries.filter((e) => e && e.name_han && Array.isArray(e.sources) && e.sources.length >= 2);
const clean = valid.filter((e) => !done.includes(e.name_han));
const dups = valid.filter((e) => done.includes(e.name_han));

console.log(`turns:${env.num_turns} cost:$${env.total_cost_usd} structuredErr:${env.structuredOutputError ? 'YES' : 'no'} raw:${entries.length} valid:${valid.length} dup:${dups.length} clean:${clean.length}`);
for (const e of valid) console.log(`${done.includes(e.name_han) ? 'DUP' : 'NEW'} ${e.dz || 'null'} | ${e.name_han} | ${e.bu} | src=${(e.sources || []).length} | ${e.textual_certainty}`);
writeFileSync(outPath, JSON.stringify(clean, null, 1));
console.log(`saved ${clean.length} → ${outPath}`);
