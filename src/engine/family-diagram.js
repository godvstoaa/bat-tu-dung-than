// ============================================================================
//  DỮ LIỆU SƠ ĐỒ NGHIỆM CHỨNG (render do main.js)
//  3 view: radial (chòm sao), matrix (ma trận cặp), radar (mạng nhện 6 trục).
//  Trả về dữ liệu tĩnh (tọa độ/số) — không sinh HTML, tránh phụ thuộc DOM.
// ============================================================================
import { analyzePair } from './family.js';

// ---- RADIAL: trung tâm ở giữa, N người thân quanh tròn ----
export function radialData(family, opts = {}) {
  const cx = opts.cx ?? 150, cy = opts.cy ?? 150, r = opts.r ?? 110;
  const nodes = [{
    id: 'center', label: family.center.label || 'Chủ thể',
    dm: family.center.R.chart.dayMaster.gan, x: cx, y: cy, isCenter: true,
  }];
  const edges = [];
  family.pairs.forEach((p, i) => {
    const ang = -Math.PI / 2 + (i / Math.max(1, family.pairs.length)) * 2 * Math.PI;
    const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
    nodes.push({
      id: p.label, label: p.label, roleVi: p.pair.roleVi,
      dm: family.members[i].R.chart.dayMaster.gan, x: +x.toFixed(1), y: +y.toFixed(1),
    });
    const tone = p.pair.pairScore >= 72 ? 'good' : p.pair.pairScore >= 55 ? 'mid' : 'bad';
    edges.push({ from: 'center', to: p.label, score: p.pair.pairScore, tone, label: String(p.pair.pairScore) });
  });
  return { nodes, edges };
}

// ---- MATRIX: cặp người × người (chủ thể + members) ----
//Inverse role khi đổi góc nhìn (member nhìn center / member khác).
// father/mother → parent (giữ phân biệt cha/mẹ thay vì gộp 'child');
// child → parent nhưng cần phân biệt theo giới center để chọn father hay mother.
function invertRole(role, centerGender) {
  switch (role) {
    case 'father': return 'child';   // cha nhìn chủ thể = con
    case 'mother': return 'child';   // mẹ nhìn chủ thể = con
    case 'child':  // con nhìn chủ thể = cha HOẶC mẹ tuỳ giới chủ thể
      return centerGender === 'nam' ? 'father' : 'mother';
    case 'spouse':  return 'spouse';
    case 'sibling': return 'sibling';
    default: return role;
  }
}
export function matrixData(family) {
  const centerGender = family.center.R.chart.input.gender;
  const people = [
    { id: 'center', label: family.center.label || 'Chủ thể', R: family.center.R, role: 'self' },
    ...family.members.map((m, i) => ({ id: m.label, label: m.label, R: m.R, role: family.pairs[i].role })),
  ];
  const cells = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = 0; j < people.length; j++) {
      if (i === j) { cells.push({ i, j, score: null }); continue; }
      let role = people[j].role;
      if (people[i].role !== 'self') role = (people[j].role === 'self') ? invertRole(role, centerGender) : 'sibling';
      let s = null;
      try { s = analyzePair(people[i].R, people[j].R, role).pairScore; } catch (e) { s = null; }
      cells.push({ i, j, score: s });
    }
  }
  return { labels: people.map((p) => p.label), cells };
}

// ---- RADAR: 6 trục cluster ----
export function radarData(family) {
  return family.radar.map((d) => ({ axis: d.axis, value: d.value }));
}
