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
  const k = `${p.year}-${p.month}-${p.day}-${p.hour}-${p.minute}-${p.gender}`;
  if (!chartCache.has(k)) chartCache.set(k, analyze(p.year, p.month, p.day, p.hour, p.minute, p.gender, new Date().getFullYear()));
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
    const cards = body.querySelectorAll('.hq-pillar');
    cards.forEach((c, i) => setTimeout(() => { c.classList.add('flip'); knock(700, 0.2); }, 900 + i * 600));
    const tm = setTimeout(() => { finish(); bell(330, 0.12); }, 900 + cards.length * 600 + 500);
    body.querySelector('[data-role=skip]').onclick = () => { clearTimeout(tm); body.querySelectorAll('.hq-pillar').forEach((c) => c.classList.add('flip')); finish(); };
  } else {
    body.querySelectorAll('.hq-pillar').forEach((c) => c.classList.add('flip'));
    finish();
  }
  return body;
}

function openThay(api) {
  const { state } = api;
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
  if (S.sticksLeft(state) === 0) {
    const last = state.sticks.find((x) => x.accepted);
    return el(`<div><p>Hôm nay khách đã nhận đủ ${S.CAPS.sticksPerDay} thẻ. Mai hãy quay lại — quẻ hỏi nhiều thì lòng càng rối.</p>
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
  const body = el(`<div class="hq-tra">
    <div data-role="setup">
      <p class="hq-sub">Khách ngồi xuống bồ đoàn. Ấm nước vừa sôi.</p>
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
    if (!(await api.setSitting(true))) { api.toast('Ba bồ đoàn đều có khách ngồi — đợi chút nhé.'); return; }
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
  const body = el(`<form class="hq-form">
    <label>Điều ước gửi theo đèn <textarea class="hq-input" name="wish" maxlength="80" rows="2" placeholder="vd: mong mẹ khoẻ"></textarea></label>
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

function openCaseSlot(slot) {
  return (api) => {
    const npc = api.todayNpc(slot);
    if (S.caseDone(api.state, slot)) {
      const b = el(`<div><p>${esc(npc.call)} đã được giải án hôm nay. Mai sẽ có khách mới.</p>
        <div class="hq-actions"><button class="hq-btn hq-primary" data-role="redo">Giải lại để luyện (không tính điểm)</button></div></div>`);
      b.querySelector('[data-role=redo]').onclick = () => api.panel.open({ title: npc.call, body: lazyBody(async () => (await import('./case-ui.js')).npcCaseBody(api, slot, npc)) });
      return b;
    }
    return lazyBody(async () => (await import('./case-ui.js')).npcCaseBody(api, slot, npc));
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
function openHall(id, doneText, shared = false) {
  return (api) => {
    let pid = 'local';
    try { pid = localStorage.getItem('huyenquan:pid') || 'local'; } catch (e) { /* ignore */ }
    const day = S.todayStr(new Date());
    const key = shared ? day : `${day}:${pid}`;
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
  return lazyBody(async () => (await import('./que-ui.js')).queBody(api, { R, who: api.state.player?.name || 'Bạn' }));
}

export const STATION_OPEN = { thay: openThay, compass: openCompass, xam: openXam, huong: openHuong, lich: openLich, tra: openTra, sen: openSen, an0: openCaseSlot(0), an1: openCaseSlot(1), an2: openCaseSlot(2), trach: openTrach, duongtrach: openDuongTrach, que: openQue, ...HALL_OPEN };
export { ROBE };
