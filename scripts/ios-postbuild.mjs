// ============================================================================
//  ios-postbuild.mjs — chạy SAU vite build --mode ios.
//  Vite 7 có thể copy public/ sau closeBundle → prune phải ở bước này.
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pruneIosArtifacts, assertNoPruned, dirSizeMB } from './ios-artifacts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist-ios');

if (!fs.existsSync(path.join(OUT, 'index.html'))) {
  console.error('[ios-postbuild] thiếu dist-ios/index.html — chạy vite build --mode ios trước');
  process.exit(1);
}

const removed = pruneIosArtifacts(OUT);
assertNoPruned(OUT);

const corpusIndex = path.join(OUT, 'corpus', 'index.json');
const entriesDir = path.join(OUT, 'corpus', 'entries');
if (!fs.existsSync(corpusIndex) || !fs.existsSync(entriesDir)) {
  console.error('[ios-postbuild] thiếu corpus trong dist-ios');
  process.exit(1);
}

const nEntries = fs.readdirSync(entriesDir).filter((f) => f.endsWith('.json')).length;
const mb = dirSizeMB(OUT);
console.log(`[ios-postbuild] xoá: ${removed.join(', ') || '(không có gì)'}`);
console.log(`[ios-postbuild] dist-ios: ${mb} MB · corpus entries ${nEntries}`);
