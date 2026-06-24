// ============================================================================
//  GIAO TẾ & XÃ GIAO STRATEGY 社交策略 — COMMUNICATION BY ELEMENT
//  "Nói chuyện/giao dịch/đàm phán thế nào cho hiệu quả?" theo ngũ hành Nhật Chủ.
//  Nguồn: 五行性格学, 鬼谷子 反应篇, 黄帝内经 阴阳应象.
// ============================================================================
import { WX_VI } from './constants.js';

const WX_COMM = {
  木: {
    style: 'phát triển, khích lệ, xây dựng',
    strength: 'thuyết phục bằng tầm nhìn, khích lệ người khác phát triển, dùng ví dụ thiên nhiên, lạc quan',
    weakness: 'dễ cứng đầu/cãi, cứng nhắc, khó nhân nhượng khi thấy sai',
    bestWith: { 木: 'hài hòa cùng phát triển', 火: 'Mộc sinh Hỏa → bạn khích lệ, họ bùng nổ — cặp tốt', 土: 'khắc — cần kiên nhẫn, dùng thực tế thay lý thuyết', 金: 'bị khắc — tránh cứng đầu, mềm mỏng', 水: 'được sinh — lắng nghe, uyển chuyển' },
    phrases: ['"Cùng nhau phát triển"', '"Mình mở rộng nhé?"', '"Cơ hội này tốt cho cả hai"'],
    avoid: ['cứng đầu, cãi lý', 'ép buộc', 'quá trực tuyến gây tổn'],
    negotiation: 'dùng "sinh trưởng" — cho thấy cái lợi cho cả hai cùng phát triển; tránh ép buộc',
    conflict: 'rút lui tạm thời (như cây uốn trước gió), quay lại khi thời cơ tốt — KHÔNG cứng đầu',
  },
  火: {
    style: 'nhiệt huyết, truyền cảm hứng, bộc phát',
    strength: 'truyền cảm hứng, storytelling, năng lượng cao, làm người khác phấn khích',
    weakness: 'dễ nóng vội, nói quá nhanh, áp đặt cảm xúc, thiếu kiên nhẫn',
    bestWith: { 木: 'được sinh — lắng nghe ý tưởng của họ', 火: 'cả hai bùng cháy — cẩn thận quá phấn khích', 土: 'khắc — cần ổn định, giảm nhiệt độ', 金: 'khắc — cẩn thận sắc bén', 水: 'bị khắc — giảm hỏa, kiên nhẫn' },
    phrases: ['"Cùng làm thôi!"', '"Nhiệt huyết lên nào!"', "'Mình tin là được!'"],
    avoid: ['nóng vội ép quyết', 'áp đặt cảm xúc', 'quá ồn/áp đảo'],
    negotiation: 'dùng "đam mê" — cho thấy sự nhiệt thành; nhưng KIỂM SOÁT tốc độ, để đối phương có thời gian nghĩ',
    conflict: 'hạ nhiệt trước (đi xa, uống nước), quay lại sau — KHÔNG tranh cãi khi đang nóng',
  },
  土: {
    style: 'ổn định, tin cậy, thực tế',
    strength: 'đáng tin, kiên nhẫn, dùng dữ liệu/ví dụ thực tế, tạo an toàn cho người khác',
    weakness: 'chậm, bảo thủ, hay do dự, khó thay đổi',
    bestWith: { 火: 'được sinh — ấm áp, vui', 土: 'cả hai ổn nhưng chậm', 金: 'sinh — tổ chức, sắc bén', 木: 'bị khắc — cần cởi mở thay đổi', 水: 'khắc — kiểm soát, cần buông' },
    phrases: ['"Để mình kiểm tra kỹ"', '"Tin mình được"', '"Ổn định là trên hết"'],
    avoid: ['chậm quá mất cơ hội', 'cố thủ không thay đổi', 'nghi ngờ quá nhiều'],
    negotiation: 'dùng "uy tín" — cho bằng chứng, lịch sử, dữ liệu; KHÔNG vội — để thời gian chín',
    conflict: 'chờ cho tình hình ổn (không quyết lúc nóng) — sau đó nói chuyện bình tĩnh, thực tế',
  },
  金: {
    style: 'sắc bén, dứt khoát, kỷ luật',
    strength: 'rõ ràng, dứt khoát, nguyên tắc, thẳng thắn, hiệu quả',
    weakness: 'sắc quá gây tổn, cứng nhắc, thiếu tình cảm, hay phê bình',
    bestWith: { 土: 'được sinh — nền vững', 金: 'sắc cùng sắc — cẩn thận va', 水: 'sinh — nhu hòa', 木: 'khắc — cần mềm hơn', 火: 'bị khắc — giảm sắc' },
    phrases: ['"Quyết định đi"', '"Ngắn gọn"', '"Nguyên tắc là..."'],
    avoid: ['sắc bén gây mất lòng', 'quá cứng nguyên tắc', 'thiếu cảm xúc'],
    negotiation: 'dùng "kỷ luật" — đưa điều khoản rõ, deadline cụ thể; NHƯNG thêm chút mềm (để đối phương không thấy bị ép)',
    conflict: 'nói thẳng vấn đề (không vòng vo) — nhưng MỀM mỏng cách diễn đạt; dùng "tôi thấy" thay "bạn sai"',
  },
  水: {
    style: 'uyển chuyển, lắng nghe, sâu lắng',
    strength: 'linh hoạt, giỏi lắng nghe, thấu hiểu, đọc vị cảm xúc, thích nghi',
    weakness: 'dễ trôi, thiếu quyết đoán, hay úp mở, khó nắm bắt',
    bestWith: { 金: 'được sinh — rõ ràng, mạnh', Thủy: 'cả hai chảy — cần đích đến', 木: 'sinh — phát triển cùng', Hỏa: 'khắc — giảm lạnh', 土: 'bị khắc — cần vững' },
    phrases: ['"Mình hiểu"', "'Uyển chuyển nhé'", "'Để xem sao...'"],
    avoid: ['quá mập mờ, không dứt khoát', 'trôi theo mất phương hướng', 'giấu cảm xúc'],
    negotiation: 'dùng "linh hoạt" — đọc vị đối phương, thích nghi chiến thuật; nhưng CẦN CÓ ĐÍCH đến rõ',
    conflict: 'chảy quanh vấn đề (như nước vòng đá) — không va trực tiếp; thời gian sẽ giải quyết',
  },
};

/**
 * @returns {{ dmStyle, dmStrength, dmWeakness, dmBestWith, dmPhrases,
 *            dmAvoid, dmNegotiation, dmConflict, dungStyle, dungBestWith, advice }}
 */
export function socialStrategy(R) {
  const dmWx = R.chart.dayMaster.wx;
  const dungWx = R.yong.primary;

  const dm = WX_COMM[dmWx];
  const dung = WX_COMM[dungWx];

  const advice = `Giao tế theo Nhật Chủ ${WX_VI[dmWx]}: ${dm.style}. ` +
    `Mạnh: ${dm.strength}. Yếu: ${dm.weakness}. ` +
    `Đàm phán: ${dm.negotiation}. Xung đột: ${dm.conflict}. ` +
    `Bổ sung Dụng Thần (${WX_VI[dungWx]}): khi cần, chuyển sang phong cách ${dung.style} — ${dung.strength}.`;

  return {
    dmWx, dmVi: WX_VI[dmWx],
    dmStyle: dm.style, dmStrength: dm.strength, dmWeakness: dm.weakness,
    dmBestWith: dm.bestWith, dmPhrases: dm.phrases, dmAvoid: dm.avoid,
    dmNegotiation: dm.negotiation, dmConflict: dm.conflict,
    dungWx, dungVi: WX_VI[dungWx],
    dungStyle: dung.style, dungStrength: dung.strength,
    dungBestWith: dung.bestWith, dungNegotiation: dung.negotiation,
    advice, allComm: WX_COMM,
  };
}

export { WX_COMM };
