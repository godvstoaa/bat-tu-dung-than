// ============================================================================
//  shell.js — tab bar research-first (chỉ mount khi --mode ios)
// ============================================================================
import { IOS_BUILD } from './flags.js';
import { el, clear } from './ui.js';
import { mountLibrary } from './library-view.js';
import './ios.css';

const TABS = [
  { id: 'library', label: 'Thư viện', icon: '📚' },
  { id: 'study', label: 'Học', icon: '🎓' },
  { id: 'compare', label: 'Đối chiếu', icon: '⚖' },
  { id: 'notes', label: 'Ghi chú', icon: '🔖' },
  { id: 'lab', label: 'Chart Lab', icon: '🧪' },
];

let _state = { tab: 'library' };

function placeholder(title, blurb) {
  return el('div', { class: 'ios-placeholder' }, [
    el('h2', { text: title }),
    el('p', { class: 'ios-muted', text: blurb }),
    el('p', { class: 'ios-muted tiny', text: 'Đang hoàn thiện trong sprint tiếp theo — không có tính năng giả.' }),
  ]);
}

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

  // Keyboard arrows on tablist
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
    try {
      if (window.Capacitor?.Plugins?.Haptics?.selectionChanged) {
        await window.Capacitor.Plugins.Haptics.selectionChanged();
      }
    } catch { /* ignore */ }
    await ensurePanel(id);
  }

  async function ensurePanel(id) {
    const p = panelNodes[id];
    if (p.dataset.ready === '1' && id !== 'library') return;
    if (id === 'library') {
      if (p.dataset.ready === '1') return;
      await mountLibrary(p, {});
      p.dataset.ready = '1';
      return;
    }
    clear(p);
    if (id === 'study') p.appendChild(placeholder('Học', 'Lộ trình học theo cổ bản sẽ mở ở sprint S2.'));
    else if (id === 'compare') p.appendChild(placeholder('Đối chiếu', 'So sánh hai nguồn / trường phái sẽ mở ở sprint S2.'));
    else if (id === 'notes') p.appendChild(placeholder('Ghi chú', 'Trích dẫn đã lưu sẽ quản lý đầy đủ ở sprint S2. Nút «Lưu trích dẫn» trong Thư viện đã ghi localStorage.'));
    else if (id === 'lab') {
      p.appendChild(el('div', { class: 'ios-placeholder' }, [
        el('h2', { text: 'Chart Lab' }),
        el('p', { class: 'ios-muted', text: 'Bàn dựng lá số Bát Tự dùng làm case study — không phải màn hình mở app.' }),
        el('p', { class: 'ios-muted tiny', text: 'Case mẫu + mở app luận mệnh sẽ nối ở sprint S2. Hiện có thể hiện app cũ thủ công.' }),
        el('button', {
          type: 'button',
          class: 'ios-btn-primary',
          text: 'Hiện Chart Lab (app Bát Tự)',
          onClick: () => {
            document.body.classList.remove('ios-shell-active');
            document.body.classList.add('ios-legacy-visible');
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
    p.dataset.ready = '1';
  }

  await ensurePanel('library');
}

export function revealLegacyApp() {
  document.body.classList.remove('ios-shell-active');
  document.body.classList.add('ios-legacy-visible');
}
