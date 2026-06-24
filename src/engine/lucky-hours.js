// ============================================================================
//  TRẠCH GIỜ LÀNH 择吉时 — 12 THỜI THÌN CÁT/HUNG mỗi ngày
//  Mỗi ngày 12 thìn (子→亥), tính theo 2 hệ:
//    (A) 建除十二直 (12 trực) — (hourZhi − dayZhi) mod 12. Hệ trực (xây/dỡ/mãn...).
//    (B) 十二黄黑道神 (12 黄道/黑道 thần) — 日起时法: 青龙 khởi từ giờ cố định theo 日支,
//        rồi thuận hành qua 12 thìn. 六黄道 (青龙/明堂/金匮/天德/玉堂/司命) = cát,
//        六黑道 (天刑/朱雀/白虎/天牢/玄武/勾陈) = hung.
//  [cycle 46 sửa CRITICAL] trước đây module này lấy trực 建除 rồi map sang 黄/黑 qua 1 bảng
//    BỊA (建≠黄道) → ~50% "giờ tốt/xấu" SAI, lan sang best-hour/AI brief/daily briefing.
//    Nay tính 黄黑道 thật (B), giữ 建除 (A) làm thông tin phụ. Verify 2026-06-24 巳日: ✓.
//  Nguồn: 通胜 黄黑道时, 青龙诀 «寅申从子上起，卯酉却在寅，辰戌还从辰，巳亥从午，
//    子午二日申，丑未戌上是黄道».
// ============================================================================
import { Solar } from 'lunar-javascript';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// (A) 建除十二直 — hệ trực (không phải黄道; chỉ thông tin phụ)
const OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_VI = { 建:'Kiến', 除:'Trừ', 满:'Mãn', 平:'Bình', 定:'Định', 执:'Chấp', 破:'Phá', 危:'Nguy', 成:'Thành', 收:'Thu', 开:'Khai', 闭:'Bế' };

// (B) 十二黄黑道神 — 12 thần theo thứ tự thuận (青 龙 khởi đầu)
const DEITIES = ['青龙', '明堂', '天刑', '朱雀', '金匮', '天德', '白虎', '玉堂', '天牢', '玄武', '司命', '勾陈'];
const DEITY_VI = {
  青龙: 'Thanh Long', 明堂: 'Minh Đường', 天刑: 'Thiên Hình', 朱雀: 'Chu Tước',
  金匮: 'Kim Quỹ', 天德: 'Thiên Đức', 白虎: 'Bạch Hổ', 玉堂: 'Ngọc Đường',
  天牢: 'Thiên Lao', 玄武: 'Huyền Vũ', 司命: 'Tư Mệnh', 勾陈: 'Câu Trần',
};
// 六黄道 (cát) vs 六黑道 (hung)
const YELLOW_DEITIES = new Set(['青龙', '明堂', '金匮', '天德', '玉堂', '司命']);

// 青龙 khởi tại giờ nào theo 日支 (cặp xung cùng khởi; khởi tiến 2 giờ/cặp: 子/寅/辰/午/申/戌)
// 诀: «寅申从子上起，卯酉却在寅，辰戌还从辰，巳亥从午，子午二日申，丑未戌上是黄道»
const QING_START = {
  寅: '子', 申: '子',
  卯: '寅', 酉: '寅',
  辰: '辰', 戌: '辰',
  巳: '午', 亥: '午',
  子: '申', 午: '申',
  丑: '戌', 未: '戌',
};

const ZHI_VI = { 子:'Tý (23–1h)', 丑:'Sửu (1–3h)', 寅:'Dần (3–5h)', 卯:'Mão (5–7h)', 辰:'Thìn (7–9h)', 巳:'Tỵ (9–11h)', 午:'Ngọ (11–13h)', 未:'Mùi (13–15h)', 申:'Thân (15–17h)', 酉:'Dậu (17–19h)', 戌:'Tuất (19–21h)', 亥:'Hợi (21–23h)' };

/**
 * @returns {{ date, dayGanZhi, hours:[{ zhi, vi, gan, ganZhi, officer, officerVi, deity, deityVi, road, tone }] }}
 */
export function luckyHours(year, month, day) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dayZhi = lunar.getDayZhi();
  const dayZhiIdx = ZHI_ORDER.indexOf(dayZhi);
  const qingStartIdx = ZHI_ORDER.indexOf(QING_START[dayZhi] || '子'); // 青龙 khởi tại thìn nào

  const hours = [];
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI_ORDER[i];
    // (A) 建除 trực (thông tin phụ)
    const oIdx = ((i - dayZhiIdx) + 12) % 12;
    const officer = OFFICERS[oIdx];
    // (B) 十二黄黑道 thần: 从青龙起 startTime thuận hành
    const dIdx = ((i - qingStartIdx) + 12) % 12;
    const deity = DEITIES[dIdx];
    const road = YELLOW_DEITIES.has(deity) ? 'yellow' : 'black';
    // Lấy gan của thìn (thư viện, giờ đại diện)
    const repHour = i === 0 ? 23 : (i * 2 - 1); // 子=23h, 丑=1h, ...
    let gan = '';
    try {
      // 子 hour (23:00) thuộc ngày kế tiếp theo thời柱 truyền thống → +1 ngày trước khi tính time-gan
      let s;
      if (repHour === 23) {
        const next = new Date(year, month - 1, day);
        next.setDate(next.getDate() + 1);
        s = Solar.fromYmdHms(next.getFullYear(), next.getMonth() + 1, next.getDate(), 23, 30, 0);
      } else {
        s = Solar.fromYmdHms(year, month, day, repHour, 30, 0);
      }
      gan = s.getLunar().getTimeGan();
    } catch (e) { gan = '?'; }
    hours.push({
      zhi, vi: ZHI_VI[zhi], gan, ganZhi: gan + zhi,
      officer, officerVi: OFFICER_VI[officer],   // 建除 (phụ)
      deity, deityVi: DEITY_VI[deity],            // 黄黑道 thần (chính)
      road, tone: road === 'yellow' ? 'cat' : 'hung',
    });
  }
  const catHours = hours.filter((h) => h.tone === 'cat');
  return { date: solar.toYmd(), dayGanZhi: lunar.getDayGan() + dayZhi, hours, catHours };
}

export { ZHI_VI };
