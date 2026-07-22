// ============================================================================
//  CÔNG PHÁP TU HÀNH — DATA MODULE (Phase 3: 内丹 / 外丹 / 清修)
//  Mined từ attributions/doctrine chuẩn (魏伯阳/葛洪/张伯端/张君房) + wikisource/
//  ctext/wikipedia. Mô tả hệ + ngữ cảnh; KHÔNG dẫn verbatim dài chưa verify.
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (mirrors AM-TA): tham chiếu văn hoá-tôn giáo/học thuật. Công pháp tu
//  hành thật sự (导引/吐纳/存想/炼丹) cần sư thừa chỉ dẫn — app chỉ giới thiệu tri
//  thức, KHÔNG hướng dẫn tự luyện (nguy hiểm nếu sai). ≥2 nguồn/entry.
//  Pure ES module. `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
export { ETHICS };

export const CULTIVATION = [
  {
    id: 'DAN_CANTONG_QI', layer: 'cultivation',
    school: '内丹 / 外丹 — «萬古丹經王»',
    name_han: '周易參同契', name_vi: 'Chu Dịch Tham Đồng Khế',
    han_text: '以乾坤為鼎爐，以坎離為藥物（丹道綱領）',
    meaning: 'Cơ sở lý luận 内丹 + 外丹. Biến Dịch học (乾坤坎離) thành thuật luyện đan: 乾坤=đỉnh lô(鼎爐), 坎離=dược vật(藥物). Tác giả 魏伯陽, cuối Đông Hán; 35 chương (大易總敘→自敘啟後). Sau này 悟真篇 / 金丹大要 đều dựa vào đây.',
    use: 'Tham chiếu công pháp 内丹.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%91%A8%E6%98%93%E5%8F%83%E5%90%8C%E5%A5%91 (維基百科 周易參同契 — 魏伯陽/东汉/35章/鼎爐坎離)',
      'https://zh.wikisource.org/wiki/%E5%91%A8%E6%98%93%E5%8F%83%E5%90%8C%E5%A5%91 (維基文库 周易參同契 — primary text)',
      'https://ctext.org/ (中國哲學書電子化計劃 — 道藏本 周易參同契)',
    ],
    textual_certainty: 'high', notes: 'Cương lĩnh «乾坤為鼎爐，坎離為藥物» xác nhận zh.wikipedia.',
  },
  {
    id: 'DAN_BAOPUZI', layer: 'cultivation',
    school: '外丹 / 内丹 / 导引 — 葛洪 (東晉)',
    name_han: '抱朴子（内篇）', name_vi: 'Bão Phác Tử (nội thiên)',
    han_text: '（内篇論神仙金液神丹、導引、房中、養生 — 外篇論世事）',
    meaning: '葛洪 (283–343, 東晉) — 道士/alchemy gia. 《抱朴子》内篇 20 + 外篇 50: nội thiên bàn tiên tiên/dược đan (金丹)/導引/行氣/房 trung thuật; ngoại thiên bàn thế sự (nho). Cầu tiên via luyện đan + tích đức. Nền tảng ngoại đan (luyện khoáng vật) + manh nha nội đan.',
    use: 'Tham chiếu nền tảng ngoại đan + dưỡng sinh.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%8A%B1%E4%B%BB%8F%E5%AD%90 (維基百科 抱朴子)',
      'https://zh.wikisource.org/wiki/%E6%8A%B1%E6%9B%BC%E5%AD%90 (維基文库 抱朴子)',
      'https://ctext.org/wiki.pl?if=gb&res=109106 (CTEXT 抱朴子)',
    ],
    textual_certainty: 'high', notes: 'Tác giả/năm/thể lệ chuẩn. Verbatim dẫn theo từng chương — verify khi quote.',
  },
  {
    id: 'DAN_WUZHENPIAN', layer: 'cultivation',
    school: '内丹 — 南宗 / 全陽派 (张伯端)',
    name_han: '悟真篇', name_vi: 'Ngộ Chân Thiên',
    han_text: '（内丹 kinh điển — 與参同契並稱「丹經王」雙璧）',
    meaning: '张伯端 (字用成, 號紫陽山人, 987–1082, 北宋) — 内丹南宗 tổ. 《悟真篇》dùng thơ từ (诗词) truyền 内丹 khẩu quyết, hợp 三教 (道/儒/佛), 与《参同契》並稱丹經雙璧. Mở 内丹 流派 系統化 (sau có 金丹大要).',
    use: 'Tham chiếu 内丹 hệ thống.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%82%9F%E7%9C%9F%E7%AF%87 (維基百科 悟真篇 — 张伯端/北宋)',
      'https://zh.wikisource.org/ (維基文库 悟真篇)',
      'https://ctext.org/ (CTEXT 悟真篇 道藏本)',
    ],
    textual_certainty: 'high', notes: 'Tác giả 张伯端(紫陽)/北宋 chuẩn. 口诀 dạng诗词 — verify khi quote từng thủ.',
  },
  {
    id: 'DAN_YUNJI_QIQIAN', layer: 'cultivation',
    school: '道教百科 / 总集 (张君房, 北宋)',
    name_han: '雲笈七籤', name_vi: 'Vân Tất Thất Thiêm',
    han_text: '（122卷 — 摘要輯《大宋天宮寶藏》; 道教「小百科」）',
    meaning: '张君房 (北宋) phụng chỉ biên 《大宋天宮寶藏》(4565卷), sau trích xuất tinh hoa → 《雲笈七籤》122卷 (序 1015). «七籤»=7 loại (三洞四辅). Được gọi là «道教小百科» — tổng hợp kinh/lực/仪/丹/fu/tu. Nguồn tham chiếu trọng yếu cho mọi研究方向 đạo giáo.',
    use: 'Tham chiếu bách khoa đạo giáo.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E4%BA%91%E7%AC%88%E4%B8%83%E7%AD%BE (維基百科 雲笈七籤)',
      'https://ctext.org/wiki.pl?if=gb&res=548282008 (CTEXT 雲笈七籤 太玄部)',
      'https://github.com/lhw828/GuWen/blob/main/md/%E9%81%93%E8%97%8F.md (lhw828/GuWen catalog: 雲笈七籤 2.9MB)',
    ],
    textual_certainty: 'high', notes: 'Biên soạn giả/năm/122卷/thể lệ chuẩn.',
  },
  {
    id: 'DAN_QINGJING_JING', layer: 'cultivation',
    school: '清修 / 内丹心法 (太上老君說常清靜經)',
    name_han: '太上老君說常清靜經', name_vi: 'Kinh Thường Thanh Tĩnh',
    han_text: '（清靜無為 — 内丹/清修 tâm pháp cơ bản; 全真早晚功課必誦）',
    meaning: 'Kinh ngắn (~400字) luận «清靜» — tâm thanh tĩnh thì thần cư, thần cư thì khí tụ, khí tụ thì tinh sinh (内丹 tam bảo 精氣神). Toàn chân早晚功課 tất诵读. Tác giả đề 太上老君 (thực 唐-宋 lưu hành). Cốt: «人能常清靜，天地悉皆歸».',
    use: 'Tham chiếu 清修 tâm pháp.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E8%80%81%E5%90%9B%E8%AA%AA%E5%B8%B8%E6%B8%85%E9%9D%9C%E7%B6%93 (維基文库 太上老君說常清靜經)',
      'https://ctext.org/ (CTEXT 道藏本 清靜經)',
      'https://baike.baidu.com/item/%E6%B8%85%E9%9D%99%E7%BB%8F (百度百科 清靜經)',
    ],
    textual_certainty: 'partial', notes: 'Kinh tồn tại chuẩn; «人能常清靜,天地悉皆歸» phổ biến nhưng verify từng câu khi quote verbatim.',
  },
  {
    id: 'DAN_NEIGUAN_JING', layer: 'cultivation',
    school: '内观 / 存想修心 (太上老君内观經)',
    name_han: '太上老君内觀經', name_vi: 'Kinh Nội Quan',
    han_text: '（内觀心法 — 觀心/觀神; 存想修身）',
    meaning: 'Luận «内觀» — quan sát nội tâm, nhận bản tâm (心者,一身之主). Công pháp 存想/内觀 (sau này 全真/静功 dùng). Liên kết đạo đức (à善) + tu tâm.',
    use: 'Tham chiếu 内觀/存想.',
    sources: [
      'https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B8%8A%E8%80%81%E5%90%9B%E5%85%A7%E8%A7%80%E7%B6%93 (維基文库 太上老君内觀經)',
      'https://ctext.org/ (CTEXT 道藏本 内觀經)',
    ],
    textual_certainty: 'partial', notes: 'Kinh tồn tại; doctrine 内觀/觀心 chuẩn.',
  },
];
