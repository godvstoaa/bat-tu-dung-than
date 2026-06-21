// ============================================================================
//  ẨN HỢP 暗合 (blind school — 盲派 隐藏的天干合)
//  Tìm can ẩn (tàng can) giữa các trụ có thiên can ngũ hợp không — lộ ra
//  tương tác ẩn mà hình-xung-hội-hợp (surface) không bắt được.
//  Nguồn: 盲派命理, quanxue.cn mangpaimd.
// ============================================================================
import { GAN } from './constants.js';

const GAN_HE_MAP = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };
const HUA = { '甲己':'土', '乙庚':'金', '丙辛':'水', '丁壬':'木', '戊癸':'火' };
function huaOf(a, b) { return HUA[a + b] || HUA[b + a] || ''; }

const PALACE_VI = { year: 'Trụ Năm (ổ tổ)', month: 'Trụ Tháng (cha mẹ)', day: 'Trụ Ngày (bản mệnh)', time: 'Trụ Giờ (con cái)' };

/**
 * Thu thập tất cả can của 1 trụ: can hiển + tàng can (đánh dấu hidden).
 */
function allStems(pillar, key) {
  const stems = [{ gan: pillar.gan, isHidden: false, src: `can ${key}` }];
  for (const h of pillar.hidden) {
    stems.push({ gan: h.gan, isHidden: true, src: `tàng ${key}` });
  }
  return stems;
}

/**
 * @returns {{ pairs:[{from, to, ganA, ganB, hua, bothHidden, note}], summary }}
 */
export function detectAnhe(chart) {
  const keys = ['year', 'month', 'day', 'time'];
  const pairs = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ka = keys[i], kb = keys[j];
      const stemsA = allStems(chart.pillars[ka], ka);
      const stemsB = allStems(chart.pillars[kb], kb);
      const found = new Set(); // tránh trùng (cùng cặp can)

      for (const sa of stemsA) {
        for (const sb of stemsB) {
          const partner = GAN_HE_MAP[sa.gan];
          if (partner === sb.gan) {
            const key = sa.gan > sb.gan ? sb.gan + sa.gan : sa.gan + sb.gan;
            if (found.has(key)) continue;
            found.add(key);
            const bothHidden = sa.isHidden && sb.isHidden;
            const hua = huaOf(sa.gan, sb.gan);
            const relVi = `${PALACE_VI[ka]} ↔ ${PALACE_VI[kb]}`;
            const note = bothHidden
              ? `暗合 ẩn: tàng ${sa.gan}(${sa.src}) hợp tàng ${sb.gan}(${sb.src}) → hóa ${hua}. Ẩn hiện nhân duyên giữa ${relVi}.`
              : `半明半暗: ${sa.src} ${sa.gan} hợp ${sb.src} ${sb.gan} → hóa ${hua}. ${relVi} có duyên.`;
            pairs.push({ from: ka, to: kb, ganA: sa.gan, ganB: sb.gan, hua, bothHidden, relVi, note });
          }
        }
      }
    }
  }

  const summary = pairs.length
    ? pairs.map((p) => `${p.bothHidden ? '暗' : '½'}${p.ganA}${p.ganB}→${p.hua} (${p.from}↔${p.to})`).join(' · ')
    : 'Không phát hiện暗合 — tứ trụ can/tàng không có thiên can ngũ hợp ẩn.';
  return { pairs, summary };
}

export { GAN_HE_MAP, HUA };
