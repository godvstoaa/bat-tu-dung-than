// ============================================================================
//  四德日 — TỨ ĐỨỚC NHẬT (岁德/岁德合/月德/月德合) 黄历择日
//  "Nào ngoài 天赦 còn ngày ĐỨỚC nào cát? Ngày có đức thần = vạn ác tiêu trừ."
//  * 四德 là 4 sao "Đức" chủ ngày CÁT — «tại đức thần sở tại, vạn ác tiềm hình».
//    Dùng cho 择日 (cầu phúc/ký kết/hôn giá/dọn nhà) — bổ 天赦日 (đại cát tối cao).
//  * 岁德 (theo NĂM can — dương can của ngũ hợp đôi): 甲己年→甲, 乙庚→庚, 丙辛→丙, 丁壬→壬, 戊癸→戊.
//  * 岁德合 (đối can ngũ hợp của 岁德): 甲己→己, 乙庚→乙, 丙辛→辛, 丁壬→丁, 戊癸→癸.
//  * 月德 (theo THÁNG chi — tam hợp): 寅午戌→丙, 申子辰→壬, 巳酉丑→庚, 亥卯未→甲.
//  * 月德合 (ngũ hợp của 月德): 丙→辛, 壬→丁, 庚→乙, 甲→己.
//  * Ngày có can = 1 trong 4 đức (của năm + tháng chứa ngày) → ĐỨỚC NHẬT, cát.
//  Khác zheri-stars (天赦/四废/十恶): module này = 4 ĐỨỚC theo can ngày vs năm+tháng.
//  Nguồn: 钦定协纪辨方书 四德, 福山堂 黄历神煞, 永乐大典 择吉.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI } from './constants.js';

const GAN5HE = { 甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊' };
const YANG_OF_PAIR = { 甲: '甲', 己: '甲', 乙: '庚', 庚: '庚', 丙: '丙', 辛: '丙', 丁: '壬', 壬: '壬', 戊: '戊', 癸: '戊' };
const SANHE = { 寅: '丙', 午: '丙', 戌: '丙', 申: '壬', 子: '壬', 辰: '壬', 巳: '庚', 酉: '庚', 丑: '庚', 亥: '甲', 卯: '甲', 未: '甲' };
const DE_VI = { suiDe: 'Tuế Đức', suiDeHe: 'Tuế Đức Hợp', yueDe: 'Nguyệt Đức', yueDeHe: 'Nguyệt Đức Hợp' };

function dayGanZhi(year, month, day) {
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const l = s.getLunar();
  return { dGan: l.getDayGan(), dZhi: l.getDayZhi(), mZhi: l.getMonthZhi(), solar: s.toYmd(), lunar: `${l.getMonthInChinese()}月${l.getDayInChinese()}` };
}

function deOf(yearGan, monthZhi) {
  const suiDe = YANG_OF_PAIR[yearGan];
  const suiDeHe = GAN5HE[suiDe];
  const yueDe = SANHE[monthZhi];
  const yueDeHe = GAN5HE[yueDe];
  return { suiDe, suiDeHe, yueDe, yueDeHe };
}

/**
 * Phân tích 1 ngày: rơi vào đức nào.
 * @returns {{ solar, lunar, dayGanZhi, hits:[{key,keyVi,note}], isDeRi }}
 */
export function analyzeDeRi(year, month, day) {
  const { dGan, mZhi, solar, lunar } = dayGanZhi(year, month, day);
  const s = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const yGan = s.getLunar().getEightChar().getYearGan();
  const de = deOf(yGan, mZhi);
  const hits = [];
  if (dGan === de.suiDe) hits.push({ key: 'suiDe', keyVi: DE_VI.suiDe, note: `can ngày ${dGan} = Tuế Đức (năm ${yGan}) — cát, vạn ác tiêu trừ.` });
  if (dGan === de.suiDeHe) hits.push({ key: 'suiDeHe', keyVi: DE_VI.suiDeHe, note: `can ngày ${dGan} = Tuế Đức Hợp — cát.` });
  if (dGan === de.yueDe) hits.push({ key: 'yueDe', keyVi: DE_VI.yueDe, note: `can ngày ${dGan} = Nguyệt Đức (tháng ${mZhi}) — cát, hoá hung.` });
  if (dGan === de.yueDeHe) hits.push({ key: 'yueDeHe', keyVi: DE_VI.yueDeHe, note: `can ngày ${dGan} = Nguyệt Đức Hợp — cát.` });
  return { solar, lunar, dayGanZhi: dGan + dayGanZhi(year, month, day).dZhi, hits, isDeRi: hits.length > 0 };
}

/**
 * Quét 1 năm: liệt kê ngày có ≥2 đức (cát mạnh) + thống kê.
 */
export function deRiInYear(year) {
  const strong = []; // ≥2 đức
  let total = 0;
  const d = new Date(year, 0, 1);
  for (let i = 0; i < 366; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    if (y !== year) break;
    let info;
    try { info = analyzeDeRi(y, m, dd); } catch (e) { d.setDate(d.getDate() + 1); continue; }
    if (info.isDeRi) {
      total++;
      if (info.hits.length >= 2) strong.push({ solar: info.solar, lunar: info.lunar, ganZhi: info.dayGanZhi, de: info.hits.map((h) => h.keyVi).join('+') });
    }
    d.setDate(d.getDate() + 1);
  }
  return { year, totalDeRi: total, strongDeRi: strong, summary: `Năm ${year}: ${total} ngày có đức (Tuế/Nguyệt Đức + Hợp), ${strong.length} ngày ≥2 đức (cát mạnh, ưu tiên làm việc lớn).` };
}

/** 3 ngày đức tới (công cụ择日). */
export function nextDeRi(fromYear, fromMonth, fromDay, count = 3) {
  const out = [];
  const d = new Date(fromYear, fromMonth - 1, fromDay);
  for (let i = 0; i < 400 && out.length < count; i++) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    try {
      const info = analyzeDeRi(y, m, dd);
      if (info.isDeRi) out.push({ solar: info.solar, lunar: info.lunar, ganZhi: info.dayGanZhi, de: info.hits.map((h) => h.keyVi).join('+') });
    } catch (e) {}
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export { YANG_OF_PAIR, SANHE, DE_VI };
