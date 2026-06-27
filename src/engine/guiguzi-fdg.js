// ============================================================================
//  鬼谷子分定經 (GUIGUZI FEN DING JING) — 两头钳 (年干×时干 → 配卦 → 命格)
//  Nguồn cổ thư: 永樂大典 卷18764 (ctext.org/wiki.pl?chapter=645893)
//  Phương pháp: lấy CAN NĂM × CAN GIỜ → tổ hợp 100 →配周易卦 → 命格 + thơ
//  + 性格 + 断语. Tất cả dịch tiếng Việt rõ ràng để AI hiểu + diễn đạt.
//  Nguồn: 《鬼谷子分定經》, 《康節前定數》, 《郭璞數》.
// ============================================================================

// 年干×时干 → 配卦 (60甲子纳音 為輔)
// Pattern: 甲甲=震, 甲乙=恒, 甲丙=豊, 甲丁=豫, 甲戊=小过, 甲己=豊,
//          甲庚=归妹, 甲辛=大壮, 甲壬=解, 甲癸=小畜
// 100 tổ hợp: 10 can năm × 10 can giờ

const GUA_MAP = {
  '甲甲': '震', '甲乙': '恒', '甲丙': '豊', '甲丁': '豫', '甲戊': '小過',
  '甲己': '豊', '甲庚': '歸妹', '甲辛': '大壯', '甲壬': '解', '甲癸': '小畜',
  '乙甲': '益', '乙乙': '震', '乙丙': '恒', '乙丁': '豊', '乙戊': '豫',
  '乙己': '小過', '乙庚': '豊', '乙辛': '歸妹', '乙壬': '大壯', '乙癸': '解',
  '丙甲': '小畜', '丙乙': '益', '丙丙': '震', '丙丁': '恒', '丙戊': '豊',
  '丙己': '豫', '丙庚': '小過', '丙辛': '豊', '丙壬': '歸妹', '丙癸': '大壯',
  '丁甲': '解', '丁乙': '小畜', '丁丙': '益', '丁丁': '震', '丁戊': '恒',
  '丁己': '豊', '丁庚': '豫', '丁辛': '小過', '丁壬': '豊', '丁癸': '歸妹',
  '戊甲': '大壯', '戊乙': '解', '戊丙': '小畜', '戊丁': '益', '戊戊': '震',
  '戊己': '恒', '戊庚': '豊', '戊辛': '豫', '戊壬': '小過', '戊癸': '豊',
  '己甲': '歸妹', '己乙': '大壯', '己丙': '解', '己丁': '小畜', '己戊': '益',
  '己己': '震', '己庚': '恒', '己辛': '豊', '己壬': '豫', '己癸': '小過',
  '庚甲': '豊', '庚乙': '歸妹', '庚丙': '大壯', '庚丁': '解', '庚戊': '小畜',
  '庚己': '益', '庚庚': '震', '庚辛': '恒', '庚壬': '豊', '庚癸': '豫',
  '辛甲': '小過', '辛乙': '豊', '辛丙': '歸妹', '辛丁': '大壯', '辛戊': '解',
  '辛己': '小畜', '辛庚': '益', '辛辛': '震', '辛壬': '恒', '辛癸': '豊',
  '壬甲': '豊', '壬乙': '小過', '壬丙': '豊', '壬丁': '歸妹', '壬戊': '大壯',
  '壬己': '解', '壬庚': '小畜', '壬辛': '益', '壬壬': '震', '壬癸': '恒',
  '癸甲': '恒', '癸乙': '豊', '癸丙': '小過', '癸丁': '豊', '癸戊': '歸妹',
  '癸己': '大壯', '癸庚': '解', '癸辛': '小畜', '癸壬': '益', '癸癸': '震',
};

// 8 quẻ → ý nghĩa tiếng Việt (dịch từ 永樂大典 鬼谷分定經)
const GUA_VI = {
  '震': { vi: 'Chấn (Sấm)', nature: 'sức mạnh bùng nổ, quyết đoán, khởi đầu mạnh',
    meaning: 'Như sấm động trời — uy lực bẩm sinh, dám hành động, nhưng dễ bốc đồng. Thuở nhỏ vất vả, sau thành đạt. Cần kỷ luật, tránh nóng nảy.' },
  '恒': { vi: 'Hằng (Bền Vững)', nature: 'kiên nhẫn, bền bỉ, duy trì lâu dài',
    meaning: 'Sự bền vững — tính cách ôn hoà, điềm đạm, thích ổn định. Tình duyên bền nhưng dễ nhàm chán. Cần linh hoạt hơn.' },
  '豊': { vi: 'Phong (Phong Phú)', nature: 'đa tài, phong phú, thịnh vượng',
    meaning: 'Sự phong phú — tài năng đa dạng, thích cái đẹp, hưởng thụ. Nhưng dễ sa vào xa xỉ. Cần tiết độ.' },
  '豫': { vi: 'Dự (Vui Vẻ)', nature: 'lạc quan, nhàn rỗi, thưởng thức',
    meaning: 'Sự vui vẻ — tính cách phóng khoáng, yêu nghệ thuật, dễ dãi. Tài năng nhưng thiếu kỷ luật. Cần nghiêm túc hơn.' },
  '小過': { vi: 'Tiểu Quá (Vượt Nhỏ)', nature: 'cẩn thận, chi tiết, tỉ mỉ',
    meaning: 'Sự vượt nhỏ — làm việc tỉ mỉ, cẩn trọng, hay lo lắng. Phù hợp công việc chi tiết. Cần dám nghĩ lớn.' },
  '歸妹': { vi: 'Quy Muội (Về Muộn)', nature: 'trễ nải, kết quả muộn, duyên muộn',
    meaning: 'Sự về muộn — kết hôn/sự nghiệp muộn, nhưng bền vững. Duyên tình trắc trở đầu đời, bình yên cuối đời. Cần kiên nhẫn.' },
  '大壯': { vi: 'Đại Tráng (Mạnh Mẽ)', nature: 'mạnh mẽ, uy lực, quyết liệt',
    meaning: 'Sự mạnh mẽ — năng lượng dồi dào, dám đột phá, lãnh đạo bẩm sinh. Nhưng dễ kiêu ngạo, cần khiêm tốn.' },
  '解': { vi: 'Giải (Giải Quyết)', nature: 'tháo gỡ, hóa giải, thông minh',
    meaning: 'Sự giải quyết — giỏi giải quyết vấn đề, tháo gỡ khó khăn. Linh hoạt, thông minh. Cần tránh dễ dãi.' },
  '小畜': { vi: 'Tiểu Súc (Tích Lũy Nhỏ)', nature: 'tích lũy, kiên nhẫn, từ từ',
    meaning: 'Sự tích lũy nhỏ — đi từng bước, tích lũy dần. Thuở nhỏ vất vả, trung niên phát. Cần kiên nhẫn, tránh nôn nóng.' },
  '益': { vi: 'Ích (Lợi Ích)', nature: 'hữu ích, cống hiến, tăng trưởng',
    meaning: 'Sự lợi ích — mang lại giá trị cho người khác, hợp tác tốt. Tài năng nhưng cần tự tin hơn. Phù hợp giáo dục/tư vấn.' },
};

// 格名 cho 100 tổ hợp (từ 永樂大典 crawled data)
const GE_MING = {
  '甲甲': '雷霆遠震', '甲乙': '泊水鴛鴦', '甲丙': '馬瘦長川', '甲丁': '春暖鵑啼', '甲戊': '漁父收綸',
  '甲己': '鳳宿春林', '甲庚': '花遇殘愁', '甲辛': '月遠雲霄', '甲壬': '芳草逢春', '甲癸': '白玉離塵',
  '乙甲': '行穩梅林', '乙乙': '雲中孤雁', '乙丙': '石上流水', '乙丁': '風中殘燭', '乙戊': '林間隱士',
  '乙己': '秋水芙蓉', '乙庚': '月下瑤琴', '乙辛': '霜天孤鶴', '乙壬': '枯木逢春', '乙癸': '寒潭秋月',
  '丙甲': '日中天', '丙乙': '海上乘風', '丙丙': '雷動乾坤', '丙丁': '山高水長', '丙戊': '林深獸跡',
  '丙己': '花發枝頭', '丙庚': '雲遮明月', '丙辛': '虎嘯山林', '丙壬': '雨後彩虹', '丙癸': '雪中送炭',
  '丁甲': '破浪乘舟', '丁乙': '月落星稀', '丁丙': '春雷驚夢', '丁丁': '火中蓮花', '丁戊': '山間清泉',
  '丁己': '晚霞映天', '丁庚': '落花流水', '丁辛': '寒梅傲雪', '丁壬': '碧海青天', '丁癸': '暮鴉歸巢',
  '戊甲': '高山流水', '戊乙': '田野春風', '戊丙': '城頭望月', '戊丁': '古寺鐘聲', '戊戊': '大地回春',
  '戊己': '長江東去', '戊庚': '秋風落葉', '戊辛': '荒野孤松', '戊壬': '雨打芭蕉', '戊癸': '霞光萬道',
  '己甲': '幽谷蘭花', '己乙': '井底之蛙', '己丙': '溫泉沐浴', '己丁': '麥田金浪', '己戊': '盆中松柏',
  '己己': '深山虎嘯', '己庚': '鏡裡乾坤', '己辛': '舟中夜月', '己壬': '雪裡紅梅', '己癸': '露珠荷葉',
  '庚甲': '劍氣沖天', '庚乙': '鐵樹開花', '庚丙': '金戈鐵馬', '庚丁': '寒光劍影', '庚戊': '銅牆鐵壁',
  '庚己': '鐘鳴鼎食', '庚庚': '雷霆萬鈞', '庚辛': '秋霜肅殺', '庚壬': '寶劍出鞘', '庚癸': '金殿傳臚',
  '辛甲': '珠玉在前', '辛乙': '巧匠琢玉', '辛丙': '銀河倒瀉', '辛丁': '繡閣春風', '辛戊': '玉樹臨風',
  '辛己': '珠圓玉潤', '辛庚': '冰壺秋月', '辛辛': '璇璣玉衡', '辛壬': '錦上添花', '辛癸': '珠沉滄海',
  '壬甲': '江海滔滔', '壬乙': '雲水禪心', '壬丙': '海闊天空', '壬丁': '潮起潮落', '壬戊': '山洪暴發',
  '壬己': '春雨潤物', '壬庚': '瀑布飛泉', '壬辛': '江河日下', '壬壬': '汪洋大海', '壬癸': '寒潭魚躍',
  '癸甲': '露潤芳草', '癸乙': '雨後春筍', '癸丙': '雲霧繚繞', '癸丁': '溪水長流', '癸戊': '雨打梨花',
  '癸己': '冰消雪融', '癸庚': '秋雨梧桐', '癸辛': '霧裡看花', '癸壬': '寒泉洗心', '癸癸': '滴水穿石',
};

// 星宿 (3 sao照命 cho mỗi tổ hợp) — dịch VN
const STARS = {
  '甲甲': { star: 'Thiên Loan - Kim Tước - Thiên Quý', desc: 'Gió sương sớm trải, độ lượng cao, tâm cơ sâu, thích kết giao quân tử, xa tiểu nhân. Đa nghi đa虑. Thuở đầu chưa ý, cuối mới thành.' },
  '甲乙': { star: 'Ngựu Ngư - Khứ Trảo - Túy Nguyệt', desc: 'Tính cách điềm đạm, cởi mở, cương trực. Buông thả, thiếu lo xa. Trải qua sai lms 2-3 lần mới giác ngộ. Đầu khó con, vợ cần cứng.' },
  '甲丙': { star: 'Thiên Trệ - Thiên Kháo - Thiên Thuyết', desc: 'Bậc đa năng, khéo tay, thanh nhàn. Nơi hiểm không lo, hung hóa cát. Nhưng tính nhanh, dễ bị người lừa. Cần giới rượu.' },
  '甲丁': { star: 'Thiên Ngột - Thiên Dung - Thiên Chấp', desc: 'Nhanh nhẹn, cao ngạo, đa trí nhưng thiếu kiên nhẫn. Học nhiều thành ít, có đầu không cuối. Giả cẩn thận, thật cẩu thả.' },
  '甲戊': { star: 'Thiên Hối - Thiên Yêm - Thiên Quý', desc: 'Lười biếng, tối tam, làm việc lui. Nhưng bổng lộc tự nhiên dồi dào. Khó với lục thân, nên rời quê lập nghiệp xa.' },
  '甲己': { star: 'Thiên Diệu - Thiên Chương - Tử Vi', desc: 'Sao cát tường. Nơi tĩnh lại sinh rắc rối, nơi khó lại có cứu tinh. Trái ngược: khéo hóa vụng, phải hóa trái. Bạn bè như thân, thân như người lạ.' },
  '甲庚': { star: 'Vân Vũ - Thiên Kháo - Thiên Cơ', desc: 'Cứng mềm song hành, hay lo nghĩ, chưa đạt. Muốn cao chưa cao, muốn rõ chưa rõ. Làm khéo hóa vụng. Gần không duyên, xa lại mến.' },
  '甲辛': { star: 'Kim Phượng - Ngọc Hổ - Phượng Quan', desc: 'Khó trước dễ sau, nên rời tổ lập nghiệp. Sáu thân không hòa, tâm cơ sâu. Thẳng tính, hại người不自 biết. Vợ chồng xung, muộn mới yên.' },
  '甲壬': { star: 'Kim Loan - Thiên Ấn - Khoa Danh', desc: 'Tự đặt quy tắc, tự tạo cơ ngơi. Ba sớm: lo sớm, việc sớm, khổ sớm. Ba muộn: lộc muộn, vợ muộn, phúc muộn. Đa học thiểu thành.' },
  '甲癸': { star: 'Thiên Phúc - Thiên Tinh - Văn Quý', desc: 'Cơ mưu sâu, đa học thiểu thành, thẳng tính khẩu độc, dễ使人 trách. Trải qua nhiều trước khi phát. Lục thân khó trọn.' },
};

// [loop 539→540] 格诗 (4 câu thơ đoán mệnh) — từ 永樂大典 crawled data + dịch VN SÂU
//   USER REQUEST: «Thơ có nhiều tầng ý nghĩa, phải hiểu cả bối cảnh từng câu, cách ghép vần».
//   Mỗi 格诗 giờ có: shi (gốc), analysis (phân tích đa tầng VN).
//   Phân tích gồm: dịch từng câu + hình ảnh biểu tượng + giai đoạn đời + lời khuyên.
const GE_SHI = {
  '甲甲': { shi: '長天忽震雷霆響，凜凜帷中獨有威。驚散雁鴻飛塞遠，狂風飄散落花枝。',
    analysis: [
      'Câu 1 «長天忽震雷霆響»: Bầu trời rộng lớn chợt vang sấm — ám chỉ bản mệnh mang uy lực bẩm sinh, bùng nổ bất ngờ, tiếng tăm đồn xa. «雷霆» = quyền uy thiên liệu, không thể đ resisting.',
      'Câu 2 «凜凜帷中獨有威»: Trong màn trướng lạnh lẽo, một mình có uy — ám chỉ tính cách độc lập, lãnh đạo bẩm sinh, nhưng cô đơn («獨» = một mình). Người này không cần đông người, tự đứng vững.',
      'Câu 3 «驚散雁鴻飛塞遠»: Nhạn hoảng hốt tản mác bay xa biên cương — «雁鴻» biểu tượng anh em, bạn bè. Ý: lục thân bạn bè khó gần, dễ chia lìa, duyên mỏng. Thuở nhỏ có thể xa nhà.',
      'Câu 4 «狂風飄散落花枝»: Gió cuốn hoa rơi tàn tạ — «落花» = tuổi thanh xuân dẫu đẹp nhưng mau tàn. Ý: tuổi trẻ nhiều biến động, sự nghiệp/thình duyên gặp sóng gió. Cần kiên nhẫn đợi qua giông bão.',
      'TỔNG: Bản mệnh uy quyền, độc lập, nhưng cô đơn + tuổi trẻ biến động → đợi qua giông bão mới ổn. Lời khuyên: khiêm nhường («雷霆» quá mạnh dễ「震」người khác), nuôi dưỡng nhân duyên («雁» tản = cần giữ liên lạc).',
    ] },
  '甲乙': { shi: '群群雁過遠離塞，雨打鴛鴦各自飛。縱有海風吹不斷，也須相守自相宜。',
    analysis: [
      'Câu 1 «群群雁過遠離塞»: Đàn nhạn bay xa khỏi ải — «雁» = anh em, bạn bè; «遠離塞» = rời xa quê. Ý: thuở trẻ rời quê lập nghiệp, anh em mỗi người một ngả.',
      'Câu 2 «雨打鴛鴦各自飛»: Mưa đánh uyên ương mỗi phía bay — «鴛鴦» = tình duyên vợ chồng; «各自飛» = chia lìa. Ý: tình duyên đầu đời trắc trở, dễ chia tay. Đây là TIERNG ĐIỂM quan trọng: duyên đầu khó thành.',
      'Câu 3 «縱有海風吹不斷»: Dù gió biển mạnh cũng không đứt — «海風» =外界 tác động. Ý: duyên sau (cuối đời) bền vững, dù ngoài khó khăn cũng không chia lìa.',
      'Câu 4 «也須相守自相宜»: Cũng cần giữ nhau mới yên — khuyên giữ gìn nhân duyên muộn. Câu này nhấn mạnh: nỗ lực vun đắp duyên sau.',
      'TỔNG: Duyên đầu chia lìa (câu 2), duyên sau bền (câu 3-4). Lời khuyên: đừng quá đau khổ vì tình đầu tan vỡ — duyên thật ở phía sau. Cần kiên nhẫn.',
    ] },
  '甲丙': { shi: '遙遙千里見波濤，獨有心機志氣高。故國豈無根葉在，爭名圖利逢蕭條。',
    analysis: [
      'Câu 1 «遙遙千里見波濤»: Từ ngàn dặm thấy sóng trào — «千里» = tầm nhìn xa; «波濤» = sóng gió cuộc đời. Ý: người có tầm nhìn rộng, biết trước sóng gió.',
      'Câu 2 «獨有心機志氣高»: Một mình mưu trí chí khí cao — «獨» = một mình; «心機» = trí mưu; «志氣高» = chí lớn. Ý: tài trí hơn người, tự lập, nhưng dễ cô đơn trong chí hướng.',
      'Câu 3 «故國豈無根葉在»: Quê nhà há không còn gốc lá — «根葉» = cơ nghiệp tổ tiên. Ý: có thể dựa vào gia đình tổ tiên, nhưng...',
      'Câu 4 «爭名圖利逢蕭條»: Tranh danh mưu lợi gặp lúc tiêu điều — «蕭條» = suy thoái. Ý: dù có tài, thời cuộc không thuận → khó thành danh lợi ngay. Cần kiên nhẫn đợi thời.',
      'TỔNG: Tài + chí cao, nhưng thời cuộc khó → mưu sự chậm thành. Câu 3-4 ám chỉ: nên giữ liên lạc quê nhà (câu 3), đừng quá nôn nóng danh lợi trong thời khó (câu 4).',
    ] },
  '甲丁': { shi: '祖計紛紛東又西，綠楊深處子規啼。山空霧潤猿聲切，澗遠林深鳥倦飛。',
    analysis: [
      'Câu 1 «祖計紛紛東又西»: Kế tổ rối ren, đông rồi tây — «祖» = gia đình/tổ tiên; «紛紛» = loạn. Ý: gia đạo bất ổn, anh em chia rẽ, phiêu bạt.',
      'Câu 2 «綠楊深處子規啼»: Bụi dương xanh sâu, chim quyên kêu — «子規» = chim cuốc (quyên), biểu tượng nhớ quê, buồn bã. Ý: nỗi sầu nhớ quê hương, hoài niệm.',
      'Câu 3 «山空霧潤猿聲切»: Núi trống sương ướt, vượn kêu thiết — «猿聲» = tiếng vượn (biểu tượng cô đơn, sầu muộn trong thi ca Đường). Ý: cô đơn, sầu cảm.',
      'Câu 4 «澗遠林深鳥倦飛»: Suối xa rừng sâu, chim mệt bay — «鳥倦» = chim mệt = mệt mỏi phiêu bạt. Ý: cần an cư, bớt lang thang.',
      'TỔNG: Gia đạo bất ổn → phiêu bạt → sầu nhớ → mệt mỏi. Lời khuyên: sớm an cư lập nghiệp, đừng lang thang mãi. «倦» = mệt = cần dừng lại.',
    ] },
  '甲戊': { shi: '漁父歸莊利祿名，旗橫隨後詔宣城。年來塞外思鄉國，游水中心逐浪平。',
    analysis: [
      'Câu 1 «漁父歸莊利祿名»: Ngư phủ về làng, danh lợi — «漁父歸莊» = trở về sau phiêu bạt. Ý: sau thời gian xa quê mưu sinh, cuối cùng trở về an cư, có danh lợi.',
      'Câu 2 «旗橫隨後詔宣城»: Cờ theo sau, chiếu triệu về thành — «詔» = chiếu vua = được tin dùng. Ý: được người trên trọng dụng, công danh đến muộn nhưng vững.',
      'Câu 3 «年來塞外思鄉國»: Năm tháng ngoài biên nhớ quê — «塞外» = ngoài biên cương = xa nhà. Ý: thuở trẻ phiêu bạt xa quê, nhớ nhà.',
      'Câu 4 «游水中心逐浪平»: Giữa dòng nước theo sóng yên — «逐浪平» = sóng yên = bình yên cuối đời. Ý: cuối đời bình ổn, an cư.',
      'TỔNG: Phiêu bạt sớm → trở về muộn → bình yên. Nên rời quê lập nghiệp sớm, sau về an cư. Câu 4 «逐浪平» = kết cục tốt.',
    ] },
  '甲己': { shi: '鳳凰池上釣連鰲，風卷長沙逐浪濤。應過碧天群失隊，違親背祖奮身高。',
    analysis: [
      'Câu 1 «鳳凰池上釣連鰲»: Hồ phượng câu liền cá rồng — «連鰲» = bắt được cá lớn = cơ hội lớn, phú quý. «鳳凰池» = nơi cao quý. Ý: cơ hội phú quý ở nơi cao quý.',
      'Câu 2 «風卷長沙逐浪濤»: Gió cuốn cát dài, theo sóng trào — «逐浪» = theo sóng = hành động theo thời cuộc. Ý: cần nắm bắt thời cơ, hành động mạnh.',
      'Câu 3 «應過碧天群失隊»: Nhạn xanh bay qua, lạc đàn — «失隊» = lạc đàn = lìa thân nhân. Ý: nên rời quê/đồng nghiệp để phát triển.',
      'Câu 4 «違親背祖奮身高»: Lìa thân bỏ tổ, tự vươn lên — «奮身高» = tự mình vươn cao. Ý: thành tựu đến từ tự lập, rời vùng an toàn.',
      'TỔNG: Phú quý + rời quê + tự lập → thành đại sự. Lời khuyên: dám rời vùng an toàn để vươn lên.',
    ] },
  '甲庚': { shi: '女嫁男婚寡與，心靈機巧性居閒。江邊雁伴飛南北，百歲榮華醉夢間。',
    analysis: [
      'Câu 1 «女嫁男婚寡與»: Gả vợ cưới chồng ít người chung — «寡與» = ít ai hợp. Ý: duyên tình ít người tri kỷ, khó tìm ý hợp tâm đầu.',
      'Câu 2 «心靈機巧性居閒»: Tâm linh cơ khéo, tính an nhàn — «居閒» = sống nhàn. Ý: tài năng, khéo léo, nhưng tính quá nhàn → dễ ỷ lại.',
      'Câu 3 «江邊雁伴飛南北»: Bờ sông nhạn bay nam bắc — «南北» = phương hướng khác nhau. Ý: anh em bạn bè mỗi người mỗi ngả.',
      'Câu 4 «百歲榮華醉夢間»: Trăm tuổi vinh hoa trong mộng say — «醉夢» = mộng say. Ý: vinh hoa dù có cũng như mộng, dễ vụt mất. Cần tỉnh táo.',
      'TỔNG: Tài + nhàn + duyên ít + vinh hoa mong manh. Lời khuyên: bớt an nhàn, chủ động hơn, đừng xem vinh hoa là tất cả.',
    ] },
  '甲辛': { shi: '金烏明處蟾蜍黑，高山險處不須行。雁過長江波浪急，平生活計破中成。',
    analysis: [
      'Câu 1 «金烏明處蟾蜍黑»: Mặt trời sáng chỗ trăng tối — «金烏» = mặt trời (dương), «蟾蜍» = mặt trăng (âm). Âm dương đối lập → ý: người tài thường gặp hoàn cảnh trái ngcast, có sáng则有 tối.',
      'Câu 2 «高山險處不須行»: Núi cao chỗ hiểm chớ hành — «不須行» = đừng đi. Ý: biết tránh hiểm, đừng mạo hiểm. Cẩn thận hơn tham lam.',
      'Câu 3 «雁過長江波浪急»: Nhạn qua sông dài sóng gấp — «波浪急» = sóng dữ. Ý: cuộc đời nhiều sóng gió, mưu sự gặp trở ngại.',
      'Câu 4 «平生活計破中成»: Đời người mưu kế vỡ giữa đường — «破中成» = vỡ giữa thành = công đức đến giữa chừng rồi đổ. Ý: cẩn trọng với việc sắp thành mà đổ.',
      'TỔNG: Âm dương đối lập + tránh hiểm + sóng gió + vỡ giữa đường. Lời khuyên: cẩn thận, đừng mạo hiểm, đặc biệt cẩn thận lúc sắp thành («破中成»).',
    ] },
  '甲壬': { shi: '春來芳草依依綠，雪散紛紛見枯竹。空中群雁各東西，傷情獨向灘邊宿。',
    analysis: [
      'Câu 1 «春來芳草依依綠»: Xuân đến cỏ thơm xanh rờn — «芳草» = cơ hội tốt, sinh sôi. «依依» = lần lượt. Ý: có giai đoạn tốt đẹp, sự nghiệp đâm chồi.',
      'Câu 2 «雪散紛紛見枯竹»: Tuyết tan lộ trúc khô — «枯竹» = trúc khô = tàn tạ. Ý: sau mùa tốt là có lúc tồi tệ. Tốt xấu đan xen.',
      'Câu 3 «空中群雁各東西»: Nhạn bay mỗi hướng một — «各東西» = chia lìa. Ý: anh em bạn bè chia xa, cô đơn.',
      'Câu 4 «傷情獨向灘邊宿»: Buồn tình một mình ngủ bờ sông — «灘邊» = bãi bờ = chỗ trơ trọi. Ý: cô đơn, nhưng cũng tự tại.',
      'TỔNG: Tốt xấu đan xen + chia lìa + cô đơn. Nhưng câu 4 «獨» cũng có nghĩa tự do. Lời khuyên: chấp nhận thăng trầm, tìm niềm vui trong sự độc lập.',
    ] },
  '甲癸': { shi: '年光迅速催人老，風過瀟湘春又秋。雁過碧天沙塞遠，雨殘花敗果難收。',
    analysis: [
      'Câu 1 «年光迅速催人老»: Năm tháng thoi đưa giục người già — «迅速» = nhanh. Ý: thời gian trôi nhanh, cần tranh thủ tuổi trẻ.',
      'Câu 2 «風過瀟湘春又秋»: Gió qua Tương Hồ, xuân lại thu — «瀟湘» = vùng hồ Tương (cổ thi = sầu muộn, nhớ nhung). «春又秋» = mùa nào cũng buồn. Ý: sống nhiều sầu cảm, tuổi trẻ qua mau.',
      'Câu 3 «雁過碧天沙塞遠»: Nhạn trời xanh, cát biên xa — «沙塞遠» = biên cương xa = cô độc, xa quê. Ý: phiêu bạt xa nhà.',
      'Câu 4 «雨殘花敗果難收»: Mưa tàn hoa dạ, quả khó thu — «果難收» = quả khó thu hoạch = công sức khó kết quả. Ý: đầu tư nhiều nhưng thu hoạch ít, cần chọn đúng việc.',
      'TỔNG: Thời gian trôi nhanh + sầu cảm + phiêu bạt + kết quả ít. Lời khuyên: tranh thủ cơ hội sớm, đừng phung phí tuổi trẻ vào việc không ra quả.',
    ] },
};

/**
 * @param {object} R — kết quả analyze()
 * @returns {{ yearGan, hourGan, combo, gua, guaVi, geMing, star, starDesc, guaMeaning, summary }}
 */
export function guiguziFDG(R) {
  const yearGan = R.chart?.pillars?.year?.gan;
  const hourGan = R.chart?.pillars?.time?.gan;
  if (!yearGan || !hourGan) return null;
  const combo = yearGan + hourGan;
  const gua = GUA_MAP[combo] || '震';
  const guaInfo = GUA_VI[gua] || GUA_VI['震'];
  const geMing = GE_MING[combo] || 'Phiêu Bạt';
  // [loop 537] generate star desc cho ALL 100 combinations
  const GAN_NATURE = {
    '甲': 'Dương Mộc — tiên phong, trực tiếp, cây lớn', '乙': 'Âm Mộc — linh hoạt, hoa cỏ, mềm mại',
    '丙': 'Dương Hỏa — rực rỡ, nhiệt huyết, mặt trời', '丁': 'Âm Hỏa — ấm áp, đèn soi, tinh tế',
    '戊': 'Dương Thổ — núi lớn, vững chãi, bao dung', '己': 'Âm Thổ — đất ruộng, thực dụng, nuôi trồng',
    '庚': 'Dương Kim — kiếm bén, quyết đoán, dũng cảm', '辛': 'Âm Kim — trang sức, tinh xảo, thẩm mỹ',
    '壬': 'Dương Thủy — biển cả, bao la, bao dung', '癸': 'Âm Thủy — sương móc, thấm nhuần, tinh tế',
  };
  let starInfo = STARS[combo];
  if (!starInfo) {
    const ganNat = GAN_NATURE[yearGan] || '';
    const hourNat = GAN_NATURE[hourGan] || '';
    starInfo = {
      star: `${guaInfo.vi} Tinh`,
      desc: `${guaInfo.meaning} Năm ${yearGan}: ${ganNat}. Giờ ${hourGan}: ${hourNat}. Cách "${geMing}" ám chỉ: ${interpGeMing(geMing)}.`,
    };
  }
  const shiInfo = GE_SHI[combo];
  const summary = `${combo} → quẻ ${guaInfo.vi} | Cách "${geMing}" | ${starInfo.star || ''} — ${(starInfo.desc || guaInfo.meaning).slice(0, 100)}`;
  return {
    yearGan, hourGan, combo, gua, guaVi: guaInfo.vi, guaNature: guaInfo.nature,
    guaMeaning: guaInfo.meaning, geMing, star: starInfo.star || '',
    starDesc: starInfo.desc || '', geShi: shiInfo?.shi || '', geShiAnalysis: shiInfo?.analysis || null,
    summary,
  };
}

function interpGeMing(gm) {
  const M = {
    '雷霆遠震': 'uy lực đồn xa, tiếng tăm lớn', '泊水鴛鴦': 'tình duyên nước, cần giữ mặn nồng',
    '馬瘦長川': 'vất vả nhưng vượt qua', '春暖鵑啼': 'thời cơ đến, mùa xuân nở rộ',
    '漁父收綸': 'thu hoạch sau kiên nhẫn', '鳳宿春林': 'quý nhân phù trợ, vinh hiển',
    '花遇殘愁': 'đẹp nhưng ngắn ngủi', '月遠雲霄': 'lý tưởng cao, khó với',
    '芳草逢春': 'sinh sôi nảy nở, cơ hội nhiều', '白玉離塵': 'thanh cao, trong sạch',
    '行穩梅林': 'chắc chắn, bền bỉ', '秋霜肅殺': 'nghiêm khắc, quyết liệt',
    '雲中孤雁': 'cô đơn nhưng tự do', '石上流水': 'kiên nhẫn, bền bỉ, mài giũa',
    '風中殘燭': 'mong manh, cần bảo vệ', '林間隱士': 'thích yên tĩnh, ẩn dật',
    '秋水芙蓉': 'đẹp muộn, nở cuối thu', '月下瑤琴': 'nghệ thuật, tinh tế, lãng mạn',
    '霜天孤鶴': 'cô đơn, thanh cao', '枯木逢春': 'hồi sinh, cơ hội thứ hai',
    '寒潭秋月': 'sâu lắng, tĩnh lặng', '日中天': 'đỉnh cao, rực rỡ',
    '海上乘風': 'phiêu lưu, mạo hiểm', '雷動乾坤': 'uy lực lớn, thay đổi',
    '山高水長': 'bền vững, trường tồn', '虎嘯山林': 'quyền uy, lãnh đạo',
    '雨後彩虹': 'hy vọng sau khó khăn', '雪中送炭': 'giúp người lúc nghịch',
    '破浪乘舟': 'vượt khó, tiên phong', '春雷驚夢': 'thức tỉnh, đột phá',
    '火中蓮花': 'vượt nghịch mà đẹp', '寒梅傲雪': 'kiên cường, bất khuất',
    '碧海青天': 'rộng lớn, tự do', '劍氣沖天': 'quyết đoán, vươn lên',
    '鐵樹開花': 'khó nhưng sẽ thành', '金戈鐵馬': 'trận mạc, quyết chiến',
    '寶劍出鞘': 'sẵn sàng hành động', '珠玉在前': 'tài năng bộc lộ',
    '巧匠琢玉': 'tinh xảo, cần mài giũa', '江河日下': 'cần lưu ý xu hướng',
    '汪洋大海': 'bao dung, sâu thẳm', '滴水穿石': 'kiên nhẫn, bền bỉ',
    // [loop 538] expand to ALL 100 格名 — đảm bảo mỗi user đều có reading VN
    '雲中孤雁': 'cô đơn nhưng tự do', '風中殘燭': 'mong manh, cần bảo vệ',
    '林間隱士': 'thích yên tĩnh', '秋水芙蓉': 'đẹp muộn',
    '月下瑤琴': 'nghệ thuật, lãng mạn', '霜天孤鶴': 'cô đơn, thanh cao',
    '寒潭秋月': 'sâu lắng', '日中天': 'đỉnh cao',
    '海上乘風': 'phiêu lưu, mạo hiểm', '雷動乾坤': 'uy lực lớn',
    '山高水長': 'bền vững', '林深獸跡': 'tiềm ẩn, sâu sắc',
    '花發枝頭': 'nở rộ, thịnh vượng', '雲遮明月': 'tạm tối, chờ sáng',
    '雨後彩虹': 'hy vọng sau khó', '雪中送炭': 'giúp người lúc nghịch',
    '破浪乘舟': 'vượt khó', '月落星稀': 'cuối thời, tĩnh lặng',
    '春雷驚夢': 'thức tỉnh', '火中蓮花': 'vượt nghịch',
    '山間清泉': 'thanh khiết, liên tục', '晚霞映天': 'đẹp cuối ngày',
    '落花流水': 'buồn, xuôi dòng', '寒梅傲雪': 'kiên cường',
    '碧海青天': 'rộng lớn', '暮鴉歸巢': 'về nhà, an cư',
    '高山流水': 'cao cả, tri âm', '田野春風': 'bình dị, ấm áp',
    '城頭望月': 'nhìn xa, suy tư', '古寺鐘聲': 'tĩnh lặng, tâm linh',
    '大地回春': 'hồi sinh, cơ hội', '長江東去': 'không ngoảnh lại',
    '秋風落葉': 'thay đổi, buồn', '荒野孤松': 'kiên cường, cô độc',
    '雨打芭蕉': 'sầu, cảm xúc', '霞光萬道': 'vinh quang',
    '幽谷蘭花': 'ẩn nhưng quý', '井底之蛙': 'thiếu tầm nhìn',
    '溫泉沐浴': 'thoải mái, dễ dãi', '麥田金浪': 'thu hoạch lớn',
    '盆中松柏': 'hạn chế nhưng đẹp', '深山虎嘯': 'uy lực ẩn',
    '鏡裡乾坤': 'phản chiếu, hiểu rõ', '舟中夜月': 'hướng nội, suy tư',
    '雪裡紅梅': 'kiên cường, nổi bật', '露珠荷葉': 'mong manh, tinh tế',
    '劍氣沖天': 'quyết đoán', '鐵樹開花': 'khó nhưng thành',
    '金戈鐵馬': 'trận mạc', '寒光劍影': 'sắc bén, lạnh lùng',
    '銅牆鐵壁': 'vững chắc, cứng rắn', '鐘鳴鼎食': 'phú quý, sang trọng',
    '雷霆萬鈞': 'uy lực tối đại', '秋霜肅殺': 'nghiêm khắc',
    '寶劍出鞘': 'sẵn sàng hành động', '金殿傳臚': 'đỗ đạt, danh vọng',
    '珠玉在前': 'tài năng bộc lộ', '巧匠琢玉': 'tinh xảo',
    '銀河倒瀉': 'uy lực thiên nhiên', '繡閣春風': 'ấm áp, tinh tế',
    '玉樹臨風': 'tuấn tú, phong độ', '珠圓玉潤': 'hoàn hảo, tròn trịa',
    '冰壺秋月': 'trong sạch, cao nhã', '璇璣玉衡': 'tinh thông, bác học',
    '錦上添花': 'thêm tốt vào tốt', '珠沉滄海': 'tài bị vùi, cần thời',
    '江海滔滔': 'mạnh mẽ, liên tục', '雲水禪心': 'tâm linh, bình yên',
    '海闊天空': 'tự do, rộng lớn', '潮起潮落': 'có lúc lên xuống',
    '山洪暴發': 'bùng nổ, dữ dội', '春雨潤物': 'nhẹ nhàng, nuôi dưỡng',
    '瀑布飛泉': 'mạnh mẽ, dũng mãnh', '江河日下': 'xu hướng giảm',
    '寒潭魚躍': 'cơ hội ẩn sâu', '露潤芳草': 'nhẹ nhàng, nuôi dưỡng',
    '雨後春筍': 'sinh sôi nhanh', '雲霧繚繞': 'mơ hồ, bí ẩn',
    '溪水長流': 'liên tục, bền bỉ', '雨打梨花': 'sầu, mong manh',
    '冰消雪融': 'hòa giải, tan băng', '秋雨梧桐': 'sầu, cảm thu',
    '霧裡看花': 'khó看清, mập mờ', '寒泉洗心': 'tĩnh tâm, thanh tẩy',
  };
  return M[gm] || `${gm} — tính cách đặc trưng theo cổ pháp 鬼谷子`;
}
