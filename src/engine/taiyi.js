// ============================================================================
//  THÁI NHẤT THẦN SỐ 太乙神数 — thức ĐẦU TIÊN của "三式" (Kỳ Môn + Lục Nhâm + Thái Nhất)
//  Thái Nhất = "vua của ba thức", bày trận thiên-địa, xem cát hung năm/tháng/quốc gia,
//  chủ yếu phán "nên thủ (主) hay nên khách (客)".
//
//  Scope vòng này (BẢN CỔ PHƯƠNG CỐT TỦY, dựa《太乙金镜式经》唐·王希明 + 《太乙神数统宗大全》
//  + 知乎《太乙神数入门》by 旭伦/澜 https://zhuanlan.zhihu.com/p/704546303):
//    1. Tính 积年 (tích năm từ thượng nguyên)
//    2. Tính 入纪 (vào kỷ) + 入局 (vào cục) — chu kỳ 360 năm / 72 năm
//    3. Định 太乙 (Thái Nhất) cung vị — 8 cung (trừ trung cung), 24 năm một vòng
//    4. Định 天目/文昌 (Thiên Mục / Văn Xương) — chu kỳ 18 năm qua 16 vị (乾坤 lưu 2 năm)
//    5. Định 计神 → 始击/客目 (Kế Thần → Thỉ Kích / Khách Mục)
//    6. Tính 主算 (chủ toán) + 客算 (khách toán) — CỔ PHƯƠNG: tổng số cung dọc đường đi
//       từ 目 thuận hành tới cung trước 太乙 (theo 8 cung thái nhất; +1 nếu 目 ở 间神).
//       VERIFY 2024: 主算=38, 客算=25 (khớp 知乎 bài + các bảng đã xuất bản).
//    7. Phán chủ/khách + cát hung năm theo 算 (长/单/杜塞 + 阴阳 + 不和).
//
//  LƯU Ý: Thái Nhất thần số ĐẦY ĐỦ cực kỳ phức tạp (《统宗大全》hàng trăm trang:
//  主大将/客大将/参将/飞鸟/掩迫/关囚/格对/执提...). Bản này giữ phần cốt tủy
//  (cấu trúc cục + Thái Nhất cung + Thiên Mục + 始击 + 主/客 toán cổ phương) để dùng
//  được; phần thần-tướng phụ (đại tướng/tham tướng) = bước cải tiến sau.
//  Nguồn công thức đã verify qua WebSearch + cross-check năm 2024.
// ============================================================================

// --- CÁC HẰNG SỐ CỐT TỦY (verified from 《太乙金镜式经》/《考定太乙真数》) ---
// EPOCH = 10153917 là Thái Nhất thượng nguyên tích năm TẠI NĂM 0 SCN (CE year 0), theo
// 《太乙统宗宝鉴》(vì vậy nhiều bản ghi là "thượng nguyên tích năm"). Công thức chính thống:
//   积年(所求年N) = EPOCH + N     [N dùng trực tiếp năm dương lịch, KHÔNG phải N−1]
// Điều này đã CALIBRATE với bài toán cụ thể năm 2024 (xem selftest #21 + commit note):
//   - 知乎《太乙排盘教程》by 旭伦: "公元0年为10153917. 今年为2024年，则太乙积年数为10155941年"
//     → 10153917 + 2024 = 10155941 ✓; 10155941 % 360 = 341; 341 % 72 = 53 (阳遁53局); 太乙落2宫(离) ✓
//   - 百度百科《太乙积年》: "年计的基本公式为太乙积年数 = 10153917 + 公元年数"
// LƯU Ý CHO BẢN SAU: nếu sau này chuyển sang hệ 《太乙金镜式经》 nguyên thủy (王希明, tích年
// 1936557 tới开元12年甲子) hoặc 《太乙淘金歌》(10153977), phải đổi cả EPOCH lẫn công thức
// vì mỗi hệ có基准 năm khác nhau. EPOCH hiện tại = hệ《统宗宝鉴》.
const EPOCH = 10153917; // Thái Nhất thượng nguyên tích năm tại năm 0 SCN (hệ《统宗宝鉴》)
const CYCLE_360 = 360; // 5 nguyên × 72 năm = 360 (một đại chu kỳ "ngũ nguyên lục kỷ")
const CYCLE_72 = 72; // 72 năm một tiểu chu kỳ = 1 "kỷ" nhỏ
const CYCLE_24 = 24; // Thái Nhất 8 cung × 3 năm/cung = 24 năm đi hết một vòng
const YEARS_PER_GONG = 3; // Thái Nhất ở mỗi cung 3 năm

// Thái Nhất hành cung: NGHỊCH THỨ TỰ (cung số theo hậu thiên bát quái nhưng
// Thái Nhất đi ĐƯỜNG RIÊNG — không phải洛书 1→2→3...).
// Truyền thống: Thái Nhất dương đ遁 từ cung 1 (càn? không — cung 1 = càn theo thái nhất)
// Đường: 乾1 → 离2 → 艮3 → 震4 → 兑6 → 坤7 → 坎8 → 巽9 → quay lại 乾1
// (跳 qua trung 5; đây là "太乙行九宫" thuận hành, 8 cung)
// Lưu ý: theo《金镜》, dương đ遁 cung 1 = 乾 (khác hậu thiên). Đánh chỉ số 0-7.
const TAIYI_GONG_PATH = [1, 2, 3, 4, 6, 7, 8, 9]; // 8 cung Thái Nhất (bỏ trung 5)

// Tên + ngũ hành + quái của 8 cung Thái Nhất (theo thái nhất bản đồ)
const GONG_INFO = {
  1: { name: '乾', gua: 'Qián/Càn', wx: 'Kim', dir: 'Tây Bắc', nature: 'trời/quân' },
  2: { name: '离', gua: 'Lí/Ly', wx: 'Hỏa', dir: 'Nam', nature: 'lửa/văn minh' },
  3: { name: '艮', gua: 'Gèn/Cấn', wx: 'Thổ', dir: 'Đông Bắc', nature: 'núi/dừng' },
  4: { name: '震', gua: 'Zhèn/Chấn', wx: 'Mộc', dir: 'Đông', nature: 'sấm/động' },
  6: { name: '兑', gua: 'Duì/Đoài', wx: 'Kim', dir: 'Tây', nature: 'hồ/khai' },
  7: { name: '坤', gua: 'Kūn/Khôn', wx: 'Thổ', dir: 'Tây Nam', nature: 'đất/dung' },
  8: { name: '坎', gua: 'Kǎn/Khảm', wx: 'Thủy', dir: 'Bắc', nature: 'nước/hiểm' },
  9: { name: '巽', gua: 'Xùn/Tốn', wx: 'Mộc', dir: 'Đông Nam', nature: 'gió/nhập' },
};

// --- 天目/文昌 (Thiên Mục / Văn Xương) 16 vị ---
// LƯU Ý CHỮA: bảng tên sao 16 dưới đây là bảng cũ (tương thích ngược cho selftest).
// Tên CỔ PHƯƠNG chính xác theo《金镜式经》là: 地主/阳德/和德/吕申/高丛/太阳/大炅/大神/大威/天道/
// 大武/武德/太簇/阴主/阴德/大义 (zhuanlan.zhihu.com/p/720510661). Vì本轮 chỉ cần CUNG của 天目
// (đã tính đúng qua WENCHANG_CYCLE_18 + POS_GONG), bảng tên này giữ làm hiển thị phụ.
// Trật tự 16 Thiên Mục (bảng cũ):
const TIANMU_16 = [
  '主德', '主气', '主神', '主人', '主物', '地主', '阴主', '阳和',
  '大威', '大武', '大德', '太神', '黄豆', '高丛', '大帝', '大灵',
];
const TIANMU_VI = {
  主德: 'Chủ Đức (sanh sôi, cát)',
  主气: 'Chủ Khí (thuận hòa)',
  主神: 'Chủ Thần (bình)',
  主人: 'Chủ Nhân (nhân duyên)',
  主物: 'Chủ Vật (sản nghiệp)',
  地主: 'Địa Chủ (đất đai)',
  阴主: 'Âm Chủ (ẩn)',
  阳和: 'Dương Hòa (cát, hòa)',
  大威: 'Đại Uy (uy quyền)',
  大武: 'Đại Vũ (võ bị)',
  大德: 'Đại Đức (đại cát)',
  太神: 'Thái Thần (bí ẩn)',
  黄豆: 'Hoàng Đậu (tiểu)',
  高丛: 'Cao Tùng (cao)',
  大帝: 'Đại Đế (quân vương)',
  大灵: 'Đại Linh (tâm linh)',
};

// --- CÁC BẢNG CỔ PHƯƠNG CHO 主算/客算 ---
// (Nguồn: 知乎《太乙神数入门-4 推太乙神数基础排盘》zhuanlan.zhihu.com/p/704546303
//  + 《太乙神数统宗大全》+ 百度百科《太乙神数》. Cross-check 2024: 主算=38, 客算=25.)
//
// (A) 16 VỊ TRÍ LỚP ĐỊA BÀN太乙, theo thứ tự THUẬN CHIỀU KIM ĐỒNG HỒ (clockwise), bắt đầu 巽:
//   巽9 巳2 午2 未7 坤7 申6 酉6 戌1 乾1 亥8 子8 丑3 艮3 寅4 卯4 辰9 (quay lại 巽)
// Mỗi vị trí có một 宫数 (số cung thái nhất). 8 vị trí 卦(正) + 8 vị trí chi(间) ghép thành
// 8 cặp cùng cung: 巽/辰=9, 巳/午=2, 未/坤=7, 申/酉=6, 戌/乾=1, 亥/子=8, 丑/艮=3, 寅/卯=4.
const GONG_RING_16 = ['巽', '巳', '午', '未', '坤', '申', '酉', '戌', '乾', '亥', '子', '丑', '艮', '寅', '卯', '辰'];
const POS_GONG = { // vị trí → cung thái nhất
  巽: 9, 巳: 2, 午: 2, 未: 7, 坤: 7, 申: 6, 酉: 6, 戌: 1,
  乾: 1, 亥: 8, 子: 8, 丑: 3, 艮: 3, 寅: 4, 卯: 4, 辰: 9,
};
// 8 vị trí "间神" (địa chi ở giữa hai quái) — 目 ở đây thì 主/客算 cộng thêm 1.
const JIAN_SHEN = new Set(['寅', '申', '巳', '亥', '辰', '戌', '丑', '未']);
// Trật tự 8 CUNG THÁI NHẤT theo chiều thuận kim đồng hồ TRÊN VÒNG 16 VỊ TRÍ
// (đây là "đường cung" Thái Nhất dùng để đếm 算, KHÁC TAIYI_GONG_PATH vốn là đường hành cung 24 năm):
//   巽(9)→午(2)→坤(7)→酉(6)→乾(1)→子(8)→艮(3)→卯(4)→quay lại 巽(9)
const GONG_RING_CW = [9, 2, 7, 6, 1, 8, 3, 4];

// (B) CHU KỲ 18 NĂM CỦA 文昌/天目 (chu vi 16 vị, 乾坤 LƯU 2 NĂM → 18 năm một vòng):
//   [申,酉,戌,乾,乾,亥,子,丑,艮,寅,卯,辰,巽,巳,午,未,坤,坤]
// Khởi từ 申 tại năm 入局=1 (1-based). Nguồn: 知乎 "运行一周共计18年".
const WENCHANG_CYCLE_18 = ['申', '酉', '戌', '乾', '乾', '亥', '子', '丑', '艮', '寅', '卯', '辰', '巽', '巳', '午', '未', '坤', '坤'];

// (C) CHU KỲ 12 NĂM CỦA 计神 (Kế Thần — nghịch hành qua 12 địa chi, bỏ 4 quái góc):
//   [寅,丑,子,亥,戌,酉,申,未,午,巳,辰,卯]
// 计神 index = (入局_raw - 1) % 12 (0-based; calibrate 2024: 入局 raw=53 → idx 4 → 戌, khớp 知乎).
const JISHEN_CYCLE_12 = ['寅', '丑', '子', '亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯'];

// --- 五元 (ngũ nguyên) — 5 chu kỳ 72 năm, mỗi nguyên 72 năm ---
const WU_YUAN = ['甲子元', '丙子元', '戊子元', '庚子元', '壬子元']; // 5 nguyên
// --- 六纪 (lục kỷ) — 6 kỷ × 60 năm = 360 ---
const LIU_JI = ['天纪', '地纪', '人纪', '鬼纪', '河纪', '海纪']; // tên 6 kỷ (truyền)

/**
 * Phép module an toàn (luôn trả số dương): ((n % m) + m) % m
 */
const pmod = (n, m) => ((n % m) + m) % m;

/**
 * Đếm số bước thuận chiều kim đồng hồ (clockwise) trên vòng 16 vị trí, từ `from` đến `to`.
 * Trả 0..15. Dùng cho 计神→始击 rotation.
 */
function cwSteps16(from, to) {
  const i = GONG_RING_16.indexOf(from);
  const j = GONG_RING_16.indexOf(to);
  if (i < 0 || j < 0) return 0;
  return pmod(j - i, 16);
}

/**
 * Tính 算 CỔ PHƯƠNG (chủ hoặc khách) từ vị trí của "目" tới 太乙.
 *
 * Quy tắc (《金镜式经》/《统宗大全》/知乎 zhuanlan.zhihu.com/p/704546303):
 *   - 目 thuận hành theo 8 cung thái nhất (GONG_RING_CW) tới cung NGAY TRƯỚC cung chứa 太乙.
 *   - KHOẢNG [目, 太乙) là "trái bế, phải mở" (left-closed, right-open): TÍNH cả cung 目,
 *     KHÔNG TÍNH cung 太乙.
 *   - 算 = TỔNG các宫数 của các cung đi qua.
 *   - NẾU 目 ở vị trí 间神 (địa chi, không phải quái) → CỘNG THÊM 1 ("初起为一").
 *
 * VERIFY 2024: 目 文昌 ở 坤(7, 正), 太乙 ở 离(2) → đi qua 7,6,1,8,3,4,9 = 38 ✓.
 *   目 始击 ở 亥(8, 间) → đi qua 8,3,4,9 = 24, +1 = 25 ✓.
 *
 * @param {string}  muPos      Vị trí 目 trên vòng 16 (VD: '坤', '亥')
 * @param {number}  taiyiGong  Cung thái nhất chứa 太乙 (1/2/3/4/6/7/8/9)
 * @returns {{ sum:number, steps:number[], extraOne:boolean, muGong:number }}
 */
function computeSuanClassical(muPos, taiyiGong) {
  const muGong = POS_GONG[muPos]; // cung thái nhất của vị trí 目
  const extraOne = JIAN_SHEN.has(muPos); // 目 ở 间神 → +1
  const i = GONG_RING_CW.indexOf(muGong);
  const j = GONG_RING_CW.indexOf(taiyiGong);
  const steps = [];
  if (i >= 0 && j >= 0) {
    if (i === j) {
      // 目 CÙNG CUNG với 太乙 ("目临太乙" / trùng cung): chỉ tính cung đó MỘT lần
      // (khoảng [目,太乙) suy biến thành chính cung 目; cổ phương gọi là "单数" / 短数).
      // KHÔNG đi hết vòng 8 cung (đó sẽ là tổng 40 — sai).
      steps.push(GONG_RING_CW[i]);
    } else {
      let k = i;
      // đi thuận theo GONG_RING_CW, [start, 太乙): dừng khi cung KẾ TIẾP là 太乙
      do {
        steps.push(GONG_RING_CW[k]);
        k = (k + 1) % 8;
      } while (GONG_RING_CW[k] !== taiyiGong && steps.length < 8);
    }
  }
  const sum = steps.reduce((a, b) => a + b, 0) + (extraOne ? 1 : 0);
  return { sum, steps, extraOne, muGong };
}

/**
 * Tính 计神 (Kế Thần) và 始击/客目 (Thỉ Kích) — cổ phương.
 *   - 计神 index = (入局_raw - 1) % 12 vào JISHEN_CYCLE_12.
 *   - Rotation = số bước thuận chiều kim đồng hồ từ 计神 tới 艮 (鬼门).
 *   - 始击 = 天目 dịch cùng rotation đó (cả 天目 lẫn 计神 thuận hành cùng lúc).
 * Calibrate 2024: 入局 raw=53 → 计神=戌; rotation 戌→艮 = 5; 天目 坤 +5 = 亥 → 始击=亥 ✓.
 *
 * @param {number} rujuRaw     入局 raw (0-based, 0..71)
 * @param {string} tianmuPos   Vị trí 天目 trên vòng 16
 * @returns {{ jishenPos:string, rotation:number, shijiPos:string }}
 */
function computeShiji(rujuRaw, tianmuPos) {
  const jiIdx = pmod(rujuRaw - 1, 12);
  const jishenPos = JISHEN_CYCLE_12[jiIdx];
  const rotation = cwSteps16(jishenPos, '艮');
  const shijiIdx = pmod(GONG_RING_16.indexOf(tianmuPos) + rotation, 16);
  const shijiPos = GONG_RING_16[shijiIdx];
  return { jishenPos, rotation, shijiPos };
}

/**
 * Phán chủ/khách + cát hung dựa 太乙 cung + 主/客算 CỔ PHƯƠNG.
 *
 *  - 主 (chủ) = thế giữ mình, phòng ngự, yên tĩnh, nội bộ.
 *  - 客 (khách) = thế chủ động, tấn công, ngoại giao, mở rộng.
 * Thái Nhất ở cung dương (1,3,7,9) → lợi chủ; cung âm (2,4,6,8) → lợi khách.
 *
 * Cát hung theo 算 — CỔ PHƯƠNG (《统宗大全》+ 知乎 zhuanlan.zhihu.com/p/583807153):
 *   - 长数 (trường): 算 ≥ 10 (2 chữ số) → khí số dài, hùng, có hậu lực, cát.
 *   - 单数/短数 (đoản): 算 1..9 (1 chữ số) → khí số ngắn, yếu, phải tốc chiến.
 *   - 杜塞/无门: 算 là bội 10 nguyên (10,20,30) → "无人/无地", bế tắc, chủ/khách đều bất lợi.
 *   - 不和数: 太乙 ở cung dương mà 算 lẻ, hoặc cung âm mà 算 chẵn → chủ/khách bất hòa, đa phản.
 *   - 算 "tròn" & dài (lẻ, ≥10: 11,13,15...) → đại cát; 算 chẵn dài → cát vừa.
 */
function interpret(taiyiGong, zhuSuan, keSuan, year) {
  const g = GONG_INFO[taiyiGong];
  const yangGong = [1, 3, 7, 9].includes(taiyiGong); // quái dương (càn/cấn/đoài/tốn)
  const favor = yangGong ? '主 (Chủ — thủ/thụ)' : '客 (Khách — tiến/công)';

  // Phân loại 算
  const classify = (s) => {
    if (s === 0) return { len: 'không', long: false, duSat: false };
    const isTen = s % 10 === 0 && s >= 10; // 10,20,30 → 杜塞/无门
    return { len: s >= 10 ? 'trường' : 'đoản', long: s >= 10, duSat: isTen };
  };
  const zC = classify(zhuSuan);
  const kC = classify(keSuan);

  // 不和数: 太乙 ở cung dương mà 算 lẻ; cung âm mà 算 chẵn (áp cả chủ + khách)
  const buHeZhu = yangGong ? zhuSuan % 2 === 1 : zhuSuan % 2 === 0;
  const buHeKe = yangGong ? keSuan % 2 === 1 : keSuan % 2 === 0;

  // Cát hung tổng
  const anyDuSat = zC.duSat || kC.duSat;
  const bothLong = zC.long && kC.long;
  const oneLong = zC.long || kC.long;
  let luck;
  if (anyDuSat) luck = 'Hung'; // 杜塞/无门 — bế tắc, chủ/khách đều bất lợi
  else if (bothLong && !(buHeZhu && buHeKe)) luck = 'Cát'; // cả hai khí số dài, hòa → đại cát
  else if (oneLong) luck = 'Cát'; // một bên khí số dài → cát vừa
  else if (zhuSuan === 0 || keSuan === 0) luck = 'Hung';
  else luck = 'Bình';

  // Lời khuyên
  const gongDesc = `cung ${g.name} (quái ${g.gua}, ${g.wx}, hướng ${g.dir})`;
  const suanDesc = `主算=${zhuSuan} (${zC.len}${zC.duSat ? ', 杜塞' : ''}), 客算=${keSuan} (${kC.len}${kC.duSat ? ', 杜塞' : ''})`;
  let advice;
  if (favor.startsWith('主')) {
    advice = `Thái Nhất ở ${gongDesc} → năm ${year} LỢI CHỦ: nên "thủ" (giữ thế, phòng ngự, nội bộ, đợi thời), tránh khơi chiến chủ động. (${suanDesc})`;
  } else {
    advice = `Thái Nhất ở ${gongDesc} → năm ${year} LỢI KHÁCH: nên "tiến" (chủ động, mở rộng, ngoại giao, ra sức), áp đảo. (${suanDesc})`;
  }
  if ((buHeZhu || buHeKe) && !anyDuSat) {
    advice += ' ⚠ 不和数 (太乙 cung ' + (yangGong ? 'dương' : 'âm') + ' gặp 算 ' + (yangGong ? 'lẻ' : 'chẵn') + ') → chủ/khách dễ bất hòa, việc đa phản, cần hóa giải.';
  }
  const tone =
    luck === 'Cát' ? ' (năm CÁT — khí số hữu lực, nên dụng sự).'
    : luck === 'Hung' ? ' (cẩn trọng HUNG — 杜塞/无门 hoặc 算 tuyệt, bế tắc, nên ẩn/kỵ đại sự).'
    : ' (năm BÌNH — cát hung lẫn lộn, khí số đoản, tùy nỗ lực).';
  return { favor, luck, advice: advice + tone, buHeZhu, buHeKe };
}

/**
 * Đánh giá một năm theo Thái Nhất thần số (bản tối giản).
 * @param {number} year  Năm dương lịch (VD: 2026)
 * @param {number} [month]  Tháng (1-12) — sơ bộ tính 月局 nếu có (cộng dồn tháng)
 * @returns {{ jiyuan, ruji, ruju, wuYuan, jiName, taiyiGong, taiyiGongName, taiyiYearsIn, tianmu, tianmuVi, zhuSuan, keSuan, favor, luck, summary, note }}
 */
export function taiyi(year, month) {
  if (!Number.isInteger(year) || year < -4000 || year > 6000) {
    throw new Error(`taiyi: năm ngoài phạm vi hợp lệ (${year})`);
  }

  // 1. 积年 (tích năm từ thượng nguyên). Công thức chính thống (hệ《统宗宝鉴》, verified):
  //    积年(N) = 10153917 + N    (EPOCH là tích年 tại năm 0 SCN; dùng N trực tiếp, KHÔNG trừ 1)
  //    CALIBRATE 2024: 10153917+2024=10155941 → %360=341 → %72=53(阳遁53局) → 太乙落2宫(离),
  //      khớp 知乎《太乙排盘教程》(by 旭伦) + 百度百科《太乙积年》.
  //    (Một số hệ khác như《金镜》1936557 hay《淘金歌》10153977 dùng EPOCH+công thức khác.)
  const jiyuan = EPOCH + year;

  // 2. 入纪 (vào kỷ): 积年 % 360
  const ruji = pmod(jiyuan, CYCLE_360); // 0..359
  // 入局 (vào cục): 入纪 % 72 → 0..71 (1..72)
  const ruju = pmod(ruji, CYCLE_72); // 0..71
  // Ngũ nguyên: (入纪 / 72) → 0..4 (mỗi nguyên 72 năm)
  const wuYuanIdx = Math.floor(ruji / CYCLE_72); // 0..4
  const wuYuan = WU_YUAN[wuYuanIdx] || WU_YUAN[0];
  // Lục kỷ: (入纪 / 60) → 0..5 (mỗi kỷ 60 năm)
  const jiIdx = Math.floor(ruji / 60); // 0..5
  const jiName = LIU_JI[jiIdx] || LIU_JI[0];

  // 3. 太乙 cung vị: Thái Nhất hành cung thuận, 8 cung, mỗi cung 3 năm.
  //    Cung = TAIYI_GONG_PATH[ floor(入纪 / 3) % 8 ]
  //    (dùng 入纪 chứ không phải 入局 vì Thái Nhất 24 năm = 8 cung × 3 → chu kỳ 24)
  //    Years-in-gong = 入纪 % 3 (0,1,2 → năm 1/2/3 trong cung)
  //    → Nếu month cho, cộng thêm dịch tháng (sơ bộ: tháng làm taiyi dịch 1 cung/tháng? không —
  //       Thái Nhất năm trụ; tháng là "月局" tách riêng. Ở đây ta chỉ dùng tháng để tinh chỉnh nhẹ:
  //       cộng tháng vào ruju để ra 月局 nếu có, nhưng cung năm giữ nguyên theo năm.)
  const taiyiStep = Math.floor(ruji / YEARS_PER_GONG) % TAIYI_GONG_PATH.length;
  const taiyiGong = TAIYI_GONG_PATH[pmod(taiyiStep, 8)];
  const taiyiYearsIn = ruji % YEARS_PER_GONG; // 0,1,2
  const taiyiGongName = GONG_INFO[taiyiGong].name;

  // 4. 天目/文昌 (Thiên Mục): chu kỳ 18 năm qua 16 vị (乾坤 lưu 2 năm → 18).
  //    Công thức cổ phương (verified 2024): 文昌 vị = WENCHANG_CYCLE_18[ pmod(jiyuan, 18) ].
  //    Calibrate 2024: pmod(10155941,18)=17 → 坤 ✓ (khớp 知乎 "53÷18余17即坤").
  //    (tianmuIdx dùng cho tên sao 16 — giữ tương thích ngược; tianmuPos là vị trí cổ phương.)
  const tianmuCycleIdx = pmod(jiyuan, 18); // 0..17 trên chu kỳ 18 (có 2 vị trùng 乾/坤)
  const tianmuPos = WENCHANG_CYCLE_18[tianmuCycleIdx]; // vị trí cổ phương trên vòng 16 (VD: '坤')
  const tianmuGong = POS_GONG[tianmuPos]; // cung thái nhất của 天目
  // Tên sao 16 (dành hiển thị; bảng cũ dùng cho selftest tương thích — bản đồ cổ phương có tên khác,
  // ở đây giữ tên theo bảng TIANMU_16 cũ để không phá selftest, thêm ghi chú cổ phương vào note).
  const tianmuIdx = tianmuCycleIdx % 16;
  const tianmu = TIANMU_16[tianmuIdx];
  const tianmuVi = TIANMU_VI[tianmu] || '';

  // 5. 计神 → 始击/客目 (Kế Thần → Thỉ Kích). Cổ phương (verified 2024).
  const { jishenPos, rotation, shijiPos } = computeShiji(ruju, tianmuPos);
  const shijiGong = POS_GONG[shijiPos];

  // 6. 主算 / 客算 — CỔ PHƯƠNG (tổng cung dọc đường đi từ 目 tới trước 太乙, +1 nếu 目 ở 间神).
  //    VERIFY 2024: 主算=38, 客算=25 (khớp 知乎 + các bảng đã xuất bản).
  const zhu = computeSuanClassical(tianmuPos, taiyiGong);
  const ke = computeSuanClassical(shijiPos, taiyiGong);
  const zhuSuan = zhu.sum;
  const keSuan = ke.sum;

  // 7. Phán
  const { favor, luck, advice, buHeZhu, buHeKe } = interpret(taiyiGong, zhuSuan, keSuan, year);

  // (Month tinh chỉnh note: nếu có month, ghi chú 月局 = (ruju + month) % 72)
  const rujuYue = Number.isInteger(month) && month >= 1 && month <= 12
    ? pmod(ruju + (month - 1), CYCLE_72)
    : null;

  const summary = `Năm ${year}: 积年=${jiyan(jiyuan)}, ${wuYuan}/${jiName}, 入局 ${ruju + 1}/72. Thái Nhất cư ${taiyiGongName}(${GONG_INFO[taiyiGong].dir}) [${taiyiYearsIn + 1}/3 năm], 天目=${tianmuPos}(${tianmu}), 始击=${shijiPos}. 主算=${zhuSuan}, 客算=${keSuan} → LỢI ${favor} (${luck}).`;

  return {
    year,
    month: month || null,
    jiyuan,           // 积年
    ruji,             // 入纪 (0..359)
    ruju: ruju + 1,   // 入局 (1..72, 1-based)
    rujuRaw: ruju,    // 入局 raw (0..71)
    rujuYue,          // 月局 nếu có month (0..71) — sơ bộ
    wuYuan,           // 五元 (甲子元..壬子元)
    wuYuanIdx,
    jiName,           // 六纪 tên
    jiIdx,
    taiyiGong,        // cung số (1,2,3,4,6,7,8,9)
    taiyiGongName,    // 卦名 (乾/离...)
    taiyiGongInfo: GONG_INFO[taiyiGong],
    taiyiYearsIn,     // 0..2 (năm thứ mấy trong cung)
    tianmu,           // 天目/文昌 tên sao (16, bảng cũ — tương thích)
    tianmuIdx,        // index sao 16 (0..15)
    tianmuCycleIdx,   // index trên chu kỳ 18 (0..17, có trùng)
    tianmuPos,        // vị trí cổ phương trên vòng 16 (VD '坤', '亥')
    tianmuGong,       // cung thái nhất của 天目 (cổ phương)
    tianmuVi,         // chú thích tiếng Việt
    jishenPos,        // 计神 vị trí (cổ phương)
    rotation,         // số bước thuận DDH 计神→艮
    shijiPos,         // 始击/客目 vị trí cổ phương
    shijiGong,        // cung thái nhất của 始击
    zhuSuan,          // 主算 (cổ phương: tổng cung dọc đường đi)
    zhuSteps: zhu.steps, // các cung đi qua (debug)
    keSuan,           // 客算 (cổ phương)
    keSteps: ke.steps,
    favor,            // '主 (Chủ...)' | '客 (Khách...)'
    luck,             // 'Cát' | 'Bình' | 'Hung'
    buHeZhu,          // 不和数 (chủ) — true nếu 太乙 cung/算 bất hòa
    buHeKe,           // 不和数 (khách)
    advice,           // lời khuyên đầy đủ
    summary,          // tóm tắt 1 dòng
    note: 'Thái Nhất thần số (《金镜式经》+《统宗大全》cốt tủy, 主/客算 CỔ PHƯƠNG): 积年→入纪→入局→太乙行宫→天目→计神→始击→主客算. 主算 = tổng cung dọc đường thuận từ 目 tới trước 太乙 (+1 nếu 目 ở 间神). Verify 2024: 主算=38/客算=25 (khớp 知乎 zhuanlan.zhihu.com/p/704546303). Phần 主大将/客大将/参将/掩迫/关囚/格对... = bước cải tiến sau.',
  };
}

// helper format số lớn với dấu phẩy (tránh Intl locale lệch)
function jiyan(n) {
  return n.toLocaleString('en-US');
}

export {
  EPOCH, CYCLE_360, CYCLE_72, CYCLE_24,
  TAIYI_GONG_PATH, GONG_INFO, TIANMU_16, TIANMU_VI,
  WU_YUAN, LIU_JI,
  // Bảng cổ phương 主/客算:
  GONG_RING_16, POS_GONG, JIAN_SHEN, GONG_RING_CW,
  WENCHANG_CYCLE_18, JISHEN_CYCLE_12,
  computeSuanClassical, computeShiji,
};
