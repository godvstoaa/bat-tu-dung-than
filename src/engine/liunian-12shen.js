// ============================================================================
//  LƯU NIÊN 12 THẦN SÁT 流年十二神煞 (四利三元 · 李淳风)
//  Bổ sung cho src/engine/liunian-shen.js (bản cơ bản chỉ có 12 thần chính).
//  Module này thêm:
//    - subStar (phụ tinh) cho từng vị trí: 剑锋/伏尸, 青龙, 地丧, 地官符, 官符,
//      小耗, 大耗, 紫微, 天雄, 卷舌, 天狗, 三方.
//    - output shape đầy đủ: { position, spirit, subStar, vi, viSub, tone,
//      meaning, advice }.
//    - analyzeLiunian12(R, scanYear): quét toàn bộ 12 vị trí cho một năm,
//      chỉ ra thần của chính chủ + 2 bên kề (tuổi kế cận).
//
//  Định thức vị trí (godIdx = (birthIdx - yearIdx) mod 12):
//    0 太岁(剑锋/伏尸)  1 太阳(青龙)      2 丧门(地丧)
//    3 太阴(地官符)     4 五鬼/官符(官符)  5 死符(小耗)
//    6 岁破(大耗)       7 龙德(紫微)      8 白虎(天雄)
//    9 福德(卷舌)       10 吊客(天狗)     11 病符(三方)
//
//  Lưu ý: đây là 1 lớp tín hiệu thần sát (thông thường 通胜), KHÔNG thay thế
//  phân tích Bát Tự lưu niên (Thập thần/Dụng thần) hay Đại vận. Luôn kết hợp.
// ============================================================================
import { ZHI_ORDER } from './liunian-shen.js';

// Sơ đồ 12 vị trí: main spirit + sub-star (phụ tinh), vi, tone, meaning, advice.
// godIdx 0..11 khớp thứ tự LIUNIAN_GODS trong liunian-shen.js để giữ nhất quán.
export const LIUNIAN_12_SPIRITS = [
  {
    position: 0,
    spirit: '太岁',
    subStar: '剑锋 / 伏尸',
    vi: 'Thái Tuế',
    viSub: 'Kiếm Phong / Phục Thi',
    tone: 'hung',
    meaning:
      '“太岁当头坐，无喜恐有祸.” Năm trùng chi (本命年) hoặc trực thái tuế: biến động lớn, dễ bệnh/tai nạn/tiểu nhân, cản trở kế hoạch lớn. Kiếm Phong chủ đao thương, Phục Thi chủ ẩn họa sức khoẻ.',
    advice:
      'Bái/An Thái Tuế sau Lập Xuân; mang con giáp tam hợp (Không mang chính chi); giữ điều độ, không động thổ phương Thái Tuế, quyết định lớn nên hoãn hoặc cân nhắc kỹ; khám sức khoẻ định kỳ.',
  },
  {
    position: 1,
    spirit: '太阳',
    subStar: '青龙',
    vi: 'Thái Dương',
    viSub: 'Thanh Long',
    tone: 'cat',
    meaning:
      'Nam tinh cát: sự nghiệp cao cường, quang minh, dễ được tiến cử/thăng tiến, danh vọng tăng. Thanh Long chủ mừng vui, thêm người mới (cưới, sinh, thăng). Nữ: dương khí quá thịnh, dễ mệt/nhược (dương sát).',
    advice:
      'Nam: tiến thủ công khai, ra mắt dự án, mở rộng quan hệ, đăng ký thi cử/thi thăng chức. Nữ: giữ sức khoẻ, tránh nắng gắt, kết hợp năng lượng âm (nghỉ ngơi, dinh dưỡng) để cân bằng.',
  },
  {
    position: 2,
    spirit: '丧门',
    subStar: '地丧',
    vi: 'Táng Môn',
    viSub: 'Địa Táng',
    tone: 'hung',
    meaning:
      'Chủ hiếu phục/khóc loạn, tang tế, ảnh hưởng sức khoẻ người lớn tuổi trong nhà. Địa Táng加重 điềm buồn, hao tốn vì tang tế/việc thương tâm.',
    advice:
      'Quan tâm sức khoẻ người lớn tuổi (khám định kỳ); hạn chế viếng heavy/tang tế không cần thiết; tích đức, từ thiện; tránh đầu tư lớn những tháng kiêng kỵ.',
  },
  {
    position: 3,
    spirit: '太阴',
    subStar: '地官符',
    vi: 'Thái Âm',
    viSub: 'Địa Quan Phù',
    tone: 'cat', // [cycle 48 M2] 太阴 = cát thần (theo 通胜/李淳风四利三元), đồng bộ với liunian-shen.js (trước đây 'mid' → mâu thuẫn 12-thần)
    meaning:
      'Nữ tinh: nữ giới được tài lộc/âm trợ, nam giới được vợ/âm nhân giúp đỡ, tài lộc nhẹ. Nhưng Địa Quan Phù chủ việc quan phi/sổ sách nhẹ, dễ dính giấy tờ.',
    advice:
      'Phát huy giao tế nữ giới, đầu tư ổn định; cẩn thận giấy tờ pháp lý/hợp đồng nhỏ, giữ sổ sách rõ ràng; nữ tận dụng năm nâng đỡ để phát triển.',
  },
  {
    position: 4,
    spirit: '五鬼',
    subStar: '官符',
    vi: 'Ngũ Quỷ (Quan Phù)',
    viSub: 'Quan Phù',
    tone: 'hung',
    meaning:
      'Chủ quan phi, khiếu nại, khẩu thiệt, tranh chấp, tiểu nhân giật dây. Ngũ Quỷ thêm rắc rối âm thầm, hao tiền vì kiện tụng/việc không đâu.',
    advice:
      'Ký kết hợp đồng cẩn thận, tránh tranh chấp; nhẫn nhịn, không cãi vã nơi công cộng; giữ bằng chứng/sổ sách; hoãn việc kiện tụng, hoà giải ưu tiên.',
  },
  {
    position: 5,
    spirit: '死符',
    subStar: '小耗',
    vi: 'Tử Phù',
    viSub: 'Tiểu Hao',
    tone: 'hung',
    meaning:
      'Chủ bệnh/thiên ách/kinh ưu, sức khoẻ giảm. Tiểu Hao chủ hao tiền nhỏ, mất mát nhẹ (đồ đạc, trộm cắp nhỏ, chi phí bất ngờ).',
    advice:
      'Khám sức khoẻ định kỳ, tránh nguy hiểm/vùng núi sông; cẩn thận tài sản nhỏ, khoá cửa, không để tiền mặt nhiều; dưỡng sinh, giảm stress.',
  },
  {
    position: 6,
    spirit: '岁破',
    subStar: '大耗',
    vi: 'Tuế Phá (Đại Hao)',
    viSub: 'Đại Hao',
    tone: 'hung',
    meaning:
      'Xung Thái Tuế (đối cung,差 6 chi): phá tài lớn, biến động, dính thị phi, dễ chia ly/thay đổi công việc/chỗ ở. Đại Hao加重 hao tiền, đầu tư lỗ.',
    advice:
      'Giữ tiền chặt, tuyệt đối không đầu cơ/vay mượn lớn; tránh động thổ phương Tuế Phá; bao dung trong quan hệ, không quyết định bốc đồng; an Thái Tuế/quý nhân phù.',
  },
  {
    position: 7,
    spirit: '龙德',
    subStar: '紫微',
    vi: 'Long Đức',
    viSub: 'Tử Vi',
    tone: 'cat',
    meaning:
      'Quý nhân/逢凶 hóa吉: năm được người trên/quý nhân nâng đỡ, tai nạn giảm, danh tiếng tăng. Tử Vi thêm quyền uy, dễ được đề bạt/cử chọn.',
    advice:
      'Tận dụng quý nhân, tiến thủ vừa phải; mở rộng quan hệ với cấp trên/người lớn tuổi; năm tốt để thăng chức, đổi việc hướng lên, đăng ký học vị/chứng chỉ.',
  },
  {
    position: 8,
    spirit: '白虎',
    subStar: '天雄',
    vi: 'Bạch Hổ',
    viSub: 'Thiên Hùng',
    tone: 'hung',
    meaning:
      'Chủ huyết quang/đao thương/hình thương: dễ chảy máu, tai nạn, phẫu thuật, xe cộ. Thiên Hùng thêm bạo khí, cãi vã leo thang, đột ngột.',
    advice:
      'An toàn giao thông, tránh khu vực nguy hiểm; hoá “blood light” bằng hiến máu/nhổ răng/cạo gió trước năm; cẩn thận dao kéo, kiêng cãi vã lớn, giữ bình tĩnh.',
  },
  {
    position: 9,
    spirit: '福德',
    subStar: '卷舌',
    vi: 'Phúc Đức',
    viSub: 'Quyển Thiệt',
    tone: 'cat',
    meaning:
      '“福德临命宫，百事皆顺通”: phúc lộc, thuận lợi, tâm an, tài lộc đều. Nhưng Quyển Thiệt chủ lời ong tiếng ve, thị phi, tiểu nhân nói sau lưng.',
    advice:
      'Tiến thủ, làm việc thiện (nhân phúc tăng); cẩn thận lời ăn tiếng nói, không nói xấu/nói trước, tránh thị phi nơi công sở; biết ơn, khiêm tốn giữ phúc.',
  },
  {
    position: 10,
    spirit: '吊客',
    subStar: '天狗',
    vi: 'Điếu Khách',
    viSub: 'Thiên Cẩu',
    tone: 'hung',
    meaning:
      'Chủ tang tế/điếu tang, ảnh hưởng sức khoẻ người lớn tuổi. Thiên Cọng chủ hao tiền, tai nạn bất ngờ, ăn đồ hỏng, có khi ảnh hưởng thai nhi/trẻ nhỏ.',
    advice:
      'Cẩn thận sức khoẻ người nhà, đặc biệt người lớn tuổi và trẻ nhỏ; tránh hao tiền vô ích, cẩn thận đồ ăn/tai nạn; tích đức, từ thiện, thăm nom người bệnh.',
  },
  {
    position: 11,
    spirit: '病符',
    subStar: '三方',
    vi: 'Bệnh Phù',
    viSub: 'Tam Phương',
    tone: 'hung',
    meaning:
      'Chủ bệnh nhẹ/mệt mỏi/tâm trạng trầm, sức đề kháng giảm, dễ tái phát bệnh cũ. Tam Phương chủ rắc rối từ bên thứ ba (người khác kéo vào việc không liên quan).',
    advice:
      'Dưỡng sinh, ngủ đủ, giảm stress; khám bệnh cũ định kỳ; tránh dính vào việc của người khác, giữ khoảng cách với drama; dinh dưỡng + vận động vừa phải.',
  },
];

const _BY_SPIRIT = Object.fromEntries(LIUNIAN_12_SPIRITS.map((s) => [s.spirit, s]));

/**
 * Tính thần lưu niên 12 vị trí (kèm phụ tinh) cho 1 người trong 1 năm.
 * @param {string} birthYearZhi - chi năm sinh (vd '酉')
 * @param {string} scanYearZhi   - chi năm xem (vd '午' = 2026)
 * @returns {{ position, spirit, subStar, vi, viSub, tone, meaning, advice, atZhi: string, isMine: true }}
 */
export function liunian12ShenFull(birthYearZhi, scanYearZhi) {
  const birthIdx = ZHI_ORDER.indexOf(birthYearZhi);
  const yearIdx = ZHI_ORDER.indexOf(scanYearZhi);
  if (birthIdx < 0 || yearIdx < 0) {
    throw new Error(`liunian12ShenFull: chi không hợp lệ birth=${birthYearZhi} year=${scanYearZhi}`);
  }
  const godIdx = ((birthIdx - yearIdx) % 12 + 12) % 12;
  const s = LIUNIAN_12_SPIRITS[godIdx];
  return {
    position: godIdx,
    spirit: s.spirit,
    subStar: s.subStar,
    vi: s.vi,
    viSub: s.viSub,
    tone: s.tone,
    meaning: s.meaning,
    advice: s.advice,
    atZhi: birthYearZhi,
    isMine: true,
  };
}

/**
 * Quét toàn bộ 12 vị trí thần lưu niên cho một năm (theo từng chi tuổi),
 * đồng thời xác định thần của chính chủ thể dựa trên R.chart.
 * @param {object} R - kết quả analyze() từ engine/chart.js
 * @param {number|string} scanYear - năm dương lịch cần xem (vd 2026)
 * @returns {{
 *   year: (number),
 *   yearZhi: string,
 *   birthZhi: string,
 *   mine: object,          // liunian12ShenFull() của chính chủ
 *   positions: Array,      // 12 phần tử: mỗi chi tuổi → {spirit,subStar,vi,viSub,tone,atZhi,isMine}
 *   hung: Array, cat: Array, mid: Array,   // nhóm theo tone để cảnh báo/điểm mạnh
 *   note: string
 * }}
 */
export function analyzeLiunian12(R, scanYear) {
  const year = typeof scanYear === 'string' ? parseInt(scanYear, 10) : scanYear;
  const birthZhi = R?.chart?.pillars?.year?.zhi;
  if (!birthZhi) throw new Error('analyzeLiunian12: R.chart.pillars.year.zhi thiếu');

  // chi năm xem theo chu kỳ can-chi (công thức, không cần thư viện, hợp lệ quanh Lập Xuân)
  const yearZhi = ZHI_ORDER[((year - 4) % 12 + 12) % 12];

  const mine = liunian12ShenFull(birthZhi, yearZhi);

  // Quét 12 vị trí: với mỗi chi sinh có thể, vị trí thần cố định theo yearZhi
  const positions = ZHI_ORDER.map((z) => {
    const full = liunian12ShenFull(z, yearZhi);
    return {
      position: full.position,
      spirit: full.spirit,
      subStar: full.subStar,
      vi: full.vi,
      viSub: full.viSub,
      tone: full.tone,
      atZhi: z,
      isMine: z === birthZhi,
    };
  });

  const hung = positions.filter((p) => p.tone === 'hung');
  const cat = positions.filter((p) => p.tone === 'cat');
  const mid = positions.filter((p) => p.tone === 'mid');

  return {
    year,
    yearZhi,
    birthZhi,
    mine,
    positions,
    hung,
    cat,
    mid,
    note:
      'Lưu niên 12 thần sát (李淳风四利三元) — 1 lớp tín hiệu thần sát, tham chiếu 通胜. Kết hợp Bát Tự lưu niên (Thập thần/Dụng thần), 大运 và 紫微流年 để chốt.',
  };
}

export { ZHI_ORDER, _BY_SPIRIT };
