// ============================================================================
//  PHÁ HỦY CÔNG TRÌNH NGOÀI THÀNH — sổ công trình phá được (từ collide.js), máu, sập (ẩn hình + gỡ va chạm +
//  mảnh vỡ bụi), đồng bộ shard (net.raze / gói razed), tự dựng lại sau law.RESPAWN_MS.
//  Trong tường thành: hộ thành đại trận — không công trình nào vào sổ. Công trình có cửa trạm (điện tông môn,
//  sảnh nghề…) cũng không phá được (obstacles.reservedWithin). Định tội: law.js (main.js gọi khi sập).
// ============================================================================
import * as THREE from 'three';
import { onFootprint, razeFootprint, restoreFootprint } from './collide.js';
import { reservedWithin } from './obstacles.js';
import { cityOctDist, ROOM_X0 } from './terrain.js';
import { hpOf, structId, RESPAWN_MS } from './law.js';
import { RAZE_OUTSIDE } from './protocol.js';

const byId = new Map();          // id → rec
const pendingRazed = new Map();  // id → razedAt (gói máy chủ tới trước khi công trình nạp)
let scene = null;
const fx = [];

export function initRaze(sc) {
  scene = sc;
  onFootprint((rec) => {
    if (rec.inst || rec.destructible === false) return;
    const side = Math.max(rec.w, rec.d);
    if (side < 0.8 || side > 70 || rec.h < 0.8) return;
    if (cityOctDist(rec.x, rec.z) < RAZE_OUTSIDE || rec.x > ROOM_X0 - 40) return;
    if (reservedWithin(rec.x - rec.w / 2, rec.z - rec.d / 2, rec.x + rec.w / 2, rec.z + rec.d / 2)) return;
    rec.id = structId(rec.x, rec.z); rec.hpMax = hpOf(rec); rec.hp = rec.hpMax; rec.destructible = true;
    byId.set(rec.id, rec);
    if (pendingRazed.has(rec.id)) { const at = pendingRazed.get(rec.id); pendingRazed.delete(rec.id); collapse(rec, at, false); }
  });
}

/** công trình phá được gần nhất trong tầm tay (mét thế giới, cao độ chân y) — null nếu không có */
export function targetNear(x, z, y = 0, reach = 2.2) {
  let best = null, bd = Infinity;
  for (const r of byId.values()) {
    if (r.razed) continue;
    const dx = Math.max(0, Math.abs(x - r.x) - r.w / 2), dz = Math.max(0, Math.abs(z - r.z) - r.d / 2), d = Math.hypot(dx, dz);
    if (d > reach || d >= bd) continue;
    if (y > r.base + r.h + 1 || y < r.base - 3) continue; // phải ngang tầm với công trình
    best = r; bd = d;
  }
  return best;
}

/** đánh một đòn: trả { rec, hp, razed } */
export function strike(rec, dmg, now = Date.now()) {
  if (!rec || rec.razed) return null;
  if (now - (rec.hitAt || 0) > 30000) rec.hp = rec.hpMax; // bỏ dở quá 30 s: công trình «lành» lại
  rec.hitAt = now;
  rec.hp = Math.max(0, rec.hp - dmg);
  shake(rec);
  if (rec.hp > 0) return { rec, hp: rec.hp, razed: false };
  collapse(rec, now, true);
  return { rec, hp: 0, razed: true };
}

function collapse(rec, at, withFx) {
  if (rec.razed) return;
  rec.razedAt = at;
  razeFootprint(rec);
  if (rec.obj) rec.obj.visible = false;
  if (withFx && scene) debris(rec);
}

/** gói máy chủ: [[id, tuổi ms]] — công trình người khác đã phá */
export function applyRazed(list, now = Date.now()) {
  for (const [id, age] of list || []) {
    const at = now - (age || 0); if (now - at >= RESPAWN_MS) continue;
    const r = byId.get(id);
    if (r) collapse(r, at, age < 2000); else pendingRazed.set(id, at);
  }
}

/** mỗi khung: mảnh vỡ; mỗi giây: dựng lại công trình đủ hạn (không dựng đè lên người chơi) */
let lastSweep = 0;
export function tickRaze(dt, px, pz, now = Date.now()) {
  for (let i = fx.length - 1; i >= 0; i--) if (fx[i](dt)) fx.splice(i, 1);
  if (now - lastSweep < 1000) return; lastSweep = now;
  for (const r of byId.values()) {
    if (!r.razed || now - r.razedAt < RESPAWN_MS) continue;
    if (Math.abs(px - r.x) < r.w / 2 + 1.5 && Math.abs(pz - r.z) < r.d / 2 + 1.5) continue;
    restoreFootprint(r); r.hp = r.hpMax; if (r.obj) r.obj.visible = true;
  }
}
export const razedCount = () => [...byId.values()].filter((r) => r.razed).length;
export const destructibleCount = () => byId.size;

// --- hiệu ứng: rung khi trúng đòn, sập thành mảnh vỡ + bụi
function shake(rec) {
  const o = rec.obj; if (!o || !scene) return;
  const p0 = o.position.clone(); let t = 0;
  fx.push((dt) => { t += dt; const k = Math.max(0, 1 - t / 0.25); o.position.set(p0.x + (Math.random() - 0.5) * 0.12 * k, p0.y, p0.z + (Math.random() - 0.5) * 0.12 * k); if (k <= 0) { o.position.copy(p0); return true; } return false; });
}
const BOX = new THREE.BoxGeometry(1, 1, 1);
const MATS = ['#7a6a55', '#8f8778', '#5b4a3a', '#a3442e', '#6e7470'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 }));
const DUST = new THREE.MeshBasicMaterial({ color: '#c8b89a', transparent: true, opacity: 0.5, depthWrite: false });
function debris(rec) {
  const g = new THREE.Group(); scene.add(g);
  const n = Math.min(40, 10 + Math.round(rec.w * rec.d / 8)), parts = [];
  for (let i = 0; i < n; i++) {
    const s = 0.3 + Math.random() * Math.min(1.6, rec.w / 4);
    const m = new THREE.Mesh(BOX, MATS[i % MATS.length]); m.scale.set(s, s * (0.4 + Math.random() * 0.6), s * (0.6 + Math.random() * 0.4));
    m.position.set(rec.x + (Math.random() - 0.5) * rec.w, rec.base + Math.random() * rec.h, rec.z + (Math.random() - 0.5) * rec.d);
    m.castShadow = true; g.add(m);
    parts.push({ m, vx: (Math.random() - 0.5) * 6, vy: Math.random() * 5, vz: (Math.random() - 0.5) * 6, rx: Math.random() * 6, ry: Math.random() * 6 });
  }
  const dust = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), DUST.clone());
  dust.position.set(rec.x, rec.base + 1, rec.z); g.add(dust);
  let t = 0; const R = Math.max(rec.w, rec.d) * 0.7 + 2;
  fx.push((dt) => {
    t += dt;
    for (const p of parts) {
      if (p.m.position.y > rec.base + p.m.scale.y / 2) { p.vy -= 20 * dt; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; p.m.rotation.x += p.rx * dt; p.m.rotation.y += p.ry * dt; }
      else { p.m.position.y = rec.base + p.m.scale.y / 2; p.vx *= 0.8; p.vz *= 0.8; }
    }
    const k = Math.min(1, t / 1.2); dust.scale.setScalar(1 + R * k); dust.material.opacity = 0.5 * (1 - k);
    if (t > 14) { scene.remove(g); dust.geometry.dispose(); dust.material.dispose(); return true; } // đống đổ nát nằm lại 14 s
    if (t > 11) for (const p of parts) p.m.position.y -= dt * 0.6; // lún dần xuống đất
    return false;
  });
}
