// ============================================================================
//  TỔNG KẾ CẢI MỆNH 改命总纲 — PIPELINE "nghịch thiên" có logic đàng hoàng
//  Triết lý: số sinh ra xấu vẫn cải được — tỷ phú nhờ thầy "tăng số" chính bằng
//  việc PHỐI HỢP ĐA TẦNG (không gian + tên + thời + hành vi + thái tuế + làm công).
//  Đọc (tử bình + 盲派) → Định bệnh ưu tiên → Áp pháp theo thứ tự → Theo dõi.
// ============================================================================
import { analyzeMangpai } from './mangpai.js';
import { xuankongPan } from './xuankong.js';
import { WX_VI } from './constants.js';

/**
 * Sinh tổng kế cải mệnh — kết nối mọi module sẵn có.
 * @returns {{ diagnosis, layers, verdict, mangpai, xuankong }}
 */
export function gaimenhPlan(R, opts) {
  const { year = (opts && opts.year) } = {};
  const yong = R.yong;
  const syn = R.synthesis || {};
  const mangpai = analyzeMangpai(R);
  const xk = xuankongPan(opts && opts.year ? opts.year : (R.liunian && R.liunian[0] ? R.liunian[0].year : 2026));

  // ---- 1. CHẨN ĐOÁN: gom "bệnh" ưu tiên ----
  const problems = [];
  // Bệnh từ tổng luận
  if (syn.score != null && syn.score < 55) problems.push({ sev: 'cao', t: 'Mệnh cục thiên lệch', d: `Tổng luận ${syn.score}/100 — Dụng ${WX_VI[yong.primary]} thiếu lực.` });
  // Bệnh tổ hợp hung
  const xiongCombos = (syn.combos || []).filter((c) => c.tone === 'xiong');
  if (xiongCombos.length) problems.push({ sev: 'cao', t: 'Tổ hợp hung', d: xiongCombos.map((c) => c.vi).join(', ') + ' làm trọc cục.' });
  // Bệnh lưu niên hiện tại hung (nếu có)
  const lnNow = (R.liunian || []).find((l) => l.isNow);
  if (lnNow && lnNow.score < 0) problems.push({ sev: 'trung', t: `Lưu niên ${lnNow.year} bất lợi`, d: `${hanvietGZ(lnNow.ganZhi)} score ${lnNow.score}.` });
  // Bệnh 盲派 做功 thấp
  if (mangpai.score < 55) problems.push({ sev: 'trung', t: '盲派 做功 thấp', d: 'Tài quan phân tán/ít hợp — phú quý chậm.' });
  // Bệnh tài/thân
  if (!R.strength.strong && (R.wx.score[yong.relations.wealthWx] || 0) > (R.wx.score[yong.relations.sameWx] || 0) * 2) {
    problems.push({ sev: 'trung', t: 'Tài đa thân nhược', d: 'Tiền tới nhưng thân không nhậm được — dễ "tài qua tay".' });
  }
  if (!problems.length) problems.push({ sev: 'thấp', t: 'Mệnh tương đối cân', d: 'Không có bệnh lớn — tập trung vun Dụng/Hỷ + đón vận cát.' });

  // ---- 2. KẾ HOẠCH: áp pháp theo thứ tự ưu tiên ----
  const layers = [];
  layers.push({
    pri: 1, name: '🅰️ KHÔNG GIAN (玄空飞星 + 八宅)', kind: 'space',
    acts: [
      `Kích hoạt 旺 phương ${xk.wangFang.map((p) => p.palace).join('/')} (đương lệnh ${xk.currentStar.name}) — cửa/sảnh/văn phòng/phòng khách ở đây.`,
      `Tránh/phòng hung phương ${xk.xiongFang.slice(0, 3).map((p) => p.palace + '(' + p.info.name + ')').join(', ')} — không động thổ, đặt toilet/kho để "ấn" sát.`,
      `Theo 命卦 八宅 (mục Phong thủy nhà) chọn hướng cửa/giường hợp mình; ưu tiên phương giao điểm 八宅 cát ∩ 玄空 旺.`,
    ],
  });
  layers.push({
    pri: 2, name: '🅱️ TÊN (五格补 Dụng)', kind: 'name',
    acts: [
      `Đảm bảo tên (mục Học Tên) mang hành DỤNG ${WX_VI[yong.primary]} / HỶ ${WX_VI[yong.xi]} → BỔ MỆNH; nếu tên mang KỴ ${WX_VI[yong.ji]} → cân nhắc đổi chữ/bí danh dùng hành Dụng.`,
      `Tên khai sinh khó đổi thì dùng tên gọi/bút danh/địa danh kinh doanh mang hành Dụng để "tăng số".`,
    ],
  });
  layers.push({
    pri: 3, name: '🅲 THỜI (择日 + Lưu niên/月 cát)', kind: 'timing',
    acts: [
      `Việc lớn (lập nghiệp/cưới/mua nhà/ký hợp đồng) làm vào lưu niên CÁT mang Dụng ${WX_VI[yong.primary]}; tránh lưu niên hung${lnNow ? ` (hiện ${lnNow.year} = ${lnNow.rating})` : ''}.`,
      `Dùng mục Chọn Ngày Lành (建除十二神 + tránh xung tuổi) cho từng việc cụ thể.`,
      `Cát tháng: xem mục Lưu Nguyệt, ưu tiên tháng CÁT trong năm để ra quyết định/hành động.`,
    ],
  });
  layers.push({
    pri: 4, name: '🅳 THÁI TUẾ & HOÁ GIẢI (nếu phạm)', kind: 'taisui',
    acts: [
      `Kiểm tra mục Thái Tuế — nếu phạm (${['值','冲','刑','破','害'].join('/')}) → làm 7 pháp hoá giải sau Lập Xuân.`,
      `Tổ hợp hung (${xiongCombos.length ? xiongCombos.map((c) => c.vi).join('/') : 'không'}) → hóa: 伤官见官 dùng Ấn chế; 枭夺食 dùng Tài chế Kiêu; v.v. (xem mục Nghịch Thiên Cải Mệnh).`,
    ],
  });
  layers.push({
    pri: 5, name: '🅴 LÀM CÔNG TĂNG PHÚ QUÝ (盲派)', kind: 'mangpai',
    acts: [
      `盲派: "hợp" = công lớn → tăng 做功 bằng HỢP TÁC/KẾT NỐI/quan hệ (${mangpai.fuguui}). Dù mệnh thấp, năng lực "lấy tài quan về主位" vẫn tăng được qua mạng lưới.`,
      `${mangpai.notes[mangpai.notes.length - 2] || '(không có ghi chú)'}`,
    ],
  });
  layers.push({
    pri: 6, name: '🅵 HÀNH VI — TÍCH ÂM ĐỨC (了凡四训) [CỐT LÕI]', kind: 'virtue',
    acts: [
      `《了凡四训》: số KHÔNG bất biến — TÍCH ÂM ĐỨC (hành thiện không đồ báo) là pháp DUY NHẤT thật sự "nghịch thiên". Trên đây chỉ là "thuận vận".`,
      `Sửa lỗi (改过) + khiêm đức (谦德) + lập chí hướng — hệ thống vận hành tốt thì phong thủy mới phát huy.`,
    ],
  });

  // ---- 3. KẾT LUẬN ----
  const verdict = `Mệnh ${syn.gradeVi || ''} (${syn.score || '?'}/100) KHÔNG là số phận cố định. ` +
    `Bệnh ưu tiên: ${problems[0].t}. ` +
    `Áp theo thứ tự: KHÔNG GIAN → TÊN → THỜI → THÁI TUẾ → LÀM CÔNG → TÍCH ĐỨC. ` +
    (syn.score != null && syn.score < 55
      ? `Mệnh thấp vẫn cải được (như con nhà tỷ phú nhờ thầy "tăng số") — phần "thuận vận" trên giúp đỡ + giảm xấu; phần "tích đức" mới thật sự đổi số cốt lõi.`
      : `Mệnh khá — phần "thuận vận" giúp đón cát đầy đủ; vẫn cần tích đức giữ lâu.`);

  return { diagnosis: problems, layers, verdict, mangpai, xuankong: xk };
}

function hanvietGZ(gz) { return gz; }
