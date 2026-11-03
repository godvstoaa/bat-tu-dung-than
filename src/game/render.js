// ============================================================================
//  HUYỀN QUÁN — vẽ sân quán bằng canvas (pixel art sinh bằng code, không file ảnh).
//  Đơn vị vẽ = ô (TILE px logic); ctx đã scale sẵn theo độ phân giải màn hình.
// ============================================================================
import { COLS, ROWS, TILE, STATIONS, PROPS } from './world.js';
import { incenseState } from './state.js';

const T = TILE;
export const ROBE = { 木: '#3f8a4f', 火: '#b3261e', 土: '#b0843a', 金: '#d9d4c7', 水: '#2c4f8a' };
const C = {
  brick: '#3a2f2a', brick2: '#41352f', wall: '#5a4a3e', roof: '#7a2d22', roof2: '#5e2019', ridge: '#d6a84a',
  wood: '#6b3f26', wood2: '#8a5634', paper: '#f3e7cf', son: '#b3261e', gold: '#d6a84a', stone: '#6f6a63',
  water: '#1f4a5e', water2: '#2a6077', leaf: '#3c6b3a', pine: '#24452f', pink: '#e8a3b8', skin: '#e9c8a5', hair: '#2a1f1a',
};

const rect = (ctx, x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };

// Pha trong ngày theo giờ máy: 0 = ngày, 1 = đêm (chuyển dần lúc hoàng hôn/bình minh).
export function nightLevel(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 6.5 && h < 17) return 0;
  if (h >= 17 && h < 19) return (h - 17) / 2 * 0.85;
  if (h >= 5 && h < 6.5) return (6.5 - h) / 1.5 * 0.85;
  return 0.85;
}

function drawRoof(ctx, x, y, w, h) {
  // mái ngói cong: thân mái + đường ngói + nóc vàng + đầu đao vểnh
  rect(ctx, x - 6, y + h - 6, w + 12, 6, C.roof2);
  rect(ctx, x, y, w, h - 4, C.roof);
  ctx.fillStyle = C.roof2;
  for (let i = x + 4; i < x + w; i += 8) ctx.fillRect(i, y + 2, 2, h - 8);
  rect(ctx, x + 4, y - 3, w - 8, 4, C.ridge);
  rect(ctx, x - 9, y + h - 10, 5, 4, C.ridge);
  rect(ctx, x + w + 4, y + h - 10, 5, 4, C.ridge);
}

function drawGround(ctx) {
  rect(ctx, 0, 0, COLS * T, ROWS * T, C.brick);
  for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
    if ((r + c) % 2) rect(ctx, c * T, r * T, T, T, C.brick2);
    rect(ctx, c * T, r * T + T - 1, T, 1, '#2f2622');
  }
  // lối đi đá từ cổng lên chính đường
  for (let r = 4; r < ROWS - 1; r++) rect(ctx, 9 * T + 4, r * T, 2 * T - 8, T, (r % 2) ? '#4d443c' : '#544a41');
}

function drawWalls(ctx) {
  rect(ctx, 0, 0, COLS * T, T, C.wall);
  rect(ctx, 0, 0, T, ROWS * T, C.wall);
  rect(ctx, (COLS - 1) * T, 0, T, ROWS * T, C.wall);
  rect(ctx, 0, (ROWS - 1) * T, COLS * T, T, C.wall);
  rect(ctx, 0, T - 6, COLS * T, 6, C.roof);
  rect(ctx, 0, (ROWS - 1) * T, COLS * T, 6, C.roof);
  // cổng tam quan
  const gx = 8 * T, gy = (ROWS - 1) * T;
  rect(ctx, 9 * T, gy + 6, 2 * T, T - 6, '#1d1714');
  rect(ctx, gx + 6, gy - 10, 6, T + 10, C.son);
  rect(ctx, gx + 4 * T - 12, gy - 10, 6, T + 10, C.son);
  drawRoof(ctx, gx, gy - 22, 4 * T, 16);
}

function drawHall(ctx, t, scene) {
  const x = 7 * T, y = T;
  rect(ctx, x + 4, y + 30, 6 * T - 8, 2 * T + 2, C.wood);
  for (let i = 0; i < 5; i++) rect(ctx, x + 10 + i * 44, y + 40, 26, 50, i === 2 ? '#3b2416' : C.wood2);
  rect(ctx, x + 6 * T / 2 - 22, y + 34, 44, 10, C.paper);
  ctx.fillStyle = C.son; ctx.font = 'bold 8px serif'; ctx.textAlign = 'center';
  ctx.fillText('玄 館', x + 3 * T, y + 42);
  for (const cx of [x + 6, x + 6 * T - 12]) rect(ctx, cx, y + 26, 6, 2 * T + 6, C.son);
  drawRoof(ctx, x, y - 2, 6 * T, 30);
  // thầy ngồi sau bàn
  const mx = 10 * T, my = 4 * T - 4;
  rect(ctx, mx - 9, my - 14, 18, 18, '#4a3b5c');
  rect(ctx, mx - 6, my - 26, 12, 12, C.skin);
  rect(ctx, mx - 7, my - 28, 14, 5, '#cfcfcf');
  rect(ctx, mx - 3, my - 16, 6, 4, '#cfcfcf');
  // bàn + giấy + nghiên mực
  rect(ctx, 9 * T + 2, 4 * T + 2, 2 * T - 4, 20, C.wood2);
  rect(ctx, 9 * T + 2, 4 * T + 22, 2 * T - 4, 4, C.wood);
  rect(ctx, 9 * T + 12, 4 * T + 6, 22, 10, C.paper);
  rect(ctx, 10 * T + 14, 4 * T + 7, 10, 7, '#1b1b1b');
  if (scene.lanterns) for (const lx of [x + 18, x + 6 * T - 18]) drawLantern(ctx, lx, y + 30, t, scene.night);
}

function drawTea(ctx, scene) {
  const x = T, y = T;
  rect(ctx, x + 2, y + 18, 5 * T - 4, 2 * T - 18, C.wood2);
  rect(ctx, x + 2, y + 2 * T - 4, 5 * T - 4, 4, C.wood);
  for (const cx of [x + 6, x + 5 * T - 12]) rect(ctx, cx, y + 14, 5, 2 * T - 14, C.son);
  drawRoof(ctx, x, y - 2, 5 * T, 22);
  // bàn trà thấp + ấm chén
  rect(ctx, 3 * T - 10, 2 * T + 6, 2 * T - 12, 12, C.wood);
  rect(ctx, 3 * T + 4, 2 * T, 10, 8, '#7a4b33');
  rect(ctx, 3 * T + 18, 2 * T + 3, 5, 4, scene.teaColor || '#c9b46a');
  // bồ đoàn
  for (const cx of [2, 3, 4, 5]) {
    ctx.fillStyle = '#8c6a2f'; ctx.beginPath(); ctx.ellipse(cx * T - 8, 3 * T + 12, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawCompass(ctx, t) {
  const cx = 16.5 * T, cy = 2 * T;
  rect(ctx, 15 * T + 2, T + 6, 3 * T - 4, 2 * T - 6, C.stone);
  rect(ctx, 15 * T + 2, 3 * T - 4, 3 * T - 4, 4, '#55514b');
  const cols = ['#c9a24a', '#8a6d2e'];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = cols[i % 2];
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 26, (i * 45 - 112.5) * Math.PI / 180, (i * 45 - 67.5) * Math.PI / 180);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#2a1d10'; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
  const a = Math.sin(t / 1400) * 0.25;
  ctx.strokeStyle = C.son; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(cx - Math.sin(a) * 8, cy + Math.cos(a) * 8); ctx.lineTo(cx + Math.sin(a) * 20, cy - Math.cos(a) * 20); ctx.stroke();
}

function drawXam(ctx, t) {
  const x = 2 * T, y = 6 * T;
  rect(ctx, x + 2, y + 18, 2 * T - 4, 2 * T - 22, C.wood);
  rect(ctx, x, y + 14, 2 * T, 10, C.son);
  rect(ctx, x + 22, y + 2, 20, 20, '#9b6b2f');
  for (let i = 0; i < 6; i++) rect(ctx, x + 24 + i * 3, y - 6 - (i % 3) * 2, 2, 10, '#d9c27a');
  for (const cx of [x + 8, x + 2 * T - 12]) {
    rect(ctx, cx, y + 6, 4, 9, '#efe3c4');
    const f = (Math.sin(t / 120 + cx) + 1) / 2;
    rect(ctx, cx + 1, y + 2 - f * 2, 2, 4 + f * 2, '#ffb547');
  }
}

function drawIncense(ctx, t, scene, smoke) {
  const cx = 10 * T, y = 7 * T;
  const inc = incenseState(scene.state, scene.now);
  ctx.fillStyle = '#7d5a2b'; ctx.beginPath(); ctx.ellipse(cx, y + 18, 26, 10, 0, 0, Math.PI * 2); ctx.fill();
  rect(ctx, cx - 22, y + 6, 44, 12, '#8f6a33');
  rect(ctx, cx - 26, y + 4, 52, 4, '#a47b3d');
  rect(ctx, cx - 18, y + 24, 6, 8, '#6a4a22'); rect(ctx, cx + 12, y + 24, 6, 8, '#6a4a22');
  if (inc.burning) {
    const len = 22 * (1 - inc.progress) + 3;
    for (const dx of [-8, 0, 8]) {
      rect(ctx, cx + dx, y + 4 - len, 2, len, '#b54a2a');
      rect(ctx, cx + dx, y + 3 - len, 2, 2, '#ff8a3d');
      if (!scene.reduced && Math.random() < 0.08) smoke.push({ x: cx + dx + 1, y: y + 2 - len, vx: (Math.random() - 0.5) * 6, life: 0 });
    }
  }
}

function drawLich(ctx, scene) {
  const x = 16 * T, y = 6 * T;
  rect(ctx, x + 2, y + 2, 2 * T - 4, 2 * T - 10, C.wood);
  rect(ctx, x + 8, y + 8, 2 * T - 16, 2 * T - 24, C.son);
  rect(ctx, x + 8, y + 2 * T - 10, 4, 10, C.wood); rect(ctx, x + 2 * T - 12, y + 2 * T - 10, 4, 10, C.wood);
  ctx.fillStyle = C.paper; ctx.textAlign = 'center';
  ctx.font = 'bold 16px serif'; ctx.fillText(String(scene.now.getDate()), x + T, y + 28);
  ctx.font = '8px serif'; ctx.fillText(scene.dayGanZhi || '', x + T, y + 40);
}

function drawPond(ctx, t, scene) {
  const x = 6 * T, y = 10 * T, w = 8 * T, h = 2 * T;
  rect(ctx, x - 3, y - 3, w + 6, h + 6, C.stone);
  rect(ctx, x, y, w, h, C.water);
  for (let i = 0; i < 6; i++) {
    const wx = x + ((i * 47 + t / 60) % w);
    rect(ctx, wx, y + 8 + (i * 13) % (h - 16), 10, 1, C.water2);
  }
  const pads = [[18, 14], [70, 40], [150, 18], [205, 44], [240, 12]];
  for (const [px, py] of pads) {
    ctx.fillStyle = C.leaf; ctx.beginPath(); ctx.ellipse(x + px, y + py, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
    rect(ctx, x + px - 2, y + py - 4, 4, 4, C.pink);
  }
  // đèn hoa đăng của hôm nay trôi qua hồ
  scene.todayLanterns.forEach((_, i) => {
    const lx = x + 8 + ((t / 90 + i * 70) % (w - 16));
    const ly = y + 22 + Math.sin(t / 700 + i) * 3 + (i % 2) * 12;
    rect(ctx, lx - 5, ly, 10, 4, '#e7b3c4');
    rect(ctx, lx - 2, ly - 5, 4, 5, '#ffd28a');
    if (scene.night > 0.2) { ctx.fillStyle = 'rgba(255,190,90,0.25)'; ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI * 2); ctx.fill(); }
  });
}

function drawProp(ctx, p, scene) {
  const x = p.c * T, y = p.r * T;
  if (p.type === 'peach') {
    rect(ctx, x + 13, y + 12, 6, 20, '#5a3a24');
    ctx.fillStyle = scene.peachBloom ? C.pink : '#5f7f45';
    for (const [dx, dy, rr] of [[16, 8, 12], [7, 14, 8], [25, 14, 8], [16, 0, 8]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  } else {
    rect(ctx, x + 14, y + 20, 5, 12, '#4a2f1d');
    ctx.fillStyle = C.pine;
    for (const [dy, hw] of [[-6, 9], [2, 12], [10, 15]]) { ctx.beginPath(); ctx.moveTo(x + 16, y + dy - 6); ctx.lineTo(x + 16 - hw, y + dy + 10); ctx.lineTo(x + 16 + hw, y + dy + 10); ctx.closePath(); ctx.fill(); }
  }
}

function drawLantern(ctx, x, y, t, night) {
  rect(ctx, x - 1, y - 6, 2, 6, '#2b1a10');
  rect(ctx, x - 5, y, 10, 12, '#c4301f');
  rect(ctx, x - 6, y + 2, 12, 8, '#d93b27');
  rect(ctx, x - 1, y + 12, 2, 4, C.gold);
  if (night > 0.15) {
    ctx.fillStyle = `rgba(255,170,80,${0.18 * night + 0.05 * Math.sin(t / 300)})`;
    ctx.beginPath(); ctx.arc(x, y + 6, 22, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawPlayer(ctx, p, t, isSelf = true) {
  const x = p.x * T, y = p.y * T;
  const moving = p.moving && !p.sitting;
  const bob = moving ? Math.abs(Math.sin(t / 110)) * 2 : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, y, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
  const robe = ROBE[p.robe] || ROBE.土;
  if (p.sitting) {
    rect(ctx, x - 8, y - 12, 16, 10, robe);
    rect(ctx, x - 5, y - 22, 10, 10, C.skin);
    rect(ctx, x - 5, y - 23, 10, 4, C.hair);
  } else {
    const step = moving ? Math.round(Math.sin(t / 110) * 2) : 0;
    rect(ctx, x - 4, y - 4, 3, 4 + step, '#2b2b2b');
    rect(ctx, x + 1, y - 4, 3, 4 - step, '#2b2b2b');
    rect(ctx, x - 6, y - 16 - bob, 12, 13, robe);
    rect(ctx, x - 6, y - 6 - bob, 12, 2, 'rgba(0,0,0,0.2)');
    rect(ctx, x - 5, y - 26 - bob, 10, 10, C.skin);
    rect(ctx, x - 5, y - 27 - bob, 10, 4, C.hair);
    const eye = p.face === 'up' ? null : (p.face === 'left' ? [-3] : p.face === 'right' ? [2] : [-3, 2]);
    if (eye) for (const ex of eye) rect(ctx, x + ex, y - 21 - bob, 1, 2, '#1a1a1a');
  }
  ctx.font = '7px sans-serif'; ctx.textAlign = 'center';
  const top = y - (p.sitting ? 28 : 33);
  const label = p.name || '';
  const w = ctx.measureText(label).width + 8;
  ctx.fillStyle = 'rgba(15,12,20,0.7)'; ctx.fillRect(x - w / 2, top - 8, w, 10);
  ctx.fillStyle = isSelf && p.gold ? C.gold : '#f3e7cf';
  ctx.fillText(label, x, top);
}

function drawLabels(ctx, scene) {
  ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
  for (const st of STATIONS) {
    const near = scene.near && scene.near.id === st.id;
    const lx = st.label.x * T, ly = st.label.y * T;
    const w = ctx.measureText(st.name).width + 10;
    ctx.fillStyle = near ? 'rgba(179,38,30,0.9)' : 'rgba(15,12,20,0.55)';
    ctx.fillRect(lx - w / 2, ly - 8, w, 11);
    ctx.fillStyle = near ? '#fff4dc' : 'rgba(243,231,207,0.8)';
    ctx.fillText(st.name, lx, ly);
  }
}

function drawCrane(ctx, t) {
  const x = 12.4 * T, y = 0.85 * T + Math.sin(t / 900) * 1;
  rect(ctx, x, y - 8, 10, 6, '#f2f2f2');
  rect(ctx, x + 8, y - 16, 2, 9, '#f2f2f2');
  rect(ctx, x + 8, y - 18, 4, 3, '#c4301f');
  rect(ctx, x + 2, y - 2, 1, 6, '#333'); rect(ctx, x + 6, y - 2, 1, 6, '#333');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const smoke = [];
  let scale = 2;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    scale = Math.max(1, Math.min(4, Math.round((r.width * dpr) / (COLS * T)) || 1));
    canvas.width = COLS * T * scale;
    canvas.height = ROWS * T * scale;
  }

  function frame(scene, dt) {
    const t = scene.time;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    drawGround(ctx);
    drawWalls(ctx);
    drawTea(ctx, scene);
    drawCompass(ctx, scene.reduced ? 0 : t);
    drawXam(ctx, scene.reduced ? 0 : t);
    drawLich(ctx, scene);
    drawPond(ctx, scene.reduced ? 0 : t, scene);
    // vật thể sắp theo chiều sâu (y) để khách đi sau/trước đúng
    const items = [
      { y: 4.2, d: () => drawHall(ctx, t, scene) },
      { y: 8, d: () => drawIncense(ctx, t, scene, smoke) },
      ...PROPS.map((p) => ({ y: p.r + 1, d: () => drawProp(ctx, p, scene) })),
      { y: scene.player.y, d: () => drawPlayer(ctx, scene.player, scene.reduced ? 0 : t) },
    ].sort((a, b) => a.y - b.y);
    for (const it of items) it.d();
    // khói nhang
    for (let i = smoke.length - 1; i >= 0; i--) {
      const s = smoke[i];
      s.life += dt; s.y -= dt * 14; s.x += s.vx * dt + Math.sin((s.life + i) * 3) * 0.2;
      if (s.life > 2.6) { smoke.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(220,220,230,${0.35 * (1 - s.life / 2.6)})`;
      ctx.fillRect(s.x, s.y, 2 + s.life * 2, 2 + s.life * 2);
    }
    if (scene.crane) drawCrane(ctx, scene.reduced ? 0 : t);
    for (const lx of [8.3 * T, 11.7 * T]) drawLantern(ctx, lx, (ROWS - 1) * T - 4, t, scene.night);
    if (scene.target) {
      ctx.strokeStyle = 'rgba(214,168,74,0.8)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(scene.target.x * T, scene.target.y * T, 6, 3, 0, 0, Math.PI * 2); ctx.stroke();
    }
    if (scene.night > 0) {
      ctx.fillStyle = `rgba(12,10,40,${scene.night * 0.55})`;
      ctx.fillRect(0, 0, COLS * T, ROWS * T);
    }
    drawLabels(ctx, scene);
  }

  return { resize, frame, get scale() { return scale; } };
}

// Toạ độ client (px) → toạ độ ô.
export function clientToTile(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return { x: ((clientX - r.left) / r.width) * COLS, y: ((clientY - r.top) / r.height) * ROWS };
}
