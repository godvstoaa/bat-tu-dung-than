// ============================================================================
//  鬼谷子算命 (GUIGUZI DIVINATION) — 60甲子納音 → 鬼谷子命詩
//  Hệ bói toán cổ đại (鬼谷子/Quỷ Cốc Tử), phổ biến ở Hong Kong.
//  Dựa trên NĂM SINH → 甲子 → 納音 → thơ đoán mệnh + luận giải.
//  Khác 称骨 (trọng lượng) và 小六壬 (đã có). Kết hợp được với lá số Bát Tự.
//  Nguồn: 鬼谷子算命术, 渊海子平 納音論.
// ============================================================================
import { ganZhiNayin } from './nayin.js';

// 30 納音 types → 鬼谷子 verse + luận giải VN + tone (cat/hung/bình)
const GUIGUZI_NAYIN = {
  '海中金': { vi: 'Kim Trong Biển', tone: 'bình', verse: '金藏海底待时开', fortune: 'Tài năng ẩn sâu, cần thời cơ + quý nhân mới bộc lộ. Tuổi trẻ vất vả, trung niên phát. Nên kiên nhẫn, tích lũy — «kim phi hỏa luyện» mới thành khí.', career: 'ngành khai thác, đầu tư dài hạn, nghiên cứu' },
  '炉中火': { vi: 'Lửa Trong Lò', tone: 'cat', verse: '炉中旺火炼真金', fortune: 'Nhiệt huyết, quyết tâm mạnh — «hỏa luyện chân kim». Tuổi trẻ gian nan rèn luyện, sau thành tài. Cần kiểm soát tính nóng.', career: 'ẩm thực, năng lượng, rèn luyện/thể thao, sản xuất' },
  '大林木': { vi: 'Gỗ Cây Lớn', tone: 'cat', verse: '大林木茂庇荫人', fortune: 'Như cây cổ thụ — che chở cho người khác, uy tín, trường tồn. Thuở nhỏ lớn chậm, sau thành đại thụ. Nên trồng người/phát triển đội.', career: 'giáo dục, nông/lâm, y tế, tổ chức phi lợi nhuận' },
  '路旁土': { vi: 'Đất Bên Đường', tone: 'bình', verse: '路旁土厚任踩踏', fortune: 'Kiên nhẫn, chịu đựng, phục vụ người khác như đất bên đường. Không nổi bật nhưng cần thiết. Sẽ được ghi nhận muộn.', career: 'dịch vụ, logistics, hành chính, y tá' },
  '剑锋金': { vi: 'Kim Mũi Kiếm', tone: 'cat', verse: '剑锋金利斩不平', fortune: 'Sắc bén, quyết đoán — như lưỡi kiếm bén. Dám hành động, trực diện. Cần cẩn trọng không sát thương người khác.', career: 'luật, quân sự, phẫu thuật, công nghệ cao' },
  '山头火': { vi: 'Lửa Trên Núi', tone: 'hung', verse: '山头火烈烧不止', fortune: 'Mạnh mẽ, dữ dội, dễ bùng phát — như lửa cháy trên núi. Tài năng lớn nhưng cần kiểm soát, tránh bốc đồng/thiouệt.', career: 'giải trí, biểu diễn, khởi nghiệp nhanh' },
  '涧下水': { vi: 'Nước Khe Suối', tone: 'bình', verse: '涧下水清流不息', fortune: 'Nhẹ nhàng, liên tục, thanh khiết — như khe suối. Tinh tế, nhẫn nại, lâu dài. Nên tránh bị chặn/em lúi.', career: 'nghệ thuật, viết, tâm lý, y học cổ truyền' },
  '城头土': { vi: 'Đất Thành Lũy', tone: 'cat', verse: '城头土固守一方', fortune: 'Vững chắc, bảo vệ — như tường thành. Đáng tin, trách nhiệm, giữ gìn. Nên cởi mở hơn, đừng quá cố chấp.', career: 'quân sự, an ninh, bảo hiểm, quản lý rủi ro' },
  '白蜡金': { vi: 'Kim Sáp Trắng', tone: 'bình', verse: '白蜡金美怕火烧', fortune: 'Đẹp, quý nhưng mỏng manh — như sáp vàng. Tài năng rõ nhưng cần bảo vệ, tránh môi trường khắc (hỏa).', career: 'trang sức, thẩm mỹ, thiết kế, ngoại giao' },
  '杨柳木': { vi: 'Gỗ Liễu Yếu', tone: 'bình', verse: '杨柳柔枝随风舞', fortune: 'Linh hoạt, thích nghi — như cành liễu. Dễ hòa nhập, duyên dáng. Cần có lập trường, tránh quá mềm mỏng.', career: 'ngoại giao, quan hệ công chúng, nghệ thuật' },
  '泉中水': { vi: 'Nước Suối Trong', tone: 'cat', verse: '泉水清澈润万物', fortune: 'Trong vắt, liên tục, nuôi dưỡng — như nước suối. Tâm thiện, trí sáng. Nên phát triển tri thức/phụng sự.', career: 'giáo dục, nghiên cứu, y tế, từ thiện' },
  '屋上土': { vi: 'Đất Trên Mái', tone: 'bình', verse: '屋上土覆庇一家', fortune: 'Bảo vệ, che chở — như mái nhà. Gia đình là trọng tâm, trách nhiệm cao. Nên mở rộng ra ngoài.', career: 'bất động sản, xây dựng, gia đình/bảo vệ' },
  '霹雳火': { vi: 'Lửa Sấm Sét', tone: 'hung', verse: '霹雳火烈动天地', fortune: 'Bùng nổ, bất ngờ — như sấm sét. Tài năng đột biến, dũng cảm. Cần kiểm soát, tránh phá hoại.', career: 'công nghệ đột phá, đầu cơ, thể thao đối kháng' },
  '松柏木': { vi: 'Gỗ Tùng Bách', tone: 'cat', verse: '松柏常青傲雪霜', fortune: 'Kiên cường, trường tồn — như tùng bách. Mùa đông vẫn xanh, chịu được gian nan. Sẽ thành đại khí muộn.', career: 'quân sự, giáo dục cao cấp, nghiên cứu' },
  '长流水': { vi: 'Nước Sông Dài', tone: 'cat', verse: '长流水远汇大海', fortune: 'Liên tục, xa — như dòng sông. Kiên nhẫn, tầm nhìn xa, kết nối nhiều nơi. Nên giữ hướng, tránh phân tán.', career: 'thương mại, ngoại giao, logistics, truyền thông' },
  '沙中金': { vi: 'Kim Trong Cát', tone: 'bình', verse: '砂里淘金费功夫', fortune: 'Cần kiên nhẫn «sa li đào kim» — tài năng rải rác, cần thu thập. Vất vả sớm, thu hoạch muộn.', career: 'khai khoáng, đầu tư giá trị, sưu tầm' },
  '山下火': { vi: 'Lửa Chân Núi', tone: 'bình', verse: '山下火温照四方', fortune: 'Ấm áp, ổn định — như lửa chân núi. Không dữ dội nhưng bền. Tốt cho nuôi dưỡng, chăm sóc.', career: 'giáo dục, y tế, khách sạn, nấu ăn' },
  '平地木': { vi: 'Gỗ Đồng Bằng', tone: 'bình', verse: '平地木凡用处多', fortune: 'Phổ thông nhưng hữu dụng — như cây đồng bằng. Không nổi bật nhưng đa năng, thực tế.', career: 'nông nghiệp, thủ công, bán lẻ, dịch vụ' },
  '壁上土': { vi: 'Đất Tường Vách', tone: 'bình', verse: '壁上土坚阻风雨', fortune: 'Cản trở, bảo vệ — như vách tường. Chắn gió mưa, giữ an toàn. Cần linh hoạt hơn.', career: 'xây dựng, pháp luật, biên phòng' },
  '金箔金': { vi: 'Kim Lá Mỏng', tone: 'hung', verse: '金箔华丽易破损', fortune: 'Đẹp nhưng mỏng — như lá vàng. Bề ngoài hào nhoáng nhưng dễ tổn thương. Cần nội dung thực.', career: 'trang trí, quảng cáo, hình ảnh, thời trang' },
  '覆灯火': { vi: 'Lửa Đèn Phủ', tone: 'cat', verse: '灯火一盏照暗路', fortune: 'Soi sáng, dẫn đường — như ngọn đèn. Tri thức, hướng dẫn, tâm linh. Cần dưỡng năng lượng.', career: 'giáo dục, tôn giáo, hướng dẫn viên, cố vấn' },
  '天河水': { vi: 'Nước Sông Trời', tone: 'cat', verse: '天河水沛润苍生', fortune: 'Rộng lớn, tinh thần cao — như sông trên trời. Bao dung, từ bi, tầm nhìn vĩ mô.', career: 'tôn giáo, triết học, quản lý cấp cao, từ thiện' },
  '大驿土': { vi: 'Đất Trạm Đường', tone: 'bình', verse: '大驿土广走四方', fortune: 'Giao thiệp rộng, bận rộn — như đất trạm đường. Nhiều mối quan hệ, năng động. Nên chọn lọc.', career: 'du lịch, vận tải, bán hàng, ngoại giao' },
  '钗钏金': { vi: 'Kim Trâm Cài', tone: 'bình', verse: '钗钏金美饰红妆', fortune: 'Tinh xảo, thẩm mỹ — như trâm cài. Đẹp, khéo léo. Cận trọng sự hao mòn, cần bảo dưỡng.', career: 'thẩm mỹ, trang sức, thời trang cao cấp' },
  '桑柘木': { vi: 'Gỗ Dâu Tằm', tone: 'cat', verse: '桑柘养蚕丝不绝', fortune: 'Thực dụng, nuôi dưỡng — như cây dâu nuôi tằm. Làm việc nền tảng để người khác phát triển.', career: 'nông nghiệp, giáo dục, cung cấp nguyên liệu' },
  '大溪水': { vi: 'Nước Khe Lớn', tone: 'cat', verse: '大溪水活奔不停', fortune: 'Năng động, mạnh mẽ — như khe lớn. Không ngừng, hướng đi rõ. Nên tránh quá vội vàng.', career: 'thương mại, du lịch, thể thao, logistics' },
  '沙中土': { vi: 'Đất Trong Cát', tone: 'hung', verse: '砂中土散难成形', fortune: 'Rời rạc, cần gom — như đất trong cát. Khó tập trung, cần kỷ luật. Nên tìm nền tảng vững.', career: 'xây dựng, quy hoạch, quản lý dự án' },
  '天上火': { vi: 'Lửa Trên Trời', tone: 'cat', verse: '天上火明照万方', fortune: 'Rực rỡ, uy quyền — như mặt trời. Lãnh đạo bẩm sinh, sáng tạo. Cẩn trọng kiêu ngạo.', career: 'lãnh đạo, chính trị, CEO, sáng lập' },
  '石榴木': { vi: 'Gỗ Lựu', tone: 'cat', verse: '石榴多子满枝头', fortune: 'Nhiều quả, phong phú — như cây lựu. Sáng tạo, nhiều ý tưởng/con cái/thành quả.', career: 'sáng tạo, nông nghiệp, giáo dục, gia đình' },
  '大海水': { vi: 'Nước Biển Lớn', tone: 'cat', verse: '大海水广纳百川', fortune: 'Bao dung, sâu thẳm — như đại dương. «Hải nạp bách xuyên», tiếp nhận mọi thứ, phong phú.', career: 'thương mại quốc tế, hải sản, ngoại giao' },
};

/**
 * @param {object} R — kết quả analyze() đầy đủ
 * @returns {{ yearJiaZi, nayin, verse, vi, tone, fortune, career, summary }}
 */
export function guiguziFortune(R) {
  const pillars = R.chart?.pillars;
  const birthYear = R.chart?.input?.year;
  if (!birthYear || !pillars) return null;
  const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const YANG_GAN = ['甲','丙','戊','庚','壬'];

  // [loop 535] 4 TRỤ 納音 — cổ pháp 鬼谷子 dùng CẢ 年月日时, không chỉ năm.
  //   年 = 命 (base fate), 月 = 运 (fortune), 日 = 性 (personality), 时 = 果 (outcome).
  const PALACE = { year: '命 (cơ bản)', month: '运 (vận hành)', day: '性 (bản tính)', time: '果 (kết quả)' };
  const pillarReadings = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const gz = pillars[k]?.gan + pillars[k]?.zhi;
    if (!gz) continue;
    let ny = '';
    try { ny = ganZhiNayin(gz) || ''; } catch (e) {}
    const nyInfo = GUIGUZI_NAYIN[ny] || GUIGUZI_NAYIN[ny?.replace('砂','沙')] || { vi: ny, tone: 'bình', verse: '', fortune: '(chưa có thơ)', career: '' };
    const isYangG = YANG_GAN.includes(gz[0]);
    pillarReadings.push({
      palace: k, palaceVi: PALACE[k], gz, nayin: ny, vi: nyInfo.vi, tone: nyInfo.tone,
      verse: nyInfo.verse || '', fortune: nyInfo.fortune || '', career: nyInfo.career || '',
      isYang: isYangG,
      ganMod: isYangG ? 'Dương can → chủ động, dám hành động' : 'Âm can → tinh tế, kiên nhẫn',
    });
  }

  // Year pillar = main reading (giữ backward compat)
  const yearR = pillarReadings.find((p) => p.palace === 'year') || pillarReadings[0];
  const info = yearR ? {
    vi: yearR.vi, tone: yearR.tone, verse: yearR.verse,
    fortune: yearR.fortune, career: yearR.career,
  } : { vi: '?', tone: 'bình', verse: '', fortune: '(không tính được)', career: '' };
  const toneVi = info.tone === 'cat' ? 'CÁT' : info.tone === 'hung' ? 'HUNG' : 'BÌNH';
  const isYang = yearR?.isYang ?? true;
  const ganMod = isYang ? 'Dương can → chủ động, dám hành động' : 'Âm can → tinh tế, kiên nhẫn';

  // Overall tone: combine 4 pillars — majority cát = CÁT, majority hung = HUNG
  const allTones = pillarReadings.map((p) => p.tone);
  const catCount = allTones.filter((t) => t === 'cat').length;
  const hungCount = allTones.filter((t) => t === 'hung').length;
  const overallTone = catCount > hungCount ? 'CÁT' : hungCount > catCount ? 'HUNG' : 'BÌNH';

  // Full 4-pillar reading
  const reading4 = pillarReadings.map((p) =>
    `${p.palaceVi}: ${p.gz} nạp âm ${p.nayin} (${p.vi}) — ${p.fortune?.slice(0, 70) || ''}`
  ).join('\n');

  const summary = `${yearR?.gz || '?'} (${yearR?.nayin || '?'}/${info.vi}) — ${overallTone}. ${info.fortune?.slice(0, 60) || ''} ${ganMod}.`;

  return {
    yearJiaZi: yearR?.gz || '', nayin: yearR?.nayin || '', ...info, toneVi: overallTone,
    isYang, ganMod, pillarReadings, reading4, summary,
  };
}
