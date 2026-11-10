// ============================================================================
//  BẢN SẮC PHỐ — dựng 3D (đi cùng citylook.js):
//   · 16 cổng chào phường (lib_paifang) trên 8 đại lộ — đầu Nội phường (u 174) + đầu Ngoại phường
//     (u 300), biển tên phường hai bên;
//   · biển hiệu khắc tên trước mỗi cửa hàng; biển «BÁN» đỏ / biển tên chủ nhà trước nhà rao bán
//     (setEstateOwner đổi chữ khi máy chủ báo có người mua / bán);
//   · đồ bày phố theo hành của cung ở góc ngã tư (Ly đèn lồng, Chấn / Càn cột cờ phướn, Tốn giàn
//     thảo dược, Khôn bao lúa, Đoài đèn đá, Cấn bia đá, Khảm chum nước);
//   · kênh nước Khảm dọc ngõ v = +86 (bờ đá, cầu đá ở mỗi vành phố cắt ngang).
// ============================================================================
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as T from './terrain.js';
import * as BQ from './batquai.js';
import * as CB from './cityblocks.js';
import * as CN from './canals.js';
import { place, nameBoard, mats } from './batquai3d.js';
import { addSolidCircle, addSolidOBB, addSolidSegment } from './obstacles.js';
import { addLight, glowAll } from './lights.js';
import { cityShops } from './shops.js';
import { listings, TIERS } from './estate.js';
import { WARDS } from './citylook.js';
import { stoneMaterial } from './ground-tex.js';

const H = (x, z) => T.heightAt(x, z);
const corridor = (x, z, ry, hw) => (px, pz) => Math.abs(Math.cos(ry) * (px - x) - Math.sin(ry) * (pz - z)) > hw;

// --- 16 cổng chào phường
export async function wardGates(grp) {
  for (const g of BQ.GUA) {
    const ry = BQ.faceAxis(g, true);
    const canal = CN.AVE_CANAL.gua.includes(g.id);
    for (const [k, u] of [[0, CB.RINGS[0].a + 5], [1, 300]]) {
      // đại lộ có kênh giữa: hai cổng chào trên hai đường bờ (v ±15, rộng 9) — không dựng cổng trên mặt nước
      for (const sv of canal ? [-15, 15] : [0]) {
        const p = BQ.toWorld(g, u, sv), wd = canal ? 9 : CB.GRAND_W + 1;
        await place(grp, 'lib_paifang', { fit: { width: wd }, at: { x: p.x, y: H(p.x, p.z), z: p.z, ry }, keep: corridor(p.x, p.z, ry, wd / 2 - 1.7) });
      }
      const sgn = BQ.toWorld(g, u - 2.2, canal ? -(CN.AVE_HALF_CANAL - 0.6) : -(CB.GRAND_W / 2 - 0.6)), b = nameBoard(WARDS[g.id][k], BQ.faceAxis(g, false));
      b.position.set(sgn.x, H(sgn.x, sgn.z), sgn.z); grp.add(b); addSolidCircle(sgn.x, sgn.z, 0.3);
    }
  }
}

// --- nền lát riêng từng cung (thay pavedBlocks một màu)
const PAVE = { li: ['#9a8476', 23], kun: ['#9c9070', 31], dui: ['#a8a49a', 41], qian: ['#8f9096', 53], kan: ['#7f8a90', 61], gen: ['#8a8072', 71], zhen: ['#86907a', 83], xun: ['#8e967e', 97] };
export function wardPaving(grp) {
  const C = CB.generateCity(), by = new Map();
  for (const b of C.blocks) { const id = b.g.id || b.g; (by.get(id) || by.set(id, []).get(id)).push(b); }
  for (const [gid, blocks] of by) {
    const g = BQ.guaById(gid), pos = [], uv = [], idx = [];
    for (const b of blocks) {
      const cs = [[b.u0, b.v0], [b.u1, b.v0], [b.u1, b.v1], [b.u0, b.v1]].map(([u, v]) => BQ.toWorld(g, u, v));
      const k = pos.length / 3;
      for (const c of cs) { pos.push(c.x, H(c.x, c.z) + 0.035, c.z); uv.push(c.x / 6, c.z / 6); }
      const cross = (cs[1].x - cs[0].x) * (cs[2].z - cs[0].z) - (cs[1].z - cs[0].z) * (cs[2].x - cs[0].x);
      if (cross < 0) idx.push(k, k + 1, k + 2, k, k + 2, k + 3); else idx.push(k, k + 2, k + 1, k, k + 3, k + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    const [base, seed] = PAVE[gid] || ['#958d80', 23];
    const mat = stoneMaterial({ seed, rows: gid === 'kun' || gid === 'gen' ? 6 : 9, repeat: [1, 1], base, roughness: 0.93 });
    mat.polygonOffset = true; mat.polygonOffsetFactor = -1;
    const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; grp.add(m);
  }
}

// --- biển hiệu
function signTex(text, { bg = '#33210f', fg = '#f3df9a', border = '#d9a441' } = {}) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160;
  const draw = (t, o = {}) => {
    const c = cv.getContext('2d'), B = o.bg || bg, F = o.fg || fg, R = o.border || border;
    c.fillStyle = B; c.fillRect(0, 0, 512, 160); c.strokeStyle = R; c.lineWidth = 10; c.strokeRect(8, 8, 496, 144);
    c.fillStyle = F; c.textAlign = 'center'; c.textBaseline = 'middle';
    let s = Math.min(70, Math.floor(3600 / Math.max(1, t.length))); c.font = `bold ${s}px serif`;
    while (c.measureText(t).width > 470 && s > 20) { s -= 2; c.font = `bold ${s}px serif`; }
    c.fillText(t, 256, 84);
  };
  draw(text);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return { tex, redraw(t, o) { draw(t, o); tex.needsUpdate = true; } };
}
function hangSign(grp, x, z, ry, s) {
  const M = mats(), g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.6, 8), M.wood); post.position.y = 1.3; post.castShadow = true;
  const card = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.69), new THREE.MeshStandardMaterial({ map: s.tex, roughness: 0.6, side: THREE.DoubleSide })); card.position.y = 2.25; card.castShadow = true;
  g.add(post, card); g.rotation.y = ry; g.position.set(x, H(x, z), z); grp.add(g);
  addSolidCircle(x, z, 0.3);
  return g;
}
// điểm cạnh cửa: lệch dọc mặt tiền (along) + ra phố (out)
const besideDoor = (h, along, out) => { const fx = Math.sin(h.ry), fz = Math.cos(h.ry), ax = Math.cos(h.ry), az = -Math.sin(h.ry); return { x: h.door.x + ax * along + fx * out, z: h.door.z + az * along + fz * out }; };

export function shopSigns(grp) {
  for (const s of cityShops()) {
    const h = s.house; if (!h?.door) continue;
    const p = besideDoor(h, Math.min((s.fit || h.f) / 2 - 0.6, 3.4), 0.7);
    hangSign(grp, p.x, p.z, h.ry, signTex(s.name));
  }
}

const ESTATE = new Map(); // h → { s, tier, name }
let lookup = () => null; // h → { name, mine } | null (main.js qua render3d › setEstateLookup)
export function setEstateLookup(fn) { lookup = fn; for (const h of ESTATE.keys()) { const o = lookup(h); setEstateOwner(h, o?.name || null, !!o?.mine); } }
export function estateSigns(grp) {
  for (const l of listings()) {
    const h = l.house; if (!h?.door || l.mansion != null) continue; // biệt phủ: biển trên cổng phủ (mansion3d.js)
    const p = besideDoor(h, -Math.min(h.f / 2 - 0.6, 3.4), 0.7);
    const s = signTex(`BÁN · ${TIERS[l.tier].name}`, { bg: '#b3231a', fg: '#ffe9a8', border: '#f3d36a' });
    hangSign(grp, p.x, p.z, h.ry, s);
    ESTATE.set(l.h, { s, tier: l.tier });
    { const o = lookup(l.h); if (o?.name) setEstateOwner(l.h, o.name, !!o.mine); }
    // đèn lồng đỏ treo cạnh biển rao bán
    const lan = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 6), new THREE.MeshStandardMaterial({ color: '#c8341f', emissive: '#ff5a1e', emissiveIntensity: 0.6, roughness: 0.6 }));
    lan.scale.y = 1.25; lan.position.set(p.x, H(p.x, p.z) + 2.95, p.z); grp.add(lan); glowAll(lan, { base: 0.5, night: 2, color: '#ff7a3c' });
  }
}
/** máy chủ báo chủ nhà (null = đang rao bán) → đổi chữ biển trước nhà */
export function setEstateOwner(h, name, mine = false) {
  const e = ESTATE.get(h); if (!e) return;
  if (!name) e.s.redraw(`BÁN · ${TIERS[e.tier].name}`, { bg: '#b3231a', fg: '#ffe9a8', border: '#f3d36a' });
  else e.s.redraw(`${mine ? '🏡 ' : ''}Nhà ${name}`, mine ? { bg: '#6a4a10', fg: '#ffe08a', border: '#ffd27a' } : {});
}

// --- đồ bày phố ở góc ngã tư (theo hành cung)
function propKind(gid) { return { li: 'lantern', zhen: 'flag', qian: 'flag', xun: 'herb', kun: 'sack', dui: 'stonelamp', gen: 'stele', kan: 'jar' }[gid]; }
const FLAG = { zhen: '#3f7a3a', qian: '#e8e4dc' };
export function streetProps(grp) {
  const pts = {};
  for (const g of BQ.GUA) {
    const lanes = [...CB.LANES_V.flatMap((v) => [v, -v])];
    for (const ring of CB.RINGS) {
      if (ring.a < 190 || ring.a > 400) continue;
      for (const vl of lanes) {
        const half = CB.wedge(ring.a) - 6; if (Math.abs(vl) > half) continue;
        const su = (ring.a * 7 + vl) % 2 ? 1 : -1, sv = vl > 0 ? 1 : -1;
        const u = ring.a + su * (ring.w / 2 - 0.55), v = vl + sv * (CB.LANE_W / 2 - 0.55);
        const w = BQ.toWorld(g, u, v);
        (pts[g.id] ||= []).push({ x: w.x, z: w.z, ry: Math.atan2(g.dir[0], g.dir[1]) + (ring.a % 3) });
      }
    }
  }
  const M = mats(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), P = new THREE.Vector3();
  const inst = (geo, mat, list, shadow = true) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((p, i) => im.setMatrixAt(i, m4.compose(P.set(p.x, H(p.x, p.z), p.z), q.setFromAxisAngle(up, p.ry), one)));
    im.castShadow = shadow; im.receiveShadow = true; im.computeBoundingSphere(); grp.add(im); return im;
  };
  // gộp khối thủ tục: đưa hết về không chỉ mục (Box có index, Dodecahedron không) để mergeGeometries chịu
  const merge = (parts) => mergeGeometries(parts.map(([geo, x, y, z, sx = 1, sy = 1, sz = 1]) => { geo.scale(sx, sy, sz); geo.translate(x, y, z); const n = geo.index ? geo.toNonIndexed() : geo; if (n !== geo) geo.dispose(); return n; }), false);
  for (const [gid, list] of Object.entries(pts)) {
    const kind = propKind(gid);
    for (const p of list) addSolidCircle(p.x, p.z, kind === 'flag' || kind === 'lantern' ? 0.3 : 0.55);
    if (kind === 'lantern') {
      inst(merge([[new THREE.CylinderGeometry(0.08, 0.1, 3, 6), 0, 1.5, 0], [new THREE.BoxGeometry(0.7, 0.06, 0.06), 0.3, 2.9, 0]]), M.wood, list);
      const lan = inst(merge([[new THREE.SphereGeometry(0.28, 10, 6), 0.55, 2.55, 0, 1, 1.25, 1]]), new THREE.MeshStandardMaterial({ color: '#c8341f', emissive: '#ff6a2a', emissiveIntensity: 0.6, roughness: 0.6 }), list, false);
      glowAll(lan, { base: 0.5, night: 2.2, color: '#ff8a3c' });
      list.forEach((p, i) => { if (i % 3 === 0) addLight(p.x + Math.cos(p.ry) * 0.55, H(p.x, p.z) + 2.8, p.z - Math.sin(p.ry) * 0.55, { color: '#ffa04a', power: 0.8 }); });
    } else if (kind === 'flag') {
      inst(merge([[new THREE.CylinderGeometry(0.06, 0.08, 5, 6), 0, 2.5, 0]]), M.wood, list);
      inst(merge([[new THREE.PlaneGeometry(0.9, 2.2), 0.5, 3.6, 0]]), new THREE.MeshStandardMaterial({ color: FLAG[gid], roughness: 0.9, side: THREE.DoubleSide }), list, false);
    } else if (kind === 'herb') {
      inst(merge([[new THREE.BoxGeometry(1.4, 0.06, 0.6), 0, 0.7, 0], [new THREE.BoxGeometry(1.4, 0.06, 0.6), 0, 1.25, 0], [new THREE.BoxGeometry(0.06, 1.4, 0.06), -0.68, 0.7, 0.27], [new THREE.BoxGeometry(0.06, 1.4, 0.06), 0.68, 0.7, -0.27], [new THREE.BoxGeometry(0.06, 1.4, 0.06), -0.68, 0.7, -0.27], [new THREE.BoxGeometry(0.06, 1.4, 0.06), 0.68, 0.7, 0.27]]), M.wood, list);
      inst(merge([[new THREE.BoxGeometry(1.2, 0.12, 0.5), 0, 0.79, 0], [new THREE.BoxGeometry(1.2, 0.12, 0.5), 0, 1.34, 0]]), new THREE.MeshStandardMaterial({ color: '#6a8a3a', roughness: 0.95 }), list, false);
    } else if (kind === 'sack') {
      inst(merge([[new THREE.CylinderGeometry(0.3, 0.34, 0.7, 8), -0.32, 0.35, 0], [new THREE.CylinderGeometry(0.3, 0.34, 0.7, 8), 0.32, 0.35, 0.05], [new THREE.CylinderGeometry(0.28, 0.32, 0.65, 8), 0, 0.98, 0, 1, 1, 1]]), new THREE.MeshStandardMaterial({ color: '#c9b07a', roughness: 0.98 }), list);
    } else if (kind === 'stonelamp') {
      inst(merge([[new THREE.BoxGeometry(0.6, 0.2, 0.6), 0, 0.1, 0], [new THREE.CylinderGeometry(0.12, 0.15, 0.9, 6), 0, 0.65, 0], [new THREE.BoxGeometry(0.55, 0.4, 0.55), 0, 1.3, 0], [new THREE.ConeGeometry(0.5, 0.35, 4), 0, 1.68, 0]]), M.stone, list);
    } else if (kind === 'stele') {
      inst(merge([[new THREE.BoxGeometry(0.9, 0.3, 0.5), 0, 0.15, 0], [new THREE.BoxGeometry(0.7, 1.6, 0.22), 0, 1.1, 0], [new THREE.DodecahedronGeometry(0.35), 0.75, 0.25, 0.3, 1, 0.7, 1]]), M.stone, list);
    } else if (kind === 'jar') {
      inst(merge([[new THREE.CylinderGeometry(0.34, 0.42, 0.8, 10), 0, 0.4, 0], [new THREE.CylinderGeometry(0.28, 0.28, 0.6, 10), 0.7, 0.3, 0.1]]), new THREE.MeshStandardMaterial({ color: '#3e5a6a', roughness: 0.4 }), list);
    }
  }
}

// --- kênh nước Khảm: dọc ngõ v = +86 giữa các vành phố, cầu đá ở chỗ vành phố cắt ngang
export function kanCanal(grp) {
  const g = BQ.guaById('kan'), v = CB.LANES_V[1], ry = Math.atan2(-g.dir[1], g.dir[0]);
  const water = new THREE.MeshStandardMaterial({ color: '#2f5e63', roughness: 0.06, metalness: 0.35, transparent: true, opacity: 0.9 });
  const M = mats(), rings = CB.RINGS.filter((r) => r.a >= 168 && r.a <= 410);
  for (let k = 0; k + 1 < rings.length; k++) {
    const u0 = rings[k].a + rings[k].w / 2, u1 = rings[k + 1].a - rings[k + 1].w / 2, len = u1 - u0;
    if (len < 6 || Math.abs(v) > CB.wedge(u0) - 4) continue;
    const c = BQ.toWorld(g, (u0 + u1) / 2, v), y = H(c.x, c.z);
    const lg = new THREE.Group(); lg.position.set(c.x, y, c.z); lg.rotation.y = ry; grp.add(lg);
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(len, 2.6), water); wm.rotation.x = -Math.PI / 2; wm.position.y = 0.06; wm.receiveShadow = true; lg.add(wm);
    for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.BoxGeometry(len, 0.35, 0.3), M.stone); e.position.set(0, 0.17, s * 1.45); e.receiveShadow = true; e.castShadow = true; lg.add(e); }
    addSolidOBB(c.x, c.z, len / 2, 1.5, ry);
    // cầu đá vồng nhỏ ở đầu đoạn (chỗ vành phố cắt ngang) — đi qua được (không chặn)
    const b = BQ.toWorld(g, u0 - rings[k].w / 2, v), bg = new THREE.Group(); bg.position.set(b.x, H(b.x, b.z), b.z); bg.rotation.y = ry; grp.add(bg);
    for (const s of [-1, 1]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.55, 3.4), M.stone); rail.position.set(s * (rings[k].w / 2 - 0.2), 0.28, 0); rail.castShadow = true; bg.add(rail); }
  }
  void addSolidSegment;
}

/** Toàn bộ lớp bản sắc phố (landmarks.js gọi sau cityHouses) */
export async function cityIdentity(grp) {
  // mỗi phần độc lập: một phần lỗi không chặn phần sau
  for (const [name, fn] of [['paving', wardPaving], ['shopSigns', shopSigns], ['estateSigns', estateSigns], ['props', streetProps], ['canal', kanCanal], ['gates', wardGates]]) {
    try { await fn(grp); } catch (e) { console.warn('[cityIdentity]', name, e); }
  }
}
