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
  const starInfo = STARS[combo] || { star: '(chưa encode)', desc: '' };
  const summary = `${combo} → quẻ ${guaInfo.vi} | Cách「${geMing}」| ${starInfo.star ? starInfo.star : ''} — ${guaInfo.meaning.slice(0, 80)}`;
  return {
    yearGan, hourGan, combo, gua, guaVi: guaInfo.vi, guaNature: guaInfo.nature,
    guaMeaning: guaInfo.meaning, geMing, star: starInfo.star || '',
    starDesc: starInfo.desc || '', summary,
  };
}
