// Kiểm thực vật tiên phủ theo docs/TIEN-PHU-THUCVAT-MANIFEST.md §6 (chạy Node): node scripts/check-flora.mjs
//  · chiều cao mỗi cây nằm trong khoảng loài (BIG.H) · 0 cây trong sân cấm / trục nghi lễ (trừ cặp, cây xén, hàng kênh)
//  · không thân nào trong hộp nhà / đình / lối / nước / tường · tỉ lệ cổ thụ lớn nhất ÷ nhà chính · số cây, loài, vai trò
import { tienPlan, footCenter } from '../src/game/tienphu/plan.js';
import { BIG, FLORA, bigHeight } from '../src/game/tienphu/flora-spec.js';
import { sitePlan } from '../src/game/tienphu/siteplans.js';
const RATIO = { trunghoa: [0.5, 0.8], hue: [0.5, 0.8], thai: [0.5, 0.8], nhatban: [0.3, 0.65], taytang: [0, 0.25], gothic: [0.8, 1.2], artdeco: [1.5, 2.5], tancodien: [0.8, 1.0], mughal: [0, 0.45] };
const inRot = (b, x, z, m = 0) => { const c = footCenter(b), cs = Math.cos(b.ry || 0), sn = Math.sin(b.ry || 0), dx = x - c.x, dz = z - c.z, u = cs * dx - sn * dz, v = sn * dx + cs * dz; return Math.abs(u) < b.w / 2 + m && Math.abs(v) < b.d / 2 + m; };
let bad = 0;
for (let i = 0; i < 9; i++) {
  const P = tienPlan(i), F = FLORA[P.st.id], D = sitePlan(P.st) || {}, errs = [];
  const big = P.trees.filter((t) => BIG[t.kind]);
  for (const t of big) {
    const h = bigHeight(t), b = BIG[t.kind]; if (h < b.H[0] - 0.01 || h > b.H[1] + 0.01) errs.push(`${t.kind} cao ${h.toFixed(1)} ngoài ${b.H}`);
    for (const B of [...P.buildings, ...P.pavs]) if (inRot(B, t.x, t.z, 0.5)) errs.push(`${t.kind} trong nhà ${B.id || B.name}`);
    for (const p of P.paths) { const cs = Math.cos(p.ry || 0), sn = Math.sin(p.ry || 0), dx = t.x - p.x, dz = t.z - p.z, u = cs * dx - sn * dz, v = sn * dx + cs * dz; if (Math.abs(u) < p.w / 2 && Math.abs(v) < p.d / 2) errs.push(`${t.kind} trên lối`); }
    for (const w of P.water) if (w.shape === 'ellipse' ? ((t.x - w.x) / w.rx) ** 2 + ((t.z - w.z) / w.rz) ** 2 < 1 : Math.abs(t.x - w.x) < w.hw && Math.abs(t.z - w.z) < w.hd) errs.push(`${t.kind} dưới nước`);
    if (!['pair', 'topiary', 'tub', 'canal'].includes(t.role)) {
      for (const y of (D.yards || []).filter((y) => !(F.yardsOk || []).includes(y.id))) if (Math.abs(t.x - y.x) < y.w / 2 && Math.abs(t.z - y.z) < y.d / 2) errs.push(`${t.kind} trong sân cấm ${y.id}`);
    }
  }
  const main = P.buildings.find((b) => b.main), mainTop = main ? (main.foot?.top || main.h + (main.plinth || 0)) : 30;
  const maxH = Math.max(...big.map(bigHeight)), ratio = maxH / mainTop, [r0, r1] = RATIO[P.st.id];
  const by = {}; for (const t of big) by[t.kind] = (by[t.kind] || 0) + 1;
  const uniq = [...new Set(errs)];
  console.log(`${P.st.id.padEnd(10)} ${String(big.length).padStart(4)} cây  cao max ${maxH.toFixed(1)} m / nhà chính ${mainTop.toFixed(1)} m = ${ratio.toFixed(2)} (đề ${r0}–${r1})${ratio > r1 + 0.05 ? ' ⚠ VƯỢT' : ''}  lỗi ${errs.length}  ${JSON.stringify(by)}`);
  if (uniq.length) console.log('   ', uniq.slice(0, 6).join(' · '));
  bad += errs.length;
}
console.log(bad ? `✗ ${bad} lỗi` : '✓ sạch');
process.exit(bad ? 1 : 0);
