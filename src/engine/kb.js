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
