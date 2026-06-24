// ============================================================================
//  黄道十二神 (Hoàng Đạo Thập Nhị Thần) — 12 DEITIES YELLOW/BLACK ROAD
//  Hệ cổ điển quyết định NGÀY cát/hung intrinsically (黄道吉日/黑道凶日).
//  KHÁC với 建除12直 (trong daily.js / tongsheng.js): hệ này dựa vào 12 thần
//  (青龙/明堂/天刑/...) luân chuyển theo 月建 + 日支, không phải trực 建/除/...
//
//  Phương pháp: 起青龙诀 —「寅申须加子, 卯酉却在寅, 辰戌龙位上, 巳亥午上存,
//    子午临申地, 丑未戌相寻」. Các tháng ĐỐI XUNG (6 cặp) CHUNG 1 ngày chi 青龙; 6 vị
//    青龙 đều là chi DƯƠNG (子/寅/辰/午/申/戌). [loop 22 sửa bug CAO: trước đây dùng
//    công thức tuyến tính (monthIdx+10)%12 — không phải cổ quyết, sai mọi verdict 黄/黑道]
//  Từ 青龙 (offset 0), 12 thần tuần hoàn qua 12 địa chi theo thứ tự:
//   青龙→明堂→天刑→朱雀→金匮→天德→白虎→玉堂→天牢→玄武→司命→勾陈
//
//  Nguồn: 协纪辨方书 / 通胜 / 百度百科 "黄道吉日" / "十二值日".
// ============================================================================
import { Solar } from 'lunar-javascript';
import { ZHI } from './constants.js';

const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const zhiIdx = (z) => ZHI_ORDER.indexOf(z);

// [loop 22] 起青龙诀 — 6 cặp tháng đối xung共用 1 ngày chi 青龙 (toàn chi dương).
//   寅申→子, 卯酉→寅, 辰戌→辰, 巳亥→午, 子午→申, 丑未→戌.
const QL_BY_MONTH = {
  寅: '子', 申: '子', 卯: '寅', 酉: '寅', 辰: '辰', 戌: '辰',
  巳: '午', 亥: '午', 子: '申', 午: '申', 丑: '戌', 未: '戌',
};

// Thứ tự 12 thần tuần hoàn (offset 0..11)
const DEITIES = [
  { zh: '青龙', vi: 'Thanh Long', tone: 'cat',   domain: 'tài lộc, hỉ sự',     meaning: 'Thần cát tối quý của hoàng đạo — mang lại tài lộc, hỉ庆, vạn sự hanh thông.' },
  { zh: '明堂', vi: 'Minh Đường', tone: 'cat',   domain: 'sự nghiệp, danh vọng', meaning: 'Cát — chủ sự nghiệp hiển hách, danh vọng, gặp quý nhân phù trợ.' },
  { zh: '天刑', vi: 'Thiên Hình', tone: 'hung',  domain: 'pháp luật, hình phạt', meaning: 'Hung — chủ hình thương, kiện tụng, pháp luật; kỵ cưới hỏi/ký kết.' },
  { zh: '朱雀', vi: 'Chu Tước',   tone: 'hung',  domain: 'khẩu thiệp, thị phi', meaning: 'Hung — chủ khẩu thiệp, thị phi, văn thư rắc rối; kỵ tranh luận.' },
  { zh: '金匮', vi: 'Kim Quỹ',   tone: 'cat',   domain: 'tài sản, tích trữ',  meaning: 'Cát — chủ tài sản tích trữ, được của; thuận buôn bán, thu ngân.' },
  { zh: '天德', vi: 'Thiên Đức', tone: 'cat',   domain: 'phúc đức, giải tai', meaning: 'Cát — chủ phúc đức, giải tai ách, gặp之事皆 thành; vạn sự cát.' },
  { zh: '白虎', vi: 'Bạch Hổ',   tone: 'hung',  domain: 'thương tích, huyết quang', meaning: 'Hung — chủ huyết quang, thương tích, tai nạn; kỵ động thổ, phẫu thuật.' },
  { zh: '玉堂', vi: 'Ngọc Đường', tone: 'cat',   domain: 'quý nhân, học vấn', meaning: 'Cát — chủ quý nhân, học vấn, thi cử; thuận tiến thân, cầu danh.' },
  { zh: '天牢', vi: 'Thiên Lao', tone: 'hung',  domain: 'giam cầm, bế tắc', meaning: 'Hung — chủ giam cầm, bế tắc, lỡ việc; kỵ khởi sự mới, viễn hành.' },
  { zh: '玄武', vi: 'Huyền Vũ',  tone: 'hung',  domain: 'trộm cắp, lừa gạt', meaning: 'Hung — chủ trộm cắp, lừa gạt, hư không; kỵ giao tiền, đầu tư.' },
  { zh: '司命', vi: 'Tư Mệnh',  tone: 'cat',   domain: 'sức khỏe, sinh hoạt', meaning: 'Cát — chủ sức khỏe, sinh hoạt bình an; thuận tĩnh toạ, cúng tế.' },
  { zh: '勾陈', vi: 'Câu Trần',  tone: 'hung',  domain: 'trì trệ, dây dưa', meaning: 'Hung — chủ trì trệ, dây dưa, đấu tranh; kỵ khởi công, mưu sự.' },
];

/**
 * Tính thần Hoàng/Hắc Đạo cho 1 ngày dương lịch.
 *
 * Phương pháp 起青龙诀 (cổ quyết chính thống) [loop 22 sửa]:
 *  - 6 cặp tháng ĐỐI XUNG共用 1 ngày chi 青龙 (toàn chi dương):
 *    寅申→子日, 卯酉→寅日, 辰戌→辰日, 巳亥→午日, 子午→申日, 丑未→戌日.
 *  - Từ 青龙 (offset 0), 12 thần tuần hoàn qua 12 chi theo thứ tự đã định.
 *
 * Công thức:
 *   qinglongZhiIdx = zhiIdx(QL_BY_MONTH[monthZhi])
 *   offset = (zhiIdx(dayZhi) - qinglongZhiIdx + 12) % 12
 *   deity = DEITIES[offset]
 *
 * @param {number} year  - năm dương lịch (vd: 2026)
 * @param {number} month - tháng dương lịch 1..12
 * @param {number} day   - ngày 1..31
 * @returns {{
 *   solar: string, lunar: string, dayGanZhi: string, monthZhi: string, dayZhi: string,
 *   deity: string, deityVi: string, tone: 'cat'|'hung', road: 'yellow'|'black',
 *   meaning: string, domain: string, offset: number, advice: string
 * }}
 */
export function huangdao12(year, month, day) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();
  const dZhi = lunar.getDayZhi();
  const mZhi = lunar.getMonthZhi();
  const dGan = lunar.getDayGan();

  // Vị trí 青龙 (offset 0) trong tháng này — theo 起青龙诀 (6 cặp đối xung, [loop 22 sửa])
  const qinglongZhiIdx = zhiIdx(QL_BY_MONTH[mZhi]);
  const offset = ((zhiIdx(dZhi) - qinglongZhiIdx) + 12) % 12;
  const d = DEITIES[offset];

  const isYellow = d.tone === 'cat';
  const road = isYellow ? 'yellow' : 'black';

  let advice;
  if (isYellow) {
    advice = `${d.zh} (${d.vi}) — HOÀNG ĐẠO (cát). Thuận cho việc liên quan đến "${d.domain}". Nền ngày tốt, có thể tiến thủ việc vừa phải trong lĩnh vực này.`;
  } else {
    advice = `${d.zh} (${d.vi}) — HẮC ĐẠO (hung). Chuyên chủ "${d.domain}". Hạn chế việc lớn, đặc biệt kỵ lĩnh vực "${d.domain}"; giữ ổn định, chờ ngày khác.`;
  }

  return {
    solar: solar.toYmd(),
    lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    dayGanZhi: dGan + dZhi,
    monthZhi: mZhi,
    dayZhi: dZhi,
    deity: d.zh,
    deityVi: d.vi,
    tone: d.tone,
    road,
    meaning: d.meaning,
    domain: d.domain,
    offset,
    advice,
  };
}

/**
 * Quét cả năm, đếm số ngày hoàng đạo (黄道) vs hắc đạo (黑道).
 * Vì 12 thần chia đều 6/6 và tuần hoàn theo chi ngày, phân phối ~50/50.
 *
 * @param {number} year
 * @returns {{
 *   year, total, yellow, black,
 *   perDeity: Array<{zh, vi, tone, count}>,
 *   yellowDays: string[], blackDays: string[],
 *   distribution: {yellowPct: number, blackPct: number}
 * }}
 */
export function huangdaoInYear(year) {
  const d = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const counts = Object.fromEntries(DEITIES.map((x) => [x.zh, 0]));
  let yellow = 0, black = 0, total = 0;
  const yellowDays = [], blackDays = [];

  while (d < end) {
    const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
    const r = huangdao12(y, m, day);
    counts[r.deity]++;
    total++;
    if (r.tone === 'cat') { yellow++; yellowDays.push(r.solar); }
    else { black++; blackDays.push(r.solar); }
    d.setDate(d.getDate() + 1);
  }

  const perDeity = DEITIES.map((x) => ({ zh: x.zh, vi: x.vi, tone: x.tone, count: counts[x.zh] }));

  return {
    year,
    total,
    yellow,
    black,
    perDeity,
    yellowDays,
    blackDays,
    distribution: {
      yellowPct: total ? Math.round((yellow / total) * 1000) / 10 : 0,
      blackPct: total ? Math.round((black / total) * 1000) / 10 : 0,
    },
  };
}

// ---- UI helper (render thẻ HTML cho 1 ngày) ----
// Trả về HTML string dùng được với class định nghĩa sẵn (ln-rate rate-cat/rate-hung, zh, hint...)
export function renderHuangdaoCard(r) {
  const cls = r.tone === 'cat' ? 'rate-cat' : 'rate-hung';
  const roadVi = r.road === 'yellow' ? 'Hoàng đạo (cát)' : 'Hắc đạo (hung)';
  return `
    <div class="zr-head"><b>${r.solar}</b> (ÂL ${r.lunar}) · <span class="zh">${r.dayGanZhi}</span> · 黄道神 <b class="zh">${r.deity}</b> (${r.deityVi}) <span class="ln-rate ${cls}">${roadVi}</span></div>
    <div class="zr-head" style="font-size:12.5px;color:var(--muted)">Chủ sự: <b>${r.domain}</b> · ngày ${r.dayZhi}(${ZHI[r.dayZhi]?.vi || r.dayZhi}) tháng ${r.monthZhi}(${ZHI[r.monthZhi]?.vi || r.monthZhi}) · offset ${r.offset}/12</div>
    <p class="zr-advice">${r.advice}</p>
    <p class="hint">${r.meaning}</p>`;
}

// Export constants cho selftest/external
export { DEITIES, ZHI_ORDER };
