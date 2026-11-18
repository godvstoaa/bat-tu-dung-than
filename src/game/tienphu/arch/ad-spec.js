// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — TIÊN PHỦ ART DECO (U Thiên). Số lấy từ docs/tienphu-nghiencuu/05-artdeco.md
//  (mục id tương ứng, §8 «kích thước đề xuất cho game»; hệ số phóng 1,27 của nghiên cứu). Cao tầng biệt thự 4,3 m = 3,4 × 1,27.
// ============================================================================

/** bản ghi đè lầu 10 tầng (báo lại để áp vào styles.js): n = 4, cạnh 34 → 27 → 20 m (apothem 17 / 13,5 / 10);
 *  bậc 14 m của nghiên cứu (2 × 7 < 20 m — không qua điều kiện test) dựng thành khối chóp không đi được trên Vọng Đài */
export const TOWER_OVERRIDE = { n: 4, a: [17, 17, 17, 13.5, 13.5, 13.5, 10, 10, 10, 10], gal: [3, 6], podium: 1.5, setback: true };

const SH = 4.3, PH = 1.2;
export const AD_SPECS = {
  tower: { type: 'tower', name: 'Thiên Kim Lâu (lầu 10 tầng)', proto: 'Luật setback New York 1916 · Empire State (cột buồm 4 bậc, spandrel nhôm) · Chrysler (vòm bậc toả tia, cửa tam giác, đại bàng thép) · tháp gạch vàng Hilversum (Dudok) · góc bo Daily Express',
    src: '05 › lau10 §3–§8: cạnh 34 / 27 / 20 m (đề xuất 34 / 26 / 20 / 14 — bậc 14 m < 20 m không đi được nên thành khối chóp 14 m trên Vọng Đài, thân giữa 27 m để mỗi lần lùi ≥ 3,5 m mỗi phía), đế góc bo r 3 m gạch sọc 5 khoang, thân trụ đá vôi liền 3 tầng + spandrel chevron, đầu tháp 3 khoang góc cắt bậc + nẹp crôm tầng 9–10, zigzag dưới mỗi bậc lùi, 4 đại bàng thép ở bậc lùi thứ hai, cổng đồng + quạt sunburst + chữ THIÊN KIM LÂU, 5 vòm toả tia ≈ 10 m có 140 cửa tam giác sáng, cột buồm 4 bậc + cột cờ ≈ 8 m. Lệch: tầng 5 m (engine); bậc lên chỉ ở mặt trước (va chạm game chỉ có bậc trước)' },

  main: {
    type: 'villa', name: 'Biệt Thự Chính', proto: 'Villa Cavrois (Mallet-Stevens, Croix 1929–1932): khối ngang dài 60 m, lõi giữa 3 tầng + hai cánh đối xứng, một tháp duy nhất, gạch vàng mạch ngang đen, sân thượng nhiều cao độ lan can ống trắng',
    ph: PH, W: 76, D: 19, eave: PH + 2 * SH,
    plinth: { mat: 'brick', rects: [{ x: [-38, 38], z: [-11, 11], faces: { l: 'cellar:4', r: 'cellar:3', b: 'cellar:7' } }, { x: [-5.5, 5.5], z: [-13.6, -10.9] }], gaps: [[-8.1, 8.1, 10, 12], [-2, 2, -14.5, -12.5]] },
    blocks: [
      { x: [-9, 9], z: [-11, 8], n: 3, sh: SH, faces: { f: ['blank', 'blank', 'band'], b: ['band', 'band', 'band'], l: ['blank', 'blank', 'band'], r: ['blank', 'blank', 'band'] },
        ex: { f: [{ u: [-6.6, 6.6], y: [PH + 0.05, PH + 2 * SH - 0.35], kind: 'grid', m: 1.32, ts: 1.4, door: { w: 2.6, h: 3.0 } }] }, void: { 1: [-6.8, 6.8, -1, 7.4] } },
      { x: [-38, -9], z: [-11, 6], n: 2, sh: SH, r: { fl: 3.5 }, faces: { f: ['french:6', 'band'], b: ['band', 'band'], l: ['tall:2', 'tall:2'] } },
      { x: [-32, -20], z: [-11, -3], y0: PH + 2 * SH, n: 1, sh: SH, faces: { f: 'band', b: 'band', l: 'tall:2', r: 'french:2' } },
      { x: [9, 30], z: [-11, 6], n: 2, sh: SH, faces: { f: ['french:5', 'band'], b: ['band', 'band'], r: ['blank', 'french:2'] } },
      { x: [30, 38], z: [-11, 4], n: 1, sh: SH, r: { fr: 4 }, faces: { f: 'tall:2', r: 'band', b: 'band' } },
      { x: [-3.5, 3.5], z: [-13.6, -7], n: 5, sh: SH, roof: 'none', faces: { f: 'blank', b: ['door:2.4', 'blank'], l: ['blank', 'blank', 'blank', 'small:1', 'small:1'], r: ['blank', 'blank', 'blank', 'small:1', 'small:1'] },
        ex: { f: [{ u: [-0.9, 0.9], y: [PH + 3 * SH + 0.4, PH + 5 * SH - 0.5], kind: 'grid', m: 0.9, ts: 1.2 }], b: [{ u: [-1.0, 1.0], y: [PH + SH + 0.4, PH + 5 * SH - 0.5], kind: 'grid', m: 1.0, ts: 1.4 }] } },
      { x: [-3.5, 3.5], z: [-13.6, -7], y0: PH + 5 * SH, n: 1, sh: 3.3, roof: 'parapet', par: 0.3, faces: { f: 'ribbon', b: 'ribbon', l: 'ribbon', r: 'ribbon' } },
    ],
    extras: [
      { f: 'mezz', x: [-6.6, 6.6], z: [-1, 0.5], y: PH + SH },
      { f: 'pergola', x: [-20, -11.5], z: [-10.6, -3.4], y0: PH + 2 * SH, h: 3.4, dir: 'x', post: 4.2 },
      { f: 'canopy', x: [-32.6, -19.4], z: [-3, -1.5], y: PH + 2 * SH + 3.3, t: 0.16 },
      { f: 'balcony', x: [11.5, 27.5], z: [6, 7.7], y: PH + SH },
      { f: 'belvedere', x: [-3.5, 3.5], z: [-13.6, -7], y: PH + 5 * SH - 0.22, h: 3.3 },
      { f: 'canopy', x: [-2.8, 2.8], z: [-15.6, -13.6], y: PH + 3.4, t: 0.16 },
      { f: 'steps', cx: 0, cz: 11, w: 16, h: PH, dir: '+z' },
      { f: 'steps', cx: 0, cz: -13.6, w: 3.6, h: PH, dir: '-z' },
    ],
    src: '05 › main §2–§8: thân 76 × 19 m (60 × 1,27; dài/rộng 4 : 1) + sân thượng nam 3 m; nền nâng 1,2 m trên hầm nửa chìm có cửa hầm; cánh 2 tầng (mái 9,8 + lan can → 11 m), lõi 3 tầng 14,1 m, khối tầng 3 + pergola cánh tây, đầu đông 1 tầng góc bo r 4; tháp 7 × 6,6 m nhô mặt sau, belvédère cửa băng 4 mặt, đỉnh 26,4 m; hall kính 2 tầng thông (13,2 × 8,1 m) giữa mặt tiền; bậc lớn 16 m. Lệch: lối vào chính đặt ở mặt +z (mặt vườn) theo quy ước game, Cavrois thật vào từ mặt bắc dưới tháp (vẫn có cửa sau + bậc). Chưa làm: hồ gương 91 m (thuộc tổng mặt bằng)',
  },

  guest: {
    type: 'villa', name: 'Cánh Khách', proto: 'Cánh tây Villa Cavrois (con cái + gia nhân) + cánh phòng khách Villa Noailles: dãy phòng một hành lang, khối thang đứng ở đầu cánh cao hơn mái một tầng',
    ph: 0.9, W: 44, D: 14, eave: 8.9,
    plinth: { mat: 'brick', rects: [{ x: [-22, 22], z: [-7, 7], r: { fr: 3.5 }, faces: { b: 'cellar:7', l: 'cellar:2', r: 'cellar:2' } }], gaps: [[-1.9, 1.9, 6, 8]] },
    blocks: [
      { x: [-22, -16], z: [-7, 3], n: 3, sh: 4.0, roof: 'parapet', par: 1.0, faces: { f: 'blank', l: ['small:1', 'small:1', 'small:1'], b: 'blank' }, ex: { f: [{ u: [-0.9, 0.9], y: [1.6, 12.3], kind: 'grid', m: 0.9, ts: 1.2 }] } },
      { x: [-16, 22], z: [-7, 7], n: 2, sh: 4.0, r: { fr: 3.5 }, faces: { f: ['band:4.6', 'band:4.6'], b: ['band:2.2', 'band:2.2'], r: ['band', 'band'] }, ex: { f: [{ at: [0, 7], w: 3.6, y: [0.9, 4.1], kind: 'door', door: { w: 2.6, h: 3.0 }, m: 0.5 }] } },
      { x: [2, 12], z: [-7, -1], y0: 8.9, n: 1, sh: 3.6, faces: { f: 'band', b: 'band', l: 'tall:1', r: 'french:1' } },
    ],
    extras: [
      { f: 'pergola', x: [12, 19.6], z: [-6.6, -1.4], y0: 8.9, h: 3.3, dir: 'x', post: 3.8 },
      ...[-12.75, -7.15, 9.65, 15.25].map((x) => ({ f: 'balcony', x: [x - 1.8, x + 1.8], z: [7, 8.3], y: 4.9 })),
      { f: 'canopy', x: [-2.4, 2.4], z: [7, 9.0], y: 4.15, t: 0.16 },
      { f: 'steps', cx: 0, cz: 7, w: 3.4, h: 0.9, dir: '+z' },
    ],
    src: '05 › guest §8: 44 × 14 m (dài/sâu 3,1), 2 tầng 4,0 m, lan can mái 10 m, khối thang 14 m có ô kính đứng, khối tầng 3 nhỏ + pergola (¼ mái), 6 phòng mặt nam cửa băng + 4 ban công nhỏ, phòng góc bo r 3,5, cửa hầm sau. Chưa làm: hành lang có mái nối về biệt thự (thuộc tổng mặt bằng)',
  },

  studio: {
    type: 'villa', name: 'Xưởng Hoạ (khối chéo)', proto: 'Salon rose / xưởng Villa Noailles (Mallet-Stevens 1927, trần kính màu Barillet) + nhà-xưởng anh em Martel (10 rue Mallet-Stevens, 1927)',
    ph: 0.6, W: 30, D: 18, eave: 9.1,
    plinth: { mat: 'brick', rail: false, rects: [{ x: [-15, 5], z: [-7, 7] }, { x: [4, 8], z: [3, 7] }] },
    blocks: [
      { x: [-15, 5], z: [-7, 7], n: 1, sh: 8.5, mat: 'render', roof: 'parapet', par: 0.5, faces: { b: 'clere:4', l: 'tall:2', r: 'blank' },
        ex: { f: [{ u: [-9.6, 8.4], y: [0.75, 8.55], kind: 'grid', m: 1.2, ts: 1.2, door: { w: 2.6, h: 3.0, dc: 5.6 } }] } },
      { x: [4, 8], z: [3, 7], n: 3, sh: 3.8, mat: 'render', roof: 'parapet', par: 0.45, faces: { r: ['small:1', 'small:1', 'small:1'], f: 'blank', b: 'blank', l: 'blank' }, ex: { f: [{ u: [-0.7, 0.7], y: [1.4, 11.3], kind: 'grid', m: 0.7, ts: 1.2 }] } },
    ],
    sub: [{ at: [8.1, -1.5], ry: Math.PI / 4, plinth: { mat: 'brick', rail: false, rects: [{ x: [-5.5, 5.5], z: [-4.25, 4.25] }] },
      blocks: [{ x: [-5.5, 5.5], z: [-4.25, 4.25], n: 2, sh: 3.8, mat: 'render', faces: { f: ['band', 'band'], r: ['tall:2', 'band'], b: ['band', 'band'], l: 'blank' } }] }],
    extras: [
      { f: 'mezz', x: [-14.6, 4.6], z: [-6.65, -4.2], y: 4.8 },
      { f: 'skylight', x: [-11, -1], z: [-4.5, 3.5], y: 9.1, h: 1.3 },
      { f: 'canopy', x: [-1.9, 1.9], z: [7, 8.6], y: 3.75, t: 0.15 },
      { f: 'steps', cx: 0, cz: 7, w: 3.2, h: 0.6, dir: '+z', cheek: null },
    ],
    src: '05 › studio §8: khung 30 × 18; khối xưởng 20 × 14 cao thông 8,5 m (6,75 × 1,27) có gác lửng, mặt kính lưới ô vuông khung thép mảnh, giếng trời kính màu hồng/xanh 10 × 8 m; khối phụ 11 × 8,5 m 2 tầng xoay 45° (bản thu nhỏ từ 12 × 9 để lọt khung); khối thang 4 × 4 cao 12 m. Lệch: mặt kính xưởng đặt ở mặt +z (mặt tiền game) thay vì hướng bắc',
  },

  cinema: {
    type: 'villa', name: 'Rạp Chiếu & Phòng Nhạc', proto: 'Odeon Kingstanding (Birmingham 1935): mặt tiền faience kem + đen, 3 vây đứng vượt mái, tường chắn mái xây bậc · marquee viền đèn (Grand Rex, Radio City)',
    ph: 0.6, W: 26, D: 40, eave: 10.0,
    plinth: { mat: 'faiB', rail: false, rects: [{ x: [-13, 13], z: [-20, 20] }] },
    blocks: [
      { x: [-13, 13], z: [12, 20], n: 1, sh: 4.2, mat: 'faience', roof: 'none', faces: { l: 'band:3', r: 'band:3', f: 'blank' }, ex: { f: [{ u: [-5.2, 5.2], y: [0.6, 3.9], kind: 'door', m: 1.3, tr: [3.05], door: { w: 2.6, h: 2.9 } }] } },
      { x: [-13, 13], z: [16, 20], y0: 4.8, n: 1, sh: 5.4, mat: 'faience', roof: 'parapet', par: 0.6, faces: {}, ex: { f: [{ u: [-5.4, -1.9], y: [5.5, 9.7], kind: 'grid', m: 0.88, ts: 1.05 }, { u: [1.9, 5.4], y: [5.5, 9.7], kind: 'grid', m: 0.88, ts: 1.05 }] } },
      { x: [-6.5, 6.5], z: [17, 20], y0: 10.2, n: 1, sh: 1.2, mat: 'faience', roof: 'parapet', par: 0.3, faces: {} },
      { x: [-3.6, 3.6], z: [18, 20], y0: 11.4, n: 1, sh: 1.0, mat: 'faience', roof: 'parapet', par: 0.3, faces: {} },
      { x: [-10, 10], z: [-14, 16], n: 1, sh: 9.4, mat: 'brickRed', roof: 'parapet', par: 0.6, faces: {} },
      { x: [-10.5, 10.5], z: [-20, -14], n: 1, sh: 11.4, mat: 'brickRed', roof: 'parapet', par: 0.6, faces: { b: 'door:2.4' } },
      { x: [-13, -10], z: [-12, 12], n: 1, sh: 4.4, mat: 'faience', r: { bl: 2.5 }, roof: 'parapet', par: 0.5, faces: { l: 'band:3.2', b: 'small:1' } },
      { x: [10, 13], z: [-12, 12], n: 1, sh: 4.4, mat: 'faience', r: { br: 2.5 }, roof: 'parapet', par: 0.5, faces: { r: 'band:3.2', b: 'small:1' } },
    ],
    extras: [
      { f: 'cinemaFront', zf: 20, my: 4.25, mw: 26.4, md: 3.0, fx: 7, fd: 2.2, h0: 18, h1: 13.5 },
      { f: 'bands', w: 26.2, z: 20.02, ys: [4.95, 9.95, 10.55] },
      { f: 'pilasters', x: 10, z: [-13.5, 11.5], step: 4, h: 5.6, y0: 5.0, key: 'brickRed' },
      { f: 'steps', cx: 0, cz: 20, w: 11, h: 0.6, dir: '+z', cheek: null },
    ],
    src: '05 › cinema §8: xoay rạp — mặt tiền 26 m ở đầu hồi, sâu 40 m (khung cũ 40 × 22 không ra rạp); khán phòng 20 × 30 cao 10 m, tháp sân khấu 12 m, sảnh 4,8 m + mặt tiền 10,2 m xây bậc hai vai (11,4 / 12,4 m), vây giữa 18 m mang chữ CINÉMA, hai vây 13,5 m, marquee 26 × 3 m mép cong viền đèn, 4 cửa kính; hai cánh 1 tầng hai bên (phòng nhạc / lối thoát). Chưa làm: khung sân khấu 12 × 7,2 m và trần dải sunburst bên trong (không thấy từ ngoài)',
  },

  garage: {
    type: 'villa', name: 'Nhà Xe & Kho', proto: 'Nhà phụ Villa Empain (Brussels 1932, Michel Polak): 2 tầng, trệt ốp đá trắng, lầu trát, gờ mái nhô, khối nhô bo tròn; gara 3 cửa · đường xe vòng Cavrois',
    ph: 0.15, W: 44, D: 14, eave: 7.15,
    plinth: { mat: 'stoneW', rail: false, rects: [{ x: [-22, 22], z: [-7, 7], r: { fr: 7, br: 7 } }] },
    blocks: [
      { x: [-22, 22], z: [-7, 7], n: 1, sh: 3.6, mat: 'stoneW', r: { fr: 7, br: 7 }, railGap: [], faces: { f: 'band:2.2', b: 'band:2.2', l: 'small:2' },
        ex: { f: [...[-7, -3.5, 0, 3.5, 7].map((x) => ({ at: [x, 7], w: 3.0, y: [0.15, 3.15], kind: 'gdoor', open: x === 0 })), { at: [-16, 7], w: 1.4, y: [0.15, 2.75], kind: 'door', door: { w: 1.1, h: 2.5 }, m: 0.7 }] } },
      { x: [-4, 22], z: [-7, 7], y0: 3.75, n: 1, sh: 3.4, mat: 'render', r: { fr: 7, br: 7 }, roof: 'cornice', faces: { f: 'band:3', b: 'band:3', l: 'french:1' } },
    ],
    extras: [
      { f: 'canopy', x: [-9.6, 9.6], z: [7, 9.2], y: 3.25, t: 0.18, edge: 'coping' },
      { f: 'lamps', at: [[-5.25, 7], [-1.75, 7], [1.75, 7], [5.25, 7]], y: 2.45, nz: 1 },
      { f: 'sign', key: 'signGar', x: -16, y: 3.25, z: 7.07, w: 3.0, h: 0.5, d: 0.1 },
    ],
    src: '05 › garage §8: 44 × 14 m, nền 0,15 (xe vào), trệt 3,6 m ốp đá trắng, 5 cửa gara 3 m dưới mái hiên bê tông chạy liền (cửa giữa mở), lầu trát phủ 60 % (26 m) cao 7,15 m + gờ mái nhô 0,45 m, đầu khối bán nguyệt r 7, sân thượng trên phần trệt còn lại',
  },

  poolhouse: {
    type: 'villa', name: 'Nhà Hồ Bơi', proto: 'Hồ bơi có mái Villa Noailles (1926–27): 4 khung kính lớn hạ xuống sàn, trần lưới dầm bê tông + gạch kính, sân thượng · cabin xanh + cửa tròn Piscine Molitor · cầu nhảy Cavrois',
    ph: 0.6, W: 34, D: 14, eave: 5.5,
    plinth: { mat: 'stoneW', rail: false, rects: [{ x: [-17, 17], z: [-7, 7], holes: [[-9.5, 9.5, -4, 4]], noPlat: true }] },
    blocks: [
      { x: [-11.5, 11.5], z: [-7, 7], n: 1, sh: 4.9, mat: 'render', walk: true, railGap: [], faces: { b: 'blank' },
        ex: { f: [{ u: [-11.3, -5.7], y: [0.6, 5.1], kind: 'grid', m: 1.4, ts: 1.5 }, { u: [-5.3, 5.3], y: [0.6, 5.1], kind: 'grid', open: true, m: 5.3 }, { u: [5.7, 11.3], y: [0.6, 5.1], kind: 'grid', m: 1.4, ts: 1.5 }],
          b: [-9, -6, -3, 0, 3, 6, 9].map((x) => ({ u: [-x - 0.67, -x + 0.67], y: [3.03, 4.37], kind: 'void' })) } },
      { x: [-17, -11.5], z: [-7, 7], n: 1, sh: 3.6, mat: 'render', r: { fl: 2.5 }, roof: 'parapet', par: 0.5, faces: { f: 'french:1', l: 'band:3', b: 'small:1' } },
      { x: [11.5, 17], z: [-7, 7], n: 1, sh: 4.9, mat: 'render', walk: true, par: 0.15, railGap: [[16.5, 17.5, -4.4, -2.0]], faces: { f: 'tall:1', b: 'small:2', r: 'blank' } },
      { x: [13, 17], z: [-7, -4.4], y0: 5.5, n: 1, sh: 2.8, mat: 'render', roof: 'parapet', par: 0.3, faces: { f: 'french:1', l: 'tall:1' } },
    ],
    extras: [
      { f: 'pool', x: [-9.5, 9.5], z: [-4, 4], depth: 1.8 },
      { f: 'coffers', x: [-11.15, 11.15], z: [-6.65, 6.65], y: 5.18, step: 2.3, yr: 5.5 },
      { f: 'cabins', x: [-9.6, 9.6], z: -5.4, y: 0.6 },
      { f: 'portholes', face: [11.5, -7, -11.5, -7, 0, -1], us: [-9, -6, -3, 0, 3, 6, 9].map((x) => 11.5 - x), y: 3.7, r: 0.42 },
      { f: 'ring', key: 'tango', x: [-17, -11.5], z: [-7, 7], r: { fl: 2.5 }, y: 3.55, h: 0.55, t: 0.1 },
      { f: 'extStair', x: 17.7, w: 1.3, z0: 6.6, h: 5.5 },
      { f: 'sign', key: 'signPool', x: 14.25, y: 5.12, z: 7.07, w: 4.2, h: 0.6, d: 0.1 },
      { f: 'steps', cx: 0, cz: 7, w: 10.6, h: 0.6, dir: '+z', cheek: null },
      { f: 'plats', list: [{ x: 0, z: 5.5, w: 34, d: 3, top: 0.6 }, { x: 0, z: -5.5, w: 34, d: 3, top: 0.6 }, { x: -13.25, z: 0, w: 7.5, d: 8, top: 0.6 }, { x: 13.25, z: 0, w: 7.5, d: 8, top: 0.6 }] },
    ],
    src: '05 › poolhouse §8: 34 × 14 m, cao 5,5 m + lan can; bể trong nhà 19 × 8 m sâu 1,8 m (nghiên cứu 19 × 9 — thu 1 m để chừa lối dãy cabin), 4 khung kính lớn mặt nam (2 khung giữa hạ xuống sàn = lối vào 10,6 m), trần lưới dầm ô 2,3 m + gạch kính trên mái, 16 cabin xanh, 7 cửa tròn mặt bắc, cầu nhảy, thang ngoài lên sân thượng tắm nắng + chòi 2,8 m, quầy bar góc bo dải vàng tango. Chưa làm: hồ ngoài trời 34 × 5 (thuộc tổng mặt bằng)',
  },

  gym: {
    type: 'villa', name: 'Phòng Tập', proto: 'Phòng tập (1928) + sân squash (1932) Villa Noailles: hộp squash cao kín, phòng tập thấp cửa băng sát trần, sân thượng, lối nối có mái phẳng',
    ph: 0.6, W: 30, D: 16, eave: 5.5,
    plinth: { mat: 'brick', rail: false, rects: [{ x: [-15, 15], z: [-8, 6] }] },
    blocks: [
      { x: [-15, -9], z: [-6, 6], n: 1, sh: 3.2, mat: 'render', roof: 'parapet', par: 0.4, faces: { f: 'small:2', l: 'band:3', b: 'small:2' } },
      { x: [-9, 3], z: [-8, 6], n: 1, sh: 4.9, mat: 'render', faces: { f: 'clere:3', b: 'clere:3', l: 'clere' }, ex: { f: [{ at: [0, 6], w: 3.6, y: [0.6, 3.8], kind: 'door', door: { w: 2.6, h: 3.0 }, m: 0.5 }] } },
      { x: [3, 15], z: [-8, 0.6], n: 1, sh: 7.4, mat: 'render', roof: 'parapet', par: 0.5, faces: { b: 'clere:2' } },
      { x: [3, 15], z: [0.6, 6], n: 1, sh: 3.2, mat: 'render', r: { fr: 2.4 }, roof: 'parapet', par: 0.4, faces: { f: 'band:3.6', r: 'band' } },
    ],
    extras: [
      { f: 'skylight', key: 'glass', x: [-6.5, -3.5], z: [-5, -2], y: 5.5, h: 0.8 }, { f: 'skylight', key: 'glass', x: [-1.5, 1.5], z: [-5, -2], y: 5.5, h: 0.8 },
      { f: 'sign', key: 'signGym', x: 9, y: 5.6, z: 0.66, w: 6.0, h: 0.9, d: 0.1 },
      { f: 'canopy', x: [-15.6, -9], z: [6, 8], y: 3.2, t: 0.16, posts: [[-15.3, 7.7], [-12.2, 7.7]] },
      { f: 'steps', cx: 0, cz: 6, w: 3.4, h: 0.6, dir: '+z', cheek: null },
    ],
    src: '05 › gym §8: 30 × 16 m; hộp squash 12 × 8,6 m cao 8 m (9,75 × 6,4 × 1,27 + kết cấu), phòng tập 12 × 14 cao 5,5 m cửa băng sát trần + sân thượng + 2 giếng trời, phòng thay đồ 3,8 m, hành lang khán giả 3,8 m góc bo, lối nối có mái phẳng; chữ GYMNASE (đề xuất của nghiên cứu)',
  },

  summit: { type: 'belvedere', name: 'Đài Ngắm Cảnh', proto: 'Belvédère trên tháp Villa Cavrois (phòng nhỏ nhìn 360°) + tháp Pavillon du Tourisme (Mallet-Stevens, Expo 1925): cánh buồm ngang, đồng hồ',
    ph: 0.45, shaft: 4.4, shaftH: 7.0, sail: 6.6, room: 6.0, roomH: 3.0, disc: 8.0, flag: 4.0,
    src: '05 › summit §8: bệ 9 × 9, thân gạch 4,4 m cao 7 m, 3 cánh buồm 6,6 / 5,7 / 4,8 m, phòng tròn kính Ø 6 m cao 3 m (phóng từ 2,5–3 m có chủ đích để người chơi đứng được), mái đĩa Ø 8, cột cờ 4 m → ≈ 15 m; đồng hồ tuỳ chọn có dựng' },
  gaz1: { type: 'glassdome', name: 'Đình Kính', proto: 'Sảnh vào Eltham Palace (London 1933–36): mặt bằng tam giác cạnh cong, vòm bê tông lắp 720 cốc kính · tường kính tam giác trắng-hồng + quả cầu sáng (Guevrekian, Expo 1925)',
    ph: 0.45, W: 10, Rv: 4.1, rMid: 3.0, wallH: 2.9, dome: 8.9, domeH: 1.6,
    src: '05 › gaz1 §8: tam giác cạnh cong nội tiếp ô 10 m, 3 lối ở 3 đỉnh vát, vòm Ø 8,9 m (7 × 1,27) đỉnh 5,4 m, mắt kính, 3 bậc nền' },
  gaz2: { type: 'tennis', name: 'Đình Tennis', proto: 'Nhà nghỉ sân tennis Casa de Serralves (Porto) — dựng theo ngôn ngữ Cavrois / Empain: mái công-xôn + pergola',
    ph: 0.3, W: 12, D: 9, h: 3.5,
    src: '05 › gaz2 §8: 12 × 9 m, mái 3,8 m; nửa kín thay đồ 5 × 9 gạch vàng, nửa mở khán đài 3 bậc, mái công-xôn nhô 1,8 m về sân, pergola, bảng điểm, cột cờ. Chưa làm: sân 23,8 × 11 m (thuộc tổng mặt bằng)' },
  gaz3: { type: 'reading', name: 'Đình Đọc Sách', proto: 'Sân thượng-pergola tầng 2 Villa Cavrois (cạnh phòng chơi và 2 phòng học)', ph: 0.45, W: 9, h: 3.4,
    src: '05 › gaz3 §8: 9 × 9 m, dầm 3,4 m (1 tầng Cavrois); tường gạch thấp 2,2 m chữ L, nửa trong mái bê tông, nửa ngoài pergola, ghế xây + giá sách, lan can ống cạnh mở' },
  gaz4: { type: 'mirrorPav', name: 'Đình Hồ Gương', proto: 'Đầu hồ gương Villa Cavrois (72 m, ngắm lại mặt tiền nam) + quả cầu sáng Guevrekian 1925', ph: 0.5, R: 4.5, zf: 1.0, h: 3.2,
    src: '05 › gaz4 §8: bán nguyệt 9 × 4,5 m, cao 3,2 m, 7 cột vuông mảnh, tấm mái mỏng, 3 bậc xuống mặt nước, ghế cong, quả cầu sáng' },
  gaz5: { type: 'cubist', name: 'Đình Cuối Vườn', proto: '4 «cây lập phương» bê tông của anh em Martel trong vườn Mallet-Stevens, Expo 1925', W: 8, treeH: 6.4,
    src: '05 › gaz5 §8: ô 8 × 8, 4 cây cao 6,4 m (5 × 1,27), mỗi cây một thảm cỏ viền hoàng dương, 4 biến thể gắn lá (ngang xoay so le / đứng xoắn / nghiêng / chong chóng), ghế giữa' },
  gaz6: { type: 'trigarden', name: 'Đình Góc Đông', proto: 'Vườn lập thể Villa Noailles (Gabriel Guevrekian 1926) + tượng Lipchitz «La joie de vivre»', W: 8,
    src: '05 › gaz6 §8: tam giác vuông cạnh 8 m, ô bàn cờ cỏ / gạch 1 m xếp 4 cao độ, bồn cây hộp, tường hồng 1,2 m, tượng ≈ 2,5 m ở đỉnh góc vuông. Màu tường hồng là [suy] chưa đo' },
};
