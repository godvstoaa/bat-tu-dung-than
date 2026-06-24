// ============================================================================
//  黄历择日神煞 — NGÀY ĐẶC BIỆT (天赦 / 四废 / 十恶大败)
//  "Ngày nào ĐẠI CÁT (làm gì cũng được)? Ngày nào ĐẠI HUNG (kiêng)?" — công cụ择日.
//  Khác zheri.js (12 trực建除 + thập thần + Dụng): module này = 3 LOẠI NGÀY ĐẶC BIỆT
//    cổ pháp, độc lập lá số — áp dụng cho MỌI người.
//  * 天赦日 (大吉, 百无禁忌): 春戊寅 · 夏甲午 · 秋戊申 · 冬甲子. ~5-6 ngày/năm.
//    → 祈福/祭祀/消灾/化官非/嫁娶/搬家/开业 đều宜; sinh ngày này → "phùng hung hoá cát".
//  * 四废日 (大凶, 百事不宜): hành ngày bị mùa giam tù → "tác sự bất thành".
//  * 十恶大败日 (凶, hao tán): 10 trụ ngày cố định → kỵ khai trương/cầu tài/hôn giá/xuất hành.
//  Nguồn: 永乐大典 卷20121, 福山堂 神煞口诀, 算准网万年历 (2026天赦).
// ============================================================================
import { Solar } from 'lunar-javascript';

// Mùa theo nguyệt chi
const SEASON = { 寅: 'xuân', 卯: 'xuân', 辰: 'xuân', 巳: 'hạ', 午: 'hạ', 未: 'hạ', 申: 'thu', 酉: 'thu', 戌: 'thu', 亥: 'đông', 子: 'đông', 丑: 'đông' };

// 天赦日: 1 trụ/mùa
const TIAN_SHE = { xuân: '戊寅', hạ: '甲午', thu: '戊申', đông: '甲子' };
// 四废日: 2 trụ/mùa (hành bị mùa khắc/chom)
const SI_FEI = {
  xuân: ['庚申', '辛酉'],   // kim bị xuân mộc (mộc vượng, kim tù)
  hạ: ['壬子', '癸亥'],     // thuỷ bị hạ hoả
  thu: ['甲寅', '乙卯'],     // mộc bị thu kim
  đông: ['丙午', '丁巳'],   // hoả bị đông thuỷ
};
// 十恶大败日: 10 trụ cố định (天库空亡 → cầu tài lạc không)
const E_DA_BAI = ['甲辰', '乙巳', '丙申', '丁亥', '戊戌', '己丑', '庚辰', '辛巳', '壬申', '癸亥'];

const MEANING = {
  tianshe: '✅ 天赦日 — ĐẠI CÁT, «Bách vô cấm kỵ». Trời tha thứ, hoá giải quan phi/hiểm hoạ/tội lỗi. Cứ việc lớn (khai trương, dọn nhà, cưới, cầu phúc, ký kết, chữa bệnh, giải ách) đều ĐẠI CÁT. Sinh ngày này → cả đời "phùng hung hoá cát".',
  sifei: '❌ 四废日 — ĐẠI HUNG, hành ngày bị mùa giam tù, khí lực tàn phế. «Tác sự bất thành»: làm gì cũng đổ vỡ, trì trệ. KỴ khai trương/dọn nhà/cưới/ký kết/xuất hành/động thổ.',
  edabai: '⚠ 十恶大败日 — HUNG, «thiên khố không vong»: ngày cầu tài tất lạc không, hao tán. KỴ khai trương/mở kho/cầu tài/hôn giá/xuất hành/đầu tư. Nếu buộc phải làm → chọn giờ天赦/天乙 hoá giải.',
};

function solarDay(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const l = s.getLunar();
  return { ganZhi: l.getDayGan() + l.getDayZhi(), mZhi: l.getMonthZhi(), solar: s.toYmd(), lunarStr: `${l.getMonthInChinese()}月${l.getDayInChinese()}` };
}

/**
 * Phân tích 1 ngày cụ thể: rơi vào sao đặc biệt nào.
 * @returns {{ solar, lunar, ganZhi, special:[{type,typeVi,severity,meaning}] }}
 */
export function analyzeDaySpecial(year, month, day) {
  const { ganZhi, mZhi, solar, lunarStr } = solarDay(year, month, day);
  const season = SEASON[mZhi];
  const special = [];
  if (season && TIAN_SHE[season] === ganZhi) special.push({ type: '天赦', typeVi: 'Thiên Xá', severity: 10, meaning: MEANING.tianshe });
  if (season && SI_FEI[season].includes(ganZhi)) special.push({ type: '四废', typeVi: 'Tứ Phế', severity: -8, meaning: MEANING.sifei });
  if (E_DA_BAI.includes(ganZhi)) special.push({ type: '十恶大败', typeVi: 'Thập Ác Đại Bại', severity: -7, meaning: MEANING.edabai });
  return { solar, lunar: lunarStr, ganZhi, special };
}

/**
 * Quét 1 năm: liệt kê tất cả 天赦/四废/十恶大败日.
 */
export function specialDays(year) {
  const tianshe = [], sifei = [], edabai = [];
  const d = new Date(year, 0, 1);
  for (let i = 0; i < 366; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    if (y !== year) break;
    let info;
    try { info = analyzeDaySpecial(y, m, dd); } catch (e) { d.setDate(d.getDate() + 1); continue; }
    info.special.forEach((s) => {
      const e2 = { solar: info.solar, lunar: info.lunar, ganZhi: info.ganZhi, ...s };
      if (s.type === '天赦') tianshe.push(e2);
      if (s.type === '四废') sifei.push(e2);
      if (s.type === '十恶大败') edabai.push(e2);
    });
    d.setDate(d.getDate() + 1);
  }
  return {
    year, tianshe, sifei, edabai,
    summary: `Năm ${year}: ${tianshe.length} 天赦日 [ĐẠI CÁT — 百无禁忌, làm việc lớn tốt nhất], ${sifei.length} 四废日 [đại hung, kỵ động tác], ${edabai.length} 十恶大败日 [tính lại cả năm — kỵ CẦU TÀI/khai trương/đầu tư, các việc khác không kỵ].`,
  };
}

/**
 * Tìm N 天赦日 tiếp theo kể từ hôm nay (công cụ hành động cho AI/user).
 */
export function nextTianShe(fromYear, fromMonth, fromDay, count = 3) {
  const out = [];
  const d = new Date(fromYear, fromMonth - 1, fromDay);
  for (let i = 0; i < 400 && out.length < count; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    try {
      const info = analyzeDaySpecial(y, m, dd);
      if (info.special.some((s) => s.type === '天赦')) out.push({ solar: info.solar, lunar: info.lunar, ganZhi: info.ganZhi });
    } catch (e) {}
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export { TIAN_SHE, E_DA_BAI };
