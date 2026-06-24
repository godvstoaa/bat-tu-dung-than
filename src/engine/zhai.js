// ============================================================================
//  ZHÁI 宅 — PHONG THỦY NHÀ Ở (八宅明镜 pháp)
//  Tính Mệnh Quái (命卦) từ năm sinh + giới → Đông/Tứ Mệnh → 4 hướng cát
//  (Sinh Khí / Thiên Y / Diên Niên / Phục Vị) + 4 hướng hung, rồi khuyên
//  hướng cửa chính / chủ phòng ngủ / bếp. Nguồn: 八宅明镜.
// ============================================================================
import { Solar } from 'lunar-javascript';

// 8 quái ↔ số & nhóm Đông/Tây Tứ
const GUA = {
  1: { name: '坎', vi: 'Khảm', grp: 'east', dir: 'Bắc' },
  2: { name: '坤', vi: 'Khôn', grp: 'west', dir: 'Tây Nam' },
  3: { name: '震', vi: 'Chấn', grp: 'east', dir: 'Đông' },
  4: { name: '巽', vi: 'Tốn', grp: 'east', dir: 'Đông Nam' },
  6: { name: '乾', vi: 'Càn', grp: 'west', dir: 'Tây Bắc' },
  7: { name: '兑', vi: 'Đoài', grp: 'west', dir: 'Tây' },
  8: { name: '艮', vi: 'Cấn', grp: 'west', dir: 'Đông Bắc' },
  9: { name: '离', vi: 'Ly', grp: 'east', dir: 'Nam' },
};

// 4 hướng CÁT của mỗi quái: Sinh Khí / Thiên Y / Diên Niên / Phục Vị (theo 大游年)
const AUSPICIOUS = {
  1: { 'Sinh Khí': 'Đông Nam', 'Thiên Y': 'Đông', 'Diên Niên': 'Nam', 'Phục Vị': 'Bắc' },
  9: { 'Sinh Khí': 'Đông', 'Thiên Y': 'Đông Nam', 'Diên Niên': 'Bắc', 'Phục Vị': 'Nam' },
  3: { 'Sinh Khí': 'Nam', 'Thiên Y': 'Bắc', 'Diên Niên': 'Đông Nam', 'Phục Vị': 'Đông' },
  4: { 'Sinh Khí': 'Bắc', 'Thiên Y': 'Nam', 'Diên Niên': 'Đông', 'Phục Vị': 'Đông Nam' },
  2: { 'Sinh Khí': 'Đông Bắc', 'Thiên Y': 'Tây', 'Diên Niên': 'Tây Bắc', 'Phục Vị': 'Tây Nam' },
  7: { 'Sinh Khí': 'Tây Bắc', 'Thiên Y': 'Tây Nam', 'Diên Niên': 'Đông Bắc', 'Phục Vị': 'Tây' },
  6: { 'Sinh Khí': 'Tây', 'Thiên Y': 'Đông Bắc', 'Diên Niên': 'Tây Nam', 'Phục Vị': 'Tây Bắc' },
  8: { 'Sinh Khí': 'Tây Nam', 'Thiên Y': 'Tây Bắc', 'Diên Niên': 'Tây', 'Phục Vị': 'Đông Bắc' },
};
const AUSPICI_VI = { 'Sinh Khí': 'Sinh Khí (生気 — tài lộc, sinh vượng)', 'Thiên Y': 'Thiên Y (天医 — sức khoẻ, quý nhân)', 'Diên Niên': 'Diên Niên (延年 — nhân duyên, trường thọ)', 'Phục Vị': 'Phục Vị (伏位 — bình yên, ổn định)' };

const ALL_DIRS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
const INAU_VI = { 'Tuyệt Mệnh': 'Tuyệt Mệnh (绝命 — xấu nhất)', 'Ngũ Quỷ': 'Ngũ Quỷ (五鬼 — thị phi, tiểu nhân)', 'Lục Sát': 'Lục Sát (六杀 — thị phi, phá tài)', 'Họa Hại': 'Họa Hại (祸害 — phiền muộn, bệnh)' };

function digitRoot(n) { n = Math.abs(n); while (n >= 10) { let s = 0; while (n) { s += n % 10; n = Math.floor(n / 10); } n = s; } return n; }

/**
 * Tính Mệnh Quái + bố cục nhà.
 * @returns {{ gua, guaName, grp, grpVi, auspicious, inauspicious, advice }}
 */
export function computeZhai(birthYear, gender) {
  const isMale = gender === 'nam';
  // Mệnh quái theo năm sinh (dương lịch, sau lập xuân mới tính năm sau — giản lược dùng năm dương lịch)
  const s = digitRoot(birthYear);
  const lt = ((birthYear % 100) + 100) % 100; // 2 chữ số cuối của năm (lastTwoDigits)
  let gua;
  if (birthYear >= 2000) {
    // [cycle 43 — sửa bug C1] Thế kỷ 21: công thức chính thống dùng lastTwoDigits, KHÔNG dùng digitRoot.
    //   digitRoot(20xx) ≡ 2 + lastTwo (mod 9) ≠ lastTwo → code cũ (dùng digitRoot) ra SAI gua cho MỌI
    //   người sinh ≥2000, thậm chí sai cả nhóm Đông/Tây Tứ (vd 2000 nam: cũ=兑/Tây, đúng=离/Đông;
    //   2025 nữ: cũ=乾/Tây, đúng=巽/Đông). Chính thống 八宅明镜: nam=(99−lt)%9, nữ=(lt+6)%9.
    gua = isMale ? (99 - lt) % 9 : (lt + 6) % 9;
    if (gua === 0) gua = 9;
    if (gua === 5) gua = isMale ? 2 : 8;
  } else {
    // thế kỷ 20: nam = (11 - s) mod 9; nữ = (s + 4) mod 9
    gua = isMale ? (11 - s) % 9 : (s + 4) % 9;
    if (gua === 0) gua = 9;
    if (gua === 5) gua = isMale ? 2 : 8; // 5: nam→Khôn(2), nữ→Cấn(8)
  }
  const g = GUA[gua];
  const ausp = AUSPICIOUS[gua];
  // [loop 24 sửa CRITICAL] 四凶方 theo 八宅明镜 大游年歌诀 (KHÔ phải fill kim đồng hồ).
  //   Trước đây gán sao 凶 theo thứ tự la bàn → SAI cả 4 hướng cho mọi mệnh quẻ (vd Cảm:
  //   code tuyệt mệnh=Đông Bắc, đúng=Tây Nam). Bảng verified từ 大游年 (坎五天生延绝祸六…).
  //   Hướng: 1 Cảm 2 Khôn 3 Chấn 4 Tốn 6 Càn 7 Đoài 8 Cấn 9 Ly.
  const INAUSPICIOUS = {
    1: { 'Tuyệt Mệnh': 'Tây Nam', 'Ngũ Quỷ': 'Đông Bắc', 'Lục Sát': 'Tây Bắc', 'Họa Hại': 'Tây' },        // 坎
    2: { 'Tuyệt Mệnh': 'Bắc',      'Ngũ Quỷ': 'Đông Nam', 'Lục Sát': 'Nam',      'Họa Hại': 'Đông' },        // 坤
    3: { 'Tuyệt Mệnh': 'Tây',      'Ngũ Quỷ': 'Tây Bắc', 'Lục Sát': 'Đông Bắc', 'Họa Hại': 'Tây Nam' },     // 震
    4: { 'Tuyệt Mệnh': 'Đông Bắc', 'Ngũ Quỷ': 'Tây Nam', 'Lục Sát': 'Tây',      'Họa Hại': 'Tây Bắc' },     // 巽
    6: { 'Tuyệt Mệnh': 'Nam',      'Ngũ Quỷ': 'Đông',     'Lục Sát': 'Bắc',      'Họa Hại': 'Đông Nam' },    // 乾
    7: { 'Tuyệt Mệnh': 'Đông',     'Ngũ Quỷ': 'Tây Nam', 'Lục Sát': 'Đông Nam', 'Họa Hại': 'Bắc' },         // 兑
    8: { 'Tuyệt Mệnh': 'Đông Nam', 'Ngũ Quỷ': 'Bắc',      'Lục Sát': 'Đông',     'Họa Hại': 'Nam' },         // 艮
    9: { 'Tuyệt Mệnh': 'Tây Bắc', 'Ngũ Quỷ': 'Tây',      'Lục Sát': 'Tây Nam', 'Họa Hại': 'Đông Bắc' },     // 离
  };
  const inausp = INAUSPICIOUS[gua] || {};
  const advice = [
    `① Cửa chính (大门): mở về hướng cát — tốt nhất ${ausp['Sinh Khí']} (Sinh Khí) hoặc ${ausp['Diên Niên']} (Diên Niên) để thu vượng khí.`,
    `② Phòng ngủ chủ (主卧): đặt ở hướng cát ${ausp['Thiên Y']} (Thiên Y — tốt sức khoẻ) hoặc ${ausp['Phục Vị']} (Phục Vị — yên ngủ); đầu giường hướng cát.`,
    `③ Bếp (厨房): bếp nên "tọa hung hướng cát" — đặt ở hướng HUNG ${inausp['Tuyệt Mệnh'] || inKeys[0]} để ép tà, nhưng bếp lò/cửa bếp quay về hướng CÁT ${ausp['Sinh Khí']}.`,
    `④ Học/bàn làm việc: ngồi nhìn về hướng ${ausp['Sinh Khí']} hoặc ${ausp['Thiên Y']}.`,
    `${g.grp === 'east' ? 'Bạn thuộc Đông Tứ Mệnh → hợp nhà Đông Tứ Trạch (tọa Bắc/Nam/Đông/Đông Nam).' : 'Bạn thuộc Tây Tứ Mệnh → hợp nhà Tây Tứ Trạch (tọa Tây/Tây Bắc/Tây Nam/Đông Bắc).'}`,
  ];
  return {
    gua, guaName: `${g.name} (${g.vi})`, grp: g.grp,
    grpVi: g.grp === 'east' ? 'Đông Tứ Mệnh (东四命)' : 'Tây Tứ Mệnh (西四命)',
    auspicious: Object.fromEntries(Object.entries(ausp).map(([k, v]) => [AUSPICI_VI[k], v])),
    inauspicious: Object.fromEntries(Object.entries(inausp).map(([k, v]) => [INAU_VI[k], v])),
    advice,
  };
}

export { GUA, AUSPICIOUS };
