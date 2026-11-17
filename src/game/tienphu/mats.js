// ============================================================================
//  VẬT LIỆU TIÊN PHỦ theo phong cách + tuỳ biến của chủ phủ (canvas thủ tục, lặp theo mét). Bộ nhớ đệm theo khoá
//  (phong cách + chuỗi tuỳ chọn). Mặt tường vẽ cửa sổ đặc trưng từng phong cách: song gỗ (Trung Hoa / Huế), song mắt cáo
//  (Nhật), khung hình thang đen (Tây Tạng), vòm nhọn (Gothic), dải spandrel (Art Deco), vòm tròn + đá khoá (tân cổ điển),
//  khung vàng chóp nhọn (Thái), vòm jali (Mughal). Ô vẽ = 3,6 m ngang × 5 m dọc (một tầng lầu).
// ============================================================================
import * as THREE from 'three';
import { OPT_BY_ID, optCol } from './custom.js';

const cache = new Map();
const std = (o) => new THREE.MeshStandardMaterial(o);
function canvasTex(w, h, draw, rep = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
}
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const noise = (g, w, h, n, a, col = '0,0,0') => { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${col},${rnd() * a})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 2 + rnd() * 3); } };

/** mặt tường có cửa sổ (1 ô = 3,6 × 5 m) */
function facadeTex(kind, wall, trim, glass = '#25303a') {
  return canvasTex(256, 356, (g, w, h) => {
    g.fillStyle = wall; g.fillRect(0, 0, w, h); noise(g, w, h, 500, 0.06);
    const wx = w * 0.26, ww = w * 0.48, wy = h * 0.2, wh = h * 0.52;
    g.lineWidth = 6;
    switch (kind) {
      case 'lattice': { // panel gỗ sơn son + song mắt lưới + diềm dưới
        g.fillStyle = trim; g.fillRect(0, h * 0.78, w, h * 0.22);
        g.fillStyle = '#2a1a12'; g.fillRect(wx, wy, ww, wh);
        g.strokeStyle = '#d9a441'; g.lineWidth = 4; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(wx + (ww * i) / 6, wy); g.lineTo(wx + (ww * i) / 6, wy + wh); g.stroke(); }
        for (let j = 1; j < 8; j++) { g.beginPath(); g.moveTo(wx, wy + (wh * j) / 8); g.lineTo(wx + ww, wy + (wh * j) / 8); g.stroke(); }
        g.strokeStyle = trim; g.lineWidth = 10; g.strokeRect(wx, wy, ww, wh); break;
      }
      case 'grille': { // vữa trắng + cửa sổ song đứng đen + dải gỗ
        g.fillStyle = '#2b2b2b'; g.fillRect(0, h * 0.86, w, h * 0.14);
        g.fillStyle = '#1c1c1c'; g.fillRect(wx, wy + wh * 0.25, ww, wh * 0.5);
        g.fillStyle = wall; for (let i = 1; i < 7; i++) g.fillRect(wx + (ww * i) / 7 - 3, wy + wh * 0.25, 6, wh * 0.5); break;
      }
      case 'trapezoid': { // khung hình thang đen + mi cửa nhiều lớp màu
        g.fillStyle = '#1a1a1a'; g.beginPath(); g.moveTo(wx - 14, wy + wh); g.lineTo(wx + ww + 14, wy + wh); g.lineTo(wx + ww - 4, wy); g.lineTo(wx + 4, wy); g.fill();
        g.fillStyle = '#3a4a5a'; g.fillRect(wx + 18, wy + 16, ww - 36, wh - 30);
        for (const [c, y] of [['#b8322a', 0], ['#2e6b9a', 8], ['#d9a441', 16]]) { g.fillStyle = c; g.fillRect(wx - 10, wy - 26 + y, ww + 20, 8); } break;
      }
      case 'pointed': { // khối đá + cửa vòm nhọn kính màu
        g.strokeStyle = 'rgba(90,80,64,0.35)'; g.lineWidth = 2; for (let y = 0; y < h; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 30) % 2 ? 0 : 32; x < w; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 30); g.stroke(); } }
        g.fillStyle = trim; g.beginPath(); g.moveTo(wx - 8, wy + wh); g.lineTo(wx - 8, wy + wh * 0.35); g.quadraticCurveTo(wx - 8, wy - 30, w / 2, wy - 40); g.quadraticCurveTo(wx + ww + 8, wy - 30, wx + ww + 8, wy + wh * 0.35); g.lineTo(wx + ww + 8, wy + wh); g.fill();
        g.fillStyle = '#2b3c6a'; g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx, wy + wh * 0.35); g.quadraticCurveTo(wx, wy - 18, w / 2, wy - 28); g.quadraticCurveTo(wx + ww, wy - 18, wx + ww, wy + wh * 0.35); g.lineTo(wx + ww, wy + wh); g.fill();
        g.strokeStyle = trim; g.lineWidth = 5; g.beginPath(); g.moveTo(w / 2, wy - 26); g.lineTo(w / 2, wy + wh); g.stroke(); g.beginPath(); g.arc(w / 2, wy + 20, 22, 0, Math.PI * 2); g.stroke(); break;
      }
      case 'deco': { // trụ đứng sáng + dải spandrel tối + cửa kính
        g.fillStyle = trim; g.fillRect(0, h * 0.04, w, h * 0.14); g.fillRect(0, h * 0.82, w, h * 0.14);
        g.fillStyle = glass; g.fillRect(w * 0.18, h * 0.22, w * 0.64, h * 0.56);
        g.fillStyle = wall; g.fillRect(w * 0.47, h * 0.22, w * 0.06, h * 0.56);
        g.strokeStyle = '#c8a050'; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(w * 0.2 + i * w * 0.15, h * 0.08); g.lineTo(w * 0.27 + i * w * 0.15, h * 0.15); g.stroke(); } break;
      }
      case 'arched': { // vòm tròn + đá khoá + bệ cửa
        g.fillStyle = trim; g.fillRect(wx - 12, wy + wh, ww + 24, 12);
        g.fillStyle = glass; g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx, wy + ww / 2); g.arc(w / 2, wy + ww / 2, ww / 2, Math.PI, 0); g.lineTo(wx + ww, wy + wh); g.fill();
        g.strokeStyle = trim; g.lineWidth = 9; g.beginPath(); g.arc(w / 2, wy + ww / 2, ww / 2 + 5, Math.PI, 0); g.stroke();
        g.fillStyle = trim; g.fillRect(w / 2 - 9, wy - 14, 18, 22); g.fillRect(0, h * 0.04, w, 10); break;
      }
      case 'gold': { // khung vàng chóp nhọn (Thái)
        g.fillStyle = '#d4a72c'; g.beginPath(); g.moveTo(wx - 12, wy + wh + 8); g.lineTo(wx - 12, wy + 10); g.lineTo(w / 2, wy - 46); g.lineTo(wx + ww + 12, wy + 10); g.lineTo(wx + ww + 12, wy + wh + 8); g.fill();
        g.fillStyle = '#7a1e14'; g.fillRect(wx, wy + 14, ww, wh - 10);
        g.strokeStyle = '#d4a72c'; g.lineWidth = 4; g.strokeRect(wx + 10, wy + 26, ww - 20, wh - 34); break;
      }
      case 'jali': { // vòm nhọn Ba Tư + mắt lưới jali
        g.fillStyle = trim; g.fillRect(wx - 16, wy - 34, ww + 32, wh + 50);
        g.fillStyle = wall; g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx, wy + 20); g.quadraticCurveTo(wx, wy - 22, w / 2, wy - 30); g.quadraticCurveTo(wx + ww, wy - 22, wx + ww, wy + 20); g.lineTo(wx + ww, wy + wh); g.fill();
        g.strokeStyle = '#8a7a6a'; g.lineWidth = 2; for (let x = wx; x < wx + ww; x += 12) for (let y = wy + 10; y < wy + wh; y += 12) { g.beginPath(); g.arc(x + 6, y + 6, 5, 0, Math.PI * 2); g.stroke(); } break;
      }
      default: g.fillStyle = glass; g.fillRect(wx, wy, ww, wh);
    }
  });
}
function floorTex(kind, col) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    if (kind === 'wood' || kind === 'bamboo') { for (let y = 0; y < h; y += 32) { g.fillStyle = `rgba(0,0,0,${0.08 + rnd() * 0.12})`; g.fillRect(0, y, w, 2); for (let x = (y / 32) % 2 ? 64 : 0; x < w; x += 128) g.fillRect(x, y, 2, 32); } noise(g, w, h, 900, 0.07); }
    else if (kind === 'marble' || kind === 'jade') { g.strokeStyle = kind === 'jade' ? 'rgba(40,90,60,0.25)' : 'rgba(120,110,100,0.25)'; g.lineWidth = 1.5; for (let i = 0; i < 14; i++) { g.beginPath(); let x = rnd() * w, y = 0; g.moveTo(x, y); while (y < h) { x += (rnd() - 0.5) * 30; y += 12; g.lineTo(x, y); } g.stroke(); } g.strokeStyle = 'rgba(0,0,0,0.15)'; g.strokeRect(0, 0, w, h); }
    else if (kind === 'tile') { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? 'rgba(120,60,30,0.35)' : 'rgba(255,255,255,0.12)'; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); g.strokeStyle = 'rgba(40,30,20,0.4)'; g.beginPath(); g.arc(x * 64 + 32, y * 64 + 32, 18, 0, Math.PI * 2); g.stroke(); } }
    else if (kind === 'carpet') { g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 2; g.strokeRect(30, 30, w - 60, h - 60); noise(g, w, h, 2000, 0.05); }
    else { noise(g, w, h, 600, 0.08); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, h); g.moveTo(0, k * 64); g.lineTo(w, k * 64); g.stroke(); } }
  });
}
function tileRoofTex(col) {
  return canvasTex(128, 128, (g, w, h) => {
    const c = new THREE.Color(col); g.fillStyle = `#${c.getHexString()}`; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) { g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(x, 0, 3, h); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 7, 0, 3, h); }
    for (let y = 0; y < h; y += 32) { g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, y, w, 3); }
  });
}
const WIN = { trunghoa: 'lattice', hue: 'lattice', nhatban: 'grille', taytang: 'trapezoid', gothic: 'pointed', artdeco: 'deco', tancodien: 'arched', thai: 'gold', mughal: 'jali' };

/** bộ vật liệu của một tiên phủ: st (styles.js), o (custom.decodeOpts) */
export function tpMats(st, o = null) {
  const key = `${st.id}|${JSON.stringify(o || {})}`;
  if (cache.has(key)) return cache.get(key);
  const roofCol = optCol(o, 'roof') || st.roofCol, wallCol = optCol(o, 'wall') || st.wall, trimCol = optCol(o, 'trim') || st.trim;
  const fl = OPT_BY_ID.floor.choices[o?.floor || 0], floorKind = fl.kind || ({ trunghoa: 'wood', hue: 'wood', nhatban: 'bamboo', taytang: 'wood', gothic: 'tile', artdeco: 'marble', tancodien: 'marble', thai: 'wood', mughal: 'marble' }[st.id]), floorCol = fl.col || st.floorCol;
  const crown = o?.crown || 0, rail = o?.rail || 0;
  const facade = facadeTex(WIN[st.id], wallCol, trimCol);
  const roofT = tileRoofTex(roofCol); roofT.repeat.set(1, 1);
  const lower = st.tower.lowerCol ? facadeTex(WIN[st.id], st.tower.lowerCol, trimCol) : null;
  const M = {
    key,
    facade: std({ map: facade, roughness: 0.85 }),
    facadeLow: lower ? std({ map: lower, roughness: 0.85 }) : null,
    facadeRed: st.tower.red ? std({ map: facadeTex('trapezoid', '#8b1e1a', '#5a2620'), roughness: 0.9 }) : null,
    wall: std({ color: wallCol, roughness: 0.9 }),
    trim: std({ color: trimCol, roughness: 0.55 }),
    column: std({ color: optCol(o, 'trim') || st.tower.column || trimCol, roughness: 0.45 }),
    roof: std({ map: roofT, color: '#ffffff', roughness: 0.6, metalness: st.id === 'artdeco' ? 0.6 : 0.05, side: THREE.DoubleSide }),
    roofFlat: std({ color: roofCol, roughness: 0.6, side: THREE.DoubleSide }),
    eaveBorder: std({ color: st.tower.borderCol || trimCol, roughness: 0.5 }),
    soffit: std({ color: '#3a2a20', roughness: 0.9, side: THREE.DoubleSide }),
    gold: std({ color: crown === 2 ? '#bff0d8' : '#d9a441', roughness: 0.28, metalness: 0.85, emissive: crown === 2 ? '#3a9a78' : '#000000', emissiveIntensity: crown === 2 ? 0.6 : 0 }),
    crownMat: crown === 1 ? std({ color: '#e0b040', roughness: 0.25, metalness: 0.9 }) : crown === 2 ? std({ color: '#a8f0d0', roughness: 0.2, metalness: 0.3, emissive: '#2a8a68', emissiveIntensity: 0.8 }) : null,
    stone: std({ color: st.stone, roughness: 0.92 }),
    stoneDark: std({ color: new THREE.Color(st.stone).multiplyScalar(0.62), roughness: 0.95 }),
    marble: std({ color: '#f4f1ea', roughness: 0.32 }),
    rail: std({ color: ['#f4f1ea', '#f4f1ea', '#9e1b1b', '#b8892e'][rail] || '#f4f1ea', roughness: rail === 3 ? 0.3 : 0.5, metalness: rail === 3 ? 0.8 : 0 }),
    wood: std({ color: '#7a5434', roughness: 0.75 }),
    beam: std({ color: st.accent || '#2e6b4f', roughness: 0.6 }),
    floor: std({ map: floorTex(floorKind, floorCol), roughness: floorKind === 'marble' || floorKind === 'jade' ? 0.25 : 0.7 }),
    ceiling: std({ color: '#efe6d6', roughness: 0.95 }),
    glass: std({ color: '#9fc2d6', roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.5 }),
    steel: std({ color: '#c8ccd0', roughness: 0.22, metalness: 0.95 }),
    dark: std({ color: '#1e1e22', roughness: 0.6 }),
    jade: std({ color: '#bff0d8', emissive: '#3aa883', emissiveIntensity: 0.55, roughness: 0.3, transparent: true, opacity: 0.92 }),
    beam2: new THREE.MeshBasicMaterial({ color: '#c8fff0', transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
    water: std({ color: ['#3f7f86', '#2f6a7a', '#5aa8b8', '#7ad8c8'][o?.lake || 0], roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.82 }),
    bed: std({ color: '#5a4a38', roughness: 1 }),
    lawn: std({ color: ['#86b46c', '#9cc47a', '#b8904a', '#dfe6e8'][o?.season || 0], roughness: 1 }),
    pave: std({ map: floorTex('stone', '#d8d2c4'), roughness: 0.9 }),
    gravel: std({ map: floorTex('stone', '#d9d4c8'), roughness: 1 }),
    hedge: std({ color: '#3f6b3a', roughness: 0.95 }),
    banner: std({ color: optCol(o, 'banner') || st.accent || '#b8322a', roughness: 0.8, side: THREE.DoubleSide }),
    lotus: std({ color: '#f2a6c0', roughness: 0.7 }), pad: std({ color: '#3f7a3a', roughness: 0.8 }), koi: std({ color: '#e8702a', roughness: 0.5 }),
    lampGlow: std({ color: '#ffe2a0', emissive: '#ffb050', emissiveIntensity: 1.2, roughness: 0.5 }),
    redLacquer: std({ color: '#9e1b1b', roughness: 0.45 }),
    flower: std({ color: ['#e85a7a', '#f2a6c0', '#e8a02a', '#ffffff'][o?.season || 0], roughness: 0.8 }),
  };
  cache.set(key, M);
  return M;
}
