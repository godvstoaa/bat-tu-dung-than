// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ NHẬT BẢN (Himeji · Nijō Ninomaru · Katsura · Osaka · Hikone · Takamatsu · Edo).
//  Số lấy từ docs/tienphu-nghiencuu/02-nhatban.md (mục id tương ứng, §8 «đề xuất game»). Đơn vị m. Ken Kyō-ma 1,97 m.
//  [Ước] = ước lượng trong nghiên cứu (chưa có nguồn đo cao diềm / nóc).
// ============================================================================
const PAL = { ph: 1.0, kureEn: 1.0, bay: 2.45, gold: true, pattern: 'mmmsm' };

/** BẢN GHI ĐÈ LẦU 10 TẦNG (02 › tower §8: 3 tầng trong bệ đá + 7 tầng thân, thu theo cặp tầng; n = 4 vì engine chỉ nhận đa giác đều) */
export const JP_TOWER = { n: 4, a: [21.3, 19.7, 19.0, 18.6, 18.3, 15.2, 15.2, 12.9, 12.9, 10.0], podium: 3, podiumKind: 'ishigaki', gal: [], bd: 0 };

export const JP_SPECS = {
  tower: {
    type: 'tower', roofDesc: '5 重 ngói bản hun xám có sọc vữa mạch (Himeji): 4 mái hiên vòng 腰屋根 + irimoya đỉnh nóc Đ–T; kara-hafu (1 重 Đ, 2 重 N, 4 重 Đ/T, 5 重 N/B), irimoya-hafu lớn 2 重 Đ/T, irimoya đôi 3 重 N/B, chidori 4 重 N/B; shachi', name: 'Thiên Thủ Các (lầu 10 tầng)', proto: 'Đại thiên thủ Thành Himeji 姫路城大天守 (1601–1609, Bảo vật quốc gia) — vọng lâu hình, 5 重 6 階 + 1 hầm',
    src: '02 › tower §3–§8: 3 tầng chơi đầu trong bệ đá ishigaki (đế 3 m + đá 15 m, nghiêng cong 4,5 m [Ước 0,3 H]), thân 7 tầng thu theo cặp G6 = G7, G8 = G9; '
      + 'mái 1 重 kara-hafu Đông + hộc thả đá 3 góc · 2 重 irimoya-hafu lớn Đ/T + kara-hafu Nam, cửa sổ lồi 5 間 · 3 重 irimoya đôi N/B · 4 重 chidori N/B, kara Đ/T · 5 重 kara N/B, shachi; sọc vữa mạch ngói. '
      + 'Lệch: mặt bằng vuông (engine chỉ đa giác đều; thật chữ nhật 1,3 : 1, cạnh theo bề Đ–T × 1,14 để tầng đỉnh ≥ 20 m); Vọng Đài là lầu vọng mở có lan can 高欄 dưới mái 5 重 (game cần sàn đỉnh đi được) nên nóc ≈ 68 m, bệ / thân 0,36 (thật 0,47). Chưa làm: tiểu thiên thủ + hành lang lầu liên lập.',
  },
  main: {
    type: 'shoin', roofDesc: 'irimoya 入母屋 ngói bản xám một tầng mái (≈ 60 % cao), đầu hồi 狐格子 + 懸魚 mạ vàng, rui kép 二軒; khối sau mái chái thấp; hiên cổng 向唐破風 lợp vỏ bách', name: 'Đại Quảng Gian (Ōhiroma 大広間)', proto: 'Ōhiroma, Ninomaru Goten Thành Nijō 二条城二の丸御殿大広間 (1625–26, Bảo vật quốc gia)',
    ...PAL, colH: 5.6, over: 2.6, slopes: [[2.6, 0.38], 0.52, 0.64, 0.76, 0.84], ridgeH: 1.3, dGk: 0.4, bbox: [27, 25],
    blocks: [
      { W: 27, D: 21, cz: 2, entrance: 'S', porch: true },
      { W: 18, D: 4, cx: -4.5, cz: -10.5, ends: ['hip', 'hip'], open: 'S', colH: 4.6, over: 2.2, slopes: [[2.2, 0.38], 0.5], ridgeH: 0.7, interior: false },
    ],
    porch: { w: 5.4, d: 4.2, z0: 12.5, h: 4.1, hk: 1.7 },
    src: '02 › main §2, §5, §8: bao 29 × 27 m (tim cột 27 × 25 + hiên 1 m); sàn gỗ +1,0 trên cột ngắn + đá kê (không bệ đá); diềm ≈ +6 [Ước], nóc ≈ +15,5 [Ước], mái ≈ 60 % cao; '
      + 'irimoya ngói một tầng mái, đầu hồi 狐格子 + 懸魚 mạ vàng; mặt gãy bậc (khối sau lệch trái 18 × 4 m thay cho 8/7 nhịp). Thêm: hiên cổng 向唐破風 lợp vỏ bách mượn từ Kurumayose Nijō. Chưa làm: nối hành lang nhạn bay (do tổng mặt bằng).',
  },
  shikidai: {
    type: 'shoin', roofDesc: 'irimoya ngói bản xám, khối trước nóc N–B có đầu hồi quay ra cổng, nối vào mái khối sau', name: 'Thức Đài (Shikidai 式台)', proto: 'Shikidai, Ninomaru Goten Nijō (1625–26) — khâu nối chuỗi nhạn bay',
    ...PAL, colH: 4.6, over: 2.2, slopes: [[2.2, 0.4], 0.62, 0.78, 0.92], ridgeH: 1.0, bbox: [16, 16.5],
    blocks: [
      { W: 16, D: 9.5, cz: -3.5 },
      { W: 7.0, D: 9.0, cz: 4.75, ry: -Math.PI / 2, ends: ['open', 'irimoya'], open: 'W', entrance: 'E', openExt: 2.6 },
    ],
    src: '02 › shikidai §2, §8: bao 18 × 18,5 m, mặt trước 3 nhịp / mặt sau 5 nhịp → khối sau 16 × 9,5 + khối trước hẹp 9 × 7 có đầu hồi irimoya quay ra cổng; nóc ≈ +11 [Ước] (thấp hơn Ōhiroma ~25 %). Lệch: khối trước đặt giữa (thật lệch trái) để lối vào ở giữa nhà.',
  },
  kuroshoin: {
    type: 'shoin', roofDesc: 'irimoya ngói bản xám, đầu hồi 狐格子 + 懸魚 vàng; khối sau mái chái thấp', name: 'Hắc Thư Viện (Kuroshoin 黒書院)', proto: 'Kuroshoin (Tiểu Quảng Gian), Ninomaru Goten Nijō (1625–26)',
    ...PAL, colH: 5.2, over: 2.5, slopes: [[2.5, 0.4], 0.55, 0.68, 0.8, 0.86], ridgeH: 1.1, bbox: [23, 21],
    blocks: [
      { W: 23, D: 17, cz: 2, entrance: 'S' },
      { W: 14, D: 4, cx: 4.5, cz: -8.5, ends: ['hip', 'hip'], open: 'S', colH: 4.4, over: 2.1, slopes: [[2.1, 0.38], 0.5], ridgeH: 0.65, interior: false },
    ],
    src: '02 › kuroshoin §2, §5, §8: bao 25 × 23 m, cùng ngôn ngữ Ōhiroma nhỏ hơn ~27 %, gãy bậc 7/8 × 6/8 nhịp (khối sau lệch phải), nóc ≈ +13,5 [Ước]; ngoại thất KHÔNG sơn đen.',
  },
  shiroshoin: {
    type: 'shoin', roofDesc: 'irimoya ngói bản xám một khối gọn, đầu hồi 狐格子 + 懸魚', name: 'Bạch Thư Viện (Shiroshoin 白書院)', proto: 'Shiroshoin (Ngự Tọa Chi Gian), Ninomaru Goten Nijō — 6 × 6 nhịp',
    ...PAL, gold: false, colH: 4.2, over: 2.4, slopes: [[2.4, 0.38], 0.5, 0.6, 0.7], ridgeH: 0.9, bbox: [15, 16.5],
    blocks: [{ W: 15, D: 16.5, entrance: 'S' }],
    src: '02 › shiroshoin §2, §8: bao 17 × 18,5 m, khối vuông một irimoya gọn, nóc ≈ +11 [Ước]; bớt phụ kiện vàng (tranh thủy mặc); KHÔNG sơn trắng toàn bộ.',
  },
  kesho: {
    type: 'kesho', roofDesc: 'ngói bản: phần 2 tầng mái hiên vòng + irimoya có shachi, phần 1 tầng irimoya, hành lang lầu irimoya thấp', name: 'Hóa Trang Lâu (Keshō-yagura 化粧櫓)', proto: 'Keshō-yagura, Tây Hoàn Thành Himeji + đầu hành lang lầu Bách Gian Lang Hạ 百間廊下',
    ph: 1.2, d: 6.5, w1: 7.0, w2: 8.4, corrL: 25, corrD: 4.0,
    src: '02 › kesho §2, §8: Keshō-yagura 7 間 8 分 × 3 間 3 分 ≈ 15,4 × 6,5 m (phần 1 tầng 7 m + phần 2 tầng 8,4 m), nối hành lang lầu rộng 4 m dài 25 m (giữ khối 40 m); ngoài là yagura trắng, cửa sổ rộng và nhiều hơn lầu chiến đấu; nóc phần 2 tầng ≈ +10, phần 1 tầng ≈ +6,5 trên bệ [Ước]. Cửa vào ở hành lang (giữa khối).',
  },
  kura: {
    type: 'kura', roofDesc: 'irimoya ngói bản một tầng mái, đầu hồi trát trắng; mái hiên nhỏ trên cửa và cửa sổ', name: 'Kho Gạo (Kura 米蔵)', proto: 'Thổ tàng (Mễ tàng) Bắc, Thành Nijō 二条城北土蔵 — 17 × 3 間',
    W: 33.5, D: 6.0, ph: 0.6, h: 3.9, doorW: 2.4,
    src: '02 › kura §2, §5, §8: 33,5 × 6 m (tỉ lệ 5,6 : 1), một tầng mái irimoya, chân đá thấp, tường trát trắng dày gần như kín, 4 cửa sổ có cánh trát 土扉, cửa khung bậc 段々 cánh trát; diềm ≈ +4,5, nóc ≈ +8 [Ước]. Lệch: 1 cửa 2,4 m giữa nhà (thật 2 cửa theo 2 gian). Chưa làm: mái tách 置屋根.',
  },
  umaya: {
    type: 'umaya', roofDesc: 'irimoya ván mỏng 杮葺 (nâu xám) hai cánh gặp góc chữ L; lầu giếng kirizuma ván', name: 'Chuồng Ngựa (Umaya 馬屋)', proto: 'Mã ốc Thành Hikone 彦根城馬屋 (~1688–1703) — chuồng ngựa thành duy nhất còn lại',
    armA: 25.2, armB: 31.1, depth: 5.9, wallH: 3.0,
    src: '02 › umaya §2, §5, §8: chữ L — cánh Đông–Tây 25,2 × 5,9 + cánh Nam–Bắc 31,1 × 5,9 (hộp 25,2 × 37), mái ván 杮葺 irimoya, tường trên trắng / dưới ván đen 簓子下見板, nhịp ngăn ngựa ~2,7 m mở ra sân, phòng chiếu quản lý đầu Đông, cổng gần đầu Tây, lầu giếng; diềm ≈ +3,2, nóc ≈ +6,7 [Ước].',
  },
  masuW: {
    type: 'koraimon', roofDesc: 'kirizuma 切妻 ngói hẹp trên trụ chính + 2 mái kirizuma phụ trên trụ chống (mặt trên «コ»); tường đất mái ngói', name: 'Masugata Tây — cổng ngoài Kōraimon 高麗門', proto: 'Kōraimon của Ngoại Anh Điền Môn Thành Edo 旧江戸城外桜田門 (~1663) · đối chiếu Đại Thủ Môn Osaka',
    open: 5.5, back: 3.4, postH: 6.4, leafH: 4.6, wing: 3.0,
    src: '02 › masuW §2–§8: 2 trụ chính bọc sắt + 2 trụ chống, mái kirizuma chính hẹp trên trụ chính + 2 mái phụ thấp (mặt trên chữ «コ»), kiểu mới có ô tường trên dầm 冠木, lối mở 5,5 m, cánh sắt đen đinh tán, cao ≈ 8 m; tường đất trát trắng có lỗ bắn ôm hai bên (đoạn 3 m mỗi bên). Đổi vai trò theo nghiên cứu: masuW = cổng ngoài, đặt vuông góc với masuE quanh sân ≈ 20 × 24 m (tổng mặt bằng).',
  },
  masuE: {
    type: 'yaguramon', roofDesc: 'irimoya ngói bản + shachi; mái hiên ngăn giữa tầng cổng và tầng lầu; mái nhỏ trên hộp cửa lồi', name: 'Masugata Đông — cổng lầu Yaguramon 櫓門', proto: 'Hishi-no-mon Thành Himeji 姫路城菱の門 (10 × 4 間) · Đa Văn Lầu Osaka (kích thước)',
    W: 19.7, D: 7.9, gap: 6.0, stoneH: 4.6, upperH: 3.9,
    src: '02 › masuE §2–§8: 19,7 × 7,9 m, cao ≈ 12 m, lầu bắc qua hai khối đá cao 4,6 m chừa lối 6 m; tường lộ cột 真壁, mặt Nam / Bắc: hộp cửa lồi 出格子 có mái nhỏ chứa 3 cửa song sơn mài đen phụ kiện vàng, kẹp giữa 2 cửa sổ hình chuông 火灯窓; hoa lăng 花菱 trên dầm cổng; mái hiên ngăn giữa tầng cổng và tầng lầu; irimoya + shachi.',
  },
  chashitsu: {
    type: 'chashitsu', roofDesc: 'irimoya tranh 茅葺 dày dốc + mái ván 杮葺 hiên đất + trà thất mái ván irimoya + phòng sau mái ngói một dốc', name: 'Trà Thất Kōraku', proto: 'Shōkintei 松琴亭, Katsura Rikyū (đầu TK 17) — sukiya-zukuri',
    s: 1.3, W: 9.6, D: 6.2, doma: 2.3, ph: 0.45, colH: 2.7, over: 1.0, tea: [4.2, 4.0], back: 2.0,
    src: '02 › chashitsu §2–§8: khung 10 × 6 m phóng đều ×1,3 (để người chơi đi lại) + hiên đất 土庇 sâu 2,3 m mặt trước; mái tranh irimoya dày dốc, mái ván hiên đất + trà thất 三畳台目 mái ván riêng phía Đông (cửa chui 躙口, cửa sổ tre) + phòng sau mái ngói một dốc, máng tre → khối không đối xứng; tường đất 聚楽, cột còn vỏ, giấy ô vuông xanh trắng 市松, lò đá; sàn +0,45, diềm tranh ≈ +2,8, nóc ≈ +8 [Ước ×1,3].',
  },
  summit: {
    type: 'chaya', roofDesc: 'kirizuma tranh 茅葺, hồi đất, nóc thanh tre', name: 'Vọng Sơn Đình', proto: 'Shōkatei 賞花亭, Katsura Rikyū — quán trà đèo trên đỉnh đảo núi (2 × 1,5 間)',
    W: 5.5, D: 4.2, colH: 2.75, over: 0.8,
    src: '02 › summit §2–§8: 3,9 × 3,0 m phóng ×1,4 → 5,5 × 4,2 m (đứng được 3–4 người); mái tranh kirizuma, mặt Bắc (trước) và phần lớn mặt Tây mở, cột còn vỏ, chiếu hình «コ» quanh nền đất có lò, tường đất Đông (cửa sổ tre tròn lớn) và Nam (song tre, biển gỗ), bồn rửa tay đá + đá bước phía trước; nóc ≈ +6 [Ước ×1,4].',
  },
  yaguraSW: {
    type: 'yagura', roofDesc: '2 tầng mái ngói bản: mái hiên vòng có kara-hafu Tây + irimoya', name: 'Lầu Góc Tây Nam', proto: 'Tây Nam Ngung Lầu Thành Nijō 二条城西南隅櫓 (~1625–26)',
    base: { h: 2.4, B: 0.8 }, tiers: [{ hx: 3.75, hz: 3.75, h: 4.2, over: 1.3, root: 0.5, slopes: [[1.3, 0.42], 0.52] }, { hx: 3.0, hz: 3.0, h: 3.3 }],
    top: { over: 1.25, ridge: 'x', ridgeH: 0.6, ridgeEnd: 'oni' }, win: { 0: { S: 2, N: 2, E: 2, W: 2 }, 1: { S: 2, N: 2, E: 2, W: 2 } },
    hafu: [{ tier: 0, face: 'W', kind: 'kara', w: 3.8, hk: 0.85 }], bays: [{ tier: 0, face: 'W', u: 0, w: 2.2, roof: null }, { tier: 0, face: 'S', u: 1.5, w: 2.0 }], crest: true,
    src: '02 › yaguraSW §2–§8: 7,5 × 7,5 m (4 間, ±0,4), 2 tầng mái / 2 sàn, kara-hafu 向唐破風 mặt Tây trên mái tầng 1 (khác lầu Đông Nam), cửa sổ lồi có hộc thả đá mặt Tây và Nam, huy hiệu hoa quỳ; diềm 1 ≈ +4,5, diềm 2 ≈ +8,5, nóc ≈ +11 [Ước] — cộng bệ đá góc 2,4 m.',
  },
  yaguraSE: {
    type: 'yagura', roofDesc: '2 tầng mái ngói bản: mái hiên vòng có chidori-hafu Nam + irimoya', name: 'Lầu Góc Đông Nam', proto: 'Đông Nam Ngung Lầu Thành Nijō 二条城東南隅櫓 (1626) — 5 間 vuông, cao 12,6 m',
    base: { h: 2.4, B: 0.8 }, tiers: [{ hx: 4.95, hz: 4.95, h: 4.6, over: 1.4, root: 0.5, slopes: [[1.4, 0.42], 0.52] }, { hx: 3.95, hz: 3.95, h: 3.6 }],
    top: { over: 1.3, ridge: 'x', ridgeH: 0.65, ridgeEnd: 'oni' }, win: { 0: { S: 2, N: 3, E: 6, W: 3 }, 1: { S: 3, N: 1, E: 3, W: 2 } },
    hafu: [{ tier: 0, face: 'S', kind: 'chidori', w: 4.4, h: 2.1 }], bays: [{ tier: 0, face: 'S', u: -2.8, w: 2.0 }, { tier: 0, face: 'E', u: 2.8, w: 2.0 }],
    src: '02 › yaguraSE §2–§8: 9,9 × 9,9 m (5 間), 2 tầng mái, chidori-hafu tam giác mặt Nam trên mái tầng 1 (cặp đối lập với kara-hafu lầu Tây Nam), hộc thả đá trong cửa sổ lồi mặt Nam và Đông, hàng 6 cửa sổ tầng 1 (mặt Đông), tầng 2 phía trong 1 cửa; nóc 12,6 m trên bệ góc.',
  },
  yaguraNE: {
    type: 'yagura', roofDesc: '3 tầng mái ngói bản thu đều: chidori-hafu lớn xuyên 2 mái (Đông), kara-hafu tầng 2 (Nam), irimoya đỉnh', name: 'Lầu Góc Đông Bắc', proto: 'Cấn Lầu Thành Takamatsu 高松城旧東之丸艮櫓 (1677) — 3 tầng mái kiểu tầng tháp',
    base: { h: 2.4, B: 0.8 }, tiers: [{ hx: 4.5, hz: 4.5, h: 3.8, over: 1.3, root: 0.5, slopes: [[1.3, 0.42], 0.52] }, { hx: 3.85, hz: 3.85, h: 3.1, over: 1.2, root: 0.5, slopes: [[1.2, 0.42], 0.52] }, { hx: 2.8, hz: 2.8, h: 2.7 }],
    top: { over: 1.15, ridge: 'x', ridgeH: 0.6, ridgeEnd: 'oni' }, win: { 0: { S: 2, N: 2, E: 2, W: 2 }, 1: { S: 2, N: 2, E: 1, W: 2 }, 2: { S: 1, N: 1, E: 1, W: 1 } },
    hafu: [{ tier: 0, face: 'E', kind: 'chidoriBig', w: 5.0 }, { tier: 1, face: 'S', kind: 'kara', w: 3.2, hk: 0.7 }],
    bays: [{ tier: 0, face: 'N', kind: 'hakama', corner: [1, -1], w: 1.5 }, { tier: 0, face: 'E', kind: 'hakama', corner: [1, -1], w: 1.5 }],
    src: '02 › yaguraNE §2–§8: tầng 9 / 7,7 / 5,6 m (thu theo tỉ lệ Fujimi 1 : 0,85 : 0,62), 3 tầng mái, chidori-hafu lớn xuyên hai lớp mái ở tầng 1 (mặt Đông), kara-hafu tầng 2 (mặt Nam), hộc thả đá kiểu váy hakama ở góc ngoài (ĐB); cao ≈ 11,5 m [Blog] + bệ 2,4 m.',
  },
  yaguraNW: {
    type: 'yaguraL', roofDesc: 'irimoya ngói bản gãy góc chữ L (chái ở góc) + mái hiên ngăn giữa hai tầng; hộc chìa đầu hồi kirizuma', name: 'Lầu Góc Tây Bắc', proto: 'Càn Lầu Tây Hoàn Thành Osaka 大坂城乾櫓 (1620, Kobori Enshū) — chữ L, 総二階',
    arm: 13, depth: 7, h: [4.2, 4.3], base: { h: 2.4, B: 0.8 },
    src: '02 › yaguraNW §2–§8: chữ L mỗi cánh 13 × 7 m (186 m² / tầng), hai tầng bằng nhau (khối đứng, chỉ một mái hiên ngăn), mái irimoya gãy góc (chái ở góc, đầu hồi hai đầu), hộc thả đá chìa có đầu hồi kirizuma giữa mặt Tây và Bắc; diềm 1 ≈ +4,5, diềm 2 ≈ +9, nóc ≈ +12 [Ước] + bệ 2,4 m.',
  },
  azumaya: {
    type: 'azumaya', roofDesc: 'hōgyō 宝形 tranh chóp bốn mặt, nắp ngói + bảo châu', name: 'Đình Nghỉ Vườn', proto: 'Manji-tei 卍亭 (四ツ腰掛), Katsura Rikyū — 2,83 m vuông',
    a: 2.125, colH: 2.5, over: 0.95,
    src: '02 › azumaya §2–§8: 2,83 m vuông phóng ×1,5 → 4,25 m; mái tranh chóp bốn mặt 宝形 có nắp ngói + bảo châu, 4 ghế ván xếp xoay chữ 卍 (người ngồi không nhìn thẳng mặt nhau), mở bốn phía; diềm ≈ 2,5, đỉnh ≈ 5,5 m [Ước].',
  },
  machiai: {
    type: 'koshikake', roofDesc: 'yosemune 寄棟 tranh dài thấp', name: 'Đình Chờ Trà', proto: 'Soto-koshikake 外腰掛, Katsura Rikyū — 3 × 1 間, tranh yosemune',
    W: 5.9, D: 2.0, colH: 2.1, over: 0.8,
    src: '02 › machiai §2–§8: 5,9 × 2,0 m + hiên 0,8 m (bao mái 7,5 × 3,6), mái tranh 寄棟 dài thấp, cột sồi kunugi còn vỏ cong, ghế ván dài dọc tường đất sau, đá lát + hàng đá bước phía trước; diềm ≈ 2,0, nóc ≈ 3,8 m [Ước].',
  },
};
