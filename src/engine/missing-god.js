// ============================================================================
//  缺十神 — THẬP THẦN KHUYẾT/THIẾU (cái gì thiếu → lĩnh vực đời yếu)
//  "Điểm yếu cốt lõi của mệnh tôi là gì? Lĩnh vực nào không tự nhiên đến?"
//  * Phần bổ của dominant-god (thần CHỦ ĐẠO): 10 thập thần chia 5 nhóm (Ấn/比/食伤/财/官),
//    mỗi nhóm 2 (正 + 偏). Nhóm nào KHÔNG có (cả正+偏 đều 0) → lĩnh vực đó KHUYẾT.
//  * Ý nghĩa lĩnh vực:
//    比 (Tỷ/Kiếp): đồng minh, anh em, đối tác, tự lực.
//    食伤 (Thực/Thương): biểu đạt, sáng tạo, khẩu tài, CON CÁI (nữ命).
//    财 (Chính/Thiên Tài): tài lộc, kết quả vật chất, VỢ (nam命).
//    官 (Chính Quan/Thất Sát): sự nghiệp, địa vị, kỷ luật, CHỒNG (nữ命).
//    印 (Chính/Thiên Ấn): học vấn, quý nhân, mẹ, bảo vệ.
//  * 缺 = lĩnh vực không tự nhiên → phải TỰ CÀY, hoặc đợi大运/流运 mang thần đó đến.
//    正-only = ổn định/quy chuẩn; 偏-only = phi truyền thống/động.
//  Nguồn: 渊海子平 缺神论, 滴天髓 十神俱全, 子平真诠 用神有无.
// ============================================================================
import { TEN_GOD_VI } from './constants.js';

const CAT = {
  yin: { gods: ['正印', '偏印'], vi: 'Ấn (học vấn/quý nhân/mẹ)', area: 'học vấn, bảo vệ, quý nhân trưởng bối, tài sản tinh thần' },
  bi: { gods: ['比肩', '劫財'], vi: 'Tỷ/Kiếp (đồng minh/anh em/đối tác)', area: 'đồng minh, anh em, đối tác ngang hàng, tự lực' },
  shi: { gods: ['食神', '傷官'], vi: 'Thực/Thương (biểu đạt/sáng tạo/con cái)', area: 'biểu đạt, sáng tạo, khẩu tài, con cái (nữ命)' },
  cai: { gods: ['正財', '偏財'], vi: 'Tài (tài lộc/vợ nam)', area: 'tài lộc, kết quả vật chất, vợ (nam命)' },
  guan: { gods: ['正官', '七殺'], vi: 'Quan (sự nghiệp/địa vị/chồng nữ)', area: 'sự nghiệp, địa vị, kỷ luật, chồng (nữ命)' },
};
const GOD2CAT = {};
for (const [k, v] of Object.entries(CAT)) for (const g of v.gods) GOD2CAT[g] = k;
const ZHENG = { 正印: true, 正財: true, 正官: true }; // 正 (chính) vs 偏 (truyền thống)

function godScores(R) {
  const s = {};
  const pillars = R.chart.pillars;
  // [loop 62 sửa] 比肩 BAO GỒM 日主 (元神) — cổ pháp «比肩又包括日主». Trước đây skip 日主
  //   → nhóm Tỷ/Kiếp bị 'KHUYẾT' false (15% chart). Nay: 日主 = 比肩 baseline (1.5).
  s['比肩'] = 1.5; // 元神 (day master itself) luôn có → 比/劫 không bao giờ KHUYẾT hoàn toàn
  for (const k of ['year', 'month', 'day', 'time']) {
    const p = pillars[k];
    const posW = k === 'month' ? 1.3 : 1;
    if (p.ganGod && p.ganGod !== '日主') s[p.ganGod] = (s[p.ganGod] || 0) + 2 * posW;
    (p.hidden || []).forEach((h, idx) => {
      if (!h.god || h.god === '日主') return;
      const n = p.hidden.length;
      const w = (n === 1 ? 1.5 : idx === 0 ? 1.5 : idx === n - 1 ? 0.5 : 1) * posW;
      s[h.god] = (s[h.god] || 0) + w;
    });
  }
  return s;
}

/**
 * @returns {{ scores, categories:{[cat]:{status, gods:[{god,has,score}]}}, lacking:[], partial:[], summary }}
 */
export function missingGod(R) {
  const scores = godScores(R);
  const categories = {};
  const lacking = [], partial = [];

  for (const [cat, info] of Object.entries(CAT)) {
    const detail = info.gods.map((g) => ({ god: g, godVi: TEN_GOD_VI[g] || g, has: (scores[g] || 0) > 0, score: +(scores[g] || 0).toFixed(2) }));
    const present = detail.filter((d) => d.has);
    let status;
    if (present.length === 0) { status = 'lacking'; lacking.push({ cat, ...info }); }
    else if (present.length === 1) { status = 'partial'; partial.push({ cat, ...info, only: present[0].god }); }
    else { status = 'full'; }
    categories[cat] = { status, vi: info.vi, area: info.area, gods: detail };
  }

  let summary;
  if (!lacking.length && !partial.length) {
    summary = 'Lá số THẬP THẦN TOÀN ĐỦ (5 nhóm đều có cả正+偏) — mệnh CÂN ĐỐI, không lĩnh vực nào trọng đại khuyết, các mặt đời đều có nền tảng.';
  } else {
    const parts = [];
    if (lacking.length) parts.push(`KHUYẾT cả nhóm: ${lacking.map((l) => l.vi).join(', ')} → lĩnh vực (${lacking.map((l) => l.area.split(',')[0]).join('; ')}) KHÔNG tự nhiên đến, phải tự cày hoặc đợi đại vận/lưu niên mang đến.`);
    if (partial.length) {
      const pStr = partial.map((p) => {
        const onlyZheng = ZHENG[p.only];
        return `${p.vi} chỉ có ${TEN_GOD_VI[p.only] || p.only} (${onlyZheng ? '正 = ổn định/quy chuẩn' : '偏 = phi truyền thống/động'}, thiếu ${onlyZheng ? '偏' : '正'})`;
      }).join('; ');
      parts.push(`THIẾU 1 vế: ${pStr}.`);
    }
    summary = parts.join(' ');
  }
  return { scores, categories, lacking, partial, summary };
}

export { CAT, GOD2CAT };
