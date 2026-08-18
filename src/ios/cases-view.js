// ============================================================================
//  cases-view.js — sổ hồ sơ (màn mở app)
// ============================================================================
import { el, clear } from './ui.js';
import { loadCases, upsertCase, removeCase, caseLabel } from './cases.js';

export function mountCases(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-cases' });
  host.appendChild(root);

  const paint = () => {
    clear(root);
    const list = loadCases();
    root.append(
      el('header', { class: 'ios-lib-head' }, [
        el('h1', { text: 'Lữ Đăng' }),
        el('p', { class: 'ios-muted', text: 'Bàn thầy · sổ hồ sơ mệnh lý — mở case để xem bảng Tứ Trụ' }),
      ]),
      el('p', { class: 'ios-count', text: `${list.length} hồ sơ` }),
    );

    const ul = el('div', { class: 'ios-list', id: 'ios-case-list' });
    for (const c of list) {
      ul.appendChild(el('div', { class: 'ios-case-row' }, [
        el('button', {
          type: 'button',
          class: 'ios-list-item',
          onClick: () => ctx.onOpenCase && ctx.onOpenCase(c.id),
        }, [
          el('div', { class: 'ios-case-name', text: c.name }),
          el('div', { class: 'ios-muted', text: caseLabel(c) }),
          c.sample ? el('div', { class: 'ios-badges' }, [el('span', { class: 'ios-chip', text: 'Case mẫu' })]) : null,
        ]),
        c.sample ? null : el('button', {
          type: 'button',
          class: 'ios-btn-ghost',
          text: 'Xoá',
          'aria-label': `Xoá ${c.name}`,
          onClick: () => {
            removeCase(c.id);
            paint();
          },
        }),
      ]));
    }
    root.appendChild(ul);

    const nameIn = el('input', { type: 'text', class: 'ios-search', maxlength: '40', placeholder: 'Tên khách / mã hồ sơ', 'aria-label': 'Tên hồ sơ' });
    const dateIn = el('input', { type: 'date', class: 'ios-search', value: '1992-03-08', min: '1900-01-01', max: '2100-12-31', 'aria-label': 'Ngày sinh hồ sơ' });
    const timeIn = el('input', { type: 'time', class: 'ios-search', value: '09:30', 'aria-label': 'Giờ sinh hồ sơ' });
    const gNam = el('input', { type: 'radio', name: 'ios-new-g', id: 'ios-new-g-nam', value: 'nam', checked: true });
    const gNu = el('input', { type: 'radio', name: 'ios-new-g', id: 'ios-new-g-nu', value: 'nu' });

    root.append(
      el('p', { class: 'ios-section-label', text: 'THÊM HỒ SƠ' }),
      el('div', { class: 'ios-lab-form' }, [
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Tên' }), nameIn]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Ngày' }), dateIn]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Giờ' }), timeIn]),
        el('div', { class: 'ios-lab-field' }, [
          el('span', { text: 'Giới' }),
          el('div', { class: 'ios-lab-seg' }, [
            gNam, el('label', { for: 'ios-new-g-nam', text: 'Nam' }),
            gNu, el('label', { for: 'ios-new-g-nu', text: 'Nữ' }),
          ]),
        ]),
      ]),
      el('button', {
        type: 'button',
        class: 'ios-btn-primary',
        text: 'Lưu hồ sơ',
        onClick: () => {
          const [y, m, d] = String(dateIn.value || '').split('-').map(Number);
          const [hh, mi] = String(timeIn.value || '12:00').split(':').map(Number);
          if (!y || !m || !d) return;
          const row = upsertCase({
            name: nameIn.value.trim() || 'Hồ sơ mới',
            year: y, month: m, day: d, hour: hh || 0, minute: mi || 0,
            gender: gNu.checked ? 'nu' : 'nam',
          });
          paint();
          if (ctx.onOpenCase) ctx.onOpenCase(row.id);
        },
      }),
    );
  };

  paint();
}
