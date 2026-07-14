// western-kb.js — Western astrology (tropical zodiac) knowledge base.
// Cung cấp dữ liệu cổ điển để AI diễn giải lá số Western & so sánh với BaZi.
//
// Nguồn: Western astrology chính thống (tropical zodiac, modern rulerships
// bao gồm Uranus/Neptune/Pluto). Rulership, element, modality, polarity được
// kiểm đối chiếu với tài liệu chuẩn (Cafe Astrology, Chani, Almanac).
//
// LƯU Ý TRIẾT HỌC: Tất cả nội dung dưới đây là biểu tượng cổ truyền, KHÔNG phải
// sự thật khoa học đã được kiểm chứng. Trình bày theo lối "đọc số" truyền thống,
// người dùng nên tiếp nhận như một dạng gợi ý tự phản tỉnh, không phải tiên tri.

// =============================================================================
// 1. WESTERN_SIGNS — 12 cung hoàng đạo (Bạch Dương → Song Ngư)
// =============================================================================
// Element: Hỏa (Fire) / Thổ (Earth) / Khí (Air) / Thủy (Water)
// Modality: Khởi đầu (Cardinal) / Cố định (Fixed) / Biến đổi (Mutable)
// Polarity: Dương (Yang/+) / Âm (Yin/-)
// Ruler: sao chủ宰 theo hệ hiện đại (Pluto/Uranus/Neptune cho Thiên Yết/Bảo Bình/Song Ngư)
export const WESTERN_SIGNS = [
  {
    name: 'Bạch Dương', en: 'Aries', symbol: '♈',
    element: 'Hỏa', modality: 'Khởi đầu', polarity: 'Dương', ruler: 'Sao Hỏa',
    dates: '21/3 - 19/4',
    traits: 'Tiên phong, dũng cảm, bốc đồng, dẫn đầu, năng lượng mùa xuân mở màn.',
    personality: 'Cung khởi đầu vòng hoàng đạo, mang năng lượng lửa bùng nổ của sự bắt đầu. Dũng cảm, trực tiếp, hành động trước khi nghĩ, khó kiên nhẫn nhưng truyền lửa cho người khác.',
    keywords: [' tiên phong', 'dũng cảm', 'bốc đồng', 'lãnh đạo', 'độc lập', 'cạnh tranh']
  },
  {
    name: 'Kim Ngưu', en: 'Taurus', symbol: '♉',
    element: 'Thổ', modality: 'Cố định', polarity: 'Âm', ruler: 'Sao Kim',
    dates: '20/4 - 20/5',
    traits: 'Kiên định, thực tế, yêu cái đẹp, vật chất, hưởng thụ giác quan.',
    personality: 'Đất cố định, chậm và chắc, trân trọng sự ổn định và giá trị vật chất. Cứng đầu khi đã quyết, nhưng trung thành, ấm áp và biết thưởng thức cuộc sống.',
    keywords: ['kiên định', 'thực tế', 'yêu cái đẹp', 'vật chất', 'trung thành', 'hưởng thụ']
  },
  {
    name: 'Song Tử', en: 'Gemini', symbol: '♊',
    element: 'Khí', modality: 'Biến đổi', polarity: 'Dương', ruler: 'Sao Thủy',
    dates: '21/5 - 20/6',
    traits: 'Tò mò, linh hoạt, giao tiếp giỏi, đa năng, dễ phân tán.',
    personality: 'Gió biến đổi, tâm trí nhanh nhẹn, khao khát học và kết nối. Đa năng, duyên, thích nói chuyện, nhưng dễ chán và phân tán giữa nhiều sở thích.',
    keywords: ['tò mò', 'linh hoạt', 'giao tiếp', 'đa năng', 'linh tinh', 'trí tuệ']
  },
  {
    name: 'Cự Giải', en: 'Cancer', symbol: '♋',
    element: 'Thủy', modality: 'Khởi đầu', polarity: 'Âm', ruler: 'Mặt Trăng',
    dates: '21/6 - 22/7',
    traits: 'Nhạy cảm, chăm sóc, gắn bó gia đình, bảo vệ, ký ức sâu.',
    personality: 'Nước khởi đầu, cảm xúc như thủy triều, gắn liền với nhà và mẹ. Che chở người thân hết mực, nhạy cảm, dễ bị tổn thương, giữ gìn ký ức.',
    keywords: ['nhạy cảm', 'chăm sóc', 'gia đình', 'bảo vệ', 'ký ức', 'tử tế']
  },
  {
    name: 'Sư Tử', en: 'Leo', symbol: '♌',
    element: 'Hỏa', modality: 'Cố định', polarity: 'Dương', ruler: 'Mặt Trời',
    dates: '23/7 - 22/8',
    traits: 'Tự tin, hào phóng, thích nổi bật, lãnh đạo, cần được công nhận.',
    personality: 'Lửa cố định, tỏa sáng như mặt trời, yêu sân khấu và sự chú ý. Hào phóng, ấm áp, tự hào, đôi khi kiêu ngạo và độc đoán.',
    keywords: ['tự tin', 'hào phóng', 'nổi bật', 'sáng tạo', 'lãnh đạo', 'tự tôn']
  },
  {
    name: 'Xử Nữ', en: 'Virgo', symbol: '♍',
    element: 'Thổ', modality: 'Biến đổi', polarity: 'Âm', ruler: 'Sao Thủy',
    dates: '23/8 - 22/9',
    traits: 'Phân tích, chỉn chu, phục vụ, cầu toàn, chú ý chi tiết và sức khỏe.',
    personality: 'Đất biến đổi, tinh tế và thực tế, theo đuổi hoàn hảo. Phục vụ thiết thực, giỏi tổ chức, hay chỉ trích bản thân và người khác vì tiêu chuẩn cao.',
    keywords: ['phân tích', 'chỉn chu', 'phục vụ', 'cầu toàn', 'chi tiết', 'sức khỏe']
  },
  {
    name: 'Thiên Bình', en: 'Libra', symbol: '♎',
    element: 'Khí', modality: 'Khởi đầu', polarity: 'Dương', ruler: 'Sao Kim',
    dates: '23/9 - 22/10',
    traits: 'Hài hòa, ngoại giao, yêu cái đẹp và công bằng, khó quyết đoán.',
    personality: 'Gió khởi đầu, theo đuổi cân bằng và cái đẹp trong quan hệ. Duyên dáng, công bằng, ghét xung đột, nhưng do dự khi phải chọn phe.',
    keywords: ['hài hòa', 'ngoại giao', 'công bằng', 'cái đẹp', 'quan hệ', 'do dự']
  },
  {
    name: 'Thiên Yết', en: 'Scorpio', symbol: '♏',
    element: 'Thủy', modality: 'Cố định', polarity: 'Âm', ruler: 'Sao Diêm Vương',
    dates: '23/10 - 21/11',
    traits: 'Mãnh liệt, thâm trầm, ám ảnh, biến đổi, trực giác mạnh, bí mật.',
    personality: 'Nước cố định sâu thẳm, mãnh liệt và thu hút. Trực giác sắc bén, dò ra sự thật ẩn giấu, khuynh hướng kiểm soát và chiếm hữu; biết hủy diệt để tái sinh.',
    keywords: ['mãnh liệt', 'bí mật', 'ám ảnh', 'trực giác', 'biến đổi', 'chiếm hữu']
  },
  {
    name: 'Nhân Mã', en: 'Sagittarius', symbol: '♐',
    element: 'Hỏa', modality: 'Biến đổi', polarity: 'Dương', ruler: 'Sao Mộc',
    dates: '22/11 - 21/12',
    traits: 'Tự do, lạc quan, triết lý, phiêu lưu, thẳng thắn đến vô duyên.',
    personality: 'Lửa biến đổi, cung của triết gia và lữ khách, khát khao tự do và chân lý. Lạc quan, hài hước, thẳng thắn, dễ hứa hẹn quá mức.',
    keywords: ['tự do', 'lạc quan', 'triết lý', 'phiêu lưu', 'thẳng thắn', 'giáo dục']
  },
  {
    name: 'Ma Kết', en: 'Capricorn', symbol: '♑',
    element: 'Thổ', modality: 'Khởi đầu', polarity: 'Âm', ruler: 'Sao Thổ',
    dates: '22/12 - 19/1',
    traits: 'Kỷ luật, tham vọng, thực tế, kiên nhẫn, hướng mục tiêu dài hạn.',
    personality: 'Đất khởi đầu, người leo núi trầm lặng, theo đuổi đỉnh cao sự nghiệp. Kỷ luật, kiên nhẫn, thực tế, đôi khi lạnh lùng và quá nghiêm khắc.',
    keywords: ['kỷ luật', 'tham vọng', 'thực tế', 'kiên nhẫn', 'trách nhiệm', 'sự nghiệp']
  },
  {
    name: 'Bảo Bình', en: 'Aquarius', symbol: '♒',
    element: 'Khí', modality: 'Cố định', polarity: 'Dương', ruler: 'Sao Thiên Vương',
    dates: '20/1 - 18/2',
    traits: 'Độc lập, sáng tạo, lý tưởng, dị biệt, nhân đạo, yêu tự do.',
    personality: 'Gió cố định, nhà cách tân và nhà nhân đạo, tư duy đột phá. Độc lập, thân thiện nhưng giữ khoảng cách, đi trước thời đại.',
    keywords: ['độc lập', 'sáng tạo', 'nhân đạo', 'dị biệt', 'tương lai', 'lý tưởng']
  },
  {
    name: 'Song Ngư', en: 'Pisces', symbol: '♓',
    element: 'Thủy', modality: 'Biến đổi', polarity: 'Âm', ruler: 'Sao Hải Vương',
    dates: '19/2 - 20/3',
    traits: 'Nhạy cảm, mơ mộng, đồng cảm, trực giác, biên giới mờ.',
    personality: 'Nước biến đổi, cung cuối cùng của vòng hoàng đạo, ranh giới giữa cái tôi và vũ trụ mờ nhạt. Nghệ sĩ và người chữa lành, đồng cảm vô điều kiện, dễ chìm vào ảo tưởng.',
    keywords: ['nhạy cảm', 'mơ mộng', 'đồng cảm', 'trực giác', 'tâm linh', 'chữa lành']
  }
];

// =============================================================================
// 2. WESTERN_PLANETS — 10 thiên thể (Mặt Trời → Sao Diêm Vương)
// =============================================================================
// rules: cung mà hành tinh cai trị (modern rulership)
export const WESTERN_PLANETS = [
  {
    name: 'Mặt Trời', en: 'Sun', symbol: '☉',
    rules: 'Sư Tử (và cung 5)', cycle: '1 năm',
    meaning: 'Bản chất: cái tôi, ý thức, danh tính cốt lõi, ý chí sống, cha, quyền lực, mục đích cuộc đời. Đại diện cho "bạn là ai" ở tầng ý thức.',
    personality: 'Vị trí trung tâm của lá số, cho thấy bản ngã, lòng tự trọng và khát vọng tỏa sáng. Cung Mặt Trời là danh tính tự nhận thức.',
    keywords: ['cái tôi', 'danh tính', 'ý chí', 'cha', 'sức sống', 'mục đích']
  },
  {
    name: 'Mặt Trăng', en: 'Moon', symbol: '☽',
    rules: 'Cự Giải (và cung 4)', cycle: '~27,3 ngày',
    meaning: 'Bản chất: cảm xúc, tiềm thức, nhu cầu an toàn, thói quen, mẹ, ký ức, công chúng. Là phần "cảm thấy" bên trong.',
    personality: 'Cho thấy đời sống cảm xúc, bản năng, và cách bạn tìm kiếm sự an ủi. Mặt Trăng tiết lộ mẹ và mái nhà nội tâm.',
    keywords: ['cảm xúc', 'tiềm thức', 'mẹ', 'an toàn', 'thói quen', 'ký ức']
  },
  {
    name: 'Sao Thủy', en: 'Mercury', symbol: '☿',
    rules: 'Song Tử & Xử Nữ', cycle: '~88 ngày',
    meaning: 'Bản chất: giao tiếp, tư duy, học hỏi, ngôn ngữ, lý trí, anh chị em, đi lại ngắn, thương mại.',
    personality: 'Cách bạn suy nghĩ, nói, viết và tiếp nhận thông tin. Sao Thủy kết nối hai bán cầu não và kết nối bạn với thế giới qua ngôn từ.',
    keywords: ['giao tiếp', 'tư duy', 'lý trí', 'ngôn ngữ', 'anh chị em', 'đi lại']
  },
  {
    name: 'Sao Kim', en: 'Venus', symbol: '♀',
    rules: 'Kim Ngưu & Thiên Bình', cycle: '~225 ngày',
    meaning: 'Bản chất: tình yêu, cái đẹp, nghệ thuật, giá trị, sự hấp dẫn, tiền bạc, sự hài hòa. Cách bạn cho và nhận yêu thương.',
    personality: 'Hành tinh của sắc đẹp và tình cảm, cho thấy gu thẩm mỹ, cách bạn yêu, và những gì bạn trân trọng.',
    keywords: ['tình yêu', 'cái đẹp', 'nghệ thuật', 'giá trị', 'tiền bạc', 'hài hòa']
  },
  {
    name: 'Sao Hỏa', en: 'Mars', symbol: '♂',
    rules: 'Bạch Dương (modern), Thiên Yết (co-ruler)', cycle: '~1,9 năm',
    meaning: 'Bản chất: hành động, năng lượng, dục vọng, can đảm, xung đột, động lực, chiến binh. Cách bạn theo đuổi và đấu tranh.',
    personality: 'Động cơ thúc đẩy hành động, sự quyết đoán, cơn giận và ham muốn. Sao Hỏa cho biết cách bạn bảo vệ và chinh phục.',
    keywords: ['hành động', 'năng lượng', 'dục vọng', 'can đảm', 'xung đột', 'động lực']
  },
  {
    name: 'Sao Mộc', en: 'Jupiter', symbol: '♃',
    rules: 'Nhân Mã (modern), Song Ngư (co-ruler truyền thống)', cycle: '~12 năm',
    meaning: 'Bản chất: mở rộng, may mắn, niềm tin, triết lý, giáo dục, lạc quan, sự dồi dào, tôn giáo. Đại hành tinh có lợi lớn.',
    personality: 'Hành tinh tăng trưởng, mang cơ hội và sự rộng lượng. Cho thấy nơi bạn tin tưởng cuộc đời và vươn xa.',
    keywords: ['mở rộng', 'may mắn', 'niềm tin', 'triết lý', 'giáo dục', 'lạc quan']
  },
  {
    name: 'Sao Thổ', en: 'Saturn', symbol: '♄',
    rules: 'Ma Kết (modern), Bảo Bình (co-ruler truyền thống)', cycle: '~29,5 năm',
    meaning: 'Bản chất: kỷ luật, giới hạn, trách nhiệm, thời gian, cấu trúc, hậu quả, cha (đôi khi), nỗi sợ, sự trưởng thành.',
    personality: 'Thầy giáo nghiêm khắc của hoàng đạo, đặt ra thử thách để rèn luyện. Nơi Sao Thổ đi qua là nơi bạn phải nỗ lực và xây nền móng lâu dài.',
    keywords: ['kỷ luật', 'giới hạn', 'trách nhiệm', 'thời gian', 'cấu trúc', 'cha']
  },
  {
    name: 'Sao Thiên Vương', en: 'Uranus', symbol: '♅',
    rules: 'Bảo Bình', cycle: '~84 năm',
    meaning: 'Bản chất: đột phá, nổi loạn, sáng tạo, thay đổi đột ngột, công nghệ, tự do, tàn lụy, sự tỉnh thức. Hành tinh ngoại hành tinh thế hệ.',
    personality: 'Lực lượng phá vỡ trật tự cũ để mở đường cái mới. Đánh thức sự độc lập và bản ngã đích thực, đôi khi qua cú sốc.',
    keywords: ['đột phá', 'nổi loạn', 'sáng tạo', 'thay đổi', 'tự do', 'công nghệ']
  },
  {
    name: 'Sao Hải Vương', en: 'Neptune', symbol: '♆',
    rules: 'Song Ngư', cycle: '~165 năm',
    meaning: 'Bản chất: mơ mộng, ảo ảnh, tâm linh, sáng tạo nghệ thuật, sự lừa dối, từ bi, sự hòa tan ranh giới. Thế hành tinh thế hệ.',
    personality: 'Sương mù huyền ảo và sự từ bi vô bờ. Mang tầm nhìn tâm linh và óc nghệ thuật, nhưng cũng có thể chìm trong ảo tưởng.',
    keywords: ['mơ mộng', 'tâm linh', 'ảo ảnh', 'nghệ thuật', 'từ bi', 'sáng tạo']
  },
  {
    name: 'Sao Diêm Vương', en: 'Pluto', symbol: '♇',
    rules: 'Thiên Yết', cycle: '~248 năm',
    meaning: 'Bản chất: biến đổi sâu, quyền lực, chết-chóc-tái sinh, ám ảnh, bí mật, hủy diệt và tái tạo, vô thức tập thể. Thế hành tinh thế hệ.',
    personality: 'Lực lượng biến đổi hủy diệt để tái sinh. Nơi Sao Diêm Vương đứng là nơi bạn phải đối mặt với bóng tối và giành lại quyền lực.',
    keywords: ['biến đổi', 'quyền lực', 'tái sinh', 'ám ảnh', 'bí mật', 'hủy diệt']
  }
];

// =============================================================================
// 3. WESTERN_HOUSES — 12 cung nhà (life arenas)
// =============================================================================
// Tên Việt ghép từ tên cổ (Bản Mệnh, Tài Bạch...) + chủ đề hiện đại.
export const WESTERN_HOUSES = [
  {
    num: 1, name: 'Cung Bản Mệnh',
    theme: 'Bản thân, ngoại hình, ấn tượng đầu tiên, cách bước ra thế giới',
    meaning: 'Cách người khác nhìn bạn lúc đầu tiên, thể chất và thái độ mở đầu. Đây là "mặt nạ" và cái tôi bề ngoài.',
    life_area: 'appearance/self'
  },
  {
    num: 2, name: 'Cung Tài Bạch',
    theme: 'Tiền bạc, tài sản cá nhân, giá trị, lòng tự trọng vật chất',
    meaning: 'Cách bạn kiếm, giữ, tiêu tiền và những gì bạn coi là giá trị. Cũng liên quan đến cảm giác xứng đáng.',
    life_area: 'money'
  },
  {
    num: 3, name: 'Cung Huynh Đệ / Giao Tiếp',
    theme: 'Giao tiếp, học tập cơ bản, anh chị em, hàng xóm, đi lại ngắn',
    meaning: 'Cách bạn suy nghĩ hàng ngày, nói chuyện, học hỏi và quan hệ với anh chị em, hàng xóm. Miền của thông tin.',
    life_area: 'communication'
  },
  {
    num: 4, name: 'Cung Điền Trạch / Gia Đạo',
    theme: 'Nhà cửa, gia đình, cha mẹ (đặc biệt cha/mẹ nuôi dưỡng), cội nguồn',
    meaning: 'Gốc rễ và tổ ấm của bạn, cảm giác an toàn nơi chốn, và di sản gia đình truyền lại. Thường gắn với cha nuôi dưỡng.',
    life_area: 'home'
  },
  {
    num: 5, name: 'Cung Tử Tức / Nhi Đồng',
    theme: 'Con cái, sáng tạo, tình yêu lãng mạn, giải trí, đầu cơ',
    meaning: 'Nơi bạn vui chơi, sáng tạo và yêu đương. Cách bạn tự biểu đạt và hưởng thụ niềm vui thuần khiết.',
    life_area: 'children'
  },
  {
    num: 6, name: 'Cung Nô Bộc / Công Tác - Sức Khỏe',
    theme: 'Công việc thường nhật, sức khỏe, thói quen, phục vụ, thú cưng',
    meaning: 'Nhịp sống hàng ngày, môi trường làm việc và cách bạn chăm sóc thân thể. Nơi của bổn phận và tinh tế.',
    life_area: 'work'
  },
  {
    num: 7, name: 'Cung Phu Thê / Hôn Nhân',
    theme: 'Hôn nhân, đối tác, hợp đồng, kẻ thù công khai',
    meaning: 'Cách bạn gắn kết 1-1, kiểu đối tác bạn thu hút, và cách bạn hợp tác hay đối đầu công khai.',
    life_area: 'partnership'
  },
  {
    num: 8, name: 'Cung Tật Ách / Biến Đổi',
    theme: 'Biến đổi, sex, di sản, tiền của người khác, tử - sinh lại, điều bí ẩn',
    meaning: 'Sự thân mật sâu, sự biến đổi qua khủng hoảng, tiền chung và di sản. Nơi đối mặt với cái chết để tái sinh.',
    life_area: 'transform'
  },
  {
    num: 9, name: 'Cung Thiên Di / Triết Học',
    theme: 'Du lịch xa, triết học, tôn giáo, giáo dục bậc cao, luật, niềm tin',
    meaning: 'Khát vọng mở rộng tầm nhìn qua học thuật, du lịch và ý nghĩa cuộc sống. Miền của chân lý và tầm nhìn xa.',
    life_area: 'travel'
  },
  {
    num: 10, name: 'Cung Quan Lộc / Sự Nghiệp',
    theme: 'Sự nghiệp, địa vị công cộng, danh tiếng, quyền uy, cha/mẹ uy quyền',
    meaning: 'Đỉnh cao bạn hướng tới trong xã hội, con đường nghề nghiệp và di sản bạn để lại. Thường gắn với cha uy quyền.',
    life_area: 'career'
  },
  {
    num: 11, name: 'Cung Phúc Đức / Bằng Hữu',
    theme: 'Bạn bè, hội nhóm, hy vọng, lý tưởng, mạng lưới xã hội',
    meaning: 'Cộng đồng và những người cùng chí hướng, mong ước tương lai và cách bạn đóng góp cho tập thể.',
    life_area: 'friends'
  },
  {
    num: 12, name: 'Cung Huyền Bí / Tiềm Thức',
    theme: 'Tiềm thức, tĩnh lặng, viện điều dưỡng, kẻ thù ẩn, tâm linh, ẩn giấu',
    meaning: 'Miền của sự rút lui, giấc mơ, bóng tối vô thức và những gì bị che giấu (kể cả chính với bạn). Nơi chữa lành hoặc cô lập.',
    life_area: 'unconscious'
  }
];

// =============================================================================
// 4. WESTERN_ASPECTS — các góc giữa các hành tinh
// =============================================================================
// tone: 'cát/hài hòa' | 'căng thẳng/nhiễu' | 'cát nhẹ' | 'khó hòa hợp' | 'trung tính'
export const WESTERN_ASPECTS = {
  conjunction: {
    symbol: '☌', angle: 0, orb: 8,
    meaning: 'Hợp (0°) — hai hành tinh gần nhau, năng lượng hòa quyện và khuếch đại lẫn nhau.',
    tone: 'trung tính'
  },
  opposition: {
    symbol: '☍', angle: 180, orb: 8,
    meaning: 'Xung (180°) — hai cực đối đầu, kéo co và căng thẳng, đòi hỏi cân bằng hai mặt đối lập.',
    tone: 'căng thẳng/nhiễu'
  },
  trine: {
    symbol: '△', angle: 120, orb: 8,
    meaning: 'Tam hợp (120°) — cùng nguyên tố, dòng chảy dễ dàng và tự nhiên, tài năng trời cho nhưng dễ lười.',
    tone: 'cát/hài hòa'
  },
  square: {
    symbol: '□', angle: 90, orb: 8,
    meaning: 'Hình vuông (90°) — xung đột nội tại, ma sát tạo động lực phát triển nhưng gây căng thẳng.',
    tone: 'căng thẳng/nhiễu'
  },
  sextile: {
    symbol: '⚹', angle: 60, orb: 6,
    meaning: 'Lục hợp (60°) — cơ hội và sự ủng hộ nhẹ, cần chủ động nắm bắt mới phát huy.',
    tone: 'cát nhẹ'
  },
  quincunx: {
    symbol: '∠', angle: 150, orb: 3,
    meaning: 'Bán xung (150°, inconjunct) — hai năng lượng không cùng gốc, khó hòa hợp, đòi sự điều chỉnh liên tục.',
    tone: 'khó hòa hợp'
  }
};

// =============================================================================
// 5. SUN_IN_SIGN — Mặt Trời ở cung nào = bản ngã cốt lõi
// =============================================================================
export const SUN_IN_SIGN = {
  'Bạch Dương': 'Mặt Trời ở Bạch Dương: bản ngã tiên phong, dũng cảm, bốc đồng, thích dẫn đầu, không kiên nhẫn. Khẳng định mình qua hành động và sự can đảm.',
  'Kim Ngưu': 'Mặt Trời ở Kim Ngưu: bản ngã kiên định, thực tế, trân trọng ổn định và cái đẹp. Chậm rãi nhưng bền bỉ, khó thay đổi khi đã quyết.',
  'Song Tử': 'Mặt Trời ở Song Tử: bản ngã tò mò, linh hoạt, giao tiếp giỏi, đa năng. Khẳng định mình qua ý tưởng và ngôn từ, nhưng dễ phân tán.',
  'Cự Giải': 'Mặt Trời ở Cự Giải: bản ngã nhạy cảm, chăm sóc, gắn bó gia đình và ký ức. Khẳng định mình qua việc che chở người thân.',
  'Sư Tử': 'Mặt Trời ở Sư Tử: bản ngã tự tin, hào phóng, thích nổi bật và lãnh đạo. Cần được công nhận và tỏa sáng, đôi khi kiêu ngạo.',
  'Xử Nữ': 'Mặt Trời ở Xử Nữ: bản ngã phân tích, chỉn chu, phục vụ, cầu toàn. Khẳng định mình qua sự hữu ích và tiêu chuẩn cao, dễ tự chỉ trích.',
  'Thiên Bình': 'Mặt Trời ở Thiên Bình: bản ngã hài hòa, ngoại giao, yêu cái đẹp và công bằng. Khẳng định mình qua quan hệ, nhưng khó quyết đoán.',
  'Thiên Yết': 'Mặt Trời ở Thiên Yết: bản ngã mãnh liệt, thâm trầm, ám ảnh, trực giác mạnh. Khẳng định mình qua chiều sâu và quyền lực, ghét sự nông cạn.',
  'Nhân Mã': 'Mặt Trời ở Nhân Mã: bản ngã tự do, lạc quan, triết lý, phiêu lưu. Khẳng định mình qua chân lý và trải nghiệm, thẳng thắn đến vô duyên.',
  'Ma Kết': 'Mặt Trời ở Ma Kết: bản ngã kỷ luật, tham vọng, thực tế, kiên nhẫn. Khẳng định mình qua thành tựu dài hạn, có thể lạnh lùng.',
  'Bảo Bình': 'Mặt Trời ở Bảo Bình: bản ngã độc lập, sáng tạo, lý tưởng, nhân đạo. Khẳng định mình qua sự khác biệt và tầm nhìn tương lai.',
  'Song Ngư': 'Mặt Trời ở Song Ngư: bản ngã nhạy cảm, mơ mộng, đồng cảm, trực giác. Khẳng định mình qua sự hòa tan ranh giới và lòng từ bi, dễ chìm ảo tưởng.'
};

// =============================================================================
// 6. MOON_IN_SIGN — Mặt Trăng ở cung nào = cảm xúc & thế giới nội tâm
// =============================================================================
export const MOON_IN_SIGN = {
  'Bạch Dương': 'Mặt Trăng ở Bạch Dương: cảm xúc bùng nổ, mau giận mau quên, cần hành động ngay lập tức. Khó kiềm chế khi bị kích động, tìm an ủi qua vận động và thắng lợi.',
  'Kim Ngưu': 'Mặt Trăng ở Kim Ngưu (vị trí được tôn vinh - exalted): cảm xúc ổn định, cần an toàn vật chất và xúc giác. Điềm tĩnh, bền bỉ, chậm thay đổi, hưởng thụ qua giác quan.',
  'Song Tử': 'Mặt Trăng ở Song Tử: cảm xúc được xử lý qua suy nghĩ và nói chuyện, dễ thay đổi. Tìm an ủi qua giao tiếp, đọc và thông tin, khó ngồi yên với cảm xúc nguyên thủy.',
  'Cự Giải': 'Mặt Trăng ở Cự Giải (nhập nhà, chủ cung): cảm xúc cực sâu và nhạy, gắn bó mẹ và gia đình. Tìm an toàn trong tổ ấm và ký ức, dễ bị tổn thương, che chở người thân.',
  'Sư Tử': 'Mặt Trăng ở Sư Tử: cảm xúc cần được chú ý và công nhận, hào phóng, tự hào, kịch tính. Tìm an ủi qua sự sáng tạo, vui chơi và được yêu mến.',
  'Xử Nữ': 'Mặt Trăng ở Xử Nữ: cảm xúc được phân tích, hay lo lắng, chỉn chu. Thể hiện tình yêu qua phục vụ thiết thực và chăm sóc chi tiết, dễ kìm nén cảm xúc.',
  'Thiên Bình': 'Mặt Trăng ở Thiên Bình: cảm xúc cần hài hòa và đối tác, tránh xung đột. Quyết định phụ thuộc người khác, tìm an ủi qua vẻ đẹp và sự cân bằng.',
  'Thiên Yết': 'Mặt Trăng ở Thiên Yết (vị trí suy - fall): cảm xúc mãnh liệt, bí mật, ám ảnh, chiếm hữu. Khó tha thứ, đào sâu mọi thứ, giấu cảm xúc thật dưới lớp vỏ tĩnh lặng.',
  'Nhân Mã': 'Mặt Trăng ở Nhân Mã: cảm xúc lạc quan, cần tự do và di chuyển. Thẳng thắn về điều mình thấy, tìm an ủi qua phiêu lưu và triết lý, ghét bị trói buộc.',
  'Ma Kết': 'Mặt Trăng ở Ma Kết (vị trí suy - detriment): cảm xúc kìm nén, nghiêm túc, trách nhiệm. Khó biểu lộ yếu đuối, tìm an toàn qua kiểm soát và thành tựu, có vẻ lạnh.',
  'Bảo Bình': 'Mặt Trăng ở Bảo Bình: cảm xúc tách rời, khách quan, lý trí. Khó thân mật theo kiểu truyền thống, tìm an ủi qua hội nhóm và lý tưởng, giấu sự hiền lành bên trong.',
  'Song Ngư': 'Mặt Trăng ở Song Ngư: cảm xúc cực nhạy, mơ mộng, biên giới mờ. Đồng cảm vô điều kiện với nỗi đau người khác, dễ chìm vào ảo tưởng hay nghiện ngập, trực giác rất mạnh.'
};

// =============================================================================
// 7. ASCENDANT_MEANING — Cung mọc (Rising sign) = ngoại hình & mặt nạ
// =============================================================================
export const ASCENDANT_MEANING = {
  'Bạch Dương': 'Cung mọc Bạch Dương: ngoại hình năng động, góc cạnh, ấn tượng đầu tiên mạnh và nhiệt huyết. Bước ra thế giới như chiến binh, tiên phong, đôi khi hung hăng.',
  'Kim Ngưu': 'Cung mọc Kim Ngưu: ngoại hình ôn hoà, dễ đẹp, giọng nói êm, ấn tượng đầu thân thiện và chậm rãi. Kiên nhẫn, cứng đầu, yêu sự thoải mái.',
  'Song Tử': 'Cung mọc Song Tử: ngoại hình nhanh nhẹn, trẻ trung, mắt sáng, ấn tượng đầu tò mò và duyên. Nói nhiều, linh hoạt, dễ phân tán.',
  'Cự Giải': 'Cung mọc Cự Giải: ngoại hình hiền lành, mềm mại, ấn tượng đầu thân thiện nhưng e thẹn. Cảm xúc lộ rõ, che chở, gắn nhà.',
  'Sư Tử': 'Cung mọc Sư Tử: ngoại hình oai phong, bờm sư tử, ấn tượng đầu nổi bật và tự tin. Bước ra thế giới như sân khấu, cần chú ý, hào phóng.',
  'Xử Nữ': 'Cung mọc Xử Nữ: ngoại hình gọn gàng, kín đáo, ấn tượng đầu khiêm tốn và chỉn chu. Phân tích, hay lo, phục vụ, tinh tế.',
  'Thiên Bình': 'Cung mọc Thiên Bình: ngoại hình duyên dáng, nụ cười đẹp, ấn tượng đầu dễ mến và hài hòa. Ngoại giao, duyên, khó quyết đoán.',
  'Thiên Yết': 'Cung mọc Thiên Yết: ngoại hình sâu sắc, mắt sắc, ấn tượng đầu mãnh liệt và bí ẩn. Trầm, quyền lực, khó dò, thu hút.',
  'Nhân Mã': 'Cung mọc Nhân Mã: ngoại hình thường cao, năng động, ấn tượng đầu cởi mở và hài hước. Phiêu lưu, thẳng thắn, yêu tự do.',
  'Ma Kết': 'Cung mọc Ma Kết: ngoại hình nghiêm túc, xương rõ, ấn tượng đầu trưởng thành hơn tuổi. Kỷ luật, tham vọng, kiên nhẫn, có thể lạnh lùng.',
  'Bảo Bình': 'Cung mọc Bảo Bình: ngoại hình độc đáo, khác lạ, ấn tượng đầu thân thiện nhưng khách quan. Độc lập, dị biệt, đi trước thời đại.',
  'Song Ngư': 'Cung mọc Song Ngư: ngoại hình mơ hồ, mắt mờ sương, ấn tượng đầu nhạy cảm và thần bí. Dễ hòa tan, mơ mộng, lòng từ bi, ranh giới yếu.'
};

// =============================================================================
// 8. BAZI_WESTERN_MAP — ánh xạ khái niệm BaZi ↔ Western để so sánh
// =============================================================================
// LƯU Ý: đây là SO SÁNH TƯƠNG ĐƯƠNG CHỪNG, không phải tương đương 1-1.
// Hai hệ thống có nền tảng triết lý khác nhau; mọi phép so sánh đều có giới hạn.
export const BAZI_WESTERN_MAP = {
  dayMaster: 'Mặt Trời (Sun) — bản chất cốt lõi, danh tính trung tâm. Nhật Chủ (日主) BaZi ≈ cung Mặt Trời Western.',
  yong: 'Dụng Thần (用神) KHÔNG có tương đương trực tiếp — Western không có koncept «hành cần bổ sung để cân bằng». Gần nhất: phân tích element balance (thiếu/dư nguyên tố).',
  shishen_sun: 'Mặt Trời = cái tôi, gần với Nhật Chủ; Thập Thần như Chính Ấn/Thiên Ấn (mẹ/chăm sóc) gần Mặt Trăng, Thực Thương (sáng tạo) gần cung 5.',
  moon: 'Mặt Trăng = cảm xúc, mẹ, vô thức — gần với Thiên Ấn (正印/偏印 = mẹ, sự nuôi dưỡng) nhưng KHÔNG chính xác, vì Ấn còn mang nghĩa quyền lực/khác.',
  rising: 'Ascendant ≈ 外观 (ngoại quan / ấn tượng đầu) — KHÔNG có koncept tương đương trong BaZi (BaZi xem ngày sinh làm gốc, không dựa giờ sinh để ra "mặt nạ").',
  elements: 'Ngũ hành BaZi (Kim-Mộc-Thủy-Hỏa-Thổ) ≈ 4 nguyên tố Western (Hỏa-Thổ-Khí-Thủy) nhưng KHÁC HỆ: BaZi có 5 hành (có Mộc/Kim, không có Khí), Western có 4 (có Khí, không phân Kim-Mộc).',
  timing: 'Đại vận 10 năm BaZi ≈ chuyển động Sao Thổ (Saturn transit ~29,5 năm, Saturn return) Western, nhưng khác khung thời gian rất nhiều. Western dùng transit hành tinh theo năm/tháng.',
  strengths: 'BaZi vượng suy (nhật chủ mạnh/yếu) ≈ Western element balance (đặc biệt thiếu/dư hành) — cả hai đều đo độ cân bằng năng lượng bản đồ.',
  COMPARISON_NOTES: [
    'BaZi tất định theo ngũ hành sinh/khắc (5 hành, deterministic) — Western đa chiều (10 hành tinh × 12 cung × aspects), thiên về mô tả tính cách hơn tiên tri.',
    'Cả BaZi và Western đều KHÔNG được kiểm chứng khoa học — cảm giác «đúng quá» phần lớn là hiệu ứng Barnum (nhận định chung áp vào ai cũng thấy hợp).',
    'BaZi dùng giờ sinh để định Trụ Thời (thể hiện tuổi già, con cái) — Western dùng giờ sinh để tính Ascendant (mặt nạ bề ngoài). Cùng dùng giờ sinh nhưng ra kết quả khác hẳn.',
    'BaZi mạnh về Dụng Thần (hành cần bổ sung) → ứng dụng phong thủy/tên/đại vận rất cụ thể — Western mạnh ở mô tả tâm lý đa lớp (Sun/Moon/Rising + Venus/Mars...) nên thiên về self-discovery.',
    'Hai hệ thống sinh ra ở nền văn hóa khác nhau (Trung Hoa cổ vs Lưỡng Hà/Hy Lạp) nhưng CẢ HAI đều chia sẻ ý tưởng «moment sinh ra in dấu vận mệnh» — điểm chung cốt lõi.',
    'Ngũ hành BaZi có Mộc và Kim (không có Khí); Western có Khí (Gemini/Libra/Aquarius) mà không tách Kim/Mộc — nên không thể dịch 1-1 «Hỏa=Hỏa, Thủy=Thủy» một cách máy móc.',
    'Western có aspects (góc giữa hành tinh) tạo động lực nội tại — BaZi có địa chi暗合/hình xung hại hợp; đều nắm bắt «sự tương tác» nhưng công cụ khác nhau.',
    'Khuyến nghị thành thật: dùng cả hai như gương phản tỉnh đa góc, KHÔNG dùng để quyết định chuyện hệ trọng (hôn nhân, đầu tư lớn, y tế). Cảm giác chính xác ≠ sự thật.'
  ]
};

// =============================================================================
// Convenience: tra nhanh theo tên cung (Vietnamese)
// =============================================================================
export const WESTERN_SIGN_BY_NAME = Object.fromEntries(
  WESTERN_SIGNS.map(s => [s.name, s])
);
export const WESTERN_PLANET_BY_NAME = Object.fromEntries(
  WESTERN_PLANETS.map(p => [p.name, p])
);
export const WESTERN_HOUSE_BY_NUM = Object.fromEntries(
  WESTERN_HOUSES.map(h => [h.num, h])
);

// Tóm tắt module (dùng cho introspection / debug)
export const WESTERN_KB_META = {
  version: '1.0.0',
  system: 'Western Tropical Astrology (modern rulerships)',
  signs: WESTERN_SIGNS.length,
  planets: WESTERN_PLANETS.length,
  houses: WESTERN_HOUSES.length,
  aspects: Object.keys(WESTERN_ASPECTS).length,
  sunInSignKeys: Object.keys(SUN_IN_SIGN).length,
  moonInSignKeys: Object.keys(MOON_IN_SIGN).length,
  ascendantKeys: Object.keys(ASCENDANT_MEANING).length,
  disclaimer: 'Nội dung biểu tượng cổ truyền, không phải sự thật khoa học đã kiểm chứng. Tiếp nhận như gợi ý tự phản tỉnh.',
  sources: [
    'Cafe Astrology — Planetary Rulers of the Zodiac Signs (modern + traditional)',
    'Chani — Traditional vs Modern Astrology (bảng rulership)',
    'The Old Farmer\'s Almanac — Cardinal/Fixed/Mutable',
    'Liz Greene / Stephen Arroyo — nền tảng tâm lý Western hiện đại'
  ]
};
