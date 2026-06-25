// ============================================================================
//  HỢP TÁC KINH DOANH 合夥匹配 — BUSINESS PARTNER MATCHING
//  Khác hehun.js (tình duyên): đánh giá hợp tác KINH DOANH giữa 2 người.
//  Bổ sung: vai trò bổ sung (Quan-Tài-Sát), rủi ro tương thích, phân vai.
//  Nguồn: 渊海子平 合夥篇, 滴天髓 合作论.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';

const ROLE_MAP = {
  CEO: { gods: ['七殺', '正官', '比肩'], desc: 'lãnh đạo, quyết đoán, quản lý' },
  CFO: { gods: ['正財', '偏財'], desc: 'tài chính, dòng tiền, kiểm soát' },
  CTO: { gods: ['偏印', '食神', '傷官'], desc: 'kỹ thuật, sáng tạo, sản phẩm' },
  COO: { gods: ['正印', '正官'], desc: 'vận hành, quy trình, ổn định' },
  CMO: { gods: ['傷官', '偏財', '食神'], desc: 'marketing, bán hàng, giao tế' },
  HR: { gods: ['正印', '比肩'], desc: 'nhân sự, tuyển dụng, đào tạo' },
};

/**
 * Đánh giá hợp tác kinh doanh giữa 2 lá số.
 * @param R1, R2 - kết quả analyze() của 2 người
 * @returns {{ score, rating, roleFit, wxComplement, riskCompat, conflicts, advice }}
 */
export function matchBusinessPartners(R1, R2) {
  const a = R1.chart, b = R2.chart;
  let score = 50;
  const details = [];

  // 1. Ngũ hành bổ sung (A cần X, B có X mạnh)
  const aNeed = R1.yong.primary;
  const bNeed = R2.yong.primary;
  const bHasAneed = (R2.wx.score[aNeed] || 0) / (R2.wx.total || 1);
  const aHasBneed = (R1.wx.score[bNeed] || 0) / (R1.wx.total || 1);
  if (bHasAneed > 0.18 && aHasBneed > 0.18) { score += 18; details.push('✓ Ngũ hành tương bổ mạnh: mỗi người vượng hành Dụng của đối phương.'); }
  else if (bHasAneed > 0.18 || aHasBneed > 0.18) { score += 8; details.push('• Bổ một chiều五行.'); }
  else { score -= 6; details.push('✗ Ngũ hành ít bổ sung nhau.'); }

  // 2. Dụng Thần không tổn thương nhau
  const aHurtB = R1.yong.avoid.includes(bNeed);
  const bHurtA = R2.yong.avoid.includes(aNeed);
  if (aHurtB || bHurtA) { score -= 12; details.push('⚠ Một bên kỵ đúng Dụng Thần của bên kia — xung đột lợi ích.'); }
  else { score += 6; details.push('✓ Dụng Thần không tổn thương nhau.'); }

  // 3. Vai trò bổ sung (mỗi người mạnh sao khác nhau)
  const aGods = {};
  for (const k of ['year','month','time']) { const g = a.pillars[k].ganGod; if (g && g !== '日主') aGods[g] = (aGods[g]||0)+1; }
  const bGods = {};
  for (const k of ['year','month','time']) { const g = b.pillars[k].ganGod; if (g && g !== '日主') bGods[g] = (bGods[g]||0)+1; }

  // Top sao mỗi người
  const aTop = Object.entries(aGods).sort((x,y)=>y[1]-x[1])[0]?.[0] || '正官';
  const bTop = Object.entries(bGods).sort((x,y)=>y[1]-x[1])[0]?.[0] || '正印';
  const aTopVi = TEN_GOD_VI[aTop] || aTop;
  const bTopVi = TEN_GOD_VI[bTop] || bTop;

  // Vai trò đề xuất
  const aRole = suggestRole(aTop);
  const bRole = suggestRole(bTop);
  const roleComplement = aRole.role !== bRole.role;
  if (roleComplement) { score += 12; details.push(`✓ Vai trò bổ sung: A=${aRole.role} (${aRole.desc}), B=${bRole.role} (${bRole.desc}).`); }
  else { score -= 5; details.push(`⚠ Cả hai thiên về ${aRole.role} → cần người thứ ba bổ sung.`); }

  // 4. Rủi ro: Ai có Kiếp Tài nhiều → dễ hao
  const aJiecai = (aGods['劫財']||0) + (aGods['比肩']||0);
  const bJiecai = (bGods['劫財']||0) + (bGods['比肩']||0);
  if (aJiecai >= 2 && bJiecai >= 2) { score -= 10; details.push('⚠ Cả hai đều có Tỷ Kiếp nhiều → dễ tranh giành quyền lợi/quyết định.'); }
  else if (aJiecai >= 2 || bJiecai >= 2) { score -= 4; details.push('Một bên Tỷ Kiếp nhiều → cần hợp đồng rõ ràng.'); }

  // 5. Thân vượng/nhược tương hợp
  if (R1.strength.strong && R2.strength.strong) { score += 5; details.push('✓ Cả hai thân vượng → đủ sức gánh việc lớn.'); }
  else if (!R1.strength.strong && !R2.strength.strong) { score -= 8; details.push('⚠ Cả hai thân nhược → thiếu sức thực thi.'); }
  else { score += 8; details.push('✓ Một vượng một nhược → bổ sung sức.'); }

  // 6. Ngày chi hợp/xung giữa 2 người
  const aDayZhi = a.pillars.day.zhi;
  const bDayZhi = b.pillars.day.zhi;
  const LH = ['子丑','寅亥','卯戌','辰酉','巳申','午未'];
  const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
  if (LH.some(p => p === aDayZhi+bDayZhi || p === bDayZhi+aDayZhi)) { score += 6; details.push('✓ Nhật Chi lục hợp → tính cách hợp nhau.'); }
  else if (CHONG[aDayZhi] === bDayZhi) { score -= 6; details.push('⚠ Nhật Chi lục xung → dễ bất đồng quan điểm.'); }

  score = Math.max(10, Math.min(98, Math.round(score)));
  let rating = score >= 75 ? 'Đại hợp tác' : score >= 58 ? 'Hợp tác tốt' : score >= 42 ? 'Trung' : 'Khó hợp tác';

  const advice = score >= 58
    ? `Hợp tác TỐT (score ${score}). A thiên ${aRole.role}, B thiên ${bRole.role}. Nên phân vai rõ: A phụ trách ${aRole.desc}, B phụ trách ${bRole.desc}. Hợp đồng rõ ràng.`
    : score >= 42
      ? `Hợp tác TRUNG (score ${score}). Có thể hợp tác nhưng cần hợp đồng chặt, phân vai rõ, kiểm soát dòng tiền.`
      : `Hợp tác KHÓ (score ${score}). Nên cân nhắc: một bên làm chủ, một bên làm thuê; hoặc chọn người khác.`;

  // [loop 173 fix] roleFit — tóm tắt phân vai BỔ SUNG. Trước đây KHÔNG trả field này
  //   → renderPartnerMatch (UI) và analyze_partner tool (AI) đều đọc m.roleFit nhưng luôn
  //   undefined → dòng «🤝 role fit» không hiện, AI trả roleFit rỗng.
  const roleFit = roleComplement
    ? `Vai trò BỔ SUNG nhau: A thiên ${aRole.role} (${aRole.desc}); B thiên ${bRole.role} (${bRole.desc}) → ít chồng chéo, phối hợp tốt.`
    : `Cả hai cùng thiên ${aRole.role} (${aRole.desc}) → vai trò chồng chéo, nên mời người thứ ba bổ sung (${_complementRole(aRole.role)}).`;

  return { score, rating, details, roleFit, aRole, bRole, roleComplement,
    aTop: aTopVi, bTop: bTopVi, aNeed, bNeed, advice };
}

// [loop 173] gợi ý vai VỚAI bổ sung khi 2 người trùng vai
function _complementRole(role) {
  const pairs = { CEO: 'CFO/CTO', CFO: 'CEO/COO', CTO: 'CMO/CEO', COO: 'CMO/CTO', CMO: 'CFO/COO', HR: 'CEO/CFO', Advisor: 'CEO' };
  return pairs[role] || 'CEO';
}

function suggestRole(topGod) {
  for (const [role, info] of Object.entries(ROLE_MAP)) {
    if (info.gods.includes(topGod)) return { role, desc: info.desc };
  }
  return { role: 'Advisor', desc: 'tham vấn, cố vấn, hỗ trợ' };
}

export { ROLE_MAP };
