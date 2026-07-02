// ============================================================================
//  CƠ SỞ DỮ LIỆU HUYỀN HỌC — Bát Tự / Tử Bình (子平命理)
//  Dữ liệu gốc theo kinh điển Trung Hoa: Thiên Can, Địa Chi, Tàng Can,
//  Ngũ Hành sinh khắc, Thập Thần, và bảng Điều Hậu (窮通寶鑑 调候用神表).
//  Mọi quy tắc ở đây là TẤT ĐỊNH (deterministic) để bảo đảm kết quả nhất quán.
// ============================================================================

// ---- NGŨ HÀNH (五行) ----
export const WUXING = ['木', '火', '土', '金', '水'];
export const WX_VI = { 木: 'Mộc', 火: 'Hỏa', 土: 'Thổ', 金: 'Kim', 水: 'Thủy' };
export const WX_COLOR = { 木: '#2e9e5b', 火: '#e0533d', 土: '#caa14a', 金: '#c9cbd0', 水: '#3a7bd5' };

// Sinh (生): hành A sinh hành B
export const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
// Khắc (克): hành A khắc hành B
export const KE = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
// Đảo chiều để tra cứu nhanh
export const SHENG_BY = { 火: '木', 土: '火', 金: '土', 水: '金', 木: '水' }; // ai sinh ra X
export const KE_BY = { 土: '木', 金: '火', 水: '土', 木: '金', 火: '水' };       // ai khắc X

// ---- THIÊN CAN (天干) ----
// gan: chữ Hán, vi: Hán-Việt, wx: ngũ hành, yin: âm(true)/dương(false)
export const GAN = {
  甲: { vi: 'Giáp', wx: '木', yin: false },
  乙: { vi: 'Ất',   wx: '木', yin: true  },
  丙: { vi: 'Bính', wx: '火', yin: false },
  丁: { vi: 'Đinh', wx: '火', yin: true  },
  戊: { vi: 'Mậu',  wx: '土', yin: false },
  己: { vi: 'Kỷ',   wx: '土', yin: true  },
  庚: { vi: 'Canh', wx: '金', yin: false },
  辛: { vi: 'Tân',  wx: '金', yin: true  },
  壬: { vi: 'Nhâm', wx: '水', yin: false },
  癸: { vi: 'Quý',  wx: '水', yin: true  },
};

// ---- 十天干 类象 (方位/季节/脏腑/身体) ----
// [loop 1234] Nguồn: 《针灸大成》+ 鍼灸聚英(Wikisource) + 知乎 + 搜狐. wx/yin đã có trong GAN.
//   [规律] dương can phó phủ (甲丙戊庚壬→đởm/tiểu trường/vị/đại trường/bàng quang), âm can phó tạng.
//   Khẩu quyết: «甲胆乙肝丙小肠，丁心戊胃己脾乡；庚属大肠辛属肺，壬属膀胱癸肾脏».
export const GAN_LEIXIANG = {
  甲: { direction: 'đông', season: 'xuân', organ: 'đởm (胆)', body: 'đầu' },
  乙: { direction: 'đông', season: 'xuân', organ: 'can (肝)', body: 'cổ/yết hầu' },
  丙: { direction: 'nam', season: 'hạ', organ: 'tiểu trường (小肠)', body: 'vai' },
  丁: { direction: 'nam', season: 'hạ', organ: 'tâm (心)', body: 'tim' },
  戊: { direction: 'trung cung', season: 'trường hạ', organ: 'vị (胃)', body: 'sườn' },
  己: { direction: 'trung cung', season: 'trường hạ', organ: 'tỳ (脾)', body: 'bụng' },
  庚: { direction: 'tây', season: 'thu', organ: 'đại trường (大肠)', body: 'rốn' },
  辛: { direction: 'tây', season: 'thu', organ: 'phế (肺)', body: 'đùi' },
  壬: { direction: 'bắc', season: 'đông', organ: 'bàng quang (膀胱, tam tiêu)', body: 'cẳng chân' },
  癸: { direction: 'bắc', season: 'đông', organ: 'thận (肾, tâm bào)', body: 'bàn chân' },
};

// ---- ĐỊA CHI (地支) ----
export const ZHI = {
  子: { vi: 'Tý',   wx: '水', yin: true,  con: 'Chuột' },
  丑: { vi: 'Sửu',  wx: '土', yin: true,  con: 'Trâu'  },
  寅: { vi: 'Dần',  wx: '木', yin: false, con: 'Hổ'    },
  卯: { vi: 'Mão',  wx: '木', yin: true,  con: 'Mèo'   },
  辰: { vi: 'Thìn', wx: '土', yin: false, con: 'Rồng'  },
  巳: { vi: 'Tỵ',   wx: '火', yin: true,  con: 'Rắn'   },
  午: { vi: 'Ngọ',  wx: '火', yin: false, con: 'Ngựa'  },
  未: { vi: 'Mùi',  wx: '土', yin: true,  con: 'Dê'    },
  申: { vi: 'Thân', wx: '金', yin: false, con: 'Khỉ'   },
  酉: { vi: 'Dậu',  wx: '金', yin: true,  con: 'Gà'    },
  戌: { vi: 'Tuất', wx: '土', yin: false, con: 'Chó'   },
  亥: { vi: 'Hợi',  wx: '水', yin: false, con: 'Heo'   },
};

// ---- 十二地支 类象 (时辰/方位/月份/季节) ----
// [loop 1233] Nguồn: Wikipedia 地支 + 百度百科 + 搜狐 + 香港天文台. wx/yin/con đã có trong ZHI;
//   đây bổ sung hour/direction/month/season.
export const ZHI_LEIXIANG = {
  子: { hour: '23-01', direction: 'bắc', month: '11 (đông nguyệt)', season: 'đông' },
  丑: { hour: '01-03', direction: 'đông bắc (thiên bắc)', month: '12 (lạp nguyệt)', season: 'đông' },
  寅: { hour: '03-05', direction: 'đông bắc (thiên đông)', month: '1 (chính nguyệt)', season: 'xuân' },
  卯: { hour: '05-07', direction: 'đông', month: '2', season: 'xuân' },
  辰: { hour: '07-09', direction: 'đông nam (thiên đông)', month: '3', season: 'xuân' },
  巳: { hour: '09-11', direction: 'đông nam (thiên nam)', month: '4', season: 'hạ' },
  午: { hour: '11-13', direction: 'nam', month: '5', season: 'hạ' },
  未: { hour: '13-15', direction: 'tây nam (thiên nam)', month: '6', season: 'hạ' },
  申: { hour: '15-17', direction: 'tây nam (thiên tây)', month: '7', season: 'thu' },
  酉: { hour: '17-19', direction: 'tây', month: '8', season: 'thu' },
  戌: { hour: '19-21', direction: 'tây bắc (thiên tây)', month: '9', season: 'thu' },
  亥: { hour: '21-23', direction: 'tây bắc (thiên bắc)', month: '10', season: 'đông' },
};

// ---- 十二建星 (建除十二神) 黄黑道 + 宜忌 ----
// [loop 1237] Nguồn: 百度百科 + Wikipedia 建除十二神 + 知乎. Khẩu quyết: «建满平收黑，除危定执黄，成开皆可用，闭破不相当».
//   [nuance] 黄道≠万事皆宜, 黑道≠万事皆凶 — mỗi建星 có 宜/忌 riêng theo sự việc.
export const JIANXING_12 = {
  建: { tone: 'hung(黑)', yi: 'khai thị, lập khoán, giao dịch, nạp tài, xuất hành, thượng lương', ji: 'động thổ' },
  除: { tone: 'cat(黄)', yi: 'trị bệnh, thanh tẩy, trừ tà', ji: 'khai thị' },
  满: { tone: 'hung(黑)', yi: 'kỳ phúc, tế tự, bổ nhiệm', ji: 'kết thân, hôn nhân' },
  平: { tone: 'hung(黑)', yi: '(bình)', ji: 'đại sự bất nghi' },
  定: { tone: 'cat(黄)', yi: 'quan đới, ký ước, định thân, gia lập', ji: 'tụng sự, tranh chấp' },
  执: { tone: 'cat(黄)', yi: 'săn bắn, cố thủ, bắt giữ', ji: 'khai thị, xuất hành' },
  破: { tone: 'hung(黑)', yi: '(cẩu phá)', ji: 'đại hung — xung nguyệt lệnh, kỵ tuyệt đối đại sự' },
  危: { tone: 'cat(黄)', yi: 'tế tự, an táng', ji: 'đăng sơn, phiêu lưu' },
  成: { tone: 'cat(黄)', yi: 'kết hôn, khai thị, nhập học — vạn sự thành', ji: 'sơ cáo, từ chức' },
  收: { tone: 'hung(黑)', yi: 'thu liễm, nạp tài, mua đồ', ji: 'xuất hành, đi xa' },
  开: { tone: 'cat(黄)', yi: 'khai thị, phó nhậm, cầu danh — khai bạt', ji: 'táng, an táng' },
  闭: { tone: 'hung(黑)', yi: 'trúc đê, mai táng, kết cấu', ji: 'khai thị, mở mang' },
};

// ---- 三式 总览 (天地人三才) ----
// [loop 1238] Nguồn: 百度百科·三式占卜 + 搜狐«三式绝学PK» + 中华网 + Wikipedia.
//   «Thông tam thức» =融会太乙+奇门+六壬 → thiên-địa-nhân kiêm bị.
export const SANSI_OVERVIEW = {
  太乙神数: { sanCai: 'thiên (thiên nguyên)', zhuShi: 'quốc vận, thiên đạo', good: 'thiên tượng, thiên tai, quốc sự hưng suy', gong: '16 cung — cổ đại cấm dân gian (đế vương术)' },
  奇门遁甲: { sanCai: 'địa (địa nguyên)', zhuShi: 'địa lợi, tập thể sự', good: 'bài binh bố trận, phương vị, thương nghiệp quyết sách, khuỷ cát tị hung', gong: '9 cung (thiên/địa/nhân/thần bàn)' },
  大六壬: { sanCai: 'nhân (nhân nguyên)', zhuShi: 'nhân sự', good: 'nhật dụng cụ thể sự cát hung thành bại, nhân tế việc vặt', gong: '12 cung (thiên/địa bàn + tứ tam truyề)' },
};

// ---- 地支 三合化气 + 六合化气 (《三命通会》) ----
// [loop 1241] Nguồn: 百度百科·地支三合 + 知乎 + 搜狐. BRANCH_GROUP nhóm; đây là tầng hoá khí + ý nghĩa.
//   三合口诀: «申子辰水，亥卯未木，寅午戌火，巳酉丑金»; 缺一字 = bán hợp (lực yếu).
//   六合 hoà hợp/kế hợp — 代表和谐/合作/ám trợ.
export const SANHE_HUAQI = { '申子辰': '水', '亥卯未': '木', '寅午戌': '火', '巳酉丑': '金' };
export const LIUHE_HUAQI = { '子丑': '土', '寅亥': '木', '卯戌': '火', '辰酉': '金', '巳申': '水', '午未': '土 [争议:火]' };
// [nuance] hợp hoá cần điều kiện (hoá thần lộ/đắc lệnh...) — không phải thấy hợp là hoá khí.

// ---- 十二消息卦/辟卦 (《周易》卦气, 12 tháng) ----
// [loop 1243] Nguồn: 百度百科·十二辟卦 + 《归藏》 + 《周易参同契》.
//   息卦(阳长): 复→临→泰→大壮→夬→乾 (子→巳). 消卦(阳消): 姤→遁→否→观→剥→坤 (午→亥).
export const XIAOXI_12 = {
  子: { gua: '复', yang: 1, yin: 5, meaning: 'nhất dương sơ sinh (đông chí nhất dương sinh)', jieqi: 'đông chí' },
  丑: { gua: '临', yang: 2, yin: 4, meaning: 'nhị dương tức', jieqi: 'đại hàn' },
  寅: { gua: '泰', yang: 3, yin: 3, meaning: 'tam dương khai thái', jieqi: 'lập xuân' },
  卯: { gua: '大壮', yang: 4, yin: 2, meaning: 'tứ dương tức', jieqi: 'xuân phân' },
  辰: { gua: '夬', yang: 5, yin: 1, meaning: 'ngũ dương quyết âm', jieqi: 'cốc vũ' },
  巳: { gua: '乾', yang: 6, yin: 0, meaning: 'thuần dương chi thể', jieqi: 'tiểu mãn' },
  午: { gua: '姤', yang: 5, yin: 1, meaning: 'nhất âm sơ sinh (hạ chí nhất âm sinh)', jieqi: 'hạ chí' },
  未: { gua: '遁', yang: 4, yin: 2, meaning: 'nhị âm tiêu dương', jieqi: 'đại thử' },
  申: { gua: '否', yang: 3, yin: 3, meaning: 'tam âm tiêu thoái (thiên địa bất giao)', jieqi: 'xử thử' },
  酉: { gua: '观', yang: 2, yin: 4, meaning: 'tứ âm tiêu dương', jieqi: 'thu phân' },
  戌: { gua: '剥', yang: 1, yin: 5, meaning: 'ngũ âm bạt dương', jieqi: 'sương giáng' },
  亥: { gua: '坤', yang: 0, yin: 6, meaning: 'thuần âm chi thể', jieqi: 'tiểu tuyết' },
};

// ---- 二十四节气 + 物候 ----
// [loop 1244] Nguồn: 百度百科 + 中科院地理所 + Wikipedia. [分类] 寒暑8 + 气温5 + 降水7 + 物候4.
//   12节令 (lập kinh...): 立春/惊蛰/清明/立夏/芒种/小暑/立秋/白露/寒露/立冬/大雪/小寒.
//   12中气: 雨水/春分/谷雨/小满/夏至/大暑/处暑/秋分/霜降/小雪/冬至/大寒.
export const JIEQI_24 = {
  立春: { season: 'xuân', meaning: 'vạn vật khởi thuỷ, xuân bắt đầu' },
  雨水: { season: 'xuân', meaning: 'mùa mưa bắt đầu, khí ôn hồi thăng, giáng thuỷ tăng' },
  惊蛰: { season: 'xuân', meaning: 'xuân lôi thị minh, kinh tỉnh đông miên trệ trùng, vạn vật phục tô' },
  春分: { season: 'xuân', meaning: 'trú dạ bình phân, xuân quá nửa' },
  清明: { season: 'xuân', meaning: 'khí ôn noãn, thiên thanh địa minh, thảo mộc tân lục' },
  谷雨: { season: 'xuân', meaning: '«vũ sinh bách cốc», thuỷ phân sung沛, lợi cốc vật sinh trưởng' },
  立夏: { season: 'hạ', meaning: 'hạ bắt đầu, khí ôn hiển thăng' },
  小满: { season: 'hạ', meaning: 'mạch loại hạt bắt đầu no đầy nhưng chưa chín' },
  芒种: { season: 'hạ', meaning: '«hữu mang chi cốc khả chủng», vụ bận rộn gieo trồng' },
  夏至: { season: 'hạ', meaning: 'bắc bán cầu ban ngày dài nhất, thịnh hạ' },
  小暑: { season: 'hạ', meaning: 'vào mùa nóng nhưng chưa cực' },
  大暑: { season: 'hạ', meaning: 'năm nóng nhất' },
  立秋: { season: 'thu', meaning: 'thu bắt đầu, thử khứ lương lai' },
  处暑: { season: 'thu', meaning: '«xử» vi chỉ, nắng nóng sắp qua' },
  白露: { season: 'thu', meaning: 'khí ôn giáng, ban đêm lộ thuỷ ngưng phát bạch' },
  秋分: { season: 'thu', meaning: 'trú dạ tái bình phân, thu quá nửa' },
  寒露: { season: 'thu', meaning: 'khí ôn kế tục hạ giáng, lộ thuỷ cánh lương' },
  霜降: { season: 'thu', meaning: 'trời dần lạnh, bắt đầu xuất hiện sương phong' },
  立冬: { season: 'đông', meaning: 'đông bắt đầu, vạn vật thu tàng' },
  小雪: { season: 'đông', meaning: 'bắt đầu giáng tuyết nhưng không lớn' },
  大雪: { season: 'đông', meaning: 'tuyết nhiều, mặt đất có thể tích tuyết' },
  冬至: { season: 'đông', meaning: 'ban ngày ngắn nhất, vào kỳ lạnh nhất' },
  小寒: { season: 'đông', meaning: 'trời lạnh nhưng chưa cực' },
  大寒: { season: 'đông', meaning: 'năm lạnh nhất' },
};

// ---- 七十二候 (5 节气 nền tảng × 3候, verified) ----
// [loop 1247] Nguồn: 《月令七十二候集解》(元·吴澄) + 《逸周书·时训解》 + 百度百科/新华网.
//   Framework: «ngũ nhật vi hậu, tam hậu vi khí, lục khí vi thời, tứ thời vi tuế» → 24节气 × 3候 = 72候.
//   Mỗi候 = 1 vật hậu (5 ngày). Đây là 5节气 tiêu biểu (lập xuân + nhị phân nhị chí); 19节气 còn lại theo cùng thể thức.
export const QIHOU = {
  立春: { hou: ['东风解冻', '蛰虫始振', '鱼陟负冰'], note: 'mở đầu xuân — đông phong giải đông, trệ trùng chấn động, ngư thiếm phụ băng' },
  春分: { hou: ['玄鸟至', '雷乃发声', '始电'], note: 'nhị phân — yến quy (huyền điểu), lôi thanh, thủy hữu sét' },
  夏至: { hou: ['鹿角解', '蜩始鸣', '半夏生'], note: 'nhị chí — hươu đực rụng sừng (cảm âm sinh), ve kêu, bán hạ sinh' },
  秋分: { hou: ['雷始收声', '蛰虫坯户', '水始涸'], note: 'nhị phân — lôi thu thanh, trệ trùng bồi hộ (bịt hang), thuỷ thuỷ khô' },
  冬至: { hou: ['蚯蚓结', '麋角解', '水泉动'], note: 'nhị chí — giun đất cuộn kết (cảm dương động), ly rụng sừng, thuỷ tuyền lưu' },
  // [loop 1261] thêm 4 mùa xuân (đủ mùa xuân 6 tiết khí)
  雨水: { hou: ['獭祭鱼', '候雁北', '草木萌动'], note: 'thủy liệt bắt cá bày bến như tế; nhạn bắc phi; thảo mộc mầm nảy' },
  惊蛰: { hou: ['桃始华', '仓庚鸣', '鹰化为鸠'], note: 'đào nở hoa; hoàng ly kêu; ưng hoá thành cưu (ẩn ưng, hiện cưu)' },
  清明: { hou: ['桐始华', '田鼠化为鴽', '虹始见'], note: 'ng đồng (phao đồng) nở; điền thử hoá cun (chim cun); cầu vồng bắt đầu hiện' },
  谷雨: { hou: ['萍始生', '鸣鸠拂其羽', '戴胜降于桑'], note: 'bình (bèo) bắt đầu sinh; chim cưu vỗ cánh kêu; chim đãi thắng đẳng dâu (tằm sự sắp khởi)' },
  // [loop 1262] thêm 5 mùa hạ (đủ mùa hạ 6 tiết khí)
  立夏: { hou: ['蝼蝈鸣', '蚯蚓出', '王瓜生'], note: 'dế nỉ kêu; giun đất chui lên; vương qua sinh trưởng' },
  小满: { hou: ['苦菜秀', '靡草死', '麦秋至'], note: 'khổ thái hoa thạnh; mi thảo khô (chí âm bất thắng chí dương); mạch thu chí (mạch chín gặt)' },
  芒种: { hou: ['螳螂生', '鵙始鸣', '反舌无声'], note: 'mantis nở; bá lao chim kêu; phản thiệt (bách thiệt) nín kêu' },
  小暑: { hou: ['温风至', '蟋蟀居宇', '鹰始鸷'], note: 'ôn phong chí (gió noãn cực); dế crickets vào nhà; ưng con học bay săn' },
  大暑: { hou: ['腐草为萤', '土润溽暑', '大雨时行'], note: 'phụ thảo hoá đom đóm; thổ nhậm thử (đất ẩm nắng); đại vũ thời hành (mưa lớn giảm thử)' },
  // [loop 1263] thêm 5 mùa thu (đủ mùa thu 6 tiết khí)
  立秋: { hou: ['凉风至', '白露降', '寒蝉鸣'], note: 'lương phong chí; bạch lộ giáng (lộ trắng); hàn thiền kêu (cảm âm)' },
  处暑: { hou: ['鹰乃祭鸟', '天地始肃', '禾乃登'], note: 'ưng điểu săn bày như tế; thiên địa thu túc (khí thu sát); hà nãi đăng (lúa chín gặt)' },
  白露: { hou: ['鸿雁来', '玄鸟归', '群鸟养羞'], note: 'hồng nhạn nam phi; huyền điểu (yến) nam quy; quần điểu tích lương thực («tu»=thực)' },
  寒露: { hou: ['鸿雁来宾', '雀入大水为蛤', '菊有黄华'], note: 'hồng nhạn muộn (như khách); tước nhập thuỷ hoá cá; cúc hoàng hoa nở' },
  霜降: { hou: ['豺乃祭兽', '草木黄落', '蛰虫咸俯'], note: 'sói bắt thú bày như tế; thảo mộc hoàng lạc; trệ trùng hàm phủ (ẩn nghỉ đông)' },
  // [loop 1264] thêm 5 mùa đông — HOÀN THÀNH ĐỦ 24节气 × 3候 = 72候
  立冬: { hou: ['水始冰', '地始冻', '雉入大水为蜃'], note: 'thuỷ thuỷ băng; địa thuỷ đông; trĩ nhập thuỷ hoà sò (tưởng tượng cổ)' },
  小雪: { hou: ['虹藏不见', '天气上升地气下降', '闭塞而成冬'], note: 'cầu vồng ẩn; thiên khí thăng địa khí giáng (âm dương cách tuyệt); bế tắc thành đông' },
  大雪: { hou: ['鹖鴠不鸣', '虎始交', '荔挺出'], note: 'hạt đán (hàn hào điểu) nín kêu; hổ giao phối; lệ (mã lan thảo) mầm nảy' },
  小寒: { hou: ['雁北乡', '鹊始巢', '雉始鸲'], note: 'nhạn bắc hương (cảm dương); thuỷỉ鹊 lấp tổ; trĩ鸲 (kêu cầu bạn)' },
  大寒: { hou: ['鸡始乳', '征鸟厉疾', '水泽腹坚'], note: 'gà mái ấp trứng; chinh điểu (ưng) bay lướt nhanh săn; thuỷ trạch bụng kiên (băng dày cực)' },
};

// ---- 十二星次 (12 trạm Mộc tinh, dùng cho 七政四余/大六壬日躔) ----
// [loop 1249] Nguồn: 《汉书·律历志》 + Baidu Baike «twelve Jupiter-stations». Mộc tinh nghịch hành (丑→子→亥...).
export const XINGCI_12 = {
  丑: '星纪', 子: '玄枵', 亥: '娵訾', 戌: '降娄', 酉: '大梁', 申: '实沈',
  未: '鹑首', 午: '鹑火', 巳: '鹑尾', 辰: '寿星', 卯: '大火', 寅: '析木',
};

// ---- TÀNG CAN (藏干) — Can ẩn trong Địa Chi ----
// Thứ tự: Bản khí → Trung khí → Dư khí. Trọng số theo độ dài.
export const HIDDEN = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '庚', '戊'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
};
// Trọng số tàng can theo số lượng (bản/trung/dư khí)
export const HIDDEN_WEIGHT = {
  1: [1.0],
  2: [0.7, 0.3],
  3: [0.6, 0.3, 0.1],
};

// ---- THẬP THẦN (十神) ----
// Quan hệ giữa một Can với Nhật Chủ (日主).
export const TEN_GOD_VI = {
  比肩: 'Tỷ Kiên', 劫財: 'Kiếp Tài',
  食神: 'Thực Thần', 傷官: 'Thương Quan',
  偏財: 'Thiên Tài', 正財: 'Chính Tài',
  七殺: 'Thất Sát', 正官: 'Chính Quan',
  偏印: 'Thiên Ấn', 正印: 'Chính Ấn',
};
// Nhóm chức năng của Thập Thần (dùng cho luận Dụng Thần)
//  ti   = Tỷ Kiếp (đồng hành — phù trợ thân)
//  yin  = Ấn (sinh thân — phù trợ thân)
//  shi  = Thực Thương (thân sinh ra — tiết thân)
//  cai  = Tài (thân khắc — hao thân)
//  guan = Quan Sát (khắc thân — chế thân)
export const TEN_GOD_GROUP = {
  比肩: 'ti', 劫財: 'ti',
  正印: 'yin', 偏印: 'yin',
  食神: 'shi', 傷官: 'shi',
  正財: 'cai', 偏財: 'cai',
  正官: 'guan', 七殺: 'guan',
};
export const GROUP_VI = {
  ti: 'Tỷ Kiếp', yin: 'Ấn Tinh', shi: 'Thực Thương', cai: 'Tài Tinh', guan: 'Quan Sát',
};

// ---- BẢNG ĐIỀU HẬU DỤNG THẦN (调候用神表 — 窮通寶鑑) ----
// Tra theo Nhật Can × Nguyệt Chi. Phần tử đầu là Điều Hậu chính.
export const TIAOHOU = {
  甲: { 寅:['丙','癸'], 卯:['庚','丙','丁'], 辰:['庚','丁','壬'], 巳:['癸','丁','庚'], 午:['癸','丁','庚'], 未:['癸','丁','庚'], 申:['庚','丁','壬'], 酉:['庚','丁','丙'], 戌:['庚','甲','丁','壬'], 亥:['庚','丁','丙','戊'], 子:['丁','庚','丙'], 丑:['丁','庚','丙'] },
  乙: { 寅:['丙','癸'], 卯:['丙','癸'], 辰:['癸','丙','戊'], 巳:['癸'], 午:['癸','丙'], 未:['癸','丙'], 申:['丙','癸','己'], 酉:['癸','丙','丁'], 戌:['癸','辛'], 亥:['丙','戊'], 子:['丙'], 丑:['丙'] },
  丙: { 寅:['壬','庚'], 卯:['壬','己'], 辰:['壬','甲'], 巳:['壬','庚','癸'], 午:['壬','庚'], 未:['壬','庚'], 申:['壬','戊'], 酉:['壬','癸'], 戌:['甲','壬'], 亥:['甲','戊','庚','壬'], 子:['甲','壬','戊'], 丑:['壬','甲'] },
  丁: { 寅:['甲','庚'], 卯:['庚','甲'], 辰:['甲','庚'], 巳:['甲','庚'], 午:['壬','庚','癸'], 未:['甲','壬','庚'], 申:['甲','庚','丙','戊'], 酉:['甲','庚','丙','戊'], 戌:['甲','庚','戊'], 亥:['甲','庚'], 子:['甲','庚'], 丑:['甲','庚'] },
  戊: { 寅:['丙','甲','癸'], 卯:['丙','甲','癸'], 辰:['甲','丙','癸'], 巳:['甲','丙','癸'], 午:['壬','甲','丙'], 未:['癸','丙','甲'], 申:['丙','甲','癸'], 酉:['丙','癸'], 戌:['甲','丙','癸'], 亥:['甲','丙'], 子:['丙','甲'], 丑:['丙','甲'] },
  己: { 寅:['丙','庚','甲'], 卯:['甲','癸','丙'], 辰:['丙','癸','甲'], 巳:['癸','丙'], 午:['癸','丙'], 未:['癸','丙'], 申:['丙','癸'], 酉:['丙','癸'], 戌:['甲','丙','癸'], 亥:['丙','甲','戊'], 子:['丙','甲','戊'], 丑:['丙','甲','戊'] },
  庚: { 寅:['戊','甲','壬','丙'], 卯:['丁','甲','庚','丙'], 辰:['甲','丁','壬','癸'], 巳:['壬','戊','丙','丁'], 午:['壬','癸'], 未:['丁','甲'], 申:['丁','甲'], 酉:['丁','甲','丙'], 戌:['甲','壬'], 亥:['丁','丙'], 子:['丁','丙','甲'], 丑:['丙','丁','甲'] },
  辛: { 寅:['己','壬','庚'], 卯:['壬','甲'], 辰:['壬','甲'], 巳:['壬','甲','癸'], 午:['壬','己','癸'], 未:['壬','庚','甲'], 申:['壬','甲','戊'], 酉:['壬','甲'], 戌:['壬','甲'], 亥:['壬','丙'], 子:['丙','戊','壬','甲'], 丑:['丙','壬','戊','己'] },
  壬: { 寅:['庚','丙','戊'], 卯:['戊','辛','庚'], 辰:['甲','庚'], 巳:['壬','辛','庚','癸'], 午:['庚','辛','癸'], 未:['辛','甲'], 申:['戊','丁'], 酉:['甲','庚'], 戌:['甲','丙'], 亥:['戊','庚','丙'], 子:['戊','丙'], 丑:['丙','丁','甲'] },
  癸: { 寅:['辛','丙'], 卯:['庚','辛'], 辰:['丙','辛','甲'], 巳:['辛'], 午:['庚','辛','壬','癸'], 未:['庚','辛','壬','癸'], 申:['丁'], 酉:['辛','丙'], 戌:['辛','甲','壬','癸'], 亥:['庚','辛','戊','丁'], 子:['丙','辛'], 丑:['丙','丁'] },
};

// ---- 窮通寶鑑 «調候» NGUYÊN LÝ (đối chiếu ctext 窮通寶鑑 ch.208379) ----
// [loop 1193] TIAOHOU (trên) đã spot-verify vs 窮通寶鑑: 甲寅=丙主癸佐, 甲卯/辰,
// 庚申=丁主甲佐, 丙午=壬主庚佐 → bảng ĐÚNG. Đây là tầng nguyên lý (WHY) bổ sung.
export const TIAOHOU_PRINCIPLE = {
  rule: '調候 cốt lấy khí hậu (寒暖燥濕) của nguyệt lệnh làm tiên — «天時優先», sau mới phối vượng suy Nhật Chủ.',
  jianlu: '同是月令建禄，一則喜泄不喜克，一則喜克不喜泄 — 甲生寅 (建禄) 喜丙火泄秀; 庚生申 (建禄) 喜丁火克煉. Cùng建禄 mà 用 ngược nhau → tùy bản chất Nhật Chủ.',
  chunmu: '春月之木漸有生長之象，初春猶寒當以火暖之 (丙)；水多則克、損精神。木旺重見必用庚金斲鑿，可成棟梁。',
  gengshen: '七月庚金剛銳最緊，要用丁火鍛鍊 (非丁不能造庚)，次用甲木引丁 — 忌壬癸水克丁。',
  bingwu: '午月丙火愈炎，得壬庚高透方為上命 — 壬水既濟為主，庚金生壬為佐；防戊己克壬、丁壬化合。',
};

// ---- 窮通寶鑑 «五行總論» + 季節調候原理 (nguồn cổ) ----
// [loop 1197] Nền tảng triết lý điều hậu — đối chiếu Wikisource 窮通寶鑑 + 百度百科.
// 5 nguyên lý mùa (三春/三夏/三秋/三冬/四季土) = WHY phía sau bảng TIAOHOU.
export const QIONGTONG_ZONGLUN = {
  origin: '«五行者，本乎天地之間而不窮者也，故謂之行» — 北方陰極生寒→水; 南方陽極生熱→火; 東方陽散生風→木; 西方陰止生燥→金; 中央陰陽交生濕→土.',
  春木: '春 Mộc vượng dương thăng — hỷ Hỏa ôn dương, dụng Thủy nhuận Mộc. «火透水潤» thành «既濟» mới căn nhuận mộc vinh. Dụng Hỏa không thể thiếu Thủy, dụng Thủy không thể không Hỏa.',
  夏火: 'Hạ Hỏa viêm thổ táo — điều hậu vi cấp. Chủ dụng Quý/Nhâm Thủy giáng ôn nhuận trạch. «三春丙火…專用壬水，為扶陽，名曰天和地潤，既濟功成».',
  秋金: 'Thu Kim thu liễm — cần Đinh Hỏa luyện kim thành khí, Nhâm Thủy tẩy kim tăng thải («剛健得火則銳，得水則清»).',
  冬水: 'Đông Thủy lãnh kim hàn — cần Bính Hỏa noãn cục giải đông. «冬月之木盤屈在地…火重見溫暖有功» — dù Mộc sinh đông cũng trọng Hỏa noãn.',
  季土: 'Thổ vượng tứ quý — tam Hạ táo thổ hỷ Thủy nhuận, đông hàn thổ hỷ Hỏa noãn; Thìn/Tuất/Sửu/Mùi tùy nguyệt phối hợp.',
};

// ---- VÒNG TRƯỜNG SINH (十二長生) cho Nhật Chủ tại Địa Chi ----
// Thứ tự 12 trạng thái theo chiều thuận của can Dương.
export const CHANGSHENG_STAGES = [
  '長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養',
];
export const CHANGSHENG_VI = {
  長生: 'Trường Sinh', 沐浴: 'Mộc Dục', 冠帶: 'Quan Đới', 臨官: 'Lâm Quan',
  帝旺: 'Đế Vượng', 衰: 'Suy', 病: 'Bệnh', 死: 'Tử', 墓: 'Mộ', 絕: 'Tuyệt',
  胎: 'Thai', 養: 'Dưỡng',
};
// Địa chi khởi Trường Sinh của từng Thiên Can
export const CHANGSHENG_START = {
  甲: '亥', 丙: '寅', 戊: '寅', 庚: '巳', 壬: '申',
  乙: '午', 丁: '酉', 己: '酉', 辛: '子', 癸: '卯',
};
export const ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ---- KHÍ HẬU THEO NGUYỆT CHI (用於 调候 luận sâu — 窮通寶鑑) ----
// Mỗi tháng: mùa, đặc khí hậu, nhu cầu điều hậu cốt lõi.
export const CLIMATE = {
  寅: { season: 'Xuân', climate: 'dương sinh, ôn noãn, vạn mộc phát sinh', need: 'Hỏa để phát vinh (mộc được hỏa mới phồn)' },
  卯: { season: 'Xuân', climate: 'xuân phân, ôn hoà, mộc vượng', need: 'Hỏa tiết tú hoặc Kim điêu trác' },
  辰: { season: 'Quý Xuân', climate: 'thấp, mộc khí gần tận, thổ sinh vàng', need: 'Kim trác cụ + Thủy nhuận (mộc lão cần kim phạt)' },
  巳: { season: 'Hạ', climate: 'noãn nhiệt, dương hỏa bộc phát', need: 'Thủy giải khát, nhuận mộc' },
  午: { season: 'Hạ', climate: 'noãn cực, hỏa khí đỉnh', need: 'Thủy giải nhiệt (chủ Quý/Nhâm)' },
  未: { season: 'Quý Hạ', climate: 'táo nhiệt, dư hỏa, thổ vượng', need: 'Thủy nhuận + giải táo' },
  申: { season: 'Thu', climate: 'lương, kim khí tiến, dương thu', need: 'Hỏa luyện kim hoặc Thủy thanh' },
  酉: { season: 'Thu', climate: 'thu phân, lương táo, kim vượng', need: 'Hỏa luyện hoặc Thủy rửa' },
  戌: { season: 'Quý Thu', climate: 'táo, kim khí suy, thổ thâu', need: 'Thủy/Thổ giữ nhuận' },
  亥: { season: 'Đông', climate: 'hàn lạnh, dương khí tàng phục', need: 'Hỏa noãn (chủ Đinh/丙) giải hàn' },
  子: { season: 'Đông', climate: 'hàn thịnh cực lãnh, âm cực', need: 'Hỏa noãn (chủ Đinh/丙)' },
  丑: { season: 'Quý Đông', climate: 'hàn thấp, đông thâm, thổ băng', need: 'Hỏa noãn, giải hàn thấp' },
};
