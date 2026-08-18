// ============================================================================
//  reading-view.js — trang đọc 5 tab nội dung + nguồn (không link ngoài)
// ============================================================================
import { el, clear, esc } from './ui.js';
import { loadEntry } from './corpus.js';

const PANELS = [
  { id: 'summary', label: 'Tóm lược' },
  { id: 'original', label: 'Nguyên văn' },
  { id: 'reasoning', label: 'Lập luận' },
  { id: 'translation', label: 'Bản dịch' },
  { id: 'sources', label: 'Nguồn' },
];

function block(title, text) {
  if (!text || !String(text).trim()) return null;
  return el('section', { class: 'ios-block' }, [
    el('h4', { text: title }),
    el('p', { class: 'ios-prose', text: String(text).trim() }),
  ]);
}

function renderPanel(entry, id) {
  const wrap = el('div', { class: 'ios-reader-panel', role: 'tabpanel' });
  if (id === 'summary') {
    for (const n of [
      block('Tóm lược', entry.meaning),
      block('Tinh yếu', entry.deep_essence),
      block('Ứng dụng', entry.deep_application || entry.use),
    ]) if (n) wrap.appendChild(n);
    if (!wrap.childNodes.length) wrap.appendChild(el('p', { class: 'ios-muted', text: 'Chưa có tóm lược trong corpus.' }));
  } else if (id === 'original') {
    const han = (entry.han_text || '').trim();
    const passages = (entry.deep_passages || '').trim();
    if (han.length >= 20) wrap.appendChild(block('Nguyên văn Hán', han));
    else {
      wrap.appendChild(el('p', {
        class: 'ios-warn',
        text: 'Gói dữ liệu hiện tại không có toàn văn Hán đủ dài cho mục này — chỉ có thể có trích đoạn.',
      }));
      if (han) wrap.appendChild(block('Trích đoạn Hán', han));
    }
    if (passages) wrap.appendChild(block('Đoạn sâu', passages));
  } else if (id === 'reasoning') {
    for (const n of [
      block('Luận đề', entry.logic_thesis),
      block('Chuỗi lập luận', entry.logic_chain),
      block('Thực hành', entry.logic_practice),
      block('Đối chiếu', entry.logic_compare),
      block('Liên hệ', entry.deep_related),
    ]) if (n) wrap.appendChild(n);
    if (!wrap.childNodes.length) wrap.appendChild(el('p', { class: 'ios-muted', text: 'Chưa có chuỗi lập luận.' }));
  } else if (id === 'translation') {
    const vn = (entry.full_vn || '').trim();
    if (vn.length >= 50) wrap.appendChild(block('Bản dịch tiếng Việt', vn));
    else wrap.appendChild(el('p', { class: 'ios-muted', text: 'Chưa có bản dịch Việt đủ dài.' }));
  } else if (id === 'sources') {
    const meta = [
      entry.bu && `Bộ: ${entry.bu}`,
      entry.author && `Tác giả: ${entry.author}`,
      entry.era && `Thời kỳ: ${entry.era}`,
      entry.dz && `Số hiệu: ${entry.dz}`,
      entry.textual_certainty && `Độ tin văn bản: ${entry.textual_certainty}`,
      entry.notes && `Ghi chú: ${entry.notes}`,
    ].filter(Boolean);
    wrap.appendChild(el('ul', { class: 'ios-meta-list' }, meta.map((t) => el('li', { text: t }))));
    const srcs = Array.isArray(entry.sources) ? entry.sources : [];
    wrap.appendChild(el('h4', { text: 'Tham chiếu (sao chép — không mở web)' }));
    if (!srcs.length) wrap.appendChild(el('p', { class: 'ios-muted', text: 'Không có nguồn.' }));
    srcs.forEach((s, i) => {
      const row = el('div', { class: 'ios-source-row' }, [
        el('code', { class: 'ios-source-text', text: s }),
        el('button', {
          type: 'button',
          class: 'ios-btn-copy',
          text: 'Sao chép',
          'aria-label': `Sao chép nguồn ${i + 1}`,
          onClick: async () => {
            try { await navigator.clipboard.writeText(s); } catch { /* ignore */ }
          },
        }),
      ]);
      wrap.appendChild(row);
    });
  }
  return wrap;
}

/**
 * @param {HTMLElement} host
 * @param {string} sid
 * @param {{ onBack: () => void, onSave?: (entry) => void }} opts
 */
export async function openReader(host, sid, opts) {
  clear(host);
  host.appendChild(el('p', { class: 'ios-muted', text: 'Đang tải…' }));
  const entry = await loadEntry(sid);
  clear(host);

  const head = el('div', { class: 'ios-reader-head' }, [
    el('button', { type: 'button', class: 'ios-back', text: '← Quay lại', onClick: () => opts.onBack() }),
    el('h2', { class: 'ios-reader-title', html: `<span class="zh">${esc(entry.name_han)}</span>` }),
    el('p', { class: 'ios-muted', text: entry.name_vi || '' }),
    el('div', { class: 'ios-badges' }, [
      entry.textual_certainty === 'high' && el('span', { class: 'ios-chip', text: 'Đối chiếu tốt' }),
      entry.dz && el('span', { class: 'ios-chip', text: entry.dz }),
      entry.bu && el('span', { class: 'ios-chip', text: entry.bu }),
    ].filter(Boolean)),
  ]);
  host.appendChild(head);

  if (typeof opts.onSave === 'function') {
    host.appendChild(el('button', {
      type: 'button',
      class: 'ios-btn-primary',
      text: 'Lưu trích dẫn',
      onClick: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        opts.onSave(entry);
      },
    }));
  }

  const tablist = el('div', { class: 'ios-subtabs', role: 'tablist', 'aria-label': 'Phần nội dung' });
  const panelHost = el('div', { class: 'ios-reader-body' });
  let active = 'summary';

  const paint = () => {
    clear(tablist);
    clear(panelHost);
    for (const p of PANELS) {
      const btn = el('button', {
        type: 'button',
        class: 'ios-subtab' + (p.id === active ? ' active' : ''),
        role: 'tab',
        'aria-selected': p.id === active ? 'true' : 'false',
        text: p.label,
        onClick: () => { active = p.id; paint(); },
      });
      tablist.appendChild(btn);
    }
    panelHost.appendChild(renderPanel(entry, active));
  };
  paint();
  host.appendChild(tablist);
  host.appendChild(panelHost);
  return entry;
}
