// ============================================================================
//  ĐẠI VẬN × NHẬT TRỤ TƯƠNG TÁC (大运日柱互动)
//  Kiểm từng đại vận xem có tương tác đặc biệt với nhật trụ không:
//  天克地冲 / 伏吟 / 反吟 / 同气 → cảnh báo/tín hiệu đặc biệt trong 10 năm đó.
//  Nguồn: 滴天髓, 三命通会, 盲派 实战.
// ============================================================================
import { tenGod } from './core.js';

const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 328] 六害 + 三刑 — đại vận chi hại/hình Nhật Chi cũng đáng cảnh báo (cùng bug-class loop 290/324-327)
const HAI = { 子:'未', 未:'子', 丑:'午', 午:'丑', 寅:'巳', 巳:'寅', 卯:'辰', 辰:'卯', 申:'亥', 亥:'申', 酉:'戌', 戌:'酉' };
const XING = { 子:'卯', 卯:'子', 寅:'巳', 巳:'申', 申:'寅', 丑:'戌', 戌:'未', 未:'丑', 辰:'辰', 午:'午', 酉:'酉', 亥:'亥' };

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

  // [loop 59 sửa] 天克 = GAN_CHONG (4 cặp thất sát 甲庚/乙辛/丙壬/丁癸), KHÔNG phải 'bất kỳ ngũ hành khắc'.
  //   Trước đây dùng tenGod ∈ {七殺,正官,正財,偏財} → 384 false positive (cùng bug fuyin.js L19 đã sửa).
  const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };
  for (const d of (dayun || [])) {
    if (!d || !d.gan || !d.zhi) continue;
    const dgGan = d.gan, dgZhi = d.zhi;
    const notes = [];
    let severity = 0;

    // 1. 天克地冲 (= 反吟): 天干 xung (4 cặp thất sát) + địa chi xung.
    const ganClash = GAN_CHONG[dayGan] === dgGan;
    const zhiChong = CHONG[dayZhi] === dgZhi;
    if (ganClash && zhiChong) {
      notes.push('⚡ 天克地冲 (反吟) — đại vận thiên xung + địa xung Nhật Trụ: BIẾN ĐỘNG LỚN, cẩn thận.');
      severity += 3;
    }

    // 2. Địa xung (大运 chi 冲 日 chi, can KHÔNG xung) — chỉ xung chi, nhẹ hơn 天克地冲.
    if (zhiChong && !ganClash) {
      notes.push('⚡ Địa xung — đại vận chi xung Nhật Chi: gia đạo/bản thân biến động.');
      severity += 2;
    }
    // [loop 328] 2b. 大运 chi HẠI/HÌNH Nhật Chi — nhẹ hơn 冲 nhưng vẫn cảnh báo trệ/quanphi.
    if (!zhiChong && HAI[dayZhi] === dgZhi) {
      notes.push('• Địa hại — đại vận chi hại Nhật Chi: tiểu nhân, trì trệ ngầm.');
      severity += 1;
    }
    if (!zhiChong && XING[dayZhi] === dgZhi && dgZhi !== dayZhi) {
      notes.push('• Địa hình — đại vận chi hình Nhật Chi: quan phi/thị phi, cẩn thận giấy tờ.');
      severity += 1;
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
