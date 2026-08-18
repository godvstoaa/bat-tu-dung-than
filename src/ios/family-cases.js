// ============================================================================
//  family-cases.js — sổ ÁN GIA TỘC (không phải CRM một người)
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

export const SEED_AN = {
  id: SAMPLE_AN_ID,
  title: 'Án mẫu — giờ con chưa rõ',
  sample: true,
  members: [
    { id: 'm-center', role: 'center', label: 'Chủ thể', year: 1995, month: 8, day: 12, hour: 9, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-father', role: 'father', label: 'Cha', year: 1968, month: 5, day: 2, hour: 7, minute: 0, gender: 'nam', hourUnknown: false },
    { id: 'm-mother', role: 'mother', label: 'Mẹ', year: 1971, month: 11, day: 9, hour: 5, minute: 30, gender: 'nu', hourUnknown: false },
    { id: 'm-child', role: 'child', label: 'Con', year: 2020, month: 7, day: 7, hour: null, minute: 0, gender: 'nu', hourUnknown: true },
  ],
};

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
  const bits = [`${n} người`];
  if (unknown) bits.push(`${unknown} giờ chưa rõ`);
  return bits.join(' · ');
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

function normalizeAn(raw) {
  if (!raw || !raw.id) return null;
  const members = (raw.members || []).map(normalizeMember).filter((m) => m && m.year && m.month && m.day);
  return {
    id: raw.id,
    title: String(raw.title || 'Án gia tộc').slice(0, 60),
    sample: !!raw.sample,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
    members,
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
  const seed = normalizeAn(SEED_AN);
  const user = stored.map(normalizeAn).filter((a) => a && a.id !== SAMPLE_AN_ID);
  return [seed, ...user].sort((a, b) => {
    if (a.sample && !b.sample) return -1;
    if (!a.sample && b.sample) return 1;
    return String(b.updatedAt || b.id).localeCompare(String(a.updatedAt || a.id));
  });
}

function saveUserAns(list) {
  const user = (list || []).filter((a) => a && a.id && !a.sample);
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
      if (list[i].sample) {
        return list[i];
      }
      list[i] = normalizeAn({ ...list[i], ...partial, updatedAt: now });
      saveUserAns(list);
      return list[i];
    }
  }
  const row = normalizeAn({
    id: uid('an'),
    title: partial.title || 'Án mới',
    sample: false,
    createdAt: now,
    updatedAt: now,
    members: partial.members || [],
  });
  list.push(row);
  saveUserAns(list);
  return row;
}

export function addMember(anId, partial) {
  const list = loadAns();
  const i = list.findIndex((a) => a.id === anId);
  if (i < 0) return null;
  if (list[i].sample) return list[i];
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
  const list = loadAns().filter((a) => a.id !== id);
  saveUserAns(list);
  return list;
}

export function removeMember(anId, memberId) {
  const list = loadAns();
  const i = list.findIndex((a) => a.id === anId);
  if (i < 0 || list[i].sample) return getAn(anId);
  list[i] = normalizeAn({
    ...list[i],
    members: list[i].members.filter((m) => m.id !== memberId),
    updatedAt: new Date().toISOString(),
  });
  saveUserAns(list);
  return list[i];
}
