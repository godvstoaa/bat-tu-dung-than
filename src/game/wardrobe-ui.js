// ============================================================================
//  TÀNG Y CÁC — bảng cửa hàng + tủ đồ (cosmetics.js). Mở từ nút «Y Các» hoặc quầy Thợ May trong sân.
//  api (main.js): state, after, toast, vip(), level(), yong(), previewCos(slot, id), cosChanged()
// ============================================================================
import * as C from './cosmetics.js';
import { fmt as fmtCoin } from './coins.js';
import { walletXu } from './life.js';
import { WX_VI } from '../engine/constants.js';
import { IOS } from './features.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const hsl = ([h, s, v]) => { const l = v * (1 - s / 2); const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l); return `hsl(${Math.round(h * 360)} ${Math.round(sl * 100)}% ${Math.round(l * 100)}%)`; };
const ICON = {
  head: { tram_go: '🥢', dao_quan: '👑', quan_la: '🌿', kim_quan: '🪶', dau_lap: '👒', tram_ngoc: '💠', quan_sen: '🪷' },
  back: { kiem_go: '🗡️', kiem_moc: '🎋', ho_lo: '🏺', kiem_bao: '⚔️', o_giay: '⛱️', canh_phuong: '🔥', canh_hac: '🕊️', phap_luan: '☸️' },
  hand: { quat_giay: '🪭', phat_tran: '🪶', den_long_tay: '🏮', la_ban_tay: '🧭', quat_long: '🪽' },
  aura: { aura_menh: '✨', aura_dao: '🌸', aura_lua: '🔥', aura_batquai: '☯️', aura_set: '⚡', aura_tuyet: '❄️', aura_sen: '🪷' },
  trail: { trail_menh: '✨', trail_may: '☁️', trail_sen: '🌸', trail_lua: '🔥', trail_bang: '🧊', trail_sao: '🌌' },
  mount: { kiem: '🗡️', may: '☁️', ho_lo_bay: '🏺', dai_sen: '🪷', hac: '🕊️', duc: '🪽' },
  frame: { khung_tron: '▭', khung_may: '☁️', khung_sen: '🪷', khung_ngoc: '💠', khung_long: '🐉' },
};
const priceTxt = (p) => (p?.ngoc ? `💎 ${p.ngoc}` : p?.xu ? `💰 ${fmtCoin(p.xu)}` : '');

export function wardrobeBody(api) {
  const s = api.state; C.wardrobe(s);
  let tab = 'sets';
  const root = el(`<div class="hq-yc">
    <div class="hq-yc-head" data-role="head"></div>
    <div class="hq-tabs hq-yc-tabs" role="tablist">
      <button class="hq-tab" data-k="sets" type="button">🀄 Bộ</button>
      ${C.SLOTS.map((x) => `<button class="hq-tab" data-k="${x.id}" type="button">${x.icon} ${esc(x.name)}</button>`).join('')}
      <button class="hq-tab" data-k="vip" type="button">👑 VIP</button>
    </div>
    <div data-role="body"></div>
  </div>`);
  const $ = (r) => root.querySelector(`[data-role=${r}]`);
  const ctx = () => ({ vip: api.vip(), level: api.level() });

  function head() {
    const w = C.wardrobe(s), today = C.checkedIn(s), st = w.checkin.streak || 0;
    const day = today ? ((st - 1) % 7) + 1 : (st % 7) + 1;
    $('head').innerHTML = `<div class="hq-yc-bal"><span>💰 ${fmtCoin(walletXu(s))}</span><span>💎 ${w.ngoc} Ngọc</span><span>${api.vip() ? '👑 Chân Nhân' : 'Chưa VIP'}</span></div>
      <div class="hq-yc-checkin">${C.CHECKIN.map((n, i) => `<span class="${i < (today ? day : day - 1) ? 'got' : ''}${i === day - 1 && !today ? ' next' : ''}">N${i + 1}</span>`).join('')}</div>
      <p class="hq-note">Điểm danh giữ chuỗi ngày (mở vài món theo chuỗi) — không còn tặng Ngọc. Ngọc chỉ có khi nạp.</p>
      <div class="hq-actions"><button class="hq-btn hq-primary" data-a="ci" type="button" ${today ? 'disabled' : ''}>${today ? `Đã điểm danh ✓ · chuỗi ${st} ngày` : '📅 Điểm danh giữ chuỗi'}</button>
      ${IOS ? '' : '<button class="hq-btn" data-a="nap" type="button">💎 Nạp Ngọc</button>'}</div>`;
    const ci = $('head').querySelector('[data-a=ci]');
    if (ci && !today) ci.onclick = () => { const r = C.checkin(s); if (r.ok) { api.toast(`Điểm danh ngày ${r.day}/7 · chuỗi ${r.streak} ngày`); api.after(0); } head(); body(); };
    const nap = $('head').querySelector('[data-a=nap]');
    if (nap) nap.onclick = () => { tab = 'vip'; tabs(); body(); };
  }

  function card(it) {
    const w = C.wardrobe(s), owned = w.owned.includes(it.id), on = w.equipped[it.slot] === it.id;
    const R = C.RARITY[it.rarity];
    const sw = it.look ? `<i class="hq-yc-sw" style="background:linear-gradient(135deg,${hsl(it.look.pri)} 60%,${hsl(it.look.acc)} 60%)"></i>` : `<i class="hq-yc-ic">${ICON[it.slot]?.[it.id] || C.SLOTS.find((x) => x.id === it.slot).icon}</i>`;
    const c = owned ? { ok: true } : C.canBuy(s, it.id, ctx());
    const u = it.unlock || {};
    const lock = [u.vip ? 'VIP' : '', u.level ? `cấp ${u.level}` : '', u.streak ? `điểm danh ${u.streak} ngày` : ''].filter(Boolean).join(' · ');
    const node = el(`<div class="hq-yc-card r${it.rarity}${on ? ' on' : ''}" style="--rc:${R.color}">
      ${sw}<div><b>${esc(it.name)}</b> <small class="hq-yc-r">${R.name}</small>${it.set ? ` <small class="hq-yc-set">bộ ${esc(C.SETS.find((x) => x.id === it.set).name)}</small>` : ''}
      <p>${esc(it.desc)}</p>${lock && !owned ? `<p class="hq-yc-lock">🔒 ${esc(lock)}</p>` : ''}</div>
      <div class="hq-yc-act"></div></div>`);
    const act = node.querySelector('.hq-yc-act');
    if (owned) {
      if (on) act.innerHTML = `<span class="hq-yc-on">Đang mặc ✓</span>${C.DEFAULT_EQUIP[it.slot] !== it.id ? '<button class="hq-btn" data-a="off" type="button">Tháo</button>' : ''}`;
      else act.innerHTML = '<button class="hq-btn hq-primary" data-a="on" type="button">Mặc</button>';
    } else {
      act.innerHTML = `<button class="hq-btn hq-primary" data-a="buy" type="button" ${c.ok ? '' : 'disabled'} title="${esc(c.reason || '')}">${priceTxt(it.price)}</button>
        <button class="hq-btn" data-a="try" type="button">Thử 20s</button>${c.ok ? '' : `<small class="hq-yc-why">${esc(c.reason)}</small>`}`;
    }
    act.querySelector('[data-a=on]')?.addEventListener('click', () => { C.equip(s, it.id, api.yong()); api.cosChanged(); refresh(); });
    act.querySelector('[data-a=off]')?.addEventListener('click', () => { C.unequip(s, it.slot, api.yong()); api.cosChanged(); refresh(); });
    act.querySelector('[data-a=try]')?.addEventListener('click', () => { api.previewCos(it.slot, it.id); api.toast(`Đang thử «${it.name}» 20 giây — xem nhân vật ngoài cảnh`); });
    act.querySelector('[data-a=buy]')?.addEventListener('click', () => {
      const r = C.buy(s, it.id, ctx());
      if (!r.ok) { api.toast(r.reason); return; }
      C.equip(s, it.id, api.yong()); api.cosChanged(); api.toast(`Đã thỉnh «${it.name}» · đang mặc`); api.after(0); refresh();
    });
    return node;
  }

  function setsView() {
    const box = el('<div class="hq-yc-sets"></div>');
    const yong = api.yong(); const b = C.setBonus(s, yong);
    box.append(el(`<p class="hq-sub">Mặc đủ 4 món một bộ → hiệu ứng bộ. Bộ trùng Dụng thần của bạn (${esc(WX_VI[yong] || '?')}) được <b>Hợp mệnh</b>: +${Math.round(C.SET_BONUS * 100)}% Phúc Khí khi giải án và ở sảnh nghề.${b.set ? ` Đang mặc đủ bộ <b>${esc(b.set.name)}</b>${b.matched ? ' · <b class="hq-yc-match">Hợp mệnh ✓</b>' : ''}.` : ''}</p>`));
    for (const st of C.SETS) {
      const w = C.wardrobe(s), own = st.pieces.filter((p) => w.owned.includes(p)).length, wear = b.count(st);
      const cost = st.pieces.filter((p) => !w.owned.includes(p)).reduce((a, p) => a + (C.ITEM[p].price?.ngoc || 0), 0);
      const n = el(`<div class="hq-yc-setcard${st.wx === yong ? ' match' : ''}">
        <div class="hq-yc-setic">${st.pieces.map((p) => { const it = C.ITEM[p]; return it.look ? `<i class="hq-yc-sw" style="background:linear-gradient(135deg,${hsl(it.look.pri)} 60%,${hsl(it.look.acc)} 60%)"></i>` : `<i class="hq-yc-ic">${ICON[it.slot]?.[p] || '✦'}</i>`; }).join('')}</div>
        <div><b>${esc(st.name)}</b> <small>hành ${esc(WX_VI[st.wx])}</small>${st.wx === yong ? ' <small class="hq-yc-match">Hợp mệnh của bạn</small>' : ''}
        <p>Có ${own}/4 · đang mặc ${wear}/4${cost ? ` · thiếu 💎 ${cost}` : ''}</p></div>
        <div class="hq-yc-act"><button class="hq-btn hq-primary" type="button" ${own === 4 ? '' : 'disabled'}>${wear === 4 ? 'Đang mặc ✓' : 'Mặc cả bộ'}</button></div></div>`);
      const btn = n.querySelector('button');
      if (own === 4 && wear < 4) btn.onclick = () => { for (const p of st.pieces) C.equip(s, p, yong); api.cosChanged(); api.toast(`Đã mặc bộ ${st.name}${st.wx === yong ? ' · Hợp mệnh +10%' : ''}`); refresh(); };
      n.onclick = (e) => { if (e.target.closest('button')) return; tab = C.ITEM[st.pieces[0]].slot; tabs(); body(); };
      box.append(n);
    }
    return box;
  }

  function vipView() {
    const v = api.vip();
    const n = el(`<div class="hq-yc-vip">
      <h4>👑 Chân Nhân (VIP)</h4>
      <ul class="hq-plain">
        <li>🗡️ Ngự kiếm phi hành ngay, không chờ cấp 8</li>
        <li>✨ Mở sớm hào quang, linh khí, vệt bước</li>
        <li>👘 Đồ độc quyền: Tử Y Chân Nhân, Liên Hoa Quan, Bát Quái Pháp Luân, Tiên Hạc</li>
      </ul>
      <p>${v ? 'Bạn đang là Chân Nhân. Đa tạ đã ủng hộ quán.' : 'Bạn chưa là Chân Nhân.'}</p>
      ${IOS ? '' : '<h4>💎 Nạp Ngọc</h4><div class="hq-yc-packs">' + [[60, '22.000đ'], [330, '109.000đ'], [700, '219.000đ'], [1600, '449.000đ']].map(([g, p]) => `<button class="hq-btn" type="button" disabled>💎 ${g}<br><small>${p}</small></button>`).join('') + '</div><p class="hq-note">Cổng thanh toán đang được chuẩn bị — mở sẽ báo trong quán. Hiện Ngọc nhận qua điểm danh, lên cấp và VIP.</p>'}
    </div>`);
    return n;
  }

  function tabs() { root.querySelectorAll('.hq-yc-tabs .hq-tab').forEach((b) => b.classList.toggle('on', b.dataset.k === tab)); }
  function body() {
    const b = $('body'); b.innerHTML = '';
    if (tab === 'sets') b.append(setsView());
    else if (tab === 'vip') b.append(vipView());
    else { const g = el('<div class="hq-yc-grid"></div>'); for (const it of C.ITEMS.filter((x) => x.slot === tab).sort((a, c) => a.rarity - c.rarity)) g.append(card(it)); b.append(g); }
  }
  function refresh() { head(); body(); }
  root.querySelector('.hq-yc-tabs').addEventListener('click', (e) => { const b = e.target.closest('.hq-tab'); if (!b) return; tab = b.dataset.k; tabs(); body(); });
  tabs(); refresh();
  return root;
}
