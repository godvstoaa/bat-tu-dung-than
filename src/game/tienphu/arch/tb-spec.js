// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ TÂY TẠNG (Potala · Shöl · Lukhang · Norbulingka).
//  Số lấy từ docs/tienphu-nghiencuu/03-taytang.md, mục id tương ứng, §8 «đề xuất kích thước game»; quy tắc chung 03 › A1–A3.
//  Tường nghiêng: công trình đá lớn 10 % (A1, nguồn YZ), nhà dân 3 %, công trình trung bình 4–6 %.
// ============================================================================

/** bản ghi đè lầu (styles.js › taytang.tower) — 03 › lau10 §8: tường nghiêng LIÊN TỤC 10 % (lùi 0,5 m / tầng 5 m), bệ 10 m */
export const TOWER_OVR = { n: 4, a: [19.5, 19, 18.5, 18, 17.5, 17, 16.5, 16, 15.5, 15], podium: 10 };

// hàng cửa Bạch Cung: 7 hàng trên thân 24 m (03 › main §8: ≈ 3,4 m mỗi hàng, cửa to dần lên trên)
// hàng dưới thưa (kho, tường chịu lực), lên trên dày và to dần; hàng dưới đi theo cặp; giữa mặt tiền tầng 6 có cửa sổ lồi
const mainRows = [
  { y: 6.7, w: 0.8, h: 1.1, step: 6.4, pair: 1.6, skip: [[0, -7, 7]] },
  { y: 10.0, w: 0.9, h: 1.25, step: 6.4, pair: 1.7 },
  { y: 13.3, w: 1.0, h: 1.4, step: 4.6, pair: 1.8 },
  { y: 16.6, w: 1.05, h: 1.5, step: 3.3 },
  { y: 19.9, w: 1.15, h: 1.6, step: 3.3, layers: 2 },
  { y: 23.2, w: 1.25, h: 1.7, step: 3.3, layers: 2, rabsel: [0, -9.5, 9.5] },
  { y: 26.4, w: 1.35, h: 1.85, step: 3.0, layers: 2 },
];
const tierCommon = { type: 'block', k: 0.06, y0: 0, ph: 1.2, base: 'stone', wall: 'wallW', Ttop: 0.6, Tbot: 1.2, penbey: { h: 1.3, gold: 2.6 }, parapet: { h: 0.8 } };
const sideRows = (ys, w = 0.7, h = 0.9) => ys.map((y) => ({ y, w, h, step: 2.6, faces: [1, 2, 3] }));

export const TB_SPECS = {
  tower: {
    type: 'tower', name: 'Hồng Cung (lầu 10 tầng)', proto: 'Potrang Marpo 红宫 — Hồng Cung của Cung Potala, Lhasa (1690–1694): khối lăng trụ đỏ tường nghiêng, 13 hàng cửa nhìn ngoài, dải cửa lưới đứng giữa mặt Nam, penbey tầng trên, 7 mái vàng trên mái bằng',
    grid: { k0: 2, k1: 8, w: 13, n: 4 },
    gyaphib: [
      { x: 0, z: 1, W: 8, D: 6, colH: 2.2, over: 1.2, dk: 0.06, ridgeH: 0.6 },
      { x: -8.4, z: 1.2, W: 4.0, D: 3.4, colH: 1.9, over: 1.0, dk: 0.045 },
      { x: 8.4, z: 1.2, W: 4.0, D: 3.4, colH: 1.9, over: 1.0, dk: 0.045 },
      { x: -6.5, z: -7, hex: 1.9, colH: 1.9, over: 1.1, dk: 0.045 },
      { x: 6.5, z: -7, hex: 1.9, colH: 1.9, over: 1.1, dk: 0.045 },
    ],
    src: '03 › lau10 §4, §8: bệ đá nghiêng 10 m (3 hàng khe = 3 tầng 地垄墙) + 10 tầng = 13 hàng cửa; thân vuông nghiêng liên tục 10 % (cạnh 39 → 30 m, thay cho 44 × 34 → 35 × 25 vì lầu game phải là đa giác đều); dải cửa lưới rộng 13 m phủ T3–T9 (7 tầng); T10 toàn penbey + pháp luân đôi nai + đĩa vàng; mái arga + 5 gyaphib (3 yết sơn: 1 lớn 8 × 6 m, 2 nhỏ 4 × 3,4 m; 2 lục giác) + gyaltsen góc + cờ đen. Chưa làm: giếng trời 14 × 9 m T6–T10 (bên trong do game dựng); mặt bằng chữ nhật',
  },
  main: {
    type: 'palace', name: 'Bạch Cung (Potrang Karpo)', proto: 'Potrang Karpo 白宫 — Bạch Cung của Cung Potala (1645–1648): khối trắng 7 tầng, cửa chính ra sân Deyang Shar qua 3 thang gỗ',
    W: 60, D: 34, k: 0.1, ph: 6, base: 'stone', baseSlits: [1.6, 3.8], H: 24, wall: 'wallW', Ttop: 1.0, Tbot: 3.0,
    storeys: [12.6, 16.0, 19.3, 22.6, 25.9], door: { w: 3.2, h: 4.2 }, rows: mainRows,
    penbey: { h: 2.0, gold: 2.4 }, parapet: { h: 1.0, banners: 1.3 },
    cols: { xs: [-12, -8, -4, 0, 4, 8, 12], zs: [-8, -4, 0, 4, 8], d: 0.5 },
    triple: { ws: [2.2, 2.6, 2.2], gap: 0.35, flank: 1.3 },
    nyiwo: { penthouse: { W: 26, D: 10, cz: 6, H: 3.8, n: 6 } },
    bastion: { x: 30, z: 4, r: 4.5, k: 0.06, h: 20 },
    src: '03 › main §2, §5, §8: 60 × 34 m, chân đá 6 m, thân 24 m = 7 hàng cửa (≈ 3,3 m / hàng), tường nghiêng 10 %, dày 3 m chân / 1 m đỉnh; Đại điện Đông 35 cột (≈ 34) lưới ≈ 4 m, cao 2 hàng cửa (> 6 m); 3 thang gỗ (2,2 / 2,6 / 2,2 m, tổng ≈ 8 m) giữa tường penbey đỏ thẫm; Nhật Quang điện tầng 7: kính sát sàn rèm vàng; penbey 2 m; pháo đài tròn Ø 9 m. Lệch: Đại điện đặt ở tầng sàn chơi (thật ở tầng 4); mặt chính quay +z (thật quay Đông)',
  },
  printing: {
    type: 'block', name: 'Ấn Kinh Viện (Shöl Parkhang)', proto: 'Zhöl Parkhang Shar — nhà in kinh Đông Shöl (≈ 1690): nhà 2 tầng có sân trong, đá + gạch mộc',
    W: 22, D: 20, k: 0.03, ph: 1.2, base: 'stone', H: 8, wall: 'wallW', Ttop: 0.6, Tbot: 0.9, storeys: [5.2],
    door: { w: 2.6, h: 3.0 }, stair: { w: 2.6 }, court: { w: 8, d: 7, g: 1.2, yG: 5.2 }, shelves: true,
    rows: [{ y: 1.8, w: 0.55, h: 0.75, step: 2.4 }, { y: 3.4, w: 0.8, h: 1.0, step: 2.4 }, { y: 5.7, w: 1.0, h: 1.2, step: 2.4 }, { y: 7.3, w: 1.0, h: 1.0, step: 2.4 }],
    parapet: { h: 0.8, key: 'parBR', band: 0.3 },
    src: '03 › printing §2, §8: 22 × 20 m (≈ 380 m² chiếm đất × 2 tầng ≈ 760 m² sàn), sân trong 8 × 7 m, hành lang gỗ đỏ tầng trên, thân 8 m = 4 hàng cửa, tường chắn mái nâu đỏ 0,8 m (không penbey — chưa có nguồn), giá ván khắc kín tường trong',
  },
  sholoffice: {
    type: 'block', name: 'Shöl Lekhung', proto: 'Shöl Lekhung 雪巴列空 — công sở quản lý làng Shöl và 18 dzong: nhà 3 tầng mái bằng, 32 phòng, sân trong',
    W: 40, D: 30, k: 0.03, ph: 1.2, base: 'stone', H: 10, wall: 'wallW', Ttop: 0.6, Tbot: 1.0, storeys: [4.6, 7.9],
    door: { w: 3.0, h: 3.2 }, stair: { w: 3.0 }, court: { w: 16, d: 12, g: 1.5, yG: 4.6 },
    rows: [{ y: 2.0, w: 0.55, h: 0.75, step: 3.4 }, { y: 5.2, w: 1.0, h: 1.3, step: 2.6 }, { y: 8.4, w: 1.25, h: 1.5, step: 2.6, layers: 2, rabsel: [0, -10, 10] }],
    parapet: { h: 0.9, key: 'parBlk', band: 0.3 },
    src: '03 › sholoffice §2, §8: phương án «bản đồ chật» 40 × 30 m có sân 16 × 12 m, 3 tầng thật (≈ 3,3 m / tầng) cao thân 10 m, tầng trệt ít cửa, tầng trên cửa lớn + cửa sổ lồi gỗ, cổng lanh tô nhiều lớp, tường chắn mái đen. Lệch: 3 hàng cửa (đúng 3 tầng thật) thay vì 6 hàng',
  },
  sholhouse: {
    type: 'compound', name: 'Nhà Dân Shöl', proto: 'Nhà sân trong Lhasa (dinh Spe Zhi / Mkham Zur / Lungshar ở Shöl — khảo sát Tibet Heritage Fund): 2–3 tầng, hành lang vây sân, cửa sổ lồi rabsel',
    parts: [
      { type: 'block', at: [-8, 0], W: 18, D: 16, k: 0.03, ph: 0.6, base: 'stone', H: 8.4, wall: 'wallW', Ttop: 0.5, Tbot: 0.7, storeys: [3.4, 6.2], horns: true,
        door: { w: 2.4, h: 2.6 }, stair: { w: 2.4 }, court: { w: 6, d: 5, g: 1.0, yG: 3.4 },
        rows: [{ y: 1.3, w: 0.55, h: 0.7, step: 2.6 }, { y: 4.1, w: 0.8, h: 1.0, step: 2.4 }, { y: 6.9, w: 1.0, h: 1.2, step: 2.4, rabsel: [0, -3.2, 3.2] }], parapet: { h: 0.8, corners: true, flags: true } },
      { type: 'block', at: [9.5, -1], W: 15, D: 14, k: 0.03, ph: 0.5, base: 'stone', H: 6.0, wall: 'wallW', Ttop: 0.5, Tbot: 0.7, storeys: [3.3], horns: true,
        door: { w: 2.4, h: 2.5 }, stair: { w: 2.4 }, cols: { xs: [-3, 0, 3], zs: [-2, 2], d: 0.32 },
        rows: [{ y: 1.2, w: 0.55, h: 0.7, step: 2.6 }, { y: 4.0, w: 0.9, h: 1.1, step: 2.4, rabsel: [0, -6, -2.5] }], parapet: { h: 0.7, key: 'parBlk', band: 0.25, corners: true, flags: true } },
    ],
    src: '03 › sholhouse §8 (phương án lấp 34 m bằng 2 nhà khác nhau đứng sát): nhà A 18 × 16 m sân 6 × 5, 3 tầng thật (2,8 m) có rabsel; nhà B 15 × 14 m, 2 tầng, rabsel lệch trái, tường chắn đen; cửa viền đen có sừng, tường chắn trơn + trụ góc + cành cờ 4 góc, KHÔNG penbey, KHÔNG mái vàng',
  },
  seminary: {
    type: 'seminary', name: 'Tăng Học Viện (Tse Lobdra)', proto: 'Tse Lobdra 僧官学校 — trường tăng quan cạnh Đông sân Deyang Shar; kiểu dratsang Sera Je / Drepung Gomang (hiên cột, kinh đường có cửa mái)',
    W: 36, D: 14, k: 0.04, ph: 2.6, base: 'stone', baseSlits: [1.0], H: 9, wall: 'wallW', Ttop: 0.6, Tbot: 1.0, storeys: [7.1],
    door: { w: 2.8, h: 3.4 }, cols: { xs: [-12, -8, -4, 0, 4, 8, 12], zs: [-3, 1], d: 0.42 },
    rows: [{ y: 3.4, w: 0.8, h: 1.1, step: 3.0, skip: [[0, -8.5, 8.5]] }, { y: 7.8, w: 1.1, h: 1.4, step: 3.0, layers: 2, skip: [[0, -8.5, 8.5]] }],
    penbey: { h: 1.6, gold: 1.8 }, parapet: { h: 0.9, gyaltsen: 0.9 },
    porch: { w: 13, d: 4, h1: 4.5, stairW: 6 }, clere: { w: 14, d: 6, h: 2.6, z: -1.5 },
    src: '03 › seminary §8 (giữ khung 36 × 14 m làm cánh Tse Lobdra): 2 tầng, hiên cột gỗ đỏ 2 tầng rộng 13 m sâu 4 m có rèm yak đen, penbey 1,6 m gắn gương đồng, khối cửa mái 14 × 6 × 2,6 m giữa mái, pháp luân đôi nai trên mép mái trước, gyaltsen góc; lưới cột trong 4 m. Chưa làm: bích hoạ Tứ Thiên Vương tường hiên',
  },
  dormE: {
    type: 'dorm', name: 'Tăng Phòng Đông', proto: 'Dãy tăng phòng 2 tầng vây sân Deyang Shar (Potala); đối chiếu khangtsen Drepung',
    W: 36, D: 6, cz: -1, k: 0.03, ph: 2.6, base: 'stone', H: 7, wall: 'wallW', Ttop: 0.5, Tbot: 0.7, storeys: [6.1],
    door: { w: 2.6, h: 2.8 }, rows: [3.1, 4.5, 6.6, 8.0].map((y) => ({ y, w: 0.6, h: 0.8, step: 2.4, faces: [1, 2, 3] })),
    penbey: { h: 1.1, gold: 3.0 }, parapet: { h: 0.8 }, gallery: { d: 2, h1: 3.5, step: 3 },
    src: '03 › dormE §8: 36 × 8 m (phòng 4 m + hành lang cột 2 m quay ra sân), 2 tầng = 4 hàng cửa nhỏ mặt sau, cao thân 7 m trên mép sân 2,6 m, penbey mảnh, cột / lan can đỏ, thang gỗ dốc đầu dãy',
  },
  zhasha: {
    type: 'tiers', name: 'Zhasha (Tăng Xá)', proto: 'Zhasha 扎厦 — khu ở tăng sĩ Namgyal phía Tây Hồng Cung: khối trắng bậc theo sườn, cửa sổ nhỏ dày, penbey, không mái vàng',
    common: tierCommon,
    tiers: [
      { W: 50, D: 10, cz: 7, H: 5.8, storeys: [4.2], door: { w: 2.6, h: 2.8 }, gaps: [{ f: 0, u0: 21.8, u1: 24.4 }], rows: [{ y: 2.0, w: 0.6, h: 0.8, step: 2.6, skip: [[0, 10, 26]] }, { y: 4.8, w: 0.8, h: 1.0, step: 2.6, skip: [[0, 10, 26]] }] },
      { W: 42, D: 10, cz: -1, H: 11.8, storeys: [4.2, 7.2, 10.2], gaps: [{ f: 0, u0: -18.2, u1: -15.6 }], rows: [{ y: 8.0, w: 0.8, h: 1.0, step: 2.6, faces: [0], skip: [[0, -19, -2]] }, { y: 10.6, w: 0.9, h: 1.0, step: 2.6, faces: [0] }, ...sideRows([2.0, 4.8, 8.0, 10.6])] },
      { W: 30, D: 8, cz: -8, H: 16.8, storeys: [4.2, 7.2, 10.2, 13.2], rows: [{ y: 14.1, w: 0.8, h: 1.0, step: 2.6, faces: [0] }, { y: 16.0, w: 0.9, h: 0.9, step: 2.6, faces: [0] }, ...sideRows([2.0, 4.8, 8.0, 11.0, 14.1, 16.0])] },
    ],
    stairs: [{ xa: 11, xb: 24, zc: 13.3, w: 2, y0: 0, h: 7.0, out: 1, land: { x: 23.1, z: 12.4, w: 2.6, d: 1.4, top: 7 } }, { xa: -3, xb: -16.2, zc: 4.9, w: 2, y0: 7, h: 6.0, out: 1, land: { x: -16.9, z: 3.8, w: 2.6, d: 1.6, top: 13 } }],
    terraces: [{ x: 0, z: 8, w: 50, d: 8, top: 7 }, { x: 0, z: -1, w: 42, d: 10, top: 13 }],
    src: '03 › zhasha §8: 3 bậc — 50 × 10 m cao 7 m; 42 × 10 m cao 13 m lùi 8 m; 30 × 8 m cao 18 m (luôn thấp hơn khối đỏ T6 của Hồng Cung); 2 hàng cửa mỗi bậc, penbey 1,3 m mỗi bậc; thêm 2 cầu thang đá men tường lên sân thượng (dốc ngoài tường kiểu Potala — 03 › A5). Tường nghiêng 6 %',
  },
  lukhang: {
    type: 'lukhang', name: 'Lukhang (điện Long Vương)', proto: 'Lukhang ཀླུ་ཁང་ 宗角禄康 — điện mandala 3 tầng trên đảo tròn giữa hồ sau Potala (hoàn thành 1791)',
    island: { r: 15, h: 1.0 }, t1: { w: 16, core: 11.5, h: 4.0, plinth: 0.6 }, t2: { w: 11, core: 8.6, h: 3.5 }, t3: { a: 2.6, h: 2.4, over: 1.3 },
    src: '03 › lukhang §2, §8: đảo tròn Ø 30 m (thật 40 m), mandala vuông 16 / 11 / 7 m thu dần, cao 4 + 3,5 + 2,4 m + mái ≈ 3 m; 4 cửa giữa 4 cạnh, hành lang cột bao tầng 1, tầng 2 kiểu Hán vách vàng nhạt, tầng 3 lục giác mái vàng kiểu Mông Cổ (SHALU), penbey từng tầng. Chưa làm: cầu đá 5 nhịp 25 × 3,5 m, hồ, liễu (thuộc tổng mặt bằng)',
  },
  summit: {
    type: 'shrine', name: 'Vọng Sơn Đình', proto: 'Gyaphib đơn lẻ — điện nhỏ mái vàng kiểu Hán trên khối tường Tây Tạng như các mái vàng trên Hồng Cung (03 › summit, phương án A)',
    W: 7, D: 7, k: 0.04, ph: 0.6, H: 3.5, pb: 0.8, porch: 1.4, gW: 6.4, gD: 6.4, over: 1.0, dk: 0.05, wall: 'wallR',
    src: '03 › summit §8: vuông (bỏ bát giác), thân tường đỏ 3,5 m có hiên 2 cột, penbey 0,8 m, đấu củng + mái yết sơn vàng đơn diêm vươn ≈ 1 m, bình báu nóc, makara, 4 gyaltsen; tổng cao ≈ 9 m',
  },
  deyang: {
    type: 'stage', name: 'Đài Deyang Shar', proto: 'Deyang Shar 德央厦 — sân lớn trước cổng Bạch Cung (≈ 1 600 m², lát arga) nơi múa cham; đài là sân khấu múa (bổ sung game)',
    w: 12, h: 0.6, pole: 12,
    src: '03 › deyang §8: bệ đá thấp 12 × 12 × 0,6 m mặt arga ở giữa sân (ghi rõ là bổ sung game, không có nguồn), cột cờ darchen 12 m dây cờ toả 4 góc, 2 lư hương sang-khang. Sân 44 × 40 m, tường vàng và 3 thang gỗ (đã dựng ở Bạch Cung) thuộc tổng mặt bằng',
  },
  gate1: {
    type: 'block', name: 'Môn Lâu Shöl', proto: 'Cổng thành Shöl (môn lâu 3 tầng cạnh Nam / Đông / Tây tường thành Shöl, dựng lại từ 1645)',
    W: 12, D: 8, k: 0.06, y0: 0, ph: 0, H: 10.6, wall: 'wallW', Ttop: 0.8, Tbot: 1.4, storeys: [5.0, 7.9],
    passage: { w: 4, h: 4.5 },
    rows: [{ y: 1.8, w: 0.4, h: 0.9, kind: 'slit', step: 2.4, faces: [1, 3] }, { y: 5.6, w: 0.7, h: 0.9, step: 2.6 }, { y: 8.4, w: 0.8, h: 1.0, step: 2.6, layers: 1 }],
    parapet: { h: 0.9, key: 'parBR', band: 0.6, corners: true, flags: true },
    src: '03 › gate1 §8: 12 × 8 m, cao ≈ 11 m (3 tầng × 3,6 m), lối cổng 4 × 4,5 m cửa gỗ đỏ đinh sắt, tường nghiêng 6 %, cửa sổ nhỏ viền đen 2 tầng trên, tường chắn nâu đỏ. Chưa làm: đoạn tường thành nối (thuộc tổng mặt bằng, đề xuất dày 4 / 2,6 m)',
  },
  ramp1: {
    type: 'chorten', name: 'Đình Lưng Dốc (Pargo Kaling)', proto: 'Pargo Kaling 查果嘎林 — chorten cổng vắt ngang đường vào Shöl giữa Marpo Ri và Chakpori (dựng lại 1995)',
    base: { w: 8, h: 4 }, pass: { w: 3.5, h: 3.2 }, steps: [[6.8, 0.6], [6.0, 0.55], [5.2, 0.5]], bumpa: { r: 2.2, h: 3.6 }, harmika: { w: 2.0, h: 1.1 }, spire: { r0: 0.95, r1: 0.4, h: 4.2 }, flags: true,
    src: '03 › ramp1 §3, §8: đế 8 × 8 × 4 m có lối qua 3,5 m (trần mandala), 3 cấp thềm, bình Kadampa, harmika, 13 vòng mạ vàng, lọng, nhật nguyệt; tổng ≈ 17 m (≈ 2 × cạnh đế, tỉ lệ Kadampa 1,9–2,8); dây cờ xuống 4 góc',
  },
  lake1: {
    type: 'lakepav', name: 'Đình Ven Hồ', proto: 'Đình kiểu Hán ven hồ Tsokyil, Norbulingka (thời Đạt Lai thứ 8): đình cột trống mái vàng, lan can đá',
    a: 3.0, colH: 3.0, colD: 0.34, plinth: 0.6, over: 1.2, tile: 'Gold', dk: 0.05, lift: 0.45, rail: true,
    src: '03 › lake1 §8: 9 × 9 m, cột 3 m, mái ≈ 2,5 m vươn 1,2 m, bệ 0,6 m, không bát giác; đấu củng sơn lục / lam / đỏ, rèm shambu dưới xà, lan can đá trắng xám',
  },
  lake2: {
    type: 'lakepav', name: 'Đình Liễu', proto: 'Đình nghỉ nhỏ trong vườn Zongjiao Lukhang (giữa hàng liễu cổ sau Potala)',
    a: 2.0, colH: 2.6, colD: 0.3, plinth: 0.4, over: 0.9, tile: 'Dull', dk: 0, lift: 0.3, rail: false, flags: true,
    src: '03 › lake2 §8: 6 × 6 m, cao ≈ 5 m (nhỏ hơn lake1), mái vàng xỉn #A88A3A không đấu củng, ghế lan can, dây cờ cầu nguyện căng xuống 4 cọc (đề xuất). Chưa làm: 3–5 cây liễu (thuộc cây cảnh)',
  },
  east1: {
    type: 'mani', name: 'Đình Kinh Luân (Mani Lhakhang)', proto: 'Mani Lhakhang — điện nhỏ chứa bánh xe cầu nguyện lớn trên đường kora phía Đông Potala',
    W: 8, D: 8, k: 0.04, ph: 0.4, base: 'stone', H: 4, wall: 'wallW', Ttop: 0.5, Tbot: 0.6, door: { w: 3.0, h: 3.0 }, stair: { w: 3.0 },
    rows: [{ y: 1.6, w: 0.7, h: 1.0, step: 2.6, faces: [2] }], penbey: { h: 1.0, gold: 1.5 }, parapet: { h: 0.6, gyaltsen: 0.6 },
    wheel: { d: 2.0, h: 3.0 }, smallN: 8, sangZ: 3.2, sangX: 3.2,
    src: '03 › east1 §8: 8 × 8 m, tường 4 m + diềm 0,6 m, bánh xe lớn Ø 2 m cao 3 m ở tâm (số đề xuất), 2 hàng 8 bánh xe nhỏ Ø 0,35 m dọc hai tường, lư hương sang-khang trắng trước cửa',
  },
  island: {
    type: 'islandpav', name: 'Hồ Tâm Đình', proto: 'Tsokyil Phodrang 措吉颇章 — «cung giữa hồ» Norbulingka (1781): đình 2 tầng trên đảo vuông, mái vàng kiểu Hán, lan can đá',
    terrace: { w: 14, h: 0.9 }, W: 10, H: 4.2, gW: 6.2, colH: 2.6, over: 1.1,
    src: '03 › island §8 phương án B: thềm đá 14 × 14 × 0,9 m lan can, tầng 1 tường Tạng 10 × 10 m (penbey), tầng 2 đình Hán 6,2 × 6,2 m vách song, mái yết sơn vàng; cao ≈ 13 m. Lưu ý: nguyên mẫu đặt trên ĐẢO VUÔNG 24 × 24 m; nghiên cứu khuyên thay đảo tròn bằng Lukhang (phương án A) — để tổng mặt bằng quyết',
  },
};
