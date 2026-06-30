// ============================================================================
//  LƯU NHẬT 流日 — VẬN CÁ NHÂN TỪNG NGÀY ("hôm nay tôi sao?")
//  Khác 择日 (chọn ngày cho 1 việc): đây là vận tổng thể của CÁ NHÂN trong 1 ngày.
//  Cơ sở: nhật can chi → Thập thần + Ngũ hành Dụng thần + Thần sát ngày (đào hoa/
//  hồng diễm/dương nhận/dịch mã) + chi ngày xung/hại chi tuổi & chi ngày. Nguồn:
//  流日论断 (tương tự 流年/流月 nhưng nhẹ hơn vì chỉ 1 ngày).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { TAO_HUA, HONG_YAN, YANG_REN, YI_MA, BRANCH_GROUP, TIAN_YI, WEN_CHANG, JIANG_XING } from './shensha.js';
// [loop 12] 格局流日喜忌 — cộng tầng 格局 LÊN TRÊN 4 trường phái (ngũ hành + thập
//   thần ngày + xung + thần sát). Optional patternQuality → backward compatible.
import { adjustLiuriByGeju } from './pattern-quality.js';
// [loop 75 nâng tầng] 伏吟/反吟 ngày × 4 trụ nguyên cục (mirror 流月 loop 74 / 流年 loop 19).
import { isFuyin, isFanyin } from './fuyin.js';

const wxVi = (w) => WX_VI[w];
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const HAI = { 子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉' };
// [loop 75] Thái tuế ngày đầy đủ (trước đây chỉ 冲+害, thiếu 刑+破) + 伏吟/反吟 trọng số (1 ngày, nhẹ nhất).
const XING = { 子: '卯', 卯: '子', 寅: '巳', 巳: '申', 申: '寅', 丑: '戌', 戌: '未', 未: '丑', 辰: '辰', 午: '午', 酉: '酉', 亥: '亥' };
const PO = { 子: '酉', 酉: '子', 丑: '辰', 辰: '丑', 寅: '亥', 亥: '寅', 卯: '午', 午: '卯', 巳: '申', 申: '巳', 戌: '未', 未: '戌' };
// [loop 1016 FIX] 六合 — ngày chi lục hợp tuổi/Nhật Chi = «日合岁» cát. Cùng bug-class
//   loop 1014/1015: liuri phạt 冲/刑/破/害 mà không thưởng 合 (dù có thưởng cát thần煞).
const LIUHE = { 子:'丑', 丑:'子', 寅:'亥', 亥:'寅', 卯:'戌', 戌:'卯', 辰:'酉', 酉:'辰', 巳:'申', 申:'巳', 午:'未', 未:'午' };
// [loop 1042] 三合 bán-hợp — chi ngày cùng cụm 三合 với chi tuổi/Nhật Chi.
const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];
const _banhe = (a, b) => a !== b && SANHE.some((g) => g.includes(a) && g.includes(b));
const QIN_VI = { year: 'Niên Trụ (tổ bối)', month: 'Nguyệt Trụ (phụ mẫu/sự nghiệp)', day: 'Nhật Trụ (bản thân/phối ngẫu)', time: 'Thời Trụ (tử tức)' };
const W_FUYIN_D = { day: 3, month: 2, year: 2, time: 2 };     // 伏吟 ngày (1 ngày, nhẹ nhất)
const W_FANYIN_D = { month: 4, year: 3, time: 3 };            // 反吟 ngày (KHÔNG có day — 冲 Nhật Chi đã tính)

// Thập thần ngày → độ (nhẹ vì 1 ngày)
const GOD_DAY = {
  比肩: { d: -1, vi: 'gặp bạn bè, cạnh tranh nhẹ, hao chút tiền' },
  劫財: { d: -5, vi: '破财 nhẹ, tranh giành, đừng cho vay/mua sắm bốc đồng' },
  食神: { d: +5, vi: 'vui vẻ, tài hoa, có口 phúc, việc thuận' },
  傷官: { d: -5, vi: 'dễ cãi/khẩu thiệp, hao tiền, tình cảm biến — giữ lời ăn tiếng nói' },
  偏財: { d: +3, vi: 'tài bất ngờ nhỏ / hao, hào phóng' },
  正財: { d: +4, vi: 'tiến tài đều, việc tiền thuận (nếu thân vượng)' },
  七殺: { d: -4, vi: 'áp lực, tiểu nhân, cẩn thận sức khoẻ/an toàn' },
  正官: { d: +4, vi: 'danh vọng, quý nhân, việc quan quyền thuận' },
  偏印: { d: -2, vi: 'tâm trạng cô, hao tài nguyên nhẹ' },
  正印: { d: +4, vi: 'quý nhân, học/văn, ấm no, có người giúp' },
};

/**
 * @param {object} R                 — kết quả analyze()
 * @param {number} year, month, day  — ngày dương lịch cần luận
 * @param {object} [patternQuality]  — [loop 12] OPTIONAL kết quả patternQuality(R).
 *        Khi truyền vào, cộng thêm tầng 格局流日喜忌 (★格局喜 +2 / ⚠格局忌 −2)
 *        LÊN TRÊN 4 trường phái cốt lõi. Không truyền → backward compatible.
 * @returns {{ solar, ganZhi, ganGod, score, rating, schools:[{phai,d,note}], advice, gejuDelta?, gejuNote? }}
 */
export function analyzeLiuRi(R, year, month, day, patternQuality) {
  const c = R.chart;
  const dayGan = c.dayGan, birthYearZhi = c.pillars.year.zhi, selfDayZhi = c.pillars.day.zhi;
  const yong = R.yong;

  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = s.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi();
  const ganGod = tenGod(dayGan, dGan);
  const ganWx = GAN[dGan].wx, zhiWx = ZHI[dZhi].wx;

  const schools = [];
  let score = 50;

  // (1) Ngũ hành Dụng thần
  const fav = new Set([yong.primary, yong.xi].filter(Boolean));
  const avoid = new Set([yong.ji, yong.chou]);
  let ed = 0; let enote = `Can ${dGan}(${wxVi(ganWx)}) + Chi ${dZhi}(${wxVi(zhiWx)}). `;
  if (fav.has(ganWx)) { ed += 5; enote += `Can Dụng/Hỷ, thuận. `; }
  if (avoid.has(ganWx)) { ed -= 6; enote += `Can Kỵ/Thù, nghịch. `; }
  if (fav.has(zhiWx)) { ed += 4; enote += `Chi Dụng/Hỷ, thuận. `; }
  if (avoid.has(zhiWx)) { ed -= 5; enote += `Chi Kỵ/Thù, nghịch. `; }
  score += ed; schools.push({ phai: 'Ngũ Hành/Dụng', d: ed, note: enote });

  // (2) Thập thần ngày
  const g = GOD_DAY[ganGod];
  if (g) { score += g.d; schools.push({ phai: 'Thập Thần ngày', d: g.d, note: `${ganGod}: ${g.vi}` }); }

  // (3) Chi ngày vs chi tuổi + Nhật Chi — THÁI TUẾ NGÀY đầy đủ (冲/刑/破/害).
  //   [loop 75 sửa double-count] 冲 Nhật Chi chỉ tính khi selfDayZhi !== birthYearZhi
  //   (nếu trùng thì 冲 tuổi đã bao hàm — trước đây -5 + -6 = -11 cho cùng 1 xung, y loop 71).
  if (CHONG[birthYearZhi] === dZhi) { score -= 5; schools.push({ phai: 'Xung tuổi', d: -5, note: `Chi ngày ${ZHI[dZhi].vi} XUNG chi tuổi ${ZHI[birthYearZhi].vi} — cẩn thận biến động.` }); }
  if (CHONG[selfDayZhi] === dZhi && selfDayZhi !== birthYearZhi) { score -= 6; schools.push({ phai: 'Xung Nhật Chi', d: -6, note: `Chi ngày xung Nhật Chi (bản thân) — cẩn thận sức khoẻ/an toàn.` }); }
  if (XING[birthYearZhi] === dZhi) { score -= 3; schools.push({ phai: 'Ngày刑太岁', d: -3, note: `Chi ngày hình chi tuổi — quan phi/thị phi nhẹ.` }); }
  if (PO[birthYearZhi] === dZhi) { score -= 2; schools.push({ phai: 'Ngày破太岁', d: -2, note: `Chi ngày phá chi tuổi — hao tiền nhẹ.` }); }
  if (HAI[birthYearZhi] === dZhi) { score -= 3; schools.push({ phai: 'Hại tuổi', d: -3, note: `Chi ngày hại chi tuổi — tiểu nhân, hao tốn nhẹ.` }); }
  // [loop 1016] 六合 thưởng — đối xứng 冲 (合 tuổi +5 / 合 Nhật Chi +6, cùng guard double-count).
  if (LIUHE[birthYearZhi] === dZhi) { score += 5; schools.push({ phai: 'Hợp tuổi', d: 5, note: `Chi ngày ${ZHI[dZhi].vi} LỤC HỢP chi tuổi ${ZHI[birthYearZhi].vi} — «日合岁» thuận hoà, quý nhân.` }); }
  if (LIUHE[selfDayZhi] === dZhi && selfDayZhi !== birthYearZhi) { score += 6; schools.push({ phai: 'Hợp Nhật Chi', d: 6, note: `Chi ngày lục hợp Nhật Chi (bản thân) — yên bụng, sự việc trôi chảy.` }); }
  // [loop 1042] 三合 bán-hợp — chi ngày cùng cụm 三合 với chi tuổi/Nhật Chi (yếu hơn 六 hợp).
  if (_banhe(dZhi, birthYearZhi)) { score += 3; schools.push({ phai: 'Bán-hợp tuổi', d: 3, note: `Chi ngày bán-hợp (三合) chi tuổi — cùng cục, tăng cát nhẹ.` }); }
  else if (selfDayZhi !== birthYearZhi && _banhe(dZhi, selfDayZhi)) { score += 2; schools.push({ phai: 'Bán-hợp Nhật', d: 2, note: `Chi ngày bán-hợp (三合) Nhật Chi — cùng cục.` }); }

  // (4) Thần sát ngày
  const grp = BRANCH_GROUP[birthYearZhi];
  if (TAO_HUA[grp] === dZhi || TAO_HUA[BRANCH_GROUP[selfDayZhi]] === dZhi) { score -= 3; schools.push({ phai: 'Đào Hoa ngày', d: -3, note: 'Hôm nay đào hoa — tình cảm biến động, cẩn thận烂桃花/hao tiền vì tình.' }); }
  if (HONG_YAN[dayGan] === dZhi) { score -= 3; schools.push({ phai: 'Hồng Diễm ngày', d: -3, note: 'Hồng diễm — sắc duyên, dễ sa vào tình cảm không lợi.' }); }
  if (YANG_REN[dayGan] === dZhi) { score -= 4; schools.push({ phai: 'Dương Nhận ngày', d: -4, note: 'Dương nhận — sát khí, dễ tổn thương/xe cộ/cắt đứt, kỵ liều.' }); }
  if (YI_MA[grp] === dZhi || YI_MA[BRANCH_GROUP[selfDayZhi]] === dZhi) { score += 2; schools.push({ phai: 'Dịch Mã ngày', d: 2, note: 'Dịch mã — di chuyển/đổi chỗ, có biến (cát nếu Dụng).' }); }
  // [loop 366 nâng logic] thần sát CÁT ngày (cùng fix loop 364/365: trước đây chỉ score hung)
  if (TIAN_YI[dayGan] && TIAN_YI[dayGan].includes(dZhi)) { score += 3; schools.push({ phai: 'Thiên Ất ngày', d: 3, note: 'Thiên Ất quý nhân — quý nhân phò, gặp dữ hóa lành, hợp gặp người lớn/ký kết.' }); }
  if (WEN_CHANG[dayGan] === dZhi) { score += 2; schools.push({ phai: 'Văn Xương ngày', d: 2, note: 'Văn Xương — học/văn/thi cử thuận, tư duy sắc.' }); }
  if (JIANG_XING[grp] === dZhi) { score += 2; schools.push({ phai: 'Tướng Tinh ngày', d: 2, note: 'Tướng tinh — uy quyền, hợp quyết định/lãnh đạo.' }); }

  // (5) [loop 75 nâng tầng] PHỤC/PHẢN NGÂM ngày × 4 trụ nguyên cục (mirror 流月/流年).
  //   Ngày can-chi trùng trụ = 伏吟 (trùng phức, chủ buồn/chướng); 天克地冲 trụ = 反吟 (biến cố).
  //   反吟 loại 日柱 (冲 Nhật Chi đã tính ở mục 3 → chống double-count). Hóa giải: ngày Dụng/Hỷ → giảm 60%.
  const dp = { gan: dGan, zhi: dZhi };
  const mitig = fav.has(ganWx) || fav.has(zhiWx);
  const factor = mitig ? 0.4 : 1;
  let fyD = 0; const fyNotes = [];
  for (const k of ['day', 'month', 'year', 'time']) {
    const np = c.pillars[k];
    if (!np || !np.gan) continue;
    if (isFuyin(dp, np)) { fyD -= W_FUYIN_D[k] * factor; fyNotes.push(`伏吟 ${QIN_VI[k]}`); }
    else if (isFanyin(dp, np)) { if (k === 'day') continue; fyD -= W_FANYIN_D[k] * factor; fyNotes.push(`反吟 ${QIN_VI[k]}`); }
  }
  if (fyNotes.length) { score += fyD; schools.push({ phai: 'Phục/Phản Ngâm ngày', d: fyD, note: fyNotes.join(', ') + (mitig ? ' (ngày mang Dụng/Hỷ → hung giảm)' : '') }); }

  score = Math.max(5, Math.min(95, Math.round(score)));
  let rating;
  // [loop 469→470] recalibrate percentile + unify vocab (Kỵ→Hung cho khớp 流年/流月).
  if (score >= 54) rating = 'Cát';
  else if (score >= 48) rating = 'Bình';
  else if (score >= 44) rating = 'Hơi kỵ';
  else rating = 'Hung';

  // [loop 644 FIX] advice threshold align rating (54/48). Trước đây advice >=64 nhưng rating Cát >=54
  //   → ngày score 54-63 rating «Cát» nhưng advice «tạm ổn» (mâu thuẫn nội bộ liuri).
  const advice = score >= 54 ? `Hôm nay (${rating}) — thuận, nên làm việc chính/ký kết/gặp quý nhân.`
    : score >= 48 ? `Hôm nay (${rating}) — tạm ổn, làm việc thường, tránh quyết định lớn.`
    : `Hôm nay (${rating}) — bất lợi, giữ mình, tránh đầu tư/cho vay/cãi vã/đi xa liều, bao dung tình cảm.`;

  const result = { solar: s.toYmd(), ganZhi: dGan + dZhi, ganGod, ganWx, zhiWx, score, rating, schools, advice };
  // [loop 12] Cộng tầng 格局流日喜忌 (optional, backward compatible).
  //   patternQuality truyền vào → cộng ★格局喜(+2)/⚠格局忌(−2) lên trên 4 trường phái.
  //   Không truyền → adjustLiuriByGeju trả clone với gejuDelta=0 (không thay đổi score).
  // [loop 1044 FIX] adjustLiuriByGeju upgrade RATING nhưng KHÔNG update advice → mismatch.
  //   Nay sync advice sau geju adjust (advice phải khớp final rating/score).
  const _adj = patternQuality ? adjustLiuriByGeju(result, patternQuality, dayGan) : result;
  _adj.advice = _adj.score >= 54 ? `Hôm nay (${_adj.rating}) — thuận, nên làm việc chính/ký kết/gặp quý nhân.`
    : _adj.score >= 48 ? `Hôm nay (${_adj.rating}) — tạm ổn, làm việc thường, tránh quyết định lớn.`
    : `Hôm nay (${_adj.rating}) — bất lợi, giữ mình, tránh đầu tư/cho vay/cãi vã/đi xa liều, bao dung tình cảm.`;
  return _adj;
}

// Tìm N ngày tốt kế tiếp cho việc cá nhân (vận cá nhân, không theo việc cụ thể)
export function findGoodDays(R, startYear, startMonth, startDay, count, topN = 5, patternQuality) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = Solar.fromYmdHms(startYear, startMonth, startDay, 12, 0, 0).next(i);
    // [loop 211 fix] truyền patternQuality → bật tầng 格局流日喜忌 (trước đây thiếu →
    //   find_good_days AI tool lệch analyze_day tool cho ngày có 格局 喜/忌)
    try { out.push(analyzeLiuRi(R, d.getYear(), d.getMonth(), d.getDay(), patternQuality)); } catch (e) {}
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topN);
}
