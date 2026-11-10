// ============================================================================
//  DI CHUYỂN TỰ DO (thuần JS — main.js gọi mỗi khung, test Node dùng được):
//   · chạy nhanh (Shift, tốn thể lực) · nhảy (Space) + khinh công nhảy hai lần trên không · giữ Space khi rơi = lượn
//     (rơi chậm, lướt xa)
//   · NƯỚC (water.js, 2026-11-10): sâu 0,5–1,3 m → LỘI (chậm 0,6, không chạy); sâu hơn → BƠI: nổi nhấp nhô theo
//     mặt sóng (lò xo + cản, đầu nhô 1 m), vận tốc có quán tính so với nước, DÒNG CHẢY cuốn theo (bơi thường ngược
//     dòng giữa sông gần như đứng yên, gắng sức mới tiến), tốn thể lực; kiệt sức thì chỉ nổi trôi theo dòng, không
//     chìm. Lên bờ: bậc ≤ 1,4 m bước lên; kè 1,4–2,4 m phải đu người trèo (tốn 12 thể lực). Gầm cầu bơi qua được.
//   · LEO BÁM (thành viên VIP): đi vào tường / nhà / tháp / cây là tự đu bám leo lên, tới đỉnh thì bước lên mái;
//     đứng / đi trên mái, mặt thành; bước ra mép là rơi (lượn được). Vách núi dốc cũng leo được.
//   · ngự kiếm phi hành (F) do main.js giữ như cũ — ở đây chỉ xử lý khi không ngự kiếm.
//  Cao độ tuyệt đối người chơi: p.y3 (m). p.alt = y3 − mặt đất dưới chân (render3d / mạng dùng).
// ============================================================================
import * as T from './terrain.js';
import { platformTop, blockedByBuilding, tallTopAt } from './obstacles.js';
import { inCourt } from './court.js';
import { waterAt, waveHeight, waterTime } from './water.js';
import { clearanceAt } from './bridges.js';

export const G = 20, JUMP_V = 7.2, JUMP2_V = 8.4, GLIDE_FALL = 2.2, CLIMB_V = 3.2, STEP_UP = 0.65;
export const SPRINT = 1.9, GLIDE_SPEED = 2.1, STAMINA_MAX = 100;
export const WADE = { min: 0.5, max: 1.3, speed: 0.6 };   // lội: độ sâu (m), hệ số tốc độ
export const SWIM_V = 1.4, SWIM_SPRINT_V = 2.4;          // bơi so với nước (m/s): thường / gắng sức
export const FLOAT = 1.0, SHORE_STEP = 1.4, SHORE_HAUL = 2.4; // đầu nhô khỏi mặt nước; bậc bước lên bờ; kè đu trèo
export const SWIM = SWIM_V / 5.6;                          // (tương thích: tỉ lệ so với tốc độ đi bộ chuẩn)

/** mặt đất (địa hình / nền / sân) tại (x, z) — y: cao độ người (bỏ qua mặt cầu cao hơn đầu khi ở dưới gầm) */
export function groundHeight(x, z, y = null) {
  const p = platformTop(x, z, y);
  if (inCourt(x, z)) return p ?? 0;
  return Math.max(T.heightAt(x, z), p ?? -1e9);
}
/** nước tại (x, z) với người ở cao độ y: null nếu khô hoặc đang đứng trên nền (cầu, bậc) cao hơn mặt nước;
 *  { level (mặt sóng lúc này), still (mực tĩnh), floor, depth, flow, kind } */
export function waterHere(x, z, y = null, t = waterTime()) {
  const w = waterAt(x, z); if (!w) return null;
  const floor = groundHeight(x, z, y);
  const amp = w.kind === 'river' || w.kind === 'lake' ? w.amp : w.amp * Math.min(1, w.depth / 1.5);
  const level = w.level + waveHeight(x, z, t, amp);
  if (floor >= level) return null;
  return { level, still: w.level, floor, depth: level - floor, flow: w.flow, kind: w.kind };
}
/** mực nước tại (x, z) hoặc null (tương thích cũ) */
export function waterLevelAt(x, z, y = null) { return waterHere(x, z, y)?.level ?? null; }
/** đáy đứng được tại (x, z) ứng với cao độ hiện tại y: { floor, solid, top, water } */
export function surfaceAt(x, z, y) {
  const g = groundHeight(x, z, y), solid = blockedByBuilding(x, z);
  let top = solid ? tallTopAt(x, z) : null;
  if (solid && top == null) top = g + 1.2; // vật cản nhỏ chưa biết độ cao (đèn đá, đồ đạc): coi như cao 1,2 m
  const wh = waterHere(x, z, y);
  // đứng trên công trình khi đã ở cao hơn đỉnh của nó (mái, mặt thành)
  const onTop = solid && top <= y + STEP_UP;
  return { ground: g, floor: onTop ? Math.max(g, top) : g, solid, top, onTop, water: wh?.level ?? null, wh };
}

/**
 * Một bước di chuyển. p: { x, z (m), y3, vy, air, jumps, climb, swim, stamina } (đổi tại chỗ)
 * input: { dx, dz (hướng thế giới đã chuẩn hoá, 0 nếu đứng), mag, sprint, jump (vừa bấm), hold (đang giữ Space), canClimb }
 * Trả { moved, blockedMsg }
 */
export function moveFree(p, input, dt, baseSpeed) {
  if (p.y3 == null) { p.y3 = groundHeight(p.x, p.z); p.vy = 0; p.stamina = STAMINA_MAX; p.jumps = 0; }
  const here = surfaceAt(p.x, p.z, p.y3);
  const wh = here.wh;
  const wasSwim = p.swim;
  // ĐẠP NƯỚC (P14): input.ww = phép (movement.js) — mặt sóng thành mặt đi được; hết thể lực (thân pháp) thì mất phép tới khi lên bờ
  if (!wh) p.wwLost = false;
  const ww = input.ww && !p.wwLost && !p.climb ? input.ww : null;
  p.waterWalk = !!(ww && wh && wh.depth > 0.15);
  if (p.waterWalk && wasSwim) p.splash = (p.splash || 0) + 1;
  p.swim = !p.waterWalk && !!wh && wh.depth > WADE.max && p.y3 <= wh.level + 0.3 && !p.climb;
  p.wade = !!wh && !p.swim && !p.air && wh.depth > WADE.min;
  if (p.swim && !wasSwim) { p.svx = (p.svx || 0) * 0.3; p.svz = (p.svz || 0) * 0.3; p.splash = (p.splash || 0) + 1; } // rơi / bước xuống nước sâu
  const moving = input.dx || input.dz;
  // thể lực: chạy nhanh / bơi nhanh / leo tốn, đứng nghỉ hồi
  const sprinting = input.sprint && moving && p.stamina > 1 && !p.wade;
  if (sprinting || p.climb) p.stamina = Math.max(0, p.stamina - dt * (p.climb ? 9 : 14));
  else if (p.swim) p.stamina = moving ? Math.max(0, p.stamina - dt * 2.2) : Math.min(p.staminaCap ?? STAMINA_MAX, p.stamina + dt * 3); // bơi tốn sức; nổi yên hồi chậm
  else if (p.waterWalk && ww.stamina) { p.stamina = Math.max(0, p.stamina - ww.stamina * dt); if (p.stamina <= 0) { p.wwLost = true; p.waterWalk = false; p.splash = (p.splash || 0) + 1; } } // thân pháp tốn 2–2,5 / giây
  else p.stamina = Math.min(p.staminaCap ?? STAMINA_MAX, p.stamina + dt * (p.air ? 4 : 18)); // trần thể lực theo Tỉnh (life.mods)
  if (p.staminaCap != null && p.stamina > p.staminaCap) p.stamina = p.staminaCap;
  // nhảy / khinh công
  if (input.jump) {
    if (p.climb) { p.climb = null; p.vy = JUMP_V; p.air = true; p.jumps = 1; } // bật khỏi tường
    else if (!p.air || p.swim) { p.vy = p.swim ? JUMP_V * 0.75 : JUMP_V; p.air = true; p.jumps = 1; p.swim = false; }
    else if (p.jumps < 2 && p.stamina > 8) { p.vy = JUMP2_V; p.jumps = 2; p.stamina -= 8; } // nhảy hai lần (khinh công)
  }
  const gliding = p.air && input.hold && p.vy < 0 && p.stamina > 0.5;
  if (gliding) p.stamina = Math.max(0, p.stamina - dt * 3);
  let speed = baseSpeed * (sprinting ? SPRINT : 1) * (p.wade && !p.waterWalk ? WADE.speed : 1) * (gliding ? GLIDE_SPEED : 1) * (p.waterWalk ? ww.speed : 1) * (input.mag || 1);
  let moved = false, blockedMsg = null;
  // bơi: vận tốc so với nước tiến dần về vận tốc muốn (quán tính, cản nước), cộng dòng chảy → bước dịch chuyển
  let swimStep = null;
  if (p.swim) {
    const tired = p.stamina <= 0.5, v = tired ? 0 : (sprinting ? SWIM_SPRINT_V : SWIM_V) * (input.mag || 1);
    const tx = moving ? input.dx * v : 0, tz = moving ? input.dz * v : 0, k = Math.min(1, dt * (moving ? 2.6 : 1.4));
    p.svx = (p.svx || 0) + (tx - (p.svx || 0)) * k; p.svz = (p.svz || 0) + (tz - (p.svz || 0)) * k;
    const fx = wh.flow.x, fz = wh.flow.z;
    swimStep = { x: (p.svx + fx) * dt, z: (p.svz + fz) * dt };
  } else { p.svx = 0; p.svz = 0; }
  const want = swimStep ? Math.hypot(swimStep.x, swimStep.z) > 1e-5 : moving;
  if (want && !p.climb) {
    const nx = p.x + (swimStep ? swimStep.x : input.dx * speed * dt), nz = p.z + (swimStep ? swimStep.z : input.dz * speed * dt);
    const tryMove = (tx, tz) => {
      if (Math.hypot(tx, tz) > T.EDGE + 20) return false; // mép thế giới (biển mây)
      const s = surfaceAt(tx, tz, p.y3);
      const rise = s.floor - p.y3;
      if (p.swim) {
        if (clearanceAt(tx, tz) < 1.1) return false; // tường cầu / trụ: chỉ bơi qua lòng vòm
        if (s.solid && !s.onTop) return false;
        if (rise <= 0 || s.wh) { p.x = tx; p.z = tz; return true; } // vẫn trong nước (đáy dốc lên dần → tự đứng dậy lội)
        if (!moving) return false; // trôi theo dòng không tự leo bờ
        if (rise <= SHORE_STEP) { p.x = tx; p.z = tz; p.y3 = s.floor; p.swim = false; p.vy = 0; return true; } // bước lên bậc / bãi
        if (rise <= SHORE_HAUL && p.stamina > 12) { p.x = tx; p.z = tz; p.y3 = s.floor; p.swim = false; p.vy = 0; p.stamina -= 12; return true; } // đu người trèo kè
        blockedMsg = 'bank'; return false;
      }
      if (s.solid && !s.onTop) { // vướng công trình cao hơn: leo (VIP) hoặc dừng
        if (input.canClimb && p.stamina > 2) { p.climb = { top: s.top, dx: input.dx, dz: input.dz }; p.air = false; p.vy = 0; }
        else blockedMsg = 'climb';
        return false;
      }
      if (rise > STEP_UP && !p.air) { // bậc / vách địa hình quá cao
        if (input.canClimb && p.stamina > 2) { p.climb = { top: s.floor, dx: input.dx, dz: input.dz, terrain: true }; p.vy = 0; }
        else blockedMsg = 'climb';
        return false;
      }
      if (p.air && s.floor > p.y3 + 0.3) return false; // đang ở trên không: không lao vào chỗ cao hơn mình
      p.x = tx; p.z = tz; return true;
    };
    if (tryMove(nx, nz)) moved = true;
    else if (!p.climb && tryMove(nx, p.z)) moved = true;
    else if (!p.climb && tryMove(p.x, nz)) moved = true;
  }
  // leo bám: lên dần theo vách; tới đỉnh thì bước lên; nhả hướng đi (hoặc hết sức) thì tuột xuống
  if (p.climb) {
    const pushing = moving && (input.dx * p.climb.dx + input.dz * p.climb.dz) > 0.3;
    if (!pushing || p.stamina <= 0) { p.climb = null; p.air = true; p.vy = 0; }
    else {
      p.y3 += CLIMB_V * (sprinting ? 1.5 : 1) * dt;
      if (p.y3 >= p.climb.top + 0.05) { // tới đỉnh: bước lên mép
        const tx = p.x + p.climb.dx * 0.9, tz = p.z + p.climb.dz * 0.9;
        p.y3 = p.climb.top + 0.05; p.x = tx; p.z = tz; p.climb = null; p.air = false; p.vy = 0;
      }
      moved = true;
    }
  }
  // trọng lực / chạm đất / bơi
  if (!p.climb) {
    const s = surfaceAt(p.x, p.z, p.y3 + 0.05), w2 = s.wh;
    if (p.waterWalk && w2 && p.vy <= 0 && p.y3 <= w2.level + 0.06) {
      // đứng / đi trên đúng mặt sóng (+2 cm); dòng chảy đẩy nhẹ 30% vận tốc dòng
      p.y3 = w2.level + 0.02; p.vy = 0; p.air = false; p.jumps = 0; p.swim = false; p.wade = false;
      const nx2 = p.x + w2.flow.x * 0.3 * dt, nz2 = p.z + w2.flow.z * 0.3 * dt;
      if (!blockedByBuilding(nx2, nz2)) { p.x = nx2; p.z = nz2; }
    } else if (w2 && w2.depth > WADE.max && p.y3 <= w2.level + 0.3 && (p.vy <= 0 || p.swim)) {
      // nổi: lò xo + cản về «mặt sóng − 1 m» (nhấp nhô theo sóng); rơi từ cao xuống thì chìm sâu rồi trồi lên
      if (!p.swim) p.splash = (p.splash || 0) + 1;
      p.swim = true; p.wade = false; p.air = false; p.jumps = 0;
      const target = w2.level - FLOAT;
      p.vy = (p.vy || 0) + ((target - p.y3) * 16 - (p.vy || 0) * 5.5) * dt;
      p.y3 += p.vy * dt;
      if (p.y3 < w2.floor + 0.1) { p.y3 = w2.floor + 0.1; p.vy = Math.max(0, p.vy); }
    } else if (p.y3 > s.floor + 0.02 || p.vy > 0) {
      const fl = p.waterWalk && w2 ? Math.max(s.floor, w2.level + 0.02) : s.floor; // đạp nước: rơi xuống thì đáp trên mặt sóng
      p.air = true;
      p.vy -= G * dt;
      if (gliding) p.vy = Math.max(p.vy, -GLIDE_FALL);
      p.y3 += p.vy * dt;
      if (p.y3 <= fl) { p.y3 = fl; p.vy = 0; p.air = false; p.jumps = 0; }
    } else { p.y3 = s.floor; p.vy = 0; p.air = false; p.jumps = 0; }
  }
  p.gliding = gliding;
  { const w3 = waterHere(p.x, p.z, p.y3 - 0.05); p.wade = !p.swim && !p.waterWalk && !p.air && !!w3 && w3.depth > WADE.min; p.waterY = w3 ? w3.level : null; }
  p.alt = p.y3 - groundHeight(p.x, p.z, p.y3);
  return { moved, blockedMsg };
}
