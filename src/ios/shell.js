// ============================================================================
//  shell.js — bàn thầy: Hồ sơ (mặc định) · Bàn · So sánh · Thư viện
// ============================================================================
import { el, clear } from './ui.js';
import { mountLibrary } from './library-view.js';
import { mountCases } from './cases-view.js';
import { mountCase } from './case-view.js';
import { mountCompareCases } from './compare-cases-view.js';
import { upsertCitation } from './notes.js';
import './ios.css';

const TABS = [
  { id: 'cases', label: 'Hồ sơ', icon: '🗂' },
  { id: 'desk', label: 'Bàn', icon: '🧮' },
  { id: 'compare', label: 'So sánh', icon: '⚖' },
  { id: 'library', label: 'Thư viện', icon: '📚' },
];

let _state = { tab: 'cases', caseId: 'sample-1990' };

export async function initIosShell() {
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
      hidden: t.id !== 'cases',
    });
    panelNodes[t.id] = p;
    panels.appendChild(p);

    const btn = el('button', {
      id: `ios-tab-${t.id}`,
      type: 'button',
      class: 'ios-tab' + (t.id === 'cases' ? ' active' : ''),
      role: 'tab',
      'aria-selected': t.id === 'cases' ? 'true' : 'false',
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

  function openClassic(q) {
    selectTab('library').then(() => {
      const input = document.getElementById('ios-lib-q');
      if (!input) return;
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

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
    await ensurePanel(id, true);
  }

  async function ensurePanel(id, force) {
    const p = panelNodes[id];
    if (!force && p.dataset.ready === '1' && id !== 'desk' && id !== 'compare' && id !== 'cases') return;

    if (id === 'cases') {
      mountCases(p, {
        onOpenCase: (caseId) => {
          _state.caseId = caseId;
          selectTab('desk');
        },
      });
    } else if (id === 'desk') {
      await mountCase(p, {
        caseId: _state.caseId,
        onBackList: () => selectTab('cases'),
        onOpenClassic: openClassic,
      });
    } else if (id === 'compare') {
      await mountCompareCases(p, {
        caseA: 'sample-1990',
        caseB: 'sample-1985',
        onOpenClassic: openClassic,
      });
    } else if (id === 'library') {
      if (p.dataset.ready === '1') return;
      await mountLibrary(p, {
        onSaveCitation: (entry) => {
          upsertCitation(entry);
          const btns = p.querySelectorAll('.ios-btn-primary');
          btns.forEach((btn) => {
            if (/Lưu trích dẫn|Đã lưu/.test(btn.textContent || '')) btn.textContent = 'Đã lưu trích dẫn';
          });
        },
      });
    }
    p.dataset.ready = '1';
  }

  await ensurePanel('cases', true);
}
