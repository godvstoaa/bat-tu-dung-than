// ============================================================================
//  PHƯƠNG THUẬT / ẨN SĨ / PHƯƠNG SĨ — DATA MODULE (Phase 4: 方術 tam thức + dân gian)
//  Mô tả các hệ phương thuật truyền thống + nguồn. Nhiều hệ ĐÃ implement trong
//  kb.js / engines (chế độ công cụ tương tác) — ghi chú cross-ref.
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (mirrors AM-ta): tham chiếu văn hoá-tôn giáo/học thuật. KHÔNG dự đoán
//  chắc tương lai, KHÔNG thay thế quyết định/y tế. ≥2 nguồn/entry.
//  Pure ES module. `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
export { ETHICS };

export const PHUONGTHUAT = [
  {
    id: 'FANG_QIMEN', layer: 'phuongthuat',
    school: '三式之首 — 奇門遁甲 (Hoàng đế / Binh gia)',
    name_han: '奇門遁甲', name_vi: 'Kỳ Môn Độn Giáp',
    han_text: '（三式之一 — 天盤九星 / 地盤八門 / 八神 / 奇儀; 1080局 → 18局）',
    meaning: '«Bóng tối ba kỳ sáu nghi» — tam thức đứng đầu, truyền Hoàng đế chiến Xi Vưu. Dùng cho binh pháp/thời/ phương vị cát hung. Lập trời(9 tinh)/đất(8 môn)/thần(8 thần)+can kỳ(乙丙丁) + six nghi(戊己庚辛壬癸). (ĐÃ implement trong app: công cụ Kỳ Môn — main.js runQimen.)',
    use: 'Tham chiếu lựa thời/ phương / binh pháp.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%A5%87%E9%96%80%E9%81%81%E7%94%B2 (維基百科 奇門遁甲)',
      'https://ctext.org/wiki.pl?if=gb&res=54917 (CTEXT 奇門遁甲 相關)',
      'docs/ (app engine: src/engine/qimen — main.js runQimen)',
    ],
    textual_certainty: 'partial', notes: 'Hệ chuẩn; 1080→18局 lịch sử (cải bởi Trương Lượng). Cross-ref engine app.',
  },
  {
    id: 'FANG_LIUREN', layer: 'phuongthuat',
    school: '三式 — 大六壬 (thiên văn / chiêm nghiệm)',
    name_han: '大六壬', name_vi: 'Đại Lục Nhâm',
    han_text: '（三式之一 — 四課 / 三傳 / 天將 / 天地盤; 720課）',
    meaning: 'Tam thức (cùng 太乙/奇門), thiên văn-lịch pháp. Lập 4 khoá (四課) + 3 truyền (三傳) + 12 thiên tướng + thiên/địa bàn. Dùng chiêm sự việc cát hung. (app: công cụ Lục Nhâm — main.js runLiuren.)',
    use: 'Tham chiếu chiêm sự cát hung.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%85%AD%E5%A3%AC (維基百科 六壬)',
      'https://ctext.org/ (CTEXT 六壬 toàn書)',
      'docs/ (app engine: src/engine/liuren — main.js runLiuren)',
    ],
    textual_certainty: 'partial', notes: 'Hệ chuẩn; cross-ref engine app.',
  },
  {
    id: 'FANG_MEIHUA', layer: 'phuongthuat',
    school: '梅花易數 — 邵雍 (北宋)',
    name_han: '梅花易數', name_vi: 'Mai Hoa Dịch Số',
    han_text: '（心易 — 取象起卦: thời/số/ziyet/vạn vật đều khả khởi）',
    meaning: '邵雍 (康節, 1011–1077, 北宋) truyền. «心易» — khởi quẻ từ tượng/số (đều là dự: thời gian, số, chữ, cảnh vật), linh hoạt hơn gieo quẻ cổ pháp. «Thể-dụng» luận cát hung. (app: công cụ Mai Hoa — main.js runMeihuaTime/Num.)',
    use: 'Tham chiếu dự đoán (thể/dụng).',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%A2%85%E8%8A%B1%E6%98%93%E6%95%B0 (維基百科 梅花易數)',
      'https://zh.wikisource.org/ (維基文库 梅花易數)',
      'docs/ (app engine: src/engine/meihua — main.js runMeihua)',
    ],
    textual_certainty: 'high', notes: 'Tác giả 邵康節/北宋 chuẩn. Cross-ref engine app.',
  },
  {
    id: 'FANG_TAIYI', layer: 'phuongthuat',
    school: '三式 — 太乙神数 (quốc vận / tam thức)',
    name_han: '太乙神数', name_vi: 'Thái Ất Thần Số',
    han_text: '（三式之首 — luận quốc vận / quân chủ-khách; 太乙十神 / 积年算）',
    meaning: 'Tam thức chuyên luận quốc vận/thiên tượng/chủ-khách (bình chiến). Thái ất thập thần + tích niên toán (元/紀/運). (app ĐÃ implement engine: analyze_taiyi trong FEATURE-INDEX.)',
    use: 'Tham chiếu quốc vận / chủ-khách.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%A4%AA%E4%B9%99%E7%A5%9E%E6%95%B0 (維基百科 太乙神数)',
      'docs/FEATURE-INDEX.md (app engine analyze_taiyi)',
    ],
    textual_certainty: 'partial', notes: 'Hệ chuẩn; ĐÃ implement engine app.',
  },
  {
    id: 'FANG_ZHUYOU', layer: 'phuongthuat',
    school: '祝由十三科 — y thuật thần bí (Hoàng đế)',
    name_han: '祝由十三科', name_vi: 'Chú Do Thập Tam Khoa',
    han_text: '（咒 ngữ + 符 — thượng cổ y thuật; «移精変気»治病）',
    meaning: 'Thượng cổ y-đạo (truyền 黃帝). «祝由» = niệm chú+dùng phù «移精変気» điều trị (chủ yếu chứng bị ét 邪/tâm thần thề). 13 khoa (cổ truyền ghi). 元-Ming từng thuộc y quan, sau bị loại. Hiện là văn hoá-dân gian, KHÔNG thay thế y tế.',
    use: 'Tham chiếu y-dân gian (KHÔNG trị bệnh).',
    sources: [
      'https://zh.wikipedia.org/wiki/%E7%A5%9D%E7%94%B1%E7%A7%91 (維基百科 祝由科)',
      'https://baike.baidu.com/item/%E7%A5%9D%E7%94%B1%E5%8D%81%E4%B8%89%E7%A7%91 (百度百科 祝由十三科)',
      'https://ctext.org/wiki.pl?if=gb&res=54910 (CTEXT 祝由 科 — 辰州符咒大全 相關)',
    ],
    textual_certainty: 'partial', notes: 'Hệ + 13 khoa lịch sử chuẩn (nguyên-Ming y quan). KHÔNG trị bệnh — ETHICS.',
  },
  {
    id: 'FANG_TAISUMAI', layer: 'phuongthuat',
    school: '太素脉 — mạch đoán mệnh (mystical)',
    name_han: '太素脉', name_vi: 'Thái Tố Mạch',
    han_text: '（取 mạch đoán mệnh — 3 quan × 9 hầu + ngũ hành; thượng cổ thần mạch）',
    meaning: 'Mạch-đoán-mệnh huyền bí: ngoài y-mạch, đoán quý tiện thọ yểu (cổ truyền). Truyền 樵 phi / 黄帝. «Thai Tố» = chất nguyên thủy của vạn vật. Hiện đa dân gian/huyền học, không y chuẩn.',
    use: 'Tham chiếu (huyền học — phi y chuẩn).',
    sources: [
      'https://baike.baidu.com/item/%E5%A4%AA%E7%B4%A0%E8%84%89 (百度百科 太素脉)',
      'https://zh.wikipedia.org/ (維基百科 太素脉 参考)',
    ],
    textual_certainty: 'low', notes: 'Huyền học dân gian; nguồn học thuật mỏng. textual_certainty=low (cờ).',
  },
  {
    id: 'FANG_TIEBAN', layer: 'phuongthuat',
    school: '铁板神数 — bí truyền (thần số)',
    name_han: '鐵板神數', name_vi: 'Thiết Bản Thần Số',
    han_text: '（12,000+ 条 thần số — từ bát tự sinh; «章» đối ứng «số»）',
    meaning: 'Thần số bí truyền: từ bát tự suy «số», đối chiếu 12,000+ điều (hoặc hơn) thơ-văn đoán mệnh. Truyền 邵雍 → đời sau. Tính «bàn tính» + «khẩu quyết». (app ĐÃ có reference: TIEBAN_SHENSHU trong kb.js / FEATURE-INDEX.)',
    use: 'Tham chiếu (bí truyền reference).',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%90%B5%E6%9D%BF%E7%A5%9E%E6%95%B8 (維基百科 铁板神数)',
      'docs/FEATURE-INDEX.md (app: TIEBAN_SHENSHU reference trong kb.js)',
    ],
    textual_certainty: 'partial', notes: 'Hệ bí truyền; nguồn học thuật + app reference.',
  },
  {
    id: 'FANG_DAOGAO_SHU', layer: 'phuongthuat',
    school: '方士 / ẩn sĩ truyền thống',
    name_han: '方士·隱士（職業譜系）', name_vi: 'Phương Sĩ · Ẩn Sĩ',
    han_text: '（方士: 戰國-漢 尋仙炼丹; 隱士: 避世修道 — 終南/華山/武當）',
    meaning: 'Phương sĩ (戰國-漢): Từ Phúc, Lư Sanh... phụng mệnh tìm tiên/luyện đan (Tần-Hoàng/Hán-Vũ). Ẩn sĩ:Trời đất tu hành (chân nhân/đạo sĩ) — 終南/華山/武當/long hổ. Hệ phái (正一/全真/茅山/閭山...) phát triển qua các ẩn sĩ-phương sĩ.',
    use: 'Tham chiếu ngữ cảnh lịch sử-tôn giáo.',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%96%B9%E5%A3%AB (維基百科 方士)',
      'https://zh.wikipedia.org/wiki/%E9%9A%B1%E5%A3%AB (維基百科 隱士)',
      'https://zh.wikipedia.org/wiki/%E9%81%93%E6%95%99 (維基百科 道教)',
    ],
    textual_certainty: 'partial', notes: 'Tiểu sử phương sĩ(戰國-漢)/ẩn sĩ — tài liệu lịch sử chuẩn.',
  },
];
