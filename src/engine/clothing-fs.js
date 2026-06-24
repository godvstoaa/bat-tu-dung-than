// ============================================================================
//  TRANG PHỤC PHONG THỦY 穿衣风水 — CLOTHING BY OCCASION & ELEMENT
//  "Mặc gì đi làm/hẹn hò/đàm phán/dự tiệc?" theo Dụng Thần + ngũ hành + occasion.
//  Nguồn: 五行色彩学, 通胜 穿衣宜忌.
// ============================================================================
import { WX_VI } from './constants.js';

const WX_COLORS = {
  木: { primary: ['xanh lá', 'xanh ngọc', 'xanh mint'], accent: ['nâu xanh', 'olive'], vi: 'Mộc' },
  火: { primary: ['đỏ', 'hồng', 'tím', 'cam'], accent: ['đỏ bordeaux', 'đỏ gạch'], vi: 'Hỏa' },
  土: { primary: ['vàng', 'nâu đất', 'be', 'camel'], accent: ['vàng kem', 'cà phê'], vi: 'Thổ' },
  金: { primary: ['trắng', 'xám', 'bạc', 'ánh kim'], accent: ['ngà', 'champagne'], vi: 'Kim' },
  水: { primary: ['đen', 'xanh navy', 'xanh biển đậm'], accent: ['xám than', 'than chì'], vi: 'Thủy' },
};

const WX_FABRIC = {
  木: 'cotton, linen, sợi tre (tự nhiên, thoáng)',
  火: 'lụa, chiffon, satin (mượt, nhẹ)',
  土: 'cotton dày, tweed, kaki (vững, chắc)',
  金: 'metallic, da, vải pha kim loại (sắc, cứng)',
  水: 'polyester, modal, jersey (mềm, chảy)',
};

const OCCASIONS = {
  interview: { vi: 'Phỏng vấn/Xin việc', goal: 'chuyên nghiệp, đáng tin', wantYin: true, wantStable: true },
  date: { vi: 'Hẹn hò', goal: 'hấp dẫn, duyên', wantAttract: true },
  business: { vi: 'Đàm phán/Ký kết', goal: 'uy lực, quyết đoán', wantAuthority: true },
  wedding: { vi: 'Đám cưới (khách)', goal: 'vui, may mắn, không át cô dâu chú rể', wantJoy: true },
  funeral: { vi: 'Đám tang', goal: 'trang trọng, tôn trọng', wantSomber: true },
  exam: { vi: 'Thi cử', goal: 'tĩnh tâm, tập trung', wantCalm: true },
  travel: { vi: 'Du lịch/Xuất hành', goal: 'thoải mái, may mắn', wantFlow: true },
  daily: { vi: 'Hàng ngày', goal: 'cân bằng, khỏe', wantBalance: true },
};

const OCCASION_OVERRIDE = {
  funeral: { colors: ['đen', 'trắng', 'xám', 'navy'], avoid: ['đỏ', 'hồng', 'cam'] }, // tang = trang trọng, không màu nóng
  wedding: { colors: [], avoid: ['trắng'] }, // không mặc trắng (át cô dâu)
};

/**
 * @returns {{ occasions:[{key, vi, goal, colors, accent, fabric, avoid, tip}], dailyColors, advice }}
 */
export function clothingByOccasion(R) {
  const dungWx = R.yong.primary;
  const xiWx = R.yong.xi;
  const kyWx = R.yong.ji;
  const dungColors = WX_COLORS[dungWx];
  const xiColors = WX_COLORS[xiWx];
  const kyColors = WX_COLORS[kyWx];
  const dungFabric = WX_FABRIC[dungWx];

  const occasions = Object.entries(OCCASIONS).map(([key, info]) => {
    let colors, accent, avoid, tip;

    // Tang: override
    if (key === 'funeral') {
      colors = ['đen', 'trắng', 'xám'];
      accent = ['navy'];
      avoid = ['đỏ', 'hồng', 'cam', 'vàng rực'];
      tip = 'Trang trọng, tối giản — không màu nóng/nhiều hoa.';
    }
    // Cưới: avoid trắng
    else if (key === 'wedding') {
      colors = dungColors.primary.slice(0, 2);
      accent = xiColors.primary.slice(0, 1);
      avoid = ['trắng (át cô dâu)', ...kyColors.primary.slice(0, 1)];
      tip = 'Mặc màu Dụng Thần + trang sức vàng/bạc → may mắn.';
    }
    // Phỏng vấn: thêm Kim (trắng/xám) cho chuyên nghiệp
    else if (key === 'interview') {
      colors = [...dungColors.primary.slice(0, 2), 'trắng'];
      accent = dungColors.accent;
      avoid = [...kyColors.primary.slice(0, 1)];
      tip = 'Trắng/xám + Dụng Thần accent → chuyên nghiệp + may mắn.';
    }
    // Đàm phán: thêm Đỏ (uy lực) hoặc Đen (quyết đoán)
    else if (key === 'business') {
      colors = [...dungColors.primary.slice(0, 1), 'đen', 'navy'];
      accent = dungColors.accent;
      avoid = [...kyColors.primary.slice(0, 1)];
      tip = 'Đen/navy + Dụng accent → uy lực + may mắn.';
    }
    // Hẹn hò: đào hoa kích hoạt
    else if (key === 'date') {
      colors = [...dungColors.primary.slice(0, 2), ...xiColors.primary.slice(0, 1)];
      accent = xiColors.accent;
      avoid = [...kyColors.primary.slice(0, 1)];
      tip = 'Mặc màu Dụng + Hỷ → duyên + hấp dẫn. Thêm nước hoa hương Dụng.';
    }
    // Thi cử: xanh/calme
    else if (key === 'exam') {
      colors = [...dungColors.primary.slice(0, 1), 'xanh nhạt', 'trắng'];
      accent = dungColors.accent;
      avoid = ['đỏ quá mạnh', 'đen'];
      tip = 'Màu sáng + Dụng Thần → tĩnh tâm, may mắn thi cử.';
    }
    // Hàng ngày
    else {
      colors = dungColors.primary;
      accent = [...dungColors.accent, ...xiColors.primary.slice(0, 1)];
      avoid = kyColors.primary.slice(0, 1);
      tip = `Mặc ${dungColors.primary[0]} làm nền + ${xiColors.primary[0]} accent.`;
    }

    return { key, vi: info.vi, goal: info.goal, colors, accent, fabric: dungFabric, avoid, tip };
  });

  const dailyColors = `Nền: ${dungColors.primary.join('/')}. Accent: ${(dungColors.accent[0] || '')}, ${xiColors.primary[0] || ''}. Tránh: ${kyColors.primary[0] || '?'}.`;
  const advice = `Mặc chính màu ${dungColors.primary[0]} (${WX_VI[dungWx]} = Dụng Thần) + accent ${xiColors.primary[0] || ''} (${WX_VI[xiWx]} = Hỷ). ` +
    `Chất liệu: ${dungFabric}. ` +
    `Tránh: ${kyColors.primary[0]} (${WX_VI[kyWx]} = Kỵ). ` +
    `Trang sức: ${dungWx === '金' ? 'vàng/bạc/kim loại' : dungWx === '木' ? 'gỗ/ngọc cẩm thạch' : dungWx === '火' ? 'hồng lam/bloodstone' : dungWx === '土' ? 'thạch anh vàng/citrine' : 'thạch anh đen/obsidian'}.`;

  return { occasions, dailyColors, dungColors, dungFabric, advice };
}

export { WX_COLORS, WX_FABRIC };
