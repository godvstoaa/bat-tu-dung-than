// ============================================================================
//  shell.js — Án (mặc định) · Đối · Thư viện
// ============================================================================
import { el, clear } from './ui.js';
import { mountLibrary } from './library-view.js';
import { mountAn } from './an-view.js';
import { mountNghiem } from './nghiem-view.js';
import { upsertCitation } from './notes.js';
import { SAMPLE_AN_ID } from './family-cases.js';
import './ios.css';

const TABS = [
  { id: 'an', label: 'Án', icon: '家系' },
  { id: 'nghiem', label: 'Đối', icon: '校正' },
  { id: 'library', label: 'Thư viện', icon: '出典' },
];

let _state = { tab: 'an', anId: SAMPLE_AN_ID };
let _libApi = null;

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
      hidden: t.id !== 'an',
    });
    panelNodes[t.id] = p;
    panels.appendChild(p);

    const btn = el('button', {
      id: `ios-tab-${t.id}`,
      type: 'button',
      class: 'ios-tab' + (t.id === 'an' ? ' active' : ''),
      role: 'tab',
      'aria-selected': t.id === 'an' ? 'true' : 'false',
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

  async function openCite(row) {
    await selectTab('library');
    if (_libApi && row?.sid) {
      await _libApi.showReader(row.sid, { highlight: row.quote, panel: row.panel });
    }
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
    if (!force && p.dataset.ready === '1' && id !== 'nghiem' && id !== 'an') return;

    if (id === 'an') {
      mountAn(p, {
        onOpenAn: (anId) => {
          _state.anId = anId;
          selectTab('nghiem');
        },
      });
    } else if (id === 'nghiem') {
      await mountNghiem(p, {
        anId: _state.anId,
        onBackList: () => selectTab('an'),
        onOpenCite: openCite,
        onTreeChanged: () => selectTab('nghiem'),
      });
    } else if (id === 'library') {
      if (p.dataset.ready === '1' && _libApi) return;
      _libApi = await mountLibrary(p, {
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

  await ensurePanel('an', true);
}
