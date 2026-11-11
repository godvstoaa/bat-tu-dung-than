// ============================================================================
//  DÂN THÀNH BÁT QUÁI — NPC từng khu (batquai.js › CITIZENS): đứng việc của mình hoặc đi lại trên
//  đại lộ, quay nhìn + chào khi khách tới gần, nói câu theo vai (bark cục bộ, không qua mạng).
//  Nhân vật Meshy có xương (characters.js) — chỉ dựng khi người chơi trong 70 m, cất đi khi xa
//  85 m (tối đa ~15 nhân vật hoạt động một lúc); áo nhuộm theo hành của quẻ.
// ============================================================================
import * as THREE from 'three';
import { citizenList, toWorld, guaById } from './batquai.js';
import { createCharacter, WX_HSV } from './characters.js';
import { rng, hashSeed } from './npc.js';

const NEAR = 70, NEAR_PHO = 55, TALK = 4.5, GREET = 4.5, LABEL = 24;
let MAX_ACTIVE = 24; // tối đa nhân vật có xương cùng lúc (máy yếu: 16 — setCitizenCap); v5.1: người đi đường rải dày quanh phố có tiệm
export function setCitizenCap(n) { MAX_ACTIVE = n; }
const hsvOf = (hex) => { const c = new THREE.Color(hex), r = c.r, g = c.g, b = c.b, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d > 0) h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [h / 6, mx ? d / mx : 0, mx]; };
const angDiff = (a, b) => (((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;

// gợi ý nhiệm vụ mệnh (P5): main.js đặt hàm trả câu gợi ý cho NPC cùng hành (null = không có)
let HINT = null;
export function setHint(fn) { HINT = fn; }
export function createCitizens({ scene, layer, groundY, extra = [] }) {
  const makeNpc = (c) => {
    const g = guaById(c.gua || 'li');
    // hướng nghỉ: nhìn ra đại lộ khu (điểm cùng u trên trục) — NPC cung Khảm nhìn về giếng/lối giữa
    const l = { u: c.x * g.dir[0] + c.z * g.dir[1] };
    const look = c.world ? { x: 0, z: -71 } : toWorld(g, l.u, 0);
    const rest = c.face ?? (Math.hypot(look.x - c.x, look.z - c.z) > 0.5 ? Math.atan2(look.x - c.x, look.z - c.z) : 0);
    const label = document.createElement('div'); label.className = 'hq-label'; label.style.display = 'none';
    label.textContent = c.name; label.title = c.role; layer.appendChild(label);
    const bub = document.createElement('div'); bub.className = 'hq-bubble'; bub.hidden = true; layer.appendChild(bub);
    return {
      ...c, ry: rest, rest, ch: null, loading: false, active: false, label, bub,
      tint: { primary: WX_HSV[c.wx] || WX_HSV.土, accent: hsvOf(g.color) },
      seg: 0, dirn: 1, t: 0, wait: 2 + (hashSeed(c.id) % 40) / 10, moving: false,
      greeted: false, bark: null, round: 0, nextAt: 0,
      near: c.near ?? (c.indoor ? 16 : c.id.startsWith('pho_') ? NEAR_PHO : NEAR), // dân phố Ngoại Thành: dựng gần hơn · người trong nhà: chỉ khi ở trong phòng
    };
  };
  const list = [...citizenList(), ...extra].map(makeNpc);
  /** NPC trong phòng dựng lười (chủ tiệm…): thêm / bỏ khi phòng dựng / giải phóng */
  function add(c) { if (list.some((n) => n.id === c.id)) return; list.push(makeNpc({ ...c, indoor: true, world: true })); }
  function remove(id) {
    const i = list.findIndex((n) => n.id === id); if (i < 0) return;
    const n = list[i]; n.removed = true; n.active = false; if (n.ch) { scene.remove(n.ch.obj); n.ch.dispose?.(); } n.label.remove(); n.bub.remove(); list.splice(i, 1);
  }

  function spawn(n) {
    if (n.ch || n.loading) return;
    n.loading = true;
    createCharacter(n.look, { height: n.height || undefined, tint: n.tint }).then((ch) => {
      n.loading = false;
      if (!ch) return;
      if (n.removed) { ch.dispose?.(); return; }
      n.ch = ch;
      if (String(n.id).startsWith('pho')) ch.obj.traverse((o) => { if (o.isMesh) o.castShadow = false; }); // người đi đường: không đổ bóng (đông người → lượt bóng nhân đôi lệnh vẽ)
      ch.obj.position.set(n.x, groundY(n.x, n.z), n.z); ch.obj.rotation.y = n.ry;
      if (n.active) scene.add(ch.obj);
    });
  }

  const actors = [];
  /** Mỗi khung: w = vị trí người chơi (mét). Trả danh sách vòng chặn (actors) của NPC đang hiện. */
  function update(dt, t, w, nowMs, dayKey = '') {
    actors.length = 0;
    let act = 0;
    for (const n of list) if (n.active) act++;
    for (const n of list) {
      const d = Math.hypot(w.x - n.x, w.z - n.z);
      if (!n.active && d < n.near && act < MAX_ACTIVE) { n.active = true; act++; spawn(n); if (n.ch) scene.add(n.ch.obj); }
      else if (n.active && d > n.near + 15) { n.active = false; act--; if (n.ch) scene.remove(n.ch.obj); n.bark = null; }
      if (!n.active) continue;
      // đi lại: qua lại giữa các điểm lộ trình, nghỉ 3–6 s ở đầu mút; khách đứng chắn trước mặt thì dừng
      let goal = n.rest;
      if (n.path && n.path.length > 1) {
        if (n.wait > 0) { n.wait -= dt; n.moving = false; }
        else {
          const to = n.path[n.seg + n.dirn] || n.path[n.seg];
          const dx = to.x - n.x, dz = to.z - n.z, L = Math.hypot(dx, dz);
          const ahead = d < 1.4 && ((w.x - n.x) * dx + (w.z - n.z) * dz) > 0;
          if (L < 0.05) {
            n.seg += n.dirn;
            if (n.seg <= 0 || n.seg >= n.path.length - 1) { n.dirn = -n.dirn; n.wait = 3 + (hashSeed(n.id + n.round++) % 30) / 10; }
            n.moving = false;
          } else if (!ahead) {
            const step = Math.min(L, dt * 1.05);
            n.x += (dx / L) * step; n.z += (dz / L) * step; n.moving = true;
            goal = Math.atan2(dx, dz);
          } else n.moving = false;
        }
        if (!n.moving && d < GREET + 1) goal = Math.atan2(w.x - n.x, w.z - n.z);
        else if (!n.moving) goal = n.ry;
      } else if (d < GREET + 1.5) goal = Math.atan2(w.x - n.x, w.z - n.z); // quay nhìn khách
      n.ry += angDiff(n.ry, goal) * Math.min(1, dt * (n.moving ? 8 : 3));
      if (n.ch) {
        n.ch.setBase(n.moving ? 'walk' : 'idle');
        if (d < GREET && !n.greeted) { n.greeted = true; n.ch.play(n.ch.has('wave') ? 'wave' : 'bow'); }
        if (d > GREET + 2) n.greeted = false;
        n.ch.update(dt);
        if (n.pose === 'hold' && !n.moving) n.ch.hold(t);
        n.ch.obj.position.set(n.x, groundY(n.x, n.z), n.z);
        n.ch.obj.rotation.y = n.ry;
      }
      // câu nói: khách trong TALK m → thưa (v4: 30–45 s một câu) (theo ngày + lượt, không Math.random trần)
      if (d < TALK) {
        if (!n.bark && nowMs >= n.nextAt) {
          const seed = `${dayKey}|${n.id}|${n.round++}`, r = rng(hashSeed(seed));
          const hintTxt = null; // v4: bỏ chen gợi ý nhiệm vụ vào lời NPC (thông báo thừa) — HINT giữ cho nơi khác
          n.bark = { text: hintTxt || n.lines[hashSeed(seed) % n.lines.length], until: nowMs + 4200 + Math.floor(r() * 1800) };
          n.nextAt = n.bark.until + 30000 + Math.floor(r() * 15000); // v4: mỗi NPC ≤ 1 câu / 30–45 giây
        } else if (n.bark && nowMs >= n.bark.until) n.bark = null;
      } else n.bark = null;
      actors.push({ x: n.x, z: n.z, r: 0.35 });
    }
    return actors;
  }

  /** Nhãn tên + bong bóng (place/showBubble của render3d — cùng khuôn với NPC khác) */
  function ui(w, place, showBubble) {
    for (const n of list) {
      const d = Math.hypot(w.x - n.x, w.z - n.z);
      const gy = groundY(n.x, n.z), hh = (n.height || 1.72) + 0.55;
      if (n.active && n.ch && d < LABEL) place(n.label, n.x, gy + hh, n.z); else n.label.style.display = 'none';
      showBubble(n.bub, n.active && n.ch ? n.bark : null, n.x, gy + hh - 0.15, n.z);
    }
  }

  return { list, update, ui, add, remove, get activeCount() { return list.filter((n) => n.active && n.ch).length; } };
}
