#!/usr/bin/env node
// ============================================================================
//  grok-ocr.mjs — Orchestrator: build OCR prompt → spawn local `grok` CLI
//  headless → parse structuredOutput → validate → wrap ETHICS envelope →
//  write docs/_fragments/<work>.json. Zero deps (Node built-ins only).
//
//  Usage:
//    node scripts/grok-ocr.mjs \
//      --work FU-001 --type talisman_fragment \
//      --target "src/engine/talisman-data.js -> talismans[]" \
//      --scans docs/_scans/commons/TaoistCharm.jpg[,second.jpg,...] \
//      [--prompt docs/_prompts/ocr-fu.md] [--schema docs/_schema/talisman.schema.json] \
//      [--out docs/_fragments/FU-001.json] [--model grok-4.5] [--effort high] \
//      [--max-turns 8] [--web-search]   (default: --disable-web-search for OCR pass)
//
//  Verify pass (separate): --mode verify --fragment docs/_fragments/FU-001.json
//    → uses docs/_prompts/verify.md, web search ON, writes _verifier_verdict.
// ============================================================================
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GROK = process.env.GROK_BIN || 'grok';

const ETHICS_OVERLAY = {
  framing: 'Tài liệu tham khảo văn hoá-tôn giáo. KHÔNG phải y tế/tâm thần/chẩn đoán; KHÔNG thay thế bác sĩ/chuyên gia tâm lý/đạo sĩ thụ chức. Mọi «tín hiệu» chỉ là TƯỢNG/xác suất theo cổ pháp — không chắc chắn, không dọa nạt.',
  performance_caveat: 'Nghi lễ / 書符 / 科儀 thực sự phải do đạo sĩ / pháp sư đã thụ 箓 (受箓) chủ trì. App chỉ trình bày tri thức văn hoá, KHÔNG hướng dẫn tự thực hành, KHÔNG cung cấp 笫 để in/ve.',
  opt_in: true,
};

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const next = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      o[k.slice(2)] = next;
    }
  }
  return o;
}

function buildOcrPrompt(args) {
  const tplPath = resolve(ROOT, args.prompt || 'docs/_prompts/ocr-fu.md');
  let tpl = readFileSync(tplPath, 'utf8');
  const scans = String(args.scans).split(',').map(s => s.trim()).filter(Boolean);
  const list = scans.map((s, i) => `${i + 1}. \`${s}\``).join('\n');
  return tpl.replace('{{SCANS}}', list);
}

function buildVerifyPrompt(args) {
  const fragPath = resolve(ROOT, args.fragment);
  const frag = readFileSync(fragPath, 'utf8');
  const tpl = readFileSync(resolve(ROOT, 'docs/_prompts/verify.md'), 'utf8');
  return tpl.replace('{{FRAGMENT}}', frag.slice(0, 60000));
}

function runGrok({ promptText, schemaPath, model, effort, maxTurns, webSearch }) {
  // Write prompt to temp file; grok reads via --prompt-file.
  const tmpPrompt = resolve(ROOT, '.grok-prompt.tmp.md');
  writeFileSync(tmpPrompt, promptText, 'utf8');
  const args = [
    '--cwd', ROOT,
    webSearch ? '' : '--disable-web-search',
    '--reasoning-effort', effort || 'high',
    '--max-turns', String(maxTurns || 8),
    '--always-approve',
    '--permission-mode', 'bypassPermissions',
    '--output-format', 'json',
    '--json-schema', readFileSync(resolve(ROOT, schemaPath), 'utf8'),
    '--prompt-file', tmpPrompt,
  ].filter(Boolean);
  return new Promise((resolveP, rejectP) => {
    const child = spawn(GROK, args, { cwd: ROOT, env: process.env });
    let out = '', err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('error', rejectP);
    child.on('close', code => resolveP({ code, out, err }));
  });
}

function extractJsonObject(s) {
  // stdout may have leading/trailing whitespace or stray lines; grab the outermost {...}.
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in grok stdout');
  return JSON.parse(s.slice(start, end + 1));
}

function validateEntries(entries) {
  const errs = [];
  if (!Array.isArray(entries) || entries.length === 0) { return ['entries missing/empty']; }
  for (const e of entries) {
    for (const f of ['id', 'name_han', 'school', 'layer', 'meaning', 'sources', 'textual_certainty']) {
      if (e[f] === undefined || e[f] === null || e[f] === '') errs.push(`${e.id || '?'}: missing ${f}`);
    }
    if (!Array.isArray(e.sources) || e.sources.length < 2) errs.push(`${e.id}: sources < 2`);
    if (!['fu', 'mantra', 'ritual', 'cultivation', 'classic'].includes(e.layer)) errs.push(`${e.id}: bad layer ${e.layer}`);
    if (!['high', 'partial', 'low'].includes(e.textual_certainty)) errs.push(`${e.id}: bad certainty`);
  }
  return errs;
}

async function ocrMode(args) {
  const promptText = buildOcrPrompt(args);
  const schemaPath = args.schema || 'docs/_schema/talisman.schema.json';
  console.log(`[grok-ocr] OCR pass: scans=${String(args.scans).split(',').length}, effort=${args.effort || 'high'}`);
  const { code, out, err } = await runGrok({
    promptText, schemaPath,
    model: args.model, effort: args.effort, maxTurns: args['max-turns'],
    webSearch: args['web-search'] === 'true',
  });
  if (code !== 0) { console.error('[grok-ocr] grok exit', code, '\nSTDERR:', err.slice(-1500), '\nSTDOUT-tail:', out.slice(-1500)); process.exit(1); }
  const env = extractJsonObject(out);
  const data = env.structuredOutput || (env.text ? safeParse(env.text) : null);
  if (!data || !data.entries) { console.error('[grok-ocr] no structuredOutput.entries. Raw:', out.slice(-1500)); process.exit(1); }
  const verrs = validateEntries(data.entries);
  if (verrs.length) { console.error('[grok-ocr] VALIDATION FAILED:\n - ' + verrs.join('\n - ')); process.exit(2); }

  const work = args.work;
  const fragment = {
    _work_item: work,
    _type: args.type || 'talisman_fragment',
    _assembly_target: args.target || 'src/engine/talisman-data.js -> talismans[]',
    _textual_honesty_notes: [],
    _ethics_overlay: ETHICS_OVERLAY,
    entries: data.entries.map(e => ({ ...e, scan_path: e.scan_path || String(args.scans).split(',')[0] })),
    notes: data.notes || '',
    _verifier_verdict: null,
    _cost_usd: env.total_cost_usd ?? null,
    _model: env.modelUsage ? Object.keys(env.modelUsage)[0] : (args.model || 'grok-4.5'),
  };
  const outPath = resolve(ROOT, args.out || `docs/_fragments/${work}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(fragment, null, 2), 'utf8');
  console.log(`[grok-ocr] ✓ wrote ${outPath.replace(ROOT + '/', '')} — ${data.entries.length} entries, cost=$${env.total_cost_usd ?? '?'}`);
  if (verrs.length === 0 && data.entries.some(e => e.verification_status !== 'verified_2plus_independent')) {
    console.log('[grok-ocr] hint: some entries unverified — run `--mode verify --fragment <path>`.');
  }
}

async function verifyMode(args) {
  const promptText = buildVerifyPrompt(args);
  const schemaPath = args.schema || 'docs/_schema/verify.schema.json';
  if (!existsSync(resolve(ROOT, schemaPath))) {
    // inline minimal verify schema file if missing
    writeFileSync(resolve(ROOT, schemaPath), JSON.stringify(VERIFY_SCHEMA, null, 2));
  }
  console.log(`[grok-ocr] VERIFY pass: fragment=${args.fragment}`);
  const { code, out, err } = await runGrok({
    promptText, schemaPath, model: args.model,
    effort: args.effort || 'high', maxTurns: args['max-turns'] || 10,
    webSearch: true,
  });
  if (code !== 0) { console.error('[grok-ocr] grok exit', code, '\nSTDERR:', err.slice(-1500), '\nSTDOUT-tail:', out.slice(-1500)); process.exit(1); }
  const env = extractJsonObject(out);
  const verdict = env.structuredOutput || safeParse(env.text);
  const fragPath = resolve(ROOT, args.fragment);
  const frag = JSON.parse(readFileSync(fragPath, 'utf8'));
  frag._verifier_verdict = verdict || { raw: env.text || null };
  writeFileSync(fragPath, JSON.stringify(frag, null, 2), 'utf8');
  console.log(`[grok-ocr] ✓ verdict written into ${args.fragment}: ${JSON.stringify(verdict?.overall || {})}`);
}

function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }

const VERIFY_SCHEMA = {
  type: 'object', required: ['verdicts', 'overall'],
  properties: {
    verdicts: { type: 'array', items: { type: 'object', required: ['id', 'verdict', 'reason'], properties: {
      id: { type: 'string' }, verdict: { type: 'string', enum: ['verified', 'conditional', 'rejected'] },
      checked_sources: { type: 'array', items: { type: 'string' } }, reason: { type: 'string' } } } },
    overall: { type: 'object', properties: { verified: { type: 'integer' }, conditional: { type: 'integer' }, rejected: { type: 'integer' } } },
    flags: { type: 'array', items: { type: 'string' } },
  },
};

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'ocr';
if (mode === 'verify') verifyMode(args).catch(e => { console.error(e); process.exit(1); });
else ocrMode(args).catch(e => { console.error(e); process.exit(1); });
