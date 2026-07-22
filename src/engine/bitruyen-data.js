// ============================================================================
//  BÍ TRUYỀN · THẤT TRUYỀN · TÀN QUYỂN — DATA MODULE (tổng hợp từ tài liệu cổ)
//  Văn bản thất lạc (失传), bản sao tay/残卷 (敦煌残卷), khẩu quyết mật truyền
//  (口诀/秘传), bí bản (秘本/钞本). Mỗi entry: lai lịch + LÝ DO thất truyền +
//  phần còn sót/tái dựng + provenance. Tái dụng vật liệu repo đã OCR (docs/ocr-*)
//  + kb.js exports (SANMING_ZHIMI_LOST_TEXTS / MANGPAI_KOUJUE / TIEBAN_SHENSHU /
//  TUIBEITU-MAQIANKE-SHAOBINGE / LANTAI_PATTERNS).
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS (mirrors AM-TA): tài liệu tham khảo văn hoá-tôn giáo/học thuật.
//  Phần «tái dựng» (reconstructed) phải ghi rõ là SUY ĐOÁN/HỢP LẬP học thuật, không
//  phải nguyên văn chuẩn. KHÔNG dùng予言 để dọa nạt/«chắc chắn tương lai». ≥2 nguồn.
//  textual_certainty đa số partial/low — trung thực về tính thất truyền.
//  Pure ES module. `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
export { ETHICS };

export const BITRUYEN = [
  // ── 失传 kinh điển 命理 (Tang-Song, reconstructed) ────────────────────────
  {
    id: 'LOST_SANMING_ZHIMI', layer: 'bitruyen',
    school: '古法 失传 — 三命指迷赋 (珞琭子 / 岳珂 chú)',
    name_han: '三命指迷赋', name_vi: 'Tam Mệnh Chỉ Mê Phú',
    han_text: '三元主本，五行是先（core cương lĩnh）',
    lost_reason: 'Thất truyền — bản toàn văn không còn; chỉ còn trích đoạn qua các sách hậu thế trích dẫn (类书/chú thư). Hiện chỉ tái dựng được cốt lõi «三元主本，五行是先» (nguyên cục-cơ-bản + ngũ hành là tiên quyết).',
    survives: 'Cương lĩnh «三元主本，五行是先»; doktrin 三元 (thiên-địa-nhân nguyên) + ngũ hành ưu tiên. App ĐÃ encode trong kb.js: SANMING_ZHIMI_LOST_TEXTS + docs/ocr-sanmingzhimi-ctext.md.',
    meaning: 'Cổ phú thất truyền nền tảng tam mệnh — nhấn mạnh tam nguyên chủ bản + ngũ hành làm gốc (tiền đề cho cả 子平 sau này). Tái dựng từ tàn迹.',
    use: 'Tham chiếu nguồn cổ pháp (reconstructed).',
    sources: [
      'https://baike.baidu.com/item/%E4%B8%89%E5%91%BD%E6%8C%87%E8%BF%B7%E8%B5%8B/358754 (百度百科 三命指迷赋 — 珞琭子/岳珂 chú, «三元主本五行是先»)',
      'docs/ocr-sanmingzhimi-ctext.md (OCR ctext — tàn迹 三命指迷赋 trong app)',
      'docs/FEATURE-INDEX.md (app: SANMING_ZHIMI_LOST_TEXTS, round 33)',
    ],
    textual_certainty: 'low', notes: 'TEXTUAL UNCERTAINTY cao: bản toàn văn thất truyền, chỉ cương lĩnh + trích đoạn được attested. Đánh dấu «reconstructed».',
  },
  {
    id: 'LOST_LUOLUZI_XIAOXI', layer: 'bitruyen',
    school: '古法 禄命 urtext — 珞琭子三命消息赋 (4 Tống chú)',
    name_han: '珞琭子三命消息赋', name_vi: 'Lạc Lộ Tử Tam Mệnh Tiêu Tức Phú',
    han_text: '五行通道，取用多門；理于賢人，亂于不肖（cương lĩnh）',
    lost_reason: 'Tác giả 珞琭子 (ẩn sĩ truyền thuyết, có lẽ Tang-Song). Bản gốc thất truyền;dòng truyền chỉ còn qua BỐN chú giả Tống độc lập: 王廷光/李仝/釋曉瑩/徐子平 — mỗi chú dẫn văn hơi khác (textually unstable, lý tưởng cho stemma).',
    survives: 'Toàn phú + 4 chú Tống ( wikisource/ctext, bản 四庫). Cương lĩnh «五行通道取用多門» + «珞琭子» được 四库提要 gọi là «所自出» của cả văn hiến 禄命. App có OCR: docs/ocr-gufa-grok.md (珞琭子赋注).',
    meaning: 'Urtext của cả hệ 禄命/bát tự — «五行通道，取用多門» (ngũ hành thông đạo, lấy dùng nhiều ngõ). Bốn chú Tống đại diện 4 dòng giải thích → phản ánh truyền thừa phức tạp.',
    use: 'Tham chiếu urtext cổ pháp.',
    sources: [
      'https://zh.wikisource.org/zh-hant/%E7%8F%9E%E7%90%AD%E5%AD%90%E4%B8%89%E5%91%BD%E6%B6%88%E6%81%AF%E8%B3%A6%E6%B3%A8 (維基文库 珞琭子三命消息赋注)',
      'https://ctext.org/wiki.pl?if=gb&chapter=353295&remap=gb (CTEXT 珞琭子三命消息赋注)',
      'docs/ocr-gufa-grok.md (app OCR 珞琭子赋注 — scan PD)',
    ],
    textual_certainty: 'partial', notes: '4 chú Tống biến dị; urtext ổn định hơn tam chỉ mê. 四库提要 nhận định «所自出».',
  },
  {
    id: 'LOST_LIXUZHONG', layer: 'bitruyen',
    school: '古法 三命 — 李虚中命书 (Tang, 鬼谷子 attributed)',
    name_han: '李虚中命书', name_vi: 'Lý Hư Trung Mệnh Thư',
    han_text: '推人壽夭貴賤，百不失一二（韩愈 墓誌銘 trích）',
    lost_reason: 'Thất truyền một phần —李虚中 (Tang, 字常容) được xem là tổ tam mệnh.韩愈 viết mộ chí nhưng KHÔNG nhắc có sách; 《唐书艺文志》 cũng không có tên sách; đến Tống mới xuất «李虚中命书». Bản hiện tại tái dựng từ 《永乐大典》.',
    survives: '3卷 (卷上/中/下) — 神頭祿 60甲子 + 天乙贵人 bản gia + ngũ âm lý luận. App OCR: docs/ocr-gufa-grok.md + ocr-gufa2-grok.md (Grok-4 Heavy, scan PD).',
    meaning: 'Hệ tam mệnh (lấy năm-tháng-ngày-giờ chi can tương sinh thắng suy đoán mệnh). Nền tảng trước 子平. «推人寿夭贵贱百不失一二» (đoán thọ yểu quý tiện, trăm không sai một hai) —韩愈 mộ chí.',
    use: 'Tham chiếu tổ tam mệnh (reconstructed).',
    sources: [
      'https://ctext.org/searchbooks.pl?if=en&author=%E9%AC%BC%E8%B0%B7%E5%AD%90 (CTEXT 鬼谷子 lineage: 李虚中命书)',
      'docs/ocr-gufa2-grok.md (app OCR 神頭祿 60甲子 + 天乙贵人 — scan PD)',
      'https://baike.baidu.com/item/%E6%9D%8E%E8%99%9A%E4%B8%AD%E5%91%BD%E4%B9%A6 (百度百科 李虚中命书 — 永乐大典 tái dựng)',
    ],
    textual_certainty: 'partial', notes: 'Tác giảKyilian hư trung xác; «鬼谷子撰» đề attributed. Bản hiện = 永乐大典 tái dựng.',
  },
  {
    id: 'LOST_GUIGUZI_LINEAGE', layer: 'bitruyen',
    school: '方士/隐士 truyền thuyết — 鬼谷子 (Chiến Quốc)',
    name_han: '鬼谷子（命書 hệ）', name_vi: 'Quỷ Cốc Tử (hệ mệnh thư)',
    han_text: '（鬼谷子 = truyền thuyết ẩn sĩ Chiến Quốc; nhiều sách mệnh/thuyết được gán ghép）',
    lost_reason: '鬼谷子 (Vương Hủ?) — ẩn sĩ huyền thoại Chiến Quốc, sư của Tôn Tẫn/Bàng Quyên/Trương Nghi. Bản thân KHÔNG để sách; hậu thế GÁN nhiều thư mệnh/thuyết/binh cho ngài (ngụy tác nhiều).',
    survives: '«鬼谷子» (thuyết hợp hoành + binh); hệ mệnh thư (李虚中命书/珞琭子) đều «tổ» attributed về鬼谷子 — mang tính thần thánh hóa dòng truyền hơn là tác giả thật.',
    meaning: 'Đại diện «phương sĩ/ẩn sĩ huyền thoại» — nhiều hệ bí truyền đều gán tổ về鬼谷子 để hợp pháp hóa truyền thừa. Hiện tượng «ngụy tác» phổ biến cổ đại.',
    use: 'Tham chiếu dòng truyền mệnh thư (chứng thực tác giả cẩn thận).',
    sources: [
      'https://ctext.org/searchbooks.pl?if=gb&author=%E9%AC%BC%E8%B0%B7%E5%AD%90 (CTEXT 鬼谷子 tác phẩm hệ)',
      'https://zh.wikipedia.org/wiki/%E9%AC%BC%E8%B0%B7%E5%AD%90 (維基百科 鬼谷子 — ẩn sĩ truyền thuyết)',
    ],
    textual_certainty: 'low', notes: 'TEXTUAL UNCERTAINTY: ngụy tác nhiều; gán ghép tổ phổ biến. Đánh dấu «truyền thuyết/ngụy».',
  },
  {
    id: 'LOST_YUZHAO', layer: 'bitruyen',
    school: '古法 失传 — 玉照定真经 (Tấn? 郭璞 attributed)',
    name_han: '玉照定真经', name_vi: 'Ngọc Chiếu Định Chân Kinh',
    han_text: '（断语 lấy tượng can chi — «岁命» hệ; 1卷残）',
    lost_reason: 'Thất truyền đại phận — đề 郭璞 (Tấn) chú nhưng niên đại/tác giả tranh cãi. Bản hiện 1卷残 (tứ khố tồn nghi). Nội dung đoán ngữ lấy tượng can-chi («岁命» hệ).',
    survives: '1卷断语 (tứ kh库 bản); ảnh hưởng lên 子平 「断语」 phong cách.',
    meaning: 'Cổ kinh đoán mệnh lấy tượng can chi («岁命» — tuổi+mệnh). Đề 郭璞 chú (tồn nghi). Phong cách断语 ngắn gọn → ảnh hưởng 子平.',
    use: 'Tham chiếu phong cách断语 cổ.',
    sources: [
      'https://baike.baidu.com/item/%E7%8E%89%E7%85%A7%E5%AE%9A%E7%9C%9F%E7%BB%8F (百度百科 玉照定真经 — 郭璞 attributed/tồn nghi)',
      'https://ctext.org/ (CTEXT 道藏/四库 bản nếu có)',
    ],
    textual_certainty: 'low', notes: 'Tác giả/niên đại tồn nghi; bản 1卷残. Cờ uncertainty.',
  },

  // ── 敦煌残卷 (tàn quyển thật) ────────────────────────────────────────────
  {
    id: 'DH_LUMING', layer: 'bitruyen',
    school: '敦煌写本残卷 — 禄命书 (唐-五代)',
    name_han: '敦煌本 禄命书残卷（推九天行年灾厄法）', name_vi: 'Đôn Hoàng Lộc Mệnh Tàn Quyển',
    han_text: '《推人九天宫法》/《推九天行年灾厄法》（敦煌写本 P.12842v / P.14740 / S.13724v / P.13779）',
    lost_reason: 'TÀN QUYỂN thật —敦煌莫高窟藏经洞 (đóng kín ~11c, mở lại 1900) phát hiện vô số bản viết tay thuật số, nay rải rác:法藏(P.,BnF巴黎)/英藏(S.,大英图书馆)/国图(NLC). 多 tàn cuốn, một đề tài nhiều卷号.',
    survives: '《推九天行年灾厄法》/《推人九天宫法》= nhiều卷号 (P.12842v/P.14740/S.13724v/P.13779). Độn hoàng còn: 卜法/式法/相书/梦书/宅经/葬书/时日宜忌/事项占(占病/占婚嫁/占走失/逆刺占). Số hóa: IDP (idp.bl.uk) / 数字敦煌 / 法藏敦煌遗书 NLC.',
    meaning: 'Hệ lộc-mệnh (độn hoàng) đoán tai ách theo «行年» (tuổi chạy) + «九天». Đây là dạng TIỀN thân của tam mệnh/bát tự — cực quý cho nghiên cứu nguồn gốc thuật mệnh. Phản ảnh sinh hoạt唐-五代.',
    use: 'Tham chiếu nguồn gốc thuật mệnh (学术).',
    sources: [
      'https://idp.bl.uk/ (International Dunhuang Project — 敦煌遗书 số hóa)',
      'https://www.e-dunhuang.com/ (数字敦煌)',
      'http://read.nlc.cn/allSearch/searchList?searchType=10022 (法藏敦煌遗书 — 国家图书馆 高清)',
      'https://www.cass.cn/xueshuchengguo/xscg_lsyjy/202306/t20230606_5642971.shtml (中国社科院 敦煌占卜文书与唐五代社会生活)',
    ],
    textual_certainty: 'partial', notes: '卷号 học thuật (P./S.); nội dung đoán ngữ — dịch từ viết tay cổ, cần chuyên thuật. Đây là tàn quyển thật, quý cho nguồn gốc thuật mệnh.',
  },
  {
    id: 'DH_YINYANG_SHU', layer: 'bitruyen',
    school: '敦煌/日本保存残卷 — 大唐阴阳书 (吕才 勒修正)',
    name_han: '大唐阴阳书（残卷）', name_vi: 'Đại Đường Âm Dương Thư (tàn quyển)',
    han_text: '（唐太宗 勒 吕才 刊正 —第一部官方 综合 术数/择日 典籍; 残）',
    lost_reason: 'THẤT TRUYỀN tại Trung Quốc đại lục — 唐太宗 thấy《阴阳书》«近代渐致讹伪,穿凿既甚,拘忌亦多» → 勒 吕才+学者10余人刊正 (chính thức đầu tiên). Bản Trung Quốc thất truyền; quan trọng nhất còn lưu GIỮA NHẬT (手抄残卷).',
    survives: 'Bản tàn quyển Nhật Bản giữ (shuge.org ghi «日本保存的最重要占卜典籍»). Phản ảnh thuật số/择日 chính thức Đường — ảnh hưởng hậu thế.',
    meaning: 'Đại diện thuật số CHÍNH THỨC (quan phương Đường) — đầu tiên hệ thống hóa 阴阳/择日. «吕才刊正» = chuẩn hóa lại sau khi phái sinh phức tạp. Nền tảng trạch nhật/am-dương học sau.',
    use: 'Tham chiếu nguồn chính thức thuật số Đường.',
    sources: [
      'https://www.shuge.org/meet/topic/63720/ (書格 大唐阴阳书 手抄残卷 — Nhật giữ)',
      'https://nagoya.repo.nii.ac.jp/record/31104/files/k13377_thesis.pdf (名古屋 «唐代的术数与思想» — 宅经/禄命/葬书/阴阳书 academic)',
    ],
    textual_certainty: 'partial', notes: 'Bản chính thất truyền; Nhật giữ tàn quyển. «吕才刊正» lịch sử chuẩn.',
  },

  // ── 秘传/口诀 (khẩu quyết mật truyền) ────────────────────────────────────
  {
    id: 'SEC_MANGPAI', layer: 'bitruyen',
    school: '盲派 秘传 — 口诀 (khẩu truyền cho người mù đoán mệnh)',
    name_han: '盲派口诀', name_vi: 'Manh Phái Khẩu Quyết',
    han_text: '（口诀: vị trí × thần = đoán; 40 verse金口诀 — sư truyền khẩu, ít ghi chép）',
    lost_reason: 'BÍ TRUYỀN — 盲派 (phái thầy luận mù) truyền KHẨU quyết sư-đệ, ít ghi chép văn tự (mù không đọc). Mãi sau mới被人 thu thập成văn bản (口诀 tài). Hiện tàn/rải rác.',
    survives: '40 verse金口诀 (vị trí × thần = đoán); framework «作功/三法/宫位象». App ĐÃ encode: kb.js MANGPAI_KOUJUE + MANGPAI_*; OCR: docs/ocr-mangpai-koujue.md.',
    meaning: 'Dòng đoán mệnh «thực chiến» của phái mù — đoán nhanh theo khẩu quyết vị-trí×thần (không lý thuyết nhiều). Cực quý vì hiếm văn tự.',
    use: 'Tham chiếu kỹ đoán thực chiến.',
    sources: [
      'docs/ocr-mangpai-koujue.md (app OCR 盲派口诀)',
      'docs/FEATURE-INDEX.md (app: MANGPAI_KOUJUE 40 verses, round 39; MANGPAI_ZUOGONG/SANFA/GONGWEI_XIANG round 26/29)',
    ],
    textual_certainty: 'partial', notes: 'Khẩu truyền; văn bản thu thập muộn. App đã encode.',
  },
  {
    id: 'SEC_TIEBAN', layer: 'bitruyen',
    school: '铁板神数 秘传 — 神数 bí truyền',
    name_han: '鐵板神数', name_vi: 'Thiết Bản Thần Số',
    han_text: '（12000+ 条 thần số — bát tự → số → đối chiếu «章»; khẩu quyết riêng）',
    lost_reason: 'BÍ TRUYỀN — 12000+ điều thần số + «算盘» khẩu quyết, truyền ít, đệ tử phải «破章» (giải mã) mới dùng được. Truyền 邵雍 → đời sau, nhiều nhánh thủ mật.',
    survives: 'Thần số条 + khẩu quyết (rải rác, nhiều bản dị). App reference: kb.js TIEBAN_SHENSHU; OCR: docs/ocr-tieban-camky.md.',
    meaning: 'Thần số bí truyền: bát tự → «số» → đối chiếu 12000+ thơ-văn đoán mệnh. «铁板» = «chắc như sắt» (đoán chi tiết). Cần «破章» khẩu quyết.',
    use: 'Tham chiếu (bí truyền reference).',
    sources: [
      'docs/ocr-tieban-camky.md (app OCR 铁板神数)',
      'docs/FEATURE-INDEX.md (app: TIEBAN_SHENSHU, round 35)',
      'https://zh.wikipedia.org/wiki/%E9%90%B5%E6%9D%BF%E7%A5%9E%E6%95%B8 (維基百科 铁板神数)',
    ],
    textual_certainty: 'partial', notes: 'Bí truyền; nhiều bản dị «章». App đã reference.',
  },
  {
    id: 'SEC_WEIYAN_SAN', layer: 'bitruyen',
    school: '预言秘本 cấm kỵ — 推背图 / 马前课 / 烧饼歌',
    name_han: '推背图 · 马前课 · 烧饼歌', name_vi: 'Thôi Bối Đồ · Mã Tiền Khóa · Thiêu Bính Ca',
    han_text: '（预言诗图 — 推背图60象/马前课14课/烧饼歌;历代 cấm）',
    lost_reason: 'CẤM kỵ + bí truyền —预言 thư「lật đổ» nên历triều CẤM (sợ dụng chính trị). Bản «thật» tàng trữ mật, dân gian lưu bản dị nhiều.',
    survives: '推背图 (Đường · Lý Thuần Phong / Viên Thiên Cang, 60 tượng); 马前课 (Thục Hán · Gia Cát Lượng, 14 khóa); 烧饼歌 (Minh · Lưu Bá Ôn). App ĐÃ encode: kb.js TUIBEITU+MAQIANKE_SHAOBINGE (round 38/41).',
    meaning: 'Bộ 3予言 cấm — đoán «thiên hạ đại thế». Phản ảnh dân-tâm而非 tương lai chắc; học thuật coi là văn hiến dân gian/chính trị.',
    use: 'Tham chiếu văn hiến予言 (KHÔNG đoán chắc).',
    sources: [
      'docs/FEATURE-INDEX.md (app: TUIBEITU+MAQIANKE_SHAOBINGE round 38/41)',
      'https://zh.wikipedia.org/wiki/%E6%8E%A8%E8%83%8C%E5%9B%BE (維基百科 推背图)',
      'https://zh.wikipedia.org/wiki/%E9%A9%AC%E5%89%8D%E8%AF%BE (維基百科 马前课)',
    ],
    textual_certainty: 'low', notes: 'Cấm + bản dị nhiều;予言 = văn hiến dân gian, KHÔNG đoán chắc. Cờ uncertainty.',
  },

  // ── 秘本/钞本 (bí bản, bản sao tay) ──────────────────────────────────────
  {
    id: 'SEC_WANFA_GUIZONG', layer: 'bitruyen',
    school: '符咒秘本 — 万法归宗 (16册 5卷, ẩn danh)',
    name_han: '萬法歸宗', name_vi: 'Vạn Pháp Quy Tông',
    han_text: '（符咒大汇编 — 16册5卷; ẩn danh, khắc ấn niên đại bất詳）',
    lost_reason: 'BÍ BẢN — «vạn pháp quy tông» (mọi phép về một gốc) = đại biên soạn符咒, tác giảẩn danh, khắc ấn niên đại bất詳. Dân gian lưu truyền sao chép tay, bản dị nhiều.',
    survives: '16册5卷 符咒 (各类符+咒+诀). shuge.org có bản điện tử (chỉ «học nghiên cứu, không làm theo»).',
    meaning: 'Tổng tập符咒 bí truyền — «vạn pháp quy tông». Cốt: mọi thuật符咒 đều dẫn về một «đạo» gốc. Đại biểu cho符咒 dân gian-tôn giáo.',
    use: 'Tham chiếu符咒 tổng tập (KHÔNG thực hành).',
    sources: [
      'https://old.shuge.org/ebook/wan-fa-gui-zong/ (書格 万法归宗 16册5卷 — học nghiên cứu)',
      'https://ctext.org/wiki.pl?if=en&chapter=186107&remap=gb (CTEXT 辰州符咒大全 相關)',
    ],
    textual_certainty: 'low', notes: 'ẩn danh + niên đại bất详; bản dị nhiều. Cờ uncertainty. 符 KHÔNG thực hành.',
  },
  {
    id: 'SEC_LUBAN', layer: 'bitruyen',
    school: '匠作秘本 — 鲁班经 (Minh, 木匠符法)',
    name_han: '魯班經', name_vi: 'Lỗ Ban Kinh',
    han_text: '（木匠法 + 符 + 厌胜 — Minh 流行; «鲁班» tổ匠 attributed）',
    lost_reason: 'BÍ BẢN — thư「匠作秘法»(thuật người thợ mộc: 符/厌胜/择日), «鲁班» tổ匠 attributed. Dân gian lưu hành, nhiều bản dị + cấm (vì «厌胜» hại người).',
    survives: '《鲁班经》 (Minh万历刻本流传) —匠师诀+符+厌胜术 (truyền «thợgomộc»). Cấm vì厌胜 («đ submerged vật» hại chủ).',
    meaning: 'Thư匠作 bí truyền — tổ匠鲁班 attributed. Bao符/厌胜/择日. «厌胜» = thuật «áp» (có thể hại) → cấm.',
    use: 'Tham chiếu匠作 dân gian (cấm thực hành厌胜).',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%AD%AF%E7%8F%AD%E7%B6%93 (維基百科 鲁班经)',
      'https://baike.baidu.com/item/%E9%B2%81%E7%8F%AD%E7%BB%8F (百度百科 鲁班经 — 明刻本)',
    ],
    textual_certainty: 'partial', notes: 'Minh万历刻 bản ổn định; «鲁班» attributed;厌胜 cấm.',
  },
  {
    id: 'SEC_LANTAI_NAYIN', layer: 'bitruyen',
    school: '纳音 秘传 — 兰台妙选 (元, 60甲子纳音)',
    name_han: '蘭台妙選', name_vi: 'Lan Đài Diệu Tuyển',
    han_text: '（42 纳音 cách cục — 桑柳成林/桂林凤凰… 古法纳音 đoán）',
    lost_reason: 'BÍ TRUYỀN cổ — 42 cách cục nạp âm đoán (元代唐锦章?). Truyền ít, sau nhập《星平会海》. Hiện tham chiếu nạp âm quý.',
    survives: '42 patterns (桑柳成林/桂林凤凰…). App ĐÃ encode: kb.js LANTAI_PATTERNS (42, round 31); OCR: docs/ocr-lantai-ctext.md.',
    meaning: 'Cổ bí truyền nạp âm — 42 «cách cục» tượng trưng (桑柳成林 = mộc-mộc rậm, chủ phú). Đoán theo nạp âm 60 giáp tý.',
    use: 'Tham chiếu nạp âm cách cục.',
    sources: [
      'docs/ocr-lantai-ctext.md (app OCR 兰台妙选 ctext)',
      'docs/FEATURE-INDEX.md (app: LANTAI_PATTERNS 42, round 31)',
    ],
    textual_certainty: 'partial', notes: 'Truyền ít, nhập星平会海; 42 patterns đã encode.',
  },
  {
    id: 'SEC_WUXING_MIJUE', layer: 'bitruyen',
    school: '演禽/五星 秘诀 — 七政四余/演禽 (推禽星)',
    name_han: '五星秘诀 / 演禽 (tàn)', name_vi: 'Ngũ Tinh Bí Quyết / Diễn Cầm',
    han_text: '（演禽28宿配干支推命; 七政四余; 考 định khiếmTang-Song tiền）',
    lost_reason: 'BÍ TRUYỀN + thất truyền một phần —演禽 (28 tú+sáu súc phối chi can đoán) +七政四余 (thiên văn đoán). Cổ nhưng khảo định khiếmTang-Song tiền (có lẽ hậu Đường). Truyền rải rác.',
    survives: '演禽 (禽星易见/演禽正传) + 七政四余; bài phê bình «十一曜 critique». App: OCR docs/ocr-wuxingjingji-ctext.md + FEATURE-INDEX GEO_WUXING_PERSON/SHIYIYAO_CRITIQUE (round 30).',
    meaning: 'Thuật đoán mệnh thiên văn-cầm thú:演禽 (28 tú × 6 súc) +七政四余 (Nhật+Nguyệt+5 hành tinh + dư khí). Tiền-khoa học thiên văn.',
    use: 'Tham chiếu thiên văn đoán.',
    sources: [
      'docs/ocr-wuxingjingji-ctext.md (app OCR 五星秘诀 ctext)',
      'docs/FEATURE-INDEX.md (app: GEO_WUXING_PERSON/SHIYIYAO_CRITIQUE round 30)',
    ],
    textual_certainty: 'low', notes: 'Khảo định khiếm; truyền rải rác. Cờ uncertainty.',
  },
];
