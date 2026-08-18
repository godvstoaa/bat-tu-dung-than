// ============================================================================
//  family-cases.js — án cổ / 教材 (không phải CRM hồ sơ khách)
// ============================================================================
const KEY = 'ludang-family-an-v1';

export const ROLE_OPTS = [
  { id: 'center', vi: 'Chủ thể' },
  { id: 'father', vi: 'Cha' },
  { id: 'mother', vi: 'Mẹ' },
  { id: 'sibling', vi: 'Anh/chị/em' },
  { id: 'spouse', vi: 'Vợ/chồng' },
  { id: 'child', vi: 'Con' },
];

export const SAMPLE_AN_ID = 'sample-an-1995';

const SEED_1995 = {
  id: SAMPLE_AN_ID,
  title: 'Án cổ · bản in 1995 — giờ con tranh',
  sample: true,
  jiaocai: true,
  plateNote: '印本教材: cụm bốn trụ. Giờ con tranh (未记时). Hai 应期 đã ghi trên bản in: kỳ khảo 2013, sinh 2020.',
  members: [
    { id: 'm-center', role: 'center', label: 'Chủ thể', year: 1995, month: 8, day: 12, hour: 9, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-father', role: 'father', label: 'Cha', year: 1968, month: 5, day: 2, hour: 7, minute: 0, gender: 'nam', hourUnknown: false },
    { id: 'm-mother', role: 'mother', label: 'Mẹ', year: 1971, month: 11, day: 9, hour: 5, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-child', role: 'child', label: 'Con', year: 2020, month: 7, day: 7, hour: null, minute: 0, gender: 'nu', hourUnknown: true },
  ],
  events: [
    { id: 'ev-2013', memberId: 'm-center', year: 2013, type: 'study_success', label: 'Kỳ khảo 2013 ghi trên bản in' },
    { id: 'ev-2020', memberId: 'm-center', year: 2020, type: 'birth_child', label: 'Sinh 2020 ghi trên bản in' },
  ],
};

const SEED_1968 = {
  id: 'jiaocai-1968',
  title: 'Án cổ · bản in 1968 — giờ con tranh',
  sample: true,
  jiaocai: true,
  plateNote: '印本教材: tâm 1968, phối 1971, con 1995 giờ chưa ghi. 应期 trên bản in: hôn sự 1993, sinh 1995.',
  members: [
    { id: 'm-center', role: 'center', label: 'Chủ thể', year: 1968, month: 5, day: 2, hour: 7, minute: 0, gender: 'nam', hourUnknown: false },
    { id: 'm-spouse', role: 'spouse', label: 'Phối ngẫu', year: 1971, month: 11, day: 9, hour: 5, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-child', role: 'child', label: 'Con', year: 1995, month: 8, day: 12, hour: null, minute: 0, gender: 'nu', hourUnknown: true },
  ],
  events: [
    { id: 'ev-1993', memberId: 'm-center', year: 1993, type: 'marriage', label: 'Hôn sự 1993 ghi trên bản in' },
    { id: 'ev-1995', memberId: 'm-center', year: 1995, type: 'birth_child', label: 'Sinh 1995 ghi trên bản in' },
  ],
};

const SEED_1971 = {
  id: 'jiaocai-1971',
  title: 'Án cổ · bản in 1971 — giờ con tranh',
  sample: true,
  jiaocai: true,
  plateNote: '印本教材: tâm 1971, phối 1968, con 2020 giờ chưa ghi. 应期 trên bản in: bệnh án 2018, sinh 2020.',
  members: [
    { id: 'm-center', role: 'center', label: 'Chủ thể', year: 1971, month: 11, day: 9, hour: 5, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-spouse', role: 'spouse', label: 'Phối ngẫu', year: 1968, month: 5, day: 2, hour: 7, minute: 0, gender: 'nam', hourUnknown: false },
    { id: 'm-child', role: 'child', label: 'Con', year: 2020, month: 7, day: 7, hour: null, minute: 0, gender: 'nu', hourUnknown: true },
  ],
  events: [
    { id: 'ev-2018', memberId: 'm-center', year: 2018, type: 'illness', label: 'Bệnh án 2018 ghi trên bản in' },
    { id: 'ev-2020b', memberId: 'm-center', year: 2020, type: 'birth_child', label: 'Sinh 2020 ghi trên bản in' },
  ],
};

export const SEED_ANS = [SEED_1995, SEED_1968, SEED_1971];
export const SEED_AN = SEED_1995;

const SEED_IDS = new Set(SEED_ANS.map((a) => a.id));

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function roleVi(role) {
  return ROLE_OPTS.find((r) => r.id === role)?.vi || role;
}

export function genderVi(g) {
  return g === 'nam' ? 'nam' : 'nữ';
}

export function pad2(n) {
  return String(n ?? 0).padStart(2, '0');
}

export function memberDateLine(m) {
  const ymd = `${m.year}-${pad2(m.month)}-${pad2(m.day)}`;
  if (m.hourUnknown || m.hour == null) return `${ymd} · giờ chưa rõ · ${genderVi(m.gender)}`;
  return `${ymd} ${pad2(m.hour)}:${pad2(m.minute ?? 0)} · ${genderVi(m.gender)}`;
}

export function anSummary(an) {
  const n = (an.members || []).length;
  const unknown = (an.members || []).filter((m) => m.hourUnknown).length;
  const bits = [];
  if (an.jiaocai) bits.push('教材');
  bits.push(`${n} trụ`);
  if (unknown) bits.push(`${unknown} giờ tranh`);
  if ((an.events || []).length) bits.push(`${an.events.length} 应期`);
  return bits.join(' · ');
}

export function isPrintedCase(an) {
  return !!(an && (an.jiaocai || an.sample));
}

function normalizeMember(raw) {
  if (!raw) return null;
  const hourUnknown = !!raw.hourUnknown || raw.hour == null;
  return {
    id: raw.id || uid('m'),
    role: ROLE_OPTS.some((r) => r.id === raw.role) ? raw.role : 'child',
    label: String(raw.label || roleVi(raw.role)).slice(0, 40),
    year: Number(raw.year),
    month: Number(raw.month),
    day: Number(raw.day),
    hour: hourUnknown ? null : Number(raw.hour),
    minute: hourUnknown ? 0 : Number(raw.minute ?? 0),
    gender: raw.gender === 'nam' ? 'nam' : 'nu',
    hourUnknown,
  };
}

function normalizeEvent(raw) {
  if (!raw || !raw.year || !raw.type) return null;
  return {
    id: raw.id || uid('ev'),
    memberId: raw.memberId || null,
    year: Number(raw.year),
    type: String(raw.type),
    label: String(raw.label || '').slice(0, 80),
  };
}

function normalizeAn(raw) {
  if (!raw || !raw.id) return null;
  const jiaocai = !!raw.jiaocai || !!raw.sample;
  const members = (raw.members || []).map(normalizeMember).filter((m) => m && m.year && m.month && m.day);
  return {
    id: raw.id,
    title: String(raw.title || (jiaocai ? 'Án cổ' : 'Án trống')).slice(0, 60),
    sample: jiaocai,
    jiaocai,
    plateNote: String(raw.plateNote || '').slice(0, 280),
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
    members,
    events: (raw.events || []).map(normalizeEvent).filter(Boolean),
  };
}

export function loadAns() {
  let stored = [];
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    stored = Array.isArray(arr) ? arr : [];
  } catch {
    stored = [];
  }
  const seeds = SEED_ANS.map(normalizeAn).filter(Boolean);
  const user = stored.map(normalizeAn).filter((a) => a && !SEED_IDS.has(a.id) && !a.jiaocai);
  return [...seeds, ...user].sort((a, b) => {
    if (a.id === SAMPLE_AN_ID) return -1;
    if (b.id === SAMPLE_AN_ID) return 1;
    if (a.jiaocai && !b.jiaocai) return -1;
    if (!a.jiaocai && b.jiaocai) return 1;
    return String(b.updatedAt || b.id).localeCompare(String(a.updatedAt || a.id));
  });
}

function saveUserAns(list) {
  const user = (list || []).filter((a) => a && a.id && !a.jiaocai && !SEED_IDS.has(a.id));
  localStorage.setItem(KEY, JSON.stringify(user.slice(0, 40)));
}

export function getAn(id) {
  return loadAns().find((a) => a.id === id) || null;
}

export function upsertAn(partial) {
  const list = loadAns();
  const now = new Date().toISOString();
  if (partial.id) {
    const i = list.findIndex((a) => a.id === partial.id);
    if (i >= 0) {
      if (isPrintedCase(list[i])) return list[i];
      list[i] = normalizeAn({ ...list[i], ...partial, updatedAt: now });
      saveUserAns(list);
      return list[i];
    }
  }
  const row = normalizeAn({
    id: uid('an'),
    title: partial.title || 'Án trống',
    sample: false,
    jiaocai: false,
    createdAt: now,
    updatedAt: now,
    members: partial.members || [],
    events: partial.events || [],
  });
  list.push(row);
  saveUserAns(list);
  return row;
}

export function addMember(anId, partial) {
  const list = loadAns();
  const i = list.findIndex((a) => a.id === anId);
  if (i < 0) return null;
  if (isPrintedCase(list[i])) return list[i];
  const member = normalizeMember({ ...partial, id: uid('m') });
  if (!member) return list[i];
  list[i] = normalizeAn({
    ...list[i],
    members: [...list[i].members, member],
    updatedAt: new Date().toISOString(),
  });
  saveUserAns(list);
  return list[i];
}

export function removeAn(id) {
  if (SEED_IDS.has(id)) return loadAns();
  const list = loadAns().filter((a) => a.id !== id);
  saveUserAns(list);
  return list;
}

export function removeMember(anId, memberId) {
  const list = loadAns();
  const i = list.findIndex((a) => a.id === anId);
  if (i < 0 || isPrintedCase(list[i])) return getAn(anId);
  list[i] = normalizeAn({
    ...list[i],
    members: list[i].members.filter((m) => m.id !== memberId),
    updatedAt: new Date().toISOString(),
  });
  saveUserAns(list);
  return list[i];
}
