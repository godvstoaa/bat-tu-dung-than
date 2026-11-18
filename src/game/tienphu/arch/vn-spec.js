// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ CUNG ĐÌNH HUẾ. Số lấy từ docs/tienphu-nghiencuu/07-hue.md (mục id tương ứng, §8 «đề xuất
//  cho game»); hệ gian theo C1.1 (gian giữa rộng nhất, lẻ, chái ~65–70 % gian giữa). Mái chồng diêm (C3.1), nhà kép (C3.2).
// ============================================================================
const k = (arr, f) => arr.map((x) => +(x * f).toFixed(2));
const TH_BAYS = [3.61, 3.87, 5.23, 5.23, 5.53, 5.23, 5.23, 3.87, 3.61];   // Thái Hòa thật (C1.1, thước × 0,425)
const TH_SPANS = [3.57, 4.75, 4.75, 6.34, 6.34, 3.57];                   // 29,3 m tim cột (C1.1), chia hiên / tiền điện / chính điện / hiên

const hall = (o) => ({ roofDesc: (o.top?.split != null ? 'nhà kép 2 nóc (trùng thiềm điệp ốc), ' : '') + 'mái chồng diêm 2 tầng + cổ diêm, ngói ' + ((o.tile || 'Yellow') === 'Green' ? 'thanh lưu ly (xanh)' : 'hoàng lưu ly (vàng)'), type: 'hall', front: 'hien', back: 'plaster', ends: 'plaster', tile: 'Yellow', dao: 'dragon', ...o });
const dinh = (o) => ({ roofDesc: 'phương đình 16 cột, 2 tầng mái, ngói ' + ((o.tile || 'Yellow') === 'Green' ? 'thanh lưu ly (xanh)' : 'hoàng lưu ly (vàng)'), type: 'hall', kind: 'dinh', interior: false, truss: false, chaiWin: null, tile: 'Yellow', dao: 'dragon', ...o });

export const HUE_SPECS = {
  main: hall({
    name: 'Điện Thái Hòa 太和殿', proto: 'Điện Thái Hòa, Hoàng Thành Huế (1805, dời dựng 1833): nhà kép trùng thiềm điệp ốc, tiền điện 7 gian 2 chái đơn + chính điện, 80 cột lim, 2 tầng mái hoàng lưu ly',
    bays: k(TH_BAYS, 1.136), spans: k(TH_SPANS, 1.136), ph: 2.4, colQ: 4.6, colD: 0.6,
    base: { mx: 1.48, mzF: 0.69, mzB: 0.69, stairs: [{ side: 1, cx: 0, w: 4.4, n: 5, rail: 'dragon' }, { side: 1, cx: -12.05, w: 3.2, n: 5, rail: 'dragon' }, { side: 1, cx: 12.05, w: 3.2, n: 5, rail: 'dragon' }, { side: -1, cx: 0, w: 4.4, rail: 'dragon' }, { side: -1, cx: -12.05, w: 3.2 }, { side: -1, cx: 12.05, w: 3.2 }] },
    court: [
      { w: 44, d: 8, h: 1.3, pham: 5, phamX: 8.5, stairs: [{ cx: 0, w: 5, n: 5 }, { cx: -12, w: 3.4, n: 5 }, { cx: 12, w: 3.4, n: 5 }] },
      { w: 50, d: 8, h: 0.65, pham: 5, phamX: 9, stairs: [{ cx: 0, w: 5, n: 4 }, { cx: -12, w: 3.4, n: 4 }, { cx: 12, w: 3.4, n: 4 }] },
    ],
    front: 'hien', back: 'hien', chaiWin: 'round', low: { over: 1.9, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.9 }],
    top: { over: 1.3, ridge: 13.4, split: 3, ridgeH: 0.9, ornS: 1.3 }, orn: 'longGourd', ornFront: 'sun', daoS: 1.35,
    src: '07 › main §2, §8: thật 44 × 30,5 × 11,8 m, gian 3,61·3,87·5,23·5,23·5,53 (C1.1) × hệ số 1,136 → lưới 47,0 × 33,3 m, nền 50 × 34,7 m cao 1,1 m trên sân 2 cấp (Đan bệ 1,3 / Long trì 0,65 — tổng 2,4 m), nóc 13,4 m trên nền; mái hạ từ ~4,5 m, cổ diêm 0,9 m; 2 cửa sổ tròn chữ Thọ Ø 1,4 m ở chái; 3 hệ bậc trước + 3 sau. Chưa làm: ngai vàng / bửu tán, cột thếp bạc riêng cho hai hàng bên',
  }),
  canchanh: {
    roofDesc: 'nhà kép chồng diêm hoàng lưu ly + hồi lang thanh lưu ly', type: 'compound', name: 'Điện Cần Chánh 勤政殿', proto: 'Điện Cần Chánh, Tử Cấm Thành (1804, mất 1947, đang phục hồi): cùng sơ đồ Thái Hòa nhưng nhỏ hơn, nền thấp, có hồi lang 5 gian hai bên',
    parts: [
      hall({ at: [0, 0], bays: k(TH_BAYS, 0.908), spans: k(TH_SPANS, 0.908), ph: 1.1, colQ: 3.9, colD: 0.5,
        base: { mx: 1.19, mzF: 0.47, mzB: 0.47, stairs: [{ side: 1, cx: 0, w: 3.8, rail: 'dragon' }, { side: 1, cx: -9.64, w: 2.8 }, { side: 1, cx: 9.64, w: 2.8 }, { side: -1, cx: 0, w: 3.4 }] },
        front: 'hien', back: 'hien', low: { over: 1.6, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.85 }], top: { over: 1.3, ridge: 11, split: 3, ridgeH: 0.75 }, orn: 'longGourd', ornFront: 'sun', daoS: 1.15 }),
      { type: 'lang', at: [27.6, 0], path: [[-8.5, 0], [8.5, 0]], w: 3.5, colH: 3.0, bay: 3.4, ph: 0.6, tile: 'Green' },
      { type: 'lang', at: [-27.6, 0], path: [[-8.5, 0], [8.5, 0]], w: 3.5, colH: 3.0, bay: 3.4, ph: 0.6, tile: 'Green' },
    ],
    src: '07 › canchanh §2, §5, §8: 40 × 27,6 × 11 m, nền 1,1 m; tiền 7 gian 2 chái + chính 5 gian (cùng hệ gian Thái Hòa × 0,8); hồi lang 5 gian mái thanh lưu ly rộng 3,5 m, cao diềm ~3 m hai đầu hồi. Chưa làm: Văn Minh / Võ Hiển (điện phụ đầu hồi lang)',
  },
  tavu: hall({
    name: 'Tả Vu 左廡', proto: 'Tả Vu, Tử Cấm Thành (1819, sửa 1923): nhà dài thấp quay vào sân Cần Chánh, mái 2 tầng thanh lưu ly (quan văn)',
    bays: [2.6, 3.1, 3.2, 3.3, 3.6, 3.3, 3.2, 3.1, 2.6], spans: [2.3, 3.4, 3.4, 2.3], ph: 0.6, colQ: 2.8, colD: 0.4,
    base: { mx: 1.0, mzF: 0.3, mzB: 0.3 }, tile: 'Green', low: { over: 1.4, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.6 }],
    top: { over: 1.1, ridge: 7.4, ridgeH: 0.55, ornS: 0.6 }, orn: 'gourd', daoS: 0.9, chaiWin: 'round',
    src: '07 › tavu §5, §8: giữ 30 × 12 m, cao ~7 m (thấp hơn Cần Chánh), mái 2 tầng XANH (cấp quan). Gian / chái KHÔNG có số đo → giả định 7 gian 2 chái (nhịp nhà rường 2,4–4,2 m, C1.1). Chưa làm: hành lang 9 gian nối Đại Cung Môn',
  }),
  huuvu: hall({
    name: 'Hữu Vu 右廡', proto: 'Hữu Vu, Tử Cấm Thành: đối xứng gương Tả Vu (quan võ), mái 2 tầng thanh lưu ly',
    bays: [2.6, 3.1, 3.2, 3.3, 3.6, 3.3, 3.2, 3.1, 2.6], spans: [2.3, 3.4, 3.4, 2.3], ph: 0.6, colQ: 2.8, colD: 0.4,
    base: { mx: 1.0, mzF: 0.3, mzB: 0.3 }, tile: 'Green', low: { over: 1.4, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.6 }],
    top: { over: 1.1, ridge: 7.4, ridgeH: 0.55, ornS: 0.6 }, orn: 'gourd', daoS: 0.9, chaiWin: 'round',
    src: '07 › huuvu §8: như Tả Vu, 30 × 12 × ~7 m (đối xứng gương — khung cục bộ giống nhau, mặt tiền +z). Lưu ý tổng mặt bằng: Tả Vu (văn) phải ở phía Đông',
  }),
  themieu: hall({
    name: 'Thế Miếu 世祖廟', proto: 'Thế Tổ Miếu, Hoàng Thành (1821–22): nhà kép rất dài, chính doanh 9 gian 2 chái kép + tiền doanh 11 gian 2 chái đơn, mái 2 tầng hoàng lưu ly, bờ nóc thái cực pháp lam',
    bays: [3.2, 3.9, 4.0, 4.2, 4.4, 4.6, 4.9, 4.6, 4.4, 4.2, 4.0, 3.9, 3.2], spans: [3.2, 4.3, 4.3, 5.4, 5.4, 3.2], ph: 0.94, colQ: 3.9, colD: 0.48,
    base: { mx: 0.55, mzF: 0.95, mzB: 0.95, stairs: [{ side: 1, cx: 0, w: 4.0, rail: 'dragon' }, { side: 1, cx: -9.25, w: 3.0 }, { side: 1, cx: 9.25, w: 3.0 }] },
    low: { over: 1.6, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.85 }], top: { over: 1.3, ridge: 10.3, split: 3, ridgeH: 0.75 }, orn: 'taiji', daoS: 1.1,
    src: '07 › themieu §2, §8: 54,6 × 27,7 × 10,3 m, nền 0,94 m, 13 nhịp (11 gian 2 chái, nhịp TB 4,2 m) — XOAY lại cho dài theo mặt tiền (khung cũ 32 × 50 sai hướng). Chưa làm: Cửu Đỉnh, 14 đôn đá, kỳ lân (thuộc sân)',
  }),
  dientho: hall({
    name: 'Cung Diên Thọ 延壽宮', proto: 'Diên Thọ chính điện (cung Hoàng Thái hậu): nhà kép 2 tầng mái, nền rất thấp 0,56 m, hiên sau 4,5 m gấp đôi hiên trước, đầu đao đắp PHƯỢNG, hồ lô giữa nóc, gỗ sơn đen, cửa kính',
    bays: [3.0, 3.4, 4.1, 4.1, 4.5, 4.1, 4.1, 3.4, 3.0], spans: [2.0, 4.4, 4.4, 5.2, 5.2, 4.5], ph: 0.6, colQ: 3.4, colD: 0.42, colKey: 'colBlack',
    base: { mx: 0.5, mzF: 0.9, mzB: 0.9, stairs: [{ side: 1, cx: 0, w: 4.0, n: 3 }, { side: -1, cx: -8.2, w: 3.0, n: 2 }, { side: -1, cx: 8.2, w: 3.0, n: 2 }] },
    glassDoors: true, back: 'hien', low: { over: 1.5, s: 0.38 }, levels: [{ kind: 'codiem', h: 0.8 }], top: { over: 1.2, ridge: 9.5, split: 3, ridgeH: 0.7, ornS: 0.8 },
    orn: 'gourd', dao: 'phoenix', daoS: 1.1,
    src: '07 › dientho §2, §5, §8: 34,7 × 27,5 × 9,5 m, nền 0,6 m (thật 0,56), hiên trước 2 m / sau 4,5 m, thềm trước 3 bậc, thềm sau mỗi bên 2 bậc; 9 nhịp (nhịp TB 3,86 m) — XOAY lại (khung cũ 32 × 44 sai hướng). Chưa làm: 8 tranh gương, bảng «Diên Thọ cung»',
  }),
  truongsanh: {
    roofDesc: '3 nhà chồng diêm hoàng lưu ly nối hành lang (chữ Vương)', type: 'compound', name: 'Cung Trường Sanh 長生宮', proto: 'Cung Trường Sanh (1821, sửa 1846 thành chữ Vương 王): Ngũ Đại Đồng Đường (trước) – điện Thọ Khang (giữa, cao nhất) – lầu Vạn Phúc (sau), nối hành lang dọc trục',
    parts: [
      hall({ at: [0, 12.2], bays: [2.4, 3.3, 3.6, 4.2, 3.6, 3.3, 2.4], spans: [1.8, 3.6, 1.8], ph: 0.5, colQ: 2.7, colD: 0.36, base: { mx: 0.5, mzF: 0.5, mzB: 0.5, stairs: [{ side: 1, cx: 0, w: 3.0 }, { side: -1, cx: 0, w: 2.8 }] }, back: 'hien', low: { over: 1.3, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 6.2, ridgeH: 0.5, ornS: 0.5 }, orn: 'gourd', daoS: 0.75 }),
      hall({ at: [0, 0], bays: [2.6, 3.6, 3.9, 4.5, 3.9, 3.6, 2.6], spans: [2.0, 4.4, 2.0], ph: 0.6, colQ: 3.0, colD: 0.4, base: { mx: 0.5, mzF: 0.5, mzB: 0.5, stairs: [{ side: 1, cx: 0, w: 3.2 }, { side: -1, cx: 0, w: 3.0 }] }, back: 'hien', low: { over: 1.4, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.6 }], top: { over: 1.1, ridge: 7.0, ridgeH: 0.55, ornS: 0.65 }, orn: 'gourd', daoS: 0.85 }),
      hall({ at: [0, -12.2], bays: [2.4, 3.3, 3.6, 4.2, 3.6, 3.3, 2.4], spans: [1.8, 3.6, 1.8], ph: 0.5, colQ: 2.7, colD: 0.36, base: { mx: 0.5, mzF: 0.5, mzB: 0.5, stairs: [{ side: 1, cx: 0, w: 3.0 }] }, low: { over: 1.3, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 6.4, ridgeH: 0.5, ornS: 0.5 }, orn: 'gourd', daoS: 0.75 }),
      { type: 'lang', at: [0, 6.4], path: [[0, -1.75], [0, 1.75]], w: 3.0, colH: 2.5, ph: 0.5, tile: 'Yellow', rail: false },
      { type: 'lang', at: [0, -6.4], path: [[0, -1.75], [0, 1.75]], w: 3.0, colH: 2.5, ph: 0.5, tile: 'Yellow', rail: false },
    ],
    src: '07 › truongsanh §4, §5, §8: cụm chữ Vương — 3 nhà ngang nối hành lang trục giữa, nhà giữa cao nhất ~7 m. GIẢ ĐỊNH (chưa có nguồn): 5 gian 2 chái mỗi nhà, sâu 7,2 / 8,4 m (lớn hơn đề xuất 4,5 m để đủ hiên + 2 tầng mái). Chưa làm: lạch Đào Nguyên + cầu son, cổng Trường An tam quan ngũ sắc, non bộ (thuộc tổng mặt bằng); lầu Vạn Phúc dựng 1 tầng',
  },
  hienlam: hall({
    roofDesc: 'gác 3 tầng, 3 tầng mái (12 mặt) thu gian 5 → 3 → 1, ngói hoàng lưu ly, bình hồ lô đỉnh', type: 'hall', kind: 'gac', name: 'Hiển Lâm Các 顯臨閣', proto: 'Hiển Lâm Các (1821–22), trước sân Thế Miếu: gác 3 tầng, 24 cột (4 cột cái 13 m suốt 3 tầng), thu gian 5 → 3 → 1, 12 mái, bình hồ lô vàng trên đỉnh, 2 hệ bậc 9 cấp',
    bays: [3.2, 3.8, 4.4, 3.8, 3.2], spans: [2.6, 4.1, 4.1, 2.6], ph: 1.4, colQ: 3.6, colD: 0.46, interior: false,
    base: { mx: 0.8, mzF: 0.8, mzB: 0.8, stairs: [{ side: 1, cx: 0, w: 3.6, n: 9, rail: 'dragon' }, { side: -1, cx: 0, w: 3.2, n: 9 }] },
    front: 'hien', back: 'hien', chaiWin: 'round', low: { over: 1.6, s: 0.45 },
    levels: [
      { kind: 'storey', h: 3.0, win: { front: 'round', frontSide: 'fan', ends: 'square' }, low: { over: 1.5, s: 0.45 } },
      { kind: 'storey', hx: 2.7, hz: 2.3, h: 2.2, nx: 1, nz: 1, win: { front: 'round', ends: 'square' } },
    ],
    top: { over: 1.3, s: 0.62, ridgeH: 0.55, ornS: 0.7, minR: 0.3 }, orn: 'gourd', daoS: 0.95,
    src: '07 › hienlam §2, §8: 20 × 15 × 17 m, 3 tầng (sửa khung cũ 2 tầng / 13 m), tầng 1 = 5 gian, tầng 2 = 3 gian (12 m), tầng 3 = 1 gian (5,4 m), 3 tầng mái vươn 1,3–1,6 m, nền 1,4 m 9 bậc. Chưa làm: cửa vòm từng gian, hoành phi 9 rồng, lầu chuông / trống hai bên',
  }),
  thaimieu: hall({
    name: 'Thái Miếu 太祖廟', proto: 'Thái Tổ Miếu, Hoàng Thành (đã mất 1947, đang phục hồi): nhà gỗ lớn nhất cung điện Nguyễn, chính đường 13 gian 2 chái kép + tiền đường 15 gian 2 chái đơn, nhà kép 2 tầng mái',
    bays: [2.8, 3.6, 3.7, 3.75, 3.8, 3.9, 4.0, 4.1, 4.2, 4.1, 4.0, 3.9, 3.8, 3.75, 3.7, 3.6, 2.8], spans: [2.9, 3.8, 3.8, 4.8, 4.8, 2.9], ph: 0.9, colQ: 3.6, colD: 0.46,
    base: { mx: 0.25, mzF: 0.65, mzB: 0.65, stairs: [{ side: 1, cx: 0, w: 3.8, rail: 'dragon' }, { side: 1, cx: -12.2, w: 3.0 }, { side: 1, cx: 12.2, w: 3.0 }] },
    low: { over: 1.6, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.8 }], top: { over: 1.3, ridge: 9.5, split: 3, ridgeH: 0.7, ornS: 0.85 }, orn: 'gourd', daoS: 1.05,
    src: '07 › thaimieu §2, §8: 64 × 24,3 × 9,5 m (hệ số 0,9 của 71 × 27), nền 0,9 m, 17 nhịp — dài hơn Thế Miếu, cùng chiều sâu (sửa khung cũ 34 × 18). Chưa làm: Tuy Thành Các (gác 3 tầng phía trước — cùng mẫu Hiển Lâm Các)',
  }),
  quocsu: {
    roofDesc: 'nhà chính + 2 dãy tả hữu chồng diêm thanh lưu ly (chữ Môn)', type: 'compound', name: 'Quốc Sử Quán 國史館', proto: 'Quốc Sử Quán triều Nguyễn (1820–1945): nhà chính dãy 7 gian 2 chái (1884), hai dãy tả hữu thành chữ Môn, 2 bia «Khuynh cái hạ mã» ở cổng',
    parts: [
      hall({ at: [0, -6], bays: [2.6, 3.5, 3.7, 3.9, 4.2, 3.9, 3.7, 3.5, 2.6], spans: [2.6, 4.2, 4.2, 2.6], ph: 0.6, colQ: 3.0, colD: 0.38, base: { mx: 0.2, mzF: 0.2, mzB: 0.2 }, tile: 'Green', low: { over: 1.4, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.7 }], top: { over: 1.2, ridge: 8.0, ridgeH: 0.55, ornS: 0.65 }, orn: 'gourd', daoS: 0.85 }),
      hall({ at: [-12.4, 9.4], ry: Math.PI / 2, bays: [2.2, 2.8, 3.0, 2.8, 2.2], spans: [1.8, 2.8, 1.8], ph: 0.5, colQ: 2.6, colD: 0.34, base: { mx: 0.4, mzF: 0.3, mzB: 0.3 }, tile: 'Green', low: { over: 1.2, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 5.8, ridgeH: 0.45, ornS: 0.45 }, orn: 'gourd', daoS: 0.7 }),
      hall({ at: [12.4, 9.4], ry: -Math.PI / 2, bays: [2.2, 2.8, 3.0, 2.8, 2.2], spans: [1.8, 2.8, 1.8], ph: 0.5, colQ: 2.6, colD: 0.34, base: { mx: 0.4, mzF: 0.3, mzB: 0.3 }, tile: 'Green', low: { over: 1.2, s: 0.45 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 5.8, ridgeH: 0.45, ornS: 0.45 }, orn: 'gourd', daoS: 0.7 }),
      { type: 'stele', at: [-4.5, 18.5] }, { type: 'stele', at: [4.5, 18.5] },
    ],
    src: '07 › quocsu §1, §8: nhà chính 32 × 14 × 8 m, 7 gian 2 chái, mái xanh; hai dãy tả hữu (GIẢ ĐỊNH 5 gian, 13 × 6,4 m — không có số đo) thành chữ Môn; 2 bia. Mái 2 tầng: chưa xác minh (nguồn ghi «2 tầng hoặc 1 tầng»). Chưa làm: Tàng Bản Đường phía sau',
  },
  tower: { roofDesc: 'mái hiên hoàng lưu ly từng tầng, cổ diêm ở 3 bước thu gian, đỉnh phương đình chồng diêm + lưỡng long chầu hồ lô (mặt bằng VUÔNG)', type: 'tower', name: 'Lầu Kiến Trung (lầu 10 tầng)', proto: 'Gác gỗ kiểu Hiển Lâm Các xếp chồng (mỗi tầng một mái hiên vàng, thu gian 7 → 5 → 3 → 1) trên đài gạch kiểu Minh Viễn / Ngọ Môn (4,6 m = 21 bậc × 0,22), đỉnh phương đình chồng diêm + lưỡng long chầu hồ lô',
    src: '07 › lầu 10 tầng §3–§8: n = 4 (vuông, không bát giác), đài 43,2 m cao 4,6 m, hiên 2,0 m quanh mỗi tầng, cổ diêm 0,9 m ở 3 bước thu gian (sau tầng 2, 5, 8), mái hoàng lưu ly. Lệch: apothem tầng 3–10 nâng lên ≥ 10 m (điều kiện thang 20 m) thay vì 12,0 → 8,0 của bảng nghiên cứu; đài 1 hệ bậc (va chạm game) thay vì 3' },
  summit: dinh({
    name: 'Vọng Sơn Đình', proto: 'Phương đình 16 cột 2 tầng mái theo khối chính Nghinh Lương Đình (1852) / Trường Du Tạ (1849): 4 cột cái đỡ mái thượng, 12 cột quân đỡ mái hạ, lưỡng long chầu nhật',
    bays: [2.0, 3.6, 2.0], spans: [2.0, 3.6, 2.0], ph: 0.6, colQ: 3.0, colD: 0.36, base: { mx: 0.7, stairs: [{ side: 1, cx: 0, w: 2.6 }, { side: -1, cx: 0, w: 2.6 }] },
    front: 'rail', back: 'rail', ends: 'rail', endDoor: true, low: { over: 1.3, s: 0.42 }, levels: [{ kind: 'codiem', h: 0.6 }],
    top: { over: 1.1, ridge: 7.5, ridgeH: 0.5, ornS: 0.6, minR: 0.3 }, orn: 'sun', daoS: 0.8,
    src: '07 › summit §2, §8: 9 × 9 × 7,5 m, vuông (KHÔNG bát giác), cột quân 3,0 m, cột cái ~5,5 m, 2 tầng mái 8 mặt, cổ diêm. Lối mỗi mặt trước / sau + hông',
  }),
  ngomonW: dinh({
    roofDesc: 'lầu 2 tầng trên đài, 2 tầng mái thanh lưu ly (xanh)', name: 'Lầu Ngũ Phụng Tây (lầu trống)', proto: 'Lầu cánh Tây Ngũ Phụng trên đài Ngọ Môn (1833): tầng dưới thoáng cột son, tầng trên kín ván có cửa sổ tròn / rẻ quạt / chiếc khánh, lan can gỗ con tiện, 2 tầng mái thanh lưu ly; gian góc đặt TRỐNG («tả chung hữu cổ»)',
    bays: [2.0, 4.4, 2.0], spans: [2.0, 4.4, 2.0], ph: 1.14, colQ: 2.7, colD: 0.36, tile: 'Green', base: { mx: 0.3, stairs: [{ side: -1, cx: 0, w: 2.4, n: 7 }] },
    dai: { h: 4.6, m: 2.7, n: 21, stairW: 3.2 },
    front: 'open', back: 'open', ends: 'open', low: { over: 1.4, s: 0.42 },
    levels: [{ kind: 'storey', h: 2.4, bal: 0.6, win: { front: 'round', frontSide: 'fan', ends: 'khanh', endSide: 'fan' } }],
    top: { over: 1.1, s: 0.62, ridgeH: 0.45 }, orn: null, daoS: 0.8, extras: [{ kind: 'drum', x: 0, z: 0 }],
    src: '07 › ngomonW §2, §5, §8: 9 × 9 × 8,5 m, 2 tầng, nền lầu 1,14 m trên đài gạch 4,6 m (21 bậc × 0,22 m — dựng một đoạn đài 11 × 11 m, bậc phía sau). Bỏ `dai` nếu cổng Ngọ Môn đã có đài. Mái XANH',
  }),
  ngomonE: dinh({
    roofDesc: 'lầu 2 tầng trên đài, 2 tầng mái thanh lưu ly (xanh)', name: 'Lầu Ngũ Phụng Đông (lầu chuông)', proto: 'Lầu cánh Đông Ngũ Phụng trên đài Ngọ Môn: gương của ngomonW, gian góc treo CHUÔNG đồng Minh Mạng (1822, cao ~1,8 m)',
    bays: [2.0, 4.4, 2.0], spans: [2.0, 4.4, 2.0], ph: 1.14, colQ: 2.7, colD: 0.36, tile: 'Green', base: { mx: 0.3, stairs: [{ side: -1, cx: 0, w: 2.4, n: 7 }] },
    dai: { h: 4.6, m: 2.7, n: 21, stairW: 3.2 },
    front: 'open', back: 'open', ends: 'open', low: { over: 1.4, s: 0.42 },
    levels: [{ kind: 'storey', h: 2.4, bal: 0.6, win: { front: 'round', frontSide: 'fan', ends: 'khanh', endSide: 'fan' } }],
    top: { over: 1.1, s: 0.62, ridgeH: 0.45 }, orn: null, daoS: 0.8, extras: [{ kind: 'bell', x: 0, z: 0 }],
    src: '07 › ngomonE §2, §8: như ngomonW (9 × 9 × 8,5 m trên đài 4,6 m), chuông cao 1,8 m treo giá gỗ son',
  }),
  kimthuyW: dinh({
    name: 'Đình Kim Thủy Tây (thủy tạ)', proto: 'Trường Du Tạ (1849, cung Diên Thọ): phương đình kiểu nhà rường 1 gian 4 chái, 16 cột, đứng trên mặt nước, vách kính 4 mặt, mái lưu ly men xanh',
    bays: [1.9, 3.2, 1.9], spans: [1.9, 3.2, 1.9], ph: 0.6, water: true, colQ: 2.8, colD: 0.34, tile: 'Green', base: { mx: 0.5, stairs: [{ side: 1, cx: 0, w: 2.4 }] },
    front: 'glass', back: 'glass', ends: 'glass', low: { over: 1.2, s: 0.42 }, levels: [{ kind: 'codiem', h: 0.5 }],
    top: { over: 1.0, ridge: 6.5, ridgeH: 0.45, ornS: 0.5 }, orn: 'gourd', daoS: 0.7,
    src: '07 › kimthuyW §2, §8: 8 × 8 × 6,5 m, mái 2 tầng xanh, sàn trên trụ đá cao 0,6 m trên mặt nước, vách kính. Ghi chú: hồ trước Thái Hòa nên gọi Thái Dịch. Chưa làm: non bộ trong hồ',
  }),
  kimthuyE: {
    roofDesc: 'phương đình 2 tầng mái thanh lưu ly + 2 nhà vỏ cua ngói liệt', type: 'compound', name: 'Đình Kim Thủy Đông (thủy tạ có nhà vỏ cua)', proto: 'Biến thể theo Nghinh Lương Đình (1852): phương đình 16 cột + 2 nhà vỏ cua trước và sau (3 nóc, 16 mặt mái), trên mặt nước',
    parts: [
      dinh({ at: [0, 0], bays: [1.9, 3.2, 1.9], spans: [1.9, 3.2, 1.9], ph: 0.6, water: true, colQ: 2.8, colD: 0.34, tile: 'Green', base: { mx: 0.5, stairs: [] },
        front: 'open', back: 'open', ends: 'glass', low: { over: 1.2, s: 0.42 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 6.5, ridgeH: 0.45, ornS: 0.5 }, orn: 'sun', daoS: 0.7 }),
      { type: 'lang', at: [0, 5.35], path: [[-3.5, 0], [3.5, 0]], w: 2.7, colH: 2.4, bay: 3.5, ph: 0.6, tile: 'Terra' },
      { type: 'lang', at: [0, -5.35], path: [[-3.5, 0], [3.5, 0]], w: 2.7, colH: 2.4, bay: 3.5, ph: 0.6, tile: 'Terra' },
    ],
    src: '07 › kimthuyE §5, §8: biến thể 8 × 12 m (2 nhà vỏ cua 2,7 m ngói liệt). Lệch: mái nhà vỏ cua dựng hai dốc thẳng, chưa cong mui luyện',
  },
  tinhtam1: {
    roofDesc: 'phương đình 2 tầng mái hoàng lưu ly + hành lang thanh lưu ly', type: 'compound', name: 'Đình Tịnh Tâm Đông (Thanh Tâm thủy tạ)', proto: 'Thủy tạ Thanh Tâm phía Đông điện Bồng Doanh, đảo Bồng Lai, hồ Tịnh Tâm (1822): phương đình 16 cột 2 tầng mái nhô ra nước, hành lang có mái nối bờ',
    parts: [
      dinh({ at: [0, 0], bays: [2.1, 3.6, 2.1], spans: [2.1, 3.6, 2.1], ph: 0.6, water: true, colQ: 3.0, colD: 0.36, base: { mx: 0.6, stairs: [{ side: 1, cx: 0, w: 2.6 }] },
        front: 'rail', back: 'open', ends: 'rail', low: { over: 1.3, s: 0.42 }, levels: [{ kind: 'codiem', h: 0.55 }], top: { over: 1.1, ridge: 7.0, ridgeH: 0.5, ornS: 0.55 }, orn: 'gourd', daoS: 0.8 }),
      { type: 'lang', at: [0, -10.6], path: [[0, -6], [0, 6]], w: 3.0, colH: 2.6, bay: 3.0, ph: 0.6, tile: 'Green' },
    ],
    src: '07 › tinhtam1 §8: 9 × 9 × 7 m, phương đình 16 cột mái 2 tầng, sàn nhô ra nước; hành lang có mái 3 × 12 m nối bờ (phía sau). Màu mái vàng theo điện chủ Bồng Doanh [suy]',
  },
  thieuphuong: {
    roofDesc: 'nhà vuông 2 tầng mái + hồi lang chữ Vạn, thanh lưu ly', type: 'compound', name: 'Đình Thiệu Phương + hồi lang chữ Vạn', proto: 'Vườn Thiệu Phương (1828): Vạn tự hồi lang (hành lang gấp khúc hình 卍) nối nhà góc; nhà vuông 16 cột mái 2 tầng',
    parts: [
      dinh({ at: [0, 0], bays: [2.1, 3.6, 2.1], spans: [2.1, 3.6, 2.1], ph: 0.5, colQ: 2.7, colD: 0.34, tile: 'Green', base: { mx: 0.6, stairs: [] },
        front: 'panel', back: 'panel', ends: 'panel', endDoor: true, chaiWin: null, low: { over: 1.2, s: 0.42 }, levels: [{ kind: 'codiem', h: 0.5 }], top: { over: 1.0, ridge: 6.0, ridgeH: 0.45, ornS: 0.5 }, orn: 'gourd', daoS: 0.7 }),
      ...[[[0, 4.5], [0, 16.5], [6, 16.5]], [[4.5, 0], [16.5, 0], [16.5, -6]], [[0, -4.5], [0, -16.5], [-6, -16.5]], [[-4.5, 0], [-16.5, 0], [-16.5, 6]]].map((path) => ({ type: 'lang', at: [0, 0], path, w: 3.0, colH: 2.6, bay: 3.0, ph: 0.4, tile: 'Green', rail: false })),
    ],
    src: '07 › thieuphuong §5, §8: nhà vuông 9 × 9 × 6 m, 16 cột, mái 2 tầng (KHÔNG bát giác) + hồi lang chữ Vạn rộng 3 m, 4 nhánh 12 m gấp vuông 6 m — dấu hiệu chính của Thiệu Phương. Mái xanh [chưa xác minh]. Chưa làm: lạch Ngự Câu, non bộ',
  },
  island: dinh({
    roofDesc: 'lầu vuông 2 tầng, 2 tầng mái chồng, ngói hoàng lưu ly, lưỡng long chầu nhật', name: 'Hồ Tâm Đình', proto: 'Lầu vuông 2 tầng 2 mái theo Phu Văn Lâu (1819 / 1905) — mẫu đo được cho gác Nam Huân / lầu Vô Hạn Ý (đã mất): tầng dưới thoáng, tầng trên kín, cửa sổ tròn trước / sau, vuông hai bên, lan can đá quanh nền',
    bays: [2.3, 4.4, 2.3], spans: [2.3, 4.4, 2.3], ph: 1.0, colQ: 2.4, colD: 0.34,
    base: { mx: 0.5, stairs: [{ side: 1, cx: 0, w: 2.4 }] }, baseRail: { h: 0.6, gap: 2.8, open: ['front'] },
    front: 'open', back: 'open', ends: 'open', low: { over: 1.5, s: 0.42 },
    levels: [{ kind: 'storey', h: 2.4, bal: 0.7, win: { front: 'round', ends: 'square' } }],
    top: { over: 1.2, s: 0.6, ridgeH: 0.45, ornS: 0.5 }, orn: 'sun', daoS: 0.8,
    src: '07 › island §2, §8: 10 × 10 × 9,5 m (tỉ lệ cao / cạnh 0,95 như Phu Văn Lâu 11,67 / 12,24), cột cái suốt 2 tầng, cột quân 2,4 m, nền 1 m lan can đá 0,6 m ngắt ở bậc trước / trái / phải. Chưa làm: cầu thang gỗ góc phải, cầu nối bờ',
  }),
};
