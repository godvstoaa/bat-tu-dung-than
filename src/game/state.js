// ============================================================================
//  HUYỀN QUÁN — trạng thái người chơi (localStorage) + Phúc Khí, nhiệm vụ, thành tựu.
//  Thuần logic, không đụng DOM → test được bằng node (scripts/test-game-state.mjs).
//  Spec: docs/GAME-HUYEN-QUAN-SPEC.md mục 8 + 10.
// ============================================================================

import { FEATURES, TEXT } from './features.js';

export const KEY = 'huyenquan:v1';

// Phúc Khí cố định theo hành động (spec 7.x). Trà tính theo phút, có trần ngày.
export const REWARD = { chart: 10, compass: 5, stick: 3, huong: 5, lich: 2, lantern: 3, tasks: 5 };
export const CAPS = { teaPerDay: 15, sticksPerDay: 3, maxProfiles: 5, keepSticks: 30, keepLanterns: 50 };
export const INCENSE_MS = 3 * 60 * 1000;

export const TITLES = [
  { min: 0, name: 'Khách Vãng Lai' },
  { min: 30, name: 'Khách Quen' },
  { min: 100, name: 'Môn Sinh' },
  { min: 250, name: 'Đệ Tử' },
  { min: 500, name: 'Tri Âm Huyền Quán' },
];

export const TEAS = [
  { id: 'sen', name: 'Trà Sen', min: 0, color: '#c9b46a' },
  { id: 'lai', name: 'Trà Lài', min: 30, color: '#d8cf8c' },
  { id: 'olong', name: 'Trà Ô Long', min: 100, color: '#b0702c' },
  { id: 'shan', name: 'Trà Shan Tuyết', min: 250, color: '#8fa64a' },
];

export const STATION_IDS = FEATURES.stations.filter((id) => !id.startsWith('an'));

const ALL_ACHIEVEMENTS = [
  { id: 'first_chart', name: 'Lần đầu gặp thầy', desc: 'Lập lá số đầu tiên' },
  { id: 'family', name: 'Gia phả nhỏ', desc: 'Có 3 hồ sơ trong Sổ Mệnh' },
  { id: 'compass', name: 'Biết đường về', desc: 'Xem La Bàn Đài' },
  { id: 'first_stick', name: 'Thẻ đầu tiên', desc: 'Nhận một thẻ xăm' },
  { id: 'top_stick', name: 'Thượng thượng', desc: 'Nhận thẻ Thượng Thượng' },
  { id: 'patience', name: 'Kiên nhẫn', desc: 'Ba lần keo chưa thuận trong một phiên' },
  { id: 'incense7', name: 'Hương khói', desc: 'Thắp nhang 7 ngày khác nhau' },
  { id: 'tea60', name: 'Trà đạo', desc: 'Tổng 60 phút ngồi trà' },
  { id: 'lantern5', name: 'Đèn trôi', desc: 'Thả 5 đèn hoa đăng' },
  { id: 'streak3', name: 'Ba ngày liền', desc: 'Chuỗi 3 ngày' },
  { id: 'streak7', name: 'Một tuần thong thả', desc: 'Chuỗi 7 ngày' },
  { id: 'walker', name: 'Dạo quán', desc: `Ghé đủ ${FEATURES.stations.length} gian` },
];
// Thành tựu gắn với gian bói chỉ có trên web.
const DIVINATION_ACH = ['first_stick', 'top_stick', 'patience', 'lantern5'];
export const ACHIEVEMENTS = FEATURES.divination ? ALL_ACHIEVEMENTS : ALL_ACHIEVEMENTS.filter((a) => !DIVINATION_ACH.includes(a.id));

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Ngày liền trước của 'YYYY-MM-DD' (theo lịch, không theo 24h — tránh lệch giờ mùa hè).
export function prevDay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return todayStr(new Date(y, m - 1, d - 1));
}

function freshDaily(date) {
  return { date, got: {}, teaMin: 0, sticks: 0, stickTries: 0, caseGain: 0, chartIds: [] };
}

export function createState(now = new Date()) {
  return {
    v: 1,
    player: null,
    profiles: [],
    phucKhi: 0,
    daily: freshDaily(todayStr(now)),
    incense: { litAt: null },
    tea: { totalMin: 0 },
    sticks: [],
    lanterns: [],
    stationsVisited: [],
    incenseDays: [],
    streak: { count: 0, lastDate: null },
    achievements: {},
    flags: {},
    settings: { sound: false },
    // Giải án (P2) — phải có trong khung, nếu không hydrate() sẽ bỏ khi đọc lại
    mastery: {},
    classical: {},
    caseLog: [],
    deskLog: {},
    xp: 0,          // Phúc Khí tích lũy cả đời (cấp)
    vip: null,      // { until, source } — quyền lợi VIP
    thaitue: null,  // { year, day, days } — đèn an Thái Tuế (lightLamp)
    wardrobe: null, // Tàng Y Các: { owned, equipped, ngoc, checkin, bonus } — cosmetics.js
    life: null,     // sinh tồn + Văn: { full, wake, hp, van, bed, … } — life.js › lifeState
    cloud: null,    // tài khoản: { uid, rev, at } bản lưu đám mây đã đồng bộ — account.js (chỉ trên máy)
    law: null,      // Huyền Thành Luật: { record, sentence } — law.js › lawState
    home: null,     // Thành Bát Quái: { inv, own, buffs, plants, spawn } — items.js › homeState
  };
}

// Ghép dữ liệu đã lưu lên khung mặc định — bản cũ thiếu field vẫn chạy.
function hydrate(raw, now) {
  const s = createState(now);
  if (!raw || typeof raw !== 'object' || raw.v !== 1) throw new Error('bad state');
  for (const k of Object.keys(s)) if (raw[k] !== undefined) s[k] = raw[k];
  if (raw.xp === undefined) s.xp = Math.max(0, s.phucKhi || 0);
  if (!Array.isArray(s.profiles) || !Array.isArray(s.sticks) || typeof s.phucKhi !== 'number') throw new Error('bad state');
  s.daily = { ...freshDaily(s.daily?.date || todayStr(now)), ...s.daily, got: { ...(s.daily?.got || {}) } };
  return s;
}

export function loadState(storage, now = new Date()) {
  let text = null;
  try { text = storage.getItem(KEY); } catch (e) { return createState(now); }
  if (!text) return createState(now);
  try {
    return rollDay(hydrate(JSON.parse(text), now), now);
  } catch (e) {
    // Hỏng → giữ bản cũ để không mất trắng, khởi tạo lại.
    try { storage.setItem(KEY + ':corrupt', text); } catch (_) { /* quota */ }
    return createState(now);
  }
}

export function saveState(s, storage) {
  try { storage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; }
}

// Sang ngày mới → reset phần daily. Gọi trước mỗi hành động.
export function rollDay(s, now = new Date()) {
  const t = todayStr(now);
  if (s.daily.date !== t) s.daily = freshDaily(t);
  return s;
}

export function titleFor(phuc) {
  let t = TITLES[0];
  for (const x of TITLES) if (phuc >= x.min) t = x;
  return t;
}

export function nextTitle(phuc) {
  return TITLES.find((x) => x.min > phuc) || null;
}

// Chuỗi hiển thị: đứt nếu ngày hoàn thành cuối cùng cũ hơn hôm qua.
export function currentStreak(s, now = new Date()) {
  const t = todayStr(now);
  const { count, lastDate } = s.streak;
  if (!lastDate) return 0;
  return (lastDate === t || lastDate === prevDay(t)) ? count : 0;
}

function addPhuc(s, n) {
  s.phucKhi += n;
  s.xp = (s.xp || 0) + Math.max(0, n); // Phúc Khí tích lũy cả đời → cấp (progress.js)
  return n;
}

// Thưởng một-lần-mỗi-ngày (lich, huong, compass, lantern). Trả số Phúc Khí nhận được.
export function grantDaily(s, key, now = new Date()) {
  rollDay(s, now);
  if (s.daily.got[key]) return 0;
  s.daily.got[key] = true;
  return addPhuc(s, REWARD[key] || 0);
}

// Thưởng ở nhà / trong thành (thắp hương bàn thờ, pha trà, đọc sách, tưới cây…): mỗi khoá một lần
// mỗi ngày, số Phúc Khí do bên gọi tính (homefs.warmReward…) — kẹp 0..20 / lần.
export const HOME_DAILY_CAP = 40;
export function grantHome(s, key, amount, now = new Date()) {
  rollDay(s, now);
  const k = `home:${key}`;
  if (s.daily.got[k]) return 0;
  const used = s.daily.homeGain || 0, n = Math.max(0, Math.min(20, Math.round(amount), HOME_DAILY_CAP - used));
  s.daily.got[k] = true; s.daily.homeGain = used + n;
  return addPhuc(s, n);
}
export const homeGot = (s, key) => !!s.daily.got[`home:${key}`];

// Khóa sinh hồ sơ «năm-tháng-ngày-giờ-phút-giới tính» — thưởng lá số gắn với bát tự,
// không với id hồ sơ: xoá rồi tạo lại cùng người không được +10 lần hai.
export function chartBirthKey(p) {
  return `${p.year}-${p.month}-${p.day}-${p.hour}-${p.minute}-${p.gender}`;
}

// Lập lá số: +10 cho mỗi hồ sơ, chỉ lần đầu (đời hồ sơ theo khóa sinh), không theo ngày.
// Bản cũ lưu id hồ sơ trong flags.chartRewarded — id đã có trong danh sách thì vẫn tôn trọng.
export function grantChart(s, profileId) {
  s.flags.chartRewarded = s.flags.chartRewarded || [];
  if (s.flags.chartRewarded.includes(profileId)) return 0; // id bản cũ đã thưởng
  const p = s.profiles.find((x) => x.id === profileId);
  const k = p ? chartBirthKey(p) : profileId; // không tìm thấy hồ sơ → dùng chính id làm khóa
  if (s.flags.chartRewarded.includes(k)) return 0;
  s.flags.chartRewarded.push(k);
  return addPhuc(s, REWARD.chart);
}

export function sticksLeft(s, now = new Date()) {
  rollDay(s, now);
  // keo bị thần từ chối cũng lấy một lượt: đếm cả stickTries, không chỉ thẻ đã nhận
  const used = Math.max(s.daily.sticks, s.daily.stickTries || 0);
  return Math.max(0, CAPS.sticksPerDay - used);
}

export function recordStick(s, entry, now = new Date()) {
  rollDay(s, now);
  const at = now.getTime();
  s.sticks.unshift({ ...entry, at });
  s.sticks.length = Math.min(s.sticks.length, CAPS.keepSticks);
  s.daily.stickTries = (s.daily.stickTries || 0) + 1; // mỗi lần xin keo tốn một lượt
  if (!entry.accepted) return 0;
  if (s.daily.sticks >= CAPS.sticksPerDay) return 0;
  s.daily.sticks += 1;
  return addPhuc(s, REWARD.stick);
}

export function addTeaMinutes(s, minutes, now = new Date()) {
  rollDay(s, now);
  const m = Math.max(0, Math.floor(minutes));
  if (!m) return 0;
  s.tea.totalMin += m;
  const room = Math.max(0, CAPS.teaPerDay - s.daily.teaMin);
  s.daily.teaMin = Math.min(CAPS.teaPerDay, s.daily.teaMin + m); // kẹp ở trần, không cộng tràn
  return addPhuc(s, Math.min(room, m));
}

export function incenseState(s, now = Date.now()) {
  const litAt = s.incense.litAt;
  if (!litAt) return { burning: false, progress: 1 };
  const p = (now - litAt) / INCENSE_MS;
  return { burning: p >= 0 && p < 1, progress: Math.min(1, Math.max(0, p)), remainMs: Math.max(0, INCENSE_MS - (now - litAt)) };
}

export function lightIncense(s, now = new Date()) {
  if (incenseState(s, now.getTime()).burning) return { ok: false, gained: 0 };
  s.incense.litAt = now.getTime();
  const d = todayStr(now);
  if (!s.incenseDays.includes(d)) s.incenseDays.push(d);
  if (s.incenseDays.length > 400) s.incenseDays.splice(0, s.incenseDays.length - 400);
  return { ok: true, gained: grantDaily(s, 'huong', now) };
}

export function addLantern(s, wish, now = new Date()) {
  rollDay(s, now);
  if (s.daily.got.lantern) return { ok: false, gained: 0 };
  s.lanterns.unshift({ wish: String(wish).slice(0, 80), at: now.getTime() });
  s.lanterns.length = Math.min(s.lanterns.length, CAPS.keepLanterns);
  return { ok: true, gained: grantDaily(s, 'lantern', now) };
}

export function visitStation(s, id) {
  if (STATION_IDS.includes(id) && !s.stationsVisited.includes(id)) s.stationsVisited.push(id);
}

export function tasks(s, now = new Date()) {
  rollDay(s, now);
  return [
    { id: 'lich', text: 'Xem Bảng Lịch hôm nay', done: !!s.daily.got.lich },
    { id: 'huong', text: TEXT.huongTask, done: !!s.daily.got.huong },
    { id: 'case', text: 'Giải án cho một khách', done: (s.daily.cases || []).length >= 1 },
  ];
}

// Đủ 3 nhiệm vụ → +5 và nối chuỗi (một lần/ngày). Trả số Phúc Khí nhận được.
export function settleTasks(s, now = new Date()) {
  if (s.daily.got.tasksBonus) return 0;
  if (!tasks(s, now).every((t) => t.done)) return 0;
  s.daily.got.tasksBonus = true;
  const t = s.daily.date;
  if (s.streak.lastDate !== t) {
    s.streak.count = s.streak.lastDate === prevDay(t) ? s.streak.count + 1 : 1;
    s.streak.lastDate = t;
  }
  return addPhuc(s, REWARD.tasks);
}

// Kiểm mọi thành tựu từ trạng thái hiện tại; trả mảng thành tựu mới mở.
export function evaluateAchievements(s, now = new Date()) {
  const has = {
    first_chart: (s.flags.chartRewarded || []).length >= 1,
    family: s.profiles.length >= 3,
    compass: !!s.flags.sawCompass,
    first_stick: s.sticks.some((x) => x.accepted),
    top_stick: s.sticks.some((x) => x.accepted && x.tone === '上上签'),
    patience: !!s.flags.patience,
    incense7: s.incenseDays.length >= 7,
    tea60: s.tea.totalMin >= 60,
    lantern5: s.lanterns.length >= 5,
    streak3: s.streak.count >= 3,
    streak7: s.streak.count >= 7,
    walker: STATION_IDS.every((id) => s.stationsVisited.includes(id)),
  };
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (has[a.id] && !s.achievements[a.id]) {
      s.achievements[a.id] = now.getTime();
      fresh.push(a);
    }
  }
  return fresh;
}

export function addProfile(s, p) {
  if (s.profiles.length >= CAPS.maxProfiles) return null;
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const prof = { id, ...p };
  s.profiles.push(prof);
  return prof;
}

export function removeProfile(s, id) {
  s.profiles = s.profiles.filter((p) => p.id !== id);
}

// ---------------------------------------------------------------------------
// Giải án (P2): 3 khách/ngày, Án Cổ thưởng lần đầu đạt ≥ 60%, kỹ năng tu học.
// ---------------------------------------------------------------------------
export const CASES_PER_DAY = 3;
export const CASE_REWARD = { npcMax: 15, classical: 25 };
// Trần thưởng án mỗi ngày (npc + cổ + nghề gộp chung): điểm do phía khách tự tính,
// chặn cứng ở state để không farm được — cap ~60.
export const CASE_GAIN_CAP = 60;

// Thái Tuế Điện: mỗi năm (can chi) một ngọn đèn an Thái Tuế — thắp lần đầu +10, mỗi ngày thêm dầu +3.
export const LAMP_REWARD = { first: 10, daily: 3 };
export function lampState(s, year, now = new Date()) {
  const L = s.thaitue || {};
  const lit = L.year === year;
  return { lit, days: lit ? L.days || 0 : 0, today: lit && L.day === todayStr(now) };
}
export function lightLamp(s, year, now = new Date()) {
  const st = lampState(s, year, now);
  if (st.today) return 0;
  s.thaitue = { year, day: todayStr(now), days: st.days + 1 };
  return addPhuc(s, st.lit ? LAMP_REWARD.daily : LAMP_REWARD.first);
}

// Sảnh nghề (Trạch Nhật, …): 1 khách/sảnh/ngày; thông thạo = 30 án gần nhất mỗi nghề
export const DESK_REWARD = 15;
export function deskDone(s, id, now = new Date()) {
  rollDay(s, now);
  return (s.daily.desks || []).includes(id);
}
export function deskMastery(s, id) {
  const xs = (s.deskLog || {})[id] || [];
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) : 0;
}

export function caseDone(s, slot, now = new Date()) {
  rollDay(s, now);
  return (s.daily.cases || []).includes(slot);
}

// Ghi một án đã giải. kind 'npc' (slot 0..2) | 'classical' (id). Trả số điểm nhận được.
export function recordCase(s, { kind, slot, id, name, total, mastery }, now = new Date()) {
  rollDay(s, now);
  s.caseLog = s.caseLog || [];
  s.caseLog.unshift({ kind, id: id || null, name, total: Math.round(total * 100), at: now.getTime() });
  s.caseLog.length = Math.min(s.caseLog.length, 40);
  if (mastery) s.mastery = mastery;
  let gained = 0;
  if (kind === 'desk') {
    s.deskLog = s.deskLog || {};
    s.deskLog[id] = [total, ...(s.deskLog[id] || [])].slice(0, 30);
    s.daily.desks = s.daily.desks || [];
    if (!s.daily.desks.includes(id)) { s.daily.desks.push(id); gained = Math.round(DESK_REWARD * Math.max(0, Math.min(1, total))); }
  } else if (kind === 'npc') {
    s.daily.cases = s.daily.cases || [];
    if (!s.daily.cases.includes(slot) && s.daily.cases.length < CASES_PER_DAY) {
      s.daily.cases.push(slot);
      gained = Math.round(CASE_REWARD.npcMax * Math.max(0, Math.min(1, total)));
    }
  } else {
    s.classical = s.classical || {};
    const prev = s.classical[id] || 0;
    if (prev < 0.6 && total >= 0.6) gained = CASE_REWARD.classical;
    s.classical[id] = Math.max(prev, total);
  }
  // «Hợp mệnh»: mặc đủ bộ ngũ hành trùng Dụng thần → +10% (cosmetics.js › setBonus)
  if (gained > 0 && s.wardrobe?.bonus) gained = Math.round(gained * (1 + s.wardrobe.bonus));
  // Thanh Tâm Đan (items.js › useBuff 'buff_case'): +25% trong ngày đã uống
  if (gained > 0 && s.home?.buffs?.case?.date === s.daily.date) gained = Math.round(gained * 1.25);
  // trần thưởng án mỗi ngày: vượt cap thì chỉ nhận phần còn thừa (reset theo daily)
  if (gained > 0) {
    s.daily.caseGain = s.daily.caseGain || 0;
    const room = Math.max(0, CASE_GAIN_CAP - s.daily.caseGain);
    gained = Math.min(gained, room);
    s.daily.caseGain += gained;
  }
  return addPhuc(s, gained);
}
