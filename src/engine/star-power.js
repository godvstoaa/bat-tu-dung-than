// ============================================================================
//  财官印 通根透干 — SỨC MẠNH THẬT CỦA CÁC SAO TRỌNG ĐIỂM (财/官/印/食伤/比)
//  "Sao TÀI (tiền)/QUAN (sự nghiệp)/ẤN (bảo hộ) của tôi có THẬT không hay hư?"
//  * Mỗi nhóm thập thần = 1 hành. Dùng elementPower (tonggen) kiểm 通根 (có ngầm
//    trong tàng can) + 透干 (có lộ thiên can) → 4 tình trạng:
//    有力 (căn+lộ, sao thật mạnh) | 虚浮 (lộ không căn, hư) | 藏而不透 (căn ẩn, đợi vận
//    thấu) | 虚 (không căn không lộ, yếu/vắng).
//  * Sao trọng điểm HỮU LỰC → lĩnh vực đó thật; 虚浮/藏/虚 → lĩnh vực khó, đợi lưu niên
//    mang can cùng hành sao đó đến thấu mới phát.
//  Nguồn: 滴天髓 通根篇, 子平真诠 财官印有力无力, 渊海子平 用神真假.
// ============================================================================
import { WX_VI } from './constants.js';
import { elementPower } from './tonggen.js';

const CAT = [
  { key: 'cai', relKey: 'wealthWx', star: 'Tài', starVi: 'Tài Lộc', area: 'tiền bạc, vợ (nam)' },
  { key: 'guan', relKey: 'officerWx', star: 'Quan', starVi: 'Sự nghiệp/Quyền', area: 'sự nghiệp, địa vị, chồng (nữ)' },
  { key: 'yin', relKey: 'resourceWx', star: 'Ấn', starVi: 'Bảo hộ/Học vấn', area: 'học vấn, quý nhân, mẹ, nhà cửa' },
  { key: 'shi', relKey: 'outputWx', star: 'Thực Thương', starVi: 'Sáng tạo/Con cái', area: 'sáng tạo, biểu đạt, con cái (nữ)' },
  { key: 'bi', relKey: 'sameWx', star: 'Tỷ Kiếp', starVi: 'Đồng minh/Tự lực', area: 'anh em, đối tác, tự lực' },
];

/**
 * @param {object} R — analyze()
 * @returns {{ items:[{star,starVi,wx,wxVi,verdict,verdictVi,root,reveal,area}], strong:[], weak:[], hidden:[], summary }}
 */
export function starPower(R) {
  const relations = R.yong?.relations || {};
  const items = CAT.map((c) => {
    const wx = relations[c.relKey];
    if (!wx) return { ...c, wx: null };
    const p = elementPower(R.chart, wx, R.strength?.monthMainWx);
    return { ...c, wx, wxVi: WX_VI[wx], verdict: p.verdict, verdictVi: p.verdictVi, root: p.root.total, reveal: p.reveal.length, season: p.seasonVi };
  }).filter((x) => x.wx);

  const strong = items.filter((x) => x.verdict === '有力');
  const weak = items.filter((x) => x.verdict === '虚浮' || x.verdict === '虚');
  const hidden = items.filter((x) => x.verdict === '藏而不透');

  const fmt = (arr) => arr.map((x) => `${x.starVi}(${x.wxVi})`).join(', ');
  let summary;
  if (strong.length) summary = `Sao HỮU LỰC (thật, phất được): ${fmt(strong)}. `;
  if (hidden.length) summary = (summary || '') + `Sao CĂN-NHƯNG-ẨN (có nền nhưng chờ lưu niên thấu can cùng hành mới phát): ${fmt(hidden)}. `;
  if (weak.length) summary = (summary || '') + `Sao HƯ/YẾU (không thông căn → lĩnh vực khó, cần bù mạnh qua Dụng/hợp tác): ${fmt(weak)}.`;
  if (!summary) summary = 'Tất cả sao trọng điểm đều trung tính.';

  return { items, strong, weak, hidden, summary };
}

export { CAT };
