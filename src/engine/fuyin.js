// ============================================================================
//  伏吟 反吟 — PHỤC NGÂM / PHẢN NGÂM (FUYIN / FANYIN)
//  "Năm nào trùng trụ / xung trụ → biến cố?" — classical timing warning.
//  * Phục Ngâm (伏吟): can-chi TRÙNG hoàn toàn 1 trụ nguyên cục → đình trệ,
//    lặp lại, u buồn.  * Phản Ngâm (反吟/返吟): THIÊN KHẮC ĐỊA XUNG vs 1 trụ →
//    biến động dữ dội, ly tán.  Cổ quyết: «反吟伏吟泪淋淋, 不伤自己损他人».
//  Khác dayun-check (chỉ 大运×日柱, note nhỏ): module này quét
//    (a) 4 trụ nguyên cục × nhau, (b) 流年 × 4 trụ, (c) 大运 × 4 trụ —
//    + ý nghĩa LỤC THÂN theo vị trí trụ (niên=tổ, nguyệt=phụ mẫu, nhật=bản thân/ngẫu, thời=tử tức)
//    + hóa giải: nếu hành trùng = Dụng/Hỷ → giảm hung ("hồi phục"/"phản cát").
//  Nguồn: 渊海子平 反吟伏吟篇, 命理正宗 ("泪淋淋"), 三命通会 卷三.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { GAN, ZHI, WX_VI } from './constants.js';

// --- Lục thân + giai đoạn theo vị trí trụ ---
const PILLAR_QIN = {
  year:  { vi: 'Niên Trụ', qin: 'tổ tiên – ông bà', stage: '1–15t (thiếu niên)' },
  month: { vi: 'Nguyệt Trụ', qin: 'cha mẹ – anh em',  stage: '16–30t (thanh niên)' },
  day:   { vi: 'Nhật Trụ', qin: 'bản thân – phối ngẫu', stage: 'trung niên' },
  time:  { vi: 'Thời Trụ', qin: 'con cái – sự nghiệp muộn', stage: 'vãn niên' },
};

// --- Định nghĩa cơ khí ---
const CHONG = { 子:'午', 午:'子', 丑:'未', 未:'丑', 寅:'申', 申:'寅', 卯:'酉', 酉:'卯', 辰:'戌', 戌:'辰', 巳:'亥', 亥:'巳' };
// [loop 19 sửa bug CAO] Thiên can xung (天克/七杀 pair) — CHỈ 4 cặp đối xứng:
//   甲↔庚, 乙↔辛, 丙↔壬, 丁↔癸. 戊己 (trung thổ) KHÔNG có thiên can xung.
//   Trước đây isFanyin dùng "bất kỳ ngũ hành khắc" (ganKe) → chấp nhận cả 偏财/正官
//   và các cặp âm-dương khắc lộn → 384 false positive / 96 thật (đếm brute-force).
//   Cổ quyết (渊海子平 反吟伏吟篇): Phản Ngâm = THIÊN KHẮC ĐỊA XUNG, "天克" = đúng 7-vị xung.
const GAN_CHONG = { 甲:'庚', 庚:'甲', 乙:'辛', 辛:'乙', 丙:'壬', 壬:'丙', 丁:'癸', 癸:'丁' };

// 2 trụ = Phục Ngâm?
export function isFuyin(p, q) { return p.gan === q.gan && p.zhi === q.zhi; }
// 2 trụ = Phản Ngâm (thiên khắc địa xung)?
export function isFanyin(p, q) {
  return GAN_CHONG[p.gan] === q.gan && CHONG[p.zhi] === q.zhi;
}

// --- Ý nghĩa theo cặp trụ (nguyên cục nội bộ) ---
const NATAL_FUYIN = {
  'year-month':  'Thiếu niên gia đình bất ổn, dễ hình khắc trưởng bối (ông bà/cha mẹ).',
  'month-day':   'Lục thân hình khắc, hôn nhân bất ổn, cảm xúc dễ kích động, gia đạo bất an.',
  'day-time':    'Phối ngẫu – con cái nhiều sóng gió, trung – vãn niên dễ họa.',
  'year-day':    'Dễ xung đột với trưởng bối, phối ngẫu bất lợi.',
  'year-time':   'Ấu niên bất lợi cho trưởng bối, cổ luận hình khắc tổ bối.',
  'month-time':  'Lục thân bất hòa, cãi vã, sự nghiệp bất thuận.',
};
const NATAL_FANYIN = {
  'year-month':  'Trung niên trở ra có họa, phá tổ ly gia, hình khắc phụ tổ, ấu thời thể nhược khó nuôi.',
  'year-day':    'Dễ xung đột trưởng bối, vợ/chồng dễ khắc ly, khắc tử tức, phú quý không lâu.',
  'year-time':   'Tổ bối với con cái không hòa, sớm – muộn đều sóng gió.',
  'month-day':   'Trung niên bôn ba lao khổ, lục thân duyên bạc, phối ngẫu bất hòa.',
  'month-time':  'Lục thân bất hòa, đa cãi vã, sự nghiệp quái dị bất thuận.',
  'day-time':    'Phối ngẫu – con cái bất hòa, trung – vãn niên nhiều biến cố, hôn nhân khó an.',
};

// --- Ý nghĩa lưu niên/đại vận khắc trụ nguyên cục (theo vị trí trụ bị trùng/xung) ---
const FUYIN_BY_PILLAR = {
  year:  'Phục ngâm tổ bối — năm này ông/bà dễ có sự (bệnh/sự cố); bản thân hay hoài niệm, đình trệ, tiến thoái lưỡng nan.',
  month: 'Phục ngâm phụ mẫu/sự nghiệp — gia đạo biến động, sự nghiệp biến chuyển (dịch/dừng), cảm xúc trầm.',
  day:   '«Phục ngâm phục ngâm, thế lệ giao linh» — BẢN THÂN & PHỐI NGẪU: hôn nhân biến động, u buồn, dễ bệnh/hiểm. Nặng nhất.',
  time:  'Phục ngâm tử tức — con cái/dự án muộn dễ có sự; đầu tư đình trệ.',
};
const FANYIN_BY_PILLAR = {
  year:  'Phản ngâm tổ bối — trưởng bối nguy hiểm; bản thân dễ thương/trọng, hao tiền.',
  month: 'Phản ngâm phụ mẫu/sự nghiệp — sự nghiệp động loạn, lao khổ, hao tổn.',
  day:   '«Phản ngâm phục ngâm, khấp lệ lâm lâm» — BẢN THÂN & PHỐI NGẪU: biến cố lớn, ly tán, phúc sản tổn hại. NẶNG NHẤT.',
  time:  'Phản ngâm tử tức/dự án — con cái dễ hiểm, đầu tư phá sản.',
};

// --- Quy tắc hóa giải: trùng/xung đúng hành Dụng/Hỷ → "hồi phục"/"phản cát" ---
function mitigationNote(R, ganZhi) {
  const fav = new Set([R.yong?.primary, R.yong?.xi].filter(Boolean));
  const gWx = GAN[ganZhi[0]]?.wx, zWx = ZHI[ganZhi[1]]?.wx;
  const dung = fav.has(gWx) || fav.has(zWx);
  return dung
    ? ` ⚖ Hóa giải: can/chi hành ${WX_VI[gWx]}/${WX_VI[zWx]} trùng Dụng/Hỷ → hung giảm, có thể "phản cát" (vượng vận, hồi phục).`
    : '';
}

/**
 * Quét nguyên cục nội bộ (4 trụ × nhau) — Phục/Phản ngâm bẩm sinh.
 * @returns {{ items:[{type,pair,meaning}] }}
 */
export function natalFuyin(R) {
  const keys = ['year', 'month', 'day', 'time'];
  const items = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = keys[i], b = keys[j];
      const pa = R.chart.pillars[a], pb = R.chart.pillars[b];
      const key = `${a}-${b}`;
      if (isFuyin(pa, pb)) items.push({ type: '伏吟', typeVi: 'Phục Ngâm', pair: `${PILLAR_QIN[a].vi}–${PILLAR_QIN[b].vi}`, meaning: NATAL_FUYIN[key] || 'Đình trệ/lặp lại.' });
      else if (isFanyin(pa, pb)) items.push({ type: '反吟', typeVi: 'Phản Ngâm', pair: `${PILLAR_QIN[a].vi}–${PILLAR_QIN[b].vi}`, meaning: NATAL_FANYIN[key] || 'Động loạn/ly tán.' });
    }
  }
  return { items };
}

/**
 * Quét 1 năm cụ thể vs 4 trụ nguyên cục (lưu niên Phục/Phản ngâm).
 * @param {object} R — analyze()
 * @param {number} scanYear
 * @returns {{ year, ganZhi, items:[{type,typeVi,pillar,pillarVi,qin,meaning,severity,note}],
 *            worst, hasFuyin, hasFanyin, summary }}
 */
export function scanFuyin(R, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  // Tìm can-chi năm
  let ganZhi = '';
  const ln = (R.liunian || []).find((l) => l.year === curYear);
  if (ln) ganZhi = ln.ganZhi;
  else {
    try {
      const s = Solar.fromYmdHms(curYear, 6, 15, 12, 0, 0);
      const ec = s.getLunar().getEightChar();
      ganZhi = ec.getYearGan() + ec.getYearZhi();
    } catch (e) { ganZhi = '??'; }
  }
  const yp = { gan: ganZhi[0], zhi: ganZhi[1] };

  const items = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const np = R.chart.pillars[k];
    let type = null;
    if (isFuyin(yp, np)) type = '伏吟';
    else if (isFanyin(yp, np)) type = '反吟';
    if (!type) continue;

    const isFanyinType = type === '反吟';
    const isDayPillar = k === 'day';
    // Severity: phản > phục; nhật trụ nặng nhất; Dụng thì giảm
    let severity = isFanyinType ? 8 : 5;
    if (isDayPillar) severity += 3;
    if (mitigationNote(R, ganZhi)) severity = Math.max(1, severity - 4);

    const meaning = (isFanyinType ? FANYIN_BY_PILLAR : FUYIN_BY_PILLAR)[k];
    items.push({
      type, typeVi: isFanyinType ? 'Phản Ngâm' : 'Phục Ngâm',
      pillar: k, pillarVi: PILLAR_QIN[k].vi, qin: PILLAR_QIN[k].qin,
      ganZhi, meaning, severity,
      note: mitigationNote(R, ganZhi),
    });
  }

  const hasFuyin = items.some((i) => i.type === '伏吟');
  const hasFanyin = items.some((i) => i.type === '反吟');
  const worst = items.reduce((a, b) => (b.severity > (a?.severity || -1) ? b : a), null);

  let summary;
  if (!items.length) {
    summary = `Năm ${curYear} (${ganZhi}): KHÔNG phạm Phục/Phản ngâm trụ nào — tương đối yên (theo tiêu chí này).`;
  } else {
    const worstVi = worst.severity >= 7 ? 'NẶNG' : worst.severity >= 4 ? 'TRUNG BÌNH' : 'NHẸ';
    summary = `Năm ${curYear} (${ganZhi}): phạm ${items.length} điểm — ${items.map((i) => `${i.typeVi} ${i.pillarVi}`).join(', ')}. Cảnh báo ${worstVi}: ${worst.meaning}${worst.note}`;
  }

  return { year: curYear, ganZhi, items, worst, hasFuyin, hasFanyin, summary };
}

/**
 * Quét đại vận đang hành vs 4 trụ (bổ sung cho lưu niên).
 */
export function dayunFuyin(R) {
  const dy = (R.dayun || []).find((d) => d.isNow) || (R.dayun || [])[0];
  if (!dy) return { items: [] };
  const dp = { gan: dy.ganZhi[0], zhi: dy.ganZhi[1] };
  const items = [];
  for (const k of ['year', 'month', 'day', 'time']) {
    const np = R.chart.pillars[k];
    let type = null;
    if (isFuyin(dp, np)) type = '伏吟';
    else if (isFanyin(dp, np)) type = '反吟';
    if (!type) continue;
    const isFanyinType = type === '反吟';
    items.push({
      type, typeVi: isFanyinType ? 'Phản Ngâm' : 'Phục Ngâm',
      pillar: k, pillarVi: PILLAR_QIN[k].vi, qin: PILLAR_QIN[k].qin,
      ganZhi: dy.ganZhi, range: `${dy.startAge}-${dy.startAge + 9}t`,
      meaning: (isFanyinType ? FANYIN_BY_PILLAR : FUYIN_BY_PILLAR)[k],
      note: mitigationNote(R, dy.ganZhi),
    });
  }
  return { dayun: dy.ganZhi, range: `${dy.startAge}-${dy.startAge + 9}t`, items };
}

export { PILLAR_QIN, NATAL_FUYIN, NATAL_FANYIN, FUYIN_BY_PILLAR, FANYIN_BY_PILLAR };
