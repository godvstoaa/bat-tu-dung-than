// ============================================================================
//  KINH DOANH LUẬN 经营论 — BUSINESS & INVESTMENT GUIDE
//  "Có nên khởi nghiệp? Mở công ty gì? Đầu tư ngành nào? Khi nào mở?"
//  Tổng hợp: Dụng Thần ngành + cách cục + tài khố + thập thần doanh nhân
//  + thời điểm mở + loại hình DN phù hợp.
//  Nguồn: 渊海子平 商贾篇, 滴天髓 财格论业.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI } from './constants.js';
import { dominantGod } from './dominant-god.js'; // [cycle 50] thần chủ gồm cả tàng can
import { tenGod } from './core.js';

const BUSINESS_TYPES = {
  木: ['nông-lâm', 'giáo dục', 'xuất bản', 'thời trang vải', 'nội thất gỗ', 'dược/east y', 'môi trường', 'từ thiện'],
  火: ['ẩm thực', 'truyền thông', 'quảng cáo', 'giải trí', 'điện tử', 'mỹ phẩm', 'năng lượng', 'ánh sáng'],
  土: ['BĐS', 'xây dựng', 'bảo hiểm', 'gốm sứ', 'kho bãi', 'tư vấn', 'logistics kho', 'nông nghiệp'],
  金: ['tài chính', 'cơ khí', 'công nghệ', 'luật', 'trang sức', 'xin dịch', 'ô tô', 'y khoa'],
  水: ['thương mại', 'xuất nhập khẩu', 'du lịch', 'thủy sản', 'tài chính lưu thông', 'ngoại giao', 'media'],
};

const PARTNER_GOD = {
  正官: { vi: 'Chính Quan', biz: 'hợp công ty có cấu trúc, quy củ — cổ phần, pháp lý rõ' },
  七殺: { vi: 'Thất Sát', biz: 'độc lập/độc quyền — startup nhanh, quyết liệt, cạnh tranh mạnh' },
  正財: { vi: 'Chính Tài', biz: 'kinh doanh ổn định, dòng tiền đều — bán lẻ, dịch vụ' },
  偏財: { vi: 'Thiên Tài', biz: 'đầu tư, tài chính biến động — chứng khoán, BĐS xão' },
  正印: { vi: 'Chính Ấn', biz: 'giáo dục, đào tạo, nghiên cứu — trường học, trung tâm' },
  偏印: { vi: 'Thiên Ấn', biz: 'huyền học, tôn giáo, kỹ thuật chuyên sâu — niche' },
  食神: { vi: 'Thực Thần', biz: 'ẩm thực, nghệ thuật, dịch vụ — nhà hàng, studio' },
  傷官: { vi: 'Thương Quan', biz: 'sáng tạo, kỹ thuật, khởi nghiệp — tech, marketing' },
  比肩: { vi: 'Tỷ Kiên', biz: 'hợp tác bình đẳng — joint venture, co-founder' },
  劫財: { vi: 'Kiếp Tài', biz: 'CẢNH BÁO: kinh doanh dễ hao, hợp tác rủi ro — nên làm thuê/chi nhánh' },
};

/**
 * @returns {{ shouldStart, bizTypes, partnerStyle, hasCaiKu, foodGen, robberLevel,
 *            soloVsPartner, timing, profile, advice }}
 */
export function analyzeBusiness(R) {
  const { chart, yong, dayun, synthesis } = R;
  const dmWx = chart.dayMaster.wx;
  const dayGan = chart.dayGan;

  // 1. Có nên khởi nghiệp? [cycle 50] đếm thần chủ gồm cả TÀNG CAN (đồng bộ dominant-god)
  const dayGods = {};
  dominantGod(R).ranked.forEach((r) => { dayGods[r.god] = (dayGods[r.god] || 0) + 1; });

  const hasQiSha = (dayGods['七殺']||0) > 0;       // dám liều
  const hasShangGuan = (dayGods['傷官']||0) > 0;    // sáng tạo
  const hasTianCai = (dayGods['偏財']||0) > 0;      // tài lớn
  const hasBishi = (dayGods['比肩']||0) > 0;        // hợp tác
  const hasJieCai = (dayGods['劫財']||0) > 0;       // hao tiền

  let shouldStart = false;
  const reasons = [];
  if (hasQiSha) { shouldStart = true; reasons.push('Có Thất Sát → dám khởi nghiệp, quyết liệt.'); }
  if (hasShangGuan) { shouldStart = true; reasons.push('Có Thương Quan → sáng tạo, phá cách, hợp startup.'); }
  if (hasTianCai) { shouldStart = true; reasons.push('Có Thiên Tài → tài lớn biến động, hợp đầu tư.'); }
  if (R.strength.strong) { shouldStart = true; reasons.push('Thân vượng → đủ sức gánh Tài/Quan, hợp quản lý.'); }
  if (!shouldStart) reasons.push('Thân nhược/thiếu Thương Quan/Thất Sát → nên làm thuê hoặc co-founder nhẹ.');

  // 2. Ngành nghề theo Dụng Thần
  const bizTypes = [...new Set([yong.primary, yong.xi].filter(Boolean))].flatMap(w => BUSINESS_TYPES[w] || []);

  // 3. Phong cách doanh nhân (thập thần nổi bật nhất)
  const topGods = Object.entries(dayGods).sort((a,b) => b[1]-a[1]);
  const topBizGod = topGods[0]?.[0] || '正官';
  const partnerStyle = PARTNER_GOD[topBizGod] || PARTNER_GOD['正官'];

  // 4. Tài khố — kiểm tra trực tiếp 4 chi Thổ có chứa Tài không
  const WX_KU = { 水:'辰', 火:'戌', 金:'丑', 木:'未' };
  const taiWx = ({木:'土',火:'金',土:'水',金:'木',水:'火'})[GAN[dayGan].wx];
  const kuZhi = taiWx === '土' ? ['辰','戌','丑','未'] : [WX_KU[taiWx]];
  const allZhi = ['year','month','day','time'].map(k => chart.pillars[k].zhi);
  const hasCaiKu = allZhi.some(z => kuZhi.includes(z));

  // 5. Thực thương (sinh tài) + tỷ kiếp (đoạt tài)
  let foodGen = 0, robberLevel = 0;
  for (const key of ['year','month','time']) {
    const g = chart.pillars[key].ganGod;
    if (['食神','傷官'].includes(g)) foodGen += 1;
    if (['比肩','劫財'].includes(g)) robberLevel += g === '劫財' ? 1.5 : 1;
  }
  for (const key of ['year','month','day','time']) {
    const g = chart.pillars[key].hidden[0]?.god;
    if (['食神','傷官'].includes(g)) foodGen += 0.5;
    if (g === '劫財') robberLevel += 0.5;
  }

  // 6. Solo vs Partner
  let soloVsPartner;
  if (hasJieCai || robberLevel >= 2) soloVsPartner = '⚠ NÊN LÀM SOLOR — hợp tác dễ hao (Kiếp Tài đoạt tài). Tuyệt đối tránh hùn vốn lớn.';
  else if (hasBishi || R.strength.strong) soloVsPartner = 'CÓ THỂ HỢP TÁC — Tỷ Kiên cho phép joint venture. Nhưng chọn cẩn thận.';
  else soloVsPartner = 'NÊN CÓ CO-FOUNDER — thân nhược cần người bổ trợ. Chọn người có mệnh bổ Dụng Thần.';

  // 7. Timing
  const timing = (dayun || []).filter(d => {
    const dgWx = GAN[d.gan]?.wx;
    return dgWx === yong.primary || dgWx === yong.xi ||
      ['正財','偏財','食神','傷官','正官','七殺'].includes(
        tenGod(dayGan, d.gan)
      );
  }).map(d => `${d.ganZhi}[${d.startAge}-${d.startAge+9}t:${d.rating}]`);

  // 8. Profile
  const profile = [
    `Khởi nghiệp: ${shouldStart ? '✓ CÓ TIỀM NĂNG' : '⚠ HẠN CHẾ'}. ${reasons.join(' ')}`,
    `Ngành phù hợp (Dụng ${WX_VI[yong.primary]}/${WX_VI[yong.xi]}): ${bizTypes.slice(0,6).join(', ')}.`,
    `Phong cách: ${partnerStyle.vi} → ${partnerStyle.biz}`,
    `Thực Thương (sinh tài): ${foodGen >= 1.5 ? '✓ vượng — có nguồn tài' : foodGen > 0 ? 'vừa' : 'thiếu — tài ít nguồn sinh'}.`,
    `Tỷ Kiếp (đoạt tài): ${robberLevel >= 2 ? '⚠ CAO — hao tiền, tránh đầu cơ' : robberLevel >= 1 ? 'vừa' : 'thấp — ổn'}.`,
    soloVsPartner,
    timing.length ? `⏰ Khởi nghiệp tốt ở: ${timing.slice(0,4).join(', ')}` : '',
  ].filter(Boolean);

  const advice = shouldStart && foodGen >= 1
    ? `Nên khởi nghiệp! Ngành ${bizTypes[0]||'?'}. Phong cách ${partnerStyle.vi}. Solo hay hợp tác: ${soloVsPartner.includes('SOLO') ? 'SOLO' : 'có thể hợp tác'}. Mở ở đại vận Dụng Thần.`
    : shouldStart
      ? `Có tiềm năng nhưng thiếu nguồn tài (Thực Thương) → nên có sản phẩm/dịch vụ rõ trước khi mở.`
      : `Chưa phù hợp khởi nghiệp → nên tích lũy kinh nghiệm/làm thuê, đợi đại vận Dụng Thần rồi mở.`;

  return { shouldStart, reasons, bizTypes, partnerStyle, hasCaiKu, foodGen, robberLevel,
    soloVsPartner, timing, profile, advice };
}
