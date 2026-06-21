// ============================================================================
//  TÀI TINH LUẬN 财星论 — PHÂN TÍCH SÂU TÀI LỘC
//  Song hành spouse-star.js: tài tinh vượng/nhược + vị trí + Dụng/Kỵ +
//  thực thương sinh tài / tỷ kiếp đoạt tài + đại vận tài thời điểm.
//  Nguồn: 渊海子平 财论, 滴天髓 财篇, 穷通宝鉴.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

/**
 * @returns {{ wealthStar, wealthWx, strength, positions, isYong, isJi,
 *            hasFoodGen, hasRobber, bodyCanHold, interacts, profile, advice, timing }}
 */
export function analyzeWealthStar(R) {
  const { chart, yong, wx, interactions, dayun } = R;
  const dayGan = chart.dayGan;
  const dayWx = GAN[dayGan].wx;
  const total = wx.total || 1;

  // 1. Tài tinh
  const wealthGods = ['正財', '偏財'];
  const wealthWx = ({ 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' })[dayWx]; // 日 克 = Tài

  // 2. Đếm + vị trí
  let count = 0; const positions = [];
  for (const key of ['year', 'month', 'time']) {
    const p = chart.pillars[key];
    if (wealthGods.includes(p.ganGod)) { count += 1; positions.push(key + '(can)'); }
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    if (wealthGods.includes(main?.god)) { count += 0.5; positions.push(key + '(tàng)'); }
  }

  // 3. Thực thương (sinh tài) + Tỷ kiếp (đoạt tài)
  const foodGods = ['食神', '傷官'];
  const robberGods = ['比肩', '劫財'];
  let foodCount = 0, robberCount = 0;
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (foodGods.includes(g)) foodCount += 1;
    if (robberGods.includes(g)) robberCount += 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const g = chart.pillars[key].hidden[0]?.god;
    if (foodGods.includes(g)) foodCount += 0.5;
    if (robberGods.includes(g)) robberCount += 0.5;
  }

  // 4. Dụng/Kỵ
  const isYong = (yong.primary === wealthWx || yong.xi === wealthWx);
  const isJi = (yong.ji === wealthWx || yong.chou === wealthWx);

  // 5. Thân có nhậm tài không?
  const bodyCanHold = R.strength.strong; // thân vượng → nhậm; nhược → tài đa thân nhược

  // 6. Tương tác
  const interacts = [];
  // Can hợp → tài bị hợp (đoạt/giữ)
  for (const gh of interactions.ganHe) {
    const godA = tenGod(dayGan, gh.a);
    const godB = tenGod(dayGan, gh.b);
    if (wealthGods.includes(godA) || wealthGods.includes(godB)) {
      interacts.push(`Tài tinh bị can hợp ${gh.a}${gh.b}→${gh.hua}: tiền dễ bị trói/giữ, dòng tiền chậm.`);
    }
  }
  // Tỷ kiếp đoạt
  if (robberCount >= 1.5) {
    interacts.push(`⚠ Tỷ Kiếp (${robberCount.toFixed(1)}) nhiều → dễ đoạt tài, hao tiền qua bạn bè/anh em/đầu tư bốc đồng.`);
  }
  // Thực thương sinh tài
  if (foodCount >= 1.5) {
    interacts.push(`✓ Thực Thương (${foodCount.toFixed(1)}) vượng → sinh tài tốt, kiếm tiền bằng tài hoa/sáng tạo/khẩu tài.`);
  }

  // 7. Đại vận tài timing
  const wealthDayun = (dayun || []).filter((d) => {
    const dgWx = GAN[d.gan]?.wx;
    const dzWx = ZHI[d.zhi]?.wx;
    return dgWx === wealthWx || dzWx === wealthWx;
  }).map((d) => `${d.ganZhi}[${d.startAge}-${d.startAge + 9}t:${d.rating}]`);

  // 8. Hồ sơ
  const strength = count >= 1.5 ? 'vượng' : count > 0 ? 'vừa' : 'nhược/ẩn';
  const posMeaning = positions.some((p) => p.startsWith('month')) ? 'tài qua công việc/sự nghiệp'
    : positions.some((p) => p.startsWith('year')) ? 'tài tổ nghiệp/gia đình'
    : positions.some((p) => p.startsWith('time')) ? 'tài muộn/vãn niên'
    : 'tài tự thân gây dựng';

  const profile = [
    `Tài tinh: ${wealthGods.map((g) => TEN_GOD_VI[g]).join('/')} (hành ${WX_VI[wealthWx]}), độ ${strength} (${count.toFixed(1)}).`,
    bodyCanHold
      ? `✓ Thân vượng → nhậm được tài — càng làm càng giữ được của, hợp kinh doanh/đầu tư.`
      : `⚠ Thân nhược → "tài đa thân nhược" — tiền tới nhưng khó giữ; cần Tỷ Kiếp/Ấn trợ thân trước.`,
    foodCount >= 1.5
      ? `✓ Có Thực Thương (${foodCount.toFixed(1)}) sinh tài → nguồn tài ổn từ tài năng/sáng tạo.`
      : `Thực Thương (${foodCount.toFixed(1)}) ít → tài ít có nguồn sinh, cần tự tạo.`,
    robberCount >= 1.5
      ? `⚠ Tỷ Kiếp (${robberCount.toFixed(1)}) nhiều → dễ hao tài, cẩn thận cho vay/đầu cơ.`
      : `Tỷ Kiếp (${robberCount.toFixed(1)}) ít → ít bị tranh giành tài.`,
    isYong ? `✓ Tài = Dụng/Hỷ Thần → chủ động cầu tài rất hiệu, tài vận sáng.` : '',
    isJi ? `⚠ Tài = Kỵ Thần → đừng tham liều; giữ tiền qua kênh Dụng Thần.` : '',
    `Tài qua: ${posMeaning}.`,
    wealthDayun.length ? `⏰ Đại vận mang hành Tài: ${wealthDayun.join(', ')} — giai đoạn tài vận sáng.` : `Chưa có đại vận mang hành Tài trong 8 vận — cần chờ vận Dụng Thần.`,
  ].filter(Boolean);

  const advice = bodyCanHold && isYong
    ? 'Tài vận sáng + thân nhậm được → nên kinh doanh/đầu tư chủ động; đón đại vận Tài.'
    : !bodyCanHold && count >= 1.5
      ? 'Tài nhiều nhưng thân nhược → trước hết trợ thân (Tỷ/Ấn), hùn hạp, tránh đòn bẩy lớn.'
      : isJi
        ? 'Tài = Kỵ → thủ không tiến; giữ tiền qua kênh Dụng Thần; tránh đầu cơ.'
        : 'Tài trung bình → cần kiên nhẫn tích lũy; tài vận tăng khi đại vận mang Dụng Thần.';

  return {
    wealthStar: wealthGods.map((g) => TEN_GOD_VI[g]).join('/'),
    wealthWx, wealthWxVi: WX_VI[wealthWx],
    strength, count, positions, posMeaning,
    isYong, isJi, hasFoodGen: foodCount, hasRobber: robberCount,
    bodyCanHold, interacts, profile, advice, timing: wealthDayun,
  };
}
