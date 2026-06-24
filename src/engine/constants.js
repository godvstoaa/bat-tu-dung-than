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
