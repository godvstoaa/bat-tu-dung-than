// ============================================================================
//  求签 (CẦU THIÊM) — 黄大仙灵签 (Wong Tai Sin 100-stick oracle)
//  Một trong những phương pháp bói phổ biến nhất văn hoá Hoa: rút 1 trong 100
//  chiếu (签), mỗi chiếu có thơ 4 câu (签诗) + điển cố (story) + luận Việt.
//
//  Phương pháp:
//    1. Chọn 1 trong 100 chiếu (random HOẶC deterministic hash của câu hỏi+ngày).
//    2. Mỗi chiếu có 1 trong 7 bậc: 上上签 / 上吉 / 上签 / 中吉 / 中平 / 中下 / 下下.
//    3. 12 chiếu nổi tiếng nhất được dữ liệu ĐẦY ĐỦ (poem + story + luận sâu).
//       88 chiếu còn lại sinh tự động theo tone pattern + template Việt.
//    4. Kèm 掷筊 (Jiaobei/Poe blocks): 圣筊=CÓ, 笑筊=CHƯA RÕ, 阴筊=KHÔNG.
//
//  Nguồn: 黄大仙灵签 100 (Sik Sik Yuen Wong Tai Sin Temple, HK). Đây là module
//  giản lược mang tính tham khảo / giải trí — KHÔNG thay bát tự / tử vi.
// ============================================================================
// (Không import — module độc lập, không phụ thuộc constants/chart.)

// ---------------------------------------------------------------------------
// 7 BẬC ĐIỆM (tone levels). Thứ tự từ tốt → xấu.
// ---------------------------------------------------------------------------
export const TONES = ['上上签', '上吉', '上签', '中吉', '中平', '中下', '下下'];

// Meta Việt cho từng bậc: overall + làm-gì + tránh-gì + career/wealth/love template.
const TONE_META = {
  '上上签': {
    viLabel: 'Thượng Thượng (cực tốt)',
    overall: 'Cát tường tột bậc, mọi việc hanh thông, tâm nguyện to đều toại ý.',
    do: 'Nên mạnh dạn tiến hành, nắm bắt cơ hội lớn, mở rộng quy mô.',
    avoid: 'Chỉ tránh kiêu ngạo, lãng quên ơn, hay tự mãn quá mức.',
    career: 'Sự nghiệp thăng tiến vượt bậc, được quý nhân nâng đỡ, nên nhận trọng trách.',
    wealth: 'Tài lộc dồi dào, đầu tư thuận lợi, có tài lớn bất ngờ.',
    love: 'Tình duyên viên mãn, có thể thành đôi / kết hôn / sinh quý tử.',
    summary: 'Đại cát — trời đang giúp, cứ tiến.',
  },
  '上吉': {
    viLabel: 'Thượng Cát (rất tốt)',
    overall: 'Việc tốt đẹp, ít trở ngại, cứ đường đường chính chính sẽ thành.',
    do: 'Nên giữ đạo chính, làm việc thiện, tiến vừa phải sẽ đạt.',
    avoid: 'Tránh投机 quá trớn hay bỏ dở giữa chừng.',
    career: 'Công danh sáng, được cấp trên tin, có thăng chức hoặc đổi việc tốt.',
    wealth: 'Tài chính ổn định lên, sinh lời đều, có lộc chính đáng.',
    love: 'Duyên tốt, đôi bền, nếu đang tìm sẽ gặp người ưng ý.',
    summary: 'Cát — thuận đạo chính, sẽ thành.',
  },
  '上签': {
    viLabel: 'Thượng (khá tốt)',
    overall: 'Cát thường, việc tiểu thì toại, việc đại cần kiên nhẫn mới thành.',
    do: 'Nên bền bỉ từng bước, tích tiểu thành đại.',
    avoid: 'Tránh nôn nóng, muốn nhanh rồi hỏng.',
    career: 'Sự nghiệp tiến triển thuận, cần thời gian để thấy quả.',
    wealth: 'Tài lộc vừa phải, tích luỹ được, tránh tiêu xài hoang.',
    love: 'Tình cảm ổn, cần chân thành nuôi dưỡng mới bền.',
    summary: 'Tiểu cát — bền bỉ thì thành.',
  },
  '中吉': {
    viLabel: 'Trung Cát (hơi tốt)',
    overall: 'Việc tuy chưa hoàn toại nhưng có hướng lên, cần cố gắng thêm.',
    do: 'Nên khiêm cung, học hỏi, chờ thời, có quý nhân nhỏ phù trợ.',
    avoid: 'Tránh tranh chấp, tranh giành quyền lợi.',
    career: 'Công việc khá, có chuyển biến nhỏ tốt, đừng nóng đổi việc.',
    wealth: 'Tài vừa đủ, có chút lời nếu biết giữ, tránh đầu tư rủi ro.',
    love: 'Duyên hơi tốt, cần chủ động chứ đừng chờ đợi thụ động.',
    summary: 'Hảo — cố thêm sẽ lên.',
  },
  '中平': {
    viLabel: 'Trung Bình (bình)',
    overall: 'Bình đạm, không tốt không xấu, cứ bình tĩnh sống là ổn.',
    do: 'Nên thủ thường, giữ mình, làm việc thiện tích đức.',
    avoid: 'Tránh làm việc lớn, mạo hiểm, hay sinh vọng tưởng.',
    career: 'Sự nghiệp ngang, nên giữ việc hiện tại, chờ thời cơ.',
    wealth: 'Tài bình, đủ sống, không nên đầu tư lớn hay cờ bạc.',
    love: 'Tình duyên bình, cần nhiều kiên nhẫn hơn.',
    summary: 'Bình — giữ mình, chờ thời.',
  },
  '中下': {
    viLabel: 'Trung Hạ (hơi xấu)',
    overall: 'Việc hơi trở ngại, có tiểu nhân quấy, cần cẩn thận.',
    do: 'Nên lùi một bước, giữ sức, giải trừ tiểu nhân, làm việc thiện.',
    avoid: 'Tránh tranh chấp, đầu tư lớn, hay tin người lạ.',
    career: 'Sự nghiệp hơi ách, có người quấy, nên nhẫn nhịn.',
    wealth: 'Tài hao, dễ mất tiền oan, cần giữ chặt, tránh cho vay.',
    love: 'Tình duyên có chút trắc trở, cần bao dung, đề phòng hiểu lầm.',
    summary: 'Tiểu hung — lùi bước, cẩn thận.',
  },
  '下下': {
    viLabel: 'Hạ Hạ (xấu)',
    overall: 'Đại hung, việc không thành, có tai nạn / hao tiền / khẩu thiệt.',
    do: 'Nên dừng mọi việc lớn, thu mình, làm việc thiện, niệm Phật giải nghiệp.',
    avoid: 'Tránh xuất hành xa, đầu tư, kiện tụng, tranh chấp, hôn nhân vội.',
    career: 'Sự nghiệp ách nặng, dễ mất việc, nên thủ thường, chờ qua hạn.',
    wealth: 'Tài phá tán, dễ hao tiền lớn, tuyệt đối tránh đầu tư / cờ bạc.',
    love: 'Tình duyên đổ vỡ hoặc trắc trở nặng, nên hoãn việc lớn.',
    summary: 'Đại hung — thủ thường, làm thiện.',
  },
};

// ---------------------------------------------------------------------------
// 12 CHIẾU ĐẦY ĐỦ (famous sticks — cover cả 7 tone levels).
// num / tone / poem (4 câu Hán) / story / vi / career / wealth / love.
// ---------------------------------------------------------------------------
const FULL_DATA = {
  1: {
    num: 1, tone: '上上签',
    poem: '天开地辟结良缘，日吉时良万事全；若得此签真妙境，婚姻财子福绵绵。',
    story: '开天辟地 — Đ землю trời mới phân; kết lành duyên, vạn sự toàn.',
    vi: 'Chiếu số 1 (đầu tiên) là thượng thượng: đất trời mở ra, vạn sự khởi đầu tốt lành, cầu gì được nấy, phước lộc kéo dài. Đây là chiếu đẹp nhất cả 100.',
    career: 'Khởi đầu đại thuận, nên khởi nghiệp, nhận việc lớn, tất thành.',
    wealth: 'Tài lộc vô lượng, đầu tư nào cũng có lãi, có lộc bất ngờ.',
    love: 'Duyên tốt nhất, lập gia đình / cầu hôn tất thành, phước đức dài lâu.',
  },
  10: {
    num: 10, tone: '上吉',
    poem: '绿柳苍苍正当时，任君此去作乾坤；勿言此事无凭据，自有亨通造化时。',
    story: '绿柳苍苍 — Cây liễu xanh tươi đúng thời, cất bước làm sự nghiệp lớn.',
    vi: 'Cây liễu xanh rờn báo mùa xuân, đúng lúc để cất bước làm sự nghiệp. Việc tưởng không có bằng chứng nhưng cứ đường đường chính chính, ắt có ngày hanh thông.',
    career: 'Đúng lúc để khởi nghiệp / đổi việc lớn, có quý nhân nâng đỡ.',
    wealth: 'Tài chính đi lên, có tài bất ngờ nếu kiên trì.',
    love: 'Duyên chín muồi, cất lời cầu hôn / tỏ tình sẽ thành.',
  },
  14: {
    num: 14, tone: '上签',
    poem: '莫叹年来事似冰，丰收原是有天凭；从今喜气重重至，自有人缘向外生。',
    story: '为贾——多年来 khốn cùng (sống cảnh đông buốt) nay gặp vận, lại có tài danh.',
    vi: 'Đừng than năm tháng sự việc lạnh lẽo như băng, mùa gặt bội thu vốn có trời định. Từ nay niềm vui trọng trùng kéo đến, tự nhiên có nhân duyên sinh ra bên ngoài.',
    career: 'Qua thời khó khăn, sự nghiệp bắt đầu đi lên, có người giúp.',
    wealth: 'Tài chính xoay chuyển, có nguồn thu mới, tích luỹ được.',
    love: 'Qua cơn lạnh, duyên ấm lại, có người mới xuất hiện.',
  },
  24: {
    num: 24, tone: '中吉',
    poem: '三年恩泽拂严寒，报到阳和物象欢；自是天工施造化，家道从此渐宽安。',
    story: '伯牙学琴 — Bá Nha học đàn, sau thành thánh cầm (3 năm khó).',
    vi: 'Ba năm ơn phước đẩy lui cái lạnh, tin vui dương hoà vạn vật hân hoan. Đó là bàn tay tạo hoá, từ đây gia đạo dần rộng rãi an bình. Cần kiên nhẫn qua 3 năm đầu.',
    career: 'Cần thời gian rèn luyện 1-3 năm, sau sẽ thành danh / thành tài.',
    wealth: 'Tài lộc chậm nhưng chắc, tích luỹ đều, có quả sau khi nỗ lực.',
    love: 'Duyên cần nuôi dưỡng, sau thời gian sẽ bền chặt.',
  },
  38: {
    num: 38, tone: '上上签',
    poem: '腰悬金印色如新，位列朝纲宰辅臣；莫道文章无用处，丹心一点报君亲。',
    story: '赵子龙救阿斗 — Triệu Tử Long một mình cứu A Đẩu, mười vạn quân giấu không nổi; công lao to.',
    vi: 'Đeo ấn vàng vẫn sáng như mới, đứng vào hàng tể phụ triều đình. Đừng nói văn chương vô dụng, một lòng son sắt báo đáp vua cha. Chí hướng lớn tất đạt, có công lao hiển hách.',
    career: 'Đại thành về công danh / quân sự / chức vụ lớn, được tín nhiệm.',
    wealth: 'Tài lộc từ công danh, có bổng lộc lớn, đáng đáng.',
    love: 'Duyên tốt, có bạn đời hiếu nghĩa, gia đạo vững.',
  },
  44: {
    num: 44, tone: '上吉',
    poem: '客中遇凶遇贵人，扶持得境入情亲；虽然目下惊和险，终有恩波及此身。',
    story: '王质遇仙 — Vương Chất xem cờ tiên, về nhà đã trăm năm (thời gian thoáng qua).',
    vi: 'Giữa nơi khách dịp gặp khó lại gặp quý nhân, nâng đỡ đưa vào cảnh thân tình. Tuy trước mắt có kinh sợ hiểm trở, rốt cuộc sóng ơn sẽ đến với thân này.',
    career: 'Gặp khó sẽ có quý nhân giải cứu, sau đó sự nghiệp thuận lợi.',
    wealth: 'Crisis được hoá giải, tài chính phục hồi nhờ người giúp.',
    love: 'Gặp duyên nơi xa / lúc khó khăn, sau thành đôi bền.',
  },
  52: {
    num: 52, tone: '中吉',
    poem: '水边林下两相依，可惜先迷不见知；试问好花何处是，云开月到自然知。',
    story: '何武判事 — Hà Vũ đoán việc, không phải chuyện đâu cũng rõ ràng ngay.',
    vi: 'Bên nước dưới rừng hai bên nương nhau, đáng tiếc lúc đầu mơ hồ chưa rõ. Hỏi hoa đẹp ở đâu, mây tan trăng đến tự nhiên sẽ biết. Cần chờ thời điểm sáng tỏ.',
    career: 'Lúc đầu mơ hồ, sau sẽ rõ ràng, đừng vội quyết định lớn.',
    wealth: 'Tài chính chưa rõ ràng, chờ thêm thời gian sẽ biết hướng đầu tư.',
    love: 'Duyên chưa rõ, để mây tan trăng sáng (thời gian) sẽ biết.',
  },
  64: {
    num: 64, tone: '中平',
    poem: '心猿意马未曾停，雕弓挂月待风云；功名富贵皆前定，何用劳心役梦魂。',
    story: '边塞将军 — Tướng biên cương treo cung đợi thời, mệnh đã định trước.',
    vi: 'Vượn lòng ngựa ý chưa từng dừng, cung khắc treo chờ mây gió. Công danh phú quý đều do tiền định, cần gì lao tâm nhọc hồn. Mọi việc đã an bài, bình tĩnh giữ mình là hơn.',
    career: 'Công danh đã có định, đừng quá cố tranh, thủ thường mà sống.',
    wealth: 'Tài lộc có bao nhiêu hưởng bấy nhiêu, tránh đầu tư rủi ro.',
    love: 'Duyên số đã định, đừng cố ép, cứ tự nhiên.',
  },
  75: {
    num: 75, tone: '中下',
    poem: '抱犬过门非易事，不知到底事何如；不如守旧安常好，切莫强求事事宜。',
    story: '作法自毙 — Làm pháp mình chịu, hoặc người ôm chó qua cửa (khó nhọc).',
    vi: 'Ôm chó qua cửa chẳng dễ gì, không biết rốt cuộc sự việc ra sao. Thà giữ cũ an thường là hơn, chớ cố mạnh cầu cho mọi việc đều ý. Đây là lúc nên thủ thường, đừng khởi sự mới.',
    career: 'Sự nghiệp ách, nên giữ việc cũ, đừng đổi / khởi nghiệp mới.',
    wealth: 'Tài hao, dễ mất tiền oan, giữ chặt, tránh đầu tư.',
    love: 'Tình duyên trắc trở, nên bao dung, chớ ép buộc.',
  },
  87: {
    num: 87, tone: '中平',
    poem: '事如逐鹿不知足，何曾片刻暂安宁；劝君把定休胡走，自有亨通造化成。',
    story: '苏秦不第 — Tô Tần thi rớt nhiều lần, sau mới thành (cần cố gắng).',
    vi: 'Việc như đuổi hươu không biết đủ, nào có giây phút tạm yên. Khuyên ông hãy vững chớ loạn chạy, tự nhiên có ngày hanh thông tạo hoá thành. Cần dẹp lòng tham, tập trung mới thành.',
    career: 'Đừng ôm đồm / nhảy việc nhiều, tập trung một hướng sẽ thành.',
    wealth: 'Đừng theo đuổi nhiều nguồn cùng lúc, tập trung sẽ có tài.',
    love: 'Đừng mê nhiều người, chân thành một người sẽ bền.',
  },
  95: {
    num: 95, tone: '下下',
    poem: '绿水青山楼上楼，男儿到此也须愁；欲求名利终无分，只恐淹留客路头。',
    story: '困在吴国 — Quốn gianh ở Ngô (như Câu Tiễn / Tôn Tẫn gặp nạn).',
    vi: 'Nước xanh non xanh lầu trên lầu, đấng nam nhi đến đây cũng phải sầu. Cầu danh lợi rốt cuộc không phần, chỉ sợ kẹt lại đầu đường khách. Đại hung, nên thu mình, chờ qua hạn.',
    career: 'Sự nghiệp ách nặng, dễ mất chức / thất bại, thủ thường chờ qua hạn.',
    wealth: 'Tài phá tán, dễ mất tiền lớn, tuyệt đối tránh đầu tư / vay mượn.',
    love: 'Tình duyên đổ vỡ hoặc trắc trở nặng, hoãn mọi việc lớn.',
  },
  100: {
    num: 100, tone: '中吉',
    poem: '百事如心似转蓬，不劳人力得顺风；心猿顿息机心息，一切随缘造化中。',
    story: '圆满收官 — Chiếu cuối (100) là kết thúc một chu kỳ, quy về "tùy duyên".',
    vi: 'Trăm việc như lòng như cỏ xoay, không nhọc nhân lực được thuận gió. Vượn lòng dừng, cơ tâm dừng, tất cả tùy duyên trong tạo hoá. Đây là chiếu cuối, khuyên buông xách, tùy duyên.',
    career: 'Sự nghiệp đi vào ổn định, tùy duyên mà tiến, không cần cố ép.',
    wealth: 'Tài lộc vừa đủ, chớ tham, an bài tự nhiên sẽ có.',
    love: 'Duyên tùy theo nhân quả, buông chấp sẽ gặp.',
  },
};

// ---------------------------------------------------------------------------
// TEMPLATE THƠ cho 88 chiếu còn lại (sinh theo số chiếu).
// Lấy 4 câu cố định xoay vòng, đảm bảo đúng 4 câu / hợp điệu cổ thi.
// ---------------------------------------------------------------------------
const TEMPLATE_POEMS = [
  '天道循环理最真，福缘深厚自天申；从今修德行方便，福禄绵绵到后身。',
  '愁眉终日为多忧，好事悠悠未出头；且把雄心权按住，前途造化自通由。',
  '如今只可守规行，莫向人前强说情；若问前途心地好，自然福禄有亏盈。',
  '风波境界立身心，自是坚心不被人；到得功成时节至，何愁不做上流人。',
  '事须问根叶，根在叶方茂；若使一时荣，何如长久好。',
  '一重退了一重遮，不得心机未尽些；劝尔莫萦闲气力，前途到底总由他。',
];

// ---------------------------------------------------------------------------
// HASH ủy định: cùng (question + date) → cùng số chiếu (1-100).
// Dùng FNV-1a 32-bit cho phân bố đều, không phụ thuộc Math.random.
// ---------------------------------------------------------------------------
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193); // FNV prime
  }
  // xor-fold 32-bit thành unsigned rồi ép dương
  return (h >>> 0);
}

/**
 * Tính số chiếu (1-100) determinist từ câu hỏi + ngày.
 * @param {string} question - câu hỏi (có thể rỗng)
 * @param {string} [dateStr] - YYYY-MM-DD (mặc định hôm nay)
 * @returns {number} 1-100
 */
export function stickFromHash(question = '', dateStr) {
  const d = dateStr || new Date().toISOString().slice(0, 10);
  return (fnv1a(String(question) + '|' + d) % 100) + 1;
}

/**
 * Random 1 chiếu (1-100).
 */
export function randomStick() {
  return Math.floor(Math.random() * 100) + 1;
}

/**
 * Tone pattern cho 88 chiếu template — xoay vòng 7 bậc theo (num).
 * Đảm bảo cả 7 tone đều xuất hiện trong 88 chiếu (100/7 ≈ 14 lần mỗi bậc).
 * Chiếu FULL (12 chiếc) giữ tone riêng, còn lại theo pattern.
 */
export function toneForStick(num) {
  if (FULL_DATA[num]) return FULL_DATA[num].tone;
  // Xoay vòng, lệch phase để không trùng block với FULL_DATA.
  return TONES[(num + 3) % 7];
}

/**
 * Sinh thơ template cho chiếu không có FULL_DATA.
 * Xoay vòng 6 bài template theo số chiếu.
 */
function poemForStick(num) {
  return TEMPLATE_POEMS[num % TEMPLATE_POEMS.length];
}

/**
 * Sinh điển cố Việt ngắn cho chiếu template.
 */
function storyForStick(num, tone) {
  const refs = [
    'một nhân vật cổ đại vượt khó thành tài',
    'một quan thanh liêm đức độ',
    'một bậc hiền triết ẩn dật',
    'một tướng quân trung nghĩa',
    'một bậc thầy giáo huấn hậu thế',
    'một người thiện tâm được quả báo',
  ];
  const ref = refs[num % refs.length];
  return `Chiếu ${num} (mẫu template) — nhắc câu chuyện ${ref}, mang ý nghĩa theo bậc "${tone}".`;
}

/**
 * Lấy FULL entry (đầy đủ) HOẶC dựng từ tone pattern + template Việt.
 */
export function getFortune(stickNum) {
  const num = Math.max(1, Math.min(100, Math.floor(stickNum) || 1));
  if (FULL_DATA[num]) {
    const f = FULL_DATA[num];
    const meta = TONE_META[f.tone];
    return {
      num: f.num,
      tone: f.tone,
      toneVi: meta.viLabel,
      poem: f.poem,
      story: f.story,
      vi: f.vi,
      career: f.career,
      wealth: f.wealth,
      love: f.love,
      overall: meta.overall,
      do: meta.do,
      avoid: meta.avoid,
      summary: meta.summary,
      full: true, // có dữ liệu đầy đủ
    };
  }
  const tone = toneForStick(num);
  const meta = TONE_META[tone];
  return {
    num,
    tone,
    toneVi: meta.viLabel,
    poem: poemForStick(num),
    story: storyForStick(num, tone),
    vi: `${meta.overall} ${meta.do} ${meta.avoid}`,
    career: meta.career,
    wealth: meta.wealth,
    love: meta.love,
    overall: meta.overall,
    do: meta.do,
    avoid: meta.avoid,
    summary: meta.summary,
    full: false, // template-generated
  };
}

/**
 * Cầu một chiếu. Nếu có question → deterministic (hash). Không → random.
 * @param {string} [question] - câu hỏi (tuỳ chọn)
 * @param {object} [opts] - { date: 'YYYY-MM-DD', forceStick: number, deterministic: bool }
 * @returns {object} fortune + meta (cách chọn)
 */
export function qiuqian(question, opts = {}) {
  let num, mode;
  if (opts.forceStick != null) {
    num = Math.max(1, Math.min(100, Math.floor(opts.forceStick)));
    mode = 'forced';
  } else if (question && question.trim()) {
    if (opts.deterministic === false) {
      num = randomStick();
      mode = 'random';
    } else {
      num = stickFromHash(question.trim(), opts.date);
      mode = 'deterministic';
    }
  } else {
    num = randomStick();
    mode = 'random';
  }
  const fortune = getFortune(num);
  return { ...fortune, mode, question: question || null };
}

// ---------------------------------------------------------------------------
// 掷筊 (JIAOBEI / POE BLOCKS) — 2 miếng gỗ hình bán nguyệt.
// Mỗi miếng có 1 mặt phẳng (正 - yang) + 1 mặt lồi (反 - yin).
// 3 kết quả:
//   圣筊 (shengjiao): 1正 1反 = CÓ / được chấp nhận (đức thần gật đầu)
//   笑筊 (xiaojiao):  2反       = CHƯA RÕ / cười (hỏi lại hoặc chưa đủ duyên)
//   阴筊 (yinjiao):    2正       = KHÔNG / bị từ chối (không được)
// (Ghi chú: trong một số truyền thống, 2正=khóc=không, 2反=cười=chưa rõ.
//  Ở đây theo 黃大仙 standard: 圣=CÓ, 笑=chưa rõ, 阴=KHÔNG.)
// ---------------------------------------------------------------------------
const JIAOBEI_MEANING = {
  shengjiao: {
    result: 'shengjiao',
    han: '圣筊',
    vi: 'Thánh Giáo (1正 1反)',
    meaning: 'CÓ — thần linh gật đầu đồng ý. Việc hỏi nên tiến hành, tất được phù trợ.',
    answer: 'YES',
  },
  xiaojiao: {
    result: 'xiaojiao',
    han: '笑筊',
    vi: 'Tiếu Giáo (2反 — mặt lồi cả hai)',
    meaning: 'CHƯA RÕ — thần cười, chưa đủ duyên hoặc hỏi chưa rõ. Nên hỏi lại rõ hơn hoặc chờ thêm.',
    answer: 'MAYBE',
  },
  yinjiao: {
    result: 'yinjiao',
    han: '阴筊',
    vi: 'Âm Giáo (2正 — mặt phẳng cả hai)',
    meaning: 'KHÔNG — thần lắc đầu, không đồng ý. Nên dừng / hoãn việc hỏi, chờ duyên khác.',
    answer: 'NO',
  },
};

/**
 * Gieo 掷筊 — random 2 block, mỗi block 50/50 正/反.
 * @returns {object} { result, han, vi, meaning, answer, blocks: [正|反, 正|反] }
 */
export function zhiJiao() {
  // Mỗi block: 0 = 反 (lồi), 1 = 正 (phẳng). 50/50 công bằng.
  const a = Math.random() < 0.5 ? 1 : 0;
  const b = Math.random() < 0.5 ? 1 : 0;
  let key;
  if (a + b === 1) key = 'shengjiao';      // 1正 1反
  else if (a + b === 0) key = 'xiaojiao';  // 2反
  else key = 'yinjiao';                     // 2正
  const m = JIAOBEI_MEANING[key];
  return {
    ...m,
    blocks: [a ? '正' : '反', b ? '正' : '反'],
  };
}

// Export data để UI / test truy cập
export const FULL_STICK_NUMS = Object.keys(FULL_DATA).map(Number);
export { FULL_DATA, TONE_META, JIAOBEI_MEANING };
