// ============================================================================
//  CANVAS PARTICLE BACKGROUND — animated element scenery (火水木金土)
//  [loop 1007] Research (css-tricks/SVGator): CSS gradients look like «colored
//    fog», amateurish. Canvas particles = REAL scenery: rising embers, flowing
//    droplets, floating leaves, shimmer motes, settling dust.
//  Reads body.theme-X class → renders element-specific particles via rAF.
//  Perf: capped count, simple shapes, pauses on tab-hidden + prefers-reduced-motion.
// ============================================================================
let canvas, ctx, raf = null, particles = [], currentTheme = null, W = 0, H = 0, dpr = 1;
let lastT = 0, reduced = false, observer = null, scrollY = 0, viewOY = 0;

const RAND = (a, b) => a + Math.random() * (b - a);

// ---- per-element particle factories (spawn at a position) ----
const FACTORIES = {
  // 火 朱砂 — soft cinnabar embers (not neon orange)
  '火': () => ({
    x: RAND(0, W), y: H + RAND(0, 40),
    vx: RAND(-0.25, 0.25), vy: -RAND(0.5, 1.6),
    size: RAND(1.2, 3.0), life: 0, max: RAND(90, 160),
    hue: RAND(8, 22), drift: RAND(0.5, 1.5),
  }),
  // 水 花青 — indigo wash droplets
  '水': () => ({
    x: RAND(-20, W), y: RAND(H * 0.45, H),
    vx: RAND(0.3, 0.9), vy: 0, baseY: 0, amp: RAND(6, 16), freq: RAND(0.01, 0.03), phase: RAND(0, 6.28),
    size: RAND(1.5, 4), life: 0, max: RAND(200, 360), hue: RAND(200, 215), alpha: RAND(0.22, 0.48),
  }),
  // 木 黛绿 — muted jade leaves
  '木': () => ({
    x: RAND(0, W), y: -RAND(0, 40),
    vx: RAND(-0.2, 0.2), vy: RAND(0.25, 0.7),
    size: RAND(3, 6), rot: RAND(0, 6.28), spin: RAND(-0.03, 0.03),
    sway: RAND(0.5, 1.4), swayPhase: RAND(0, 6.28),
    life: 0, max: RAND(300, 460), hue: RAND(110, 145),
  }),
  // 金 银白泥金 — soft metallic motes
  '金': () => ({
    x: RAND(0, W), y: RAND(0, H),
    vx: RAND(0.1, 0.4), vy: RAND(-0.15, 0.15),
    size: RAND(0.8, 2.2), life: 0, max: RAND(160, 280),
    pulse: RAND(0, 6.28), pulseSpeed: RAND(0.04, 0.09),
  }),
  // 土 赭石 — warm sand dust
  '土': () => ({
    x: RAND(0, W), y: -RAND(0, 40),
    vx: RAND(-0.1, 0.1), vy: RAND(0.15, 0.45),
    size: RAND(0.8, 2.2), life: 0, max: RAND(320, 520), hue: RAND(28, 48), alpha: RAND(0.18, 0.45),
  }),
  // default — 泥金 + 朱砂 (pre-analyze)
  default: () => ({
    x: RAND(0, W), y: RAND(0, H),
    vx: RAND(-0.18, 0.18), vy: -RAND(0.08, 0.4),
    size: RAND(0.4, 2.1), life: 0, max: RAND(300, 600), a: RAND(0, 6.28), tw: RAND(0.004, 0.029),
    c: ['232,210,138', '201,168,76', '243,230,192', '184,66,50'][(Math.random() * 4) | 0],
  }),
};

const COUNT = { '火': 70, '水': 55, '木': 34, '金': 80, '土': 50, default: 50 };

function readTheme() {
  const m = (document.body.className.match(/theme-(木|火|土|金|水)/) || [])[1];
  return m || 'default';
}

function spawnAll(theme) {
  const f = FACTORIES[theme];
  if (!f) { particles = []; return; }
  // stagger initial life so they don't all spawn at once
  particles = Array.from({ length: COUNT[theme] }, () => {
    const p = f();
    p.life = RAND(0, p.max);
    if (p.baseY != null) p.baseY = p.y;
    return p;
  });
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---- per-element update + draw ----
function tick(t) {
  if (reduced) return; // static — no rAF loop
  raf = requestAnimationFrame(tick);
  const dt = lastT ? Math.min((t - lastT) / 16.67, 2.5) : 1;
  lastT = t;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset each frame (parallax translate must not accumulate)
  ctx.clearRect(0, 0, W, H);
  if (!currentTheme) return;
  // Parallax depth: field drifts subtly with scroll (Active-Theory "space"). Capped ±20px
  // + eased so it never reveals edges or causes nausea; effectively off under reduced-motion.
  const targetOY = Math.max(-20, Math.min(20, -scrollY * 0.015));
  viewOY += (targetOY - viewOY) * 0.1;
  if (viewOY) ctx.translate(0, viewOY);
  const f = FACTORIES[currentTheme];
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life += dt;
    if (p.life >= p.max) { Object.assign(p, f(), { life: 0 }); if (p.baseY != null) p.baseY = p.y; }
    DRAW[currentTheme](p, dt);
  }
}

const DRAW = {
  '火': (p, dt) => {
    p.x += p.vx * dt + Math.sin(p.life * 0.05) * 0.3 * p.drift;
    p.y += p.vy * dt;
    const k = p.life / p.max;            // 0→1 over lifetime
    const a = (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85) * 0.9; // fade in/out
    const hue = p.hue + k * 12;          // yellow→orange→red
    const r = p.size * (1 + k * 0.4);
    const flick = 0.7 + Math.sin(p.life * 0.4) * 0.3;
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
    g.addColorStop(0, `hsla(${hue}, 100%, ${65 - k * 15}%, ${a * flick})`);
    g.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, 6.2832); ctx.fill();
  },
  '水': (p, dt) => {
    p.x += p.vx * dt;
    const wy = p.baseY + Math.sin(p.life * p.freq + p.phase) * p.amp;
    const k = p.life / p.max;
    const a = (k < 0.1 ? k / 0.1 : 1 - (k - 0.9) / 0.1) * p.alpha;
    if (a <= 0) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${a})`;
    ctx.beginPath(); ctx.arc(p.x, wy, p.size, 0, 6.2832); ctx.fill();
    // tiny highlight (bubble feel)
    ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${a * 0.6})`;
    ctx.beginPath(); ctx.arc(p.x - p.size * 0.3, wy - p.size * 0.3, p.size * 0.35, 0, 6.2832); ctx.fill();
  },
  '木': (p, dt) => {
    p.x += p.vx * dt + Math.sin(p.life * 0.03 + p.swayPhase) * p.sway * 0.4;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;
    const k = p.life / p.max;
    const a = (k < 0.08 ? k / 0.08 : 1 - (k - 0.85) / 0.15);
    if (a <= 0) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = `hsla(${p.hue}, 55%, ${45 + Math.sin(p.life * 0.05) * 8}%, ${a * 0.85})`;
    ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, 6.2832); ctx.fill();
    ctx.restore();
  },
  '金': (p, dt) => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.pulse += p.pulseSpeed * dt;
    const k = p.life / p.max;
    const a = (k < 0.1 ? k / 0.1 : 1 - (k - 0.8) / 0.2);
    const shine = (Math.sin(p.pulse) * 0.5 + 0.5);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
    g.addColorStop(0, `rgba(245, 245, 255, ${a * shine})`);
    g.addColorStop(0.4, `rgba(210, 215, 230, ${a * shine * 0.3})`);
    g.addColorStop(1, 'rgba(210, 215, 230, 0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 5, 0, 6.2832); ctx.fill();
  },
  '土': (p, dt) => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    const k = p.life / p.max;
    const a = (k < 0.1 ? k / 0.1 : 1 - (k - 0.7) / 0.3) * p.alpha;
    if (a <= 0) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `hsla(${p.hue}, 45%, 55%, ${a})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.2832); ctx.fill();
  },
  // default — gold rising motes, additive radial glow (no shadowBlur = mobile-friendly).
  //   shadowBlur per-frame was a perf killer on low-end Android; radialGradient matches
  //   火/金 pattern (consistent glow) while costing less. Default theme = first-load bg.
  default: (p, dt) => {
    p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.tw * dt;
    if (p.y < -10) p.y = H + 10;
    if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
    const k = p.life / p.max;
    const fade = k < 0.1 ? k / 0.1 : 1 - (k - 0.85) / 0.15;
    const alpha = (Math.sin(p.a) * 0.4 + 0.5) * 0.7 * fade;
    if (alpha <= 0) return;
    ctx.globalCompositeOperation = 'lighter';
    const r = p.size * 4;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    g.addColorStop(0, `rgba(${p.c},${alpha.toFixed(3)})`);
    g.addColorStop(0.4, `rgba(${p.c},${(alpha * 0.35).toFixed(3)})`);
    g.addColorStop(1, `rgba(${p.c},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
  },
};

function setTheme(theme) {
  if (theme === currentTheme) return;
  currentTheme = theme;
  if (!theme) { if (raf) { cancelAnimationFrame(raf); raf = null; } ctx.clearRect(0, 0, W, H); return; }
  spawnAll(theme);
  if (reduced) { renderStatic(); return; }
  if (!raf) { lastT = 0; raf = requestAnimationFrame(tick); }
}

function renderStatic() {
  // prefers-reduced-motion: draw ONE frame, no loop
  ctx.clearRect(0, 0, W, H);
  if (!currentTheme) return;
  for (const p of particles) DRAW[currentTheme](p, 0);
}

export function initBgParticles() {
  canvas = document.getElementById('mote-field');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });
  scrollY = window.scrollY || 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    else if (currentTheme && !reduced && !raf) { lastT = 0; raf = requestAnimationFrame(tick); }
  });
  // react to theme class changes on <body>
  observer = new MutationObserver(() => setTheme(readTheme()));
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  setTheme(readTheme());
}
