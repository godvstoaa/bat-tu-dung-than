// ============================================================================
//  LỤC THÂN (六亲) — Phân tích quan hệ gia đình qua 2 chiều cổ pháp
//  (1) CUNG VỊ (宫位 - tĩnh): 年=ổ祖/việc tổ, 月=cha mẹ/anh em, 日 chi=phối ngẫu,
//      时=con cái.  (2) TINH (星 - động): Thập thần đại diện từng lục thân.
//  Nguyên tắc: "cung vị = hoàn cảnh, tinh = bản thân người đó" — phải kết hợp.
//  Nguồn: 渊海子平, 三命通会, 八字应用阐微.
// ============================================================================
import { TEN_GOD_VI, GAN, ZHI } from './constants.js';

// Ánh xạ Thập thần tinh theo lục thân (chuẩn 渊海子平 / 邵伟华)
function starMap(isMale) {
  return isMale
    ? { 父: ['偏財', '正財'], 母: ['正印', '偏印'], 兄弟姐妹: ['比肩', '劫財'], 配偶: ['正財', '偏財'], 子女: ['七殺', '正官'] }
    : { 父: ['偏財', '正財'], 母: ['正印', '偏印'], 兄弟姐妹: ['比肩', '劫財'], 配偶: ['正官', '七殺'], 子女: ['食神', '傷官'] };
}
// Cung vị ứng lục thân
const PALACE = {
  父: ['year', 'month'], 母: ['year', 'month'],
  兄弟姐妹: ['month'], 配偶: ['day'], 子女: ['time'],
};
const PALACE_VI = { year: 'Trụ Năm (cung tổ thượng)', month: 'Trụ Tháng (cung cha mẹ/huynh đệ)', day: 'Trụ Ngày (cung phối ngẫu)', time: 'Trụ Giờ (cung tử nữ)' };

function godCount(chart) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    c[main.god] = (c[main.god] || 0) + 0.5;
  }
  delete c['日主'];
  return c;
}

/**
 * @returns {Array<{relation, stars, present, palace, palaceGod, stable, verdict}>}
 */
export function analyzeLiuqin(R) {
  const { chart, interactions } = R;
  const isMale = chart.input.gender === 'nam';
  const sm = starMap(isMale);
  const gc = godCount(chart);
  const out = [];

  for (const relation of ['父', '母', '兄弟姐妹', '配偶', '子女']) {
    const stars = sm[relation];
    const present = stars.map((s) => ({ god: s, vi: TEN_GOD_VI[s], n: gc[s] || 0 }));
    const mainStar = present.slice().sort((a, b) => b.n - a.n)[0];
    const hasStar = mainStar.n > 0;

    // Cung vị
    const palKey = PALACE[relation][PALACE[relation].length - 1]; // lấy cung chính
    const pillar = chart.pillars[palKey];
    const palaceGod = TEN_GOD_VI[pillar.ganGod] || pillar.ganGod;
    const zhi = pillar.zhi;
    // Cung có bị xung/hình không
    const unstable = interactions.chong.some((c) => c.a === zhi || c.b === zhi)
      || interactions.xing.some((c) => (c.a === zhi || c.b === zhi));
    // Cung có sao lục thân trùng không (tinh tại cung = "chính vị")
    const starInPalace = pillar.hidden.some((h) => stars.includes(h.god)) || stars.includes(pillar.ganGod);

    // Phán đoán
    let verdict;
    const relVi = { 父: 'Cha', 母: 'Mẹ', 兄弟姐妹: 'Anh chị em', 配偶: 'Vợ/Chồng', 子女: 'Con cái' }[relation];
    if (relation === '配偶') {
      if (starInPalace && !unstable) verdict = `Sao phối ngẫu (${mainStar.vi}) đắc vị tại cung Nhật Chi ${ZHI[zhi].vi} (${palaceGod}) → duyên bền, bạn đời giúp ích; cung không bị xung.`;
      else if (unstable) verdict = `Cung phối ngẫu (Nhật Chi ${ZHI[zhi].vi}) bị xung/hình → gia đạo dễ biến động, cần bao dung, kết hôn muộn một chút tốt.`;
      else verdict = `Sao phối ngẫu ${hasStar ? `hiện (${mainStar.vi})` : 'khuyết/ẩn'}; cung ${palaceGod} — duyên theo sự vun đắp.`;
    } else if (relation === '子女') {
      if (hasStar && !unstable) verdict = `Sao con (${mainStar.vi}) có khí + cung Tử Nữ vững → duyên con tốt, nên có con vào lưu niên CÁT (hành Dụng/Hỷ).`;
      else if (!hasStar) verdict = `Sao con mờ/khuyết → duyên con hơi muộn; nên dưỡng thai theo Dụng Thần, chọn năm cát sinh con.`;
      else verdict = `Cung Tử Nữ ${unstable ? 'bị xung → con cái cần chú ý giáo dục' : 'ổn'}; sao con ${mainStar.vi}.`;
    } else {
      const rel = relation === '父' ? 'cha' : relation === '母' ? 'mẹ' : 'anh chị em';
      if (hasStar) verdict = `Sao ${rel} (${mainStar.vi}) có trong mệnh → duyên ${rel} ${mainStar.n >= 1.5 ? 'sâu, có hỗ trợ' : 'bình thường'}. Cung ${palaceGod}.`;
      else verdict = `Sao ${rel} mờ/ẩn → quan hệ với ${rel} hơi cách biệt, tự lập sớm.`;
    }

    out.push({
      relation, relVi, stars, mainStar: mainStar.vi, hasStar,
      palace: PALACE_VI[palKey], palaceGod, stable: !unstable, starInPalace, verdict,
    });
  }
  return out;
}
