// ============================================================================
//  LÝ TƯỞNG PHÒNG 层楼坐向 — CHỌN TẦNG + HƯỚNG NHÀ THEO MỆNH
//  "Tôi nên mua/thuê nhà hướng nào, tầng mấy?" — công cụ phong thuỷ thực chiến.
//  * 楼层五行 (theo số tận cùng): 1/6 = Thủy | 2/7 = Hỏa | 3/8 = Mộc | 4/9 = Kim | 5/0 = Thổ.
//    Tầng có ngũ hành = DỤNG/HỶ → tốt; = KỴ/THÙ → tránh; còn lại trung tính.
//  * Hướng (坐山/朝向): theo Mệnh Quái (Đông/Tứ Mệnh → 4 hướng cát của nhóm)
//    + ưu tiên hướng trùng Dụng Thần. Sinh Khí/Thiên Y/Diên Niên = 3 hướng cát nhất.
//  * Kết hợp 命卦 (zhai) + Dụng Thần (yong) → 1 bộ 推荐 cụ thể.
//  Nguồn: 八宅明镜 楼层五行, 黄帝宅经 命卦, 沈氏玄空 楼层配合.
// ============================================================================
import { WX_VI } from './constants.js';
import { computeZhai } from './zhai.js';

const DIGIT_WX = { 1: '水', 6: '水', 2: '火', 7: '火', 3: '木', 8: '木', 4: '金', 9: '金', 5: '土', 0: '土' };
const TONE_RANK = { 'Sinh Khí': 1, 'Thiên Y': 2, 'Diên Niên': 3, 'Phục Vị': 4 }; // 4 cát方 八宅

function floorFive(floor) { return DIGIT_WX[floor % 10]; }

/**
 * @param {object} R — analyze()
 * @param {number} maxFloor — quét tới tầng (default 30)
 * @returns {{ gua, grpVi, idealFloors, okFloors, avoidFloors, bestFacing, auspicious, summary }}
 */
export function idealHouse(R, maxFloor = 30) {
  const inp = R.chart.input;
  const zhai = computeZhai(inp.year, inp.gender);
  // [loop 557 FIX BUG3] guard yong thiếu — trước đây WX_VI[undefined] leak «Dụng undefined» vào summary.
  const dung = R.yong?.primary, hy = R.yong?.xi, ky = R.yong?.ji, thou = R.yong?.chou;
  const W = (wx) => WX_VI[wx] || '?';
  const dungSet = new Set([dung, hy].filter(Boolean));
  const avoidSet = new Set([ky, thou].filter(Boolean));

  const idealFloors = [], okFloors = [], avoidFloors = [];
  for (let f = 1; f <= maxFloor; f++) {
    const wx = floorFive(f);
    const e = { floor: f, wx, wxVi: WX_VI[wx] };
    if (dungSet.has(wx)) idealFloors.push(e);
    else if (avoidSet.has(wx)) avoidFloors.push(e);
    else okFloors.push(e);
  }

  // hướng: 4 cát方 của mệnh quái (auspicious = {tênSao: hướng})
  const ausp = zhai.auspicious || {};
  // [loop 557 FIX BUG2+5] Dụng-hướng dùng SET chính xác, KHÔNG substring (trước đây
  //   'Đông Bắc'.includes('Đông') → bonus nhầm cho Mộc-Dụng; Thổ ghi「Trung/Tây Nam」không match).
  //   Thổ = Đông Bắc (Cấn) + Tây Nam (Khôn) theo Hậu Thiên Bát Quái.
  const DUNG_DIRS = ({ 木: ['Đông', 'Đông Nam'], 火: ['Nam'], 土: ['Đông Bắc', 'Tây Nam'], 金: ['Tây', 'Tây Bắc'], 水: ['Bắc'] })[dung] || [];
  let bestFacing = null, bestScore = -1;
  for (const [star, dir] of Object.entries(ausp)) {
    let sc = 10 - (TONE_RANK[star] || 5);
    if (DUNG_DIRS.includes(dir)) sc += 5; // khớp CHÍNH XÁC hướng Dụng thần
    if (sc > bestScore) { bestScore = sc; bestFacing = { star, dir }; }
  }

  const fmtFloors = (arr) => arr.length ? arr.map((e) => `T${e.floor}(${e.wxVi})`).join(', ') : '(không)';
  const summary = `Mệnh ${zhai.grpVi}, quái ${zhai.guaName}. ` +
    `Tầng TỐT (ngũ hành = Dụng ${W(dung)}/Hỷ ${W(hy)}): ${fmtFloors(idealFloors)}. ` +
    `Tầng TRÁNH (ngũ hành = Kỵ ${W(ky)} / Thù ${W(thou)}): ${fmtFloors(avoidFloors)}. ` +
    (bestFacing ? `Hướng cát tốt nhất: ${bestFacing.dir} (${bestFacing.star}) — nên 选 nhà 坐 đối cung, mở cửa/hướng về đây.` : '') +
    ` (4 cát方: ${Object.entries(ausp).map(([s, d]) => `${s}→${d}`).join(', ')}.)`;

  return {
    gua: zhai.guaName, grpVi: zhai.grpVi,
    idealFloors, okFloors, avoidFloors,
    bestFacing, auspicious: ausp,
    summary,
  };
}

export { DIGIT_WX, TONE_RANK };
