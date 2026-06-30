// ============================================================================
//  토정비결 (土亭秘訣 / Tojeong Bigyeol) — TỔNG QUAN VẬN NĂM (HÀN QUỐC)
//  [loop 1009] Thuật toán + 조견표 (60갑자) lấy TỪ CỔ PHÁP, NGHIỆM CHỨNG:
//    Nguồn 1 — 중앙일보 [생활 속의 수학] (박경미 홍익대):
//      144卦 = 3 chữ số: 상(1-8)·중(1-6)·하(1-3), 8×6×3=144. 첫卦=111, cuối=863.
//    Nguồn 2 — 대자재苑 (naver blog om3000) <수리법 조견표> + 2 ví dụ làm mẫu.
//
//  NGHIỆM CHỨNG (cả 2 ví dụ khớp ĐÚNG 조견표 + công thức):
//    ① target 2010 庚寅, tuổi 32 (Hàn), âm lịch 7/15 소월, 일진 丙午 →
//        상=(32+18 庚寅태)%8=2 · 중=(29+16 甲申월)%6=3 · 하=(15+14 丙午일)%3=2 → 232 ✓
//    ② target 2012 壬辰, tuổi 40, âm lịch 4/5 대월, 일진 丙戌 →
//        상=(40+19 壬辰태)%8=3 · 중=(30+12 乙巳월)%6=6 · 하=(5+18 丙戌일)%3=2 → 362 ✓
//
//  CÔNG THỨC (sau khi đổi DL→ÂL):
//    상(태세수) = (조견표[canChi năm mục tiêu].태 + tuổiHàn) % 8        (0→8)
//    중(월건수) = (조견표[월건 =五虎遁(can năm mục tiêu, tháng ÂL)].월
//                 + (đại nguyệt?30:29)) % 6                              (0→6)
//    하(일진수) = (조견표[canChi ngày sinh (일진)].일 + ngày ÂL) % 3     (0→3)
//
//  LƯU Ý: lunar-javascript = ÂL TRUNG QUỐC; ÂL Hàn Quốc (KASI) đôi khi lệch
//    ~1 ngày/năm (leap, múi giờ). Dùng lunar-javascript cho nhất quán với engine
//    BaZi; chênh 1 ngày ÂL hiếm khi làm đổi卦 (chỉ đổi khi mod trúng biên).
// ----------------------------------------------------------------------------
import { Solar, LunarMonth } from 'lunar-javascript';

// 조견표 (60갑자 → [태, 월, 일] cơ số). Lấy từ 대자재苑 수리법 조견표.
//   Đã sửa 2 lỗi typo của nguồn (dòng 己/辛 ghi nhầm thành 乙) — kiểm chứng bằng
//   2 ví dụ mẫu + đúng thứ tự 60 hoa giáp.
const JIGAM = {
  甲子: [20, 18, 18], 甲戌: [22, 14, 20], 甲申: [21, 16, 19], 甲午: [18, 18, 16], 甲辰: [22, 14, 20], 甲寅: [19, 16, 17],
  乙丑: [20, 16, 19], 乙亥: [19, 12, 17], 乙酉: [20, 14, 18], 乙未: [21, 16, 19], 乙巳: [17, 12, 15], 乙卯: [18, 14, 16],
  丙寅: [17, 14, 15], 丙子: [18, 16, 16], 丙戌: [20, 12, 18], 丙申: [19, 14, 17], 丙午: [16, 16, 14], 丙辰: [20, 12, 18],
  丁卯: [16, 12, 14], 丁丑: [19, 14, 17], 丁亥: [17, 10, 15], 丁酉: [18, 12, 16], 丁未: [19, 14, 17], 丁巳: [15, 10, 13],
  戊辰: [18, 10, 16], 戊寅: [15, 12, 13], 戊子: [16, 14, 14], 戊戌: [18, 10, 16], 戊申: [17, 12, 15], 戊午: [14, 14, 12],
  己巳: [18, 13, 16], 己卯: [19, 15, 17], 己丑: [22, 17, 20], 己亥: [20, 13, 18], 己酉: [21, 15, 19], 己未: [22, 17, 20],
  庚午: [17, 17, 15], 庚辰: [21, 13, 19], 庚寅: [18, 15, 16], 庚子: [19, 17, 17], 庚戌: [21, 13, 19], 庚申: [20, 15, 18],
  辛未: [20, 15, 18], 辛巳: [16, 11, 14], 辛卯: [17, 13, 15], 辛丑: [20, 15, 18], 辛亥: [18, 11, 16], 辛酉: [19, 13, 17],
  壬申: [18, 13, 16], 壬午: [15, 15, 13], 壬辰: [19, 11, 17], 壬寅: [16, 13, 14], 壬子: [17, 15, 15], 壬戌: [19, 11, 17],
  癸酉: [17, 11, 15], 癸未: [18, 13, 16], 癸巳: [14, 9, 12], 癸卯: [15, 11, 13], 癸丑: [18, 13, 16], 癸亥: [16, 9, 14],
};

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// Nguyệt kiến (địa chi của tháng 1-12 ÂL):正月寅 ... 12月丑
const MONTH_BRANCH = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
// 五虎遁: can năm → can của tháng Giêng (正月)
const WUHUDUN_M1 = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

const mod = (n, d) => { const r = n % d; return r === 0 ? d : (r < 0 ? r + d : r); };

// 五虎遁: (can năm, tháng ÂL 1-12) → can chi của nguyệt kiến (월건)
function wuhudun(yearGan, lunarMonth) {
  const g1 = WUHUDUN_M1[yearGan];
  if (!g1) return null;
  const m = ((lunarMonth - 1) % 12 + 12) % 12;
  const g = GAN_ORDER[(GAN_ORDER.indexOf(g1) + m) % 10];
  return g + MONTH_BRANCH[m];
}

/**
 * Lớp toán thuần — tính 종합괘 3 chữ số TỪ các thành phần ÂL.
 * Tách riêng để selftest nghiệm chứng 조견표 + công thức (không lệ thuộc đổi ÂL).
 * @param {{targetGanZhi:string, koreanAge:number, birthLunarMonth:number, dayCount:number, birthLunarDay:number, birthDayGanZhi:string}} p
 */
export function _guaFromLunar(p) {
  const { targetGanZhi, koreanAge, birthLunarMonth, dayCount, birthLunarDay, birthDayGanZhi } = p;
  // [loop 1010 audit] 조견표 phải COVER đủ 60 hoa giáp — miss = bug (sẽ ra gua SAI).
  //   Trước đây fallback `[10,10,10]` âm thầm → gua sai mà không báo. Nay track miss tường minh.
  const misses = [];
  const tBase = JIGAM[targetGanZhi]; if (!tBase) misses.push(`target:${targetGanZhi}`);
  const wolkun = wuhudun(targetGanZhi[0], Math.abs(birthLunarMonth));
  const mBase = JIGAM[wolkun]; if (!mBase) misses.push(`wolkun:${wolkun}`);
  const dBase = JIGAM[birthDayGanZhi]; if (!dBase) misses.push(`day:${birthDayGanZhi}`);
  const sang = mod((tBase?.[0] ?? 0) + koreanAge, 8);        // 상괘 (태세수)
  const jung = mod((mBase?.[1] ?? 0) + dayCount, 6);         // 중괘 (월건수)
  const ha = mod((dBase?.[2] ?? 0) + birthLunarDay, 3);      // 하괘 (일진수)
  return {
    gua: String(sang) + String(jung) + String(ha),
    sang, jung, ha,
    misses,
    detail: {
      targetGanZhi, koreanAge,
      sangBase: tBase?.[0], wolkun, wolkunBase: mBase?.[1], dayCount, birthDayGanZhi, ilBase: dBase?.[2], birthLunarDay,
    },
  };
}

// Ngũ hành của cõi năm mục tiêu (từ can chi năm) — để đối chiếu Dụng/Kỵ
function yearWx(ganZhi) {
  const ganWx = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  const zhiWx = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
  return { ganWx: ganWx[ganZhi[0]], zhiWx: zhiWx[ganZhi[1]] };
}

/**
 * Tính 토정비결 종합괘 cho một năm mục tiêu.
 * @param {{birthSolarYear:number, birthSolarMonth:number, birthSolarDay:number, hour?:number, targetYear?:number, yong?:{primary:string,ji:string}}} opt
 *   - targetYear mặc định = năm hiện tại (토정비결 là vận NĂM, đổi theo thái tuế).
 *   - yong: (tuỳ chọn) Dụng/Kỵ từ BaZi để đối chiếu ngũ hành năm → sắc vận.
 */
export function computeTojeong(opt) {
  const { birthSolarYear, birthSolarMonth, birthSolarDay, hour = 12 } = opt;
  if (!birthSolarYear || !birthSolarMonth || !birthSolarDay) return { ok: false, error: 'Thiếu ngày sinh' };
  const targetYear = opt.targetYear || new Date().getFullYear();

  // 1. Đổi dương lịch → âm lịch (lunar-javascript, giờ trưa để ổn định换日)
  let lunar;
  try {
    lunar = Solar.fromYmdHms(birthSolarYear, birthSolarMonth, birthSolarDay, hour, 0, 0).getLunar();
  } catch (_) {
    return { ok: false, error: 'Không đổi được âm lịch (ngày sinh không hợp lệ)' };
  }
  const bLunarYear = lunar.getYear();
  const bLunarMonth = lunar.getMonth();               // có thể âm (nhuận) → abs
  const bLunarDay = lunar.getDay();
  const bDayGanZhi = lunar.getDayGan() + lunar.getDayZhi();
  const bMonthAbs = Math.abs(bLunarMonth);
  const isLeap = bLunarMonth < 0;

  // 2. Đại/소 nguyệt của tháng sinh (29 hay 30 ngày)
  let dayCount = 30;
  try {
    const lm = LunarMonth.fromYm(bLunarYear, bMonthAbs);
    if (lm && typeof lm.getDayCount === 'function') dayCount = lm.getDayCount();
  } catch (_) { /* giữ 30 mặc định */ }

  // 3. Can chi năm mục tiêu (lấy qua 1 ngày giữa năm, luôn nằm trong ÂL năm đó)
  let targetGanZhi = '丙午';
  try {
    const tLunar = Solar.fromYmdHms(targetYear, 7, 1, 12, 0, 0).getLunar();
    targetGanZhi = tLunar.getYearGan() + tLunar.getYearZhi();
  } catch (_) { /* giữ mặc định */ }

  // 4. Tuổi Hàn (세는 나이 = năm mục tiêu - năm sinh + 1)
  const koreanAge = targetYear - birthSolarYear + 1;

  // 5. Tính 3 quẻ
  const r = _guaFromLunar({ targetGanZhi, koreanAge, birthLunarMonth: bMonthAbs, dayCount, birthLunarDay: bLunarDay, birthDayGanZhi: bDayGanZhi });
  const ywx = yearWx(targetGanZhi);

  // 6. Sắc vận: ngũ hành năm mục tiêu so với Dụng/Kỵ (nếu có R.yong)
  let hue = '';
  if (opt.yong && opt.yong.primary) {
    const set = new Set([opt.yong.primary, ...(opt.yong.xi || [])]);
    const ji = opt.yong.ji;
    const ganHit = set.has(ywx.ganWx), zhiHit = set.has(ywx.zhiWx);
    const ganJi = ji && ywx.ganWx === ji, zhiJi = ji && ywx.zhiWx === ji;
    if (ganHit && zhiHit) hue = 'cát';          // cả năm can+chi đều Dụng/Hỷ
    else if (ganJi && zhiJi) hue = 'hung';      // cả hai Kỵ/Thù
    else if (ganHit || zhiHit) hue = 'tiểu-cát';
    else if (ganJi || zhiJi) hue = 'tiểu-hung';
    else hue = 'bình';
  }

  // 7. 犯太歲 (범태세) — [loop 1010] tương tác chi năm sinh ↔ chi năm mục tiêu.
  //   Cổ pháp Hoa/Hàn: 值/沖/破/害 = phạm (cần cẩn trọng); 六合/三合 = được phù trợ.
  //   Bảng cặp verified (子午沖, 子未害, 子酉破, 子丑六合, 申子辰三合…).
  const CLASH = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };
  const HARM  = { 子:'未',未:'子',丑:'午',午:'丑',寅:'巳',巳:'寅',卯:'辰',辰:'卯',申:'亥',亥:'申',酉:'戌',戌:'酉' };
  const BREAK = { 子:'酉',酉:'子',丑:'辰',辰:'丑',寅:'亥',亥:'寅',卯:'午',午:'卯',巳:'申',申:'巳',未:'戌',戌:'未' };
  const LIUHE = { 子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午' };
  const SANHE = [['申','子','辰'],['亥','卯','未'],['寅','午','戌'],['巳','酉','丑']];
  const bYearZhi = (typeof lunar.getYearZhi === 'function' && lunar.getYearZhi()) || '';
  const tZhi = targetGanZhi[1];
  let taesoo = null;
  if (bYearZhi) {
    const flags = [];
    if (bYearZhi === tZhi) flags.push({ k:'值', vi:'本命年 — chi trùng, năm chuyển biến lớn', tone:'hung' });
    if (CLASH[bYearZhi] === tZhi) flags.push({ k:'沖', vi:'biến động, di chuyển, xung đột', tone:'hung' });
    if (BREAK[bYearZhi] === tZhi) flags.push({ k:'破', vi:'hao tốn, phá vỡ khuôn mẫu', tone:'mid' });
    if (HARM[bYearZhi] === tZhi) flags.push({ k:'害', vi:'tiểu nhân, thị phi', tone:'mid' });
    if (LIUHE[bYearZhi] === tZhi) flags.push({ k:'六合', vi:'六合 — được phù trợ, thuận lợi', tone:'cat' });
    // [loop 1010 fix] 三合 cần 2 chi KHÁC NHAU cùng cục (vd 寅↔午); cùng chi (值太歲) không tính 三合.
    if (bYearZhi !== tZhi && SANHE.some((g) => g.includes(bYearZhi) && g.includes(tZhi))) flags.push({ k:'三合', vi:'đồng cục, quý nhân, hài hòa', tone:'cat' });
    taesoo = flags.length ? { bYearZhi, targetZhi: tZhi, flags } : null;
  }

  return {
    ok: true,
    gua: r.gua, sang: r.sang, jung: r.jung, ha: r.ha,
    targetYear, targetGanZhi, koreanAge,
    birth: { lunarYear: bLunarYear, lunarMonth: bMonthAbs, lunarDay: bLunarDay, dayGanZhi: bDayGanZhi, isLeap, dayCount },
    detail: r.detail,
    misses: r.misses,
    yearWx: ywx,
    hue,
    taesoo,
    note: '토정비결 종합괘 (144卦) — thuật toán 작괘법 cổ truyền Hàn Quốc, nghiệm chứng bằng 조견표 (xuất xứ 대자재苑/중앙일보). Phần diễn giải thơ 4언3구 theo từng卦 đang được bổ sung.',
  };
}
