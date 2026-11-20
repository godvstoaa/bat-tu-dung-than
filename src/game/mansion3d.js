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
import { addSolidOBB, addPlatform, setRoomSolids, clearRoomSolids, addTall, setRoomSolids3, clearRoomSolids3, setVoxelLayer } from './obstacles.js';
import { registerTien } from './tienphu/register.js';
import { buildTienJob } from './tienphu/estate3d.js';
import { voxelJob } from './tienphu/voxel.js';
import { FH, LEVELS } from './tienphu/tower.js';
import { FLOOR_THEMES } from './tienphu/styles.js';
import { decodeOpts } from './tienphu/custom.js';
import { addLight, LIGHTS } from './lights.js';
import { placeModel, dropInstances, warmObject } from './assets.js';
import { setOpenSpots } from './rooms.js';
import { makeZoneCtx, furnishZone } from './interior-build.js';
import { estatePiece, NEAR_LOD } from './archcity/estatekit.js';
import { archMats, boxUV, SPAN } from './archcity/mats.js';
import { estateFence, estateTrees, hedgeRow, pondRim, rockery as ekRockery, prefetchTrees } from './archcity/estate-dress.js';

// biến thể nhà biệt thự 0–2 (luật ART_BIBLE «không nhân bản một lưới»): theo số nhà trong khu, hai căn kề nhau khác nhau
const VAR = (m) => (m.k ?? m.h) % 3;
const NEAR = { phu: 240, villa: 110 }, FAR = { phu: 330, villa: 150 }, MAX = { phu: 3, villa: 8 };
// Cửu Trọng Thiên: 8 đảo cách tâm 280 m — đứng quảng trường giữa phải thấy phủ thật (không phải khối hộp bản xa)
// tiên phủ 520 m (TIEN-PHU-MANIFEST §2): dựng khi cách tâm < 640 m (đang qua cầu 330 m sang), tối đa 2 phủ chi tiết
const nearOf = (m) => (m.heaven ? 640 : NEAR[m.kind]), farOf = (m) => (m.heaven ? 780 : FAR[m.kind]), maxOf = (m) => (m.heaven ? 2 : MAX[m.kind]);

/** Dựng hệ khuôn viên vào group (gọi một lần lúc nạp). provider(key) → { mode, owner, items, couplet } (main.js) */
export function createMansions(grp, { provider = () => null, citizens = null } = {}) {
  const list = estates();
  for (const m of list) {
    if (m.heaven) { registerTien(m); continue; } // tiên phủ: va chạm theo đặc tả (sàn lầu / bậc / hố hồ / tường / vách) — TIEN-PHU-MANIFEST §4
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
  const towerBox = (m) => { if (!m.tp) return []; const sp = m.tp.tower.spec; return [{ x: m.tp.tower.x, z: m.tp.tower.z, w: sp.floors[0].a * 2, d: sp.floors[0].a * 2, ry: 0, plinth: sp.podium.y, h: sp.height - sp.podium.y - 6 }]; };
  const geos = AK.farProxyGeometry(list.map((m) => ({ x: m.x, z: m.z, ry: m.ry, walls: m.walls, halls: [...m.layout.buildings.map((b) => ({ ...b, h: b.h })), ...m.layout.pavs.map((p) => ({ ...p, ry: 0, plinth: 0.5 })), ...(m.layout.towers || []).map((t) => ({ ...t, w: t.w * 0.42, d: t.d * 0.42, ry: 0, plinth: 1.2, h: t.h - 9 })), ...towerBox(m)], body: m.S.wall, roofCol: m.S.roofCol, fenceCol: m.S.fence === 'hedge' ? '#3f6b3a' : m.S.fence === 'redwall' || m.S.fence === 'redstone' ? '#9a3b2a' : '#ddd5c4' })));
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
  // TIÊN PHỦ: dựng dần qua nhiều khung (estate3d generator) rồi lấy vật cản từ lưới hình (voxel) — TIEN-PHU-MANIFEST §4
  function buildTien(m) {
    const info = provider(`est:${m.h}`) || { mode: 'sale', items: [] };
    const opts = info.opts ? decodeOpts(info.opts) : null;
    const used = new Set((info.items || []).map((it) => it.k || 0)), empty = new Set(m.zones.filter((z) => z.kind === 'hall' && !z.tower && !used.has(z.k)).map((z) => z.k));
    const rec = { m, g: null, halls: [], lights: [], furn: null, tien: true, job: buildTienJob(m, opts, empty), vox: null, optsKey: info.opts || '', zoneSig: [...empty].join(','), floorK: -1 };
    built.set(m.h, rec);
    return rec;
  }
  function stepTien(rec, budgetMs) {
    const t0 = performance.now();
    while (rec.job && performance.now() - t0 < budgetMs) {
      const r = rec.job.next();
      if (r.done) {
        rec.job = null; const out = r.value;
        rec.g = out.g; rec.halls = out.halls; rec.tower = out.tower; rec.hallsWhole = out.hallsWhole;
        // đồ GLB (docs/TIEN-PHU-DOHOA-MANIFEST.md): ngoài trời luôn hiện · sảnh hiện khi trong 40 m · tầng lầu hiện khi đứng tầng đó / tầng trên
        rec.flora = out.flora; rec.props = out.props;
        if (rec.props) { rec.props.outdoor.build(grp); for (const ps of rec.props.halls) { ps.group.visible = false; ps.build(grp); } rec.props.floors.forEach((ps) => { if (!ps) return; ps.group.visible = false; ps.build(grp); }); }
        setHidden(rec.m, true); grp.add(rec.g);
        const m = rec.m, main = m.layout.buildings[0];
        for (const [x, y, z] of [[-6, 5, m.D / 2 + 3], [6, 5, m.D / 2 + 3], [main.x + Math.sin(main.ry || 0) * (main.d / 2 + 6), 4, main.z + Math.cos(main.ry || 0) * (main.d / 2 + 6)], [m.tp.tower.x, m.tp.tower.spec.podium.y + 4, m.tp.tower.z + m.tp.tower.spec.podium.a + 2]]) { const p = m.toWorld(x, z); rec.lights.push(addLight(p.x, y, p.z, { color: '#ffb35c', power: 1 })); }
        const sign = signMesh(m.name, false); sign.position.set(0, 8.5, m.D / 2 + 1.2); rec.g.add(sign);
        furnish(rec);
        // vật cản từ lưới hình: lầu (nhiều tầng — không thêm đặc 2D trong thềm lầu) + mọi thứ đặc khác
        const sp = m.tp.tower.spec, tx = m.tp.tower.x, tz = m.tp.tower.z;
        rec.vox = { out: {}, job: null };
        rec.vox.job = voxelJob(out.solidRoots, rec.vox.out, { skip2D: (x, z) => { const l = toLocal(m, x, z); return Math.abs(l.x - tx) < sp.podium.a + 1 && Math.abs(l.z - tz) < sp.podium.a + sp.podium.run + 1; } });
      }
    }
    while (!rec.job && rec.vox?.job && performance.now() - t0 < budgetMs) {
      const r = rec.vox.job.next();
      if (r.done) { rec.vox.job = null; rec.vox.stats = setVoxelLayer(`vox:${rec.m.h}`, rec.vox.out.cells3, rec.vox.out.cells2); rec.vox.dbg = globalThis.__voxDebug ? rec.vox.out : null; rec.vox.out = null; } // __voxDebug: script kiểm giữ lại bản ô
    }
  }
  // (2026-11-20, docs/TRE-DICH-CHUYEN-MANIFEST.md §6) DỰNG CHIA KHUNG: build() chỉ tạo bản ghi + job (generator); update()
  // chạy job ≤ 6 ms mỗi khung, nhả sau mỗi phần (nhà / đình / tháp / rào / cổng / nước / cây / đồ bài trí) — trước đây dựng
  // một mạch 0,3–0,7 s trên luồng chính (khựng sau dịch chuyển). Xong job → làm nóng shader → vào cảnh.
  function build(m) {
    if (m.heaven) return buildTien(m);
    const g = new THREE.Group(); g.name = `est:${m.h}`;
    const rec = { m, g, halls: [], lights: [], furn: null, lods: [], trees: null, lodNear: null, job: null };
    rec.job = buildGen(m, rec);
    built.set(m.h, rec);
    return rec;
  }
  function stepJob(rec, budgetMs) {
    const t0 = performance.now();
    while (rec.job && performance.now() - t0 < budgetMs) { const r = rec.job.next(); if (r.done) rec.job = null; }
  }
  function* buildGen(m, rec) {
    const g = rec.g;
    // (2026-11-20, docs/TRE-DICH-CHUYEN-MANIFEST.md) bản xa vẫn hiện tới khi nhà chi tiết đã biên dịch shader xong (bên dưới)
    g.position.set(m.x, 0, m.z); g.rotation.y = m.ry;
    const S = m.S, L = m.layout, villa = m.kind === 'villa', k = AK.kit();
    const base = new THREE.Group(); g.add(base);
    const halls = rec.halls, lods = rec.lods;
    // BIỆT PHỦ LÀM LẠI (docs/BIET-PHU-MANIFEST.md): nhà / tháp / đình / cổng dựng bằng bộ kiến trúc thật theo họ phong cách
    // (archcity/estatekit) đúng khuôn lô; phần nào họ chưa có thì giữ bản archkit-style cũ. __noEstateKit = bản cũ (đo A/B).
    const EK = !globalThis.__noEstateKit;
    const ekPut = (pc, x, z, ry = 0, z0 = 0) => { // nền + thân (thân có bậc vừa) vào g, không gộp (userData.dynamic)
      const bg = new THREE.Group(); bg.userData.dynamic = true; bg.position.set(x, 0, z + z0); bg.rotation.y = ry; bg.add(pc.base);
      const sg = new THREE.Group(); sg.userData.dynamic = true; sg.position.copy(bg.position); sg.rotation.y = ry; sg.add(pc.shell);
      if (pc.shellMid) { pc.shellMid.visible = false; sg.add(pc.shellMid); lods.push({ near: pc.shell, mid: pc.shellMid, x, z: z + z0, nd: villa ? 35 : NEAR_LOD }); } // biệt thự sát nhau ~25 m: bậc gần chỉ căn đang đứng cạnh
      g.add(bg, sg); return sg;
    };
    for (let i = 0; i < L.buildings.length; i++) {
      const b = L.buildings[i];
      const pc = EK && estatePiece(m.style, S, 'hall', { id: b.id, w: b.w, d: b.d, h: b.h, floors: b.floors, plinth: b.plinth, back: !!b.back }, { villa, variant: villa ? VAR(m) : 0 });
      if (pc) { const sg = ekPut(pc, b.x, b.z, b.ry); MD.ownMaterials(sg); for (const mt of sg.userData.fadeMats) mt.transparent = false; halls.push({ zone: m.zones[i], g: sg, mats: sg.userData.fadeMats, op: 1 }); yield; continue; }
      const { base: bb, shell } = AS.styledBuilding(S, b, { villa });
      bb.position.set(b.x, 0, b.z); bb.rotation.y = b.ry; base.add(bb);
      const sg = new THREE.Group(); sg.position.set(b.x, 0, b.z); sg.rotation.y = b.ry; sg.add(shell);
      MD.mergeStatic(sg); MD.ownMaterials(sg); g.add(sg);
      halls.push({ zone: m.zones[i], g: sg, mats: sg.userData.fadeMats, op: 1 });
      yield;
    }
    for (const pv of L.pavs) {
      const pc = EK && estatePiece(m.style, S, 'pav', { w: pv.w, d: pv.d, h: pv.h, octa: !!pv.octa });
      if (pc) { ekPut(pc, pv.x, pv.z); yield; continue; }
      const { base: b, shell } = AS.styledPavilion(S, pv); for (const o of [b, shell]) { o.position.set(pv.x, 0, pv.z); base.add(o); }
      yield;
    }
    for (const tw of L.towers || []) {
      const pc = EK && estatePiece(m.style, S, 'tower', { w: tw.w, d: tw.d, h: tw.h });
      if (pc) { ekPut(pc, tw.x, tw.z); yield; continue; }
      const o = AS.styledTower(S, tw); o.position.set(tw.x, 0, tw.z); base.add(o);
      yield;
    }
    if (EK && S.fence !== 'hedge') base.add(estateFence(S, m.walls, { villa })); else if (!EK) base.add(AS.styledFence(S, m.walls));
    yield;
    { const pc = EK && estatePiece(m.style, S, 'gate', { w: L.gate.w, villa, d: 0 }, { villa, variant: villa ? VAR(m) : 0 });
      if (pc) ekPut(pc, 0, m.D / 2); else base.add(AS.styledGate(S, { w: L.gate.w, villa, d: m.D / 2 })); }
    yield;
    // lối chính lát đá + sân trước nhà chính
    const main = L.buildings[0];
    // lối + sân lát đá: tấm đá lặp theo mét (2,4 m / ảnh) thay hộp xám phẳng — cạnh viền đá trắng 0,25 m
    const paveMat = EK ? archMats().floor : k.pave, edgeMat = EK ? archMats().marble : k.pave;
    const slab = (w, d, x, z) => { const geo = new THREE.BoxGeometry(w, 0.06, d).translate(x, 0.03, z); const o = new THREE.Mesh(EK ? boxUV(geo, { span: SPAN.stone, index: true }) : geo, paveMat); o.receiveShadow = true; base.add(o);
      if (EK) for (const sx of [-1, 1]) { const e = new THREE.Mesh(boxUV(new THREE.BoxGeometry(0.25, 0.1, d).translate(x + sx * (w / 2 + 0.12), 0.05, z), { span: SPAN.marble, index: true }), edgeMat); e.receiveShadow = true; base.add(e); } };
    for (const p of L.paths) slab(p.w, p.d, p.x, p.z);
    { const fw = villa ? main.w : main.w + 6, fd = villa ? 1.6 : 5; slab(fw, fd, 0, main.z + main.d / 2 + main.plinth + fd / 2 + 0.6); }
    for (const p of waterParts(m)) {
      if (EK && p.shape === 'ellipse') { g.add(AS.waterFeature({ ...p, rocks: false })); g.add(pondRim(p, m.h + 1)); continue; } // ao: bờ đá xếp + đá tảng (không còn 64 khối 12 mặt đen)
      base.add(AS.waterFeature(p));
    }
    yield;
    const hedgeMound = [];
    if (!EK) base.add(AS.mound(L.mound, L.mound.kind));
    else if (L.mound.kind === 'rock') g.add(ekRockery(L.mound, m.h + 3));
    else if (L.mound.kind === 'hedge') for (let x = -L.mound.w / 2 + 0.9; x <= L.mound.w / 2 - 0.9; x += 1.6) hedgeMound.push({ kind: 'hedge', x: L.mound.x + x, z: L.mound.z });
    // (mound 'trees': rặng cây đã có trong L.trees — không dựng gò cầu rêu)
    yield;
    let seed = m.h * 31 + 7, trees = null;
    if (EK) trees = estateTrees(g, [...L.trees, ...hedgeMound, ...(S.fence === 'hedge' ? hedgeRow(m.walls) : [])], { villa });
    else for (const t of L.trees) { const o = AS.styledTree(t.kind, seed++, villa ? 0.8 : 1); o.position.set(t.x, 0, t.z); o.rotation.y = seed; base.add(o); }
    if (!villa) for (const sx of [-1, 1]) { const o = AS.stoneLantern(); o.position.set(sx * 3.5, 0, main.z + main.d / 2 + main.plinth + 4); base.add(o); }
    yield;
    MD.mergeStatic(base);
    yield;
    if (!villa && S.fam === 'asian') for (const sx of [-1, 1]) placeModel(g, 'bq_lion', { fit: { height: 2.4 }, at: { x: sx * (L.gate.w / 2 + 2.4), y: 0, z: m.D / 2 + 2.4, ry: 0 } }).catch(() => null);
    const sign = signMesh(m.name, villa); sign.position.set(0, villa ? 2.6 : S.fam === 'asian' ? 5.3 : 5.4, m.D / 2 + (villa ? 0.3 : S.fam === 'asian' ? 0.15 : 0.4)); g.add(sign);
    const lights = rec.lights;
    const lp = villa ? [[0, 2.6, m.D / 2]] : [[-L.gate.w / 2, 4, m.D / 2 + 1], [L.gate.w / 2, 4, m.D / 2 + 1], [0, 3.5, main.z + main.d / 2 + 4]];
    for (const [x, y, z] of lp) { const p = m.toWorld(x, z); lights.push(addLight(p.x, y, p.z, { color: '#ffa04a', power: villa ? 0.7 : 1 })); }
    // biên dịch shader + đẩy texture TRƯỚC khi vào cảnh (renderer.compileAsync qua assets.warmObject): trước đây thêm thẳng →
    // khung đầu biên dịch đồng bộ mọi vật liệu mới của phủ (đo phủ Mughal sau dịch chuyển: getProgramInfoLog 1,3 s, khựng tới 1 s)
    rec.trees = trees;
    yield;
    furnish(rec, true); // đồ bài trí vào g TRƯỚC khi làm nóng (đo: 5 chương trình đồ nội thất còn biên dịch đồng bộ khi bày sau)
    const show = () => { if (built.get(m.h)?.g !== g) return; grp.add(g); setHidden(m, true); };
    warmObject(g).then(show, show);
  }
  function dispose(h) {
    const rec = built.get(h); if (!rec) return;
    setHidden(rec.m, false);
    if (rec.tien) { setVoxelLayer(`vox:${h}`, new Map(), new Set()); if (!rec.g) { built.delete(h); return; } }
    unfurnish(rec);
    if (rec.props) for (const ps of [rec.props.outdoor, ...rec.props.halls, ...rec.props.floors]) if (ps) { dropInstances(ps.group); grp.remove(ps.group); }
    grp.remove(rec.g);
    rec.g.traverse((o) => { if (!o.isMesh || o.userData.ek || o.isInstancedMesh) return; for (let p = o.parent; p; p = p.parent) if (p.userData.shared) return; o.geometry?.dispose?.(); }); // hình estatekit / cây mẫu dùng chung
    for (const hl of rec.halls) for (const mt of hl.mats || []) mt.dispose();
    for (const L of rec.lights) { const i = LIGHTS.indexOf(L); if (i >= 0) LIGHTS.splice(i, 1); }
    built.delete(h);
  }
  function unfurnish(rec) {
    const f = rec.furn; if (!f) return;
    for (const c of f.ctxs) { rec.g.remove(c.g); for (const o of c.own) o.dispose?.(); for (const L of c.lightRefs || []) { const i = LIGHTS.indexOf(L); if (i >= 0) LIGHTS.splice(i, 1); } }
    clearRoomSolids(`estdo:${rec.m.h}`); clearRoomSolids3(`estdo3:${rec.m.h}`);
    for (const n of f.npcs || []) citizens?.remove?.(n.id);
    rec.furn = null;
  }
  function furnish(rec, fromJob = false) {
    if (rec.job && !fromJob) return; // đang dựng chia khung: job tự bày đồ ở bước cuối
    unfurnish(rec);
    const { m } = rec, info = provider(`est:${m.h}`) || { mode: 'sale', items: [] };
    const items = info.items || [];
    if (rec.tien && !rec.g) return; // tiên phủ đang dựng dần
    const ctxs = [], solids = [], solids3 = [], useSpots = [];
    for (const z of m.zones) {
      const mine = items.filter((it) => (it.k || 0) === z.k);
      if (!mine.length && !(z.main && info.mode === 'own')) continue;
      const c = m.toWorld(z.x, z.z);
      const ctx = makeZoneCtx(rec.g, { key: `est:${m.h}`, local: { x: z.x, z: z.z, ry: z.ry }, world: { x: c.x, z: c.z, ry: z.ry + m.ry }, y: z.kind === 'hall' ? z.plinth : 0, w: z.w, d: z.d, h: z.h || 4, yard: z.kind === 'yard' });
      furnishZone(ctx, mine, { mode: info.mode, couplet: info.couplet || 0, deed: z.main });
      ctxs.push(ctx); useSpots.push(...ctx.spots);
      if (z.tower) for (const o of ctx.solids) solids3.push({ ...o, y0: z.plinth, y1: z.plinth + 2.2 }); else solids.push(...ctx.solids);
    }
    setRoomSolids(`estdo:${m.h}`, solids);
    setRoomSolids3(`estdo3:${m.h}`, solids3);
    const extra = [];
    if (m.tp) { // thang phép (mọi tầng — cùng một điểm) + bảng tuỳ biến cho chủ phủ trước chính điện
      const sp = m.tp.tower.spec, p = m.toWorld(m.tp.tower.x + sp.pad.x, m.tp.tower.z + sp.pad.z);
      extra.push({ id: 'lift', kind: 'lift', name: 'Thang phép', verb: 'Thang phép · chọn tầng', x: p.x, z: p.z, r: 1.6, h: m.h });
      if (info.mode === 'own') { const main = m.layout.buildings[0], q = m.toWorld(main.x + Math.sin(main.ry || 0) * (main.d / 2 + 6) - 8 * Math.cos(main.ry || 0), main.z + Math.cos(main.ry || 0) * (main.d / 2 + 6) + 8 * Math.sin(main.ry || 0)); extra.push({ id: 'custom', kind: 'tpcustom', name: 'Sổ tuỳ biến phủ', verb: 'Tuỳ biến tiên phủ', x: q.x, z: q.z, r: 2, h: m.h }); }
    }
    setOpenSpots(`est:${m.h}`, [gateSpot(m), ...useSpots, ...extra]);
    const npcs = mansionNpcs(m, info);
    for (const n of npcs) citizens?.add?.({ ...n, outdoor: true }); // gia nhân trong sân phủ: tự kiểm vật cản (citizens › settle)
    rec.furn = { ctxs, npcs };
  }
  let tick = 0;
  const count = (kind) => [...built.values()].filter((r) => r.m.kind === kind).length;
  return {
    far,
    /** mỗi khung: dựng / nhả theo khoảng cách; vỏ nhà mờ khi người chơi ở trong. Trả nhà đang đứng. */
    update(px, pz, dt = 0.016, py = null) {
      // tiên phủ đang dựng dần / đang lấy vật cản: mỗi khung một ít (≤ 6 ms)
      for (const rec of built.values()) if (rec.tien && (rec.job || rec.vox?.job)) { stepTien(rec, 6); break; }
      for (const rec of built.values()) if (!rec.tien && rec.job) { stepJob(rec, 6); break; } // biệt phủ / biệt thự dựng chia khung
      // lầu 10 tầng: ở trong lầu thì ẩn các tầng trên, vách tầng đang đứng mờ đi (nhìn như nhà búp bê)
      for (const rec of built.values()) if (rec.tower) towerView(rec, px, pz, py, dt);
      // biệt phủ làm lại: bậc gần / vừa của nhà, tháp, đình, cổng theo khoảng cách người chơi (khung cục bộ); cây 3 bậc
      for (const rec of built.values()) if (rec.lods?.length || rec.trees) {
        const l = toLocal(rec.m, px, pz);
        for (const L2 of rec.lods) { const near = Math.hypot(l.x - L2.x, l.z - L2.z) < L2.nd; if (L2.near.visible !== near) { L2.near.visible = near; L2.mid.visible = !near; } }
        rec.trees?.update(l.x, l.z);
      }
      for (const rec of built.values()) if (rec.flora || rec.props) {
        const l = toLocal(rec.m, px, pz);
        rec.flora?.update(l.x, l.z);
        if (rec.props) for (const ps of rec.props.halls) ps.group.visible = Math.hypot(l.x - ps.at.x, l.z - ps.at.z) < ps.at.r * 0.6 + 6; // trong / sát cửa sảnh: ngoài đó vỏ sảnh gộp (đặc) che kín đồ — vẽ thừa ~150k tam giác + bóng
      }
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
          for (const mt of h.mats) { mt.opacity = h.op; mt.depthWrite = h.op > 0.95; mt.transparent = h.op < 0.99; } // chỉ trong suốt khi đang mờ (lượt trong suốt không sớm-z → vẽ chồng tốn)
        }
        if (rec.hallsWhole) { const inside = !!hz; rec.hallsWhole.visible = !inside; for (const h of rec.halls) h.g.visible = inside; } // tiên phủ: ngoài sảnh vẽ bản gộp
        if (hz) inHall = { m: rec.m, zone: hz };
      }
      return inHall;
    },
    /** nhà chứa điểm thế giới (cho camera): { cx, cz, ry, hw, hd, top } | null — y: cao độ (lầu nhiều tầng) */
    hallAt(x, z, y = null) {
      const m = mansionAt(x, z, 1); if (!m) return null;
      if (m.tp && y != null) { const f = towerFloorAt(m, x, z, y); if (f) return f.hall; }
      const l = toLocal(m, x, z), h = hallAtLocal(m, l.x, l.z); if (!h) return null;
      const c = m.toWorld(h.x, h.z);
      return { cx: c.x, cz: c.z, ry: h.ry + m.ry, hw: h.w / 2, hd: h.d / 2, top: h.plinth + Math.max(3.4, h.h) };
    },
    refurnish(h) {
      const rec = built.get(h); if (!rec) return;
      if (rec.tien) { // đổi tuỳ biến / sảnh trống ↔ có đồ → dựng lại phủ (đồ mặc định nhường chỗ cho đồ của chủ)
        const info = provider(`est:${h}`) || {}, used = new Set((info.items || []).map((it) => it.k || 0));
        const sig = rec.m.zones.filter((z) => z.kind === 'hall' && !z.tower && !used.has(z.k)).map((z) => z.k).join(',');
        if ((info.opts || '') !== rec.optsKey || sig !== rec.zoneSig) { dispose(h); buildTien(rec.m); return; }
      }
      furnish(rec);
    },
    /** tầng lầu tiên phủ tại (x, z, y): { m, k (0–10), y, name } | null */
    towerFloor: (x, z, y) => { const m = mansionAt(x, z, 1); return m?.tp ? towerFloorAt(m, x, z, y) : null; },
    builtRec: (h) => built.get(h) || null,
    isBuilt: (h) => built.has(h),
    builtCount: () => built.size,
    /**
     * DỰNG SẴN KHI ĐI (docs/TRE-DICH-CHUYEN-MANIFEST.md §4c): bấm dịch chuyển → trong lúc lớp phủ «vó ngựa» che màn (1,2 s),
     * dựng trước bộ đệm estatePiece (nhà / đình / tháp / cổng) của các khuôn viên sẽ dựng chi tiết quanh điểm đến + nạp khuôn
     * cây. Tới nơi build() chỉ còn sao chép từ bộ đệm. Chạy dần qua setTimeout, mỗi lượt ≤ 1 phần (1 phần nặng nhất ~0,3 s).
     */
    prefetch(x, z) {
      if (globalThis.__noEstateKit || globalThis.__noPrefetch) return Promise.resolve(0);
      const near = list.filter((m) => !m.heaven && Math.hypot(m.x - x, m.z - z) < nearOf(m)).sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
      const pick = [...near.filter((m) => m.kind === 'phu').slice(0, MAX.phu), ...near.filter((m) => m.kind === 'villa').slice(0, MAX.villa)];
      const jobs = [];
      for (const m of pick) {
        const L = m.layout, villa = m.kind === 'villa', v = villa ? VAR(m) : 0;
        for (const b of L.buildings) jobs.push(() => estatePiece(m.style, m.S, 'hall', { id: b.id, w: b.w, d: b.d, h: b.h, floors: b.floors, plinth: b.plinth, back: !!b.back }, { villa, variant: v }));
        for (const pv of L.pavs) jobs.push(() => estatePiece(m.style, m.S, 'pav', { w: pv.w, d: pv.d, h: pv.h, octa: !!pv.octa }));
        for (const tw of L.towers || []) jobs.push(() => estatePiece(m.style, m.S, 'tower', { w: tw.w, d: tw.d, h: tw.h }));
        jobs.push(() => estatePiece(m.style, m.S, 'gate', { w: L.gate.w, villa, d: 0 }, { villa, variant: v }));
      }
      const trees = prefetchTrees(pick.flatMap((m) => m.layout.trees.map((t) => t.kind)).concat(['hedge']));
      return new Promise((res) => { let i = 0; const run = () => { const t0 = performance.now(); while (i < jobs.length && performance.now() - t0 < 12) jobs[i++](); if (i < jobs.length) setTimeout(run, 0); else trees.then(() => res(jobs.length)); }; run(); });
    },
  };
}

/** tầng lầu chứa điểm (x, z, y) của tiên phủ m — null nếu ngoài thân lầu */
function towerFloorAt(m, x, z, y) {
  const sp = m.tp.tower.spec, l = toLocal(m, x, z), lx = l.x - m.tp.tower.x, lz = l.z - m.tp.tower.z;
  const a0 = sp.floors[0].slabA + 0.5;
  if (Math.abs(lx) > a0 || Math.abs(lz) > a0 || y < sp.podium.y - 0.6) return null;
  const k = Math.max(0, Math.min(LEVELS, Math.floor((y - sp.podium.y + 0.6) / FH)));
  const f = k < LEVELS ? sp.floors[k] : { y: sp.deck.y, a: sp.deck.a };
  if (Math.abs(lx) > f.a + 0.2 || Math.abs(lz) > f.a + 0.2) return { m, k, y: f.y, outside: true, name: k < LEVELS ? `Tầng ${k + 1}` : 'Vọng Đài', hall: null };
  const c = m.toWorld(m.tp.tower.x, m.tp.tower.z);
  return { m, k, y: f.y, name: k < LEVELS ? `Tầng ${k + 1} · ${FLOOR_THEMES[k].name}` : 'Vọng Đài', hall: k < LEVELS ? { cx: c.x, cz: c.z, ry: m.ry, hw: f.a - 0.4, hd: f.a - 0.4, top: f.y + FH - 2.3 } : null }; // render3d cho camera tới top + 1,5 → dưới đáy sàn trên
}
/** hiện / ẩn tầng lầu theo vị trí người chơi */
function towerView(rec, px, pz, py, dt) {
  const f = py == null ? null : towerFloorAt(rec.m, px, pz, py);
  const k = f && !f.outside ? f.k : -1;
  rec.tower.whole.visible = k < 0; // ngoài lầu: bản gộp
  rec.tower.floors.forEach((fl, i) => {
    fl.g.visible = k >= 0 && i <= k;
    const goal = i === k && k < LEVELS ? 0.22 : 1;
    for (const o of fl.shell.children) { const mt = o.material; if (Math.abs(mt.opacity - goal) < 0.01) continue; mt.opacity += (goal - mt.opacity) * Math.min(1, dt * 7); mt.depthWrite = mt.opacity > 0.95; }
  });
  rec.props?.floors.forEach((ps, i) => { if (ps) ps.group.visible = k >= 0 && (i === k || i === k - 1); });
  rec.floorK = k;
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
