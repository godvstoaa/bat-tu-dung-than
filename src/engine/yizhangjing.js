// ============================================================================
//  一掌经 YIZHANGJING (DĀ-MỘT CHỪNG KINH / 达摩一掌经)
//  Bói toán Phật giáo cổ — Đường dynasty — duy nhất có góc nhìn "tiền thế /
//  hậu thế" (luân hồi lục đạo) trong app. Lấy 4 cung (年/月/日/时) từ chi năm
//  sinh + tháng/ngày/giờ âm lịch + giới tính, đếm trên 12 vị trí ngón tay.
//
//  TÁC GIẢ (THẬT — phải footnote): 一行禅师 Yixing (683–727), cao tăng Đường,
//  thiên văn học gia. "达摩" (Bồ-đề-đạt-mạt) là GÁN NHẦM dân gian hậu kỳ — không
//  có cơ sở học thuật. CBETA 续藏经 X59n1043 《看命一掌金》 mới là bản cổ реально
// 留存. App dùng tên 一掌经 (không "达摩") và footnote rõ sự gán nhầm.
//
//  NGUỒN (đã đối chiếu):
//   - CBETA 卍续藏 X59n1043 《看命一掌金》 (buddhism.lib.ntu.edu.tw).
//   - 中国哲学书电子化计划 ctext.org 《神機妙算一掌經》 (chương 457965).
//   - 知乎专栏: zhuanlan.zhihu.com/p/683544998 (thuật toán 年上起月…).
//   - 知乎专栏: zhuanlan.zhihu.com/p/673794646 (lục đạo + case).
//
//  THUẬT TOÁN (cổ pháp đồng thuận):
//   1) Đặt 年支 lên vị trí xuất phát (cung chi năm sinh).
//   2) 年上起月: từ cung năm, đếm số = THÁNG âm → cung tháng.
//   3) 月上起日: từ cung tháng, đếm số = NGÀY âm → cung ngày.
//   4) 日上起时: từ cung ngày, đếm số = CHI GIỜ (1..12, 子=1) → cung giờ.
//   Quy ước đếm: BƯỚC ĐẦU trùng cung xuất phát (như 小六壬):
//        pos = (start + n - 1) mod 12  (nam thuận / ZHI_ORDER thuận)
//        pos = (start - (n - 1)) mod 12 (nữ nghịch)
//   5) 4 cung (年/月/日/时) → 4 星宫 + luận giải. Cổ thư nhấn mạnh "以时为主"
//      (cung giờ là chủ), 年/月/日 là trợ → app đánh dấu 时宫 làm "mệnh cung".
//
//  12 星宫 (theo địa chi thuận tự — đối chiếu 3 nguồn trên, KHÔNG có tranh chấp):
//   子=天贵(Thượng) 丑=天厄(Hạ)  寅=天权(Thượng) 卯=天破(Hạ)
//   辰=天奸(Hạ)     巳=天文(Trung) 午=天福(Thượng) 未=天驿(Trung)
//   申=天孤(Hạ)     酉=天刃(Trung) 戌=天艺(Trung) 亥=天寿(Thượng)
//   Phân phẩm: Thượng(天贵/天权/天福/天寿) · Trung(天文/天驿/天刃/天艺)
//              · Hạ(天厄/天破/天奸/天孤).
//
//  LỤC ĐẠO (佛/仙/人/修罗/畜生/鬼): mapping từ 星宫 — CÓ cơ sở (知乎 + 安迪哥
//  + vocus), nhưng CỔ THƯ GỐC (X1043/ctext) không liệt bảng tĩnh rõ ràng, các
//  nguồn dân gian hơi khác nhau ở ranh giới 修罗/人. App dùng bảng phổ thông nhất
//  (khớp 知乎 王镜海 + vocus) nhưng ĐÁNH DẤU `liudaoDisputed:true` để lộ giới hạn.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI_ORDER } from './constants.js';

// ---- 12 星宫 theo thứ tự ZHI_ORDER (子→亥) -----------------------------------
// tone: 'cat' (Thượng/cát) | 'mid' (Trung/bình) | 'hung' (Hạ/hung).
const STARS = [
  // 子
  { zhi: '子', starZh: '天贵', starVi: 'Thiên Quý', tone: 'cat', grade: 'Thượng phẩm',
    meaning: 'Chủ phú quý, nhân đức, uy quyền. Người đức độ, được quý nhân phù, dễ đạt danh lợi chính đáng.',
    destiny: 'Mệnh cung Thiên Quý → tiền thế gieo nhân lành, đời này phước đức đủ, gần quyền quý, đường công danh thuận.' },
  // 丑
  { zhi: '丑', starZh: '天厄', starVi: 'Thiên N厄', tone: 'hung', grade: 'Hạ phẩm',
    meaning: 'Chủ先苦 hậu ngọt, ám tật, ly tổ phát đạt. Tiền vận nhọc, trung/ hậu vận mới khá.',
    destiny: 'Mệnh cung Thiên N厄 → tiền thế mang nợ/tạo nghiệp nhẹ, đời này phải trải nghiệm gian truân để trả, sau mới hưởng.' },
  // 寅
  { zhi: '寅', starZh: '天权', starVi: 'Thiên Quyền', tone: 'cat', grade: 'Thượng phẩm',
    meaning: 'Chủ nắm quyền, cương cường, mưu lược. Người quyết đoán, hợp lãnh đạo, nắm thực quyền.',
    destiny: 'Mệnh cung Thiên Quyền → tiền thế tích đức về uy, đời này có tài quản trị, nên nắm quyền tránh nhượng bộ.' },
  // 卯
  { zhi: '卯', starZh: '天破', starVi: 'Thiên Phá', tone: 'hung', grade: 'Hạ phẩm',
    meaning: 'Chủ phá hao, lo toan, tiền đến tiền đi. Dễ hao tài, cần kiềm chế chi tiêu/đầu cơ.',
    destiny: 'Mệnh cung Thiên Phá → tiền thế hoang phí/phá của, đời này tài lộc dễ tuột, phải học tiết kiệm, giữ kho.' },
  // 辰
  { zhi: '辰', starZh: '天奸', starVi: 'Thiên Gian', tone: 'hung', grade: 'Hạ phẩm',
    meaning: 'Chủ tâm cơ sâu, cơ biến đa mưu. Dễ tính toán quá mức, cần dùng mưu cho chính đạo.',
    destiny: 'Mệnh cung Thiên Gian → tiền thế xảo trá/gian trá, đời này thông minh nhưng dễ bị cám dỗ lợi dụng — nên tu chính.' },
  // 巳
  { zhi: '巳', starZh: '天文', starVi: 'Thiên Văn', tone: 'mid', grade: 'Trung phẩm',
    meaning: 'Chủ thông minh hiếu học, văn tài xuất chúng. Hợp nghề văn, giáo, nghiên cứu, nghệ thuật.',
    destiny: 'Mệnh cung Thiên Văn → tiền thế tu học/khoa cử, đời này thông minh, nên phát triển văn hóa/trí tuệ.' },
  // 午
  { zhi: '午', starZh: '天福', starVi: 'Thiên Phúc', tone: 'cat', grade: 'Thượng phẩm',
    meaning: 'Chủ phúc thọ, cả đời gần quý, y lộc tự nhiên. Phước báo dày, ít phải lo cơm áo.',
    destiny: 'Mệnh cung Thiên Phúc → tiền thế tích phước lớn, đời này y lộc đầy đủ, nên tiếp tục gieo thiện để duy trì.' },
  // 未
  { zhi: '未', starZh: '天驿', starVi: 'Thiên Dịch', tone: 'mid', grade: 'Trung phẩm',
    meaning: 'Chủ bôn ba lao lực, ly hương bối tỉnh. Đời xê dịch, xa nhà, hợp nghề đi lại/xuất ngoại.',
    destiny: 'Mệnh cung Thiên Dịch → tiền thế du phương/hành cước, đời này bôn ba, nên chọn nghề di động để hợp mệnh.' },
  // 申
  { zhi: '申', starZh: '天孤', starVi: 'Thiên Cô', tone: 'hung', grade: 'Hạ phẩm',
    meaning: 'Chủ cô độc, lục thân duyên bạc. Khó dựa người thân, phải tự lập, cần nuôi quan hệ.',
    destiny: 'Mệnh cung Thiên Cô → tiền thế cô lập/khérác người thân, đời này duyên bạc, nên chủ động xây tình cảm.' },
  // 酉
  { zhi: '酉', starZh: '天刃', starVi: 'Thiên Nhận', tone: 'mid', grade: 'Trung phẩm',
    meaning: 'Chủ cương cường háo đấu, dễ hình thương. Tính cương, dễ tổn thương, cần học nhẫn.',
    destiny: 'Mệnh cung Thiên Nhận → tiền thế sát/kiếm, đời này cương quá dễ gãy, nên rèn từ bi, tránh xung đột.' },
  // 戌
  { zhi: '戌', starZh: '天艺', starVi: 'Thiên Nghệ', tone: 'mid', grade: 'Trung phẩm',
    meaning: 'Chủ tâm linh thủ xảo, đa tài đa nghệ. Hợp nghề thủ công, kỹ thuật, nghệ thuật chuyên môn.',
    destiny: 'Mệnh cung Thiên Nghệ → tiền thế rèn nghề/thủ công, đời này khéo tay đa tài, nên theo nghề chuyên môn.' },
  // 亥
  { zhi: '亥', starZh: '天寿', starVi: 'Thiên Thọ', tone: 'cat', grade: 'Thượng phẩm',
    meaning: 'Chủ trường thọ an ổn, hậu đạo. Sống lâu, an nhiên, đức độ, hợp người trầm tĩnh.',
    destiny: 'Mệnh cung Thiên Thọ → tiền thế tu thọ/giữ mạng, đời này thọ an, nên dưỡng sinh, tích đức để trường thọ.' },
];
// Bỏ lỗi gõ: sửa Thiên N厄 → Thiên Nếch (đọc Nếch/E). Dùng starVi chuẩn.
STARS[1].starVi = 'Thiên Nếch';

const ZHI2STAR = Object.fromEntries(STARS.map((s) => [s.zhi, s]));

// ---- LỤC ĐẠO mapping (theo 星宫) ---------------------------------------------
// Nguồn: 知乎 王镜海 (zhuanlan.zhihu.com/p/673794646) + vocus 一掌经 + 安迪哥.
// LƯU Ý QUAN TRỌNG: Bảng này là PHỔ THÔNG DÂN GIAN — cổ thư X1043/ctext không
// liệt bảng lục đạo tĩnh chuẩn; ranh giới 修罗↔人 một số nguồn khác biệt. Do đó
// đánh dấu liudaoDisputed=true. Mệnh cung (时宫) quyết định "đạo" chính.
const STAR2LIUDAO = {
  天福: { dao: 'Phật đạo', daoVi: 'Phật đạo (佛)', upper: true,
    note: 'Phước đức dày, tu Phật duyên, từ bi hỷ xả, dễ quy y/giác ngộ.' },
  天贵: { dao: 'Phật đạo', daoVi: 'Phật đạo (佛)', upper: true,
    note: 'Quý khí nhân đức, gần đạo giác ngộ, nên tu tâm từ.' },
  天寿: { dao: 'Tiên đạo', daoVi: 'Tiên đạo (仙)', upper: true,
    note: 'Trường thọ an nhiên, duyên tu tiên/dưỡng sinh, hợp thanh tu.' },
  天文: { dao: 'Tiên đạo', daoVi: 'Tiên đạo (仙)', upper: true,
    note: 'Thông minh hiếu học, duyên văn hóa/đạo lý, hợp nghiên cứu kinh.' },
  天权: { dao: 'Nhân đạo', daoVi: 'Nhân đạo (人)', upper: true,
    note: 'Cương quyết nắm quyền, đạo làm người chủ động, hợp lãnh đạo.' },
  天孤: { dao: 'Nhân đạo', daoVi: 'Nhân đạo (人)', upper: true,
    note: 'Cô độc tự lập, đạo làm người rèn ý chí, cần kết thiện duyên.' },
  天奸: { dao: 'A-tu-la đạo', daoVi: 'A-tu-la đạo (修罗)', upper: false,
    note: 'Tâm cơ tranh đấu, đạo tu-la hay tranh hơn thua, cần tu nhẫn.' },
  天艺: { dao: 'A-tu-la đạo', daoVi: 'A-tu-la đạo (修罗)', upper: false,
    note: 'Đa tài nhưng dễ kiêu, đạo tu-la đa năng, cần khiêm.' },
  天刃: { dao: 'Súc sinh đạo', daoVi: 'Bàng sinh đạo (畜生)', upper: false,
    note: 'Cương hảo đấu sát, đạo bàng sinh bản năng mạnh, cần tu từ.' },
  天破: { dao: 'Súc sinh đạo', daoVi: 'Bàng sinh đạo (畜生)', upper: false,
    note: 'Phá hoại hoang phí, đạo bàng sinh dễ buông thả, cần tiết độ.' },
  天驿: { dao: 'Quỷ đạo', daoVi: 'Ngạ quỷ đạo (鬼)', upper: false,
    note: 'Bôn ba đói khát, đạo ngạ quỷ khao khát, nên bố thí/tu phước.' },
  天厄: { dao: 'Quỷ đạo', daoVi: 'Ngạ quỷ đạo (鬼)', upper: false,
    note: 'Ám tật gian truân, đạo ngạ quỷ trả nghiệp, nên sám nghiệp/tu.' },
};

// ---- Helpers ----------------------------------------------------------------
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const mod12 = (n) => ((n % 12) + 12) % 12;

function isMale(g) {
  const s = String(g || '').toLowerCase().trim();
  return s === 'nam' || s === 'male' || s === 'm' || s === 'nam nhi' || s === '男';
}

/**
 * Đổi dương lịch → âm lịch + 地支时. Theo convention của app (như xiaoliuren.js).
 * Trả về { lYear, lMonth, lDay, hourZhi, hourNum (1..12, 子=1), label }.
 */
function solarToLunar(year, month, day, hour) {
  const h = Number.isFinite(hour) ? clamp(hour, 0, 23) : 12;
  const s = Solar.fromYmdHms(year, month, day, h, 0, 0);
  const l = s.getLunar();
  const hourZhi = l.getTimeZhi(); // 子…亥
  const hourNum = '子丑寅卯辰巳午未申酉戌亥'.indexOf(hourZhi) + 1;
  return {
    lYear: l.getYear(),
    lMonth: l.getMonth(),
    lDay: l.getDay(),
    hourZhi,
    hourNum,
    label: `${l.getMonthInChinese()}月${l.getDayInChinese()}日 ${hourZhi}时`,
  };
}

/**
 * Lấy 年支 từ năm (can-chi). lunar-javascript: Lunar.getYearInGanZhi() → vd "甲子".
 */
function yearZhiOf(year) {
  const s = Solar.fromYmdHms(year, 6, 1, 12, 0, 0); // giữa năm cho an toàn
  const zhi = s.getLunar().getYearZhi(); // 子…亥
  return zhi;
}

/**
 * Đếm trên 12 cung. start: index trong ZHI_ORDER. n: số bước (1-indexed,
 * bước đầu trùng start — theo convention 小六壬). forward=true (nam) | false (nữ).
 */
function walk(start, n, forward) {
  const steps = clamp(parseInt(n, 10) || 1, 1, 12);
  const off = steps - 1;
  return mod12(forward ? start + off : start - off);
}

// ---- API chính --------------------------------------------------------------
/**
 * 一掌经 — bói 4 cung từ thông tin sinh (DƯƠNG lịch) + giới tính.
 * @param {number} year  năm dương
 * @param {number} month tháng dương (1-12)
 * @param {number} day   ngày dương (1-31)
 * @param {number} hour  giờ dương 0-23 (sẽ chuyển sang chi giờ)
 * @param {string} gender 'nam'/'nữ'/'male'/'female'
 * @returns {{
 *   ok:boolean,
 *   input:{year,month,day,hour,gender},
 *   lunar:{lYear,lMonth,lDay,hourZhi,hourNum,label,yearZhi},
 *   isMale:boolean, direction:'forward'|'backward',
 *   positions:[{role,zhi,idx,starZh,starVi,tone,grade,meaning,destiny}],
 *   minggong:object,          // = positions[3] (cung giờ, mệnh cung)
 *   liudao:object|null,       // mapping từ mệnh cung (có thể null nếu disputed-only)
 *   liudaoDisputed:boolean,
 *   summary:string,
 *   note:string,
 * }}
 */
export function yizhangjing(year, month, day, hour, gender) {
  const out = { ok: false };
  try {
    const y = parseInt(year, 10);
    const mo = clamp(parseInt(month, 10) || 1, 1, 12);
    const d = clamp(parseInt(day, 10) || 1, 1, 31);
    const h = Number.isFinite(+hour) ? clamp(parseInt(hour, 10), 0, 23) : 12;
    const male = isMale(gender);

    const lunar = solarToLunar(y, mo, d, h);
    const yearZhi = yearZhiOf(y);
    const yearIdx = ZHI_ORDER.indexOf(yearZhi);
    if (yearIdx < 0) throw new Error('không xác định được 年支: ' + yearZhi);

    const forward = male; // 男顺女逆
    const lm = clamp(lunar.lMonth, 1, 12);
    const ld = clamp(lunar.lDay, 1, 30);
    const lh = clamp(lunar.hourNum, 1, 12);

    // 年上起月 → 月上起日 → 日上起时
    const monthIdx = walk(yearIdx, lm, forward);
    const dayIdx = walk(monthIdx, ld, forward);
    const hourIdx = walk(dayIdx, lh, forward);

    const mkPos = (role, idx) => {
      const zhi = ZHI_ORDER[idx];
      const star = ZHI2STAR[zhi];
      return {
        role, zhi, idx,
        starZh: star.starZh, starVi: star.starVi,
        tone: star.tone, grade: star.grade,
        meaning: star.meaning, destiny: star.destiny,
      };
    };
    const positions = [
      mkPos('年宫 (cung năm)', yearIdx),
      mkPos('月宫 (cung tháng)', monthIdx),
      mkPos('日宫 (cung ngày)', dayIdx),
      mkPos('时宫 (cung giờ)', hourIdx),
    ];

    const minggong = positions[3]; // 以时为主

    // Lục đạo — từ mệnh cung (时宫). Đánh dấu disputed.
    const liudaoMap = STAR2LIUDAO[minggong.starZh] || null;
    const liudaoDisputed = true; // bảng phổ thông, không phải cổ thư gốc tĩnh
    const liudao = liudaoMap ? {
      dao: liudaoMap.dao, daoVi: liudaoMap.daoVi,
      upper: liudaoMap.upper, note: liudaoMap.note,
    } : null;

    // Đếm tone 4 cung → tổng luận
    const tones = positions.map((p) => p.tone);
    const cat = tones.filter((t) => t === 'cat').length;
    const hung = tones.filter((t) => t === 'hung').length;
    const upperDao = liudao && liudao.upper;

    let summary;
    const starList = positions.map((p) => `${p.starZh}(${p.zhi})`).join(' → ');
    summary = `4 cung: ${starList}. Mệnh cung (时) = ${minggong.starZh} ${minggong.zhi} — ${minggong.grade}, ${minggong.tone === 'cat' ? 'Cát' : minggong.tone === 'hung' ? 'Hung' : 'Bình'}.`;
    if (cat >= 3) summary += ` ${cat}/4 cung cát → phước báo dày, đường mệnh thuận.`;
    else if (hung >= 3) summary += ` ${hung}/4 cung hung → nhiều thử thách, cần tu tích.`;
    else summary += ` Cát hung xen kẽ — mệnh bình, hậu vận tuỳ phước.`;
    if (liudao) {
      summary += ` Lục đạo (theo mệnh cung): ${liudao.daoVi}${upperDao ? ' [thượng đạo]' : ' [hạ đạo]'} — ${liudao.note}`;
    }

    const note = '一掌经 — tác giả thật 一行禅师 (Yixing, Đường 683–727); "达摩" là gán nhầm dân gian hậu kỳ, không có cơ sở học thuật. Nguồn: CBETA 卍续藏 X59n1043 《看命一掌金》 + ctext 《神機妙算一掌經》. Lục đạo mapping theo bảng phổ thông (知乎/vocus), CỔ THƯ GỐC không liệt tĩnh → chỉ tham khảo.';

    Object.assign(out, {
      ok: true,
      input: { year: y, month: mo, day: d, hour: h, gender: String(gender || (male ? 'nam' : 'nữ')) },
      lunar: { ...lunar, yearZhi },
      isMale: male, direction: forward ? 'forward' : 'backward',
      positions, minggong, liudao, liudaoDisputed, summary, note,
    });
  } catch (e) {
    out.ok = false;
    out.error = e && e.message ? e.message : String(e);
  }
  return out;
}

/**
 * Convenience: nhận object `R` (chart) như các module khác (heluo, chenggu…).
 * Lấy input từ R.input.{year,month,day,hour,gender}.
 */
export function yizhangjingFromChart(R) {
  const chart = R && R.chart ? R.chart : R;
  const inp = (chart && chart.input) || (R && R.input) || {};
  return yizhangjing(inp.year, inp.month, inp.day, inp.hour, inp.gender);
}

// ---- HTML card helper (dùng ở main.js renderYizhangjing) --------------------
// Trả về HTML string; ta export để main.js gọi + bọc try/catch.
export function renderYizhangjingCard(result) {
  if (!result || !result.ok) {
    return '<p class="hint">Không tính được 一掌经.</p>';
  }
  const e = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r = result;
  const toneClass = (t) => (t === 'cat' ? 'rate-cat' : t === 'hung' ? 'rate-hung' : 'rate-mid');
  const toneLabel = (t) => (t === 'cat' ? 'Cát' : t === 'hung' ? 'Hung' : 'Bình');

  const posHtml = r.positions.map((p) => {
    const isMing = p.role.startsWith('时宫');
    return `<div class="cg-breakdown" style="${isMing ? 'background:rgba(255,193,7,.18);border-left:3px solid #ffc107;padding:2px 6px' : ''}">
      <b>${e(p.role)}</b> <span class="zh big">${e(p.zhi)}</span> → <b>${e(p.starZh)}</b> (${e(p.starVi)})
      <span class="ln-rate ${toneClass(p.tone)}"><b>${toneLabel(p.tone)}</b></span>
      <span class="hint-inline">${e(p.grade)}</span>
      <div class="hint">${e(p.meaning)}</div>
      ${isMing ? `<div class="cg-interp"><b>Mệnh cung:</b> ${e(p.destiny)}</div>` : ''}
    </div>`;
  }).join('');

  const dirVi = r.direction === 'forward' ? 'Nam thuận chiều' : 'Nữ nghịch chiều';
  const liudaoHtml = r.liudao
    ? `<p class="cg-interp"><b>Lục đạo (theo mệnh cung):</b> <span class="ln-rate ${r.liudao.upper ? 'rate-cat' : 'rate-hung'}"><b>${e(r.liudao.daoVi)}</b></span> ${r.liudao.upper ? '[thượng đạo — thiện đạo]' : '[hạ đạo — cần tu]'} — ${e(r.liudao.note)}</p>`
    : '';

  return `
    <p class="cg-breakdown hint">Sinh ${e(r.input.day)}/${e(r.input.month)}/${e(r.input.year)} giờ ${e(r.input.hour)}h (${e(r.input.gender)}) → âm lịch ${e(r.lunar.label)}, năm ${e(r.lunar.yearZhi)}. ${dirVi}. 男顺女逆 — đếm 年→月→日→时.</p>
    <div style="display:grid;gap:4px;margin:6px 0">${posHtml}</div>
    ${liudaoHtml}
    <p class="cg-interp"><b>Tổng luận:</b> ${e(r.summary)}</p>
    <p class="hint" style="margin-top:6px">${e(r.note)}</p>`;
}
