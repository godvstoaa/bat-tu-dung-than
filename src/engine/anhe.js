// ============================================================================
//  ẨN HỢP 暗合 (blind school — 盲派 ĐỊA CHI 暗合)
//  "Hai ĐỊA CHI có tàng can ngũ hợp ngầm nhau → duyên ẩn giữa 2 cung"
//  (mà hình-xung-hội-hợp surface không bắt được).
//  * [loop 69 sửa bug CAO] 盲派 暗合 = đúng 6 CẶP CHI cụ thể (段氏盲派口诀),
//    KHÔNG PHẢI "bất kỳ thiên can ngũ hợp lộ+tàng". Trước đây quét mọi tổ hợp
//    can lộ+tàng ghép 天干五合 → hàng chục "暗合" ảo (cùng pattern bug 天克/五行克
//    đã sửa ở fuyin, anchong). Cổ pháp 盲派: 暗合 ở mức ĐỊA CHI — chi nào có tàng
//    can ngũ hợp nhau mới算. Chỉ 6 cặp thỏa:
//      寅(甲丙戊)×丑(己癸辛): 甲己+丙辛+戊癸 = 全暗合 (3/3 tàng can đều ngũ hợp)
//      卯(乙)×申(庚壬戊): 乙庚
//      巳(丙庚戊)×戌(戊辛丁): 丙辛
//      巳(丙庚戊)×酉(辛): 丙辛
//      午(丁己)×亥(壬甲): 丁壬 + 己甲
//      未(己丁乙)×亥(壬甲): 己甲 + 丁壬
//  Nguồn: 盲派命理 (段建业), «地支暗合» qua tàng can天干五合; tham chiếu 渊海子平.
// ============================================================================
import { GAN, HIDDEN } from './constants.js';

// 天干五 hợp + hóa khí — DÙNG ĐỂ GIẢI THÍCH (tàng can nào ghép nhau), không phải để quét.
const GAN_HE_MAP = { 甲:'己', 己:'甲', 乙:'庚', 庚:'乙', 丙:'辛', 辛:'丙', 丁:'壬', 壬:'丁', 戊:'癸', 癸:'戊' };
const HUA = { '甲己':'土', '乙庚':'金', '丙辛':'水', '丁壬':'木', '戊癸':'火' };
function huaOf(a, b) { return HUA[a + b] || HUA[b + a] || ''; }

// [loop 69] 6 cặp 盲派暗合 (đối xứng). Đây là TẤT CẢ các cặp chi có tàng can ngũ hợp.
//   Bất kỳ cặp chi KHÔNG nằm trong map này → KHÔNG phải暗合 (trước đây báo bừa).
const AN_HE = {
  寅: ['丑'], 丑: ['寅'],
  卯: ['申'], 申: ['卯'],
  巳: ['戌', '酉'], 戌: ['巳'], 酉: ['巳'],
  午: ['亥'], 亥: ['午', '未'],
  未: ['亥'],
};
export function isAnHe(a, b) { return (AN_HE[a] || []).includes(b); }

// Các cặp tàng can ngũ hợp THẬT sự giữa 2 chi (giải thích "tại sao暗合").
function hiddenHePairs(zhiA, zhiB) {
  const ha = HIDDEN[zhiA] || [], hb = HIDDEN[zhiB] || [];
  const pairs = [];
  const seen = new Set();
  for (const ga of ha) {
    for (const gb of hb) {
      if (GAN_HE_MAP[ga] === gb) {
        const k = ga < gb ? ga + gb : gb + ga;
        if (seen.has(k)) continue;
        seen.add(k);
        pairs.push({ ganA: ga, ganB: gb, hua: huaOf(ga, gb) });
      }
    }
  }
  return pairs;
}

const PALACE_VI = { year: 'Trụ Năm (ổ tổ)', month: 'Trụ Tháng (cha mẹ)', day: 'Trụ Ngày (bản mệnh)', time: 'Trụ Giờ (con cái)' };

/**
 * Quét 4 trụ × nhau theo 6 cặp暗合 盲派.
 * @returns {{ pairs:[{from,to,chiA,chiB,hePairs,hua,isQuanAn,relVi,note}], summary }}
 */
export function detectAnhe(chart) {
  const keys = ['year', 'month', 'day', 'time'];
  const pairs = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ka = keys[i], kb = keys[j];
      const pa = chart.pillars[ka], pb = chart.pillars[kb];
      if (!isAnHe(pa.zhi, pb.zhi)) continue;
      const hePairs = hiddenHePairs(pa.zhi, pb.zhi);
      if (!hePairs.length) continue; // phòng: map ghi nhưng tàng can không ngũ hợp
      const huaList = [...new Set(hePairs.map((h) => h.hua).filter(Boolean))];
      const isQuanAn = hePairs.length >= 3; // 全暗合: 3/3 tàng can ngũ hợp (chỉ 寅丑)
      const relVi = `${PALACE_VI[ka]} ↔ ${PALACE_VI[kb]}`;
      const note = `暗合 ${pa.zhi}${pb.zhi}${isQuanAn ? ' (全暗合)' : ''}: ${hePairs.map((h) => `${h.ganA}${h.ganB}→${h.hua}`).join(', ')} — duyên/ngoại duyên ẨN giữa ${relVi} (mặt hình-xung không thấy).`;
      pairs.push({
        from: ka, to: kb, chiA: pa.zhi, chiB: pb.zhi,
        hePairs, hua: huaList.join('/'), isQuanAn, bothHidden: true, relVi, note,
      });
    }
  }

  const summary = pairs.length
    ? pairs.map((p) => `${p.chiA}${p.chiB}${p.isQuanAn ? '(全)' : ''}→${p.hua} (${p.from}↔${p.to})`).join(' · ')
    : 'Không phát hiện 暗合 — tứ trụ địa chi không cặp 盲派暗合 (6 cặp chuẩn) nào.';
  return { pairs, summary };
}

export { GAN_HE_MAP, HUA, AN_HE };
