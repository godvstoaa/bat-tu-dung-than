// ============================================================================
//  流年 三煞 — TAM SÁT PHƯƠNG (năm kiêng kỵ Phong thuỷ: 劫煞/灾煞/岁煞)
//  "Năm nay phương nào KHÔNG ĐƯỢC động thổ/dời nhà?" — tối kỵ Phong thuỷ lưu niên.
//  * 三煞 = 3 chi (劫/灾/岁) ở 1 phương = phương KỴ lớn của năm. Công thức theo
//    tam hợp chi năm — 三煞方 = phương ĐỐI LẬP phương tự nhiên của ngũ hành tam hợp:
//      申子辰 (Thuỷ - Bắc) → tam sát 巳午未 (南)
//      寅午戌 (Hoả - Nam) → tam sát 亥子丑 (Bắc)
//      巳酉丑 (Kim - Tây) → tam sát 寅卯辰 (Đông)
//      亥卯未 (Mộc - Đông) → tam sát 申酉戌 (Tây)
//  * Tối kỵ: ĐỘNG THỔ/xây/dời nhà về tam sát phương; nhà ĐANG NGỒI (坐山) tam sát →
//    "tọa tam sát" đại kỵ (đại sự). Thái tuế khác tam sát — cả 2 đều phải tránh.
//  Nguồn: 协纪辨方书 三煞, 永乐大典 坐向避煞, 沈氏玄空 年煞.
// ============================================================================
import { Solar } from 'lunar-javascript';

const SANSHA = {
  申: ['巳', '午', '未'], 子: ['巳', '午', '未'], 辰: ['巳', '午', '未'],  // Thủy局 → Nam (sát 申子辰)
  寅: ['亥', '子', '丑'], 午: ['亥', '子', '丑'], 戌: ['亥', '子', '丑'],  // Hoả局 → Bắc (sát 寅午戌)
  巳: ['寅', '卯', '辰'], 酉: ['寅', '卯', '辰'], 丑: ['寅', '卯', '辰'],  // Kim局 → Đông (sát 巳酉丑)
  亥: ['申', '酉', '戌'], 卯: ['申', '酉', '戌'], 未: ['申', '酉', '戌'],  // Mộc局 → Tây (sát 亥卯未)
};
const JIE_ZAI_SUI = { 0: '劫煞', 1: '灾煞', 2: '岁煞' };
// 三煞 phương = CHÍNH phương vị (theo chi giữa của bộ 3: 子北 午南 卯东 酉西)
const SANSHA_DIR = { '亥': 'Bắc', '巳': 'Nam', '寅': 'Đông', '申': 'Tây' }; // chi đầu của bộ 3 → chính phương
const DIR_OF = { 子: 'Bắc', 丑: 'Đông Bắc', 寅: 'Đông Bắc', 卯: 'Đông', 辰: 'Đông Nam', 巳: 'Đông Nam', 午: 'Nam', 未: 'Tây Nam', 申: 'Tây Nam', 酉: 'Tây', 戌: 'Tây Bắc', 亥: 'Tây Bắc' };

function yearZhi(year) {
  const s = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  return s.getLunar().getEightChar().getYearZhi();
}

/**
 * @param {number} scanYear
 * @returns {{ year, yearZhi, sansha:[{chi,name,dir}], mainDir, advice, summary }}
 */
export function sanshaDirection(scanYear) {
  const curYear = scanYear || new Date().getFullYear();
  const yz = yearZhi(curYear);
  const branches = SANSHA[yz] || [];
  const sansha = branches.map((chi, i) => ({ chi, name: JIE_ZAI_SUI[i], dir: DIR_OF[chi] }));
  const mainDir = SANSHA_DIR[branches[0]] || '?'; // chính phương vị (Bắc/Nam/Đông/Tây)
  const summary = `Năm ${curYear} (${yz}) TAM SÁT ở ${mainDir} (${branches.join('')} = ${sansha.map((s) => s.name).join('/')}). TỐI KỴ động thổ/xây/dời nhà về hướng ${mainDir} trong năm; nhà đang 坐 ${mainDir} = «tọa tam sát» đại kỵ. (Khác Thái Tuế: ${yz} → Thái Tuế ở ${DIR_OF[yz]}.)`;
  return { year: curYear, yearZhi: yz, sansha, mainDir, advice: summary, summary };
}

/** Kiểm nhà có phạm tọa tam sát năm đó không. */
export function checkZuoSansha(sittingDir, scanYear) {
  const ss = sanshaDirection(scanYear);
  const hit = (ss.sansha || []).some((s) => s.dir === sittingDir);
  return { sittingDir, ...ss, zuoSansha: hit, note: hit ? `⚠ Nhà 坐 ${sittingDir} = TỌA TAM SÁT năm ${ss.year} — đại kỵ, tránh động thổ/cải tạo, cần hóa giải.` : `Nhà 坐 ${sittingDir} không phạm tọa tam sát năm ${ss.year}.` };
}

export { SANSHA, DIR_OF };
