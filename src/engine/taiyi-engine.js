// taiyi-engine.js — 太乙神数 (三式之一, QUOC VAN, BÍ TRUYEN/CAM KY) 值年局
// Nguon: 太乙神数 (积年公式 baike + 16神将 zhihu + 南齐书). Day la tam thuc CAM KY nhat —
// historically dung cho QUOC GIA tri loạn (国运). Công thức: 太乙积年 = 10153917 + năm.
// 太乙行九宫 (bo trung cung), 主客/掩迫囚击 = 吉凶. 16神将 la lop sau (bí mật).
//
// ⚠ CAM KY / honest: 太乙 co nhieu 'ban' khac nhau (诚意刘公 chỉnh lý) → cong thuc tich nam
// co the khac bang. Day la ban 杨惟德 (宋, 庆历积年). 16神将 vi tri + 72 cu the la lop sau.

// 太乙行九宫: 太乙 di chuyen qua 8 cung (bo 中宫 5). Thu tu: 1,2,3,4,6,7,8,9.
const TAIYI_PALACES = ['1', '2', '3', '4', '6', '7', '8', '9']; // 八卦 + trung cung
const PALACE_NAME = {
  '1': '一宫 (Khảm/北, 主 —tuong 内)', '2': '二宫 (Khôn/西南)', '3': '三宫 (Chấn/东, 主 nội)',
  '4': '四宫 (Tốn/东南)', '6': '六宫 (Càn/西北, KHACH ngoại)', '7': '七宫 (Đoài/西, KHACH)',
  '8': '八宫 (Cấn/东北, KHACH)', '9': '九宫 (Ly/南, KHACH ngoại)',
};

// 太乙积年 (杨惟德 庆历积年 he): 10153917 + năm công lịch
export function taiyiJiNian(year) {
  return 10153917 + year;
}

// 阳局数 = 积年 % 72 (72 cu 1 chu ky)
export function yangJu(jiNian) {
  const ju = ((jiNian % 72) + 72) % 72;
  return ju === 0 ? 72 : ju; // 1-72
}

// 太乙宫 vị (太乙行九宫, bo trung cung) — 太乙 moi nam tien 1 cung trong 8 cung
export function taiyiGong(jiNian) {
  const idx = ((jiNian - 1) % 8 + 8) % 8;
  const g = TAIYI_PALACES[idx];
  return { gong: g, name: PALACE_NAME[g], isZhu: ['1', '2', '3', '4'].includes(g) };
}

// 主客吉凶 — 太乙 o cung CHU (1-4) = 主 thắng (cat), cung KHACH (6-9) = 客 thắng (hung/bien)
// + 掩/迫/囚/击 la lop 16神将 (bí mật, khong tinh o day)
export function zhuKeJudgment(gong) {
  if (gong.isZhu) {
    return '太乙 ở cung CHỦ (nội) → 主 thắng → năm "noi luc" on đinh, cat cho noiluc/ahn đinh.';
  }
  return '太乙 ở cung KHÁCH (ngoại) → 客 thắng → năm có "ngoại luc" manh, bien đong ngoai giao/chien su/co hoi ben ngoai.';
}

// === assessTaiyi — tong hop (国运 tiên tri, BÍ TRUYEN/CAM KY) ===
export function assessTaiyi(year) {
  const jiNian = taiyiJiNian(year);
  const ju = yangJu(jiNian);
  const gong = taiyiGong(jiNian);
  const zhuKe = zhuKeJudgment(gong);
  return {
    year, taiyiJiNian: jiNian, yangJu: ju, taiyiGong: gong,
    zhuKe,
    secretLayer: '16神将 (太乙/文昌/始击/主大将/主参将/客大将/客参将/计神) vị tri + 掩/迫/囚/击 = lop SAU (bí mật, can bang 神将 đầy đủ). Day chi tinh 主/客 + cung.',
    verdict: `Năm ${year}: 太乙积年=${jiNian}, 阳局=${ju}/72, 太乙 ở ${gong.name}. ${zhuKe} (太乙神数 = tam thức QUỐC VẬN, cấm kị, dùng cho trị quốc).`,
    note: '⚠ Nhiều bản 太乙 khác nhau (诚意刘公 chỉnh lý) → công thức tích năm có thể khác. Đây là bản 杨惟德 (宋). Tham chiếu +主/客 logic; 16神将/掩迫囚击 sâu hơn cần bảng đầy đủ.',
  };
}
