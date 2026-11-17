// ============================================================================
//  BẢNG TIÊN PHỦ (DOM): THANG PHÉP chọn tầng · SỔ TUỲ BIẾN của chủ phủ (TIEN-PHU-MANIFEST §3, §7).
// ============================================================================
import { OPTIONS, decodeOpts, encodeOpts } from './custom.js';
import { FLOOR_THEMES } from './styles.js';
import { LEVELS } from './tower.js';

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

/** thang phép: floors [{ k, y, name }], cur (chỉ số tầng hiện tại), go(k) */
export function liftBody({ floors, cur, go }) {
  const box = h('<div class="hq-yc"><p class="hq-muted">Đứng trên đĩa ngọc, chọn tầng — cột sáng đưa bạn lên / xuống trong chớp mắt.</p><div class="hq-actions" style="flex-wrap:wrap;gap:6px"></div></div>');
  const row = box.querySelector('.hq-actions');
  for (const f of [...floors].reverse()) {
    const b = h(`<button class="hq-btn" type="button" style="min-width:150px">${f.k === cur ? '● ' : ''}${f.name}</button>`);
    b.disabled = f.k === cur; b.onclick = () => go(f.k);
    row.append(b);
  }
  return box;
}

/** sổ tuỳ biến: optStr (chuỗi hiện tại), styleName, onSave(chuỗi mới) */
export function customBody({ optStr, styleName, onSave }) {
  const o = decodeOpts(optStr) || decodeOpts('');
  const box = h(`<div class="hq-yc"><p class="hq-muted">Phong cách gốc: <b>${styleName}</b>. Mọi chi tiết dưới đây đổi được bất cứ lúc nào — phủ dựng lại ngay khi lưu. Đồ bài trí từng gian, từng tầng thì bày bằng «Bài trí» như nhà thường.</p></div>`);
  const grid = h('<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px"></div>');
  for (const op of OPTIONS) {
    const lab = h(`<label style="display:flex;flex-direction:column;font-size:13px">${op.name}<select class="hq-input"></select></label>`), sel = lab.querySelector('select');
    op.choices.forEach((c, i) => { const opt = document.createElement('option'); opt.value = i; opt.textContent = c.name; if (c.col) opt.style.background = c.col; if ((o[op.id] || 0) === i) opt.selected = true; sel.append(opt); });
    sel.onchange = () => { o[op.id] = Number(sel.value); };
    grid.append(lab);
  }
  box.append(grid, h('<h4 style="margin:10px 0 4px">Chủ đề từng tầng lầu</h4>'));
  const tg = h('<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px"></div>');
  for (let k = 0; k < LEVELS; k++) {
    const lab = h(`<label style="display:flex;flex-direction:column;font-size:13px">Tầng ${k + 1}<select class="hq-input"></select></label>`), sel = lab.querySelector('select');
    [...FLOOR_THEMES, { name: 'Để trống (tự bài trí)' }].forEach((t, i) => { const opt = document.createElement('option'); opt.value = i; opt.textContent = t.name; if ((o.themes[k] ?? k) === i) opt.selected = true; sel.append(opt); });
    sel.onchange = () => { o.themes[k] = Number(sel.value); };
    tg.append(lab);
  }
  box.append(tg);
  const act = h('<div class="hq-actions" style="margin-top:10px"><button class="hq-btn primary" type="button">Lưu &amp; dựng lại phủ</button><button class="hq-btn" type="button">Về nguyên bản</button></div>');
  const [save, reset] = act.querySelectorAll('button');
  save.onclick = () => onSave(encodeOpts(o));
  reset.onclick = () => onSave('');
  box.append(act);
  return box;
}
