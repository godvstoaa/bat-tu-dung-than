// ============================================================================
//  an-view.js — danh sách án cổ / 教材 (cold open: không form ngày/giờ)
// ============================================================================
import { el, clear } from './ui.js';
import {
  loadAns, upsertAn, removeAn, isPrintedCase,
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
        el('p', { class: 'ios-muted', text: 'Án cổ · 校正' }),
        el('p', { class: 'ios-muted tiny', text: 'Mở bản in 教材 — hiệu khảo, thi khóa giờ, đối 应期.' }),
      ]),
      el('p', { class: 'ios-count', id: 'ios-an-count', text: `${list.length} án cổ / 教材` }),
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
            an.jiaocai ? el('span', { class: 'ios-chip', text: 'Án cổ' }) : null,
            an.jiaocai ? el('span', { class: 'ios-chip', text: '教材' }) : null,
            an.jiaocai ? el('span', { class: 'ios-chip', text: '印本' }) : null,
            (an.members || []).some((m) => m.hourUnknown)
              ? el('span', { class: 'ios-chip', text: 'giờ chưa rõ' })
              : null,
          ].filter(Boolean)),
        ]),
        isPrintedCase(an) ? null : el('button', {
          type: 'button',
          class: 'ios-btn-ghost',
          text: 'Xoá',
          'aria-label': `Xoá ${an.title}`,
          onClick: () => { removeAn(an.id); paint(); },
        }),
      ]));
    }
    root.appendChild(ul);

    const titleIn = el('input', {
      type: 'text',
      class: 'ios-search',
      maxlength: '40',
      placeholder: 'Tên án (chỉ tiêu đề)',
      'aria-label': 'Tên án trống',
    });
    root.append(
      el('p', { class: 'ios-section-label', text: 'ÁN TRỐNG' }),
      el('div', { class: 'ios-lab-form' }, [
        el('label', { class: 'ios-lab-field', style: 'grid-column:1/-1' }, [el('span', { text: 'Tên án' }), titleIn]),
      ]),
      el('button', {
        type: 'button',
        class: 'ios-btn-ghost',
        text: 'Tạo án trống',
        onClick: () => {
          upsertAn({ title: titleIn.value.trim() || 'Án trống', members: [] });
          paint();
        },
      }),
      el('p', { class: 'ios-muted tiny', text: 'Gắn người thân trên cây (tab Đối) — không nhập ngày sinh ở đây.' }),
    );
  };

  paint();
  return { sampleId: SAMPLE_AN_ID };
}
