// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ TRUNG HOA (Cung Vương phủ). Số lấy từ docs/tienphu-nghiencuu/01-trunghoa.md
//  (mục id tương ứng, §8 «đề xuất kích thước trong game», hệ số khu k = 1,5). Tiểu thức: cao cột = 0,8 × gian giữa (01 §3a).
// ============================================================================
const K = 1.5, DK = 0.08 * K;            // đấu khẩu cấp 8 (0,08 m) × k — 01 §3b
const bays = (n, mid, step) => { const out = [], h = (n - 1) / 2; for (let i = -h; i <= h; i++) out.push(+(mid - Math.abs(i) * step).toFixed(2)); return out; };
const hall = (o) => ({ type: 'hall', frontDoors: 'all', ...o });

export const CN_SPECS = {
  tower: { type: 'tower', name: 'Thiên Tượng Lâu (lầu 10 tầng)', proto: 'Lai Ứng Huyện Mộc Tháp 应县木塔 (kết cấu bát giác, bình tọa từng tầng) + Phật Hương Các 佛香阁 (ngôn ngữ Thanh, mái chóp bát giác, bảo đỉnh)', src: '01 › lầu 10 tầng §2–§8: bát giác, mỗi tầng mái hắt + bình tọa + thân, đài đá 4,5 m, đường kính tầng 1 = 31 m thu ~4 %/tầng, chóp + bảo đỉnh. Lệch: tầng 5 m (engine) thay vì ~6 m; tầng 1 chưa có vành mái thứ hai' },
  main: hall({
    name: 'Ngân An Điện 银安殿', proto: 'Ngân An Điện — chính điện Cung Vương phủ; quy chế thân vương phủ 7 gian (Đại Thanh hội điển 1652)',
    bays: [5.3, 6.6, 7.9, 9.2, 7.9, 6.6, 5.3], D: 19.5, corr: 3.6, colH: 7.2, colD: 0.72, plinth: 2.4,
    yuetai: { w: 37, d: 13, h: 1.8 }, dagong: DK, backDoors: true,
    roof: { type: 'xieshan', tile: 'Green', beasts: 7, ridgeH: 1.0, lift: 0.6 },
    src: '01 › main §2, §8: lưới 49 × 19,5 m, nền 2,4 m, nguyệt đài 37 × 13 × 1,8 m, cột 7,2 m / Ø 0,72 m, nóc ≈ 17 m trên nền; quy chế 01 §2',
  }),
  jiale: hall({
    name: 'Gia Lạc Đường 嘉乐堂', proto: 'Gia Lạc Đường — hậu điện trục giữa Cung Vương phủ: ngạnh sơn, ngói xanh lục, hành lang trước 5 gian',
    bays: bays(5, 8.0, 0.85), D: 16, corr: 2.4, colH: 6.4, plinth: 1.8, backDoors: true,
    roof: { type: 'gable', tile: 'Green', ridgeH: 0.85 },
    src: '01 › jiale §8: 36 × 16 m tim cột, nền 39 × 19 × 1,8 m, nóc ≈ 15 m; thấp hơn Ngân An Điện',
  }),
  duofu: {
    type: 'compound', name: 'Đa Phúc Hiên 多福轩', proto: 'Đa Phúc Hiên — trục Đông Cung Vương phủ: chính điện quyển bằng 5 gian + hai sáo điện thấp hai đầu',
    parts: [
      hall({ at: [0, 0], bays: bays(5, 6.0, 0.8), D: 14, corr: 2.0, corrBack: 2.0, colH: 4.8, plinth: 0.9, yuetai: { w: 16, d: 6, h: 0.6 }, roof: { type: 'juanpeng', tile: 'Gray' } }),
      hall({ at: [-17.4, -1.4], bays: [3, 3, 3], D: 11, colH: 4.0, plinth: 0.9, frontDoors: 'center1', roof: { type: 'juanpeng', tile: 'Gray' } }),
      hall({ at: [17.4, -1.4], bays: [3, 3, 3], D: 11, colH: 4.0, plinth: 0.9, frontDoors: 'center1', roof: { type: 'juanpeng', tile: 'Gray' } }),
    ],
    src: '01 › duofu §8: chính điện 26 × 14 m, nóc ≈ 9,8 m trên nền 0,9 m; hai sáo điện ~9 × 11 m thấp hơn ~1,5 m; bóng ngang ~44 m',
  },
  ledao: hall({
    name: 'Lạc Đạo Đường 乐道堂', proto: 'Lạc Đạo Đường — trục Đông Cung Vương phủ: 1 tầng, mái câu liên đáp hai quyển (hồi tường hai vòm tròn)',
    bays: bays(5, 6.0, 0.8), D: 20, corr: 2.2, colH: 4.6, plinth: 0.9, roof: { type: 'goulianda', n: 2, tile: 'Gray' },
    src: '01 › ledao §8: 26 × 20 m, nóc ≈ 9 m trên nền 0,9 m, hai quyển nhịp ~10 m. Sửa lỗi khung cũ «2 tầng»',
  }),
  jijin: {
    type: 'compound', name: 'Tích Cẩm Trai (theo Tích Tấn Trai 锡晋斋)', proto: 'Tích Tấn Trai — trục Tây Cung Vương phủ: 7 gian yết sơn, bão hạ 5 gian phía sau, nguyệt đài',
    parts: [
      hall({ at: [0, 0], bays: bays(7, 6.6, 0.8), D: 16.5, corr: 2.4, colH: 5.3, plinth: 1.2, yuetai: { w: 20, d: 8, h: 0.8 }, roof: { type: 'xieshan', tile: 'Gray', beasts: 5, ridgeH: 0.8 } }),
      hall({ at: [0, -13.2], bays: bays(5, 6.0, 0.8), D: 7, colH: 4.4, plinth: 1.2, frontDoors: 'center1', roof: { type: 'juanpeng', tile: 'Gray' } }),
    ],
    src: '01 › jijin §8: thân 37 × 16,5 m, bão hạ 26 × 7 m phía sau, nguyệt đài 20 × 8 m, nóc ≈ 13 m trên nền 1,2 m. Chưa làm: gác gỗ nam bên trong',
  },
  baoguang: hall({
    name: 'Bảo Quang Thất 葆光室', proto: 'Bảo Quang Thất — trục Tây Cung Vương phủ: ngạnh sơn ngói xám, nóc thẳng có thú',
    bays: bays(5, 6.0, 0.8), D: 14, corr: 2.0, colH: 4.8, plinth: 0.9, roof: { type: 'gable', tile: 'Gray', ridgeH: 0.7 },
    src: '01 › baoguang §8: 26 × 14 m, nóc ≈ 10 m trên nền 0,9 m; cùng cỡ Đa Phúc Hiên',
  }),
  jicui: {
    type: 'compound', name: 'Tích Thúy Đường (theo An Thiện Đường 安善堂)', proto: 'An Thiện Đường — vườn Tụy Cẩm Viên: hai mái quyển bằng, bão hạ lồi ra phía trước',
    parts: [
      hall({ at: [0, -3], bays: bays(5, 6.0, 0.8), D: 15, corr: 2.0, colH: 5.4, plinth: 0.9, roof: { type: 'goulianda', n: 2, tile: 'Gray' } }),
      hall({ at: [0, 9.2], bays: [4.0, 6.0, 4.0], D: 6, colH: 4.0, plinth: 0.9, open: true, roof: { type: 'juanpeng', tile: 'Gray' } }),
    ],
    src: '01 › jicui §8: 26 × 24 m kể cả bão hạ, nóc ≈ 10 m. Chưa làm: hành lang cong nối nhà hai bên',
  },
  miaoxiang: {
    type: 'compound', name: 'Diệu Hương Lâu (theo Diệu Hương Đình 妙香亭)', proto: 'Diệu Hương Đình — vườn Tụy Cẩm Viên: đình 2 tầng mái bằng, lan can quanh tầng trên',
    parts: [
      hall({ at: [0, 0], bays: [2.8, 3.4, 2.8], D: 9, colH: 4.2, plinth: 0.6, frontDoors: 'center1', roof: { type: 'flat' } }),
      hall({ at: [0, 0], bays: [2.0, 2.6, 2.0], D: 6.6, colH: 3.6, plinth: 6.0, noPlatform: true, roof: { type: 'flat' } }),
    ],
    src: '01 › miaoxiang §8 phương án A: 10 × 10 m, cao ~11 m (khung cũ 30 × 16 sai 4–5 lần). Chưa làm: tầng trên «tròn hoa» — đang dùng vuông',
  },
  houzhaoW: {
    type: 'lou', name: 'Hậu Tráo Lâu (Tây) 后罩楼', proto: 'Hậu Tráo Lâu — lớp cuối Cung Vương phủ: 2 tầng, dài 156 m, 108 phòng, cửa sổ thập cẩm mặt sau',
    bays: Array(23).fill(4.87), D: 12, corr: 1.8, h1: 4.2, h2: 3.8, plinth: 0.6, frontDoors: 'all', backWindows: 'shaped',
    roof: { type: 'gable', tile: 'Gray', ridgeH: 0.7 },
    src: '01 › houzhao §8: mỗi cánh ~112 × 12 m, nóc ≈ 14,5 m; gian 3,25 m × 1,5 = 4,9 m (tăng số gian, không kéo dãn gian)',
  },
  guardw: hall({ name: 'Tây Môn Phòng', proto: 'Môn phòng hai bên cổng — nhà tiểu thức ngạnh sơn ngói xám', bays: [4.5, 5.0, 4.5], D: 8.3, colH: 4.0, plinth: 0.6, frontDoors: 'center1', roof: { type: 'gable', tile: 'Gray', ridgeH: 0.5 }, src: '01 › guard §8: 14 × 9 m đúng tỉ lệ, nóc ≈ 7,5 m' }),
  theater: hall({
    name: 'Đại Hí Lâu 大戏楼', proto: 'Đại Hí Lâu Cung Vương phủ — 685 m², mái câu liên đáp ba quyển, tường kín; mái nghiêng 22°47′',
    bays: [5.0, 5.2, 5.4, 5.8, 5.4, 5.2, 5.0], D: 41, colH: 10.5, plinth: 0.6, frontDoors: 'center3', roof: { type: 'goulianda', n: 3, tile: 'Gray', slopes: [[1.6, 0.25], 0.42, 0.42] },
    src: '01 › theater §8: 37 (Đ–T) × 41 (N–B) m, nóc ≈ 15 m; khung cũ 40 × 24 sai hướng. Chưa làm: sân khấu trong',
  }),
  summit: { type: 'pavilion', name: 'Vọng Sơn Đình', proto: 'Vạn Xuân Đình (Cảnh Sơn) thu × 0,75 — đình vuông ba vành mái, đấu củng dày', n: 4, a: 5.0, colH: 3.8, colD: 0.42, plinth: 0.9, tiers: 3, over: 1.8, tile: 'Green', dagong: DK * 0.7, src: '01 › summit §8: 13 × 13 m, cao ~12 m, 3 vành mái' },
  liubei: { type: 'pavilion', name: 'Lưu Bôi Đình 流杯亭', proto: 'Lưu Bôi Đình Cung Vương phủ — đình lục giác, nền đá khắc rãnh nước hình chữ', n: 6, a: 3.6, colH: 3.6, colD: 0.36, plinth: 0.6, tiers: 1, over: 1.4, tile: 'Gray', src: '01 › liubei §8: 9 × 9 m, lục giác, nóc ≈ 10 m. Chưa làm: rãnh nước trên nền' },
  tingyu: hall({ name: 'Thính Vũ Hiên (theo Thu Thủy Sơn Phòng)', proto: 'Thu Thủy Sơn Phòng — hiên quyển bằng, mặt trước mở, lan can tựa lưng, sát nước', bays: [4.4, 6.2, 4.4], D: 6.5, colH: 4.4, plinth: 0.6, open: true, roof: { type: 'juanpeng', tile: 'Gray' }, src: '01 › tingyu §8: 15 × 8,5 m, nóc ≈ 9 m' }),
  shuixie: hall({ name: 'Thủy Tạ', proto: 'Thủy tạ giữa ao vuông Tụy Cẩm Viên — yết sơn, mở bốn mặt, ghế lan can', bays: [4.6, 6.0, 4.6], D: 8, colH: 4.0, plinth: 0.8, open: true, roof: { type: 'xieshan', tile: 'Gray', ridgeH: 0.6 }, src: '01 › shuixie §8: 16 × 10,5 m, nóc ≈ 10,5 m' }),
  yuexiang: { type: 'pavilion', name: 'Nguyệt Hương Đình (theo Tri Xuân Đình 知春亭)', proto: 'Tri Xuân Đình (Di Hòa Viên) — đình vuông hai vành mái, dải cửa sổ giữa hai vành, bảo đỉnh', n: 4, a: 3.3, colH: 4.0, colD: 0.36, plinth: 0.6, tiers: 2, over: 1.4, tile: 'Gray', src: '01 › yuexiang §8: 9 × 9 m, cao ≈ 11,5 m — không làm đình bẹt' },
  cuiyun: hall({ name: 'Thúy Vân Đình (theo Lục Thiên Tiểu Ẩn + Yêu Nguyệt Đài)', proto: 'Lục Thiên Tiểu Ẩn và Yêu Nguyệt Đài trên Tích Thúy Nham — sảnh nhỏ và sân ngắm trăng phía trước', bays: [3.8, 5.4, 3.8], D: 6, colH: 3.8, plinth: 1.2, yuetai: { w: 13, d: 7.5, h: 0.9 }, roof: { type: 'juanpeng', tile: 'Gray' }, src: '01 › cuiyun §8: sảnh 13 × 7,5 m + đài 13 × 7,5 m. Chưa làm: núi đá xếp, cửa hang dưới chân' }),
  mingdao: { type: 'pavilion', name: 'Minh Đạo Đình', proto: 'Đình vuông đơn diêm bốn cột, mái chóp vuông, ghế lan can, bảo đỉnh', n: 4, a: 2.8, colH: 3.6, colD: 0.34, plinth: 0.5, tiers: 1, over: 1.4, tile: 'Gray', src: '01 › mingdao §8: 8 × 8 m, nóc ≈ 9 m' },
};
CN_SPECS.houzhaoE = { ...CN_SPECS.houzhaoW, name: 'Hậu Tráo Lâu (Đông) 后罩楼' };
CN_SPECS.guarde = { ...CN_SPECS.guardw, name: 'Đông Môn Phòng' };
