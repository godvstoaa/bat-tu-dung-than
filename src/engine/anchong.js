// ============================================================================
//  ẨN XUNG 暗冲 (blind school — 盲派 tàng can THIÊN KHẮC nhau)
//  Companion của anhe.js (ẩn hợp). Tàng can A THIÊN KHẮC tàng can B → "ẩn xung":
//  xung đột tiềm ẩn giữa 2 cung mà face analysis không thấy.
//  * [loop 69 sửa bug CAO] 盲派 暗冲 = THIÊN KHẮC (天克) đúng 4 cặp GAN_CHONG
//    (甲庚/乙辛/丙壬/丁癸), KHÔNG PHẢI "bất kỳ ngũ hành khắc". Trước đây dùng KE
//    (ngũ hành khắc chung) → mọi cặp can khắc nhau (kể cả 偏财/正官, 正印/七杀...)
//    đều báo "暗冲" → hàng trăm false positive. Cùng pattern bug 天克/五行克 đã
//    sửa ở fuyin, dayun-check, dayun-rank, liunian-pro.
//    Cổ quyết (渊海子平 反吟伏吟篇): "天克" = chỉ 4 cặp đối xứng; 戊己 (thổ trung)
//    KHÔNG có thiên can xung.
//  Nguồn: 盲派命理, 渊海子平; GAN_CHONG đồng nhất fuyin.js (isFanyin).
// ============================================================================
import { GAN } from './constants.js';

// [loop 69] Thiên can xung (天克) — CHỈ 4 cặp đối xứng, đối chiếu fuyin.js GAN_CHONG.
const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };
export function isGanChong(a, b) { return GAN_CHONG[a] === b; }

const PALACE_VI = { year: 'Trụ Năm (ổ tổ)', month: 'Trụ Tháng (cha mẹ)', day: 'Trụ Ngày (bản mệnh)', time: 'Trụ Giờ (con cái)' };

function allStems(pillar, key) {
  const stems = [{ gan: pillar.gan, isHidden: false, src: 'can ' + key }];
  for (const h of (pillar.hidden || [])) { // [loop 560 FIX] guard hidden undefined → crash «not iterable»
    stems.push({ gan: h.gan, isHidden: true, src: 'tàng ' + key });
  }
  return stems;
}

/**
 * @returns {{ pairs:[{from, to, ganA, ganB, bothHidden, relVi, note }], summary }}
 */
export function detectAnchong(chart) {
  const keys = ['year', 'month', 'day', 'time'];
  const pairs = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ka = keys[i], kb = keys[j];
      const stemsA = allStems(chart.pillars[ka], ka);
      const stemsB = allStems(chart.pillars[kb], kb);
      const found = new Set();

      for (const sa of stemsA) {
        for (const sb of stemsB) {
          // 天克 = 4 cặp GAN_CHONG nghiêm ngặt (đối xứng → 1 check đủ, không cần aKeB||bKeA)
          if (isGanChong(sa.gan, sb.gan)) {
            const key = sa.gan + sb.gan;
            if (found.has(key)) continue;
            found.add(key);
            const bothHidden = sa.isHidden && sb.isHidden;
            const relVi = `${PALACE_VI[ka]} ↔ ${PALACE_VI[kb]}`;
            const note = bothHidden
              ? `暗冲 ẩn: tàng ${sa.gan}(${sa.src}) 天克 tàng ${sb.gan}(${sb.src}) [${sa.gan}↔${sb.gan}]. Xung đột tiềm ẩn giữa ${relVi}.`
              : `半明半暗: ${sa.src} ${sa.gan} 天克 ${sb.src} ${sb.gan} [${sa.gan}↔${sb.gan}]. Căng thẳng giữa ${relVi}.`;
            pairs.push({ from: ka, to: kb, ganA: sa.gan, ganB: sb.gan, bothHidden, relVi, note });
          }
        }
      }
    }
  }

  const summary = pairs.length
    ? pairs.map((p) => `${p.bothHidden ? '暗冲' : '½'}${p.ganA}↔${p.ganB} (${p.from}↔${p.to})`).join(' · ')
    : 'Không phát hiện暗冲 — tàng can giữa các trụ không天克 (4 cặp 甲庚/乙辛/丙壬/丁癸).';
  return { pairs, summary };
}

export { GAN_CHONG };
