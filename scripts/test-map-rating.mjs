// Test map-rating.js — 6 mức engine (liunian-pro.js:304-309) → 3 cụm từ mềm
// (docs/npc-ai/06-bo-loc-hau-xu-ly-v1-v8.md §6.2 «mẫu bắt buộc» +
// docs/npc-ai/16-chien-luoc-test.md §16.3.5): ngưỡng đúng, biên ±1 không nhảy
// cụm sai, ngoài thang → mức an toàn gần nhất, không mất cụm, câu chính không
// chữ cấm, mirror đồng bộ với engine thật trên lá số thật.
// Node thuần, không DOM — khuôn scripts/test-game-thay-mo-rong.mjs.
// Chạy: node scripts/test-map-rating.mjs
import assert from 'node:assert/strict';
import { FORBIDDEN, RATING_LEVELS, TONE_OF, SOFT_LABELS, TONE_ORDER, ratingOfScore, mapRating } from '../src/game/map-rating.js';
import { analyze } from '../src/engine/chart.js';
import { analyzeLiunianDeep } from '../src/engine/liunian-pro.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };

const YEAR = 2026;

// Tham chiếu độc lập — nguyên văn if/else của liunian-pro.js:304-309
const ref304 = (s) => (s >= 70 ? 'Đại cát' : s >= 56 ? 'Cát' : s >= 36 ? 'Bình' : s >= 22 ? 'Hơi kỵ' : s >= 10 ? 'Hung' : 'Đại hung');

test('Thang 6 mức: đủ 6 mức, NEO đúng ngưỡng 70/56/36/22/10 của liunian-pro.js:304-309', () => {
  assert.deepEqual(RATING_LEVELS.map((l) => l.rating), ['Đại cát', 'Cát', 'Bình', 'Hơi kỵ', 'Hung', 'Đại hung'], 'đủ và đúng thứ tự 6 mức');
  assert.deepEqual(RATING_LEVELS.slice(0, 5).map((l) => l.min), [70, 56, 36, 22, 10], '5 ngưỡng trên đúng sách');
  // điểm NGAY NGƯỠNG và NGƯỠNG-1 rơi đúng mức engine
  assert.equal(ratingOfScore(70), 'Đại cát'); assert.equal(ratingOfScore(69), 'Cát');
  assert.equal(ratingOfScore(56), 'Cát');     assert.equal(ratingOfScore(55), 'Bình');
  assert.equal(ratingOfScore(36), 'Bình');    assert.equal(ratingOfScore(35), 'Hơi kỵ');
  assert.equal(ratingOfScore(22), 'Hơi kỵ');  assert.equal(ratingOfScore(21), 'Hung');
  assert.equal(ratingOfScore(10), 'Hung');    assert.equal(ratingOfScore(9), 'Đại hung');
});

test('Biên ±1: quét TOÀN thang 2–98 khớp từng điểm với if/else gốc 304-309', () => {
  for (let s = 2; s <= 98; s++) assert.equal(ratingOfScore(s), ref304(s), `score ${s} map sai mức`);
  // ±1 quanh mỗi đường biên: b và b+1 giữ cùng cụm, b-1 rơi đúng cụm mức dưới
  const CUM = { 'Đại cát': 'Thuận — nên làm', 'Cát': 'Thuận — nên làm', 'Bình': 'Bình thường', 'Hơi kỵ': 'Nên thủ, giữ sức', 'Hung': 'Nên thủ, giữ sức', 'Đại hung': 'Nên thủ, giữ sức' };
  for (const b of [70, 56, 36, 22, 10]) {
    for (const d of [-1, 0, 1]) {
      const s = b + d;
      if (s < 2 || s > 98) continue;
      assert.equal(mapRating(ratingOfScore(s), s)['nhãn'], CUM[ref304(s)], `biên ${s} (b=${b}${d >= 0 ? '+' : ''}${d})`);
    }
  }
});

test('mapRating: 6 mức gốc → đúng 3 cụm, KHÔNG mất cụm, rating kỹ thuật còn nguyên trong details', () => {
  const BANG = [['Đại cát', 'Thuận — nên làm'], ['Cát', 'Thuận — nên làm'], ['Bình', 'Bình thường'], ['Hơi kỵ', 'Nên thủ, giữ sức'], ['Hung', 'Nên thủ, giữ sức'], ['Đại hung', 'Nên thủ, giữ sức']];
  for (const [rt, label] of BANG) {
    const m = mapRating(rt, 50);
    assert.equal(m['nhãn'], label, `${rt} → «${label}»`);
    assert.equal(m.details.rating, rt, `${rt}: rating gốc phải còn nguyên trong details (tra cứu kỹ thuật)`);
    assert.equal(m.details.score, 50);
  }
  assert.equal(new Set(BANG.map((x) => x[1])).size, 3, 'cả 3 cụm đều có mức gốc map vào — không cụm nào biến mất');
  assert.deepEqual(TONE_ORDER, ['thuan', 'binh', 'giu'], 'order kề thang 0,4/bậc giữ khuôn P0-2');
  assert.equal(TONE_OF['Đại cát'], 'thuan'); assert.equal(TONE_OF['Đại hung'], 'giu');
});

test('Giá trị ngoài thang → mức an toàn gần nhất (kẹp 2–98 đúng liunian-pro.js:299)', () => {
  assert.equal(ratingOfScore(9877), 'Đại cát');   // kẹp 98
  assert.equal(ratingOfScore(100), 'Đại cát');
  assert.equal(ratingOfScore(-50), 'Đại hung');   // kẹp 2
  assert.equal(ratingOfScore(0), 'Đại hung');
  assert.equal(ratingOfScore(2.4), 'Đại hung');   // làm tròn 2
  assert.equal(ratingOfScore(97.6), 'Đại cát');   // làm tròn 98
  assert.equal(ratingOfScore(69.5), 'Đại cát');   // làm tròn 70 → đúng mức biên
  // rating lạ / thiếu → «Bình thường» (mức an toàn — khuôn softRating namhan.js:28-29)
  assert.equal(mapRating('Gì đó lạ', 50)['nhãn'], 'Bình thường');
  assert.equal(mapRating(null, null)['nhãn'], 'Bình thường');
  // rating thiếu nhưng CÓ điểm → suy theo đúng thang engine
  assert.equal(mapRating(null, 71)['nhãn'], 'Thuận — nên làm');
  assert.equal(mapRating(null, 71).details.rating, 'Đại cát', 'details giữ mức kỹ thuật đã suy');
  assert.equal(mapRating(undefined, 9)['nhãn'], 'Nên thủ, giữ sức');
  assert.equal(mapRating(undefined, 9).details.rating, 'Đại hung');
});

test('Lớp hiển thị KHÔNG chữ cấm; chữ kỹ thuật chỉ trong <details>', () => {
  for (const rt of ['Đại cát', 'Cát', 'Bình', 'Hơi kỵ', 'Hung', 'Đại hung', 'Lạ', null]) {
    const m = mapRating(rt, 42);
    for (const w of FORBIDDEN) assert.ok(!m['nhãn'].toLowerCase().includes(w), `nhãn «${m['nhãn']}» dính chữ cấm «${w}»`);
    assert.ok(!/đại hạn|doạ|dọa/i.test(m['nhãn']), 'nhãn không dùng ngôn ngữ doạ (SPEC §11 mục 3)');
    assert.ok(m.details.ghi.includes('<details>'), 'ghi chú kỹ thuật chỉ dành cho <details>');
    assert.ok(Object.values(SOFT_LABELS).includes(m['nhãn']), `nhãn «${m['nhãn']}» phải nằm trong 3 cụm mềm`);
  }
});

test('Đối chiếu engine THẬT: ratingOfScore đồng bộ analyzeLiunianDeep trên lá số thật, nhiều năm', () => {
  for (const birth of [[1990, 5, 15, 8, 30, 'nam'], [1984, 11, 2, 22, 0, 'nữ'], [1975, 3, 21, 6, 30, 'nam'], [2002, 7, 9, 15, 45, 'nữ']]) {
    const R = analyze(...birth, YEAR);
    for (const y of [YEAR, YEAR + 1, YEAR + 4, YEAR + 9]) {
      const d = analyzeLiunianDeep(R, y);
      assert.equal(ratingOfScore(d.score), d.rating, `sinh ${birth[0]} · năm ${y} · điểm ${d.score}: mirror lệch engine`);
      const m = mapRating(d.rating, d.score);
      assert.ok(Object.values(SOFT_LABELS).includes(m['nhãn']), 'nhãn nằm trong 3 cụm');
      assert.equal(m.details.score, d.score, 'điểm kỹ thuật còn nguyên trong details');
    }
  }
});

console.log(`\nmap-rating — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
