// ============================================================================
//  董公择日 — ĐỐNG CÔNG TRÁCH NHẬT (Dong Gong Date Selection)
//  Hệ thống chọn ngày phổ biến ở Hồng Kông, tương truyền do 董德彰 (Đổng Đức
//  Chương, đời Minh) soạn. Luận cát/hung dựa trên tương tác giữa:
//    1. 建除十二直 (12 trực) — app đã có ở daily.js / zheri.js
//    2. Ngày can chi × 月支: 冲月 = hung, 合月 = cát
//    3. Mỗi tháng (月建) điều chỉnh nhẹ ý nghĩa 12 trực (董公 biến hóa theo tháng)
//
//  Bản triển khai rút gọn: bảng giải nghĩa kinh điển của 董公 cho từng trực +
//  biến thể theo tháng (tháng mà trực đó đặc biệt cát/hung) + kiểm 冲/合 nguyệt.
//  Nguồn: 董公择日要诀 (Bí quyết trạch nhật Đổng Công), 通胜 董公篇.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI, ZHI_ORDER } from './constants.js';

// 12 trực (建除十二直) theo thứ tự — đồng bộ với zheri.js
const ZHI_OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_VI = {
  建: 'Kiến', 除: 'Trừ', 满: 'Mãn', 平: 'Bình', 定: 'Định', 执: 'Chấp',
  破: 'Phá', 危: 'Nguy', 成: 'Thành', 收: 'Thu', 开: 'Khai', 闭: 'Bế',
};

// 六冲 (lục xung) — chi A xung chi B
const CHONG = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

// 三合 (tam hợp) — chi thuộc cùng cục tam hợp của nguyệt chi thì "hợp nguyệt" (cát)
const SANHE_GROUP = {
  子: 'shen', 辰: 'shen', 申: 'shen',     // Thân - Tý - Thìn (thủy cục)
  寅: 'wu', 午: 'wu', 戌: 'wu',            // Dần - Ngọ - Tuất (hỏa cục)
  巳: 'you', 酉: 'you', 丑: 'you',         // Tỵ - Dậu - Sửu (kim cục)
  亥: 'mao', 卯: 'mao', 未: 'mao',          // Hợi - Mão - Mùi (mộc cục)
};

// ============================================================================
//  BẢNG GIẢI NGHĨA KINH ĐIỂN 董公 CHO 12 TRỰC (bản rút gọn)
//  tone: 'cat' (cát) | 'binh' (bình) | 'hung' (hung)
//  good/bad: việc 宜/忌 theo 董公 thông tục
// ============================================================================
const DONGGONG_OFFICER = {
  建: {
    tone: 'cat',
    meaning: 'Ngày Kiến (建) — trực bản khí, nền móng. 「月建所临之辰」: khí tháng hội tụ, khởi đầu hữu lực.',
    advice: 'Tốt để khởi đầu việc mới, đặt nền móng, nhận chức, thượng nham. Kỵ an táng (không lợi cho người khuất mặt).',
    good: ['Khởi đầu việc mới', 'Nhận chức / thượng quan', 'Đặt nền móng', 'Ký kết khởi sự'],
    bad: ['An táng', 'Động thổ mồ mả'],
  },
  除: {
    tone: 'cat',
    meaning: 'Ngày Trừ (除) — trực trừ tà, tẩy uế. 「除旧布新」: cởi bỏ cái cũ, đón cái mới.',
    advice: 'Tốt để dọn dẹp, tẩy uế, cầu y, khám bệnh, phục thuốc, cắt đứt nhân duyệt xấu. Kỵ cưới hỏi (dễ "trừ" tình cảm).',
    good: ['Dọn dẹp / thanh tẩy', 'Cầu y / trị bệnh', 'Phục thuốc / châm cứu', 'Cắt đứt duyên xấu'],
    bad: ['Cưới hỏi (嫁娶)', 'Ký hợp đồng dài hạn'],
  },
  满: {
    tone: 'cat',
    meaning: 'Ngày Mãn (满) — trực viên mãn, sung mãn. 「满则盈」: trọn vẹn, dồi dào.',
    advice: 'Tốt để xây cất, động thổ, khánh thành, cúng tế cầu phúc. Kỵ kiện tụng (dễ "mãn" bất lợi cho nguyên đơn).',
    good: ['Xây cất / động thổ', 'Khánh thành', 'Cúng tế cầu phúc', 'Tích lũy tài sản'],
    bad: ['Kiện tụng (nguyên đơn)', 'Phạm pháp luật'],
  },
  平: {
    tone: 'binh',
    meaning: 'Ngày Bình (平) — trực bình thường, không cát không hung. 「平治道涂」: san bằng, trung hòa.',
    advice: 'Ngày trung tính — tốt cho xuất hành, di chuyển, việc đều đều. Tránh khởi đầu việc lớn (không có khí vượng).',
    good: ['Xuất hành / di chuyển', 'Việc thường nhật', 'Đi lễ chùa'],
    bad: ['Khởi đầu việc lớn', 'Đầu tư lớn'],
  },
  定: {
    tone: 'cat',
    meaning: 'Ngày Định (定) — trực an định, cố kết. 「定可安」: an cư, định liệu.',
    advice: 'Tốt để ký kết, giao dịch, đính hôn, an giường, đặt tên. Kỵ dọn nhà / di chuyển (đã "định" thì không nên "động").',
    good: ['Ký hợp đồng / giao dịch', 'Đính hôn', 'An giường / đặt tên', 'Mua sắm đồ lâu bền'],
    bad: ['Dọn nhà / di chuyển (移徙)', 'Động thổ'],
  },
  执: {
    tone: 'binh',
    meaning: 'Ngày Chấp (执) — trực chấp trì, nắm giữ. 「执守」: giữ chặt, cầm cố.',
    advice: 'Tốt để bắt giữ, thu hồi nợ, săn bắt, bảo vệ tài sản. Kỵ khởi đầu việc mới (chỉ hợp "giữ" chứ không hợp "mở").',
    good: ['Thu hồi nợ / đòi tài', 'Bắt giữ / săn bắt', 'Bảo vệ tài sản', 'Cầm cố'],
    bad: ['Khởi đầu việc mới', 'Mở rộng kinh doanh'],
  },
  破: {
    tone: 'hung',
    meaning: 'Ngày Phá (破) — trực phá hại, ngày đại hung. 「月建相冲」: chi ngày xung chi tháng.',
    advice: 'Ngày xấu — chỉ hợp phá dỡ nhà cũ, đập bỏ đồ hỏng, cắt đứt nhân duyệt. Kỵ mọi việc khởi đầu, cưới hỏi, ký kết, động thổ.',
    good: ['Phá dỡ nhà cũ / công trình', 'Đập bỏ đồ hỏng', 'Cắt đứt duyên xấu'],
    bad: ['Cưới hỏi', 'Ký hợp đồng', 'Động thổ', 'Khởi đầu việc mới', 'An táng'],
  },
  危: {
    tone: 'binh',
    meaning: 'Ngày Nguy (危) — trực nguy hiểm, cần thận trọng. 「危则险」: cao, chênh vênh.',
    advice: 'Ngày cẩn trọng — nghịch lý mà lại hợp leo núi, đăng cao, rèn luyện dũng khí. Kỵ出行 xa, xây cất cao, quyết định rủi ro.',
    good: ['Leo núi / đăng cao (nghịch lý)', 'Rèn luyện dũng khí', 'Thám hiểm'],
    bad: ['Xuất hành xa', 'Xây cất nhà cao', 'Quyết định rủi ro', 'Đầu cơ'],
  },
  成: {
    tone: 'cat',
    meaning: 'Ngày Thành (成) — trực thành tựu, vạn sự cát. 「成则就」: hoàn thành, toại nguyện.',
    advice: 'Ngày đại cát — tốt cho mọi việc mới, khai trương, cưới hỏi, ký kết, động thổ,求学. Ít việc kỵ.',
    good: ['Khai trương / mở cửa hàng', 'Cưới hỏi (嫁娶)', 'Ký hợp đồng', 'Động thổ / xây cất', 'Nhập trạch', 'Học hành / thi cử'],
    bad: ['Kiện tụng (dễ "thành" bất lợi cho bị đơn)'],
  },
  收: {
    tone: 'binh',
    meaning: 'Ngày Thu (收) — trực thu nạp, gom góp. 「收则聚」: thu gom, tích lũy.',
    advice: 'Tốt để thu hồi nợ, mua sắm, tích trữ, thu hoạch. Kỵ khởi đầu việc mới (chỉ hợp "thu" chứ không hợp "phát").',
    good: ['Thu hồi nợ', 'Mua sắm / tích trữ', 'Thu hoạch', 'An táng (có nơi luận hợp)'],
    bad: ['Khởi đầu việc mới', 'Xuất hành (dễ bị "thu" lại)'],
  },
  开: {
    tone: 'cat',
    meaning: 'Ngày Khai (开) — trực khai mở, thông đạt. 「开则通」: mở ra, thông suốt.',
    advice: 'Ngày cát — tốt để khai trương, mở rộng, khai giảng, xuất hành, cầu quan. Kỵ an táng (mở mà lại chôn thì nghịch).',
    good: ['Khai trương / mở rộng', 'Khai giảng / nhập học', 'Xuất hành', 'Cầu quan / thăng chức', 'Mở tài khoản'],
    bad: ['An táng', 'Phóng sinh ngược ý'],
  },
  闭: {
    tone: 'hung',
    meaning: 'Ngày Bế (闭) — trực bế tắc, đóng lại. 「闭则塞」: đóng, tắc nghẽn.',
    advice: 'Ngày hung — chỉ hợp đóng cửa, chốt sổ, kết thúc, chôn cất. Kỵ mở bất cứ thứ gì (khai trương, mở tài khoản, khởi sự).',
    good: ['Đóng cửa / chốt sổ', 'Kết thúc công việc', 'An táng / điếu phúng', 'Tuyệt giao'],
    bad: ['Khai trương / mở cửa hàng', 'Mở tài khoản', 'Khởi sự việc mới', 'Cưới hỏi', 'Động thổ'],
  },
};

// ============================================================================
//  BIẾN THỂ THEO THÁNG (月建) — 董公 đặc biệt nhấn mạnh một số trực cát/hung
//  ở tháng nhất định. Key = `${officer}@${monthZhi}`.
//  Ý nghĩa override/ bổ sung cho bảng chung.
// ============================================================================
const DONGGONG_MONTH_VARIANT = {
  // 破日 luôn xung chi tháng → nguy hiểm, nhưng 董公 nêu rõ tháng cụ thể
  '破@巳': { note: 'Tỵ月破日 = đại hung, kỵ tuyệt đối mọi việc.', extraTone: 'hung' },
  '破@亥': { note: 'Hợi月破日 = đại hung, kỵ tuyệt đối.', extraTone: 'hung' },
  '破@子': { note: 'Tý月破日 = hung rất nặng (xung wintersolstice khí).', extraTone: 'hung' },
  '破@午': { note: 'Ngọ月破日 = hung nặng (xung hạ chí khí).', extraTone: 'hung' },

  // 成日: tháng Dần/Ngọ/Tuất (hỏa cục) → đặc biệt cát cho hôn nhân
  '成@寅': { note: 'Dần月成日 = thượng cát cho hôn nhân / khởi sự.', extraTone: 'cat' },
  '成@午': { note: 'Ngọ月成日 = đại cát cho khai trương.', extraTone: 'cat' },
  '成@戌': { note: 'Tuất月成日 = cát cho tích lũy / hợp đồng.', extraTone: 'cat' },

  // 开日: tháng Thân/Tý/Thìn (thủy cục) → cát cho cầu quan
  '开@申': { note: 'Thân月开日 = cát cho cầu quan / thăng chức.', extraTone: 'cat' },
  '开@子': { note: 'Tý月开日 = cát cho khai trí / học hành.', extraTone: 'cat' },

  // 建日: chính ngày月建 trùng chi → "建日" mạnh nhất, 董公 gọi là "月建"
  '建@寅': { note: 'Dần月建日 (Dần) = nguyên khí mạnh, cực hợp khởi đầu năm.', extraTone: 'cat' },
  '建@子': { note: 'Tý月建日 (Tý) = khởi đầu đông, hợp tích tụ.', extraTone: 'cat' },

  // 满日: tháng Mão (mộc vượng) → dễ "mãn" quá, kỵ kiêu ngạo
  '满@卯': { note: 'Mão月满日 = viên mãn nhưng dễ sinh kiêu, giữ khiêm.', extraTone: 'binh' },
};

// ============================================================================
//  TÍNH TRỰC (officer) cho một ngày — đồng bộ logic với zheri.js
// ============================================================================
function computeOfficer(dayZhi, monthZhi) {
  const oIdx = ((ZHI_ORDER.indexOf(dayZhi) - ZHI_ORDER.indexOf(monthZhi)) + 12) % 12;
  return ZHI_OFFICERS[oIdx];
}

// ============================================================================
//  LUẬN NGÀY THEO ĐỔNG CÔNG
// ============================================================================
/**
 * Luận một ngày dương lịch theo 董公择日 (rút gọn).
 * @param {number} year, month, day — ngày dương lịch
 * @returns {{
 *   solar, lunar, dayGanZhi, dayGan, dayZhi, monthZhi,
 *   officer, officerVi, tone, meaning, advice, good: string[], bad: string[],
 *   monthNote, chongMonth, heMonth, score, rating, activities
 * }}
 */
export function donggongDay(year, month, day) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const monthZhi = lunar.getMonthZhi();

  const officer = computeOfficer(dayZhi, monthZhi);
  const officerVi = OFFICER_VI[officer];
  const base = DONGGONG_OFFICER[officer];

  // Biến thể theo tháng
  const variant = DONGGONG_MONTH_VARIANT[`${officer}@${monthZhi}`];
  const monthNote = variant ? variant.note : null;

  // 冲月 / 合月 kiểm
  const chongMonth = CHONG[dayZhi] === monthZhi;   // chi ngày xung chi tháng
  // [loop 549 FIX] hợp tháng: 通胜«日辰与月建六合为吉» = LỤC HỢP (子丑/寅亥/卯戌/辰酉/巳申/午未),
  //   trước đây CHỈ xét tam hợp cục → sót ~92% ngày lục hợp. Nay xét cả lục hợp lẫn tam hợp.
  const LIUHE = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };
  const heMonth = (LIUHE[dayZhi] === monthZhi) || (SANHE_GROUP[dayZhi] === SANHE_GROUP[monthZhi] && dayZhi !== monthZhi);

  // Xác định tone cuối (variant có thể đè)
  let tone = base.tone;
  if (variant && variant.extraTone === 'hung') tone = 'hung';
  else if (variant && variant.extraTone === 'cat') tone = 'cat';
  else if (variant && variant.extraTone === 'binh') tone = 'binh'; // [loop 549 FIX] thiếu nhánh binh
  // Phá nhật luôn xung tháng → đảm bảo hung
  if (officer === '破') tone = 'hung';

  // Chấm điểm 董公 (0-100)
  let score = 50;
  if (tone === 'cat') score += 22;
  else if (tone === 'hung') score -= 22;
  if (heMonth) score += 10;       // hợp tháng = cát gia tăng
  if (chongMonth) score -= 12;    // xung tháng = hung gia tăng (Phá nhật đã -22, cộng thêm -12)
  // Thành/Khai là hai trực mạnh nhất
  if (officer === '成') score += 6;
  if (officer === '开') score += 4;
  if (officer === '闭' || officer === '破') score -= 4;

  score = Math.max(5, Math.min(97, Math.round(score)));

  let rating;
  // [loop 460] recalibrate: 董公 score BIMODAL + neutral spike — bad cluster 12-24, ~30% ngày
  //   tại baseline 50, good cluster 60-88, dải 25-49 TRỐNG. Cũ «Hơi kỵ» (30-45) = DEAD tier.
  //   Hạ ngưỡng «Hơi kỵ» xuống 18 để tách bad cluster (18-24=Hơi kỵ, <18=Kỵ) — cả tier reachable.
  if (score >= 75) rating = 'Đại cát';
  else if (score >= 60) rating = 'Cát';
  else if (score >= 45) rating = 'Bình';
  else if (score >= 18) rating = 'Hơi kỵ';
  else rating = 'Kỵ';

  // activities: gom good list thành phrase ngắn cho UI
  const activities = base.good.slice(0, 4);

  const toneVi = tone === 'cat' ? 'CÁT' : tone === 'hung' ? 'HUNG' : 'BÌNH';

  return {
    solar: solar.toYmd(),
    lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    dayGanZhi: dayGan + dayZhi,
    dayGan, dayZhi, monthZhi,
    officer, officerVi, tone, toneVi,
    meaning: base.meaning,
    advice: base.advice,
    good: base.good,
    bad: base.bad,
    monthNote,
    chongMonth, heMonth,
    score, rating, activities,
  };
}

// ============================================================================
//  QUÉT CẢ THÁNG — top 3 cát + top 3 hung (theo 董公)
// ============================================================================
/**
 * Quét mọi ngày trong một tháng dương lịch, trả 3 ngày tốt nhất + 3 xấu nhất.
 * @param {number} year, month
 * @returns {{ year, month, best3: object[], worst3: object[], total }}
 */
export function donggongInMonth(year, month) {
  const all = [];
  const dim = new Date(year, month, 0).getDate(); // số ngày trong tháng
  for (let d = 1; d <= dim; d++) {
    try {
      all.push(donggongDay(year, month, d));
    } catch (e) { /* bỏ ngày lỗi lunar */ }
  }
  const best3 = [...all].sort((a, b) => b.score - a.score).slice(0, 3);
  const worst3 = [...all].sort((a, b) => a.score - b.score).slice(0, 3);
  return {
    year, month, total: all.length,
    best3: best3.map((r) => ({ solar: r.solar, gz: r.dayGanZhi, officer: r.officer, officerVi: r.officerVi, rating: r.rating, score: r.score, activities: r.activities })),
    worst3: worst3.map((r) => ({ solar: r.solar, gz: r.dayGanZhi, officer: r.officer, officerVi: r.officerVi, rating: r.rating, score: r.score, bad: r.bad.slice(0, 3) })),
  };
}

// Export bảng cho selftest / external
export { ZHI_OFFICERS, OFFICER_VI, DONGGONG_OFFICER, DONGGONG_MONTH_VARIANT, CHONG, SANHE_GROUP, computeOfficer };
