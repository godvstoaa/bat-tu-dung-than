// ============================================================================
//  称骨算命 (稱骨) — BONE-WEIGHT DIVINATION
//  Phương pháp cổ của 袁天罡 (đời Đường): mỗi năm/tháng/ngày/giờ sinh (ÂL)
//  ứng một trọng lượng bạc (lạng 两 + tiền 钱, 1 两 = 10 钱). Cộng lại thành
//  tổng trọng lượng xương (2.1 → 7.1 两), mỗi tổng ứng một bài thơ phú.
//
//  Nguồn bảng: 袁天罡称骨算法 (bản phổ biến rộng rãi).
//  Quy đổi ÂL: dùng lunar-javascript (Solar → Lunar) để lấy đúng năm/tháng/
//  ngày/giờ âm lịch và can chi năm cho việc tính index lục thập hoa giáp.
// ============================================================================

import { Solar } from 'lunar-javascript';
import { GAN, ZHI, ZHI_ORDER } from './constants.js';
import { ziShiRoll } from './chart.js'; // [loop 178] 称骨 bẩm sinh dùng cùng 子时换日 八字

// --- Trọng lượng NĂM (lạng) theo index 0-59 của lục thập hoa giáp (甲子=0) ---
//  甲子1.2 乙丑0.9 丙寅0.6 丁卯0.7 戊辰1.2 己巳0.5 庚午0.9 辛未0.8 壬申0.7 癸酉0.8
//  甲戌1.5 乙亥0.9 丙子1.5 丁丑0.6 戊寅0.8 己卯1.9 庚辰1.2 辛巳0.7 壬午0.9 癸未0.7
//  甲申0.5 乙酉1.2 丙戌0.6 丁亥1.6 戊子1.5 己丑0.7 庚寅0.9 辛卯1.2 壬辰1.0 癸巳0.7
//  甲午1.5 乙未0.6 丙申0.5 丁酉1.4 戊戌1.4 己亥0.9 庚子0.7 辛丑0.7 壬寅0.9 癸卯1.2
//  甲辰0.8 乙巳0.7 丙午1.3 丁未0.5 戊申0.8 己酉0.5 庚戌0.9 辛亥1.7 壬子0.5 癸丑0.7
//  甲寅1.2 乙卯0.8 丙辰0.8 丁巳0.6 戊午1.9 己未0.6 庚申0.8 辛酉0.8 壬戌1.0 癸亥0.6
const YEAR_WEIGHT = [
  1.2, 0.9, 0.6, 0.7, 1.2, 0.5, 0.9, 0.8, 0.7, 0.8,   // 甲子..癸酉 (0-9)
  1.5, 0.9, 1.6, 0.8, 0.8, 1.9, 1.2, 0.6, 0.8, 0.7,   // 甲戌..癸未 (10-19) [517 fix 丙子1.6/丁丑0.8/辛巳0.6/壬午0.8]
  0.5, 1.5, 0.6, 1.6, 1.5, 0.7, 0.9, 1.2, 1.0, 0.7,   // 甲申..癸巳 (20-29) [517 fix 乙酉1.5]
  1.5, 0.6, 0.5, 1.4, 1.4, 0.9, 0.7, 0.7, 0.9, 1.2,   // 甲午..癸卯 (30-39) [1031 fix 乙未0.6 — 三命通会 chuẩn, 517 từng đặt 0.8 sai]
  0.8, 0.7, 1.3, 0.5, 1.4, 0.5, 0.9, 1.7, 0.5, 0.7,   // 甲辰..癸丑 (40-49) [1031 fix 戊申1.4 + 壬子0.5 — 三命通会 chuẩn]
  1.2, 0.8, 0.8, 0.6, 1.9, 0.6, 0.8, 1.6, 1.0, 0.6,   // 甲寅..癸亥 (50-59) [1031 fix 辛酉1.6 — 三命通会 chuẩn]
];

// --- Trọng lượng THÁNG (lịch âm 1-12) ---
const MONTH_WEIGHT = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5];
// index 0 = tháng 1 → 0.6, ... index 11 = tháng 12 → 0.5

// --- Trọng lượng NGÀY (lịch âm 1-30) ---
const DAY_WEIGHT = [
  0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6,    // 1-10
  0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.9, 1.8, 0.5, 1.5,    // 11-20
  1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6,    // 21-30
];
// index 0 = ngày 1 → 0.5, ... index 29 = ngày 30 → 0.6

// --- Trọng lượng GIỜ (theo 12 địa chi) ---
//   子:1.6 丑:0.6 寅:0.7 卯:1.0 辰:0.9 巳:1.6
//   午:1.0 未:0.8 申:0.8 酉:0.9 戌:0.6 亥:0.6
const HOUR_WEIGHT = {
  子: 1.6, 丑: 0.6, 寅: 0.7, 卯: 1.0, 辰: 0.9, 巳: 1.6,
  午: 1.0, 未: 0.8, 申: 0.8, 酉: 0.9, 戌: 0.6, 亥: 0.6,
};

// --- Bài thơ phú + lời giải Việt theo tổng trọng lượng (đơn vị 两) ---
//    Mỗi mục: verse (2 câu phong cách cổ), interpretation (2-3 câu VN:
//    mạng/sự nghiệp-tài, tình duyên, thọ). Bám theo thang cổ:
//    2.1-2.3 RẤT XẤU · 2.4-2.7 XẤU · 2.8-3.0 HƠI THẤP · 3.1-3.4 TRUNG BÌNH
//    3.5-3.8 HƠI TỐT · 3.9-4.1 TỐT · 4.2-4.5 RẤT TỐT · 4.6-5.0 XUẤT SẮC
//    5.1-5.5 ĐỘC BÁ · 5.6-7.1 SIÊU PHÀM.
const FORTUNE = {
  '2.1': {
    verse: '命宫低薄受奔波，祖业飘零辛苦多。',
    interpretation: 'Mạng nhẹ bậc nhất: cả đời bôn ba, nghèo khó, cô đơn. Sự nghiệp khó thành, tài lộc hao hụt; tình duyên trắc trở, muộn màng hoặc lận đận; thể thọ thường ngắn, cần tích đức để giảm nghiệp.',
  },
  '2.2': {
    verse: '一身冷落更愁穷，万事无成如转蓬。',
    interpretation: 'Mạng rất nhẹ: Floating như cỏ bồng, sự nghiệp dang dở, tiền bạc thiếu trước hụt sau. Duyên vợ/chồng muộn hoặc bất hòa; sức khỏe yếu, nên hành thiện để cải vận.',
  },
  '2.3': {
    verse: '此命推来福弱人，谋事难成百事贫。',
    interpretation: 'Mệnh phúc mỏng: mưu sự khó thành, cả đời thanh đạm. Tài lộc ít ỏi, duyên phận lận đận; cần kiên nhẫn và tu thân, tránh đầu cơ mạo hiểm.',
  },
  '2.4': {
    verse: '平生劳碌似轻舟，独自撑持独自愁。',
    interpretation: 'Cả đời lao lực như chiếc thuyền nhỏ giữa sóng: tự mình gánh vác, sự nghiệp muộn thành. Tài lộc đủ sống, duyên phần hơi muộn; cần bền chí.',
  },
  '2.5': {
    verse: '六亲无力少人扶，半世辛勤半世孤。',
    interpretation: 'Lục thân khó dựa dẫm, nửa đời vất vả nửa đời đơn độc. Sự nghiệp tự lập khá chậm, tài lộc tích lũy nhọc; duyên nên kết hôn muộn để vững.',
  },
  '2.6': {
    verse: '辛苦缘何赖己身，财星不现禄难臻。',
    interpretation: 'Vất vả tự thân, sao Tài không lộ nên lộc khó đến. Sự nghiệp bình thường, tiền bạc đủ dùng; tình duyên trung bình, cần chọn người hiền hòa bổ sung.',
  },
  '2.7': {
    verse: '渐渐兴隆渐渐成，晚年方得享安宁。',
    interpretation: 'Đại thế dần dần hưng vượng: sự nghiệp muộn mới phát, trung niên khá hơn, vãn niên thanh bình. Tài lộc hậu vận tốt; duyên phần bình ổn.',
  },
  '2.8': {
    verse: '生平作事少商量，难靠祖宗自主张。',
    interpretation: 'Tự mình lập nghiệp, ít dựa được tổ nghiệp: sự nghiệp bình thường nhưng vững nhờ tự lực. Tài lộc trung bình; duyên cần nhẫn nại, tránh nóng nảy.',
  },
  '2.9': {
    verse: '初年不足暮年通，初限虽危末限丰。',
    interpretation: 'Sơ vận thiếu thốn, mạt vận hanh thông: sự nghiệp muộn mới thuận, tiền bạc ổn dần. Tình duyên trung niên mới êm ả; sức khỏe bình thường.',
  },
  '3.0': {
    verse: '劳心劳力未安心，早岁蹉跎晚岁荣。',
    interpretation: 'Tâm sức nhiều, sớm gian nan muộn mới vinh: sự nghiệp vừa phải, hậu vận khá. Tài lộc đủ dư; duyên phần nên chọn người đồng cam cộng khổ.',
  },
  '3.1': {
    verse: '忙忙碌碌苦中求，东走西奔何日休。',
    interpretation: 'Bận rộn bôn ba để mưu sinh: sự nghiệp trung bình, vất vả mới có. Tài lộc đủ sống; duyên phần trung bình, cần bao dung giữ hòa khí.',
  },
  '3.2': {
    verse: '命中难有富贵基，百事操持要己为。',
    interpretation: 'Mạng không có nền phú quý sẵn, mọi việc tự lo: sự nghiệp ổn định nếu chăm chỉ. Tài lộc tích lũy từ từ; tình duyên bình, hậu vận khá hơn.',
  },
  '3.3': {
    verse: '性直心粗不自由，中年渐顺老年优。',
    interpretation: 'Tính thẳng, tâm thô nên ít tự tại, trung niên mới dần thuận: sự nghiệp ổn, tài lộc vừa đủ rồi dư. Duyên cần kiềm chế tính nết; thọ trung bình khá.',
  },
  '3.4': {
    verse: '此命福气如何算，财禄平平衣禄艰。',
    interpretation: 'Phúc khí trung bình, tài lộc dư dả không tới: sự nghiệp vững nếu cần mẫn, tiền bạc đủ xài. Tình duyên an ổn, hậu vận thanh nhàn.',
  },
  '3.5': {
    verse: '生平福量不周全，祖业根基少有传。',
    interpretation: 'Phúc lượng chưa tròn đủ, ít dựa tổ nghiệp: sự nghiệp tự lập khá tốt, tài lộc trung lưu. Duyên phần ổn, gia đạo yên ấm về sau.',
  },
  '3.6': {
    verse: '不须劳碌过平生，独自成家福不轻。',
    interpretation: 'Không cần quá nhọc nhằn, tự thành gia đình phúc không nhẹ: sự nghiệp khá, tài lộc đủ dư. Duyên phần tốt, hậu vận an nhàn.',
  },
  '3.7': {
    verse: '此命终身运不通，劳劳作事尽皆空。',
    interpretation: '(Lưu ý: bài thơ xưa hay cảnh tỉnh) nhưng thực tế mạng này trung thượng: cần kiên nhẫn vượt khó, sự nghiệp có kết quả, tài lộc dần tới. Duyên bình ổn, thọ khá.',
  },
  '3.8': {
    verse: '财帛自然来有道，一生富贵保安宁。',
    interpretation: 'Tài bạch tự nhiên đến đúng đạo: sự nghiệp thuận, tài lộc sung túc trung lưu khá. Tình duyên êm ả, gia đạo bình an.',
  },
  '3.9': {
    verse: '此命推来福不轻，自成自立显门庭。',
    interpretation: 'Phúc không nhẹ, tự thành tự lập rạng danh gia đình: sự nghiệp tốt, được nể trọng. Tài lộc dư dả; duyên phần đẹp, hậu vận vinh hiển.',
  },
  '4.0': {
    verse: '一生安然享康宁，福禄绵长财禄盈。',
    interpretation: 'Cả đời an nhiên khỏe mạnh, phúc lộc kéo dài tài lộc đầy: sự nghiệp vững vàng, tiền bạc sung túc. Duyên bền, thọ cao.',
  },
  '4.1': {
    verse: '此命推来福寿长，心平仁义好风光。',
    interpretation: 'Phúc thọ dài, tâm bình nhân nghĩa phong quang: sự nghiệp ổn định khá giả, tài lộc sung túc. Duyên hài hòa, danh giá tốt.',
  },
  '4.2': {
    verse: '得来富贵不须求，自有亨通到白头。',
    interpretation: 'Phú quý đến tự nhiên không phải cầu: sự nghiệp hanh thông đến già, tài lộc dồi dào. Duyên trọn vẹn, gia đạo hưng vượng.',
  },
  '4.3': {
    verse: '财禄丰盈万事全，一生富贵不论钱。',
    interpretation: 'Tài lộc phong đầy vạn sự toàn: sự nghiệp vượng, tiền bạc dư dư. Tình duyên viên mãn, con cháu đông đủ.',
  },
  '4.4': {
    verse: '好把身心立正中，自然福禄永兴隆。',
    interpretation: 'Giữ thân tâm ngay chính, phúc lộc tự hưng long: sự nghiệp vững, tài lộc thịnh. Duyên bền vững, hậu vận vinh hoa.',
  },
  '4.5': {
    verse: '福气重重有贵人，衣食丰足不愁贫。',
    interpretation: 'Phúc khí trùng trùng có quý nhân, y thực sung túc: sự nghiệp được nâng đỡ, tài lộc dồi dào. Duyên tốt, quan hệ rộng.',
  },
  '4.6': {
    verse: '东西南北尽皆通，出入求谋总是丰。',
    interpretation: 'Bốn phương thông suốt, mưu cầu luôn丰收: sự nghiệp rộng mở, tài lộc đầy tay. Duyên phần tốt, danh vọng cao.',
  },
  '4.7': {
    verse: '此命命中多富贵，公侯卿相岂寻常。',
    interpretation: 'Mạng nhiều phú quý, không phải tầm thường: sự nghiệp đến tước vị cao, tài lộc sung túc. Duyên hiển hách, gia đạo vinh hiển.',
  },
  '4.8': {
    verse: '初年不及末年通，财禄官星一齐丰。',
    interpretation: 'Sơ vận kém mạt vận thông, tài lộc quan tinh cùng丰: sự nghiệp muộn phát vượng, tiền bạc quan vị đều đủ. Duyên hậu vận rực rỡ.',
  },
  '4.9': {
    verse: '此命福气果非凡，自是人间一贵人。',
    interpretation: 'Phúc khí quả phi phàm, là một quý nhân giữa nhân gian: sự nghiệp xuất chúng, tài lộc phú quý. Duyên viên mãn, được người kính trọng.',
  },
  '5.0': {
    verse: '为名为利自然成，不费心机享太平。',
    interpretation: 'Danh lợi tự nhiên thành, không tốn tâm cơ hưởng thái bình: sự nghiệp vượng, tài lộc đầy. Duyên viên mãn, cả đời an nhàn phú quý.',
  },
  '5.1': {
    verse: '一世荣华世所钦，福如东海寿如春。',
    interpretation: 'Một đời vinh hoa được đời kính ngưỡng, phúc như Đông Hải thọ như mùa xuân: sự nghiệp cực vượng, tài lộc vô lượng. Duyên viên mãn, thọ dài, danh vọng đỉnh cao.',
  },
  '5.2': {
    verse: '一世享荣华，自有祯祥降善家；财旺官荣福寿广，平生富贵更无涯。',
    interpretation: 'Cả đời vinh hoa, điềm lành giáng xuống gia đình lương thiện: tài vượng quan vinh phúc thọ rộng, sự nghiệp phú quý không bờ bến. Duyên viên mãn, con cháu hiển đạt.',
  },
  '5.3': {
    verse: '此命推来福寿绵，自己兴家又发源；近宝求财皆遂意，晚年富贵又双全。',
    interpretation: 'Phúc thọ kéo dài, tự tay hưng gia lập nghiệp: cầu tài toại ý, mạt vận phú quý song toàn. Sự nghiệp vượng, duyên viên mãn.',
  },
  '5.4': {
    verse: '此格推来气象真，兴家发达在其中；一生福禄安然好，处世逍遥自在游。',
    interpretation: 'Khí tượng chân thật, hưng gia phát đạt: cả đời phúc lộc an nhiên, xử thế tiêu dao tự tại. Sự nghiệp lớn, tài lộc dồi dào, duyên hài hòa.',
  },
  '5.5': {
    verse: '走马扬鞭逞名扬，命中最是读书郎；威声大器人多敬，福禄滔滔至老长。',
    interpretation: 'Lầu son gác tía danh vang bốn bể, là người bậc trí: uy vọng lớn được người kính trọng, phúc lộc bát ngát đến già. Sự nghiệp đỉnh cao, thọ dài.',
  },
  '5.6': {
    verse: '此格推来禄数奇，光辉宗祖耀门闾；一生豪富多康宁，半世功名事事宜。',
    interpretation: 'Lộc số kỳ tuyệt, rạng rỡ tổ tông: cả đời hào phú khỏe mạnh, công danh sự nghiệp đều như ý. Tài lộc vô lượng, duyên hiển hách.',
  },
  '5.7': {
    verse: '福寿绵长富贵全，名声赫赫四方传；平生多福多康宁，更有功名达上天。',
    interpretation: 'Phúc thọ dài phú quý toàn, danh tiếng lừng lẫy bốn phương: nhiều phúc nhiều khỏe, công danh đạt trời. Sự nghiệp đỉnh phong, thọ cao.',
  },
  // [loop 1034] bổ sung 2 verse thiếu (5.8/5.9) — sourced 袁天罡称骨歌 (Baidu/网易通行版).
  '5.8': {
    verse: '平生福禄自然来，名利兼全福禄偕；雁塔题名为贵客，紫袍玉带走金阶。',
    interpretation: '«Quan lộc chi mệnh»: một đời phúc lộc tự đến, danh lợi song toàn. Đậu đạt cao (quý khách tháp nhạn), áo tím đai ngọc bước sân rồng — mệnh quan lộc, sự nghiệp hiển hách, vãn niên hưởng phúc.',
  },
  '5.9': {
    verse: '细推此格妙且清，必定才高礼义通；甲第三人当及第，巍巍独立显宗风。',
    interpretation: 'Tài cao lễ nghĩa thông, tâm linh thủ xảo, việc có đầu có đuôi. Đậu đạt (giáp ba đệ nhất), sừng sững độc lập rạng tông phong. Nên an phận thủ trách, chân đất phát triển, phúc lộc tự túc.',
  },
  '6.0': {
    verse: '一朝金榜快题名，显祖荣宗豁眼明；平生福禄真堪羡，万乘之尊遇太平。',
    interpretation: 'Một ngày kim bảng đề danh, rạng tổ vinh tông: phúc lộc đáng ngưỡng mộ, tôn quý bậc vua chúa thái bình. Sự nghiệp cực vượng, tài lộc vô song, thọ rất cao.',
  },
  '6.1': {
    verse: '不作朝中金榜客，定为世上大财翁；聪明天赋经书熟，名播千秋四海中。',
    interpretation: 'Không làm quan thì cũng là đại phú ông: thông minh thiên phú, danh vang thiên thu bốn biển. Sự nghiệp phú quý tột bậc, duyên viên mãn.',
  },
  '6.2': {
    verse: '此命生来福不轻，鸿图大展振家声；财源广进如泉涌，福寿双全代代荣。',
    interpretation: 'Phúc không nhẹ, hồng đồ đại triển chấn gia thanh: tài源 rộng như suối, phúc thọ song toàn đời đời vinh. Sự nghiệp cực thịnh.',
  },
  '6.3': {
    verse: '权柄天然福禄绵，富贵双全福寿全；平生衣禄自然足，一代风流万代传。',
    interpretation: 'Quyền bính thiên nhiên, phú quý phúc thọ toàn: y lộc tự nhiên đủ, một đời phong lưu vạn đại truyền. Cực vượng.',
  },
  '6.4': {
    verse: '此命生来福禄盈，文章股肱佐圣明；一举登科名天下，满门朱紫受皇恩。',
    interpretation: 'Phúc lộc đầy, văn chương bōc löc phụ tá thánh minh: một lần đăng khoa danh thiên hạ, cả nhà tía đỏ được hoàng ân. Cực phẩm.',
  },
  '6.5': {
    verse: '细推此命福非轻，富贵荣华孰与争；子话金花并玉树，满门桃李贵无伦。',
    interpretation: 'Phúc phi phàm, phú quý vinh hoa ai bì kịp: con cháu kim hoa ngọc thụ, cả nhà đào lý quý vô song. Cực vượng thế gia.',
  },
  '6.6': {
    verse: '此格推来福禄多，清闲富贵自然呵；平生有福兼有寿，业兴财旺子孙和。',
    interpretation: 'Phúc lộc rất nhiều, thanh nhàn phú quý tự nhiên: có phúc có thọ, nghiệp hưng tài vượng tử tôn hòa. Đại cát.',
  },
  '6.7': {
    verse: '此命生来福自宏，文章星斗动天庭；一行一步皆逢贵，万两黄金不带零。',
    interpretation: 'Phúc tự hưng long, văn chương như tinh đẩu động thiên đình: mỗi bước đều gặp quý nhân, vạn lượng hoàng kim. Cực phẩm danh gia.',
  },
  '6.8': {
    verse: '富贵荣华大不同，鬓眉之间显奇功；平生福禄真无敌，福寿绵长永兴隆。',
    interpretation: 'Phú quý vinh hoa khác thường, giữa nét mặt hiển kỳ công: phúc lộc vô địch, phúc thọ kéo dài hưng long. Cực vượng.',
  },
  '6.9': {
    verse: '紫袍金带御街行，鸣鼓三声响九重；文武皆能威信重，福禄滔滔代代荣。',
    interpretation: 'Tử bào kim带 đi ngự nhai, tiếng trống chín tầng: văn võ toàn năng uy tín trọng, phúc lộc bát ngát đời đời vinh. Đỉnh phong.',
  },
  '7.0': {
    verse: '此命生来福气浓，君王御殿赐衣红；文武双全名誉远，满门沾恩受皇封。',
    interpretation: 'Phúc khí nồng, quân vương ngự điện ban y đỏ: văn võ song toàn danh dự xa, cả nhà di ân hoàng phong. Đại quý vô song.',
  },
  '7.1': {
    verse: '此命生来福气长，不重名利自然昌；文武皆能威天下，万国来朝贺圣皇。',
    interpretation: 'Phúc khí dài, không cần tranh danh lợi vẫn tự nhiên hưng: văn võ uy chấn thiên hạ, vạn quốc triều cống. Cực phẩm bậc đế vương — hiếm có.',
  },
};

// --- Bảng phân tầng tổng quan (dùng cho `summary`) ---
function tierOf(total) {
  if (total >= 5.6) return { tier: 'SIÊU PHÀM (xuất thế)', tone: 'cat', note: 'Mạng cực quý, phú quý vô song — đỉnh cao hiếm có.' };
  if (total >= 5.1) return { tier: 'ĐỘC BÁ (xuất chúng)', tone: 'cat', note: 'Mạng xuất chúng, danh vọng đỉnh cao, tài lộc vô lượng.' };
  if (total >= 4.6) return { tier: 'XUẤT SẮC', tone: 'cat', note: 'Mạng phú quý, sự nghiệp vượng, tài lộc dồi dào.' };
  if (total >= 4.2) return { tier: 'RẤT TỐT', tone: 'cat', note: 'Mạng khá giả, duyên viên mãn, quan hệ rộng.' };
  if (total >= 3.9) return { tier: 'TỐT', tone: 'cat', note: 'Mạng tốt, sự nghiệp vững, tài lộc sung túc.' };
  if (total >= 3.5) return { tier: 'HƠI TỐT', tone: 'mid', note: 'Mạng trung lưu khá, hậu vận an nhàn.' };
  if (total >= 3.1) return { tier: 'TRUNG BÌNH', tone: 'mid', note: 'Mạng vừa phải, cần chăm chỉ mới ổn.' };
  if (total >= 2.8) return { tier: 'HƠI THẤP', tone: 'mid', note: 'Sơ vận gian nan, mạt vận khá hơn.' };
  if (total >= 2.4) return { tier: 'XẤU', tone: 'warn', note: 'Cả đời vất vả, muộn mới khá — cần tích đức.' };
  return { tier: 'RẤT XẤU', tone: 'warn', note: 'Mạng nhẹ bậc nhất, bôn ba nghèo khó — cải vận bằng âm đức.' };
}

// --- Tìm entry fortune gần nhất (làm tròn 0.1) cho các tổng ngoài bảng ---
function lookupFortune(totalLiang) {
  // Làm tròn tới 0.1 gần nhất
  const rounded = Math.round(totalLiang * 10) / 10;
  const key = rounded.toFixed(1);
  if (FORTUNE[key]) return FORTUNE[key];
  // [loop 1033 FIX] gap (vd 5.8/5.9 thiếu verse) → map tới key GẦN NHẤT (không phải kẹp xuống 5.6
  //   như cũ — 5.8 gần 5.7 hơn, 5.9 gần 6.0). Robust cho mọi gap.
  const _keys = Object.keys(FORTUNE).map(Number);
  let _best = _keys[0], _bestD = Math.abs(rounded - _best);
  for (const k of _keys) { const d = Math.abs(rounded - k); if (d < _bestD) { _bestD = d; _best = k; } }
  return FORTUNE[_best.toFixed(1)];
}

/**
 * Lấy can-chi năm (lục thập hoa giáp) và index 0-59 từ năm dương lịch.
 * Dùng công thức chuẩn: index = ((year - 4) % 60 + 60) % 60  (甲子=0, ứng năm 4 TCN).
 */
function yearGanzhiIndex(solarYear) {
  return ((solarYear - 4) % 60 + 60) % 60;
}

/**
 * Tính trọng lượng xương 称骨.
 * @param {object} R — kết quả analyze() (cần R.chart.input: year/month/day/hour/minute/gender)
 * @returns {{
 *   totalLiang:number, totalQian:number, totalStr:string,
 *   verse:string, interpretation:string,
 *   weights:{year:number,month:number,day:number,hour:number},
 *   lunar:{year:number,month:number,day:number,timeZhi:string,yearGanZhi:string},
 *   summary:{tier:string,tone:string,note:string},
 * }}
 */
export function chenggu(R) {
  const inp = R?.chart?.input;
  if (!inp) throw new Error('chenggu: thiếu R.chart.input');

  const { year, month, day } = inp;
  // hour có thể = 0 (giờ Tý giữa đêm) → KHÔNG dùng `hour || 12` (sẽ sai 0→12)
  const hh = (inp.hour == null) ? 12 : inp.hour;
  const mm = (inp.minute == null) ? 0 : inp.minute;
  // [loop 178] 子时换日 — đồng bộ buildChart: 23:00+ → sang hôm sau (cùng lá số bẩm sinh)
  const [cy, cm, cd, ch, cmin] = ziShiRoll(year, month, day, hh, mm);
  // Quy đổi dương lịch → âm lịch + can chi năm + chi giờ
  const lunar = Solar.fromYmdHms(cy, cm, cd, ch, cmin, 0).getLunar();
  const lunarMonth = lunar.getMonth();        // 1-12 (có thể âm nếu nhuận — lấy abs)
  let lunarDay = lunar.getDay();              // 1-30
  const timeZhi = lunar.getTimeZhi();         // 子..亥
  const solarYearForGz = lunar.getYear();     // năm ÂL (đảm bảo đúng hoả giáp năm sau Tết)
  const yearGanZhi = lunar.getYearInGanZhi();
  const ygIdx = yearGanzhiIndex(solarYearForGz);

  // Lấy trọng lượng từng mục
  const wYear = YEAR_WEIGHT[ygIdx] ?? 0;
  const mIdx = Math.abs(lunarMonth) - 1;       // tháng nhuận lấy trị tuyệt đối
  const wMonth = MONTH_WEIGHT[mIdx] ?? 0;
  const wDay = DAY_WEIGHT[(lunarDay - 1)] ?? 0;
  const wHour = HOUR_WEIGHT[timeZhi] ?? 0;

  const total = Math.round((wYear + wMonth + wDay + wHour) * 10) / 10; // 两 (1 thập phân)
  const totalLiang = Math.floor(total);        // phần lạng
  const totalQian = Math.round((total - totalLiang) * 10); // phần tiền (0-9)
  // Chuỗi hiển thị: "5两0钱" / nếu total=5.0 → "5两0钱"
  const totalStr = `${totalLiang}两${totalQian}钱`;
  const totalKey = total.toFixed(1);

  const f = lookupFortune(total);
  const tier = tierOf(total);

  return {
    totalLiang: total,            // số thập phân đầy đủ, vd 5.0
    totalQian,                    // phần tiền (0-9)
    totalStr,                     // "5两0钱"
    totalKey,                     // "5.0" (key tra FORTUNE)
    verse: f.verse,
    interpretation: f.interpretation,
    weights: { year: wYear, month: wMonth, day: wDay, hour: wHour },
    lunar: {
      year: solarYearForGz,
      month: Math.abs(lunarMonth),
      day: lunarDay,
      timeZhi,
      yearGanZhi,
      ganzhiIndex: ygIdx,
    },
    summary: tier,
  };
}

export { YEAR_WEIGHT, MONTH_WEIGHT, DAY_WEIGHT, HOUR_WEIGHT, FORTUNE };
