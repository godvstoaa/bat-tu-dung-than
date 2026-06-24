// ============================================================================
//  PHONG THỦY PHÒNG CÁ NHÂN 个人风水配套
//  Theo Dụng Thần + 八宅 mệnh quái → bố trí CHI TIẾT từng phòng trong nhà.
//  Khác zhai.js (chỉ 4 hướng cát/hung): module này gắn TỪNG PHÒNG với
//  công năng cụ thể (ngủ/làm việc/nấu ăn/vệ sinh) theo cả Dụng + Bát Trạch.
//  Nguồn: 八宅明镜, 玄空风水 实用篇.
// ============================================================================
import { WX_VI } from './constants.js';

const ROOM_NEEDS = {
  bedroom: { vi: 'Phòng ngủ', dungRole: 'nghỉ ngơi, phục hồi — cần sự yên tĩnh, ôn hòa', preferYin: true, preferStable: true },
  office: { vi: 'Phòng làm việc', dungRole: 'tập trung, sáng tạo, kiếm tiền — cần năng lượng dương, kích thích', preferYang: true, preferActive: true },
  kitchen: { vi: 'Bếp', dungRole: 'nấu nướng, nuôi dưỡng — HỎA, cần thông thoáng', element: '火' },
  bathroom: { vi: 'Nhà vệ sinh', dungRole: 'thải độc — THỦY, cần đặt ở hướng HUNG để ép tà', element: '水', preferHung: true },
  living: { vi: 'Phòng khách', dungRole: 'tiếp khách, giao tế — cần rộng, sáng, vượng khí', preferYang: true },
  study: { vi: 'Phòng học', dungRole: 'học tập, thi cử — cần yên,文昌 kích thích trí tuệ', preferCalm: true },
};

// Hướng ngũ hành
const DIR_WX = {
  'Đông': '木', 'Đông Nam': '木',
  'Nam': '火',
  'Trung cung': '土', 'Đông Bắc': '土', 'Tây Nam': '土',
  'Tây': '金', 'Tây Bắc': '金',
  'Bắc': '水',
};

const WX_DIRS = {
  木: ['Đông', 'Đông Nam'],
  火: ['Nam'],
  土: ['Trung cung', 'Đông Bắc', 'Tây Nam'],
  金: ['Tây', 'Tây Bắc'],
  水: ['Bắc'],
};

const AUSPICIOUS_LABEL = { '生气': 'Sinh Khí (cát nhất — tài lộc, sinh vượng)', '天医': 'Thiên Y (sức khoẻ, quý nhân)', '延年': 'Diên Niên (nhân duyên, trường thọ)', '伏位': 'Phục Vị (bình yên, ổn định)' };
const INAUSPICIOUS_LABEL = { '绝命': 'Tuyệt Mệnh (xấu nhất)', '五鬼': 'Ngũ Quỷ (thị phi, tiểu nhân)', '六杀': 'Lục Sát (phá tài, thị phi)', '祸害': 'Họa Hại (phiền muộn, bệnh)' };

/**
 * @param auspicious - { Sinh Khí: 'hướng', ... } từ computeZhai
 * @param yong - { primary, xi, ji, chou } từ analyze
 * @returns {{ rooms:[{key, vi, dungRole, bestDir, bestWx, why, altDir, avoidDir, avoidWhy, tips}] }}
 */
export function personalFengShui(auspicious, inauspicious, yong) {
  const rooms = [];

  for (const [key, info] of Object.entries(ROOM_NEEDS)) {
    let bestDir = '', bestWx = '', why = '', altDir = '', avoidDir = '', avoidWhy = '', tips = [];

    if (info.preferHung) {
      // Nhà vệ sinh: đặt hướng HUNG
      const hungDirs = Object.values(inauspicious || {});
      bestDir = hungDirs[0] || 'Tây Bắc';
      why = `Đặt ở hướng HUNG (${bestDir}) để ép tà — "tọa hung hướng cát".`;
      tips.push('Giữ sạch sẽ, đóng nắp bồn cầu, thêm cây xanh.');
    } else {
      // Các phòng khác: ưu tiên hướng mang hành Dụng Thần + hướng cát Bát Trạch
      const dungDirs = WX_DIRS[yong.primary] || [];
      const xiDirs = WX_DIRS[yong.xi] || [];
      const catDirs = Object.values(auspicious || {});

      // Tìm hướng trùng cả Dụng Thần + Bát Trạch cát
      const perfect = dungDirs.find(d => catDirs.includes(d));
      const good = dungDirs.find(d => !catDirs.includes(d)) || xiDirs.find(d => catDirs.includes(d));

      if (perfect) { bestDir = perfect; bestWx = yong.primary; why = `Trùng Dụng Thần (${WX_VI[yong.primary]}) + Bát Trạch cát — TỐT NHẤT.`; }
      else if (good) { bestDir = good; bestWx = WX_DIRS_TO_WX(good); why = `Hành Dụng/Hỷ Thần — rất tốt.`; }
      else if (catDirs[0]) { bestDir = catDirs[0]; why = `Bát Trạch cát (không trùng Dụng nhưng vẫn tốt).`; }
      else { bestDir = dungDirs[0] || 'Đông Nam'; why = `Hành Dụng Thần (không có Bát Trạch cát trùng).`; }

      altDir = good || dungDirs[1] || '';

      // Hướng kỵ: Kỵ Thần + Bát Trạch hung
      const kyDirs = WX_DIRS[yong.ji] || [];
      const hungDirs = Object.values(inauspicious || {});
      const worst = kyDirs.find(d => hungDirs.includes(d)) || kyDirs[0] || hungDirs[0];
      if (worst) { avoidDir = worst; avoidWhy = `Hành Kỵ Thần (${WX_VI[yong.ji]}) ${hungDirs.includes(worst) ? '+ Bát Trạch hung' : ''} — TRÁNH.`; }

      // Tips theo phòng
      if (key === 'bedroom') { tips.push('Đầu hướng về hướng Dụng Thần khi ngủ.', 'Màu chăn/ra giường theo Dụng Thần.', 'Tranh gương đối diện giường — kỵ.'); }
      else if (key === 'office') { tips.push('Bàn ngồi nhìn về hướng cát (Sinh Khí/Diên Niên).', 'Cây phong thủy đặt góc Đông Nam (Tài vị).', 'Sau lưng có tường vững, không cửa sổ.'); }
      else if (key === 'kitchen') { tips.push('Bếp lò không đối diện cửa chính.', 'Tủ lạnh (Thủy) không cạnh bếp lò (Hỏa) — Thủy Hỏa tương xung.', 'Hóa giải: đảo tủ hoặc đặt cây xanh giữa.'); }
      else if (key === 'study') { tips.push('Bàn học ngồi nhìn về hướng Văn Xương.', 'Đặt tháp Văn Xương/đá phong thủy trên bàn.', 'Ánh sáng đầy đủ, tránh góc tối.'); }
      else if (key === 'living') { tips.push('Sofa tựa tường, không tựa cửa sổ.', 'Cây lớn ở góc Tài vị (Đông Nam).', 'Sảnh sáng, thoáng, không chất đồ.'); }
    }

    rooms.push({ key, vi: info.vi, dungRole: info.dungRole, bestDir, bestWx, why, altDir, avoidDir, avoidWhy, tips });
  }

  return { rooms };
}

function WX_DIRS_TO_WX(dir) { return DIR_WX[dir] || ''; }
