// ============================================================================
//  LỤC DIỆU 六爻 (火珠林/卜筮正宗) — gieo 6 hào + 纳甲 + 六亲 + 世应 + 用神
//  Hệ "trả lời câu hỏi cụ thể" phổ biến nhất dân gian. Khác Mai Hoa (体用 ngũ hành):
//  六爻 trọng 用神 (sao chủ việc) + 月建/日辰 旺衰 + 六亲持世.
//  Nguồn: 京房纳甲, 卜筮正宗, 增删卜易 (verified 口诀).
// ============================================================================
import { ZHI, WX_VI } from './constants.js';

// 8 quái: lines (1=dương,0=âm, dưới lên); 纳甲 干 + 内支3 + 外支3
export const TRI = {
  乾: { lines: [1, 1, 1], gn: '甲', zn: ['子', '寅', '辰'], gw: '壬', zw: ['午', '申', '戌'] },
  兑: { lines: [1, 1, 0], gn: '丁', zn: ['巳', '卯', '丑'], gw: '丁', zw: ['亥', '酉', '未'] },
  离: { lines: [1, 0, 1], gn: '己', zn: ['卯', '丑', '亥'], gw: '己', zw: ['酉', '未', '巳'] },
  震: { lines: [1, 0, 0], gn: '庚', zn: ['子', '寅', '辰'], gw: '庚', zw: ['午', '申', '戌'] },
  巽: { lines: [0, 1, 1], gn: '辛', zn: ['丑', '亥', '酉'], gw: '辛', zw: ['未', '巳', '卯'] },
  坎: { lines: [0, 1, 0], gn: '戊', zn: ['寅', '辰', '午'], gw: '戊', zw: ['申', '戌', '子'] },
  艮: { lines: [0, 0, 1], gn: '丙', zn: ['辰', '午', '申'], gw: '丙', zw: ['戌', '子', '寅'] },
  坤: { lines: [0, 0, 0], gn: '乙', zn: ['未', '巳', '卯'], gw: '癸', zw: ['丑', '亥', '酉'] },
};
function triFromLines3(a, b, c) { return Object.keys(TRI).find((k) => TRI[k].lines.join('') === [a, b, c].join('')); }
function hexName64(lower, upper) {
  const H = {
    乾: { 乾:'乾', 兑:'夬', 离:'大有', 震:'大壮', 巽:'小畜', 坎:'需', 艮:'大畜', 坤:'泰' },
    兑: { 乾:'履', 兑:'兑', 离:'睽', 震:'归妹', 巽:'中孚', 坎:'节', 艮:'损', 坤:'临' },
    离: { 乾:'同人', 兑:'革', 离:'离', 震:'丰', 巽:'家人', 坎:'既济', 艮:'贲', 坤:'明夷' },
    震: { 乾:'无妄', 兑:'随', 离:'噬嗑', 震:'震', 巽:'益', 坎:'屯', 艮:'颐', 坤:'复' },
    巽: { 乾:'姤', 兑:'大过', 离:'鼎', 震:'恒', 巽:'巽', 坎:'井', 艮:'蛊', 坤:'升' },
    坎: { 乾:'讼', 兑:'困', 离:'未济', 震:'解', 巽:'涣', 坎:'坎', 艮:'蒙', 坤:'师' },
    艮: { 乾:'遁', 兑:'咸', 离:'旅', 震:'小过', 巽:'渐', 坎:'蹇', 艮:'艮', 坤:'谦' },
    坤: { 乾:'否', 兑:'萃', 离:'晋', 震:'豫', 巽:'观', 坎:'比', 艮:'剥', 坤:'坤' },
  };
  return H[lower]?.[upper] || '?';
}

// 京房八宫 — 宫 ngũ hành + 世位 (theo vị trí trong宫). name → {gong, gongWx, shi}
const GONG_WX = { 乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土' };
const SHI_BY_POS = [6, 1, 2, 3, 4, 5, 4, 3]; // index 0=本宫...7=归魂
const PALACE = {
  乾: ['乾', '姤', '遁', '否', '观', '剥', '晋', '大有'],
  坎: ['坎', '节', '屯', '既济', '革', '丰', '明夷', '师'],
  艮: ['艮', '贲', '大畜', '损', '睽', '履', '中孚', '渐'],
  震: ['震', '豫', '解', '恒', '升', '井', '大过', '随'],
  巽: ['巽', '小畜', '家人', '益', '无妄', '噬嗑', '颐', '蛊'],
  离: ['离', '旅', '鼎', '未济', '蒙', '涣', '讼', '同人'],
  坤: ['坤', '复', '临', '泰', '大壮', '夬', '需', '比'],
  兑: ['兑', '困', '萃', '咸', '蹇', '谦', '小过', '归妹'],
};
const NAME2PALACE = (() => {
  const m = {};
  for (const [g, list] of Object.entries(PALACE)) list.forEach((n, i) => { m[n] = { gong: g, pos: i }; });
  return m;
})();

// Sinh/khắc ngũ hành (Hán)
const SHENG = { 金: '水', 水: '木', 木: '火', 火: '土', 土: '金' };
const KE = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };
// [loop 1012] 冲 (6 cặp xung) + 合 (6 cặp lục hợp) — cổ pháp verified (tái dùng bảng 토정비결)
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const LIUHE = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };
// [loop 1013] 进神/退神 — động hào 化进/化退. Nguồn «增删卜易» 036章 (sourced, verified).
//   进神: 亥→子 寅→卯 巳→午 申→酉 (dương→âm cùng hành, tiến) + 丑→辰→未→戌→丑 (4土 tiến).
//   退神 = nghịch đảo.
const JINSHEN = { 亥: '子', 寅: '卯', 巳: '午', 申: '酉', 丑: '辰', 辰: '未', 未: '戌', 戌: '丑' };
const TUISHEN = { 子: '亥', 卯: '寅', 午: '巳', 酉: '申', 辰: '丑', 未: '辰', 戌: '未', 丑: '戌' };

// ---- [loop 1011] 六神 (六兽) — gán theo 日干 (口诀 «甲乙青龙丙丁雀, 戊日勾陈己蛇出,
//   庚辛白虎壬癸玄»). Thứ tự dưới→trên: 青龙→朱雀→勾陈→螣蛇→白虎→玄武.
const LIUSHEN_ORDER = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];
const LIUSHEN_START = { 甲: '青龙', 乙: '青龙', 丙: '朱雀', 丁: '朱雀', 戊: '勾陈', 己: '螣蛇', 庚: '白虎', 辛: '白虎', 壬: '玄武', 癸: '玄武' };
export const LIUSHEN_VI = {
  青龙: { vi: 'Thanh Long', tone: 'cat', mean: 'tài lộc · hỷ · sinh hoạt cát' },
  朱雀: { vi: 'Chu Tước', tone: 'mid', mean: 'khẩu thiệt · văn thư · thị phi · hỏa' },
  勾陈: { vi: 'Cấu Trần', tone: 'mid', mean: 'trì trệ · tranh tụng · điền sản' },
  螣蛇: { vi: 'Đằng Xà', tone: 'hung', mean: 'hư ảo · kinh sợ · quái dị' },
  白虎: { vi: 'Bạch Hổ', tone: 'hung', mean: 'huyết quang · bệnh nặng · thương tang' },
  玄武: { vi: 'Huyền Vũ', tone: 'hung', mean: 'trộm cắp · tiểu nhân · thất thoát' },
};
function liushenOf(dayGan, linePos /* 1-6 */) {
  const start = LIUSHEN_START[dayGan] || '青龙';
  const si = LIUSHEN_ORDER.indexOf(start);
  return LIUSHEN_ORDER[(si + (linePos - 1)) % 6];
}

// ---- [loop 1011] 空亡 (旬空) — 2 chi «không có» trong 10 ngày của旬 ngày.
//   Công thức: chi首旬 - 1, -2 (mod 12). Vd 甲子旬→戌亥, 甲戌旬→申酉, 甲寅旬→子丑.
const _BR = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const _GAN_ARR = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export function xunkongOf(dayGanZhi) {
  if (!dayGanZhi || dayGanZhi.length < 2) return [];
  const gi = _GAN_ARR.indexOf(dayGanZhi[0]);
  const zi = _BR.indexOf(dayGanZhi[1]);
  if (gi < 0 || zi < 0) return [];
  // vị trí 0-59 trong 60 hoa giáp (p%10=gi, p%12=zi)
  let p = -1;
  for (let k = 0; k < 6; k++) { const c = gi + k * 10; if (c % 12 === zi) { p = c; break; } }
  if (p < 0) return [];
  const xunShouPos = Math.floor(p / 10) * 10;            // vị trí旬首 (甲x)
  const xunShouBranch = xunShouPos % 12;                  // chi旬首
  const a = (xunShouBranch - 1 + 12) % 12;
  const b = (xunShouBranch - 2 + 12) % 12;
  return [_BR[a], _BR[b]];
}
function liuqinOf(gongWx, zhiWx) {
  if (zhiWx === gongWx) return '兄弟';
  if (SHENG[zhiWx] === gongWx) return '父母';   // sinh ta
  if (SHENG[gongWx] === zhiWx) return '子孙';   // ta sinh
  if (KE[gongWx] === zhiWx) return '妻财';       // ta khắc
  if (KE[zhiWx] === gongWx) return '官鬼';       // khắc ta
  return '?';
}

// ---- 六亲 万物类象 (卜筮正宗 卷五 / 火珠林 / 增删卜易) ----
// [loop 1203] Mỗi六亲 → đại biểu người/sự/vật + tính chất. Nguồn ≥2 (卜筮正宗卷五, 知乎«六亲类象延伸»).
// Phụ việc chọn 用神 + luận断 theo lục-thân trì thế/phát động.
export const LIUQIN_MEANING = {
  父母: {
    relation: '生我者 (sinh thể — Ấn)',
    person: 'cha mẹ, trưởng bối, sư trưởng',
    thing: 'văn thư, khế ước, chứng chỉ, học nghiệp, thi cử, phòng ốc, xe thuyền, y phục',
    nature: 'chủ bảo hộ phúc ấm; cũng chủ tân lao hao tài (đầu tư/chi phí lộ phí)',
  },
  兄弟: {
    relation: '比和者 (đồng thể — Tỷ/Kiếp)',
    person: 'anh em, bạn bè, đồng sự, hợp tác nhân, cạnh tranh giả',
    thing: 'ngăn cách, phá tài, hợp tác, phân tranh, kiếp hao',
    nature: '«phá hao chi thần» — chủ đầu tư cầu tài, cũng chủ hợp tác/giữ tài hộ vận',
  },
  子孙: {
    relation: '我生者 (thể sinh — Thực/Thương)',
    person: 'nhi nữ, vãn bối, học sinh, hạ thuộc',
    thing: 'phúc đức, hỷ duyệt, y dược, tăng đạo, kỹ nghệ, giải trí',
    nature: '«phúc đức chi thần», chủ khang thái bình an, giải ưu, 制官鬼 («tử tôn phát động thương quan quỷ, chiếm bệnh cầu y thân tiện thuyên»)',
  },
  妻财: {
    relation: '我克者 (thể khắc — Tài)',
    person: 'thê tử, nô bộc, hạ thuộc (người ta quản)',
    thing: 'tiền tài, tài vật, lương thực, thu hoạch, lợi tức',
    nature: '«养命之源» (dưỡng mệnh chi nguyên) — chủ tài lợi; nam mệnh cũng chủ thê',
  },
  官鬼: {
    relation: '克我者 (khắc thể — Quan/Sát)',
    person: 'quan phủ, thượng ty, phu quân (nữ chiêm), đạo tặc, tà 祟',
    thing: 'công danh, chức vị, bệnh tật, ưu nghi, lôi điện quỷ thần, họa ương',
    nature: 'áp lực/ước thúc/quyền uy — vừa là quan quý vừa là tai họa (卜筮正宗: «phàm chiêm công danh/quan phủ/lôi điện trượng phu/đạo tặc/ta 崇/ưu nghi bệnh, câu dĩ quan quỷ vi dụng thần»)',
  },
};

// [loop 1017] 本宫八纯 伏神 — mỗi vị trí hào có 1 lục-thân ẩn (theo 纳甲 八纯 vs ngũ hành cung).
//   Khi 用神 KHÔNG lộ trong quẻ → tìm nó ở 八纯 (nơi ẩn dưới 飞神 = hào hiện tại cùng vị trí).
//   Nguồn: 卜筮正宗 «伏吟飞伏» — «用神不上卦, 就于本宫八纯寻之».
function baiChunFu(palace, gongWx) {
  const t = TRI[palace];
  if (!t) return [];
  const fu = [];
  for (let i = 0; i < 3; i++) fu.push({ pos: i + 1, zhi: t.zn[i], wx: ZHI[t.zn[i]].wx, lq: liuqinOf(gongWx, ZHI[t.zn[i]].wx) });
  for (let i = 0; i < 3; i++) fu.push({ pos: i + 4, zhi: t.zw[i], wx: ZHI[t.zw[i]].wx, lq: liuqinOf(gongWx, ZHI[t.zw[i]].wx) });
  return fu;
}
// 旺衰 theo 月令: 当令=旺, sinh我=相, 我sinh=休, 克我=囚, 我克=死
function wangShuai(lineWx, monthWx) {
  if (lineWx === monthWx) return { lv: '旺', d: 2 };
  if (SHENG[monthWx] === lineWx) return { lv: '相', d: 1.5 };
  if (SHENG[lineWx] === monthWx) return { lv: '休', d: 0 };
  if (KE[monthWx] === lineWx) return { lv: '囚', d: -1 };
  if (KE[lineWx] === monthWx) return { lv: '死', d: -1.5 };
  return { lv: '?', d: 0 };
}

// Loại câu hỏi → 用神 (六亲)
const YONGSHEN_MAP = {
  wealth: { lq: '妻财', vi: 'Tài (妻财) — tiền/của/vợ' },
  career: { lq: '官鬼', vi: 'Quan Quỷ (官鬼) — công danh/chức/quyền' },
  parents: { lq: '父母', vi: 'Phụ Mẫu (父母) — cha mẹ/nhà/văn thư' },
  siblings: { lq: '兄弟', vi: 'Huynh Đệ (兄弟) — anh em/bạn/hợp tác' },
  children: { lq: '子孙', vi: 'Tử Tôn (子孙) — con cái/y tế/giải ưu' },
  health: { lq: '官鬼', vi: 'Quan Quỷ (官鬼 = bệnh) — xem Tử Tôn khắc nó' },
  love: { lq: '妻财', vi: 'Tài (nam问妻/duyên) / nữ则官鬼' },
  general: { lq: '世', vi: 'Thế (世爻) — bản thân câu hỏi chung' },
};

/**
 * Gieo + luận 六爻.
 * @param {number[]} vals - 6 giá trị 6/7/8/9 (6=老阴动,7=少阳静,8=少阴静,9=老阳动), từ dưới lên
 * @param {string} cat - loại câu hỏi (wealth/career/...)
 * @param {string} monthZhi - 月建 chi
 * @param {string} dayZhi - 日辰 chi
 * @param {string} [dayGan] - 日干 (để gán 六神). Nếu thiếu → không 六神.
 * @param {string} [dayGanZhi] - 日辰 hoa giáp (để tính 空亡).
 */
export function castLiuYao(vals, cat, monthZhi, dayZhi, dayGan, dayGanZhi) {
  // [loop 24 sửa CRITICAL] yang = 7 hoặc 9 (少阳/老阳); 6 và 8 là âm (老阴/少阴).
  //   Trước đây 'v >= 7' tính 8(少阴) là DƯƠNG — sai, corrupt quẻ mỗi khi 1 hào =8 (~37.5%).
  const yang = vals.map((v) => ((v === 7 || v === 9) ? 1 : 0)); // 6,8 = âm; 7,9 = dương
  const dong = vals.map((v) => v === 6 || v === 9); // 老阳/老阴 = động
  const lower = triFromLines3(yang[0], yang[1], yang[2]);
  const upper = triFromLines3(yang[3], yang[4], yang[5]);
  const name = hexName64(lower, upper);
  const palace = NAME2PALACE[name] || { gong: '?', pos: 0 };
  const gongWx = GONG_WX[palace.gong] || '土';
  const shi = SHI_BY_POS[palace.pos];
  const ying = ((shi + 2) % 6) + 1; // 世+3, 1-based wrap

  // [loop 1011] 空亡 (旬空) của ngày gieo
  const kongSet = new Set(xunkongOf(dayGanZhi || (dayGan ? dayGan + dayZhi : '')));

  // 纳甲 + 六亲 + 六神 + 空亡 cho 6 hào
  const lo = TRI[lower], up = TRI[upper];
  const lines = [];
  for (let i = 0; i < 3; i++) lines.push({ pos: i + 1, gan: lo.gn, zhi: lo.zn[i], wx: ZHI[lo.zn[i]].wx, yang: !!yang[i], dong: !!dong[i] });
  for (let i = 0; i < 3; i++) lines.push({ pos: i + 4, gan: up.gw, zhi: up.zw[i], wx: ZHI[up.zw[i]].wx, yang: !!yang[i + 3], dong: !!dong[i + 3] });
  lines.forEach((l) => {
    l.liuqin = liuqinOf(gongWx, l.wx);
    l.isShi = l.pos === shi; l.isYing = l.pos === ying;
    if (dayGan) l.shen = liushenOf(dayGan, l.pos);
    l.kong = kongSet.has(l.zhi);
    // [loop 1012] 月破/暗动/日合 — tương tác hào ↔ 月建/日辰
    l.yuepo = !!CHONG[monthZhi] && CHONG[monthZhi] === l.zhi;          // 月建冲 → 月破 (破, suy nặng)
    l.rihe = !!LIUHE[dayZhi] && LIUHE[dayZhi] === l.zhi;               // 日辰合 → được trợ
    l.andong = !l.dong && !!CHONG[dayZhi] && CHONG[dayZhi] === l.zhi;  // 静爻 被 日辰冲 → 暗动
  });

  // 变卦 (lật động hào)
  const bianYang = yang.slice();
  dong.forEach((d, i) => { if (d) bianYang[i] = bianYang[i] ? 0 : 1; });
  const bianLower = triFromLines3(bianYang[0], bianYang[1], bianYang[2]);
  const bianUpper = triFromLines3(bianYang[3], bianYang[4], bianYang[5]);
  const bianName = hexName64(bianLower, bianUpper);

  // [loop 1013] 进神/退神 — cho mỗi động hào, xác định chi 变卦 + hoá进/hoá退.
  //   Chi biến = 纳甲 của quẻ biến tại vị trí đó. JINSHEN/TUISHEN («增删卜易» 036章).
  const blo = bianLower ? TRI[bianLower] : null;
  const bup = bianUpper ? TRI[bianUpper] : null;
  lines.forEach((l) => {
    if (!l.dong || !blo || !bup) { l.hua = null; l.bianZhi = null; return; }
    const i = l.pos - 1;
    l.bianZhi = i < 3 ? blo.zn[i] : bup.zw[i - 3];
    if (JINSHEN[l.zhi] === l.bianZhi) l.hua = 'jin';        // 化进神 (tiến, mạnh lên)
    else if (TUISHEN[l.zhi] === l.bianZhi) l.hua = 'tui';   // 化退神 (thoái, suy đi)
    else l.hua = null;
  });

  // 用神
  const ys = YONGSHEN_MAP[cat] || YONGSHEN_MAP.general;
  const monthWx = ZHI[monthZhi]?.wx || '土';
  const dayWx = ZHI[dayZhi]?.wx || '土';
  // tìm các hào mang 用神 lục thân
  const yongLines = ys.lq === '世' ? lines.filter((l) => l.isShi) : lines.filter((l) => l.liuqin === ys.lq);
  // 旺衰 用神
  let bestLv = '无', bestD = -3, bestLine = null;
  yongLines.forEach((l) => {
    const ws = wangShuai(l.wx, monthWx);
    let d = ws.d;
    if (ZHI[dayZhi] && dayWx === l.wx) d += 1; // 日比
    if (ZHI[dayZhi] && SHENG[dayWx] === l.wx) d += 1; // 日sinh
    if (ZHI[dayZhi] && KE[dayWx] === l.wx) d -= 1.5; // 日khắc
    // [loop 1011] 空亡: hào 用神 trúng旬空 → có khí không thực lực, chủ trễ.
    if (l.kong) d -= 1;
    // [loop 1012] 月破/暗动/日合 — tương tác hào ↔ 月/日 (cổ法 卜筮正宗)
    if (l.yuepo) d -= 2;    // 月建冲 = 月破 → phá, gần như vô dụng tháng đó
    if (l.rihe) d += 1;     // 日辰合 = được日助 → nhẹ favour
    if (l.andong) d += 0.5; // 静爻 被 日冲 = 暗动 → có động năng ngầm
    // [loop 1013] 化进化退 — động hào 用神 hoá进 (mạnh dần) / hoá退 (suy dần)
    if (l.dong && l.hua === 'jin') d += 1;
    if (l.dong && l.hua === 'tui') d -= 1;
    if (d > bestD) { bestD = d; bestLv = ws.lv; bestLine = l; }
  });
  const yongKong = bestLine ? bestLine.kong : false;
  const yongYuepo = bestLine ? bestLine.yuepo : false;
  const yongAndong = bestLine ? bestLine.andong : false;
  const yongRihe = bestLine ? bestLine.rihe : false;
  const yongHua = bestLine ? bestLine.hua : null;
  // phán
  let verdict, luck;
  const notes = [];
  if (yongKong) notes.push('用神空亡 — có khí chưa thực, chủ trễ, đợi出空 mới ứng');
  if (yongYuepo) notes.push('用神月破 — bị月建冲, tháng này suy nặng (xong tháng sau tự hồi)');
  if (yongAndong) notes.push('用神暗动 — tĩnh mà bị日冲, ngầm có động năng');
  if (yongRihe) notes.push('用神合日 — được日辰 trì giúp');
  if (yongHua === 'jin') notes.push('用神化进神 — động mà hoá tiến, ngày càng mạnh (cát cho việc cần用神)');
  if (yongHua === 'tui') notes.push('用神化退神 — động mà hoá thoái, dần suy yếu (bất lợi cho việc cần用神)');
  const noteStr = notes.length ? ' [' + notes.join('; ') + ']' : '';
  if (!yongLines.length) {
    // [loop 1017] 用神 không lộ → tìm 伏神 ở本宫八纯 (ẩn dưới 飞神 = hào hiện tại cùng vị trí).
    const fu = baiChunFu(palace.gong, gongWx);
    const fuPos = fu.filter((f) => f.lq === ys.lq); // vị trí 八纯 mang cùng lục thân 用神
    if (fuPos.length) {
      const fp = fuPos[0];
      const fei = lines[fp.pos - 1];                 // 飞神 = hào hiện tại
      const fuWx = fp.wx, feiWx = fei.wx;
      let rel = '比和 (cùng hành — 伏thần trôi nổi, nhờ hay không nhờ nửa vời)';
      if (SHENG[feiWx] === fuWx) rel = '飞生伏 (飞 thần nuôi 伏 → 伏thần đắc sinh, CÓ THỂ DÙNG, cần đợi ngày vượng)';
      else if (SHENG[fuWx] === feiWx) rel = '伏生飞 (伏thần hao nuôi 飞 → 伏thần suy, khó dùng)';
      else if (KE[feiWx] === fuWx) rel = '飞克伏 (飞 thần khắc 伏 → 伏bị chế, rất khó dùng)';
      else if (KE[fuWx] === feiWx) rel = '伏克飞 «出暴» (伏thần khắc ngược 飞 → có thể đột khởi, nhưng bạo)';
      verdict = `Không có hào ${ys.lq} lộ trong quẻ → tìm 伏神: ${ys.lq} ẩn ở hào ${fp.pos} dưới 飞神 ${fei.gan}${fei.zhi} (${fei.liuqin}). Quan hệ 飞伏: ${rel}.`;
      luck = (/CÓ THỂ DÙNG|出暴/.test(rel)) ? 'Bình' : 'Hung';
    } else {
      verdict = `Không có hào ${ys.vi} trong quẻ — việc thiếu "dụng thần", khó thành / phải đợi vận.`;
      luck = 'Bình';
    }
  }
  else if (yongYuepo) { verdict = `用神 (${ys.vi}) 月破 (${bestLv}) — bị月建冲, tháng này đại suy → HUNG, nên hoãn đến hết tháng.${noteStr}`; luck = 'Hung'; }
  else if (bestD >= 1.5) { verdict = `用神 (${ys.vi}) ${bestLv} (+${bestD.toFixed(1)}) — vượng được sinh phù → CÁT, nên tiến hành.${noteStr}`; luck = (yongKong || yongAndong) ? 'Bình' : 'Cát'; }
  else if (bestD >= 0) { verdict = `用神 ${bestLv} — trung bình, làm được nhưng cần nỗ lực / đợi ngày更好.${noteStr}`; luck = 'Bình'; }
  else { verdict = `用神 ${bestLv} (${bestD.toFixed(1)}) — suy/khắc → HUNG, nên hoãn/tránh.${noteStr}`; luck = 'Hung'; }

  // 六亲持世
  const shiLine = lines.find((l) => l.isShi);
  const shiChish = shiLine ? `${shiLine.liuqin}持世` : '';

  return { name, lower, upper, palace: palace.gong, gongWx, shi, ying, lines, bianName,
    dongCount: dong.filter(Boolean).length, yongshen: ys, yongLines, monthZhi, dayZhi, dayGan,
    kong: [...kongSet], yongKong, bestLv, bestD, shiChish, verdict, luck };
}

export { NAME2PALACE, baiChunFu };
