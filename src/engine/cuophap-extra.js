// ============================================================================
// cuophap-extra.js — CỔ PHÁP ROUND 2 (quét sâu 22/10/2026) — TÍCH HỢP KHO LUẬT MỚI
// Nguồn: docs/CUO-PHAP-QUET-SAU-2026-10.md (136 luật chưng cất, trích verbatim)
//   A. 神峰通考 (明·张楠): 4病4药 + 盖头说 + 去留舒配 + 雜格 (33 luật)
//   B1. 三命指迷赋 (宋·岳珂补注): 13 luật nạp âm/thần sát
//   B2. 兰台妙选 (明·西窗老人): 11 cách MỚI (13 cách trùng kb.js đã khử — dedup)
//   B3. 五行精纪 (宋·廖中): 23 luật (五合化真/转角进退化/十二月德/生成禄马…)
//   B4. 三命通会·卷6: 4 cách nhật trụ tứ tượng (đính chính nguồn khỏi 兰台)
//   C. 命理约言 (清·陈素庵): 35 nguyên tắc (não AI) — 论用神/格局/喜忌/冲刑/征验
// ĐÍNH CHÍNH NGUỒN (khác tài liệu phổ biến — xem doc):
//   - 截脚 = 滴天髓阐微·岁运 (任铁樵), KHÔNG phải 神峰通考
//   - 盖头 bản 张楠 rộng hơn 干克支 (kể cả can tiết chi)
//   - 青龙伏形/白虎持势/朱雀乘风 = 三命通会·卷6
// KHÔNG XUNG ĐỘT: additive-only — không đụng tier/score (chart-level), không sửa
//   luật cũ trong kb.js; output mới là field `extra` trong assessGufa.
// ============================================================================

// ---------------------------------------------------------------------------
// B2. LANTAI_PATTERNS_V2 — 11 cách 兰台 MỚI (format detect như kb.js)
// ---------------------------------------------------------------------------
export const LANTAI_PATTERNS_V2 = [
  { id: 'longhugongmen', name: '龍虎拱門', vi: 'Long hổ củng môn', cat: 'cat',
    detect: { and: [{ branchesAll: ['寅', '辰'] }, { noBranch: '卯' }] },
    judgment: 'Dần (hổ) + Thìn (long) giáp cung Mão (lôi môn) → danh đăng thiên phủ. (兰台妙选·上篇: 「龙虎拱门，名登天府。」)', source: 'lan dai v2' },
  { id: 'bingdingqianhu', name: '丙丁入於乾戶', vi: 'Bính Đinh nhập Càn hộ', cat: 'cat',
    detect: { and: [{ ganAny: ['丙', '丁'] }, { branchAny: ['戌', '亥'] }, { samePillar: true }] },
    judgment: 'Bính/Đinh ngồi Tuất/Hợi (phương Càn tây bắc) → giá hải trường hồng. (「丙丁入于乾户，乃驾海之长虹。」)', source: 'lan dai v2' },
  { id: 'gengxinxungong', name: '庚辛值於巽宮', vi: 'Canh Tân trị Tốn cung', cat: 'cat',
    detect: { and: [{ ganAny: ['庚', '辛'] }, { branchAny: ['辰', '巳'] }, { samePillar: true }] },
    judgment: 'Canh/Tân ngồi Thìn/Tỵ (phương Tốn đông nam) → khiếu phong mãnh hổ, vũ quý. (「庚辛值于巽宫，为啸风之猛虎。」)', source: 'lan dai v2' },
  { id: 'yangliutuojin', name: '楊柳拖金', vi: 'Dương liễu đà kim', cat: 'cat',
    detect: { and: [{ ganzhiAny: ['壬午', '癸未'] }, { ganAny: ['庚', '辛'] }] },
    judgment: 'Năm Dương Liễu Mộc (Nhâm Ngọ/Quý Mùi) gặp Canh/Tân → liễu đà kim chi, quý. (兰台: 杨柳拖金)', source: 'lan dai v2' },
  { id: 'huomingmuxiu', name: '火明木秀', vi: 'Hỏa minh mộc tú', cat: 'cat',
    detect: { and: [{ nayinAny: ['大林木', '桑柘木', '楊柳木', '松柏木', '石榴木', '平地木'] }, { nayinAny: ['炉中火', '山头火', '霹雳火', '山下火', '覆灯火', '天上火'] }, { month: 'spring' }] },
    judgment: 'Trụ Mộc + trụ Hỏa sinh mùa xuân → phùng xuân dĩ vi vinh, vinh quý. (「火明木秀，逢春月以为荣。」)', source: 'lan dai v2' },
  { id: 'leiyuyingchun', name: '雷雨迎春', vi: 'Lôi vũ nghinh xuân', cat: 'cat',
    detect: { and: [{ nayinAny: ['大海水', '天河水', '大溪水', '长流水', '井泉水', '涧下水'] }, { branchAny: ['辰', '卯'] }] },
    judgment: 'Trụ nạp âm Thủy gặp Thìn/Mão → trạch bị vạn vật, đại quý. (「雷雨迎春，逢辰卯而沾濡万物。」)', source: 'lan dai v2' },
  { id: 'gongyiduanmen', name: '拱揖端門', vi: 'Củng y Đoan môn', cat: 'cat',
    detect: { and: [{ branchesAll: ['巳', '未'] }, { noBranch: '午' }] },
    judgment: 'Tỵ + Mùi giáp cung Ngọ (đoan môn — dẫn 五行精纪 卷6: 子午 vi minh đế đoan môn) → tảo ngự cửu trọng chi chiếu.', source: 'lan dai v2' },
  { id: 'yixunbaoguo', name: '一旬包裹', vi: 'Nhất tuần bao gói', cat: 'cat',
    detect: { sameXun: true },
    judgment: 'Năm-trụ và nhật/giờ-trụ CÙNG tuần giáp tử (60 giáp tử chia 6 tuần) → độc thao thiên lý chi quyền. (「一旬包裹，独操千里之权。」)', source: 'lan dai v2' },
  { id: 'yilulianzhu', name: '一路連珠', vi: 'Nhất lộ liên châu', cat: 'cat',
    detect: { consecutiveBranches: 4 },
    judgment: '4 chi trụ liên tiếp liền kề (tử-sửu-dần-mão kiểu) → tảo đắc tứ phương chi dự. (「一路连珠，早擅四方之誉。」)', source: 'lan dai v2' },
  { id: 'qinglongtuilin', name: '青龍退鱗', vi: 'Thanh long thoái lân', cat: 'hung',
    detect: { and: [{ ganAny: ['甲', '乙'] }, { ganAny: ['庚', '辛'] }] },
    judgment: 'Giáp/Ất (thanh long) gặp Canh/Tân khắc → thoái lân, trầm luân. (「青龙退鳞兮，岂逃汨没。」中篇 hung)', source: 'lan dai v2' },
  { id: 'jiaolongshishui', name: '蛟龍失水', vi: 'Giao long thất thủy', cat: 'hung',
    detect: { and: [{ branch: '辰' }, { noNayinWx: '水' }] },
    judgment: 'Có Thìn (long) mà toàn cục KHÔNG nạp âm Thủy → giao long thất thủy, lưu đãng thất nghiệp. (中篇 hung)', source: 'lan dai v2' },
];

// ---------------------------------------------------------------------------
// B1. ZHIMI — 13 luật 三命指迷赋 (detect riêng — cần logic 驿马/tam hợp theo năm)
// ---------------------------------------------------------------------------
export const ZHIMI_PATTERNS = [
  { id: 'matoudaijian', name: '馬頭帶劍', vi: 'Mã đầu đới kiếm', cat: 'cat' },
  { id: 'caikusanhentai', name: '財庫三合', vi: 'Tài kho tam hợp', cat: 'cat' },
  { id: 'dajixiaoji', name: '大吉小吉', vi: 'Đại cát Tiểu cát', cat: 'cat' },
  { id: 'yinlintianyi', name: '印臨天乙', vi: 'Ấn lâm Thiên Ất', cat: 'cat' },
  { id: 'zhongtianyi', name: '重天乙', vi: 'Trùng Thiên Ất', cat: 'cat' },
  { id: 'tianluxingpo', name: '天祿刑破', vi: 'Thiên lộc hình phá', cat: 'hung' },
  { id: 'jieshayuanchen', name: '劫煞元辰', vi: 'Kiếp sát Nguyên thần', cat: 'hung' },
  { id: 'caizhangsheng', name: '財在長生', vi: 'Tài tại trường sinh', cat: 'cat' },
  { id: 'lumabingchi', name: '祿馬並馳', vi: 'Lộc mã bành trì', cat: 'cat' },
  { id: 'mayuchongshi', name: '馬遇沖時', vi: 'Mã ngộ xung thời', cat: 'cat' },
  { id: 'jinshajiagui', name: '金煞夾貴', vi: 'Kim sát giáp quý', cat: 'cat' },
  { id: 'xuetangduohe', name: '學堂多合', vi: 'Học đường đa hợp', cat: 'cat' },
  { id: 'fengchipeiyin', name: '鳳池佩印', vi: 'Phượng trì phối ấn', cat: 'cat' },
];
const XUN_KONG = { 甲: 0, 乙: 1, 丙: 2, 丁: 3, 戊: 4, 己: 5, 庚: 6, 辛: 7, 壬: 8, 癸: 9 };
const ZHI_IDX = { 子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5, 午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11 };
const SANHE_OF = { 子: '水', 辰: '水', 申: '水', 寅: '火', 午: '火', 戌: '火', 巳: '金', 酉: '金', 丑: '金', 亥: '木', 卯: '木', 未: '木' };
const LUCHE_OF_GAN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
const TIAN_YI_OF_GAN = { 甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'], 乙: ['子', '申'], 己: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'], 辛: ['午', '寅'] };
const CHANGSHENG_OF_WX = { 金: '巳', 木: '亥', 水: '申', 火: '寅', 土: '申' };
const YIMA_OF_YEAR = { 子: '寅', 辰: '寅', 申: '寅', 寅: '申', 午: '申', 戌: '申', 巳: '亥', 酉: '亥', 丑: '亥', 亥: '巳', 卯: '巳', 未: '巳' };
const KE_MAP = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const NAYIN_WX = (nayin) => { for (const w of ['金', '木', '水', '火', '土']) if ((nayin || '').endsWith(w)) return w; return ''; };

// ---------------------------------------------------------------------------
// B3. JINGJI — 五行精纪 bảng + luật máy (quyển 4/6/12/14/15/16/18)
// ---------------------------------------------------------------------------
export const WUHUA_ZHEN = { // 五合化真 — sinh đúng nguyệt = hóa chân (ZM-42/43)
  '甲己': { hua: '土', months: ['辰', '戌', '丑', '未'], kiGio: ['丙', '丁'] },
  '乙庚': { hua: '金', months: ['申', '酉'], kiGio: ['丙', '戊'] },
  '丙辛': { hua: '水', months: ['亥', '子'], kiGio: ['卯', '巳'] },
  '丁壬': { hua: '木', months: ['寅', '卯'], kiGio: ['午', '申'] },
  '戊癸': { hua: '火', months: ['巳', '午'], kiGio: ['戊', '己'] },
};
export const ZHUANJIAO_JIN = [ // 转角进化 — 干 hợp + chi tuần tiến, tại nhật/giờ (ZM-44)
  ['甲辰', '己巳'], ['戊戌', '癸亥'], ['乙巳', '庚辰'], ['丙戌', '辛卯'],
  ['丁亥', '壬寅'], ['戊子', '癸丑'], ['庚寅', '乙未'], ['辛卯', '丙申'],
];
export const ZHUANJIAO_THOAI = [ // 转角退化 — chi tuần nghịch (ZM-45)
  ['甲午', '己巳'], ['戊子', '癸亥'], ['乙酉', '庚申'], ['丙子', '辛亥'],
];
export const DUIDIE_SHA = [ // 颠倒杀/惆怅杀 (ZM-53): cặp nghịch thứ tự
  ['寅', '丑'], ['巳', '辰'], ['申', '未'], ['亥', '戌'],
];
export const YUE_DE_TABLE = { // 十二月 天德/月德/月合/月空/kỵ (ZM-54, 卷12)
  寅: { tianDe: '丁', yueDe: '丙', yueHe: '辛', yueKong: '壬', ky: ['癸', '庚'] },
  卯: { tianDe: '坤', yueDe: '甲', yueHe: '己', yueKong: '庚', ky: ['壬', '辛'] },
  辰: { tianDe: '壬', yueDe: '壬', yueHe: '丁', yueKong: '丙', ky: ['辛'] },
  巳: { tianDe: '辛', yueDe: '庚', yueHe: '乙', yueKong: '甲', ky: ['甲', '壬'] },
  午: { tianDe: '亥', yueDe: '丙', yueHe: '辛', yueKong: '壬', ky: ['庚', '壬'] },
  未: { tianDe: '甲', yueDe: '甲', yueHe: '己', yueKong: '庚', ky: ['丙', '癸'] },
  申: { tianDe: '癸', yueDe: '壬', yueHe: '丁', yueKong: '丙', ky: ['甲', '丙'] },
  酉: { tianDe: '寅', yueDe: '庚', yueHe: '乙', yueKong: '甲', ky: ['丙', '己'] },
  戌: { tianDe: '丙', yueDe: '丙', yueHe: '辛', yueKong: '壬', ky: ['甲', '乙'] },
  亥: { tianDe: '乙', yueDe: '甲', yueHe: '己', yueKong: '庚', ky: ['庚', '辛'] },
  子: { tianDe: '己', yueDe: '壬', yueHe: '丁', yueKong: '丙', ky: ['己', '庚'] },
  丑: { tianDe: '庚', yueDe: '庚', yueHe: '乙', yueKong: '甲', ky: ['丙', '丁', '壬'] },
};
export const SHENGCHENG_LU = { 甲: '甲寅', 乙: '乙卯', 丙: '丁巳', 丁: '戊午', 戊: '丁巳', 己: '戊午', 庚: '庚申', 辛: '辛酉', 壬: '癸亥', 癸: '壬子' }; // 生成禄 (ZM-59)
export const MINGWEI_LU_SHISHEN = { 甲: '丙', 乙: '丁', 丙: '戊', 丁: '己', 戊: '庚', 己: '辛', 庚: '壬', 辛: '癸', 壬: '甲', 癸: '乙' }; // 禄 trụ can = thực thần (ZM-60)
export const SHENGCHENG_MA = { 子: '甲寅', 辰: '甲寅', 申: '甲寅', 寅: '庚申', 午: '庚申', 戌: '庚申', 巳: '癸亥', 酉: '癸亥', 丑: '癸亥', 亥: '丁巳', 卯: '丁巳', 未: '丁巳' }; // 生成马 (ZM-61)
export const FUXING_GUIREN = { 甲: ['寅', '午'], 乙: ['丑', '未'], 辛: ['丑', '未'], 丙: ['酉', '亥'], 丁: ['子', '申'] }; // 福星贵人 khẩu quyết (ZM-56)
export const SIHANG_RIGU = [ // B4. 三命通会·卷6 — nhật trụ tứ tượng cách (ZM-65/66/67)
  { id: 'qinglongfuxing', name: '青龍伏形', vi: 'Thanh long phục hình', days: ['甲申', '甲戌', '乙巳', '乙酉', '乙丑'], judgment: 'Mộc phục ở Kim — nguyệt lệnh có nương, quan tinh đắc địa, kim-mộc cân → quý.' },
  { id: 'baihushishi', name: '白虎持勢', vi: 'Bạch hổ trì thế', days: ['庚午', '庚寅', '庚戌', '辛巳', '辛卯', '辛未'], judgment: 'Kim giữ thế (hỏa cục/quan sát hữu lực) → đắc thế nhi quý.' },
  { id: 'zhuquechengfeng', name: '朱雀乘風', vi: 'Chu tước thừa phong', days: ['丙申', '丙子', '丁亥', '丁酉'], judgment: 'Bính/Đinh ngồi Kim-Thủy → thừa phong nhi quý.' },
];
// A4/A6. SHENFENG — 盖头/截脚 cặp chuẩn (滴天髓阐微·岁运) + 雜格 (ZM-21 Bản 神峰)
export const GAITOU_PAIRS = ['庚寅', '辛卯', '壬午', '癸巳', '丙申']; // can khắc chi trong trụ/vận
export const JIAOJIAO_PAIRS = ['甲申', '乙酉', '丙子', '丁亥', '戊寅']; // chi khắc can
export const SHENFENG_ZAGE = [ // 神峰通考 5 雜格 (SF-29..33) — điều kiện máy
  { id: 'liuyishugui', name: '六乙鼠貴', days: ['乙亥', '乙未'], hour: '丙子', avoidGans: ['庚', '辛'], avoidDays: ['乙丑', '乙酉', '乙巳'], avoidBranches: ['午'], judgment: 'Lục Ất quý chuột — Tý động Tỵ khởi Canh Quan (Thiên Ất tại Tý); kỵ Canh/Tân lộ, kỵ Ngọ xung.' },
  { id: 'liuyinchaozhu', name: '六陰朝陽', days: ['辛丑', '辛卯', '辛巳', '辛未', '辛酉', '辛亥'], hour: '戊子', avoidGans: ['丙', '丁'], avoidBranches: ['巳', '午'], judgment: 'Sáu âm triều dương — Tý động Bính trong Tỵ làm quan; kỵ Bính Đinh Tỵ Ngọ, kỵ Mão xung Tý.' },
  { id: 'xinghege', name: '刑合', days: ['癸亥', '癸卯', '癸酉'], hour: '甲寅', avoidGans: ['戊'], avoidBranches: ['申'], judgment: 'Dần hình Tỵ phóng Mậu (quan) hợp về Quý; kỵ Mậu lộ, kỵ Thân xung Dần.' },
  { id: 'chouyaosi', name: '丑遙巳', days: ['癸丑', '辛丑'], minChou: 2, avoidBranches: ['巳', '寅', '子'], judgment: 'Sửu nhiều tàu hợp Mậu/Bính trong Tỵ làm quan; kỵ Tỵ (lấp thật), kỵ Dần (trói Sửu).' },
  { id: 'heluge', name: '合祿', days: ['戊辰', '戊午', '戊戌', '戊子', '戊寅', '戊申'], hour: '庚申', avoidGans: ['甲', '丙'], avoidBranches: ['卯', '寅'], judgment: 'Canh thực thần hợp Ất (quan) về cho Mậu — hợp lộc; kỵ Giáp Bính Mão Dần.' },
];

// ---------------------------------------------------------------------------
// BỘ QUÉT — scanCuophapExtra(chart, R) → { patterns:[], checks:[], verdict }
// ---------------------------------------------------------------------------
const T2S = { 劍: '剑', 鋒: '锋', 燈: '灯', 楊: '杨', 頭: '头', 釵: '钗', 釧: '钏', 澗: '涧', 長: '长', 寶: '宝', 馬: '马', 龍: '龙', 鳳: '凤', 淵: '渊', 躍: '跃', 門: '门', 鐘: '钟', 鎮: '镇', 桿: '杆' };
const normNayin = (s) => (s || '').split('').map((c) => T2S[c] || c).join('');

function pillarList(c) {
  const out = [];
  for (const pos of ['year', 'month', 'day', 'time']) {
    const p = c?.pillars?.[pos];
    if (p) out.push({ pos, gan: p.gan || '', zhi: p.zhi || '', gz: (p.gan || '') + (p.zhi || ''), nayin: normNayin(p.nayin || '') });
  }
  return out;
}

function matchV2(pillars, monthZhi, spec) {
  if (!spec) return true;
  if (spec.and) return spec.and.every((s) => matchV2(pillars, monthZhi, s));
  if (spec.noBranch) return !pillars.some((p) => p.zhi === spec.noBranch);
  if (spec.noGan) return !pillars.some((p) => p.gan === spec.noGan);
  if (spec.noNayinWx) return !pillars.some((p) => NAYIN_WX(p.nayin) === spec.noNayinWx);
  if (spec.samePillar) { // can ∧ chi CÙNG MỘT trụ
    const gans = pillars.filter((p) => spec.ganAny?.includes(p.gan));
    return gans.some((p) => spec.branchAny?.includes(p.zhi));
  }
  if (spec.sameXun) { // năm-trụ ∧ nhật/giờ-trụ cùng tuần giáp tử
    const y = pillars.find((p) => p.pos === 'year'); if (!y) return false;
    const startXun = (10 + ZHI_IDX[y.zhi] - XUN_KONG[y.gan]) % 10; // chỉ số can đầu tuần chứa (gan,zhi)
    const xunOf = (gz) => { const g = XUN_KOCK_SAFE(gz[0]); const z = ZHI_IDX[gz[1]] ?? -1; if (g == null || z < 0) return null; return (10 + z - g) % 10; };
    const targets = pillars.filter((p) => p.pos === 'day' || p.pos === 'time');
    const xunY = xunOf(y.gz);
    return xunY != null && targets.some((p) => xunOf(p.gz) === xunY);
  }
  if (spec.consecutiveBranches) { // 4 chi liền kề tăng dần
    const n = spec.consecutiveBranches;
    if (pillars.length < n) return false;
    const idx = pillars.map((p) => ZHI_IDX[p.zhi]).filter((v) => v != null);
    if (idx.length < n) return false;
    for (let i = 0; i + n <= idx.length; i++) {
      let ok = true;
      for (let j = 1; j < n; j++) if (idx[i + j] !== (idx[i] + j) % 12) { ok = false; break; }
      if (ok) return true;
    }
    return false;
  }
  // fallback: ủy thác specs cơ bản cho gufa-engine matchDetect (đã import? — tự xử lý)
  if (spec.nayin) return pillars.some((p) => p.nayin.includes(normNayin(spec.nayin)));
  if (spec.nayinAny) return pillars.some((p) => spec.nayinAny.some((f) => p.nayin.includes(normNayin(f))));
  if (spec.ganzhi) return pillars.some((p) => p.gz === spec.ganzhi);
  if (spec.ganzhiAny) return pillars.some((p) => spec.ganzhiAny.includes(p.gz));
  if (spec.branch) return pillars.some((p) => p.zhi === spec.branch);
  if (spec.branchAny) return pillars.some((p) => spec.branchAny.includes(p.zhi));
  if (spec.branchesAll || spec.branches) { const b = spec.branchesAll || spec.branches; return b.every((x) => pillars.some((p) => p.zhi === x)); }
  if (spec.gan) return pillars.some((p) => p.gan === spec.gan);
  if (spec.ganAny) return pillars.some((p) => spec.ganAny.includes(p.gan));
  if (spec.month) { const S = { spring: ['寅', '卯', '辰'], summer: ['巳', '午', '未'], autumn: ['申', '酉', '戌'], winter: ['亥', '子', '丑'] }; return (S[spec.month] || []).includes(monthZhi); }
  return false;
}
function XUN_KOCK_SAFE(g) { const v = XUN_KONG[g]; return v == null ? null : v; }

export function scanCuophapExtra(chart, R) {
  const c = chart?.chart ? chart.chart : chart;
  const pillars = pillarList(c);
  const monthZhi = c?.pillars?.month?.zhi || '';
  const out = { patterns: [], checks: [], sources: {} };
  const hit = (item) => { out.patterns.push(item); out.sources[item.source || 'round2'] = (out.sources[item.source || 'round2'] || 0) + 1; };

  // ---- 兰台 V2 (spec máy) ----
  for (const pat of LANTAI_PATTERNS_V2) {
    try { if (matchV2(pillars, monthZhi, pat.detect)) hit({ id: pat.id, name: pat.name, vi: pat.vi, cat: pat.cat, judgment: pat.judgment, source: '兰台妙选v2' }); } catch (_) {}
  }

  // ---- 三命指迷 13 luật (logic riêng) ----
  const yearP = pillars.find((p) => p.pos === 'year');
  const yearZhi = yearP?.zhi || '';
  const dayP = pillars.find((p) => p.pos === 'day');
  const yima = YIMA_OF_YEAR[yearZhi];
  const allGans = pillars.map((p) => p.gan);
  const allZhis = pillars.map((p) => p.zhi);
  // ZM-01 马头带剑: trụ chứa chi 驿马 ∧ (can 庚辛 trên trụ đó ∨ nạp âm Kim)
  if (yima) {
    const maP = pillars.filter((p) => p.zhi === yima);
    const jian = maP.some((p) => ['庚', '辛'].includes(p.gan) || NAYIN_WX(p.nayin) === '金');
    if (jian) hit({ id: 'matoudaijian', name: '馬頭帶劍', vi: 'Mã đầu đới kiếm', cat: 'cat', judgment: 'Trụ Mã (chi ' + yima + ') đới Canh/Tân hoặc nạp âm Kim — 真剑 = 壬申/癸酉 → chủ tướng quyền, vũ quý. (三命指迷賦: 「马头带剑主将权。」)', source: '三命指迷' });
  }
  // ZM-02 财库三合: chi kho ∧ 2 chi khác cùng cục tam hợp (đủ cục gần đúng: ≥3 chi cùng hành cục)
  try {
    const dayGanWx = KE_MAP; // tài của can ngày = hành can khắc
    const dayWx5 = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[dayP?.gan || ''];
    if (dayWx5) {
      const caiWx = KE_MAP[dayWx5];
      const KU = { 金: '丑', 木: '未', 水: '辰', 火: '戌', 土: '戌' }[caiWx];
      const caiSanheZhis = Object.entries(SANHE_OF).filter(([, w]) => w === caiWx).map(([z]) => z);
      const cnt = allZhis.filter((z) => caiSanheZhis.includes(z)).length;
      if (allZhis.includes(KU) && cnt >= 3) hit({ id: 'caikusanhentai', name: '財庫三合', vi: 'Tài kho tam hợp', cat: 'cat', judgment: 'Kho Tài (' + KU + ') ∧ ' + cnt + ' chi cục ' + caiWx + ' → 石崇 vạn kim chi chủ. (三命指迷)', source: '三命指迷' });
    }
  } catch (_) {}
  // ZM-03 大吉小吉: 丑 ∧ 未
  if (allZhis.includes('丑') && allZhis.includes('未')) hit({ id: 'dajixiaoji', name: '大吉小吉', vi: 'Đại cát tiểu cát', cat: 'cat', judgment: 'Sửu (đại cát) phùng Mùi (tiểu cát) → phản thọ trường niên. (三命指迷)', source: '三命指迷' });
  // ZM-04 印临天乙: chi Thiên Ất (theo can ngày) trùng vị Ấn ≈ chi cận kề sau chi Lộc
  try {
    const lu = LUCHE_OF_GAN[dayP?.gan || '']; const luIdx = ZHI_IDX[lu];
    const yinZhi = ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'][luIdx]; // lộc trước 1 vị ≈ ấn vị cổ pháp
    const quyZhis = TIAN_YI_OF_GAN[dayP?.gan || ''] || [];
    if (allZhis.includes(yinZhi) && quyZhis.includes(yinZhi)) hit({ id: 'yinlintianyi', name: '印臨天乙', vi: 'Ấn lâm Thiên Ất', cat: 'cat', judgment: 'Vị Ấn (' + yinZhi + ') trùng chi Thiên Ất → lũ thế ấp phong. (三命指迷)', source: '三命指迷' });
  } catch (_) {}
  // ZM-05 重天乙: chi Quý ≥2
  try {
    const quy = TIAN_YI_OF_GAN[dayP?.gan || ''] || [];
    const n = allZhis.filter((z) => quy.includes(z)).length;
    if (n >= 2) hit({ id: 'zhongtianyi', name: '重天乙', vi: 'Trùng Thiên Ất', cat: 'cat', judgment: 'Thiên Ất xuất hiện ' + n + ' lần → trí thân miếu đường (lập triều). (三命指迷)', source: '三命指迷' });
  } catch (_) {}
  // ZM-06 天禄刑破: chi Lộc gặp xung (đơn giản hoá: xung đối chi)
  try {
    const lu = LUCHE_OF_GAN[dayP?.gan || '']; const luIdx = ZHI_IDX[lu];
    const chongZhi = ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'][luIdx];
    if (allZhis.includes(chongZhi)) hit({ id: 'tianluxingpo', name: '天祿刑破', vi: 'Thiên lộc hình phá', cat: 'hung', judgment: 'Chi Lộc (' + lu + ') bị xung (' + chongZhi + ') → định phần ách; việc thành chậm. (三命指迷)', source: '三命指迷' });
  } catch (_) {}
  // ZM-07 劫煞: 申子辰→巳, 寅午戌→亥, 巳酉丑→寅, 亥卯未→申
  const JIESHA = { 子: '巳', 辰: '巳', 申: '巳', 寅: '亥', 午: '亥', 戌: '亥', 巳: '寅', 酉: '寅', 丑: '寅', 亥: '申', 卯: '申', 未: '申' };
  const js = JIESHA[yearZhi];
  if (js && allZhis.includes(js)) hit({ id: 'jieshayuanchen', name: '劫煞', vi: 'Kiếp sát', cat: 'hung', judgment: 'Kiếp sát (' + js + ') trên năm (' + yearZhi + ') → chủ hung bạo, cần chế. (三命指迷: 「劫主凶暴。」)', source: '三命指迷' });
  // ZM-08 财在长生: chi trường sinh của hành Tài (can ngày khắc)
  try {
    const dayWx5 = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[dayP?.gan || ''];
    const caiWx2 = KE_MAP[dayWx5]; const cs = CHANGSHENG_OF_WX[caiWx2];
    if (cs && allZhis.includes(cs)) hit({ id: 'caizhangsheng', name: '財在長生', vi: 'Tài tại trường sinh', cat: 'cat', judgment: 'Tài (' + caiWx2 + ') ngồi trường sinh (' + cs + ') → tự doanh trác lập, tự置产业. (三命指迷)', source: '三命指迷' });
  } catch (_) {}
  // ZM-10 马遇冲时: chi giờ xung chi Mã
  if (yima) {
    const timeP = pillars.find((p) => p.pos === 'time');
    const chongOf = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
    if (timeP && chongOf[timeP.zhi] === yima) hit({ id: 'mayuchongshi', name: '馬遇沖時', vi: 'Mã ngộ xung thời', cat: 'cat', judgment: 'Chi giờ xung Mã (' + yima + ') → Tào Tháo tam phân chi chủ — bá vương chi cơ. (三命指迷)', source: '三命指迷' });
  }
  // ZM-11 金煞夹贵: hung chi kiếp sát ∧ có chi Quý
  try {
    const quy2 = TIAN_YI_OF_GAN[dayP?.gan || ''] || [];
    if (js && allZhis.includes(js) && allZhis.some((z) => quy2.includes(z))) hit({ id: 'jinshajiagui', name: '金煞夾貴', vi: 'Kim sát giáp quý', cat: 'cat', judgment: 'Sát ∧ Thiên Ất cùng hiện → hữu binh hữu quyền (hung mà thành quyền). (三命指迷)', source: '三命指迷' });
  } catch (_) {}
  // ZM-12 学堂多合: chi trường sinh hành can ngày ∧ có hợp lục với chi khác
  try {
    const dayWx5b = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[dayP?.gan || ''];
    const xt = CHANGSHENG_OF_WX[dayWx5b];
    const LIUHE = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };
    if (xt && allZhis.includes(xt) && allZhis.includes(LIUHE[xt])) hit({ id: 'xuetangduohe', name: '學堂多合', vi: 'Học đường đa hợp', cat: 'cat', judgment: 'Học đường (' + xt + ') có hợp → đăng thượng giáp chi đệ. (三命指迷)', source: '三命指迷' });
  } catch (_) {}

  // ---- B3 五行精纪 checks ----
  // 五合化真 (ZM-42/43): can hợp cặp ∧ sinh đúng nguyệt ∧ kỵ giờ
  try {
    const monthP = pillars.find((p) => p.pos === 'month'); const timeP = pillars.find((p) => p.pos === 'time');
    for (const [pair, cfg] of Object.entries(WUHUA_ZHEN)) {
      const [g1, g2] = pair.split('');
      if (allGans.includes(g1) && allGans.includes(g2) && cfg.months.includes(monthZhi)) {
        const ki = timeP && cfg.kiGio.includes(timeP.gan);
        hit({ id: 'wuhuazhen-' + pair, name: pair + '化' + cfg.hua + (ki ? '(bị phá)' : '(chân)'), vi: pair + ' hóa ' + cfg.hua, cat: ki ? 'hung' : 'cat', judgment: ki ? 'Hóa khí bị giờ kỵ (' + timeP.gan + ') phá → hóa mà không chân, suy kiệt.' : 'Hóa chân sinh đúng nguyệt (' + monthZhi + ') → thành tượng, quý. (五行精纪 卷4)', source: '五行精纪' });
      }
    }
  } catch (_) {}
  // 转角进/退化 (ZM-44/45): cặp trụ tại nhật+giờ
  try {
    const dp = pillars.find((p) => p.pos === 'day'); const tp = pillars.find((p) => p.pos === 'time');
    if (dp && tp) {
      for (const [a, b] of ZHUANJIAO_JIN) if ((dp.gz === a && tp.gz === b) || (dp.gz === b && tp.gz === a)) hit({ id: 'zhuanjiaojin', name: '轉角進化', vi: 'Chuyển giác tiến hóa', cat: 'cat', judgment: 'Nhật-giờ 干合 chi tiến → công danh bất chí gian nan. (五行精纪 引廣信集)', source: '五行精纪' });
      for (const [a, b] of ZHUANJIAO_THOAI) if ((dp.gz === a && tp.gz === b) || (dp.gz === b && tp.gz === a)) hit({ id: 'zhuanjiaothoai', name: '轉角退化', vi: 'Chuyển giác thoái hóa', cat: 'hung', judgment: '干 hợp chi nghịch → công danh vãn đáo, hảo xứ thoái giảm.', source: '五行精纪' });
    }
  } catch (_) {}
  // 颠倒杀 (ZM-53)
  for (const [x, y] of DUIDIE_SHA) {
    if (allZhis.includes(x) && allZhis.includes(y)) { hit({ id: 'duidiesha', name: '顛倒殺', vi: 'Điên đảo sát (u sầu)', cat: 'hung', judgment: 'Cặp nghịch ' + x + y + ' → u uất chẳng toại nguyện. (五行精纪 卷6)', source: '五行精纪' }); break; }
  }
  // 支神一字格 (ZM-48): 4 chi giống hệt
  if (pillars.length === 4 && new Set(allZhis).size === 1) hit({ id: 'zhishenyizi', name: '支神一字', vi: 'Chi thần nhất tự', cat: 'cat', judgment: 'Tứ chi đồng tự → phúc nhiều tắc lưỡng phủ, sát nhiều tắc穷 yểu — cực cách hai đầu. (五行精纪 卷6)', source: '五行精纪' });
  // 六合双鸳 (ZM-49): ≥2 nhóm lục hợp
  try {
    const LIUHE = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };
    let pairs = 0; const seen = new Set();
    for (const z of allZhis) { const h = LIUHE[z]; if (h && allZhis.includes(h) && !seen.has(z + h)) { seen.add(z + h); seen.add(h + z); pairs++; } }
    if (pairs >= 2) hit({ id: 'liuheshuangyuan', name: '六合雙鴛', vi: 'Lục hợp song uyên', cat: 'cat', judgment: pairs + ' nhóm lục hợp → tọa hoài đình nhi bố chính. (五行精纪 卷6)', source: '五行精纪' });
  } catch (_) {}
  // 隔六合 (ZM-50): 子+巳 / 午+亥
  if ((allZhis.includes('子') && allZhis.includes('巳')) || (allZhis.includes('午') && allZhis.includes('亥'))) hit({ id: 'geliuhe', name: '隔六合', vi: 'Cách lục hợp', cat: 'cat', judgment: 'Tý-Tỵ / Ngọ-Hợi cách vị tương hợp → ám quý tương hợp. (五行精纪 卷6)', source: '五行精纪' });
  // 四极全备 (ZM-52): đủ bộ 4 chi cùng nhóm
  const JI_SETS = [['寅', '申', '巳', '亥'], ['子', '午', '卯', '酉'], ['辰', '戌', '丑', '未']];
  for (const set of JI_SETS) if (set.every((z) => allZhis.includes(z))) { hit({ id: 'sijiquanbei', name: '四極全備', vi: 'Tứ cực toàn bị', cat: 'cat', judgment: 'Đủ ' + set.join('') + ' → Đặng Vũ lục mấn tướng quân — trẻ nắm binh quyền. (五行精纪 卷6)', source: '五行精纪' }); break; }
  // 生成禄/名位禄 (ZM-59/60) + 生成马/名位马 (ZM-61/62)
  try {
    const yg = yearP?.gan || '';
    if (SHENGCHENG_LU[yg] && pillars.some((p) => p.gz === SHENGCHENG_LU[yg])) hit({ id: 'shengchenglu', name: '生成祿', vi: 'Sinh thành Lộc', cat: 'cat', judgment: 'Trụ Lộc cùng khí năm can (' + SHENGCHENG_LU[yg] + ') → quý cách. (五行精纪 卷15)', source: '五行精纪' });
    const luZhi = LUCHE_OF_GAN[yg]; const luP = pillars.find((p) => p.zhi === luZhi);
    if (luP && luP.gan === MINGWEI_LU_SHISHEN[yg]) hit({ id: 'mingweilu', name: '名位祿', vi: 'Danh vị Lộc', cat: 'cat', judgment: 'Trụ Lộc đới Thực thần (' + luP.gz + ') → quý cách. (五行精纪 卷15)', source: '五行精纪' });
    const scMa = SHENGCHENG_MA[yearZhi];
    if (scMa && pillars.some((p) => p.gz === scMa)) hit({ id: 'shengchengma', name: '生成馬', vi: 'Sinh thành Mã', cat: 'cat', judgment: 'Trụ Mã cùng khí năm (' + scMa + ') → quý mã có khí. (五行精纪 卷16)', source: '五行精纪' });
  } catch (_) {}
  // 福星贵人 (ZM-56)
  try {
    const fx = FUXING_GUIREN[yearP?.gan || ''] || [];
    if (fx.length && allZhis.some((z) => fx.includes(z))) hit({ id: 'fuxingguiren', name: '福星貴人', vi: 'Phúc tinh quý nhân', cat: 'cat', judgment: 'Phúc tinh phò quý (can ' + (yearP?.gan || '') + ' → ' + fx.join('/') + ') → đại quý. (五行精纪 卷14 khẩu quyết)', source: '五行精纪' });
  } catch (_) {}

  // ---- B4 四象日柱格 (三命通会·卷6) ----
  if (dayP) {
    for (const g of SIHANG_RIGU) {
      if (g.days.includes(dayP.gz)) hit({ id: g.id, name: g.name, vi: g.vi, cat: 'cat', judgment: g.judgment + ' (三命通会·卷6 — đính chính nguồn: KHÔNG phải 兰台)', source: '三命通会' });
    }
  }

  // ---- A6 神峰通考 雜格 (SF-29..33) ----
  try {
    const timeP = pillars.find((p) => p.pos === 'time');
    if (timeP) {
      for (const g of SHENFENG_ZAGE) {
        if (!g.days.includes(dayP?.gz)) continue;
        if (timeP.gz !== g.hour) continue;
        const badGan = (g.avoidGans || []).some((x) => allGans.includes(x));
        const badDay = (g.avoidDays || []).includes(dayP.gz);
        const badZhi = (g.avoidBranches || []).some((x) => allZhis.includes(x));
        if (!badGan && !badDay && !badZhi) hit({ id: g.id, name: g.name, vi: g.name, cat: 'cat', judgment: g.judgment + ' (神峰通考)', source: '神峰通考' });
        else hit({ id: g.id + '-po', name: g.name + '(破)', vi: g.name + ' bị phá', cat: 'hung', judgment: 'Cách ' + g.name + ' có đủ hình nhưng phạm kỵ (' + [badGan && 'kỵ can', badDay && 'kỵ nhật', badZhi && 'kỵ chi'].filter(Boolean).join(', ') + ') → thành mà như không. (神峰通考)', source: '神峰通考' });
      }
    }
  } catch (_) {}
  // 丑遥巳 cần ≥2 Sửu — lọc riêng (spec minChou)
  const chouYaosi = out.patterns.find((p) => p.id === 'chouyaosi' || p.id === 'chouyaosi-po');
  if (chouYaosi && allZhis.filter((z) => z === '丑').length < 2) out.patterns = out.patterns.filter((p) => !(p.id === 'chouyaosi' || p.id === 'chouyaosi-po'));

  // ---- A4 盖头/截脚 (trụ gốc, bản chuẩn hoá 滴天髓 + bản rộng 张楠) ----
  const checks = [];
  for (const p of pillars) {
    if (GAITOU_PAIRS.includes(p.gz)) checks.push({ kind: '盖头', pos: p.pos, detail: p.gz + ' — can khắc chi cùng trụ (đứng đầu che khuất chi)', source: '滴天髓阐微·岁运 (đính chính nguồn)' });
    if (JIAOJIAO_PAIRS.includes(p.gz)) checks.push({ kind: '截脚', pos: p.pos, detail: p.gz + ' — chi khắc can cùng trụ (chặn chân can)', source: '滴天髓阐微·岁运 (đính chính nguồn)' });
  }
  // 盖头 trên VẬN hiện tại (bản gốc 张楠: úp cả khi can TIẾT chi)
  try {
    const dy = R?.dayun || [];
    if (dy.length) {
      const age = new Date().getFullYear() - (R?.chart?.input?.year || R?.input?.year || 1990);
      let cur = dy[0];
      for (const d of dy) { if ((d.startAge || 0) <= age) cur = d; }
      const gz = (cur.gan || '') + (cur.zhi || '');
      if (GAITOU_PAIRS.includes(gz)) checks.push({ kind: '盖头(đại vận)', pos: 'dayun', detail: 'Đại vận ' + gz + ' — can úp đầu chi (bản 张楠 rộng: cả tiết khí) → chi hỷ khó ra lực', source: '神峰通考·盖头说' });
      if (JIAOJIAO_PAIRS.includes(gz)) checks.push({ kind: '截脚(đại vận)', pos: 'dayun', detail: 'Đại vận ' + gz + ' — chi chặn chân can', source: '滴天髓阐微·岁运' });
    }
  } catch (_) {}
  out.checks = checks;

  // verdict gọn
  const cat2 = out.patterns.filter((p) => p.cat === 'cat');
  const hung2 = out.patterns.filter((p) => p.cat === 'hung');
  out.verdict = 'CỔ PHÁP ROUND 2 (三命指迷+兰台v2+五行精纪+三命通会+神峰): ';
  out.verdict += cat2.length ? 'trúng ' + cat2.length + ' cách CAT (' + cat2.slice(0, 3).map((p) => p.vi).join(', ') + ')' : 'không trúng cách cat mới nào';
  out.verdict += hung2.length ? ' · ' + hung2.length + ' mục HUNG/cảnh báo (' + hung2.slice(0, 2).map((p) => p.vi).join(', ') + ')' : '';
  out.verdict += checks.length ? ' · 盖头/截脚: ' + checks.map((c) => c.kind + '@' + c.pos).join(', ') : '';
  return out;
}

// ---------------------------------------------------------------------------
// C. MINGLI PRINCIPLES — 命理约言 + 神峰 4病4药 (NÃO AI — nguyên tắc luận)
// ---------------------------------------------------------------------------
export const MINGLI_PRINCIPLES = [
  { id: 'MY-03', rule: 'Mệnh đại phú quý KHÔNG chỉ dựa một Dụng thần; độc thần = mệnh cứu thiên lệch.', src: '命理约言·论用神' },
  { id: 'MY-05', rule: 'Lộc/Nhận/Tỷ/Kiếp KHÔNG BAO GIỜ lập cách — chỉ là trợ thân.', src: '命理约言·看命总法' },
  { id: 'MY-08', rule: 'Tòng hóa phải cực chân, nhất/lưỡng thần vô tạp, ám xung/hợp đúng chỗ — kẻo lấy mơ hồ.', src: '命理约言·论格局' },
  { id: 'MY-10', rule: 'Đắc thời đắc cục → Sát/Thương vẫn phú quý; thất thời → Quan/Ấn vẫn bần tiện.', src: '命理约言' },
  { id: 'MY-14', rule: 'Hỷ thần sợ xung; Kỵ thần MỪNG xung — xung vào kỵ là tốt.', src: '命理约言·支冲论' },
  { id: 'MY-15', rule: 'CẤM bảng Hỷ-Kỵ cứng: Hỷ/Kỵ suy từ sinh-khắc-chế-hóa cục thật (陈素庵 xóa 金神/魁罡 cứng).', src: '命理约言·金神论' },
  { id: 'MY-20', rule: 'Xung can CHỈ 4 cặp: 甲庚/乙辛/壬丙/癸丁; Mậu Kỷ vô xung; 丙庚/丁辛 tính khắc.', src: '命理约言·干冲论' },
  { id: 'MY-21', rule: 'Xung: đắc lệnh vào thần suy = nhổ gốc; thất thời xung thần vượng = vô hại.', src: '命理约言·支冲论' },
  { id: 'MY-22', rule: 'Xung không đủ lực = kích phản: kích hung thần là họa, kích cát thần vô hại.', src: '命理约言·支冲论' },
  { id: 'MY-26', rule: 'Lục hợp phải 2 chữ kề cận; chen xung = phá; chen chữ lửng = vô lực.', src: '命理约言·支合论' },
  { id: 'MY-28', rule: 'Tam Hình = luận cứ YẾU: cát hung quyết từ tứ trụ gốc, không từ Hình (giáng cấp trọng số hình).', src: '命理约言·支刑论' },
  { id: 'MY-30', rule: 'TIỂU VẬN bị 陈素庵 cắt («其理不确…故削之») — không dùng tiểu vận.', src: '命理约言·小运论' },
  { id: 'MY-31', rule: 'Vận đo theo nền phúc: phúc 8/10 → ác vận 2-3/10 vô hại; phúc 5/10 → 1/10 ác vận đã nặng.', src: '命理约言·杂论' },
  { id: 'MY-32', rule: 'Vận tốt phải sau 20-30 tuổi mới thật giá trị; vận sớm = phát sớm tàn.', src: '命理约言·杂论' },
  { id: 'MY-34', rule: 'Thần mạnh quá không chế được → dẫn hóa bằng thần nó sinh (cùng âm dương thượng sách).', src: '命理约言·杂论' },
  { id: 'MY-35', rule: 'Điều hậu mở rộng: đông hóa khắc thành sinh DỄ, hè KHÓ — cùng hỷ thủy/hỏa nhưng độ khó khác.', src: '命理约言·杂论' },
  { id: 'SF-03', rule: '«有病方为贵，无伤不是奇» — có bệnh + có thuốc = quý; sạch bóng = vô dụng.', src: '神峰通考·病药说' },
  { id: 'SF-07', rule: 'Thân trung hòa ∧ Tài-Quan-Ấn vô thương → PHÀM NHÂN (mệnh thường).', src: '神峰通考·病药说' },
  { id: 'SF-08', rule: 'Bệnh nặng + thuốc nặng + vận hợp → đại phú đại quý (định mức đẳng cấp theo cặp bệnh-thuốc).', src: '神峰通考·病药说' },
  { id: 'SF-09', rule: 'Bệnh 雕: cách sạch tuyệt đối (Quan¬Thương, Tài¬Kiếp, Ấn¬Tài, Thực¬Ấn) → 未琢之玉, 反不取贵.', src: '神峰通考·四病说' },
  { id: 'SF-10/12', rule: 'Bệnh 枯/弱: dụng thần có gốc mà yếu → mừng vận đến địa của nó; VÔ GỐC thì bất trị.', src: '神峰通考·四病说' },
  { id: 'SF-15', rule: 'Chỉ dương can trường sinh là SINH THẬT; âm can "sinh" là giả; âm can tử xứ được tư dưỡng.', src: '神峰通考·四药说' },
  { id: 'SF-20', rule: '盖头 = chân truyền: can kỵ úp chi hỷ (kể cả TIẾT khí, bản 张楠) → chi không ra lực.', src: '神峰通考·盖头说' },
  { id: 'SF-22/23', rule: 'Quan-Sát hỗn tạp → 去/留: bỏ quan giữ sát = thiên quan cách; bỏ sát giữ quan = chính quan cách; khử bên NHẸ giữ bên NẶNG, thấu can dễ khử.', src: '神峰通考·去留' },
  { id: 'SF-25/27', rule: 'Công cụ khử Quan/Sát = Thương/Thực; khử bằng HỢP (贪合忘杀: 癸 hợp 戊) cũng cứu được.', src: '神峰通考·去留' },
];

// CUOPHAP_BRAIN — khối compact chèn system prompt AI (≤2.5KB)
export const CUOPHAP_BRAIN =
  'CỔ PHÁP ROUND 2 (quét sâu 2026-10 — 三命指迷/兰台v2/五行精纪/三命通会/神峰通考/命理约言):\n' +
  '• NGUỒN ĐÚNG: 截脚/盖头 chuẩn = 滴天髓阐微·岁运 (任铁樵) — KHÔNG phải 神峰通考; 盖头 bản 张楠 rộng hơn (can TIẾT chi cũng úp).\n' +
  '• 青龙伏形/白虎持势/朱雀乘风 = 三命通会·卷6 (nhật trụ: 甲申甲戌乙巳乙酉乙丑 / 庚午庚寅庚戌辛巳辛卯辛未 / 丙申丙子丁亥丁酉).\n' +
  '• 病药 4+4: bệnh = 雕(cách sạch vô dụng)/枯(có gốc mà yếu)/旺(ấy quá)/弱(yếu); thuốc = 损(bớt thừa)/益(bổ thiếu)/生(dương can trường sinh mới thật)/长(địa vượng).\n' +
  '• 去留舒配: Quan-Sát lẫn → bỏ bên NHẸ giữ bên NẶNG bằng Thương/Thực hoặc HỢP; bỏ quan giữ sát = thiên quan cách, ngược lại = chính quan cách.\n' +
  '• MỚI match được: 马头带剑(真剑=壬申/癸酉), 财库三合, 六乙鼠贵, 六阴朝阳, 刑合, 丑遥巳, 合禄, 五合化真(đúng nguyệt), 转角进/退化, 类破杀, 真鬼, 颠倒杀(寅丑/巳辰/申未/亥戌), 四极全备, 一字格, 生成禄/名位禄/生成马/名位马, 福星贵人, 昼夜贵人.\n' +
  '• 十二月德 bổ sung: 月合/月空/kỵ-can theo tháng (vd 寅月: 月合辛, 月空壬, kỵ 癸庚) — ngoài 天月德 đã có.\n' +
  MINGLI_PRINCIPLES.slice(0, 14).map((p) => '• ' + p.rule + ' (' + p.src + ')\n').join('') +
  '• Engine đã TỰ quét các cách này (tool analyze_gufa + brief「CỔ PHÁP ROUND 2」) — DÙNG KẾT QUẢ ĐÓ, đừng tự đoán lại.\n';

export default { LANTAI_PATTERNS_V2, ZHIMI_PATTERNS, SIHANG_RIGU, scanCuophapExtra, MINGLI_PRINCIPLES, CUOPHAP_BRAIN, WUHUA_ZHEN, ZHUANJIAO_JIN, ZHUANJIAO_THOAI, DUIDIE_SHA, YUE_DE_TABLE, SHENGCHENG_LU, SHENGCHENG_MA, FUXING_GUIREN, GAITOU_PAIRS, JIAOJIAO_PAIRS, SHENFENG_ZAGE };
