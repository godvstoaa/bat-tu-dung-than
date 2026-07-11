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
    // [loop 1190] verse đối chiếu 滴天髓 cổ bản (Wikisource 滴天髓/02 + ctext 滴天髓阐微 ch.126492):
    //   侮雪 (bản cũ 傲雪 là dị bản hiếm), 成慈 (bản cũ 生慈 sai),
    //   «虎馬犬鄉，甲木若來，必當焚滅» — bản cũ ghi «甲木若狂» KHÔNG có trong nguồn cổ → sửa lại.
    verse: '丙火猛烈，欺霜侮雪。能煅庚金，逢辛反怯。土眾成慈，水猖顯節。虎馬犬鄉，甲木若來，必當焚滅。',
    vi: 'Bính Hỏa mãnh liệt, khinh sương coi thường tuyết — luyện được Canh Kim.',
    nature: 'Bính là mặt trời, dương hỏa thuần, mãnh liệt, không sợ Thủy khắc (khinh sương nhục tuyết). Luyện được Canh Kim thành vật dụng. Nhưng gặp Tân (âm kim, châu ngọc) thì "phùng Tân phản khiếp" — Bính hợp Tân hoá Thủy, mất thế hỏa. Thổ nhiều thì giảm mãnh, sinh từ bi; Thủy vượng thì càng tỏ khí tiết. Dần-Ngọ-Tuất (hổ-mã-khuyển = hỏa cục) mà Giáp Mộc lại đến thêm nhiên liệu → «甲木若來，必當焚滅» — Hỏa bùng dữ đến mức thiêu rụi, cần cẩn thận thái quá.',
    need: 'thích Canh Kim để luyện; kỵ Tân (hợp hoá Thủy); cần Thổ tiết Hỏa hoặc Nhâm Thủy hiệp',
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
    // [loop 1191] verse đối chiếu 任鐵樵闡微 (ctext ch.126492): câu 3 là «火少火晦，金多金光»
    //   (bản cũ «火多火光» SAI). 原注: «無根之火，不能生濕土，故火少而火反晦；濕土能潤金氣，故金多而金光彩».
    verse: '己土卑濕，中正蓄藏。不愁木盛，不畏水狂。火少火晦，金多金光。若要物旺，宜助宜幫。',
    vi: 'Kỷ Thổ thấp ẩm, ôn hoà chứa đựng — không sợ Mộc thịnh, không sợ Thủy cuồng.',
    nature: 'Kỷ là đất ruộng, âm thổ thấp ẩm, nhuận chứa đựng nuôi dưỡng. Vì mềm ẩm nên không sợ Mộc khắc thịnh (đất ẩm nuôi mộc), không sợ Thủy cuồng (đất hút nước). Hỏa vô căn ít thì tự tối u (không sinh được thấp thổ); Kim nhiều thì Kim thêm quang thải (thấp thổ nhuận Kim) — «火少火晦，金多金光». "Muốn vạn vật vượng thì nên phù trợ" — Kỷ nhược cần Hỏa (Ấn) + Tỷ phù trợ mới nuôi dưỡng tốt. Kỷ khác Mậu: Kỷ nhu hoà, Mậu cương kiện.',
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
    // [loop 1191] verse theo truyền bản phổ thông («龍德而運，化雨斯成 / 化斯真矣»).
    //   任鐵樵闡微 (ctext ch.126492) ghi dị bản «得龍而運，功化斯神 ... 化象斯真» — đồng nghĩa
    //   (đều: Quý nhược, gặp Thìn=rồng thì hoá, hợp Mậu kiến Hỏa thì hoá chân). Giữ cả vế [variant].
    verse: '癸水至弱，達於天津。龍德而運，化雨斯成。不愁火土，不論庚辛。合戊見火，化斯真矣。',
    vi: 'Quý Thủy chí nhược, tới tận Thiên Tân — rồng đức mà vận, hoá mưa mới thành.',
    nature: 'Quý là mưa móng/sương, âm thủy, chí nhược nhưng linh hoạt. Đạt "Thiên Tân" (thượng nguồn) — không sợ Hỏa/Thổ (âm thủy nhu hoà, hoá hơi thấm vào), không cần bàn Kim (Khắc/sinh nhẹ — "bất luận canh tân"). "Long đức nhi vận" — gặp Thìn (rồng) thì hoá mưa; Quý cần Mộc để tiết (nuôi mộc) hoặc Hỏa để cân (thủy hỏa ký tế). "Hợp Mộc kiến Hỏa" — Quý hợp Bính? không, Quý hợp Mậu (bính? ) → gặp Hỏa thì hoá Hỏa chân (Mậu Quý hoả hoá Hỏa). Quý mềm dẻo, phải giữ thế nhược mới tốt; kỵ Kim sinh làm mất đặc tính mưa.',
    need: 'thích Mộc tiết hoặc Hỏa ký tế; kỵ Kim sinh quá (làm thành thủy trầm); hợp Mậu hoá Hỏa',
  },
};

// ---- 滴天髓 «通論» (6 nguyên lý chẩn đoán xuyên suốt) ----
// Nguồn: 任鐵樵闡微 (ctext ch.126492) — verse + 原注/任氏注 đã đối chiếu trực tiếp.
// Bổ sung tầng nguyên lý cho điểm «trung hoà», luận xung, thuận-nghịch, tiến-thoái.
export const DITIANSUI_TONGLUN = {
  中和: {
    verse: '命貴中和，偏枯終於有損；理求平正，奇異不足為憑。',
    vi: 'Mệnh quý ở trung hoà — thiên khô rốt cuộc tổn hại; lẽ cầu ngay thẳng, kỳ dị không đủ tin.',
    apply: 'Bốn trụ Ngũ hành cân bằng, sinh hoá lưu thông thì cát; thiên lệch (một hành quá vượng/quá suy) thì hung. Cơ sở của điểm «trung hoà» trong lá số.',
  },
  顺逆: {
    cue: 'cốt ở Dụng Thần: hỷ dụng được sinh-thuận (tiếp nối)=cát; kỵ thần phản-nghịch chiến xung=hung',
    verse: '要與人間開聾聵，順逆之機須理會。',
    vi: 'Muốn mở tai điếc cho đời — phải理会 cơ «thuận nghịch».',
    apply: 'Thuận = sinh hoá tiếp nối有情; nghịch = phản khắc chiến xung. Cốt ở Dụng Thần: hỷ dụng sinh thuận thì cát, phản nghịch kỵ thần thì hung.',
  },
  进退: {
    cue: 'hỷ dụng nên đang TIẾN (tướng/vượng, khí đến); kỵ nên đang THOÁI (khí lui). Khí tiến quý hơn đỉnh sắp thoái',
    verse: '理承氣行豈有常，進兮退兮宜抑揚。',
    vi: 'Lý thừa khí mà hành đâu có thường — tiến,lùi nên kìm/nâng.',
    apply: 'Ngũ hành có tiến-thoái (tương lai giả tiến=khí đang đến; thoái nhi vô khí=khí đang lui). Hỷ dụng nên vượng tướng (đang tiến), kỵ nên休囚 (đang thoái). «相妙於旺» — khí đang tiến quý hơn khí đang đỉnh (sắp thoái).',
  },
  冲机: {
    cue: 'vượng xung suy→suy bật gốc (tổn); suy xung vượng→vượng KÍCH PHÁT thêm (hỷ=phúc, kỵ=hoạ)',
    verse: '旺者衝衰衰者拔，衰神衝旺旺神發。',
    vi: 'Vượng xung suy — suy bị bật gốc; thần suy xung thần vượng — vượng lại phát.',
    apply: 'Xung mạnh→yếu: yếu bị bật (tổn). Yếu→mạnh: mạnh bị kích phát thêm — phát thành phúc nếu là hỷ dụng, thành hoạ nếu là kỵ thần. Mấu chốt khi luận xung nguyên cục và đại vận/lưu niên vs trụ.',
  },
  阴阳支: {
    verse: '陽支動且強，速達顯災祥；陰支靜且專，否泰每經年。',
    vi: 'Dương chi động mạnh — ứng nhanh, rõ tai/cát; âm chi tĩnh chuyên — họa phúc mỗi phải qua năm mới thấy.',
    apply: 'Tý/Dần/Thìn/Ngọ/Thân/Tuất (dương chi) ứng nghiệm nhanh; Sửu/Mão/Tỵ/Mùi/Dậu/Hợi (âm chi) ứng chậm, phải đợi lâu mới hiện.',
  },
  生库败: {
    verse: '生方怕動庫宜開，敗地逢衝仔細推。',
    vi: 'Phương sinh sợ động, kho nên mở; đất bại gặp xung phải đoán kỹ.',
    apply: 'Dần/Thân/Tỵ/Hợi = sinh phương, kỵ xung (lưỡng bại câu thương); Thìn/Tuất/Sửu/Mùi = tứ khố, thường nên xung mở (mở kho tài/quan); Tý/Ngọ/Mão/Dậu = bại (độc khí), gặp xung phải xét hỷ/kỵ mà định.',
  },
  // [loop 1319] thêm 4 chương quan trọng từ 滴天髓阐微 (quanxue.cn/ctext verified)
  衰旺: {
    verse: '陰陽順逆之說，其理出《洛書》。',
    vi: 'Thuyết âm dương thuận nghịch — lý từ Lạc Thư.',
    apply: '«长生沐浴 등 danh từ giả tá hình dung» — không lấy trường sinh đoán vượng suy. Phải xem «đắc lệnh/đắc địa/đắc thế» + «khí tiến/thoái» (相妙於旺 = khí đang tiến quý hơn khí đỉnh sắp lui). Nhận diện vượng nhược = nền tảng luận mệnh.',
  },
  源流: {
    verse: '何處起根源？流到何方住？機括此中求，知來亦知去。',
    vi: 'Nguồn khởi từ đâu? Chảy đến phương nào dừng? Cơ quan cầu trong đó — biết tới cũng biết lui.',
    apply: 'Tìm «đầu nguồn» = hành mạnh nhất nguyên cục (thường đắc lệnh/đắc địa). Theo dòng sinh khắc xem «chảy» đến đâu. Dừng ở hỷ dụng = «tốt quy lộ»; dừng ở kỵ = hung. Dòng lưu thông = mệnh tốt.',
  },
  通关: {
    verse: '關上有關，關心始交；節外生枝，後來結果。',
    vi: 'Quan thượng hữu quan — tâm mới giao; tiết ngoại sinh chi — sau mới kết quả.',
    apply: 'Hai hành chiến khắc trong cục → cần «thông quan» = hành trung gian hoà giải (vd Thủy-Hỏa chiến → Mộc thông quan, Mộc sinh Hỏa + Thủy sinh Mộc). Có thông quan = cục «hoà» → phú quý.',
  },
  寒暖燥湿: {
    cue: 'KHÔNG thuần hàn(Kim/Thủy) hay thuần noãn(Mộc/Hỏa); cực hàn phải có noãn, cực noãn phải có hàn (liên kết 调候)',
    verse: '天道有寒暖，發育萬物，人道行之，不可過也。',
    vi: 'Thiên đạo có hàn noãn — phát dục vạn vật; nhân đạo hành, không thể quá.',
    apply: 'Hàn = kim thuỷ/đông/bắc; Noãn = mộc hoả/hạ/nam. «Hàn rất thịnh thì phải có noãn khí; noãn đến cực thì phải có hàn căn» — không thể thuần hàn hay thuần noãn. Liên kết 调候 (TIAOHOU).',
  },
  // [loop 1322] thêm 体用 + 月令 (quanxue.cn 第16-18章)
  体用: {
    cue: 'thể(日主) vượng→dụng TÀI/QUAN; thể nhược→dụng ẤN/TỶ. Thể-dụng tương sinh=cát, tương khắc=hung',
    verse: '道有體用，不可以一端求也。要在隨方解物，於微處見其眞。',
    vi: 'Đạo có thể/dụng — không thể cầu một phía. Phải theo phương mà giải vật, thấy chân ở chỗ vi tế.',
    apply: '«Thể» = Nhật Chủ (bản thân); «Dụng» = dụng thần (công cụ). Thể vượng → dụng tài/quan; thể nhược → dụng ấn/tỷ. Thể/dụng tương sinh = cát; tương khắc = hung.',
  },
  月令: {
    cue: 'dụng thần tìm TRƯỚC TIÊN tại nguyệt lệnh (bản khí+tàng can); thần đắc nguyệt lệnh=«chân thần»',
    verse: '月令乃提綱之府，譬如州邑之有門戶；人不得門戶而入，而於州邑之內，復求州邑，豈可得乎？',
    vi: 'Nguyệt lệnh = phủ提綱, như cửa thành — không vào cửa mà tìm trong thành, sao được?',
    apply: 'Nguyệt lệnh = cương lĩnh nguyên cục. Dụng thần TRƯỚC HẾT tìm tại nguyệt lệnh (bản khí + tàng can). Nếu nguyệt lệnh không dùng được, mới tìm elsewhere. «真神» = thần đắc nguyệt lệnh.',
  },
  // [loop 1323] thêm 生时 (quanxue.cn 第16章)
  生时: {
    verse: '生時乃歸宿之地，譬之墓也，人元為用事之神，墓之定方也，不可以不辨。',
    vi: 'Giờ sinh = nơi quy túc, ví như mộ — nhân nguyên (tàng can) là thần dụng sự, định phương mộ, phải biện.',
    apply: 'Trụ giờ = «nơi quy túc» của lá số — tàng can giờ cũng là «dụng sự thần». Giờ sinh hỷ dụng = «huyệt cát hướng cát»; giờ kỵ = giảm cát. Quan trọng nhưng KHÔNG hơn nguyệt lệnh.',
  },
  // [loop 1324] thêm 隐显 + 众寡 (quanxue.cn 第31-32章)
  隐显: {
    verse: '吉神太露，起爭奪之風；凶物深藏，成養虎之患。',
    vi: 'Cát thần quá lộ → khởi tranh đoạt; hung vật ẩn sâu → nuôi hổ thành hoạ.',
    apply: 'Hỷ thần lộ thiên can → dễ bị kiếp đoạt (cần quan/hợp chế vệ); kỵ thần ẩn tàng chi → khó chế, «nuôi hổ». «Cát thần thâm tàng = chung thân chi phúc; hung vật thâm tàng = thủy chung vi hoạ».',
  },
  众寡: {
    verse: '強眾而敵寡者，削去可以興旺；強寡而敵眾者，少制可以從旺。',
    vi: 'Mạnh nhiều địch ít →削弱 bớt rồi hưng; mạnh ít địch nhiều → ít chế rồi theo vượng.',
    apply: 'Đảng mạnh (nhiều hành/hào) gặp ít địch → cứ cắt bớt địch thì hưng; đảng yếu gặp nhiều địch → khó chế, nên «tòng vượng» (thuận theo). Liên kết «tòng cách».',
  },
  // [loop 1325] thêm 刚柔 + 震兑/离坎 (quanxue.cn 第27/33-34章)
  刚柔: {
    cue: 'vượng-cứng→tiết (thực thương) ĐỪNG khắc; nhược-mềm→sinh phù (ấn/tỷ) ĐỪNG khắc («dẫn» tính tình)',
    verse: '柔剛不一也，善為制者，但引其性情而已矣。',
    vi: 'Mềm cứng khác nhau — giỏi chế chỉ dẫn tính tình mà thôi.',
    apply: 'Mạnh cứng (đắc lệnh vượng) → cần «泄» (thực thương tiết tú) không «khắc» (ngược kích). Yếu mềm (thất lệnh) → cần «sinh phù» (ấn/tỷ) không «khắc». «Dẫn» = dẫn tính tình ngũ hành, không cưỡng chế.',
  },
  震兑离坎: {
    cue: 'Chấn(木)-Đoài(金) xung → sự nghiệp (thắng bại); Ly(火)-Khảm(水) giao → sức khoẻ/mệnh (tử sinh)',
    verse: '震兌之機，主勝負；離坎之際，定死生。',
    vi: 'Cơ Chấn-Đoài (Mộc-Kim) chủ thắng bại; ranh Ly-Khảm (Hỏa-Thủy) định tử sinh.',
    apply: 'Chấn(木)-Đoài( Kim) xung = chủ thắng bại (sự nghiệp). Ly(Hỏa)-Khảm(Thủy) giao = chủ tử sinh (sức khoẻ/mệnh). Hai cặp này xung khắc dữ → ảnh hưởng lớn nhất đến mệnh.',
  },
  // [loop 1326] thêm 精神 (quanxue.cn 第14章 + wikisource 阐微 §十四 — verse đối chiếu ≥5 nguồn độc lập)
  精神: {
    verse: '人有精神，不可以一偏求也，要在損之益之得其中。',
    vi: 'Mệnh có «tinh (精) – thần (神)», không thể thiên một bên; phải «tổn/gia» (giảm/bù) sao đạt trung hoà.',
    apply: '«Tinh» = Kim/Thuỷ (chất chứa, gốc), «thần» = Mộc/Hoả (linh hoạt, phát lộ), «thổ» = nền thật. Lá số cần tinh-thần tương xứng — có tinh thiếu thần = khô khan; có thần thiếu tinh = hư phù. «Tổn chi ích chi» = giảm (kỵ quá vượng) hay bù (kỵ quá suy) để đạt trung (liên kết 中和). Tinh-thần cân → mệnh có «quý khí».',
    cue: '精(金水)+thần(木火)+thổ phải cân; tổn/gia đạt trung, đừng thiên lệch',
  },
  // [loop 1328] thêm 贞元 + 配合 (quanxue.cn 第29/第七章 + wikisource 阐微 — verse đối chiếu ≥2 nguồn)
  贞元: {
    verse: '造化起於元，亦止於貞。再肇貞元之會，胚胎嗣續之機。',
    vi: 'Tạo hoá khởi từ «nguyên» (nguồn/đầu) cũng tận ở «trinh» (đích/cuối). Lập lại hội nguyên-trinh — cơ phôi thai nối tiếp (hậu duệ).',
    apply: '«Nguyên-trinh» = 4 pha 元亨利贞. Xem TỨ TRỤ: Niên=nguyên, Nguyệt=hanh, Nhật=lợi, Thời=trinh. Xem ĐẠI VẬN: cứ 15 năm = 1 pha (nguyên→hanh→lợi→trinh). «Nguyên-hanh vận cát» = nửa đời trước tốt; «lợi-trinh vận cát» = nửa đời sau tốt. Dùng đo KHI NÀO trong đời phúc/họa ứng — link với dayun stage.',
    cue: 'đo THỜI ĐIỂM ứng phúc/họa: năm=nguyên→giờ=trinh; mỗi 15 năm đại vận = 1 pha nguyên-hanh-lợi-trinh',
  },
  配合: {
    verse: '配合干支仔細詳，定人福禍與災祥。',
    vi: 'Phối hợp can chi phải xét kỹ — định phúc/hoạ/tai/cát của người.',
    apply: 'Can chi phải «phối hợp» (sinh/kị/hợp/hình/xung hài hoà, có lý). Xét kỹ «cơ tiến-thoái» (khí đến/lui) của từng cặp can-chi → đoán phúc hoạ. Nguyên cục can chi phối hợp lưu thông thì cát; tán loạn hay canh khắc lẫn nhau thì hung. Liên kết 干支总论 + 源流.',
    cue: 'can chi phải phối hợp hài hoà (sinh/hợp/khắc có lý); xét tiến-thoái từng cặp → đoán phúc hoạ',
  },
  // [loop 1330] thêm 形象 + 方局 (quanxue.cn 第10/11章 + wikisource 阐微 §十/§十一 — verse đối chiếu ≥2 nguồn)
  形象: {
    verse: '兩氣合而成象，象不可破也。',
    vi: 'Hai khí hợp mà thành «tượng» (hình tượng) — tượng KHÔNG được phá.',
    apply: '«Tượng» = nguyên cục chỉ 2 hành hợp thành một tượng thuần (vd thiên can Mộc + địa chi Hỏa = Mộc-Hỏa tượng). Tượng đã thành thì KHÔNG được «phá» = xuất hiện hành khắc tượng (vd Mộc-Hỏa tượng kỵ Thủy phá). Bao gồm: 从象 (Nhật Chủ cô lập vô khí → «tòng» theo Tài/Quan mà hưởng phú quý), 化象 (can hợp mà hoá khí). Liên kết «tòng cách» + pattern.',
    cue: '2 hành hợp thành «tượng» thuần → KHÔNG được hành khác phá (vd Mộc-Hỏa tượng kỵ Thủy)',
  },
  方局: {
    verse: '方是方兮局是局，要得方兮莫混局。',
    vi: 'Phương là phương, cục là cục — muốn lấy phương thì đừng lẫn cục.',
    apply: '«Phương» = tam phương cùng hướng: DầnMãoThìn=Mộc(Đông), TỵNgọVi=Hỏa(Nam), ThânDậuTuất=Kim(Tây), HợiTýSửu=Thủy(Bắc). «Cục» = tam hợp: HợiMãoMùi=Mộc, DầnNgọTuất=Hỏa, ThânTýThìn=Thủy, TỵDậuSửu=Kim. Đã lấy «phương» thì ĐỪNG trộn «cục» (vd DầnMãoThìn phương Mộc + thêm Mùi/Hợi → «hỗn cục», khí quá/thừa, giảm uy). Phải thuần thì khí mới vượng.',
    cue: '«phương»(3 chi cùng hướng: DầnMãoThìn…) khác «cục»(tam hợp: HợiMãoMùi…); lấy phương đừng trộn cục',
  },
};

// ---- 滴天髓 «何知章» (8 chẩn đoán phú – quý – bần – tiện – cát – hung – thọ – yểu) ----
// Nguồn: 滴天髓 (Wikisource 滴天髓/41 + ctext 滴天髓阐微 ch.126492), 原注 刘基, 疏 任铁樵.
// Đối chiếu ≥2 nguồn độc lập → đồng thuận; «官星有理會» (KHÔNG phải «自理會»), «財神終不真» (một số bản «反不真», đồng nghĩa).
// Mỗi mục: verse cổ + tiêu chí chẩn đoán (criterion) + ghi chú nguyên chú. Bổ sung (không thay) cho LIFE_AREA_INDEX.
export const DITIANSUI_HEZHI = {
  富: {
    verse: '何知其人富，財氣通門戶。',
    vi: 'Biết người sao thì giàu? — khí Tài lưu thông ra cửa ngõ.',
    criterion: 'Tài vượng mà Nhật Chủ cũng vượng (財旺身強), có Quan tinh vệ tài, Tài không bị Tỷ/Kiếp đoạt; cửa ngõ = Nguyệt Lệnh hoặc giờ có Tài thông đạt → Tài khí có sinh có泄, vượng suy điều hoà.',
    note: '原注: «財旺身強，官星衛財，忌印而財能壞印，喜印而財能生官，傷官重而財神流通，無財而暗成財局» — quy về "tài khí lưu thông".',
  },
  貴: {
    verse: '何知其人貴，官星有理會。',
    vi: 'Biết người sao thì quý? — Quan tinh «có lý hội» (có sinh có泄, vượng suy适中).',
    criterion: 'Lấy Quan/Sát làm dụng, Quan tinh có sinh (Tài sinh Quan) có泄 (Ấn hoá), vượng nhược适中, Nhật Chủ vượng đủ nhậm quan; không bị Thương Quan khắc phá.',
    note: '«官星有理會» = Quan tinh đắc vị, có sinh hữu泄, vượng suy适中 (Wikisource 滴天髓/41).',
  },
  貧: {
    verse: '何知其人貧，財神終不真。',
    vi: 'Biết người sao thì nghèo? — «Thần Tài rốt cuộc không thật».',
    criterion: 'Tài tinh hư — hoặc vô tài, hoặc bị Tỷ/Kiếp đoạt, hoặc quá suy không có căn, hoặc泄 tận. Tài «không chân» → nghèo.',
    note: 'Cổ bản «財神終不真» (dị bản «反不真», đồng nghĩa). Tài bất chân = nghèo mệnh.',
  },
  賤: {
    verse: '何知其人賤，官星總不見。',
    vi: 'Biết người sao thì hạ? — Quan tinh «tổng không thấy».',
    criterion: 'Nguyên cục vô Quan/Sát hoặc bị Thương Quan khắc tận, không có khí quý làm chủ tể danh vị → hạ tiện.',
    note: '«官星總不見» — vô quan (hoặc quan bị thương) thì không có quý khí.',
  },
  吉: {
    verse: '何知其人吉，喜神為輔弼。',
    vi: 'Biết người sao thì cát? — Hỷ thần làm phụ tá.',
    criterion: 'Hỷ/Dụng thần đắc vị (gần Nhật Chủ, ở tháng/giờ), được sinh phù không bị khắc → làm «phụ弼» cho Nhật Chủ → cát tường.',
    note: 'Hỷ thần (= dụng thần tương ứng) đắc vị, phụ tá Nhật Chủ.',
  },
  凶: {
    verse: '何知其人凶，忌神輾轉攻。',
    vi: 'Biết người sao thì hung? — Kỵ thần lần lượt đến công.',
    criterion: 'Kỵ thần nhiều, ở thế sinh vượng thuận, «輾轉» (xoay vần) khắc/thiên Nhật Chủ hoặc đoạt dụng thần → hung hiểm.',
    note: 'Kỵ thần «輾轉» đến công phạt Nhật Chủ = hung.',
  },
  壽: {
    verse: '何知其人壽，性定元神厚。',
    vi: 'Biết người sao thì thọ? — Tính yên định, nguyên thần dày.',
    criterion: 'Ngũ hành trung hoà, Nhật Chủ (nguyên thần) có căn hữu khí, thân vượng mà không thái quá; tính tình ổn định, mệnh cục yên → thọ.',
    note: '«性定» (tính yên) + «元神厚» (nguyên thần = Nhật Chủ dày) → thọ.',
  },
  夭: {
    verse: '何知其人夭，氣濁神枯了。',
    vi: 'Biết người sao thì yểu? — Khí uế, thần khô.',
    criterion: 'Ngũ hành nghịch loạn («氣濁»), Nhật Chủ vô căn hữu khí («神枯»), chiến khắc quá nặng không chế hoá → yểu.',
    note: '«氣濁» (khí uế loạn) + «神枯» (nguyên thần khô kiệt) → yểu.',
  },
};

// ---- 滴天髓阐微 «官杀 + 伤官 + 清浊 + 真假» (loop 1320, quanxue.cn/ctext) ----
// Các chương chuyên sâu về thập thần luận từ 滴天髓阐微 第21-26章.
export const DITIANSUI_SHISHEN = {
  官杀混杂: {
    verse: '官殺混雜來問我，有可有不可。',
    vi: 'Quan Sát hỗn tạp — có thể hỗn, có thể không.',
    apply: 'Thân vượng thì Sát làm Quan dùng (có thể hỗn); thân nhược thì Quan cũng thành Sát (không thể hỗn). «格格推详，以杀为重» — luận cách cục trước hết phải giải quyết vấn đề Sát. Lấy thực chế / ấn hoá / hợp lưu là các pháp chính.',
  },
  伤官: {
    verse: '傷官見官，禍百端；傷官傷盡，則為吉。',
    vi: 'Thương Quan kiến Quan → trăm hoạ; Thương Quan «thương tận» thì cát.',
    apply: '«Thương Quan kiến Quan» = hung chỉ khi Quan là dụng thần; nếu Thương Quan thịnh mà không thấy Quan (thương tận) thì反而 cát. Thương Quan bội ấn = dùng ấn chế thương, đại cát.',
  },
  清浊: {
    verse: '一清到底顯精神，管取平生富貴真；滿局濁令人壽夭，他家安好也淪傾。',
    vi: 'Một清新 đến đáy = phú quý chân; đầy cục浊 = yểu.',
    apply: '«Thanh» = ngũ hành thuần nhất, sinh hoá lưu thông, không tạp; «Trọc» = ngũ hành lộn xộn, khắc chiến, kỵ thần vương. Mệnh thanh = phú quý; mệnh trọc = bần tiện/yểu.',
  },
  真假: {
    verse: '令上尋其得其真，假神休要亂真神。',
    vi: 'Tìm chân thần tại nguyệt lệnh; giả thần đừng lẫn chân thần.',
    apply: '«Chân thần» = thần đắc lệnh tại nguyệt lệnh (dụng thần chân chính); «giả thần» = thần không đắc lệnh. Mệnh có chân thần = phú quý dài lâu; chỉ có giả thần = hư danh.',
  },
};

// ---- 滴天髓阐微 «伤官» 5 dụng pháp (loop 1321, quanxue.cn 第22章) ----
// [核心] «伤官见官为祸百端» chỉ khi thân nhược; nếu có ấn thì kiến quan 反有福.
// 任铁樵 phân 5 cách dụng: 伤官用印/用财/用劫/用伤/用官.
export const SHANGGUAN_5YONG = {
  用印: { condition: 'thân nhược + thương quan vượng', desc: 'dùng Ấn chế thương sinh thân — «thương quan bội ấn» đại cát; kiến quan phản hữu phúc (không phải hoạ)' },
  用财: { condition: 'thân vượng + thương quan vượng', desc: 'dùng Tài — thương sinh tài, lưu thông; kỵ ấn đoạt tài + kiếp tài phá cách' },
  用劫: { condition: 'thân nhược + tài trọng thương nhẹ', desc: 'dùng Tỷ Kiếp chế tài vệ thương; mệnh danh «dụng kiếp»' },
  用伤: { condition: 'thân vượng + vô tài quan', desc: 'dùng Thương发泄 tinh hoa, hỷ hành tài vận; kỵ ấn quan' },
  用官: { condition: 'thân vượng + tỷ kiếp nhiều + tài nhẹ thương nhẹ', desc: 'dùng Quan chế tỷ kiếp; «thương quan dụng quan» nghịch dụng đặc biệt' },
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
  ganChong: 'Thiên Can xung (Thất Sát: 甲庚/乙辛/丙壬/丁癸) → xung đột cương quyết giữa 2 lãnh vực trụ (vd Năm–Tháng = tổ bối ↔ phụ mẫu/sự nghiệp), dễ va chạm ý tưởng/quyết đoán, cần hạ hoả.',
  zhiHe: 'Địa Chi lục hợp → quan hệ/gia đạo hòa hợp, nhân duyên; chi hợp hóa hành Dụng Thần thì rất tốt.',
  sanHe: 'Tam hợp cục → khí lực của một hành mạnh lên nhiều, tăng vượng cho hành đó (lợi nếu là Dụng, hại nếu là Kỵ).',
  sanHui: 'Tam hội phương → khí thế một phương cực mạnh, gần như đổi hướng cả cục.',
  banHe: 'Bán hợp cục → 2/3 tam hợp, «chờ» chi còn lại đến trong đại vận/lưu niên thì thành cục đầy đủ (kích hoạt khi đủ 3 chi). Bán hợp nhẹ hơn tam hợp đầy đủ nhưng vẫn nghiêng về hành đó.',
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

// ---- 子平真詮 «八格» 用神/相神/忌 SÂU (PATTERN_GUIDE là 1-dòng) ----
// [loop 1226] Nguồn: ctext 子平真詮評注 + 知乎«论相神紧要» + 搜狐«论用神成败救应».
//   Cốt法: «用神 có sinh có hộ, có chế có hoá» — thiện (tài/quan/ấn/thực) thuận dụng, bất thiện (sát/thương/kiêu/kiếp) nghịch dụng.
export const PATTERN_DEEP = {
  正官格: { use: 'thuận dụng (thiện)', yong: 'Chính Quan', xiang: 'Tài (sinh quan) + Ấn (hộ quan, chế thương)', ji: 'Thương Quan khắc quan, hình xung phá hại' },
  七殺格: { use: 'nghịch dụng (bất thiện)', yong: 'Thất Sát', xiang: 'Thực Thần (chế sát) hoặc Ấn (hoá sát sinh thân)', ji: 'Tài ấn tịnh kiến (tài sinh sát, ấn đoạt thực)' },
  正財格: { use: 'thuận dụng', yong: 'Chính Tài', xiang: 'Thực Thần (sinh tài) + Quan (chế tỷ kiếp hộ tài)', ji: 'Tỷ Kiếp đoạt tài' },
  偏財格: { use: 'thuận dụng', yong: 'Thiên Tài', xiang: 'Thực Thương sinh tài + Quan hộ tài', ji: 'Tỷ Kiếp đoạt tài' },
  正印格: { use: 'thuận dụng', yong: 'Chính Ấn', xiang: 'Quan Sát (sinh ấn) + Tỷ Kiếp (chế tài hộ ấn)', ji: 'Tài phá ấn' },
  偏印格: { use: 'nghịch (khi đoạt thực) / thuận (khi hoá sát)', yong: 'Thiên Ấn', xiang: 'bản thân hoá sát sinh thân thì cát', ji: 'Kiêu đoạt thực (khi thực là dụng thì kỵ)' },
  食神格: { use: 'thuận dụng', yong: 'Thực Thần', xiang: 'Tài (thực sinh tài) / thân vượng', ji: 'Kiêu thần (thiên ấn) đoạt thực' },
  傷官格: { use: 'nghịch dụng (cần chế hoá)', yong: 'Thương Quan', xiang: 'Ấn («thương quan bội ấn») hoặc Tài (thương sinh tài thông quan)', ji: '«thương quan kiến quan» (gặp chính quan thì hung); thân nhược thương vượng kỵ vô ấn' },
  // [loop 1254] 3 cách đặc biệt (nguyệt lệnh = nhật can đồng khí, 《子平真诠评注»ctext ch.974137)
  建祿格: { use: 'thuận dụng (nguyệt lệnh=nhật can lộc, thân đã vượng)', yong: 'Tài/Quan', xiang: 'Tài/Quan lộ thiên, Thực Thương tiết tú («tài quan hỷ lộ thiên»)', ji: 'thân tái vượng, Tỷ/Kiếp trọng重, vô y' },
  月劫格: { use: 'thuận dụng (nguyệt lệnh=kiếp tài, đồng luận với kiến lộc)', yong: 'Quan (chế kiếp)', xiang: 'Tài sinh quan (hộ quan)', ji: 'Thương Quan phá quan' },
  羊刃格: { use: 'nghịch dụng (nguyệt lệnh=đế vượng dương can, sát khí trọng)', yong: 'Quan/Sát chế nhận', xiang: '«dương nhận giá sát» — nhận cường sát vượng vi mỹ; hoặc Thực chế / Ấn hoá', ji: 'sát bị hợp (không chế nhận), quan bị thương, vô chế tất bại' },
  // [loop 1255] 4 tòng cách (tòng = thuận theo thế mạnh, kỵ nghịch thế). Nguồn: 百度百科·从格 + 子平真诠评注.
  從財格: { use: 'tòng (thuận tài thế)', yong: 'Tài', xiang: 'Thực Thương sinh tài (thuận)', ji: 'Tỷ Kiếp đoạt tài (nghịch — phá cách)' },
  從殺格: { use: 'tòng (thuận sát thế)', yong: 'Sát', xiang: 'Tài sinh sát (thuận)', ji: 'Thực chế sát / Ấn hoá (nghịch — phá cách)' },
  從兒格: { use: 'tòng (thuận thực thương thế)', yong: 'Thực Thương', xiang: 'Tài («nhi hựu sinh nhi», lưu thông); bất phạ Tỷ Kiếp (vì tỷ sinh thực)', ji: 'Ấn đoạt thực (phá cách)' },
  從旺格: { use: 'tòng chuyên vượng (thuận thế)', yong: 'Ấn / Tỷ (thuận thế bang thân)', xiang: 'Thực Thương tiết tú (thuận tiết)', ji: 'Quan / Sát / Tài nghịch thế (khắc phạt phá cách)' },
  // [loop 1256] 5 chuyên vượng cách (mỗi ngũ hành 1格). Nguồn: 知乎«格局详解» + 百度百科«特殊命局».
  //   共通: hỷ Ấn (sinh vượng thần) + Tỷ (thuận thế) + Thực Thương tiết tú; kỵ Quan Sát (khắc vượng thần → phá cách).
  曲直格: { use: 'chuyên vượng mộc (mộc khí chuyên tụ)', yong: 'Mộc (tỷ)', xiang: 'Thủy (ấn sinh mộc) / Hoả (tiết tú)', ji: 'Kim (quan sát khắc mộc phá cách)', alias: '曲直仁壽' },
  炎上格: { use: 'chuyên vượng hoả', yong: 'Hoả', xiang: 'Mộc (ấn) / Thổ (tiết)', ji: 'Thủy (quan sát)', alias: '率性炎上' },
  稼穡格: { use: 'chuyên vượng thổ', yong: 'Thổ', xiang: 'Hoả (ấn) / Kim (tiết)', ji: 'Mộc (quan sát)', alias: '稼穡篤實' },
  從革格: { use: 'chuyên vượng kim', yong: 'Kim', xiang: 'Thổ (ấn) / Thủy (tiết)', ji: 'Hoả (quan sát)', alias: '金剛從革' },
  潤下格: { use: 'chuyên vượng thuỷ', yong: 'Thủy', xiang: 'Kim (ấn) / Mộc (tiết)', ji: 'Thổ (quan sát)', alias: '潤下靈秀' },
};

// ---- 子平 «六神» PHÂN CẤP quanh dụng thần (《子平真诠》) ----
// [loop 1232] Nguồn: 知乎«子平用神变化» + 百度百科«子平术». 6 thần (khác thập thần) xoay quanh dụng thần.
//   Thành cách: dụng ← tương ← hỷ. Phá cách: kỵ ← cừu → phá dụng/tương.
export const SHEN_HIERARCHY = {
  用神: { role: 'cách cục hạch tâm — thủ tự nguyệt lệnh', relation: 'cách chi chủ' },
  相神: { role: 'phụ tá dụng thần thành cách («luận cát hung dĩ tương thần vi trọng»)', relation: 'quân chi hữu tướng — vô tương thần thì cách phá' },
  喜神: { role: 'sinh phù dụng thần + điều hoà/chế hoá/thiên hậu (thông quan, dưỡng mệnh)', relation: 'hộ vệ dụng/tương' },
  忌神: { role: 'phá cách chi tự — khắc tổn dụng thần hoặc tương thần', relation: 'nguyên hung phá cách' },
  仇神: { role: 'sinh trợ kỵ thần (bang hung gián tiếp)', relation: 'kỵ thần chi lai nguyên' },
  闲神: { role: 'không sinh không khắc dụng thần — vô quan cách cục', relation: 'trung lập, ảnh hưởng nhỏ' },
};

// ---- 子平真詮 «取用神» 5 ĐẠI PHÁP + 月令取用 (nguồn cổ) ----
// Nguồn: 子平真詮評注 (徐乐吾, ctext ch.974137 / 太极书馆), 算准网, 知乎 — ≥2 nguồn.
// [源流] 扶抑/病药/调候/通关 = 徐乐吾评注归纳; 从化 = hậu nhân bổ sung; 原书核心 = 月令取用神.
export const YONGSHEN_METHOD = {
  月令: {
    vi: 'Nguyệt lệnh thủ dụng',
    principle: '«真詮以月令用神为经» — dụng thần cốt lấy từ Nguyệt Lệnh: bản khí/tàng can của chi tháng là «dụng» tiềm năng, rồi phối sinh khắc thành cách cục. Bản nghĩa原书.',
  },
  扶抑: {
    vi: 'Phù trảm (hỗ trợ/kìm hãm)',
    principle: '«虚则补之，盈则损之» — Nhật Chủ nhược thì phù (Ấn/Tỷ), vượng thì trảm (Tài/Quan/Thực Thương). Dùng khi Nhật Chủ mất cân bằng.',
  },
  病药: {
    vi: 'Bệnh dược (bệnh/thuốc)',
    principle: '«以扶为喜，则以伤其扶者为病；以抑为喜，则以去其抑者为病。除其病神，即谓之药» — tìm «bệnh» (kỵ thần phá dụng), «dược» = thần trừ bệnh chính là dụng thần.',
  },
  调候: {
    vi: 'Điều hậu (khí hậu)',
    principle: '«金水生于冬令需火暖，木火生于夏令需水润» — đông hàn cần Hỏa noãn, hạ nhiệt cần Thủy nhuận (bảng TIAOHOU — 窮通寶鑑).',
  },
  通关: {
    vi: 'Thông quan (bắc cầu)',
    principle: '«使克伐双方调和之物» — 2 hành chiến khắc, lấy hành trung gian «thông quan» (vd Thủy–Hỏa chiến → dụng Mộc) cho sinh hoá lưu thông hữu tình.',
  },
  从化: {
    vi: 'Tòng hoá (theo/hoá)',
    principle: '«从旺从弱，顺其格局取用» — cục chuyên vượng (曲直/炎上/稼穑/从革/润下) hoặc tòng cách (tòng tài/sát/ tử/ hoá) thì thuận thế, kỵ phản nghịch; hoá khí cách dùng hoá thần.',
  },
};

// ---- 子平 «用神 bất khả» DANH QUYẾT (nguồn: 滴天髓闡微 «知命章», 任铁樵引) ----
// [loop 1199] Nguyên lý «dụng» bảo vệ — cốt lõi của 取用神. Đối chiếu ctext 阐微 ch.126492.
export const ZIPING_YONG_MAXIM = {
  protect: '«用之为财不可劫，用之为官不可伤，用之印绶不可坏，用之食神不可夺» — 4 thần (Tài/Quan/Ấn/Thực) KHI là DỤNG thì không được để bị khắc phá: Tỷ đoạt Tài, Thương khắc Quan, Tài phá Ấn, Kiêu đoạt Thực.',
  inverse: '«不用财星尽可劫，不用官星尽可伤，不用印绶尽可坏，不用食神尽可夺» — 4 thần KHI KHÔNG là dụng thì dẫu bị khắc phá cũng không hại. Mấu chốt ở 1 chữ «用».',
  essence: 'Thần (Tài/Quan/Ấn/Thực) không vốn cát hung — giá trị tùy nó CÓ phải Dụng Thần hay không. Là dụng → phải bảo vệ; phi dụng → khắc chế cũng vô phòng.',
};

// ---- «五言独步» (渊海子平 卷四) — danh quyết luận mệnh 5 chữ ----
// [loop 1200] Nguồn: Wikisource 渊海子平 + ctext ch.901791. Trích 3 đoạn nổi bật nhất.
export const WUYAN_DUBU = {
  病药: {
    verse: '有病方为贵，无伤不是奇；格中如去病，财禄两相随。',
    vi: 'Có «bệnh» mới quý, không «thương» chẳng kỳ; trong cách như trừ được bệnh, tài lộc hai đằng theo.',
    apply: 'Bệnh = kỵ thần phá cách. Mệnh có «bệnh» (kỵ thần) mà có «dược» (dụng thần trừ bệnh) mới thật quý — «去 bệnh» thì tài lộc đến. Mệnh hoàn toàn vô thương thường bình phàm. (Cốt pháp 病药 — liên kết YONGSHEN_METHOD/ZIPING_YONG_MAXIM).',
  },
  建禄: {
    verse: '建禄生提月，财官喜透天；不宜身再旺，唯喜茂财源。',
    vi: 'Kiến lộc sinh tháng đề — Tài/Quan hỷ lộ thiên; không hợp thân lại vượng, chỉ hỷ tài nguồn tươi tốt.',
    apply: 'Cách 建禄 (nhật can đắc lộc tại nguyệt lệnh) — thân đã vượng, hỷ Tài/Quan lộ thiên, kỵ thân thêm vượng (Tỷ/Ấn), hỷ Thực Thương sinh Tài làm nguồn.',
  },
  方局: {
    verse: '寅卯多金丑，贫富高低走；南地怕逢申，北方休见酉。',
    vi: 'Dần/Mão nhiều Kim/Sửu — giàu nghèo lên xuống; phương Nam sợ gặp Thân, phương Bắc chớ thấy Dậu.',
    apply: 'Mộc (Dần/Mão) gặp nhiều Kim (Sửu/Thân/Dậu) khắc phạt → biến động giàu nghèo «cao thấp tẩu». Khẩu quyết phương-vị: Nam (Hỏa) kỵ Thân, Bắc (Thủy) kỵ Dậu — xung khắc phương.',
  },
};

// ---- «继善篇» (渊海子平 卷二) — 子平方法论纲领 ----
// [loop 1207] Trích đoạn mở đầu nổi tiếng. Nguồn: ctext 渊海子平 ch.524726 + 知乎/算准网.
export const JISHAN_PIAN = {
  总纲: { verse: '人禀天地，命属阴阳，生居覆载之内，尽在五行之中。', apply: 'Người禀 thiên địa, mệnh thuộc âm dương — sống trong trời đất, đều trong ngũ hành. Cơ sở vũ trụ luận của tử bình.' },
  月令: { verse: '欲知贵贱，先观月令乃提纲，次断吉凶。', apply: 'Muốn biết quý tiện — TRƯỚC xem Nguyệt Lệnh (提纲 = cương lĩnh), sau đoán cát hung. Nguyệt lệnh là «lệnh» của nguyên cục (khớp CLIMATE + 月令取用).' },
  日主: { verse: '专用日干为主本；三元要成格局，四柱喜见财官。', apply: 'Chuyên dụng NHẬT CAN làm chủ bản; tam nguyên (thiên/địa/nhân) phải thành cách cục, tứ trụ hỷ thấy Tài/Quan.' },
  用神: { verse: '用神不可损伤。', apply: 'Dụng thần không được tổn thương (khớp ZIPING_YONG_MAXIM «用之为财不可劫»).' },
  富贵: { verse: '财生官，官生印，印生身，富贵双全。', apply: 'Tài sinh Quan, Quan sinh Ấn, Ấn sinh thân — sinh hoá lưu thông tới thân → phú quý song toàn (cát cách điển hình).' },
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

// ============================================================
//  [research crawl] KIẾN THỨC HUYỀN HỌC MỞ RỘNG — đa trường phái
//  Nguồn: 渊海子平, 滴天髓, 穷通宝鉴, 三命通会, 紫微斗数全书, 子平真诠
//  Crawl từ: openfate.ai, bazifortune.app, fortunetell.ai, mingming3.com, kaigold.vn
//  Mục đích: nạp vào AI brief → LLM trả lời sâu hơn, đa góc nhìn
// ============================================================

// ---- 穷通宝鉴: 調候 (seasonal priority) cho từng Nhật Chủ × tháng ----
export const QIONGTONG_TIAOHOU = {
  // 木 Day Master
  '甲寅月': 'Mộc vượng mùa xuân → cần KIM cắt gọt hoặc HỎA tiết. Ưu tiên: Canh (庚) + Hỏa (丙).',
  '甲卯月': 'Dương Mộc rực rỡ → Geng-Kim cắt tỉa thành tài. Không kim → cần Hỏa tiết khí.',
  '甲巳月': 'Mộc mùa hè khô → gấp NƯỚC (癸) tưới. Không Thủy → Mộc héo, tài lộc hao.',
  '甲午月': 'Mộc bị Hỏa thiêu → cần 癸-Thủy +壬-Thủy ướt. Ưu tiên chính: Thủy dưỡng Mộc.',
  '甲申月': 'Mộc mùa thu Kim vượng → Mộc bị khắc → cần THỦY thông quan (Thủy hóa Kim sinh Mộc).',
  '甲亥月': 'Mộc mùa đông ướt lạnh → cần HỎA (丙) sưởi ấm. Quá nhiều Thủy → Mộc trôi, cần Thổ ngăn.',
  '乙寅月': 'Âm Mộc mùa xuân → ÍT Kim (chỉ Tân). Ưu tiên 丙-Hỏa cho Ất Mộc nở hoa.',
  '乙巳月': 'Âm Mộc mùa hạ → gấp 癸-Thủy. Không Thủy → hoa tàn nhanh, duyên ngắn.',
  '乙申月': 'Âm Mộc mùa thu → cần 丙-Hỏa + 壬-Thủy. "乙木申月,丙壬两全" — cổ诀.',
  '乙亥月': 'Âm Mộc mùa đông → 丙-Hỏa ưu tiên số 1. Thủy quá → Mộc trôi.',
  // 火 Day Master
  '丙寅月': 'Dương Hỏa mùa xuân Mộc sinh → Hỏa vượng → cần 壬-Thủy chế, 戊-Thổ泄.',
  '丙巳月': 'Hỏa mùa hạ cực vượng → GẤP 壬-Thủy + 庚-Kim. "丙火巳月,壬庚为上".',
  '丙申月': 'Hỏa mùa thu → Tài (Kim) vượng. Thân nhược cần Giáp-Mộc / 丙-Hỏa trợ.',
  '丙亥月': 'Hỏa mùa đông yếu → cần 甲-Mộc sinh Hỏa (Mộc là ấn = sinh ta). Ưu tiên Mộc.',
  '丁寅月': 'Âm Hỏa mùa xuân → 甲-Mộc là sinh mẫu. "丁火甲木,嫡母也" — cần Mộc.',
  '丁午月': 'Âm Hỏa mùa hạ cực thịnh → 壬-Thủy phối. "丁壬合" → vừa chế vừa hợp = đẹp.',
  '丁酉月': 'Tài vượng mùa thu → cần 甲-Mộc + 丙-Hỏa. "甲丙两全" cho Đinh thu.',
  '丁子月': 'Đinh gặp Tý mùa đông → "丁火逢冬,大忌水多" → cần 甲-Mộc + 戊-Thổ.',
  // 土 Day Master
  '戊寅月': 'Dương Thổ mùa xuân Mộc khắc → cần 丙-Hỏa sinh Thổ + 甲-Giáp tiết Mộc.',
  '戊巳月': 'Thổ mùa hạ → "戊土夏月,先看壬癸" → Thủy tưới Thổ mới sinh vạn vật.',
  '戊申月': 'Thổ mùa thu Kim thực → Thổ nhược → cần 丙-Hỏa + 丁-Hỏa trợ.',
  '戊亥月': 'Thổ mùa đông → Thổ lạnh cần 丙-Hỏa sưởi + 甲-Mộc xới Thổ.',
  '己寅月': 'Âm Thổ mùa xuân → 丙-Hỏa sinh + 癸-Thủy ướt + 甲-Mộc phối.',
  '己午月': 'Âm Thổ mùa hạ → gấp 癸-Thủy. "己土午月,先取癸水" — cổ诀.',
  '己酉月': 'Thổ mùa thu Kim thực → 丙-Hỏa ưu tiên. Kim quá → Thổ kiệt.',
  '己子月': 'Thổ mùa đông → 丙-Hỏa + 戊-Thổ trợ. "己土冬月,丙火为先".',
  // 金 Day Master
  '庚寅月': 'Dương Kim mùa xuân → cần 丁-Hỏa luyện + 甲-Mộc + 丙-Hỏa phối. "庚金劈甲引丁".',
  '庚巳月': 'Kim mùa hạ → 壬-Thủy + 癸-Thủy ưu tiên. Kim bị Hỏa khắc, cần Thủy chế Hỏa.',
  '庚申月': 'Kim mùa thu cực vượng → cần 丁-Hỏa luyện thành khí cụ + 甲-Mộc để Kim có việc.',
  '庚亥月': 'Kim mùa đông → "金寒水冷" → cần 丙-Hỏa + 丁-Hỏa sưởi ấm. Ưu tiên Hỏa.',
  '辛寅月': 'Âm Kim mùa xuân → 壬-Thủy + 甲-Mộc. "辛金寅月,壬甲为用".',
  '辛巳月': 'Âm Kim mùa hạ → 壬-Thủy + 己-Thổ + 癸-Thủy. "己壬两全".',
  '辛酉月': 'Tự vượng → cần 壬-Thủy tẩy rửa + 甲-Mộc. "辛金秋月,壬水淘洗".',
  '辛子月': 'Kim mùa đông → "金水伤官" → GẤP 丙-Hỏa + 丁-Hỏa. Nhiệt độ quyết định.',
  // 水 Day Master
  '壬寅月': 'Dương Thủy mùa xuân → Mộc tiết Thủy → cần 戊-Thổ + 丙-Hỏa + 庚-Kim.',
  '壬巳月': 'Thủy gặp Tài mùa hạ → "壬水巳月,戊癸并用" → Thổ ngăn + Thủy dưỡng.',
  '壬申月': 'Thủy mùa thu nguồn vượng → "壬水秋月,戊土为堤" → Thổ đắp đê ngăn Thủy.',
  '壬亥月': 'Thủy mùa đông cực vượng → "壬水冬月,戊丙并用" → Thổ + Hỏa phối.',
  '癸寅月': 'Âm Thủy mùa xuân → 庚-Kim + 丙-Hỏa + 甲-Mộc. "癸水寅月,辛金为源".',
  '癸巳月': 'Âm Thủy mùa hạ → 庚-Kim sinh + 壬-Thủy trợ + 丙-Hỏa.',
  '癸酉月': 'Thủy mùa thu Kim sinh → "金白水清" → cần 丙-Hỏa + 甲-Mộc phối.',
  '癸子月': 'Thủy mùa đông → "癸水冬月,丙火解冻" → Hỏa sưởi là ưu tiên số 1.',
};

// ---- 滴天髓 core maxims (任铁樵注) ----
export const DITIANSUI_MAXIMS = [
  '「欲识三元万法宗，先观帝载与神功」— Đầu tiên xem Nhật Chủ (đế) + Thập Thần (thần công) xung quanh.',
  '「坤元合德机缄通，五气偏全定吉凶」— Ngũ hành thiên lệch quyết định cát hung cả đời.',
  '「始终阴阳气流行，不必分老少与枯荣」— Khí chất Âm-Dương lưu thông là then chốt, không nhất thiết phân tuổi.',
  '「配合干支仔细详，定人福禄与寿夭」— Phối hợp Can-Chi của tứ trụ + đại vận → định phúc lộc thọ yểu.',
  '「寒甚暖至，燥甚湿至」— Lạnh quá cần ấm (调候), khô quá cần ướt. Đây là nguyên lý cốt lõi 穷通宝鉴.',
  '「旺者冲衰衰者拔，衰者冲旺旺者发」— Vượng xung suy → suy đổ; Suy xung vượng → vượng phát (cổ诀 xung).',
  '「何知其人富，财气通门户」— Biết người giàu: khí Tài thông cửa (Tài vượng + Dụng đến).',
  '「何知其人贵，官星有理会」— Biết người quý: Quan tinh có lý hội (Chính Quan thuần + Ấn hộ).',
  '「何知其人贫，财神反不真」— Biết người nghèo: Tài tinh bất chân (Tài bị khắc/xung/không vượng).',
  '「何知其人贱，官星还不见」— Biết người hèn: Quan tinh bất kiến (không Chính Quan hoặc bị thương).',
  '「何知其人寿，性定元神厚」— Biết người thọ: tính định, nguyên thần dày (Ấn vượng + Nhật Chủ vững).',
  '「何知其人夭，气息无所培养」— Biết người yểu: khí tức không dưỡng (Nhật Chủ nhược + Ấn bị khắc).',
  '「伤官见官，为祸百端」— Thương Quan gặp Chính Quan → họa (trừ khi "thương quan kiến quan" có Dụng đặc biệt).',
  '「官杀混杂，为人好色」— Quan/Sát hỗn tạp → tính phức tạp, duyên bên ngoài.',
  '「杀临身旺，职居方面」— Thất Sát gặp thân vượng → quyền chức lớn, lãnh đạo một phương.',
  '「财多身弱，富屋贫人」— Tài nhiều thân nhược → như người ở nhà giàu mà nghèo (chết đói giữa kho vàng).',
  '「印赖官生，官赖印护」— Ấn nhờ Quan sinh, Quan nhờ Ấn hộ. Quan-Ấn tương sinh = thăng tiến.',
  '「群比争财，财为祸胎」— Nhiều Tỷ Kiên tranh Tài → tài lộc là mầm họa (chia gia sản, tranh giành).',
];

// ---- 三命通会: đại vận nhập cảnh (大运入局) ----
export const SANMING_DAYUN_RULES = [
  'Đại vận thuận hành (âm-dương nam/nu都得): can quản 5 năm đầu, chi quản 5 năm sau → 10 năm = 1 đại vận.',
  'Can đại vận ưu tiên xem Thập Thần + Dụng/Kỵ. Chi đại vận ưu tiên xem 12 trưởng sinh + xung/hợp/hình.',
  'Đại vận Thiên khắc Địa xung với nhật trụ (天克地冲) = thập kỷ biến động lớn — tốt nếu mang Dụng, xấu nếu mang Kỵ.',
  'Đại vận 伏吟 (trùng nguyên cục) = đình trệ, buồn bã, "phản ngâm phục ngâm,泪淋淋".',
  'Đại vận 反吟 (thiên khắc địa xung với trụ cục) = động loạn, thay đổi đột ngột.',
  'Giai đoạn 25-45 tuổi = 2-3 đại vận quan trọng nhất → định sự nghiệp + hôn nhân.',
  'Giai đoạn 45-65 tuổi = đại vận vãn niên → sức khỏe + tích lũy + con cái.',
  'Đại vận đi vào cung Tài = cơ hội tài chính. Đi vào cung Quan = cơ hội sự nghiệp/thăng tiến.',
  'Đại vận đi vào cung Ấn = học tập/bằng cấp/nhà cửa/quý nhân. Đi vào Tỷ = cạnh tranh/hợp tác.',
  'Vận Tỵ-Dậu-Sửu (Kim cục) → người mệnh cần Kim sẽ phát. Vận Hợi-Mão-Mùi (Mộc cục) → người cần Mộc phát.',
];

// ---- 紫微斗数: 12 cung life reading (cross-reference với BaZi) ----
export const ZIWEI_PALACE_LIFE = {
  'Mệnh': { aspect: 'bản thân, tính cách, tiềm năng tổng quát', crossRef: 'Nhật Chủ + Thập Thần vượng' },
  'Huynh Đệ': { aspect: 'anh chị em, bạn bè, đồng nghiệp', crossRef: 'Tỷ Kiên / Kiếp Tài' },
  'Phu Thê': { aspect: 'vợ/chồng, hôn nhân, tình cảm', crossRef: 'Tài (nam) / Quan (nữ)' },
  'Tử Nữ': { aspect: 'con cái, sản phẩm sáng tạo', crossRef: 'Thực Thần / Thương Quan' },
  'Tài Bạch': { aspect: 'tiền bạc, tài lộc', crossRef: 'Chính Tài / Thiên Tài' },
  'Tật Ách': { aspect: 'sức khỏe, bệnh tật, tai nạn', crossRef: 'ngũ hành yếu + Thất Sát xung' },
  'Thiên Di': { aspect: 'du lịch, xuất ngoại', crossRef: 'Dịch Mã (驛馬)' },
  'Quan Lộc': { aspect: 'sự nghiệp, công danh', crossRef: 'Chính Quan / Thất Sát' },
  'Điền Trạch': { aspect: 'nhà cửa, đất đai', crossRef: 'Ấn + Thổ (nếu Thổ=Dụng)' },
  'Phúc Đức': { aspect: 'phúc đức, tâm linh, may mắn', crossRef: 'Ấn chính + Niên Trụ' },
  'Phụ Mẫu': { aspect: 'cha mẹ, người trên', crossRef: 'Ấn thiên can Niên/Nguyệt' },
};

export const WUXING_HEALTH = {
  '木': { organs: 'Gan, Mật, gân, mắt', symptoms: 'Đau đầu, tức giận, móng giòn, kinh không đều', diet: 'Ăn xanh/chua, tránh rượu+cay', emotion: 'Giận (怒伤肝)', remedy: 'Đi rừng, hít thở, thiền' },
  '火': { organs: 'Tim, Ruột non, mạch, lưỡi', symptoms: 'Hồi hộp, mất ngủ, lở miệng, đỏ mặt', diet: 'Ăn đỏ/đắng, tránh cafein', emotion: 'Vui thái quá (喜伤心)', remedy: 'Tĩnh tâm, nhạc nhẹ' },
  '土': { organs: 'Lách, Dạ dày, cơ, miệng', symptoms: 'Đau dạ dày, đầy bụng, lo âu', diet: 'Ăn vàng/ngọt tự nhiên, tránh lạnh', emotion: 'Lo âu (思伤脾)', remedy: 'Yoga, ăn ấm' },
  '金': { organs: 'Phổi, Đại tràng, da, mũi', symptoms: 'Ho, hen, xoang, táo bón, buồn', diet: 'Ăn trắng/cay nhẹ, tránh chiên', emotion: 'Buồn (悲伤肺)', remedy: 'Khí công, bơi' },
  '水': { organs: 'Thận, Bàng quang, xương, tai', symptoms: 'Đau lưng, tiểu đêm, tai ù', diet: 'Ăn đen/mặn nhẹ, tránh lạnh', emotion: 'Sợ (恐伤肾)', remedy: 'Ngâm chân nóng, đậu đen' },
};

export const CAREER_BY_GOD = {
  '正官': ['Quan chức', 'Quản lý', 'Luật sư', 'Hành chính', 'Giáo dục'],
  '七殺': ['Quân đội', 'Kinh doanh mạo hiểm', 'CEO', 'Bác sĩ phẫu thuật'],
  '正財': ['Kế toán', 'Tài chính', 'Ngân hàng', 'Bất động sản'],
  '偏財': ['Đầu tư', 'Chứng khoán', 'Sales', 'Marketing', 'Giải trí'],
  '正印': ['Giáo sư', 'Nghiên cứu', 'Y sĩ', 'Tôn giáo', 'Tâm lý'],
  '偏印': ['Nghệ sĩ', 'Huyền học', 'IT', 'Thiết kế', 'Nhà văn'],
  '比肩': ['Hợp tác', 'Quản lý nhân sự', 'Tổ chức cộng đồng'],
  '劫財': ['Sales', 'Môi giới', 'Bảo hiểm', 'Đấu giá'],
  '食神': ['Ẩm thực', 'Nghệ thuật', 'Giáo dục', 'Spa'],
  '傷官': ['Luật biện hộ', 'Diễn viên', 'Kỹ thuật cao', 'Khởi nghiệp'],
};

export const DIVINATION_SCHOOLS = {
  '八字': 'Mệnh lý — bản đồ đời. Mạnh: tổng quan + timing đại vận.',
  '紫微斗数': 'Mệnh lý — 12 cung + 14 chính tinh. Bổ sung chi tiết từng lĩnh vực cho BaZi.',
  '六爻': 'Chiêm sự — 6 hào + 6 thân. Mạnh: trả lời cụ thể 1 việc (có nên? kết quả?).',
  '梅花易数': 'Chiêm sự — khởi quẻ nhanh từ số/tên. Linh hoạt,万物可起卦.',
  '奇门遁甲': 'Chiêm sự + chiến lược — chọn thời điểm + hướng + chiến thuật.',
};

// ============================================================
//  ROUND 2 CRAWL — hôn nhân + tài vận + quý nhân chi tiết
//  Nguồn: discoveringrncp.hk, deeporacle.ai, openfate.ai, easternfate.com, zhihu
// ============================================================

// ---- HÔN NHÂN:配偶宫 (日支) đọc tính cách bạn đời ----
export const SPOUSE_PALACE_READING = {
  '子': { vi: 'Tý', traits: 'bạn đời thông minh, hoạt bát, có duyên bên ngoài, giao tiếp tốt. Thường đẹp/ngoại hình ưa nhìn.', marriage: 'hôn nhân cần không gian riêng, dễ ghen tuông nếu kìm kẹp' },
  '丑': { vi: 'Sửu', traits: 'bạn đời cần mẫn, kiên nhẫn, truyền thống, tiết kiệm. Có thể hơi bảo thủ.', marriage: 'hôn nhân bền vững, nhưng cần thêm lãng mạn' },
  '寅': { vi: 'Dần', traits: 'bạn đời can đảm, lãnh đạo, độc lập, có tham vọng sự nghiệp.', marriage: 'cần tôn trọng sự độc lập của nhau, tránh tranh giành quyền' },
  '卯': { vi: 'Mão', traits: 'bạn đời hiền lành, nghệ sĩ, duyên dáng, thích cái đẹp, nhẹ nhàng.', marriage: 'tình cảm nồng nàn nhưng dễ tổn thương — cần nâng niu' },
  '辰': { vi: 'Thìn', traits: 'bạn đời bao dung, thực tế, có uy, quản lý giỏi tài chính.', marriage: 'ổn định, nhưng bạn đời có thể hơi độc đoán' },
  '巳': { vi: 'Tỵ', traits: 'bạn đời sâu sắc, bí ẩn, trực giác mạnh, khôn ngoan.', marriage: 'cần tin tưởng tuyệt đối — bạn đời hay nghi' },
  '午': { vi: 'Ngọ', traits: 'bạn đời nhiệt huyết, thẳng thắn, quảng giao, đẹp trai/gái.', marriage: 'hôn nhân sôi nổi, cần kiểm soát cái tôi' },
  '未': { vi: 'Mùi', traits: 'bạn đời hiền hậu, chăm chỉ, gia đình là trên hết, nấu ăn giỏi.', marriage: 'ấm áp, bền lâu, nhưng thiếu bất ngờ' },
  '申': { vi: 'Thân', traits: 'bạn đời lanh lợi, hài hước, linh hoạt, thích phiêu lưu.', marriage: 'vui vẻ, nhưng cần cam kết lâu dài' },
  '酉': { vi: 'Dậu', traits: 'bạn đời sắc sảo, hoàn hảo, chú trọng ngoại hình, tự trọng cao.', marriage: 'đẹp đôi nhưng cái tôi mạnh — cần nhượng bộ' },
  '戌': { vi: 'Tuất', traits: 'bạn đời trung thành, nghĩa khí, bảo vệ gia đình, trực tính.', marriage: 'trung thành tuyệt đối, nhưng cứng đầu' },
  '亥': { vi: 'Hợi', traits: 'bạn đời lương thiện, bao dung, trí tuệ, thích giúp người.', marriage: 'êm đềm, nhưng bạn đời có thể quá tốt với người ngoài' },
};

// ---- KẾT HÔN TIMING: dấu hiệu đại vận/lưu niên kích hoạt hôn nhân ----
export const MARRIAGE_TIMING_SIGNALS = [
  'Đại vận mang Tài tinh (nam) / Quan sát (nữ) + Cát → cửa sổ hôn nhân mở',
  'Đại vận hợp Nhật Chi (Lục hợp / Tam hợp) → duyên đến',
  'Đại vận xung Nhật Chi → biến động hôn nhân (có thể kết hôn nếu chưa, hoặc biến cố nếu đã có)',
  'Lưu niên gặp Đào Hoa (寅午戌→卯, 申子辰→酉, 巳酉丑→午, 亥卯未→子) → duyên bên ngoài nồng',
  'Đại vận đi vào cung Phu Thê (紫微) hoặc Thiên Tài (nam) → ý nghĩa hôn nhân mạnh',
  'Lưu niên 天合地合 với Nhật Trụ → năm cực thuận hôn nhân',
  'Đại vận mang Thực Thần / Thương Quan (nữ) + Dụng → có con + duyên tốt',
  'Đại vận mang Ấn (nam/nữ) + Cát → mua nhà, ổn định, môi trường thuận hôn nhân',
  'Tuổi 25-35: cửa sổ hôn nhân tự nhiên (theo chu kỳ xã hội + đại vận)',
  'Phạm Phục Ngâm/Phản Ngâm Nhật Trụ trong đại vận → biến cố lớn hôn nhân (cần thận)',
];

// ---- TÀI VẬN:财富等级 (wealth tier) ----
export const WEALTH_TIERS = [
  { tier: 'Đại phú', conditions: ['Thân vượng + Tài vượng + Dụng = Tài', 'Tài có khố (辰戌丑未)', 'Thực thương sinh tài', 'Đại vận đi Tài/Thực thương 20-30 năm'], level: '9-10位数+' },
  { tier: 'Trung phú', conditions: ['Thân vượng + Tài bình vượng', 'Có Tài tinh + Dụng Hỷ tương trợ', 'Đại vận có 1-2 thập kỷ Tài Cát'], level: '8-9位数' },
  { tier: 'Tiểu phú', conditions: ['Thân bình + Tài bình', 'Tài tinh hiển nhưng không vượng quá', 'Đại vận có vài năm Tài Cát'], level: '6-8位数' },
  { tier: 'Trung bình', conditions: ['Thân Tài cân bằng', 'Không có Tài khố hoặc khố bị khóa', 'Đại vận bình thường'], level: '5-6位数' },
  { tier: 'Khó khăn', conditions: ['Thân nhược + Tài đa (tài đa thân nhược)', 'Tài bị xung/khắc', 'Đại vận Kỵ thần'], level: '<5位数' },
];

// ---- TÀI KHỐ (辰戌丑未) — kho chứa tài lộc ----
export const WEALTH_KU = {
  '辰': { vi: 'Thìn', stores: 'Thủy', note: 'Kho Thủy — tài lộc tích lũy qua giao tiếp, network, trí tuệ. Mở khi gặp Tuất (xung).' },
  '戌': { vi: 'Tuất', stores: 'Hỏa', note: 'Kho Hỏa — tài lộc qua nhiệt huyết, danh tiếng, sáng tạo. Mở khi gặp Thìn.' },
  '丑': { vi: 'Sửu', stores: 'Kim', note: 'Kho Kim — tài lộc qua kỷ luật, hệ thống, quản lý. Mở khi gặp Mùi.' },
  '未': { vi: 'Mùi', stores: 'Mộc', note: 'Kho Mộc — tài lộc qua phát triển, nuôi trồng, giáo dục. Mở khi gặp Sửu.' },
};

// ---- QUÝ NHÂN THẦN SÁT (天乙贵人) — ai giúp mình nhất ----
export const NOBLE_STAR_RULES = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['酉', '亥'], '丁': ['酉', '亥'],
  '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
};
export const NOBLE_STAR_NOTE = '天乙贵人 = người giúp mình khi khó khăn nhất. Chi năm sinh thuộc nhóm quý nhân = năm gặp贵人. Đại vận/lưu niên đi vào chi quý nhân → năm có người giúp. Chi quý nhân ở Nhật Trụ = bạn đời là quý nhân của mình.';

// ---- ĐÀO HOA (桃花) — duyên bên ngoài, hấp dẫn ----
export const PEACH_BLOSSOM_RULES = {
  '寅午戌': 'Mão (卯) — đào hoa tại Mão → duyên bên ngoài, hoa đào phương Đông',
  '申子辰': 'Dậu (酉) — đào hoa tại Dậu → duyên sang trọng, phương Tây',
  '巳酉丑': 'Ngọ (午) — đào hoa tại Ngọ → duyên rực rỡ, phương Nam',
  '亥卯未': 'Tý (子) — đào hoa tại Tý → duyên bí ẩn, phương Bắc',
};
export const PEACH_NOTE = 'Đào hoa = sao duyên, hấp dẫn giới tính. Có trong lá số = duyên tốt, dễ thu hút. Nhiều đào hoa = đa tình, cần tiết chế. Vị trí: Niên = duyên bẩm sinh, Nhật = duyên trong hôn nhân, Thời = duyên vãn niên.';

// ---- ĐẠI VẬN CỤ THỂ: từng thập niên chính yếu ----
export const DECADE_LIFE_THEMES = {
  '1-10t': 'Thiếu thời — nền móng gia đình + học vấn sơ khai. Ưu tiên: Ấn (mẹ, học).',
  '11-20t': 'Thanh xuân — học vấn, định hướng, tình cảm sơ khai. Ưu tiên: Ấn + Thực thương.',
  '21-30t': 'Khởi đầu đời — sự nghiệp, độc lập, hôn nhân. Ưu tiên: Tài/Quan + Đào hoa.',
  '31-40t': 'Phát triển — thăng tiến, tích lũy, gia đình. Ưu tiên: Tài + Quan + Dụng.',
  '41-50t': 'Đỉnh sự nghiệp — quyền lực, tài sản đỉnh. Ưu tiên: Quan/Sát + Dụng.',
  '51-60t': 'Thu hoạch — thành tựu, con cái trưởng thành. Ưu tiên: Ấn + Tỷ.',
  '61-70t': 'Vãn niên — sức khỏe, phúc đức, hưởng thụ. Ưu tiên: Ấn + Thực thần.',
  '71+': 'Cao niên — tâm linh, di sản, an hưởng. Ưu tiên: Thủy (trí tuệ) + Ấn.',
};

// ============================================================
//  ROUND 3 CRAWL — lưu niên chi tiết + phong thủy thực dụng
//  Nguồn: therainbow.hk, discoveringrncp.hk, wenyistudio.com, zhihu, 163.com
// ============================================================

// ---- LƯU NIÊN: từng năm 干支 → ngũ hành → tác động ----
export const ANNUAL_GANZHI_EFFECT = {
  '甲': { wx: '木', effect: 'năm Mộc — sinh trưởng, học hỏi, kế hoạch dài hạn. Thuận: cần Mộc/Khắc Thổ. Kỵ: Mộc vượng thêm.' },
  '乙': { wx: '木', effect: 'năm Âm Mộc — mềm mại, ngoại giao, nuôi dưỡng. Khác 甲: từ từ, tinh tế hơn.' },
  '丙': { wx: '火', effect: 'năm Dương Hỏa — rực rỡ, bộc lộ, danh tiếng. Thuận: cần Hỏa. Kỵ: Hỏa quá thiêu tài.' },
  '丁': { wx: '火', effect: 'năm Âm Hỏa — ấm áp, chiếu sáng, tâm linh. Thuận: cần Hỏa nhẹ. Kỵ: Hỏa trêu cợt Kim.' },
  '戊': { wx: '土', effect: 'năm Dương Thổ — ổn định, bất động sản, xây dựng. Thuận: cần Thổ. Kỵ: Thổ chôn Mộc/Thủy.' },
  '己': { wx: '土', effect: 'năm Âm Thổ — nuôi dưỡng, bao dung, nông nghiệp. Thuận: cần Thổ ẩm.' },
  '庚': { wx: '金', effect: 'năm Dương Kim — quyết đoán, cải cách, luật pháp. Thuận: cần Kim. Kỵ: Kim khắc Mộc.' },
  '辛': { wx: '金', effect: 'năm Âm Kim — trang sức, thẩm mỹ, tinh xảo. Thuận: cần Kim nhẹ.' },
  '壬': { wx: '水', effect: 'năm Dương Thủy — lưu thông, giao dịch, trí tuệ. Thuận: cần Thủy. Kỵ: Thủy quá ngập.' },
  '癸': { wx: '水', effect: 'năm Âm Thủy — mưa móc, nhu thuận, ẩn mình. Thuận: cần Thủy nhẹ.' },
};

// ---- 12 ĐỊA CHI NĂM → xung/hợp với tuổi ----
export const ANNUAL_ZHI_EFFECT = {
  '子': { effect: 'Tý — Thủy vượng. Xung Ngọ, hợp Sửu/Thân/Thìn. Đào hoa nhóm Thân-Tý-Thìn.' },
  '丑': { effect: 'Sửu — Thổ ẩm. Xung Mùi, hợp Tý/Tỵ/Dậu. Kim khố.' },
  '寅': { effect: 'Dần — Mộc vượng. Xung Thân, hợp Hợi/Mão/Mùi. Khởi đầu mùa xuân.' },
  '卯': { effect: 'Mão — Mộc cực vượng. Xung Dậu, hợp Tuất/Hợi/Mùi. Đào hoa.' },
  '辰': { effect: 'Thìn — Thổ ẩm. Xung Tuất, hợp Dậu/Tý/Thân. Thủy khố.' },
  '巳': { effect: 'Tỵ — Hỏa khởi. Xung Hợi, hợp Thân/Dậu/Sửu.' },
  '午': { effect: 'Ngọ — Hỏa cực vượng. Xung Tý, hợp Mùi/Dần/Tuất. Đào hoa.' },
  '未': { effect: 'Mùi — Thổ khô. Xung Sửu, hợp Ngọ/Mão/Hợi. Mộc khố.' },
  '申': { effect: 'Thân — Kim khởi. Xung Dần, hợp Tý/Thìn/Tỵ.' },
  '酉': { effect: 'Dậu — Kim cực. Xung Mão, hợp Thìn/Tỵ/Sửu. Đào hoa.' },
  '戌': { effect: 'Tuất — Thổ khô. Xung Thìn, hợp Mão/Dần/Ngọ. Hỏa khố.' },
  '亥': { effect: 'Hợi — Thủy khởi. Xung Tỵ, hợp Dần/Mão/Mùi.' },
};

// ---- PHONG THỦY THỰC DỤNG theo ngũ hành Dụng Thần ----
export const FENGSHUI_PRACTICAL = {
  '木': {
    direction: 'Đông / Đông Nam',
    colors: 'Xanh lá, xanh ngọc, nâu xanh',
    numbers: '3, 8',
    items: 'cây xanh, gỗ, giấy, sách',
    avoid: 'kim loại (đồ kim cắt Mộc), quá nhiều Hỏa',
    tip: 'Đặt cây cảnh ở phương Đông. Ngủ quay đầu Đông. Mặc xanh lá. Nuôi thú lông.',
  },
  '火': {
    direction: 'Nam',
    colors: 'Đỏ, hồng, cam, tím',
    numbers: '2, 7',
    items: 'đèn sáng, nến, đồ điện tử, ảnh gia đình',
    avoid: 'nước (Thủy khắc Hỏa), quá nhiều đất',
    tip: 'Đèn sáng ở phương Nam. Màu đỏ trong phòng khách. Hình tam giác.',
  },
  '土': {
    direction: 'Trung tâm / Đông Bắc / Tây Nam',
    colors: 'Vàng, nâu, be, vàng kem',
    numbers: '5, 0',
    items: 'gốm sứ, đá, pha lê, đồ bằng đất',
    avoid: 'gỗ (Mộc khắc Thổ), quá nhiều kim loại',
    tip: 'Pha lê ở trung tâm nhà. Gốm sứ trang trí. Hình vuông.',
  },
  '金': {
    direction: 'Tây / Tây Bắc',
    colors: 'Trắng, xám, bạc, vàng kim',
    numbers: '4, 9',
    items: 'kim loại, đồng hồ, chuông, đồ sắc bén',
    avoid: 'lửa (Hỏa khắc Kim), quá nhiều nước',
    tip: 'Đồng hồ kim loại ở phương Tây. Đồ inox/bạc. Hình tròn.',
  },
  '水': {
    direction: 'Bắc',
    colors: 'Đen, navy, xanh đậm, xám than',
    numbers: '1, 6',
    items: 'nước, bể cá, đài phun nước, gương',
    avoid: 'đất (Thổ khắc Thủy), quá nhiều cây',
    tip: 'Bể cá/đài phun ở phương Bắc. Gương phản chiếu. Sóng/uốn lượn.',
  },
};

// ---- CẢI VẬN 12 PHÁP (12 ways to improve luck) ----
export const TWELVE_LUCK_METHODS = [
  { name: 'Đổi hướng ngủ', detail: 'Quay đầu ngủ về hướng Dụng Thần (Đông=Mộc, Nam=Hỏa, Tây=Kim, Bắc=Thủy, Trung tâm=Thổ). 1/3 đời nằm ngủ = hấp th năng lượng 8 tiếng/ngày.' },
  { name: 'Màu sắc', detail: 'Mặc/đeo/trang trí màu Dụng Thần. Ảnh hưởng thị giác + tâm lý + năng lượng.' },
  { name: 'Phương vị', detail: 'Làm việc/ngồi hướng Dụng Thần. Bàn làm việc, ghế, giường — hướng tiếp nhận năng lượng.' },
  { name: 'Số điện thoại', detail: 'Số đuôi hợp ngũ hành Dụng (1,6=Thủy; 2,7=Hỏa; 3,8=Mộc; 4,9=Kim; 5,0=Thổ).' },
  { name: 'Thức - ngủ', detail: 'Giờ Dụng = giờ hành đó vượng (Tý/Hợi=Thủy, Ngọ/Tỵ=Hỏa, Dần/Mão=Mộc, Thân/Dậu=Kim, Thìn/Tuất/Sửu/Mùi=Thổ). Thức lúc đó = hấp th.' },
  { name: 'Ăn uống', detail: 'Thực phẩm ngũ hành: xanh/chua=Mộc, đỏ/cay=Hỏa, vàng/ngọt=Thổ, trắng/cay(Kim)=Kim, đen/mặn=Thủy.' },
  { name: 'Vận động', detail: 'Mộc: đi bộ/yoga; Hỏa: chạy/Cardio; Thổ: leo núi; Kim: tạ/đấu; Thủy: bơi/đạp xe.' },
  { name: 'Nghề nghiệp', detail: 'Nghề thuộc hành Dụng: Mộc=giáo dục/nông; Hỏa=IT/nghệ thuật; Thổ=BĐS/xây; Kim=tài chính/kỹ thuật; Thủy=giao thông/logistics.' },
  { name: 'Bạn bè', detail: 'Kết giao người mang Dụng Thần (xem lá số họ). Quý nhân tự đến.' },
  { name: 'Từ thiện', detail: 'Tích đức = cải vận cốt lõi. 「了凡四训」: nghịch thiên bằng thiện hạnh.' },
  { name: 'Tu học', detail: 'Học vấn/mở mang = Ấn (dưỡng Mộc/Thủy). Tri thức = năng lượng bền vững.' },
  { name: 'Phong thủy không gian', detail: 'Bố trí nhà theo Dụng Thần: hướng cửa, vị trí giường/bàn, màu tường, vật phẩm hóa giải.' },
];

// ---- DƯỠNG SINH:气功/ дыхание theo ngũ hành ----
export const QIGONG_BY_ELEMENT = {
  '木': 'Hít thở: hít vào sâu (sinh trưởng như cây), thở ra nhẹ. Tập: kéo giãn cơ, vươn người. Giờ tốt: 3-7h sáng (Dần-Mão).',
  '火': 'Hít thở: hít nhanh, thở mạnh (như lửa bùng). Tập: tim mở rộng, cardio. Giờ tốt: 9-13h (Tỵ-Ngọ).',
  '土': 'Hít thở: hít đều, thở chậm (ổn định như đất). Tập: đứng yên/thái cực, tập trung trung tâm. Giờ tốt: 7-9h sáng (Thìn).',
  '金': 'Hít thở: hít ngắn, thở dứt khoát (sắc bén như dao). Tập: thở bụng sâu, bài tập phổi. Giờ tốt: 3-7h sáng (Dậu-Tuất).',
  '水': 'Hít thở: hít sâu, thở chảy (uyển chuyển như nước). Tập: bơi, duỗi người. Giờ tốt: 15-19h (Thân-Dậu).',
};

// ============================================================
//  ROUND 4 CRAWL — 12 trưởng sinh + thần煞 nâng cao
//  Nguồn: zhihu专栏, baike.baidu, fatemaster.ai, scribd
// ============================================================

// ---- 12 TRƯỜNG SINH: ứng dụng theo độ tuổi ----
export const CHANGSHENG_AGE_APPLICATION = {
  '长生': { vi: 'Trường Sinh', meaning: 'mới sinh, nảy mầm — đầy sinh khí, khởi đầu', best: 'thiếu niên (1-20t) — tốt cho học, phát triển', worst: 'vãn niên (60+t) — sinh khí dư thừa, bứt rứt' },
  '沐浴': { vi: 'Mộc Dục', meaning: 'tắm rửa — chưa ổn định, dễ tổn thương, phiêu lưu', best: 'thanh niên (16-25t) — khám phá, thử thách', worst: 'trung niên (35-55t) — bất ổn sự nghiệp' },
  '冠带': { vi: 'Quan Đái', meaning: 'đội mũ — trang phục chỉnh tề, trưởng thành,仪表', best: 'thanh niên (18-30t) — tốt cho giao tiếp, ngoại giao', worst: 'không rõ' },
  '临官': { vi: 'Lâm Quan', meaning: 'làm quan — bắt đầu có quyền,踏入 xã hội', best: 'trung niên (25-45t) — thăng tiến sự nghiệp', worst: 'thiếu niên — quá trẻ để có quyền' },
  '帝旺': { vi: 'Đế Vượng', meaning: 'đỉnh thịnh — cực vượng, như nhật trung thiên', best: 'trung niên (30-50t) — đỉnh sự nghiệp', worst: 'vãn niên (60+t) — quá cứng, dễ gãy' },
  '衰': { vi: 'Suy', meaning: 'bắt đầu suy — từ đỉnh đi xuống', best: 'không ai muốn', worst: 'trung niên — vận bắt đầu giảm' },
  '病': { vi: 'Bệnh', meaning: 'mắc bệnh — yếu ớt, khó khăn', best: 'không ai muốn', worst: 'mọi tuổi — sức khỏe + sự nghiệp cùng giảm' },
  '死': { vi: 'Tử', meaning: 'chết — tĩnh lặng, hết sinh khí', best: 'vãn niên — tự nhiên', worst: 'thiếu niên/trung niên — rất xấu' },
  '墓': { vi: 'Mộ', meaning: 'nhập mộ — bị chôn vùi, ẩn tàng', best: 'không ai muốn', worst: 'trung niên — bị kìm hãm, đình trệ' },
  '绝': { vi: 'Tuyệt', meaning: 'tuyệt tự — hết hoàn toàn, kiệt', best: 'không ai muốn', worst: 'mọi tuổi — đáy vận' },
  '胎': { vi: 'Thai', meaning: 'thai nghén — chuẩn bị tái sinh, ấp ủ', best: 'sau Tuyệt — khởi đầu vòng mới', worst: 'không rõ' },
  '养': { vi: 'Dưỡng', meaning: 'nuôi dưỡng — được chăm sóc, hồi phục', best: 'sau Thai — chuẩn bị trưởng sinh', worst: 'không rõ' },
};

// ---- SÁU CẶP THẦN SÁT: ứng dụng nâng cao ----
export const SHENSHA_DEEP_MEANING = {
  '天乙贵人': {
    vi: 'Thiên Quý Nhân',
    effect: '「逢凶化吉」— gặp hung hóa cát. Người có quý nhân: lúc khó nhất tự nhiên có người giúp (thông tin, giới thiệu, chỉ đường — không nhất thiết vật chất).',
    timing: 'Đại vận/lưu niên đi vào chi quý nhân → năm đó gặp quý nhân. Chi quý nhân ở Nhật Trụ = bạn đời là quý nhân. Ở Niên Trụ = quý nhân bẩm sinh (ông bà giúp).',
    weaken: 'Bị xung (冲) / hình (刑) / không vương (空亡) → quý nhân yếu, đến chậm hoặc qua mặt.',
  },
  '文昌': {
    vi: 'Văn Xương',
    effect: 'Quản văn chương, nghệ thuật, học vấn, thi cử. Có Văn Xương → thông minh, giỏi chữ, dễ đỗ đạt.',
    application: 'Học sinh có Văn Xương → thi cử thuận. Người lớn → viết lách, truyền thông, sáng tạo. Văn Xương + Ấn → học thuật sâu.',
  },
  '驿马': {
    vi: 'Dịch Mã',
    effect: '「贵人驿马多升迁，常人驿马多奔波」— người có quý nhân gặp Dịch Mã → thăng tiến/đi công tác nước ngoài. Người thường → chạy vạy, bận rộn.',
    timing: 'Đại vận/lưu niên đi vào chi Dịch Mã → năm biến động: chuyển việc, chuyển nhà, đi xa, du học. Dịch Mã + Tài → kiếm tiền xa. Dịch Mã + Dụng → cơ hội mở.',
  },
  '桃花': {
    vi: 'Đào Hoa',
    effect: 'Nội đào hoa (Niên/Nguyệt trụ) → duyên bẩm sinh, hợp công chúng, nghệ sĩ. Ngoại đào hoa (Nhật/Thời trụ) → duyên bên ngoài sau hôn nhân, đa tình.',
    timing: 'Đại vận/lưu niên đi vào chi Đào Hoa → năm duyên nồng. Đào Hoa + Dụng → duyên tốt (lãng mạn, thu hút). Đào Hoa + Kỵ → thị phi tình cảm, bôi nhọ.',
    warning: 'Đào Hoa + Thương Quan / Thất Sát → duyên độc hại, dễ tổn thương. Đào Hoa + Kiếp Tài → tranh giành tình cảm.',
  },
  '华盖': {
    vi: 'Hoa Cái',
    effect: '「艺术之星」+ 「孤独之星」— tài năng nghệ thuật/khởi thuật THẾ nhưng cô độc, khác biệt, khó hòa nhập.',
    positive: 'Thiên về triết học, tôn giáo, huyền học, nghệ thuật, tâm linh. Thích độc lập sáng tạo. Hoa Cái + Ấn vượng → học giả/nghệ sĩ lớn.',
    negative: 'Cô độc, kiêu ngạo, khó gần. Hoa Cái gặp Không Vương → xuất gia, tu hành, lìa thế tục.',
  },
  '空亡': {
    vi: 'Không Vương',
    effect: '「空」= rỗng, hão, không thực. Cát thần gặp Không → cát giảm hung tăng. Hung thần gặp Không → hung giảm.',
    application: 'Dụng Thần gặp Không Vương → Dụng bị treo, không phát huy. Kỵ Thần gặp Không Vương → Kỵ bị triệt (tốt!). Quý Nhân gặp Không → quý nhân đến trễ/không đến.',
    remedy: 'Khi đại vận/lưu niên xung hợp chi Không Vương → Không bị lấp → Dụng/Kỵ phục hồi tác dụng.',
  },
};

// ---- ĐẠI VẬN GIAI ĐOẠN: 12 trưởng sinh của đại vận chi ----
export const DAYUN_CHANGSHENG_NOTE = [
  'Đại vận chi ở Trường Sinh / Quan Đái / Lâm Quan / Đế Vượng → 10 năm thuận lợi, sinh khí dồi dào.',
  'Đại vận chi ở Suy / Bệnh / Tử / Mộ / Tuyệt → 10 năm khó khăn, cần kiên nhẫn + giữ sức.',
  'Đại vận chi ở Thai / Dưỡng → giai đoạn ấp ủ, chuẩn bị, chưa bộc lộ — tốt cho kế hoạch dài hạn.',
  'Thiếu niên (1-20t) cần Trường Sinh / Quan Đái → môi trường nuôi dưỡng tốt.',
  'Trung niên (25-55t) cần Lâm Quan / Đế Vượng → đỉnh sự nghiệp.',
  'Vãn niên (55+t) KHÔNG cần Đế Vượng → quá cứng dễ gãy; cần Suy/Tử tự nhiên = thuận đạo.',
];

// ---- HUYỀN HỌC CƠ BẢN: triết lý âm dương + thái cực cho AI trả lời sâu ----
export const METAPHYSICS_CORE = [
  'Âm Dương: vạn vật đều có 2 mặt (âm-dương). Cát-hung, mạnh-yếu, nóng-lạnh, sáng-tối — luôn tồn tại song hành. 「孤阴不生，独阳不长」.',
  'Ngũ Hành Sinh Khắc: sinh = nuôi dưỡng (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc). Khắc = kiểm soát (Mộc→Thổ, Thổ→Thủy, Thủy→Hỏa, Hỏa→Kim, Kim→Mộc).',
  'Thiên Nh Địa Lợi: 「天时不如地利，地利不如人和」— thời vận < địa lợi < nhân hòa. Con người là quyết định cuối cùng.',
  'Luật Nhân Quả: 「积善之家必有余庆」— nhà tích thiện ắt có dư phúc. 「了凡四训」: nghịch thiên bằng thiện hạnh.',
  'Vật Cực Tất Phản: cực thịnh tất suy, cực suy tất thịnh. 「日中则昃，月盈则食」— mặt trời đứng bóng rồi nghiêng, trăng tròn rồi khuyết.',
  'Tri Mệnh Cải Vận: 「不知命无以为君子」— không biết mệnh không thể làm quân tử. Biết mệnh → thuận thiên → cải vận.',
];

// ============================================================
//  ROUND 5 CRAWL — 子平格局順用逆用 + 格局成破 + 傷官5格
//  Nguồn: 子平真詮評注 (8bei8.com), deeporacle.ai, zhihu, baike
// ============================================================

// ---- 格局順用/逆用: Dụng → Hỷ → Kỵ → Thù ----
export const PATTERN_SHUN_NI = {
  '正官格': { type: 'thuận', yong: 'Chính Quan', hy: ['Tài (sinh Quan)', 'Ấn (hộ Quan)'], ky: ['Thương Quan (khắc Quan)', 'Thất Sát (hỗn Quan)'], note: '「官來就我」— quan tinh thuần nhất, không tạp sát. Thương quan kiến quan = phá cách (trừ khi có ấn chế).' },
  '七殺格': { type: 'nghịch', yong: 'Thất Sát', hy: ['Thực Thần (chế sát)', 'Dương Nhận (hợp sát)'], ky: ['Tài (tài sinh sát → sát mạnh thêm)', 'Ấn (tư phù sát)'], note: '「殺來攻身」— sát khắc nhật chủ, cần THỰC THẦN chế hoặc thực/Dương Nhận hợp. 「制殺留財」= cao thủ.' },
  '正財格': { type: 'thuận', yong: 'Chính Tài', hy: ['Thực Thần (sinh tài)', 'Quan (hộ tài)'], ky: ['Tỷ Kiên/Kiếp Tài (tranh tài)', 'Thất Sát (tài sinh sát → tài hao)'], note: 'Thân cường tài vượng = phú quý. Thân nhược tài đa = 「tài đa thân nhược」.' },
  '偏財格': { type: 'thuận', yong: 'Thiên Tài', hy: ['Thực Thần', 'Quan'], ky: ['Tỷ/Kiếp (phá thiên tài)'], note: 'Thiên tài = tài lớn, đầu tư, kinh doanh. Dễ đến dễ đi — cần Quan hộ.' },
  '正印格': { type: 'thuận', yong: 'Chính Ấn', hy: ['Quan/Sát (sinh ấn)', 'Tỷ Kiên (hộ ấn)'], ky: ['Tài (tài hoại ấn)'], note: '「印赖官生」— ấn cần quan sinh. Tài khắc ấn = phá cách (trừ khi có quan sát giữa tài-ấn).' },
  '偏印格': { type: 'nghịch', yong: 'Phiên Ấn (枭神)', hy: ['Tài (chế枭)', 'Thực Thần (cần nhưng bị枭 đoạt)'], ky: ['Ấn vượng quá (khiến thực thần bị đoạt)'], note: '「枭神夺食」— rất xấu khi phiên ấn vượng + thực thần yếu. Cần TÀI chế枭.' },
  '食神格': { type: 'thuận', yong: 'Thực Thần', hy: ['Tài (thực sinh tài)', 'Thân vượng'], ky: ['Phiên Ấn/枭神 (đoạt thực)'], note: '「食神喜身旺」— thực thần cần thân vượng mới sinh tài được. 枭神夺食 = phá cách.' },
  '傷官格': { type: 'nghịch', yong: 'Thương Quan', hy: ['Ấn (chế thương = 「佩印」)', 'Tài (thương sinh tài = hóa)'], ky: ['Chính Quan (thương kiến quan = "vị祸百端")'], note: '5 subtype: 佩印/生財/傷盡/喜官/駕殺 — xem THUONG_GUAN_5_TYPES.' },
  '月刃格/建祿格': { type: 'nghịch', yong: 'Dương Nhận / Lộc', hy: ['Quan/Sát (chế nhẫn)', 'Thực Thần (tiết khí)'], ky: ['Tài (tài sinh sát → quá mạnh)', 'Ấn (quá ướp)'], note: '「阳刃喜官煞」— dương nhận cương mãnh, cần quan/sát chế.' },
};

// ---- 傷官 5 subtype ----
export const THUONG_GUAN_5_TYPES = {
  '伤官佩印': { vi: 'Thương Quan Bội Ấn', condition: 'thân nhược + ấn hữu căn + thương thực cường vượng', ky: 'tài (tài hoại ấn), quan (thương kiến quan)', best: 'học thuật, nghệ thuật, nghiên cứu — 「一印三用」' },
  '伤官生财': { vi: 'Thương Quan Sinh Tài', condition: 'thân cường + tài hữu căn', ky: 'tỷ kiếp (tranh tài), ấn (chế thương không cho sinh tài)', best: 'kinh doanh, đầu tư, buôn bán — thân cường thương vượng sinh tài = phú' },
  '伤官伤尽': { vi: 'Thương Quan Thương Tận', condition: 'không còn một chút quan tinh nào trong tứ trụ + đại vận', ky: 'quan tinh đến (khi quan đến = họa)', best: 'nghệ thuật, sáng tạo, tự do — 「傷盡」= không bị quan quản' },
  '伤官喜官': { vi: 'Thương Quan Hỷ Quan', condition: 'thân vượng + quan tinh hữu căn + thương quan chế lượng quan', ky: 'thân nhược (không gánh được)', best: '「傷官見官，妙在王侯」— chỉ tốt khi thân VƯỢNG' },
  '伤官驾杀': { vi: 'Thương Quan Già Sát', condition: 'thân cường + sát cường + thương quan chế sát', ky: 'ấn (ấn sinh sát → sát mạnh)', best: 'quân sự, kinh doanh mạo hiểm, quyền lực — thương + sát = 「将相之才」' },
};

// ---- 格局 thành/bại conditions ----
export const PATTERN_SUCCESS_FAIL = {
  '成格': 'Dụng thần hữu căn (có gốc ở tàng can), không bị xung/khắc/hợp hóa, có Hỷ thần bảo vệ = cách cục THÀNH → phúc lộc.',
  '破格': 'Dụng thần bị xung (冲), khắc (克), hoặc Kỵ thần quá mạnh không chế = cách cục PHÁ → cần đại vận bổ cứu.',
  '变格': 'Dụng thần ban đầu bị biến do透 can khác hoặc hợp hóa → dùng thần mới = BIẾN CÁCH (không hẳn xấu).',
  '救应': 'Kỵ thần khắc Dụng nhưng có Hỷ thần chế Kỵ = 「救应」→ cách cục tuy không hoàn hảo nhưng vẫn dùng được.',
};

// ---- 格局高低 ranking (子平真詮 ch.8) ----
export const PATTERN_QUALITY_RANKING = [
  'CAO: Dụng thuần nhất + Hỷ rõ + Kỵ bị chế + đại vận thuận → 「清」= cách cục thanh cao, phúc lộc song toàn',
  'TRUNG: Dụng hữu căn nhưng có tạp + đại vận xen kẽ cát/hung → phúc lộc nhưng sóng gió',
  'THẤP: Dụng bị phá + Kỵ mạnh không chế + đại vận nghịch → cần nỗ lực gấp đôi, 「浊」= cách cục trọc',
  'ĐẶC BIỆT: 「從格」(tòng cách) — toàn cục 1 hành/thần → dùng thần = hành/thần vượng nhất, cần thuận theo (從). 「從財」= giàu; 「從殺」= quý; 「從兒」= nghệ sĩ.',
];

// ---- 用神變化 (dụng thần có thể thay đổi) ----
export const YONGSHEN_VARIATION = [
  '用神 định ban đầu theo Nguyệt Lệnh → nhưng có thể BIẾN khi:',
  '1. Nguyệt Lệnh tàng can được 「透」(lộ can) → dùng can lộ thay zhi',
  '2. Hợp hóa (can hợp → hóa hành khác) → dụng thần đổi theo hành hóa',
  '3. Xung (chi bị xung) → Nguyệt Lệnh bị phá → tìm dụng thần khác',
  '4. Đại vận đến mang Hỷ/Kỵ → tạm thời ưu tiên chế Kỵ/hộ Dụng',
  '「用神變化」là tính thực tế của Tử Bình — không phải 1 lá số chỉ có 1 Dụng cố định. Dụng có thể đổi theo đại vận.',
];

// ============================================================
//  ROUND 6 CRAWL — 六亲断法 + 宮位法 + 星宮配合
//  Nguồn: zhihu六亲推断, 渊海子平六亲第四, starbook.ai, suanming.com.tw
// ============================================================

// ---- 六亲十神代表 (渊海子平) ----
export const LIUQIN_STAR = {
  male: { // nam mệnh
    father: 'Thiên Tài (偏財)', mother: 'Chính Ấn (正印)', grandfather: 'Thiên Ấn (偏印)',
    wife: 'Chính Tài (正財)', concubine: 'Thiên Tài (偏財)',
    brothers: 'Tỷ Kiên (比肩)', sisters: 'Kiếp Tài (劫財)',
    sons: 'Thất Sát (七殺)/Chính Quan (正官)', daughters: 'Thương Quan (傷官)/Thực Thần (食神)',
    superiors: 'Chính Quan (正官)', subordinates: 'Kiếp Tài (劫財)',
  },
  female: { // nữ mệnh
    father: 'Thiên Tài (偏財)', mother: 'Chính Ấn (正印)',
    husband: 'Chính Quan (正官)', lover: 'Thất Sát (七殺)',
    brothers: 'Tỷ Kiên (比肩)', sisters: 'Kiếp Tài (劫財)',
    sons: 'Thương Quan (傷官)', daughters: 'Thực Thần (食神)',
    mother_in_law: 'Thực Thần (食神)', father_in_law: 'Chính Quan (正官)',
  },
};

// ---- 六亲宮位: trụ nào = người nào ----
export const LIUQIN_PALACE = {
  year: { vi: 'Niên Trụ (Năm)', represents: 'ông bà, tổ tiên, cha mẹ (nam: Thiên Tài vị)', note: 'Niên Can = cha; Niên Chi = ông bà. Ngũ hành vượng = gia thế mạnh.' },
  month: { vi: 'Nguyệt Trụ (Tháng)', represents: 'cha mẹ, anh chị em, xuất thân', note: 'Nguyệt Lệnh = Dụng Thần → xuất thân tốt, gia đình giúp đỡ. Kỵ thần → xuất thân khó.' },
  day: { vi: 'Nhật Trụ (Ngày)', represents: 'BẢN THÂN + PHỐI NGẪU', note: 'Nhật Can = mình; Nhật Chi = cung Phu Thê (bạn đời). Xung/hợp Nhật Chi = biến động hôn nhân.' },
  time: { vi: 'Thời Trụ (Giờ)', represents: 'con cái, vãn niên, cấp dưới', note: 'Thời Trụ = Dụng → con cái có tài/phúc; vãn niên an hưởng. Kỵ thần → con cái bất hiếu hoặc vãn niên gian nan.' },
};

// ---- 星宮配合 nguyên tắc ----
export const STAR_PALACE_RULES = [
  'CUNG vượng + TINH cát → người đó tốt, phúc lộc → ví dụ: cung Phu Thê (Nhật Chi) vượng + Tài tinh (nam) hiển → vợ đẹp/giỏi.',
  'CUNG suy + TINH hung → người đó khó → ví dụ: cung Tử Nữ (Thời Chi) bị xung + Quan sát bị thương → con cái bất lợi.',
  'CUNG cát + TINH hung → môi trường tốt nhưng người xấu → ví dụ: Nhật Chi ủ Ấn (tốt) nhưng Tài tinh bị khắc → vợ nhà tốt nhưng tính cách xấu.',
  'CUNG hung + TINH cát → môi trường xấu nhưng người tốt → ví dụ: Nhật Chi bị xung nhưng Tài tinh vượng → vợ tính tốt nhưng hoàn cảnh khó.',
  '「星宫同参」— lúc nào cũng xem CẢ cung lẫn tinh, không chỉ xem 1 thứ. Cung = hoàn cảnh; Tinh = con người.',
  'Tinh không xuất hiện trong tứ trụ → người đó "không hiển" (có thể mất sớm, hoặc xa cách, hoặc không nổi bật).',
  'Tinh bị xung/khếtn trong cung đối ứng → người đó dễ có biến cố/sức khỏe vấn đề.',
];

// ---- 六亲 biến thông: khi sao không có trong tứ trụ ----
export const LIUQIN_FALLBACK = [
  'Nam không có Tài tinh → xem Nhật Chi (cung Phu Thê) + Thực Thương (tài nguyên sinh tài).',
  'Nữ không có Quan tinh → xem Nhật Chi + Tài tinh (tài sinh quan).',
  'Không có Ấn tinh → xem Thực Thương (khắc Ấn = "cái gì khắc Ấn cũng liên quan mẹ").',
  'Không có Tỷ Kiên → xem Nhật Can bản thân (Tỷ Kiên = sao huynh đệ, không có = ít anh chị em hoặc xa cách).',
  'Không có Quan/Sát → nam: xem Ấn (Ấn sinh thân, tính chất quản thúc); nữ: thiếu sao chồng.',
  '「星不现看宫，宫不现看星」— sao không thấy xem cung; cung không rõ xem sao. Luôn có cách đọc.',
];

// ---- 六亲 vận: đại vận tác động lên người nhà ----
export const LIUQIN_DAYUN_EFFECT = [
  'Đại vận xung Niên Trụ → biến động liên quan ông bà/cha mẹ (nếu Niên = cung cha mẹ).',
  'Đại vận xung Nguyệt Trụ → biến động cha mẹ/anh chị em.',
  'Đại vận xung Nhật Chi → biến động HÔN NHÂN (cung Phu Thê bị xung = sóng gió tình cảm).',
  'Đại vận xung Thời Trụ → biến động con cái/vãn niên.',
  'Đại vận mang Kỵ thần vào cung nào → người nhà对应 tổn thương (ví dụ: Kỵ = Mộc vào Nguyệt → mẹ/anh chị em ảnh hưởng).',
  'Đại vận mang Dụng vào cung nào → người đó được phúc → ví dụ: Dụng vào Thời → con cái phát đạt.',
  'Lưu niên xung/khắc sao nào → năm đó người对应 gặp biến (Thương Quan kiến quan lưu niên → chồng/vợ biến).',
];

// ============================================================
//  ROUND 7 CRAWL — 干支 interaction rules (合化/冲/刑/害 + đại vận tác động)
//  Nguồn: deeporacle.ai, zhihu, fatemaster.ai, ifeng.com, suanzhun.net
// ============================================================

// ---- 合化 CONDITIONS: khi nào hợp mới hóa? ----
export const HEHUA_CONDITIONS = [
  '化神 phải vượng tại Nguyệt Lệnh (tháng sinh) → mới đủ lực hóa',
  'Hợp thần không bị xung (冲) → nếu bị xung, hợp bị phân tán',
  'Hợp tốt nhất khi 2 can/chi LIỀN NHAU (cùng trụ hoặc kế tiếp) → xa nhau lực yếu',
  '天干五合: 甲己→土, 乙庚→金, 丙辛→水, 丁壬→木, 戊癸→火. Phải đủ điều kiện mới hóa.',
  '地支六合: 子丑→土, 寅亥→木, 卯戌→火, 辰酉→金, 巳申→水, 午未→火. Tương tự.',
  '「合而不化」= hợp nhưng không hóa → sao vẫn bị trói (không hoạt động) nhưng không biến hành → "hợp inhibits" chứ không "hợp transforms".',
  '三合 (申子辰/寅午戌/巳酉丑/亥卯未): KHÔNG cần hóa thần tại nguyệt lệnh — chỉ cần đủ 3 chi → tự thành cục. Lực mạnh hơn六合.',
  '三会 (寅卯辰/巳午未/申酉戌/亥子丑): phương vị cục → lực mạnh NHẤT. Đủ 3 chi cùng phương = hành đó cực vượng.',
];

// ---- 冲 刑 害 rules ----
export const CHONG_XING_HAI_RULES = [
  '六冲 (冲): 子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥. Xung = đối lập + xung đột + biến động. 「旺者冲衰衰者拔，衰者冲旺旺者发」.',
  '三刑 (刑): 寅巳申 (vô ân), 丑戌未 (trì thế), 子卯 (vô lễ). Xing = hình phạt, rắc rối pháp lý, tổn thương.',
  '自刑: 辰辰, 午午, 酉酉, 亥亥. Tự hình = tự làm khổ mình, ám ảnh, trầm cảm.',
  '六害 (害): 子未, 丑午, 寅巳, 卯辰, 申亥, 酉戌. Hại = ngấm ngầm phá hoại, âm mưu, bội phản.',
  'XUNG > HẠI > HÌNH (ưu tiên tác động): Xung mạnh nhất (đối trọng trực tiếp); Hại ngầm (âm ỉ); Hình kéo dài (pháp lý, sức khỏe).',
  'Đại vận/lưu niên XUNG Nhật Chi = biến động HÔN NHÂN mạnh nhất. XUNG Niên Chi = biến động gia đình/ông bà.',
  'Lưu niên XUNG Nguyệt Chi = biến động sự nghiệp/cha mẹ. XUNG Thời Chi = biến động con cái.',
];

// ---- 大运-流年-命局 TAM TẦNG TÁC ĐỘNG (君臣民 model) ----
export const LUCK_INTERACTION_RULES = [
  '「流年为君，大运为臣，命局为民」— Lưu niên = vua (quyết định năm nay), Đại vận = quan (môi trường 10 năm), Mệnh = dân (nền tảng bẩm sinh).',
  'Vua (lưu niên) có quyền sinh/khắc HẦN (đại vận) và DÂN (mệnh). Nhưng dân không thể khắc vua.',
  'Ưu tiên tác động: Tam hợp/Tam hội > Thiên hợp địa hợp > Thiên can tương hợp > Xung > Hình > Hại.',
  '大运 mang Dụng → 10 năm thuận (vua tốt gặp quan tốt). 大运 mang Kỵ → 10 năm khó (vua tốt nhưng quan xấu cản).',
  '流年 mang Dụng → năm đó thuận. 流年 mang Kỵ → năm đó khó. Vua quyết định năm nay cát/hung.',
  '当 大运+流年 ĐỀU mang Dụng → năm cực thuận 「岁运并临」(cần phân biệt: nếu cả 2 trùng nhau = 「岁运并临」có thể rất cát hoặc rất hung tùy Dụng/Kỵ).',
  '当 大运+流年 ĐỀU mang Kỵ → năm cực khó, cần phòng biến cố lớn.',
  '当 大运 Kỵ nhưng 流年 Dụng → năm được cứu (khó nhưng có lối thoát).',
  '当 大运 Dụng nhưng 流年 Kỵ → năm bị cản (thuận nhưng có trắc trở).',
  '「命好不如运好」— mệnh tốt (dân mạnh) không bằng vận tốt (quan + vua ủng hộ). Đại vận QUYẾT ĐỊNH hơn mệnh gốc.',
];

// ============================================================
//  ROUND 8 CRAWL — 紫微斗数 14 chính tinh + 四化 + sát/bần/triêu
//  Nguồn: baike.baidu, zhihu, sng-mia.com, purplestarmapper.com
// ============================================================

// ---- 14 CHÍNH TINH: tính cách + sự nghiệp ----
export const ZIWEI_14_STARS = {
  '紫微': { vi: 'Tử Vi', type: 'Đế vương', wx: 'Kỷ Thổ', personality: 'tôn quý, uy nghi, lãnh đạo bẩm sinh, kiêu ngạo, thích được tôn trọng', career: 'quản lý cấp cao, quan chức, giám đốc, lãnh đạo', love: 'bạn đời tôn trọng mình, cần người hầu cận' },
  '天机': { vi: 'Thiên Cơ', type: 'Quân sư', wx: 'Ất Mộc', personality: 'thông minh, phân tích, mưu lược, hay suy nghĩ quá nhiều, thần kinh', career: 'công nghệ, R&D, tư vấn, kế hoạch, đầu tư phân tích', love: 'bạn đời trí tuệ, cần không gian riêng' },
  '太阳': { vi: 'Thái Dương', type: 'Mặt Trời', wx: 'Bính Hỏa', personality: 'nhiệt huyết, bao dung, tỏa sáng, thích giúp người, dễ kiệt sức', career: 'giáo dục, chính trị, truyền thông, bán hàng, lãnh đạo', love: 'bạn đời ấm áp, hay hy sinh cho đối phương' },
  '武曲': { vi: 'Vũ Khúc', type: 'Tướng quân', wx: 'Tân Kim', personality: 'kỷ luật, cương nghị, chính trực, lạnh lùng, kiên nhẫn tài chính', career: 'quân đội, tài chính, kế toán, thể thao, phẫu thuật', love: 'bạn đời thực tế, ít lãng mạn, bền lâu' },
  '天同': { vi: 'Thiên Đồng', type: 'Phúc tinh', wx: 'Nhâm Thủy', personality: 'nhẹ nhàng, vui vẻ, an nhàn, cảm xúc, né tránh trách nhiệm, lười', career: 'công chức, giáo dục, tư vấn, dịch vụ, nhân sự', love: 'bạn đời hiền lành, ấm áp, cần người chủ động' },
  '廉贞': { vi: 'Liêm Trinh', type: 'Thứ đào hoa', wx: 'Đinh Hỏa+Quý Thủy', personality: 'nhiệt tình, kiêu ngạo, cố chấp nội tâm, bí ẩn, 「tù tinh」= bị giam trong cảm xúc', career: 'luật, chính trị, quân đội, nghệ thuật, thi đấu', love: 'bạn đời mãnh liệt, dễ ghen, cần tin tưởng tuyệt đối' },
  '天府': { vi: 'Thiên Phủ', type: 'Kho bạc', wx: 'Mậu Thổ', personality: 'ổn định, thực tế, hào phóng, thích tiện nghi, chiếm hữu', career: 'tài chính, ngân hàng, BĐS, quản lý, khách sạn', love: 'bạn đời chu đáo, vật chất tốt, cần tự do tài chính' },
  '太阴': { vi: 'Thái Âm', type: 'Mặt Trăng', wx: 'Quý Thủy', personality: 'nhẹ nhàng, nhạy cảm, nuôi dưỡng, nghệ sĩ, trực giác mạnh,né tránh xung đột', career: 'nghệ thuật, văn học, mỹ phẩm, BĐS, chăm sóc', love: 'bạn đời dịu dàng, lãng mạn, cần an toàn' },
  '贪狼': { vi: 'Tham Lang', type: 'Đào hoa chính', wx: 'Giáp Mộc+Quý Thủy', personality: 'duyên dáng, giao tiếp, tham vọng, hưởng thụ, nghệ sĩ, đa tài', career: 'giải trí, nghệ thuật, PR, marketing, sales, chính trị', love: 'bạn đời quyến rũ, đa tình, cần kích thích liên tục' },
  '巨门': { vi: 'Cự Môn', type: 'Ám tinh', wx: 'Quý Thủy', personality: 'sắc bén, hùng biện, phân tích, đa nghi, hay cãi, khẩu thiệt', career: 'luật, báo chí, tranh biện, nghiên cứu, phê bình', love: 'bạn đời hay cãi vã, cần kiên nhẫn + giao tiếp mở' },
  '天相': { vi: 'Thiên Tướng', type: 'Thừa tướng', wx: 'Nhâm Thủy', personality: 'ngoại giao, tinh tế, đứng đắn, khéo hòa giải, quan tâm hình ảnh', career: 'luật, tư vấn, công chức, PR, phó giám đốc', love: 'bạn đời lịch sự, bề ngoài đẹp, cần chân thành' },
  '天梁': { vi: 'Thiên Lương', type: 'Lão nhân tinh', wx: 'Mậu Thổ', personality: 'khôn ngoan, nguyên tắc, bảo vệ, từ thiện, hay thuyết giáo', career: 'y học, luật, học thuật, tôn giáo, an sinh xã hội', love: 'bạn đời trưởng thành, hay lo cho người khác' },
  '七杀': { vi: 'Thất Sát', type: 'Khai sáng', wx: 'Canh Kim', personality: 'can đảm, quyết đoán, độc lập, liều lĩnh, cứng đầu, chính nghĩa', career: 'khởi nghiệp, quân đội, thể thao competitive, phẫu thuật, quản lý khủng hoảng', love: 'bạn đời mạnh mẽ, ít lãng mạn, cạnh tranh' },
  '破军': { vi: 'Phá Quân', type: 'Tiên phong', wx: 'Quý Thủy', personality: 'phản nghịch, đổi mới, khó lường, đam mê phá cũ xây mới, cảm xúc mạnh', career: 'startup, R&D sáng tạo, quân đội tiền tuyến, khám phá', love: 'bạn đời phức tạp, cần không gian + sự mới mẻ' },
};

// ---- 四化: Hóa Lộc/Quyền/Khoa/Kỵ ----
export const SIHUA_MEANING = {
  '化禄': { vi: 'Hóa Lộc', effect: 'Phú quý — mở rộng tài lộc, duyên, cơ hội. Sao bị Hóa Lộc = lĩnh vực đó ĐƯỢC LỢI. 「禄」= lương thực dồi dào.', timing: 'Cung bị Lộc = lĩnh vực phất lên. Lưu niên Lộc = năm đó thuận.' },
  '化权': { vi: 'Hóa Quyền', effect: 'Quyền lực — kiểm soát, chủ động, định đoạt. Sao bị Hóa Quyền = lĩnh vực đó CÓ THẾ LỰC/CHỦ ĐỘNG.', timing: 'Cung bị Quyền = lĩnh vực mình nắm quyền. Lưu niên Quyền = năm quyết định lớn.' },
  '化科': { vi: 'Hóa Khoa', effect: 'Danh vọng — tiếng tăm, học vấn, quý nhân. Sao bị Hóa Khoa = lĩnh vực đó CÓ DANH/QUÝ NHÂN.', timing: 'Cung bị Khoa = lĩnh vực nổi danh. Lưu niên Khoa = năm được công nhận.' },
  '化忌': { vi: 'Hóa Kỵ', effect: 'TRỞ NGẠI — trở ngại, thiệt hại, gút mắt, tổn thương. Sao bị Hóa Kỵ = lĩnh vực đó KHÓ KHĂN. 「忌」= kỵ → dính líu, phiền não.', timing: 'Cung bị Kỵ = lĩnh vực đau đầu nhất cả đời. Lưu niên Kỵ = năm khó. NHƯNG: Hóa Kỵ ở cung Tật Ách = bệnh nhẹ (Kỵ = can thiệp y tế → hóa giải).' },
};

// ---- 大限 (10 năm) + 流年 (1 năm) tử vi ----
export const ZIWEI_LUCK_RULES = [
  '大限 (đại hạn) 10 năm: cung xoay theo tuổi — nam thuận/nữ nghịch. Đại hạn Cát → 10 năm thuận. Hung → 10 năm khó.',
  '流年 (lưu niên) 1 năm: cung xoay theo chi năm. Lưu niên Cát → năm thuận.',
  '大限 + 流年 cùng Cát → năm cực thuận. Cùng Hung → năm khó nhất.',
  '四化 nhập cung: Lộc/Quyền/Khoa vào cung = lĩnh vực đó được kích hoạt tích cực. Kỵ vào cung = lĩnh vực bị trở ngại.',
  '生年四化 (bẩm sinh): Hóa nào rơi vào cung nào = lĩnh vực gốc của cuộc đời.',
  '大限四化: 10 năm đó hóa nào rơi vào cung nào = lĩnh vực được/bị tác động trong thập kỷ.',
  '流年四化: năm đó hóa nào → lĩnh vực được/khó năm đó. QUAN TRỌNG NHẤT cho dự báo năm.',
  '「忌入命」= năm khó bản thân. 「忌入财帛」= năm hao tài. 「忌入夫妻」= năm tình cảm xấu. 「忌入疾厄」= năm sức khỏe.',
  '「禄入命」= năm tốt bản thân. 「禄入财帛」= năm kiếm tiền. 「禄入官禄」= năm sự nghiệp thuận.',
];

// ---- 庙旺平陷: sao mạnh hay yếu ----
export const STAR_BRIGHTNESS_MEANING = {
  '庙': { vi: 'Miếu', effect: 'sao cực mạnh → ý nghĩa CHÍNH diện phát huy đầy đủ. Tử Vi miếu = vua thực sự.' },
  '旺': { vi: 'Vượng', effect: 'sao mạnh → ý nghĩa tốt. Không cực như miếu nhưng vẫn chủ đạo.' },
  '得地': { vi: 'Đắc địa', effect: 'sao vừa đủ → ý nghĩa bình thường, không nổi bật.' },
  '平': { vi: 'Bình', effect: 'sao yếu → ý nghĩa giảm. Cần xét kèm sát tinh.' },
  '落陷': { vi: 'Loạn hãm', effect: 'sao cực yếu → ý nghĩa ĐẢO NGHĨA hoặc không phát huy. 「陷」= sao rơi vào hang → tính chất tiêu cực nổi bật.' },
};
// ROUND 9: Liêu Phàm + TCM deep
export const LIAOFAN_4_LESSONS = {
  'LapMenh': { vi: 'Lập Mệnh', summary: 'Mệnh KHONG co dinh. Biet menh -> thuan thien -> cai van bang thien hanh.', application: 'Khi AI tra loi van xau -> ket thuc: van la xu huong, KHONG phai tat dinh. Tich duc = cai van.' },
  'CaiQua': { vi: 'Cai Qua', summary: 'Truoc tich thien phai sua loi. 3 tam: xau ho, kinh so, dung manh. 3 tang: sua viec, sua ly, sua tam.', application: 'Khi hoi cai van -> khuyen sua loi truoc.' },
  'TichThien': { vi: 'Tich Thien', summary: 'Tich luy viec thien ca doi. Am duc (giau) manh hon duong duc (lo).', application: 'Cai van cot loi = TU THIEN.' },
  'KhiemDuc': { vi: 'Khiem Duc', summary: 'KHIEM = nen tang giu moi thu. Kieu ngao = ngan tien bo + ruoc hoa.', application: 'Van tot + khiem = ben. Van tot + kieu = do.' },
};
export const TCM_HEALTH_DEEP = {
  'Moc': { organ: 'Can+Dam', pathology: 'Can duong thinh: dau dau, hoa mat, cao huyet ap. Can am hu: mo mat, chot rut. Can uat: tuc nguc, tram cam.', herb: 'Atiso, nhan tran, sai ho', emotion: 'GIAN harai can', meridian: '1-3h sang (Suuse) - ngu truoc 23h', season: 'Xuan - thanh can giai uat' },
  'Hoa': { organ: 'Tam+Tieu truong', pathology: 'Tam hoa thinh: lo au, mat ngu, lo mieng, tim dap nhanh. Tam am hu: do mo hoi dem, kho hong.', herb: 'Sen tam, toan tao nhan, dan sam', emotion: 'VUI thai qua hai tam', meridian: '11-13h (Ngo) - nghi trua', season: 'Ha - thanh nhiet duong am' },
  'Tho': { organ: 'Ty+Vi', pathology: 'Ty hu: day bung, tieu chay, suy nhuoc co. Vi nhiet: doi nhung khong an duoc, hoi mieng.', herb: 'Hoai son, bach truật, dang sam', emotion: 'LO AU hai ty vi', meridian: '7-11h sang - an sang quan trong', season: 'Chuyen mua - thuc pham am, kho' },
  'Kim': { organ: 'Phe+Dai truong', pathology: 'Phe khi hu: ho kinh nien, tho ngan. Phe nhiet: ho dam vang. Phong han: cam lanh.', herb: 'Bach hop, ty ba diep, cat canh', emotion: 'BUON hai phe', meridian: '3-7h sang - tap tho', season: 'Thu - duong am: le ham, mat ong' },
  'Thuy': { organ: 'Than+Bang quang', pathology: 'Than duong hu: lanh lung goi, tieu dem, suy tinh duc. Than am hu: not but rut, do mo hoi dem, tinh nitus.', herb: 'Thuc dia, nhuc que, tho ty tu', emotion: 'SO HAI hai than', meridian: '17-19h (Dau) - uong nuoc am', season: 'Dong - ngu som, giu am lung-bung-chan' },
};

// ROUND 10: 六吉星 + 六煞星
export const ZIWEI_AUX_STARS = {
  // 6 cát tinh
  "左辅": { vi: "Ta Phụ", type: "cat", effect: "trợ lực bên ngoài — hợp tác, hỗ trợ, người giúp. Tại cung Mệnh = được người ta giúp. Tại Phu Thê = người thứ 3 xen vào." },
  "右弼": { vi: "Hữu Bật", type: "cat", effect: "mềm mại, linh hoạt — tạo quan hệ hòa hợp, network. Tại Mệnh = quý nhân đông." },
  "文昌": { vi: "Văn Xương", type: "cat", effect: "học vấn chính thống, thi cử, viết lách có cấu trúc. Tại Mệnh = thông minh, học giỏi." },
  "文曲": { vi: "Văn Khúc", type: "cat", effect: "nghệ thuật, hùng biện, thẩm mỹ, huyền học, tài năng phi truyền thống." },
  "天魁": { vi: "Thiên Khôi", type: "cat", effect: "quý nhân NAM — sếp/mentor nam mở đường. Cấp cao help." },
  "天钺": { vi: "Thiên Việt", type: "cat", effect: "quý nhân NỮ — người nữ giúp ngầm, tinh tế." },
  // 6 sát tinh
  "擎羊": { vi: "Kình Dương", type: "sat", effect: "dương kim, hóa KHIÊN — bạo liệt, quyết đoán, tấn công, dũng cảm. Tích cực: tiên phong, đột phá. Tiêu cực: xung đột, thương tích, kiện tụng." },
  "陀罗": { vi: "Đà La", type: "sat", effect: "âm kim, hóa HẠI — do dự, dây dưa, mâu thuẫn, nghĩ nhiều. Tích cực: phân tích sâu. Tiêu cực: chần chừ, tự hủy." },
  "火星": { vi: "Hỏa Tinh", type: "sat", effect: "bùng nổ, nhiệt huyết, cáu gắt nhanh. Tích cực: nhiệt tình, chủ động. Tiêu cực: nóng nảy, phung phí." },
  "铃星": { vi: "Linh Tinh", type: "sat", effect: "lửa ngầm — ôm hận, tính toán, tối. Tích cực: chiến lược sâu. Tiêu cực: thù dai, u uất." },
  "地空": { vi: "Địa Không", type: "sat", effect: "rỗng — mất tiền, không giữ được, nhưng tâm linh sâu, sáng tạo. Tích cực: nghệ sĩ/tâm linh. Tiêu cực: tài chính bất ổn." },
  "地劫": { vi: "Địa Kiếp", type: "sat", effect: "cướp đoạt — bị lấy đi, đột ngột mất. Nhưng cũng phá vỡ convention, đổi mới." },
};

export const ZIWEI_AUX_PRINCIPLES = [
  'Sao khong co tot/xau tuyet doi — moi sao la modifier, hieu ung phu thuoc cung + chinh tinh + tu hoa.',
  'Sat tinh dung dung: quan su/kinh doanh mao hien/phau thuat = canh sat tinh de co canh.',
  "Cat tinh qua nhieu cung Phu The = hoa don hon nhan (ngoai tinh).",
  "Dia Khong/Dia Kiep = VUA sat tinh — lam yeu ca cat lan lan sat, co the dung de diet sat nhung cung diet cat.",
  "Khi Duong + Hoa Tinh = bom no (nguy hiem). Linh Tinh + Da La = am uom thu dai.",
  "Sat tinh tai cung Tai Bach = ton tai. Tai cung Quan Loc = tranh chap cong viec. Tai cung Tat Ach = benh.",
];
// ROUND 11: Luu Nguyet (monthly fortune) + luu nien themes
export const LIUYUE_METHOD = [
  'Luu nguyet = thang theo tiet khi (khong phai thang duong). Moi thang co 1 can-chi rieng.',
  'Cach doc: luu nguyet can-chi tuong tac voi (1) nguyet lenh nguyen cuc, (2) dai van dang hanh, (3) luu nien. 3 tang.',
  'Luu nguyet mang Dung = thang thuan. Mang Ky = thang kho. Hop/Nghiem/Xung voi nguyet lenh = bien dong.',
  'Tai tinh (nam)/Quan sat (nu) xuat hien trong luu nguyet = thang co duyen/tien.',
  'Thuc thuong trong luu nguyet = sang tao/duy tu. An tinh = hoc van/bang cap. Ty kien = canh tranh.',
];

export const MONTHLY_THEME_GUIDE = {
  spring: { vi: "Xuan (3 thang)", focus: "Moc vuong — sinh truong, ke hoach, hoc hoi, khoi dau moi" },
  summer: { vi: "Ha (3 thang)", focus: "Hoa vuong — bung no, sang tao, hien hoa, giao tiep, nong nhiet" },
  autumn: { vi: "Thu (3 thang)", focus: "Kim vuong — thu hoach, quyet doan, ky luat, don dep, cut giot" },
  winter: { vi: "Dong (3 thang)", focus: "Thuy vuong — an tinh, luu tru, chuan bi, nghi ngoi, tam linh" },
  transition: { vi: "Chuyen mua", focus: "Tho vuong — on dinh, bao dung, tieu hoa, chuyen giao" },
};
// ROUND 12: Nayin 30 types + Thai Tue interaction
export const NAYIN_PERSONALITY = {
  "HaiZhongJin": { vi: "Kim Trong Bien", meaning: "tai an giau, can dung kien thuc/kinh nghiem moi toi sang. Can dai nhan ho tro." },
  "JianFengJin": { vi: "Kim Them Che", meaning: "sac ben, quyet doan, dut dao. Nghe luat/quan su/phau thuat." },
  "BaiLaJin": { vi: "Bach La Kim", meaning: "trang suc — tinh te, nghe thuat, mong manh dep." },
  "ShaZhongJin": { vi: "Kim Trong Cat", meaning: "tiem nang tho, can tinh che." },
  "JinBoJin": { vi: "Kim Bac Vang", meaning: "sang ben ngoai, mong manh dep ben trong." },
  "ChaiChuanJin": { vi: "Kim Tram Xuyen", meaning: "tinh te, trang tri, thanh lich." },
  "LuZhongHuo": { vi: "Hoa Trong Lo", meaning: "am ap, manh, can nhien lieu (moc) de duy tri." },
  "ShanTouHuo": { vi: "Hoa Dinh Nui", meaning: "chieu sang lon, bung no nhanh, mau tat." },
  "PiLiHuo": { vi: "Hoa Set", meaning: "dot phat, Dien sach, kho luong." },
  "ShanXiaHuo": { vi: "Hoa Chan Nui", meaning: "am ap on dinh, thuc te, kien tri." },
  "FuDengHuo": { vi: "Hoa Den", meaning: "tap trung, chieu sang trong toi, tam linh." },
  "TianShangHuo": { vi: "Hoa Tren Troi", meaning: "uy quyen, chieu xa, anh huong rong." },
  "DaLinMu": { vi: "Moc rung lon", meaning: "tap the, phat trien deu, bao ve." },
  "SongBaiMu": { vi: "Moc Thong Bang", meaning: "xanh quanh nam, kien cuong, ngay le." },
  "YangLiuMu": { vi: "Moc Lieu", meaning: "ung bien, mem mai, nhuong bo." },
  "ShiLiuMu": { vi: "Moc Luu", meaning: "co trai gia tri, can trong moi." },
  "PingDiMu": { vi: "Moc Dong Bang", meaning: "goc tham, kien nhan yen lang." },
  "SangZheMu": { vi: "Moc Duong", meaning: "soi cung, chiu kho, thuc dung." },
  "JianXiaShui": { vi: "Thuy Khe Non", meaning: "suoi an, chieu sau, kien nhan." },
  "ChangLiuShui": { vi: "Thuy Dai Luu", meaning: "chay lien, dong luc kien cuong." },
  "TianHeShui": { vi: "Thuy Tinh Ha", meaning: "nuoc troi, thanh tinh, phuc khi." },
  "JingQuanShui": { vi: "Thuy Gieng", meaning: "yem, sau, nuoi song." },
  "DaHaiShui": { vi: "Thuy Bien Lon", meaning: "rộng lon, manh, bat cuong." },
  "LuPangTu": { vi: "Tho Ben Duong", meaning: "ho tro, phuc vu cong, de tiep can." },
  "ChengTouTu": { vi: "Tho Thanh Noi", meaning: "bao ve, co cau, phong ngu." },
  "BiShangTu": { vi: "Tho Tuong", meaning: "doc lap, chiu dung yen lang." },
  "DaYiTu": { vi: "Tho Tram", meaning: "giao thong, lien lac, ket noi." },
  "WuShangTu": { vi: "Tho Mai Nha", meaning: "cap lang, gia dinh, nen tang." },
  "BiShangTu2": { vi: "Tho Dat Rung", meaning: "phan dau yen binh." },
};

export const TAISUI_EFFECT = [
  'Thai Tue (Thai Tuy) = chi nam nay ke voi chi nam sinh. Xung Thai Tuy: nam bien dong lon.',
  'Xung: Ty-Ngo, Suu-Mui, Dan-Than, Mao-Dau, Thin-Tuat, Ty-Hoi. 6 cap xung chi.',
  'Thai Tuy khong phai xau hoan toan: neu mang Dung, bien dong dep. Mang Ky, bien dong kho.',
  'Hai: chi nam hai ke vi chi nam sinh. Nhe hon xung.',
  'Pha: chi nam khac chi cua cung. Nhe.',
  'Xung+Dung = nam bien dong dep. Xung+Ky = nam kho. Khong xung = nam on.',
];
// ROUND 13: 81 numbers + 12 truc thong thang + 24 son
export const NUMBER_81_TOP = {
  1: { rating: "dai cat", vi: "Thai Cuc — khoi dau moi, loc loi, phat trien" },
  3: { rating: "cat", vi: "nang luong, sinh truong, tien bo" },
  6: { rating: "cat", vi: "loc loc, thuan loi, thanh cong" },
  8: { rating: "dai cat", vi: "phat tai, thinh vuong (bat = phat)" },
  11: { rating: "cat", vi: "phat trien on dinh, tung buoc len" },
  13: { rating: "dai cat", vi: "xuan y, tri tue, thanh cong" },
  15: { rating: "cat", vi: "trong doi phu soc, tho" },
  16: { rating: "dai cat", vi: "phat vuong, danh tieng, thanh cao" },
  21: { rating: "dai cat", vi: "minh nguyet, quy nhan ho" },
  23: { rating: "dai cat", vi: "truc len, quyet doan, thanh cong" },
  24: { rating: "dai cat", vi: "kim tien day, bach thu thanh gia" },
  25: { rating: "cat", vi: "tai lloc, on dinh, thanh cong" },
  29: { rating: "cat", vi: "trung thanh, phuc duc, quy nhan" },
  31: { rating: "dai cat", vi: "tri dung, y chi kien cuong" },
  32: { rating: "dai cat", vi: "bao ma kim an, on hoa phuc duc" },
  33: { rating: "dai cat", vi: "tuyet nhat, uy quyen, thanh cong" },
  35: { rating: "cat", vi: "uu nhac, on dinh, vong trong" },
  37: { rating: "dai cat", vi: "quyet doan, quang minh, thanh cong" },
  39: { rating: "dai cat", vi: "phu quy, thai binh, hanh phuc" },
  81: { rating: "dai cat", vi: "van vat hoi xuan, cuc cat" },
  4: { rating: "hung", vi: "bien hung, bat on" },
  9: { rating: "hung", vi: "bat hanh, kho khan" },
  10: { rating: "hung", vi: "tan tuyet, ket thuc" },
  14: { rating: "hung", vi: "co don, phan ly, kho khan" },
  19: { rating: "hung", vi: "bat thanh, that bai, kho" },
  20: { rating: "hung", vi: "phat ly, chia cat, co doc" },
  22: { rating: "hung", vi: "that bai, ngot ngao, kho" },
  34: { rating: "hung", vi: "phan than, that lac, kho" },
  36: { rating: "hung", vi: "bat thanh, bo vo, kho khan" },
};

export const TONGSHENG_12_VI = {
  建: "Kien (xay dung) — tot khoi dau, ky ket, xay nha",
  除: "Tru (loai bo) — tot don dep, cat tia, giam bot",
  满: "Man (day du) — tot bo cung, lam day, hoan thanh",
  平: "Binh (binh thuong) — trung tinh, khong tot khong xau",
  定: "Dinh (on dinh) — tot on dinh, mua ban, hop dong",
  执: "Chap (nam giu) — tot nam chac, bat dau, ky ket",
  破: "Pha (phap vo) — xau, phong lam viec lon, dau tu",
  危: "Nguuy (nguy hiem) — xau, phong mao hien, leo nui",
  成: "Thanh (thanh cong) — tot hoan thanh, khai truong, cuoi hoi",
  收: "Thu (thu hoach) — tot thu tien, thu hoach, dong goi",
  开: "Khai (mo cua) — tot mo cua, khoi su, di xa",
  闭: "Be (dong cua) — xau, phong dong kinh, an tang, cho ngu",
};
// ROUND 14: Huyen Khong Phi Tinh 9 cung + 9 sao
export const FLYING_STAR_9 = {
  1: { vi: "Nhat Bach", wx: "Thuy", effect: "quan loc, giao tiep, duyen, su nghiep phat trien", cat: true },
  2: { vi: "Nhi Hac", wx: "Tho", effect: "benh tat, suc khoe, phu nu", cat: false },
  3: { vi: "Tam Bich", wx: "Moc", effect: "khau thi, tranh cai, xu pham", cat: false },
  4: { vi: "Tu Luc", wx: "Moc", effect: "hoc van, thi cu, duyen tinh", cat: true },
  5: { vi: "Ngu Hoang", wx: "Tho", effect: "DICH HONG NAM — cuc hung, tai hoa, benh nang", cat: false },
  6: { vi: "Luc Bach", wx: "Kim", effect: "quyen luc, quoc su, vo trang", cat: true },
  7: { vi: "That Xich", wx: "Kim", effect: "daokiem, thu doan, hung bao", cat: false },
  8: { vi: "Bat Bach", wx: "Tho", effect: "TAI LOC CHINH — tai chinh, giau co", cat: true },
  9: { vi: "Cuu Tu", wx: "Hoa", effect: "HI KHANH — cuoi hoi, de con, danh vong", cat: true },
};

export const FLYING_STAR_2026 = {
  center: { star: 1, vi: "Nhat Bach (Trung cung) — su nghiep tien bo, giao tiep tot" },
  north: { star: 6, vi: "Luc Bach (Bac) — quyen luc, phat trien" },
  northeast: { star: 2, vi: "Nhi Hac (Dong Bac) — benh tat, can phong" },
  east: { star: 8, vi: "Bat Bach (Chinh Dong) — TAI LOC CHINH — phat tai chinh" },
  southeast: { star: 9, vi: "Cuu Tu (Dong Nam) — HI KHANH — cuoi hoi, de con, danh vong" },
  south: { star: 5, vi: "Ngu Hoang (Chinh Nam) — DICH HONG — cuc hung, phong cai tao" },
  southwest: { star: 7, vi: "That Xich (Tay Nam) — thu doan, hung bao, can than" },
  west: { star: 3, vi: "Tam Bich (Chinh Tay) — khau thi, tranh cai" },
  northwest: { star: 4, vi: "Tu Luc (Tay Bac) — hoc van, duyen tinh" },
};

export const FENGSHUI_CURE_5_YELLOW = [
  'Ngu Hoang (5 vang) 2026 tai CHINH NAM — CUC HUNG: KHONG cai tao, KHONG dao dat. Dem dong bac de hoa giai.',
  'Cach hoa giai: dat dong bac/kim loai/khan vang o huong NAM. Treo luc phong.',
  'Nhi Hac (2 den) tai DONG BAC: benh tat. Dat luc phong hoac vang 6 dong.',
];
// ROUND 15: Chenggu tiers + Sandishu + Karma
export const CHENGGU_TIERS = [
  { min: 2.1, max: 2.4, tier: "Ngheo kho", note: "cuoc song kho khan, can co gang nhieu." },
  { min: 2.5, max: 2.7, tier: "Trung binh kem", note: "vua du, can tietkiem." },
  { min: 2.8, max: 3.0, tier: "Trung binh", note: "on dinh, khong thieu khong du." },
  { min: 3.1, max: 3.4, tier: "Kha", note: "kha quan, tien du." },
  { min: 3.5, max: 3.9, tier: "Gioi", note: "giau, tien nhieu." },
  { min: 4.0, max: 4.3, tier: "Phu quy", note: "danh tieng, quyen luc." },
  { min: 4.4, max: 5.0, tier: "Cuc phu", note: "cuc phu quy." },
  { min: 5.1, max: 7.1, tier: "Sieu phu", note: "cuc hiem — cuoc song sieu phu." },
];

export const SANDISHU_3_LIVES = {
  intro: "Tam The Thu - doc 3 doi: tien the, kim sinh, hau the. dua vao ngay sinh.",
  pastLifeGood: ["Tu tien/dao - tich duc", "Phat tu - tu bi", "Nha tu thien - gia dinh nghiep tot", "Quan nhan - chinh truc"],
  pastLifeNeutral: ["Thuong nhan - buon ban", "Nong dan - cham chi", "Nghe si - tai hoa", "Hoc gia - hoc van"],
  pastLifeBad: ["Cuop/bao duc - nghiep nang", "Gian hoan - lam ac", "Ke trom - tham lam"],
};

export const KARMA_LAWS = [
  "1. Nhan qua: gieo gi gat nay.",
  "2. Tang truong: qua thoi gian cham/nhanh.",
  "3. 3 doi: tien the tich duc, kim sinh phuc, hau the thua huong.",
  "4. Y CHINH giai nghiep (Lieu Pham): y chi quyet dinh, khong phai tat dinh.",
  "5. Thien: 30% menh + 70% nhan luc.",
];

// ROUND 16: Ngu hanh nhan cach + ngoai hinh + dai van quy luat
export const WUXING_APPEARANCE = {
  "木": { face: "mat dai, cung nhon, ham nhon", body: "cao, mong, lung thang, vai rong, tay chan nho", complexion: "xanh nhat", note: "go nguoi thang, nhu cay — nhieu nang luong" },
  "火": { face: "mat hinh trai tim, gò má nhoi, cằm nhọn, mat sang", body: "mong, de pog, tay chan thanh tu", complexion: "do/ hong", note: "nang dong, bung no, pha cach" },
  "土": { face: "mat vuong, tai to,mui tuoi", body: "co the chac, be ngang, co dang", complexion: "vang/sau", note: "vung chai, dinh lang, dáng dấp dat me" },
  "金": { face: "mat oval/vuong, cung guong mat canh", body: "mong, xuong nhon, khop nhin ro", complexion: "trang/bach", note: "dang dep, nhan tinh te, chinh xac" },
  "水": { face: "mat tron, má day, dac diem uom wave", body: "mem, day, de tang can", complexion: "sam/hơi đen", note: "di de mai, uyen chuyen, nhu nuoc" },
};

export const WUXING_PERSONALITY_DEEP = {
  "木": { strengths: ["nhan tu", "phat trien", "ke hoach dai han", "trung thuc", "bao quan"], weaknesses: ["cứng đầu", "ngang bướng", "khi tuong thai thì phan ung cham", "de bi tham lung"], growth: "can hoc MEM mai, nghe y kien, giam su đoi" },
  "火": { strengths: ["nhiet huyet", "sang tao", "lam thu hut", "bieu dat manh", "lanh dao"], weaknesses: ["nong nat", "de buc phan", "thieu kien nhan", "dot phat"], growth: "can tap binh tinh, nghi truoc noi, giam phan ung cam xuc" },
  "土": { strengths: ["on dinh", "tin nen", "cham chi", "bao dung", "thuc te"], weaknesses: ["bao thu", "de an co", "ngai thay doi", "tuong dja"], growth: "can chiu thay doi, mo ngoi, hoc cach mao hiem" },
  "金": { strengths: ["ky luat", "quyet doan", "chinh xac", "cong bang", "ngoi sao"], weaknesses: ["lanh lanh", "kho gank", "qua nghiem khac", "de cat"], growth: "can mem mai, hoc long thong, giam phan xet" },
  "水": { strengths: ["tri tue", "linh hoat", "giao tiep", "uyen chuyen", "tuong tuong"], weaknesses: ["de dao nay", "thieu kien dinh", "con cam xuc", "phuc tap"], growth: "can tap tap trung, quyet doan, giam lan dot" },
};

export const DAYUN_TIMING_LAWS = [
  "1. Dai van 10 nam = 1 thoi ky. Can 5 nam = can quan ly, Chi 5 nam = chi đia luu.",
  "2. Can dai van = thap than + Dung/Ky. Chi dai van = 12 truong sinh + xung/hop/hinh.",
  "3. 'Minh khong bang van hao' — menh tot khong bang van tot. Dai van QUYET DINH hon menh goc.",
  "4. 25-45 tuoi = 2-3 dai van quan trong nhat → dinh su nghiep + hon nhan.",
  "5. Van tot + luu nien tot = nam cuc thinh. Van xau + luu nien xau = nam cuc kho.",
  "6. 'Van ky nhap menh' = khi ky than vao dai van → nam can than de, giam quyet doan lon.",
  "7. 'Van dung nhap menh' = khi dung than vao dai van → nam thinh vuong, tien bo lon.",
  "8. Giao van (交运) = ngay chuyen tu dai van cu sang moi → ngay nay can y trong, tranh xung khac.",
];

export const BAZI_WEALTH_TIMING = [
  "Khi nao phat tai? Xem: 1. Tinh tai (Chinh/Thien) xuat hien trong dai van. 2. Thuc thuong sinh tai. 3. Tai kho (辰戌丑未) mo.",
  "Nghe nghiep thang tien? Xem: 1. Quan sat trong dai van. 2. An sinh quan. 3. Sat luc thuc (制殺留財).",
  "Cuoi hoi khi nao? Xem: 1. Sao phoi ngau (Tài nam/Quan nu) trong dai van. 2. Hop/xung nhat chi. 3. Dao hoa.",
  "Con cai khi nao? Xem: 1. Sao con (Quan nam/Thuc Thuong nu) trong dai van. 2. Thoi Trụ (cung con). 3. 12 truong sinh.",
  "Suc khoe khi nao yeu? Xem: 1. Ngu hanh yeu nhat trong dai van. 2. Xung nhat chi. 3. That sat/Kiep tai vao van.",
];

// ROUND 17: Yizhangjing 12 stars + face reading 12 palaces + ceczi
export const YIZHANGJING_12_STARS = {
  "TianGui": { vi: "Thien Quy", dao: "Phat dao", meaning: "cau ky, thanh cao, phuc duc. Tich duc nhieu, duoc quy nhan ho. Tinh cam binh thuan." },
  "TianE": { vi: "Thien A", dao: "Quy dao", meaning: "kho nan nho, nhieu chuong ngai. Nhung co y chi kien cuong. Can hoc nhan nhu." },
  "TianQuan": { vi: "Thien Quyen", dao: "Nhan dao", meaning: "quyen luc, lanh dao, co uy. Thich quyet doan. Can hoc khiem nhu." },
  "TianPo": { vi: "Thien Pha", dao: "Suc dao", meaning: "de pha tai, bat on, hao phi. Can hoc tiet kiem, kien nhan." },
  "TianJian": { vi: "Thien Gian", dao: "Tu la dao", meaning: "tinh te, tinh doi, kho than. Thich chien luoc. Can hoc thanh that." },
  "TianWen": { vi: "Thien Van", dao: "Tien dao", meaning: "hoc van, tri tue, tam linh. Thien ve nghien cuu, dao hoc, huyen hoc." },
  "TianFu": { vi: "Thien Phuc", dao: "Phat dao", meaning: "phuc duc, tu bi, thien tai. Cuoc song binh an, duoc bao." },
  "TianYi": { vi: "Thien Dich", dao: "Quy dao", meaning: "di chuyen nhieu, dong ngoai, bat on cu. Can dinh cu." },
  "TianGu": { vi: "Thien Co", dao: "Nhan dao", meaning: "co doc, doc lap, rieng le. Co the thanh cong nhung co don." },
  "TianRen": { vi: "Thien Nhan", dao: "Suc dao", meaning: "manh me, bao luc, de tranh chap. Can hoc dieu le." },
  "TianYi_Art": { vi: "Thien Nghe", dao: "Tu la dao", meaning: "nghe thuat, tai hoa, ky thuat. Sang tao nhung de tranh cai." },
  "TianShou": { vi: "Thien Thu", dao: "Tien dao", meaning: "tho, binh an, tram dinh. Cuoc song lau dai, yen on." },
};

export const FACE_12_PALACES = {
  positions: [
    { vi: "Menh Cung", pos: "giua tran (an moc)", meaning: "bản than, su nghiep, su menh 13-35 tuoi" },
    { vi: "Tai Loc", pos: "mui (chanh trung)", meaning: "tai chinh, 15-50 tuoi" },
    { vi: "Quan Loc", pos: "_tran (cao nhat)", meaning: "cong danh, 25-50 tuoi" },
    { vi: "Phu The", pos: "duoi mat, phia ngoai mat", meaning: "vo chong, 20-50 tuoi" },
    { vi: "Tu Nu", pos: "duoi mat, phia trong mat", meaning: "con cai, 30-60 tuoi" },
    { vi: "Phu Me", pos: "canh mui, duoi mat", meaning: "cha me, 1-20, 50-70 tuoi" },
    { vi: "Huynh De", pos: "chanh tren tran, ben trai", meaning: "anh chi em" },
    { vi: "Dien Trach", pos: "canh tran, ben phai", meaning: "nha cua, bat dong san" },
    { vi: "Phuc Duc", pos: "tai", meaning: "phuc duc to tien, may man" },
    { vi: "Tat Ach", pos: "chanh duoi mat, giua", meaning: "suc khoe, benh tat" },
    { vi: "Thien Di", pos: "ben canh tran, hai ben", meaning: "du lich, dong ngoai" },
    { vi: "Ngu Boc", pos: "huong cam", meaning: "cap duoi, ban be" },
  ],
  note: "12 cung mat doc cuoc doi qua net mat. Dac diem: dep/xau, sang/toi, day/mong = phuc/hung tuong ung. Day net mat can chuyen gia xem.",
};

export const CEZI_METHOD = [
  "Cezi (Chat Tu) = chon 1 chu Han → phan tich bo thu + net + ngu hanh + khoi que.",
  "Buoc 1: Chon 1 chu (vd: 福, 财, 爱, 命).",
  "Buoc 2: Phan tich bo (radical) → y nghia cua bo đo.",
  "Buoc 3: Dem net → tong net → que Kinh Dich (64 que).",
  "Buoc 4: Ngu hanh cua chu (Moc/Hoa/Tho/Kim/Thuy) → phoi hop voi Dung Than.",
  "Buoc 5: Y nghia tong hop: chu tot cho van nao? xau cho van nao?",
  "Ung dung: chon ten con, chon ten cong ty, chon chu may men, xem 1 chu bat ky.",
];

// ROUND 18: hehun 4 chieu + 8 trai phong thuy + qi men brief
export const HEHUN_4_DIMENSIONS = {
  wxComplement: {
    vi: "Ngu Hanh Bo Xung",
    principle: "Menh A thieu hanh X → B co nhieu X = BO XUNG. Khong phai giong nhau ma la BO TRO.",
    good: "A yeu Thuy, B co nhieu Thuy. A yeu Hoa, B co nhieu Hoa → bo tro tot.",
    bad: "Ca 2 cung yeu cung 1 hanh → cung thieu → KHONG bo tro, ca 2 kho.",
    score: "+15 (bo xung tot) / -10 (cung thieu) / +0 (trung tinh)",
  },
  dayPillar: {
    vi: "Nhat Tru Phoi Hop",
    principle: "Can A + Can B: thien hop (甲己/乙庚/丙辛/丁壬/戊癸) = tot nhat. Tuong sinh = tot. Xung/khac = xau.",
    good: "Thien can ngu hop + chi ngu hop = thuong hon. Can tuong sinh = phu the ai tinh.",
    bad: "Thien khac dia xung (天克地冲) = bien dong lon. Hinh/hai = xau.",
    score: "+20 (ngu hop) / +10 (tuong sinh) / -15 (khac/xung) / -10 (hinh/hai)",
  },
  spouseStar: {
    vi: "Phoi Nguu Tinh",
    principle: "Nam: Chinh Tai = vo. Nu: Chinh Quan = chong. Tinh vung/khong xung = hon nhan on.",
    good: "Sao phoi ngau vung + khong bi khac/xung = vo/chong tot, gia dinh on.",
    bad: "Sao phoi ngau yeu/bi xung/khac = vo/chong suc yeu/duyen ngoai. Thuong quan kiem quan = phan bien.",
    score: "+10 (sao vung) / -10 (sao yeu/xung) / -5 (khong co sao)",
  },
  spousePalace: {
    vi: "Phoi Nguu Cung",
    principle: "Nhat Chi = cung phu the. 2 nguoi Nhat Chi: hop = tot, xung = xau, hinh = rac roi.",
    good: "Chi ngu hop/luc hop/tam hop = ai tinh. Chi tuong sinh = on.",
    bad: "Chi xung (6 cap xung) = hon nhan bien dong. Chi hinh = tranh chap. Chi hai = am muu.",
    score: "+10 (hop) / -15 (xung) / -10 (hinh) / -5 (hai)",
  },
};

export const BAZHAI_8_HOUSE = {
  concept: "Bat Trai = 8 huong bao ngu (4 cat + 4 hung) dua vao que trach. Chon huong nha/phong theo cung menh.",
  favorable: {
    "Sinh Khi": { vi: "Sinh Khi", direction: "tot cho suc khoe, nang luong, sinh son", note: "huong tot nhat cho ngu" },
    "Thien Y": { vi: "Thien Y", direction: "tot cho suc khoe, chua benh, bao thu", note: "huong phong ngu/tot cho phu nu" },
    "Dien Nien": { vi: "Dien Nien", direction: "tot cho su nghiep, on dinh, cuoc song", note: "huong phong khach/hoc" },
    "Phuc Vi": { vi: "Phuc Vi", direction: "tot cho tinh than, binh an, phuc duc", note: "huong phong tho" },
  },
  unfavorable: {
    "Tuyet Menh": { vi: "Tuyet Menh", direction: "CUC HUNG — suc khoe, mang song", note: "KHONG ngu/kiem o huong nay" },
    "Ngu Quy": { vi: "Ngu Quy", direction: "HUNG — tai hoa, dac biet suc khoe", note: "tranh cai tao" },
    "Luc Sat": { vi: "Luc Sat", direction: "HUNG — tai chinh, luat phap, ranh co", note: "tranh kinh doanh" },
    "Hoa Hai": { vi: "Hoa Hai", direction: "XAU — tai hoa, phan ly, that lac", note: "tranh chuyen nha/kiem" },
  },
};

export const QIMEN_BRIEF = {
  concept: "Khi Mon Don Gia = 1 trong 3 thuc (三式). Chon thoi diem + huong + chien thuat.",
  structure: "4 phuong: Thien (thoi diem) + Dia (huong) + Nhan (ban than) + Than (tro giup).",
  use: "Chon ngay khoi su, chon huong an phong, chon luc dien trinh, chon vi tri ghe ngoi.",
  note: "Khi Mon kho hoc nhat trong tat ca thuat so. Chi brief cho AI tham khao — tinh toan chi tiet can module rieng.",
};

export const LIUYAO_BRIEF = {
  concept: "Luu Dao = 6 hao + 6 than + 6 thu. Dung de tra loi 1 cau hoi cu the.",
  structure: "6 hao: so (初→上). 6 than: huynh de/phu mau/tu ton/quan quy/thien tai/the than.",
  method: "Khoi que: 3 dong tien (6 hao) → xac dinh the (dong/tinh) → noi dung the/am hao.",
  use: "Tra loi: co nen khong? ket qua the nao? thanh cong that bai? thoi gian?",
  note: "Luu Dao manh ve su kien cu the. BaZi manh ve tong quan doi. Ket hop ca 2 = tot nhat.",
};

// ROUND 19: Than sat nang cao (Jiangxing/Wangshen/Jiesha/etc) + GuChen + GouJiao
export const ADVANCED_SHENSHA = {
  "将星": { vi: "Tuong Tinh", nature: "cat", effect: "lanh dao, quyen luc, uy quyen. Co kha nang phat lenh, chi huy nguoi khac. Khi tot: quoc su/lanh dao. Khi xau: doc doan." },
  "亡神": { vi: "Vong Than", nature: "hung", effect: "am muu, bi mat, chinh tri. Nguoi co Vong Than: gio tinh te, kho than, am uu. De lo lang trong am." },
  "劫煞": { vi: "Kiet Sat", nature: "hung", effect: "dot phat, thua ro, manh me. De bi cuop/doat. Tinh cach bao dong nhung cung dung cam." },
  "灾煞": { vi: "Tai Sat", nature: "hung", effect: "tai hoa, benh nang, tai nan. Hinh thanh khi Tuong Tinh bi xung. Can de phong suc khoe." },
  "孤辰": { vi: "Co Tran", nature: "hung", effect: "nam co doc, kho tim hieu doi. But: co Tuong Tinh/Quy Nhan → 「co tran mang quan an → lam lanh dao」." },
  "寡宿": { vi: "Qua Tuc", nature: "hung", effect: "nu qua tu, kho hon nhan. But: co Quy Nhan → doc lap thanh cong." },
  "咸池": { vi: "Ham Trieu/Dao Hoa", nature: "trung tinh", effect: "duyen tinh, hap dan, nghe si. Tai Nien/Nguyet = bẩm sinh. Tai Nhat = trong hon nhan. Tai Thoi = van nien." },
  "勾绞": { vi: "Cau Giao", nature: "hung", effect: "luat phap, phan ly, rac roi. De bi tham gia vu an/ tranh chap." },
  "红艳": { vi: "Hong Diem", nature: "trung tinh", effect: "duyen am muu, tinh cam manh, de hap dan gioi khac. Nghe si/ giai tri phu hop." },
  "阴差阳错": { vi: "Am Sai Duong Nham", nature: "hung", effect: "nham lan, ky la, cuoi hoi gap kho khan. De lam sai viec, cuoi nham nguoi." },
  "天罗地网": { vi: "Thien La Dia Vong", nature: "hung", effect: "bi troi buoc, khong du tu do. Can co Quy Nhan giai." },
  "羊刃": { vi: "Duong Nhan", nature: "hung/cat tuy bien", effect: "manh me, de chay mau, nguy hiem. Khi than vuong = dung duoc (che sat). Khi than nhuoc = nguy." },
};

export const SHENSHA_PRINCIPLE_ADVANCED = [
  "1. Than sat la PHU — khong thay the ngu hanh/thap than. Core la ngu hanh + cach cuc. Than sat chi la chi tiet bo xung.",
  "2. Cat than (天乙/文昌/将星) tot khi o cung Dung. Hung sat (亡神/劫煞/灾煞) nguy khi o cung Ky.",
  "3. Co Tran Qua Tuc khong phai luc nao cung xau — co Quy Nhan/Tuong Tinh → doc lap thanh cong, lam lanh dao.",
  "4. Duong Nhan = 2 mat: than vuong = dung duoc (lam tuong/quan). Than nhuoc = nguy (de bi thuong).",
  "5. Am Sai Duong Nham (阴差阳错) o Nhat Tru = cuoi hoi gap van de, nham lan tinh cam. Can chon ngay ky ket cuoi hoi ky ky.",
  "6. Hong Diem + Dao Hoa = duyennhieu nhung de da tinh. Can 1 An tinh che (印) de can bang.",
  "7. Than sat tinh toan tu CHI nam sinh (tru 天乙 tinh toan tu CAN nam/ngay sinh).",
  "8. 「孤辰寡宿 mang quan an → lam rung lam chua」 — co sat mang quyen → quyen luc thay vi co don.",
];

// ROUND 20: Luu nhat + zheri + 24 tiet khi + hoang dao
export const LIURI_METHOD = [
  "1. Luu nhat = can-chi cua ngay hom nay. Doc: can luu nhat x Nhat Chu (thap than) → tot/xau ban than hom nay.",
  "2. Luu nhat xung Nhat Chi = ngay bien dong ban than/hon nhan. Hop Nhat Chi = ngay tot.",
  "3. Luu nhat mang Dung = ngay tot (lam viec lon, ky ket). Mang Ky = ngay can than.",
  "4. Luu nhat + luu nguyet cung Dung = ngay CUC tot. Cung Ky = ngay can than.",
  "5. Luu nhat thuong quan/that sat = ngay de tranh tranh chap/suc khoe. Chinh tai = ngay co tien.",
];

export const HUANGDAO_12 = {
  cat: {
    "除": "Tru — tot don dep, cat tia, giam bot",
    "危": "Nguuy — tot xay dung, sua chua (phong nguy hiem)",
    "定": "Dinh — tot hop dong, mua ban, an dinh",
    "执": "Chap — tot nam giu, bat dau, ky ket",
    "成": "Thanh — tot hoan thanh, khai truong, cuoi hoi",
    "开": "Khai — tot mo cua, khoi su, di xa, dau tu",
  },
  hung: {
    "建": "Kien — trung tinh (xay dung nhung de phan bien)",
    "满": "Man — trung tinh (day du nhung de thua)",
    "平": "Binh — trung tinh (binh thuong)",
    "收": "Thu — trung tinh (thu hoach nhung de mat)",
    "破": "Pha — XAU: khong nen khoi su/dau tu/cuoi hoi",
    "闭": "Be — XAU: khong nen dong kinh/mo cua/an tang",
  },
};

export const JIEQI_24 = [
  "Xuan: Lap Xuan → Vu Thuy → Kin Tran → Xuan Phan → Thanh Minh → Coc Vu",
  "Ha: Lap Ha → Tieu Man → Mang Chung → Ha Chi → Tieu Thu → Dai Thu",
  "Thu: Lap Thu → Cu Thu → Bo Su → Thu Phan → Han Lo → Suong Giang",
  "Dong: Lap Dong → Tieu Tuyet → Dai Tuyet → Dong Chi → Tieu Han → Dai Han",
];

export const ZHERI_PRINCIPLES = [
  "1. Chon ngay: xem tru (12 kien/tru/man/binh/dinh/chap/pha/nguy/thanh/thu/khai/be) + hoang dao/hac dao.",
  "2. Chon ngay tot cho VIEC CUOI: can-nam nam sinh khong xung ngay. Ngay Dinh/Thanh/Khai. Tranh Pha/Be.",
  "3. Chon ngay tot cho KINH DOANH: ngay Dinh/Thanh/Khai + can ngay = Tai tinh cua minh.",
  "4. Chon ngay tot cho DI XA: ngay Khai + Dung Than. Tranh ngay xung chi nam sinh.",
  "5. Chon ngay tot cho KHI BENH: ngay Dinh + An tinh. Tranh ngay Pha/Nguuy.",
  "6. 24 tiet khi: moi tiet khi 15 ngay → ngu hanh thay doi. Tiet khi quan trong: Dong Chi (am cuc → du sinh), Ha Chi (duong cuc → am sinh).",
  "7. Dong Chi → duong khi bat dau tang. Ha Chi → am khi bat dau tang. 2 diem xoay chon cua 1 nam.",
  "8. 「tuy nhat bat tuy cuoc」— chon ngay tot nhung khong phu thuoc hoan toan. Nhan luc van la quan trong.",
];

// ROUND 21: Ngu hanh nhan cac SAU (10 can nhat chu + that khu + cap hanh) + thap than phoi ngu CHI TIET + dai van giao tiep CHI TIET

// 21a1. 十干日主性情 — CAN nhat chu → nhan cach (lop NGU HANH NHAN CAC SAU nhat, vi 10 can khac nhau)
export const TEN_GAN_DAYMASTER_PERSONALITY = {
  "甲": { vi: "Giap Moc", xiang: "參天之木 (cay dai thap)", nature: "thang, nhan tu, hien ngang, bao ve, phat trien", strengths: ["lanh dao", "trung thuc", "co dinh huong", "tu tin", "tu bo"], weaknesses: ["cung dau", "ngang buoc", "kho nghe y kien", "de phan xet"], secret: "Ben ngoai cung nhung ben trong mem — nhu cay lon: than thang nhung re chim, co the uon." },
  "乙": { vi: "At Moc", xiang: "花草之木 (co hoa)", nature: "mem mai, uyen chuyen, duyen dang, thich ung tot", strengths: ["linh hoat", "kien cuong ben trong", "giao tiep", "tuong tuong", "cham soc"], weaknesses: ["phu thuoc", "de bi an huong", "thieu quyet doan", "lac quan that"], secret: "Mem nhu co hoa nhung ran re chim sau vao dat — kien cuong ngam, khong de pha." },
  "丙": { vi: "Binh Hoa", xiang: "太阳之火 (mat troi)", nature: "nhiet huyet, sang sủa, phong khoang, loi cuon, chieu sang", strengths: ["lanh dao", "truyen cam hung", "quang dai", "loi cuon"], weaknesses: ["bao dong", "kieu ngao", "thieu kien nhan", "de buc phan", "hien ngoai"], secret: "Choi sang cho moi nguoi nhung de dot chay het suc luc — can biet giu nang luong." },
  "丁": { vi: "Dinh Hoa", xiang: "灯烛之火 (den/nen/sao)", nature: "am ap, tinh te, biet quan tam, co tu min", strengths: ["sang tao", "truc giac", "tuong tuong", "cham soc", "tinh te"], weaknesses: ["da sou", "nhay cam", "de lo lang", "thieu kien dinh"], secret: "Khong choi giat nhu Binh nhung am ap, sang tao, co tu min va truc giac manh." },
  "戊": { vi: "Mau Tho", xiang: "城墙之土 (tuong thanh)", nature: "vung chai, tin cay, khoan dung, bao thu, co trac nhiem", strengths: ["tin nen", "bao dung", "chac chan", "co trac nhiem", "kinh"], weaknesses: ["bao thu", "cham chap", "kho thay doi", "ngai moi", "cung nhu"], secret: "Nhu tuong thanh — kho pha nhung cung kho di chuyen, can thoi gian de chiu." },
  "己": { vi: "Ky Tho", xiang: "田园之土 (dat ruong)", nature: "khiem ton, nuoi duong, nhan nai, cham chi, tu bo", strengths: ["cham chi", "nuoi duong", "khiem ton", "tu bo", "cham soc"], weaknesses: ["tu ti", "de bi tham lung", "thieu uy", "thieu kien dinh"], secret: "Dat me nuoi cay — im lang nhung sinh moi thu, gia tri nam o su nuoi duong." },
  "庚": { vi: "Canh Kim", xiang: "刀剑之金 (dao kiem)", nature: "cung quyet, manh me, dung cam, chinh nghia, ky luat", strengths: ["quyet doan", "dung cam", "chinh nghia", "ky luat", "thuc luc"], weaknesses: ["cung ran", "vo tinh", "de cat", "kho gan ket", "nghiem khac"], secret: "Dao kiem — dung duoc (che sat, bao ve) nhung de lam trung thuong nguoi khac." },
  "辛": { vi: "Tan Kim", xiang: "珠宝之金 (trang suc)", nature: "tinh te, thanh cao, yeu cai dep, nhay cam, trong tinh", strengths: ["my giac", "tinh te", "trong tinh", "duyen dang", "nghe thuat"], weaknesses: ["kieu ham", "de vo", "nhay cam qua", "dam vi", "kho hoa nhap"], secret: "Trang suc — dep, thanh cao nhung de vo, can duoc bao ve va tron trong." },
  "壬": { vi: "Nham Thuy", xiang: "江河之水 (song giang/bien)", nature: "thong minh, tri tue, luu dong, phong khoang, tu do", strengths: ["trong thong", "tu do", "linh hoat", "khon ngoan", "kien thuc"], weaknesses: ["lang dang", "kho dinh", "de bo cuoc", "phuc tap", "kho kiem che"], secret: "Song giang — chay manh, tu do, kho kiem che; can biet co muc tieu." },
  "癸": { vi: "Quy Thuy", xiang: "雨露之水 (mui bom/suong)", nature: "uyen chuyen, te ny, co truc giac, nhu hoa, mong mo", strengths: ["truc giac", "nghe thuat", "te ny", "uong chuyen", "sang tao"], weaknesses: ["mong mo", "am uu", "thieu luc", "de bi an huong", "kho khan"], secret: "Mui bom — te ny, thoa man vat, co tai nghe thuat va truc giac than." },
};

// 21a2. 五行偏枯性格 — ngu hanh QUA MANH / QUA NHUOC → nhan cach lech
export const WUXING_IMBALANCE_PERSONALITY = {
  "木": { tooMuch: "co chap, ngang buoc, khong nghe loi, de phan xet, kho hop tac, cuc cuc", tooLittle: "thieu quyet doan, de bi an huong, u li, thieu suc song, nhat nat" },
  "火": { tooMuch: "nong nay, bao dong, hien ngoai, thieu kien nhan, de kieu ngao, lang phi", tooLittle: "lanh nat, thieu nhiet huyet, de bi quan, thieu dong luc, vo cam" },
  "土": { tooMuch: "bao thu, co chap, u li, kho thay doi, de u me, nang ne", tooLittle: "vo tin, khong dang tin, thieu lap truong, nong noi, vo dinh huong" },
  "金": { tooMuch: "sac sao qua thanh doc dia, nghiem khac, de cat dut, vo tinh, thu doan", tooLittle: "thieu quyet doan, y lai, nhu nhuoc, de bo cuoc, kem y chi" },
  "水": { tooMuch: "lang dang, khong chan thuc, da mou nhung thieu thuc, luo bi, phuc tap", tooLittle: "thieu linh hoat, co chap, kem giao tiep, kho hoc, tri luc kho phat" },
};

// 21a3. 五行双配性格 — 2 hanh noi bat nhat → nhan cach ket hop
export const WUXING_PAIR_PERSONALITY = {
  "木火": "Moc sinh Hoa — nhiet huyet, sang tao, ly tuong, truyen cam hung; de bao dong, lac quan that.",
  "木土": "Moc khac Tho (va nguoc lai) — noi tam mau thuan, co chau giua phat trien va an dinh; kiem cuong ben trong.",
  "木金": "Kim khac Moc — chinh nghia nhung cung ran, dam hanh dong, de xung dot; co y chi manh.",
  "木水": "Thuy sinh Moc — thong minh, linh hoat, truc giac + ly tri, thich hoc; de suy nghi nhieu.",
  "火土": "Hoa sinh Tho — am ap, thuc te, dang tin, co trac nhiem; hoi bao thu.",
  "火金": "Hoa khac Kim — manh me, dut khoat, dam noi dam lam; de bao dong, nong.",
  "火水": "Thuy khac Hoa — cam xuc manh, noi tam bat on, tai nang nhung linh dong; de bat on tinh cam.",
  "土金": "Tho sinh Kim — vung chai + quyet doan, dang tin, co quyen luc; hoi lan lanh.",
  "土水": "Tho khac Thuy — nang ne, mau thuan, giang xe giu on dinh va dong chay; can hoc linh hoat.",
  "金水": "Kim sinh Thuy — thong minh, lanh lanh, sac sao, duyen dang; co tai nang nhung kho gan.",
};

// 21b. 十神看配偶 CHI TIET — tinh phoi ngau + cung phoi ngau theo thap than
export const TEN_GOD_SPOUSE_DETAIL = {
  spouseStar: {
    rule: "Nam: Tai = vo (Chinh Tai = chinh vo, Thien Tai = vo le / tinh nhan / cuoi lan sau). Nu: Quan Sat = chong (Chinh Quan = chinh phu, That Sat = phu le / duyen bat on).",
    gods: {
      "正财": { vi: "Chinh Tai", spouse: "vo on dinh, cham chi, tiet kiem, trong gia dinh, trung thanh", marriage: "ON DINH, truyen thong, trung thanh" },
      "偏财": { vi: "Thien Tai", spouse: "vo thoang dang, giao tiep tot, co dau kinh doanh, co the da tinh", marriage: "co dong, de bat on, co the la nguoi da tung ket hon" },
      "正官": { vi: "Chinh Quan", spouse: "chong chinh phai, co trac nhiem, theo luat, nghe nghiep chinh dang", marriage: "ON DINH, dang tin cay, co danh phan" },
      "七杀": { vi: "That Sat", spouse: "chong manh me, co phong doat, quyem luc, de bao chua", marriage: "co lua hon nhung bat on, can boc chat, de tranh chap" },
    },
  },
  palaceByGod: {
    rule: "Nhat Chi = cung phu the. Xem thap than cua CHINH KHI (ban khi) cua Nhat Chi → cach phoi ngau + chat luong hon nhan.",
    gods: {
      "正官": { vi: "Chinh Quan", spouse: "phoi ngau co trac nhiem, on dinh, gia dinh tot" },
      "七杀": { vi: "That Sat", spouse: "phoi ngau manh me, de bat on, can boc chat, xung dot" },
      "正财": { vi: "Chinh Tai", spouse: "phoi ngau cham chi, hien di, tot cua, gioi giao" },
      "偏财": { vi: "Thien Tai", spouse: "phoi ngau thoang dang, giao tiep, de da tinh" },
      "正印": { vi: "Chinh An", spouse: "phoi ngau tu bi, bao dung, trong tinh than, nhu me" },
      "偏印": { vi: "Thien An", spouse: "phoi ngau doc lap, ky la, de ky vong, kho hieu" },
      "食神": { vi: "Thuc Than", spouse: "phoi ngau on hoa, co phuc, huong thu cuoc song, de thuong" },
      "伤官": { vi: "Thuong Quan", spouse: "phoi ngau thong minh nhung nghich lai, de tranh tinh, ky vong cao" },
      "比肩": { vi: "Tu Hien", spouse: "phoi ngau doc lap, nhu ban be, de tranh chap vi cung y kien" },
      "劫财": { vi: "Kiet Tai", spouse: "phoi ngau de tranh tai san, de xuat hien nguoi thu 3" },
    },
  },
  position: {
    rule: "Vi tri cua sao phoi ngau (trong tru nao) bao nguon goc / do lech tuoi cua phoi ngau.",
    "year": "sao o Nien Tru → phoi ngau tuoi lech lon, hoac tu xa den. Nien co Tai/Quan → de cuoi nguoi da tung ket hon.",
    "month": "sao o Nguyet Tru → phoi ngau la dong huong / ban hoc / dong nghiep, tuoi gan. Nguyet vung vung → phoi ngau cao, dep.",
    "day": "sao o Nhat Tru / Nhat Chi → phoi ngau gan gui nhat, anh huong truc tiep hon nhan.",
    "time": "sao o Thoi Tru → phoi ngau tre tuoi hon, hoac tu xa den gap.",
  },
  prosperity: {
    rule: "Sao phoi ngau VUONG (duoc Nguyet Lenh sinh tro) → phoi ngau cao, dep, dieu kien tot. Sao o TU/DIEC/DUYET/TUYET → phoi ngau dieu kien kem, suc yeu.",
    bonus: "Sao phoi ngau + Dao hoa → phoi ngau dep / dep trai, duyn gioi khac. Sao phoi ngau cung tru voi Tai tinh → phoi ngau gia dinh giau.",
  },
};

// 21c. 大运交接 CHI TIET — khoi van + giao van + chuyen goc van
export const DAYUN_HANDOVER_DETAIL = {
  qiyun: {
    rule: "Khoi van dua vao CAN NAM SINH + gioi tinh. Dem tu ngay sinh den KE (tiet khi) gan nhat.",
    direction: "Duong nam + Am nu = THUAN (dem xuoi den ke TIEP). Am nam + Duong nu = NGHICH (dem nguoc den ke TRUOC). Can nam 甲丙戊庚壬 = duong, 乙丁己辛癸 = am.",
    ageCalc: "Quy doi: 3 ngay = 1 tuoi | 1 ngay = 4 thang | 1 thoi (2 gio) = 10 ngay. Vd: 23 ngay → 7 tuoi 8 thang khoi van.",
    note: "Tiet khi (khong phai trung khi) la moc dem: Lap Xuan, Kinh Tran, Thanh Minh… moi tiet cach 30 ngay.",
  },
  jiaoyun: {
    what: "Giao van (交运) = thoi diem CHINH XAC chuyen tu dai van cu sang dai van moi. Tinh den GIO (thoi), khong chi den ngay.",
    taboo: [
      "Ngay giao van: tranh gap nguoi sinh nam XUNG voi minh (xung Thai Tue).",
      "Tranh di xa, den noi la, dong duc nhieu.",
      "Nen yen tinh o nha, tranh quyet dinh lon trong ngay ay.",
      "Tranh cuoi hoi, ky ket, dau tu lon ngay giao van.",
      "Neu ngay giao van trung 'thien khac dia xung' nhat tru → nam CUC bien dong.",
    ],
    feel: "「giao van thai van, bat tu cuong」— quan dan: nam giao van co the khoac, om dau. Nhung KHONG phai luc nao cung xau — van tot thi bao ton, van xau thi dot bien.",
  },
  zhuanjiao: {
    what: "Chuyen goc van (转角运) = 2-3 nam o giao thoa 2 dai van. Day la thoi ky QUYET DINH huong doi.",
    signal: "Dai van moi KHAC / XUNG nhat tru (cung phu the) → bien dong hon nhan / suc khoe / su nghiep.",
    rule: "Dai van moi la DUNG → 10 nam vung buoc len. La KY → 10 nam can than, kho khan.",
  },
  principles: [
    "1. Khoi van: duong nam/am nu dem xuoi den ke tiep; am nam/duong nu dem nguoc den ke truoc. Quy doi 3 ngay = 1 tuoi.",
    "2. Giao van tinh den GIO — khong chi nam. Ngay giao van can yen tinh, tranh xung, tranh quyet dinh lon.",
    "3. Nam chuyen goc (giao 2 dai van) = 2-3 nam dinh huong doi. Dai van moi = thap than + 12 truong sinh cua can/chi dai van.",
    "4. Thien khac dia xung (can khac + chi xung nhat tru) dung nam giao van = bien dong LON: cuoi / ly hon / chuyen viec / di chuyen.",
    "5. Dung nhap menh = 10 nam thinh vuong. Ky nhap menh = 10 nam can than. Ky khong nhat thiet xau neu than vuong co the chiu.",
    "6. Dai van cuoi (65+) = van tho / binh an. Giam theo duoi tai quyen, chong sung duong, trong suc khoe.",
    "7. Xet 3 lop: CAN dai van (5 nam dau) + CHI dai van (5 nam sau) + luu nien → xac dinh nam cuc thinh / cuc kho.",
    "8. 「menh hao bang van hao」— menh la ban nen, van la thoi co. Van TOT trong 10 nam thuong QUYET DINH hon menh goc.",
  ],
};

// ROUND 22: Tu Binh Chan Thuyen (子平真诠 - Than Hieu Triem) — CACH CUC DO SAU
// Nguon: ctext.org chapter 974137 (nguyen ban 47/48 chuong) + 搜狐 giang. Toan bo verified primary-source.

// 22a. PATTERN_CHENG_BAI — thanh/bai/cuu ung PER-CACH (8 cach x 3 trang thai). Engine-ready.
export const PATTERN_CHENG_BAI = {
  "正官": {
    cheng: ["Quan gap Tai/An + KHONG hinh xung pha hai"],
    bai: ["Gap Thuong khac / hinh xung"],
    jiu: { daiji: ["Phat tai lai phat thuong", "To quan lai phat hop", "Tai vuong sinh quan lai phat thuong/hop"], jiu: ["Phat thuong → to an giai", "Tap sat → hop sat thanh", "Hinh xung → hoi hop giai"] },
    yuanwen: "Quan phat tai an, huu vo hinh xung pha hai, quan cach thanh da; quan phat thuong khac hinh xung, quan cach bai da.",
  },
  "正财": {
    cheng: ["Tai sinh quan vuong", "Tai phat thuc sinh ma than cuong dai ti", "Tai to An ma vi tri thoa thiet, luong bat tuong khac"],
    bai: ["Tai khinh ti trong", "Tai to that sat"],
    jiu: { daiji: ["Tai vuong sinh quan lai phat thuong/hop"], jiu: ["Phat kiet → to thuc hoa / sinh quan che", "Phat sat → thuc che sat sinh tai / ton tai hop sat"] },
    yuanwen: "Tai sinh quan vuong…tai cach thanh da; tai khinh ti trong, tai to that sat, tai cach bai da.",
  },
  "正印": {
    cheng: ["An khinh phat sat", "Quan an song toan", "Than an luong vuong dung thuc thuong tiet khi", "An nhieu phat tai ma tai to can khinh"],
    bai: ["An khinh phat tai", "Than cuong an nang to sat"],
    jiu: { jiu: ["Phat tai → kiet tai giai / hop tai ton an"] },
    yuanwen: "…an cach thanh da; an khinh phat tai…an cach bai da.",
  },
  "食神": {
    cheng: ["Thuc than sinh tai", "Thuc dai sat vo tai, ky thuc tuu sat ma to an"],
    bai: ["Thuc than phat kieu", "Sinh tai lo sat"],
    jiu: { jiu: ["Phat kieu → tuu sat thanh cach / sinh tai ho thuc"] },
    yuanwen: "…thuc cach thanh da; thuc than phat kieu…thuc cach bai da.",
  },
  "七杀": {
    cheng: ["Than cuong that sat phat che"],
    bai: ["Phat tai vo che"],
    jiu: { daiji: ["Phat thuc che lai phat an", "Thuc dai sat an lai phat tai"], jiu: ["An ho sat → phat tai kh An ton thuc"] },
    yuanwen: "…sat cach thanh da; that sat phat tai vo che, that sat cach bai da.",
  },
  "伤官": {
    cheng: ["Thuong quan sinh tai", "Pei an ma thuong vuong an hu can", "Thuong vuong than nhac to sat an", "Dai sat vo tai"],
    bai: ["Phi kim thuy ma gap quan", "Sinh tai dai sat", "Pei an ma thuong khinh than vuong"],
    jiu: { jiu: ["Sinh tai to sat → sat phat hop"] },
    yuanwen: "…thuong quan cach thanh da; thuong quan phi kim thuy nhi gap quan…thuong quan cach bai da.",
  },
  "阳刃": {
    cheng: ["To quan sat lo tai an, bat hien thuong quan"],
    bai: ["Vo quan sat"],
    jiu: { jiu: ["Dung quan sat dai thuong thuc → trong an ho"] },
    yuanwen: "…duong nhan cach thanh da; duong nhan vo quan sat, nhan cach bai da.",
  },
  "建禄月劫": {
    cheng: ["To quan phung tai an", "To tai phung thuc thuong", "To sat nguc che phuc"],
    bai: ["Vo tai quan, to sat an"],
    jiu: { jiu: ["Dung quan ngu thuong → thuong bi hop", "Dung tai dai sat → sat bi hop"] },
    yuanwen: "…kien loc nguyet kiet chi cach thanh da; … chi cach bai da.",
  },
};

// 22b. XIANGSHEN_LAW — luat "tuong than" quyet dinh (chan thuyen ch.15). "Thuong tuong thậm hon thuong dung".
export const XIANGSHEN_LAW = {
  definition: "Phan toan cuc cach, chu 1 chu thanh nen cach = TUONG THAN (vd quan phat tai sinh → quan=dung, tai tuong). Nhu giong co tuong phu.",
  decisive: [
    "Thuong dung than thậm hon thuong than (dung than con hon khi bi pha).",
    "Thuong tuong thậm hon thuong dung (pha tuong than con nguy hon pha dung than).",
    "Tuong than vo pha → quy cach da thanh.",
    "Tuong than bi thuong → lap bai ky cach.",
  ],
  examples: [
    "Quan phat tai sinh → Quan=DUNG, Tai=TUONG (tai sinh quan giup quan).",
    "Sat phat thuc che → Sat=DUNG, Thuc=TUONG (thuc che sat giup than).",
    "An phat quan sinh → An=DUNG, Quan=TUONG (quan sinh an giup than).",
  ],
};

// 22c. PATTERN_QUALITY_DEEP — cach cuc cao/thap = hu tinh (tinh cam) x hu luc (suc luc). 2 truc doc lap.
export const PATTERN_QUALITY_DEEP = {
  axes: "2 TRUC DOC LAP: TINH (dung than co duoc phu/lo thanh, hop dac dia) x LUC (can goc sau/nong, nguyet lenh vuong/nhuoc).",
  highest: "HU TINH + HU LUC (vd Nham hop Dinh thanh quan + Nham goc sau / Tan Dinh dong goc nguyet lenh) → cach cuc toi cao.",
  high: "Hu tinh ma phung tinh chi toi / Hu luc ma phung luc chi toan → cach cao nhung khong cuc.",
  lowQing: "VO TINH (than cuong an vuong to sat → co phan; thuong quan pei an ma than vuong thuong xem an thai trong) → cach thap.",
  lowLi: "VO LUC (sat cuong thuc vuong than vo goc → yeu; than cuong ti trong tai vo khi → ngheo) → cach thap nguy.",
  note: "Thay the/ban bo sung cho PATTERN_QUALITY_RANKING (4 bac nau). Day la phan tich 2-truc cua Chan Thuyen ch.12.",
};

// 22d. JIXIONG_FANLI — DAO LUAN: 4 cat than cung PHA cach, 4 hung than cung THANH cach. Paradigm shift cua Chan Thuyen ch.18/19.
export const JIXIONG_FANLI = {
  jishenPos: { // 四吉神能破格
    "财": "Thuc than dai sat to tai → TAI pha cach.",
    "官": "Xuan moc hoa vuong gap quan → QUAN pha cach.",
    "印": "Sat phat thuc che to an → AN pha cach.",
    "食": "Tai vuong sinh quan lo thuc tap → THUC pha cach.",
  },
  xiongshenPos: { // 四凶神能成格
    "煞": "An goc khinh to sat tro than → SAT thanh cach.",
    "伤": "Tai phat ti kiet, thuong hoa kiet → THUONG thanh cach.",
    "枭": "Thuc dai sat linh kieu duoc dung → KIEU thanh cach.",
    "刃": "Tai phat that sat, nhan giai ac → NHAN thanh cach.",
  },
  principle: "「Tai bat ky thuong, quan bat ky kieu, sat bat ky nhan」— dung dac nghi thi than nao cung tot, bat phan cat/hung nguyen ban. Day la vut bo mac nhien 'cat than=tot, hung than=xau'.",
  chunza: {
    chun: "THUAN = ho dung luong tuong dac (vd Tan sinh Dan, Giap-Binh to = tai quan tuong sinh → thuan → quy).",
    za: "TAP = luong bat tuong mau (vd Nham sinh Mui, At-Ky to = quan thuong tuong khac → tap → hung).",
  },
  shengkeXianhou: "Cung Tai+Thuong to: TAI TRUOC THUONG SAU = tai hoa thuong → hau van co ket. THUONG TRUOC TAI SAU = thuong pha tai → chung vo ket, kho tu. Engine phai luu vi tri: nam > thang > ngay > gio.",
};

// 22e. ZAQI_TIANGAN_USE — tap khi (辰戌丑未) thu dung: to can hoi chi lay thanh. Chan thuyen ch.16.
export const ZAQI_TIANGAN_USE = {
  principle: "「Tu mo = tap khi…to can hoi chi lay thanh ma dung, tap ma bat tap」+「Tu mo bat ky hinh xung, hinh xung bat nhat thanh cach」(phan bo ngoai loi 'tai quan nha khong phat').",
  "辰": { mainQi: "Mau (vo)", hidden: "Mau/At/Quy", variants: { "toMau": "Thien Tai cach", "toQuy": "Chinh An cach", "toAt": "Nguyet Kiet cach", "hoiShenTu": "Thuy An cach", "hoiHaiMao": "Thuong Quan (moc) cach" } },
  "戌": { mainQi: "Mau (vo)", hidden: "Mau/Tan/Dinh", note: "Hoa kho + Tan du khi. Dinh/Tan to → tai an luong thuong = vo tinh." },
  "丑": { mainQi: "Ky (vo)", hidden: "Ky/Quy/Tan", note: "Kim kho + Quy du khi. Tan to + hoi Ty Dau kim → thanh cach; to Ky tai sinh quan = hu tinh." },
  "未": { mainQi: "Ky (vo)", hidden: "Ky/Dinh/At", note: "Moc kho + Dinh du khi. Ky to quan + hoi Hai Mao thuong = to quan voi hoi chi vo tinh." },
  youQing: "Tho quan/tai (Mau Ky) → xung thi kho khi co the phat. Thuy quan/tai → xung thi nguoc lai bi thuong (vd Dinh sinh Chen to Nham quan, Tuat xung → thuong quan hai).",
};

// ROUND 23: Mệnh Lý Ước Ngôn (命理约言 - Tran To Am / Tran Chi Tram, Thanh so) — CHUAN HOA + PHÊ BÌNH
// Nguon: 韦千里 1933 tuyen ban《Tuyen Mệnh Lý Ước Ngôn》, cross-check suanzhun + 2 zhihu.
// NOTE: 1 vai cau nguyen van (chư thần sát luận / nạp âm) chua OCR duoc tu scan NLC → ghi o muc stance.

// 23a. YUEYAN_QUGE — thang lay cach 4 bac + 6 chinh/6 bien cua Uoc Ngon (ch. 看命总法 + 看格局法)
export const YUEYAN_QUGE = {
  ladder: [
    "1) Lap tu tru, xem NHAT CAN la hanh gi, roi xem CHI THANG.",
    "2) CHINH KHI chi thang TO CAN → lay lam cach (vd Dan to Giap, Ngo to Dinh).",
    "3) Chinh khi KHONG to hoac bi khac → dung TANG CAN (vd Dan dung Binh/Mau, Ngo dung Ky).",
    "4) Tang cung khong to/bi khac → dung 'can chi the thinh luc vuong nhat' lam cach.",
    "5) LOC/ NHAN / TY / KIET chi giup nhat can, KHONG lay lam cach.",
  ],
  zheng: { count: 6, members: ["Chinh Quan", "Thien Sat (That Sat)", "Chinh An/Thien An", "Chinh Tai/Thien Tai", "Thuc Than", "Thuong Quan"], nature: "Chinh cach = ngu hanh chi thuong ly" },
  bian: { count: 6, members: ["Tong (tong cach)", "Hoa (hoa cach)", "Nhat hanh dac khi", "Luong than thanh tuong", "Am xung", "Am hop"], nature: "Bien cach = lay dung thi khac" },
  rule: "「Loc nhan ty kiet… cung bat dong ky de lay cach, chi dung vi nhat can chi tro」— loc/nhan/ty/kiet KHONG lap cach.",
  demystify: "「Dac thi dac cuc, sat thuong kyy phu quy; that thi that cuc, quan an kyy ban tien」— sat/thuong CUNG co the phu quy; quan/an CUNG co the ban tien. Bat bo mac nhien 'chuyen luan tai quan'.",
};

// 23b. YUEYAN_YONGSHEN — dung than de quy phu/uc + da dung than
export const YUEYAN_YONGSHEN = {
  core: "「Khanh menh dai phap, bat qua sinh khac phu uc nhi da」— xem mệnh chi la sinh-khắc-phù-ức. Dung than = hanh Phù/ức de can bang nhat can (hoac luc than).",
  weak: "Nhat can YEU → Phù; PHÙ QUA → uc kẻ phù; PHÙ BAT CAP → phù kẻ phù. (vd Moc yeu phu bang Thuy; Thuy phu qua → che Thuy bang Tho; Thuy phu bat cap → sinh Thuy bang Kim.)",
  strong: "Nhat can MANH → Uc; UC QUA → uc kẻ uc; UC BAT CAP → phu kẻ uc.",
  multi: "「Dai phu quy chi menh, bat thu nhat than vi dung. Ky chuyen thu nhat than gia, nai bo pien cuu te chi menh」— mệnh dai phu quy dung NHIEU dung than; mệnh chi co 1 dung than = 'mệnh bo pien cuu te' (chua va cham).",
  types: { riZhu: "Nhat Chu chi dung than (luc than phu/uc nhat can)", liuShen: "Luc than chi dung than (luc than phu/uc lan nhau)", xingYun: "Hanh van chi dung than = nguyen cuc dung than mang theo vao van" },
  vsBingyao: "Uoc Ngon CHONG 'huu benh phuong vi quy' (Zhang Shen Phong bệnh dược thuyet) → cho la thien kien. Nhat can quy nhat o TRUNG HOA.",
};

// 23c. YUEYAN_GUANSHA — Quan-Sat di/luu decision tree (ch. 看官煞去留法)
export const YUEYAN_GUANSHA = {
  rule: "Quan = thanh khiết (KHONG duoc pha); Sat = hung cuong (khong so pha).",
  cases: {
    guanHeavy_shaLight: { action: "去煞留官", vi: "Quan nang, Sat nhe → BO Sat (giu Quan thanh)", quote: "Quan trong sat nhe, tat dang kh sat, coi quan la thanh khiết chi khi, bat kha hon da." },
    shaHeavy_guanLight: { action: "不去官", vi: "Sat nang, Quan nhe → KHONG can bo Quan (Sat cuong khong so pha)", quote: "Sat trong quan nhe, bat bat kh quan, sat la hung cuong chi khi, bat ue hon da." },
    balanced_shangGuan: { action: "去官用煞", vi: "Quan-Sat can bang + Thuong Quan manh → bo Quan dung Sat", quote: "Thuong quan hu luc, tac kh quan dung sat." },
    balanced_shiShen: { action: "去煞用官", vi: "Quan-Sat can bang + Thuc Than manh → bo Sat dung Quan", quote: "Thuc than hu luc, tac kh sat dung quan." },
  },
};

// 23d. YUEYAN_META — dai van cong quan + than sat/nhap am phe binh + am-duong dong sinh dong tu (FLAG truong phai)
export const YUEYAN_META = {
  dayun: { vi: "Can-CHI dai van CUNG quan 10 nam, KHONG chia 5/5 hay 4/6 hay 3/7", quote: "Van chi can chi cong quan thap nien… vo thuong ha cac ngu nien chi ly.", conflictsWith: "Ngu ngon doc bo 'van hanh thap so, thuong ha ngu nien phan'" },
  shensha: { stance: "「Luc bac than sat hư thuyet」— Uoc Ngon HE CHONG than sat hư thuyet (ch. Chư Than Sat Luan). Than sat chi la phu, nen la sinh-khac-phu-uc + cach cuc.", ocrVerified: "Grok-4 Heavy OCR (NLC tr.131-132, 卷三 諸神煞論) nguyen van SACH: 「舊書稱神煞一百二十位，一一細推起例，毫無義理者十嘗七八… 此皆術家逞臆妄造… 往往數煞只是一煞… 不知人命吉凶，皆由格局運氣，安可以偶合神煞而信之」+ 桃花/流霞/紅艷 「爲男女淫慾之徵」nhưng bản thân là 五行生印/祿神 (vd 乙遇申=正官, 辛遇酉=祿神) → không phải dâm. Stance + luật XÁC MINH sạch." },
  nayin: { stance: "Uoc Ngon huong chinh ngu hanh sinh khac, ha cap nhap am. Nhap am chi la phu.", ocrVerified: "Grok-4 Heavy OCR (NLC tr.141, 卷三 納音論) nguyen van SACH: 「自唐以來，術家多用生年論命，以生年干支之納音爲主… 至後五代，徐子平始專以日干論命… 間有參用納音者，仍以日干爲主」→ nạp âm là CỔ PHÁP (Đường, năm/nạp âm), từ Từ Tử Bình (Ngũ Đại) chuyển sang NHẬT CAN → nạp âm hạ cấp. Stance + lịch sử XÁC MINH sạch." },
  zhonghe: { vi: "Nhật can quý nhất ở trung hoà; 『có bệnh mới quý』là thiên kiến.", ocrVerified: "Grok-4 Heavy OCR (NLC tr.31, 卷一 看日主法) nguyen van SACH: 「舊書論日主，或專主強旺，或反尚衰弱… 此即有病方爲貴之說，皆偏見也。凡日主最貴中和，自然吉多凶少」→ 『có bệnh mới quý』là THIÊN KIẾN, nhật can quý TRUNG HOÀ. XÁC MINH sạch.", quote: "Nhat chu toi quy trung hoa… gia co benh phuong vi quy chi thuyet, kien pieen da." },
  yinYangTongSheng: {
    vi: "Am-Duong CUNG sinh CUNG chet (甲/乙 deu truong sinh o Hoi) — TRAI voi 'duong thuan am nghich' cua tu binh chinh luu.",
    debateContext: "Day la 'ky sinh thap nhi cung' chua giai quyet: 旺相休囚 = muc NGU HANH (khong phan am duong, gan nguyet lenh); 十二长生 = muc THIEN CAN (tu binh phan am duong = duong thuan am nghich). Am-can vuong suy la chua giai quyet — Tam Mệnh Thong Hoi co 'am muon duong sinh'. Uoc Ngon chon dong sinh dong tu = 1 truong phai, KHONG phai consensus.",
    schools: { zipingMainstream: "Duong thuan am nghich (phan biet am-duong can, mac dinh hien tai)", yueyanLiming: "Am-duong dong sinh dong tu (Uoc Ngon)", luming: "Khong phan am duong (Loc Menh phap/co phap)" },
    ocrVerified: "Grok-4 Heavy OCR (NLC tr.124, 卷三 十干生旺墓等位論) nguyen van SACH: 「十干從各支起長生… 有陽生陰死、陰死陽生之異… 五陰生於洩方，死於生方，於理未通… 則陰陽同生同死爲是。考廣錄云：甲乙一木，非可以死木活木歧而二之，既爲一木，同生同死」→ Trần Tố Am phê bình 『dương sinh âm tử』là 『lý bất thông』, kết luận ĐỒNG SINH ĐỒNG TỬ. XÁC MINH sạch.",
    flag: "KOBIET HUNG len engine — la lua chon truong phai (xem BAZI_SCHOOL). Mac dinh giu 'duong thuan am nghich'.",
  },
  liuqinCritique: "Uoc Ngon ch. 看六亲法 phe binh ban do luc than chuan (chinh an=me, thien tai=cha...) la 'poi liet da duan': nguoi do cha me cung sinh, vi sao chi chinh an=me? Thien tai khac chinh an, ma tai la 'ngoa khac', sao sinh ra minh duoc? → Uoc Ngon de xuat phuong phap xem lai.",
};

// 23e. BAZI_SCHOOL — che do TRUONG PHAI (toggle) cho cac luat co thu xung dot
export const BAZI_SCHOOL = {
  current: "ziping-mainstream",
  note: "Toggle chuyen truong phai. Cac luat co thu xung dot giua co thu (am-duong dong sinh dong tu, dai van chia 5-5, trong luc than sat) chi kich hoat khi doi 'current'. Mac dinh ziping-mainstream (khop code hien tai).",
  options: {
    "ziping-mainstream": { label: "Tu Binh chinh luu (mac dinh)", changsheng: "Duong thuan am nghich (phan biet am-duong can)", dayun: "Can-CHI cung quan 10 nam", shensha: "Phu (thu yeu)", nayin: "Co dung, thu yeu" },
    "yueyan-liming": { label: "Mệnh Lý Ước Ngôn / Luc Menh", changsheng: "Am-duong DONG sinh dong tu", dayun: "Can-CHI cung quan 10 nam (phu hop Uoc Ngon)", shensha: "Luc bac (demote)", nayin: "Demote" },
    "geju-zhenyuan": { label: "Cach Cuc phai (Tu Binh Chan Thuyen)", changsheng: "Duong thuan am nghich", dayun: "Can-CHI cung quan 10 nam", shensha: "「Tinh cau vo quan cach cuc」(gan khong dung)", nayin: "Khong dung" },
    "mangpai": { label: "Manh phai (Doan Kien Nghiep)", changsheng: "Bo vuong suy", dayun: "Bo vong suy/dung than, doc cau truc", shensha: "Bo than sat", nayin: "Khong dung" },
  },
  conflicts: ["Am-duong dong sinh dong tu (Uoc Ngon) vs duong thuan am nghich (chinh luu)", "Dai van chia 5/5 (Ngu ngon doc bo) vs cong quan 10 nam (Uoc Ngon/Chan Thuyen)", "Than sat trong nang (co phap) vs luc bac (Uoc Ngon) vs bo (Manh phai)"],
};

// ROUND 24: Tam Menh Thong Hoi (三命通会 - Van Dan Anh, Minh) — SAU (kb.js truoc chi khai thac ~2%)
// Nguon: tu kho nguon ban quanxue.cn + 8bei8.com + guwendao.net (cung tu kho四库). Verified.

// 24a. SANMING_LIUQIN_FU — luc than phu quyet (8 luat nhan-qua). Nguon: Tam Menh Thong Hoi 卷七 赋云.
export const SANMING_LIUQIN_FU = [
  { line: "Nien phung nhan sat, au nien tong sang die lang", vi: "Nien tru co Duong Nhan + Sat → nho mo coi cha me.", tag: "parents" },
  { line: "Thoi ngu nhan thuong, vi nhan khuem nhi nu", vi: "Thoi tru Nhan + Thuong → van nien mat con.", tag: "children" },
  { line: "Xung gia vo huynh de, hinh gia ton luc than", vi: "Luc xung → it/khong anh chi em; Tam hinh → ton thuong nguoi nha.", tag: "siblings" },
  { line: "Thuong quan kien tai nhi huu tu, that sat huu che nai da nhi", vi: "Thuong Quan gap Tai → co con; That Sat co che (Thuc/An) → nhieu con.", tag: "children", override: true },
  { line: "Kiet tai trong trong phu tong tang, pha an thai trong mau tien vong", vi: "Kiet Tai nang → mat cha som; An bi pha nang → mat me som.", tag: "parents" },
  { line: "Thien quan/thien an/thien tai die phung, tat nhien thien thue", vi: "Thien Quan/An/Tai deu trung → con thu/hai/ben.", tag: "lineage" },
  { line: "Tai nguyen dac dia, nhan vo chi phuc thanh gia", vi: "Thuc Thuong (tai nguyen) dac dia → nho vo ma giau.", tag: "marriage-wealth" },
  { line: "Nhat ha thuong quan tri nhan, phu tac ac vong", vi: "Nhat chi Thuong Quan + Duong Nhan → chong chet du.", tag: "spouse-death" },
];

// 24b. SANMING_SHENSHA_FULL — +25 sao hiem (vuot ADVANCED_SHENSHA). Nguon: 卷三 总论诸神煞.
export const SANMING_SHENSHA_FULL = {
  "自缢煞": { vi: "Tu Yem Sat", nature: "hung", effect: "tu treo col. Dac hung khi khac than + ngo thuong + khong vong.", lookup: "Nien chi → nguoc he chi." },
  "水溺煞": { vi: "Thuy Noai Sat", nature: "hung", effect: "nguy hiem chem nuoc.", lookup: "Binh-Tu / Quy-Wei / Quy-Chou + dao hoa + kim nhan." },
  "挂剑煞": { vi: "Qua Kiem Sat", nature: "hung", effect: "sat nhan / bi sat. Cung quan phu/nguyen than/bach ho/kim than.", lookup: "Si-You-Chou-Shen 4 tru du toan hoac nang gap." },
  "天火煞": { vi: "Thien Hoa Sat", nature: "hung", effect: "hoa hoa khi van den hoa sinh vuong.", lookup: "Yin-Wu-Tuat du + can co Binh/Dinh + 5 vi khong Thuy." },
  "天屠煞": { vi: "Thien Do Sat", nature: "hung", effect: "om ngu la, mat chi; nang → luu day.", lookup: "ngay-chi x gio-chi cach 2 vi." },
  "天刑煞": { vi: "Thien Hinh Sat", nature: "hung", effect: "bi hinh phat, co om.", lookup: "Nien chi → gio (tu/suu→Y, dan→Canh...)." },
  "雷霆煞": { vi: "Loi Dinh Sat", nature: "dual", effect: "gap loc/quy → tot (phap quan/dao); gap nhan/sat/phi lien → hung (loi tran ho can).", lookup: "thang → chi (1/7→Tu, 2/8→Dan...)." },
  "官符煞": { vi: "Quan Phu Sat", nature: "hung", effect: "nhieu quan tai, cung duong nhan → luat.", lookup: "Thai tue + 5 chi (truoc)." },
  "病符煞": { vi: "Benh Phu Sat", nature: "hung", effect: "nhieu benh.", lookup: "Thai tue - 1 chi." },
  "死符煞": { vi: "Tu Phu Sat", nature: "hung", effect: "hung ac dot ngan, khong quy giai → yeu.", lookup: "Benh phu doi xung." },
  "丧吊煞": { vi: "Tang Dieu Sat (Hoang Quan)", nature: "hung", effect: "thai tue sat cung → hoa, luu nien cuc hung.", lookup: "Menh+2 chi=Tang Mon; Menh-2 chi=Dieu Khach." },
  "宅墓煞": { vi: "Trach Mo Sat", nature: "hung", effect: "sue/tue sat pha → om than (than trach).", lookup: "Menh+5 chi=tai; Menh-5 chi=mo." },
  "返本煞": { vi: "Phan Bon Sat", nature: "hung", effect: "co lap, 1 vong → khac cha me ton truong.", lookup: "Ngu hanh khong quy khi, ha khac thuong (ngay/thoi khac nam)." },
  "阴阳煞": { vi: "Am Duong Sat", nature: "cat/hung", effect: "Nam Binh-Tu nhat → nhieu dep gai; Nu Vo-Ngo nhat → nhieu dep trai; ky cung dao hoa/nguyen than → dam.", lookup: "Nam = Binh-Tu nhat; Nu = Vo-Ngo nhat." },
  "八专": { vi: "Bat Chuyen", nature: "hung", effect: "ngay co vo khong chinh, gio co con khong chinh; nu → khong chon than su.", lookup: "Nhat = Giap-Dan/At-Mao/Ky-Vi/Dinh-Vi/Canh-Than/Tan-Dau/Mau-Tuat/Quy-Suu." },
  "九丑": { vi: "Cuu So", nature: "hung", effect: "nu → san nan; nam → khong tot chung.", lookup: "Nhat = Nham-Tu/Nham-Ngo/Mau-Tu/Mau-Ngo/Ky-Dau/Ky-Mao/At-Mao/Tan-Dau/Tan-Mao." },
  "孤鸾寡鹊": { vi: "Co Loan Qua Tac", nature: "hung", effect: "nam khac vo, nu khac chong.", lookup: "Nhat = At-Ty/Dinh-Ty/Tan-Hoi/Mau-Than/Giap-Dan/Binh-Ngo/Mau-Ngo/Nham-Tu." },
  "破煞": { vi: "Pha Sat", nature: "hung", effect: "thieu nien ai tri, tai san hao tan, mat thuong.", lookup: "Mao-Ngo, Suu-Chen, Tu-Dau, Vi-Tuat tuong pha." },
  "浮沉煞": { vi: "Phuc Tram Sat", nature: "dual", effect: "o tai bach cung = truyen tien (phu); con lai hung.", lookup: "Tu Tuat xuat, Tu ngu hanh den nam chi." },
  "短寿煞": { vi: "Doan Thu Sat", nature: "hung", effect: "thuong vo con.", lookup: "Phan am gap Kieu (thien an)." },
};

// 24c. SANMING_SHENSHA_AXIOMS — 4 nguyen tac tong cua than sat (卷三 总论诸神煞)
export const SANMING_SHENSHA_AXIOMS = [
  "1. Cat than muon o SINH VUONG vi → vinh quy; hung sat muon o TU TUYET vi → lanh (thien chung). Nguoc lai nghich.",
  "2. Thai tue nay am = than. Than bi khac/bi lam o tu-bai-tuyet → bat bat chi tai. Nhung thoi nay am khac sat → giao.",
  "3. Menh vao quy cach + noi then co sat + co phuc than tro → QUYEN BILH (lam sep/quan). Khong phuc than + sat thua vong → ha tien ac tu.",
  "4. 「Quan tu cach trung cung pham that sat duong nhan; tieu nhan menh noi cung co chinh an quan tinh」— than sat la PHU, KHONG thay the ngu hanh/cach cuc.",
];

// 24d. SANMING_NV_BAFA + SANMING_NV_BAGE — nu menh 8 phap + 8 cach (卷七 论女命)
export const SANMING_NV_BAFA = {
  pure: "Thuan (纯): 1 quan (hoac 1 sat), co tai/vo an, khong giao cham, khong hon tap → quy phu.",
  he: "Hoa (和): than nhac, 1 chong tinh, khong xung pha → tot voi chong con.",
  qing: "Thanh (清): 1 quan 1 sat khong hon, tai sinh quan, an tro than → thanh quy.",
  gui: "Quy (贵): quan co tai tro, 3 ky, khong qui binh → phu nhan cap cao.",
  zhuo: "Doc (浊): ngu hanh that vi, than qua vuong, chong chinh khong hien, nhieu chong thien → ha tien.",
  lan: "Lam (滥): nhieu chong (minh+am), tai vuong, co sat → tham tai tu am (tinh giao).",
  chang: "Xuong (娼): than vuong + chong tuyet + thuc thuong vuong → co vuong su ni.",
  yin: "Dam (淫): than dac dia + chong tinh minh am giao tap → dam.",
};
export const SANMING_NV_BAGE = [
  "Vong phu thuong tu: thuc than bi thuong → vong phu, thuong tu.",
  "Vong tu thuong phu: quan sat that vi/thoi + thuc thuong vuong o thoi → vong tu, thuong phu.",
  "Thuong phu khac tu: quan/thuc deu that vi + an trung → ca chong con deu khac.",
  "An tinh thu phan: than vuong + chong vuong, khong xung khac → vo chong hoa.",
  "Phuc tho luong bi: than vuong + tai/quan/an deu dac vi + thuc than → phuc tho.",
  "Chinh thien tu xu: vo chong voi vo thu (ty kien tranh) → ai vuong lam chinh, ai nhac lam thien.",
  "Chieu gia bat dinh: chong tinh hop minh nhuong chong khong vuong → cuoi tre, cuoi khong ro, hoac co tinh ngoai.",
];

// 24e. SANMING_NAYIN_XIJI — 30 cap nap am hich/ky (卷一 论纳音取象). Engine lookup nap am → hich/ky.
export const SANMING_NAYIN_XIJI = {
  "海中金": { yi: "Giap-Tu gap Quy-Hai (Chau tang duyen hai) → quy", ji: "khong hinh xung", nature: "bao tàng, them tai khong hien" },
  "金泊金": { yi: "thuy moc; binh dia tu", ji: "lo trung hoa, them long vang than", nature: "mong manh, giong sao" },
  "白蜡金": { yi: "lo trung hoa; canh thinh binh dan", ji: "khong thay nuoc → binh thien", nature: "phong ngau, tao doa" },
  "砂中金": { yi: "lo hoa + thanh thuy", ji: "lo hoa khong che → tai", nature: "non toc, phai loi" },
  "剑锋金": { yi: "DAI KHI/DAI HAI thuy; thuy thanh", ji: "hoa (dac biet Dan-Ty tam hinh) → cuc hung", nature: "sat nhat, quyet doa" },
  "钗钏金": { yi: "tinh thuy; vo phu/hue tu", ji: "binh ngo that hoa; hai thuy → binh thien", nature: "my vi, trang suc" },
  "霹雳火": { yi: "phong/loi/thuy (Giai Hai, Dai Khi, Chen Ty)", ji: "pham thuy cung duoc (than hoa)", nature: "dot phat, bien dong, quyen luc" },
  "炉中火": { yi: "binh dia moc (dac biet Tan Mao); kim = cai", ji: "qua nhieu moc khong thuy → thien tai", nature: "on hoa, luyen tep" },
  "覆灯火": { yi: "thuy (cam dau) + moc; binh kim", ji: "phong (chen ty trung) → dot nat → thien", nature: "dem sang, tu duy" },
  "天上火": { yi: "binh dia moc; ngo/than kim = cot sang", ji: "qua nhieu moc → lao cot → hung", nature: "cuong nhu nhat/trang" },
  "山下火": { yi: "son moc + phong (giap dan, tan mao); thanh thuy", ji: "that hoa, dai hai, binh van thien → hung", nature: "am ap, linh hoat" },
  "山头火": { yi: "son moc (Giai Suu); phong; binh dia", ji: "khong son/moc → ha tien; hinh xung cuc so", nature: "manh, phan tam" },
  "桑柘木": { yi: "sa trung tu; dai ha thuy", ji: "thue hoa lua → hung", nature: "phuc vu, che tap" },
  "松柏木": { yi: "son (Giai Suu, Tan Suu) + thuy; binh tu", ji: "lo trung hoa + phong moc → phanh phoi → hung", nature: "tuan bi, cuong truc" },
  "大林木": { yi: "Giai Suu = son; binh kim + vo/phuong tu = dong luong", ji: "that hoa (Giap-Tuat At-Hoi) dot → hung thien", nature: "phat trien, bao ve" },
  "杨柳木": { yi: "sa tu; thanh thuy; gieu dao", ji: "Ngo-Vi nhap mo + binh ngo → hung", nature: "uyen chuyen, dep" },
  "石榴木": { yi: "thanh ha va + binh thuy", ji: "vo/phuong/kim/sa cung → hung", nature: "con trai, sinh de" },
  "平地木": { yi: "lo/tru tu (canh dan, tan mao) = dong luong; thanh thuy", ji: "kiem kim; dai ha khong moc → hung", nature: "nen nha, cung cap" },
  "涧下水": { yi: "sa trung/kiem phong kim; Giap-At moc 1 vi", ji: "vo thuy (Chen-Tuat-Suu-Vi) → cuc hung", nature: "cam khit, trong sang" },
  "大溪水": { yi: "CAM SAU kim; binh tu = co quy", ji: "than dau/ty (le phong) → bien dong → hung", nature: "manh me, chay tu do" },
  "长流水": { yi: "bach lap/kiem phong kim; gieu dao/duong du + luu = QUY", ji: "Tuat xung → phan lam → hung", nature: "lien tuc, khong dut" },
  "天河水": { yi: "dai ha/truong luu (Quy-Hai = long vu thien); binh lo", ji: "qua nhieu = lam lao → hai", nature: "bom tuoi, sinh vat" },
  "井泉水": { yi: "sa trung kim + moc (binh moc = ngoc dang tu); vo/thuong tu", ji: "phia tu = dong dot → hung", nature: "cam lap, cuon vui" },
  "大海水": { yi: "Giai Suu = son → Hai tinh; lo = trau; binh dia tu = chan", ji: "thien binh Hoa → hung", nature: "lon, tong hop" },
  "壁上土": { yi: "binh kim/thuong tu = goc; moc = cot dong", ji: "pham hoa + moc → hung thien", nature: "chang, bao ve" },
  "城头土": { yi: "duong tu (Giai Suu) = thanh; binh moc (Quy-Vi) = tot; sa tu", ji: "canh dan/tan mao (cung khu) = thanh beng → bat an", nature: "vung chai, kinh dai" },
  "砂中土": { yi: "kiem phong/sa kim = nuoi; binh thuy = cam", ji: "vo phuong tu → chon vuit", nature: "long song, bien doi" },
  "路旁土": { yi: "vo/dau; gieu dao (Canh-Dan) = tot nhat", ji: "bat khi khong vuong hoa → hung", nature: "cho menh, phuc vu" },
  "大驿土": { yi: "tru vo binh tu = ky binh; vo binh = goc", ji: "hai thuy khong son → hung thien", nature: "phat trien, dai dao" },
  "屋上土": { yi: "binh dia moc; Giap-Chen At-Ty = vao nha cach; kiem phong kim", ji: "lo trung hoa (Binh-Dan) cuc hung", nature: "phu che, an dinh" },
};

// 24f. SANMING_DAYUN_STAGE — dai van 12 truong sinh giai doan doan (卷二). + 24g XIAOYUN + 24h TAISUI
export const SANMING_DAYUN_STAGE = {
  changsheng: "Truong Sinh → tao lap, khoi su moi, sang tao",
  guanjian: "Lam Quan → thinh vuong, vui ve, bat dau co thanh tuu",
  diwang: "De Vuong → cuc thinh, phat tai, sinh con, co庆",
  shuai: "Suy → lui bac, mat co",
  bing: "Benh → om om, that bai tien",
  si: "Tu → tang toc nguoi nha, ban than bat tac, nut me",
  jue: "Tuyet → cung Tu nhung nang hon, cuc be tac",
  mu: "Mo/kho → bang dat, an dinh",
  taifu: "Thai + Quan Dai → moi viec deu trung, binh an",
  note: "Ap dung cho tung GIAI DOAN 10 nam cua dai van (chi dai van). Ket hop voi Dung/Ky de xet tot/xau.",
};
export const SANMING_XIAOYUN = {
  method: "Tieu van = phap Tuy Tinh Tu: xuat phat tu THOI TRU, 1 vi = 1 nam, thuan/nghich dua vao NAM CAN (duong nam/am nu thuan; am nam/duong nu nghich).",
  use: "Bo sung cho dai van. Dong han (chua giao dai van) dung RIENG phap nay. Quy tac: 「dai van tuy cat, tieu van bat thong, vi kha ngon cat」— dai van tot + tieu van khong thong → chua tinh tot.",
};
export const SANMING_TAISUI_RULES = [
  "「Tuoi thuong nhat can co hoa bat khong; nhat pham tuoi quan tai duong bat trong」— Luu nien thai tue khac nhat can → hoa NHE; nhat can khac thai tue → hoa NANG (tren tri duoi=thuan; duoi len tren=nghich).",
  "Tu van tinh lam (luu nien = dai van): chi Duong Nhan/That Sat la hung; Tai/Quan/An lai la cat — KHONG phai luc nao cung xau.",
  "Huy Khi: nhat can/thoi can hop thai tue thien can → ten HUY KHI (toi tam, khong minh). Can nhat hop tuoi → hoa nang; tuoi hop nhat → hoa nhe.",
  "Chan thai tue/Chuyen chi sat: luu nien = nam tru sinh → than cung; hinh xung pha hai → hung cuc.",
];

// 24i. SANMING_GANHE_HUAMEANING — thien can ngu hop hoa khi y nghia + 24j JINJIAOTUIFU
export const SANMING_GANHE_HUAMEANING = {
  "甲己": { name: "中正之合", vi: "Ton trong, rong ruong, binh thang. Nhuoc: co tiem, de phan." },
  "乙庚": { name: "仁义之合", vi: "Quyet doa, co thu, nhan nghia. Nhuoc: dung suc thue hoanh, tuong mau xau." },
  "丙辛": { name: "威制之合", vi: "Nghiem khac, de so. Nhuoc: qua tinh, dam hiem, de dam." },
  "丁壬": { name: "淫慝之合", vi: "Nhieu tinh, de dong, tham nap. Nu: de bi moi cuoc / cuoi lech tuoi (lao phu thieu phu)." },
  "戊癸": { name: "无情之合", vi: "Vo tinh (lao phu thieu phu / thieu phu lao phu). Nam cuoi vo tre, nu cuoi chong gia." },
};
export const SANMING_JINJIAOTUIFU = {
  "进神": { jiazi: ["甲子", "己卯", "甲午", "己酉"], vi: "Phat tich, bang nhanh, hanh thong" },
  "交神": { jiazi: ["丙子", "辛卯", "丙午", "辛酉"], vi: "Mo vieu deu bat xung (trung binh)" },
  "退神": { jiazi: ["丁丑", "壬辰", "丁未", "壬戌"], vi: "Lui bac, giang chat, that bai" },
  "伏神": { jiazi: ["戊寅", "癸巳", "戊申", "癸亥"], vi: "Dinh tri, hoan ai, bat tac" },
};

// ROUND 25: LOP META — Hong Phi Mo《Trung Quoc Co Dao Toan Menh Thuat》(1989) + pha he lich su
// Nguon: WeRead TOC + 暨南大学 程佩/张其凡(2013)述评 + 陆致极《Trung Quoc Menh Ly Hoc Su Luan》.

// 25a. MINGLI_HISTORY_LINEAGE — pha he lich su menh ly (9 thoi ky)
export const MINGLI_HISTORY_LINEAGE = [
  { era: "Tien Tan", stage: "Thien menh quan manh phat", figures: "Khong Tu 知天命 / Manh Tu 立命 / Trang Tu / Mac Tu 非命", idea: "「Tu sinh hu menh, phu quy tai thien」. Mac Tu phi menh = tieng noi phan bien noi tai (Hong Phi Mo Ch.4§1 dung lai)." },
  { era: "Dong Han", stage: "Khai niem co ban thanh hinh", figures: "Vuong Sung《Luận Heng》", idea: "Can chi x am-duong ngu hanh bat dau gan voi nhan su. Menh dinh luan so khai." },
  { era: "Duong", stage: "CO PHAP nen tang — Tam Tru", figures: "Ly Hu Trung (762-813)", idea: "Lay NAM/THANG/NGAY (tam tru) day menh, NIEN tru lam chu. Han Du mo chi minh: 「bach bat thatt nhat nhi」. Giai doan tam tru." },
  { era: "Tong ★", stage: "KIM PHAP cach tan & thanh thuc", figures: "Tu Tu Binh (Tu Cu Dich)", idea: "① Trong tam: nien tru → NHAT tru. ② Tam tru → TU TRU (giai thoi tru) = 「bat tu」. Dan gian goi 「tu binh thuat」. Diem ngoat.", note: "Canh bao hoc thuat: Luu Quoc Trung(2009) cho rang su tich Tu Tu Binh la「tich luy tao thanh」; Dong Huong Tue(2011) phan bien." },
  { era: "Minh — dinh", stage: "Tap dai thanh", texts: "《Tam Menh Thong Hoi》(Van Dan Anh) — bach khoa; 《Uyen Hai Tu Binh》; 《Khung Thong Bao Giam》— dieu hou" },
  { era: "Thanh — sau", stage: "Phuong phap luan thanh thuc", texts: "《Tu Binh Chan Thuyen》(Tham Hieu Triem) — cach cuc; 《Menh Ly Uoc Ngon》(Tran To Am) — chuan hoa; 《Trich Thien Tủy》+ Nhan Thiet Trieu xiển vi — dinh triet ly" },
  { era: "Dan Quoc (1916-49)", stage: "Chuyen hinh 1 — pho cap + hoc thuat", figures: "Vien Thuc San《Menh Ly Tham Nguyen》(1916); Vi Thien Ly《Thien Ly Menh Cao》(1935); Tu Lac Ngo《Tu Binh Tuy Ngon》(1938); Pan Tu Doan《Menh Hoc Tan Nghia》(1937,首引 Jung)" },
  { era: "1989 ★Hong Phi Mo", stage: "Dai Luc hau Van Cach khoi phuc", figure: "Hong Phi Mo + Khong Ngoc Tran", work: "《Trung Quoc Co Dao Toan Menh Thuat》, Thuong Hai Nhan Dan Xuat Ban 1989, phu de 「Co Kim The Tuc Nghien Cuu 1」", significance: "Dai Luc hau 文革 de nhat ban. Khung 4 chuong: 缘起→基础→具体方法→批判. Lop phê binh (Ch.4) la required de qua kiem duyet 1989; noi dung day nghiem tuc." },
  { era: "2000s+", stage: "Da nganh / vi mo", figures: "Luc Tri Cuc《Trung Quoc Menh Ly Hoc Su Luan》(2008, duy nhat thong su); Ha Le Da — triet ly; Luu Quoc Trung — van hien khao" },
];

// 25b. MINGLI_CRITICAL_EVALUATION — lop phe binh nhan thuan luan (Hong Phi Mo Ch.4)
export const MINGLI_CRITICAL_EVALUATION = {
  stance: "「Tinh toan menh la mot loai me tin」(tu nhan) — NHUNG noi dung giang nghiem tuc. Lap truong: the tuc nghien cuu, KHONG phai tin nguong. Dich den: SU VIEC O CON NGUOI (事在人为).",
  dualLayer: { surface: "Khung phê binh Ch.4 (can thiet de xuat ban 1989 Dai Luc)", reality: "Vuong Duc Phong: 「cai phê binh do toan la gia」— thuc te la trinh bay chinh dien he thong." },
  epistemicCritique: {
    xiangzhenglv: "「Hai thi san lau」— lien ket tuong trungg (can chi↔ngu hanh↔van menh) nhu ao anh, hu ao khong vung.",
    yanxifafa: "「Phong vu phiêu dao」— qua trinh suy luan tu bat tu → van menh thieu nen tang logic vung chac.",
  },
  bigQuestion: "「Hoc thuat ho? Me tin ho?」— dan nguoi doc tu van nghi van, KHONG cho cau tra loi don gian.",
  landing: "SU VIEC O CON NGUOI — de cao chu quan nang dong, khong menh do troi dinh.",
  selfProofLimit: { who: "Hong Phi Mo tu phe menh (Canh Than nhat chu, sinh 1940)", predicted: "Tho 84 tuoi", actual: "Mat 2005, tho 65 (ung thu phoi giai doan muon)", lesson: "「Hong Phi Mo dai tai nhu vay, cho minh phe menh con the, huong ho nga boi ho」— minh chung thuc tien cho「dien sat phap phong vu phiêu dao」." },
  practitionerEthics: "Ch.3§17 旧时Tinh Menh Gia dao duc yeu cau — nguoi xem menh xua co chuan dao duc nghe nghiep (kb.js chua co).",
  accuracyCaveat: "Ly Cu Chuong (Dai Loan): menh ly khong 100% chinh xac, do du bao khoang 50-70%. Vien Thuc San dan Trieu Chan Nhu: 「Loc menh chi thuyet, vi bat tan nghiem. Nhan gia thuong thap chi bat that」.",
};

// 25c. MINGLI_CLASSICS_GUIDE — 「doc gi tiep theo」+ so sanh 8 bo co thu
export const MINGLI_CLASSICS_GUIDE = {
  levels: {
    nhapMon: ["《Thien Ly Menh Cao》— giao trinh the le, van tu tinh", "《Trung Quoc Co Dao Toan Menh Thuat》— tu hoc, du phu luc lich tiet khi 100 nam"],
    tienGiai: ["《Tu Binh Chan Thuyen》— cach cuc + dung than, logic nghiem", "《Menh Ly Uoc Ngon》— van nghia xuong dat, thien ban so hoc"],
    sau: ["《Trich Thien Tủy》(Nhan Thiet Trieu Xiển Vi) — dinh triet ly, can chu giai", "《Khung Thong Bao Giam》— dieu hou, nghia ly tinh", "《Tam Menh Thong Hoi》— tham khao bach khoa, the le tap"],
  },
  comparativeEval: {
    "《Tam Menh Thong Hoi》": "Thu la quang bac,惜 the le bat tinh (bach khoa nhung tap).",
    "《Uyen Hai Tu Binh》": "Thu gia punch hop, mat tinh hoa doc dao.",
    "《Khung Thong Bao Giam》": "Nghia ly toi tinh ma tu bat dat y.",
    "《Tu Binh Chan Thuyen》/《Menh Ly Uoc Ngon》": "Xuat tu van nhan chi thu, van nghia xuong dat,惜 that chi thai qien.",
    "《Trich Thuyen Tủy》": "Nghia ly tinh tham…co y tang dau lo vi (cao tham nhung kho hieu).",
  },
};

// ROUND 26: NHANH KIN — luu phai khau truyen / phi main-stream. ⚠ Co tranh cai — co CO canh bao.
// Nguon: Doan Kien Nghiep《Doan Thi Ly Tuong Hoc》, Ly Ham Than《Bat Tu Du Chan Tong》, 英熊无名 zhihu column.

// 26a. BAZI_FACTION_MAP — ban do luu phai menh ly (it tranh cai, an toan)
export const BAZI_FACTION_MAP = {
  geju: { name: "Cach Cuc phai (Tu Binh Chan Thuyen/Menh Ly Uoc Ngon)", core: "Nguyet lenh → to can → lay cach cuc = dung than. Cat than thuan dung, hung than nghich dung. 8 chinh cach.", weakness: "Chi hop 「thuong tao」phu quy; thanh cach cuc hiem → vo dung voi dan thuong." },
  wangs: { name: "Vuong Suy phai / Trich Thien Tủy phai (Nhan Thiet Trieu)", core: "Khong cu cach, khong than sat, chi ngu hanh sinh khac. Nhat chu vuong suy → dung than phu uc. + thong quan/dieu hou/benh duoc.", weakness: "「Me trung hoa」— Nhan khong noi ro thang do vuong suy → hau hoc bat nghiem." },
  mangpai: { name: "Manh phai (Doan Kien Nghiep he thong hoa ~2002, su Hao Kim Duong)", core: "KHONG dung dung than/vuong suy. Doc cau truc 做功 + loai tuong. 3 phap: ly/tuong/ky.", flag: "⚠ tinh xac thuc truyen khau chua chung minh; Doan co the pha tu sang tao." },
  xinpai: { name: "Tan phai (Ly Ham Than 2003, Tran Quoc Nhat he thong)", core: "5 luan: bach than / phan doan / hu thuc / khong vong / noi-ngoai moi. Van dung vuong suy-dung ky.", flag: "⚠ cuc ky tranh cai, bi goi 「thousand-year toi nhan」; gia tri du bao chua validate; ly thuyet hay doi." },
};

// 26b. MANGPAI_ZUOGONG — manh phai 做功 (⚠ truyen thua chua chung minh, CO che cong khai mach lac)
export const MANGPAI_ZUOGONG = {
  flag: "⚠ NGUON: truyen khau mu, Doan Kien Nghiep he thong hoa ~2002. Tinh xac thuc truyen thua KHONG chung minh duoc, nhung co che KY THUAT cong khai & mach lac. Danh gia 「phi-mainstream, dung tham khao」.",
  premise: "Manh phai 弃 vuong suy、废 dung ky — KHONG dung dung than/vuong suy. Moi thu doc qua 「cau truc 做功」+ 「loai tuong」.",
  binZhu: { zhu: "Nhat chu + nhat chi (±thoi tru) = 「CUA MINH」(chu)", bin: "Cac can chi khac = 「CUA NGUOI KHAC / ben ngoai」(khach)", question: "Chu co bat/cai/khong che duoc Khach khong? → do la 做功." },
  tiYong: { note: "⚠ KHAC 体用 trong kb.js (L142 = tu binh: the=nhat chu, dung=dung than). Manh phai: the=cong cu, dung=muc tieu.", ti: "The = cong cu san co: Ty Kien, Loc, An, Thuc", yong: "Dung = muc tieu theo duoi: Tai, Quan, Thuong", zuogong: "「Dung the ma lay dung」= 做功 (lam cong)." },
  gongFei: { gongshen: "Cong than = can chi TIEU HAO nang luong NHUNG SINH HIEU QUA (co lam viec).", feishen: "Phe than = tieu hao nang luong ma KHONG sinh hieu qua (ro ri/phe).", rule: "La so tot ∝ ty le Cong than/Phe than cao. 「La so cang差 thi phe than cang nhieu」." },
  modes: {
    zhiyong: "Che dung (khong che): chu KHAC khach de chiem — Ty kien di tai/Thuong quan di quan/Thuc thuong che sat/An che thuc thuong/Tai che an. Pho bien nhat.",
    huayong: "Hoa dung (bien hoa): An hoa quan sat → An → than. Quan-lo nhieu = lam quan.",
    shengyong: "Sinh dung/phe dung: Thuc thuong sinh tai (phat tai) hoac thuc thuong phe tuu. 「Noi thuc than」(thuc an sinh tai an) = doanh nhan.",
    heyong: "Hop dung (ket): Nhat can/nhat chi HOP muc tieu (hop tai/hop quan). NGOAI LE: day Manh phai moi xet Than cuong than nhac — hop tai nhu vac nang, than vuong thang tai.",
    muyong: "Mo dung (nhap mo): Nhap mo = thau/tien ca/so huu/quan ly. 「Xung=kho(song), khong xung=khiem(chet)」.",
    fuhe: "Phuc hop: nhieu mode cung lam cong → nhieu nghe.",
  },
  zhengFan: { zhengju: "Chinh cuc = 做功 cua Nhat tru KHOP voi y do nguyen cuc → thuan.", fanju: "Phan cuc = 做功 cua Nhat tru TRAI nguoc y nguyen cuc → be tac/lo do." },
};

// 26c. XINPAI_FIVE_THEORIES — tan phai ngu luan (⚠ CUC KY TRANH CAI, co khi hoa duoc)
export const XINPAI_FIVE_THEORIES = {
  flag: "⚠ CUC KY TRANH CAI: bi goi 「thousand-year toi nhan」vi phan doan/hu thuc; main-stream truyen thong coi la tu sang/thuong mai hoa. Co che CONG KHAI & co khi hoa duoc, nhung gia tri du bao CHUA validate. Danh gia 「tham khao co canh bao」.",
  baishen: { name: "Bach Than Luan (thay the luc than)", problem: "Khi thap than cua mot luc than KHONG xuat hien → doc sao?", rule: "Thay bang mot thap than CO MAT cung am-duong (dong tinh). Nam-trai/nu-phai de gan chinh/thien. KHONG dat luc than thay the len nien can.", precedent: "Tien le:《Di An》phi cung luan than (nen KHONG han do Ly sang tao)." },
  fanduan: { name: "Phan Doan Luan (dao nguoc)", rule: "Dieu kien cu the → dung than ↔ ky than DAO NGUOC. Co so: ngu hanh cuong (cuc roi thi phan).", conditions: "Phu-uc格: Nguyet can/Thoi can THAY bi khac-phe-hao HOAC khong vong → phan doan. NHUNG Nguyet can duoc Nien can/Nien chi sinh → KHONG phan. Phan doan roi thi toa ha van phan. Nien can KHONG phan. Tong cach thien can KHONG phan." },
  xushi: { name: "Hu Thuc Luan (thuc/khong)", rule: "Thuc = can chi CO trong nguyen cuc; Hu = KHONG co. Phan: thuc-dung/thuc-ky/hu-dung/hu-ky.", dayun: "Than-thuc bi tac dong TRUOC → doan 1 ket qua; sau do ap dung luat dai van/luu nien binh thuong → doan ket qua thu 2 (thuong nguoc). 「Thuc-thuc tac dung, cat hung giai hu」." },
  kongwang: { name: "Khong Vong Luan", rule: "Tra tu nhat nguyen; khong vong = khong co; nien chi khong vong ≠ khong; nguyet lenh khong vong → xet vuong suy dung nien chi cho 50% trong so; dai van dia chi dien thuc khong vong; luu nien dien thuc → doan dang「khong ngo… tuong… nhung…」." },
  neiWai: { name: "Noi-Ngoai Moi Truong Luan", rule: "Thien can = ngoai moi (co khong? ben ngoai the nao?); Dia chi = noi moi (co bao nhieu? xu huong?). Trai(nien)=xa hoi, Phai(nhat)=noi bo/gia dinh." },
};

// 26d. WUXING_TANYUAN_THESIS — 《Ngu Hanh Tham Uyen》(Duong Nien Le 1997) — CHI CLAIM, co che KHONG cong khai
export const WUXING_TANYUAN_THESIS = {
  flag: "⚠ SACH THUC (Duong Nien Le, 1997) nhung CO CHE 7-档/10-级 KHONG lay duoc. Day la CLAIM cua columnist 「英熊无名」, CHUA phai hoc thuat chuan consensus. KHONG duoc bia ten 档/级.",
  book: "《Ngu Hanh Tham Uyen》", author: "Duong Nien Le (Dong Bac Loc Linh, nien du co that 1997)", year: "1997 (Dinh Suu) thang 9",
  nature: "Menh hoc nhap mon giao trinh (sach nhap mon) — KHONG phai bi dien",
  lineage: "Dong Nhan Thiet Trieu/Khung Thong Bao Giam + Tran To Am《Menh Ly Uoc Ngon》 (vo tinh trungg duong, khong biet Uoc Ngon khi viet)",
  thesisClaim: "CHO RANG: 「Trung hoa chi me」ton tai vi co thu (Trich Thien Tủy/Khung Thong Bao Giam) noi 「boi dac trung hoa phuong kyy phu quy」nhung KHONG BAO GIO dinh nghia thang do. Nhan Thiet Trieu cang lam cang nham mo. → Duong de xuat luong tu hoa.",
  proposedScale: "Ngu hanh vuong suy chia 7 档 (1 nguon phu noi 5 档 — BAT NHAT QUAN trong nguon thu cap) + dung than chia 10 cap.",
  unverifiedFlag: "⚠ DINH NGHIA CU THE cua 7 档/10 cap KHONG cong khai — chi co claim, khong co method. KHONG duoc bia ten 档/级 neu implement.",
};

// ROUND 27: CO PHAP (古法) — he TIEN-TU-BINH (pre-子平): 珞琭子赋注 (Song) + 李虚中命书 (Tang)
// Nguon: NLC/Wikimedia scan, OCR Grok-4 Heavy. Day la he MENH LY BI TRUYEN bi mat — nam-tru/tam-nguyen/nhap-am/than-sat,
// BI THUONG THEO NGHIEN CUU VI tu Tu Binh (Nham Thiet Trieu/Tran To Am) da 'chuan hoa' (ha cap nhaps am + luc bac than sat)
// nen CO PHAP (nam-tru/nhap-am/than-sat trong tam) tro thanh 'phan bi an'.

// 27a. GUFA_MODEL — CO PHAP (李虚中/珞琭子) vs KIM PHAP (子平). Su khac bieu cot.
export const GUFA_MODEL = {
  source: "李虚中命書 (Tang, 鬼谷子 truyen) + 珞琭子賦注 (Song, 王廷光/曇瑩/徐子平 chu). Grok-4 Heavy OCR.",
  principle: "「以人之始生年月日所值日辰支干相生勝衰死王相斟酌推人壽夭貴賤，百不失一二」(韩愈 mộ chí cho Lý Hư Trung).",
  vsZiPing: {
    "tru chu (主柱)": { gufa: "NIEN TRU (năm sinh) lam chu — 'lap nien vi ton'", ziping: "NHAT TRU (ngày) lam chu" },
    "ngu hanh": { gufa: "NHAP AM (nhaps am) sinh khac lam noi + chinh ngu hanh", ziping: "chinh ngu hanh sinh khac, nhaps am bi ha cap" },
    "than sat": { gufa: "TRONG TAM (than sat = thien/dia nhi khi, loc ma) — khong the bo", ziping: "bi ha cap (Uoc Ngon 'luc bac')" },
    "trong tam": { gufa: "TAM NGUYEN (thien/dia/nhan nguyen) + Loc Ma + Loc", ziping: "NHAT CAN vuong suy + dung than" },
    "doc tinh": { gufa: "nam + nhaps am + than sat = 'huyen kho luan' (sau, kho)", ziping: "dung than/phu-uc/cach cuc = 'cat tiet'" },
  },
  note: "GUFA la 'co phap/hư trung phap' (Lý Hư Trung). Tu Tu Binh (Ngũ Đại/Tong) chuyen sang 'nhat can' = KIM PHAP. Uoc Ngon (Thanh) 'chuan hoa' KIM PHAP bang cach LUC BAC than sat + HA CAP nhaps am → CO PHAP tro thanh phan 'bi an'.",
};

// 27b. LUOLUZI_VERSES — 珞琭子三命消息赋 (goc loc menh) — ngu van SACH tu Grok OCR
export const LUOLUZI_VERSES = {
  source: "珞琭子賦注 卷上/下 (Song). Goc cua toan bo menh ly. Grok-4 Heavy OCR NLC scan.",
  verses: {
    "五行通道": "「是知五行通道，取用多門；理于賢人，亂于不肖；成于妙用，敗于不能」— ngu hanh la dao, lay dung da cach; nguoi hieu thanh, ke ngay nhao; dung tot thanh cong, dung hong that bai.",
    "尊凶卑吉": "「尊凶卑吉，救療無功；尊吉卑凶，逢災自愈」— ton (dai van/nien) hung ma by (luu nien/tieu van) cat → cuu chang thau; ton cat ma by hung → gap tai tu lanh. → DAI VAN quyet dinh hon LUU NIEN.",
    "祿有三會": "「祿有三會者，長生、帝旺、庫也，其爲至吉之地」(vd kim 見巳酉丑, moc 居亥卯未, hoa 寅午戌, thuy 申子辰) → 3 vi truong sinh/de vuong/mo = cuc cat.",
    "災有五期": "「災有五期者，衰、病、死、敗、絕，其爲至凶之地」→ 5 vi suy/benh/tu/bach/tuyet = cuc hung. (Luu 'ngu quy' lien ket voi day.)",
    "火快水土遲": "「聞朝歡而旋泣，爲盛火之炎陽；剋禍福之賒遙，則多因于水土」— Hoa/Moc tinh nhanh (sang chieu khoc cuoi), len phat/phe nhanh. Thuy/Tho tinh cham → hoa/phuc cham, lau thanh cung lau bay.",
    "金木未成器": "「金木未能成器，聽哀樂以難名；似木盛而花繁，狀密雲而不雨」— Kim/Moc khong tu chuyen, phai 'gia vat' (hoa/sau) moi thanh khi (hop dung).",
    "北人運南": "「北人運至南方，貿易獲其厚利」— Thuy (bac) chay van den Hoa (nam) = tai loc (phuong/van hop ngu hanh sinh khac).",
  },
  sanyuanWugui: "「三元逢五鬼，閻羅三使追」— tam nguyen gap ngu quy (5 vi suy/benh/tu/bach/tuyet) → nguy cuc.",
};

// 27c. JIUMING_SYSTEM — 'Cuu Menh' (9 phan tu luan menh) cua CO PHAP + than sat thien-dia nhi khi + tu tru phan so
export const JIUMING_SYSTEM = {
  source: "李虚中命書 卷中/下. Grok-4 Heavy OCR.",
  jiuming: "「三元四柱祿馬爲九命」— 9 phan tu: TAM NGUYEN (thien nguyen + dia nguyen + nhan nguyen) + TU TRU (thai/nguyet/nhat/thoi) + LOC + MA. Phai set 'nang khong san suy, ton nghich thuan nghich, tinh y tuong'.",
  shenshaTiandi: "「干中所用神煞乃天之清氣；支中所用神煞乃地之濁氣。凡言神煞各分天地二氣」— than sat co 2 lop: THIEN (can) = thanh khi; DIA (chi) = doc khi. Day la vi sao CO PHAP trong than sat — chung phan biet thien/dia.",
  sizhuFenshu: "「胎主父母祖宗者十分，月主事者八分，時主事者十分」— CO PHAP chia trong so: THAI (= nguyen khi, xem bo me/to tong) 10 phan, NGUYET 8 phan, THOI 10 phan. (Nhan 「根在苗先，實從花後」— goc truoc non, qua sau hoa.)",
  tayuan: "CO PHAP dung 5 truc: THAI + NGUYET + NHAT + THOI (them THAI NGUYEN). Khac KIM PHAP (4 truc). Thai nguyen = thang con - 9 (hoac +9) → moc cua phu nu sinh con, xem phu the/con cai.",
};

// 27d. SHENTOU_LU_NAYIN — 'Than Dau Loc' (神頭祿) = nhaps am tung giap-ty → doc tinh BI TRUYEN
export const SHENTOU_LU_NAYIN = {
  source: "李虚中命書 卷中. Grok-4 Heavy OCR. Day la bang nhaps am 'than dau loc' — moi cap nhaps am co 1 doc tinh rieng (BI TRUYEN cua co phap).",
  principle: "「神頭祿」= moi nhaps am (vd Hai Trung Kim, Phong Hoa) deu co 1 'loc than' + tinh cach rieng, xem de doan cuoc doi. Khac 'nhaps am chi la ten goi' cua kim phap.",
  examples: {
    "甲寅": "Giap-Than = nhaps am 'Đai Khe Thuy' → 「潤深處靜之水」— nuoc chim sau yen tinh. Gia Moc vuong + Tho suy → ky dac qui di.",
    "癸丑": "Quy-Suu = 'Tang Dot Moc' → 「剛柔相濟之木，水土承於旺方則生育利物」— mem cung tuong ung, thuy-tho sung vuong → sinh vat loi.",
    "乙卯": "At-Mao = 'Dai Khac Thuy' → 「死中受氣之水，雖敗無妨」— nuoc chet ma van co khi, bai nhung khong ngai.",
    "丙辰": "Binh-Then = 'Sa Trung Tho' → 「發施養生之土」— dat sinh tuong, thich Hoa tro, 'khong quan tu du'.",
    "戊午": "Mau-Ngo = 'Thien Thang Hoa' → 「神發離明之火，旺中受絕」— hoa sang can, vuong trung chua tuyet.",
    "辛酉": "Tan-Dau = 'Thach Lau Moc' → 「包秀結英之木，喜生旺，忌見金多」— moc chua anh, thich vuong, so kim nhieu.",
    "庚午": "Canh-Ngo = nhaps am 'Lo Bang Tho' → 「合輝始育之土，氣數未備，惟喜旺方」— dat moi nuoi, can vuong.",
    "辛未": "Tan-Vi = 'Lo Bang Tho' → 「自本立形之土，有火相助得木相乘亦小康」— dat tu lap, hoa-tro → khang.",
    "壬申": "Nham-Than = 'Kiem Phong Kim' → 「自任權制之金，剛而有斷，愛土木而嫌火重」— kim quyet doan.",
    "癸酉": "Quy-Dau = 'Kiem Phong Kim' → 「剛銳利用之金，不嫌絕敗，惟畏鬼多」— kim cong loi, so qu nhieu.",
    "甲戌": "Giap-Tuat = 'Son Dau Hoa' → 「墓成息用之火，不求壯旺，欲物平資」— hoa mo thanh, khong can vuong.",
    "乙亥": "At-Hoi = 'Son Dau Hoa' → 「氣散游魂之火，生於木火榮方」— hoa tan hon, sinh o moc-hoa.",
    "丙子": "Binh-Tu = 'Gian Ha Thuy' → 「深沉停會之水，會源得生用制於東南為出常之器」— nuoc sau yen.",
    "丁丑": "Dinh-Suu = 'Gian Ha Thuy' → 「漸下欲流之水，水土相承源脈不斷」— nuoc chay cham, lien tuc.",
    "戊寅": "Mau-Dan = 'Thanh Dau Tho' → 「生體安和之土，火土俱盛金旺之榮」— dat on hoa, kim-vuong quy.",
    "己卯": "Ky-Mao = 'Thanh Dau Tho' → 「鬼旺體堅之土，金重木多見財重乃富貴長遠」— dat cung, tai nang → phu quy.",
    "庚辰": "Canh-Then = 'Bach Lap Kim' → 「顯光之金而未成材，金剛土重，無炎火之官乃大臣之制」— kim chua thanh khí.",
    "辛巳": "Tan-Ty = 'Bach Lap Kim' → 「資始之金，身堅體柔，金助土成為光大之器」— kim mem, thanh khí lon.",
    "壬午": "Nham-Ngo = 'Duong Lieu Moc' → 「化薪之木，畏火強，得水資之逢土富貴」— moc hoa tan, so hoa manh.",
    "癸未": "Quy-Vi = 'Duong Lieu Moc' → 「伐根之木，氣敗體柔，喜水之榮」— moc re, thich thuy.",
    "甲申": "Giap-Than = 'Tuyen Trung Thuy' → 「源泉之水，務有資助流長無鬼則運廣潤」— nuoc nguon, luu dai.",
    "乙酉": "At-Dau = 'Tuyen Trung Thuy' → 「母旺進趨之水，資以金、用以火，超卓輔弼之用」— nuoc me vuong.",
    "丙戌": "Binh-Tuat = 'Oc Thuong Tho' → 「祿資支附堅固火鍾之土，資之以木光耀不羣」— dat vung hoa-long.",
    "丁亥": "Dinh-Hoi = 'Oc Thuong Tho' → 「福壯臨官之土，潤之以水麗澤以金可以顯功」— dat phuc, hien cong.",
    "戊子": "Mau-Tu = 'Tich Lich Hoa' → 「神龍之火，不畏水刑，水木盛則佳」— hoa than long, khong so thuy.",
    "己丑": "Ky-Suu = 'Tich Lich Hoa' → 神頭祿「餘光不凡之火，體重不假奇財」— hoa du quang bat pham.",
    "庚寅": "Canh-Dan = 'Tung Bach Moc' → 「五行堅實之木，德貴相符必作顯揚大用」— moc cung thuc, hien duong.",
    "辛卯": "Tan-Mao = 'Tung Bach Moc' → 「自旺經制之木，不畏霜雪，制以金損以火逢旺相成巨室之材」— moc vuong, khong so suong tuyet.",
    "壬辰": "Nham-Then = 'Truong Luu Thuy' → 「會貴守成之水，五行不雜，文明清異之資」— nuoc thanh khong tap.",
    "癸巳": "Quy-Ty = 'Truong Luu Thuy' → 「流遠澄清之水，音中無土則濟物惠施之德」— nuoc trong, duc do vat.",
    "甲午": "Giap-Ngo = 'Sa Trung Kim' → 「沙汰之金，志大有節操，丁壬始可陶鎔之寶」— kim loc, dai chi.",
    "乙未": "Tan-Vi = 'Sa Trung Kim' → 「強悍剛礦之金，金相用火盛處父子相乘為珍寶」— kim cuong, phu tu.",
    "丙申": "Binh-Than = 'Son Ha Hoa' → 「無資之火，金木壯旺而有制得干生即為厚實」— hoa vo tu, can-sinh dac.",
    "丁酉": "Dinh-Dau = 'Son Ha Hoa' → 「平易無為之火，得木旺則火炎，人生得此無不貴豪」— hoa binh de, quy hao.",
    "戊戌": "Mau-Tuat = 'Binh Dia Moc' → 神頭祿「不材之木，喜逢水旺乃可資榮」— moc bat tai, thich thuy.",
    "壬寅": "Nham-Dan = 'Kim Boc Kim' → 「歲用體柔之金，喜土資之旺財官不可太剛」— kim mem, thich tho-tro.",
    "癸卯": "Quy-Mao = 'Kim Boc Kim' → 「財旺體弱之金，身在生旺方或得真官無不配合」— kim tai-vuong the-nhac.",
    "丙午": "Binh-Ngo = 'Thien Ha Thuy' → 神頭祿「至陰之水，發於陽明蒸氣氤氳」— nuoc chi am, khi am uan.",
  },
  note: "Day la phan 'nhaps am luan menh' bi Uoc Ngon HA CAP — nhung trong CO PHAP no la COT NGOI. Luc pair voi nhan 'tinh' (doc tinh) rieng = bí truyền.",
};

// 27e. GUFA_LINEAGE — co phap → kim phap (bi an cua co phap)
export const GUFA_LINEAGE = [
  { era: "Tong tien / Than tien", text: "《珞琭子三命消息赋》", note: "GOC cua toan bo loc menh. 'Cuu menh' (3 nguyen + 4 tru + loc ma). An not: 王廷光/曇瑩/李同/徐子平 4 nha chu." },
  { era: "唐 (Tang)", figure: "李虚中 (762-813)", note: "「CO PHAP」dai bieu. Nam-tru lam chu + nhaps am + than sat. 韩愈 mộ chi: 'bach bat thatt nhat nhi'. = 'hư trung phap'." },
  { era: "Ngũ Đại → Tong", figure: "徐子平 (徐居易)", note: "「KIM PHAP」/ TU BINH. Chuyen NIEN → NHAT, nhaps am → chinh ngu hanh, them THOI TRU = bat tu. 'Dan gian goi tu binh thuat'.", debate: "Luu Quoc Trung(2009): su tich Tu Tu Binh la 'tich luy tao thanh' (chua chung minh)." },
  { era: "Tong", text: "《五行精纪》(Lieu Trung, 30 quyen)", note: "Bach khoa CO PHAP (hư trung phap). Uoc Ngon trich 《广录》= sach nay. Tap hop nhaps am/than sat/loc ma co phap day du." },
  { era: "Minh-Thanh", figures: "三命通会/渊海子平/穷通宝鉴/子平真诠", note: "KIM PHAP thanh thuc. Nhaps am & than sat BI HA CAP (dac biet Uoc Ngon 'luc bac'). CO PHAP tro thanh 'phan bi an'." },
];

// ROUND 28: CO PHAP nang cao — 天乙貴人 bản gia + ngũ âm nạp âm (tu OCR Grok《李虚中命书》卷上)
// 28a. GUFA_NOBLE_BENJIA — 天乙貴人 bản gia + 貴合/貴食 + quý thần ưu liệt (bí truyền cổ pháp)
export const GUFA_NOBLE_BENJIA = {
  source: "李虚中命書 卷上. Grok-4 Heavy OCR.",
  tianyiPositions: "天乙貴人 (cat than cuc tot): 甲戊庚 → 丑未; 乙己 → 子申; 丙丁 → 亥酉; 壬癸 → 卯巳; 六辛 → 寅午. (Tra tu CAN nam/ngay sinh → chi co quy nhan.)",
  benjia: "「本家貴人」— vd 甲人 co 戊+庚+丑+未 = ĐẠI QUÝ (甲戊庚 deu la duong, cung nhom quy than). 甲 duoc 丁丑辛未 la cap 2. Nguyen tac: cung nhom can (甲戊庚/乙己/丙丁/壬癸/六辛) cung hien quy nhan = 'ban gia' → phuc rat nang.",
  guiheGuishi: "「有貴合則多稱意，有貴食則祿多稱意；二者無之，官高祿重無往不利」— QUÝ HỢP (can nam ngũ hợp voi can cua quy nhan) → moi viec y; QUÝ THỰC (can nam sinh ra quy nhan) → lu loc y. Ca 2 khong co thi cung 'quan cao lu trong'.",
  guishenYoulie: "貴神分 loai (theo cap quy nhan, thu cong/du lieu Grok OCR): 乙丑=文星, 乙未=華蓋, 乙亥=截路空亡, 辛未=華蓋, 癸未=伏神華蓋, 甲子=進神, 丙子=交神, 戊子=伏神, 庚子=德合, 壬子=羊刃, 甲申=截路空亡, 戊申=伏馬, 庚申=建祿馬, 壬申=大敗... → khong phai quy nhan nao cung giong nhau, co 'van tinh/hoa cai/khong vong/duong nhan' phan biet.",
  note: "Day la lop 'quy nhan BI TRUYEN' cua CO PHAP: khong chi xem co quy nhan khong, ma con xem BAN GIA (cung nhom) + QUY HOP/QUY THUC + UU/LIET (van tinh/hoa cai/khong vong). Kim phap thuong chi tra 'co/khong quy nhan' → mat lop sau nay.",
};

// 28b. NAYIN_WUYIN_THEORY — ngũ âm nạp âm (宫商角徵羽 ↔ thiên can ngũ hợp) + ngũ hành số
export const NAYIN_WUYIN_THEORY = {
  source: "李虚中命書 卷上. Grok-4 Heavy OCR.",
  wuyin: "「甲己真宮，乙庚真商，丙辛真羽，丁壬真角，戊癸真徵」— THIEN CAN NGU HOP ↔ NGU AM (宫/商/角/徵/羽). Day la GOC cua nhaps am: moi cap ngu hop = 1 am.",
  wuxingShu: "「火得一，土得二，木得三，金得四，水得五」— NGU HANH SINH SO: Hoa=1, Tho=2, Moc=3, Kim=4, Thuy=5. (So sinh → nap vao 60 giap ty thanh 30 nhaps am.)",
  nayinMechanics: "「納音者，配由十干十二支，周而終之數也；干支相乘」— nhaps am = 10 can × 12 chi = 60 giap ty, chia 2 = 30 cap nhaps am, moi cap 1 'am' (ngu am) + 1 hanh.",
  tiedao: "「金土同體而異名」(Kim-Tho cung the khac ten) — lay vi du: Cung=Tho, Thương=Kim... → ngu am cung ngu hanh, nhung 'kim tho dong the'.",
  note: "Nhaps am khong phai 'phu' nhu kim phap noi — no la 1 HE THONG doc lap: ngũ âm + ngũ hành số + 60 giap ty → 30 nhaps am, moi nhaps am 1 tinh (xem SHENTOU_LU_NAYIN). Uoc Ngon ha cap nhaps am = mat lop 'ngu am luan' nay.",
};

// ROUND 29: MANH PHAI (盲派) NANG CAO — chi tiet bí truyền (tu 算准网 盲派初级命理学 = 段建业)
// Bo sung Round 26 (MANGPAI_ZUOGONG chi co framework). Day la CHI TIET van hanh.

// 29a. MANGPAI_SANFA — 盲派 3 phap: ly/tuong/ky
export const MANGPAI_SANFA = {
  source: "段建业《盲派初级命理学》. 算准网.",
  sanfa: {
    lifa: "LY PHAP (理法) — hieu 'bai van' cua bat tu: doc ra cau truc, ai lam chu, lam cong gi, huong toi gi.",
    xiangfa: "TUONG PHAP (象法) — chuyen can chi/thap than thanh 'hinh anh' (vd Giap Moc = cay lon, At Moc = co; chinh quan = sep/con chong). Moi can chi/thap than = 1 bieu tuong.",
    jifa: "KY PHAP (技法) — ky nang ung dung: dinh thoi diem (ung ky), dinh su kien, phan biet chinh/phu.",
  },
  vsTraditional: "Manh phai BO 'dung than' (khong co khai niem dung than) → dung LY+TUONG+KY 3 phap + 'lam cong' thay the.",
};

// 29b. MANGPAI_GONGWEI_XIANG — 4 tru cung vi + lay tuong (bí truyền: doc cuoc doi qua 'cung vi')
export const MANGPAI_GONGWEI_XIANG = {
  source: "盲派初级 ch.2 四柱宫位取象.",
  palaces: {
    year: "NIEN TRU = TO THUONG / CHA ME. (1-18 tuoi). Xem: nguyen khi, phuc toc to tien, than phan som.",
    month: "NGUYET TRU = CHA ME / ANH CHI EM. (18-35 tuoi). Xem: nguon goc gia dinh, su nghiep som.",
    day: "NHAT TRU = BAN THAN (+ NGAY CHI = VO/CHONG). (35-55 tuoi). Xem: ban than, phoi ngau.",
    time: "THOI TRU = CON CAI / VAN NIEN. (55+ tuoi). Xem: con cai, ket qua cuoc doi, van nien.",
  },
  xiangPrinciple: "Manh phai doc cuoc doi qua CUNG VI (tru nao) + THAP THAN (sao nao) + HANH (ngu hanh). Vd 'Thien Tai o Nhat Tru' = ban than nhieu tai; 'o Thoi Tru' = con cai giu tai.",
};

// 29c. MANGPAI_GANZHI_XIANG — can chi lay tuong (moi can/chi = 1 bieu tuong rieng)
export const MANGPAI_GANZHI_XIANG = {
  source: "盲派初级 ch.4 干支详解.",
  gan: {
    "甲": "Giap Moc = CAY LON, moc thang. Dieu kien song: PHAI CO GOC + GAP THUY. Khong gap Thuy = 'chết moc' (khong song). Giap-Tu = vo goc.",
    "乙": "At Moc = CO / MAM / DAY LEO, moc cong. Phai co goc; vo goc bo khong xem, xem toa chi.",
    "丙": "Binh Hoa = MAT TROI (chinh)/ lua lon — sang, chieu, cong khai.",
    "丁": "Dinh Hoa = DEN / NEN / SAO — am ap, som dem, sinh tu goc (cay chay).",
    "戊": "Mau Tho = NUI / TUONG THANH — co, nang, chong đe.",
    "己": "Ky Tho = DAT RUONG / Khuon vuon — nuoi duong, mem.",
    "庚": "Canh Kim = DAO KIEM / quang kim — cung, sat.",
    "辛": "Tan Kim = TRANG SUC / kim non — dep, mong manh.",
    "壬": "Nham Thuy = SONG GIANG / bien — manh, chay tu do.",
    "癸": "Quy Thuy = MUI BOM / SUONG — te ny, chim.",
  },
  note: "Manh phai KHONG chi xem 'hanh' (moc/hoa...) ma xem 'TUONG' (cay lon/co, mat troi/den...). 2 moc (Giap/At) khac tuong hoan toan → doc khac.",
};

// 29d. MANGPAI_HE_RULE — 盲派 luat hop: chi HOP khong HOA + hop quan/hop tai + am hop
export const MANGPAI_HE_RULE = {
  source: "盲派初级 ch.4(3-4) 天干合/地支合.",
  tianganHe: "「天干五合 CHI GIANG HOP, BAT GIANG HOA」(Giap-Ky/At-Canh/Binh-Tan/Dinh-Nham/Mau-Quy). Manh phai chi nhin 'HOP' (ket/bam/lay), KHONG nhin 'HOA' (bien hanh). KHAC truyen thong (co hoa khac).",
  heGuanHeCai: "Nhat can HOP → chi 2 truong hop: HOP QUAN (lam sep/quan) hoac HOP TAI (lay tai). Nhat can tim hop = 'muc tieu' cua ban than.",
  dizhiAnhe: "DIA CHI AN HOP (暗合, bí truyền): cap chi co 'ban than an hop' (vd Dan-Hoi, Ngo-Hai... cap ban than). An hop = 'tin tinh am gia', giong nhu loan tinh bi an, xem ngoai tinh/vo chong cam.",
  liuheMarriage: "DIA CHI LUC HOP = 'UNG KY HON NHAN'. Luc hop = ket than (ket hon), cung la moc tinh cuoi hoi.",
};

// 29e. MANGPAI_DAXIAN_YINGQI — 盲派 大限 ứng kỳ (timing qua tuoi cua tung tru) — BÍ TRUYEN
export const MANGPAI_DAXIAN_YINGQI = {
  source: "盲派初级 ch.7 应期.",
  daxian: "「大限应期」— moi TRU quan 1 khoang tuoi: NIEN TRU 1-18t, NGUYET TRU 18-35t, NHAT TRU 35-55t, THOI TRU 55+t. Su kien o tru nao → xay ra trong khoang tuoi do.",
  rule: "「大限应凶，大运应吉，此运不克，过运则凶」— neu dai HAN (tru) bao hung, nhung dai VAN dang cat → chua xay ra; qua van thi hung xay. (Dai han = dinh 'cai gi', dai van = dinh 'khi nao'.)",
  yingqi: "UNG KY (dinh thoi diem chinh xac): hop = moc tinh (vd luc hop = cuoi); xung = bien dong; cong than len luc = thanh cong; phe than len luc = that bai. Dai van + luu nien cham vao 'tu trung' cua cong/phe than = nam xay ra.",
};

// 29f. MANGPAI_ZHIFA — 盲派 制法 (hieu suat lam cong = phu quy cap do)
export const MANGPAI_ZHIFA = {
  source: "盲派初级 ch.6 制法明析.",
  principle: "Trong 'che dung' (chế phục muc tieu) cau truc, HIEU SUAT su dung nang luong = phu quy cap do. Hieu suat cao = dai phu quy, thap = dan thuong.",
  zhifa: {
    heZhi: "HOP CHE (合制) — dia chi luc hop/an hop che phuc muc tieu. Hieu suat CAO (hop = chechat).",
    xingZhi: "HINH CHE (刑制) — hinh che phuc. Hieu suat trung binh.",
    chongZhi: "XUNG CHE (冲制) — xung che phuc. Manh nhung bat on.",
    keZhi: "KHAC CHE (克制) — ngu hanh khac che.",
  },
  note: "Manh phai luon hoi: 'CONG nao lam viec? Hieu suat bao nhieu?' → do phu quy. Day la 'dinh luong' cua manh phai (khac 'dung than vuong suy' cua kim phap).",
};

// ROUND 30: 地理→五行→體質 (五方五民) + 十一曜餘氣 phê bình (tu OCR Grok 古今圖書集成 星命部)
// 30a. GEO_WUXING_PERSON — 五方五民: dia ly → ngu hanh → the chat/tinh cach (bí truyền, bo sung WUXING_APPEARANCE)
export const GEO_WUXING_PERSON = {
  source: "欽定古今圖書集成·星命部 (NLC scan). Grok-4 Heavy OCR.",
  principle: "Ngu hanh khong chi o 'nhat chu' ma con o 'DIA LY' — nguoi sinh o cac vung dia hinh khac → inh huong ngu hanh khac → the chat/tinh cach khac. (Bo sung WUXING_APPEARANCE — ay la muc 'dia-ngu-hanh'.)",
  wufang: {
    "山林 (rung nui)": "DUOC MOC khi nhieu → 「毛而方」— long toc day, mat vuong. Tinh cach: nhien tu, truc (giong Moc).",
    "川澤 (song ho)": "DUOC THUY khi nhieu → 「黑而津」— da den, am uot. Tinh cach: thong minh, uyen chuyen (giong Thuy).",
    "丘陵 (doi nui)": "DUOC HOA khi nhieu → 「專而長」— chuyen, cao dai. Tinh cach: nhiet huyet (giong Hoa).",
    "墳衍 (dat cao)": "DUOC KIM khi nhieu → 「皙而瘠」— trang, om. Tinh cach: cung quyet (giong Kim).",
    "原隰 (dong bang)": "DUOC THO khi nhieu → 「豐肉而痺」— thit day, cham. Tinh cach: on dinh (giong Tho).",
  },
  apply: "Xem nguoi → hoi que quan/dia hinh → them 1 lop 'dia-ngu-hanh' ben canh 'nhat-chu-ngu-hanh'. Vd que ven song + nhat chu Thuy → Thuy KEP → tinh cach 'Thuy' cuc manh.",
};

// 30b. SHIYIYAO_CRITIQUE — 十一曜/五星餘氣 phê bình (tu 星命部) — goc 'tinh menh' (kha giong tu vi)
export const SHIYIYAO_CRITIQUE = {
  source: "古今圖書集成·星命部. Grok-4 Heavy OCR.",
  yuqi: "五星 4 행 co 'du khi' (羅/計/孛/气): 木→氣, 土→計, 水→孛, 火→羅. NHUNG: 「奈何金獨無餘氣乎」— KIM khong co du khi → phan bien (sao Kim la ngoai le?). 'Tuong sinh co du, tuong khac khong co' cung 'phi thong luan'.",
  fenyvsZhanming: "「有分星而無分野；占國者不可盡泥，況占命乎」— co 'phan tinh' (12 quoc/phuong vi ↔ tinh tu) nhung KHONG phai 'phan da';占 quoc da khong chinh xac, huong hon 占 menh. → phe binh 'tinh-tu-luan-menh' (占星命) that nhu tu vi.",
  note: "Day la goc 'TINH MENH' (占星, 11曜) — khac TU BINH (干支). Tu vi ket hop ca 2. Bí truyền: hieu 'tinh menh' bi phe binh tu co de hieu su khac biet voi tu binh.",
};

// 30c. XINGMING_MASTERS — cac thay menh co phap (bí truyền: truyen thuyyet) — tu 星命部 danh nhan
export const XINGMING_MASTERS = [
  { name: "邹元佐 (Tong, Tan Xuong)", method: "「以人之年月日時分配金木水火土而推其生旺休囚，附以官貴祿馬刑殺」— CO PHAP chuan: nam can-chi + ngu hanh vuong tu + quan quy loc ma + hinh sat.", works: "《洪範福極彝倫奧旨》5 quyen + 《貴命四十九格》. Danh xung 'Tan Xuong tam ky'.", note: "Bí truyền: 「凡看命須隨所見即談，無不奇中；若稍涉思慮則相去遂遠」— xem menh phai 'truc gian', nghien lung thi sai." },
  { name: "李虚中 (Tang)", method: "Goc CO PHAP (nam-tru/nhaps am/than sat). 韓愈 mộ chi.", note: "Xem GUFA_MODEL / SHENTOU_LU_NAYIN." },
  { name: "林开 (Tong)", method: "Tinh menh (十一曜). Xuất hien trong '蔡元 độ con truyen' (xingming bo danh nhan).", note: "Phai 'tinh menh' (khac tu binh)." },
];

// ROUND 31: 兰台妙选 (Lan Đài Diệu Tuyển, Minh·西窗老人) — CO PHAP nhaps am luan menh (hu trung phap di ton)
// Nguon: ctext chapter 747132 (full text). Day la he CO PHAP nhaps am van hanh — moi nhaps am/chi → 1 'tuong' → 1 phan doan.
// 31a. LANTAI_PATTERNS — cac 'nhaps am cach cuc' (nhaps am lay tuong) co the DETECT duoc tren la so.
// detect spec (gufa-engine.js interpret): {nayin:'X'} | {ganzhi:'甲子'} | {branch:'午'} | {gan:'甲'} | {branches:['午','辰']} | {and:[...]} | {nayinAny:['X','Y']} | {branchesAll:['x','y']} | {month:'spring'|...}
export const LANTAI_PATTERNS = [
  // ---- CAT (吉格) ----
  { id: "baojian", name: "寶劍沖牛斗", vi: "Bảo kiếm xung ngưu đấu", cat: "cat", detect: { and: [ { nayin: "劍鋒金" }, { branch: "丑" } ] }, judgment: "Nhat tru nhaps am 'Kiem Phong Kim' (Nham-Than/Tan-Dau) + gap chi Suu (nguu đau) → 'khi kiem xung nguu đau', cuc quy. Quy-Suu = kiem hop (chinh).", source: "lan dai" },
  { id: "mahualongju", name: "馬化龍駒奔鳳闕", vi: "Mã hóa long câu", cat: "cat", detect: { branchesAll: ["午", "辰"] }, judgment: "Ngo(ma) + Then(long) (+ Dau=phung) → 'khí ngiep tranh rong', quy. (vd Binh-Ngo/Nham-Then hop Dau).", source: "lan dai" },
  { id: "shehualong", name: "蛇化青龍入天池", vi: "Xà hóa thanh long nhập thiên trì", cat: "cat", detect: { and: [ { branchesAll: ["巳", "辰"] }, { nayin: "天河水" } ] }, judgment: "Ty(xa) + Then(long) + Thien Ha Thuy (Binh-Ngo/Dinh-Vi = thiên tri) → 'cong danh hach dich'. (can đac thoi).", source: "lan dai" },
  { id: "cangzhu", name: "藏珠於淵海", vi: "Tàng châu ư uyên hải", cat: "cat", detect: { and: [ { nayin: "大海水" }, { branch: "子" } ] }, judgment: "Nhaps am Đai Ha Thuy (Quy-Hai/Nham-Tuat) + chi Tu (chau) → 'tang chau giua bien', quy.", source: "lan dai" },
  { id: "lingcha", name: "靈槎入於天河", vi: "Linh tra nhập thiên hà", cat: "cat", detect: { and: [ { nayin: "天河水" }, { nayinAny: ["大林木", "桑柘木", "楊柳木", "松柏木", "石榴木", "平地木"] } ] }, judgment: "Moc vo goc (nhaps am Moc) + Thien Ha Thuy → 'lam ke ho hai', ky nhan ho dan.", source: "lan dai" },
  { id: "tuyuegong", name: "兔入月宮", vi: "Thố nhập nguyệt cung", cat: "cat", detect: { and: [ { branch: "卯" }, { ganzhi: "己未" } ] }, judgment: "At/Mao (tho) + Ky-Vi (nguyet cung) → 'tho nhap nguyet cung', quy. (Tan-Mao = ngoc tho tot nhat).", source: "lan dai" },
  { id: "linfeng", name: "麟逢鳳沼", vi: "Lân phượng phượng chiểu", cat: "cat", detect: { branchesAll: ["辰", "酉"] }, judgment: "Then(long/lan) + Dau(phung) → 'lan phung phung chieu', quy. (Tru 乙酉-庚辰 la 'tu am đai sat' → ngoai le).", source: "lan dai" },
  { id: "shuirao", name: "水繞花堤", vi: "Thủy nhiễu hoa đê", cat: "cat", detect: { and: [ { nayinAny: ["大林木", "桑柘木", "楊柳木", "松柏木", "石榴木", "平地木"] }, { nayinAny: ["天河水", "大海水", "大溪水", "长流水", "井泉水", "涧下水"] } ] }, judgment: "2 Moc (noi) + 2 Thuy (ngoai) → 'thuy nhieu hoa đe', phu quy, nhân-tri tuong tu.", source: "lan dai" },
  { id: "jinma", name: "金馬嘶風", vi: "Kim mã ti phong", cat: "cat", detect: { and: [ { ganzhiAny: ["庚午", "甲午"] }, { branch: "巳" } ] }, judgment: "Canh-Ngo/Giap-Ngo (kim ma) + Ty (ton phong) → 'choi sieu quan'. Tan-Ty tot nhat.", source: "lan dai" },
  { id: "yunlong", name: "雲龍風虎", vi: "Vân long phong hổ", cat: "cat", detect: { branchesAll: ["寅", "卯", "辰", "巳"] }, judgment: "Dan(ho)+Mao(loi)+Then(long)+Ty(phong) đeu co (thuan) → 'com đac đac khoa'. Dao luan → luc nhe.", source: "lan dai" },
  { id: "sangliu", name: "桑柳成林", vi: "Tang dương thành lâm", cat: "cat", detect: { and: [ { nayin: "桑柘木" }, { nayin: "楊柳木" } ] }, judgment: "Tang Dot Moc (Nham-Tu/Quy-Suu) + Duong Lieu Moc (Nham-Ngo/Quy-Vi) → 'hoai nhan trong chi tai'.", source: "lan dai" },
  { id: "cangsong", name: "蒼松冬秀", vi: "Thương tùng đông tú", cat: "cat", detect: { and: [ { nayin: "松柏木" }, { month: "winter" } ] }, judgment: "Tung Bach Moc (Canh-Dan/Tan-Mao) + sinh đong (Hai/Tu/Suu) → 'tiet cao cung cuc', ky nhan.", source: "lan dai" },
  { id: "huoming", name: "火明木秀", vi: "Hỏa minh mộc tú", cat: "cat", detect: { and: [ { nayinAny: ["炉中火", "爐中火", "天上火", "霹靂火", "覆燈火", "山下火", "山頭火", "桑柘木", "大林木", "松柏木", "楊柳木", "石榴木", "平地木"] }, { month: "spring" }, { hasHuo: true }, { hasMoc: true } ] }, judgment: "Hoa + Moc + xuan (Dan/Mao/Then) → 'hoa minh moc tu', van hoa, quy.", source: "lan dai" },
  { id: "jinbai", name: "金白水清", vi: "Kim bạch thủy thanh", cat: "cat", detect: { and: [ { month: "autumn" }, { hasKim: true }, { hasThuy: true } ] }, judgment: "Kim + Thuy + thu (Than/Dau/Tuat) → 'kim bach thuy thanh', cuc quy, van tu.", source: "lan dai" },
  { id: "shuihuojiji", name: "水火既濟", vi: "Thủy hỏa ký tế", cat: "cat", detect: { and: [ { hasHuo: true }, { hasThuy: true } ] }, judgment: "Hoa (nam/nien tru) + Thuy (bac/nhat-thoi tru) → 'thuy hoa ky te', cong danh. (nam/thang = tren, ngay/gio = duoi).", source: "lan dai" },
  { id: "longyuetian", name: "龍躍天門", vi: "Long dược thiên môn", cat: "cat", detect: { and: [ { nayin: "长流水" }, { branch: "亥" } ] }, judgment: "Truong Luu Thuy (Nham-Then/Quy-Ty) + chi Hai (thien mon) → 'long dut thien mon', quy.", source: "lan dai" },
  { id: "yuezhao", name: "月照寒潭", vi: "Nguyệt chiếu hàn đàm", cat: "cat", detect: { and: [ { ganzhi: "己未" }, { hasThuy: true }, { nayinAny: ["剑锋金", "劍鋒金", "白蜡金", "白蠟金", "砂中金", "金泊金", "钗钏金", "釵釧金"] } ] }, judgment: "Ky-Vi (nguyet) + Thuy (han đam) + Kim (than) → 'nguyet chieu han đam', cuc quy (thuy luc thu).", source: "lan dai" },
  { id: "ziguimu", name: "子歸母腹", vi: "Tử quy mẫu phúc", cat: "cat", detect: { motherGenerates: true }, judgment: "Nhaps am cua 1 tru SINH nhaps am nhat tru (me) → 'tu quy mau phuc', quy phu the/con cai. (vd nhat KIM + tru THO = mau phuc).", source: "lan dai" },
  // ---- HUNG (凶格) ----
  { id: "baihuxianshi", name: "白虎銜屍", vi: "Bạch hổ hàm thi", cat: "hung", detect: { and: [ { ganAny: ["甲", "乙"] }, { ganAny: ["庚", "辛"] }, { branchesAll: ["寅", "卯", "辰"] } ] }, judgment: "Giap/At (Moc than) + Canh/Tan (Kim = bach ho) + Dan-Mao-Then → 'bach ho ham thi', cuc hung nguy.", source: "lan dai" },
  { id: "fengdongdeng", name: "風動燈滅", vi: "Phong động đăng diệt", cat: "hung", detect: { and: [ { nayin: "覆燈火" }, { nayinAny: ["大林木", "桑柘木", "松柏木", "楊柳木", "石榴木", "平地木"] } ] }, judgment: "Phuc Đang Hoa (Giap-Then/At-Ty) + Moc nhieu (moc chieu phong) → 'phong dang dang yet', moc nat, tien binh.", source: "lan dai" },
  { id: "taiyangsunming", name: "太陽損明", vi: "Thái dương tổn minh", cat: "hung", detect: { and: [ { ganzhi: "戊午" }, { nayinWaterCount: 2 } ] }, judgment: "Mau-Ngo (thai duong hoa) + 2+ Thuy → 'thai duong ton minh', quang bi giam, hung.", source: "lan dai" },
  { id: "gui toumu", name: "鬼投母腹", vi: "Quỷ đầu mẫu phúc", cat: "hung", detect: { nayinWaterCount: 4 }, judgment: "4 tru đeu Thuy + thai vo Tho → 'quy đau mau phuc', thoi nho mo coi som.", source: "lan dai" },
  { id: "sanqi", name: "三奇拱貴", vi: "Tam kỳ củng quý", cat: "cat", detect: { ganSetAny: [["乙","丙","丁"],["甲","戊","庚"],["壬","癸","辛"]] }, judgment: "Thien can đeu 1 bo tam ky (乙丙丁 thien / 甲戊庚 đia / 壬癸辛 nhan) → 'tam ky cung quy', cuc quy, đon đac.", source: "lan dai" },
  { id: "shiliu", name: "石榴噴火", vi: "Thạch lựu phun hỏa", cat: "cat", detect: { and: [ { nayin: "石榴木" }, { month: "summer" }, { hasHuo: true } ] }, judgment: "Thach Luu Moc (Canh-Than/Tan-Dau) + ha + Hoa → 'thach luu phun hoa', quy (dang ky van hoa).", source: "lan dai" },
  { id: "hangu", name: "寒谷回春", vi: "Hàn cốc hồi xuân", cat: "cat", detect: { and: [ { hasMoc: true }, { month: "winter" }, { branchesAll: ["寅", "卯", "辰"] } ] }, judgment: "Moc + sinh đong (bang cuc) + gap Dan/Mao/Then (xuan) → 'han coc hoi xuan', phat đe nhat.", source: "lan dai" },
  { id: "zhenwu", name: "真武當權", vi: "Chân vũ đương quyền", cat: "cat", detect: { and: [ { ganAny: ["壬", "癸"] }, { branchesAll: ["子", "巳", "丑"] } ] }, judgment: "Nham/Quy (bach thu/huyen vu) + Tu+Ty+Suu (qui/xa/ruc) → 'chan vu đuong quyen', quy (dang lanh đao/quan).", source: "lan dai" },
  { id: "canglong", name: "蒼龍駕海", vi: "Thương long giá hải", cat: "cat", detect: { and: [ { ganzhiAny: ["甲辰", "戊辰"] }, { nayin: "大海水" } ] }, judgment: "Giap-Then/Mau-Then (thuong long) + Đai Ha Thuy → 'thuong long gia hai', kim an huyen yen.", source: "lan dai" },
  { id: "zhuque", name: "朱雀騰空", vi: "Chu tước đằng không", cat: "cat", detect: { and: [ { ganAny: ["丙", "丁"] }, { branchesAll: ["巳", "午"] } ] }, judgment: "Binh/Dinh (chuc tue) + Ty+Ngo → 'chuc tue tang khong', quy (uy quyen).", source: "lan dai" },
  { id: "sanyuanwang", name: "三元集旺", vi: "Tam nguyên tập vượng", cat: "cat", detect: { ganzhiAny: ["辛巳", "癸酉", "己亥", "辛卯", "甲申", "丙子", "丙寅", "戊午", "戊申", "庚子"] }, judgment: "Tru nao co nhaps am TU VUONG (Tan-Ty/Quy-Dau/Ky-Hoi/Tan-Mao/Giap-Than/Binh-Tu/Binh-Dan/Mau-Ngo/Mau-Than/Canh-Tu) → 'tam nguyen tap vuong', sieu trac anh tai.", source: "lan dai" },
  { id: "baihufen", name: "白虎焚身", vi: "Bạch hổ phần thân", cat: "hung", detect: { and: [ { ganAny: ["庚", "辛"] }, { nayinFireCount: 3 } ] }, judgment: "Canh/Tan (bach ho = kim) + 3+ tru nhaps am Hoa → 'bach ho phan than', de trung luat/nguc.", source: "lan dai" },
  { id: "taiyinbo", name: "太陰薄食", vi: "Thái âm bạc thực", cat: "hung", detect: { and: [ { ganzhi: "己未" }, { nayinEarthCount: 3 } ] }, judgment: "Ky-Vi (thai am = thuy) + 3+ tru nhaps am Tho (tho khac thuy) → 'thai am bach thuc', huy.", source: "lan dai" },
  { id: "yiqi", name: "一氣為根", vi: "Nhất khí vi căn", cat: "cat", detect: { allSameWx: true }, judgment: "4 tru nhaps am CUNG 1 hanh → 'nhat khi vi can', cuc quy (vd 4 Kim/4 Thuy...), can 'trung hoa'.", source: "lan dai" },
  { id: "yuegui", name: "月桂芬芳", vi: "Nguyệt quế ph phân phương", cat: "cat", detect: { and: [ { ganzhi: "己未" }, { nayinMocCount: 3 } ] }, judgment: "Ky-Vi (nguyet) + 3+ Moc (que) → 'nguyet que phan phuong', 科 danh.", source: "lan dai" },
  { id: "bangzhu", name: "蚌珠照月", vi: "Phạng châu chiếu nguyệt", cat: "cat", detect: { and: [ { nayin: "海中金" }, { ganzhi: "己未" } ] }, judgment: "Hai Trung Kim (Giap-Tu/At-Suu = bang chau) + Ky-Vi (nguyet hoa) → 'bang chau chieu nguyet', cuc quy (vi cong khanh).", source: "lan dai" },
  { id: "yutu", name: "玉兔東生", vi: "Ngọc thỏ đông sinh", cat: "cat", detect: { and: [ { ganzhiAny: ["辛卯", "癸卯"] }, { month: "spring" } ] }, judgment: "Tan-Mao/Quy-Mao (ngoc tho) + xuan (đong phuong) → 'ngoc tho đong sinh', hoc van sau, quy.", source: "lan dai" },
  { id: "kuixing", name: "魁星指南", vi: "Quỷ tinh chỉ nam", cat: "cat", detect: { and: [ { ganzhiAny: ["甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑"] }, { branchAny: ["巳", "午", "未"] } ] }, judgment: "Tru nao la quy tinh (Giap-Then...Quy-Suu) + co chi nam (Ty/Ngo/Vi = phuong nam) → 'quy tinh chi nam', bat kiet su lau khong nhuc quoc.", source: "lan dai" },
  { id: "fengyu", name: "風雨作霖", vi: "Phong vũ tác lâm", cat: "cat", detect: { and: [ { nayin: "天河水" }, { branch: "巳" } ] }, judgment: "Thien Ha Thuy (vu) + Ty (ton phong) → 'phong vu tac lam', trung than bi đan, tot (秋 đac).", source: "lan dai" },
  { id: "xuehai", name: "學海波深", vi: "Học hải ba thâm", cat: "cat", detect: { and: [ { hasThuy: true }, { branchesAll: ["申", "子", "辰"] } ] }, judgment: "Nhaps am Thuy + hop Than-Tu-Then (thuy cu) → 'hoc hai ba tham', tai hoa sieu trac.", source: "lan dai" },
  { id: "shuiju", name: "水居湖海", vi: "Thủy cư hồ hải", cat: "cat", detect: { and: [ { branch: "子" }, { nayin: "大海水" } ] }, judgment: "Chi Tu (ho) + Đai Ha Thuy (hai) → 'thuy cu ho hai', chi luong uong duong.", source: "lan dai" },
  { id: "huozhen", name: "火震雷霆", vi: "Hỏa chấn lôi đình", cat: "cat", detect: { and: [ { hasHuo: true }, { branch: "卯" } ] }, judgment: "Nhaps am Hoa + chi Mao (loi đinh) → 'hoa chan loi đinh', uy quyen.", source: "lan dai" },
  { id: "heisha", name: "黑煞朝北斗", vi: "Hắc sát triêu bắc đẩu", cat: "cat", detect: { and: [ { ganAny: ["壬", "癸"] }, { branch: "丑" } ] }, judgment: "Nham/Quy (bach huyen vu = hac sat) + chi Suu (bach đau) → 'hac sat trieu bach đau', tri khi cái can khun.", source: "lan dai" },
];




