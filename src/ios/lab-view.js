// ============================================================================
//  lab-view.js — Chart Lab: bảng Tứ Trụ + thuật toán + trích dẫn kinh điển
//  Không phải lá số tiêu dùng: không điểm mệnh /100, không vận hôm nay,
//  không hợp tuổi, không CTA cải mệnh / Giải Mệnh.
// ============================================================================
import { el, clear } from './ui.js';
import { analyze } from '../engine/chart.js';
import { GAN, ZHI, WX_VI, WUXING, TEN_GOD_VI } from '../engine/constants.js';
import { SAMPLE } from './sample-case.js';

const PILLAR_KEYS = [
  ['year', 'Niên trụ', '年柱'],
  ['month', 'Nguyệt trụ', '月柱'],
  ['day', 'Nhật trụ', '日柱'],
  ['time', 'Thời trụ', '时柱'],
];

const CITATIONS = [
  {
    classic: '渊海子平',
    quote: '子时换日 — giờ Tý (23:00+) tính sang ngày sau.',
    used: 'Bước 1 · dựng Tứ Trụ',
  },
  {
    classic: '子平真诠',
    quote: '八字用神，专求月令，以日干配月令地支，而生克不同，格局分焉。',
    used: 'Bước 4–5 · cách cục / dụng thần',
  },
  {
    classic: '穷通宝鉴',
    quote: '調候为先 — lấy khí hậu tháng sinh (hàn noãn táo thấp) trước khi phù ức.',
    used: 'Bước 5 · điều hậu',
  },
  {
    classic: '滴天髓',
    quote: '得令、得地、得势 — vượng suy dựa lệnh / địa / thế, không lấy thần sát làm gốc.',
    used: 'Bước 3 · vượng suy',
  },
  {
    classic: '三命通会',
    quote: '十神从日干起，藏干以权重入五行分数。',
    used: 'Bước 2 · thập thần / ngũ hành',
  },
];

function godVi(god) {
  if (!god) return '—';
  if (god === '日主') return 'Nhật chủ 日主';
  return `${TEN_GOD_VI[god] || god} ${god}`;
}

function wxVi(wx) {
  return wx ? `${WX_VI[wx] || wx} ${wx}` : '—';
}

function parseCase(dateVal, timeVal, gender) {
  const [y, m, d] = String(dateVal || '').split('-').map(Number);
  const [hh, mm] = String(timeVal || '12:00').split(':').map(Number);
  if (!y || !m || !d) throw new Error('Ngày không hợp lệ.');
  return { year: y, month: m, day: d, hour: hh || 0, minute: mm || 0, gender };
}

function pillarLine(p) {
  return `${p.year.gan}${p.year.zhi} ${p.month.gan}${p.month.zhi} ${p.day.gan}${p.day.zhi} ${p.time.gan}${p.time.zhi}`;
}

function table(headers, rows) {
  const thead = el('thead', {}, [
    el('tr', {}, headers.map((h) => el('th', { text: h }))),
  ]);
  const tbody = el('tbody', {}, rows.map((cols) =>
    el('tr', {}, cols.map((c) => el('td', { text: c })))));
  return el('div', { class: 'ios-table-wrap' }, [
    el('table', { class: 'ios-table' }, [thead, tbody]),
  ]);
}

function section(title, zh, children) {
  return el('section', { class: 'ios-lab-block' }, [
    el('h3', { class: 'ios-lab-h' }, [
      el('span', { text: title }),
      zh ? el('span', { class: 'zh', text: ` ${zh}` }) : null,
    ]),
    ...[].concat(children),
  ]);
}

export function mountLab(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-lab' });
  host.appendChild(root);

  const dateIn = el('input', {
    id: 'ios-lab-date', type: 'date', class: 'ios-search',
    value: '1990-06-15', min: '1900-01-01', max: '2100-12-31',
    'aria-label': 'Ngày case tra cứu',
  });
  const timeIn = el('input', {
    id: 'ios-lab-time', type: 'time', class: 'ios-search',
    value: '10:00', 'aria-label': 'Giờ case tra cứu',
  });
  const gNam = el('input', { type: 'radio', name: 'ios-lab-g', id: 'ios-lab-g-nam', value: 'nam', checked: true });
  const gNu = el('input', { type: 'radio', name: 'ios-lab-g', id: 'ios-lab-g-nu', value: 'nu' });
  const out = el('div', { id: 'ios-lab-out' });

  const run = () => {
    const gender = gNu.checked ? 'nu' : 'nam';
    try {
      const c = parseCase(dateIn.value, timeIn.value, gender);
      const R = analyze(c.year, c.month, c.day, c.hour, c.minute, c.gender);
      paint(out, R, c, ctx);
    } catch (err) {
      clear(out);
      out.appendChild(el('p', { class: 'ios-warn', text: err.message || String(err) }));
    }
  };

  root.append(
    el('h2', { text: 'Chart Lab' }),
    el('p', { class: 'ios-muted', text: 'Công cụ tra cứu Tứ Trụ — bảng can-chi, thập thần, ngũ hành và dụng thần, kèm thuật toán + tên kinh điển. Không phải lá số tiêu dùng.' }),
    el('p', { class: 'ios-section-label', text: 'CASE TRA CỨU' }),
    el('div', { class: 'ios-lab-form' }, [
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Ngày' }), dateIn]),
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Giờ' }), timeIn]),
      el('div', { class: 'ios-lab-field' }, [
        el('span', { text: 'Giới' }),
        el('div', { class: 'ios-lab-seg' }, [
          gNam, el('label', { for: 'ios-lab-g-nam', text: 'Nam' }),
          gNu, el('label', { for: 'ios-lab-g-nu', text: 'Nữ' }),
        ]),
      ]),
    ]),
    el('div', { class: 'ios-lab-actions' }, [
      el('button', { type: 'button', class: 'ios-btn-primary', text: 'Tra bảng Tứ Trụ', onClick: run }),
      el('button', {
        type: 'button', class: 'ios-btn-ghost', text: 'Case mẫu 1990-06-15',
        onClick: () => {
          dateIn.value = '1990-06-15';
          timeIn.value = '10:00';
          gNam.checked = true;
          run();
        },
      }),
    ]),
    el('p', { class: 'ios-muted tiny', text: `Mẫu mặc định: ${SAMPLE.label} — dùng để đối chiếu thuật toán, không cần nhập ngày sinh khi mở tab.` }),
    out,
  );

  run();
}

function paint(out, R, input, ctx) {
  clear(out);
  const p = R.chart.pillars;
  const yong = R.yong || {};
  const pattern = R.pattern || {};
  const strength = R.strength || {};
  const wx = R.wx || { pct: {}, score: {} };

  out.appendChild(el('p', { class: 'ios-lab-pillars zh', text: pillarLine(p) }));
  out.appendChild(el('p', {
    class: 'ios-muted tiny',
    text: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')} · ${input.gender === 'nu' ? 'nữ' : 'nam'} · âm lịch ${R.chart.lunarInput?.text || R.chart.lunar?.text || '—'}`,
  }));

  const pillarRows = PILLAR_KEYS.map(([key, vi, zh]) => {
    const col = p[key];
    const hidden = (col.hidden || []).map((h) => `${h.gan} ${godVi(h.god)}`).join(' · ') || '—';
    return [
      `${vi} ${zh}`,
      `${col.gan}${col.zhi}`,
      `${GAN[col.gan]?.vi || ''} ${ZHI[col.zhi]?.vi || ''}`,
      godVi(col.ganGod),
      col.nayin || '—',
      hidden,
    ];
  });
  out.appendChild(section('Bảng Tứ Trụ', '四柱', [
    table(['Trụ', 'Can-chi', 'Hán-Việt', 'Thập thần', 'Nạp âm', 'Tàng can'], pillarRows),
  ]));

  const wxRows = WUXING.map((w) => [
    wxVi(w),
    `${(wx.pct?.[w] ?? 0).toFixed(1)}%`,
    String(wx.score?.[w] ?? '—'),
  ]);
  out.appendChild(section('Phân bố ngũ hành', '五行分数', [
    el('p', { class: 'ios-muted tiny', text: 'Trọng số can + tàng can (không vong giảm tàng can). Đây là bảng phân bố, không phải điểm mệnh.' }),
    table(['Hành', 'Tỷ lệ', 'Điểm trọng số'], wxRows),
  ]));

  const methods = Array.isArray(yong.method) ? yong.method.join(' · ') : (yong.method || '—');
  out.appendChild(section('Cách cục · Dụng thần', '格局 · 用神', [
    el('ul', { class: 'ios-meta-list' }, [
      el('li', { text: `Cách cục: ${pattern.vi || pattern.name || '—'} (${pattern.type || '—'})` }),
      el('li', { text: `Nhật chủ: ${R.chart.dayGan} ${wxVi(R.chart.dayMaster?.wx)} · vượng suy: ${strength.strong === true ? 'vượng' : strength.strong === false ? 'nhược' : 'trung'}` }),
      el('li', { text: `Dụng thần: ${wxVi(yong.primary)}${yong.secondary ? ` · thứ cấp ${wxVi(yong.secondary)}` : ''}` }),
      el('li', { text: `Hỷ ${wxVi(yong.xi)} · Kỵ ${wxVi(yong.ji)} · Thù ${wxVi(yong.chou)}` }),
      el('li', { text: `Phương pháp: ${methods}` }),
    ]),
  ]));

  const reasons = (yong.reasons || []).slice(0, 8).map((r) =>
    String(r).replace(/^[📐🎯💊★]\s*/, ''));
  if (reasons.length) {
    out.appendChild(section('Chuỗi lập luận (engine)', '', [
      el('ol', { class: 'ios-lab-ol' }, reasons.map((r) => el('li', { text: r }))),
    ]));
  }

  out.appendChild(section('Thuật toán', '推步', [
    el('ol', { class: 'ios-lab-ol' }, [
      el('li', { text: 'Dựng Tứ Trụ từ dương lịch; 子时 (23:00+) đổi ngày — 渊海子平 / 三命通会.' }),
      el('li', { text: 'Thập thần từ nhật can; tàng can địa chi có trọng số — 三命通会.' }),
      el('li', { text: 'Vượng suy: được lệnh / được địa / được thế — 滴天髓.' }),
      el('li', { text: 'Cách cục lấy nguyệt lệnh配 nhật can — 子平真诠.' }),
      el('li', { text: 'Dụng thần: phù ức + điều hậu (穷通宝鉴) + bệnh dược khi có cứu.' }),
    ]),
  ]));

  out.appendChild(section('Trích dẫn kinh điển', '典籍', [
    table(['Kinh', 'Câu then chốt', 'Chỗ dùng'], CITATIONS.map((c) => [c.classic, c.quote, c.used])),
    ctx.onOpenClassic
      ? el('button', {
        type: 'button',
        class: 'ios-btn-ghost',
        text: 'Mở 穷通宝鉴 trong thư viện',
        onClick: () => ctx.onOpenClassic('穷通宝鉴'),
      })
      : null,
  ]));
}
