// ============================================================================
//  cases.js — sổ hồ sơ khách (local, offline)
// ============================================================================
const KEY = 'ludang-cases-v1';

export const SEED_CASES = [
  {
    id: 'sample-1990',
    name: 'Case mẫu A',
    year: 1990, month: 6, day: 15, hour: 10, minute: 0, gender: 'nam',
    sample: true,
  },
  {
    id: 'sample-1985',
    name: 'Case mẫu B',
    year: 1985, month: 1, day: 20, hour: 8, minute: 0, gender: 'nu',
    sample: true,
  },
];

function uid() {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function caseLabel(c) {
  const mm = String(c.month).padStart(2, '0');
  const dd = String(c.day).padStart(2, '0');
  const hh = String(c.hour).padStart(2, '0');
  const mi = String(c.minute ?? 0).padStart(2, '0');
  return `${c.year}-${mm}-${dd} ${hh}:${mi} · ${c.gender === 'nu' ? 'nữ' : 'nam'}`;
}

export function loadCases() {
  let stored = [];
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    stored = Array.isArray(arr) ? arr : [];
  } catch {
    stored = [];
  }
  const byId = new Map(SEED_CASES.map((s) => [s.id, { ...s }]));
  for (const row of stored) {
    if (!row || !row.id) continue;
    byId.set(row.id, { ...byId.get(row.id), ...row });
  }
  return [...byId.values()].sort((a, b) => {
    if (a.sample && !b.sample) return -1;
    if (!a.sample && b.sample) return 1;
    return String(b.updatedAt || b.id).localeCompare(String(a.updatedAt || a.id));
  });
}

export function saveCases(list) {
  const user = (list || []).filter((c) => c && c.id && !c.sample);
  localStorage.setItem(KEY, JSON.stringify(user.slice(0, 80)));
}

export function upsertCase(partial) {
  const list = loadCases();
  const now = new Date().toISOString();
  if (partial.id) {
    const i = list.findIndex((c) => c.id === partial.id);
    if (i >= 0) {
      list[i] = { ...list[i], ...partial, updatedAt: now };
      saveCases(list);
      return list[i];
    }
  }
  const row = {
    id: uid(),
    name: String(partial.name || 'Hồ sơ mới').slice(0, 40),
    year: Number(partial.year),
    month: Number(partial.month),
    day: Number(partial.day),
    hour: Number(partial.hour ?? 12),
    minute: Number(partial.minute ?? 0),
    gender: partial.gender === 'nu' ? 'nu' : 'nam',
    createdAt: now,
    updatedAt: now,
    sample: false,
  };
  list.push(row);
  saveCases(list);
  return row;
}

export function removeCase(id) {
  const list = loadCases().filter((c) => c.id !== id);
  saveCases(list);
  return list;
}

export function getCase(id) {
  return loadCases().find((c) => c.id === id) || null;
}
