// ============================================================================
//  case-view.js — mặt bàn một hồ sơ: bảng tính + câu đã trích dẫn
// ============================================================================
import { el, clear } from './ui.js';
import { GAN, ZHI, WX_VI, WUXING, TEN_GOD_VI } from '../engine/constants.js';
import { getCase, caseLabel } from './cases.js';
import { analyzeStudio } from './studio-analyze.js';
import { readyCite, citeLine, citedOnly } from './cite.js';

const PILLAR_KEYS = [
  ['year', 'Niên trụ', '年柱'],
  ['month', 'Nguyệt trụ', '月柱'],
  ['day', 'Nhật trụ', '日柱'],
  ['time', 'Thời trụ', '时柱'],
];

function godVi(god) {
  if (!god) return '—';
  if (god === '日主') return 'Nhật chủ 日主';
  return `${TEN_GOD_VI[god] || god} ${god}`;
}

function wxVi(wx) {
  return wx ? `${WX_VI[wx] || wx} ${wx}` : '—';
}

function table(headers, rows) {
  return el('div', { class: 'ios-table-wrap' }, [
    el('table', { class: 'ios-table' }, [
      el('thead', {}, [el('tr', {}, headers.map((h) => el('th', { text: h })))]),
      el('tbody', {}, rows.map((cols) => el('tr', {}, cols.map((c) => el('td', { text: c }))))),
    ]),
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

function citeBlock(row, onOpen) {
  if (!row) return null;
  return el('li', { class: 'ios-cite' }, [
    el('p', { text: row.text }),
    el('button', {
      type: 'button',
      class: 'ios-cite-ref',
      text: `${row.title} · ${row.locator}`,
      onClick: () => onOpen && onOpen(row.title),
    }),
  ]);
}

export async function mountCase(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-lab', id: 'ios-case-desk' });
  host.appendChild(root);

  const rec = ctx.caseId ? getCase(ctx.caseId) : null;
  if (!rec) {
    root.append(
      el('h2', { text: 'Bàn tính' }),
      el('p', { class: 'ios-muted', text: 'Chưa mở hồ sơ. Vào tab Hồ sơ và chọn một case.' }),
      el('button', {
        type: 'button', class: 'ios-btn-primary', text: 'Về sổ hồ sơ',
        onClick: () => ctx.onBackList && ctx.onBackList(),
      }),
    );
    return;
  }

  await readyCite();
  let R;
  try {
    R = analyzeStudio(rec);
  } catch (err) {
    root.append(el('h2', { text: rec.name }), el('p', { class: 'ios-warn', text: err.message || String(err) }));
    return;
  }

  const p = R.chart.pillars;
  const yong = R.yong || {};
  const pattern = R.pattern || {};
  const strength = R.strength || {};
  const wx = R.wx || { pct: {}, score: {} };

  const notes = citedOnly([
    citeLine('Tứ Trụ dựng từ dương lịch; giờ Tý (23:00+) tính sang ngày sau.', 'yuanhai'),
    citeLine('Thập thần lấy nhật can làm gốc; tàng can địa chi vào ngũ hành theo trọng số.', 'sanming'),
    citeLine('Vượng suy xét được lệnh, được địa, được thế — không lấy thần sát làm gốc.', 'ditiansui'),
    citeLine(
      `Cách cục «${pattern.vi || pattern.name || '—'}»: dụng thần chuyên cầu nguyệt lệnh, nhật can phối địa chi tháng.`,
      'ziping',
    ),
    citeLine(
      `Dụng thần lấy ${wxVi(yong.primary)}${yong.secondary ? `, thứ cấp ${wxVi(yong.secondary)}` : ''} — điều hậu đi trước khi khí hậu tháng lệch.`,
      'qiongtong',
    ),
    citeLine('Đại vận kể từ tuổi khởi vận; mỗi bước một can-chi, mười năm một vận.', 'sanming'),
  ]);

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

  const wxRows = WUXING.map((w) => [
    wxVi(w),
    `${(wx.pct?.[w] ?? 0).toFixed(1)}%`,
    String(wx.score?.[w] ?? '—'),
  ]);

  const dyRows = (R.dayun || []).map((d) => [
    `${d.startAge}–${d.startAge + 9}`,
    String(d.startYear || '—'),
    d.ganZhi || `${d.gan}${d.zhi}`,
    godVi(d.ganGod),
    wxVi(d.zhiWx),
  ]);

  root.append(
    el('h2', { text: rec.name }),
    el('p', { class: 'ios-muted', text: caseLabel(rec) }),
    el('p', { class: 'ios-lab-pillars zh', text: R.pillars }),
    el('p', {
      class: 'ios-muted tiny',
      text: `Âm lịch ${R.chart.lunarInput?.text || R.chart.lunar?.text || '—'}`,
    }),
    section('Bảng Tứ Trụ', '四柱', [
      table(['Trụ', 'Can-chi', 'Hán-Việt', 'Thập thần', 'Nạp âm', 'Tàng can'], pillarRows),
    ]),
    section('Phân bố ngũ hành', '五行', [
      el('p', { class: 'ios-muted tiny', text: 'Trọng số can + tàng can — bảng phân bố kỹ thuật, không phải điểm mệnh.' }),
      table(['Hành', 'Tỷ lệ', 'Trọng số'], wxRows),
    ]),
    section('Cách cục · Dụng thần', '格局 · 用神', [
      el('ul', { class: 'ios-meta-list' }, [
        el('li', { text: `Cách: ${pattern.vi || pattern.name || '—'} (${pattern.type || '—'})` }),
        el('li', { text: `Nhật chủ: ${R.chart.dayGan} ${wxVi(R.chart.dayMaster?.wx)} · ${strength.strong === true ? 'vượng' : strength.strong === false ? 'nhược' : 'trung'}` }),
        el('li', { text: `Dụng: ${wxVi(yong.primary)}${yong.secondary ? ` · thứ cấp ${wxVi(yong.secondary)}` : ''}` }),
        el('li', { text: `Hỷ ${wxVi(yong.xi)} · Kỵ ${wxVi(yong.ji)} · Thù ${wxVi(yong.chou)}` }),
      ]),
    ]),
    section('Đại vận', '大运', [
      table(['Tuổi', 'Năm', 'Can-chi', 'Thập thần', 'Hành chi'], dyRows),
    ]),
    section('Diễn giải có trích dẫn', '出典', [
      notes.length
        ? el('ol', { class: 'ios-lab-ol', id: 'ios-case-cites' }, notes.map((n) => citeBlock(n, ctx.onOpenClassic)))
        : el('p', { class: 'ios-muted', text: 'Chưa khớp được kinh trong thư viện — không hiện đoạn diễn giải.' }),
    ]),
    section('Thuật toán', '推步', [
      el('ol', { class: 'ios-lab-ol' }, [
        el('li', { text: 'Dựng Tứ Trụ (子时换日) → thập thần / tàng can → ngũ hành.' }),
        el('li', { text: 'Vượng suy (lệnh / địa / thế) → cách cục nguyệt lệnh → dụng thần.' }),
        el('li', { text: 'Khởi đại vận theo giới tính / dương lịch — chỉ xuất bảng can-chi, không chấm cát hung.' }),
      ]),
    ]),
  );
}
