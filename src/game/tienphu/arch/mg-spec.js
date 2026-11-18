// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ MUGHAL (quần thể Taj Mahal). Số lấy từ docs/tienphu-nghiencuu/09-mughal.md (mục id tương ứng).
//  MỘT hệ số cho cả khu: S = 1,06 × số đo thật (giữ tỉ lệ giữa các công trình như nguyên mẫu — nghiên cứu §8 «áp cùng s cho cả khu»).
//  Vì sao 1,06 chứ không 0,74: lầu 10 tầng của game có FH = 5 m cố định, tầng 0 bắt đầu ở mặt thềm, mỗi tầng apothem ≥ 10,87 m
//  (test 2·a·0,92 ≥ 20). Ở s = 0,74 đỉnh finial chỉ 50,3 m trên mặt bệ và bầu vòm Ø 20,4 m — không chứa nổi 10 tầng + Vọng Đài.
//  Ở s = 1,06: mặt bệ = sàn tầng 1, sân mái (23,6 × S = 25,0 m trên mặt bệ) = đúng sàn tầng 6, bầu vòm Ø 29,2 m chứa tầng 8–9 + Vọng Đài
//  trong khoảng rỗng giữa hai lớp vòm (đúng ý nghiên cứu §8 «khoảng rỗng thật ≈ 30 m»).
// ============================================================================
import { S } from './mg-kit.js';
const r = (v) => +v.toFixed(2);

/** bản ghi đè lầu (báo lại để áp vào styles.js › mughal.tower) */
export const MG_TOWER = {
  n: 8, podium: 1.5, gal: [1, 6], setback: true,
  // tầng 0 trong bệ cẩm thạch (bệ 95,5 × S = 101,2 m → apothem 50,3) · tầng 1–5 trong thân (iwan sâu 6,9 × S chừa tới apothem 22,5)
  // · tầng 6–9 trong trống / bầu vòm (Ø trong trống 23,8 m → apothem 11)
  a: [50.3, 22.5, 22.5, 22.5, 22.5, 22.5, 11, 11, 11, 11],
};

export const MG_SPECS = {
  tower: {
    roofDesc: 'Vòm bầu (amrud) cẩm thạch đôi vỏ trên trống cao 12,7 m, sen úp + finial mạ vàng trăng lưỡi liềm; sân mái có lan can, 4 chhatri bát giác góc',
    type: 'tower', name: 'Lăng Vọng Tinh (lầu 10 tầng)', proto: 'Rauza-i Munawwara — lăng Taj Mahal, Agra 1632–1648: bệ cẩm thạch, thân vuông vát góc hasht bihisht, 4 pishtaq, trống cao, vòm bầu đôi vỏ, 4 chhatri, 4 minaret',
    src: `09 › main-tower §2 (Koch: thân 56,9 m = 70 gaz, cao 67,97 m; bệ 95,5 × 6 m; minaret 43,02 × 5,65; trống 12 m Ø ngoài 24,5; bầu 23 m Ø 27,5; finial 9,6; pishtaq 22,7 × 27, iwan 13,85 × 20,6 sâu 6,9, gờ 9,2) × S = 1,06. `
      + 'Thân 60,3 m, bệ 101,2 m (cao 5 m trên thềm 1,5 m), mái ở +25 m trên mặt bệ, đỉnh finial ≈ 78 m. Tầng: 0 trong bệ (như hầm mộ thật), 1 = mặt bệ, 6 = sân mái, 7–9 + Vọng Đài trong trống / bầu. '
      + 'Lệch: bệ cao 5 m (thật 6,4 m ở S) do FH; trống có 2 cửa (tầng 6 có hành lang) và 8 ô vòm mù thành jali (nghiên cứu §8 cho phép); minaret đứng thẳng (chưa nghiêng). Chưa làm: hành lang cột sau lưng pishtaq (Koch), vòm trong, chữ thư pháp thật',
  },
  main: {
    roofDesc: 'Mái bằng có lan can ô panel; trên pishtaq dãy 11 vòm cuốn + chhajja + 11 chhatri trắng mỗi mặt; 4 tháp góc bát giác đội chhatri',
    type: 'gate', name: 'Đại Môn (Darwaza-i Rauza)', proto: 'Darwaza-i Rauza — Đại Môn Taj Mahal (1648): khối sa thạch đỏ 2 tầng iwan, pishtaq khung trắng, 11 chhatri mỗi mặt, 4 tháp góc bát giác',
    W: r(41.2 * S), D: r(34 * S), plinth: r(1.1 * S), ta: 3.4, eave: r(17.5 * S), frameTop: r(20.3 * S), arcadeTop: r(23.07 * S), guldTop: r(33 * S),
    wP: r(17.5 * S), ow: r(12.7 * S), apex: r(16.0 * S), iwanD: r(6.35 * S), ledge: r(7.6 * S), chRow: r(15 * S), turretChh: r(5.8 * S / 2), hall: 6.0,
    src: '09 › main §2, §8: Koch 41,2 × 34 × 23,07 m (đỉnh dãy vòm dưới hàng chhatri); diềm cánh 17,5; chhatri tới 30; guldasta 33; khung pishtaq ≈ 17,5; lỗ vòm 12,7 (cao/rộng 1,26); hàng 11 chhatri dài 15 m vòm Ø 1,35; chhatri tháp góc ngang 5,8 — tất cả × 1,06. '
      + 'Suy ra: đỉnh khung 20,3 (23,07 − dãy vòm ≈ 2,8), sâu iwan = ½ lỗ vòm (như lăng), sảnh bát giác apothem 6. Chưa làm: hành lang cột dọc tường vườn (Koch hình 13), cửa đồng gốc',
  },
  mosque: {
    roofDesc: 'Mái bằng lan can jali; 3 vòm bầu cẩm thạch trắng (giữa Ø 15,9 m) trên trống thấp khóa xen trắng-đỏ; 4 tháp góc đội chhatri',
    type: 'masjid', name: 'Thánh Đường (Masjid)', proto: 'Masjid của Taj Mahal (phía tây lăng): khối sa thạch đỏ, pishtaq giữa, 3 vòm bầu cẩm thạch trắng trên trống khóa xen trắng-đỏ, 4 tháp góc đội chhatri',
    mihrab: true, W: r(56.6 * S), D: r(23.38 * S), plinth: 1.0, ta: 1.6, eave: r(20.3 * S), pTop: r(23.5 * S), wP: r(18 * S), ow: 11.6, apex: 17.5, iwanD: 5.8, ledge: 8.0, guldTop: 30.0,
    dC: { R: r(15 * S / 2), H: 11.0, fin: 2.3 }, dS: { R: r(11 * S / 2), H: 7.6, fin: 2.2 }, dSx: 18.8, domeZ: -3.0, turretChh: 2.0,
    src: '09 › mosque §2, §8: Koch 56,6 × 23,38, diềm 20,3 (25 gaz), đỉnh pishtaq 23,5 (29 gaz); khung pishtaq ≈ 18; vòm giữa Ø 15, hai bên Ø 11; finial vòm giữa ≈ 34 — × 1,06. '
      + 'Mặt tiền: pishtaq + mỗi bên 2 gian (vòm dưới + hốc trên), 4 guldasta chia gian (§3). Suy ra theo tỉ lệ lăng: lỗ vòm 0,61 khung, sâu iwan ½ lỗ. Sàn kẻ ô thảm (vạch đen). Chưa làm: thư pháp Sura 91, minbar',
  },
  jawab: {
    roofDesc: 'Như Masjid: mái bằng, 3 vòm bầu trắng trên trống thấp, 4 tháp góc đội chhatri',
    type: 'masjid', name: 'Jawab (Mihman Khana)', proto: 'Mihman Khana / Jawab — bản soi gương Masjid phía đông lăng (qarina): ngoại thất giống hệt, không mihrab, sàn lát hình học',
    mihrab: false, W: r(56.6 * S), D: r(23.38 * S), plinth: 1.0, ta: 1.6, eave: r(20.3 * S), pTop: r(23.5 * S), wP: r(18 * S), ow: 11.6, apex: 17.5, iwanD: 5.8, ledge: 8.0, guldTop: 30.0,
    dC: { R: r(15 * S / 2), H: 11.0, fin: 2.3 }, dS: { R: r(11 * S / 2), H: 7.6, fin: 2.2 }, dSx: 18.8, domeZ: -3.0, turretChh: 2.0,
    src: '09 › jawab §2–§8: như Masjid (OSM 55,4 × 23,0, vòm 13,9 / 17,9 / 13,9) × 1,06; khác: không hốc mihrab, sàn lát hình học',
  },
  khawasW: {
    roofDesc: 'Mái bằng lan can, chhajja liên tục trên consol quanh sân; không vòm',
    type: 'court', name: 'Khawasspura Tây', proto: 'Khawasspura — khu ở người hầu lăng: sân chữ nhật bao 4 dãy phòng (hujra) sau hiên vòm nhiều múi trên cột Shahjahani, chhajja liên tục, mái bằng, toàn đỏ không vòm',
    W: r(68 * S), D: r(62 * S), wing: r((68 - 46) / 2 * S), veranda: 3.4, plinth: 0.6, colH: 3.6, wallH: 6.6, bx: 13, bz: 11,
    portal: { w: 9.0, top: 10.5, ow: 4.4, apex: 7.4, d: 2.4 },
    src: '09 › khawasW §2, §8: khối bao ≈ 62 (B–N) × 68 (Đ–T), sân ≈ 40 × 46 (sơ đồ Commons ±3 m) × 1,06; 1 tầng (suy ra «hujra sau hiên»); nhịp hiên ≈ 3,75–3,85 m (3 gaz × 1,5 × 1,06, suy ra). '
      + 'Cao 1 tầng ≈ 7,2 m (suy ra, chưa có nguồn). Sân trong làm charbagh nhỏ (đề xuất). Lối vào: cổng giữa tường bắc (giáp vườn) = mặt +z',
  },
  khawasE: {
    roofDesc: 'Mái bằng lan can, chhajja liên tục trên consol quanh sân; không vòm',
    type: 'court', name: 'Khawasspura Đông', proto: 'Khawasspura phía đông — soi gương bản tây (Lord Curzon tu sửa 1900–1908)',
    W: r(68 * S), D: r(62 * S), wing: r((68 - 46) / 2 * S), veranda: 3.4, plinth: 0.6, colH: 3.6, wallH: 6.6, bx: 13, bz: 11,
    portal: { w: 9.0, top: 10.5, ow: 4.4, apex: 7.4, d: 2.4 },
    src: '09 › khawasE: như khawasW (đối xứng qua trục; OSM chiều B–N 69 m khớp) × 1,06',
  },
  naubatW: {
    roofDesc: 'Hai lớp chhajja trên consol, mái bằng lan can; chhatri cẩm thạch 8 trụ ở tâm mái',
    type: 'naubat', name: 'Naubat Khana Tây', proto: 'Naubat Khana (nhà trống nhạc) phía tây Taj: khối sa thạch 2 tầng, 3 vòm jali dưới, loggia 3 vòm trên, 2 lớp chhajja, chhatri cẩm thạch 8 cột trên mái, liền tường vườn có kangura',
    W: r(22.1 * S), D: r(13.5 * S), plinth: r(2 * S), h1: r(4.9 * S), h2: r(5.2 * S), aw: 2.8, stub: 4.5, stubH: 7.0, chh: { a: r(7.2 * S / 2), ph: 2.0, R: r(4.6 * S / 2), H: 2.5 },
    src: '09 › naubatW §2, §8: OSM 22,1 × 13,5; nền ≈ 2; tầng dưới 4,9; tầng trên 5,2; chhatri ngang 7,2, vòm Ø 4,6, cao 6,7; tổng ≈ 19 m — × 1,06. Lệch: vòm giữa tầng dưới mở làm cửa (nghiên cứu: bịt jali)',
  },
  naubatE: {
    roofDesc: 'Hai lớp chhajja trên consol, mái bằng lan can; chhatri cẩm thạch 8 trụ ở tâm mái',
    type: 'naubat', name: 'Naubat Khana Đông', proto: 'Naubat Khana phía đông — soi gương bản tây (ảnh đo của nghiên cứu là bản đông)',
    W: r(22.1 * S), D: r(13.5 * S), plinth: r(2 * S), h1: r(4.9 * S), h2: r(5.2 * S), aw: 2.8, stub: 4.5, stubH: 7.0, chh: { a: r(7.2 * S / 2), ph: 2.0, R: r(4.6 * S / 2), H: 2.5 },
    src: '09 › naubatE: như naubatW (chọn số bản tây vì hai nhà đối xứng) × 1,06',
  },
  tombW: {
    roofDesc: 'Mái bằng lan can, trống thấp + 1 vòm bầu sa thạch đỏ, sen + finial; 8 guldasta góc',
    type: 'octTomb', name: 'Lăng Phụ Tây (Saheli Burj)', proto: 'Saheli Burj — lăng Fatehpuri Begum (thập niên 1650): thân bát giác sa thạch đỏ, mỗi mặt một vòm trong khung, 8 guldasta, trống thấp + 1 vòm bầu, bệ có tầng vòm cuốn cửa jali',
    plinthA: 12.6, plinth: r(4.5 * S), bodyA: r(18.8 * S / 2), bodyH: r(7 * S), dome: { rd: 5.9, hd: 0.7, R: r(12 * S / 2), H: r(6.8 * S), fin: 3.8 },
    src: '09 › tombW §2, §8: OSM thân ngang 18,8, cạnh 7,7; thân ≈ 7; trống ≈ 1,5; bầu Ø 12 cao 6,8; sen + finial 3,9; bệ 4–5 m; 24 vòm (= 3 vòm × 8 mặt bệ) — × 1,06. '
      + 'Vòm sa thạch đỏ theo ảnh (Wikipedia ghi trắng). Suy ra: bệ rộng hơn thân 2,6 m mỗi phía, bậc trước. Chưa làm: vườn charbagh nhỏ quanh lăng (chưa có số đo)',
  },
  summit: {
    roofDesc: 'Sân đỉnh lan can; chhatri bát giác 8 trụ, chhajja rộng, vòm bầu đỏ + finial',
    type: 'burj', name: 'Vọng Sơn Đình', proto: 'Tháp góc đông nam Mehtab Bagh («Vườn Ánh Trăng», đối diện Taj): tháp bát giác sa thạch đỏ, tầng hốc vòm, chhatri 8 trụ chhajja to, vòm đỏ',
    a: r(13.5 * S / 2), hb: r(3.4 * S), ht: r(7.3 * S), chh: { a: r(12 * S / 2), ph: 4.6, base: 0.6, R: r(8 * S / 2), H: 4.6 }, domeKey: 'domeR',
    src: '09 › summit §2: OSM Ø 13,5; thân 3,4 + 7,3; chhatri ngang 12 (±20 %), vòm Ø 8, cao 13; tổng ≈ 24 — × 1,06 (đặt trên đỉnh giả sơn)',
  },
  chhatriSW: { type: 'chhatri', roofDesc: 'Chhatri bát giác 8 trụ đôi, vòm nhiều múi, chhajja trên consol, vòm bầu cẩm thạch trắng + sen + finial', name: 'Chhatri Tây Nam', proto: 'Chhatri mái lăng Taj (bản «tường vườn»: thân đỏ, vòm trắng) — bát giác 8 trụ đôi, chhajja trên consol, vòm bầu + sen + finial', white: false, a: r(9.5 * S / 2), ph: r(4 * S), R: r(8 * S / 2), H: r(5.3 * S), baseA: 5.6, baseH: 0.8, src: '09 › chhatriSW §2, §8: ngang chhajja 9–10, vòm Ø 7,5–8,5, cao từ mái ≈ 14, tầng trụ ≈ 4; 8 trụ (Koch) — × 1,06; thêm bệ 0,8 (§8)' },
  chhatriSE: { type: 'chhatri', roofDesc: 'Chhatri bát giác 8 trụ đôi, vòm nhiều múi, chhajja trên consol, vòm bầu cẩm thạch trắng + sen + finial', name: 'Chhatri Đông Nam', proto: 'Như Chhatri Tây Nam (bản thân đỏ – vòm trắng, phía vườn / cổng)', white: false, a: r(9.5 * S / 2), ph: r(4 * S), R: r(8 * S / 2), H: r(5.3 * S), baseA: 5.6, baseH: 0.8, src: '09 › chhatriSE: như SW (4 chhatri thật giống hệt nhau)' },
  chhatriNW: { type: 'chhatri', roofDesc: 'Chhatri bát giác 8 trụ đôi, vòm nhiều múi, chhajja trên consol, vòm bầu cẩm thạch trắng + sen + finial', name: 'Chhatri Tây Bắc', proto: 'Chhatri bản cẩm thạch trắng (phía sông, trên bậc thềm cùng lăng — thứ bậc màu Koch)', white: true, a: r(9.5 * S / 2), ph: r(4 * S), R: r(8 * S / 2), H: r(5.3 * S), baseA: 5.6, baseH: 0.8, src: '09 › chhatriNW §2–§8: như SW; bản trắng phía sông (đề xuất của nghiên cứu)' },
  chhatriNE: { type: 'chhatri', roofDesc: 'Chhatri bát giác 8 trụ đôi, vòm nhiều múi, chhajja trên consol, vòm bầu cẩm thạch trắng + sen + finial', name: 'Chhatri Đông Bắc', proto: 'Như Chhatri Tây Bắc (bản cẩm thạch trắng)', white: true, a: r(9.5 * S / 2), ph: r(4 * S), R: r(8 * S / 2), H: r(5.3 * S), baseA: 5.6, baseH: 0.8, src: '09 › chhatriNE: như NW' },
  baradari: {
    roofDesc: 'Mái bằng lan can jali trên chhajja vươn 1 m; không vòm',
    type: 'baradari', name: 'Baradari Ven Sông', proto: 'Baradari (12 cửa) loại hình Shahjahani — hai baradari trên bậc thềm Mehtab Bagh (đã mất): mặt bằng vuông 3 × 3 gian, mỗi mặt 3 vòm nhiều múi trên cột Shahjahani, chhajja, mái bằng lan can',
    W: r(12 / 0.74 * S), plinth: 1.0, pier: 1.2, colH: 3.6, rise: 1.9,
    src: '09 › baradari §8: vuông 12 × 12 ở s 0,74 (= 16,2 thật) × 1,06 = 17,2; 3 nhịp; cao diềm ≈ 9 m — TOÀN BỘ SUY RA (nguyên mẫu đã mất, không có số đo). Đổi khung 14 × 10 thành vuông (chữ nhật không ra 12 cửa đều)',
  },
  riverW: {
    roofDesc: 'Sân đỉnh lan can; chhatri bát giác 8 trụ, vòm bầu đỏ + finial',
    type: 'burj', name: 'Đình Bến Sông Tây', proto: 'Tháp-đình (burj) góc tây bắc bậc thềm ven sông Taj (Koch: «ba cặp tháp-đình»): thân bát giác đỏ mọc từ bãi sông, tầng hốc vòm, chhatri đỉnh',
    a: r(14.8 * S / 2), hb: r(8.7 * S), ht: 6.5, chh: { a: 5.6, ph: 4.0, base: 0.5, R: 3.6, H: 3.9 }, domeKey: 'domeR',
    src: '09 › riverW §2, §8: OSM bát giác cạnh 6,1, ngang 14,8 × 1,06; chân cao bằng bậc thềm 8,7 × 1,06 (cửa bến ở chân); tổng ≈ 1,8 × ngang (suy ra theo Mehtab — CHƯA CÓ SỐ ĐO CAO); màu vòm chưa xác minh (chọn đỏ như Mehtab)',
  },
};
