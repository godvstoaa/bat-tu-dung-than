// ============================================================================
//  GIAO DIỆN KINH TẾ PHẦN II — Kho · Ruộng · Bếp · Chợ · Tiệm · Hộ tịch · Thầy mệnh (P8–P13).
//  Mọi thao tác qua ec.call(op, args) (econ-client.js): máy chủ khi đang nối, sổ trên máy khi ngoại tuyến.
//  Việc cần đúng chỗ (mở từ quầy dịch vụ trong tiệm — `at`): chợ / Thương hội ở Dịch Trạm, thuê ruộng / mặt bằng / hộ tịch
//  ở Nha Môn Địa Ốc, bếp & bếp trưởng ở Tửu Lâu (hoặc bếp nhà mình), thầy mệnh lý ở Phong Thủy Đường, hầm băng ở nhà.
// ============================================================================
import { ITEMS, RECIPES, RECIPE_BY, CHEFS, CROPS, PLOT, VENUE_TIERS, REGIONS, REGION_IDS } from './econ-data.js';
import { fmt as fmtCoin } from './coins.js';
import * as LIFE from './life.js';
import * as CU from './cuisine.js';
import * as CV from './civil.js';
import * as DV from './divination.js';
import { catchIll } from './illness.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const pct = (f) => `${Math.round((f ?? 1) * 100)}%`;
const name = (id) => ITEMS[id]?.n || id;
const icon = (id) => ITEMS[id]?.i || '•';
const mins = (ms) => { const m = Math.max(0, Math.round(ms / 60000)); return m >= 120 ? `${Math.round(m / 60)} giờ` : `${m} phút`; };
const vnDay = () => new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
export const TABS = [['kho', '🎒 Kho'], ['ruong', '🌾 Ruộng'], ['bep', '🍳 Bếp'], ['cho', '🏪 Chợ'], ['tiem', '🏮 Tiệm'], ['hotich', '💍 Hộ tịch'], ['thay', '🔮 Thầy mệnh']];
/** quầy dịch vụ → thẻ mặc định */
export const TAB_OF_AT = { cho: 'cho', ruong: 'ruong', bep: 'bep', beptruong: 'bep', matbang: 'tiem', hotich: 'hotich', thaymenh: 'thay' };

export function econBody(api, ec, opt = {}) {
  const root = el('<div class="hq-econ"></div>');
  const at = opt.at || null;
  let tab = opt.tab || TAB_OF_AT[at] || 'kho', me = null, busy = false;
  const L = api.life();

  async function run(op, a, okMsg) {
    if (busy) return null; busy = true;
    try {
      const r = await ec.call(op, a);
      if (!r?.ok) { api.toast(r?.err === 'offline' ? 'Mất kết nối máy chủ.' : r?.err || 'Không làm được.'); return r; }
      if (r.purse != null && me) me.purse = r.purse;
      if (r.inv) me = { ...me, ...r };
      if (okMsg) api.toast(typeof okMsg === 'function' ? okMsg(r) : okMsg);
      return r;
    } finally { busy = false; }
  }
  async function load() { const r = await ec.call('me', {}); if (!r?.ok) { root.replaceChildren(el(`<div><p class="hq-note">Không mở được sổ kinh tế (${esc(r?.err || 'lỗi mạng')}).</p><div class="hq-actions"><button class="hq-btn" type="button">Thử lại</button></div></div>`)); root.querySelector('button').onclick = load; return; } if (r?.ok) { me = r; if (r.debt) { L.debt = (L.debt || 0) + Math.round(r.debt / 100); api.toast(`⚖ Tiệm bị niêm phong — phần âm ${fmtCoin(r.debt)} chuyển thành nợ cá nhân.`); api.save?.(); } } draw(); }

  function head() {
    const h = el(`<div class="hq-econ-head"><div class="hq-econ-tabs">${TABS.map(([id, t]) => `<button type="button" class="hq-econ-tab${id === tab ? ' on' : ''}" data-tab="${id}">${t}</button>`).join('')}</div>
      <p class="hq-life-van">Ví máy <b>${fmtCoin(L.xu)}</b> · Ví chợ <b>${fmtCoin(me?.purse || 0)}</b>${me?.held ? ` · két giữ ${fmtCoin(me.held)}` : ''} <small>(${ec.mode() === 'server' ? 'sổ máy chủ' : 'sổ trên máy — ngoại tuyến'})</small></p>
      <div class="hq-actions"><button class="hq-btn" type="button" data-dep>⬆ Gửi lên ví chợ</button><button class="hq-btn" type="button" data-wd>⬇ Rút về ví máy</button></div></div>`);
    h.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => { tab = b.dataset.tab; draw(); }; });
    h.querySelector('[data-dep]').onclick = async () => {
      const v = Math.floor(Number(prompt('Gửi bao nhiêu ĐỒNG từ ví máy lên ví chợ?', '50')) || 0); if (v <= 0) return;
      const xu = v * 100; if (L.xu < xu) { api.toast('Ví máy không đủ.'); return; }
      const r = await run('deposit', { xu }); if (r?.ok && !r.dup) { L.xu -= xu; api.save?.(); api.updateVitals?.(); api.toast(`⬆ Đã gửi ${v} đồng lên ví chợ.`); } draw();
    };
    h.querySelector('[data-wd]').onclick = async () => {
      const v = Math.floor(Number(prompt('Rút bao nhiêu ĐỒNG về ví máy?', String(Math.floor((me?.purse || 0) / 100)))) || 0); if (v <= 0) return;
      const r = await run('withdraw', { xu: v * 100 }); if (r?.ok && !r.dup) { L.xu += v * 100; api.save?.(); api.updateVitals?.(); api.toast(`⬇ Đã rút ${v} đồng về ví máy.`); } draw();
    };
    return h;
  }
  const need = (where, ok) => (ok ? '' : `<p class="hq-note">↪ Việc này làm tại ${where}.</p>`);

  // ---------------- KHO ----------------
  function kho() {
    const box = el('<div></div>'), home = !!api.atHome?.();
    const inv = me?.inv || [];
    box.append(el(`<h4>🎒 Túi đồ (${inv.length}/40 chồng)</h4>`));
    if (!inv.length) box.append(el('<p class="hq-note">Túi trống. Mua nguyên liệu ở Thương hội (Dịch Trạm), trồng trọt, đánh cá rồi nấu món.</p>'));
    const g = el('<div class="hq-yc-grid"></div>');
    for (const s of inv) {
      const d = ITEMS[s.id] || {}, dish = d.c === 'dish';
      const c = el(`<div class="hq-yc-card hq-inv"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b>
        <small>${d.d ? `tươi ${pct(s.fresh)}${s.cold ? ' · ❄' : ''}` : d.dur ? `độ bền ${s.dur}` : 'không hỏng'}${s.q != null ? ` · chất lượng ${pct(s.q)}` : ''}${s.by ? ' · 🔖 ấn ký' : ''}${dish ? ` · hạng ${d.tier}` : ''}</small>
        ${d.d ? `<i class="hq-fresh" style="--f:${pct(s.fresh)}"></i>` : ''}</span>
        <span class="hq-inv-act">${dish ? '<button class="hq-btn" data-eat type="button">Ăn</button>' : ''}${home && d.d ? '<button class="hq-btn" data-cold type="button">❄ Cất hầm</button>' : ''}${s.id === 'bang' && home ? '<button class="hq-btn" data-ice type="button">Nạp hầm</button>' : ''}${s.id === 'oi' ? '<button class="hq-btn" data-drop type="button">Bỏ</button>' : ''}</span></div>`);
      c.querySelector('[data-eat]')?.addEventListener('click', () => eat(s.i));
      c.querySelector('[data-cold]')?.addEventListener('click', async () => { await run('cellar_in', { i: s.i }, '❄ Đã cất vào hầm băng.'); draw(); });
      c.querySelector('[data-ice]')?.addEventListener('click', async () => { const n = Math.floor(Number(prompt('Nạp bao nhiêu khối băng vào hầm?', String(s.n))) || 0); if (n > 0) { await run('ice', { n }, (r) => `🧊 Hầm còn ${r.ice} khối băng.`); draw(); } });
      c.querySelector('[data-drop]')?.addEventListener('click', async () => { await run('drop', { i: s.i }, 'Đã bỏ đồ ôi.'); draw(); });
      g.append(c);
    }
    box.append(g);
    const cl = me?.cellar;
    box.append(el(`<h4>❄ Hầm băng ${home ? '' : '(chỉ mở khi ở nhà)'}</h4><p class="hq-note">Băng còn ${cl?.ice ?? 0} khối · mỗi chồng tiêu 1 khối / 12 giờ, giảm hỏng 80% (món cao lương 6 → 48 giờ). Hết băng thì đồ trong hầm hỏng như thường.</p>`));
    if (home && cl?.list?.length) {
      const g2 = el('<div class="hq-yc-grid"></div>');
      for (const s of cl.list) { const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b><small>tươi ${pct(s.fresh)}${s.cold ? ' · ❄' : ' · hết băng'}</small></span><button class="hq-btn" type="button">Lấy ra</button></div>`); c.querySelector('button').onclick = async () => { await run('cellar_out', { i: s.i }, 'Đã lấy ra túi.'); draw(); }; g2.append(c); }
      box.append(g2);
    }
    box.append(el(`<p class="hq-note">Độc tích ${Math.round(L.tox || 0)}/100 — đồ ăn hạng 1 (thô) cộng dần; trên 30 dễ ngộ độc. Ngày không ăn đồ thô −3, đủ 3 bữa bình dân −5.</p>`));
    return box;
  }
  async function eat(i) {
    const r = await run('eat', { i }); if (!r?.ok) return;
    L.full = Math.min(100, L.full + r.full); L.wake = Math.min(100, L.wake + r.wake); L.hp = Math.min(100, L.hp + r.hp);
    const p = CU.toxAfterMeal(L, r.tier, vnDay());
    if (r.buff) L.mealBuff = { mul: r.buff, until: Date.now() + 4 * 3600000 };
    let extra = '';
    if (r.poison || Math.random() < p) { catchIll(L, 'ngodoc', 0); extra = ' 🤢 Bụng quặn đau — ngộ độc!'; }
    api.save?.(); api.updateVitals?.();
    api.toast(`😋 ${r.name}: No +${r.full}${r.wake ? ` · Tỉnh +${r.wake}` : ''}${r.buff ? ` · «No khí» làm việc +${Math.round(r.buff * 100)}% trong 4 giờ` : ''}.${extra}`);
    draw();
  }

  // ---------------- RUỘNG ----------------
  function ruong() {
    const box = el('<div></div>'), here = at === 'ruong', now = Date.now();
    box.append(el(`<h4>🌾 Thửa ruộng & chuồng (${(me?.plots || []).filter((x) => x.until > now).length}/${PLOT.max})</h4><p class="hq-note">Thuê ở Nha Môn Địa Ốc ${PLOT.rentWeek} đồng / tuần. Cây lớn theo giờ thật (rau 8 · lúa 24 · bông 36 · chè 48 giờ; gà 24 · lợn 72 giờ · bò 7 ngày), tưới / cho ăn mỗi 12 giờ (lỡ −30%), đúng mùa +20%, bón phân +10%. Có tá điền trông hộ nên tưới, thu ở đâu cũng được.</p>`));
    if (here) { const a = el('<div class="hq-actions"><button class="hq-btn hq-primary" data-r="ruong" type="button">Thuê thửa ruộng</button><button class="hq-btn" data-r="chuong" type="button">Thuê chuồng</button></div>'); a.querySelectorAll('[data-r]').forEach((b) => { b.onclick = async () => { await run('plot_rent', { kind: b.dataset.r }, '📜 Đã ký khế thuê một tuần.'); draw(); }; }); box.append(a); }
    else box.append(el(need('Nha Môn Địa Ốc (quầy «Ruộng & chuồng») để thuê thêm', false)));
    const g = el('<div class="hq-yc-grid"></div>');
    for (const x of me?.plots || []) {
      const C = x.crop && CROPS[x.crop], ready = x.crop && now >= x.ready, gone = x.until <= now;
      const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${x.kind === 'chuong' ? '🐾 Chuồng' : '🟫 Thửa ruộng'} ${x.i + 1}${gone ? ' (hết hạn)' : ''}</b>
        <small>${C ? `${C.n} · ${ready ? '✅ thu được' : `còn ${mins(x.ready - now)}`} · ${now - x.water > PLOT.waterH * 3600000 ? '⚠ khô / đói' : `tưới ${mins(now - x.water)} trước`}${x.fert ? ' · đã bón' : ''} · sản lượng ×${x.mul}` : 'đang trống'} · hạn thuê ${mins(x.until - now)}</small></span>
        <span class="hq-inv-act"></span></div>`);
      const act = c.querySelector('.hq-inv-act');
      const btn = (t, f) => { const b = el(`<button class="hq-btn" type="button">${t}</button>`); b.onclick = f; act.append(b); };
      if (!gone && !C) for (const [id, K] of Object.entries(CROPS)) if (K.kind === x.kind) btn(`${K.n}`, async () => { await run('plant', { i: x.i, crop: id }, `🌱 Đã ${x.kind === 'chuong' ? 'thả' : 'gieo'} ${K.n}.`); draw(); });
      if (C && !ready) btn(x.kind === 'chuong' ? 'Cho ăn' : 'Tưới', async () => { await run('water', { i: x.i }, (r) => (r.dry ? 'Đã tưới — nhưng lỡ hạn nên vụ này hụt 30%.' : '💧 Đã tưới.')); draw(); });
      if (C && !ready && x.kind === 'ruong' && !x.fert) btn('Bón phân', async () => { await run('fert', { i: x.i }, 'Đã bón phân (+10%).'); draw(); });
      if (ready) btn('Thu hoạch', async () => { await run('harvest', { i: x.i }, (r) => `🧺 Thu: ${Object.entries(r.got).map(([k, n]) => `${n} ${name(k)}`).join(', ')}.`); draw(); });
      if (here) btn('Gia hạn', async () => { await run('plot_extend', { i: x.i }, 'Gia hạn thêm một tuần.'); draw(); });
      g.append(c);
    }
    box.append(g);
    const proc = at === 'ruong' || at === 'cho';
    const p = el(`<div><h4>🔪 Lò mổ · ⚙ xay xát · 🪣 ủ phân</h4>${need('Dịch Trạm hoặc Nha Môn Địa Ốc', proc)}<div class="hq-actions"></div></div>`);
    const pa = p.querySelector('.hq-actions');
    const live = (me?.inv || []).filter((s) => ITEMS[s.id]?.c === 'live');
    if (proc) {
      for (const s of live) { const b = el(`<button class="hq-btn" type="button">Xẻ 1 ${esc(name(s.id))} (cần dao mổ)</button>`); b.onclick = async () => { await run('butcher', { i: s.i }, (r) => `🔪 Được ${Object.entries(r.got).map(([k, n]) => `${n} ${name(k)}`).join(', ')}.`); draw(); }; pa.append(b); }
      const m = el('<button class="hq-btn" type="button">Xay lúa → gạo (2:1, 1 đồng / lượt)</button>'); m.onclick = async () => { const t = Math.floor(Number(prompt('Xay mấy lượt?', '5')) || 0); if (t > 0) { await run('mill', { times: t }, (r) => `⚙ Được ${r.got.gao} gạo.`); draw(); } }; pa.append(m);
    }
    const cpb = el('<button class="hq-btn" type="button">Ủ đồ ôi thành phân bón</button>'); cpb.onclick = async () => { await run('compost', {}, (r) => `Ủ được ${r.got.phan} phân bón.`); draw(); }; pa.append(cpb);
    box.append(p);
    // ngư phủ
    const near = !!api.nearWater?.();
    const f = el(`<div><h4>🎣 Thả lưới</h4><p class="hq-note">Đứng sát mép sông / hồ. Trữ lượng cá của khúc sông có hạn, hồi 10% mỗi giờ.</p><div class="hq-actions"><button class="hq-btn" type="button" ${near ? '' : 'disabled'}>${near ? 'Thả lưới' : 'Ra mép nước để thả lưới'}</button></div></div>`);
    f.querySelector('button').onclick = async () => {
      const g2 = await import('./work-games.js');
      const sc = await g2.play('ore', Math.floor(Math.random() * 1e9), { root: document.querySelector('.hq-root') || document.body, title: '🎣 Thả lưới', hint: 'Thả lưới khi phao rơi vào vạch vàng (luồng cá). 3 lần kéo.', button: 'Kéo lưới' });
      if (sc == null) return;
      await run('fish', { score: sc }, (r) => `🐟 Được ${Object.entries(r.got).map(([k, n]) => `${n} ${name(k)}`).join(', ')} (khúc sông còn ~${Math.floor(r.wild?.stock ?? 0)} con).`); draw();
    };
    box.append(f);
    return box;
  }

  // ---------------- BẾP ----------------
  function bep() {
    const box = el('<div></div>'), here = at === 'bep' || at === 'beptruong' || !!api.atHome?.();
    box.append(el(`<h4>🍳 Bếp · Thực căn ${pct(me?.tc)}${(me?.tc || 0) >= 0.6 ? ' (hợp cách đầu bếp)' : ''} · tay nghề bếp ${Math.floor(me?.cookXp || 0)}</h4>
      <p class="hq-note">Chất lượng = 35% điểm canh lửa + 25% độ tươi nguyên liệu + 20% tay nghề + 20% Thực căn. Món cao lương dưới 40% là hỏng mất trắng. Món bí truyền có ấn ký +30% giá trị.</p>${need('bếp Tửu Lâu (quầy «Bếp thuê») hoặc bếp nhà mình', here)}`));
    const g = el('<div class="hq-yc-grid"></div>');
    for (const r of RECIPES) {
      const own = CU.canCook({ recipes: me?.recipes || [] }, r); if (r.secret && !own) continue;
      const have = Object.entries(r.ing).every(([id, n]) => (me?.inv || []).filter((s) => s.id === id && (s.fresh ?? 1) > 0.01).reduce((a, s) => a + s.n, 0) >= n);
      const c = el(`<button class="hq-yc-card" type="button" ${here && have ? '' : 'disabled'}><span class="hq-food-t"><b>${r.i} ${esc(r.n)}${r.secret ? ' 🔖' : ''}</b><small>hạng ${r.tier}${r.region ? ` · ${esc(REGIONS[r.region].name)}` : ''} · ${Object.entries(r.ing).map(([id, n]) => `${n} ${esc(name(id))}`).join(', ')} → ${r.out} suất</small></span><span class="hq-price">${have ? 'Nấu' : 'thiếu đồ'}</span></button>`);
      c.onclick = () => cook(r.id);
      g.append(c);
    }
    box.append(g);
    // bếp trưởng
    const cb = el(`<div><h4>👨‍🍳 Bếp trưởng</h4>${need('Tửu Lâu (quầy «Bếp trưởng»)', at === 'beptruong')}</div>`);
    for (const [id, C] of Object.entries(CHEFS)) {
      const s = me?.chefs?.[id] || { aff: 0, trials: [], disciple: false };
      const row = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${esc(C.name)} · ${esc(C.where)}</b><small>${esc(C.bio)}</small><small>Thiện cảm ${s.aff}/100 · thử thách ${s.trials.length}/3 (${C.trials.map((t) => `${s.trials.includes(t) ? '✅' : '◻'} ${esc(name(t))}`).join(' · ')})${s.disciple ? ' · <b>đồ đệ</b>' : ''}</small></span><span class="hq-inv-act"></span></div>`);
      const act = row.querySelector('.hq-inv-act');
      if (at === 'beptruong') {
        const g1 = el('<button class="hq-btn" type="button">Thưa chuyện</button>'); g1.onclick = async () => { await run('chef_greet', { chef: id }, (r) => `${C.name} gật gù (thiện cảm ${r.chefs?.[id]?.aff ?? ''}).`); draw(); }; act.append(g1);
        if (!s.disciple) { const g2 = el('<button class="hq-btn hq-primary" type="button">Xin làm đồ đệ</button>'); g2.onclick = async () => { await run('chef_join', { chef: id }, `🙇 ${C.name} nhận bạn làm đồ đệ — công thức bí truyền mở dần theo tay nghề bếp (100 / 400 / 1200).`); draw(); }; act.append(g2); }
      }
      cb.append(row);
    }
    box.append(cb);
    return box;
  }
  async function cook(id) {
    const r = RECIPE_BY[id], games = await import('./work-games.js');
    const sc = await games.play('fire', Math.floor(Math.random() * 1e9), { root: document.querySelector('.hq-root') || document.body, title: `${r.i} Nấu ${r.n}`, items: [r.n, r.n, r.n], hint: 'Giữ để quạt lửa, buông để lửa hạ. Giữ kim nhiệt trong vùng xanh — lửa đều thì món ngon.' });
    if (sc == null) return;
    const res = await run('cook', { id, score: sc });
    if (res?.ok) {
      api.toast(res.failed ? `🔥 Món cao lương hỏng (chất lượng ${pct(res.qual)}) — mất trắng nguyên liệu.` : `🍲 Nấu xong ${res.n} suất ${r.n} · chất lượng ${pct(res.qual)} · nguyên liệu tươi ${pct(res.fresh)}.`);
      for (const t of res.trial || []) api.toast(`✨ ${t.name}: «Món ${name(t.dish)} này đạt!» (thử thách ${t.done}/3)`);
    }
    draw();
  }

  // ---------------- CHỢ ----------------
  function cho() {
    const box = el('<div></div>'), here = at === 'cho';
    box.append(el(`<h4>🏪 Chợ ký gửi · Thương hội Huyền Thành</h4><p class="hq-note">Ký gửi: tự đặt giá, phí 3% khi bán + 1 đồng / chồng / ngày nằm kho chợ, tin hết hạn sau 7 ngày. Giá ngoài biên độ 30%–300% giá tham chiếu vẫn bán nhưng tiền vào két 24 giờ. Thương hội chỉ là mồi khởi động: bán nguyên liệu đắt hơn 40%, thu thành phẩm rẻ hơn 40%, hạn mức theo ngày — buôn với người chơi luôn lợi hơn.</p>${need('Dịch Trạm (quầy «Chợ ký gửi»)', here)}`));
    if (!here) return box;
    const th = el('<div><h4>🏛 Thương hội</h4><div class="hq-econ-th">Đang tải…</div></div>'), mk = el('<div><h4>📜 Tin ký gửi</h4><div class="hq-econ-mk">Đang tải…</div></div>');
    box.append(th, mk);
    ec.call('th_board', {}).then((r) => {
      const t = th.querySelector('.hq-econ-th'); if (!r?.ok) { t.textContent = r?.err || '—'; return; }
      t.innerHTML = `<p class="hq-note">Hạn mức thu mua hôm nay: còn ${fmtCoin(Math.max(0, r.quota - r.used))} (người hoạt động 24 giờ qua: ${r.active}).</p><div class="hq-yc-grid" data-sell></div><h4>Bán thành phẩm cho Thương hội</h4><div class="hq-yc-grid" data-buy></div>`;
      for (const s of r.sell) { const b = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))}</b></span><span class="hq-price">${fmtCoin(s.price)}</span></button>`); b.onclick = async () => { const n = Math.floor(Number(prompt(`Mua bao nhiêu ${name(s.id)}? (${fmtCoin(s.price)} / cái)`, '1')) || 0); if (n > 0) { await run('th_buy', { id: s.id, n }, `🛍 Đã mua ${n} ${name(s.id)}.`); draw(); } }; t.querySelector('[data-sell]').append(b); }
      for (const s of (me?.inv || []).filter((x) => r.buy.some((b) => b.id === x.id))) { const pr = r.buy.find((b) => b.id === s.id).price; const b = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b><small>tươi ${pct(s.fresh)}</small></span><span class="hq-price">~${fmtCoin(pr)}</span></button>`); b.onclick = async () => { const n = Math.floor(Number(prompt(`Bán bao nhiêu? (có ${s.n})`, String(s.n))) || 0); if (n > 0) { await run('th_sell', { i: s.i, n }, (x) => `💰 Thương hội trả ${fmtCoin(x.got)} vào ví chợ.`); draw(); } }; t.querySelector('[data-buy]').append(b); }
    });
    ec.call('mk_board', {}).then((r) => {
      const t = mk.querySelector('.hq-econ-mk'); if (!r?.ok) { t.textContent = r?.err || '—'; return; }
      t.innerHTML = '<div class="hq-yc-grid" data-list></div><h4>Ký gửi đồ của bạn</h4><div class="hq-yc-grid" data-post></div>';
      if (!r.list.length) t.querySelector('[data-list]').append(el('<p class="hq-note">Chưa có tin nào.</p>'));
      for (const l of r.list) {
        const ref = r.refs[l.item];
        const b = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${icon(l.item)} ${esc(name(l.item))} × ${l.n}${l.seal ? ' 🔖' : ''}</b><small>${esc(l.name || '')} · tươi ${pct(l.fresh)}${l.q != null ? ` · chất lượng ${pct(l.q)}` : ''} · tham chiếu ${fmtCoin(ref)}</small></span><span class="hq-inv-act"><span class="hq-price">${fmtCoin(l.price)}</span><button class="hq-btn" type="button">${l.mine ? 'Rút tin' : 'Mua'}</button></span></div>`);
        b.querySelector('button').onclick = async () => {
          if (l.mine) { await run('mk_cancel', { id: l.id }, 'Đã rút tin, hàng về túi (trừ phí kho).'); draw(); return; }
          const n = Math.floor(Number(prompt(`Mua bao nhiêu? (còn ${l.n})`, '1')) || 0); if (n > 0) { await run('mk_buy', { id: l.id, n }, (x) => `🛍 Đã mua${x.hold ? ' (giá ngoài biên độ — tiền người bán vào két 24 giờ)' : ''}.`); draw(); }
        };
        t.querySelector('[data-list]').append(b);
      }
      for (const s of (me?.inv || []).filter((x) => ITEMS[x.id]?.c !== 'waste')) {
        const b = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b><small>${ITEMS[s.id]?.d ? `tươi ${pct(s.fresh)}` : ''}</small></span><span class="hq-price">Ký gửi</span></button>`);
        b.onclick = async () => { const n = Math.floor(Number(prompt(`Ký gửi bao nhiêu? (có ${s.n})`, String(s.n))) || 0); if (n <= 0) return; const p = Math.round(Number(prompt('Giá mỗi cái (đồng)?', String(ITEMS[s.id].b))) * 100); if (p > 0) { await run('mk_post', { i: s.i, n, price: p }, '📜 Đã đăng tin ký gửi.'); draw(); } };
        t.querySelector('[data-post]').append(b);
      }
    });
    // ăn ở tiệm của người chơi khác
    const vl = el('<div><h4>🏮 Quán của người chơi</h4><div class="hq-econ-vl">Đang tải…</div></div>'); box.append(vl);
    ec.call('vn_list', {}).then((r) => {
      const t = vl.querySelector('.hq-econ-vl'); if (!r?.ok) { t.textContent = '—'; return; }
      const open = r.list.filter((v) => v.open && !v.mine); if (!open.length) { t.textContent = 'Chưa có quán nào mở cửa.'; return; }
      t.innerHTML = '';
      for (const v of open) for (const [id, pr] of Object.entries(v.menu || {})) { const b = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${icon(id)} ${esc(name(id))}</b><small>${esc(v.name)} · ${esc(REGIONS[v.region].name)} · danh tiếng ${v.rep}</small></span><span class="hq-price">${fmtCoin(pr)}</span></button>`); b.onclick = async () => { await run('vn_buy', { vid: v.id, id, n: 1 }, `🥡 Mua 1 suất ${name(id)} mang về túi.`); draw(); }; t.append(b); }
    });
    return box;
  }

  // ---------------- TIỆM ----------------
  function tiem() {
    const box = el('<div></div>'), v = me?.venue;
    if (!v) {
      box.append(el(`<h4>🏮 Mở quán</h4><p class="hq-note">Ví tiệm tách khỏi ví chủ. Định phí trừ lúc giờ Tý dù có bán được hay không; ví tiệm âm 3 ngày liền thì Nha Môn niêm phong, phần âm thành nợ của chủ. Khách NPC chỉ mua món đã nấu, giá trên 150% giá trị thì không vào.</p>${need('Nha Môn Địa Ốc (quầy «Mặt bằng»)', at === 'matbang')}`));
      if (at === 'matbang') {
        const f = el(`<div class="hq-yc-grid">${Object.entries(VENUE_TIERS).map(([id, T]) => `<div class="hq-yc-card"><span class="hq-food-t"><b>${esc(T.name)}</b><small>thuê ${T.rent} · giấy phép ${T.license} · định phí ${T.fixed} đồng / ngày${T.deposit ? ` · cọc ${T.deposit} ngày` : ''} · tối đa ${T.cap} khách / ngày · món hạng ${T.tiers.join(', ')} · ${T.slots} chỗ toàn thành</small></span><span class="hq-inv-act"><select class="hq-input" data-reg="${id}">${REGION_IDS.filter((r) => (id === 'fine' ? r === 'noido' : id === 'diner' ? r !== 'noido' : true)).map((r) => `<option value="${r}">${esc(REGIONS[r].name)}</option>`).join('')}</select><button class="hq-btn hq-primary" data-t="${id}" type="button">Thuê</button></span></div>`).join('')}</div>`);
        f.querySelectorAll('[data-t]').forEach((b) => { b.onclick = async () => { const nm = prompt('Đặt tên quán:', 'Quán Huyền Vị') || ''; await run('vn_rent', { tier: b.dataset.t, region: f.querySelector(`[data-reg="${b.dataset.t}"]`).value, name: nm }, '🏮 Đã thuê mặt bằng — bày món, đặt giá rồi mở cửa.'); load(); }; });
        box.append(f);
      }
      return box;
    }
    box.append(el(`<h4>🏮 ${esc(v.name)} · ${esc(VENUE_TIERS[v.tier].name)} · ${esc(REGIONS[v.region].name)}</h4>
      <p class="hq-life-van">Ví tiệm <b>${fmtCoin(v.bal)}</b> · danh tiếng ${v.rep}/100 · ${v.open ? '🟢 đang mở' : '🔴 đóng cửa'}${v.neg ? ` · ⚠ âm ${v.neg} ngày` : ''}</p>
      <div class="hq-actions"><button class="hq-btn hq-primary" data-open type="button">${v.open ? 'Đóng cửa' : 'Mở cửa'}</button><button class="hq-btn" data-fund type="button">Góp vốn</button><button class="hq-btn" data-take type="button">Rút lãi</button><button class="hq-btn" data-close type="button">Trả mặt bằng</button></div>`));
    box.querySelector('[data-open]').onclick = async () => { await run('vn_open', { on: !v.open }, v.open ? 'Đã đóng cửa (chỉ trừ thuê + giấy phép).' : 'Mở cửa đón khách.'); load(); };
    box.querySelector('[data-fund]').onclick = async () => { const d = Math.floor(Number(prompt('Góp bao nhiêu đồng từ ví chợ vào ví tiệm?', '200')) || 0); if (d > 0) { await run('vn_fund', { xu: d * 100 }, 'Đã góp vốn.'); load(); } };
    box.querySelector('[data-take]').onclick = async () => { const d = Math.floor(Number(prompt('Rút bao nhiêu đồng về ví chợ?', String(Math.max(0, Math.floor(v.bal / 100))))) || 0); if (d > 0) { await run('vn_take', { xu: d * 100 }, 'Đã rút lãi.'); load(); } };
    box.querySelector('[data-close]').onclick = async () => { if (!confirm('Trả mặt bằng? Hàng về túi; ví tiệm dương về ví chợ, âm thành nợ.')) return; await run('vn_close', {}, 'Đã trả mặt bằng.'); load(); };
    const st = el('<div><h4>Kho tiệm & thực đơn</h4><div class="hq-yc-grid"></div></div>'), sg = st.querySelector('.hq-yc-grid');
    for (const s of v.stock) { const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b><small>tươi ${pct(s.fresh)} · chất lượng ${pct(s.q)}</small></span><span class="hq-inv-act"><span class="hq-price">${fmtCoin(v.menu[s.id] || 0)}</span><button class="hq-btn" data-p type="button">Giá</button><button class="hq-btn" data-u type="button">Cất về</button></span></div>`); c.querySelector('[data-p]').onclick = async () => { const p = Math.round(Number(prompt(`Giá bán ${name(s.id)} (đồng / suất)?`, String((v.menu[s.id] || 0) / 100))) * 100); if (p >= 0) { await run('vn_menu', { id: s.id, price: p }, 'Đã đặt giá.'); load(); } }; c.querySelector('[data-u]').onclick = async () => { await run('vn_unstock', { i: s.i }, 'Đã cất về túi.'); load(); }; sg.append(c); }
    for (const s of (me?.inv || []).filter((x) => ITEMS[x.id]?.c === 'dish')) { const c = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${icon(s.id)} ${esc(name(s.id))} × ${s.n}</b><small>trong túi · tươi ${pct(s.fresh)}</small></span><span class="hq-price">Bày bán</span></button>`); c.onclick = async () => { const n = Math.floor(Number(prompt(`Bày bao nhiêu suất? (có ${s.n})`, String(s.n))) || 0); if (n > 0) { await run('vn_stock', { i: s.i, n }, 'Đã bày lên quầy.'); load(); } }; sg.append(c); }
    box.append(st);
    if (v.log?.length) box.append(el(`<div><h4>📒 Sổ lãi lỗ</h4><table class="hq-econ-log"><tr><th>Ngày</th><th>Khách</th><th>Doanh thu</th><th>Chi phí</th><th>Lãi ròng</th><th>Ví tiệm</th></tr>${v.log.slice().reverse().map((x) => `<tr><td>${x.day.slice(5)}</td><td>${x.cust}</td><td>${fmtCoin(x.rev)}</td><td>${fmtCoin(x.cost)}</td><td>${fmtCoin(x.net)}</td><td>${fmtCoin(x.bal)}${x.sealed ? ' 🔒' : ''}</td></tr>`).join('')}</table></div>`));
    return box;
  }

  // ---------------- HỘ TỊCH ----------------
  function hotich() {
    const box = el('<div></div>'), here = at === 'hotich', m = me?.marriage;
    box.append(el(`<h4>💍 Hộ tịch</h4><p class="hq-note">Một vợ một chồng, chỉ tài khoản đăng nhập. Không mừng tiền cưới. Quỹ chung ghi tên người góp — ly hôn chia theo tỉ lệ góp. Ly hôn xong chờ 30 ngày mới cưới lại; tối đa 3 lần / năm.</p>${need('Nha Môn Địa Ốc (quầy «Hộ tịch»)', here)}`));
    if (m) {
      const T = CV.TIERS[m.tier];
      box.append(el(`<div class="hq-yc-card"><span class="hq-food-t"><b>${m.title ? '💞 Phu thê' : '💑 Đã kết hôn'} với ${esc(m.otherName || 'người ấy')}</b><small>Lễ ${esc(T.name)} · từ ${new Date(m.since).toLocaleDateString('vi-VN')}${m.buffUntil > Date.now() ? ' · 🌸 Hỷ khí còn hiệu lực' : ''} · ${m.status === 'DIVORCING' ? `⚖ đang ly hôn (${m.div?.mutual ? 'thuận tình' : 'đơn phương'}) — xong lúc ${new Date(m.div.until).toLocaleString('vi-VN')}` : 'hôn thú hiệu lực'}</small>${T.fund ? `<small>Quỹ chung ${fmtCoin(m.fund)} · phần bạn góp ${fmtCoin(m.mine)}</small>` : ''}</span></div>`));
      const a = el('<div class="hq-actions"></div>');
      const btn = (t, f) => { const b = el(`<button class="hq-btn" type="button">${t}</button>`); b.onclick = f; a.append(b); };
      if (T.fund && m.status === 'REGISTERED') { btn('Góp quỹ chung', async () => { const d = Math.floor(Number(prompt('Góp bao nhiêu đồng (từ ví chợ)?', '100')) || 0); if (d > 0) { await run('cv_fund', { xu: d * 100 }, 'Đã góp quỹ chung.'); load(); } }); btn('Rút quỹ chung', async () => { const d = Math.floor(Number(prompt('Rút bao nhiêu đồng?', '50')) || 0); if (d > 0) { await run('cv_take', { xu: d * 100 }, 'Đã rút (trừ theo tỉ lệ góp).'); load(); } }); }
      if (here && m.status === 'REGISTERED') { btn('Đồng ý thuận tình ly hôn', async () => { await run('cv_agree', {}, 'Đã ghi ý thuận tình — người kia nộp đơn sẽ tính thuận tình (72 giờ).'); }); btn('Nộp đơn ly hôn', async () => { if (!confirm('Nộp đơn ly hôn? Thuận tình 2% quỹ (≥ 200 đồng), chờ 72 giờ; đơn phương 4% (≥ 400 đồng), chờ 7 ngày.')) return; await run('cv_divorce', {}, (r) => `⚖ Đã nộp đơn (${r.mutual ? 'thuận tình' : 'đơn phương'}) — án phí ${fmtCoin(r.fee)}.`); load(); }); }
      if (here && m.status === 'DIVORCING') btn('Rút đơn', async () => { await run('cv_withdraw', {}, 'Đã rút đơn ly hôn.'); load(); });
      box.append(a);
      ec.call('cv_view', {}).then((r) => { if (r?.dissolved != null) { api.toast(`⚖ Ly hôn đã xong — phần quỹ chung về bạn: ${fmtCoin(r.dissolved)}.`); load(); } });
    } else {
      for (const pr of me?.props || []) {
        const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>💌 ${esc(pr.name)} cầu hôn</b><small>«${esc(pr.phrase)}» · lễ ${esc(CV.TIERS[pr.tier].name)} (${CV.cost(pr.tier)} đồng — người cầu hôn trả trước)</small></span><span class="hq-inv-act"><button class="hq-btn hq-primary" data-y type="button">Nhận lời</button><button class="hq-btn" data-n type="button">Từ chối</button></span></div>`);
        c.querySelector('[data-y]').onclick = async () => { const r = await run('cv_answer', { from: pr.from, yes: true }); if (r?.ok) { api.toast(`💍 Thành thân với ${pr.name}! Lễ ${CV.TIERS[pr.tier].name}.`); load(); } };
        c.querySelector('[data-n]').onclick = async () => { await run('cv_answer', { from: pr.from, yes: false }, 'Đã khéo từ chối.'); load(); };
        box.append(c);
      }
      if (here) {
        const near = api.nearbyPlayers?.() || [];
        const f = el(`<div><h4>Cầu hôn</h4>${near.length ? '' : '<p class="hq-note">Không có người chơi nào đứng gần (trong 8 m).</p>'}<div class="hq-yc-grid">${Object.entries(CV.TIERS).map(([id, T]) => `<label class="hq-yc-card"><input type="radio" name="cvt" value="${id}" ${id === 'hanvi' ? 'checked' : ''}> <span class="hq-food-t"><b>${esc(T.name)} · ${CV.cost(id)} đồng${T.assetPct ? ' + 0,5% tài sản' : ''}</b><small>${esc(T.text)}</small></span></label>`).join('')}</div>
          <select class="hq-input" data-ph>${CV.PHRASES.map((p, i) => `<option value="${i}">${esc(p)}</option>`).join('')}</select><div class="hq-actions" data-who></div></div>`);
        for (const o of near) { const b = el(`<button class="hq-btn hq-primary" type="button">💌 Cầu hôn ${esc(o.name)}</button>`); b.onclick = async () => { await run('cv_propose', { to: o.u, phrase: Number(f.querySelector('[data-ph]').value), tier: f.querySelector('input[name=cvt]:checked').value }, `💌 Đã gửi lời cầu hôn tới ${o.name} — chờ người ấy nhận lời ở quầy Hộ tịch.`); }; f.querySelector('[data-who]').append(b); }
        box.append(f);
        box.append(el(`<p class="hq-note">Bà mai: ${esc(CV.funMatch(api.yong?.(), near[0]?.yong || null))}</p>`));
      }
    }
    return box;
  }

  // ---------------- THẦY MỆNH LÝ ----------------
  function thay() {
    const box = el('<div></div>'), here = at === 'thaymenh';
    box.append(el(`<h4>🔮 Thầy mệnh lý</h4><p class="hq-note">Khách chia sẻ hồ sơ rút gọn + tứ trụ (KHÔNG có ngày giờ sinh dạng lịch; từ tứ trụ có thể đoán gần đúng ngày sinh; hồ sơ xoá sau 30 ngày). Tiền vào két, thầy luận trong 24 giờ. Trọng tài: kiểm tất định (độ dài, chép văn, đúng Dụng thần, câu thao túng, lời khuyên đời thực) → AI thẩm định → admin. Một khách – một thầy – một lượt / 7 ngày. Thuế dịch vụ 15–20%. Lời luận là yếu tố trò chơi.</p>${need('Phong Thủy Đường (quầy «Thầy mệnh lý»)', here)}`));
    if (!here) return box;
    const area = el('<div>Đang tải…</div>'); box.append(area);
    Promise.all([ec.call('dv_list', {}), ec.call('dv_mine', {})]).then(([ls, mine]) => {
      area.innerHTML = '';
      // khách
      const lg = el('<div><h4>Mời thầy xem</h4><div class="hq-yc-grid"></div></div>');
      for (const d of (ls?.list || []).filter((x) => !x.me)) {
        const b = el(`<button class="hq-yc-card" type="button"><span class="hq-food-t"><b>${esc(d.name)}</b><small>${esc(d.rank)} · uy tín ${d.rep}</small></span><span class="hq-price">${d.fee} đồng</span></button>`);
        b.onclick = async () => {
          if (!confirm('Thầy và trọng tài sẽ thấy tứ trụ + hồ sơ rút gọn của bạn (không có ngày sinh dạng lịch; có thể đoán gần đúng ngày sinh từ tứ trụ). Hồ sơ xoá sau 30 ngày. Đồng ý?')) return;
          const q = prompt('Câu hỏi cho thầy (≤ 500 ký tự):', 'Năm nay con nên chọn nghề gì trong thành?') || '';
          const profile = api.chartProfile?.(); if (!profile) { api.toast('Cần lập lá số trước.'); return; }
          await run('dv_book', { to: d.u, q, profile, consent: true }, '🔮 Đã đặt quẻ — tiền vào két, thầy luận trong 24 giờ.'); draw();
        };
        lg.querySelector('.hq-yc-grid').append(b);
      }
      if (!(ls?.list || []).filter((x) => !x.me).length) lg.append(el('<p class="hq-note">Chưa có thầy nào nhận khách.</p>'));
      area.append(lg);
      for (const b of mine?.asC || []) {
        const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>Quẻ của bạn · thầy ${esc(b.thay)} · ${b.fee / 100} đồng</b><small>${esc(b.verdict || ({ paid: 'chờ thầy luận', done: 'đã có lời luận — hãy đánh giá', review: 'chờ admin duyệt', settled: 'đã xong' }[b.status] || b.status))}</small>${b.text ? `<details><summary>Lời luận</summary><p>${esc(b.text)}</p></details>` : ''}</span><span class="hq-inv-act"></span></div>`);
        if (b.status === 'done' && b.happy == null) { const y = el('<button class="hq-btn hq-primary" type="button">Hài lòng</button>'), n = el('<button class="hq-btn" type="button">Không hài lòng</button>'); y.onclick = async () => { await run('dv_rate', { id: b.id, happy: true }, 'Đã đánh giá.'); draw(); }; n.onclick = async () => { const why = prompt('Lý do?', '') || ''; await run('dv_rate', { id: b.id, happy: false, reason: why }, 'Đã ghi phản hồi — trọng tài sẽ xem.'); draw(); }; c.querySelector('.hq-inv-act').append(y, n); }
        area.append(c);
      }
      // thầy
      const prof = mine?.prof;
      const tg = el(`<div><h4>Hành nghề thầy mệnh lý</h4><p class="hq-note">Cần cấp 10 (hoặc Trúc Cơ), qua sát hạch 3 lá số mẫu, ký quỹ 2 lượng. Giá 50–300 đồng (Sơ cấp), tới 1.000 (Trung cấp, uy tín ≥ 60), 3.000 (Cao cấp, ≥ 85). Tối đa 10 lượt / ngày.</p>${prof ? `<p class="hq-life-van">${esc(prof.rank)} · uy tín ${prof.rep} · ${prof.active ? 'đang nhận khách' : 'nghỉ'} · giá ${prof.fee || 0} đồng${prof.ban > Date.now() ? ' · ⛔ bị treo nghề' : ''}</p>` : ''}<div class="hq-actions"></div></div>`);
      const ta = tg.querySelector('.hq-actions');
      if (!prof?.exam) { const e = el('<button class="hq-btn hq-primary" type="button">📝 Làm bài sát hạch</button>'); e.onclick = () => examForm(area); ta.append(e); }
      else { const r = el('<button class="hq-btn hq-primary" type="button">Đặt giá & nhận khách</button>'); r.onclick = async () => { const fee = Math.floor(Number(prompt('Giá mỗi quẻ (đồng)?', String(prof.fee || 100))) || 0); if (fee > 0) { await run('dv_register', { fee, level: api.level?.() || 1, realm: api.state.realm?.idx | 0 }, (x) => `🔮 Đã treo biển: ${x.rank} · ${x.fee} đồng / quẻ.`); draw(); } }; ta.append(r); }
      area.append(tg);
      for (const b of mine?.asT || []) {
        const c = el(`<div class="hq-yc-card"><span class="hq-food-t"><b>Khách đặt quẻ · ${b.fee / 100} đồng · hạn ${new Date(b.due).toLocaleString('vi-VN')}</b><small>Hỏi: ${esc(b.q)}</small>${b.profile ? `<small>Nhật chủ ${esc(b.profile.dm)} · ${esc(b.profile.strong)} · Dụng ${esc(b.profile.yong?.primary || '?')} · tứ trụ ${esc(b.profile.pillars.join(' · '))} · ngũ hành ${Object.entries(b.profile.pct).map(([k, v]) => `${k}${v}%`).join(' ')}</small>` : ''}<small>${esc(b.status)}</small></span></div>`);
        if (b.status === 'paid') { const ta2 = el(`<textarea class="hq-input" rows="6" placeholder="Lời luận ${DV.LEN[0]}–${DV.LEN[1]} ký tự…"></textarea>`), sb = el('<button class="hq-btn hq-primary" type="button">Gửi lời luận</button>'); sb.onclick = async () => { const r = await run('dv_deliver', { id: b.id, text: ta2.value }); if (r?.ok) { api.toast(r.l0.pass ? `✅ Đã gửi — kiểm tất định đạt (${r.l0.score}/10)${r.l1 ? ` · AI chấm logic ${r.l1.logic}/10` : ''}.` : `⚠ Đã gửi nhưng bị gắn cờ: ${r.l0.flags.join(', ')}.`); draw(); } }; c.append(ta2, sb); }
        area.append(c);
      }
    });
    return box;
  }
  function examForm(area) {
    const f = el(`<div class="hq-econ-exam"><h4>📝 Sát hạch — luận 3 lá số mẫu</h4>${DV.EXAM.map((e, i) => `<p><b>Mẫu ${i + 1}:</b> ${esc(e.pillars)} · Nhật chủ ${esc(e.dm)}, ${esc(e.strong)}. ${esc(e.note)}</p><textarea class="hq-input" rows="5" data-i="${i}" placeholder="Nêu rõ Dụng thần (ví dụ «Dụng thần là Kim»), lý do, nghề hợp trong thành… (≥ ${DV.LEN[0]} ký tự)"></textarea>`).join('')}<div class="hq-actions"><button class="hq-btn hq-primary" type="button">Nộp bài</button></div></div>`);
    f.querySelector('.hq-actions button').onclick = async () => {
      const texts = [...f.querySelectorAll('textarea')].map((t) => t.value);
      const r = await run('dv_exam', { texts });
      if (r?.ok) { api.toast(r.pass ? `🎓 Đạt sát hạch (trung bình ${r.avg}/10) — giờ ký quỹ và đặt giá.` : `Chưa đạt (trung bình ${r.avg}/10): ${r.res.map((x, i) => `mẫu ${i + 1} ${x.pass ? '✓' : `✗ ${x.flags.join(',') || 'sai Dụng thần'}`}`).join(' · ')}.`); if (r.pass) draw(); }
    };
    area.replaceChildren(f);
  }

  function draw() {
    const body = { kho, ruong, bep, cho, tiem, hotich, thay }[tab] || kho;
    root.replaceChildren(head(), me ? body() : el('<p class="hq-note">Đang mở sổ…</p>'));
  }
  draw(); load();
  return root;
}
