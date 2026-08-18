// ============================================================================
//  verify-ios-build.mjs — assert artifact dist-ios trước khi cap sync.
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IOS_PRUNE, dirSizeMB } from './ios-artifacts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist-ios');
let pass = 0;
let fail = 0;

function check( Cond, msg) {
  if (Cond) {
    console.log(`  PASS  ${msg}`);
    pass++;
  } else {
    console.log(`  FAIL  ${msg}`);
    fail++;
  }
}

if (!fs.existsSync(OUT)) {
  console.error('[verify-ios] thiếu dist-ios/ — chạy npm run build:ios');
  process.exit(1);
}

console.log('[verify-ios]');
for (const name of IOS_PRUNE) {
  check(!fs.existsSync(path.join(OUT, name)), `không có ${name}`);
}

const indexPath = path.join(OUT, 'corpus', 'index.json');
const entriesDir = path.join(OUT, 'corpus', 'entries');
check(fs.existsSync(indexPath), 'corpus/index.json có trong output');
check(fs.existsSync(entriesDir), 'corpus/entries/ có trong output');

let indexTotal = 0;
if (fs.existsSync(indexPath)) {
  const idx = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  indexTotal = idx.total || idx.items?.length || 0;
  const nFiles = fs.readdirSync(entriesDir).filter((f) => f.endsWith('.json')).length;
  check(indexTotal === nFiles, `index.json (${indexTotal}) khớp số file entries (${nFiles})`);
}

const statsPath = path.join(ROOT, 'src', 'ios', 'corpus-stats.json');
check(fs.existsSync(statsPath), 'src/ios/corpus-stats.json tồn tại');
if (fs.existsSync(statsPath)) {
  const st = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  check(st.total === indexTotal, `corpus-stats.json khớp index (${st.total})`);
}

const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
check(!/fonts\.googleapis\.com/.test(html), 'không còn request Google Fonts');
check(!/application\/ld\+json/.test(html), 'không còn JSON-LD structured data');
check(/Lữ Đăng|Cổ Pháp|Chart Lab|tra cứu/i.test(html), 'title/description research-oriented');

const mb = dirSizeMB(OUT);
console.log(`  INFO  dist-ios: ${mb} MB`);
if (fail) {
  console.error(`[verify-ios] ${fail} FAIL / ${pass} PASS`);
  process.exit(1);
}
console.log('[verify-ios] OK');
