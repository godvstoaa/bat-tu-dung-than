// ============================================================================
//  得令 得地 得势 — 3 PHÁP ĐO VƯỢNG SUY (WHY thân mạnh/yếu)
//  "Vì sao tôi thân mạnh (hay yếu)? Mạnh do ĐẮC LỆNH, ĐẮC ĐỊA hay ĐẮC THẾ?"
//  * 3 pháp cổ (cùng bổ sung cho scoreWuXing/analyzeStrength):
//    1) 得令 (đắc lệnh): hành Nhật Chủ = hành tháng lệnh (hoặc hành Ấn sinh nó).
//    2) 得地 (đắc địa): Nhật Chủ THÔNG CĂN trong tàng can (có «rễ»).
//    3) 得势 (đắc thế): nhiều thiên can/tàng cùng hành (Tỷ Kiếp trợ).
//  * Đạt ≥2 pháp → thân mạnh «chính thống»; đạt 0-1 → thân nhược. ĐẶC BIỆT: nếu
//    mạnh nhưng KHÔNG do 3 pháp mà do Ấn vượng (tài nguyên quá dồi dào) → «thân mạnh
//    do Ấn» — mạnh nhưng dễ thụ động/phụ thuộc/ít quyết đoán.
//  Nguồn: 渊海子平 得令得地得势, 滴天髓 旺衰判断, 子平真诠 身强身弱.
// ============================================================================
import { GAN, HIDDEN, HIDDEN_WEIGHT, WX_VI } from './constants.js';
import { tongGen } from './tonggen.js';

const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }; // a sinh b

/**
 * @returns {{ deLenh, deDia, deShi, count, dmWx, monthMainWx, root, verdict, driver, summary }}
 */
export function strength3Fa(R) {
  const dmWx = R.chart.dayMaster.wx;
  const monthMainWx = R.strength?.monthMainWx;
  const pillars = R.chart.pillars;

  // 1) 得令: 日主 hành = lệnh hoặc lệnh sinh 日主 (Ấn)
  const deLenh = monthMainWx === dmWx || SHENG[monthMainWx] === dmWx;

  // 2) 得地: thông căn (tổng căn of 日主 hành)
  const root = tongGen(R.chart, dmWx);
  const deDia = root.total >= 1.0; // có căn đáng kể

  // 3) 得势: đếm Tỷ Kiếp (cùng hành) ở 3 thiên can phi nhật + tàng can
  let biCount = 0;
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    if (k !== 'day' && GAN[p.gan].wx === dmWx) biCount += 1; // thiên can tỷ
    (p.hidden || []).forEach((h) => { if (GAN[h.gan].wx === dmWx) biCount += 0.5; }); // tàng tỷ (nửa sức)
  }
  const deShi = biCount >= 1.5;

  const count = [deLenh, deDia, deShi].filter(Boolean).length;

  // Ấn lực (resource) — để detect «mạnh do Ấn»
  const yinWx = SHENG[dmWx] ? (Object.entries(SHENG).find(([, v]) => v === dmWx) || [])[0] : null; // hành sinh dm
  const yinRoot = yinWx ? tongGen(R.chart, yinWx).total : 0;

  let verdict, driver;
  if (count >= 2) { verdict = 'Thân mạnh (chính thống)'; driver = `đạt ${count}/3 pháp (${[deLenh && 'đắc lệnh', deDia && 'đắc địa', deShi && 'đắc thế'].filter(Boolean).join(', ') || 'không'}).`; }
  else if (count === 1) { verdict = 'Thân nhược nhẹ'; driver = `chỉ đạt 1/3 pháp.`; }
  else { verdict = 'Thân nhược'; driver = `không đạt pháp nào trong 3 pháp.`; }

  // đặc biệt: mạnh do Ấn (resource vượng) dù 3 pháp yếu
  let note = '';
  if (R.strength?.strong && count <= 1 && yinRoot >= 1.5) {
    verdict = `Thân NHƯỢC (theo 3 pháp) nhưng chức năng THÂN MẠNH do Ấn (${WX_VI[yinWx]}) vượng`;
    note = ` → «mạnh do Ấn» (căn ${yinRoot.toFixed(1)}): mạnh nhưng dễ thụ động/phụ thuộc/ít quyết đoán, cần khắc phục bằng Dụng (Tài/Thực) thúc đẩy hành động.`;
  }

  const summary = `Nhật Chủ ${WX_VI[dmWx]}: ${verdict}. ${driver}${note} (得令=${deLenh ? '✓' : '✗'}, 得地=${deDia ? '✓' + ` (căn ${root.total})` : '✗'}, 得势=${deShi ? '✓' + ` (tỷ ${biCount})` : '✗'}).`;

  return { deLenh, deDia, deShi, count, dmWx, monthMainWx, root: root.total, biCount, yinWx, yinRoot, verdict, driver, note, summary };
}

export { SHENG };
