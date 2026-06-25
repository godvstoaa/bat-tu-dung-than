// ============================================================================
//  TỔ HỢP THẬP THẦN (十神组合) — phát hiện các cấu hình cát/hung kinh điển
//  Nguồn: 子平真詮, 滴天髓 — các tổ hợp quyết định lớn đến đẳng cấp & cát hung.
//  Mỗi tổ hợp: điều kiện (sự hiện diện của các Thập Thần) + nghĩa + cát/hung.
// ============================================================================
import { TEN_GOD_VI } from './constants.js';

// Đếm điểm Thập Thần. [cycle 55] can năm/tháng/giờ = 1; TÀNG CAN (cả 本/中/余 khí của 4 trụ) =
//   [0.5, 0.3, 0.1]. Trước đây chỉ đếm 本气 (hidden[0]) → bỏ sót 十神 chỉ có ở 中气/余气 →
//   tổ hợp (vd 食神制杀) KHÔNG phát hiện dù đủ điều kiện. Cổ pháp 十神组合 tính cả tàng can.
function godCount(chart) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  const W = [0.5, 0.3, 0.1]; // 本/中/余 khí trọng số
  for (const key of ['year', 'month', 'day', 'time']) {
    const p = chart.pillars[key];
    if (!p.hidden) continue;
    p.hidden.forEach((h, i) => { if (h && h.god && h.god !== '日主') c[h.god] = (c[h.god] || 0) + (W[i] || 0.1); });
  }
  delete c['日主'];
  return c;
}

const COMBO_DEFS = [
  { id: 'shaYin', name: '殺印相生', vi: 'Sát Ấn Tương Sinh', tone: 'cat',
    test: (g) => g['七殺'] > 0 && (g['正印'] > 0 || g['偏印'] > 0),
    desc: 'Thất Sát được Ấn hóa giải, hóa sát vi quyền — thượng đẳng cách cục, ý chí kiên định, có mưu lược, thường là tướng soái hoặc lãnh đạo doanh nghiệp.' },
  { id: 'guanYin', name: '官印相生', vi: 'Quan Ấn Tương Sinh', tone: 'cat',
    test: (g) => g['正官'] > 0 && g['正印'] > 0,
    desc: 'Chính Quan sinh Ấn, Ấn sinh thân — khí lưu thông thuận, người đoàng hoàng, học thức, có mưu lược, học nghiệp/sự nghiệp/địa vị đều thuận.' },
  { id: 'shiSha', name: '食神制殺', vi: 'Thực Chế Sát', tone: 'cat',
    test: (g) => g['食神'] > 0 && g['七殺'] > 0,
    desc: 'Thực Thần khắc chế Thất Sát — dùng trí tuệ chế ngự áp lực, có mưu lược, chủ cát.' },
  { id: 'shiCai', name: '食神生財', vi: 'Thực Sinh Tài', tone: 'cat',
    test: (g) => g['食神'] > 0 && (g['正財'] > 0 || g['偏財'] > 0),
    desc: 'Thực Thần sinh Tài — dùng tài hoa/kỹ nghệ phát tài, kinh doanh/tay nghề phát đạt, tài lộc ổn định.' },
  { id: 'shangCai', name: '傷官生財', vi: 'Thương Sinh Tài', tone: 'cat',
    test: (g) => g['傷官'] > 0 && (g['正財'] > 0 || g['偏財'] > 0),
    desc: 'Thương Quan sinh Tài — dùng口 tài/sáng tạo kiếm tiền, quyết tiến hơn Thực Sinh Tài, hợp thương trường/khởi nghiệp.' },
  { id: 'shangYin', name: '傷官佩印', vi: 'Thương Phối Ấn', tone: 'cat',
    test: (g) => g['傷官'] > 0 && (g['正印'] > 0 || g['偏印'] > 0),
    desc: 'Ấn chế Thương Quan — hóa hung vi cát, giảm tính ngạo mạn/phản nghịch của Thương Quan, biến thành tài năng có kỷ luật.' },
  { id: 'shangGuan', name: '傷官見官', vi: 'Thương Quan Kiến Quan', tone: 'xiong',
    test: (g) => g['傷官'] > 0 && g['正官'] > 0,
    desc: '“Thương quan kiến quan, vi họa bách đoan” — Thương Quan khắc Chính Quan, dễ chống权威/khẩu thiệt/thị phi, nữ mạng khắc phu; cần Ấn chế mới giảm.' },
  { id: 'xiaoShi', name: '梟神奪食', vi: 'Kiêu Đoạt Thực', tone: 'xiong',
    test: (g) => g['偏印'] > 0 && g['食神'] > 0,
    desc: 'Thiên Ấn (Kiêu) khắc Thực Thần — đoạt nguồn tài, dễ bế tắc tài lộc/sức khỏe; cần Tài chế Kiêu mới giải.' },
  { id: 'caiGuan', name: '財官雙美', vi: 'Tài Quan Song Mỹ', tone: 'cat',
    test: (g) => (g['正財'] > 0 || g['偏財'] > 0) && (g['正官'] > 0 || g['七殺'] > 0),
    desc: 'Tài sinh Quan — danh lợi song toàn, sự nghiệp & tài lộc đều tốt.' },
  { id: 'guanZha', name: '官殺混雜', vi: 'Quan Sát Hỗn Tạp', tone: 'xiong',
    test: (g) => g['正官'] > 0 && g['七殺'] > 0,
    desc: 'Chính Quan + Thất Sát cùng hiện — quan sát lẫn lộn, nữ mạng đặc biệt bất lợi hôn nhân, sự nghiệp dễ hoang mang; cần chế/sab lle để giải.' },
  { id: 'caiDuo', name: '財多身弱', vi: 'Tài Đa Thân Nhược', tone: 'xiong',
    test: (g, s) => s && !s.strong && ((g['正財'] || 0) + (g['偏財'] || 0)) >= 2.5,
    desc: 'Tài quá vượng mà thân nhược — tiền qua tay khó giữ, dễ ôm nợ/đòn bẩy; phải dùng Tỷ Kiếp/Ấn trợ thân.' },
  { id: 'shaGong', name: '殺攻身', vi: 'Sát Công Thân', tone: 'xiong',
    test: (g, s) => s && !s.strong && (g['七殺'] || 0) >= 2,
    desc: 'Thất Sát quá nặng mà thân nhược không chịu nổi — áp lực/sức khỏe/rủi ro lớn; cần Ấn hóa hoặc Thực chế.' },
  // [loop 85 bổ sung 5 tổ hợp cổ pháp còn thiếu]
  { id: 'shangJin', name: '傷官傷盡', vi: 'Thương Quan Thương Tận', tone: 'cat',
    test: (g) => (g['傷官'] || 0) >= 1.5 && (g['正官'] || 0) === 0 && (g['七殺'] || 0) === 0,
    desc: 'Thương Quan nhiều mà QUAN SÁT vắng sạch («伤官伤尽, 富贵») — phản nghịch biến tài năng đột phá, hợp khởi nghiệp/sáng tạo, phú quý (cát khi quan sát tuyệt).' },
  { id: 'qunJie', name: '群劫爭財', vi: 'Quần Kiếp Tranh Tài', tone: 'xiong',
    test: (g) => (g['劫財'] || 0) >= 1.5 && ((g['正財'] || 0) + (g['偏財'] || 0)) >= 1,
    desc: 'Kiếp Tài nhiều tranh giành Tài («群劫争财») — hao tiền, hôn nhân biến, đầu tư thất bại; cần Quan Sát chế Kiếp.' },
  { id: 'yinHuy', name: '印綬護身', vi: 'Ấn Thụ Hộ Thân', tone: 'cat',
    test: (g, s) => s && !s.strong && ((g['正印'] || 0) + (g['偏印'] || 0)) >= 2,
    desc: 'Thân nhược được Ấn (nhiều) sinh phù bảo vệ («印绶护身») — quý nhân giúp, học vấn, ấm no, phúc (dù thân nhược vẫn được ấpủ).' },
  { id: 'shiXie', name: '食神洩秀', vi: 'Thực Tiết Tú', tone: 'cat',
    test: (g, s) => s && s.strong && (g['食神'] || 0) >= 1,
    desc: 'Thân vượng được Thực Thần tiết tú («身旺食泄秀») — thông minh, nghệ thuật/tài hoa bộc lộ, phúc lộc.' },
  { id: 'shenRenCai', name: '身旺任財', vi: 'Thân Vượng Nhậm Tài', tone: 'cat',
    test: (g, s) => s && s.strong && ((g['正財'] || 0) + (g['偏財'] || 0)) >= 2,
    desc: 'Thân vượng + Tài nhiều («身旺任财») — gánh được tài lớn, tiền đồ phú quý, kinh doanh lớn (đối lập «财多身弱»).' },
];

/**
 * Phát hiện tổ hợp Thập Thần trong lá số.
 * @returns {Array<{id,name,vi,tone,desc}>}
 */
export function detectCombos(chart, strength) {
  const g = godCount(chart);
  const out = [];
  for (const def of COMBO_DEFS) {
    try {
      if (def.test(g, strength)) out.push({ id: def.id, name: def.name, vi: def.vi, tone: def.tone, desc: def.desc });
    } catch (e) { /* bỏ qua lỗi 1 tổ hợp */ }
  }
  return out;
}

export { TEN_GOD_VI, COMBO_DEFS, godCount };
