// ============================================================================
//  MINI-GAME VIỆC LÀM (DOM + canvas, không three) — mỗi việc một trò ngắn, trả điểm 0–1 cho máy chủ chấm.
//  Hạt giống (seed) do máy chủ cấp → bố cục tất định (vùng nhiệt, toa thuốc, tâm bàn xoay, điểm ngọt quặng).
//   fire  — Đầu bếp: canh lửa 3 món, giữ kim nhiệt trong vùng xanh (giữ = quạt lửa, buông = lửa hạ)
//   herbs — Bốc thuốc: nhớ toa 4 vị, bốc đúng ngăn trong tủ 12 ngăn
//   wheel — Thợ gốm: chạm khi vạch chạy qua tâm, 6 vòng, tâm hẹp dần
//   ore   — Thợ mỏ: 3 nhát búa, đánh khi lực rơi vào điểm ngọt
//  Điều khiển: chạm / nhấp, hoặc phím Space. Esc / nút «Thôi» = huỷ (không tính việc).
// ============================================================================
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const DISHES = ['Canh sen hầm', 'Cá chép om tương', 'Vịt quay mật ong', 'Đậu hũ non sốt nấm', 'Thịt kho tộ', 'Rau cải xào tỏi', 'Hoành thánh nước', 'Gà hấp lá sen', 'Bánh bột lọc', 'Chè hạt sen'];
// vị thuốc theo ngũ hành (màu ngăn tủ theo hành)
export const HERBS = [
  ['Đương quy', '火'], ['Hoàng kỳ', '土'], ['Cam thảo', '土'], ['Bạch truật', '土'], ['Phục linh', '水'], ['Xuyên khung', '木'],
  ['Thục địa', '水'], ['Bạch thược', '金'], ['Đảng sâm', '金'], ['Kỷ tử', '火'], ['Trần bì', '木'], ['Liên nhục', '水'],
  ['Hoài sơn', '土'], ['Táo đỏ', '火'], ['Sinh khương', '金'], ['Mạch môn', '木'],
];
const WXC = { 木: '#4f7a3a', 火: '#b3402a', 土: '#a07a3a', 金: '#9a9a8a', 水: '#2f5a78' };

/** mở trò `kind`; trả Promise<số 0–1 | null (huỷ)>. opts: { root, title, hint } */
export function play(kind, seed, opts = {}) {
  const G = GAMES[kind];
  if (!G) return Promise.resolve(null);
  const root = opts.root || document.body;
  const ov = document.createElement('div');
  ov.className = 'hq-mg';
  ov.innerHTML = `<div class="hq-mg-card"><div class="hq-mg-top"><b>${esc(opts.title || G.title)}</b><button class="hq-mg-x" type="button">Thôi</button></div>
    <p class="hq-mg-hint">${esc(opts.hint || G.hint)}</p><canvas width="340" height="210"></canvas><div class="hq-mg-ui"></div>
    <button class="hq-mg-go" type="button">${esc(opts.button || G.button || 'Giữ / chạm')}</button></div>`;
  root.appendChild(ov);
  const cv = ov.querySelector('canvas'), g = cv.getContext('2d'), ui = ov.querySelector('.hq-mg-ui'), go = ov.querySelector('.hq-mg-go');
  return new Promise((resolve) => {
    let done = false, raf = 0;
    const input = { down: false, taps: 0, tapAt: [] };
    const finish = (score) => {
      if (done) return; done = true; cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      ov.classList.add('out'); setTimeout(() => ov.remove(), 250);
      resolve(score == null ? null : clamp01(score));
    };
    const press = () => { if (!input.down) { input.down = true; input.taps += 1; input.tapAt.push(performance.now()); } };
    const release = () => { input.down = false; };
    const kd = (e) => { if (e.code === 'Space') { e.preventDefault(); press(); } else if (e.code === 'Escape') finish(null); };
    const ku = (e) => { if (e.code === 'Space') release(); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    for (const el of [go, cv]) {
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); press(); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(ev, release);
    }
    ov.querySelector('.hq-mg-x').onclick = () => finish(null);
    const st = G.init(rng(seed), { ui, go, cv, finish, input, opts });
    let last = performance.now();
    const loop = (now) => {
      if (done) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const r = G.step(st, dt, input, now);
      G.draw(g, st, cv.width, cv.height);
      if (r != null) { finish(r); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });
}

function bar(g, x, y, w, h, bg = '#2a1e16') { g.fillStyle = bg; g.fillRect(x, y, w, h); }
function txt(g, s, x, y, size = 15, col = '#f3e4c4', align = 'center') { g.font = `600 ${size}px serif`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); }

const GAMES = {
  // ---------------- Đầu bếp: canh lửa ----------------
  fire: {
    title: '🍳 Canh lửa · Đầu bếp tửu lâu', button: 'Giữ để quạt lửa',
    hint: 'Giữ nút (hoặc Space) để quạt lửa lên, buông ra lửa hạ. Giữ kim nhiệt trong vùng xanh của từng món.',
    init(R, env = {}) {
      const DISH = Array.isArray(env.opts?.items) && env.opts.items.length ? env.opts.items : DISHES; // nghề khác (P7)
      const dishes = Array.from({ length: 3 }, () => ({ name: DISH[Math.floor(R() * DISH.length)], lo: 18 + R() * 52, w: 18 + R() * 8 }));
      return { R, dishes, i: 0, t: -2.2, heat: 30, vel: 0, inZone: 0, total: 0, per: 7, noise: 0 };
    },
    step(s, dt, inp) {
      s.t += dt;
      if (s.t < 0) return null;
      const d = s.dishes[s.i];
      s.noise += (s.R() - 0.5) * 30 * dt; s.noise *= 0.96;
      s.vel += ((inp.down ? 70 : -48) + s.noise) * dt; s.vel *= 0.9;
      s.heat = Math.max(0, Math.min(100, s.heat + s.vel * dt * 2.2));
      s.total += dt; if (s.heat >= d.lo && s.heat <= d.lo + d.w) s.inZone += dt;
      if (s.t >= s.per) { s.t = 0; s.i += 1; if (s.i >= s.dishes.length) return Math.min(1, (s.inZone / s.total) * 1.12); }
      return null;
    },
    draw(g, s, W, H) {
      g.clearRect(0, 0, W, H); bar(g, 0, 0, W, H, '#1c140f');
      const d = s.dishes[Math.min(s.i, s.dishes.length - 1)];
      txt(g, s.t < 0 ? 'Nhóm lửa…' : `Món ${s.i + 1}/3: ${d.name}`, W / 2, 18, 15);
      const x = 60, y = 36, h = 150, w = 34;
      bar(g, x, y, w, h);
      g.fillStyle = '#3f7a3a'; g.fillRect(x, y + h - ((d.lo + d.w) / 100) * h, w, (d.w / 100) * h);
      const hy = y + h - (s.heat / 100) * h;
      g.fillStyle = s.heat >= d.lo && s.heat <= d.lo + d.w ? '#ffd27a' : '#ff6a3a'; g.fillRect(x - 8, hy - 2, w + 16, 4);
      // lửa
      const f = s.heat / 100;
      for (let k = 0; k < 7; k++) { g.fillStyle = `rgba(255,${120 + k * 15},40,${0.15 + f * 0.1})`; g.beginPath(); g.ellipse(220, 170 - k * 6 * f, 60 - k * 7, 10 + f * 40 - k * 4, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#3a2a1e'; g.fillRect(150, 172, 140, 26);
      txt(g, `${Math.round((s.inZone / Math.max(0.01, s.total)) * 100)}% trong vùng`, 220, 48, 13, '#cdb88f');
      const left = s.t < 0 ? '' : `${Math.max(0, s.per - s.t).toFixed(1)} s`;
      txt(g, left, 220, 70, 13, '#cdb88f');
    },
  },
  // ---------------- Bốc thuốc: nhớ toa, bốc đúng ngăn ----------------
  herbs: {
    title: '🌿 Bốc thuốc · Dược Phòng', button: '—',
    hint: 'Nhớ 4 vị trong toa (hiện 4 giây), rồi chạm đúng 4 ngăn tủ. Chạm nhầm bị trừ điểm.',
    init(R, { go, ui, cv, opts }) {
      go.hidden = true;
      const src = Array.isArray(opts?.items) && opts.items.length >= 12 ? opts.items : HERBS; // nghề khác (P7): bộ thẻ riêng
      const pool = src.map((h, i) => ({ h, i, k: R() })).sort((a, b) => a.k - b.k).slice(0, 12).map((x) => x.h);
      const want = pool.map((h, i) => ({ h, k: R(), i })).sort((a, b) => a.k - b.k).slice(0, 4).map((x) => x.i);
      const s = { pool, want, picked: new Set(), wrong: 0, t: -4, done: false, start: 0, label: opts?.label || 'TOA THUỐC', unit: opts?.unit || 'Đã bốc' };
      ui.innerHTML = `<div class="hq-mg-grid">${pool.map((h, i) => `<button type="button" data-i="${i}" style="--c:${WXC[h[1]]}" disabled>${esc(h[0])}</button>`).join('')}</div>`;
      ui.querySelectorAll('button').forEach((b) => { b.onclick = () => {
        if (s.t < 0 || s.done) return; const i = Number(b.dataset.i); if (s.picked.has(i)) return;
        if (want.includes(i)) { s.picked.add(i); b.classList.add('ok'); } else { s.wrong += 1; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 300); }
        b.disabled = want.includes(i);
      }; });
      s.btns = ui.querySelectorAll('button'); cv.height = 90;
      return s;
    },
    step(s, dt) {
      const was = s.t; s.t += dt;
      if (was < 0 && s.t >= 0) s.btns.forEach((b) => { b.disabled = false; });
      if (s.t >= 0 && s.picked.size >= s.want.length) { s.done = true; const tf = s.t <= 10 ? 1 : Math.max(0.7, 1 - (s.t - 10) / 60); return clamp01(((s.picked.size - 0.6 * s.wrong) / s.want.length) * tf); }
      if (s.t > 40) return clamp01(((s.picked.size - 0.6 * s.wrong) / s.want.length) * 0.7);
      return null;
    },
    draw(g, s, W, H) {
      g.clearRect(0, 0, W, H); bar(g, 0, 0, W, H, '#efe4c8');
      if (s.t < 0) {
        txt(g, s.label, W / 2, 16, 14, '#6a2a1a');
        s.want.forEach((i, k) => txt(g, s.pool[i][0], 50 + k * 80, 50, 16, '#2a1a10'));
        txt(g, `${Math.ceil(-s.t)}`, W - 16, 16, 14, '#6a2a1a');
      } else txt(g, `${s.unit} ${s.picked.size}/4 · nhầm ${s.wrong}`, W / 2, H / 2, 16, '#2a1a10');
    },
  },
  // ---------------- Thợ gốm: bàn xoay ----------------
  wheel: {
    title: '🏺 Bàn xoay · Thợ gốm', button: 'Vuốt đất',
    hint: 'Chạm khi vạch chạy qua tâm sáng. 6 vòng, tâm hẹp dần — càng sát tâm, bình càng tròn.',
    init(R) { return { R, round: 0, t: -1.6, phase: R() * 6, speed: 2.2 + R() * 0.8, scores: [], flash: 0, lastTaps: 0 }; },
    step(s, dt, inp) {
      s.t += dt; s.flash = Math.max(0, s.flash - dt);
      if (s.t < 0) { s.lastTaps = inp.taps; return null; }
      s.phase += dt * (s.speed + s.round * 0.35);
      if (inp.taps > s.lastTaps) {
        s.lastTaps = inp.taps;
        const pos = Math.sin(s.phase), half = 0.3 - s.round * 0.035;
        s.scores.push(clamp01(1 - Math.abs(pos) / (half * 2.6))); s.flash = 0.35; s.round += 1;
        if (s.round >= 6) return s.scores.reduce((a, b) => a + b, 0) / s.scores.length;
      }
      return null;
    },
    draw(g, s, W, H) {
      g.clearRect(0, 0, W, H); bar(g, 0, 0, W, H, '#20160f');
      txt(g, s.t < 0 ? 'Đặt đất lên bàn…' : `Vòng ${Math.min(6, s.round + 1)}/6`, W / 2, 18);
      const cx = W / 2, y = 100, L = 130, half = (0.3 - Math.min(5, s.round) * 0.035) * L;
      bar(g, cx - L, y - 10, L * 2, 20, '#3a2a1e');
      g.fillStyle = '#c99a3e'; g.fillRect(cx - half, y - 10, half * 2, 20);
      const x = cx + Math.sin(s.phase) * L;
      g.fillStyle = s.flash ? '#fff' : '#e8d6b0'; g.fillRect(x - 2, y - 18, 4, 36);
      // chiếc bình lớn dần theo vòng
      const r = 18 + s.round * 4; g.fillStyle = '#8a5a3a'; g.beginPath(); g.ellipse(cx, 168, r, 22 + s.round * 2, 0, 0, Math.PI * 2); g.fill();
      if (s.scores.length) txt(g, `Lần trước: ${Math.round(s.scores[s.scores.length - 1] * 100)}%`, W / 2, 44, 13, '#cdb88f');
    },
  },
  // ---------------- Thợ mỏ: gõ búa ----------------
  ore: {
    title: '⛏ Đào quặng · Mỏ dân sự', button: 'Gõ búa',
    hint: 'Lực búa chạy lên xuống. Gõ khi kim lực rơi vào điểm ngọt (vạch vàng). 3 nhát tách một tảng quặng.',
    init(R) { return { R, hit: 0, t: -1, p: 0, dir: 1, sweet: 0.55 + R() * 0.3, speed: 1.3 + R() * 0.5, scores: [], lastTaps: 0, crack: 0 }; },
    step(s, dt, inp) {
      s.t += dt; s.crack = Math.max(0, s.crack - dt);
      if (s.t < 0) { s.lastTaps = inp.taps; return null; }
      s.p += s.dir * dt * (s.speed + s.hit * 0.3); if (s.p > 1) { s.p = 1; s.dir = -1; } if (s.p < 0) { s.p = 0; s.dir = 1; }
      if (inp.taps > s.lastTaps) {
        s.lastTaps = inp.taps; s.scores.push(clamp01(1 - Math.abs(s.p - s.sweet) / 0.22)); s.hit += 1; s.crack = 0.3;
        s.sweet = 0.45 + s.R() * 0.45;
        if (s.hit >= 3) return s.scores.reduce((a, b) => a + b, 0) / 3;
      }
      return null;
    },
    draw(g, s, W, H) {
      g.clearRect(0, 0, W, H); bar(g, 0, 0, W, H, '#191512');
      txt(g, s.t < 0 ? 'Xắn tay áo…' : `Nhát ${Math.min(3, s.hit + 1)}/3`, W / 2, 18);
      const x = 40, y = 30, h = 160;
      bar(g, x, y, 26, h, '#2e2620');
      g.fillStyle = '#d9a441'; g.fillRect(x - 4, y + h - s.sweet * h - 3, 34, 6);
      g.fillStyle = '#e8e2d2'; g.fillRect(x, y + h - s.p * h, 26, s.p * h);
      // tảng đá có vân
      g.fillStyle = s.crack ? '#7a6a58' : '#5a4e42'; g.beginPath(); g.moveTo(170, 170); g.lineTo(150, 110); g.lineTo(200, 70); g.lineTo(270, 90); g.lineTo(295, 160); g.closePath(); g.fill();
      g.strokeStyle = '#d9c27a'; g.lineWidth = 2; for (let k = 0; k < s.hit; k++) { g.beginPath(); g.moveTo(200 + k * 20, 80); g.lineTo(215 + k * 14, 150); g.stroke(); }
    },
  },
};
export const GAME_KINDS = Object.keys(GAMES);
