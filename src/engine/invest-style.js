// ============================================================================
//  ĐẦU TƯ LÝ TÀI 風格 投資理財 — INVESTMENT STYLE BY BAZI
//  "Đầu tư gì? Giữ hay đánh nhanh? Bao nhiêu % rủi ro? Khi nào vào/ra?"
//  Khác wealth-star.js (đánh giá tài tinh): tập trung CHIẾN LƯỢC đầu tư.
//  Nguồn: 滴天髓 财格论, 渊海子平 投资篇.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { dominantGod } from './dominant-god.js'; // [cycle 50] thần chủ gồm cả TÀNG CAN (đồng bộ "tuýp người")

// Ngũ hành → loại tài sản
const WX_ASSETS = {
  木: {
    growth: ['quỹ giáo dục', 'nông-lâm nghiệp', 'công ty xanh/ESG', 'startup'],
    stable: ['BĐS vùng nông thôn/ven đô', 'trồng trọt', 'nội thất gỗ'],
    avoid: ['sản xuất thép/nặng', 'hóa chất'],
    timing: 'xuân (T1-T3) thuận; thu (T7-T9) bất lợi (Kim khắc)',
  },
  火: {
    growth: ['công nghệ/tech', 'truyền thông', 'F&B', 'mỹ phẩm', 'năng lượng'],
    stable: ['BĐS thành phố lớn', 'chứng khoán công nghệ', 'startup internet'],
    avoid: ['nước/thủy lợi', 'đóng tàu'],
    timing: 'hạ (T4-T6) thuận; đông (T10-T12) bất lợi (Thủy khắc)',
  },
  土: {
    growth: ['BĐS', 'xây dựng', 'bảo hiểm', 'gốm sứ', 'nông nghiệp'],
    stable: ['BĐS cho thuê (lâu dài)', 'trái phiếu', 'vàng', 'tiết kiệm'],
    avoid: ['giao dịch quá nhanh/day trading', 'sản xuất gỗ'],
    timing: 'quý mùa (chuyển giao) thuận; xuân (T1-T3) bất lợi (Mộc khắc)',
  },
  金: {
    growth: ['tài chính/ngân hàng', 'cơ khí', 'trang sức/vàng', 'công nghệ phần cứng'],
    stable: ['vàng vật chất', 'ngoại tệ mạnh', 'chứng khoán blue chip', 'quỹ chỉ số'],
    avoid: ['cây gỗ/nông nghiệp', 'F&B'],
    timing: 'thu (T7-T9) thuận; hạ (T4-T6) bất lợi (Hỏa khắc)',
  },
  水: {
    growth: ['logistics', 'thương mại điện tử', 'XNK', 'du lịch', 'tài chính lưu thông'],
    stable: ['tiền mặt (thanh khoản cao)', 'quỹ mở', 'crypto (vừa)', 'logistics BĐS'],
    avoid: ['BĐS cố định quá lâu', 'nông nghiệp khô khan'],
    timing: 'đông (T10-T12) thuận; quý mùa (chuyển giao) bất lợi (Thổ khắc)',
  },
};

// Thập thần → phong cách đầu tư
const GOD_INVEST = {
  正官: { style: 'an toàn, kỷ luật, dài hạn', risk: 2, desc: 'đầu tư theo quy định, ưa trái phiếu/BĐS ổn, kỷ luật định kỳ — ít rủi ro' },
  七殺: { style: 'quyết đoán, rủi ro cao, nhanh', risk: 5, desc: 'thích rủi ro, đánh nhanh thắng nhanh, kinh doanh/đầu cơ — cần kiểm soát' },
  正財: { style: 'tích lũy đều, bảo thủ', risk: 2, desc: 'ưu tiên giữ tiền, tiết kiệm, BĐS sinh lời ổn — không đầu cơ' },
  偏財: { style: 'biến động lớn, đầu cơ', risk: 4, desc: 'thích tài lớn bất ngờ, đầu cơ/chứng khoán/crypto — thắng lớn mất lớn' },
  正印: { style: 'dài hạn, an toàn, học hỏi', risk: 2, desc: 'đầu tư có nghiên cứu, ưa quỹ/BĐS dài hạn — kiên nhẫn' },
  偏印: { style: 'độc lạ, phi chính thống', risk: 3, desc: 'đầu tư niche, huyền học, nghệ thuật — giỏi nhưng hay nghi' },
  食神: { style: 'từ từ, sinh lời tự nhiên', risk: 2, desc: 'tài hoa sinh tiền, kinh doanh nhỏ, F&B — vui vẻ' },
  傷官: { style: 'sáng tạo, phá cách, biến động', risk: 4, desc: 'startup, tech, đầu tư phi truyền thống — giỏi nhưng hao' },
  比肩: { style: 'hợp tác, bình đẳng', risk: 3, desc: 'đầu tư cùng bạn bè/đối tác — nên rõ ràng hợp đồng' },
  劫財: { style: '⚠ RỦI RO CAO — hao tiền', risk: 5, desc: 'DẶC BIỆT CẢNH BÁO: dễ hao tiền qua đầu cơ/cho vay — TRÁNH day trading' },
};

/**
 * @returns {{ dmInvestStyle, riskScore, dungAssets, riskAssets, avoidAssets,
 *            allocation, timingAdvice, canDayTrade, advice }}
 */
export function investmentStyle(R) {
  const { chart, yong, strength, dayun } = R;
  const dmWx = chart.dayMaster.wx;
  const dungWx = yong.primary;
  const dayGan = chart.dayGan;

  // 1. Thập thần phong cách — dùng dominantGod (gồm cả TÀNG CAN, đồng bộ headline "tuýp người")
  // [cycle 50] trước đây chỉ đếm can năm/tháng/giờ → bỏ sót tàng can → topGod có thể lệch dominant-god.
  const dg = dominantGod(R);
  const topGod = dg.ranked[0]?.god || '正官';
  const hasJieCai = dg.ranked.some((r) => r.god === '劫財'); // có Kiếp Tài (kể cả tàng) → cấm day-trade
  const investStyle = GOD_INVEST[topGod] || GOD_INVEST['正官'];

  // 2. Tài sản theo Dụng Thần
  const dungAssets = WX_ASSETS[dungWx] || WX_ASSETS['土'];
  const kyAssets = WX_ASSETS[yong.ji] || WX_ASSETS['木'];

  // 3. Phân bổ (allocation) dựa: thân vượng/nhược + rủi ro thập thần
  let riskScore = investStyle.risk;
  // [loop 565 FIX] strength.strong undefined → !undefined=true → luôn -1 (coi nhược). Nay explicit.
  if (strength.strong === true) riskScore += 1; // vượng → dám rủi ro hơn
  else if (strength.strong === false) riskScore -= 1; // nhược → cần an toàn hơn
  riskScore = Math.max(1, Math.min(5, riskScore));

  // Allocation theo risk
  let allocation;
  if (riskScore <= 2) allocation = { BĐS: 40, trái_phiếu: 25, tiết_kiệm: 20, chứng_khoán: 10, đầu_cơ: 5 };
  else if (riskScore === 3) allocation = { BĐS: 30, chứng_khoán: 25, trái_phiếu: 15, tiết_kiệm: 15, đầu_cơ_kinh_doanh: 15 };
  else if (riskScore === 4) allocation = { chứng_khoán: 30, BĐS: 20, kinh_doanh: 20, đầu_cơ: 20, thanh_khoản: 10 };
  else allocation = { đầu_cơ: 30, kinh_doanh: 25, chứng_khoán: 20, thanh_khoản: 15, BĐS: 10 };

  // 4. Day trading? [cycle 50] dùng hasJieCai (kể cả tàng can) thay topGod — Kiếp Tài ẩn vẫn cấm day-trade
  const canDayTrade = riskScore >= 4 && !hasJieCai;
  // Kiếp Tài → KHÔNG day trade dù risk cao
  const dayTradeNote = hasJieCai
    ? '⚠ CÓ Kiếp Tài → TUYỆT ĐỐI KHÔNG day trading — dễ phá sản.'
    : canDayTrade ? '✓ Có thể day trading (rủi ro cao, kỷ luật thoát lỗ).' : 'Không nên day trading — ưu tiên đầu tư dài hạn.';

  // 5. Timing
  const goodDayun = (dayun || []).filter(d => d.score >= 1).slice(0, 3).map(d => `${d.ganZhi}[${d.startAge}t]`);

  const advice = `Phong cách: ${investStyle.style} (risk ${riskScore}/5). ` +
    `Đầu tư Dụng ${WX_VI[dungWx]}: ${dungAssets.growth.slice(0,2).join(', ')}. ` +
    `An toàn: ${dungAssets.stable.slice(0,2).join(', ')}. ` +
    `Phân bổ: ${Object.entries(allocation).map(([k,v])=>`${v}% ${k}`).join(', ')}. ` +
    `${dayTradeNote} ` +
    (goodDayun.length ? `Thời điểm tốt: ${goodDayun.join(', ')}.` : '');

  return {
    dmWx, dmVi: WX_VI[dmWx], topGod, topGodVi: TEN_GOD_VI[topGod] || topGod,
    style: investStyle.style, riskScore, investDesc: investStyle.desc,
    dungAssets: dungAssets.growth, dungStable: dungAssets.stable,
    avoidAssets: dungAssets.avoid, timingNote: dungAssets.timing,
    kyAssets: kyAssets.growth.slice(0, 2),
    allocation, canDayTrade, dayTradeNote,
    goodDayun, advice,
  };
}
