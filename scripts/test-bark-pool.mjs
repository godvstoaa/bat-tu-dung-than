// Test NPC-AI G0 · BARK POOL (mục 15 §15.5f; đặc tả mục 16 §16.3.3).
// Node thuần, không DOM — import thẳng module game. Chạy:
//   node scripts/test-bark-pool.mjs
import assert from 'node:assert/strict';
import { BARK_POOLS, pickBark } from '../src/game/bark-pool.js';
import { PERSONA_IDS } from '../src/game/persona-data.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };

// Từ cấm lớp hiển thị theo sách (GAME-THIET-KE-CHOT P0-1: «đại hung / tai họa /
// chết»; mục 06 §06.282 thêm «đại hạn») + biến thể chính tả. Không bark doạ.
const TU_DOA = ['đại hung', 'đại hạn', 'tai họa', 'tai hoạ', 'chết'];
// Cấm chế giễu dấu ❓ của người khác (mục 13 §4.2 — bark kiểu «người đó còn ❓ kìa»).
const TU_CHE = ['còn ❓'];
// Nhóm khách AI-light tách namespace bằng tiền tố khach_ (mục 04 §4.3).
const KHACH_AI_LIGHT = ['khach_dieuhau', 'khach_cachcuc'];
const isHan = (ch) => ch >= '\u4e00' && ch <= '\u9fff';

test('Đủ pool: 20 persona canon + 2 nhóm khách AI-light — key tách namespace đúng', () => {
  for (const id of PERSONA_IDS) {
    assert.ok(Array.isArray(BARK_POOLS[id]) && BARK_POOLS[id].length > 0, `pool persona ${id}`);
  }
  for (const k of KHACH_AI_LIGHT) assert.ok(Array.isArray(BARK_POOLS[k]), `pool khách ${k}`);
  // namespace: key khách không trùng id persona, không trùng id sảnh gốc
  for (const k of KHACH_AI_LIGHT) {
    assert.ok(!PERSONA_IDS.includes(k), `${k} không thuộc 20 persona`);
    assert.ok(!BARK_POOLS[k.slice('khach_'.length)], `${k} tách namespace khỏi id sảnh gốc "${k.slice(6)}"`);
  }
});

test('Số lượng đúng quy ước: pool persona ≥ 8 câu (rút gọn 8–12, mục 04 §4.1.1); pool khách ≥ 4 (khuôn 4–6, mục 05 §05.3)', () => {
  for (const id of PERSONA_IDS) {
    assert.ok(BARK_POOLS[id].length >= 8, `pool ${id} chỉ có ${BARK_POOLS[id].length} câu — cần ≥ 8`);
  }
  for (const k of KHACH_AI_LIGHT) {
    assert.ok(BARK_POOLS[k].length >= 4, `pool ${k} chỉ có ${BARK_POOLS[k].length} câu — cần ≥ 4`);
  }
});

test('Mọi bark ≤ 90 ký tự (hằng số 90 — luật 9, mục 04 §4.2)', () => {
  for (const [id, pool] of Object.entries(BARK_POOLS)) {
    for (const b of pool) {
      assert.ok(typeof b === 'string' && b.length > 0, `${id}: bark rỗng`);
      assert.ok(b.length <= 90, `${id}: bark ${b.length} ký tự (> 90): "${b}"`);
    }
  }
});

test('Không bark doạ / chê lá số — 0 khớp từ cấm lớp hiển thị (P0-1) + 0 «còn ❓»', () => {
  for (const [id, pool] of Object.entries(BARK_POOLS)) {
    for (const b of pool) {
      const low = b.toLowerCase();
      for (const t of TU_DOA) assert.ok(!low.includes(t), `${id}: bark chứa từ doạ "${t}": "${b}"`);
      for (const t of TU_CHE) assert.ok(!b.includes(t), `${id}: bark chế giễu dấu ❓: "${b}"`);
    }
  }
});

test('Không chữ Hán trần trong bark (luật 10 — trùng bộ lọc V6, lọc ngay ở tầng dữ liệu)', () => {
  for (const [id, pool] of Object.entries(BARK_POOLS)) {
    for (const b of pool) {
      const han = [...b].filter(isHan);
      assert.equal(han.length, 0, `${id}: bark chứa chữ Hán trần "${han.join('')}": "${b}"`);
    }
  }
});

test('pickBark: pool rỗng/id lạ → null — trạm câm, KHÔNG bịa giọng (mục 05 §05.3)', () => {
  assert.equal(pickBark('id_la_oi'), null);
  assert.equal(pickBark(''), null);
});

test('pickBark: cùng id + cùng seed → cùng bark, mọi pool đều deterministic', () => {
  for (const id of [...PERSONA_IDS, ...KHACH_AI_LIGHT]) {
    const a = pickBark(id, '2026-11-09:an0:pid7');
    const b = pickBark(id, '2026-11-09:an0:pid7');
    assert.equal(typeof a, 'string');
    assert.equal(a, b, `${id}: same-seed phải ra cùng bark`);
    assert.ok(BARK_POOLS[id].includes(a), `${id}: bark phải nguyên văn từ pool`);
    // lặp 30 lần vẫn ổn định
    for (let i = 0; i < 30; i++) assert.equal(pickBark(id, '2026-11-09:an0:pid7'), a);
  }
});

test('pickBark: đổi seed đổi vần — pool phủ được nhiều câu (không kẹt 1 câu)', () => {
  for (const id of [...PERSONA_IDS, ...KHACH_AI_LIGHT]) {
    const thay = new Set();
    for (let i = 0; i < 400; i++) thay.add(pickBark(id, `day:${i}`));
    assert.ok(thay.size >= Math.min(4, BARK_POOLS[id].length),
      `${id}: ${thay.size}/${BARK_POOLS[id].length} câu được dùng qua 400 seed — phân bố quá hẹp`);
  }
});

console.log(`\nBark pool — ${passed} test đạt.`);
