// Parse a grok-batchN.json → validated *_clean.json, dup-filtered against current DAOZANG.
// Usage: node scripts/daozang-parse.mjs docs/_fragments/grok-batch14.json
import { readFileSync, writeFileSync } from 'node:fs';

const inPath = process.argv[2];
if (!inPath) { console.error('usage: daozang-parse.mjs <grok-batchN.json>'); process.exit(1); }
const outPath = inPath.replace(/\.json$/, '-clean.json');
const done = JSON.parse(readFileSync('docs/_fragments/_done-titles.json', 'utf8'));

const env = JSON.parse(readFileSync(inPath, 'utf8'));
let entries = env.structuredOutput && env.structuredOutput.entries;
if (!entries) entries = JSON.parse(env.text).entries;
entries = Array.isArray(entries) ? entries : [];

const valid = entries.filter((e) => e && e.name_han && Array.isArray(e.sources) && e.sources.length >= 2);
const dups = valid.filter((e) => done.includes(e.name_han));
const clean = valid.filter((e) => !done.includes(e.name_han));

console.log(`turns:${env.num_turns} cost:$${env.total_cost_usd} raw:${entries.length} valid:${valid.length} dup:${dups.length} clean:${clean.length}`);
for (const e of valid) {
  const flag = done.includes(e.name_han) ? 'DUP' : 'NEW';
  console.log(`${flag} ${e.dz || 'null'} | ${e.name_han} | ${e.bu} | src=${(e.sources || []).length} | ${e.textual_certainty}`);
}
writeFileSync(outPath, JSON.stringify(clean, null, 1));
console.log(`saved ${clean.length} → ${outPath}`);
