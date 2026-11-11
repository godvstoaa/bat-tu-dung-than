// Kiểm tầng logic Huyền Quán (spec docs/GAME-HUYEN-QUAN-SPEC.md, tiêu chí A4, A8, A9, A10).
// Chạy: node scripts/test-game-state.mjs
import assert from 'node:assert/strict';
import * as S from '../src/game/state.js';
import { findPath, blockedAt, STATIONS, START, nearestStation, ROOMS, roomAt, worldToTile, stationById } from '../src/game/world.js';
import { platformTop } from '../src/game/obstacles.js';
import { TEA_SEATS } from '../src/game/court.js';
import { SEATS } from '../src/game/protocol.js';
import { readFileSync } from 'node:fs';
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

test('Trà: daily.teaMin không vượt trần CAPS.teaPerDay', () => {
  const s = S.createState(day('2026-11-03'));
  const now = day('2026-11-03');
  S.addTeaMinutes(s, 10, now);
  S.addTeaMinutes(s, 10, now); // thưởng dừng ở room=5 nhưng đồng hồ phút phải kẹp ở trần
  assert.equal(s.daily.teaMin, S.CAPS.teaPerDay, `teaMin phải kẹp ở ${S.CAPS.teaPerDay}`);
  assert.ok(s.daily.teaMin <= S.CAPS.teaPerDay);
  assert.equal(s.daily.teaMin, 15);
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

test('Xăm: keo bị từ chối cũng tốn lượt — sticksLeft trừ cả stickTries', () => {
  const s = S.createState(day('2026-11-03'));
  const now = day('2026-11-03');
  S.recordStick(s, { num: 1, tone: '中平', accepted: false }, now);
  assert.equal(S.sticksLeft(s, now), 2, '1 keo bị chối → còn 2 lượt');
  assert.equal(S.recordStick(s, { num: 2, tone: '中平', accepted: true }, now), 3);
  S.recordStick(s, { num: 3, tone: '中平', accepted: false }, now);
  S.recordStick(s, { num: 4, tone: '中平', accepted: false }, now);
  assert.equal(S.sticksLeft(s, now), 0, '2 nhận + 2 keo chối = hết lượt hôm nay');
  assert.equal(S.sticksLeft(s, day('2026-11-04')), 3, 'sang ngày mở lại đủ lượt');
});

test('Lá số: +10 chỉ lần đầu mỗi hồ sơ', () => {
  const s = S.createState();
  assert.equal(S.grantChart(s, 'a'), 10);
  assert.equal(S.grantChart(s, 'a'), 0);
  assert.equal(S.grantChart(s, 'b'), 10);
});

test('Lá số: thưởng khóa theo KHÓA SINH — xoá rồi tạo lại cùng người không +10 lần 2', () => {
  const s = S.createState();
  const prof = { label: 'Mây', year: 1990, month: 5, day: 20, hour: 8, minute: 30, gender: 'nam' };
  const p1 = S.addProfile(s, prof);
  assert.equal(S.grantChart(s, p1.id), 10);
  S.removeProfile(s, p1.id);
  const p2 = S.addProfile(s, { ...prof }); // id mới, cùng khóa sinh
  assert.ok(p2.id !== p1.id);
  assert.equal(S.grantChart(s, p2.id), 0, 'cùng khóa sinh → không thưởng lần hai');
  assert.deepEqual(s.flags.chartRewarded, [S.chartBirthKey(prof)]);
  const p3 = S.addProfile(s, { ...prof, year: 1991 }); // khóa sinh khác
  assert.equal(S.grantChart(s, p3.id), 10, 'khóa sinh khác → vẫn thưởng lần đầu');
  // bản cũ lưu id hồ sơ trong flags — id đã có thì tôn trọng
  const s2 = S.createState();
  s2.flags.chartRewarded = ['id-cũ'];
  const pOld = S.addProfile(s2, prof);
  pOld.id = 'id-cũ';
  assert.equal(S.grantChart(s2, 'id-cũ'), 0, 'id bản cũ đã thưởng → không thưởng lại');
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

test('Sơn Môn: tường chặn, cổng thông, vách nền chặn, bậc lên dần, Chính Đường không đi xuyên', () => {
  const B = (x, z) => { const t = worldToTile(x, z); return blockedAt(t.x, t.y); };
  for (const [x, z] of [[-60.6, 0], [60.6, 20], [20, 66.6], [-20, -66.6], [-36.2, -20], [36.2, 0], [27.8, -30], [0, -30], [10, -40]]) assert.equal(B(x, z), true, `(${x}, ${z}) phải chặn`);
  for (const [x, z] of [[0, 66.6], [0, -66.6], [0, 10.5], [0, -3.5], [0, -58.5], [0, -8.1]]) assert.equal(B(x, z), false, `(${x}, ${z}) phải đi được`);
  // bậc chính: độ cao tăng dần từ sân (0) lên tầng 1 (2) rồi tầng 2 (4)
  let prev = -1;
  for (let z = 14; z >= -9; z -= 0.5) { const h = platformTop(0, z) ?? 0; assert.ok(h >= prev - 1e-9, `bậc tụt ở z ${z}`); assert.ok(h - prev <= 0.41 || prev < 0, `bậc cao quá ở z ${z}`); prev = h; }
  assert.equal(platformTop(0, -8.1), 4.25, 'bệ thầy cao 4,25 m');
  // đi bộ từ cổng lên bệ thầy phải vòng qua Đại Đỉnh / lư hương, không cắt qua khối chặn
  const path = findPath(START, stationById('thay').spot);
  let cur = START;
  for (const p of path) { const n = Math.ceil(Math.hypot(p.x - cur.x, p.y - cur.y) / 0.1); for (let k = 1; k <= n; k++) assert.equal(blockedAt(cur.x + (p.x - cur.x) * k / n, cur.y + (p.y - cur.y) * k / n), false, 'đường đi cắt qua vật cản'); cur = p; }
});

test('Trà Thất: chỗ ngồi bồ đoàn theo Trà Thất mới, không dính vật cản; máy chủ xuất phát đúng START', () => {
  assert.equal(SEATS.length, TEA_SEATS.length);
  SEATS.forEach((s, i) => { assert.ok(Math.abs(s.x - TEA_SEATS[i].x) < 1e-6 && Math.abs(s.y - TEA_SEATS[i].y) < 1e-6, `ghế ${i} lệch court.js`); assert.equal(blockedAt(s.x, s.y), false, `ghế ${i} dính vật cản`); });
  const tra = stationById('tra');
  for (const s of SEATS) assert.ok(Math.hypot(s.x - tra.spot.x, s.y - tra.spot.y) < 2, 'ghế phải ngay cạnh chỗ đứng Trà Thất');
  const room = readFileSync(new URL('../worker/quan-room.js', import.meta.url), 'utf8');
  assert.ok(room.includes(`x: m.x ?? ${START.x}, y: m.y ?? ${START.y}`), 'worker/quan-room.js: nơi khách chọn (spawn.js), mặc định START');
});

test('A4: lá số mẫu khớp engine app chính', () => {
  const R = analyze(1995, 6, 15, 8, 30, 'nam', 2026);
  const P = R.chart.pillars;
  assert.equal(P.year.gan + P.year.zhi, '乙亥');
  assert.equal(P.month.gan + P.month.zhi, '壬午');
  assert.equal(R.yong.primary, '水');
  assert.throws(() => analyze(2025, 2, 29, 8, 0, 'nam'), /không tồn tại/);
});

test('Giải án: tổng thưởng án mỗi ngày bị kẹp ở CASE_GAIN_CAP (chống farm client-authoritative)', () => {
  const s = S.createState(day('2026-11-03'));
  const now = day('2026-11-03');
  const g1 = S.recordCase(s, { kind: 'npc', slot: 0, total: 1 }, now);         // 15
  const g2 = S.recordCase(s, { kind: 'npc', slot: 1, total: 1 }, now);         // 15
  const g3 = S.recordCase(s, { kind: 'npc', slot: 2, total: 1 }, now);         // 15
  const g4 = S.recordCase(s, { kind: 'classical', id: 'k1', total: 1 }, now);  // 25 nhưng chỉ còn room 15
  assert.equal(g4, S.CASE_GAIN_CAP - (g1 + g2 + g3), 'án vượt trần chỉ nhận phần còn thừa');
  const g5 = S.recordCase(s, { kind: 'desk', id: 'trach', total: 1 }, now);
  assert.equal(g5, 0, 'đủ trần → không cộng thêm');
  assert.equal(s.phucKhi, S.CASE_GAIN_CAP);
  assert.equal(s.daily.caseGain, S.CASE_GAIN_CAP);
  const g6 = S.recordCase(s, { kind: 'npc', slot: 0, total: 1 }, day('2026-11-04'));
  assert.equal(g6, 15, 'sang ngày trần mở lại');
});

console.log(`\n${passed} test đạt${process.exitCode ? ' — CÓ LỖI' : ''}`);
