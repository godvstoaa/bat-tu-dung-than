// ============================================================================
//  TƯỜNG THÀNH + LẦU CỔNG + GIÁC LÂU (docs/CONG-TRINH-LAM-LAI-MANIFEST.md §3.1, đợt 2) — thay tường hộp đá phẳng,
//  tháp góc «trụ + nón + quả cầu» và cổng Meshy city_gate (40–64 m, ~31–49 m cao, mờ) của Nội Thành.
//  Nguyên mẫu: tường thành Tây An (cao 12 m, chân đá, thân gạch xanh, mặt ngoài răng cưa 垛口, mặt trong tường nữ 女墙)
//  + lầu cổng 城楼 trên đài cổng 墩台 có vòm cuốn; giác lâu 角楼 hai tầng mái yết sơn trên mã diện góc.
//  Mọi lưới dựng ở khung cục bộ trục thẳng → UV theo mét (mats.boxUV) TRƯỚC khi xoay → gạch không bị kéo ở cạnh chéo 45°.
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB } from '../tienphu/arch/kit.js';
import { cnLou, cnHall, cnMats } from '../tienphu/arch/cn.js';
import { archMats, boxUV, SPAN, retex, consolidate } from './mats.js';

const KEY_SPAN = { brick: SPAN.brick, brickDark: SPAN.brick, stone: SPAN.stone, floor: SPAN.stone, plasterRed: SPAN.plaster, tileGray: SPAN.tile, marble: SPAN.marble };
/** thêm lưới cục bộ đã UV theo mét rồi biến đổi M (xoay + dời) */
function addLocal(acc, key, geo, M) {
  const g = boxUV(geo.index ? geo.toNonIndexed() : geo, { roof: /^tile/.test(key), span: KEY_SPAN[key] || 1 });
  if (M) g.applyMatrix4(M);
  acc.add(key, g);
}
const frame = (x, y, z, ry) => new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);

/**
 * Một đoạn tường dài L (trục x cục bộ, mặt ngoài +z), cao H, dày T; đặt tại (x, y, z) xoay ry.
 * Chân đá 1,6 m · thân gạch · gờ đá · lối đi lát · mặt ngoài răng cưa (răng 1,5 × 1,7, khe 0,6) · mặt trong tường nữ 1,0 m.
 */
export function wallSegment(acc, L, { H = 14, T = 5, x = 0, y = 0, z = 0, ry = 0, merlons = true } = {}) {
  const M = frame(x, y, z, ry);
  const yTop = H - 1;                                               // mặt lối đi (gốc tường lún 1 m vào đất như mã cũ)
  addLocal(acc, 'stone', boxB(L, 1.6, T + 0.5, 0, -1, 0), M);
  addLocal(acc, 'brick', boxB(L, yTop - 0.35 - 0.6, T, 0, 0.6, 0), M);
  addLocal(acc, 'stone', boxB(L, 0.35, T + 0.3, 0, yTop - 0.35, 0), M);
  addLocal(acc, 'floor', boxB(L, 0.06, T - 0.6, 0, yTop, 0), M);
  if (merlons) {
    addLocal(acc, 'brickDark', boxB(L, 0.9, 0.55, 0, yTop, T / 2 - 0.28), M);       // chân tường răng cưa
    const n = Math.max(1, Math.floor(L / 2.1)), step = L / n;
    for (let i = 0; i < n; i++) addLocal(acc, 'brickDark', boxB(step - 0.62, 0.85, 0.55, -L / 2 + step * (i + 0.5), yTop + 0.9, T / 2 - 0.28), M);
    addLocal(acc, 'brickDark', boxB(L, 1.0, 0.45, 0, yTop, -T / 2 + 0.23), M);      // tường nữ mặt trong
  }
}

/** đài cổng: khối gạch W × D cao H có n vòm cuốn (rộng w, cao h) xuyên dọc z; mặt ngoài +z */
function gateBase(acc, W, D, H, arches) {
  const pts = [[-W / 2, 0]];
  for (const a of [...arches].sort((p, q) => p.cx - q.cx)) {
    const r = a.w / 2, yS = a.h - r; pts.push([a.cx - r, 0], [a.cx - r, yS]);
    for (let i = 1; i < 16; i++) { const t = Math.PI - (Math.PI * i) / 16; pts.push([a.cx + Math.cos(t) * r, yS + Math.sin(t) * r]); }
    pts.push([a.cx + r, yS], [a.cx + r, 0]);
  }
  pts.push([W / 2, 0], [W / 2, H], [-W / 2, H]);
  const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false, curveSegments: 1 }); g.translate(0, -1, -D / 2);
  addLocal(acc, 'brick', g);
  addLocal(acc, 'stone', boxB(W + 0.6, 1.6, D + 0.6, 0, -1, 0));
  for (const a of arches) for (const sz of [1, -1]) {                // viền vòm đá
    const r = a.w / 2, yS = a.h - r, ring = [];
    for (let i = 0; i <= 16; i++) { const t = Math.PI - (Math.PI * i) / 16; ring.push([a.cx + Math.cos(t) * (r + 0.55), yS + Math.sin(t) * (r + 0.55)]); }
    for (let i = 16; i >= 0; i--) { const t = Math.PI - (Math.PI * i) / 16; ring.push([a.cx + Math.cos(t) * r, yS + Math.sin(t) * r]); }
    const s2 = new THREE.Shape(ring.map(([x, y]) => new THREE.Vector2(x, y)));
    const rg = new THREE.ExtrudeGeometry(s2, { depth: 0.25, bevelEnabled: false, curveSegments: 1 }); rg.translate(0, -1, sz > 0 ? D / 2 - 0.05 : -D / 2 - 0.2);
    addLocal(acc, 'stone', rg);
  }
  // gờ + răng cưa quanh mặt đài
  addLocal(acc, 'stone', boxB(W + 0.3, 0.35, D + 0.3, 0, H - 1.35, 0));
  for (const [L, x, z, ry] of [[W, 0, D / 2, 0], [W, 0, -D / 2, Math.PI], [D, W / 2, 0, Math.PI / 2], [D, -W / 2, 0, -Math.PI / 2]]) {
    const n = Math.max(1, Math.floor(L / 2.1)), step = L / n, M = frame(x, 0, z, ry);
    for (let i = 0; i < n; i++) addLocal(acc, 'brickDark', boxB(step - 0.62, 0.85, 0.5, -L / 2 + step * (i + 0.5), H - 1 + 0.9, -0.25), M);
    addLocal(acc, 'brickDark', boxB(L, 0.9, 0.5, 0, H - 1, -0.25), M);
  }
}

/** lầu 2 tầng (cnLou) đặt trên cao y — dịch các lưới của acc con lên y */
function louOn(acc, spec, y, ry = 0) {
  const r = cnLou(spec);
  for (const [k, list] of r.acc.parts) for (const g of list) { if (ry) g.rotateY(ry); acc.add(k, g.translate(0, y, 0)); }
  return r.info;
}

/**
 * Lầu cổng thành: đài cổng W × D cao H (đáy lún 1 m như tường) + lầu 2 tầng mái yết sơn ngói xám.
 * big: cổng chính (3 vòm, lầu 7 gian) · thường: 1 vòm, lầu 5 gian. Trả { group, info }.
 */
export function cityGateTower({ W = 40, D = 14, H = 14, big = false, tile = 'Gray' } = {}) {
  const acc = new Acc();
  const arches = big ? [{ cx: 0, w: 7, h: 9.5 }, { cx: -W * 0.27, w: 5, h: 7.5 }, { cx: W * 0.27, w: 5, h: 7.5 }] : [{ cx: 0, w: Math.min(7, W * 0.22), h: 9 }];
  gateBase(acc, W, D, H, arches);
  const nb = big ? 7 : W >= 36 ? 5 : 3, mid = big ? 6.4 : Math.min(5.6, W * 0.16), step = big ? 0.55 : 0.5;
  const bays = []; for (let i = -(nb - 1) / 2; i <= (nb - 1) / 2; i++) bays.push(+(mid - Math.abs(i) * step).toFixed(2));
  const Wl = bays.reduce((a, b) => a + b, 0);
  const k = Math.min(1, (W * 0.78) / Wl); const bb = bays.map((b) => +(b * k).toFixed(2));
  const info = louOn(acc, { bays: bb, D: Math.min(D - 4.5, 10), corr: 1.6, h1: 5.0, h2: 4.2, colH: 4.2, plinth: 0.7, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile, ridgeH: 0.9, lift: 0.55, beasts: 5 } }, H - 1, Math.PI); // mặt cửa bức bàn quay VÀO thành, mặt gạch quay ra ngoài (như tiễn lâu)
  const group = consolidate(retex(acc.build({ ...cnMats(), ...archMats() }, 'citygate')));
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, info: { W, D, H: H - 1 + info.top, gap: arches[0].w } };
}

/** giác lâu trên mã diện góc: bệ gạch S × S cao H + lầu 2 tầng 3 × 3 gian */
export function cornerTower({ S = 16, H = 14, tile = 'Gray' } = {}) {
  const acc = new Acc();
  addLocal(acc, 'stone', boxB(S + 0.6, 1.6, S + 0.6, 0, -1, 0));
  addLocal(acc, 'brick', boxB(S, H - 1.95, S, 0, 0.6, 0));
  addLocal(acc, 'stone', boxB(S + 0.3, 0.35, S + 0.3, 0, H - 1.35, 0));
  for (let q = 0; q < 4; q++) {
    const ry = (q * Math.PI) / 2, M = new THREE.Matrix4().makeRotationY(ry);
    const n = Math.floor(S / 2.1), step = S / n;
    for (let i = 0; i < n; i++) addLocal(acc, 'brickDark', boxB(step - 0.62, 0.85, 0.5, -S / 2 + step * (i + 0.5), H - 1 + 0.9, S / 2 - 0.25), M);
    addLocal(acc, 'brickDark', boxB(S, 0.9, 0.5, 0, H - 1, S / 2 - 0.25), M);
  }
  const info = louOn(acc, { bays: [3.0, 3.8, 3.0], D: 8.6, corr: 1.2, h1: 4.4, h2: 3.8, colH: 3.8, plinth: 0.6, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile, ridgeH: 0.8, lift: 0.6, beasts: 3 } }, H - 1);
  const group = consolidate(retex(acc.build({ ...cnMats(), ...archMats() }, 'cornertower')));
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, info: { S, H: H - 1 + info.top } };
}

/** gom các đoạn tường [{ L, x, y, z, ry }] thành một nhóm */
export function buildCityWall(segs, opts = {}) {
  const acc = new Acc();
  for (const s of segs) wallSegment(acc, s.L, { ...opts, ...s });
  const group = consolidate(acc.build(archMats(), 'citywall'));
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return group;
}

// ============================================================================
//  NGOẠI THÀNH (tường 34 m, docs/CONG-TRINH-LAM-LAI-MANIFEST.md đợt Ngoại Thành): lầu cổng lớn, lầu canh mã diện, giác lâu —
//  hai cấp chi tiết (THREE.LOD): gần đủ cấu kiện · xa bỏ gân ngói + đấu củng · rất xa ẩn (sương che).
// ============================================================================
function lodOf(acc, name, far = 320, hide = 2200) {
  const mats = { ...cnMats(), ...archMats() };
  const lite = new Acc();
  for (const [k, l] of acc.parts) if (!/^(rib|dougong)/.test(k)) for (const g of l) lite.add(k, g.clone());
  const near = consolidate(retex(acc.build(mats, name)));
  const low = consolidate(retex(lite.build(mats, `${name}:far`)));
  near.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  low.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
  const lod = new THREE.LOD(); lod.name = name;
  lod.addLevel(near, 0); lod.addLevel(low, far); lod.addLevel(new THREE.Object3D(), hide);
  return lod;
}
/** lầu cổng Ngoại Thành: đài cổng W × D cao tới mặt tường (H − 1) có 3 vòm (giữa w 14 — lối xe), lầu 2 tầng 9 gian (62 m) đấu củng */
export function outerGateTower({ W = 81, D = 18, H = 33.5, tile = 'Gray' } = {}) {
  const acc = new Acc();
  const arches = [{ cx: 0, w: 14, h: 16 }, { cx: -W * 0.27, w: 9, h: 11 }, { cx: W * 0.27, w: 9, h: 11 }];
  gateBase(acc, W, D, H, arches);
  const info = louOn(acc, { bays: [6.0, 6.5, 7.0, 7.5, 8.0, 7.5, 7.0, 6.5, 6.0], D: Math.min(D - 5, 13), corr: 2.4, h1: 7.2, h2: 6.0, colH: 6.0, colD: 0.8, plinth: 1.2, dagong: 0.11, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile, ridgeH: 1.2, lift: 0.7, beasts: 7 } }, H - 1, Math.PI);
  const lod = lodOf(acc, 'outergate', 450, 2600);
  return { group: lod, info: { W, D, H: H - 1 + info.top, gap: arches[0].w } };
}
/** lầu canh trên mã diện (1 tầng 3 gian yết sơn) — mặt tiền +x (ra ngoài thành) */
export function watchHouse({ tile = 'Gray' } = {}) {
  const acc = new Acc();
  const r = cnHall({ bays: [2.8, 3.4, 2.8], D: 6, corr: 1.2, colH: 3.6, plinth: 0.5, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile, ridgeH: 0.6, lift: 0.5, beasts: 3 } });
  for (const [k, l] of r.acc.parts) for (const g of l) acc.add(k, g.rotateY(Math.PI / 2));
  return { group: lodOf(acc, 'watchhouse', 260, 1600), info: r.info };
}
/** lầu trên giác đài bát giác (2 tầng 3 × 3 gian) — đặt lên mặt đài */
export function cornerLou({ tile = 'Gray' } = {}) {
  const acc = new Acc();
  const info = louOn(acc, { bays: [4.6, 5.6, 4.6], D: 12, corr: 1.6, h1: 5.4, h2: 4.6, colH: 4.6, plinth: 0.8, dagong: 0.08, frontDoors: 'all', backDoors: true, roof: { type: 'xieshan', tile, ridgeH: 1.0, lift: 0.7, beasts: 5 } }, 0);
  return { group: lodOf(acc, 'cornerlou', 320, 2200), info };
}

/**
 * Nhiều bản của một công trình LOD (lodOf) rải xa nhau (lầu canh mã diện, giác lâu): bậc xa NHÂN BẢN (≈ 8 lệnh vẽ cho mọi bản),
 * bậc gần là bản sao riêng chỉ hiện trong `near` m. Chia lại khi camera đi > 15 m (gọi từ onBeforeRender của lưới nhân bản).
 * Trước: mỗi bản một LOD → đo ngoài cổng Ngoại Thành 178 lưới lầu canh.
 */
export function instancedLod(lod, mats, { near = 260, hide = 2200, name = 'inst' } = {}) {
  const root = new THREE.Group(); root.name = name;
  const nearTpl = lod.levels[0].object, farTpl = lod.levels[1].object;
  const P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3();
  const pos = mats.map((m) => new THREE.Vector3().setFromMatrixPosition(m));
  const nears = mats.map((m) => { const o = nearTpl.clone(); m.decompose(P, Q, S); o.position.copy(P); o.quaternion.copy(Q); o.visible = false; root.add(o); return o; });
  const ims = [];
  farTpl.traverse((o) => { if (!o.isMesh) return; const im = new THREE.InstancedMesh(o.geometry, o.material, mats.length); im.frustumCulled = false; im.castShadow = false; im.receiveShadow = true; im.count = 0; im.name = `${name}:far`; root.add(im); ims.push(im); });
  let lx = Infinity, lz = Infinity;
  const assign = (cx, cz) => {
    if (Math.hypot(cx - lx, cz - lz) < 15) return; lx = cx; lz = cz;
    let n = 0;
    pos.forEach((p, i) => {
      const d = Math.hypot(p.x - cx, p.z - cz), isNear = d < near; nears[i].visible = isNear;
      if (!isNear && d < hide) { for (const im of ims) im.setMatrixAt(n, mats[i]); n++; }
    });
    for (const im of ims) { im.count = Math.max(1, n); im.instanceMatrix.needsUpdate = true; if (!n) im.setMatrixAt(0, new THREE.Matrix4().makeScale(0, 0, 0)); }
  };
  if (ims[0]) ims[0].onBeforeRender = (r, s, cam) => assign(cam.position.x, cam.position.z);
  assign(0, 0);
  return root;
}
