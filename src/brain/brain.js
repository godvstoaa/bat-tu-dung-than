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
  { tags: ['tiền','tiền bạc','tài lộc','tài chính','tài vận','phát tài','giàu','nghèo','đầu tư','kinh doanh','lộc'], category: 'wealth' }, // [AUDIT FIX] bỏ bare 'tài' (over-match «tài xế/tài liệu»)
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

  // --- POSITION RULES (盲派金口诀 - 40 position×god rules) ---
  { id: 'nien_zhengyin', category: ['parents','education'], priority: 68, condition: (f) => f['正印_positions']?.some(p => p.startsWith('năm')), conclusion: { result: 'co_am_nam', message: 'Năm trụ có Chính Ấn → có tổ ấm, mẹ hiền, học vấn bẩm sinh', confidence: 68, evidence: ['正印 at năm'], links: ['parents','education'] } },
  { id: 'nguyet_zhengyin', category: ['education','personality'], priority: 70, condition: (f) => f['正印_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'van_tai', message: 'Tháng trụ có Chính Ấn → văn tài, phẩm mạo đoan chính, trí cao', confidence: 70, evidence: ['正印 at tháng'], links: ['education','personality'] } },
  { id: 'thoi_zhengyin', category: ['children','personality'], priority: 68, condition: (f) => f['正印_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'phuc_thoi', message: 'Giờ trụ có Chính Ấn → con cái hiếu thảo,晚niên an ổn', confidence: 68, evidence: ['正印 at giờ'], links: ['children'] } },
  { id: 'nien_qisha', category: ['parents'], priority: 65, condition: (f) => f['七杀_positions']?.some(p => p.startsWith('năm')), conclusion: { result: 'khac_cha_me', message: 'Năm trụ có Thất Sát → khắc cha mẹ (nếu không có Ấn giải)', confidence: 62, evidence: ['七杀 at năm'], links: ['parents'] } },
  { id: 'nguyet_qisha', category: ['career','personality'], priority: 67, condition: (f) => f['七杀_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'pham_tieu_nhan', message: 'Tháng trụ có Thất Sát → tiểu nhân, uy phong nhưng nhiều thử thách', confidence: 65, evidence: ['七杀 at tháng'], links: ['career'] } },
  { id: 'nhat_qisha', category: ['career','marriage'], priority: 68, condition: (f) => f['七杀_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'tuong_tai', message: 'Ngày trụ có Thất Sát → uy vũ cương cường, nữ = chồng bạo', confidence: 66, evidence: ['七杀 at ngày'], links: ['career','marriage'] } },
  { id: 'thoi_qisha', category: ['children'], priority: 67, condition: (f) => f['七杀_positions']?.some(p => p.startsWith('giờ')) && f['七杀_count'] === 1, conclusion: { result: 'con_quy', message: 'Giờ trụ có 1 Thất Sát → con cái quý, nhưng khó sinh con', confidence: 65, evidence: ['七杀 at giờ, 1 vị'], links: ['children'] } },
  { id: 'nien_thuc_than', category: ['health','wealth'], priority: 65, condition: (f) => f['食神_positions']?.some(p => p.startsWith('năm')), conclusion: { result: 'phuc_tho', message: 'Năm trụ có Thực Thần → phúc thọ, miệng lưỡi tốt, đời sống đầy đủ', confidence: 65, evidence: ['食神 at năm'], links: ['health','wealth'] } },
  { id: 'nguyet_thuc_than', category: ['wealth'], priority: 66, condition: (f) => f['食神_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'tien_tieu', message: 'Tháng trụ có Thực Thần → tay luôn có tiền tiêu, phúc khí', confidence: 64, evidence: ['食神 at tháng'], links: ['wealth'] } },
  { id: 'nhat_thuc_than', category: ['health','personality'], priority: 67, condition: (f) => f['食神_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'da_tu_da_tho', message: 'Ngày trụ có Thực Thần → đa tử đa thọ, ấm no', confidence: 66, evidence: ['食神 at ngày'], links: ['health'] } },
  { id: 'nien_thien_tai', category: ['wealth','parents'], priority: 66, condition: (f) => f['偏财_positions']?.some(p => p.startsWith('năm')), conclusion: { result: 'phu_loc_cao', message: 'Năm trụ có Thiên Tài → phúc lộc cao, cha có điều kiện', confidence: 64, evidence: ['偏财 at năm'], links: ['wealth','parents'] } },
  { id: 'nguyet_thien_tai', category: ['wealth','siblings'], priority: 66, condition: (f) => f['偏财_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'chung_nhan_thai', message: 'Tháng trụ có Thiên Tài → được众人 nâng, ngoại tài tốt', confidence: 63, evidence: ['偏财 at tháng'], links: ['wealth'] } },
  { id: 'thoi_thien_tai', category: ['wealth','marriage'], priority: 66, condition: (f) => f['偏财_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'con_son_phuc', message: 'Giờ trụ có Thiên Tài → con cái phúc, nhưng kỵ Tỷ Kiếp phân đoạt', confidence: 63, evidence: ['偏财 at giờ'], links: ['wealth'] } },
  { id: 'nien_bi_kien', category: ['siblings','parents'], priority: 65, condition: (f) => (f['比肩_positions']||f['劫财_positions'])?.some(p => p.startsWith('năm')), conclusion: { result: 'huynh_de_nhieu', message: 'Năm trụ có Tỷ Kiếp → anh chị em nhiều, bất hòa với cha', confidence: 60, evidence: ['比肩/劫财 at năm'], links: ['siblings','parents'] } },
  { id: 'nhat_kiet_tai', category: ['marriage','wealth'], priority: 68, condition: (f) => f['劫财_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'vo_ngoai', message: 'Ngày trụ có Kiếp Tài → hôn nhân ác tai, tài ngoại (nếu nam)', confidence: 62, evidence: ['劫财 at ngày'], links: ['marriage','wealth'] } },
  { id: 'thoi_thuong_quan', category: ['children'], priority: 65, condition: (f) => f['伤官_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'dau_thai_nu', message: 'Giờ trụ có Thương Quan → đầu thai con gái, khó con trai', confidence: 58, evidence: ['伤官 at giờ'], links: ['children'] } },
  { id: 'nien_pian_yin', category: ['parents'], priority: 64, condition: (f) => f['偏印_positions']?.some(p => p.startsWith('năm')), conclusion: { result: 'khac_dau_nuong', message: 'Năm trụ có Thiên Ấn (偏印) → khắc cha mẹ, cô đơn bẩm sinh', confidence: 60, evidence: ['偏印 at năm'], links: ['parents'] } },
  { id: 'nguyet_zhengcai', category: ['wealth'], priority: 67, condition: (f) => f['正财_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'tai_loc_manh', message: 'Tháng trụ có Chính Tài → tài lộc mạnh, lương ổn định', confidence: 66, evidence: ['正财 at tháng'], links: ['wealth'] } },
  { id: 'nhat_zhengcai', category: ['marriage','wealth'], priority: 68, condition: (f) => f['正财_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'vo_hien', message: 'Ngày trụ có Chính Tài → vợ hiền (nam), tài chính ổn', confidence: 66, evidence: ['正财 at ngày'], links: ['marriage','wealth'] } },

  // --- ADDITIONAL COMBINATION RULES ---
  { id: 'thuc_sinh_tai', category: ['wealth'], priority: 82, condition: (f) => f.has_食神 && (f.has_正财 || f.has_偏财), conclusion: { result: 'phat_tai', message: 'Thực Thần sinh Tài → phát tài qua kỹ năng/sáng tạo', confidence: 80, evidence: ['食神+Tài'], links: ['wealth','career'] } },
  { id: 'tai_pha_an', category: ['education'], priority: 78, condition: (f) => f.combo_cai_pha_an, conclusion: { result: 'hoc_gian_doan', message: 'Tài phá Ấn (thân cường+tài+ấn) → học gián đoạn do theo đuổi tiền', confidence: 68, evidence: ['正/偏财+正印, isStrong'], links: ['education'] } },
  // [AUDIT FIX] removed dead stub nhat_zhi_xung (condition luôn return false, confidence 0 —
  //   never fired). 日支冲 (spouse palace clash) là real signal nhưng cần branch-clash facts
  //   (facts.js chưa extract) → feature riêng nếu muốn.

  // --- GENDER-SPECIFIC RULES ---
  { id: 'nu_quan_sat_hon_ta', category: ['marriage'], priority: 85, condition: (f) => f.isFemale && f.combo_guan_sha_hon_ta, conclusion: { result: 'hon_nhan_bat_on_nu', message: 'NỮ mệnh Quan Sát hỗn tạp → hôn nhân RẤT bất ổn, chọn chồng cẩn thận', confidence: 82, evidence: ['female + 正官+七杀'], links: ['marriage'] } },
  { id: 'nam_ty_kiet_tranh_vo', category: ['marriage'], priority: 80, condition: (f) => !f.isFemale && f.combo_ty_tranh_tai, conclusion: { result: 'tranh_vo_tai', message: 'NAM mệnh Tỷ Kiếp tranh Tài → tranh vợ/tài, dễ mất vợ', confidence: 75, evidence: ['male + Tỷ Kiếp+Tài'], links: ['marriage','wealth'] } },
  { id: 'nam_than_nhược_tai_nhieu', category: ['marriage','health'], priority: 78, condition: (f) => !f.isFemale && f.isWeak && (f['正财_count'] + f['偏财_count']) >= 3, conclusion: { result: 'tai_nhieu_hai_than', message: 'NAM thân nhược + Tài nhiều → vợ chèn ép, tài nhiều hại thân', confidence: 70, evidence: ['male + weak + 3+ Tài'], links: ['marriage','health'] } },

  // --- ELEMENT BALANCE RULES ---
  { id: 'tho_qua_vuong', category: ['health','personality'], priority: 70, condition: (f) => f.wx_土_strong && f.wx_土_pct >= 40, conclusion: { result: 'tho_qua', message: 'Thổ quá vượng → cố chấp, bảo thủ, da sạm, nặng nề', confidence: 68, evidence: ['Thổ ≥40%'], links: ['health','personality'] } },
  { id: 'thuy_qua_vuong', category: ['personality','health'], priority: 70, condition: (f) => f.wx_水_strong && f.wx_水_pct >= 40, conclusion: { result: 'thuy_qua', message: 'Thủy quá vượng → đa mưu, lang đãng, béo, da dầu', confidence: 68, evidence: ['Thủy ≥40%'], links: ['personality','health'] } },
  { id: 'hoa_qua_vuong', category: ['personality','health'], priority: 70, condition: (f) => f.wx_火_strong && f.wx_火_pct >= 40, conclusion: { result: 'hoa_qua', message: 'Hỏa quá vượng → nóng nảy, bốc đồng, dễ mụn, huyết áp', confidence: 68, evidence: ['Hỏa ≥40%'], links: ['personality','health'] } },
  { id: 'moc_qua_vuong', category: ['personality'], priority: 70, condition: (f) => f.wx_木_strong && f.wx_木_pct >= 40, conclusion: { result: 'moc_qua', message: 'Mộc quá vượng → cố chấp, ngang bướng, gầy cao', confidence: 68, evidence: ['Mộc ≥40%'], links: ['personality'] } },
  { id: 'kim_qua_vuong', category: ['personality','health'], priority: 70, condition: (f) => f.wx_金_strong && f.wx_金_pct >= 40, conclusion: { result: 'kim_qua', message: 'Kim quá vượng → sắc sảo quá, gò má cao, da khô', confidence: 68, evidence: ['Kim ≥40%'], links: ['personality','health'] } },

  // --- ADDITIONAL APPEARANCE ---
  { id: 'tho_cuong_diem_dep', category: ['appearance'], priority: 70, condition: (f) => f.wx_土_strong && f.wx_土_pct >= 35, conclusion: { result: 'da_sam', message: 'Thổ vượng → da sạm/dày, cơ thể chắc, ngoại hình vạm vỡ', confidence: 68, evidence: ['Thổ ≥35%'], links: ['appearance'] } },
  { id: 'thuy_duyen', category: ['appearance'], priority: 72, condition: (f) => f.wx_水_strong && f.wx_水_pct >= 25, conclusion: { result: 'duyen_thuy', message: 'Thủy vượng → mắt sáng long lanh, da ẩm mịn, duyên dáng', confidence: 70, evidence: ['Thủy ≥25%'], links: ['appearance'] } },

  // --- ADDITIONAL HEALTH ---
  { id: 'moc_yeu_gan', category: ['health'], priority: 72, condition: (f) => f.wx_木_weak, conclusion: { result: 'gan_yeu', message: 'Mộc yếu → gan/mật yếu, dễ tức giận ức chế, tóc thưa', confidence: 70, evidence: ['Mộc ≤12%'], links: ['health'] } },
  { id: 'hoa_yeu_tim', category: ['health'], priority: 72, condition: (f) => f.wx_火_weak, conclusion: { result: 'tim_yeu', message: 'Hỏa yếu → tim/tiểu trường yếu, thiếu nhiệt huyết, trầm cảm', confidence: 70, evidence: ['Hỏa ≤12%'], links: ['health'] } },
  { id: 'tho_yeu_ty', category: ['health'], priority: 72, condition: (f) => f.wx_土_weak, conclusion: { result: 'ty_yeu', message: 'Thổ yếu → tỳ/vị yếu, tiêu hóa kém, lo âu', confidence: 70, evidence: ['Thổ ≤12%'], links: ['health'] } },
  { id: 'kim_yeu_phoi', category: ['health'], priority: 72, condition: (f) => f.wx_金_weak, conclusion: { result: 'phoi_yeu', message: 'Kim yếu → phổi/đại tràng yếu, hô hấp kém, buồn', confidence: 70, evidence: ['Kim ≤12%'], links: ['health'] } },
  { id: 'thuy_yeu_than', category: ['health'], priority: 72, condition: (f) => f.wx_水_weak, conclusion: { result: 'than_yeu', message: 'Thủy yếu → thận/bàng quang yếu, xương yếu, sợ hãi', confidence: 70, evidence: ['Thủy ≤12%'], links: ['health'] } },

  // --- ADDITIONAL TIMING ---
  { id: 'dayun_neutral', category: ['timing'], priority: 60, condition: (f) => !f.dayunIsDung && !f.dayunIsKy && f.currentDayunGz, conclusion: { result: 'trung_tinh', message: 'Đại vận hiện tại trung tính (không Dụng/Kỵ rõ)', confidence: 50, evidence: ['dayun wx neutral'], links: ['timing'] } },

  // --- PARENTS/SIBLINGS ---
  { id: 'than_nhieu_an', category: ['parents'], priority: 68, condition: (f) => f['正印_count'] >= 2, conclusion: { result: 'me_hien', message: 'Chính Ấn ≥2 → mẹ hiền, được bảo vệ nhiều', confidence: 65, evidence: ['正印 count ≥2'], links: ['parents'] } },
  { id: 'ty_nhieu_huynh_de', category: ['siblings'], priority: 65, condition: (f) => (f['比肩_count'] + f['劫财_count']) >= 3, conclusion: { result: 'anh_chi_nhieu', message: 'Tỷ Kiếp ≥3 → anh chị em nhiều, bất hòa hoặc cạnh tranh', confidence: 62, evidence: ['Tỷ+Kiếp ≥3'], links: ['siblings'] } },

  // === BATCH 1: RULES 61-95 ===

  // --- 格局 THÀNH/BẠI (from PATTERN_CHENG_BAI, priority 88-90) ---
  { id: 'geju_zhengguan_thanh', category: ['career'], priority: 88, condition: (f) => f.patternVi && f.patternVi.includes('Chính Quan') && f.has_正印, conclusion: { result: 'cach_thanh', message: 'Chính Quan cách THÀNH (có Ấn sinh) → sự nghiệp ổn định, danh vọng', confidence: 85, evidence: ['格局=正官', 'has 正印'], links: ['career'] } },
  { id: 'geju_zhengguan_bai', category: ['career'], priority: 87, condition: (f) => f.patternVi && f.patternVi.includes('Chính Quan') && f.has_伤官 && !f.has_正印 && !f.has_偏印, conclusion: { result: 'cach_bai', message: 'Chính Quan cách BẠI (Thương Quan khắc Quan, không Ấn giải) → sự nghiệp đứt đoạn', confidence: 82, evidence: ['格局=正官', 'has 伤官', 'no Ấn'], links: ['career'] } },
  { id: 'geju_qisha_thanh', category: ['career'], priority: 88, condition: (f) => f.patternVi && (f.patternVi.includes('Thất Sát') || f.patternVi.includes('七杀')) && (f.has_食神 || f.has_正印 || f.has_偏印), conclusion: { result: 'sat_che', message: 'Thất Sát cách THÀNH (có Thực/Ấn chế) → uy quyền, kỹ năng chế ngự', confidence: 85, evidence: ['格局=七杀', 'has 食神 or Ấn'], links: ['career'] } },
  { id: 'geju_shangguan_thanh', category: ['education','career'], priority: 88, condition: (f) => f.patternVi && (f.patternVi.includes('Thương Quan') || f.patternVi.includes('伤官')) && f.has_正印, conclusion: { result: 'thuong_quan_pei_an', message: 'Thương Quan cách THÀNH (có Chính Ấn) → học vấn cao, sáng tạo được công nhận', confidence: 85, evidence: ['格局=伤官', 'has 正印'], links: ['education','career'] } },
  { id: 'geju_shangguan_bai', category: ['career'], priority: 85, condition: (f) => f.patternVi && (f.patternVi.includes('Thương Quan') || f.patternVi.includes('伤官')) && f.has_正官 && !f.has_正印, conclusion: { result: 'thuong_quan_khac_quan', message: 'Thương Quan cách BẠI (Thương Quan khắc Quan, không Ấn) → sự nghiệp phá', confidence: 80, evidence: ['格局=伤官', 'has 正官', 'no Ấn'], links: ['career'] } },
  { id: 'geju_zhengyin_thanh', category: ['education','parents'], priority: 86, condition: (f) => f.patternVi && f.patternVi.includes('Chính Ấn') && !f.has_正财 && !f.has_偏财, conclusion: { result: 'an_cach_thanh', message: 'Chính Ấn cách THÀNH (không Tài phá) → học vấn + bảo vệ tốt', confidence: 82, evidence: ['格局=正印', 'no Tài'], links: ['education','parents'] } },
  { id: 'geju_an_bai_tai_pha', category: ['education'], priority: 78, condition: (f) => f.has_正印 && (f.has_正财 || f.has_偏财) && (f['正财_count'] + f['偏财_count']) >= 2, conclusion: { result: 'tai_pha_an', message: 'Ấn bị Tài phá (≥2 Tài) → học gián đoạn, mẹ yếu', confidence: 70, evidence: ['has 正印', 'Tài ≥2'], links: ['education','parents'] } },
  { id: 'geju_thuc_bai_kieu', category: ['health','career'], priority: 82, condition: (f) => f.has_食神 && f.has_偏印 && !f.has_正财 && !f.has_偏财, conclusion: { result: 'kieu_doat_thuc_bai', message: 'Kiêu thần đoạt Thực (không Tài giải) → tài năng bị èm, sức khỏe kém', confidence: 75, evidence: ['has 食神', 'has 偏印', 'no Tài'], links: ['health','career'] } },

  // --- THÊM POSITION (盲派金口诀 còn thiếu) ---
  { id: 'nguyet_thuong_quan', category: ['siblings','personality'], priority: 63, condition: (f) => f['伤官_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'thang_chan_han', message: 'Tháng trụ có Thương Quan → thiếu anh em, cô đơn', confidence: 58, evidence: ['伤官 at tháng'], links: ['siblings','personality'] } },
  { id: 'nhat_thuong_quan', category: ['marriage'], priority: 67, condition: (f) => f['伤官_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'nhat_thuong', message: 'Ngày trụ có Thương Quan → nữ khắc chồng, nam khắc vợ', confidence: 62, evidence: ['伤官 at ngày'], links: ['marriage'] } },
  { id: 'nguyet_bi_kien', category: ['siblings'], priority: 63, condition: (f) => (f['比肩_positions']||f['劫财_positions'])?.some(p => p.startsWith('tháng')), conclusion: { result: 'huynh_de_bat_hop', message: 'Tháng trụ có Tỷ Kiếp → bất hòa anh chị em', confidence: 58, evidence: ['Tỷ/Kiếp at tháng'], links: ['siblings'] } },
  { id: 'nhat_bi_kien', category: ['personality'], priority: 65, condition: (f) => f['比肩_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'ban_than_doc_lap', message: 'Ngày trụ có Tỷ Kiên → bản thân độc lập, tự lập', confidence: 60, evidence: ['比肩 at ngày'], links: ['personality'] } },
  { id: 'thoi_bi_kien', category: ['children','wealth'], priority: 63, condition: (f) => (f['比肩_positions']||f['劫财_positions'])?.some(p => p.startsWith('giờ')), conclusion: { result: 'con_canh_cu', message: 'Giờ trụ có Tỷ Kiếp → con cái can đảm/cạnh tranh,晚年 hao tài', confidence: 58, evidence: ['Tỷ/Kiếp at giờ'], links: ['children','wealth'] } },
  { id: 'nguyet_pian_yin', category: ['personality'], priority: 65, condition: (f) => f['偏印_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'da_tai_nhieu_nghe', message: 'Tháng trụ có Thiên Ấn → đa tài đa nghệ, nhưng lười', confidence: 60, evidence: ['偏印 at tháng'], links: ['personality'] } },
  { id: 'nhat_pian_yin', category: ['personality','marriage'], priority: 66, condition: (f) => f['偏印_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'tinh_co_quyen', message: 'Ngày trụ có Thiên Ấn → có quyền nhưng cô đơn, hôn nhân khó hòa', confidence: 62, evidence: ['偏印 at ngày'], links: ['personality','marriage'] } },
  { id: 'thoi_pian_yin', category: ['children'], priority: 63, condition: (f) => f['偏印_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'thoi_bat_luong', message: 'Giờ trụ có Thiên Ấn → đầu thai con gái có tai họa,晚年 cô', confidence: 56, evidence: ['偏印 at giờ'], links: ['children'] } },
  { id: 'nguyet_zhengcai_tre', category: ['wealth'], priority: 68, condition: (f) => f['正财_positions']?.some(p => p.startsWith('tháng')), conclusion: { result: 'tai_nguyet_tre', message: 'Tháng trụ có Chính Tài → tài chính mạnh, lương ổn định từ trẻ', confidence: 66, evidence: ['正财 at tháng'], links: ['wealth'] } }, // [AUDIT FIX] rename id (dup với line 158 → bị dedup shadow)
  { id: 'thoi_zhengcai', category: ['wealth','children'], priority: 67, condition: (f) => f['正财_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'tai_thoi', message: 'Giờ trụ có Chính Tài → tài lộc晚niên, con đầu con trai', confidence: 64, evidence: ['正财 at giờ'], links: ['wealth','children'] } },

  // --- THÊM TIMING ---
  // [AUDIT FIX] removed dead stub dayun_ganzhi_xung_nhat (luôn return false, confidence 0).
  { id: 'nam_than_manh', category: ['personality'], priority: 70, condition: (f) => f.isStrong && (f['正官_count'] + f['七杀_count']) >= 1, conclusion: { result: 'than_manh_co_quan', message: 'Thân mạnh + có Quan/Sat → gánh vác được quyền, không bị áp', confidence: 72, evidence: ['isStrong', 'has Quan/Sat'], links: ['career','personality'] } },
  { id: 'than_nhược_vo_quan', category: ['career'], priority: 72, condition: (f) => f.isWeak && !f.has_正官 && !f.has_七杀, conclusion: { result: 'than_nhieu_vo_quan', message: 'Thân nhược + không Quan/Sat → sự nghiệp khó, cần Ấn/Tỷ giúp', confidence: 68, evidence: ['isWeak', 'no Quan/Sat'], links: ['career'] } },
  { id: 'than_manh_co_tai', category: ['wealth'], priority: 72, condition: (f) => f.isStrong && (f.has_正财 || f.has_偏财), conclusion: { result: 'than_manh_nham_tai', message: 'Thân mạnh + có Tài → thân nhậm tài được → giàu', confidence: 75, evidence: ['isStrong', 'has Tài'], links: ['wealth'] } },
  { id: 'than_nhieu_tai_nhieu', category: ['wealth','health'], priority: 75, condition: (f) => f.isWeak && (f['正财_count'] + f['偏财_count']) >= 2, conclusion: { result: 'tai_nhieu_hai_than', message: 'Thân nhược + Tài nhiều → tài nhiều hại thân, vợ chèn ép (nam)', confidence: 70, evidence: ['isWeak', 'Tài ≥2'], links: ['wealth','health'] } },

  // --- THÊM HEALTH ORGAN-SPECIFIC ---
  { id: 'moc_vuong_gan_manh', category: ['health','personality'], priority: 68, condition: (f) => f.wx_木_strong && f.wx_木_pct >= 35, conclusion: { result: 'gan_manh', message: 'Mộc vượng → gan mạnh, nhưng dễ tức giận, tóc dày', confidence: 65, evidence: ['Mộc ≥35%'], links: ['health','personality'] } },
  { id: 'hoa_vuong_tim_manh', category: ['health','personality'], priority: 68, condition: (f) => f.wx_火_strong && f.wx_火_pct >= 35, conclusion: { result: 'tim_manh', message: 'Hỏa vượng → tim mạnh, nhiệt huyết, nhưng huyết áp cao', confidence: 65, evidence: ['Hỏa ≥35%'], links: ['health','personality'] } },
  { id: 'kim_vuong_phoi_manh', category: ['health','personality'], priority: 68, condition: (f) => f.wx_金_strong && f.wx_金_pct >= 35, conclusion: { result: 'phoi_manh', message: 'Kim vượng → phổi mạnh, kỷ luật, nhưng da khô', confidence: 65, evidence: ['Kim ≥35%'], links: ['health','personality'] } },
  { id: 'thuy_vuong_than_manh', category: ['health','personality'], priority: 68, condition: (f) => f.wx_水_strong && f.wx_水_pct >= 35, conclusion: { result: 'than_manh', message: 'Thủy vượng → thận mạnh, trí tuệ, nhưng dễ sưng/béo', confidence: 65, evidence: ['Thủy ≥35%'], links: ['health','personality'] } },
  { id: 'tho_vuong_ty_manh', category: ['health','personality'], priority: 68, condition: (f) => f.wx_土_strong && f.wx_土_pct >= 35, conclusion: { result: 'ty_manh', message: 'Thổ vượng → tỳ/vị mạnh, cơ thể chắc, nhưng nặng nề', confidence: 65, evidence: ['Thổ ≥35%'], links: ['health','personality'] } },

  // --- SPOUSE DETAIL ---
  { id: 'spouse_vuong', category: ['marriage'], priority: 78, condition: (f) => { const sc = f.isFemale ? (f['正官_count'] + f['七杀_count']) : (f['正财_count'] + f['偏财_count']); return sc >= 2; }, conclusion: { result: 'phoi_ngau_vuong', message: 'Sao phối ngẫu ≥2 → phối ngẫu vượng, duyên mạnh, nhưng dễ đa phu/thê', confidence: 72, evidence: ['spouse star ≥2'], links: ['marriage'] } },
  { id: 'spouse_nhieu', category: ['marriage'], priority: 80, condition: (f) => { const sc = f.isFemale ? (f['正官_count'] + f['七杀_count']) : (f['正财_count'] + f['偏财_count']); return sc >= 4; }, conclusion: { result: 'phoi_ngau_nhieu', message: 'Sao phối ngẫu ≥4 → phối ngẫu QUÁ NHIỀU → dễ ly hôn/đa phu/thê', confidence: 75, evidence: ['spouse star ≥4'], links: ['marriage'] } },
  { id: 'spouse_khong', category: ['marriage'], priority: 82, condition: (f) => { const sc = f.isFemale ? (f['正官_count'] + f['七杀_count']) : (f['正财_count'] + f['偏财_count']); return sc === 0; }, conclusion: { result: 'phoi_ngau_khong', message: 'Sao phối ngẫu KHÔNG có → hôn nhân rất khó/khó khăn, cần đại vận mang sao', confidence: 78, evidence: ['spouse star = 0'], links: ['marriage'] } },
  { id: 'spouse_tang_only', category: ['marriage'], priority: 75, condition: (f) => { const positions = f.isFemale ? (f['正官_positions']||[]).concat(f['七杀_positions']||[]) : (f['正财_positions']||[]).concat(f['偏财_positions']||[]); return positions.length > 0 && positions.every(p => p.includes('tàng')); }, conclusion: { result: 'spouse_tang_only', message: 'Sao phối ngẫu CHỈ ở tàng can → duyên ẩn, khó kết hôn hoặc bạn đời khiêm nhường', confidence: 68, evidence: ['spouse star tàng only'], links: ['marriage'] } },

  // --- WEALTH DETAIL ---
  { id: 'tai_kho', category: ['wealth'], priority: 75, condition: (f) => f['七杀_count'] >= 1, conclusion: { result: 'tai_kho_sat', message: 'Có Thất Sát → tài có kho (sat = kho), giữ được tiền nếu có chế', confidence: 65, evidence: ['has 七杀'], links: ['wealth'] } }, // [AUDIT FIX] condition khớp message (chỉ cần 七杀, không cần cả 正官)
  { id: 'than_nhieu_tai_co_kho', category: ['wealth'], priority: 73, condition: (f) => f.isStrong && f.has_正财, conclusion: { result: 'than_manh_tai_co_kho', message: 'Thân mạnh + Chính Tài → có khả năng tích lũy, giữ tiền', confidence: 70, evidence: ['isStrong', 'has 正财'], links: ['wealth'] } },

  // --- EDUCATION DETAIL ---
  { id: 'hoc_van_tu_nhien', category: ['education'], priority: 75, condition: (f) => f['正印_count'] >= 2 && !f.has_正财 && !f.has_偏财, conclusion: { result: 'hoc_tu_nhien', message: 'Chính Ấn ≥2 + không Tài phá → học vấn tự nhiên tốt, bằng cấp cao', confidence: 75, evidence: ['正印 ≥2', 'no Tài'], links: ['education'] } },
  { id: 'hoc_thuc_che', category: ['education'], priority: 78, condition: (f) => f.has_食神 && f.has_七杀, conclusion: { result: 'hoc_ky_nang', message: 'Thực chế Sát → học vấn qua kỹ năng/thực hành, không hàn lâm', confidence: 72, evidence: ['食神+七杀'], links: ['education','career'] } },

  // --- CHILDREN ---
  { id: 'con_cai_co', category: ['children'], priority: 72, condition: (f) => { const cc = f.isFemale ? (f['食神_count'] + f['伤官_count']) : (f['七杀_count'] + f['正官_count']); return cc >= 1; }, conclusion: { result: 'co_con', message: 'Có sao con cái → có con, duyên con tốt', confidence: 65, evidence: ['children star ≥1'], links: ['children'] } },
  { id: 'con_cai_khong', category: ['children'], priority: 80, condition: (f) => { const cc = f.isFemale ? (f['食神_count'] + f['伤官_count']) : (f['七杀_count'] + f['正官_count']); return cc === 0; }, conclusion: { result: 'kho_con', message: 'KHÔNG có sao con cái → khó có con, cần đại vận mang sao con', confidence: 72, evidence: ['children star = 0'], links: ['children'] } },
  { id: 'con_cai_nhieu', category: ['children'], priority: 70, condition: (f) => { const cc = f.isFemale ? (f['食神_count'] + f['伤官_count']) : (f['七杀_count'] + f['正官_count']); return cc >= 3; }, conclusion: { result: 'nhieu_con', message: 'Sao con cái ≥3 → nhiều con, duyên con mạnh', confidence: 65, evidence: ['children star ≥3'], links: ['children'] } },
  // === BATCH 2: RULES 96-130 ===
  // --- SHENSHA ---
  { id: 'shensha_an_nhieu', category: ['parents','personality'], priority: 67, condition: (f) => f['正印_count'] >= 2, conclusion: { result: 'duoc_bao_ve', message: 'Chinh An >=2 → duoc bao ve manh (me/ai am)', confidence: 62, evidence: ['正印 >=2'], links: ['parents','personality'] } },
  { id: 'shensha_thuong_nhieu', category: ['personality','career'], priority: 70, condition: (f) => f['伤官_count'] >= 2, conclusion: { result: 'sang_tao_nhieu', message: 'Thuong Quan >=2 → sang tao dinh, khau tai, nhung kieu', confidence: 65, evidence: ['伤官 >=2'], links: ['personality','career'] } },
  { id: 'shensha_thuc_nhieu', category: ['personality','health'], priority: 65, condition: (f) => f['食神_count'] >= 2, conclusion: { result: 'huong_thu', message: 'Thuc Than >=2 → huong thu, am no, luoi', confidence: 60, evidence: ['食神 >=2'], links: ['personality','health'] } },
  { id: 'shensha_kiet_nhieu', category: ['wealth','personality'], priority: 68, condition: (f) => f['劫财_count'] >= 2, conclusion: { result: 'de_mat_tai', message: 'Kiet Tai >=2 → de mat tai san, ban be xau', confidence: 62, evidence: ['劫财 >=2'], links: ['wealth','personality'] } },
  { id: 'shensha_ty_nhieu', category: ['personality'], priority: 65, condition: (f) => f['比肩_count'] >= 3, conclusion: { result: 'doc_lap_manh', message: 'Ty Kien >=3 → doc lap qua manh, kho hop tac', confidence: 60, evidence: ['比肩 >=3'], links: ['personality'] } },
  // --- LUCQIN ---
  { id: 'lucqin_khac_cha', category: ['parents'], priority: 75, condition: (f) => (f['比肩_count'] + f['劫财_count']) >= 2 && (f['正财_count'] + f['偏财_count']) >= 1, conclusion: { result: 'khac_cha', message: 'Ty Kiet >=2 + Tai → khac cha (ty kiet tranh tai)', confidence: 65, evidence: ['Ty/Kiet+Tai'], links: ['parents'] } },
  { id: 'lucqin_khac_me', category: ['parents'], priority: 75, condition: (f) => (f['正财_count'] + f['偏财_count']) >= 2 && (f['正印_count'] + f['偏印_count']) >= 1, conclusion: { result: 'khac_me', message: 'Tai >=2 + An → Tai khac An = me yeu', confidence: 65, evidence: ['Tai+An'], links: ['parents'] } },
  { id: 'lucqin_vo_chong_on', category: ['marriage'], priority: 78, condition: (f) => f.has_正官 && f.has_正印, conclusion: { result: 'vo_chong_on', message: 'Quan + An → vo chong on (Quan duoc An sinh)', confidence: 72, evidence: ['Quan+An'], links: ['marriage'] } },
  { id: 'lucqin_huynh_kiet', category: ['siblings'], priority: 67, condition: (f) => f['劫财_count'] >= 2, conclusion: { result: 'huynh_hao', message: 'Kiet Tai >=2 → anh chi em hao tien/bat hoa', confidence: 60, evidence: ['劫财 >=2'], links: ['siblings'] } },
  // --- APPEARANCE DEEPER ---
  { id: 'app_moc', category: ['appearance'], priority: 73, condition: (f) => f.wx_木_strong && f.wx_木_pct >= 25, conclusion: { result: 'moc_thanh', message: 'Moc vuong → cao, thanh tu, toc day, mat sau', confidence: 68, evidence: ['Moc >=25%'], links: ['appearance'] } },
  { id: 'app_hoa', category: ['appearance'], priority: 73, condition: (f) => f.wx_火_strong && f.wx_火_pct >= 25, conclusion: { result: 'hoa_sang', message: 'Hoa vuong → mat sang, da am/hong, rang ro', confidence: 68, evidence: ['Hoa >=25%'], links: ['appearance'] } },
  { id: 'app_tho', category: ['appearance'], priority: 73, condition: (f) => f.wx_土_strong && f.wx_土_pct >= 30, conclusion: { result: 'tho_chac', message: 'Tho vuong → co the chac, mat vuong/tron, da sam', confidence: 68, evidence: ['Tho >=30%'], links: ['appearance'] } },
  { id: 'app_kim', category: ['appearance'], priority: 73, condition: (f) => f.wx_金_strong && f.wx_金_pct >= 25, conclusion: { result: 'kim_sac', message: 'Kim vuong → goc canh ro, da trang, toc cung', confidence: 68, evidence: ['Kim >=25%'], links: ['appearance'] } },
  { id: 'app_thuy', category: ['appearance'], priority: 73, condition: (f) => f.wx_水_strong && f.wx_水_pct >= 25, conclusion: { result: 'thuy_duyen', message: 'Thuy vuong → mat long lanh, da min, duyen dang', confidence: 68, evidence: ['Thuy >=25%'], links: ['appearance'] } },
  // --- PERSONALITY DEEPER ---
  { id: 'pers_quyet_doan', category: ['personality'], priority: 75, condition: (f) => (f.has_正官 || f.has_七杀) && f.isStrong, conclusion: { result: 'quyet_doan', message: 'Than manh + Quan/Sat → quyet doan, lanh dao', confidence: 72, evidence: ['strong+Quan/Sat'], links: ['personality','career'] } },
  { id: 'pers_an_nha', category: ['personality'], priority: 72, condition: (f) => f.has_正印 && f.isWeak, conclusion: { result: 'an_nha', message: 'Than nhuoc + An → an nha, bao dung, thieu quyet doan', confidence: 68, evidence: ['weak+An'], links: ['personality'] } },
  { id: 'pers_phan_khang', category: ['personality'], priority: 72, condition: (f) => f.has_伤官 && !f.has_正印 && !f.has_偏印, conclusion: { result: 'phan_khang', message: 'Thuong Quan khong An → phan khang, nguoc chieu, kho bao', confidence: 68, evidence: ['伤官 no An'], links: ['personality'] } },
  { id: 'pers_nghe_thuat', category: ['personality','career'], priority: 70, condition: (f) => f.has_食神 && f.has_伤官, conclusion: { result: 'nghe_thuat', message: 'Thuc + Thuong → nghe thuat, sang tao, tham my', confidence: 65, evidence: ['Thuc+Thuong'], links: ['personality','career'] } },
  { id: 'pers_truc_giac', category: ['personality'], priority: 68, condition: (f) => f.has_偏印 && f['食神_count'] === 0, conclusion: { result: 'truc_giac', message: 'Thien An khong Thuc → truc giac manh, ton giao, huyen hoc', confidence: 63, evidence: ['偏印 no 食神'], links: ['personality'] } },
  // --- CAREER SPECIFIC ---
  { id: 'career_kinh_doanh', category: ['career','wealth'], priority: 75, condition: (f) => f.isStrong && f.has_偏财 && (f.has_食神 || f.has_伤官), conclusion: { result: 'kinh_doanh', message: 'Than manh + Thien Tai + Thuc/Thuong → kinh doanh phat', confidence: 72, evidence: ['strong+偏财+Thuc/Thuong'], links: ['career','wealth'] } },
  { id: 'career_quan_chuc', category: ['career'], priority: 76, condition: (f) => (f.has_正官 || f.has_七杀) && (f.has_正印 || f.has_偏印), conclusion: { result: 'quan_chuc', message: 'Quan/Sat + An → lam quan/chuc, cong chuc', confidence: 73, evidence: ['Quan/Sat+An'], links: ['career'] } },
  { id: 'career_doc_lap', category: ['career'], priority: 70, condition: (f) => f['比肩_count'] >= 2 && !f.has_正官 && !f.has_七杀, conclusion: { result: 'doc_lap', message: 'Ty Kien >=2 + khong Quan/Sat → tu kinh doanh, tu do', confidence: 65, evidence: ['Ty Kien, no Quan'], links: ['career'] } },
  // --- TIMING SPECIFIC ---
  { id: 'timing_manh_dung', category: ['timing'], priority: 78, condition: (f) => f.isStrong && f.dayunIsDung, conclusion: { result: 'than_manh_van_tot', message: 'Than manh + dai van Dung → thoi ky PHAT (tai/quyen tang)', confidence: 75, evidence: ['strong+dung'], links: ['timing'] } },
  { id: 'timing_nhieu_ky', category: ['timing'], priority: 80, condition: (f) => f.isWeak && f.dayunIsKy, conclusion: { result: 'than_nhieu_van_ky', message: 'Than nhuoc + dai van Ky → thoi ky NGUY (suc khoe/tai giam)', confidence: 76, evidence: ['weak+ky'], links: ['timing'] } },
  { id: 'timing_nhieu_dung', category: ['timing'], priority: 77, condition: (f) => f.isWeak && f.dayunIsDung, conclusion: { result: 'than_nhieu_van_dung', message: 'Than nhuoc + dai van Dung → thoi ky HOI PHUC (An/Ty giup)', confidence: 73, evidence: ['weak+dung'], links: ['timing'] } },
  // --- WEALTH SPECIFIC ---
  { id: 'wealth_giau', category: ['wealth'], priority: 78, condition: (f) => f.isStrong && (f['正财_count'] + f['偏财_count']) >= 2 && f.has_食神, conclusion: { result: 'giau', message: 'Than manh + Tai >=2 + Thuc sinh → giau co', confidence: 75, evidence: ['strong+Tai+Thuc'], links: ['wealth'] } },
  { id: 'wealth_ngheo', category: ['wealth'], priority: 78, condition: (f) => f.isWeak && (f['正财_count'] + f['偏财_count']) >= 3, conclusion: { result: 'tai_nhieu_ngheo', message: 'Than nhuoc + Tai >=3 → tai nhieu hai than, ngheo hoac benh', confidence: 72, evidence: ['weak+Tai>=3'], links: ['wealth','health'] } },
  { id: 'wealth_khong_tai', category: ['wealth'], priority: 72, condition: (f) => (f['正财_count'] + f['偏财_count']) === 0, conclusion: { result: 'khong_tai', message: 'KHONG co Tai tinh → tai van phai cho dai van mang Tai', confidence: 68, evidence: ['Tai = 0'], links: ['wealth'] } },

  // === BATCH 3: RULES 131-165 ===
  { id: 'tiao_han', category: ['health','personality'], priority: 80, condition: (f) => f['wx_火_pct'] <= 10, conclusion: { result: 'han_menh', message: 'Hoa yeu nhat → han menh, can DIEU HAU bang Hoa', confidence: 78, evidence: ['Hoa <=10%'], links: ['health','personality'] } },
  { id: 'tiao_nhiet', category: ['health','personality'], priority: 80, condition: (f) => f['wx_水_pct'] <= 10, conclusion: { result: 'nhiet_menh', message: 'Thuy yeu nhat → nhiet menh, can DIEU HAU bang Thuy', confidence: 78, evidence: ['Thuy <=10%'], links: ['health','personality'] } },
  { id: 'nayin_kim', category: ['appearance','personality'], priority: 65, condition: (f) => f.dayMasterWx === '金', conclusion: { result: 'nayin_kim', message: 'Nhat chu Kim → thanh cao, goc canh', confidence: 60, evidence: ['dm=Kim'], links: ['appearance','personality'] } },
  { id: 'nayin_moc', category: ['appearance','personality'], priority: 65, condition: (f) => f.dayMasterWx === '木', conclusion: { result: 'nayin_moc', message: 'Nhat chu Moc → cao mong, mem mai', confidence: 60, evidence: ['dm=Moc'], links: ['appearance','personality'] } },
  { id: 'nayin_hoa', category: ['appearance','personality'], priority: 65, condition: (f) => f.dayMasterWx === '火', conclusion: { result: 'nayin_hoa', message: 'Nhat chu Hoa → rang ro, sang', confidence: 60, evidence: ['dm=Hoa'], links: ['appearance','personality'] } },
  { id: 'nayin_tho', category: ['appearance','personality'], priority: 65, condition: (f) => f.dayMasterWx === '土', conclusion: { result: 'nayin_tho', message: 'Nhat chu Tho → chac nan, on dinh', confidence: 60, evidence: ['dm=Tho'], links: ['appearance','personality'] } },
  { id: 'nayin_thuy', category: ['appearance','personality'], priority: 65, condition: (f) => f.dayMasterWx === '水', conclusion: { result: 'nayin_thuy', message: 'Nhat chu Thuy → uyen chuyen, minh tri', confidence: 60, evidence: ['dm=Thuy'], links: ['appearance','personality'] } },
  { id: 'nu_career_an', category: ['career'], priority: 75, condition: (f) => f.isFemale && f.has_正印 && !f.has_正官 && !f.has_七杀, conclusion: { result: 'nu_an_career', message: 'Nu co An, khong Quan/Sat → nghe an dinh (giao vien/y/van phong)', confidence: 68, evidence: ['female+An'], links: ['career'] } },
  { id: 'nu_career_sat', category: ['career'], priority: 73, condition: (f) => f.isFemale && f.has_七杀 && f.isStrong, conclusion: { result: 'nu_sat_career', message: 'Nu than manh + Sat → nghe quyen luc (quan/kinh doanh)', confidence: 68, evidence: ['female+strong+Sat'], links: ['career'] } },
  { id: 'nu_career_thuong', category: ['career'], priority: 73, condition: (f) => f.isFemale && f.has_伤官 && !f.has_正印, conclusion: { result: 'nu_thuong_career', message: 'Nu Thuong Quan khong An → nghe tu do/sang tao', confidence: 65, evidence: ['female+Thuong'], links: ['career'] } },
  { id: 'spouse_chinh', category: ['marriage'], priority: 72, condition: (f) => { const ss = f.isFemale ? f['正官_count'] : f['正财_count']; return ss >= 1; }, conclusion: { result: 'chinh_phoi', message: 'Sao CHINH → ban doi chinh pp, on dinh', confidence: 65, evidence: ['chinh star'], links: ['marriage'] } },
  { id: 'spouse_thien', category: ['marriage'], priority: 72, condition: (f) => { const ss = f.isFemale ? f['七杀_count'] : f['偏财_count']; return ss >= 1; }, conclusion: { result: 'thien_phoi', message: 'Sao THIEN → ban doi bat on/tu do', confidence: 62, evidence: ['thien star'], links: ['marriage'] } },
  { id: 'moc_hoa_xuan', category: ['personality'], priority: 72, condition: (f) => f.wx_木_strong && f.wx_火_strong, conclusion: { result: 'moc_hoa', message: 'Moc sinh Hoa → nhiet huyet, sang tao', confidence: 68, evidence: ['Moc+Hoa'], links: ['personality'] } },
  { id: 'kim_thuy', category: ['personality'], priority: 72, condition: (f) => f.wx_金_strong && f.wx_水_strong, conclusion: { result: 'kim_thuy', message: 'Kim sinh Thuy → thong minh, tri tue', confidence: 70, evidence: ['Kim+Thuy'], links: ['personality'] } },
  { id: 'tho_kim', category: ['personality'], priority: 70, condition: (f) => f.wx_土_strong && f.wx_金_strong, conclusion: { result: 'tho_kim', message: 'Tho sinh Kim → vung chai + ky luat', confidence: 68, evidence: ['Tho+Kim'], links: ['personality'] } },
  { id: 'thuy_moc', category: ['personality','education'], priority: 72, condition: (f) => f.wx_水_strong && f.wx_木_strong, conclusion: { result: 'thuy_moc', message: 'Thuy sinh Moc → tri tue + phat trien', confidence: 70, evidence: ['Thuy+Moc'], links: ['personality','education'] } },
  { id: 'hoa_tho', category: ['personality'], priority: 70, condition: (f) => f.wx_火_strong && f.wx_土_strong, conclusion: { result: 'hoa_tho', message: 'Hoa sinh Tho → nhiet huyet + on dinh', confidence: 65, evidence: ['Hoa+Tho'], links: ['personality'] } },
  { id: 'moc_kim_xung', category: ['health','personality'], priority: 73, condition: (f) => f.wx_木_strong && f.wx_金_strong, conclusion: { result: 'moc_kim_giao_chien', message: 'Moc Kim giao chien → noi tam mau thuan', confidence: 70, evidence: ['Moc+Kim xung'], links: ['health','personality'] } },
  { id: 'thuy_hoa_xung', category: ['health','personality'], priority: 73, condition: (f) => f.wx_水_strong && f.wx_火_strong, conclusion: { result: 'thuy_hoa_xung', message: 'Thuy Hoa giao chien → cam xuc manh, bat on', confidence: 70, evidence: ['Thuy+Hoa xung'], links: ['health','personality'] } },
  { id: 'tai_van_dung_phat', category: ['wealth','timing'], priority: 75, condition: (f) => f.dayunIsDung && (f.has_正财 || f.has_偏财 || f.has_食神), conclusion: { result: 'tai_phat', message: 'Dai van Dung + Tai/Thuc → tai van dang PHAT', confidence: 73, evidence: ['dung+Tai'], links: ['wealth','timing'] } },
  { id: 'tai_van_ky_mat', category: ['wealth','timing'], priority: 78, condition: (f) => f.dayunIsKy && f.combo_ty_tranh_tai, conclusion: { result: 'tai_mat', message: 'Dai van Ky + Ty Kiet tranh Tai → de MAT TIEN', confidence: 75, evidence: ['ky+ty tranh'], links: ['wealth','timing'] } },
  { id: 'career_dung_len', category: ['career','timing'], priority: 76, condition: (f) => f.dayunIsDung && (f.has_正官 || f.has_七杀), conclusion: { result: 'career_len', message: 'Dai van Dung + Quan/Sat → su nghiep LEN', confidence: 73, evidence: ['dung+Quan'], links: ['career','timing'] } },
  { id: 'marriage_dung_thuan', category: ['marriage','timing'], priority: 75, condition: (f) => f.dayunIsDung, conclusion: { result: 'hon_thuan', message: 'Dai van Dung → hon nhan THUAN', confidence: 68, evidence: ['dung'], links: ['marriage','timing'] } },
  { id: 'health_ky_giam', category: ['health','timing'], priority: 80, condition: (f) => f.dayunIsKy, conclusion: { result: 'sk_giam', message: 'Dai van Ky → suc khoe giam (can de phong benh)', confidence: 72, evidence: ['ky'], links: ['health','timing'] } },
  { id: 'edu_dung_thuan', category: ['education','timing'], priority: 75, condition: (f) => f.dayunIsDung && (f.has_正印 || f.has_偏印), conclusion: { result: 'hoc_thuan', message: 'Dai van Dung + An → hoc van THUAN', confidence: 70, evidence: ['dung+An'], links: ['education','timing'] } },
  { id: 'children_dung_thuan', category: ['children','timing'], priority: 72, condition: (f) => f.dayunIsDung, conclusion: { result: 'con_thuan', message: 'Dai van Dung → de sinh con/duyen con tot', confidence: 60, evidence: ['dung'], links: ['children','timing'] } },

  // === BATCH 4: RULES 157-200 (final) ===

  // --- MORE POSITION (complete 40 盲派金口诀) ---
  { id: 'nien_an_lac_am', category: ['parents','personality'], priority: 63, condition: (f) => (f['正印_positions']||[]).concat(f['偏印_positions']||[]).some(p => p.startsWith('năm')), conclusion: { result: 'nien_an', message: 'Năm trụ có Ấn → tổ ấm, mẹ hiền, bẩm sinh được bảo vệ', confidence: 62, evidence: ['Ấn at năm'], links: ['parents','personality'] } },
  { id: 'nguyet_thuc_sinh_tai', category: ['wealth'], priority: 68, condition: (f) => f['食神_positions']?.some(p => p.startsWith('tháng')) && (f.has_正财 || f.has_偏财), conclusion: { result: 'thuc_sinh_tai', message: 'Tháng có Thục + Tài → thực sinh tài, phát tài từ trung niên', confidence: 65, evidence: ['食神+Tài at tháng'], links: ['wealth'] } },
  { id: 'nhat_an_co_quyen', category: ['career','personality'], priority: 68, condition: (f) => f['正印_positions']?.some(p => p.startsWith('ngày')), conclusion: { result: 'nhat_an', message: 'Ngày có Chính Ấn → thông minh, phúc lộc, vợ/chồng giúp', confidence: 66, evidence: ['正印 at ngày'], links: ['career','personality'] } },
  { id: 'thoi_an_phuc', category: ['children','personality'], priority: 65, condition: (f) => (f['正印_positions']||[]).concat(f['偏印_positions']||[]).some(p => p.startsWith('giờ')), conclusion: { result: 'thoi_an', message: 'Giờ có Ấn → con hiếu thảo, đời sống ổn, không cực khổ', confidence: 62, evidence: ['Ấn at giờ'], links: ['children','personality'] } },
  { id: 'nguyet_zhengguan_tai_sinh', category: ['career','wealth'], priority: 70, condition: (f) => f['正官_positions']?.some(p => p.startsWith('tháng')) && (f.has_正财 || f.has_偏财), conclusion: { result: 'tai_sinh_quan_nguyet', message: 'Tháng Chính Quan + Tài sinh → sự nghiệp mạnh từ trẻ (tài lực hỗ trợ)', confidence: 68, evidence: ['Quan+Tài at tháng'], links: ['career','wealth'] } },
  { id: 'thoi_zhengguan_dai_cat', category: ['children','career'], priority: 68, condition: (f) => f['正官_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'thoi_quan', message: 'Giờ có Chính Quan → con cái hiếu thảo, đời sống ổn định, lộc thọ', confidence: 66, evidence: ['正官 at giờ'], links: ['children'] } },

  // --- INTERACTION RULES (刑/冲/合/害) ---
  { id: 'interaction_ty_nhieu', category: ['personality','wealth'], priority: 72, condition: (f) => (f['比肩_count'] + f['劫财_count']) >= 3, conclusion: { result: 'ty_kiet_nhieu', message: 'Tỷ Kiếp >=3 → quá nhiều cạnh tranh, khó hợp tác, cần độc lập', confidence: 68, evidence: ['Tỷ+Kiếp >=3'], links: ['personality','wealth'] } },
  { id: 'interaction_an_nhieu', category: ['personality','education'], priority: 72, condition: (f) => (f['正印_count'] + f['偏印_count']) >= 3, conclusion: { result: 'an_nhieu', message: 'Ấn >=3 → quá nhiều bảo vệ → ỷ lại, thiếu tự lập, nhưng học giỏi', confidence: 68, evidence: ['An >=3'], links: ['personality','education'] } },
  { id: 'interaction_quan_sat_nhieu', category: ['career','marriage'], priority: 75, condition: (f) => (f['正官_count'] + f['七杀_count']) >= 3, conclusion: { result: 'quan_sat_nhieu', message: 'Quan+Sat >=3 → quá nhiều quyền lực → áp lực, hôn nhân bất ổn', confidence: 72, evidence: ['Quan+Sat >=3'], links: ['career','marriage'] } },
  { id: 'interaction_tai_nhieu', category: ['wealth','marriage'], priority: 73, condition: (f) => (f['正财_count'] + f['偏财_count']) >= 4, conclusion: { result: 'tai_nhieu', message: 'Tài >=4 → tài nhiều nhưng than khong nham → tài hại thân hoặc đa phu/thê', confidence: 70, evidence: ['Tài >=4'], links: ['wealth','marriage'] } },
  { id: 'interaction_thuc_thuong_nhieu', category: ['personality','health'], priority: 70, condition: (f) => (f['食神_count'] + f['伤官_count']) >= 4, conclusion: { result: 'thuc_thuong_nhieu', message: 'Thực+Thương >=4 → sáng tạo quá nhưng phung phí năng lượng, lười', confidence: 65, evidence: ['Thực+Thương >=4'], links: ['personality','health'] } },

  // --- DETAIL: MARRIAGE ---
  { id: 'marriage_ly_hon_signal', category: ['marriage'], priority: 82, condition: (f) => f.isFemale && (f['伤官_count'] >= 2) && !f.has_正印, conclusion: { result: 'ly_hon_risk', message: 'Nữ mệnh Thương Quan >=2 không Ấn → RẤT dễ ly hôn, cần Ấn đại vận', confidence: 78, evidence: ['female+Thuong >=2 no An'], links: ['marriage'] } },
  { id: 'marriage_vo_chong_hoa', category: ['marriage'], priority: 75, condition: (f) => (f.has_正官 || f.has_七杀) && (f.has_正财 || f.has_偏财), conclusion: { result: 'cai_quan_hoa', message: 'Tài + Quan/Sat → tài sinh quan, vợ chồng hòa (nam = có tài nuôi vợ; nữ = chồng có tài)', confidence: 70, evidence: ['Tài+Quan'], links: ['marriage','wealth'] } },

  // --- DETAIL: CAREER ---
  { id: 'career_sang_tao', category: ['career','personality'], priority: 72, condition: (f) => f['伤官_count'] >= 1 && !f.has_正官, conclusion: { result: 'nghe_sang_tao', message: 'Thương Quan không Quan → nên làm nghề sáng tạo/tự do (không hợp công chức)', confidence: 68, evidence: ['Thuong no Quan'], links: ['career'] } },
  { id: 'career_on_dinh', category: ['career'], priority: 75, condition: (f) => f.has_正官 && f.has_正印 && !f.has_伤官, conclusion: { result: 'nghe_on_dinh', message: 'Quan + Ấn không Thương Quan → sự nghiệp ổn định, nên công chức/quan chức', confidence: 72, evidence: ['Quan+An no Thuong'], links: ['career'] } },

  // --- DETAIL: HEALTH ---
  { id: 'health_tho_kim_giao_chien', category: ['health'], priority: 72, condition: (f) => f.wx_土_strong && f.wx_木_strong, conclusion: { result: 'tho_moc_xung', message: 'Thổ Mộc giao chiến → tỳ/vị + gan cùng lúc gặp vấn đề (tiêu hóa + tức giận)', confidence: 68, evidence: ['Tho+Moc xung'], links: ['health'] } },
  { id: 'health_kim_thuy_giao_chien', category: ['health'], priority: 72, condition: (f) => f.wx_金_strong && f.wx_火_strong, conclusion: { result: 'kim_hoa_xung', message: 'Kim Hỏa giao chiến → phổi + tim cùng lúc (hô hấp + huyết áp)', confidence: 68, evidence: ['Kim+Hoa xung'], links: ['health'] } },

  // --- DETAIL: EDUCATION ---
  { id: 'edu_sang_tao', category: ['education','personality'], priority: 73, condition: (f) => f.has_伤官 && (f.has_正印 || f.has_偏印), conclusion: { result: 'hoc_sang_tao', message: 'Thương Quan + Ấn → học sáng tạo, giỏi viết/nghiên cứu, nên học cao', confidence: 70, evidence: ['Thuong+An'], links: ['education','personality'] } },
  { id: 'edu_thuc_ky_nang', category: ['education','career'], priority: 70, condition: (f) => f.has_食神 && !f.has_正官 && !f.has_七杀, conclusion: { result: 'hoc_ky_nang', message: 'Thực Thần không Quan/Sat → học qua kỹ năng/thực hành, không hàn lâm', confidence: 65, evidence: ['Thuc no Quan/Sat'], links: ['education','career'] } },

  // --- DETAIL: PARENTS ---
  { id: 'parents_thuong_nien', category: ['parents'], priority: 70, condition: (f) => f['伤官_positions']?.some(p => p.startsWith('năm')) && !f.has_正印, conclusion: { result: 'khac_cha_me_manh', message: 'Thương Quan năm + không Ấn → khắc cha mẹ mạnh, cần远离/过房', confidence: 65, evidence: ['Thuong at năm no An'], links: ['parents'] } },
  { id: 'parents_tai_nien', category: ['parents'], priority: 68, condition: (f) => (f['正财_positions']||f['偏财_positions']||[]).some(p => p.startsWith('năm')), conclusion: { result: 'cha_co_dieu_kien', message: 'Tài ở năm → cha có điều kiện/nghiệp tổ (tài = cha)', confidence: 62, evidence: ['Tài at năm'], links: ['parents','wealth'] } },

  // --- DETAIL: WEALTH ---
  { id: 'wealth_ty_nhieu_ngheo', category: ['wealth','siblings'], priority: 75, condition: (f) => (f['比肩_count'] + f['劫财_count']) >= 2 && f.isWeak, conclusion: { result: 'ty_nhieu_ngheo', message: 'Tỷ Kiếp nhiều + thân nhược → nghèo, tiền bị chia sẻ/mất', confidence: 70, evidence: ['Tỷ/Kięp >=2 + weak'], links: ['wealth','siblings'] } },
  { id: 'wealth_tai_vuong_giau', category: ['wealth'], priority: 78, condition: (f) => f.isStrong && (f['正财_count'] + f['偏财_count']) >= 2, conclusion: { result: 'than_manh_tai_vuong', message: 'Thân mạnh + Tài vượng → giàu có (thân nhậm tài)', confidence: 75, evidence: ['strong+Tài >=2'], links: ['wealth'] } },

  // --- DETAIL: CHILDREN ---
  { id: 'children_sat_thoi', category: ['children'], priority: 75, condition: (f) => f['七杀_positions']?.some(p => p.startsWith('giờ')), conclusion: { result: 'sat_con_kho', message: 'Thất Sát ở giờ → khó sinh con, con khắc cha mẹ', confidence: 65, evidence: ['Sat at giờ'], links: ['children'] } },
  { id: 'children_thuc_thoi', category: ['children'], priority: 70, condition: (f) => (f['食神_positions']||f['伤官_positions']||[]).some(p => p.startsWith('giờ')), conclusion: { result: 'con_nhieu', message: 'Thực/Thương ở giờ → nhiều con, duyên con tốt', confidence: 65, evidence: ['Thuc/Thuong at giờ'], links: ['children'] } },

  // --- COMPREHENSIVE OVERVIEW ---
  { id: 'overview_than_manh_tot', category: ['overview'], priority: 85, condition: (f) => f.isStrong && f.dayunIsDung && (f.has_正官 || f.has_正财) && f.has_正印, conclusion: { result: 'cuoc_doi_tot', message: 'Thân mạnh + vận Dụng + Quan/Tài/Ấn đủ → cuộc đời ĐANG TỐT (tài+quyền+học)', confidence: 85, evidence: ['strong+dung+Quan/Tai/An'], links: ['overview'] } },
  { id: 'overview_than_nhieu_nguy', category: ['overview'], priority: 88, condition: (f) => f.isWeak && f.dayunIsKy && (f['正财_count'] + f['偏财_count']) >= 2, conclusion: { result: 'cuoc_doi_nguy', message: 'Thân nhược + vận Kỵ + Tài nhiều → cuộc đời ĐANG NGUY (sức khỏe/tài)', confidence: 82, evidence: ['weak+ky+Tài'], links: ['overview'] } },

  // --- DAY MASTER SPECIFIC (10 can) ---
  { id: 'dm_giap', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '甲', conclusion: { result: 'giap_moc', message: 'Giáp Mộc (cây lớn) → thẳng thắn, cương trực, cao, vai rộng, tóc dày', confidence: 68, evidence: ['dm=甲'], links: ['personality','appearance'] } },
  { id: 'dm_at', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '乙', conclusion: { result: 'at_moc', message: 'Ất Mộc (cỏ) → mềm mại, uyển chuyển, duyên dáng, thích ứng', confidence: 68, evidence: ['dm=乙'], links: ['personality','appearance'] } },
  { id: 'dm_binh', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '丙', conclusion: { result: 'binh_hoa', message: 'Bính Hỏa (mặt trời) → rạng rỡ, nhiệt tình, phóng khoáng', confidence: 68, evidence: ['dm=丙'], links: ['personality','appearance'] } },
  { id: 'dm_dinh', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '丁', conclusion: { result: 'dinh_hoa', message: 'Đinh Hỏa (ngọn đèn) → ấm áp, tinh tế, trực giác, sáng tạo', confidence: 68, evidence: ['dm=丁'], links: ['personality','appearance'] } },
  { id: 'dm_mau', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '戊', conclusion: { result: 'mau_tho', message: 'Mậu Thổ (tường thành) → vững chãi, tin cậy, bao dung', confidence: 68, evidence: ['dm=戊'], links: ['personality','appearance'] } },
  { id: 'dm_ky', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '己', conclusion: { result: 'ky_tho', message: 'Kỷ Thổ (đất ruộng) → khiêm tốn, nuôi dưỡng, nhẫn nại', confidence: 68, evidence: ['dm=己'], links: ['personality','appearance'] } },
  { id: 'dm_canh', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '庚', conclusion: { result: 'canh_kim', message: 'Canh Kim (vũ khí) → cương quyết, mạnh mẽ, chính nghĩa', confidence: 68, evidence: ['dm=庚'], links: ['personality','appearance'] } },
  { id: 'dm_tan', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '辛', conclusion: { result: 'tan_kim', message: 'Tân Kim (trang sức) → thanh tú, tinh tế, kiêu hãnh', confidence: 68, evidence: ['dm=辛'], links: ['personality','appearance'] } },
  { id: 'dm_nham', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '壬', conclusion: { result: 'nham_thuy', message: 'Nhâm Thủy (sông lớn) → thông minh, phóng khoáng, quyền lực', confidence: 68, evidence: ['dm=壬'], links: ['personality','appearance'] } },
  { id: 'dm_quy', category: ['personality','appearance'], priority: 72, condition: (f) => f.dayMaster === '癸', conclusion: { result: 'quy_thuy', message: 'Quý Thủy (mưa sương) → uyển chuyển, tế nhị, trực giác', confidence: 68, evidence: ['dm=癸'], links: ['personality','appearance'] } },

  // =========================================================================
  // [gap #4 NẠP DỮ LIỆU VÀO NÃO] — rules dùng facts THẦN SÁT / DỤNG ĐẦY ĐỦ /
  //   CÁCH CỤC CHẤT LƯỢNG / THỜI ĐIỂM VÀNG / NGUỒN LƯU / TỨ TRỤ / LỤC THÂN.
  //   Trước đây não mù các domain này (facts.js không extract) → AI "quên logic".
  // =========================================================================

  // --- THẦN SÁT (神煞) — priority 75-80 ---
  { id: 'ss_tianyi', category: ['career','overview'], priority: 80, condition: (f) => f.has_tianYi, conclusion: { result: 'quy_nhan_tro_giup', message: '天乙贵人 (thiên quý nhân) → gặp dữ hóa lành, sự nghiệp được quý nhân nâng đỡ, dễ thành quan chức/lãnh đạo', confidence: 82, evidence: ['has 天乙贵人'], links: ['career','overview'] } },
  { id: 'ss_huagai', category: ['personality','overview'], priority: 76, condition: (f) => f.has_huaGai, conclusion: { result: 'tam linh_sang_tao', message: '华盖 (hoa cái) → tâm linh/tôn giáo/nghệ thuật, thông minh độc đáo nhưng dễ cô đơn, hợp nghiên cứu/tôn giáo', confidence: 78, evidence: ['has 华盖'], links: ['personality','education'] } },
  { id: 'ss_jiangxing', category: ['career','overview'], priority: 78, condition: (f) => f.has_jiangXing, conclusion: { result: 'quan_su_lanh_dao', message: '将星 (tướng tinh) → khí chất quân sự/quyền lực, quyết đoán, hợp quân đội/công an/quản lý', confidence: 78, evidence: ['has 将星'], links: ['career'] } },
  { id: 'ss_taohua', category: ['marriage','appearance'], priority: 76, condition: (f) => f.has_taoHua || f.has_xianchi || f.has_taoHuaHong, conclusion: { result: 'dao_hoa_nan_sac', message: '桃花 (đào hoa) → nhan sắc/hấp dẫn giới tính, duyên độ, dễ có nhiều cơ hội tình cảm (cần cân nhắc hôn nhân)', confidence: 75, evidence: ['has 桃花'], links: ['marriage','appearance'] } },
  { id: 'ss_yima', category: ['career','wealth'], priority: 74, condition: (f) => f.has_yiMa, conclusion: { result: 'di_chuyen_xa_que', message: '驿马 (dịch mã) → đời sống di chuyển/xa quê/phát đạt nhờ đi lại, hợp kinh doanh xứ người/xuất khẩu/logistic', confidence: 72, evidence: ['has 驿马'], links: ['career','wealth'] } },
  { id: 'ss_jinyu', category: ['wealth','overview'], priority: 76, condition: (f) => f.has_jinYu, conclusion: { result: 'xe_sang_phu_quy', message: '金舆 (kim dư) → xe cộ sang/tài lộc vượng, phú quý, được người phục vụ', confidence: 75, evidence: ['has 金舆'], links: ['wealth'] } },
  { id: 'ss_tiande', category: ['overview','health'], priority: 74, condition: (f) => f.has_tianDe || f.has_yueDe, conclusion: { result: 'phuc_duc_hoa_giai', message: '天/月 đức → phúc đức tổ tiên, hóa giải hung họa, gặp nạn được cứu', confidence: 73, evidence: ['has 天德/月德'], links: ['overview','health'] } },
  { id: 'ss_wenchang', category: ['education','career'], priority: 78, condition: (f) => f.has_wenChang, conclusion: { result: 'hoc_van_tai_hoa', message: '文昌 (văn xương) → tài văn chương/học vấn, hợp viết/nghiên cứu/giáo dục', confidence: 76, evidence: ['has 文昌'], links: ['education','career'] } },

  // --- KHÔNG VƯƠNG (空亡) ---
  { id: 'ss_kongwang', category: ['overview','timing'], priority: 70, condition: (f) => f.hasKongwang && f.kongwangAffectedCount > 0, conclusion: { result: 'khong_vuong_treo', message: '空亡 (không vương) ảnh hưởng trụ → lĩnh vực tương ứng bị "treo"/hư, cầu danh khó đạt, cần điền thực', confidence: 68, evidence: ['has 空亡 affecting pillar'], links: ['overview'] } },

  // --- CHẤT LƯỢNG CÁCH CỤC (成/败 + cứu ứng) — priority 85-90 ---
  { id: 'pq_cheng', category: ['overview','career'], priority: 88, condition: (f) => f.patternCheng, conclusion: { result: 'cach_cuc_thuan', message: '成格 (cách cục THÀNH) → mệnh thuận, tướng thần vững, cấu trúc tốt → dễ thành tựu trong lĩnh vực cách cục', confidence: 85, evidence: ['quality=成格'], links: ['overview','career'] } },
  { id: 'pq_bai', category: ['overview'], priority: 85, condition: (f) => f.patternBai && !f.patternRescued, conclusion: { result: 'cach_cuc_vo', message: '败格 (cách cục VỠ, không cứu) → mệnh nghịch, cơ hội khó giữ, cần nỗ lực gấp đôi + dùng Dụng Thần bù', confidence: 80, evidence: ['quality=败格, no rescue'], links: ['overview'] } },
  { id: 'pq_bai_rescued', category: ['overview'], priority: 86, condition: (f) => f.patternBai && f.patternRescued, conclusion: { result: 'cach_cuc_vo_co_cuu', message: '败格 nhưng CÓ cứu ứng (病药) → vỡ nhưng được行 (tướng thần/rescue) bù → nguy rồi an, cần bám cứu ứng để hồi phục', confidence: 82, evidence: ['quality=败格, has rescues'], links: ['overview','health'] } },
  { id: 'pq_keystar_rooted', category: ['career','overview'], priority: 80, condition: (f) => f.patternKeyStarGod && f.patternKeyStarRooted, conclusion: { result: 'tuong_than_co_can', message: 'Tướng thần CÓ căn (rooted) → sức mạnh cách cục vững, lĩnh vực tương ứng sao đó dễ thành tựu', confidence: 78, evidence: ['keyStar rooted'], links: ['career'] } },

  // --- THỜI ĐIỂM VÀNG (lưu niên Cát) — timing ---
  { id: 'tm_golden_soon', category: ['timing','overview'], priority: 82, condition: (f) => f.hasGoldenYearSoon, conclusion: { result: 'nam_vang_sap_toi', message: 'Sắp tới NĂM VÀNG (lưu niên Cát) → cơ hội lớn, nên hành sự/khởi nghiệp/ký hợp đồng đúng窗口 này', confidence: 80, evidence: ['golden year upcoming'], links: ['timing','wealth','career'] } },
  { id: 'tm_hung_soon', category: ['timing','health'], priority: 78, condition: (f) => f.hasHungYearSoon, conclusion: { result: 'can_tham_nam_xau', message: 'Có năm HUNG sắp tới trong khung 10 năm → cẩn thận sức khỏe/tài chính, tránh hành sự lớn năm đó', confidence: 72, evidence: ['hung year upcoming'], links: ['timing','health'] } },
  { id: 'tm_no_golden', category: ['timing'], priority: 68, condition: (f) => f.goldenYearCount === 0, conclusion: { result: 'chua_co_nam_vang', message: 'Chưa có lưu niên Cát trong khung 10 năm → cần chủ động tạo cơ hội, đừng thụ động chờ vận', confidence: 66, evidence: ['goldenYearCount=0'], links: ['timing'] } },

  // --- NGUỒN LƯU (源流 — dòng ngũ hành) ---
  { id: 'yl_aspect_wealth', category: ['wealth','overview'], priority: 75, condition: (f) => f.yuanliuAspect === 'Tài', conclusion: { result: 'dong_chay_huong_tai', message: '源流 (dòng ngũ hành) đổ về TÀI → trọng tâm tự nhiên của mệnh là tiền bạc/kinh doanh (năng lượng đời chảy về đó)', confidence: 72, evidence: ['yuanliu aspect=Tài'], links: ['wealth','overview'] } },
  { id: 'yl_aspect_power', category: ['career','overview'], priority: 75, condition: (f) => f.yuanliuAspect === 'Quan/Sát', conclusion: { result: 'dong_chay_huong_quyen', message: '源流 đổ về QUAN/SÁT → trọng tâm mệnh là sự nghiệp/quyền lực/chức vụ', confidence: 72, evidence: ['yuanliu aspect=Quan/Sát'], links: ['career','overview'] } },
  { id: 'yl_gap', category: ['health','overview'], priority: 76, condition: (f) => !!f.yuanliuGap, conclusion: { result: 'menh_co_benh_thong_quan', message: '源流 có ĐỨT ĐOẠN (ngũ hành không liền mạch) → mệnh có "bệnh", cần hành "thông quan" (nối ngũ hành đứt) để giải', confidence: 72, evidence: ['yuanliu has gap'], links: ['health','overview'] } },

  // --- TỨ TRỤ tổn thương (盖头/截脚) ---
  { id: 'pl_jiejiao', category: ['health','overview'], priority: 72, condition: (f) => f.hasJiejiao && f.damagedPillarCount >= 2, conclusion: { result: 'noi_bo_mau_thuan', message: 'Nhiều trụ 截脚 (chi khắc can) → nội bộ mâu thuẫn, ý-trí đánh nhau, cần rèn kỷ luật nội tâm', confidence: 68, evidence: ['has 截脚, multiple damaged pillars'], links: ['health','personality'] } },

  // --- DỤNG THẦN ĐẦY ĐỦ (用喜忌仇) — tương tác với vận ---
  { id: 'yg_xi_dung', category: ['timing','overview'], priority: 84, condition: (f) => f.yong_xi && f.dayunIsDung && f.yong_xi === f.currentDayunGanWx, conclusion: { result: 'van_hy_than_toi', message: 'Đại vận mang HY THẦN (hành sinh Dụng) tới → vận RẤT THUẬN, Dụng thêm vững, là窗口 vàng để phát triển', confidence: 82, evidence: ['yong_xi == dayun gan wx'], links: ['timing','overview'] } },
  { id: 'yg_ji_dung', category: ['timing','health'], priority: 80, condition: (f) => f.yong_ji && (f.currentDayunGanWx === f.yong_ji || f.currentDayunZhiWx === f.yong_ji), conclusion: { result: 'van_ky_than_toi', message: 'Đại vận mang KỴ THẦN tới → vận KHẮC, cẩn thận lĩnh vực Kỵ khắc, giữ thấp rủi ro', confidence: 76, evidence: ['yong_ji in dayun'], links: ['timing','health'] } },

  // --- LỤC THÂN (六亲) — quan hệ gia đình thiếu sao ---
  { id: 'lq_missing_many', category: ['overview','marriage'], priority: 72, condition: (f) => f.liuqinMissingCount >= 2, conclusion: { result: 'duyen_gia_dinh_mong', message: 'Nhiều lục thân THIẾU sao chủ → duyên gia đình mỏng, quan hệ đó cần nỗ lực vun đắp', confidence: 68, evidence: ['liuqin missing >= 2 stars'], links: ['overview','marriage','parents'] } },

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
// [Phase 2 / gap #5] Ngưỡng confidence tối thiểu cho output tới AI.
//   Rules <65% thêm noise (đoán,mạnh thừa), không thêm signal → drop trước khi gửi AI.
const MIN_CONFIDENCE = 65;

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

  // [Phase 2 / gap #5] Drop low-confidence noise BEFORE dedup/slice
  //   (đảm bảo top-8 luôn là rules chất lượng cao nhất, không bị chiếm chỗ bởi rules yếu)
  relevant = relevant.filter(c => (c.confidence || 0) >= MIN_CONFIDENCE);

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
    if (!facts.dayMaster) return null; // invalid chart → graceful null
    const conclusions = evaluateRules(facts);
    const category = classifyQuestion(question);
    const output = buildOutput(conclusions, facts, category);
    return output;
  } catch (e) {
    // Graceful fallback: brain crash → return null → caller skips
    return null;
  }
}
