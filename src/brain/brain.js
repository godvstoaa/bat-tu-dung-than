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
  { id: 'nhat_zhi_xung', category: ['marriage','health'], priority: 75, condition: (f) => { try { const dc = f.dayMaster ? '' : ''; return false; } catch(_) { return false; } }, conclusion: { result: 'noop', message: '', confidence: 0, evidence: [], links: [] } },

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
