// ============================================================================
//  build-corpus.mjs — sinh corpus offline từ DAOZANG cho bản iOS.
//  Output:
//    public/corpus/index.json
//    public/corpus/entries/<safe-id>.json
//    src/ios/corpus-stats.json  (COMMIT file này)
// ============================================================================
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { rmrf } from './ios-artifacts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'corpus');
const ENTRIES_DIR = path.join(OUT_DIR, 'entries');
const STATS_PATH = path.join(ROOT, 'src', 'ios', 'corpus-stats.json');

const THRESH = { han_text: 20, deep_essence: 100, logic_chain: 40, full_vn: 200 };

function safeId(id) {
  return String(id || '')
    .replace(/[^\w\-一-龥]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120) || 'unknown';
}

function stripDiacritics(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function extractDz(notes) {
  const m = String(notes || '').match(/DZ\s*0*(\d+)/i);
  return m ? `DZ${m[1]}` : '';
}

function nonempty(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

function substantive(s, n) {
  return typeof s === 'string' && s.trim().length >= n;
}

async function main() {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/engine/daozang-data.js')).href);
  const DAOZANG = mod.DAOZANG;
  if (!Array.isArray(DAOZANG) || DAOZANG.length < 100) {
    throw new Error(`[corpus] DAOZANG không hợp lệ: ${DAOZANG?.length}`);
  }

  fs.mkdirSync(ENTRIES_DIR, { recursive: true });

  // Xóa entry cũ đúng pattern; giữ file lạ + cảnh báo
  for (const name of fs.readdirSync(ENTRIES_DIR)) {
    if (!name.endsWith('.json')) {
      console.warn(`[corpus] giữ file lạ trong entries/: ${name}`);
      continue;
    }
    fs.unlinkSync(path.join(ENTRIES_DIR, name));
  }

  const index = [];
  const certainty = { high: 0, partial: 0, low: 0 };
  const nonEmpty = {
    han_text: 0, meaning: 0, use: 0, deep_essence: 0, deep_passages: 0,
    deep_application: 0, deep_related: 0, logic_thesis: 0, logic_chain: 0,
    logic_practice: 0, logic_compare: 0, full_vn: 0, sources: 0, notes: 0,
  };
  const substantiveCounts = { han_text: 0, deep_essence: 0, logic_chain: 0, full_vn: 0 };
  const buSet = new Set();
  let withDz = 0;
  let withSources = 0;
  const hash = createHash('sha256');

  for (const e of DAOZANG) {
    const sid = safeId(e.id);
    const dz = extractDz(e.notes);
    if (dz) withDz++;
    if (Array.isArray(e.sources) && e.sources.length) withSources++;
    if (e.bu) buSet.add(e.bu);
    const c = e.textual_certainty || 'partial';
    if (certainty[c] != null) certainty[c]++;
    else certainty.partial++;

    for (const k of Object.keys(nonEmpty)) {
      const v = e[k];
      if (k === 'sources') {
        if (Array.isArray(v) && v.length) nonEmpty.sources++;
      } else if (nonempty(v)) nonEmpty[k]++;
    }
    if (substantive(e.han_text, THRESH.han_text)) substantiveCounts.han_text++;
    if (substantive(e.deep_essence, THRESH.deep_essence)) substantiveCounts.deep_essence++;
    if (substantive(e.logic_chain, THRESH.logic_chain)) substantiveCounts.logic_chain++;
    if (substantive(e.full_vn, THRESH.full_vn)) substantiveCounts.full_vn++;

    const entry = {
      sid,
      id: e.id,
      name_han: e.name_han || '',
      name_vi: e.name_vi || '',
      bu: e.bu || '',
      author: e.author || '',
      era: e.era || '',
      topic: e.topic || '',
      school: e.school || '',
      dz,
      textual_certainty: c,
      meaning: e.meaning || '',
      use: e.use || '',
      han_text: e.han_text || '',
      deep_essence: e.deep_essence || '',
      deep_passages: e.deep_passages || '',
      deep_application: e.deep_application || '',
      deep_related: e.deep_related || '',
      logic_thesis: e.logic_thesis || '',
      logic_chain: e.logic_chain || '',
      logic_practice: e.logic_practice || '',
      logic_compare: e.logic_compare || '',
      full_vn: e.full_vn || '',
      notes: e.notes || '',
      sources: Array.isArray(e.sources) ? e.sources.slice() : [],
    };

    const body = JSON.stringify(entry);
    hash.update(body);
    fs.writeFileSync(path.join(ENTRIES_DIR, `${sid}.json`), body);

    index.push({
      sid,
      id: e.id,
      name_han: entry.name_han,
      name_vi: entry.name_vi,
      bu: entry.bu,
      topic: entry.topic,
      author: entry.author,
      era: entry.era,
      dz: entry.dz,
      textual_certainty: entry.textual_certainty,
      search: [
        entry.name_han,
        entry.name_vi,
        stripDiacritics(entry.name_vi),
        entry.dz,
        entry.bu,
        entry.topic,
        entry.author,
      ].filter(Boolean).join(' | ').toLowerCase(),
      has_han: substantive(entry.han_text, THRESH.han_text),
      has_logic: substantive(entry.logic_chain, THRESH.logic_chain),
      has_vn: substantive(entry.full_vn, THRESH.full_vn),
    });
  }

  index.sort((a, b) => a.name_han.localeCompare(b.name_han, 'zh'));

  const stats = {
    schema: 1,
    source: 'src/engine/daozang-data.js',
    generatedBy: 'scripts/build-corpus.mjs',
    note: 'Sinh tự động — KHÔNG sửa tay. Mọi số liệu công bố (app/App Store) phải lấy từ file này.',
    total: index.length,
    buCount: buSet.size,
    layers: ['daozang'],
    withDzNumber: withDz,
    withSources,
    certainty,
    thresholds: THRESH,
    nonEmpty,
    substantive: substantiveCounts,
    contentHash: hash.digest('hex').slice(0, 16),
  };

  fs.mkdirSync(path.dirname(STATS_PATH), { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify({ schema: 1, total: index.length, items: index }));
  fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2));

  // Dọn marker rác nếu có
  const staleMarker = path.join(OUT_DIR, '_BUILD_MARKER');
  if (fs.existsSync(staleMarker)) rmrf(staleMarker);

  console.log(`[corpus] ${stats.total} mục · ${stats.buCount} bộ · DZ# ${stats.withDzNumber} · hash ${stats.contentHash}`);
  console.log(`[corpus] substantive: han_text=${stats.substantive.han_text} · deep_essence=${stats.substantive.deep_essence} · logic_chain=${stats.substantive.logic_chain} · full_vn=${stats.substantive.full_vn}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
