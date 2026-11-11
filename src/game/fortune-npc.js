// ============================================================================
//  THẦY BÓI NPC — trục chính của game v4: người chơi tự gõ câu hỏi, thầy (AI) trả lời theo LÁ SỐ CỦA CHÍNH HỌ.
//  Module THUẦN (không DOM, không mạng) → test bằng node (scripts/test-game-fortune.mjs).
//  · MASTERS: bảng thầy — tên, vai (persona của npc-personas.js, null = giọng «ông thầy» mặc định của ai.js),
//    chuyên môn (focus — ghép vào câu hỏi để AI tra đúng phần lá số), lời chào, câu gợi ý.
//  · chartSource(state): nguồn lá số đang dùng — kiếp luân hồi (lá số hư cấu) nếu có, không thì bát tự thật.
//    Ngày sinh thật CHỈ ở máy: lá số tính tại client, AI nhận bản tóm tắt (buildChartBrief), không gửi lên máy chủ game.
//  · Hạn mức khách (chưa đăng nhập): 10 câu / ngày, đếm trên máy. Tài khoản: không giới hạn (máy chủ vẫn chặn 30 / phút / IP).
// ============================================================================

export const GUEST_DAILY = 10;

export const MASTERS = {
  tubinh: {
    name: 'Thầy Tử Bình', persona: 'thay_tubinh', focus: 'bát tự tứ trụ, dụng thần, đại vận, lưu niên',
    greet: 'Ngồi đi. Lá số của khách thầy đã bày trên bàn. Muốn hỏi chuyện gì — công danh, tiền bạc, gia đạo hay sức khỏe?',
    starters: ['Năm nay vận của tôi thế nào?', 'Tôi hợp làm nghề gì?', 'Tính cách thật của tôi ra sao?', 'Đại vận hiện tại tốt hay xấu?'],
  },
  tuvi: {
    name: 'Khổng tiên sinh', persona: 'khong_tiensinh', focus: 'lá số tử vi đẩu số, mệnh cung, các cung, sao chiếu',
    greet: 'Khách ngồi. Ta xem tử vi không lấy tiền — chỉ lấy câu hỏi thật. Cung nào trong đời khách đang làm khách băn khoăn?',
    starters: ['Cung mệnh của tôi có sao gì?', 'Cung tài bạch nói gì về tiền của tôi?', 'Cung phu thê của tôi thế nào?', 'Năm nay sao nào chiếu mệnh tôi?'],
  },
  phongthuy: {
    name: 'Thầy Phong Thủy', persona: null, focus: 'phong thủy nhà ở theo mệnh: bát trạch, hướng nhà, hướng cửa, kê giường, bàn làm việc, bếp',
    greet: 'Mệnh quái của khách thầy đã tính. Khách đang ở nhà hướng nào, hay định mua, định sửa nhà?',
    starters: ['Nhà tôi nên quay hướng nào?', 'Giường ngủ kê ở đâu là tốt?', 'Bàn làm việc nên đặt hướng nào?', 'Màu sắc nào hợp mệnh tôi?'],
  },
  trachnhat: {
    name: 'Trương Thiên Sư', persona: 'truong_thiensu', focus: 'chọn ngày giờ tốt theo lá số, giờ hoàng đạo, hạn năm, Thái Tuế, giải hạn',
    greet: 'Việc lớn chọn ngày, việc nhỏ chọn giờ. Khách định làm việc gì, vào khoảng thời gian nào?',
    starters: ['Tháng này ngày nào tốt để khai trương?', 'Năm nay tôi có phạm Thái Tuế không?', 'Hạn năm nay của tôi cần lưu ý gì?', 'Giờ nào trong ngày hợp với tôi?'],
  },
  nguyetlao: {
    name: 'Bà Nguyệt Lão', persona: null, focus: 'tình duyên, hôn nhân, hợp tuổi, thời điểm gặp duyên theo lá số',
    greet: 'Sợi chỉ hồng của cháu bà thấy rồi. Cháu hỏi về người đang thương, hay hỏi bao giờ mới gặp?',
    starters: ['Bao giờ tôi gặp được duyên?', 'Tôi hợp với người tuổi gì?', 'Hôn nhân của tôi có bền không?', 'Người tôi cần tìm có tính cách thế nào?'],
  },
  gieoque: {
    name: 'Phương sĩ Vô Danh', persona: 'phuong_si', focus: 'gieo quẻ Mai Hoa, Lục Hào cho một việc cụ thể, đối chiếu với lá số',
    greet: 'Có việc gì đang vướng thì nói ra, ta gieo cho một quẻ. Hỏi một việc cho rõ — đừng hỏi cả đời.',
    starters: ['Gieo cho tôi một quẻ về công việc sắp tới.', 'Việc tôi đang tính có nên làm không?', 'Quẻ hôm nay của tôi thế nào?', 'Chuyến đi sắp tới có thuận không?'],
  },
  // --- thần chủ các miếu (temples.js) — mỗi miếu một dịch vụ bói riêng ---
  quanam: {
    name: 'Ni sư Diệu Âm', persona: 'dieu_am', focus: 'giải xăm Quan Âm theo lá số, tâm an, gia đạo, việc đang lo',
    greet: 'A Di Đà Phật. Thí chủ xin được quẻ xăm nào thì đọc cho bần ni nghe, hoặc cứ kể điều đang lo.',
    starters: ['Giải giúp tôi quẻ xăm vừa xin.', 'Gia đạo tôi năm nay có yên không?', 'Tôi nên buông bỏ điều gì?', 'Việc tôi đang lo sẽ ra sao?'],
  },
  thantai: {
    name: 'Ông Từ miếu Thần Tài', persona: null, focus: 'tài vận theo lá số: sao tài, lưu niên tài lộc, cách giữ tiền, thời điểm làm ăn',
    greet: 'Thắp nén nhang cho Thần Tài rồi ngồi đây. Khách muốn hỏi lộc buôn bán, lương bổng hay chuyện đầu tư?',
    starters: ['Năm nay tài lộc của tôi thế nào?', 'Tôi hợp kiếm tiền bằng nghề gì?', 'Tháng nào nên làm ăn lớn?', 'Làm sao để giữ được tiền?'],
  },
  thanhhoang: {
    name: 'Phán quan Thôi', persona: 'phan_quan', focus: 'hạn năm, Thái Tuế, sao hạn, cách giải hạn theo lá số',
    greet: 'Sổ hạn năm nay của khách ta đã mở. Hỏi đi — ta nói thẳng chỗ nào cần giữ.',
    starters: ['Năm nay tôi có phạm Thái Tuế không?', 'Hạn năm nay của tôi nặng ở đâu?', 'Tôi nên làm gì để giải hạn?', 'Tháng nào cần cẩn thận nhất?'],
  },
  vanxuong: {
    name: 'Tế tửu Chu Văn Trinh', persona: 'te_tuu', focus: 'học hành, thi cử, văn chương, công danh theo lá số; dạy cách đọc bát tự / tử vi',
    greet: 'Học trò đến hỏi việc thi, hay muốn học đọc lá số? Hỏi gì cũng được, miễn hỏi cho thật.',
    starters: ['Tôi học ngành gì thì hợp?', 'Kỳ thi sắp tới của tôi thế nào?', 'Dạy tôi cách đọc dụng thần.', 'Văn tinh của tôi nằm ở đâu?'],
  },
  thodia: {
    name: 'Ông Thổ Địa', persona: null, focus: 'phong thủy nhà ở, đất đai, mua bán nhà, hướng nhà hợp mệnh',
    greet: 'Đất có Thổ Công, nhà có chủ. Khách định mua nhà, sửa nhà hay hỏi hướng nhà đang ở?',
    starters: ['Nhà tôi hướng nào là hợp?', 'Năm nay có nên mua nhà không?', 'Sửa nhà tháng nào thì tốt?', 'Cửa chính nhà tôi nên quay đâu?'],
  },
  duocvuong: {
    name: 'Đan Đỉnh chân nhân', persona: 'dan_dinh', focus: 'sức khỏe theo ngũ hành lá số (thể tạng, mùa cần giữ), không khuyên y tế thật',
    greet: 'Lò ta giờ chỉ nấu cháo gừng. Ngũ hành của khách lệch chỗ nào thì ta nói cách sống cho thuận — còn bệnh thật thì đi thầy thuốc.',
    starters: ['Ngũ hành của tôi thiếu gì?', 'Mùa nào tôi cần giữ sức khỏe?', 'Tôi nên ăn uống thế nào cho hợp mệnh?', 'Tính khí tôi nóng nảy là do đâu?'],
  },
  taoquan: {
    name: 'Ông Táo', persona: null, focus: 'chọn ngày giờ cho việc lớn trong nhà: cưới hỏi, nhập trạch, khai trương, động thổ',
    greet: 'Việc trong nhà ông Táo biết hết. Khách sắp làm việc lớn gì — cưới hỏi, dọn nhà, khai trương?',
    starters: ['Tháng tới ngày nào tốt để dọn nhà?', 'Năm nay có nên cưới không?', 'Ngày nào hợp khai trương với tuổi tôi?', 'Giờ tốt để xuất hành là giờ nào?'],
  },
};

/** thầy gắn với trạm / sảnh (stations.js) — mở trạm là mở thẳng khung chat */
export const MASTER_OF_STATION = { thay: 'tubinh', tuvi: 'tuvi', compass: 'phongthuy', duongtrach: 'phongthuy', trach: 'trachnhat', thaitue: 'trachnhat', hophon: 'nguyetlao', que: 'gieoque', cachcuc: 'tubinh', dieuhau: 'tubinh', tuongphap: 'gieoque' };

/**
 * Nguồn lá số đang dùng (đối tượng cho stations.chartOf / engine analyze): { year, month, day, hour, minute, gender, fictional? }.
 * Kiếp luân hồi → lá số hư cấu Âm phủ cấp; không thì bát tự thật state.player.birth. Không có → null.
 */
export function chartSource(state) {
  const p = state?.player;
  const inc = p?.incarnation;
  if (inc && inc.year) return { year: inc.year, month: inc.month, day: inc.day, hour: inc.hour, minute: inc.minute, gender: inc.gender || p?.birth?.gender || 'nam', fictional: true };
  const b = p?.birth;
  if (!b || !b.y) return null;
  return { year: b.y, month: b.m, day: b.d, hour: b.hourUnknown ? null : b.h, minute: b.hourUnknown ? null : b.mi, gender: b.gender || 'nam' };
}

/** câu gửi AI: ghép chuyên môn của thầy để phần tra cứu lá số (section-RAG) bám đúng mảng */
export function framedQuestion(masterId, q) {
  const m = MASTERS[masterId];
  const text = String(q || '').trim().slice(0, 300);
  return m ? `[Hỏi ${m.name} — chuyên ${m.focus}] ${text}` : text;
}

// --- hạn mức khách ---------------------------------------------------------------------------------------
/** quota: { day, n } (lưu localStorage ở UI). Trả { ok, left, next } — next là bản ghi mới nếu ok */
export function useGuestQuota(quota, today, loggedIn) {
  if (loggedIn) return { ok: true, left: Infinity, next: quota };
  const q = quota && quota.day === today ? quota : { day: today, n: 0 };
  if (q.n >= GUEST_DAILY) return { ok: false, left: 0, next: q };
  const next = { day: today, n: q.n + 1 };
  return { ok: true, left: GUEST_DAILY - next.n, next };
}
export function guestLeft(quota, today, loggedIn) {
  if (loggedIn) return Infinity;
  return GUEST_DAILY - (quota && quota.day === today ? quota.n : 0);
}
