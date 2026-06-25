// ============================================================================
//  化气格 (HÓA KHÍ CÁCH) — Thiên Can Ngũ Hợp HÓA KHÍ ngoại cách
//  "Can hợp có thật sự HÓA không? Nếu hóa → Nhật Chủ đổi bản chất, Dụng đổi!"
//  Khi 2 Thiên Can hợp (甲己/乙庚/丙辛/丁壬/戊癸) + đủ điều kiện → HÓA thành hành mới,
//    Nhật Chủ theo Hóa khí → DỤNG THẦN ĐỔI HẲN (không lấy Dụng theo vượng suy thường).
//  * 5 Hóa khí: 甲己→土 | 乙庚→金 | 丙辛→水 | 丁壬→木 | 戊癸→火.
//  * Điều kiện thành Hóa khí cách (古法, 三命通会 化气格):
//    1) NHẬT CAN tham gia hợp (với Nguyệt/Thời can, sát cạnh).
//    2) NGUYỆT LỆNH hỗ trợ Hóa (lệnh = Hóa hoặc lệnh sinh Hóa).
//    3) Hóa hành THÔNG CĂN trong tàng can.
//    4) KHÔNG PHÁ HÓA: không có can khắc Hóa hành xuất hiện (sẽ phá tan hóa).
//  * Dụng khi thành cách (thuận hóa): lấy Hóa + sinh Hóa; kỵ khắc Hóa (phá hóa) + Tỷ Kiếp.
//  Khác interactions.js (chỉ báo can hợp → ghi Hóa mechanistic): module này = KIỂM ĐIỀU
//    KIỆN, quyết định Hóa khí CÁCH có THÀNH hay KHÔNG → đúng/sai Dụng.
//  Nguồn: 三命通会 化气十段锦, 子平真诠 外格篇, 滴天髓 化象.
// ============================================================================
import { GAN, WX_VI } from './constants.js';
import { tongGen, wuTai } from './tonggen.js';

const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
const GAN_HE = { '甲己': '土', '己甲': '土', '乙庚': '金', '庚乙': '金', '丙辛': '水', '辛丙': '水', '丁壬': '木', '壬丁': '木', '戊癸': '火', '癸戊': '火' };
const HUA_NAME = { 土: 'Hóa Thổ cách (甲己)', 金: 'Hóa Kim cách (乙庚)', 水: 'Hóa Thủy cách (丙辛)', 木: 'Hóa Mộc cách (丁壬)', 火: 'Hóa Hỏa cách (戊癸)' };

/**
 * @returns {{ hasHe, pairs:[{withGan,with,hua,monthOk,rootOk,poHua,breakers}], huaQiGe, huaWx, dung, summary }}
 */
export function analyzeHuaQi(R) {
  const pillars = R.chart.pillars;
  const dayGan = R.chart.dayGan;
  const monthMainWx = R.strength?.monthMainWx;

  // 1) các hợp có NHẬT CAN tham gia (với Năm/Tháng/Thời)
  const rawPairs = [];
  for (const k of ['year', 'month', 'time']) {
    const g = pillars[k].gan;
    const hua = GAN_HE[dayGan + g];
    if (hua) rawPairs.push({ withGan: g, with: k, hua });
  }

  if (!rawPairs.length) {
    return { hasHe: false, pairs: [], huaQiGe: false, summary: `Lá số KHÔNG có Thiên Can Ngũ Hợp (nhật can ${dayGan} không hợp với can nào) → KHÔNG thành Hóa Khí cách; Dụng Thần tính theo nguyên tắc vượng suy thường (đã đúng).` };
  }

  // 2) kiểm điều kiện từng hợp
  const pairs = rawPairs.map((p) => {
    const huaWx = p.hua;
    const monthOk = monthMainWx === huaWx || SHENG[monthMainWx] === huaWx; // lệnh = Hóa hoặc lệnh sinh Hóa
    const root = tongGen(R.chart, huaWx);
    // [loop 69 sửa bug CAO] 化气格 = ngoại cách KHẮT KHIET — Hóa hành phải THÔNG CĂN
    //   thật (bản khí hoặc tích lũy đáng kể), không thể chỉ 1 dư khí lẻ tẻ.
    //   Trước đây rootOk = total >= 0.3 → 1 dư khí (0.1) + 1 trung khí phi-tháng (0.3)
    //   đã vượt → fake "thành Hóa khí cách" → DỤNG THẦN ĐỔI SAI (cốt lõi lá số).
    //   Ngưỡng 0.6: yêu cầu bản khí (0.6×1.0+) hoặc trung khí nguyệt lệnh (0.3×1.8=0.54)
    //   + bù. Tức Hóa hành phải thực sự CÓ GỐC trong cục — cổ pháp «化神必须有根».
    const rootOk = root.total >= 0.6;
    // phá hóa: can khắc Hóa hành xuất hiện ở trụ KHÁC (loại trừ 2 can đang hợp)
    const inHe = new Set([dayGan, p.withGan]);
    const breakers = [];
    for (const k of ['year', 'month', 'day', 'time']) {
      if (inHe.has(pillars[k].gan)) continue;
      const gw = GAN[pillars[k].gan].wx;
      if (KE[gw] === huaWx) breakers.push(`${pillars[k].gan}(${k})`);
    }
    const poHua = breakers.length > 0;
    return { ...p, monthOk, rootOk, rootTotal: root.total, poHua, breakers, cheng: monthOk && rootOk && !poHua };
  });

  const best = pairs.find((p) => p.cheng) || pairs[0];
  const huaQiGe = pairs.some((p) => p.cheng);
  const huaWx = best.hua;

  let summary;
  let dung = null;
  if (huaQiGe) {
    // khắc Hóa hành = kê: wx có KE[wx]===huaWx ; sinh Hóa = tài nguyên: wx có SHENG[wx]===huaWx
    const keHua = Object.entries(KE).find(([, v]) => v === huaWx)[0];
    const shengHua = Object.entries(SHENG).find(([, v]) => v === huaWx)[0];
    dung = { primary: huaWx, xi: shengHua, ji: keHua };
    summary = `✓ THÀNH ${HUA_NAME[huaWx]}: nhật can ${dayGan} + ${best.withGan}(${best.with}) hợp, nguyệt lệnh ${WX_VI[monthMainWx]} hỗ trợ Hóa ${WX_VI[huaWx]}, thông căn ${best.rootTotal}, không phá hóa. ⇒ NHẬT CHỦ theo Hóa ${WX_VI[huaWx]}, DỤNG ĐỔI: Dụng ${WX_VI[huaWx]} + Hỷ ${WX_VI[shengHua]} (sinh Hóa, thuận hóa); KỴ ${WX_VI[keHua]} (phá hóa) + Thương/Tài hao Hóa. Không lấy Dụng theo vượng suy thường nữa.`;
  } else {
    const reasons = [];
    if (!best.monthOk) reasons.push(`nguyệt lệnh ${WX_VI[monthMainWx]} KHÔNG hỗ trợ Hóa ${WX_VI[huaWx]} (cần lệnh ${WX_VI[huaWx]} hoặc lệnh sinh ${WX_VI[huaWx]})`);
    if (!best.rootOk) reasons.push(`Hóa ${WX_VI[huaWx]} không thông căn (cần tàng can ${WX_VI[huaWx]})`);
    if (best.poHua) reasons.push(`bị PHÁ HÓA bởi can khắc ${best.breakers.join(', ')}`);
    summary = `Có Thiên Can hợp (${dayGan}+${best.withGan}=${HUA_NAME[huaWx]}) NHƯNG KHÔNG thành Hóa khí cách: ${reasons.join('; ')}. → chỉ là "hợp mà không hóa", Nhật Chủ vẫn theo vượng suy thường, Dụng Thần tính bình thường.`;
  }

  return { hasHe: true, pairs, huaQiGe, huaWx, dung, summary };
}

export { GAN_HE, HUA_NAME };
