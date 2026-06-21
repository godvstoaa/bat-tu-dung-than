// ============================================================================
//  ĐẠI VẬN × NHẬT TRỤ TƯƠNG TÁC (大运日柱互动)
//  Kiểm từng đại vận xem có tương tác đặc biệt với nhật trụ không:
//  天克地冲 / 伏吟 / 反吟 / 同气 → cảnh báo/tín hiệu đặc biệt trong 10 năm đó.
//  Nguồn: 滴天髓, 三命通会, 盲派 实战.
// ============================================================================
import { GAN } from './constants.js';
import { tenGod } from './core.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };

/**
 * @param {object} chart - từ analyze()
 * @param {array} dayun - R.dayun
 * @returns {array} [{ ganZhi, startAge, interaction, severity, note }] cho các đại vận CÓ tương tác
 */
export function checkDayunInteractions(chart, dayun) {
  const dayGan = chart.dayGan;
  const dayZhi = chart.pillars.day.zhi;
  const dayGanZhi = dayGan + dayZhi;
  const dayGanWx = GAN[dayGan].wx;
  const results = [];

  for (const d of dayun) {
    const dgGan = d.gan, dgZhi = d.zhi;
    const dgGanWx = GAN[dgGan].wx;
    const notes = [];
    let severity = 0;

    // 1. 天克地冲: 大运 can 克 日 can (khác cực tính) + 大运 chi 冲 日 chi
    const ganKe = (GAN[dgGan].wx === GAN[CHONG[dayGanWx] ? dayGanWx : '金']?.wx) ? false : false; // skip complex
    // Đơn giản: can năm là Thất Sát / Chính Quan (khắc Nhật Chủ) + chi xung 日 Chi
    const godOfDgGan = tenGod(dayGan, dgGan);
    const ganClash = (godOfDgGan === '七殺' || godOfDgGan === '正官');
    const zhiChong = CHONG[dayZhi] === dgZhi;
    if (ganClash && zhiChong) {
      notes.push('⚡ 天克地冲 — đại vận can khắc Nhật Can + chi xung Nhật Chi: BIẾN ĐỘNG LỚN, cẩn thận.');
      severity += 3;
    }

    // 2. 反吟 (大运 chi 冲 日 chi, nhưng can không khắc)
    if (zhiChong && !ganClash) {
      notes.push('⚡ 反吟 — đại vận chi xung Nhật Chi: gia đạo/bản thân biến động.');
      severity += 2;
    }

    // 3. 伏吟 (大运 = 日柱)
    if (dgGan + dgZhi === dayGanZhi) {
      notes.push('🔄 伏吟 — đại vận trùng Nhật Trụ: đình trệ, lặp lại, u buồn (nhưng nếu Dụng thì "hồi phục").');
      severity += 1;
    }

    // 4. 同气 (大运 can = 日 can)
    if (dgGan === dayGan && dgGan + dgZhi !== dayGanZhi) {
      notes.push('🔄 同气 — đại vận can trùng Nhật Can: cộng hưởng tính cách, tăng lực bản thân.');
    }

    // 5. 大运 chi = 日 chi (trùng chi)
    if (dgZhi === dayZhi && dgGan !== dayGan) {
      notes.push('📌 Trùng chi — đại vận chi = Nhật Chi: gia đạo/căn nguyên trùng lặp.');
      severity += 1;
    }

    if (notes.length) {
      results.push({
        ganZhi: d.ganZhi, startAge: d.startAge, rating: d.rating,
        severity, notes,
      });
    }
  }
  return results;
}
