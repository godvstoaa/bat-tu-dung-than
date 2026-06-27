// ============================================================================
//  SỰ KIỆN LOẠI DỰ ĐOÁN 事件类型预测
//  Không chỉ cát/hung: "năm này XẢY RA loại việc gì" — theo thập thần năm × đại vận.
//  Nguồn: 渊海子平 十神应期, 滴天髓 岁运应事.
// ============================================================================
import { GAN, ZHI, TEN_GOD_VI, WX_VI, SHENG, KE, SHENG_BY, KE_BY, TEN_GOD_GROUP } from './constants.js';
import { tenGod } from './core.js';
import { Solar } from 'lunar-javascript';

// [loop 490] god-group → nguyên tố đối với Nhật Chủ (để xét thuận Dụng hay nghịch Kỵ).
const GROUP_ELEM = (dmWx) => ({ ti: dmWx, yin: SHENG_BY[dmWx], shi: SHENG[dmWx], cai: KE[dmWx], guan: KE_BY[dmWx] });

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
  const dmWx = chart.dayMaster?.wx;
  const yong = R.yong || {};
  // [loop 490] favor-aware: tone cat/hung theo god-element có phải Dụng/Hỷ hay Kỵ/Thù.
  const _dung = new Set([yong.primary, yong.xi].filter(Boolean));
  const _ji = new Set([yong.ji, yong.chou].filter(Boolean));
  const _GEL = GROUP_ELEM(dmWx);
  const _tone = (god) => { const e = _GEL[TEN_GOD_GROUP[god]]; if (!e) return 'neutral'; return _dung.has(e) ? 'cat' : _ji.has(e) ? 'hung' : 'neutral'; };
  const out = [];
  let lastDayun = '?'; // [loop 24] theo dõi 大运 năm cuối (activeDy giờ per-year trong loop)

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    // [loop 24 sửa bug CAO] giải active 大运 THEO NĂM (startYear), KHÔNG đóng băng cả cửa sổ.
    //   Trước đây age/activeDy tính 1 lần ngoài loop (dùng startYear) → năm vượt ranh thập niên
    //   bị ghép 大运 SAI. Giải theo startYear khớp analyzeLiunianDeep/forecast5.
    const activeDy = (dayun || []).find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10) || (dayun || [])[0];
    lastDayun = activeDy?.ganZhi || '?';
    const yearSolar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
    const lnGan = yearSolar.getLunar().getYearGan();
    const lnGod = tenGod(dayGan, lnGan);
    const lnInfo = GOD_EVENTS[lnGod] || { events: [], area: '?', vi: '?' };

    const dyGod = activeDy ? tenGod(dayGan, activeDy.gan) : '';
    const dyInfo = GOD_EVENTS[dyGod] || { events: [], area: '?', vi: '?' };

    // Combined events: lưu niên + đại vận giao thoa [loop 24] gộp thật sự cả 2 nguồn
    const sameGod = lnGod === dyGod;
    const combinedEvents = sameGod
      ? [...new Set([...lnInfo.events, ...dyInfo.events])] // cùng sao → nhân đôi lực, gộp sự kiện
      : [...new Set([...lnInfo.events, ...dyInfo.events])];

    // [loop 490] tone favor-aware: god-element là Dụng/Hỷ (cát) hay Kỵ/Thù (hung).
    const lnTone = _tone(lnGod), dyTone = _tone(dyGod);
    const tone = lnTone === 'cat' || dyTone === 'cat' ? 'cat' : lnTone === 'hung' && dyTone === 'hung' ? 'hung' : 'neutral';
    const toneVi = tone === 'cat' ? 'CÁT (thuận Dụng)' : tone === 'hung' ? 'HUNG (nghịch, kỵ)' : 'trung';
    const advice = sameGod
      ? `Năm ${year}: ${lnInfo.vi} NHÂN ĐÔI (lưu niên = đại vận ${dyInfo.vi}) → ${lnInfo.area} cực mạnh: ${combinedEvents.join(', ')}. [${toneVi}]`
      : `Năm ${year}: Lưu niên ${lnInfo.vi} → ${lnInfo.area}. Đại vận ${dyInfo.vi} → ${dyInfo.area}. [${toneVi}]`;

    out.push({
      year, ganZhi: lnGan + yearSolar.getLunar().getYearZhi(),
      lnGod, lnGodVi: lnInfo.vi, lnArea: lnInfo.area, lnEvents: lnInfo.events, lnTone,
      dyGod, dyGodVi: dyInfo.vi, dyArea: dyInfo.area, dyEvents: dyInfo.events, dyTone,
      tone, sameGod, combinedEvents, advice,
    });
  }

  return { years: out, activeDayun: lastDayun };
}
