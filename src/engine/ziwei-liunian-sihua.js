// ============================================================================
//  LƯU NIÊN TỨ HÓA 流年四化 — ANNUAL FLYING FOUR TRANSFORMATIONS → NATAL PALACE
//  Mỗi năm, thiên can năm sinh ra 4 hóa (禄/权/科/忌) → "bay" vào mệnh bàn gốc,
//  rơi vào cung nào của lá số bẩm sinh → cho biết LĨNH VỰC NÀO được kích hoạt
//  cho tài lộc / quyền lực / danh tiếng / trở ngại trong năm đó.
//
//  Khác `flying-sihua.js` (phi tinh GIỮA các cung, nguồn = can cung) và khác
//  `ziwei-liunian.js` (chỉ trả bảng四化 + cung lưu niên đang đứng): module này
//  nhận(R, year), lấy can năm → 4 hóa → dò cung bẩm sinh chứa sao được hóa →
//  gắn nhãn lĩnh vực (Tài Bạch/Quan Lộc/Phu Thê...) + phán "năm tốt cho X".
//
//  Nguồn: 紫微斗数 流年四化, 中州派/三合派 luận lưu niên四化入本命盘.
// ============================================================================
import { computeZiwei, computeSihua } from './ziwei.js';
import { Solar } from 'lunar-javascript';

// Bảng 十干四化 (theo năm can) — đồng bộ với ziwei.js SIHUA_TABLE để module tự đứng.
const SIHUA_TABLE = {
  甲: ['廉贞', '破军', '武曲', '太阳'], 乙: ['天机', '天梁', '紫微', '太阴'],
  丙: ['天同', '天机', '文昌', '廉贞'], 丁: ['太阴', '天同', '天机', '巨门'],
  戊: ['贪狼', '太阴', '右弼', '天机'], 己: ['武曲', '贪狼', '天梁', '文曲'],
  庚: ['太阳', '武曲', '太阴', '天同'], 辛: ['巨门', '太阳', '文曲', '文昌'],
  壬: ['天梁', '紫微', '左辅', '武曲'], 癸: ['破军', '巨门', '太阴', '贪狼'],
};
const SIHUA_KEY = ['禄', '权', '科', '忌'];
const SIHUA_VI = {
  禄: 'Hóa Lộc',
  权: 'Hóa Quyền',
  科: 'Hóa Khoa',
  忌: 'Hóa Kỵ',
};
const SIHUA_TONE = { 禄: 'cat', 权: 'cat', 科: 'cat', 忌: 'hung' };

// Ý nghĩa "kích hoạt" theo loại hóa rơi vào lĩnh vực cung nào.
// Dùng cho one-liner + brief.
const HUA_DOMAIN_HINT = {
  禄: 'thuận lợi, duyên, tiền đến',
  权: 'quyền lực, chủ động, nắm giữ',
  科: 'danh tiếng, quý nhân, học vấn',
  忌: 'trở ngại, thị phi, phiền muộn',
};

// Từ nhãn cung (zh) → tên lĩnh vực ngắn (để ráp câu: "năm tốt cho TIỀN BẠC").
const PALACE_DOMAIN = {
  命宫: { vi: 'Mệnh', short: 'BẢN THÂN/SỨC KHOẺ', area: 'self' },
  兄弟: { vi: 'Huynh Đệ', short: 'ANH CHỊ EM/ĐỒNG NGHIỆP', area: 'siblings' },
  夫妻: { vi: 'Phu Thê', short: 'VỢ CHỒNG/TÌNH CẢM', area: 'spouse' },
  子女: { vi: 'Tử Nữ', short: 'CON CÁI/HỌC TRÒ', area: 'children' },
  财帛: { vi: 'Tài Bạch', short: 'TIỀN BẠC/THU NHẬP', area: 'wealth' },
  疾厄: { vi: 'Tật Ách', short: 'SỨC KHOẺ/BỆNH TẬT', area: 'health' },
  迁移: { vi: 'Thiên Di', short: 'DI CHUYỂN/XUẤT NGOẠI', area: 'travel' },
  奴仆: { vi: 'Nô Bộc', short: 'BẠN BÈ/PHỤ THUỘC', area: 'friends' },
  官禄: { vi: 'Quan Lộc', short: 'SỰ NGHIỆP/CÔNG DANH', area: 'career' },
  田宅: { vi: 'Điền Trạch', short: 'NHÀ CỬA/BẤT ĐỘNG SẢN', area: 'property' },
  福德: { vi: 'Phúc Đức', short: 'TINH THẦN/PHÚC ĐỨC', area: 'mind' },
  父母: { vi: 'Phụ Mẫu', short: 'CHA MẸ/CẤP TRÊN', area: 'parents' },
};

/**
 * Lưu niên四化 nhập mệnh bàn: năm can → 4 hóa → cung bẩm sinh nào chứa sao được hóa.
 *
 * @param {object} R — kết quả analyze() (cần R.chart.input.{year,month,day,hour,minute,gender})
 *                     HOẶC trực tiếp kết quả computeZiwei() truyền vào R.z (ưu tiên R.z)
 * @param {number} year — năm lưu niên cần luận (vd 2026)
 * @returns {{
 *   year, yearGan, yearGanZhi,
 *   activated: [{ hua, huaVi, star, tone, domain, palaceZh, palaceVi, placed, hint }],
 *   summary,           // one-liner VH: "化禄→Tài Bạch: năm tốt cho tiền…"
 *   wealth, career, spouse,  // shortcut: object activated cho 3 cung được hỏi nhiều nhất (nếu có)
 *   best, worst,             // activated cát mạnh nhất / hung rõ nhất
 * }}
 */
export function annualSihuaToNatal(R, year) {
  if (!R) return null;

  // 1. Lấy mệnh bàn gốc (computeZiwei)
  let z = R.z || R.ziwei;
  if (!z && R.chart?.input) {
    const i = R.chart.input;
    z = computeZiwei(i.year, i.month, i.day, i.hour, i.minute, i.gender);
  }
  if (!z) return null;

  // 2. Thiên can năm lưu niên
  const solar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const yearGan = solar.getLunar().getYearGan();
  const yearZhi = solar.getLunar().getYearZhi();
  const yearGanZhi = yearGan + yearZhi;

  // 3. Star map: sao → chi cung (mainStars + fuxing để四化 dò được cả phụ tinh 文昌/文曲/左辅/右弼)
  const starMap = { ...(z.mainStars || {}) };
  if (z.fuxing?.stars) {
    for (const s of z.fuxing.stars) starMap[s.star] = s.atZhi;
  }

  // 4. Map chi → palace (để dò cung chứa sao)
  const chiToPalace = {};
  for (const p of z.palaces) chiToPalace[p.zhi] = p;

  // 5. Bảng四化 của can năm → dò cung bẩm sinh
  const four = SIHUA_TABLE[yearGan] || SIHUA_TABLE['癸'];
  const activated = [];
  for (let i = 0; i < 4; i++) {
    const hua = SIHUA_KEY[i]; // 禄/权/科/忌
    const star = four[i];
    const atZhi = starMap[star] || null; // chi cung chứa sao được hóa
    const palace = atZhi ? chiToPalace[atZhi] : null;
    const palaceZh = palace?.zh || null;
    const domain = palaceZh ? (PALACE_DOMAIN[palaceZh] || null) : null;
    activated.push({
      hua,
      huaVi: SIHUA_VI[hua],
      star,
      tone: SIHUA_TONE[hua],
      starZhi: atZhi,
      palaceZh,
      palaceVi: domain?.vi || null,
      domain: domain?.short || null,
      area: domain?.area || null,
      placed: !!palaceZh,
      hint: HUA_DOMAIN_HINT[hua],
    });
  }

  // 6. One-liner tóm tắt (theo cung được kích hoạt)
  const catList = activated.filter((a) => a.tone === 'cat' && a.placed);
  const hungList = activated.filter((a) => a.tone === 'hung' && a.placed);
  const missList = activated.filter((a) => !a.placed);

  const fmt = (a) => `${a.hua}${a.star}→${a.palaceVi || '?'}`;
  const catStr = catList.length ? catList.map(fmt).join(', ') : '(không)';
  const hungStr = hungList.length ? hungList.map(fmt).join(', ') : '(không)';

  const summary =
    `Năm ${year} (${yearGanZhi}) — Lưu niên四化 nhập mệnh bàn: ` +
    `CÁT [${catStr}] = kích hoạt tốt các lĩnh vực đó; ` +
    `KỴ [${hungStr}] = lĩnh vực đó năm nay có trở ngại/thị phi.` +
    (missList.length ? ` (Sao ${missList.map((a) => a.star).join('/')} không đặt được cung.)` : '');

  // 7. Shortcut cho 3 cung hỏi nhiều
  const findWealth = activated.find((a) => a.area === 'wealth');
  const findCareer = activated.find((a) => a.area === 'career');
  const findSpouse = activated.find((a) => a.area === 'spouse');
  const mkShortcut = (a) => (a ? { hua: a.hua, huaVi: a.huaVi, star: a.star, tone: a.tone, hint: a.hint } : null);

  // 8. best/worst: cát có "禄" ưu tiên, hung luôn là 忌
  const best = activated.find((a) => a.hua === '禄' && a.placed) || catList[0] || null;
  const worst = activated.find((a) => a.hua === '忌' && a.placed) || hungList[0] || null;

  return {
    year,
    yearGan,
    yearGanZhi,
    activated,
    summary,
    wealth: mkShortcut(findWealth),
    career: mkShortcut(findCareer),
    spouse: mkShortcut(findSpouse),
    best,
    worst,
  };
}

export { SIHUA_TABLE, SIHUA_KEY, PALACE_DOMAIN };
