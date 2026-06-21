// ============================================================================
//  HUYỀN KHÔNG PHI TINH 玄空飞星 — phong thủy không-gian kiểu đại sư HK
//  Nguồn: 三元九运, 玄空飞星运盘 (verified: 九运 2024-2043 九紫入中宫, thuận phi).
//  Đây là phương pháp thực dụng giới siêu giàu HK (Lý Gia Thành…) dùng cho nhà/trụ sở.
//  运盘 = cố định 20 năm/một vận; star ở mỗi phương → định旺衰 khu vực đó cả vận.
// ============================================================================

// 三元九运 — xác định vận của một năm dương lịch
export function determineYun(year) {
  // 1864 = thượng nguyên nhất vận khởi đầu
  const idx = Math.floor((year - 1864) / 20); // 0..∞
  const yun = (idx % 9) + 1; // 1..9
  const yuan = idx < 3 ? 'Thượng Nguyên' : idx < 6 ? 'Trung Nguyên' : 'Hạ Nguyên';
  const startYear = 1864 + idx * 20;
  return { yuan, yun, startYear, endYear: startYear + 19 };
}

// 9 cung theo thứ tự thuận phi (洛书): trung→tây bắc→tây→đông bắc→nam→bắc→tây nam→đông→đông nam
const FLY_ORDER = ['Trung cung', 'Tây Bắc', 'Chính Tây', 'Đông Bắc', 'Chính Nam', 'Chính Bắc', 'Tây Nam', 'Chính Đông', 'Đông Nam'];

// 9 sao — tên, hán việt, ngũ hành, phẩm chất theo generic (được điều chỉnh theo vận当令)
export const STAR = {
  1: { name: 'Nhất Bạch', han: '一白 贪狼', wx: 'Thủy', base: 'cát', vi: 'đào hoa, nhân duyên, sự nghiệp, trí tuệ' },
  2: { name: 'Nhị Hắc', han: '二黑 巨门', wx: 'Thổ', base: 'hung', vi: 'bệnh tật, thương tổn (病符)' },
  3: { name: 'Tam Bích', han: '三碧 禄存', wx: 'Mộc', base: 'hung', vi: 'thị phi, khẩu thiệt, tranh cãi' },
  4: { name: 'Tứ Lục', han: '四绿 文曲', wx: 'Mộc', base: 'cát', vi: 'văn chương, học vấn, thi cử (文昌)' },
  5: { name: 'Ngũ Hoàng', han: '五黄 廉贞', wx: 'Thổ', base: 'đại hung', vi: 'tai hoạ,意外的 (灾煞, "nhị ngũ giao tất tổn chủ")' },
  6: { name: 'Lục Bạch', han: '六白 武曲', wx: 'Kim', base: 'cát', vi: 'quyền lực, võ quý, uy' },
  7: { name: 'Thất Xích', han: '七赤 破军', wx: 'Kim', base: 'hung', vi: 'khẩu thiệt, hao tổn, hình thương' },
  8: { name: 'Bát Bạch', han: '八白 左辅', wx: 'Thổ', base: 'cát', vi: 'tài lộc, điền sản (tài tinh)' },
  9: { name: 'Cửu Tử', han: '九紫 右弼', wx: 'Hỏa', base: 'đại cát', vi: 'hỷ khánh, đào hoa lành, phúc lộc (đương lệnh đại cát)' },
};

// phẩm chất star theo vận (đương lệnh = đại cát; tương lai vượng; thoái/khí = giảm)
function qualityInYun(star, yun) {
  if (star === yun) return 'đương lệnh (cực vượng)';
  if (star === (yun % 9) + 1) return 'sinh khí tương lai (cát)'; // sao kế tiếp
  if (star === ((yun + 7) % 9) + 1) return 'thoái khí'; // sao cũ
  return STAR[star].base === 'đại hung' ? 'tử khí (đại hung)' : STAR[star].base === 'hung' ? 'khí hung' : (STAR[star].base === 'đại cát' ? 'hơi vượng' : 'bình');
}

/**
 * Vận bàn 9 cung cho năm (dùng vận của năm đó).
 * @returns {{ yun, yuan, range, pan:[{palace, star, info, quality}], wangFang[], xiongFang[], advice }}
 */
export function xuankongPan(year) {
  const { yuan, yun, startYear, endYear } = determineYun(year);
  // star vào cung: trung cung = yun; các cung tiếp theo thuận phi, star = yun+1, yun+2...
  const pan = FLY_ORDER.map((palace, i) => {
    const star = ((yun - 1 + i) % 9) + 1;
    const info = STAR[star];
    const q = qualityInYun(star, yun);
    return { palace, star, info, quality: q };
  });
  const wangFang = pan.filter((p) => p.quality.includes('vượng') || p.quality.includes('sinh khí'));
  const xiongFang = pan.filter((p) => p.quality.includes('hung') || p.info.base === 'đại hung' || p.info.base === 'hung');
  const advice = [
    `${yuan} ${yun}运 (${startYear}–${endYear}) — 当令 tinh = ${STAR[yun].han} (${STAR[yun].name}, ${STAR[yun].wx}). Đây là sao mạnh nhất cả vận, khu vực có nó nên kích hoạt (cửa/phòng khách/văn phòng).`,
    `Kích hoạt 旺 tại: ${wangFang.map((p) => p.palace + '(' + p.info.name + ')').join(', ')}.`,
    `TRÁNH khu vực hung (đặc biệt Ngũ Hoàng/Nhị Hắc): ${xiongFang.map((p) => p.palace + '(' + p.info.name + ')').join(', ')} — không động thổ, giữ yên, có thể hóa bằng kim đồng/khí流转.`,
    `"Nhị Ngũ giao tất tổn chủ" — tránh để 2黑+5黄 cùng phương/cạnh nhau; nếu có → dùng Kim (đồng铃) hóa Thổ sát.`,
  ];
  return { yun, yuan, range: `${startYear}–${endYear}`, pan, wangFang, xiongFang, advice, currentStar: STAR[yun] };
}

// ---- 流年飞星 (yearly flying star — đổi mỗi năm, cực thực dụng) ----
// 年星入中 = (1865 - year) mod 9, 0→9. Anchor: 2024→三碧(3) ✓
export function yearFlyingStar(year) {
  const center = ((1865 - year) % 9 + 9) % 9 || 9;
  // 顺飞 洛书: trung→tây bắc→tây→đông bắc→nam→bắc→tây nam→đông→đông nam
  const FLY = ['Trung cung', 'Tây Bắc', 'Chính Tây', 'Đông Bắc', 'Chính Nam', 'Chính Bắc', 'Tây Nam', 'Chính Đông', 'Đông Nam'];
  const pan = FLY.map((palace, i) => {
    const star = ((center - 1 + i) % 9) + 1;
    const info = STAR[star];
    return { palace, star, name: info.name, wx: info.wx, base: info.base, vi: info.vi };
  });
  const cat = pan.filter((p) => p.base === 'cát' || p.base === 'đại cát');
  const xiong = pan.filter((p) => p.base === 'hung' || p.base === 'đại hung');
  return { year, center, centerStar: STAR[center], pan, cat, xiong,
    advice: `${year} 年飞星: 中宫 = ${STAR[center].han} (${STAR[center].name}). 激活 cát: ${cat.map(p=>p.palace+'('+p.name+')').join(', ')}. 避免 hung: ${xiong.map(p=>p.palace+'('+p.name+')').join(', ')} — đặc biệt 5黄(Nam 2026) kỵ động thổ, 2黑(西北) kỵ nghỉ ngủ ở đây.` };
}
