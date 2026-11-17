// ============================================================================
//  LẦU CHÍNH 10 TẦNG — dựng hình (three.js) theo tienphu/tower.js (CÙNG đặc tả với va chạm) và 9 phong cách:
//  thềm · sàn có lỗ thang · vách có cửa (cửa sổ vẽ theo phong cách) · hành lang ngoài + lan can + hàng cột · mái hiên từng
//  tầng (cong vểnh / váy mái Nhật / hai lớp Thái / phẳng Tây Tạng / gờ Gothic / dải Art Deco / gờ tân cổ điển / công-xôn
//  Mughal) · cầu thang 29 bậc + tay vịn · lan can lỗ thang · đĩa THANG PHÉP + cột sáng xuyên lầu · Vọng Đài + đỉnh lầu.
//  Mỗi tầng một nhóm (ẩn tầng trên khi người chơi ở trong — nhìn như nhà búp bê); vách tầng tách riêng để làm mờ.
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FH, SLAB, RISERS, RISE, TREAD, RUN, STAIR_W, WALL_T, DOOR_W, PAD_R, LEVELS, polySides, columnRing, stairRect } from './tower.js';
import { uvMeters, boxAt, cylAt, polyPrism, polySlab, skirt, pyramidRoof, railPoly, railLine, columnGeo } from './geo.js';
import { themeFurniture } from './themes.js';

/** gom geometry theo khoá vật liệu → một Mesh mỗi vật liệu */
export class Acc {
  constructor() { this.m = new Map(); }
  add(key, ...geos) { if (!this.m.has(key)) this.m.set(key, []); for (const g of geos.flat()) if (g) this.m.get(key).push(g); return this; }
  build(M, { shadow = true, name = '' } = {}) {
    const grp = new THREE.Group(); grp.name = name;
    for (const [key, list] of this.m) {
      if (!list.length || !M[key]) continue;
      const norm = list.map((g) => { let q = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(q.attributes)) if (!['position', 'normal', 'uv'].includes(k)) q.deleteAttribute(k); if (!q.attributes.uv) q.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(q.attributes.position.count * 2), 2)); if (!q.attributes.normal) q.computeVertexNormals(); return q; });
      const geo = mergeGeometries(norm, false); list.forEach((g) => g.dispose()); norm.forEach((g) => g.dispose());
      if (!geo) continue;
      const mesh = new THREE.Mesh(geo, M[key]); mesh.castShadow = shadow && key !== 'beam2' && key !== 'glass'; mesh.receiveShadow = true; mesh.userData.matKey = key;
      grp.add(mesh);
    }
    this.m.clear();
    return grp;
  }
}

const ROOFED = { curved: 1, vn: 1, skirt: 1, thai: 1 };

/** gộp MỌI mesh trong group theo vật liệu (kể cả geometry không chỉ số / thiếu uv — models.mergeStatic bỏ qua loại đó) */
export function mergeAll(group, { dedupe = false } = {}) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), buckets = new Map(), victims = [];
  group.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || Array.isArray(o.material) || o.userData.dynamic) return;
    let q = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    q.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    for (const k of Object.keys(q.attributes)) if (!['position', 'normal', 'uv'].includes(k)) q.deleteAttribute(k);
    if (!q.attributes.normal) q.computeVertexNormals();
    if (!q.attributes.uv) q.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(q.attributes.position.count * 2), 2));
    const mt = o.material, key = (dedupe ? `${mt.type}|${mt.color?.getHexString?.()}|${mt.map?.uuid || ''}|${mt.emissive?.getHexString?.() || ''}|${mt.transparent}|${mt.opacity}|${mt.side}|${mt.vertexColors}|${mt.flatShading}|${mt.roughness}` : mt.uuid) + (o.castShadow ? 's' : 'n');
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, geos: [] });
    buckets.get(key).geos.push(q); victims.push(o);
  });
  for (const o of victims) o.parent?.remove(o);
  // bỏ group rỗng còn lại
  const prune = (g) => { for (const c of [...g.children]) { prune(c); if (!c.isMesh && !c.children.length && c.type === 'Group') g.remove(c); } };
  prune(group);
  for (const b of buckets.values()) { const geo = mergeGeometries(b.geos, false); b.geos.forEach((g) => g.dispose()); if (!geo) continue; const m = new THREE.Mesh(geo, b.mat); m.castShadow = b.cast; m.receiveShadow = true; group.add(m); }
  return group;
}

/**
 * spec: towerSpec(st) · st: phong cách · M: tpMats · themes: [10 chỉ số chủ đề]
 * Trả { root, floors: [{ g, shell }] (11 phần tử: 10 tầng + Vọng Đài), column, podium }
 */
export function buildTower(spec, st, M, themes) {
  const T = st.tower, n = spec.n, root = new THREE.Group(); root.name = 'tower';
  const floors = [];
  // ---------------- thềm
  const pod = new Acc(), P = spec.podium, pa = P.a;
  if (P.kind === 'ishigaki' || P.kind === 'battered') { const g = new THREE.CylinderGeometry(pa * Math.SQRT2, (pa + P.y * (P.kind === 'ishigaki' ? 0.32 : 0.15)) * Math.SQRT2, P.y, 4, 1, false, Math.PI / 4); g.translate(0, P.y / 2, 0); uvMeters(g, 2.5, 2.5, 4); pod.add('stone', g); }
  else pod.add('stone', uvMeters(boxAt(pa * 2, P.y, pa * 2, 0, P.y / 2, 0), 3, 3, 4));
  pod.add('floor', boxAt(pa * 2 - 0.2, 0.04, pa * 2 - 0.2, 0, P.y + 0.02, 0));
  if (P.kind === 'terrace3' || P.kind === 'angkor' || P.kind === 'plinthTaj' || P.kind === 'terrace') for (let i = 1; i <= 3; i++) pod.add(i % 2 ? 'marble' : 'stoneDark', boxAt(pa * 2 + 0.3, 0.22, pa * 2 + 0.3, 0, (P.y * i) / 3 - 0.11, 0)); // gờ tầng thềm
  // lan can mép thềm (khớp va chạm towerCollision: chừa miệng bậc)
  const sw = P.stairW / 2;
  pod.add('rail', railLine(-pa + 0.3, -pa + 0.3, pa - 0.3, -pa + 0.3, P.y), railLine(-pa + 0.3, -pa + 0.3, -pa + 0.3, pa - 0.3, P.y), railLine(pa - 0.3, -pa + 0.3, pa - 0.3, pa - 0.3, P.y), railLine(-pa + 0.3, pa - 0.3, -sw - 0.2, pa - 0.3, P.y), railLine(sw + 0.2, pa - 0.3, pa - 0.3, pa - 0.3, P.y));
  // bậc thềm + hai thành bậc
  for (let i = 1; i <= P.steps; i++) { const top = i * P.rise, z = pa + P.run - (i - 0.5) * P.tread; pod.add('stone', boxAt(P.stairW, top, P.tread + 0.02, 0, top / 2, z)); }
  for (const sx of [-1, 1]) { const g = new THREE.BoxGeometry(0.7, 1, P.run); const pp = g.attributes.position; for (let i = 0; i < pp.count; i++) { const zz = pp.getZ(i), yy = pp.getY(i); const h = P.y * (0.5 - zz / P.run) + 0.9; pp.setY(i, yy > 0 ? Math.max(0.9, h) : 0); } g.computeVertexNormals(); g.translate(sx * (sw + 0.35), 0, pa + P.run / 2); pod.add('marble', g); }
  const podium = pod.build(M, { name: 'podium' }); root.add(podium);

  // ---------------- tầng 0..9 + Vọng Đài (10)
  for (let k = 0; k <= LEVELS; k++) {
    const deck = k === LEVELS, f = deck ? { k, y: spec.deck.y, a: spec.deck.a, gal: false, slabA: spec.deck.a + 0.25 } : spec.floors[k];
    const Y = f.y, a = f.a, acc = new Acc(), sh = new Acc();
    const below = k ? spec.stairs[k - 1] : null, here = deck ? null : spec.stairs[k];
    // sàn (tầng ≥ 1: bản sàn có lỗ thang tầng dưới) + mặt lát trong vách
    const holes = below ? [stairRect(below)] : [];
    if (k) acc.add('stone', polySlab(n, f.slabA, Y, SLAB, holes));
    acc.add('floor', polySlab(n, Math.max(1, a - WALL_T / 2), Y + 0.025, 0.02, holes));
    // vách + cửa (khớp towerCollision)
    if (!deck) {
      const wallKey = T.red && T.red.includes(k) ? 'facadeRed' : T.lowerCol && k < 5 ? 'facadeLow' : 'facade', H = FH - SLAB;
      for (const sd of polySides(n, a)) {
        const door = (sd.front && (k === 0 || f.gal)) || (sd.back && f.gal);
        const ux = (sd.x1 - sd.x0) / sd.len, uz = (sd.z1 - sd.z0) / sd.len;
        const pieces = door ? [[-sd.len / 2, -DOOR_W / 2], [DOOR_W / 2, sd.len / 2]] : [[-sd.len / 2, sd.len / 2]];
        for (const [u0, u1] of pieces) {
          if (u1 - u0 < 0.05) continue; const um = (u0 + u1) / 2;
          const g = boxAt(u1 - u0 + (n > 4 ? 0.12 : 0.5), H, WALL_T, sd.mx + ux * um, Y + H / 2, sd.mz + uz * um, sd.ry);
          uvMeters(g, 3.6, FH, 4, spec.podium.y); sh.add(wallKey, g);
        }
        if (door) { // khung + lanh tô cửa
          sh.add(wallKey, uvMeters(boxAt(DOOR_W, H - 3.0, WALL_T, sd.mx, Y + 3.0 + (H - 3) / 2, sd.mz, sd.ry), 3.6, FH, 4, spec.podium.y));
          for (const s of [-1, 1]) acc.add('trim', boxAt(0.22, 3.0, WALL_T + 0.12, sd.mx + ux * s * (DOOR_W / 2 + 0.11), Y + 1.5, sd.mz + uz * s * (DOOR_W / 2 + 0.11), sd.ry));
          acc.add('trim', boxAt(DOOR_W + 0.6, 0.28, WALL_T + 0.14, sd.mx, Y + 3.1, sd.mz, sd.ry));
        }
      }
      // gờ tầng / dải trang trí theo phong cách (trên vách, ngoài)
      if (T.eave === 'string' || T.eave === 'cornice' || T.eave === 'deco' || T.eave === 'corbel' || T.eave === 'flat') {
        for (const sd of polySides(n, a + 0.18)) acc.add(T.eave === 'deco' ? 'dark' : 'trim', boxAt(sd.len + 0.3, T.eave === 'cornice' ? 0.5 : 0.3, 0.4, sd.mx, Y + FH - 0.3, sd.mz, sd.ry));
        if (T.eave === 'deco') for (const sd of polySides(n, a + 0.12)) { const m = Math.max(2, Math.round(sd.len / 3)); for (let i = 1; i < m; i++) { const t = i / m; acc.add('trim', boxAt(0.35, FH - 0.5, 0.3, sd.x0 + (sd.x1 - sd.x0) * t, Y + FH / 2, sd.z0 + (sd.z1 - sd.z0) * t, sd.ry)); } }
        if (T.pema && k >= LEVELS - 3) for (const sd of polySides(n, a + 0.22)) acc.add('roofFlat', boxAt(sd.len + 0.4, 0.9, 0.35, sd.mx, Y + FH - 0.95, sd.mz, sd.ry)); // dải pema
      }
      if (T.fluted) for (const sd of polySides(n, a + 0.05)) for (const t of [0.25, 0.75]) acc.add(k < 5 ? 'stone' : 'marble', cylAt(0.32, 0.32, FH - 0.5, sd.x0 + (sd.x1 - sd.x0) * t, Y + FH / 2, sd.z0 + (sd.z1 - sd.z0) * t, 8)); // rãnh khía Qutb
      // nội thất kiến trúc: 4 đèn vách, xà trần, biển tên tầng (xem themes)
      for (const sd of polySides(n, a - WALL_T / 2 - 0.12)) if (!sd.front && !sd.back && (n === 4 || sd.k % 2 === 0)) { acc.add('lampGlow', new THREE.SphereGeometry(0.22, 8, 6).translate(sd.mx, Y + 2.6, sd.mz)); acc.add('gold', cylAt(0.04, 0.04, 0.5, sd.mx, Y + 2.95, sd.mz, 5)); }
      for (let i = -1; i <= 1; i += 2) acc.add('wood', boxAt(2 * a - 1, 0.35, 0.3, 0, Y + FH - SLAB - 0.18, i * a * 0.35)); // xà trần
      // cầu thang tầng này: bậc mỏng + 2 dầm cốn + tay vịn phía trong
      const s = here, x = s.x;
      for (let i = 1; i < RISERS; i++) { const top = Y + i * RISE, z = s.z0 - (i - 0.5) * TREAD; acc.add('wood', boxAt(s.w, 0.08, TREAD + 0.02, x, top - 0.04, z)); acc.add('stone', boxAt(s.w, RISE, 0.04, x, top - RISE / 2, z + TREAD / 2)); }
      for (const sx of [-1, 1]) { const g = boxAt(0.14, 0.35, Math.hypot(RUN, FH) + 0.3, 0, 0, 0); g.rotateX(Math.atan2(FH, RUN)); g.translate(x + sx * (s.w / 2 + 0.07), Y + FH / 2 - 0.15, 0); acc.add('trim', g); }
      for (let i = 2; i < RISERS; i += 3) { const top = Y + i * RISE, z = s.z0 - (i - 0.5) * TREAD; acc.add('rail', boxAt(0.08, 0.9, 0.08, s.xi - s.side * 0.12, top + 0.45, z)); }
      { const g = new THREE.CylinderGeometry(0.05, 0.05, Math.hypot(RUN, FH), 6); g.rotateX(Math.PI / 2 + Math.atan2(FH, RUN)); g.translate(s.xi - s.side * 0.12, Y + FH / 2 + 0.9, 0); acc.add('rail', g); }
    }
    // lan can quanh lỗ thang (tầng dưới đi lên) — cạnh trong + đầu xa
    if (below) acc.add('rail', railLine(below.xi - below.side * 0.12, -RUN / 2, below.xi - below.side * 0.12, RUN / 2 + 0.1, Y), railLine(below.x - below.w / 2 - 0.1, RUN / 2 + 0.1, below.x + below.w / 2 + 0.1, RUN / 2 + 0.1, Y));
    // thang phép: đĩa ngọc + vòng phù văn + 2 trụ đèn
    { const p = spec.pad; acc.add('jade', cylAt(PAD_R, PAD_R, 0.08, p.x, Y + 0.06, p.z, 28)); const ring = new THREE.TorusGeometry(PAD_R + 0.1, 0.06, 6, 36); ring.rotateX(Math.PI / 2); ring.translate(p.x, Y + 0.1, p.z); acc.add('gold', ring); for (const sx of [-1, 1]) { acc.add('gold', cylAt(0.07, 0.09, 1.6, p.x + sx * (PAD_R + 0.5), Y + 0.8, p.z, 8)); acc.add('lampGlow', new THREE.SphereGeometry(0.18, 8, 6).translate(p.x + sx * (PAD_R + 0.5), Y + 1.7, p.z)); } }
    // hành lang ngoài: lan can (tầng 1 chừa lối) + hàng cột + xà
    if (f.gal) {
      const open = k === 0 ? (x, z) => Math.abs(x) < 2.2 && Math.abs(Math.abs(z) - (f.slabA - 0.15)) < 0.5 : null;
      acc.add('rail', railPoly(n, f.slabA - 0.15, Y, 1.1, open));
      if (spec.columns) { const cs = T.colonnade ? 'corinth' : 'round'; for (const [cx, cz] of columnRing(n, f.slabA - 0.7, spec.colStep)) acc.add('column', columnGeo(cx, cz, Y, FH - SLAB - 0.05, T.colonnade ? 0.36 : 0.3, cs)); for (const sd of polySides(n, f.slabA - 0.7)) acc.add('beam', boxAt(sd.len + 0.4, 0.45, 0.45, sd.mx, Y + FH - SLAB - 0.3, sd.mz, sd.ry)); }
      if (T.crenel) for (const sd of polySides(n, f.slabA - 0.05)) { const m = Math.round(sd.len / 1.2); for (let i = 0; i < m; i += 2) { const t = (i + 0.5) / m; acc.add('stone', boxAt(sd.len / m, 0.7, 0.4, sd.x0 + (sd.x1 - sd.x0) * t, Y + 1.45, sd.z0 + (sd.z1 - sd.z0) * t, sd.ry)); } }
      if (T.eave === 'corbel') for (let r = 0; r < 3; r++) acc.add('trim', polyPrism(n, f.slabA - 0.4 - r * 0.45, Y - SLAB - 0.35 * (r + 1), 0.35, f.slabA - 0.1 - r * 0.45)); // muqarnas công-xôn đỡ ban công
    }
    // MÁI HIÊN trên tầng (trừ tầng cuối — đỉnh lầu lo)
    if (!deck && ROOFED[T.eave] && k < LEVELS - 1) {
      const out = f.slabA + (T.eave === 'skirt' ? 1.2 : 1.6), y0 = Y + FH - 0.15;
      const drop = T.eave === 'skirt' ? 1.3 : T.eave === 'thai' ? 1.5 : 1.7, up = T.eave === 'skirt' ? 0.25 : T.eave === 'vn' ? 1.1 : T.eave === 'thai' ? 0.5 : 0.9;
      acc.add('roof', skirt(n, a - 0.05, out, y0, drop, up));
      acc.add(T.eave === 'thai' ? 'eaveBorder' : 'trim', skirt(n, out - 0.35, out + 0.05, y0 - drop * 0.98, 0.12, up * 0.9, 4));
      if (T.eave === 'thai') { acc.add('roof', skirt(n, out - 0.4, out + 1.2, y0 - drop + 0.1, 0.9, 0.6)); for (const [cx, cz] of polySides(n, out + 1.1).map((sd) => [sd.x1, sd.z1])) acc.add('gold', cylAt(0.08, 0.02, 1.4, cx, y0 - drop - 0.2, cz, 5)); }
      if (T.chidori && k % 2 === 1) for (const sd of polySides(n, a)) if (!sd.back) { const g = new THREE.CylinderGeometry(0, 2.6, 2.2, 3, 1, false, 0); g.rotateZ(Math.PI / 2); g.rotateX(Math.PI / 2); g.scale(1.6, 1, 0.9); g.rotateY(sd.ry); g.translate(sd.mx + sd.nx * 0.8, y0 + 0.4, sd.mz + sd.nz * 0.8); acc.add('roof', g); acc.add('wall', boxAt(3.6, 1.6, 0.2, sd.mx + sd.nx * 0.6, y0 + 0.5, sd.mz + sd.nz * 0.6, sd.ry)); }
      if (T.eave === 'curved' || T.eave === 'vn') for (const sd of polySides(n, f.slabA - 0.7)) { const m = Math.max(2, Math.round(sd.len / 1.2)); for (let i = 0; i <= m; i++) { const t = i / m; acc.add('gold', boxAt(0.36, 0.3, 0.5, sd.x0 + (sd.x1 - sd.x0) * t, Y + FH - SLAB + 0.05, sd.z0 + (sd.z1 - sd.z0) * t, sd.ry)); } } // đấu củng
    }
    // ---------------- Vọng Đài: sàn mở + lan can + đỉnh lầu
    if (deck) {
      acc.add('rail', railPoly(n, a + 0.05, Y, 1.1));
      crown(acc, spec, st, M, Y, a);
    }
    // đồ bài trí theo chủ đề tầng (đổi được — chủ phủ)
    if (!deck) themeFurniture(acc, spec, k, themes ? themes[k] : k, st);
    const g = acc.build(M, { name: `floor${k}` }), shell = sh.build(M, { name: `shell${k}` });
    for (const o of shell.children) { o.material = o.material.clone(); o.material.transparent = true; }
    const fg = new THREE.Group(); fg.name = `tf${k}`; fg.add(g, shell); root.add(fg);
    floors.push({ g: fg, shell, y: Y });
  }
  // cột sáng thang phép xuyên mọi tầng
  const colH = spec.deck.y - spec.podium.y + 3.2, column = new THREE.Mesh(new THREE.CylinderGeometry(PAD_R * 0.9, PAD_R * 0.9, colH, 24, 1, true), M.beam2);
  column.position.set(spec.pad.x, spec.podium.y + colH / 2, spec.pad.z); column.userData.noCollide = true; root.add(column);
  // tháp góc Gothic: trụ tròn suốt thân + mái nón
  if (spec.turrets) {
    const acc = new Acc(), r = spec.turrets, a0 = spec.floors[0].a, top = spec.deck.y + 1.5;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const g = new THREE.CylinderGeometry(r, r, top - spec.podium.y, 18); g.translate(sx * a0, spec.podium.y + (top - spec.podium.y) / 2, sz * a0); uvMeters(g, 3.6, FH, 4, spec.podium.y); acc.add('facade', g); const c = new THREE.ConeGeometry(r + 0.6, r * 3.2, 18); c.translate(sx * a0, top + r * 1.6, sz * a0); acc.add('roofFlat', c); acc.add('gold', cylAt(0.06, 0.06, 2, sx * a0, top + r * 3.2 + 0.8, sz * a0, 5)); }
    floors[LEVELS].g.add(acc.build(M, { name: 'turrets' }));
  }
  // bản GỘP cả lầu (đứng ngoài lầu: ~20 lệnh vẽ thay vì ~170) — trong lầu thì hiện từng tầng (towerView)
  const whole = new THREE.Group(); whole.name = 'towerWhole'; whole.userData.noCollide = true;
  for (const fl of floors) whole.add(fl.g.clone());
  mergeAll(whole, { dedupe: true });
  for (const o of whole.children) if (o.material?.transparent && o.material.opacity >= 0.99 && o.material !== M.glass && o.material !== M.beam2 && o.material !== M.jade && o.material !== M.water) { o.material = o.material.clone(); o.material.transparent = false; }
  root.add(whole);
  for (const fl of floors) fl.g.visible = false;
  return { root, floors, column, podium, whole };
}

/** đỉnh lầu theo phong cách trên Vọng Đài (y = mặt sàn Vọng Đài, a = apothem) */
function crown(acc, spec, st, M, Y, a) {
  const n = spec.n, T = st.tower, cm = M.crownMat ? 'crownMat' : 'gold';
  const ring = (rr, y, h = 3.6, step = 3.4, style = 'round', r = 0.3) => { for (const [cx, cz] of columnRing(n, rr, step)) acc.add('column', columnGeo(cx, cz, y, h, r, style)); };
  switch (T.crown) {
    case 'doubleHip': // trùng thiềm: hai lớp mái cong + bờ nóc vàng + hồ lô
      ring(a - 0.6, Y, 3.8); acc.add('beam', polyPrism(n, a - 0.2, Y + 3.8, 0.6));
      acc.add('roof', skirt(n, a * 0.62, a + 2.8, Y + 4.6, 2.2, 1.3)); acc.add('wall', polyPrism(n, a * 0.62, Y + 4.6, 2.2)); acc.add('roof', pyramidRoof(n, a * 0.72 + 2.2, Y + 6.6, 7.5, 0.7, 1.1));
      acc.add(cm, cylAt(0.25, 0.5, 2.2, 0, Y + 14.3, 0, 10), new THREE.SphereGeometry(0.7, 12, 10).translate(0, Y + 15.8, 0)); break;
    case 'irimoya': // irimoya + cá shachi hai đầu nóc
      acc.add('facade', uvMeters(polyPrism(n, a - 0.3, Y, 4.2), 3.6, FH, 4, spec.podium.y));
      acc.add('roof', pyramidRoof(n, a + 2.6, Y + 4.2, 6.5, 0.45, 0.4));
      for (const sx of [-1, 1]) { const f = new THREE.ConeGeometry(0.45, 1.6, 8); f.rotateZ(sx * 0.5); f.translate(sx * (a * 0.32), Y + 10.4, 0); acc.add('gold', f); }
      break;
    case 'goldCanopy': // mái bằng + 3 điện mái vàng nhỏ + cờ thắng gyaltsen + bánh xe pháp
      // điện vàng nhỏ giữa trước + 2 điện vàng phía sau hai bên (chừa đĩa thang phép giữa sau và đầu thang hai bên)
      acc.add('wall', polyPrism(4, 2.4, Y, 3.6).translate(0, 0, a * 0.45)); acc.add('roofFlat', pyramidRoof(4, 3.4, Y + 3.6, 2.8, 0.5, 0.6).translate(0, 0, a * 0.45));
      for (const sx of [-1, 1]) { acc.add('wall', polyPrism(4, 2.0, Y, 3.0).translate(sx * 5.5, 0, -7.5)); acc.add('roofFlat', pyramidRoof(4, 2.9, Y + 3.0, 2.2, 0.5, 0.5).translate(sx * 5.5, 0, -7.5)); }
      for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) acc.add('gold', cylAt(0.45, 0.45, 2.4, cx * (a - 1), Y + 1.2, cz * (a - 1), 10), new THREE.SphereGeometry(0.4, 8, 6).translate(cx * (a - 1), Y + 2.7, cz * (a - 1)));
      { const w = new THREE.TorusGeometry(1.2, 0.14, 8, 24); w.translate(0, Y + 9.6, a * 0.55 + 1.3); acc.add('gold', w); } break;
    case 'spire': // mái chóp đá phiến dốc + 4 tháp nhọn góc + chữ thập
      acc.add('roofFlat', pyramidRoof(4, a + 0.6, Y, 22, 0.05, 0));
      for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { acc.add('stone', cylAt(0.6, 0.6, 3, cx * (a - 0.5), Y + 1.5, cz * (a - 0.5), 8)); const c = new THREE.ConeGeometry(0.75, 4, 8); c.translate(cx * (a - 0.5), Y + 5, cz * (a - 0.5)); acc.add('roofFlat', c); }
      acc.add(cm, cylAt(0.12, 0.12, 3.6, 0, Y + 23.6, 0, 6), boxAt(1.6, 0.18, 0.18, 0, Y + 24.6, 0)); break;
    case 'sunburst': { // vương miện vòm toả tia (Chrysler) + cửa tam giác + chóp kim
      let s = a - 0.4, y = Y;
      for (let t = 0; t < 5; t++) { acc.add('steel', polyPrism(4, s, y, 2.6, s - 0.8)); for (const sd of polySides(4, s - 0.35)) { const arc = new THREE.TorusGeometry(s * 0.62, 0.22, 6, 18, Math.PI); arc.rotateY(sd.ry); arc.translate(sd.mx, y + 0.3, sd.mz); acc.add('steel', arc); for (let i = -1; i <= 1; i++) { const tri = new THREE.ConeGeometry(0.4, 1.0, 3); tri.translate(sd.mx + Math.cos(sd.ry) * i * s * 0.35, y + 1.2, sd.mz - Math.sin(sd.ry) * i * s * 0.35); acc.add('lampGlow', tri); } } y += 2.6; s -= 1.2; }
      const sp = new THREE.ConeGeometry(Math.max(0.6, s * 0.5), 18, 8); sp.translate(0, y + 9, 0); acc.add(M.crownMat ? 'crownMat' : 'steel', sp); break;
    }
    case 'dome': // tholos: vòng cột Corinth + trống + vòm bán cầu + oculus + đèn lồng đỉnh
      ring(a - 0.8, Y, 5.2, 3.0, 'corinth', 0.4); acc.add('trim', polyPrism(n, a - 0.2, Y + 5.2, 0.9));
      acc.add('wall', polyPrism(n, a * 0.86, Y + 6.1, 2.4)); { const d = new THREE.SphereGeometry(a * 0.86, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2 - 0.12); d.translate(0, Y + 8.5, 0); acc.add('roofFlat', d); }
      { const o = new THREE.TorusGeometry(a * 0.86 * 0.12 + 0.3, 0.25, 6, 20); o.rotateX(Math.PI / 2); o.translate(0, Y + 8.5 + a * 0.86 * 0.99, 0); acc.add('trim', o); }
      acc.add('column', cylAt(1.2, 1.2, 2.6, 0, Y + 9.8 + a * 0.86, 0, 12)); acc.add(cm, new THREE.SphereGeometry(1.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, Y + 11.1 + a * 0.86, 0)); break;
    case 'gourd': // mái bát giác ngói vàng vểnh đầu đao + hồ lô
      ring(a - 0.6, Y, 3.8); acc.add('beam', polyPrism(n, a - 0.2, Y + 3.8, 0.5));
      { const R2 = st.tower.topCol ? 'gold' : 'roof'; acc.add('roof', pyramidRoof(n, a + 2.6, Y + 4.3, 7.5, 0.8, 1.4)); }
      acc.add(cm, new THREE.SphereGeometry(0.9, 12, 10).translate(0, Y + 12.4, 0), new THREE.SphereGeometry(0.6, 12, 10).translate(0, Y + 13.6, 0), cylAt(0.08, 0.08, 1.6, 0, Y + 14.6, 0, 6)); break;
    case 'prang': { // prang (bắp ngô): vành thót dần + gờ hoa văn + đinh ba
      let r = a * 0.38, y = Y; // nền prang nhỏ giữa — chừa đĩa thang phép (sau) và đầu thang (hai bên)
      acc.add('wall', polyPrism(4, r, y, 4)); y += 4;
      for (let t = 0; t < 7; t++) { acc.add(t % 2 ? 'gold' : 'wall', polyPrism(8, r, y, 2.2, r * 0.86)); acc.add('trim', polyPrism(8, r + 0.2, y + 2.0, 0.3)); y += 2.2; r *= 0.84; }
      acc.add(cm, cylAt(0.15, 0.3, 4.5, 0, y + 2.2, 0, 8)); for (const s of [-1, 0, 1]) acc.add(cm, cylAt(0.06, 0.06, 1.2, s * 0.4, y + 4.8, 0, 5)); break;
    }
    case 'chhatri': // chhatri: 8 cột mảnh + vòm củ hành + chóp; chhatri nhỏ 4 góc
      ring(a * 0.55, Y, 4.0, 2.2, 'round', 0.25); acc.add('marble', polyPrism(8, a * 0.6, Y + 4, 0.8));
      { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16, r = a * 0.62 * Math.sin(Math.PI * Math.min(1, t * 1.2)) * (1 - t * 0.55); pts.push(new THREE.Vector2(Math.max(0.05, r), t * a * 1.3)); } const d = new THREE.LatheGeometry(pts, 24); d.translate(0, Y + 4.8, 0); acc.add('marble', d); acc.add(cm, cylAt(0.08, 0.15, 3, 0, Y + 4.8 + a * 1.3 + 1.2, 0, 6)); }
      for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const x = cx * (a - 1.6), z = cz * (a - 1.6); for (const [dx, dz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) acc.add('marble', cylAt(0.09, 0.09, 2.2, x + dx, Y + 1.1, z + dz, 6)); acc.add('marble', new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).translate(x, Y + 2.2, z)); }
      break;
    default: break;
  }
}
