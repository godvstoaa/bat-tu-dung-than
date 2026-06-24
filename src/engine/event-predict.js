// ============================================================================
//  SỰ KIỆN LOẠI DỰ ĐOÁN 事件类型预测
//  Không chỉ cát/hung: "năm này XẢY RA loại việc gì" — theo thập thần năm × đại vận.
//  Nguồn: 渊海子平 十神应期, 滴天髓 岁运应事.
// ============================================================================
import { GAN, ZHI, TEN_GOD_VI, WX_VI } from './constants.js';
import { tenGod } from './core.js';
import { Solar } from 'lunar-javascript';

// Thập thần → loại sự kiện chính
const GOD_EVENTS = {
  正官: { events: ['thăng chức', 'danh vọng', 'quan quyền', 'kỷ luật', 'nữ: chồng'], area: 'Sự nghiệp', vi: 'Chính Quan' },
  七殺: { events: ['áp lực', 'tiểu nhân', 'bệnh', 'rủi ro', 'quyền lực đột ngột'], area: 'Sức khoẻ/Áp lực', vi: 'Thất Sát' },
  正財: { events: ['tiến tài đều', 'lương', 'nam: vợ'], area: 'Tài lộc', vi: 'Chính Tài' },
  偏財: { events: ['tài lớn bất ngờ', 'đầu tư', 'hao lớn', 'nam: cha/vợ thứ'], area: 'Tài lộc biến', vi: 'Thiên Tài' },
  正印: { events: ['bằng cấp', 'quý nhân', 'nhà cửa', 'mẹ', 'bảo vệ'], area: 'Học vấn/Bất động sản', vi: 'Chính Ấn' },
  偏印: { events: ['huyền học', 'cô lập', 'biến 怪', 'đoạt thực'], area: 'Tâm linh/Nội tâm', vi: 'Thiên Ấn' },
  食神: { events: ['tài hoa', 'phúc lộc', 'ẩm thực', 'nữ: con'], area: 'Sáng tạo/Phúc', vi: 'Thực Thần' },
  傷官: { events: ['sáng tạo bùng nổ', 'khẩu thiệp', 'thay đổi', 'nữ: con/phu'], area: 'Biến động/Sáng tạo', vi: 'Thương Quan' },
  比肩: { events: ['bạn bè', 'cạnh tranh', 'độc lập', 'hợp tác'], area: 'Quan hệ/Xã hội', vi: 'Tỷ Kiên' },
  劫財: { events: ['hao tiền', 'tranh giành', 'đầu cơ', 'hôn nhân biến'], area: 'Tài lộc hao', vi: 'Kiếp Tài' },
};

/**
 * @returns {{ years:[{year, ganZhi, lnGod, lnGodVi, lnArea, dyGod, dyGodVi, dyArea,
 *            combinedEvents, advice}] }}
 */
export function predictEvents(R, startYear, years = 5) {
  const { chart, dayun } = R;
  const dayGan = chart.dayGan;
  const age = startYear - chart.input.year;
  const activeDy = (dayun || []).find((d) => age >= d.startAge && age < d.startAge + 10) || (dayun || [])[0];
  const out = [];

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    const yearSolar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
    const lnGan = yearSolar.getLunar().getYearGan();
    const lnGod = tenGod(dayGan, lnGan);
    const lnInfo = GOD_EVENTS[lnGod] || { events: [], area: '?', vi: '?' };

    const dyGod = activeDy ? tenGod(dayGan, activeDy.gan) : '';
    const dyInfo = GOD_EVENTS[dyGod] || { events: [], area: '?', vi: '?' };

    // Combined events: lưu niên + đại vận giao thoa
    const combinedEvents = [...lnInfo.events];
    // Nếu lưu niên + đại vận CÙNG thập thần → nhân đôi
    const sameGod = lnGod === dyGod;
    // Nếu lưu niên sinh/khắc đại vận thập thần
    const lnWx = GAN[lnGan].wx;
    const dyWx = activeDy ? GAN[activeDy.gan].wx : '';
    let cross = '';
    if (lnWx && dyWx) {
      if (lnWx === dyWx) cross = `${lnInfo.vi} nhân đôi (lưu niên + đại vận cùng sao)`;
      // Don't over-compute — keep practical
    }

    const advice = sameGod
      ? `Năm ${year}: ${lnInfo.vi} NHÂN ĐÔI (lưu niên = đại vận) → ${lnInfo.area} cực mạnh: ${lnInfo.events.join(', ')}.`
      : `Năm ${year}: Lưu niên ${lnInfo.vi} → ${lnInfo.area}. Đại vận ${dyInfo.vi} → ${dyInfo.area}. Chỗ giao thoa: ${lnInfo.area} + ${dyInfo.area}.`;

    out.push({
      year, ganZhi: lnGan + yearSolar.getLunar().getYearZhi(),
      lnGod, lnGodVi: lnInfo.vi, lnArea: lnInfo.area, lnEvents: lnInfo.events,
      dyGod, dyGodVi: dyInfo.vi, dyArea: dyInfo.area, dyEvents: dyInfo.events,
      sameGod, combinedEvents, advice,
    });
  }

  return { years: out, activeDayun: activeDy?.ganZhi || '?' };
}
