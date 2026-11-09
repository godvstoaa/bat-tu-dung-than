// Test story-gen.js — story generator cho khách procedural (docs/npc-ai/08
// §8.7 khung + docs/npc-ai/16-chien-luoc-test.md §16.3.4): same-seed
// deterministic nguyên văn, tách pid, tách slot, chuyện gắn dữ kiện lá số thật
// (khí hậu analyzeHanNuan · cách cục R.pattern/geShen), R null/undefined →
// fallback an toàn, fuzz 100 hạt không ném lỗi + duyệt từ không sinh T6 +
// không chữ Hán trong lời khách (V6). Node thuần, không DOM — khuôn
// scripts/test-game-thay-mo-rong.mjs. Chạy: node scripts/test-story-gen.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeStory, storySeed } from '../src/game/story-gen.js';
import { makeNpc } from '../src/game/npc.js';
import { analyze } from '../src/engine/chart.js';
import { analyzeHanNuan } from '../src/engine/han-nuan.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };

const YEAR = 2026;
// Khuôn halls.js:26-29 — khách + lá số THẬT đúng cách builder dựng npcR
const mk = (seed, slot, pid) => {
  const npc = makeNpc(seed, YEAR);
  const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, YEAR);
  return makeStory(seed, R, slot, pid, npc, YEAR);
};
const textOf = (st) => [st.intro, st.ask, st.thanks.top, st.thanks.mid, st.thanks.low, st.thanks.recall].join(' ');

test('T1 — same seed ⇒ same story NGUYÊN VĂN; storyId = storySeed(seed, slot, pid); có danh xưng honorific', () => {
  const seed = '2026-11-08:0:pid-test-1'; // `${d}:${i}:${pid}` — main.js:56
  const a = mk(seed, 'an0', 'pid-test-1');
  const b = mk(seed, 'an0', 'pid-test-1');
  assert.deepEqual(a, b, 'hai lần gọi phải ra cùng mọi trường, kể cả thanks.recall');
  assert.equal(JSON.stringify(a), JSON.stringify(b), 'nguyên văn bằng từng ký tự');
  assert.equal(a.storyId, storySeed(seed, 'an0', 'pid-test-1'));
  assert.ok(Number.isInteger(a.storyId) && a.storyId >= 0, 'storyId là hash 32-bit của npc.js:5-9');
  // danh xưng từ honorific — npc.js:33-38
  assert.ok(['Bạn', 'Anh', 'Chị', 'Chú', 'Cô', 'Bác', 'Bà'].some((h) => a.intro.includes(h)), `intro phải gọi danh xưng (thấy «${a.intro}»)`);
  assert.ok(a.intro.length > 20 && a.ask.length > 20, 'intro/ask không rỗng');
  assert.ok(a.thanks.recall.length > 0 && a.thanks.top.length > 0, 'thanks đủ mức + recall');
});

test('T2 — cùng seed, pid KHÁC ⇒ chuyện khác; quét 1000 pid không va chạm storyId', () => {
  const seed = '2026-11-08:1:an1';
  const a = mk(seed, 'an1', 'pid-A');
  const b = mk(seed, 'an1', 'pid-B');
  assert.notEqual(a.storyId, b.storyId, 'pid khác → hạt khác → storyId khác');
  assert.notDeepEqual(a, b, 'story theo hạt pid, không dùng chung bộ nhớ cục');
  const ids = new Set(); let dup = 0;
  for (let i = 0; i < 1000; i++) {
    const h = storySeed(seed, 'an1', `pid-${i}`);
    if (ids.has(h)) dup++;
    ids.add(h);
  }
  assert.equal(dup, 0, `va chạm storyId trên 1000 pid (thấy ${dup}) — phải in ra, không được câm`);
});

test('T3 — cùng seed + pid, slot KHÁC ⇒ chuyện khác (3 khe sân + các sảnh)', () => {
  const seed = '2026-11-08:2:pid-slot';
  for (const [s1, s2] of [['an0', 'an1'], ['an1', 'an2'], ['an0', 'an2'], ['tuvi', 'tuongphap'], ['trach', 'duongtrach'], ['dieuhau', 'cachcuc'], ['hophon-A', 'hophon-B']]) {
    const x = mk(seed, s1, 'p');
    const y = mk(seed, s2, 'p');
    assert.notEqual(x.storyId, y.storyId, `${s1} vs ${s2}: hạt khác theo slot`);
    assert.notDeepEqual(x, y, `${s1} vs ${s2}: phải ra chuyện khác`);
  }
});

test('T4 — Điều Hậu: điều kiện chọn tệp là điều kiện ĐO — khách 寒→DH-hàn, 暖→DH-noãn, 湿→DH-thấp (intro nhắc đúng mẩu)', () => {
  const KEY = '2026-11-08:dieuhau';
  const found = {};
  for (let i = 0; i < 80 && Object.keys(found).length < 3; i++) {
    const npc = makeNpc(`dh:${KEY}:${i}`, YEAR); // khuôn hạt builder — halls.js:57
    const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, YEAR);
    const hn = analyzeHanNuan(R);
    const slotTemp = hn.temperature === '寒' ? '寒' : hn.temperature === '暖' ? '暖' : null;
    const key = slotTemp || (hn.humidity === '湿' ? '湿' : null); // 湿 chỉ tính khi nhiệt đã cân — halls.js:72
    if (!key || found[key]) continue;
    const st = makeStory(`dh:${KEY}:${i}`, R, 'dieuhau', 'p-dh', npc, YEAR);
    found[key] = { st, hn };
  }
  assert.ok(found['寒'], 'trong 80 hạt phải có khách hàn (bộ lọc 75% của halls.js:55 kéo lệch)');
  assert.ok(found['暖'], 'trong 80 hạt phải có khách noãn');
  assert.ok(found['湿'], 'trong 80 hạt phải có khách thấp');
  assert.equal(found['寒'].st.tags[0], 'DH-han-khat-nuoc');
  assert.ok(found['寒'].st.intro.includes('lạnh'), 'khách hàn nói chuyện lạnh (mẩu DH-hàn — bảng §8.4.1 dòng 8)');
  assert.equal(found['暖'].st.tags[0], 'DH-noan-can-lua');
  assert.ok(found['暖'].st.intro.includes('nóng'), 'khách noãn nói chuyện nóng');
  assert.equal(found['湿'].st.tags[0], 'DH-thap-can-kho');
  assert.ok(found['湿'].st.intro.includes('ẩm'), 'khách thấp nói chuyện ẩm');
  // khách cân bằng (nếu gặp) → tệp an toàn DH-can-bang, không văng
  const npc0 = makeNpc('dh:can-bang:0', YEAR);
  const R0 = analyze(npc0.year, npc0.month, npc0.day, npc0.hour, npc0.minute, npc0.gender, YEAR);
  const hn0 = analyzeHanNuan(R0);
  const st0 = makeStory('dh:can-bang:0', R0, 'dieuhau', 'p-dh', npc0, YEAR);
  assert.ok(['DH-han-khat-nuoc', 'DH-noan-can-lua', 'DH-thap-can-kho', 'DH-can-bang'].includes(st0.tags[0]));
  if (hn0.temperature === '平' && hn0.humidity === '平') assert.equal(st0.tags[0], 'DH-can-bang');
});

test('T5 — Cách Cục: chuyện gắn pattern/geShen của lá số (tags đúng nhánh normal/bại, intro nhắc tên cách + cách thần Hán Việt)', () => {
  let npc, R, seedCC = 'cc:2026-11-08:0';
  for (let i = 0; i < 40; i++) { // khuôn vòng thử builder — halls.js:244-247
    seedCC = `cc:2026-11-08:${i}`;
    npc = makeNpc(seedCC, YEAR);
    R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, YEAR);
    if (R.pattern?.vi) break;
  }
  assert.ok(R.pattern?.vi, 'trong 40 hạt phải có khách có tên cách');
  const st = makeStory(seedCC, R, 'cachcuc', 'p-cc', npc, YEAR);
  assert.equal(st.tags[0], R.pattern.type === 'normal' ? 'CC-cach-thuong' : 'CC-bai-cach-co-hau', 'nhánh theo R.pattern.type — halls.js:246');
  assert.ok(st.intro.includes(R.pattern.vi), `intro phải nhắc tên cách «${R.pattern.vi}» (dữ kiện pattern — halls.js:254)`);
  if (R.pattern.type === 'normal') assert.ok(st.intro.includes('cách thần'), 'cách thường nhắc cách thần (geShen — dịch Hán Việt, V6)');
  // bại cách (type khác normal) vẫn có chuyện — mở lọc dòng 12 bảng §8.4.1, đối chiếu mục 09
  let npcB, RB, seedB = 'cc-bai:0';
  for (let i = 0; i < 40; i++) {
    seedB = `cc-bai:${i}`;
    npcB = makeNpc(seedB, YEAR);
    RB = analyze(npcB.year, npcB.month, npcB.day, npcB.hour, npcB.minute, npcB.gender, YEAR);
    if (RB.pattern && RB.pattern.type !== 'normal' && RB.pattern.vi) break;
    RB = null;
  }
  if (RB) {
    const stB = makeStory(seedB, RB, 'cachcuc', 'p-cc', npcB, YEAR);
    assert.equal(stB.tags[0], 'CC-bai-cach-co-hau', 'bại cách → tệp riêng CÓ HẬU');
    assert.ok(stB.intro.includes(RB.pattern.vi), 'bại cách vẫn nhắc đúng tên cách');
  }
});

test('T6 — R null/undefined/lạ → fallback an toàn, KHÔNG crash (thanks.recall rơi bậc bình thường)', () => {
  for (const R of [null, undefined]) {
    const st = makeStory('fb:1', R, 'an0', 'p1', undefined, YEAR);
    assert.ok(st.tags[0].startsWith('CD-'), `R null ở sân → vẫn tệp chủ đề an toàn theo npc.topic (thấy ${st.tags[0]})`);
    assert.ok(st.intro.length > 20 && st.ask.length > 20 && st.thanks.recall.length > 0);
    assert.equal(st.thanks.recall, 'Năm nay bình thường, tôi làm chậm mà chắc.', 'không có lá số → recall bậc bình thường');
  }
  // khách thiếu topic → tệp mặc định CD-chung của bảng §8.4.3
  assert.deepEqual(makeStory('fb:1b', null, 'an0', 'p1', { call: 'Anh Test', job: 'thợ may' }, YEAR).tags, ['CD-chung']);
  assert.equal(makeStory('fb:2', null, 'dieuhau', 'p', undefined, YEAR).tags[0], 'DH-can-bang', 'R null ở Điều Hậu → khí hậu cân (nhánh an toàn sảnh)');
  assert.equal(makeStory('fb:3', {}, 'cachcuc', 'p', undefined, YEAR).tags[0], 'CC-bai-cach-co-hau', 'R rỗng (không pattern) → nhánh an toàn');
  assert.ok(makeStory('fb:4', {}, 'dieuhau', 'p', undefined, YEAR).tags[0] === 'DH-can-bang', 'R rỗng ở Điều Hậu không văng (bọc lỗi engine)');
  assert.ok(['DT-mua-cho-ai', 'DT-ai-mat-ngu'].includes(makeStory('fb:5', null, 'duongtrach', 'p', undefined, YEAR).tags[0]));
  assert.equal(makeStory('fb:6', null, 'hophon-A', 'p', undefined, YEAR).tags[0], 'HH-trung', 'thiếu hhRating → nhánh trung tính');
  assert.ok(makeStory('fb:7', { hhRating: 'Hợp' }, 'hophon-A', 'p', undefined, YEAR).thanks.top.includes('bổ nhau'), 'rating Hợp → nhánh cảm ơn riêng');
  assert.ok(makeStory('fb:8', { hhRating: 'Khắc' }, 'hophon-B', 'p', undefined, YEAR).thanks.top.includes('nói chuyện với nhau'), 'rating Khắc → mức nền case-ui.js:472');
});

test('T7 — fuzz 100 hạt × 11 slot: không seed nào ném lỗi; từ vựng KHÔNG sinh T6; không chữ Hán trong lời khách (V6)', () => {
  const T6_WORDS = ['chết', 'bệnh', 'ung thư', 'đột quỵ', 'tai nạn', 'ly hôn', 'tai họa', 'tai hoạ', 'đại hạn', 'đại hung', 'cờ bạc', 'tài xỉu'];
  const SLOTS = ['an0', 'an1', 'an2', 'dieuhau', 'tuvi', 'tuongphap', 'cachcuc', 'hophon-A', 'hophon-B', 'trach', 'duongtrach'];
  const seen = new Set();
  for (let i = 0; i < 100; i++) {
    const slot = SLOTS[i % SLOTS.length];
    const seed = `2026-11-08:${i % 3}:fuzz-${i}`;
    const st = mk(seed, slot, `pid-fuzz`); // bảng §8.4.1 rơi nhánh mặc định an toàn thay vì throw
    assert.ok(Number.isInteger(st.storyId));
    assert.ok(st.tags.length === 1 && typeof st.tags[0] === 'string' && st.tags[0]);
    const text = textOf(st);
    assert.ok(text.length > 60, `seed ${seed} (${slot}): chuyện không rỗng`);
    for (const w of T6_WORDS) assert.ok(!text.toLowerCase().includes(w), `chuyện «${text.slice(0, 40)}…» dính từ cấm T6 «${w}»`);
    assert.ok(!/[\u4e00-\u9fff]/.test(text), `lời khách không chữ Hán trần (V6): «${text.slice(0, 40)}…»`);
    seen.add(st.tags[0]);
  }
  assert.ok(seen.size >= 8, `phủ đủ nhiều tệp hoàn cảnh (thấy ${seen.size}: ${[...seen].join(', ')})`);
});

test('T8 — gate G0: nguồn 2 module không đụng DOM / mạng / ai.js / nguồn ngẫu nhiên trực tiếp', () => {
  for (const f of ['src/game/story-gen.js', 'src/game/map-rating.js']) {
    const src = fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.ok(!/document\s*\.|window\.|localStorage/.test(src), `${f} đụng DOM`);
    assert.ok(!/net\.js|protocol\.js|engine\/ai\.js/.test(src), `${f} import mạng/AI`);
    assert.ok(!/Math\.random|Date\.now/.test(src), `${f} dùng nguồn ngẫu nhiên/đồng hồ trực tiếp`);
  }
});

console.log(`\nstory-gen — ${passed} test đạt${process.exitCode ? ' (CÓ FAIL)' : ''}.`);
