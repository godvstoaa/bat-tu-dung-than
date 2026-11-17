// ============================================================================
//  LẦU CHÍNH 10 TẦNG + VỌNG ĐÀI (thuần JS, tất định — docs/TIEN-PHU-MANIFEST.md §3, §4).
//  Khung cục bộ lầu: gốc = tâm lầu trên mặt đảo (y = 0), +z = mặt tiền. Mặt bằng đa giác đều n cạnh (4 / 8 / 16), cạnh
//  phẳng nằm trên trục (pháp tuyến cạnh k: góc 2πk/n), nửa cạnh (apothem) a.
//  towerSpec(style) → { FH, floors[0..9], deck, podium, stairs, pad, … }  ·  towerCollision(spec) → nền / hố / vật cản
//  (CÙNG một đặc tả cho build3d dựng hình — không có vật cản «vẽ tay»).
// ============================================================================
export const FH = 5.0;                 // sàn tới sàn (Himeji ≈ 5,2 · Hiển Lâm Các ≈ 5,7)
export const SLAB = 0.4;               // dày sàn
export const RISERS = 29, RISE = FH / RISERS, TREAD = 0.30, STAIR_W = 2.0;   // 0,1724 m · 2R + T = 0,645 (Blondel)
export const RUN = (RISERS - 1) * TREAD;  // 8,4 m
export const WALL_T = 0.6, DOOR_W = 2.4, GUARD = 1.1, RAIL = 0.9, PAD_R = 1.3;
export const LEVELS = 10;

/** góc pháp tuyến cạnh k */
const nrm = (n, k) => (2 * Math.PI * k) / n;
/** đỉnh đa giác (n cạnh, apothem a) — đỉnh k nằm giữa cạnh k và k + 1 */
export function polyVerts(n, a) {
  const r = a / Math.cos(Math.PI / n), out = [];
  for (let k = 0; k < n; k++) { const t = nrm(n, k) + Math.PI / n; out.push([Math.cos(t) * r, Math.sin(t) * r]); }
  return out;
}
/** |x| lớn nhất còn trong đa giác ở cao độ z (cục bộ) */
export function insideX(n, a, z) {
  let best = Infinity; const az = Math.abs(z);
  for (let k = 0; k < n; k++) { const t = nrm(n, k), c = Math.cos(t), s = Math.sin(t); if (c > 1e-6 && s >= -1e-6) best = Math.min(best, (a - az * s) / c); }
  return best;
}
/** điểm (x, z) trong đa giác n cạnh apothem a (lề m) */
export function insidePoly(n, a, x, z, m = 0) {
  for (let k = 0; k < n; k++) { const t = nrm(n, k); if (x * Math.cos(t) + z * Math.sin(t) > a - m) return false; }
  return true;
}
/** các cạnh đa giác: [{ k, x0, z0, x1, z1, mx, mz, len, ry (quay hộp theo cạnh), front, back, side }] */
export function polySides(n, a) {
  const v = polyVerts(n, a), out = [];
  for (let k = 0; k < n; k++) {
    const [x0, z0] = v[(k + n - 1) % n], [x1, z1] = v[k];
    const t = nrm(n, k), nx = Math.cos(t), nz = Math.sin(t);
    out.push({ k, x0, z0, x1, z1, mx: (x0 + x1) / 2, mz: (z0 + z1) / 2, len: Math.hypot(x1 - x0, z1 - z0), ry: Math.atan2(-(z1 - z0), x1 - x0), nx, nz, front: nz > 0.99, back: nz < -0.99 });
  }
  return out;
}

/** đặc tả lầu theo phong cách (styles.js › tower) */
export function towerSpec(style) {
  const T = style.tower, n = T.n, P = T.podium;
  const floors = [];
  for (let k = 0; k < LEVELS; k++) {
    const a = T.a[k], y = P + k * FH;
    const gal = T.gal.includes(k);
    // bậc lùi (Art Deco): sàn tầng này phủ hết mái tầng dưới thành sân thượng
    const prevA = k ? T.a[k - 1] : a;
    const bd = gal ? (T.setback ? Math.max(2.4, prevA - a) : T.bd) : 0;
    const slabA = a + (gal ? bd : 0.25);
    floors.push({ k, y, a, gal, bd, slabA, side: k % 2 ? 1 : -1 });
  }
  const top = floors[LEVELS - 1];
  const deckY = P + LEVELS * FH, deckA = top.a;
  // đĩa thang phép: giữa phía sau, thẳng đứng qua mọi tầng (theo tầng nhỏ nhất)
  const aMin = Math.min(...T.a, deckA);
  const pad = { x: 0, z: -Math.max(3.5, aMin * 0.62 - 1.2), r: PAD_R };
  // cầu thang: tầng k (đi từ tầng k lên k + 1) dọc vách bên side (−1 trái / +1 phải), chân ở +RUN/2 (phía trước), đỉnh ở −RUN/2
  const stairs = floors.map((f) => {
    // vừa trong vách CẢ tầng này lẫn tầng trên (bậc lùi / thu nhỏ: đầu thang đến nằm trong tầng trên)
    const aFit = Math.min(f.a, f.k + 1 < LEVELS ? floors[f.k + 1].a : deckA);
    const xin = insideX(n, aFit, RUN / 2 + 1.2) - WALL_T / 2 - 0.35; // mép trong vách ở hai đầu thang (+ lề thân người)
    const xc = f.side * (xin - STAIR_W / 2);
    return { k: f.k, y0: f.y, y1: f.y + FH, x: xc, xi: xc - f.side * STAIR_W / 2, z0: RUN / 2, z1: -RUN / 2, w: STAIR_W, side: f.side };
  });
  // podium (thềm lầu): vuông bao tầng 1 + hành lang + 4 m; bậc lên ở mặt trước
  const pa = Math.max(floors[0].slabA + 4, floors[0].a + 6);
  const podium = { y: P, a: pa, kind: T.podiumKind, stairW: Math.min(10, pa * 0.45), steps: Math.max(1, Math.ceil(P / 0.16)) };
  podium.rise = P / podium.steps; podium.tread = P > 5 ? 0.32 : 0.36; podium.run = podium.steps * podium.tread;
  const columns = !!(T.colonnade || T.column), colStep = T.colonnade ? 3.0 : 3.6;
  return { style: style.id, n, FH, floors, stairs, pad, deck: { y: deckY, a: deckA }, podium, crown: T.crown, turrets: T.turrets || 0, columns, colStep, height: deckY + 4 };
}

/** dải thang tầng k dưới dạng hình chữ nhật cục bộ */
export const stairRect = (s) => ({ x: s.x, z: 0, hw: s.w / 2 + 0.1, hd: RUN / 2 + 0.05 });

/**
 * Hình học va chạm của lầu (cục bộ lầu): { plats: [{x,z,w,d,ry,top,bot,base}], pits: [{x,z,hw,hd,y0,y1,rect}],
 *  s3: [{x,z,hw,hd,ry,y0,y1}], s2: [{x,z,hw,hd,ry}], tall: [{x,z,hw,hd,ry,top}] }
 */
export function towerCollision(spec) {
  const plats = [], pits = [], s3 = [], s2 = [], tall = [];
  const { n, floors, stairs, podium, deck } = spec;
  // thềm (podium): khối đặc tới mặt thềm; bậc lên mặt trước
  plats.push({ x: 0, z: 0, w: 2 * podium.a, d: 2 * podium.a, ry: 0, top: podium.y, bot: -1, base: false });
  for (let i = 1; i <= podium.steps; i++) {
    const z = podium.a + podium.run - (i - 0.5) * podium.tread;
    plats.push({ x: 0, z, w: podium.stairW, d: podium.tread + 0.02, ry: 0, top: i * podium.rise, bot: -1 });
  }
  // mép thềm: lan can / tường chắn (chừa miệng bậc) — vật cản 2D quanh thân thềm (không trèo hông), đỉnh = mặt thềm + 1,1
  const pe = podium.a, sw = podium.stairW / 2;
  const edge = (x, z, hw, hd) => { s2.push({ x, z, hw, hd, ry: 0 }); tall.push({ x, z, hw, hd, ry: 0, top: podium.y + GUARD }); };
  edge(0, -pe, pe, 0.35); edge(-pe, 0, 0.35, pe); edge(pe, 0, 0.35, pe);
  edge(-(pe + sw) / 2, pe, (pe - sw) / 2, 0.35); edge((pe + sw) / 2, pe, (pe - sw) / 2, 0.35);
  // hai bên bậc thềm (thành bậc)
  for (const sx of [-1, 1]) { const zc = pe + podium.run / 2; s2.push({ x: sx * (sw + 0.35), z: zc, hw: 0.35, hd: podium.run / 2, ry: 0 }); tall.push({ x: sx * (sw + 0.35), z: zc, hw: 0.35, hd: podium.run / 2, ry: 0, top: podium.y * 0.5 + 1 }); }

  floors.forEach((f, idx) => {
    const yTop = f.y + FH - SLAB; // trần tầng
    // sàn tầng (tầng 0 = mặt thềm đã có) — base: lỗ thang khoét được
    if (idx > 0) polyPlatsSafe(plats, n, f.slabA, f.y);
    // lỗ thang của tầng dưới khoét qua sàn tầng này
    if (idx > 0) { const s = stairs[idx - 1], r = stairRect(s); pits.push({ x: r.x, z: r.z, hw: r.hw, hd: r.hd, ry: 0, rect: true, y0: f.y - 0.05, y1: f.y + 0.05 });
      // lan can quanh lỗ: cạnh trong + đầu xa (phía trước); đầu sau là lối lên
      s3.push({ x: s.xi - s.side * 0.12, z: 0, hw: 0.08, hd: RUN / 2, ry: 0, y0: f.y, y1: f.y + GUARD });
      s3.push({ x: s.x, z: RUN / 2 + 0.08, hw: s.w / 2 + 0.1, hd: 0.08, ry: 0, y0: f.y, y1: f.y + GUARD });
    }
    // vách đa giác: khe cửa giữa mặt trước / sau (tầng 0 luôn có cửa chính; tầng có hành lang: cả trước lẫn sau)
    for (const sd of polySides(n, f.a)) {
      const door = (sd.front && (idx === 0 || f.gal)) || (sd.back && f.gal);
      const pieces = door ? [[-sd.len / 2, -DOOR_W / 2], [DOOR_W / 2, sd.len / 2]] : [[-sd.len / 2, sd.len / 2]];
      const ux = (sd.x1 - sd.x0) / sd.len, uz = (sd.z1 - sd.z0) / sd.len;
      for (const [u0, u1] of pieces) {
        if (u1 - u0 < 0.05) continue;
        const um = (u0 + u1) / 2;
        s3.push({ x: sd.mx + ux * um, z: sd.mz + uz * um, hw: (u1 - u0) / 2 + 0.05, hd: WALL_T / 2, ry: sd.ry, y0: f.y - 0.1, y1: yTop });
      }
    }
    // hành lang ngoài: lan can mép sàn (đa giác apothem slabA − 0,15) — không khe
    // hành lang ngoài: lan can mép sàn — tầng 1 (trên thềm) chừa lối giữa trước / sau ra thềm
    if (f.gal) for (const sd of polySides(n, f.slabA - 0.15)) {
      const ux = (sd.x1 - sd.x0) / sd.len, uz = (sd.z1 - sd.z0) / sd.len, open = idx === 0 && (sd.front || sd.back);
      for (const [u0, u1] of open ? [[-sd.len / 2, -2.2], [2.2, sd.len / 2]] : [[-sd.len / 2, sd.len / 2]]) {
        const um = (u0 + u1) / 2; if (u1 - u0 < 0.05) continue;
        s3.push({ x: sd.mx + ux * um, z: sd.mz + uz * um, hw: (u1 - u0) / 2 + 0.05, hd: 0.12, ry: sd.ry, y0: f.y, y1: f.y + GUARD });
      }
    }
    // cầu thang tầng này: mỗi bậc một nền mỏng; gầm thang thấp (< 2,1 m) đặc; lan can cạnh trong
    const s = stairs[idx];
    for (let i = 1; i < RISERS; i++) {
      const top = f.y + i * RISE, z = s.z0 - (i - 0.5) * TREAD;
      plats.push({ x: s.x, z, w: s.w, d: TREAD + 0.01, ry: 0, top, bot: top - 0.25 });
      if (top - f.y < 2.1 && top - 0.25 > f.y + 0.05) s3.push({ x: s.x, z, hw: s.w / 2, hd: TREAD / 2, ry: 0, y0: f.y, y1: top - 0.25 });
    }
    for (let i = 2; i < RISERS; i += 3) {
      const top = f.y + i * RISE, z = s.z0 - (i - 0.5) * TREAD;
      s3.push({ x: s.xi - s.side * 0.12, z, hw: 0.07, hd: TREAD * 1.6, ry: 0, y0: top - 0.15, y1: top + RAIL }); // ngoài mép trong dải thang
    }
    // cột tròn hàng hiên (hành lang có hàng cột: Trung Hoa, Huế, tân cổ điển): cột ở mép ngoài hành lang
    if (f.gal && spec.columns) for (const c of columnRing(n, f.slabA - 0.7, spec.colStep)) s3.push({ x: c[0], z: c[1], hw: 0.46, hd: 0.46, ry: 0, y0: f.y, y1: f.y + FH - SLAB }); // chân cột Ø ≈ 0,9 m (geo.columnGeo)
  });
  // Vọng Đài: sàn mở + lan can vòng; lỗ thang tầng 10
  polyPlatsSafe(plats, n, deck.a + 0.25, deck.y);
  { const s = stairs[LEVELS - 1], r = stairRect(s); pits.push({ x: r.x, z: r.z, hw: r.hw, hd: r.hd, ry: 0, rect: true, y0: deck.y - 0.05, y1: deck.y + 0.05 });
    s3.push({ x: s.xi - s.side * 0.12, z: 0, hw: 0.08, hd: RUN / 2, ry: 0, y0: deck.y, y1: deck.y + GUARD });
    s3.push({ x: s.x, z: RUN / 2 + 0.08, hw: s.w / 2 + 0.1, hd: 0.08, ry: 0, y0: deck.y, y1: deck.y + GUARD }); }
  for (const sd of polySides(n, deck.a + 0.05)) s3.push({ x: sd.mx, z: sd.mz, hw: sd.len / 2 + 0.05, hd: 0.12, ry: sd.ry, y0: deck.y, y1: deck.y + GUARD });
  // thân lầu (2D, cho người dưới đất / dân phố / camera): chỉ vành vách tầng 1, khe cửa chính đã chừa trong s3 — ở mặt đất
  // người đứng trên thềm (y = podium) nên vách tầng 1 (s3) đã chặn; đỉnh leo được = mái đỉnh
  tall.push({ x: 0, z: 0, hw: floors[0].a, hd: floors[0].a, ry: 0, top: spec.height });
  return { plats, pits, s3, s2, tall };
}
/** sàn đa giác đều (n cạnh, apothem a) — obstacles.addPolyPlatform; base: lỗ thang (hố có khoảng cao) khoét được */
function polyPlatsSafe(plats, n, a, top) { plats.push({ poly: true, x: 0, z: 0, n, a, ry: 0, top, bot: top - SLAB, base: true }); }
/** vị trí cột quanh đa giác (apothem a), bước ~step m, có cột ở mỗi đỉnh; chừa khe cửa trước / sau */
export function columnRing(n, a, step = 3.2) {
  const out = [], v = polyVerts(n, a);
  for (let k = 0; k < n; k++) {
    const [x0, z0] = v[k], [x1, z1] = v[(k + 1) % n], len = Math.hypot(x1 - x0, z1 - z0), m = Math.max(1, Math.round(len / step));
    for (let i = 0; i < m; i++) {
      const t = i / m, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
      if (Math.abs(x) < DOOR_W && Math.abs(Math.abs(z) - a) < 0.6) continue; // trước cửa
      out.push([x, z]);
    }
  }
  return out;
}
/** vùng bài trí của tầng k (cục bộ lầu): hình chữ nhật nội tiếp + vùng chừa (thang, lỗ thang, đĩa thang phép, lối cửa) */
export function floorZone(spec, k) {
  const f = k < LEVELS ? spec.floors[k] : { a: spec.deck.a, y: spec.deck.y, gal: false };
  const half = spec.n === 4 ? f.a - WALL_T / 2 - 0.2 : f.a * 0.68;
  const keep = [];
  const st = spec.stairs[Math.min(k, LEVELS - 1)];
  if (k < LEVELS) keep.push({ x: st.x, z: 0, w: st.w + 1.2, d: RUN + 2.4 });                 // thang đi lên
  if (k > 0) { const sb = spec.stairs[k - 1]; keep.push({ x: sb.x, z: 0, w: sb.w + 1.2, d: RUN + 2.4 }); } // lỗ thang từ dưới
  keep.push({ x: spec.pad.x, z: spec.pad.z, w: spec.pad.r * 2 + 1.6, d: spec.pad.r * 2 + 1.6 });  // thang phép
  keep.push({ x: 0, z: half - 1.6, w: 3.2, d: 3.4 });                                            // lối cửa trước
  if (f.gal) keep.push({ x: 0, z: -half + 1.6, w: 3.2, d: 3.4 });                                 // lối cửa sau
  return { half, y: f.y, keep };
}
