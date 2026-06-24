// ============================================================================
//  THẬP NHỊ SINH TIAO 十二生肖 — ZODIAC DEEP: TÍNH CÁCH + TƯƠNG HỢP/XUNG
//  "Tôi tuổi Gà tính cách sao? Hợp tuổi nào? Kỵ tuổi nào?"
//  Entry point phổ biến nhất — 12 con giáp × tính cách + 6 cấp tương tác.
//  Nguồn: 渊海子平 生肖篇, 三命通会 生肖论.
// ============================================================================
import { ZHI } from './constants.js';

// 12 chi = 12 con giáp
const ZODIAC = {
  子: { animal: 'Chuột (鼠)', vi: 'Tý', wx: '水', time: '23-1h',
    personality: 'thông minh, lanh lợi, thích nghi nhanh, giỏi tích lũy, hay lo nghĩ; mưu mô nếu âm',
    career: 'thương mại, tài chính, nghiên cứu, logistic, 夜kup',
    love: 'cần an toàn,忠实 nhưng hay đa nghi; chọn người ổn định',
    health: 'thận, tiết niệu, xương; cần giữ ấm bụng dưới',
    wealth: 'tích lũy đều, giỏi giữ tiền, hợp đầu tư dài hạn' },
  丑: { animal: 'Trâu (牛)', vi: 'Sửu', wx: '土', time: '1-3h',
    personality: 'chăm chỉ, kiên nhẫn, đáng tin, cứng đầu, chậm thay đổi; sức bền lớn',
    career: 'nông nghiệp, xây dựng, quản lý, kỹ thuật, cơ khí',
    love: 'trung thành, truyền thống, chậm yêu nhưng sâu; cần kiên nhẫn',
    health: 'tỳ vị, cơ nhục, khớp; cần vận động đều',
    wealth: 'tích lũy chậm nhưng chắc; BĐS/vàng' },
  寅: { animal: 'Hổ (虎)', vi: 'Dần', wx: '木', time: '3-5h',
    personality: 'dũng cảm, lãnh đạo, độc lập, thích phiêu lưu; dễ bốc đồng, cứng đầu',
    career: 'quân sự, cảnh sát, doanh nhân, thể thao, lãnh đạo',
    love: 'mạnh mẽ, chiếm hữu, cần người nhường; nam quyền',
    health: 'gan, gân cốt, tim; tránh nóng giận',
    wealth: 'dám rủi ro, đánh nhanh; hợp kinh doanh' },
  卯: { animal: 'Mèo (兔)', vi: 'Mão', wx: '木', time: '5-7h',
    personality: 'nhu hòa, duyên dáng, khéo léo, nhạy cảm; dễ nhút nhát, thiếu quyết đoán',
    career: 'nghệ thuật, ngoại giao, y tế, giáo dục, thẩm mỹ',
    love: 'lãng mạn, nhẹ nhàng, cần an toàn; dễ tổn thương',
    health: 'gan, thần kinh, mắt; dưỡng tĩnh',
    wealth: 'ổn định, không mạo hiểm; tiết kiệm + nhẹ đầu tư' },
  辰: { animal: 'Rồng (龙)', vi: 'Thìn', wx: '土', time: '7-9h',
    personality: 'uy quyền, tự tin, hào phóng, có chí lớn; dễ kiêu ngạo, độc đoán',
    career: 'lãnh đạo, chính trị, CEO, kinh doanh lớn',
    love: 'mạnh mẽ, cần người xứng đáng; đôi khi áp đặt',
    health: 'tỳ, vị, da; cần kiểm soát ăn uống',
    wealth: 'tài lớn, dám đầu tư lớn; BĐS lớn, công ty' },
  巳: { animal: 'Rắn (蛇)', vi: 'Tỵ', wx: '火', time: '9-11h',
    personality: 'sâu sắc, trực giác mạnh, khôn ngoan, quyến rũ; dễ đa nghi, ghen tuông',
    career: 'nghiên cứu, huyền học, tài chính, phân tích, tâm lý',
    love: 'sâu đậm, chiếm hữu cao, dễ ghen; cần trung thành tuyệt đối',
    health: 'tim, máu, thần kinh; giảm stress',
    wealth: 'tính toán kỹ, giỏi phân tích; chứng khoán, đầu tư có nghiên cứu' },
  午: { animal: 'Ngựa (马)', vi: 'Ngọ', wx: '火', time: '11-13h',
    personality: 'nhiệt huyết, tự do, năng động, thích phiêu lưu; thiếu kiên nhẫn, nổi nóng',
    career: 'du lịch, thể thao, bán hàng, vận tải, giải trí',
    love: 'phóng khoáng, cần tự do; khó trói buộc',
    health: 'tim, mắt, huyết áp; giảm cường độ',
    wealth: 'dòng tiền nhanh nhưng hao; cần kỷ luật tiết kiệm' },
  未: { animal: 'Dê (羊)', vi: 'Mùi', wx: '土', time: '13-15h',
    personality: 'nhu hòa, sáng tạo, chăm sóc người; dễ nhút nhát, ưu tư',
    career: 'nghệ thuật, giáo dục, y tế, chăm sóc, thiết kế',
    love: 'dịu dàng, hy sinh, cần được bảo vệ; dễ bị lợi dụng',
    health: 'tỳ vị, tiêu hóa; ăn uống điều độ',
    wealth: 'ổn định, không rủi ro; tiết kiệm + BĐS nhỏ' },
  申: { animal: 'Khỉ (猴)', vi: 'Thân', wx: '金', time: '15-17h',
    personality: 'thông minh, linh hoạt, hài hước, thích nghi; dễ xảo quyệt, thiếu kiên nhẫn',
    career: 'công nghệ, kinh doanh, truyền thông, sáng tạo, đầu tư',
    love: 'vui vẻ, linh hoạt, cần phấn khích; khó cam kết',
    health: 'phổi, hô hấp, da; tránh khói bụi',
    wealth: 'linh hoạt đa dạng; hợp kinh doanh nhanh' },
  酉: { animal: 'Gà (鸡)', vi: 'Dậu', wx: '金', time: '17-19h',
    personality: 'thanh tú, cầu toàn, chỉn chu, thực tế; dễ phê bình, khắc khẩu',
    career: 'tài chính, luật, trang sức, mỹ phẩm, y khoa, quản lý',
    love: 'truyền thống, yêu gust hợp, chọn lọc; dễ phàn nàn',
    health: 'phổi, da, hô hấp; dưỡng ẩm, tránh khô',
    wealth: 'tính toán kỹ, chi tiêu hợp lý; vàng, ngoại tệ' },
  戌: { animal: 'Chó (狗)', vi: 'Tuất', wx: '土', time: '19-21h',
    personality: 'trung thành, chính trực, nghĩa khí, bảo vệ; dễ bi quan, cố chấp',
    career: 'cảnh sát, quân sự, bảo vệ, luật, an ninh, từ thiện',
    love: 'trung thành tuyệt đối, hy sinh; khó tha thứ phản bội',
    health: 'tỳ vị, cơ nhục; vận động đều',
    wealth: 'ổn định, không mạo hiểm; tiết kiệm + bảo hiểm' },
  亥: { animal: 'Heo (猪)', vi: 'Hợi', wx: '水', time: '21-23h',
    personality: 'thiện lương, bao dung, hưởng thụ, may mắn; dễ lười, thiếu ý chí',
    career: 'ẩm thực, khách sạn, giải trí, tài chính, thương mại',
    love: 'ấm áp, chung thủy, cần an toàn; hay bao dung quá',
    health: 'thận, tiêu hóa, béo phì; kiểm soát ăn uống',
    wealth: 'may mắn tài, dễ nhận được; BĐS, quỹ mở' },
};

// Tam hợp: 3 chi tạo thành cục ngũ hành
const SANHE = [
  { branches: ['申','子','辰'], wx: '水', vi: 'Thủy cục (Khỉ-Tý-Rồng)' },
  { branches: ['寅','午','戌'], wx: '火', vi: 'Hỏa cục (Hổ-Ngựa-Chó)' },
  { branches: ['巳','酉','丑'], wx: '金', vi: 'Kim cục (Rắn-Gà-Trâu)' },
  { branches: ['亥','卯','未'], wx: '木', vi: 'Mộc cục (Heo-Mèo-Dê)' },
];

// Lục hợp: 2 chi ám hợp
const LIUHE = [
  { pair: ['子','丑'], vi: 'Tý–Sửu' },
  { pair: ['寅','亥'], vi: 'Dần–Hợi' },
  { pair: ['卯','戌'], vi: 'Mão–Tuất' },
  { pair: ['辰','酉'], vi: 'Thìn–Dậu' },
  { pair: ['巳','申'], vi: 'Tỵ–Thân' },
  { pair: ['午','未'], vi: 'Ngọ–Mùi' },
];

// Lục xung: 6 cặp xung khắc
const CHONG_PAIRS = [
  { pair: ['子','午'], vi: 'Tý–Ngọ' },
  { pair: ['丑','未'], vi: 'Sửu–Mùi' },
  { pair: ['寅','申'], vi: 'Dần–Thân' },
  { pair: ['卯','酉'], vi: 'Mão–Dậu' },
  { pair: ['辰','戌'], vi: 'Thìn–Tuất' },
  { pair: ['巳','亥'], vi: 'Tỵ–Hợi' },
];

// Lục hại
const HAI_PAIRS = [
  { pair: ['子','未'], vi: 'Tý–Mùi' },
  { pair: ['丑','午'], vi: 'Sửu–Ngọ' },
  { pair: ['寅','巳'], vi: 'Dần–Tỵ' },
  { pair: ['卯','辰'], vi: 'Mão–Thìn' },
  { pair: ['申','亥'], vi: 'Thân–Hợi' },
  { pair: ['酉','戌'], vi: 'Dậu–Tuất' },
];

// 三刑 (TAM HÌNH) — cùng chuẩn với interactions.js (ZHI_XING_PAIRS).
// Vô lễ: 子↔卯 ; Thế thế: 寅↔巳↔申 ; Vô ân: 丑↔戌↔未.
const XING_PAIRS = [
  { pair: ['子','卯'], name: 'Vô lễ chi hình', vi: 'Hình vô lễ (Tý–Mão)' },
  { pair: ['寅','巳'], name: 'Vô ân chi hình', vi: 'Hình vô ân (Dần–Tỵ)' },
  { pair: ['巳','申'], name: 'Vô ân chi hình', vi: 'Hình vô ân (Tỵ–Thân)' },
  { pair: ['寅','申'], name: 'Vô ân chi hình', vi: 'Hình vô ân (Dần–Thân)' },
  { pair: ['丑','戌'], name: 'Thế thế chi hình', vi: 'Hình thế thế (Sửu–Tuất)' },
  { pair: ['戌','未'], name: 'Thế thế chi hình', vi: 'Hình thế thế (Tuất–Mùi)' },
  { pair: ['丑','未'], name: 'Thế thế chi hình', vi: 'Hình thế thế (Sửu–Mùi)' },
];

// Tự hình (TỰ HÌNH) — 辰/午/酉/亥 gặp đồng chi.
const XING_SELF = ['辰','午','酉','亥'];

/**
 * Tính cách + tương tác cho 1 con giáp.
 * @param {string} zhi - chi năm sinh
 * @returns {{ zodiac, animal, personality, career, love, health, wealth,
 *            sanhe, liuhe, chong, hai, compatible, incompatible }}
 */
export function zodiacAnalysis(zhi) {
  const z = ZODIAC[zhi];
  if (!z) return null;

  // Tìm tam hợp
  const sanheGrp = SANHE.find(s => s.branches.includes(zhi));
  const sanhePartners = sanheGrp.branches.filter(b => b !== zhi);

  // Tìm lục hợp
  const liuhePartner = LIUHE.find(l => l.pair.includes(zhi))?.pair.find(p => p !== zhi);

  // Tìm lục xung
  const chongPartner = CHONG_PAIRS.find(c => c.pair.includes(zhi))?.pair.find(p => p !== zhi);

  // Tìm lục hại
  const haiPartner = HAI_PAIRS.find(h => h.pair.includes(zhi))?.pair.find(p => p !== zhi);

  // Tổng hợp hợp/kỵ
  const compatible = [...sanhePartners.map(p => ({ chi: p, type: 'tam hợp', animal: ZODIAC[p]?.animal, level: 'cát' }))];
  if (liuhePartner) compatible.push({ chi: liuhePartner, type: 'lục hợp', animal: ZODIAC[liuhePartner]?.animal, level: 'cát' });

  const incompatible = [];
  if (chongPartner) incompatible.push({ chi: chongPartner, type: 'lục xung', animal: ZODIAC[chongPartner]?.animal, level: 'hung' });
  if (haiPartner) incompatible.push({ chi: haiPartner, type: 'lục hại', animal: ZODIAC[haiPartner]?.animal, level: 'hung nhẹ' });

  return {
    zhi, animal: z.animal, vi: z.vi, wx: z.wx, time: z.time,
    personality: z.personality, career: z.career, love: z.love, health: z.health, wealth: z.wealth,
    sanheGrp: sanheGrp?.vi, sanhePartners, liuhePartner,
    chongPartner, haiPartner,
    compatible, incompatible,
  };
}

/**
 * CHẤM ĐIỂM CẶP ĐÔI CON GIÁP — phủ đầy đủ 6 quan hệ cổ pháp:
 * 六合 (Lục Hợp) / 三合 (Tam Hợp) / 六冲 (Lục Xung) / 六害 (Lục Hại) /
 * 三刑 (Tam Hình) / 自刑 (Tự Hình). Nguồn: 渊海子平 生肖论 + 三命通会.
 *
 * Trả điểm 0-100 + bóc tách từng quan hệ để hiển thị/luận.
 * @param {string} zhiA - chi năm sinh của A
 * @param {string} zhiB - chi năm sinh của B
 * @returns {{ zhiA, zhiB, animalA, animalB, relations:[{type,name,vi,tone,delta}],
 *            score, rating, verdict, note }}
 */
export function zodiacPairScore(zhiA, zhiB) {
  const a = ZODIAC[zhiA], b = ZODIAC[zhiB];
  if (!a || !b) return null;

  const relations = [];
  let score = 60; // trung tính khởi điểm

  // 1. 六合 — ám hợp, quý nhân (mạnh nhất về duyên)
  const liuheHit = LIUHE.find((l) => l.pair.includes(zhiA) && l.pair.includes(zhiB) && zhiA !== zhiB);
  if (liuheHit) {
    score += 18;
    relations.push({ type: 'liuhe', name: '六合', vi: `Lục Hợp (${liuheHit.vi})`, tone: 'cat', delta: 18 });
  }

  // 2. 三合 — đồng cục ngũ hành (rất hợp làm ăn / hôn nhân)
  const sanheHit = SANHE.find((s) => s.branches.includes(zhiA) && s.branches.includes(zhiB) && zhiA !== zhiB);
  if (sanheHit) {
    score += 15;
    relations.push({ type: 'sanhe', name: '三合', vi: `Tam Hợp ${sanheHit.vi}`, tone: 'cat', delta: 15 });
  }

  // 3. 六冲 — xung khắc đối đỉnh (khắc khẩu, biến động)
  const chongHit = CHONG_PAIRS.find((c) => c.pair.includes(zhiA) && c.pair.includes(zhiB) && zhiA !== zhiB);
  if (chongHit) {
    score -= 20;
    relations.push({ type: 'chong', name: '六冲', vi: `Lục Xung (${chongHit.vi})`, tone: 'hung', delta: -20 });
  }

  // 4. 六害 — 暗 tổn, lục đục, hao tổn (nhẹ hơn xung nhưng dai dẳng)
  const haiHit = HAI_PAIRS.find((h) => h.pair.includes(zhiA) && h.pair.includes(zhiB) && zhiA !== zhiB);
  if (haiHit) {
    score -= 12;
    relations.push({ type: 'hai', name: '六害', vi: `Lục Hại (${haiHit.vi})`, tone: 'hung-nhe', delta: -12 });
  }

  // 5. 三刑 — hình thương, thị phi, pháp lý (nặng, đặc biệt vô ân + thế thế)
  const xingHit = XING_PAIRS.find((x) => x.pair.includes(zhiA) && x.pair.includes(zhiB) && zhiA !== zhiB);
  if (xingHit) {
    score -= 14;
    relations.push({ type: 'xing', name: '三刑', vi: xingHit.vi, tone: 'hung', delta: -14 });
  }

  // 6. 自刑 — đồng chi (辰/午/酉/亥 gặp nhau): quá vượng tự khắc, cứng đầu
  if (zhiA === zhiB && XING_SELF.includes(zhiA)) {
    score -= 8;
    relations.push({ type: 'zixing', name: '自刑', vi: 'Tự Hình (đồng chi, quá vượng tự khắc)', tone: 'hung-nhe', delta: -8 });
  } else if (zhiA === zhiB) {
    // Đồng chi nhưng không phạm tự hình → đồng điệu, trung tính hơi tốt
    score += 4;
    relations.push({ type: 'tong', name: '同支', vi: 'Đồng chi (cùng con giáp)', tone: 'mid', delta: 4 });
  }

  // Ngũ hành tương quan bổ trợ (sinh = +5, đồng hành = +3, khắc = -5)
  const wxA = a.wx, wxB = b.wx;
  const SHENG = { '水': '木', '木': '火', '火': '土', '土': '金', '金': '水' };
  const KE = { '水': '火', '火': '金', '金': '木', '木': '土', '土': '水' };
  if (relations.length === 0) {
    if (SHENG[wxA] === wxB || SHENG[wxB] === wxA) { score += 5; relations.push({ type: 'wx-sheng', name: '五行相生', vi: `${wxA}↔${wxB} tương sinh`, tone: 'cat-nhe', delta: 5 }); }
    else if (wxA === wxB) { score += 3; relations.push({ type: 'wx-tong', name: '五行同', vi: `cùng ${wxA}`, tone: 'mid', delta: 3 }); }
    else if (KE[wxA] === wxB || KE[wxB] === wxA) { score -= 5; relations.push({ type: 'wx-ke', name: '五行相克', vi: `${wxA}↔${wxB} tương khắc`, tone: 'hung-nhe', delta: -5 }); }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let rating, verdict;
  if (score >= 78) { rating = 'Đại hợp'; verdict = 'Rất hợp — có Lục Hợp/Tam Hợp, duyên phận tốt, nên tiến tới hôn nhân hoặc hợp tác.'; }
  else if (score >= 62) { rating = 'Hợp'; verdict = 'Khá hợp — tương trợ, có thể chung sống lâu dài, cần bao dung chỗ thiếu.'; }
  else if (score >= 45) { rating = 'Trung'; verdict = 'Bình thường — hợp một mặt, khắc một mặt; phụ thuộc nỗ lực vun đắp.'; }
  else if (score >= 28) { rating = 'Khắc'; verdict = 'Kém hợp — có Xung/Hại/Hình; dễ khẩu thiệt, cần hóa giải bằng Dụng Thần / ngũ hành.'; }
  else { rating = 'Đại khắc'; verdict = 'Rất khắc — nhiều Xung/Hại/Hình cùng lúc; cổ pháp khuyên thận trọng, nếu chung sống cần hóa giải mạnh.'; }

  // Nếu không phát hiện quan hệ nào đặc biệt
  const note = relations.length === 0
    ? `Hai tuổi ${a.vi}–${b.vi} không phạm Lục Hợp/Xung/Hại/Hình cổ pháp; xem thêm ngũ hành tương sinh ở trên.`
    : `Quan hệ chính: ${relations.map((r) => r.name).join(', ')}.`;

  return {
    zhiA, zhiB, animalA: a.animal, animalB: b.animal,
    relations, score, rating, verdict, note,
  };
}

export { ZODIAC, SANHE, LIUHE, CHONG_PAIRS, HAI_PAIRS, XING_PAIRS, XING_SELF };
