// ============================================================================
//  an-view.js — sổ ÁN GIA TỘC (màn mở app)
// ============================================================================
import { el, clear } from './ui.js';
import {
  loadAns, upsertAn, addMember, removeAn, ROLE_OPTS,
  roleVi, memberDateLine, anSummary, SAMPLE_AN_ID,
} from './family-cases.js';

export function mountAn(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-cases', id: 'ios-an-root' });
  host.appendChild(root);

  const paint = () => {
    clear(root);
    const list = loadAns();
    root.append(
      el('header', { class: 'ios-lib-head' }, [
        el('h1', { text: 'Lữ Đăng' }),
        el('p', { class: 'ios-muted', text: 'Hiệu chỉnh giờ · 校正时辰' }),
        el('p', { class: 'ios-muted tiny', text: 'Sổ án gia tộc — thêm người thân, xếp 12 giờ theo độ nhất quán dữ liệu.' }),
      ]),
      el('p', { class: 'ios-count', id: 'ios-an-count', text: `${list.length} án gia tộc` }),
    );

    const ul = el('div', { class: 'ios-list', id: 'ios-an-list' });
    for (const an of list) {
      const people = el('div', { class: 'ios-an-people' });
      for (const m of an.members || []) {
        people.appendChild(el('div', { class: 'ios-muted tiny', text: `${roleVi(m.role)} · ${m.label} · ${memberDateLine(m)}` }));
      }
      ul.appendChild(el('div', { class: 'ios-case-row' }, [
        el('button', {
          type: 'button',
          class: 'ios-list-item',
          'data-an-id': an.id,
          onClick: () => ctx.onOpenAn && ctx.onOpenAn(an.id),
        }, [
          el('div', { class: 'ios-case-name', text: an.title }),
          el('div', { class: 'ios-muted', text: anSummary(an) }),
          people,
          el('div', { class: 'ios-badges' }, [
            an.sample ? el('span', { class: 'ios-chip', text: 'Án mẫu' }) : null,
            (an.members || []).some((m) => m.hourUnknown)
              ? el('span', { class: 'ios-chip', text: 'giờ chưa rõ' })
              : null,
          ].filter(Boolean)),
        ]),
        an.sample ? null : el('button', {
          type: 'button',
          class: 'ios-btn-ghost',
          text: 'Xoá',
          'aria-label': `Xoá ${an.title}`,
          onClick: () => { removeAn(an.id); paint(); },
        }),
      ]));
    }
    root.appendChild(ul);

    const titleIn = el('input', { type: 'text', class: 'ios-search', maxlength: '40', placeholder: 'Tên án (vd. họ Trần — con 2018)', 'aria-label': 'Tên án gia tộc' });
    root.append(
      el('p', { class: 'ios-section-label', text: 'THÊM ÁN GIA TỘC' }),
      el('div', { class: 'ios-lab-form' }, [
        el('label', { class: 'ios-lab-field', style: 'grid-column:1/-1' }, [el('span', { text: 'Tên án' }), titleIn]),
      ]),
      el('button', {
        type: 'button',
        class: 'ios-btn-ghost',
        text: 'Tạo án trống',
        onClick: () => {
          upsertAn({ title: titleIn.value.trim() || 'Án mới', members: [] });
          paint();
        },
      }),
    );

    const anPick = el('select', { class: 'ios-search', 'aria-label': 'Chọn án để thêm người thân' });
    for (const an of list.filter((a) => !a.sample)) {
      anPick.appendChild(el('option', { value: an.id, text: an.title }));
    }
    if (!anPick.options.length) {
      anPick.appendChild(el('option', { value: '', text: 'Tạo án trước (án mẫu không sửa)' }));
    }
    const roleSel = el('select', { class: 'ios-search', 'aria-label': 'Vai trò trong án' });
    for (const r of ROLE_OPTS) roleSel.appendChild(el('option', { value: r.id, text: r.vi }));
    roleSel.value = 'child';
    const nameIn = el('input', { type: 'text', class: 'ios-search', maxlength: '40', placeholder: 'Tên / mã người thân', 'aria-label': 'Tên người thân' });
    const dateIn = el('input', { type: 'date', class: 'ios-search', value: '2018-03-08', min: '1900-01-01', max: '2100-12-31', 'aria-label': 'Ngày sinh người thân' });
    const timeIn = el('input', { type: 'time', class: 'ios-search', value: '09:30', 'aria-label': 'Giờ sinh (tuỳ chọn)' });
    const unknown = el('input', { type: 'checkbox', id: 'ios-hour-unknown' });
    unknown.checked = true;
    const gNam = el('input', { type: 'radio', name: 'ios-rel-g', id: 'ios-rel-g-nam', value: 'nam' });
    const gNu = el('input', { type: 'radio', name: 'ios-rel-g', id: 'ios-rel-g-nu', value: 'nu', checked: true });

    unknown.addEventListener('change', () => {
      timeIn.disabled = unknown.checked;
    });
    timeIn.disabled = true;

    root.append(
      el('p', { class: 'ios-section-label', text: 'THÊM NGƯỜI THÂN VÀO ÁN' }),
      el('div', { class: 'ios-lab-form' }, [
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Án' }), anPick]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Vai trò' }), roleSel]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Tên' }), nameIn]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Ngày' }), dateIn]),
        el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Giờ (nếu rõ)' }), timeIn]),
        el('div', { class: 'ios-lab-field' }, [
          el('span', { text: 'Giới' }),
          el('div', { class: 'ios-lab-seg' }, [
            gNam, el('label', { for: 'ios-rel-g-nam', text: 'Nam' }),
            gNu, el('label', { for: 'ios-rel-g-nu', text: 'Nữ' }),
          ]),
        ]),
        el('label', { class: 'ios-lab-field ios-check-row', style: 'grid-column:1/-1' }, [
          unknown,
          el('span', { text: 'Giờ chưa rõ — sẽ xếp 12 时辰' }),
        ]),
      ]),
      el('button', {
        type: 'button',
        class: 'ios-btn-primary',
        text: 'Thêm người thân vào án',
        onClick: () => {
          if (!anPick.value) return;
          const [y, m, d] = String(dateIn.value || '').split('-').map(Number);
          const [hh, mi] = String(timeIn.value || '12:00').split(':').map(Number);
          if (!y || !m || !d) return;
          addMember(anPick.value, {
            role: roleSel.value,
            label: nameIn.value.trim() || roleVi(roleSel.value),
            year: y, month: m, day: d,
            hour: unknown.checked ? null : (hh ?? 12),
            minute: unknown.checked ? 0 : (mi || 0),
            gender: gNu.checked ? 'nu' : 'nam',
            hourUnknown: unknown.checked,
          });
          paint();
        },
      }),
    );
  };

  paint();
  if (ctx.preloadId) {
    /* list already has sample */
  }
  return { sampleId: SAMPLE_AN_ID };
}
