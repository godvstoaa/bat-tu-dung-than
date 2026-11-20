// ============================================================================
//  BỘ DỰNG BIỆT PHỦ / BIỆT THỰ THEO PHONG CÁCH (docs/BIET-PHU-MANIFEST.md) — thay archkit-style (hộp + nón + texture vẽ
//  canvas kéo giãn) bằng bộ kiến trúc thật của tiên phủ (tienphu/arch/*, CHỈ import) dựng ĐÚNG KHUÔN LÔ của
//  estate-layout (va chạm mansions.mansionSolids giữ nguyên: vách trên chu vi w × d, khe cửa 2,4 m giữa mặt +z,
//  thêm khe mặt sau nếu b.back; sàn trong nhà ở cao độ b.plinth).
//
//  Mỗi họ phong cách là một module est-<họ>.js xuất FAMILY = { hall, tower, pav, gate } — hàm nào chưa có (null hoặc trả
//  null) thì mansion3d dùng lại bản archkit-style cũ cho phần đó.
//    hall(styleId, S, b, opt)  b = { id: 'main'|'guest'|'wing', w, d, h, floors, plinth, back }, opt = { villa }
//    tower(styleId, S, t)      t = { w, d, h }  (gốc tâm đáy, tháp cao ~36 m bên Thanh Long)
//    pav(styleId, S, pv)       pv = { w, d, h, octa }  (đình mở bên mặt nước, 7 × 7)
//    gate(styleId, S, g)       g = { w (khe cổng), villa, d (z mặt tường rào) }  — cổng đặt tại z = d, xuyên qua tường rào
//  Mỗi hàm trả { acc: Acc | { base: Acc, shell: Acc }, mats: { khoá: THREE.Material }, post?(group) → group, info? }
//  (khung cục bộ: gốc tâm đáy, cửa +z), hoặc { group: THREE.Group } (dựng sẵn, không tách), hoặc null.
//  Một Acc → tách base / shell theo khoá (BASE_KEY): base không mờ khi vào nhà, shell mờ. post (vd. retex + consolidate
//  của archcity/mats.js) chạy riêng trên base và shell SAU khi tách.
// ============================================================================
import * as THREE from 'three';
// nạp từng họ riêng: một họ đang sửa dở (lỗi cú pháp / thiếu file phụ) không làm hỏng các họ khác — họ lỗi = bản cũ
const fam = (p) => p.then((m) => m.FAMILY || {}).catch((e) => { console.warn('estatekit: họ lỗi', e?.message || e); return {}; });
const [CN, ASIA, MODERN, CLASSIC, WEST, MUGHAL, JP, TUDOR] = await Promise.all([
  fam(import('./est-cn.js')), fam(import('./est-asia.js')), fam(import('./est-modern.js')), fam(import('./est-classic.js')),
  fam(import('./est-west.js')), fam(import('./est-mughal.js')), fam(import('./est-jp.js')), fam(import('./est-tudor.js')),
]);

export const FAM_OF = {
  cungdinh: CN, giangnam: CN, hanok: CN,
  hue: ASIA, nhavuon: ASIA, thai: ASIA,
  nhatban: JP, bali: JP,
  kinh: MODERN, toigian: MODERN, nhietdoi: MODERN,
  palladian: CLASSIC, chateau: CLASSIC, phap: CLASSIC,
  moorish: WEST, diatrunghai: WEST, tuscan: WEST,
  tudor: TUDOR, mughal: MUGHAL,
};
/** bậc VỪA (xa > NEAR_LOD m): bỏ các khoá chi tiết nhỏ — đấu củng, gân ngói, song cửa tiện … (họ có thể khai thêm midDrop) */
export const MID_DROP = /^(dougong|rib|baluster|dentil|carve|statue|potAFeu|trophy|lattice|tracery|railBar)/i;
export const NEAR_LOD = 75;
/** khoá vật liệu thuộc phần NỀN (không mờ khi vào nhà): nền, bậc, sân, sàn */
export const BASE_KEY = /^(stone|floor|plinth|platform|court|step|terrace|ground|paving|pave|engawa|plinthShade|stoneC|stoneW|base)/i;

const CACHE = new Map();
const r1 = (v) => Math.round(v * 10) / 10;
function keyOf(styleId, kind, o) {
  return `${styleId}:${kind}:` + Object.entries(o).filter(([, v]) => typeof v !== 'object').map(([k, v]) => `${k}=${typeof v === 'number' ? r1(v) : v}`).sort().join(',');
}
/**
 * Dựng (có bộ nhớ đệm theo kích thước) một phần của khuôn viên. kind: 'hall' | 'tower' | 'pav' | 'gate'.
 * Trả { base, shell, shellMid (bậc vừa — null nếu không có khoá chi tiết để bỏ), info: { tris, trisMid } } — mỗi lần gọi là
 * bản sao (hình học + vật liệu dùng chung: KHÔNG dispose hình của lưới userData.ek) — hoặc null.
 */
export function estatePiece(styleId, S, kind, o, opt = {}) {
  const F = FAM_OF[styleId]?.[kind]; if (!F) return null;
  const k = keyOf(styleId, kind, { ...o, villa: !!opt.villa, variant: opt.variant | 0 });
  if (!CACHE.has(k)) {
    let r = null;
    try { r = F(styleId, S, o, opt); } catch (e) { console.warn('estatekit', k, e); r = null; }
    if (!r) { CACHE.set(k, null); return null; }
    const name = `ek:${k}`;
    let base, shell, shellMid = null;
    if (r.group) { base = r.group; shell = new THREE.Group(); base.name = name + ':base'; shell.name = name + ':shell'; }
    else if (r.acc.base) { base = r.acc.base.build(r.mats, name + ':base'); shell = r.acc.shell.build(r.mats, name + ':shell'); }
    else {
      const all = r.acc.build(r.mats, name); base = new THREE.Group(); shell = new THREE.Group(); base.name = name + ':base'; shell.name = name + ':shell';
      for (const m of [...all.children]) (BASE_KEY.test(m.name) ? base : shell).add(m);
      // bậc vừa: dựng lại phần thân không có khoá chi tiết (dùng chung hình của các khoá còn lại)
      const drop = r.midDrop || MID_DROP, has = [...r.acc.parts.keys()].some((k) => !BASE_KEY.test(k) && drop.test(k));
      if (has) { shellMid = new THREE.Group(); shellMid.name = name + ':mid'; for (const m of shell.children) if (!drop.test(m.name)) shellMid.add(m.clone()); }
    }
    if (r.post) { base = r.post(base) || base; shell = r.post(shell) || shell; if (shellMid) shellMid = r.post(shellMid) || shellMid; }
    const triOf = (...gs) => { let n = 0; for (const g of gs) if (g) g.traverse((m) => { if (m.isMesh) n += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; }); return Math.round(n); };
    for (const g of [base, shell, shellMid]) if (g) g.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; m.userData.ek = true; } });
    CACHE.set(k, { base, shell, shellMid, info: { ...(r.info || {}), tris: triOf(base, shell), trisMid: triOf(base, shellMid || shell) } });
  }
  const c = CACHE.get(k); if (!c) return null;
  return { base: c.base.clone(), shell: c.shell.clone(), shellMid: c.shellMid ? c.shellMid.clone() : null, info: c.info };
}
export const hasPiece = (styleId, kind) => !!FAM_OF[styleId]?.[kind];
