// ============================================================================
//  KHUNG TRÒ CHUYỆN VỚI NPC (P6) — gõ tự do (≤ 300 ký tự), NPC trả lời bằng LLM qua /api/npc/chat.
//  Thẻ hành động do máy chủ đã duyệt (báo giá trong khung 80–110%, mời làm công, cho chịu, gợi ý việc mệnh của chính bạn).
//  Khách chưa đăng nhập / hết lượt / AI tắt / mất mạng → câu mẫu theo vai (G2), nghiệp vụ vẫn qua nút bấm như cũ.
//  Không gửi ngày giờ sinh: chỉ tên nhân vật, nghề, cấp, bậc giàu, hành Dụng / Hỷ / Kỵ.
// ============================================================================
import * as NC from './npc-chat-core.js';
import * as LIFE from './life.js';
import { buyDeal, ITEM } from './items.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const log = new Map(); // npc → [{ who, text }] (giữ trong phiên)

/** npc: { id, name, role, persona?, shop?: { items: [{ id, name, price (đồng) }] }, hiring?: { job } } */
export function chatBody(api, npc, opt = {}) {
  const root = el(`<div class="hq-chat"><div class="hq-chat-log" aria-live="polite"></div><form class="hq-chat-in"><input class="hq-input" maxlength="${NC.MAX_IN}" placeholder="Nói với ${esc(npc.name)}…" autocomplete="off"><button class="hq-btn hq-primary" type="submit">Nói</button></form><p class="hq-note hq-chat-q"></p><p class="hq-note">Lá số trong game là yếu tố trò chơi, không phải lời khuyên đời thực.</p></div>`);
  const box = root.querySelector('.hq-chat-log'), form = root.querySelector('form'), inp = form.querySelector('input'), qn = root.querySelector('.hq-chat-q');
  const hist = log.get(npc.id) || []; log.set(npc.id, hist);
  const add = (who, text, actions = [], keep = true) => {
    if (keep) { hist.push({ who, text }); if (hist.length > 30) hist.shift(); }
    const row = el(`<div class="hq-chat-row ${who === 'me' ? 'me' : 'npc'}"><b>${who === 'me' ? 'Bạn' : esc(npc.name)}</b><span>${esc(text)}</span></div>`);
    for (const a of actions) row.append(card(a));
    box.append(row); box.scrollTop = box.scrollHeight;
  };
  const card = (a) => {
    if (a.tool === 'quote_price') {
      const c = el(`<div class="hq-chat-act">🏷 ${esc(a.name)}: <s>${a.list} đồng</s> → <b>${a.price} đồng</b> <button class="hq-btn" type="button">Mua giá này</button></div>`);
      c.querySelector('button').onclick = () => { if (!ITEM[a.item]) { api.toast('Món này không có trong hàng tiệm.'); return; } const r = buyDeal(api.state, { id: a.item, xu: a.price * 100 }); api.toast(r.ok ? `🛍 Mua ${a.name} giá ${a.price} đồng.` : r.reason); if (r.ok) { api.save?.(); c.querySelector('button').disabled = true; } };
      return c;
    }
    if (a.tool === 'offer_job') { const c = el(`<div class="hq-chat-act">📋 Mời làm công: ${esc(a.job)} <button class="hq-btn" type="button">Xem bảng Chiêu công</button></div>`); c.querySelector('button').onclick = () => opt.onJob?.(); return c; }
    if (a.tool === 'extend_credit') { const c = el(`<div class="hq-chat-act">📒 Chủ tiệm cho ghi sổ chịu tới ${a.amount} đồng</div>`); opt.onCredit?.(a.amount); return c; }
    if (a.tool === 'give_hint') return el('<div class="hq-chat-act">✨ Lời ấy như ám chỉ việc mệnh hôm nay của bạn — để ý giờ và chỗ.</div>');
    return el('<span></span>');
  };
  for (const h of hist) add(h.who, h.text, [], false); // vẽ lại lịch sử phiên
  if (!hist.length) add('npc', NC.fallback(npc, 'greet', Date.now() / 1000));

  form.onsubmit = async (e) => {
    e.preventDefault();
    const c = NC.cleanInput(inp.value); if (!c.ok) { if (c.err === 'rude') api.toast('Lời lẽ chưa phải phép.'); return; }
    inp.value = ''; add('me', c.text); form.querySelector('button').disabled = true;
    const L = api.life(), s = api.state, y = s.player?.yong;
    const ctx = { name: s.player?.name || '', place: opt.place || '', hour: new Date().getHours(), ganzhi: api.dayGZ?.() || '', job: opt.job?.() || '', level: api.level?.() || 1, wealth: LIFE.tierOf(LIFE.wealthDong(L)), yong: y ? { primary: y.primary, accent: y.accent || y.secondary || '', ji: y.ji || '' } : null, quest: api.questHint?.() || null, rep: opt.rep?.() ?? 50 };
    let r = null;
    try { const res = await fetch('/api/npc/chat', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ npc: { id: npc.id, name: npc.name, role: npc.role, persona: npc.persona, shop: npc.shop, hiring: npc.hiring }, text: c.text, ctx }) }); r = res.ok ? await res.json() : null; } catch (err) { r = null; }
    form.querySelector('button').disabled = false;
    if (!r?.ok) { add('npc', NC.fallback(npc, NC.route(c.text).intent, Date.now() / 1000)); qn.textContent = 'Mất kết nối — NPC trả lời câu mẫu.'; return; }
    add('npc', r.text, r.actions || []);
    qn.textContent = r.fallback === 'login' ? 'Đăng nhập tài khoản để NPC trò chuyện tự do (khách nhận câu mẫu).' : r.fallback === 'quota' ? 'Hôm nay đã hết lượt trò chuyện tự do — mai quay lại.' : r.left ? `Còn ${r.left.chat} câu thường · ${r.left.biz} câu nghiệp vụ hôm nay.` : '';
    inp.focus({ preventScroll: true });
  };
  return root;
}
