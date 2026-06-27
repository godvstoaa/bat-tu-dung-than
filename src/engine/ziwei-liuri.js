// ============================================================================
//  TỬ VI LƯU NHẬT / LƯU THỜI 紫微流日流时 — VẬN TỪNG NGÀY & TỪNG GIỜ
//
//  CHUẨN (斗君-based, đồng bộ ziwei-liuyue.js + iztro/《紫微斗数全书》):
//
//  ① 流月命宫 idx (không gian địa chi, 0=子):
//       liuyueIdx = (yearZhiIdx - birthMonth + birthHourZhiIdx + currentMonth) mod 12
//     (= 斗君 cung [chính月] + (currentMonth − 1) cung thuận hành)
//
//  ② 流日命宫 idx:
//       liuriIdx = (liuyueIdx + lunarDay - 1) mod 12
//     Quy tắc: "以流月所在宫起初一，顺行十二宫，一日一宫"
//
//  ③ 流时命宫 idx:
//       liushiIdx = (liuriIdx + hourZhiIdx) mod 12
//     Quy tắc: "以流日所在宫起子时，顺布十二宫"
//
//  Cung được kích hoạt + tứ hóa theo can ngày/giờ = chủ đề nổi bật ngày/giờ.
//
//  SỬA (cycle 60): bản cũ dùng (natal命宫 idx + lunarDay − 1) mod 12 —
//  MONTH-BLIND (初一 mọi tháng → cùng 1 cung). Chuẩn phải neo vào 流月 cung
//  (bản thân dịch chuyển mỗi tháng theo 斗君), rồi +lunarDay−1. Nay đã sửa
//  theo iztro FunctionalAstrolabe.ts::_getHoroscopeBySolarDate
//  (monthlyIndex/dailyIndex/hourlyIndex), đối chiếu 文墨天机.
//
//  Nguồn: iztro (SylarLong/iztro), 悟行阁 流月流日流时, 紫微斗数全书.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { computeZiwei, computeSihua } from './ziwei.js';
import { ziweiLiuyueContext } from './ziwei-liuyue.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Chủ đề cung (đồng bộ ziwei-liunian.js)
const PALACE_THEME = {
  命宫: 'bản thân, sức khoẻ, tính cách, tổng quan',
  兄弟: 'anh chị em, bạn bè, đồng nghiệp, hợp tác',
  夫妻: 'phối ngẫu, tình cảm, hôn nhân',
  子女: 'con cái, học trò, cấp dưới',
  财帛: 'tài chính, tiền bạc, thu nhập',
  疾厄: 'sức khoẻ, bệnh tật, thể chất',
  迁移: 'xuất ngoại, di chuyển, thay đổi',
  奴仆: 'bạn bè, nhân viên, quan hệ ngoài',
  官禄: 'sự nghiệp, công danh, chức vụ',
  田宅: 'nhà cửa, bất động sản, gia đình',
  福德: 'phúc đức, tinh thần, tâm lý',
  父母: 'cha mẹ, người trên, cấp trên',
};

// Sao cát / hung (đồng bộ ziwei-liunian.js)
const CAT_STARS = ['紫微','天府','太阳','太阴','武曲','天相','左辅','右弼','文昌','文曲','天魁','天钺'];
const HUNG_STARS = ['七杀','破军','贪狼','巨门','廉贞','擎羊','陀罗'];

// Khoảng giờ cho mỗi địa chi (时辰)
const HOUR_RANGE = {
  子: '23:00–01:00', 丑: '01:00–03:00', 寅: '03:00–05:00', 卯: '05:00–07:00',
  辰: '07:00–09:00', 巳: '09:00–11:00', 午: '11:00–13:00', 未: '13:00–15:00',
  申: '15:00–17:00', 酉: '17:00–19:00', 戌: '19:00–21:00', 亥: '21:00–23:00',
};

/**
 * Đánh giá tone (cat/mid/hung) cho một cung dựa trên sao + tứ hóa rơi trúng cung.
 */
function evalTone(stars, sihuaValues) {
  const catStars = stars.filter((s) => CAT_STARS.includes(s));
  const hungStars = stars.filter((s) => HUNG_STARS.includes(s));
  const hasLu = sihuaValues.some((v) => v.star && stars.includes(v.star) && v.tone === 'cat');
  const hasJi = sihuaValues.some((v) => v.star && stars.includes(v.star) && v.tone === 'hung');
  let tone;
  if (catStars.length >= 2 || hasLu) tone = 'cat';
  else if (hungStars.length >= 2 || hasJi) tone = 'hung';
  else tone = 'mid';
  return { tone, catStars, hungStars, hasLu, hasJi };
}

/**
 * Lấy thông tin cung theo index trong ZHI_ORDER, kèm tone + ý nghĩa.
 */
function gongInfo(z, gongIdx, sihuaValues) {
  const gongZhi = ZHI_ORDER[((gongIdx % 12) + 12) % 12];
  const palace = z.palaces.find((p) => p.zhi === gongZhi);
  const stars = palace?.stars || [];
  // [loop 548 FIX BUG3] gộp hung tinh phụ (擎羊/陀罗/火铃/空劫 từ z.fuxing) tại cung này
  //   vào đánh giá tone — trước đây evalTone mù với chúng (chỉ thấy 14 chính tinh).
  const FU_HUNG = ['擎羊','陀罗','火星','铃星','地空','地劫'];
  const fuHungAtGong = (z.fuxing?.stars || [])
    .filter((s) => FU_HUNG.includes(s.star) && s.atZhi === gongZhi)
    .map((s) => s.star);
  const starsWithFu = stars.concat(fuHungAtGong);
  const { tone, catStars, hungStars, hasLu, hasJi } = evalTone(starsWithFu, sihuaValues);
  return {
    index: ((gongIdx % 12) + 12) % 12,
    zhi: gongZhi,
    zh: palace?.zh || '?',
    vi: palace?.vi?.split('(')[0]?.trim() || '?',
    stars,
    tone,
    catStars,
    hungStars,
    hasLu,
    hasJi,
    meaning: PALACE_THEME[palace?.zh] || '?',
  };
}

/**
 * Tính Tử Vi lưu nhật cho 1 ngày dương lịch.
 * @param {object} R - kết quả chart (có R.input) hoặc object có {year,month,day,hour,minute,gender}
 * @param {number} year - dương lịch năm
 * @param {number} month - dương lịch tháng
 * @param {number} day - dương lịch ngày
 * @returns {{ lunarDay, dayGanZhi, liuriGong, liuriSihua:[], summary }}
 */
export function ziweiLiuri(R, year, month, day) {
  const inp = R?.input || R;
  const z = computeZiwei(inp.year, inp.month, inp.day, inp.hour ?? 12, inp.minute ?? 0, inp.gender);

  // Ngày âm lịch + can chi ngày
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const lunarDay = lunar.getDay();        // 1..30
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();

  // --- CHUẨN 斗君-based (đồng bộ ziwei-liuyue.js + iztro) ---
  // ① 流月 cung idx cho tháng âm chứa ngày này:
  //    liuyueIdx = (yearZhiIdx - birthMonth + birthHourZhiIdx + currentMonth) mod 12
  const ctx = ziweiLiuyueContext(inp, year, month, day);
  const liuyueIdx = ctx.liuyueIdx;

  // ② 流日命宫 idx = (流月 cung idx + lunarDay - 1) mod 12
  //    "以流月所在宫起初一，顺行十二宫，一日一宫"
  const liuriIdx = ((liuyueIdx + lunarDay - 1) % 12 + 12) % 12;

  // Tứ hóa theo can NGÀY (流日四化)
  const allStars = { ...(z.mainStars || {}) };
  for (const s of (z.fuxing?.stars || [])) allStars[s.star] = s.atZhi;
  const daySihuaMap = computeSihua(dayGan, allStars).sihua;
  const sihuaValues = Object.values(daySihuaMap);

  const liuriGong = gongInfo(z, liuriIdx, sihuaValues);

  // Liệt kê 4 hóa rơi cung nào + ý nghĩa (chỉ khi placed)
  const liuriSihua = ['禄', '权', '科', '忌'].map((k) => {
    const v = daySihuaMap[k];
    const palace = v?.palace ? z.palaces.find((p) => p.zhi === v.palace) : null;
    return {
      hua: k,
      star: v?.star || '?',
      palace: v?.palace || null,
      palaceVi: palace?.vi?.split('(')[0]?.trim() || null,
      theme: palace ? (PALACE_THEME[palace.zh] || '?') : null,
      tone: v?.tone || (k === '忌' ? 'hung' : 'cat'),
      meaning: SIHUA_DAY_MEANING[k],
    };
  });

  const summary = `Lưu nhật ${dayGan}${dayZhi} (âm ${lunarDay}/${lunar.getMonth()}): lưu nguyệt @${ctx.liuyueZhi} → mệnh cung lưu nhật tại ${liuriGong.zhi} — ${liuriGong.vi} (chủ đề: ${liuriGong.meaning}). Tone ${TONE_VI[liuriGong.tone]}. Tứ hóa ngày ${dayGan}: ${liuriSihua.map((s) => s.hua + s.star + (s.palace ? '@' + s.palace : '')).join(' ')}.`;

  return {
    solar: solar.toYmd(),
    lunarDay,
    lunarMonth: lunar.getMonth(),
    dayGanZhi: dayGan + dayZhi,
    dayGan,
    // Neo 斗君-based (cycle-60 fix): 流月 cung cho tháng này + 流日 = 流月 + (lunarDay−1)
    liuyueIdx: ctx.liuyueIdx,
    liuyueZhi: ctx.liuyueZhi,
    yearZhiIdx: ctx.yearZhiIdx,
    birthLunarMonth: ctx.birthLunarMonth,
    birthHourZhiIdx: ctx.birthHourZhiIdx,
    currentLunarMonth: ctx.currentLunarMonth,
    liuriGong,
    liuriSihua,
    summary,
  };
}

/**
 * Tính Tử Vi lưu thời cho 1 ngày + giờ.
 * @param {object} R - kết quả chart hoặc input
 * @param {number} year/month/day - dương lịch
 * @param {number} hour - giờ dương lịch (0..23)
 * @returns {{ hourZhi, hourRange, liushiGong, summary }}
 */
export function ziweiLiushi(R, year, month, day, hour) {
  const inp = R?.input || R;
  const z = computeZiwei(inp.year, inp.month, inp.day, inp.hour ?? 12, inp.minute ?? 0, inp.gender);

  // Giờ địa chi (23:00–00:59 = 子, rồi mỗi 2 tiếng +1)
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const hourZhi = solar.getLunar().getTimeZhi();
  const hourZhiIdx = ZHI_ORDER.indexOf(hourZhi);

  // Lưu nhật mệnh cung idx (lấy từ ziweiLiuri để giữ nhất quán)
  const liuri = ziweiLiuri(R, year, month, day);
  const liuriIdx = liuri.liuriGong.index;

  // 流时命宫 idx = (流日命宫 idx + hourZhi idx) % 12
  const liushiIdx = ((liuriIdx + hourZhiIdx) % 12 + 12) % 12;

  // Tứ hóa theo can ngày (dùng lại cho tone)
  const allStars = { ...(z.mainStars || {}) };
  for (const s of (z.fuxing?.stars || [])) allStars[s.star] = s.atZhi;
  const dayGan = liuri.dayGan;
  const sihuaValues = Object.values(computeSihua(dayGan, allStars).sihua);

  const liushiGong = gongInfo(z, liushiIdx, sihuaValues);

  const summary = `Lưu thời ${hourZhi} (${HOUR_RANGE[hourZhi]}): mệnh cung lưu thời tại ${liushiGong.zhi} — ${liushiGong.vi} (chủ đề: ${liushiGong.meaning}). Tone ${TONE_VI[liushiGong.tone]}.`;

  return {
    hour,
    hourZhi,
    hourRange: HOUR_RANGE[hourZhi],
    liushiGong,
    summary,
  };
}

/**
 * Tổng hợp lưu nhật + 12 lưu thời trong ngày — phục vụ UI card "hôm nay sao?".
 * @param {object} R - kết quả chart hoặc input
 * @param {string|Date} scanDate - 'YYYY-MM-DD' hoặc Date; mặc định hôm nay
 * @returns {{ liuri, hours:[], bestHours:[], worstHours:[] }}
 */
export function ziweiDailyZiwei(R, scanDate) {
  let y, m, d;
  if (scanDate instanceof Date) {
    y = scanDate.getFullYear(); m = scanDate.getMonth() + 1; d = scanDate.getDate();
  } else if (typeof scanDate === 'string' && scanDate) {
    [y, m, d] = scanDate.split('-').map(Number);
  } else {
    const now = new Date();
    y = now.getFullYear(); m = now.getMonth() + 1; d = now.getDate();
  }

  const liuri = ziweiLiuri(R, y, m, d);

  // 12时辰 — đại diện bởi giờ giữa mỗi khoảng (子=0, 丑=2, ... 亥=21)
  const hourSamples = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 21];
  const hours = [];
  for (const h of hourSamples) {
    try {
      const ls = ziweiLiushi(R, y, m, d, h);
      hours.push({
        hourZhi: ls.hourZhi,
        hourRange: ls.hourRange,
        gongZhi: ls.liushiGong.zhi,
        gongVi: ls.liushiGong.vi,
        gongZh: ls.liushiGong.zh,
        meaning: ls.liushiGong.meaning,
        tone: ls.liushiGong.tone,
        stars: ls.liushiGong.stars,
      });
    } catch (e) {
      // bỏ qua giờ lỗi (an toàn, không crash)
    }
  }

  // best/worst theo tone: cat trước, hung cuối
  const toneRank = { cat: 0, mid: 1, hung: 2 };
  const sorted = [...hours].sort((a, b) => toneRank[a.tone] - toneRank[b.tone]);
  const bestHours = sorted.filter((h) => h.tone === 'cat').slice(0, 3);
  const worstHours = sorted.filter((h) => h.tone === 'hung').slice(-3).reverse();

  return { liuri, hours, bestHours, worstHours };
}

const TONE_VI = { cat: 'Cát (thuận)', mid: 'Bình hòa', hung: 'Hung (cẩn thận)' };
const SIHUA_DAY_MEANING = {
  禄: 'Hóa Lộc: duyên, tài lộc, thuận lợi — cung được kích hoạt sinh khí',
  权: 'Hóa Quyền: quyền lực, chủ động, đột phá — cung tăng sức',
  科: 'Hóa Khoa: danh tiếng, quý nhân, học vấn — cung được nâng đỡ',
  忌: 'Hóa Kỵ: trở ngại, thị phi, phiền muộn — cung bị nghẽn/cần cẩn thận',
};

export { ZHI_ORDER, PALACE_THEME, HOUR_RANGE, TONE_VI, SIHUA_DAY_MEANING };
