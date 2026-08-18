// ============================================================================
//  nghiem-view.js — chòm sao gia tộc + xếp 12 giờ + sổ cái có đoạn kinh thật
// ============================================================================
import { el, clear } from './ui.js';
import { getAn, roleVi, memberDateLine } from './family-cases.js';
import { runCluster, runRectify } from './family-run.js';
import { readyCite, citeLedger, citeTheme, citedOnly } from './cite.js';

function svgEl(tag, attrs, children = []) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, String(v));
  for (const c of [].concat(children)) if (c) n.appendChild(c);
  return n;
}

function radialSvg(radial) {
  const wrap = el('div', { class: 'ios-radial', id: 'ios-family-tree' });
  const svg = svgEl('svg', { viewBox: '0 0 300 300', width: '100%', height: '300', role: 'img', 'aria-label': 'Chòm sao gia tộc' });
  const tone = { good: '#6fbf8a', mid: '#d4af37', bad: '#d07a6a' };
  for (const e of radial.edges || []) {
    const a = radial.nodes.find((n) => n.id === e.from);
    const b = radial.nodes.find((n) => n.id === e.to);
    if (!a || !b) continue;
    svg.appendChild(svgEl('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: tone[e.tone] || '#d4af37',
      'stroke-width': 2,
      opacity: 0.7,
    }));
    svg.appendChild(svgEl('text', {
      x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 6,
      fill: '#9aa3bf', 'font-size': 10, 'text-anchor': 'middle',
    }, [document.createTextNode(String(e.label || ''))]));
  }
  for (const n of radial.nodes || []) {
    svg.appendChild(svgEl('circle', {
      cx: n.x, cy: n.y, r: n.isCenter ? 22 : 16,
      fill: n.isCenter ? '#e8d28a' : '#1c1a28',
      stroke: '#d4af37',
      'stroke-width': 2,
    }));
    svg.appendChild(svgEl('text', {
      x: n.x, y: n.y + 4,
      fill: n.isCenter ? '#1a1408' : '#e8d28a',
      'font-size': 11, 'text-anchor': 'middle', 'font-family': 'PingFang SC, Songti SC, serif',
    }, [document.createTextNode(n.dm || '·')]));
    svg.appendChild(svgEl('text', {
      x: n.x, y: n.y + (n.isCenter ? 38 : 32),
      fill: '#eef1f8', 'font-size': 11, 'text-anchor': 'middle',
    }, [document.createTextNode(n.label || '')]));
  }
  wrap.appendChild(svg);
  return wrap;
}

function radarSvg(radar) {
  const cx = 120, cy = 120, r = 78;
  const svg = svgEl('svg', { viewBox: '0 0 240 240', width: '100%', height: '220', class: 'ios-radar' });
  const n = radar.length || 6;
  for (const ring of [0.33, 0.66, 1]) {
    const pts = radar.map((_, i) => {
      const ang = -Math.PI / 2 + (i / n) * 2 * Math.PI;
      return `${cx + r * ring * Math.cos(ang)},${cy + r * ring * Math.sin(ang)}`;
    }).join(' ');
    svg.appendChild(svgEl('polygon', { points: pts, fill: 'none', stroke: 'rgba(255,255,255,0.12)' }));
  }
  const val = radar.map((d, i) => {
    const ang = -Math.PI / 2 + (i / n) * 2 * Math.PI;
    const t = Math.max(0, Math.min(1, (d.value || 0) / 10));
    return `${cx + r * t * Math.cos(ang)},${cy + r * t * Math.sin(ang)}`;
  }).join(' ');
  svg.appendChild(svgEl('polygon', { points: val, fill: 'rgba(212,175,55,0.28)', stroke: '#d4af37' }));
  radar.forEach((d, i) => {
    const ang = -Math.PI / 2 + (i / n) * 2 * Math.PI;
    svg.appendChild(svgEl('text', {
      x: cx + (r + 18) * Math.cos(ang),
      y: cy + (r + 18) * Math.sin(ang) + 4,
      fill: '#9aa3bf', 'font-size': 10, 'text-anchor': 'middle',
    }, [document.createTextNode(d.axis)]));
  });
  return el('div', { class: 'ios-radar-wrap' }, [svg]);
}

function matrixTable(matrix) {
  const labels = matrix.labels || [];
  const wrap = el('div', { class: 'ios-table-wrap' });
  const table = el('table', { class: 'ios-table', id: 'ios-matrix' });
  table.appendChild(el('thead', {}, [el('tr', {}, [
    el('th', { text: '' }),
    ...labels.map((l) => el('th', { text: l })),
  ])]));
  const body = el('tbody');
  labels.forEach((rowLabel, i) => {
    const tr = el('tr', {}, [el('th', { text: rowLabel })]);
    labels.forEach((_, j) => {
      const cell = (matrix.cells || []).find((c) => c.i === i && c.j === j);
      tr.appendChild(el('td', { text: cell && cell.score != null ? String(cell.score) : '—' }));
    });
    body.appendChild(tr);
  });
  table.appendChild(body);
  wrap.appendChild(table);
  return wrap;
}

function citeBlock(row, onOpen) {
  if (!row) return null;
  return el('li', { class: 'ios-cite' }, [
    el('p', { text: row.text }),
    el('blockquote', { class: 'ios-quote zh', text: row.quote }),
    el('button', {
      type: 'button',
      class: 'ios-cite-ref',
      'data-sid': row.sid,
      text: `${row.title} · ${row.locator}`,
      onClick: () => onOpen && onOpen(row),
    }),
  ]);
}

function consistencyCopy(family) {
  const score = family.score;
  const band = score >= 67 ? 'khớp cao' : score >= 57 ? 'khớp vừa' : score >= 51 ? 'lệch nhẹ' : 'lệch nhiều';
  return `Độ nhất quán dữ liệu của cụm: ${score} (${band}). ${family.confirms} tín hiệu khớp · ${family.conflicts} tín hiệu lệch — đây là đồng nhất giữa các trụ, không phải phẩm chất mệnh.`;
}

export async function mountNghiem(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-lab', id: 'ios-nghiem' });
  host.appendChild(root);

  const an = ctx.anId ? getAn(ctx.anId) : null;
  if (!an) {
    root.append(
      el('h2', { text: 'Nghiệm chứng' }),
      el('p', { class: 'ios-muted', text: 'Chưa mở án. Vào tab Án và chọn một án gia tộc.' }),
      el('button', {
        type: 'button', class: 'ios-btn-primary', text: 'Về sổ án',
        onClick: () => ctx.onBackList && ctx.onBackList(),
      }),
    );
    return;
  }

  await readyCite();
  let cluster;
  try {
    cluster = runCluster(an);
  } catch (err) {
    root.append(el('h2', { text: an.title }), el('p', { class: 'ios-warn', text: err.message || String(err) }));
    return;
  }
  if (!cluster) {
    root.append(el('h2', { text: an.title }), el('p', { class: 'ios-muted', text: 'Án chưa có chủ thể — thêm người thân vai trò Chủ thể.' }));
    return;
  }

  const resultHost = el('div', { id: 'ios-nghiem-result' });
  const runBtn = el('button', {
    type: 'button',
    class: 'ios-btn-primary',
    id: 'ios-run-btn',
    text: 'Chạy nghiệm · Xếp 12 giờ',
  });

  const evidence = el('div', { class: 'ios-evidence' });
  for (const p of cluster.evidence) {
    evidence.appendChild(el('div', { class: 'ios-evidence-row' }, [
      el('span', { class: 'ios-muted', text: `${roleVi(p.role)} · ${p.label}${p.hourUnknown ? ' · giờ chưa rõ' : ''}` }),
      el('span', { class: 'zh ios-pillar-line', text: p.pillars }),
    ]));
  }

  root.append(
    el('h2', { text: an.title }),
    el('p', { class: 'ios-muted', text: 'Chòm sao gia tộc — mỗi nút là nhật can. Trụ can-chi chỉ là bằng chứng, không phải bài diễn giải.' }),
    radialSvg(cluster.radial),
    evidence,
    el('p', { class: 'ios-muted tiny', text: (an.members || []).map((m) => `${roleVi(m.role)} ${memberDateLine(m)}`).join(' · ') }),
    el('div', { class: 'ios-lab-actions' }, [runBtn]),
    resultHost,
  );

  runBtn.addEventListener('click', () => {
    clear(resultHost);
    resultHost.appendChild(el('p', { class: 'ios-muted', text: 'Đang quét 12 时辰…' }));
    let pack;
    try {
      pack = runRectify(an);
    } catch (err) {
      clear(resultHost);
      resultHost.appendChild(el('p', { class: 'ios-warn', text: err.message || String(err) }));
      return;
    }
    clear(resultHost);
    const fam = pack.cluster?.family;
    if (!fam) {
      resultHost.appendChild(el('p', { class: 'ios-muted', text: 'Không đủ dữ liệu để nghiệm.' }));
      return;
    }

    const summaryCite = citeTheme('balance', consistencyCopy(fam));
    const hourCite = citeTheme('hour', pack.scans[0]?.verdict || 'Xếp 12 giờ theo độ nhất quán cụm.');
    const ledgerCites = citedOnly((fam.ledger || []).map((l) => citeLedger(l.msg)));

    resultHost.append(
      el('section', { class: 'ios-lab-block', id: 'ios-cluster-summary' }, [
        el('h3', { class: 'ios-lab-h', text: 'Nhất quán dữ liệu' }),
        el('p', { text: consistencyCopy(fam) }),
        summaryCite ? citeBlock(summaryCite, ctx.onOpenCite) : null,
      ]),
    );

    for (const scan of pack.scans) {
      const who = `${roleVi(scan.member.role)} · ${scan.member.label}`;
      const rows = scan.candidates.map((c, i) => el('tr', { class: i === 0 ? 'ios-best-hour' : '' }, [
        el('td', { text: String(i + 1) }),
        el('td', { class: 'zh', text: `${c.zhi} ${c.zhiVi}` }),
        el('td', { text: `${c.hour}h` }),
        el('td', { text: String(c.score) }),
        el('td', { text: c.delta === 0 ? 'tốt nhất' : String(c.delta) }),
      ]));
      resultHost.append(
        el('section', { class: 'ios-lab-block' }, [
          el('h3', { class: 'ios-lab-h', text: `Xếp 12 giờ — ${who}` }),
          el('p', { class: 'ios-muted tiny', text: `Giờ đứng đầu: ${scan.best.zhiVi} (${scan.best.hour}h), điểm nhất quán ${scan.best.score}.` }),
          el('p', { text: scan.verdict }),
          hourCite ? citeBlock(hourCite, ctx.onOpenCite) : null,
          el('div', { class: 'ios-table-wrap' }, [
            el('table', { class: 'ios-table', id: 'ios-hour-table' }, [
              el('thead', {}, [el('tr', {}, ['#', '时辰', 'Giờ', 'Nhất quán', 'Δ'].map((h) => el('th', { text: h })))]),
              el('tbody', {}, rows),
            ]),
          ]),
        ]),
      );
    }
    if (!pack.scans.length) {
      resultHost.append(el('p', { class: 'ios-muted', text: 'Không có người giờ chưa rõ trong án này — sổ cái vẫn chấm nhất quán cụm.' }));
    }

    resultHost.append(
      el('section', { class: 'ios-lab-block', id: 'ios-ledger' }, [
        el('h3', { class: 'ios-lab-h', text: 'Sổ cái khớp / lệch' }),
        ledgerCites.length
          ? el('ol', { class: 'ios-lab-ol', id: 'ios-ledger-cites' }, ledgerCites.map((n) => citeBlock(n, ctx.onOpenCite)))
          : el('p', { class: 'ios-muted', text: 'Không tìm được đoạn kinh khớp cho các dòng sổ cái — không hiện câu diễn giải.' }),
      ]),
      el('details', { class: 'ios-lab-block' }, [
        el('summary', { text: 'Ma trận cặp + radar 6 trục' }),
        matrixTable(pack.cluster.matrix),
        radarSvg(pack.cluster.radar),
      ]),
    );
  });
}
