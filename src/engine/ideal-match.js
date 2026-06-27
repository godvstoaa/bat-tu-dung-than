// ============================================================================
//  PHỐI NGỖU LÝ TƯỞNG — TÍNH TOÁN ra lá số partner/con cái tối ưu cho user
//  KHÔNG bịa — mà SCAN hàng trăm ngày sinh, tính Bát Tự + 合婚 score, tìm
//  top matches có Dụng Thần bổ nhau + ngũ hành tương bổ + 生肖 hợp.
//  Output = "profile tham khảo" (ngày sinh lý tưởng + chart + score + tên gợi ý).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyze } from './chart.js';
import { computeHehun } from './hehun.js';
import { GAN, ZHI, WX_VI, KE, KE_BY } from './constants.js';

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

/**
 * Tính thời điểm SINH CON lý tưởng.
 * @param {object} R - user's chart
 * @returns [{ year, ganZhi, score, note, nameHint }]
 */
export function idealChildTiming(R) {
  const isMale = R.chart.input.gender === 'nam';
  // Child star: nam = 官杀 (Kim for 乙), nữ = 食伤 (Hỏa for 乙)
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : (function(){ const dm=R.chart.dayMaster.wx; const SHENG={木:'火',火:'土',土:'金',金:'水',水:'木'}; return SHENG[dm]; })();
  const userYong = R.yong;
  const results = [];
  const ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const GAN_ORDER = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

  for (let yr = 2025; yr <= 2040; yr++) {
    const gIdx = ((yr - 4) % 10 + 10) % 10;
    const zIdx = ((yr - 4) % 12 + 12) % 12;
    const yGan = GAN_ORDER[gIdx], yZhi = ZHI_ORDER[zIdx];
    const ganWx = GAN[yGan].wx, zhiWx = ZHI[yZhi].wx;
    let score = 50;
    const notes = [];
    // Year should bring Dụng/Hỷ for the PARENT (user)
    if ([userYong.primary, userYong.xi].includes(ganWx)) { score += 10; notes.push(`Can năm ${WX_VI[ganWx]} = Dụng/Hỷ của bạn`); }
    if ([userYong.primary, userYong.xi].includes(zhiWx)) { score += 10; notes.push(`Chi năm ${WX_VI[zhiWx]} = Dụng/Hỷ của bạn`); }
    // Year should bring child star element (good for child-parent relationship)
    if (ganWx === childWx || zhiWx === childWx) { score += 8; notes.push(`Mang hành sao con (${WX_VI[childWx]}) → duyên con tốt`); }
    // Year should NOT bring Kỵ
    if ([userYong.ji, userYong.chou].includes(ganWx)) { score -= 8; notes.push(`⚠ Can Kỵ`); }
    if ([userYong.ji, userYong.chou].includes(zhiWx)) { score -= 8; notes.push(`⚠ Chi Kỵ`); }
    // Thai Tuế check
    const userYearZhi = R.chart.pillars.year.zhi;
    const chong = {子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
    if (chong[userYearZhi] === yZhi) { score -= 10; notes.push(`⚠ Xung thái tuế tuổi bạn`); }

    score = Math.max(10, Math.min(95, Math.round(score)));
    results.push({
      year: yr, ganZhi: yGan + yZhi, ganWx: WX_VI[ganWx], zhiWx: WX_VI[zhiWx],
      score, notes, nameHint: buildNameHint(userYong.primary),
      isBest: false,
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
 * Tính NGÀY/THÁNG/GIỜ sinh con cụ thể cho năm tốt nhất.
 */
export function idealChildDates(R, year) {
  const userYong = R.yong;
  const isMale = R.chart.input.gender === 'nam';
  const childWx = isMale ? KE_BY[R.chart.dayMaster.wx] : (function(){ const dm=R.chart.dayMaster.wx; const SHENG={木:'火',火:'土',土:'金',金:'水',水:'木'}; return SHENG[dm]; })();
  const results = [];
  const times = [0, 6, 12, 18]; // 4 giờ đại diện

  for (let m = 1; m <= 12; m++) {
    for (const h of times) {
      try {
        const solar = Solar.fromYmdHms(year, m, 15, h, 0, 0);
        const lunar = solar.getLunar();
        const dayGan = lunar.getDayGan(), dayZhi = lunar.getDayZhi();
        const ganWx = GAN[dayGan].wx, zhiWx = ZHI[dayZhi].wx;
        let score = 50;
        if ([userYong.primary, userYong.xi].includes(ganWx)) score += 12;
        if ([userYong.primary, userYong.xi].includes(zhiWx)) score += 12;
        if (ganWx === childWx || zhiWx === childWx) score += 8;
        if ([userYong.ji, userYong.chou].includes(ganWx)) score -= 8;
        if ([userYong.ji, userYong.chou].includes(zhiWx)) score -= 8;
        score = Math.max(10, Math.min(95, Math.round(score)));
        if (score >= 60) {
          results.push({
            year, month: m, day: 15, hour: h,
            date: year + '-' + String(m).padStart(2,'0') + '-15 ' + String(h).padStart(2,'0') + ':00',
            ganZhi: dayGan + dayZhi,
            ganWx: WX_VI[ganWx], zhiWx: WX_VI[zhiWx],
            score,
            nameHint: buildNameHint(userYong.primary),
          });
        }
      } catch(e) {}
    }
  }
  results.sort((a,b) => b.score - a.score);
  return results.slice(0, 5);
}
