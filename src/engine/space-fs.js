// ============================================================================
//  PHONG THỦY KHÔNG GIAN TỔNG HỢP 风水空间综合
//  Kết hợp 4 hệ → 1 thẻ "HƯỚNG RIÊNG CHO BẠN năm nay" (như đại sư làm):
//  (1) 八宅命卦  (2) 玄空运盘  (3) 玄空流年飞星  (4) Dụng Thần phương vị
//  Mỗi hướng 8 phương → 4 hệ đồng/thuận/nghịch → consensus → best/worst direction.
// ============================================================================
import { computeZhai } from './zhai.js';
import { xuankongPan, yearFlyingStar, STAR } from './xuankong.js';
import { WX_VI } from './constants.js';

const DIRS = [
  { key: 'Bắc', zhaiPal: '坎' }, { key: 'Đông Bắc', zhaiPal: '艮' },
  { key: 'Đông', zhaiPal: '震' }, { key: 'Đông Nam', zhaiPal: '巽' },
  { key: 'Nam', zhaiPal: '离' }, { key: 'Tây Nam', zhaiPal: '坤' },
  { key: 'Tây', zhaiPal: '兑' }, { key: 'Tây Bắc', zhaiPal: '乾' },
];

// Dụng Thần phương vị (theo ngũ hành)
const WX_DIR = { 木: ['Đông', 'Đông Nam'], 火: ['Nam'], 土: ['Đông Bắc', 'Tây Nam', 'Trung'], 金: ['Tây', 'Tây Bắc'], 水: ['Bắc'] };

// 八宅: Đông Tứ = 坎/震/巽/离 (cát); Tây Tứ = 乾/坤/艮/兑
const EAST_GROUP = new Set(['坎', '震', '巽', '离']);

/**
 * Tổng hợp phong thủy không gian — hướng RIÊNG cho bạn năm [year].
 * @param birthYear, gender (cho 命卦), yong (Dụng Thần), year (năm hỏi)
 */
export function spaceFs(birthYear, gender, yong, year) {
  // (1) 八宅命卦
  const zhai = computeZhai(birthYear, gender);
  const isEast = zhai.grp === 'east';
  const auspSet = new Set(Object.values(zhai.auspicious).flat ? Object.values(zhai.auspicious) : []);
  // zhai auspicious keys are like "Sinh Khí (生気...)" → value = direction string
  // Extract directions
  const zhaiCatDirs = new Set();
  const zhaiHungDirs = new Set();
  for (const [k, v] of Object.entries(zhai.auspicious)) {
    if (Array.isArray(v)) v.forEach(d => zhaiCatDirs.add(d));
    else if (typeof v === 'string') zhaiCatDirs.add(v);
  }
  for (const [k, v] of Object.entries(zhai.inauspicious)) {
    if (Array.isArray(v)) v.forEach(d => zhaiHungDirs.add(d));
    else if (typeof v === 'string') zhaiHungDirs.add(v);
  }

  // (2) 玄空运盘
  const yunPan = xuankongPan(year);
  // (3) 玄空流年飞星
  const yfsPan = yearFlyingStar(year);

  // (4) Dụng Thần phương
  const dungDirs = new Set(WX_DIR[yong.primary] || []);

  // Tổng hợp 8 hướng
  const result = DIRS.map((dir) => {
    const d = dir.key;
    let votes = 0; // positive = cát, negative = hung
    const notes = [];

    // 八宅: cát direction?
    const zhaiPal = dir.zhaiPal;
    const zhaiEast = EAST_GROUP.has(zhaiPal);
    const userEast = isEast;
    if (zhaiEast === userEast) { votes += 1; notes.push('八宅 ✓'); }
    else { votes -= 1; notes.push('八宅 ✗'); }

    // 玄空运盘: find this direction's star
    const yunCell = yunPan.pan.find((p) => p.palace.includes(d) || d.includes(p.palace.split(' ')[0]));
    if (yunCell) {
      if (yunCell.quality.includes('vượng') || yunCell.quality.includes('sinh khí')) { votes += 1; notes.push(`运盘 ${yunCell.info.name} ✓`); }
      else if (yunCell.quality.includes('hung')) { votes -= 1; notes.push(`运盘 ${yunCell.info.name} ✗`); }
      else { notes.push(`运盘 ${yunCell.info.name} ~`); }
    }

    // 玄空流年: find this direction's star
    const yfsCell = yfsPan.pan.find((p) => p.palace.includes(d) || d.includes(p.palace.split(' ')[0]));
    if (yfsCell) {
      if (yfsCell.base === 'cát' || yfsCell.base === 'đại cát') { votes += 1; notes.push(`流年 ${yfsCell.name} ✓`); }
      else if (yfsCell.base === 'hung' || yfsCell.base === 'đại hung') { votes -= 1; notes.push(`流年 ${yfsCell.name} ✗`); }
      else { notes.push(`流年 ${yfsCell.name} ~`); }
    }

    // Dụng Thần direction?
    if (dungDirs.has(d)) { votes += 1; notes.push(`Dụng ${WX_VI[yong.primary]} ✓`); }

    return { dir: d, votes, notes, verdict: votes >= 2 ? 'CAT' : votes <= -2 ? 'HUNG' : 'BINH' };
  });

  const best = result.filter((r) => r.verdict === 'CAT').sort((a, b) => b.votes - a.votes);
  const worst = result.filter((r) => r.verdict === 'HUNG').sort((a, b) => a.votes - b.votes);
  const mid = result.filter((r) => r.verdict === 'BINH');

  const advice = best.length
    ? `HƯỚNG TỐT NHẤT cho bạn năm ${year}: ${best.map((b) => `${b.dir} (${b.votes >= 3 ? '3-4 hệ đồng ý' : '2 hệ đồng ý'})`).join(', ')} — nên đặt cửa chính/bàn/giường/cửa hàng hướng này.`
    : `Không có hướng nào ≥ 2 hệ đồng thuận cát — chọn hướng có Dụng Thần (${WX_DIR[yong.primary]?.join('/') || '?'}).`;
  const warn = worst.length
    ? `HƯỚNG XẤU NHẤT: ${worst.map((w) => `${w.dir} (${w.votes <= -3 ? '3-4 hệ nghịch' : '2 hệ nghịch'})`).join(', ')} — tránh/trang trí nhẹ, không cửa chính/giường.`
    : '';

  return { year, birthYear, gender, zhai: zhai.grpVi, yong: yong.primary, result, best, worst, mid, advice, warn };
}
