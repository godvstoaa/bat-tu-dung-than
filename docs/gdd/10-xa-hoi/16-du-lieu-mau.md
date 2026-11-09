# 10 · Phần 16 — Dữ liệu mẫu cho lập trình (dạng mô-đun thuần JS)

> Mục đích: chuyển các bảng của Phần 01–15 thành **dữ liệu đúng hình dạng mã** để lập trình viên chép vào các mô-đun thuần (không DOM, test được bằng node — đúng phong cách `cosmetics.js`, `protocol.js`). Tất cả mô-đun dưới đây **(chưa có — cần làm)**. Khi số liệu ở đây khác với phần thiết kế, **phần thiết kế là chuẩn** và dữ liệu phải sửa theo.

## 16.1 `src/game/guild-data.js`

```js
// ============================================================================
//  MÔN PHÁI — dữ liệu 9 tông (docs/gdd/10-xa-hoi/01–03). Thuần dữ liệu.
// ============================================================================
export const TONG = [
  { id: 'CN', name: 'Chính Nhất Tông', region: 'longho', npc: 'truong_thiensu', schools: ['zhengyi', 'shenxiao'],
    wx: '火', sectKind: 'Pháp Đàn', minRealm: 2, enabled: true, gate: null,
    precept: 'Phù là lời hứa giữ mình, không phải hàng để bán.', flag: ['#b3261e', '#e0b84a'] },
  { id: 'TV', name: 'Thanh Vi Đan Đỉnh Tông', region: 'vodang', npc: 'huyen_hu', npc2: 'dan_dinh', schools: ['qingwei', 'danding'],
    wx: '木', sectKind: 'Đan Viện', minRealm: 2, enabled: true, gate: null,
    precept: 'Dưỡng mình để giúp người, không luyện để hơn người.', flag: ['#2f5d3a', '#1a1a1a'] },
  { id: 'TC', name: 'Toàn Chân Linh Bảo Tông', region: 'chungnam', npc: 'khau_daotruong', schools: ['quanzhen', 'lingbao'],
    wx: '土', sectKind: 'Đạo Am', minRealm: 2, enabled: true, gate: null, guestRule: 'thapphuong',
    precept: 'Giữ giới cho mình, không bắt người khác giữ giới của mình.', flag: ['#a07a2c', '#2a4f7a'] },
  { id: 'TT', name: 'Thượng Thanh Lư Sơn Tông', region: 'maoshan', npc: 'maoshan_daonhan', schools: ['maoshan', 'lushan'],
    wx: '金', sectKind: 'Tĩnh Thất', minRealm: 2, enabled: true, gate: 'amta',
    precept: 'Trừ tà trước hết là trừ sự hoảng sợ: hỏi chuyện ăn ngủ trước, nói chuyện ma sau.', flag: ['#d8d8d8', '#5b3a7a'] },
  { id: 'BD', name: 'Bắc Đế Độ Nhân Tông', region: 'phongdo', npc: 'phan_quan', npc2: 'diatang_su', schools: ['beidi', 'dongyuan'],
    wx: '水', sectKind: 'Độ Đàn', minRealm: 5, enabled: true, gate: null, extraReq: 'cuu_nguoi_1',
    precept: 'Không dọa người bằng địa ngục. Ở đây chỉ dẫn người ra.', flag: ['#1d2a3a', '#c0c0c0'] },
  { id: 'TH', name: 'Trúc Lâm Thiền Tông', region: 'yentu', npc: 'truclam_thiensu', schools: [],
    wx: '土', sectKind: 'Thiền Am', minRealm: 2, enabled: true, gate: null, lay: true,
    precept: 'Không tranh hơn thua trong im lặng.', flag: ['#6b4e2e', '#e8d9a8'] },
  { id: 'TD', name: 'Tịnh Độ Liên Tông', region: 'buttap', npc: 'dieu_am', schools: [],
    wx: '火', sectKind: 'Liên Xã', minRealm: 2, enabled: true, gate: null, lay: true,
    precept: 'Phóng sinh đúng cách: cứu con vật đang gặp nạn, không đặt người bắt thêm để thả.', flag: ['#e9a3b5', '#ffffff'] },
  { id: 'MT', name: 'Chuẩn Đề Mật Tông', region: 'tangdia', npc: 'lama_dakiet', schools: [],
    wx: '水', sectKind: 'Chuẩn Đề Đàn', minRealm: 5, enabled: false, gate: null, lay: true, verify: true,
    precept: 'Làm đẹp rồi buông. Giữ lại là chưa xong.', flag: ['#1f3b73', '#e0b84a'] },
  { id: 'NH', name: 'Tịnh Minh Nho Tông', region: 'vanmieu', npc: 'te_tuu', schools: ['jingming'],
    wx: '木', sectKind: 'Văn Hội', minRealm: 2, enabled: true, gate: null,
    precept: 'Học để làm người, không học để hơn người.', flag: ['#7a1f1f', '#2f8f83'] },
];
export const TONG_BY_ID = Object.fromEntries(TONG.map((t) => [t.id, t]));
export const MAX_TONG = 3;          // 1 chính tông + ≤ 2 kiêm tu (canon «tối đa 3 đạo thống chính»)

// ---- cấp bậc chi đường ------------------------------------------------------
export const RANKS = [
  { r: 0, id: 'kydanh', name: 'Ký Danh' },
  { r: 1, id: 'dongmon', name: 'Đồng Môn' },
  { r: 2, id: 'noimon', name: 'Nội Môn', auto: { days: 28, rites: 4, realm: 2 } },
  { r: 3, id: 'chapsu', name: 'Chấp Sự', max: 6 },
  { r: 4, id: 'truonglao', name: 'Trưởng Lão', max: 3, req: { realm: 4, days: 90 } },
  { r: 5, id: 'photri', name: 'Phó Trì', max: 2 },
  { r: 6, id: 'chutri', name: 'Chủ Trì', max: 1 },
];
export const ROLES = ['trikhach', 'trikho', 'chule', 'giamvien', 'thuky', 'giaotap'];

// tên hiển thị theo tông: [R6, R5, R4, trikhach, trikho, chule, giamvien, thuky, giaotap]
export const ROLE_NAMES = {
  CN: ['Đàn Chủ', 'Phó Đàn', 'Lão Đàn', 'Tri Khách', 'Đàn Khố', 'Chủ Đàn', 'Giám Đàn', 'Thư Sớ', 'Giáo Tập'],
  TV: ['Viện Chủ', 'Phó Viện', 'Lão Viện', 'Tri Khách', 'Quản Khố', 'Chủ Kinh', 'Giám Lô', 'Ký Lục', 'Tọa Sư'],
  TC: ['Am Chủ', 'Phó Am', 'Lão Am', 'Tri Khách', 'Khố Đầu', 'Kinh Chủ', 'Giám Viện', 'Ký Lục', 'Giới Sư'],
  TT: ['Thất Chủ', 'Phó Thất', 'Lão Thất', 'Tri Khách', 'Thủ Khố', 'Chủ Đàn', 'Giám Thất', 'Ký Lục', 'Tồn Tư Sư'],
  BD: ['Đàn Chủ', 'Phó Đàn', 'Lão Đàn', 'Dẫn Lộ', 'Thủ Khố', 'Chủ Độ', 'Giám Đàn', 'Ký Bạ', 'Dẫn Độ Sư'],
  TH: ['Am Chủ', 'Phó Am', 'Lão Cư Sĩ', 'Tri Khách', 'Thủ Khố', 'Duy Na', 'Giám Tác', 'Thư Ký', 'Hướng Dẫn Thiền'],
  TD: ['Xã Trưởng', 'Phó Xã', 'Lão Cư Sĩ', 'Tri Khách', 'Thủ Quỹ', 'Duy Na', 'Giám Tác', 'Thư Ký', 'Hướng Dẫn Niệm'],
  MT: ['Đàn Trưởng', 'Phó Đàn', 'Lão Cư Sĩ', 'Tri Khách', 'Thủ Khố', 'Duy Na', 'Giám Tác', 'Thư Ký', 'Hướng Dẫn Quán'],
  NH: ['Hội Trưởng', 'Phó Hội Trưởng', 'Lão Sinh', 'Tri Khách', 'Thủ Quỹ', 'Tế Chủ', 'Giám Tạo', 'Thư Biện', 'Giảng Tập'],
};

// ---- bậc đạo tràng ----------------------------------------------------------
// mat: [go, da, ngoi, son, giay, muc, dong, tram]
export const TIERS = [
  { tier: 1, cap: 12, dv: 0,    mat: [0, 0, 0, 0, 0, 0, 0, 0],               hours: 0,  builds: ['01', '02'] },
  { tier: 2, cap: 16, dv: 300,  mat: [120, 80, 60, 20, 40, 20, 0, 0],        hours: 12, builds: ['03', '04'] },
  { tier: 3, cap: 20, dv: 900,  mat: [200, 150, 120, 60, 40, 20, 40, 0],     hours: 24, builds: ['05', '06'] },
  { tier: 4, cap: 24, dv: 2000, mat: [320, 260, 200, 120, 80, 60, 120, 20],  hours: 48, builds: ['07', '08'] },
  { tier: 5, cap: 28, dv: 4000, mat: [400, 400, 300, 200, 120, 80, 160, 60], hours: 72, builds: ['09', '10'] },
  { tier: 6, cap: 30, dv: 7500, mat: [500, 500, 400, 300, 200, 160, 240, 120], hours: 96, builds: ['11'] },
];
export const MATERIALS = ['go', 'da', 'ngoi', 'son', 'giay', 'muc', 'dong', 'tram'];

// ---- tên công trình theo tông (mã GUILD-DT-<tông>-NN) -------------------------
export const BUILDINGS = {
  CN: ['Đàn Môn', 'Tam Thanh Đường', 'Tàng Lục Các', 'Liêu Xá', 'Trai Đường', 'Đàn Khố', 'Pháp Đàn', 'Chung Cổ Lâu', 'Hậu Viên Đào', 'Khách Đường', 'Thiên Sư Lầu'],
  TV: ['Viện Môn', 'Huyền Vũ Đường', 'Đan Kinh Các', 'Tĩnh Thất', 'Dược Thiện Đường', 'Quản Khố', 'Đan Đường', 'Chung Lâu', 'Dược Phố', 'Khách Đường', 'Kim Đỉnh Đình'],
  TC: ['Am Môn', 'Thất Chân Đường', 'Tàng Kinh Am', 'Vân Thủy Liêu', 'Trai Đường', 'Khố Đầu Phòng', 'Luật Đường', 'Khánh Lâu', 'Ruộng Rau', 'Khách Đường Thập Phương', 'Đạo Tạng Lâu'],
  TT: ['Thất Môn', 'Tam Mao Đường', 'Thượng Thanh Kinh Các', 'Tĩnh Liêu', 'Trai Đường', 'Thủ Khố', 'Tồn Tư Đàn', 'Chung Lâu', 'Vườn Hương Thảo', 'Khách Đường', 'Hoa Dương Động'],
  BD: ['Độ Môn', 'Huyền Thiên Đường', 'Sám Hối Các', 'Liêu Xá', 'Trai Đường', 'Thủ Khố', 'Độ Nhân Đàn', 'Chung Lâu', 'Vườn Sen Trắng', 'Khách Đường', 'Độ Nhân Kiều'],
  TH: ['Tam Quan', 'Chánh Điện', 'Tàng Kinh', 'Thiền Xá', 'Trai Đường', 'Khố Phòng', 'Thiền Đường', 'Lầu Chuông', 'Vườn Trúc', 'Khách Đường', 'Thiền Đường Vạn Tùng'],
  TD: ['Tam Quan', 'Niệm Phật Đường', 'Tàng Kinh', 'Liêu Xá', 'Trai Đường', 'Khố Phòng', 'Giảng Đường', 'Lầu Chuông Mõ', 'Ao Phóng Sinh', 'Khách Đường', 'Cửu Phẩm Liên Đài'],
  MT: ['Tam Quan', 'Chánh Điện', 'Tàng Kinh', 'Liêu Xá', 'Trai Đường', 'Khố Phòng', 'Giảng Đường', 'Lầu Chuông', 'Hậu Viên', 'Khách Đường', 'Chuẩn Đề Các'],
  NH: ['Nghi Môn', 'Văn Từ', 'Thư Các', 'Học Xá', 'Thiện Đường', 'Thủ Quỹ Phòng', 'Giảng Đường', 'Lầu Trống', 'Vườn Văn', 'Khách Đường', 'Tụ Văn Lầu'],
};
export const buildingId = (tong, i) => `GUILD-DT-${tong}-${String(i + 1).padStart(2, '0')}`;

// ---- bộ ghép danh (Phần 01 §1.5.2) ------------------------------------------
export const NAME_A = ['Thanh', 'Tử', 'Bạch', 'Huyền', 'Tùng', 'Minh', 'Vân', 'Thái', 'Hòa', 'Ngọc', 'Kim', 'Đan', 'Linh', 'Tĩnh', 'Hư', 'Chân', 'Nguyên', 'Diệu', 'Từ', 'Tịnh',
  'Thiện', 'Đức', 'Mặc', 'Cổ', 'Lam', 'Bích', 'Thúy', 'Hồng', 'Hạo', 'Quang', 'Trường', 'Thượng', 'Nam', 'Bắc', 'Đông', 'Tây', 'Xuân', 'Thu', 'Hạ', 'Đông Sơn'];
export const NAME_B = ['Vân', 'Hà', 'Hạc', 'Phong', 'Nguyệt', 'Tuyền', 'Sơn', 'Khê', 'Lâm', 'Đài', 'Liên', 'Tùng', 'Trúc', 'Mai', 'Lan', 'Cúc', 'Thạch', 'Hải', 'Hồ', 'Giang',
  'Nham', 'Cốc', 'Phong (峰)', 'Lĩnh', 'Châu', 'Đình', 'Hiên', 'Viên', 'Uyển', 'Tâm', 'Chiếu', 'Quang', 'Hư', 'Tĩnh', 'Minh', 'Thành', 'An', 'Ninh', 'Huy', 'Đăng'];
// lưu ý: «Phong (峰)» hiển thị «Phong»; hai chữ Phong khác Hán tự → so trùng theo Hán tự, không theo chữ Việt
export const sectName = (a, b, tong) => (NAME_A[a] !== NAME_B[b] ? `${NAME_A[a]} ${NAME_B[b].replace(/ \(.*\)/, '')} ${TONG_BY_ID[tong].sectKind}` : null);

// ---- nghị sự (Phần 01 §1.7.1) -----------------------------------------------
export const NS = {
  'NS-01': { args: ['tier'], rule: 'major', hours: 48, minRank: 2 },
  'NS-02': { args: ['bld', 'variant'], rule: 'major', hours: 48, minRank: 2 },
  'NS-03': { args: ['purpose', 'amt'], rule: 'major', hours: 48, minRank: 2 },
  'NS-04': { args: ['project', 'amt'], rule: 'major', hours: 24, minRank: 2 },
  'NS-05': { args: ['uid'], rule: 'major', hours: 72, minRank: 2 },
  'NS-06': { args: ['uid'], rule: 'major', hours: 72, minRank: 6 },
  'NS-07': { args: ['uid', 'why'], rule: 'twoThirds', hours: 48, minRank: 2, named: true },
  'NS-08': { args: ['why'], rule: 'twoThirds', hours: 72, minRank: 4, altOpen: { cosign: 3, rank: 2 }, named: 'chutri', cooldownDays: 21 },
  'NS-09': { args: ['hid', 'on'], rule: 'major', hours: 48, minRank: 5 },
  'NS-10': { args: ['weekday', 'gio'], rule: 'major', hours: 48, minRank: 2 },
  'NS-11': { args: ['minRealm', 'minAge', 'open'], rule: 'major', hours: 48, minRank: 2 },
  'NS-12': { args: [], rule: 'twoThirds', hours: 168, minRank: 6, needChutri: true },
  'NS-13': { args: ['event', 'with'], rule: 'major', hours: 24, minRank: 2 },
};
export const VOTE = { quorum: 0.4, activeDays: 14, maxOpen: 5, perWeek: 2 };

// ---- kho (Phần 01 §1.9) ------------------------------------------------------
export const GIVE_CAP = { dayPhuc: 200, weekPhuc: 800, r0: 50 };
export const SPEND_CAP = { trikho: 300, photri: 600, chutri: 1000, trikhoMat: 100 };
export const PURPOSES = ['le_vattu', 'cong_truong', 'hoi_huong', 'phi_hoi', 'bo_thi'];   // KHÔNG có mục nào trỏ tới người chơi

// ---- thời gian (Phần 01 §1.5, §1.7) -------------------------------------------
export const TIMES = { kydanhDays: 7, leaveWaitH: 72, kickWaitH: 24, absentWarn: 7, absentAct: 14, absentTransfer: 21, sleep: 30, retire: 75, nameHold: 30 };
```

---

## 16.2 `src/game/rites.js` — định nghĩa lễ

```js
// pha: tu (tụ) · tinh (tịnh) · hanh (hành) · hoi (hồi hướng). phút.
export const PHASES = { tu: 3, tinh: 2, hoi: 1 };   // hanh theo từng lễ

export const RITES = {
  'GUILD-RITE-CN-01': { name: 'Tiểu Tiếu Đàn', kind: 'tong', hanh: 8, mg: ['so_ghep', 'bo_cuong'], open: 'Hôm nay không cầu cho mình. Ai cầu cho mình thì về nhà mà cầu.', close: 'Sớ đã dâng. Lời hứa ở lại với các con. Tuần sau thầy hỏi.' },
  'GUILD-RITE-CN-02': { name: 'Bái Đẩu', kind: 'duong', hanh: 6, mg: ['den_dau'] },
  'GUILD-RITE-CN-03': { name: 'Kết phù cùng nhau', kind: 'duong', hanh: 8, mg: ['ket_phu_nhom'], minN: 5 },
  'GUILD-RITE-CN-04': { name: 'Tạ Thổ', kind: 'duong', hanh: 5, mg: ['ta_tho'], after: 'ct_done' },
  'GUILD-RITE-TV-01': { name: 'Thái Cực Hội', kind: 'tong', hanh: 8, mg: ['thai_cuc'], open: 'Hôm nay ai nhanh thì đi chậm lại, ai chậm thì đi nhanh lên một chút. Thế là Thái Cực.', close: 'Âm không thắng Dương, Dương không thắng Âm. Các con về, nhà ai có ai đang giận ai thì đổi chỗ mà nghĩ.' },
  'GUILD-RITE-TV-02': { name: 'Tọa Đan', kind: 'duong', hanh: 8, mg: ['toa_dan'] },
  'GUILD-RITE-TV-03': { name: 'Dưỡng Sinh Bát Thế', kind: 'duong', hanh: 6, mg: ['bat_the'] },
  'GUILD-RITE-TV-04': { name: 'Thu Thảo', kind: 'duong', hanh: 8, mg: ['thu_thao'], season: ['立秋', '立冬'] },
  'GUILD-RITE-TC-01': { name: 'Vãn Khóa', kind: 'tong', hanh: 9, mg: ['khanh_mo'], variantLingbao: ['土', '火'], open: 'Gõ sai thì gõ tiếp. Dừng lại mới là sai.', close: 'Khóa xong. Giới thì không xong. Về giữ tiếp.' },
  'GUILD-RITE-TC-02': { name: 'Tảo Khóa', kind: 'duong', hanh: 9, mg: ['khanh_mo'], gio: 'mao' },
  'GUILD-RITE-TC-03': { name: 'Thuyết Giới', kind: 'duong', hanh: 6, mg: ['chon_tinh_huong'] },
  'GUILD-RITE-TC-04': { name: 'Đón Khách Vân Thủy', kind: 'duong', hanh: 30, mg: ['don_khach'], tierMin: 5 },
  'GUILD-RITE-TT-01': { name: 'Tồn Tư Đàn', kind: 'tong', hanh: 8, mg: ['ton_tu', 'an_trach'], gateExtra: 'amta', open: 'Ai đang sợ thì đứng gần thầy. Không sao.', close: 'Nhà sáng rồi. Người trong nhà ngủ được là xong việc.' },
  'GUILD-RITE-TT-02': { name: 'Tồn Tư Nhỏ', kind: 'duong', hanh: 6, mg: ['ton_tu'] },
  'GUILD-RITE-TT-03': { name: 'An Trạch Cho Đồng Môn', kind: 'duong', hanh: 10, mg: ['an_trach_nha'] },
  'GUILD-RITE-TT-04': { name: 'Thu Kinh Cho Trẻ', kind: 'duong', hanh: 8, mg: ['thu_kinh'], gio: 'ngay' },
  'GUILD-RITE-BD-01': { name: 'Đăng Kiều', kind: 'tong', hanh: 10, mg: ['dat_den_cau'], open: 'Sổ ở trên kia. Đèn ở trong tay các con. Đèn quan trọng hơn.', close: 'Qua cầu rồi thì thôi nhắc lỗi cũ. Người ta cần đi tiếp.' },
  'GUILD-RITE-BD-02': { name: 'Giải Oan Đàn', kind: 'duong', hanh: 12, mg: ['giai_oan'] },
  'GUILD-RITE-BD-03': { name: 'Gánh Cùng', kind: 'duong', hanh: 15, mg: ['ganh_cung'], invited: true },
  'GUILD-RITE-BD-04': { name: 'Thả Đèn Sông', kind: 'duong', hanh: 8, mg: ['tha_den'], day: 15 },
  'GUILD-RITE-TH-01': { name: 'Thiền Thất Tuần', kind: 'tong', hanh: 10, mg: ['so_tuc', 'kinh_hanh', 'so_tuc'], quiet: true, close: 'pool:thien52' },
  'GUILD-RITE-TH-02': { name: 'Tọa Sáng', kind: 'duong', hanh: 8, mg: ['so_tuc', 'so_tuc'], quiet: true, gio: 'mao' },
  'GUILD-RITE-TH-03': { name: 'Kinh Hành Vườn Trúc', kind: 'duong', hanh: 8, mg: ['kinh_hanh', 'thap_soi'] },
  'GUILD-RITE-TH-04': { name: 'Vấn Đáp', kind: 'duong', hanh: 8, mg: ['van_dap'], pool: 'vandap40' },
  'GUILD-RITE-TD-01': { name: 'Liên Đăng Niệm', kind: 'tong', hanh: 10, mg: ['niem_nhip', 'lien_dang'], open: 'Tham, sân, si ai cũng có. Đếm được thì bớt được.', close: 'Đèn sáng là của mọi người. Ai thấy đèn mình sáng nhất thì là chưa hiểu.' },
  'GUILD-RITE-TD-02': { name: 'Phóng Sinh Hồ Sen', kind: 'duong', hanh: 10, mg: ['cuu_ca', 'don_ao'] },
  'GUILD-RITE-TD-03': { name: 'Bố Thí Gánh Gạo', kind: 'duong', hanh: 12, mg: ['ganh_gao'] },
  'GUILD-RITE-TD-04': { name: 'Sám Hối Đầu Tháng', kind: 'duong', hanh: 8, mg: ['sam_hoi'], day: 1 },
  'GUILD-RITE-MT-01': { name: 'Mạn-đà-la Chung', kind: 'tong', hanh: 10, mg: ['mandala_24', 'quet_cat'], verify: true },
  'GUILD-RITE-MT-02': { name: 'Quán Tưởng Ánh Sáng', kind: 'duong', hanh: 8, mg: ['ton_tu'] },
  'GUILD-RITE-MT-03': { name: 'Sám Hối Kim Cương Tát Đỏa', kind: 'duong', hanh: 8, mg: ['sam_hoi'] },
  'GUILD-RITE-MT-04': { name: 'Đi Vòng Kinh Luân', kind: 'duong', hanh: 10, mg: ['kinh_luan'], verify: true, enabled: false },
  'GUILD-RITE-NH-01': { name: 'Thích Điện Tiểu Lễ', kind: 'tong', hanh: 9, mg: ['dang_6_khay', 'doi_cau'], open: 'Hôm nay mỗi người mang một khay. Khay nặng hay nhẹ, đi cho thẳng là được.', close: 'Chữ để người đọc, không để treo. Về nhà đọc cho cha mẹ một trang.' },
  'GUILD-RITE-NH-02': { name: 'Hội Văn', kind: 'duong', hanh: 10, mg: ['doi_cau_nhom'] },
  'GUILD-RITE-NH-03': { name: 'Giảng Sách', kind: 'duong', hanh: 10, mg: ['chon_cau_tam_dac'] },
  'GUILD-RITE-NH-04': { name: 'Tạ Thầy', kind: 'duong', hanh: 6, mg: ['dang_tra'] },
};

// biến thể theo can ngày (Phần 01 §1.11.3): quan hệ hành can ngày với hành lễ của tông
export const VARIANT = {
  same:   { id: 'vuong', extraRound: true, hhMul: 1.2 },
  shengMe:{ id: 'thuan', breathSlow: true },
  iSheng: { id: 'hao', addBothi: true },
  keMe:   { id: 'nghich', harder: true, qMax: 1.3 },
  iKe:    { id: 'che' },
};
export const DH_RITE_WEEK_CAP = 40;   // Phần 01 §1.11.4
export const RITE_COUNTED_PER_WEEK = 2;
```

---

## 16.3 `src/game/festivals.js` — 51 lễ

```js
// rule: { type, ... } — Phần 09 §9.0.2. priority: 1 lễ chung · 2 lễ tông · 3 vía. ios: false = ẩn trên iOS.
export const FESTIVALS = [
  { id: 'EV-TAOQUAN-01', name: 'Ông Công ông Táo', rule: { type: 'lunar', m: 12, d: 23 }, pre: 3, regions: ['thanh'], priority: 1 },
  { id: 'EV-TATAITUE-01', name: 'Tạ Thái Tuế', rule: { type: 'lunarRange', from: [12, 24], to: 'last12' }, regions: ['thanh'], priority: 3, ios: false },
  { id: 'EV-TRUTICH-01', name: 'Trừ tịch – Giao thừa', rule: { type: 'lunarLast', m: 12 }, regions: ['thanh'], priority: 1 },
  { id: 'EV-TET-01', name: 'Tết Nguyên Đán', rule: { type: 'lunarRange', from: [1, 1], to: [1, 3] }, post: 4, regions: ['*'], priority: 1 },
  { id: 'EV-LAPXUAN-01', name: 'Lập Xuân — đổi niên chủ', rule: { type: 'term', name: '立春' }, regions: ['thanh'], priority: 1, iosPart: 'tmb_only' },
  { id: 'EV-NGOCHOANG-01', name: 'Vía Ngọc Hoàng', rule: { type: 'lunar', m: 1, d: 9 }, regions: ['longho', 'thanh'], tong: ['CN'], priority: 2 },
  { id: 'EV-YENTU-01', name: 'Khai hội Yên Tử', rule: { type: 'lunarRange', from: [1, 10], to: [3, 30] }, regions: ['yentu'], tong: ['TH'], priority: 2 },
  { id: 'EV-THUONGNGUYEN-01', name: 'Thượng Nguyên – Nguyên Tiêu', rule: { type: 'lunar', m: 1, d: 15 }, regions: ['*'], priority: 1, dl: 'EV-DL-02' },
  { id: 'EV-YENCUU-01', name: 'Yến Cửu tiết', rule: { type: 'lunar', m: 1, d: 19 }, regions: ['chungnam'], tong: ['TC'], priority: 2 },
  { id: 'EV-THODIA-01', name: 'Vía Thổ Địa', rule: { type: 'lunar', m: 2, d: 2 }, regions: ['thanh'], priority: 3 },
  { id: 'EV-VANXUONG-01', name: 'Vía Văn Xương', rule: { type: 'lunar', m: 2, d: 3 }, regions: ['thulau'], tong: ['NH'], priority: 3 },
  { id: 'EV-LAOQUAN-01', name: 'Vía Thái Thượng Lão Quân', rule: { type: 'lunar', m: 2, d: 15 }, regions: ['tubinh'], priority: 3 },
  { id: 'EV-NIETBAN-01', name: 'Tưởng niệm Phật nhập Niết Bàn', rule: { type: 'lunar', m: 2, d: 15 }, regions: ['buttap'], tong: ['TD', 'TH'], priority: 3, sub: true },
  { id: 'EV-QUANAM-01', name: 'Vía Quán Thế Âm (đản sinh)', rule: { type: 'lunar', m: 2, d: 19 }, regions: ['buttap'], tong: ['TD'], priority: 2 },
  { id: 'EV-XUANPHAN-01', name: 'Xuân Phân', rule: { type: 'term', name: '春分' }, regions: ['vodang'], tong: ['TV'], priority: 3 },
  { id: 'EV-HUYENVU-01', name: 'Vía Huyền Thiên Thượng Đế', rule: { type: 'lunar', m: 3, d: 3 }, regions: ['vodang', 'phongdo'], tong: ['TV', 'BD'], priority: 2 },
  { id: 'EV-HANTHUC-01', name: 'Tết Hàn Thực', rule: { type: 'lunar', m: 3, d: 3 }, regions: ['thanh'], priority: 1 },
  { id: 'EV-BANDAO-01', name: 'Hội Bàn Đào', rule: { type: 'lunar', m: 3, d: 3 }, regions: ['conlon'], priority: 3 },
  { id: 'EV-THANHMINH-01', name: 'Thanh Minh', rule: { type: 'termSpan', name: '清明', days: 15 }, regions: ['*'], priority: 1 },
  { id: 'EV-HUNGVUONG-01', name: 'Ngày Nhớ Cội', rule: { type: 'lunar', m: 3, d: 10 }, regions: ['thanh', 'vanmieu'], priority: 1 },
  { id: 'EV-CHUANDE-01', name: 'Vía Chuẩn Đề', rule: { type: 'lunar', m: 3, d: 16 }, regions: ['buttap', 'tangdia'], tong: ['MT'], priority: 3 },
  { id: 'EV-MAOSON-01', name: 'Hội Mao Sơn', rule: { type: 'lunar', m: 3, d: 18 }, regions: ['maoshan'], tong: ['TT'], priority: 2, verify: true },
  { id: 'EV-COCVU-01', name: 'Cốc Vũ — Lễ tạ chữ', rule: { type: 'term', name: '谷雨' }, regions: ['thulau'], priority: 3 },
  { id: 'EV-PHATDAN-01', name: 'Tuần Phật Đản', rule: { type: 'lunarRange', from: [4, 8], to: [4, 15], main: [4, 15] }, regions: ['buttap', 'yentu'], tong: ['TH', 'TD', 'MT'], priority: 1 },
  { id: 'EV-TTP-01', name: 'Vía Trương Tam Phong', rule: { type: 'lunar', m: 4, d: 9 }, regions: ['vodang'], tong: ['TV'], priority: 2, verify: true },
  { id: 'EV-LUTO-01', name: 'Vía Lữ Tổ', rule: { type: 'lunar', m: 4, d: 14 }, regions: ['vodang', 'chungnam'], tong: ['TV', 'TC'], priority: 2 },
  { id: 'EV-DOANNGO-01', name: 'Tết Đoan Ngọ', rule: { type: 'lunar', m: 5, d: 5, leap: 'skip' }, pre: 4, regions: ['thanh', 'cungthong', 'mieucuong'], priority: 1 },
  { id: 'EV-THIENSU-01', name: 'Vía Trương Thiên Sư', rule: { type: 'lunar', m: 5, d: 18 }, regions: ['longho'], tong: ['CN'], priority: 2, verify: true },
  { id: 'EV-HACHI-01', name: 'Hạ Chí — Linh Bảo', rule: { type: 'term', name: '夏至' }, regions: ['chungnam'], tong: ['TC'], priority: 3 },
  { id: 'EV-QUANAM-02', name: 'Vía Quán Thế Âm (thành đạo)', rule: { type: 'lunar', m: 6, d: 19 }, regions: ['buttap'], tong: ['TD'], priority: 2 },
  { id: 'EV-NGHIA-01', name: 'Tiết Nghĩa', rule: { type: 'lunar', m: 6, d: 24 }, regions: ['thanh'], priority: 3 },
  { id: 'EV-THATTICH-01', name: 'Thất Tịch', rule: { type: 'lunar', m: 7, d: 7 }, regions: ['thanh', 'cungthong'], priority: 1 },
  { id: 'EV-VULAN-01', name: 'Vu Lan — Trung Nguyên', rule: { type: 'lunar', m: 7, d: 15 }, pre: 14, regions: ['*'], priority: 1, dl: 'EV-DL-03', iosPart: 'bao_hieu' },
  { id: 'EV-DIATANG-01', name: 'Vía Địa Tạng', rule: { type: 'lunarLast', m: 7 }, regions: ['phongdo', 'buttap'], tong: ['BD', 'TD'], priority: 2 },
  { id: 'EV-TRUNGTHU-01', name: 'Tết Trung Thu', rule: { type: 'lunar', m: 8, d: 15 }, pre: 7, regions: ['*'], priority: 1 },
  { id: 'EV-THUPHAN-01', name: 'Thu Phân — Đình thí', rule: { type: 'term', name: '秋分' }, regions: ['vodang', 'vanmieu'], priority: 3 },
  { id: 'EV-KHONGTU-01', name: 'Khổng Tử đản', rule: { type: 'lunar', m: 8, d: 27 }, regions: ['vanmieu'], tong: ['NH'], priority: 2 },
  { id: 'EV-CUUHOANG-01', name: 'Cửu Hoàng hội', rule: { type: 'lunarRange', from: [9, 1], to: [9, 9] }, regions: ['trichthien', 'longho', 'phongdo'], tong: ['CN', 'BD'], priority: 3 },
  { id: 'EV-TRUNGCUU-01', name: 'Trùng Cửu', rule: { type: 'lunar', m: 9, d: 9 }, regions: ['trichthien', '*'], priority: 1 },
  { id: 'EV-QUANAM-03', name: 'Vía Quán Thế Âm (xuất gia)', rule: { type: 'lunar', m: 9, d: 19 }, regions: ['buttap'], tong: ['TD'], priority: 2 },
  { id: 'EV-TRUNGTHAP-01', name: 'Tết Trùng Thập — Cơm mới', rule: { type: 'lunar', m: 10, d: 10 }, regions: ['thanh', 'mieucuong'], priority: 3 },
  { id: 'EV-HANGUYEN-01', name: 'Hạ Nguyên', rule: { type: 'lunar', m: 10, d: 15, hours: ['mao', 'than'] }, regions: ['cungthong'], priority: 1 },
  { id: 'EV-KHENTRANG-01', name: 'Hội Khèn Trăng', rule: { type: 'lunar', m: 10, d: 15, hours: ['dau', 'hoi'] }, regions: ['mieucuong'], priority: 3, verify: true },
  { id: 'EV-TONGKHACHBA-01', name: 'Hội đèn tháng Mười', rule: { type: 'lunar', m: 10, d: 25 }, regions: ['tangdia'], tong: ['MT'], priority: 2, verify: true, enabled: false },
  { id: 'EV-NHAGIAO-01', name: 'Ngày Nhà giáo Việt Nam', rule: { type: 'solar', m: 11, d: 20 }, regions: ['vanmieu', '*'], priority: 1 },
  { id: 'EV-TRUCLAM-01', name: 'Giỗ Tổ Trúc Lâm', rule: { type: 'lunar', m: 11, d: 1 }, regions: ['yentu'], tong: ['TH'], priority: 2 },
  { id: 'EV-DIDA-01', name: 'Vía A Di Đà', rule: { type: 'lunar', m: 11, d: 17 }, regions: ['buttap'], tong: ['TD'], priority: 2 },
  { id: 'EV-DONGCHI-01', name: 'Đông Chí — Cửu Cửu Tiêu Hàn', rule: { type: 'termSpan', name: '冬至', days: 81, shujiu: true }, regions: ['thanh', 'chungnam', 'longho'], priority: 1, dl: 'EV-DL-04' },
  { id: 'EV-CHUVANAN-01', name: 'Giỗ Chu Văn An', rule: { type: 'lunar', m: 11, d: 26 }, regions: ['vanmieu'], tong: ['NH'], priority: 2, verify: true },
  { id: 'EV-LAPBAT-01', name: 'Phật thành đạo — Lạp Bát', rule: { type: 'lunar', m: 12, d: 8 }, regions: ['buttap', 'yentu'], tong: ['TD', 'TH'], priority: 2 },
  { id: 'EV-TRUNGDUONG-01', name: 'Vía Vương Trùng Dương', rule: { type: 'lunar', m: 12, d: 22 }, regions: ['chungnam'], tong: ['TC'], priority: 2, verify: true },
  { id: 'EV-SOCVONG-01', name: 'Sóc – Vọng', rule: { type: 'monthly', days: [1, 15], leap: 'include', mergeInto: ['EV-THUONGNGUYEN-01', 'EV-VULAN-01', 'EV-TRUNGTHU-01', 'EV-HANGUYEN-01'] }, regions: ['*'], priority: 4 },
];
// Ghi chú: bảng có 52 mục vì gồm mã phụ EV-NIETBAN-01; 51 lễ chính như Phần 10 §10.5.
```

### 16.3.1 Hàm tính ngày (phác thảo, dùng `lunar-javascript` như `stations.js`)

```js
import { Lunar, LunarYear, Solar } from 'lunar-javascript';

function lunarDay(year, m, d) { return Lunar.fromYmd(year, m, d).getSolar(); }                 // m > 0: tháng chính
function lunarLast(year, m) { return lunarDay(year, m, LunarYear.fromYear(year).getMonth(m).getDayCount()); }
function termOf(lunarYear, name) {                                                          // tiết khí thuộc năm âm
  const t = Lunar.fromYmd(lunarYear, 6, 1).getJieQiTable();
  return t[name];                                                                            // Solar có giờ: toYmdHms()
}
export function occurrence(ev, lunarYear) {
  const r = ev.rule;
  switch (r.type) {
    case 'lunar': return { main: lunarDay(lunarYear, r.m, r.d) };                            // leap 'skip' mặc định: không xét tháng âm (số âm)
    case 'lunarLast': return { main: lunarLast(lunarYear, r.m) };
    case 'lunarRange': return { start: lunarDay(lunarYear, ...r.from), end: r.to === 'last12' ? lunarLast(lunarYear, 12) : lunarDay(lunarYear, ...r.to) };
    case 'term': return { main: termOf(lunarYear, r.name) };
    case 'termSpan': { const s = termOf(lunarYear, r.name); return { start: s, end: s.next(r.days - 1) }; }
    case 'solar': return { main: Solar.fromYmd(lunarYear, r.m, r.d) };
    default: return null;
  }
}
// Lưu ý múi giờ: kết quả là lịch Trung Hoa (UTC+8) — áp bảng ngoại lệ lịch Việt (Phần 09 §9.0.3) trước khi dùng.
// Lưu ý Đông Chí: bảng getJieQiTable() của năm âm Y chứa '冬至' của năm trước và 'DONG_ZHI' của năm Y → chọn khóa theo chu kỳ.
```

---

## 16.4 `src/game/emotes.js` — 46 cử chỉ

```js
// target: có đích · zone: nơi được dùng · win: chỉ trong cửa sổ lễ · unlock: điều kiện mở · quiet: dùng được trong vùng im lặng
export const EMOTES = {
  // 6 cũ — giữ nguyên icon, text
  bow:   { icon: '🙇', text: 'cúi chào', target: true },
  palm:  { icon: '🙏', text: 'chắp tay', target: true, quiet: true },
  clap:  { icon: '👏', text: 'vỗ tay', target: true },
  tea:   { icon: '🍵', text: 'mời trà', target: true },
  wave:  { icon: '👋', text: 'vẫy tay', target: true },
  think: { icon: '🤔', text: 'suy ngẫm' },
  // lễ nghi
  vai:        { icon: '🙇‍♂️', text: 'vái', target: true },
  ap:         { icon: '🤲', text: 'ấp tay', target: true },
  incense:    { icon: '🕯️', text: 'dâng hương', zone: 'temple' },
  lay:        { icon: '🛐', text: 'lạy', zone: 'altar' },
  dang_tra:   { icon: '🫖', text: 'dâng trà', target: true },
  tung:       { icon: '📿', text: 'lần tràng hạt', quiet: true, unlock: { tong: ['TD', 'TH', 'MT'], orRite: 'phat' } },
  kinh_hanh:  { icon: '🚶', text: 'kinh hành', zone: 'thien', unlock: { tong: ['TH'] } },
  phat_tran:  { icon: '🪶', text: 'vung phất trần', unlock: { item: 'phat_tran' } },
  cam_kinh:   { icon: '📜', text: 'nâng kinh' },
  hoi_huong:  { icon: '🌸', text: 'hồi hướng', zone: 'rite:hoi', quiet: true },
  // giao tiếp
  nod:       { icon: '🙂', text: 'gật đầu', target: true },
  shake:     { icon: '🙃', text: 'lắc đầu', target: true },
  point:     { icon: '👉', text: 'chỉ đường', target: true },
  beckon:    { icon: '🫴', text: 'vẫy lại đây', target: true },
  smile:     { icon: '😊', text: 'mỉm cười', target: true },
  laugh:     { icon: '😄', text: 'cười' },
  shrug:     { icon: '🤷', text: 'nhún vai' },
  wait_hand: { icon: '✋', text: 'ra hiệu chờ', target: true },
  listen:    { icon: '👂', text: 'lắng nghe', target: true },
  gift:      { icon: '🎁', text: 'trao quà', target: 'required', action: 'gift' },
  // sinh hoạt
  doc_sach:   { icon: '📖', text: 'đọc sách' },
  viet_chu:   { icon: '🖌️', text: 'viết chữ' },
  pha_tra:    { icon: '🍵', text: 'pha trà' },
  thoi_sao:   { icon: '🎶', text: 'thổi sáo', unlock: { riteAt: 'yentu' } },
  gay_dan:    { icon: '🎼', text: 'gảy đàn', unlock: { riteAt: 'vodang' } },
  ngam_trang: { icon: '🌕', text: 'ngắm trăng' },
  quat:       { icon: '🪭', text: 'phe phẩy quạt', unlock: { item: ['quat_giay', 'quat_long'] } },
  la_ban:     { icon: '🧭', text: 'xem la bàn', unlock: { item: 'la_ban_tay' } },
  ngoi_xep:   { icon: '🧘', text: 'ngồi xếp bằng' },
  vuon_vai:   { icon: '🙆', text: 'vươn vai' },
  // lễ tiết
  chuc_tet:       { icon: '🧧', text: 'chúc Tết', target: true, win: 'EV-TET-01' },
  phao_giay:      { icon: '🎉', text: 'pháo giấy', win: ['EV-TET-01', 'ct_done'] },
  ruoc_den:       { icon: '🏮', text: 'rước đèn', win: ['EV-TRUNGTHU-01', 'EV-THUONGNGUYEN-01'] },
  mua_lan:        { icon: '🦁', text: 'múa lân', win: ['EV-TRUNGTHU-01', 'EV-TET-01'], pair: 3000 },
  tha_den:        { icon: '🪷', text: 'thả đèn hoa đăng', win: ['EV-VULAN-01', 'EV-HANGUYEN-01'], zone: 'water_edge' },
  banh_trung_thu: { icon: '🥮', text: 'mời bánh', target: true, win: 'EV-TRUNGTHU-01' },
  ngam_cuc:       { icon: '🌼', text: 'ngắm hoa cúc', win: 'EV-TRUNGCUU-01' },
  dang_cao:       { icon: '⛰️', text: 'lên cao nhìn xa', win: 'EV-TRUNGCUU-01', zone: 'summit' },
  hai_la:         { icon: '🌿', text: 'hái lá giờ Ngọ', win: 'EV-DOANNGO-01', hour: 'ngo' },
  cai_hoa:        { icon: '🌹', text: 'cài hoa lên áo', win: 'EV-VULAN-01', private: true },   // phát cho người khác: màu hồng nhạt chung
};
```

---

## 16.5 `src/game/phrases.js` — hình dạng dữ liệu

276 câu đầy đủ ở Phần 06. Hình dạng mỗi mục và ví dụ:

```js
export const SLOTS = {
  vung: new Set(['thanh', 'tubinh', 'manh', 'trichthien', 'cungthong', 'thulau', 'phongthuy', 'lichduong', 'longho', 'vodang',
    'chungnam', 'maoshan', 'yentu', 'buttap', 'tangdia', 'vanmieu', 'phongdo', 'mieucuong', 'conlon', 'vancoc']),
  gio: new Set(['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']),
  viec: new Set(['giaian', 'anco', 'tubinh', 'tuvi', 'phongthuy', 'trachnhat', 'hophon', 'khoacu', 'ketphu', 'tinhtoa',
    'hanhhuong', 'haithuoc', 'phongsinh', 'suaduong', 'viectuan', 'letuan']),
  so: new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
  nguoi: 'room',   // kiểm ở DO
};
export const PHRASES = {
  hi:      { vi: 'Chào bạn!', en: 'Hello!' },                     // khóa cũ — giữ nguyên
  'chao.4': { vi: 'Khuya rồi, bạn vẫn tu à?', en: 'Still practicing this late?', when: { gio: ['ty', 'suu'] } },
  'moi.3': { vi: 'Cùng đi {vung} không?', en: 'Go to {vung} together?', slots: ['vung'] },
  'moi.6': { vi: 'Hẹn giờ {gio} gặp nhé.', en: 'Meet at the hour of {gio}?', slots: ['gio'] },
  'an.12': { vi: 'Xét đắc lệnh trước.', en: 'Check the season first.', when: { coopStep: 'strength' } },
  'chi.3': { vi: 'Xét đắc lệnh trước rồi hẵng tính.', when: { from: 'master' } },
  'dl.1':  { vi: 'Đi dạo cùng không?', en: 'A walk together?', when: { ab: 'A', rel: 'partner' } },
  'tet.5': { vi: 'Lì xì lấy may đây!', en: 'Lucky money for you!', when: { fest: 'EV-TET-01' } },
  'at.2':  { vi: 'Mình không thích, xin dừng lại.', en: "I don't like that, please stop.", safety: true },
  // … đủ 276 khóa theo Phần 06
};
// Hiển thị slot: tên vùng lấy từ terrain.js › REGIONS; giờ: «giờ Tuất (19–21h)».
// Mọi khóa slot là ASCII không dấu; chữ hiển thị lấy từ bảng tên (Phần 06 §6.20).
```

---

## 16.6 Nhóm chỗ ngồi đồng tu

```js
import { SEATS } from './protocol.js';                    // = court.js › TEA_SEATS (3 chỗ, đã có)
export const SEAT_GROUPS = {
  tra: SEATS,                                              // Trà Thất — tương thích sit {} cũ
  // đình đồng tu thánh địa: 9 chỗ vòng tròn bán kính 3 m quanh tâm (cx, cy) do tài liệu 07 đặt
  'dinh:longho': ring(9, 3), 'dinh:vodang': ring(9, 3), 'dinh:chungnam': ring(9, 3), 'dinh:maoshan': ring(9, 3),
  'dinh:yentu': ring(9, 3), 'dinh:buttap': ring(9, 3), 'dinh:vanmieu': ring(9, 3), 'dinh:phongdo': ring(9, 3),
  'yluu:mieucuong': ring(8, 2.5),                          // bếp lửa Y Lư
  // trạm nghỉ EV-CAU: 4 chỗ
  ...Object.fromEntries(Array.from({ length: 19 }, (_, i) => [`tram:${String(i + 1).padStart(2, '0')}`, ring(4, 1.5)])),
};
// SectHall: nhóm chỗ trong đạo tràng dùng tọa độ cục bộ — 'giang' (16), 'vantung' (30), 'kimdinh' (9)
function ring(n, rMetres) { /* trả n điểm (ô) quanh tâm; tâm cộng khi đặt vào thế giới */ }
export const COTU = { cycleMs: 8000, syncTol: 0.15, syncTolPartner: 0.2, syncRounds: 3, presPer: 0.08, presMax: 0.30, sync: 0.10, venue: 0.05, dayCapExtra: 15, idleRounds: 2 };
```

---

## 16.7 Kho việc tuần (mẫu hai tông)

```js
// count: sự kiện máy chủ nào được đếm (nguồn tin cậy, Phần 11 §11.4.9). base: mục tiêu cho 20 người hoạt động.
export const WEEKLY = {
  'GUILD-Q-CN-01': { name: 'Phù cho khách', count: 'mg:ket_phu:client_ok', base: 30 },
  'GUILD-Q-CN-02': { name: 'Đèn Đẩu sáng', count: 'lamp:dau|lamp:thaitue', base: 60 },
  'GUILD-Q-CN-03': { name: 'Quầy đổi mệnh', count: 'quest:dmh_expose', base: 8, perUser: 2 },
  'GUILD-Q-CN-04': { name: 'Chọn ngày cho đàn', count: 'hall:trach>=70', base: 15 },
  'GUILD-Q-CN-05': { name: 'Tuần sơn', count: 'walk_km:longho', base: 25 },
  'GUILD-Q-CN-06': { name: 'Đọc Đạo Tạng bộ Chính Nhất', count: 'read:daozang:zhengyi', base: 40 },
  'GUILD-Q-CN-07': { name: 'Hộ tống khách hành hương', count: 'party_walk:thanh>longho', base: 6 },
  'GUILD-Q-CN-08': { name: 'Đường lên Thiên Sư Phủ', count: 'ev:EV-CAU-09', base: 300 },
  'GUILD-Q-CN-09': { name: 'Lặng trước khi kết', count: 'cotu_min|tinhtoa_min', base: 400 },
  'GUILD-Q-CN-10': { name: 'Giữ lời hứa sớ', count: 'promise_kept', base: 10 },
  'GUILD-Q-TD-01': { name: 'Phóng sinh đúng cách', count: 'deed:phongsinh_ok', base: 50 },
  'GUILD-Q-TD-02': { name: 'Một nghìn danh hiệu', count: 'mg:niem:beat_ok', base: 10000 },
  'GUILD-Q-TD-03': { name: 'Gánh gạo', count: 'rite:ganh_gao', base: 40 },
  'GUILD-Q-TD-04': { name: 'Xin lỗi có việc sửa', count: 'deed:chanhui_fix', base: 20 },
  'GUILD-Q-TD-05': { name: 'Mười điều thiện', count: 'deed:ten_thien', base: 60 },
  'GUILD-Q-TD-06': { name: 'Đọc kinh theo việc', count: 'read:jing_zhou', base: 14 },
  'GUILD-Q-TD-07': { name: 'Dọn hồ', count: 'act:don_ho', base: 100 },
  'GUILD-Q-TD-08': { name: 'Đường đến Bút Tháp', count: 'ev:EV-CAU-14', base: 300 },
  'GUILD-Q-TD-09': { name: 'Hợp Hôn cho khách', count: 'hall:hophon>=70', base: 12 },
  'GUILD-Q-TD-10': { name: 'Ngồi trước hồ', count: 'tinhtoa_min:zone:hosen_buttap', base: 300 },
};
export const WEEKLY_RULE = { offer: 5, pick: 3, perUserMax: 0.4, dv: 40, phucMax: 60, minShare: 0.05, scale: [0.5, 1.5], refN: 20 };
```

---

## 16.8 Thiên Mệnh Bàn — dữ liệu ánh xạ

```js
// Phần 08 §8.1.2–8.1.4. Hành theo fengshui-compass › SHAN_WX (Càn: biến thể Kim)
export const SHAN = ['壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥'];
export const PALACE_OF_SHAN = ['Bắc', 'Bắc', 'Bắc', 'Đông Bắc', 'Đông Bắc', 'Đông Bắc', 'Đông', 'Đông', 'Đông', 'Đông Nam', 'Đông Nam', 'Đông Nam',
  'Nam', 'Nam', 'Nam', 'Tây Nam', 'Tây Nam', 'Tây Nam', 'Tây', 'Tây', 'Tây', 'Tây Bắc', 'Tây Bắc', 'Tây Bắc'];   // khớp tên hướng annualTabooOverview
export const TABOO_ACTS = {
  'Ngũ Hoàng': ['bell', 'case_kim', 'ket_phu'],     // Kim tiết Thổ; không 'dig'
  'Thái Tuế':  ['lamp_thaitue'],
  'Tuế Phá':   ['giai_oan', 'hoa_hop', 'tea_stranger'],
  'Tam Sát':   ['face_toward', 'compass_turn'],      // nhận công chỉ khi quay mặt về phương sát
  'Nhị Hắc':   ['herb', 'warm_water'],
};
export const CLEAN_ACTS = { '水': ['cotu', 'hoa_dang'], '木': ['plant'], '火': ['lamp'], '土': ['sweep'], '金': ['read'] };
export const FORBIDDEN_ON_TABOO = ['dig', 'carry_stone', 'slab'];   // không động thổ ở phương kỵ
export const TMB_PHASES = [
  { id: 'khai', from: '立春', to: '雨水', perShanChecks: (N) => Math.max(3, Math.ceil(N / 200)) },
  { id: 'hoa',  from: '雨水', to: '春分' },
  { id: 'an',   from: '春分', to: '清明' },
  { id: 'thanh', at: '清明', dl: 'EV-DL-01' },
];
export const SCALE = { p: 0.35, c: 25, k: 0.85, wMin: 2000, wMax: 5000000, cutMax: 2, cut: 0.15, dayCapTmb: 100, dayCapCau: 120 };
```

---

## 16.9 Mạng đường `EV-CAU`

```js
// Phần 08 §8.2.1. len: mét (thẳng giữa tâm vùng, canon §3); rain: chịu mưa mùa; snow: tuyết
export const ROADS = [
  { id: 'EV-CAU-01', a: 'thanh', b: 'vancoc', len: 260 },
  { id: 'EV-CAU-02', a: 'thanh', b: 'thulau', len: 700, rain: true },
  { id: 'EV-CAU-03', a: 'thanh', b: 'tubinh', len: 835 },
  { id: 'EV-CAU-04', a: 'thanh', b: 'manh', len: 825, rain: true },
  { id: 'EV-CAU-05', a: 'thanh', b: 'trichthien', len: 849 },
  { id: 'EV-CAU-06', a: 'thanh', b: 'cungthong', len: 877, rain: true },
  { id: 'EV-CAU-07', a: 'thanh', b: 'phongthuy', len: 820 },
  { id: 'EV-CAU-08', a: 'thanh', b: 'lichduong', len: 820 },
  { id: 'EV-CAU-09', a: 'lichduong', b: 'longho', len: 709, rain: true },
  { id: 'EV-CAU-10', a: 'thulau', b: 'vodang', len: 800 },
  { id: 'EV-CAU-11', a: 'manh', b: 'chungnam', len: 1089 },
  { id: 'EV-CAU-12', a: 'cungthong', b: 'maoshan', len: 1112, rain: true },
  { id: 'EV-CAU-13', a: 'trichthien', b: 'yentu', len: 922, rain: true },
  { id: 'EV-CAU-14', a: 'cungthong', b: 'buttap', len: 888, rain: true },
  { id: 'EV-CAU-15', a: 'tubinh', b: 'tangdia', len: 1150, snow: true },
  { id: 'EV-CAU-16', a: 'buttap', b: 'vanmieu', len: 640 },
  { id: 'EV-CAU-17', a: 'yentu', b: 'vanmieu', len: 566 },
  { id: 'EV-CAU-18', a: 'phongthuy', b: 'phongdo', len: 680, rain: true },
  { id: 'EV-CAU-19', a: 'trichthien', b: 'mieucuong', len: 1063, rain: true },
];
export const segCount = (r) => Math.max(3, Math.round(r.len / 100));      // tổng 156 đoạn
export const RAIN_TERMS = ['谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑'];
export const SNOW_TERMS = ['小雪', '大雪', '冬至', '小寒', '大寒'];
export const HU = { start: 40, rainHeavy: 1.5, rainLight: 0.5, trafficDiv: 400, trafficMax: 1,
  bands: [[30, +0.05], [60, 0], [85, -0.10], [100, -0.20]] };              // ngưỡng hư → hệ số tốc độ đi bộ
export const CAU_ACTS = {
  carry:  { cong: 1, hu: 0.4, minSec: 8 },
  slab:   { cong: 3, hu: 1.5, people: 2 },
  ditch:  { cong: 2, hu: 0.8 },
  plant:  { cong: 1, hu: 0.2, rainCut: 0.2 },
  bridge: { cong: 4, hu: 2.0, people: 3, segKind: 'bridge' },
};
export const MERIT_CAU = { minCongPerRoadWeek: 10, maxPerWeek: 3 };      // «Sửa cầu đường» +2 (thang app)
```

## 16.10 Checklist nghiệm thu Phần 16

- [ ] Mỗi khối dữ liệu có test so khớp với bảng thiết kế tương ứng (vd `TIERS` ↔ Phần 01 §1.8.3; `ROADS` tổng 15.604 m, 156 đoạn).
- [ ] Mọi khóa slot ASCII; mọi mã `GUILD-*`, `EV-*` duy nhất toàn dự án (test gom mã từ `docs/gdd/10-xa-hoi/*.md`).
- [ ] `PURPOSES` không có phần tử trỏ tới người chơi.
- [ ] `FESTIVALS` có `verify: true` đúng với các lễ ⚠ của Phần 09–10.
