// distill-engine.cjs — Đợt chưng cất + cải thiện engine theo audit 3 agent:
// A. 合去 điều kiện đầy đủ (adjacency + 化神得令/透干) — không còn phán 败格 oan
// B. 从格 rootless check (真从/假从 tag)
// C. 天克地冲 unify 10 can (chart.js _GC chuẩn) → dayun-check + dayun-rank
// D. mangpai 日为主 (khẩu quyết chuẩn)
// G. key_passages 'null' → ''
const fs = require('fs');
let n = 0;
const ok = (t) => { n++; console.log('✓', t); };

// ---------- A. pattern-quality.js ----------
let pq = fs.readFileSync('src/engine/pattern-quality.js', 'utf8');
const oldFn = `function geStarCombined(chart, pattern) {
  const ge = pattern.geShen;
  if (!ge || !ge.gan) return null;
  const geGan = ge.gan;
  for (const k of ['year', 'month', 'time']) {
    const other = chart.pillars[k].gan;
    if (other === geGan) continue;
    const hua = HE_MAP[geGan + other];
    if (hua) {
      return { geGan, partner: other, hua, note: \`格 thần \${geGan} bị \${other} ngũ hợp hóa hành \${hua} → cách bị khuyết (dụng thần bị hợp đi).\` };
    }
  }
  return null;
}`;
const newFn = `function geStarCombined(chart, pattern) {
  const ge = pattern.geShen;
  if (!ge || !ge.gan) return null;
  const geGan = ge.gan;
  // [子平真诠 ch.8 FIX — audit 2026-08] 合去 requires ĐỦ 2 điều kiện:
  //   (1) 緊貼 — partner LIỀN KỀ trụ đang 透 格 thần (năm↔tháng; tháng↔ngày=日主; thời↔ngày=日主).
  //       Năm↔thời là 隔合 (cách 2 trụ) → KHÔNG tính 合去.
  //   (2) 化神 ĐẮC THẾ — 化神 = bản khí tháng lệnh HOẶC 透干 ở trụ khác. Không đủ → chỉ 合绊
  //       (giảm lực, KHÔNG phá cách). Trước đây: ngũ hợp bất kỳ vị trí → 败格 oan ~25-30% lá số,
  //       và không luật cứu ứng nào cứu được via 'he'.
  const posOf = [];
  for (const k of ['year', 'month', 'time']) if (chart.pillars[k].gan === geGan) posOf.push(k);
  const ADJ = { year: ['month'], month: ['year'], time: [] }; // 日主 (day) là 合我 — không phải 合去
  for (const k of ['year', 'month', 'time']) {
    const other = chart.pillars[k].gan;
    if (other === geGan) continue;
    const hua = HE_MAP[geGan + other];
    if (!hua) continue;
    const adjacent = posOf.some((p) => ADJ[p].includes(k));
    if (!adjacent) continue;
    const hid0 = (HIDDEN[chart.pillars.month.zhi] || [])[0];
    const huaDeLenh = hid0 && GAN[hid0.gan] && GAN[hid0.gan].wx === hua;
    const huaTou = ['year', 'month', 'time'].some((pk) => GAN[chart.pillars[pk].gan] && GAN[chart.pillars[pk].gan].wx === hua);
    if (huaDeLenh || huaTou) {
      return { broken: true, geGan, partner: other, hua, note: \`格 thần \${geGan} bị \${other} 緊貼 ngũ hợp, 化神 \${hua} đắc thế → 合去, cách bị khuyết (dụng thần bị hợp đi).\` };
    }
    return { tied: true, geGan, partner: other, hua, note: \`格 thần \${geGan}合 \${other} — 化神 \${hua} KHÔNG đắc lệnh/透干 → chỉ 合绊 (lực cách giảm), KHÔNG phải 合去.\` };
  }
  return null;
}`;
if (pq.includes(oldFn)) { pq = pq.replace(oldFn, newFn); ok('A1 geStarCombined điều kiện đầy đủ'); }
else console.log('✗ A1 MISS');

const oldCons = `    if (combinedAway) {
      broken = true;
      diseases.push({ via: 'he', killers: [], note: combinedAway.note });
    }`;
const newCons = `    if (combinedAway) {
      if (combinedAway.tied) heTiedNote = combinedAway.note; // [FIX] 合绊 — ghi chú, KHÔNG phá cách
      else {
        broken = true;
        diseases.push({ via: 'he', killers: [], note: combinedAway.note });
      }
    }`;
if (pq.includes(oldCons)) { pq = pq.replace(oldCons, newCons); ok('A2 consumer tách 合绊'); }
else console.log('✗ A2 MISS');
// declare heTiedNote + append vào summary
const oldDecl = `  let broken = false;
  const diseases = [];`;
const newDecl = `  let broken = false;
  let heTiedNote = null;
  const diseases = [];`;
if (pq.includes(oldDecl)) { pq = pq.replace(oldDecl, newDecl); ok('A3 heTiedNote decl'); }
else console.log('✗ A3 MISS');
const oldSum = `  const summary = buildSummary(quality, pattern, keyStar, diseases, rescues, patternYong);`;
const newSum = `  const summary = buildSummary(quality, pattern, keyStar, diseases, rescues, patternYong)${''}` + `
    + (heTiedNote ? ' · ' + heTiedNote : '');`;
if (pq.includes(oldSum)) { pq = pq.replace(oldSum, newSum); ok('A4 summary gắn 合绊 note'); }
else console.log('✗ A4 MISS');
fs.writeFileSync('src/engine/pattern-quality.js', pq);

// ---------- B. pattern.js 从格 rootless ----------
let pt = fs.readFileSync('src/engine/pattern.js', 'utf8');
const oldCong = `      if (help < 0.22) {
        const map = { cai: '從財格', guan: '從殺格', shi: '從兒格' };
        return { kind: 'cong', name: map[dom[0]], geShen: { wx: dominantWx(dmWx, dom[0]) } };
      }`;
const newCong = `      if (help < 0.22) {
        const map = { cai: '從財格', guan: '從殺格', shi: '從兒格' };
        // [子平真诠/滴天髓 FIX — audit 2026-08] 真从 requires 日主 VÔ GỐC (bản khí/trung khí
        //   không còn Nhật Chủ ở bất kỳ chi nào). Còn gốc → 假从 (theo thế CÓ ĐIỀU KIỆN):
        //   vận gặp gốc = biến động lớn. Tag congGia để brief/AI luận đúng, tránh cứng nhắc.
        let dmRoot = false;
        for (const zk of ['year', 'month', 'day', 'time']) {
          const hid = HIDDEN[chart.pillars[zk].zhi] || [];
          for (let hi = 0; hi < Math.min(hid.length, 2); hi++) {
            const hx = GAN[hid[hi].gan] ? GAN[hid[hi].gan].wx : null;
            if (hx === dmWx) { dmRoot = true; break; }
          }
          if (dmRoot) break;
        }
        const res = { kind: 'cong', name: map[dom[0]], geShen: { wx: dominantWx(dmWx, dom[0]) } };
        if (dmRoot) {
          res.congGia = true;
          res.note = 'Nhật Chủ còn gốc (bản khí/trung khí) → 假从 — theo thế CÓ ĐIỂU KIỆN: vận gặp gốc là biến động lớn, luận linh hoạt hơn 真从.';
        }
        return res;
      }`;
if (pt.includes(oldCong)) { pt = pt.replace(oldCong, newCong); ok('B1 从格 rootless check'); }
else console.log('✗ B1 MISS');
fs.writeFileSync('src/engine/pattern.js', pt);

// ---------- C. 天克地冲 unify 10 can ----------
let dc = fs.readFileSync('src/engine/dayun-check.js', 'utf8');
const oldGC1 = `const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };`;
const newGC1 = `const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁', 戊:'甲', 己:'乙', 壬:'戊', 癸:'己' }; // [UNIFY — audit 2026-08] đủ 10 can 七杀克 (khớp chart.js _GC) — trước thiếu 戊己壬癸 → 戊/己/壬/癸 day master không flag 天克地冲 trong khi chart.js có`;
if (dc.includes(oldGC1)) { dc = dc.replace(oldGC1, newGC1); ok('C1 dayun-check map 10 can'); }
else console.log('✗ C1 MISS');
fs.writeFileSync('src/engine/dayun-check.js', dc);

let dr = fs.readFileSync('src/engine/dayun-rank.js', 'utf8');
const oldGC2 = `const GANCHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };`;
const newGC2 = `const GANCHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁', 戊:'甲', 己:'乙', 壬:'戊', 癸:'己' }; // [UNIFY — audit 2026-08] đủ 10 can (khớp chart.js _GC)`;
if (dr.includes(oldGC2)) { dr = dr.replace(oldGC2, newGC2); ok('C2 dayun-rank map 10 can'); }
else console.log('✗ C2 MISS');
fs.writeFileSync('src/engine/dayun-rank.js', dr);

// ---------- D. mangpai 日为主 ----------
let mp = fs.readFileSync('src/engine/mangpai.js', 'utf8');
const oldZhu = "isZhu = pos === 'day' || pos === 'time'";
const newZhu = "isZhu = pos === 'day' // [UNIFY — audit 2026-08] 日为主 (khẩu quyết chuẩn, khớp mangpai-view) — trước gộp Ngày+Giờ → mâu thuẫn 宾主 với mangpai-view";
if (mp.includes(oldZhu)) { mp = mp.replace(oldZhu, newZhu); ok('D1 mangpai 日为主'); }
else console.log('✗ D1 MISS');
fs.writeFileSync('src/engine/mangpai.js', mp);

// ---------- G. key_passages 'null' → '' ----------
let dd = fs.readFileSync('src/engine/daozang-deep.js', 'utf8');
const cnt = (dd.match(/key_passages: 'null'/g) || []).length;
if (cnt) { dd = dd.split("key_passages: 'null'").join("key_passages: ''"); fs.writeFileSync('src/engine/daozang-deep.js', dd); ok(`G key_passages null→'' ×${cnt}`); }
else console.log('G: no null passages (already clean)');

console.log('TOTAL:', n, 'patches applied');
