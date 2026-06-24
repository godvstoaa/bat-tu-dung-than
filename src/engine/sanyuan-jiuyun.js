// ============================================================================
//  三元九运 — TAM NGUYÊN CỬU VẬN (macro 20-năm phong thuỷ 玄空)
//  "20 năm tới vận gì? Hướng/NN nào mệnh? Nhịp đổi運 thế nào?" — khung vĩ mô.
//  Khác xuankong.js (phi tinh LƯU NIÊN năm-năm): module này = VẬN 20 NĂM
//    (下元九运 2024-2043 九紫离火) + 正神方/零神方 + NN mệnh + ai hưởng.
//  Cơ chế: 180 năm = 3 nguyên × 3 vận × 20 năm. Đương vận = Cửu Tử 离 Hỏa (2024-43).
//    * 正神方 (đương vận tinh bổn cung): 宜山/cao/thực.
//    * 零神方 (đối 正神): 宜水/thấp/hư, kiến thuỷ vượng tài.
//  Nguồn: 三元九运 百度百科, 九运旺行业 (知乎), 九紫离火运指南, 玄空正零神法.
// ============================================================================
import { WX_VI } from './constants.js';

// 9 vận — bản cung (hậu thiên bát quái) + hành + phương
const YUN = [
  { num: 1, star: '一白', starVi: 'Nhất Bạch Tham Lang', trig: 'Khảm 坎', wx: '水', wxVi: 'Thủy', dir: 'Bắc', opp: 'Nam', yuan: 'thượng nguyên', tone: 'giao thông, thông tin, hải vận, tài chính lưu thông, trí tuệ, du lịch' },
  { num: 2, star: '二黑', starVi: 'Nhị Hắc Cự Môn', trig: 'Khôn 坤', wx: '土', wxVi: 'Thổ', dir: 'Tây Nam', opp: 'Đông Bắc', yuan: 'thượng nguyên', tone: 'bất động sản, nông nghiệp, mẫu tính, dân sinh, khoáng sản' },
  { num: 3, star: '三碧', starVi: 'Tam Bích Lộc Tồn', trig: 'Chấn 震', wx: '木', wxVi: 'Mộc', dir: 'Đông', opp: 'Tây', yuan: 'thượng nguyên', tone: 'giáo dục, thanh niên, khởi nghiệp, vận động, nông lâm' },
  { num: 4, star: '四绿', starVi: 'Tứ Lục Văn Khúc', trig: 'Tốn 巽', wx: '木', wxVi: 'Mộc', dir: 'Đông Nam', opp: 'Tây Bắc', yuan: 'trung nguyên', tone: 'văn hóa, học thuật, xuất bản, phong cảnh, thư pháp, mậu dịch' },
  { num: 5, star: '五黄', starVi: 'Ngũ Hoàng Liêm Trinh', trig: 'Trung cung 中', wx: '土', wxVi: 'Thổ', dir: 'Trung cung', opp: '(đặc biệt)', yuan: 'trung nguyên', tone: 'đại địa, bệnh tật, biến động lớn, trung tâm quyền lực' },
  { num: 6, star: '六白', starVi: 'Lục Bạch Vũ Khúc', trig: 'Càn 乾', wx: '金', wxVi: 'Kim', dir: 'Tây Bắc', opp: 'Đông Nam', yuan: 'trung nguyên', tone: 'tài chính, ngân hàng, quân sự, lãnh đạo, cơ khí, pháp luật' },
  { num: 7, star: '七赤', starVi: 'Thất Xích Phá Quân', trig: 'Đoài 兑', wx: '金', wxVi: 'Kim', dir: 'Tây', opp: 'Đông', yuan: 'hạ nguyên', tone: 'giải trí, khẩu tài, giao tiếp, ngôn luận, sắc đẹp, mồm miệng' },
  { num: 8, star: '八白', starVi: 'Bát Bạch Tả Phụ', trig: 'Cấn 艮', wx: '土', wxVi: 'Thổ', dir: 'Đông Bắc', opp: 'Tây Nam', yuan: 'hạ nguyên', tone: 'BĐS, xây dựng, thiếu niên, tài sản tích luỹ, tĩnh' },
  { num: 9, star: '九紫', starVi: 'Cửu Tử Hữu Bật', trig: 'Ly 离', wx: '火', wxVi: 'Hỏa', dir: 'Nam', opp: 'Bắc', yuan: 'hạ nguyên', tone: 'AI/công nghệ, năng lượng mới, văn hóa-truyền thông, y tế (mắt/tim/thẩm mỹ), làm đẹp, F&B, tâm lý/huyền học, ảo/kỹ thuật số' },
];

// Chi tiết Cửu vận (đương vận 2024-2043) — sâu hơn
const YUN9_DETAIL = {
  industriesWang: ['AI/chíp/robot/LLM', 'năng lượng mới (quang điện/lưu trữ/xe điện/hydro)', 'văn hóa-truyền thông (phim/short video/livestream/IP)', 'kinh tế số (E-commerce/metaverse/Web3/cloud)', 'y tế (đông y/mắt/tim/thẩm mỹ)', 'giáo dục - trả phí kiến thức', 'F&B (lẩu/nướng/nhanh)', 'mỹ nghiệp - thời trang', 'tâm lý - huyền học văn hoá'],
  industriesSuy: ['BĐS truyền thống (bát vận cấn thổ đã thoái)', 'sản xuất nặng - xây dựng dân dụng'],
  layout: [
    '正神方 = NAM: sáng - sạch - cao - thực (núi/toà cao), KHÔNG nên見 thuỷ (thấy nước = "hạ thuỷ" thoái tài).',
    '零神方 = BẮC: thấy thuỷ - thấp - hư - động (bể cá/thác nước/không gian mở) → thúc tài.',
    'Cục lý tưởng: "NAM SƠN BẮC THUỶ" (坐南朝北, nam tựa núi/toà cao, bắc có nước).',
    'Gia tăng hoả khí: trang trí đỏ/tím, đèn, nến ở phương Nam.',
    'Trung cung: tránh Ngũ Hoàng lưu niên phi tinh (năm 五入 trung).',
  ],
  people: [
    'Dụng Thần = HOẢ → ĐẠI VƯỢNG, sự nghiệp thuận.',
    'Hỏa vượng bẩm sinh → năng lượng mạnh.',
    'Nữ mệnh → Cửu Tử trợ nữ tính, sự nghiệp - tình duyên chuyển mình.',
    'Thuỷ nhiều - Hoả yếu → CHÚ Ý cảm xúc & sức khoẻ (mắt/tim).',
  ],
  health: 'Ly chủ MẮT & TIM: cận thị/mỏi mắt (màn hình), tim mạch/huyết áp, thần kinh/mất ngủ; hoả khắc kim → phổi/hô hấp cũng cần chú ý.',
  society: 'Ly = quang minh/văn minh/tâm linh/ảo: kinh tế ảo & không gian mạng lên; nhưng ly cũng = chiến tranh/hoả dược/xung đột — cục bộ căng thẳng.',
};

/**
 * Vận của 1 năm dương lịch.
 * [TODO loop sau] Biên chuyển vận cổ pháp rơi vào LẬP XUÂN (~4/2) của năm biên, KHÔNG phải
 *   1/1 dương lịch. Vd 2024-02-04 mới vào Cửu vận; 2024-01-01..02-03 vẫn Bát vận. Hiện hàm
 *   gán cả năm dương lịch cho 1 vận — sai tối đa ~34 ngày ở các năm biên (2004/2024/2044…).
 *   2026 không nằm ở năm biên nên KHÔNG ảnh hưởng. Khi cần chính xác theo ngày sinh, đổi
 *   `year` → Date và trừ 1 năm trong cửa sổ 1/1..lập xuẩn-3.
 */
export function currentYun(year) {
  // 180-năm = 1 chính nguyên (9 vận × 20). Vòng mod 9 để năm 2044 (=1864+180) mở nguyên mới → Nhất vận.
  const num = (((Math.floor((year - 1864) / 20) % 9) + 9) % 9) + 1;
  const y = YUN[num - 1];
  // gốc của chính nguyên chứa năm này:
  const yuanStart = year - ((year - 1864) % 180 + 180) % 180;
  const start = yuanStart + (num - 1) * 20;
  const end = start + 19;
  return { num, start, end, ...y, isPeriod9: num === 9 };
}

/**
 * Phân tích tam nguyên cửu vận + liên kết Dụng Thần cá nhân.
 * @param {object} R — analyze()
 * @param {number} scanYear
 */
export function sanyuanJiuyun(R, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const yun = currentYun(curYear);
  const dungWx = R.yong?.primary;
  const dungVi = dungWx ? WX_VI[dungWx] : '?';

  // Cá nhân hoá: Dụng Thần có trùng/khắc/sinh với hành vận không?
  const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }; // a sinh b
  const yunSinhDung = dungWx && SHENG[yun.wx] === dungWx;
  let align;
  if (yun.num === 5) align = 'trung vận (Ngũ Hoàng) — biến động chung, không thiên rõ 1 hành, cần giữ稳固.';
  else if (dungWx === yun.wx) align = `✓ ĐẠI HỢP: Dụng ${dungVi} = hành vận ${yun.wxVi} → vận 20 năm này rất thuận bạn, nên nắm bắt (${yun.num === 9 ? YUN9_DETAIL.industriesWang.slice(0, 3).join(', ') : yun.tone}).`;
  else if (yunSinhDung) align = `Khá thuận: vận ${yun.wxVi} SINH Dụng ${dungVi} → khí vận nuôi dưỡng Dụng của bạn, nên tận dụng nhịp chung mà vẫn bổ Dụng.`;
  else align = `Dụng ${dungVi} ≠ hành vận ${yun.wxVi} (không sinh/khắc trực tiếp) → đừng chạy theo trào lưu vận; bù Dụng qua phương/màu/NN cá nhân là chính.`;

  const detail = yun.num === 9 ? YUN9_DETAIL : null;
  const zhengShen = `${yun.dir} (正神 — ${yun.num===9?'宜 sơn/cao/thực':'tương tự'})`;
  const lingShen = `${yun.opp} (零神 — ${yun.num===9?'宜 thuỷ/thấp/hư':'tương tự'})`;

  let summary = `${curYear} thuộc ${yun.starVi} · ${yun.trig} · ${yun.wxVi} (${yun.yuan}, ${yun.start}-${yun.end}). Phương cát: 正神=${yun.dir} (nên sơn/cao/thực) · 零神=${yun.opp} (nên thuỷ/thấp/hư). NN mệnh: ${yun.tone}. ${align}`;
  if (detail) {
    summary += ` Cửu vận chi tiết — 旺: ${detail.industriesWang.slice(0, 4).join(', ')}; suy: ${detail.industriesSuy.join(', ')}; Sức khoẻ: ${detail.health}.`;
  }

  return { year: curYear, yun, zhengShen, lingShen, align, detail, summary };
}

export { YUN, YUN9_DETAIL };
