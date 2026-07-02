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
