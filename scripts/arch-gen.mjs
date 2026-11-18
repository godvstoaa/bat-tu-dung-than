// ============================================================================
//  SINH BẢNG CHIẾM ĐẤT + MẶT ĐI ĐƯỢC của từng công trình kiến trúc (src/game/tienphu/arch) → arch/footprints.gen.js
//  Tổng mặt bằng (plan.js), kiểm mặt bằng (check-siteplans.mjs) và va chạm (plan.tienCollision) đọc bảng này thay vì
//  dựng lại hình học (nặng). Chạy lại mỗi khi sửa đặc tả / bộ dựng:   node scripts/arch-gen.mjs
// ============================================================================
import * as THREE from 'three';
import { writeFileSync } from 'node:fs';
const warn = console.warn; console.warn = (...a) => { if (!String(a[0]).includes('toNonIndexed')) warn(...a); };
const { ARCH_SPECS, buildArch } = await import('../src/game/tienphu/arch/index.js');
const r2 = (v) => Math.round(v * 100) / 100;
const out = {};
for (const key of Object.keys(ARCH_SPECS)) {
  if (ARCH_SPECS[key].type === 'tower') continue;               // lầu: va chạm do tower.js
  try {
    const t0 = Date.now(), { group, info } = buildArch(key);
    // acc.plats nằm trong bộ dựng — dựng lại để lấy (buildArch trả group đã gộp)
    const st = (await import('../src/game/tienphu/arch/index.js')).STYLES[ARCH_SPECS[key].style];
    const { acc } = st.builders[ARCH_SPECS[key].type](ARCH_SPECS[key]);
    const bb = new THREE.Box3().setFromObject(group);
    out[key] = {
      bb: [r2(bb.min.x), r2(bb.min.z), r2(bb.max.x), r2(bb.max.z)], body: [r2(info.W || 0), r2(info.D || 0)], top: r2(bb.max.y), ph: r2(info.ph || 0), eave: info.eave != null ? r2(info.eave) : null,
      plats: acc.plats.map((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, typeof v === 'number' ? r2(v) : v]))),
      tris: info.tris, ms: Date.now() - t0,
    };
    console.log(key.padEnd(26), `${(bb.max.x - bb.min.x).toFixed(1)} × ${(bb.max.z - bb.min.z).toFixed(1)} m`, `nóc ${bb.max.y.toFixed(1)}`, `${acc.plats.length} mặt đi`, `${(info.tris / 1000).toFixed(0)}k tg`);
  } catch (e) { console.log(key, 'LỖI', e.message); }
}
writeFileSync('src/game/tienphu/arch/footprints.gen.js', `// SINH TỰ ĐỘNG bởi scripts/arch-gen.mjs — không sửa tay.\n// key → { bb: [x0, z0, x1, z1] (cục bộ, +z mặt tiền), top, ph, eave, plats: mặt đi được, tris }\nexport const ARCH_FOOT = ${JSON.stringify(out)};\n`);
console.log(Object.keys(out).length, 'công trình → src/game/tienphu/arch/footprints.gen.js');
