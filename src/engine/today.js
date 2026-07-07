// ============================================================================
//  [plan #6] VẬN THẾ HÔM NAY — birth-free daily energy for the landing hero.
//  Computes today's day-pillar ngũ hành + trực (12 officers) + 宜/忌 + hướng tài
//  from the DATE ALONE (no birth chart) → instant, deterministic, no AI / cache.
//  Purpose: a discovery hook for first-time visitors → drives birth entry →
//  unlocks the existing personalized daily (renderDailyBriefing / renderDailyCapsule).
//  API mirrored from engine/daily-guide.js (verified lunar-javascript method names).
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, WX_VI, SHENG, SHENG_BY, KE_BY } from './constants.js';
import { YI_VI, JI_VI, translateDir } from './daily-guide.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const OFFICERS = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];
const OFFICER_ROAD = { 建: 'black', 满: 'black', 平: 'black', 收: 'black', 破: 'black', 闭: 'black', 除: 'yellow', 危: 'yellow', 定: 'yellow', 执: 'yellow', 成: 'yellow', 开: 'yellow' };
const OFFICER_VI = { 建: 'Kiến', 除: 'Trừ', 满: 'Mãn', 平: 'Bình', 定: 'Định', 执: 'Chấp', 破: 'Phá', 危: 'Nguy', 成: 'Thành', 收: 'Thu', 开: 'Khai', 闭: 'Bế' };
const CAN_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const WX_COLOR = { '木': '#4a8', '火': '#e54', '土': '#da3', '金': '#aaa', '水': '#369' };
const tr = (s, map) => (map[s] || s);

export function todayEnergy() {
  const now = new Date();
  const solar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0);
  const lunar = solar.getLunar();
  const dGan = lunar.getDayGan(), dZhi = lunar.getDayZhi(), mZhi = lunar.getMonthZhi();
  const ganIdx = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].indexOf(dGan);
  const zhiIdx = ZHI_ORDER.indexOf(dZhi);
  const dgWx = (GAN && GAN[dGan]) ? GAN[dGan].wx : '土';
  const oIdx = ((zhiIdx - ZHI_ORDER.indexOf(mZhi)) + 12) % 12;
  const officer = OFFICERS[oIdx];
  const road = OFFICER_ROAD[officer];
  // 破/闭 = rõ ràng hung; vàng đạo (除/危/定/执/成/开) = cát; còn lại = bình
  const tone = (officer === '破' || officer === '闭') ? 'hung' : (road === 'yellow' ? 'cat' : 'mid');
  const toneVi = tone === 'cat' ? 'Cát' : tone === 'hung' ? 'Hung' : 'Bình';

  const tsYi = lunar.getDayYi ? (lunar.getDayYi() || []) : [];
  const tsJi = lunar.getDayJi ? (lunar.getDayJi() || []) : [];
  const yi = tsYi.slice(0, 5).map((y) => tr(y, YI_VI));
  const ji = tsJi.slice(0, 4).map((j) => tr(j, JI_VI));
  const caiDir = translateDir(lunar.getDayPositionCaiDesc ? lunar.getDayPositionCaiDesc() : '?');
  let lunarVi = '';
  try { lunarVi = (lunar.getMonthInChinese ? lunar.getMonthInChinese() : '') + ' ' + (lunar.getDayInChinese ? lunar.getDayInChinese() : ''); } catch (_) {}

  const oneLiner = tone === 'cat'
    ? `Khí ${WX_VI[dgWx]} vượng, trực ${OFFICER_VI[officer]} (hoàng đạo) → thuận lợi khởi đầu, ký kết, hẹn hò, dọn nhà.`
    : tone === 'hung'
      ? `Trực ${OFFICER_VI[officer]} (hắc đạo) — giữ gìn, hạn chế động thổ / ký kết / việc lớn.`
      : `Trực ${OFFICER_VI[officer]} — ngày khá bình hoà, cứ đều đều mà làm, tránh quyết định vội vàng.`;

  return {
    dateVi: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    lunarVi: lunarVi.trim(),
    ganZhi: dGan + dZhi,
    ganZhiVi: (CAN_VI[ganIdx] || '') + ' ' + (CHI_VI[zhiIdx] || ''),
    wx: dgWx, wxVi: WX_VI[dgWx] || '', wxColor: WX_COLOR[dgWx] || '#da3',
    officer, officerVi: OFFICER_VI[officer] || officer,
    tone, toneVi,
    yi, ji, caiDir, oneLiner,
  };
}

// ============================================================================
//  [loop 1388] VẬN THẾ HÔM NAY THEO LÁ SỐ — cá nhân hoá today 日 vs Dụng/Hỷ/Kỵ
//    + Nhật Chủ của chart. Đồng bộ logic với hệ thống (R.yong, R.chart.dayMaster).
//    Trước đây hero card chỉ show generic date-only → «mở lá nào cũng vậy».
//    @returns {{tag,tone,line,dungVi,dungHan}|null}
// ============================================================================
export function todayForChart(R) {
  if (!R || !R.yong || !R.yong.primary || !R.chart || !R.chart.dayMaster) return null;
  try {
    const now = new Date();
    const lunar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0).getLunar();
    const dGan = lunar.getDayGan();
    const dGanWx = GAN[dGan] ? GAN[dGan].wx : null;
    if (!dGanWx) return null;
    const dung = R.yong.primary, hy = R.yong.xi, ky = R.yong.ji;
    const dmWx = R.chart.dayMaster.wx;
    let tag, tone, line;
    if (dGanWx === dung) { tag = '★ DỤNG THẦN'; tone = 'cat'; line = `Hôm nay can ngày ${dGan} (${WX_VI[dGanWx]}) mang đúng DỤNG thần của bạn → năng lượng thuận, dễ tiến hành việc cần Dụng.`; }
    else if (dGanWx === hy) { tag = 'HỶ THẦN'; tone = 'cat'; line = `Hôm nay can ${dGan} = HỶ thần → khá thuận, hỗ trợ Dụng.`; }
    else if (dGanWx === SHENG_BY[dung]) { tag = 'SINH DỤNG'; tone = 'cat'; line = `Hôm nay can ${dGan} sinh DỤng thần → nuôi Dụng, thuận.`; }
    else if (dGanWx === ky) { tag = '⚠ KỴ THẦN'; tone = 'hung'; line = `Hôm nay can ${dGan} = KỴ thần → cẩn trọng, hạn chế quyết định lớn cần Dụng.`; }
    else if (dGanWx === KE_BY[dung]) { tag = '⚠ KHẮC DỤNG'; tone = 'hung'; line = `Hôm nay can ${dGan} khắc DỤng thần → giảm lợi, nên giữ ổn.`; }
    else { tag = 'Trung tính'; tone = 'mid'; line = `Hôm nay can ${dGan} (${WX_VI[dGanWx]}) trung tính với Dụng ${WX_VI[dung]} — không thuận không kỵ rõ.`; }
    // can ngày vs Nhật Chủ (năng lượng thân/trợ/áp)
    let dmNote = '';
    if (dmWx) {
      if (dGanWx === dmWx) dmNote = ' Can ngày đồng hành Nhật Chủ → năng lượng thân.';
      else if (dGanWx === SHENG_BY[dmWx]) dmNote = ' Can ngày sinh Nhật Chủ → được trợ.';
      else if (dGanWx === KE_BY[dmWx]) dmNote = ' Can ngày khắc Nhật Chủ → hơi áp.';
    }
    return { tag, tone, line: line + dmNote, dungVi: WX_VI[dung] || '?', dungHan: dung };
  } catch (_) { return null; }
}
