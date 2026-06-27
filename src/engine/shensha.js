// ============================================================================
//  THẦN SÁT (神煞) — các sao phụ trợ
//  Tính theo Thiên Can ngày & Địa Chi năm/ngày. Nguồn: 渊海子平, 三命通會.
//  Dùng trang điểm thêm cho luận giải (chính vẫn là Ngũ hành – Thập thần).
// ============================================================================

// ---- Dựa vào THIÊN CAN NGÀY (Nhật Chủ) ----
// Thiên Ất Quý Nhân (天乙贵人) — sao quý nhân giúp đỡ lớn nhất
export const TIAN_YI = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
  辛: ['寅', '午'],
};
// Văn Xương (文昌) — sao học vấn, thi cử, tài năng
// Khẩu quyết《三命通会》«甲乙巳午报君知, 丙戊申宫丁己鸡, 庚猪辛鼠壬逢虎, 癸人见兔入云梯»:
//   庚→亥(猪) · 辛→子(鼠) · 壬→寅(虎).
// [loop 549 FIX] loop-21 từng đổi 辛→寅 (nhầm «辛鼠» thành «辛逢虎» → 辛 lấy giá trị của 壬).
//   Xác nhận SAI qua nhiều nguồn (知乎/新浪/豆瓣): 辛→子. Nay sửa lại đúng cổ pháp.
export const WEN_CHANG = {
  甲: '巳', 乙: '午', 丙: '申', 戊: '申', 丁: '酉', 己: '酉',
  庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
};
// Lộc Thần (禄神) — vị trí Lâm Quan, lương thực, tài lộc cơ bản
export const LU_SHEN = {
  甲: '寅', 乙: '卯', 丙: '巳', 戊: '巳', 丁: '午', 己: '午',
  庚: '申', 辛: '酉', 壬: '亥', 癸: '子',
};
// Dương Nhận (羊刃) — vị trí Đế Vượng, sát khí mạnh, cương mãnh
export const YANG_REN = {
  甲: '卯', 乙: '辰', 丙: '午', 戊: '午', 丁: '未', 己: '未',
  庚: '酉', 辛: '戌', 壬: '子', 癸: '丑',
};
// Học Đường (学堂) — vị trí Trường Sinh, tư chất học hỏi
export const XUE_TANG = {
  甲: '亥', 乙: '午', 丙: '寅', 戊: '寅', 丁: '酉', 己: '酉',
  庚: '巳', 辛: '子', 壬: '申', 癸: '卯',
};

// ---- Dựa vào ĐỊA CHI NĂM hoặc NGÀY (tam hợp cục) ----
// Bảng tra theo nhóm tam hợp: 申子辰 / 寅午戌 / 巳酉丑 / 亥卯未
export const BRANCH_GROUP = {
  申: 'A', 子: 'A', 辰: 'A',
  寅: 'B', 午: 'B', 戌: 'B',
  巳: 'C', 酉: 'C', 丑: 'C',
  亥: 'D', 卯: 'D', 未: 'D',
};
// Đào Hoa (桃花) — duyên, nhân duyên, giao tế, ái tình
export const TAO_HUA = { A: '酉', B: '卯', C: '午', D: '子' };
// Dịch Mã (驿马) — di chuyển, thay đổi, công việc động, nước ngoài
export const YI_MA = { A: '寅', B: '申', C: '亥', D: '巳' };
// Tướng Tinh (将星) — quyền lực, lãnh đạo
export const JIANG_XING = { A: '子', B: '午', C: '酉', D: '卯' };
// Hoa Cái (华盖) — nghệ thuật, tôn giáo, trí tuệ cô cao, tâm linh
export const HUA_GAI = { A: '辰', B: '戌', C: '丑', D: '未' };

// [loop 369] Thiên Y (天医) — sao chủ y tế/sức khoẻ, tra theo NGUYỆT CHI (月支的前一位).
//   Nguồn: 知乎/阐微堂 «正月起丑, 顺行» = 月支逆行一位 (寅→丑, 午→巳, 子→亥…).
//   Mệnh mang Thiên Y → duyên y tế, thể chất, đức từ bi; hợp nghề y/dược/tâm lý.
export const TIAN_YI_MED = { 子:'亥', 丑:'子', 寅:'丑', 卯:'寅', 辰:'卯', 巳:'辰', 午:'巳', 未:'午', 申:'未', 酉:'申', 戌:'酉', 亥:'戌' };

// ---- THIÊN ĐỨC QUÝ NHÂN (天德贵人) — tra theo Nguyệt Chi ----
// (một số vị trí là Địa Chi, phần còn lại là Thiên Can; cổ pháp 窮通寶鑑)
export const TIAN_DE = {
  寅: '丁', 卯: '申', 辰: '壬', 巳: '辛', 午: '亥', 未: '甲',
  申: '癸', 酉: '寅', 戌: '丙', 亥: '乙', 子: '巳', 丑: '庚',
};
// ---- NGUYỆT ĐỨC QUÝ NHÂN (月德贵人) — tra theo nhóm tam hợp Nguyệt Chi ----
export const YUE_DE = { A: '壬', B: '丙', C: '庚', D: '甲' }; // A=申子辰 B=寅午戌 C=巳酉丑 D=亥卯未
// ---- KIM DƯ (金舆) — tra theo Nhật Can (địa chi tương ứng) ----
export const JIN_YU = {
  甲: '辰', 乙: '巳', 丙: '未', 丁: '申', 戊: '未', 己: '申',
  庚: '戌', 辛: '亥', 壬: '丑', 癸: '寅',
};
// ---- HỒNG DIỄM SÁT (红艳煞) — tra theo Nhật Can ----
export const HONG_YAN = {
  甲: '午', 乙: '午', 丙: '寅', 丁: '未', 戊: '辰', 己: '辰',
  庚: '戌', 辛: '酉', 壬: '子', 癸: '申',
};
// ---- QUÙ CƯƠNG (魁罡) — 4 ngày-specific: 庚辰 庚戌 壬辰 戊戌 ----
export const KUI_GANG = ['庚辰', '庚戌', '壬辰', '戊戌'];
// ---- TAM KỲ QUÝ NHÂN (三奇贵人) — tổ hợp Thiên Can ----
export const SAN_QI = {
  天三奇: ['甲', '戊', '庚'],   // thiên kỳ
  地三奇: ['乙', '丙', '丁'],   // địa kỳ
  人三奇: ['辛', '壬', '癸'],   // nhân kỳ
};

// ---- Ý nghĩa rút gọn của từng sao (dùng cho luận giải NLG) ----
export const SHENSHA_INFO = {
  tianYi: { zh: '天乙贵人', vi: 'Thiên Ất Quý Nhân', desc: 'sao quý nhân phò trợ đắc lực, gặp dữ hóa lành, sự nghiệp dễ có người nâng đỡ', tone: 'cat' },
  wenChang: { zh: '文昌', vi: 'Văn Xương', desc: 'sao học vấn thi cử, tư duy sắc bén, tài năng nghệ thuật', tone: 'cat' },
  luShen: { zh: '禄神', vi: 'Lộc Thần', desc: 'lương thực, tài lộc cơ bản, sự ổn định', tone: 'cat' },
  yangRen: { zh: '羊刃', vi: 'Dương Nhận', desc: 'sát khí cương mãnh, dũng cảm, dễ tổn thương/rủi ro nếu không chế', tone: 'volatile' },
  xueTang: { zh: '学堂', vi: 'Học Đường', desc: 'tư chất ham học, trí nhớ tốt', tone: 'cat' },
  taoHua: { zh: '桃花', vi: 'Đào Hoa', desc: 'duyên sắc, nhân duyên, giao tế tốt, dễ hấp dẫn người khác giới', tone: 'neutral' },
  yiMa: { zh: '驿马', vi: 'Dịch Mã', desc: 'di chuyển, thay đổi, công việc động, cơ hội nước ngoài', tone: 'neutral' },
  jiangXing: { zh: '将星', vi: 'Tướng Tinh', desc: 'uy quyền, khả năng lãnh đạo chỉ huy', tone: 'cat' },
  huaGai: { zh: '华盖', vi: 'Hoa Cái', desc: 'trí tuệ cô cao, tâm linh, nghệ thuật, hay suy tư', tone: 'neutral' },
  tianDe: { zh: '天德贵人', vi: 'Thiên Đức Quý Nhân', desc: 'sao đại cát chủ từ bi nhân hậu, gặp dữ hóa lành, giảm tai họa', tone: 'cat' },
  yueDe: { zh: '月德贵人', vi: 'Nguyệt Đức Quý Nhân', desc: 'sao cát chủ phúc đức tự nhiên, ít bệnh tật, ít gặp quan phi', tone: 'cat' },
  jinYu: { zh: '金舆', vi: 'Kim Dư', desc: 'xe của quý nhân, chủ phú quý vinh hoa, có phúc xe ngựa tài sản', tone: 'cat' },
  hongYan: { zh: '红艳煞', vi: 'Hồng Diễm', desc: 'đào hoa sắc vóc, duyên dáng, tình cảm phong phú (nữ mạng rõ)', tone: 'neutral' },
  kuiGang: { zh: '魁罡', vi: 'Quù Cương', desc: 'cương nghị, thông minh, quyết đoán, cứng rắn; kỵ hình xung, nữ mạng bất lợi hôn nhân', tone: 'volatile' },
  sanQi: { zh: '三奇贵人', vi: 'Tam Kỳ Quý Nhân', desc: 'tài năng kỳ xuất, bác học đa năng,胸怀 xuất chúng (cần quý nhân phù trợ mới phát)', tone: 'cat' },
  tianYiMed: { zh: '天医', vi: 'Thiên Y', desc: 'sao chủ y tế/sức khoẻ — duyên y/dược, thể chất, đức từ bi thương xót; «天医拱照, 可作良医»', tone: 'cat' },
};

/**
 * Tính toàn bộ thần sát cho một lá số.
 * @param {object} chart - kết quả buildChart (có dayGan, monthZhi, pillars)
 * @returns {object} map star → array vị trí (địa chi) gặp phải trong tứ trụ
 */
export function computeShensha(chart) {
  const dg = chart.dayGan;
  const yearZhi = chart.pillars.year.zhi;
  const dayZhi = chart.pillars.day.zhi;
  const allZhi = ['year', 'month', 'day', 'time'].map((k) => chart.pillars[k].zhi);
  const allGan = ['year', 'month', 'day', 'time'].map((k) => chart.pillars[k].gan);

  const find = (target) => allZhi.filter((z) => z === target);
  const findAny = (targets) => allZhi.filter((z) => targets.includes(z));

  const group = BRANCH_GROUP[yearZhi]; // lấy theo năm (gốc cổ truyền)
  const groupDay = BRANCH_GROUP[dayZhi]; // thêm theo ngày (hiện đại)

  const result = {};

  // Can ngày based
  const ty = TIAN_YI[dg];
  const tyHit = findAny(ty);
  if (tyHit.length) result.tianYi = { at: tyHit };

  const wc = find(WEN_CHANG[dg]);
  if (wc.length) result.wenChang = { at: wc };

  const lu = find(LU_SHEN[dg]);
  if (lu.length) result.luShen = { at: lu };

  const yr = find(YANG_REN[dg]);
  if (yr.length) result.yangRen = { at: yr };

  const xt = find(XUE_TANG[dg]);
  if (xt.length) result.xueTang = { at: xt };

  // Chi năm/ngày based (đào hoa, dịch mã, tướng tinh, hoa cái)
  const tao = [TAO_HUA[group], TAO_HUA[groupDay]];
  const taoHit = findAny(tao);
  if (taoHit.length) result.taoHua = { at: taoHit };

  const ma = [YI_MA[group], YI_MA[groupDay]];
  const maHit = findAny(ma);
  if (maHit.length) result.yiMa = { at: maHit };

  const jx = [JIANG_XING[group], JIANG_XING[groupDay]];
  const jxHit = findAny(jx);
  if (jxHit.length) result.jiangXing = { at: jxHit };

  const hg = [HUA_GAI[group], HUA_GAI[groupDay]];
  const hgHit = findAny(hg);
  if (hgHit.length) result.huaGai = { at: hgHit };

  // [loop 369] Thiên Y (天医) — theo NGUYỆT CHI, kiểm chi tứ trụ
  const tyMedTarget = TIAN_YI_MED[chart.monthZhi];
  if (tyMedTarget) {
    const tyMedHit = find(tyMedTarget);
    if (tyMedHit.length) result.tianYiMed = { at: tyMedHit };
  }

  // Thiên Đức — ký hiệu (can hoặc chi) theo nguyệt chi, kiểm toàn tứ trụ (can+chi)
  const tdMark = TIAN_DE[chart.monthZhi];
  if (tdMark) {
    const tdHit = allZhi.concat(allGan).filter((x) => x === tdMark);
    if (tdHit.length) result.tianDe = { at: tdHit };
  }
  // Nguyệt Đức — can theo nhóm tam hợp NGUYỆT CHI (KHÔNG phải năm chi).
  // [cycle 47 sửa CRITICAL] trước đây dùng `group` (= nhóm NĂM chi) → 月德 sai (false +/- lucky star)
  //   → inflate/deflate grade lá số. Chính thống (三命通会): 寅午戌月→丙, 申子辰月→壬, 巳酉丑月→庚, 亥卯未月→甲.
  const ydStem = YUE_DE[BRANCH_GROUP[chart.monthZhi]];
  if (ydStem) {
    const ydHit = allGan.filter((g) => g === ydStem);
    if (ydHit.length) result.yueDe = { at: ydHit };
  }
  // Kim Dư — chi theo nhật can
  const jyHit = find(JIN_YU[dg]);
  if (jyHit.length) result.jinYu = { at: jyHit };
  // Hồng Diễm — chi theo nhật can
  const hyHit = find(HONG_YAN[dg]);
  if (hyHit.length) result.hongYan = { at: hyHit };
  // Quù Cương — đặc thù ngày
  const dayGZ = chart.pillars.day.gan + chart.pillars.day.zhi;
  if (KUI_GANG.includes(dayGZ)) result.kuiGang = { at: [dayGZ] };
  // Tam Kỳ — 4 thiên can chứa đủ 1 bộ tam kỳ
  const ganSet = new Set(allGan);
  for (const [name, trio] of Object.entries(SAN_QI)) {
    if (trio.every((g) => ganSet.has(g))) { result.sanQi = { at: trio, name }; break; }
  }

  return result;
}
