// ============================================================================
//  THÀNH BÁT QUÁI — bảng tương tác trong phòng (world.js › trạm ảo 'spot'):
//    owner  chủ tiệm → toàn bộ hàng của tiệm + bán lại đồ trong túi
//    ware   một món bày trong tiệm → thẻ hàng, mua
//    svc    dịch vụ: tửu lâu (nghe chuyện), trà lâu (thuyết thư / uống trà), dịch trạm (thuê ngựa),
//           nha môn (nhà rao bán), phong thủy đường (thầy xem nhà), tiệm may (Tàng Y)
//    pray   lư hương trong điện
//    use    đồ có chức năng trong nhà riêng (bàn thờ, bàn trà, giường, kệ sách, bể cá, cây, la bàn…)
//    home   giấy tờ nhà cạnh cửa: mua căn đang rao / bài trí nhà mình / khen nhà người khác
//  api (main.js): state, toast, after, panel, setTeaColor, todayNpc, goTo, travel, estate, rebuildRoom
// ============================================================================
import { VILLA_DISTRICT_NAME } from './estate-layout.js';
import { GODS, godOfTemple } from './temples.js';
import * as I from './items.js';
import * as E from './estate.js';
import { scoreHome, warmReward } from './homefs.js';
import { roomByKey } from './rooms.js';
import { cityShops } from './shops.js';
import { enterables } from './homes.js';
import * as BQ from './batquai.js';
import { OUTER_A } from './cityblocks.js';
import { grantHome, homeGot, addTeaMinutes, todayStr } from './state.js';
import { wardrobe } from './cosmetics.js';
import { svcInfo } from './shop-data.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
import * as LIFE from './life.js';
import { menuBody } from './life-ui.js';
import * as C from './coins.js';
import * as ILL from './illness.js';
import * as VE from './vehicles.js';
const I_WX = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
const HORSE_XU = 30 * C.DONG; // thuê ngựa trạm mỗi chuyến (P18 — trước 8 Phúc Khí)
import { JOB_OF_SHOP, WORK } from './jobs.js';
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
// giá: tiền kim loại (xu → «3 lượng bạc 600 đồng») hoặc Ngọc; giá Phúc Khí chỉ còn ở nhà mua theo chế độ cũ (hoàn lại khi bán)
const priceTxt = (p) => (p?.ngoc ? `💎 ${p.ngoc}` : p?.xu ? `💰 ${C.fmt(p.xu)}` : p?.phuc ? `✦ ${p.phuc} Phúc Khí` : '💰 0 đồng');
const ICON = { moc: '🪑', gom: '🏺', den: '🏮', thuhoa: '🖼️', hoavien: '🪴', phongthuy: '🧭', huong: '🪔', tra: '🍵', duoc: '💊', loren: '⚔️' };
const USE_TXT = { teatable: 'Pha trà tại nhà', desk: 'Án thư', altar: 'Thắp hương mỗi ngày', bed: 'Nghỉ lại — vào game thức dậy ở nhà', books: 'Đọc sách mỗi ngày', light: 'Thắp sáng', plant: 'Tưới mỗi ngày, cây lớn dần', fish: 'Cho cá ăn mỗi ngày', compass: 'Xem phong thủy nhà', incense: 'Thắp ở bàn thờ', tea: 'Pha ở bàn trà', buff_speed: 'Đi nhanh', buff_case: '+25% Phúc Khí giải án hôm nay', fishfood: 'Cho cá ăn' };
const yongOf = (s) => s.player?.yong || null;
const hash = (str) => { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

function balance(api) {
  const s = api.state, w = wardrobe(s);
  return el(`<div class="hq-yc-bal"><span>💰 ${C.fmt(LIFE.walletXu(s))}</span><span>💎 ${w.ngoc} Ngọc</span><span>✦ ${s.phucKhi} Phúc Khí</span></div>`);
}

/** thẻ hàng: mua (và bán / dùng nếu có trong túi) */
function itemCard(api, it, { deal = null, shopName = '', refresh = () => {} } = {}) {
  const s = api.state, have = I.invCount(s, it.id), total = it.kind === 'decor' ? I.ownedTotal(s, it.id) : have;
  const price = deal ? { xu: deal.xu } : it.price;
  const meta = [it.wx ? `hành ${I.WX_NAME[it.wx]}` : '', it.foot && it.kind === 'decor' ? `${it.foot[0]}×${it.foot[1]} m${it.place === 'wall' ? ' · treo tường' : ''}` : '', it.use ? USE_TXT[it.use] || '' : ''].filter(Boolean).join(' · ');
  const n = el(`<div class="hq-yc-card${it.rare ? ' r5' : ''}" style="--rc:${it.rare ? '#ffc44a' : 'var(--hq-line)'}">
    <i class="hq-yc-ic">${ICON[it.cat] || '✦'}</i>
    <div><b>${esc(it.name)}</b>${it.rare ? ' <small class="hq-yc-r">Hàng quý</small>' : ''}${deal ? ' <small class="hq-yc-match">Giảm giá hôm nay −20%</small>' : ''}
      <p>${esc(it.desc || '')}</p><p class="hq-sub">${esc(meta)}${total ? ` · đang có ${total}` : ''}</p></div>
    <div class="hq-yc-act"></div></div>`);
  const act = n.querySelector('.hq-yc-act');
  act.append(el(`<button class="hq-btn hq-primary" type="button" data-a="buy">Mua · ${priceTxt(price)}</button>`));
  if (have && it.kind === 'use' && (it.use === 'buff_speed' || it.use === 'buff_case')) act.append(el('<button class="hq-btn" type="button" data-a="use">Dùng ngay</button>'));
  if (have) act.append(el(`<button class="hq-btn" type="button" data-a="sell">Bán lại · ${priceTxt(I.sellPrice(it))}</button>`));
  act.querySelector('[data-a=buy]').onclick = () => {
    const r = deal ? I.buyDeal(s, deal) : I.buyItem(s, it.id);
    if (!r.ok) { api.toast(r.reason); return; }
    api.toast(`Đã mua «${it.name}»${shopName ? ` ở ${shopName}` : ''}${it.kind === 'decor' ? ' · cất vào túi, về nhà bài trí' : ''}`); api.tut?.('buy'); api.after(0); refresh();
  };
  act.querySelector('[data-a=use]')?.addEventListener('click', () => { const r = I.useBuff(s, it.id, Date.now(), todayStr()); api.toast(r.ok ? r.msg : r.reason); api.after(0); refresh(); });
  act.querySelector('[data-a=sell]')?.addEventListener('click', () => { const r = I.sellItem(s, it.id); if (r.ok) api.toast(`Đã bán «${it.name}»`); api.after(0); refresh(); });
  return n;
}

// --- chủ tiệm: toàn bộ hàng + túi đồ
function shopBody(api, room) {
  const s = api.state, shop = room.shop, today = todayStr();
  const root = el('<div class="hq-yc"></div>');
  let tab = 'hang';
  const render = () => {
    root.innerHTML = '';
    root.append(balance(api));
    // tửu lâu / trà lâu / trà trang: gọi món bằng Văn (sinh tồn — life.js)
    if (LIFE.MENUS[room.type] && api.life) {
      const b = el(`<div class="hq-actions"><button class="hq-btn hq-primary" type="button">${room.type === 'tuu' ? '🍲' : '🍵'} Gọi món (trả bằng Văn)</button></div>`);
      b.querySelector('button').onclick = () => api.panel.open({ title: `${shop.name} · thực đơn`, body: menuBody(api, api.life(), room.type, shop.name, (f) => { api.toast(`${f.icon} ${f.name} · −${f.price} văn`); api.save(); }) });
      root.append(b);
    }
    // trò chuyện tự do với chủ tiệm (P6 — LLM qua máy chủ, nghiệp vụ trong khung)
    { const cb = el(`<div class="hq-actions"><button class="hq-btn" type="button">💬 Trò chuyện với ${esc(shop.owner)}</button></div>`);
      cb.querySelector('button').onclick = () => import('./npc-chat-ui.js').then((m) => api.panel.open({ title: `💬 ${shop.owner} · ${shop.name}`, body: m.chatBody(api, { id: `shop:${room.type}:${shop.k}`, name: shop.owner, role: `chủ ${shop.name}`, shop: { items: I.itemsOfShop(room.type).filter((it) => it.price?.xu).slice(0, 12).map((it) => ({ id: it.id, name: it.name, price: Math.round(it.price.xu / 100) })) }, hiring: JOB_OF_SHOP[room.type] ? { job: WORK[JOB_OF_SHOP[room.type]].name } : null }, { place: shop.name, onJob: () => api.toast('Bảng Chiêu công treo ở vách trái sát cửa tiệm.') }) }));
      root.append(cb); }
    const tabs = el(`<div class="hq-tabs"><button class="hq-tab${tab === 'hang' ? ' on' : ''}" data-k="hang" type="button">🛒 Hàng của tiệm</button><button class="hq-tab${tab === 'tui' ? ' on' : ''}" data-k="tui" type="button">🎒 Túi đồ (bán lại)</button></div>`);
    tabs.onclick = (e) => { const b = e.target.closest('.hq-tab'); if (b) { tab = b.dataset.k; render(); } };
    root.append(tabs);
    const grid = el('<div class="hq-yc-grid"></div>');
    if (tab === 'hang') {
      const deal = I.dailyDeal(room.type, shop.k, today), rare = I.dailyRare(room.type, shop.k, today);
      root.append(el(`<p class="hq-sub">${esc(shop.owner)}: «${esc(rare ? `Hôm nay tiệm có ${rare.name} — hàng quý, ít khi về.` : 'Hàng tốt giá phải chăng, khách cứ xem.')}»</p>`));
      const list = I.itemsOfShop(room.type).filter((it) => !it.rare || it === rare);
      for (const it of list) grid.append(itemCard(api, it, { deal: deal?.id === it.id ? deal : null, shopName: shop.name, refresh: render }));
      if (!list.length) grid.append(el(`<p class="hq-note">Tiệm này không bán hàng — dịch vụ ở hai bên quầy: ${esc((I.SHOP_TYPES.find((t) => t.id === room.type)?.svc || []).map((id) => svcInfo(id)?.name || id).join(', ') || '—')}.</p>`));
    } else {
      const inv = I.homeState(s).inv, ids = Object.keys(inv);
      if (!ids.length) grid.append(el('<p class="hq-note">Túi đồ trống. Đồ mua ở các tiệm cất ở đây; về nhà riêng để bài trí.</p>'));
      for (const id of ids) grid.append(itemCard(api, I.ITEM[id], { refresh: render }));
    }
    root.append(grid);
  };
  render();
  return root;
}

// --- dịch vụ
const GATES = () => BQ.GUA.map((g) => ({ g, p: BQ.toWorld(g, OUTER_A - 26, 9) })); // trong cổng Ngoại Thành (vành phủ)
const RUMOR_OPEN = ['Nghe đồn rằng', 'Trong thành đang xì xào', 'Có khách vừa kể', 'Ta nghe tiểu nhị nói'];
async function rumor(api) {
  const s = api.state, d = todayStr(), r = hash(`${d}|${s.phucKhi}|${Date.now() >> 16}`) % 3;
  const open = RUMOR_OPEN[hash(d) % RUMOR_OPEN.length];
  if (r === 0) { const npc = api.todayNpc?.(hash(d) % 3); if (npc) return `${open} ${npc.call} đang có chuyện khó nghĩ, muốn tìm thầy hỏi việc ở Sơn Môn. Ai giải được án ấy hôm nay thì được nhiều Phúc Khí lắm.`; }
  if (r === 1) {
    const shops = cityShops(), k = hash(`rare|${d}`) % shops.length, sh = shops[k], rare = I.dailyRare(sh.type, sh.k, d);
    if (rare) return `${open} ${sh.name} (phường ${BQ.guaById(sh.g).name}) vừa về ${rare.name} — hàng quý, chậm chân là hết.`;
  }
  const y = yongOf(s), L = E.listings().map((l) => ({ l, st: E.fitStars(l.wx, y) })).filter((x) => !api.estate?.info?.(x.l.h)).sort((a, b) => b.st - a.st || a.l.h - b.l.h);
  const pick = L[hash(`est|${d}`) % Math.max(1, Math.min(4, L.length))];
  if (pick) return `${open} ${pick.l.name} đang rao bán${y ? ` — hành phường ${I.WX_NAME[pick.l.wx]}, ${E.FIT_TEXT[pick.st].toLowerCase()} với mệnh khách` : ''}. Hỏi Nha Môn Địa Ốc mà xem.`;
  return `${open} trời sắp đổi mùa, khách nhớ giữ sức khỏe.`;
}
async function classicPassage(seedKey) {
  try {
    const { LIBRARY } = await import('../engine/library-data.js');
    const pool = LIBRARY.filter((e) => e.name_vi && e.meaning && (e.han_text || '').length > 4);
    const e = pool[hash(seedKey) % pool.length];
    return { title: `${e.name_vi}${e.name_han ? ` (${e.name_han})` : ''}`, han: String(e.han_text).slice(0, 160), vi: String(e.meaning).slice(0, 420) };
  } catch (err) { return { title: 'Đạo Đức Kinh', han: '上善若水', vi: 'Thượng thiện nhược thủy — điều thiện cao nhất như nước, làm lợi muôn loài mà không tranh.' }; }
}
function passageNode(p) { return el(`<div class="hq-yc-setcard"><div class="hq-yc-setic">📜</div><div><b>${esc(p.title)}</b><p lang="zh">${esc(p.han)}</p><p>${esc(p.vi)}</p></div></div>`); }

const ECON_SVC = ['cho', 'ruong', 'matbang', 'hotich', 'bep', 'beptruong', 'thaymenh'];
function svcBody(api, room, svc) {
  if (ECON_SVC.includes(svc)) { const box = el('<div></div>'); import('./econ-ui.js').then((m) => box.replaceWith(m.econBody(api, api.econ, { at: svc }))); return box; }
  const s = api.state, root = el('<div class="hq-yc"></div>');
  root.append(balance(api));
  if (svc === 'tindon') {
    const b = el('<div><p class="hq-sub">Chưởng quầy: «Gọi một vò rượu, ta kể khách nghe chuyện trong thành.» Mỗi vò 20 đồng.</p><div class="hq-actions"><button class="hq-btn hq-primary" type="button">🍶 Gọi rượu · 💰 20 đồng</button></div><div data-r></div></div>');
    b.querySelector('button').onclick = async () => {
      if (!LIFE.spendXu(s, 20 * C.DONG)) { api.toast('Không đủ tiền (20 đồng).'); return; }
      api.save?.(); api.after(0);
      const t = await rumor(api);
      b.querySelector('[data-r]').prepend(el(`<p class="hq-yc-setcard"><span>🍶</span><span>${esc(t)}</span></p>`));
    };
    root.append(b);
  } else if (svc === 'thuoc' || svc === 'yquan') {
    const L = LIFE.lifeState(s), yong = s.player?.yong?.primary || null, box = el('<div></div>');
    const draw = () => {
      const ill = L.ill, I = ill ? ILL.ILLS[ill.id] : null, q = ILL.quote(L, svc === 'thuoc' ? 'duoc' : 'yquan', yong);
      const head = svc === 'thuoc' ? 'Lang trung: «Thang thuốc ở quầy chỉ chữa cảm sốt, ngộ độc nhẹ. Bệnh nặng sang Y Quán phía sau.»' : `Thầy thuốc bắt mạch theo ngũ hành: kê đơn hợp Dụng thần${yong ? ` (${I_WX[yong] || yong})` : ''} — khỏi nhanh gấp đôi, thuốc bớt 20%. Khám ${ILL.EXAM} đồng.`;
      box.innerHTML = `<p class="hq-sub">${esc(head)}</p>
        <p class="hq-life-van">${ill ? `🤒 <b>${esc(I.name)}${ill.sev ? ' nặng' : ' nhẹ'}</b> (${esc(I.note)}${I.organ ? ` · tạng ${esc(I.organ)}` : ''})${ill.cureAt ? ` · đang hồi phục, còn ${Math.max(1, Math.ceil((ill.cureAt - Date.now()) / 60000))} phút` : ''}` : '💚 Mạch bình hoà — không có bệnh.'}${L.debt ? ` · nợ ${L.debt} đồng` : ''}</p>
        ${q.ok ? `<div class="hq-actions"><button class="hq-btn hq-primary" type="button" data-t>${svc === 'thuoc' ? '🌿 Bốc thang thuốc' : '🩺 Khám và kê đơn'} · ${q.price} đồng</button></div><p class="hq-note">Không đủ tiền vẫn chữa — ghi nợ viện phí (lãi 2%/ngày; nợ trên 1 lượng quá 7 ngày bị Nha Môn xử khổ sai trừ nợ).</p>` : ill && !ill.cureAt ? `<p class="hq-note">${esc(q.reason)}</p>` : ''}`;
      const b = box.querySelector('[data-t]');
      if (b) b.onclick = () => { const r = ILL.treat(L, svc === 'thuoc' ? 'duoc' : 'yquan', yong, (amt) => LIFE.pay(L, amt)); if (!r.ok) { api.toast(r.reason); return; } api.toast(`${svc === 'thuoc' ? '🌿 Uống thang thuốc' : '🩺 Thầy kê đơn'} · ${r.price} đồng${r.owed ? ' (ghi nợ)' : ''} — khỏi sau ${Math.round(r.ms / 60000)} phút${r.fast ? ' (đơn hợp Dụng thần)' : ''}.`); api.save?.(); api.updateVitals?.(); draw(); };
    };
    draw(); root.append(box);
  } else if (svc === 'tientrang') {
    const L = LIFE.lifeState(s), box = el('<div></div>');
    const draw = () => {
      box.innerHTML = `<p class="hq-sub">Chưởng quỹ: «Gửi tiền ở đây thì móc túi, ngất đường cũng không mất. Mỗi lần gửi hay rút lấy nửa phân (0,5%), ít nhất 1 đồng.»</p>
        <p class="hq-life-van">Trong túi <b>${C.fmt(L.xu)}</b> · đang gửi <b>${C.fmt(L.bank || 0)}</b></p>
        <div class="hq-actions" data-dep></div><div class="hq-actions" data-wd></div>
        <div class="hq-actions"><input class="hq-input" data-amt placeholder="vd: 2 lượng bạc 300 đồng" style="flex:1;min-width:0"><button class="hq-btn" type="button" data-d>Gửi</button><button class="hq-btn" type="button" data-w>Rút</button></div>`;
      const act = (fn, xu) => { const r = fn(L, xu); if (!r.ok) { api.toast(r.reason); return; } api.toast(`${fn === LIFE.deposit ? 'Đã gửi' : 'Đã rút'} ${C.fmt(xu)} · phí ${C.fmt(r.fee)}`); api.save?.(); api.updateVitals?.(); draw(); };
      const presets = (cap) => [100 * C.DONG, C.BAC, 10 * C.BAC].filter((v) => v <= cap).concat(cap > C.DONG ? [cap] : []);
      for (const v of [...new Set(presets(L.xu))]) { const b = el(`<button class="hq-btn hq-primary" type="button">Gửi ${v === L.xu ? 'hết' : C.fmt(v)}</button>`); b.onclick = () => act(LIFE.deposit, v); box.querySelector('[data-dep]').append(b); }
      for (const v of [...new Set(presets(L.bank || 0))]) { const b = el(`<button class="hq-btn" type="button">Rút ${v === L.bank ? 'hết' : C.fmt(v)}</button>`); b.onclick = () => act(LIFE.withdraw, v); box.querySelector('[data-wd]').append(b); }
      const amt = () => { const v = C.parse(box.querySelector('[data-amt]').value); if (v == null) api.toast('Ghi số tiền, ví dụ «150» (đồng) hay «1 lượng bạc».'); return v; };
      box.querySelector('[data-d]').onclick = () => { const v = amt(); if (v != null) act(LIFE.deposit, v); };
      box.querySelector('[data-w]').onclick = () => { const v = amt(); if (v != null) act(LIFE.withdraw, v); };
    };
    draw(); root.append(box);
  } else if (svc === 'thuyetthu') {
    const d = todayStr(), box = el('<div><p class="hq-sub">Tiên sinh gõ thước: «Hôm nay kể một đoạn trong kho sách cổ…»</p><div data-p></div></div>');
    classicPassage(`tt|${d}|${room.key}`).then((p) => {
      box.querySelector('[data-p]').append(passageNode(p));
      const got = grantHome(s, 'thuyetthu', 3);
      if (got) { api.toast(`Nghe thuyết thư · +${got} Phúc Khí`); api.after(got); }
    });
    root.append(box);
  } else if (svc === 'uongtra') {
    const tea = I.firstUsable(s, 'tea');
    const b = el(`<div><p class="hq-sub">Ngồi bồ đoàn uống một ấm trà (tính phút trà chung với Trà Thất — tối đa 15 phút có thưởng mỗi ngày).</p><div class="hq-actions"><button class="hq-btn hq-primary" type="button">🍵 Uống trà${tea ? ` (${esc(tea.name)} trong túi)` : ' của quán'}</button></div></div>`);
    b.querySelector('button').onclick = () => {
      if (tea) { I.consume(s, tea.id); api.setTeaColor?.(tea.color); }
      const got = addTeaMinutes(s, tea ? 5 : 3);
      api.toast(got ? `Một ấm trà thơm · +${got} Phúc Khí` : 'Trà ngon — hôm nay đã đủ phút trà có thưởng.'); api.after(got); api.panel.close();
    };
    root.append(b);
  } else if (svc === 'thuengua') {
    root.append(el('<p class="hq-sub">Trạm trưởng: «Ngựa khỏe, đi đường quan đạo tới cổng ngoài nào cũng nhanh.» Mỗi chuyến 30 đồng.</p>'));
    const g = el('<div class="hq-yc-grid"></div>');
    for (const { g: gua, p } of GATES()) {
      const b = el(`<button class="hq-btn hq-row" type="button">🐎 ${esc(gua.gate)} — cung ${esc(gua.name)} (${esc(I.WX_NAME[gua.wx])})</button>`);
      b.onclick = () => { if (!LIFE.spendXu(s, HORSE_XU)) { api.toast('Không đủ tiền (30 đồng).'); return; } api.save?.(); api.after(0); api.panel.close(); api.travel?.(p.x, p.z, `🐎 Cưỡi ngựa tới ${gua.gate}`); };
      g.append(b);
    }
    // bán phương tiện (P4 — vehicles.js): mua đứt, bảo trì trừ mỗi ngày
    { const L = LIFE.lifeState(s), vg = el('<div><h4>Chuồng ngựa · bán phương tiện</h4><div class="hq-yc-grid" data-v></div><p class="hq-note">Bảo trì (cỏ, chuồng, linh thực) trừ mỗi ngày; nợ bảo trì 3 ngày thì trạm giữ xe, bán nửa giá trừ nợ. Cưỡi / xuống: nút 🐎 hoặc phím H.</p></div>');
      for (const [id, V] of Object.entries(VE.VEHICLES)) {
        const has = VE.owns(L, id);
        const b = el(`<button class="hq-yc-card" type="button" ${has ? 'disabled' : ''}><span class="hq-food-i">${V.icon}</span><span class="hq-food-t"><b>${esc(V.name)}</b><small>${esc(V.desc)} · bảo trì ${V.upkeep} đồng/ngày</small></span><span class="hq-price">${has ? 'Đã có' : C.fmt(V.price)}</span></button>`);
        b.onclick = () => { const r = VE.buy(L, id, (x) => LIFE.payXu(L, x)); if (!r.ok) { api.toast(r.reason); return; } api.toast(`${V.icon} Đã mua ${V.name}!`); api.save?.(); api.updateVitals?.(); api.refreshHud?.(); b.disabled = true; b.querySelector('.hq-price').textContent = 'Đã có'; };
        vg.querySelector('[data-v]').append(b);
      }
      root.append(vg); }
    const sm = el('<button class="hq-btn hq-row" type="button">🏯 Về Huyền Quán Sơn Môn</button>');
    sm.onclick = () => { if (!LIFE.spendXu(s, HORSE_XU)) { api.toast('Không đủ tiền (30 đồng).'); return; } api.save?.(); api.after(0); api.panel.close(); api.travel?.(null, null, '🐎 Cưỡi ngựa về Sơn Môn'); };
    g.append(sm);
    root.append(g);
  } else if (svc === 'diaoc') {
    root.append(listingsView(api, true));
  } else if (svc === 'khaosat') {
    const own = I.homeState(s).own;
    if (!own) root.append(el('<p class="hq-sub">Thầy địa lý: «Khách chưa có nhà riêng. Mua nhà ở Nha Môn Địa Ốc rồi ta tới xem giúp.» Thầy cũng xem được nhà đang rao bán nào hợp mệnh khách — mở bảng dưới.</p>'));
    else root.append(fsView(api, own.h));
    if (!own) root.append(listingsView(api, false));
  } else if (svc === 'may') {
    import('./wardrobe-ui.js').then((m) => root.append(m.wardrobeBody(api)));
  }
  return root;
}

/** Phân tích phong thủy căn h (theo bố cục của mình) */
export function fsView(api, h) {
  const s = api.state, l = E.listing(h), own = I.homeState(s).own, phu = E.isPhu(l), z0 = phu ? E.zoneOfH(h, 0) : null;
  const room = phu ? E.zoneRoom(z0) : E.roomOf(l);
  const items = (own?.h === h ? own.items : []).filter((m) => !phu || !m.k); // biệt phủ: chấm theo Chính Sảnh
  const r = scoreHome({ room, items, yong: yongOf(s), wardWx: l.wx, fry: (l.house?.ry || 0) + (z0?.ry || 0) });
  const n = el(`<div><h4>🧭 Phong thủy ${esc(l.name)}: ${r.score}/100</h4>
    <p class="hq-sub">Cửa phòng nhìn theo hướng mặt tiền nhà ngoài phố. Mỗi ngày về nhà lần đầu được ${warmReward(r.score)} Phúc Khí (điểm càng cao càng nhiều).</p>
    <ul class="hq-plain">${r.notes.map((x) => `<li>${x.v > 0 ? '🟢' : '🔴'} ${esc(x.text)} <small>(${x.v > 0 ? '+' : ''}${x.v})</small></li>`).join('') || '<li>Nhà còn trống — bài trí đồ để có điểm.</li>'}</ul></div>`);
  return n;
}

/** Danh sách nhà rao bán (Nha Môn): vị trí, hạng, giá, hợp mệnh, tình trạng */
export function listingsView(api, canBuy) {
  const s = api.state, y = yongOf(s), mine = I.homeState(s).own;
  const box = el('<div class="hq-yc-grid"></div>');
  box.append(el(`<p class="hq-sub">${api.estate?.online?.() ? 'Sổ địa ốc đồng bộ toàn thành — căn đã bán người khác không mua được.' : '⚠️ Chưa nối máy chủ — xem được sổ nhưng mua bán cần kết nối.'} Mỗi người giữ một căn; bán lại được ${Math.round(E.SELL_BACK * 100)}% giá.</p>`));
  const doors = new Map(enterables().filter((e) => e.kind === 'est').map((e) => [e.key, e]));
  const L = E.listings().map((l) => ({ l, st: E.fitStars(l.wx, y), info: api.estate?.info?.(l.h) || null }));
  L.sort((a, b) => (!!a.info - !!b.info) || b.st - a.st || a.l.h - b.l.h);
  // G-6.3 (NHA-DIADIEM-MANIFEST §5): lọc theo hạng / khu / còn trống / hợp mệnh — trước là một danh sách 292 căn
  const F = { tier: 'all', free: true, fit: false, district: -1, limit: 30 };
  const TIER_CHIPS = [['all', 'Tất cả'], ['tienphu', '☁ Tiên phủ'], ['bietphu', '🏯 Biệt phủ'], ['bietthu', '🏡 Biệt thự'], ['street', '🏠 Nhà phố']];
  const bar = el(`<div class="hq-est-filter"><div class="hq-est-chips">${TIER_CHIPS.map(([k, n]) => `<button type="button" class="hq-chip" data-tier="${k}">${n}</button>`).join('')}</div>
    <div class="hq-est-chips"><label><input type="checkbox" data-f="free" checked> Chỉ căn còn trống</label><label><input type="checkbox" data-f="fit"> Hợp mệnh (≥ 4★)</label>
    <select class="hq-input" data-f="district" hidden><option value="-1">Mọi khu biệt thự</option>${VILLA_DISTRICT_NAME.map((n, i) => `<option value="${i}">${esc(n)}</option>`).join('')}</select></div><p class="hq-sub" data-f="count"></p></div>`);
  box.append(bar);
  const list = el('<div class="hq-yc-grid"></div>'); box.append(list);
  const pass = ({ l, st, info }) => (F.tier === 'all' || (F.tier === 'street' ? !E.isPhu(l) : l.tier === F.tier)) && (!F.free || !info || mine?.h === l.h) && (!F.fit || st >= 4)
    && (F.district < 0 || F.tier !== 'bietthu' || l.unit?.district === F.district);
  const render = () => {
    bar.querySelectorAll('[data-tier]').forEach((b) => b.classList.toggle('on', b.dataset.tier === F.tier));
    bar.querySelector('[data-f=district]').hidden = F.tier !== 'bietthu';
    const rows = L.filter(pass);
    bar.querySelector('[data-f=count]').textContent = `${rows.length} căn khớp${rows.length > F.limit ? ` — hiện ${F.limit} căn hợp mệnh nhất` : ''}.`;
    list.innerHTML = '';
    for (const r of rows.slice(0, F.limit)) list.append(card(r));
    if (rows.length > F.limit) { const more = el('<button type="button" class="hq-btn">Xem thêm 30 căn</button>'); more.onclick = () => { F.limit += 30; render(); }; list.append(more); }
  };
  bar.querySelectorAll('[data-tier]').forEach((b) => { b.onclick = () => { F.tier = b.dataset.tier; F.limit = 30; render(); }; });
  bar.querySelector('[data-f=free]').onchange = (e) => { F.free = e.target.checked; render(); };
  bar.querySelector('[data-f=fit]').onchange = (e) => { F.fit = e.target.checked; render(); };
  bar.querySelector('[data-f=district]').onchange = (e) => { F.district = Number(e.target.value); render(); };
  function card({ l, st, info }) {
    const T = E.TIERS[l.tier], p = E.priceOf(l), alt = E.altPriceOf(l), isMine = mine?.h === l.h;
    const n = el(`<div class="hq-yc-card${st >= 5 ? ' r4' : ''}"><i class="hq-yc-ic">🏠</i>
      <div><b>${esc(l.name)}</b> <small>${esc(T.name)} · ${l.W ? `${l.W}×${l.D} m (${l.W * l.D} m²) · ${esc(l.style)} · ${esc(l.facing.text)} · ${esc(l.facing.trach)}` : `${E.roomOf(l).w}×${E.roomOf(l).d} m`} · phường ${esc(BQ.guaById(l.g).name)} (${esc(I.WX_NAME[l.wx])})</small>
      <p>${'★'.repeat(st)}${'☆'.repeat(5 - st)} ${esc(E.FIT_TEXT[st])}</p>
      <p class="hq-sub">${isMine ? '🏡 Nhà của bạn' : info ? `Đã có chủ: ${esc(info.name)}${info.likes ? ` · ${info.likes} lượt khen` : ''}` : `Giá ${priceTxt(p)}${alt ? ` hoặc ${priceTxt(alt)}` : ''}`}</p></div>
      <div class="hq-yc-act"></div></div>`);
    const act = n.querySelector('.hq-yc-act');
    const go = el('<button class="hq-btn" type="button">🧭 Chỉ đường</button>');
    go.onclick = () => { if (l.tier === 'tienphu') { api.rideTo?.(l.house.door.x, l.house.door.z, `☁ ${l.name}`, { free: true, sub: 'Cưỡi mây tới cổng phủ…' }); return; } if (E.isPhu(l)) { api.goTo(`spot:est:${l.h}|gate`); return; } const e = doors.get(`est:${l.h}`); if (e) api.goTo(`door:${e.i}`); };
    act.append(go);
    if (canBuy && !info && !isMine) { const b = el('<button class="hq-btn hq-primary" type="button">Mua căn này</button>'); b.onclick = () => buyFlow(api, l); act.append(b); }
    return n;
  }
  render();
  return box;
}

/** Mua nhà: kiểm tiền → máy chủ giữ chỗ (est_claim) → trừ tiền → nhà trống của mình */
async function buyFlow(api, l, useAlt = false) {
  const s = api.state, h = I.homeState(s);
  if (h.own) { api.toast('Bạn đã có một căn — bán lại căn cũ ở Nha Môn trước.'); return; }
  const p = useAlt ? E.altPriceOf(l) : E.priceOf(l), w = wardrobe(s);
  if ((p.xu || 0) > LIFE.walletXu(s) || (p.ngoc || 0) > w.ngoc) {
    const alt = E.altPriceOf(l);
    if (!useAlt && alt && (alt.ngoc || 0) <= w.ngoc) { if (confirm(`Không đủ tiền. Trả ${priceTxt(alt)} thay thế?`)) buyFlow(api, l, true); return; }
    api.toast(`Chưa đủ tiền: cần ${priceTxt(p)}.`); return;
  }
  if (!api.estate?.online?.()) { api.toast('Cần kết nối máy chủ để mua nhà (giữ chỗ toàn thành).'); return; }
  if (!confirm(`Mua ${l.name} với giá ${priceTxt(p)}?`)) return;
  const r = await api.estate.claim(l.h);
  if (!r?.ok) { api.toast(r?.err === 'taken' ? 'Tiếc quá — căn này vừa có người mua.' : r?.err === 'limit' ? 'Máy chủ ghi bạn đã có một căn.' : 'Máy chủ chưa trả lời — thử lại sau.'); return; }
  if (p.xu) LIFE.spendXu(s, p.xu); w.ngoc -= p.ngoc || 0;
  h.own = { h: l.h, items: [], couplet: 0, paid: p, at: Date.now() };
  api.refreshEstate?.(); api.toast(E.isPhu(l) ? `🏯 Chúc mừng! ${l.name} là phủ của bạn. Tới cổng phủ (hoặc bàn sổ trong Chính Sảnh) để bài trí từng gian, từng khoảnh vườn.` : `🏡 Chúc mừng! ${l.name} là nhà của bạn. Vào nhà, bấm «Sổ bài trí» cạnh cửa để bày đồ.`);
  api.after(0); api.rebuildRoom?.(`est:${l.h}`); api.panel.close();
}
async function sellFlow(api) {
  const s = api.state, h = I.homeState(s), own = h.own; if (!own) return;
  // nhà mua theo chế độ cũ (Phúc Khí) thì hoàn Phúc Khí; mua bằng tiền / Ngọc thì hoàn tiền / Ngọc (P18)
  const l = E.listing(own.h), paid = own.paid || E.priceOf(l), back = { phuc: Math.floor((paid.phuc || 0) * E.SELL_BACK), xu: Math.floor(((paid.xu || 0) * E.SELL_BACK) / 100) * 100, ngoc: Math.floor((paid.ngoc || 0) * E.SELL_BACK) };
  if (!confirm(`Bán lại ${l.name}? Nhận ${priceTxt(back.ngoc ? { ngoc: back.ngoc } : back.xu ? { xu: back.xu } : { phuc: back.phuc })}. Đồ đạc trong nhà cất về túi.`)) return;
  if (!api.estate?.online?.()) { api.toast('Cần kết nối máy chủ.'); return; }
  const r = await api.estate.release(own.h);
  if (!r?.ok) { api.toast('Máy chủ chưa trả lời — thử lại sau.'); return; }
  for (const m of own.items) h.inv[m.i] = (h.inv[m.i] || 0) + 1;
  s.phucKhi += back.phuc; if (back.xu) LIFE.gainXu(s, back.xu); wardrobe(s).ngoc += back.ngoc;
  h.own = null; h.spawn = null;
  api.refreshEstate?.(); api.toast(`Đã bán lại ${l.name}.`); api.after(0); api.rebuildRoom?.(`est:${l.h}`); api.panel.close();
}

// --- đồ dùng trong nhà riêng
const ALTAR_PHUC = [0, 5, 8, 12];
function useItem(api, room, d) {
  const s = api.state, h = I.homeState(s), it = I.ITEM[d.item], l = room.listing, mine = h.own?.h === l.h;
  if (!mine) return { title: it.name, body: el(`<p class="hq-sub">${esc(it.name)} của chủ nhà — khách chỉ ngắm thôi.</p>`) };
  const done = (msg, got = 0) => { api.toast(got ? `${msg} · +${got} Phúc Khí` : msg); api.after(got); };
  switch (d.use) {
    case 'altar': {
      if (homeGot(s, 'altar')) return done('Hôm nay đã thắp hương bàn thờ rồi.');
      const inc = I.firstUsable(s, 'incense');
      if (!inc) return done('Hết hương — mua ở Hương Phường.');
      I.consume(s, inc.id); return done(`Thắp ${inc.name} lên bàn thờ gia tiên`, grantHome(s, 'altar', ALTAR_PHUC[inc.tier || 1]));
    }
    case 'teatable': {
      const tea = I.firstUsable(s, 'tea');
      if (!tea) return done('Hết trà — mua ở Trà Trang.');
      I.consume(s, tea.id); api.setTeaColor?.(tea.color);
      const a = addTeaMinutes(s, 5), b = grantHome(s, 'tea', 4);
      return done(`Pha ${tea.name} — nước ${tea.color ? 'trà thơm' : ''}`.trim(), a + b);
    }
    case 'bed': h.spawn = h.spawn === 'home' ? null : 'home'; return done(h.spawn ? 'Đã chọn nghỉ ở nhà — lần sau vào game sẽ thức dậy tại đây.' : 'Bỏ chọn — lần sau vào game xuất hiện ở Sơn Môn.');
    case 'books': {
      const box = el('<div><div data-p></div></div>');
      classicPassage(`bk|${todayStr()}|${l.h}`).then((p) => { box.querySelector('[data-p]').append(passageNode(p)); const got = grantHome(s, 'books', 3); if (got) done('Đọc sách', got); });
      return { title: 'Kệ sách', body: box };
    }
    case 'fish': {
      if (homeGot(s, 'fish')) return done('Cá đã no rồi, mai cho ăn tiếp.');
      if (!I.consume(s, 'thucan_ca')) return done('Hết thức ăn cá — mua ở Dược Phòng.');
      return done('Cá đớp mồi tung tăng', grantHome(s, 'fish', 2));
    }
    case 'plant': {
      if (homeGot(s, 'plant')) return done('Hôm nay đã tưới cây.');
      const p = h.plants[d.uid] || { n: 0 }; p.n = Math.min(30, (p.n || 0) + 1); h.plants[d.uid] = p;
      const stage = p.n >= 14 ? 'đã trổ hoa' : p.n >= 5 ? 'đang ra lá non' : 'mới bén rễ';
      return done(`Tưới ${it.name} — cây ${stage} (${p.n} ngày)`, grantHome(s, 'plant', 2));
    }
    case 'compass': return { title: 'La bàn', body: fsView(api, l.h) };
    case 'desk': return done('Ngồi án thư mài mực viết vài chữ — tâm tĩnh lại.');
    case 'light': return done('Ánh đèn ấm cả gian nhà.');
    default: return done(it.name);
  }
}

// --- giấy tờ nhà cạnh cửa
function deedBody(api, room, d) {
  const s = api.state, l = room.listing, h = I.homeState(s), info = api.estate?.info?.(l.h);
  if (h.own?.h !== l.h) api.tut?.('estate');
  const root = el('<div class="hq-yc"></div>');
  const T = E.TIERS[l.tier], st = E.fitStars(l.wx, yongOf(s));
  root.append(el(`<div><b>${esc(l.name)}</b> <small>${esc(T.name)} · ${l.W ? `${l.W}×${l.D} m (${l.W * l.D} m²) · ${esc(l.style)}` : `${E.roomOf(l).w}×${E.roomOf(l).d} m`} · phường ${esc(BQ.guaById(l.g).name)} (${esc(I.WX_NAME[l.wx])})</small>${l.facing ? `<p class="hq-sub">🧭 ${esc(l.facing.text)} · ${esc(l.facing.trach)} · sau lưng có gò (tọa sơn), trước nhà có mặt nước (minh đường)</p>` : ''}<p>${'★'.repeat(st)}${'☆'.repeat(5 - st)} ${esc(E.FIT_TEXT[st])}</p></div>`));
  if (h.own?.h === l.h) {
    const r = el('<div class="hq-actions"><button class="hq-btn hq-primary" data-a="edit" type="button">🪑 Bài trí nhà</button><button class="hq-btn" data-a="fs" type="button">🧭 Xem phong thủy</button><button class="hq-btn" data-a="sell" type="button">Bán lại</button></div>');
    r.querySelector('[data-a=edit]').onclick = () => api.openHomeEdit?.(l.h);
    r.querySelector('[data-a=fs]').onclick = () => { root.querySelector('[data-fs]')?.remove(); const f = fsView(api, l.h); f.dataset.fs = 1; root.append(f); };
    r.querySelector('[data-a=sell]').onclick = () => sellFlow(api);
    root.append(r);
    if (info?.likes) root.append(el(`<p class="hq-sub">❤️ ${info.likes} lượt khen nhà</p>`));
  } else if (info) {
    root.append(el(`<p class="hq-sub">Nhà của <b>${esc(info.name)}</b>${info.likes ? ` · ❤️ ${info.likes}` : ''}.</p>`));
    const b = el('<div class="hq-actions"><button class="hq-btn hq-primary" type="button">❤️ Khen nhà</button></div>');
    b.querySelector('button').onclick = async () => { const r = await api.estate.like(l.h); api.toast(r?.ok ? 'Đã khen nhà — chủ nhà sẽ vui lắm.' : r?.err === 'dup' ? 'Bạn đã khen nhà này rồi.' : 'Chưa gửi được — thử lại sau.'); };
    root.append(b);
  } else {
    const p = E.priceOf(l), alt = E.altPriceOf(l);
    root.append(el(`<p class="hq-sub">Nhà đang rao bán: ${priceTxt(p)}${alt ? ` hoặc ${priceTxt(alt)}` : ''}. Mua xong vào nhà bày đồ mua ở các tiệm; phong thủy tốt thì mỗi ngày về nhà được Phúc Khí.</p>`));
    const b = el('<div class="hq-actions"><button class="hq-btn hq-primary" type="button">Mua căn này</button></div>');
    b.querySelector('button').onclick = () => buyFlow(api, l);
    root.append(b);
  }
  return root;
}

// --- lư hương trong điện
function prayBody(api, room) {
  const s = api.state, inc = I.firstUsable(s, 'incense');
  const root = el(`<div><p class="hq-sub">Thắp hương ở ${esc(room.title)} cầu bình an. Hương mua ở Hương Phường thắp thì được thêm.</p><div class="hq-actions"><button class="hq-btn hq-primary" type="button">🪔 Thắp ${inc ? esc(inc.name) : 'nén hương của điện'}</button></div></div>`);
  root.querySelector('button').onclick = () => {
    const key = `pray:${room.key}`;
    if (homeGot(s, key)) { api.toast('Hôm nay đã thắp hương ở điện này.'); return; }
    if (inc) I.consume(s, inc.id);
    const got = grantHome(s, key, inc ? 2 + (inc.tier || 1) : 1);
    api.tut?.('pray');
    api.toast(`Khói hương nghi ngút${got ? ` · +${got} Phúc Khí` : ''}`); api.after(got); api.panel.close();
  };
  return root;
}

// v4 (G4): miếu = chat với thầy giữ miếu theo lá số + nghi thức riêng của vị thần + thắp hương (temples.js)
function templeBody(api, room) {
  const god = GODS[godOfTemple(room.key, room.lm?.g || room.g)];
  const box = el('<div class="hq-loadbox"><p class="hq-sub">Đang vào điện…</p></div>');
  Promise.all([import('./fortune-ui.js'), import('./stations.js')]).then(([F, ST]) => {
    const open = (title, body) => body && api.panel.open({ title, body });
    const extras = [
      { label: '🪔 Thắp hương', onClick: () => open(room.title, prayBody(api, room)) },
      { label: god.ritualLabel, onClick: () => open(god.ritualLabel.replace(/^\S+\s/, ''), god.ritual === 'ancổ' ? ST.openClassicalList(api) : ST.STATION_BASE[god.ritual]?.(api)) },
    ];
    if (box.isConnected) box.replaceWith(F.fortuneBody(api, god.master, { extras }));
  }).catch(() => { box.replaceWith(prayBody(api, room)); });
  return box;
}

/** Mở điểm tương tác: trả { title, body } để main.js mở bảng, hoặc null (đã xử lý bằng thông báo) */
// biệt phủ không có phòng lưới: «phòng giả» mang listing để dùng chung useItem / deedBody
function phuRoom(key) {
  const m = /^est:(\d+)$/.exec(key || ''); if (!m) return null;
  const l = E.listing(Number(m[1])); return l && E.isPhu(l) ? { key, kind: 'home', listing: l, title: l.name, mansion: true } : null;
}
export function openSpot(api, st) {
  const room = roomByKey(st.room) || phuRoom(st.room), d = st.data; if (!room || !d) return null;
  switch (d.kind) {
    case 'owner': return { title: room.shop.name, body: shopBody(api, room) };
    case 'ware': { const it = I.ITEM[d.item]; const box = el('<div class="hq-yc"></div>'); box.append(balance(api)); const today = todayStr(); const deal = I.dailyDeal(room.type, room.shop.k, today); const rf = () => { box.replaceWith(openSpot(api, st).body); }; box.append(itemCard(api, it, { deal: deal?.id === it.id ? deal : null, shopName: room.shop.name, refresh: rf })); const all = el('<div class="hq-actions"><button class="hq-btn" type="button">Xem cả tiệm</button></div>'); all.querySelector('button').onclick = () => api.panel.open({ title: room.shop.name, body: shopBody(api, room) }); box.append(all); return { title: it.name, body: box }; }
    case 'svc': return { title: svcInfo(d.svc).name, body: svcBody(api, room, d.svc) };
    case 'pray': return { title: room.title, body: templeBody(api, room) };
    case 'use': { const r = useItem(api, room, d); return r || null; }
    case 'home': return { title: 'Giấy tờ nhà', body: deedBody(api, room, d) };
    default: return null;
  }
}
