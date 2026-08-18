// ============================================================================
//  notes.js — localStorage trích dẫn (ludang-notes-v1)
// ============================================================================
const KEY = 'ludang-notes-v1';

export function loadNotes() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveNotes(arr) {
  localStorage.setItem(KEY, JSON.stringify((arr || []).slice(0, 200)));
}

export function upsertCitation(entry, body = '') {
  const arr = loadNotes();
  const i = arr.findIndex((x) => x.sid === entry.sid);
  const row = {
    sid: entry.sid,
    name_han: entry.name_han || '',
    name_vi: entry.name_vi || '',
    dz: entry.dz || '',
    bu: entry.bu || '',
    author: entry.author || '',
    era: entry.era || '',
    textual_certainty: entry.textual_certainty || '',
    sources: Array.isArray(entry.sources) ? entry.sources.slice() : [],
    savedAt: new Date().toISOString(),
    body: body || (i >= 0 ? arr[i].body || '' : ''),
  };
  if (i >= 0) arr[i] = { ...arr[i], ...row };
  else arr.unshift(row);
  saveNotes(arr);
  return arr;
}

export function updateNoteBody(sid, body) {
  const arr = loadNotes();
  const i = arr.findIndex((x) => x.sid === sid);
  if (i < 0) return arr;
  arr[i] = { ...arr[i], body: String(body || '') };
  saveNotes(arr);
  return arr;
}

export function removeNote(sid) {
  const arr = loadNotes().filter((x) => x.sid !== sid);
  saveNotes(arr);
  return arr;
}

export function formatCitation(n) {
  const lines = [
    n.name_han || '',
    n.name_vi || '',
    n.dz ? `Đạo Tạng: ${n.dz}` : '',
    n.bu ? `Bộ: ${n.bu}` : '',
    n.author ? `Tác giả: ${n.author}` : '',
    n.era ? `Thời kỳ: ${n.era}` : '',
    n.textual_certainty ? `Độ tin: ${n.textual_certainty}` : '',
    'Tham chiếu:',
    ...(n.sources || []).map((s) => `- ${s}`),
    n.body ? `Ghi chú: ${n.body}` : '',
    `Lưu: ${n.savedAt || ''}`,
  ].filter(Boolean);
  return lines.join('\n');
}
