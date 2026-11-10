// ============================================================================
//  GIAO DIỆN SINH TỒN — bảng chỉ số, thực đơn (quầy cơm / tửu lâu / trà lâu), liêu xá (thuê, ngủ), màn ngủ.
//  Luật thuần: life.js · việc làm: jobs.js.
// ============================================================================
import * as LIFE from './life.js';
import * as J from './jobs.js';
import * as COIN from './coins.js';
import * as ILL from './illness.js';
import * as VE from './vehicles.js';
import * as AD from './amduc.js';
import * as HH from './huyenhoc.js';
import * as RL from './realm.js';
import { levelOf } from './progress.js';
import { esc } from './stations.js';

const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const bar = (label, v, cls) => `<div class="hq-vbar ${cls}"><span>${label}</span><i style="--v:${Math.round(v)}%"></i><b>${Math.round(v)}</b></div>`;
const WX_VI = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
/** số tiền tính bằng ĐỒNG (= văn cũ) → «3 lượng bạc 600 đồng» (P18, coins.js) */
export const fmtVan = (v) => COIN.fmt(COIN.fromDong(v));

export function vitalsBody(api, L) {
  const w = LIFE.warnings(L), m = LIFE.mods(L), yong = api.state.player?.yong;
  const rel = J.relation(J.JOBS.ganhnuoc.wx, yong);
  const ill = L.ill, II = ill ? ILL.ILLS[ill.id] : null;
  const root = el(`<div class="hq-life">
    ${bar('🍚 No', L.full, 'full')}${bar('🌙 Tỉnh', L.wake, 'wake')}${bar('❤ Khí huyết', L.hp, 'hp')}
    <p class="hq-life-van">💰 <b>${COIN.fmt(L.xu)}</b>${L.bank ? ` · gửi Tiền Trang ${COIN.fmt(L.bank)}` : ''}${L.debt ? ` · nợ ${fmtVan(L.debt)}` : ''} · bậc ${LIFE.tierOf(LIFE.wealthDong(L))} · thuế thân ${LIFE.taxFor(LIFE.wealthDong(L))} đồng/ngày</p>
    ${(() => { const A = AD.adState(L), t = AD.tier(L), dp = AD.dayProgress(L); return `<p class="hq-life-van">☯ Âm Đức <b>${A.score}</b> · chuỗi điều độ ${A.streak} ngày · ${t ? `<b>${AD.TIERS[t].name}</b> (${AD.TIERS[t].text})` : A.paused ? `vận khí tạm ngừng (còn ${A.paused.need} ngày điều độ)` : 'chưa có vận khí'}${A.saveReady ? ' · còn một lượt thoát chết' : ''}</p>${dp ? `<p class="hq-note">Hôm nay: chơi ${Math.floor(dp.minutes)}/20 phút · ăn ${dp.meals}/2 bữa · ${dp.slept ? 'đã ngủ đúng chỗ' : 'chưa ngủ đúng chỗ'}${dp.ok ? ' — đủ ngày điều độ ✓' : ''}${A.que ? ` · quẻ ${A.que.label} (${A.que.score})` : ''}</p>` : ''}`; })()}
    ${ill ? `<p class="hq-warn">🤒 ${esc(II.name)}${ill.sev ? ' nặng' : ' nhẹ'} (${esc(II.note)})${ill.cureAt ? ` — đã uống thuốc, còn ${Math.max(1, Math.ceil((ill.cureAt - Date.now()) / 60000))} phút` : ' — đi chậm 50%, làm việc −70%, đói mệt nhanh gấp đôi. Chữa ở Dược Phòng (nhẹ) hoặc Y Quán.'}</p>` : ''}
    ${L.debt ? `<div class="hq-actions"><span class="hq-note">Nợ ${L.debt} đồng · lãi 2%/ngày · quá 1 lượng 7 ngày thì khổ sai trừ nợ</span><button class="hq-btn" type="button" data-repay>Trả nợ</button></div>` : ''}
    ${w.length ? `<p class="hq-warn">Đang ${w.join(', ')}. ${L.full < 20 ? 'Đi ăn ngay — đói lâu thì Khí huyết tụt. ' : ''}${L.wake < 20 ? 'Cần ngủ — thức lâu thì Khí huyết tụt. ' : ''}${m.speed < 1 ? 'Đi chậm hơn bình thường.' : ''}</p>` : ''}
    <h4>Sống thế nào ở Huyền Thành</h4>
    <ul class="hq-life-tips">
      <li>Mỗi ngày tối thiểu: 3 bữa cơm (45 đồng) + nước (5) + giường chung liêu xá (30) ≈ <b>80 đồng</b>.</li>
      <li>Kiếm tiền bằng làm việc. Đang mở: <b>gánh nước</b> ở Giếng Đông (hành Thủy — với mệnh bạn là <b>${J.REL[rel].name}</b>: ${esc(J.REL[rel].note)}).</li>
      <li>Phúc Khí, Âm Đức và Ngọc không đổi ra tiền được. Thể lực chạy nhảy bị giới hạn bởi Tỉnh (tối đa ${m.staminaCap}).</li>
      <li>Khí huyết về 0 thì ngất, được khiêng về Y Quán — viện phí 300 đồng (thiếu thì ghi nợ). Ngủ bờ bụi, bơi đêm, đói mệt lâu dễ sinh bệnh; ăn đủ 3 bữa, mặc phẩm phục đúng Dụng thần thì ít ốm.</li>
      <li>Thoát game khi đang ở chỗ ngủ đã trả tiền = ngủ ngon; thoát giữa đường = ngủ bờ bụi (dễ bị móc túi).</li>
      ${yong?.primary ? `<li>Dụng thần của bạn: <b>${WX_VI[yong.primary]}</b>${yong.accent ? ` · Hỷ thần ${WX_VI[yong.accent]}` : ''}${yong.ji ? ` · Kỵ thần ${WX_VI[yong.ji]}` : ''} — nghề hợp Dụng thần ăn gấp đôi (mở thêm nghề ở bản sau).</li>` : ''}
    </ul>
  </div>`);
  // tủ đồ ăn: chỉ ăn được khi đang ở nhà riêng
  const pan = VE.pantry(L);
  if (pan.length) {
    const atHome = api.atHome?.();
    const pb = el(`<div><h4>🥡 Tủ đồ ăn ở nhà</h4><p class="hq-note">${atHome ? 'Đang ở nhà — bấm để ăn. Đồ quá 3 ngày đã ôi, ăn vào dễ ngộ độc.' : 'Về nhà mới lấy ra ăn được.'}</p><div class="hq-actions" data-pan></div></div>`);
    pan.forEach((it, i) => {
      const f = LIFE.FOOD[it.id]; if (!f) return;
      const old = Date.now() - it.at > VE.PANTRY_MS;
      const b = el(`<button class="hq-btn" type="button" ${atHome ? '' : 'disabled'}>${f.icon} ${esc(f.name)}${old ? ' (ôi)' : ''}</button>`);
      b.onclick = () => {
        const t = VE.takeOut(L, i); if (!t) return;
        L.full = Math.min(100, L.full + (f.full || 0)); L.wake = Math.min(100, L.wake + (f.wake || 0));
        if (t.spoiled) { const c = ILL.catchIll(L, 'ngodoc', Math.random() < 0.3 ? 1 : 0); api.toast(c ? '🤢 Đồ để lâu đã ôi — bị ngộ độc.' : 'Hơi chua… may không sao.'); } else api.toast(`${f.icon} Ăn ${f.name} ở nhà.`);
        api.save?.(); api.updateVitals?.(); root.replaceWith(vitalsBody(api, L));
      };
      pb.querySelector('[data-pan]').append(b);
    });
    root.querySelector('.hq-life-tips').before(pb);
  }
  // tu luyện (P20): cảnh giới, đột phá, pháp môn · Sổ Luân Hồi (P21)
  {
    const S0 = api.state, raw = api.rawLevel ? api.rawLevel() : levelOf(S0.xp || 0), R = RL.realmOf(S0, raw), idx = S0.realm?.idx | 0, cb = RL.canBreak(S0, L, raw, { reading: api.readingToday?.() });
    const yw = S0.player?.yong?.primary;
    const sec = el(`<div><h4>🧘 Tu luyện · ${esc(R.name)}</h4><p class="hq-life-van">Cấp ${Math.min(raw, R.max)}${raw > R.max ? ` (đã đủ cấp ${raw} — chưa đột phá nên dừng ở đỉnh ${esc(R.name)})` : ''} · Phúc Khí ${S0.phucKhi || 0}${S0.ascended ? ' · 🌟 Chân Nhân' : ''}</p>
      ${cb.next ? `<p class="hq-note">Đột phá ${esc(cb.next.name)}: ${cb.missing.length ? cb.missing.map(esc).join(' · ') : 'đủ điều kiện'}${cb.meditate ? ` · ngồi bồ đoàn tĩnh tọa ${cb.meditate} giây (đang ${Math.floor(api.meditated?.() || 0)})` : ''}${HH.ngLevel(L) >= 2 ? ' · ⚠ Nghiệp nặng: đột phá sẽ gặp tâm ma (mất 10% Phúc Khí)' : ''}</p><div class="hq-actions"><button class="hq-btn hq-primary" type="button" data-break>⚡ Đột phá</button></div>` : idx >= 6 && !S0.ascended ? '<div class="hq-actions"><button class="hq-btn hq-primary" type="button" data-ascend>🌟 Phi thăng</button></div>' : ''}
      <details><summary>Pháp môn (học bằng Phúc Khí, tầng sau gấp đôi, hợp mệnh rẻ 50%)</summary><div class="hq-yc-grid" data-phap></div></details>
      ${(L.lives || []).length ? `<details><summary>📜 Sổ Luân Hồi (${L.lives.length} kiếp)</summary><ul class="hq-life-tips">${L.lives.map((v) => `<li>Kiếp ${v.n}: ${esc(v.name || '')} · ${esc(v.realm || '')} · ${esc(v.cause || '')} → ${esc(v.path)}${v.score != null ? ` (cân ${v.score})` : ''}</li>`).join('')}</ul></details>` : ''}</div>`);
    for (const P of RL.PHAP) {
      const t = RL.phapTier(S0, P.id), c = RL.phapCost(S0, P.id, yw);
      const b = el(`<button class="hq-yc-card" type="button" ${c == null ? 'disabled' : ''}><span class="hq-food-t"><b>${esc(P.name)}</b> <small>${esc(P.branch)} · tầng ${t}/3</small><small>${esc(P.text)}${P.wx?.includes(yw) ? ' · hợp mệnh' : ''}</small></span><span class="hq-price">${c == null ? 'Tối đa' : `${c} PK`}</span></button>`);
      b.onclick = () => { const r = RL.learn(S0, P.id, { yongWx: yw, realmIdx: idx }); api.toast(r.ok ? `🧘 Học ${P.name} tầng ${r.tier} (−${r.cost} Phúc Khí).` : r.reason); if (r.ok) { api.save?.(); root.replaceWith(vitalsBody(api, L)); } };
      sec.querySelector('[data-phap]').append(b);
    }
    const bb = sec.querySelector('[data-break]');
    if (bb) bb.onclick = () => { const r = RL.breakthrough(S0, L, raw, { meditated: api.meditated?.() || 0, reading: api.readingToday?.() }); api.toast(r.ok ? `⚡ Đột phá thành công — bước vào ${r.realm.name}!` : r.tamma ? `😈 Tâm ma quấy nhiễu — đột phá thất bại, mất ${r.lost} Phúc Khí. Sám hối giảm Nghiệp rồi thử lại.` : `Chưa đột phá được: ${r.missing.join(' · ')}.`); api.save?.(); api.refreshHud?.(); root.replaceWith(vitalsBody(api, L)); };
    const ab = sec.querySelector('[data-ascend]');
    if (ab && HH.adLevel(L) >= 4 && HH.ngLevel(L) === 0) ab.onclick = () => { import('./luanhoi.js').then((LH) => { LH.ascend(S0, L); api.toast('🌟 Phi thăng — danh hiệu Chân Nhân vĩnh viễn, tên khắc Bia Đắc Đạo.'); api.save?.(); root.replaceWith(vitalsBody(api, L)); }); };
    else if (ab) ab.disabled = true;
    root.querySelector('.hq-life-tips').before(sec);
  }
  const rb = root.querySelector('[data-repay]');
  if (rb) rb.onclick = () => { const got = ILL.repay(L, Math.min(L.debt, L.van), (a) => LIFE.pay(L, a)); api.toast(got ? `Đã trả ${got} đồng nợ${L.debt ? ` · còn ${L.debt}` : ' · hết nợ'}.` : 'Không có tiền để trả.'); api.save?.(); api.updateVitals?.(); root.replaceWith(vitalsBody(api, L)); };
  return root;
}

const ERR = { money: 'Không đủ tiền.', full: 'No căng bụng rồi.', cap: 'Uống thế đủ rồi, để vài canh giờ nữa.', menu: 'Quán không có món này.' };
/** thực đơn theo nơi bán; onDone(food) sau khi ăn */
export function menuBody(api, L, menu, title, onDone) {
  const box = el('<div class="hq-life"></div>');
  const render = () => {
    box.replaceChildren(el(`<div>${bar('🍚 No', L.full, 'full')}${bar('🌙 Tỉnh', L.wake, 'wake')}<p class="hq-life-van">💰 ${COIN.fmt(L.xu)}</p></div>`));
    const grid = el('<div class="hq-yc-grid"></div>');
    for (const id of LIFE.MENUS[menu] || []) {
      const f = LIFE.FOOD[id];
      const eff = [f.full ? `No +${f.full}` : '', f.wake ? `Tỉnh ${f.wake > 0 ? '+' : ''}${f.wake}` : '', f.hp ? `Khí huyết +${f.hp}` : ''].filter(Boolean).join(' · ');
      const c = el(`<button class="hq-yc-card hq-food" type="button"><span class="hq-food-i">${f.icon}</span><span class="hq-food-t"><b>${esc(f.name)}</b><small>${eff}</small></span><span class="hq-price">${f.price} đồng</span></button>`);
      c.disabled = L.van < f.price;
      c.onclick = () => { const r = LIFE.eat(L, id, menu); if (!r.ok) { api.toast(ERR[r.err]); return; } onDone(f); render(); };
      grid.append(c);
    }
    box.append(grid);
    // mua mang về tủ đồ ăn ở nhà (P4): giữ 3 ngày, quá hạn thì ôi — ăn vào dễ ngộ độc
    if (api.hasHome?.()) {
      const tk = el(`<div class="hq-actions"><span class="hq-note">🥡 Mang về tủ đồ ăn (${VE.pantry(L).length}/${VE.PANTRY_MAX}, giữ 3 ngày):</span></div>`);
      for (const id of LIFE.MENUS[menu] || []) {
        const f = LIFE.FOOD[id]; if (!(f.full >= 15)) continue;
        const b = el(`<button class="hq-btn" type="button">${f.icon} ${esc(f.name)} · ${f.price}</button>`);
        b.onclick = () => { if (VE.pantry(L).length >= VE.PANTRY_MAX) { api.toast('Tủ đồ ăn đã đầy.'); return; } if (!LIFE.pay(L, f.price)) { api.toast('Không đủ tiền.'); return; } VE.store(L, id); api.toast(`🥡 Gói ${f.name} mang về tủ.`); api.save?.(); render(); };
        tk.append(b);
      }
      box.append(tk);
    }
    box.append(el(`<p class="hq-note">${esc(title)}: «Ăn no mới có sức làm. Khách cần gì cứ gọi.»</p>`));
  };
  render();
  return box;
}

/** liêu xá: thuê giường chung / phòng đơn, ngủ (≤ 8 giờ cho mỗi lần thuê); onSleep(hours, kind) */
export function dormBody(api, L, onSleep) {
  const box = el('<div class="hq-life"></div>');
  const render = () => {
    const now = Date.now(), bed = L.bed && L.bed.until > now ? L.bed : null;
    box.replaceChildren(el(`<div>${bar('🌙 Tỉnh', L.wake, 'wake')}${bar('❤ Khí huyết', L.hp, 'hp')}<p class="hq-life-van">💰 ${COIN.fmt(L.xu)}</p></div>`));
    if (!bed) {
      box.append(el('<p class="hq-note">Chưởng quỹ: «Giường chung 30 đồng một đêm, phòng riêng 80 đồng — giữ chỗ 12 canh giờ. Trả trước.»</p>'));
      const acts = el('<div class="hq-actions"></div>');
      for (const k of ['dorm', 'room']) {
        const g = LIFE.LODGING[k];
        const b = el(`<button class="hq-btn" type="button">${esc(g.name)} · ${g.price} đồng</button>`);
        b.disabled = L.van < g.price;
        b.onclick = () => { const r = LIFE.rentBed(L, k); if (!r.ok) { api.toast(ERR[r.err] || 'Không thuê được.'); return; } L.bed.left = LIFE.OFFLINE.maxSleepH; api.toast(`Đã thuê ${g.name}.`); api.save(); render(); };
        acts.append(b);
      }
      box.append(acts);
      return;
    }
    const g = LIFE.LODGING[bed.kind], left = bed.left ?? LIFE.OFFLINE.maxSleepH;
    box.append(el(`<p class="hq-note">Đã thuê <b>${esc(g.name)}</b> tới ${new Date(bed.until).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · còn ${left} canh giờ ngủ. Tỉnh hồi ${g.wake}/giờ.</p>`));
    const acts = el('<div class="hq-actions"></div>');
    for (const h of [1, 4, 8]) {
      const b = el(`<button class="hq-btn" type="button">Ngủ ${h} giờ</button>`);
      b.disabled = left < h || L.wake >= 95;
      b.onclick = () => { bed.left = left - h; onSleep(h, bed.kind); };
      acts.append(b);
    }
    box.append(acts);
    if (L.wake >= 95) box.append(el('<p class="hq-note">Tinh thần đang sung mãn, chưa cần ngủ.</p>'));
  };
  render();
  return box;
}

/** màn ngủ: tối dần, đếm canh giờ (0,5 giây / giờ), xong thì gọi onDone */
export function sleepOverlay(root, hours, onDone) {
  const ov = el(`<div class="hq-sleep"><div><b>💤 Ngủ</b><span>0 / ${hours} canh giờ</span></div></div>`);
  root.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('on'));
  let k = 0;
  const t = setInterval(() => {
    k += 1; ov.querySelector('span').textContent = `${k} / ${hours} canh giờ`;
    if (k >= hours) { clearInterval(t); setTimeout(() => { ov.classList.remove('on'); onDone(); setTimeout(() => ov.remove(), 700); }, 400); }
  }, 500);
}
