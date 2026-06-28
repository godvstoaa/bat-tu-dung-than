// ============================================================================
//  TIỂU LỤC NHÂM 小六壬 (còn gọi 掐指一算 / 报时起课 / 马前课)
//  Phương pháp bói toán "đếm ngón tay" dân gian phổ biến nhất — đơn giản, nhanh,
//  dùng 6 cung cố định + thuật toán đếm tiến theo (tháng → ngày → giờ).
//
//  Cơ sở: 6 cung theo thứ tự fixed (大安→留连→速喜→赤口→小吉→空亡).
//  Xuất phát từ 大安 (index 0), đếm tiến:
//    - Đếm `month` bước  → tháng cung A   (= vị trí sau khi đếm tháng)
//    - Từ A đếm `day` bước → ngày cung B
//    - Từ B đếm `hour` bước → giờ cung C  (= kết quả cuối)
//  Công thức (đếm 1-indexed, bước đầu trùng cung xuất phát):
//    monthPos = (0 + month - 1) % 6
//    dayPos   = (monthPos + day - 1) % 6
//    hourPos  = (dayPos + hour - 1) % 6
//
//  Nguồn: 小六壬口诀 (đại chúng lưu hành); kết hợp luận giải theo ngũ hành
//  cung + ngữ cảnh sự việc (sự nghiệp / tài lộc / tình duyên / xuất hành /
//  thất vật / bệnh). Đây là phái "Tốc Hỷ" / "Lưu Liên" phổ thông.
// ============================================================================
import { Solar } from 'lunar-javascript';

// ---- 6 CUNG cố định theo thứ tự đếm ----------------------------------------
// index | hán  | vi        | ngũ hành | cát/hung | bản ý
//   0   | 大安 | Đại An    | Mộc      | CÁT      | bình an, ổn định, trôi chảy
//   1   | 留连 | Lưu Liên  | Thủy     | HUNG     | chậm trễ, dây dưa, khó quyết
//   2   | 速喜 | Tốc Hỷ    | Hỏa      | CÁT      | nhanh chóng, tin vui, gặp may
//   3   | 赤口 | Xích Khẩu | Kim      | HUNG     | cãi vã, thị phi, khẩu thiệp
//   4   | 小吉 | Tiểu Cát  | Mộc      | CÁT      | nhỏ nhưng tốt, quý nhân nhỏ giúp
//   5   | 空亡 | Không Vong| Thổ      | HUNG     | hư không, không kết quả, hão
export const POSITIONS = [
  {
    idx: 0, han: '大安', vi: 'Đại An', wx: 'Mộc', tone: 'CÁT', img: '安居',
    element: 'Mộc (mùa xuân, sinh sôi)',
    essence: 'Bình an, ổn định. Sự việc đi vào quỹ đạo, an cư lạc nghiệp. Mộc chủ nhân từ, từ từ mà tiến.',
    general: 'Mọi sự bình an, ổn định, không biến động lớn. Việc đang hỏi sẽ diễn ra trôi chảy, tuy không nhanh đến nhưng chắc chắn. Hợp việc an cư, ký kết, duy trì hiện trạng; kém với việc cần tốc độ.',
    career: 'Sự nghiệp ổn định, công việc trôi chảy, ít biến động. Hợp công chức, vị trí cố định, duy trì nghề nghiệp lâu dài. Không hợp khởi nghiệp mạo hiểm hay đổi việc gấp.',
    wealth: 'Tài lộc đều đặn, vừa phải, không phát bất ngờ nhưng ổn. Nên tích lũy từ từ, tránh đầu cơ mạo hiểm. Sinh lời chậm mà chắc.',
    love: 'Tình cảm bình yên, bền vững. Nếu đang tìm: duyên đến chậm nhưng thật lòng. Nếu đang yêu: ít sóng gió, yên ấm. Cưới hỏi nên tiến hành.',
    travel: 'Xuất hành bình an, thuận lợi, không gặp trở ngại lớn. An toàn trên đường, hợp việc di chuyển nhẹ nhàng.',
    lost: 'Vật thất lạc có thể tìm lại, nằm ở chỗ quen, chỗ thấp hoặc phía đông. Tìm chậm nhưng sẽ thấy, đừng vội.',
    health: 'Bệnh tình nhẹ, không ngại, chủ yếu do lao lực/lo nghĩ. Nghỉ ngơi, an thần sẽ thuyên giảm. Mộc can gan — chú ý giận dữ.',
    advice: 'Nên an tĩnh, kiên nhẫn, giữ gìn hiện trạng. Đừng nóng vội. Việc đến từ từ sẽ thành.',
  },
  {
    idx: 1, han: '留连', vi: 'Lưu Liên', wx: 'Thủy', tone: 'HUNG', img: '迟滞',
    element: 'Thủy (mùa đông, trệ)',
    essence: 'Chậm trễ, dây dưa, kéo dài không dứt. Thủy chủ trí nhưng cũng chủ lưu lại, khó quyết.',
    general: 'Sự việc chậm trễ, dây dưa, khó ngã ngũ trong thời gian ngắn. Dễ phát sinh rắc rối nhỏ kéo dài. Cần kiên nhẫn, không nên ép buộc kết quả sớm.',
    career: 'Công việc đình trệ, tiến độ chậm, dễ vướng thủ tục/paperwork. Thăng tiến bị hoãn. Nên kiên nhẫn chờ thời, tránh thay đổi lớn lúc này.',
    wealth: 'Tiền bạc chậm về, có bị nợ/kẹt lại, khó thu hồi nhanh. Đầu tư tạm dừng, tiền đến trễ. Cẩn thận cho vay — khó đòi.',
    love: 'Tình cảm dây dưa, mập mờ, khó dứt khoát. Duyên kéo dài không tiến. Người cũ dễ quay lại quấy rầy. Cần làm rõ ràng, tránh để lửng.',
    travel: 'Xuất hành bị trễ, tắc đường, đổi kế hoạch. Không thuận, dễ lỡ hẹn. Nên dời ngày nếu được.',
    lost: 'Vật thất lạc khó tìm, có thể đã bị che giấu hoặc ở nơi có nước/phía bắc. Tìm lâu, hy vọng nhỏ.',
    health: 'Bệnh kéo dài dai dẳng, khó khỏi hẳn, dễ tái phát. Thủy chủ thận/bàng quang — chú ý thấp khớp, huyết áp. Cần điều trị kiên trì.',
    advice: 'Tránh quyết định vội, tránh xuất hành/dau vốn lớn. Kiên nhẫn chờ, giải quyết rắc rối dây dưa từng bước.',
  },
  {
    idx: 2, han: '速喜', vi: 'Tốc Hỷ', wx: 'Hỏa', tone: 'CÁT', img: '速喜',
    element: 'Hỏa (mùa hạ, nhanh)',
    essence: 'Nhanh chóng, tin vui, gặp may mắn bất ngờ. Hỏa chủ lễ, chủ sáng, chủ tốc.',
    general: 'Sự việc sẽ mau chóng có kết quả tốt, tin vui đến nhanh, gặp may. Hợp mọi việc cần tốc độ và kết quả tốt. Xuất hành, cầu tài, cầu danh đều thuận.',
    career: 'Sự nghiệp thăng tiến nhanh, có tin vui công việc, được đề bạt/đơn hàng/giao kèo. Nên nắm bắt cơ hội ngay, đừng chần chừ.',
    wealth: 'Tài lộc đến nhanh, có tiền bất ngờ, làm ăn mau thắng. Đầu tư ngắn hạn thuận lợi. Hỏa chủ tài tốc — thu hoạch sớm.',
    love: 'Tình duyên đến nhanh, vui vẻ, có tin vui (hợp, cưới). Gặp người vừa ý bất ngờ. Cảm xúc bùng nổ, tích cực.',
    travel: 'Xuất hành rất thuận, nhanh chóng, gặp may trên đường. Hợp việc đi xa cầu danh/tài.',
    lost: 'Vật thất lạc sẽ tìm thấy nhanh, ở nơi sáng, phía nam, chỗ cao. Tìm gấp sẽ thấy.',
    health: 'Bệnh tình nhanh thuyên giảm, có tin vui (kết quả khám tốt). Hỏa chủ tâm — nhưng cẩn thận sốt/cảm nóng.',
    advice: 'Nắm bắt cơ hội ngay, hành động nhanh. Việc tốt nhưng phải tận thủ thời cơ, chậm sẽ lỡ.',
  },
  {
    idx: 3, han: '赤口', vi: 'Xích Khẩu', wx: 'Kim', tone: 'HUNG', img: '口舌',
    element: 'Kim (mùa thu, sắc bén)',
    essence: 'Cãi vã, thị phi, khẩu thiệp, tranh chấp. Kim chủ nghĩa, chủ sát, lời nói sắc bén gây tổn thương.',
    general: 'Dễ xảy ra cãi vã, thị phi, tranh chấp, lời nói gây hiểu lầm. Cẩn thận giấy tờ/hợp đồng. Nén lời, tránh xung đột, đặc biệt chiều tối.',
    career: 'Công việc có tranh cãi, bất đồng với cấp trên/đồng nghiệp, thị phi phá hoại. Cẩn thận hợp đồng, văn bản. Nên khiêm nhường, né xung đột.',
    wealth: 'Tài lộc bất ổn, dễ hao tiền vì cãi vã/phạt/kiện tụng. Tránh giao dịch lớn, vay mượn dễ sinh tranh chấp. Đầu cơ rủi ro.',
    love: 'Tình cảm cãi vã, ghen tuông, lời nói tổn thương nhau. Dễ vỡ vì thị phi. Cần nhẫn nại, nói lời tử tế, tránh nóng giận.',
    travel: 'Xuất hành không thuận, dễ cãi vã trên đường, rắc rối giấy tờ/thanh tra. Tránh đi xa, đặc biệt chiều tối.',
    lost: 'Vật thất lạc khó tìm, có thể bị mất cắp hoặc ở phía tây/chỗ kim loại. Dễ sinh tranh chấp khi tìm.',
    health: 'Bệnh liên quan khẩu khí/sâu răng/cắt đứt. Kim chủ phế/kim loại — cẩn thận atai, viêm họng, chấn thương sắc bén.',
    advice: 'Nén lời, tránh tranh cãi và thị phi. Hoãn quyết định/giao dịch lớn. Khiêm nhường, nhẫn nhịn qua ngày.',
  },
  {
    idx: 4, han: '小吉', vi: 'Tiểu Cát', wx: 'Mộc', tone: 'CÁT', img: '小吉',
    element: 'Mộc (mùa xuân, hiền)',
    essence: 'Nhỏ nhưng tốt, quý nhân nhỏ giúp, việc vừa phải mà thành. Mộc chủ nhân từ, hòa hợp.',
    general: 'Sự việc tuy không lớn nhưng vẫn tốt, có quý nhân nhỏ phù trợ, kết quả vừa ý. Hợp việc lặt vặt, giao dịch nhỏ, gặp gỡ bạn bè. Khiêm tốn thì tốt hơn.',
    career: 'Sự nghiệp có tiến triển nhỏ, được giúp đỡ từ bạn bè/đồng nghiệp, cơ hội vừa phải. Nên giữ quan hệ tốt, hợp tác nhỏ thắng.',
    wealth: 'Tài lộc nhỏ, đều đặn, đủ dùng. Không phát lớn nhưng không thiếu. Sinh lời từ việc nhỏ, buôn bán vừa. Tiết kiệm là chính.',
    love: 'Tình cảm êm ấm, nhẹ nhàng, có quý nhân se duyên. Duyên đến từ bạn bè/người quen. Không gay gắt nhưng bền.',
    travel: 'Xuất hành thuận, nhẹ nhàng, gặp người giúp đỡ. Hợp việc đi gần, thăm bạn, giao dịch nhỏ.',
    lost: 'Vật thất lạc có thể tìm lại được nhờ người giúp, ở chỗ cây cỏ/phía đông. Hy vọng vừa.',
    health: 'Bệnh nhẹ, có người chăm sóc, mau khỏi. Mộc chủ can — chú ý lo nghĩ, mất ngủ. Thuốc thang vừa phải hiệu quả.',
    advice: 'Khiêm tốn, giữ quan hệ tốt. Việc nhỏ nên làm, đừng tham lớn. Quý nhân nhỏ sẽ giúp — đừng khinh thường.',
  },
  {
    idx: 5, han: '空亡', vi: 'Không Vong', wx: 'Thổ', tone: 'HUNG', img: '空亡',
    element: 'Thổ (vô định, hư)',
    essence: 'Hư không, không kết quả, hão huyền, mất mát. Thổ chủ tín nhưng nơi đây là "không", sự việc rơi vào khoảng trống.',
    general: 'Sự việc khó thành, hão huyền, tốn công vô ích. Kết quả không như ý hoặc trắng tay. Nên hoãn, tránh khởi sự mới, đợi thời khác.',
    career: 'Sự nghiệp bế tắc, công sức đổ sông đổ biển, dễ mất chức/thất bại. Hoãn thay đổi, khởi sự. Đề phòng lừa dối, hứa suông.',
    wealth: 'Tài lộc hao mất, đầu tư thất bại, tiền đến rồi đi. Tránh giao dịch, đầu cơ, cho vay. Đề phòng lừa đảo, trộm cắp.',
    love: 'Tình cảm hão huyền, duyên không thành, lừa dối hoặc vu vơ. Đứt gánh giữa đường. Tránh hứa hẹn, kết hôn lúc này.',
    travel: 'Xuất hành bất lợi, dễ lạc, mất mát, rủi ro. Tránh đi xa, đặc biệt về matters quan trọng.',
    lost: 'Vật thất lạc rất khó tìm, gần như mất hẳn, có thể ở nơi đất/phía giữa. Bỏ cuộc sớm.',
    health: 'Bệnh tình bất lợi, khó chẩn đoán, dễ sai lệch. Thổ chủ tỳ/vị — chú ý tiêu hóa, suy nhược không rõ nguyên nhân.',
    advice: 'HOÃN mọi việc quan trọng. Không khởi sự, không giao dịch lớn, không tin hứa hẹn. Đợi thời khác, cúng bái/an thần.',
  },
];

// Map han → vị trí để tra nhanh
const HAN2POS = Object.fromEntries(POSITIONS.map((p) => [p.han, p]));

// ---- Thuật toán đếm (theo month / day / hour) ------------------------------
// Đầu vào 1-indexed: month 1-12 (âm), day 1-30 (âm), hour 1-12 (1=子时, 12=亥时).
// Xuất phát từ 大安 (idx 0); đếm `n` bước nghĩa là bước đầu trùng cung hiện tại.
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

/**
 * Tiểu Lục Nhâm — bói theo tháng/ngày/giờ âm lịch.
 * @param {number} month tháng âm lịch (1-12). Ngoài khoảng → clamp.
 * @param {number} day   ngày âm lịch (1-30). Ngoài khoảng → clamp.
 * @param {number} hour  số chi giờ (1=子, 2=丑, ..., 12=亥). Ngoài khoảng → clamp.
 * @returns {{
 *   input:{month:number,day:number,hour:number},
 *   stages:{month:{pos,step},day:{pos,step},hour:{pos,step}},
 *   monthResult:object, dayResult:object, hourResult:object,
 *   final:object, finalHan:string, luck:string, verdict:string
 * }}
 */
export function xiaoliuren(month, day, hour) {
  const m = clamp(parseInt(month, 10) || 1, 1, 12);
  const d = clamp(parseInt(day, 10) || 1, 1, 30);
  const h = clamp(parseInt(hour, 10) || 1, 1, 12);

  // Đếm tiến từ大安: tháng → ngày → giờ
  const monthPos = (m - 1) % 6;
  const dayPos = (monthPos + d - 1) % 6;
  const hourPos = (dayPos + h - 1) % 6;

  const monthResult = POSITIONS[monthPos];
  const dayResult = POSITIONS[dayPos];
  const hourResult = POSITIONS[hourPos];

  // Phán chung dựa trên kết quả cuối (giờ cung C) + tương tác 3 cung
  const final = hourResult;
  const luck = final.tone === 'CÁT' ? 'Cát' : 'Hung';

  // Tương tác: nếu cả 3 cung đều cùng tone → tăng cường; nếu lẫn lộn → trung tính
  const tones = [monthResult.tone, dayResult.tone, hourResult.tone];
  const catCount = tones.filter((t) => t === 'CÁT').length;
  let verdict;
  if (final.tone === 'CÁT') {
    if (catCount === 3) verdict = `Đại CÁT — ba cung đều cát (${monthResult.han}→${dayResult.han}→${hourResult.han}): ${final.general}`;
    else verdict = `CÁT — kết quả rơi cung ${final.han} (${final.vi}, ${final.wx}): ${final.general}`;
  } else {
    if (catCount === 0) verdict = `Đại HUNG — ba cung đều hung (${monthResult.han}→${dayResult.han}→${hourResult.han}): ${final.general}`;
    else verdict = `HUNG — kết quả rơi cung ${final.han} (${final.vi}, ${final.wx}): ${final.general}`;
  }

  return {
    input: { month: m, day: d, hour: h },
    stages: {
      month: { pos: monthPos, step: m },
      day: { pos: dayPos, step: d },
      hour: { pos: hourPos, step: h },
    },
    monthResult, dayResult, hourResult,
    final, finalHan: final.han, luck, verdict,
  };
}

// ---- Helper: đổi dương lịch → số âm lịch để bói ----------------------------
// Trả về {month, day, hour} (1-indexed) + label tiếng Hán.
export function solarToXlrNums(year, month, day, hour, minute) {
  const s = Solar.fromYmdHms(year, month, day, hour == null ? 12 : hour, minute == null ? 0 : minute, 0); // [loop 712 FIX] hour||12 nuốt giờ Tý (0 falsy → 12)
  const l = s.getLunar();
  const lmonth = l.getMonth();          // 1-12 (âm)
  const lday = l.getDay();              // 1-30 (âm)
  const hourZhi = l.getTimeZhi();       // 子…亥
  const hourNum = '子丑寅卯辰巳午未申酉戌亥'.indexOf(hourZhi) + 1;
  const label = `${l.getMonthInChinese()}月${l.getDayInChinese()}日 ${hourZhi}时`;
  return { month: lmonth, day: lday, hour: hourNum, label };
}

// ---- Luận giải chi tiết theo loại câu hỏi ----------------------------------
const CAT_KEYS = {
  general: 'general', career: 'career', wealth: 'wealth', love: 'love',
  travel: 'travel', lost: 'lost', health: 'health',
};

/**
 * Bói + luận chi tiết theo loại câu hỏi.
 * @param {number} month  tháng âm (1-12)
 * @param {number} day    ngày âm (1-30)
 * @param {number} hour   số chi giờ (1-12)
 * @param {string} [cat='general']  general|career|wealth|love|travel|lost|health
 */
export function xiaoliurenDetail(month, day, hour, cat = 'general') {
  const r = xiaoliuren(month, day, hour);
  const key = CAT_KEYS[cat] || 'general';
  // Luận theo cung cuối cho loại câu hỏi
  const detail = r.final[key];
  return { ...r, category: cat, categoryKey: key, detail };
}
