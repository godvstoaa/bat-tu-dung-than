// brain.js — Module NÃO: knowledge graph reasoning engine for BaZi
// ADDITIVE: doesn't replace existing system, ENHANCES it.
// Graceful fallback: if brain fails → return null → caller skips.
//
// Architecture:
// 1. extractFacts(chart, R) → structured facts (tàng can always)
// 2. evaluateRules(facts) → derived conclusions (forward chaining)
// 3. classifyQuestion(question) → domain category
// 4. buildOutput(conclusions, facts, category) → structured text for AI

import { extractFacts } from './facts.js';
export { extractFacts };

// === CLASSIFY QUESTION ===
const QUESTION_MAP = [
  { tags: ['bao giờ','khi nào','thời điểm','năm nào','vận'], category: 'timing' },
  { tags: ['hôn nhân','vợ','chồng','duyên','cưới','ly hôn','tình yêu','phối ngẫu','ai hợp'], category: 'marriage' },
  { tags: ['sự nghiệp','công việc','chức','quyền','nghề','nghề nghiệp'], category: 'career' },
  { tags: ['tiền','tài','giàu','nghèo','đầu tư','kinh doanh','tài lộc'], category: 'wealth' },
  { tags: ['sức khỏe','bệnh','tạng','đau','yếu','thể chất'], category: 'health' },
  { tags: ['con cái','sinh con','thai','tử nữ'], category: 'children' },
  { tags: ['học','bằng cấp','thi cử','đại học','học vấn','khoa cử'], category: 'education' },
  { tags: ['tính cách','bản chất','con người','khí chất'], category: 'personality' },
  { tags: ['diện mạo','ngoại hình','đẹp','mặt','tướng mạo'], category: 'appearance' },
  { tags: ['khi nào','thời điểm','vận','năm nào','bao giờ','timing'], category: 'timing' },
  { tags: ['cổ pháp','nạp âm','兰台','thần đầu lộc','九命'], category: 'gufa' },
  { tags: ['phụ mẫu','cha mẹ','bố mẹ','tổ tiên'], category: 'parents' },
  { tags: ['anh chị','huynh đệ','anh em'], category: 'siblings' },
];

export function classifyQuestion(question) {
  if (!question) return 'overview';
  const q = question.toLowerCase();
  for (const { tags, category } of QUESTION_MAP) {
    if (tags.some(t => q.includes(t.toLowerCase()))) return category;
  }
  return 'overview';
}

// === EVALUATE RULES (forward chaining, no external deps) ===
// Each rule: { id, category, priority, condition: (facts) => bool, conclusion: { result, message, confidence, evidence, links } }
const RULES = [
  // --- COMBINATION RULES (priority 90) ---
  {
    id: 'shangguan_pei_yin', category: ['education','career'], priority: 90,
    condition: (f) => f.combo_shangguan_pei_yin,
    conclusion: { result: 'hoc_van_cao', message: 'Thương Quan phối Ấn: trí tuệ sáng tạo + được công nhận → học vấn cao, nên học Thạc/Tiến sĩ', confidence: 88, evidence: ['has_伤官', 'has_正印/偏印', 'tổ hợp kinh điển 伤官配印'], links: ['education','career','personality'] },
  },
  {
    id: 'sha_yin_xiang_sheng', category: ['career','education'], priority: 90,
    condition: (f) => f.combo_sha_yin,
    conclusion: { result: 'quyen_luc_hoc_van', message: 'Sát Ấn tương sinh: quyền lực tối cao + học vấn → nên làm lãnh đạo/quan chức', confidence: 87, evidence: ['has_七杀', 'has_正印/偏印', 'tổ hợp 杀印相生'], links: ['career','authority'] },
  },
  {
    id: 'shi_zhi_sha', category: ['career'], priority: 88,
    condition: (f) => f.combo_shi_zhi_sha,
    conclusion: { result: 'ky_nang_che_ngu', message: 'Thực chế Sát: kỹ năng chế ngự uy quyền → sự nghiệp kỹ thuật/management', confidence: 85, evidence: ['has_食神', 'has_七杀'], links: ['career'] },
  },
  {
    id: 'cai_sheng_guan', category: ['career','wealth'], priority: 85,
    condition: (f) => f.combo_cai_sheng_guan,
    conclusion: { result: 'tai_tro_su_nghiep', message: 'Tài sinh Quan: tài lực hỗ trợ sự nghiệp → kinh doanh + chức vụ', confidence: 82, evidence: ['has_正/偏财', 'has_正官'], links: ['career','wealth'] },
  },
  {
    id: 'guan_sha_hon_ta', category: ['marriage'], priority: 85,
    condition: (f) => f.combo_guan_sha_hon_ta,
    conclusion: { result: 'hôn_nhan_bất_ổn', message: 'Quan Sát hỗn tạp: quyền lực lộn xộn → hôn nhân bất ổn, cần cẩn thận chọn bạn đời', confidence: 80, evidence: ['has_正官', 'has_七杀', 'quansha mixed'], links: ['marriage','personality'] },
  },
  {
    id: 'ty_tranh_tai', category: ['wealth'], priority: 80,
    condition: (f) => f.combo_ty_tranh_tai,
    conclusion: { result: 'tranh_tai', message: 'Tỷ Kiếp tranh Tài: dễ mất tiền/đối tác, cần quản lý tài chính kỷ luật', confidence: 78, evidence: ['has_比肩/劫财', 'has_正/偏财'], links: ['wealth','siblings'] },
  },
  {
    id: 'kieu_doat_thuc', category: ['health','career'], priority: 82,
    condition: (f) => f.combo_kieu_doat_thuc,
    conclusion: { result: 'tai_nang_bi_em', message: 'Kiêu thần đoạt Thực: tài năng bị èm, cần giải (thêm Tài hoặc Ấn mạnh)', confidence: 75, evidence: ['has_偏印', 'has_食神'], links: ['health','career'] },
  },

  // --- POSITION RULES (盲派金口诀, priority 60-70) ---
  {
    id: 'nien_shangguan', category: ['parents'], priority: 65,
    condition: (f) => f['伤官_positions']?.some(p => p.startsWith('năm')),
    conclusion: { result: 'khac_cha_me', message: 'Năm trụ có Thương Quan → khắc cha mẹ (nếu không có Ấn giải)', confidence: 60, evidence: ['伤官 at năm trụ', '盲派金口诀'], links: ['parents'] },
  },
  {
    id: 'nien_zhengcai', category: ['wealth','parents'], priority: 65,
    condition: (f) => f['正财_positions']?.some(p => p.startsWith('năm')),
    conclusion: { result: 'to_nghiep_truyen', message: 'Năm trụ có Chính Tài → hưởng nghiệp tổ, giàu từ nhỏ', confidence: 65, evidence: ['正财 at năm trụ'], links: ['wealth','parents'] },
  },
  {
    id: 'nhat_zheng_guan', category: ['career','marriage'], priority: 68,
    condition: (f) => f['正官_positions']?.some(p => p.startsWith('ngày')),
    conclusion: { result: 'ban_than_quyen', message: 'Ngày trụ có Chính Quan → bản thân có quyền/danh, nữ = chồng chính pp', confidence: 70, evidence: ['正官 at ngày trụ'], links: ['career','marriage'] },
  },

  // --- TIMING RULES (priority 75-85) ---
  {
    id: 'dayun_dung', category: ['timing'], priority: 80,
    condition: (f) => f.dayunIsDung && !f.dayunIsKy,
    conclusion: { result: 'thuan_dung', message: 'Đại vận hiện tại HỢP Dụng thần → thời kỳ thuận lợi', confidence: 82, evidence: ['dayun matches yongshen'], links: ['timing'] },
  },
  {
    id: 'dayun_ky', category: ['timing'], priority: 82,
    condition: (f) => f.dayunIsKy && !f.dayunIsDung,
    conclusion: { result: 'ky_than', message: 'Đại vận hiện tại KHẮC Dụng thần → thời kỳ cần cẩn thận', confidence: 80, evidence: ['dayun clashes yongshen'], links: ['timing'] },
  },

  // --- SPECIAL PATTERN (priority 95) ---
  {
    id: 'cong_ge', category: ['overview'], priority: 95,
    condition: (f) => f.isCongge,
    conclusion: { result: 'tong_cach', message: 'TÒNG CÁCH → Dụng thần THEO thế cục (không Phù Ức). Thuận thế = tốt, chống lại = xấu.', confidence: 90, evidence: ['pattern quality = 从格'], links: ['overview','career','wealth'] },
  },
  {
    id: 'tiaohou_override', category: ['overview'], priority: 92,
    condition: (f) => f.isTiaohou,
    conclusion: { result: 'dieu_hou_override', message: 'ĐIỀU HẬU override → Dụng thần = hành điều hòa khí hậu (không luận vượng nhược)', confidence: 88, evidence: ['tiaohou override flag'], links: ['overview'] },
  },

  // --- APPEARANCE (priority 70) ---
  {
    id: 'jin_shui_phoi', category: ['appearance'], priority: 75,
    condition: (f) => f.wx_金_strong && f.wx_水_strong,
    conclusion: { result: 'cuc_dep', message: 'Kim Thủy phùng: da trắng + ẩm = nhan sắc xuất chúng', confidence: 80, evidence: ['Kim ≥30%', 'Thủy ≥30%'], links: ['appearance'] },
  },
  {
    id: 'moc_hoa_thong_minh', category: ['appearance'], priority: 73,
    condition: (f) => f.wx_木_strong && f.wx_火_strong,
    conclusion: { result: 'sang_duyen', message: 'Mộc Hỏa thông minh: sáng + duyên dáng, khí chất văn nhã', confidence: 78, evidence: ['Mộc ≥30%', 'Hỏa ≥30%'], links: ['appearance'] },
  },

  // --- HEALTH (priority 70) ---
  {
    id: 'health_weakest_wx', category: ['health'], priority: 70,
    condition: (f) => f.weakestWx && f.weakestWxPct <= 12,
    conclusion: { result: 'tang_yeu', message: 'Hành yếu nhất → tạng tương ứng yếu nhất (cần bổ sung + tránh đại vận khắc)', confidence: 72, evidence: ['weakest wx detected'], links: ['health'] },
  },
];

function wxOrgan(wx) {
  return {木:'gan/mat',火:'tim/tieu_trang',土:'ty/vi',金:'phoi/đai_trang',水:'than/bang_quang'}[wx] || '?';
}

// === EVALUATE ===
export function evaluateRules(facts) {
  const conclusions = [];
  for (const rule of RULES) {
    try {
      if (rule.condition(facts)) {
        conclusions.push({
          id: rule.id,
          category: rule.category,
          priority: rule.priority,
          ...rule.conclusion,
          evidence: [...(rule.conclusion.evidence || []), ...(facts[`${rule.id}_positions`] || [])],
        });
      }
    } catch (_) { /* rule error → skip, don't crash */ }
  }
  // Sort by priority (highest first)
  conclusions.sort((a, b) => b.priority - a.priority);
  return conclusions;
}

// === BUILD OUTPUT (graph → structured text for AI) ===
export function buildOutput(conclusions, facts, category) {
  // Filter conclusions relevant to the question category
  let relevant = conclusions;
  if (category !== 'overview') {
    relevant = conclusions.filter(c =>
      c.category?.includes(category) || c.category?.includes('overview')
    );
    // Always include high-priority overview conclusions (从格/调候)
    const overview = conclusions.filter(c => c.priority >= 90 && !relevant.includes(c));
    relevant = [...relevant, ...overview];
  }

  // Deduplicate by id
  const seen = new Set();
  relevant = relevant.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  // Limit to top 8 (avoid overload)
  relevant = relevant.slice(0, 8);

  if (relevant.length === 0) return null;

  // Build text
  let text = `[BRAIN GRAPH — ${category}]\n`;
  for (const c of relevant) {
    const stars = c.confidence >= 80 ? '★' : c.confidence >= 60 ? '◆' : '○';
    text += `${stars} ${c.result}: ${c.message} (${c.confidence}%)\n`;
    text += `  ↳ Evidence: ${c.evidence.join(' → ')}\n`;
  }

  // Add timing modifier
  if (facts.dayunIsDung) {
    text += `\n⏱ ĐẠI VẬN HIỆN TẠI (${facts.currentDayunGz}): THUẬN Dụng → kết luận trên được HỖ TRỢ.\n`;
  } else if (facts.dayunIsKy) {
    text += `\n⏱ ĐẠI VẬN HIỆN TẠI (${facts.currentDayunGz}): KHẮC Dụng → kết luận trên bị HẠN CHẾ hiện tại.\n`;
  }

  return text;
}

// === MAIN: think(question, chart, R, gender) → structured text or null ===
export function think(question, chart, R, gender) {
  try {
    const facts = extractFacts(chart, R, gender);
    const conclusions = evaluateRules(facts);
    const category = classifyQuestion(question);
    const output = buildOutput(conclusions, facts, category);
    return output;
  } catch (e) {
    // Graceful fallback: brain crash → return null → caller skips
    return null;
  }
}
