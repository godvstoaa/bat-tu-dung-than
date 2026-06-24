// ============================================================================
//  三世书 (三世書) — PAST-PRESENT-FUTURE KARMA READING
//  Văn bản ngụy tác tương truyền do 诸葛亮 (Khổng Minh) soạn, dùng can-chi
//  năm sinh (lục thập hoa giáp) để tra ra "tiền thế" — thân phận kiếp trước,
//  nhân quả, và phúc hoạ kiếp này.
//
//  ★ KHUNG VĂN HOÁ DÂN GIAN — GIẢI TRÍ ★
//    三世书 là văn hoá dân gian, tham khảo giải trí — KHÔNG phải nhận định
//    mệnh lý nghiêm túc như Bát Tự. Nội dung mang tính tượng trưng, khuyên
//    thiện, không dùng để quyết định việc lớn.
//
//  Phương pháp tra cứu phổ thông: dùng NĂM SINH (ÂL) → can-chi lục thập hoa
//  giáp → modulo 12 → 12 thân phận kiếp trước (僧人/官贵/商人/...). Mỗi thân
//  phận có một bài kệ + nhân quả + phúc hoạ kiếp này. Đây là cách triển khai
//  phổ biến nhất của các bản 三世书 in rông rãi (không có bản "chuẩn" duy nhất).
//
//  Tài liệu tham chiếu: 袁天罡/诸葛亮三世书 (các bản phổ thông), plus hệ 12_type
//  được dùng trong mọi bản in dân gian hiện đại.
// ============================================================================

import { Solar } from 'lunar-javascript';
import { chenggu } from './chenggu.js';

// ---------------------------------------------------------------------------
//  12 THÂN PHẬN TIỀN THẾ (lifecycle qua position % 12)
//  Mỗi mục: type (Hán), vi (Việt), location (kinh điển), verse (bài kệ 2 câu),
//  karma (nhân quả — vì sao kiếp này thế), fortune (tài lộc / duyên / sức khoẻ
//  kiếp HIỆN TẠI). Mỗi mục được dùng cho 5 vị trí trong 60 hoa giáp.
//
//  Thứ tự 12 type căn cứ theo bảng 三世流转 phổ thông (tuần hoàn 12 chi).
// ---------------------------------------------------------------------------
const PAST_LIFE_TYPES = [
  {
    type: '僧人', vi: 'Sư tu hành (Tăng nhân)',
    location: 'chùa núi phía Nam (江南山寺)',
    verse: '前世出家修苦行，青灯古佛伴余生。',
    karma: 'Kiếp trước xuất gia tu hành, thanh đăng cổ phật, ít tạo nghiệp sát nhưng vì quá ẩn thế nên duyên thế mỏng.',
    fortune: 'Kiếp này tính tình thanh đạm, ít tranh giành; tài lộc vừa đủ, duyên phần muộn nhưng bền; sức khoẻ khá, hay hướng nội, có tuệ căn.',
  },
  {
    type: '官贵', vi: 'Quan lại quyền quý',
    location: 'kinh thành triều đình (京畿仕途)',
    verse: '前世为官居庙堂，锦衣玉食显门墙。',
    karma: 'Kiếp trước làm quan to, quyền thế, vì giúp dân nên có âm đức; nhưng vì処 thế nhiều nên cũng tạo oan gia.',
    fortune: 'Kiếp này uy vọng tự nhiên, được người kính nể; tài lộc sung túc trung lưu khá, duyên phần đẹp; sức khoẻ tốt nhưng cẩn thận khẩu thiệt.',
  },
  {
    type: '商人', vi: 'Thương nhân buôn bán',
    location: 'thương cảng sông biển (江淮商埠)',
    verse: '前世经商走四方，算铢计两为家忙。',
    karma: 'Kiếp trước đi buôn khắp bốn phương, tính toán từng đồng; có lúc lợi己 hại người, có lúc bố thí.',
    fortune: 'Kiếp này nhạy bén với tiền bạc, khéo kinh doanh; tài lộc qua tay nhiều nhưng giữ khó; duyên nên chọn người đức độ bổ sung; cẩn thận lao lực.',
  },
  {
    type: '农夫', vi: 'Nông phu cày cấy',
    location: 'làng quê đồng ruộng (中原田园)',
    verse: '前世耕耘汗满田，春耕秋收度流年。',
    karma: 'Kiếp trước làm nông, vất vả một nắng hai sương, lương thiện chất phác; ít tạo nghiệp nhưng phúc đức cũng ít.',
    fortune: 'Kiếp này cần mẫn, kiên nhẫn; tài lộc tích lũy từ từ, hậu vận khá; duyên phần an ổn, gia đạo yên ấm; sức khoẻ cần giữ xương khớp.',
  },
  {
    type: '武将', vi: 'Võ tướng chiến trường',
    location: 'biên quan sa trường (边塞沙场)',
    verse: '前世提枪镇边疆，马上功业血染裳。',
    karma: 'Kiếp trước là tướng ra trận, sát nghiệp nặng (chiến tranh) nhưng vì bảo vệ nước nên có công; nghiệp lưỡng diện.',
    fortune: 'Kiếp này cương quyết, dũng cảm, uy; tài lộc khá nhưng dễ tranh chấp; duyên phần mạnh mẽ nhưng cần học nhu hoà; cẩn thận tai nạn, bệnh liên thương.',
  },
  {
    type: '文人', vi: 'Văn nhân thư sinh',
    location: 'thư viện học đường (书院泮宫)',
    verse: '前世寒窗苦读经，文章千古伴青冥。',
    karma: 'Kiếp trước là thư sinh hiếu học, viết sách dạy người, có công khai trí thế gian; phúc đức văn chương.',
    fortune: 'Kiếp này thông minh, hàm dưỡng; tài lộc nhờ học vấn, nghề trí óc; duyên phần tinh thần hòa hợp; sức khoẻ hay lo nghĩ, cần giữ tâm an.',
  },
  {
    type: '艺人', vi: 'Nghệ nhân diễn xướng',
    location: 'phường ca kỹ chợ búa (市井勾栏)',
    verse: '前世卖艺走江湖，一弦一管寄穷途。',
    karma: 'Kiếp trước là nghệ nhân phiêu bạt, mang niềm vui cho người nhưng số phận long đong; có duyên nghệ thuật.',
    fortune: 'Kiếp này tài hoa, duyên khẩu chúng; tài lộc không đều, lúc thịnh lúc phai; duyên phần phong lưu nhưng dễ đào hoa; sức khoẻ cần giữ họng, thần kinh.',
  },
  {
    type: '工匠', vi: 'Thợ thủ công',
    location: 'xưởng mộc rèn đúc (百工作坊)',
    verse: '前世执斧弄刀锤，雕梁画栋显奇才。',
    karma: 'Kiếp trước là thợ giỏi, xây dựng chùa chiền nhà cửa cho người, công đức thực; cần mẫn không dỗi.',
    fortune: 'Kiếp này khéo tay, thực tế, đáng tin; tài lộc nhờ tay nghề vững; duyên phần trung thành, gia đạo vững; sức khoẻ tốt nhưng giữ tay lưng.',
  },
  {
    type: '渔夫', vi: 'Ngư phủ dong buồm',
    location: 'thuyền buồm vùng biển (东海渔村)',
    verse: '前世撒网度生涯，风波浪里走天涯。',
    karma: 'Kiếp trước đánh cá biển lớn, sát nghiệp (cá) nhưng nuôi sống nhiều người; số phận long đong sóng gió.',
    fortune: 'Kiếp này lận đận bôn ba nhưng chịu khó; tài lộc lúc có lúc không; duyên phần xa nhà, hay di chuyển; cẩn thận nước, bệnh liên phong hàn.',
  },
  {
    type: '医者', vi: 'Y giả cứu người',
    location: 'phòng thuốc thôn làng (杏林医馆)',
    verse: '前世悬壶济世人，妙手回春积善因。',
    karma: 'Kiếp trước là thầy thuốc cứu mạng nhiều người, âm đức rất lớn; vì giảm khổ cho chúng sanh nên phúc hậu.',
    fortune: 'Kiếp này từ bi, được quý nhân nâng; tài lộc trung lưu khá, thường làm nghề giúp người; duyên phần đức độ; sức khoẻ khá, hay lo cho người khác.',
  },
  {
    type: '贵族', vi: 'Quý tộc vương tôn',
    location: 'vương phủ phủ đệ (王侯府邸)',
    verse: '前世生于侯门中，金枝玉叶享荣华。',
    karma: 'Kiếp trước sinh ra trong vương tôn quý tộc, hưởng phúc tổ tiên nhưng cũng vì kiêu sa nên tiêu phí phúc báu.',
    fortune: 'Kiếp này khí chất quý phái, được nâng đỡ; tài lộc sẵn có nhưng dễ hao; duyên phần cần chọn người tri kỷ; cẩn thận kiêu ngạo sinh tạ.',
  },
  {
    type: '平民', vi: 'Bình dân thường dân',
    location: 'thôn trang bình dị (寻常巷陌)',
    verse: '前世寻常百姓家，粗茶淡饭度年华。',
    karma: 'Kiếp trước là thường dân bình dị, sống vô sự, ít phúc lớn cũng ít nghiệp lớn; luân hồi trung hoà.',
    fortune: 'Kiếp này bình ổn, vô sự là phúc; tài lộc đủ sống; duyên phần yên ấm; sức khoẻ trung bình, cần tích đức để hậu vận khá hơn.',
  },
];

// ---------------------------------------------------------------------------
//  CAN NĂM SINH → ngũ hành (dùng cho lớp "ngũ hành tiền thế" tư vấn phụ)
// ---------------------------------------------------------------------------
const GAN_WX = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

// ---------------------------------------------------------------------------
//  TÍNH INDEX LỤC THẬP HOA GIÁP TỪ NĂM (甲子=0, ... 癸亥=59)
//  (cùng công thức chuẩn với chenggu.js / calendar)
// ---------------------------------------------------------------------------
function yearGanzhiIndex(solarYear) {
  return ((solarYear - 4) % 60 + 60) % 60;
}

// ---------------------------------------------------------------------------
//  LỚP "称骨三世" — đối chiếu trọng lượng xương (chenggu) với thân phận
//  tiền thế để cho ra một câu tư vấn tổng hợp. Đây là phần phụ (sub-feature).
//
//  Nguyên lý dân gian: tiền thế "đắc đạo/nghĩa" (sư, y, quan văn) mà xương
//  nặng (>4.5 两) → phúc đức tiếp tục, đại cát. Tiền thế "nghiệp nặng" (võ,
//  ngư phủ, thương nhân) mà xương nhẹ (<3.0 两) → kiếp này còn trả quả.
// ---------------------------------------------------------------------------
function crossChenggu(pastTypeIdx, totalLiang) {
  const HEAVY = totalLiang >= 4.5;
  const LIGHT = totalLiang <= 3.0;
  // type index 0 (僧), 5 (文), 9 (医), 1 (官 văn hoá) → phúc đức
  const VIRTUE = [0, 1, 5, 9].includes(pastTypeIdx);
  // type index 4 (武), 8 (渔) → sát nghiệp
  const KARMA_HEAVY = [4, 8].includes(pastTypeIdx);

  if (VIRTUE && HEAVY) {
    return {
      tone: 'cat',
      vi: 'Tiền thế tích đức lớn + kiếp này xương nặng → phúc đức nối tiếp, đại cát. Nên tiếp tục hành thiện để giữ vận.',
    };
  }
  if (VIRTUE && !LIGHT) {
    return {
      tone: 'cat',
      vi: 'Tiền thế là người đức độ + kiếp này xương trung/thượng → đường đời khá thuận, duyên phúc còn.',
    };
  }
  if (KARMA_HEAVY && LIGHT) {
    return {
      tone: 'warn',
      vi: 'Tiền thế mang nghiệp (chiến/sát) + kiếp này xương nhẹ → còn trả quả, nên tích âm đức, tránh tranh chấp.',
    };
  }
  if (KARMA_HEAVY && HEAVY) {
    return {
      tone: 'mid',
      vi: 'Tiền thế sát nghiệp nhưng kiếp này xương nặng → đã chuyển nghiệp bằng phúc mới, cẩn thận giữ đức không sa lại.',
    };
  }
  if (LIGHT) {
    return {
      tone: 'warn',
      vi: 'Kiếp này xương nhẹ bất kể tiền thế → cần tự lực, kiên nhẫn, tích thiện để hậu vận khá lên.',
    };
  }
  return {
    tone: 'mid',
    vi: 'Tiền thế và xương kiếp này cân hoà → đường đời trung bình khá, cứ giữ thiện tâm là ổn.',
  };
}

/**
 * 三世书 — đọc tiền thế / nhân quả / phúc hoạ kiếp này.
 * @param {object} R — kết quả analyze() (cần R.chart.input: year/month/day/hour/minute)
 * @param {object} [opts] — { boneWeight?: number } nếu caller đã tính chenggu,
 *                          truyền vào để tránh tính lại.
 * @returns {{
 *   code: number,                     // 0..59 (vị hoa giáp năm sinh)
 *   typeIndex: number,                // 0..11 (position % 12)
 *   yearGanZhi: string,               // vd "癸酉"
 *   ganWx: string,                    // ngũ hành can năm sinh
 *   pastLife: { type:string, vi:string, location:string, verse:string },
 *   karma: { cause:string, vi:string },
 *   currentLife: { fortune:string, vi:string },
 *   boneCross: { tone:string, vi:string } | null,  // 称骨三世 (nếu có chenggu)
 *   summary: string,
 *   disclaimer: string,
 * }}
 */
export function sanshishu(R, opts = {}) {
  const inp = R?.chart?.input;
  if (!inp) throw new Error('sanshishu: thiếu R.chart.input');

  const { year, month, day } = inp;
  const hh = (inp.hour == null) ? 12 : inp.hour;
  const mm = (inp.minute == null) ? 0 : inp.minute;

  // Quy đổi dương lịch → âm lịch, lấy đúng năm ÂL (sau Tết có thể sang năm sau)
  const lunar = Solar.fromYmdHms(year, month, day, hh, mm, 0).getLunar();
  const lunarYear = lunar.getYear();
  const yearGanZhi = lunar.getYearInGanZhi();

  // Index hoa giáp 0..59 và type index 0..11 (12 thân phận)
  const code = yearGanzhiIndex(lunarYear);
  const typeIndex = code % 12;
  const entry = PAST_LIFE_TYPES[typeIndex];

  // Ngũ hành can năm sinh (lớp phụ)
  const yearGan = yearGanZhi[0];
  const ganWx = GAN_WX[yearGan] || '';

  // Lớp phụ 称骨三世: dùng chenggu nếu có (truyền sẵn hoặc tự tính)
  let boneCross = null;
  try {
    const cg = (typeof opts.boneWeight === 'number')
      ? { totalLiang: opts.boneWeight }
      : chenggu(R);
    boneCross = crossChenggu(typeIndex, cg.totalLiang);
  } catch (_e) {
    // chenggu có thể fail nếu thiếu input — bỏ qua lớp phụ, không crash
    boneCross = null;
  }

  // Tóm tắt 1 câu
  const summary = `Năm sinh ${yearGanZhi} (vị ${code + 1}/60 hoa giáp) → tiền thế là「${entry.type} ${entry.vi}」tại ${entry.location}. ${entry.karma} → Kiếp này: ${entry.fortune}`;

  const disclaimer = '三世书 là văn hoá dân gian, tham khảo giải trí — không phải nhận định mệnh lý nghiêm túc như Bát Tự.';

  return {
    code,
    typeIndex,
    yearGanZhi,
    ganWx,
    lunar: {
      year: lunarYear,
      month: Math.abs(lunar.getMonth()),
      day: lunar.getDay(),
    },
    pastLife: {
      type: entry.type,
      vi: entry.vi,
      location: entry.location,
      verse: entry.verse,
    },
    karma: {
      cause: entry.karma,
      vi: entry.karma,
    },
    currentLife: {
      fortune: entry.fortune,
      vi: entry.fortune,
    },
    boneCross,
    summary,
    disclaimer,
  };
}

export { PAST_LIFE_TYPES, GAN_WX };
