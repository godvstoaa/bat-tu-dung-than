// ============================================================================
//  SỰ KIỆN NGHIỆM SỐ 事件验算 — PAST EVENT VERIFICATION
//  "Năm X tôi cưới/đổi việc/mất tiền/ốm — lá số có dự báo không?"
//  Nhập sự kiện + năm → kiểm chứng đa hệ thống → đánh giá độ chính xác.
//  Nguồn: 子平 实断, 滴天髓 应期.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { analyzeLiunianDeep } from './liunian-pro.js';
import { liunian12Shen } from './liunian-shen.js';
import { personalTaSui } from './taisui.js';
import { tenGod } from './core.js';
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';

const EVENT_TYPES = {
  marriage: { vi: 'Cưới hỏi/Kết hôn', expect: 'Chính Tài/Chính Quan + Đào Hoa + cung Phu Thê', keywords: ['tài', 'quan', 'đào hoa', 'hợp'] },
  breakup: { vi: 'Chia tay/Ly hôn', expect: 'Kiếp Tài/Xung Nhật Chi + thương quan kiến quan', keywords: ['kiếp', 'xung', 'thương quan', 'tang môn'] },
  newJob: { vi: 'Đổi việc/Thăng chức', expect: 'Chính Quan/Ấn + Dụng Thần', keywords: ['quan', 'ấn', 'dụng', 'thăng'] },
  jobLoss: { vi: 'Mất việc/Thất nghiệp', expect: 'Kiếp Tài/Thương Quan + Sát', keywords: ['kiếp', 'thương', 'sát', 'xung'] },
  wealth_gain: { vi: 'Kiếm được tiền/Phát tài', expect: 'Chính/Thiên Tài + Dụng Thần', keywords: ['tài', 'dụng', 'cát'] },
  wealth_loss: { vi: 'Mất tiền/Phá tài', expect: 'Kiếp Tài + Kỵ Thần + Thương Quan', keywords: ['kiếp', 'kỵ', 'thương', 'hung'] },
  illness: { vi: 'Ốm đau/Bệnh', expect: 'Thất Sát + Kỵ Thần + Bạch Hổ/死符', keywords: ['sát', 'kỵ', 'bạch hổ', 'tử phù'] },
  move: { vi: 'Dọn nhà/Chuyển nơi', expect: 'Dịch Mã + Lưu Niên Xung Nhật Chi', keywords: ['dịch mã', 'xung', 'thiên di'] },
  birth_child: { vi: 'Sinh con', expect: 'Thực Thương/Quan Sát + Tử Nữ cung kích hoạt', keywords: ['thực', 'thương', 'quan', 'tử nữ'] },
  travel: { vi: 'Đi xa/Du học/Xuất cảnh', expect: 'Dịch Mã + Thiên Di cung + Lưu Niên Dụng', keywords: ['dịch mã', 'thiên di', 'lưu'] },
  legal: { vi: 'Quan phi/Khẩu thiệp', expect: 'Quan Phù/Thương Quan Kiến Quan + Kỵ Thần', keywords: ['quan phù', 'thương quan kiến quan', 'kỵ'] },
  study_success: { vi: 'Đỗ thi/Thành tích tốt', expect: 'Chính Ấn/Thực Thần + Dụng Thần + Văn Xương', keywords: ['ấn', 'thực', 'dụng', 'văn xương'] },
};

/**
 * @param {object} R - kết quả analyze()
 * @param {number} eventYear - năm sự kiện
 * @param {string} eventType - key từ EVENT_TYPES
 * @param {string} eventDesc - mô tả tự do
 * @returns {{ eventYear, eventType, eventVi, expected, found, accuracy, confidence, details, verdict }}
 */
export function verifyPastEvent(R, eventYear, eventType, eventDesc) {
  const birthZhi = R.chart.pillars.year.zhi;
  const dayGan = R.chart.dayGan;
  const info = EVENT_TYPES[eventType] || { vi: 'Sự kiện khác', expect: 'Dụng/Kỵ Thần', keywords: ['dụng', 'kỵ'] };

  const details = [];
  let matchScore = 0;
  let maxScore = 0;

  // 1. Lưu niên 6 phái
  const ln = analyzeLiunianDeep(R, eventYear);
  maxScore += 3;
  const lnTone = ln.score >= 62 ? 'cát' : ln.score >= 46 ? 'trung' : 'hung';
  if ((info.keywords.some(k => ln.schools.some(s => (s.note || '').includes(k) || (s.note || '').toLowerCase().includes(k))))) {
    matchScore += 2;
    const hits = ln.schools.filter(s => info.keywords.some(k => (s.note || '').includes(k) || (s.note || '').toLowerCase().includes(k)));
    details.push(`6 phái: ${ln.rating} (${ln.score}/100) — khớp: ${hits.map(h => h.note.slice(0, 40)).join('; ')}`);
  } else {
    details.push(`6 phái: ${ln.rating} (${ln.score}/100) — ${lnTone}, không khớp rõ kiểu sự kiện.`);
  }

  // 2. 12 thần
  const yearZhi = Solar.fromYmdHms(eventYear, 6, 15, 12, 0, 0).getLunar().getYearZhi();
  const s12 = liunian12Shen(birthZhi, yearZhi);
  maxScore += 1;
  const eventGodMatch = {
    marriage: ['太阳', '太阴', '福德'], // [cycle 47] bỏ 天喜 (không thuộc hệ 12 thần lưu niên, là 红鸾系 → dead option)
    breakup: ['太岁', '白虎', '吊客', '官符'],
    wealth_gain: ['福德', '龙德', '太阳', '太阴'],
    wealth_loss: ['太岁', '岁破', '白虎', '病符'],
    illness: ['白虎', '病符', '死符', '太岁'],
    move: ['太岁', '岁破'],
    legal: ['官符', '白虎', '太岁'],
  };
  const expectedGods = eventGodMatch[eventType] || [];
  if (expectedGods.includes(s12.god.zh)) {
    matchScore += 1;
    details.push(`12 thần: ${s12.god.zh} (${s12.god.vi}) ✓ KHỚP với sự kiện "${info.vi}".`);
  } else {
    details.push(`12 thần: ${s12.god.zh} (${s12.god.vi}) — không trực tiếp khớp.`);
  }

  // 3. Thái tuế
  const ts = personalTaSui(birthZhi, yearZhi);
  maxScore += 1;
  const tsBad = ['marriage', 'wealth_loss', 'illness', 'legal', 'breakup'].includes(eventType);
  if (ts?.offends && tsBad) {
    matchScore += 1;
    details.push(`Thái tuế: ⚡ PHẠM ✓ khớp sự kiện bất lợi "${info.vi}".`);
  } else if (!ts?.offends && !tsBad) {
    matchScore += 0.5;
    details.push(`Thái tuế: không phạm ✓ phù hợp sự kiện thuận lợi.`);
  } else {
    details.push(`Thái tuế: ${ts?.offends ? 'phạm' : 'không phạm'} — không khớp hướng sự kiện.`);
  }

  // 4. Lưu niên thập thần [loop 24 sửa] — godMatch GIỚI TÍNH-aware.
  //   marriage: nam → vợ=Tài(正/偏), nữ → chồng=Quan(正官/七殺). Trước đây ['正財','正官']
  //   cố định → nữ năm 七殺 (sao chồng) báo "không khớp" sai. birth_child cũng theo giới.
  const yearGan = Solar.fromYmdHms(eventYear, 6, 15, 12, 0, 0).getLunar().getYearGan();
  const lnGod = tenGod(dayGan, yearGan);
  const isMale = (R.chart.input && R.chart.input.gender) === 'nam';
  maxScore += 2;
  const spouseGods = isMale ? ['正財', '偏財'] : ['正官', '七殺']; // hôn nhân theo giới
  const childGods = isMale ? ['七殺', '正官'] : ['食神', '傷官'];   // con cái theo giới
  const godMatch = {
    marriage: spouseGods,
    breakup: ['劫財', '傷官', '七殺'],
    newJob: ['正官', '正印', '七殺'],
    jobLoss: ['七殺', '劫財', '傷官'],
    wealth_gain: ['正財', '偏財'],
    wealth_loss: ['劫財', '傷官'],
    illness: ['七殺', '偏印'],
    birth_child: childGods,
    study_success: ['正印', '食神'], // [loop 84] bỏ '文昌' (神煞, không phải thập thần → lnGod KHÔNG bao giờ = 文昌, dead entry)
    legal: ['傷官', '七殺', '偏官'],
  };
  const expectedGods2 = godMatch[eventType] || [];
  if (expectedGods2.includes(lnGod)) {
    matchScore += 2;
    details.push(`Lưu niên thập thần: ${TEN_GOD_VI[lnGod]} ✓ KHỚP (mong đợi: ${expectedGods2.map(g=>TEN_GOD_VI[g]).join('/')}).`);
  } else {
    details.push(`Lưu niên thập thần: ${TEN_GOD_VI[lnGod]} — mong đợi ${expectedGods2.map(g=>TEN_GOD_VI[g]).join('/')}, không khớp.`);
  }

  // Tổng hợp
  const accuracy = Math.round((matchScore / maxScore) * 100);
  let confidence;
  if (accuracy >= 70) confidence = 'CAO — lá số dự báo sự kiện này rõ ràng (độ tin cậy cao).';
  else if (accuracy >= 45) confidence = 'TRUNG — có tín hiệu phù hợp nhưng chưa đủ rõ.';
  else confidence = 'THẤP — lá số không dự báo rõ sự kiện này (có thể giờ sinh chưa chính xác hoặc đây là biến ngoại).';

  let verdict;
  if (accuracy >= 70) verdict = '✅ NGHIỆM — sự kiện khớp với lá số.';
  else if (accuracy >= 45) verdict = '🟡 KHÁ NGHIỆM — khớp một phần.';
  else verdict = '❌ KHÔNG NGHIỆM — sự kiện không khớp lá số (kiểm tra giờ sinh).';

  return { eventYear, eventType, eventVi: info.vi, eventDesc, expected: info.expect,
    found: details, accuracy, confidence, verdict, lnScore: ln.score, lnRating: ln.rating, lnGod: TEN_GOD_VI[lnGod],
    god12: s12.god.zh, taiSuiOffends: !!ts?.offends };
}
