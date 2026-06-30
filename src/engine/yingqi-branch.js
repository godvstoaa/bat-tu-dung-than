// ============================================================================
//  冲合应期 — BRANCH-ACTIVATION TIMING SCANNER (nửa "ĐỊA CHI" của 应期)
//  Câu hỏi: «Sao của tôi ẨN trong địa chi bẩm sinh — bao giờ mới thật sự phát lực?»
//  * yingqi-wealth.js lo nửa «THẤU CAN» (透干): sao ẩn → lưu niên CAN cùng hành thấu.
//  * Module này lo nửa «XUNG/HỢP CHI» (逢冲逢合): sao nằm trong TÀNG CAN của một chi
//    bẩm sinh → đợi LƯƯ NIÊN mang chi LỤC XUNG (mở kho) hoặc LỤC HỢP (kéo ra) chi đó
//    mới bị «kích hoạt», từ ẩn → hiện. Đây là con đường kích hoạt CHÍNH với lá số có
//    sao trạch căn (藏) chứ không thấu can.
//  3 quy tắc cổ (盲派 开库论 + 子平真诠 逢冲逢合应期 + 渊海子平 三合局):
//    A. LỤC XUNG chi bẩm sinh → «mở kho / phá kho»: tàng can của chi đó BẬT RA phát lực
//       (mạnh nhất). Đặc biệt 4 kho 辰戌丑未 bị xung → hành kho trào ra.
//    B. LỤC HỢP chi bẩm sinh → «hợp dẫn / kéo ra»: tàng can bị hút ra (nhẹ hơn xung);
//       thêm «hóa khí» của cặp hợp cùng strengthen.
//    C. LƯU NIÊN + 2 chi bẩm sinh đủ TAM HỢP CỤC → cục thành, hành cục vượng mạnh.
//  Mỗi sao kích hoạt được phân loại theo nhóm (财/官/印/食/比) → lĩnh vực ứng.
//  Nguồn: 子平真诠 «逢冲则发/逢合则动», 滴天髓 «库喜冲», 盲派 «开库做功».
// ============================================================================
import { Solar } from 'lunar-javascript';
import { HIDDEN, WX_VI, TEN_GOD_VI, GROUP_VI } from './constants.js';
import { tenGod, godGroup, relationOf } from './core.js';
import { ZHI_CHONG_MAP, ZHI_LIUHE_MAP, ZHI_SANHE } from './interactions.js';

// 四库 (tứ mộ库): 4 chi «kho» chứa một hành — khi bị XUNG mở → hành đó trào ra phát lực.
//   辰 = Thủy库 (long vương), 戌 = Hỏa库, 丑 = Kim库, 未 = Mộc库.
const KU_WX = { 辰: '水', 戌: '火', 丑: '金', 未: '木' };

// Nhóm sao (ti/yin/shi/cai/guan) của một HÀNH so với nhật chủ → lĩnh vực ứng.
function groupOfWx(dmWx, wx) {
  switch (relationOf(dmWx, wx)) {
    case 'same': return 'ti';
    case 'sheng': return 'shi';
    case 'ke': return 'cai';
    case 'keBy': return 'guan';
    case 'shengBy': return 'yin';
    default: return '';
  }
}

// Pillar → nhãn Việt (để chỉ «chi năm/tháng/ngày/giờ nào bị xung/hợp»). Lưu ý: trụ giờ
// trong R.chart.pillars được key là 'time' (theo quy ước lunar-javascript / chart.js).
const PILLAR_VI = { year: 'trụ năm', month: 'trụ tháng', day: 'trụ ngày', time: 'trụ giờ' };

// Nhóm → lĩnh vực + sao Việt (dùng cho text ứng kỳ)
const GROUP_DOMAIN = {
  cai: 'tài sản / tình duyên (nam)',
  guan: 'sự nghiệp / quyền lực / tình duyên (nữ)',
  yin: 'học vấn / điền sản / quý nhân',
  shi: 'sáng tạo / con cái / kỹ năng',
  ti: 'anh em / hợp tác / cạnh tranh',
};

function yearZhiOf(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  return s.getLunar().getEightChar().getYearZhi();
}

/**
 * Quét count năm từ fromYear, tìm các năm LƯU NIÊN xung/hợp chi bẩm sinh → kích hoạt sao ẩn.
 * @param {object} R  (R.chart.dayMaster, R.chart.pillars)
 * @param {number} fromYear
 * @param {number} count
 * @returns {{ events: [], kuBranches: [], summary: string }}
 *   events[]: { year, yz, type, pillar, branch, groups: [{group,vi,domain}], note }
 */
export function scanBranchYingqi(R, fromYear, count = 12) {
  const start = fromYear || new Date().getFullYear();
  const dmGan = R.chart.dayMaster.gan;
  const dmWx = R.chart.dayMaster.wx;
  const pillars = R.chart.pillars || {};

  // 1) Thu thập các chi bẩm sinh (4 trụ chính, bỏ trùng chi)
  const natalBranches = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const z = pillars[k] && pillars[k].zhi;
    if (z && !natalBranches.find((n) => n.zhi === z)) natalBranches.push({ zhi: z, pillar: k });
  }

  // 2) Với mỗi chi bẩm sinh → tập «nhóm sao có thể kích hoạt» (từ tàng can + hành kho)
  function activatableGroups(zhi) {
    const set = {};
    const hidden = HIDDEN[zhi] || [];
    for (const h of hidden) {
      const grp = godGroup(tenGod(dmGan, h));
      if (grp) set[grp] = true;
    }
    const kuWx = KU_WX[zhi];
    if (kuWx) set[groupOfWx(dmWx, kuWx)] = true; // hành kho (bản khí chi đó)
    return Object.keys(set);
  }
  const branchGroups = {};
  for (const nb of natalBranches) branchGroups[nb.zhi] = activatableGroups(nb.zhi);

  const events = [];
  const addYear = (year, yz, type, pillar, branch, groups, note) => {
    const gmap = groups.map((g) => ({ group: g, vi: GROUP_VI[g], domain: GROUP_DOMAIN[g] || '' }));
    events.push({ year, yz, type, pillar, branch, groups: gmap, note });
  };

  for (let i = 0; i < count; i++) {
    const y = start + i;
    const yz = yearZhiOf(y);

    // A. LỤC XUNG chi bẩm sinh → mở kho / bật tàng can (mạnh nhất)
    for (const nb of natalBranches) {
      if (!ZHI_CHONG_MAP[nb.zhi + yz]) continue;
      const groups = branchGroups[nb.zhi];
      if (!groups.length) continue;
      const isKu = !!KU_WX[nb.zhi];
      const type = isKu ? 'xung mở kho' : 'xung kích tàng can';
      const note = isKu
        ? `Lưu niên ${yz} xung ${nb.zhi} (${PILLAR_VI[nb.pillar]}) → MỞ KHO ${WX_VI[KU_WX[nb.zhi]]}, sao ẩn bật ra phát lực (mạnh).`
        : `Lưu niên ${yz} xung ${nb.zhi} (${PILLAR_VI[nb.pillar]}) → tàng can bị «kích» bật ra phát lực.`;
      addYear(y, yz, type, nb.pillar, nb.zhi, groups, note);
    }

    // B. LỤC HỢP chi bẩm sinh → hợp dẫn (kéo ra, nhẹ hơn xung) + hóa khí strengthen
    for (const nb of natalBranches) {
      const hua = ZHI_LIUHE_MAP[nb.zhi + yz];
      if (!hua) continue;
      const groups = branchGroups[nb.zhi].slice();
      const huaGrp = groupOfWx(dmWx, hua);
      if (huaGrp && !groups.includes(huaGrp)) groups.push(huaGrp);
      if (!groups.length) continue;
      const note = `Lưu niên ${yz} hợp ${nb.zhi} (${PILLAR_VI[nb.pillar]}) → «hợp dẫn» kéo sao ẩn ra (nhẹ), hóa ${WX_VI[hua]}.`;
      addYear(y, yz, 'hợp dẫn', nb.pillar, nb.zhi, groups, note);
    }

    // C. TAM HỢP CỤC thành (lưu niên + 2 chi bẩm sinh đủ 3 chi của cục)
    const natalSet = new Set(natalBranches.map((n) => n.zhi));
    for (const sh of ZHI_SANHE) {
      if (!sh.branches.includes(yz)) continue;
      const others = sh.branches.filter((b) => b !== yz);
      if (others.every((b) => natalSet.has(b))) {
        const grp = groupOfWx(dmWx, sh.wx);
        if (!grp) continue;
        const note = `Lưu niên ${yz} + bẩm sinh ${others.join('/')} đủ TAM HỢP ${sh.name} → cục thành, hành ${WX_VI[sh.wx]} vượng mạnh.`;
        addYear(y, yz, 'tam hợp thành cục', '-', yz, [grp], note);
      }
    }
  }

  // 3) Tổng kết — ưu tiên năm «xung mở kho» (mạnh nhất), sau đó các kích hoạt khác.
  const kuOpen = events.filter((e) => e.type === 'xung mở kho');
  const others = events.filter((e) => e.type !== 'xung mở kho');
  const top = [...kuOpen, ...others].slice(0, 6);

  let summary = '';
  if (!events.length) {
    summary = `12 năm tới không có lưu niên xung/hợp trực tiếp chi bẩm sinh → sao ẩn duy trì «tĩnh», đợi đại vận hoặc thấu can.`;
  } else {
    const byType = (t) => events.filter((e) => e.type === t);
    const parts = [];
    if (kuOpen.length) parts.push(`Năm MỞ KHO (mạnh): ${kuOpen.map((e) => e.year).join(', ')}.`);
    const xungTan = byType('xung kích tàng can');
    if (xungTan.length) parts.push(`Năm XUNG kích tàng can: ${xungTan.map((e) => e.year).join(', ')}.`);
    const hop = byType('hợp dẫn');
    if (hop.length) parts.push(`Năm HỢP DẪN (nhẹ): ${hop.map((e) => e.year).join(', ')}.`);
    const sanhe = byType('tam hợp thành cục');
    if (sanhe.length) parts.push(`Năm TAM HỢP thành cục: ${sanhe.map((e) => e.year).join(', ')}.`);
    summary = parts.join(' ');
    // dòng lĩnh vực nổi bật của năm mạnh nhất
    const first = top[0];
    if (first && first.groups.length) {
      summary += ` ≫ ${first.year}: kích hoạt «${first.groups.map((g) => g.vi).join('+')}» → ${first.groups.map((g) => g.domain).join(' / ')}.`;
    }
  }

  return {
    events: top,
    kuBranches: natalBranches.filter((n) => KU_WX[n.zhi]).map((n) => ({ ...n, kuWx: KU_WX[n.zhi] })),
    allCount: events.length,
    summary,
  };
}

export { KU_WX };
