// Generate template-based logic for kinh WITHOUT logic_thesis
// Uses category detection + template reasoning chains
import { DAOZANG } from '../src/engine/daozang-data.js';
import { readFileSync, writeFileSync } from 'node:fs';

const TEMPLATES = {
  exorcism: { thesis: 'Tà khí xâm nhập qua hư/loạn tâm — chế ngự bằng chính khí + chú ngữ/phù ấn cộng hưởng tần số tâm thức.', chain: 'Tiền đề: tà nhập qua tâm hư → tâm chính thì tà không nhập → cần công cụ (chú/phù/ấn) tập trung tâm → trì chú + chính tâm = chế ngự tà.', practice: '1) Tịnh tâm xả niệm 2) Niệm chú bảo vệ 3) Quán tưởng chính khí 4) Hành động trong tâm chính 5) Hồi hướng công đức.', compare: 'Logic trừ tà chia hệ cương (sát quỷ) vs nhu (độ thoát) — text này thuộc hệ nào tùy nội dung.' },
  cultivation: { thesis: 'Tu luyện = luyện tinh → khí → thần → hư — chuyển hóa năng lượng từ thô sang tinh qua chu trình có hệ thống.', chain: 'Tiền đề: tinh-khí-thần là 3 tầng → chuyển hóa cần phương pháp + thời điểm → phải biết hỏa hầu → tu đúng = thuận tự nhiên, sai = tẩu hỏa.', practice: '1) Trì giới tịnh tâm 2) Luyện tinh hóa khí 3) Luyện khí hóa thần 4) Luyện thần hoàn hư 5) Ôm nuôi đúng thời.', compare: 'Nam tông (trước mệnh) vs Bắc tông (trước tính) — text này thiên hệ nào tùy giáo lý.' },
  fengshui: { thesis: 'Địa lý ảnh hưởng vận mệnh qua khí trường — sơn thủy tụ tán quyết định cát hung.', chain: 'Tiền đề: địa mạch mang khí → cư trú trên mạch tốt = nhận khí tốt → phải biết long-huyết-sa-thủy → chọn đất = chọn khí trường.', practice: '1) Xem long 2) Xem huyệt 3) Xem sa 4) Xem thủy 5) Định hướng theo Dụng Thần.', compare: 'Hình phái (nhìn hình) vs Lý khí (tính phi tinh) — text thuộc hệ nào tùy phương pháp.' },
  destiny: { thesis: 'Mệnh cố định bởi tứ trụ — nhưng VẬN là biến số có thể tận dụng hoặc hóa giải.', chain: 'Tiền đề: tứ trụ = năng lượng lúc sinh → ngũ hành thiên lệch = thiên hướng → biết Dụng/Kỵ → thuận Dụng = cát, nghịch = hung.', practice: '1) Định Dụng Thần 2) Xem đại vận 3) Xem lưu niên 4) Hành động thuận Dụng 5) Hóa giải Kỵ.', compare: 'Cổ pháp (năm làm chủ) vs Tử bình (ngày làm chủ) — text thuộc hệ nào tùy thời đại.' },
  ritual: { thesis: 'Nghi thức = khuôn mẫu giao tiếp trời-đất-người — đúng lễ thì cảm thông.', chain: 'Tiền đề: tam tài thông nhau → lễ đúng = thông đạo → cần诚意正心 → nghi lễ là phương tiện giao tiếp.', practice: '1) Tịnh giới 2) Thiết đàn 3) Thượng hương 4) Tụng咒 5) Hồi hướng.', compare: '正一 (phù) vs 全真 (tu luyện) — hệ nghi lễ khác nhau.' },
  talisman: { thesis: 'Phù/chú = mã hóa năng lượng vào hình/âm — người có công lực kích hoạt thì hiệu lực.', chain: 'Tiền đề: vũ trụ vận hành bằng khí → phù/chú = ngôn ngữ điều khiển khí → cần sư truyền + nội luyện → phù vô công lực = giấy.', practice: '1) Tịnh tâm 2) Khởi thủ 3) Vẽ/trì phù 4) Niệm chú kích hoạt 5) Sử dụng đúng mục đích.', compare: 'Phù (hình) vs Chú (âm) — cùng gốc khác đường.' },
  commentary: { thesis: 'Chú giải = mở khóa ý nghĩa cổ kinh — truyền đạt CÁCH ĐỌC, không chỉ NỘI DUNG.', chain: 'Tiền đề: cổ kinh hàm súc → cần chú giải → người chú phải có thực chứng → chú đúng = sáng kinh, sai = méo.', practice: '1) Đọc nguyên văn 2) Đối chiếu chú 3) Phân tích luận lý 4) Áp dụng thực tiễn 5) So sánh bản chú.', compare: 'Đường chú (hình tượng) vs Tống chú (lý học) vs Thanh chú (khảo chứng).' },
  hagiography: { thesis: 'Tiểu sử tiên = mô hình thực chứng — bản đồ tu chứng, không phải thần thoại.', chain: 'Tiền đề: tiên nhân chứng đạo → con đường họ = phương pháp khả thi → cần hiểu bối cảnh → học theo mô hình.', practice: '1) Đọc tiểu sử 2) Rút phương pháp 3) Hiểu bối cảnh 4) Áp dụng nay 5) Không thần thánh hóa.', compare: 'Chính sử (khảo chứng) vs Chí quái (truyền thuyết).' },
  general: { thesis: 'Văn hiến bảo tồn tri thức cổ truyền — giá trị truyền đạt kinh nghiệm thế hệ.', chain: 'Tiền đề: cổ nhân tích lũy → ghi chép = truyền → cần đúng ngữ cảnh → áp dụng cần chuyển hóa.', practice: '1) Hiểu bối cảnh 2) Rút nguyên lý 3) Chuyển hóa 4) Áp dụng 5) So sánh nguồn.', compare: 'Mỗi văn hiến có lập trường riêng — cần đối chiếu đa nguồn.' },
};

function detectCat(text) {
  if (/驱邪|伏魔|鬼|治瘟|杀鬼|trừ tà|exorcism/i.test(text)) return 'exorcism';
  if (/内丹|修真|悟真|金丹|tu luyện|nội đan|cultivat/i.test(text)) return 'cultivation';
  if (/风水|堪舆|宅|phong thủy|fengshui/i.test(text)) return 'fengshui';
  if (/命理|子平|斗数|bát tự|mệnh|destiny|BaZi/i.test(text)) return 'destiny';
  if (/科仪|斋醮|nghi thức|ritual/i.test(text)) return 'ritual';
  if (/符|咒|thần chú|phù|talisman/i.test(text)) return 'talisman';
  if (/注|疏|解|chú giải|commentary/i.test(text)) return 'commentary';
  if (/仙传|传|thuật truyện|hagiography/i.test(text)) return 'hagiography';
  return 'general';
}

const DEEP_FILE = 'src/engine/daozang-deep.js';
let deepSrc = readFileSync(DEEP_FILE, 'utf8');
const missing = DAOZANG.filter(e => !e.logic_thesis);
let added = 0;

for (const e of missing) {
  const key = e.name_han.replace(/['\\]/g, '').replace(/（.*）/, '').slice(0, 20);
  const cat = detectCat((e.meaning || '') + ' ' + (e.deep_essence || '') + ' ' + (e.school || ''));
  const t = TEMPLATES[cat] || TEMPLATES.general;
  const esc = (s) => s.replace(/'/g, "\\'");
  const keyPattern = `'${key}': {`;
  const keyPos = deepSrc.indexOf(keyPattern);
  if (keyPos > 0) {
    const entryEnd = deepSrc.indexOf('},', keyPos);
    if (entryEnd > 0 && !deepSrc.slice(keyPos, entryEnd).includes('logic_thesis')) {
      const add = `, logic_thesis: '${esc(t.thesis)}', logic_chain: '${esc(t.chain)}', logic_practice: '${esc(t.practice)}', logic_compare: '${esc(t.compare)}'`;
      deepSrc = deepSrc.slice(0, entryEnd) + add + deepSrc.slice(entryEnd);
      added++;
    }
  } else {
    const entry = `  '${key}': { logic_thesis: '${esc(t.thesis)}', logic_chain: '${esc(t.chain)}', logic_practice: '${esc(t.practice)}', logic_compare: '${esc(t.compare)}' },\n`;
    const insertPos = deepSrc.indexOf('\n};', deepSrc.indexOf('DAOZANG_DEEP'));
    if (insertPos > 0) { deepSrc = deepSrc.slice(0, insertPos) + '\n' + entry + deepSrc.slice(insertPos); added++; }
  }
}

writeFileSync(DEEP_FILE, deepSrc, 'utf8');
console.log(`Template logic added: ${added} (for ${missing.length} missing kinh)`);
