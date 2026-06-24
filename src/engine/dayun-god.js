// ============================================================================
//  ĐẠI VẬN THẬP THẦN 大运十神 — CHỦ ĐỀ MỖI THẬP NIÊN
//  Cho mỗi đại vận: 十 thần của can đại vận vs Nhật Chủ → chủ đề 10 năm.
//  Nguồn: 滴天髓 运论, 渊海子平 大运十神.
// ============================================================================
import { tenGod } from './core.js';
import { TEN_GOD_VI } from './constants.js';

const GOD_DECADE = {
  比肩: { vi: 'Tỷ Kiên', theme: 'độc lập, cạnh tranh, bằng hữu', cat: 'mid', detail: 'Thập niên tự lập, mở rộng quan hệ bạn bè. Nếu thân nhược → được trợ; vượng → cạnh tranh, hao tài.' },
  劫財: { vi: 'Kiếp Tài', theme: 'hao tiền, tranh giành, mạo hiểm', cat: 'hung', detail: 'Thập niên dễ 破财, đầu cơ mạo hiểm, hôn nhân biến. PHẢI giữ tiền chặt, tránh cho vay/đầu cơ lớn.' },
  食神: { vi: 'Thực Thần', theme: 'tài hoa, phúc lộc, sáng tạo, bình順', cat: 'cat', detail: 'Thập niên tốt — tài hoa sinh tài, phúc lộc, sức khoẻ ổn. Nên phát triển kỹ năng/nghệ thuật.' },
  傷官: { vi: 'Thương Quan', theme: 'phá cách, sáng tạo, khẩu thiệp, biến động', cat: 'volatile', detail: 'Thập niên biến động — sáng tạo mạnh nhưng dễ khẩu thiệp, phản nghịch, hôn nhân nữ khắc phu. Cần Ấn chế.' },
  偏財: { vi: 'Thiên Tài', theme: 'tài lớn bất ngờ, biến động tài', cat: 'volatile', detail: 'Thập niên tài vận biến động lớn — cơ hội tài lớn NHƯNG cũng dễ hao lớn. Nam: đào hoa.' },
  正財: { vi: 'Chính Tài', theme: 'tiến tài đều, ổn định, tiết kiệm', cat: 'cat', detail: 'Thập niên tài lộc ổn định, nên tích luỹ. Nam: gặp bạn đời tốt (Tài = sao vợ).' },
  七殺: { vi: 'Thất Sát', theme: 'áp lực, tiểu nhân, quyền lực, rủi ro', cat: 'hung', detail: 'Thập niên áp lực lớn — tiểu nhân, bệnh, rủi ro. NHƯNG có Ấn/Thực chế → hóa sát vi quyền, thăng tiến mạnh.' },
  正官: { vi: 'Chính Quan', theme: 'thăng tiến, danh vọng, quy củ, quý nhân', cat: 'cat', detail: 'Thập niên sự nghiệp sáng — thăng tiến, danh vọng, quý nhân. Nữ: gặp chồng tốt.' },
  偏印: { vi: 'Thiên Ấn', theme: 'cô lập, huyền học, biến 怪, học thuật phi chính thống', cat: 'mid', detail: 'Thập niên thiên về nội tâm, huyền học/tôn giáo. Nếu "kiêu đoạt thực" → hao tài nguyên. Cần Tài chế.' },
  正印: { vi: 'Chính Ấn', theme: 'học vấn, quý nhân, ấm no, bảo vệ', cat: 'cat', detail: 'Thập niên được bảo vệ/nâng đỡ — học vấn tốt, quý nhân, ấm no, bằng cấp.' },
};

/**
 * @returns {{ items:[{ ganZhi, startAge, god, godVi, theme, cat, detail, rating }] }}
 */
export function dayunGodMeaning(chart, dayun) {
  const dayGan = chart.dayGan;
  const items = (dayun || []).map((d) => {
    const god = tenGod(dayGan, d.gan);
    const info = GOD_DECADE[god] || { vi: god, theme: '?', cat: 'mid', detail: '' };
    return {
      ganZhi: d.ganZhi, startAge: d.startAge, startYear: d.startYear, rating: d.rating,
      god, godVi: TEN_GOD_VI[god] || god,
      theme: info.theme, cat: info.cat, detail: info.detail,
    };
  });
  return { items };
}

export { GOD_DECADE };
