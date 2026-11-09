// Kiểm tra corpus hành vi học (behavior-kb.js + docs/knowledge/*.json):
//  (1) KHÔNG có chuỗi tiếng Anh nguyên văn ≥ 8 từ liên tiếp (chịu dấu câu: chuẩn hoá
//      phẩy/chấm/gạch thành khoảng trắng trước khi dò) — trừ tên riêng/tiêu đề
//      sách/tác giả (nhận diện bằng mẫu chữ Title-Case của tiêu đề sách/chương);
//  (2) mọi điểm tri thức đủ 6 field, không rỗng, tag hợp lệ;
//  (3) behavior-kb.js khớp 1-1 corpus gốc docs/knowledge/*.json (đếm điểm + meta sách).
// Exit 0 = pass · Exit 1 = có vi phạm.
// Chạy: node scripts/check-corpus-verbatim.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BEHAVIOR_KB, BEHAVIOR_BOOKS, pickBehaviorPoints } from '../src/engine/behavior-kb.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KNOWLEDGE_DIR = path.join(ROOT, 'docs', 'knowledge');
const MIN_RUN = 8;
const TAG_ENUM = new Set(['personality', 'emotion', 'decision', 'advice', 'stress', 'habits', 'social']);
const POINT_FIELDS = ['book', 'title', 'source', 'principle', 'appHook', 'tag'];

const errors = [];
const fail = (msg) => errors.push(msg);

// ---------- 1) Dò chuỗi tiếng Anh nguyên văn ≥ 8 từ liên tiếp ----------
// [fix reviewer] RUN_RE cũ chỉ nối từ bằng đúng 1 dấu cách — câu nguyên văn ≥8 từ có dấu
// câu bên trong (phẩy/chấm/gạch/nháy…) bị tách thành run ngắn và thoát kiểm tra. Nay
// scanVerbatim chuẩn hoá mọi dấu câu thành khoảng trắng trước khi dò run.
const RUN_RE = /[A-Za-z'’]+(?: [A-Za-z'’]+)+/g;
const SMALL = new Set(['of', 'the', 'and', 'in', 'to', 'a', 'an', 'or', 'on', 'at', 'by', 'for', 'with', 'from']);

// Tiêu đề sách/chương thường viết Title-Case (từ nhỏ đứng giữa được hạ). Văn xuôi
// nguyên văn thì phần lớn từ thường → bị bắt. Đây là cửa exempt cho tên riêng/tiêu đề.
// Ngưỡng 0.6 (trước 0.8): chuẩn hoá dấu câu làm danh sách nguồn trích kiểu
// «(SuperSummary, ReadingGraphics, Summrize, review Kim Tasso, nghiên cứu…)» dính rác
// ASCII của chữ Việt («u» từ «câu», «nghi» từ «nghiên») thành run 60-70% viết hoa —
// hợp lệ, không phải nguyên văn. Văn xuôi thật luôn < 40% viết hoa.
function looksLikeTitle(words) {
  const capped = words.filter((w) => /^[A-Z]/.test(w) || SMALL.has(w.toLowerCase()));
  return capped.length / words.length >= 0.6;
}

// Run đa số là identifier code (camelCase — ví dụ comment liệt kê tham số
// «{dayGan, dayZhi, yearZhi, …}» bị gộp bởi dấu phẩy sau chuẩn hoá) — không phải
// văn xuôi nguyên văn. Chỉ áp cho scan allowTitles (metadata/raw literal), không áp
// cho title/principle/appHook (nội dung ship ra user — vẫn bắt nếu ≥8 từ).
function looksLikeCodeIds(words) {
  const ids = words.filter((w) => /^[a-z]+[A-Z]/.test(w));
  return ids.length / words.length >= 0.5;
}

function scanVerbatim(text, label, opts = {}) {
  if (!text || typeof text !== 'string') return;
  // [fix reviewer] chuẩn hoá dấu câu → khoảng trắng, gộp khoảng trắng: run nguyên văn
  // không còn bị phẩy/chấm/gạch/ngoặc ngắt giữa câu. Mẫu tự không-ASCII giữ nguyên nên
  // chữ Việt vẫn ngắt run như cũ (RUN_RE chỉ khớp ASCII).
  const norm = text.replace(/[^\p{L}\p{N}'’\s]/gu, ' ').replace(/\s+/g, ' ');
  const re = new RegExp(RUN_RE.source, 'g');
  let m;
  while ((m = re.exec(norm)) !== null) {
    const words = m[0].split(' ');
    if (words.length < MIN_RUN) continue;
    if (opts.allowTitles && (looksLikeTitle(words) || looksLikeCodeIds(words))) continue; // tiêu đề sách/chương / identifier code — được phép
    fail(`${label}: chuỗi tiếng Anh nguyên văn ${words.length} từ — «${m[0].slice(0, 100)}…»`);
  }
}

// ---------- 2) Kiểm field/rỗng/tag ----------
function checkPoint(p, label, hasBook) {
  for (const f of hasBook ? POINT_FIELDS : ['title', 'source', 'principle', 'appHook', 'tag']) {
    if (!p[f] || !String(p[f]).trim()) fail(`${label}: thiếu hoặc rỗng field «${f}»`);
  }
  if (p.tag !== undefined && !TAG_ENUM.has(p.tag)) fail(`${label}: tag không hợp lệ «${p.tag}» (enum: ${[...TAG_ENUM].join('/')})`);
}

// ---------- 3) Đọc corpus gốc ----------
const jsons = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.json')).sort();
const corpusBooks = [];
const corpusPointCount = {};
for (const f of jsons) {
  const j = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, f), 'utf8'));
  corpusBooks.push(j);
  corpusPointCount[j.id] = j.points.length;
  // points: strict (principle/appHook/title phải tiếng Việt thuần) — không exempt
  j.points.forEach((p, i) => {
    checkPoint(p, `${f} #${i + 1}`, false);
    scanVerbatim(p.title, `${f} #${i + 1} title`);
    scanVerbatim(p.principle, `${f} #${i + 1} principle`);
    scanVerbatim(p.appHook, `${f} #${i + 1} appHook`);
    // source: dẫn chứng chương/sách — exempt tiêu đề Title-Case
    scanVerbatim(p.source, `${f} #${i + 1} source`, { allowTitles: true });
  });
  // metadata sách: title/author/why — exempt tiêu đề/tác giả
  scanVerbatim(j.title, `${f} book title`, { allowTitles: true });
  scanVerbatim(j.author, `${f} author`, { allowTitles: true });
  scanVerbatim(j.why, `${f} why`, { allowTitles: true });
}

// ---------- 4) Kiểm behavior-kb.js (module export + raw string literals) ----------
if (BEHAVIOR_KB.length !== Object.values(corpusPointCount).reduce((a, b) => a + b, 0)) {
  fail(`behavior-kb.js: BEHAVIOR_KB có ${BEHAVIOR_KB.length} điểm ≠ corpus ${Object.values(corpusPointCount).reduce((a, b) => a + b, 0)} điểm`);
}
if (BEHAVIOR_BOOKS.length !== corpusBooks.length) fail(`behavior-kb.js: ${BEHAVIOR_BOOKS.length} sách ≠ corpus ${corpusBooks.length} sách`);
for (const b of BEHAVIOR_BOOKS) {
  if (corpusPointCount[b.id] !== undefined && b.points !== corpusPointCount[b.id]) {
    fail(`behavior-kb.js: sách ${b.id} ghi ${b.points} điểm ≠ corpus ${corpusPointCount[b.id]}`);
  }
  scanVerbatim(b.title, `BEHAVIOR_BOOKS ${b.id} title`, { allowTitles: true });
  scanVerbatim(b.author, `BEHAVIOR_BOOKS ${b.id} author`, { allowTitles: true });
}
BEHAVIOR_KB.forEach((p, i) => {
  checkPoint(p, `BEHAVIOR_KB #${i + 1}`, true);
  scanVerbatim(p.title, `BEHAVIOR_KB #${i + 1} title`);
  scanVerbatim(p.principle, `BEHAVIOR_KB #${i + 1} principle`);
  scanVerbatim(p.appHook, `BEHAVIOR_KB #${i + 1} appHook`);
  scanVerbatim(p.source, `BEHAVIOR_KB #${i + 1} source`, { allowTitles: true });
});
// Raw string literals + comment trong file — bắt phần không qua module export (comment mới, chuỗi sửa tay)
const kbRaw = fs.readFileSync(path.join(ROOT, 'src', 'engine', 'behavior-kb.js'), 'utf8');
const RAW_STR_RE = /\/\/[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
let rm;
while ((rm = RAW_STR_RE.exec(kbRaw)) !== null) scanVerbatim(rm[0], 'behavior-kb.js raw', { allowTitles: true }); // exempt tiêu đề sách/chương như mọi trường khác

// ---------- 4b) Đồng bộ NỘI DUNG corpus ↔ KB (không chỉ đếm số) ----------
// Mỗi điểm JSON phải có đúng 1 điểm KB cùng title và khớp principle/appHook/source/tag —
// sửa tay một bên mà quên bên kia sẽ fail. Field `dup` (runtime selection) không so.
const kbByTitle = new Map();
for (const p of BEHAVIOR_KB) {
  if (kbByTitle.has(p.title)) fail(`BEHAVIOR_KB: title trùng «${p.title}» — không thể đồng bộ 1-1 với corpus`);
  kbByTitle.set(p.title, p);
}
for (const book of corpusBooks) {
  for (const p of book.points) {
    const kb = kbByTitle.get(p.title);
    if (!kb) { fail(`Đồng bộ: corpus ${book.id} điểm «${p.title}» không có trong BEHAVIOR_KB`); continue; }
    for (const f of ['principle', 'appHook', 'source', 'tag']) {
      if (kb[f] !== p[f]) fail(`Đồng bộ: điểm «${p.title}» field «${f}» lệch giữa corpus JSON và BEHAVIOR_KB`);
    }
  }
}
// Smoke: pickBehaviorPoints chạy được, đúng cap, chỉ trả điểm hợp lệ
const picked = pickBehaviorPoints({ dayGan: 'Giáp', dayZhi: 'Ngọ', patternName: 'test' }, 8);
if (!Array.isArray(picked) || picked.length > 8 || picked.some((p) => !TAG_ENUM.has(p.tag))) {
  fail(`pickBehaviorPoints: trả ${Array.isArray(picked) ? picked.length : 'non-array'} điểm — phải ≤8 và tag hợp lệ`);
}

// ---------- 5) Thống kê + kết luận ----------
const tagCount = {};
for (const p of BEHAVIOR_KB) tagCount[p.tag] = (tagCount[p.tag] || 0) + 1;
console.log(`Corpus: ${corpusBooks.length} sách · ${BEHAVIOR_KB.length} điểm · tags: ${JSON.stringify(tagCount)}`);
console.log(`Ngưỡng: chuỗi tiếng Anh nguyên văn ≥ ${MIN_RUN} từ (exempt tiêu đề Title-Case) · field 6/6 · tag enum · khớp corpus 1-1`);
if (errors.length) {
  console.log(`\n✗ FAIL — ${errors.length} vi phạm:`);
  for (const e of errors) console.log('  - ' + e);
  process.exit(1);
}
console.log('\n✓ PASS — không có nguyên văn tiếng Anh ≥8 từ, đủ field, KB khớp corpus.');
