// ============================================================================
//  TRƯỜNG PHÁI ĐẠO GIÁO / PHƯƠNG SĨ — DATA + MA TRẬN ĐỐI CHIẾU (Phase: schools)
//  «chính xác các trường phái để đối chiếu với nhau» — profile từng phái + ma trận
//  so sánh đa chiều. Mục đích: đối chiếu交叉 giữa các phái (đặc trưng pháp / thần hệ
//  /kinh điển /受箓 /xuất gia). Mỗi phái ≥2 nguồn độc lập.
//  ----------------------------------------------------------------------------
//  ⚠ ETHICS: tham chiếu văn hoá-tôn giáo/học thuật. Không phái nào là «đúng nhất»;
//  ghi nhận biến thể khu vực/trường phái. Pure ES module. `node --check`.
// ============================================================================
import { ETHICS } from './amta-data.js';
export { ETHICS };

// Dimension definitions cho ma trận đối chiếu.
export const COMPARE_DIMS = [
  { key: 'founder',    vi: 'Tổ sư / nguồn' },
  { key: 'era',        vi: 'Thời đại' },
  { key: 'seat',       vi: 'Đạo tràng / trung tâm' },
  { key: 'canon',      vi: 'Kinh điển chính' },
  { key: 'coreMethod', vi: 'Đặc trưng pháp thuật' },
  { key: 'deity',      vi: 'Thần hệ chính' },
  { key: 'ordination', vi: 'Thụ 箓 / truyền độ' },
  { key: 'monastic',   vi: 'Xuất gia / cư sĩ' },
  { key: 'region',     vi: 'Khu vực lan truyền' },
];

export const SCHOOLS = [
  {
    id: 'zhengyi', zh: '正一派', vi: 'Chính Nhất (Thiên Sư Đạo)',
    founder: '张道陵 (东汉, nguyên Thái đạo → chính nhất)', era: 'Đông Hán (34–156)',
    seat: 'Long Hổ Sơn (江西) — «đạo giáo tổ đình»', canon: '《正一法文》《正一修真》《道藏·正一部》; 符籙 hệ',
    coreMethod: '符籙 par excellence + 拜斗/解厄/驱邪/章醮; «道法會元» thu hoạch',
    deity: 'Tam Thanh + 天師 (张道陵) + 北斗本命元辰 + Lục丁六甲',
    ordination: '受箓 hệ (đô công/盟 oai/tam động/ngũ nhạc) — cấp bậc quyết định 符 được phép書',
    monastic: 'Cư sĩ/«火居» đạo sĩ (có gia đình)居多; chủ trì dân gian科仪',
    region: 'Toàn Hoa, mạnh Giang Nam/Đài Loan/Việt Nam tín ngưỡng dân gian',
    distinctive: '«Phù lục phái» tiêu biểu — 符籙 + 受箓 = cốt lõi; không buộc xuất gia',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%AD%A3%E4%B8%80%E9%81%93 (維基百科 正一道)',
      'https://zh.daoinfo.org/index.php?title=%E6%AD%A3%E4%B8%80%E6%B4%BE (道教文化中心 正一派)',
      'https://www.daoist.org/BookSearch(test)/list012/628.pdf (道教在線 正一道符釋例)',
    ],
  },
  {
    id: 'quanzhen', zh: '全真道', vi: 'Toàn Chân',
    founder: '王重陽 (金, 1113–1170)', era: 'Kim/Nam Tống',
    seat: 'Bắc Kinh Bạch Vân Quan (đại tông) + Chung Nam Sơn 重陽宮', canon: '《重陽立教十五論》; 道藏·太玄 bộ; tam giáo hợp nhất (đạo/儒/佛)',
    coreMethod: 'Nội đan tu hành (tinh-khí-thần) + sớm tối công khóa (八大神咒) + tĩnh tọa; ít 符籙',
    deity: 'Tam Thanh + Ngũ Tổ (Đông Hoa/Chính Dương/Thuần Dương/HTQ...) + Bắc Thất thất chân',
    ordination: 'Truyền độ (quy y/受 giới) + «tam đàn đại giới» — xuất gia nghiêm',
    monastic: 'XUẤT GIA (đạo sĩ xuất gia, trì giới, chay, độc thân) — khác正一',
    region: 'Phía BẮC Hoa强势 (sau Kim/Nam Tống) — «南正一, bắc全真»',
    distinctive: 'Nội đan + xuất gia + tam giáo hợp nhất; sớm tối công khóa là mặt trận thần chú',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%85%A8%E7%9C%9F%E9%81%93 (維基百科 全真道)',
      'https://baike.baidu.com/item/%E5%85%A8%E7%9C%9F%E6%95%99 (百度百科 全真教)',
    ],
  },
  {
    id: 'maoshan', zh: '茅山派', vi: 'Mao Sơn (Thượng Thanh)',
    founder: 'Tam Mao chân quân (Mao Do/Mao Cố/Mão Trung) + Đào Hoằng Cảnh tập đại thành', era: 'Hán-Đường (thượng thanh phái Đông Tấn)',
    seat: 'Cúc Dung Mao Sơn (Giang Tô)', canon: '《茅山志》(元·Lưu Đại Bân, DZ0304) + 《上清大洞 chân kinh》',
    coreMethod: '驱邪收妖 + 符 5 đoạn + 存思 (thượng thanh «đại động») + 步罡踏斗',
    deity: 'Tam Mao chân quân + Tam Thanh + thượng thanh thần hệ',
    ordination: '受箓 (thượng thanh hệ) — đạo sĩ驱邪 chuyên nghiệp',
    monastic: 'Đạo sĩ (có xuất gia + cư sĩ) — chuyên驱邪/收妖',
    region: 'Giang Nam (Mao Sơn) + lan truyền thần thoại «Mao Sơn thuật» dân gian',
    distinctive: '«驱邪 phái» — 符 5 đoạn (頭/身/腹/膽/腳) + 存思; dân gian thường hiểu «Mao Sơn = phép tiên»',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=497389 (CTEXT 茅山志)',
      'https://zh.wikisource.org/wiki/%E8%8C%85%E5%B1%B1%E5%BF%97 (維基文库 茅山志)',
      'https://www.shidianguji.com/zh/book/DZ0304 (識典古籍 DZ0304 33卷)',
    ],
  },
  {
    id: 'lushan', zh: '閭山派', vi: 'Lư Sơn (Tam Nãi)',
    founder: '許逊 (許 chân quân) + 陳靖姑 (三奶) + pháp chủ chân quân', era: 'Tống-Nguyên (hình thành Mân-Việt)',
    seat: 'Mân (Phúc Kiến) + lan Đài Loan', canon: '《閭山法》 (khẩu truyền + 鈔本) + 三奶 hệ',
    coreMethod: '救產護胎 + 收惊 + 驱妖 trừ sát; «hồng đầu pháp sư» =閭山 tam nãi hệ',
    deity: '許逊 + 陳靖姑 (临 thủy phu nhân) + 林 cửu nương + lý tam nương (tam nãi)',
    ordination: 'Truyền pháp (hồng đầu pháp sư) — không nhất thiết đạo giáo chính thống',
    monastic: 'Cư sĩ pháp sư («hồng đầu» = «ô đầu» đối lập) — dân gian',
    region: 'Phúc Kiến/Đài Loan/Việt Nam (Mân-Việt văn hóa chung) — mạnh nam',
    distinctive: '«Tam nãi» pháp (nữ thần 陳靖姑) + 收惊/救 sản; nhập Đài Loan sớm (1590)',
    sources: [
      'https://zh.daoinfo.org/index.php?title=%E9%96%AD%E5%B1%B1%E6%B4%BE (道教文化中心 閭山派)',
      'https://zh.wikipedia.org/wiki/%E8%87%A8%E6%B0%B4%E5%A4%AB%E4%BA%BA (維基百科 临水夫人=陳靖姑)',
    ],
  },
  {
    id: 'qingwei', zh: '清微派', vi: 'Thanh Vi',
    founder: 'Tổ thanh vi (truyền Thượng Thanh → Thanh Vi)', era: 'Đường-Tống (thịnh Tống-Nguyên)',
    seat: 'Vũ Đương Sơn + Thanh Vi sơn', canon: '《清微斋法》《道法會元》(thanh vi bộ); DZ1220',
    coreMethod: '雷法 — «内丹为体, 符咒为用»; hợp nội đan + 符 + 咒 + 诀',
    deity: 'Thanh vi nguyên bối + 雷部 thần (九辰/五雷)',
    ordination: '受箓 (thanh vi hệ) — nặng nội đan công lực',
    monastic: 'Đạo sĩ (cả xuất gia/cư sĩ) — cao đạo nội đan',
    region: 'Vũ Đương + toàn đạo giáo (ảnh hưởng lớn雷 pháp)',
    distinctive: '雷 pháp «thể-dụng» — nội đan làm gốc, 符咒 làm dụng; «以我本炁 hợp thiên địa tạo hóa»',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%9B%B7%E6%B3%95 (維基百科 雷法 — 清微/神霄)',
      'https://www.shidianguji.com/book/DZ1220 (識典古籍 道法會元 DZ1220)',
    ],
  },
  {
    id: 'shenxiao', zh: '神霄派', vi: 'Thần Tiêu',
    founder: '王文卿 (1083–1153, Bắc Tống) + Lâm Linh Tố', era: 'Bắc Tống-Nam Tống',
    seat: 'Thần Tiêu (thiên cung tượng trưng) + Vũ Đương', canon: '《神霄玉書》/ 道法會元 thần tiêu bộ',
    coreMethod: '雷 pháp ĐỈNH — «五雷正 pháp»; «thần tiêu» = cao nhất cửu thiên',
    deity: 'Thần tiêu chân vương + 九宸 thần + 雷 bộ nguyên soái',
    ordination: 'Truyền thần tiêu雷 pháp (cao đạo nội đan + 符咒)',
    monastic: 'Đạo sĩ xuất gia/cư sĩ — trọng nội đan',
    region: 'Bắc Tống hoàng gia ủng hộ (Huy Tông) → toàn đạo giáo',
    distinctive: '«五雷 chính pháp» đỉnh — coi «thần tiêu» là cửu thiên cao nhất; hợp hoàng quyền Tống',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%9B%B7%E6%B3%95 (維基百科 雷法 — 神霄/王文卿)',
      'https://baike.baidu.com/item/%E7%A5%9E%E9%9C%84%E6%B4%BE (百度百科 神霄派)',
    ],
  },
  {
    id: 'beidi', zh: '北帝派', vi: 'Bắc Đế (Phong Đô)',
    founder: ' («北極紫微» thần hệ; 邓 Tiểu Dương truyền «thiên bồng đại pháp»)', era: 'Đường (thịnh Đường-Tống)',
    seat: 'Phong Đô (trung tâm «âm phủ» tượng trưng)', canon: '《北帝伏魔神咒妙經》(DZ1412) + 道法會元 thiên bồng bộ (DZ1220)',
    coreMethod: 'Trừ quỷ/sát quỷ + «天蓬 nguyên soái» thống 30 vạn binh; 叩齿36 thông',
    deity: 'Bắc Đế (紫微) + 天蓬 nguyên soái + 天猷/翊 thánh (bắc cực tứ thánh)',
    ordination: 'Truyền bắc đế/phong đô pháp (trừ tà chuyên)',
    monastic: 'Đạo sĩ — chuyên trừ tà/sát quỷ',
    region: 'Toàn đạo giáo (trừ tà hệ phổ biến)',
    distinctive: '«Trừ quỷ phái» — thiên bồng chú nguyên lõi («天蓬天蓬, cửu huyền sát đồng»); phong đô = «âm ty»',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&chapter=557999 (CTEXT 北帝伏魔神咒妙經 DZ1412)',
      'https://ctext.org/wiki.pl?if=gb&chapter=247662 (CTEXT 道法會元 卷162 天蓬伏魔 DZ1220)',
    ],
  },
  {
    id: 'dongyuan', zh: '洞渊派', vi: 'Động Uyên',
    founder: '(truyền «vương toản» 受神咒; 道 dân cứu tế)', era: 'Đường (kinh Đường lưu hành)',
    seat: '(không cố định — «chuyển kinh» pháp sự)', canon: '《太上洞淵神咒經》(DZ0335, 20卷)',
    coreMethod: '«Chuyển kinh» cứu đạo dân + 殺鬼/缚鬼/禁鬼/斩鬼 phẩm thần chú +斋 pháp',
    deity: 'Thượng thiên ma vương/quỷ vương lập thệ + thiên đinh lực sĩ',
    ordination: 'Truyền động uyên thần chú (chuyển kinh cứu tế)',
    monastic: 'Đạo sĩ — «chuyển kinh» cứu tế',
    region: 'Đường lưu hành (sau nhập 各 phái神咒 hệ)',
    distinctive: 'Không «đơn nhất thần chú» mà là các «品» (殺鬼/缚鬼...) — cờ textual uncertainty',
    sources: [
      'https://ctext.org/wiki.pl?if=gb&res=190395&remap=gb (CTEXT 太上洞淵神咒經 DZ0335)',
      'https://zh.wikipedia.org/zh-cn/%E5%A4%AA%E4%B8%8A%E6%B4%9E%E6%B7%B5%E7%A5%9E%E5%92%92%E7%B6%93 (維基百科 太上洞渊神咒经)',
    ],
  },
  {
    id: 'lingbao', zh: '灵宝派', vi: 'Linh Bảo',
    founder: '葛玄 (truyền) + 陸 tu tĩnh (Lưu Tống, tập đại thành khoa nghi)', era: 'Đông Tấn-Nam Bắc Triều',
    seat: 'Cát Hiệt Linh Bảo Sơn (truyền) + nhiều', canon: '《灵宝度人经》(度 nhân kinh = cốt lõi) + 《灵宝领教济度金书》; DZ lớn',
    coreMethod: 'Khoa nghi đại sư — «斋醮» (pháp sự cứu tế, độ亡, tạ thần) hệ thống hóa',
    deity: 'Tam Thanh + 天 tôn (原始天尊 ...) + linh bảo thần hệ',
    ordination: '受箓 (linh bảo hệ) — nặng khoa nghi trình tự',
    monastic: 'Đạo sĩ (xuất gia/cư sĩ) — chuyên khoa nghi/pháp sự',
    region: 'Toàn đạo giáo (khoa nghi = «linh bảo» gốc)',
    distinctive: '«Khoa nghi phái» — chương trình pháp sự (斋醮) hệ thống; «độ nhân kinh» phổ biến',
    sources: [
      'https://zh.wikipedia.org/wiki/%E9%9C%8A%E5%AF%B6%E6%B4%BE (維基百科 靈寶派)',
      'https://zh.wikipedia.org/wiki/%E5%BA%A6%E4%BA%BA%E7%BB%8F (維基百科 度人經)',
    ],
  },
  {
    id: 'jingming', zh: '净明道', vi: 'Tịnh Minh',
    founder: '許逊 (許 chân quân,晋) + 刘 Ngọc (Nguyên, tập đại thành)', era: 'Tây Tấn (nguồn) → Nguyên (tập đại thành)',
    seat: 'Tây Sơn Vạn Thọ (Giang Tây Nam Xương)', canon: '《净明忠孝全书》; «trung hiếu» làm gốc',
    coreMethod: '«忠孝» (trung hiếu) + «净明» (tịnh minh tâm) — nho-đạo hợp nhất; ít 符',
    deity: '許逊 (cảm ứng thiên tôn) + tam thanh',
    ordination: 'Truyền «trung hiếu» — cư sĩ nặng (đức hạnh hơn 符咒)',
    monastic: 'Cư sĩ nặng — «tu tại gia», trọng đạo đức',
    region: 'Giang Tây (đặc trưng) — nho giáo ảnh hưởng mạnh',
    distinctive: '«Nho-đạo hợp nhất» — trung hiếu làm gốc; «净明» = tâm tịnh sáng (đạo đức tu hành)',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%87%80%E6%98%8E%E9%81%93 (維基百科 净明道)',
      'https://baike.baidu.com/item/%E5%87%80%E6%98%8E%E9%81%93 (百度百科 净明道 — 許逊/刘玉)',
    ],
  },
  {
    id: 'danding', zh: '丹鼎派', vi: 'Đan Đỉnh (Đông Hoa/Nội Đan)',
    founder: 'Lữ Đồng Bin (truyền) + 魏 Bá Dương (参同契 tổ) + 葛洪水 ngoại đan', era: 'Hán-Đường (ngoại) → Tống (nội đan thịnh)',
    seat: 'Không cố định — ẩn sĩ tu hành', canon: '《周易参同契》《悟真篇》《抱朴子》; 道藏 lớn',
    coreMethod: 'Nội đan (tinh-khí-thần) + ngoại đan (luyện khoáng) + dưỡng sinh (导引/吐纳)',
    deity: 'Đông Hoa đế quân + Lữ Đồng Bin + nam ngũ tổ/bắc thất thật',
    ordination: 'Sư-đệ truyền nội đan khẩu quyết («mãc»)',
    monastic: 'Cả xuất gia (cao đạo) + ẩn sĩ cư sĩ',
    region: 'Toàn (ẩn sĩ tu hành núi sâu)',
    distinctive: '«Tu tiên phái» — luyện đan (nội/ngoại) là cốt; nền tảng toàn bộ tu hành đạo giáo',
    sources: [
      'https://zh.wikipedia.org/wiki/%E5%86%85%E4%B8%B9 (維基百科 内丹)',
      'https://zh.wikipedia.org/wiki/%E5%91%A8%E6%98%93%E5%8F%83%E5%90%8C%E5%A5%91 (維基百科 参同契)',
    ],
  },
  {
    id: 'fangshi', zh: '方士/隐士', vi: 'Phương Sĩ / Ẩn Sĩ (không phái cố định)',
    founder: ' (không tổ cố định — từ Chiến Quốc 「hầu sinh lư sinh」)', era: 'Chiến Quốc → hiện đại',
    seat: 'Không cố định — ẩn cư (终南/華山/武當/long hổ)', canon: 'Không kinh cố định — truyền bác học',
    coreMethod: 'Tìm tiên/luyện đan/chiêm tinh/phương thuật/节气 — «bách gia» của huyền học',
    deity: 'Không thần hệ cố định — tùy cá nhân',
    ordination: 'Sư-đệ truyền hoặc tự tu',
    monastic: 'Ẩn sĩ (xuất thế) — «cư sơn lâm»',
    region: 'Toàn (mỗi thời có «ẩn sĩ» nổi)',
    distinctive: 'Không phải «phái» tổ chức — là «loại người» huyền học (từ phúc tìm tiên đến ẩn sĩ tu hành)',
    sources: [
      'https://zh.wikipedia.org/wiki/%E6%96%B9%E5%A3%AB (維基百科 方士 — Chiến Quốc-Hán)',
      'https://zh.wikipedia.org/wiki/%E9%9A%B1%E5%A3%AB (維基百科 隐士)',
    ],
  },
];

// Build ma trận đối chiếu: rows = dims, cols = schools, cells = school[dim].
export function compareMatrix(schoolIds) {
  const schools = schoolIds && schoolIds.length ? SCHOOLS.filter((s) => schoolIds.includes(s.id)) : SCHOOLS;
  return COMPARE_DIMS.map((d) => ({ dim: d, cells: schools.map((s) => ({ school: s, value: s[d.key] || '—' })) }));
}

// Helper: tìm phái theo id.
export function getSchool(id) { return SCHOOLS.find((s) => s.id === id); }
