// Tên khách ngẫu nhiên kiểu Sansa ("Mây Thong Thả") + câu tĩnh tâm cho Lư Hương.

const NOUNS = ['Mây', 'Trúc', 'Suối', 'Gió', 'Sương', 'Lá', 'Trăng', 'Sen', 'Đá', 'Khói', 'Mưa', 'Tùng', 'Cỏ', 'Nắng', 'Sóng', 'Chim'];
const ADJS = ['Thong Thả', 'Lặng Lẽ', 'Chậm Rãi', 'Nhẹ Tênh', 'An Nhiên', 'Lơ Đãng', 'Hiền Hoà', 'Ung Dung', 'Mơ Màng', 'Tĩnh Tại', 'Lững Thững', 'Thảnh Thơi'];

export function randomName(rand = Math.random) {
  return `${NOUNS[Math.floor(rand() * NOUNS.length)]} ${ADJS[Math.floor(rand() * ADJS.length)]}`;
}

export const CALM_LINES = [
  'Hít vào thật chậm. Không có việc gì phải vội trong lúc nhang cháy.',
  'Nước chảy chỗ trũng, người an chỗ tĩnh.',
  'Việc hôm nay, làm hết lòng là đủ; kết quả để ngày mai lo.',
  'Một nén nhang — ba phút không nhìn điện thoại.',
  'Gió qua rặng trúc, trúc không giữ tiếng gió.',
  'Nghĩ về một người bạn biết ơn, chỉ cần nghĩ thôi.',
  'Mệnh do trời định một phần, phần còn lại do mình đi.',
  'Thả lỏng vai. Thả lỏng hàm. Thả lỏng hai bàn tay.',
  'Biết đủ là giàu.',
  'Làm việc thiện nhỏ hôm nay, không cần ai thấy.',
  'Cây có gốc mới nở cành xanh lá; nước có nguồn mới bể rộng sông sâu.',
  'Chậm một nhịp, nhìn rõ hơn một chút.',
  'Điều đáng lo nhất, thường chưa xảy ra.',
  'Nghỉ ngơi cũng là một phần của tiến bước.',
];
