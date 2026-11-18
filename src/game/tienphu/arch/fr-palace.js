// ============================================================================
//  CUNG ĐIỆN MẶT VƯỜN VERSAILLES (main, wingW, wingE) — 06 › Phần chung §2 + main / wingW / wingE.
//  Ba tầng: nền khía rãnh (refends) cửa vòm có mascaron · tầng chính Ionic cửa vòm cao, ban công con tiện, avant-corps cột
//  tự do mang tượng · attic pilaster Corinthian cửa chữ nhật · lan can con tiện + trụ đặc mang pot à feu / trophée, mái chì phẳng.
//  Mặt đứng = dãy phần tử (trụ / ô) đọc từ ảnh Commons «Versailles-Chateau-FacadeJardin.jpg» (xem spec).
// ============================================================================
import * as THREE from 'three';
import { Acc, boxB, box, lathe, V, put, slabHoles, rectPts, archPts, opening, refends, pilaster, column, entab, band, balus, balusPath, potAFeu, trophy, statue, cartouche, keystone, agrafe, insetRoof, finishUV, ringFrame } from './fr-kit.js';

/** hệ tầng mặc định (06 §2 «Chiều cao tầng» — đã đối chiếu ảnh: nền ≈ 6,4 · tầng chính ≈ 9,3–10 · attic ≈ 4,3 · lan can ≈ 1,3) */
export const PAL = { G: 6.0, ped: 1.0, colH: 7.38, colD: 0.82, entH: 1.85, att: 4.4, balH: 1.2, proj: 1.8, wallT: 1.0, winW: 2.06, gW: 2.0, gH: 4.4, nH: 6.5, aW: 1.5, aH: 2.0 };
const PIER = { cor: 1.1, pil: 1.8, col: 1.8, pair: 3.0, W: 2.06, Wac: 2.86, N: 2.06, Wd: 2.86 };

/** mở rộng chuỗi viết tắt: 'cor W pil … [col W col] …' — [ … ] = avant-corps */
export function parseEls(str, widths = {}) {
  const out = []; let ac = false;
  for (const tok of str.trim().split(/\s+/)) {
    let t = tok; if (t.startsWith('[')) { ac = true; t = t.slice(1); } const close = t.endsWith(']'); if (close) t = t.slice(0, -1);
    if (t) out.push({ k: t, ac, w: widths[t] ?? PIER[t] });
    if (close) ac = false;
  }
  return out;
}
/** chuỗi phần tử vừa đúng chiều dài L (mặt hồi): góc + n ô + trụ */
export function fitEls(L, P = PAL, pierW = 1.8) {
  const n = Math.max(1, Math.floor((L - 2 * PIER.cor + pierW) / (P.winW + pierW))), pier = n > 1 ? (L - 2 * PIER.cor - n * P.winW) / (n - 1) : 0;
  const els = [{ k: 'cor', w: PIER.cor, side: -1 }]; for (let i = 0; i < n; i++) { if (i) els.push({ k: 'pil', w: pier }); els.push({ k: 'W', w: P.winW }); }
  els.push({ k: 'cor', w: (L - (2 * PIER.cor + n * P.winW + (n - 1) * pier)) + PIER.cor, side: 1 }); return els;
}

/**
 * MỘT MẶT ĐỨNG (khung cục bộ: tâm x = 0, mặt tường z = 0, ngoài +z, chân y = y0). o: { y0, P, statues (bool), door (index phần tử cửa vào), simple (mặt hồi: bỏ tượng) }
 * trả { L, xs (trục trụ), top }
 */
export function palaceFront(acc, els, o = {}) {
  const P = { ...PAL, ...(o.P || {}) }, y0 = o.y0 ?? 0, L = els.reduce((a, e) => a + e.w, 0);
  const yN = y0 + P.G, yA = yN + P.ped + P.colH, yAt = yA + P.entH, yB = yAt + P.att, D = P.colD, pw = D * 1.0;
  const zc = 0.16 + 0.5 * D + 0.32;                       // trục cột tự do trước mặt avant-corps
  const zEac = zc + 0.45 * D, zE = 0.16;                    // mặt entablature: thường / ressaut trên cột
  let x = -L / 2; const runs = []; let cur = null; const pierX = [];
  els.forEach((e, i) => {
    const xa = x, xb = x + e.w, xc = (xa + xb) / 2, zf = e.ac ? P.proj : 0; x = xb; e.xa = xa; e.xb = xb; e.xc = xc;
    if (!cur || cur.zf !== zf) { cur = { zf, xa, xb, piers: [], gh: [], nh: [], ah: [], door: null, eac: false }; runs.push(cur); }
    cur.xb = xb; if (e.k === 'col' || e.k === 'pair') cur.eac = true;
    const isWin = ['W', 'Wac', 'Wd'].includes(e.k), isPier = ['cor', 'pil', 'col', 'pair'].includes(e.k);
    // ---------------- TẦNG NỀN à refends: vòm có vành đá toả tia + đá khoá mascaron
    const gh = [];
    if (isWin) gh.push({ kind: 'arch', x: xc, y0: i === o.door ? y0 : y0 + 0.15, w: i === o.door ? 2.6 : P.gW, h: P.gH, door: i === o.door, glass: 'tileGlass4' });
    if (i === o.door) cur.door = [xc - 1.3, xc + 1.3];
    refends(acc, xa, xb, y0 + 0.55, yN - 0.5, zf, gh, { mask: true, vous: 0.5, tex: true, nv: 5 });
    for (const h of gh) opening(acc, h, zf, { reveal: 0.3 });
    cur.gh.push(...gh);
    // ---------------- TẦNG CHÍNH Ionic: cửa vòm cao có ban công con tiện, đá khoá + phù điêu; hốc tượng ở avant-corps giữa
    const nh = [];
    if (isWin) nh.push({ kind: 'arch', x: xc, y0: yN, w: P.winW, h: P.nH, glass: 'tileGlass' });
    if (e.k === 'N') nh.push({ kind: 'arch', x: xc, y0: yN + P.ped + 0.3, w: 1.5, h: 4.4, niche: true, nicheD: 0.55 });
    for (const h of nh) {
      opening(acc, h, zf, { reveal: 0.35, frame: { w: 0.2, d: 0.07 } });
      if (!h.niche) {
        balus(acc, xc - P.winW / 2, xc + P.winW / 2, yN, zf + 0.08, { h: P.ped, deW: 0.2, dep: 0.3, ends: false });
        agrafe(acc, xc, yN + P.nH - 0.35, yA - 0.05, zf, 0.62);
      } else { acc.add('stoneDk', boxB(0.9, 0.45, 0.5, xc, h.y0, zf - 0.3)); statue(acc, xc, h.y0 + 0.45, zf - 0.32, 2.4, i, 0, 'carve'); keystone(acc, xc, h.y0 + h.h + 0.05, zf, 0.45, 0.6, 0.15, true); }
    }
    cur.nh.push(...nh);
    // trụ: pilaster Ionic (bệ dé) · cột tự do trên bệ nhô (avant-corps) · tượng trên ressaut
    const px = e.k === 'pair' ? [xc - 1.0, xc + 1.0] : e.k === 'cor' ? [e.side > 0 ? xb - pw / 2 : xa + pw / 2] : isPier ? [xc] : [];
    for (const p of px) {
      acc.add('stoneDk', boxB(pw * 1.4, P.ped, 0.4, p, yN, zf + 0.2)); acc.add('stoneDk', boxB(pw * 1.5, 0.14, 0.48, p, yN + P.ped - 0.14, zf + 0.24));
      pilaster(acc, 'ionic', p, yN + P.ped, zf, P.colH, pw, 0.16);
      if (e.k === 'col' || e.k === 'pair') {
        acc.add('stoneDk', boxB(D * 1.42, P.ped, zc + 0.75 * D, p, yN, zf + (zc + 0.75 * D) / 2)); acc.add('stoneDk', boxB(D * 1.52, 0.14, zc + 0.85 * D, p, yN + P.ped - 0.14, zf + (zc + 0.85 * D) / 2));
        column(acc, 'ionic', p, yN + P.ped, zf + zc, P.colH, D, { seg: 10 });
        if (o.statues !== false) { acc.add('stoneDk', boxB(0.8, 0.4, 0.8, p, yAt, zf + zc)); statue(acc, p, yAt + 0.4, zf + zc, 2.5, Math.abs(Math.round(i * 3 + p * 0.7)), 0, 'carve'); }
      }
      pierX.push({ x: p, zf, ac: e.ac, k: e.k });
    }
    // ---------------- ATTIC Corinthian: cửa chữ nhật có khung, huy chương trên hốc
    const ah = isWin ? [{ kind: 'rect', x: xc, y0: yAt + 0.95, w: P.aW, h: P.aH, glass: 'tileGlass3' }] : [];
    for (const h of ah) opening(acc, h, zf, { reveal: 0.3, frame: { w: 0.16, d: 0.07, sill: true } });
    cur.ah.push(...ah);
    if (e.k === 'N') cartouche(acc, xc, yAt + 2.0, zf, 1.4, 1.4, 'carve', true);                   // huy chương «Bốn mùa»
    for (const p of px) pilaster(acc, 'corinthian', p, yAt + 0.5, zf, P.att - 0.5 - 0.8, 0.58, 0.12, { light: true });
    cur.piers.push(...px); cur.orn = cur.orn || []; if (e.k === 'pair') { cur.orn.push(xc); cur.pairs = (cur.pairs || []).concat([xc]); } else cur.orn.push(...px);
  });
  // ---------------- theo từng đoạn cùng mặt phẳng: tường (lỗ), chân, gờ tầng, entablature (ressaut trên avant-corps)
  for (const r of runs) {
    const t = P.wallT + r.zf, zEe = r.zf + (r.eac ? zEac : zE);
    acc.add('stoneRef', slabHoles(rectPts(r.xa, y0, r.xb, yN), r.gh.map((h) => archPts(h.x, h.y0, h.w, h.h)), r.zf, t));
    acc.add('stone', slabHoles(rectPts(r.xa, yN, r.xb, yAt), r.nh.map((h) => archPts(h.x, h.y0, h.w, h.h)), r.zf, t));
    acc.add('stone', slabHoles(rectPts(r.xa, yAt, r.xb, yB), r.ah.map((h) => rectPts(h.x - h.w / 2, h.y0, h.x + h.w / 2, h.y0 + h.h)), r.zf, t));
    for (const [a2, b2] of r.door ? [[r.xa, r.door[0]], [r.door[1], r.xb]] : [[r.xa, r.xb]]) acc.add('stoneDk', boxB(b2 - a2, 0.55, 0.3, (a2 + b2) / 2, y0, r.zf + 0.05));
    band(acc, r.xa, r.xb, yN - 0.5, 0.5, r.zf, 0.12);
    entab(acc, 'ionic', r.xa, r.xb, yA, zEe, P.entH, { dent: true, dep: zEe + P.wallT - 0.05 });
    band(acc, r.xa, r.xb, yAt, 0.5, r.zf, 0.1);
    entab(acc, 'corinthian', r.xa, r.xb, yB - 0.8, r.zf + 0.12, 0.8, { dep: P.wallT + r.zf - 0.1 });
  }
  // ---------------- LAN CAN mái + trụ đặc mang pot à feu / trophée; gãy khúc theo avant-corps (có đoạn quay về)
  let v = 0;
  runs.forEach((r, i) => {
    const zb = r.zf - 0.25, des = balus(acc, r.xa, r.xb, yB, zb, { h: P.balH, des: r.piers, dep: 0.45 });
    for (const c of r.pairs || []) { acc.add('stone', boxB(2.6, P.balH + 0.05, 0.55, c, yB, zb)); acc.add('stoneDk', boxB(2.75, 0.08, 0.65, c, yB + P.balH + 0.05, zb)); }
    for (const d of r.orn || []) {
      if (o.simple && v++ % 2) continue;
      const ends = r.orn[0] === d || r.orn[r.orn.length - 1] === d; // avant-corps: trophée lớn ở trụ đầu / cặp cột, pot à feu giữa (ảnh Commons)
      if (r.eac && (ends || (r.pairs || []).includes(d))) trophy(acc, d, yB + P.balH + 0.13, zb, (r.pairs || []).includes(d) ? 2.8 : 2.4, v++, 0); else potAFeu(acc, d, yB + P.balH + 0.13, zb, 1.7, v++);
    }
    if (i > 0 && runs[i - 1].zf !== r.zf) { const xj = r.xa, z0 = runs[i - 1].zf - 0.25, z1 = zb; balusPath(acc, [[xj + (r.zf > runs[i - 1].zf ? 0.25 : -0.25), Math.min(z0, z1)], [xj + (r.zf > runs[i - 1].zf ? 0.25 : -0.25), Math.max(z0, z1)]], yB, { h: P.balH }); }
  });
  return { L, yN, yA, yAt, yB, top: yB + P.balH, pierX, zc };
}

/** bóc phần tử theo chiều ngược (mặt sau đối xứng) */
const mirror = (els) => [...els].reverse().map((e) => ({ ...e, side: e.side ? -e.side : e.side }));

/**
 * CUNG ĐIỆN (khối thanh): spec { front (chuỗi phần tử), D, ph, P?, door: 'center', chapel?: {…} }.
 * Mặt trước (+z) và mặt sau (−z, hướng vườn trong game) dùng cùng ngữ pháp; hai mặt hồi rút gọn (trụ + ô, không cột tự do).
 */
export function frPalace(spec) {
  const acc = new Acc(), P = { ...PAL, ...(spec.P || {}) }, ph = spec.ph ?? 1.2, D = spec.D;
  const front = parseEls(spec.front); front[0].side = -1; front[front.length - 1].side = 1;
  const W = front.reduce((a, e) => a + e.w, 0);
  const doorIdx = Math.floor(front.length / 2);
  // thềm đá + bậc giữa trước / sau (06 main §3.1 «Thềm đá và bậc xuống Parterre»)
  const mF = 4.2, mS = 2.4, TW = W + 2 * mS, TD = D + 2 * mF;
  terraceFr(acc, TW, TD, ph, [{ side: 'z+', c: 0, w: 14 }, { side: 'z-', c: 0, w: 14 }]);
  // bốn mặt
  const fA = new Acc(); const r = palaceFront(fA, front, { y0: ph, P, door: doorIdx }); put(acc, fA, 0, 0, D / 2, 0);
  const bA = new Acc(); palaceFront(bA, mirror(front), { y0: ph, P }); put(acc, bA, 0, 0, -D / 2, Math.PI);
  for (const s of [1, -1]) { const eA = new Acc(); palaceFront(eA, fitEls(D, P), { y0: ph, P, simple: true }); put(acc, eA, s * W / 2, 0, 0, s * Math.PI / 2); }
  // ruột: sàn tầng chính, sàn attic, mái chì phẳng sau lan can, tường sống dọc (enfilade) có cửa
  const iw = W - 2 * P.wallT, id = D - 2 * P.wallT;
  acc.add('inside', boxB(iw, 0.5, id, 0, r.yN - 0.5, 0)); acc.add('inside', boxB(iw, 0.4, id, 0, r.yAt - 0.4, 0));
  acc.add('lead', boxB(W - 0.6, 0.35, D - 0.6, 0, r.yB - 0.2, 0));
  const doors = []; for (let x = -W / 2 + 8; x < W / 2 - 6; x += 12) doors.push(archPts(x, ph, 2.4, 4.0));
  acc.add('inside', slabHoles(rectPts(-iw / 2, ph, iw / 2, r.yN - 0.5), doors, 0.4, 0.8));
  // khối nhà nguyện (wingE — Chapelle Royale nhô cao sau mái)
  let top = r.top + 2.6;
  if (spec.chapel) top = Math.max(top, chapel(acc, spec.chapel, W, D, r.yB, P));
  finishUV(acc);
  const nst = Math.ceil(ph / 0.16), Lr = nst * 0.38;
  return { acc, info: { W, D, PW: TW, PD: TD + 2 * Lr, ph, colH: P.colH, colD: P.colD, eave: r.yB, top, kind: 'palace', storeys: 3 } };
}

/** thềm đá có gờ, bậc đá hai đầu có má (06 main §3.1) */
export function terraceFr(acc, W, D, h, stairs) {
  acc.add('stone', boxB(W, h - 0.2, D, 0, 0, 0)); acc.add('stoneDk', boxB(W + 0.3, 0.2, D + 0.3, 0, h - 0.2, 0)); acc.add('stoneDk', boxB(W + 0.16, 0.3, D + 0.16, 0, 0, 0));
  acc.plat({ x: 0, z: 0, w: W, d: D, top: h });
  for (const s of stairs) {
    const n = Math.max(1, Math.ceil(h / 0.16)), rise = h / n, run = 0.38, sg = s.side[1] === '+' ? 1 : -1, ax = s.side[0];
    for (let i = 0; i < n; i++) {
      const top = rise * (i + 1), off = (ax === 'z' ? D : W) / 2 + run * (n - i - 0.5);
      if (ax === 'z') { acc.add('stone', boxB(s.w, top, run, s.c, 0, sg * off)); acc.plat({ x: s.c, z: sg * off, w: s.w, d: run + 0.02, top }); }
      else { acc.add('stone', boxB(run, top, s.w, sg * off, 0, s.c)); acc.plat({ x: sg * off, z: s.c, w: run + 0.02, d: s.w, top }); }
    }
    const Lr = n * run; for (const e of [-1, 1]) { const g = boxB(0.6, h + 0.25, Lr + 0.3, 0, 0, 0); if (ax === 'z') { g.translate(s.c + e * (s.w / 2 + 0.3), 0, sg * ((ax === 'z' ? D : W) / 2 + Lr / 2)); } else { g.rotateY(Math.PI / 2); g.translate(sg * (W / 2 + Lr / 2), 0, s.c + e * (s.w / 2 + 0.3)); } acc.add('stoneDk', g); }
  }
}

/**
 * NHÀ NGUYỆN (Chapelle Royale — 06 wingE §3, §5.2): thân cao vượt mái cánh, cửa sổ vòm cao giữa pilaster Corinthian,
 * lan can có tượng trên gờ, mái chì dốc hai đầu (đầu đông bán nguyệt), gờ nóc dát vàng. c: { x (tâm theo trục cánh), len, w }
 */
function chapel(acc, c, W, D, yBase, P) {
  const len = c.len, w = c.w, x0 = c.x - len / 2, x1 = c.x + len / 2 - w / 2, r = w / 2;   // x1 = tâm bán nguyệt hậu cung
  const yb = yBase - 0.5, H = c.h, yC = yb + H, ent = 1.6, yE = yC - ent, pW = 0.75;
  // đường bao mặt bằng: chữ nhật đầu tây + nửa tròn đầu đông (5 cạnh)
  const outline = [[x0, -r], [x1, -r]]; for (let i = 1; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; outline.push([x1 + Math.cos(a) * r, Math.sin(a) * r]); } outline.push([x1, r], [x0, r]);
  // mỗi cạnh = một mặt đứng: ô cửa sổ vòm cao giữa pilaster
  for (let i = 0; i < outline.length; i++) {
    const [ax, az] = outline[i], [bx, bz] = outline[(i + 1) % outline.length], L = Math.hypot(bx - ax, bz - az), nb = Math.max(1, Math.round(L / 4.2)), f = new Acc();
    const holes = []; for (let b = 0; b < nb; b++) { const xc = -L / 2 + (L / nb) * (b + 0.5); holes.push({ kind: 'arch', x: xc, y0: yb + 1.4, w: 2.0, h: 6.0, glass: 'tileGlass' }); }
    f.add('stone', slabHoles(rectPts(-L / 2, yb, L / 2, yC), holes.map((h) => archPts(h.x, h.y0, h.w, h.h)), 0, 0.8));
    for (const h of holes) { opening(f, h, 0, { reveal: 0.3, frame: { w: 0.18, d: 0.06 } }); keystone(f, h.x, h.y0 + h.h + 0.05, 0, 0.45, 0.65, 0.16, false, 'carve'); }
    for (let b = 0; b <= nb; b++) pilaster(f, 'corinthian', -L / 2 + (L / nb) * b, yb + 0.6, 0, yE - yb - 0.6, pW, 0.22);
    band(f, -L / 2, L / 2, yb, 0.6, 0, 0.12);
    entab(f, 'corinthian', -L / 2, L / 2, yE, 0.22, ent, { mod: true, dep: 1.0 });
    const des = balus(f, -L / 2, L / 2, yC, -0.15, { h: 1.1, des: Array.from({ length: nb + 1 }, (_, b) => -L / 2 + (L / nb) * b) });
    des.forEach((d, k) => statue(f, d, yC + 1.18, -0.15, 2.2, k + i, 0));
    put(acc, f, (ax + bx) / 2, 0, (az + bz) / 2, Math.atan2(-(bz - az), bx - ax) + Math.PI);
  }
  acc.add('inside', boxB(x1 - x0, 0.4, w - 1, (x0 + x1) / 2, yE - 0.4, 0));
  // mái chì dốc ≈ 50° + gờ nóc chì dát vàng (crête)
  const roof = insetRoof(acc, outline.map(([x, z]) => [x, z]).reverse(), yC + 1.1, [[-0.4, 0], [r - 0.6, r * 1.15]], 'tileLead', 'leadDome');
  const xr0 = x0 + r - 0.6; acc.add('gilt', boxB(x1 - xr0, 0.5, 0.35, (xr0 + x1) / 2, roof.top, 0));
  for (let x = xr0 + 0.8; x < x1 - 0.4; x += 1.6) potAFeu(acc, x, roof.top + 0.45, 0, 0.9, 1, 'gilt');
  potAFeu(acc, x1 + 0.6, roof.top + 0.45, 0, 1.6, 0, 'gilt');
  return roof.top + 2.0;
}
