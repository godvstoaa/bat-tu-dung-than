// ============================================================================
//  财官 透干 应期 — SCANNER NĂM KÍCH HOẠT SAO TÀI/QUAN (透干)
//  "Bao giờ sao TÀI (tiền) / QUAN (sự nghiệp) của tôi thực sự phát?" — scanner透干.
//  * Nếu sao Tài/Quan bẩm sinh 藏而不透 (có căn nhưng ẩn) hoặc 虚 → đợi LƯU NIÊN
//    mang CAN CÙNG HÀNH sao đó đến THẤU CÁN mới «kích hoạt», sao từ ẩn → hiện, phát lực.
//  * Tài (hành khắc ra) = tiền/vợ(nam); Quan (hành khắc ta) = sự nghiệp/quyền/chồng(nữ).
//    Năm có can = hành Tài → năm TIỀN phát; can = hành Quan → năm SỰ NGHIỆP/thăng tiến.
//  * Complement star-power (xác định 藏/虚) + golden-year (xét tổng quát) — module này
//    tập trung kích hoạt SAO RIÊNG (财/官) theo透干.
//  Nguồn: 子平真诠 透干应期, 滴天髓 财官真伪, 渊海子平 用神引出.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, WX_VI } from './constants.js';
import { starPower } from './star-power.js';

const DM_CAI = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' }; // 日主 khắc ra = Tài
const DM_GUAN = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' }; // khắc 日主 = Quan

function yearGan(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  return s.getLunar().getEightChar().getYearGan();
}

/**
 * @param {object} R
 * @param {number} fromYear, count
 * @returns {{ caiWx, guanWx, caiStatus, guanStatus, caiYears, guanYears, summary }}
 */
export function scanWealthCareerYingqi(R, fromYear, count = 12) {
  const start = fromYear || new Date().getFullYear();
  const dmWx = R.chart.dayMaster.wx;
  const caiWx = DM_CAI[dmWx], guanWx = DM_GUAN[dmWx];

  // trạng thái sao (từ star-power): có lực hay ẩn/hư
  let caiStatus = '?', guanStatus = '?';
  try {
    const sp = starPower(R);
    const c = sp.items.find((x) => x.key === 'cai'); if (c) caiStatus = c.verdict;
    const g = sp.items.find((x) => x.key === 'guan'); if (g) guanStatus = g.verdict;
  } catch (e) {}

  const caiYears = [], guanYears = [];
  for (let i = 0; i < count; i++) {
    const y = start + i;
    const g = yearGan(y);
    if (GAN[g].wx === caiWx) caiYears.push({ year: y, ganZhi: g + Solar.fromYmdHms(y, 6, 15, 12, 0, 0).getLunar().getEightChar().getYearZhi(), note: `can ${g} (${WX_VI[caiWx]}) thấu → TÀI sao kích hoạt` });
    if (GAN[g].wx === guanWx) guanYears.push({ year: y, ganZhi: g + Solar.fromYmdHms(y, 6, 15, 12, 0, 0).getLunar().getEightChar().getYearZhi(), note: `can ${g} (${WX_VI[guanWx]}) thấu → QUAN sao kích hoạt` });
  }

  const latent = (s) => s === '藏而不透' || s === '虚' || s === '虚浮';
  let summary = `Sao TÀI (${WX_VI[caiWx]}) ${caiStatus}, sao QUAN (${WX_VI[guanWx]}) ${guanStatus}. `;
  if (latent(caiStatus) || latent(guanStatus)) summary += `Sao đang ẩn/hư → cần LƯU NIÊN can cùng hành THẤU CÁN mới phát. `;
  summary += `Năm KÍCH HOẠT TÀI (${WX_VI[caiWx]} can): ${caiYears.length ? caiYears.map((y) => y.year + '(' + y.ganZhi + ')').join(', ') : '(không trong 12 năm tới)'}.`;
  summary += ` Năm KÍCH HOẠT QUAN (${WX_VI[guanWx]} can): ${guanYears.length ? guanYears.map((y) => y.year + '(' + y.ganZhi + ')').join(', ') : '(không)'}.`;
  summary += (latent(caiStatus) && caiYears.length) ? ` → ${caiYears[0].year} là cơ hội TÀI đầu tiên.` : '';

  return { caiWx, guanWx, caiStatus, guanStatus, caiYears, guanYears, summary };
}

export { DM_CAI, DM_GUAN };
