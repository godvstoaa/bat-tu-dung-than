// ============================================================================
//  verify-ios-build.mjs — artifact dist-ios: studio bundle, không module tiêu dùng
// ============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IOS_PRUNE, dirSizeMB } from './ios-artifacts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist-ios');
let pass = 0;
let fail = 0;

function check(cond, msg) {
  if (cond) {
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
  const nFiles = fs.readdirSync(entriesDir).filter((x) => x.endsWith('.json')).length;
  check(indexTotal === nFiles, `index.json (${indexTotal}) khớp số file entries (${nFiles})`);
}

const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
check(!/fonts\.googleapis\.com/.test(html), 'không còn request Google Fonts');
check(!/id="birth-form"|id="ai-fab"|class="hero"/.test(html), 'HTML không còn hero / form / FAB web');
check(/Hiệu chỉnh giờ|校正时辰|Án cổ|校正/i.test(html), 'title/description Án cổ · 校正');
check(!/luận mệnh/i.test(html), 'HTML không còn «luận mệnh»');
check(!/sổ hồ sơ mệnh lý|Lập lá số|Giải Mệnh/i.test(html), 'HTML không còn chrome diễn giải mệnh');
check(!/data-ios-hide/.test(html), 'không dùng data-ios-hide (xoá, không ẩn)');

const manPath = path.join(OUT, 'manifest.webmanifest');
check(fs.existsSync(manPath), 'manifest.webmanifest có mặt');
if (fs.existsSync(manPath)) {
  const man = fs.readFileSync(manPath, 'utf8');
  check(!/luận mệnh/i.test(man), 'manifest không còn «luận mệnh»');
  check(/Hiệu chỉnh giờ|校正时辰|Án cổ|校正/i.test(man), 'manifest nói Án cổ / 校正');
}

let js = '';
let appJs = '';
const assets = path.join(OUT, 'assets');
for (const f of fs.readdirSync(assets).filter((x) => x.endsWith('.js'))) {
  const body = fs.readFileSync(path.join(assets, f), 'utf8') + '\n';
  js += body;
  if (!f.includes('vendor-lunar') && !f.includes('vendor-astronomy')) appJs += body;
}

check(!js.includes('/api/inbox'), 'không chunk nào còn URL /api/inbox');
check(!/src\/main\.js|from['"]\.\/main/.test(js), 'không phải bundle web main.js');

const banned = [
  [/tarot/i, 'tarot'],
  [/runes-kb|drawRune|TAROT_MAJOR/i, 'runes/tarot kb'],
  [/cầu thẻ|求签|摇签|qiuqian/i, 'cầu thẻ'],
  [/Hoàng Lịch|黄历/i, 'hoàng lịch'],
  [/Nghịch Thiên|cải mệnh/i, 'cải mệnh CTA'],
  [/Giải Mệnh/, 'Giải Mệnh'],
  [/vận thế hôm nay/i, 'vận thế hôm nay'],
  [/\/100/, 'điểm /100'],
];
for (const [re, label] of banned) {
  const hay = label === 'điểm /100' ? appJs : js;
  check(!re.test(hay) && !re.test(html), `bundle không có ${label}`);
}

const mb = dirSizeMB(OUT);
console.log(`  INFO  dist-ios: ${mb} MB`);
if (fail) {
  console.error(`[verify-ios] ${fail} FAIL / ${pass} PASS`);
  process.exit(1);
}
console.log('[verify-ios] OK');
