// ============================================================================
//  Giao diện Giải Án (màn dọc): khách NPC 6 bước · Án Cổ 3 bước.
//  Luật + đáp án: ./cases.js. Tải lười (kb.js nặng) khi mở án đầu tiên.
// ============================================================================
import * as C from './cases.js';
import * as S from './state.js';
import { GAN, ZHI, WX_VI } from '../engine/constants.js';
import { esc, softRating } from './stations.js';
import { buzz } from './haptics.js';
import { TEXT, FEATURES } from './features.js';
import { ROBE } from './render.js';

const WX_CLASS = { 木: 'wx-moc', 火: 'wx-hoa', 土: 'wx-tho', 金: 'wx-kim', 水: 'wx-thuy' };
const COL = [['time', 'Giờ'], ['day', 'Ngày'], ['month', 'Tháng'], ['year', 'Năm']];
const NOTE = 'Án luyện tập: khách là nhân vật hư cấu, đáp án do engine cổ pháp tính — để học, không để phán.';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
const charWx = (ch) => GAN[ch]?.wx || ZHI[ch]?.wx;
const charVi = (ch) => GAN[ch]?.vi || ZHI[ch]?.vi || '';

function pillarsHtml(p, { mark = null } = {}) {
  return `<div class="hq-pillars sm">${COL.map(([k, lab]) => {
    const [g, z] = [...p[k]];
    const m = mark ? (mark[k] ? ' good' : ' bad') : '';
    return `<div class="hq-pillar flip${k === 'day' ? ' is-day' : ''}${m}"><div class="hq-pl-label">${lab}</div>
      <div class="hq-pl-char ${WX_CLASS[charWx(g)]}">${g}</div><div class="hq-pl-vi">${charVi(g)}</div>
      <div class="hq-pl-char ${WX_CLASS[charWx(z)]}">${z}</div><div class="hq-pl-vi">${charVi(z)}</div></div>`;
  }).join('')}</div>`;
}

const REF_HTML = `<details class="hq-ref"><summary>📖 Bảng tra (Ngũ Hổ Độn · Ngũ Thử Độn · giờ)</summary>
  <p><b>Năm</b>: đổi năm ở tiết Lập Xuân (~4/2), không phải mùng 1 Tết. Năm 2024 = Giáp Thìn, cứ thế lần can chi.</p>
  <p><b>Tháng</b> theo tiết: Dần (Lập Xuân ~4/2) · Mão (~6/3) · Thìn (~5/4) · Tỵ (~6/5) · Ngọ (~6/6) · Mùi (~7/7) · Thân (~8/8) · Dậu (~8/9) · Tuất (~8/10) · Hợi (~7/11) · Tý (~7/12) · Sửu (~6/1).</p>
  <p><b>Ngũ Hổ Độn</b> (can năm → can tháng Dần): Giáp/Kỷ → Bính Dần · Ất/Canh → Mậu Dần · Bính/Tân → Canh Dần · Đinh/Nhâm → Nhâm Dần · Mậu/Quý → Giáp Dần.</p>
  <p><b>Giờ</b>: Tý 23–1 · Sửu 1–3 · Dần 3–5 · Mão 5–7 · Thìn 7–9 · Tỵ 9–11 · Ngọ 11–13 · Mùi 13–15 · Thân 15–17 · Dậu 17–19 · Tuất 19–21 · Hợi 21–23.</p>
  <p><b>Ngũ Thử Độn</b> (can ngày → can giờ Tý): Giáp/Kỷ → Giáp Tý · Ất/Canh → Bính Tý · Bính/Tân → Mậu Tý · Đinh/Nhâm → Canh Tý · Mậu/Quý → Nhâm Tý.</p>
  <p><b>Ngày</b>: tra lịch vạn niên (gợi ý sẽ mở trụ Ngày).</p></details>`;

// ---------------------------------------------------------------------------
// Khung chung: đầu án + thanh tiến trình + vùng bước
// ---------------------------------------------------------------------------
function shell(headHtml, steps, titles = C.STEP_TITLE) {
  return el(`<div class="hq-case">
    <div class="hq-case-head">${headHtml}</div>
    <div class="hq-steps">${steps.map((k) => `<span data-s="${k}" title="${titles[k]}"></span>`).join('')}</div>
    <h4 class="hq-step-title" data-role="title"></h4>
    <div data-role="step"></div>
    <div data-role="feedback" class="hq-feedback" hidden></div>
    <div class="hq-actions"><button class="hq-btn hq-primary" data-role="next">Nộp</button></div>
    <p class="hq-note">${NOTE}</p>
  </div>`);
}

function runSteps(api, root, steps, render, finish, titles = C.STEP_TITLE) {
  const $ = (r) => root.querySelector(`[data-role=${r}]`);
  const results = {};
  let i = 0, phase = 'answer', current = null;
  function show() {
    const k = steps[i];
    root.querySelectorAll('.hq-steps span').forEach((d, j) => { d.className = j < i ? 'done' : j === i ? 'on' : ''; });
    $('title').textContent = `Bước ${i + 1}/${steps.length} · ${titles[k]}`;
    $('feedback').hidden = true;
    $('next').textContent = 'Nộp';
    $('next').disabled = false;
    phase = 'answer';
    current = render(k, $('step'));
    // giải án cần chỗ: bung sheet cao (điện thoại) ngay khi gắn vào bảng
    requestAnimationFrame(() => { root.closest('.hq-panel')?.classList.add('full'); root.closest('.hq-panel-body')?.scrollTo({ top: 0 }); });
  }
  $('next').onclick = () => {
    if (phase === 'answer') {
      const ans = current.answer();
      if (ans == null) { api.toast(current.need || 'Chọn đáp án trước đã.'); return; }
      const r = current.grade(ans);
      results[steps[i]] = r;
      const fb = $('feedback');
      fb.hidden = false;
      fb.className = `hq-feedback ${r.score >= 0.99 ? 'good' : r.score >= 0.5 ? 'mid' : 'bad'}`;
      fb.innerHTML = `<p><b>${r.score >= 0.99 ? '✓ Chính xác' : r.score >= 0.5 ? '◐ Gần đúng' : '✗ Chưa đúng'}</b> · ${Math.round(r.score * 100)}%</p><p>${esc(r.msg)}</p>${current.reveal ? current.reveal() : ''}`;
      buzz(r.score >= 0.99 ? 'medium' : 'light');
      phase = 'review';
      $('next').textContent = i === steps.length - 1 ? 'Xem kết quả' : 'Tiếp →';
      fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (i < steps.length - 1) { i += 1; show(); } else finish(results);
  };
  show();
}

const chips = (name, items, { multi = false } = {}) => `<div class="hq-chips-row" data-name="${name}">${items.map(([v, lab, cls = '']) => `<button type="button" class="hq-choice ${cls}" data-v="${v}" aria-pressed="false">${lab}</button>`).join('')}</div>`;
function bindChips(root, name, { multi = false, max = 99 } = {}) {
  const row = root.querySelector(`[data-name="${name}"]`);
  row.addEventListener('click', (e) => {
    const b = e.target.closest('.hq-choice'); if (!b) return;
    if (!multi) row.querySelectorAll('.hq-choice').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    else if (b.getAttribute('aria-pressed') !== 'true' && row.querySelectorAll('[aria-pressed=true]').length >= max) return;
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' && multi ? 'false' : 'true');
    buzz('light');
  });
  return () => [...row.querySelectorAll('[aria-pressed=true]')].map((x) => x.dataset.v);
}
const wxChips = (name) => chips(name, C.WX.map((w) => [w, `${w} ${WX_VI[w]}`, WX_CLASS[w]]));

// ---------------------------------------------------------------------------
// Khách NPC — 6 bước
// ---------------------------------------------------------------------------
export function npcCaseBody(api, slot, npc, onDone) {
  const cs = C.buildCase(npc);
  const K = cs.keys;
  const birth = `${String(npc.day).padStart(2, '0')}/${String(npc.month).padStart(2, '0')}/${npc.year} lúc ${String(npc.hour).padStart(2, '0')}:${String(npc.minute).padStart(2, '0')}`;
  const head = `<div class="hq-npc"><span class="hq-npc-ava" style="--c:${ROBE[npc.robe]}">${npc.gender === 'nam' ? '👨' : '👩'}</span>
    <div><b>${esc(npc.call)}</b> · ${npc.age} tuổi · ${esc(npc.job)}<br><span class="hq-sub">Sinh ${birth} (dương lịch) · ${npc.gender}</span></div></div>
    <p class="hq-quote">“${esc(npc.question)}”</p>`;
  const root = shell(head, C.STEP_ORDER);
  let hints = 0;

  function render(k, box) {
    if (k === 'pillars') {
      const slots = { year: ['', ''], month: ['', ''], day: ['', ''], time: ['', ''] };
      const order = [['year', 0], ['year', 1], ['month', 0], ['month', 1], ['day', 0], ['day', 1], ['time', 0], ['time', 1]];
      let sel = 0;
      box.innerHTML = `<p class="hq-sub">Chọn một ô rồi chạm thẻ can/chi. Thứ tự gợi ý: Năm → Tháng → Ngày → Giờ.</p>
        <div class="hq-slots">${COL.map(([p, lab]) => `<div class="hq-slotcol"><span>${lab}</span><button type="button" data-p="${p}" data-i="0"></button><button type="button" data-p="${p}" data-i="1"></button></div>`).join('')}</div>
        <div class="hq-tiles">${cs.tiles.map((ch, j) => `<button type="button" class="hq-tile ${WX_CLASS[charWx(ch)]}" data-t="${j}">${ch}<small>${charVi(ch)}</small></button>`).join('')}</div>
        <div class="hq-actions"><button type="button" class="hq-btn" data-role="hint">💡 Gợi ý (−15%)</button></div>${REF_HTML}`;
      const used = new Set();
      const paint = () => {
        box.querySelectorAll('.hq-slotcol button').forEach((b) => {
          const [p, i2] = [b.dataset.p, +b.dataset.i];
          const ch = slots[p][i2];
          b.textContent = ch || (i2 ? 'chi' : 'can');
          b.className = `${ch ? `filled ${WX_CLASS[charWx(ch)]}` : ''}${order[sel] && order[sel][0] === p && order[sel][1] === i2 ? ' sel' : ''}`;
        });
        box.querySelectorAll('.hq-tile').forEach((t) => { t.disabled = used.has(+t.dataset.t); });
      };
      box.querySelector('.hq-slots').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        const p = b.dataset.p, i2 = +b.dataset.i;
        const idx = order.findIndex(([a, c]) => a === p && c === i2);
        if (slots[p][i2]) { const t = box.querySelector(`.hq-tile[data-used-at="${p}${i2}"]`); if (t) { used.delete(+t.dataset.t); t.removeAttribute('data-used-at'); } slots[p][i2] = ''; }
        sel = idx; paint();
      });
      box.querySelector('.hq-tiles').addEventListener('click', (e) => {
        const t = e.target.closest('.hq-tile'); if (!t || t.disabled || !order[sel]) return;
        const [p, i2] = order[sel];
        if (slots[p][i2]) { const old = box.querySelector(`.hq-tile[data-used-at="${p}${i2}"]`); if (old) { used.delete(+old.dataset.t); old.removeAttribute('data-used-at'); } }
        slots[p][i2] = cs.tiles[+t.dataset.t]; used.add(+t.dataset.t); t.dataset.usedAt = `${p}${i2}`;
        buzz('light');
        const next = order.findIndex(([a, c], j) => j > sel && !slots[a][c]);
        sel = next >= 0 ? next : order.findIndex(([a, c]) => !slots[a][c]);
        paint();
      });
      const HINT_ORDER = ['year', 'time', 'month', 'day'];
      box.querySelector('[data-role=hint]').onclick = () => {
        const p = HINT_ORDER.find((x) => slots[x].join('') !== K.pillars[x]);
        if (!p) return;
        hints += 1;
        for (let i2 = 0; i2 < 2; i2++) {
          const want = K.pillars[p][i2];
          if (slots[p][i2] === want) continue; // ô đã đúng, giữ nguyên
          const t = [...box.querySelectorAll('.hq-tile')].find((x) => cs.tiles[+x.dataset.t] === want && !used.has(+x.dataset.t));
          if (!t) continue; // hết thẻ trống khớp chữ → bỏ ô này, không phá bookkeeping thẻ đã dùng
          if (slots[p][i2]) { const old = box.querySelector(`.hq-tile[data-used-at="${p}${i2}"]`); if (old) { used.delete(+old.dataset.t); old.removeAttribute('data-used-at'); } }
          used.add(+t.dataset.t); t.dataset.usedAt = `${p}${i2}`;
          slots[p][i2] = want;
        }
        api.toast(`Gợi ý: trụ ${COL.find(([x]) => x === p)[1]} là ${K.pillars[p]} (${C.gzVi(K.pillars[p])})`);
        sel = order.findIndex(([a, c]) => !slots[a][c]); paint();
      };
      paint();
      return {
        need: 'Điền đủ 8 ô can chi trước nhé.',
        answer: () => (order.every(([a, c]) => slots[a][c]) ? Object.fromEntries(Object.entries(slots).map(([p, v]) => [p, v.join('')])) : null),
        grade: (a) => C.gradePillars(K.pillars, a, hints),
        reveal: () => pillarsHtml(K.pillars) + `<p class="hq-cite">${esc(cs.cite.pillars)}</p>`,
      };
    }
    if (k === 'wx') {
      box.innerHTML = `${pillarsHtml(K.pillars)}<p>Tính cả can, chi và tàng can — <b>hành nào vượng nhất?</b></p>${wxChips('strong')}<p><b>Hành nào yếu nhất?</b></p>${wxChips('weak')}`;
      const s = bindChips(box, 'strong'), w = bindChips(box, 'weak');
      return {
        answer: () => (s()[0] && w()[0] ? { strong: s()[0], weak: w()[0] } : null),
        grade: (a) => C.gradeWx(K.wx, a),
        reveal: () => `<div class="hq-bars">${C.WX.map((x) => `<div class="hq-bar"><span>${WX_VI[x]}</span><i class="${WX_CLASS[x]}" style="--v:${K.wx.pct[x]}%"></i><b>${Math.round(K.wx.pct[x])}%</b></div>`).join('')}</div>`,
      };
    }
    if (k === 'strength') {
      const dm = cs.R.chart.dayMaster;
      box.innerHTML = `${pillarsHtml(K.pillars)}<p>Nhật chủ <b class="${WX_CLASS[dm.wx]}">${dm.gan} ${dm.vi} ${WX_VI[dm.wx]}</b>. Thân vượng hay nhược?</p>
        ${chips('verdict', [['vuong', 'Thân vượng'], ['nhuoc', 'Thân nhược'], ['trung', 'Trung hoà']])}
        <p class="hq-sub">Vì sao? Đánh dấu điều đúng với lá số:</p>
        ${chips('flags', [['lenh', 'Đắc lệnh — tháng sinh trợ nhật chủ'], ['dia', 'Đắc địa — có gốc ở địa chi'], ['the', 'Đắc thế — lực trợ nhiều hơn lực khắc/tiết']], { multi: true })}`;
      const v = bindChips(box, 'verdict'), f = bindChips(box, 'flags', { multi: true });
      return {
        answer: () => (v()[0] ? { verdict: v()[0], lenh: f().includes('lenh'), dia: f().includes('dia'), the: f().includes('the') } : null),
        grade: (a) => C.gradeStrength(K.strength, a),
        reveal: () => `<p>${esc(cs.explain.strength)}</p>${cs.cite.strength ? `<p class="hq-cite">Trích Thiên Tủy: ${esc(cs.cite.strength)}</p>` : ''}`,
      };
    }
    if (k === 'yong') {
      box.innerHTML = `${pillarsHtml(K.pillars)}<p>Hành nào là <b>Dụng thần</b> — thứ lá số cần nhất để cân bằng?</p>${wxChips('yong')}`;
      const y = bindChips(box, 'yong');
      return {
        answer: () => y()[0] || null,
        grade: (a) => C.gradeYong(K.yong, a),
        reveal: () => `<p>${esc(cs.explain.method)}: ${esc(cs.explain.yong)}</p>${cs.cite.yong ? `<p class="hq-cite">${esc(cs.cite.yong)}</p>` : ''}`,
      };
    }
    if (k === 'timing') {
      box.innerHTML = `<p>Khách hỏi: “${esc(npc.question)}” — trong các năm tới, <b>năm nào thuận nhất</b> (lưu niên hợp Dụng thần ${WX_VI[K.yong.primary]})?</p>
        ${chips('year', K.timing.years.map((y) => [y.year, `${y.year} · ${y.gz} ${C.gzVi(y.gz)}`]))}`;
      const y = bindChips(box, 'year');
      return {
        answer: () => (y()[0] ? +y()[0] : null),
        grade: (a) => C.gradeTiming(K.timing, a),
        reveal: () => `<ul class="hq-plain">${K.timing.years.map((y2) => `<li>${y2.year} ${y2.gz}: ${softRating(y2.rating)}${y2.score === K.timing.best ? ' ★' : ''}</li>`).join('')}</ul>`,
      };
    }
    // advice
    box.innerHTML = `<p>Chọn <b>2 lời khuyên</b> hợp lá số nhất cho ${esc(npc.call)}:</p>
      ${chips('adv', C.WX.map((w) => [w, `<b class="${WX_CLASS[w]}">${WX_VI[w]}</b> · màu ${C.ADVICE_CARDS[w].color} · hướng ${C.ADVICE_CARDS[w].dir} · nghề ${C.ADVICE_CARDS[w].work}`, 'wide']), { multi: true })}`;
    const a2 = bindChips(box, 'adv', { multi: true, max: 2 });
    return {
      need: 'Chọn đủ 2 lời khuyên.',
      answer: () => (a2().length === 2 ? a2() : null),
      grade: (a) => C.gradeAdvice(K.advice, a),
    };
  }

  runSteps(api, root, C.STEP_ORDER, render, (results) => {
    const total = C.totalScore(results);
    const mastery = C.addMastery(api.state.mastery, results);
    const gained = S.recordCase(api.state, { kind: 'npc', slot, name: npc.call, total, mastery });
    api.after(gained, `giải án cho ${npc.call}`);
    if (total >= 0.9) buzz('heavy');
    root.innerHTML = `<div class="hq-result"><div class="hq-score ${total >= 0.75 ? 'good' : total >= 0.55 ? 'mid' : 'low'}"><b>${Math.round(total * 100)}</b><span>${C.gradeLabel(total)}</span></div>
      <p class="hq-quote">${esc(npc.call)}: “${total >= 0.75 ? 'Thầy luận rõ ràng quá, cảm ơn thầy!' : total >= 0.55 ? 'Cảm ơn, tôi hiểu thêm được nhiều.' : 'Cảm ơn, để tôi ngẫm thêm.'}”</p>
      <ul class="hq-plain">${C.STEP_ORDER.map((k) => `<li>${C.STEP_TITLE[k]}: ${Math.round(results[k].score * 100)}%</li>`).join('')}</ul>
      <p class="hq-sub">${gained ? `+${gained} ${TEXT.point}` : 'Án này đã tính điểm hôm nay — luyện tập thêm.'}</p>
      <div class="hq-actions">${FEATURES.ai ? '<button class="hq-btn hq-primary" data-role="master">🎙 Nghe Thầy luận án này</button>' : ''}<button class="hq-btn${FEATURES.ai ? '' : ' hq-primary'}" data-role="close">Về sân</button></div></div>`;
    root.querySelector('[data-role=close]').onclick = () => { api.panel.close(); onDone?.(); };
    const mb = root.querySelector('[data-role=master]');
    if (mb) mb.onclick = () => openMaster(api, { R: cs.R, who: npc.call, first: npc.question });
  });
  return root;
}

// Thầy luận bằng AI của app (tải lười — ai.js nặng)
export function openMaster(api, opts) {
  if (import.meta.env?.MODE === 'ios') return; // iOS không có Thầy AI — loại hẳn mã khỏi gói
  const box = el('<div class="hq-loadbox"><p class="hq-sub">Thầy đang lấy sách…</p></div>');
  api.panel.open({ title: `Thầy luận · ${opts.who}`, body: box });
  import('./master-ui.js').then((m) => { if (box.isConnected) box.replaceWith(m.masterChatBody(api, opts)); })
    .catch(() => { box.innerHTML = '<p>Chưa mời được thầy, thử lại sau nhé.</p>'; });
}

// ---------------------------------------------------------------------------
// Án Cổ — lá số kinh điển, 3 bước theo sách
// ---------------------------------------------------------------------------
export function classicalBody(api, id, onDone) {
  const A = C.buildClassical(id);
  const c = A.c;
  const head = `<p><b>${esc(c.person)}</b></p><p class="hq-sub">${esc(c.source)}</p>${pillarsHtml(A.pillars)}`;
  const root = shell(head, A.steps);
  function render(k, box) {
    if (k === 'strength') {
      box.innerHTML = `<p>Sách cổ luận thân chủ thế nào?</p>${chips('v', [['vuong', 'Thân vượng'], ['nhuoc', 'Thân nhược'], ['trung', 'Trung hoà'], ['tong', 'Cách đặc biệt (tòng / chuyên vượng)']])}`;
      const v = bindChips(box, 'v');
      return { answer: () => v()[0] || null, grade: (a) => C.gradeClassicalStrength(A.keys.strength, a) };
    }
    if (k === 'ge') {
      box.innerHTML = `<p>Lá số này thuộc <b>cách cục</b> nào?</p>${chips('g', A.keys.geOpts.map((g) => [g, `${C.GE_VI[g] || g} · ${g}`]))}`;
      const g = bindChips(box, 'g');
      return { answer: () => g()[0] || null, grade: (a) => C.gradeGe(A.keys.ge, a) };
    }
    box.innerHTML = `<p>Sách cổ chọn hành nào làm <b>Dụng thần</b>?</p>${wxChips('y')}`;
    const y = bindChips(box, 'y');
    return { answer: () => y()[0] || null, grade: (a) => C.gradeYong(A.keys.yong, a), reveal: () => `<p class="hq-cite">${esc(A.cite.all)}</p>` };
  }
  runSteps(api, root, A.steps, render, (results) => {
    const total = Object.values(results).reduce((s, r) => s + r.score, 0) / A.steps.length;
    const mastery = C.addMastery(api.state.mastery, results);
    const gained = S.recordCase(api.state, { kind: 'classical', id, name: c.person, total, mastery });
    api.after(gained, 'giải Án Cổ');
    root.innerHTML = `<div class="hq-result"><div class="hq-score ${total >= 0.75 ? 'good' : total >= 0.55 ? 'mid' : 'low'}"><b>${Math.round(total * 100)}</b><span>${C.gradeLabel(total)}</span></div>
      <p><b>Lời sách:</b> ${esc(c.known.verdict || '')}</p><p class="hq-cite">${esc(c.principle || '')}</p>
      <p class="hq-sub">${gained ? `+${gained} ${TEXT.point} · mở khoá trang kinh điển này` : 'Đạt từ 60% để nhận thưởng lần đầu.'}</p>
      <div class="hq-actions"><button class="hq-btn" data-role="list">← Danh sách Án Cổ</button><button class="hq-btn hq-primary" data-role="close">Về sân</button></div></div>`;
    root.querySelector('[data-role=close]').onclick = () => { api.panel.close(); onDone?.(); };
    root.querySelector('[data-role=list]').onclick = () => api.panel.open({ title: 'Án Cổ', body: classicalListBody(api) });
  });
  return root;
}

export function classicalListBody(api) {
  const best = api.state.classical || {};
  const list = C.classicalList();
  const done = list.filter((c) => (best[c.id] || 0) >= 0.6).length;
  const body = el(`<div><p class="hq-sub">${list.length} lá số kinh điển — đáp án lấy từ chính sách cổ. Đã qua ${done}/${list.length}.</p>
    <div class="hq-list">${list.map((c) => {
      const b = best[c.id];
      return `<button class="hq-btn hq-row" data-id="${esc(c.id)}">${b >= 0.6 ? '🏮' : '◌'} ${esc(c.person.slice(0, 48))}${b != null ? ` · ${Math.round(b * 100)}%` : ''}</button>`;
    }).join('')}</div></div>`);
  body.querySelectorAll('[data-id]').forEach((b) => { b.onclick = () => api.panel.open({ title: 'Án Cổ', body: classicalBody(api, b.dataset.id) }); });
  return body;
}

// Thẻ tiến bộ tu học (Sổ › Tu học)
export function masteryHtml(state) {
  const m = state.mastery || {};
  const keys = Object.keys(C.SKILL_VI);
  if (!keys.some((k) => m[k])) return '<p>Chưa giải án nào. Ra sân gặp khách đang chờ (dấu ❓) để bắt đầu.</p>';
  return `<div class="hq-bars">${keys.filter((k) => m[k]).map((k) => `<div class="hq-bar"><span>${C.SKILL_VI[k]}</span><i class="wx-tho" style="--v:${Math.round(m[k].avg * 100)}%"></i><b>${Math.round(m[k].avg * 100)}%</b></div>`).join('')}</div>
    <p class="hq-sub">Trung bình ${'khoảng 20 lần gần nhất'} mỗi kỹ năng.</p>`;
}

// ---------------------------------------------------------------------------
// Sảnh Trạch Nhật — khách cần chọn ngày (engine zheri của app), 3 bước
// ---------------------------------------------------------------------------
export async function zheriCaseBody(api, npcKey, onDone) {
  const Z = await import('./zheri-case.js');
  const cs = Z.buildZheriCase(npcKey);
  const { npc } = cs;
  const zv = ZHI[cs.zhi].vi;
  const head = `<div class="hq-npc"><span class="hq-npc-ava" style="--c:${ROBE[npc.robe]}">${npc.gender === 'nam' ? '👨' : '👩'}</span>
    <div><b>${esc(npc.call)}</b> · ${npc.age} tuổi · tuổi <b>${zv} (${cs.zhi})</b><br><span class="hq-sub">Việc: ${Z.JOB_VI[cs.job]} · sinh năm ${npc.year}</span></div></div>
    <p class="hq-quote">“${esc(npc.question)}”</p>`;
  const root = shell(head, Z.ZHERI_STEPS, Z.ZHERI_TITLE);
  const dayCards = (name, multi, extra = '') => chips(name, cs.days.map((d) => [d.ymd, `<b>${d.label}</b> · ${d.lunar}<br><span class="hq-sub">Ngày <b>${d.dayGanZhi}</b> ${charVi(d.dayGanZhi[0])} ${charVi(d.dayGanZhi[1])} · tháng ${d.monthZhi} ${charVi(d.monthZhi)}</span>`, 'wide']).concat(extra ? [['none', extra, 'wide']] : []), { multi });
  const officerRef = () => {
    const months = [...new Set(cs.days.map((d) => d.monthZhi))];
    return `<details class="hq-ref"><summary>📖 Bảng 12 trực (đếm từ chi tháng)</summary>
      <p>Ngày có chi trùng chi tháng = trực <b>Kiến</b>, đếm thuận theo vòng 12 chi: Kiến · Trừ · Mãn · Bình · Định · Chấp · Phá · Nguy · Thành · Thu · Khai · Bế.</p>
      <p>Cổ quyết: «Kiến Mãn Bình Thu hắc, Trừ Nguy Định Chấp hoàng, Thành Khai giai khả dụng, Phá Bế bất tương đương».</p>
      ${months.map((m) => `<p>Tháng ${m} ${charVi(m)}: ${Z.officerTable(m).map(([o, z]) => `${o}=${charVi(z)}`).join(' · ')}</p>`).join('')}
      <p>Lục xung: Tý–Ngọ · Sửu–Mùi · Dần–Thân · Mão–Dậu · Thìn–Tuất · Tỵ–Hợi.</p></details>`;
  };

  function render(k, box) {
    if (k === 'xung') {
      box.innerHTML = `<p>Khách tuổi <b>${zv}</b>. Ngày nào <b>xung tuổi</b> khách (chi ngày lục xung chi năm sinh)? Chọn tất cả, hoặc «không có».</p>
        ${dayCards('d', true, 'Không có ngày nào xung')}${officerRef()}`;
      const get = bindChips(box, 'd', { multi: true });
      return { need: 'Chọn ít nhất một ô.', answer: () => { const a = get(); return a.length ? a.filter((x) => x !== 'none') : null; }, grade: (a) => Z.gradeZheri(cs, 'xung', a) };
    }
    if (k === 'truc') {
      box.innerHTML = `<p>Ngày nào gặp trực <b>Hoàng đạo</b> (Trừ, Định, Chấp, Nguy, Thành, Khai)? Chọn tất cả, hoặc «không có».</p>
        ${dayCards('d', true, 'Không có ngày Hoàng đạo')}${officerRef()}`;
      const get = bindChips(box, 'd', { multi: true });
      return { need: 'Chọn ít nhất một ô.', answer: () => { const a = get(); return a.length ? a.filter((x) => x !== 'none') : null; }, grade: (a) => Z.gradeZheri(cs, 'truc', a) };
    }
    box.innerHTML = `<p>Chọn <b>một ngày</b> tốt nhất cho việc ${Z.JOB_VI[cs.job]} của ${esc(npc.call)}. Cân cả trực (hợp việc hay kỵ việc), xung/hại/hình/hợp tuổi.</p>
      ${dayCards('d', false)}${officerRef()}`;
    const get = bindChips(box, 'd');
    let last = null;
    return {
      need: 'Chọn một ngày.',
      answer: () => get()[0] || null,
      grade: (a) => (last = Z.gradeZheri(cs, 'pick', a)),
      reveal: () => (last?.reasons ? `<ul class="hq-plain">${last.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''),
    };
  }

  runSteps(api, root, Z.ZHERI_STEPS, render, (results) => {
    const total = Z.zheriTotal(results);
    const gained = S.recordCase(api.state, { kind: 'desk', id: 'trach', name: npc.call, total });
    api.after(gained, `chọn ngày cho ${npc.call}`);
    if (total >= 0.9) buzz('heavy');
    const best = cs.days.find((d) => cs.keys.best.includes(d.ymd));
    root.innerHTML = `<div class="hq-result"><div class="hq-score ${total >= 0.75 ? 'good' : total >= 0.55 ? 'mid' : 'low'}"><b>${Math.round(total * 100)}</b><span>${C.gradeLabel(total)}</span></div>
      <p class="hq-quote">${esc(npc.call)}: “${total >= 0.75 ? `Vậy tôi chốt ${best.label}. Cảm ơn thầy!` : 'Cảm ơn, để tôi xem lịch thêm.'}”</p>
      <ul class="hq-plain">${Z.ZHERI_STEPS.map((k) => `<li>${Z.ZHERI_TITLE[k]}: ${Math.round(results[k].score * 100)}%</li>`).join('')}</ul>
      <p class="hq-sub">Thông thạo Trạch Nhật: ${S.deskMastery(api.state, 'trach')}% · ${gained ? `+${gained} ${TEXT.point}` : 'Sảnh này đã tính điểm hôm nay — luyện tập thêm.'}</p>
      <div class="hq-actions">${FEATURES.ai ? '<button class="hq-btn hq-primary" data-role="master">🎙 Hỏi Thầy về ngày này</button>' : ''}<button class="hq-btn${FEATURES.ai ? '' : ' hq-primary'}" data-role="close">Xong</button></div></div>`;
    root.querySelector('[data-role=close]').onclick = () => { api.panel.close(); onDone?.(); };
    const mb = root.querySelector('[data-role=master]');
    if (mb) {
      mb.onclick = async () => {
        const { analyze } = await import('../engine/chart.js');
        const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, new Date().getFullYear());
        const list = cs.days.map((d) => `${d.ymd} (${d.dayGanZhi})`).join(', ');
        openMaster(api, { R, who: npc.call, first: `Tôi tuổi ${zv}, cần chọn ngày ${Z.JOB_VI[cs.job]} trong các ngày: ${list}. Thầy xem ngày nào hợp với lá số tôi nhất và vì sao?` });
      };
    }
  }, Z.ZHERI_TITLE);
  return root;
}

// ---------------------------------------------------------------------------
// Sảnh Dương Trạch — khách xem nhà (Bát Trạch + 24 sơn + phi tinh năm), 4 bước
// ---------------------------------------------------------------------------
const GRID9 = [['Tây Bắc', 'Bắc', 'Đông Bắc'], ['Tây', 'Trung cung', 'Đông'], ['Tây Nam', 'Nam', 'Đông Nam']];
const palaceGrid = (name, { center = false } = {}) => `<p class="hq-sub">Bắc ở trên (như la bàn treo tường).</p><div class="hq-chips-row hq-grid9" data-name="${name}">${GRID9.flat().map((p) =>
  ((p === 'Trung cung' && !center) ? '<span class="hq-g9-mid">☯</span>' : `<button type="button" class="hq-choice" data-v="${p}" aria-pressed="false">${p}</button>`)).join('')}</div>`;
const SHAN_VI = { 壬: 'Nhâm', 子: 'Tý', 癸: 'Quý', 丑: 'Sửu', 艮: 'Cấn', 寅: 'Dần', 甲: 'Giáp', 卯: 'Mão', 乙: 'Ất', 辰: 'Thìn', 巽: 'Tốn', 巳: 'Tỵ', 丙: 'Bính', 午: 'Ngọ', 丁: 'Đinh', 未: 'Mùi', 坤: 'Khôn', 申: 'Thân', 庚: 'Canh', 酉: 'Dậu', 辛: 'Tân', 戌: 'Tuất', 乾: 'Càn', 亥: 'Hợi' };
const REF_MENH = `<details class="hq-ref"><summary>📖 Cách tính mệnh quái (Bát Trạch Minh Kính)</summary>
  <p>Sinh trước 2000: cộng các chữ số năm sinh tới còn 1 chữ số = s. Nam: (11 − s) mod 9 · Nữ: (s + 4) mod 9.</p>
  <p>Sinh từ 2000: lấy 2 số cuối = n. Nam: (99 − n) mod 9 · Nữ: (n + 6) mod 9.</p>
  <p>Kết quả 0 → 9. Ra 5: nam lấy 2 (Khôn), nữ lấy 8 (Cấn).</p>
  <p>1 Khảm · 2 Khôn · 3 Chấn · 4 Tốn · 6 Càn · 7 Đoài · 8 Cấn · 9 Ly. Đông tứ mệnh: Khảm, Ly, Chấn, Tốn; Tây tứ mệnh: Càn, Khôn, Cấn, Đoài.</p></details>`;
const REF_SHAN = `<details class="hq-ref"><summary>📖 24 sơn (mỗi sơn 15°, bắt đầu Nhâm 337,5°)</summary>
  <p>Bắc: Nhâm 壬 337,5–352,5 · Tý 子 352,5–7,5 · Quý 癸 7,5–22,5</p><p>Đông Bắc: Sửu 丑 · Cấn 艮 · Dần 寅 (22,5–67,5)</p>
  <p>Đông: Giáp 甲 · Mão 卯 · Ất 乙 (67,5–112,5)</p><p>Đông Nam: Thìn 辰 · Tốn 巽 · Tỵ 巳 (112,5–157,5)</p>
  <p>Nam: Bính 丙 · Ngọ 午 · Đinh 丁 (157,5–202,5)</p><p>Tây Nam: Mùi 未 · Khôn 坤 · Thân 申 (202,5–247,5)</p>
  <p>Tây: Canh 庚 · Dậu 酉 · Tân 辛 (247,5–292,5)</p><p>Tây Bắc: Tuất 戌 · Càn 乾 · Hợi 亥 (292,5–337,5)</p></details>`;
const REF_NIEN = `<details class="hq-ref"><summary>📖 Phi tinh năm (Huyền Không)</summary>
  <p>Sao nhập trung cung năm Y = (1865 − Y) mod 9 (ra 0 → 9).</p>
  <p>Phi thuận theo Lạc Thư: Trung → Tây Bắc → Tây → Đông Bắc → Nam → Bắc → Tây Nam → Đông → Đông Nam, mỗi bước +1 (quá 9 về 1).</p>
  <p>Ngũ Hoàng (5) kỵ động thổ, sửa chữa; Nhị Hắc (2) kỵ ngủ, bệnh tật.</p></details>`;

export async function dzCaseBody(api, npcKey, onDone) {
  const D = await import('./dz-case.js');
  const cs = D.buildDzCase(npcKey);
  const { npc } = cs;
  const head = `<div class="hq-npc"><span class="hq-npc-ava" style="--c:${ROBE[npc.robe]}">${npc.gender === 'nam' ? '👨' : '👩'}</span>
    <div><b>${esc(npc.call)}</b> · ${npc.gender} · sinh năm <b>${npc.year}</b><br><span class="hq-sub">Cửa chính: <b>${cs.deg}°</b> (đo bằng la bàn, Bắc = 0°)</span></div></div>
    <p class="hq-quote">“${esc(npc.question)}”</p>`;
  const root = shell(head, D.DZ_STEPS, D.DZ_TITLE);

  function render(k, box) {
    if (k === 'menh') {
      box.innerHTML = `<p>${esc(npc.call)} (${npc.gender}, sinh ${npc.year}) thuộc mệnh quái nào?</p>
        ${chips('g', D.GUAS.map((g) => [g.han, `${g.han} ${g.vi}`]))}${REF_MENH}`;
      const get = bindChips(box, 'g');
      return { need: 'Chọn một quẻ.', answer: () => get()[0] || null, grade: (a) => D.gradeDz(cs, 'menh', a) };
    }
    if (k === 'cua') {
      box.innerHTML = `<p>Cửa chính <b>${cs.deg}°</b> nằm ở sơn nào?</p>${chips('s', cs.shanOpts.map((h) => [h, `${h} ${SHAN_VI[h]}`]))}
        <p>Với mệnh <b>${cs.zhai.guaName}</b>, hướng cửa này gặp sao Bát Trạch nào?</p>${chips('t', D.STARS.map((s) => [s, s]))}${REF_SHAN}`;
      const gs = bindChips(box, 's'), gt = bindChips(box, 't');
      return { need: 'Chọn cả sơn và sao.', answer: () => (gs()[0] && gt()[0] ? { shan: gs()[0], star: gt()[0] } : null), grade: (a) => D.gradeDz(cs, 'cua', a) };
    }
    if (k === 'giuong') {
      const ausp = Object.entries(cs.zhai.auspicious).map(([s, p]) => `${s.split(' (')[0]}: ${p}`).join(' · ');
      const inau = Object.entries(cs.zhai.inauspicious).map(([s, p]) => `${s.split(' (')[0]}: ${p}`).join(' · ');
      box.innerHTML = `<p>Kê <b>giường ngủ</b> của ${esc(npc.call)} ở cung nào là tốt nhất năm ${cs.year}? Cân sao Bát Trạch, sát phương năm và phi tinh năm.</p>
        ${palaceGrid('p')}
        <details class="hq-ref"><summary>📖 Bát Trạch mệnh ${cs.zhai.guaName}</summary><p>Cát: ${ausp}</p><p>Hung: ${inau}</p><p>Giường ưu tiên Thiên Y (sức khoẻ) hoặc Phục Vị (yên giấc).</p></details>${REF_NIEN}`;
      const get = bindChips(box, 'p');
      let last = null;
      return {
        need: 'Chọn một cung.', answer: () => get()[0] || null,
        grade: (a) => (last = D.gradeDz(cs, 'giuong', a)),
        reveal: () => (last?.reasons ? `<ul class="hq-plain">${last.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''),
      };
    }
    box.innerHTML = `<p>Năm ${cs.year}, <b>Ngũ Hoàng</b> (sao 5, kỵ động thổ) bay tới cung nào trong nhà?</p>${palaceGrid('p', { center: true })}${REF_NIEN}`;
    const get = bindChips(box, 'p');
    return { need: 'Chọn một cung.', answer: () => get()[0] || null, grade: (a) => D.gradeDz(cs, 'nien', a) };
  }

  runSteps(api, root, D.DZ_STEPS, render, (results) => {
    const total = D.dzTotal(results);
    const gained = S.recordCase(api.state, { kind: 'desk', id: 'duongtrach', name: npc.call, total });
    api.after(gained, `xem nhà cho ${npc.call}`);
    if (total >= 0.9) buzz('heavy');
    root.innerHTML = `<div class="hq-result"><div class="hq-score ${total >= 0.75 ? 'good' : total >= 0.55 ? 'mid' : 'low'}"><b>${Math.round(total * 100)}</b><span>${C.gradeLabel(total)}</span></div>
      <p class="hq-quote">${esc(npc.call)}: “${total >= 0.75 ? 'Rõ rồi, về tôi kê lại giường ngay. Cảm ơn thầy!' : 'Cảm ơn, để tôi xem lại nhà.'}”</p>
      <ul class="hq-plain">${D.DZ_STEPS.map((k) => `<li>${D.DZ_TITLE[k]}: ${Math.round(results[k].score * 100)}%</li>`).join('')}</ul>
      <p class="hq-sub">Thông thạo Dương Trạch: ${S.deskMastery(api.state, 'duongtrach')}% · ${gained ? `+${gained} ${TEXT.point}` : 'Sảnh này đã tính điểm hôm nay — luyện tập thêm.'}</p>
      <div class="hq-actions">${FEATURES.ai ? '<button class="hq-btn hq-primary" data-role="master">🎙 Hỏi Thầy về căn nhà này</button>' : ''}<button class="hq-btn${FEATURES.ai ? '' : ' hq-primary'}" data-role="close">Xong</button></div></div>`;
    root.querySelector('[data-role=close]').onclick = () => { api.panel.close(); onDone?.(); };
    const mb = root.querySelector('[data-role=master]');
    if (mb) mb.onclick = () => openMaster(api, { R: cs.R, who: npc.call, first: `Nhà tôi cửa chính hướng ${cs.deg}° (sơn ${cs.shan.han}, ${cs.shan.palace8}). Thầy xem cửa có hợp mệnh tôi không, nên kê giường, bàn làm việc, bếp ở đâu, và năm ${cs.year} cần tránh động gì?` });
  }, D.DZ_TITLE);
  return root;
}

// ---------------------------------------------------------------------------
// Sảnh nghề dạng khai báo (halls.js): Điều Hậu, Thư Viện, Hợp Hôn, Tử Vi, Tượng Pháp, Cách Cục
// ---------------------------------------------------------------------------
export const HALL_NAME = { dieuhau: 'Sảnh Điều Hậu', thuvien: 'Thư Lâu', hophon: 'Bàn Hợp Hôn', tuvi: 'Sảnh Tử Vi', tuongphap: 'Sảnh Tượng Pháp', cachcuc: 'Sảnh Cách Cục' };
const HALL_THANKS = { dieuhau: 'Giờ tôi mới hiểu vì sao mùa đông tôi hay mệt.', thuvien: '', hophon: 'Hai đứa về sẽ nói chuyện với nhau kỹ hơn.', tuvi: 'Lá số Tử Vi rõ ràng quá.', tuongphap: 'Giờ tôi biết mình nên làm gì rồi.', cachcuc: 'Cách cục rõ rồi, cảm ơn thầy.' };

export async function hallCaseBody(api, hallId, key, onDone) {
  const H = await import('./halls.js');
  const cs = H.HALL_BUILD[hallId](key);
  const titles = Object.fromEntries(cs.steps.map((s) => [s.key, s.title]));
  const npcHead = (n) => `<div class="hq-npc"><span class="hq-npc-ava" style="--c:${ROBE[n.robe]}">${n.gender === 'nam' ? '👨' : '👩'}</span>
    <div><b>${esc(n.call)}</b> · ${n.age} tuổi · ${n.gender}<br><span class="hq-sub">Sinh ${String(n.day).padStart(2, '0')}/${String(n.month).padStart(2, '0')}/${n.year} lúc ${String(n.hour).padStart(2, '0')}:${String(n.minute).padStart(2, '0')}</span></div></div>`;
  const head = cs.npc
    ? `${npcHead(cs.npc)}${cs.pillars ? pillarsHtml(cs.pillars) : ''}${cs.partner ? `${npcHead(cs.partner)}${pillarsHtml(cs.partnerPillars)}` : ''}<p class="hq-quote">${esc(cs.intro)}</p>`
    : `<p class="hq-quote">${esc(cs.intro)}</p>`;
  const root = shell(head, cs.steps.map((s) => s.key), titles);
  root.querySelectorAll('.hq-pillar').forEach((c) => c.classList.add('flip'));

  function render(k, box) {
    const st = cs.steps.find((s) => s.key === k);
    box.innerHTML = `<p>${st.prompt}</p>${chips('a', st.options.map(([v, lab]) => [v, esc(lab), st.options.some(([, l]) => l.length > 24) ? 'wide' : '']), { multi: st.kind === 'many' })}${st.kind === 'many' ? '<p class="hq-sub">Chọn được nhiều ô.</p>' : ''}`;
    const get = bindChips(box, 'a', { multi: st.kind === 'many' });
    return {
      need: 'Chọn đáp án trước đã.',
      answer: () => (st.kind === 'many' ? get() : (get()[0] ?? null)),
      grade: (a) => { const s = H.gradeStep(st, a); return { score: s, msg: st.explain }; },
    };
  }

  runSteps(api, root, cs.steps.map((s) => s.key), render, (results) => {
    const scores = Object.fromEntries(Object.entries(results).map(([k, r]) => [k, r.score]));
    const total = H.totalOf(cs, scores);
    const gained = S.recordCase(api.state, { kind: 'desk', id: hallId, name: cs.npc?.call || HALL_NAME[hallId], total });
    api.after(gained, HALL_NAME[hallId].toLowerCase());
    if (total >= 0.9) buzz('heavy');
    const who = cs.npc ? esc(cs.npc.call) : '';
    root.innerHTML = `<div class="hq-result"><div class="hq-score ${total >= 0.75 ? 'good' : total >= 0.55 ? 'mid' : 'low'}"><b>${Math.round(total * 100)}</b><span>${C.gradeLabel(total)}</span></div>
      ${who ? `<p class="hq-quote">${who}: “${total >= 0.75 ? HALL_THANKS[hallId] : 'Cảm ơn, để tôi ngẫm thêm.'}”</p>` : ''}
      <ul class="hq-plain">${cs.steps.map((s) => `<li>${esc(s.title)}: ${Math.round(scores[s.key] * 100)}%</li>`).join('')}</ul>
      <p class="hq-sub">Thông thạo ${HALL_NAME[hallId].replace(/^(Sảnh|Bàn) /, '')}: ${S.deskMastery(api.state, hallId)}% · ${gained ? `+${gained} ${TEXT.point}` : 'Sảnh này đã tính điểm hôm nay — luyện tập thêm.'}</p>
      ${hallId === 'hophon' ? '<p class="hq-sub">Cả quán hôm nay cùng một cặp — vào 💬 Giao lưu để bàn với người khác.</p>' : ''}
      <div class="hq-actions">${FEATURES.ai && cs.ask ? '<button class="hq-btn hq-primary" data-role="master">🎙 Hỏi Thầy về án này</button>' : ''}<button class="hq-btn${FEATURES.ai && cs.ask ? '' : ' hq-primary'}" data-role="close">Xong</button></div></div>`;
    root.querySelector('[data-role=close]').onclick = () => { api.panel.close(); onDone?.(); };
    const mb = root.querySelector('[data-role=master]');
    if (mb) mb.onclick = () => openMaster(api, { R: cs.R, who: cs.npc?.call, first: cs.ask });
  }, titles);
  return root;
}
