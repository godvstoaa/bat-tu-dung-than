// ============================================================================
//  CƠ SỞ TRI THỨC HUYỀN HỌC (Knowledge Base)
//  Tri thức chuyên sâu về Thập Thần, Hội – Hợp – Xung – Hình – Hại, Cách Cục
//  và ánh xạ "lĩnh vực đời sống ↔ sao chủ sự". Dùng chung cho NLG & AI.
//  Nguồn: 子平真詮, 滴天髓, 窮通寶鑑, 渊海子平, 三命通會.
// ============================================================================
import { WX_VI, TEN_GOD_VI } from './constants.js';

// ---- 滴天髓 THIÊN CAN PHÚ (十干赋) — bản chất kinh điển từng Nhật Can ----
// Nguồn: 滴天髓 (Wikisource/ctext). Verse Hán đã đối chiếu; luận giải Việt dựa chú giải cổ.
export const DITIANSUI = {
  甲: {
    verse: '甲木參天，脫胎要火。春不容金，秋不容土。火熾乘龍，水蕩騎虎。地潤天和，植立千古。',
    vi: 'Giáp Mộc rậm rỡ vươn trời — muốn thoát thai non phải nhờ Hỏa.',
    nature: 'Giáp là đại thụ dương, cương kiện hùng tráng. Mộc vượng cần Hỏa mới phồn vinh bộc lộ ("thoát thai yếu hỏa"). Mùa xuân Mộc đương lệnh thì Kim (dụng cát) khó dung — Kim bị khắc mòn; mùa thu Mộc suy thì Thổ khó dung — Mộc suy khắc Thổ tổn lực. Hỏa quá vượng phải nhờ Thìn (rồng, Thổ tàng contain Đỉnh) để泄; Thủy quá vượng phải nhờ Dần (hổ, Mộc có căn) để chống ngập. Đất ẩm – trời hoà → trồng đứng ngàn năm (căn cơ vững, mới trường tồn).',
    need: 'cần Hỏa phát vinh; nặng thì cần Thủy (Thìn) hoặc Mộc căn (Dần) giữ cân',
  },
  乙: {
    verse: '乙木雖柔，刲羊解牛。懷丁抱丙，跨鳳乘猴。虛濕之地，騎馬亦憂。藤蘿繫甲，可春可秋。',
    vi: 'Ất Mộc tuy mềm mại nhưng có thể tựa dê (Mùi) cỡi trâu (Sửu).',
    nature: 'Ất là hoa cỏ dây leo, nhu thuận nhưng kiên cường — gặp Mùi/Sửu (Thổ ẩm tàng Hỏa) thì bám rễ tốt. ôm Đinh丙 (Hỏa) thì mộc hỏa thông minh. Dựa Dậu (phụng)/Thân (hầu) để leo cao. Nhưng nơi ẩm ướt thiếu dương (Hợi/Tý nhiều) thì dù có Ngọ (mã=Hỏa) cũng khó bừng lên. Điểm mấu chốt: "đằng la hệ giáp" — dây leo bám được đại thụ Giáp thì xuân thu đều tốt — Ất cần Giáp để tựa vào, hoặc thành "tượng mộc" vượng thế.',
    need: 'thích Hỏa (Đinh/丙) thắp sáng; ẩm quá cần dương; có Giáp tựa thì vượng',
  },
  丙: {
    verse: '丙火猛烈，欺霜傲雪。能煅庚金，逢辛反怯。土眾生慈，水猖顯節。虎馬犬鄉，甲木若狂。',
    vi: 'Bính Hỏa mãnh liệt, khinh sương ngạo tuyết — luyện được Canh Kim.',
    nature: 'Bính là mặt trời, dương hỏa thuần, mãnh liệt, không sợ Thủy khắc (khinh sương ngạo tuyết). Luyện được Canh Kim thành vật dụng. Nhưng gặp Tân (âm kim, châu ngọc) thì "phùng Tân phản khiếp" — Bính hợp Tân hoá Thủy, mất thế hỏa. Thổ nhiều thì giảm mãnh, sinh từ bi; Thủy vượng thì càng tỏ khí tiết. Dần-Ngọ-Tuất (hổ-mã-khuyển) tam hợp Hỏa thêm Giáp Mộc nuôi → Hỏa bùng cháy dữ, cần cẩn thận thái quá.',
    need: 'thích Canh Kim để luyện; kỵ Tân (hợp hoá Thủy); cần Ra Hỏa tiết hoặc Nhâm Thủy hiệp',
  },
  丁: {
    verse: '丁火柔中，內性昭融。抱乙而孝，合壬而忠。旺而不烈，衰而不窮。如有嫡母，可秋可冬。',
    vi: 'Đinh Hỏa nhu hoà, tính trong昭融 — ôm Ất hiếu, hợp Nhâm trung.',
    nature: 'Đinh là ngọn đèn/đom đóm, hỏa âm, nhu hoà mà nội tâm sáng ấm. Đinh có thể chế Kỷ Thổ ("ôm Ất") bảo vệ Ất Mộc khỏi bị thổ ú — gọi là hiếu. Đinh hợp Nhâm (đinh nhâm hợp hoá Mộc) — gọi là trung. Dù vượng không quá dữ, dù suy không tắt hẳn ("suy mà không cùng"). "Như hữu đích mẫu" — có Ấu (mẹ = Giáp/Mộc... thực ra mẫu = Giáp dương mộc) sinh thì thu đông cũng được — Đinh cần Mộc (nhiên liệu) mới sáng bền.',
    need: 'cần Mộc (nhất là Giáp) làm nhiên liệu; kỵ Quý Thủy tắt; hợp Nhâm hoá Mộc',
  },
  戊: {
    verse: '戊土固重，既中且正。靜翕動辟，萬物司命。水潤物生，火燥物病。若在艮坤，怕冲宜静。',
    vi: 'Mậu Thổ vững nặng, trung chính — tĩnh mở động đóng, vạn vật do đó quyết sinh mệnh.',
    nature: 'Mậu là núi, thành trì, dương thổ dày vững, trung chính. Tĩnh thì thu lại, động thì mở ra — chủ sinh mệnh vạn vật. Thủy nhuận thì vạn vật sinh trưởng; Hỏa quá táo thì sinh bệnh. Mậu ở cấn (Dần - đông bắc) / khôn (Thân - tây nam) thì sợ hình xung, nên tĩnh. Mậu cần Thủy (tài) để sinh vật, kỵ Hỏa quá táo.',
    need: 'thích Thủy nhuận sinh tài; kỵ Hỏa quá táo; sợ hình xung ở Dần/Thân',
  },
  己: {
    verse: '己土卑濕，中正蓄藏。不愁木盛，不畏水狂。火少火晦，火多火光。若要物旺，宜助宜幫。',
    vi: 'Kỷ Thổ thấp ẩm, ôn hoà chứa đựng — không sợ Mộc thịnh, không sợ Thủy cuồng.',
    nature: 'Kỷ là đất ruộng, âm thổ thấp ẩm, nhuận chứa đựng nuôi dưỡng. Vì mềm ẩm nên không sợ Mộc khắc thịnh (đất ẩm nuôi mộc), không sợ Thủy cuồng (đất hút nước). Nhưng Hỏa ít thì Thổ tối u, Hỏa nhiều thì Thổ cằn — cần Hỏa vừa đủ. "Muốn vạn vật vượng thì nên phù trợ" — Kỷ nhược cần Hỏa (Ấn) + Tỷ phù trợ mới nuôi dưỡng tốt. Kỷ khác Mậu: Kỷ nhu hoà, Mậu cương kiện.',
    need: 'thích Hỏa (tùy lượng) + Tỷ phù trợ; kỵ quá ẩm hoặc quá táo',
  },
  庚: {
    verse: '庚金帶煞，剛健為最。得水而清，得火而銳。土潤則生，土乾則脆。能勝甲兄，輸於乙妹。',
    vi: 'Canh Kim mang sát, cương kiện bậc nhất — được Thủy thì trong, được Hỏa thì sắc.',
    nature: 'Canh là kim loại thô (thiết), dương kim, cương mãnh mang sát khí. Được Thủy (tắm rửa) thì khí lưu thanh ("đắc thuỷ nhi thanh"); được Hỏa luyện thì khí thuần sắc bén ("đắc hỏa nhi nhiệm"). Thổ ẩm thì sinh Canh, Thổ khô thì Canh giòn dễ gãy. Canh mạnh đủ chặt Giáp ("huynh"), nhưng lại bị Ất hợp ("muội") → mất cương — Canh hợp Ất hoá Thổ. Canh cần Thủy/Hỏa để thanh/nhiệm; kỵ Thổ quá nặng (thổ nhiều kim quang lým).',
    need: 'thích Thủy (rửa thanh) + Hỏa (luyện sắc); kỵ Thổ quá nặng; hợp Ất hoá Thổ',
  },
  辛: {
    verse: '辛金軟弱，溫潤而清。畏土之疊，樂水之盈。能扶社稷，能救生靈。熱則喜母，寒則喜丁。',
    vi: 'Tân Kim mềm yếu, ôn nhuận trong sạch — sợ Thổ chất chồng, vui Thủy đầy.',
    nature: 'Tân là châu ngọc/trang sức, âm kim, thanh nhã nhạy cảm. Sợ Thổ chất chồng chôn vùi ("úy thổ chi điệp" — thổ nhiều làm mờ ánh kim), thích Thủy đầy rửa sạch tăng sáng ("lạc thuỷ chi doanh"). Tân có thể phù xã tắc (tế thế), cứu sinh linh (ông Bính... Tân hợp Bính). Nóng (Hỏa/Hạ) thì thích "mẫu" — Ấn (Thổ/Europe) che; lạnh (Đông) thì thích Đinh (Hỏa âm) sưởi. Tân cần Thủy rửa sáng; kỵ Thổ nhiều, kỵ Hỏa mạnh nung cháy.',
    need: 'thích Thủy (rửa sáng); kỵ Thổ nhiều chôn vùi, kỵ Đinh/丙 hỏa mạnh; lạnh cần Đinh',
  },
  壬: {
    verse: '壬水通河，能泄金氣。剛中之德，周流不滯。通根透癸，沖天奔地。化則有情，從則相濟。',
    vi: 'Nhâm Thủy thông Hà (sông lớn), tiết được khí Kim — đức cương trung, chảy không đọng.',
    nature: 'Nhâm là sông biển, dương thủy, thế nước lớn. Thông Hà (Hoàng Hà) → tiết được khí Kim (Kim sinh Thủy). Đức cương trung, lưu thông không ứ đọng. Thông căn (tại Thân/Hợi/Tý) hoặc "thấu Quý" (có Quý hỗ trợ) thì "xung thiên bôn địa" — nước cuồn cuộn tràn. "Hoá thì hữu tình" — Nhâm hợp Đinh hoá Mộc; "tòng thì tương tế" — theo thế mạnh. Nhâm mãnh, cần nguyên cục có kin cản (thổ đê) hoặc tiết (mộc) mới không tràn.',
    need: 'thích Mộc tiết hoặc Thổ đê ngăn; kỵ quá vượng không chế; hợp Đinh hoá Mộc',
  },
  癸: {
    verse: '癸水至弱，達於天津。龍德而運，化雨斯成。不愁火土，不論庚辛。合戊見火，化斯真矣。',
    vi: 'Quý Thủy chí nhược, tới tận Thiên Tân — rồng đức mà vận, hoá mưa mới thành.',
    nature: 'Quý là mưa móng/sương, âm thủy, chí nhược nhưng linh hoạt. Đạt "Thiên Tân" (thượng nguồn) — không sợ Hỏa/Thổ (âm thủy nhu hoà, hoá hơi thấm vào), không cần bàn Kim (Khắc/sinh nhẹ — "bất luận canh tân"). "Long đức nhi vận" — gặp Thìn (rồng) thì hoá mưa; Quý cần Mộc để tiết (nuôi mộc) hoặc Hỏa để cân (thủy hỏa ký tế). "Hợp Mộc kiến Hỏa" — Quý hợp Bính? không, Quý hợp Mậu (bính? ) → gặp Hỏa thì hoá Hỏa chân (Mậu Quý hoả hoá Hỏa). Quý mềm dẻo, phải giữ thế nhược mới tốt; kỵ Kim sinh làm mất đặc tính mưa.',
    need: 'thích Mộc tiết hoặc Hỏa ký tế; kỵ Kim sinh quá (làm thành thủy trầm); hợp Mậu hoá Hỏa',
  },
};

// ---- Ý NGHĨA SÂU CỦA THẬP THẦN ----
// Mỗi sao: { vi, nature, vượng, nhược, areas }
export const TEN_GOD_DEEP = {
  比肩: {
    vi: 'Tỷ Kiên',
    nature: 'Đồng hành với Nhật Chủ — bạn bè, anh em, đồng cấp, tính độc lập, sức bền, cạnh tranh ngang.',
    vuong: 'Cá tính độc lập, kiên cường, tự lập, ít chịu khuất phục; khi thái quá thì cố chấp, dễ tranh giành (đặc biệt tài lộc), quan hệ ngang bằng gây mâu thuẫn.',
    nhuoc: 'Biết khiêm nhường, dễ được bạn bè giúp đỡ; song thiếu chủ kiến, dễ bị chèn ép.',
    areas: 'hợp tác, anh em bạn bè, sức bền, cạnh tranh',
    spouse: 'nam: ít ảnh hưởng; nữ: hiếm',
  },
  劫財: {
    vi: 'Kiếp Tài',
    nature: 'Cạnh tranh giành giật, mạo hiểm, hào phóng, dễ hao tiền; sao chủ hao tổn tài lộc và xung đột quan hệ.',
    vuong: 'Dám nghĩ dám làm, năng động, giỏi giao tế; khi thái quá thì dễ phá tài, đầu cơ mạo hiểm, cứng rắn hay tranh chấp, hôn nhân nhiều sóng gió.',
    nhuoc: 'Ít rủi ro tài chính, biết tiết chế sự mạo hiểm.',
    areas: 'đầu cơ, vay mượn, mạo hiểm, xung đột, hao tài',
    spouse: 'nam: dễ xung khắc với vợ (đoạt tài)',
  },
  食神: {
    vi: 'Thực Thần',
    nature: 'Sao tài hoa, hưởng thụ, miệng lưỡi, nghệ thuật, lòng tốt, sinh tài; bình hòa, ôn hoà.',
    vuong: 'Tài hoa, duyên dáng, biết hưởng thụ,表达能力 tốt, phúc lộc; thái quá thì dễ lười biếng, ham hưởng thụ.',
    nhuoc: 'Thiếu động lực sáng tạo, cần rèn luyện kỹ năng.',
    areas: 'nghệ thuật, ẩm thực, giáo dục, y tế, sức khỏe, con cái (nữ mệnh)',
    spouse: 'nữ: sao con cái; chủ phúc',
  },
  傷官: {
    vi: 'Thương Quan',
    nature: 'Thông minh sắc sảo, sáng tạo, phản biện, khẩu tài, kiêu ngạo; sao chủ "phá quan" và sáng tạo.',
    vuong: 'Quá thông minh, giỏi kỹ thuật/nghệ thuật, khẩu chiến; khi thái quá thì ngạo mạn, dễ "thương quan kiến quan" sinh tai họa, hôn nhân nữ khắc phu.',
    nhuoc: 'Thiếu tự tin diễn đạt, ý tưởng chưa trọn.',
    areas: 'nghệ thuật, kỹ thuật, luật, truyền thông, phản biện, sáng tạo; nữ: con cái',
    spouse: 'nữ: sao khắc chồng (khắc phu) nếu vượng vô chế',
  },
  偏財: {
    vi: 'Thiên Tài (Phi Tài)',
    nature: 'Tài lớn, tài bất ngờ, tài đầu tư, hào phóng; nam là cha/vợ thứ.',
    vuong: 'Tài vận lớn, giỏi kinh doanh đầu tư, giao tế rộng; thái quá thì hao tiền, dễ sa vào tửu sắc.',
    nhuoc: 'Tiền đến đi nhanh, cần chủ động nắm bắt cơ hội.',
    areas: 'kinh doanh, đầu tư, tài bất ngờ, giao tế, hào phóng',
    spouse: 'nam: vợ thứ/người yêu/cha; sao cha',
  },
  正財: {
    vi: 'Chính Tài',
    nature: 'Tài ổn định, lương, cần mẫn, tiết kiệm, thực tế; nam là vợ chính.',
    vuong: 'Tài lộc đều đặn, chăm chỉ tiết kiệm, thực tế; thái quá thì keo kiệt, tham lam.',
    nhuoc: 'Hay lo âu tiền bạc, cần tích luỹ dần.',
    areas: 'lương, tài chính ổn định, tiết kiệm, cần mẫn',
    spouse: 'nam: sao vợ chính; đắc thì vợ hiền tài',
  },
  七殺: {
    vi: 'Thất Sát (Thiên Quan)',
    nature: 'Uy quyền, áp lực, dũng cảm, mạo hiểm, nguy hiểm, kỷ luật; sao chủ quyền uy và áp lực.',
    vuong: 'Uy mãnh, quả đoán, dũng cảm, có khí chất lãnh đạo; thái quá thì độc đoán, dễ gặp nguy hiểm, tai nạn, sức khỏe suy.',
    nhuoc: 'Hay sợ hãi, chịu áp lực nặng, sức khỏe và tinh thần yếu.',
    areas: 'quân sự, cảnh sát, quyền lực, quản lý khắc nghiệt, áp lực, nguy hiểm; nữ: chồng ngoại',
    spouse: 'nữ: chồng (đặc biệt chồng lớn tuổi/ngoài)',
  },
  正官: {
    vi: 'Chính Quan',
    nature: 'Luật lệ, trật tự, sự nghiệp, địa vị, tự trọng, danh vọng; nữ là chồng.',
    vuong: 'Quy củ, lãnh đạo稳重, có địa vị, tự trọng cao; thái quá thì bảo thủ, gò bó, ưu tư.',
    nhuoc: 'Thiếu tự tin, sợ trách nhiệm, khó thăng tiến.',
    areas: 'công chức, hành chính, quản lý, thi cử, danh vọng, luật pháp',
    spouse: 'nữ: sao chồng; đắc thì chồng hiền vinh',
  },
  偏印: {
    vi: 'Thiên Ấn (Kiêu Thần)',
    nature: 'Trí tuệ phi chính thống, trực giác, cô đơn, huyền học, tôn giáo, nghệ thuật lập dị.',
    vuong: 'Giỏi huyền học/tôn giáo/nghệ thuật kỳ lạ, trực giác nhạy; thái quá thì lập dị, cô độc, "kiêu thần đoạt thực" (khắc Thực Thần → hung).',
    nhuoc: 'Thiếu tự tin về tri thức, hay nghi ngờ.',
    areas: 'huyền học, tôn giáo, nghệ thuật phi chính thống, kỹ thuật chuyên sâu, tâm linh',
    spouse: 'ít liên quan; chủ mẹ nuôi',
  },
  正印: {
    vi: 'Chính Ấn',
    nature: 'Học vấn, bằng cấp, mẹ, sự bảo vệ, nhân từ, bao dung; sao chủ học thuật và_che chở.',
    vuong: 'Học vấn tốt, nhớ lâu, hiền lành, có phúc ấm; thái quá thì lười biếng, phụ thuộc, thiếu thực tế.',
    nhuoc: 'Thiếu sự hỗ trợ/bảo vệ, tự lập sớm.',
    areas: 'giáo dục, học thuật, nghiên cứu, văn hoá, bất động sản, y tế; chủ mẹ',
    spouse: 'ít liên quan; chủ mẹ',
  },
};

// ---- Ý NGHĨA CỦA CÁC TƯƠNG TÁC HỘI – HỢP – XUNG – HÌNH – HẠI ----
export const INTERACTION_MEANING = {
  ganHe: 'Thiên Can hợp → nhân duyên, cơ hội, sự nghiệp gắn kết; nếu hóa khí tốt thì càng lợi. Hợp thường mang tính "ràng buộc" nhẹ (dễ bị níu kéo).',
  zhiHe: 'Địa Chi lục hợp → quan hệ/gia đạo hòa hợp, nhân duyên; chi hợp hóa hành Dụng Thần thì rất tốt.',
  sanHe: 'Tam hợp cục → khí lực của một hành mạnh lên nhiều, tăng vượng cho hành đó (lợi nếu là Dụng, hại nếu là Kỵ).',
  sanHui: 'Tam hội phương → khí thế một phương cực mạnh, gần như đổi hướng cả cục.',
  chong: 'Xung → biến động, thay đổi, di chuyển, xung đột; xung trụ Ngày (cung phu thê) hay Năm (thái tổ) thường mang ý nghĩa biến động lớn.',
  xing: 'Hình → rắc rối pháp lý, thị phi, tổn thương, bệnh tật, đau đớn; tự hình thì hay tự gây rắc rối cho mình.',
  hai: 'Hại → trở ngại âm thầm, tiểu nhân, mất mát không rõ nguyên nhân, quan hệ ngầm bất hòa.',
};

// ---- HƯỚNG DẪN SÂU CHO TỪNG CÁCH CỤC (bổ sung cho PATTERN_PREF) ----
export const PATTERN_GUIDE = {
  正官格: 'Sự nghiệp ổn định, hợp công chức/quản lý; cần giữ gìn danh dự, tránh phạm pháp. Tốt nhất có Tài sinh quan, Ấn hộ quan.',
  七殺格: 'Sự nghiệp mạo hiểm có quyền; cần có Thực chế hoặc Ấn hóa mới an. Hợp quân/cảnh/kỹ thuật/doanh nghiệp khắc nghiệt.',
  正財格: 'Tài lộc ổn định, cần cù bù thông minh; hợp kinh doanh ổn định, tài chính. Kỵ Tỷ Kiếp đoạt tài.',
  偏財格: 'Tài lớn, tài đầu tư; hợp kinh doanh規 mô, đầu tư, giao tế. Kỵ Tỷ Kiếp.',
  正印格: 'Học vấn, phúc ấm; hợp giáo dục, nghiên cứu, văn hoá. Kỵ Tài phá Ấn.',
  偏印格: 'Trí tuệ đặc biệt, huyền học, nghệ thuật; cần Tài chế Kiêu. Cẩn thận "Kiêu đoạt Thực".',
  食神格: 'Tài hoa, phúc lộc; hợp nghệ thuật, giáo dục, ẩm thực, y. Kỵ Kiêu đoạt thực.',
  傷官格: 'Sáng tạo, phản biện; hợp kỹ thuật, luật, nghệ thuật. Tuyệt đối tránh "Thương quan kiến quan".',
  建祿格: 'Bản thân vượng, tự lập; phải tự lập nghiệp, Dụng cốt ở Tài – Quan.',
  月劫格: 'Cần Quan Sát chế hoặc Thương Quan hóa; tài lộc phải có vệ.',
  羊刃格: 'Sát khí nặng, tất phải Quan Sát chế nhận mới cát; hợp võ, quân sự, phẫu thuật.',
  曲直格: 'Chuyên vượng Mộc — nhân từ, nhân duyên; thuận thế phát tài bằng Thực Thương tiết tú.',
  炎上格: 'Chuyên vượng Hỏa — nhiệt huyết, lễ nghi; thuận thế tiết tú, kỵ Thủy phạm vượng.',
  稼穡格: 'Chuyên vượng Thổ — tín thực, bao dung; thuận thế tiết tú.',
  從革格: 'Chuyên vượng Kim — cương nghị, kỷ luật; thuận thế tiết tú.',
  潤下格: 'Chuyên vượng Thủy — trí tuệ, linh hoạt; thuận thế tiết tú.',
  從財格: 'Theo Tài — giàu có, trọng vật chất; thuận theo tài, kỵ giúp thân.',
  從殺格: 'Theo Sát — quyền uy, tất cả nhờ ngoại cảnh/sếp; kỵ phản kháng.',
  從兒格: 'Theo Thực Thương — tài hoa, sáng tạo; kỵ Ấn đoạt thực.',
  從旺格: 'Theo vượng thế — một lòng tiến theo thế mạnh, kỵ nghịch.',
};

// ---- ÁNH XẠ LĨNH VỰC ĐỜI SỐNG ↔ SAO CHỦ SỰ ----
// Dùng để trả lời câu hỏi tự do: biết lĩnh vực → biết sao/hành nào chủ đạo.
export const LIFE_AREA_INDEX = {
  career: { gods: ['正官', '七殺', '正印', '偏印'], title: 'Sự nghiệp & công danh', focus: 'Quan – Ấn' },
  wealth: { gods: ['正財', '偏財', '食神', '傷官'], title: 'Tài lộc', focus: 'Tài – Thực Thương' },
  love: { gods: ['正財', '偏財', '正官', '七殺'], title: 'Tình duyên & hôn nhân', focus: 'sao phối ngẫu' },
  health: { gods: [], title: 'Sức khỏe', focus: 'cân bằng Ngũ Hành – tạng phủ' },
  study: { gods: ['正印', '偏印', '食神', '傷官'], title: 'Học vấn & trí tuệ', focus: 'Ấn – Thực Thương' },
  children: { gods: ['食神', '傷官', '正官', '七殺'], title: 'Con cái', focus: 'sao con (nam: quan, nữ: thực thương)' },
  family: { gods: ['正印', '偏印', '正財', '正官'], title: 'Gia đạo', focus: 'Ấn(cha mẹ) – Tài(nam: vợ) – Quan(nữ: chồng)' },
  travel: { gods: ['偏財', '七殺', '食神'], title: 'Di chuyển – nước ngoài', focus: 'Dịch Mã – Tài – Sát' },
  power: { gods: ['七殺', '正官', '将星'], title: 'Quyền lực – lãnh đạo', focus: 'Quan Sát – Tướng Tinh' },
  timing: { gods: [], title: 'Thời điểm – vận hạn', focus: 'Đại Vận / Lưu Niên vs Dụng Thần' },
  personality: { gods: [], title: 'Tính cách – bản mệnh', focus: 'Nhật Chủ + Thập Thần vượng' },
};

// Tra: cho một lá số, trả THẬP THẦN nào vượng nhất (kể cả thiên + tàng chính)
export function dominantGods(chart, topN = 3) {
  const c = {};
  for (const key of ['year', 'month', 'time']) {
    const g = chart.pillars[key].ganGod;
    if (g && g !== '日主') c[g] = (c[g] || 0) + 1;
  }
  for (const key of ['year', 'month', 'day', 'time']) {
    const main = chart.pillars[key].hidden[0];
    c[main.god] = (c[main.god] || 0) + 0.5;
  }
  delete c['日主'];
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, topN)
    .map(([god, n]) => ({ god, vi: TEN_GOD_VI[god] || god, n }));
}

export { WX_VI, TEN_GOD_VI };
