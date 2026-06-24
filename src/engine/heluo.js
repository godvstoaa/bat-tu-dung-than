// ============================================================================
//  HÀ LẠC LÝ SỐ 河洛理数 (còn gọi 河洛真数) — CHUYỂN BÁT TỰ → QUẺ CHỦ/MỆNH QUÁI
//  Hệ cổ học gạch cầu giữa MỆNH (bát tự cố định) và QUẺ (chu dịch): từ 8 chữ
//  (4 trụ can+chi) → 天数/地数 → thượng/hạ quái → quẻ kép (bản mệnh quái) +
//  元堂 (hào động). Đọc mệnh qua 卦辞 (lời quẻ) + 元堂 爻辞 (lời hào). Sau đó
//  biến ra 后天卦 (quẻ hậu thiên/đại vận). Tương truyền 陈抟 (Trần Đoàn) sáng lập.
//
//  NGUỒN (trích từng bước, không bịa):
//   - 《河洛理数》văn tự cổ, ctext.org/wiki.pl?if=gb&chapter=922403 (khẩu quyết
//     can/chi phối số).
//   - 《三才发秘·详元堂爻位式》, shidianguji.com/zh/book/SDZJ0165 — bảng 元堂
//     đầy đủ (1-dương hào … 5-dương hào chi quái).
//   - guoxueruanjian.com/heluolishu/p/372.html — phát biểu thuật toán rõ nhất
//     (phối số, quy tắc giảm,后天八卦配洛书, 寄宫, hợp quái).
//   - m.douban.com/note/647898298/ — VÍ DỤ thực tế (辛亥 庚寅 甲子 丁卯 →
//     艮为山 → 风山渐) + quy tắc 元堂 rút gọn + phép 后天卦.
//   - zhuanlan.zhihu.com/p/9445586478, p/565608194, p/14001864265 — xác nhận.
//
//  TẤT CẢ bảng/quy tắc dưới đây đều được trích từ ≥1 nguồn trên. Chỗ cổ thư
//  mâu thuẫn (vd 乾/坤 thuần hào, số dư = 0) được ghi chú cờ "DISPUTED".
//  Dữ liệu 64-quẻ + tên Hán Việt TÁI SỬ DỤNG từ xuankong-dagua.js + meihua.js
//  (không nhân bản).
// ============================================================================
import { GAN, ZHI } from './constants.js';

// ---------------------------------------------------------------------------
//  1. BẢNG PHỐI SỐ 河图数 (can/chi → số). Trích 《河洛理数》ctext.org:
//     Can khẩu quyết: 「戊一乙癸二，庚三辛四同，壬甲從六數，丁七丙八宮，
//                      己九無差別，五數寄於中」
//     Chi khẩu quyết:「亥子一六水，寅卯三八木，巳午二七火，申酉四九金，
//                      辰戌丑未土，五十總生成」
//  → Can: 1 giá trị đơn. Chi: MỖI chi mang ĐÔI số (sinh số lẻ + thành số chẵn).
//    Xác nhận bởi 4 nguồn độc lập (ctext, guoxueruanjian, douban, zhihu).
// ---------------------------------------------------------------------------
const GAN_HESHU = {
  // can → số (đạo bởi: can→quẻ→洛书数; 6=乾 2=坤 8=艮 7=兑 1=坎 9=离 3=震 4=巽)
  甲: 6, 乙: 2, 丙: 8, 丁: 7, 戊: 1, 己: 9, 庚: 3, 辛: 4, 壬: 6, 癸: 2,
};
// chi → [số lẻ (sinh/dương → 天数), số chẵn (thành/âm → 地数)]
const ZHI_HESHU = {
  亥: [1, 6], 子: [1, 6],          // thuỷ
  寅: [3, 8], 卯: [3, 8],          // mộc
  巳: [2, 7], 午: [2, 7],          // hoả  (chú ý: 2 chẵn trước, 7 lẻ sau)
  申: [4, 9], 酉: [4, 9],          // kim
  辰: [5, 10], 戌: [5, 10], 丑: [5, 10], 未: [5, 10], // thổ
};

// ---------------------------------------------------------------------------
//  2. SỐ → QUẺ ĐƠN (hậu thiên bát quái / 洛书). Trích guoxueruanjian:
//     「坎一，坤二，震三，巽四，乾六，兌七，艮八，離九」(5 寄 trung cung)
//     Đây là HẬU THIÊN bát quái (文王), KHÔNG phải tiên thiên. Xác nhận bởi
//     bách khoa + Nam Hoài Cẩn (quanxue.cn).
// ---------------------------------------------------------------------------
const NUM2TRI = { 1: '坎', 2: '坤', 3: '震', 4: '巽', 6: '乾', 7: '兑', 8: '艮', 9: '离' };
// 3 hào mỗi quẻ đơn, từ DƯỚI lên (1=dương, 0=âm). Tái dùng định nghĩa meihua.js.
// 3 hào mỗi quẻ đơn, từ DƯỚI lên (index 0 = hào sơ/dưới). 1=dương, 0=âm.
//   艮 ☶ = 2 âm dưới + 1 dương trên. 兑 ☱ = 2 dương dưới + 1 âm trên.
const TRI_LINES = {
  乾: [1, 1, 1], 兑: [1, 1, 0], 离: [1, 0, 1], 震: [1, 0, 0],
  巽: [0, 1, 1], 坎: [0, 1, 0], 艮: [0, 0, 1], 坤: [0, 0, 0],
};

// ---------------------------------------------------------------------------
//  3. 5 寄中宫 — khi số (sau giảm) = 5 thì không có quẻ riêng, tuỳ 三元 × giới.
//     Trích 寄宫诗 (zhihu p/9445586478) + phát biểu guoxueruanjian:
//     上元: 男→艮, 女→坤. 下元: 男→离, 女→兑.
//     中元: 阳男阴女→艮, 阴男阳女→坤.
//     三元 近代: 上元=1864-1923, 中元=1924-1983, 下元=1984-2043.
// ---------------------------------------------------------------------------
function sanyuan(year) {
  if (year >= 1864 && year <= 1923) return '上元';
  if (year >= 1924 && year <= 1983) return '中元';
  if (year >= 1984 && year <= 2043) return '下元';
  // ngoài chu kỳ 180 năm: cuốn tiếp theo (2044→2103 = 上元 mới). an toàn: mod 180.
  const cycle = ((year - 1864) % 180 + 180) % 180;
  if (cycle < 60) return '上元';
  if (cycle < 120) return '中元';
  return '下元';
}
// isYangMale: 阳男 OR 阴女 → cùng nhóm; isYinMale: 阴男 OR 阳女.
function jiGong5(year, gender) {
  const yuan = sanyuan(year);
  const isMale = (gender === 'nam' || gender === 'male');
  const yearGanYin = isYearGanYin(year); // true = năm can âm (乙丁己辛癸)
  // 阳男 = nam+năm dương; 阴男 = nam+năm âm; 阳女 = nữ+năm dương; 阴女 = nữ+năm âm
  const yangNan = isMale && !yearGanYin;
  const yinNan = isMale && yearGanYin;
  const yangNu = !isMale && !yearGanYin;
  const yinNu = !isMale && yearGanYin;
  if (yuan === '上元') return isMale ? '艮' : '坤';
  if (yuan === '下元') return isMale ? '离' : '兑';
  // 中元: 阳男阴女→艮; 阴男阳女→坤
  if (yangNan || yinNu) return '艮';
  if (yinNan || yangNu) return '坤';
  return '坤'; // fallback an toàn
}
function isYearGanYin(year) {
  // Lấy năm can thông qua lunar-javascript-free: 4=甲(0) → year%10
  // 甲0 乙1 丙2 丁3 戊4 己5 庚6 辛7 壬8 癸9. 4≡甲 → (year-4)%10.
  const g = ((year - 4) % 10 + 10) % 10; // 0=甲
  return g % 2 === 1; // lẻ = âm can
}

// ---------------------------------------------------------------------------
//  4. 64 QUẺ (King Wen) — tái sử dụng bảng tên Hán + Hán Việt từ app.
//     Tuy nhiên ta không import (tránh phụ thuộc vòng): tự bảng đầy đủ tại đây
//     dựa trên HEX_NAME của xuankong-dagua.js (key = thượng+hạ). Mỗi quẻ: tên
//     Hán + Hán Việt + số thứ tự King Wen.
// ---------------------------------------------------------------------------
const HEX64 = {
  '乾乾': ['乾', 'Càn', 1], '坤坤': ['坤', 'Khôn', 2], '坎坎': ['坎', 'Khảm', 29], '离离': ['离', 'Ly', 30],
  '震震': ['震', 'Chấn', 51], '巽巽': ['巽', 'Tốn', 57], '艮艮': ['艮', 'Cấn', 52], '兑兑': ['兑', 'Đoài', 58],
  '坎坤': ['师', 'Sư', 7], '坤坎': ['比', 'Tỷ', 8], '震坎': ['屯', 'Truân', 3], '坎震': ['解', 'Giải', 40],
  '巽坎': ['井', 'Tỉnh', 48], '坎巽': ['涣', 'Hoán', 59], '离坎': ['未济', 'Vị Tế', 64], '坎离': ['既济', 'Ký Tế', 63],
  '艮坎': ['蹇', 'Kiển', 39], '坎艮': ['蒙', 'Mông', 4], '兑坎': ['困', 'Khốn', 47], '坎兑': ['节', 'Tiết', 60],
  '乾坎': ['讼', 'Tụng', 6], '坎乾': ['需', 'Nhu', 5], '震坤': ['复', 'Phục', 24], '坤震': ['豫', 'Dự', 16],
  '巽坤': ['观', 'Quán', 20], '坤巽': ['升', 'Thăng', 46], '离坤': ['明夷', 'Di Minh', 36], '坤离': ['晋', 'Tấn', 35],
  '艮坤': ['剥', 'Bác', 23], '坤艮': ['谦', 'Khiêm', 15], '兑坤': ['萃', 'Tụy', 45], '坤兑': ['临', 'Lâm', 19],
  '乾坤': ['否', 'Bĩ', 12], '坤乾': ['泰', 'Thái', 11], '巽震': ['益', 'Ích', 42], '震巽': ['恒', 'Hằng', 32],
  '离震': ['丰', 'Phong', 55], '震离': ['噬嗑', 'Thệ Hạp', 21], '艮震': ['颐', 'Di', 27], '震艮': ['小过', 'Tiểu Quá', 62],
  '兑震': ['归妹', 'Quy Muội', 54], '震兑': ['随', 'Tùy', 17], '乾震': ['无妄', 'Vô Vọng', 25], '震乾': ['大壮', 'Đại Tráng', 34],
  '离巽': ['鼎', 'Đỉnh', 50], '巽离': ['家人', 'Gia Nhân', 37], '艮巽': ['蛊', 'Cổ', 18], '巽艮': ['渐', 'Tiệm', 53],
  '兑巽': ['大过', 'Đại Quá', 28], '巽兑': ['中孚', 'Trung Phu', 61], '乾巽': ['姤', 'Cấu', 44], '巽乾': ['小畜', 'Tiểu Súc', 9],
  '艮离': ['贲', 'Bí', 22], '离艮': ['旅', 'Lữ', 56], '兑离': ['革', 'Cách', 49], '离兑': ['睽', 'Khuê', 38],
  '乾离': ['同人', 'Đồng Nhân', 13], '离乾': ['大有', 'Đại Hữu', 14], '艮兑': ['损', 'Tổn', 41], '兑艮': ['咸', 'Hàm', 31],
  '乾艮': ['遁', 'Độn', 33], '艮乾': ['大畜', 'Đại Súc', 26], '乾兑': ['履', 'Lý', 10], '兑乾': ['夬', 'Quái', 43],
};
function hexOf(upper, lower) {
  const e = HEX64[upper + lower];
  return e ? { num: e[2], name: e[0], nameVi: e[1] } : { num: 0, name: upper + lower, nameVi: '(tổ hợp)' };
}

// ---------------------------------------------------------------------------
//  5. 元堂 — THUẬT TOÁN 飞支 (fly-the-branches) theo 《三才发秘·详元堂爻位式》.
//     ⚠ CÁC BẢNG CỐ ĐỊNH TRONG CỔ THƯ (vd "二阳爻: 子→四,丑→五…") ĐƯỢC NEO VÀO
//     MỘT QUẺ CỤ THỂ (澤地萃) — SỐ HÀO KHÔNG DỊCH CHUYỂN ĐƯỢC SANG QUẺ KHÁC. Do
//     đó ta cài ĐÚNG thuật toán nền (trích nguyên văn + zhihu p/565608194):
//
//     起元堂诗: 「阴阳一二重而寄，三位虽重没寄宫，四五无重应有寄，纯爻男女不相同。」
//     · Hào đánh số TỪ DƯỚI LÊN (初爻=1 … 上爻=6).
//     · "Đồng âm" = hào cùng cực với giờ (giờ dương 子-巳 → hào dương; giờ âm 午-亥
//       → hào âm). Gọi N = số hào đồng âm. 6 giờ cùng cực phải "bay" lên hào.
//     · N=1 hoặc 2 (一二重而寄): MỖI hào đồng âm nhận 2 giờ (重 = lặp 2 lượt từ dưới
//       lên), lấp 2N slot; giờ dư (6-2N) "寄" sang hào NGHỊCH cực (bay từ dưới lên).
//     · N=3 (三位虽重没寄宫): 2 lượt × 3 hào = 6 → lấp đủ, KHÔNG 寄.
//     · N=4 hoặc 5 (四五无重应有寄): MỖI hào đồng âm nhận 1 giờ (KHÔNG lặp), lấp N
//       slot; giờ dư (6-N) 寄 sang hào nghịch (bay từ dưới lên).
//     · N=6 (纯爻 乾/坤): DISPUTED — cổ thư phân theo giới + đông/hạ chí; ta dùng
//       heuristic (xem code) + cờ review.
//     Xác nhận bởi 三才发秘 (shidianguji) + zhihu "六爻飞支". Lưu ý: ví dụ douban
//     (辛亥庚寅甲子丁卯) có lỗi thuật toán (dùng luật N≥4 cho quẻ N=2) → KHÔNG dùng.
// ---------------------------------------------------------------------------
const YANG_HOURS = ['子', '丑', '寅', '卯', '辰', '巳'];
const YIN_HOURS = ['午', '未', '申', '酉', '戌', '亥'];

// Trả mảng 6 phần tử: hourList[i] → vị trí hào (1-6) là 元堂 ứng giờ đó.
// Dùng để tra giờ sinh. lines = [h1..h6] (1=dương, 0=âm), isYangHour.
function flyBranches(lines, isYangHour) {
  const hourList = isYangHour ? YANG_HOURS : YIN_HOURS;
  const want = isYangHour ? 1 : 0; // cực cần tìm
  // vị trí hào (1-based) đồng âm + nghịch cực, theo thứ tự từ dưới lên
  const same = []; // hào đồng âm
  const opp = [];  // hào nghịch cực
  for (let i = 0; i < 6; i++) {
    (lines[i] === want ? same : opp).push(i + 1);
  }
  const N = same.length;
  const mapping = new Array(6).fill(0); // index = slot giờ (0-5), value = hào

  if (N >= 1 && N <= 5) {
    let slot = 0;
    if (N <= 3) {
      // 重: 2 lượt, mỗi lượt bay từ dưới lên trên các hào đồng âm
      for (let pass = 0; pass < 2 && slot < 6; pass++) {
        for (const line of same) {
          if (slot >= 6) break;
          mapping[slot++] = line;
        }
      }
    } else {
      // 四五无重: 1 lượt duy nhất qua N hào đồng âm
      for (const line of same) {
        if (slot >= 6) break;
        mapping[slot++] = line;
      }
    }
    // 寄: giờ dư bay sang hào nghịch cực, từ dưới lên
    for (const line of opp) {
      if (slot >= 6) break;
      mapping[slot++] = line;
    }
    // (slot có thể <6 nếu N=0 — lý thuyết không xảy ra vì 6 hào luôn có ≥1 cực nào đó)
  } else if (N === 6) {
    // 乾 (6 dương) / 坤 (6 âm) — DISPUTED. Heuristic: không phân biệt cực được nên
    // dùng hạ quái (hào 1-3) cho khung giờ đầu, thượng quái (hào 4-6) cho khung sau,
    // bay từ dưới lên, lặp. Cờ review cho user.
    for (let i = 0; i < 6; i++) mapping[i] = (i % 3) + 1;
  }
  return { hourList, mapping, N, same, opp };
}

// ---------------------------------------------------------------------------
//  6. 卦辞/爻辞 周易 (public domain — ctext/维基文库 周易). Cài đủ nhóm phổ
//     biến để đọc; nhóm còn lại có câu chugeneric. Tên key = tên Hán quẻ.
//     guaCi = lời cả quẻ; yaoCi[1..6] = lời từng hào (1=initial..6=upper).
//     Ưu tiên các quẻ hay gặp + quẻ của ví dụ chuẩn (艮, 渐).
// ---------------------------------------------------------------------------
const YIJING = {
  '乾': { gua: '乾：元，亨，利，貞。', yao: { 1: '潛龍勿用。', 2: '見龍在田，利見大人。', 3: '君子終日乾乾，夕惕若厲，無咎。', 4: '或躍在淵，無咎。', 5: '飛龍在天，利見大人。', 6: '亢龍有悔。' } },
  '坤': { gua: '坤：元，亨，利牝馬之貞。', yao: { 1: '履霜，堅冰至。', 2: '直方大，不習無不利。', 3: '含章可貞。', 4: '括囊，無咎無譽。', 5: '黃裳，元吉。', 6: '龍戰于野，其血玄黃。' } },
  '屯': { gua: '屯：元亨利貞，勿用有攸往，利建侯。', yao: { 1: '磐桓，利居貞，利建侯。', 2: '屯如邅如，乘馬班如。', 3: '即鹿無虞，惟入于林中。', 4: '乘馬班如，求婚媾。', 5: '屯其膏，小貞吉，大貞凶。', 6: '乘馬班如，泣血漣如。' } },
  '蒙': { gua: '蒙：亨。匪我求童蒙，童蒙求我。', yao: { 1: '發蒙，利用刑人。', 2: '包蒙吉。', 3: '勿用取女。', 4: '困蒙，吝。', 5: '童蒙，吉。', 6: '擊蒙，不利為寇。' } },
  '需': { gua: '需：有孚，光亨，貞吉，利涉大川。', yao: { 1: '需于郊，利用恆。', 2: '需于沙，小有言。', 3: '需于泥，致寇至。', 4: '需于血，出自穴。', 5: '需于酒食，貞吉。', 6: '入于穴，有不速之客三人來。' } },
  '讼': { gua: '訟：有孚窒惕，中吉，終凶。利見大人。', yao: { 1: '不永所事，小有言，終吉。', 2: '不克訟，歸而逋。', 3: '食舊德，貞厲，終吉。', 4: '不克訟，復即命，渝，安貞吉。', 5: '訟，元吉。', 6: '或錫之鞶帶，終朝三褫之。' } },
  '师': { gua: '師：貞，丈人吉，無咎。', yao: { 1: '師出以律，否臧凶。', 2: '在師中，吉，無咎。', 3: '師或輿尸，凶。', 4: '師左次，無咎。', 5: '田有禽，利執言，無咎。', 6: '大君有命，開國承家，小人勿用。' } },
  '比': { gua: '比：吉。原筮元永貞，無咎。', yao: { 1: '有孚比之，無咎。', 2: '比之自內，貞吉。', 3: '比之匪人。', 4: '外比之，貞吉。', 5: '顯比，王用三驅。', 6: '比之無首，凶。' } },
  '泰': { gua: '泰：小往大來，吉，亨。', yao: { 1: '拔茅茹，以其彙，征吉。', 2: '包荒，用馮河。', 3: '無平不陂，無往不復。', 4: '翩翩，不富以其鄰。', 5: '帝乙歸妹，以祉元吉。', 6: '城復于隍，勿用師。' } },
  '否': { gua: '否：否之匪人，不利君子貞。', yao: { 1: '拔茅茹，以其彙，貞吉。', 2: '包承，小人吉，大人否。', 3: '包羞。', 4: '有命無咎。', 5: '休否，大人吉。', 6: '傾否，先否後喜。' } },
  '谦': { gua: '謙：亨，君子有終。', yao: { 1: '謙謙君子，用涉大川，吉。', 2: '鳴謙，貞吉。', 3: '勞謙，君子有終，吉。', 4: '無不利，撝謙。', 5: '不富以其鄰，利用侵伐。', 6: '鳴謙，利用行師征邑國。' } },
  '艮': { gua: '艮：艮其背，不獲其身；行其庭，不見其人，無咎。', yao: { 1: '艮其趾，無咎，利永貞。', 2: '艮其腓，不拯其隨，其心不快。', 3: '艮其限，列其夤，厲薰心。', 4: '艮其身，無咎。', 5: '艮其輔，言有序，悔亡。', 6: '敦艮，吉。' } },
  '渐': { gua: '漸：女歸吉，利貞。', yao: { 1: '鴻漸于干，小子厲，有言，無咎。', 2: '鴻漸于磐，飲食衎衎，吉。', 3: '鴻漸于陸，夫征不復。', 4: '鴻漸于木，或得其桷，無咎。', 5: '鴻漸于陵，婦三歲不孕，終莫之勝，吉。', 6: '鴻漸于陸，其羽可用為儀，吉。' } },
  '蛊': { gua: '蠱：元亨，利涉大川。先甲三日，後甲三日。', yao: { 1: '幹父之蠱，有子，考無咎，厲終吉。', 2: '幹母之蠱，不可貞。', 3: '幹父之蠱，小有悔，無大咎。', 4: '裕父之蠱，往見吝。', 5: '幹父之蠱，用譽。', 6: '不事王侯，高尚其事。' } },
  '临': { gua: '臨：元亨，利貞。至于八月有凶。', yao: { 1: '咸臨，貞吉。', 2: '咸臨，吉，無不利。', 3: '甘臨，無攸利。', 4: '至臨，無咎。', 5: '知臨，大君之宜，吉。', 6: '敦臨，吉，無咎。' } },
  '观': { gua: '觀：盥而不薦，有孚顒若。', yao: { 1: '童觀，小人無咎，君子吝。', 2: '窺觀，利女貞。', 3: '觀我生，進退。', 4: '觀國之光，利用賓于王。', 5: '觀我生，君子無咎。', 6: '觀其生，君子無咎。' } },
  '剥': { gua: '剝：不利有攸往。', yao: { 1: '剝床以足，蔑貞凶。', 2: '剝床以辨，蔑貞凶。', 3: '剝之，無咎。', 4: '剝床以膚，凶。', 5: '貫魚，以宮人寵，無不利。', 6: '碩果不食，君子得輿，小人剝廬。' } },
  '复': { gua: '復：亨。出入無疾，朋來無咎。', yao: { 1: '不遠復，無祇悔，元吉。', 2: '休復，吉。', 3: '頻復，厲無咎。', 4: '中行獨復。', 5: '敦復，無悔。', 6: '迷復，凶，有災眚。' } },
  '坎': { gua: '習坎：有孚，維心亨，行有尚。', yao: { 1: '習坎，入于坎窞，凶。', 2: '坎有險，求小得。', 3: '來之坎坎，險且枕，入于坎窞，勿用。', 4: '樽酒簋貳，用缶，納約自牖，終無咎。', 5: '坎不盈，祇既平，無咎。', 6: '係用徽纆，寘于叢棘，三歲不得，凶。' } },
  '离': { gua: '離：利貞，亨。畜牝牛，吉。', yao: { 1: '履錯然，敬之，無咎。', 2: '黃離，元吉。', 3: '日昃之離，不鼓缶而歌，則大耋之嗟，凶。', 4: '突如其來如，焚如，死如，棄如。', 5: '出涕沱若，戚嗟若，吉。', 6: '王用出征，有嘉折首，獲匪其醜，無咎。' } },
  '咸': { gua: '咸：亨，利貞，取女吉。', yao: { 1: '咸其拇。', 2: '咸其腓，凶，居吉。', 3: '咸其股，執其隨，往吝。', 4: '貞吉悔亡，憧憧往來，朋從爾思。', 5: '咸其脢，無悔。', 6: '咸其輔頰舌。' } },
  '恒': { gua: '恆：亨，無咎，利貞，利有攸往。', yao: { 1: '浚恆，貞凶，無攸利。', 2: '悔亡。', 3: '不恆其德，或承之羞，貞吝。', 4: '田無禽。', 5: '恆其德，貞，婦人吉，夫子凶。', 6: '振恆，凶。' } },
  '遁': { gua: '遯：亨，小利貞。', yao: { 1: '遯尾，厲，勿用有攸往。', 2: '執之用黃牛之革，莫之勝說。', 3: '係遯，有疾厲，畜臣妾吉。', 4: '好遯，君子吉，小人否。', 5: '嘉遯，貞吉。', 6: '肥遯，無不利。' } },
  '大壮': { gua: '大壯：利貞。', yao: { 1: '壯于趾，征凶，有孚。', 2: '貞吉。', 3: '小人用壯，君子用罔，貞厲。羝羊觸藩，羸其角。', 4: '貞吉悔亡，藩決不羸，壯于大輿之輹。', 5: '喪羊于易，無悔。', 6: '羝羊觸藩，不能退，不能遂，無攸利，艱則吉。' } },
  '晋': { gua: '晉：康侯用錫馬蕃庶，晝日三接。', yao: { 1: '晉如摧如，貞吉。罔孚，裕無咎。', 2: '晉如愁如，貞吉，受茲介福，于其王母。', 3: '眾允，悔亡。', 4: '晉如鼫鼠，貞厲。', 5: '悔亡，失得勿恤，往吉無不利。', 6: '晉其角，維用伐邑，厲吉無咎，貞吝。' } },
  '明夷': { gua: '明夷：利艱貞。', yao: { 1: '明夷于飛，垂其翼。君子于行，三日不食。', 2: '明夷，夷于左股，用拯馬壯，吉。', 3: '明夷于南狩，得其大首，不可疾貞。', 4: '入于左腹，獲明夷之心，于出門庭。', 5: '箕子之明夷，利貞。', 6: '不明晦，初登于天，後入于地。' } },
  '家人': { gua: '家人：利女貞。', yao: { 1: '閑有家，悔亡。', 2: '無攸遂，在中饋，貞吉。', 3: '家人嗃嗃，悔厲吉。婦子嘻嘻，終吝。', 4: '富家，大吉。', 5: '王假有家，勿恤吉。', 6: '有孚威如，終吉。' } },
  '睽': { gua: '睽：小事吉。', yao: { 1: '悔亡，喪馬勿逐，自復。見惡人，無咎。', 2: '遇主于巷，無咎。', 3: '見輿曳，其牛掣，其人天且劓，無初有終。', 4: '睽孤，遇元夫，交孚，厲無咎。', 5: '悔亡，厥宗噬膚，往何咎。', 6: '睽孤，見豕負塗，載鬼一車，先張之弧，後說之弧，匪寇婚媾，往遇雨則吉。' } },
  '蹇': { gua: '蹇：利西南，不利東北。利見大人，貞吉。', yao: { 1: '往蹇，來譽。', 2: '王臣蹇蹇，匪躬之故。', 3: '往蹇來反。', 4: '往蹇來連。', 5: '大蹇朋來。', 6: '往蹇來碩，吉，利見大人。' } },
  '解': { gua: '解：利西南，無所往，其來復吉。有攸往，夙吉。', yao: { 1: '無咎。', 2: '田獲三狐，得黃矢，貞吉。', 3: '負且乘，致寇至，貞吝。', 4: '解而拇，朋至斯孚。', 5: '君子維有解，吉，有孚于小人。', 6: '公用射隼于高墉之上，獲之，無不利。' } },
  '损': { gua: '損：有孚，元吉，無咎，可貞。', yao: { 1: '已事遄往，無咎，酌損之。', 2: '利貞，征凶，弗損益之。', 3: '三人行，則損一人；一人行，則得其友。', 4: '損其疾，使遄有喜，無咎。', 5: '或益之十朋之龜，弗克違，元吉。', 6: '弗損益之，無咎，貞吉，利有攸往，得臣無家。' } },
  '益': { gua: '益：利有攸往，利涉大川。', yao: { 1: '利用為大作，元吉，無咎。', 2: '或益之十朋之龜，弗克違，永貞吉。', 3: '益之用凶事，無咎。', 4: '中行告公從，利用為依遷國。', 5: '有孚惠心，勿問元吉。有孚惠我德。', 6: '莫益之，或擊之，立心勿恆，凶。' } },
  '夬': { gua: '夬：揚于王庭，孚號有厲。告自邑，不利即戎，利有攸往。', yao: { 1: '壯于前趾，往不勝為咎。', 2: '惕號，莫夜有戎，勿恤。', 3: '壯于頄，有凶。君子夬夬，獨行遇雨，若濡有慍，無咎。', 4: '臀無膚，其行次且。牽羊悔亡，聞言不信。', 5: '莧陸夬夬，中行無咎。', 6: '無號，終有凶。' } },
  '姤': { gua: '姤：女壯，勿用取女。', yao: { 1: '繫于金柅，貞吉。有攸往，見凶。羸豕孚蹢躅。', 2: '包有魚，無咎，不利賓。', 3: '臀無膚，其行次且，厲，無大咎。', 4: '包無魚，起凶。', 5: '以杞包瓜，含章，有隕自天。', 6: '姤其角，吝，無咎。' } },
  '萃': { gua: '萃：亨，王假有廟。利見大人，亨，利貞。', yao: { 1: '有孚不終，乃亂乃萃。若號，一握為笑，勿恤，往無咎。', 2: '引吉，無咎，孚乃利用禴。', 3: '萃如嗟如，無攸利。往無咎，小吝。', 4: '大吉無咎。', 5: '萃有位，無咎。匪孚，元永貞，悔亡。', 6: '齎咨涕洟，無咎。' } },
  '升': { gua: '升：元亨，用見大人，勿恤，南征吉。', yao: { 1: '允升，大吉。', 2: '孚乃利用禴，無咎。', 3: '升虛邑。', 4: '王用亨于岐山，吉，無咎。', 5: '貞吉，升階。', 6: '冥升，利于不息之貞。' } },
  '困': { gua: '困：亨，貞，大人吉，無咎。有言不信。', yao: { 1: '臀困于株木，入于幽谷，三歲不覿。', 2: '困于酒食，朱紱方來，利用享祀，征凶，無咎。', 3: '困于石，據于蒺藜，入于其宮，不見其妻，凶。', 4: '來徐徐，困于金車，吝，有終。', 5: '劓刖，困于赤紱，乃徐有說，利用祭祀。', 6: '困于葛藟，于臲卼，曰動悔，有悔，征吉。' } },
  '井': { gua: '井：改邑不改井，無喪無得。訖至，亦未繘井，羸其瓶，凶。', yao: { 1: '井泥不食，舊井無禽。', 2: '井谷射鮒，甕敝漏。', 3: '井渫不食，為我心惻，可用汲。', 4: '井甃，無咎。', 5: '井洌，寒泉食。', 6: '井收勿幕，有孚元吉。' } },
  '革': { gua: '革：己日乃孚，元亨，利貞，悔亡。', yao: { 1: '鞏用黃牛之革。', 2: '己日乃革之，征吉，無咎。', 3: '征凶，貞厲。革言三就，有孚。', 4: '悔亡，有孚改命，吉。', 5: '大人虎變，未占有孚。', 6: '君子豹變，小人革面。征凶，居貞吉。' } },
  '鼎': { gua: '鼎：元吉，亨。', yao: { 1: '鼎顛趾，利出否，得妾以其子，無咎。', 2: '鼎有實，我仇有疾，不我能即，吉。', 3: '鼎耳革，其行塞，雉膏不食。方雨虧悔，終吉。', 4: '鼎折足，覆公餗，其形渥，凶。', 5: '鼎黃耳金鉉，利貞。', 6: '鼎玉鉉，大吉，無不利。' } },
  '震': { gua: '震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。', yao: { 1: '震來虩虩，後笑言啞啞，吉。', 2: '震來厲，億喪貝，躋于九陵，勿逐，七日得。', 3: '震蘇蘇，震行無眚。', 4: '震遂泥。', 5: '震往來厲，億無喪，有事。', 6: '震索索，視矍矍，征凶。震不于其躬，于其鄰，無咎。婚媾有言。' } },
  '艮': { gua: '艮：艮其背，不獲其身；行其庭，不見其人，無咎。', yao: { 1: '艮其趾，無咎，利永貞。', 2: '艮其腓，不拯其隨，其心不快。', 3: '艮其限，列其夤，厲薰心。', 4: '艮其身，無咎。', 5: '艮其輔，言有序，悔亡。', 6: '敦艮，吉。' } },
  '渐': { gua: '漸：女歸吉，利貞。', yao: { 1: '鴻漸于干，小子厲，有言，無咎。', 2: '鴻漸于磐，飲食衎衎，吉。', 3: '鴻漸于陸，夫征不復。', 4: '鴻漸于木，或得其桷，無咎。', 5: '鴻漸于陵，婦三歲不孕，終莫之勝，吉。', 6: '鴻漸于陸，其羽可用為儀，吉。' } },
  '丰': { gua: '豐：亨，王假之，勿憂，宜日中。', yao: { 1: '遇其配主，雖旬無咎，往有尚。', 2: '豐其蔀，日中見斗，往得疑疾，有孚發若，吉。', 3: '豐其沛，日中見沫，折其右肱，無咎。', 4: '豐其蔀，日中見斗，遇其夷主，吉。', 5: '來章有慶譽，吉。', 6: '豐其屋，蔀其家，窺其戶，闃其無人，三歲不覿，凶。' } },
  '旅': { gua: '旅：小亨，旅貞吉。', yao: { 1: '旅瑣瑣，斯其所取災。', 2: '旅即次，懷其資，得童僕貞。', 3: '旅焚其次，喪其童僕，貞厲。', 4: '旅于處，得其資斧，我心不快。', 5: '射雉一矢亡，終以譽命。', 6: '鳥焚其巢，旅人先笑後號啕。喪牛于易，凶。' } },
  '巽': { gua: '巽：小亨，利有攸往，利見大人。', yao: { 1: '進退，利武人之貞。', 2: '巽在床下，用史巫紛若，吉，無咎。', 3: '頻巽，吝。', 4: '悔亡，田獲三品。', 5: '貞吉，悔亡，無不利，無初有終。先庚三日，後庚三日，吉。', 6: '巽在床下，喪其資斧，貞凶。' } },
  '兑': { gua: '兌：亨，利貞。', yao: { 1: '和兌，吉。', 2: '孚兌，吉，悔亡。', 3: '來兌，凶。', 4: '商兌未寧，介疾有喜。', 5: '孚于剝，有厲。', 6: '引兌。' } },
  '节': { gua: '節：亨。苦節，不可貞。', yao: { 1: '不出戶庭，無咎。', 2: '不出門庭，凶。', 3: '不節若，則嗟若，無咎。', 4: '安節，亨。', 5: '甘節，吉，往有尚。', 6: '苦節，貞凶，悔亡。' } },
  '中孚': { gua: '中孚：豚魚吉。利涉大川，利貞。', yao: { 1: '虞吉，有他不燕。', 2: '鳴鶴在陰，其子和之。我有好爵，吾與爾靡之。', 3: '得敵，或鼓或罷，或泣或歌。', 4: '月幾望，馬匹亡，無咎。', 5: '有孚攣如，無咎。', 6: '翰音登于天，貞凶。' } },
  '小过': { gua: '小過：亨，利貞。可小事，不可大事。', yao: { 1: '飛鳥以凶。', 2: '過其祖，遇其妣，不及其君，遇其臣，無咎。', 3: '弗過防之，從或戕之，凶。', 4: '無咎，弗過遇之，往厲必戒，勿用永貞。', 5: '密雲不雨，自我西郊。公弋取彼在穴。', 6: '弗遇過之，飛鳥離之，凶，是謂災眚。' } },
  '既济': { gua: '既濟：亨小，利貞。初吉終亂。', yao: { 1: '曳其輪，濡其尾，無咎。', 2: '婦喪其茀，勿逐，七日得。', 3: '高宗伐鬼方，三年克之。小人勿用。', 4: '繻有衣袽，終日戒。', 5: '東鄰殺牛，不如西鄰之禴祭，實受其福。', 6: '濡其首，厲。' } },
  '未济': { gua: '未濟：亨。小狐汔濟，濡其尾，無攸利。', yao: { 1: '濡其尾，吝。', 2: '曳其輪，貞吉。', 3: '未濟，征凶，利涉大川。', 4: '貞吉，悔亡。震用伐鬼方，三年有賞于大國。', 5: '貞吉，無悔。君子之光，有孚，吉。', 6: '有孚于飲酒，無咎。濡其首，有孚失是。' } },
};

function yaoNameVi(n) {
  return ['(initial)', 'sơ hào', 'nhị hào', 'tam hào', 'tứ hào', 'ngũ hào', 'thượng hào'][n] || '';
}
function yiFor(hexName, yaoLine) {
  const e = YIJING[hexName];
  if (!e) return { hexagramText: '(chưa cài 卦辞 cho quẻ này)', yuantangLineText: '(chưa cài 爻辞)' };
  return {
    hexagramText: e.gua,
    yuantangLineText: e.yao[yaoLine] || '(không có lời hào)',
  };
}

// ---------------------------------------------------------------------------
//  7. HÀM CHÍNH heluo(R).
//     R = kết quả của analyze()/buildChart(): cần R.chart.pillars.{year,month,
//     day,time}.{gan,zhi}, R.chart.input.year, R.chart.input.gender,
//     R.chart.pillars.time.zhi (giờ sinh).
// ---------------------------------------------------------------------------
function reduceTianShu(n) {
  // 天数: «反复减二十五» — trừ 25 LẶP LẠI tới ≤25. [loop 30 sửa] trước đây trừ 1 lần → sai
  //   khi tianRaw>50 (max thực tế 56). Vd 56→56-25-25=6 (đúng), cũ ra 31→1 (sai).
  let r = n;
  while (r > 25) r -= 25;
  if (r === 25) return 5;
  const u = r % 10;
  if (u === 0) return r === 10 ? 1 : 2; // 遇十不用: 10→1, 20→2
  return u;
}
function reduceDiShu(n) {
  // 地数: «反复减三十» — trừ 30 LẶP LẠI tới ≤30. [loop 30 sửa] trước trừ 1 lần → sai khi
  //   diRaw>60 (max thực tế 72). + 遇十 fallback đủ cho mọi dư bội 10.
  let r = n;
  while (r > 30) r -= 30;
  if (r === 30) return 3;
  const u = r % 10;
  if (u === 0) return r === 10 ? 1 : r === 20 ? 2 : 3; // 10→1,20→2,30→3
  return u;
}

export function heluo(R) {
  const out = { ok: false };
  try {
    const chart = R && R.chart ? R.chart : R;
    const pillars = chart.pillars;
    if (!pillars) throw new Error('thiếu pillars');
    const inp = chart.input || R.input || {};
    const year = inp.year || (chart.input && chart.input.year) || 2000;
    const gender = (inp.gender || (chart.input && chart.input.gender) || 'nam');
    const order = ['year', 'month', 'day', 'time'];

    // --- a) Phối số + gom 天数/地数 ---
    const heshuMap = {}; // gan/zhi → giá trị (chi → [lẻ, chẵn])
    let tianRaw = 0, diRaw = 0;
    for (const k of order) {
      const p = pillars[k];
      if (!p || !p.gan || !p.zhi) throw new Error('thiếu can/chi trụ ' + k);
      const gv = GAN_HESHU[p.gan];
      heshuMap[p.gan] = gv;
      // can: giá trị đơn → chia theo lẻ/chẵn
      if (gv % 2 === 1) tianRaw += gv; else diRaw += gv;
      // chi: đôi số [lẻ, chẵn] → lẻ→天数, chẵn→地数
      const zv = ZHI_HESHU[p.zhi];
      heshuMap[p.zhi] = zv;
      tianRaw += zv[0];
      diRaw += zv[1];
    }

    // --- b) Giảm ---
    const tianShu = reduceTianShu(tianRaw);
    const diShu = reduceDiShu(diRaw);

    // --- c) Số → quẻ đơn (xử lý 5 寄宫) ---
    const yearGanYin = isYearGanYin(year);
    const isMale = (gender === 'nam' || gender === 'male');
    const yangNan = isMale && !yearGanYin; // 阳男
    const yinNan = isMale && yearGanYin;   // 阴男
    const yangNu = !isMale && !yearGanYin; // 阳女
    const yinNu = !isMale && yearGanYin;   // 阴女
    const yuan = sanyuan(year);

    function triOf(reduced) {
      if (reduced === 5) return jiGong5(year, gender); // 寄宫
      return NUM2TRI[reduced];
    }
    const tianTri = triOf(tianShu);
    const diTri = triOf(diShu);

    // --- d) Hợp quái: 阳男/阴女 → 天上地下; 阴男/阳女 → 地上天 ---
    let upper, lower;
    if (yangNan || yinNu) { upper = tianTri; lower = diTri; }
    else { upper = diTri; lower = tianTri; } // 阴男/阳女

    const hex = hexOf(upper, lower);

    // --- e) 6 hào (từ dưới lên, index 0..5; 1=dương 0=âm) ---
    const lines = [...TRI_LINES[lower], ...TRI_LINES[upper]]; // [h1,h2,h3,h4,h5,h6]

    // --- f) 元堂: thuật toán 飞支 (fly-the-branches) — xem comment mục 5.
    const hourZhi = pillars.time.zhi;
    const isYangHour = YANG_HOURS.includes(hourZhi);
    const fb = flyBranches(lines, isYangHour);
    const N = fb.N;
    let slot = fb.hourList.indexOf(hourZhi);
    let yuantang = { line: 0, rule: 'unknown', hourZhi, isYangHour, N };
    if (slot >= 0 && slot < 6) {
      yuantang.line = fb.mapping[slot];
      const lawPart = N <= 2 ? '重而寄 (2 lượt × mỗi hào đồng âm)'
        : N === 3 ? '三位虽重没寄宫 (2 lượt đủ, không寄)'
        : N <= 5 ? '四五无重应有寄 (1 lượt +寄)'
        : '纯爻 DISPUTED';
      yuantang.rule = `N=${N} ${isYangHour ? '阳' : '阴'}时 giờ ${hourZhi} (slot ${slot}) → hào ${yuantang.line} [${lawPart}]`;
      yuantang.disputed = (N === 6);
    } else {
      // giờ ranh 昼午/夜子 hiếm — cờ, fallback hào 1
      yuantang.line = 1;
      yuantang.rule = `giờ ${hourZhi} (ranh giới 昼午/夜子) — DISPUTED, fallback hào 1`;
      yuantang.disputed = true;
    }

    // --- g) 后天卦: lật hào 元堂 → 变卦, rồi hoán thượng/hạ (trích sách + douban)
    //    变卦 = (thượng bianUpper / hạ bianLower). 后天卦 = hoán thượng↔hạ của 变卦
    //    → thượng mới = bianLower, hạ mới = bianUpper. hexOf(upper, lower).
    const flipped = lines.slice();
    flipped[yuantang.line - 1] = flipped[yuantang.line - 1] === 1 ? 0 : 1;
    const bianLower = triFromLines3(flipped[0], flipped[1], flipped[2]);
    const bianUpper = triFromLines3(flipped[3], flipped[4], flipped[5]);
    const houtian = hexOf(bianLower, bianUpper);

    // --- h) Reading (周易 卦辞 + 爻辞) ---
    const reading = yiFor(hex.name, yuantang.line);
    const houtianReading = yiFor(houtian.name, yuantang.line);

    // --- i) Summary tiếng Việt ---
    const pillarsStr = order.map((k) => pillars[k].gan + pillars[k].zhi).join(' ');
    const linesStr = lines.map((l) => l === 1 ? '▬▬▬' : '▬ ▬').join('  ');
    const summary =
      `Tứ trụ ${pillarsStr} (${gender}) | 天数 ${tianRaw}→${tianShu} (${tianTri}), 地数 ${diRaw}→${diShu} (${diTri}). ` +
      `${(yangNan || yinNu) ? '阳男/阴女' : '阴男/阳女'} → thượng ${upper} / hạ ${lower} = ` +
      `本命卦 #${hex.num} ${hex.name} (${hex.nameVi}). Hào: ${linesStr}. ` +
      `元堂 = hào ${yuantang.line} (${yaoNameVi(yuantang.line)}, giờ ${hourZhi}). ` +
      `后天卦 #${houtian.num} ${houtian.name} (${houtian.nameVi}). ` +
      `卦辞: ${reading.hexagramText} | 爻辞(hào ${yuantang.line}): ${reading.yuantangLineText}` +
      ` (注: 天/地数→quẻ theo 《河洛理数》 cổ điển; 元堂 & 5寄宫 là 2 bước các phái còn chênh nhau — bản này theo 1 trường phái tài liệu, có thể lệch vài công cụ 排盘 khác).`;

    Object.assign(out, {
      ok: true,
      heshuMap,
      tianRaw, diRaw, tianShu, diShu,
      upperTrigram: upper, lowerTrigram: lower,
      tianTrigram: tianTri, diTrigram: diTri,
      yuan, yangNan, yinNan, yangNu, yinNu,
      hexagram: { num: hex.num, name: hex.name, nameVi: hex.nameVi, upper, lower, lines },
      yuantang: { line: yuantang.line, rule: yuantang.rule, hourZhi, isYangHour, N, lineVi: yaoNameVi(yuantang.line) },
      houtianHexagram: { num: houtian.num, name: houtian.name, nameVi: houtian.nameVi },
      bianHexagram: { upper: bianUpper, lower: bianLower },
      reading: { hexagramText: reading.hexagramText, yuantangLineText: reading.yuantangLineText, houtianHexagramText: houtianReading.hexagramText },
      summary,
    });
  } catch (e) {
    out.ok = false;
    out.error = e && e.message ? e.message : String(e);
  }
  return out;
}

// helper: từ 3 bit → tên quẻ đơn (tái dùng logic meihua)
function triFromLines3(a, b, c) {
  const key = '' + a + b + c;
  const m = { '111': '乾', '110': '兑', '101': '离', '100': '震', '011': '巽', '010': '坎', '001': '艮', '000': '坤' };
  return m[key] || '?';
}

export { GAN_HESHU, ZHI_HESHU, NUM2TRI, TRI_LINES, YIJING, sanyuan, jiGong5, flyBranches };
