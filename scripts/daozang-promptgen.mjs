// Generate a catalog-driven Grok prompt for batch N with fresh full-LIBRARY exclusion.
// Usage: node scripts/daozang-promptgen.mjs <batchN> [focus hint...]
import { LIBRARY } from '../src/engine/library-data.js';
import { writeFileSync } from 'node:fs';

const batchN = process.argv[2];
if (!batchN) { console.error('usage: daozang-promptgen.mjs <batchN> [focus]'); process.exit(1); }
const focus = process.argv.slice(3).join(' ') || '太清部(外丹/服饵/炉火) · 续道藏 · 正一部(雷法/符箓) · 洞神部(方术/占验) · 仙传谱录 · 类书 · 内丹';

const excl = [...new Set(LIBRARY.map((e) => (e.name_han || '').replace(/[（(].*$/, '')))]
  .filter(Boolean).join(' · ');

const prompt = `You are a distillation agent for the Chinese Daoist Canon (正统道藏 + 续道藏, Schipper-Verellen DZ# catalog).

GOAL: select 16 REAL, CANONICAL texts NOT yet covered and distill each. Use WEB SEARCH to confirm each genuinely exists in the 道藏 with a real Schipper DZ#.

CRITICAL RULES:
- ONLY return texts you can VERIFY exist (real DZ# from Schipper/CRTA/Komjathy/Pregadio). If you cannot confirm, SKIP it. NO speculative or mis-titled texts.
- DO NOT return any title in the EXCLUSION LIST below (already covered across all layers).
- Prefer under-covered categories: ${focus}. Use traditional OR simplified characters to match each text's canonical form.
- For each: dz (verified DZ###, or null ONLY if 藏外 but a real historical text you can name with evidence), name_han (exact canonical title), name_vi (Sino-Vietnamese), bu (三洞四辅), author, era, topic, essence (2-4 Vietnamese sentences), key_text (one verbatim Classical Chinese line or null), use, sources (≥2 reachable URLs), textual_certainty (high|partial|low).

EXCLUSION LIST (already covered — do NOT repeat):
${excl}

Return ONLY a single JSON object { "entries":[...] }, nothing after the closing brace. Select exactly 16 NEW real texts.`;

const out = `docs/_fragments/grok-batch${batchN}-prompt.md`;
writeFileSync(out, prompt);
console.log(`wrote ${out}; exclusion titles: ${excl.split(' · ').length}; focus: ${focus}`);
