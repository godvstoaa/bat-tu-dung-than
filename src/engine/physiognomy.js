// ============================================================================
//  TƯỚNG THUẬT 相术 — Face Reading (DATA-DRIVEN, tương tác)
//  Gồm 3 hệ:
//    1. 面相十二宫 — 12 Cung Mặt (vùng mặt ↔ lĩnh vực cuộc đời)
//    2. 痣相       — Đọc nốt ruồi trên mặt (hung / cat)
//    3. 流年部位歌  — Ánh xạ tuổi ↔ vị trí mặt cần xem (流年 = năm đi qua)
//  Nguồn: 麻衣神相 · 神相全编 · 柳庄相法 · 流年运气歌.
//  Đây là module tra cứu thuần (lookup tables), KHÔNG sinh từ dữ liệu sinh.
// ============================================================================
//
// Quy ước tone: 'cat' (cát), 'hung' (hung), 'neutral' (trung).
// Mỗi cung ghi 3 tình trạng: good (丰隆/明润/方正), bad (凹陷/暗沉/疤痕), neutral.

// ============================================================ PART 1: 12 CUNG
// Mỗi cung: { vi, pos, domain, tone, good, bad, neutral }
const FACE_PALACES = {
  命宫: {
    vi: 'Mệnh Cung', pos: 'giữa 2 chân mày (ấn đường)', domain: 'tổng vận thế, tính cách, sức khoẻ chung', tone: 'neutral',
    good: 'ấn đường rộng, sáng, phẳng, hồng nhuận — tâm mở, khí thế thuận, sự nghiệp thông đạt, sức khoẻ tốt',
    bad: 'ấn đường hẹp, có vết/nếp, sẹo, tàn nhang, u ám — tính cố chấp, vận trở, dễ đau đầu/mất ngủ',
    neutral: 'ấn đường vừa phải, không sáng cũng không tối — vận bình, cần tự khai thông tâm trí',
  },
  财帛: {
    vi: 'Tài Bốc Cung', pos: 'chóp mũi (准头)', domain: 'tiền bạc, tài lộc', tone: 'neutral',
    good: 'mũi cao thẳng, chóp mũi tròn đầy (准头丰隆), lòng sáng — tài lộc dồi dào, giữ được tiền',
    bad: 'chóp mũi gầy, nhọn, đỏ/đen, có vết — hao tài, dễ hứa hẹn tài chính sai, lỡ mất cơ hội',
    neutral: 'mũi vừa, không cao không thấp — tài lộc đủ dùng, cần thêm Điền Trạch tốt mới tích lũy được',
  },
  兄弟: {
    vi: 'Huynh Đệ Cung', pos: 'lông mày', domain: 'anh em, bạn bè, quan hệ ngang hàng', tone: 'neutral',
    good: 'lông mày đều, mềm, dài quá mắt, bóng — anh em hoà thuận, bạn bè相助 nhiều',
    bad: 'lông mày thưa, gãy, ngắn, lộn xộn, hai đuôi không đều — anh em duyên mỏng, dễ tranh chấp',
    neutral: 'lông mày vừa, rõ — quan hệ anh em bạn bè bình thường, không quá gần không quá xa',
  },
  田宅: {
    vi: 'Điền Trạch Cung', pos: 'mắt + vùng trên mắt', domain: 'nhà cửa, BĐS, gia đình', tone: 'neutral',
    good: 'mắt sáng, có thần, vùng trên mắt đầy, da sáng — nhiều nhà cửa, gia đình ổn, tích sản tốt',
    bad: 'mắt lờ đờ, đỏ, vùng trên mắt trũng/tí, có tàn nhang — khó giữ nhà, gia đình biến động',
    neutral: 'mắt vừa, không quá sáng — có chỗ ở, cần tự cố gắng mới mua được nhà',
  },
  男女: {
    vi: 'Nam Nữ Cung', pos: 'dưới mắt (lệ đường)', domain: 'con cái, sinh sản', tone: 'neutral',
    good: 'vùng dưới mắt (lệ đường) đầy, sáng, không có ngang vân — con cái ngoan, hiếu thảo, dễ sinh',
    bad: 'lệ đường trũng, có vân ngang (tenting lines), tối, nốt ruồi — con cái khó nuôi, duyên con mỏng',
    neutral: 'lệ đường vừa — số con vừa phải, cần nuôi dưỡng chăm sóc',
  },
  奴仆: {
    vi: 'Nô Bộc Cung', pos: 'cằm (địa các)', domain: 'cấp dưới, người làm, tuổi già', tone: 'neutral',
    good: 'cằm tròn đầy, có thịt, hướng lên — được cấp dưới/n người làm trung thành, tuổi già an nhàn',
    bad: 'cằm nhọn, lép, ngắn, có sẹo — khó giữ người dưới, tuổi già vất vả',
    neutral: 'cằm vừa — quản lý người dưới bình thường, tuổi già đủ sống',
  },
  妻妾: {
    vi: 'Thê Thiếp Cung', pos: 'đuôi mắt (ngư vĩ)', domain: 'vợ/chồng, hôn nhân', tone: 'neutral',
    good: 'đuôi mắt (ngư vĩ) đầy, không có vân — hôn nhân thuận, vợ/chồng hòa hợp',
    bad: 'ngư vĩ trũng, có vân xuống (鱼尾纹 sâu), sẹo, nốt ruồi — hôn nhân trắc trở, duyên bên ngoài',
    neutral: 'ngư vĩ vừa — hôn nhân bình ổn, cần hai bên cùng vun đắp',
  },
  疾厄: {
    vi: 'Tật Ách Cung', pos: 'sống mũi (sơn căn)', domain: 'sức khoẻ, bệnh tật, tai nạn', tone: 'neutral',
    good: 'sơn căn (sống mũi) cao, không gãy, da sáng — sức khoẻ tốt, ít bệnh, ít tai nạn',
    bad: 'sơn căn thấp, gãy, có vằn chéo, sẹo, tối — dễ bệnh, tai nạn,应注意 tim mạch/mất ngủ',
    neutral: 'sơn căn vừa — sức khoẻ trung bình, cần giữ gìn',
  },
  迁移: {
    vi: 'Thiên Di Cung', pos: 'đùi mắt (tài vi) / vùng thái dương', domain: 'xuất hành, du lịch, nước ngoài', tone: 'neutral',
    good: 'vùng thái dương (tài vi) đầy, sáng — đi lại thuận, có duyên nước ngoài, xa quê phát đạt',
    bad: 'tài vi trũng, có vằn, sẹo, nốt ruồi — đi lại bất lợi, dễ gặp rắc rối xa nhà',
    neutral: 'tài vi vừa — đi lại bình thường, không quá xui không quá tốt',
  },
  官禄: {
    vi: 'Quan Lộc Cung', pos: 'trán giữa (trung đình)', domain: 'sự nghiệp, công danh', tone: 'neutral',
    good: 'trán giữa cao, đầy, rộng, sáng — sự nghiệp hanh thông, công danh sớm thành',
    bad: 'trán giữa trũng, hẹp, có vằn dọc, sẹo — sự nghiệp trở trắc, cần nỗ lực hơn',
    neutral: 'trán vừa — sự nghiệp đi đều, cần thời gian và nỗ lực',
  },
  福德: {
    vi: 'Phúc Đức Cung', pos: 'trên đuôi lông mày (phúc đức / tài bạch)', domain: 'phúc đức, tinh thần, may mắn', tone: 'neutral',
    good: 'vùng trên đuôi mày (phúc đức) đầy, tròn, sáng — nhiều phúc, tinh thần tốt, hay gặp may',
    bad: 'phúc đức trũng, có vằn, tối — tinh thần bất an, phúc mỏng, dễ gặp xui',
    neutral: 'phúc đức vừa — phúc tinh thần bình thường, cần tích đức',
  },
  相貌: {
    vi: 'Tướng Mạo Cung', pos: 'toàn bộ khuôn mặt (tam đình / ngũ nhạc)', domain: 'tổng quan ngoại hình + khí chất', tone: 'neutral',
    good: 'tam đình đều (thượng/trung/hạ đình cân), ngũ nhạc (2 mày/2 mắt/mũi) cao cân xứng — tướng toàn diện, khí chất vượng',
    bad: 'tam đình mất cân, ngũ nhạc lệch, mặt không cân — tướng thiếu cân đối, khí chất yếu',
    neutral: 'tam đình ngũ nhạc tương đối cân — tướng mức trung bình',
  },
};

// ============================================================ PART 2: MỌC TƯỚNG (nốt ruồi)
// Mỗi vị trí: { vi, tone ('cat'|'hung'), meaning }
// Giữ 8 vị trí chuẩn trong spec + bổ sung 16 vị trí phổ biến khác (麻衣/柳庄).
const MOLE_POSITIONS = {
  // --- 8 vị trí chuẩn trong spec ---
  印堂: { vi: 'ấn đường', tone: 'hung', meaning: 'chặn khí Mệnh Cung — vận trở, khó thành việc lớn' },
  眉中: { vi: 'trong lông mày', tone: 'cat', meaning: 'tài, thông minh, được che chở (mộc tàng)' },
  眼尾: { vi: 'đuôi mắt', tone: 'hung', meaning: 'hôn nhân trắc trở, duyên bên ngoài' },
  鼻头: { vi: 'chóp mũi', tone: 'cat', meaning: 'phát tài, nhưng nếu to quá thì hao' },
  人中: { vi: 'nhân trung', tone: 'hung', meaning: 'sản nạn, con cái khó nuôi' },
  嘴角: { vi: 'góc miệng', tone: 'cat', meaning: 'có khẩu phúc, dễ được ăn' },
  下巴: { vi: 'cằm', tone: 'cat', meaning: 'BĐS, đất đai, tuổi già ổn' },
  额头中: { vi: 'giữa trán', tone: 'hung', meaning: 'sự nghiệp sớm trở, công danh chậm' },
  // --- Bổ sung (麻衣神相 / 柳庄相 pháp phổ biến) ---
  耳朵: { vi: 'trên vành tai', tone: 'cat', meaning: 'hiếu thuận, được长辈 phù, thông minh từ nhỏ' },
  天庭: { vi: 'thượng đình (trán trên)', tone: 'cat', meaning: 'phúc tổ nghiệp, sự nghiệp sớm thuận' },
  山根: { vi: 'sống mũi (sơn căn)', tone: 'hung', meaning: 'dễ bệnh, nên phòng tai nạn, hôn nhân trắc' },
  鼻梁: { vi: 'sống mũi giữa', tone: 'hung', meaning: 'bệnh đường tiêu hoá, tài vận受阻' },
  鼻翼: { vi: 'cánh mũi', tone: 'cat', meaning: 'giữ tiền được, biết tiết kiệm' },
  法令: { vi: 'nếp pháp lệnh (cạnh mũi xuống miệng)', tone: 'hung', meaning: 'chân tay dễ bệnh/tai nạn, quyền lực受阻' },
  眼下: { vi: 'dưới mắt (lệ đường)', tone: 'hung', meaning: 'vì con cái lao lực, duyên con mỏng' },
  眼皮上: { vi: 'trên mắt', tone: 'hung', meaning: 'dễ gặp rắc rối nhà cửa/BĐS, gia đình biến động' },
  太阳穴: { vi: 'thái dương (tài vi)', tone: 'hung', meaning: 'thiên di bất lợi, đi xa dễ hao tổn' },
  颧骨: { vi: 'gò má', tone: 'hung', meaning: 'dễ nắm quyền nhưng bị người đố kỵ, mất quyền' },
  唇上: { vi: 'trên môi', tone: 'cat', meaning: 'khẩu phúc, được người cho ăn, duyên ăn uống tốt' },
  腮骨: { vi: 'xương góc hàm', tone: 'hung', meaning: 'bán rẻ bạn bè/người thân, lòng dạ khó lường' },
  发际: { vi: 'đường chân tóc', tone: 'cat', meaning: 'duyên với người lớn tuổi, được提携' },
  眉头: { vi: 'đầu lông mày', tone: 'hung', meaning: 'tính cương, dễ đắc tội người, khẩu thiệt' },
  奸门: { vi: 'ngư vĩ mở rộng (hôn nhân)', tone: 'hung', meaning: 'hôn nhân ba đào, dễ ngoại tình/li hôn' },
};

// ============================================================ PART 3: TUỔI ↔ VỊ TRÍ MẶT (流年部位歌)
// 流年 = năm đi qua (từ 1→99 tuổi). Bảng dưới chỉ các mốc chính (major milestones).
// Mỗi mốc: 'tuổi' → 'vị trí (Hán Việt) — ý nghĩa'.
const AGE_FACE_MAP = {
  '15': '额头 (thượng đình) — trưởng thành sớm, nền tảng tổ nghiệp',
  '22': '额头正中 (sự nghiệp sơ kỳ) — định hướng nghề nghiệp',
  '25': '眉骨 — sự nghiệp bắt đầu, xác lập vị thế',
  '28': '眉毛 (huynh đệ) — quan hệ bạn bè, cộng sự',
  '30': '眼尾上方 (thái dương) — thiên di, mở rộng tầm nhìn',
  '35': '眼睛 — đỉnh sức lực, minh mẫn nhất',
  '38': '中阴 (mắt — quan hệ, tình cảm)',  // [cycle 44 sửa] 38 là vùng MẮT (中阳/中阴), không phải鼻梁
  '41': '精舍 (sống mũi, dưới sơn căn — tài vận)',  // [cycle 44 sửa] 41=精舍 (麻衣流年), không trùng 40
  '45': '寿上 (giữa mũi — sức khoẻ, trường thọ)',  // [cycle 44 sửa] 45=寿上; 颧骨(gò má) là 46/47
  '48': '法令纹 (pháp lệnh) — quyền lực, địa vị xã hội',
  '51': '人中 — chuyển giao sức khoẻ/sự nghiệp',
  '55': '嘴唇 (miệng) — khẩu phúc, ngôn luận',
  '60': '嘴角 — hưởng phúc tuổi xế',
  '65': '下巴两侧 (cằm 2 bên) — cấp dưới, người giúp việc',
  '70': '下巴 (địa các) — tuổi già, tích lũy cuối đời',
  '75': '地阁 (địa các dưới) — phúc lộc tuổi già',
  '80': '地阁 (địa các) — viên mãn, kết thúc một đời',
  '90': '地阁 bottom (đáy cằm) — thọ lâu, phúc đức tích luỹ',
};

// ============================================================ HELPERS

// Bảng đối chiếu Hán → Việt cho các key (đỡ phải tra lại).
const _ZH_VI = {
  命宫: 'Mệnh Cung', 财帛: 'Tài Bốc Cung', 兄弟: 'Huynh Đệ Cung', 田宅: 'Điền Trạch Cung',
  男女: 'Nam Nữ Cung', 奴仆: 'Nô Bộc Cung', 妻妾: 'Thê Thiếp Cung', 疾厄: 'Tật Ách Cung',
  迁移: 'Thiên Di Cung', 官禄: 'Quan Lộc Cung', 福德: 'Phúc Đức Cung', 相貌: 'Tướng Mạo Cung',
};

const TONE_VI = { cat: 'Cát (lành)', hung: 'Hung (khắc)', neutral: 'Trung bình' };

/**
 * Tra cứu 1 cung mặt theo tên (Hán hoặc Việt, không phân biệt hoa thường).
 * @param {string} name — vd: '命宫' hoặc 'mệnh cung' hoặc 'Mệnh Cung'
 * @returns {{ name, vi, pos, domain, tone, good, bad, neutral } | null}
 */
export function getFacePalace(name) {
  if (!name || typeof name !== 'string') return null;
  const key = name.trim();
  // 1. Trùng key Hán
  if (FACE_PALACES[key]) return { name: key, ...FACE_PALACES[key] };
  // 2. Khớp trường vi (không phân biệt hoa thường, bỏ dấu cách)
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, '');
  const target = norm(key);
  for (const [zh, info] of Object.entries(FACE_PALACES)) {
    if (norm(info.vi) === target || norm(_ZH_VI[zh]) === target) {
      return { name: zh, ...info };
    }
  }
  return null;
}

/**
 * Tra cứu ý nghĩa 1 nốt ruồi theo vị trí (Hán hoặc Việt).
 * @param {string} position — vd: '印堂' hoặc 'ấn đường'
 * @returns {{ position, vi, tone, toneVi, meaning } | null}
 */
export function getMoleReading(position) {
  if (!position || typeof position !== 'string') return null;
  const key = position.trim();
  if (MOLE_POSITIONS[key]) {
    const m = MOLE_POSITIONS[key];
    return { position: key, vi: m.vi, tone: m.tone, toneVi: TONE_VI[m.tone], meaning: m.meaning };
  }
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, '');
  const target = norm(key);
  for (const [zh, m] of Object.entries(MOLE_POSITIONS)) {
    if (norm(m.vi) === target || norm(zh) === target) {
      return { position: zh, vi: m.vi, tone: m.tone, toneVi: TONE_VI[m.tone], meaning: m.meaning };
    }
  }
  return null;
}

/**
 * Tra vị trí mặt tương ứng 1 tuổi (làm tròn xuống mốc gần nhất ≤ tuổi).
 * @param {number|string} age
 * @returns {{ age, position } | null}
 */
export function getAgeFaceMap(age) {
  const n = parseInt(age, 10);
  if (!Number.isFinite(n) || n < 1 || n > 99) return null;
  const ages = Object.keys(AGE_FACE_MAP).map(Number).sort((a, b) => a - b);
  // Tìm mốc lớn nhất ≤ n
  let chosen = null;
  for (const a of ages) {
    if (a <= n) chosen = a;
    else break;
  }
  if (chosen === null) chosen = ages[0]; // n nhỏ hơn mốc đầu → dùng mốc đầu
  return { age: n, milestone: chosen, position: AGE_FACE_MAP[String(chosen)] };
}

/**
 * Tổng quan 3 hệ tướng thuật (palaces + moles + age map).
 * @returns {{ palaces, moles, ageMap, totals }}
 */
export function physiognomyOverview() {
  const palaces = Object.entries(FACE_PALACES).map(([zh, p]) => ({
    name: zh, vi: p.vi, pos: p.pos, domain: p.domain, tone: p.tone,
  }));
  const moles = Object.entries(MOLE_POSITIONS).map(([zh, m]) => ({
    position: zh, vi: m.vi, tone: m.tone, toneVi: TONE_VI[m.tone], meaning: m.meaning,
  }));
  const ageMap = Object.entries(AGE_FACE_MAP).map(([a, pos]) => ({
    age: parseInt(a, 10), position: pos,
  }));
  return {
    palaces,
    moles,
    ageMap,
    totals: {
      palaces: palaces.length,
      moles: moles.length,
      catMoles: moles.filter((m) => m.tone === 'cat').length,
      hungMoles: moles.filter((m) => m.tone === 'hung').length,
      ageMilestones: ageMap.length,
    },
  };
}

// Export raw tables để UI/test dùng.
export { FACE_PALACES, MOLE_POSITIONS, AGE_FACE_MAP, TONE_VI };
