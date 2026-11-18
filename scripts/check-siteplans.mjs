// ============================================================================
//  KIỂM 9 TỔNG MẶT BẰNG TIÊN PHỦ (docs/TIEN-PHU-MATBANG-MANIFEST.md §4) — chạy trên số liệu bản vẽ (siteplans.js → plan.js):
//   1. mọi công trình / đình / lầu / giả sơn nằm trong tường bao, không chồng nhau, không đè nước
//   2. lối đi không xuyên nhà, không xuyên tường (ngoài khe cổng), không lội nước (ngoài chỗ có cầu); hai đầu cầu trên đất
//   3. ĐI ĐƯỢC từ cổng chính tới cửa trước của từng công trình, lầu, đình (loang trên lưới 1 m, tránh nhà / tường / nước / bệ lầu)
//   4. 9 bản khác nhau: không hai phủ nào trùng quá 25 % diện tích chiếm đất công trình
//    node scripts/check-siteplans.mjs   → in lỗi theo phủ; mã thoát 1 nếu có lỗi
// ============================================================================
import { tienPlan, TP_W, TP_D, footCenter } from '../src/game/tienphu/plan.js';
const HW = TP_W / 2, HD = TP_D / 2;
const obb = (x, z, hw, hd, ry = 0) => ({ x, z, hw, hd, c: Math.cos(ry), s: Math.sin(ry) });
const inObb = (o, x, z, m = 0) => { const dx = x - o.x, dz = z - o.z, lx = o.c * dx - o.s * dz, lz = o.s * dx + o.c * dz; return Math.abs(lx) < o.hw + m && Math.abs(lz) < o.hd + m; };
const corners = (o) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const lx = a * o.hw, lz = b * o.hd; return [o.x + o.c * lx + o.s * lz, o.z - o.s * lx + o.c * lz]; });
const sample = (o, step = 1) => { const out = []; for (let u = -o.hw; u <= o.hw + 1e-6; u += step) for (let v = -o.hd; v <= o.hd + 1e-6; v += step) out.push([o.x + o.c * u + o.s * v, o.z - o.s * u + o.c * v]); return out; };
const overlap = (a, b) => sample(a, 1.5).some(([x, z]) => inObb(b, x, z)) || sample(b, 1.5).some(([x, z]) => inObb(a, x, z));
const inWater = (P, x, z, m = 0) => P.water.some((w) => (w.shape === 'ellipse' ? ((x - w.x) / (w.rx + m)) ** 2 + ((z - w.z) / (w.rz + m)) ** 2 < 1 : Math.abs(x - w.x) < w.hw + m && Math.abs(z - w.z) < w.hd + m));
const bridgeObb = (b) => obb(b.x, b.z, b.w / 2, b.len / 2, b.ry);

let bad = 0;
const foot = [];
for (let i = 0; i < 9; i++) {
  const P = tienPlan(i), err = [], sp = P.tower.spec, pod = sp.podium;
  // khối chiếm chỗ: nhà (lõi + bệ + bậc trước/sau), đình, lầu (bệ + bậc trước), giả sơn (+ bậc)
  const solids = [];
  const coreOf = (b, bw, bd) => { const [x0, z0, x1, z1] = b.foot.bb, ax = Math.max(-bw / 2, x0 + 1.5), bx = Math.min(bw / 2, x1 - 1.5), az = Math.max(-bd / 2, z0 + 1.5), bz = Math.min(bd / 2, z1 - 1.5); const mx = (ax + bx) / 2, mz = (az + bz) / 2, c = Math.cos(b.ry || 0), s = Math.sin(b.ry || 0); return obb(b.x + c * mx + s * mz, b.z - s * mx + c * mz, Math.max(0.5, (bx - ax) / 2), Math.max(0.5, (bz - az) / 2), b.ry || 0); };
  const archSolid = (b, kind, label) => { const c = footCenter(b), f = Math.sin(b.ry || 0), g = Math.cos(b.ry || 0), bw = (b.body && b.body[0]) || b.w * 0.6, bd = (b.body && b.body[1]) || b.d * 0.6; return { name: `${label} «${b.name}»`, kind, b, o: obb(c.x, c.z, b.w / 2, b.d / 2, b.ry || 0), core: coreOf(b, bw, bd), /* lõi = giao của thân (lưới cột quanh gốc) và hộp chiếm đất thu 1,5 m — nền, bậc, nguyệt đài đi được */ door: [b.x + f * (b.front + 1.5), b.z + g * (b.front + 1.5)] }; };
  for (const b of P.buildings) {
    if (b.arch) { solids.push(archSolid(b, 'b', 'nhà')); continue; }
    const ph = b.plinth, n = Math.max(1, Math.round(ph / 0.22)), run = n * 0.34, asian = P.S.fam === 'asian';
    const W = asian ? b.w + 2.4 : b.w + 0.2, Dp = asian ? b.d + 2.4 : b.d + 0.2, back = b.back ? run : 0;
    const f = Math.sin(b.ry), g = Math.cos(b.ry);
    solids.push({ name: `nhà «${b.name}»`, kind: 'b', b, o: obb(b.x + f * (run - back) / 2, b.z + g * (run - back) / 2, W / 2, Dp / 2 + (run + back) / 2, b.ry), core: obb(b.x, b.z, b.w / 2, b.d / 2, b.ry), door: [b.x + f * (Dp / 2 + run + 1.5), b.z + g * (Dp / 2 + run + 1.5)] });
  }
  for (const p of P.pavs) if (!p.y && p.arch) solids.push({ ...archSolid(p, 'p', 'đình'), island: P.islands.some((il) => Math.hypot(il.x - p.x, il.z - p.z) < 1) });
  else if (!p.y) solids.push({ name: `đình «${p.name}»`, kind: 'p', o: obb(p.x, p.z, p.w / 2 + 1.2, p.d / 2 + 1.2), core: obb(p.x, p.z, p.w / 2, p.d / 2), door: [p.x, p.z + p.d / 2 + 2.5], island: P.islands.some((il) => Math.hypot(il.x - p.x, il.z - p.z) < 1) });
  const T = P.tower; solids.push({ name: 'lầu 10 tầng', kind: 't', o: obb(T.x, T.z + pod.run / 2, pod.a, pod.a + pod.run / 2), core: obb(T.x, T.z, pod.a, pod.a), door: [T.x, T.z + pod.a + pod.run + 2] });
  const k = P.rockery; solids.push({ name: `giả sơn «${k.name || ''}»`, kind: 'r', o: obb(k.x, k.z + k.run / 2, k.w / 2, k.d / 2 + k.run / 2), core: obb(k.x, k.z, k.w / 2, k.d / 2), door: [k.x, k.z + k.d / 2 + k.run + 2] });
  // 1. trong tường, không chồng, không đè nước
  for (const s of solids) {
    if (corners(s.o).some(([x, z]) => Math.abs(x) > HW - 2 || Math.abs(z) > HD - 2)) err.push(`${s.name} chạm / vượt tường bao`);
    if (!s.island && sample(s.o, 1.5).some(([x, z]) => inWater(P, x, z))) err.push(`${s.name} đè lên nước`);
    for (const w of P.walls) if (w.len < 400) { const wo = obb(w.x, w.z, w.len / 2, w.t / 2, w.ry); if (overlap(s.core, wo)) err.push(`${s.name} chồng tường trong`); }
  }
  for (let a = 0; a < solids.length; a++) for (let b2 = a + 1; b2 < solids.length; b2++) if (overlap(solids[a].o, solids[b2].o)) err.push(`${solids[a].name} chồng ${solids[b2].name}`);
  for (const bd of P.beds) for (const s of solids) if (overlap(obb(bd.x, bd.z, bd.w / 2, bd.d / 2), s.o)) err.push(`bồn hoa (${bd.x},${bd.z}) chồng ${s.name}`);
  // 2. lối đi
  const bridges = P.bridges.map(bridgeObb);
  for (const p of P.paths) {
    const o = obb(p.x, p.z, p.w / 2, p.d / 2, p.ry), tag = `lối (${p.x.toFixed(0)},${p.z.toFixed(0)})`;
    for (let u = -p.d / 2 + 0.5; u <= p.d / 2 - 0.5; u += 1) {
      const x = p.x + Math.sin(p.ry) * u, z = p.z + Math.cos(p.ry) * u;
      if (inWater(P, x, z) && !bridges.some((bo) => inObb(bo, x, z, 0.5))) { err.push(`${tag} lội nước tại (${x.toFixed(0)},${z.toFixed(0)})`); break; }
      const hitB = solids.find((s) => s.kind !== 'r' && inObb(s.core, x, z, -0.3)); if (hitB) { err.push(`${tag} xuyên ${hitB.name}`); break; }
      const hitW = P.walls.find((w) => inObb(obb(w.x, w.z, w.len / 2, w.t / 2, w.ry), x, z, 0.3)); if (hitW) { err.push(`${tag} xuyên tường tại (${x.toFixed(0)},${z.toFixed(0)})`); break; }
    }
  }
  for (const b of P.bridges) { const o = bridgeObb(b); for (const sd of [-1, 1]) { const x = b.x + Math.sin(b.ry) * sd * (b.len / 2 + 0.5), z = b.z + Math.cos(b.ry) * sd * (b.len / 2 + 0.5); if (inWater(P, x, z) && !P.islands.some((il) => Math.hypot(il.x - x, il.z - z) < il.r + 1)) err.push(`cầu (${b.x},${b.z}) đầu ${sd} chìm nước`); } }
  // 3. loang đi bộ trên lưới 1 m
  const N = TP_W, idx = (x, z) => (Math.round(z + HD) * (N + 1)) + Math.round(x + HW), blk = new Uint8Array((N + 1) * (N + 1));
  for (let gz = -HD; gz <= HD; gz++) for (let gx = -HW; gx <= HW; gx++) {
    let b = Math.abs(gx) > HW - 1.5 || Math.abs(gz) > HD - 1.5;
    if (!b && inWater(P, gx, gz) && !bridges.some((bo) => inObb(bo, gx, gz, 0.3)) && !P.islands.some((il) => Math.hypot(il.x - gx, il.z - gz) < il.r)) b = true;
    if (!b && P.moatIsle) b = false;
    if (!b) for (const s of solids) if (inObb(s.core, gx, gz, 0.4)) { b = true; break; }
    if (!b) for (const w of P.walls) if (inObb(obb(w.x, w.z, w.len / 2, w.t / 2, w.ry), gx, gz, 0.6)) { b = true; break; }
    if (b) blk[idx(gx, gz)] = 1;
  }
  const seen = new Uint8Array(blk.length), q = [idx(0, HD - 3)]; seen[q[0]] = 1;
  while (q.length) { const c = q.pop(), gz = Math.floor(c / (N + 1)) - HD, gx = (c % (N + 1)) - HW; for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = gx + dx, z = gz + dz; if (Math.abs(x) > HW || Math.abs(z) > HD) continue; const j = idx(x, z); if (!blk[j] && !seen[j]) { seen[j] = 1; q.push(j); } } }
  for (const s of solids) { if (s.island) continue; const [x, z] = s.door, gx = Math.round(x), gz = Math.round(z); let okD = false; for (let a = -2; a <= 2 && !okD; a++) for (let b = -2; b <= 2 && !okD; b++) { if (Math.abs(gx + a) > HW || Math.abs(gz + b) > HD) continue; if (seen[idx(gx + a, gz + b)]) okD = true; } if (!okD) err.push(`KHÔNG tới được cửa ${s.name} (${gx},${gz}) từ cổng chính`); }
  // dấu chiếm đất (so khác nhau giữa các phủ)
  const fp = new Set(); for (const s of solids) if (s.kind !== 'p') for (const [x, z] of sample(s.core, 4)) fp.add(`${Math.round(x / 4)},${Math.round(z / 4)}`); foot.push({ id: P.st.id, fp });
  if (err.length) { bad += err.length; console.log(`✗ ${i} ${P.st.id}: ${err.length} lỗi\n   ` + [...new Set(err)].slice(0, 25).join('\n   ')); } else console.log(`✓ ${i} ${P.st.id}: ${solids.length} khối, ${P.paths.length} đoạn lối — sạch, đi tới mọi cửa`);
}
// 4. khác nhau
for (let a = 0; a < 9; a++) for (let b = a + 1; b < 9; b++) { const A = foot[a].fp, B = foot[b].fp; let n = 0; for (const k of A) if (B.has(k)) n++; const r = n / Math.min(A.size, B.size); if (r > 0.25) { bad++; console.log(`✗ ${foot[a].id} ~ ${foot[b].id}: trùng ${(r * 100).toFixed(0)} % chiếm đất`); } }
console.log(bad ? `\n${bad} lỗi — CHƯA ĐẠT` : '\n9 tổng mặt bằng sạch, khác nhau — ĐẠT');
process.exit(bad ? 1 : 0);
