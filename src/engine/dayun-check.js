// ============================================================================
//  ĐẠI VẬN × NHẬT TRỤ TƯƠNG TÁC (大运日柱互动)
//  Kiểm từng đại vận xem có tương tác đặc biệt với nhật trụ không:
//  天克地冲 / 伏吟 / 反吟 / 同气 → cảnh báo/tín hiệu đặc biệt trong 10 năm đó.
//  Nguồn: 滴天髓, 三命通会, 盲派 实战.
// ============================================================================
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
  const results = [];

  for (const d of dayun) {
    const dgGan = d.gan, dgZhi = d.zhi;
    const notes = [];
    let severity = 0;

    // 1. 天克地冲 (= 反吟): 大运 can khắc 日 can (KHẮC HAI CHIỀU) + 大运 chi 冲 日 chi.
    // [cycle 48 sửa C2] 天克地冲 bidirectional — trước đây chỉ bắt 克 NHẬP (官/sát), bỏ sót 克 XUẤT
    //   (Tài: 日 can khắc đại vận can). Nay bắt cả 4 thần khắc (七殺/正官/正財/偏財).
    const godOfDgGan = tenGod(dayGan, dgGan);
    const ganClash = ['七殺', '正官', '正財', '偏財'].includes(godOfDgGan);
    const zhiChong = CHONG[dayZhi] === dgZhi;
    if (ganClash && zhiChong) {
      notes.push('⚡ 天克地冲 (反吟) — đại vận can khắc Nhật Can + chi xung Nhật Chi: BIẾN ĐỘNG LỚN, cẩn thận.');
      severity += 3;
    }

    // 2. Địa xung (大运 chi 冲 日 chi, can KHÔNG khắc) — chỉ xung chi, nhẹ hơn天克地冲.
    if (zhiChong && !ganClash) {
      notes.push('⚡ Địa xung — đại vận chi xung Nhật Chi: gia đạo/bản thân biến động.');
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
