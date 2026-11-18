// ============================================================================
//  DỰNG MỘT TIÊN PHỦ (three.js) theo tienphu/plan.js — chạy dần qua nhiều khung (generator):
//   tường bao + 4 cổng (9 kiểu cổng chính) · 10 sảnh (archkit-style) · đình · lầu chính 10 tầng (tower3d) · hồ (lòng hồ,
//   mặt nước, bờ đá, sen / cá chép / sỏi theo tuỳ biến) · cầu vòm · giả sơn có lối bậc · thảm cỏ có lỗ hồ · lối lát · cây theo
//   mùa · đèn theo kiểu · tượng · đá · ghế · vườn hoa · vườn sỏi · đài phun · tháp chedi · cột cờ.
//  Nhóm noCollide: thứ không phải vật cản (mặt nước, bờ hồ, thảm cỏ, lối lát, đá bước) — voxel.js bỏ qua.
// ============================================================================
import * as THREE from 'three';
import * as MD from '../models.js';
import * as AS from '../archkit-style.js';
import { gateHouse, stoneLantern, kit } from '../archkit.js';
import { placeModel } from '../assets.js';
import { Acc, buildTower, mergeAll } from './tower3d.js';
import { boxAt, cylAt, shapeWithHoles, inHole, railLine, pyramidRoof, polyPrism, columnGeo, skirt } from './geo.js';
import { tpMats } from './mats.js';
import { archStyle, POOL_LEVEL, gateHouseSpec, freeAt } from './plan.js';
import { plantFlora, hasModel, treeProxy } from './flora.js';
import { plantBigTrees, isBig, bigProxy } from './bigtrees.js';
import { FLORA } from './flora-spec.js';
import { PropSet } from './props.js';
import { optCol } from './custom.js';
import { hallFurniture } from './themes.js';
import { buildArch, STYLES as ARCH_STYLES } from './arch/index.js';

// công trình dựng theo đặc tả kiến trúc (arch/) — dựng một lần mỗi phiên, nhân bản khi phủ dựng lại
const ARCH_CACHE = new Map();
const BASE_KEYS = new Set(['stone', 'marble', 'floor', 'wood']);
/** { base (nền / bậc / sàn — không làm mờ), shell (phần còn lại — mờ khi vào trong) } của một công trình kiến trúc */
function archParts(key) {
  if (!ARCH_CACHE.has(key)) ARCH_CACHE.set(key, buildArch(key).group);
  const g = ARCH_CACHE.get(key), base = new THREE.Group(), shell = new THREE.Group();
  for (const m of g.children) (BASE_KEYS.has(m.name) ? base : shell).add(new THREE.Mesh(m.geometry, m.material));
  for (const o of [...base.children, ...shell.children]) o.castShadow = o.receiveShadow = true;
  return { base, shell };
}

// đồ mặc định từng sảnh theo công năng (chủ đề tầng lầu dùng chung — themes.js); vùng nào chủ phủ đã bày đồ thì bỏ
const HALL_THEME = { main: 0, eastfront: 1, eastback: 4, westfront: 2, westback: 5, guardw: 3, guarde: 3, theater: 8, backw: 7, backe: 6 };

const Q = Math.PI / 2;
const sph = (r, x, y, z, sx = 1, sy = 1, sz = 1, seg = 10) => { const g = new THREE.SphereGeometry(r, seg, Math.max(6, seg - 2)); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** cổng chính theo phong cách — cục bộ phủ, tâm lối cổng (0, D/2), lối rộng w mở thông từ mặt đất lên ≥ 6 m */
function mainGate(acc, kind, M, w, D, wallH) {
  const z = D / 2, hw = w / 2;
  const pylon = (x, bw, bh, bd, key = 'wall') => acc.add(key, boxAt(bw, bh, bd, x, bh / 2, z));
  switch (kind) {
    case 'paifang': // bài lâu 3 gian trước cổng + nhà cổng (dựng riêng bằng gateHouse)
      for (const sx of [-1, 1]) for (const x of [hw + 0.4, hw + 6]) acc.add('column', cylAt(0.45, 0.5, 9, sx * x, 4.5, z + 16, 12), boxAt(1.6, 0.8, 1.6, sx * x, 0.4, z + 16));
      acc.add('beam', boxAt(w + 14, 1.0, 0.9, 0, 8.2, z + 16), boxAt(w + 2, 1.4, 0.7, 0, 9.6, z + 16));
      acc.add('roof', skirt(4, 0.4, 3.2, 11.0, 1.4, 0.8).scale(w * 0.16 + 1, 1, 0.55).translate(0, 0, z + 16));
      for (const sx of [-1, 1]) acc.add('roof', skirt(4, 0.4, 2.2, 9.6, 1.0, 0.6).scale(1.4, 1, 0.55).translate(sx * (hw + 3.2), 0, z + 16));
      break;
    case 'torii': // cổng nhà gác (yagura) hai tầng + torii phía trước
      for (const sx of [-1, 1]) pylon(sx * (hw + 5), 10, wallH + 1, 12, 'facade');
      acc.add('facade', boxAt(w + 20, 5, 12, 0, wallH + 3.5, z));
      acc.add('roof', skirt(4, 6, 8.5, wallH + 6.2, 1.4, 0.2).scale((w + 20) / 14, 1, 1.15).translate(0, 0, z));
      for (const sx of [-1, 1]) acc.add('redLacquer', cylAt(0.45, 0.5, 9, sx * (hw + 1), 4.5, z + 18, 12));
      acc.add('redLacquer', boxAt(w + 6, 0.7, 0.9, 0, 9.2, z + 18), boxAt(w + 3, 0.5, 0.6, 0, 7.6, z + 18)); acc.add('dark', boxAt(w + 7, 0.3, 1.1, 0, 9.7, z + 18));
      break;
    case 'tibet': // hai tháp tường nghiêng trắng + dải đỏ + mái vàng nhỏ
      for (const sx of [-1, 1]) { const g = new THREE.CylinderGeometry(4.2 * Math.SQRT2, 5.4 * Math.SQRT2, 14, 4, 1, false, Math.PI / 4); g.translate(sx * (hw + 5.5), 7, z); acc.add('facade', g); acc.add('roofFlat', boxAt(8.6, 1.2, 8.6, sx * (hw + 5.5), 13.6, z)); acc.add('gold', pyramidRoof(4, 3.2, 14.2, 2.6, 0.5, 0.5).translate(sx * (hw + 5.5), 0, z)); }
      acc.add('facade', boxAt(w + 4, 4, 9, 0, wallH + 2.5, z)); acc.add('roofFlat', boxAt(w + 4.4, 0.8, 9.4, 0, wallH + 4.9, z));
      break;
    case 'gatehouse': // hai tháp tròn mái nón + vòm cổng + lỗ châu mai (Gothic)
      for (const sx of [-1, 1]) { acc.add('facade', cylAt(4.2, 4.6, 16, sx * (hw + 4.2), 8, z, 20)); const c = new THREE.ConeGeometry(5, 9, 20); c.translate(sx * (hw + 4.2), 20.5, z); acc.add('roofFlat', c); }
      acc.add('facade', boxAt(w + 4, 6, 6, 0, wallH + 3.5, z)); for (let i = -3; i <= 3; i++) acc.add('stone', boxAt(1.1, 1.2, 6.2, i * 1.9, wallH + 7.1, z));
      { const ar = new THREE.TorusGeometry(hw, 0.6, 8, 20, Math.PI); ar.translate(0, wallH - 0.6, z + 3.1); acc.add('trim', ar); }
      break;
    case 'deco': // hai trụ bậc lùi + gân dọc + tấm nan quạt trên lối
      for (const sx of [-1, 1]) { let bw = 9, y = 0; for (const h of [8, 5, 3.5]) { acc.add('wall', boxAt(bw, h, 9, sx * (hw + 4.5), y + h / 2, z)); for (let i = -1; i <= 1; i++) acc.add('dark', boxAt(0.4, h - 0.4, 0.3, sx * (hw + 4.5) + i * bw * 0.3, y + h / 2, z + 4.6)); y += h; bw -= 2.2; } }
      { const fan = new THREE.CircleGeometry(hw, 24, 0, Math.PI); fan.translate(0, 9, z + 0.2); acc.add('steel', fan); acc.add('dark', boxAt(w + 2, 1, 4, 0, 9, z)); }
      break;
    case 'triumph': // khải hoàn môn: khối lớn một vòm + 4 cột áp + gác mái chữ
      for (const sx of [-1, 1]) { pylon(sx * (hw + 4), 8, 15, 8, 'marble'); for (const x of [hw + 1.2, hw + 6.8]) acc.add('column', columnGeo(sx * x, z + 4.3, 0, 12, 0.5, 'corinth')); }
      acc.add('marble', boxAt(w + 16, 4, 8, 0, 13, z), boxAt(w + 17, 0.8, 8.6, 0, 11, z)); { const ar = new THREE.TorusGeometry(hw, 0.7, 8, 24, Math.PI); ar.translate(0, 9.5, z + 4.1); acc.add('trim', ar); }
      acc.add('gold', boxAt(w * 0.8, 1.6, 0.2, 0, 13.2, z + 4.15));
      break;
    case 'ngomon': // Ngọ Môn: đế đá chữ U 5 cửa + lầu Ngũ Phụng 9 mái (giữa vàng, 8 xanh)
      for (const sx of [-1, 1]) { pylon(sx * (hw + 9), 18, 8, 14, 'stone'); for (const k of [1, 2]) acc.add('dark', boxAt(2.6, 4.2, 0.3, sx * (hw + 3 + k * 5.5), 2.1, z + 7.05)); acc.add('stone', boxAt(10, 8, 18, sx * (hw + 13), 4, z + 16)); }
      acc.add('stone', boxAt(w + 2, 2, 14, 0, 7, z));
      for (let i = -4; i <= 4; i++) { const x = i * 4.6, yel = i === 0; acc.add('column', cylAt(0.25, 0.28, 4, x, 10, z, 8)); acc.add(yel ? 'gold' : 'roof', skirt(4, 0.3, 2.8, 13 + (yel ? 1 : 0), 1.2, 0.9).scale(1, 1, 2.2).translate(x, 0, z)); }
      acc.add('redLacquer', boxAt(w + 34, 3.2, 10, 0, 9.6, z));
      break;
    case 'gopura': // gopura Khmer: tháp tầng thót + hai hành lang
      for (const sx of [-1, 1]) acc.add('stone', boxAt(16, 7, 8, sx * (hw + 8), 3.5, z));
      { let s = w / 2 + 3, y = 7.5; acc.add('stone', boxAt(w + 6, 1.5, 10, 0, 6.75, z)); for (let t = 0; t < 5; t++) { acc.add(t % 2 ? 'gold' : 'stone', polyPrism(4, s, y, 2.4, s * 0.85).translate(0, 0, z)); y += 2.4; s *= 0.78; } acc.add('gold', cylAt(0.2, 0.4, 3, 0, y + 1.5, z, 8)); }
      break;
    case 'iwan': // pishtaq: khung chữ nhật cao + vòm nhọn + 2 minaret nhỏ + chhatri
      for (const sx of [-1, 1]) { pylon(sx * (hw + 4), 8, 16, 7, 'stone'); acc.add('marble', cylAt(0.9, 1.0, 22, sx * (hw + 9.5), 11, z + 2, 12)); acc.add('marble', sph(1.2, sx * (hw + 9.5), 22.8, z + 2, 1, 1.4, 1)); }
      acc.add('stone', boxAt(w + 16, 4, 7, 0, 14, z)); { const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector2(hw * Math.cos(t * Q), 9 + hw * 1.2 * Math.sin(t * Q))); } const ar = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([...pts.map((p) => new THREE.Vector3(-p.x, p.y, z + 3.6)).reverse(), ...pts.map((p) => new THREE.Vector3(p.x, p.y, z + 3.6))]), 30, 0.5, 6); acc.add('marble', ar); }
      acc.add('jade', boxAt(w * 0.7, 1.2, 0.2, 0, 15.2, z + 3.6));
      break;
    default: break;
  }
}

/** cổng phụ (sau / Đông / Tây): hai trụ + xà + mái nhỏ — cục bộ cổng (lối theo trục z cục bộ) */
function sideGate(acc, st, w, wallH) {
  for (const sx of [-1, 1]) acc.add(st.fam === 'asian' ? 'column' : 'stone', boxAt(1.4, wallH + 1.6, 1.4, sx * (w / 2 + 0.7), (wallH + 1.6) / 2, 0));
  acc.add('beam', boxAt(w + 3, 0.8, 1.6, 0, wallH + 1.2, 0));
  if (st.fam === 'asian') acc.add('roof', skirt(4, 0.3, 1.4, wallH + 2.6, 0.8, 0.6).scale((w + 4) / 2.8, 1, 1.2));
}

/** đèn theo kiểu (custom lamp: 0 phong cách · 1 đá · 2 lồng đỏ · 3 sắt · 4 ngọc) */
function lampGeo(acc, kind, x, z) {
  switch (kind) {
    case 'stone': acc.add('stone', boxAt(0.7, 0.3, 0.7, x, 0.15, z), cylAt(0.16, 0.2, 1.0, x, 0.8, z, 8), boxAt(0.8, 0.6, 0.8, x, 1.55, z)); acc.add('lampGlow', boxAt(0.5, 0.36, 0.5, x, 1.55, z)); acc.add('stone', pyramidRoof(4, 0.6, 1.85, 0.5, 0.4, 0.15).translate(x, 0, z)); break;
    case 'red': acc.add('dark', cylAt(0.07, 0.09, 3.2, x, 1.6, z, 6), boxAt(0.9, 0.08, 0.08, x + 0.35, 3.1, z)); acc.add('redLacquer', sph(0.38, x + 0.7, 2.55, z, 1, 1.3, 1)); acc.add('lampGlow', sph(0.2, x + 0.7, 2.55, z)); break;
    case 'iron': acc.add('dark', cylAt(0.08, 0.12, 3.6, x, 1.8, z, 8), cylAt(0.3, 0.3, 0.2, x, 0.1, z, 8)); acc.add('lampGlow', sph(0.3, x, 3.75, z, 1, 1.2, 1)); acc.add('dark', pyramidRoof(4, 0.36, 4.0, 0.35, 0.2, 0).translate(x, 0, z)); break;
    case 'jade': acc.add('marble', cylAt(0.12, 0.18, 2.4, x, 1.2, z, 8)); acc.add('jade', sph(0.34, x, 2.65, z, 1, 1.4, 1)); break;
    case 'deco': acc.add('steel', boxAt(0.25, 3.4, 0.25, x, 1.7, z)); acc.add('lampGlow', boxAt(0.5, 0.9, 0.5, x, 3.5, z)); acc.add('steel', pyramidRoof(4, 0.4, 3.95, 0.5, 0, 0).translate(x, 0, z)); break;
    case 'butter': acc.add('gold', cylAt(0.25, 0.35, 0.9, x, 0.45, z, 10)); acc.add('lampGlow', sph(0.18, x, 1.0, z)); break;
    case 'mughal': acc.add('stone', cylAt(0.18, 0.22, 2.2, x, 1.1, z, 8)); acc.add('lampGlow', sph(0.26, x, 2.4, z)); acc.add('marble', sph(0.3, x, 2.75, z, 1, 1.4, 1)); break;
    case 'thai': acc.add('gold', cylAt(0.1, 0.14, 2.4, x, 1.2, z, 8)); acc.add('lampGlow', sph(0.25, x, 2.5, z)); acc.add('gold', pyramidRoof(4, 0.4, 2.7, 1.0, 0.6, 0.2).translate(x, 0, z)); break;
    default: acc.add('stone', boxAt(0.7, 0.3, 0.7, x, 0.15, z), cylAt(0.16, 0.2, 1.0, x, 0.8, z, 8)); acc.add('lampGlow', boxAt(0.5, 0.4, 0.5, x, 1.55, z)); acc.add('roof', pyramidRoof(4, 0.6, 1.8, 0.6, 0.5, 0.2).translate(x, 0, z));
  }
}
const STONE_LAMP = { default: 1, stone: 1, butter: 1, thai: 1 }; // kiểu đèn dùng model đèn đá thật
const LAMP_OF = { palace: 'default', toro: 'stone', butter: 'butter', iron: 'iron', deco: 'deco', classic: 'iron', thai: 'thai', mughal: 'mughal' };

/**
 * Generator dựng tiên phủ m (mansions.estates — m.tp). opts: custom.decodeOpts. Trả (giá trị cuối):
 * { g (thế giới), solidRoots: [Group…] (cho voxel), tower, halls: [{ zone, g, mats }] }
 */
export function* buildTienJob(m, opts, empty = null) {
  const P = m.tp, st = P.st, M = tpMats(st, opts), S = archStyle(st, { key: JSON.stringify(opts || {}), roofCol: optCol(opts, 'roof'), wallCol: optCol(opts, 'wall'), trimCol: optCol(opts, 'trim') });
  // nền đất theo chữ ký thực vật của phủ (THUCVAT-MANIFEST §4): cỏ úa Tây Tạng, rêu Nhật, cát-cỏ Versailles … (mùa khác giữ màu mùa)
  if (!opts?.season && FLORA[st.id]?.ground && M.lawn && !M.lawn.userData.tpGround) { M.lawn = M.lawn.clone(); M.lawn.color.set(FLORA[st.id].ground); M.lawn.userData.tpGround = true; }
  const g = new THREE.Group(); g.name = `est:${m.h}`; g.position.set(m.x, 0, m.z); g.rotation.y = m.ry;
  const solid = new THREE.Group(); solid.name = 'solid'; const noCol = new THREE.Group(); noCol.name = 'nocol'; noCol.userData.noCollide = true;
  g.add(solid, noCol);
  const r = rng(77 + m.h); let flora = null;
  // đồ GLB (docs/TIEN-PHU-DOHOA-MANIFEST.md): ngoài trời · từng sảnh · từng tầng lầu — mansion3d dựng (build) khi job xong, ẩn / hiện theo người chơi
  const full = st.fam === 'asian', outdoor = new PropSet(g, 'tpOutdoor'), hallProps = [], floorProps = [];
  // ---------------- tường bao + cổng
  solid.add(mergeAll(AS.styledFence(S, P.walls)));
  { const acc = new Acc(); mainGate(acc, st.gate, M, P.gate.w, P.D, st.wallH);
    for (const gt of P.gates) if (!gt.main) { const a2 = new Acc(); sideGate(a2, st, gt.w, st.wallH); const sg = a2.build(M); sg.position.set(gt.x, 0, gt.z); sg.rotation.y = gt.ry; solid.add(sg); }
    solid.add(acc.build(M, { name: 'gate' }));
    for (const gs of gateHouseSpec(P)) { // lầu cổng bài lâu — bệ + bậc khai va chạm ở plan.tienCollision (cùng gateHouseSpec)
      const { base, shell } = gateHouse({ w: gs.w, d: gs.d, h: 7, plinth: gs.ph, roof: S.roofCol, main: true }); const gh = new THREE.Group(); gh.add(base, shell); gh.position.set(0, 0, gs.z);
      // bậc phía TRONG sân (archkit.plinth chỉ dựng bậc ngoài cho nhà mở) — người trong phủ ra cổng không phải leo bệ 0,9 m
      const pave = kit().pave;
      for (let k = 0; k < gs.n; k++) { const sh = (gs.ph * (k + 1)) / gs.n, st2 = new THREE.Mesh(new THREE.BoxGeometry(gs.sw, sh, 0.34), pave); st2.position.set(0, sh / 2, -(gs.D / 2 + (gs.n - k - 0.5) * 0.34)); base.add(st2); }
      solid.add(mergeAll(gh));
    }
  }
  yield;
  // ---------------- sảnh (archkit-style) — vỏ sảnh làm mờ khi vào trong
  const halls = [], bases = new THREE.Group(); bases.name = 'hallbases';
  for (let i = 0; i < P.buildings.length; i++) {
    const b = P.buildings[i];
    const { base, shell } = b.arch ? archParts(b.arch) : AS.styledBuilding(S, b);
    base.position.set(b.x, 0, b.z); base.rotation.y = b.ry; bases.add(base);
    const sg = new THREE.Group(); sg.name = `hall${i}`; sg.position.set(b.x, 0, b.z); sg.rotation.y = b.ry; sg.add(shell);
    mergeAll(sg); MD.ownMaterials(sg); solid.add(sg);
    halls.push({ zone: P.zones[i], g: sg, mats: sg.userData.fadeMats, op: 1 });
    if (b.arch) yield;
  }
  solid.add(mergeAll(bases));
  // đồ mặc định trong sảnh còn trống (một lưới gộp cho mọi sảnh)
  { const acc = new Acc();
    P.buildings.forEach((b, i) => {
      if (empty && !empty.has(i)) return;
      const asian = S.fam === 'asian', y = (asian ? b.plinth : Math.max(0.15, b.plinth)) + 0.05;
      const ps = new PropSet(g, `tpHall${i}`); ps.at = { x: b.x, z: b.z, r: Math.hypot(b.w, b.d) / 2 }; hallProps.push(ps);
      const c = Math.cos(b.ry), sn = Math.sin(b.ry);
      const wrap = { add: (key, ...geos) => acc.add(key, geos.flat().filter(Boolean).map((g) => g.rotateY(b.ry).translate(b.x, 0, b.z))), full,
        prop: (id, x, y, z, ry, sc, fit) => ps.add(id, b.x + c * x + sn * z, y, b.z - sn * x + c * z, (ry || 0) + b.ry, sc, fit) };
      const iw = b.arch && b.body[0] ? b.body[0] : b.w, id2 = b.arch && b.body[1] ? b.body[1] : b.d; // lòng nhà thật (lưới cột) — không tràn ra nền / nguyệt đài
      hallFurniture(wrap, { hw: iw / 2 - (b.arch ? 1.2 : 0.45), hd: id2 / 2 - (b.arch ? 1.6 : 0.45), y, back: !!b.back }, b.theme ?? HALL_THEME[b.id] ?? 1); // chủ đề bài trí theo bản vẽ (siteplans.js)
    });
    solid.add(acc.build(M, { name: 'hallFurniture' })); }
  // bản GỘP mọi vỏ sảnh (đứng ngoài sảnh) — vào trong sảnh nào thì hiện vỏ riêng từng sảnh để làm mờ (mansion3d)
  const hallsWhole = new THREE.Group(); hallsWhole.name = 'hallsWhole'; hallsWhole.userData.noCollide = true;
  for (const hl of halls) { const c = hl.g.clone(); c.traverse((o) => { if (o.isMesh) o.material = o.userData.baseMat || o.material; }); hallsWhole.add(c); hl.g.visible = false; }
  mergeAll(hallsWhole, { dedupe: true });
  for (const o of hallsWhole.children) if (o.material?.transparent) { o.material = o.material.clone(); o.material.transparent = false; o.material.opacity = 1; o.material.depthWrite = true; }
  solid.add(hallsWhole);
  yield;
  // ---------------- đình
  { const pavs = new THREE.Group(); pavs.name = 'pavs'; for (const pv of P.pavs) { const { base, shell } = pv.arch ? archParts(pv.arch) : AS.styledPavilion(S, pv); const pg = new THREE.Group(); pg.add(base, shell); pg.position.set(pv.x, pv.y || 0, pv.z); pavs.add(pg); } solid.add(mergeAll(pavs)); }
  yield;
  // ---------------- lầu chính 10 tầng
  const tw = buildTower(P.tower.spec, st, M, opts?.themes, (k) => { const ps = new PropSet(null, `tpFloor${k}`); ps.full = full; floorProps[k] = ps; return ps; }, { skin: !!ARCH_STYLES[st.id]?.specs?.tower });
  for (const ps of floorProps) if (ps) ps.frame = tw.root;
  tw.root.position.set(P.tower.x, 0, P.tower.z); solid.add(tw.root);
  if (ARCH_STYLES[st.id]?.specs?.tower) { const { base, shell } = archParts(`${st.id}/tower`); const sk = new THREE.Group(); sk.name = 'towerSkin'; sk.add(base, shell); sk.position.set(P.tower.x, 0, P.tower.z); mergeAll(sk); solid.add(sk); } // vỏ lầu theo nguyên mẫu (arch/)
  yield;
  // ---------------- nước: lòng hồ (đáy + vách), mặt nước, bờ đá; sen / cá / sỏi
  { const acc = new Acc(), lake = opts?.lake || 0;
    // vách / bờ đá chỉ dựng ở phần KHÔNG nằm trong khối nước khác (ao nhiều elip chồng, kênh chữ thập, hào 4 dải) — không còn vách chìm cắt mặt nước
    const wet = (self, x, z) => P.water.some((o) => o !== self && inHole(o, x, z, -0.25));
    for (const w of P.water) {
      if (w.shape === 'ellipse') {
        const geo = new THREE.CircleGeometry(1, 64); geo.rotateX(-Q);
        acc.add('bed', geo.clone().scale(w.rx, 1, w.rz).translate(w.x, w.floor, w.z));
        acc.add('water', geo.clone().scale(w.rx, 1, w.rz).translate(w.x, w.level, w.z));
        const NS = 96;
        for (let k = 0; k < NS; k++) {
          const t0 = (k / NS) * Math.PI * 2, t1 = ((k + 1) / NS) * Math.PI * 2, tm = (t0 + t1) / 2, mx = w.x + Math.cos(tm) * w.rx, mz = w.z + Math.sin(tm) * w.rz;
          if (wet(w, mx, mz)) continue;
          const ax = w.x + Math.cos(t0) * w.rx, az = w.z + Math.sin(t0) * w.rz, bx = w.x + Math.cos(t1) * w.rx, bz = w.z + Math.sin(t1) * w.rz, L = Math.hypot(bx - ax, bz - az) + 0.05, ry = Math.atan2(-(bz - az), bx - ax);
          acc.add('stoneDark', boxAt(L, -w.floor, 0.25, mx, w.floor / 2, mz, ry));
          if (k % 2 === 0) acc.add('stone', boxAt(1.6, 0.35, 0.8, w.x + Math.cos(tm) * (w.rx + 0.3), 0.12, w.z + Math.sin(tm) * (w.rz + 0.3), ry));
        }
      } else {
        acc.add('bed', boxAt(w.hw * 2, 0.1, w.hd * 2, w.x, w.floor - 0.05, w.z)); acc.add('water', boxAt(w.hw * 2, 0.02, w.hd * 2, w.x, w.level, w.z));
        for (const [ax, az, bx, bz] of [[w.x - w.hw, w.z - w.hd, w.x + w.hw, w.z - w.hd], [w.x - w.hw, w.z + w.hd, w.x + w.hw, w.z + w.hd], [w.x - w.hw, w.z - w.hd, w.x - w.hw, w.z + w.hd], [w.x + w.hw, w.z - w.hd, w.x + w.hw, w.z + w.hd]]) {
          const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / 2)), along = Math.abs(bx - ax) > Math.abs(bz - az);
          for (let q = 0; q < n; q++) { const t = (q + 0.5) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t; if (wet(w, x, z)) continue; const sl = L / n + 0.02; acc.add('stoneDark', boxAt(along ? sl : 0.3, -w.floor, along ? 0.3 : sl, x, w.floor / 2, z)); acc.add('marble', boxAt(along ? sl : 0.8, 0.3, along ? 0.8 : sl, x, 0.1, z)); }
        }
      }
      // điểm xuyết theo tuỳ biến hồ
      const N = w.shape === 'ellipse' ? Math.round(w.rx * w.rz * 0.02) : Math.round(w.hw * w.hd * 0.04);
      for (let k = 0; k < N; k++) {
        const t = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85, x = w.shape === 'ellipse' ? w.x + Math.cos(t) * w.rx * d : w.x + (r() - 0.5) * w.hw * 1.7, z = w.shape === 'ellipse' ? w.z + Math.sin(t) * w.rz * d : w.z + (r() - 0.5) * w.hd * 1.7;
        if (lake === 0) { acc.add('pad', cylAt(0.6 + r() * 0.5, 0.6, 0.03, x, w.level + 0.03, z, 10)); if (r() < 0.35) acc.add('lotus', sph(0.25, x, w.level + 0.3, z, 1, 0.8, 1)); }
        else if (lake === 1) acc.add('koi', sph(0.32, x, w.level - 0.25, z, 1, 0.45, 0.45));
        else if (lake === 2) acc.add('marble', sph(0.3 + r() * 0.3, x, w.floor + 0.1, z, 1, 0.5, 1));
        else if (r() < 0.3) acc.add('jade', sph(0.35, x, w.floor + 0.2, z, 1, 0.6, 1));
      }
    }
    if (lake === 3) M.water.emissive?.set?.('#2a9a88');
    for (const s of P.stones || []) acc.add('stone', cylAt(s.r, s.r * 1.1, 0.4, s.x, -0.08, s.z, 8));
    for (const il of P.islands) { acc.add('lawn', cylAt(il.r, il.r + 0.4, 0.3, il.x, -0.12, il.z, 24)); acc.add('stone', cylAt(il.r + 0.4, il.r + 0.8, 2.2, il.x, -1.2, il.z, 24)); if (il.lantern) lampGeo(acc, 'stone', il.x, il.z); }
    if (P.moatIsle) acc.add('stone', boxAt(P.moatIsle.hw * 2 + 0.6, 2.2, P.moatIsle.hd * 2 + 0.6, P.moatIsle.x, -1.15, P.moatIsle.z));
    noCol.add(acc.build(M, { name: 'water' }));
  }
  // cầu vòm: mặt cầu từng đoạn theo cung + lan can (lan can là vật cản — vào nhóm solid; mặt cầu là nền nên voxel tự bỏ)
  { const acc = new Acc();
    for (const b of P.bridges) {
      const n = Math.max(2, Math.round(b.len / 1.0)), c = Math.cos(b.ry), s = Math.sin(b.ry), prof = (t) => (b.flat ? b.rise : b.rise * Math.sin(Math.PI * t));
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n, u0 = -b.len / 2 + t0 * b.len, u1 = -b.len / 2 + t1 * b.len, y0 = prof(t0), y1 = prof(t1);
        const seg = new THREE.BoxGeometry(b.w, 0.3, Math.hypot(u1 - u0, y1 - y0) + 0.04); seg.rotateX(-Math.atan2(y1 - y0, u1 - u0)); seg.rotateY(b.ry); seg.translate(b.x + s * (u0 + u1) / 2, (y0 + y1) / 2 - 0.15, b.z + c * (u0 + u1) / 2); acc.add(st.fam === 'asian' && !b.flat ? 'redLacquer' : 'marble', seg);
      }
      for (const sd of [-1, 1]) { const pts = []; for (let k = 1; k < n; k++) { const t = k / n, u = -b.len / 2 + t * b.len; pts.push([b.x + s * u + c * sd * (b.w / 2 - 0.1), prof(t), b.z + c * u - s * sd * (b.w / 2 - 0.1)]); } for (let k = 0; k + 1 < pts.length; k++) { const [x0, y0, z0] = pts[k], [x1, y1, z1] = pts[k + 1]; acc.add('rail', boxAt(0.14, 1.0, 0.14, x0, y0 + 0.5, z0)); const rl = new THREE.BoxGeometry(0.1, 0.1, Math.hypot(x1 - x0, y1 - y0, z1 - z0) + 0.05); rl.rotateX(-Math.atan2(y1 - y0, Math.hypot(x1 - x0, z1 - z0))); rl.rotateY(b.ry); rl.translate((x0 + x1) / 2, (y0 + y1) / 2 + 0.95, (z0 + z1) / 2); acc.add('rail', rl); } }
    }
    solid.add(acc.build(M, { name: 'bridges' }));
  }
  yield;
  // ---------------- giả sơn / đài bậc + lối bậc lên đỉnh
  { const acc = new Acc(), k = P.rockery, front = k.z + k.d / 2, cw = k.stairW / 2 + 0.3, zc = front - k.run;
    const blocks = [[k.x - k.w / 2, k.x - cw, zc, front], [k.x + cw, k.x + k.w / 2, zc, front], [k.x - k.w / 2, k.x + k.w / 2, k.z - k.d / 2, zc]];
    for (const [x0, x1, z0, z1] of blocks) {
      if (k.kind === 'rock') {
        // khối đá Thái Hồ: chồng khối gồ ghề (dodecahedron) phủ kín hình chữ nhật, đỉnh bằng ở k.h
        const nx = Math.max(1, Math.round((x1 - x0) / 4)), nz = Math.max(1, Math.round((z1 - z0) / 4));
        for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const cx = x0 + (i + 0.5) * (x1 - x0) / nx, cz = z0 + (j + 0.5) * (z1 - z0) / nz; const d = new THREE.DodecahedronGeometry(1, 0); d.scale((x1 - x0) / nx * 0.62, k.h * 0.52, (z1 - z0) / nz * 0.62); d.rotateY(r() * 6); d.translate(cx, k.h * 0.5, cz); acc.add(r() < 0.5 ? 'stone' : 'stoneDark', d); }
        acc.add('stone', boxAt(x1 - x0, 0.3, z1 - z0, (x0 + x1) / 2, k.h - 0.15, (z0 + z1) / 2));
      } else { for (let t = 0; t < 3; t++) acc.add(t % 2 ? 'marble' : 'stone', boxAt(x1 - x0 - t * 0.4, k.h / 3, z1 - z0 - t * 0.4, (x0 + x1) / 2, (k.h * (t + 0.5)) / 3, (z0 + z1) / 2)); }
    }
    for (let i = 1; i <= k.steps; i++) { const top = i * k.rise, z = front - (i - 0.5) * k.tread; acc.add('stone', boxAt(k.stairW, top, k.tread + 0.02, k.x, top / 2, z)); }
    acc.add('rail', railLine(k.x - 6.5, k.z - 12.5, k.x + 6.5, k.z - 12.5, k.h), railLine(k.x - 6.5, k.z - 12.5, k.x - 6.5, k.z + 0.5, k.h), railLine(k.x + 6.5, k.z - 12.5, k.x + 6.5, k.z + 0.5, k.h));
    solid.add(acc.build(M, { name: 'rockery' }));
  }
  yield;
  // ---------------- thảm cỏ (lỗ hồ) + lối lát + vườn sỏi
  { const acc = new Acc(), hw = P.W / 2 - 0.9, hd = P.D / 2 - 0.9;
    const holes = P.water.map((w) => (w.shape === 'ellipse' ? { x: w.x, z: w.z, rx: w.rx + 0.2, rz: w.rz + 0.2 } : { x: w.x, z: w.z, hw: w.hw + 0.2, hd: w.hd + 0.2 }));
    acc.add('lawn', shapeWithHoles([[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]], holes, 0.04, 0.05));
    for (const p of P.paths) acc.add('pave', boxAt(p.w, 0.05, p.d, p.x, 0.07, p.z, p.ry));
    if (P.zen) { acc.add('gravel', boxAt(P.zen.w, 0.05, P.zen.d, P.zen.x, 0.08, P.zen.z)); for (let i = 0; i < 18; i++) acc.add('stone', boxAt(P.zen.w - 2, 0.02, 0.08, P.zen.x, 0.12, P.zen.z - P.zen.d / 2 + 1 + i * (P.zen.d - 2) / 17)); }
    if (P.forecourt) acc.add('pave', boxAt(P.forecourt.w, 0.05, P.forecourt.d, P.forecourt.x, 0.065, P.forecourt.z)); // sân lát trước cổng theo bản vẽ
    noCol.add(acc.build(M, { name: 'ground' }));
  }
  // ---------------- vật trang trí đặc: vườn hoa kỷ hà, đài phun, chedi, cột cờ, đá, ghế, tượng (không phải sư tử GLB)
  { const acc = new Acc();
    for (const bd of P.beds) { acc.add('hedge', boxAt(bd.w, 0.9, 0.6, bd.x, 0.45, bd.z - bd.d / 2), boxAt(bd.w, 0.9, 0.6, bd.x, 0.45, bd.z + bd.d / 2), boxAt(0.6, 0.9, bd.d, bd.x - bd.w / 2, 0.45, bd.z), boxAt(0.6, 0.9, bd.d, bd.x + bd.w / 2, 0.45, bd.z)); acc.add('flower', boxAt(bd.w - 1.2, 0.35, bd.d - 1.2, bd.x, 0.2, bd.z)); }
    if (P.fountain) { const f = P.fountain; acc.add('marble', new THREE.CylinderGeometry(f.r, f.r + 0.4, 0.7, 32, 1, true).translate(f.x, 0.35, f.z), cylAt(f.r * 0.4, f.r * 0.5, 1.6, f.x, 0.8, f.z, 16), cylAt(f.r * 0.6, f.r * 0.3, 0.3, f.x, 1.7, f.z, 16), cylAt(0.3, 0.4, 1.6, f.x, 2.6, f.z, 10)); acc.add('water', cylAt(f.r - 0.1, f.r - 0.1, 0.05, f.x, 0.45, f.z, 32)); }
    for (const s of P.stupas || []) { const pts = [[s.r, 0], [s.r, s.h * 0.12], [s.r * 0.95, s.h * 0.2], [s.r * 1.0, s.h * 0.45], [s.r * 0.55, s.h * 0.6], [s.r * 0.35, s.h * 0.7], [s.r * 0.12, s.h], [0.01, s.h]].map(([a, b]) => new THREE.Vector2(a, b)); const l = new THREE.LatheGeometry(pts, 16); l.translate(s.x, 0, s.z); acc.add('marble', l); acc.add('gold', cylAt(0.1, s.r * 0.15, s.h * 0.35, s.x, s.h * 0.82, s.z, 8)); }
    for (const [x, z] of P.flagPoles || []) { acc.add('gold', cylAt(0.12, 0.15, 9, x, 4.5, z, 8)); for (let i = 0; i < 6; i++) { const t = (i / 6) * Math.PI * 2; acc.add('banner', boxAt(0.05, 0.4, 3.2, x + Math.cos(t) * 1.6, 7.5 - i * 0.2, z + Math.sin(t) * 1.6, -t)); } }
    for (const rk of P.rocks) { const ry = r() * 6; r(); const sz = outdoor.add('lib_lib_rock_boulder', rk.x, -0.12, rk.z, ry, rk.r * 2.2, 'width'); acc.add('proxy', boxAt(sz.w * 0.8, sz.h, sz.d * 0.75, rk.x, sz.h / 2 - 0.12, rk.z, ry)); } // đá tảng thật (DOHOA §2.3)
    for (const b of P.benches) { const c = Math.cos(b.ry), s = Math.sin(b.ry); acc.add('stone', boxAt(2.0, 0.12, 0.6, b.x, 0.48, b.z, b.ry)); for (const t of [-0.7, 0.7]) acc.add('stone', boxAt(0.3, 0.45, 0.5, b.x + c * t, 0.22, b.z - s * t, b.ry)); }
    if (st.statue !== 'bq_lion') for (const s of P.statues) { if (st.fam === 'western' || st.fam === 'modern') { acc.add('marble', boxAt(1.4, 1.2, 1.4, s.x, 0.6, s.z)); acc.add(st.id === 'artdeco' ? 'steel' : 'marble', pyramidRoof(4, 0.5, 1.2, 4.8, 0, 0).translate(s.x, 0, s.z)); } else if (st.id === 'mughal') { acc.add('stone', boxAt(1.6, 1.0, 1.6, s.x, 0.5, s.z)); acc.add('marble', cylAt(0.5, 0.6, 1.4, s.x, 1.7, s.z, 10), sph(0.7, s.x, 2.7, s.z, 1, 1.3, 1)); } else { acc.add('stone', boxAt(1.4, 0.8, 1.4, s.x, 0.4, s.z)); acc.add(st.id === 'nhatban' ? 'stone' : 'gold', cylAt(0.5, 0.65, 1.8, s.x, 1.7, s.z, 8), sph(0.55, s.x, 2.9, s.z)); } }
    solid.add(acc.build(M, { name: 'decor' }));
  }
  if (st.statue === 'bq_lion') for (const s of P.statues) placeModel(solid, 'bq_lion', { fit: { height: s.s }, at: { x: s.x, y: 0, z: s.z, ry: s.ry } }).catch(() => null);
  yield;
  // ---------------- đèn
  { const acc = new Acc(), lk = ['', 'stone', 'red', 'iron', 'jade'][opts?.lamp || 0] || LAMP_OF[st.lamp] || 'default';
    for (const l of P.lamps) {
      if (STONE_LAMP[lk]) { // đèn đá thật (ishidōrō / thạch đăng — DOHOA §2.3): model 2 m + khối sáng trong buồng đèn
        outdoor.add('pr_stonelantern', l.x, 0, l.z, (Math.round(l.x * 7 + l.z * 3) % 4) * Q, 2.0); acc.add('proxy', boxAt(0.75, 2.0, 0.75, l.x, 1.0, l.z)); acc.add('lampGlow', boxAt(0.26, 0.24, 0.26, l.x, 1.3, l.z));
      } else if (lk === 'red') { // cột gỗ son có tay vươn, treo đèn lồng đỏ thật
        acc.add('dark', cylAt(0.08, 0.1, 2.9, l.x, 1.45, l.z, 8), boxAt(1.0, 0.08, 0.08, l.x + 0.42, 2.8, l.z)); outdoor.add('lib_lantern', l.x + 0.85, 1.9, l.z, 0, 0.75); acc.add('lampGlow', sph(0.16, l.x + 0.85, 2.22, l.z));
      } else lampGeo(acc, lk, l.x, l.z);
    }
    solid.add(acc.build(M, { name: 'lamps' }));
  }
  yield;
  // ---------------- cây (styledTree) theo mùa — gộp theo vật liệu; tán lá nhuộm theo tuỳ biến mùa
  { const tg = new THREE.Group(); tg.name = 'trees'; let seed = m.h * 31 + 7;
    // loài có model thật → flora.js (nhân bản, gần / xa); loài chưa có model (cypress, hedge, palm, bamboo) dựng thủ tục như cũ
    const mod = [], big = [];
    for (const t of P.trees) { if (isBig(t.kind)) { big.push(t); continue; } if (hasModel(t.kind)) { mod.push(t); continue; } const o = AS.styledTree(t.kind, seed++, t.s || 1); o.position.set(t.x, 0, t.z); o.rotation.y = seed; tg.add(o); }
    { const pa = new Acc(); for (const t of mod) { const q = treeProxy(t); pa.add('proxy', q.r ? cylAt(q.r, q.r * 1.15, q.h, t.x, q.h / 2, t.z, 8) : boxAt(q.w, q.h, q.d, t.x, q.h / 2, t.z)); }
      for (const t of big) { const q = bigProxy(t); pa.add('proxy', cylAt(q.r, q.r * 1.2, q.h, t.x, q.h / 2, t.z, 10)); }
      solid.add(pa.build(M, { name: 'treeTrunks' })); } // trụ thân ẩn (va chạm)
    // cổ thụ (model Meshy / thủ tục, docs/TIEN-PHU-THUCVAT-MANIFEST.md) + cây nhỏ cũ (flora.js) — gộp một bộ cập nhật cho mansion3d
    { const fa = plantFlora(g, mod, opts?.season || 0), fb = plantBigTrees(g, big, opts?.season || 0);
      flora = { group: fb.group, ready: Promise.all([fa.ready, fb.ready]), update: (x, z) => { fa.update(x, z); fb.update(x, z); }, stats: () => { const a = fa.stats(), b = fb.stats(); return Object.fromEntries(Object.keys(b).map((k) => [k, (a[k] || 0) + b[k]])); } }; }
    mod.push(...big); // hoa / bụi quanh gốc dùng chung danh sách
    // hoa viền lối + quanh gốc cây hoa, bụi quanh gốc (DOHOA §2.2) — RNG riêng: không đổi vị trí cây / đèn cũ
    { const rg = rng(991 + m.h), taken = [...P.lamps, ...P.benches]; let nf = 0, ns = 0;
      const okAt = (x, z) => freeAt(P, x, z, 0.6) && !taken.some((o) => Math.abs(o.x - x) < 1.1 && Math.abs(o.z - z) < 1.1) && !P.trees.some((t) => Math.abs(t.x - x) < 0.7 && Math.abs(t.z - z) < 0.7);
      const flower = (x, z) => { if (nf < 1800 && okAt(x, z)) { outdoor.add('lib_lib_flower_meadow', x, 0.05, z, rg() * 6.28, 0.5 + rg() * 0.25); nf++; } };
      for (const p of P.paths) { const c = Math.cos(p.ry || 0), sn = Math.sin(p.ry || 0), along = p.d >= p.w, L = along ? p.d : p.w, off = (along ? p.w : p.d) / 2 + 0.7;
        for (let u = -L / 2 + 1; u <= L / 2 - 1; u += 1.6) for (const sd of [-1, 1]) { const lx = along ? sd * off : u, lz = along ? u : sd * off; flower(p.x + c * lx + sn * lz + (rg() - 0.5) * 0.4, p.z - sn * lx + c * lz + (rg() - 0.5) * 0.4); } }
      const BLOOM = { peach: 1, sakura: 1, camellia: 1, plum: 1, osmanthus: 1, magnolia: 1, frangi: 1, jacaranda: 1 };
      mod.forEach((t, i) => {
        if (BLOOM[t.kind]) for (let k = 0; k < 2; k++) { const a = rg() * 6.28, d = 1.2 + rg() * 0.6; flower(t.x + Math.cos(a) * d, t.z + Math.sin(a) * d); }
        if (i % 3 === 0 && ns < 400) { const a = rg() * 6.28, d = 1.4 + rg() * 0.8, x = t.x + Math.cos(a) * d, z = t.z + Math.sin(a) * d; if (okAt(x, z)) { outdoor.add('lib_lib_shrub_under', x, 0.04, z, rg() * 6.28, 0.6 + rg() * 0.5); ns++; } }
      });
    }
    mergeAll(tg, { dedupe: true });
    const season = opts?.season || 0;
    if (season) { const tint = ['#000', '#f2a6c0', '#d0602a', '#eef2f4'][season], cache = new Map(); tg.traverse((o) => { if (!o.isMesh) return; const c = o.material.color; if (c && c.g > c.r * 1.05 && c.g > c.b) { if (!cache.has(o.material)) { const mm = o.material.clone(); mm.color = c.clone().lerp(new THREE.Color(tint), 0.7); cache.set(o.material, mm); } o.material = cache.get(o.material); } }); }
    solid.add(tg);
  }
  yield;
  return { g, solidRoots: [solid], tower: tw, halls, hallsWhole, M, S, flora, props: { outdoor, halls: hallProps, floors: floorProps } };
}
