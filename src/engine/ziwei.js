// ============================================================================
//  TỬ VI ĐẨU SỐ 紫微斗数 — BỘ KHUNG MỆNH BÀN (vòng 1: cung + cục + đại hạn)
//  Tính: 命宫, 身宫 (起诀), 12 cung (逆排), 五行局 (五虎遁→命宫纳音→局),
//  大限 (起运=局数, 阳/阴顺逆). 14主星 để vòng sau.
//  Nguồn: 安命身诀 "斗柄建寅起正月…逆回安命顺安身", 十二宫, 五行局定局.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { computeFuxing } from './fuxing.js';
import { GAN, ZHI } from './constants.js';

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
export function computeZiwei(year, month, day, hour, minute, gender) {
  const h = (hour === undefined || hour === null) ? 12 : hour;
  const mi = (minute === undefined || minute === null) ? 0 : minute;
  const solar = Solar.fromYmdHms(year, month, day, h, mi, 0);
  const lunar = solar.getLunar();
  const lm = lunar.getMonth();          // 农历月 (1-12, 闰月 vẫn lấy số)
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
  const isMale = gender === 'nam';
  const yearGanYin = GAN[yearGan]?.yin; // âm/dương của năm can
  // thuận = dương nam hoặc âm nữ
  const forward = (isMale && !yearGanYin) || (!isMale && yearGanYin);
  const palaces = [];
  for (let p = 0; p < 12; p++) {
    // cung index trong YIN_ORDER: từ mệnh cung, các cung次 逆 (giảm) — 12 cung逆排 từ命
    const palIdx = (mingIdx - p + 12) % 12;
    const pZhi = YIN_ORDER[palIdx];
    // thiên can thuận theo bước từ mệnh cung can (cung thứ p = mệnh can + p bước)
    const pGan = GAN_ORDER[(GAN_ORDER.indexOf(mingGongGan) + p) % 10];
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

  return {
    birth: { lunarMonth: lm, lunarDay: ld, timeZhi, yearGan },
    mingGong: mingGongGan + mingGongZhi,
    shenGong: shenGongZhi,
    ju, juWx, juVi: JU_VI[juWx],
    palaces, daXian: daXianList,
    ziweiBranch: starInfo?.ziweiBranch || null,
    tianfuBranch: starInfo?.tianfuBranch || null,
    mainStars: starInfo?.mainStars || {},
    sihua: sihuaInfo?.sihua || {},
    boshi, fuxing,
    note: 'Mệnh bàn Tử Vi: cung + cục + đại hạn + 14 chính tinh + 四化 + 博士 + 辅星.',
  };
}

export { PALACES, YIN_ORDER };

// ============================================================================
//  14 CHÍNH TINH (十四正星) — 定紫微 + 紫微系/天府系
//  Nguồn: 安星诀 + bảng定位紫微 (局×日) từ ziweidoushu_lib (cnblogs voidobject).
// ============================================================================
// 紫微 cung theo [水二局, 木三局, 金四局, 土五局, 火六局] × ngày 1-30
const ZIWEI_POS = [
  ['丑','辰','亥','午','酉'],['寅','丑','辰','亥','午'],['寅','未','丑','辰','亥'],['卯','巳','寅','丑','辰'],
  ['卯','寅','子','寅','丑'],['辰','卯','巳','未','寅'],['辰','午','寅','子','戌'],['巳','卯','卯','巳','未'],
  ['巳','卯','丑','寅','子'],['午','未','午','卯','巳'],['午','辰','卯','申','寅'],['未','巳','亥','丑','卯'],
  ['未','申','寅','午','亥'],['申','巳','未','卯','申'],['申','午','辰','辰','丑'],['酉','酉','子','酉','午'],
  ['酉','午','卯','寅','卯'],['戌','未','申','未','辰'],['戌','戌','巳','辰','子'],['亥','未','午','巳','酉'],
  ['亥','申','丑','戌','寅'],['子','未','酉','卯','未'],['子','申','午','申','辰'],['丑','酉','未','巳','巳'],
  ['丑','子','巳','午','丑'],['寅','酉','戌','亥','戌'],['寅','戌','未','辰','卯'],['卯','丑','申','酉','申'],
  ['卯','戌','午','午','巳'],['辰','寅','亥','未','午'],
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
  const isMale = gender === 'nam';
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
