// ============================================================================
//  TỬ VI ĐẨU SỐ 紫微斗数 — BỘ KHUNG MỆNH BÀN (vòng 1: cung + cục + đại hạn)
//  Tính: 命宫, 身宫 (起诀), 12 cung (逆排), 五行局 (五虎遁→命宫纳音→局),
//  大限 (起运=局数, 阳/阴顺逆). 14主星 để vòng sau.
//  Nguồn: 安命身诀 "斗柄建寅起正月…逆回安命顺安身", 十二宫, 五行局定局.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { computeFuxing } from './fuxing.js';
import { GAN, ZHI } from './constants.js';
import { ziShiRoll } from './chart.js'; // [loop 178] 紫微 bẩm sinh dùng cùng 子时换日 quy ước 八字
import { parseGender } from './core.js'; // [loop 743] ROBUST gender parsing

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 寅-bắt đầu cho月起 (O[0]=寅=tháng 1)
const YIN_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 五虎遁: năm can → 寅 cung thiên can
const WUHU = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

// 30 cặp nạp âm → ngũ hành (theo thứ tự 60 hoa giáp)
const NAYIN_WX = ['金','火','木','土','金','火','水','土','金','木','水','土','火','木','水','金','火','木','土','金','火','水','土','金','木','水','土','火','木','水'];
const JU_NUM = { 水: 2, 木: 3, 金: 4, 土: 5, 火: 6 };
const JU_VI = { 水: 'Thủy nhị cục', 木: 'Mộc tam cục', 金: 'Kim tứ cục', 土: 'Thổ ngũ cục', 火: 'Hỏa lục cục' };

// 12 cung theo thứ tự (từ命 cung, 逆排)
const PALACES = [
  { zh: '命宫', vi: 'Mệnh (cá nhân, tổng cục)' },
  { zh: '兄弟', vi: 'Huynh Đệ (anh chị em)' },
  { zh: '夫妻', vi: 'Phu Thê (vợ chồng)' },
  { zh: '子女', vi: 'Tử Nữ (con cái)' },
  { zh: '财帛', vi: 'Tài Bạch (tài lộc)' },
  { zh: '疾厄', vi: 'Tật Ách (sức khoẻ)' },
  { zh: '迁移', vi: 'Thiên Di (di chuyển)' },
  { zh: '奴仆', vi: 'Nô Bộc (bạn bè/phụ thuộc)' },
  { zh: '官禄', vi: 'Quan Lộc (sự nghiệp)' },
  { zh: '田宅', vi: 'Điền Trạch (nhà cửa)' },
  { zh: '福德', vi: 'Phúc Đức (tinh thần/phúc)' },
  { zh: '父母', vi: 'Phụ Mẫu (cha mẹ)' },
];

// Nạp âm ngũ hành của một can chi
function nayinWxOf(gan, zhi) {
  for (let i = 0; i < 60; i++) {
    if (GAN_ORDER[i % 10] === gan && ZHI_ORDER[i % 12] === zhi) {
      return NAYIN_WX[Math.floor(i / 2)];
    }
  }
  return '土';
}

/**
 * @returns {{ mingGong, shenGong, ju, juVi, palaces:[{zh,vi,gan,zhi,daXian}], birth (lunar) }}
 */
const _ziweiCache = new Map();
export function computeZiwei(year, month, day, hour, minute, gender) {
  const h = (hour === undefined || hour === null) ? 12 : hour;
  const mi = (minute === undefined || hour === null) ? 0 : minute;
  // [loop 257] memoize — computeZiwei được gọi 8× trong main.js (ziwei/sanfang/liuri/
  //   xiaoxian/minggong/...) cho cùng lá số → tính lại 8 lần (8×50ms=400ms lãng phí).
  //   Cache theo input params → lần 2+ trả kết quả ngay (<1ms).
  const cacheKey = `${year}-${month}-${day}-${h}-${mi}-${gender}`;
  if (_ziweiCache.has(cacheKey)) return _ziweiCache.get(cacheKey);
  // [loop 178] 子时换日 — đồng bộ buildChart: 23:00+ → sang hôm sau (cùng lá số bẩm sinh)
  const [cy, cm, cd, ch, cmi] = ziShiRoll(year, month, day, h, mi);
  const solar = Solar.fromYmdHms(cy, cm, cd, ch, cmi, 0);
  const lunar = solar.getLunar();
  // [loop 548 FIX BUG1] tháng nhuận: lunar-javascript trả getMonth() ÂM cho nhuận月
  //   (vd 闰二月 = -2). iztro/《全书》quy ước: tháng nhuận đếm như tháng kế tiếp
  //   (闰二月 → dùng tháng 3 để定命). Trước đây dùng trực tiếp getMonth() →命宫 SAI
  //   cho mọi người sinh tháng nhuận (~7 năm/lần: 2023闰二月, 2025闰六月...).
  const absLunarMonth = (m) => (m > 0 ? m : Math.abs(m) + 1); // -2→3, -6→7
  const lm = absLunarMonth(lunar.getMonth());
  const ly = lunar.getYear();           // 农历年 (can chi năm)
  const yearGan = lunar.getYearGan();   // 年干 (theo lập xuân)
  const timeZhi = lunar.getTimeZhi();   // 时支
  const hourOrder = ZHI_ORDER.indexOf(timeZhi) + 1; // 子=1..亥=12

  // 命宫: O[(lm - hourOrder) mod 12] ; 身宫: O[(lm + hourOrder - 2) mod 12]
  const mingIdx = ((lm - hourOrder) % 12 + 12) % 12;
  const shenIdx = ((lm + hourOrder - 2) % 12 + 12) % 12;
  const mingGongZhi = YIN_ORDER[mingIdx];
  const shenGongZhi = YIN_ORDER[shenIdx];

  // 五虎遁 → 寅 cung can → thuận tới 命 cung → 命 cung can
  const yinGan = WUHU[yearGan];
  const yinGanIdx = GAN_ORDER.indexOf(yinGan);
  const yinZhiPos = ZHI_ORDER.indexOf('寅'); // 2
  const mingZhiPos = ZHI_ORDER.indexOf(mingGongZhi);
  const steps = (mingZhiPos - yinZhiPos + 12) % 12;
  const mingGongGan = GAN_ORDER[(yinGanIdx + steps) % 10];

  // Nạp âm của mệnh cung → 五行局
  const mingNayinWx = nayinWxOf(mingGongGan, mingGongZhi);
  const ju = JU_NUM[mingNayinWx];
  const juWx = mingNayinWx;

  // 12 cung: từ mệnh cung, 逆排 (dùng YIN_ORDER index; 逆 = giảm index)
  // Mỗi cung có thiên can (thuận theo mệnh cung can), địa chi (逆)
  // Đại hạn: từ mệnh cung, mỗi cung 10 năm; 方向: dương nam/âm nữ thuận (tăng), âm nam/dương nữ nghịch (giảm)
  const isMale = parseGender(gender) === 1; // [loop 743 FIX] ROBUST — không còn silent female-default cho 'male'/typo
  const yearGanYin = GAN[yearGan]?.yin; // âm/dương của năm can
  // thuận = dương nam hoặc âm nữ
  const forward = (isMale && !yearGanYin) || (!isMale && yearGanYin);
  const palaces = [];
  for (let p = 0; p < 12; p++) {
    // cung index trong YIN_ORDER: từ mệnh cung, các cung次 逆 (giảm) — 12 cung逆排 từ命
    const palIdx = (mingIdx - p + 12) % 12;
    const pZhi = YIN_ORDER[palIdx];
    // [loop 23 sửa CRITICAL] thiên can phải rút từ CHÍNH chi của cung qua 五虎遁 (không phải
    //   "mệnh can + p bước" tuyến tính). Trước đây can thuận (+p) mà chi nghịch (−p) → ngược
    //   chiều → 9/12 cung can SAI (vì quan hệ can-chi qua 60 hoa giáp, không tuyến tính). Vd
    //   甲年 兄弟(酉) ra 乙 thay vì 癸. Sai số này làm hỏng MỌI 飞星/自化. Nay rút per-chi:
    const pZhiPos = ZHI_ORDER.indexOf(pZhi);
    const pGan = GAN_ORDER[(yinGanIdx + ((pZhiPos - yinZhiPos + 12) % 12)) % 10];
    // đại hạn: từ mệnh cung (p=0) là giới đầu; cung thứ k =起运 + k*10 ... theo chiều forward/nghịch
    const daXianStart = p === 0 ? ju : null; // chỉ mệnh cung ghi tuổi起运; các cung khác tính theo chiều
    palaces.push({ zh: PALACES[p].zh, vi: PALACES[p].vi, gan: pGan, zhi: pZhi, palIdx, isMing: p === 0, isShen: pZhi === shenGongZhi });
  }
  // đại hạn tuổi: từ mệnh cung起, mỗi cung 10 năm, theo chiều forward(+) hay nghịch(-) trong palIdx
  const daXianList = [];
  let age = ju;
  for (let k = 0; k < 12; k++) {
    const palIdx = ((forward ? mingIdx + k : mingIdx - k) + 12) % 12;
    const pal = palaces.find((x) => x.palIdx === palIdx);
    daXianList.push({ from: age, to: age + 9, palace: pal.zh, palaceVi: pal.vi, ganZhi: pal.gan + pal.zhi });
    age += 10;
  }

  // 14 chính tinh
  const ld = lunar.getDay();
  const starInfo = placeMainStars(palaces, ld, ju);
  // 四化 (theo năm can)
  const sihuaInfo = starInfo ? computeSihua(yearGan, starInfo.mainStars) : null;
  // 博士十二神 (niên hệ)
  const boshi = boshi12(yearGan, gender);
  // 辅星 (左辅右弼/文昌文曲/天魁天钺)
  const fuxing = computeFuxing(lm, hourOrder, yearGan);
  // 宫干自化 (phi tinh tầng lõi: can mỗi cung → 4 hóa → rơi trúng cung nào → tự hóa)
  const zihuaInfo = computeZihua(palaces, starInfo?.mainStars || {}, fuxing);
  // 飞星四化 (fly-IN / fly-OUT): ma trận 48 hóa giữa các cung — zeigt kết nối lifetime-area
  const feixingInfo = computeFeiXing(palaces, starInfo?.mainStars || {}, fuxing);

  const _result = {
    birth: { lunarMonth: lm, lunarDay: ld, timeZhi, yearGan },
    mingGong: mingGongGan + mingGongZhi,
    shenGong: shenGongZhi,
    ju, juWx, juVi: JU_VI[juWx],
    palaces, daXian: daXianList,
    ziweiBranch: starInfo?.ziweiBranch || null,
    tianfuBranch: starInfo?.tianfuBranch || null,
    mainStars: starInfo?.mainStars || {},
    sihua: sihuaInfo?.sihua || {},
    zihua: zuaInfoSafe(zihuaInfo),
    feixing: feixingInfo || { matrix: [], flyOut: {}, flyIn: {}, mingHighlights: '(không tính được)' },
    boshi, fuxing,
    note: 'Mệnh bàn Tử Vi: cung + cục + đại hạn + 14 chính tinh + 四化 + 宫干自化 + 飞星化入化出 + 博士 + 辅星.',
  };
  _ziweiCache.set(cacheKey, _result);
  return _result;
}

// helper nhỏ: đảm bảo z.zihua luôn là object có .list dù computeZihua trả null
function zuaInfoSafe(x) {
  return x && Array.isArray(x.list) ? x : { list: [], byPalace: {}, summary: '(không tính được 宫干自化)' };
}

export { PALACES, YIN_ORDER };

// ============================================================================
//  14 CHÍNH TINH (十四正星) — 定紫微 + 紫微系/天府系
//  Nguồn: 安星诀 + bảng定位紫微 (局×日) từ ziweidoushu_lib (cnblogs voidobject).
// ============================================================================
// 紫微 cung theo [水二局, 木三局, 金四局, 土五局, 火六局] × ngày 1-30.
// [cycle 53] verify nghiêm bằng iztro getStartIndex source (quotient%12, idx=q-1, offset even→+ / odd→−,
//   寅-based index) + 4 anchor cổ điển (游艺录/知乎). Sửa 7 ô sai (day3/9/22/30 木3, day12/16/21 金4):
//   mỗi ô sai dời sai toàn bộ 14 chính tinh cho ngày/局 đó. Nguồn: github SylarLong/iztro location.ts.
const ZIWEI_POS = [
  ['丑','辰','亥','午','酉'],['寅','丑','辰','亥','午'],['寅','寅','丑','辰','亥'],['卯','巳','寅','丑','辰'],
  ['卯','寅','子','寅','丑'],['辰','卯','巳','未','寅'],['辰','午','寅','子','戌'],['巳','卯','卯','巳','未'],
  ['巳','辰','丑','寅','子'],['午','未','午','卯','巳'],['午','辰','卯','申','寅'],['未','巳','辰','丑','卯'],
  ['未','申','寅','午','亥'],['申','巳','未','卯','申'],['申','午','辰','辰','丑'],['酉','酉','巳','酉','午'],
  ['酉','午','卯','寅','卯'],['戌','未','申','未','辰'],['戌','戌','巳','辰','子'],['亥','未','午','巳','酉'],
  ['亥','申','辰','戌','寅'],['子','亥','酉','卯','未'],['子','申','午','申','辰'],['丑','酉','未','巳','巳'],
  ['丑','子','巳','午','丑'],['寅','酉','戌','亥','戌'],['寅','戌','未','辰','卯'],['卯','丑','申','酉','申'],
  ['卯','戌','午','午','巳'],['辰','亥','亥','未','午'],
];
// 天府 = đối xứng紫微 qua trục 寅-申
const TIANFU_MIRROR = { 子:'辰', 丑:'卯', 寅:'寅', 卯:'丑', 辰:'子', 巳:'亥', 午:'戌', 未:'酉', 申:'申', 酉:'未', 戌:'午', 亥:'巳' };
// 紫微系 (từ紫微 đi thuận): offset → sao
const ZIWEI_SERIES = ['紫微','','','','廉贞','','','天同','武曲','太阳','','天机'];
// 天府系 (từ天府 đi thuận)
const TIANFU_SERIES = ['天府','太阴','贪狼','巨门','天相','天梁','七杀','','','','破军',''];
const STAR_VI = { '紫微':'Tử Vi','天机':'Thiên Cơ','太阳':'Thái Dương','武曲':'Vũ Khúc','天同':'Thiên Đồng','廉贞':'Liêm Trinh','天府':'Thiên Phủ','太阴':'Thái Âm','贪狼':'Tham Lang','巨门':'Cự Môn','天相':'Thiên Tướng','天梁':'Thiên Lương','七杀':'Thất Sát','破军':'Phá Quân' };

/** Đặt 14 chính tinh vào mệnh bàn (cập nhật palaces[].stars + trả mainStars) */
export function placeMainStars(palaces, lunarDay, ju) {
  const col = ju - 2; // 水2→0, 木3→1, 金4→2, 土5→3, 火6→4
  if (col < 0 || col > 4 || lunarDay < 1 || lunarDay > 30) return null;
  const ziweiBranch = ZIWEI_POS[lunarDay - 1][col];
  const tianfuBranch = TIANFU_MIRROR[ziweiBranch];
  const ziweiIdx = ZHI_ORDER.indexOf(ziweiBranch);
  const tianfuIdx = ZHI_ORDER.indexOf(tianfuBranch);
  // khởi stars cho mỗi cung
  for (const p of palaces) p.stars = [];
  const mainStars = {};
  for (let off = 0; off < 12; off++) {
    const z1 = ZIWEI_SERIES[off]; if (z1) { const b = ZHI_ORDER[(ziweiIdx + off) % 12]; palaces.find((p) => p.zhi === b)?.stars.push(z1); mainStars[z1] = b; }
    const z2 = TIANFU_SERIES[off]; if (z2) { const b = ZHI_ORDER[(tianfuIdx + off) % 12]; palaces.find((p) => p.zhi === b)?.stars.push(z2); mainStars[z2] = b; }
  }
  return { ziweiBranch, tianfuBranch, mainStars };
}

export { ZIWEI_POS, STAR_VI };

// ============================================================================
//  BÁC SỮ THẬP NHỊ THẦN 博士十二神 (Tử Vi niên hệ)
//  Từ 禄存 vị đặt 12 sao; 阳男阴女顺行 / 阴男阳女逆行.
//  Nguồn: cnblogs voidobject (安生年博士十二神). Bổ sung tầng sao lưu niên.
// ============================================================================
// 禄存 (niên can): 甲→寅 乙→卯 丙戊→巳 丁己→午 庚→申 辛→酉 壬→亥 癸→子
const LUCUN = { 甲: '寅', 乙: '卯', 丙: '巳', 戊: '巳', 丁: '午', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
const BOSHI_ORDER = ['博士', '力士', '青龙', '小耗', '将军', '奏书', '飞廉', '喜神', '病符', '大耗', '伏兵', '官符'];
const BOSHI_INFO = {
  博士: { vi: 'Bác Sĩ', tone: 'cat', desc: 'quý nhân học vấn, mưu lược' },
  力士: { vi: 'Lực Sĩ', tone: 'cat', desc: 'sức mạnh, vượng khí, uy' },
  青龙: { vi: 'Thanh Long', tone: 'cat', desc: 'đại cát, hỷ sự, tài lộc' },
  小耗: { vi: 'Tiểu Hao', tone: 'hung', desc: 'hao tổn nhẹ' },
  将军: { vi: 'Tướng Quân', tone: 'cat', desc: 'quyền uy, chủ sự nghiêm' },
  奏书: { vi: 'Tấu Thư', tone: 'cat', desc: 'danh tiếng, tấu chương, văn thư' },
  飞廉: { vi: 'Phi Liêm', tone: 'hung', desc: 'thị phi, tai nạn' },
  喜神: { vi: 'Hỷ Thần', tone: 'cat', desc: 'hỷ khí, vui vẻ, cát' },
  病符: { vi: 'Bệnh Phù', tone: 'hung', desc: 'bệnh, mệt mỏi' },
  大耗: { vi: 'Đại Hao', tone: 'hung', desc: 'hao tiền lớn' },
  伏兵: { vi: 'Phục Binh', tone: 'hung', desc: 'ám binh, tiểu nhân ngầm' },
  官符: { vi: 'Quan Phù', tone: 'hung', desc: 'quan phi,口舌' },
};

/**
 * @returns {{ stars:{star,vi,tone,desc,atZhi}[], luCunZhi, direction }}
 */
export function boshi12(yearGan, gender) {
  const luCunZhi = LUCUN[yearGan];
  const yearYin = GAN[yearGan]?.yin; // true=âm
  const isMale = parseGender(gender) === 1; // [loop 743 FIX] ROBUST — không còn silent female-default cho 'male'/typo
  // 阳男阴女顺 (forward); 阴男阳女逆 (backward)
  const forward = (isMale && !yearYin) || (!isMale && yearYin);
  const base = ZHI_ORDER.indexOf(luCunZhi);
  const stars = BOSHI_ORDER.map((star, i) => {
    const off = forward ? i : (-i + 12 * 12) % 12;
    const at = ZHI_ORDER[(base + off) % 12];
    return { star, ...BOSHI_INFO[star], atZhi: at };
  });
  return { stars, luCunZhi, direction: forward ? 'thuận' : 'nghịch' };
}

export { LUCUN, BOSHI_ORDER, BOSHI_INFO };

// ============================================================================
//  VẬN HẠN TỨ HÓA 运限四化 — 大限四化 + 流年四化 (tam đại 四化: sinh年 + 大限 + 流年)
//  Khi đại hạn/lưu niên đến, can cung đó hóa 禄/权/科/忌 cho các sao → cơ chế thời điểm.
// ============================================================================
/**
 * @param {object} z - kết quả computeZiwei
 * @param {number} currentYear - năm hiện tại
 * @param {number} birthYear - năm sinh
 * @returns {{ activeDy, dxSihua, lnSihua, yearStem }}
 */
export function yunXianSihua(z, currentYear, birthYear) {
  const age = currentYear - birthYear;
  const activeDy = (z.daXian || []).find((d) => age >= d.from && age <= d.to) || (z.daXian || [])[0];
  const dyStem = activeDy ? activeDy.ganZhi[0] : null;
  const yearStem = Solar.fromYmdHms(currentYear, 6, 15, 12, 0, 0).getLunar().getYearGan();
  // gộp mainStars + fuxing để 四化 tìm được cả sao phụ (文昌/文曲/左辅/右弼)
  const allStars = { ...(z.mainStars || {}) };
  for (const s of (z.fuxing?.stars || [])) allStars[s.star] = s.atZhi;
  const dxSihua = dyStem ? computeSihua(dyStem, allStars).sihua : {};
  const lnSihua = computeSihua(yearStem, allStars).sihua;
  return { activeDy, dxSihua, lnSihua, yearStem };
}

// ============================================================================
//  大限宫干四化 大限宮干四化 — DECADE PALACE-STEM 4-化 FLYING INTO NATAL CHART
//  Vòng 9 (ALGORITHM ELEVATION): tầng ĐỘNG của phi tinh — khác với 宫干自化 (vòng 5,
//  tĩnh, từ can cung bẩm sinh) và 飞星 (vòng 6, tĩnh, ma trận 48-hóa lifetime),
//  tầng này lấy can của cung ĐẠI HẠN HIỆN TẠI → sinh 4 hóa → bay vào mệnh bàn
//  bẩm sinh → tiết lộ lĩnh vực nào bị KÍCH HOẠT trong 10 năm này.
//
//  Ý nghĩa cổ điển (中州派/飞星派 — vận限四化 thật sự):
//   - 大限化禄入命/财/官: 10 năm này SINH TÀI/duyên ở đúng cung cốt lõi → decade
//     của sự thuận lợi, cơ hội tự đến.
//   - 大限化忌入夫妻/田宅: 10 năm này TRỞ NGẠI đổ vào hôn nhân/nhà cửa → cẩn trọng
//     lĩnh vực đó BOTH năm (kể cả năm tốt thì gốc decade vẫn nặng).
//   - 大限化权入官禄: 10 năm này QUYỀN LỰC sự nghiệp kích hoạt → thăng tiến, chủ động.
//   - 大限化科入命/福: 10 năm này DANH TIẾNG/quý nhân kích hoạt → được giúp đỡ.
//
//  Đây là "Aktivierung" của decade: cho biết CHỦ ĐỀ 10 năm (giống 运中救应 của BaZi
//  loop 8, nhưng ở đây là tầng Tử Vi). Mỗi hóa đích = 1 lĩnh vực bị decade "bật công tắc".
// ============================================================================
const DX_SIHUA_DOMAIN = {
  命宫: 'bản thân/cá nhân', 兄弟: 'anh chị em/quan hệ ngang', 夫妻: 'hôn nhân/bạn đời',
  子女: 'con cái/sinh sản/đầu tư', 财帛: 'tài lộc/kiếm tiền', 疾厄: 'sức khoẻ/thân thể',
  迁移: 'di chuyển/ngoại cảnh/đối ngoại', 奴仆: 'bạn bè/cấp dưới/đối tác',
  官禄: 'sự nghiệp/công danh', 田宅: 'nhà cửa/gia đình/kho', 福德: 'tinh thần/phúc đức/hậu vận',
  父母: 'cha mẹ/trưởng bối/văn thư',
};
const DX_SIHUA_INTERP = {
  禄: 'KÍCH HOẠT tài lộc/duyên — 10 năm này lĩnh vực đích TRÔI CHẢY, cơ hội tự đến, dễ được',
  权: 'KÍCH HOẠT quyền lực/năng lực — 10 năm này lĩnh vực đích CÓ SỨC MẠNH, chủ động, thăng tiến',
  科: 'KÍCH HOẠT danh tiếng/quý nhân — 10 năm này lĩnh vực đích ĐƯỢC GIÚP, có danh, học vấn',
  忌: 'KÍCH HOẠT trở ngại/thị phi — 10 năm này lĩnh vực đích BỊ NẶNG, cẩn trọng, dễ vướng',
};

/**
 * Tính 大限宫干四化: cung đại hạn hiện tại's can → 4 hóa → bay vào mệnh bàn.
 *
 * @param {object} z - kết quả computeZiwei (cần z.daXian, z.palaces, z.mainStars, z.fuxing)
 * @param {number} currentYear - năm hiện tại (vd 2026)
 * @param {number} birthYear - năm sinh (vd 1993)
 * @returns {{
 *   active: boolean,                              // có tìm được đại hạn hiện tại không
 *   daxianPalace: string,                          // cung đại hạn (zh, vd '子女')
 *   daxianPalaceVi: string,                        // cung đại hạn (vi)
 *   daxianGan: string,                             // can cung đại hạn (vd '乙')
 *   daxianGanZhi: string,                          // can-chi cung đại hạn (vd '乙未')
 *   ageRange: string,                              // vd '32-41t'
 *   age: number,                                   // tuổi hiện tại
 *   sihua: [{ type, typeVi, star, targetPalace, targetPalaceVi, targetGanZhi, tone, domain, interpretation }],
 *     // type: 禄/权/科/忌; star: sao hóa đích; targetPalace: cung nhận (zh)
 *   summary: string,                               // one-liner VH liệt kê 4 kích hoạt
 * }}
 */
export function computeDaxianSihua(z, currentYear, birthYear) {
  const empty = {
    active: false, daxianPalace: '', daxianPalaceVi: '', daxianGan: '', daxianGanZhi: '',
    ageRange: '', age: currentYear - birthYear, sihua: [], summary: '(không tìm được đại hạn hiện tại)',
  };
  if (!z || !Array.isArray(z.daXian) || !z.daXian.length) return empty;
  const age = currentYear - birthYear;
  const activeDy = z.daXian.find((d) => age >= d.from && age <= d.to);
  if (!activeDy) return empty;

  const daxianGan = activeDy.ganZhi[0]; // ký tự đầu = thiên can
  if (!daxianGan) return { ...empty, active: true, daxianPalace: activeDy.palace, daxianPalaceVi: activeDy.palaceVi, daxianGanZhi: activeDy.ganZhi, ageRange: `${activeDy.from}-${activeDy.to}t` };

  // starMap: sao → chi cung đang ngồi (14 chính tinh + phụ tinh từ fuxing)
  // BẮT BUỘC thêm phụ tinh vì 4 trong 10 can (戊己辛壬) hóa các sao phụ này.
  const starMap = { ...(z.mainStars || {}) };
  if (z.fuxing?.stars) {
    for (const s of z.fuxing.stars) starMap[s.star] = s.atZhi;
  }
  // chi → palace (tra cung nhận)
  const chiToPalace = {};
  for (const p of (z.palaces || [])) chiToPalace[p.zhi] = p;

  const four = SIHUA_TABLE[daxianGan] || [];
  const sihua = [];
  for (let i = 0; i < 4; i++) {
    const type = SIHUA_KEY[i];
    const star = four[i];
    if (!star) continue;
    const toZhi = starMap[star]; // chi cung nơi sao đích đang ngồi
    const toPal = toZhi ? chiToPalace[toZhi] : null;
    const targetPalace = toPal ? toPal.zh : '';
    sihua.push({
      type,
      typeVi: SIHUA_VI[type],
      star,
      targetPalace,
      targetPalaceVi: toPal ? toPal.vi : '(sao không có trên bàn)',
      targetGanZhi: toPal ? toPal.gan + toPal.zhi : '',
      placed: !!toPal,
      tone: SIHUA_TONE[type],
      domain: targetPalace ? (DX_SIHUA_DOMAIN[targetPalace] || '') : '',
      interpretation: DX_SIHUA_INTERP[type],
    });
  }

  const parts = sihua.map((r) => `${r.type}@${r.star}→${r.targetPalace || '(?)'}(${r.targetPalaceVi.split('(')[0]})`);
  const summary = `大限(${activeDy.ganZhi} ${activeDy.from}-${activeDy.to}t) can ${daxianGan} kích hoạt: ${parts.join(' · ')}`;

  return {
    active: true,
    daxianPalace: activeDy.palace,
    daxianPalaceVi: activeDy.palaceVi,
    daxianGan,
    daxianGanZhi: activeDy.ganZhi,
    ageRange: `${activeDy.from}-${activeDy.to}t`,
    age,
    sihua,
    summary,
  };
}

export { DX_SIHUA_DOMAIN, DX_SIHUA_INTERP };

// ============================================================================
//  TỨ HÓA 四化 (禄权科忌) — "linh hồn" Tử Vi, theo năm thiên can (生年四化)
//  Nguồn: 十干四化表 (安星诀). 禄=lộc/thuận, 权=quyền, 科=khoa/danh, 忌=kỵ/trở ngại.
// ============================================================================
const SIHUA_TABLE = {
  甲: ['廉贞', '破军', '武曲', '太阳'],
  乙: ['天机', '天梁', '紫微', '太阴'],
  丙: ['天同', '天机', '文昌', '廉贞'],
  丁: ['太阴', '天同', '天机', '巨门'],
  戊: ['贪狼', '太阴', '右弼', '天机'],
  己: ['武曲', '贪狼', '天梁', '文曲'],
  庚: ['太阳', '武曲', '太阴', '天同'],
  辛: ['巨门', '太阳', '文曲', '文昌'],
  壬: ['天梁', '紫微', '左辅', '武曲'],
  癸: ['破军', '巨门', '太阴', '贪狼'],
};
const SIHUA_KEY = ['禄', '权', '科', '忌'];
const SIHUA_VI = { 禄: 'Hóa Lộc (禄 — tài lộc, duyên, thuận)', 权: 'Hóa Quyền (权 — quyền lực, chủ động)', 科: 'Hóa Khoa (科 — danh tiếng, quý nhân, học)', 忌: 'Hóa Kỵ (忌 — trở ngại, thị phi, phiền muộn)' };
const SIHUA_TONE = { 禄: 'cat', 权: 'cat', 科: 'cat', 忌: 'hung' };

/**
 * Sinh năm四化 (theo năm thiên can) → đánh dấu sao + cung.
 * @param {string} yearGan - năm thiên can (vd 癸)
 * @param {object} mainStars - { sao: chi_cung } từ placeMainStars
 * @returns { sihua: {禄:{star,palace,vi,tone}, ...}, yearGan }
 */
export function computeSihua(yearGan, mainStars) {
  const four = SIHUA_TABLE[yearGan] || SIHUA_TABLE['癸'];
  const out = {};
  for (let i = 0; i < 4; i++) {
    const key = SIHUA_KEY[i];
    const star = four[i];
    const palace = mainStars[star] || null; // null nếu sao phụ (文昌/曲/左辅/右弼) chưa đặt
    out[key] = { star, palace, vi: SIHUA_VI[key], tone: SIHUA_TONE[key], placed: !!palace };
  }
  return { sihua: out, yearGan };
}

// ============================================================================
//  宫干自化 宮干自化 — TỰ HÓA (PALACE-STEM SELF-TRANSFORMATION)
//  Lõi phi tinh tứ hóa: mỗi cung có can riêng (宫干, do 五虎遁+thuận từ 寅) → sinh 4 hóa
//  (禄/权/科/忌). 4 hóa "bay" tới các sao trên toàn bàn. Khi hóa rơi TRÚNG sao đang ngồi
//  TRONG CHÍNH CUNG phát ra → 自化 = cung tự biến đổi chính mình.
//
//  Luận cổ điển (中州派/飞星派):
//   - 自化禄: cung tự sinh tài/duận → dễ đến nhưng không bền (容易得也容易失), bề ngoài thuận.
//   - 自化权: cung tự sinh quyền → có năng lực nhưng độc đoán, tự lập, hay áp đặt.
//   - 自化科: cung tự sinh danh → có vẻ có danh nhưng hời hợt, không sâu.
//   - 自化忌: cung tự sinh trở ngại → TỰ PHÁ HOẠI, chủ đề cung bị nghẽn từ bên trong.
//     Thường là tự hóa QUAN TRỌNG NHẤT (đặc biệt 命/财/官/夫/田 五 nội cung).
//
//  Ghi chú: cung chỉ có 1 chính tinh độc tọa hay nhiều sao cùng toạ đều có thể tự hóa,
//  miễn sao được hóa nằm đúng cung phát can. 辅星 (左辅/右弼/文昌/文曲) cũng计入 vì
//  SIHUA_TABLE có 4 sao phụ (戊/己/辛/壬 can đều hóa phụ tinh).
// ============================================================================
const ZIHUA_DESC = {
  禄: 'tự sinh tài/duận — dễ được nhưng không bền (容易得也容易失); bề ngoài thuận lợi, thực tế khó giữ',
  权: 'tự sinh quyền lực — có năng lực, chủ động, nhưng độc đoán, tự lập, hay áp đặt người khác',
  科: 'tự sinh danh tiếng — có vẻ có danh, quý nhân, nhưng hời hợt, không sâu, bề ngoài hơn thực chất',
  忌: 'tự sinh trở ngại — TỰ PHÁ HOẠI, chủ đề cung bị nghẽn từ bên trong, hay tự gây phiền cho chính mình',
};

/**
 * Tính 宫干自化 cho toàn mệnh bàn.
 *
 * @param {Array} palaces — z.palaces (mỗi pal có {zh,vi,gan,zhi,stars})
 * @param {object} mainStars — { sao: chi } từ placeMainStars (14 chính tinh)
 * @param {object} [fuxing] — z.fuxing (tùy chọn; để四化 dò được cả 文昌/文曲/左辅/右弼)
 * @returns {{
 *   list: [{ palace, palaceVi, palaceGan, palaceGanZhi, hua, huaVi, star, tone, interpretation }],
 *   byPalace: { [palaceZh]: [{hua, star, ...}] },   // nhóm theo cung phát can
 *   summary: string,                                  // one-liner VH liệt kê cung có tự hóa
 * }}
 */
export function computeZihua(palaces, mainStars, fuxing) {
  const list = [];
  const byPalace = {};
  if (!palaces || !palaces.length) return { list, byPalace, summary: '(không có palaces)' };

  // starMap: sao → chi cung đang ngồi (14 chính tinh + phụ tinh nếu có fuxing)
  // Bắt buộc thêm phụ tinh vì 4 trong 10 thiên can (戊己辛壬) hóa các sao phụ này.
  const starMap = { ...(mainStars || {}) };
  if (fuxing?.stars) {
    for (const s of fuxing.stars) starMap[s.star] = s.atZhi;
  }
  const chiToPalace = {};
  for (const p of palaces) chiToPalace[p.zhi] = p;

  // Với mỗi cung: lấy 宫干 → 4 hóa → kiểm tra sao đích có ngồi đúng cung phát không
  for (const p of palaces) {
    const gan = p.gan;
    if (!gan) continue;
    const four = SIHUA_TABLE[gan];
    if (!four) continue;
    for (let i = 0; i < 4; i++) {
      const hua = SIHUA_KEY[i];
      const star = four[i];
      const atZhi = starMap[star];
      if (!atZhi) continue; // sao không có trên bàn (phi常)
      if (atZhi !== p.zhi) continue; // không trùng cung phát → KHÔNG phải tự hóa
      // TRÚNG → tự hóa
      byPalace[p.zh] = byPalace[p.zh] || [];
      const rec = {
        palace: p.zh,
        palaceVi: p.vi,
        palaceGan: gan,
        palaceGanZhi: gan + p.zhi,
        hua,
        huaVi: SIHUA_VI[hua],
        star,
        tone: SIHUA_TONE[hua],
        interpretation: ZIHUA_DESC[hua],
      };
      byPalace[p.zh].push(rec);
      list.push(rec);
    }
  }

  // one-liner tóm tắt
  let summary;
  if (!list.length) {
    summary = 'Mệnh bàn KHÔNG có cung nào bị 宫干自化 — các cung ổn định, không bị "tự biến đổi" từ bên trong.';
  } else {
    const parts = list.map((r) => `${r.palaceVi}(${r.palaceGanZhi}) tự化${r.hua} ở ${r.star} → ${r.interpretation}`);
    summary = `宫干自化 (${list.length} cung tự biến đổi): ${parts.join(' · ')}`;
  }
  return { list, byPalace, summary };
}

export { ZIHUA_DESC };

// ============================================================================
//  飞星四化 飛星四化 — HÓA-IN (化入) + HÓA-OUT (化出) — kết nối giữa các cung
//  Vòng 6: mở rộng 宫干自化 (vòng 5) thành ma trận 48-hóa đầy đủ (12 cung × 4 hóa).
//  Mỗi hóa do 宫干 phát ra "bay" tới một sao → sao đó đang ngồi ở một cung X.
//    - Nếu X == cung phát                → 自化 (đã tính ở computeZihua, vòng 5).
//    - Với cung PHÁT: đó là 化出 (fly-OUT) — năng lượng cung này GỬI đi.
//    - Với cung X (nhận): đó là 化入 (fly-IN) — năng lượng TỚI từ cung khác.
//
//  Luận cổ điển (中州派/飞星派 — "phi tinh" thật sự):
//   - 命宫化禄入财帛: Mệnh chủ ĐỊNH HƯỚNG sinh tài → tự nhiên tạo ra tiền.
//   - 命宫化忌入夫妻: nội tâm/vấn đề Mệnh ảnh hưởng XẤU tới hôn nhân.
//   - 财帛化禄入命: tài lộc đổ về trực tiếp cho người → giàu có thật.
//   - 官禄化权入命: quyền lực sự nghiệp tiếp sức cho người → thăng tiến.
//   - 化入 = CỦA ĐẾN (received), 化出 = CỦA ĐI (sent). 化忌入 = bị làm hại bởi
//     lĩnh vực phát; 化禄入 = được lĩnh vực phát nuôi dưỡng.
//   3 cung đọc nhiều nhất: 命 (bản thân), 财 (tiền), 官 (sự nghiệp) — surface highlights.
// ============================================================================
const FEIXING_DIR = {
  禄: { vi: 'Hóa Lộc', nature: 'cat', sense: 'tài lộc/duyen/thuận lợi đổ về' },
  权: { vi: 'Hóa Quyền', nature: 'cat', sense: 'quyền lực/năng lực tiếp sức' },
  科: { vi: 'Hóa Khoa', nature: 'cat', sense: 'danh tiếng/quý nhân phù trợ' },
  忌: { vi: 'Hóa Kỵ', nature: 'hung', sense: 'trở ngại/thị phi/thương tổn đổ về' },
};

/**
 * Tính ma trận 48-hóa 飞星四化: mỗi cung phát 4 hóa → ghi nhận 化出 (gửi) & 化入 (nhận).
 *
 * @param {Array} palaces — z.palaces (mỗi pal có {zh,vi,gan,zhi,stars})
 * @param {object} mainStars — { sao: chi } từ placeMainStars
 * @param {object} [fuxing] — z.fuxing (để四化 dò được 文昌/文曲/左辅/右弼)
 * @returns {{
 *   matrix: [{ fromPalace, fromVi, fromGanZhi, hua, star, toPalace, toVi, toGanZhi, kind, tone }],
 *     // kind: 'self'(自化) | 'out'(化出) | 'in'(化入 — ghi ở phía nhận)
 *   flyOut: { [fromPalaceZh]: [{ hua, star, toPalace, toVi, tone, sense, note }] },
 *   flyIn:  { [toPalaceZh]:   [{ hua, star, fromPalace, fromVi, tone, sense, note }] },
 *   mingHighlights: string,   // one-liner VH: 命宫 化出/化入 chính
 *   summary: string,          // one-liner VH 3 cung (命/财/官)
 * }}
 */
export function computeFeiXing(palaces, mainStars, fuxing) {
  const matrix = [];
  const flyOut = {};
  const flyIn = {};
  if (!palaces || !palaces.length) {
    return { matrix, flyOut, flyIn, mingHighlights: '(không có palaces)', summary: '(không có palaces)' };
  }

  // starMap: sao → chi cung đang ngồi (14 chính tinh + phụ tinh nếu có fuxing)
  const starMap = { ...(mainStars || {}) };
  if (fuxing?.stars) {
    for (const s of fuxing.stars) starMap[s.star] = s.atZhi;
  }
  // chi → palace (để tra cung nhận hóa)
  const chiToPalace = {};
  for (const p of palaces) chiToPalace[p.zhi] = p;

  // Với mỗi cung phát: 宫干 → 4 hóa → tìm sao đích → tra cung đích
  for (const from of palaces) {
    const gan = from.gan;
    if (!gan) continue;
    const four = SIHUA_TABLE[gan];
    if (!four) continue;
    for (let i = 0; i < 4; i++) {
      const hua = SIHUA_KEY[i];
      const star = four[i];
      const toZhi = starMap[star];
      if (!toZhi) continue; // sao không có trên bàn → hóa "bay mất", không đếm
      const toPal = chiToPalace[toZhi];
      if (!toPal) continue;
      const isSelf = (toZhi === from.zhi);
      const tone = SIHUA_TONE[hua];
      const dir = FEIXING_DIR[hua];

      // Ghi vào ma trận: 1 dòng mô tả đầy đủ (tự hóa hoặc hóa xuất)
      matrix.push({
        fromPalace: from.zh,
        fromVi: from.vi,
        fromGanZhi: gan + from.zhi,
        hua,
        star,
        toPalace: toPal.zh,
        toVi: toPal.vi,
        toGanZhi: toPal.gan + toPal.zhi,
        kind: isSelf ? 'self' : 'out',
        tone,
      });

      if (isSelf) continue; // tự hóa: không tạo fly-OUT/fly-IN (đã lo ở computeZihua)

      // 化出 (fly-OUT): từ cung PHÁT gửi đi
      flyOut[from.zh] = flyOut[from.zh] || [];
      flyOut[from.zh].push({
        hua,
        huaVi: SIHUA_VI[hua],
        star,
        toPalace: toPal.zh,
        toVi: toPal.vi,
        toGanZhi: toPal.gan + toPal.zhi,
        tone,
        sense: dir.sense,
        note: `${from.zh}化${hua}入${toPal.zh} (${from.vi} → ${toPal.vi}): ${dir.sense} ở ${toPal.vi}.`,
      });

      // 化入 (fly-IN): cung NHẬN được hóa từ cung phát
      flyIn[toPal.zh] = flyIn[toPal.zh] || [];
      flyIn[toPal.zh].push({
        hua,
        huaVi: SIHUA_VI[hua],
        star,
        fromPalace: from.zh,
        fromVi: from.vi,
        fromGanZhi: gan + from.zhi,
        tone,
        sense: dir.sense,
        note: `${from.zh}化${hua}入${toPal.zh} (${from.vi} → ${toPal.vi}): ${toPal.vi} nhận ${dir.sense} từ ${from.vi}.`,
      });
    }
  }

  const mingHighlights = summarizePalaceFeiXing(palaces, '命宫', flyOut, flyIn);
  const summary = summarizeTop3(palaces, flyOut, flyIn);
  return { matrix, flyOut, flyIn, mingHighlights, summary };
}

// Tóm tắt 1 cung (thường 命宫): gộp 化出 + 化入 thành 1 dòng VH ngắn
function summarizePalaceFeiXing(palaces, palaceZh, flyOut, flyIn) {
  const out = flyOut[palaceZh] || [];
  const ins = flyIn[palaceZh] || [];
  if (!out.length && !ins.length) {
    const pal = palaces.find((p) => p.zh === palaceZh);
    return `${pal?.vi || palaceZh}: KHÔNG có hóa kết nối ra/vào (cung cô lập, ít tác động qua lại).`;
  }
  const outTxt = out.map((r) => `化${r.hua}→${r.toPalace}(${r.toVi})`).join(', ') || '(không)';
  const inTxt = ins.map((r) => `${r.fromPalace}(${r.fromVi})化${r.hua}→`).join(', ') || '(không)';
  return `${palaceZh}: 化出[${outTxt}] | 化入[${inTxt} →${palaceZh}]`;
}

// Tóm tắt 3 cung đọc nhiều nhất: 命/财/官
function summarizeTop3(palaces, flyOut, flyIn) {
  const targets = ['命宫', '财帛', '官禄'];
  const parts = targets.map((zh) => {
    const pal = palaces.find((p) => p.zh === zh);
    if (!pal) return null;
    const out = (flyOut[zh] || []).map((r) => `${zh}化${r.hua}→${r.toPalace}`).join(',');
    const ins = (flyIn[zh] || []).map((r) => `${r.fromPalace}化${r.hua}→${zh}`).join(',');
    return `${zh}: 出[${out || '∅'}] 入[${ins || '∅'}]`;
  }).filter(Boolean);
  return `飞星化入化出: ${parts.join(' · ')}`;
}

export { FEIXING_DIR };
