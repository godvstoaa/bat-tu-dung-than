// ============================================================================
//  THẦY LUẬN (AI) — dùng nguyên bộ AI của app (../engine/ai.js: askAI stream + tool tra cứu,
//  tóm tắt lá số đã tính, «não» suy luận) + tự chấm Neo (../engine/neo-checker.js).
//  Trong game: thầy trả lời câu khách NPC hỏi, người chơi hỏi tiếp được.
//  Chỉ bản web (FEATURES.ai) — iOS tắt như app chính. Tải lười: ai.js rất nặng.
// ============================================================================
import { esc } from './stations.js';
import { buzz } from './haptics.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

// markdown tối giản (đậm, nghiêng, gạch đầu dòng, đoạn) — giữ an toàn: escape trước rồi mới thay
function md(text) {
  const t = esc(String(text || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim());
  return t
    .replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>')
    .replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>')
    .split(/\n{2,}/).map((p) => (/^<(ul|b)/.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)).join('');
}
const clean = (s) => String(s || '').replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();

/**
 * Khung hỏi–đáp với thầy.
 * @param api   game api (toast, masterSay?)
 * @param R     kết quả analyze() của người được luận
 * @param who   tên gọi người được luận (vd «Chị Lan»)
 * @param first câu hỏi mở đầu (khách hỏi) — tự gửi ngay
 */
export function masterChatBody(api, { R, who, first, starters = [], persona = null, personaForce = false, masterName = 'Thầy', greet = '', frame = null, gate = null, placeholder = '' }) {
  const root = el(`<div class="hq-master">
    <div class="hq-master-log" data-role="log"></div>
    <div class="hq-chips-row" data-role="sugg"></div>
    <form class="hq-master-ask" data-role="form">
      <input class="hq-input" name="q" maxlength="300" placeholder="${esc(placeholder || `Hỏi thầy thêm về lá số của ${who}…`)}" autocomplete="off">
      <button class="hq-btn hq-primary" type="submit">Hỏi</button>
    </form>
    <p class="hq-note">AI luận trên lá số tính sẵn — để tham khảo, không thay quyết định của bạn.</p>
  </div>`);
  const log = root.querySelector('[data-role=log]');
  const form = root.querySelector('[data-role=form]');
  const sugg = root.querySelector('[data-role=sugg]');
  const history = [];
  let busy = false, abort = null, rafPaint = 0, rafText = '';
  let lib = null;
  const load = async () => {
    lib ||= Promise.all([import('../engine/ai.js'), import('../engine/neo-checker.js')]).then(([ai, neo]) => ({ ...ai, checkNeo: neo.checkNeo }));
    try { return await lib; } catch (e) { lib = null; throw e; } // hỏng lần này vẫn được thử lại — không cache promise rejected
  };

  async function ask(q, asker) {
    if (busy || !q) return;
    const g = gate ? gate() : { ok: true };
    if (!g.ok) { log.append(el(`<div class="hq-msg a"><span>${esc(masterName)}</span><div class="hq-msg-body"><p>${esc(g.msg || 'Hôm nay hỏi vậy đủ rồi.')}</p></div></div>`)); return; }
    busy = true; form.q.disabled = true; sugg.innerHTML = '';
    log.append(el(`<div class="hq-msg q"><span>${esc(asker)}</span><p>${esc(q)}</p></div>`));
    const a = el(`<div class="hq-msg a streaming"><span>${esc(masterName)}</span><div class="hq-msg-body"><p class="hq-sub">${esc(masterName)} đang xem lá số…</p></div></div>`);
    log.append(a);
    const body = a.querySelector('.hq-msg-body');
    a.scrollIntoView({ block: 'nearest' });
    api.masterSay?.('…');
    try {
      const L = await load();
      abort = new AbortController();
      const { source, text } = await L.askAI(frame ? frame(q) : q, R, L.getConfig(), {
        history, signal: abort.signal, persona, personaForce,
        onStatus: (s) => { body.innerHTML = `<p class="hq-sub">${esc(s)} …</p>`; },
        // gộp token trong cùng khung hình: mỗi rAF chỉ vẽ một lần (token dồn cuối khung)
        onToken: (_d, full) => {
          rafText = full;
          if (!rafPaint) rafPaint = requestAnimationFrame(() => { rafPaint = 0; body.innerHTML = md(clean(rafText)); });
        },
      });
      if (rafPaint) { cancelAnimationFrame(rafPaint); rafPaint = 0; }
      body.innerHTML = md(text);
      a.classList.remove('streaming');
      history.push({ role: 'user', content: q }, { role: 'assistant', content: clean(text) });
      api.masterSay?.(clean(text).split(/[.!?\n]/)[0].slice(0, 60));
      // tự chấm Neo: câu trả lời có khớp dữ liệu lá số không
      if (source === 'ai') {
        try {
          const n = L.checkNeo(String(text).slice(0, 8000), L.buildChartBrief(R));
          if (n && n.score != null) a.append(el(`<div class="hq-neo ${n.hasRedFlag ? 'bad' : ''}">${n.hasRedFlag ? '⚠' : '🎯'} Neo ${n.score}% · ${n.totalChecked} mốc dữ liệu${n.conflicts?.length ? ` · ${n.conflicts.length} mâu thuẫn` : ' · khớp lá số'}</div>`));
        } catch (_) { /* bỏ qua */ }
      } else {
        a.append(el('<div class="hq-neo">Luận cục bộ (chưa kết nối máy chủ AI)</div>'));
      }
      buzz('light');
      // gợi ý câu hỏi tiếp của app
      try {
        const f = L.suggestFollowups(q, R, text, history) || [];
        sugg.innerHTML = f.slice(0, 3).map((x) => `<button type="button" class="hq-choice">${esc(x)}</button>`).join('');
      } catch (_) { /* bỏ qua */ }
    } catch (e) {
      if (e?.name !== 'AbortError') body.innerHTML = '<p>Thầy đang bận, lát hỏi lại nhé.</p>';
    } finally {
      busy = false; form.q.disabled = false; abort = null;
      root.closest('.hq-panel-body')?.scrollTo({ top: 1e6, behavior: 'smooth' });
    }
  }

  form.onsubmit = (e) => { e.preventDefault(); const q = form.q.value.trim(); form.q.value = ''; ask(q, 'Bạn'); };
  sugg.addEventListener('click', (e) => { const b = e.target.closest('.hq-choice'); if (b) ask(b.textContent, 'Bạn'); });
  // panel đóng → huỷ luồng (chỉ dõi trong subtree panel — panel đóng là replaceChildren bên trong nó)
  const mo = new MutationObserver(() => { if (!root.isConnected) { abort?.abort(); mo.disconnect(); } });
  requestAnimationFrame(() => { if (root.parentNode) mo.observe(root.closest('.hq-panel') || document.body, { childList: true, subtree: true }); });
  if (greet) log.append(el(`<div class="hq-msg a"><span>${esc(masterName)}</span><div class="hq-msg-body"><p>${esc(greet)}</p></div></div>`));
  if (first) requestAnimationFrame(() => ask(first, who));
  else { sugg.innerHTML = starters.map((x) => `<button type="button" class="hq-choice">${esc(x)}</button>`).join(''); if (greet) requestAnimationFrame(() => form.q.focus({ preventScroll: true })); }
  return root;
}
