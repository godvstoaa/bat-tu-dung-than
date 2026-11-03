// Test địa hình Huyền Giới (src/game/terrain.js). Chạy: node scripts/test-terrain.mjs
import assert from 'node:assert/strict';
import * as T from '../src/game/terrain.js';
let passed = 0;
const test = (n, f) => { try { f(); passed++; console.log('✓', n); } catch (e) { console.error('✗', n, '\n ', e.message); process.exitCode = 1; } };

test('Huyền Thành phẳng ở y = 0 quanh quán (bán kính 150)', () => {
  for (let i = 0; i < 200; i++) { const a = i * 0.7, d = (i % 10) * 15; assert.ok(Math.abs(T.heightAt(Math.cos(a) * d, Math.sin(a) * d)) < 0.5, `lệch tại ${d}`); }
});
test('Đỉnh tông môn cao > 300, hồ thấp hơn mực nước, rìa là biển mây', () => {
  assert.ok(T.heightAt(-620, -560) > 300, 'Tử Bình');
  assert.ok(T.heightAt(-600, 600) > 280, 'Trích Thiên');
  assert.ok(T.heightAt(620, 620) < T.WATER, 'hồ');
  assert.ok(T.heightAt(1010, 0) < -40, 'rìa');
});
test('Sông thấp hơn mực nước dọc lòng sông', () => {
  for (const [x, z] of T.RIVER.slice(1, -1)) assert.ok(T.heightAt(x, z) < T.WATER, `${x},${z}`);
});
test('Hàm tất định (cùng toạ độ → cùng độ cao)', () => { assert.equal(T.heightAt(123.4, -567.8), T.heightAt(123.4, -567.8)); });
test('Đi bộ: chặn nước sâu + vách dốc, cho đi trên cao nguyên', () => {
  assert.equal(T.walkable(620, 620), false);
  assert.equal(T.walkable(10, 10, 9, 10), true);
  let blocked = 0; for (let i = 0; i < 400; i++) { const x = -620 + i, z = -560; if (!T.walkable(x + 1, z, x, z)) blocked++; } assert.ok(blocked > 0, 'phải có chỗ dốc không leo được');
});
test('Rừng: không cây trong thành, có cây ngoài thành', () => {
  assert.equal(T.treeDensity(50, 50), 0);
  let n = 0; for (let x = -900; x < 900; x += 40) for (let z = -900; z < 900; z += 40) if (T.treeDensity(x, z) > 0.4) n++;
  assert.ok(n > 200, `chỉ ${n} điểm có rừng`);
});
test('Hiệu năng heightAt: 50k lần < 400ms', () => {
  const t0 = performance.now(); let s = 0; for (let i = 0; i < 50000; i++) s += T.heightAt((i * 37) % 2000 - 1000, (i * 91) % 2000 - 1000); const ms = performance.now() - t0;
  assert.ok(ms < 400, `${ms.toFixed(0)}ms`); console.log(`   (${ms.toFixed(0)}ms)`);
});
console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
