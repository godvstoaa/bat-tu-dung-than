// ============================================================================
//  KỲ MÔN ĐỘN GIÁP 奇门遁甲 — 时家奇门 (静盘/局盘 + 定局 + 吉格)
//  Hệ "三式" lừng danh, dùng chọn thời điểm/hướng đi (cát hung cục).
//  Scope vòng này: 定局 (节气×元→阳/阴遁N局) + 地盘三奇六仪 + 九星(随六仪)
//  + 八门(定宫) + 八神 + 吉格判定. (时辰动盘天盘飞旋 = bước sau.)
//  Nguồn: 奇门18局定局表, 排盘口诀 (verified).
// ============================================================================
import { Solar } from 'lunar-javascript';

// 24 节气 → 阳/阴遁 + [上元,中元,下元] 局数 (verified from 口诀)
const TERM_JU = {
  // 阳遁 (冬至→芒种)
  冬至: { yy: '阳', ju: [1, 7, 4] }, 小寒: { yy: '阳', ju: [2, 8, 5] }, 大寒: { yy: '阳', ju: [3, 9, 6] },
  立春: { yy: '阳', ju: [8, 5, 2] }, 雨水: { yy: '阳', ju: [9, 6, 3] }, 惊蛰: { yy: '阳', ju: [1, 7, 4] },
  春分: { yy: '阳', ju: [3, 9, 6] }, 清明: { yy: '阳', ju: [4, 1, 7] }, 谷雨: { yy: '阳', ju: [5, 2, 8] },
  立夏: { yy: '阳', ju: [4, 1, 7] }, 小满: { yy: '阳', ju: [5, 2, 8] }, 芒种: { yy: '阳', ju: [6, 3, 9] },
  // 阴遁 (夏至→大雪)
  夏至: { yy: '阴', ju: [9, 3, 6] }, 小暑: { yy: '阴', ju: [8, 2, 5] }, 大暑: { yy: '阴', ju: [7, 1, 4] },
  立秋: { yy: '阴', ju: [2, 5, 8] }, 处暑: { yy: '阴', ju: [1, 4, 7] }, 白露: { yy: '阴', ju: [9, 3, 6] },
  秋分: { yy: '阴', ju: [7, 1, 4] }, 寒露: { yy: '阴', ju: [6, 9, 3] }, 霜降: { yy: '阴', ju: [5, 8, 2] },
  立冬: { yy: '阴', ju: [6, 9, 3] }, 小雪: { yy: '阴', ju: [5, 8, 2] }, 大雪: { yy: '阴', ju: [4, 1, 7] },
};
const YUAN_VI = ['上元', '中元', '下元'];

// 三奇六仪 + 九星本位 (天蓬本坎1 … 天英本离9 — FIXED to洛书宫, không随六仪)
const QIYI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
// [loop 1239] 三奇六仪 ý nghĩa (《奇门遁甲统宗》Wikisource + 知乎 + 搜狐). QIYI/XUN_YI là array; đây là tầng giải thích.
export const SANYI_LIUYI = {
  dunJia: '«Độn giáp» — giáp (nguyên soái/quân chủ) ẩn dưới «lục nghi», không trực tiếp lộ (kỵ trực tiếp nhận khắc).',
  liuYi: '六仪 戊/己/庚/辛/壬/癸 = 6 甲旬首 ẩn tàng: 甲子→戊, 甲戌→己, 甲申→庚, 甲午→辛, 甲辰→壬, 甲寅→癸.',
  sanQi: '三奇 乙(日奇)/丙(月奇)/丁(星奇) = nhật/nguyệt/tinh — nguyên soái (giáp) thủ hạ tả hữu + ảnh tử.',
  order: 'Cố định顺序 戊→己→庚→辛→壬→癸→丁→丙→乙 (âm/dương độn đều bố cục theo thứ tự này).',
};

// ---- 奇门格局 (famous 吉格/凶格) ----
// [loop 1240] Nguồn: 知乎«81格局精讲» + Wikisource 奇门遁甲元灵经 + ctext 统宗.
//   [KEY] 吉格若逢 门迫/入墓/击刑 → cát chuyển hung (điều kiện quan trọng).
export const QIMEN_GEJU = {
  青龙返首: { tone: 'cat', cond: '戊加丙', meaning: 'giáp mộc sinh bính hoả, mẫu cố tử — mưu sự đại cát', note: 'phùng 迫/墓/击刑 thì cát chuyển hung' },
  飞鸟跌穴: { tone: 'cat', cond: '丙加戊 (dị bản: 乙加戊)', meaning: 'tử quy mẫu biên, tự điểu quy sào — bách sự cát, mưu đại sự' },
  玉女守门: { tone: 'cat', cond: '丁奇 lâm 开门 (trực sử)', meaning: 'ngọc nữ thủ môn — hôn nhân, mưu sự cát' },
  青龙转光: { tone: 'cat', cond: '戊加丁', meaning: 'phú quý vinh diệu, chủ ấp trưởng/huyện lệnh chi mệnh' },
  白虎猖狂: { tone: 'hung', cond: '辛加乙', meaning: 'nhân vong gia bại, viễn đắc đa ương, tôn trưởng bất hỉ' },
  腾蛇夭矫: { tone: 'hung', cond: '癸加丁', meaning: 'di dời thị bệnh nhân, chủ hung (hư kinh)' },
  朱雀投江: { tone: 'hung', cond: '丁加癸', meaning: 'kê minh phi quái — khẩu thiệt, chủ hung' },
  青龙逃走: { tone: 'hung', cond: '乙加辛', meaning: 'thất thoát đào vong, chủ hung' },
  青龙折足: { tone: 'hung', cond: '戊加辛', meaning: 'cát môn trợ thì mưu được; hung môn chủ chiêu tai/thất tài/túc tật' },
};
const GONG_STAR = { 1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英' };
const STAR_VI = { 天蓬: 'thiên bằng (đại hung)', 天芮: 'thiên nhuệ (bệnh)', 天冲: 'thiên xung (hung)', 天辅: '天phụ (cát, văn)', 天禽: 'thiên cầm (bình/trung)', 天心: 'thiên tâm (đại cát, y)', 天柱: 'thiên trụ (hung)', 天任: 'thiên nhậm (cát)', 天英: 'thiên anh (hỏa, trung)' };
// [loop 1205] 九星 类象 sâu (知乎/360doc«奇门遁甲九星含义») — ý nghĩa天盘, bổ cho GONG_STAR/STAR_VI.
//   吉: 天辅/天禽/天心 (上吉) + 天冲/天任 (小吉); 凶: 天蓬/天芮 (大凶) + 天柱/天英 (小凶).
const STAR_INFO = {
  天蓬: { gong: '1 坎 (bắc)', wx: 'thủy', tone: 'hung', desc: 'đạo tặc, hành động ngầm, mạo hiểm, quân sự phương bắc; hung thì chủ đạo tặc / tổn thất / ám muội' },
  天芮: { gong: '2 坤 (tây nam)', wx: 'thổ', tone: 'hung', desc: 'bệnh tật, vấn đề, ẩn hoạn, học tập; cũng chủ tu hành — thường là dụng thần khi đoán bệnh' },
  天冲: { gong: '3 chấn (đông)', wx: 'mộc', tone: 'cat', desc: 'xung động, võ lực, việc đột phát, hành động vội; chấn động phấn tiến' },
  天辅: { gong: '4 tốn (đông nam)', wx: 'mộc', tone: 'cat', desc: 'văn hoá giáo dục, văn chức, thi cử, văn thư; chủ văn vận hưng thịnh' },
  天禽: { gong: '5 trung cung', wx: 'thổ', tone: 'cat', desc: 'trọng ổn, bao dung, cân bằng; thường ký khôn cung, chủ đại cát' },
  天心: { gong: '6 càn (tây bắc)', wx: 'kim', tone: 'cat', desc: 'quản lý, lãnh đạo, y liệu cứu trị, quyết sách cốt lõi; chủ năng lực giải vấn đề' },
  天柱: { gong: '7 đoài (tây)', wx: 'kim', tone: 'hung', desc: 'phá hoại, phá bại, kinh khủng, khẩu thiệt tranh đấu; cũng chủ chống đỡ trụ cột' },
  天任: { gong: '8 cấn (đông bắc)', wx: 'thổ', tone: 'cat', desc: 'trách nhiệm, gánh vác, ổn định, kinh doanh phát triển, tử tôn; chủ cát lợi' },
  天英: { gong: '9 ly (nam)', wx: 'hỏa', tone: 'hung', desc: 'danh tiếng, văn thư, hoả khí, lễ nghi; cũng chủ bạo táo, huyết quang, hoả hiểm' },
};

// 八门 định cung (静盘): 休1 生8 伤3 杜4 景9 死2 惊7 开6
const DOOR_AT = { 1: '休', 8: '生', 3: '伤', 4: '杜', 9: '景', 2: '死', 7: '惊', 6: '开' };
const DOOR_VI = { 休: 'Hưu (cát — nghỉ/ngơi)', 生: 'Sinh (đại cát — sinh sôi/tài)', 伤: 'Thương (hung — tổn thương)', 杜: 'Đỗ (bình — ẩn náu)', 景: 'Cảnh (bình — văn/thi)', 死: 'Tử (đại hung)', 惊: 'Kinh (hung — kinh sợ)', 开: 'Khai (đại cát — mở/khai trương)' };
// [loop 1206] 八门 类象 sâu (百度百科/知乎«八门含义与象意») — ý nghĩa人盘, hoàn thiện qimen trinity.
//   三吉: 开/休/生; 三凶: 死/惊/伤; 中平: 杜/景. (khớp DOOR_VI tone + DOOR_WX)
const DOOR_INFO = {
  开: { gong: '6 càn (tây bắc)', wx: 'kim', tone: 'cat', desc: 'khai sáng, công khai, thông đạt — vạn vật sát tận nhi phục sinh; quý nhân, quan chức, khai trương, sự nghiệp tiền đồ', yi: 'khai nghiệp / cầu danh / mưu sự / kiến quý nhân / viễn hành / gia thú' },
  休: { gong: '1 khảm (bắc)', wx: 'thủy', tone: 'cat', desc: 'hu dưỡng, dưỡng tinh túc duệ — âm cực sinh dương, thuỷ khí hội lưu; nghỉ ngơi điều chỉnh, tích thế đãi phát', yi: 'cầu ổn định / hu dưỡng / tích tụ / hòa đàm / kiến quý nhân; bất nghi cấp tiến' },
  生: { gong: '8 cấn (đông bắc)', wx: 'thổ', tone: 'cat', desc: 'vạn vật sinh trưởng — sinh phát, sinh cơ, tài vận; sinh dục, phát triển, phú quý', yi: 'kinh doanh cầu tài / cầu chức / gia thú / kiến tạo' },
  伤: { gong: '3 chấn (đông)', wx: 'mộc', tone: 'hung', desc: 'thương tai, bệnh tật, tổn thương, biến động; thanh âm, tàn tật, xe cộ, tranh đấu', yi: 'săn bắn (捕猎) / đòi nợ (讨债) / cạnh tranh; kỵ gia thú / kinh doanh / viễn hành' },
  杜: { gong: '4 tốn (đông nam)', wx: 'mộc', tone: 'mid', desc: 'bế tắc, ẩn giấu, ngăn đoạn; ẩn trang, tech thuật nghiên cứu, phòng thủ', yi: 'ẩn nấp / trốn tai / nghiên cứu kỹ thuật; bất nghi công khai cầu sự' },
  景: { gong: '9 ly (nam)', wx: 'hỏa', tone: 'mid', desc: 'quang minh, văn thư, tin tức, hư kinh; văn hoá, thi cử, huyết quang hoả hiểm', yi: 'phúc khảo / văn thư / bái phỏng; phòng khẩu thiệt / hư kinh' },
  死: { gong: '2 khôn (tây nam)', wx: 'thổ', tone: 'hung', desc: 'tử vong, chung kết, suy lão; tang sự, phần mộ, ai điếu, hình sát', yi: 'tang tá / điếu viếng / kết thúc cựu sự; bách sự bất nghi, kỵ gia thú / cầu tài' },
  惊: { gong: '7 đoài (tây)', wx: 'kim', tone: 'hung', desc: 'kinh khủng, ưu lự, khẩu thiệt quan phi; hủy tổn, tranh tụng', yi: 'cáo trạng / tụng sự / biện luận; bất nghi gia thú / cầu tài / viễn hành' },
};
const JI_DOOR = ['开', '休', '生']; // 3吉门
// [loop 1089] 门迫 (宫克门) — ngũ hành cung (洛书九宫 后天八卦) + 八门 bản vị ngũ hành.
//   «吉门受宫克为迫, 吉事不吉» — cửa TỐT bị cung KHẮC → cát lực giảm (vd 开门Kim ở 离9 Hỏa → Hỏa khắc Kim).
const GONG_WX = { 1: '水', 2: '土', 3: '木', 4: '木', 5: '土', 6: '金', 7: '金', 8: '土', 9: '火' };
const DOOR_WX = { 开: '金', 休: '水', 生: '土', 伤: '木', 杜: '木', 景: '火', 死: '土', 惊: '金' };
const _WX_KE = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' }; // KE[gongWx] === doorWx ⇒ cung khắc门

// 宫 ↔ phương vị (洛书)
const GONG_DIR = { 1: 'Bắc (坎)', 2: 'Tây Nam (坤)', 3: 'Đông (震)', 4: 'Đông Nam (巽)', 5: 'Trung cung', 6: 'Tây Bắc (乾)', 7: 'Tây (兑)', 8: 'Đông Bắc (艮)', 9: 'Nam (离)' };

/**
 * Định局 + xếp静盘 cho một dương lịch ngày giờ.
 * @returns {{ term, yuan, yinYang, ju, pan:[{gong,dir,qiyi,star,starVi,door,doorVi,isCat}], gige, advice }}
 */
export function qimenPan(year, month, day, hour = 12) {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const prev = lunar.getPrevJieQi();
  const term = prev.getName();
  const termStart = prev.getSolar();
  const info = TERM_JU[term] || TERM_JU['冬至'];
  // 元: số ngày từ tiết khí → div 5 (gần đúng, bỏ qua 正授/置闰 tinh tế)
  const ms = (s) => new Date(s.getYear(), s.getMonth() - 1, s.getDay()).getTime();
  const daysSince = Math.floor((ms(solar) - ms(termStart)) / 86400000);
  // [cycle 59 sửa CRITICAL] bỏ `% 3` — qua ngày 15 (hết 下元) KHÔNG quay lại 上元 (mod sai), mà GIỮ 下元
  //   cho tới tiết kế. Trước đây wrap → ~18 ngày/năm sai 局 (vd 大寒+15 = 下元, không phải 上元).
  const yuanIdx = Math.max(0, Math.min(2, Math.floor(daysSince / 5)));
  const yinYang = info.yy;
  const ju = info.ju[yuanIdx];

  // 地盘: 戊起 局宫, 阳 顺 / 阴 逆 (theo宫数 1-9)
  const gongQiyi = {}; // gong -> qiyi
  for (let i = 0; i < 9; i++) {
    const g = yinYang === '阳'
      ? ((ju - 1 + i) % 9) + 1
      : ((ju - 1 - i + 90) % 9) + 1;
    gongQiyi[g] = QIYI[i];
  }
  // xếp 9 cung
  const pan = [];
  for (let g = 1; g <= 9; g++) {
    const qy = gongQiyi[g];
    const star = GONG_STAR[g];
    const door = DOOR_AT[g] || (g === 5 ? '(trung)' : '');
    const isCat = JI_DOOR.includes(door) && ['丁', '丙', '乙'].includes(qy);
    pan.push({ gong: g, dir: GONG_DIR[g], qiyi: qy, star, starVi: STAR_VI[star] || '', door, doorVi: DOOR_VI[door] || '', isCat });
  }
  // 吉格: các cung cát
  const gige = pan.filter((p) => p.isCat).map((p) => `${p.dir} — ${p.door}门 + ${p.qiyi}奇 + ${p.star}`);
  const advice = gige.length
    ? `Hướng CÁT dùng sự (吉门+三奇): ${gige.join(' | ')}. Nên tiến hành việc lớn hướng này.`
    : `Cục không có cung "吉门+三奇" trùng → tránh tiến thủ lớn; chọn cung có 吉门 (开/休/生) tạm.`;
  return { term, yuan: YUAN_VI[yuanIdx], yinYang, ju, pan, gige, advice, note: '局盘静盘 (时辰天盘飞旋 + 置闰 tinh tế = bước cải tiến sau).' };
}

export { TERM_JU, QIYI, GONG_STAR, DOOR_AT, GONG_DIR, BASHEN_VI, STAR_INFO, DOOR_INFO };

// ============================================================================
//  天盘三奇六仪 (Heavenly Plate) — 转盘法 [cycle 60 ADD]
//  Canon: "天盘直符随时干走 (阳顺阴逆)". 旬首六仪(戊) → 转到 时干落宫; 天盘九干
// 随之刚体旋转. Equivalent 公式法 (数字奇门):
//    阳遁: 天盘奇仪数 = 天盘星对应数 − 局数 + 1   (星对应数 = 该星本位宫数)
//    阴遁: 天盘奇仪数 = 局数 − 天盘星对应数 + 1   (若 <1 则 +9)
//  九干数: 1戊 2己 3庚 4辛 5壬 6癸 7丁 8丙 9乙
//  Nguồn: 知乎专栏/p/682589067, 博客园数字奇门完整教程, ctext《奇门法竅》.
// ============================================================================
// 7 cát cách 天/地/人/神/鬼/风/云遁 (kinh điển) — cần 天盘奇 + 地盘仪 + cát môn
//   天遁: 丙(天) + 戊(地) 临开/休/生吉门
//   地遁: 乙(天) + 己(地) 临吉门
//   人遁: 丁(天) + 太阴神 + 吉门  (神盘 yêu cầu — nếu thiếu thì 2/3 yếu tố)
//   神遁: 丙(天) + 九天神 + 吉门
//   鬼遁: 乙(天) + 九地神 + 吉门  (có bản: 丁+九地)
//   风遁: 乙(天) + 巽4 cung (hoặc 丙+巽) + 吉门
//   云遁: 乙(天) + 乾6 cung + 吉门  (có bản: 六合+辛)
// 凶格: 击刑 (thiên hình), 入墓 (nhập mộ), 空亡 (không vong — cầntruè thời)
// Nguồn: 福山堂, 奇门法竅, 知乎奇门吉格总表.
const SANQI = ['丁', '丙', '乙']; // 三奇 (cần cho cát cách)
const JI_GE = { // key → { tian (天盘奇), di (地盘仪), note }
  tianDun:  { name: '天遁', vi: 'Thiên Độn', tian: '丙', di: '戊', note: 'Cô/sĩ đạt đạo, sự nghiệp hiển hách' },
  diDun:    { name: '地遁', vi: 'Địa Độn', tian: '乙', di: '己', note: 'Tài lộc, điền sản, ẩn náu an toàn' },
  renDun:   { name: '人遁', vi: 'Nhân Độn', tian: '丁', shen: '太阴', note: 'Mưu lược, ngoại giao, hôn nhân êm ả' },
  shenDun:  { name: '神遁', vi: 'Thần Độn', tian: '丙', shen: '九天', note: 'Thần linh phù hộ, xuất quân/khai trương' },
  guiDun:   { name: '鬼遁', vi: 'Quỷ Độn', tian: '丁', shen: '九地', note: 'Trừ tà, yếm kỵ, ẩn nấp bí mật' },
  fengDun:  { name: '风遁', vi: 'Phong Độn', tian: '乙', gong: 4, note: 'Giao tiếp, du lịch, truyền tin (cung Tốn)' },
  yunDun:   { name: '云遁', vi: 'Vân Độn', tian: '乙', gong: 6, note: 'Cầu mưa, ẩn mình, thủ nghiệp (cung Càn)' },
};
// 凶格 (đơn giản hoá — không cần đầy đủ 80+ hung cách)
const XIONG_GE = [
  { name: '入墓', vi: 'Nhập Mộ', test: (p) => { // 三奇入墓: 乙@坤2(未墓)/乾6; 丙@乾6; 丁@艮8(丑墓)/坤2
    const t = p.tianQiyi, g = p.gong;
    if (t === '乙' && (g === 2 || g === 6)) return '乙奇 nhập mộ';
    if (t === '丙' && g === 6) return '丙奇 nhập mộ';
    if (t === '丁' && (g === 8 || g === 2)) return '丁奇 nhập mộ';
    return null;
  }, note: 'Sao cát bị chôn vùi — sức lực giảm' },
  { name: '击刑', vi: 'Kích Hình', test: (p) => { // 六仪 tự hình: 戊@震3, 己@坤2, 庚@艮8, 辛@离9, 壬@巽4, 癸@巽4 (天刑位)
    //   [loop 24 sửa] 壬(甲辰) 辰辰自刑 → 巽4 (KHÔ phải 坎1). 癸(甲寅) 寅刑巳 →巽4. 口诀 «壬癸同入巽四宫».
    const t = p.tianQiyi, g = p.gong;
    const xingMap = { 戊: 3, 己: 2, 庚: 8, 辛: 9, 壬: 4, 癸: 4 };
    if (xingMap[t] === g) return `${t} @cung${g} thiên hình`;
    return null;
  }, note: 'Mâu thuẫn nội bộ, pháp luật, tổn thương' },
  { name: '门迫', vi: 'Môn Phách', test: (p) => { // [loop 1089] 吉门 bị cung khắc: «吉门受宫克为迫»
    const d = p.door, g = p.gong;
    if (!d || !JI_DOOR.includes(d)) return null; // chỉ 吉门 (cát lực bị triệt)
    const dw = DOOR_WX[d], gw = GONG_WX[g];
    if (gw && dw && _WX_KE[gw] === dw) return `${d}门(${dw}) ở cung${g}(${gw}) → cung khắc门`;
    return null;
  }, note: '«吉门受宫克为迫, 吉事不吉» — cửa tốt bị cung khắc, cát lực giảm/khó thành' },
];

/**
 * Tính 天盘三奇六仪 cho 9 cung (转盘法). Trả về map gong -> 天盘奇仪.
 * Nguyên lý: 戊 (旬首六仪 / 遁甲 bến đầu) quay đến cung 时干 rơi xuống; 8 cung còn lại
 * đi theo chu trình 阳 顺 / 阴 逆. (Tương đương 公式法 — đã cross-check.)
 */
function tianQiyiRotation(yinYang, ju, tgGong) {
  const out = {};
  // 阳遁: 戊@tgGong, đi 1→2→3→... theo 宫序 (1-9 cyclic, skip? KHÔNG — 转盘 dùng洛书顺序 1..9 cyclic)
  //   QIYI = [戊,己,庚,辛,壬,癸,丁,丙,乙]; 阳顺 thì cung kế = (g mod 9)+1
  // 阴遁: 戊@tgGong, đi nghịch cung序: cung kế = ((g-1-1+9) mod 9)+1
  let g = tgGong;
  for (let i = 0; i < 9; i++) {
    out[g] = QIYI[i];
    g = yinYang === '阳' ? (g % 9) + 1 : ((g - 1 - 1 + 9) % 9) + 1;
  }
  return out;
}

// ---- 旬首 → 六仪 (六甲遁干) ----
const XUN_YI = ['戊', '己', '庚', '辛', '壬', '癸']; // 甲子/甲戌/甲申/甲午/甲辰/甲寅
const XUN_NAME = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
// 八神 thứ tự
const BASHEN = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
// [loop 1204] 八神 类象 (知乎/网易 «奇门遁甲八神详解») — ý nghĩa thần盘, bổ cho BASHEN (trước đây chỉ có list).
const BASHEN_VI = {
  值符: { vi: 'Trực Phù', tone: 'cat', wx: 'thổ', desc: '«bát thần chi thủ», 天乙贵人 (thiên ất quý nhân) — quý nhân phò, quyền uy, lãnh đạo, quan quý, danh nhân' },
  螣蛇: { vi: 'Đằng Xà', tone: 'hung', wx: 'hỏa', desc: 'hư kinh, quái dị, quấn quýt (纏繞), biến hoá, giảo trá; ác mộng, tinh thần bất an' },
  太阴: { vi: 'Thái Âm', tone: 'cat', wx: 'kim', desc: 'ẩn mật, nhu hoà, phúc hộ, tinh xảo; ám trung tương trợ, thâm mưu, mưu lược' },
  六合: { vi: 'Lục Hợp', tone: 'cat', wx: 'mộc', desc: 'hoà hợp, liên hợp, hôn nhân, giao dịch, trung gian/môi giới' },
  白虎: { vi: 'Bạch Hổ', tone: 'hung', wx: 'kim', desc: 'đại hung — 血光之灾 (huyết quang), thương tai, uy quyền, quan phi, tang sự, đấu tranh' },
  玄武: { vi: 'Huyền Vũ', tone: 'hung', wx: 'thủy', desc: 'ám muội, đạo tặc, khiếm trá, sắc dục, khẩu thiệt thị phi' },
  九地: { vi: 'Cửu Địa', tone: 'mid', wx: 'thổ', desc: 'thổ ổn hậu thực, ẩn giấu, bảo thủ; phòng thủ, mai phục, kiên cố, chậm' },
  九天: { vi: 'Cửu Thiên', tone: 'cat', wx: 'kim', desc: 'cao xa, khai khoát, trương dương, tiến thủ, viễn hành, uy vũ' },
};
const GONG_DOOR = { 1: '休', 2: '死', 3: '伤', 4: '杜', 6: '开', 7: '惊', 8: '生', 9: '景' };

// 60甲子 → (旬index)
const GAN10 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
function seq60(gan, zhi) { const gi = GAN10.indexOf(gan), zi = ZHI12.indexOf(zhi); if (gi < 0 || zi < 0) return -1; let s = 0; for (let k = 0; k < 60; k++) { if (GAN10[k % 10] === gan && ZHI12[k % 12] === zhi) { s = k + 1; break; } } return s; }

/**
 * 动盘: thêm tầng thời-động (旬首→值符/值使 + 值符随时干 + 八神) lên静盘.
 */
export function qimenDongPan(year, month, day, hour) {
  // [loop 552 FIX] hour || 12 nuốt giờ Tý (hour=0 → 12=午). Dùng == null check.
  const _h = hour == null ? 12 : hour;
  const base = qimenPan(year, month, day, _h);
  const solar = Solar.fromYmdHms(year, month, day, _h, 0, 0);
  const lunar = solar.getLunar();
  const hGan = lunar.getTimeGan(), hZhi = lunar.getTimeZhi();
  const seq = seq60(hGan, hZhi);
  const xunIdx = seq > 0 ? Math.floor((seq - 1) / 10) : 0;
  const xunYi = XUN_YI[xunIdx];
  const xunName = XUN_NAME[xunIdx];
  // 旬首六仪 ở地盘 nào → 值符星 (本位星 of cung) + 值使门
  const xunGong = base.pan.find((p) => p.qiyi === xunYi)?.gong;
  // [loop 24 sửa] 中宫(5) không có cửa/sao riêng → 寄坤2 (cùng convention 八神 line 202).
  //   Trước đây xunGong===5 → zhiFuStar/zhiShiDoor undefined (vd 阳遁1局 甲辰时 壬@中宫5).
  const xunGongResolved = xunGong === 5 ? 2 : xunGong;
  const zhiFuStar = GONG_STAR[xunGongResolved];
  const zhiShiDoor = GONG_DOOR[xunGongResolved];
  // 时干 ở地盘 nào → 值符随时干落 đây
  const tg = (hGan === '甲') ? xunYi : hGan; // 甲 ẩn → dùng 六仪旬首
  const tgGong = base.pan.find((p) => p.qiyi === tg)?.gong;
  // 值使随时支: từ cung 值使 (zhiShi原宫本位) 飞泊 theo 时支序, 阳/阴
  const hZhiIdx = ZHI12.indexOf(hZhi) + 1; // 1..12
  const step = hZhiIdx;
  let zhiShiLanding = zhiShiDoor ? Object.keys(GONG_DOOR).find((g) => GONG_DOOR[g] === zhiShiDoor) : null;
  if (zhiShiLanding) {
    zhiShiLanding = +zhiShiLanding;
    // [loop 24 sửa off-by-one] 旬首宫 chính là vị trí 子 (0 bước). 时支 index k → đi k−1 bước.
    //   Vd 阳遁1局 丁卯时 休门 đến 巽4 (code cũ đi `step` bước → dư 1, ra 5/sai).
    for (let i = 0; i < step - 1; i++) {
      zhiShiLanding = base.yinYang === '阳' ? (zhiShiLanding % 9) + 1 : ((zhiShiLanding - 1 - 1 + 9) % 9) + 1;
    }
  }
  // [cycle 60] 天盘三奇六仪 (转盘法) — 戊随时干转, 阳 顺 / 阴 逆
  const tgGongSafe = tgGong || base.ju; // [loop 24 sửa] fallback base.ju (ju không trong scope qimenDongPan)
  const tianMap = tianQiyiRotation(base.yinYang, base.ju, tgGongSafe);
  const panTian = base.pan.map((p) => ({ ...p, tianQiyi: tianMap[p.gong] || p.qiyi }));

  // [loop 556 ELEVATION] 八门 动盘 (转盘法) — trước đây panTian.giữ door TĨNH (BUG 2 loop 552).
  //   Nay xoay vòng cửa theo洛书 [1,8,3,4,9,2,7,6] (bỏ 5) sao cho 值使 (zhiShiDoor) đáp
  //   đúng zhiShiLanding, các cửa khác theo thứ tự tự nhiên. Nguồn: 奇门遁甲统宗 (wikisource).
  //   ⚠ 奇门 có nhiều trường phái (转盘/飞盘, 寄坤/寄艮) — đây là 转盘洛书 phổ biến.
  const LUO_SHU_8 = [1, 8, 3, 4, 9, 2, 7, 6];
  const doorAtGong = {};
  if (zhiShiDoor && zhiShiLanding) {
    let land = zhiShiLanding === 5 ? 2 : zhiShiLanding; // 中宫无门 → 寄坤2
    const orig = xunGongResolved; // 值使原宫 (旬首宫, 5→2 đã resolve)
    const oi = LUO_SHU_8.indexOf(orig), li = LUO_SHU_8.indexOf(land);
    if (oi >= 0 && li >= 0) {
      const delta = (li - oi + 8) % 8; // xoay thuận;  âm遁 landing đã nghịch nên delta tự điều chỉnh
      for (let i = 0; i < 8; i++) doorAtGong[LUO_SHU_8[(i + delta) % 8]] = GONG_DOOR[LUO_SHU_8[i]];
    }
  }
  // áp door động (giữ door tĩnh làm fallback nếu chưa tính được)
  for (const p of panTian) if (doorAtGong[p.gong]) p.door = doorAtGong[p.gong];

  // 八神落宫 (转盘): 小值符随大值符星落, 阳 顺时针 / 阴 逆时针
  //   BASHEN = [值符,螣蛇,太阴,六合,白虎,玄武,九地,九天] (天禽寄, 中宫跳)
  //   转盘顺序 theo洛书 "戴九覆一": 1→8→3→4→9→2→7→6 (cung có sao) — 阳顺 / 阴逆
  const LUO_SHU_ORDER = [1, 8, 3, 4, 9, 2, 7, 6]; // 8 cung ngoài (bỏ 5)
  const shenAtGong = {};
  const order = base.yinYang === '阳' ? LUO_SHU_ORDER : [...LUO_SHU_ORDER].reverse();
  // tìm vị trí của tgGong trong order; nếu tgGong=5 thì 寄 2 (坤) — 天禽寄坤
  let startG = (tgGongSafe === 5) ? 2 : tgGongSafe;
  let idx = order.indexOf(startG);
  if (idx < 0) idx = 0;
  for (let k = 0; k < BASHEN.length; k++) {
    shenAtGong[order[(idx + k) % 8]] = BASHEN[k];
  }

  // 吉格 / 凶格 detection (cần 天盘 + 地盘 + 门 + 神)
  const catGe = [], xiongGe = [];
  for (const p of panTian) {
    const tian = p.tianQiyi, di = p.qiyi, door = p.door, shen = shenAtGong[p.gong];
    const jiDoorHit = JI_DOOR.includes(door);
    for (const [key, rule] of Object.entries(JI_GE)) {
      let hit = false;
      if (rule.tian && tian !== rule.tian) continue;
      if (rule.di && di !== rule.di) continue;
      if (rule.gong && p.gong !== rule.gong) continue;
      if (rule.shen) {
        // 人遁/神遁/鬼遁 cần cả 八神 + 吉门; nếu thiếu神盘 xác định thì giảm yêu cầu
        if (shen !== rule.shen) continue;
      }
      // mọi cát cách cần 吉门 临 (trừ 风遁/云遁 có bản yêu cầu, vẫn ưu tiên吉门)
      if (!jiDoorHit) continue;
      hit = true;
      if (hit) catGe.push({ key, name: rule.name, vi: rule.vi, gong: p.gong, dir: p.dir, note: rule.note, combo: `${tian}(天)+${di}(地)+${door}门${shen ? '+' + shen : ''}` });
    }
    for (const xrule of XIONG_GE) {
      const r = xrule.test(p);
      if (r) xiongGe.push({ name: xrule.name, vi: xrule.vi, gong: p.gong, dir: p.dir, detail: r, note: xrule.note });
    }
  }

  // 直符(神)落 = 值符星天盘落 (随时干) = tgGong
  return {
    ...base,
    pan: panTian, // ghi đè: pan giờ có thêm tianQiyi
    tian: tianMap, // raw map gong -> 天盘奇仪 (cho verify)
    shenAtGong,
    catGe, xiongGe,
    dong: {
      hourGanZhi: hGan + hZhi, xunName, xunYi, xunGong,
      zhiFuStar, zhiFuStarVi: STAR_VI[zhiFuStar] || '',
      zhiShiDoor, zhiShiDoorVi: DOOR_VI[zhiShiDoor] || '',
      shiGan: hGan, shiGanGong: tgGong,
      zhiFuLanding: tgGong, // 值符随时干
      zhiShiLanding,
      zhiFuShenLanding: tgGong, // 直符(神)随值符星
      bashen: BASHEN,
    },
  };
}

