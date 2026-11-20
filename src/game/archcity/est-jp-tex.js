// ============================================================================
//  Texture canvas lặp theo mét cho họ «jp» (docs/bietphu/jp.md): mái tranh (茅葺 kaya Nhật / alang-alang Bali),
//  sợi ijuk đen (mái meru Bali), vải poleng ca rô. 512 px = 1 m theo UV mét của jpRoof (u dọc mép hiên, v xuôi dốc)
//  → 512 px/m. Trong node (bietphu-check) không có canvas thật → trả null, vật liệu dùng màu phẳng.
// ============================================================================
import * as THREE from 'three';

let SEED = 11; const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);
export function canvasTex(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); if (!c || !c.getContext) return null; c.width = w; c.height = h;
  const g = c.getContext('2d'); if (!g) return null; SEED = 11; draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}
const rgb = (r, g, b, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
/** vẽ lặp (wrap) một hình quanh 9 ô để texture liền mép */
const wrap9 = (w, h, fn) => { for (const ox of [0, -w, w]) for (const oy of [0, -h, h]) fn(ox, oy); };
/**
 * mái tranh / sợi: nền màu, vệt phong hóa lớn (mờ, liền mép), lớp bó tranh xếp chồng theo dốc (mỗi lớp `course` px),
 * hàng nghìn sợi cỏ xuôi dốc; mép dưới mỗi lớp tối (bóng của lớp trên)
 */
export function strawTex([r0, g0, b0], { strands = 7000, len = [26, 90], course = 56, shadow = 0.38, hi = 0.22, blotch = 0.16, seed = 11 } = {}) {
  return canvasTex(512, 512, (g, w, h) => {
    SEED = seed;
    g.fillStyle = rgb(r0, g0, b0); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = 40 + rnd() * 110, dark = rnd() < 0.6, a = blotch * (0.4 + rnd() * 0.6);
      wrap9(w, h, (ox, oy) => { const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); gr.addColorStop(0, dark ? rgb(20, 18, 14, a) : rgb(235, 225, 200, a * 0.7)); gr.addColorStop(1, rgb(0, 0, 0, 0)); g.fillStyle = gr; g.fillRect(x + ox - r, y + oy - r, 2 * r, 2 * r); }); }
    for (let y = 0; y < h; y += course) { const gr = g.createLinearGradient(0, y, 0, y + course); gr.addColorStop(0, rgb(0, 0, 0, shadow)); gr.addColorStop(0.18, rgb(0, 0, 0, shadow * 0.25)); gr.addColorStop(0.5, rgb(0, 0, 0, 0)); gr.addColorStop(1, rgb(255, 244, 214, hi * 0.5)); g.fillStyle = gr; g.fillRect(0, y, w, course); }
    for (let i = 0; i < strands; i++) {
      const x = rnd() * w, y = rnd() * h, l = len[0] + rnd() * (len[1] - len[0]), k = 0.55 + rnd() * 0.8, dx = (rnd() - 0.5) * 7;
      g.strokeStyle = rgb(Math.min(255, r0 * k), Math.min(255, g0 * k), Math.min(255, b0 * k * 0.95), 0.85); g.lineWidth = 0.7 + rnd() * 1.5;
      wrap9(w, h, (ox, oy) => { g.beginPath(); g.moveTo(x + ox, y + oy); g.lineTo(x + ox + dx, y + oy + l); g.stroke(); });
    }
  });
}
/** mặt cắt mép mái tranh: đầu sợi cắt bằng (chấm sáng tối dày đặc) */
export function strawEndTex([r0, g0, b0], seed = 5) {
  return canvasTex(256, 256, (g, w, h) => {
    SEED = seed; g.fillStyle = rgb(r0 * 0.7, g0 * 0.7, b0 * 0.7); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const k = 0.6 + rnd() * 0.9; g.fillStyle = rgb(Math.min(255, r0 * k), Math.min(255, g0 * k), Math.min(255, b0 * k)); g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.2, 1 + rnd() * 2.2); }
  });
}
export const polengTex = () => canvasTex(64, 64, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#1b1a19' : '#ece8dc'; g.fillRect((i * w) / 4, (j * h) / 4, w / 4, h / 4); } });
