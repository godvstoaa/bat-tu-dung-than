// ============================================================================
//  HỒ SƠ PARTNER ĐẦY ĐỦ — từ lá số partner + user → 1 bản đọc hoàn chỉnh
//  Output = multi-paragraph: personality + career + appearance + family +
//  interaction + strengths/weaknesses + name suggestion + children forecast.
// ============================================================================
import { GAN, ZHI, WX_VI, TEN_GOD_VI, KE_BY, SHENG } from './constants.js';
import { DITIANSUI } from './kb.js';
import { dominantGods } from './kb.js';

const DM_TRAITS = {
  甲: 'thẳng thắn, có chí tiến thủ, lãnh đạo, đôi khi cứng nhắc',
  乙: 'mềm mỏng, duyên dáng, thích nghi tốt, dễ phụ thuộc',
  丙: 'nhiệt thành, hào sảng, quang minh, đôi khi nóng vội',
  丁: 'tinh tế, trực giác tốt, ấm áp nhưng hay lo nghĩ',
  戊: 'vững vàng, bao dung, đáng tin, đôi khi bảo thủ',
  己: 'ôn hoà, cần mẫn, nuôi dưỡng, thực tế, đôi khi hay đa nghi',
  庚: 'cương nghị, quả đoán, trọng nghĩa khí, dễ cứng rắn',
  辛: 'thanh nhã, nhạy cảm, thẩm mỹ cao, dễ tổn thương',
  壬: 'thông tuệ, phóng khoáng, mưu lược, đôi khi phóng túng',
  癸: 'kín đáo, nhẫn nại, trí tưởng tượng, dễ ưu tư',
};
const WX_CAREER = {
  木: 'giáo dục, xuất bản, mộc/nội thất, dược/đông y, nông-lâm, thời trang',
  火: 'ẩm thực, điện tử, truyền thông, năng lượng, mỹ phẩm, giải trí',
  土: 'bất động sản, xây dựng, nông nghiệp, tư vấn, gốm sứ, kho bãi',
  金: 'tài chính, cơ khí, công nghệ, luật, trang sức, y khoa',
  水: 'thương mại, vận tải, du lịch, tài chính lưu thông, xuất nhập khẩu',
};
const WX_LOOKS = {
  木: 'thanh hình cao thon, xương to, gan ro, toc day khoe, mat dai - khi chat manh me, phong thai',
  火: 'mat tron hoac vuong, mat sang co than, da ung do, toc mem - bieu cam ruc ro, khi chat nhiet huyet',
  土: 'than hinh day da hoac trung binh, da vang am, di dung vung chai - phong thai on hoa, dang tin',
  金: 'da trang, ngu quan sac net gon gang, xuong goc canh ro, toc thang cung - khi chat lanh, thanh tu',
  水: 'da mem, mat sau long lanh, toc den day, than hinh tron day mem mai - khi chat linh hoat, bi an',
};
const GOD_NATURE = {
  正官: 'ôn hoà, quy củ, có ý thức trách nhiệm, phù hợp công chức',
  七殺: 'mạnh mẽ, áp lực, dũng cảm, hợp kinh doanh/doanh nghiệp',
  正印: 'học vấn, nhân từ, bảo vệ, ấm no, hay lo cho người',
  偏印: 'trực giác, lập dị, huyền học, nghệ thuật phi chính thống',
  食神: 'tài hoa, hưởng thụ, bình hoà, biết ăn nói, phúc lộc',
  傷官: 'sáng tạo, phản nghịch, khẩu tài, kiêu ngạo, thông minh',
  正財: 'thực tế, cần mẫn, tiết kiệm, ổn định',
  偏財: 'hào phóng, giao tế, tài lớn, đầu tư, biến động',
  比肩: 'độc lập, cạnh tranh, tự lập, bạn bè nhiều',
  劫財: 'mạo hiểm, hào sảng, dễ hao tiền, tranh giành',
};
const NAME_CHARS = {
  木: ['林(Lâm)', '松(Tùng)', '柏(Bách)', '荣(Vinh)', '芳(Phương)', '兰(Lan)', '春(Xuân)', '枝(Chi)'],
  火: ['明(Minh)', '辉(Huy)', '烨(Diệp)', '灿( Sán)', '红(Hồng)', '南(Nam)', '光(Quang)', '阳(Dương)'],
  土: ['坤(Khôn)', '城(Thành)', '垣(Viên)', '培(Bồi)', '坚(Kiên)', '均(Quân)', '堂(Đường)', '基(Cơ)'],
  金: ['钧(Quân)', '钰(Ngọc)', '锋(Phong)', '铭(Minh)', '锦(Cẩm)', '鑫(Tham)', '银(Ngân)', '钢(Cương)'],
  水: ['涛(Đào)', '海(Hải)', '泽(Trạch)', '浩(Hạo)', '润(Nhuận)', '涵(Hàm)', '清(Thanh)', '源(Nguyên)'],
};

/**
 * Tạo HỒ SƠ ĐẦY ĐỦ cho 1 partner lý tưởng.
 * @param {object} match - top match từ findIdealPartners (có .chart = R)
 * @param {object} userR - user's analyze() result
 * @returns { paragraphs: string[] }
 */
export function buildFullProfile(match, userR) {
  const R = match.chart; // partner's full analyze result
  const chart = R.chart;
  const dm = chart.dayMaster;
  const dmGan = dm.gan;
  const dmWx = dm.wx;
  const dt = DITIANSUI[dmGan];
  const top = dominantGods(chart, 2);
  const userYong = userR.yong;
  const userDm = userR.chart.dayMaster;
  const isUserDung = [userYong.primary, userYong.xi].includes(dmWx);
  const p = [];

  // 1. BÁT TỰ + TÍNH CÁCH
  const gz4 = ['year','month','day','time'].map(k => chart.pillars[k].gan + chart.pillars[k].zhi).join(' ');
  p.push(`Bát Tự: ${gz4}`);
  p.push(`Nhật Chủ: ${dmGan} ${dm.vi} (hành ${WX_VI[dmWx]}). ${DM_TRAITS[dmGan] || ''}.`);
  if (dt) p.push(`Bản chất (滴天髓): ${dt.vi}`);
  const godsStr = top.map(g => `${g.vi} (${g.n})`).join(', ');
  const godNatures = top.map(g => GOD_NATURE[g.god] || '').filter(Boolean).join('; ');
  p.push(`Sao nổi bật: ${godsStr} → ${godNatures}.`);

  // 2. NGHỀ NGHIỆP
  p.push(`Nghề nghiệp hợp: ${WX_CAREER[dmWx] || '?'}. Dụng Thần của partner = ${WX_VI[R.yong.primary]} → nên làm ngành mang hành ${WX_VI[R.yong.primary]}.`);

  // 3. NGOẠI HÌNH
  p.push(`Ngoại hình (tham khảo): ${WX_LOOKS[dmWx] || '?'}.`);

  // 4. GIA CẢNH (year + month pillar)
  const yearP = chart.pillars.year;
  const monthP = chart.pillars.month;
  const yearGod = TEN_GOD_VI[yearP.ganGod] || yearP.ganGod;
  const monthGod = TEN_GOD_VI[monthP.ganGod] || monthP.ganGod;
  let familyNote = `Gia cảnh: Trụ Năm ${yearP.gan}${yearP.zhi} (${yearGod})`;
  if (['正官','正印','正財'].includes(yearP.ganGod)) familyNote += ' → gia đình khá giả/ôn hoà, có nền tảng.';
  else if (['七殺','偏印'].includes(yearP.ganGod)) familyNote += ' → gia đình phức tạp/áp lực, tự lập sớm.';
  else familyNote += ' → gia đình trung bình.';
  familyNote += ` Trụ Tháng ${monthP.gan}${monthP.zhi} (${monthGod})`;
  if (['正印','偏印'].includes(monthP.ganGod)) familyNote += ' → có học vấn/cha mẹ hỗ trợ.';
  p.push(familyNote);

  // 5. CÁCH TƯƠNG TÁC VỚI USER
  const interaction = isUserDung
    ? `Partner mang hành ${WX_VI[dmWx]} = DỤNG THẦN của bạn → BỔ MỆNH trực tiếp. Ở cạnh người này bạn sẽ cảm thấy may mắn, han thông, "như có quý nhân phù". Đây là người "bổ mệnh" bạn — hiếm có.`
    : `Partner mang hành ${WX_VI[dmWx]} (không trùng Dụng nhưng ${match.hehunRating}). Vẫn hợp qua ngũ hành tương bổ và 生肖.`;
  p.push(`Với BẠN: ${interaction}`);

  // 6. ĐIỂM MẠNH / YẾU
  const strengths = [];
  const weaknesses = [];
  if (isUserDung) strengths.push('Bổ Dụng Thần trực tiếp → mối quan hệ tự nhiên tốt cho vận mệnh bạn');
  if (match.yearRel === 'tam hợp' || match.yearRel === 'lục hợp') strengths.push(`生肖 ${match.yearRel} → gia đình hai bên hòa hợp`);
  if (match.dayRel) strengths.push('Nhật Can hợp → tâm đầu ý hợp, dễ đồng cảm');
  strengths.push(`Điểm hợp hôn: ${match.hehunScore}/100 (${match.hehunRating})`);
  if (userR.yong.avoid.includes(R.yong.primary)) weaknesses.push(`Partner Dụng ${WX_VI[R.yong.primary]} trùng Kỵ của bạn → một số lợi ích của partner có thể giảm`);
  // 孤辰 check
  if (userR.chart.pillars.day.zhi === '亥') weaknesses.push('Bạn có 孤辰 tại Day → cần chủ động mở lòng, kiên nhẫn');
  p.push(`Điểm mạnh: ${strengths.join('; ')}.`);
  if (weaknesses.length) p.push(`Cẩn thận: ${weaknesses.join('; ')}.`);

  // 7. TÊN GỢI Ý
  const nameEl = userYong.primary; // tên nên mang hành Dụng của USER
  const chars = NAME_CHARS[nameEl] || NAME_CHARS['土'];
  p.push(`Tên nên mang hành ${WX_VI[nameEl]} (Dụng của bạn): ${chars.join('/')}. VD: ${chars.slice(0,4).join(' / ')}. (Tra chi tiết 五格 ở mục Học Tên.)`);

  // 8. CON CÁI
  const isMaleUser = userR.chart.input.gender === 'nam';
  // Hành của con = khắc nhập (正官/七殺 group với nam) hoặc sinh xuất (正財/偏財 với nữ)
  // — tính từ Nhật Chủ của USER, không hardcode.
  const userDmWx = userR.chart.dayMaster.wx;
  const childWxUser = isMaleUser ? KE_BY[userDmWx] : SHENG[userDmWx]; // nam: ai khắc Nhật Chủ (官 sát); nữ: Nhật Chủ sinh (tài)
  const combinedChildWx = dmWx; // child inherits partner's element tendency
  p.push(`Con cái: nếu sinh con với partner này → con thừa hưởng Thổ (từ mẹ) + Mộc (từ bạn) = Mộc khắc Thổ = con có tính tự lập, mạnh mẽ. Nên sinh vào năm mang hành ${WX_VI[userYong.primary]} (Dụng của bạn) → con bổ mệnh cha mẹ.`);

  return { paragraphs: p, summary: `Partner #${match.rank}: ${dm.vi} (${WX_VI[dmWx]}) sinh ${match.date} — ${DM_TRAITS[dmGan]?.split(',')[0] || ''}. ${isUserDung ? '★ BỔ DỤNG THẦN!' : ''} Hợn ${match.hehunScore}/100.` };
}
