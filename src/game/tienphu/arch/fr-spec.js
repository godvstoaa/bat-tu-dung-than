// ============================================================================
//  ĐẶC TẢ TỪNG CÔNG TRÌNH — PHỦ TÂN CỔ ĐIỂN PHÁP (Versailles). Số lấy từ docs/tienphu-nghiencuu/06-tancodien.md
//  (mục id tương ứng, §8 «Kích thước đề xuất trong game») và ảnh Commons đã xem (ghi trong src).
// ============================================================================
import { frPalace } from './fr-palace.js';
import { frStable } from './fr-stable.js';
import { frOrangerie, frGTrianon, frPTrianon } from './fr-misc.js';
import { frTower } from './fr-tower.js';
import { frBelvedere, frColonnade, frAmour, frPavFrancais, frPavFrais, frCanalPav, frMenagerie } from './fr-pav.js';

export const FR_BUILDERS = { tower: frTower, palace: frPalace, stable: frStable, orangerie: frOrangerie, gtrianon: frGTrianon, ptrianon: frPTrianon, belvedere: frBelvedere, colonnade: frColonnade, tholos: frAmour, pavfr: frPavFrancais, pavfrais: frPavFrais, canalpav: frCanalPav, menagerie: frMenagerie };

// Mặt vườn khối giữa (đọc từ ảnh Versailles-Chateau-FacadeJardin.jpg): 7 + 11 + 7 ô; avant-corps bên = cặp cột · ô · cặp cột;
// avant-corps giữa = 6 cột đơn, 2 ô ngoài là hốc tượng, 3 ô giữa cửa vòm.
const MAIN_L = 'cor W pil W pil W [pair Wac pair] W pil W pil W pil';
const MAIN_C = 'W pil W pil W [col N col W col W col W col N col] W pil W pil W';
const rev = (s) => s.split(/\s+/).reverse().map((t) => (t.endsWith(']') ? '[' + t.slice(0, -1) : t.startsWith('[') ? t.slice(1) + ']' : t)).join(' ');
const WING = 'cor [col W col W col W col] W pil W [col W col W col W col] W pil W [col W col W col W col] cor';

export const FR_SPECS = {
  tower: {
    type: 'tower', name: 'Thánh Điện Tháp (lầu 10 tầng)', proto: 'Tổng hợp Dôme des Invalides (Hardouin-Mansart 1676–1706) + trống cột Panthéon Paris + Phare de Cordouan; ngữ pháp Versailles',
    roofDesc: 'sân thượng phẳng ở mỗi chỗ lùi tầng + vòm chì ovoid 12 gân dát vàng, lanternon 8 cột, obelisk và mặt trời Apollo',
    src: '06 › tower §3–§8: đế 44 m (đề xuất 42), soubassement à refends 7 vòm / mặt → Doric (D 0,925 × 8, triglyph) → Ionic (D 0,8 × 9, huy chương, 8 tượng) → trống tròn có 24 cột Corinthian tự do (D 0,8 × 10) → attic œil-de-bœuf + cặp pilaster → trống trên có 8 trụ cuộn → Vọng Đài vòng vòm mở → vòm ovoid Ø ≈ 24 m cao 12,4 → lanternon → obelisk; tổng ≈ 84 m (đề xuất ≈ 80). Ghi đè lầu: n = 16, a = [16, 14, 14, 13,3, 13,3, 11 ×5], podium 2,4. Lệch: chiều cao tầng theo lưới game 5 m nên mỗi thức chiếm 2 tầng (Vignola giữ nguyên tỉ lệ cột / entablature); bỏ tầng attic chuyển tiếp bát giác (cuộn đỡ chuyển sang trống trên); tầng vuông bao ngoài vách 16 cạnh của game',
  },
  main: {
    roofDesc: 'mái phẳng chì «à l’italienne» giấu sau lan can con tiện, trophée + pot à feu trên trụ', type: 'palace', name: 'Lâu Đài Chính (Corps de Logis)', proto: 'Corps central Château de Versailles, mặt vườn (Le Vau – d’Orbay 1668–71, Hardouin-Mansart 1678–84)',
    front: `${MAIN_L} ${MAIN_C} ${rev(MAIN_L)}`, D: 24, ph: 1.2,
    src: '06 › main §2, §8: rộng ≈ 103 m (OSM 103,9), 25 ô (7 + 11 + 7), 3 avant-corps (giữa 6 cột + 2 hốc, bên 4 cột), 3 tầng ≈ 22 m tới đỉnh lan can; Phần chung §2 tầng nền 6 / tầng chính 1 + 7,38 + 1,85 (Ionic D 0,82, ¼) / attic 4,4 / lan can 1,2. Ảnh Commons «Versailles-Chateau-FacadeJardin.jpg»: cặp cột avant-corps bên, tượng trên mọi cột, trophée trên trụ avant-corps, pot à feu trên trụ thường. Mặt sau (−z) cùng ngữ pháp vì trong phủ quay ra parterre',
  },
  wingW: {
    roofDesc: 'mái phẳng chì giấu sau lan can (như khối giữa)', type: 'palace', name: 'Cánh Tây (Aile du Midi)', proto: 'Aile du Midi, Hardouin-Mansart 1679–81 — lặp mặt đứng khối giữa',
    front: WING, D: 18, ph: 1.2,
    src: '06 › wingW §2, §8 phương án rút gọn: 13 ô, 3 avant-corps 3 ô / 4 cột (thật: 34 ô, 3 × 8 cột), cao bằng main ≈ 22 m. Chưa làm: mặt phố hồng sẫm + Mansard (mặt đó không có trong phủ)',
  },
  wingE: {
    roofDesc: 'mái phẳng chì sau lan can + mái chì dốc nhà nguyện, gờ nóc dát vàng', type: 'palace', name: 'Cánh Đông (Aile du Nord)', proto: 'Aile du Nord, Hardouin-Mansart 1685–89 + Chapelle Royale (1710) nhô cao phía sau',
    front: WING, D: 18, ph: 1.2, chapel: { x: -13, len: 26, w: 13, h: 9.2 },
    src: '06 › wingE §2, §5, §8: như wingW + nhà nguyện (thật 42 × 24 × 40 m) thu ≈ 0,6 rộng, giữ cao ≈ 1,8 × cánh; đặt ở đầu −x (gần main trong tổng mặt bằng). Mái chì dốc, gờ nóc dát vàng, tượng trên lan can',
  },
  stableW: {
    roofDesc: 'Mansard ardoise hai dốc gãy, cửa sổ mái, ống khói gạch; fronton ngựa ở cổng', type: 'stable', name: 'Đại Tàu Ngựa (Grande Écurie)', proto: 'Grande Écurie du Roi, Hardouin-Mansart 1679–82 — mặt lõm hướng Place d’Armes, cổng fronton ngựa, manège chữ nhật',
    chord: 70, sag: 12, dep: 11.5, manege: 'rect',
    src: '06 › stableW §2, §5, §8: dây cung 70 m, dãy sâu 11,5 m, 2 tầng (trệt vòm 6 + tầng 1 4,5) + Mansard (diềm ≈ 11,4, nóc ≈ 15,6), cổng 15 × 15 cao ≈ 18 m tới đỉnh fronton; manège 16,75 m rộng (thật 47,8 m dài → 26 m). Ảnh Commons «Versailles_-_Grande_Écurie.jpg»: cửa mái, ống khói, lưới sắt đầu giáo vàng. Chưa làm: 5 sân phía sau (chỉ dựng mặt cung + cổng + manège)',
  },
  stableE: {
    roofDesc: 'Mansard ardoise có cửa sổ mái; rotunda mái vòm ardoise + lồng đèn', type: 'stable', name: 'Tiểu Tàu Ngựa (Petite Écurie)', proto: 'Petite Écurie du Roi, Hardouin-Mansart 1679–81 — cặp đối xứng với Grande Écurie, sau cổng là rotunda manège tròn',
    chord: 70, sag: 12, dep: 11.5, manege: 'round',
    src: '06 › stableE §5, §8: như stableW, khác ở rotunda Ø 17 m cao ≈ 20 m mái vòm ardoise sau cổng. Chưa làm: hành lang đôi hàng cột bên trong, hàng cột bán nguyệt viền sân',
  },
  orangerie: {
    type: 'orangerie', name: 'Nhà Cam (Orangerie)', proto: 'Orangerie de Versailles, Hardouin-Mansart 1684–86 — hành lang vòm dưới Parterre du Midi, thang Cent-Marches',
    W: 60, D: 14, roofDesc: 'sân thượng phẳng (Parterre du Midi) sau lan can — không thấy mái',
    src: '06 › orangerie §2, §8: giữ cao ≈ 13,5 m và cột Toscan Ø 1,46 × 7 D = 10,2 m, rút còn 6 vòm + avant-corps giữa (2 cặp cột) trong 60 m (thật 156 m); tường dày 3 m (thật 4–5), kính lùi sâu; hai cánh vuông góc mang thang Cent-Marches 83 bậc 0,165 × 0,35 (rộng 9 m, thật ≈ 30 m); 14 bồn cam. Chưa làm: hai tháp tròn chỗ nối, 6 ô cỏ parterre',
  },
  grandtrianon: {
    type: 'gtrianon', name: 'Grand Trianon (Trianon de marbre)', proto: 'Grand Trianon, Hardouin-Mansart & R. de Cotte 1687–88 — péristyle mở cột đá hồng incarnat',
    W: 50, D: 18, roofDesc: 'mái phẳng chì giấu sau lan can con tiện (vua bác mái dốc vì «nặng nề»)',
    src: '06 › grandtrianon §2, §5, §8: 50 × 18, một tầng ≈ 10,5 m (Ionic D 0,72 × 9 = 6,5 + entablature 1,6 + lan can 1,1 + nền 0,9); péristyle 40 × 12: phía vườn 14 cột incarnat thành 7 cặp, phía sân 8 cột Campan thành 4 cặp trước trụ vòm; khối đầu cửa vòm xen cặp pilaster hồng. Ảnh Commons «Grand_Trianon_Péristyle.JPG», «Panorama_Grand_Trianon.jpg». Chưa làm: cánh Trianon-sous-Bois, Galerie des Cotelle',
  },
  petittrianon: {
    type: 'ptrianon', name: 'Petit Trianon', proto: 'Petit Trianon, Ange-Jacques Gabriel 1762–68 — khối lập phương tân cổ điển, thức Corinthian khổng lồ',
    S: 23.4, roofDesc: 'mái phẳng sau lan can ô con tiện xen tấm đặc — không tượng, không trophée',
    src: '06 › petittrianon §2–§5, §8: 23,4 m (12 toises), 5 ô × 4,68 m; Corinthian khổng lồ D 0,85 × 10 = 8,5 + entablature 2,1 xuyên tầng chính + attic; mặt nam ≈ 17 m (tầng trệt khía 4,5), mặt tây ≈ 13 m trên sân thượng; bốn mặt khác nhau (tây 4 cột rãnh tự do, nam / bắc 4 pilaster, đông trơn). Ảnh Commons «West_facade_of_Petit_Trianon_002.JPG»',
  },
  summit: {
    type: 'belvedere', name: 'Đài Ngắm Cảnh (Belvédère)', proto: 'Belvédère du Petit Trianon, Richard Mique 1778–81 — đình bát giác trên gò đá giả, thang có nhân sư', roofDesc: 'vòm chì thấp giấu sau lan can con tiện',
    src: '06 › summit §2–§5, §8: bát giác 8,4 m trên gò đá (nền 1,5), 4 thang × 2 nhân sư, 4 cửa vòm xen 4 cửa sổ, entablature + lan can, cao ≈ 8,5 m; khung 9 × 9 (+ thang). Lệch: thức cột chưa xác nhận → dùng pilaster góc Toscan trơn; phù điêu trên cửa vẽ bằng cartouche',
  },
  colonnade: {
    type: 'colonnade', name: 'Hành Lang Cột (Colonnade)', proto: 'Bosquet de la Colonnade, Hardouin-Mansart 1685 — vòng 32 vòm trên cột Ionic đá màu', n: 32, r: 16, roofDesc: 'không mái — gờ vòng Carrara, pot à feu trên mỗi cột',
    src: '06 › colonnade §2, §5, §8: 32 cột + 32 vòm (giữ đủ), Ø trục 32 m (thật ≈ 38 m; khung cũ 14 m sai nặng → đề xuất ≥ 32), bước 3,1 m (thật 3,7), cột Ionic D 0,45 × 9, cao ≈ 7 m tới đỉnh gờ, ≈ 8,5 m tới pot à feu; cột Languedoc / bleu turquin / brèche violette xen kẽ, vòm Carrara, 28 bồn nước, 4 lối vào, nhóm tượng Girardon ở tâm. Ảnh Commons «Parc_de_Versailles,_Bosquet_de_la_colonnade,_Vue_d’ensemble.jpg»',
  },
  amour: {
    type: 'tholos', name: 'Đền Tình Yêu (Temple de l’Amour)', proto: 'Temple de l’Amour, Richard Mique 1778 — đền tròn 12 cột Corinthian, 7 bậc', roofDesc: 'vòm thấp đá có gân, mặt trong ô lõm caissons',
    src: '06 › amour §2–§5, §8: đề xuất 16 × 16 (thật): 7 bậc Ø 15,5 → 10,8 m (cao 0,2 lùi ≈ 0,4), vòng cột Ø 9,25, 12 cột Corinthian có rãnh D 0,7 × 10, entablature 1,75, vòm thấp, tổng ≈ 12,7 m; tượng Cupid trên bệ ở tâm. Ảnh Commons «Temple_de_l’Amour_(1).jpg». Chưa làm: đảo cỏ và mặt nước (thuộc tổng mặt bằng)',
  },
  bosq1: {
    type: 'pavfr', name: 'Đình Bosquet Tây (Pavillon Français)', proto: 'Pavillon Français, Ange-Jacques Gabriel 1749–50 — chữ thập có phòng giữa bát giác', R: 8.5, roofDesc: 'sân thượng kiểu Ý trên 4 phòng nhỏ + vòm chì thấp phòng giữa',
    src: '06 › bosq1 §2–§5, §8: đề xuất 17 × 17 (thật, OSM 17,1 × 16,9); 4 cửa vòm phòng giữa + 12 cửa sổ đầu thẳng; 8 cột Corinthian (đặt hai bên 4 cửa vòm — nguồn không nói rõ trong / ngoài), lan can 8 nhóm tượng trẻ em xen 8 bình, vòm ≈ 10 m. Lệch: diềm chạm gà / vịt / thiên nga chưa làm',
  },
  bosq2: {
    type: 'pavfrais', name: 'Đình Bosquet Đông (Pavillon Frais)', proto: 'Pavillon Frais, Gabriel 1751–53 (dựng lại 1984) — đình giàn mắt cáo xanh, vườn vòm giàn', W: 10.9, D: 9.1, gw: 16, gd: 12, roofDesc: 'sân thượng phủ chì sau lan can',
    src: '06 › bosq2 §2–§5, §8: nhà 10,9 × 9,1 cao ≈ 6 m; vườn trước rút còn 16 × 12 (thật ≈ 50 × 20) bao dãy vòm giàn cao 3,5 m bước 2,35 m; 2 bồn bầu dục viền Languedoc; cổng hai trụ đỡ giỏ hoa',
  },
  canalW: {
    type: 'canalpav', name: 'Đình Đầu Kênh Tây', proto: 'Đình cẩm thạch trắng có vòm, Bosquet des Dômes (Hardouin-Mansart 1677, phá 1820) — mẫu cùng loại', a: 3.6, roofDesc: 'vòm chì nhỏ trên trống, đỉnh pot à feu dát vàng',
    src: '06 › canalW §2–§8 (phần lớn [Suy], không ảnh): vuông 7,2 m + thềm = 9 × 9, 3 bậc, mỗi mặt một cửa vòm mở, pilaster Ionic góc D 0,46, entablature, lan can, vòm chì, cao ≈ 10 m; thềm bến ra kênh ở +z. Cảnh báo: thiết kế theo ngữ pháp, nguyên mẫu đã mất',
  },
  menag: {
    type: 'menagerie', name: 'Đình Thú (Ménagerie)', proto: 'Ménagerie royale de Versailles, Louis Le Vau 1662–68 (đã mất) — nhà bát giác giữa sân quạt 7 chuồng', Rc: 10, roofDesc: 'vòm ardoise bát giác + đèn lồng nhỏ (Le Vau, chưa theo mái phẳng)',
    src: '06 › menag §2–§5, §8: bát giác ≈ 8,6 m, 2 tầng (5 + 4,5), ban công sắt vòng quanh tầng 1, vòm ardoise, cao ≈ 15 m; sân bát giác R 10 với 7 chuồng quạt tường thấp 1,2 m + lưới sắt, quạt trước để ngỏ. Kích thước [Suy] (không có số đo)',
  },
};
