// ============================================================================
//  PHƯƠNG KỴ TỔNG HỢP LƯU NIÊN — KIỂM 1 HƯỚNG CHỐNG TOÀN BỘ SÁT PHƯƠNG NĂM
//  "Tôi có thể động thổ/cải tạo/dời nhà về hướng X năm nay không?"
//  * Gộp 5 hệ sát phương lưu niên thành 1 tra cứu:
//    1) 太岁方 (năm chi → chính phương) — phạm Thái Tuế.
//    2) 岁破方 (太岁 xung = đối phương) — phá tuổi, đại kỵ.
//    3) 三煞方 (sansha) — tối kỵ động thổ.
//    4) 五黄 (lưu niên phi tinh 5 hoàng) — đại sát, kỵ động thổ nhất.
//    5) 二黑 (phi tinh 2 hắc) — bệnh phù.
//  * Nhập 1 hướng (Bắc/Nam/Đông/Tây + phụ) → liệt kê mọi sát phạm + chốt CÁT/HUNG.
//  Nguồn: 协纪辨方书, 八宅明镜, 玄空飞星 — tổng hợp.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { sanshaDirection } from './sansha.js';
import { yearFlyingStar } from './xuankong.js';

const ZHI_TO_CARDINAL = { 子: 'Bắc', 午: 'Nam', 卯: 'Đông', 酉: 'Tây', 寅: 'Đông', 申: 'Tây', 巳: 'Nam', 亥: 'Bắc', 辰: 'Đông', 戌: 'Tây', 丑: 'Bắc', 未: 'Nam' };
const CHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
// Gộp vocab 4-phương (Bắc/Nam/Đông/Tây) và 8-phương (Chính Bắc/Tây Bắc...) về 1 tập 8 hướng.
// KHÔNG gộp đường chéo vào chính phương (bug cũ: 'Tây Bắc'→'Bắc' khiến hướng chéo kế thừa sát chính phương).
const SUB2CARDINAL = { 'Chính Bắc': 'Bắc', 'Chính Nam': 'Nam', 'Chính Đông': 'Đông', 'Chính Tây': 'Tây', 'Tây Bắc': 'Tây Bắc', 'Đông Bắc': 'Đông Bắc', 'Tây Nam': 'Tây Nam', 'Đông Nam': 'Đông Nam' };

function yearZhiOf(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  return s.getLunar().getEightChar().getYearZhi();
}
// Identity: so khớp CHÍNH XÁC theo hướng đã chuẩn hoá 8-phương. Không còn gộp đường chéo vào chính phương.
function normalizeCardinal(dir) { return dir; }
// Chuẩn hoá mọi tên hướng (cả 4-phương lẫn 8-phương) về tập 8 hướng canh nhau trước khi so sánh.
const TO_EIGHT = {
  'Bắc': 'Bắc', 'Chính Bắc': 'Bắc',
  'Nam': 'Nam', 'Chính Nam': 'Nam',
  'Đông': 'Đông', 'Chính Đông': 'Đông',
  'Tây': 'Tây', 'Chính Tây': 'Tây',
  'Đông Bắc': 'Đông Bắc', 'Tây Bắc': 'Tây Bắc',
  'Đông Nam': 'Đông Nam', 'Tây Nam': 'Tây Nam',
};
function toEight(dir) { return TO_EIGHT[dir] || dir; }

/**
 * @param {string} direction — hướng cần tra (vd 'Bắc','Chính Tây','Tây Bắc')
 * @param {number} scanYear
 * @returns {{ direction, year, taboos:[{type,detail,severity}], verdict, summary }}
 */
export function checkAnnualTaboo(direction, scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const dir = direction;
  // Chuẩn hoá input + mọi phương sát về cùng vocab 8-hướng rồi so khớp CHÍNH XÁC.
  // Tránh bug cũ: 'Đông Nam' bị gộp thành 'Nam' → khớp nhầm sát phương Nam.
  const dirEight = toEight(dir);
  const yz = yearZhiOf(curYear);

  const taiSuiDir = toEight(ZHI_TO_CARDINAL[yz]);
  const suiPoDir = toEight(ZHI_TO_CARDINAL[CHONG[yz]]);
  const sansha = sanshaDirection(curYear);
  const sanshaDir = toEight(sansha.mainDir);
  const yfs = yearFlyingStar(curYear);
  const star5 = yfs.pan.find((p) => p.star === 5);
  const star2 = yfs.pan.find((p) => p.star === 2);
  const star5Eight = star5 ? toEight(star5.palace) : null;
  const star2Eight = star2 ? toEight(star2.palace) : null;

  const taboos = [];
  if (dirEight === taiSuiDir) taboos.push({ type: 'Thái Tuế', detail: `hướng ${dir} = Thái Tuế phương năm ${curYear} (${yz})`, severity: 3 });
  if (dirEight === suiPoDir) taboos.push({ type: 'Tuế Phá', detail: `hướng ${dir} = Tuế Phá (đối Thái Tuế)`, severity: 4 });
  if (dirEight === sanshaDir) taboos.push({ type: 'Tam Sát', detail: `hướng ${dir} = Tam Sát phương (${sansha.sansha.map((s) => s.chi).join('')})`, severity: 4 });
  if (star5Eight && dirEight === star5Eight) taboos.push({ type: 'Ngũ Hoàng', detail: `hướng ${dir} = Ngũ Hoàng (${star5?.palace})`, severity: 5 });
  if (star2Eight && dirEight === star2Eight) taboos.push({ type: 'Nhị Hắc', detail: `hướng ${dir} = Nhị Hắc bệnh phù (${star2?.palace})`, severity: 2 });

  const maxSev = taboos.reduce((m, t) => Math.max(m, t.severity), 0);
  let verdict;
  if (maxSev >= 5) verdict = 'ĐẠI KỴ — tuyệt đối tránh động thổ/cải tạo/dời nhà về hướng này năm nay';
  else if (maxSev >= 3) verdict = 'KỴ — hạn chế, nếu bắt buộc phải hóa giải (an tinh/thời điểm cát)';
  else if (maxSev >= 1) verdict = 'HƠI KỴ — cẩn thận, ưu tiên thời điểm cát';
  else verdict = 'THUẬN — không phạm sát phương lớn năm nay (vẫn kết hợp Dụng Thần cá nhân)';

  let summary = `Hướng ${dir} năm ${curYear}: ${verdict}.`;
  if (taboos.length) {
    summary += ` Phạm: ${taboos.map((t) => `${t.type}(${t.severity})`).join(', ')}.`;
  } else {
    summary += ` Không phạm sát phương lớn (Thái Tuế=${taiSuiDir}, Tuế Phá=${suiPoDir}, Tam Sát=${sanshaDir}, 5黄=${star5 ? star5.palace : '-'}, 2黑=${star2 ? star2.palace : '-'}).`;
  }
  return { direction: dir, year: curYear, taboos, maxSeverity: maxSev, verdict, summary };
}

/** Liệt kê TẤT CẢ các hướng + mức sát năm đó (tổng quan). */
export function annualTabooOverview(scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const results = dirs.map((d) => ({ dir: d, ...checkAnnualTaboo(d, curYear) }));
  const clean = results.filter((r) => r.taboos.length === 0).map((r) => r.dir);
  const worst = results.filter((r) => r.maxSeverity >= 4).map((r) => `${r.dir}(${r.taboos.map((t) => t.type).join('/')})`);
  const summary = `Năm ${curYear}: ${worst.length ? `hướng KỴ nặng: ${worst.join(', ')}. ` : ''}${clean.length ? `hướng SẠCH (không phạm sát lớn): ${clean.join(', ')}.` : ''}`;
  return { year: curYear, results, clean, worst, summary };
}

export { SUB2CARDINAL };
