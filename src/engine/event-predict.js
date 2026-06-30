// ============================================================================
//  SỰ KIỆN LOẠI DỰ ĐOÁN 事件类型预测
//  Không chỉ cát/hung: "năm này XẢY RA loại việc gì" — theo thập thần năm × đại vận.
//  Nguồn: 渊海子平 十神应期, 滴天髓 岁运应事.
// ============================================================================
import { GAN, ZHI, TEN_GOD_VI, WX_VI, SHENG, KE, SHENG_BY, KE_BY, TEN_GOD_GROUP } from './constants.js';
import { tenGod } from './core.js';
import { Solar } from 'lunar-javascript';
import { scanBranchYingqi } from './yingqi-branch.js';

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
  // [loop 1003] 应期 (冲合 chi) — chiều kích hoạt thứ 2: năm này có «mở kho» Dụng/Kỵ không
  //   (bù cho 十神应期 theo lưu niên can). 2 chiều chéo xác nhận.
  const _yq = (() => { try { const o = scanBranchYingqi(R, startYear, years); return { cat: new Set(o.catYears || []), hung: new Set(o.hungYears || []), peak: new Set(o.peakYears || []), evt: (o.events || []) }; } catch (e) { return { cat: new Set(), hung: new Set(), peak: new Set(), evt: [] }; } })();
  const out = [];
  let lastDayun = '?'; // [loop 24] theo dõi 大运 năm cuối (activeDy giờ per-year trong loop)

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    // [loop 24 sửa bug CAO] giải active 大运 THEO NĂM (startYear), KHÔNG đóng băng cả cửa sổ.
    //   Trước đây age/activeDy tính 1 lần ngoài loop (dùng startYear) → năm vượt ranh thập niên
    //   bị ghép 大运 SAI. Giải theo startYear khớp analyzeLiunianDeep/forecast5.
    // [loop 544 FIX BUG3] khi năm ngoài mọi đại vận (quá khứ/tương lai xa), fallback [0]
    //   lấy đại vận TUỔI NHỎ cho năm tuổi già → ghép thập thần SAI. Nay lấy đại vận GẦN NHẤT.
    const _dyInRange = (dayun || []).find((d) => d && d.startYear != null && d.startYear <= year && year < d.startYear + 10);
    const _dyNearest = (dayun || []).filter((d) => d && d.startYear != null)
      .sort((a, b) => Math.abs(a.startYear - year) - Math.abs(b.startYear - year))[0];
    const activeDy = _dyInRange || _dyNearest || null;
    lastDayun = activeDy?.ganZhi || '?';
    const yearSolar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
    const lnGan = yearSolar.getLunar().getYearGan();
    const lnGod = tenGod(dayGan, lnGan);
    const lnInfo = GOD_EVENTS[lnGod] || { events: [], area: '?', vi: '?' };

    const dyGod = activeDy ? tenGod(dayGan, activeDy.gan) : '';
    const dyInfo = GOD_EVENTS[dyGod] || { events: [], area: '?', vi: '?' };

    // [loop 544 FIX BUG8] sameGod → lnInfo===dyInfo (cùng GOD_EVENTS entry), nên 2 nhánh ternary
    //   cũ giống hệt nhau (dead code). Đơn giản hoá + đánh dấu (x2) khi sự kiện trùng 2 nguồn.
    const sameGod = lnGod === dyGod;
    const combinedEvents = sameGod
      ? lnInfo.events.map((e) => `${e} (x2)`)
      : [...new Set([...lnInfo.events, ...dyInfo.events].map((e) => (lnInfo.events.includes(e) && dyInfo.events.includes(e) ? `${e} (x2)` : e)))];

    // [loop 490→544 FIX BUG4] tone favor-aware + ĐỐI XỨNG: trước đây `cat||cat→cat` nhưng
    //   `hung+neutral→neutral` (mất cảnh báo hung). Nay cộng trọng số cat=+1/hung=-1/neutral=0.
    const lnTone = _tone(lnGod), dyTone = _tone(dyGod);
    const _tw = { cat: 1, hung: -1, neutral: 0 };
    const _ts = (_tw[lnTone] || 0) + (_tw[dyTone] || 0);
    const tone = _ts >= 1 ? 'cat' : _ts <= -1 ? 'hung' : 'neutral';
    const toneVi = tone === 'cat' ? 'CÁT (thuận Dụng)' : tone === 'hung' ? 'HUNG (nghịch, kỵ)' : 'trung';
    // [loop 1003] 应期 冲/合 flag cho năm này (nếu là năm mở kho)
    const yqPeak = _yq.peak.has(year), yqCat = _yq.cat.has(year), yqHung = _yq.hung.has(year);
    const yqTag = yqPeak ? ' 👑岁运巅峰' : yqCat ? ' ✦mởKho Dụng' : yqHung ? ' ⚠mởKho Kỵ' : '';
    const advice = sameGod
      ? `Năm ${year}: ${lnInfo.vi} NHÂN ĐÔI (lưu niên = đại vận ${dyInfo.vi}) → ${lnInfo.area} cực mạnh: ${combinedEvents.join(', ')}. [${toneVi}]${yqTag}`
      : `Năm ${year}: Lưu niên ${lnInfo.vi} → ${lnInfo.area}. Đại vận ${dyInfo.vi} → ${dyInfo.area}. [${toneVi}]${yqTag}`;

    out.push({
      year, ganZhi: lnGan + yearSolar.getLunar().getYearZhi(),
      lnGod, lnGodVi: lnInfo.vi, lnArea: lnInfo.area, lnEvents: lnInfo.events, lnTone,
      dyGod, dyGodVi: dyInfo.vi, dyArea: dyInfo.area, dyEvents: dyInfo.events, dyTone,
      tone, sameGod, combinedEvents, advice,
      yingqiPeak: yqPeak, yingqiCat: yqCat, yingqiHung: yqHung,
    });
  }

  return { years: out, activeDayun: lastDayun };
}
