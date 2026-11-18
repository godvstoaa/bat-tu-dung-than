// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — TIÊN PHỦ GOTHIC ANH. Số lấy từ docs/tienphu-nghiencuu/04-gothic.md, mục id tương ứng,
//  §8 «đề xuất kích thước trong game» (mái 50° — A5; merlon 2,0 / crenel 0,7 — A2). Cao độ tuyệt đối tính từ mặt đất,
//  sàn trệt ở ph (bệ 0,8 m). Bề sâu dãy nhà theo «Phát hiện chính»: 7–13 m, không phải 14–20 m của khung cũ.
// ============================================================================
const PI = Math.PI;

export const GO_SPECS = {
  tower: {
    type: 'tower', name: 'Tháp Đại Bàng (lầu 10 tầng)', proto: 'Eagle Tower, Caernarfon (c.1283–1317) — keep đa giác của Edward I, 3 tháp canh có tượng đại bàng, dải đá màu',
    src: '04 › lau10 §2, §5, §8: thân đa giác Ø ~28 m (a = 14 m tầng 1), dải đá vôi sáng #C9C2B0 xen sa thạch nâu #8A6A4E, lan can răng cưa merlon 2,0 / crenel 0,7, 3 tháp canh Ø 6 m cao 13 m trên lan can (đặt lệch), tượng đại bàng, chân xiên, bệ vuông 40 m cao 2,5 m có lan can răng cưa. Lệch: thân 8 cạnh (engine chỉ cho 4/8/16; nguyên mẫu 10 cạnh); tầng 5 m (engine) thay 4,5 m; giật cấp 0,8–1,2 m ở tầng 3/6/9 để có hành lang tuần tra trên consol (game cần hành lang) — Eagle Tower thật không giật cấp',
  },
  main: {
    type: 'hallH', name: 'Đại Sảnh (Great Hall)', proto: 'Baron\'s Hall, Penshurst Place (1338–41) — sảnh một nhịp + hai cánh ngang (mặt bằng chữ H ba phần, Ludlow / Penshurst)',
    ph: 0.8, c: 'S',
    hall: { L: 32, D: 13, t: 1.2, eaveH: 12, bays: 5, win: { w: 2.6, y0: 3.4, ys: 8.6 }, louvre: { a: 1.1, h: 2.2 } },
    wing: { L: 20, D: 12, eaveH: 8.2, f1: 4.0 }, porch: { W: 4.2, D: 4, h: 7.0 }, door: { w: 2.6, ys: 2.8 },
    src: '04 › main §2, §5, §8: sảnh 32 × 13 m (dài/rộng 2,46), diềm 12 m / nóc 19,7 m trên sàn (mái 50°), 5 gian trụ ốp, cửa sổ Decorated 2 ô có song ngang + ô bốn thuỳ; louvre Ø 2,4 m giữa nóc; cánh 12 × 20 m diềm 8,2 m; cổng hiên 4 × 4 m 2 tầng ở đầu dưới; vì kèo gỗ hạt dẻ lộ, lò sưởi bát giác giữa sàn, bục, bình phong + ban công nhạc công. Lệch: thêm cửa vào 2,6 m giữa mặt tiền (yêu cầu game) — nguyên mẫu chỉ vào qua cổng hiên. Chưa làm: cửa sổ lồi (oriel) cạnh bục, tượng grotesque chân kèo',
  },
  chapel: {
    type: 'chapel', name: 'Nhà Nguyện', proto: 'Sainte-Chapelle, Paris (1242–48) thu nhỏ — nhà nguyện cung điện 2 tầng; đầu tây (+z) cổng hiên + hoa hồng, apse đa giác đầu đông (−z)',
    c: 'P', ph: 0.8, W: 11.2, t: 0.8, zW: 12.5, bays: 4, bay: 6.0, lowH: 5.3, eave: 25, up: { w: 3.5, y0: 7.4, h: 14.2 },
    butt: { d: 2.5, bw: 1.3, pin: 4 }, rose: { y: 16.8, r: 3.6 }, porch: { D: 3, h: 12.0 }, fleche: { z: 0.5, h: 12 },
    src: '04 › chapel §2, §5, §8 (hệ số 0,8): ngang 16 m kể trụ ốp sâu 2,5 m, tầng dưới 5,3 m, diềm 25 m, nóc ~35 m (mái 60°), 4 nhịp × 6 m + apse 5 mặt, cửa sổ tầng trên rộng 3,5 m (4 ô ghép đôi + ô hoa), gablet trên mỗi cửa sổ, pinnacle 4 m, lan can thủng chân mái, hoa hồng tây Ø 7,2 m, 2 tháp cầu thang góc tây, chóp mảnh 12 m (+ đèn lồng 4,6 m) trên nóc. Hướng: apse ở −z, khi đặt vào tổng mặt bằng phải quay −z về hướng ĐÔNG (C.11). Lệch: dài ~37 m (khung 34); cửa sổ cao 14,2 m thay 12,4 m (đề xuất 0,8 × 15,5) để đầu cửa sổ chạm gablet như ảnh mặt nam Sainte-Chapelle — với 12,4 m tường trống 5 m dưới diềm',
  },
  kitchen: {
    type: 'kitchen', name: 'Bếp & Kho', proto: 'Great Kitchen, Stanton Harcourt (cuối tk 14) + Abbot\'s Kitchen, Glastonbury (1320–70): tháp bếp vuông, mái chóp bát giác, đèn lồng thoát khói; dãy kho buttery / pantry',
    c: 'K', ph: 0.8, kit: { x: -11.5, W: 11, h: 12, roofH: 7.4, lantern: { a: 1.4, h: 2.0 } }, store: { x: 5.5, z: 1.0, L: 23, D: 9, eaveH: 6.2, f1: 3.0 },
    src: '04 › kitchen §2, §5, §8: bếp 11 × 11 m, tường 12 m + lan can răng cưa, mái bát giác ngói đá #6E6658, đèn lồng bát giác Ø ~3 m cao 2 m, đỉnh ~22 m, sư tử Harcourt, tháp cầu thang góc (Stanton), máng xối đầu thú (Glastonbury), lỗ khói quanh chân mái; kho 23 × 9 m 2 tầng diềm 7 / nóc 12,4 m. Cửa vào giữa nhà (x = 0) rơi vào dãy kho',
  },
  solar: {
    type: 'solar', name: 'Phòng Lãnh Chúa (Solar)', proto: 'Great Chamber Block, Ludlow Castle (c.1320) + Solar, Stokesay: khối 3 tầng, phòng đẹp nhất ở tầng 1, ống khói đá, tháp vệ sinh 4 tầng',
    c: 'G', ph: 0.8, block: { L: 18, D: 11, f1: 4.2, f2: 9.2, eaveH: 12.4 }, garderobe: { x: 5.0, W: 5, D: 5, h: 15.2 },
    src: '04 › solar §2, §5, §8: khối 18 × 11 m, 3 tầng, diềm 13,2 / nóc 19,8 m (mái 50°), cửa sổ tầng 1 lớn nhất (2 ô có song ngang), ống khói bát giác trên tường dọc sau, tháp vệ sinh 5 × 5 m cao 16 m mái phẳng sau lan can răng cưa. Sửa khung cũ 60 × 14 m (sai bản chất). Chưa làm: cầu thang ngoài kiểu Stokesay',
  },
  guest: {
    type: 'lodging', variant: 'guest', name: 'Nhà Khách', proto: 'West Range lodgings, Dartington Hall (c.1388–1400): dãy một lớp phòng 2 tầng + gác mái, cổng hiên 2 tầng ghép đôi, hàng ống khói mặt sau',
    c: 'Q', ph: 0.8, L: 40, D: 8, t: 0.9, eaveH: 7.4, f1: 3.4, units: 6, porches: [-13.33, 0, 13.33], roof: 'slate', finial: 'ball',
    src: '04 › guest §2, §5, §8: 40 × 8 m, diềm 8,2 / nóc ~13 m (mái 50°), 18 ô cửa mặt tiền 2 ô song đứng + ngang, 3 cổng hiên 2 tầng mái riêng (mỗi cổng phục vụ 2 cụm — Raking Light), 6 ống khói bát giác mặt sau cao ~1,6 m trên nóc',
  },
  barracks: {
    type: 'lodging', variant: 'barracks', name: 'Doanh Trại', proto: 'East Range (retinue lodgings), Dartington Hall: dãy 2 tầng, cầu thang đá ngoài mặt sân, cánh vệ sinh chung mặt sau',
    c: 'L', ph: 0.8, L: 56, D: 8, t: 0.9, eaveH: 7.0, f1: 3.5, stair: { uLand: 13.7, run: 7.6, w: 1.3 }, privies: [-21, -7, 7, 21], finial: 'ball',
    src: '04 › barracks §2, §5, §8: 56 × 8 m, diềm 7,8 / nóc ~12,5 m, tường đá vụn quét vôi #E0DCCF, 2 cầu thang đá ngoài rộng 1,3 m lên cửa tầng trên, 4 cánh vệ sinh 2,6 × 2,5 m mái một dốc, cửa sổ một ô nhỏ, 2 ống khói (ít hơn nhà khách)',
  },
  mews: {
    type: 'mews', name: 'Chuồng Ưng & Ngựa', proto: 'Stables, Kenilworth Castle (1553 — lệch niên đại, gần nhất còn lại) + Royal Mews: tầng dưới đá đỏ, tầng trên khung gỗ thanh chéo «ragged staff»',
    c: 'R', ph: 0.3, L: 44, D: 7, stoneH: 3.2, eaveH: 6.5, mewsL: 10,
    src: '04 › mews §2, §5, §8: 44 × 7 m (Kenilworth rộng 6,4 m), 2 tầng: đá đỏ #9C5A43 + khung sồi #4A3526 ô trát #E4DCC8, diềm 6,8 / nóc ~11 m, mái ngói đất nung #8E4B34; cửa ngựa 2 cánh, cửa bốc cỏ + xà tời, 10 m chuồng ưng ở đầu +x có song gỗ / cửa chớp, cọc đậu. Lệch: nền 0,3 m thay 0,8 m (ngựa vào chuồng — bậc thấp)',
  },
  library: {
    type: 'lodging', variant: 'library', name: 'Thư Các', proto: 'Old Library, Merton College, Oxford (1371–78): thư viện ở tầng 1, hàng cửa sổ hẹp một ô đầu lá năm thuỳ theo nhịp bục đọc',
    c: 'O', ph: 0.8, L: 34, D: 8, t: 0.9, eaveH: 9.0, f1: 3.5, win: { w: 0.8, h: 2.6, step: 2.5, n2: 6 }, roof: 'roofLib', strings: [3.5], finial: 'cross',
    src: '04 › library §2, §5, §8: 34 × 8 m, trệt 3,5 m + thư viện 5 m, diềm 9,8 / nóc ~14,6 m, cửa sổ thư viện ô đơn rộng 0,8 m cao 2,6 m bước 2,5 m (13 ô mỗi bên), đầu hồi: cửa sổ 2 ô có song ngang + ô bốn thuỳ (RCHME), không ống khói, đá vôi Oxford #C8B68F',
  },
  summit: {
    type: 'roundTower', name: 'Đài Ngắm Cảnh', proto: 'Tháp canh trên tháp tây Harlech (5,8 m) + tháp liên lạc nhà cổng Beaumaris: tháp tròn mảnh đứng một mình có tháp cầu thang chồng',
    c: 'H', r: 3.5, yw: 14.6, batter: { h: 3.0, d: 0.7 }, pad: { w: 9, h: 0.6 }, strings: [5.6, 10.2], doorW: 1.4,
    turret: { a: -PI / 2 + 0.6, r: 1.5, h: 5.8, flag: true },
    slits: [{ a: 0.3, y: 2.6 }, { a: 2.4, y: 4.4 }, { a: -1.2, y: 6.6 }, { a: 1.2, y: 8.4 }, { a: -2.6, y: 10.8 }, { a: 0.0, y: 12.2 }, { a: 2.9, y: 7.4 }],
    src: '04 › summit §8: Ø 7 m, cao 16,6 m tới đỉnh lan can (cao / Ø ≈ 2,4), tháp cầu thang Ø 3 m nhô thêm 5,8 m (số Harlech), chân xiên, bệ 9 × 9 m; khe bắn dọc thân theo cầu thang xoắn',
  },
  twrSW: {
    type: 'roundTower', name: 'Tháp Góc Tây Nam', proto: 'South-west tower, Harlech Castle (1283–89): tháp tròn to thấp đậm + tháp canh trụ tròn',
    c: 'H', r: 4.5, yw: 13.0, batter: { h: 3.5, d: 0.9 }, strings: [4.8, 9.0], turret: { a: -PI / 2 - 0.55, r: 1.5, h: 5.8 },
    slits: [{ a: PI / 2 + 0.7, y: 2.2, cross: true }, { a: PI / 2 - 0.7, y: 2.2, cross: true }, { a: 0, y: 6.0, cross: true }, { a: PI, y: 6.0, cross: true }, { a: PI / 2, y: 6.2, cross: true }, { a: 0.8, y: 10.2 }, { a: 2.3, y: 10.2 }],
    wins: [{ a: -PI / 2, y0: 9.6, ys: 11.0, w: 1.2 }],
    src: '04 › twrSW §8: Ø 9 m, cao 15 m tới đỉnh lan can (cao / Ø ≈ 1,7), tháp canh Ø 3 m cao 5,8 m ở mép trong (−z = phía sân), sa thạch xám lục #7C806F + chi tiết vàng #C7AE78, 3 tầng khe chữ thập',
  },
  twrSE: {
    type: 'roundTower', name: 'Tháp Góc Đông Nam', proto: 'Tháp góc tròn, Bodiam Castle (1385): 3 tầng, chân xiên sâu mọc từ mặt hào, không machicolation, không tháp canh',
    c: 'S', r: 4.35, yw: 15.0, batter: { h: 4.5, d: 1.4 }, strings: [5.6, 10.4],
    slits: [{ a: PI / 2 + 0.8, y: 5.2 }, { a: PI / 2 - 0.8, y: 5.2 }, { a: 0.2, y: 7.0 }, { a: PI - 0.2, y: 7.0 }, { a: 0.6, y: 11.8 }, { a: PI - 0.6, y: 11.8 }, { a: PI / 2, y: 12.4 }],
    wins: [{ a: -PI / 2 - 0.45, y0: 7.0, ys: 8.6, w: 1.1, head: 'square', tr: { n: 2, cusp: 3 } }, { a: -PI / 2 + 0.45, y0: 11.6, ys: 13.0, w: 1.1, head: 'square', tr: { n: 2, cusp: 3 } }],
    src: '04 › twrSE §2, §8: Ø 8,7 m, cao 17 m tới đỉnh lan can (tường 13 m + 4 m), chân xiên sâu, 3 tầng, cửa sổ 2 ô song đứng ở phía sân (−z), sa thạch vàng xám #B9A57E. Chưa làm: hào nước (thuộc tổng mặt bằng)',
  },
  twrNW: {
    type: 'roundTower', name: 'Tháp Góc Tây Bắc', proto: 'North-west tower, Harlech Castle: như tháp TN nhưng thấp hơn 0,7 m, tháp canh đặt lệch góc khác',
    c: 'H', r: 4.5, yw: 12.3, batter: { h: 3.5, d: 0.9 }, strings: [4.6, 8.6], turret: { a: -PI / 2 + 0.75, r: 1.5, h: 5.8 },
    slits: [{ a: PI / 2 + 0.6, y: 2.2, cross: true }, { a: PI / 2 - 0.9, y: 2.2, cross: true }, { a: 0.3, y: 5.8, cross: true }, { a: PI - 0.3, y: 5.8, cross: true }, { a: PI / 2 + 0.2, y: 6.0, cross: true }, { a: 1.0, y: 9.6 }, { a: 2.6, y: 9.6 }],
    wins: [{ a: -PI / 2 - 0.3, y0: 9.0, ys: 10.4, w: 1.2 }],
    src: '04 › twrNW §8: Ø 9 m, cao 14,3 m tới đỉnh lan can, tháp canh Ø 3 m cao 5,8 m lệch về góc khác twrSW',
  },
  twrNE: {
    type: 'roundTower', name: 'Tháp Góc Đông Bắc', proto: 'Tháp tròn Conwy Castle (8 tháp cao 21 m), quét vôi trắng thời trung cổ; tầng 1 là nhà nguyện có 3 cửa sổ lancet phía đông (Chapel Tower)',
    c: 'W', r: 4.5, yw: 19.0, batter: { h: 3.0, d: 0.8 }, strings: [5.4, 10.2, 14.6], turret: { a: -PI / 2 + 2.3, r: 1.4, h: 4.6 },
    slits: [{ a: PI / 2 + 0.6, y: 2.2 }, { a: PI / 2 - 0.6, y: 2.2 }, { a: PI, y: 7.0 }, { a: 2.2, y: 12.0 }, { a: 0.9, y: 16.2 }, { a: PI - 0.7, y: 16.2 }],
    wins: [{ a: -0.2, y0: 6.6, ys: 9.0, w: 0.6, tr: { n: 1, cusp: 3 } }, { a: 0, y0: 6.6, ys: 9.4, w: 0.6, tr: { n: 1, cusp: 3 } }, { a: 0.2, y0: 6.6, ys: 9.0, w: 0.6, tr: { n: 1, cusp: 3 } }, { a: -PI / 2, y0: 11.4, ys: 12.8, w: 1.3 }],
    src: '04 › twrNE §2, §5, §8: Ø 9 m, cao 21 m tới đỉnh lan can (Conwy, cao / Ø ≈ 2,3), quét vôi #E8E4D8 bong lộ đá #8E8A80, 3 lancet phía đông (+x) ở tầng nhà nguyện. Tháp canh nhỏ: CHƯA KIỂM nguồn (theo hiểu biết chung về 4 tháp đông Conwy)',
  },
  tilt: {
    type: 'stand', name: 'Khán Đài Đấu Thương', proto: 'Khán đài gỗ (scaffolds) Smithfield 1390 + khán đài trong Livre des tournois của vua René (c.1460): khung gỗ lộ, vải thêu huy hiệu, mái che, ô hoàng gia',
    L: 14, D: 6, y1: 2.5, y2: 5.0, eave: 6.3, pitch: 30, royal: { w: 4, out: 1.0, up: 1.5 },
    src: '04 › tilt §5, §8: 14 × 6 m, sàn 2,5 / 5,0 m, mái ván tới 8 m, ô hoàng gia 4 m nhô 1 m mái cao hơn ~1,5 m, vải thêu đỏ #9E1B1B / lam #1F3F8C / vàng #C9A24A, cờ đuôi nheo, cầu thang sau, hàng rào sân đấu thấp phía trước. Độ tin cậy yếu — không có số đo khán đài thật',
  },
  orchard: {
    type: 'arbour', name: 'Chòi Vườn Quả', proto: 'Herber / arbour vườn lâu đài trung cổ (Crescenzi, Ruralia commoda 1304–09): giàn mắt cáo gỗ phủ nho, hồng leo, ghế cỏ chữ U, đài nước chảy tràn',
    W: 8, colH: 3.0, top: 4.0,
    src: '04 › orchard §5, §8: giàn vuông 8 × 8 m, cột 3 m, đỉnh vòm 4 m, ghế cỏ cao 0,45 + 0,08 m rộng 0,6 m chạy 3 cạnh, lối vào mặt trước, không mái kín. Mọi số là giả định (nguồn không có số đo)',
  },
};

// ô «Mái» trên tờ bản vẽ (banve.mjs đọc roofDesc)
const ROOF = {
  tower: 'mái chì phẳng #8A9095 khuất sau lan can răng cưa (merlon 2,0 / crenel 0,7 m); 3 tháp canh bát giác mái chì phẳng sau lan can, tượng đại bàng; hành lang tuần tra trên consol ở tầng 3 / 6 / 9',
  main: 'sảnh: hai dốc 50° ngói đá #5A5550, đầu hồi đá nhô (coped gable) có hoa thập tự, louvre bát giác gỗ mũ chì giữa nóc; hai cánh: hai dốc 50°, đầu hồi đá ra mặt tiền; cổng hiên: chì phẳng sau lan can răng cưa',
  chapel: 'chì #6F767C dốc 60°, đầu tây hồi đá có thập tự, đầu đông mái chóp nửa thập giác trùm apse, gờ hoa huệ vàng trên nóc, chóp mảnh (flèche) bát giác 12 m + đèn lồng; lan can thủng chân mái, gablet + pinnacle mỗi nhịp',
  kitchen: 'bếp: chóp bát giác ngói đá #6E6658 dựng trong lan can răng cưa, đèn lồng gỗ bát giác thoát khói + sư tử, lỗ khói quanh chân mái; kho: hai dốc 50° ngói đá, hồi đá phía đông',
  solar: 'hai dốc 50° đá phiến #4A4F57, hai đầu hồi đá nhô; ống khói bát giác vượt nóc; tháp vệ sinh mái chì phẳng sau lan can răng cưa',
  guest: 'hai dốc 50° đá phiến #4A4F57 liên tục, hồi đá hai đầu; 3 cổng hiên mái hai dốc riêng (hồi đá ra trước); 6 ống khói bát giác mặt sau',
  barracks: 'hai dốc 50° đá phiến #4A4F57, hồi đá hai đầu; 4 cánh vệ sinh mái một dốc đá phiến; 2 ống khói vuông',
  mews: 'hai dốc 50° ngói đất nung #8E4B34, hồi khung gỗ để hở có ván gió (bargeboard), ngói bò nóc tròn',
  library: 'hai dốc 50° ngói đá #7A7264, hồi đá có thập tự, không ống khói (thư viện không đốt lửa)',
  summit: 'chì phẳng sau lan can răng cưa; tháp cầu thang chồng có lan can răng cưa riêng + cờ',
  twrSW: 'chì phẳng sau lan can răng cưa; tháp canh tròn (mép trong) lan can răng cưa riêng — không mái nón (C.2)',
  twrSE: 'chì phẳng sau lan can răng cưa, không tháp canh, không machicolation (C.3)',
  twrNW: 'chì phẳng sau lan can răng cưa; tháp canh tròn lệch góc khác twrSW',
  twrNE: 'chì phẳng sau lan can răng cưa; tháp canh nhỏ (chưa kiểm nguồn)',
  tilt: 'mái ván gỗ hai dốc 30°, hồi để hở có ván gió; ô hoàng gia mái ván cao hơn ~1,6 m, hồi phủ vải thêu; cờ đuôi nheo',
  orchard: 'không mái kín: giàn vòm mắt cáo gỗ liễu cao 4 m phủ nho + hồng leo',
};
for (const [k, v] of Object.entries(ROOF)) GO_SPECS[k].roofDesc = v;
