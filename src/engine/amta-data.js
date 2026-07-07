// ============================================================================
//  ÂM TÀ / VONG HỒN / TRỪ TÀ — DATA MODULE (Bát Tự app)
//  Multi-school: 茅山 Mao Shan · 正一 Zheng Yi · 閭山 Lü Shan ·
//                台灣 收驚 · 港式 Hong Kong · 《道藏》canon
//  ============================================================================
//  ⚠ ETHICS / DISCLAIMER (MANDATORY — verbatim into SPEC.md too) ⚠
//  ----------------------------------------------------------------------------
//  · Toàn bộ nội dung trong file này là TÀI LIỆU THAM KHẢO VĂN HOÁ-TÔN GIÁO,
//    thu thập từ nhiều trường phái & khu vực. KHÔNG phải chẩn đoán y tế / tâm
//    thần / pháp lý, KHÔNG thay thế chuyên gia tâm lý, bác sĩ, hay đạo sĩ /
//    pháp sư thụ chức.
//  · KHÔNG bao giờ dùng ngôn ngữ tuyệt đối kiểu «bạn bị ma / bị quỷ / bị附身»,
//    KHÔNG dọa nạt, KHÔNG chẩn đoán «bị tà». Mọi tín hiệu dưới đây chỉ là
//    TƯỢNG / XÁC SUẤT theo cổ pháp, không chắc chắn.
//  · TÍNH NĂNG NÀY PHẢI LÀ OPT-IN: chỉ hiển thị khi user tự bật & xác nhận ≥1
//    lần; user có thể tắt bất cứ lúc nào.
//  · Các nghi lễ /神咒 / 符 nghiêm túc phải do đạo sĩ / pháp sư thụ chức (受箓
//    道士) chủ trì — app chỉ trình bày tri thức văn hoá, KHÔNG hướng dẫn tự làm.
//  · Có lưu ý biến thể theo trường phái / khu vực; mọi mục đều kèm ≥2 nguồn độc
//    lập (xem _sources[] / sources[]).
//  ----------------------------------------------------------------------------
//  PROVENANCE (xác minh chéo):
//    · V1 indicators, V2 spiritTypes, V3 Mao Shan, V4 Zheng Yi, V5 Lü Shan,
//      V6 Taiwan 收驚  → VERIFIED qua W12 verdict (docs/_fragments/W12-verdict.json),
//      mọi URL đã được verifier độc lập kiểm tra reachable & independent.
//    · V8 神咒 (5 chú)        → VERIFIED qua W8 fragment (docs/_fragments/W8-shenzhou.json),
//      Hán văn nguyên thuỷ khớp ctext/wikisource, verification_status=
//      verified_2plus_independent.
//    · V7 Hong Kong, V9 remedies, V10a Tử Vi, V10b ETHICS → assembled từ cùng
//      bộ nguồn canonical mà W12 đã xác nhận độc lập & reachable (ctext /
//      wikisource primary texts + baike + gov religion.moi.gov.tw / ihchina +
//      academic CUHK / FJU / Sinica / NTU / daoinfo). Chờ W13 verdict chéo
//      (chưa có trên disk lúc assembly) — W17/W18 cần đối chiếu.
//  ----------------------------------------------------------------------------
//  This file is STATIC DATA only: no fs/http, no side-effect, no lunar-javascript
//  import. Pure ES module data, code-ready. Verified by `node --check`.
//  Conventions follow src/engine/tang-data.js (sibling ethics-data module).
// ============================================================================

// ----------------------------------------------------------------------------
//  TOP-LEVEL ETHICS CONSTANT (mandatory, verbatim into docs/AM-TA-SPEC.md)
// ----------------------------------------------------------------------------
export const ETHICS = {
  optInRequired: true,
  disclaimerVi:
    'Nội dung «Âm Tà / Vong Hồn / Trừ Tà» chỉ là TÀI LIỆU THAM KHẢO VĂN HOÁ-TÔN GIÁO, tổng hợp từ nhiều trường phái (Mao Shan, Zheng Yi, Lü Shan, Đài Loan, Hồng Kông, 《道藏》). KHÔNG phải chẩn đoán y tế / tâm thần, KHÔNG thay thế bác sĩ, chuyên gia tâm lý, hay đạo sĩ / pháp sư thụ chức. Mọi «tty hiệu» dưới đây chỉ là TƯỢNG / xác suất theo cổ pháp — KHÔNG chắc chắn, KHÔNG dùng để dọa nạt. Nếu bạn đang đau khổ, mất ngủ kéo dài, hoang tưởng, hay có ý nghĩ tự hại, hãy liên hệ chuyên gia tâm lý / y tế hoặc đường dây hỗ trợ khẩn cấp. Tính năng chỉ hiển thị khi bạn tự bật (opt-in) và có thể tắt bất cứ lúc nào.',
  disclaimerEn:
    'This module is a CULTURAL / RELIGIOUS-STUDIES REFERENCE aggregated from multiple Daoist schools and regions. It is NOT medical, psychiatric, legal, or professional advice, and does NOT replace mental-health professionals or ordained 道士 / 法師. All “signals” below are classical symbolic/probabilistic patterns — never certain, never used to frighten. If you are in distress, insomnia, or at risk of self-harm, contact a qualified mental-health professional or emergency hotline. Opt-in only; disable anytime.',
  forbiddenAbsoluteClaims: [
    '«Bạn bị ma / bị quỷ theo / bị附身» (bất kỳ dạng tuyên bố chắc chắn nào)',
    '«Chắc chắn bạn bị tà / bà č三胺 / âm khí xâm»',
    'Chẩn đoán «bị tà» thay cho chẩn đoán y tế / tâm thần',
    'Dọa nạt, ép buộc mua dịch vụ / 符 / vật phẩm «trừ tà»',
    'Khẳng định một trường phái là «đúng nhất» / «duy nhất đúng»',
  ],
  toneRules: [
    'Luôn dùng ngôn ngữ «có thể / theo cổ pháp / một số trường phái cho rằng» — KHÔNG dùng «chắc chắn».',
    'Mỗi kết luận đều kèm caveat mềm hoá («đây chỉ là tín hiệu tượng, xác suất»).',
    'Hướng user đến sự cẩn trọng, thiện chí, khám sức khoẻ / tâm lý khi cần.',
    'Công bố nguồn (≥2 độc lập) cho mỗi mục; ghi nhận biến thể trường phái / khu vực.',
    'User có thể TẮT (opt-out) tính năng bất cứ lúc nào.',
  ],
  referralNote:
    'Với distress thật sự (mất ngủ kéo dài, hoang tưởng, lo âu nặng, ý nghĩ tự hại): ưu tiên chuyên gia tâm lý / y tế. Nghi lễ tôn giáo (nếu user muốn) nên do đạo sĩ / pháp sư thụ chức chủ trì.',
  ethicsSources: [
    'https://www.who.int/health-topics/mental-health (WHO mental health — không thay thế y tế)',
    'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (全國宗教資訊網 內政部 — khung trình bày tín ngưỡng dân gian)',
    'https://www.ihchina.cn/project_details/10219.html (中國非物質文化遺產 — khung văn hoá-tôn giáo)',
  ],
};

// ============================================================================
//  V1 — INDICATORS (signal layer) · shape: {indicator, condition, meaning, strength, sources[]}
//  Canonical basis: 《三命通会》《渊海子平》神煞 sections. strength 1-5 (5 = strongest
//  classical attestation of the *symbol*, NOT of any real-world outcome).
//  All entries VERIFIED via W12 verdict (docs/_fragments/W12-verdict.json).
// ----------------------------------------------------------------------------
export const indicators = [
  {
    id: 'huagai-taiyin',
    indicator: '華蓋 + 太陰 (Hoa Cái + Thái Âm)',
    condition: 'Trụ ngày/trụ năm gặp sao Hoa Cái đồng thời can/chỉ mang Thái Âm (丁/己/辛/癸) — đặc biệt nhật chủ tọa Hoa Cái thuộc âm.',
    meaning: 'Cổ pháp luận người mang Hoa Cái dễ hướng nội, cô độc, hợp với tôn giáo/huyền học; ghép Thái Âm thì tăng chiều «âm lạnh». Theo《三命通会》: «華蓋者…多主孤寡». Là TƯỢNG tâm hướng/đạo tính, KHÔNG phải «bị ma».',
    strength: 4,
    sources: [
      'http://chanweitang.com/post/83.html (阐微堂 — trích nguyên văn 三命通會: «華蓋者，喻如寶蓋…多主孤寡»)',
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261 (百度百科 命理神煞)',
      'https://book.taiyi.me/%E5%91%BD/%E7%A5%9E%E7%85%9E%E5%A4%A7%E5%85%A8 (太乙書局 神煞大全)',
    ],
  },
  {
    id: 'guchen-guasu',
    indicator: '孤辰寡宿 (Cô Thần · Quả Tú)',
    condition: 'Tra theo năm chi — nhóm TAM HỘI PHƯƠNG (季, KHÔNG phải tam hợp): 寅卯辰 (Xuân) gặp Tỵ (孤辰) & Sửu (寡宿); 巳午未 (Hạ) gặp Thân (申) & Thìn; 申酉戌 (Thu) gặp Hợi (亥) & Mùi (未); 亥子丑 (Đông) gặp Dần (寅) & Tuất (戌). [loop 1383 FIX: bản draft nhầm nhóm tam hợp — chuẩn《渊海子平》dùng tam hội phương.]',
    meaning: 'Cổ pháp chủ cô độc / khó duyên vợ chồng; dân gian gắn với cảm thức «cô đơn / dễ lay động tâm linh». Là thần sát chủ nhân duyên, KHÔNG phải tín hiệu «âm theo».',
    strength: 4,
    sources: [
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3 (維基文庫 淵海子平 — primary)',
      'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb (ctext 淵海子平 — primary, host độc lập)',
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261',
    ],
  },
  {
    id: 'diaoke',
    indicator: '弔客 / 喪門弔客 (Điếu Khách)',
    condition: 'Lưu niên/tháng gặp Điếu Khách (太歲後二位) hoặc喪門 (太歲前二位); hoặc tọa thủ nguyên cục.',
    meaning: 'Trong hệ 12 lưu niên thần sát, chủ điếu tang / hiếu phục / hình thương người lớn tuổi & trẻ nhỏ. Liên quan dân gian đến «tháng cô hồn / việc tang». Chỉ là thần sát lưu niên tượng, KHÔNG đoán chắc «năm nay có tang».',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E4%B8%A7%E9%97%A8%E3%80%81%E5%90%8A%E5%AE%A2/22937868 (百度百科 喪門弔客 — 太歲十二神煞)',
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3',
      'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb',
    ],
  },
  {
    id: 'sifei',
    indicator: '四廢 (Tứ Phế)',
    condition: 'Xuân: Canh Thân / Tân Dậu; Hạ: Nhâm Tý / Quý Hợi; Thu: Giáp Dần / Ất Mão; Đông: Bính Ngọ / Đinh Tị — ngày can chi vô khí (khắc tiết quá mức).',
    meaning: 'Cổ pháp chủ khí lực suy kiệt, «dễ bị tà khí xâm» theo quan niệm «chính khí hư thì tà dễ khách». Là luận đoán khí-thế, KHÔNG phải chẩn đoán «bị tà».',
    strength: 3,
    sources: [
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3 (淵海子平 — 四廢 thuộc chương 神煞)',
      'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb',
      'https://www.scribd.com/document/835025737 (神煞整理與分析)',
    ],
  },
  {
    id: 'yinchayangcuo',
    indicator: '陰差陽錯 (Âm Sai Dương Thoái)',
    condition: '12 ngày: Bính Tý · Đinh Mão · Mậu Ngọ · Kỷ Dậu · Canh Dần · Tân Tị · Nhâm Thân · Quý Hợi · Ất Sửu · Mậu Thìn · Tân Mùi · Giáp Tuất (bản 12 ngày phổ biến).',
    meaning: 'Cổ pháp chủ «âm-dương giao tiếp sai lệch», dân gian gắn với việc cúng tế / hiếu / hôn nhân bất lợi. Là luận đoán nhân duyên / việc âm sự, KHÔNG đoán «bị vong theo».',
    strength: 4,
    sources: [
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3 (verbatim: «又看孤鸞之日、陽錯陰錯，主剋妻»)',
      'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb',
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261',
    ],
  },
  {
    id: 'taiyuan-meet-mo',
    indicator: '胎元 gặp 辰戌丑未 (mộ / 四庫)',
    condition: 'Thai nguyên (胎元 = tháng sinh + 9 can-chi) trúng một trong 辰/戌/丑/未 (tứ mộ /四庫).',
    meaning: 'Thai nguyên là «gốc tiền thân» theo《三命通會》 («胎元者，受胎之月也»); gặp四庫 thì dân gian luận «dễ感应 việc âm / tiền nhân». Là quy tắc PHÁI SINH (derived) từ «thai nguyên» + «tứ mộ», KHÔNG phải thần sát độc lập.',
    strength: 3,
    sources: [
      'https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%85%A8%E8%A6%BD (三命通會 verbatim «胎元者，受胎之月也»)',
      'https://ctext.org/wiki.pl?if=gb&chapter=850832 (ctext 三命通會 卷十二)',
      'https://baike.baidu.com/item/%E8%83%8E%E5%85%83%E5%91%BD%E5%AE%AE/4629187',
    ],
  },
  {
    id: 'rizhuo-weak-guansha-strong',
    indicator: '日主 nhược + 官殺 vượng (nhật chủ nhược, quan sát vượng)',
    condition: 'Nhật chủ (đêm can sinh) nhược trong khi 七殺 / 正官 vượng (đắc lệnh / đắc thế), thiếu ấn tinh hoá giải.',
    meaning: 'Cổ pháp luận «thân nhược rồi quan/sát nặng → dễ sợ hãi, áp lực»; dân gian suy rộng «dễ bị tà ». Là nền tảng 日主 + 十神 (quan/sát) của 淵海子平/三命通會, KHÔNG phải thần sát riêng.',
    strength: 4,
    sources: [
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3',
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261',
      'https://ichingquest.com/zh-CN/fortune/bazi/shensha',
    ],
  },
  {
    id: 'guiyue-7th-month',
    indicator: 'Tháng 7 âm lịch (鬼月 / 中元)',
    condition: 'Tháng 7 âm lịch — đặc biệt 15/7 (中元節); dân gian kiêng kỵ cưới hỏi, dém nhà, đi đêm, đi biển.',
    meaning: 'Theo tín ngưỡng phổ độ cô hồn (中元 / 盂兰盆), tháng «quỷ môn mở». Đây là TÍN NGƯỠNG VĂN HOÁ được liệt kê di sản quốc gia — không phải dấu hiệu cá nhân «bị theo».',
    strength: 4,
    sources: [
      'https://zh.wikipedia.org/zh-cn/%E4%B8%AD%E5%85%83%E7%AF%80 (維基百科 中元節)',
      'https://www.ihchina.cn/project_details/10219.html (中國非物質文化遺產網 — quốc gia)',
      'https://www.mwr.org.tw/tw_religion/ritual/7-15.htm (世界宗教博物館)',
    ],
  },
  {
    id: 'jiesha-wangshen',
    indicator: '劫煞 / 亡神 (Kiếp Sát · Vong Thần)',
    condition: 'Kiếp sát = ngũ hành tuyệt處 (Dần-Thân-Tỵ-Hợi); Vong thần = ngũ hành lộccommands (臨官). Tra theo năm chi / ngày chi.',
    meaning: 'Theo《三命通會》卷十二: «劫煞為災不可當…» / «亡神吉則峻歷有威…». Dân giao gắn «vong thần» với «dễ感应 vong linh»; cổ pháp gốc là luận đoán tai hoạ / tâm tính. strength cao vì có trích nguyên văn.',
    strength: 5,
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=850832 (ctext 三命通會 卷十二 — primary)',
      'https://www.8bei8.com/book/sanmingtonghui_51.html (三命通會 劫煞亡神詳解 — verbatim «劫煞為災不可當»)',
      'https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%85%A8%E8%A6%BD',
    ],
  },
  {
    id: 'pure-yin-bazi',
    indicator: '八字 thuần âm (thuần Âm) / thuần dương',
    condition: 'Cả 4 trụ (8 can chi) đều mang tính ÂM (hoặc tất cả DƯƠNG).',
    meaning: 'Theo cổ pháp,八字 thiên về một cực (thuần âm/dương) thì «khí thế bất bình», dân gian gắn thuần âm với «dễ cảm âm». Đây là thuộc tính KẾT CẤU của tứ trụ — derived rule, KHÔNG phải thần sát độc lập.',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261',
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3',
      'https://ichingquest.com/zh-CN/fortune/bazi/shensha',
    ],
  },
  {
    id: 'pure-yin-day-hour',
    indicator: 'Ngày / giờ thuần âm',
    condition: 'Cả can+chi của ngày (hoặc giờ) đều âm (vd Ất Sửu, Đinh Mão, Kỷ Tỵ, Tân Mùi, Quý Dậu, Ất Hợi…).',
    meaning: 'Dân gian kiêng tiến hành nghi lễ «rước dương» vào ngày/giờ thuần âm; ngược lại một số nghi «an vong / độ âm» lại chọn giờ thuần âm. Là thuộc tính can-chi, KHÔNG đoán «bị tà».',
    strength: 3,
    sources: [
      'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3',
      'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb',
      'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261',
    ],
  },
];

// ============================================================================
//  V2 — SPIRIT TYPES (types layer) · shape: {type, definition, origin, signs[], distinctFrom[], sources[]}
//  All categories VERIFIED via W12 verdict. IMPORTANT: 嬰靈 là phát triển DÂN GIAN
//  HIỆN ĐẠI (Đài Loan ~1970s), KHÔNG phải Phật kinh / Đạo tạng cổ — phải ghi rõ.
// ----------------------------------------------------------------------------
export const spiritTypes = [
  {
    id: 'xianling-ancestors',
    type: '先靈 / 家先 (vong tiên linh / tổ tiên nhà mình)',
    definition: 'Linh hồn người thân đã khuất trong dòng họ, được con cháu thờ cúng. Khái niệm bắt nguồn từ quan niệm «linh hồn bất diệt» + «tổ tiên thần崇拜».',
    origin: 'Tín ngưỡng tổ tiên (Trung / Đài / Việt), đặc biệt mạnh ở Mân Nam / Đài Loan / Việt Nam («gia tiên»).',
    signs: ['Giấc mơ thấy người khuất', 'Cúng giỗ không đủ lễ theo truyền thống', 'Sự trùng hợp ngày giỗ'],
    distinctFrom: ['野鬼 (chưa có người thờ)', '怨靈 (có oan / chưa giải quyết)'],
    regionalNote: '«家先» là danh xưng vùng Mân Nam / Đài Loan / Việt cho tổ tiên nhà mình; cùng ý nghĩa với «先靈».',
    sources: [
      'https://www.chinesefolklore.org.cn/web/index.php?NewsID=8313 (中國民俗學網 — 周星〈祖先崇拜與民俗宗教〉 học thuật)',
      'https://baike.baidu.com/item/%E7%A5%96%E5%85%88%E7%A5%9E%E5%B4%87%E6%8B%9C/1429953 (百度百科 祖先神崇拜)',
      'https://www.cnki.com.cn/Article/CJFDTotal-RELI201202013.htm (CNKI 《世界宗教文化》)',
    ],
  },
  {
    id: 'hengwang-yuanling',
    type: '橫亡 / 怨靈 (chết oan / oán linh)',
    definition: 'Linh hồn người chết非自然 (橫亡) hoặc mang oan khuất chưa消 (怨靈).',
    origin: 'Tử hình, nạn, tự vẫn, tai nạn — 「因含冤而死，怨氣未消」. Là đối tượng chính của phép «普度» (中元).',
    signs: ['Dân gian tin «chưa到 hạn» nên vương vấn', 'Liên quan đến nơi xảy ra sự việc'],
    distinctFrom: ['先靈 (có con cháu thờ)', '嬰靈 (riêng thai nhi)'],
    sources: [
      'https://zh.wikipedia.org/zh-cn/%E5%AC%B0%E9%9D%88 (維基百科 — framework 怨靈 / 嬰靈)',
      'https://blog.udn.com/frankjin/109747484 (林金郎文學網 — 道教學者: «就跟一般怨靈一樣，因為有怨…»)',
      'https://www.ihchina.cn/project_details/10219.html (中元普渡 — corpus 橫亡/怨靈)',
    ],
  },
  {
    id: 'yingling',
    type: '嬰靈 / 靈嬰 (thai nhi bị đổ/hư thai)',
    definition: 'Linh hồn thai nhi do nạo phá / hư thai. LÀ PHÁT TRIỂN DÂN GIAN HIỆN ĐẠI (Đài Loan ~thập niên 1970, sau Luật ưu sinh保健 1970s), KHÔNG có trong 佛經 (chỉ có «中陰身») và KHÔNG phải Đạo tạng cổ. Có thể chịu ảnh hưởng văn hoá Nhật Bản (水子 mizuko).',
    origin: 'Phật giáo dân gian hoá + Đạo giáo 度亡 pháp hiện đại tại Đài Loan / Nhật.',
    signs: ['Theo truyền thống dân gian Đài Loan: giấc mơ trẻ em, tiếng khóc', 'CHỈ là tín ngưỡng dân gian, không phải chân lý giáo lý'],
    distinctFrom: ['中陰身 (khái niệm Phật giáo chính thống)', '先靈 (người lớn đã khuất)'],
    modernityFlag: 'KHÔNG trình bày như cổ điển — đây là phát triển ĐÀI LOAN HIỆN ĐẠI.',
    sources: [
      'https://zh.wikipedia.org/zh-cn/%E5%AC%B0%E9%9D%88 (維基百科 嬰靈 — lịch sử Đài Loan 1970s)',
      'https://baike.baidu.com/item/%E7%81%B5%E5%A9%B4/18593858 (百度百科 靈嬰)',
      'https://www.chaoduren.com/articles/daoist-reincarnation-yingling/ (道教 承負 學術解讀)',
    ],
  },
  {
    id: 'yegui',
    type: '野鬼 / 孤魂野鬼 (cô hồn, vong vất vưởng)',
    definition: 'Linh hồn không có con cháu cúng tế (孤魂), lang thang (野鬼). Là đối tượng cốt lõi của lễ 中元 / 普度.',
    origin: 'Tín ngưỡng «không người thờ cúng → vất vưởng», phổ biến toàn vùng Hoa — Việt.',
    signs: ['Dân gian tin «thích hội ở chỗ tối / u âm»', 'Được «thỉnh» trong lễ cúng cô hồn (15/7 âm)'],
    distinctFrom: ['先靈 (có con cháu)', '家先 (tổ tiên nhà mình)'],
    sources: [
      'https://zh.wikipedia.org/zh-cn/%E4%B8%AD%E5%85%83%E7%AF%80 (中元普渡 孤魂野鬼)',
      'https://www.ihchina.cn/project_details/10219.html',
      'https://www.mwr.org.tw/tw_religion/ritual/7-15.htm',
    ],
  },
  {
    id: 'yaoxie-jingguai',
    type: '妖邪 / 精怪 (yêu tà, tinh quái)',
    definition: 'Theo《崆峒問答》(đạo giáo quy phạm): «物之性靈為精 / 神靈不正為邪» — vật có tính linh thành «tinh», thần linh bất chánh thành «tà». Bao gồm 魍魅 / 山魈 / 木客 / 妖狐 / 五通.',
    origin: 'Vạn vật hữu linh修炼 thành tinh (tinh quái), hoặc thần bất chánh.',
    signs: ['Dân gian tin «hóa người / quấy nhiễu»', 'Gắn với nơi vắng / cổ thụ / hang sâu'],
    distinctFrom: ['先靈 (người khuất)', '野鬼 (linh hồn người)'],
    sources: [
      'https://wapbaike.baidu.com/tashuo/browse/content?id=043d1618d1316e42b7b8ab75 (《崆峒問答》 định nghĩa quy phạm)',
      'http://www.rsd.fju.edu.tw/images/3-03-Jaike_Liu.pdf (輔仁大學學術 PDF 宗教中的神異與鬼怪)',
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (全國宗教資訊網 內政部 驅逐 page — gov)',
    ],
  },
];

// ============================================================================
//  V3 — MAO SHAN (茅山) · shape: {school, ritual_name, items[], steps[], incantation_text, incantation_meaning, sources[]}
//  School & items VERIFIED via W12. INCANTATION TEXT = CONDITIONAL (W12 flag):
//  «bất kỳ 口訣 nào KHÔNG tìm thấy verbatim trong 茅山志 phải bị REJECT hoặc ghi
//  ‘cultural reference, perform by ordained 道士 only’». Do đó incantation_text
//  dưới đây KHÔNG bịa verbatim — nó chỉ dẫn đến 八大神咒 đã xác minh (W8) làm
//  lớp诵读 chung, và ghi rõ cần đạo sĩ thụ chức.
// ----------------------------------------------------------------------------
export const ritualsMaoShan = [
  {
    id: 'maoshan-quxie-shouyao',
    school: '茅山 Mao Shan (thuộc Thượng Thanh phái / Đạo tạng DZ0304 茅山志 33 quyển)',
    ritual_name: '茅山 驅邪 / 收妖 (trừ tà, thu yêu)',
    items: ['朱砂 (chu sa)', '黃紙 (giấy vàng)', '桃木劍 (kiếm gỗ đào)', '令旗 (cờ lệnh)', '帝鐘 (chuông Đế — dùng trong法事)'],
    fuStructure: 'Phần符 structure (mô tả, KHÔNG vẽ): 符頭 (đầu — chỗ triệu thần) · 符身 (thân — nội dung yêu cầu) · 符膽 (đởm — «cốt lõi» linh lực) · 符腳 (chân — kết/phục). Cộng罡步 (bước cương) — mô tả hình thái, không hướng dẫn tự thực hành.',
    steps: [
      '1) Tịnh đàn — 设坛, thắp灯/香, niêm水 (lấy淨水).',
      '2) Thỉnh thần — mời thượng đế / bản tôn / thánh positions.',
      '3) Khải 符 — if write符: chu sa +黃紙, theo«表黃紙朱砂書之».',
      '4) Đạp罡 bộ — bước cương (chỉ đạo sĩ tập luyện).',
      '5) Tụng八大神咒 (xem V8) — lớp诵读 chuẩn đạo giáo, đã xác minh.',
      '6) Tá符 / an vị — kết法事.',
    ],
    incantation_text:
      '[CULTURAL REFERENCE — KHÔNG trích verbatim 口訣 riêng của Mao Shan: theo W12 flag, bất kỳ 口訣 nào chưa đối chiếu字-by-byte với 茅山志 phải bị REJECT. Lớp诵读 dùng 八大神咒 đã xác minh (xem V8 神咒).]',
    incantation_meaning:
      'Triệu thỉnh thần tướng (Thiên Đinh, Thiên Phùng…) trừ tà, thu yêu, hộ đàn. Thực hành nghiêm túc phải do 受箓道士 (đạo sĩ thụ cấp) chủ trì.',
    performanceCaveat: 'cultural reference, perform by ordained 道士 only.',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=497389 (ctext 茅山志 — 元 劉大彬 15 quyển)',
      'https://zh.wikisource.org/wiki/%E8%8C%85%E5%B1%B1%E5%BF%97 (維基文庫 茅山志)',
      'https://www.shidianguji.com/zh/book/DZ0304 (識典古籍 茅山志 DZ0304 道藏 33 quyển)',
      'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687 (國家文化記憶庫 黃劉源抄 道教茅山派符籙)',
      'https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb (ctext 辰州符咒大全 «表黃紙朱砂書之»)',
    ],
  },
];

// ============================================================================
//  V4 — ZHENG YI (正一 / 天師道, Longhu Shan) · shape: {school, ritual_name, items[], steps[], meaning, sources[]}
//  符籙 / 拜斗 (北斗-南斗) / 解厄 — VERIFIED via W12 incl. PRIMARY CANON 北斗經.
// ----------------------------------------------------------------------------
export const ritualsZhengYi = [
  {
    id: 'zhengyi-baidou',
    school: '正一派 Zheng Yi (天師道 / Longhu Sơn). 拜斗 = lễ thờ北斗/南斗.',
    ritual_name: '正一 拜斗 (禮斗) — Bắc Đẩu / Nam Đẩu',
    items: ['斗燈 (đăng lễ)', '斗姥 / 北斗七星 card', '五斗真經 / 星辰寶懺', '米 (gạo «tinh»)', '鏡 / 剪 / 尺 (tứ法器)'],
    steps: [
      '1) Sắp斗壇 — đặt斗燈 tượng 徵 tinh.',
      '2) Tụng《北斗本命延生真經》(五斗經) — primary canon.',
      '3) Xưng 本命 / 生辰 để對應 bản命星 (60 甲子 → 60 太歲 / 北斗本命).',
      '4) Sám hối — «懺悔消災…削落三災九厄».',
      '5) Hồi hướng — giải hạn (解厄), diên sinh (延生).',
    ],
    meaning: '«北斗主死，南斗主生» — lễ的目的 là giải hạn / diên sinh / độ cho bản mạng & người nhà. 北斗經 = kinh sớm nhất của hệ 五斗經.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (PRIMARY CANON 北斗本命延生真經)',
      'https://baike.baidu.com/item/%E5%8C%97%E6%96%97%E7%BB%8F/4081312 (百度百科 北斗經)',
      'https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97 (道教文化中心 拜斗)',
      'https://dao.crs.cuhk.edu.hk/Main/wp-content/uploads/2022/09/DAO14_05_%E6%96%BD%E7%A7%A6%E7%94%9F.pdf (CUHK DAO 五斗經 academic)',
    ],
  },
  {
    id: 'zhengyi-jiee',
    school: '正一派 Zheng Yi',
    ritual_name: '正一 解厄 (giải hạn)',
    items: ['北斗經', '符籙 giải hạn', '本命 元辰card'],
    steps: ['1)礼斗 / 诵北斗經', '2)«懺悔消災…削落三災九厄»', '3)Thư符 giải hạn (do đạo sĩ)'],
    meaning: 'Giải «三災九厄» (loại hạn) bằng sám hối +诵 kinh + 符.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (verbatim «懺悔消災…削落三災九厄»)',
      'https://www.sctayi.com/front/bin/ptdetail.phtml?Part=corner-01-02-01&Category=15253 (九陽道善堂 禮斗科儀)',
    ],
  },
  {
    id: 'zhengyi-lu',
    school: '正一派 Zheng Yi (符籙派)',
    ritual_name: '正一 符籙 (Lu — hệ thống符)',
    items: ['斗口魁神符', '樞上將符', '六十甲子靈官符', '朱砂 / 黃紙'],
    steps: ['1)Thụ箓 (đạo sĩ thụ cấp) mới được书符', '2)Khai光 / 念咒注入', '3)Phân phát / an vị'],
    meaning: '正一 là «符籙派» — hệ thống符 được truyền thụ trong giới đạo sĩ thụ cấp, không tự书.',
    sources: [
      'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符釋例)',
      'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗)',
    ],
  },
];

// ============================================================================
//  V5 — LÜ SHAN (閭山) · 法主真君 / 陳靖姑 (三奶) · shape: {school, ritual_name, items[], steps[], meaning, sources[]}
//  VERIFIED via W12 incl.國家級非遺 listing (2008).
// ----------------------------------------------------------------------------
export const ritualsLuShan = [
  {
    id: 'lushan-fazhu-chenjinggu',
    school: '閭山派 Lü Shan (Lushan) —法主真君 / 三奶 (陳靖姑 · 林九娘 · 李三娘)',
    ritual_name: '閭山 收驚 / 驅邪 / 救產護胎',
    items: ['牛角 (tù và — tính法器)', '法索 / 蛇鞭 (thường biểu trưng Xà thần)', '令旗', '香 / 米', '符 (閭山法)'],
    steps: [
      '1)Khởi壇 — thỉnh法主真君 / 三奶.',
      '2)Niêm牛角 / pháp索 — khu tà.',
      '3)收驚 / an魂 (gọi hồn về).',
      '4)Đặc biệt: 救產護胎 (bảo vệ sản phụ) — đặc trưng của 三奶.',
      '5)Phù / an vị — kết法事.',
    ],
    meaning: '閭山/三奶 là trường phái phổ biến ở Mân / Đài / Việt, mạnh về 收驚, khu tà, và bảo vệ sản phụ — liên quan truyền thuyết陳靖姑 cứu thai.',
    regionalNote: '陳靖姑信俗 = 國家級非物質文化遺產 (2008, Trung Quốc). Đài Loan có 130+ đền thờ chính.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E8%87%A8%E6%B0%B4%E5%A4%AB%E4%BA%BA (維基百科 臨水夫人 = 陳靖姑)',
      'https://baike.baidu.com/item/%E4%B8%89%E5%A5%B6%E5%A4%AB%E4%BA%BA/1043322 (百度百科 三奶夫人)',
      'https://zh.daoinfo.org/index.php?title=%E9%96%AD%E5%B1%B1%E6%B4%BE (道教文化中心 閭山派)',
    ],
  },
];

// ============================================================================
//  V6 — TAIWAN 收驚 · shape: {ritual_name, items[], steps[], practitioner, variants, sources[]}
//  VERIFIED via W12 — STRONGEST sourcing (gov + Academia Sinica + NTU + temple).
// ----------------------------------------------------------------------------
export const ritualsTaiwanShoujing = [
  {
    id: 'taiwan-shoujing',
    ritual_name: '台灣 收驚 (喊驚 / 硩驚 / 收魂 / 叫魂 —招魂 / 安魂)',
    items: ['米 (gạo — thường dùng để«đếm hồn»)', '香 (hương)', '受驚者衣物 (quần áo người bị惊)', '收驚符 (nếu có)'],
    steps: [
      '1)受驚者 mặc / cầm quần áo của mình, ngồi trước壇.',
      '2)Practitioner niệm khẩn, dùng香 / 米 «gọi hồn» về 3 hồn / 7 phách.',
      '3)An hồn — vuốt / phủi theo kinh lạc.',
      '4)Đôi khi phát收驚符 / chỉ dẫn cúng gia.',
    ],
    practitioner: '收驚婆 (đạo bà — đặc trưng 行天宮), 道長 (đạo sĩ), 法師. Có cả chùa / miếu (行天宮, 保安宮) và thực hành tại gia.',
    variants: ['Chùa / miếu (đomány lớn, miến phí — 行天宮)', 'Tại gia (cá nhân / 收驚婆)', 'Biến thể閭山 / 正一 theo dòng đạo'],
    meaning: '«安魂» — đưa hồn phách về trạng thái ổn định sau khi «著驚» (bị惊). KHÔNG phải chẩn đoán / thay thế tâm lý y tế.',
    sources: [
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=6 (全國宗教資訊網 內政部 GOV)',
      'https://tdr.lib.ntu.edu.tw/handle/123456789/97051?mode=full (臺灣大學碩博論文 «魂魄猶可知»)',
      'https://www.ioe.sinica.edu.tw/ (中研院 民族學研究所 張珣)',
      'https://www.baoan.org.tw/paper.php?action=show&id=11&lang=tw (大龍峒保安宮 收驚 法術醫療)',
      'https://www.airitilibrary.com/Publication/Index/17277647-200904-201411250017-201411250017-198-225 (行天宮 收驚婆 học thuật)',
    ],
  },
];

// ============================================================================
//  V7 — HONG KONG 港式 · shape: {ritual_name, items[], steps[], school_or_context, sources[]}
//  Assembled từ canonical sources (W13 verdict chưa trên disk). Sources rút từ
//  cùng bộ host W12 đã vetted: CUHK DAO academic + gov + 風水 / 化煞 baike/wiki.
// ----------------------------------------------------------------------------
export const ritualsHongKong = [
  {
    id: 'hk-fengshui-huasha',
    ritual_name: '港式 風水 化煞 (hóa煞 — kirin object-level)',
    items: ['八卦鏡 (gương bát quái)', '葫蘆 (bầu — đồng / thiên nhiên)', '石獅 / 麒麟', '五帝錢 / 古銅錢', '凸鏡 / 凹鏡'],
    steps: [
      '1)Nhận diện 煞氣 (型煞 — «đối đầu», «trực xung», «ác sát»…).',
      '2)Đối trị bằng vật phẩm «hóa / Reflect / thu» (gương = phản xạ, bầu = thu/hóa,獅 = trấn).',
      '3)An vị đúng hướng — thường do thầy phong thuỷ xem.',
    ],
    school_or_context: '港式風水 (Cantonese / HK phong thuỷ) — kết hợp hình峦 + pháp器. KHÔNG thay thế tư vấn chuyên gia.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%A3%8E%E6%B0%B4 (維基百科 風水 — hệ thống 化煞 / 法器)',
      'https://dao.crs.cuhk.edu.hk/ (香港中文大學 DAO Daoist Studies — academic)',
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (全國宗教資訊網 內政部 驅逐 — gov)',
    ],
  },
  {
    id: 'hk-daoguan-quxie',
    ritual_name: '港式 道館 驅邪 / 淨宅 / 開光',
    items: ['燈 (đăng)', '香 (hương)', '符 (phù)', '淨水 (nc tịnh)', '法器 (chuông / mộc dược)'],
    steps: [
      '1)Khai壇 — thỉnh thần.',
      '2)Tịnh水 / tịnh đàn (dùng淨水 + 八大神咒).',
      '3)Thư符 / 開光 (phép«khai sáng» vật phẩm thánh).',
      '4)Hồi hướng — chấm dứt法事.',
    ],
    school_or_context: '港式 道館 (HK đạo quán) — thường thuộc 正一 / 全真 dòng. Phép 開光 /驅邪 do đạo sĩ chủ trì.',
    sources: [
      'https://dao.crs.cuhk.edu.hk/Main/wp-content/uploads/2022/09/DAO14_05_%E6%96%BD%E7%A7%A6%E7%94%9F.pdf (CUHK DAO academic — 道教科儀)',
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (八大神咒 — lớp诵读 chuẩn)',
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (gov 驅逐 framework)',
    ],
  },
];

// ============================================================================
//  V8 — 《道藏》CANON 神咒 (Tang-Song) · shape: {name, han_text, vi_translation, meaning, use, sources[]}
//  VERIFIED qua W8 fragment (docs/_fragments/W8-shenzhou.json). Hán văn nguyên
//  thuỷ khớp ctext/wikisource; verification_status = verified_2plus_independent.
//  洞渊神咒 = TEXTUAL UNCERTAINTY (không phải单固定短咒), đã flag rõ.
// ----------------------------------------------------------------------------
export const shenzhou = [
  {
    id: 'JIN_GUANG_ZHOU',
    name: '金光神咒 (金光咒) — Chú Kim Quang',
    han_text: '天地玄宗，万炁本根。广修亿劫，证吾神明。三界内外，惟道独尊。体有金光，覆映吾身。视之不见，听之不闻。包罗天地，养育群生。诵持万遍，身有光明。三界侍卫，五帝司迎。万神朝礼，役使雷霆。鬼妖丧胆，精怪亡形。内有霹雳，雷神隐名。洞慧交彻，五炁腾腾。金光速现，覆护真人。',
    vi_translation: 'Trời Đất là cội nguồn huyền diệu, vạn khí đều bắt nguồn từ đây. Tu tập qua muôn kiếp, chứng lấy thần thông. Trong ngoài Tam giới, chỉ Đạo là tôn. Thân ta có ánh sáng vàng, bao phủ chiếu soi. Nhìn không thấy, nghe không được. Bao trùm trời đất, nuôi dưỡng chúng sinh. Tụng đọc muôn lần, thân phát ánh sáng. Tam giới hầu cận, Ngũ Đế nghênh đón. Vạn thần triều bái, sai khiến sấm sét. Quỷ yêu mất胆, tinh quái tan hình. Trong có sấm sét, sấm thần ẩn danh. Trí tuệ sáng suốt, ngũ khí bừng bừng. Ánh vàng mau hiện, che chở chân nhân.',
    meaning: 'Phụ thân chú hộ thân — lấy ánh sáng vàng của Đạo bao phủ thân thể, trừ tà hộ mệnh, an định tâm thần.',
    use: '護身 / 淨化 / 驅邪',
    recitation_context: '早课八大神咒之一, 日常诵持, 无禁忌 theo truyền thống.',
    textual_certainty: 'high',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (《太上玄门正一日诵早课》维基文库)',
      'http://www.taoist.org.cn/getDjzsByC2Action.do?c2=csjd (中国道教协会·常诵经典)',
      'https://ctext.org/wiki.pl?if=gb&res=190395 (ctext 道教功课经典)',
    ],
  },
  {
    id: 'JING_XIN_SHEN_ZHOU',
    name: '净心神咒 — Thần chú Tịnh Tâm',
    han_text: '太上台星，应变无停。驱邪缚魅，保命护身。智慧明净，心神安宁。三魂永久，魄无丧倾。急急如律令。',
    vi_translation: 'Sao Thai Cực ở trên cao, ứng biến không ngừng. Trừ tà trói quỷ, giữ mạng hộ thân. Trí tuệ sáng tịnh, tâm thần an ninh. Ba hồn bền vững, bảy phách không sụt mất. Nhanh nhanh như luật lệnh.',
    meaning: 'Tịnh hóa tâm ý — trừ tạp niệm, an định tâm thần, bảo hồn hộ phách.',
    use: '淨化 (tịnh tâm trước khi tụng kinh / hành pháp)',
    recitation_context: '早晚功课开头首咒, học luyện符 trước必诵.',
    textual_certainty: 'high (双经典出处)',
    sources: [
      'https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BE%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F (《三官经》wikisource — độc lập第二经典出处)',
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (《正一日诵早课》wikisource)',
      'https://baike.baidu.com/item/%E9%81%93%E6%95%99%E5%85%AB%E5%A4%A7%E7%A5%9E%E5%92%92/1190054 (百度百科·道教八大神咒)',
    ],
  },
  {
    id: 'JING_KOU_SHEN_ZHOU',
    name: '净口神咒 — Thần chú Tịnh Khẩu',
    han_text: '丹朱口神，吐秽除氛。舌神正伦，通命养神。罗千齿神，却邪卫真。喉神虎贲，炁神引津。心神丹元，令我通真。思神炼液，道炁常存。急急如律令。',
    vi_translation: 'Khẩu thần tên Đan Chu, nhổ bỏ uế khí trừ mùi hôi. Thiệt thần tên Chánh Luân, thông mệnh dưỡng thần. Răng thần La Thiên, trừ tà vệ chân. Hầu thần Hổ Bôn, khí thần dẫn tân. Tâm thần Đan Nguyên, khiến ta thông chân. Tư thần luyện dịch, đạo khí thường còn. Nhanh nhanh như luật lệnh.',
    meaning: 'Tịnh hóa khẩu nghiệp —涤除口中秽气, an trấn bản mệnh thần,令诵经 thông chân.',
    use: '淨化 (tịnh khẩu, tụng kinh前行)',
    recitation_context: '紧接净心神咒之后, 诵经 trước净口.',
    textual_certainty: 'high',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (《正一日诵早课》wikisource)',
      'https://www.daoisms.com.cn/2012/29/13/19347/ (道音文化·道家净口神咒)',
      'https://baike.baidu.com/item/%E9%81%93%E6%95%99%E5%85%AB%E5%A4%A7%E7%A5%9E%E5%92%92/1190054 (百度百科·八大神咒)',
    ],
  },
  {
    id: 'BEI_DI_SHA_GUI_ZHOU',
    name: '北帝杀鬼咒 (规范名: 天蓬咒 / 天蓬神咒) — Chú Bắc Đế Sát Quỷ',
    han_text: '天蓬天蓬，九玄杀童。五丁都司，高刁北翁。七政八灵，太上皓凶。长颅巨兽，手把帝钟。素枭三神，严驾夔龙。威剑神王，斩邪灭踪。紫炁乘天，丹霞赫冲。吞魔食鬼，横身饮风。苍舌绿齿，四目老翁。天丁力士，威南御凶。天驺激戾，威北衔锋。三十万兵，卫我九重。辟尸千里，袪却不祥。敢有小鬼，欲来见状。钁天大斧，斩鬼五形。炎帝烈血，北斗燃骨。四明破骸，天猷灭类。神刀一下，万鬼自溃。急急如律令。',
    vi_translation: 'Thiên Phùng Thiên Phùng, Cửu Huyền Sát Đồng… (đầy đủ như W8 fragment) — triệu Thiên Phùng nguyên soái thống lãnh 30 vạn binh, chém tà diệt tung, sát quỷ hộ thân.',
    vi_translation_note: 'Chú chứa nhiều thần danh / uế ngữ (sát/quỷ/huyết/cốt); nguyên văn Hán được bảo tồn, dịch nghĩa mang tính tham khảo vì nhiều danh từ là thần-tướng danh hiệu.',
    meaning: 'Triệu Thiên Phùng nguyên soái (Bắc Đế bộ下) 统领三十万兵, 斩邪灭踪, 杀鬼护身. Theo陶弘景《真诰》: «鬼有三被此咒者，眼精自烂而身即死矣…»',
    use: '驅邪 / 杀鬼',
    recitation_context: '北帝伏魔法事核心咒;须叩齿三十六通,一炁诵三遍 (DZ 1412 卷二所载仪轨). CẢNH BÁO: 经文 cảnh cáo持咒 ăn ngũ tân /口 bất tịnh «天蓬大将怒目一嗔, 令人神魂堕落».',
    textual_certainty: 'high_for_canonical_form (天蓬咒), variants_flagged',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=557999 (CTEXT《太上元始天尊说北帝伏魔神咒妙经》DZ 1412)',
      'http://www.ctcwri.idv.tw/CTCW-CMTS/CMT07正乙部/CMT07-ALL/CH07220太上元始天尊说北帝伏魔神咒妙经/CH07220-04卷四斩厄品.htm (道教学术资讯网站 卷四 斩鬼品)',
      'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT《道法会元》卷162 上清天蓬伏魔大法 DZ 1220)',
      'https://baike.baidu.com/item/%E5%A4%A9%E8%93%AC%E7%A5%9E%E5%92%92/6978731 (百度百科·天蓬神咒 — 引《真诰》卷十)',
    ],
  },
  {
    id: 'DONG_YUAN_SHEN_ZHOU',
    name: '洞渊神咒 (TEXTUAL UNCERTAINTY — 见 notes) — Thần chú Động Uyên',
    han_text: '[经文节选 — 卷四 杀鬼品] 道言：天丁力士，三十六万人，持戟仗剑，来入人家，搜捕邪精。若有小鬼，不即去者，斩之万段。急急如律令。',
    han_text_notes: 'TEXTUAL UNCERTAINTY: «洞渊神咒» KHÔNG phải单固定短咒 (khác八大神咒), mà là总称 các神咒 trong《太上洞渊神咒经》(DZ 0335, 20 quyển): 遣鬼 / 缚鬼 / 杀鬼 / 禁鬼 / 斩鬼 phẩm. Đoạn trên là代表节选, KHÔNG phải规范全文单咒.',
    vi_translation: '[经文节选译] Đạo nói: Thiên Đinh lực sĩ, 36 vạn người, cầm kích cầm kiếm, vào nhà người, lùng bắt tà tinh. Nếu có quỷ nhỏ không lui, chém vạn đoạn. Cấp cấp như luật lệnh.',
    meaning: 'Theo《洞渊神咒经》, 太上道君赐道士神咒,遣天丁力士,敕令鬼 thần nghe lệnh — qua «转经 (诵经) + 斋法»救济 đạo dân.',
    use: '驅邪 / 遣鬼 (经忏法事)',
    recitation_context: '洞渊派 «转经» 法事 — 诵《洞渊神咒经》20 quyển tương ứng phẩm (非单咒 độc lập tụng).',
    textual_certainty: 'low_for_single_mantra (经书确定, 单一短咒文本 không ổn định)',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=190395&remap=gb (CTEXT《太上洞淵神呪經》DZ 0335 全 20 quyển)',
      'https://zh.wikipedia.org/zh-cn/%E5%A4%AA%E4%B8%8A%E6%B4%9E%E6%B7%B5%E7%A5%9E%E5%92%92%E7%B6%93 (维基百科 — DZ0335 / 20 quyển / 王纂传 / 洞渊派)',
      'https://www.shidianguji.com/book/DZ0335 (识典古籍 DZ0335 全 20 quyển)',
    ],
  },
];

// ============================================================================
//  V9 — REMEDIES (7 categories) · shape: {type, items[], steps[], day_hour_note, caveat, sources[]}
//  Assembled từ canonical (W13 chưa disk). Mỗi category ≥2 nguồn (1 primary text
//  trên ctext/wikisource + ≥1 secondary/academic/gov).
// ----------------------------------------------------------------------------
export const remedies = [
  {
    id: 'remedy-fu',
    type: '符 (talisman / phù)',
    items: ['朱砂 (chu sa)', '黃紙 (giấy vàng)', '毛筆 (bút)', '受箓 (cấp độ đạo sĩ — yêu cầu)'],
    steps: ['1)道 sĩ thụ箓 khải đàn', '2)Chu sa +黃紙 write符 theo truyền thừa', '3)Khởi / niệm神咒 (八大神咒)', '4)An vị hoặc phát'],
    day_hour_note: 'Theo傳統 chọn ngày/giờ「dương»避 thuần âm; thật sự do đạo sĩ quyết theo科儀.',
    caveat: 'Phải do 受箓道 sĩ (正一/全真) chủ trì. Tự book符無傳承被 coi是 vô hiệu / 反效果 theo傳統.',
    sources: [
      'https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb (ctext 辰州符咒大全 «表黃紙朱砂書之»)',
      'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗)',
      'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符釋例)',
    ],
  },
  {
    id: 'remedy-jingzhai',
    type: '淨宅 (tịnh nhà)',
    items: ['淨水', '香', '柚子葉 / 茅草 (đ传统)', '八大神咒 (诵读)'],
    steps: ['1)Tịnh水 + tịnh thân', '2)Tụng 净心/净口/金光咒 (W8)', '3)Rảy淨水 khắp nhà', '4)Mở cửa sổ / thông khí'],
    day_hour_note: '通常選朝早 dương thời;避 tháng 7 / ngày thuần âm theo dân gian.',
    caveat: 'Dân gian / văn hoá tham khảo; KHÔNG thay thế vệ sinh / y tế.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (八大神咒 — tịnh tế chuẩn)',
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (gov 驅逐 framework)',
    ],
  },
  {
    id: 'remedy-songjing',
    type: '誦經 (tụng kinh)',
    items: ['《北斗本命延生真經》', '《三官经》', '《太上玄門早晚功课》'],
    steps: ['1)Tịnh tâm / tịnh khẩu', '2)Tụng經 tương ứng', '3)Hồi hướng'],
    day_hour_note: '早 / sớu课 theo truyền thống;無 cấm kỵ chung.',
    caveat: 'Hành vi tôn giáo / văn hoá. KHÔNG thay thế điều trị tâm lý.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (PRIMARY 北斗經)',
      'https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BE%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F (三官经)',
    ],
  },
  {
    id: 'remedy-fangsheng',
    type: '放生 (phóng sinh)',
    items: ['Sinh vật phù hợp môi trường (tránh ngoại lai / hại sinh thái)', '誦放生文 / 三皈依'],
    steps: ['1)Chọn loài bản địa có thể sống', '2)Tụng kinh / sám', '3)Thả về môi trường phù hợp'],
    day_hour_note: 'Theo dân gian:避 kỵ nhật / chọnDirect sinh ngày.',
    caveat: 'Phải遵守法律 / sinh thái học; hiện đại phản對 phóng sinh loài ngoại lai / sai môi trường.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%94%BE%E7%94%9F (維基百科 放生 — lịch sử + tranh cãi hiện đại)',
      'https://www.ihchina.cn/project_details/10219.html (中元 / 放生 — corpus văn hoá phi vật thể)',
    ],
  },
  {
    id: 'remedy-antaisui',
    type: '安太歲 (an Thái Tuế)',
    items: ['太歲神 card (60甲子)', '斗燈 / 米', '《北斗經》'],
    steps: ['1)Xác định本命太歲 (chi năm vs lưu niên thái tuế)', '2)An vị / cầu an tại đền / chùa', '3)Tụng北斗經 / 禮斗'],
    day_hour_note: '通常 đầu năm âm lịch (lập Xuân / đầu tháng Giêng).',
    caveat: 'Hành vi tín ngưỡng; mọi「xung / hình」 chỉ là cổ pháp tượng.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (PRIMARY 北斗經)',
      'https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97 (道教文化中心 禮斗 / 太歲)',
      'https://baike.baidu.com/item/%E5%AE%89%E5%A4%AA%E5%B2%81/390965 (百度百科 安太歲)',
    ],
  },
  {
    id: 'remedy-baichan',
    type: '拜懺 (sám hối / lễ sám)',
    items: ['《星辰寶懺》 / 《北斗經》 / 《三官经》', '斗燈', '香 / hoa / quả'],
    steps: ['1)Khải壇', '2)Tụng sám văn («懺悔消災…削落三災九厄»)', '3)Hồi hướng'],
    day_hour_note: 'Trong「九會」lễ — hoặc theo科儀 đạo sĩ.',
    caveat: 'Pháp sự nghiêm túc do đạo sĩ chủ trì; cá nhân có thể tự tụng văn bản kinh.',
    sources: [
      'https://www.sctayi.com/front/bin/ptdetail.phtml?Part=corner-01-02-01&Category=15253 (九陽道善堂 禮斗科儀 / 星辰寶懺)',
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (PRIMARY 北斗經)',
    ],
  },
  {
    id: 'remedy-peishi',
    type: '佩飾 (vật hộ thân đeo người)',
    items: ['黑曜石 (obsidian / hắc diệu thạch)', 'Tỳ Hưu (tỳ hưu)', 'đồng tiền cổ / 五帝錢', '桃木物品 (gỗ đào)'],
    steps: ['1)Chọn vật phẩm (văn hoá / cảm nhận cá nhân)', '2)(tuỳ chọn) 開光 do đạo sĩ', '3)Đeo / đặt theo hướng的文化 truyền thống'],
    day_hour_note: '無 chung; theo vật phẩm cụ thể.',
    caveat: 'Vật phẩm văn hoá / tâm lý tham khảo; KHÔNG phải y tế. Tránh mua vì sợ dọa.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%BB%91%E6%9B%9C%E7%9F%B3 (維基百科 黑曜石)',
      'https://zh.wikipedia.org/wiki/%E9%A2%A8%E6%B0%B4 (維基百科 風水 — vật phẩm法器)',
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (gov 驅逐 framework — vật phẩm context)',
    ],
  },
];

// ============================================================================
//  V10a — TỬ VI CROSS-REFERENCE · shape: {star, condition, meaning, strength, sources[]}
//  Assembled từ canonical (W13 chưa disk). Cross-mappable với V1 indicators.
// ----------------------------------------------------------------------------
export const ziweiStars = [
  {
    id: 'guimen',
    star: '鬼門 (Quỷ Môn)',
    condition: 'Cung có sao 鬼門 tọa thủ (theo một số phái Tử Vi) — hoặc dùng khái niệm«quỷ môn»trong phong thuỷ / cung vị.',
    meaning: 'Dân gian gắn với «dễ cảm ứng âm / vong»; cổ pháp Tử Vi coi là tượng cấp thấp. strength giới hạn vì khái niệm phái-biệt.',
    strength: 2,
    sources: [
      'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數 — hệ thống sao)',
      'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86 (維基文庫 紫微斗數全集 — primary)',
    ],
  },
  {
    id: 'ynsha',
    star: '陰煞 (Âm Sát)',
    condition: 'Âm Sát tọa thủ cung (nhất là Mệnh / Thân / Phúc / Tật).',
    meaning: 'Cổ pháp luận «dễ bị tiểu nhân / ám ảnh tâm lý / cảm âm»; KHÔNG phải chẩn đoán «bị tà».',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數)',
      'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86 (紫微斗數全集)',
    ],
  },
  {
    id: 'jumen-huaji',
    star: '巨門化忌 (Cự Môn Hóa Kỵ)',
    condition: 'Cự Môn gặp Hóa Kỵ (theo lưu niên / nguyên cục).',
    meaning: 'Cổ pháp chủ thị phi / nghi ngờ / «dễ bị hiểu lầm» — dân gian đôi khi gắn với «nghi tâm / ám ảnh».',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數)',
      'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86',
    ],
  },
  {
    id: 'tiankong-dijie',
    star: '天空 / 地劫 (Thiên Không / Địa Kiếp)',
    condition: 'Thiên Không hoặc Địa Kiếp tọa thủ cung (nhất là Mệnh / Tài).',
    meaning: 'Cổ pháp chủ «không / hao / bồn cao / xuất ngoại»; dân gian đôi khi gắn «空» với cảm thức tâm linh.',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數)',
      'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86',
    ],
  },
  {
    id: 'lingxing-qingyang',
    star: '鈴星 / 陀羅 / 火星 / 擎羊 (tứ sát)',
    condition: 'Đặc biệt 鈴星 (Linh Tinh) hoặc bộ tứ sát hội.',
    meaning: 'Cổ pháp chủ«xung / hình / bạo»; dân gian gắn với sự kích / bạo liệt — tượng cấp khí thế.',
    strength: 3,
    sources: [
      'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數)',
      'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86',
    ],
  },
];

// ============================================================================
//  V10b — ETHICS OBJECT (mandatory) · shape: {disclaimer, optIn, forbiddenClaims, toneRules, referral, sources[]}
//  (re-exposes top-level ETHICS as part of the default export object — both forms
//   required: top-level const + inside default export, per W15/W18 gate.)
// ----------------------------------------------------------------------------
export const ethics = {
  disclaimer: ETHICS.disclaimerVi,
  disclaimerEn: ETHICS.disclaimerEn,
  optIn: {
    required: true,
    confirmationsRequired: 1,
    canDisableAnytime: true,
    rule: 'Chỉ hiển thị khi user tự bật «Âm Tà / Vong Hồn / Trừ Tà» module và xác nhận ≥1 lần. Mặc định TẮT.',
  },
  forbiddenClaims: ETHICS.forbiddenAbsoluteClaims,
  toneRules: ETHICS.toneRules,
  referral: ETHICS.referralNote,
  sources: ETHICS.ethicsSources,
};

// ============================================================================
//  CONSOLIDATED SOURCES (deduplicated) —便于 audit / hiển thị công bố nguồn
// ----------------------------------------------------------------------------
export const sources = [
  // Primary classical texts (canon)
  'https://zh.wikisource.org/wiki/%E6%B7%B5%E6%B5%B7%E5%AD%90%E5%B9%B3 (維基文庫 淵海子平)',
  'https://ctext.org/wiki.pl?if=gb&chapter=524726&remap=gb (ctext 淵海子平)',
  'https://zh.wikisource.org/zh-hans/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%85%A8%E8%A6%BD (維基文庫 三命通會)',
  'https://ctext.org/wiki.pl?if=gb&chapter=850832 (ctext 三命通會 卷十二)',
  'https://ctext.org/wiki.pl?if=gb&res=497389 (ctext 茅山志)',
  'https://zh.wikisource.org/wiki/%E8%8C%85%E5%B1%B1%E5%BF%97 (維基文庫 茅山志)',
  'https://www.shidianguji.com/zh/book/DZ0304 (識典古籍 茅山志 DZ0304)',
  'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (PRIMARY 北斗本命延生真經)',
  'https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BE%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F (《三官经》)',
  'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (《正一日诵早课》八大神咒)',
  'https://ctext.org/wiki.pl?if=gb&chapter=557999 (CTEXT 北帝伏魔神咒妙经 DZ 1412)',
  'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT 道法会元 DZ 1220)',
  'https://ctext.org/wiki.pl?if=gb&res=190395 (CTEXT 太上洞淵神呪經 DZ 0335)',
  'https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb (ctext 辰州符咒大全)',
  'https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E9%9B%86 (維基文庫 紫微斗數全集)',
  // Encyclopedic / secondary (independent)
  'https://baike.baidu.com/item/%E5%91%BD%E7%90%86%E7%A5%9E%E7%85%9E/12581261 (百度百科 命理神煞)',
  'https://baike.baidu.com/item/%E4%B8%A7%E9%97%A8%E3%80%81%E5%90%8A%E5%AE%A2/22937868 (百度百科 喪門弔客)',
  'https://baike.baidu.com/item/%E8%83%8E%E5%85%83%E5%91%BD%E5%AE%AE/4629187 (百度百科 胎元命宫)',
  'https://baike.baidu.com/item/%E5%8C%97%E6%96%97%E7%BB%8F/4081312 (百度百科 北斗經)',
  'https://baike.baidu.com/item/%E9%81%93%E6%95%99%E5%85%AB%E5%A4%A7%E7%A5%9E%E5%92%92/1190054 (百度百科 八大神咒)',
  'https://baike.baidu.com/item/%E5%A4%A9%E8%93%AC%E7%A5%9E%E5%92%92/6978731 (百度百科 天蓬神咒)',
  'https://baike.baidu.com/item/%E7%81%B5%E5%A9%B4/18593858 (百度百科 靈嬰)',
  'https://baike.baidu.com/item/%E4%B8%89%E5%A5%B6%E5%A4%AB%E4%BA%BA/1043322 (百度百科 三奶夫人)',
  'https://baike.baidu.com/item/%E7%A5%96%E5%85%88%E7%A5%9E%E5%B4%87%E6%8B%9C/1429953 (百度百科 祖先神崇拜)',
  'https://baike.baidu.com/item/%E5%AE%89%E5%A4%AA%E5%B2%81/390965 (百度百科 安太歲)',
  'https://baike.baidu.com/item/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8 (百度百科 紫微斗數)',
  'https://zh.wikipedia.org/zh-cn/%E4%B8%AD%E5%85%83%E7%AF%80 (維基百科 中元節)',
  'https://zh.wikipedia.org/zh-cn/%E5%AC%B0%E9%9D%88 (維基百科 嬰靈)',
  'https://zh.wikipedia.org/wiki/%E8%87%A8%E6%B0%B4%E5%A4%AB%E4%BA%BA (維基百科 臨水夫人)',
  'https://zh.wikipedia.org/wiki/%E9%A3%8E%E6%B0%B4 (維基百科 風水)',
  'https://zh.wikipedia.org/wiki/%E6%94%BE%E7%94%9F (維基百科 放生)',
  'https://zh.wikipedia.org/wiki/%E9%BB%91%E6%9B%9C%E7%9F%B3 (維基百科 黑曜石)',
  // Government / heritage (independent, authoritative)
  'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=6 (全國宗教資訊網 內政部 — 收驚)',
  'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=188 (全國宗教資訊網 內政部 — 驅逐)',
  'https://www.ihchina.cn/project_details/10219.html (中國非物質文化遺產網)',
  'https://www.mwr.org.tw/tw_religion/ritual/7-15.htm (世界宗教博物館)',
  'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687 (國家文化記憶庫)',
  // Academic (independent, peer-reviewed / institutional)
  'https://www.chinesefolklore.org.cn/web/index.php?NewsID=8313 (中國民俗學網 周星)',
  'https://www.cnki.com.cn/Article/CJFDTotal-RELI201202013.htm (CNKI 世界宗教文化)',
  'http://www.rsd.fju.edu.tw/images/3-03-Jaike_Liu.pdf (輔仁大學 學術PDF)',
  'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗)',
  'https://tdr.lib.ntu.edu.tw/handle/123456789/97051?mode=full (臺灣大學碩博論文)',
  'https://www.ioe.sinica.edu.tw/ (中研院 民族學研究所)',
  'https://www.baoan.org.tw/paper.php?action=show&id=11&lang=tw (保安宮 學術發表)',
  'https://www.airitilibrary.com/Publication/Index/17277647-200904-201411250017-201411250017-198-225 (行天宮 收驚婆 học thuật)',
  'https://dao.crs.cuhk.edu.hk/Main/wp-content/uploads/2022/09/DAO14_05_%E6%96%BD%E7%A7%A6%E7%94%9F.pdf (CUHK DAO academic)',
  'https://www.litphil.sinica.edu.tw/newsletter/95/1-56.pdf (中研院 LitPhil 茅山志)',
  'https://zh.daoinfo.org/index.php?title=%E9%96%AD%E5%B1%B1%E6%B4%BE (道教文化中心 閭山派)',
  'https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97 (道教文化中心 拜斗)',
  'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符)',
  'https://www.daoisms.com.cn/2012/29/13/19347/ (道音文化)',
  'http://www.taoist.org.cn/getDjzsByC2Action.do?c2=csjd (中国道教协会)',
  'http://www.ctcwri.idv.tw/CTCW-CMTS/CMT07正乙部/CMT07-ALL/CH07220太上元始天尊说北帝伏魔神咒妙经/CH07220-04卷四斩厄品.htm (道教学术资讯)',
  'https://www.sctayi.com/front/bin/ptdetail.phtml?Part=corner-01-02-01&Category=15253 (九陽道善堂)',
  'http://chanweitang.com/post/83.html (阐微堂)',
  'https://book.taiyi.me/%E5%91%BD/%E7%A5%9E%E7%85%9E%E5%A4%A7%E5%85%A8 (太乙書局)',
  'https://www.8bei8.com/book/sanmingtonghui_51.html (8bei8 三命通會)',
  'https://ichingquest.com/zh-CN/fortune/bazi/shensha (ichingquest)',
  'https://blog.udn.com/frankjin/109747484 (林金郎文學網)',
  'https://www.chaoduren.com/articles/daoist-reincarnation-yingling/ (道教學術解讀)',
  'https://www.shidianguji.com/book/DZ0335 (识典古籍 DZ0335)',
  'https://www.shidianguji.com/zh/book/SK1610/chapter/1kf5v7gfbmfpm (識典古籍 三命通會)',
  'https://www.scribd.com/document/835025737 (神煞整理與分析)',
  'https://www.who.int/health-topics/mental-health (WHO mental health)',
];

// ============================================================================
//  RITUALS — grouped by school (V3-V8) for the default export
// ----------------------------------------------------------------------------
export const rituals = {
  maoShan: ritualsMaoShan,        // V3
  zhengYi: ritualsZhengYi,        // V4
  luShan: ritualsLuShan,          // V5
  taiwanShoujing: ritualsTaiwanShoujing, // V6
  hongKong: ritualsHongKong,      // V7
  shenzhou: shenzhou,             // V8 (《道藏》canon 神咒)
};

// ============================================================================
//  SPIRIT TYPES — V2 array (alias of spiritTypes for clarity in default export)
// ----------------------------------------------------------------------------
// (spiritTypes already exported above)

// ============================================================================
//  META — provenance & verification status (for auditors / W16-W18)
// ----------------------------------------------------------------------------
export const _meta = {
  moduleVersion: '1.0.0',
  generatedBy: 'W15 (implementer) — assembled from W1-W11 fragments + W12 verdict',
  provenance: {
    verifiedOnDisk: [
      'V1 indicators (W12 verdict: all PASS)',
      'V2 spiritTypes (W12 verdict: all PASS; 嬰靈 flagged modern)',
      'V3 Mao Shan school+items (W12 PASS; incantation text CONDITIONAL — not fabricated)',
      'V4 Zheng Yi incl. 北斗經 primary (W12 PASS)',
      'V5 Lü Shan / 法主真君 / 三奶 (W12 PASS)',
      'V6 Taiwan 收驚 (W12 PASS — strongest sourcing)',
      'V8 神咒 ×5 (W8 fragment: verified_2plus_independent; Hán verbatim)',
    ],
    assembledFromCanonicalPendingW13: [
      'V7 Hong Kong 化煞 / 道館',
      'V9 Remedies ×7 categories',
      'V10a Tử Vi stars ×5',
      'V10b ETHICS (digital-health folklore-ethics framing)',
    ],
    independenceNote:
      'wikisource & ctext host the SAME primary texts → counted as 1 primary made reachable via 2 hosts. Each entry therefore pairs the primary with ≥1 genuinely independent secondary/academic/gov source (per W12 flag).',
  },
  ethicsEmbeddedIn: ['top-level ETHICS const', 'export ethics object', 'header comment (verbatim framing)'],
  hardGates: [
    'no absolute claims («bạn bị ma»)',
    'no medical-replacement language',
    'opt-in framing throughout',
    'ETHICS present in BOTH this file and docs/AM-TA-SPEC.md (W14)',
    'Mao Shan 口訣 NOT fabricated (W12 conditional flag respected)',
    '嬰靈 framed as MODERN 1970s Taiwan folk development (not classical canon)',
  ],
};

// ============================================================================
//  DEFAULT AGGREGATE EXPORT — one-line import
// ============================================================================
export default {
  ETHICS,
  indicators,        // V1
  spiritTypes,       // V2
  rituals,           // V3-V8 grouped by school
  remedies,          // V9
  ziweiStars,        // V10a
  ethics,            // V10b
  sources,           // consolidated
  _meta,
};
