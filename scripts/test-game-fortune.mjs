// v4 — thầy bói NPC (fortune-npc.js): bảng thầy, nguồn lá số (kiếp luân hồi), câu ghép chuyên môn, hạn mức khách.
import assert from 'node:assert/strict';
import * as F from '../src/game/fortune-npc.js';
import { getPersona } from '../src/game/npc-personas.js';

let n = 0; const test = (name, fn) => { fn(); n++; console.log('✓', name); };

test('mỗi thầy đủ tên, chuyên môn, lời chào, ≥ 3 câu gợi ý; persona (nếu có) tồn tại và chạy được', () => {
  for (const [id, m] of Object.entries(F.MASTERS)) {
    assert.ok(m.name && m.focus && m.greet, id);
    assert.ok(m.starters.length >= 3, id);
    if (m.persona) assert.ok(getPersona(m.persona), `persona ${m.persona} của ${id} phải có và không bị chặn runtime`);
  }
});
test('trạm nào trỏ thầy thì thầy đó có trong bảng', () => {
  for (const [st, mid] of Object.entries(F.MASTER_OF_STATION)) assert.ok(F.MASTERS[mid], `${st} → ${mid}`);
});
test('chartSource: bát tự thật → khoá year/month…; không giờ → hour null; chưa có → null', () => {
  assert.equal(F.chartSource({}), null);
  assert.equal(F.chartSource({ player: { name: 'A' } }), null);
  const s = F.chartSource({ player: { birth: { y: 1990, m: 5, d: 7, h: 9, mi: 30, gender: 'nữ' } } });
  assert.deepEqual(s, { year: 1990, month: 5, day: 7, hour: 9, minute: 30, gender: 'nữ' });
  const u = F.chartSource({ player: { birth: { y: 1990, m: 5, d: 7, h: 12, mi: 0, gender: 'nam', hourUnknown: true } } });
  assert.equal(u.hour, null); assert.equal(u.minute, null);
});
test('chartSource: kiếp luân hồi dùng lá số hư cấu, KHÔNG dùng ngày sinh thật', () => {
  const st = { player: { birth: { y: 1990, m: 5, d: 7, h: 9, mi: 30, gender: 'nữ' }, incarnation: { year: 1955, month: 2, day: 3, hour: 4, minute: 5, gender: 'nam', fictional: true } } };
  const s = F.chartSource(st);
  assert.equal(s.year, 1955); assert.equal(s.fictional, true); assert.equal(s.gender, 'nam');
});
test('framedQuestion ghép chuyên môn, cắt 300 ký tự', () => {
  const q = F.framedQuestion('phongthuy', 'Nhà tôi hướng nào?');
  assert.match(q, /Thầy Phong Thủy/); assert.match(q, /Nhà tôi hướng nào\?$/);
  assert.ok(F.framedQuestion('tubinh', 'x'.repeat(999)).length < 300 + 120);
  assert.equal(F.framedQuestion('khongco', ' hi '), 'hi');
});
test('hạn mức khách 10 câu / ngày; tài khoản không giới hạn; sang ngày reset', () => {
  let q = null;
  for (let i = 0; i < F.GUEST_DAILY; i++) { const r = F.useGuestQuota(q, '2026-11-11', false); assert.ok(r.ok); q = r.next; }
  assert.equal(F.useGuestQuota(q, '2026-11-11', false).ok, false);
  assert.equal(F.guestLeft(q, '2026-11-11', false), 0);
  assert.ok(F.useGuestQuota(q, '2026-11-11', true).ok);
  assert.equal(F.guestLeft(q, '2026-11-11', true), Infinity);
  assert.ok(F.useGuestQuota(q, '2026-11-12', false).ok);
});
console.log(`\n${n} test thầy bói NPC đạt.`);
