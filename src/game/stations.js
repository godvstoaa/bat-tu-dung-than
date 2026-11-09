// ============================================================================
//  HUYỀN QUÁN — nội dung từng gian (bảng DOM) + gọi engine Bát Tự / Bát Trạch / Xăm.
//  Spec: docs/GAME-HUYEN-QUAN-SPEC.md mục 7.
//  `api` do main.js cấp: { state, panel, onClose(body, fn), after(gained, why), toast, goTo, setSitting, setTeaColor, wipe, reduced }.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyze } from '../engine/chart.js';
import { computeZhai } from '../engine/zhai.js';
import { dailyGuidance } from '../engine/daily.js';
import { qiuqian, zhiJiao } from '../engine/qiuqian.js';
import { GAN, ZHI, WX_VI } from '../engine/constants.js';
import { YI_VI, JI_VI } from '../engine/daily-guide.js';
import * as S from './state.js';
import { CALM_LINES, randomName } from './names.js';
// [G2 — NPC-AI] (docs/npc-ai/15 §15.11 — thứ tự import: dữ liệu → chuyện → bark → consumer)
import { pickBark } from './bark-pool.js'; // MỘT NGUỒN pool bark (persona + khach_* + trạm — audit F1/F2)
import { bell, knock, rattle } from './audio.js';
import { ROBE } from './render.js';
import { TEXT, FEATURES } from './features.js';
import { buzz } from './haptics.js';

const NOTE = 'Để tham khảo và chiêm nghiệm, không thay quyết định của bạn.';

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// Tạo node trong document thật (không dùng <template>: document trơ không có font → canvas mất chữ).
function el(html) {
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

const WX_CLASS = { 木: 'wx-moc', 火: 'wx-hoa', 土: 'wx-tho', 金: 'wx-kim', 水: 'wx-thuy' };
const DM_IMAGE = { 甲: 'cây đại thụ', 乙: 'dây leo, hoa cỏ', 丙: 'mặt trời', 丁: 'ngọn đèn, ánh nến', 戊: 'núi lớn, tường thành', 己: 'ruộng vườn', 庚: 'đao kiếm, quặng thô', 辛: 'trang sức, ngọc', 壬: 'sông lớn, biển', 癸: 'mưa móc, sương' };
const WX_LUCK = {
  木: { color: 'xanh lá', dir: 'Đông', num: '3, 8' },
  火: { color: 'đỏ, tím', dir: 'Nam', num: '2, 7' },
  土: { color: 'vàng, nâu', dir: 'Trung tâm, Đông Bắc, Tây Nam', num: '5, 0' },
  金: { color: 'trắng, bạc', dir: 'Tây', num: '4, 9' },
  水: { color: 'đen, xanh biển', dir: 'Bắc', num: '1, 6' },
};
const TOPICS = { chung: 'Chung', career: 'Công danh', wealth: 'Tài lộc', love: 'Tình duyên' };

// Rating engine → lời mềm cho lớp game (spec mục 11.3).
export function softRating(r = '') {
  if (/Đại cát/.test(r)) return 'Rất thuận';
  if (/Đại hung/.test(r)) return 'Nên thủ, giữ sức';
  if (/Hơi thuận/.test(r)) return 'Khá thuận';
  if (/Hơi nghịch/.test(r)) return 'Hơi trắc trở';
  if (/Hung/.test(r)) return 'Nhiều thử thách — đi chậm';
  if (/Cát|thuận/i.test(r)) return 'Thuận';
  return 'Bình ổn';
}

const chartCache = new Map();
export function chartOf(p) {
  const year = new Date().getFullYear();
  // key kèm năm phân tích (mẫu vanmenh-ui.js › vanOf) — qua giao thừa không trả chart năm cũ
  const k = `${p.year}-${p.month}-${p.day}-${p.hour}-${p.minute}-${p.gender}-${year}`;
  if (!chartCache.has(k)) chartCache.set(k, analyze(p.year, p.month, p.day, p.hour, p.minute, p.gender, year));
  return chartCache.get(k);
}

const fmtDate = (p) => `${String(p.day).padStart(2, '0')}/${String(p.month).padStart(2, '0')}/${p.year}`;
const fmtTime = (p) => (p.hour == null ? 'không rõ giờ' : `${String(p.hour).padStart(2, '0')}:${String(p.minute || 0).padStart(2, '0')}`);

function profileSelect(state, selected) {
  return `<select class="hq-input" data-role="profile">${state.profiles.map((p) => `<option value="${esc(p.id)}"${p.id === selected ? ' selected' : ''}>${esc(p.label)} · ${fmtDate(p)}</option>`).join('')}</select>`;
}

function needProfile(api, what) {
  const body = el(`<div><p>${esc(what)} cần ngày sinh của bạn. Thầy ở Chính Đường sẽ lập lá số trước.</p>
    <div class="hq-actions"><button class="hq-btn hq-primary" data-go="thay">Tới bàn thầy</button></div></div>`);
  body.querySelector('[data-go]').onclick = () => api.goTo('thay');
  return body;
}

// ---------------------------------------------------------------------------
// [G2 — NPC-AI] BARK TRẠM (docs/npc-ai/05-npc-da-co-trong-code.md; mở khóa
// stations.js theo mục 15 §15.7). Bark ≤ 90 ký tự, không doạ, không chê lá số
// người chơi (mục 06 §7). Chọn THUẦN THEO HẠT — cùng ngày + cùng trạm → cùng
// câu, mai tự đổi (mục 05 §05.3); không Math.random. Hiện qua cơ chế sẵn có:
// api.toast lúc mở trạm, hoặc dòng thoại trong panel trạm đó — KHÔNG dựng UI
// mới, KHÔNG bong bóng 3D (phần render3d của thợ khác).
//
// MỘT NGUỒN (audit F1 — docs/npc-ai/05 §05.3 + 04): TOÀN BỘ pool bark (persona
// thay_tubinh, khách khach_*, trạm xam/que/huong/tra/sen/la_ban/lich) nằm ở
// bark-pool.js — chỗ này KHÔNG còn pool cục bộ; barkOf gọi thẳng pickBark,
// pool không có → null → trạm câm (§05.3), KHÔNG bịa giọng. Map trạm→pool
// barkPoolOfStation ở world.js đã dọn (đường chết không consumer).
// ---------------------------------------------------------------------------
const pidLocal = () => {
  try { return localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { return 'local'; }
};
// Múi chọn bark = dayKey khuôn (ngày : pid) — chỉ làm chỉ số chọn câu, không
// ghi state, không rời máy người chơi.
const dayKeyOf = () => `${S.todayStr(new Date())}:${pidLocal()}`;

/** Chọn bark trạm theo hạt — delegate pickBark của bark-pool.js: một nguồn dữ
 *  liệu + một công thức chọn, chung với persona (audit F1/F2). Không có pool →
 * null — trạm câm như hôm nay, KHÔNG bịa giọng. */
function barkOf(poolId, seed = dayKeyOf()) {
  return pickBark(poolId, seed);
}
/** Phát bark trạm qua toast sẵn có — lúc MỞ trạm (mục 05: mỗi trạm ghi rõ khi nào). */
function stationBark(api, poolId, seed = dayKeyOf()) {
  const text = barkOf(poolId, seed);
  if (text) api.toast(text);
}

// ---------------------------------------------------------------------------
// 7.1 Bàn Thầy Tử Bình
// ---------------------------------------------------------------------------
function pillarCard(p, label, isDay) {
  const g = GAN[p.gan], z = ZHI[p.zhi];
  return `<div class="hq-pillar${isDay ? ' is-day' : ''}">
    <div class="hq-pl-label">${label}</div>
    <div class="hq-pl-char ${WX_CLASS[g.wx]}">${p.gan}</div><div class="hq-pl-vi">${g.vi} · ${WX_VI[g.wx]}</div>
    <div class="hq-pl-char ${WX_CLASS[z.wx]}">${p.zhi}</div><div class="hq-pl-vi">${z.vi} · ${z.con}</div>
  </div>`;
}

function chartResult(api, prof, R, ritual) {
  const year = new Date().getFullYear();
  const P = R.chart.pillars;
  const dm = R.chart.dayMaster;
  const strong = R.strength.strong;
  const strengthText = strong === true ? 'Thân vượng — năng lượng dồi dào, hợp cho đi, làm việc, tiết bớt sức.'
    : strong === false ? 'Thân nhược — cần được nâng đỡ: học hỏi, người đồng hành, nghỉ ngơi đủ.'
      : 'Trung hoà — cân bằng, giữ nhịp là tốt.';
  const y = R.yong;
  const luck = WX_LUCK[y.primary] || {};
  const ln = R.liunian.find((x) => x.year === year) || R.liunian.find((x) => x.isNow);
  const dy = [...R.dayun].reverse().find((d) => d.startYear <= year);
  const bars = ['木', '火', '土', '金', '水'].map((w) => `<div class="hq-bar"><span>${WX_VI[w]}</span><i class="${WX_CLASS[w]}" style="--v:${R.wx.pct[w]}%"></i><b>${Math.round(R.wx.pct[w])}%</b></div>`).join('');
  const body = el(`<div class="hq-chart${ritual ? ' ritual' : ''}">
    <p class="hq-sub">${esc(prof.label)} · ${fmtDate(prof)} · ${fmtTime(prof)} · ${esc(prof.gender)}</p>
    <p class="hq-ink" data-role="ink">Thầy đang mài mực, lập lá số…</p>
    <div class="hq-pillars">${pillarCard(P.time, 'Giờ')}${pillarCard(P.day, 'Ngày', true)}${pillarCard(P.month, 'Tháng')}${pillarCard(P.year, 'Năm')}</div>
    <div class="hq-bars">${bars}</div>
    <div class="hq-reading">
      <p><b>Nhật chủ:</b> ${dm.vi} ${WX_VI[dm.wx]} — như ${DM_IMAGE[dm.gan]}.</p>
      <p><b>Thân:</b> ${strengthText}</p>
      <p><b>Dụng thần:</b> ${WX_VI[y.primary]}${y.secondary ? `, phụ ${WX_VI[y.secondary]}` : ''} — màu ${luck.color}, hướng ${luck.dir}, số ${luck.num}.</p>
      ${y.avoid?.length ? `<p><b>Nên tiết chế:</b> ${y.avoid.map((w) => WX_VI[w]).join(', ')}.</p>` : ''}
      ${R.pattern?.vi ? `<p><b>Cách cục:</b> ${esc(R.pattern.vi)}.</p>` : ''}
      ${ln ? `<p><b>Năm ${year} (${ln.ganZhi} · ${gzVi(ln.ganZhi)}):</b> ${softRating(ln.rating)}.</p>` : ''}
      ${dy ? `<p><b>Đại vận hiện tại:</b> ${dy.ganZhi} · ${gzVi(dy.ganZhi)} (từ ${dy.startYear}) — ${softRating(dy.rating)}.</p>` : ''}
      ${prof.hour == null ? '<p class="hq-warn">Không rõ giờ sinh → thầy tạm lấy giờ Ngọ; trụ Giờ chỉ để tham khảo.</p>' : ''}
      <p class="hq-note">${NOTE}</p>
    </div>
    <div class="hq-actions">
      <button class="hq-btn" data-role="skip">Xem ngay</button>
      ${FEATURES.ai ? '<button class="hq-btn hq-primary" data-role="ask">🎙 Hỏi Thầy về lá số này</button>' : ''}
      <a class="hq-btn" href="/" target="_blank" rel="noopener">Luận sâu trong app chính →</a>
      <button class="hq-btn hq-primary" data-role="back">Về sân</button>
    </div>
  </div>`);
  const finish = () => { body.classList.remove('ritual'); body.classList.add('done'); body.querySelector('[data-role=skip]').remove(); };
  body.querySelector('[data-role=back]').onclick = () => api.panel.close();
  const askB = body.querySelector('[data-role=ask]');
  if (askB) askB.onclick = () => import('./case-ui.js').then((m) => m.openMaster(api, {
    R, who: prof.label,
    starters: ['Thầy luận tổng quan lá số giúp tôi.', `Năm ${new Date().getFullYear()} công việc và tiền bạc thế nào?`, 'Tình duyên, gia đạo của tôi ra sao?', 'Sức khỏe tôi cần lưu ý gì?'],
  }));
  if (ritual && !api.reduced) {
    const timers = [];
    const cards = body.querySelectorAll('.hq-pillar');
    cards.forEach((c, i) => timers.push(setTimeout(() => { c.classList.add('flip'); knock(700, 0.2); }, 900 + i * 600)));
    timers.push(setTimeout(() => { finish(); bell(330, 0.12); }, 900 + cards.length * 600 + 500));
    body.querySelector('[data-role=skip]').onclick = () => { for (const t of timers) clearTimeout(t); body.querySelectorAll('.hq-pillar').forEach((c) => c.classList.add('flip')); finish(); };
    // đóng panel giữa nghi lễ → dọn sạch tiếng gõ/chuông (mẫu openXam › api.onClose)
    api.onClose(body, () => { for (const t of timers) clearTimeout(t); });
  } else {
    body.querySelectorAll('.hq-pillar').forEach((c) => c.classList.add('flip'));
    finish();
  }
  return body;
}

function openThay(api) {
  const { state } = api;
  // [G2 — NPC-AI] bark chào của Thầy Tử Bình (mục 05 §05.4 — pool BARK-thay
  // hồ sơ 19 = `thay_tubinh` đã có trong bark-pool.js); bark NGOÀI GIỜ (khách
  // đi ngang) là phần render3d của thợ khác. Nút 🎙 hỏi Thầy AI giữ nguyên vai.
  stationBark(api, 'thay_tubinh');
  const first = state.profiles.length === 0;
  const body = el(`<div>
    <p class="hq-sub">Thầy đặt bút xuống, ngẩng lên: «Khách muốn xem cho ai?»</p>
    <div class="hq-actions"><button class="hq-btn" data-role="ancổ">📚 Án Cổ — luyện trên lá số kinh điển</button></div>
    ${state.profiles.length ? `<div class="hq-list">${state.profiles.map((p) => `<button class="hq-btn hq-row" data-id="${esc(p.id)}">📜 ${esc(p.label)} · ${fmtDate(p)} · ${fmtTime(p)}</button>`).join('')}</div>` : ''}
    ${state.profiles.length < S.CAPS.maxProfiles ? `<form class="hq-form" data-role="form" novalidate>
      <h4>${first ? 'Lập lá số' : 'Thêm người'}</h4>
      <label>Gọi là <input class="hq-input" name="label" maxlength="24" value="${first ? 'Bản thân' : ''}" placeholder="vd: Mẹ, Anh Hai" required></label>
      <label>Ngày sinh (dương lịch) <input class="hq-input" type="date" name="date" min="1900-01-01" max="2100-12-31" required></label>
      <label>Giờ sinh <input class="hq-input" type="time" name="time" value="12:00"></label>
      <label class="hq-check"><input type="checkbox" name="nohour"> Không rõ giờ sinh</label>
      <div class="hq-radio"><label><input type="radio" name="gender" value="nam" checked> Nam</label><label><input type="radio" name="gender" value="nữ"> Nữ</label></div>
      <p class="hq-error" data-role="err" role="alert"></p>
      <button class="hq-btn hq-primary" type="submit">Xin thầy lập lá số</button>
    </form>` : '<p class="hq-sub">Sổ Mệnh đã đủ 5 người — xoá bớt trong Sổ Mệnh để thêm.</p>'}
  </div>`);
  body.querySelector('[data-role="ancổ"]').onclick = () => api.panel.open({ title: 'Án Cổ', body: openClassicalList(api) });
  body.querySelectorAll('[data-id]').forEach((b) => {
    b.onclick = () => {
      const p = state.profiles.find((x) => x.id === b.dataset.id);
      api.panel.open({ title: 'Bàn Thầy Tử Bình', body: chartResult(api, p, chartOf(p), false) });
    };
  });
  const form = body.querySelector('[data-role=form]');
  if (form) {
    form.nohour.onchange = () => { form.time.disabled = form.nohour.checked; };
    form.onsubmit = (e) => {
      e.preventDefault();
      const err = form.querySelector('[data-role=err]');
      err.textContent = '';
      const label = form.label.value.trim();
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date.value);
      if (!label) { err.textContent = 'Xin cho thầy biết gọi người này là gì.'; return; }
      if (!m) { err.textContent = 'Ngày sinh chưa hợp lệ.'; return; }
      const [hh, mi] = form.nohour.checked ? [null, null] : (form.time.value || '12:00').split(':').map(Number);
      const prof = { label, year: +m[1], month: +m[2], day: +m[3], hour: hh, minute: mi, gender: form.gender.value };
      let R;
      try { R = chartOf(prof); } catch (ex) { err.textContent = ex.message || 'Thầy chưa lập được lá số này.'; return; }
      const saved = S.addProfile(state, prof);
      if (!saved) { err.textContent = 'Sổ Mệnh đã đủ người.'; return; }
      const gained = S.grantChart(state, saved.id);
      api.after(gained, 'lập lá số');
      api.celebrate?.(R.yong.primary);
      buzz('medium');
      api.panel.open({ title: 'Bàn Thầy Tử Bình', body: chartResult(api, saved, R, true) });
    };
  }
  return body;
}

// ---------------------------------------------------------------------------
// 7.2 La Bàn Đài
// ---------------------------------------------------------------------------
const DIRS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];

function compassView(api, prof) {
  const Z = computeZhai(prof.year, prof.gender);
  const byDir = {};
  for (const [k, v] of Object.entries(Z.auspicious)) byDir[v] = { star: k.split(' (')[0], good: true, full: k };
  for (const [k, v] of Object.entries(Z.inauspicious)) byDir[v] = { star: k.split(' (')[0], good: false, full: k };
  const wrap = el(`<div class="hq-compass">
    <div class="hq-row-flex">${profileSelect(api.state, prof.id)}</div>
    <p><b>Mệnh quái:</b> ${esc(Z.guaName)} · ${esc(Z.grpVi)}</p>
    <canvas width="300" height="300" aria-label="La bàn tám hướng, kéo để xoay"></canvas>
    <p class="hq-sub">Kéo để xoay la bàn. Ô vàng là hướng cát, ô xám là hướng nên tránh.</p>
    <div class="hq-actions"><button class="hq-btn" data-role="sensor" hidden>🧭 Dùng la bàn điện thoại</button></div>
    <ul class="hq-dirs">${DIRS.map((d) => byDir[d] ? `<li class="${byDir[d].good ? 'good' : 'bad'}"><b>${d}</b> — ${esc(byDir[d].full)}</li>` : '').join('')}</ul>
    <details><summary>Lời thầy dặn về nhà cửa</summary><ul>${Z.advice.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></details>
    <p class="hq-note">${NOTE}</p>
  </div>`);
  const cv = wrap.querySelector('canvas');
  const g = cv.getContext('2d');
  let rot = 0;
  function draw() {
    const c = 150, R = 140;
    g.clearRect(0, 0, 300, 300);
    g.save(); g.translate(c, c); g.rotate(rot);
    DIRS.forEach((d, i) => {
      const info = byDir[d];
      const a0 = (i * 45 - 22.5 - 90) * Math.PI / 180, a1 = (i * 45 + 22.5 - 90) * Math.PI / 180;
      g.fillStyle = info?.good ? '#d6a84a' : '#5d5650';
      g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath(); g.fill();
      g.strokeStyle = '#1b1510'; g.lineWidth = 2; g.stroke();
      const am = (i * 45 - 90) * Math.PI / 180;
      g.save(); g.rotate(am + Math.PI / 2);
      g.fillStyle = info?.good ? '#2a1d10' : '#eee6d6'; g.textAlign = 'center';
      g.font = 'bold 13px sans-serif'; g.fillText(d, 0, -R + 22);
      g.font = '11px sans-serif'; g.fillText(info?.star || '', 0, -R + 40);
      g.restore();
    });
    g.fillStyle = '#2a1d10'; g.beginPath(); g.arc(0, 0, 34, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d6a84a'; g.font = 'bold 18px serif'; g.textAlign = 'center'; g.fillText(Z.guaName.split(' ')[0], 0, 7);
    g.restore();
    // kim cố định chỉ lên: hướng điện thoại đang nhìn
    g.fillStyle = '#b3261e'; g.beginPath(); g.moveTo(c, 4); g.lineTo(c - 8, 22); g.lineTo(c + 8, 22); g.closePath(); g.fill();
  }
  draw();
  let drag = null;
  const ang = (e) => { const r = cv.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); };
  cv.onpointerdown = (e) => { drag = { a: ang(e), rot }; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => { if (drag) { rot = drag.rot + ang(e) - drag.a; draw(); } };
  cv.onpointerup = cv.onpointercancel = () => { drag = null; };
  const sensor = wrap.querySelector('[data-role=sensor]');
  if ('DeviceOrientationEvent' in window && matchMedia('(pointer: coarse)').matches) {
    sensor.hidden = false;
    sensor.onclick = async () => {
      try { if (typeof DeviceOrientationEvent.requestPermission === 'function' && (await DeviceOrientationEvent.requestPermission()) !== 'granted') return; } catch (e) { return; }
      const onOri = (e) => {
        const heading = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
        if (heading == null) return;
        rot = -heading * Math.PI / 180; draw();
      };
      window.addEventListener('deviceorientation', onOri);
      api.onClose(wrap, () => window.removeEventListener('deviceorientation', onOri));
      sensor.textContent = '🧭 Đang theo hướng điện thoại';
    };
  }
  wrap.querySelector('[data-role=profile]').onchange = (e) => {
    const p = api.state.profiles.find((x) => x.id === e.target.value);
    api.panel.open({ title: 'La Bàn Đài', body: compassView(api, p) });
  };
  return wrap;
}

function openCompass(api) {
  // [G2 — NPC-AI] bark La Bàn Đài (mục 05 §05.14): 1–2 câu tĩnh, chỉ đọc
  // hướng — không nói «hướng xấu cả đời», không AI.
  stationBark(api, 'la_ban');
  if (!api.state.profiles.length) return needProfile(api, 'La bàn hướng nhà');
  api.state.flags.sawCompass = true;
  api.after(S.grantDaily(api.state, 'compass'), 'xem la bàn');
  return compassView(api, api.state.profiles[0]);
}

// ---------------------------------------------------------------------------
// 7.3 Ống Xăm
// ---------------------------------------------------------------------------
function stickResult(f, topic) {
  const topicText = topic === 'career' ? f.career : topic === 'wealth' ? f.wealth : topic === 'love' ? f.love : f.overall;
  return `<div class="hq-stick-card">
    <div class="hq-stick-num">Thẻ số ${f.num}</div>
    <div class="hq-stick-tone">${esc(f.toneVi)}</div>
    <p class="hq-poem">${esc(f.poem)}</p>
    ${f.full && f.story ? `<p class="hq-sub">${esc(f.story)}</p>` : ''}
    <p><b>${TOPICS[topic]}:</b> ${esc(topicText)}</p>
    <p><b>Nên:</b> ${esc(f.do)}</p><p><b>Tránh:</b> ${esc(f.avoid)}</p>
    <p class="hq-note">Thơ xăm Hoàng Đại Tiên. ${NOTE}</p>
  </div>`;
}

function openXam(api) {
  const { state } = api;
  // [G2 — NPC-AI] bark chào của thần (mục 05 §05.6 — «cắm bark vào đầu
  // openXam»), cao cao tại tại, không doạ, khớp luật keo 3 lần sẵn có.
  stationBark(api, 'xam');
  if (S.sticksLeft(state) === 0) {
    const last = state.sticks.find((x) => x.accepted);
    // [F5 audit] «Ba lần keo…» chỉ đúng số liệu khi tổng keo hôm nay (stickTries
    // — state.js recordStick: mỗi lần chốt thẻ/ba-keo-chối tính 1 lượt) đã đạt
    // trần CAPS.sticksPerDay MÀ vẫn chưa nhận đủ thẻ (có keo bị chối). Hết lượt
    // mà nhận đủ thẻ → nói chuyện thẻ; điều kiện cũ `tries > sticks` là phép đo
    // gián tiếp, sai ngữ cảnh ngay khi trần đổi/số liệu cũ.
    const tries = state.daily.stickTries || 0;
    const triedOut = tries >= S.CAPS.sticksPerDay && state.daily.sticks < S.CAPS.sticksPerDay;
    return el(`<div><p>${triedOut
      ? 'Ba lần keo chưa thuận thì mai quay lại — hôm nay hết lượt xin thẻ rồi.'
      : `Hôm nay khách đã nhận đủ ${S.CAPS.sticksPerDay} thẻ. Mai hãy quay lại — quẻ hỏi nhiều thì lòng càng rối.`}</p>
      ${last ? `<p class="hq-sub">Thẻ gần nhất: số ${last.num} · ${esc(last.toneVi || last.tone)}</p>` : ''}</div>`);
  }
  const body = el(`<div class="hq-xam">
    <p class="hq-sub">Còn ${S.sticksLeft(state)} lượt nhận thẻ hôm nay.</p>
    <label>Điều muốn hỏi (không bắt buộc) <input class="hq-input" name="q" maxlength="120" placeholder="vd: có nên đổi việc vào năm sau?"></label>
    <div class="hq-radio">${Object.entries(TOPICS).map(([k, v], i) => `<label><input type="radio" name="topic" value="${k}"${i === 0 ? ' checked' : ''}> ${v}</label>`).join('')}</div>
    <div class="hq-tube" data-role="tube"><div class="hq-tube-body"></div><div class="hq-stick-out" data-role="out"></div></div>
    <div class="hq-meter"><i data-role="meter"></i></div>
    <p class="hq-status" data-role="status" aria-live="polite">Bấm giữ nút (hoặc lắc điện thoại) để lắc ống xăm.</p>
    <div class="hq-actions"><button class="hq-btn hq-primary" data-role="shake">🎋 Bấm giữ để lắc</button></div>
    <div data-role="result"></div>
  </div>`);
  const $ = (r) => body.querySelector(`[data-role=${r}]`);
  let progress = 0, target = 1.5 + Math.random(), holding = false, last = 0, phase = 'shake', fails = 0, raf = 0, stick = null;
  const topic = () => body.querySelector('[name=topic]:checked').value;
  const question = () => body.querySelector('[name=q]').value.trim();

  function add(sec) {
    if (phase !== 'shake') return;
    progress += sec;
    $('meter').style.width = `${Math.min(100, (progress / target) * 100)}%`;
    $('tube').classList.add('shaking');
    if (Math.random() < 0.35) rattle();
    if (progress >= target) dropStick();
  }
  function loop(ts) {
    if (!holding) return;
    if (last) add((ts - last) / 1000);
    last = ts;
    raf = requestAnimationFrame(loop);
  }
  function stopHold() { holding = false; last = 0; cancelAnimationFrame(raf); $('tube').classList.remove('shaking'); }
  function dropStick() {
    stopHold();
    phase = 'jiao';
    stick = qiuqian(question(), { deterministic: false });
    $('out').textContent = stick.num;
    $('tube').classList.add('dropped');
    knock(600, 0.3);
    $('status').textContent = `Một thẻ rơi ra: số ${stick.num}. Xin keo để hỏi thần có chấp nhận thẻ này không.`;
    const btn = $('shake');
    btn.textContent = '🌓 Xin keo';
    btn.onclick = castJiao;
  }
  function castJiao() {
    const j = zhiJiao();
    const ok = j.result === 'shengjiao';
    knock(500, 0.3); setTimeout(() => knock(560, 0.25), 140);
    const blocks = j.blocks.map((b) => `<span class="hq-jiao ${b === '正' ? 'flat' : 'round'}" title="${b === '正' ? 'mặt phẳng' : 'mặt lồi'}"></span>`).join('');
    if (ok) {
      phase = 'done';
      const gained = S.recordStick(state, { num: stick.num, tone: stick.tone, toneVi: stick.toneVi, accepted: true, question: question(), topic: topic() });
      $('status').innerHTML = `${blocks} <b>${esc(j.vi)}</b> — thần chấp nhận thẻ.`;
      $('result').innerHTML = stickResult(stick, topic());
      $('shake').remove();
      bell(440, 0.12);
      api.after(gained, 'nhận thẻ xăm');
      return;
    }
    fails += 1;
    if (fails >= 3) {
      phase = 'done';
      state.flags.patience = true;
      S.recordStick(state, { num: stick.num, tone: stick.tone, toneVi: stick.toneVi, accepted: false, question: question(), topic: topic() });
      $('status').innerHTML = `${blocks} <b>${esc(j.vi)}</b>. Ba lần keo chưa thuận — hôm nay chưa đủ duyên, mai hãy quay lại.`;
      $('shake').remove();
      api.after(0);
      return;
    }
    $('status').innerHTML = `${blocks} <b>${esc(j.vi)}</b> — thần chưa chấp nhận thẻ này. Lắc lại nhé (lần ${fails}/3).`;
    phase = 'shake'; progress = 0; target = 1.5 + Math.random();
    $('meter').style.width = '0%'; $('out').textContent = ''; $('tube').classList.remove('dropped');
    const btn = $('shake');
    btn.textContent = '🎋 Bấm giữ để lắc';
    btn.onclick = null;
  }
  const btn = $('shake');
  btn.onpointerdown = (e) => { if (phase !== 'shake') return; e.preventDefault(); holding = true; last = 0; raf = requestAnimationFrame(loop); };
  btn.onpointerup = btn.onpointerleave = btn.onpointercancel = () => { if (holding) stopHold(); };
  btn.onkeydown = (e) => { if (phase === 'shake' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); add(0.15); } };
  btn.onkeyup = () => $('tube').classList.remove('shaking');
  const onMotion = (e) => {
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    const mag = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
    if (mag > 15) add(0.1);
  };
  window.addEventListener('devicemotion', onMotion);
  api.onClose(body, () => { stopHold(); window.removeEventListener('devicemotion', onMotion); });
  return body;
}

// ---------------------------------------------------------------------------
// 7.4 Lư Hương
// ---------------------------------------------------------------------------
function openHuong(api) {
  const { state } = api;
  // [G2 — NPC-AI] bark theo ngày, giọng Vân Cốc chủ trạm (mục 05 §05.8);
  // pool CALM_LINES của names.js GIỮ NGUYÊN làm nền — câu tĩnh tâm khi nhang
  // cháy vẫn bốc như cũ ở dưới (không thay bằng bark pool).
  stationBark(api, 'huong');
  const body = el(`<div class="hq-huong">
    <div class="hq-incense-vis"><span></span><span></span><span></span></div>
    <p class="hq-calm" data-role="calm"></p>
    <p class="hq-status" data-role="status" aria-live="polite"></p>
    <div class="hq-actions"><button class="hq-btn hq-primary" data-role="light">🕯 ${TEXT.huongVerb}</button></div>
  </div>`);
  const $ = (r) => body.querySelector(`[data-role=${r}]`);
  const line = CALM_LINES[Math.floor(Math.random() * CALM_LINES.length)];
  function update() {
    const inc = S.incenseState(state);
    body.style.setProperty('--burn', inc.burning ? 1 - inc.progress : 0);
    body.classList.toggle('burning', inc.burning);
    api.peek(inc.burning);
    if (inc.burning) {
      const s = Math.ceil(inc.remainMs / 1000);
      $('status').textContent = `Đang cháy · còn ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      $('calm').textContent = line;
      $('light').hidden = true;
    } else {
      $('status').textContent = state.daily.got.huong ? 'Nén hôm nay đã tàn. Có thể đốt thêm nếu muốn.' : 'Lò còn nguội.';
      $('calm').textContent = '';
      $('light').hidden = false;
    }
  }
  $('light').onclick = () => {
    const r = S.lightIncense(state);
    if (r.ok) { bell(392, 0.15); api.after(r.gained, 'thắp nhang'); }
    update();
  };
  update();
  const iv = setInterval(update, 1000);
  api.onClose(body, () => clearInterval(iv));
  return body;
}

// ---------------------------------------------------------------------------
// 7.5 Bảng Lịch Ngày
// ---------------------------------------------------------------------------
export function todayInfo(now = new Date()) {
  const l = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), 0, 0).getLunar();
  const hours = [];
  const seen = new Set();
  for (const t of l.getTimes()) {
    if (t.getTianShenLuck() !== '吉' || seen.has(t.getZhi())) continue;
    seen.add(t.getZhi());
    hours.push(`${ZHI[t.getZhi()]?.vi || t.getZhi()} (${t.getMinHm()}–${t.getMaxHm()})`);
  }
  return {
    lunar: `${l.getDay()}/${l.getMonth() < 0 ? 'nhuận ' + -l.getMonth() : l.getMonth()} âm lịch`,
    yearGZ: l.getYearInGanZhi(), monthGZ: l.getMonthInGanZhi(), dayGZ: l.getDayInGanZhi(),
    jieqi: l.getPrevJieQi().getName(),
    yi: l.getDayYi().map((x) => YI_VI[x] || x).slice(0, 6),
    ji: l.getDayJi().map((x) => JI_VI[x] || x).slice(0, 6),
    hours,
  };
}

const gzVi = (gz) => [...gz].map((c) => GAN[c]?.vi || ZHI[c]?.vi || c).join(' ');

function lichPersonal(api, prof) {
  const D = dailyGuidance(chartOf(prof));
  const label = D.score >= 70 ? 'Ngày thuận' : D.score >= 50 ? 'Ngày bình' : 'Ngày nên thủ';
  const tone = D.score >= 70 ? 'good' : D.score >= 50 ? 'mid' : 'low';
  return `<div class="hq-personal">
    <div class="hq-score ${tone}"><b>${D.score}</b><span>${label}</span></div>
    <div><p><b>Nên:</b> ${D.yi.filter((x) => !/^Hướng tốt/.test(x)).map(esc).join(' · ')}</p><p><b>Tránh:</b> ${D.ji.map(esc).join(' · ')}</p>
    ${D.goodDir?.length ? `<p><b>Hướng tốt:</b> ${D.goodDir.slice(0, 3).map(esc).join(', ')}</p>` : ''}</div>
  </div>`;
}

function openLich(api) {
  const { state } = api;
  // [G2 — NPC-AI] bark Bảng Lịch Ngày (mục 05 §05.14): chỉ nói hôm nay, không
  // chọn thay khách, không trích can chi rối.
  stationBark(api, 'lich');
  const now = new Date();
  const T = todayInfo(now);
  const body = el(`<div class="hq-lich">
    <div class="hq-date"><b>${now.getDate()}</b><span>tháng ${now.getMonth() + 1}/${now.getFullYear()}</span><span>${esc(T.lunar)}</span></div>
    <p>Năm <b>${T.yearGZ}</b> (${gzVi(T.yearGZ)}) · tháng <b>${T.monthGZ}</b> (${gzVi(T.monthGZ)}) · ngày <b>${T.dayGZ}</b> (${gzVi(T.dayGZ)}) · tiết ${esc(T.jieqi)}</p>
    <p><b>Giờ hoàng đạo:</b> ${T.hours.map(esc).join(', ')}</p>
    <p><b>Lịch chung nên:</b> ${T.yi.map(esc).join(', ') || '—'}</p>
    <p><b>Lịch chung kỵ:</b> ${T.ji.map(esc).join(', ') || '—'}</p>
    <hr>
    <div data-role="personal">${state.profiles.length ? '' : '<p class="hq-sub">Lập lá số ở bàn thầy để xem ngày hôm nay hợp với riêng bạn không.</p>'}</div>
    <p class="hq-note">${NOTE}</p>
  </div>`);
  if (state.profiles.length) {
    const box = body.querySelector('[data-role=personal]');
    const render = (id) => {
      const p = state.profiles.find((x) => x.id === id) || state.profiles[0];
      box.innerHTML = `${profileSelect(state, p.id)}${lichPersonal(api, p)}`;
      box.querySelector('[data-role=profile]').onchange = (e) => render(e.target.value);
    };
    render(state.profiles[0].id);
  }
  api.after(S.grantDaily(state, 'lich'), 'xem lịch ngày');
  return body;
}

// ---------------------------------------------------------------------------
// 7.6 Trà Thất
// ---------------------------------------------------------------------------
function openTra(api) {
  const { state } = api;
  const teas = S.TEAS.map((t) => ({ ...t, open: state.phucKhi >= t.min }));
  // [G2 — NPC-AI] bark người rót vô hình (mục 05 §05.9): nói ngay lúc khách
  // ngồi xuống — giới thiệu đúng 4 loại trà thật của S.TEAS, không nhắc khoá
  // 🔒/Phúc Khí bằng lời NPC (người rót không đếm tiền — PERSONA-CHUNG).
  const pourBark = barkOf('tra');
  const body = el(`<div class="hq-tra">
    <div data-role="setup">
      <p class="hq-sub">Khách ngồi xuống bồ đoàn. Ấm nước vừa sôi.</p>
      ${pourBark ? `<p class="hq-quote">“${esc(pourBark)}”</p>` : ''}
      <div class="hq-radio">${teas.map((t, i) => `<label class="${t.open ? '' : 'locked'}"><input type="radio" name="tea" value="${t.id}"${i === 0 ? ' checked' : ''}${t.open ? '' : ' disabled'}> ${t.name}${t.open ? '' : ` (🔒 ${t.min} ${TEXT.point})`}</label>`).join('')}</div>
      <div class="hq-radio">${[1, 3, 5, 10].map((m) => `<label><input type="radio" name="dur" value="${m}"${m === 3 ? ' checked' : ''}> ${m} phút</label>`).join('')}</div>
      <div class="hq-actions"><button class="hq-btn hq-primary" data-role="start">🍵 Rót trà, ngồi tĩnh</button></div>
      <p class="hq-sub">Hôm nay đã ngồi ${state.daily.teaMin} phút · ${TEXT.point} từ trà tối đa ${S.CAPS.teaPerDay}/ngày.</p>
    </div>
    <div data-role="sit" hidden>
      <div class="hq-breath" data-role="breath"><span data-role="phase">Hít vào</span></div>
      <p class="hq-status" data-role="left" aria-live="off"></p>
      <div class="hq-actions"><button class="hq-btn" data-role="stand">Đứng dậy</button></div>
    </div>
  </div>`);
  const $ = (r) => body.querySelector(`[data-role=${r}]`);
  let start = 0, durMs = 0, iv = 0, ended = false;
  function finish(natural) {
    if (ended || !start) return;
    ended = true;
    clearInterval(iv);
    const mins = natural ? durMs / 60000 : Math.floor((Date.now() - start) / 60000);
    api.setSitting(false);
    api.peek(false);
    const gained = S.addTeaMinutes(state, mins);
    if (natural) bell(523, 0.12);
    api.after(gained, 'ngồi trà');
    if (body.isConnected) {
      $('sit').innerHTML = `<p>${natural ? 'Chén trà đã nguội.' : 'Khách đứng dậy.'} ${mins >= 1 ? `Đã ngồi ${Math.floor(mins)} phút.` : 'Chưa đủ một phút nên chưa tính.'}</p>`;
    }
  }
  $('start').onclick = async () => {
    const tea = S.TEAS.find((t) => t.id === body.querySelector('[name=tea]:checked').value);
    // setSitting tự toast khi hết chỗ — không nhắc nữa cho khỏi báo đôi
    if (!(await api.setSitting(true))) return;
    durMs = Number(body.querySelector('[name=dur]:checked').value) * 60000;
    start = Date.now();
    api.setTeaColor(tea.color);
    $('setup').hidden = true; $('sit').hidden = false;
    api.peek(true);
    knock(800, 0.2);
    const tick = () => {
      const el2 = Date.now() - start;
      if (el2 >= durMs) { finish(true); return; }
      const cyc = (el2 / 1000) % 14;
      $('phase').textContent = cyc < 4 ? 'Hít vào' : cyc < 8 ? 'Giữ hơi' : 'Thở ra';
      const s = Math.ceil((durMs - el2) / 1000);
      $('left').textContent = `${tea.name} · còn ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    tick();
    iv = setInterval(tick, 250);
  };
  $('stand').onclick = () => finish(false);
  api.onClose(body, () => finish(false));
  return body;
}

// ---------------------------------------------------------------------------
// 7.7 Hồ Sen
// ---------------------------------------------------------------------------
function openSen(api) {
  const { state } = api;
  const today = S.todayStr();
  const mine = state.lanterns.filter((l) => S.todayStr(new Date(l.at)) === today);
  if (state.daily.got.lantern) {
    return el(`<div><p>Đèn hoa đăng của khách hôm nay đang trôi trên hồ.</p>${mine.map((l) => `<p class="hq-poem">“${esc(l.wish)}”</p>`).join('')}<p class="hq-sub">Mỗi ngày một ngọn đèn. Mai lại thả nhé.</p></div>`);
  }
  // [G2 — NPC-AI] bark Hồ Sen (mục 05 §05.9): giữ luật riêng tư — không hứa
  // «đèn chung MMO» chưa có; lời hồ đi cùng form thả đèn lúc mở trạm.
  const senBark = barkOf('sen');
  const body = el(`<form class="hq-form">
    <label>Điều ước gửi theo đèn <textarea class="hq-input" name="wish" maxlength="80" rows="2" placeholder="vd: mong mẹ khoẻ"></textarea></label>
    ${senBark ? `<p class="hq-quote">“${esc(senBark)}”</p>` : ''}
    <p class="hq-sub">Điều ước chỉ lưu trên máy của bạn, không gửi đi đâu.</p>
    <div class="hq-actions"><button class="hq-btn hq-primary" type="submit">🪷 Thả đèn</button></div>
  </form>`);
  body.onsubmit = (e) => {
    e.preventDefault();
    const wish = body.wish.value.trim();
    if (!wish) { body.wish.focus(); return; }
    const r = S.addLantern(state, wish);
    if (r.ok) { bell(587, 0.1); api.after(r.gained, 'thả đèn'); }
    api.panel.open({ title: 'Hồ Sen', body: el(`<div><p>Ngọn đèn chạm mặt nước, chầm chậm trôi ra giữa hồ.</p><p class="hq-poem">“${esc(wish)}”</p></div>`) });
  };
  return body;
}

// ---------------------------------------------------------------------------
// 7.8 Sổ Mệnh
// ---------------------------------------------------------------------------
export function openBook(api, tab = 'tuhoc') {
  const { state } = api;
  const tabs = FEATURES.divination
    ? { tuhoc: 'Tu học', hoso: 'Hồ sơ', xam: 'Xăm', den: 'Đèn', thanh: 'Thành tựu', cai: 'Cài đặt' }
    : { tuhoc: 'Tu học', hoso: 'Hồ sơ', thanh: 'Thành tựu', cai: 'Cài đặt' };
  const t = S.titleFor(state.phucKhi), nx = S.nextTitle(state.phucKhi);
  let content = '';
  if (tab === 'tuhoc') {
    const log = (state.caseLog || []).slice(0, 10);
    content = `<div data-role="mastery"><p class="hq-sub">Đang tải…</p></div>
      <div class="hq-actions"><button class="hq-btn" data-role="ancổ">📚 Án Cổ (${Object.values(state.classical || {}).filter((v) => v >= 0.6).length} đã qua)</button></div>
      ${log.length ? `<h4>Án gần đây</h4><ul class="hq-plain">${log.map((x) => `<li>${new Date(x.at).toLocaleDateString('vi-VN')} · ${esc(x.name || '')} · ${x.total}%</li>`).join('')}</ul>` : ''}`;
  } else if (tab === 'hoso') {
    content = state.profiles.length ? `<ul class="hq-plain">${state.profiles.map((p) => `<li><button class="hq-link" data-open="${esc(p.id)}">📜 ${esc(p.label)}</button> · ${fmtDate(p)} · ${fmtTime(p)} · ${esc(p.gender)} <button class="hq-link danger" data-del="${esc(p.id)}">xoá</button></li>`).join('')}</ul>` : '<p>Chưa có hồ sơ nào. Ghé bàn thầy ở Chính Đường nhé.</p>';
  } else if (tab === 'xam') {
    content = state.sticks.length ? `<ul class="hq-plain">${state.sticks.map((x) => `<li>${new Date(x.at).toLocaleDateString('vi-VN')} · thẻ ${x.num} · ${esc(x.toneVi || x.tone)} ${x.accepted ? '' : '(chưa nhận)'}${x.question ? ` — <i>${esc(x.question)}</i>` : ''}</li>`).join('')}</ul>` : '<p>Chưa xin quẻ nào.</p>';
  } else if (tab === 'den') {
    content = state.lanterns.length ? `<ul class="hq-plain">${state.lanterns.map((l) => `<li>${new Date(l.at).toLocaleDateString('vi-VN')} — “${esc(l.wish)}”</li>`).join('')}</ul>` : '<p>Chưa thả đèn nào.</p>';
  } else if (tab === 'thanh') {
    content = `<ul class="hq-ach">${S.ACHIEVEMENTS.map((a) => `<li class="${state.achievements[a.id] ? 'got' : ''}"><b>${state.achievements[a.id] ? '🏮' : '◌'} ${a.name}</b><span>${a.desc}</span></li>`).join('')}</ul>`;
  } else {
    content = `<form class="hq-form" data-role="cfg">
      <label>Tên trong quán <input class="hq-input" name="name" maxlength="24" value="${esc(state.player?.name)}"></label>
      <div class="hq-radio"><label><input type="radio" name="look" value="hero_m"${state.player?.look !== 'hero_f' ? ' checked' : ''}> Nam tu sĩ</label><label><input type="radio" name="look" value="hero_f"${state.player?.look === 'hero_f' ? ' checked' : ''}> Nữ tu sĩ</label></div>
      <div class="hq-actions"><button class="hq-btn" type="button" data-role="rand">🎲 Tên ngẫu nhiên</button><button class="hq-btn hq-primary" type="submit">Lưu</button></div>
      <hr><button class="hq-btn danger" type="button" data-role="wipe">Xoá toàn bộ dữ liệu trong quán</button>
    </form>`;
  }
  const body = el(`<div class="hq-book">
    <p><b>${esc(state.player?.name)}</b> · ${t.name} · ${state.phucKhi} ${TEXT.point}${nx ? ` (còn ${nx.min - state.phucKhi} tới ${nx.name})` : ''} · chuỗi ${S.currentStreak(state)} ngày</p>
    <p class="hq-note">${TEXT.point} chỉ là điểm ghi nhận tiến bộ trong trò chơi — không phải phúc đức hay vận may thật.</p>
    <div class="hq-tabs" role="tablist">${Object.entries(tabs).map(([k, v]) => `<button role="tab" aria-selected="${k === tab}" class="hq-tab${k === tab ? ' on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>
    <div class="hq-tabbody">${content}</div>
  </div>`);
  const mbox = body.querySelector('[data-role=mastery]');
  if (mbox) import('./case-ui.js').then((m) => { mbox.innerHTML = m.masteryHtml(state); });
  const ab = body.querySelector('[data-role="ancổ"]');
  if (ab) ab.onclick = () => api.panel.open({ title: 'Án Cổ', body: openClassicalList(api) });
  body.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => api.panel.open({ title: TEXT.book, body: openBook(api, b.dataset.tab) }); });
  body.querySelectorAll('[data-open]').forEach((b) => {
    b.onclick = () => { const p = state.profiles.find((x) => x.id === b.dataset.open); api.panel.open({ title: 'Bàn Thầy Tử Bình', body: chartResult(api, p, chartOf(p), false) }); };
  });
  body.querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = () => {
      const p = state.profiles.find((x) => x.id === b.dataset.del);
      if (!confirm(`Xoá hồ sơ «${p.label}» khỏi Sổ Mệnh?`)) return;
      S.removeProfile(state, p.id); api.after(0);
      api.panel.open({ title: TEXT.book, body: openBook(api, 'hoso') });
    };
  });
  const cfg = body.querySelector('[data-role=cfg]');
  if (cfg) {
    cfg.querySelector('[data-role=rand]').onclick = () => { cfg.name.value = randomName(); };
    cfg.onsubmit = (e) => { e.preventDefault(); const n = cfg.name.value.trim(); if (n) { state.player.name = n; state.player.look = cfg.look.value; api.after(0); api.toast('Đã lưu.'); } };
    cfg.querySelector('[data-role=wipe]').onclick = () => { if (confirm('Xoá toàn bộ dữ liệu trong quán? Không khôi phục được.')) api.wipe(); };
  }
  return body;
}

// Giải án (P2): tải lười case-ui (kéo kb.js nặng) — hiện «đang mở án» trong lúc tải.
function lazyBody(load) {
  const box = el('<div class="hq-loadbox"><p class="hq-sub">Đang mở án…</p></div>');
  load().then((node) => { if (box.isConnected) box.replaceWith(node); }).catch((e) => { console.error(e); box.innerHTML = '<p>Chưa mở được án, thử lại sau nhé.</p>'; });
  return box;
}

// ---------------------------------------------------------------------------
// [G2 — NPC-AI] CHUYỆN KHÁCH (docs/npc-ai/08 §8.4 consumer + §8.5 bộ nhớ liên
// ngày; mở khóa stations.js theo mục 15 §15.7). Story do main.js › todayNpc
// tính sẵn từ hạt `${ngày}:${khe}:${pid}` (makeStory same-seed — nguyên văn
// cùng chuyện trong ngày) và đính kèm npc; phần này chỉ HIỆN trong panel án
// của chủ mở — không bark chung, không field payload mạng (mục 13 Quyết 3).
// ---------------------------------------------------------------------------
// Sách §8.5 muốn cờ FEATURES.storyMemory tắt mặc định — features.js không
// thuộc phạm vi được sửa đợt này nên cờ để địa phương: web bật, iOS giữ tắt
// cho gọn (cùng lý do sách ghi). Story (phần chữ hiển thị) vẫn chạy đủ nền tảng.
const STORY_MEMORY = (import.meta.env?.MODE || 'web') !== 'ios';
let storyRecallDay = ''; // phiên này đã nhắc chuyện hôm qua chưa (1 lần/ngày/phiên)

// Kho §8.5: khóa 'khach:<pid>:<ngày>' → { ten, storyId, tag } — CHỈ trên máy
// người chơi (khuôn 'huyenquan:pid' — net.js:8), không lưu ngày sinh/lá số
// (tính lại được từ hạt); đọc/ghi bọc try/catch — kho đầy thì mất câu nhắc,
// không lỗi app. tag = nhãn tệp hoàn cảnh (mục 08 §8.4.1) để mai kể đúng 1 câu.
function storyMemoRead(day) {
  if (!STORY_MEMORY) return null;
  try { return JSON.parse(localStorage.getItem(`khach:${pidLocal()}:${day}`) || 'null'); } catch (e) { return null; }
}
function storyMemoWrite(day, npc) {
  if (!STORY_MEMORY || !npc?.story) return;
  try {
    localStorage.setItem(`khach:${pidLocal()}:${day}`, JSON.stringify({ ten: npc.call, storyId: npc.story.storyId, tag: npc.story.tags?.[0] || '' }));
    storyMemoPrune(day); // [F4] dọn key cũ ngay lúc ghi — kho không tích vô hạn
  } catch (e) { /* kho đầy/quota → bỏ câu nhắc, không lỗi app (§8.5) */ }
}

// [F4 audit] Dọn kho §8.5: quét key prefix `khach:<pid>:` cùng pid — xoá key có
// ngày cũ hơn 30 ngày và giữ tối đa ~30 key/pid (mỗi ngày 1 key nên ~= 1 tháng
// nhắc chuyện). Ngày trong key là 'YYYY-MM-DD' (todayStr) nên so chuỗi = so
// lịch; quét gom key ra mảng TRƯỚC khi removeItem (đổi length giữa lúc lặp).
// Chạy trong try/catch của storyMemoWrite — kho bị khoá thì chỉ bỏ dọn.
function storyMemoPrune(today) {
  const prefix = `khach:${pidLocal()}:`;
  const mine = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix) && k.length > prefix.length) mine.push(k);
  }
  const [y, m, d] = today.split('-').map(Number);
  const cutoff = S.todayStr(new Date(y, m - 1, d - 30)); // 30 ngày trước — cùng khuôn 'YYYY-MM-DD'
  mine.sort(); // ngày đứng cuối key → sort chuỗi = cũ nhất trước, mới nhất (hôm nay) cuối
  for (let i = 0; i < mine.length; i++) {
    const k = mine[i];
    const conLai = mine.length - i;                  // số key chưa xét (gồm cả key này)
    const quaCu = k.slice(prefix.length) < cutoff;   // quá 30 ngày → xoá
    const du30 = conLai > 30;                        // còn hơn 30 key → bỏ key cũ nhất này
    if (quaCu || du30) localStorage.removeItem(k);
  }
}

// Nhãn tệp hoàn cảnh → chuyện cộc (kể lại đúng 1 câu — §8.5; chỉ tên + chủ đề)
const STORY_TAG_VI = {
  'CD-doi-viec': 'đổi việc', 'CD-be-tac': 'việc đang bế tắc', 'CD-mo-rong': 'mở rộng việc buôn bán',
  'CD-mua-nha': 'mua nhà', 'CD-cuoi': 'chuyện cưới hỏi', 'CD-thi': 'thi cử', 'CD-don-nha': 'dọn nhà',
  'CD-chung': 'một chuyện thường ngày',
  'DH-han-khat-nuoc': 'điều hậu lá số', 'DH-noan-can-lua': 'điều hậu lá số', 'DH-thap-can-kho': 'điều hậu lá số', 'DH-can-bang': 'điều hậu lá số',
  'CC-cach-thuong': 'cách cục lá số', 'CC-bai-cach-co-hau': 'cách cục lá số',
  'HH-hop': 'hợp hôn', 'HH-khac': 'hợp hôn', 'HH-trung': 'hợp hôn',
  'TR-viec-lon': 'chọn ngày cho việc lớn', 'DT-mua-cho-ai': 'hướng cửa nhà', 'DT-ai-mat-ngu': 'hướng cửa nhà',
};
// Đọc kho hôm qua đúng 1 lần/ngày — nhồi 1 câu đầu án «đầu tiên» mở trong ngày.
function storyRecallLine() {
  const today = S.todayStr();
  if (storyRecallDay === today) return '';
  storyRecallDay = today;
  const m = storyMemoRead(S.prevDay(today));
  if (!m || !m.ten) return '';
  const vi = STORY_TAG_VI[m.tag];
  return vi ? `Hôm qua ${m.ten} cũng ghé quán hỏi chuyện ${vi}.` : '';
}

/** Đoạn «Chuyện khách» — theo mẫu panel sẵn có (hq-sub + hq-quote, không CSS
 *  mới): câu dẫn mở án (intro) thay cho việc khách chỉ có câu hỏi in sẵn.
 *  ask/thanks thay câu hỏi + cảm ơn chung nằm trong case-ui.js (không thuộc
 *  đợt này) — ở đây thêm chuyện, không đổi cấu trúc án (§8.6.4). */
function storyBlockHtml(npc) {
  const st = npc?.story;
  if (!st) return '';
  const recall = storyRecallLine();
  return `<p class="hq-sub"><b>Chuyện khách</b></p>
    <p class="hq-quote">“${esc(st.intro)}”</p>${recall ? `
    <p class="hq-sub">${esc(recall)}</p>` : ''}`;
}

/** Bọc loader án sân: án hiện xong thì đặt «Chuyện khách» ngay trên câu hỏi
 *  của khách (không đụng DOM case-ui khác) + ghi kho liên ngày §8.5. Sách ghi
 *  «sau khi giải án» (S.recordCase — case-ui.js:232, không thuộc đợt này) —
 *  ghi tại lúc mở án: cùng nội dung {ten, storyId}, vẫn chỉ local. */
function storyCaseBody(api, slot, loader) {
  return lazyBody(async () => {
    const node = await loader();
    try {
      const npc = api.todayNpc(slot);
      const html = storyBlockHtml(npc);
      if (html) {
        const q = node.querySelector?.('.hq-quote');
        if (q) q.insertAdjacentHTML('beforebegin', html);
        else node.insertAdjacentHTML?.('afterbegin', html);
        storyMemoWrite(S.todayStr(), npc);
      }
    } catch (e) { /* chuyện chỉ là lời — án vẫn phải mở nguyên vẹn */ }
    return node;
  });
}

function openCaseSlot(slot) {
  return (api) => {
    const npc = api.todayNpc(slot);
    if (S.caseDone(api.state, slot)) {
      const b = el(`<div><p>${esc(npc.call)} đã được giải án hôm nay. Mai sẽ có khách mới.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-role="redo">Giải lại để luyện (không tính điểm)</button></div></div>`);
      b.querySelector('[data-role=redo]').onclick = () => api.panel.open({ title: npc.call, body: storyCaseBody(api, slot, async () => (await import('./case-ui.js')).npcCaseBody(api, slot, npc)) });
      return b;
    }
    return storyCaseBody(api, slot, async () => (await import('./case-ui.js')).npcCaseBody(api, slot, npc));
  };
}

// Sảnh nghề: 1 khách/sảnh/ngày (hạt giống = ngày + người chơi) — docs/GAME-NOI-DUNG-THEO-APP.md
function openDesk(id, title, bodyName, doneText) {
  return (api) => {
    let pid = 'local';
    try { pid = localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { /* ignore */ }
    const key = `${S.todayStr(new Date())}:${pid}`;
    const run = () => lazyBody(async () => (await import('./case-ui.js'))[bodyName](api, key));
    if (S.deskDone(api.state, id)) {
      const b = el(`<div><p>${doneText} Mai sẽ có khách mới.</p>
        <p class="hq-sub">Thông thạo: ${S.deskMastery(api.state, id)}%</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-role="redo">Giải lại để luyện (không tính điểm)</button></div></div>`);
      b.querySelector('[data-role=redo]').onclick = () => api.panel.open({ title, body: run() });
      return b;
    }
    return run();
  };
}
const openTrach = openDesk('trach', 'Sảnh Trạch Nhật', 'zheriCaseBody', 'Hôm nay khách ở Sảnh Trạch Nhật đã chốt được ngày.');
const openDuongTrach = openDesk('duongtrach', 'Sảnh Dương Trạch', 'dzCaseBody', 'Hôm nay khách ở Sảnh Dương Trạch đã xem xong nhà.');
// 6 sảnh khai báo (halls.js). Hợp Hôn = án chung: khoá theo ngày (cả quán cùng một cặp).
// [G2 — NPC-AI] bark khách chờ sảnh nghề (mục 05 §05.2 — nhóm khách procedural
// AI-light, pool `khach_*` sẵn có của bark-pool.js): khách nói một câu lúc mở
// sảnh, chỉ khi án hôm nay CHƯA giải; same-seed (key sảnh theo ngày + pid) →
// cùng ngày cùng câu. Chuyện riêng (makeStory) của nhóm sảnh này thuộc consumer
// halls/case-ui — đợt sau; bark chung chỉ là câu chờ không đụng lá số (mục 13).
const HALL_BARK = { dieuhau: 'khach_dieuhau', cachcuc: 'khach_cachcuc' };
function openHall(id, doneText, shared = false) {
  return (api) => {
    let pid = 'local';
    try { pid = localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { /* ignore */ }
    const day = S.todayStr(new Date());
    const key = shared ? day : `${day}:${pid}`;
    if (HALL_BARK[id] && !S.deskDone(api.state, id)) stationBark(api, HALL_BARK[id], key);
    const run = () => lazyBody(async () => (await import('./case-ui.js')).hallCaseBody(api, id, key));
    if (S.deskDone(api.state, id)) {
      const b = el(`<div><p>${doneText} Mai sẽ có án mới.</p><p class="hq-sub">Thông thạo: ${S.deskMastery(api.state, id)}%</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-role="redo">Giải lại để luyện (không tính điểm)</button></div></div>`);
      b.querySelector('[data-role=redo]').onclick = () => api.panel.open({ title: 'Luyện lại', body: run() });
      return b;
    }
    return run();
  };
}
const HALL_OPEN = {
  dieuhau: openHall('dieuhau', 'Hôm nay đã xem khí hậu lá số cho khách.'),
  thuvien: openHall('thuvien', 'Hôm nay đã đọc xong tầng thư.'),
  hophon: openHall('hophon', 'Hôm nay đã xem cặp hợp hôn chung.', true),
  tuvi: openHall('tuvi', 'Hôm nay đã an sao cho khách.'),
  tuongphap: openHall('tuongphap', 'Hôm nay đã đọc tượng cho khách.'),
  cachcuc: openHall('cachcuc', 'Hôm nay đã định cách cho khách.'),
};

export function openClassicalList(api) {
  return lazyBody(async () => (await import('./case-ui.js')).classicalListBody(api));
}

// Thầy Giải Quẻ (trong Chính Điện) — 5 phép của trang chính; luận thêm theo lá số người chơi
function openQue(api) {
  const b = api.state.player?.birth;
  let R = null;
  try { if (b) R = chartOf({ year: b.y, month: b.m, day: b.d, hour: b.h, minute: b.mi, gender: b.gender }); } catch (e) { /* bỏ qua */ }
  // iOS (4.3b): không đóng gói que-ui — điều kiện viết thẳng để Vite thay tĩnh và bỏ chunk
  if (import.meta.env.MODE === 'ios') return null;
  // [G2 — NPC-AI] bark Thầy Giải Quẻ dẫn vào 5 phép (mục 05 §05.5 — mở rộng
  // từ câu thoại sẵn có que-ui.js:180, KHÔNG dựng từ số 0). Bark theo TỪNG
  // phép khi đổi tab nằm ở que-ui.js (không thuộc đợt này) — ở đây bark lúc
  // mở trạm; nút «🎙 Nhờ Thầy luận thêm» giữ nguyên vai AI của Thầy AI.
  stationBark(api, 'que');
  return lazyBody(async () => (await import('./que-ui.js')).queBody(api, { R, who: api.state.player?.name || 'Bạn' }));
}

// Vận Mệnh Các + Thái Tuế Điện (web) — bảng nạp lười; iOS loại hẳn khỏi gói
function openVan(name, ...args) {
  return (api) => {
    if (import.meta.env.MODE === 'ios') return null;
    return lazyBody(async () => (await import('./vanmenh-ui.js'))[name](api, ...args));
  };
}
const VAN_OPEN = { vanbia: openVan('vanBiaBody'), thaitue: openVan('thaiTueBody') };
// Tàng Y Các (quầy Thợ May trong sân) — cùng bảng với nút «Y Các»
VAN_OPEN.tangy = (api) => lazyBody(async () => (await import('./wardrobe-ui.js')).wardrobeBody(api));
for (let i = 0; i < 9; i++) VAN_OPEN[`van${i}`] = openVan('vanGateBody', i);

export const STATION_OPEN = { thay: openThay, compass: openCompass, xam: openXam, huong: openHuong, lich: openLich, tra: openTra, sen: openSen, an0: openCaseSlot(0), an1: openCaseSlot(1), an2: openCaseSlot(2), trach: openTrach, duongtrach: openDuongTrach, que: openQue, ...HALL_OPEN, ...VAN_OPEN };
export { ROBE };
