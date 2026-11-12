// ============================================================================
//  MENU «ĐỊA ĐIỂM» (NHA-DIADIEM-MANIFEST §3) — thay «Các gian & sảnh nghề»: chia theo NHU CẦU, gần nhất trước
//  (kiểu «Find NPC» của Black Desert: tìm theo chức năng, chọn là đi tới nơi gần nhất).
//  8 thẻ: Nhà tôi · Ngủ nghỉ · Ăn uống · Làm việc · Nhà đất · Xem bói & tâm linh · Mua sắm · Đi lại. Ô tìm lọc mọi thẻ.
//  Cước: < 260 m đi bộ · xa hơn xe ngựa 5 đồng (miễn phí dưới cấp 5) · về nhà / lên – xuống Cửu Trọng Thiên miễn phí.
// ============================================================================
import { enterables } from './homes.js';
import { SHOP_TYPES } from './items.js';
import * as E from './estate.js';
import * as LP from './lifeplaces.js';
import * as J from './jobs.js';
import { LODGING, FOOD, MENUS } from './life.js';
import { workplaces, workplace } from './guild-core.js';
import { zones as jobZones } from './jobzones.js';
import { stations as cartStations, gates as cityGates, districtOf, districts, streets } from './citylayout.js';
import { docks } from './boats.js';
import { estates } from './mansions.js';
import { heavenLayout, HEAVEN, THIEN_THE } from './heaven.js';
import { VILLA_DISTRICT_NAME, STYLES, VILLA_STYLES } from './estate-layout.js';
import { fmt as fmtCoin } from './coins.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const km = (d) => (d < 1000 ? `${Math.round(d)} m` : `${(d / 1000).toFixed(1)} km`);
const price = (p) => [p.xu ? fmtCoin(p.xu) : '', p.ngoc ? `${p.ngoc.toLocaleString('vi-VN')} Ngọc` : ''].filter(Boolean).join(' · ');
const WALK = 260;
const SHOP_IC = { moc: '🪚', gom: '🏺', den: '🏮', thuhoa: '🖌', hoavien: '🌸', phongthuy: '🧭', huong: '🪔', tratrang: '🍃', duoc: '🌿', loren: '🔨', tuu: '🍲', tralau: '🍵', dichtram: '🐎', namon: '📜', tientrang: '💰', may: '🧵' };

export const TABS = [
  { id: 'home', icon: '🏠', name: 'Nhà tôi' },
  { id: 'sleep', icon: '🛏', name: 'Ngủ nghỉ' },
  { id: 'eat', icon: '🍚', name: 'Ăn uống' },
  { id: 'work', icon: '💼', name: 'Làm việc' },
  { id: 'estate', icon: '🏡', name: 'Nhà đất' },
  { id: 'spirit', icon: '☯', name: 'Xem bói · tâm linh' },
  { id: 'shop', icon: '🛒', name: 'Mua sắm' },
  { id: 'travel', icon: '🐎', name: 'Đi lại' },
];

// --- tra cứu gần nhất (dữ liệu thành dựng một lần) -----------------------------------------------------------
let SHOPS = null;
const shopsOf = (type) => { if (!SHOPS) { SHOPS = new Map(); for (const e of enterables()) if (e.kind === 'shop' && e.shop) (SHOPS.get(e.shop.type) || SHOPS.set(e.shop.type, []).get(e.shop.type)).push(e); } return SHOPS.get(type) || []; };
let ST = null; const streetOf = (e) => { ST ||= streets(); const k = e.shop?.house?.street; return (k && ST.get(k)?.name) || ''; };
const kindOf = (k) => enterables().filter((e) => e.kind === k);
const nearest = (list, me, n, pos = (o) => o) => list.map((o) => { const p = pos(o); return { o, p, d: Math.hypot(p.x - me.x, p.z - me.z) }; }).sort((a, b) => a.d - b.d).slice(0, n);
const area = (x, z) => { if (Math.abs(x - HEAVEN.cx) < HEAVEN.half && Math.abs(z - HEAVEN.cz) < HEAVEN.half) return HEAVEN.name; const d = districtOf(x, z), id = typeof d === 'string' ? d : d?.id; return d?.name || districts().find((q) => q.id === id)?.name || ''; };

/**
 * Các dòng của một thẻ. Dòng: { ic, name, sub, x, z, free?, label?, sub2?, st? (trạm cũ → teleport), act?, head? }
 * ctx: { me(), own, homeSpot(), estateInfo(h), contract, stations, icon, deskDone(id), level }
 */
export function rowsOf(tab, ctx) {
  const me = ctx.me(), R = [];
  const head = (t) => R.push({ head: t });
  const row = (o) => R.push(o);
  // tên tiệm trùng nhiều nơi («Hồng Vân Tửu Lâu») → ghi thêm tên phố để phân biệt
  const shopRow = (e, sub = '') => ({ ic: SHOP_IC[e.shop.type] || '🏪', name: e.name, sub: [streetOf(e), sub, area(e.door.x, e.door.z)].filter(Boolean).join(' · '), x: e.door.x, z: e.door.z });
  const ownL = ctx.own ? E.listing(ctx.own.h) : null;
  if (tab === 'home') {
    if (!ownL) { row({ ic: '🏚', name: 'Bạn chưa có nhà', sub: 'Xem thẻ «Nhà đất»: biệt phủ, biệt thự, nhà phố, tiên phủ Cửu Trọng Thiên.', tab: 'estate' }); return R; }
    const hs = ctx.homeSpot();
    row({ ic: ownL.tier === 'tienphu' ? '☁' : E.isPhu(ownL) ? '🏯' : '🏡', name: `Về ${ownL.name}`, sub: `${E.TIERS[ownL.tier].name} · ${ownL.style || ''} · ${area(ownL.house.door.x, ownL.house.door.z)} · miễn phí`, x: hs?.x ?? ownL.house.door.x, z: hs?.z ?? ownL.house.door.z, free: true, label: `🏡 Về ${ownL.name}` });
    row({ ic: '🪑', name: 'Bài trí nhà', sub: E.isPhu(ownL) ? 'Từng gian, từng khoảnh vườn' : 'Đồ đạc trong phòng', act: 'edit' });
    row({ ic: '🛏', name: 'Ngủ ở nhà', sub: `Tỉnh +${(E.isPhu(ownL) ? LODGING.villa : LODGING.house).wake}/giờ — về nhà rồi thoát game cũng tính ngủ ở nhà`, x: hs?.x ?? ownL.house.door.x, z: hs?.z ?? ownL.house.door.z, free: true, label: `🏡 Về ${ownL.name}` });
    return R;
  }
  if (tab === 'sleep') {
    if (ownL) { const hs = ctx.homeSpot(); row({ ic: '🏡', name: ownL.name, sub: `Nhà riêng · Tỉnh +${(E.isPhu(ownL) ? LODGING.villa : LODGING.house).wake}/giờ · miễn phí`, x: hs?.x ?? ownL.house.door.x, z: hs?.z ?? ownL.house.door.z, free: true, label: `🏡 Về ${ownL.name}` }); }
    const dorm = LP.spotById('dorm');
    row({ ic: '🛏', name: dorm.name, sub: `${LODGING.dorm.name} ${LODGING.dorm.price} đồng (Tỉnh +${LODGING.dorm.wake}/giờ) · ${LODGING.room.name} ${LODGING.room.price} đồng (+${LODGING.room.wake}/giờ)`, x: dorm.x, z: dorm.z });
    if (!ownL) row({ ic: '🏡', name: 'Mua nhà để có chỗ ngủ riêng', sub: `Nhà riêng Tỉnh +${LODGING.house.wake}/giờ · biệt thự, biệt phủ, tiên phủ +${LODGING.villa.wake}/giờ, thêm Khí huyết`, tab: 'estate' });
    row({ ic: '🌙', name: LODGING.street.name, sub: `Tỉnh +${LODGING.street.wake}/giờ · dễ ốm, dễ bị móc túi — tránh nếu được`, info: true });
    return R;
  }
  if (tab === 'eat') {
    const menu = (k) => (MENUS[k] || []).map((f) => FOOD[f]?.name).filter(Boolean).join(', ');
    head('Quanh Sơn Môn');
    for (const id of ['stall', 'tavern']) { const s = LP.spotById(id); row({ ic: id === 'stall' ? '🍚' : '🍲', name: s.name, sub: menu(s.menu), x: s.x, z: s.z }); }
    for (const [type, n] of [['tuu', 4], ['tralau', 4], ['tratrang', 3]]) {
      head(`${SHOP_TYPES[type].name} gần nhất`);
      const tav = LP.spotById('tavern'); // Hỏa Vân Tửu Lâu đã có ở nhóm Sơn Môn
      for (const { o } of nearest(shopsOf(type).filter((e) => Math.hypot(e.door.x - tav.x, e.door.z - tav.z) > 8), me, n, (e) => e.door)) row(shopRow(o, menu(type)));
    }
    return R;
  }
  if (tab === 'work') {
    const c = ctx.contract, w = c ? workplace(c.k) : null;
    if (w?.city) { head('Chỗ làm của bạn'); row({ ic: J.WORK[w.job]?.icon || '💼', name: w.name, sub: `${J.WORK[w.job]?.name || ''} · ${J.RANKS[c.r]?.name || ''} · ${area(w.city.x, w.city.z)}`, x: w.city.x, z: w.city.z }); }
    head('Không cần xin việc');
    const well = LP.spotById('well'); row({ ic: '🪣', name: well.name, sub: 'Gánh nước về Quầy cơm Sơn Môn — làm được cả khi mất mạng', x: well.x, z: well.z });
    const Z = jobZones();
    for (const [id, z] of Object.entries(Z)) {
      const job = J.WORK[id]; if (!job) continue;
      let best = z.spots?.length ? nearest(z.spots, me, 1)[0] : null;
      if (!best && z.rooms) { const s = nearest(z.rooms.flatMap((t) => shopsOf(t)), me, 1, (e) => e.door)[0]; if (s) best = { o: { name: s.o.name }, p: s.p, d: s.d }; }
      if (best) row({ ic: job.icon, name: job.name, sub: `${best.o.name || ''} · ${area(best.p.x, best.p.z)}`, x: best.p.x, z: best.p.z });
    }
    head('Xin việc ở tiệm (gần nhất mỗi nghề — giữ chỗ, có bậc tay nghề)');
    const byJob = new Map();
    for (const wp of workplaces().values()) { if (!wp.city || !wp.job) continue; const d = Math.hypot(wp.city.x - me.x, wp.city.z - me.z); const b = byJob.get(wp.job); if (!b || d < b.d) byJob.set(wp.job, { wp, d }); }
    for (const { wp } of [...byJob.values()].sort((a, b) => a.d - b.d)) row({ ic: J.WORK[wp.job]?.icon || '💼', name: J.WORK[wp.job]?.name || wp.job, sub: `${wp.name} · ${area(wp.city.x, wp.city.z)}${wp.type === J.MINE_SHOP ? ' · vào Mỏ Khoáng Sơn từ đây' : ''}`, x: wp.city.x, z: wp.city.z });
    return R;
  }
  if (tab === 'estate') {
    const status = (l) => { if (ctx.own?.h === l.h) return '🏡 Nhà của bạn'; const i = ctx.estateInfo(l.h); if (i) return `Đã có chủ: ${i.name}`; const alt = E.altPriceOf(l); return `Giá ${price(E.priceOf(l))}${alt ? ` hoặc ${price(alt)}` : ''}`; };
    const H = heavenLayout(), L = E.listings();
    head('☁ Cửu Trọng Thiên — 9 tiên phủ trên đảo trời');
    row({ ic: '☁', name: 'Thăng thiên tới Nam Thiên Môn', sub: 'Chín đảo trời trên biển mây · miễn phí', x: H.arrive.x, z: H.arrive.z, free: true, label: '☁ Thăng thiên — Cửu Trọng Thiên', sub2: 'Mây trắng nâng gót, Nam Thiên Môn hiện dần…' });
    for (const l of L.filter((q) => q.tier === 'tienphu')) row({ ic: '🏯', name: l.name, sub: `${l.W}×${l.D} m · ${l.style} · ${status(l)}`, x: l.house.door.x, z: l.house.door.z, free: true, label: `☁ ${l.name}`, sub2: 'Cưỡi mây tới cổng phủ…' });
    head('🏯 Biệt phủ Ngoại Thành (16)');
    for (const { o: l, d } of nearest(L.filter((q) => q.tier === 'bietphu'), me, 16, (q) => q.house.door)) row({ ic: '🏯', name: l.name, sub: `${l.W}×${l.D} m · ${l.style} · ${area(l.house.door.x, l.house.door.z)} · ${km(d)} · ${status(l)}`, x: l.house.door.x, z: l.house.door.z });
    head('🏡 Khu biệt thự (8 khu × 30 căn)');
    const V = estates().filter((m) => m.kind === 'villa');
    for (let di = 0; di < VILLA_DISTRICT_NAME.length; di++) {
      const vs = V.filter((m) => m.district === di); if (!vs.length) continue;
      const free = vs.filter((m) => !ctx.estateInfo(m.h) && ctx.own?.h !== m.h).length, cx = vs.reduce((s, m) => s + m.gate.x, 0) / vs.length, cz = vs.reduce((s, m) => s + m.gate.z, 0) / vs.length;
      const first = vs.slice().sort((a, b) => Math.hypot(a.gate.x - cx, a.gate.z - cz) - Math.hypot(b.gate.x - cx, b.gate.z - cz))[0];
      row({ ic: '🏡', name: VILLA_DISTRICT_NAME[di], sub: `${STYLES[VILLA_STYLES[di]].name} · còn ${free}/${vs.length} căn · giá ${price(E.TIERS.bietthu.price)} · ${area(first.gate.x, first.gate.z)}`, x: first.gate.x, z: first.gate.z });
    }
    head('🏠 Nhà phố rao bán (gần nhất)');
    for (const { o: l, d } of nearest(L.filter((q) => !E.isPhu(q)), me, 10, (q) => q.house.door)) row({ ic: '🏠', name: l.name, sub: `${E.roomOf(l).w}×${E.roomOf(l).d} m · ${area(l.house.door.x, l.house.door.z)} · ${km(d)} · ${status(l)}`, x: l.house.door.x, z: l.house.door.z });
    head('📜 Mua bán, sang tên');
    for (const { o } of nearest(shopsOf('namon'), me, 2, (e) => e.door)) row(shopRow(o, 'sổ nhà đất đầy đủ, bán lại nhà'));
    return R;
  }
  if (tab === 'spirit') {
    const grp = (label, list) => { if (!list.length) return; head(label); for (const st of list) row({ ic: ctx.icon[st.id] || '✦', name: st.name, sub: `${st.verb}${st.kind === 'desk' && ctx.deskDone(st.id) ? ' ✓' : ''}`, st }); };
    grp('Trong quán', ctx.stations.filter((st) => !st.world));
    grp('Sảnh nghề (mỗi sảnh 1 khách / ngày)', ctx.stations.filter((st) => st.world && st.kind === 'desk' && !st.room));
    grp('Điện thờ', ctx.stations.filter((st) => st.kind === 'door' || st.id === 'que'));
    head('Miếu gần nhất');
    for (const { o } of nearest(kindOf('temple'), me, 4, (e) => e.door)) row({ ic: '⛩', name: o.name, sub: area(o.door.x, o.door.z), x: o.door.x, z: o.door.z });
    head('Quầy thầy bói gần nhất');
    for (const { o } of nearest(kindOf('fortune'), me, 3, (e) => e.door)) row({ ic: '🔮', name: o.name, sub: area(o.door.x, o.door.z), x: o.door.x, z: o.door.z });
    return R;
  }
  if (tab === 'shop') {
    for (const type of Object.keys(SHOP_TYPES)) { const n = nearest(shopsOf(type), me, 1, (e) => e.door)[0]; if (n) row(shopRow(n.o, `cách ${km(n.d)}`)); }
    R.sort((a, b) => Math.hypot(a.x - me.x, a.z - me.z) - Math.hypot(b.x - me.x, b.z - me.z));
    return R;
  }
  if (tab === 'travel') {
    head('Trạm xe ngựa gần nhất');
    for (const { o } of nearest(cartStations(), me, 4)) row({ ic: '🐎', name: o.name, sub: area(o.x, o.z), x: o.x, z: o.z });
    head('Bến thuyền gần nhất');
    for (const { o } of nearest(docks(), me, 3)) row({ ic: '⚓', name: o.name, sub: area(o.x, o.z), x: o.x, z: o.z });
    head('Cổng thành');
    for (const g of cityGates()) row({ ic: '🚪', name: `Cổng ${g.name}`, sub: area(g.x, g.z), x: g.x - g.ax * 45, z: g.z - g.az * 45 }); // đứng trong thành trước cổng (lòng cổng sâu ~38 m — 6 m là kẹt giữa đường hầm)
    head('Nơi đặc biệt');
    row({ ic: '⛰', name: 'Sơn Môn', sub: 'Sân trước Chính Điện Tam Thanh', home: true, free: false });
    row({ ic: '🪜', name: 'Thiên Thê', sub: 'Thang mây ngoài tường Đông Sơn Môn — lối đi bộ lên Cửu Trọng Thiên', x: THIEN_THE.x, z: THIEN_THE.z + 6 });
    const H = heavenLayout(); row({ ic: '☁', name: HEAVEN.name, sub: 'Nam Thiên Môn · 9 tiên phủ · miễn phí', x: H.arrive.x, z: H.arrive.z, free: true, label: '☁ Thăng thiên — Cửu Trọng Thiên', sub2: 'Mây trắng nâng gót, Nam Thiên Môn hiện dần…' });
    return R;
  }
  return R;
}

/**
 * Thân bảng «Địa điểm». ctx thêm: go(row) → bool (đi tới dòng: trạm cũ / đi bộ / xe / miễn phí), editHome(), tab
 */
export function placesBody(ctx) {
  const root = document.createElement('div'); root.className = 'hq-places';
  root.innerHTML = `<input class="hq-input" type="search" placeholder="Tìm nơi: ăn, ngủ, rượu, thuốc, biệt phủ, Cửu Trọng Thiên…" autocomplete="off">
    <div class="hq-tabs" role="tablist">${TABS.map((t) => `<button type="button" class="hq-tab" role="tab" data-t="${t.id}">${t.icon} ${esc(t.name)}</button>`).join('')}</div>
    <div class="hq-list hq-places-list"></div>`;
  const inp = root.querySelector('input'), list = root.querySelector('.hq-places-list');
  let tab = ctx.tab || (ctx.own ? 'home' : 'eat');
  const me = ctx.me();
  const render = () => {
    root.querySelectorAll('[data-t]').forEach((b) => b.classList.toggle('on', b.dataset.t === tab && !inp.value.trim()));
    const q = norm(inp.value).trim();
    let rows;
    if (q.length >= 2) { rows = []; for (const t of TABS) for (const r of rowsOf(t.id, ctx)) if (!r.head && norm(`${r.name} ${r.sub}`).includes(q)) rows.push({ ...r, sub: `${t.icon} ${t.name} · ${r.sub}` }); rows = rows.slice(0, 40); if (!rows.length) rows = [{ head: 'Không thấy nơi nào khớp.' }]; }
    else rows = rowsOf(tab, ctx);
    list.innerHTML = '';
    for (const r of rows) {
      if (r.head) { const h = document.createElement('h4'); h.textContent = r.head; list.appendChild(h); continue; }
      const b = document.createElement('button'); b.type = 'button'; b.className = 'hq-btn hq-row hq-place';
      const d = r.x != null ? Math.hypot(r.x - me.x, r.z - me.z) : null;
      const how = r.st ? '' : r.info ? '' : r.tab ? 'Xem' : r.act ? 'Mở' : r.free ? 'Đi · miễn phí' : d != null && d < WALK ? `🚶 ${km(d)}` : r.home ? '🐎 Xe' : d != null ? `🐎 ${km(d)}` : '';
      b.innerHTML = `<span class="hq-place-ic">${r.ic || '•'}</span><span class="hq-place-tx"><b>${esc(r.name)}</b><small>${esc(r.sub || '')}</small></span>${how ? `<span class="hq-place-go">${esc(how)}</span>` : ''}`;
      if (r.info) b.disabled = true;
      b.onclick = () => { if (r.tab) { tab = r.tab; inp.value = ''; render(); return; } ctx.go(r); };
      list.appendChild(b);
    }
  };
  root.querySelectorAll('[data-t]').forEach((b) => { b.onclick = () => { tab = b.dataset.t; inp.value = ''; render(); list.scrollTop = 0; }; });
  inp.oninput = render;
  render();
  return root;
}
