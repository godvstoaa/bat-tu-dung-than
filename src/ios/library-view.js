// ============================================================================
//  library-view.js — Thư viện offline (màn mặc định)
// ============================================================================
import { el, clear } from './ui.js';
import { loadIndex, searchIndex, readerOfDay, collectChips } from './corpus.js';
import { openReader } from './reading-view.js';

export async function mountLibrary(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-lib' });
  host.appendChild(root);

  const header = el('header', { class: 'ios-lib-head' }, [
    el('h1', { text: 'Lữ Đăng' }),
    el('p', { class: 'ios-muted', text: 'Thư viện 1523 kinh điển · tìm kiếm · chú giải nhiều tầng — offline' }),
  ]);
  const qInput = el('input', {
    id: 'ios-lib-q',
    type: 'search',
    class: 'ios-search',
    placeholder: 'Tìm Hán / Việt / DZ# / bộ…',
    'aria-label': 'Tìm trong thư viện',
    autocomplete: 'off',
  });
  const clearBtn = el('button', { type: 'button', class: 'ios-btn-ghost', text: 'Xoá' });
  const searchRow = el('div', { class: 'ios-search-row' }, [qInput, clearBtn]);

  const chipsBu = el('div', { class: 'ios-chip-row', 'aria-label': 'Bộ trong Đạo Tàng' });
  const chipsTopic = el('div', { class: 'ios-chip-row', 'aria-label': 'Chủ đề' });
  const dayCard = el('div', { class: 'ios-day-card' });
  const countLine = el('p', { class: 'ios-count' });
  const list = el('div', { class: 'ios-list', role: 'list' });
  const readerHost = el('div', { class: 'ios-reader-host hidden' });

  root.append(header, searchRow,
    el('p', { class: 'ios-section-label', text: 'BỘ TRONG ĐẠO TÀNG' }), chipsBu,
    el('p', { class: 'ios-section-label', text: 'CHỦ ĐỀ' }), chipsTopic,
    dayCard, countLine, list, readerHost);

  const data = await loadIndex();
  const items = data.items || [];
  let filterBu = '';
  let filterTopic = '';
  let q = '';
  let debounce = null;

  const chips = collectChips(items);
  const TOPIC_VI = {
    cultivation: 'Tu luyện', ritual: 'Khoa nghi', classic: 'Kinh điển',
    biography: 'Tiên truyện', alchemy: 'Đan đạo', ethics: 'Giới luật',
    liturgy: 'Khoa nghi', scripture: 'Kinh điển', history: 'Sử chí',
    medicine: 'Y đạo', talisman: 'Phù lục', cosmology: 'Vũ trụ luận',
  };
  const labelOf = (name) => TOPIC_VI[name] || name;

  const paintChips = (row, pairs, kind) => {
    clear(row);
    for (const [name, n] of pairs) {
      const btn = el('button', {
        type: 'button',
        class: 'ios-filter-chip',
        role: 'checkbox',
        'aria-checked': 'false',
        text: `${labelOf(name)} ${n}`,
        title: name,
        onClick: () => {
          if (kind === 'bu') filterBu = filterBu === name ? '' : name;
          else filterTopic = filterTopic === name ? '' : name;
          sync();
        },
      });
      row.appendChild(btn);
    }
  };
  paintChips(chipsBu, chips.bu, 'bu');
  paintChips(chipsTopic, chips.topic, 'topic');

  const rod = readerOfDay(items);
  if (rod) {
    dayCard.append(
      el('p', { class: 'ios-section-label', text: `MỤC ĐỌC HÔM NAY · ${new Date().toISOString().slice(0, 10)}` }),
      el('h3', { class: 'zh', text: rod.name_han }),
      el('p', { text: rod.name_vi || '' }),
      el('div', { class: 'ios-badges' }, [
        rod.textual_certainty === 'high' && el('span', { class: 'ios-chip', text: 'Đối chiếu tốt' }),
        rod.bu && el('span', { class: 'ios-chip', text: rod.bu }),
        rod.topic && el('span', { class: 'ios-chip', text: rod.topic }),
      ].filter(Boolean)),
      el('button', {
        type: 'button',
        class: 'ios-btn-primary',
        text: 'Đọc mục này',
        onClick: () => showReader(rod.sid),
      }),
      el('p', { class: 'ios-muted tiny', text: 'Chọn tất định theo ngày từ nhóm đối chiếu tốt — không ngẫu nhiên mỗi lần mở.' }),
    );
  }

  async function showReader(sid) {
    root.querySelectorAll('.ios-lib > :not(.ios-reader-host)').forEach((n) => n.classList.add('hidden'));
    readerHost.classList.remove('hidden');
    await openReader(readerHost, sid, {
      onBack: () => {
        clear(readerHost);
        readerHost.classList.add('hidden');
        root.querySelectorAll('.ios-lib > :not(.ios-reader-host)').forEach((n) => n.classList.remove('hidden'));
      },
      onSave: (entry) => {
        if (typeof ctx.onSaveCitation === 'function') ctx.onSaveCitation(entry);
        else {
          // S1: tạm lưu tối thiểu — S2 thay bằng notes store
          const key = 'ludang-notes-v1';
          let arr = [];
          try { arr = JSON.parse(localStorage.getItem(key) || '[]'); } catch { arr = []; }
          if (!arr.some((x) => x.sid === entry.sid)) {
            arr.unshift({
              sid: entry.sid,
              name_han: entry.name_han,
              name_vi: entry.name_vi,
              dz: entry.dz,
              sources: entry.sources,
              savedAt: new Date().toISOString(),
              body: '',
            });
            localStorage.setItem(key, JSON.stringify(arr.slice(0, 200)));
          }
          const btn = readerHost.querySelector('.ios-btn-primary');
          if (btn) btn.textContent = 'Đã lưu trích dẫn';
        }
      },
    });
  }

  function sync() {
    // update chip aria — khớp theo title (id gốc), không theo nhãn đã dịch
    [...chipsBu.children].forEach((b) => {
      const name = b.getAttribute('title') || b.textContent.replace(/\s+\d+$/, '');
      b.setAttribute('aria-checked', filterBu === name ? 'true' : 'false');
      b.classList.toggle('active', filterBu === name);
    });
    [...chipsTopic.children].forEach((b) => {
      const name = b.getAttribute('title') || b.textContent.replace(/\s+\d+$/, '');
      b.setAttribute('aria-checked', filterTopic === name ? 'true' : 'false');
      b.classList.toggle('active', filterTopic === name);
    });

    let pool = items;
    if (filterBu) pool = pool.filter((i) => i.bu === filterBu);
    if (filterTopic) pool = pool.filter((i) => i.topic === filterTopic);
    const found = searchIndex(pool, q);
    countLine.textContent = q || filterBu || filterTopic
      ? `${found.length} kết quả / ${pool.length} mục lọc`
      : `${items.length} mục`;
    clear(list);
    for (const it of found) {
      const row = el('button', {
        type: 'button',
        class: 'ios-list-item',
        role: 'listitem',
        onClick: () => showReader(it.sid),
      }, [
        el('div', { class: 'zh', text: it.name_han }),
        el('div', { class: 'ios-muted', text: it.name_vi || it.dz || '' }),
        el('div', { class: 'ios-badges' }, [
          it.bu && el('span', { class: 'ios-chip', text: it.bu }),
          it.textual_certainty === 'high' && el('span', { class: 'ios-chip', text: 'Đối chiếu tốt' }),
          it.dz && el('span', { class: 'ios-chip', text: it.dz }),
        ].filter(Boolean)),
      ]);
      list.appendChild(row);
    }
  }

  qInput.addEventListener('input', () => {
    q = qInput.value;
    clearTimeout(debounce);
    debounce = setTimeout(sync, 140);
  });
  clearBtn.addEventListener('click', () => {
    qInput.value = '';
    q = '';
    sync();
    qInput.focus();
  });

  // Event delegation: mở entry qua data-sid nếu có
  root.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-sid]');
    if (t && t.dataset.sid) showReader(t.dataset.sid);
  });

  sync();
  return { showReader, items };
}
