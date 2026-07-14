// ============================================================================
//  流年 婚恋 应期 — SCANNER NĂM HÔN/LUYÊN (红鸾/天喜/桃花 đến + 配偶星 thấu)
//  "Năm nào tôi gặp duyên / kết hôn?" — quét lưu niên tìm năm kích hoạt hôn nhân.
//  * Khác marriage-deep (sao 红鸾/天喜 BẨM SINH theo năm sinh + goodYears theo Dụng):
//    module này quét từng LƯU NIÊN sắp tới, kiểm kích hoạt:
//    1) 红鸾/天喜 (theo chi lưu niên) ĐẾN 配偶 cung (日支) hoặc 本命 (年支) → tín hiệu hôn nhân mạnh.
//    2) 配偶 tinh thấu CAN (nam: Chính/Thiên Tài; nữ: Chính Quan/Thất Sát) → năm sao vợ/chồng đến.
//    3) 桃花/红艳 đến cung → duyên tình (kết hôn nhẹ hơn).
//  * Tổng điểm → xếp hạng năm cát hôn nhân / duyên tình.
//  Nguồn: 渊海子平 红鸾天喜流年, 三命通会 配偶星应期, 桃花流年到命.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { HONGLUAN, TIANXI } from './marriage-deep.js';
import { TAOHUA, HONGYAN } from './taohua.js';

function yearGanZhi(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const ec = s.getLunar().getEightChar();
  return { gan: ec.getYearGan(), zhi: ec.getYearZhi() };
}

/**
 * @param {object} R — analyze()
 * @param {number} fromYear, count
 * @returns {{ years:[{year,ganZhi,score,signals:[],type}], topMarriage, topRomance, summary }}
 */
export function scanMarriageTiming(R, fromYear, count = 12) {
  const start = fromYear || new Date().getFullYear();
  const isMale = R.chart.input.gender === 'nam';
  const dayGan = R.chart.dayGan;
  const dayZhi = R.chart.pillars.day.zhi;       // 配偶 cung
  const yearZhiBirth = R.chart.pillars.year.zhi; // 本命
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺'];
  // [SAME-SEX] nếu user khai đối tượng cùng giới → đọc «sao phối ngẫu» từ NGÀY CHI (Phu Thê cung,
  //   universal) thay vì Tài/Quan gendered. (Phương pháp day-branch universal — defensible.)
  const _normG = (g) => ({ nam: 'nam', 'nữ': 'nu', nu: 'nu', male: 'nam', female: 'nu' })[String(g || '').toLowerCase()] || '';
  const _partner = _normG(R.chart.input.partner);
  const _sameSex = !!(_partner && _partner === _normG(R.chart.input.gender));
  const spouseGodsFinal = _sameSex
    ? (R.chart.pillars.day.hidden || []).map((h) => h.god).filter((g) => g && g !== '日主')
    : spouseGods;

  const years = [];
  // [loop 28 sửa CRITICAL] 红鸾/天喜 là sao CỐ ĐỊNH theo NĂM SINH (年命), KHÔNG phải năm lưu.
  //   Trước đây HONGLUAN[zhi_lưu] (红鸾-của-năm-lưu — vô nghĩa cổ pháp) so với nhật chi → gắn
  //   SAI năm cưới. Đúng: chi năm lưu ĐẾN vị 红鸾 cố định của năm sinh. marriage-deep.js làm đúng.
  const hongLuanStar = HONGLUAN[yearZhiBirth];
  const tianXiStar = TIANXI[yearZhiBirth];
  // Lục hợp / Lục xung nhật chi (cung phu thê) — fixed maps
  const LH = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];
  const CHONG_M = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };
  for (let i = 0; i < count; i++) {
    const y = start + i;
    const { gan, zhi } = yearGanZhi(y);
    const signals = [];
    let score = 0;

    // 1) 红鸾/天喜 (cố định năm sinh) ĐẾN — chi năm lưu trùng sao
    if (zhi === hongLuanStar) { score += 3; signals.push(`红鸾(${hongLuanStar}) ĐẾN (chi năm ${zhi}) → TÍN HIỆU HÔN NHÂN mạnh`); }
    if (zhi === tianXiStar) { score += 2; signals.push(`天喜(${tianXiStar}) ĐẾN → cát hỉ, dễ có việc vui (hôn/thai)`); }
    // 2) 配偶 tinh thấu can
    const g = tenGod(dayGan, gan);
    if (spouseGodsFinal.includes(g)) { score += 2; signals.push(_sameSex ? `ngày chi (Phu Thê cung) god (${g}) thấu can năm → partner signal` : `配偶 tinh (${g}) thấu can năm → sao vợ/chồng hiện`); }
    // 3) 桃花 năm = chi năm TRÙNG vị đào hoa BẢN MỆNH. [cycle 60 sửa H1] trước đây `taoHua === dayZhi`
    //   ĐẢO (tính đào hoa của NĂM rồi so ngày chi → sai hướng). Đúng: chi năm == TAOHUA[ngày chi/năm sinh chi].
    if (zhi === TAOHUA[dayZhi] || zhi === TAOHUA[yearZhiBirth]) { score += 1; signals.push(`桃花(${zhi}) đến → duyên tình (hôn nhẹ)`); }
    // 红艳 theo can năm == 日支
    if (HONGYAN[dayGan] === zhi) { score += 1; signals.push(`红艳 năm → duyên mạnh`); }
    // [loop 28 thêm] 日支 (cung phu thê) 合/冲 — trigger hôn nhân chính
    if (LH.some((p) => p === zhi + dayZhi || p === dayZhi + zhi)) { score += 2; signals.push(`流年 chi ${zhi} LỤC HỢP 日支 ${dayZhi} (cung phu thê) → TRIGGER hôn nhân/gia đạo`); }
    if (CHONG_M[dayZhi] === zhi) { score += 1; signals.push(`⚡流年 chi ${zhi} XUNG 日支 ${dayZhi} → biến động hôn nhân (cưới HOẶC ly)`); }

    if (score > 0) years.push({ year: y, ganZhi: gan + zhi, score, signals, type: score >= 4 ? 'hôn nhân' : score >= 2 ? 'duyên tình' : 'nhẹ' });
  }

  years.sort((a, b) => b.score - a.score);
  const topMarriage = years.filter((y) => y.score >= 4);
  const topRomance = years.filter((y) => y.score >= 2 && y.score < 4);

  let summary;
  if (!years.length) summary = `${count} năm tới (${start}–${start + count - 1}) KHÔNG có năm kích hoạt婚恋 nổi bật (theo 红鸾/天喜/配偶星/桃花) — duyên đến mượt theo lưu nguyệt, hoặc cần主动 mở lòng + chọn người bổ Dụng.`;
  else {
    summary = `Năm cát HÔN NHÂN (${start}–${start + count - 1}): ${topMarriage.length ? topMarriage.map((y) => `${y.year}(${y.ganZhi},${y.score}đ)`).join(', ') : '(không có năm ≥4đ — duyên nhẹ)'}.` +
      (topRomance.length ? ` Năm DUYÊN TÌNH: ${topRomance.map((y) => `${y.year}(${y.score}đ)`).join(', ')}.` : '') +
      ` Tín hiệu mạnh nhất: ${years[0].year} — ${years[0].signals[0]}.`;
  }
  return { years, topMarriage, topRomance, summary };
}

export { HONGLUAN, TIANXI, TAOHUA, HONGYAN };
