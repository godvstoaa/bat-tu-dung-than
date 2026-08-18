// ============================================================================
//  nghiem-view.js — Đối: hiệu khảo + Thi + 应期 trên cùng một án cổ
// ============================================================================
import { el, clear } from './ui.js';
import { getAn, addMember, ROLE_OPTS, roleVi, memberDateLine, isPrintedCase } from './family-cases.js';
import { runCluster, runRectify, shiChenList, buildPersonR } from './family-run.js';
import { readyCite, citeTheme, hieuKhaoRows } from './cite.js';
import { verifyAnYingqi } from './yingqi.js';

function svgEl(tag, attrs, children = []) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, String(v));
  for (const c of [].concat(children)) if (c) n.appendChild(c);
  return n;
}

function radialSvg(radial) {
  const wrap = el('div', { class: 'ios-radial', id: 'ios-family-tree' });
  const svg = svgEl('svg', { viewBox: '0 0 300 300', width: '100%', height: '300', role: 'img', 'aria-label': 'Bản in cụm trụ' });
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

function attachNodeForm(an, ctx) {
  const wrap = el('div', { class: 'ios-attach', id: 'ios-attach-node' });
  const toggle = el('button', {
    type: 'button',
    class: 'ios-btn-ghost',
    id: 'ios-attach-toggle',
    text: '+ Người thân vào cây',
  });
  const fields = el('div', { class: 'ios-attach-fields hidden' });

  const roleSel = el('select', { class: 'ios-search', 'aria-label': 'Vai trò trên cây' });
  for (const r of ROLE_OPTS) roleSel.appendChild(el('option', { value: r.id, text: r.vi }));
  roleSel.value = an.members?.some((m) => m.role === 'center') ? 'child' : 'center';
  const nameIn = el('input', { type: 'text', class: 'ios-search', maxlength: '40', placeholder: 'Nhãn nút (tuỳ chọn)', 'aria-label': 'Nhãn nút' });
  const dateIn = el('input', { type: 'date', class: 'ios-search', min: '1900-01-01', max: '2100-12-31', 'aria-label': 'Ngày (tuỳ chọn)' });
  const timeIn = el('input', { type: 'time', class: 'ios-search', 'aria-label': 'Giờ nếu đã rõ' });
  const unknown = el('input', { type: 'checkbox', id: 'ios-tree-hour-unknown', checked: true });
  unknown.checked = true;
  timeIn.disabled = true;
  unknown.addEventListener('change', () => { timeIn.disabled = unknown.checked; });
  const gNam = el('input', { type: 'radio', name: 'ios-tree-g', id: 'ios-tree-g-nam', value: 'nam' });
  const gNu = el('input', { type: 'radio', name: 'ios-tree-g', id: 'ios-tree-g-nu', value: 'nu', checked: true });

  fields.append(
    el('p', { class: 'ios-muted tiny', text: 'Gắn một nút vào cụm. Giờ mặc định chưa rõ — vào Thi 12 时辰.' }),
    el('div', { class: 'ios-lab-form' }, [
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Vai trò trên cây' }), roleSel]),
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Nhãn' }), nameIn]),
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Ngày (nếu có)' }), dateIn]),
      el('label', { class: 'ios-lab-field' }, [el('span', { text: 'Giờ (nếu rõ)' }), timeIn]),
      el('div', { class: 'ios-lab-field' }, [
        el('span', { text: 'Giới' }),
        el('div', { class: 'ios-lab-seg' }, [
          gNam, el('label', { for: 'ios-tree-g-nam', text: 'Nam' }),
          gNu, el('label', { for: 'ios-tree-g-nu', text: 'Nữ' }),
        ]),
      ]),
      el('label', { class: 'ios-lab-field ios-check-row', style: 'grid-column:1/-1' }, [
        unknown,
        el('span', { text: 'Giờ chưa rõ' }),
      ]),
    ]),
    el('button', {
      type: 'button',
      class: 'ios-btn-primary',
      text: 'Gắn vào cây',
      onClick: () => {
        const [y, m, d] = String(dateIn.value || '').split('-').map(Number);
        if (!y || !m || !d) return;
        const [hh, mi] = String(timeIn.value || '12:00').split(':').map(Number);
        addMember(an.id, {
          role: roleSel.value,
          label: nameIn.value.trim() || roleVi(roleSel.value),
          year: y, month: m, day: d,
          hour: unknown.checked ? null : (hh ?? 12),
          minute: unknown.checked ? 0 : (mi || 0),
          gender: gNu.checked ? 'nu' : 'nam',
          hourUnknown: unknown.checked,
        });
        if (ctx.onTreeChanged) ctx.onTreeChanged();
      },
    }),
  );

  toggle.addEventListener('click', () => {
    fields.classList.toggle('hidden');
  });

  wrap.append(toggle, fields);
  return wrap;
}

function parseJqTime(s) {
  const [d, tt] = String(s || '').split(' ');
  const [y, mo, da] = (d || '').split('-').map(Number);
  const [h, mi] = (tt || '0:0:0').split(':').map(Number);
  if (!y || !mo || !da) return null;
  return new Date(y, mo - 1, da, h || 0, mi || 0).getTime();
}

function jieqiHint(an) {
  const lines = [];
  for (const m of an.members || []) {
    if (!m.year || !m.month || !m.day) continue;
    let R;
    try { R = buildPersonR(m); } catch { continue; }
    const hour = m.hourUnknown ? null : Number(m.hour);
    if (hour === 23 || hour === 0) {
      lines.push(`${roleVi(m.role)}: sát 子时 — ranh giới giờ.`);
    }
    const jq = R.chart?.jieqi;
    if (!jq?.prev?.time && !jq?.next?.time) continue;
    const birth = new Date(m.year, m.month - 1, m.day, hour ?? 12, m.minute ?? 0).getTime();
    const windowMs = 36 * 3600 * 1000;
    const prev = parseJqTime(jq.prev?.time);
    const next = parseJqTime(jq.next?.time);
    if (prev != null && Math.abs(birth - prev) < windowMs) {
      lines.push(`${roleVi(m.role)}: sát节气 ${jq.prev.name}.`);
    }
    if (next != null && Math.abs(birth - next) < windowMs) {
      lines.push(`${roleVi(m.role)}: sát节气 ${jq.next.name}.`);
    }
  }
  return lines[0] || '';
}

function solarSourceDetails(an) {
  const box = el('details', { class: 'ios-lab-block', id: 'ios-solar-source' });
  box.appendChild(el('summary', { text: 'Nguồn dương lịch (để dựng trụ)' }));
  for (const m of an.members || []) {
    box.appendChild(el('p', { class: 'ios-muted tiny', text: `${roleVi(m.role)} · ${memberDateLine(m)}` }));
  }
  return box;
}

function hieuKhaoSection(an, cluster, onOpen) {
  const fam = cluster.family;
  const rows = hieuKhaoRows(fam);
  const sec = el('section', { class: 'ios-lab-block', id: 'ios-hieu-khao' }, [
    el('h3', { class: 'ios-lab-h', text: 'Hiệu khảo' }),
    el('p', { class: 'ios-muted tiny', text: an.plateNote || '印本: đoạn kinh đã kiểm đối chiếu sổ cái engine.' }),
    radialSvg(cluster.radial),
  ]);
  const evidence = el('div', { class: 'ios-evidence ios-evidence-compact' });
  for (const p of cluster.evidence) {
    const line = p.hourUnknown
      ? String(p.pillars || '').replace(/\S+$/, '未记')
      : p.pillars;
    evidence.appendChild(el('div', { class: 'ios-evidence-row' }, [
      el('span', { class: 'zh ios-pillar-line', text: `${roleVi(p.role)} · ${line}` }),
    ]));
  }
  sec.appendChild(evidence);
  if (!rows.length) {
    sec.appendChild(el('p', { class: 'ios-muted', text: 'Chưa có trục nào gắn được đoạn kinh đã kiểm.' }));
    return sec;
  }
  const ol = el('ol', { class: 'ios-lab-ol', id: 'ios-hieu-khao-list' });
  for (const row of rows) {
    ol.appendChild(el('li', { class: 'ios-hk-row' }, [
      el('div', { class: 'ios-hk-head' }, [
        el('span', { class: row.agree ? 'ios-mark-he' : 'ios-mark-qi', text: row.agree ? '合' : '歧' }),
        el('span', { class: 'ios-muted tiny', text: row.agree ? '印本 khớp sổ cái' : '印本 lệch sổ cái' }),
      ]),
      el('p', { class: 'ios-muted tiny', text: `Engine: ${row.engine}` }),
      citeBlock(row, onOpen),
    ]));
  }
  sec.appendChild(ol);
  return sec;
}

function yingqiSection(an) {
  const sec = el('section', { class: 'ios-lab-block', id: 'ios-yingqi' }, [
    el('h3', { class: 'ios-lab-h', text: '应期' }),
    el('p', { class: 'ios-muted tiny', text: 'Sự kiện đã ghi trên bản in. Mỗi hàng là luật giữ / không giữ — không phải vận hạn.' }),
  ]);
  const packs = verifyAnYingqi(an);
  if (!packs.length) {
    sec.appendChild(el('p', { class: 'ios-muted', text: 'Bản in này chưa ghi 应期.' }));
    return sec;
  }
  for (const pack of packs) {
    const box = el('div', { class: 'ios-yingqi-event' }, [
      el('p', { class: 'ios-yingqi-title', text: `${pack.event.label || pack.event.type} · ${pack.event.year} ${pack.yearGZ}` }),
    ]);
    for (const rule of pack.rules) {
      box.appendChild(el('div', { class: 'ios-yingqi-row', 'data-hold': rule.hold ? '1' : '0' }, [
        el('span', { class: rule.hold ? 'ios-mark-he' : 'ios-mark-qi', text: rule.hold ? 'giữ' : 'không giữ' }),
        el('span', { text: rule.copy }),
      ]));
    }
    sec.appendChild(box);
  }
  return sec;
}

function paintThiGrade(host, scan, pick, onOpen) {
  clear(host);
  const best = scan.best;
  const match = pick.hour === best.hour;
  const line = match
    ? 'khớp khóa 教材'
    : `lệch khóa; đứng đầu engine là ${best.zhiVi} (${best.hour}h) (điểm nhất quán cụm ${best.score})`;
  host.append(
    el('p', { class: 'ios-thi-grade-line', id: 'ios-thi-grade-line', text: line }),
    el('p', { class: 'ios-muted tiny', text: 'Điểm này là khóa / lập luận — không phải phẩm chất mệnh.' }),
  );
  const hourCite = citeTheme('hour', line);
  if (hourCite) host.appendChild(citeBlock(hourCite, onOpen));
  const axes = hieuKhaoRows(scan.family || { pairs: [] });
  const axisRows = axes.length ? axes : [];
  if (axisRows.length) {
    host.appendChild(el('p', { class: 'ios-muted tiny', text: 'Trục sổ cái có đoạn kinh đã kiểm:' }));
    host.appendChild(el('ol', { class: 'ios-lab-ol' }, axisRows.map((n) => citeBlock(n, onOpen))));
  }
}

export async function mountNghiem(host, ctx = {}) {
  clear(host);
  const root = el('div', { class: 'ios-lab', id: 'ios-nghiem' });
  host.appendChild(root);

  const an = ctx.anId ? getAn(ctx.anId) : null;
  if (!an) {
    root.append(
      el('h2', { text: 'Đối' }),
      el('p', { class: 'ios-muted', text: 'Chưa mở án. Vào tab Án và chọn một án cổ / 教材.' }),
      el('button', {
        type: 'button', class: 'ios-btn-primary', text: 'Về Án cổ',
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

  const hint = jieqiHint(an);
  root.append(
    el('h2', { text: an.title }),
    el('div', { class: 'ios-badges' }, [
      an.jiaocai ? el('span', { class: 'ios-chip', text: '教材' }) : null,
      an.jiaocai ? el('span', { class: 'ios-chip', text: '印本' }) : null,
    ].filter(Boolean)),
    el('p', { class: 'ios-muted tiny', text: 'Thi khóa 时辰 trước — hiệu khảo và 应期 cùng bản in.' }),
    hint ? el('p', { class: 'ios-muted tiny', id: 'ios-jieqi-hint', text: `工具: ${hint}` }) : null,
  );

  const disputed = (an.members || []).filter((m) => m.hourUnknown);
  const thi = el('section', { class: 'ios-lab-block', id: 'ios-thi' }, [
    el('h3', { class: 'ios-lab-h', text: 'Thi' }),
    el('p', { class: 'ios-muted tiny', text: disputed.length
      ? `时柱 ${roleVi(disputed[0].role)} đang khoá. Chọn 1 trong 12 地支 — chấm khóa / lập luận.`
      : 'Không có trụ 时辰未记 trên án này.' }),
  ]);
  const gradeHost = el('div', { id: 'ios-nghiem-result' });
  if (disputed.length) {
    const cells = shiChenList();
    const grid = el('div', { class: 'ios-shi-grid', id: 'ios-hour-table' });
    const btns = [];
    for (const cell of cells) {
      const btn = el('button', {
        type: 'button',
        class: 'ios-shi-btn',
        'data-hour': String(cell.hour),
        text: cell.zhi,
        'aria-label': `${cell.zhi} ${cell.zhiVi}`,
      });
      btns.push(btn);
      grid.appendChild(btn);
    }
    const hoursWrap = el('div', { id: 'ios-thi-hours' }, [grid]);
    thi.append(hoursWrap, gradeHost);

    let pack = null;
    const sit = (cell) => {
      if (!pack) {
        try { pack = runRectify(an); } catch (err) {
          clear(gradeHost);
          gradeHost.appendChild(el('p', { class: 'ios-warn', text: err.message || String(err) }));
          return;
        }
      }
      const scan = pack.scans[0];
      if (!scan) {
        clear(gradeHost);
        gradeHost.appendChild(el('p', { class: 'ios-muted', text: 'Không quét được khóa.' }));
        return;
      }
      scan.family = pack.cluster?.family;
      btns.forEach((b) => b.classList.toggle('active', Number(b.dataset.hour) === cell.hour));
      paintThiGrade(gradeHost, scan, cell, ctx.onOpenCite);
      gradeHost.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => sit(cells[i]));
    });
  } else {
    thi.appendChild(gradeHost);
  }
  root.appendChild(thi);

  if (!cluster) {
    root.append(el('p', { class: 'ios-muted', text: 'Án chưa có nút trên cây — gắn chủ thể hoặc người thân bên dưới.' }));
  } else {
    root.appendChild(hieuKhaoSection(an, cluster, ctx.onOpenCite));
  }

  if (!isPrintedCase(an)) {
    root.appendChild(attachNodeForm(an, ctx));
  }

  if (cluster) root.appendChild(yingqiSection(an));
  if ((an.members || []).length) root.appendChild(solarSourceDetails(an));
}
