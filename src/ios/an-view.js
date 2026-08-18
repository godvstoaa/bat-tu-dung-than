// ============================================================================
//  an-view.js — một bản in 四柱 教材 (cold open: không dương lịch)
// ============================================================================
import { el, clear } from './ui.js';
import {
  loadAns, upsertAn, removeAn, isPrintedCase,
  roleVi, anSummary, plateChips, SAMPLE_AN_ID,
} from './family-cases.js';
import { memberStemBranchLine } from './family-run.js';

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
        el('p', { class: 'ios-muted', text: '四柱 教材 · 校正' }),
        el('p', { class: 'ios-muted tiny', text: 'Bản in 四柱 — thi khóa 时辰, hiệu khảo đoạn kinh, đối 应期.' }),
      ]),
      el('p', { class: 'ios-count', id: 'ios-an-count', text: `${list.filter((a) => a.jiaocai).length} bản in 教材` }),
    );

    const ul = el('div', { class: 'ios-list', id: 'ios-an-list' });
    for (const an of list) {
      const people = el('div', { class: 'ios-an-people' });
      for (const m of an.members || []) {
        people.appendChild(el('div', {
          class: 'ios-an-pillar zh',
          text: `${roleVi(m.role)} · ${memberStemBranchLine(m)}`,
        }));
      }
      if (!(an.members || []).length) {
        people.appendChild(el('div', { class: 'ios-muted tiny', text: 'Chưa gắn trụ' }));
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
          el('div', { class: 'ios-badges' }, plateChips(an).map((t) => el('span', { class: 'ios-chip', text: t }))),
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
      el('p', { class: 'ios-muted tiny', text: 'Gắn trụ trên tab Đối — không nhập dương lịch ở đây.' }),
    );
  };

  paint();
  return { sampleId: SAMPLE_AN_ID };
}
