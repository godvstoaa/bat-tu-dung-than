// ============================================================================
//  MAI HOA DỊCH SỐ 梅花易数 (邵雍) — gieo quẻ theo thời gian / số
//  Khác bát tự (lá số cố định): Mai Hoa trả lời CÂU HỎI CỤ THỂ tại thời điểm.
//  Cơ sở: 先天八卦数 (乾1兑2离3震4巽5坎6艮7坤8); 年月日时起卦; 体用 ngũ hành
//  sinh khắc → cát hung; 本卦(始)→互卦(过程)→变卦(结果). Nguồn: 梅花易数 卷一.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 8 quái theo 先天数 (1-8). lines: 3 hào từ dưới lên (1=dương, 0=âm).
export const TRIGRAMS = {
  乾: { num: 1, vi: 'Càn', wx: 'Kim', img: '☰', ele: 'Trời', lines: [1, 1, 1], nature: 'cương kiện, sáng tạo, cha' },
  兑: { num: 2, vi: 'Đoài', wx: 'Kim', img: '☱', ele: 'Đầm', lines: [1, 1, 0], nature: 'vui vẻ, ngôn luận, thiểu nữ' },
  离: { num: 3, vi: 'Ly', wx: 'Hỏa', img: '☲', ele: 'Lửa', lines: [1, 0, 1], nature: 'rực rỡ, minh trí, giữa nữ' },
  震: { num: 4, vi: 'Chấn', wx: 'Mộc', img: '☳', ele: 'Sấm', lines: [1, 0, 0], nature: 'kích động, tiến, trưởng nam' },
  巽: { num: 5, vi: 'Tốn', wx: 'Mộc', img: '☴', ele: 'Gió', lines: [0, 1, 1], nature: 'nhu thuận, thâm nhập, trưởng nữ' },
  坎: { num: 6, vi: 'Khảm', wx: 'Thủy', img: '☵', ele: 'Nước', lines: [0, 1, 0], nature: 'hiểm trở, trí, giữa nam' },
  艮: { num: 7, vi: 'Cấn', wx: 'Thổ', img: '☶', ele: 'Núi', lines: [0, 0, 1], nature: 'dừng lại, vững, thiểu nam' },
  坤: { num: 8, vi: 'Khôn', wx: 'Thổ', img: '☷', ele: 'Đất', lines: [0, 0, 0], nature: 'nhu thuận, bao dung, mẹ' },
};

// ---- 八卦萬物類象 (說卦傳) — mở rộng cho TRIGRAMS ----
// [loop 1201] Nguồn: 說卦傳 + 维基百科/百度百科/知乎 «八卦万物类象» — ≥2 nguồn độc lập.
// Dùng cho luận quẻ 梅花/六爻/qimen: mỗi quái → tự nhiên/thân thể/dộng vật/gia nhân/phương/vũ đức.
export const BAGUA_LEIXIANG = {
  乾: { nature: '天', body: '首 (đầu)', animal: '马 (ngựa)', family: 'phụ (cha)', direction: 'tây bắc', season: 'thu đông giao', virtue: '健 (kiện)', extras: 'quân, vương, kim, ngọc, viên mãn, cương' },
  坤: { nature: '地', body: '腹 (phúc)', animal: '牛 (ngưu)', family: 'mẫu (mẹ)', direction: 'tây nam', season: 'hạ thu giao', virtue: '顺 (thuận)', extras: 'chúng, bố bác, phò, ph釜, nhu' },
  震: { nature: '雷', body: '足 (túc)', animal: '龙 (long)', family: 'trưởng nam', direction: 'đông', season: 'xuân', virtue: '动 (động)', extras: 'quyết, thanh sắc, rẽ, sinh cơ, hào phóng' },
  巽: { nature: '风 (phong)', body: '股 (cổ)', animal: '鸡 (kê)', family: 'trưởng nữ', direction: 'đông nam', season: 'xuân hạ giao', virtue: '入 (nhập)', extras: 'thẳng,绳, mộc, trường, nhập' },
  坎: { nature: '水', body: '耳 (nhĩ)', animal: '豕 (thỉ - lợn)', family: 'trung nam', direction: 'bắc', season: 'đông', virtue: '陷 (hiểm)', extras: 'huyết, xa, nguyệt,险 trở, u ám' },
  离: { nature: '火', body: '目 (mục)', animal: '雉 (trĩ)', family: 'trung nữ', direction: 'nam', season: 'hạ', virtue: '丽 (phụ/lệ)', extras: 'nhật, điện, giáp trụ, văn minh' },
  艮: { nature: '山', body: '手 (thủ)', animal: '狗 (cẩu)', family: 'thiếu nam', direction: 'đông bắc', season: 'đông xuân giao', virtue: '止 (chỉ)', extras: 'môn, kính, thạch, đốc, stopped' },
  兑: { nature: '泽 (trạch)', body: '口 (khẩu)', animal: '羊 (dương)', family: 'thiếu nữ', direction: 'tây', season: 'thu', virtue: '悦 (duyệt)', extras: 'ngôn, khẩu thiệt, 巫, thưởng' },
};

// ---- 梅花易数 «三要灵篇» 三要 + «十应» (lý luận ngoại ứng) ----
// [loop 1228] Nguồn: ctext 梅花易數卷三 + 知乎«三要十应»«十应».
//   «Nhân vi vạn vật chi linh, tâm nãi nhất thân chi chủ» — vận 3 quan để bắt ngoại ứng.
export const MEIHUA_SANYAO = {
  耳: 'thính âm thanh động tĩnh (nghe) — «nhĩ chi sứu vi thính»',
  目: 'quan hình sắc biến hoá (nhìn) — «mục dụ nhi vi hình vi sắc»',
  心: 'tổng nhiếp tư duy — «tâm nãi nhất thân chi chủ», tổng hồ thông minh',
};
export const MEIHUA_SHIYING = {
  正应: 'cảm ứng bản quái (chính quái)',
  互应: 'cảm ứng hổ quái',
  变应: 'cảm ứng biến quái',
  方应: 'cảm ứng phương vị (đông/tây/nam/bắc) ↔ quái',
  日应: 'cảm ứng thời lệnh tiết khí (xuân mộc vượng, hạ hỏa vượng...)',
  刻应: 'cảm ứng khắc/thời điểm chiêm',
  外应: 'cảm ứng ngoại vật (vạn vật loại tượng — động thực vật, khí cụ)',
  天时应: 'cảm ứng thiên tượng/thời tiết (tình chủ cát, bạo phong chủ hung)',
  地理应: 'cảm ứng môi trường/địa lý (sơn/thuỷ/phương vị)',
  人事应: 'cảm ứng sự việc người xung quanh («ngẫu ngộ nhân sự chi cát vi cát, hung vi hung»)',
};
const NUM2TRI = ['坤', '乾', '兑', '离', '震', '巽', '坎', '艮', '坤']; // index 0→8 (0=坤)

// 64 hexagram theo [hạ][thượng] (King Wen)
const HEX64 = {
  乾: { 乾: '乾', 兑: '夬', 离: '大有', 震: '大壮', 巽: '小畜', 坎: '需', 艮: '大畜', 坤: '泰' },
  兑: { 乾: '履', 兑: '兑', 离: '睽', 震: '归妹', 巽: '中孚', 坎: '节', 艮: '损', 坤: '临' },
  离: { 乾: '同人', 兑: '革', 离: '离', 震: '丰', 巽: '家人', 坎: '既济', 艮: '贲', 坤: '明夷' },
  震: { 乾: '无妄', 兑: '随', 离: '噬嗑', 震: '震', 巽: '益', 坎: '屯', 艮: '颐', 坤: '复' },
  巽: { 乾: '姤', 兑: '大过', 离: '鼎', 震: '恒', 巽: '巽', 坎: '井', 艮: '蛊', 坤: '升' },
  坎: { 乾: '讼', 兑: '困', 离: '未济', 震: '解', 巽: '涣', 坎: '坎', 艮: '蒙', 坤: '师' },
  艮: { 乾: '遁', 兑: '咸', 离: '旅', 震: '小过', 巽: '渐', 坎: '蹇', 艮: '艮', 坤: '谦' },
  坤: { 乾: '否', 兑: '萃', 离: '晋', 震: '豫', 巽: '观', 坎: '比', 艮: '剥', 坤: '坤' },
};
function hexName(lower, upper) { return HEX64[lower]?.[upper] || '?'; }

// Sinh / khắc (ngũ hành VIỆT — khớp TRIGRAMS.wx)
const SHENG = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' };
const KE = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' };
function relOf(ti, yong) {
  if (ti === yong) return { k: '比和', luck: '吉', d: 0, vi: 'thể dụng đồng hành — hoà hợp, thuận' };
  if (SHENG[yong] === ti) return { k: '用生体', luck: '大吉', d: 1, vi: 'việc/sự giúp mình → đại cát, nên tiến' };
  if (SHENG[ti] === yong) return { k: '体生用', luck: '不吉', d: -1, vi: 'mình hao sức cho việc → hao tổn, chỉ nên nếu xứng' };
  if (KE[ti] === yong) return { k: '体克用', luck: '小吉', d: 0.5, vi: 'mình chế được việc → phí lực nhưng thành' };
  if (KE[yong] === ti) return { k: '用克体', luck: '大凶', d: -2, vi: 'việc khắc mình → đại hung, nên tránh/thủ' };
  return { k: '?', luck: '?', d: 0, vi: '' };
}

// Lấy 6 hào (từ dưới lên) của một quái kép
function linesOf(lower, upper) { return [...TRIGRAMS[lower].lines, ...TRIGRAMS[upper].lines]; }
// Tên quái kép từ 6 hào
function triFromLines3(a, b, c) {
  return Object.keys(TRIGRAMS).find((k) => TRIGRAMS[k].lines.join('') === [a, b, c].join(''));
}
// 互卦: hạ = hào 2,3,4; thượng = hào 3,4,5 (hào đánh số 1-6 từ dưới lên → index 1,2,3,4,5)
function huGua(lines) {
  const lo = triFromLines3(lines[1], lines[2], lines[3]);
  const up = triFromLines3(lines[2], lines[3], lines[4]);
  return { lower: lo, upper: up, name: hexName(lo, up) };
}
// 变卦: lật động hào
function bianGua(lower, upper, dong) {
  const lines = linesOf(lower, upper);
  lines[dong - 1] = lines[dong - 1] ? 0 : 1;
  const lo = triFromLines3(lines[0], lines[1], lines[2]);
  const up = triFromLines3(lines[3], lines[4], lines[5]);
  return { lower: lo, upper: up, name: hexName(lo, up) };
}

/**
 * Gieo quẻ theo THỜI GIAN (âm lịch số năm-chi + tháng + ngày + giờ chi).
 * @param {Date numbers} {lunarYearNum, month, day, hourNum}
 *   - lunarYearNum: số chi năm (子1…亥12)
 *   - month: tháng âm (1-12)
 *   - day: ngày âm (1-30)
 *   - hourNum: số chi giờ (子1…亥12)
 */
export function castByTime({ yearNum, month, day, hourNum }) {
  const upN = ((yearNum + month + day) % 8) || 8;
  const lowN = ((yearNum + month + day + hourNum) % 8) || 8;
  const dong = ((yearNum + month + day + hourNum) % 6) || 6;
  return buildGua(NUM2TRI[lowN], NUM2TRI[upN], dong, { yearNum, month, day, hourNum });
}

/**
 * Gieo theo 2 SỐ (pháp "kẻ đồ vật/đếm số").
 * @param a số trên quái, b số dưới quái
 */
export function castByNumbers(a, b) {
  const upN = (a % 8) || 8;
  const lowN = (b % 8) || 8;
  const dong = ((a + b) % 6) || 6;
  return buildGua(NUM2TRI[lowN], NUM2TRI[upN], dong, { a, b });
}

function buildGua(lower, upper, dong, src) {
  const lines = linesOf(lower, upper);
  const dongInUpper = dong >= 4;
  const tiTri = dongInUpper ? lower : upper;   // quái KHÔNG động = thể
  const yongTri = dongInUpper ? upper : lower; // quái CÓ động = dụng
  const ti = TRIGRAMS[tiTri], yong = TRIGRAMS[yongTri];
  const rel = relOf(ti.wx, yong.wx);
  const hu = huGua(lines);
  const bian = bianGua(lower, upper, dong);
  // 互/变 ngũ hành vs thể (quá trình / kết quả)
  const huRel = relOf(ti.wx, TRIGRAMS[hu.upper].wx);
  // [loop 552 FIX] bianRel phải so THỂ với DỤNG MỚI (quái có động hào SAU BIẾN). Trước đây
  //   luôn dùng bian.upper → khi động hào ở HẠ, bian.upper=thể → relOf(thể,thể)=比和 (SAI cho
  //   ~50% quẻ). Nay chọn quái động sau biến.
  const bianYongTri = dongInUpper ? bian.upper : bian.lower;
  const bianRel = relOf(ti.wx, TRIGRAMS[bianYongTri].wx);
  // tổng phán — 本卦 (khởi đầu)
  let verdict;
  if (rel.d >= 1) verdict = 'CÁT — 本卦 thể dụng tương sinh: nên tiến hành, việc thuận.';
  else if (rel.d === 0.5) verdict = 'TIỂU CÁT — thể khắc dụng: làm được nhưng phải tốn công.';
  else if (rel.d === 0) verdict = 'BÌNH — thể dụng tỷ hoà: hoà hợp, tùy nỗ lực.';
  else if (rel.d === -1) verdict = 'HAO — thể sinh dụng (tiết khí): chỉ nên làm nếu xứng đáng, dễ hao sức.';
  else verdict = 'HUNG — dụng khắc thể: NÊN TRÁNH / hoãn / thủ, đợi thời khác.';
  // [loop 624] 3-LAYER SYNTHESIS — 梅花 cổ pháp: 本卦(始) → 互卦(中/quá trình) → 变卦(终/kết quả).
  //   Trước đây verdict CHỈ dùng 本卦 rel, bỏ qua huRel/bianRel dù đã tính. Mấu chốt: biến quái
  //   (kết quả) có thể ĐẢO NGƯỢC bản quái → «先凶后吉» (khởi khó nhưng kết tốt) hoặc «先吉后凶».
  const _lvl = (r) => (r.d >= 1 ? 4 : r.d === 0.5 ? 3 : r.d === 0 ? 2 : r.d === -1 ? 1 : 0); // 4=cát→0=hung
  const _lab = (r) => (r.d >= 1 ? 'CÁT' : r.d === 0.5 ? 'tiểu cát' : r.d === 0 ? 'bình' : r.d === -1 ? 'hao' : 'HUNG');
  const initL = _lvl(rel), procL = _lvl(huRel), outL = _lvl(bianRel);
  const processNote = `互卦 (quá trình): ${huRel.k} → ${_lab(huRel)}. ${procL >= 3 ? 'Quá trình thuận.' : procL <= 1 ? 'Quá trình nhiều trở ngại.' : 'Quá trình bình ổn.'}`;
  const outcomeNote = `变卦 (kết quả): ${bianRel.k} → ${_lab(bianRel)}. ${outL >= 3 ? 'Kết quả tốt.' : outL <= 1 ? 'Kết quả không như ý.' : 'Kết quả trung bình.'}`;
  let finalVerdict;
  const isCat = (l) => l >= 3, isHung = (l) => l <= 1;
  if (isCat(outL) && isHung(initL)) finalVerdict = `★ 先凶后吉 — bản quẻ HUNG nhưng BIẾN QUẺ CÁT: khởi đầu khó khăn, CẾT QUẢ VẪN TỐT. Cổ pháp「卦有结局为重」— nên kiên nhẫn vượt qua đầu, đợi kết quả.`;
  else if (isHung(outL) && isCat(initL)) finalVerdict = `⚠ 先吉后凶 — bản quẻ CÁT nhưng BIẾN QUẺ HUNG: khởi đầu thuận, KẾT QUẢ XẤU. Nên tận dụng sớm, phòng hậu quả về sau.`;
  else if (isCat(initL) && isCat(outL)) finalVerdict = `✓ CÁT TOÀN DIỆN — bản quẻ + biến quẻ đều CÁT: việc thuận từ đầu đến cuối, nên tiến hành.`;
  else if (isHung(initL) && isHung(outL)) finalVerdict = `✗ HUNG TOÀN DIỆN — bản quẻ + biến quẻ đều HUNG: nên TRÁNH / hoãn / đợi thời khác.`;
  else if (initL === 2 && outL === 2) finalVerdict = `〜 BÌNH TOÀN — bản + biến đều tỷ hoà: không大凶大吉, kết quả tùy nỗ lực chủ quan.`;
  else finalVerdict = `${_lab(rel)} khởi → ${_lab(bianRel)} kết. ${outL > initL ? 'Xu hướng CẦN LÊN (kết tốt hơn đầu).' : outL < initL ? 'Xu hướng XUỐNG (kết kém hơn đầu, cẩn thận).' : 'Ổn định.'}`;
  return {
    src, lower, upper, name: hexName(lower, upper), dong, dongInUpper,
    ben: { lower, upper, name: hexName(lower, upper) },
    hu, bian,
    ti: { tri: tiTri, ...ti }, yong: { tri: yongTri, ...yong },
    rel, huRel, bianRel, verdict,
    processNote, outcomeNote, finalVerdict, // [loop 624] 3-layer synthesis
  };
}

/** Helper: từ dương lịch → số âm lịch để gieo */
export function solarToMhNums(year, month, day, hour, minute) {
  // [loop 552 FIX] hour || 12 nuốt giờ Tý (hour=0 → 12). Dùng == null check.
  const s = Solar.fromYmdHms(year, month, day, hour == null ? 12 : hour, minute || 0, 0);
  const l = s.getLunar();
  const yearBranch = l.getYearZhi(); // 子…亥
  const yearNum = '子丑寅卯辰巳午未申酉戌亥'.indexOf(yearBranch) + 1;
  const lmonth = l.getMonth(); // 1-12 (âm)
  const lday = l.getDay(); // 1-30
  const hourZhi = l.getTimeZhi();
  const hourNum = '子丑寅卯辰巳午未申酉戌亥'.indexOf(hourZhi) + 1;
  return { yearNum, month: lmonth, day: lday, hourNum, label: `${l.getMonthInChinese()}月${l.getDayInChinese()} ${yearBranch}年 ${hourZhi}时` };
}

export { hexName };
