// ============================================================================
//  TỬ NỮ LUẬN 子女论 — PHÂN TÍCH SÂU CON CÁI
//  Hoàn thiện bộ 6 chuyên sâu. Sao con (nam=Quan/Sát, nữ=Thực/Thương) +
//  cung tử nữ (Trụ Giờ) + Dụng/Kỵ + số lượng/giới tính + thời điểm sinh.
//  Nguồn: 渊海子平 子女篇, 滴天髓 子息, 三命通会.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

/**
 * @returns {{ childStar, childWx, isMale, strength, palaceZhi, palaceStable,
 *            palaceMainGod, isYong, isJi, estimated, firstGender, timing,
 *            interactions, profile, advice }}
 */
export function analyzeChildrenStar(R) {
  const { chart, yong, interactions, dayun } = R;
  const isMale = chart.input.gender === 'nam';
  const dayGan = chart.dayGan;

  // 1. Sao con: nam=Quan/Sát, nữ=Thực/Thương
  const childGods = isMale ? ['七殺','正官'] : ['食神','傷官'];
  const childWx = isMale
    ? ({ 木:'金', 火:'水', 土:'木', 金:'火', 水:'土' })[GAN[dayGan].wx]  // 克日 = Quan
    : ({ 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' })[GAN[dayGan].wx];  // 日 sinh = Thực/Thương

  // 2. Đếm sao con
  let count = 0;
  const positions = [];
  for (const key of ['year','month','time']) {
    const g = chart.pillars[key].ganGod;
    if (childGods.includes(g)) { count += 1; positions.push(key + '(can)'); }
  }
  for (const key of ['year','month','day','time']) {
    const g = chart.pillars[key].hidden[0]?.god;
    if (childGods.includes(g)) { count += 0.5; positions.push(key + '(tàng)'); }
  }

  // 3. Cung tử nữ = Trụ Giờ
  const palaceZhi = chart.pillars.time.zhi;
  const palaceMainGod = chart.pillars.time.hidden[0]?.god || '';
  const palaceStable = !interactions.chong.some(c => c.a === palaceZhi || c.b === palaceZhi)
    && !interactions.xing.some(c => c.a === palaceZhi || c.b === palaceZhi);

  // 4. Dụng/Kỵ
  const isYong = (yong.primary === childWx || yong.xi === childWx);
  const isJi = (yong.ji === childWx || yong.chou === childWx);

  // 5. Ước lượng số con (cổ pháp: dựa sao + cung)
  let estimated;
  if (count >= 2 && palaceStable) estimated = 'nhiều con (2-3+), duyên sâu';
  else if (count >= 1) estimated = 'có con (1-2), duyên vừa';
  else estimated = 'con muộn/ít — nên dưỡng thai theo Dụng, chọn năm cát';

  // 6. Giới tính con đầu (cổ pháp ước lượng)
  // Nam: 正官=con gái (dị tính), 七殺=con trai (đồng tính); Nữ: 食神=con trai, 傷官=con gái.
  let firstGender = 'khó đoán chắc';
  if (isMale) {
    if (chart.pillars.year.ganGod === '七殺' || chart.pillars.month.ganGod === '七殺') firstGender = 'thiên con trai';
    else if (chart.pillars.year.ganGod === '正官' || chart.pillars.month.ganGod === '正官') firstGender = 'thiên con gái';
  } else {
    if (chart.pillars.year.ganGod === '食神') firstGender = 'thiên con trai';
    else if (chart.pillars.year.ganGod === '傷官') firstGender = 'thiên con gái';
  }

  // 7. Thời điểm sinh con tốt (đại vận mang hành sao con / Dụng)
  const childDayun = (dayun || []).filter(d => {
    const dgWx = GAN[d.gan]?.wx, dzWx = ZHI[d.zhi]?.wx;
    return dgWx === childWx || dzWx === childWx || dgWx === yong.primary;
  }).map(d => `${d.ganZhi}[${d.startAge}-${d.startAge+9}t]`);

  // 8. Tương tác
  const interacts = [];
  if (!palaceStable) interacts.push('Trụ Giờ (cung tử nữ) bị xung/hình → thai nghén cần cẩn thận.');
  // [loop 20 hoàn thiện stub] Sao con bị can hợp → "tinh bị hợp" → con xa nhà sớm / duyên mỏng
  //   (cổ pháp: 子女星逢合则离家/做养子). Trước đây là dead code (GAN[gh.a]?null:null).
  for (const gh of interactions.ganHe || []) {
    const gA = tenGod(dayGan, gh.a), gB = tenGod(dayGan, gh.b);
    const hit = childGods.includes(gA) ? `${gh.a}(${TEN_GOD_VI[gA]})` : childGods.includes(gB) ? `${gh.b}(${TEN_GOD_VI[gB]})` : null;
    if (hit) interacts.push(`🤝 Sao con ${hit} bị can hợp → duyên con dễ rời nhà sớm/đi xa (tinh bị hợp).`);
  }
  // Sao con bị 克 → khó có con hoặc con khắc cha mẹ
  if (isJi) interacts.push(`⚠ Sao con = Kỵ Thần → con cái mang áp lực; cần chọn năm Dụng Thần sinh.`);

  // 9. Hồ sơ
  const strength = count >= 1.5 ? 'vượng' : count > 0 ? 'vừa' : 'nhược/ẩn';
  const profile = [
    `Sao con: ${childGods.map(g=>TEN_GOD_VI[g]).join('/')} (hành ${WX_VI[childWx]}), độ ${strength} (${count.toFixed(1)}).`,
    `Cung tử nữ (Trụ Giờ ${ZHI[palaceZhi]?.vi||palaceZhi}): tàng ${TEN_GOD_VI[palaceMainGod]||palaceMainGod}${palaceStable?' — yên':' — bị xung'}.`,
    `Ước lượng: ${estimated}.`,
    `Con đầu: ${firstGender}.`,
    isYong ? `✓ Sao con = Dụng/Hỷ → con cái mang phúc, nên có con.` : '',
    isJi ? `⚠ Sao con = Kỵ → con cái mang áp lực; nên chọn năm Dụng.` : '',
    childDayun.length ? `⏰ Đại vận thuận sinh con: ${childDayun.join(', ')}` : '',
  ].filter(Boolean);

  const advice = isYong
    ? 'Con cái là phúc — nên sinh con vào đại vận/lưu niên mang hành Dụng/DỤng để con khỏe mạnh + mang phúc.'
    : isJi
      ? 'Sao con = Kỵ → nên chọn năm Dụng Thần sinh con; dưỡng thai theo Dụng (màu/thức phẩm/phương).'
      : 'Duyên con trung tính — sinh con vào năm cát (xem golden year) sẽ tốt hơn.';

  return {
    childStar: childGods.map(g=>TEN_GOD_VI[g]).join('/'), childWx, childWxVi: WX_VI[childWx],
    isMale, strength, count, positions, palaceZhi, palaceZhiVi: ZHI[palaceZhi]?.vi || palaceZhi,
    palaceStable, palaceMainGod, palaceMainGodVi: TEN_GOD_VI[palaceMainGod] || palaceMainGod,
    isYong, isJi, estimated, firstGender, timing: childDayun,
    interactions: interacts, profile, advice,
  };
}
