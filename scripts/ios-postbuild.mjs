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

const indexHtml = path.join(OUT, 'index.html');
const altHtml = path.join(OUT, 'ios-app.html');
if (fs.existsSync(altHtml)) {
  fs.renameSync(altHtml, indexHtml);
}
if (!fs.existsSync(indexHtml)) {
  console.error('[ios-postbuild] thiếu dist-ios/index.html — chạy vite build --mode ios trước');
  process.exit(1);
}

fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: 'Lữ Đăng — Hiệu chỉnh giờ',
  short_name: 'Lữ Đăng',
  description: 'Nghiệm chứng gia tộc · 校正时辰: mở án, xếp 12 giờ theo nhất quán cụm, mỗi dòng sổ cái nhảy tới đoạn kinh trên máy.',
  lang: 'vi',
  dir: 'ltr',
  start_url: '/?source=pwa',
  scope: '/',
  display: 'standalone',
  display_override: ['standalone', 'fullscreen'],
  orientation: 'any',
  background_color: '#0a0913',
  theme_color: '#0a0913',
  categories: ['education', 'productivity'],
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

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
