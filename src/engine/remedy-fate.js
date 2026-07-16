// ============================================================================
//  remedy-fate.js — NGHỊCH THIÊN CẢI MỆNH (逆天改命) — PHIÊN BẢN SÂU (ROOT-LEVEL)
//  KHÔNG platitude «làm thiện/tích đức». Mọi vấn đề → CỐT LÕI (业 = nghiệp nhân quá khứ)
//  → THUỐC TRỰC TIẾP (消业 = giải nghiệp cụ thể:戒+经咒+忏悔).
//
//  Nguồn (grok CN research sâu): 华严经/十善业道经/了凡四训/准提法门/药师经/地藏经/
//  金刚经/普门品/楞严咒/八十八佛忏悔文/金刚萨埵/清静经/内丹 + 八字化解 3层 (形/心/业).
//
//  Nguyên lý cốt lõi: Mệnh = 先天业 quả. Cải mệnh = chuyển nghiệp. Tận gốc = 改心 +
//  消业 (sám hối). Lá số thấy quỹ đạo hiện tại, KHÔNG cố định — chuyển tâm+nghiệp = đổi mệnh.
// ============================================================================
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------------------
// 1. ĐIỂN CỐ + NGUYÊN LÝ CỐT LÕI
// ---------------------------------------------------------------------------
export const LIAOFAN_STORY = {
  title: 'Điển cố Liễu Phàm — minh chứng số phận KHÔNG cố định',
  story: 'Khổng tiên sinh bói Liễu Phàm: đỗ tú tài hạng 14, làm quan một chức, KHÔNG con, chết năm 53. Mọi lời ứng nghiệm đến tuổi 35 → ông tin «mệnh đã an». Gặp Vân Cốc thiền sư → sư dạy «mệnh do tâm tạo, bói chỉ thấy QUỸ ĐẠO HIỆN TẠI». Sư truyền准提法门 + Công Qua Cách. Liễu Phàm tích 3000 công → sinh con (Nguyên Khang); 6000 công → đỗ tiến sĩ; sống 74 (không 53).',
  lesson: 'Mệnh = QUỸ ĐẠO (đường lối hiện tại), KHÔNG phải KẾT CỤC. Cốt lõi: chuyển tâm + giải nghiệp → đổi quỹ đạo.',
  rootChain: '心(tâm) → 念(niệm) → 行(hành) → 业(nghiệp) → 命(mệnh). Sửa tận TÂM/NGHIỆP = sửa tận GỐC.',
};

// ---------------------------------------------------------------------------
// 2. 业果 ROOT MAP — 10 ÁC NGHIỆP → THỰC TRẠNG → GIẢI NGHIỆP TRỰC TIẾP
//    (KHÔNG «làm thiện chung» — mỗi ác nghiệp có戒+经咒+忏悔 cụ thể)
// ---------------------------------------------------------------------------
export const YEGUO = [
  { karma: 'Sát sinh 业 (giết mạng)', result: '短命/多病/血光灾/常遇刀兵 — đoản mệnh, nhiều bệnh, tai nạn máu', cure: '日持不杀戒+吃素戒杀+放生(量力买活物放+回向)+持药师咒/药师经+礼佛忏悔杀业' },
  { karma: 'Thâu đạo 业 (trộm cắp)', result: '贫穷/财不聚/常被骗/财不由己 — nghèo, tiền không giữ, bị lừa', cure: '持不与取戒(绝不白拿/盗版/漏税)+量力布施(先还欠再施)+持地藏经/地藏圣号+忏悔盗业+补偿原主' },
  { karma: 'Tà dâm 业 (dâm tà)', result: '婚姻破裂/配偶不贞/感情纠缠孤独 — hôn nhân vỡ, bạn đời không chung', cure: '持不邪淫戒(断婚外/色情)+夫妻正淫节制+持观音圣号/准提咒+礼普贤行愿品忏悔+修不净观降欲' },
  { karma: 'Vọng ngữ 业 (nói dối)', result: '人不信/常被诽谤/口业病/言无信 — không ai tin, bị bôi nhọ', cure: '持不妄语戒(事事核实再言)+日说诚实语不夸张+持金刚经/阿弥陀佛+发露忏悔+当众更正曾说之谎' },
  { karma: 'Lưỡng thiệt 业 (hai lưỡi,xúc giục)', result: '眷属乖离/亲友反目/团体分裂 — người thân ly tán', cure: '持不两舌戒(绝不传是非)+主动说和合语/调解+赞叹他人功德+持大悲咒/文殊圣号+忏悔修善缘' },
  { karma: 'Ác khẩu 业 (lời ác)', result: '常闻恶声/口舌官非/招怨 — thị phi, kiện cáo, thù oán', cure: '持不恶口戒(禁骂/阴阳)+日说柔软语先思后言+修忍辱(被骂不还口)+持灭定业真言/大悲咒+致歉曾骂之人' },
  { karma: 'Ỷ ngữ 业 (lời vô nghĩa)', result: '言无人受/无威/做事不成 — nói không ai nghe, không uy', cure: '持不绮语戒(戒闲聊/荤段子)+以诵经持咒代无义闲谈+少言慎语+持文殊心咒/心经+立每日有益语功课' },
  { karma: 'Tham 业 (tham dục)', result: '心不知足/越有越缺/好事易衰 — không vừa lòng, có càng thiếu', cure: '修布施(财施/法施/无畏施,先小额固定)+日修知足观+持准提咒/弥勒圣号+忏悔非分所求' },
  { karma: 'Sân 业 (giận dữ)', result: '相貌不悦/多怨敌/灾疫 — mặt ác, nhiều thù, tai nạn', cure: '日修慈心观(亲→中→怨次第)+持不嗔戒(怒起先停三息)+修忍辱+持阿弥陀佛/灭定业真言+发露忏悔回向曾伤之人' },
  { karma: 'Si 业 (vô minh,tà kiến)', result: '愚痴邪见/亲近恶友/福报隐没 — tối昧, bạn ác, phúc giảm', cure: '皈依三宝+亲近正见善知识+日读十善业道经/心经/金刚经建正见+持文殊心咒破痴+忏悔谤法邪见' },
];

// ---------------------------------------------------------------------------
// 3. 八字 HÓA GIẢI 3 TẦNG (形/心/业) — mỗi vấn đề lá số → 3 lớp thuốc
//    形法 (sửa ngoại cảnh/vật lý) + 心法 (sửa tâm) + 业法 (giải nghiệp gốc)
// ---------------------------------------------------------------------------
export const BAZI_HUAJIE = [
  { when: 'Nhật Chủ nhược (thân nhược)', bazi: 'DM vượng suy thấp',
    xing: '补印比:方位 sinh-ta/đồng-hành +màu Ấn/Soái+ngành 印比(văn/giáo/y/đồng nghiệp)+danh hiệu bổ+tử thời tiền ngủ(Ấn=主眠)',
    xin: '知足守弱不逞强 — biết đủ, giữ nhược, không cưỡng cầu', ye: '补印=孝顺父母(Ấn=mẹ); 消耗身之业:ngừa tham+dục' },
  { when: 'Thất Sát vô chế (7sát công thân)', bazi: '杀重',
    xing: '印化杀(đọc sách/văn chuyển) hoặc 食制杀(kỹ nghệ/xuất sắc 1 nghề) 或 劫合杀(cạnh tranh chuyển hóa)',
    xin: '化压力为力 — biến áp lực thành lực', ye: '消嗔业+杀业(Thất Sát=嗔+杀象):nhẫn+phóng sinh' },
  { when: 'Tài đa thân nhược', bazi: '财旺身弱',
    xing: '比劫分财(hợp tác/đội ngũ)+không ôm đồm tiền+tài quản giao người tin',
    xin: '知足不贪 — biết đủ không tham', ye: '财布施 hóa tham 业 (舍财得财 — nghịch lý:cho đi=giàu)' },
  { when: 'Quan Sát hỗn tạp', bazi: '官杀混杂',
    xing: '去浊留清(một nghề chuyên tinh)+tránh thị phi/quan hệ phức tạp',
    xin: '清正守一 — thanh chính giữ một', ye: '修口业+忏悔 是非业' },
  { when: 'Thương Quan kiến Quan', bazi: '伤官见官',
    xing: '印制伤(đọc sách/kiên nhẫn)+tránh xung đột cấp trên',
    xin: '忍辱谦下 — nhẫn nhường khiêm hạ', ye: '消傲慢业+口业 (Thương Quan=kh傲/khẩu)' },
  { when: 'Phối ngẫu cung xung khắc (hôn nhân)', bazi: 'Spouse palace clash',
    xing: '晚婚(trễ)+chọn ngũ hành bổ+聚少离多 hóa khắc',
    xin: '柔和忍让 — mềm mỏng nhường nhịn', ye: '忏悔邪淫/破缘业+持观音/准提 cầu thiện duyên' },
  { when: 'Cách cục bại (败格)', bazi: '格局破',
    xing: '找救应(dụng thần+borrow vận)+tập trung 1 lĩnh vực',
    xin: '谦德 (满招损谦受益) — khiêm là thuốc nhanh nhất', ye: '大忏(八十八佛)+大积德 — bại cần BỔ LỚN' },
  { when: 'Ngũ hành thái quá (cực đoan)', bazi: 'wuxing extreme',
    xing: 'trung đạo+bổ hành đối lập+phong thủy cân',
    xin: '平心 không thái quá — bằng lòng,trung đạo', ye: 'tĩnh tọa+消「太過」之业' },
];

// ---------------------------------------------------------------------------
// 4. SÁM HỐI法门 (5法 —消业 ROOT) — mỗi pháp cho loại nghiệp/trường hợp
// ---------------------------------------------------------------------------
export const CHAN_HUI = [
  { name: '八十八佛大忏悔文', use: '日常功课/业障重/多病多障/修法不顺 — TỔNG CHUNG tội vô thủy,广忏', method: '诵八十八佛名+礼佛 — tụng 88 Phật danh + lạy' },
  { name: '金刚萨埵百字明咒', use: '密宗消业最快 — xóa nghiệp mau nhất (sau vi phạm giới,ngộ犯罪的)', method: '观想金刚萨埵+持百字明咒(21-108遍)+甘露洗净' },
  { name: '三十五佛忏悔', use: '别忏 — sám từng nghiệp cụ thể (theo 35 Phật)', method: '诵三十五佛名+发露 cụ thể nghiệp đã làm' },
  { name: '地藏占察忏', use: '不 sure nghiệp gì→占察轮 xem+忏悔 tương ứng', method: '占察(木轮)+得相+对应忏悔' },
  { name: '法华忏/大悲忏', use: '法华忏 — 法华经系; 大悲忏 — 观音系 (sám quanh đại bi)', method: '依法诵经+持咒+礼拜' },
];
export const CHANHUI_PRINCIPLE = 'Nghiệp chướng từ TÂM khởi → TÂM chuyển thì NGHIỆP tiêu. Sám hối = phát lộ (thừa nhận) + hối cải (không làm nữa) + hồi hướng. Sám thật =相续心 đổi (dòng tâm đổi) = nghiệp đã định cũng nhẹ chịu.';

// ---------------------------------------------------------------------------
// 5. 准提法门 (Liễu Phàm THẬT method — không platitude)
// ---------------------------------------------------------------------------
export const ZHUNTI = {
  principle: '云谷禅师传 Liễu Phàm —准提法门 + Công Qua Cách. 准提 = chuẩn đề (Buddha-mother of 7 kotis). 转世欲为道用 — KHÔNG bỏ đời sống thế tục mà CHUYỂN HÓA nó.',
  mantra: '准提咒 (Chuẩn Đề chú): «namo saptanam samyaksambuddha kotinam / tadyata / om cale cule cunde svaha» (念 21/108/1000遍/ngày)',
  how: '1) 持准提咒 (fixed số/ngày) + 2) 功过格 (sổ công–quá) + 3) 积善 (tích thiện cố định) + 4) 回向 (hồi hướng we школы). Liễu Phàm: 3000 công→con, 6000 công→tiến sĩ.',
  fit: 'ĐẶC BIỆT phù hợp người ĐỜI (không cần xuất gia): cầu con/con trai/công danh/tài —准提 đều ứng. Vì «không bỏ dục thế mà chuyển hóa».',
};

// ---------------------------------------------------------------------------
// 6. 经咒 TRỰC TIẾP THEO VẤN ĐỀ (7 map)
// ---------------------------------------------------------------------------
export const JING_ZHOU = [
  { problem: 'Bệnh / tai nạn / đoản mệnh', cure: '药师咒 + 药师经 + 药师佛 (12 đại nguyện —消病/延寿/拔灾)', method: '持「药师灌顶真言」+诵药师经+念南无消灾延寿药师佛,回向 chúng sanh ly bệnh' },
  { problem: 'Nghiệp chướng nặng / tổ tiên / quỷ thần chướng', cure: '地藏经 + 地藏菩萨 (thệ nguyện độ nghiệp/uổng)', method: '诵地藏经(1-7遍)+持地藏圣号,回向 tổ tiên/oan thân trái chủ' },
  { problem: 'Chấp trước / vô minh / cầu trí tuệ', cure: '金刚经 (4 câu kệ:一切有为法,如梦幻泡影...)', method: '日诵金刚经(1 phẩm or全经)+思维「凡所有相皆是虚妄」破 chấp' },
  { problem: 'Tai nạn / cấp khó', cure: '普门品 + 观世音菩萨', method: '诵普门品+持观音圣号,观音 32 ứng thân cứu nạn' },
  { problem: 'Ma chướng / tà chướng', cure: '楞严咒 (đầu đại chú, hàng ma)', method: '诵楞严咒心/全咒 — mạnh nhất hàng tà' },
  { problem: 'Nghèo / phúc mỏng', cure: '准提咒 + 财尊法 (黄财神/财度母)', method: '持准提咒+布施(舍财得财)+财尊仪轨,回向' },
  { problem: 'Khó có con / cầu tử', cure: '送子观音 + 普门品', method: '持观音+诵普门品+发愿养 dạy đứa trẻ thiện' },
];

// ---------------------------------------------------------------------------
// 7. 改心 5 BƯỚC + 4 CHÌA KHÓA CHUYỂN NIỆM (sâu nhất — TÂM là GỐC)
// ---------------------------------------------------------------------------
export const GAI_XIN = {
  principle: '心是命根 — TÂM là GỐC của MỆNH. 根净→果自转. 改心 =改命根, mau hơn改行 trăm lần.',
  steps: [
    { s: '觉 (giác)', d: 'BIẾT niệm đang khởi — quan sát tâm,đừng认同' },
    { s: '停 (đình)', d: 'DỪNG niệm xấu — nuốt 3 hơi / niệm Phật 1 câu / đếm 10' },
    { s: '转 (chuyển)', d: 'ĐỔI niệm (4 chìa khóa dưới)' },
    { s: '净 (tịnh)', d: 'RỖNG tâm — thiền / 准提 / 心经 / 清静经' },
    { s: '化 (hóa)', d: 'NGHIỆP tiêu,mệnh chuyển — 相续 tâm đã đổi = quả đổi' },
  ],
  keys4: [
    '顺受 — thuận chịu:đây là quả của nhân xưa,mang tiếp',
    '逆增上缘 — nghịch = thầy:càng khó càng nâng mình',
    '消业想 — nghĩ «đang trả nghiệp,đây là lúc tốt để trả»',
    '还债想 — nghĩ «mình nợ đời này,đây là lúc trả»',
  ],
};

// ---------------------------------------------------------------------------
// 8. 改命 vs 改运 — 3 TẦNG (表/中/深) — phân biệt để KHÔNG lẫn
// ---------------------------------------------------------------------------
export const GAI_LEVELS = [
  { lv: '改运 (cải vận)', obj: 'Vận / lưu niên / môi trường', depth: '表 — bề mặt', ease: '易 — dễ', methods: 'Phong thủy,phương vị,trạch nhật,màu,số,trang sức', time: '1–3 năm (cần tiếp tục điều)' },
  { lv: '改心+改行 (cải tâm+hành)', obj: 'Hành vi + thói quen tâm', depth: '中 — giữa', ease: '中', methods: 'Đổi thói quen,lựa chọn,phản ứng', time: '3–10 năm (lắng đọng)' },
  { lv: '改命 (cải mệnh)', obj: 'Bát tự cách cục / tiên thiên', depth: '深 — sâu', ease: '难 — khó', methods: '修心,消业,积德,忏业', time: 'Một đời đổi thế (không một sớm một chiều)' },
];
export const GAI_PRINCIPLE = '改运 = «điều khí trường, thuận lưu năm». 改命 = «đổi cách cục, đổi quỹ đạo». Giữa 2 cái靠 改心+改行 nối表 vào里. Phối hợp: 先改运 (cầm máu) + 改行 (đổi hướng) + 改心消业 (trị gốc).';

// ---------------------------------------------------------------------------
// 9. 道家法门 (khác Phật — trọng khí/thân/tự nhiên)
// ---------------------------------------------------------------------------
export const DAO_JIA = [
  { name: '太上老君说常清静经', principle: '清静心 =改命本 — TỊNH là gốc. «人能常清静,天地悉皆归»', method: '日诵清静经+观心清静' },
  { name: '内丹术 (nội đan)', principle: '炼精化气→炼气化神→炼神还虚→炼虚合道 — đổi tinh-khí-thần = đổi gốc mệnh', method: 'tu dần (cần chân truyền),đừng tự luyện bừa' },
  { name: '守一/服气/吐纳', principle: '守一 (giữ một) + 服气 (phục khí) + 吐纳 (thổ nạp) — dưỡng khí', method: 'tọa 15-30ph,tập trung đan điền,hít-thở buồn/bụng' },
  { name: '道法自然', principle: '不抗命而顺化,顺中改 — KHÔNG kháng mệnh mà thuận hóa,đổi trong thuận', method: 'nhận → thuận → hóa (không cưỡng)' },
];

// Giữ nguyên từ phiên bản cũ (vẫn dùng):
export const REMEDY_QUOTES = [
  { han: '命由我作，福自己求', vi: 'Mệnh do ta tạo, phúc do ta cầu.', src: 'Liễu Phàm Tứ Huấn' },
  { han: '祸福无门，惟人自召', vi: 'Họa phúc không cửa, người tự gọi (nhân quả).', src: 'Thái Thượng Cảm Ứng Thiên' },
  { han: '心好命也好，富贵直到老', vi: 'Tâm tốt+mệnh tốt → phú quý đến già (Tâm×Mệnh).', src: 'Tâm Mệnh Thi' },
  { han: '满招损，谦受益', vi: 'Kiêu đầy → tổn; khiêm nhường → nhận lợi.', src: 'Thượng Thư · Khiêm Đức' },
  { han: '天作孽犹可违，自作孽不可活', vi: 'Trời giáng họa còn tránh được; tự làm họa không sống nổi.', src: 'Thượng Thư · Thái Giáp' },
];

// ---------------------------------------------------------------------------
// COMPUTE
// ---------------------------------------------------------------------------

/**
 * ROOT DIAGNOSIS: map vấn đề lá số → ác nghiệp khả nghi (quá khứ) → giải nghiệp.
 * Đây là «bắt bệnh tận gốc» — KHÔNG platitude.
 */
export function getYeguoForChart(R) {
  const out = [];
  try {
    const gods = ['year','month','day','time'].map(p => R.chart?.pillars?.[p]?.ganGod).filter(Boolean);
    const str = R.strength || {}, yong = R.yong || {}, pq = R.patternQuality || {};
    const has = (g) => gods.includes(g);
    // 杀业 ← Thất Sát / 官 sát nặng / bệnh /血光
    if (has('七杀') || has('七殺')) out.push({ ...YEGUO[0], why: 'Thất Sát lộ → dấu 杀业 (nghiệp sát sinh) quá khứ —也许是 săn/bất sát/nghiệp liên mạng' });
    // 偷盗业 ← Tài phá / nghèo / bị lừa
    if ((R.wx?.score?.[yong?.primary] || 0) < 15 && /财|Tài/.test(JSON.stringify(yong||{}))) out.push({ ...YEGUO[1], why: 'Tài nhược/khuyết → dấu 偷盗业 (nghiệp trộm/lấy không nên lấy)' });
    // 邪淫业 ← phối ngẫu cung khắc / hôn nhân vỡ
    const dz = R.chart?.pillars?.day?.zhi;
    if (dz && /[冲克害]/.test(JSON.stringify(R.interactions||{}).slice(0,300))) out.push({ ...YEGUO[2], why: 'Phối ngẫu cung động/khắc → dấu 邪淫业 hoặc 破缘 nghiệp' });
    // 妄语+恶口 ← Thương Quan (khẩu/nghịch)
    if (has('伤官') || has('傷官')) out.push({ ...YEGUO[6], why: 'Thương Quan = khẩu/nghịch khí → dấu 口业 (lời ác/vô nghĩa)' });
    // 嗔业 ← Thất Sát / Kiếp Tài (cạnh tranh,sân)
    if (has('劫财') || has('七杀') || has('七殺')) out.push({ ...YEGUO[8], why: 'Kiếp/Thất Sát → dấu 嗔业 (sân hận)' });
    // bại cách → 业 chướng nặng tổng
    if (pq.quality === '败格') out.push({ karma: '业障 nặng tổng (cách bại)', result: 'cách cục vỡ = quả của nghiệp chướng tích', cure: '大忏(八十八佛/金刚萨埵)+大积德(败需补大)' });
  } catch (_) {}
  return out;
}

/**
 * 3-TẦNG hóa giải: form (外) + tâm (中) + nghiệp (gốc) theo từng vấn đề lá số.
 */
export function getRemedyForChart(R) {
  const out = { relevant: [], needLevel: 'trung' };
  try {
    const gods = ['year','month','day','time'].map(p => R.chart?.pillars?.[p]?.ganGod).filter(Boolean);
    const str = R.strength || {}, pq = R.patternQuality || {};
    const isWeak = str.strong === false;
    const hasSha = gods.includes('七杀') || gods.includes('七殺');
    const hasShang = gods.includes('伤官') || gods.includes('傷官');
    const hasJie = gods.includes('劫财');
    const bai = pq.quality === '败格';
    for (const h of BAZI_HUAJIE) {
      if (isWeak && /Nhật Chủ nhược/.test(h.when)) out.relevant.push(h);
      if (hasSha && /Thất Sát/.test(h.when)) out.relevant.push(h);
      if (hasShang && /Thương Quan/.test(h.when)) out.relevant.push(h);
      if (hasJie && /Tài đa/.test(h.when)) out.relevant.push(h);
      if (bai && /Cách cục bại/.test(h.when)) out.relevant.push(h);
    }
    out.needLevel = out.relevant.length >= 2 ? 'cao' : out.relevant.length === 1 ? 'trung' : 'thấp';
    if (!out.relevant.length) out.relevant = [BAZI_HUAJIE[0], BAZI_HUAJIE[6]]; // fallback:身弱+败 cách generic
  } catch (_) {}
  return out;
}

export function remedySummary(R) {
  const yk = getYeguoForChart(R);
  const rec = getRemedyForChart(R);
  const L = ['NGHỊCH THIÊN CẢI MỆNH (ROOT-LEVEL, không platitude):'];
  L.push('Nguyên lý: Mệnh = 先天 nghiệp quả. Cải mệnh = chuyển nghiệp. Tận gốc = 改心 + 消业 (sám hối). Lá số thấy QUỸ ĐẠO, không phải kết cục.');
  if (yk.length) {
    L.push('Bắt bệnh tận gốc (vấn đề → nghiệp nhân → thuốc):');
    for (const y of yk) L.push('  • ' + y.why + ' → ' + y.cure);
  }
  if (rec.relevant.length) {
    L.push('3 lớp hóa giải (形/心/业):');
    for (const h of rec.relevant) L.push('  • ' + h.when + ' | 形:' + h.xing + ' | 心:' + h.xin + ' | 业:' + h.ye);
  }
  return L.join('\n');
}

// ---------------------------------------------------------------------------
// KEEP từ phiên bản cơ bản (công cụ cụ thể, KHÔNG platitude):
// ---------------------------------------------------------------------------
export const TEN_THIEN = [
  { han: '与人为善', vi: 'Cùng người làm thiện', practice: 'Làm gương lành,khuyến khích người khác thiện' },
  { han: '爱敬存心', vi: 'Yêu kính giữ lòng', practice: 'Giữ tâm yêu+khíất trọng mọi người' },
  { han: '成人之美', vi: 'Thành cái đẹp cho người', practice: 'Giúp người hoàn thành việc tốt (không đố kỵ)' },
  { han: '劝人为善', vi: 'Khuyên người làm thiện', practice: 'Dẫn dắt người khác hướng thiện' },
  { han: '救人危急', vi: 'Cứu người nguy cấp', practice: 'Giúp lúc khó khăn nhất (tiền/sức/tâm)' },
  { han: '兴建大利', vi: 'Kiến dựng lợi lớn', practice: 'Việc lợi cộng đồng (cầu/đường/điện)' },
  { han: '捨财作福', vi: 'Xả của làm phúc', practice: 'Bố thí của cải (舍财得财 — nghịch lý:cho=giàu)' },
  { han: '护持正法', vi: 'Hộ trì chính pháp', practice: 'Bảo vệ/ủng hộ điều thiện chính' },
  { han: '敬重尊长', vi: 'Kính trọng bậc trên', practice: 'Kính cha mẹ/thầy/người lớn tuổi' },
  { han: '爱惜物命', vi: 'Yêu tiếc mạng vật', practice: 'Tránh sát sinh,trân trọng sự sống' },
];
export const REMEDY_METHODS = [
  { name: '准提法门 (ZhunTi)', how: '持准提咒 21/108/1000/ngày + 功过格', benefit: 'Liễu Phàm thật method — chuyển hóa dục thế,cầu con/công danh/tài' },
  { name: '消业忏悔 (sám hối)', how: '八十八佛忏悔/金刚萨埵百字明(21-108)', benefit: '消 nghiệp gốc — nghiệp tiêu mệnh chuyển' },
  { name: '放生+吃素 (phóng sinh+chay)', how: 'Lượng sức mua sinh vật thả+giảm sát', benefit: '消杀业 → thọ+bình an' },
  { name: '孝道 (hiếu)', how: 'Phụng dưỡng+vui lòng cha mẹ', benefit: '补印 (Ấn=mẹ) → cải gốc mệnh' },
  { name: '财布施 (tài bố thí)', how: 'Cho của cố định (先小额)', benefit: '舍财得财 — hóa tham nghiệp,cải tài vận' },
  { name: '净心静坐 (tịnh tâm)', how: 'Thiền 15-30ph/ngày + 心经/清静经', benefit: '心净业消 — cải tận gốc' },
];
export const CONG_QUA = {
  thien: [
    { a: 'Phóng sinh (cứu mạng)', p: 3 }, { a: 'Cứu người nguy cấp', p: 3 },
    { a: 'Giúp người khó khăn', p: 2 }, { a: 'Bố thí tiền/của', p: 2 },
    { a: 'Hiếu thuận cha mẹ', p: 2 }, { a: 'Làm thiện ẩn (âm chất)', p: 2 },
    { a: 'Ăn chay 1 ngày', p: 1 }, { a: 'Giữ lời,không dối', p: 1 },
    { a: 'Khuyên người làm thiện', p: 1 }, { a: 'Đọc/sao kinh +持咒', p: 1 },
  ],
  ac: [
    { a: 'Sát sinh (giết mạng)', p: 3 }, { a: 'Trộm cắp/lấy không nên lấy', p: 3 },
    { a: 'Dối trá/lừa gạt', p: 2 }, { a: 'Tà dâm', p: 2 }, { a: 'Không hiếu thuận', p: 2 },
    { a: 'Nói lời tổn thương', p: 1 }, { a: 'Uống rượu say', p: 1 },
    { a: 'Giận dữ mất kiểm soát', p: 1 }, { a: 'Đố kỵ/tham', p: 1 },
  ],
};
export const CHART_REMEDY = BAZI_HUAJIE; // alias (đỡ backward-compat)
export function meritLedger(logged) {
  const items = Array.isArray(logged) ? logged : [];
  let net = 0, thienN = 0, acN = 0;
  for (const e of items) {
    const table = e.type === 'ac' ? CONG_QUA.ac : CONG_QUA.thien;
    const match = table.find(x => x.a.toLowerCase().includes(String(e.action || '').toLowerCase()));
    const p = (match?.p || 1) * (Number(e.count) || 1);
    net += e.type === 'ac' ? -p : p;
    if (e.type === 'ac') acN += (Number(e.count) || 1); else thienN += (Number(e.count) || 1);
  }
  return { net, thienCount: thienN, acCount: acN,
    verdict: net >= 10 ? '★ Tích đức tốt — đang chuyển quỹ đạo (theo Liễu Phàm)' : net > 0 ? 'Tích tiểu thiện — tiếp tục' : net < 0 ? '⚠ Quá nặng hơn công — CẢI QUÁ (3 cấp tâm lý事)' : 'Cân bằng — hãy bắt đầu tích thiện' };
}
