// ============================================================================
//  compare-cases-view.js — đối chiếu hai hồ sơ (bảng nghề, không CTA hợp tuổi)
// ============================================================================
import { el, clear } from './ui.js';
import { WX_VI, WUXING } from '../engine/constants.js';
import { loadCases, caseLabel } from './cases.js';
import { analyzeStudio } from './studio-analyze.js';
import { readyCite, citeLine } from './cite.js';

function wxVi(wx) {
  return wx ? `${WX_VI[wx] || wx} ${wx}` : '—';
}

function pick(label, list, value, onChange) {
  const sel = el('select', { class: 'ios-search', 'aria-label': label });
  for (const c of list) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} · ${caseLabel(c)}`;
    if (c.id === value) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => onChange(sel.value));
  return el('label', { class: 'ios-lab-field' }, [el('span', { text: label }), sel]);
}

function cell(text) {
  return el('td', { text });
}

export async function mountCompareCases(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-compare' });
  host.appendChild(root);
  const list = loadCases();
  await readyCite();

  let idA = ctx.caseA || list[0]?.id;
  let idB = ctx.caseB || list[1]?.id || list[0]?.id;
  const body = el('div', { id: 'ios-compare-out' });

  root.append(
    el('h2', { text: 'Đối chiếu hai hồ sơ' }),
    el('p', { class: 'ios-muted', text: 'Bảng can-chi / ngũ hành / dụng thần cạnh nhau. Phương pháp 合盘 kỹ thuật — không chấm điểm tương hợp.' }),
    pick('Hồ sơ A', list, idA, (v) => { idA = v; paint(); }),
    pick('Hồ sơ B', list, idB, (v) => { idB = v; paint(); }),
    body,
  );

  function paint() {
    clear(body);
    const a = list.find((c) => c.id === idA);
    const b = list.find((c) => c.id === idB);
    if (!a || !b) {
      body.appendChild(el('p', { class: 'ios-muted', text: 'Cần hai hồ sơ.' }));
      return;
    }
    let A, B;
    try {
      A = analyzeStudio(a);
      B = analyzeStudio(b);
    } catch (err) {
      body.appendChild(el('p', { class: 'ios-warn', text: err.message || String(err) }));
      return;
    }

    const rows = [
      ['Tên', a.name, b.name],
      ['Mốc', caseLabel(a), caseLabel(b)],
      ['Tứ Trụ', A.pillars, B.pillars],
      ['Nhật chủ', `${A.chart.dayGan} ${wxVi(A.chart.dayMaster?.wx)}`, `${B.chart.dayGan} ${wxVi(B.chart.dayMaster?.wx)}`],
      ['Cách cục', A.pattern?.vi || A.pattern?.name || '—', B.pattern?.vi || B.pattern?.name || '—'],
      ['Dụng thần', wxVi(A.yong?.primary), wxVi(B.yong?.primary)],
      ['Hỷ / Kỵ', `${wxVi(A.yong?.xi)} / ${wxVi(A.yong?.ji)}`, `${wxVi(B.yong?.xi)} / ${wxVi(B.yong?.ji)}`],
    ];
    for (const w of WUXING) {
      rows.push([wxVi(w), `${(A.wx.pct?.[w] ?? 0).toFixed(1)}%`, `${(B.wx.pct?.[w] ?? 0).toFixed(1)}%`]);
    }

    body.appendChild(el('div', { class: 'ios-table-wrap' }, [
      el('table', { class: 'ios-table' }, [
        el('thead', {}, [el('tr', {}, ['Hạng mục', 'A', 'B'].map((h) => el('th', { text: h })))]),
        el('tbody', {}, rows.map((r) => el('tr', {}, r.map(cell)))),
      ]),
    ]));

    const cite = citeLine(
      'Đối chiếu hai cục: xếp tứ trụ / thập thần / dụng thần cạnh nhau để xem sinh khắc và cách cục — đây là 合盘 kỹ thuật, không phải điểm hợp.',
      'sanming',
    );
    if (cite) {
      body.appendChild(el('p', { class: 'ios-cite' }, [
        el('span', { text: cite.text + ' ' }),
        el('button', {
          type: 'button',
          class: 'ios-cite-ref',
          text: `${cite.title} · ${cite.locator}`,
          onClick: () => ctx.onOpenClassic && ctx.onOpenClassic(cite.title),
        }),
      ]));
    }
  }

  paint();
}
