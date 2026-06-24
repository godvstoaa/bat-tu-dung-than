// ============================================================================
//  主导十神 — THẬP THẦN CHỦ ĐẠO (thần chi phối lá số → tính cách/sự nghiệp/số mệnh)
//  "Tôi thuộc tuýp nào? Nghề gì hợp? Động lực cốt lõi là gì?" — đọc theo thần chiếm ưu.
//  * Đếm + weighted 10 thập thần trên THIÊN CAN (3 can phi nhật) + TÀNG CAN,
//    thưởng 月令 → tìm thần chủ đạo (dominant) + phụ (sub-dominant).
//  * Mỗi thập thần = 1 tuýp người + khuynh hướng nghề + động lực:
//    比肩(độc lập) | 劫财(cạnh tranh) | 食神(nghệ thuật/phúc) | 傷官(phản kháng/tài) |
//    正財(ổn định/cần) | 偏財(kinh doanh/giao tế) | 正官(quy trình/quản lý) |
//    七殺(quyền uy/áp lực) | 正印(học vấn/bao dưỡng) | 偏印(độc đáo/huyền học).
//  * Liên kết DỤNG THẦN: thần chủ đạo có phải Dụng/Hỷ (thuận) hay Kỵ/Thù (nghịch) →
//    đời thuận nếu thần chủ = Dụng; vất vả nếu = Kỵ.
//  Khác personality-profile (theo nhật can): module này = thập thần CHỦ ĐẠO (toàn cục).
//  Nguồn: 渊海子平 十神篇, 滴天髓 十神取用, 子平真诠 用神变化.
// ============================================================================
import { TEN_GOD_VI } from './constants.js';

const GOD_CAT = {
  // thập thần → nhóm (5 element category) để tra Dụng (dùng chữ truyền thống khớp chart)
  正印: 'yin', 偏印: 'yin', 比肩: 'bi', 劫財: 'bi',
  食神: 'shi', 傷官: 'shi', 正財: 'cai', 偏財: 'cai', 正官: 'guan', 七殺: 'guan',
};
const CAT_WX_KEY = { yin: 'resourceWx', bi: 'sameWx', shi: 'outputWx', cai: 'wealthWx', guan: 'officerWx' };

const TENDENCY = {
  比肩: { traits: 'độc lập, tự lực, quyết đoán, bình đẳng, hợp tác ngang hàng; cứng đầu', career: 'kinh doanh tự do, đối tác, chuyên gia kỹ thuật, thể thao, sáng lập', drive: 'tự do & độc lập' },
  劫財: { traits: 'cạnh tranh, dũng cảm, hào sảng, dễ xung động, hao tiền', career: 'sales, đầu tư, môi giới, kinh doanh nhạy bén (cẩn thận tài chính)', drive: 'thắng & lợi ích' },
  食神: { traits: 'ôn hoà, nghệ thuật, phúc đức, hưởng thụ, khẩu tài tốt, dễ dãi', career: 'ẩm thực, nghệ thuật, giáo dục, sáng tạo, dịch vụ, chăm sóc', drive: 'thú vui & sáng tạo' },
  傷官: { traits: 'phản kháng, tài ba, miệng lưỡi sắc, phá quy củ, thông minh kiêu ngạo', career: 'nghệ thuật, kỹ thuật, luật, truyền thông, thuyết trình, sáng tạo đột phá', drive: 'biểu đạt & bứt phá' },
  正財: { traits: 'cần kiệm, ổn định, thực tế, tiết độ, đáng tin, thủ cựu', career: 'kế toán, tài chính, ngân hàng, công việc ổn định, quản lý gia đình', drive: 'an toàn & tích luỹ' },
  偏財: { traits: 'giao tế, hào phóng, tài lớn, đa duyên, linh hoạt, đầu cơ', career: 'doanh nhân, kinh doanh, đầu tư, giao thương, giải trí', drive: 'tài lớn & giao thương' },
  正官: { traits: 'quy củ, trách nhiệm, ổn trọng, danh dự, tự luật, sợ sai', career: 'quan chức, quản lý, hành chính, pháp luật, thể chế', drive: 'danh dự & thứ bậc' },
  七殺: { traits: 'quyền uy, quyết đoán, áp lực, dũng cảm, mưu lược, uy nghiêm', career: 'quân sự/cảnh sát, lãnh đạo doanh nghiệp, khởi nghiệp việc lớn, quản trị khủng hoảng', drive: 'quyền lực & chinh phục' },
  正印: { traits: 'học vấn, bao dưỡng, nhân từ, chiều chuộng, trí tuệ, hơi thụ động', career: 'giáo dục, văn phòng, y tế, hỗ trợ, nghiên cứu, cố vấn', drive: 'tri thức & an toàn' },
  偏印: { traits: 'độc đáo, huyền học, suy nghĩ nhiều, nhạy cảm, lập dị, trừu tượng', career: 'nghiên cứu, tôn giáo/huyền học, kỹ thuật đặc thù, nghệ thuật phi truyền thống', drive: 'hiểu biết sâu & khác biệt' },
};

/**
 * @returns {{ scores, ranked, dominant, subDominant, catWx, favor, favorVi, tendency, summary }}
 */
export function dominantGod(R) {
  const scores = {};
  const pillars = R.chart.pillars;
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    const posW = k === 'month' ? 1.3 : 1; // 月令 thưởng
    if (p.ganGod && p.ganGod !== '日主') scores[p.ganGod] = (scores[p.ganGod] || 0) + 2 * posW; // thiên can thấu = 2
    (p.hidden || []).forEach((h, idx) => {
      if (!h.god || h.god === '日主') return;
      const n = p.hidden.length;
      const w = (n === 1 ? 1.5 : idx === 0 ? 1.5 : idx === n - 1 ? 0.5 : 1) * posW; // 本/中/余
      scores[h.god] = (scores[h.god] || 0) + w;
    });
  }
  const ranked = Object.entries(scores).map(([g, s]) => ({ god: g, godVi: TEN_GOD_VI[g] || g, score: +s.toFixed(2) })).sort((a, b) => b.score - a.score);
  const dominant = ranked[0];
  const subDominant = ranked[1];

  // element của nhóm dominant → Dụng quan hệ
  const cat = dominant ? GOD_CAT[dominant.god] : null;
  const catWx = cat && R.yong?.relations ? R.yong.relations[CAT_WX_KEY[cat]] : null;
  const dung = new Set([R.yong?.primary, R.yong?.xi].filter(Boolean));
  const jiSet = new Set([R.yong?.ji, R.yong?.chou].filter(Boolean));
  let favor, favorVi;
  if (catWx && dung.has(catWx)) { favor = 'dung'; favorVi = `thuận — thần chủ (${TEN_GOD_VI[dominant.god]}, hành ${catWx}) = DỤNG/HỶ → động lực cốt lõi HỖ TRỢ mệnh, đời đi đúng hướng tuýp mình.`; }
  else if (catWx && jiSet.has(catWx)) { favor = 'ji'; favorVi = `nghịch — thần chủ (${TEN_GOD_VI[dominant.god]}, hành ${catWx}) = KỴ/THÙ → khuynh hướng tự nhiên lại TRÁI Dụng, cần khắc phục (bù Dụng, tránh cực đoan theo tuýp).`; }
  else if (dominant) { favor = 'neutral'; favorVi = `trung — thần chủ (${TEN_GOD_VI[dominant.god]}) trung tính với Dụng.`; }
  else { favor = 'neutral'; favorVi = ''; }

  const tend = dominant ? TENDENCY[dominant.god] : null;
  const summary = dominant
    ? `Thần CHỦ ĐẠO: ${dominant.godVi} (điểm ${dominant.score})${subDominant ? `, phụ ${subDominant.godVi} (${subDominant.score})` : ''}. Tuýp: ${tend.traits}. Nghề hợp: ${tend.career}. Động lực: ${tend.drive}. ${favorVi}`
    : '(không tính được thập thần chủ đạo)';

  return { scores, ranked, dominant, subDominant, catWx, favor, favorVi, tendency: tend, summary };
}

export { GOD_CAT, TENDENCY };
