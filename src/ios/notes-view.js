// ============================================================================
//  notes-view.js
// ============================================================================
import { el, clear } from './ui.js';
import { loadNotes, updateNoteBody, removeNote, formatCitation } from './notes.js';

export function mountNotes(host) {
  clear(host);
  const root = el('div', { class: 'ios-notes' });
  host.appendChild(root);

  const paint = () => {
    clear(root);
    const notes = loadNotes();
    root.appendChild(el('h2', { text: 'Ghi chú & trích dẫn' }));
    root.appendChild(el('p', { class: 'ios-muted', text: `${notes.length} mục đã lưu trên máy (localStorage).` }));
    if (!notes.length) {
      root.appendChild(el('p', { class: 'ios-muted', text: 'Chưa có trích dẫn. Mở Thư viện → Đọc → Lưu trích dẫn.' }));
      return;
    }
    for (const n of notes) {
      const card = el('article', { class: 'ios-day-card' }, [
        el('h3', { class: 'zh', text: n.name_han }),
        el('p', { class: 'ios-muted', text: n.name_vi || n.dz || '' }),
        el('textarea', {
          class: 'ios-search',
          style: 'min-height:72px;width:100%;padding:10px;margin:8px 0',
          'aria-label': 'Ghi chú riêng',
          text: n.body || '',
        }),
      ]);
      const ta = card.querySelector('textarea');
      const row = el('div', { class: 'ios-search-row' }, [
        el('button', {
          type: 'button', class: 'ios-btn-primary', text: 'Lưu ghi chú',
          onClick: () => { updateNoteBody(n.sid, ta.value); paint(); },
        }),
        el('button', {
          type: 'button', class: 'ios-btn-ghost', text: 'Sao chép',
          onClick: async () => {
            try { await navigator.clipboard.writeText(formatCitation({ ...n, body: ta.value })); } catch { /* */ }
          },
        }),
        el('button', {
          type: 'button', class: 'ios-btn-ghost', text: 'Xóa',
          onClick: () => {
            if (card.dataset.confirm === '1') { removeNote(n.sid); paint(); }
            else { card.dataset.confirm = '1'; card.querySelector('button:last-child').textContent = 'Xác nhận xóa'; }
          },
        }),
      ]);
      card.appendChild(row);
      root.appendChild(card);
    }
  };
  paint();
  return { refresh: paint };
}
