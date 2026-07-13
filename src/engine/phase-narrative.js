// ============================================================================
//  TƯỜNG THUẬT GIAI ĐOẠN (life-phase narrative) — may xuyên 大运→流年→流月
//  "Câu chuyện xuôi dòng về giai đoạn đời hiện tại" — khác data-card: dệt PROSE.
//  Khách đọc 1 luot từ «đang ở đâu trong đời» → «năm nay sao» → «tháng này làm gì».
//  Nguồn: 大运 (trường sinh stage + nạp âm + rating) + 流年 + 流月 + 总论 + 源流.
// ============================================================================
import { Solar } from 'lunar-javascript';
import { WX_VI, TEN_GOD_VI } from './constants.js';
import { tenGod } from './core.js';
import { dayunChangSheng } from './dayun-changsheng.js';
import { ganZhiNayin, nayinInfo } from './nayin.js';

const GOD_VI = TEN_GOD_VI;

// tone → prose motif (đại vận / lưu niên / lưu nguyệt dùng chung)
const TONE_MOTIF = {
  cat: { v: 'thuận lợi — trời cho cơ hội, nên nắm lấy', action: 'tiến thủ, mở rộng, đầu tư lâu dài, quyết định lớn' },
  binh: { v: 'trung bình — không bật cũng không xấu', action: 'giữ nhịp, củng cố nền, tránh mạo hiểm' },
  hung: { v: 'khó khăn — cần cẩn trọng, giảm tốc', action: 'thủ giữ, phòng ngừa, đợi qua vận, đừng quyết định lớn' },
};
const toneOf = (rating) => {
  if (!rating) return 'binh';
  if (/Đại cát|Cát|Đại hợp|大吉|Hợp/.test(rating)) return 'cat';
  if (/Đại hung|Đại khắc|Hung|Kỵ|Không hợp/.test(rating)) return 'hung';
  return 'binh';
};

// Thập thần vận → chủ đề thập kỷ (cổ pháp 子平: sao chủ vận định mảng thịnh)
const GOD_THEME = {
  '正印': 'học vấn · danh vọng · được bảo trợ (Ấn vận — thời khổ luyện, thi cử, xây danh)',
  '偏印': 'tâm linh · chuyên môn · lý luận thiên tài (Thiên Ấn — độc đáo, dễ cô đơn)',
  '比肩': 'tự lập · hợp tác đồng trang · cạnh tranh (Tỷ — mở rộng quy mô, đồng minh)',
  '劫財': 'đầu tư · mạo hiểm · tranh giành (Kiếp — cơ hội nhưng rủi ro đào tài)',
  '食神': 'sáng tạo · nghệ thuật · khẩu phúc · an nhàn (Thực — phúc khí, sinh sôi)',
  '傷官': 'biểu đạt · phản trào · đổi mới · đào hoa (Thương — tài năng bộc lộ, khẩu thiệt)',
  '偏財': 'tài lớn · kinh doanh · đầu cơ · duyên ngoài (Thiên Tài — phú hoặc phá sản)',
  '正財': 'tài chính ổn · lương · vợ/người yêu · tích luỹ (Chính Tài — no ấm bền)',
  '七殺': 'quyền uy · áp lực · đột phá · thăng/giáng (Thất Sát — biến động lớn, lập nghiệp gian nan nhưng oai)',
  '正官': 'danh vị · chức tước · khuôn khổ · nam nhân duyên (Chính Quan — thăng tiến稳定, danh chính ngôn thuận)',
};

/**
 * @returns {{ title, paragraphs[], phase:{age, dayun, liunian, liuyue} }}
 */
export function phaseNarrative(R, refYear) {
  const cur = refYear || new Date().getFullYear();
  const birthYear = R.chart?.input?.year || 0;
  const age = cur - birthYear;
  const dayGan = R.chart?.dayGan;
  const paras = [];
  const phase = { age, dayun: null, liunian: null, liuyue: null };

  // --- ĐẠI VẬN (nền thập kỷ) ---
  const dy = (R.dayun || []).find((d) => age + 1 >= d.startAge && age + 1 < d.startAge + 10); // [AUDIT FIX HIGH] +1 xusui
  phase.dayun = dy;
  if (!dy) {
    // [loop 477] phân loại message: tuổi nhỏ chưa mở vận / tuổi già qua vận cuối / lạ
    const dys = R.dayun || [];
    const first = dys[0], last = dys[dys.length - 1];
    let why;
    if (first && age < first.startAge) why = `Bạn chưa vào đại vận đầu tiên — mở vận lúc ${first.startAge} tuổi (giai đoạn ấu thơ, nền vận chưa hình).`;
    else if (last && age >= last.startAge + 10) why = `Bạn đã qua đại vận cuối (${last.ganZhi}, kết ${last.startAge + 9} tuổi) — giai đoạn vãn 晚上, luận theo lưu niên/tháng.`;
    else why = 'Chưa xác định được đại vận cho độ tuổi này (có thể giờ sinh chưa chính xác — thử hiệu chỉnh trụ Giờ).';
    paras.push(why);
  } else {
    const motif = TONE_MOTIF[toneOf(dy.rating)] || TONE_MOTIF.binh;
    let stage = null, nayin = null;
    try { const dcs = dayunChangSheng(dayGan, R.dayun); stage = (dcs.items || []).find((it) => it.startAge === dy.startAge); } catch (e) {}
    try { const n = ganZhiNayin(dy.ganZhi); if (n) nayin = { name: n, ...(nayinInfo(n) || {}) }; } catch (e) {}
    const godVi = dy.zhiGod ? GOD_VI[dy.zhiGod] : (dy.gan ? GOD_VI[tenGod(dayGan, dy.gan)] : '');
    const theme = godVi && GOD_THEME[dy.zhiGod] ? GOD_THEME[dy.zhiGod] : '';
    const stageLine = stage ? ` Đại vận ở thế «${stage.stageVi}» (十二长生) — ${stage.desc || ''}` : '';
    const nayinLine = nayin ? `, nạp âm ${nayin.name}${nayin.meaning ? ' (' + nayin.meaning.slice(0, 60) + ')' : ''}` : '';
    paras.push(`Giai đoạn <b>${age} tuổi</b>, bạn đang bước đi trong đại vận <b>${dy.ganZhi}</b> (${dy.startAge}–${dy.startAge + 9} tuổi${nayinLine}). Đánh giá: <b>${dy.rating}</b> — ${motif.v}.${stageLine}${theme ? ` Sao chủ vận (chi) = ${godVi} → trọng tâm thập kỷ về <b>${theme}</b>.` : ''}`);
    paras.push(`Vì thế những năm này nên: <b>${motif.action}</b>.`);
  }

  // --- LƯU NIÊN (năm nay) ---
  const ln = (R.liunian || []).find((l) => l.isNow) || (R.liunian || []).find((l) => l.year === cur);
  phase.liunian = ln;
  if (ln) {
    const motif = TONE_MOTIF[toneOf(ln.rating)] || TONE_MOTIF.binh;
    const godVi = ln.gan ? GOD_VI[tenGod(dayGan, ln.gan)] : '';
    const dyAgree = dy && toneOf(dy.rating) === 'cat' && toneOf(ln.rating) === 'cat';
    const dyConflict = dy && toneOf(dy.rating) === 'hung' && toneOf(ln.rating) === 'cat';
    let bridge = '';
    if (dyAgree) bridge = ' Cả đại vận lẫn lưu niên đều CÁT → «运年相生», cơ hội được phóng đại, nên mạnh dạn.';
    else if (dyConflict) bridge = ' Đại vận khó nhưng năm nay CÁT → «年好不如运好» ngược: nắm lấy «cửa sổ» thuận lợi trong thập kỷ gian nan, tiến thủ vừa phải.';
    paras.push(`Năm nay (<b>${ln.year}</b>, ${ln.ganZhi}${godVi ? ' — can ' + godVi + ' năm' : ''}) đánh giá <b>${ln.rating}</b> (${ln.score}/100): ${motif.v}.${bridge}`);
  }

  // --- LƯU NGUYỆT (tháng này) ---
  let lyGz = null, lyGodVi = '';
  try {
    const ml = Solar.fromDate(new Date()).getLunar();
    lyGz = ml.getMonthGan() + ml.getMonthZhi();
    lyGodVi = GOD_VI[tenGod(dayGan, ml.getMonthGan())] || '';
    phase.liuyue = lyGz;
  } catch (e) {}
  if (lyGz) {
    paras.push(`Tháng này (${lyGz}${lyGodVi ? ' — ' + lyGodVi + ' tháng' : ''}) là «đơn vị hành động» gần nhất —查阅 lưu nguyệt chi tiết để chọn việc nên làm/tránh trong 4 tuần tới.`);
  }

  // --- NHÌN TRƯỚC: đại vận KẾ (look-ahead — «运好不如运旺», biết trước để chuẩn bị) ---
  const nextDy = dy ? (R.dayun || []).find((d) => d.startAge === dy.startAge + 10) : null;
  if (nextDy) {
    const yearsUntil = nextDy.startAge - age;
    const nextMotif = TONE_MOTIF[toneOf(nextDy.rating)] || TONE_MOTIF.binh;
    let nextStage = null, nextNayin = null, nextGodVi = '';
    try { const dcs = dayunChangSheng(dayGan, R.dayun); nextStage = (dcs.items || []).find((it) => it.startAge === nextDy.startAge); } catch (e) {}
    try { const n = ganZhiNayin(nextDy.ganZhi); if (n) nextNayin = { name: n, ...(nayinInfo(n) || {}) }; } catch (e) {}
    if (nextDy.gan) nextGodVi = GOD_VI[tenGod(dayGan, nextDy.gan)] || '';
    const curTone = toneOf(dy.rating), nextTone = toneOf(nextDy.rating);
    let bridge;
    if (curTone === 'hung' && nextTone === 'cat') bridge = ' → chuyển HƯỞNG LÊN: giai đoạn khó sắp qua, nên kiên nhẫn và chuẩn bị đón vận tốt';
    else if (curTone === 'cat' && nextTone === 'hung') bridge = ' → chuyển HƯỚNG XUỐNG: nên phòng bị, tích luỹ/fix nền TRƯỚC khi vận đổi';
    else if (nextTone === 'cat') bridge = ' → tiếp tục thuận lợi, có thể phát triển thêm';
    else bridge = ' → giữ mức, không biến động lớn';
    paras.push(`Nhìn trước: còn <b>${yearsUntil > 0 ? yearsUntil : 0} năm</b> (đến ${nextDy.startAge} tuổi, năm ${nextDy.startYear}) bạn chuyển sang đại vận <b>${nextDy.ganZhi}</b>${nextNayin ? ' (' + nextNayin.name + ')' : ''}${nextStage ? ', thế «' + nextStage.stageVi + '»' : ''}${nextGodVi ? ' — ' + nextGodVi + ' vận' : ''}, đánh giá <b>${nextDy.rating}</b> — ${nextMotif.v}${bridge}.`);
  }

  // --- Tổng luận + 源流 context ---
  const syn = R.synthesis || {};
  const yl = R.yuanliu;
  const tail = [];
  if (syn.gradeVi) tail.push(`nền mệnh xếp ${syn.gradeVi} (${syn.score || '?'}/100)`);
  if (yl) tail.push(`dòng khí 源流 ${yl.fullCycle ? '源远流长 (thuận)' : (yl.flowLen <= 1 ? 'khí trệ — tài năng cần vận mở dòng' : 'tương đối thông')}`);
  if (tail.length) paras.push(`Đặt trong bối cảnh: ${tail.join(' · ')}. Nhớ: mệnh là «thuận vận», thái độ & nỗ lực (《了凡》) vẫn là quyết định cuối.`);

  return { title: 'Tường thuật giai đoạn', paragraphs: paras, phase };
}
