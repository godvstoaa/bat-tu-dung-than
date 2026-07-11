// wuyun-liuqi.js — 五运六气 (Hoàng Đế Nội Kinh, Y-thiên văn CẤM KỴ)
// Nguon: 《黄帝内经·素问》7 đai wan luan. Day la he Y-THIEN VAN: năm nào → bệnh tạng nào thịnh.
// Historically CAM (hoàng đế's medical advisors used this for dịch bệnh prediction).
//
// 5 VẬN (五运): năm CAN → vận (大运). Dương can = thái quá, âm can = bất cập.
// 6 KHÍ (六气): năm CHI → tư thiên (司天) + tại tuyền (在泉). Mỗi khí = 1 bán-năm mạch bệnh.

const WUYUN = {
  '甲': { yun: 'Thổ', tone: 'thái quá', effect: 'Thổ vận thái quá → tì vị THỪA → thấp khí nặng, tiêu hóa thái, béo, đàm thấp. Bệnh: tì/vị/đại tràng. Nước mưa nhiều.' },
  '己': { yun: 'Thổ', tone: 'bất cập', effect: 'Thổ vận bất cập → tì vị HƯ → tiêu hóa yếu, sưng, đi ngoài. Bệnh: tì/vị. Khí hậu: đất khô.' },
  '乙': { yun: 'Kim', tone: 'bất cập', effect: 'Kim vận bất cập → phế HƯ → hô hấp yếu, da khô. Bệnh: phế/đại tràng. Khí hậu: sương muối ít.' },
  '庚': { yun: 'Kim', tone: 'thái quá', effect: 'Kim vận thái quá → phế THỰC → ho, khô, cứng. Bệnh: phế/gan (kim khắc mộc). Khí hậu: thu lạnh sớm.' },
  '丙': { yun: 'Thủy', tone: 'thái quá', effect: 'Thủy vận thái quá → thận THỰC → lạnh, sưng, tiểu nhiều. Bệnh: thận/tâm (thủy khắc hỏa). Khí hậu: lạnh âm ỉ.' },
  '辛': { yun: 'Thủy', tone: 'bất cập', effect: 'Thủy vận bất cập → thận HƯ → lạnh, yếu sinh dục, xương yếu. Bệnh: thận/bàng quang. Khí hậu: khô hanh.' },
  '丁': { yun: 'Mộc', tone: 'bất cập', effect: 'Mộc vận bất cập → can HƯ → gan yếu, khí uất, mệt. Bệnh: can/đởm/tâm. Khí hậu: gió ít, cây héo.' },
  '壬': { yun: 'Mộc', tone: 'thái quá', effect: 'Mộc vận thái quá → can THỰC → giận, đau đầu, co giật. Bệnh: can/tỳ (mộc khắc thổ). Khí hậu: gió nhiều.' },
  '戊': { yun: 'Hỏa', tone: 'thái quá', effect: 'Hỏa vận thái quá → tâm THỰC → nóng, mất ngủ, huyết áp. Bệnh: tâm/phế (hỏa khắc kim). Khí hậu: nóng bức.' },
  '癸': { yun: 'Hỏa', tone: 'bất cập', effect: 'Hỏa vận bất cập → tâm HƯ → lạnh tim, mệt, trầm cảm. Bệnh: tâm/tiểu tràng. Khí hậu: rét đột ngột.' },
};

const LIUQI = {
  '子': { sitian: 'Thiếu Âm Quân Hỏa', zaiquan: 'Dương Minh Táo Kim', effect: 'Quân hỏa ty thiên → nóng trên, bệnh tâm/mạch. Táo kim tại tuyến → khô dưới.' },
  '午': { sitian: 'Thiếu Âm Quân Hỏa', zaiquan: 'Dương Minh Táo Kim', effect: 'Cùng tý: nóng/dry năm đó.' },
  '丑': { sitian: 'Thái Âm Thấp Thổ', zaiquan: 'Thái Dương Hàn Thủy', effect: 'Thấp thổ ty thiên → thấp/bộn bề, bệnh tỳ. Hàn thủy tại tuyến → lạnh.' },
  '未': { sitian: 'Thái Âm Thấp Thổ', zaiquan: 'Thái Dương Hàn Thủy', effect: 'Cùng sửu: ẩm thấp + lạnh.' },
  '寅': { sitian: 'Thiếu Dương Tương Hỏa', zaiquan: 'Quyết Âm Phong Mộc', effect: 'Tương hỏa ty thiên → nhiệt cực, bệnh thiếu dương/đởm. Phong mộc → gió.' },
  '申': { sitian: 'Thiếu Dương Tương Hỏa', zaiquan: 'Quyết Âm Phong Mộc', effect: 'Cùng dần: nóng + gió.' },
  '卯': { sitian: 'Dương Minh Táo Kim', zaiquan: 'Thiếu Âm Quân Hỏa', effect: 'Táo kim ty thiên → khô, bệnh phề/đại tràng. Quân hỏa → nóng dưới.' },
  '酉': { sitian: 'Dương Minh Táo Kim', zaiquan: 'Thiếu Âm Quân Hỏa', effect: 'Cùng mão: khô + nhiệt.' },
  '辰': { sitian: 'Thái Dương Hàn Thủy', zaiquan: 'Thái Âm Thấp Thổ', effect: 'Hàn thủy ty thiên → lạnh, bệnh thận/bàng quang. Thấp → ẩm.' },
  '戌': { sitian: 'Thái Dương Hàn Thủy', zaiquan: 'Thái Âm Thấp Thổ', effect: 'Cùng thìn: lạnh + ẩm.' },
  '巳': { sitian: 'Quyết Âm Phong Mộc', zaiquan: 'Thiếu Dương Tương Hỏa', effect: 'Phong mộc ty thiên → gió, bệnh can/đởm. Tương hỏa → nóng dưới.' },
  '亥': { sitian: 'Quyết Âm Phong Mộc', zaiquan: 'Thiếu Dương Tương Hỏa', effect: 'Cùng tỵ: gió + nhiệt.' },
};

// === assessWuyunLiuqi(year) — COMPUTED y-thiên văn prediction ===
export function assessWuyunLiuqi(year) {
  const yearGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][((year - 4) % 10 + 10) % 10];
  const yearZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][((year - 4) % 12 + 12) % 12];
  const yun = WUYUN[yearGan];
  const qi = LIUQI[yearZhi];
  if (!yun || !qi) return { note: 'không tính được' };
  return {
    year, yearGanZhi: yearGan + yearZhi,
    wuyun: { yun: yun.yun, tone: yun.tone, effect: yun.effect },
    liuqi: { sitian: qi.sitian, zaiquan: qi.zaiquan, effect: qi.effect },
    verdict: `Năm ${year} (${yearGan}${yearZhi}): VẬN = ${yun.yun} vận ${yun.tone} → ${yun.effect}. KHÍ = ${qi.sitian} tư thiên / ${qi.zaiquan} tại tuyền → ${qi.effect}. (五运六气 = y-thiên văn CẤM KỴ, Hoàng Đế Nội Kinh. Dùng để dự đoán dịch bệnh/nội khí năm.)`,
    note: '五运六气: năm CAN → vận (thái quá/bất cập). Năm CHI → 6 khí (tư thiên/tại tuyền). Combine → tạng phụ bệnh & khí hậu. Nền tảng của Đông Y thời tiết-bệnh học.',
  };
}
