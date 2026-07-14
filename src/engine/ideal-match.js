// ============================================================================
//  PHỐI NGỖU LÝ TƯỞNG — TÍNH TOÁN ra lá số partner/con cái tối ưu cho user
//  KHÔNG bịa — mà SCAN hàng trăm ngày sinh, tính Bát Tự + 合婚 score, tìm
//  top matches có Dụng Thần bổ nhau + ngũ hành tương bổ + 生肖 hợp.
//  Output = "profile tham khảo" (ngày sinh lý tưởng + chart + score + tên gợi ý).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyze } from './chart.js';
import { computeHehun } from './hehun.js';
import { GAN, ZHI, WX_VI, KE, KE_BY, SHENG, SHENG_BY } from './constants.js';

const ZHI12 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SANHE = [['申','子','辰'],['寅','午','戌'],['巳','酉','丑'],['亥','卯','未']];
const LIUHE = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];

function zhiRel(a, b) {
  if (a === b) return 'tự';
  for (const p of LIUHE) if ((p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a)) return 'lục hợp';
  const ca = {子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
  if (ca[a]===b) return 'xung';
  for (const t of SANHE) if (t.includes(a)&&t.includes(b)) return 'tam hợp';
  return 'bình';
}

/**
 * Scan ngày sinh → tìm partner có Bát Tự + 合婚 TỐT NHẤT cho user.
 * @param {object} R - user's analyze() result
 * @param {object} opts - { ageMin, ageMax, gender }
 * @returns [{ rank, date, time, ganZhi4, dayMaster, hehunScore, hehunRating, rel, note }]
 */
export function findIdealPartners(R, opts = {}) {
  const userYear = R.chart.input.year;
  const ageMin = opts.ageMin || -5;
  const ageMax = opts.ageMax || 5;
  const gender = opts.gender || 'nu'; // partner gender (default opposite for hetero)
  const yStart = userYear + ageMin;
  const yEnd = userYear + ageMax;
  const userZhi = R.chart.pillars.year.zhi;
  const userDayGan = R.chart.dayGan;
  const userYong = R.yong;
  // Dụng thần của user → partner NÊN có hành này vượng (bổ user)
  // Partner NÊN có Dụng = hành khắc/kìm user's Kỵ (để partner "trị" được Kỵ của user)
  const goodForUser = [userYong.primary, userYong.xi]; // hành partner nên MANG (vượng)

  const candidates = [];
  const times = [0, 6, 10, 14, 18, 22]; // 6 representative times

  for (let y = yStart; y <= yEnd; y++) {
    for (let m = 1; m <= 12; m++) {
      // representative day = 15th (mid-month, safe for month pillar)
      const d = 15;
      for (const h of times) {
        try {
          const pR = analyze(y, m, d, h, 0, gender, 2026);
          // 1. Partner 日主 should be user's Dụng/Hỷ (ideally)
          const pDm = pR.chart.dayMaster.wx;
          const dmIsGood = goodForUser.includes(pDm);
          // 2. Hehun score
          const hh = computeHehun(R, pR);
          // 3. Combined score: hehun + dm bonus
          let score = hh.score;
          if (dmIsGood) score += 10; // partner 日主 = user Dụng → big bonus
          // 4. Partner's Dụng should NOT be user's Kỵ (互不损伤)
          const pYong = pR.yong;
          if (!userYong.avoid.includes(pYong.primary)) score += 3;
          score = Math.max(5, Math.min(98, Math.round(score))); // [loop 550 FIX] clamp [5,98] — tránh vượt 100

          const ganZhi4 = ['year','month','day','time'].map(k =>
            pR.chart.pillars[k].gan + pR.chart.pillars[k].zhi).join(' ');
          const yearRel = zhiRel(userZhi, pR.chart.pillars.year.zhi);
          const dayRel = (() => {
            const ug = userDayGan, pg = pR.chart.dayGan;
            const GAN_HE = {甲:'己',己:'甲',乙:'庚',庚:'乙',丙:'辛',辛:'丙',丁:'壬',壬:'丁',戊:'癸',癸:'戊'};
            return GAN_HE[ug] === pg ? 'can hợp' : '';
          })();

          candidates.push({
            date: `${y}-${String(m).padStart(2,'0')}-${d}`,
            time: `${String(h).padStart(2,'0')}:30`,
            ganZhi4,
            dayMaster: pR.chart.dayMaster.gan + ' ' + pR.chart.dayMaster.vi + ' (' + WX_VI[pDm] + ')',
            dmWx: pDm,
            dmIsGood,
            yongPrimary: pYong.primary,
            hehunScore: hh.score,
            hehunRating: hh.rating,
            combinedScore: score,
            yearRel,
            dayRel,
            chart: pR,
          });
        } catch (e) { /* skip invalid date */ }
      }
    }
  }

  // Rank by combined score
  // DIVERSIFY: best per year, then top 5 across different years
  candidates.sort((a, b) => b.combinedScore - a.combinedScore);
  const byYear = {};
  candidates.forEach(c => { const yr = c.date.split("-")[0]; if (!byYear[yr] || c.combinedScore > byYear[yr].combinedScore) byYear[yr] = c; });
  const top = Object.values(byYear).sort((a,b) => b.combinedScore - a.combinedScore) .slice(0, 10).map((c, i) => ({
    rank: i + 1,
    ...c,
    note: buildPartnerNote(c, R),
    nameHint: buildNameHint(c.chart.yong.primary),
  }));
  return { totalScanned: candidates.length, top };
}

function buildPartnerNote(c, R) {
  const parts = [];
  if (c.dmIsGood) parts.push(`Nhật Chủ ${c.dayMaster} = hành Dụng/Hỷ của bạn → BỔ MỆNH trực tiếp`);
  parts.push(`Hợn: ${c.hehunRating} (${c.hehunScore}/100)`);
  if (c.yearRel !== 'bình') parts.push(`生肖: ${c.yearRel} với tuổi bạn`);
  if (c.dayRel) parts.push(`Nhật Can: ${c.dayRel} (tâm đầu ý hợp)`);
  parts.push(`Partner Dụng: ${WX_VI[c.yongPrimary]} — ${R.yong.avoid.includes(c.yongPrimary) ? '⚠ trùng Kỵ của bạn' : '✓ không tổn Dụng của nhau'}`);
  return parts.join(' · ');
}

function buildNameHint(element) {
  const names = {
    木: { chars: '林(Lâm) 松(Tùng) 柏(Bách) 荣(Vinh) 华(Hoa) 茂(Mậu) 芳(Phương) 兰(Lan) 春(Xuân) 东(Đông)', vi: 'chữ mang hành Mộc — ý nghĩa cây cỏ, mùa xuân, sự sinh trưởng' },
    火: { chars: '炎(Viêm) 明(Minh) 辉(Huy) 烨(Diệp) 灿( Sán) 红(Hồng) 南(Nam) 夏(Hạ) 光(Quang) 阳(Dương)', vi: 'chữ mang hành Hỏa — ý nghĩa sáng sủa, nhiệt tình, danh tiếng' },
    土: { chars: '坤(Khôn) 城(Thành) 垣(Viên) 培(Bồi) 坚(Kiên) 均(Quân) 堂(Đường) 基(Cơ) 硕(Thạc) 岩(Nham)', vi: 'chữ mang hành Thổ — ý nghĩa đất đai, vững chắc, ổn định' },
    金: { chars: '钧(Quân) 钰(Ngọc) 锋(Phong) 铭(Minh) 铮(Tranh) 锐(Nhuệ) 锦(Cẩm) 鑫(Tham) 银(Ngân) 钢(Cương)', vi: 'chữ mang hành Kim — ý nghĩa quý giá, sắc bén, cứng rắn' },
    水: { chars: '涛(Đào) 海(Hải) 泽(Trạch) 渊(Uyên) 浩(Hạo) 润(Nhuận) 涵(Hàm) 清(Thanh) 源(Nguyên) 深(Thâm)', vi: 'chữ mang hành Thủy — ý nghĩa nước, sự uyên bác, lưu thông' },
  };
  return names[element] || names['土'];
}

// ---- THỜI ĐIỂM SINH CON — exhaustive scan + scoring 0-100 THẬT ----
// [upgrade] Trước đây chỉ sample year-pillar (trần 78, clamp 95 không tới, không tìm max thật).
//   Nay SCAN TOÀN CỤC 16 năm × 31 ngày × 12 giờ (lunar lightweight ~0.02ms/lá số ≈ 1.5s tổng),
//   chấm điểm CẢ (a) phù hợp phụ huynh LẪN (b) chất lượng lá số con (Thân trung hòa).
//   → surface lá số ĐIỂM CAO NHẤT thực sự, thang 0-100 thật, cache theo lá số phụ huynh.
const CHONG_MAP = {子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
const GAN_HE = {甲:'己',己:'甲',乙:'庚',庚:'乙',丙:'辛',辛:'丙',丁:'壬',壬:'丁',戊:'癸',癸:'戊'};
const _SHICHEN = [0,2,4,6,8,10,12,14,16,18,20,22];
let _childCache = null; // { key, scan: Map<year, chartArr> }

function _childKey(R) {
  const i = R.chart.input || {};
  return [R.chart.dayGan, R.chart.dayZhi, i.gender, i.year, R.yong && R.yong.primary].join('|');
}

// Chấm điểm 1 lá số con (8 chữ khí chính) từ góc nhìn phụ huynh R — thang 0-100 thật.
function _scoreChild(p, R) {
  const userYong = R.yong || {};
  const userDayGan = R.chart.dayGan;
  const userYearZhi = R.chart.pillars.year.zhi;
  const userDayZhi = R.chart.dayZhi;
  const dmGan = p.dayGan, dmWx = GAN[dmGan].wx;
  const isMale = (R.chart.input && R.chart.input.gender) === 'nam';
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : SHENG[R.chart.dayMaster.wx]; // sao con của PHỤ HUYNH

  // Phân bố ngũ hành 8 chữ (khí chính; tàng can bỏ qua cho tốc độ)
  const wx = { 木:0, 火:0, 土:0, 金:0, 水:0 };
  for (const g of [p.yearGan,p.monthGan,p.dayGan,p.timeGan]) wx[GAN[g].wx]++;
  for (const z of [p.yearZhi,p.monthZhi,p.dayZhi,p.timeZhi]) wx[ZHI[z].wx]++;
  const total = 8;

  // (b) CHẤT LƯỢNG lá số con — Thân trung hòa (ratio ~0.5) là lý tưởng [0..40]
  const resourceWx = SHENG_BY[dmWx];
  const ratio = (wx[dmWx] + wx[resourceWx]) / total;
  const balance = Math.max(0, 1 - Math.abs(ratio - 0.5) * 2);
  let quality = balance * 40;
  const maxWx = Math.max.apply(null, Object.values(wx));
  if (maxWx / total > 0.5) quality -= 5; // 1 hành độc tôn → bớt tốt

  // (a) PHÙ HỢP PHỤ HUYNH [0..25]
  const goodForUser = [userYong.primary, userYong.xi].filter(Boolean);
  const avoid = userYong.avoid || [userYong.ji, userYong.chou].filter(Boolean);
  let parentFit = 0;
  if (goodForUser.includes(dmWx)) parentFit += 15;          // Nhật Chủ con = Dụng/Hỷ → BỔ MỆNH
  if (avoid.length && wx[avoid[0]] >= 3) parentFit -= 8;    // con mang nhiều Kỵ của bạn
  if (CHONG_MAP[userYearZhi] === p.yearZhi) parentFit -= 5; // năm con xung tuổi bạn
  parentFit = Math.max(0, Math.min(25, parentFit));

  // sao con [0..10]
  const hasChildStar = dmWx === childWx || ZHI[p.dayZhi].wx === childWx || ZHI[p.yearZhi].wx === childWx || ZHI[p.monthZhi].wx === childWx;
  const childStar = hasChildStar ? 10 : 0;

  // (c) HÒA HỢP phụ huynh-con [0..15]
  let harmony = 8;
  if (CHONG_MAP[userDayZhi] === p.dayZhi) harmony -= 8;   // trụ ngày xung nhau
  if (GAN_HE[userDayGan] === p.dayGan) harmony += 7;      // can ngày hợp (tâm đầu)
  harmony = Math.max(0, Math.min(15, harmony));

  const score = Math.max(0, Math.min(100, Math.round(10 + parentFit + quality + childStar + harmony)));

  const notes = [];
  if (goodForUser.includes(dmWx)) notes.push(`Nhật Chủ con = ${WX_VI[dmWx]} (Dụng/Hỷ bạn) → BỔ MỆNH`);
  notes.push(`Mệnh con: ${ratio >= 0.55 ? 'vượng' : ratio <= 0.45 ? 'nhược' : 'TRUNG HOÀ'} (${Math.round(ratio*100)}%)`);
  if (hasChildStar) notes.push(`Mang hành sao con (${WX_VI[childWx]}) → duyên con tốt`);
  if (CHONG_MAP[userYearZhi] === p.yearZhi) notes.push(`⚠ Năm con xung tuổi bạn`);
  if (CHONG_MAP[userDayZhi] === p.dayZhi) notes.push(`⚠ Trụ ngày xung trụ ngày bạn`);
  if (GAN_HE[userDayGan] === p.dayGan) notes.push(`Can ngày con hợp can bạn (tâm đầu)`);
  return { score, ratio, dmWx, notes };
}

// Chấm điểm RICH lá số con — dùng analyze() thật (tàng can, effRatio, xung nội tại, cách cục).
// Đây là bộ PHÂN BIỆT thật: 2 chart cùng "cân bằng" khí chính sẽ khác nhau ở tàng can/clashes/cách cục.
function _scoreChildRich(cR, R) {
  const userYong = R.yong || {};
  const userDayGan = R.chart.dayGan;
  const userDayZhi = R.chart.dayZhi;
  const userYearZhi = R.chart.pillars.year.zhi;
  const dmWx = cR.chart.dayMaster.wx;

  // (b) CHẤT LƯỢNG lá số con (real, từ analyze) [0..55]
  const eff = (cR.strength && typeof cR.strength.effRatio === 'number') ? cR.strength.effRatio : 0.5;
  const balance = Math.max(0, 1 - Math.abs(eff - 0.5) * 2);     // Thân trung hòa (effRatio~0.5) = tốt nhất
  let quality = balance * 30;                                    // 0..30

  const ws = (cR.wx && cR.wx.score) || {};                       // wx thật (có tàng can)
  const total = Object.values(ws).reduce((a, b) => a + (b || 0), 0) || 1;
  const maxPct = Math.max.apply(null, Object.values(ws).map((v) => (v || 0) / total));
  quality += Math.max(0, 1 - Math.max(0, maxPct - 0.35) * 2) * 10; // ngũ hành không độc tôn (>35% bị trừ) [0..10]

  const ix = cR.interactions || {};                              // xung/hình/hại nội tại → trừ
  const clashes = (ix.chong||[]).length + (ix.ganChong||[]).length + (ix.xing||[]).length + (ix.hai||[]).length + (ix.zhiChong||[]).length + (ix.zhiHai||[]).length;
  quality -= Math.min(15, clashes * 4);                          // mỗi xung/hình -4, tối đa -15
  quality = Math.max(0, Math.min(55, quality));

  // cách cục thuận dụng = bonus [0..5]
  let patternBonus = 0;
  try { if (cR.pattern && cR.pattern.pref && cR.pattern.pref.shun) patternBonus = 5; } catch (e) {}

  // (a) PHÙ HỢP PHỤ HUYNH [0..25]
  const goodForUser = [userYong.primary, userYong.xi].filter(Boolean);
  const avoid = userYong.avoid || [userYong.ji, userYong.chou].filter(Boolean);
  let parentFit = 0;
  if (goodForUser.includes(dmWx)) parentFit += 15;               // Nhật Chủ con = Dụng/Hỷ → BỔ MỆNH
  if (avoid.length && (ws[avoid[0]] || 0) / total > 0.3) parentFit -= 8; // con mang nhiều Kỵ
  if (CHONG_MAP[userYearZhi] === cR.chart.pillars.year.zhi) parentFit -= 5;
  parentFit = Math.max(0, Math.min(25, parentFit));

  // sao con [0..5]
  const isMale = (R.chart.input && R.chart.input.gender) === 'nam';
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : SHENG[R.chart.dayMaster.wx];
  const childStar = (ws[childWx] || 0) > 0 ? 5 : 0;

  // (c) HÒA HỢP phụ huynh-con [0..10]
  let harmony = 5;
  if (CHONG_MAP[userDayZhi] === cR.chart.pillars.day.zhi) harmony -= 5;
  if (GAN_HE[userDayGan] === cR.chart.dayGan) harmony += 5;
  harmony = Math.max(0, Math.min(10, harmony));

  const score = Math.max(0, Math.min(100, Math.round(quality + patternBonus + parentFit + childStar + harmony)));

  const notes = [];
  if (goodForUser.includes(dmWx)) notes.push(`Nhật Chủ con = ${WX_VI[dmWx]} (Dụng/Hỷ bạn) → BỔ MỆNH`);
  notes.push(`Mệnh con: ${(cR.strength && cR.strength.level) || '?'} (eff ${eff.toFixed(2)})`);
  if (clashes > 0) notes.push(`⚠ ${clashes} xung/hình/hại nội tại`);
  if (patternBonus) notes.push(`Cách cục thuận dụng`);
  if (childStar) notes.push(`Mang hành sao con (${WX_VI[childWx]})`);
  if (CHONG_MAP[userYearZhi] === cR.chart.pillars.year.zhi) notes.push(`⚠ Năm con xung tuổi bạn`);
  if (CHONG_MAP[userDayZhi] === cR.chart.pillars.day.zhi) notes.push(`⚠ Trụ ngày xung trụ ngày bạn`);
  if (GAN_HE[userDayGan] === cR.chart.dayGan) notes.push(`Can ngày con hợp can bạn`);
  return { score, eff, clashes, notes };
}

// Quét toàn cục + cache. 2 GIAI ĐOẠN: (1) lightweight exhaustive lấy top 25/năm theo score thô,
//   (2) analyze() thật trên 25 đó → rich score (tàng can/clashes/cách cục) → sort lại. Trả Map<year, arr>.
// NOTE: gender child = 'nam' placeholder — chất lượng chart (vượng suy/clatches/cách cục) không phụ thuộc gender.
function _fullChildScan(R) {
  const key = _childKey(R);
  if (_childCache && _childCache.key === key) return _childCache.scan;
  const byYear = new Map();
  for (let yr = 2025; yr <= 2040; yr++) {
    // (1) stage thô — lightweight, toàn 31 ngày × 12 giờ
    const coarse = [];
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= 31; d++) {
        let dayOk = false;
        for (const h of _SHICHEN) {
          try {
            const l = Solar.fromYmdHms(yr, m, d, h, 0, 0).getLunar();
            const p = {
              yearGan: l.getYearGan(), yearZhi: l.getYearZhi(),
              monthGan: l.getMonthGan(), monthZhi: l.getMonthZhi(),
              dayGan: l.getDayGan(), dayZhi: l.getDayZhi(),
              timeGan: l.getTimeGan(), timeZhi: l.getTimeZhi(),
            };
            const sc = _scoreChild(p, R);
            coarse.push(Object.assign({ month: m, day: d, hour: h }, p, sc));
            dayOk = true;
          } catch (e) {}
        }
        if (!dayOk) break;
      }
    }
    coarse.sort((a, b) => b.score - a.score);
    // (2) stage rich — analyze() thật trên top 25 coarse
    const rich = [];
    for (const c of coarse.slice(0, 25)) {
      try {
        const cR = analyze(yr, c.month, c.day, c.hour, 0, 'nam', yr);
        const rs = _scoreChildRich(cR, R);
        rich.push({
          month: c.month, day: c.day, hour: c.hour,
          yearGan: c.yearGan, yearZhi: c.yearZhi,
          dayGan: c.dayGan, dayZhi: c.dayZhi,
          score: rs.score, eff: rs.eff, clashes: rs.clashes, notes: rs.notes,
        });
      } catch (e) {}
    }
    rich.sort((a, b) => b.score - a.score);
    byYear.set(yr, rich);
  }
  _childCache = { key, scan: byYear };
  return byYear;
}

/**
 * Tính thời điểm SINH CON lý tưởng — best lá số/năm từ exhaustive scan (0-100 thật).
 * Score giờ = điểm lá số TỐT NHẤT trong năm đó (đã quét hết 31 ngày × 12 giờ).
 * @param {object} R - user's chart
 * @returns [{ year, ganZhi, ganWx, zhiWx, score, notes, nameHint, isBest, bestDate, bestGanZhi }]
 */
export function idealChildTiming(R) {
  const scan = _fullChildScan(R);
  const results = [];
  for (const [yr, arr] of scan) {
    const best = arr[0];
    if (!best) continue;
    results.push({
      year: yr,
      ganZhi: best.yearGan + best.yearZhi,
      ganWx: WX_VI[GAN[best.yearGan].wx],
      zhiWx: WX_VI[ZHI[best.yearZhi].wx],
      score: best.score,
      notes: best.notes,
      nameHint: buildNameHint((R.yong || {}).primary),
      isBest: false,
      bestDate: `${yr}-${String(best.month).padStart(2,'0')}-${String(best.day).padStart(2,'0')} ${String(best.hour).padStart(2,'0')}:00`,
      bestGanZhi: best.dayGan + best.dayZhi,
    });
  }
  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => { r.isBest = i < 3; });
  return results;
}

export { zhiRel, buildNameHint };

// ---- PROFILE CHI TIẾT cho partner lý tưởng (tính từ lá số partner) ----
import { DITIANSUI } from './kb.js';

const DM_TRAITS = {
  甲: 'trực thẳng, lãnh đạo, cứng đầu, như đại thụ',
  乙: 'mềm mỏng, duyên dáng, dễ thích nghi, như hoa cỏ',
  丙: 'nhiệt tình, hào phóng, quang minh, như mặt trời',
  丁: 'tinh tế, ấm áp, trực giác tốt, như ngọn đèn',
  戊: 'vững vàng, đáng tin, bao dung, như núi',
  己: 'ôm hoà, cần mẫn, nuôi dưỡng, như đất ruộng',
  庚: 'cương nghị, quả đoán, trọng nghĩa, như kim loại',
  辛: 'thanh nhã, nhạy cảm, thẩm mỹ, như châu ngọc',
  壬: 'thông tuệ, phóng khoáng, mưu lược, như sông biển',
  癸: 'kín đáo, nhẫn nại, trí tưởng tượng, như mưa móc',
};

const WX_CAREER = {
  木: 'giáo dục, mộc/nội thất, dược/đông y, nông nghiệp',
  火: 'ẩm thực, điện tử, truyền thông, năng lượng, mỹ phẩm',
  土: 'bất động sản, xây dựng, gốm sứ, tài nguyên, tư vấn',
  金: 'tài chính, cơ khí, công nghệ, luật, trang sức',
  水: 'thương mại, vận tải, du lịch, xuất nhập khẩu, tài chính lưu thông',
};

const WX_PHYSICAL = {
  木: 'cao, thanh, tóc đẹp, lưng thẳng',
  火: 'trong sáng, mắt sáng, da hồng, nét sắc',
  土: 'đầy đặn, vững, da vàng, nặng nề',
  金: 'trắng, gọn gàng, nét sắc sảo, tóc cứng',
  水: 'tròn, nước da tối, mắt sâu, tóc đen dày',
};

/**
 * Tạo PROFILE CHI TIẾT cho partner lý tưởng (personality + nghề + ngoại hình + cách tương tác).
 */
export function buildPartnerProfile(match, userR) {
  const R = match.chart;
  const chart = R.chart;
  const dm = chart.dayMaster;
  const dmGan = dm.gan;
  const dmWx = dm.wx;
  const dt = DITIANSUI[dmGan];
  const traits = DM_TRAITS[dmGan] || '?';
  const career = WX_CAREER[dmWx] || '?';
  const physical = WX_PHYSICAL[dmWx] || '?';

  // Cách tương tác với user
  const userDm = userR.chart.dayMaster;
  const userYong = userR.yong;
  const isUserDung = [userYong.primary, userYong.xi].includes(dmWx);
  const interaction = isUserDung
    ? 'Partner mang hành Dụng/Hỷ của bạn -> BAN VIEN BAN: họ tự nhiên mang năng lượng mà mệnh bạn cần, ở cạnh họ bạn cảm thấy may mắn/han thông. Day chinh la nguoi "bo menh" ban.'
    : 'Partner khong trung Dung Than nhung van hop ve ngu hanh/khac tu -> can xem chi tiet hon.';

  return {
    personality: `Personality: ${traits}. ${dt ? dt.vi : ''}`,
    career: `Nghe nghiep hop: ${career}`,
    physical: `Ngoai hinh: ${physical}`,
    interaction,
    summary: `Partner ly tuong cho ban la nguoi Nhat Chu ${dmGan} ${dm.vi} (hanh ${WX_VI[dmWx]}) - ${traits}. ${isUserDung ? 'HANH NAY CHINH LA DUNG THAN CUA BAN -> BAN VIEN BAN (bo menh truc tiep).' : ''} Nen lam nghe: ${career}. Ban gap nguoi co tinh cach ngoai hinh nhu tren, sinh khoang ${match.date} thi do la profile gan nhat voi ly tuong.`,
  };
}

/**
 * Top NGÀY/THÁNG/GIỜ sinh con cụ thể trong 1 năm — từ exhaustive scan đã cache.
 * Trả đúng top lá số điểm CAO NHẤT của năm (all 31 ngày × 12 giờ), không còn sample ngày 15.
 */
export function idealChildDates(R, year) {
  const scan = _fullChildScan(R);
  const arr = scan.get(year) || [];
  return arr.slice(0, 5).map((c) => ({
    year, month: c.month, day: c.day, hour: c.hour,
    date: `${year}-${String(c.month).padStart(2,'0')}-${String(c.day).padStart(2,'0')} ${String(c.hour).padStart(2,'0')}:00`,
    ganZhi: c.dayGan + c.dayZhi,
    ganWx: WX_VI[GAN[c.dayGan].wx], zhiWx: WX_VI[ZHI[c.dayZhi].wx],
    score: c.score,
    nameHint: buildNameHint((R.yong || {}).primary),
  }));
}
