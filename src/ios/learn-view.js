// ============================================================================
//  learn-view.js
// ============================================================================
import { el, clear } from './ui.js';
import { loadIndex } from './corpus.js';
import { resolvePaths } from './curriculum.js';
import { openReader } from './reading-view.js';
import { upsertCitation } from './notes.js';

export async function mountLearn(host) {
  clear(host);
  const root = el('div', { class: 'ios-learn' });
  host.appendChild(root);
  const idx = await loadIndex();
  const paths = resolvePaths(idx.items || []);
  const readerHost = el('div', { class: 'ios-reader-host hidden' });
  const listHost = el('div');
  root.append(listHost, readerHost);

  const paintList = () => {
    clear(listHost);
    listHost.appendChild(el('h2', { text: 'Lộ trình học' }));
    listHost.appendChild(el('p', { class: 'ios-muted', text: `${paths.length} lộ trình · mã mục đã đối chiếu corpus.` }));
    for (const p of paths) {
      const card = el('article', { class: 'ios-day-card' }, [
        el('h3', { text: p.title }),
        el('p', { class: 'ios-muted', text: `${p.okCount}/${p.steps.length} bước tra được` + (p.broken ? ` · ${p.broken} thiếu` : '') }),
      ]);
      const steps = el('div', { class: 'ios-list' });
      p.steps.forEach((st, i) => {
        const btn = el('button', {
          type: 'button',
          class: 'ios-list-item',
          disabled: !st.ok,
          text: `${i + 1}. ${st.name_han}${st.ok ? '' : ' (thiếu dữ liệu)'}`,
          onClick: async () => {
            if (!st.ok) return;
            listHost.classList.add('hidden');
            readerHost.classList.remove('hidden');
            await openReader(readerHost, st.sid, {
              onBack: () => {
                clear(readerHost);
                readerHost.classList.add('hidden');
                listHost.classList.remove('hidden');
                btn.dataset.done = '1';
                btn.textContent = `${i + 1}. ✓ ${st.name_han}`;
              },
              onSave: (entry) => {
                upsertCitation(entry);
                const b = readerHost.querySelector('.ios-btn-primary');
                if (b) b.textContent = 'Đã lưu trích dẫn';
              },
            });
          },
        });
        steps.appendChild(btn);
      });
      card.appendChild(steps);
      listHost.appendChild(card);
    }
  };
  paintList();
}
