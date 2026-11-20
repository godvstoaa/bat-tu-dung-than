// ============================================================================
//  KIỂM BIỆT PHỦ BẰNG SỐ (node, không cần trình duyệt) — docs/BIET-PHU-MANIFEST.md §5.
//  Với mỗi phong cách: dựng nhà / tháp / đình / cổng qua archcity/estatekit theo ĐÚNG khuôn lô (estates()), đo:
//   · tris (ngân sách: phủ chính ≤ 60k, nhà phụ ≤ 30k, biệt thự ≤ 22k, tháp ≤ 40k, đình ≤ 12k, cổng phủ ≤ 15k, cổng biệt thự ≤ 3k)
//   · khung bao dải thân (y plinth+0,5 … plinth+2): vách phải nằm trên chu vi w × d (lệch ≤ 1,6 m cho hiên / cột)
//   · cửa trước thông: tia ngang ở x = 0, y = plinth + 1,2 từ ngoài vào không chạm gì tới khi qua mặt +z ≥ 1,2 m (và mặt sau nếu back)
//   · trong nhà trống: tia xuống từ plinth + 2,1 ở lưới 1,5 m bên trong (cách vách 1,2 m) — ≥ 85 % chạm sàn ở plinth ± 0,35
//   · cao: đỉnh mái / b.h (báo, không chặn)
//    STYLE=cungdinh,hue node scripts/bietphu-check.mjs        (bỏ STYLE = mọi phong cách)
// ============================================================================
import * as THREE from 'three';
const warn = console.warn; console.warn = (...a) => { if (!String(a[0]).includes('toNonIndexed')) warn(...a); };
// node không có canvas: ngữ cảnh 2D giả (nhận mọi lệnh vẽ) — bộ dựng tạo texture canvas trong mats(), kiểm số không cần ảnh
const ctx2d = new Proxy({}, { get: (t, p) => (p in t ? t[p] : p === 'measureText' ? () => ({ width: 10 }) : p === 'createLinearGradient' || p === 'createRadialGradient' || p === 'createPattern' ? () => ({ addColorStop() {} }) : p === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : () => {}), set: (t, p, v) => { t[p] = v; return true; } });
globalThis.document ??= { baseURI: 'http://localhost/', createElement: () => ({ width: 1, height: 1, style: {}, getContext: () => ctx2d, toDataURL: () => '' }), createElementNS: () => ({ style: {}, addEventListener() {}, removeEventListener() {}, set src(v) {} }) };
const { estates } = await import('../src/game/mansions.js');
const { FAM_OF, estatePiece } = await import('../src/game/archcity/estatekit.js');

const only = process.env.STYLE ? process.env.STYLE.split(',') : null;
const L = estates().filter((m) => !m.heaven);
// ngân sách tam giác bậc GẦN (≤ NEAR_LOD 75 m — chỉ khuôn viên đang đứng); bậc VỪA ≤ 55 % (xa hơn, tới 240 m)
const BUDGET = { main: 100000, guest: 40000, wing: 40000, villa: 25000, tower: 90000, pav: 16000, gate: 18000, vgate: 9000 };
const rc = new THREE.Raycaster();
const meshesOf = (p) => { const out = []; for (const g of [p.base, p.shell]) { g.updateMatrixWorld(true); g.traverse((o) => { if (o.isMesh) { o.material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); out.push(o); } }); } return out; };
const hit = (ms, o, d, far) => { rc.set(o, d); rc.far = far; const h = rc.intersectObjects(ms, false); return h[0] || null; };

function bandBox(ms, y0, y1) {
  const bb = new THREE.Box3(), v = new THREE.Vector3();
  for (const m of ms) { const p = m.geometry.attributes.position; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); if (v.y >= y0 && v.y <= y1) bb.expandByPoint(v); } }
  return bb;
}
function checkHall(p, b, budget) {
  const ms = meshesOf(p), out = { tris: p.info.tris, trisMid: p.info.trisMid, ok: true, notes: [] };
  if (p.info.tris > budget) { out.ok = false; out.notes.push(`tris ${p.info.tris} > ${budget}`); }
  if (p.info.trisMid > budget * 0.55) { out.ok = false; out.notes.push(`tris vừa ${p.info.trisMid} > ${Math.round(budget * 0.55)}`); }
  // vách: tia ngang từ trong nhà (cao plinth + 1,5, lệch khỏi trục cửa) ra 4 phía — chạm vách ở ≈ nửa khuôn (±1,6 m)
  const hw = b.w / 2, hd = b.d / 2, y = b.plinth + 1.5, wl = [];
  for (const [ox, oz, dx, dz, want] of [[hw / 2, 0, 0, 1, hd], [hw / 2, 0, 0, -1, hd], [-hw / 2, 0, 0, 1, hd], [0, hd / 2, 1, 0, hw], [0, hd / 2, -1, 0, hw], [0, -hd / 2, 1, 0, hw]]) {
    const h = hit(ms, new THREE.Vector3(ox, y, oz), new THREE.Vector3(dx, 0, dz), want + 4);
    const got = h ? Math.abs(dx ? h.point.x : h.point.z) : Infinity; wl.push(got === Infinity ? '∞' : got.toFixed(1));
    if (Math.abs(got - want) > 1.6) { out.ok = false; out.notes.push(`vách ${dx ? (dx > 0 ? '+x' : '−x') : dz > 0 ? '+z' : '−z'} ở ${got === Infinity ? 'không có' : got.toFixed(1)} (khuôn ${want.toFixed(1)})`); }
  }
  out.band = wl.join('/');
  for (const sz of b.back ? [1, -1] : [1]) {
    const y = b.plinth + 1.2, z0 = sz * (hd + 4), h = hit(ms, new THREE.Vector3(0, y, z0), new THREE.Vector3(0, 0, -sz), 4 + 1.2);
    if (h) { out.ok = false; out.notes.push(`cửa ${sz > 0 ? 'trước' : 'sau'} bị chặn ở z ${h.point.z.toFixed(2)} (${h.object.name})`); }
  }
  let n = 0, good = 0;
  for (let x = -hw + 1.2; x <= hw - 1.2; x += 1.5) for (let z = -hd + 1.2; z <= hd - 1.2; z += 1.5) {
    n++; const h = hit(ms, new THREE.Vector3(x, b.plinth + 2.1, z), new THREE.Vector3(0, -1, 0), 3);
    if (h && Math.abs(h.point.y - b.plinth) < 0.35) good++;
  }
  out.floor = n ? good / n : 1;
  if (out.floor < 0.85) { out.ok = false; out.notes.push(`trong nhà chỉ ${(out.floor * 100).toFixed(0)} % sàn trống ở cao độ ${b.plinth}`); }
  const all = new THREE.Box3(); for (const m of ms) all.expandByObject(m);
  out.top = all.max.y; out.hRatio = all.max.y / (b.plinth + b.h);
  return out;
}
const fmt = (r) => `${r.ok ? 'ĐẠT ' : 'LỖI '} tris ${String(r.tris).padStart(6)}/${String(r.trisMid).padStart(6)}${r.floor != null ? ` sàn ${(r.floor * 100).toFixed(0)}%` : ''}${r.top != null ? ` đỉnh ${r.top.toFixed(1)} (${r.hRatio.toFixed(2)}×)` : ''} ${r.notes.join(' · ')}`;

let fail = 0, total = 0;
for (const styleId of Object.keys(FAM_OF)) {
  if (only && !only.includes(styleId)) continue;
  const phu = L.find((m) => m.kind === 'phu' && m.style === styleId), villa = L.find((m) => m.kind === 'villa' && m.style === styleId);
  console.log(`\n== ${styleId}`);
  for (const m of [phu, villa].filter(Boolean)) {
    const v = m.kind === 'villa';
    for (const b of m.layout.buildings) {
      for (const variant of v ? [0, 1, 2] : [0]) {
        const p = estatePiece(styleId, m.S, 'hall', { id: b.id, w: b.w, d: b.d, h: b.h, floors: b.floors, plinth: b.plinth, back: !!b.back }, { villa: v, variant });
        if (!p) { console.log(`  ${v ? 'villa' : 'phủ'} ${b.id.padEnd(5)} — chưa có (dùng bản cũ)`); break; }
        const r = checkHall(p, b, v ? BUDGET.villa : BUDGET[b.id]); total++; if (!r.ok) fail++;
        console.log(`  ${v ? `villa${variant}` : 'phủ   '} ${b.id.padEnd(5)} ${b.w.toFixed(0)}×${b.d.toFixed(0)} ${fmt(r)}`);
      }
    }
    if (!v) for (const t of m.layout.towers || []) { const p = estatePiece(styleId, m.S, 'tower', { w: t.w, d: t.d, h: t.h }); if (!p) { console.log('  tháp — chưa có'); continue; } total++; const ok = p.info.tris <= BUDGET.tower; if (!ok) fail++; const bb = new THREE.Box3(); for (const g of [p.base, p.shell]) bb.expandByObject(g); console.log(`  tháp ${ok ? 'ĐẠT' : 'LỖI'} tris ${p.info.tris} cao ${bb.max.y.toFixed(1)} (lô ${t.h.toFixed(0)}) rộng ${(bb.max.x - bb.min.x).toFixed(1)}×${(bb.max.z - bb.min.z).toFixed(1)} (lô ${t.w}×${t.d})`); }
    if (!v) for (const pv of m.layout.pavs) { const p = estatePiece(styleId, m.S, 'pav', { w: pv.w, d: pv.d, h: pv.h, octa: !!pv.octa }); if (!p) { console.log('  đình — chưa có'); continue; } total++; const ok = p.info.tris <= BUDGET.pav; if (!ok) fail++; const bb = new THREE.Box3(); for (const g of [p.base, p.shell]) bb.expandByObject(g); console.log(`  đình ${ok ? 'ĐẠT' : 'LỖI'} tris ${p.info.tris} cao ${bb.max.y.toFixed(1)} rộng ${(bb.max.x - bb.min.x).toFixed(1)}×${(bb.max.z - bb.min.z).toFixed(1)}`); }
    for (const variant of v ? [0, 1, 2] : [0]) { const p = estatePiece(styleId, m.S, 'gate', { w: m.layout.gate.w, villa: v, d: 0 }, { villa: v, variant }); if (!p) console.log(`  cổng ${v ? 'villa' : 'phủ'} — chưa có`); else { total++; const ms = meshesOf(p), lim = v ? BUDGET.vgate : BUDGET.gate; const h = hit(ms, new THREE.Vector3(0, 1.2, 6), new THREE.Vector3(0, 0, -1), 12); const ok = p.info.tris <= lim && !h; if (!ok) fail++; const bb = new THREE.Box3(); for (const g of [p.base, p.shell]) bb.expandByObject(g); console.log(`  cổng ${v ? `villa${variant}` : 'phủ '} ${ok ? 'ĐẠT' : 'LỖI'} tris ${p.info.tris} cao ${bb.max.y.toFixed(1)} rộng ${(bb.max.x - bb.min.x).toFixed(1)}${h ? ` · lối qua bị chặn ở z ${h.point.z.toFixed(2)} (${h.object.name})` : ''}`); } }
  }
}
console.log(`\nTổng ${total} phần, lỗi ${fail}`);
process.exit(fail ? 1 : 0);
