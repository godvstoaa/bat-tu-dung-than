// ============================================================================
//  shell.js — tab bar research-first (chỉ mount khi --mode ios)
// ============================================================================
import { IOS_BUILD } from './flags.js';
import { el, clear } from './ui.js';
import { mountLibrary } from './library-view.js';
import { mountNotes } from './notes-view.js';
import { mountLearn } from './learn-view.js';
import { mountCompare } from './compare-view.js';
import { buildSampleResult } from './sample-case.js';
import { upsertCitation } from './notes.js';
import './ios.css';

const TABS = [
  { id: 'library', label: 'Thư viện', icon: '📚' },
  { id: 'study', label: 'Học', icon: '🎓' },
  { id: 'compare', label: 'Đối chiếu', icon: '⚖' },
  { id: 'notes', label: 'Ghi chú', icon: '🔖' },
  { id: 'lab', label: 'Chart Lab', icon: '🧪' },
];

let _state = { tab: 'library' };

export async function initIosShell() {
  if (!IOS_BUILD) return;
  document.body.classList.add('ios-shell-active');

  let root = document.getElementById('ios-root');
  if (!root) {
    root = el('div', { id: 'ios-root', class: 'ios-root' });
    document.body.prepend(root);
  }
  clear(root);

  const panels = el('div', { class: 'ios-panels', id: 'ios-panels' });
  const tablist = el('nav', {
    class: 'ios-tabbar',
    role: 'tablist',
    'aria-label': 'Điều hướng chính',
  });

  const panelNodes = {};
  for (const t of TABS) {
    const p = el('div', {
      id: `ios-panel-${t.id}`,
      class: 'ios-panel',
      role: 'tabpanel',
      'aria-labelledby': `ios-tab-${t.id}`,
      hidden: t.id !== 'library',
    });
    panelNodes[t.id] = p;
    panels.appendChild(p);

    const btn = el('button', {
      id: `ios-tab-${t.id}`,
      type: 'button',
      class: 'ios-tab' + (t.id === 'library' ? ' active' : ''),
      role: 'tab',
      'aria-selected': t.id === 'library' ? 'true' : 'false',
      'aria-controls': `ios-panel-${t.id}`,
      onClick: () => selectTab(t.id),
    }, [
      el('span', { class: 'ios-tab-icon', 'aria-hidden': 'true', text: t.icon }),
      el('span', { class: 'ios-tab-label', text: t.label }),
    ]);
    tablist.appendChild(btn);
  }

  tablist.addEventListener('keydown', (ev) => {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    const ids = TABS.map((t) => t.id);
    const i = ids.indexOf(_state.tab);
    const next = ev.key === 'ArrowRight' ? ids[(i + 1) % ids.length] : ids[(i - 1 + ids.length) % ids.length];
    selectTab(next);
    document.getElementById(`ios-tab-${next}`)?.focus();
  });

  root.append(panels, tablist);

  async function selectTab(id) {
    _state.tab = id;
    for (const t of TABS) {
      const on = t.id === id;
      const btn = document.getElementById(`ios-tab-${t.id}`);
      if (btn) {
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      }
      panelNodes[t.id].hidden = !on;
    }
    await ensurePanel(id);
  }

  function mountLab(p) {
    clear(p);
    const { pillars, sample } = buildSampleResult();
    p.appendChild(el('div', { class: 'ios-placeholder' }, [
      el('h2', { text: 'Chart Lab' }),
      el('p', { class: 'ios-muted', text: 'Case study Bát Tự — không phải màn hình mở app. Không cần nhập ngày sinh để xem mẫu.' }),
      el('div', { class: 'ios-day-card' }, [
        el('p', { class: 'ios-section-label', text: 'CASE MẪU' }),
        el('p', { text: sample.label }),
        el('p', { class: 'zh', text: pillars }),
        el('p', { class: 'ios-muted tiny', text: 'Tứ trụ dựng bằng engine chart.js (xác định).' }),
      ]),
      el('button', {
        type: 'button',
        class: 'ios-btn-primary',
        text: 'Mở Chart Lab đầy đủ với case mẫu',
        onClick: () => {
          const date = document.getElementById('date');
          const time = document.getElementById('time');
          const gNam = document.getElementById('g-nam');
          if (date) date.value = '1990-06-15';
          if (time) time.value = '10:00';
          if (gNam) gNam.checked = true;
          document.body.classList.remove('ios-shell-active');
          document.body.classList.add('ios-legacy-visible');
          const form = document.getElementById('birth-form');
          if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
          else form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          let back = document.getElementById('ios-legacy-return');
          if (!back) {
            back = el('button', {
              id: 'ios-legacy-return',
              type: 'button',
              class: 'ios-legacy-return',
              text: '← Vỏ nghiên cứu',
              onClick: () => {
                document.body.classList.add('ios-shell-active');
                document.body.classList.remove('ios-legacy-visible');
                selectTab('library');
              },
            });
            document.body.appendChild(back);
          }
        },
      }),
    ]));
  }

  async function ensurePanel(id) {
    const p = panelNodes[id];
    if (id === 'notes') {
      await mountNotes(p);
      p.dataset.ready = '1';
      return;
    }
    if (p.dataset.ready === '1') return;
    if (id === 'library') {
      await mountLibrary(p, {
        onSaveCitation: (entry) => {
          upsertCitation(entry);
          const btns = p.querySelectorAll('.ios-btn-primary');
          btns.forEach((btn) => {
            if (/Lưu trích dẫn|Đã lưu/.test(btn.textContent || '')) btn.textContent = 'Đã lưu trích dẫn';
          });
        },
      });
    } else if (id === 'study') await mountLearn(p);
    else if (id === 'compare') await mountCompare(p);
    else if (id === 'lab') mountLab(p);
    p.dataset.ready = '1';
  }

  await ensurePanel('library');
}
