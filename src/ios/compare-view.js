// ============================================================================
//  compare-view.js — đối chiếu 2 mục corpus + bảng phái (schools-data)
// ============================================================================
import { el, clear } from './ui.js';
import { loadIndex, loadEntry, searchIndex } from './corpus.js';

const FIELDS = [
  ['meaning', 'Tóm lược'],
  ['deep_essence', 'Tinh yếu'],
  ['logic_thesis', 'Luận đề'],
  ['logic_chain', 'Chuỗi lập luận'],
  ['logic_practice', 'Thực hành'],
  ['logic_compare', 'Đối chiếu logic'],
  ['deep_related', 'Liên hệ'],
  ['full_vn', 'Bản dịch Việt'],
  ['han_text', 'Nguyên văn Hán'],
  ['bu', 'Bộ'],
  ['dz', 'DZ#'],
];

export async function mountCompare(host) {
  clear(host);
  const root = el('div', { class: 'ios-compare' });
  host.appendChild(root);
  const idx = await loadIndex();
  const items = idx.items || [];

  // Default pair: two 陰符經 commentaries if present
  const a0 = items.find((i) => i.id.includes('陰符經註張果')) || items[0];
  const b0 = items.find((i) => i.id.includes('陰符經集解')) || items[1] || items[0];
  let sidA = a0?.sid;
  let sidB = b0?.sid;

  const head = el('div');
  const body = el('div');
  root.append(head, body);

  const pickRow = (label, which) => {
    const input = el('input', { type: 'search', class: 'ios-search', placeholder: `Đổi cột ${label}…` });
    const box = el('div');
    input.addEventListener('input', () => {
      clear(box);
      const hits = searchIndex(items, input.value).slice(0, 8);
      for (const h of hits) {
        box.appendChild(el('button', {
          type: 'button', class: 'ios-list-item', text: h.name_han,
          onClick: async () => {
            if (which === 'A') sidA = h.sid; else sidB = h.sid;
            input.value = h.name_han;
            clear(box);
            await paint();
          },
        }));
      }
    });
    return el('div', {}, [el('p', { class: 'ios-section-label', text: label }), input, box]);
  };

  head.append(
    el('h2', { text: 'Đối chiếu nguồn' }),
    el('p', { class: 'ios-muted', text: 'So sánh trường dữ liệu thật — không bịa lời bình.' }),
    pickRow('Cột A', 'A'),
    pickRow('Cột B', 'B'),
  );

  async function paint() {
    clear(body);
    if (!sidA || !sidB) return;
    const [A, B] = await Promise.all([loadEntry(sidA), loadEntry(sidB)]);
    body.appendChild(el('div', { class: 'ios-badges' }, [
      el('span', { class: 'ios-chip', text: `A: ${A.name_han}` }),
      el('span', { class: 'ios-chip', text: `B: ${B.name_han}` }),
    ]));

    const checks = [];
    checks.push(A.bu === B.bu ? `Cùng bộ: ${A.bu || '—'}` : `Khác bộ: ${A.bu || '—'} vs ${B.bu || '—'}`);
    checks.push((A.dz && B.dz) ? `DZ# ${A.dz} vs ${B.dz}` : 'Một bên thiếu DZ#');
    for (const [k] of FIELDS) {
      const ha = !!(A[k] && String(A[k]).trim());
      const hb = !!(B[k] && String(B[k]).trim());
      if (ha !== hb) checks.push(`Lớp ${k}: A ${ha ? 'có' : 'không'} / B ${hb ? 'có' : 'không'}`);
    }
    body.appendChild(el('div', { class: 'ios-day-card' }, [
      el('h4', { text: 'Đối chiếu máy kiểm được' }),
      el('ul', { class: 'ios-meta-list' }, checks.slice(0, 12).map((t) => el('li', { text: t }))),
    ]));

    for (const [key, label] of FIELDS) {
      const va = String(A[key] || '').trim();
      const vb = String(B[key] || '').trim();
      if (!va && !vb) continue;
      body.appendChild(el('section', { class: 'ios-day-card' }, [
        el('h4', { text: label }),
        el('div', { class: 'ios-compare-grid' }, [
          el('div', {}, [el('p', { class: 'ios-section-label', text: 'A' }), el('p', { class: 'ios-prose', text: va.slice(0, 800) || '(trống)' })]),
          el('div', {}, [el('p', { class: 'ios-section-label', text: 'B' }), el('p', { class: 'ios-prose', text: vb.slice(0, 800) || '(trống)' })]),
        ]),
      ]));
    }

    // School panel (lazy)
    try {
      const mod = await import('../engine/schools-data.js');
      const schools = mod.SCHOOLS || mod.default || [];
      if (Array.isArray(schools) && schools.length) {
        const dims = Object.keys(schools[0] || {}).filter((k) => k !== 'name' && k !== 'id' && k !== 'han');
        body.appendChild(el('div', { class: 'ios-day-card' }, [
          el('h4', { text: `Bảng phái (${schools.length})` }),
          el('p', { class: 'ios-muted', text: `So ${Math.min(dims.length, 12)} chiều từ schools-data — dữ liệu có sẵn trong app.` }),
          el('ul', { class: 'ios-meta-list' }, schools.slice(0, 12).map((s) => el('li', { text: s.name || s.han || s.id || JSON.stringify(s).slice(0, 40) }))),
        ]));
      }
    } catch {
      /* schools optional */
    }
  }

  await paint();
}
