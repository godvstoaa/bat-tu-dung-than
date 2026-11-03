// Test tiến trình: cấp, gia trì nguyên tố, VIP (src/game/progress.js) + state.xp
import assert from 'node:assert/strict';
import { levelOf, xpFor, unlocked, unlockedList, newlyUnlocked, levelInfo, vipActive } from '../src/game/progress.js';
import * as S from '../src/game/state.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };

t('Cấp theo xp, đảo ngược khớp', () => {
  assert.equal(levelOf(0), 1); assert.equal(levelOf(19), 1); assert.equal(levelOf(20), 2);
  for (let L = 1; L <= 30; L++) { assert.equal(levelOf(xpFor(L)), L); assert.equal(levelOf(xpFor(L + 1) - 1), L); }
});

t('Gia trì mở theo cấp: hào quang 2, linh khí 4, vệt 6, bay 8, pháp quang 10', () => {
  const at = (L) => unlockedList({ xp: xpFor(L) });
  assert.deepEqual(at(1), []);
  assert.deepEqual(at(2), ['aura']);
  assert.deepEqual(at(7), ['aura', 'motes', 'trail']);
  assert.deepEqual(at(8), ['aura', 'motes', 'trail', 'fly']);
  assert.deepEqual(at(10), ['aura', 'motes', 'trail', 'fly', 'halo']);
});

t('VIP còn hạn mở sớm bay + gia trì (trừ pháp quang); hết hạn thì thôi', () => {
  const now = Date.now();
  const s = { xp: 0, vip: { until: now + 86400000 } };
  assert.ok(vipActive(s, now));
  assert.ok(unlocked(s, 'fly', now)); assert.ok(unlocked(s, 'aura', now)); assert.ok(!unlocked(s, 'halo', now));
  assert.ok(!unlocked({ xp: 0, vip: { until: now - 1 } }, 'fly', now));
});

t('Báo gia trì vừa mở khi lên cấp', () => {
  assert.deepEqual(newlyUnlocked(xpFor(7), xpFor(8)).map((g) => g.id), ['fly']);
  assert.deepEqual(newlyUnlocked(0, 5), []);
  assert.equal(levelInfo({ xp: 50 }).level, 2);
});

t('State: Phúc Khí cộng vào xp; tiêu không giảm xp; người cũ được quy đổi', () => {
  const s = S.createState(new Date(2026, 10, 4));
  S.recordCase(s, { kind: 'desk', id: 'trach', name: 'x', total: 1 }, new Date(2026, 10, 4));
  assert.ok(s.xp > 0 && s.xp === s.phucKhi);
  const store = { _: {}, getItem(k) { return this._[k] ?? null; }, setItem(k, v) { this._[k] = v; } };
  const old = { ...S.createState(new Date()), phucKhi: 300 }; delete old.xp;
  store.setItem('huyenquan:v1', JSON.stringify(old));
  assert.equal(S.loadState(store).xp, 300);
});

console.log(`\n${n} test đạt`);
