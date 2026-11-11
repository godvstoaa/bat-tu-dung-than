// ============================================================================
//  MIẾU THỜ (v4 · G4) — mỗi miếu một vị thần, một DỊCH VỤ BÓI RIÊNG + chat AI theo lá số (thay cho 12 điện giống hệt
//  nhau chỉ có lư hương). Module THUẦN: không DOM → test bằng node.
//  · GODS: thần → tên điện, thầy giữ miếu (MASTERS của fortune-npc.js), nghi thức riêng (ritual: mở trạm sẵn có).
//  · godOfTemple(key, ward): điện cung (lm:k) theo cung bát quái; điện Nội Thành (nb:i) theo bảng NB.
//  Cung ↔ thần theo tượng quẻ: Khảm (Thủy, hiểm) Quan Âm cứu khổ · Tốn (gió, lợi thị) Thần Tài · Khôn (mẹ, hôn phối)
//  Nguyệt Lão · Càn (trời, xét xử) Thành Hoàng · Đoài (khẩu, học thuyết) Văn Xương · Cấn (núi, đất) Thổ Địa ·
//  Chấn (Mộc, sinh khí) Dược Vương · Ly (Hỏa, bếp lửa) Táo Quân.
// ============================================================================

export const GODS = {
  quanam: { name: 'Quan Âm', hall: 'Quán Âm Các', master: 'quanam', ritual: 'xam', ritualLabel: '🎋 Xin xăm Quan Âm', lines: ['Xin xăm rồi nhờ ni sư giải theo lá số.', 'Lòng thành thì quẻ linh.', 'Mùng một, ngày rằm người đến xin xăm đông lắm.'] },
  thantai: { name: 'Thần Tài', hall: 'Miếu Thần Tài', master: 'thantai', ritual: 'lich', ritualLabel: '📅 Xem ngày tốt làm ăn', lines: ['Thắp nhang Thần Tài đầu ngày, buôn bán đắt hàng.', 'Lộc đến từ chữ tín.', 'Hỏi tài vận thì ngồi xuống đây.'] },
  nguyetlao: { name: 'Nguyệt Lão', hall: 'Miếu Nguyệt Lão', master: 'nguyetlao', ritual: 'hophon', ritualLabel: '💞 Xem hợp hôn', lines: ['Sợi chỉ hồng đã buộc thì không ai cắt được.', 'Xin duyên thì phải thật lòng.', 'Hỏi tuổi người thương đi, bà xem cho.'] },
  thanhhoang: { name: 'Thành Hoàng', hall: 'Miếu Thành Hoàng', master: 'thanhhoang', ritual: 'thaitue', ritualLabel: '🏮 An Thái Tuế · xem hạn năm', lines: ['Thành Hoàng giữ sổ cả thành.', 'Năm hạn thì làm việc thiện mà giải.', 'Đầu năm nhớ lên đây an Thái Tuế.'] },
  vanxuong: { name: 'Văn Xương', hall: 'Văn Xương Từ', master: 'vanxuong', ritual: 'ancổ', ritualLabel: '📚 Học Án Cổ (lá số kinh điển)', lines: ['Học trò đi thi hay ghé thắp hương.', 'Chữ nghĩa là của để dành.', 'Muốn học đọc lá số thì hỏi thầy Tế tửu.'] },
  thodia: { name: 'Thổ Địa', hall: 'Miếu Thổ Địa', master: 'thodia', ritual: 'compass', ritualLabel: '🧭 La bàn hướng nhà', lines: ['Đất lành chim đậu.', 'Mua đất làm nhà thì lên khấn Thổ Công.', 'Hướng nhà hợp mệnh thì gia đạo yên.'] },
  duocvuong: { name: 'Dược Vương', hall: 'Miếu Dược Vương', master: 'duocvuong', ritual: 'tra', ritualLabel: '🍵 Ngồi uống trà dưỡng sinh', lines: ['Thuận ngũ hành thì ít bệnh.', 'Bệnh thật thì đi thầy thuốc, ở đây chỉ dạy cách sống.', 'Sáng nhớ uống chén trà gừng.'] },
  taoquan: { name: 'Táo Quân', hall: 'Miếu Táo Quân', master: 'taoquan', ritual: 'lich', ritualLabel: '📅 Lịch ngày giờ', lines: ['Việc trong nhà ông Táo biết hết.', 'Hai mươi ba tháng Chạp tiễn ông Táo về trời.', 'Chọn ngày dọn nhà thì hỏi ở đây.'] },
};

export const GOD_OF_WARD = { kan: 'quanam', xun: 'thantai', kun: 'nguyetlao', qian: 'thanhhoang', dui: 'vanxuong', gen: 'thodia', zhen: 'duocvuong', li: 'taoquan' };
/** 4 điện Nội Thành (rooms.js TEMPLE_NB) */
export const GOD_OF_NB = ['thanhhoang', 'thodia', 'vanxuong', 'quanam'];

/** thần của điện theo khoá phòng: 'lm:k' (điện cung, ward = mã cung) | 'nb:i' (Nội Thành) */
export function godOfTemple(key, ward) {
  const k = String(key || '');
  if (k.startsWith('nb:')) return GOD_OF_NB[Number(k.slice(3)) % GOD_OF_NB.length];
  return GOD_OF_WARD[ward] || 'quanam';
}
