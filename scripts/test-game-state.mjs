// Kiểm tầng logic Huyền Quán (spec docs/GAME-HUYEN-QUAN-SPEC.md, tiêu chí A4, A8, A9, A10).
// Chạy: node scripts/test-game-state.mjs
import assert from 'node:assert/strict';
import * as S from '../src/game/state.js';
import { findPath, blockedAt, STATIONS, START, nearestStation, ROOMS, roomAt } from '../src/game/world.js';
import { analyze } from '../src/engine/chart.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };
const day = (s, h = 10) => new Date(`${s}T${String(h).padStart(2, '0')}:00:00`);

function memStore() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
}

test('Phúc Khí một-lần-mỗi-ngày + reset khi sang ngày', () => {
  const s = S.createState(day('2026-11-03'));
  assert.equal(S.grantDaily(s, 'lich', day('2026-11-03')), 2);
  assert.equal(S.grantDaily(s, 'lich', day('2026-11-03', 20)), 0);
  assert.equal(S.grantDaily(s, 'lich', day('2026-11-04')), 2);
  assert.equal(s.phucKhi, 4);
});

test('Trà tối đa 15 Phúc Khí/ngày, tổng phút vẫn cộng đủ', () => {
  const s = S.createState(day('2026-11-03'));
  const now = day('2026-11-03');
  assert.equal(S.addTeaMinutes(s, 10, now), 10);
  assert.equal(S.addTeaMinutes(s, 10, now), 5);
  assert.equal(S.addTeaMinutes(s, 3, now), 0);
  assert.equal(s.tea.totalMin, 23);
  assert.equal(S.addTeaMinutes(s, 0.6, now), 0, 'dưới 1 phút không tính');
  assert.equal(S.addTeaMinutes(s, 4, day('2026-11-04')), 4);
});

test('Xăm: tối đa 3 thẻ nhận/ngày, thẻ không nhận không cộng', () => {
  const s = S.createState(day('2026-11-03'));
  const now = day('2026-11-03');
  assert.equal(S.recordStick(s, { num: 1, tone: '上上签', accepted: false }, now), 0);
  for (let i = 0; i < 3; i++) assert.equal(S.recordStick(s, { num: i + 2, tone: '中平', accepted: true }, now), 3);
  assert.equal(S.sticksLeft(s, now), 0);
  assert.equal(S.recordStick(s, { num: 9, tone: '中平', accepted: true }, now), 0);
  assert.equal(S.sticksLeft(s, day('2026-11-04')), 3);
});

test('Lá số: +10 chỉ lần đầu mỗi hồ sơ', () => {
  const s = S.createState();
  assert.equal(S.grantChart(s, 'a'), 10);
  assert.equal(S.grantChart(s, 'a'), 0);
  assert.equal(S.grantChart(s, 'b'), 10);
});

test('Nhang cháy 3 phút thời gian thực, không thắp chồng', () => {
  const s = S.createState();
  const t0 = day('2026-11-03');
  assert.equal(S.lightIncense(s, t0).gained, 5);
  assert.equal(S.incenseState(s, t0.getTime() + 60000).burning, true);
  assert.equal(S.lightIncense(s, new Date(t0.getTime() + 60000)).ok, false);
  assert.equal(S.incenseState(s, t0.getTime() + S.INCENSE_MS).burning, false);
  const again = S.lightIncense(s, new Date(t0.getTime() + S.INCENSE_MS + 1));
  assert.equal(again.ok, true); assert.equal(again.gained, 0, 'thắp lại trong ngày không cộng');
});

test('Nhiệm vụ ngày + chuỗi liên tiếp / đứt', () => {
  const s = S.createState(day('2026-11-01'));
  const doDay = (d) => { const n = day(d); S.grantDaily(s, 'lich', n); S.lightIncense(s, n); s.incense.litAt = null; S.recordCase(s, { kind: 'npc', slot: 0, total: 0.5 }, n); return S.settleTasks(s, n); };
  doDay('2026-11-01');
  assert.equal(s.daily.got.tasksBonus, true);
  assert.equal(S.settleTasks(s, day('2026-11-01', 22)), 0, 'không thưởng 2 lần');
  doDay('2026-11-02');
  assert.equal(s.streak.count, 2);
  assert.equal(S.currentStreak(s, day('2026-11-03')), 2, 'hôm nay chưa xong vẫn giữ chuỗi');
  assert.equal(S.currentStreak(s, day('2026-11-04')), 0, 'lỡ một ngày → hiện 0');
  doDay('2026-11-04');
  assert.equal(s.streak.count, 1);
  // qua tháng
  const s2 = S.createState(); s2.streak = { count: 4, lastDate: '2026-10-31' };
  S.grantDaily(s2, 'lich', day('2026-11-01')); S.lightIncense(s2, day('2026-11-01')); S.recordCase(s2, { kind: 'npc', slot: 1, total: 1 }, day('2026-11-01'));
  S.settleTasks(s2, day('2026-11-01'));
  assert.equal(s2.streak.count, 5);
});

test('Thành tựu mở đúng một lần', () => {
  const s = S.createState();
  S.grantChart(s, 'x');
  assert.deepEqual(S.evaluateAchievements(s).map((a) => a.id), ['first_chart']);
  assert.equal(S.evaluateAchievements(s).length, 0);
  s.stationsVisited = [...S.STATION_IDS];
  assert.ok(S.evaluateAchievements(s).some((a) => a.id === 'walker'));
});

test('Danh xưng theo ngưỡng', () => {
  assert.equal(S.titleFor(0).name, 'Khách Vãng Lai');
  assert.equal(S.titleFor(99).name, 'Khách Quen');
  assert.equal(S.titleFor(500).name, 'Tri Âm Huyền Quán');
  assert.equal(S.nextTitle(500), null);
});

test('Lưu / đọc lại / dữ liệu hỏng không làm sập', () => {
  const st = memStore();
  const s = S.createState(); s.phucKhi = 42; s.player = { name: 'Mây', robe: '水' };
  S.saveState(s, st);
  assert.equal(S.loadState(st).phucKhi, 42);
  st.setItem(S.KEY, '{not json');
  const r = S.loadState(st);
  assert.equal(r.phucKhi, 0);
  assert.equal(st.getItem(S.KEY + ':corrupt'), '{not json');
  st.setItem(S.KEY, JSON.stringify({ v: 1, phucKhi: 'x', profiles: [] }));
  assert.equal(S.loadState(st).phucKhi, 0);
});

test('Tối đa 5 hồ sơ', () => {
  const s = S.createState();
  for (let i = 0; i < 5; i++) assert.ok(S.addProfile(s, { label: String(i) }));
  assert.equal(S.addProfile(s, { label: 'x' }), null);
});

test('Bản đồ: mọi gian đứng được và đi tới được từ cổng', () => {
  assert.equal(blockedAt(START.x, START.y), false);
  for (const st of STATIONS) {
    // trạm trong điện (ra cửa, Thầy Giải Quẻ) chỉ tới bằng cửa điện — kiểm riêng bên dưới
    if (st.kind === 'exit' || (st.room && st.kind !== 'door')) continue;
    assert.equal(blockedAt(st.spot.x, st.spot.y), false, `${st.id} spot bị chặn`);
    const path = findPath(START, st.spot);
    assert.ok(path.length > 0, `không có đường tới ${st.id}`);
    const end = path[path.length - 1];
    assert.equal(nearestStation(end)?.id, st.id, `đứng cuối đường không gần ${st.id}`);
  }
});

test('Điện thờ: cửa ↔ trong điện khớp nhau, trạm trong điện nằm trong khung', () => {
  const fromTile = (t) => ({ x: (t.x - 10) * 1.6, z: (t.y - 7) * 1.6 });
  for (const r of ROOMS) {
    const door = STATIONS.find((s) => s.id === `door_${r.id}`), exit = STATIONS.find((s) => s.id === `exit_${r.id}`);
    assert.ok(door && exit, `thiếu cửa ${r.id}`);
    assert.equal(roomAt(fromTile(door.to).x, fromTile(door.to).z)?.id, r.id, `cửa ${r.id} không đưa vào điện`);
    assert.equal(roomAt(fromTile(exit.to).x, fromTile(exit.to).z), null, `ra ${r.id} vẫn ở trong điện`);
    assert.ok(Math.hypot(fromTile(exit.to).x - r.door.x, fromTile(exit.to).z - r.door.z) < 6, `ra ${r.id} xa cửa`);
  }
  for (const st of STATIONS.filter((s) => s.room && s.kind !== 'door')) {
    const w = fromTile(st.spot);
    assert.equal(roomAt(w.x, w.z)?.id, st.room, `${st.id} không nằm trong điện ${st.room}`);
  }
});

test('A4: lá số mẫu khớp engine app chính', () => {
  const R = analyze(1995, 6, 15, 8, 30, 'nam', 2026);
  const P = R.chart.pillars;
  assert.equal(P.year.gan + P.year.zhi, '乙亥');
  assert.equal(P.month.gan + P.month.zhi, '壬午');
  assert.equal(R.yong.primary, '水');
  assert.throws(() => analyze(2025, 2, 29, 8, 0, 'nam'), /không tồn tại/);
});

console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
