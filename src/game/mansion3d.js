// ============================================================================
//  KHUÔN VIÊN 3D — 16 biệt phủ + 240 biệt thự (mansions.js) ở vành phủ Ngoại Thành, mỗi phủ / mỗi khu một phong cách.
//   · Va chạm + nền đăng ký NGAY cho mọi khuôn viên (đi vào được, A* / NPC biết tường).
//   · Bản xa: tất cả gộp một mesh (tường rào + khối nhà + mái, màu theo phong cách) — 1 lệnh vẽ.
//   · Bản chi tiết dựng LƯỜI theo khoảng cách (phủ 240 m, biệt thự 110 m; tối đa 3 phủ + 8 biệt thự): nhà theo phong
//     cách (archkit-style), đình, tường rào + cổng, mặt nước minh đường, gò tọa sơn, cây, đèn.
//   · Vào trong một nhà: vỏ nhà (vách + mái) mờ đi, camera kẹp trong nhà (render3d gọi hallAt).
//   · Đồ đạc bài trí (theo vùng — estate-core.zonesOfH) dựng bằng bộ dựng món của phòng lưới; đồ có chức năng
//     thành điểm tương tác ngoài trời (rooms.setOpenSpots); người trong phủ (mansions.mansionNpcs).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as MD from './models.js';
import * as AK from './archkit.js';
import * as AS from './archkit-style.js';
import { estates, mansionSolids, toLocal, hallAtLocal, mansionNpcs, waterParts, mansionAt } from './mansions.js';
import { addSolidOBB, addPlatform, setRoomSolids, clearRoomSolids, addTall } from './obstacles.js';
import { addLight, LIGHTS } from './lights.js';
import { placeModel } from './assets.js';
import { setOpenSpots } from './rooms.js';
import { makeZoneCtx, furnishZone } from './interior-build.js';

const NEAR = { phu: 240, villa: 110 }, FAR = { phu: 330, villa: 150 }, MAX = { phu: 3, villa: 8 };
// Cửu Trọng Thiên: 8 đảo cách tâm 280 m — đứng quảng trường giữa phải thấy phủ thật (không phải khối hộp bản xa)
const nearOf = (m) => (m.heaven ? 310 : NEAR[m.kind]), farOf = (m) => (m.heaven ? 390 : FAR[m.kind]), maxOf = (m) => (m.heaven ? 4 : MAX[m.kind]);

/** Dựng hệ khuôn viên vào group (gọi một lần lúc nạp). provider(key) → { mode, owner, items, couplet } (main.js) */
export function createMansions(grp, { provider = () => null, citizens = null } = {}) {
  const list = estates();
  for (const m of list) {
    const { obbs, plats } = mansionSolids(m);
    for (const o of obbs) addSolidOBB(o.x, o.z, o.hw, o.hd, o.ry);
    for (const p of plats) addPlatform(p.x, p.z, p.w, p.d, p.ry, p.top);
    // đỉnh để leo / đứng: tường rào, nhà (nền + thân + mái), tháp, cây
    const W2 = (lx, lz) => m.toWorld(lx, lz);
    for (const w of m.walls) { const c = W2(w.x, w.z); addTall(c.x, c.z, w.len / 2, w.t / 2, w.ry + m.ry, w.h + 0.3); }
    for (const b of m.layout.buildings) { const c = W2(b.x, b.z); addTall(c.x, c.z, b.w / 2 + 0.6, b.d / 2 + 0.6, b.ry + m.ry, b.plinth + b.h + Math.min(5.2, (b.d + 3) * 0.27) * 0.55); }
    for (const t of m.layout.towers || []) { const c = W2(t.x, t.z); addTall(c.x, c.z, t.w * 0.42, t.d * 0.42, m.ry, t.h); }
    // mặt nước, đài phun, bồn cây trong phủ: «đạp nước» — đứng / lướt được trên mặt (khinh công thủy thượng phiêu)
    for (const wp of waterParts(m)) { const c = W2(wp.x, wp.z); if (wp.shape === 'ellipse') addTall(c.x, c.z, wp.rx, wp.rz, m.ry, 0.3); else if (wp.w) addTall(c.x, c.z, wp.w / 2, wp.d / 2, m.ry, wp.shape === 'hedge' ? 1.0 : 0.3); else addTall(c.x, c.z, wp.r, wp.r, 0, wp.shape === 'fountain' ? 2.4 : 1); }
    for (const t of m.layout.trees) { const c = W2(t.x, t.z); addTall(c.x, c.z, 0.6, 0.6, 0, t.kind === 'hedge' ? 1.2 : t.kind === 'cypress' ? 7.5 : 5.5); }
  }
  // --- bản xa: một mesh cho tất cả
  const geos = AK.farProxyGeometry(list.map((m) => ({ x: m.x, z: m.z, ry: m.ry, walls: m.walls, halls: [...m.layout.buildings.map((b) => ({ ...b, h: b.h })), ...m.layout.pavs.map((p) => ({ ...p, ry: 0, plinth: 0.5 })), ...(m.layout.towers || []).map((t) => ({ ...t, w: t.w * 0.42, d: t.d * 0.42, ry: 0, plinth: 1.2, h: t.h - 9 }))], body: m.S.wall, roofCol: m.S.roofCol, fenceCol: m.S.fence === 'hedge' ? '#3f6b3a' : m.S.fence === 'redwall' || m.S.fence === 'redstone' ? '#9a3b2a' : '#ddd5c4' })));
  // khuôn viên đã dựng chi tiết thì ẩn phần bản xa của nó (trước đây khối hộp + mái chóp đè lên nhà thật, z-fight, lộ qua vỏ gian mờ)
  const hideTex = new THREE.DataTexture(new Uint8Array(Math.max(1, list.length) * 4), Math.max(1, list.length), 1); hideTex.needsUpdate = true;
  const farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true });
  farMat.onBeforeCompile = (sh) => {
    sh.uniforms.uHide = { value: hideTex }; sh.uniforms.uN = { value: Math.max(1, list.length) };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
attribute float aEst; uniform sampler2D uHide; uniform float uN;`)
      .replace('#include <project_vertex>', `#include <project_vertex>
if (texture2D(uHide, vec2((aEst + 0.5) / uN, 0.5)).r > 0.5) gl_Position = vec4(0.0, 0.0, 2.0, 1.0);`);
  };
  farMat.customProgramCacheKey = () => 'estate-far-hide';
  const setHidden = (m, on) => { const i = list.indexOf(m); if (i < 0) return; hideTex.image.data[i * 4] = on ? 255 : 0; hideTex.needsUpdate = true; };
  const far = new THREE.Mesh(mergeGeometries(geos, false), farMat);
  geos.forEach((g) => g.dispose());
  far.receiveShadow = true; grp.add(far);
  // --- điểm cổng (giấy tờ / mua / khen) — luôn có
  const gateSpot = (m) => ({ id: 'gate', kind: 'home', name: `Cổng ${m.name}`, verb: `${m.name} · xem giấy tờ`, x: m.gate.x, z: m.gate.z, r: m.kind === 'phu' ? 2.2 : 1.6 });
  for (const m of list) setOpenSpots(`est:${m.h}`, [gateSpot(m)]);

  const built = new Map(); // h → rec
  function build(m) {
    const g = new THREE.Group(); g.name = `est:${m.h}`;
    setHidden(m, true);
    g.position.set(m.x, 0, m.z); g.rotation.y = m.ry;
    const S = m.S, L = m.layout, villa = m.kind === 'villa', k = AK.kit();
    const base = new THREE.Group(); g.add(base);
    const halls = [];
    L.buildings.forEach((b, i) => {
      const { base: bb, shell } = AS.styledBuilding(S, b, { villa });
      bb.position.set(b.x, 0, b.z); bb.rotation.y = b.ry; base.add(bb);
      const sg = new THREE.Group(); sg.position.set(b.x, 0, b.z); sg.rotation.y = b.ry; sg.add(shell);
      MD.mergeStatic(sg); MD.ownMaterials(sg); g.add(sg);
      halls.push({ zone: m.zones[i], g: sg, mats: sg.userData.fadeMats, op: 1 });
    });
    for (const pv of L.pavs) { const { base: b, shell } = AS.styledPavilion(S, pv); for (const o of [b, shell]) { o.position.set(pv.x, 0, pv.z); base.add(o); } }
    for (const tw of L.towers || []) { const o = AS.styledTower(S, tw); o.position.set(tw.x, 0, tw.z); base.add(o); }
    base.add(AS.styledFence(S, m.walls));
    base.add(AS.styledGate(S, { w: L.gate.w, villa, d: m.D / 2 }));
    // lối chính lát đá + sân trước nhà chính
    const main = L.buildings[0];
    for (const p of L.paths) { const o = new THREE.Mesh(new THREE.BoxGeometry(p.w, 0.05, p.d), k.pave); o.position.set(p.x, 0.03, p.z); o.receiveShadow = true; base.add(o); }
    { const fw = villa ? main.w : main.w + 6, fd = villa ? 1.6 : 5, o = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.05, fd), k.pave); o.position.set(0, 0.03, main.z + main.d / 2 + main.plinth + fd / 2 + 0.6); o.receiveShadow = true; base.add(o); }
    for (const p of waterParts(m)) base.add(AS.waterFeature(p));
    base.add(AS.mound(L.mound, L.mound.kind));
    let seed = m.h * 31 + 7;
    for (const t of L.trees) { const o = AS.styledTree(t.kind, seed++, villa ? 0.8 : 1); o.position.set(t.x, 0, t.z); o.rotation.y = seed; base.add(o); }
    if (!villa) for (const sx of [-1, 1]) { const o = AS.stoneLantern(); o.position.set(sx * 3.5, 0, main.z + main.d / 2 + main.plinth + 4); base.add(o); }
    MD.mergeStatic(base);
    if (!villa && S.fam === 'asian') for (const sx of [-1, 1]) placeModel(g, 'bq_lion', { fit: { height: 2.4 }, at: { x: sx * (L.gate.w / 2 + 2.4), y: 0, z: m.D / 2 + 2.4, ry: 0 } }).catch(() => null);
    const sign = signMesh(m.name, villa); sign.position.set(0, villa ? 2.6 : S.fam === 'asian' ? 5.3 : 5.4, m.D / 2 + (villa ? 0.3 : S.fam === 'asian' ? 0.15 : 0.4)); g.add(sign);
    const lights = [];
    const lp = villa ? [[0, 2.6, m.D / 2]] : [[-L.gate.w / 2, 4, m.D / 2 + 1], [L.gate.w / 2, 4, m.D / 2 + 1], [0, 3.5, main.z + main.d / 2 + 4]];
    for (const [x, y, z] of lp) { const p = m.toWorld(x, z); lights.push(addLight(p.x, y, p.z, { color: '#ffa04a', power: villa ? 0.7 : 1 })); }
    grp.add(g);
    const rec = { m, g, halls, lights, furn: null };
    built.set(m.h, rec);
    furnish(rec);
    return rec;
  }
  function dispose(h) {
    const rec = built.get(h); if (!rec) return;
    setHidden(rec.m, false);
    unfurnish(rec);
    grp.remove(rec.g);
    rec.g.traverse((o) => { if (o.isMesh) o.geometry?.dispose?.(); });
    for (const hl of rec.halls) for (const mt of hl.mats || []) mt.dispose();
    for (const L of rec.lights) { const i = LIGHTS.indexOf(L); if (i >= 0) LIGHTS.splice(i, 1); }
    built.delete(h);
  }
  function unfurnish(rec) {
    const f = rec.furn; if (!f) return;
    for (const c of f.ctxs) { rec.g.remove(c.g); for (const o of c.own) o.dispose?.(); for (const L of c.lightRefs || []) { const i = LIGHTS.indexOf(L); if (i >= 0) LIGHTS.splice(i, 1); } }
    clearRoomSolids(`estdo:${rec.m.h}`);
    for (const n of f.npcs || []) citizens?.remove?.(n.id);
    rec.furn = null;
  }
  function furnish(rec) {
    unfurnish(rec);
    const { m } = rec, info = provider(`est:${m.h}`) || { mode: 'sale', items: [] };
    const items = info.items || [];
    const ctxs = [], solids = [], useSpots = [];
    for (const z of m.zones) {
      const mine = items.filter((it) => (it.k || 0) === z.k);
      if (!mine.length && !(z.main && info.mode === 'own')) continue;
      const c = m.toWorld(z.x, z.z);
      const ctx = makeZoneCtx(rec.g, { key: `est:${m.h}`, local: { x: z.x, z: z.z, ry: z.ry }, world: { x: c.x, z: c.z, ry: z.ry + m.ry }, y: z.kind === 'hall' ? z.plinth : 0, w: z.w, d: z.d, h: z.h || 4, yard: z.kind === 'yard' });
      furnishZone(ctx, mine, { mode: info.mode, couplet: info.couplet || 0, deed: z.main });
      ctxs.push(ctx); solids.push(...ctx.solids); useSpots.push(...ctx.spots);
    }
    setRoomSolids(`estdo:${m.h}`, solids);
    setOpenSpots(`est:${m.h}`, [gateSpot(m), ...useSpots]);
    const npcs = mansionNpcs(m, info);
    for (const n of npcs) citizens?.add?.(n);
    rec.furn = { ctxs, npcs };
  }
  let tick = 0;
  const count = (kind) => [...built.values()].filter((r) => r.m.kind === kind).length;
  return {
    far,
    /** mỗi khung: dựng / nhả theo khoảng cách; vỏ nhà mờ khi người chơi ở trong. Trả nhà đang đứng. */
    update(px, pz, dt = 0.016) {
      tick -= dt;
      if (tick <= 0) {
        tick = 0.4;
        for (const rec of [...built.values()]) if (Math.hypot(rec.m.x - px, rec.m.z - pz) > farOf(rec.m)) dispose(rec.m.h);
        // dựng khuôn viên gần nhất chưa dựng (mỗi lượt một cái — tránh khựng)
        let best = null, bd = Infinity;
        for (const m of list) {
          if (built.has(m.h)) continue;
          const d = Math.hypot(m.x - px, m.z - pz);
          if (d < nearOf(m) && d < bd && count(m.kind) < maxOf(m)) { bd = d; best = m; }
        }
        if (best) build(best);
        else for (const kind of ['phu', 'villa']) { // đầy chỗ: thay cái xa nhất bằng cái gần hơn
          const near = list.filter((m) => m.kind === kind && !built.has(m.h) && Math.hypot(m.x - px, m.z - pz) < nearOf(m)).sort((a, b) => Math.hypot(a.x - px, a.z - pz) - Math.hypot(b.x - px, b.z - pz))[0];
          if (!near) continue;
          const farRec = [...built.values()].filter((r) => r.m.kind === kind).sort((a, b) => Math.hypot(b.m.x - px, b.m.z - pz) - Math.hypot(a.m.x - px, a.m.z - pz))[0];
          if (farRec && Math.hypot(farRec.m.x - px, farRec.m.z - pz) > Math.hypot(near.x - px, near.z - pz) + 20) { dispose(farRec.m.h); build(near); break; }
        }
      }
      let inHall = null;
      const here = mansionAt(px, pz, 1);
      for (const rec of built.values()) {
        const l = rec.m === here ? toLocal(rec.m, px, pz) : null;
        const hz = l ? hallAtLocal(rec.m, l.x, l.z) : null;
        for (const h of rec.halls) {
          const goal = hz === h.zone ? 0.3 : 1;
          if (Math.abs(h.op - goal) < 0.01) continue;
          h.op += (goal - h.op) * Math.min(1, dt * 7);
          for (const mt of h.mats) { mt.opacity = h.op; mt.depthWrite = h.op > 0.95; }
        }
        if (hz) inHall = { m: rec.m, zone: hz };
      }
      return inHall;
    },
    /** nhà chứa điểm thế giới (cho camera): { cx, cz, ry, hw, hd, top } | null */
    hallAt(x, z) {
      const m = mansionAt(x, z, 1); if (!m) return null;
      const l = toLocal(m, x, z), h = hallAtLocal(m, l.x, l.z); if (!h) return null;
      const c = m.toWorld(h.x, h.z);
      return { cx: c.x, cz: c.z, ry: h.ry + m.ry, hw: h.w / 2, hd: h.d / 2, top: h.plinth + Math.max(3.4, h.h) };
    },
    refurnish(h) { const rec = built.get(h); if (rec) furnish(rec); },
    isBuilt: (h) => built.has(h),
    builtCount: () => built.size,
  };
}

function signMesh(text, small = false) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160;
  const g = c.getContext('2d');
  g.fillStyle = '#1e120c'; g.fillRect(0, 0, 512, 160); g.strokeStyle = '#d9a441'; g.lineWidth = 12; g.strokeRect(8, 8, 496, 144);
  g.fillStyle = '#f0cf6a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  let s = 84; g.font = `bold ${s}px serif`; while (g.measureText(text).width > 470 && s > 30) { s -= 4; g.font = `bold ${s}px serif`; }
  g.fillText(text, 256, 84);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(small ? 1.8 : 4.6, small ? 0.56 : 1.44), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }));
}
