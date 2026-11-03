// ============================================================================
//  HUYỀN QUÁN 3D — texture sinh bằng canvas, phong cách «Sơn Mài» (spec mục 9.2).
//  Không dùng file ảnh. Mỗi hàm trả THREE.CanvasTexture (sRGB) đã cấu hình.
// ============================================================================
import * as THREE from 'three';

export const PAL = {
  lacquer: '#120d10', son: '#9e1b14', son2: '#7a140f', canhGian: '#5a2a14', gold: '#d9a441', gold2: '#b8862f',
  egg: '#efe6d2', jade: '#1d4b57', stone: '#6d655c', stone2: '#585048', ink: '#1a1418',
};

// Bộ sinh số ngẫu nhiên có hạt giống — texture giống nhau mỗi lần tải.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, { repeat = [1, 1], srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}

// Sơn mài: nền màu + vệt mài ngang + chấm vàng quỳ.
export function lacquerTex(base = PAL.son, { seed = 3, gold = 0.6, repeat = [1, 1], streak = 0.12 } = {}) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = r() < 0.5 ? `rgba(255,255,255,${streak * r()})` : `rgba(0,0,0,${streak * 1.6 * r()})`;
    g.fillRect(0, r() * 256, 256, 1 + r() * 4);
  }
  for (let i = 0; i < 260 * gold; i++) {
    g.fillStyle = r() < 0.7 ? PAL.gold : PAL.egg;
    g.globalAlpha = 0.25 + r() * 0.6;
    const s = r() < 0.9 ? 1 : 2.5;
    g.fillRect(r() * 256, r() * 256, s, s);
  }
  g.globalAlpha = 1;
  return tex(c, { repeat });
}

// Vách gỗ ô hộc: khung sơn son, ô đen, viền vàng.
export function panelTex(seed = 5) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = PAL.son2; g.fillRect(0, 0, 256, 256);
  for (const [x, y, w, h] of [[18, 18, 100, 100], [138, 18, 100, 100], [18, 138, 100, 100], [138, 138, 100, 100]]) {
    g.fillStyle = PAL.lacquer; g.fillRect(x, y, w, h);
    g.strokeStyle = PAL.gold; g.lineWidth = 2; g.strokeRect(x + 5, y + 5, w - 10, h - 10);
    // hoạ tiết mây cuộn khảm vỏ trứng
    g.strokeStyle = 'rgba(239,230,210,0.55)'; g.lineWidth = 2;
    g.beginPath(); g.arc(x + w / 2 - 12, y + h / 2, 12, Math.PI, 0); g.arc(x + w / 2 + 12, y + h / 2, 12, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(x + w / 2, y + h / 2 + 4, 6, 0, Math.PI * 1.5); g.stroke();
  }
  for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(217,164,65,${0.3 * r()})`; g.fillRect(r() * 256, r() * 256, 1, 1); }
  return tex(c);
}

// Đá lát sân: ô vuông màu lệch nhẹ, mạch khảm vỏ trứng, vết nứt.
export function stoneTex({ seed = 7, tiles = 4, repeat = [1, 1], base = PAL.stone } = {}) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  const s = 512 / tiles;
  const col = new THREE.Color(base);
  for (let y = 0; y < tiles; y++) for (let x = 0; x < tiles; x++) {
    const k = 0.85 + r() * 0.25;
    g.fillStyle = `rgb(${col.r * 255 * k | 0},${col.g * 255 * k | 0},${col.b * 255 * k | 0})`;
    g.fillRect(x * s, y * s, s, s);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(0,0,0,${0.12 * r()})`; g.fillRect(x * s + r() * s, y * s + r() * s, 2, 2); }
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,240,220,${0.08 * r()})`; g.fillRect(x * s + r() * s, y * s + r() * s, 2, 1); }
    if (r() < 0.45) {
      g.strokeStyle = 'rgba(30,20,15,0.45)'; g.lineWidth = 1;
      g.beginPath(); let px = x * s + r() * s, py = y * s + r() * s; g.moveTo(px, py);
      for (let i = 0; i < 5; i++) { px += (r() - 0.5) * s * 0.4; py += (r() - 0.5) * s * 0.4; g.lineTo(px, py); }
      g.stroke();
    }
  }
  g.strokeStyle = 'rgba(239,230,210,0.2)'; g.lineWidth = 2;
  for (let i = 0; i <= tiles; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(512, i * s); g.stroke(); }
  return tex(c, { repeat });
}

// Ngói ống: sọc dọc theo chiều dốc.
export function roofTex({ repeat = [6, 2], base = '#3a1a14' } = {}) {
  const [c, g] = canvas(128);
  g.fillStyle = base; g.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 16) {
    const grd = g.createLinearGradient(x, 0, x + 16, 0);
    grd.addColorStop(0, 'rgba(0,0,0,0.55)'); grd.addColorStop(0.5, 'rgba(255,190,150,0.18)'); grd.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = grd; g.fillRect(x, 0, 16, 128);
  }
  for (let y = 0; y < 128; y += 32) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, y, 128, 3); }
  return tex(c, { repeat });
}

// Rêu / cỏ ở rìa đảo.
export function mossTex(seed = 11) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = '#2f3d26'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2200; i++) {
    g.fillStyle = r() < 0.6 ? `rgba(80,110,55,${r() * 0.6})` : `rgba(20,25,15,${r() * 0.5})`;
    g.fillRect(r() * 256, r() * 256, 2, 3);
  }
  return tex(c, { repeat: [8, 8] });
}

// Đá vách đảo.
export function rockTex(seed = 13) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = '#3d3532'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = r() < 0.5 ? `rgba(90,78,70,${0.5 * r()})` : `rgba(15,10,10,${0.5 * r()})`;
    g.fillRect(0, r() * 256, 256, 2 + r() * 8);
  }
  return tex(c, { repeat: [6, 2] });
}

// Đĩa la bàn: 5 vòng (tâm Thái Cực, bát quái, 12 chi, 24 sơn, vạch độ).
const BAGUA = ['☰', '☴', '☵', '☶', '☷', '☳', '☲', '☱'];
const ZHI12 = '子丑寅卯辰巳午未申酉戌亥';
const SHAN24 = ['壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥'];

function ringText(g, cx, cy, radius, items, font, color, offset = 0) {
  g.save(); g.translate(cx, cy);
  g.fillStyle = color; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  items.forEach((t, i) => {
    const a = (i / items.length) * Math.PI * 2 + offset;
    g.save(); g.rotate(a); g.translate(0, -radius); g.fillText(t, 0, 0); g.restore();
  });
  g.restore();
}

export function luopanTex({ transparent = false } = {}) {
  const S = 1024, cx = S / 2;
  const [c, g] = canvas(S);
  if (!transparent) {
    g.fillStyle = PAL.lacquer; g.beginPath(); g.arc(cx, cx, cx, 0, Math.PI * 2); g.fill();
  }
  const ring = (r, w = 3) => { g.strokeStyle = PAL.gold; g.lineWidth = w; g.beginPath(); g.arc(cx, cx, r, 0, Math.PI * 2); g.stroke(); };
  [500, 470, 380, 290, 200, 110].forEach((r, i) => ring(r, i === 0 ? 8 : 3));
  // vạch độ
  g.strokeStyle = PAL.gold; g.lineWidth = 2;
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2; const r0 = i % 5 ? 482 : 474;
    g.beginPath(); g.moveTo(cx + Math.sin(a) * r0, cx - Math.cos(a) * r0); g.lineTo(cx + Math.sin(a) * 498, cx - Math.cos(a) * 498); g.stroke();
  }
  // vạch chia 24 / 12 / 8
  const spokes = (n, r0, r1, off = 0) => { for (let i = 0; i < n; i++) { const a = ((i + 0.5) / n) * Math.PI * 2 + off; g.beginPath(); g.moveTo(cx + Math.sin(a) * r0, cx - Math.cos(a) * r0); g.lineTo(cx + Math.sin(a) * r1, cx - Math.cos(a) * r1); g.stroke(); } };
  spokes(24, 380, 470); spokes(12, 290, 380); spokes(8, 200, 290); spokes(8, 110, 200);
  ringText(g, cx, cx, 425, SHAN24, 'bold 46px serif', PAL.gold);
  ringText(g, cx, cx, 335, [...ZHI12], 'bold 50px serif', PAL.egg);
  ringText(g, cx, cx, 245, BAGUA, '60px serif', PAL.gold);
  ringText(g, cx, cx, 155, ['坎', '艮', '震', '巽', '離', '坤', '兌', '乾'].reverse(), 'bold 40px serif', PAL.egg, Math.PI);
  // Thái cực
  g.fillStyle = PAL.egg; g.beginPath(); g.arc(cx, cx, 70, -Math.PI / 2, Math.PI / 2); g.fill();
  g.fillStyle = PAL.son; g.beginPath(); g.arc(cx, cx, 70, Math.PI / 2, Math.PI * 1.5); g.fill();
  g.fillStyle = PAL.egg; g.beginPath(); g.arc(cx, cx - 35, 35, 0, Math.PI * 2); g.fill();
  g.fillStyle = PAL.son; g.beginPath(); g.arc(cx, cx + 35, 35, 0, Math.PI * 2); g.fill();
  g.fillStyle = PAL.son; g.beginPath(); g.arc(cx, cx - 35, 10, 0, Math.PI * 2); g.fill();
  g.fillStyle = PAL.egg; g.beginPath(); g.arc(cx, cx + 35, 10, 0, Math.PI * 2); g.fill();
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Vòng chữ cho Thiên Bàn (nền trong suốt, chữ vàng).
export function skyRingTex(items, { font = 'bold 64px serif', color = PAL.gold } = {}) {
  const S = 1024, cx = S / 2;
  const [c, g] = canvas(S);
  g.strokeStyle = color; g.lineWidth = 6;
  for (const r of [500, 410]) { g.beginPath(); g.arc(cx, cx, r, 0, Math.PI * 2); g.stroke(); }
  ringText(g, cx, cx, 455, items, font, color);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}
export const SKY_RINGS = { shan: SHAN24, zhi: [...ZHI12], bagua: BAGUA };

// Biển hiệu 玄館: nền sơn đen, chữ vàng, viền son.
export function signTex(text = '玄 館') {
  const [c, g] = canvas(512, 192);
  g.fillStyle = PAL.lacquer; g.fillRect(0, 0, 512, 192);
  g.strokeStyle = PAL.gold; g.lineWidth = 8; g.strokeRect(10, 10, 492, 172);
  g.strokeStyle = PAL.son; g.lineWidth = 4; g.strokeRect(22, 22, 468, 148);
  g.fillStyle = PAL.gold; g.font = 'bold 120px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 256, 100);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Tờ lịch: vẽ lại khi đổi ngày.
export function calendarCanvas() {
  const [c, g] = canvas(256, 320);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  function draw({ day, month, year, lunar, gz }) {
    g.fillStyle = '#a3170f'; g.fillRect(0, 0, 256, 320);
    g.strokeStyle = PAL.gold; g.lineWidth = 6; g.strokeRect(8, 8, 240, 304);
    g.fillStyle = PAL.egg; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 26px sans-serif'; g.fillText(`Tháng ${month} · ${year}`, 128, 44);
    g.font = 'bold 130px serif'; g.fillText(String(day), 128, 140);
    g.font = '24px sans-serif'; g.fillText(lunar || '', 128, 228);
    g.fillStyle = PAL.gold; g.font = 'bold 40px serif'; g.fillText(gz || '', 128, 274);
    t.needsUpdate = true;
  }
  return { texture: t, draw };
}

// Vệt mềm tròn: mây, khói, hạt sáng.
export function softTex(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 128) {
  const [c, g] = canvas(size);
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner); grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Mây cụm: nhiều vệt tròn chồng nhau.
export function cloudTex(seed = 17) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  for (let i = 0; i < 26; i++) {
    const x = 50 + r() * 156, y = 70 + r() * 116, rad = 30 + r() * 50;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, 'rgba(255,255,255,0.55)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  }
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Gợn nước: vòng sáng mảnh, cuộn UV theo thời gian.
export function rippleTex(seed = 19) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = '#123a45'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(180,230,235,${0.08 + r() * 0.15})`; g.lineWidth = 1 + r();
    g.beginPath(); g.ellipse(r() * 256, r() * 256, 6 + r() * 30, 2 + r() * 8, 0, 0, Math.PI * 2); g.stroke();
  }
  return tex(c, { repeat: [3, 1] });
}

// Hậu thiên: Bắc Khảm, ĐB Cấn, Đông Chấn, ĐN Tốn, Nam Ly, TN Khôn, Tây Đoài, TB Càn.
const TRIGRAM_BITS = [[0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 1], [1, 0, 1], [0, 0, 0], [1, 1, 0], [1, 1, 1]];

// Thanh quẻ bát quái khắc trên cột mốc.
export function trigramTex(idx) {
  const [c, g] = canvas(64, 128);
  g.fillStyle = PAL.lacquer; g.fillRect(0, 0, 64, 128);
  g.strokeStyle = PAL.gold; g.lineWidth = 3; g.strokeRect(3, 3, 58, 122);
  // 3 hào đọc từ dưới lên (1 = dương, 0 = âm) — thứ tự hậu thiên theo hướng Bắc → Tây Bắc
  const bits = TRIGRAM_BITS[idx];
  g.fillStyle = PAL.gold;
  bits.forEach((b, i) => {
    const y = 92 - i * 26;
    if (b) g.fillRect(12, y, 40, 10); else { g.fillRect(12, y, 16, 10); g.fillRect(36, y, 16, 10); }
  });
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Tre: nền xanh vàng + đốt.
export function bambooTex() {
  const [c, g] = canvas(64, 256);
  const grd = g.createLinearGradient(0, 0, 64, 0);
  grd.addColorStop(0, '#6b7a2e'); grd.addColorStop(0.5, '#a5a84a'); grd.addColorStop(1, '#5d6a27');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 64) { g.fillStyle = '#4b5520'; g.fillRect(0, y, 64, 5); g.fillStyle = 'rgba(255,255,200,0.3)'; g.fillRect(0, y + 5, 64, 2); }
  return tex(c, { repeat: [1, 1] });
}
