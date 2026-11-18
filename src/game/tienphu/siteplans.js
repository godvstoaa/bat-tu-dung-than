// ============================================================================
//  9 TỔNG MẶT BẰNG TIÊN PHỦ (docs/TIEN-PHU-MATBANG-MANIFEST.md) — mỗi phủ một cấu trúc theo nguyên mẫu thật của phong cách.
//  ĐÂY LÀ NGUỒN SỐ LIỆU DUY NHẤT: bản vẽ (scripts/draw-tienphu.mjs) và mô hình 3D (plan.js → estate3d.js) cùng đọc từ đây.
//  Khung cục bộ: gốc = tâm phủ 520 × 520 m, +z = cổng chính (phía Nam trên bản vẽ — Bắc ở trên), mặt đảo y = 0.
//  Mỗi công trình: { id, name, fn (công năng), theme (chủ đề bài trí 0–9), x, z, w, d, h, floors, plinth?, back?, ry? }
//  ry: 0 = cửa chính nhìn +z (Nam); Q = nhìn +x? — quy ước three: hướng mặt trước = (sin ry, cos ry).
//  Đường đi: polyline [rộng, [x,z], [x,z]…] → đoạn lát. Tường trong: ring(x0,z0,x1,z1,h,{s,n,e,w: [[giữa khe, rộng]…]}).
// ============================================================================
const Q = Math.PI / 2;
export const FACE_N = Math.PI, FACE_E = Q, FACE_W = -Q, FACE_S = 0; // hướng mặt trước công trình

/** vòng tường chữ nhật có khe cổng. gaps: { s: [[x, w]], n: [[x, w]], e: [[z, w]], w: [[z, w]] } (s = cạnh z1 phía cổng chính) */
function ring(x0, z0, x1, z1, h, gaps = {}, t = 1.2) {
  const out = [];
  const run = (a0, a1, list, mk) => { let a = a0; for (const [c, w] of [...(list || [])].sort((p, q) => p[0] - q[0])) { if (c - w / 2 > a) out.push(mk(a, c - w / 2)); a = c + w / 2; } if (a1 > a) out.push(mk(a, a1)); };
  run(x0, x1, gaps.s, (a, b) => [a, z1, b, z1, h, t]);
  run(x0, x1, gaps.n, (a, b) => [a, z0, b, z0, h, t]);
  run(z0, z1, gaps.e, (a, b) => [x1, a, x1, b, h, t]);
  run(z0, z1, gaps.w, (a, b) => [x0, a, x0, b, h, t]);
  return out;
}
const line = (x0, z0, x1, z1, h, t = 1.2) => [[x0, z0, x1, z1, h, t]];

// ---------------------------------------------------------------------------
const SITES = {
  // 1 ─ CUNG ĐÌNH TRUNG HOA · nguyên mẫu Cung Vương phủ (恭王府): phủ đệ ở Nam, hoa viên Tụy Cẩm ở Bắc; khu ở chia 3 TRỤC song song
  //     (Đông · Trung · Tây), mỗi trục chuỗi sân nối tiếp; dãy Hậu Tráo Lâu 2 tầng dài chắn ngang giữa phủ và vườn;
  //     vườn: ao hình con dơi (Phúc Trì, du quanh ao), núi giả đá Thái Hồ chữ Sơn ở Bắc, Đại Hí Lâu ở Đông.
  trunghoa: () => ({
    proto: 'Cung Vương phủ (Bắc Kinh)',
    concept: 'Ba trục song song Đông – Trung – Tây, mỗi trục là chuỗi sân nối tiếp; Hậu Tráo Lâu chắn ngang; hậu hoa viên có ao con dơi và núi giả chữ Sơn.',
    sideGates: [{ id: 'east', x: 260, z: 60, w: 7 }, { id: 'west', x: -260, z: 60, w: 7 }, { id: 'back', x: 0, z: -260, w: 7 }],
    walls: [
      ...line(-92, 236, -92, 226, 4.5), ...line(-92, 210, -92, 140, 4.5), ...line(-92, 120, -92, 60, 4.5), ...line(-92, 40, -92, -30, 4.5), // tường ngăn trục Tây (cửa trăng z 130 / 50)
      ...line(92, 236, 92, 226, 4.5), ...line(92, 210, 92, 140, 4.5), ...line(92, 120, 92, 60, 4.5), ...line(92, 40, 92, -30, 4.5),
      ...line(-250, -48, -158, -48, 4.5), ...line(158, -48, 250, -48, 4.5),                               // nối Hậu Tráo Lâu tới tường bao
    ],
    buildings: [
      { id: 'main', name: 'Ngân An Điện', fn: 'chính điện tiếp chỉ', theme: 0, x: 0, z: 165, w: 52, d: 24, h: 13, floors: 2, plinth: 2.4, back: true, main: true },
      { id: 'jiale', name: 'Gia Lạc Đường', fn: 'sảnh thờ / tiếp khách nhà', theme: 3, x: 0, z: 98, w: 40, d: 20, h: 10, floors: 1, back: true },
      { id: 'duofu', name: 'Đa Phúc Hiên', fn: 'phòng khách trục Đông', theme: 1, x: 165, z: 172, w: 38, d: 18, h: 9, floors: 1, back: true },
      { id: 'ledao', name: 'Lạc Đạo Đường', fn: 'nội thất chủ phủ', theme: 4, x: 165, z: 92, w: 40, d: 20, h: 9, floors: 2, back: true },
      { id: 'jijin', name: 'Tích Cẩm Trai', fn: 'kho báu vật', theme: 7, x: 165, z: 18, w: 30, d: 16, h: 8, floors: 1 },
      { id: 'baoguang', name: 'Bảo Quang Thất', fn: 'thư phòng trục Tây', theme: 2, x: -165, z: 172, w: 38, d: 18, h: 9, floors: 1, back: true },
      { id: 'jicui', name: 'Tích Thúy Đường', fn: 'thiền phòng', theme: 5, x: -165, z: 92, w: 40, d: 20, h: 9, floors: 1, back: true },
      { id: 'miaoxiang', name: 'Diệu Hương Lâu', fn: 'đan phòng', theme: 6, x: -165, z: 18, w: 30, d: 16, h: 8, floors: 2 },
      { id: 'houzhaoW', name: 'Hậu Tráo Lâu (Tây)', fn: 'lầu sau 2 tầng — chắn khu ở với vườn', theme: 2, x: -100, z: -40, w: 150, d: 14, h: 9, floors: 2, back: true },
      { id: 'houzhaoE', name: 'Hậu Tráo Lâu (Đông)', fn: 'lầu sau 2 tầng', theme: 7, x: 100, z: -40, w: 150, d: 14, h: 9, floors: 2, back: true },
      { id: 'guardw', name: 'Tây Môn Phòng', fn: 'phòng gác', theme: 3, x: -40, z: 232, w: 14, d: 9, h: 5.5, floors: 1, plinth: 0.6 },
      { id: 'guarde', name: 'Đông Môn Phòng', fn: 'phòng gác', theme: 3, x: 40, z: 232, w: 14, d: 9, h: 5.5, floors: 1, plinth: 0.6 },
      { id: 'theater', name: 'Đại Hí Lâu', fn: 'sân khấu kịch', theme: 8, x: 200, z: -150, w: 40, d: 24, h: 10, floors: 1, ry: FACE_W },
    ],
    tower: { x: 0, z: 10 },
    water: [
      { shape: 'ellipse', x: 0, z: -150, rx: 58, rz: 34 },              // thân dơi
      { shape: 'ellipse', x: -66, z: -136, rx: 36, rz: 18 }, { shape: 'ellipse', x: 66, z: -136, rx: 36, rz: 18 }, // hai cánh
    ],
    bridges: [{ x: 0, z: -150, len: 76, w: 4.5, rise: 1.8, ry: 0 }],
    islands: [],
    rockery: { x: 0, z: -226, w: 70, d: 26, h: 9, kind: 'rock', name: 'Độc Lạc Phong · núi giả chữ Sơn' },
    pavs: [
      { id: 'liubei', name: 'Lưu Bôi Đình', x: -165, z: -112, w: 9, d: 9, octa: true },
      { id: 'tingyu', name: 'Thính Vũ Hiên', x: 160, z: -75, w: 12, d: 9 },
      { id: 'shuixie', name: 'Thủy Tạ', x: -100, z: -185, w: 12, d: 10 },
      { id: 'yuexiang', name: 'Nguyệt Hương Đình', x: 110, z: -186, w: 9, d: 9, octa: true },
      { id: 'cuiyun', name: 'Thúy Vân Đình', x: -215, z: -150, w: 8, d: 8, octa: true },
      { id: 'mingdao', name: 'Minh Đạo Đình', x: -215, z: -225, w: 8, d: 8 },
    ],
    paths: [
      [9, [0, 258], [0, 180]], [9, [0, 150], [0, 110]], [9, [0, 86], [0, 46]],                    // trục giữa: cổng → Ngân An → Gia Lạc → lầu
      [6, [0, -14], [0, -110]], [4, [0, -186], [0, -210]],                                         // sau lầu qua Hậu Tráo → vườn
      [6, [-236, 218], [236, 218]], [4, [-258, 60], [-200, 60]], [4, [200, 60], [258, 60]],             // ngõ ngang trước, lối cửa hông
      [5, [-165, 218], [-165, 186]], [5, [-165, 160], [-165, 112]], [5, [-165, 75], [-165, 28]],     // trục Tây
      [5, [165, 218], [165, 186]], [5, [165, 160], [165, 108]], [5, [165, 80], [165, 42]],           // trục Đông
      [4, [-165, 130], [165, 130]], [4, [-200, 50], [200, 50]],                                      // hai lối ngang qua cửa trăng
      [5, [-150, -95], [150, -95]], [5, [-130, -95], [-130, -205], [130, -205], [130, -95]],         // vòng du quanh ao
      [4, [150, -95], [186, -130]],
    ],
    forecourt: { x: 0, z: 210, w: 110, d: 40 },
    yards: [{ id: 'front', name: 'Tiền Viện', x: 0, z: 205, w: 160, d: 40 }, { id: 'east', name: 'Đông Viện', x: 165, z: 130, w: 120, d: 36 }, { id: 'west', name: 'Tây Viện', x: -165, z: 130, w: 120, d: 36 }, { id: 'garden', name: 'Tụy Cẩm Viên', x: 160, z: -150, w: 70, d: 60 }],
    groves: [{ x0: -250, z0: -250, x1: 250, z1: -62, n: 330 }, { x0: -250, z0: -40, x1: -100, z1: 236, n: 40 }, { x0: 100, z0: -40, x1: 250, z1: 236, n: 40 }],
    pairs: true, // cây hoa trồng từng cặp trước sảnh
  }),

  // 2 ─ THÀNH QUÁCH NHẬT BẢN · nguyên mẫu Himeji-jō (vòng thành xoắn, cổng lệch nhau) + Nijō Ninomaru Goten (cung điện xếp chéo
  //     «nhạn hành» trong khu thành ngoài) + vườn dạo Kōraku-en. Thiên thủ ở góc Tây Bắc trong Bản Hoàn, đường lên vòng xoắn qua 3 cổng.
  nhatban: () => ({
    proto: 'Himeji-jō (vòng thành xoắn) + Nijō Ninomaru Goten (cung điện nhạn hành) + vườn dạo',
    concept: 'Thiên thủ lệch góc Tây Bắc trong Bản Hoàn; Nhị Hoàn bao ngoài; đường lên xoắn qua 3 cổng không thẳng hàng; ngự điện xếp chéo ở Tam Hoàn; vườn dạo ở Đông Bắc.',
    sideGates: [{ id: 'east', x: 260, z: 150, w: 7 }, { id: 'back', x: 45, z: -260, w: 7 }],
    walls: [
      ...ring(-200, -222, -40, -62, 9, { e: [[-80, 8]] }, 2.2),                 // Bản Hoàn (honmaru) — tường đá cao, cổng phía Đông
      ...ring(-240, -246, 20, 42, 7, { s: [[-180, 8]] }, 2),                    // Nhị Hoàn (ninomaru) — cổng Nam lệch Tây
    ],
    buildings: [
      { id: 'main', name: 'Đại Quảng Gian (Ōhiroma)', fn: 'chính điện ngự cung', theme: 0, x: 150, z: 92, w: 50, d: 26, h: 10, floors: 1, plinth: 1.2, back: true, main: true },
      { id: 'shikidai', name: 'Thức Đài (Shikidai)', fn: 'tiền sảnh đón khách', theme: 1, x: 98, z: 150, w: 34, d: 18, h: 8, floors: 1, back: true },
      { id: 'kuroshoin', name: 'Hắc Thư Viện', fn: 'thư viện riêng', theme: 2, x: 200, z: 36, w: 34, d: 18, h: 8, floors: 1, back: true },
      { id: 'shiroshoin', name: 'Bạch Thư Viện', fn: 'tẩm điện', theme: 4, x: 228, z: -16, w: 28, d: 16, h: 8, floors: 1 },
      { id: 'kesho', name: 'Hóa Trang Lâu (Keshō-yagura)', fn: 'lầu Tây Hoàn', theme: 9, x: -218, z: -10, w: 40, d: 12, h: 8, floors: 2, ry: FACE_E },
      { id: 'kura', name: 'Kho Gạo (Kura)', fn: 'kho', theme: 7, x: -60, z: -20, w: 34, d: 12, h: 7, floors: 2, ry: FACE_N },
      { id: 'umaya', name: 'Chuồng Ngựa (Umaya)', fn: 'võ đường / chuồng ngựa', theme: 3, x: -95, z: 130, w: 44, d: 12, h: 6, floors: 1 },
      { id: 'masuW', name: 'Masugata Tây', fn: 'lầu gác cổng chính', theme: 3, x: -32, z: 230, w: 18, d: 10, h: 6, floors: 2, plinth: 0.6 },
      { id: 'masuE', name: 'Masugata Đông', fn: 'lầu gác cổng chính', theme: 3, x: 32, z: 230, w: 18, d: 10, h: 6, floors: 2, plinth: 0.6 },
      { id: 'chashitsu', name: 'Trà Thất Kōraku', fn: 'trà thất vườn', theme: 1, x: 70, z: -110, w: 18, d: 12, h: 6, floors: 1, ry: FACE_E },
    ],
    tower: { x: -120, z: -150 },
    water: [
      { shape: 'ellipse', x: 160, z: -150, rx: 66, rz: 40 }, { shape: 'ellipse', x: 112, z: -212, rx: 42, rz: 22 }, { shape: 'ellipse', x: 225, z: -95, rx: 22, rz: 16 },
    ],
    islands: [{ x: 168, z: -148, r: 9, pav: false, lantern: true }],
    bridges: [{ x: 112, z: -212, len: 52, w: 4, rise: 2.6, ry: 0 }, { x: 168, z: -172, len: 38, w: 3.5, rise: 1.4, ry: 0 }],
    stones: Array.from({ length: 15 }, (_, k) => { const t = k / 14; return { x: 98 + t * 64, z: -150 - Math.sin(t * Math.PI) * 26, r: 0.75 }; }),
    rockery: { x: 222, z: -218, w: 40, d: 30, h: 9, kind: 'rock', name: 'Tsukiyama · núi vườn' },
    zen: { x: 40, z: 168, w: 50, d: 30 },
    pavs: [
      { id: 'yaguraSW', name: 'Lầu Góc Tây Nam', x: -226, z: 28, w: 9, d: 9 }, { id: 'yaguraSE', name: 'Lầu Góc Đông Nam', x: 6, z: 28, w: 9, d: 9 },
      { id: 'yaguraNE', name: 'Lầu Góc Đông Bắc', x: 6, z: -232, w: 9, d: 9 }, { id: 'yaguraNW', name: 'Lầu Góc Tây Bắc', x: -226, z: -232, w: 9, d: 9 },
      { id: 'azumaya', name: 'Đình Nghỉ Vườn', x: 238, z: -150, w: 8, d: 8 }, { id: 'machiai', name: 'Đình Chờ Trà', x: 175, z: -30, w: 8, d: 8 },
    ],
    paths: [
      [8, [0, 258], [0, 200]], [6, [0, 200], [-180, 200], [-180, 50]],                               // cổng → rẽ Tây → cổng Nhị Hoàn (lệch, không thẳng)
      [5, [-180, 34], [-180, 20], [-6, 20], [-6, -80], [-46, -80]],                                    // trong Nhị Hoàn: rẽ Đông, ngoặt Bắc → cổng Bản Hoàn
      [5, [-34, -80], [-120, -80], [-120, -108]],                                                      // trong Bản Hoàn → trước thiên thủ
      [6, [0, 200], [98, 200], [98, 160]], [5, [98, 140], [150, 108]], [5, [150, 76], [200, 46]], [4, [200, 26], [228, -6]], // ngự cung chéo nhạn hành
      [4, [258, 150], [175, 150], [150, 108]],
      [4, [228, -26], [228, -60], [250, -60], [250, -195], [222, -195]], [4, [228, -60], [200, -60], [100, -95], [82, -110]], [4, [45, -258], [45, -150], [82, -125]],
    ],
    forecourt: { x: 0, z: 222, w: 50, d: 36 },
    yards: [{ id: 'sannomaru', name: 'Tam Hoàn', x: 120, z: 200, w: 160, d: 40 }, { id: 'ninomaru', name: 'Nhị Hoàn', x: -110, z: -20, w: 180, d: 60 }, { id: 'honmaru', name: 'Bản Hoàn', x: -120, z: -90, w: 140, d: 40 }, { id: 'garden', name: 'Vườn Dạo', x: 150, z: -230, w: 60, d: 26 }],
    groves: [{ x0: 40, z0: -250, x1: 250, z1: -70, n: 230 }, { x0: -250, z0: 60, x1: -20, z1: 240, n: 70 }, { x0: -238, z0: -244, x1: 18, z1: 40, n: 120 }, { x0: 30, z0: 60, x1: 250, z1: 240, n: 60 }],
  }),

  // 3 ─ CUNG ĐIỆN TÂY TẠNG · nguyên mẫu Potala: làng Shöl có tường ở chân dốc; đường dốc chữ Z leo lên sân Deyang Shar (sân Đông,
  //     trước Bạch Cung); Bạch Cung (chính) trên bệ cao; Hồng Cung (lầu 10 tầng) ở giữa và cao nhất; Zhasha (tăng xá) phía Tây;
  //     hồ Lukhang sau núi có đảo điện thờ. Bệ công trình cao dần từ Nam lên Bắc.
  taytang: () => ({
    proto: 'Potala (Lhasa): Shöl dưới chân, Bạch Cung + sân Deyang Shar, Hồng Cung trên đỉnh, hồ Lukhang phía sau',
    concept: 'Làng Shöl có tường ở chân; đường dốc chữ Z leo lên sân Deyang Shar trước Bạch Cung; Hồng Cung (lầu) ở giữa và cao nhất; hồ Lukhang có đảo ở phía sau.',
    sideGates: [{ id: 'east', x: 260, z: 210, w: 7 }, { id: 'west', x: -260, z: 210, w: 7 }, { id: 'back', x: -120, z: -260, w: 7 }],
    walls: [...ring(-160, 112, 160, 238, 5, { s: [[0, 10]], n: [[-70, 8]], e: [[210, 6]], w: [[210, 6]] })],
    buildings: [
      { id: 'main', name: 'Bạch Cung (Potrang Karpo)', fn: 'cung điện chính — chỗ ở, công đường', theme: 0, x: 130, z: -42, w: 60, d: 30, h: 14, floors: 2, plinth: 4.2, back: true, main: true },
      { id: 'printing', name: 'Ấn Kinh Viện', fn: 'nhà in kinh — làng Shöl', theme: 2, x: -85, z: 185, w: 40, d: 18, h: 8, floors: 2 },
      { id: 'sholoffice', name: 'Shöl Lekhung', fn: 'công sở làng Shöl', theme: 7, x: 85, z: 185, w: 40, d: 18, h: 8, floors: 2 },
      { id: 'sholhouse', name: 'Nhà Dân Shöl', fn: 'nhà ở', theme: 3, x: 85, z: 140, w: 34, d: 14, h: 7, floors: 2 },
      { id: 'seminary', name: 'Tăng Học Viện', fn: 'học viện quanh sân Deyang Shar', theme: 5, x: 205, z: 30, w: 36, d: 14, h: 9, floors: 2, plinth: 2.6, ry: FACE_W },
      { id: 'dormE', name: 'Tăng Phòng Đông', fn: 'tăng phòng', theme: 4, x: 60, z: 30, w: 30, d: 14, h: 9, floors: 2, plinth: 2.6, ry: FACE_E },
      { id: 'zhasha', name: 'Zhasha (Tăng Xá)', fn: 'tăng xá phía Tây Hồng Cung', theme: 6, x: -150, z: -95, w: 50, d: 16, h: 10, floors: 2, plinth: 3.4, ry: FACE_E },
      { id: 'lukhang', name: 'Lukhang', fn: 'điện thờ ven hồ', theme: 9, x: -195, z: -205, w: 20, d: 16, h: 8, floors: 2, plinth: 1.6 },
    ],
    tower: { x: -30, z: -115 },
    water: [{ shape: 'ellipse', x: 60, z: -210, rx: 110, rz: 30 }],
    islands: [{ x: 60, z: -210, r: 12, pav: true }],
    bridges: [{ x: 60, z: -232, len: 26, w: 4, rise: 1.6, ry: 0 }],
    rockery: { x: -190, z: -150, w: 48, d: 30, h: 9, kind: 'rock', name: 'Marpo Ri · đồi đá' },
    stupas: [[-125, 60], [-155, 60], [-185, 60], [210, 195], [-210, 195]].map(([x, z], k) => ({ x, z, h: k < 3 ? 9 : 12, r: k < 3 ? 2.5 : 3.2 })),
    flagPoles: [[-110, -160], [100, -160], [160, 5], [0, 95]],
    pavs: [
      { id: 'deyang', name: 'Đài Deyang Shar', x: 130, z: 30, w: 12, d: 12 }, { id: 'gate1', name: 'Môn Lâu Shöl', x: -92, z: 100, w: 9, d: 7 },
      { id: 'ramp1', name: 'Đình Lưng Dốc', x: -110, z: 30, w: 8, d: 8 }, { id: 'lake1', name: 'Đình Ven Hồ', x: 190, z: -205, w: 9, d: 9 },
      { id: 'lake2', name: 'Đình Liễu', x: -60, z: -222, w: 8, d: 8 }, { id: 'east1', name: 'Đình Kinh Luân', x: 225, z: 120, w: 8, d: 8 },
    ],
    paths: [
      [8, [0, 258], [0, 150], [-70, 150], [-70, 116]],                                              // vào Shöl, ra cổng Bắc lệch Tây
      [6, [-70, 108], [-70, 70], [60, 55], [-80, 10], [70, -5]], [6, [70, -5], [130, 12]],          // đường dốc chữ Z
      [6, [130, 12], [130, -22]], [5, [130, 12], [-30, 12], [-30, -85]],                               // sân Deyang Shar → Bạch Cung / Hồng Cung
      [4, [-30, -145], [-30, -175]], [4, [-120, -175], [180, -175]], [4, [180, -175], [190, -198]], [4, [-120, -175], [-120, -258]],
      [4, [-132, -95], [-60, -95]], [5, [-258, 210], [258, 210]],
    ],
    forecourt: { x: 0, z: 248, w: 40, d: 16 },
    yards: [{ id: 'shol', name: 'Làng Shöl', x: 0, z: 165, w: 300, d: 30 }, { id: 'deyang', name: 'Sân Deyang Shar', x: 130, z: 40, w: 100, d: 30 }, { id: 'garden', name: 'Vườn Lukhang', x: -100, z: -205, w: 120, d: 40 }],
    groves: [{ x0: -250, z0: -250, x1: 250, z1: -170, n: 200 }, { x0: -250, z0: -150, x1: -60, z1: 90, n: 110 }, { x0: 170, z0: -140, x1: 250, z1: 100, n: 70 }, { x0: -250, z0: 112, x1: -170, z1: 250, n: 40 }, { x0: 170, z0: 112, x1: 250, z1: 250, n: 40 }],
  }),

  // 4 ─ LÂU ĐÀI GOTHIC · nguyên mẫu Beaumaris (thành đồng tâm): hào nước vuông bao NỘI THÀNH (tường cao, 4 tháp góc), cổng kép có
  //     cầu qua hào ở Nam và Bắc; trong nội thành: tháp chính (lầu) giữa sân, Đại Sảnh dựa tường Đông, nhà nguyện + bếp dựa tường Tây.
  //     Ngoại thành: vườn kín (hortus conclusus) với hồ gương, sân đấu thương, chuồng ưng, doanh trại, vườn cây ăn quả, đồi gò (motte).
  gothic: () => ({
    proto: 'Beaumaris Castle (thành đồng tâm, Wales)',
    concept: 'Hào nước vuông bao nội thành có 4 tháp góc; tháp chính giữa sân trong; Đại Sảnh dựa tường Đông, nhà nguyện và bếp dựa tường Tây; ngoại thành có vườn kín, sân đấu thương, đồi gò.',
    sideGates: [{ id: 'back', x: 0, z: -260, w: 7 }],
    walls: [...ring(-112, -142, 112, 82, 11, { s: [[0, 9]], n: [[0, 9]] }, 2.4)],
    buildings: [
      { id: 'main', name: 'Đại Sảnh (Great Hall)', fn: 'đại sảnh yến tiệc', theme: 3, x: 80, z: -30, w: 56, d: 20, h: 12, floors: 2, back: false, main: true, ry: FACE_W },
      { id: 'chapel', name: 'Nhà Nguyện', fn: 'nhà nguyện (hậu cung quay hướng Đông)', theme: 5, x: -80, z: -75, w: 34, d: 16, h: 12, floors: 2, ry: FACE_W },
      { id: 'kitchen', name: 'Bếp & Kho', fn: 'bếp, kho', theme: 6, x: -80, z: 25, w: 34, d: 16, h: 8, floors: 2, ry: FACE_E },
      { id: 'solar', name: 'Phòng Lãnh Chúa (Solar)', fn: 'tẩm thất', theme: 4, x: 0, z: -118, w: 60, d: 14, h: 10, floors: 2, ry: FACE_S },
      { id: 'guest', name: 'Nhà Khách', fn: 'nhà khách ngoại thành', theme: 1, x: 185, z: 165, w: 40, d: 16, h: 9, floors: 2 },
      { id: 'barracks', name: 'Doanh Trại', fn: 'doanh trại', theme: 7, x: -215, z: -40, w: 56, d: 14, h: 8, floors: 2, ry: FACE_E },
      { id: 'mews', name: 'Chuồng Ưng & Ngựa', fn: 'chuồng ưng, ngựa', theme: 8, x: 215, z: -60, w: 44, d: 14, h: 7, floors: 1, ry: FACE_W },
      { id: 'library', name: 'Thư Các', fn: 'thư viện', theme: 2, x: -185, z: 165, w: 34, d: 16, h: 9, floors: 2 },
    ],
    tower: { x: 0, z: -35 },
    water: [ // hào: 4 dải bao nội thành, chừa 2 cầu
      { shape: 'rect', x: 0, z: 102, hw: 140, hd: 11, floor: -1.9 }, { shape: 'rect', x: 0, z: -162, hw: 140, hd: 11, floor: -1.9 },
      { shape: 'rect', x: -130, z: -30, hw: 11, hd: 121, floor: -1.9 }, { shape: 'rect', x: 130, z: -30, hw: 11, hd: 121, floor: -1.9 },
      { shape: 'rect', x: -185, z: 105, hw: 22, hd: 14, floor: -1.1 },                                  // hồ gương vườn kín
    ],
    bridges: [{ x: 0, z: 102, len: 30, w: 6, rise: 0.6, ry: 0, flat: true }, { x: 0, z: -162, len: 30, w: 6, rise: 0.6, ry: 0, flat: true }],
    islands: [],
    fountain: { x: -185, z: 135, r: 5 },
    beds: [[-228, 135], [-228, 78]].map(([x, z]) => ({ x, z, w: 18, d: 14 })),
    rockery: { x: -200, z: -205, w: 44, d: 32, h: 9, kind: 'rock', name: 'Motte · đồi gò canh' },
    pavs: [
      { id: 'twrSW', name: 'Tháp Góc Tây Nam', x: -104, z: 74, w: 9, d: 9, octa: true }, { id: 'twrSE', name: 'Tháp Góc Đông Nam', x: 104, z: 74, w: 9, d: 9, octa: true },
      { id: 'twrNW', name: 'Tháp Góc Tây Bắc', x: -104, z: -134, w: 9, d: 9, octa: true }, { id: 'twrNE', name: 'Tháp Góc Đông Bắc', x: 104, z: -134, w: 9, d: 9, octa: true },
      { id: 'tilt', name: 'Khán Đài Đấu Thương', x: 185, z: 60, w: 14, d: 8 }, { id: 'orchard', name: 'Chòi Vườn Quả', x: 170, z: -205, w: 8, d: 8 },
    ],
    paths: [
      [8, [0, 258], [0, 84]], [6, [0, 80], [0, -8]], [6, [0, -62], [0, -108]], [5, [0, -131], [0, -258]], // cổng → cầu Nam → sân trong → tháp → cầu Bắc
      [5, [-230, 200], [230, 200]], [4, [-185, 200], [-185, 175]], [4, [185, 200], [185, 175]],
      [4, [-160, 200], [-160, -230], [160, -230], [160, 200]],                                          // đường vòng ngoại thành
      [4, [0, 40], [48, -30]], [4, [0, 40], [-60, 25]], [4, [0, -90], [-60, -75]],
    ],
    forecourt: { x: 0, z: 230, w: 60, d: 40 },
    yards: [{ id: 'inner', name: 'Nội Thành', x: 0, z: 40, w: 150, d: 50 }, { id: 'tilt', name: 'Sân Đấu Thương', x: 200, z: 100, w: 70, d: 50 }, { id: 'garden', name: 'Vườn Kín', x: -200, z: 30, w: 60, d: 40 }],
    groves: [{ x0: 150, z0: -250, x1: 250, z1: -100, n: 110 }, { x0: -250, z0: -250, x1: -150, z1: -80, n: 90 }, { x0: -150, z0: -250, x1: 150, z1: -180, n: 120 }, { x0: -250, z0: 215, x1: 250, z1: 252, n: 70 }, { x0: 150, z0: -40, x1: 250, z1: 30, n: 40 }],
    hedgeRows: true,
  }),

  // 5 ─ ART DECO · nguyên mẫu biệt thự hiện đại 1920–30 (Villa Noailles, Eltham Palace): bố cục BẤT ĐỐI XỨNG, khối nằm ngang lệch tâm,
  //     trục hồ gương dài làm xương sống vườn, nhánh chéo 45°, sân thượng bậc, tháp đứng lệch góc như tháp chọc trời.
  artdeco: () => ({
    proto: 'Biệt thự Art Deco (Villa Noailles, Eltham Palace) — bất đối xứng, trục hồ gương, khối chéo 45°',
    concept: 'Khối nhà chính nằm ngang lệch Tây; trục hồ gương dài đâm về phía sau; nhánh chéo 45° dẫn tới xưởng và tháp; tháp lệch góc Đông Bắc.',
    sideGates: [{ id: 'east', x: 260, z: 200, w: 7 }, { id: 'back', x: -60, z: -260, w: 7 }],
    walls: [...line(-250, -20, -150, -20, 1.6, 0.6), ...line(30, -20, 60, -20, 1.6, 0.6)],
    buildings: [
      { id: 'main', name: 'Biệt Thự Chính', fn: 'nhà chính', theme: 0, x: -60, z: 130, w: 76, d: 22, h: 9, floors: 2, plinth: 0.6, back: true, main: true },
      { id: 'guest', name: 'Cánh Khách', fn: 'nhà khách', theme: 1, x: -190, z: 60, w: 50, d: 16, h: 8, floors: 2, ry: FACE_E },
      { id: 'studio', name: 'Xưởng Hoạ (khối chéo)', fn: 'xưởng nghệ thuật', theme: 2, x: 70, z: 55, w: 30, d: 18, h: 8, floors: 2, ry: -Math.PI / 4 },
      { id: 'cinema', name: 'Rạp Chiếu & Phòng Nhạc', fn: 'giải trí', theme: 8, x: 200, z: -100, w: 40, d: 22, h: 9, floors: 1, ry: FACE_W },
      { id: 'garage', name: 'Nhà Xe & Kho', fn: 'kho', theme: 7, x: 170, z: 210, w: 44, d: 14, h: 6, floors: 1 },
      { id: 'poolhouse', name: 'Nhà Hồ Bơi', fn: 'spa', theme: 6, x: 60, z: -200, w: 34, d: 14, h: 6, floors: 1 },
      { id: 'gym', name: 'Phòng Tập', fn: 'thể thao', theme: 5, x: -200, z: -110, w: 30, d: 16, h: 7, floors: 1, ry: FACE_E },
    ],
    tower: { x: 140, z: -20 },
    water: [
      { shape: 'rect', x: -60, z: 30, hw: 9, hd: 70, floor: -1.1 },                                     // trục hồ gương
      { shape: 'rect', x: -60, z: -78, hw: 60, hd: 8, floor: -1.1 },                                    // thanh ngang chữ T
      { shape: 'rect', x: -110, z: -200, hw: 30, hd: 14, floor: -1.6 },                                 // hồ bơi
    ],
    bridges: [{ x: -60, z: 30, len: 26, w: 4.5, rise: 0.6, ry: Q, flat: true }],
    islands: [],
    fountain: { x: -60, z: -130, r: 7 },
    beds: [...[-1, 1].flatMap((sx) => [70, 30, -10].map((z) => ({ x: -60 + sx * 30, z, w: 18, d: 22 }))), ...[-120, 0].map((x) => ({ x, z: -110, w: 30, d: 14 }))],
    rockery: { x: -195, z: -205, w: 40, d: 28, h: 6, kind: 'terrace', name: 'Sân Thượng Ngắm Cảnh' },
    pavs: [
      { id: 'gaz1', name: 'Đình Kính', x: 0, z: -170, w: 10, d: 10 }, { id: 'gaz2', name: 'Đình Tennis', x: 200, z: 120, w: 12, d: 9 },
      { id: 'gaz3', name: 'Đình Đọc Sách', x: -220, z: 190, w: 9, d: 9 }, { id: 'gaz4', name: 'Đình Hồ Gương', x: -60, z: -112, w: 9, d: 9 },
      { id: 'gaz5', name: 'Đình Cuối Vườn', x: 110, z: -232, w: 8, d: 8 }, { id: 'gaz6', name: 'Đình Góc Đông', x: 230, z: 30, w: 8, d: 8 },
    ],
    paths: [
      [9, [0, 258], [0, 190], [-60, 150]],                                                              // đường xe vào lệch
      [6, [-60, 119], [-60, 102]], [4, [-75, 100], [-75, -70]], [4, [-45, 100], [-45, -70]],            // hai lối dọc hồ gương
      [5, [-10, 125], [60, 70]], [5, [80, 40], [140, 8]],                                               // nhánh chéo → xưởng → tháp
      [5, [0, 190], [170, 190], [170, 202]], [4, [180, 190], [258, 200]],
      [4, [-125, -95], [5, -95]], [4, [5, -95], [5, -185]], [4, [-60, -145], [-60, -258]], [4, [5, -150], [180, -100]],
      [4, [-100, 120], [-180, 70]], [4, [-200, -60], [-200, -95]],
    ],
    forecourt: { x: -30, z: 175, w: 90, d: 30 },
    yards: [{ id: 'court', name: 'Sân Trước', x: 60, z: 170, w: 120, d: 40 }, { id: 'mirror', name: 'Vườn Hồ Gương', x: -60, z: 30, w: 80, d: 120 }, { id: 'garden', name: 'Vườn Sau', x: 80, z: -150, w: 120, d: 60 }],
    groves: [{ x0: -250, z0: 180, x1: -120, z1: 252, n: 50 }, { x0: 30, z0: -250, x1: 250, z1: -140, n: 110 }, { x0: -250, z0: -250, x1: -150, z1: -130, n: 60 }, { x0: 190, z0: -60, x1: 250, z1: 180, n: 70 }, { x0: -250, z0: -10, x1: -140, z1: 170, n: 60 }, { x0: 10, z0: 80, x1: 120, z1: 160, n: 40 }, { x0: -120, z0: -250, x1: 30, z1: -150, n: 60 }],
    hedgeRows: true,
  }),

  // 6 ─ TÂN CỔ ĐIỂN · nguyên mẫu Versailles: lâu đài chữ U ôm SÂN DANH DỰ mở về phía cổng; tàu ngựa lớn ở Place d'Armes trước sân;
  //     sau lâu đài: hai bể gương (Parterre d'Eau) → đài phun Latona → Thảm Cỏ Xanh → bể Apollo → ĐẠI KÊNH hình chữ thập;
  //     rừng tỉa ô (bosquet) hai bên; Grand Trianon & Petit Trianon ở cuối vườn; nhà cam (Orangerie) phía Tây; nhà nguyện hoàng gia = lầu.
  tancodien: () => ({
    proto: 'Versailles: lâu đài chữ U + sân danh dự, parterre, Latona, Thảm Cỏ Xanh, Đại Kênh chữ thập, bosquet, Trianon',
    concept: 'Lâu đài chữ U ôm sân danh dự mở về cổng; sau lâu đài là bể gương, đài phun Latona, thảm cỏ, bể Apollo và Đại Kênh chữ thập; hai bên là rừng tỉa ô; Trianon ở cuối vườn.',
    sideGates: [{ id: 'east', x: 260, z: -60, w: 7 }, { id: 'west', x: -260, z: -60, w: 7 }],
    walls: [],
    buildings: [
      { id: 'main', name: 'Lâu Đài Chính (Corps de Logis)', fn: 'chính điện, sảnh gương', theme: 0, x: 0, z: 62, w: 96, d: 24, h: 12, floors: 2, plinth: 1.2, back: true, main: true },
      { id: 'wingW', name: 'Cánh Tây (Aile du Midi)', fn: 'cánh lâu đài', theme: 4, x: -62, z: 122, w: 56, d: 18, h: 11, floors: 2, ry: FACE_E },
      { id: 'wingE', name: 'Cánh Đông (Aile du Nord)', fn: 'cánh lâu đài', theme: 2, x: 62, z: 122, w: 56, d: 18, h: 11, floors: 2, ry: FACE_W },
      { id: 'stableW', name: 'Đại Tàu Ngựa', fn: 'tàu ngựa', theme: 7, x: -150, z: 215, w: 70, d: 16, h: 9, floors: 1, ry: FACE_N },
      { id: 'stableE', name: 'Tiểu Tàu Ngựa', fn: 'tàu ngựa', theme: 3, x: 150, z: 215, w: 70, d: 16, h: 9, floors: 1, ry: FACE_N },
      { id: 'orangerie', name: 'Nhà Cam (Orangerie)', fn: 'nhà kính cam', theme: 1, x: -170, z: 20, w: 60, d: 14, h: 7, floors: 1, ry: FACE_E },
      { id: 'grandtrianon', name: 'Grand Trianon', fn: 'cung nghỉ', theme: 8, x: 195, z: -150, w: 50, d: 18, h: 8, floors: 1, ry: FACE_W },
      { id: 'petittrianon', name: 'Petit Trianon', fn: 'cung nhỏ', theme: 9, x: -195, z: -150, w: 26, d: 26, h: 10, floors: 2, ry: FACE_E },
    ],
    tower: { x: 160, z: 70 },
    water: [
      { shape: 'rect', x: 0, z: -205, hw: 9, hd: 42, floor: -1.9 },                                    // Đại Kênh dọc
      { shape: 'rect', x: -40, z: 22, hw: 26, hd: 10, floor: -1.1 }, { shape: 'rect', x: 40, z: 22, hw: 26, hd: 10, floor: -1.1 }, // Parterre d'Eau
      { shape: 'ellipse', x: 0, z: -132, rx: 24, rz: 16, floor: -1.6 },                                // bể Apollo
      { shape: 'rect', x: -91, z: -215, hw: 82, hd: 8, floor: -1.9 }, { shape: 'rect', x: 91, z: -215, hw: 82, hd: 8, floor: -1.9 }, // tay ngang chữ thập
    ],
    bridges: [{ x: 0, z: -180, len: 26, w: 5, rise: 1.2, ry: Q }],
    islands: [],
    fountain: { x: 0, z: -40, r: 9 },                                                                   // Latona
    beds: [...[-1, 1].flatMap((sx) => [[-78], [-104]].map(([z]) => ({ x: sx * 42, z, w: 28, d: 18 }))), ...[-1, 1].flatMap((sx) => [8, 36].map((z) => ({ x: sx * 105, z, w: 34, d: 20 })))],
    rockery: { x: 215, z: -215, w: 34, d: 26, h: 6, kind: 'terrace', name: 'Belvedere · đài vọng cảnh' },
    statues: [{ x: 0, z: 185, ry: 0, s: 3 }],
    pavs: [
      { id: 'colonnade', name: 'Hành Lang Cột (Colonnade)', x: -100, z: -150, w: 14, d: 14, octa: true }, { id: 'amour', name: 'Đền Tình Yêu', x: 100, z: -150, w: 9, d: 9, octa: true },
      { id: 'bosq1', name: 'Đình Bosquet Tây', x: -130, z: -100, w: 9, d: 9 }, { id: 'bosq2', name: 'Đình Bosquet Đông', x: 130, z: -100, w: 9, d: 9 },
      { id: 'canalW', name: 'Đình Đầu Kênh Tây', x: -205, z: -230, w: 9, d: 9 }, { id: 'menag', name: 'Đình Thú (Ménagerie)', x: -215, z: 120, w: 9, d: 9 },
    ],
    paths: [
      [10, [0, 258], [0, 76]], [6, [0, 48], [0, 32]], [8, [0, 32], [0, -24]], [30, [0, -56], [0, -112]], [6, [0, -150], [0, -160]], // trục chính → Thảm Cỏ Xanh
      [6, [-230, 238], [230, 238]], [5, [-240, -62], [240, -62]], [5, [-180, -62], [-180, -200]], [5, [180, -62], [180, -200]],
      [4, [-100, -62], [-100, -129]], [4, [100, -62], [100, -142]], [5, [0, 175], [160, 175], [160, 97]], [4, [-52, 60], [-150, 60], [-150, 20], [-160, 20]],
    ],
    forecourt: { x: 0, z: 150, w: 104, d: 60 },
    yards: [{ id: 'cour', name: "Sân Danh Dự (Cour d'Honneur)", x: 0, z: 160, w: 100, d: 50 }, { id: 'parterre', name: 'Parterre', x: 0, z: 0, w: 160, d: 40 }, { id: 'bosquet', name: 'Rừng Tỉa Ô', x: -150, z: -110, w: 80, d: 60 }],
    groves: [{ x0: -170, z0: -200, x1: -30, z1: -70, n: 150 }, { x0: 30, z0: -200, x1: 170, z1: -70, n: 150 }, { x0: -250, z0: -250, x1: 250, z1: -228, n: 60 }, { x0: -250, z0: 60, x1: -100, z1: 200, n: 60 }, { x0: 190, z0: 30, x1: 250, z1: 200, n: 50 }, { x0: 200, z0: -120, x1: 250, z1: -70, n: 20 }],
    hedgeRows: true,
  }),

  // 7 ─ CUNG ĐÌNH HUẾ · nguyên mẫu Hoàng Thành Huế: vòng tường Hoàng Thành, Ngọ Môn ở Nam; hồ Kim Thủy (Thái Dịch) có cầu Trung Đạo
  //     trên trục Thần Đạo; sân Đại Triều Nghi → điện Thái Hòa; Đại Cung Môn → Tử Cấm Thành (tường riêng) có điện Cần Chánh và lầu
  //     Kiến Trung; «tả nam hữu nữ»: Thế Miếu phía Tây, cung Diên Thọ phía Đông; Ngự Uyển + hồ Tịnh Tâm ngoài tường Bắc.
  hue: () => ({
    proto: 'Hoàng Thành Huế: Ngọ Môn, hồ Thái Dịch + cầu Trung Đạo, Thái Hòa, Tử Cấm Thành, Thế Miếu, Diên Thọ, Ngự Uyển',
    concept: 'Hai lớp tường: Hoàng Thành và Tử Cấm Thành; một trục Thần Đạo duy nhất qua hồ Thái Dịch (cầu Trung Đạo), điện Thái Hòa, Cần Chánh, lầu Kiến Trung. Theo vị trí thật (docs/tienphu-nghiencuu/07-hue.md): Thế Miếu góc Tây Nam, Hiển Lâm Các trước mặt Thế Miếu; Thái Miếu góc Đông Nam đối xứng; Diên Thọ, Trường Sanh phía Tây; Tả Vu (văn) phía Đông, Hữu Vu (võ) phía Tây sân Cần Chánh; Quốc Sử Quán ngoài Hoàng Thành; Ngự Uyển ngoài tường Bắc.',
    sideGates: [{ id: 'east', x: 260, z: 100, w: 7 }, { id: 'west', x: -260, z: 100, w: 7 }, { id: 'back', x: -215, z: -260, w: 7 }],
    walls: [
      ...ring(-160, -150, 160, 176, 6, { s: [[0, 12]], n: [[0, 8]], e: [[100, 6]], w: [[100, 6]] }, 1.8), // Hoàng Thành
      ...ring(-82, -128, 82, 36, 5, { s: [[0, 10]], n: [[0, 8]] }),                                     // Tử Cấm Thành
    ],
    buildings: [
      { id: 'main', name: 'Điện Thái Hòa', fn: 'điện thiết triều', theme: 0, x: 0, z: 76, w: 50, d: 26, h: 13, floors: 1, plinth: 2.4, back: true, main: true },
      { id: 'canchanh', name: 'Điện Cần Chánh', fn: 'điện làm việc', theme: 3, x: 0, z: 2, w: 42, d: 20, h: 11, floors: 1, plinth: 1.6, back: true },
      { id: 'tavu', name: 'Tả Vu', fn: 'nhà quan văn (Đông)', theme: 2, x: 58, z: -2, w: 30, d: 12, h: 8, floors: 1, ry: FACE_W },
      { id: 'huuvu', name: 'Hữu Vu', fn: 'nhà quan võ (Tây)', theme: 7, x: -58, z: -2, w: 30, d: 12, h: 8, floors: 1, ry: FACE_E },
      { id: 'themieu', name: 'Thế Miếu', fn: 'miếu thờ các vua (góc Tây Nam)', theme: 5, x: -110, z: 118, w: 32, d: 50, h: 10, floors: 1, ry: FACE_S },
      { id: 'dientho', name: 'Cung Diên Thọ', fn: 'cung Thái hậu (phía Tây)', theme: 4, x: -120, z: 50, w: 32, d: 44, h: 9, floors: 1 },
      { id: 'truongsanh', name: 'Cung Trường Sanh', fn: 'cung dưỡng lão (phía Tây)', theme: 1, x: -122, z: -42, w: 34, d: 18, h: 8, floors: 1 },
      { id: 'hienlam', name: 'Hiển Lâm Các', fn: 'gác tưởng niệm (trước Thế Miếu)', theme: 9, x: -110, z: 158, w: 20, d: 20, h: 13, floors: 2, ry: FACE_N },
      { id: 'thaimieu', name: 'Thái Miếu', fn: 'miếu (góc Đông Nam)', theme: 6, x: 110, z: 120, w: 34, d: 18, h: 9, floors: 1 },
      { id: 'quocsu', name: 'Quốc Sử Quán', fn: 'nhà chép sử (ngoài Hoàng Thành)', theme: 2, x: 210, z: 40, w: 34, d: 18, h: 9, floors: 1 },
    ],
    tower: { x: 0, z: -78 },
    water: [
      { shape: 'rect', x: 0, z: 146, hw: 72, hd: 12, floor: -1.9 },                                    // hồ Thái Dịch (cầu Trung Đạo)
      { shape: 'rect', x: 0, z: -212, hw: 150, hd: 26, floor: -1.9 },                                  // hồ Tịnh Tâm (Ngự Uyển)
    ],
    islands: [{ x: 0, z: -212, r: 12, pav: true }],
    bridges: [{ x: 0, z: 146, len: 30, w: 9, rise: 0.8, ry: 0, flat: true }, { x: 0, z: -193, len: 20, w: 4.5, rise: 1.2, ry: 0 }, { x: -90, z: -212, len: 58, w: 4, rise: 1.4, ry: 0 }],
    rockery: { x: -215, z: -110, w: 40, d: 30, h: 9, kind: 'rock', name: 'Thiệu Phương Viên · non bộ' },
    flagPoles: [[-24, 222]],
    pavs: [
      { id: 'ngomonW', name: 'Lầu Ngũ Phụng Tây', x: -14, z: 186, w: 9, d: 9 }, { id: 'ngomonE', name: 'Lầu Ngũ Phụng Đông', x: 14, z: 186, w: 9, d: 9 },
      { id: 'kimthuyW', name: 'Đình Kim Thủy Tây', x: -80, z: 146, w: 8, d: 8 }, { id: 'kimthuyE', name: 'Đình Kim Thủy Đông', x: 80, z: 146, w: 8, d: 8 },
      { id: 'tinhtam1', name: 'Đình Tịnh Tâm Đông', x: 205, z: -120, w: 9, d: 9 }, { id: 'thieuphuong', name: 'Đình Thiệu Phương', x: -238, z: -40, w: 9, d: 9, octa: true },
    ],
    paths: [
      [10, [0, 258], [0, 160]], [10, [0, 132], [0, 114]], [8, [0, 52], [0, 21]], [8, [0, -16], [0, -44]], // Thần Đạo: Ngọ Môn → cầu Trung Đạo → Thái Hòa → Cần Chánh → lầu
      [5, [0, -105], [0, -182]], [4, [-258, 100], [-30, 100]], [4, [30, 100], [258, 100]],                // đường ngang qua hai cửa hông Hoàng Thành
      [4, [-150, 100], [-150, 142], [-88, 142]], [4, [150, 100], [150, 138], [140, 138]],                 // sân trước Thế Miếu / Thái Miếu
      [4, [-120, 100], [-120, 68]], [4, [-95, 100], [-95, -19], [-122, -19]], [4, [210, 100], [210, 60]], // Diên Thọ · Trường Sanh · Quốc Sử Quán
      [4, [-150, 165], [-125, 165]], [4, [150, 165], [92, 165], [92, 160]],
      [4, [-160, -175], [160, -175]], [4, [-215, 100], [-215, -80]], [4, [-215, -125], [-215, -258]], [4, [240, 100], [240, -100], [212, -100]],
    ],

    forecourt: { x: 0, z: 110, w: 90, d: 30 },
    yards: [{ id: 'daitrieu', name: 'Sân Đại Triều Nghi', x: 0, z: 112, w: 90, d: 30 }, { id: 'tucam', name: 'Tử Cấm Thành', x: 0, z: -40, w: 70, d: 40 }, { id: 'nguuyen', name: 'Ngự Uyển', x: 0, z: -175, w: 200, d: 30 }],
    groves: [{ x0: -250, z0: -250, x1: 250, z1: -160, n: 160 }, { x0: -250, z0: -150, x1: -168, z1: 250, n: 100 }, { x0: 168, z0: -150, x1: 250, z1: 250, n: 100 }, { x0: -150, z0: 182, x1: 150, z1: 250, n: 60 }, { x0: -155, z0: -145, x1: -90, z1: 170, n: 50 }, { x0: 90, z0: -145, x1: 155, z1: 170, n: 50 }],
    pairs: true,
  }),

  // 8 ─ CUNG ĐIỆN THÁI – KHMER · nguyên mẫu Đại Cung điện Bangkok: chia 4 khu có tường — chùa Phật Ngọc (Wat Phra Kaew) góc trước Đông
  //     với hành lang bao quanh, tháp chedi vàng, prang; Ngoại triều (công sở) trước Tây; Trung điện (Chakri Maha Prasat, Dusit Maha
  //     Prasat = lầu chóp) ở giữa; Nội cung ở sau cùng có vườn Siwalai và kênh nước bao đảo đình.
  thai: () => ({
    proto: 'Đại Cung điện Bangkok: Wat Phra Kaew góc Đông Bắc, Ngoại triều, Trung điện (Chakri, Dusit), Nội cung',
    concept: 'Bốn khu có tường riêng: chùa Phật Ngọc ở góc trước Đông, Ngoại triều trước Tây, Trung điện ở giữa (Chakri và lầu chóp Dusit), Nội cung phía sau có kênh bao đảo đình.',
    sideGates: [{ id: 'east', x: 260, z: -50, w: 7 }, { id: 'west', x: -260, z: 175, w: 7 }],
    walls: [
      ...ring(30, 40, 246, 246, 5, { w: [[150, 8]] }),                                                   // Wat Phra Kaew (hành lang bao)
      ...line(-250, 112, -8, 112, 4.5), ...line(10, 112, 30, 112, 4.5), ...line(-250, -82, -32, -82, 4.5), ...line(-12, -82, 250, -82, 4.5), // ngăn Ngoại triều / Nội cung
    ],
    buildings: [
      { id: 'main', name: 'Chakri Maha Prasat', fn: 'cung chính (trung điện)', theme: 0, x: -50, z: 40, w: 60, d: 26, h: 13, floors: 2, plinth: 1.6, back: true, main: true },
      { id: 'ubosot', name: 'Ubosot Phật Ngọc', fn: 'điện thờ trong Wat Phra Kaew', theme: 5, x: 130, z: 100, w: 40, d: 22, h: 12, floors: 1, plinth: 1.6 },
      { id: 'monthien', name: 'Phra Maha Monthien', fn: 'điện thiết triều', theme: 3, x: 110, z: -20, w: 44, d: 22, h: 10, floors: 1, ry: FACE_W },
      { id: 'officeW', name: 'Bộ Hộ (Ngoại triều)', fn: 'công sở', theme: 7, x: -160, z: 200, w: 52, d: 16, h: 8, floors: 2 },
      { id: 'officeE', name: 'Bộ Binh (Ngoại triều)', fn: 'công sở', theme: 2, x: -160, z: 148, w: 52, d: 16, h: 8, floors: 2 },
      { id: 'inner1', name: 'Nội Cung Tây', fn: 'nội cung', theme: 4, x: -180, z: -140, w: 40, d: 16, h: 8, floors: 2 },
      { id: 'inner2', name: 'Nội Cung Giữa', fn: 'nội cung', theme: 1, x: -90, z: -190, w: 40, d: 16, h: 8, floors: 2 },
      { id: 'inner3', name: 'Nội Cung Đông', fn: 'nội cung', theme: 6, x: 36, z: -130, w: 26, d: 14, h: 8, floors: 2 },
      { id: 'library', name: 'Phra Mondop (thư viện kinh)', fn: 'tàng kinh', theme: 2, x: 200, z: 175, w: 22, d: 22, h: 12, floors: 2, plinth: 1.6 },
    ],
    tower: { x: -150, z: 0 },
    water: [ // kênh bao đảo đình Siwalai (nội cung)
      { shape: 'rect', x: 140, z: -112, hw: 82, hd: 9 }, { shape: 'rect', x: 140, z: -226, hw: 82, hd: 9 },
      { shape: 'rect', x: 67, z: -169, hw: 9, hd: 48 }, { shape: 'rect', x: 213, z: -169, hw: 9, hd: 48 },
    ],
    moatIsle: { x: 140, z: -169, hw: 64, hd: 48 },
    bridges: [{ x: 140, z: -112, len: 24, w: 6, rise: 1.2, ry: 0 }, { x: 67, z: -169, len: 24, w: 5, rise: 1.0, ry: Q }],
    islands: [],
    stupas: [[90, 200, 22, 7], [130, 200, 12, 3], [165, 200, 12, 3], [70, 60, 9, 2.5], [190, 60, 9, 2.5], [110, -169, 12, 3], [170, -169, 12, 3]].map(([x, z, h, r]) => ({ x, z, h, r })),
    rockery: { x: -200, z: -220, w: 40, d: 30, h: 9, kind: 'rock', name: 'Khao Mo · núi giả' },
    pavs: [
      { id: 'sala1', name: 'Sala Siwalai', x: 140, z: -150, w: 12, d: 9 }, { id: 'sala2', name: 'Sala Đảo Đông', x: 140, z: -195, w: 12, d: 9 },
      { id: 'aphorn', name: 'Aphorn Phimok', x: -130, z: 80, w: 9, d: 9 }, { id: 'sala3', name: 'Sala Ngoại Triều', x: -80, z: 245, w: 10, d: 8 },
      { id: 'sala4', name: 'Sala Cổng Chùa', x: 16, z: 188, w: 8, d: 8 }, { id: 'sala5', name: 'Sala Nội Cung', x: -150, z: -220, w: 9, d: 9 },
    ],
    paths: [
      [8, [0, 258], [0, 160], [26, 160]], [6, [0, 160], [0, 120]], [6, [34, 150], [130, 150], [130, 134]], // vào → cổng chùa / trung điện
      [6, [0, 120], [0, 104], [-50, 80], [-50, 56]], [5, [-50, 80], [-100, 80], [-100, 40], [-150, 36]], [5, [-50, 8], [-22, -10], [-22, -78]], [5, [-22, -20], [96, -20]],
      [4, [-22, -86], [-22, -160]], [4, [-165, -160], [52, -160]], [4, [-22, -95], [140, -95], [140, -124]], [4, [130, 150], [200, 150], [200, 163]],
      [5, [0, 230], [-160, 230], [-160, 214]], [5, [0, 175], [-160, 175], [-160, 162]], [4, [-258, 175], [-190, 175]], [4, [258, -50], [100, -50]],
    ],
    forecourt: { x: 0, z: 200, w: 40, d: 80 },
    yards: [{ id: 'outer', name: 'Ngoại Triều', x: -120, z: 175, w: 120, d: 40 }, { id: 'wat', name: 'Sân Chùa Phật Ngọc', x: 140, z: 150, w: 120, d: 30 }, { id: 'middle', name: 'Trung Điện', x: 30, z: 40, w: 100, d: 40 }, { id: 'siwalai', name: 'Vườn Siwalai', x: 140, z: -169, w: 100, d: 70 }],
    groves: [{ x0: -250, z0: -250, x1: 50, z1: -90, n: 170 }, { x0: -250, z0: -75, x1: -190, z1: 105, n: 60 }, { x0: 150, z0: -75, x1: 250, z1: 30, n: 50 }, { x0: 40, z0: 50, x1: 240, z1: 240, n: 60 }, { x0: -250, z0: 120, x1: -200, z1: 250, n: 30 }, { x0: 230, z0: -250, x1: 250, z1: -90, n: 20 }],
    pairs: true,
  }),

  // 9 ─ CUNG ĐIỆN MUGHAL · nguyên mẫu Taj Mahal: Jilaukhana (sân trước) có dãy nhà phục dịch; Đại Môn (Darwaza) chuyển từ trần thế
  //     sang vườn; CHARBAGH vuông chia 4 bởi kênh nước, hồ nổi ở tâm; lăng (lầu) KHÔNG ở tâm vườn mà ở cuối, trên bệ ven sông,
  //     kẹp giữa Thánh đường (Tây) và Jawab (Đông); sông Yamuna chạy ngang phía sau.
  mughal: () => ({
    proto: 'Taj Mahal (Agra): Jilaukhana, Đại Môn, charbagh 4 phần, lăng ở cuối trên bệ ven sông, Thánh đường + Jawab',
    concept: 'Trục Nam – Bắc theo đúng thứ tự Taj Mahal: sân Jilaukhana kẹp giữa hai Khawasspura → Đại Môn trong tường vườn → charbagh chia 4 bởi kênh chữ thập, hồ nổi ở tâm, Naubat Khana giữa tường Đông / Tây → bệ ven sông: lăng (bệ 101 m, 4 minaret) ở giữa, Thánh đường bên Tây và Jawab bên Đông quay mặt vào lăng → sông Yamuna. Cỡ theo hệ số chung S = 1,06 × số đo thật (docs/tienphu-nghiencuu/09-mughal.md).',
    sideGates: [{ id: 'east', x: 260, z: 205, w: 7 }, { id: 'west', x: -260, z: 205, w: 7 }],
    walls: [
      ...ring(-122, -110, 122, 135, 5, { s: [[0, 24]], n: [[0, 22]], e: [[12, 36]], w: [[12, 36]] }, 1.6),   // tường vườn charbagh (cửa: Đại Môn · bệ lăng · hai Naubat)
    ],
    buildings: [
      { id: 'main', name: 'Đại Môn (Darwaza-i Rauza)', fn: 'cổng lớn — chính điện tiếp khách', theme: 0, x: 0, z: 160, w: 44, d: 22, h: 14, floors: 2, plinth: 1.8, back: true, main: true },
      { id: 'mosque', name: 'Thánh Đường (Masjid)', fn: 'thánh đường (Tây, quay vào lăng)', theme: 5, x: -81.5, z: -172, w: 44, d: 20, h: 11, floors: 1, plinth: 2.4, ry: FACE_E },
      { id: 'jawab', name: 'Jawab (Mihman Khana)', fn: 'nhà khách đối xứng (Đông)', theme: 1, x: 81.5, z: -172, w: 44, d: 20, h: 11, floors: 1, plinth: 2.4, ry: FACE_W },
      { id: 'khawasW', name: 'Khawasspura Tây', fn: 'nhà phục dịch Jilaukhana', theme: 7, x: -180, z: 215, w: 70, d: 14, h: 8, floors: 2, ry: FACE_N },
      { id: 'khawasE', name: 'Khawasspura Đông', fn: 'nhà phục dịch Jilaukhana', theme: 6, x: 180, z: 215, w: 70, d: 14, h: 8, floors: 2, ry: FACE_N },
      { id: 'naubatW', name: 'Naubat Khana Tây', fn: 'lầu nhạc giữa tường vườn Tây', theme: 8, x: -132, z: 12, w: 30, d: 16, h: 9, floors: 2, ry: FACE_E },
      { id: 'naubatE', name: 'Naubat Khana Đông', fn: 'lầu nhạc giữa tường vườn Đông', theme: 3, x: 132, z: 12, w: 30, d: 16, h: 9, floors: 2, ry: FACE_W },
      { id: 'tombW', name: 'Lăng Phụ Tây', fn: 'lăng phụ trong Jilaukhana', theme: 9, x: -112, z: 175, w: 20, d: 20, h: 10, floors: 1 },
    ],
    tower: { x: 0, z: -172 },
    water: [
      { shape: 'rect', x: 0, z: 12.5, hw: 3.5, hd: 115, floor: -1.2 }, { shape: 'rect', x: 0, z: 12.5, hw: 110, hd: 3.5, floor: -1.2 }, // kênh chữ thập
      { shape: 'rect', x: 0, z: 12.5, hw: 13, hd: 13, floor: -1.2 },                                       // hồ nổi ở tâm
      { shape: 'rect', x: 0, z: -246, hw: 250, hd: 8, floor: -1.9 },                                       // sông Yamuna
    ],
    bridges: [[-17, 12.5, 0], [17, 12.5, 0], [-64.5, 12.5, 0], [64.5, 12.5, 0], [0, 29.5, Q], [0, -4.5, Q], [0, 77, Q], [0, -52, Q], [0, 125.5, Q], [0, -100.5, Q]].map(([x, z, ry]) => ({ x, z, len: 9, w: 4.5, rise: 0.3, ry, flat: true })),
    islands: [],
    beds: [-1, 1].flatMap((sx) => [-1, 1].flatMap((sz) => [0, 1].flatMap((a) => [0, 1].map((b) => ({ x: sx * (40 + 49 * a), z: 12.5 + sz * (40 + 49 * b), w: 38, d: 38 }))))),
    rockery: { x: -205, z: -60, w: 36, d: 26, h: 6, kind: 'terrace', name: 'Đài Ngắm Trăng (Mahtab)' },
    pavs: [
      { id: 'chhatriSW', name: 'Chhatri Tây Nam', x: -131, z: 144, w: 7, d: 7, octa: true }, { id: 'chhatriSE', name: 'Chhatri Đông Nam', x: 131, z: 144, w: 7, d: 7, octa: true },
      { id: 'chhatriNW', name: 'Chhatri Tây Bắc', x: -131, z: -119, w: 7, d: 7, octa: true }, { id: 'chhatriNE', name: 'Chhatri Đông Bắc', x: 131, z: -119, w: 7, d: 7, octa: true },
      { id: 'baradari', name: 'Baradari Ven Sông', x: 200, z: -205, w: 14, d: 10 }, { id: 'riverW', name: 'Đình Bến Sông Tây', x: -200, z: -205, w: 10, d: 10 },
    ],
    paths: [
      [8, [0, 258], [0, 183]],                                                                               // Jilaukhana → Đại Môn
      [5, [0, 137], [-17, 128], [-17, -98], [0, -106], [0, -109]], [5, [0, 137], [17, 128], [17, -98], [0, -106]], // hai bên kênh dọc → bệ lăng
      [5, [-113, 29.5], [113, 29.5]], [5, [-113, -4.5], [113, -4.5]], [5, [-113, 77], [113, 77]], [5, [-113, -52], [113, -52]], // lối ngang
      [5, [-113, 125.5], [113, 125.5]], [5, [-113, -100.5], [-23, -100.5]], [5, [23, -100.5], [113, -100.5]],                    // lối vòng trong tường
      [5, [-113, 125.5], [-113, -100.5]], [5, [113, 125.5], [113, -100.5]], [4, [-64.5, 125.5], [-64.5, -100.5]], [4, [64.5, 125.5], [64.5, -100.5]],
      [4, [-11, -113], [-61, -113], [-61, -232]], [4, [11, -113], [61, -113], [61, -232]], [5, [-230, -232], [230, -232]],          // bệ ven sông
      [4, [-258, 205], [-222, 205]], [4, [222, 205], [258, 205]],
    ],
    forecourt: { x: 0, z: 220, w: 180, d: 70 },
    yards: [{ id: 'jilau', name: 'Jilaukhana', x: 0, z: 220, w: 180, d: 60 }, { id: 'charbagh', name: 'Charbagh', x: 64, z: 64, w: 90, d: 90 }, { id: 'terrace', name: 'Bệ Ven Sông', x: 0, z: -232, w: 300, d: 8 }],
    groves: [{ x0: -250, z0: -110, x1: -145, z1: 135, n: 170 }, { x0: 145, z0: -110, x1: 250, z1: 135, n: 170 }, { x0: -118, z0: -106, x1: 118, z1: 131, n: 220 }, { x0: -250, z0: -236, x1: 250, z1: -205, n: 60 }],
  }),
};

/** bản thiết kế mặt bằng của phong cách st (gọi một lần / phủ — plan.js chuyển thành quy hoạch đầy đủ) */
export function sitePlan(st) {
  const f = SITES[st.id];
  if (!f) throw new Error(`thiếu tổng mặt bằng cho phong cách ${st.id}`);
  return f();
}
export const SITE_IDS = Object.keys(SITES);
