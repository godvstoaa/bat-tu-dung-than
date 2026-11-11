// ============================================================================
//  KHUNG CHAT THẦY BÓI (v4) — gặp thầy là mở thẳng ô hỏi, AI trả lời theo lá số của người chơi.
//  Dùng lại master-ui.js › masterChatBody (askAI stream + 38 tool tra cứu + gợi ý câu tiếp).
//  Bảng thầy / nguồn lá số / hạn mức khách: fortune-npc.js (thuần).
// ============================================================================
import { MASTERS, chartSource, framedQuestion, useGuestQuota, guestLeft } from './fortune-npc.js';
import { chartOf, esc } from './stations.js';
import { FEATURES } from './features.js';
import * as S from './state.js';

const QKEY = 'hq-fortune-q';
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const readQ = () => { try { return JSON.parse(localStorage.getItem(QKEY) || 'null'); } catch (e) { return null; } };
const writeQ = (q) => { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch (e) { /* máy không có localStorage */ } };

/** lá số đang dùng của người chơi (kiếp luân hồi nếu có) — engine analyze, tính tại máy */
export function playerChart(state) {
  const src = chartSource(state);
  if (!src) return null;
  try { return chartOf(src); } catch (e) { return null; }
}

/**
 * Thân panel chat với thầy `masterId`.
 * extras: [{ label, onClick }] — nút phụ nhỏ phía trên (án luyện nghề, tự gieo quẻ, la bàn…), không chen vào luồng chat.
 */
export function fortuneBody(api, masterId, { extras = [] } = {}) {
  const M = MASTERS[masterId] || MASTERS.tubinh;
  const wrap = el('<div class="hq-fortune"></div>');
  if (extras.length) {
    const row = el('<div class="hq-actions hq-fortune-extra"></div>');
    for (const x of extras) { const b = el(`<button class="hq-btn" type="button">${esc(x.label)}</button>`); b.onclick = x.onClick; row.append(b); }
    wrap.append(row);
  }
  const R = playerChart(api.state);
  if (!R) {
    wrap.append(el(`<p>${esc(M.name)}: «Khách chưa khắc bát tự. Ra cổng quán chọn "Sửa bát tự", rồi quay lại thầy xem cho.»</p>`));
    return wrap;
  }
  if (!FEATURES.ai) { wrap.append(el(`<p>${esc(M.name)} đang tĩnh toạ, hôm khác hãy hỏi.</p>`)); return wrap; }
  const box = el(`<div class="hq-loadbox"><p class="hq-sub">${esc(M.name)} đang bày lá số…</p></div>`);
  wrap.append(box);
  const loggedIn = () => !!api.loggedIn?.();
  const today = () => S.todayStr(new Date());
  const left = guestLeft(readQ(), today(), loggedIn());
  import('./master-ui.js').then((m) => {
    if (!box.isConnected && !wrap.isConnected) return;
    const fictional = !!chartSource(api.state)?.fictional;
    box.replaceWith(m.masterChatBody(api, {
      R, who: api.state.player?.name || 'Bạn', masterName: M.name,
      greet: M.greet + (fictional ? ' (Đang xem lá số kiếp này.)' : ''),
      starters: M.starters, persona: M.persona, personaForce: !!FEATURES.gamePersona,
      frame: (q) => framedQuestion(masterId, q),
      placeholder: Number.isFinite(left) ? `Gõ câu hỏi… (còn ${Math.max(0, left)} câu miễn phí hôm nay — đăng nhập để hỏi thoải mái)` : `Gõ câu hỏi cho ${M.name}…`,
      gate: () => {
        const r = useGuestQuota(readQ(), today(), loggedIn());
        if (!r.ok) return { ok: false, msg: 'Hôm nay khách hỏi đủ 10 câu rồi. Đăng nhập tài khoản để hỏi không giới hạn, hoặc mai quay lại.' };
        writeQ(r.next); api.tut?.('askMaster'); return { ok: true };
      },
    }));
  }).catch(() => { box.innerHTML = `<p>Chưa mời được ${esc(M.name)}, thử lại sau nhé.</p>`; });
  return wrap;
}

/** mở panel chat thầy (gọi từ NPC đi lại, miếu, nút HUD…) */
export function openFortune(api, masterId, opts) {
  const M = MASTERS[masterId] || MASTERS.tubinh;
  api.panel.open({ title: M.name, body: fortuneBody(api, masterId, opts) });
}
