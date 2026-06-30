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

  // [loop 997] 大运 CHI ỨNG KỲ — kích hoạt THEO THẬP KỶ (大运 chi xung/hợp chi bẩm sinh).
  //   Khác 流年 (1 năm): đại vận chi mở kho = «cửa mở 10 năm» cho sao ẩn phát lực liên tục.
  //   Cổ法 «运冲则发, 运合则动» — đại vận cũng激活 qua xung/hợp, lực kéo dài cả thập kỷ.
  const natalSet2 = new Set(natalBranches.map((n) => n.zhi));
  const _detect = (targetZhi) => {
    const out = [];
    for (const nb of natalBranches) {
      if (ZHI_CHONG_MAP[nb.zhi + targetZhi]) {
        const g = branchGroups[nb.zhi]; if (g.length) out.push({ type: KU_WX[nb.zhi] ? 'xung mở kho' : 'xung kích tàng can', pillar: nb.pillar, branch: nb.zhi, groups: g });
      }
      const hua = ZHI_LIUHE_MAP[nb.zhi + targetZhi];
      if (hua) {
        const g = branchGroups[nb.zhi].slice(); const hg = groupOfWx(dmWx, hua); if (hg && !g.includes(hg)) g.push(hg);
        if (g.length) out.push({ type: 'hợp dẫn', pillar: nb.pillar, branch: nb.zhi, groups: g, hua });
      }
    }
    for (const sh of ZHI_SANHE) {
      if (!sh.branches.includes(targetZhi)) continue;
      const others = sh.branches.filter((b) => b !== targetZhi);
      if (others.every((b) => natalSet2.has(b))) {
        const grp = groupOfWx(dmWx, sh.wx); if (grp) out.push({ type: 'tam hợp thành cục', pillar: '-', branch: targetZhi, groups: [grp], sanhe: sh });
      }
    }
    return out;
  };
  const dayunActivations = [];
  for (const dy of (Array.isArray(R.dayun) ? R.dayun : [])) {
    if (!dy || !dy.zhi || dy.startYear == null) continue;
    for (const a of _detect(dy.zhi)) {
      let note;
      if (a.type === 'xung mở kho') note = `Đại vận ${dy.ganZhi} (${dy.zhi}) xung ${a.branch} (${PILLAR_VI[a.pillar]}) → MỞ KHO ${WX_VI[KU_WX[a.branch]]} CẢ THẬP KỶ [${dy.startAge}–${dy.startAge + 9}t], sao ẩn phát lực kéo dài.`;
      else if (a.type === 'xung kích tàng can') note = `Đại vận ${dy.ganZhi} (${dy.zhi}) xung ${a.branch} (${PILLAR_VI[a.pillar]}) → tàng can bị kích, phát lực cả thập kỷ [${dy.startAge}–${dy.startAge + 9}t].`;
      else if (a.type === 'hợp dẫn') note = `Đại vận ${dy.ganZhi} (${dy.zhi}) hợp ${a.branch} (${PILLAR_VI[a.pillar]}) → hợp dẫn sao ẩn ra cả thập kỷ, hóa ${WX_VI[a.hua]}.`;
      else note = `Đại vận ${dy.ganZhi} (${dy.zhi}) + bẩm sinh đủ TAM HỢP ${a.sanhe.name} → cục thành cả thập kỷ, hành ${WX_VI[a.sanhe.wx]} vượng.`;
      dayunActivations.push({ ganZhi: dy.ganZhi, zhi: dy.zhi, startAge: dy.startAge, startYear: dy.startYear, type: a.type, pillar: a.pillar, branch: a.branch, groups: a.groups, note });
    }
  }

  // 3) GRADING — 大运为根，流年为苗. Một năm kích hoạt chỉ «phát thật» khi ĐẠI VẬN
  //    (thổ nhưỡng 10 năm) cùng hướng; nếu đại vận nghịch/Kỵ → lực bị suy giảm.
  //    Phân loại mỗi event: «真应期» (đại vận củng cố cùng nhóm sao) / «⚠ giảm lực» (kỵ vận) / «thường».
  const dyList = Array.isArray(R.dayun) ? R.dayun : [];
  const activeDy = (year) => dyList.find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10) || null;
  for (const e of events) {
    const dy = activeDy(e.year);
    if (!dy) { e.grade = 'chang'; e.viGrade = 'thường'; e.dyNote = ''; e.dy = null; continue; }
    const dyGroups = new Set([godGroup(dy.ganGod), godGroup(dy.zhiGod)].filter(Boolean));
    const dyGrpVi = [...dyGroups].map((g) => GROUP_VI[g]).filter(Boolean).join('+') || '?';
    const aligned = e.groups.some((g) => dyGroups.has(g.group));
    e.dy = dy.ganZhi;
    if (aligned) {
      e.grade = 'zhen'; e.viGrade = '★真应期';
      e.dyNote = `Đại vận ${dy.ganZhi} (${dyGrpVi}) CÙNG HƯỚNG → khuếch đại, «真应期» (lực mạnh nhất).`;
    } else if (typeof dy.score === 'number' && dy.score < 0) {
      e.grade = 'zu'; e.viGrade = '⚠ giảm lực';
      e.dyNote = `Đại vận ${dy.ganZhi} (${dy.rating || 'nghịch'}) → «kỵ vận» làm giảm lực kích hoạt lưu niên.`;
    } else {
      e.grade = 'chang'; e.viGrade = 'thường';
      e.dyNote = `Đại vận ${dy.ganZhi} (${dyGrpVi}) — không cùng hướng, lực thường.`;
    }
  }

  // [loop 994] TONE — kích hoạt sao DỤNG (cát) hay KỴ (hung)? Mở kho có thể bật RA đồng thời
  //   sao Dụng lẫn Kỵ (vd 辰 chứa 戊乙癸 → 3 nhóm) → «mixed». Phân loại theo yong của lá số.
  const y = R.yong || {};
  const dungGrp = y.primary ? groupOfWx(dmWx, y.primary) : '';
  const xiGrp = y.xi ? groupOfWx(dmWx, y.xi) : '';
  const jiGrp = y.ji ? groupOfWx(dmWx, y.ji) : '';
  const chouGrp = y.chou ? groupOfWx(dmWx, y.chou) : '';
  for (const e of events) {
    const favor = e.groups.some((g) => g.group === dungGrp || g.group === xiGrp);
    const unfavor = e.groups.some((g) => g.group === jiGrp || g.group === chouGrp);
    if (favor && unfavor) { e.tone = 'mixed'; e.toneVi = 'TRUNG (Dụng+Kỵ cùng bật)'; }
    else if (favor) { e.tone = 'cat'; e.toneVi = 'CÁT'; }
    else if (unfavor) { e.tone = 'hung'; e.toneVi = 'HUNG'; }
    else { e.tone = 'neutral'; e.toneVi = 'trung'; }
  }
  // [loop 997] tone + gmap cho dayunActivations (groups đang là string keys)
  for (const da of dayunActivations) {
    const favor = da.groups.some((g) => g === dungGrp || g === xiGrp);
    const unfavor = da.groups.some((g) => g === jiGrp || g === chouGrp);
    da.tone = (favor && unfavor) ? 'mixed' : favor ? 'cat' : unfavor ? 'hung' : 'neutral';
    da.toneVi = da.tone === 'cat' ? 'CÁT' : da.tone === 'hung' ? 'HUNG' : da.tone === 'mixed' ? 'TRUNG' : 'trung';
    da.groups = da.groups.map((g) => ({ group: g, vi: GROUP_VI[g] }));
  }

  // 4) Tổng kết — ưu tiên năm «真应期 + xung mở kho» (mạnh nhất), sau đó các kích hoạt khác.
  const kuOpen = events.filter((e) => e.type === 'xung mở kho');
  const zhen = events.filter((e) => e.grade === 'zhen');
  const catYears = events.filter((e) => e.tone === 'cat').map((e) => e.year);
  const hungYears = events.filter((e) => e.tone === 'hung').map((e) => e.year);
  // sắp xếp ưu tiên: CÁT+真应期+mở kho > CÁT+mở kho > mở kho > ... HUNG xuống cuối (cảnh báo)
  const toneRank = (e) => (e.tone === 'hung' ? 5 : e.tone === 'mixed' ? 4 : e.tone === 'cat' ? 0 : 3);
  const rank = (e) => (e.grade === 'zhen' && e.type === 'xung mở kho' ? 0 : e.type === 'xung mở kho' ? 1 : e.grade === 'zhen' ? 2 : 3);
  const top = events.slice().sort((a, b) => toneRank(a) - toneRank(b) || rank(a) - rank(b) || a.year - b.year).slice(0, 6);

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
    if (zhen.length) summary += ` ★真应期 (đại vận cùng hướng, phát thật): ${zhen.map((e) => e.year).join(', ')}.`;
    // [loop 994] tone — năm bật Dụng (CÁT) vs bật Kỵ (HUNG)
    if (catYears.length) summary += ` 🎉Năm bật DỤNG sao (CÁT): ${catYears.join(', ')}.`;
    if (hungYears.length) summary += ` ⚠Năm bật KỴ sao (HUNG — cẩn trọng): ${hungYears.join(', ')}.`;
    // dòng lĩnh vực nổi bật của năm mạnh nhất
    const first = top[0];
    if (first && first.groups.length) {
      const toneTag = first.tone === 'cat' ? ' 🎉CÁT' : first.tone === 'hung' ? ' ⚠HUNG' : first.tone === 'mixed' ? ' ≡TRUNG' : '';
      const gradeTag = first.grade === 'zhen' ? ' ★真应期' : first.grade === 'zu' ? ' ⚠giảm lực' : '';
      summary += ` ≫ ${first.year}: kích hoạt «${first.groups.map((g) => g.vi).join('+')}»${gradeTag}${toneTag} → ${first.groups.map((g) => g.domain).join(' / ')}.`;
    }
  }

  // [loop 997] 大运 chi activation summary — thập kỷ nào «mở cửa» sao ẩn (10 năm)
  const dyKuOpen = dayunActivations.filter((d) => d.type === 'xung mở kho');
  if (dayunActivations.length) {
    const dyCat = dayunActivations.filter((d) => d.tone === 'cat').map((d) => d.ganZhi);
    const dyHung = dayunActivations.filter((d) => d.tone === 'hung').map((d) => d.ganZhi);
    summary += ` 🔄Đại vận kích hoạt (cả thập kỷ): ${dayunActivations.slice(0, 4).map((d) => `${d.ganZhi}[${d.startAge}–${d.startAge + 9}t] ${d.type === 'xung mở kho' ? '★MởKho' : d.type === 'tam hợp thành cục' ? '≡TamHợp' : d.type === 'hợp dẫn' ? '∼Hợp' : '×Xung'}→${d.groups.map((g) => g.vi).join('+')}${d.tone === 'cat' ? ' 🎉Dụng' : d.tone === 'hung' ? ' ⚠Kỵ' : ''}`).join('; ')}.`;
    if (dyCat.length) summary += ` 🎉Thập kỷ bật DỤNG: ${dyCat.join(', ')}.`;
    if (dyHung.length) summary += ` ⚠Thập kỷ bật KỴ: ${dyHung.join(', ')}.`;
    if (dyKuOpen.length) summary += ` Kho mở cả thập kỷ: ${dyKuOpen.map((d) => d.branch + '(' + d.ganZhi + ')').join(', ')}.`;
  }

  return {
    events: top,
    kuBranches: natalBranches.filter((n) => KU_WX[n.zhi]).map((n) => ({ ...n, kuWx: KU_WX[n.zhi] })),
    zhenYears: zhen.map((e) => e.year),
    catYears,
    hungYears,
    dayunActivations,
    allCount: events.length,
    summary,
  };
}

export { KU_WX };
