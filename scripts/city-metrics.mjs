// ============================================================================
//  CHỈ SỐ QUY HOẠCH (docs/THANH-MANIFEST.md) — in từng chỉ số V, thoát mã 1 khi trượt.
//    node scripts/city-metrics.mjs
// ============================================================================
import * as C from '../src/game/citylayout.js';
import { allHouses, renderHouses, isRemoved } from '../src/game/city4.js';

const H = allHouses().filter((h) => !isRemoved(h.id));
const R = new Map(renderHouses().map((r) => [r.key, r]));
const B = new Map(C.blocks().map((b) => [b.id, b]));
const results = [];
const V = (name, value, ok, note = '') => { results.push({ name, value, ok, note }); };
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 100);

// 3.2 góc vát: lô dọc cạnh (không phải nhà góc / Phố Thầy Bói) cách đỉnh góc ≥ CHAMFER
{
  let n = 0, bad = 0;
  for (const h of H) {
    if (h.angle || h.front === 'boi' || h.edge == null) continue;
    const b = B.get(h.block), P = b.poly[h.edge], Q = b.poly[(h.edge + 1) % 4], L = Math.hypot(Q.x - P.x, Q.z - P.z), tx = (Q.x - P.x) / L, tz = (Q.z - P.z) / L;
    const along = (h.x - P.x) * tx + (h.z - P.z) * tz; n++;
    if (along - h.w / 2 < C.CITY.CHAMFER - 0.6 || along + h.w / 2 > L - C.CITY.CHAMFER + 0.6) bad++;
  }
  V('§3.2 góc vát (lô dọc cạnh cách góc ≥ 20 m)', `${pct(n - bad, n)} %`, bad === 0, `${bad}/${n} lô sai`);
  const ang = H.filter((h) => h.angle).length, cor = H.filter((h) => h.angle && h.corner).length;
  V('§3.2 nhà góc 45°', `${ang} nhà (${cor} tửu / trà lâu)`, ang > 1500);
}

// dãy nhà: theo cạnh ô, thứ tự dọc cạnh
const runs = new Map();
for (const h of H) { if (h.angle) continue; const k = `${h.block}#${h.edge}`; let l = runs.get(k); if (!l) runs.set(k, (l = [])); l.push(h); }
for (const l of runs.values()) l.sort((a, b) => a.bi - b.bi);

// 3.4 không trùng hàng xóm · cửa sổ 5 nhà
{
  let pairs = 0, same = 0, win = 0, winOk = 0; const ex = [];
  for (const l of runs.values()) {
    for (let i = 1; i < l.length; i++) {
      const a = l[i - 1], b = l[i], ra = R.get(a.id), rb = R.get(b.id); if (!ra || !rb) continue;
      if (Math.hypot(a.x - b.x, a.z - b.z) > (a.w + b.w) / 2 + 0.6) continue; // không liền kề (khe nhóm / ngõ)
      pairs++;
      const tintEq = ra.tint && rb.tint && ra.tint.every((v, k) => Math.abs(v - rb.tint[k]) < 0.02);
      if (ra.id === rb.id && Math.abs((ra.ht || 0) - (rb.ht || 0)) < 1 && tintEq) { same++; if (ex.length < 3) ex.push(`${a.id}~${b.id}`); }
    }
    for (let i = 0; i + 5 <= l.length; i++) {
      const w = l.slice(i, i + 5).map((h) => R.get(h.id)).filter(Boolean); if (w.length < 5) continue;
      win++; const hs = w.map((r) => r.ht || 0);
      if (new Set(w.map((r) => r.id)).size >= 3 && Math.max(...hs) - Math.min(...hs) >= 1) winOk++;
    }
  }
  V('§3.4 cặp nhà liền kề giống hệt (model + cao + màu)', `${same}/${pairs}`, same === 0, ex.join(' '));
  V('§3.4 cửa sổ 5 nhà: ≥ 3 model và ≥ 2 bậc cao', `${pct(winOk, win)} %`, winOk / win >= 0.95, `${winOk}/${win}`);
}

// 3.5 độ lệch chuẩn chiều cao mỗi dãy (≥ 6 nhà)
{
  let n = 0, ok = 0; const sd = [];
  for (const l of runs.values()) {
    const hs = l.map((h) => R.get(h.id)?.ht).filter((v) => v > 0); if (hs.length < 6) continue;
    const m = hs.reduce((a, b) => a + b, 0) / hs.length, s = Math.sqrt(hs.reduce((a, b) => a + (b - m) ** 2, 0) / hs.length);
    n++; sd.push(s); if (s >= 0.8) ok++;
  }
  sd.sort((a, b) => a - b);
  V('§3.5 dãy (≥ 6 nhà) có độ lệch chiều cao ≥ 0,8 m', `${pct(ok, n)} %`, ok / n >= 0.95, `trung vị ${sd[sd.length >> 1]?.toFixed(2)} m`);
  const hts = [...R.values()].map((r) => r.ht).filter(Boolean).sort((a, b) => a - b);
  V('§3.5 chiều cao mái', `${hts[0]}–${hts[hts.length - 1]} m (trung vị ${hts[hts.length >> 1]})`, true);
}

// 3.3 lõi ô trống ≥ 30 % (ô không phải nhà vườn)
{
  const area = (P) => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a.x * b.z - b.x * a.z; } return Math.abs(s) / 2; };
  const built = new Map(); for (const h of allHouses()) built.set(h.block, (built.get(h.block) || 0) + h.w * h.d);
  let n = 0, ok = 0; const fr = [];
  for (const b of B.values()) {
    if (b.band === 'g2' || b.band === 'g3' || !built.has(b.id)) continue;
    const open = 1 - built.get(b.id) / area(b.poly); n++; fr.push(open); if (open >= 0.3) ok++;
  }
  fr.sort((a, b) => a - b);
  V('§3.3 ô có lõi trống ≥ 30 %', `${pct(ok, n)} %`, ok / n >= 0.95, `trung vị ${Math.round(fr[fr.length >> 1] * 100)} %`);
}

// 3.8 phường có quảng trường · 3.8 / 3.10 điểm hoạt động ≤ 300 m
{
  const W = C.wards(), sq = W.filter((w) => w.square).length;
  V('§3.8 phường có quảng trường phường', `${sq}/${W.length}`, sq / W.length >= 0.95, 'phường không có ô sân khô đủ lớn thì dựa vào điểm hoạt động lân cận (chỉ số dưới)');
  const nodes = [...W.filter((w) => w.square).map((w) => w.centre), ...C.plazas().map((p) => p.centre), ...C.landmarks().map((m) => ({ x: m.x, z: m.z })), ...C.bridges().map((b) => ({ x: b.x, z: b.z }))];
  const G = new Map(), S = 300, key = (x, z) => `${Math.floor(x / S)},${Math.floor(z / S)}`;
  for (const p of nodes) { const k = key(p.x, p.z); let l = G.get(k); if (!l) G.set(k, (l = [])); l.push(p); }
  let far = 0, worst = 0;
  for (const h of H) {
    let best = Infinity; const i = Math.floor(h.door.x / S), j = Math.floor(h.door.z / S);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const p of G.get(`${i + a},${j + b}`) || []) best = Math.min(best, Math.hypot(p.x - h.door.x, p.z - h.door.z));
    worst = Math.max(worst, Math.min(best, 999)); if (best > 300) far++;
  }
  V('§3.8 cửa nhà cách điểm hoạt động ≤ 300 m', `${pct(H.length - far, H.length)} %`, far / H.length <= 0.02, `xa nhất ${Math.round(worst)} m, ${far} cửa > 300 m`);
}

let bad = 0;
for (const r of results) { console.log(`${r.ok ? '✓' : '✗'} ${r.name}: ${r.value}${r.note ? `  (${r.note})` : ''}`); if (!r.ok) bad++; }
console.log(bad ? `\n${bad} chỉ số TRƯỢT` : '\nmọi chỉ số đạt');
process.exit(bad ? 1 : 0);
