// ============================================================================
//  SỰ NGHIỆP LUẬN 事业论 — PHÂN TÍCH SÂU SỰ NGHIỆP
//  Hoàn thiện bộ 3 (hôn nhân + tài lộc + sự nghiệp).
//  Quan/Sát (sự nghiệp) + Ấn (học vấn) + Cách cục → định hướng nghề + thời điểm.
//  Nguồn: 渊海子平, 子平真诠 格局论业, 滴天髓.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';

const FAV_CAREER_MAP = {
  木: 'giáo dục, xuất bản, mộc/nội thất, dược/đông y, nông-lâm, thời trang vải, từ thiện',
  火: 'năng lượng/điện, điện tử, ẩm thực, quảng cáo/truyền thông, giải trí, mỹ phẩm',
  土: 'bất động sản, xây dựng, nông nghiệp, bảo hiểm, gốm sứ, tư vấn/quản lý',
  金: 'tài chính/ngân hàng, cơ khí/kim loại, công nghệ, luật, quân/cảnh, trang sức',
  水: 'thương mại, vận tải/logistics, du lịch, truyền thông, thủy sản, XNK, ngoại giao',
};

const PATTERN_CAREER = {
  正官格: 'hợp công chức, hành chính, quản lý, pháp luật — ổn định, quy củ.',
  七殺格: 'hợp quân sự, cảnh sát, y tế phẫu thuật, doanh nghiệp khắc nghiệt — quyền lực.',
  正財格: 'hợp kinh doanh, tài chính, thương mại — tài lộc ổn.',
  偏財格: 'hợp đầu tư, kinh doanh lớn, giao tế — tài lớn biến động.',
  正印格: 'hợp giáo dục, nghiên cứu, văn hoá, y khoa — học thuật.',
  偏印格: 'hợp huyền học, tôn giáo, nghệ thuật phi chính thống, kỹ thuật chuyên sâu.',
  食神格: 'hợp nghệ thuật, ẩm thực, giáo dục, y, dịch vụ — tài hoa.',
  傷官格: 'hợp kỹ thuật, luật, nghệ thuật, truyền thông, khởi nghiệp — sáng tạo, phá cách.',
  建祿格: 'hợp tự kinh doanh, tự do — tự lập.',
  月劫格: 'hợp hợp tác, quản lý rủi ro — cần chế.',
  羊刃格: 'hợp võ, quân sự, phẫu thuật, kỹ thuật nguy hiểm — uy mãnh.',
};

/**
 * @returns {{ officerStar, officerWx, strength, patternCareer, favCareers,
 *            hasSeal, hasFood, bodyStrong, isYong, isJi, timing, profile, advice }}
 */
export function analyzeCareerStar(R) {
  const { chart, yong, dayun, pattern } = R;
  const dayGan = chart.dayGan;
  const dayWx = GAN[dayGan].wx;

  // 1. Quan/Sát = sự nghiệp sao
  const officerGods = ['正官', '七殺'];
  const officerWx = ({ 木:'金', 火:'水', 土:'木', 金:'火', 水:'土' })[dayWx]; // 克日 = Quan

  // 2. Đếm Quan/Sát + Ấn
  let officerCount = 0, sealCount = 0;
  const positions = [];
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (officerGods.includes(g)) { officerCount += 1; positions.push(key); }
    if (['正印', '偏印'].includes(g)) sealCount += 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const g = chart.pillars[key].hidden[0]?.god;
    if (officerGods.includes(g)) { officerCount += 0.5; positions.push(key + '(tàng)'); }
    if (['正印', '偏印'].includes(g)) sealCount += 0.5;
  }

  // 3. Cách cục → nghề
  const patternCareer = PATTERN_CAREER[pattern.name] || 'theo Dụng Thần';

  // 4. Dụng Thần nghề
  const favCareers = [...new Set([yong.primary, yong.xi].filter(Boolean))]
    .map((w) => `${WX_VI[w]}: ${FAV_CAREER_MAP[w] || ''}`).join(' | ');

  // 5. Dụng/Kỵ
  const isYong = (yong.primary === officerWx || yong.xi === officerWx);
  const isJi = (yong.ji === officerWx || yong.chou === officerWx);

  // 6. Đại vận Quan/Ấn timing
  const careerDayun = (dayun || []).filter((d) => {
    const dgWx = GAN[d.gan]?.wx, dzWx = ZHI[d.zhi]?.wx;
    return dgWx === officerWx || dzWx === officerWx || dgWx === yong.primary || dzWx === yong.primary;
  }).map((d) => `${d.ganZhi}[${d.startAge}-${d.startAge + 9}t:${d.rating}]`);

  // 7. Hồ sơ
  const strength = officerCount >= 1.5 ? 'vượng' : officerCount > 0 ? 'vừa' : 'nhược/ẩn';
  const bodyStrong = R.strength.strong;
  const hasSeal = sealCount >= 1;
  const hasFood = (chart.pillars.year.ganGod === '食神' || chart.pillars.month.ganGod === '食神' || chart.pillars.time.ganGod === '食神'
    || ['year', 'month', 'day', 'time'].some((k) => ['食神', '傷官'].includes(chart.pillars[k].hidden[0]?.god)));

  const profile = [
    `Sao sự nghiệp: ${officerGods.map((g) => TEN_GOD_VI[g]).join('/')} (hành ${WX_VI[officerWx]}), độ ${strength} (${officerCount.toFixed(1)}).`,
    bodyStrong
      ? `✓ Thân vượng → đủ sức gánh Quan-Tài, hợp quản lý/kinh doanh/áp lực cao.`
      : `Thân nhược → nên chọn nơi ổn định, có quý nhân/Ấn dìu dắt; tránh ôm đồm chức cao.`,
    hasSeal ? `✓ Có Ấn (${sealCount.toFixed(1)}) → quý nhân/học vấn hỗ trợ sự nghiệp.` : `Ấn ít → sự nghiệp tự thân, ít được nâng đỡ.`,
    `Cách cục ${pattern.vi}: ${patternCareer}`,
    `Nghề hợp Dụng Thần (${WX_VI[yong.primary]}/${WX_VI[yong.xi]}): ${favCareers}.`,
    isYong ? `✓ Quan = Dụng/Hỷ → sự nghiệp thuận, dễ thăng tiến.` : '',
    isJi ? `⚠ Quan = Kỵ → sự nghiệp áp lực; nên tránh quyền cao chức trọng.` : '',
    careerDayun.length ? `⏰ Đại vận Quan/Dụng: ${careerDayun.join(', ')} — giai đoạn sự nghiệp sáng.` : '',
  ].filter(Boolean);

  const advice = bodyStrong && isYong
    ? 'Sự nghiệp sáng + thân vượng → nên tiến thủ mạnh, giữ vị trí quản lý/lãnh đạo; đón đại vận Quan/Dụng.'
    : !bodyStrong
      ? 'Thân nhược → tích lũy năng lực trước, chọn nơi ổn định + quý nhân; sự nghiệp phát sau.'
      : isJi
        ? 'Quan = Kỵ → tránh đối đầu quyền lực; chọn nghề tự do/chuyên gia thay vì công chức.'
        : 'Sự nghiệp trung bình → kiên nhẫn tích lũy; thăng tiến khi đại vận mang Dụng Thần.';

  return {
    officerStar: officerGods.map((g) => TEN_GOD_VI[g]).join('/'),
    officerWx, officerWxVi: WX_VI[officerWx],
    strength, officerCount, patternCareer, favCareers,
    hasSeal, sealCount, hasFood, bodyStrong, isYong, isJi,
    timing: careerDayun, profile, advice,
  };
}

export { FAV_CAREER_MAP, PATTERN_CAREER };
