// ============================================================================
//  ÁN DƯƠNG TRẠCH (sảnh Phong Thủy Viên) — khách mua nhà, nhờ xem cửa và chỗ kê giường.
//  Đáp án do engine app tính: ../engine/zhai.js (mệnh quái Bát Trạch),
//  ../engine/fengshui-compass.js (24 sơn, compassReading), ../engine/xuankong.js (phi tinh năm).
//  4 bước: mệnh quái → cửa chính (sơn + sao Bát Trạch) → cung kê giường → cung Ngũ Hoàng năm nay.
//  Thuần logic (không DOM) — test: scripts/test-game-dz.mjs
// ============================================================================
import { analyze } from '../engine/chart.js';
import { computeZhai, GUA, AUSPICIOUS } from '../engine/zhai.js';
import { shanFromDegree, compassReading } from '../engine/fengshui-compass.js';
import { yearFlyingStar } from '../engine/xuankong.js';
import { hashSeed, rng, makeNpc } from './npc.js';

export const DZ_STEPS = ['menh', 'cua', 'giuong', 'nien'];
export const DZ_TITLE = { menh: 'Tính mệnh quái', cua: 'Đọc cửa chính', giuong: 'Chọn cung kê giường', nien: 'Tránh Ngũ Hoàng năm nay' };

// 8 cung (thứ tự la bàn) + tên trong bàn phi tinh
export const PALACES = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
export const PAN_NAME = { 'Bắc': 'Chính Bắc', 'Đông Bắc': 'Đông Bắc', 'Đông': 'Chính Đông', 'Đông Nam': 'Đông Nam', 'Nam': 'Chính Nam', 'Tây Nam': 'Tây Nam', 'Tây': 'Chính Tây', 'Tây Bắc': 'Tây Bắc', 'Trung cung': 'Trung cung' };
// sơn giữa mỗi cung (đại diện cung khi chấm chỗ kê đồ)
const MID_SHAN = { 'Bắc': '子', 'Đông Bắc': '艮', 'Đông': '卯', 'Đông Nam': '巽', 'Nam': '午', 'Tây Nam': '坤', 'Tây': '酉', 'Tây Bắc': '乾' };
export const STARS = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị', 'Tuyệt Mệnh', 'Ngũ Quỷ', 'Lục Sát', 'Họa Hại'];
export const GUAS = [1, 2, 3, 4, 6, 7, 8, 9].map((n) => ({ n, han: GUA[n].name, vi: GUA[n].vi }));
// 24 sơn theo thứ tự từ 337.5° — để lấy sơn lân cận làm phương án nhiễu
const SHAN_ORDER = ['壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥'];

const QUESTIONS = [
  'Gia đình tôi mới mua căn nhà, cửa chính quay hướng {deg}°. Thầy xem cửa có hợp tôi không, và nên kê giường ngủ ở góc nào?',
  'Tôi đang xem một căn hộ, cửa chính đo được {deg}°. Nhờ thầy xem giúp hợp mệnh không và phòng ngủ đặt đâu cho tốt.',
  'Nhà tôi cửa hướng {deg}°, dạo này ngủ không yên. Thầy xem lại cửa và chỗ kê giường giúp tôi.',
];

// Sao Bát Trạch của một cung với mệnh quái
export function starOf(gua, palace) {
  const z = computeZhai(gua.year, gua.gender);
  for (const [k, v] of Object.entries(z.auspicious)) if (v === palace) return k.split(' (')[0];
  for (const [k, v] of Object.entries(z.inauspicious)) if (v === palace) return k.split(' (')[0];
  return null;
}
export const isCat = (star) => ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị'].includes(star);

/**
 * Điểm một cung cho «giường ngủ» — đúng cách engine bestDirection('giuong'):
 * compassReading (Bát Trạch ±2, sát phương năm, phi tinh năm, ngũ hành hướng vs Dụng) + sao lý tưởng Thiên Y/Phục Vị (+4) + Bát Trạch cát (+1).
 */
export function bedScore(R, palace, year) {
  const rd = compassReading(R, MID_SHAN[palace], year);
  let s = rd.score;
  const st = rd.baziTrach?.star || '';
  if (['Thiên Y', 'Phục Vị'].some((x) => st.includes(x))) s += 4;
  if (rd.baziTrach?.cat) s += 1;
  return { score: s, verdict: rd.verdict, layers: rd.layers };
}

export function buildDzCase(key, today = new Date()) {
  const r = rng(hashSeed(`dz:${key}`));
  const year = today.getFullYear();
  const base = makeNpc(`dz:${key}`, year);
  // hướng cửa: tránh sát ranh giới sơn (±2°) để không mập mờ
  let deg;
  do { deg = Math.floor(r() * 360); } while (((deg - 337.5 + 720) % 15) < 2 || ((deg - 337.5 + 720) % 15) > 13);
  const npc = { ...base, question: QUESTIONS[Math.floor(r() * QUESTIONS.length)].replace('{deg}', deg), topic: 'house' };
  const R = analyze(npc.year, npc.month, npc.day, npc.hour, npc.minute, npc.gender, year);
  const z = computeZhai(npc.year, npc.gender);
  const shan = shanFromDegree(deg);
  const doorStar = starOf({ year: npc.year, gender: npc.gender }, shan.palace8);
  const i = SHAN_ORDER.indexOf(shan.han);
  const shanOpts = [-2, -1, 0, 1, 2].map((d) => SHAN_ORDER[(i + d + 24) % 24]);
  const beds = PALACES.map((p) => ({ palace: p, ...bedScore(R, p, year), star: starOf({ year: npc.year, gender: npc.gender }, p) }));
  const top = Math.max(...beds.map((b) => b.score));
  const fs = yearFlyingStar(year);
  const wu = fs.pan.find((p) => p.star === 5).palace;
  const er = fs.pan.find((p) => p.star === 2).palace;
  return {
    npc, R, year, deg, shan, zhai: z, doorStar, shanOpts, beds, fs,
    keys: {
      gua: GUA[z.gua].name,
      shan: shan.han,
      star: doorStar,
      bed: beds.filter((b) => b.score === top).map((b) => b.palace),
      wu: Object.keys(PAN_NAME).find((k) => PAN_NAME[k] === wu),
      er: Object.keys(PAN_NAME).find((k) => PAN_NAME[k] === er),
    },
  };
}

export function gradeDz(cs, step, ans) {
  const K = cs.keys, z = cs.zhai;
  if (step === 'menh') {
    const ok = ans === K.gua;
    const pick = GUAS.find((g) => g.han === ans);
    const sameGrp = pick && GUA[pick.n].grp === z.grp;
    return { score: ok ? 1 : sameGrp ? 0.3 : 0, msg: `${cs.npc.gender === 'nam' ? 'Nam' : 'Nữ'} sinh ${cs.npc.year} → mệnh ${z.guaName}, ${z.grpVi}.${!ok && sameGrp ? ' Bạn chọn đúng nhóm nhưng sai quẻ.' : ''}` };
  }
  if (step === 'cua') {
    const s = (ans.shan === K.shan ? 0.4 : 0) + (ans.star === K.star ? 0.6 : 0);
    return { score: s, msg: `${cs.deg}° thuộc sơn ${cs.shan.han} (${cs.shan.vi}), cung ${cs.shan.palace8}. Với mệnh ${z.guaName}, hướng ${cs.shan.palace8} là ${K.star} — ${isCat(K.star) ? 'cát, cửa hợp mệnh' : 'hung, cần hoá giải (đổi hướng cửa phụ, kê bàn thờ/đồ trấn)'}.` };
  }
  if (step === 'giuong') {
    const b = cs.beds.find((x) => x.palace === ans);
    const sc = cs.beds.map((x) => x.score), max = Math.max(...sc), min = Math.min(...sc);
    const s = !b ? 0 : K.bed.includes(ans) ? 1 : max === min ? 1 : 0.8 * (b.score - min) / (max - min);
    const best = cs.beds.find((x) => K.bed.includes(x.palace));
    return {
      score: s,
      msg: `Tốt nhất: cung ${K.bed.join(' / ')} (${best.star}, ${best.verdict}). Bạn chọn ${ans}: ${b?.star || '—'}, ${b?.verdict || '—'}. Giường ưu tiên Thiên Y (sức khoẻ) hoặc Phục Vị (yên giấc), tránh cung có Nhị Hắc / Ngũ Hoàng năm nay.`,
      reasons: K.bed.includes(ans) ? best.layers : [`Cung ${ans} (bạn chọn):`, ...(b?.layers || []), `Cung ${best.palace} (tốt nhất):`, ...best.layers],
    };
  }
  // nien
  const ok = ans === K.wu;
  return { score: ok ? 1 : 0, msg: `Năm ${cs.year}: trung cung sao ${cs.fs.center}, phi thuận theo Lạc Thư → Ngũ Hoàng (5) đóng ${K.wu}, Nhị Hắc (2) đóng ${K.er}. Năm nay kỵ động thổ, sửa chữa lớn ở ${K.wu}.` };
}

export function dzTotal(results) {
  const W = { menh: 0.2, cua: 0.3, giuong: 0.3, nien: 0.2 };
  return DZ_STEPS.reduce((t, k) => t + W[k] * (results[k]?.score || 0), 0);
}

export { AUSPICIOUS };
