// ============================================================================
//  TRẠCH GIỜ LÀNH 择吉时 — 12 THỜI THÌN CÁT/HUNG mỗi ngày
//  Mỗi ngày 12 thìn (子→亥, mỗi thìn 2 giờ), tính 建除十二神 của mỗi thìn
//  (dùng hourZhi vs dayZhi) → hoàng/hắc đạo + tone. Nguồn: 通胜 黄黑道时.
// ============================================================================
import { Solar } from 'lunar-javascript';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_VI = { 建:'Kiến', 除:'Trừ', 满:'Mãn', 平:'Bình', 定:'Định', 执:'Chấp', 破:'Phá', 危:'Nguy', 成:'Thành', 收:'Thu', 开:'Khai', 闭:'Bế' };
const OFFICER_ROAD = { 建:'black', 满:'black', 平:'black', 收:'black', 破:'black', 闭:'black', 除:'yellow', 危:'yellow', 定:'yellow', 执:'yellow', 成:'yellow', 开:'yellow' };
const ZHI_VI = { 子:'Tý (23–1h)', 丑:'Sửu (1–3h)', 寅:'Dần (3–5h)', 卯:'Mão (5–7h)', 辰:'Thìn (7–9h)', 巳:'Tỵ (9–11h)', 午:'Ngọ (11–13h)', 未:'Mùi (13–15h)', 申:'Thân (15–17h)', 酉:'Dậu (17–19h)', 戌:'Tuất (19–21h)', 亥:'Hợi (21–23h)' };

/**
 * @returns {{ date, hours:[{zhi, vi, gan, officer, officerVi, road, tone }] }}
 */
export function luckyHours(year, month, day) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dayZhi = lunar.getDayZhi();
  const dayZhiIdx = ZHI_ORDER.indexOf(dayZhi);
  const hours = [];
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI_ORDER[i];
    const zhiIdx = i;
    // 建除 của thìn: (hourZhiIdx - dayZhiIdx) mod 12
    const oIdx = ((zhiIdx - dayZhiIdx) + 12) % 12;
    const officer = OFFICERS[oIdx];
    const road = OFFICER_ROAD[officer];
    // Lấy gan của thìn (từ thư viện, dùng giờ đại diện)
    const repHour = i === 0 ? 23 : (i * 2 - 1); // 子=23h, 丑=1h, ...
    let gan = '';
    try {
      const lh = Solar.fromYmdHms(year, month, day, repHour >= 23 ? 23 : repHour, 30, 0).getLunar();
      gan = lh.getTimeGan();
    } catch (e) { gan = '?'; }
    hours.push({
      zhi, vi: ZHI_VI[zhi], gan, ganZhi: gan + zhi,
      officer, officerVi: OFFICER_VI[officer], road,
      tone: road === 'yellow' ? 'cat' : 'hung',
    });
  }
  // Gom giờ cát
  const catHours = hours.filter((h) => h.tone === 'cat');
  return { date: solar.toYmd(), dayGanZhi: lunar.getDayGan() + dayZhi, hours, catHours };
}

export { ZHI_VI };
