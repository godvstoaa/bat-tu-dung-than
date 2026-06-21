// ============================================================================
//  TỨ TRỤ HẠN VẬN 四柱限运 — mỗi trụ chủ một GIAI ĐOẠN ĐỜI (~15 năm)
//  年柱: 1–15t (thơ ấu, tổ thượng) | 月: 16–30 (thanh niên, cha mẹ/sự nghiệp) |
//  日: 31–45 (trung niên, bản thân/phối ngẫu) | 时: 46–60+ (vãn niên, con cái/di sản)
//  Thiên can = nửa đầu, Địa chi = nửa sau của mỗi giai đoạn.
//  God/vượng-suy/Dụng-Kỵ của trụ → vận của giai đoạn đó. Nguồn: 子平/滴天髓 限运说.
// ============================================================================
import { GAN, ZHI, WX_VI, SHENG_BY, TEN_GOD_VI } from './constants.js';

const PHASES = [
  { key: 'year', label: 'Thơ ấu — Thanh thiếu niên', range: '1–15 tuổi', gan: 'Nửa đầu (1–7t)', zhi: 'Nửa sau (8–15t)', focus: 'gia đình/cha mẹ/môi trường trưởng thành' },
  { key: 'month', label: 'Thanh niên', range: '16–30 tuổi', gan: 'Nửa đầu (16–22t)', zhi: 'Nửa sau (23–30t)', focus: 'sự nghiệp/học vấn/độc lập' },
  { key: 'day', label: 'Trung niên', range: '31–45 tuổi', gan: 'Nửa đầu (31–37t)', zhi: 'Nửa sau (38–45t)', focus: 'bản thân/phối ngẫu/đỉnh sự nghiệp' },
  { key: 'time', label: 'Vãn niên', range: '46–60+ tuổi', gan: 'Nửa đầu (46–52t)', zhi: 'Nửa sau (53–60+t)', focus: 'con cái/di sản/sức khoẻ/vận muộn' },
];

const GOD_PHASE = {
  正官: 'ôn hoà, quy củ, có贵人 nâng, học hành/sự nghiệp thuận; kỵ bị thương quan phá.',
  七殺: 'áp lực, thử thách, mạo hiểm; nếu có chế → đoạt quyền, phi thường; không chế → tai nạn.',
  正印: 'được mẹ/giáo dục bảo vệ, ấm no, học thuật; kỵ tài phá ấn.',
  偏印: 'trực giác, lập dị, huyền học; cần tài chế kiêu; kỵ kiêu đoạt thực.',
  食神: 'tài hoa, phúc lộc, bình順; kỵ kiêu đoạt thực.',
  傷官: 'sáng tạo, phản nghịch, khẩu thiệt; cần ấn chế hoặc tài hoá; kỵ kiến quan.',
  正財: 'tài lộc ổn định, cần mẫn; thân vượng nhậm tài → phú; thân nhược → tài đa thân nhược.',
  偏財: 'tài lớn, đầu tư, giao tế; biến động; hợp kinh doanh.',
  比肩: 'cạnh tranh, tự lập, bạn bè; kỵ đoạt tài.',
  劫財: 'hao tài, tranh giành, mạo hiểm; kỵ kết hôn/hợp tác trọng đại trong giai đoạn này.',
  日主: 'bản thân — nếu vượng → tự chủ, mạnh; nếu nhược → cần dựa dẫm.',
};

/**
 * Phân tích 四柱限运 — vận đời theo từng giai đoạn.
 * @returns [{ key, label, range, ganGod, ganWx, zhiGod, zhiWx, isDung, isKy, ganNote, zhiNote, verdict }]
 */
export function analyzePillarAges(R) {
  const yong = R.yong;
  const favSet = new Set([yong.primary, yong.xi].filter(Boolean));
  const kySet = new Set([yong.ji, yong.chou]);
  const out = [];

  for (const ph of PHASES) {
    const p = R.chart.pillars[ph.key];
    const ganGod = ph.key === 'day' ? '日主' : p.ganGod;
    const ganWx = GAN[p.gan].wx;
    // tàng chính khí = god of hidden[0]
    const zhiGod = p.hidden[0].god;
    const zhiWx = ZHI[p.zhi].wx;

    const ganIsDung = favSet.has(ganWx);
    const ganIsKy = kySet.has(ganWx);
    const zhiIsDung = favSet.has(zhiWx);
    const zhiIsKy = kySet.has(zhiWx);

    const ganNote = GOD_PHASE[ganGod] || '';
    const zhiNote = GOD_PHASE[zhiGod] || '';

    // Phán vận giai đoạn: kết hợp gan + zhi + Dụng/Kỵ
    let score = 50;
    if (ganIsDung) score += 8;
    if (ganIsKy) score -= 8;
    if (zhiIsDung) score += 8;
    if (zhiIsKy) score -= 8;
    if (['正官','正印','食神','正財','偏財'].includes(ganGod)) score += 4;
    if (['七殺','傷官','劫財','偏印'].includes(ganGod)) score -= 3;

    let verdict;
    if (score >= 62) verdict = `Giai đoạn ${ph.range} ≈ THUẬN — ${ganIsDung || zhiIsDung ? 'hành Dụng/Hỷ hỗ trợ' : 'sao cát'}, ${ph.focus} phát triển tốt.`;
    else if (score >= 42) verdict = `Giai đoạn ${ph.range} ≈ BÌNH — ${ph.focus} tùy nỗ lực; có trợ có trở.`;
    else verdict = `Giai đoạn ${ph.range} ≈ BẤT LỢI — ${ganIsKy || zhiIsKy ? 'hành Kỵ/Thù áp đảo' : 'sao hung'}, cần cẩn thận ${ph.focus}.`;

    out.push({ ...ph, ganGod: TEN_GOD_VI[ganGod] || ganGod, ganWx: WX_VI[ganWx], zhiGod: TEN_GOD_VI[zhiGod] || zhiGod, zhiWx: WX_VI[zhiWx], ganIsDung, ganIsKy, zhiIsDung, zhiIsKy, ganNote, zhiNote, score, verdict });
  }
  return out;
}
