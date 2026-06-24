// ============================================================================
//  ẨN XUNG 暗冲 (blind school — 盲派 tàng can giữa các trụ KHẮC nhau)
//  Companion của anhe.js (ẩn hợp). Tàng can A khắc tàng can B → "ẩn xung":
//  chỉ xung đột tiềm ẩn giữa 2 cung mà face analysis không thấy.
//  Nguồn: 盲派命理, quanxue.cn mangpaimd.
// ============================================================================
import { GAN } from './constants.js';

const KE = { 木:'土', 火:'金', 土:'水', 金:'木', 水:'火' };
const PALACE_VI = { year: 'Trụ Năm (ổ tổ)', month: 'Trụ Tháng (cha mẹ)', day: 'Trụ Ngày (bản mệnh)', time: 'Trụ Giờ (con cái)' };

function isKe(a, b) { return KE[a] === b; }

function allStems(pillar, key) {
  const stems = [{ gan: pillar.gan, isHidden: false, src: 'can ' + key }];
  for (const h of pillar.hidden) {
    stems.push({ gan: h.gan, isHidden: true, src: 'tàng ' + key });
  }
  return stems;
}

/**
 * @returns {{ pairs:[{from, to, ganA, ganB, bothHidden, note }], summary }}
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
          // A khắc B hoặc B khắc A
          const aKeB = isKe(GAN[sa.gan]?.wx, GAN[sb.gan]?.wx);
          const bKeA = isKe(GAN[sb.gan]?.wx, GAN[sa.gan]?.wx);
          if (aKeB || bKeA) {
            const key = sa.gan + sb.gan;
            if (found.has(key)) continue;
            found.add(key);
            const bothHidden = sa.isHidden && sb.isHidden;
            const direction = aKeB ? `${sa.gan}→克→${sb.gan}` : `${sb.gan}→克→${sa.gan}`;
            const relVi = `${PALACE_VI[ka]} ↔ ${PALACE_VI[kb]}`;
            const note = bothHidden
              ? `暗冲 ẩn: tàng ${sa.gan}(${sa.src}) khắc tàng ${sb.gan}(${sb.src}) [${direction}]. Xung đột tiềm ẩn giữa ${relVi}.`
              : `半明半暗: ${sa.src} ${sa.gan} khắc ${sb.src} ${sb.gan} [${direction}]. Căng thẳng giữa ${relVi}.`;
            pairs.push({ from: ka, to: kb, ganA: sa.gan, ganB: sb.gan, bothHidden, relVi, direction, note });
          }
        }
      }
    }
  }

  const summary = pairs.length
    ? pairs.map((p) => `${p.bothHidden ? '暗冲' : '½'}${p.direction} (${p.from}↔${p.to})`).join(' · ')
    : 'Không phát hiện暗冲 — tàng can giữa các trụ không khắc nhau ẩn.';
  return { pairs, summary };
}
