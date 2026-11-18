// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ THÁI (Đại Hoàng Cung Bangkok · Wat Phra Kaew).
//  Số lấy từ docs/tienphu-nghiencuu/08-thai.md: mục id tương ứng, §8 «đề xuất cho game»; quy tắc chung A1–A7.
//  Mọi điện vào ở ĐẦU HỒI (+z) trừ Chakri và Sutthaisawan (A7.1). Màu theo A6.
// ============================================================================
const hall = (o) => ({ type: 'hall', ...o });
const sala = (o) => ({ type: 'hall', open: true, naga: false, ...o });

export const TH_SPECS = {
  tower: {
    type: 'tower', roofDesc: 'mái hiên ngói xanh lá viền cam ở 4 hành lang + diềm vòng 3 cấp có mukh hồi giữa mặt, 28 chóp busabok 5 tầng trên diềm (12 · 12 · 4 theo cấp), 4 mukh hồi lồng ở tầng 10, đình đỉnh mái chữ thập + chóp 7 tầng Garuda đỡ', name: 'Đâu Suất Lâu (lầu 10 tầng)', proto: 'Dusit Maha Prasat (Rama I, 1789–90: chữ thập, chóp 7 tầng Garuda đỡ, bệ 2,85 m) + cách xếp 3 cấp sân đi vòng có tượng đỡ của prang Wat Arun + 3 cấp lùi có chóp góc của Loha Prasat',
    src: '08 › tower §2–§8: bệ vuông 46,8 m cao 2,85 m (gờ sư tử, băng Garuda, bậc lan can Naga 5 đầu); thân lùi 3 cấp: 34 m (tầng 1–4) · 26 m (tầng 5–7) · 20 m (tầng 8–10; nghiên cứu đề xuất 19 m, nâng lên 20 m cho điều kiện 2a ≥ 20 m); mỗi cấp có hành lang cột 12 góc mái hiên, diềm mái vòng có mukh hồi + chofa giữa mặt, tượng đỡ dưới diềm, 4 chóp busabok 5 tầng ở góc; tầng 10 có 4 mukh hồi nhiều lớp (Dusit thu nhỏ); Vọng Đài: đình prasat mở, mái chữ thập, chóp 7 tầng (maha prasat), Garuda đỡ; đỉnh 71 m (đề xuất 69–71 m). Lệch: 4 cầu thang lan can Naga chỉ làm 1 (mặt trước) vì va chạm thềm game chỉ có bậc mặt trước; tầng 10 là thân vuông 20 m có mái chữ thập thay vì mặt bằng chữ thập 13 m (điều kiện 20 m)',
  },
  main: {
    type: 'chakri', roofDesc: 'mái Thái ngói cam đỏ viền xanh: mái dài suốt mặt tiền 3 son (dốc 24°) + lot đầu hồi; 3 lầu mái hồi quay ra trước (giữa 3 hồi lồng, bên 2), 3 chóp prasat 7 tầng Garuda đỡ', name: 'Chakri Maha Prasat', proto: 'Phra Thinang Chakri Maha Prasat (1876–1882, KTS John Clunis) — «người Tây đội mũ chada»: thân Phục Hưng Ý 3 tầng, mái Thái và 3 chóp prasat 7 tầng',
    L: 72, D: 20, floors: [4.0, 5.8, 5.8], ph: 0.3, proj: [1.2, 2.4], back: { W: 14, D: 17 }, balcony: { d: 2.6, w: 12 },
    wingRoof: { p: 0.45, son: 3, tile: 'Orange', border: 'Green' }, pavRoof: { p: 1.12, hwSide: 5.4, hwCenter: 6.0 }, spires: { side: 33.5, center: 40.3 },
    src: '08 › main §2–§8 (tỉ lệ 0,8): mặt tiền 72 m chia 5 đoạn × 14,4 m (lầu bên 3 cửa, cánh 7 cửa vòm mỗi tầng, lầu giữa có cổng vòm, ban công, cầu thang đôi), sâu 20 m + sảnh sau 14 × 17 m (dáng chữ T); 3 tầng: nền giả đá nâu đỏ 4,0 m + 2 × 5,8 m kem có cột ốp, gờ mái 15,6 m; mái Thái cam đỏ viền xanh lùi tầng; 3 chóp 7 tầng Garuda đỡ: hai bên 33,5 m, giữa 40,3 m (= 50,4 × 0,8). Chưa làm: 2 voi đồng trước bậc, chân dung Rama V trên hồi giữa',
  },
  officeE: {
    type: 'long', roofDesc: 'mái hồi nóc dọc mặt tiền, ngói cam viền xanh, 1 son + dải hiên đỡ consol, hồi 2 lớp có chofa hai đầu; lầu giữa mái chữ thập + chóp mondop 5 tầng', name: 'Bộ Binh — Phra Thinang Sutthaisawan Prasat', proto: 'Sutthaisawan Prasat (Rama I, 1784) — điện dài trên tường thành phía Đông, ban công gỗ giữa để vua duyệt quân, chóp mondop 5 tầng',
    L: 52, D: 9, base: 2.5, floors: [3.5, 4.0], cw: 10.4, cproj: 1.0, nWin: 9,
    roof: { p: 0.95, tile: 'Orange', border: 'Green', eave: 1.0 }, center: { hw: 4.6, p: 1.2 }, spire: { tiers: 5, top: 22 },
    src: '08 › officeE §2–§8: 52 × 11 m mép mái (thân sâu 9 m), mặt chính ở CẠNH DÀI (ngoại lệ A7.1); chân tường thành 2,5 m có ô vòm mù; 2 tầng 3,5 + 4,0 m, 9 cửa chớp lục xám mỗi cánh mỗi tầng; lầu giữa 10,4 m nhô 1 m có ban công gỗ tầng trên; mái cam viền xanh, hồi nhỏ có chofa hai đầu; chóp 5 tầng tới 22 m',
  },
  ubosot: hall({
    roofDesc: 'mái hồi 3 son dốc 55°, mỗi đầu 3 hồi lồng (2 lot hạ 1,6 m); ngói lam viền cam, dải hiên cam viền vàng; lamyong đủ bộ, trán hồi Narayana cưỡi Garuda', name: 'Ubosot Phật Ngọc', proto: 'Phra Ubosot, Wat Phra Kaew (Rama I, 1783) — điện thụ giới thờ Phật Ngọc: hiên cột bao 4 phía, mái 3 tầng, 3 cửa mỗi đầu hồi',
    W: 16, L: 45, v: 3, f: 3, b: 3, ph: 2.0, wallH: 9, colD: 0.75, colStep: 3.0, garuda: 1.0,
    doors: { n: 3, w: 2.6 }, backDoors: 3, backStair: true, win: { n: 11, frame: 'sum' },
    roof: { p: 1.45, son: 3, tile: 'Blue', border: 'Orange', eaveTile: 'Orange', eaveBorder: 'Yellow', lotsF: { n: 2, drop: 1.6 }, lotsB: { n: 2, drop: 1.6 }, chofaH: 2.4 },
    src: '08 › ubosot §2, §8: hiên cột 22 × 51 m (đầu hồi 22 m là mặt tiền), tỉ lệ dài/rộng 2,3; bệ 2,0 m có băng Garuda (~1 tượng / m, thật 112); 8 × 17 hàng cột vuông 12 góc nhịp 3 m; mái 3 son (2 dải chính + dải hiên) dốc 55°, 3 hồi lồng mỗi đầu (2 lot hạ 1,6 m); ngói lam viền cam, dải hiên cam viền vàng; 3 cửa mỗi đầu hồi. Chưa làm: 8 đình bai sema và tường thấp bao quanh, 12 sư tử đồng',
  }),
  monthien: hall({
    roofDesc: 'mái hồi 3 dải (2 son chính dốc 45° + dải hiên consol), 3 hồi lồng mặt tiền, 2 mặt hậu; ngói xanh lá viền cam', name: 'Phra Maha Monthien (điện Amarin Winitchai)', proto: 'Amarin Winitchai — sảnh thiết triều đầu nhóm Phra Maha Monthien (Rama I): đầu hồi quay ra sân, mái 3 dải xanh lá viền cam, cửa sổ khung vương miện',
    W: 19, L: 26, f: 3, ph: 0.6, wallH: 7.6, colD: 0.62,
    doors: { n: 3, w: 2.6 }, win: { n: 7, frame: 'crown', w: 1.4, h: 3.4, y: 1.5 }, shutter: 'shutter',
    roof: { p: 1.0, son: 3, eave: 1.8, tile: 'Green', border: 'Orange', lotsF: { n: 2, drop: 1.3 }, lotsB: { n: 1, drop: 1.3 }, chofaH: 1.9 },
    src: '08 › monthien §2–§5, §8: mặt hồi 22 m × sâu 30 m (thân 19 × 26 + hiên trước 3 m), bệ 0,6 m (thật 0,5), nóc ≈ 19 m (đề xuất, chưa có số đo); 3 dải mái (2 dải chính + dải hiên đỡ consol), 3 hồi lồng ở mặt tiền; 7 cửa sổ khung vương miện mỗi bên. Chưa làm: cổng Thewaphiban 3 chóp, điện Phaisan Thaksin phía sau',
  }),
  officeW: hall({
    roofDesc: 'mái hồi 2 son (chính dốc 45° + dải hiên), mỗi đầu 2 hồi lồng nhô khỏi tường; ngói cam viền xanh', name: 'Bộ Hộ — Phra Thinang Ratchakaranya Sapha', proto: 'Ratchakaranya Sapha (Rama V) — phòng họp Hội đồng Cơ mật: nhà Thái 2 tầng kín, hồi nhô vượt đường mái',
    W: 12, L: 18, ph: 1.0, storeys: [4.5, 4.5], colD: 0.5,
    doors: { n: 1, w: 2.4, h: 3.2 }, endWin: 2, win: { n: 4, frame: 'sum', w: 1.1, h: 1.8, y: 1.4 }, shutter: 'shutterG', pilEnd: 4,
    roof: { p: 1.0, son: 2, eave: 1.1, tile: 'Orange', border: 'Green', lotsF: { n: 1, drop: 1.0 }, lotsB: { n: 1, drop: 1.0 }, chofaH: 1.4 },
    src: '08 › officeW §2–§8: 12 × 18 m (mặt tiền đầu hồi 12 m), 2 tầng × 4,5 m, bệ 1,0 m, nóc ≈ 16 m; hồi 2 lớp nhô ra ngoài mặt tường; ngói cam viền xanh (ước theo màu chung — chưa có ảnh riêng)',
  }),
  inner1: {
    type: 'compound', roofDesc: 'mái hồi 2 son dốc 48°, mỗi đầu 3 lớp lùi (ชั้นลด 3 ชั้น); sảnh nối mái hồi thấp hơn; ngói xanh lá viền cam', name: 'Nội Cung Tây — Phra Thinang Phiman Rattaya', proto: 'Phiman Rattaya (Rama I, 1789) — điện ở: mái 3 lớp (ชั้นลด 3 ชั้น), hiên cột 3 phía, sảnh nối mukh krasan về điện chữ thập',
    parts: [
      hall({ at: [0, -6], W: 15, L: 27.5, v: 2.5, b: 2.5, ph: 1.6, wallH: 6, colD: 0.55, noStair: true, doors: { n: 1 }, win: { n: 7, frame: 'sum' },
        roof: { p: 1.1, son: 2, tile: 'Green', border: 'Orange', lotsF: { n: 2, drop: 1.2 }, lotsB: { n: 2, drop: 1.2 }, chofaH: 1.7 } }),
      hall({ at: [0, 13.75], W: 6, L: 12, ph: 1.6, wallH: 4.6, colD: 0.45, doors: { n: 1, w: 2.4 }, win: { n: 3, frame: 'sum', w: 1.0, h: 2.0, y: 1.2 },
        roof: { p: 1.0, son: 2, eave: 0.9, tile: 'Green', border: 'Orange', backFace: false, chofaH: 1.1, scale: 0.8 } }),
    ],
    src: '08 › inner1 §2–§8: thân mặt hồi 20 × sâu 30 m (tường 15 × 27,5 + hiên cột 2,5 m ba phía Đông, Tây, Nam), 1 tầng tường 6 m trên nền 1,6 m, mái 3 lớp (2 lot hạ mỗi đầu), + sảnh nối 6 × 12 m phía trước. Lệch: hồi chạm Phra Phrom cưỡi thiên nga vẽ chung mẫu trán hồi',
  },
  inner2: hall({
    roofDesc: '3 mái hồi song song (3 nóc, khe mái giữa), mỗi đầu 2 hồi lồng; dải hiên quanh hiên cột; ngói lam viền cam', name: 'Nội Cung Giữa — Phra Thinang Chakraphat Phiman', proto: 'Chakraphat Phiman — điện ở ba đời vua đầu: 3 nhà chữ nhật giống hệt nối liền, hàng cột bao 4 phía',
    W: 36, L: 17, v: 3, f: 2.5, b: 2.5, modules: 3, ph: 1.0, wallH: 6, colD: 0.55,
    doors: { n: 3, w: 2.4 }, win: { n: 5, frame: 'sum' },
    roof: { p: 1.1, son: 2, tile: 'Blue', border: 'Orange', lotsF: { n: 1, drop: 1.1 }, lotsB: { n: 1, drop: 1.1 }, chofaH: 1.5 },
    src: '08 › inner2 §2–§8: 42 × 22 m, 1 tầng trên bệ 1,0 m, 3 nhà 14 × 22 m, ba hồi song song quay mặt chính; ngói lam viền cam; hiên cột 4 phía. Chưa làm: hai cánh phụ ngói không men',
  }),
  inner3: hall({
    roofDesc: 'mái hồi 2 tầng (chính + dải hiên), mỗi đầu 2 hồi lồng; ngói xanh lá viền cam', name: 'Nội Cung Đông — Phra Buddha Rattanasathan', proto: 'Phra Buddha Rattanasathan (Rama IV) — điện thờ giữa vườn Siwalai: tường đá xám, mái 2 tầng xanh lá, hành lang cột bao quanh',
    W: 10, L: 17.5, v: 2, f: 2.5, b: 2, ph: 1.2, wallH: 6, colD: 0.5, wallKey: 'stoneGray', colKey: 'marble',
    doors: { n: 1, w: 2.4 }, win: { n: 5, frame: 'sum' },
    roof: { p: 1.1, son: 2, tile: 'Green', border: 'Orange', lotsF: { n: 1, drop: 1.1 }, lotsB: { n: 1, drop: 1.1 }, chofaH: 1.4 },
    src: '08 › inner3 §2–§8: 14 × 22 m (đầu hồi 14 m), 1 tầng tường đá xám ~6 m, bệ 1,2 m, mái 2 tầng xanh lá viền cam; hành lang cột mở bao quanh',
  }),
  library: {
    type: 'mondop', roofDesc: 'mái hiên vòng ngói xanh viền cam trên 20 cột + 4 mukh hồi nhỏ trên 4 cửa; mái chữ thập 4 hồi trên thân; chóp mondop 7 tầng Garuda đỡ', name: 'Phra Mondop (thư viện kinh)', proto: 'Phra Mondop, Wat Phra Kaew (Rama I, 1789) — giữ tủ kinh Tam Tạng: vuông 4 cửa mũ vương miện, 20 cột 12 góc, tường kính lục thiên thần vàng, chóp mondop 7 tầng',
    S: 4.75, ca: 6.5, perSide: 6, base: [{ m: 1.6, h: 1.4, key: 'marble' }, { m: 0.6, h: 1.1, key: 'marble' }], wallH: 7, colD: 0.55,
    roof: { p: 1.25, tile: 'Green', border: 'Orange', chofaH: 1.3 }, mukh: { hw: 2.0 }, spire: { tiers: 7, top: 30 },
    src: '08 › library §2–§8: 15 × 15 m, bệ cẩm thạch 2,5 m (nền ฐานไพที + bệ sen), thân 1 tầng 7 m, 20 cột (6 / cạnh), 4 cửa + 4 cầu thang Naga, chóp mondop 7 tầng, đỉnh 30 m (đề xuất 28–32, chưa có số đo). Chưa làm: 4 tượng Phật Java ở góc bệ, tượng dạ xoa / asura trên bệ',
  },
  summit: {
    type: 'prasat', roofDesc: 'mái chữ thập 4 cánh, mỗi đầu 2 hồi lồng, ngói cam viền xanh; chóp prasat 5 tầng Garuda đỡ', name: 'Vọng Sơn Đình', proto: 'Điện thu nhỏ trên đỉnh Khao Krailat (Rama IV) — prasat nhỏ chữ thập trên núi giả',
    armZ: 2.5, armX: 2.5, aw: 1.25, colH: 2.6, colD: 0.26, cluster: 2, base: [{ m: 0.8, h: 0.6 }],
    roof: { p: 1.2, son: 2, eave: 0.5, tile: 'Orange', border: 'Green', lots: { n: 1, len: 0.6, drop: 0.5 }, chofaH: 0.7, scale: 0.5 },
    spire: { tiers: 5, top: 9.5, sup: 'garuda' },
    src: '08 › summit §8: chữ thập 5 × 5 m (cánh 2,5 m), chóp 5 tầng (không được 7 — A7.6), đỉnh ≈ 9 m, bệ 0,6 m; đặt trên đỉnh Khao Mo. Chưa làm: tượng thú Himavanta quanh chân núi (thuộc giả sơn)',
  },
  sala1: sala({
    roofDesc: 'mái hồi 2 son (chính dốc 49° + dải hiên), mỗi đầu 2 hồi lồng; ngói cam viền xanh', name: 'Sala Siwalai — Phra Thinang Sitalaphirom', proto: 'Sitalaphirom (Rama VI) — đình gỗ mở nhỏ vườn Siwalai, cột sơn mài đen vẽ lửa vàng',
    W: 5.6, L: 6.4, ph: 0.4, wallH: 2.8, colD: 0.34, colKey: 'colLac', railKey: 'lacquer', stairW: 2.6,
    roof: { p: 1.15, son: 2, eave: 0.9, tile: 'Orange', border: 'Green', lotsF: { n: 1, drop: 0.7 }, lotsB: { n: 1, drop: 0.7 }, chofaH: 1.0, scale: 0.7 },
    src: '08 › sala1 §2–§8: mép mái 8 × 7 m (cột 5,6 × 6,4), cột 2,8 m, đỉnh ≈ 6,5 m, bệ 0,4 m; cột sơn mài đen + lai kranok vàng; hồi có chofa',
  }),
  sala3: sala({
    roofDesc: 'mái hồi 2 son (chính dốc 49° + dải hiên), mỗi đầu 2 hồi lồng; ngói xanh lá viền cam', name: 'Sala Ngoại Triều — Phra Thinang Dusidaphirom', proto: 'Dusidaphirom — đình mở ở sân trước nhóm Maha Monthien, khảm kính lam + sơn mài vàng',
    W: 5.4, L: 9, ph: 0.5, wallH: 3.2, colD: 0.4, colKey: 'colB',
    roof: { p: 1.15, son: 2, eave: 0.9, tile: 'Green', border: 'Orange', lotsF: { n: 1, drop: 0.8 }, lotsB: { n: 1, drop: 0.8 }, chofaH: 1.1, scale: 0.75 },
    src: '08 › sala3 §2–§8: mép mái 7,5 × 11 m (hồi 7,5 m quay ra lối đi), cột 3,2 m, đỉnh ≈ 8 m, bệ 0,5 m; cột kính lam viền vàng',
  }),
  sala4: sala({
    type: 'hallRot', roofDesc: 'mái hồi 2 son, hồi ở hai đầu cạnh ngắn (vào ở cạnh dài), mỗi đầu 2 hồi lồng; ngói cam viền xanh', name: 'Sala Cổng Chùa (sala rai)', proto: 'Sala rai quanh ubosot Wat Phra Kaew (12 sala) / đình nghỉ ngoài cổng Koei Sadet — đình mở vào ở cạnh dài',
    W: 3.6, L: 6.4, ph: 0.5, wallH: 3.0, colD: 0.34, rail: false, stairW: 2.6,
    roof: { p: 1.1, son: 2, eave: 0.8, tile: 'Orange', border: 'Green', lotsF: { n: 1, drop: 0.7 }, lotsB: { n: 1, drop: 0.7 }, chofaH: 0.9, scale: 0.7 },
    src: '08 › sala4 §8 (đề xuất, không có số đo): 8 × 5 m, cột 3 m, đỉnh ≈ 7 m, bệ 0,5 m; mái 2 tầng có chofa. Chưa làm: 2 tượng dạ xoa 5 m của cổng (đặt theo tổng mặt bằng)',
  }),
  sala5: sala({
    roofDesc: 'mái hồi dọc + cánh ngang 2 mukh (trimuk), mỗi đầu 2 hồi lồng; ngói xám sáng viền vàng', name: 'Sala Nội Cung — Phra Thinang Racharuedee', proto: 'Racharuedee — đình mở 3 mukh (trimuk) bằng cẩm thạch trắng và vàng, nơi làm lễ tắm xức dầu',
    W: 6.4, L: 11, ph: 0.7, wallH: 3.2, colD: 0.38, colKey: 'gold', plinth: { key: 'marble' }, cross: { hw: 2.2, len: 1.9, z: 0 },
    roof: { p: 1.1, son: 2, eave: 0.8, tile: 'Light', border: 'Gold', lotsF: { n: 1, drop: 0.8 }, lotsB: { n: 1, drop: 0.8 }, chofaH: 1.2, scale: 0.8 },
    src: '08 › sala5 §2–§8: 12 × 7,8 m (đầu hồi 7,8 m) + 2 mukh nhô ~2 m hai bên, cột 3,2 m vàng, đỉnh ≈ 8,5 m, bệ 0,7 m cẩm thạch; ngói xám sáng',
  }),
  aphorn: {
    type: 'prasat', roofDesc: 'mái chữ thập 4 mukh, mỗi đầu 3 hồi lồng, ngói xám nâu diềm vàng; chóp prasat 5 tầng thiên nga đỡ', name: 'Aphorn Phimok Prasat', proto: 'Phra Thinang Aphorn Phimok Prasat (Rama IV) — đình mở chữ thập trên bệ tường Đông nhóm Phra Maha Prasat, chóp 5 tầng đỡ bằng thiên nga',
    armZ: 4.7, armX: 3.0, aw: 2.125, colH: 4.4, colD: 0.3, colKey: 'colS', cluster: 3, base: [{ m: 2.6, h: 1.1 }, { m: 1.6, h: 0.9 }, { m: 0.7, h: 0.8 }],
    roof: { p: 1.25, son: 2, eave: 0.7, tile: 'Gray', border: 'Gold', edgeKey: 'edgeGold', lots: { n: 2, len: 0.7, drop: 0.65 }, chofaH: 1.0, scale: 0.65 },
    spire: { tiers: 5, top: 18.8, sup: 'hamsa', bk: 0.62 },
    src: '08 › aphorn §2–§8: sàn chữ thập 9,4 × 4,25 m + cánh ngang 6 × 4,25 m, cột 4,4 m vàng–bạc thành cụm 3 cột mỗi góc, bệ trắng 3 bậc 2,8 m, chóp 5 tầng thiên nga đỡ, đỉnh 16 m trên sàn; mái xám nâu diềm vàng, mỗi mukh 3 hồi lồng',
  },
  sala2: {
    type: 'prasat', roofDesc: 'mái chữ thập 4 mukh, mỗi đầu 3 hồi lồng, ngói xanh lá ô cam; chóp busabok 5 tầng Garuda đỡ', name: 'Sala Đảo Đông — Aisawan Thipphaya-at', proto: 'Phra Thinang Aisawan Thipphaya-at, Bang Pa-In — đình prasat chữ thập giữa hồ, sàn trắng trên trụ vòm, nối bờ bằng cầu',
    armX: 5.5, armZ: 3.5, aw: 2.2, colH: 3.8, colD: 0.34, cluster: 2, water: { h: 2.2, W: 18, D: 11, bridge: 7, bridgeW: 3 },
    roof: { p: 1.2, son: 2, eave: 0.8, tile: 'Green', border: 'Orange', lots: { n: 2, len: 0.8, drop: 0.7 }, chofaH: 1.1, scale: 0.7 },
    spire: { tiers: 5, top: 16.2, sup: 'garuda', style: 'mondop' },
    src: '08 › sala2 §2–§8: sàn nổi 18 × 11 m cao 2,2 m trên trụ vòm, đình chữ thập 11 × 7 m, đỉnh ≈ 14 m trên sàn, cầu nối bờ 7 m; mái xanh lá ô cam (khác mái xám Aphorn), chóp busabok 5 tầng. Mặt nước y = 0',
  },
};
