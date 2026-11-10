// ============================================================================
//  GIAO DIỆN HUYỀN THÀNH LUẬT — sách luật (phím L), phán quyết khi phá công trình, cai ngục (chuộc tội),
//  giám mỏ (đại xá). Luật thuần: law.js.
// ============================================================================
import { fmt as fmtCoin } from './coins.js';
import { walletXu } from './life.js';
import * as LAW from './law.js';
import { esc } from './stations.js';
import * as C from './cosmetics.js';

const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const KIND = { fine: 'Phạt tiền', jail: 'Giam Thiên Lao', mine: 'Khổ sai Khoáng Sơn', perma: 'Khổ sai vĩnh viễn' };
const fmtLeft = (ms) => { const m = Math.max(0, Math.ceil(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)} giờ ${m % 60} phút` : `${m} phút`; };

/** dòng tóm tắt án đang thụ (HUD + bảng) */
export function sentenceLine(S, now = Date.now()) {
  if (!S) return '';
  if (S.kind === 'jail') return `⛓ Thiên Lao · còn ${fmtLeft(S.until - now)}`;
  if (S.kind === 'mine') return `⛏ Khoáng Sơn · ${S.mined}/${S.quota} quặng`;
  return `⛏ Khổ sai vĩnh viễn · đã đào ${S.mined} quặng`;
}

function articles() {
  return `<ol class="hq-law-arts">${LAW.ARTICLES.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol>`;
}
function recordList(L) {
  if (!L.record.length) return '<p class="hq-note">Lý lịch trong sạch — chưa có tiền án.</p>';
  return `<ul class="hq-law-rec">${L.record.slice(-8).reverse().map((r) => `<li>${new Date(r.at).toLocaleDateString('vi-VN')} · ${esc(r.gate || '')} · ${r.points} điểm tội · ${KIND[r.kind] || r.kind}</li>`).join('')}</ul>`;
}

export function lawBookBody(api) {
  const L = LAW.lawState(api.state), S = LAW.serving(api.state);
  return el(`<div class="hq-law">
    <p class="hq-note">Huyền Thành Luật do Huyền Thành Phủ ban hành, dựng trên bát tự và phong thủy. Trong tường Bát Quái Thành có đại trận che chở; ngoài thành, mỗi công trình giữ địa khí một vùng — phá đi là có tội.</p>
    ${S ? `<p class="hq-law-now">${sentenceLine(S)}</p>` : ''}
    <h4>Bộ luật</h4>${articles()}
    <h4>Lý lịch tư pháp · ${L.record.length} tiền án${L.record.length >= LAW.PERMA_AT - 1 ? ' — lần tới là khổ sai vĩnh viễn' : ''}</h4>${recordList(L)}
  </div>`);
}

export function verdictBody(api, rec, crime, sen) {
  const rows = crime.factors.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${typeof v === 'number' && v !== 1 && k !== 'Cỡ công trình' ? '×' : ''}${v}</td></tr>`).join('');
  const what = sen.kind === 'fine' ? `Đã thu ${sen.fine} Phúc Khí nộp công khố.` : sen.kind === 'jail' ? 'Nha dịch áp giải vào Thiên Lao. Hết hạn sẽ được thả; có thể nộp tiền chuộc với cai ngục.' : sen.kind === 'mine' ? 'Bị đày sang Khoáng Sơn. Đào đủ số quặng mới được tha.' : `Tái phạm lần thứ ${LAW.PERMA_AT}: khổ sai vĩnh viễn tại Khoáng Sơn. Chỉ Đại Xá (${LAW.PARDON_NGOC} Ngọc) mới thoát.`;
  return el(`<div class="hq-law">
    <p class="hq-law-crime">Tội <b>phá hoại địa khí</b> — công trình tại cung ${esc(crime.gate)} (${Math.round(rec.x)}, ${Math.round(rec.z)}).</p>
    <table class="hq-law-tab"><tbody>${rows}<tr class="sum"><td>Điểm tội</td><td>${crime.points}</td></tr></tbody></table>
    <p class="hq-law-sen">⚖ ${esc(sen.label)}</p>
    <p class="hq-note">${what}</p>
  </div>`);
}

export function wardenBody(api, onFree) {
  const S = LAW.serving(api.state), box = el('<div class="hq-law"></div>');
  if (!S || S.kind !== 'jail') { box.append(el('<p class="hq-note">«Ngươi không có tên trong sổ lao. Đi đi.»</p>')); return box; }
  const cost = LAW.bailCost(api.state);
  box.append(el(`<div><p>«${sentenceLine(S)}. Ngồi yên mà sám hối.»</p><p class="hq-note">Chuộc phần hạn còn lại: <b>${fmtCoin(cost)}</b> (đang có ${fmtCoin(walletXu(api.state))}).</p></div>`));
  const b = el(`<div class="hq-actions"><button class="hq-btn" type="button" ${walletXu(api.state) < cost ? 'disabled' : ''}>Nộp ${fmtCoin(cost)} chuộc tội</button></div>`);
  b.querySelector('button').onclick = () => { if (LAW.bail(api.state)) { onFree('Đã nộp tiền chuộc — được thả khỏi Thiên Lao.'); } };
  box.append(b);
  return box;
}

export function overseerBody(api, onFree) {
  const S = LAW.serving(api.state), box = el('<div class="hq-law"></div>');
  if (!S || (S.kind !== 'mine' && S.kind !== 'perma')) { box.append(el('<p class="hq-note">«Mỏ này chỉ dành cho phạm nhân khổ sai.»</p>')); return box; }
  box.append(el(`<p>«${sentenceLine(S)}. Mạch linh khoáng sáng xanh — cầm cuốc mà đào.»</p>`));
  if (S.kind === 'perma') {
    const W = C.wardrobe(api.state);
    box.append(el(`<p class="hq-note">Đại Xá: nộp <b>${LAW.PARDON_NGOC}</b> Ngọc, xoá một nửa tiền án (đang có ${W.ngoc || 0} Ngọc).</p>`));
    const b = el(`<div class="hq-actions"><button class="hq-btn" type="button" ${(W.ngoc || 0) < LAW.PARDON_NGOC ? 'disabled' : ''}>Xin Đại Xá</button></div>`);
    b.querySelector('button').onclick = () => { if (LAW.pardon(api.state, W)) onFree('Ơn Đại Xá — được tha khỏi Khoáng Sơn.'); };
    box.append(b);
  }
  return box;
}
