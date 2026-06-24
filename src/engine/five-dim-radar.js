// ============================================================================
//  MỆNH BÀN NGŨ DUY 五维命盘 — 5 CHIỀU THẬP THẦN (radar)
//  Gom 10 thập thần thành 5 nhóm: Tài(财)/Quan(官)/Ấn(印)/Thực Thương(食伤)/Tỷ Kiếp(比劫).
//  Trọng số dùng godCount (天干透干 1.0 + tàng 本/中/余 0.5/0.3/0.1 — verify loop 32).
//  Output: điểm từng chiều (0-100, chuẩn hoá) + trục trội + luận giải → render radar SVG.
//  Nguồn: 十神 组织 (子平真诠), 盲派 体用 (Tỷ=thể, Tài/Quan=dụng).
// ============================================================================
import { godCount } from './combos.js';

// 5 nhóm thập thần (gốc nhóm = godGroup trong core.js: ti/yin/shi/cai/guan)
const DIMS = [
  { key: 'cai', vi: 'Tài (财富/物质)', zh: '财', gods: ['正財', '偏財'], trait: 'kinh doanh, tích lũy, thực dụng, hưởng thụ vật chất' },
  { key: 'guan', vi: 'Quan (quyền/lý lẽ)', zh: '官', gods: ['正官', '七殺'], trait: 'lãnh đạo, kỷ luật, địa vị, áp lực/trách nhiệm' },
  { key: 'yin', vi: 'Ấn (tri thức/ấm)', zh: '印', gods: ['正印', '偏印'], trait: 'học thuật, bằng cấp, bảo vệ, tĩnh, mẹ/quý nhân' },
  { key: 'shi', vi: 'Thực Thương (tài hoa)', zh: '食伤', gods: ['食神', '傷官'], trait: 'sáng tạo, diễn đạt, nghệ thuật, kỹ năng, phá cách' },
  { key: 'ti', vi: 'Tỷ Kiếp (bản ngã/đối thủ)', zh: '比劫', gods: ['比肩', '劫財'], trait: 'ý chí, cạnh tranh, bạn bè/anh em, độc lập, cứng đầu' },
];

/**
 * Tính 5 chiều thập thần cho radar.
 * @param {object} chart — R.chart (có pillars + ganGod + hidden)
 * @returns {{ dims:[{key,vi,zh,raw,score,gods}], max, dominant, weakest, summary }}
 *   score ∈ [0,100]: chuẩn hoá raw theo max chiều (trục dài nhất = 100).
 */
export function fiveDimRadar(chart) {
  const c = godCount(chart);
  const dims = DIMS.map((d) => {
    const raw = d.gods.reduce((s, g) => s + (c[g] || 0), 0);
    return { ...d, raw: +raw.toFixed(2), gods: d.gods.map((g) => ({ god: g, n: +(c[g] || 0).toFixed(2) })) };
  });
  const maxRaw = Math.max(...dims.map((d) => d.raw), 0.01);
  // điểm 0-100: chuẩn hoá theo max + boost nhẹ để trục 0 không totally flat (min 5)
  dims.forEach((d) => { d.score = d.raw <= 0 ? 0 : Math.round(10 + (d.raw / maxRaw) * 90); });
  const sorted = [...dims].sort((a, b) => b.raw - a.raw);
  const dominant = sorted[0];
  const weakest = sorted[sorted.length - 1];
  // luận: trục trội = bản chất nổi bật; trục thiếu = cần bồi (qua vận mang sao đó)
  const summary = `Trục trội: ${dominant.vi} (${dominant.score}) — thiên ${dominant.trait}. ` +
    `Thiếu nhất: ${weakest.vi} (${weakest.score}) — đây là khía cạnh cần bồi bổ (qua 大运/流 năm mang nhóm ${weakest.zh} sẽ kích hoạt).`;
  return { dims, max: 100, dominant, weakest, summary };
}

export { DIMS };
