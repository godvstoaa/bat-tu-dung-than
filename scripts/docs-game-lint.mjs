#!/usr/bin/env node
// ============================================================================
//  KIỂM BỘ THIẾT KẾ GAME docs/game/ theo docs/GAME-THIET-KE-MANIFEST.md §4.1 (V1–V14).
//    node scripts/docs-game-lint.mjs        thoát mã 1 khi có mục trượt
//  Thuần Node. Chỉ ĐỌC.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'docs/game');
const rd = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();
const src = Object.fromEntries(files.map((f) => [f, rd(path.join(DIR, f))]));
const isChapter = (f) => /^(0[0-4]|1\d|2[0-3]|3[0-2]|40|90)-/.test(f);
const isGuide = (f) => /^5\d-/.test(f);
const results = [];
const check = (id, name, errs) => { results.push({ id, name, errs }); };
const where = (f, i) => `${f}:${i + 1}`;

// V1 — sáu trường đầu tệp
{
  const need = ['Trạng thái:', 'Bộ phận chủ trì:', 'Nguồn sự thật trong mã:', 'Test:', 'Thay thế:', 'Kiểm với mã ngày:'];
  const errs = [];
  for (const f of files.filter(isChapter)) { const top = src[f].split('\n').slice(0, 14).join('\n'); for (const n of need) if (!top.includes('**' + n + '**')) errs.push(`${f}: thiếu trường «${n}»`); }
  check('V1', 'sáu trường đầu tệp', errs);
}
// V2 — liên kết tương đối
{
  const errs = [];
  for (const f of files) src[f].split('\n').forEach((l, i) => { for (const m of l.matchAll(/\]\(([^)\s]+)\)/g)) { const t = m[1]; if (/^(https?:|mailto:|#)/.test(t)) continue; const p = path.resolve(DIR, t.split('#')[0]); if (!fs.existsSync(p)) errs.push(`${where(f, i)}: liên kết gãy → ${t}`); } });
  check('V2', 'liên kết tương đối', errs);
}
// V3 — tham chiếu §N.M trỏ tới tiêu đề có thật (bỏ dòng «Thay thế», bỏ tham chiếu đứng ngay sau một liên kết hoặc tên tệp)
{
  const heads = {};
  for (const f of files) { const n = f.match(/^(\d\d)-/); if (!n) continue; heads[+n[1]] = new Set([...src[f].matchAll(/^#{1,4} (\d+(?:\.\d+)+)\b/gm)].map((x) => x[1])); }
  const errs = [];
  for (const f of files) {
    if (/^90-|^NHAT-KY/.test(f)) continue;
    src[f].split('\n').forEach((l, i) => {
      if (l.includes('**Thay thế:**')) return;
      for (const m of l.matchAll(/(?<![)`]\s)§(\d{1,2})((?:\.\d+)+)/g)) { const ch = +m[1]; const full = m[1] + m[2]; if (!heads[ch]) { errs.push(`${where(f, i)}: §${full} — không có chương ${m[1]}`); continue; } if (!heads[ch].has(full)) errs.push(`${where(f, i)}: §${full} — không có tiêu đề`); }
      // tham chiếu đứng ngay sau liên kết tới một chương của chính bộ này: «[14-VIEC-LAM](14-VIEC-LAM.md) §14.1»
      for (const m of l.matchAll(/\]\((\d\d)-[^)]*\.md\)\s§(\d{1,2})((?:\.\d+)+)/g)) { const full = m[2] + m[3]; if (+m[1] !== +m[2]) errs.push(`${where(f, i)}: §${full} đứng sau liên kết tới chương ${m[1]}`); else if (!heads[+m[2]] || !heads[+m[2]].has(full)) errs.push(`${where(f, i)}: §${full} — không có tiêu đề`); }
    });
  }
  check('V3', 'tham chiếu § trỏ tới tiêu đề có thật', errs);
}
// V4 — đường dẫn mã trong dấu `
{
  const errs = [];
  for (const f of files) src[f].split('\n').forEach((l, i) => { for (const m of l.matchAll(/`((?:src\/game|worker|scripts)\/[A-Za-z0-9_./-]+\.(?:js|mjs|css|py))(?: ›[^`]*)?`/g)) if (!fs.existsSync(path.join(ROOT, m[1]))) errs.push(`${where(f, i)}: không có tệp ${m[1]}`); });
  check('V4', 'đường dẫn mã tồn tại', errs);
}
// V5, V6 — độ phủ phụ lục
{
  const a1 = fs.existsSync(path.join(DIR, 'phu-luc/A1-ban-do-ma.md')) ? rd(path.join(DIR, 'phu-luc/A1-ban-do-ma.md')) : '';
  const errs = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'src/game')).filter((x) => /\.(js|css)$/.test(x))) if (!a1.includes('`' + f + '`')) errs.push(`A1 thiếu src/game/${f}`);
  for (const f of fs.readdirSync(path.join(ROOT, 'worker')).filter((x) => x.endsWith('.js'))) if (!a1.includes('`worker/' + f + '`')) errs.push(`A1 thiếu worker/${f}`);
  if (!/Chưa gán chương: \*\*0\*\*/.test(a1)) errs.push('A1: còn mô-đun chưa gán chương');
  check('V5', 'mọi mô-đun có trong A1 và được gán chương', errs);
  const a2 = fs.existsSync(path.join(DIR, 'phu-luc/A2-kiem-thu.md')) ? rd(path.join(DIR, 'phu-luc/A2-kiem-thu.md')) : '';
  check('V6', 'mọi bộ test có trong A2', fs.readdirSync(path.join(ROOT, 'scripts')).filter((x) => /^test-.*\.mjs$/.test(x)).filter((f) => !a2.includes('scripts/' + f)).map((f) => `A2 thiếu ${f}`));
}
// V7 — tài liệu cũ có dòng trong chương 90
{
  const OLD = ['GAME-HUYEN-QUAN-SPEC', 'GAME-MMO-PROMPT-PLAN', 'DAI-THE-GIOI-DESIGN', 'GAME-V2-THIET-KE', 'GAME-NOI-DUNG-THEO-APP', 'GAME-THIET-KE-CHOT', 'GAME-MESHY-ASSET-PLAN', 'MESHY-LIBRARY-CC0', 'GAME-AAA-THIET-KE', 'GAME-NPC-AI-THIET-KE-DAY-DU', 'GAME-SINH-TON-KINH-TE-DAC-TA', 'THANH-MANIFEST', 'TUONG-THANH-MANIFEST', 'CAY-QUAN-MANIFEST', 'NHA-DIADIEM-MANIFEST', 'DOHOA-MANIFEST', 'GAME-TROI-THIET-KE', 'GAME-AAA-MODEL-THANH-PHO', 'TAI-KHOAN-CAI-DAT', 'docs/gdd/', 'docs/npc-ai/'];
  const c90 = src[files.find((f) => f.startsWith('90-'))] ?? '';
  check('V7', 'tài liệu cũ có dòng trong chương 90', OLD.filter((o) => !c90.includes(o)).map((o) => `chương 90 thiếu ${o}`));
}
// V8 — phụ lục khớp mã
{
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/docs-game-gen.mjs'), '--check'], { encoding: 'utf8' });
  check('V8', 'phụ lục khớp mã', r.status === 0 ? [] : (r.stdout + r.stderr).trim().split('\n').slice(-8));
}
// V9 — nhãn trạng thái
{
  const OK = new Set(['ĐÃ CÓ', 'MỘT PHẦN', 'ĐẶC TẢ', 'ĐỀ XUẤT', 'TẦM NHÌN']);
  const errs = [];
  for (const f of files) src[f].split('\n').forEach((l, i) => { for (const m of l.matchAll(/`\[([^\]`]+)\]`/g)) if (/^[A-ZÀ-Ỹ ]+$/.test(m[1]) && !OK.has(m[1])) errs.push(`${where(f, i)}: nhãn lạ [${m[1]}]`); });
  check('V9', 'chỉ dùng năm nhãn trạng thái', errs);
}
// V10 — từ bị cấm ngoài 01, 02, 90, nhật ký
{
  const errs = [];
  for (const f of files) {
    if (/^(01|02|90)-|^NHAT-KY/.test(f)) continue;
    src[f].split('\n').forEach((l, i) => {
      if (/«văn»|1 văn =|văn = /.test(l)) return;
      if (/\d\s?văn(?![a-zA-Zà-ỹ])/.test(l)) errs.push(`${where(f, i)}: còn đơn vị «văn»`);
      if (/Huyền Giới/.test(l)) errs.push(`${where(f, i)}: còn tên «Huyền Giới»`);
    });
  }
  check('V10', 'không còn từ bị cấm', errs);
}
// V11 — ngân sách đọc
{
  const errs = [];
  const n = (f) => src[f].split('\n').length;
  if (src['README.md'] && n('README.md') > 160) errs.push(`README.md ${n('README.md')} dòng (tối đa 160)`);
  const SEC = ['Sứ mệnh', 'Đọc gì', 'Phạm vi sở hữu', 'Giao diện với bộ phận khác', 'Quy trình một việc', 'Định nghĩa «xong»', 'Lệnh hay dùng', 'Hàng việc'];
  const guides = files.filter(isGuide);
  if (guides.length !== 8) errs.push(`có ${guides.length} sổ tay bộ phận (cần 8)`);
  for (const f of guides) { if (n(f) > 200) errs.push(`${f} ${n(f)} dòng (tối đa 200)`); for (const s of SEC) if (!src[f].includes(s)) errs.push(`${f}: thiếu mục «${s}»`); }
  // người mới: README + 00 + sổ tay dài nhất ≤ 900 dòng
  const f00 = files.find((x) => x.startsWith('00-'));
  const newcomer = (src['README.md'] ? n('README.md') : 0) + (f00 ? n(f00) : 0) + Math.max(0, ...guides.map(n));
  if (newcomer > 900) errs.push(`đường đọc của người mới ${newcomer} dòng (tối đa 900)`);
  // dòng viết tay ≤ 600 ký tự (hàng bảng được miễn)
  for (const f of files) src[f].split('\n').forEach((l, i) => { if (l.length > 600 && !l.startsWith('|')) errs.push(`${where(f, i)}: dòng dài ${l.length} ký tự (tối đa 600)`); });
  check('V11', 'ngân sách đọc và khuôn sổ tay', errs);
}
// V12 — phiếu việc đủ trường
{
  const f = files.find((x) => x.startsWith('04-')); const errs = [];
  const blocks = (src[f] ?? '').split(/\n(?=### VC-\d{3})/).filter((b) => b.startsWith('### VC-'));
  for (const b of blocks) { const id = b.match(/^### (VC-\d{3})/)[1]; for (const k of ['Bộ phận:', 'Chương:', 'Hiện trạng:', 'Mong muốn:', 'Nghiệm thu:', 'Ngoài phạm vi:']) if (!b.includes('**' + k + '**')) errs.push(`${id}: thiếu «${k}»`); }
  if (!blocks.length) errs.push('không tìm thấy phiếu việc nào');
  // mọi mã VC được nhắc ở chương khác phải có phiếu
  const have = new Set(blocks.map((b) => b.match(/^### (VC-\d{3})/)[1]));
  for (const g of files) for (const m of src[g].matchAll(/VC-\d{3}/g)) if (!have.has(m[0])) errs.push(`${g}: nhắc ${m[0]} nhưng chương 04 không có phiếu`);
  check('V12', 'phiếu việc đủ trường; mã việc được nhắc đều có phiếu', [...new Set(errs)]);
}
// V13 — khung chương (manifest §2.4, §2.6): số mục mang số chương, đúng cấp tiêu đề, liền mạch;
//        chương hệ thống (10–40) mở bằng N.0 và đóng bằng ba nội dung liên kết · kiểm thử · việc mở
{
  const errs = [];
  for (const f of files.filter(isChapter)) {
    const N = +f.slice(0, 2); const L = src[f].split('\n'); const h2 = [];
    L.forEach((l, i) => {
      const m = l.match(/^(#{2,4}) (\d+(?:\.\d+)+)(?=\s)/); if (!m) return;
      const parts = m[2].split('.');
      if (+parts[0] !== N) errs.push(`${where(f, i)}: mục ${m[2]} không mang số chương ${N}`);
      if (parts.length !== m[1].length) errs.push(`${where(f, i)}: mục ${m[2]} sai cấp tiêu đề «${m[1]}»`);
      if (m[1] === '##') h2.push([+parts[1], i]);
    });
    h2.forEach(([k, i], j) => { if (j && k !== h2[j - 1][0] + 1) errs.push(`${where(f, i)}: số mục nhảy từ ${N}.${h2[j - 1][0]} sang ${N}.${k}`); });
    if (N >= 10 && N <= 40) {
      if (!h2.length || h2[0][0] !== 0) errs.push(`${f}: thiếu mục mở đầu ${N}.0`);
      const heads = L.filter((l) => /^## /.test(l)).join(' | ');
      if (!/Liên kết/.test(heads)) errs.push(`${f}: thiếu mục «Liên kết với hệ khác»`);
      if (N !== 32 && !/[Kk]iểm thử/.test(heads)) errs.push(`${f}: thiếu mục «Kiểm thử và nghiệm thu»`);
      if (!/[Vv]iệc (còn )?mở/.test(heads)) errs.push(`${f}: thiếu mục «Việc còn mở»`);
    }
  }
  check('V13', 'khung chương: số mục liền mạch, đúng cấp, đủ mục mở và đóng', errs);
}
// V14 — «Con số nhanh» của README khớp phụ lục sinh từ mã (manifest §2.3: không để số chép tay lệch mã)
{
  const errs = []; const R = src['README.md'] ?? '';
  const A = (n) => { const p = path.join(DIR, 'phu-luc', n); return fs.existsSync(p) ? rd(p) : ''; };
  const a1 = A('A1-ban-do-ma.md'), a2 = A('A2-kiem-thu.md'), a5 = A('A5-dia-diem.md'), a6 = A('A6-tai-san-3d.md');
  const vn = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const pick = (t, re) => t.match(re)?.[1];
  const json = (t, re) => { try { return JSON.parse(pick(t, re)); } catch { return null; } };
  const need = (v, phrase, from) => { if (v == null) errs.push(`không đọc được ${from}`); else if (!R.includes(phrase(v))) errs.push(`README thiếu hoặc lệch «${phrase(v)}» (theo ${from})`); };
  need(pick(a1, /Tổng: \*\*(\d+) tệp game/), (v) => `${vn(v)} mô-đun`, 'A1, số tệp game');
  need(pick(a1, /\*\*(\d+) tệp máy chủ\*\*/), (v) => `máy chủ ${v} tệp`, 'A1, số tệp máy chủ');
  need(pick(a2, /Tổng \*\*(\d+)\*\* bộ test/), (v) => `${v} bộ test`, 'A2');
  need(pick(a6, /Tổng \*\*(\d+) tệp GLB\*\*/), (v) => `${vn(v)} tệp model`, 'A6');
  need(pick(a5, /`WORLD` \| (\d+)/), (v) => `${vn(v)} × ${vn(v)} m`, 'A5, WORLD');
  need(pick(a5, /`CITY_OCT` \| (\d+)/), (v) => `${vn(v)} m`, 'A5, CITY_OCT');
  need(json(a5, /allHouses\(\)`` \| (\{[^|]*\})/)?.['tổng'], (v) => `${vn(v)} nhà`, 'A5, allHouses');
  const shops = json(a5, /cityShops\(\)`` \| (\{[^|]*\})/);
  need(shops?.['tổng'], (v) => `${vn(v)} cửa hàng thuộc ${Object.keys(shops).length - 1} loại`, 'A5, cityShops');
  const ent = json(a5, /enterables\(\)`` \| (\{[^|]*\})/);
  need(ent?.fortune, (v) => `${vn(v)} quầy thầy bói`, 'A5, enterables');
  need(ent?.temple, (v) => `${v} miếu và điện`, 'A5, enterables');
  need(pick(a5, /LISTING_COUNT`` \| (\d+)/), (v) => `${v} căn rao bán`, 'A5, LISTING_COUNT');
  check('V14', '«Con số nhanh» ở README khớp phụ lục', errs);
}

let bad = 0;
for (const r of results) { console.log(`${r.errs.length ? '✗' : '✓'} ${r.id} ${r.name}${r.errs.length ? ' — ' + r.errs.length + ' lỗi' : ''}`); for (const e of r.errs.slice(0, 12)) console.log('     ' + e); if (r.errs.length > 12) console.log(`     … còn ${r.errs.length - 12}`); if (r.errs.length) bad++; }
console.log(bad ? `\n${bad}/${results.length} mục trượt.` : `\nĐạt ${results.length}/${results.length}. ${files.length} tệp trong docs/game/.`);
process.exit(bad ? 1 : 0);
