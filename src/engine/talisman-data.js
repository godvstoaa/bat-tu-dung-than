// ============================================================================
//  符咒 / Ấn / Nghi thức — DATA MODULE (Phase 1: 符咒 layer deep)
//  Mined từ docs/AM-TA-SPEC.md (Rounds 3-9, verified W12/W13) +
//  docs/_fragments/W8-shenzhou.json (八大神咒 verbatim) + FU-001 (Grok OCR).
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (mirrors AM-TA Round 11): tham chiếu văn hoá-tôn giáo, KHÔNG y tế/
//  tâm thần. 符 MÔ TẢ cấu trúc + thị giác (KHÔNG hướng dẫn in/ve operative);
//  nghi lễ / 書符 / 科儀 phải do đạo sĩ / pháp sư 受箓 chủ trì. Mỗi mục ≥2 nguồn.
//  ----------------------------------------------------------------------------
//  Pure ES module data. Verified by `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
export { ETHICS };

// ----------------------------------------------------------------------------
//  MANTRAS (layer=mantra) — 神咒 verbatim, verified_2plus_independent (W8).
// ----------------------------------------------------------------------------
const _MANTRAS = [
  {
    id: 'ZHOU_JIN_GUANG',
    layer: 'mantra', school: '通用 / 早晚功課（八大神咒之七）',
    name_han: '金光神咒', name_vi: 'Chú Kim Quang',
    han_text: '天地玄宗，万炁本根。广修亿劫，证吾神通。三界内外，惟道独尊。体有金光，覆映吾身。视之不见，听之不闻。包罗天地，养育群生。诵持万遍，身有光明。三界侍卫，五帝司迎。万神朝礼，役使雷霆。鬼妖丧胆，精怪亡形。内有霹雳，雷神隐名。洞慧交彻，五炁腾腾。金光速现，覆护真人。',
    meaning: 'Phụ thân chú — lấy ánh sáng vàng của Đạo bao phủ thân thể, trừ tà hộ mệnh, an định tâm thần. Dùng cho 護身 / 淨化 / 驅邪.',
    use: '護身 · 淨化 · 驅邪', recitation_context: '早課八大神咒之一;日常誦持,傳統無禁忌.末句在家人念「覆護真人」.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (維基文庫 太上玄門正一日誦早課)',
      'http://www.taoist.org.cn/getDjzsByC2Action.do?c2=csjd (中國道教協會 常誦經典)',
      'https://baike.baidu.com/item/%E9%81%93%E6%95%99%E5%85%AB%E5%A4%A7%E7%A5%9E%E5%92%92/1190054 (百度百科 道教八大神咒)',
    ],
    textual_certainty: 'high', notes: 'W8 verified_2plus_independent;文本穩定,異文極少.',
  },
  {
    id: 'ZHOU_JING_XIN',
    layer: 'mantra', school: '通用 / 早晚功課（八大神咒之首）',
    name_han: '净心神咒', name_vi: 'Thần Chú Tịnh Tâm',
    han_text: '太上台星，应变无停。驱邪缚魅，保命护身。智慧明净，心神安宁。三魂永久，魄无丧倾。急急如律令。',
    meaning: 'Tịnh hoá tâm ý — trừ tạp niệm, an định tâm thần, bảo hồn hộ phách (ý nghiệp tịnh hoá). Dùng trước khi tụng kinh / hành pháp.',
    use: '淨化 · 護身', recitation_context: '早晚功課開頭首咒;學煉符法前必誦.第二經典出處:三官經亦收此咒.',
    sources: [
      'https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BD%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F (維基文庫 三官經 — 獨立第二經典出處)',
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (維基文庫 早課 八大神咒標準來源)',
    ],
    textual_certainty: 'high', notes: 'W8 verified;雙經典出處(早課+三官經).末句「急急如律令」個別版本有/無差異.',
  },
  {
    id: 'ZHOU_JING_KOU',
    layer: 'mantra', school: '通用 / 早晚功課（八大神咒之二）',
    name_han: '净口神咒', name_vi: 'Thần Chú Tịnh Khẩu',
    han_text: '丹朱口神，吐秽除氛。舌神正伦，通命养神。罗千齿神，却邪卫真。喉神虎贲，炁神引津。心神丹元，令我通真。思神炼液，道炁常存。急急如律令。',
    meaning: 'Tịnh hoá khẩu nghiệp —涤除口中穢氣,請本命神安鎮,令誦經通真.緊接淨心神咒之後.',
    use: '淨化', recitation_context: '緊接淨心神咒之後,誦經前淨口.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%96%80%E6%AD%A3%E4%B8%80%E6%97%A5%E8%AA%B5%E6%97%A9%E8%AA%B2 (維基文庫 早課 — 净口神咒全文)',
      'https://www.daoisms.com.cn/2012/29/13/19347/ (道音文化 净口神咒 — 獨立第二來源)',
    ],
    textual_certainty: 'high', notes: 'W8 verified;「丹朱口神」=口神名 Đan Chu.',
  },
  {
    id: 'ZHOU_BEI_DI_TIAN_PENG',
    layer: 'mantra', school: '北帝派 / 酆都派（洞真部）; 上清天蓬伏魔大法',
    name_han: '北帝殺鬼咒（天蓬咒 / 天蓬神咒）', name_vi: 'Chú Bắc Đế Sát Quỷ (Thiên Phùng)',
    han_text: '天蓬天蓬，九玄杀童。五丁都司，高刁北翁。七政八灵，太上皓凶。长颅巨兽，手把帝钟。素枭三神，严驾夔龙。威剑神王，斩邪灭踪。紫炁乘天，丹霞赫冲。吞魔食鬼，横身饮风。苍舌绿齿，四目老翁。天丁力士，威南御凶。天驺激戾，威北衔锋。三十万兵，卫我九重。辟尸千里，袪却不祥。敢有小鬼，欲来见状。钁天大斧，斩鬼五形。炎帝烈血，北斗燃骨。四明破骸，天猷灭类。神刀一下，万鬼自溃。急急如律令。',
    meaning: 'Triệu Thiên Phùng nguyên soái (Bắc Đế bộ下) thống ba mươi vạn binh, trảm tà diệt tung, sát quỷ hộ thân.陶弘景《真誥》:「鬼有三被此咒者,眼精自爛而身即死矣…北帝秘其道」.',
    use: '驅邪 · 殺鬼 · 護身', recitation_context: '北帝伏魔法事核心咒;須叩齒三十六通,一炁誦三遍.警告:持咒吃五辛/口不淨者「天蓬大將怒目一嗔,令人神魂墮落」.三十六句倒讀成《天蓬馘魔咒》(鄧紫陽倒持法,道法會元卷174).',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=557999 (CTEXT 太上元始天尊說北帝伏魔神咒妙經 卷二 DZ1412)',
      'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT 道法會元 卷162 上清天蓬伏魔大法 DZ1220)',
      'https://baike.baidu.com/item/%E5%A4%A9%E8%93%AC%E7%A5%9E%E5%92%92/6978731 (百度百科 天蓬神咒 引真誥卷十)',
    ],
    textual_certainty: 'high', notes: 'W8 verified 4來源.變異:「殺/煞童」「高刁/高刀北翁」「紫炁/紫气」「手把/手執帝钟」.',
  },
  {
    id: 'ZHOU_DONG_YUAN',
    layer: 'mantra', school: '洞淵派 / 洞玄部本文類',
    name_han: '洞淵神咒（經文節選）', name_vi: 'Thần Chú Động Uyên',
    han_text: '道言：天丁力士，三十六万人，持戟仗剑，来入人家，搜捕邪精。若有小鬼，不即去者，斩之万段。急急如律令。（卷四 殺鬼品 代表節選）',
    meaning: '太上道君與諸天魔王鬼王立誓(卷一誓魔品),賜道士神咒威力,遣天丁力士敕令鬼神聽命 — 通過轉經救濟道民.',
    use: '驅邪 · 遣鬼', recitation_context: '洞淵派「轉經」法事 — 誦《洞淵神咒經》二十卷相應品(非單咒獨立誦);卷四殺鬼品附十六符.',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=190395&remap=gb (CTEXT 太上洞淵神呪經 DZ0335 全二十卷目錄)',
      'https://zh.wikipedia.org/zh-cn/%E5%A4%AA%E4%B8%8A%E6%B4%9E%E6%B7%B5%E7%A5%9E%E5%92%92%E7%B6%93 (維基百科 太上洞渊神咒經 概述)',
      'https://www.shidianguji.com/book/DZ0335 (識典古籍 DZ0335 全二十卷)',
    ],
    textual_certainty: 'low', notes: 'TEXTUAL UNCERTAINTY:「洞淵神咒」非單一固定短咒,乃《洞淵神咒經》各品神咒總稱.上方為殺鬼品代表節選,非規範全文(W8/W13 cờ).',
  },
];

// ----------------------------------------------------------------------------
//  FU 符 (layer=fu) — cấu trúc mô tả (KHÔNG vẽ), từ AM-TA Round 3-6 + FU-001.
// ----------------------------------------------------------------------------
const _FU = [
  {
    id: 'FU_HE_JING_PING_AN',
    layer: 'fu', school: '通用／正一系民俗符籙（臺閩黃紙平安符）',
    name_han: '合境平安符', name_vi: 'Phù Hợp Cảnh Bình An',
    han_text: '合境 · 平安（符腳環結內小字形態近「急急如律令」）',
    structure: { head: '窄長條黃紙符頭,頂端圓墨點;左右「八」「東」.', body: '中段巨大屈曲雲篆複合符字(非楷可逐字讀).', belly: '主符兩脇小字;左中脇一字或「獄/嶽」未定.', core: '中下雙環/結繩交匯處似符膽;朱色方印半覆.', foot: '雙環垂腳+押腳曲線;左「平安」右「合境」楷書.' },
    visual: '窄長豎幅黃紙(約224×741px),黑墨粗筆,一體書成之雲篆符圖;中下段朱印半覆.',
    meaning: 'Dạng 黃紙平安符 hộ thân/trấn trạch cầu bình an cho cả cảnh (合境). Thân 雲篆 cố ý khó đọc — đặc trưng 符籙.',
    use: '護身 · 鎮宅 · 合境平安 · 驅邪',
    sources: [
      'https://dict.th.gov.tw/detailPage.aspx?ID=904&Ca=117 (臺灣民俗文物辭典 平安符)',
      'https://en.wikipedia.org/wiki/Fulu (Wikipedia Fulu — ảnh TaoistCharm.JPG)',
      'https://thjcs.site.nthu.edu.tw/var/file/452/1452/img/1303/THJCS403-2.pdf (清華學報 李豐楙 書符與符號)',
      'https://commons.wikimedia.org/wiki/File:TaoistCharm.JPG (Wikimedia Commons scan PD)',
    ],
    textual_certainty: 'partial', scan_path: 'docs/_scans/commons/TaoistCharm.jpg', fragment: 'docs/_fragments/FU-001.json',
    notes: 'OCR Grok-4.5;「合境」「平安」「東」chắc,thân 雲篆 không bịa.Verifier=conditional (không khớp 1 lá 道藏 cụ thể).',
  },
  {
    id: 'FU_MAOSHAN_XIE',
    layer: 'fu', school: '茅山派 / 上清派（江蘇句容茅山;尊三茅真君）',
    name_han: '茅山驅邪符（結構）', name_vi: 'Phù Mao Sơn Trừ Tà (cấu trúc)',
    han_text: '（符身為雲篆/複合符體,非楷書常字 — cố ý asemic）',
    structure: { head: '符頭 — 點三清 / 敕令,代表神旨來源.', body: '符身 — 主神名諱 + 功能字(鎮/收/殺),符的核心意圖.', belly: '符腹 — 八卦 / 星象 / 罡步符號,結氣佈陣.', core: '符膽 — 天地人三才 + 五行之氣,符的力量樞紐.', foot: '符腳 — 押煞 / 急急如律令,封符.' },
    visual: 'Mao Sơn 符總體五段式(頭身腹膽腳);朱砂黃紙;配桃木劍/令旗/帝鐘.',
    meaning: 'Mao Sơn (上清)驅邪收妖符 — 結構五段對應神旨→主神→佈陣→力量樞紐→封令.僅描述結構,不提供可繪式樣.',
    use: '驅邪 · 收妖 · 鎮宅',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=497389 (CTEXT 茅山志 — 元劉大彬)',
      'https://zh.wikisource.org/wiki/%E8%8C%85%E5%B1%B1%E5%BF%97 (維基文库 茅山志)',
      'https://www.shidianguji.com/zh/book/DZ0304 (識典古籍 茅山志 DZ0304 道藏本 33卷)',
      'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687 (國家文化記憶庫 黃劉源抄 道教茅山派符籙)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 3;口訣 verbatim 未 attested 茅山志 → conditional(不收 verbatim 咒).',
  },
  {
    id: 'FU_ZHENGYI_BEIDOU',
    layer: 'fu', school: '正一派 / 天師道（龍虎山;符籙派 par excellence）',
    name_han: '正一拜斗符 / 北斗本命符', name_vi: 'Phù Chính Nhất Bái Đẩu',
    han_text: '（正一符籙隨受箓階次:都功/盟威/三洞/五嶽 等 — 須受箓方書）',
    structure: { head: '符頭 — 敕令 / 三清.', body: '符身 — 斗口魁神 / 樞上將 / 六十甲子靈官 符文.', belly: '符腹 — 星斗 / 本命元辰 符號.', core: '符膽 — 北斗七元君 / 本命元辰星君 名諱.', foot: '符腳 — 急急如律令 / 押煞.' },
    visual: '正一 符籙 + 設斗壇(米斗內放七星劍/鏡/尺/秤/剪/燈 — 「斗中法器」).',
    meaning: '拜斗 = 禮北斗(本命元辰星君)求延生解厄,禮南斗求增祿.北斗主死、南斗主生.',
    use: '延生 · 解厄 · 拜斗', recitation_context: '《太上玄靈北斗本命延生真經》(北斗經)=五斗經中最早撰成,拜斗科儀根本經典.受箓正一道士主壇.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (維基文库 北斗本命延生真經 PRIMARY CANON)',
      'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符釋例 PDF)',
      'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗 PDF)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 4;正一=符籙派,受箓階次決定可書範圍.',
  },
  {
    id: 'FU_LUSHAN_SHOUJING',
    layer: 'fu', school: '閭山派 / 三奶派（閩越巫基礎;奉許遜/陳靖姑）',
    name_han: '閭山收驚符', name_vi: 'Phù Lư Sơn Thu Hồn',
    han_text: '（閭山/三奶系收驚科儀用符 — 隨流派異,非統一文本）',
    structure: { head: '符頭 — 敕令 / 夫人名.', body: '符身 — 三奶兵將 / 收魂 功能字.', belly: '符腹 — 本命元辰 / 十二生肖 符號.', core: '符膽 — 陳靖姑(臨水夫人) 名諱.', foot: '符腳 — 安魂 / 急急如律令.' },
    visual: '收驚用:米/香/受驚者衣物 + 收驚符(部分流派).閭山三奶派比正統道教更早入台灣(明萬曆18年,1590).',
    meaning: '閭山/三奶以救產護胎、收驚、驅邪為核心法術.收驚=召回魂魄、安魂定神.',
    use: '收驚 · 安魂 · 驅邪',
    sources: [
      'https://zh.wikipedia.org/wiki/%E8%87%A8%E6%B0%B4%E5%A4%AB%E4%BA%BA (維基百科 臨水夫人=陳靖姑)',
      'https://zh.daoinfo.org/index.php?title=%E9%96%AD%E5%B1%B1%E6%B4%BE (道教文化中心 閭山派)',
      'https://nhuir.nhu.edu.tw/retrieve/30984/095NHU05673011-001.pdf (南華大學 台灣北部正一派紅頭法師獅場收魂法事 PDF)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 5;陳靖姑信俗=2008中國國家級非遺.',
  },
];

// ----------------------------------------------------------------------------
//  RITUALS (layer=ritual) — nghi thức mô tả (KHÔNG operative), AM-TA Round 9 + 6.
// ----------------------------------------------------------------------------
const _RITUALS = [
  {
    id: 'FA_SHUFU', layer: 'ritual', school: '通用 / 各符籙派',
    name_han: '書符（科儀）', name_vi: 'Thư Phù (nghi thức)',
    han_text: '淨身 → 設壇 → 書符(頭→身→腹→膽→腳) → 敕符 → 化/佩',
    meaning: 'Nghi thức書符 truyền thống: tịnh thân → thiết đàn (令旗/桃木劍/符紙/朱砂) →書符 (5 đoạn) →敕符 (niệm lệnh,盖上 pháp ấn) → hóa/phù. Mọi bước thực sự phải do 受箓 道士 chủ trì.',
    use: '驅邪 · 護身 · 鎮宅', recitation_context: '書符宜擇吉日吉時(建/滿/成日),忌月破/四廢/歸忌. App KHÔNG cung cấp 符 in/ve.',
    sources: [
      'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687 (國家文化記憶庫 茅山派符籙)',
      'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗)',
      'https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb (CTEXT 辰州符咒大全)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 9.1;mô tả bước, KHÔNG operative draw guide.',
  },
  {
    id: 'FA_BAIDOU', layer: 'ritual', school: '正一 / 全真 — 拜斗科儀',
    name_han: '拜斗（禮斗）', name_vi: 'Bái Đẩu (lễ Đẩu)',
    han_text: '設斗壇 → 禮請北斗七元君/本命元辰星君 → 誦北斗真經/星辰寶懺 → 旋斗 → 化財謝神',
    meaning: '拜斗=禮北斗(主死) cầu延生解厄,禮南斗(主生)cầu增祿.解厄=北斗經核心「懺悔消災…削落三災九厄」.',
    use: '延生 · 解厄 · 消災', recitation_context: '斗中法器:七星劍/鏡/尺/秤/剪/燈.九厄(北斗經):疾病/精邪/暗嵎/為鬼/刑戮/水火/劫賊/瘟疫/死病.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (維基文库 北斗經)',
      'https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97 (道教文化中心 拜斗)',
      'https://www.sctayi.com/front/bin/ptdetail.phtml?Part=corner-01-02-01&Category=15253 (九陽道善堂 禮斗科儀)',
    ],
    textual_certainty: 'high', notes: 'AM-TA Round 4.5;strongest sourcing round.',
  },
  {
    id: 'FA_JINGZHAI', layer: 'ritual', school: '通用 / 民俗',
    name_han: '淨宅', name_vi: 'Tịnh Trạch',
    han_text: '灑淨(淨水+楊枝) → 薰香(每房) → 掃宅(由內向外) → 撒鹽(四隅)',
    meaning: 'Tịnh hoá không gian sống —灑淨+薰香+掃宅+撒鹽四 góc. Nghi thức nghiêm trọng do đạo trưởng chủ trì.',
    use: '鎮宅 · 淨化 · 除穢',
    sources: [
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=6 (全國宗教資訊網 收驚/淨化)',
      'https://www.baoan.org.tw/paper.php?action=show&id=11&lang=tw (保安宮 收驚法術醫療學術)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 9.2.',
  },
  {
    id: 'FA_SONGJING', layer: 'ritual', school: '通用 / 早晚功課',
    name_han: '誦經', name_vi: 'Tụng Kinh',
    han_text: '淨口淨心 → 焚香 → 誦經迴向（《北斗經》《三官經》《清靜經》《心印妙經》）',
    meaning: 'Tụng kinh = tu hành văn hoá, phi y tế. 早晚功課 + 大型法會擇日. Kết hợp 懺悔消災.',
    use: '修持 · 消災 · 迴向',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (北斗經)',
      'https://zh.wikisource.org/zh-hans/%E5%A4%AA%E4%B8%8A%E4%B8%89%E5%85%83%E8%B5%90%E7%A6%8F%E8%B5%A6%E7%BD%AA%E8%A7%A3%E5%8E%84%E6%B6%88%E7%81%BD%E5%BB%B6%E7%94%9F%E4%BF%9D%E5%91%BD%E5%A6%99%E7%BB%8F (三官經)',
      'http://www.taoist.org.cn/getDjzsByC2Action.do?c2=csjd (中國道教協會 常誦經典)',
    ],
    textual_certainty: 'high', notes: 'AM-TA Round 9.3.',
  },
  {
    id: 'FA_ANTAISUI', layer: 'ritual', school: '正一 / 民俗 — 安太歲',
    name_han: '安太歲', name_vi: 'An Thái Tuế',
    han_text: '擇日安奉 → 誦北斗經 → 每月初一十五上香（太歲符/太歲燈/本命元辰星君像）',
    meaning: 'An Thái Tuế = hóa giải phạm thái tuế (thuận tinh/vọng tinh/xung/thết/hại/phá/kế). Lập xuân前后 an phùng. Miếu/vũ hoặc đạo trưởng chủ trì.',
    use: '化太歲 · 解厄 · 安奉',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E7%8E%84%E9%9D%88%E5%8C%97%E6%96%97%E8%A7%A3%E5%8E%84%E6%9C%AC%E5%91%BD%E5%BB%B6%E7%94%9F%E7%9C%9F%E7%B6%93 (北斗經)',
      'https://zh.daoinfo.org/index.php?title=%E6%8B%9C%E6%96%97 (道教文化中心 拜斗/安太歲)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 9.5.',
  },
  {
    id: 'FA_SHOUJING_TW', layer: 'ritual', school: '台灣民俗 收驚（喊驚/硩驚/收魂/叫魂）',
    name_han: '收驚（台灣）', name_vi: 'Thu Hồn (Đài Loan)',
    han_text: '受驚者持衣物 → 焚香唸收驚口訣 → 以米比劃(卜米) → 招魂安魂(本命元辰/十二生肖) → 收驚符(部分)',
    meaning: '著驚 = dân tục cho rằng hồn phách受驚暫離; thu hồn = triệu hồi hồn phách、an hồn định thần. STRONGEST academic sourcing trong toàn module.',
    use: '收驚 · 安魂', recitation_context: 'Practitioner: 收驚婆(行天宮著名)/道長/法師(正一/閭山/靈寶). 屬民俗療法, phi y tế; triệu chứng kéo dài →尋醫師/心理專業.',
    sources: [
      'https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=6 (全國宗教資訊網 內政部 收驚 GOV)',
      'https://tdr.lib.ntu.edu.tw/handle/123456789/97051?mode=full (臺灣大學 魂魄猶可知 thesis)',
      'https://www.airitilibrary.com/Publication/Index/17277647-200904-201411250017-201411250017-198-225 (行天宮 收驚婆 academic)',
    ],
    textual_certainty: 'high', notes: 'AM-TA Round 6;strongest sourcing. 米/香/收驚婆 all independently confirmed.',
  },
  {
    id: 'FA_HUASHA_HK', layer: 'ritual', school: '港式 — 風水化煞 + 道館驅邪',
    name_han: '化煞（港式）', name_vi: 'Hóa Sát (Hồng Kông)',
    han_text: '形煞識別(路沖/壁刀/天斬/樑壓/對門沖) → 化煞物: 八卦鏡/葫蘆/五帝錢/石獅麒麟',
    meaning: 'Hóa sát dạng thức: 八卦鏡(凸反射/凹吸收/平遮擋), 葫蘆( thu sát, hợp門對門), 五帝錢(hóa門 sat). 八卦鏡 cấm phản sat cho hàng xóm (đạo đức).',
    use: '化煞 · 鎮宅', recitation_context: '開光 = đạo trưởng誦咒/點眼/敕令,法器「點靈」nghi thức. 化煞嚴重 do phong thủy sư/道長實地評估.',
    sources: [
      'https://hhh.com.tw/columns/detail/7295 (幸福空間 八卦鏡4大禁忌)',
      'http://paper.wenweipo.com/2017/07/21/FI1707210047.htm (香港文匯報 樓市八卦陣)',
      'https://www.sina.cn/news/detail/5010538771252480.html (新浪 小葫蘆化煞)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 7.八卦鏡禁忌=反射給鄰居倫理考量.',
  },
  {
    id: 'FA_FANGSHENG', layer: 'ritual', school: '佛道通用 — 放生',
    name_han: '放生', name_vi: 'Phóng Sanh',
    han_text: '購買(鮮活魚/鳥,非入侵種) → 誦放生咒 → 釋放 → 迴向',
    meaning: 'Phóng sanh = tu công đức. 宜 甲子/庚申 hoặc phật đ诞/đạo đ诞. 忌 phóng sinh入quân chủng/break sinh thái.',
    use: '積德 · 迴向',
    sources: [
      'https://zh.wikipedia.org/wiki/放生 (維基百科 放生)',
      'https://baike.baidu.com/item/放生 (百度百科 放生)',
    ],
    textual_certainty: 'partial', notes: 'AM-TA Round 9.4;tuân thủ luật động vật hoang dã địa phương.',
  },
  {
    id: 'FA_SHOUJUE', layer: 'ritual', school: '通用 / 各派 — 手诀 · 手印 (ấn truyền)',
    name_han: '手訣 · 手印', name_vi: 'Thủ Quyết · Thủ Ấn (ấn truyền)',
    han_text: '（掐訣: 各指節配神將/星斗/五行 — 師傳 khẩu quyết, ít ghi chép）',
    meaning: 'ẤN TRUYỀN — các tư thế tay (手诀/手印) «kíp» thần tướng tinh đấu: mỗi đốt ngón tay = một thần/sao/hành, «掐诀» (bấm quyết) để triệu/d遣/sách. Hệ mật truyền khẩu, ít văn tự. Ví dụ: 五雷诀/天蓬诀/紫微诀/剑诀. Phối hợp 符+咒+罡+诀 thành «四秘».',
    use: 'tham chiếu ấn truyền (KHÔNG tự kết — cần sư truyền).', recitation_context: '«四秘» = 符+咒+罡+诀 phối hợp hành pháp; thực do 受箓 道士.',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT 道法會元 卷162 上清天蓬伏魔大法 — 天蓬诀)',
      'https://zh.daoinfo.org/index.php?title=%E6%89%8B%E6%B1%BA (道教文化中心 手诀)',
      'https://www.shidianguji.com/book/DZ1220 (識典古籍 道法會元 DZ1220 — 雷法/手诀 hệ)',
    ],
    textual_certainty: 'partial', notes: 'Ấn truyền khẩu; mỗi诀 khó verify verbatim. Chỉ mô tả hệ.',
  },
  {
    id: 'FA_GANGBU', layer: 'ritual', school: '通用 / 各派 — 罡步 · 步罡踏斗 (禹步)',
    name_han: '罡步 · 步罡踏斗（禹步）', name_vi: 'Cương Bộ · Bộ Cương Đạp Đẩu (Vũ Bộ)',
    han_text: '（禹步三九: 配 北斗/二十八宿 — 法師踏「罡」布炁）',
    meaning: 'LÀM PHÉP — pháp sư «步罡踏斗» (bước theo sao Cương, đạp北斗/二十八宿) để «lấy khí tinh tú». Bắt nguồn «禹步» (Vũ vương bước — truyền Đại Vũ trị thủy). Phối hợp 符咒诀 thành pháp sự.',
    use: 'tham chiếu nghi thức (do 道士).', recitation_context: 'Mao Sơn/正一 法事 bước Cương; 茅山志載. Thực do 受箓 道士.',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=497389 (CTEXT 茅山志 — 禹步/罡步)',
      'https://zh.wikipedia.org/wiki/%E7%A6%B9%E6%AD%A5 (維基百科 禹步)',
      'https://zh.daoinfo.org/index.php?title=%E6%AD%A5%E7%BD%A1%E8%B8%8F%E6%96%97 (道教文化中心 步罡踏斗)',
    ],
    textual_certainty: 'partial', notes: '禹步 lịch sử chuẩn; quy chi tiết mỗi phái khác.',
  },
  {
    id: 'FA_LEIFA', layer: 'ritual', school: '雷法 — 清微 · 神霄 · 天蓬 (五雷正法)',
    name_han: '雷法（五雷正法）', name_vi: 'Lôi Pháp (Ngũ Lôi Chính Pháp)',
    han_text: '（内丹为体, 符咒为用 — «以我之本炁, 合天地之造化»; 召雷/祈雨/驱邪）',
    meaning: 'LÀM PHÉP đỉnh cao Đạo giáo — 雷法 (清微/神霄 phái, Tống phát triển): «内丹为体, 符咒为用» — lấy nội đan công lực làm gốc, phối 符+咒+诀+罡 triệu lôi. «五雷正法» = trời-lửa-lôi-thủy-thần (hoặc 5 phương). Thiên蓬 nguyên soái hệ 北帝雷法.',
    use: 'tham chiếu pháp thuật tối cao (do 高道).', recitation_context: 'DZ1220 道法会元 = đại biên 雷法; 须高道内丹功底. KHÔNG tự hành.',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT 道法會元 卷162 上清天蓬伏魔大法 DZ1220)',
      'https://zh.wikipedia.org/wiki/%E9%9B%B7%E6%B3%95 (維基百科 雷法 — 清微/神霄)',
      'https://www.shidianguji.com/book/DZ1220 (識典古籍 道法會元 DZ1220)',
    ],
    textual_certainty: 'partial', notes: '雷法 = nội đan+符咒; «以我本炁合天地造化» doc. Tống phát triển.',
  },
  {
    id: 'FA_FAQI', layer: 'ritual', school: '通用 — 法器 (đạo cụ hành pháp)',
    name_han: '法器（桃木劍 · 帝鐘 · 令旗 · 法印 · 拷鬼棒）', name_vi: 'Pháp Khí (đạo cụ)',
    han_text: '（朱砂/黃紙 + 桃木劍 + 帝鐘 + 令旗(五營) + 法印 + 淨水缽 + 拷鬼棒）',
    meaning: 'Bộ đạo cụ hành pháp: 朱砂+黃紙 (vẽ符), 桃木劍 (trừ tà), 帝鐘/三清鈴 (chấn tà thông thần), 令旗 (triệu ngũ dinh binh tướng), 法印 (quyền thần — «ấn»), 淨水 (tịnh), 拷鬼棒 (chế ngụy/tà).',
    use: 'tham chiếu đạo cụ.', recitation_context: 'AM-TA Round 3.3 verified: 朱砂/黃紙/桃木剑/令旗/帝钟.',
    sources: [
      'https://www.shenlu.com.tw/news_detail/60.htm (神盧 道家法器 桃木劍/帝鐘)',
      'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=320687 (國家文化記憶庫 茅山派符籙 — 朱砂黃紙)',
      'docs/AM-TA-SPEC.md (Round 3.3 法器 verified W12)',
    ],
    textual_certainty: 'high', notes: '法器 bộ chuẩn, verified AM-TA Round 3.3.',
  },
  {
    id: 'FA_FAYIN', layer: 'ritual', school: '正一 / 各派 — 法印 · 神印 (ấn quyền)',
    name_han: '法印 · 神印', name_vi: 'Pháp Ấn · Thần Ấn',
    han_text: '（印文: «道經師寶»/«北極驅邪»/«天蓬印»… — 蓋符/牒,「神權» chứng）',
    meaning: 'ẤN QUYỀN — 法印 (đạo ấn) = «thần quyền» chứng: «道經師寶印» (tổng), «北極驅邪印»/«天蓬印» (trừ tà), «城隍印» (địa phương)...盖 lên 符/牒 mới «linh». Tượng trưng quyền pháp sư (đã thụ 箓).',
    use: 'tham chiếu ấn quyền.', recitation_context: 'Phải 受箓 道士 mới có/quản ấn;盖符 nghi thức «敕符».',
    sources: [
      'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符釋例 — 印 văn)',
      'http://www.rsd.fju.edu.tw/images/uploads/FJRS/16-05.pdf (輔仁大學 書符與靈驗 — 法印)',
      'docs/AM-TA-SPEC.md (Round 3/4 符籙 hệ — ấn)',
    ],
    textual_certainty: 'partial', notes: '印 văn hệ chính一; mỗi ấn quyền khác. Verified doctrine.',
  },
];

// ----------------------------------------------------------------------------
//  EXPORTS — aggregate + chart-aware suggestion (Phase 1 chart-aware).
// ----------------------------------------------------------------------------
export const TALISMANS = [..._MANTRAS, ..._FU, ..._RITUALS];

// Map R.amta.detected indicator ids → relevant 符咒/ritual (chart-aware, hedged).
// id thật từ analyzeAmTa: huagai-taiyin, guchen-guasu, diaoke, sifei, yinchayangcuo,
// taiyuan-meet-mo, rizhuo-weak-guansha-strong, guiyue-7th-month, jiesha-wangshen.
export function suggestByAmTa(amta) {
  if (!amta || !amta.detected || !amta.detected.length) return [];
  const hay = amta.detected.map((d) => d.id).join(' ');
  const has = (k) => hay.includes(k);
  const out = new Set();
  if (has('diaoke')) ['FA_SHOUJING_TW', 'FU_LUSHAN_SHOUJING', 'FA_JINGZHAI', 'ZHOU_BEI_DI_TIAN_PENG'].forEach((i) => out.add(i));
  if (has('guiyue')) ['FA_SONGJING', 'FA_JINGZHAI', 'ZHOU_JING_XIN'].forEach((i) => out.add(i));
  if (has('huagai') || has('guchen') || has('jiesha') || has('wangshen') || has('taiyin')) ['ZHOU_JIN_GUANG', 'FU_MAOSHAN_XIE', 'FA_SHUFU', 'FA_BAIDOU'].forEach((i) => out.add(i));
  if (has('rizhuo')) ['FA_BAIDOU', 'FU_ZHENGYI_BEIDOU', 'ZHOU_JIN_GUANG'].forEach((i) => out.add(i));
  if (has('yinchayangcuo') || has('taiyuan')) ['FU_HE_JING_PING_AN', 'FA_JINGZHAI'].forEach((i) => out.add(i));
  if (has('sifei')) ['ZHOU_JIN_GUANG', 'FA_SONGJING'].forEach((i) => out.add(i));
  if (!out.size) ['ZHOU_JIN_GUANG', 'FA_SONGJING'].forEach((i) => out.add(i));
  return [...out].map((id) => TALISMANS.find((t) => t.id === id)).filter(Boolean);
}
